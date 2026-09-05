/* StudyOS 3.1.0 collaboration workspace. Compiled locally for release; no runtime JSX dependency. */
(function () {
  'use strict';
  const {useState,useEffect,useRef,useMemo}=React;
  const C=window.StudyCore;
  const rid=()=>crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
  const errorText=e=>({
    'functions/not-found':'協作服務未啟用，請由總管理員完成 3.1.0 更新。',
    'functions/unavailable':'暫時無法連接協作服務，請檢查網絡後重試。',
    'functions/unauthenticated':'登入已過期，請重新登入。',
    'permission-denied':'無法讀取協作資料，請由總管理員檢查更新狀態。',
    'functions/internal':'協作服務暫時無法使用，請稍後重試。'
  }[e?.code] || e?.message || '操作未完成，請重試');
  function Icon({name='users',size=20}) {
    const definition=window.lucide?.icons?.[name.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join('')];
    const nodes=Array.isArray(definition)?(definition[0]==='svg'?definition[2]:definition):[];
    return <svg width={size} height={size} className="co-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{nodes.map(([tag,attrs],i)=>React.createElement(tag,{...attrs,key:i}))}</svg>;
  }
  const Button=({children,primary,danger,ghost,...props})=><button type="button" {...props} className={`co-btn ${primary?'primary':''} ${danger?'danger':''} ${ghost?'ghost':''} ${props.className||''}`}>{children}</button>;
  function Switch({label,description,value,onChange,disabled}) {return <div className="co-switch-row"><div><strong>{label}</strong>{description&&<div className="co-muted">{description}</div>}</div><button type="button" className="co-switch" role="switch" aria-checked={!!value} aria-label={label} disabled={disabled} onClick={()=>onChange(!value)}><span/></button></div>;}
  const Empty=({title,children,icon='inbox'})=><div className="co-empty"><Icon name={icon}/><strong>{title}</strong><div>{children}</div></div>;
  function Dialog({title,children,onClose,busy=false}) {
    const ref=useRef(),close=useRef(onClose);close.current=()=>{if(!busy)onClose();};
    useEffect(()=>{
      const previous=document.activeElement, overflow=document.body.style.overflow;
      document.body.style.overflow='hidden';
      const timer=setTimeout(()=>ref.current?.querySelector('input,textarea,button,select')?.focus(),40);
      const key=e=>{if(e.key==='Escape'){e.stopPropagation();close.current?.();}if(e.key==='Tab'){
        const all=[...ref.current.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(x=>x.offsetParent!==null);
        const first=all[0],last=all.at(-1);if(!first){e.preventDefault();return;}if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }};
      document.addEventListener('keydown',key,true);
      return()=>{clearTimeout(timer);document.body.style.overflow=overflow;document.removeEventListener('keydown',key,true);previous?.focus?.();};
    },[]);
    return ReactDOM.createPortal(<div className="co-overlay" onMouseDown={e=>{if(e.target===e.currentTarget&&!busy)onClose();}}><section className="co-dialog" ref={ref} role="dialog" aria-modal="true" aria-label={title}><div className="co-dialog-header"><h2>{title}</h2><Button className="square" disabled={busy} onClick={onClose} aria-label="關閉"><Icon name="x"/></Button></div>{children}</section></div>,document.body);
  }
  function useCollaboration(user) {
    const [account,setAccount]=useState(null),[groups,setGroups]=useState([]),[preferences,setPreferences]=useState({}),[inbox,setInbox]=useState([]),[issued,setIssued]=useState([]),[drafts,setDrafts]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false),[tick,setTick]=useState(0);
    const alive=useRef('');alive.current=user?.uid||'';
    const api=async(action,data={},requestId=rid())=>{
      const svc=window.firebaseServices;
      if(!svc?.callCollab) throw Object.assign(new Error('協作服務尚未就緒'),{code:'functions/unavailable'});
      const result=await svc.callCollab({action,...data,requestId});
      if(result.data?.ok===false) throw new Error(result.data.message);
      return result.data;
    };
    useEffect(()=>{
      setAccount(null);setGroups([]);setInbox([]);setIssued([]);setPreferences({});setDrafts([]);setError('');
      if(!user)return;
      let active=true;const unsubs=[];setLoading(true);
      api('bootstrap').then(()=>{
        if(!active)return;
        const f=window.firebaseServices;
        const listen=(ref,cb)=>unsubs.push(f.onSnapshot(ref,cb,e=>{if(active)setError(errorText(e));}));
        listen(f.doc(f.db,'collab_accounts',user.uid),snap=>{setAccount(snap.data());setLoading(false);});
        listen(f.query(f.collection(f.db,'collab_groups'),f.where('members','array-contains',user.uid)),snap=>setGroups(snap.docs.map(x=>({...x.data(),id:x.id}))));
        listen(f.collection(f.db,'collab_preferences',user.uid,'groups'),snap=>setPreferences(Object.fromEntries(snap.docs.map(x=>[x.id,x.data()]))));
        listen(f.query(f.collection(f.db,'collab_inbox',user.uid,'entries'),f.orderBy('createdAt','desc'),f.limit(100)),snap=>setInbox(snap.docs.map(x=>({...x.data(),id:x.id}))));
        listen(f.query(f.collection(f.db,'collab_assignments'),f.where('ownerUid','==',user.uid),f.orderBy('createdAt','desc'),f.limit(100)),snap=>setIssued(snap.docs.map(x=>({...x.data(),id:x.id}))));
        listen(f.query(f.collection(f.db,'users',user.uid,'drafts'),f.orderBy('updatedAt','desc'),f.limit(100)),snap=>setDrafts(snap.docs.map(x=>({...x.data(),id:x.id}))));
      }).catch(e=>{if(active){setLoading(false);setError(errorText(e));}});
      return()=>{active=false;unsubs.forEach(f=>f());};
    },[user?.uid,tick]);
    const saveDraft=async draft=>{const f=window.firebaseServices,key=draft.id||rid();await f.setDoc(f.doc(f.db,'users',user.uid,'drafts',key),{...draft,id:key,updatedAt:Date.now()});return key;};
    const removeDraft=async key=>{const f=window.firebaseServices;await f.deleteDoc(f.doc(f.db,'users',user.uid,'drafts',key));};
    return {account,groups,preferences,inbox,issued,drafts,loading,error,api,saveDraft,removeDraft,retry:()=>setTick(x=>x+1),unread:inbox.filter(x=>!x.read).length};
  }
  function useAction(notify) {
    const [busy,setBusy]=useState(false),lock=useRef(false);
    const run=async(fn,message)=>{if(lock.current)return;lock.current=true;setBusy(true);try{const r=await fn();if(message)notify(message);return r;}catch(e){notify(errorText(e),'error');return null;}finally{lock.current=false;setBusy(false);}};
    return {busy,run};
  }
  function AccountCard({collab,notify}) {
    const a=collab.account;
    const qr=useMemo(()=>{if(!a?.code || !window.qrcode)return '';const q=window.qrcode(0,'M');q.addData(`StudyOS account: ${a.code}`);q.make();return q.createSvgTag({cellSize:4,margin:2,scalable:true});},[a?.code]);
    const copy=async()=>{try{await navigator.clipboard.writeText(a.code);notify('帳戶編號已複製');}catch(e){notify(`請長按複製：${a.code}`);}};
    return <div className="co-card co-workspace"><div className="co-row co-between co-wrap"><div><div className="co-kicker">你的帳戶編號</div><div className="co-code">{a?.code || '•••••'}</div><p className="co-muted">分享編號即可邀請；加入前仍由你確認。</p><div className="co-actions"><Button disabled={!a} onClick={copy}><Icon name="copy"/>複製編號</Button>{navigator.share&&<Button disabled={!a} onClick={()=>navigator.share({title:'我的 StudyOS 帳戶編號',text:`我的 StudyOS 帳戶編號：${a.code}`}).catch(()=>{})}><Icon name="share-2"/>分享</Button>}</div></div>{qr&&<div className="co-qr" aria-label={`帳戶編號 ${a.code} 的二維碼`} dangerouslySetInnerHTML={{__html:qr}}/>}</div>{a?.disabled&&<p className="co-notice error">協作功能已被總管理員暫停。</p>}{collab.error&&<p className="co-muted">{collab.error}</p>}</div>;
  }
  function Composer({collab,subjects,initial={},onClose,notify}) {
    const blank={kind:'homework',subject:subjects[0]?.name||'其他',description:'',dueDate:C.tomorrow(),priority:'normal',groupIds:[],codes:[],memberIds:[]};
    const [form,setForm]=useState({...blank,...initial}),[codeText,setCodeText]=useState((initial.codes||[]).join(' ')),[scope,setScope]=useState(initial.groupIds?.length?'groups':'groups'),[preview,setPreview]=useState(null),[requestId,setRequestId]=useState(rid),[savedId,setSavedId]=useState(initial.draftId||''),[localSaved,setLocalSaved]=useState(false);
    const {busy,run}=useAction(notify), isEdit=!!initial.editId;
    const storageKey=`studyos-compose-${collab.account.uid}`;
    const update=(key,value)=>{setForm(p=>({...p,[key]:value}));setPreview(null);setRequestId(rid());};
    useEffect(()=>{if(initial.codes?.length)setScope('direct');},[]);
    useEffect(()=>{if(isEdit)return;try{sessionStorage.setItem(storageKey,JSON.stringify({...form,codes:codeText.toUpperCase().split(/[\s,，]+/).filter(Boolean),scope}));setLocalSaved(!!form.description);}catch(e){}},[form,codeText,scope]);
    const payload=()=>({...form,groupIds:scope==='groups'?form.groupIds:[],codes:scope==='direct'?codeText.trim().toUpperCase().split(/[\s,，]+/).filter(Boolean):[],memberIds:scope==='groups'&&form.groupIds.length===1?form.memberIds:[]});
    const save=()=>run(async()=>{const key=await collab.saveDraft({...payload(),id:savedId||rid()});setSavedId(key);},'草稿已儲存，可在「我發放的」繼續');
    const submit=()=>run(async()=>{
      if(isEdit){await collab.api('assignmentUpdate',{...form,assignmentId:initial.editId},requestId);notify('內容已更新；每個人的完成狀態保留');onClose();return;}
      if(!preview){const p=await collab.api('preview',payload());setPreview(p);return;}
      const result=await collab.api('publish',payload(),requestId);
      try{sessionStorage.removeItem(storageKey);}catch(e){}
      if(savedId) await collab.removeDraft(savedId).catch(()=>{});
      notify(scope==='direct'?`已向 ${result.uniqueCount} 人發出邀請，等候接受`:`已向 ${result.uniqueCount} 人發放`);onClose();
    });
    const selectedGroup=collab.groups.find(g=>g.id===form.groupIds[0]);
    return <Dialog title={isEdit?'修改已發放項目':'發放功課或通知'} onClose={()=>{if(!busy)onClose();}} busy={busy}><div className="co-stack">
      <div className="co-two"><label className="co-field">類型<select className="co-input" value={form.kind} disabled={isEdit||busy} onChange={e=>update('kind',e.target.value)}>{C.KINDS.map(k=><option key={k} value={k}>{C.LABELS[k]}</option>)}</select></label><label className="co-field">科目<input className="co-input" list="co-subject-list" maxLength={40} value={form.subject} onChange={e=>update('subject',e.target.value)}/><datalist id="co-subject-list">{subjects.map(s=><option key={s.name} value={s.name}/>)}</datalist></label></div>
      <label className="co-field">內容<textarea className="co-input" rows={4} maxLength={2000} value={form.description} onChange={e=>update('description',e.target.value)} placeholder="例如：完成工作紙第 1–2 頁"/></label>
      <div className="co-two"><label className="co-field">{form.kind==='notice'?'公告日期':form.kind==='activity'?'活動日期':'交期／日期'}<input type="date" className="co-input" value={form.dueDate} onChange={e=>update('dueDate',e.target.value)}/></label><label className="co-field">優先次序<select className="co-input" value={form.priority} onChange={e=>update('priority',e.target.value)}><option value="low">低</option><option value="normal">一般</option><option value="high">重要</option></select></label></div>
      {!isEdit&&<><hr className="co-divider"/><div className="co-tabs" role="tablist" aria-label="發放對象"><button role="tab" aria-selected={scope==='groups'} onClick={()=>{setScope('groups');setPreview(null);setRequestId(rid());}}>群組</button><button role="tab" aria-selected={scope==='direct'} onClick={()=>{setScope('direct');setPreview(null);setRequestId(rid());}}>指定帳戶</button></div>
      {scope==='groups'?<><div className="co-field">選擇群組（最多三個）<div className="co-stack co-scroll">{collab.groups.filter(g=>C.canPublish(g,collab.account.uid)).map(g=><label key={g.id} className="co-check"><input type="checkbox" checked={form.groupIds.includes(g.id)} onChange={e=>{update('groupIds',e.target.checked?[...form.groupIds,g.id]:form.groupIds.filter(x=>x!==g.id));setForm(p=>({...p,memberIds:[]}));}}/>{g.name}<span className="co-muted">{g.members.length} 人</span></label>)}{!collab.groups.length&&<p className="co-muted">先建立或加入群組，亦可以用帳戶編號發放。</p>}</div></div>{form.groupIds.length===1&&selectedGroup&&<details><summary className="co-muted">指定成員（不勾選則發放全組）</summary><div className="co-two co-scroll">{selectedGroup.members.map(u=><label key={u} className="co-check"><input type="checkbox" checked={form.memberIds.includes(u)} onChange={e=>update('memberIds',e.target.checked?[...form.memberIds,u]:form.memberIds.filter(x=>x!==u))}/>{selectedGroup.memberNames[u]||'同學'}</label>)}</div></details>}</>:<label className="co-field">五位帳戶編號（以空格分隔）<textarea className="co-input" rows={2} value={codeText} onChange={e=>{setCodeText(e.target.value.toUpperCase());setPreview(null);setRequestId(rid());}} autoCapitalize="characters" spellCheck={false} placeholder="ABCDE FGHIJ"/><span className="co-muted">對方接受後才加入個人手冊；每次最多二十人。</span></label>}
      {preview&&<div className="co-notice"><strong>發放預覽：{preview.uniqueCount} 人 · {preview.count} 次投遞</strong>{preview.groups.map(g=><div key={g.id}>{g.name}：{g.count} 人</div>)}<p>同學各自控制同步與通知。完成進度只屬於自己。</p></div>}</>}
      {localSaved&&!isEdit&&<span className="co-muted">本次內容已暫存於此分頁；跨裝置請儲存草稿。</span>}
      <div className="co-dialog-footer">{!isEdit&&<Button disabled={busy} onClick={save}>儲存草稿</Button>}<Button primary disabled={busy} onClick={submit}>{busy?'處理中…':isEdit?'儲存修改':preview?'確認發放':'預覽發放'}</Button></div>
    </div></Dialog>;
  }
  function GroupForm({collab,mode,group,onClose,notify}) {
    const [name,setName]=useState(group?.name||''),[description,setDescription]=useState(group?.description||''),[value,setValue]=useState(''),[found,setFound]=useState(null);
    const {busy,run}=useAction(notify);
    const submit=()=>run(async()=>{
      if(mode==='invite'&&!found){const r=await collab.api('lookup',{code:value});if(!r.person)throw new Error('找不到可邀請的帳戶');setFound(r.person);return;}
      if(mode==='create')await collab.api('createGroup',{name,description});
      if(mode==='edit')await collab.api('groupUpdate',{groupId:group.id,name,description});
      if(mode==='join')await collab.api('joinGroup',{code:value});
      if(mode==='invite')await collab.api('invite',{groupId:group.id,code:value});
      notify(mode==='join'?'已提交申請，等候群主審批':mode==='invite'?'已送出邀請，等候對方接受':'群組已儲存');onClose();
    });
    return <Dialog title={{create:'建立群組',join:'申請加入群組',invite:'邀請同學',edit:'編輯群組'}[mode]} onClose={onClose} busy={busy}><div className="co-stack">{['create','edit'].includes(mode)?<><label className="co-field">群組名稱<input className="co-input" value={name} maxLength={60} onChange={e=>setName(e.target.value)} placeholder="例如：中三甲班"/></label><label className="co-field">簡介<textarea className="co-input" value={description} maxLength={300} onChange={e=>setDescription(e.target.value)} rows={3}/></label></>:<label className="co-field">{mode==='invite'?'對方帳戶編號':'群組編號'}<input className="co-input" value={value} onChange={e=>{setValue(e.target.value.toUpperCase());setFound(null);}} autoCapitalize="characters" spellCheck={false} maxLength={mode==='invite'?5:8} placeholder={mode==='invite'?'ABCDE':'G-ABCDEF'}/><span className="co-muted">{mode==='invite'?'五個英文字母；先核對姓名再邀請。':'加入需經群主確認；接受後預設同步新功課。'}</span></label>}{found&&<div className="co-notice">邀請 <strong>{found.name}</strong>（{found.code}）加入 <strong>{group.name}</strong></div>}<div className="co-dialog-footer"><Button disabled={busy} primary onClick={submit}>{busy?'處理中…':mode==='invite'&&!found?'核對帳戶':mode==='join'?'提交申請':mode==='invite'?'送出邀請':'儲存群組'}</Button></div></div></Dialog>;
  }
  function SourceCard({task,personal,collab,notify,onEdit,onDuplicate,onConfirm,onReport,issuer=false}) {
    const {busy,run}=useAction(notify);
    return <article className="co-card"><div className="co-row co-between co-wrap"><div className="co-row co-wrap"><span className="co-chip">{C.LABELS[task.kind]||'功課'}</span><span className="co-chip">{task.subject}</span>{task.state==='withdrawn'&&<span className="co-chip warn">已撤回</span>}</div><span className="co-muted">{task.dueDate}</span></div><p className="co-description" style={{fontWeight:700,padding:'.4rem 0'}}>{task.description}</p><p className="co-muted">{task.groupName||'私人發放'} · {task.authorName} · 第 {task.version} 版</p>
      {issuer&&<p className="co-muted">{task.groupId?`已發放予 ${task.audience.length} 位成員`:`${task.acceptedUids.length} / ${task.audience.length} 人已接受`} · 完成記錄屬個人私隱</p>}
      <div className="co-actions">{issuer?<><Button disabled={busy||task.state==='withdrawn'} onClick={()=>onEdit(task)}><Icon name="pencil"/>修改</Button><Button onClick={()=>onDuplicate(task)}><Icon name="copy"/>再次發放</Button>{task.state!=='withdrawn'&&<Button danger disabled={busy} onClick={()=>onConfirm('撤回後不再計入待辦，已同步的紀錄會保留並標示撤回。',()=>run(()=>collab.api('withdraw',{assignmentId:task.id}),'已撤回發放'))}>撤回</Button>}</>:<>{task.kind!=='notice'&&<Button primary={!personal} disabled={busy||task.state==='withdrawn'||!!personal&&!personal.isHidden} onClick={()=>run(()=>collab.api('addPersonal',{assignmentId:task.id}),'已加入個人手冊')}>{personal?(personal.isHidden?'重新加入個人':personal.completed?'個人已完成':'已同步到個人'):'加入個人手冊'}</Button>}<Button ghost onClick={()=>onReport('assignment',task.id)}>檢舉</Button></>}</div></article>;
  }
  function GroupDetail({group,collab,items,subjects,notify,onBack,onCompose,onForm,onConfirm,onReport}) {
    const [tab,setTab]=useState('tasks'),[tasks,setTasks]=useState([]),[error,setError]=useState(''),[more,setMore]=useState(50),[syncChoice,setSyncChoice]=useState(false);
    const {busy,run}=useAction(notify),uid=collab.account.uid,manager=C.canManage(group,uid),owner=group.ownerUid===uid;
    const pref=collab.preferences[group.id]||{sync:true,notify:true};
    useEffect(()=>{setTasks([]);setError('');const f=window.firebaseServices;return f.onSnapshot(f.query(f.collection(f.db,'collab_assignments'),f.where('groupId','==',group.id),f.where('audience','array-contains',uid),f.orderBy('createdAt','desc'),f.limit(more)),snap=>setTasks(snap.docs.map(x=>({...x.data(),id:x.id}))),e=>setError(errorText(e)));},[group.id,more,uid]);
    const update=(key,value,extra={})=>run(()=>collab.api('preferences',{groupId:group.id,[key]:value,...extra}),'群組設定已更新');
    return <div className="co-stack"><div className="co-header"><div><Button ghost onClick={onBack}><Icon name="arrow-left"/>所有群組</Button><h2 style={{marginTop:'.7rem'}}>{group.name}</h2><p className="co-muted">{group.description||'共同整理功課，各自安排進度。'}</p></div><div className="co-actions">{manager&&<Button onClick={()=>onForm('invite',group)}><Icon name="user-plus"/>邀請同學</Button>}<Button primary disabled={!C.canPublish(group,uid)||collab.account.canPublish===false} onClick={()=>onCompose({groupIds:[group.id]})}><Icon name="send"/>發放</Button></div></div>
      {group.state==='frozen'&&<div className="co-notice error">群組已被總管理員凍結，暫停加入及發放。</div>}
      <div className="co-tabs" role="tablist" aria-label="群組內容">{[['tasks','功課與通知'],['members',`成員 ${group.members.length}`],['settings','群組設定']].map(([key,label])=><button key={key} role="tab" aria-selected={tab===key} onClick={()=>setTab(key)}>{label}</button>)}</div>
      {tab==='tasks'&&<><div className="co-notice">{pref.sync?'同步已開啟：新功課會加入個人手冊。':'同步已關閉：可逐份加入個人手冊。'} 完成狀態只會更改自己。</div>{error&&<div className="co-notice error">{error}</div>}{!tasks.length&&!error&&<Empty title="暫時沒有發放項目">第一份功課或通知會顯示在這裡。</Empty>}{tasks.map(a=><SourceCard key={a.id} task={a} personal={items.find(i=>i.collabRefId===a.id)} collab={collab} notify={notify} onReport={onReport}/>)}{tasks.length>=more&&<Button onClick={()=>setMore(n=>n+50)}>載入更多</Button>}</>}
      {tab==='members'&&<div className="co-stack">{group.members.map(u=><div className="co-card co-admin-row" key={u}><div className="co-row"><div className="co-avatar">{(group.memberNames[u]||'同').slice(0,1)}</div><div><strong>{group.memberNames[u]||'同學'}{u===uid?'（你）':''}</strong><div className="co-muted">{u===group.ownerUid?'群主':group.managers.includes(u)?'管理員':'成員'}</div></div></div><div className="co-actions">{owner&&u!==uid&&<><Button disabled={busy} onClick={()=>onConfirm(`${group.managers.includes(u)?'取消':'授予'}此成員的管理權限？`,()=>run(()=>collab.api('memberRole',{groupId:group.id,uid:u,manager:!group.managers.includes(u)}),'角色已更新'))}>{group.managers.includes(u)?'取消管理員':'設為管理員'}</Button><Button disabled={busy} onClick={()=>onConfirm('轉移後對方將成為群主，你會成為管理員。確定轉移？',()=>run(()=>collab.api('transferOwner',{groupId:group.id,uid:u}),'群主已轉移'))}>轉移群主</Button></>}{manager&&u!==uid&&u!==group.ownerUid&&<Button danger disabled={busy} onClick={()=>onConfirm('移出此成員並禁止重新加入？已有個人紀錄會保留。',()=>run(()=>collab.api('removeMember',{groupId:group.id,uid:u}),'成員已移出'))}>移出</Button>}{u!==uid&&<Button ghost onClick={()=>onConfirm('封鎖後雙方不能再直接邀請或發放新項目。',()=>run(()=>collab.api('block',{uid:u}),'已封鎖帳戶'))}>封鎖</Button>}</div></div>)}</div>}
      {tab==='settings'&&<div className="co-two"><div className="co-card"><h3>我的接收方式</h3><Switch label="同步到個人" description="只影響你；關閉後保留已有功課。" value={pref.sync} disabled={busy} onChange={value=>value?setSyncChoice(true):update('sync',false)}/><Switch label="群組通知" description="獨立控制此群組的新功課及更新提醒。" value={pref.notify} disabled={busy} onChange={value=>update('notify',value)}/><Switch label="置頂群組" value={pref.pinned} disabled={busy} onChange={value=>update('pinned',value)}/><Switch label="封存群組" description="移至封存列表，接收方式維持原設定。" value={pref.archived} disabled={busy} onChange={value=>update('archived',value)}/></div><div className="co-card co-stack"><div><h3>群組資料</h3><p className="co-code small">{group.code}</p><p className="co-muted">與五位帳戶編號分開；加入申請由群主處理。</p></div>{manager&&<><Button onClick={()=>onForm('edit',group)}>編輯群組</Button><Switch label="成員可以發放" value={group.allowMemberPublish} disabled={busy} onChange={value=>run(()=>collab.api('groupUpdate',{groupId:group.id,allowMemberPublish:value}),'發放權限已更新')}/></>}<Button ghost onClick={()=>onReport('group',group.id)}>檢舉群組</Button>{!owner&&<Button danger disabled={busy} onClick={()=>onConfirm('離開後不再接收新功課；個人手冊已有紀錄會保留。',()=>run(async()=>{await collab.api('leaveGroup',{groupId:group.id});onBack();},'已離開群組'))}>離開群組</Button>}{owner&&<p className="co-muted">如要離開，先在成員頁轉移群主。</p>}</div></div>}
      {syncChoice&&<Dialog title="開啟同步到個人" onClose={()=>setSyncChoice(false)} busy={busy}><p className="co-muted">已有功課及完成狀態會保留，重複項目不會再次加入。</p><div className="co-dialog-footer"><Button disabled={busy} onClick={async()=>{const r=await update('sync',true);if(r)setSyncChoice(false);}}>只同步之後的新功課</Button><Button primary disabled={busy} onClick={async()=>{const r=await update('sync',true,{includeExisting:true});if(r)setSyncChoice(false);}}>同時加入未到期功課</Button></div></Dialog>}
    </div>;
  }
  function Inbox({collab,notify,onGroup,onConfirm}) {
    const [filter,setFilter]=useState('all');const {busy,run}=useAction(notify);
    const entries=collab.inbox.filter(e=>filter==='all'||filter==='pending'&&e.status==='pending'||filter==='unread'&&!e.read);
    return <div className="co-stack"><div className="co-header"><div><h2>收件匣</h2><p className="co-muted">邀請先確認；已接受的功課才會加入個人。</p></div><Button disabled={busy||!collab.unread} onClick={()=>run(()=>collab.api('inboxRead',{ids:collab.inbox.filter(x=>!x.read).map(x=>x.id)}),'已標示為已讀')}>全部已讀</Button></div><div className="co-tabs" role="tablist" aria-label="收件匣篩選">{[['all','全部'],['pending','待處理'],['unread','未讀']].map(([k,l])=><button key={k} role="tab" aria-selected={filter===k} onClick={()=>setFilter(k)}>{l}</button>)}</div>{!entries.length&&<Empty title="暫時沒有通知">邀請、發放及交期更新會集中在這裡。</Empty>}{entries.map(e=><article className="co-card" key={e.id}><div className="co-row co-between"><h3>{e.title}</h3>{!e.read&&<span className="co-dot" aria-label="未讀"/>}</div>{e.description&&<p className="co-description">{e.description}</p>}<p className="co-muted">{e.dueDate&&`${e.subject||''} · ${e.dueDate} · `}{new Date(e.createdAt).toLocaleString('zh-HK')}</p><div className="co-actions">{e.status==='pending'?<>{e.expiresAt<Date.now()?<span className="co-chip warn">已到期</span>:<Button primary disabled={busy} onClick={()=>run(()=>collab.api('respond',{entryId:e.id,accept:true}),'已接受')}>接受</Button>}<Button disabled={busy} onClick={()=>run(()=>collab.api('respond',{entryId:e.id,accept:false}),'已拒絕')}>拒絕</Button></>:<span className="co-chip">{{accepted:'已接受',rejected:'已拒絕',withdrawn:'已撤回',info:'通知'}[e.status]||e.status}</span>}{e.groupId&&collab.groups.some(g=>g.id===e.groupId)&&<Button onClick={()=>{run(()=>collab.api('inboxRead',{ids:[e.id]}));onGroup(e.groupId);}}>查看群組</Button>}{!e.read&&<Button ghost disabled={busy} onClick={()=>run(()=>collab.api('inboxRead',{ids:[e.id]}))}>標示已讀</Button>}{e.actorUid!==collab.account.uid&&e.actorUid&&<Button ghost onClick={()=>onConfirm('封鎖此發放者？已有紀錄仍會保留。',()=>run(()=>collab.api('block',{uid:e.actorUid}),'已封鎖'))}>封鎖</Button>}</div></article>)}<p className="co-muted">顯示最近 100 則通知。</p></div>;
  }
  function Admin({collab,notify,onConfirm}) {
    const [tab,setTab]=useState('accounts'),[rows,setRows]=useState([]),[next,setNext]=useState(null),[loading,setLoading]=useState(false),[query,setQuery]=useState(''),[error,setError]=useState('');
    const {busy,run}=useAction(notify),gen=useRef(0);
    const load=async(more=false)=>{const generation=++gen.current;setLoading(true);setError('');try{const r=await collab.api('adminList',{tab,cursor:more?next:null});if(generation===gen.current){setRows(p=>more?[...p,...r.rows]:r.rows);setNext(r.next);}}catch(e){if(generation===gen.current)setError(errorText(e));}finally{if(generation===gen.current)setLoading(false);}};
    useEffect(()=>{setRows([]);setQuery('');load();return()=>{gen.current++;};},[tab]);
    const change=data=>run(async()=>{await collab.api('adminUpdate',data);await load();},'管理設定已更新');
    return <div className="co-stack"><div><h2>協作管理中心</h2><p className="co-muted">帳戶編號、發放權限、群組狀態及操作記錄。</p></div><div className="co-tabs" role="tablist" aria-label="管理分類">{[['accounts','帳戶'],['groups','群組'],['reports','檢舉'],['audit','操作記錄']].map(([k,l])=><button role="tab" key={k} aria-selected={tab===k} onClick={()=>setTab(k)}>{l}</button>)}</div><label className="co-field">篩選已載入資料<input className="co-input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="姓名、編號或內容"/></label>{error&&<div className="co-notice error">{error}<Button onClick={()=>load()}>重試</Button></div>}{rows.filter(x=>JSON.stringify(x).toLowerCase().includes(query.toLowerCase())).map(row=><div key={row.id} className="co-card co-admin-row"><div><strong>{row.name||row.reason||row.action}</strong><div className="co-muted">{row.code||row.actorName||row.targetId}</div>{tab==='audit'&&<div className="co-muted">{new Date(row.createdAt).toLocaleString('zh-HK')} · {row.targetId}</div>}{tab==='reports'&&<p className="co-muted">{row.targetType} · {row.state}</p>}</div><div className="co-actions">{tab==='accounts'&&<><Button disabled={busy||row.uid===collab.account.uid} onClick={()=>onConfirm(`${row.canPublish?'暫停':'恢復'} ${row.name} 的發放權限？`,()=>change({targetType:'account',targetId:row.uid,canPublish:!row.canPublish}))}>{row.canPublish?'暫停發放':'恢復發放'}</Button><Button danger disabled={busy||row.uid===collab.account.uid} onClick={()=>onConfirm(`${row.disabled?'恢復':'暫停'} ${row.name} 的協作功能？`,()=>change({targetType:'account',targetId:row.uid,disabled:!row.disabled}))}>{row.disabled?'恢復帳戶':'暫停協作'}</Button></>}{tab==='groups'&&<Button danger disabled={busy} onClick={()=>onConfirm(`${row.state==='active'?'凍結':'解凍'} ${row.name}？`,()=>change({targetType:'group',targetId:row.id,frozen:row.state==='active'}))}>{row.state==='active'?'凍結群組':'解凍群組'}</Button>}{tab==='reports'&&row.state==='open'&&<Button disabled={busy} onClick={()=>change({targetType:'report',targetId:row.id})}>標示已處理</Button>}</div></div>)}{loading&&<div className="co-loading" aria-label="載入中"/>}{!loading&&!rows.length&&!error&&<Empty title="暫時沒有資料"/>}{next&&<Button disabled={loading} onClick={()=>load(true)}>載入更多</Button>}</div>;
  }
  function Report({collab,target,onClose,notify}) {
    const [reason,setReason]=useState('');const {busy,run}=useAction(notify);
    return <Dialog title="提交檢舉" onClose={onClose} busy={busy}><label className="co-field">請說明原因<textarea className="co-input" rows={4} value={reason} maxLength={1000} onChange={e=>setReason(e.target.value)}/></label><div className="co-dialog-footer"><Button primary disabled={busy} onClick={()=>run(async()=>{await collab.api('report',{targetType:target.type,targetId:target.id,reason});notify('已提交予總管理員');onClose();})}>提交</Button></div></Dialog>;
  }
  function PersonalNote({item,onClose,onSave,notify}) {
    const [value,setValue]=useState(item.privateNote||'');const {busy,run}=useAction(notify);
    return <Dialog title="個人筆記" onClose={onClose} busy={busy}><p className="co-muted">只記錄自己的安排；發放內容由原發放者更新。</p><div className="co-notice co-description">{item.subject} · {item.dueDate}<br/>{item.description}</div><label className="co-field" style={{marginTop:'1rem'}}>我的筆記<textarea className="co-input" rows={5} maxLength={2000} value={value} onChange={e=>setValue(e.target.value)}/></label><div className="co-dialog-footer"><Button primary disabled={busy} onClick={()=>run(async()=>{await onSave(item.id,{privateNote:value,changedAfterCompletion:false});onClose();})}>儲存筆記</Button></div></Dialog>;
  }
  function Workspace({collab,user,items,subjects,notify,onConfirm,onLegacy,initialTab='groups'}) {
    const [tab,setTab]=useState(initialTab),[selected,setSelected]=useState(''),[modal,setModal]=useState(null),[composer,setComposer]=useState(null),[report,setReport]=useState(null),[archived,setArchived]=useState(false),[search,setSearch]=useState('');
    const {busy,run}=useAction(notify);
    const admin=user?.email==='chimhinhin@gmail.com'&&user.emailVerified;
    useEffect(()=>{setTab(initialTab);setSelected('');},[initialTab]);
    const group=collab.groups.find(g=>g.id===selected);
    const compose=initial=>setComposer(initial||{});
    const duplicate=a=>compose({kind:a.kind,subject:a.subject,description:a.description,dueDate:C.tomorrow(),priority:a.priority,groupIds:a.groupId?[a.groupId]:[],memberIds:[]});
    if(collab.loading)return <div className="co-workspace co-stack"><div className="co-loading"/><div className="co-loading"/><p className="co-muted">正在連接協作工作區…</p></div>;
    if(!collab.account)return <div className="co-workspace co-card"><Empty title="群組協作未能連接">{collab.error||'正在準備帳戶資料。'}</Empty><div className="co-actions"><Button primary onClick={collab.retry}>重新連接</Button><Button onClick={onLegacy}>原有班級</Button></div></div>;
    const list=collab.groups.filter(g=>!!collab.preferences[g.id]?.archived===archived&&g.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>Number(!!collab.preferences[b.id]?.pinned)-Number(!!collab.preferences[a.id]?.pinned)||b.createdAt-a.createdAt);
    return <div className="co-workspace"><div className="co-tabs" role="tablist" aria-label="協作工作區">{[['groups','群組'],['inbox','收件匣'],['issued','我發放的'],['account','我的編號'],...(admin?[['admin','總管理']]:[])].map(([k,l])=><button role="tab" key={k} aria-selected={tab===k} onClick={()=>{setTab(k);setSelected('');}}>{l}{k==='inbox'&&collab.unread>0&&<span className="co-badge">{collab.unread}</span>}</button>)}</div>{collab.error&&<div className="co-notice error" style={{marginBottom:'1rem'}}>{collab.error} <Button onClick={collab.retry}>重試</Button></div>}
      {tab==='groups'&&(group?<GroupDetail key={group.id} group={group} collab={collab} items={items} subjects={subjects} notify={notify} onBack={()=>setSelected('')} onCompose={compose} onForm={(mode,g)=>setModal({mode,group:g})} onConfirm={onConfirm} onReport={(type,id)=>setReport({type,id})}/>:<div className="co-stack"><div className="co-header"><div><div className="co-kicker">StudyOS 3.1.0</div><h2>一起整理，各自完成。</h2><p className="co-muted">每個人都可以發放，功課與進度各自管理。</p></div><div className="co-actions"><Button onClick={()=>setModal({mode:'join'})}><Icon name="user-plus"/>加入群組</Button><Button primary disabled={collab.account.canPublish===false||collab.account.disabled} onClick={()=>setModal({mode:'create'})}><Icon name="plus"/>建立群組</Button></div></div><div className="co-row co-wrap"><input className="co-input" style={{flex:1,minWidth:140}} aria-label="搜尋群組" placeholder="搜尋群組…" value={search} onChange={e=>setSearch(e.target.value)}/><Button onClick={()=>setArchived(x=>!x)}>{archived?'顯示使用中':'已封存'}</Button><Button ghost onClick={onLegacy}>原有班級</Button></div>{!list.length&&<Empty title={archived?'沒有封存群組':'未有群組'}>建立群組，或者輸入群組編號申請加入。</Empty>}<div className="co-grid">{list.map(g=><article className="co-card co-group-card" key={g.id}><div className="co-row"><span className="co-avatar">{g.name.slice(0,1)}</span><div><h3>{g.name}</h3><div className="co-muted">{g.members.length} 位成員 · {g.ownerUid===user.uid?'群主':g.managers.includes(user.uid)?'管理員':'成員'}</div></div></div><p className="co-muted">{g.description||'功課、測驗及班內通知集中一處。'}</p><div className="co-row co-wrap"><span className={`co-chip ${collab.preferences[g.id]?.sync?'good':''}`}>{collab.preferences[g.id]?.sync?'同步已開':'只在群組顯示'}</span>{collab.preferences[g.id]?.pinned&&<span className="co-chip">已置頂</span>}{g.state==='frozen'&&<span className="co-chip warn">已凍結</span>}</div><div className="co-actions"><Button primary onClick={()=>setSelected(g.id)}>開啟群組<Icon name="arrow-right"/></Button></div></article>)}</div></div>)}
      {tab==='inbox'&&<Inbox collab={collab} notify={notify} onGroup={gid=>{setSelected(gid);setTab('groups');}} onConfirm={onConfirm}/>}
      {tab==='issued'&&<div className="co-stack"><div className="co-header"><div><h2>我發放的</h2><p className="co-muted">草稿、已發放、修改及撤回，集中管理。</p></div><Button primary disabled={collab.account.canPublish===false||collab.account.disabled} onClick={()=>{let draft={};try{draft=JSON.parse(sessionStorage.getItem(`studyos-compose-${collab.account.uid}`)||'{}');}catch(e){}compose(draft);}}><Icon name="send"/>新增發放</Button></div>{collab.drafts.length>0&&<><h3>草稿</h3><div className="co-grid">{collab.drafts.map(d=><div className="co-card" key={d.id}><p className="co-description">{d.description||'未命名草稿'}</p><p className="co-muted">{d.subject} · {d.dueDate}</p><div className="co-actions"><Button onClick={()=>compose({...d,draftId:d.id})}>繼續編輯</Button><Button danger disabled={busy} onClick={()=>onConfirm('刪除此草稿？',()=>run(()=>collab.removeDraft(d.id),'草稿已刪除'))}>刪除</Button></div></div>)}</div><hr className="co-divider"/></>}{!collab.issued.length&&<Empty title="還未發放項目">可以向群組發放，或用五位帳戶編號邀請接收。</Empty>}{collab.issued.map(a=><SourceCard key={a.id} task={a} issuer collab={collab} notify={notify} onEdit={x=>compose({...x,editId:x.id})} onDuplicate={duplicate} onConfirm={onConfirm}/>)}<p className="co-muted">顯示最近 100 項發放。</p></div>}
      {tab==='account'&&<div className="co-two"><AccountCard collab={collab} notify={notify}/><div className="co-card co-stack"><h3>封鎖清單</h3>{!collab.account.blocked.length&&<p className="co-muted">暫時沒有封鎖帳戶。</p>}{collab.account.blocked.map(uid=><div className="co-row co-between" key={uid}><span className="co-muted">帳戶 {uid.slice(0,8)}…</span><Button disabled={busy} onClick={()=>run(()=>collab.api('block',{uid,blocked:false}),'已解除封鎖')}>解除封鎖</Button></div>)}</div></div>}
      {tab==='admin'&&admin&&<Admin collab={collab} notify={notify} onConfirm={onConfirm}/>}
      {modal&&<GroupForm {...modal} collab={collab} notify={notify} onClose={()=>setModal(null)}/>}{composer&&<Composer collab={collab} subjects={subjects} initial={composer} notify={notify} onClose={()=>setComposer(null)}/>}{report&&<Report collab={collab} target={report} notify={notify} onClose={()=>setReport(null)}/>}
    </div>;
  }
  window.StudyCollabUI={useCollaboration,Workspace,AccountCard,PersonalNote,Dialog};
})();
