const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const React=require('react'),SSR=require('react-dom/server');

test('compiled collaboration and app coexist in one global context and reach the initial React screen',()=>{
  let mounted=false,markup='';
  const errors=[];
  const window={StudyCore:require('./core'),location:{protocol:'https:',hostname:'example.test'}};
  const ctx=vm.createContext({window,React,
    ReactDOM:{createRoot:()=>({render(element){mounted=true;markup=SSR.renderToString(element);}})},
    document:{getElementById:()=>({})},navigator:{onLine:true},
    console:{...console,error:(...args)=>errors.push(args)},setTimeout,clearTimeout,setInterval,clearInterval});
  for(const file of ['collaboration.js','app.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
  assert.equal(typeof window.StudyCollabUI.Workspace,'function');
  assert.equal(mounted,true);
  assert.deepEqual(errors,[]);
  assert.match(markup,/spinner/);
  assert.equal(vm.runInContext('typeof _excluded',ctx),'undefined','Babel helper declarations must stay inside each script');
});
