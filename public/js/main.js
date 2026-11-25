'use strict';

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 60);
  }, { passive: true });
}

// ===== BURGER =====
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('.drawer-a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const offset = 70;
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

// ===== SCROLL REVEAL =====
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ===== LIGHTBOX =====
window.galeriImgs = [...document.querySelectorAll('#galeriGrid img')].map(img => img.src);
let cur = 0;
const lbox = document.getElementById('lbox');
const lboxImg = document.getElementById('lboxImg');

function openBox(i) {
  if (!window.galeriImgs.length) return;
  cur = i;
  lboxImg.src = window.galeriImgs[i];
  lbox.classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeBox() {
  lbox.classList.remove('on');
  document.body.style.overflow = '';
}
function moveBox(d) {
  if (!window.galeriImgs.length) return;
  cur = (cur + d + window.galeriImgs.length) % window.galeriImgs.length;
  lboxImg.style.opacity = '0';
  setTimeout(() => { lboxImg.src = window.galeriImgs[cur]; lboxImg.style.opacity = '1'; }, 150);
}
document.addEventListener('keydown', e => {
  if (!lbox || !lbox.classList.contains('on')) return;
  if (e.key === 'Escape') closeBox();
  if (e.key === 'ArrowLeft') moveBox(-1);
  if (e.key === 'ArrowRight') moveBox(1);
});
window.openBox = openBox;
window.closeBox = closeBox;
window.moveBox = moveBox;

// ===== GEAR ICON — log masuk Google di admin.html =====
const gearBtn = document.getElementById('gearBtn');
if (gearBtn) gearBtn.addEventListener('click', () => { window.location.href = '/admin.html'; });
