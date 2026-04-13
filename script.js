/* ================================================================
   TeaKadai – GravityNull  |  script.js  (revamped 2026)
   ================================================================ */

/* ---------- Service Worker Registration ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/offline.js')
      .then(reg => {
        reg.onupdatefound = () => {
          reg.installing.onstatechange = function () {
            console.log('[SW] state:', this.state);
          };
        };
      })
      .catch(err => console.warn('[SW] registration failed:', err));
  });
}

/* ---------- Dark Mode Toggle ---------- */
const DARK_KEY = 'tk-theme';

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const btn  = document.getElementById('myBtn');
  const icon = document.getElementById('darkModeIcon');
  if (btn)  btn.setAttribute('aria-pressed', String(dark));
  if (icon) icon.textContent = dark ? 'light_mode' : 'dark_mode';
}

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = !isDark;
  applyTheme(next);
  try { localStorage.setItem(DARK_KEY, next ? 'dark' : 'light'); } catch (_) {}
}

// Restore saved preference (or honour OS preference)
(function () {
  let saved;
  try { saved = localStorage.getItem(DARK_KEY); } catch (_) {}
  if (saved) {
    applyTheme(saved === 'dark');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme(true);
  }
})();

/* ---------- PWA Install Prompt ---------- */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  if (deferredPrompt) return;
  e.preventDefault();
  deferredPrompt = e;
  console.log('[PWA] Install prompt captured');
  showInstallButton();
});

function showInstallButton() {
  const btn = document.querySelector('#pwa-install');
  if (!btn) return;
  btn.classList.remove('hidden');
  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] User choice:', outcome);
    deferredPrompt = null;
  });
}

/* ---------- Scroll: progress bar + back-to-top visibility ---------- */
window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  // Progress bar
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const bar = document.getElementById('myBar');
  if (bar && height > 0) bar.style.width = ((winScroll / height) * 100) + '%';

  // Home button visibility (show when scrolled > 20px)
  const homeBtn = document.getElementById('myBtn');
  if (homeBtn) homeBtn.style.display = winScroll > 20 ? 'flex' : 'none';
}

/* ---------- Scroll to top ---------- */
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
/* ---------- Snackbar / Toast ---------- */
function showSnackbar() {
  var x = document.getElementById("snackbar");
  if (!x) return;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 1000);
}

/* ---------- Tab Navigation ---------- */
function openPage(pageName, elmnt, color) {
  const tabs = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabs.length; i++) tabs[i].style.display = 'none';

  const links = document.getElementsByClassName('tablink');
  for (let i = 0; i < links.length; i++) links[i].style.backgroundColor = '';

  const page = document.getElementById(pageName);
  if (page) page.style.display = 'block';
  if (elmnt) elmnt.style.backgroundColor = color;
}

// Open default tab
document.addEventListener('DOMContentLoaded', () => {
  const def = document.getElementById('defaultOpen');
  if (def) def.click();
});

/* ---------- Side Navigation ---------- */
function openNav() {
  const nav = document.getElementById('mySidenav');
  if (nav) nav.style.width = '355px';
}
function closeNav() {
  const nav = document.getElementById('mySidenav');
  if (nav) nav.style.width = '0';
}

/* ---------- Info Panel Toggle ---------- */
(function () {
  const chatBtns = document.getElementsByClassName('chat');
  for (let i = 0; i < chatBtns.length; i++) {
    chatBtns[i].addEventListener('click', function () {
      const panel = this.nextElementSibling;
      if (!panel) return;
      const isOpen = panel.style.display === 'block';
      panel.style.display = isOpen ? 'none' : 'block';
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  }
})();

/* ---------- Ribbon / Accordion ---------- */
(function () {
  const accordions = document.getElementsByClassName('accordion');
  for (let i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener('click', function () {
      const panel = this.nextElementSibling;
      if (!panel) return;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        this.setAttribute('aria-expanded', 'false');
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        this.setAttribute('aria-expanded', 'true');
      }
    });
  }
})();

/* ---------- Live Clock ---------- */
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function updateClock() {
  const d = new Date();
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const text = `${h}:${m}:${s} ${ampm}  ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  // Update both clock display elements
  ['clockbox', 'clockDisplay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
}

updateClock();
setInterval(updateClock, 1000);
