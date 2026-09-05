'use strict';
const {randomInt, randomUUID, createHash} = require('node:crypto');
const C = require('./core');
const ROOT_EMAIL = 'chimhinhin@gmail.com';
const MAX_MEMBERS = 100, MAX_DELIVERIES = 140;
const fail = (message, publicCode = 'failed-precondition') => { throw Object.assign(new Error(message), {publicCode}); };
const id = value => { if (typeof value !== 'string' || !/^[\w-]{1,100}$/.test(value)) fail('編號格式不正確','invalid-argument'); return value; };
const code = value => { const s = String(value || '').trim().toUpperCase(); if (!/^[A-Z]{5}$/.test(s)) fail('帳戶編號必須是五個英文字母','invalid-argument'); return s; };
const text = (v, min, max, label) => { try { return C.cleanText(v,min,max,label); } catch(e) { fail(e.message,'invalid-argument'); } };
const bool = v => { if (typeof v !== 'boolean') fail('開關數值無效','invalid-argument'); return v; };
const letters = n => Array.from({length:n}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[randomInt(26)]).join('');
const hash = s => createHash('sha256').update(s).digest('hex').slice(0,32);
const unique = arr => [...new Set(Array.isArray(arr) ? arr : [])];

// Staged writes keep all Firestore reads before writes and make commands fully atomic.
class Session {
  constructor(db, tx) { this.db=db; this.tx=tx; this.cache=new Map(); this.writes=new Map(); }
  async get(path) {
    if (this.writes.has(path)) return this.writes.get(path);
    if (!this.cache.has(path)) { const s=await this.tx.get(this.db.doc(path)); this.cache.set(path,s.exists?s.data():null); }
    return this.cache.get(path);
  }
  put(path,data) { this.writes.set(path,data); }
  async patch(path,data) { this.put(path,{...await this.get(path),...data}); }
  async scan(path, filters=[], max=201) {
    let q=this.db.collection(path); for (const [field,op,value] of filters) q=q.where(field,op,value);
    const snap=await this.tx.get(q.limit(max));
    return snap.docs.map(d => ({...d.data(),id:d.id}));
  }
  flush() { if (this.writes.size>490) fail('此操作涉及太多資料，請縮小範圍'); for(const [p,d] of this.writes) this.tx.set(this.db.doc(p),d); }
}

