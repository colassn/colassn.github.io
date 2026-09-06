(function () {
'use strict';
const h=React.createElement, {useState,useRef,useEffect}=React;
const change=(fn,value)=>fn&&fn({target:{value},currentTarget:{value}});
const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function Surface({title,onClose,children}) {
 const ref=useRef(null),close=useRef(onClose); close.current=onClose;
 useEffect(()=>{
  const previous=document.activeElement,overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const timer=setTimeout(()=>ref.current?.querySelector('button:not(:disabled),input:not(:disabled)')?.focus(),30);
  const key=e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close.current();}
   if(e.key==='Tab'){
    const all=[...ref.current.querySelectorAll('button:not(:disabled),input:not(:disabled),[tabindex="0"]')].filter(x=>x.getClientRects().length);
    const first=all[0],last=all[all.length-1];
    if(!first){e.preventDefault();return;}
    if(e.shiftKey&&(document.activeElement===first||!ref.current.contains(document.activeElement))){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||!ref.current.contains(document.activeElement))){e.preventDefault();first.focus();}
   }
  };
  document.addEventListener('keydown',key,true);
  return()=>{clearTimeout(timer);document.removeEventListener('keydown',key,true);document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus();};
 },[]);
 return ReactDOM.createPortal(h('div',{className:'su-overlay',onClick:e=>{e.stopPropagation();if(e.target===e.currentTarget)onClose();}},h('section',{ref,className:'su-surface',role:'dialog','aria-modal':true,'aria-label':title},h('header',{className:'su-surface-head'},h('h2',null,title),h('button',{type:'button',className:'su-icon',onClick:onClose,'aria-label':'關閉'},'×')),children)),document.body);
}
function Select({value,onChange,children,disabled,className='',id,name,'aria-label':ariaLabel}){
 const [open,setOpen]=useState(false);const options=React.Children.toArray(children).filter(React.isValidElement);const selected=options.find(x=>String(x.props.value)===String(value));
 return h(React.Fragment,null,h('button',{type:'button',id,name,disabled,className:`${className} su-control`,onClick:()=>setOpen(true),'aria-haspopup':'dialog','aria-expanded':open,'aria-label':ariaLabel},h('span',null,selected?.props.children||'請選擇'),h('span',{'aria-hidden':true},'⌄')),open&&h(Surface,{title:ariaLabel||'選擇項目',onClose:()=>setOpen(false)},h('div',{className:'su-options'},options.map((o,i)=>h('button',{type:'button',key:i,disabled:o.props.disabled,'aria-pressed':String(o.props.value)===String(value),onClick:()=>{change(onChange,o.props.value);setOpen(false);}},o.props.children,String(o.props.value)===String(value)&&h('span',{'aria-hidden':true},'✓'))))));
}
function Calendar({value,onChange,onClose,min,max}){
 const initial=/^\d{4}-\d{2}-\d{2}$/.test(value||'')?new Date(value+'T12:00:00'):new Date();
 const [month,setMonth]=useState(new Date(initial.getFullYear(),initial.getMonth(),1));
 const y=month.getFullYear(),m=month.getMonth(),pad=(month.getDay()+6)%7,days=new Date(y,m+1,0).getDate();
 const choose=v=>{if((min&&v<min)||(max&&v>max))return;change(onChange,v);onClose();};
 return h(Surface,{title:'選擇日期',onClose},h('div',{className:'su-month'},h('button',{type:'button','aria-label':'上一個月',onClick:()=>setMonth(new Date(y,m-1,1))},'‹'),h('strong',{'aria-live':'polite'},`${y} 年 ${m+1} 月`),h('button',{type:'button','aria-label':'下一個月',onClick:()=>setMonth(new Date(y,m+1,1))},'›')),h('div',{className:'su-calendar'},['一','二','三','四','五','六','日'].map(w=>h('span',{key:w,className:'su-weekday'},w)),Array.from({length:pad},(_,i)=>h('span',{key:'pad'+i})),Array.from({length:days},(_,i)=>{const d=i+1,k=dateKey(new Date(y,m,d));return h('button',{type:'button',key:d,disabled:!!((min&&k<min)||(max&&k>max)),'aria-label':k,'aria-pressed':value===k,'aria-current':dateKey(new Date())===k?'date':undefined,onClick:()=>choose(k)},d);})),h('div',{className:'su-date-shortcuts'},[0,1,7].map((n,i)=>{const d=new Date();d.setDate(d.getDate()+n);const k=dateKey(d);return h('button',{type:'button',key:n,disabled:!!((min&&k<min)||(max&&k>max)),onClick:()=>choose(k)},['今天','明天','一星期後'][i]);})));
}
function DateInput({value,onChange,disabled,className='',min,max,id,'aria-label':label}){
 const [open,setOpen]=useState(false);
 return h(React.Fragment,null,h('button',{type:'button',id,disabled,className:`${className} su-control`,'aria-label':label||'選擇交期日期','aria-haspopup':'dialog','aria-expanded':open,onClick:()=>setOpen(true)},h('span',null,value?value.replace(/-/g,' / '):'選擇日期'),h('span',{'aria-hidden':true},'▦')),open&&h(Calendar,{value,onChange,min,max,onClose:()=>setOpen(false)}));
}
function SubjectInput({options=[],value,onChange,className='',...props}){
 const [open,setOpen]=useState(false);
 return h('div',{className:'su-subject'},h('input',{...props,className,value,onChange,'aria-label':'科目名称'}),h('button',{type:'button',className:'su-subject-button','aria-label':'從科目選擇',disabled:props.disabled,onClick:()=>setOpen(true)},'⌄'),open&&h(Surface,{title:'選擇科目',onClose:()=>setOpen(false)},options.length?h('div',{className:'su-options'},options.map((name,i)=>h('button',{key:i,type:'button',onClick:()=>{change(onChange,name);setOpen(false);}},name))):h('p',{className:'su-hint'},'暫時未有科目；你可以直接輸入名稱，或到時間表管理科目。')));
}
function ProfileMenu({name,isAdmin,onSettings,onInbox,onAdmin}){
 const [open,setOpen]=useState(false);const go=fn=>()=>{setOpen(false);fn();};
 return h(React.Fragment,null,h('button',{type:'button',className:'su-avatar','aria-label':'帳戶及設定','aria-haspopup':'dialog','aria-expanded':open,onClick:()=>setOpen(true)},(name||'我').slice(0,1)),open&&h(Surface,{title:name||'我的帳戶',onClose:()=>setOpen(false)},h('div',{className:'su-options'},h('button',{type:'button',onClick:go(onSettings)},'帳戶與設定',h('span',null,'›')),h('button',{type:'button',onClick:go(onInbox)},'邀請與收件匣',h('span',null,'›')),isAdmin&&h('button',{type:'button',onClick:go(onAdmin)},'管理中心',h('span',null,'›')))));
}
function ScheduleTabs({value,onChange}){
 return h('div',{className:'su-schedule-tabs','aria-label':'時間表顯示方式'},[['timetable','每週課堂'],['calendar','功課月曆']].map(([v,label])=>h('button',{type:'button',key:v,'aria-pressed':value===v||(v==='timetable'&&value==='timetable_edit'),onClick:()=>onChange(v)},label)));
}
window.StudyUI={Select,DateInput,SubjectInput,ProfileMenu,ScheduleTabs,Calendar};
})();

