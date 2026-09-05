'use strict';
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const {initializeApp,deleteApp}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');
const {createService}=require('./service');
const C=require('./core');
const enabled=!!process.env.FIRESTORE_EMULATOR_HOST;
let app,db,call,now=Date.parse('2026-09-05T04:00:00Z');
before(()=>{if(enabled){app=initializeApp({projectId:'demo-studyos'});db=getFirestore(app);call=createService(db,()=>now);}});
after(async()=>{if(app)await deleteApp(app);});
const user=uid=>({uid,token:{email:`${uid}@example.test`,email_verified:true,name:uid}});
const run=(u,action,data={},requestId=randomUUID())=>call(u,{action,...data,requestId});
async function pair(){const a=user('a'+randomUUID().replaceAll('-','').slice(0,15)),b=user('b'+randomUUID().replaceAll('-','').slice(0,15));const aa=await run(a,'bootstrap'),bb=await run(b,'bootstrap');return {a,b,aa:aa.account,bb:bb.account};}
async function joined(){const p=await pair();const g=await run(p.a,'createGroup',{name:'3A',description:'測試'});await run(p.a,'invite',{groupId:g.groupId,code:p.bb.code});await run(p.b,'respond',{entryId:`invite_${g.groupId}_${p.a.uid}`,accept:true});return {...p,gid:g.groupId};}
const homework={kind:'homework',subject:'中文',description:'工作紙第一頁',dueDate:'2026-09-06',priority:'normal'};
const read=async p=>(await db.doc(p).get()).data();

