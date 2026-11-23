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

    // Maps embed
    if (d.mapsEmbed) {
      const frame = document.getElementById('mapsFrame');
      if (frame) frame.src = d.mapsEmbed;
    }

  } catch (err) {
    console.warn('Firestore info error:', err.message);
  }
}

// ===== LOAD GALERI =====
async function loadGaleri() {
  try {
    const q = query(collection(db, 'galeri'), orderBy('order', 'asc'));
    const snap = await getDocs(q);

    if (snap.empty) return; // kekal placeholder

    const images = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Update lightbox array
    window.galeriImgs = images.map(img => img.url);

    // Render grid
    const grid = document.getElementById('galeriGrid');
    if (!grid) return;

    grid.innerHTML = images.map((img, i) => `
      <div class="g-item reveal" onclick="openBox(${i})">
        <img src="${img.url}" alt="${img.caption && !img.caption.startsWith('WhatsApp Image') ? img.caption : `Homestay Chukai Utama Kemaman — gambar ${i + 1}`}" loading="lazy">
      </div>
    `).join('');

    // Re-observe reveal elements
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  } catch (err) {
    console.warn('Firestore galeri error:', err.message);
    // Set default placeholder images untuk lightbox
    window.galeriImgs = [1,2,3,4,5,6].map(n => `https://picsum.photos/1200/900?random=${n}`);
  }
}

// Set default lightbox jika Firestore belum load
window.galeriImgs = [1,2,3,4,5,6].map(n => `https://picsum.photos/1200/900?random=${n}`);

// ===== TRACK WA clicks =====
document.querySelectorAll('.wa-link').forEach(btn => {
  btn.addEventListener('click', () => logEvent(analytics, 'whatsapp_click'));
});

// ===== INIT =====
loadInfo();
loadGaleri();