/* Independent presentation preference; never writes homework/account data. */
(function(){
'use strict';
const KEY='studyos.designStyle',h=React.createElement;
const styles=[
 {id:'original',name:'原有風格',note:'藍紫漸層 · 熟悉的圓角',colors:['#f6f7fb','#5856d6','#30316d']},
 {id:'japanese',name:'日式簡約',note:'暖白紙感 · 森林綠 · 留白',colors:['#f4f1e9','#356454','#343d34']},
 {id:'chinese',name:'中式雅緻',note:'宣紙米白 · 朱紅 · 墨色',colors:['#f7f0e3','#963f36','#37312b']},
 {id:'european',name:'歐式典雅',note:'象牙白 · 海軍藍 · 金色細線',colors:['#f4f2ed','#304b70','#a7864b']}
];
const valid=id=>styles.some(s=>s.id===id)?id:'original';
function read(){try{return valid(localStorage.getItem(KEY));}catch(e){return 'original';}}
function apply(id){document.documentElement.setAttribute('data-design',valid(id));}
function save(id){apply(id);try{localStorage.setItem(KEY,valid(id));return true;}catch(e){return false;}}
apply(read());
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){apply(read());window.dispatchEvent(new Event('studyos-style-change'));}});
function StylePicker(){
 const [selected,setSelected]=React.useState(read),[message,setMessage]=React.useState('');
 React.useEffect(()=>{const refresh=()=>setSelected(read());window.addEventListener('studyos-style-change',refresh);return()=>window.removeEventListener('studyos-style-change',refresh);},[]);
 const choose=id=>{setSelected(id);const stored=save(id);setMessage(stored?'已套用並記住此裝置的風格。':'已套用；此瀏覽器未能儲存偏好，重新開啟後可能需要再選。');};
 return h('section',{className:'design-picker','aria-label':'設計風格'},
 h('div',{className:'design-picker-heading'},h('div',null,h('h3',null,'設計風格'),h('p',null,'全站即時換裝，功課、位置及操作保持一致。')),h('button',{type:'button',className:'design-reset',onClick:()=>choose('original')},'恢復原有')),
 h('div',{className:'design-grid'},styles.map(s=>h('button',{key:s.id,type:'button',className:'design-choice','aria-pressed':selected===s.id,onClick:()=>choose(s.id)},
 h('span',{className:'design-miniature','aria-hidden':true,style:{background:s.colors[0],'--preview-accent':s.colors[1],'--preview-ink':s.colors[2]}},h('span',{className:'design-mini-head'}),h('span',{className:'design-mini-hero'}),h('span',{className:'design-mini-line'}),h('span',{className:'design-mini-line short'})),
 h('span',{className:'design-choice-title'},s.name,selected===s.id&&h('span',{'aria-hidden':true},' ✓')),h('span',{className:'design-choice-note'},s.note)))),
 h('p',{className:'design-explanation'},'每款支援淺色／深色；下方主題顏色用於原有風格。其他風格使用各自配色，科目及警告顏色保留。'),h('p',{className:'design-status',role:'status','aria-live':'polite'},message));
}
window.StudyUI.StylePicker=StylePicker;
window.StudyDesign={read,save,valid,styles};
})();

