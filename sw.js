/* ================================
   CGA PWA SERVICE WORKER
   ================================ */

const CACHE_NAME = "cga-pwa-v3"; 
// 🔴 HER GÜNCELLEMEDE v1 → v2 → v3 DEĞİŞTİR

const CORE_FILES = [

  "/", 
  "/index.html",
  "/manifest.json",

  "/font.ttf",

  "/logo.png",
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


// 🔹 INSTALL
self.addEventListener("install", (event) => {
  console.log("[SW] Install başladı");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_FILES))
  );
});


// 🔹 ACTIVATE
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Eski cache silindi:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});


// 🔹 FETCH  (Network → Cache fallback)
self.addEventListener("fetch", (event) => {

  // sadece GET isteklerini yakala
  if(event.request.method !== "GET") return;

  event.respondWith(

    fetch(event.request)
      .then((response) => {

        // geçerli cevap ise cache güncelle
        if(!response || response.status !== 200 || response.type !== "basic"){
          return response;
        }

        const clone = response.clone();

        caches.open(CACHE_NAME)
          .then((cache)=> cache.put(event.request, clone));

        return response;
      })
      .catch(()=> caches.match(event.request))

  );
});