function createService(db, clock=Date.now) {
  return async function command(auth, input) {
    const uid=id(auth.uid), d=input && typeof input==='object'?input:{};
    const action=String(d.action || ''), now=clock();
    const root=auth.token?.email === ROOT_EMAIL && auth.token?.email_verified === true;
    // Reusing a request key returns its previous successful result (double taps / retries).
    const requestId=id(d.requestId || randomUUID());
    return db.runTransaction(async tx => {
      const s=new Session(db,tx);
      const memoPath=`collab_requests/${uid}_${requestId}`;
      const memo=await s.get(memoPath);
      if (memo) { if(memo.action!==action) fail('操作編號已使用'); return memo.result; }
      const accountPath=`collab_accounts/${uid}`;
      let me=await s.get(accountPath);
      const quotaPath=`collab_limits/${uid}`;
      const quota=await s.get(quotaPath) || {};
      const windowId=Math.floor(now/60000), day=Math.floor(now/86400000);
      const attempts=quota.window===windowId?(quota.attempts||0):0;
      // Applies to successful commands; failed lookups return a normal not-found result below.
      if(attempts>=50) fail('操作太頻密，請一分鐘後再試','resource-exhausted');
      let daily=quota.day===day?(quota.daily||0):0;
      if (action!=='bootstrap' && !me) fail('請先啟用帳戶編號');
      const system=await s.get('system_settings/config');
      if(!root && (system?.blacklistedEmails?.includes(auth.token?.email) && system.blacklistEnabled)) fail('帳戶已被停權','permission-denied');
      if(!root && system?.whitelistEnabled && !system.allowedEmails?.includes(auth.token?.email)) fail('帳戶未在允許名單內','permission-denied');
      if(!root && system?.maintenanceMode && system.maintenanceMode!=='normal') fail('系統維護中，請稍後再試','unavailable');
      const restricted=me?.disabled===true;
      const permittedWhileDisabled=['bootstrap','inboxRead','preferences','leaveGroup','respond','block','report'];
      if(restricted && !root && !permittedWhileDisabled.includes(action)) fail('帳戶協作功能已被管理員暫停','permission-denied');
      const person=async target => await s.get(`collab_accounts/${id(target)}`);
      const group=async gid => { const g=await s.get(`collab_groups/${id(gid)}`); if(!g) fail('群組不存在'); return g; };
      const requireManager=g => { if(!root && !C.canManage(g,uid)) fail('只有群組管理員可以操作','permission-denied'); };
      const requireMember=g => { if(!g.members.includes(uid)) fail('你已不在這個群組','permission-denied'); };
      const publishAllowed=() => { if(!root && (me?.canPublish===false || restricted)) fail('發放權限已被暫停','permission-denied'); if(daily>=60 && !root) fail('今日已達發放／邀請上限','resource-exhausted'); daily++; };
      const blocked=(a,b) => !!(a?.blocked?.includes(b?.uid) || b?.blocked?.includes(a?.uid));
      const task=async aid => { const a=await s.get(`collab_assignments/${id(aid)}`); if(!a) fail('發放項目不存在'); return a; };
      const inbox=async (to, key, data) => s.put(`collab_inbox/${to}/entries/${key}`,{...data,id:key,toUid:to,read:false,createdAt:now});
      const prefs=async (who,gid) => await s.get(`collab_preferences/${who}/groups/${gid}`) || {sync:false,notify:true,since:now,pinned:false,archived:false};
      const copy=async (a,who,force=false) => {
        const p=`users/${who}/items/collab_${a.id}`, old=await s.get(p);
        const preference=a.groupId?await prefs(who,a.groupId):{sync:true,since:0};
        if(a.kind!=='notice' && (force || C.shouldSync(a,preference,old))) s.put(p,C.project(a,old,now));
      };
      const addMember=async (g,target) => {
        if(g.state!=='active') fail('群組已暫停加入');
        if(g.banned?.includes(target)) fail('此帳戶不可加入群組','permission-denied');
        if(!g.members.includes(target) && g.members.length>=MAX_MEMBERS) fail('群組已達 100 人上限');
        const a=await person(target); if(!a || a.disabled) fail('此帳戶暫時不可加入');
        s.put(`collab_groups/${g.id}`,{...g,members:unique([...g.members,target]),memberNames:{...g.memberNames,[target]:a.name},updatedAt:now});
        const p=`collab_preferences/${target}/groups/${g.id}`;
        if(!await s.get(p)) s.put(p,{sync:true,notify:true,since:now,pinned:false,archived:false});
      };
      const validateAudience=async payload => {
        const gids=unique(payload.groupIds).map(id), codes=unique(payload.codes).map(code);
        if((gids.length===0)===(codes.length===0)) fail('請選擇群組或帳戶編號其中一種發放方式','invalid-argument');
        if(gids.length>3 || codes.length>20) fail('每次最多三個群組或二十個帳戶');
        const targets=[];
        if(gids.length) for(const gid of gids) {
          const g=await group(gid);
          if(!C.canPublish(g,uid)) fail('你沒有此群組的發放權限，或群組已凍結','permission-denied');
          const selected=unique(payload.memberIds).map(id);
          if(selected.length && gids.length!==1) fail('指定成員只適用於單一群組');
          if(selected.some(x=>!g.members.includes(x))) fail('指定成員已不在群組');
          const recipients=[];
          for(const member of (selected.length?selected:g.members)) { const a=await person(member); if(a && !a.disabled && !blocked(me,a)) recipients.push(member); }
          targets.push({group:g,recipients});
        } else {
          const recipients=[];
          for(const c of codes) {
            const map=await s.get(`collab_codes/${c}`); const a=map?await person(map.uid):null;
            if(!a || a.disabled || blocked(me,a)) fail('部分帳戶無法接收，請檢查編號或封鎖設定');
            recipients.push(a.uid);
          }
          targets.push({group:null,recipients:unique(recipients)});
        }
        if(targets.reduce((n,t)=>n+t.recipients.length,0)>MAX_DELIVERIES) fail('每次最多 140 次投遞，請分開發放');
        return targets;
      };
      let result={ok:true};
      if(action==='bootstrap') {
        if(!me) {
          let c; for(let n=0;n<30;n++) { const candidate=letters(5); if(!await s.get(`collab_codes/${candidate}`)) {c=candidate;break;} }
          if(!c) fail('暫時未能分配編號，請重試');
          const profile=await s.get(`users_public/${uid}`);
          me={uid,code:c,name:String(profile?.displayName || auth.token?.name || '同學').slice(0,60),canPublish:true,disabled:false,blocked:[],createdAt:now};
          s.put(accountPath,me); s.put(`collab_codes/${c}`,{uid,createdAt:now});
        } else {
          const profile=await s.get(`users_public/${uid}`);
          if(profile?.displayName && profile.displayName!==me.name) {me={...me,name:String(profile.displayName).slice(0,60)};s.put(accountPath,me);}
        }
        result={ok:true,account:me};
      } else if(action==='lookup') {
        const mapping=await s.get(`collab_codes/${code(d.code)}`);
        const a=mapping?await person(mapping.uid):null;
        result={ok:true,person:a && !a.disabled && !blocked(me,a)?{uid:a.uid,code:a.code,name:a.name}:null};
      } else if(action==='createGroup') {
        publishAllowed();
        const mine=await s.scan('collab_groups',[['ownerUid','==',uid]],11);
        if(mine.length>=10) fail('每人最多建立十個群組');
        let c; for(let n=0;n<30;n++) {const candidate=`G-${letters(6)}`; if(!await s.get(`collab_groupCodes/${candidate}`)){c=candidate;break;}}
        if(!c) fail('未能分配群組編號');
        const gid=randomUUID(), name=text(d.name,1,60,'群組名稱');
        s.put(`collab_groups/${gid}`,{id:gid,name,description:text(d.description||'',0,300,'群組簡介'),code:c,ownerUid:uid,members:[uid],managers:[],memberNames:{[uid]:me.name},banned:[],allowMemberPublish:true,state:'active',createdAt:now,updatedAt:now});
        s.put(`collab_groupCodes/${c}`,{groupId:gid});
        s.put(`collab_preferences/${uid}/groups/${gid}`,{sync:true,notify:true,since:now,pinned:false,archived:false});
        result={ok:true,groupId:gid};
      } else if(action==='invite') {
        publishAllowed(); const g=await group(d.groupId);requireManager(g);
        if(g.state!=='active') fail('群組已凍結');
        const map=await s.get(`collab_codes/${code(d.code)}`), a=map?await person(map.uid):null;
        if(!a || a.disabled || blocked(me,a)) fail('找不到可邀請的帳戶');
        if(g.members.includes(a.uid)) fail('對方已在群組');
        if(g.banned?.includes(a.uid)) fail('對方已被移出並禁止重加入');
        const key=`invite_${g.id}_${uid}`, prior=await s.get(`collab_inbox/${a.uid}/entries/${key}`);
        if(prior?.status==='pending') fail('已有待處理邀請');
        if(prior && now-prior.createdAt<86400000) fail('同一邀請請隔日再發送');
        await inbox(a.uid,key,{kind:'group_invite',status:'pending',groupId:g.id,actorUid:uid,actorName:me.name,title:`邀請加入 ${g.name}`,expiresAt:now+7*86400000});
      } else if(action==='joinGroup') {
        publishAllowed(); const gc=String(d.code||'').trim().toUpperCase();
        if(!/^G-[A-Z]{6}$/.test(gc)) fail('群組編號格式為 G-XXXXXX','invalid-argument');
        const mapping=await s.get(`collab_groupCodes/${gc}`), g=mapping?await group(mapping.groupId):null;
        if(!g || g.state!=='active') {result={ok:false,message:'找不到開放加入的群組'};}
        else {
          if(g.members.includes(uid)) fail('你已在群組');
          if(g.banned?.includes(uid) || blocked(me,await person(g.ownerUid))) fail('暫時未能申請加入');
          const key=`join_${g.id}_${uid}`, prior=await s.get(`collab_inbox/${g.ownerUid}/entries/${key}`);
          if(prior?.status==='pending') fail('申請正在等候審批');
          if(prior && now-prior.createdAt<86400000) fail('同一申請請隔日再發送');
          await inbox(g.ownerUid,key,{kind:'join_request',status:'pending',groupId:g.id,actorUid:uid,actorName:me.name,title:`${me.name} 申請加入 ${g.name}`,expiresAt:now+7*86400000});
        }
      } else if(action==='respond') {
        const path=`collab_inbox/${uid}/entries/${id(d.entryId)}`, entry=await s.get(path);
        if(!entry || entry.status!=='pending') fail('此邀請已處理');
        const accept=bool(d.accept);
        if(accept && (entry.expiresAt<now || restricted)) fail('邀請已到期或帳戶暫停使用');
        if(accept && blocked(me,await person(entry.actorUid))) fail('對方已被封鎖');
        if(accept && entry.kind==='group_invite') {const g=await group(entry.groupId);if(!C.canManage(g,entry.actorUid)) fail('邀請人的管理權限已失效');await addMember(g,uid);}
        else if(accept && entry.kind==='join_request') {const g=await group(entry.groupId);requireManager(g);await addMember(g,entry.actorUid);}
        else if(accept && entry.kind==='direct') {
          const a=await task(entry.assignmentId);
          if(a.state!=='active') fail('發放已撤回');
          if(!a.audience.includes(uid)) fail('你不在接收名單','permission-denied');
          const updated={...a,acceptedUids:unique([...a.acceptedUids,uid])};
          s.put(`collab_assignments/${a.id}`,updated); await copy(updated,uid,true);
        }
        s.put(path,{...entry,status:accept?'accepted':'rejected',read:true,respondedAt:now});
        if(['group_invite','join_request','direct'].includes(entry.kind)) await inbox(entry.actorUid,`response_${hash(path)}_${now}`,{kind:'system',status:'info',actorUid:uid,actorName:me.name,title:`${me.name} 已${accept?'接受':'拒絕'}：${entry.title}`});
      } else if(action==='preferences') {
        const g=await group(d.groupId);requireMember(g);
        const path=`collab_preferences/${uid}/groups/${g.id}`, prev=await prefs(uid,g.id), next={...prev};
        for(const key of ['sync','notify','pinned','archived']) if(d[key]!==undefined) next[key]=bool(d[key]);
        if(next.sync && !prev.sync) next.since=now;
        s.put(path,next);
        if(d.includeExisting===true && next.sync) {
          const list=await s.scan('collab_assignments',[['groupId','==',g.id]],201);
          if(list.length>200) fail('群組紀錄較多，請在群組逐份加入；新功課同步設定未變');
          const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
          for(const a of list) if(a.audience.includes(uid) && a.state==='active' && a.dueDate>=today) await copy(a,uid,true);
        }
      } else if(action==='groupUpdate') {
        const g=await group(d.groupId);requireManager(g);
        if(g.state==='frozen' && !root) fail('群組已被總管理員凍結');
        const next={...g,updatedAt:now};
        if(d.name!==undefined) next.name=text(d.name,1,60,'群組名稱');
        if(d.description!==undefined) next.description=text(d.description,0,300,'群組簡介');
        if(d.allowMemberPublish!==undefined) next.allowMemberPublish=bool(d.allowMemberPublish);
        s.put(`collab_groups/${g.id}`,next);
      } else if(action==='memberRole' || action==='removeMember' || action==='transferOwner') {
        const g=await group(d.groupId), target=id(d.uid);requireManager(g);
        if(!g.members.includes(target)) fail('成員已離開');
        if(g.state==='frozen' && !root) fail('群組已凍結');
        if(action==='memberRole') {
          if(g.ownerUid!==uid && !root) fail('只有群主可設定管理員','permission-denied');
          if(target===g.ownerUid) fail('不可更改群主角色');
          s.put(`collab_groups/${g.id}`,{...g,managers:d.manager===true?unique([...g.managers,target]):g.managers.filter(x=>x!==target),updatedAt:now});
        } else if(action==='transferOwner') {
          if(g.ownerUid!==uid && !root) fail('只有群主可轉移擁有權','permission-denied');
          if(target===g.ownerUid) fail('對方已是群主');
          s.put(`collab_groups/${g.id}`,{...g,ownerUid:target,managers:unique([...g.managers.filter(x=>x!==target),g.ownerUid]),updatedAt:now});
        } else {
          if(target===g.ownerUid || (g.managers.includes(target) && g.ownerUid!==uid && !root)) fail('不能移除此成員','permission-denied');
          s.put(`collab_groups/${g.id}`,{...g,members:g.members.filter(x=>x!==target),managers:g.managers.filter(x=>x!==target),banned:unique([...(g.banned||[]),target]),updatedAt:now});
          await inbox(target,`removed_${g.id}_${now}`,{kind:'system',status:'info',actorUid:uid,actorName:me.name,title:`你已被移出 ${g.name}；個人紀錄仍保留`});
        }
      } else if(action==='leaveGroup') {
        const g=await group(d.groupId);requireMember(g);
        if(g.ownerUid===uid) fail('群主請先轉移擁有權');
        s.put(`collab_groups/${g.id}`,{...g,members:g.members.filter(x=>x!==uid),managers:g.managers.filter(x=>x!==uid),updatedAt:now});
      } else if(action==='preview' || action==='publish') {
        const targets=await validateAudience(d);
        let p;try {p=C.payload(d);}catch(e){fail(e.message,'invalid-argument');}
        const receivers=targets.flatMap(t=>t.recipients);
        const summary={count:receivers.length,uniqueCount:unique(receivers).length,groups:targets.filter(t=>t.group).map(t=>({id:t.group.id,name:t.group.name,count:t.recipients.length}))};
        if(action==='preview') result={ok:true,...summary};
        else {
          publishAllowed(); const ids=[];
          for(const [index,target] of targets.entries()) {
            const aid=`${uid}_${requestId}_${index}`, g=target.group;
            const a={...p,id:aid,ownerUid:uid,authorName:me.name,groupId:g?.id||'',groupName:g?.name||'',audience:target.recipients,acceptedUids:[],version:1,state:'active',createdAt:now,updatedAt:now};
            s.put(`collab_assignments/${aid}`,a);ids.push(aid);
            for(const to of target.recipients) {
              const preference=g?await prefs(to,g.id):null;
              if(g) await copy(a,to);
              if(!g || preference.notify) await inbox(to,`task_${aid}`,{kind:g?'task':'direct',status:g?'info':'pending',actorUid:uid,actorName:me.name,groupId:g?.id||'',assignmentId:aid,title:`${g?g.name:me.name} · ${C.LABELS[p.kind]}`,description:p.description,dueDate:p.dueDate,subject:p.subject,expiresAt:now+30*86400000});
            }
          }
          result={ok:true,ids,...summary};
        }
      } else if(action==='assignmentUpdate' || action==='withdraw') {
        let a=await task(d.assignmentId);
        if(!root && a.ownerUid!==uid) fail('只有原發放者可以修改或撤回','permission-denied');
        if(a.groupId) {const g=await group(a.groupId);if(!root && !C.canPublish(g,uid)) fail('群組發放權限已失效','permission-denied');}
        if(a.state==='withdrawn') fail('此項目已撤回，可複製後重新發放');
        if(action==='assignmentUpdate') {publishAllowed();let p;try{p=C.payload({...d,kind:a.kind});}catch(e){fail(e.message,'invalid-argument');} a={...a,...p};}
        a={...a,state:action==='withdraw'?'withdrawn':'active',version:a.version+1,updatedAt:now};
        s.put(`collab_assignments/${a.id}`,a);
        const g=a.groupId?await group(a.groupId):null;
        for(const to of a.audience) {
          const stillMember=!g || g.members.includes(to);
          const hasAccepted=g || a.acceptedUids.includes(to);
          const path=`users/${to}/items/collab_${a.id}`, old=await s.get(path);
          // Departed members retain their last personal snapshot; withdrawal still invalidates the copy.
          if(old && (stillMember || a.state==='withdrawn')) s.put(path,C.project(a,old,now));
          const pref=g?await prefs(to,g.id):{notify:true};
          if(stillMember && hasAccepted && pref.notify) await inbox(to,`change_${a.id}_${a.version}`,{kind:'change',status:'info',actorUid:uid,actorName:me.name,assignmentId:a.id,groupId:a.groupId,title:`${a.state==='withdrawn'?'已撤回':'交期或內容更新'}：${a.subject}`,description:a.description,dueDate:a.dueDate});
          if(!g) {const ep=`collab_inbox/${to}/entries/task_${a.id}`, e=await s.get(ep);if(e?.status==='pending') s.put(ep,{...e,description:a.description,dueDate:a.dueDate,subject:a.subject,status:a.state==='withdrawn'?'withdrawn':'pending'});}
        }
      } else if(action==='addPersonal') {
        const a=await task(d.assignmentId);
        if(a.state!=='active') fail('此項目已撤回');
        if(a.groupId) {const g=await group(a.groupId);requireMember(g);if(!a.audience.includes(uid)) fail('你不在接收名單','permission-denied');}
        else if(!a.acceptedUids.includes(uid)) fail('請先在收件匣接受發放','permission-denied');
        await copy(a,uid,true);
        const existing=await s.get(`users/${uid}/items/collab_${a.id}`);
        if(existing?.isHidden) s.put(`users/${uid}/items/collab_${a.id}`,{...existing,isHidden:false});
      } else if(action==='inboxRead') {
        const ids=unique(d.ids).slice(0,100).map(id);
        for(const key of ids) {const p=`collab_inbox/${uid}/entries/${key}`, e=await s.get(p);if(e) s.put(p,{...e,read:true});}
      } else if(action==='block') {
        const target=id(d.uid);if(target===uid) fail('不可封鎖自己');
        const next=d.blocked===false?me.blocked.filter(x=>x!==target):unique([...me.blocked,target]);
        if(next.length>200) fail('封鎖清單已達上限');
        s.put(accountPath,{...me,blocked:next});
      } else if(action==='report') {
        const targetType=['account','assignment','group'].includes(d.targetType)?d.targetType:null;
        if(!targetType) fail('檢舉類型無效','invalid-argument');
        const reportId=randomUUID(); s.put(`collab_reports/${reportId}`,{id:reportId,reporterUid:uid,targetType,targetId:id(d.targetId),reason:text(d.reason,3,1000,'原因'),state:'open',createdAt:now});
      } else if(action==='adminList') {
        if(!root) fail('只限總管理員','permission-denied');
        const collections={accounts:'collab_accounts',groups:'collab_groups',reports:'collab_reports',audit:'collab_audit'};
        if(!collections[d.tab]) fail('頁面無效');
        let q=db.collection(collections[d.tab]).orderBy('createdAt','desc').limit(50);
        if(d.cursor) {const last=await tx.get(db.doc(`${collections[d.tab]}/${id(d.cursor)}`));if(last.exists) q=q.startAfter(last);}
        const snap=await tx.get(q);const rows=snap.docs.map(x=>({...x.data(),id:x.id}));
        result={ok:true,rows,next:rows.length===50?rows.at(-1).id:null};
      } else if(action==='adminUpdate') {
        if(!root) fail('只限總管理員','permission-denied');
        if(d.targetType==='account') {
          const a=await person(d.targetId);if(!a) fail('帳戶不存在');
          if(a.uid===uid) fail('不可停用自己的總管理員帳戶');
          const patch={};for(const key of ['canPublish','disabled']) if(d[key]!==undefined) patch[key]=bool(d[key]);
          s.put(`collab_accounts/${a.uid}`,{...a,...patch});
        } else if(d.targetType==='group') {const g=await group(d.targetId);s.put(`collab_groups/${g.id}`,{...g,state:bool(d.frozen)?'frozen':'active',updatedAt:now});}
        else if(d.targetType==='report') {const p=`collab_reports/${id(d.targetId)}`, r=await s.get(p);if(!r) fail('檢舉不存在');s.put(p,{...r,state:'resolved',resolvedBy:uid,resolvedAt:now});}
        else fail('管理項目無效');
      } else fail('不支援的操作','invalid-argument');
      s.put(quotaPath,{window:windowId,attempts:attempts+1,day,daily});
      s.put(memoPath,{uid,action,result,createdAt:now,expiresAt:new Date(now+7*86400000)});
      if(!['bootstrap','lookup','preview','inboxRead','adminList'].includes(action)) {
        const key=`${uid}_${requestId}`;s.put(`collab_audit/${key}`,{id:key,actorUid:uid,actorName:me.name,action,targetId:d.groupId||d.assignmentId||d.targetId||'',createdAt:now});
      }
      s.flush();return result;
    });
  };
}
module.exports={createService,Session,MAX_MEMBERS,MAX_DELIVERIES};