test('tomorrow counts respect local date, completion, hidden and withdrawal',()=>{
 const items=[{...homework,type:'homework'},{...homework,type:'homework',completed:true},{...homework,type:'homework',withdrawn:true},{...homework,type:'homework',isHidden:true},{...homework,type:'assessment'}];
 const n=C.counts(items,new Date(2026,8,5,23,59));assert.deepEqual(n.tomorrow,{pending:1,total:2,completed:1});assert.equal(n.today.total,0);
 assert.equal(C.tomorrow(new Date(2026,11,31,12)),'2027-01-01');assert.equal(C.validDate('2026-02-30'),false);assert.equal(C.validDate('2028-02-29'),true);
});
test('projection preserves completion, private notes, hidden tombstones and flags updates',()=>{
 const src={...homework,id:'x',type:'homework',version:2,state:'active',updatedAt:100};
 const x=C.project(src,{completed:true,completedAt:'old',privateNote:'personal',isHidden:true,sourceVersion:1},now);
 assert.equal(x.completed,true);assert.equal(x.completedAt,'old');assert.equal(x.privateNote,'personal');assert.equal(x.isHidden,true);assert.equal(x.changedAfterCompletion,true);
 assert.equal(C.project({...src,state:'withdrawn'},x,now).forceExpired,true);
});
test('account allocation stable and unique; group invite requires acceptance', {skip:!enabled},async()=>{
 const {a,b,aa,bb}=await pair();assert.match(aa.code,/^[A-Z]{5}$/);assert.notEqual(aa.code,bb.code);assert.equal((await run(a,'bootstrap')).account.code,aa.code);
 const g=await run(a,'createGroup',{name:'Test'});await run(a,'invite',{groupId:g.groupId,code:bb.code});assert.deepEqual((await read(`collab_groups/${g.groupId}`)).members,[a.uid]);
 await run(b,'respond',{entryId:`invite_${g.groupId}_${a.uid}`,accept:true});assert((await read(`collab_groups/${g.groupId}`)).members.includes(b.uid));
});
test('sync off preserves prior copy; re-enable backfills once; updates preserve personal state; withdrawal removes count',{skip:!enabled},async()=>{
 const {a,b,gid}=await joined();let pub=await run(a,'publish',{...homework,groupIds:[gid]});const first=pub.ids[0],path=`users/${b.uid}/items/collab_${first}`;
 assert(await read(path));await db.doc(path).update({completed:true,completedAt:'done',privateNote:'只屬於我'});
 await run(b,'preferences',{groupId:gid,sync:false});assert.equal((await read(path)).completed,true);
 pub=await run(a,'publish',{...homework,description:'工作紙第二頁',groupIds:[gid]});const second=pub.ids[0],secondPath=`users/${b.uid}/items/collab_${second}`;assert.equal(await read(secondPath),undefined);
 await run(b,'preferences',{groupId:gid,sync:true,includeExisting:true});assert(await read(secondPath));await run(b,'addPersonal',{assignmentId:second});
 assert.equal((await db.collection(`users/${b.uid}/items`).get()).size,2);
 await run(a,'assignmentUpdate',{...homework,assignmentId:first,description:'改為第二頁',dueDate:'2026-09-07'});const updated=await read(path);assert.equal(updated.completed,true);assert.equal(updated.privateNote,'只屬於我');assert.equal(updated.changedAfterCompletion,true);assert.equal(updated.dueDate,'2026-09-07');
 await run(a,'withdraw',{assignmentId:second});assert.equal((await read(secondPath)).withdrawn,true);
 assert.equal(C.counts([await read(secondPath)],new Date(2026,8,5)).tomorrow.pending,0);
});
test('sync new-only does not backfill; hidden copies stay hidden on source update',{skip:!enabled},async()=>{
 const {a,b,gid}=await joined();await run(b,'preferences',{groupId:gid,sync:false});const p=await run(a,'publish',{...homework,groupIds:[gid]});
 now+=2000;await run(b,'preferences',{groupId:gid,sync:true});const path=`users/${b.uid}/items/collab_${p.ids[0]}`;assert.equal(await read(path),undefined);
 await run(b,'addPersonal',{assignmentId:p.ids[0]});await db.doc(path).update({isHidden:true});await run(a,'assignmentUpdate',{...homework,assignmentId:p.ids[0],description:'更改內容'});assert.equal((await read(path)).isHidden,true);
});
test('direct delivery waits for consent; blocking prevents new invitations',{skip:!enabled},async()=>{
 const {a,b,bb}=await pair();const p=await run(a,'publish',{...homework,codes:[bb.code]});const path=`users/${b.uid}/items/collab_${p.ids[0]}`;assert.equal(await read(path),undefined);
 await run(b,'respond',{entryId:`task_${p.ids[0]}`,accept:true});assert(await read(path));await run(b,'block',{uid:a.uid});
 await assert.rejects(run(a,'publish',{...homework,codes:[bb.code]}),/無法接收/);
});
test('member cannot grant roles, manage another source or use root tools; unverified root email denied',{skip:!enabled},async()=>{
 const {a,b,gid}=await joined();await assert.rejects(run(b,'memberRole',{groupId:gid,uid:a.uid,manager:true}),/管理員/);
 const p=await run(a,'publish',{...homework,groupIds:[gid]});await assert.rejects(run(b,'withdraw',{assignmentId:p.ids[0]}),/原發放者/);
 await assert.rejects(run(b,'adminList',{tab:'accounts'}),/總管理員/);
 const fake={...b,token:{email:'chimhinhin@gmail.com',email_verified:false}};await assert.rejects(run(fake,'adminList',{tab:'accounts'}),/總管理員/);
});
test('same request creates one publication; source update transactional and completed users independent',{skip:!enabled},async()=>{
 const {a,b,gid}=await joined(),req=randomUUID();const p=await run(a,'publish',{...homework,groupIds:[gid]},req);const again=await run(a,'publish',{...homework,groupIds:[gid]},req);assert.deepEqual(p,again);
 const ap=`users/${a.uid}/items/collab_${p.ids[0]}`,bp=`users/${b.uid}/items/collab_${p.ids[0]}`;await db.doc(bp).update({completed:true});assert.equal((await read(ap)).completed,false);
 assert.equal((await db.collection('collab_assignments').where('ownerUid','==',a.uid).get()).size,1);
});
test('leave stops future delivery and updates but preserves previous personal record',{skip:!enabled},async()=>{
 const {a,b,gid}=await joined();const p=await run(a,'publish',{...homework,groupIds:[gid]});await run(b,'leaveGroup',{groupId:gid});
 const path=`users/${b.uid}/items/collab_${p.ids[0]}`;assert(await read(path));await run(a,'assignmentUpdate',{...homework,assignmentId:p.ids[0],description:'新內容'});assert.equal((await read(path)).description,homework.description);
 const p2=await run(a,'publish',{...homework,groupIds:[gid]});assert.equal(await read(`users/${b.uid}/items/collab_${p2.ids[0]}`),undefined);
});
test('join request approval, member publishing and root freeze controls',{skip:!enabled},async()=>{
 const {a,b}=await pair();const created=await run(a,'createGroup',{name:'Study'});const g=await read(`collab_groups/${created.groupId}`);await run(b,'joinGroup',{code:g.code});await run(a,'respond',{entryId:`join_${g.id}_${b.uid}`,accept:true});await run(b,'publish',{...homework,groupIds:[g.id]});
 await run(a,'groupUpdate',{groupId:g.id,allowMemberPublish:false});await assert.rejects(run(b,'publish',{...homework,groupIds:[g.id]}),/權限/);
 const root={uid:'root',token:{email:'chimhinhin@gmail.com',email_verified:true}};await run(root,'bootstrap');await run(root,'adminUpdate',{targetType:'group',targetId:g.id,frozen:true});await assert.rejects(run(a,'publish',{...homework,groupIds:[g.id]}),/凍結/);
});
