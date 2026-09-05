/* StudyOS Spark: browser-owned writes, enforced by Firestore rules. No Functions. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.createStudySpark=factory;})(typeof window==='object'?window:globalThis,function(f,C){
  'use strict';
  const ref=(...p)=>f.doc(f.db,...p), col=(...p)=>f.collection(f.db,...p);
  const value=s=>s.exists()?{...s.data(),id:s.id}:null;
  const read=async(...p)=>value(await f.getDoc(ref(...p)));
  const list=async(q)=> (await f.getDocs(q)).docs.map(value);
  const uid=()=>{if(!f.auth.currentUser)throw Error('請先登入');return f.auth.currentUser.uid;};
  const now=()=>Date.now(), code=n=>Array.from(crypto.getRandomValues(new Uint8Array(n)),x=>String.fromCharCode(65+x%26)).join('');
  const must=(ok,msg)=>{if(!ok)throw Error(msg);};
  const clean=(v,n,m,label)=>C.cleanText(v,n,m,label);
  const account=()=>read('spark_accounts',uid());
  const live=async()=>{const a=await account();must(a&&!a.disabled,'協作功能已暫停，請聯絡總管理員');return a;};
  async function bootstrap(){
    const id=uid(), existing=await account();if(existing)return existing;
    for(let i=0;i<12;i++){
      const candidate=code(5);
      const result=await f.runTransaction(f.db,async tx=>{
        const ar=ref('spark_accounts',id), cr=ref('spark_codes',candidate);
        const [a,c]=await Promise.all([tx.get(ar),tx.get(cr)]);
        if(a.exists())return a.data();if(c.exists())return null;
        const data={uid:id,code:candidate,name:(f.auth.currentUser.displayName||'同學').slice(0,60),blocked:[],canPublish:true,disabled:false,createdAt:now()};
        tx.set(ar,data);tx.set(cr,{uid:id,code:candidate,name:data.name});return data;
      });if(result)return result;
    }throw Error('編號暫時未能建立，請重試');
  }
  async function lookup(raw){const c=String(raw||'').trim().toUpperCase();must(/^[A-Z]{5}$/.test(c),'請輸入五個英文字母');return read('spark_codes',c);}
  async function group(id){const g=await read('spark_groups',id);must(g,'群組不存在');return g;}
  async function createGroup(d){
    const a=await live();must(a.canPublish,'發放權限已暫停');
    for(let i=0;i<12;i++){
      const c='G-'+code(6), id=c;
      const result=await f.runTransaction(f.db,async tx=>{
        const r=ref('spark_groups',id),dr=ref('spark_group_codes',c);if((await tx.get(dr)).exists())return false;
        const g={id,code:c,name:clean(d.name,1,60,'群組名稱'),description:String(d.description||'').trim().slice(0,300),ownerUid:uid(),members:[uid()],managers:[],memberNames:{[uid()]:a.name},banned:[],allowMemberPublish:true,state:'active',createdAt:now(),lastRequestId:''};
        tx.set(r,g);tx.set(dr,{groupId:id,code:c,name:g.name,ownerUid:uid()});return true;
      });if(result){await preferences({groupId:id,sync:true,includeExisting:true});return {groupId:id};}
    }throw Error('群組編號未能建立，請重試');
  }
  async function request(kind,d){
    const a=await live();let target,g;
    if(kind==='invite'){g=await group(d.groupId);must(C.canManage(g,uid()),'只有群組管理員可以邀請');target=await lookup(d.code);must(target,'找不到此帳戶編號');}
    else {const directory=await read('spark_group_codes',String(d.code||'').trim().toUpperCase());must(directory,'找不到群組');g={id:directory.groupId,name:directory.name,ownerUid:directory.ownerUid};target={uid:g.ownerUid};}
    must(target.uid!==uid(),'不能邀請或申請加入自己');
    const member=kind==='invite'?target.uid:uid(),id=`${kind}_${g.id}_${member}`;
    const old=await read('spark_requests',id);if(old?.status==='pending')return {ok:true};
    const data={kind,groupId:g.id,assignmentId:'',senderUid:uid(),recipientUid:target.uid,memberUid:member,memberName:kind==='invite'?target.name:a.name,actorUid:uid(),title:kind==='invite'?`${a.name} 邀請你加入 ${g.name}`:`${a.name} 申請加入 ${g.name}`,description:'',status:'pending',read:false,createdAt:now(),expiresAt:now()+14*86400000};
    await f.setDoc(ref('spark_requests',id),data);return {ok:true};
  }
  async function respond(d){
    await live();
    await f.runTransaction(f.db,async tx=>{
      const rr=ref('spark_requests',d.entryId),e=value(await tx.get(rr));must(e&&e.recipientUid===uid(),'找不到邀請');
      if(e.status!=='pending')return;must(!d.accept||e.expiresAt>=now(),'邀請已到期');
      let g,s,gr,sr;
      if(d.accept&&e.kind!=='direct'){gr=ref('spark_groups',e.groupId);g=value(await tx.get(gr));must(g&&g.state==='active'&&!g.banned.includes(e.memberUid),'群組暫停加入或已限制此帳戶');}
      if(d.accept&&e.kind==='direct'){sr=ref('spark_assignments',e.assignmentId);s=value(await tx.get(sr));must(s?.state==='active','發放已撤回');}
      tx.update(rr,{status:d.accept?'accepted':'rejected',read:true});
      if(g){must(g.members.length<60,'每組最多 60 人');tx.update(gr,{members:[...new Set([...g.members,e.memberUid])],memberNames:{...g.memberNames,[e.memberUid]:e.memberName},lastRequestId:d.entryId});}
      if(s)tx.update(sr,{acceptedUids:[uid()]});
    });
    const e=await read('spark_requests',d.entryId);
    if(d.accept&&e.kind==='direct'&&(await read('spark_assignments',e.assignmentId)).kind!=='notice')await addPersonal({assignmentId:e.assignmentId});
    if(d.accept&&e.kind==='invite')await preferences({groupId:e.groupId,sync:true});
    return {ok:true};
  }
  async function preferences(d){
    await live();const r=ref('spark_preferences',uid(),'groups',d.groupId),old=value(await f.getDoc(r));
    const next={sync:true,notify:true,pinned:false,archived:false,since:now(),...old};delete next.id;
    for(const k of ['sync','notify','pinned','archived'])if(typeof d[k]==='boolean')next[k]=d[k];
    if(d.sync===true)next.since=d.includeExisting?0:now();
    await f.setDoc(r,next);return {ok:true};
  }
  async function targets(d){
    const a=await live();must(a.canPublish,'發放權限已暫停');C.payload(d);
    const groups=[...new Set(d.groupIds||[])],codes=[...new Set(d.codes||[])];
    must(groups.length<=3&&codes.length<=20&&!(groups.length&&codes.length),'每次最多三組或二十個帳戶');must(groups.length||codes.length,'請選擇接收對象');
    const plans=[];
    for(const id of groups){const g=await group(id);must(C.canPublish(g,uid()),'你沒有此群組的發放權限');const audience=groups.length===1&&d.memberIds?.length?g.members.filter(x=>d.memberIds.includes(x)):g.members;must(audience.length,'請選擇成員');plans.push({g,audience});}
    for(const c of codes){const person=await lookup(c);must(person,`找不到帳戶 ${c}`);must(person.uid!==uid(),'私人發放請選擇其他帳戶');plans.push({g:null,audience:[person.uid]});}
    return {plans,a};
  }
  async function preview(d){const {plans}=await targets(d);return {groups:plans.filter(p=>p.g).map(p=>({id:p.g.id,name:p.g.name,count:p.audience.length})),count:plans.reduce((s,p)=>s+p.audience.length,0),uniqueCount:new Set(plans.flatMap(p=>p.audience)).size};}
  async function publish(d){
    const {plans,a}=await targets(d),p=C.payload(d);let i=0;
    // Each source is independent and deterministic so retrying after a network break is safe.
    for(const plan of plans){
      const id=`${uid()}_${d.requestId}_${i++}`;must(id.length<300&&!id.includes('/'),'無效發放識別碼');
      await f.runTransaction(f.db,async tx=>{
        const r=ref('spark_assignments',id);if((await tx.get(r)).exists())return;
        const s={...p,id,ownerUid:uid(),authorName:a.name,groupId:plan.g?.id||'',groupName:plan.g?.name||'',audience:plan.audience,acceptedUids:[],version:1,state:'active',createdAt:now(),updatedAt:now()};tx.set(r,s);
        if(!plan.g){const target=plan.audience[0],rid=`direct_${id}_${target}`;tx.set(ref('spark_requests',rid),{kind:'direct',groupId:'',assignmentId:id,senderUid:uid(),recipientUid:target,memberUid:target,memberName:'',actorUid:uid(),title:`${a.name} 發放了${C.LABELS[p.kind]}`,description:p.description,subject:p.subject,dueDate:p.dueDate,status:'pending',read:false,createdAt:now(),expiresAt:now()+14*86400000});}
      });
    }return {ok:true,uniqueCount:new Set(plans.flatMap(p=>p.audience)).size};
  }
  async function addPersonal(d){await live();const s=await read('spark_assignments',d.assignmentId);must(s?.state==='active','項目已撤回');await syncOne(s,true);return {ok:true};}
  async function syncOne(s,manual=false){
    const r=ref('users',uid(),'items','spark_'+s.id);
    await f.runTransaction(f.db,async tx=>{
      const existing=value(await tx.get(r));const source=value(await tx.get(ref('spark_assignments',s.id)));if(!source)return;
      if(!manual&&!existing)return; if(manual)must(source.kind!=='notice','公告只在收件匣及群組顯示');
      if(existing&&existing.sourceVersion===source.version&&!manual)return;
      const next=C.project(source,existing,now());delete next.id;next.sparkSource=true;
      if(manual)next.isHidden=false;tx.set(r,next);
    });
  }
  async function mutateGroup(d,action){
    await live();await f.runTransaction(f.db,async tx=>{
      const r=ref('spark_groups',d.groupId),g=value(await tx.get(r));must(g,'群組不存在');const me=uid();let change={};
      if(action==='groupUpdate'){must(C.canManage(g,me),'沒有管理權限');if(d.name!==undefined)change.name=clean(d.name,1,60,'群組名稱');if(d.description!==undefined)change.description=String(d.description).slice(0,300);if(typeof d.allowMemberPublish==='boolean')change.allowMemberPublish=d.allowMemberPublish;}
      if(action==='memberRole'){must(g.ownerUid===me&&g.members.includes(d.uid),'只有群主可以管理角色');change.managers=d.manager?[...new Set([...g.managers,d.uid])]:g.managers.filter(x=>x!==d.uid);}
      if(action==='transferOwner'){must(g.ownerUid===me&&g.members.includes(d.uid),'請選擇現有成員');change.ownerUid=d.uid;change.managers=[...new Set([...g.managers,me])].filter(x=>x!==d.uid);}
      if(action==='leaveGroup'||action==='removeMember'){const target=action==='leaveGroup'?me:d.uid;must(target!==g.ownerUid,'請先轉移群主');must(target===me||C.canManage(g,me),'沒有管理權限');if(g.managers.includes(target)&&target!==me)must(g.ownerUid===me,'只有群主可以移出管理員');change.members=g.members.filter(x=>x!==target);change.managers=g.managers.filter(x=>x!==target);change.memberNames={...g.memberNames};delete change.memberNames[target];change.banned=target===me?g.banned:[...new Set([...g.banned,target])];}
      tx.update(r,change);
      if(change.ownerUid||change.name)tx.update(ref('spark_group_codes',g.code),{ownerUid:change.ownerUid||g.ownerUid,name:change.name||g.name});
    });return {ok:true};
  }
  async function assignmentUpdate(d,withdraw=false){await live();await f.runTransaction(f.db,async tx=>{const r=ref('spark_assignments',d.assignmentId),s=value(await tx.get(r));must(s?.ownerUid===uid(),'只有原發放者可以修改');tx.update(r,{...(withdraw?{state:'withdrawn'}:C.payload(d)),version:s.version+1,updatedAt:now()});});return {ok:true};}
  async function adminList(d){const names={accounts:'spark_accounts',groups:'spark_groups',reports:'spark_reports',audit:'spark_audit'};must(names[d.tab],'無效分類');let q=f.query(col(names[d.tab]),f.orderBy('__name__'),f.limit(50));if(d.cursor)q=f.query(col(names[d.tab]),f.orderBy('__name__'),f.startAfter(d.cursor),f.limit(50));const rows=await list(q);return {rows,next:rows.length===50?rows.at(-1).id:null};}
  async function adminUpdate(d){const names={account:'spark_accounts',group:'spark_groups',report:'spark_reports'};must(names[d.targetType],'無效類型');const patch=d.targetType==='account'?Object.fromEntries(['disabled','canPublish'].filter(k=>typeof d[k]==='boolean').map(k=>[k,d[k]])):d.targetType==='group'?{state:d.frozen?'frozen':'active'}:{state:'resolved'};const b=f.writeBatch(f.db);b.update(ref(names[d.targetType],d.targetId),patch);b.set(f.doc(col('spark_audit')),{action:'adminUpdate',targetId:d.targetId,actorUid:uid(),createdAt:now(),details:JSON.stringify(patch)});await b.commit();return {ok:true};}
  async function call(d){
    let result;
    switch(d.action){
      case 'bootstrap':result=await bootstrap();break;
      case 'lookup':result={person:await lookup(d.code)};break;
      case 'createGroup':result=await createGroup(d);break;
      case 'invite':result=await request('invite',d);break;
      case 'joinGroup':result=await request('join',d);break;
      case 'respond':result=await respond(d);break;
      case 'preferences':result=await preferences(d);break;
      case 'preview':result=await preview(d);break;
      case 'publish':result=await publish(d);break;
      case 'assignmentUpdate':result=await assignmentUpdate(d);break;
      case 'withdraw':result=await assignmentUpdate(d,true);break;
      case 'addPersonal':result=await addPersonal(d);break;
      case 'groupUpdate':case 'memberRole':case 'transferOwner':case 'leaveGroup':case 'removeMember':result=await mutateGroup(d,d.action);break;
      case 'block':await f.updateDoc(ref('spark_accounts',uid()),{blocked:d.blocked===false?f.arrayRemove(d.uid):f.arrayUnion(d.uid)});result={ok:true};break;
      case 'inboxRead':for(const id of d.ids||[])await f.updateDoc(id.startsWith('info_')?ref('spark_inbox',uid(),'entries',id):ref('spark_requests',id),{read:true});result={ok:true};break;
      case 'report':await live();await f.addDoc(col('spark_reports'),{actorUid:uid(),targetType:d.targetType,targetId:d.targetId,reason:clean(d.reason,1,1000,'原因'),state:'open',createdAt:now()});result={ok:true};break;
      case 'adminList':result=await adminList(d);break;
      case 'adminUpdate':result=await adminUpdate(d);break;
      default:throw Error('未知操作，請更新網頁');
    }return {data:result||{ok:true}};
  }
  // Sync only the signed-in user's own records. Never write to another user's items.
  function startSync(onError){
    const me=uid(),stops=[],groupListeners=new Map(),pending=new Set(),queued=new Set();let active=true,prefs={},prefsReady=false,sources=new Map();
    const fail=e=>{if(active)onError(e);};
    async function process(s){
      if(!active||f.auth.currentUser?.uid!==me||!prefsReady)return;
      if(pending.has(s.id)){queued.add(s.id);return;}pending.add(s.id);
      try{
        const personal=await read('users',me,'items','spark_'+s.id),pref=prefs[s.groupId]||{sync:true,notify:true,since:0};
        if(!active)return;
        const accepted=s.groupId||s.acceptedUids.includes(me);
        if(accepted&&(personal||(C.shouldSync(s,pref,null)&&s.dueDate>=C.dateKey(new Date()))))await syncOne(s,!personal);
        if(accepted&&pref.notify!==false){const id=`info_${s.id}_${s.version}`,r=ref('spark_inbox',me,'entries',id);await f.runTransaction(f.db,async tx=>{if(!(await tx.get(r)).exists())tx.set(r,{title:s.state==='withdrawn'?'發放已撤回':`${s.authorName} · ${C.LABELS[s.kind]}${s.version>1?'更新':''}`,description:s.description,subject:s.subject,dueDate:s.dueDate,groupId:s.groupId,actorUid:s.ownerUid,status:'info',read:false,createdAt:s.updatedAt});});}
      }catch(e){fail(e);}finally{pending.delete(s.id);if(queued.delete(s.id)&&sources.has(s.id))process(sources.get(s.id));}
    }
    const consume=snap=>{snap.docChanges().forEach(c=>{if(c.type==='removed'){sources.delete(c.doc.id);return;}const s=value(c.doc);sources.set(s.id,s);process(s);});};
    stops.push(f.onSnapshot(col('spark_preferences',me,'groups'),snap=>{prefs=Object.fromEntries(snap.docs.map(x=>[x.id,x.data()]));prefsReady=true;for(const s of sources.values())process(s);},fail));
    stops.push(f.onSnapshot(f.query(col('spark_groups'),f.where('members','array-contains',me)),snap=>{
      const ids=new Set(snap.docs.map(x=>x.id));
      for(const [id,stop] of groupListeners)if(!ids.has(id)){stop();groupListeners.delete(id);for(const [sid,s] of sources)if(s.groupId===id)sources.delete(sid);}
      for(const g of snap.docs)if(!groupListeners.has(g.id))groupListeners.set(g.id,f.onSnapshot(f.query(col('spark_assignments'),f.where('groupId','==',g.id),f.where('audience','array-contains',me)),consume,fail));
    },fail));
    stops.push(f.onSnapshot(f.query(col('spark_assignments'),f.where('groupId','==',''),f.where('audience','array-contains',me)),consume,fail));
    return()=>{active=false;stops.forEach(s=>s());groupListeners.forEach(s=>s());};
  }
  return {call,startSync,bootstrap,syncOne};
});
