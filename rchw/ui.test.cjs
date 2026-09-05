const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const React=require('react'),ReactDOM=require('react-dom/server');
const babel=require('@babel/core');
const C=require('./core');
function components(){
 const window={StudyCore:C,lucide:require('lucide'),qrcode:require('qrcode-generator')};
 vm.runInNewContext(babel.transformSync(fs.readFileSync('collaboration-source.jsx','utf8'),{presets:['@babel/preset-react']}).code,{window,React,ReactDOM,navigator:{},crypto:require('node:crypto')});
 return window.StudyCollabUI;
}
test('collaboration renders actual Lucide icons, groups and account code QR without browser effects',()=>{
 const U=components();const collab={account:{uid:'a',code:'ABCDE',name:'同學',canPublish:true,blocked:[]},groups:[{id:'g',name:'三甲班',description:'功課',members:['a'],ownerUid:'a',managers:[],createdAt:1,state:'active'}],preferences:{g:{sync:true}},inbox:[],unread:0,issued:[],drafts:[]};
 const html=ReactDOM.renderToStaticMarkup(React.createElement(U.Workspace,{collab,user:{uid:'a'},items:[],subjects:[],notify:()=>{},onConfirm:()=>{},onLegacy:()=>{}}));
 assert.match(html,/三甲班/);assert.match(html,/<path/);assert.match(html,/同步已開/);
 const account=ReactDOM.renderToStaticMarkup(React.createElement(U.AccountCard,{collab,notify:()=>{}}));assert.match(account,/ABCDE/);assert.match(account,/viewBox/);
});
test('workspace exposes service errors and retry without a false success state',()=>{
 const U=components();const html=ReactDOM.renderToStaticMarkup(React.createElement(U.Workspace,{collab:{account:null,groups:[],loading:false,error:'測試連線錯誤',retry:()=>{}},user:{uid:'a'}}));
 assert.match(html,/測試連線錯誤/);assert.match(html,/重新連接/);assert.doesNotMatch(html,/同步已開/);
});
