const {test,before,after}=require('node:test');
const {initializeTestEnvironment,assertFails,assertSucceeds}=require('@firebase/rules-unit-testing');
const {doc,setDoc,getDoc,updateDoc,deleteDoc,getDocs,collection,query,where,orderBy,limit}=require('firebase/firestore');
const fs=require('node:fs');
let env;const enabled=!!process.env.FIRESTORE_EMULATOR_HOST;
before(async()=>{if(enabled)env=await initializeTestEnvironment({projectId:'demo-studyos-rules',firestore:{rules:fs.readFileSync('firestore.rules','utf8')}});});
after(async()=>{if(env)await env.cleanup();});
test('Firestore isolation: account lookup cannot list; users cannot forge membership or delivery',{skip:!enabled},async()=>{
 const a=env.authenticatedContext('alice').firestore(),b=env.authenticatedContext('bob').firestore();
 await env.withSecurityRulesDisabled(async c=>{const db=c.firestore();await setDoc(doc(db,'collab_accounts/alice'),{uid:'alice',code:'ABCDE'});await setDoc(doc(db,'collab_groups/g1'),{members:['alice'],ownerUid:'alice'});await setDoc(doc(db,'collab_codes/ABCDE'),{uid:'alice'});});
 await assertSucceeds(getDoc(doc(a,'collab_accounts/alice')));await assertFails(getDoc(doc(b,'collab_accounts/alice')));await assertFails(getDocs(collection(a,'collab_accounts')));await assertFails(getDoc(doc(a,'collab_codes/ABCDE')));
 await assertFails(setDoc(doc(b,'collab_groups/g1'),{members:['bob']}));await assertFails(setDoc(doc(b,'collab_accounts/bob'),{code:'ADMIN'}));await assertFails(setDoc(doc(b,'users/bob/items/collab_fake'),{completed:false}));
});
test('synchronized copy permits private completion and notes but not source edits or deletion',{skip:!enabled},async()=>{
 const a=env.authenticatedContext('alice').firestore(),b=env.authenticatedContext('bob').firestore();
 await env.withSecurityRulesDisabled(c=>setDoc(doc(c.firestore(),'users/alice/items/collab_x'),{collabRefId:'x',completed:false,privateNote:'',isHidden:false,description:'source'}));
 const ref=doc(a,'users/alice/items/collab_x');await assertSucceeds(updateDoc(ref,{completed:true,completedAt:'today',privateNote:'private'}));
 await assertFails(getDoc(doc(b,'users/alice/items/collab_x')));await assertFails(updateDoc(ref,{description:'tampered'}));await assertFails(deleteDoc(ref));await assertSucceeds(updateDoc(ref,{isHidden:true}));
 await assertSucceeds(setDoc(doc(a,'users/alice/items/legacy'),{description:'old',dueDate:'2026-09-06'}));
});
test('group task queries allow recipients only, revoke on leave; direct task requires consent',{skip:!enabled},async()=>{
 const a=env.authenticatedContext('alice').firestore(),b=env.authenticatedContext('bob').firestore();
 await env.withSecurityRulesDisabled(async c=>{const db=c.firestore();await setDoc(doc(db,'collab_assignments/task'),{ownerUid:'owner',groupId:'g1',audience:['alice'],acceptedUids:[],createdAt:1});await setDoc(doc(db,'collab_assignments/direct'),{ownerUid:'owner',groupId:'',audience:['alice'],acceptedUids:[],createdAt:1});});
 await assertSucceeds(getDocs(query(collection(a,'collab_assignments'),where('groupId','==','g1'),where('audience','array-contains','alice'),orderBy('createdAt','desc'),limit(50))));
 await assertFails(getDoc(doc(b,'collab_assignments/task')));await assertFails(getDoc(doc(a,'collab_assignments/direct')));
 await env.withSecurityRulesDisabled(c=>updateDoc(doc(c.firestore(),'collab_groups/g1'),{members:[]}));await assertFails(getDoc(doc(a,'collab_assignments/task')));
});
test('root administration requires a verified email token',{skip:!enabled},async()=>{
 const verified=env.authenticatedContext('root',{email:'chimhinhin@gmail.com',email_verified:true}).firestore();
 const forged=env.authenticatedContext('pretend',{email:'chimhinhin@gmail.com',email_verified:false}).firestore();
 await assertSucceeds(setDoc(doc(verified,'system_settings/check'),{ok:true}));await assertFails(setDoc(doc(forged,'system_settings/check'),{ok:true}));
});
