/* ================================
   CGA FORCE UPDATE PWA SW
   HER DEĞİŞİMDE VERSION ARTIR
   ================================ */

const VERSION = "v1.0.1";   // 🔴 BUNU DEĞİŞTİR → HER UPDATE'TE
const CACHE = "cga-" + VERSION;


// 📦 CACHE DOSYALARI
const FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.png",

  "/font.ttf",

  "/icon-120.png",
  "/icon-152.png",
  "/icon-180.png",
  "/icon-192.png",
  "/icon-512.png",

  "/mobildevriye.html",
  "/mobiltamam.html",

  "/olaylar.html",
  "/sablon.pdf",

  "/sirket.html",
  "/sirketmobil.html",

  "/takip.html",
  "/takip1.html",

  "/tamam.html",
  "/tamammobil.html"
];


// 🔴 INSTALL → yeni sürüm direkt aktif
self.addEventListener("install", e=>{
  self.skipWaiting();

  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(FILES))
  );
});


// 🔴 ACTIVATE → eski cacheleri sil + açık uygulamayı yenile
self.addEventListener("activate", e=>{

  e.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(
        keys.map(k=>{
          if(k!==CACHE) return caches.delete(k);
        })
      );
    })
  );

  self.clients.claim();

  // ⭐ AÇIK PWA VARSA ZORLA YENİLE
  self.clients.matchAll({type:"window"}).then(clients=>{
    clients.forEach(c=>c.navigate(c.url));
  });

});


// 🔴 FETCH → HER ZAMAN SUNUCUDAN AL (cache sadece offline için)
self.addEventListener("fetch", e=>{

  if(e.request.method!=="GET") return;

  e.respondWith(

    fetch(e.request,{cache:"no-store"})   // ⭐ HER ZAMAN TAZE
      .then(res=>{

        const clone=res.clone();

        caches.open(CACHE).then(c=>c.put(e.request,clone));

        return res;

      })
      .catch(()=>caches.match(e.request))

  );

});
