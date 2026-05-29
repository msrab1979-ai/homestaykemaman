// =============================================
// HOMESTAY CHUKAI UTAMA KEMAMAN
// Firebase Initialization — Vanilla JS (CDN Modular)
// Project: homestaykemaman-dbdcc
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDUjEQ0ApoOqkMzBQrUDwhj2fvALBY9VRI",
  authDomain: "homestaykemaman-dbdcc.firebaseapp.com",
  projectId: "homestaykemaman-dbdcc",
  storageBucket: "homestaykemaman-dbdcc.firebasestorage.app",
  messagingSenderId: "1053265250711",
  appId: "1:1053265250711:web:928e4cf5eb6fe05bf09cd2",
  measurementId: "G-4F29T3NH0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ===== TRACK EVENTS =====

// Track klik butang WhatsApp
document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
  btn.addEventListener('click', () => {
    logEvent(analytics, 'whatsapp_click', {
      button_location: btn.closest('section')?.id || btn.className,
    });
  });
});

// Track klik pakej bilik
document.querySelectorAll('.pakej-card .btn-wa').forEach(btn => {
  btn.addEventListener('click', () => {
    const pakej = btn.closest('.pakej-card')?.querySelector('h3')?.textContent || 'unknown';
    logEvent(analytics, 'pakej_inquiry', {
      pakej_name: pakej,
    });
  });
});

// Track scroll ke seksyen (engagement)
const sectionNames = {
  utama: 'Hero',
  fasiliti: 'Fasiliti',
  bilik: 'Bilik & Pakej',
  galeri: 'Galeri',
  lokasi: 'Lokasi',
  hubungi: 'Hubungi',
};

const sectionTracker = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (sectionNames[id]) {
        logEvent(analytics, 'section_view', {
          section_name: sectionNames[id],
        });
        sectionTracker.unobserve(entry.target); // track sekali sahaja
      }
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('section[id]').forEach(s => sectionTracker.observe(s));

// Track buka lightbox galeri
const origOpen = window.openLightbox;
window.openLightbox = function(index) {
  logEvent(analytics, 'gallery_open', { image_index: index });
  origOpen(index);
};

console.log('🔥 Firebase Analytics aktif — homestaykemaman-dbdcc');
