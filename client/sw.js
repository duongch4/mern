/* eslint-disable no-console */
const CACHE_NAME = "version-1";
const CACHE_URLS = ["index.html", "offline.html"]; // all must be accessible!!

// Install SW
this.addEventListener("install", async (_event) => {
    try {
        const cache = await caches.open(CACHE_NAME);
        console.log("Opened cache");
        cache.addAll(CACHE_URLS);
    }
    catch (err) {
        console.error(err);
    }
});

// Listen for Requests
this.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => fetch(event.request))
            .catch(() => caches.match("offline.html"))
    )
});

// Activate the SW
this.addEventListener("activate", (event) => {
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => cacheWhiteList.includes(cacheName) ? cacheName : caches.delete(cacheName))
        ))
    )
});
