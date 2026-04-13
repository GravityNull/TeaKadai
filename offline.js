/* ================================================================
   TeaKadai – offline.js  |  Service Worker (revamped 2026)
   ================================================================ */

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TeaKadai | Offline</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2em; text-align: center; }
    h1   { color: #354be8; }
  </style>
</head>
<body>
  <h1>You are offline</h1>
  <p>Please check your internet connection.<br>
     Contact: <a href="mailto:roobank1@gmail.com">roobank1@gmail.com</a></p>
</body>
</html>`;

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html;charset=utf-8' } })
    )
  );
});
