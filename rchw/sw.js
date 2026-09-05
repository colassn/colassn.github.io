const CACHE_NAME = 'ehandbook-studyos-v3-2-0-spark1';
const APP_SHELL = ['./spark.js?v=3.2.0-spark1','./index.html','./app.js?v=3.2.0-spark1','./collaboration.js?v=3.2.0-spark1','./collaboration.css?v=3.2.0-spark1','./core.js?v=3.2.0-spark1','./tailwind.css?v=3.2.0-spark1','./react.js','./react-dom.js','./lucide.js','./qrcode.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('ehandbook-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET')return;
  if(url.pathname.startsWith('/__/auth/')||url.pathname.startsWith('/__/firebase/'))return;
  const firebaseModule=url.origin==='https://www.gstatic.com'&&url.pathname.startsWith('/firebasejs/11.6.1/');
  if(url.origin!==self.location.origin&&!firebaseModule)return;
  const allowed=url.origin===self.location.origin&&(request.mode==='navigate'||APP_SHELL.some(p=>new URL(p,self.location.href).pathname===url.pathname));
  if(!allowed&&!firebaseModule)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME),key=request.mode==='navigate'?'./index.html':request;
    try {
      const response=await fetch(request);
      if(response.ok)await cache.put(key,response.clone());
      return response;
    } catch(e) {
      const cached=await cache.match(key,{ignoreSearch:true});
      return cached||new Response('目前離線，請連線後重新開啟。',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
    }
  })());
});