(function(){
'use strict';
const h=React.createElement;
function Form({children,onSubmit,onInput,...props}){
 const [error,setError]=React.useState('');
 const submit=e=>{
  e.preventDefault();
  const invalid=Array.from(e.currentTarget.elements).find(x=>x.willValidate&&!x.validity.valid);
  if(invalid){
   const label=invalid.labels?.[0]?.textContent?.trim()||invalid.getAttribute('aria-label')||invalid.placeholder||'此欄位';
   const message=invalid.validity.valueMissing?`請填寫${label}。`:invalid.validity.typeMismatch?'請輸入有效的電郵地址。':invalid.validity.tooShort?'輸入內容太短，請補充後再試。':invalid.validity.rangeUnderflow||invalid.validity.rangeOverflow?'數值超出允許範圍。':'請檢查輸入內容及格式。';
   setError(message);invalid.setAttribute('aria-invalid','true');invalid.focus();return;
  }
  setError('');if(onSubmit)onSubmit(e);
 };
 return h('form',{...props,noValidate:true,onSubmit:submit,onInput:e=>{e.target.removeAttribute('aria-invalid');setError('');if(onInput)onInput(e);}},error&&h('div',{className:'detail-field-error',role:'alert'},error),children);
}
function PasswordInput(props){
 const [shown,setShown]=React.useState(false);
 return h('div',{className:'detail-password'},h('input',{...props,type:shown?'text':'password',className:(props.className||'')+' detail-password-input'}),h('button',{type:'button',className:'detail-password-toggle','aria-label':shown?'隱藏密碼':'顯示密碼','aria-pressed':shown,onClick:()=>setShown(!shown)},shown?'隱藏':'顯示'));
}
const panels=[];
function DialogPanel({children,onClose,...props}){
 const ref=React.useRef(null),close=React.useRef(onClose);close.current=onClose;
 React.useEffect(()=>{
  const node=ref.current,previous=document.activeElement;panels.push(node);
  const timer=setTimeout(()=>{if(panels[panels.length-1]===node)(node.querySelector('input:not(:disabled),textarea:not(:disabled),button:not(:disabled)')||node).focus();},40);
  const key=e=>{
   if(panels[panels.length-1]!==node||document.querySelector('.su-overlay'))return;
   if(e.key==='Escape'&&close.current){e.preventDefault();e.stopPropagation();close.current();}
   if(e.key==='Tab'){
    const all=[...node.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]')].filter(x=>x.getClientRects().length);
    if(!all.length){e.preventDefault();node.focus();return;}
    const first=all[0],last=all[all.length-1];
    if(e.shiftKey&&(document.activeElement===first||!node.contains(document.activeElement))){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||!node.contains(document.activeElement))){e.preventDefault();first.focus();}
   }
  };
  document.addEventListener('keydown',key,true);
  return()=>{clearTimeout(timer);document.removeEventListener('keydown',key,true);const i=panels.indexOf(node);if(i>=0)panels.splice(i,1);if(previous?.isConnected)previous.focus();};
 },[]);
 return h('div',{...props,ref,role:'dialog','aria-modal':true,'aria-label':props['aria-label']||'編輯資料',tabIndex:-1},children);
}
Object.assign(window.StudyUI,{Form,PasswordInput,DialogPanel});
})();
