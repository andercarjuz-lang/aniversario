// Guarda la página en el teléfono para que abra rápido y funcione sin internet.
const CACHE = "alexia-v1";
const FILES = [
  "./", "./index.html", "./manifest.json",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png",
  "./fotos/abrazo_manta.jpg", "./fotos/arriba.jpg", "./fotos/auto_espejo.jpg", "./fotos/barco_atardecer.jpg",
  "./fotos/barco_mejilla.jpg", "./fotos/bosque.jpg", "./fotos/coronas.jpg", "./fotos/espejo.jpg",
  "./fotos/feria_beso.jpg", "./fotos/feria_mejilla.jpg", "./fotos/halloween.jpg", "./fotos/hotel.jpg",
  "./fotos/mariachi.jpg", "./fotos/nieve.jpg", "./fotos/pizarron.jpg", "./fotos/playa.jpg", "./fotos/restaurante.jpg"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || req.headers.has("range")) return;          // el video se transmite normal
  const url = new URL(req.url);
  if (url.origin !== location.origin && !url.host.includes("fonts.g")) return;
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok && !url.pathname.endsWith(".mp4")){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
