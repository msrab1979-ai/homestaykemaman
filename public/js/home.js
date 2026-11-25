// home.js — Load data dari Firestore & update halaman utama
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";

const cfg = {
  apiKey: "AIzaSyDUjEQ0ApoOqkMzBQrUDwhj2fvALBY9VRI",
  authDomain: "homestaykemaman-dbdcc.firebaseapp.com",
  projectId: "homestaykemaman-dbdcc",
  storageBucket: "homestaykemaman-dbdcc.firebasestorage.app",
  messagingSenderId: "1053265250711",
  appId: "1:1053265250711:web:928e4cf5eb6fe05bf09cd2",
  measurementId: "G-4F29T3NH0M"
};

const app = initializeApp(cfg);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// ===== HELPER: kemaskini semua WA & tel links =====
function updateLinks(noWa, noTel) {
  const waMsg = encodeURIComponent('Salam! Saya ingin tanya tentang Homestay Chukai Utama.');
  document.querySelectorAll('.wa-link').forEach(el => {
    el.href = `https://wa.me/${noWa}?text=${waMsg}`;
  });
  document.querySelectorAll('.tel-link').forEach(el => {
    el.href = `tel:+${noWa}`;
  });
  const footerTel = document.getElementById('footerTel');
  if (footerTel) footerTel.textContent = `📞 ${noTel}`;
}

// ===== LOAD INFO HOMESTAY =====
async function loadInfo() {
  try {
    const snap = await getDoc(doc(db, 'config', 'homestay'));
    if (!snap.exists()) return;
    const d = snap.data();

    // Nama
    if (d.nama) {
      const els = [
        document.getElementById('homeNama'),
        document.getElementById('heroTitle'),
        document.getElementById('footerNama')
      ];
      els.forEach(el => { if (el) el.textContent = d.nama; });
      document.title = `Homestay Kemaman | ${d.nama} — Selesa, Murah & Lengkap`;
    }

    // Tagline
    if (d.tagline) {
      const el = document.getElementById('heroTagline');
      if (el) el.textContent = d.tagline;
    }

    // Alamat
    if (d.alamat) {
      const el = document.getElementById('footerAlamat');
      if (el) el.textContent = d.alamat;
    }

    // WA & Tel links
    if (d.noWa) updateLinks(d.noWa, d.noTel || d.noWa);

    // Kemudahan
    if (d.kemudahan && d.kemudahan.length) {
      const grid = document.getElementById('kmdGrid');
      if (grid) grid.innerHTML = d.kemudahan.map(k => `<li>${k}</li>`).join('');
    }

    // Maps embed (hanya URL embed — link biasa seperti maps.app.goo.gl tidak boleh dibuka dalam iframe)
    if (d.mapsEmbed && /output=embed|\/maps\/embed/.test(d.mapsEmbed)) {
      const frame = document.getElementById('mapsFrame');
      if (frame) frame.src = d.mapsEmbed;
    }

  } catch (err) {
    console.warn('Firestore info error:', err.message);
  }
}

// ===== LOAD GALERI =====
// Gambar sedia ada ditulis terus dalam index.html (data-path = storagePath) supaya Google nampak
// gambar sebenar. Firestore hanya MENAMBAH gambar baharu yang dimuat naik dari panel admin.
async function loadGaleri() {
  try {
    const grid = document.getElementById('galeriGrid');
    if (!grid) return;

    const q = query(collection(db, 'galeri'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) return;

    const sedia = new Set([...grid.querySelectorAll('[data-path]')].map(el => el.dataset.path));
    const baru = snap.docs.map(d => d.data()).filter(img => !sedia.has(img.storagePath));
    if (!baru.length) return;

    const mula = grid.children.length;
    grid.insertAdjacentHTML('beforeend', baru.map((img, i) => `
      <div class="g-item reveal" data-path="${img.storagePath}" onclick="openBox(${mula + i})">
        <img src="${img.url}" alt="${img.caption && !img.caption.startsWith('WhatsApp Image') ? img.caption : `Homestay Chukai Utama Kemaman — gambar ${mula + i + 1}`}" loading="lazy">
      </div>
    `).join(''));

    // Update lightbox array
    window.galeriImgs = [...grid.querySelectorAll('img')].map(img => img.src);

    // Re-observe reveal elements
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal:not(.visible)').forEach(el => ro.observe(el));

  } catch (err) {
    console.warn('Firestore galeri error:', err.message);
  }
}

// ===== TRACK WA clicks =====
document.querySelectorAll('.wa-link').forEach(btn => {
  btn.addEventListener('click', () => logEvent(analytics, 'whatsapp_click'));
});

// ===== INIT =====
loadInfo();
loadGaleri();
