'use strict';
const CACHE='jills-closet-v15-20261004-2';
const ASSETS=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./jillzcloset.png','./icon-192.png','./icon-512.png'];
const assetURLs=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('jills-closet-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Keep a coherent version of the app shell. Only cache public, listed assets.
self.addEventListener('fetch',event=>{const r=event.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;if(r.mode==='navigate'&&new URL(r.url).href.startsWith(self.registration.scope)){event.respondWith(caches.open(CACHE).then(c=>c.match('./index.html')).then(cached=>cached||fetch(r)));return;}if(assetURLs.has(r.url))event.respondWith(caches.open(CACHE).then(c=>c.match(r)).then(cached=>cached||fetch(r)));});
