// admin.js — Admin Panel Logic
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Mesti sama dengan e-mel dalam firestore.rules & storage.rules
const ADMIN_EMAIL = 'msrab1979@gmail.com';
document.body.style.visibility = 'hidden';

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
const storage = getStorage(app);
const auth = getAuth(app);

// ===== AUTH CHECK — rules yang sebenarnya menghalang tulis; ini cuma UI =====
onAuthStateChanged(auth, async user => {
  if (user && user.email === ADMIN_EMAIL) {
    document.body.style.visibility = '';
    return;
  }
  if (user) {
    alert(`Akaun ${user.email} bukan admin.`);
    await signOut(auth);
    window.location.href = '/';
    return;
  }
  // Popup perlu klik pengguna, kalau tidak browser sekat
  document.body.innerHTML = '<button id="loginBtn" class="a-btn-save" style="margin:20vh auto;display:block">🔐 Log masuk dengan Google</button>';
  document.body.style.visibility = '';
  document.getElementById('loginBtn').addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      location.reload();
    } catch (err) {
      alert('Login gagal: ' + err.code);
    }
  });
});

// ===== LOGOUT =====
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = '/';
});

// ===== TAB SWITCH =====
window.switchTab = function(tab) {
  document.getElementById('sectionInfo').classList.toggle('hidden', tab !== 'info');
  document.getElementById('sectionGaleri').classList.toggle('hidden', tab !== 'galeri');
  document.getElementById('tabInfo').classList.toggle('active', tab === 'info');
  document.getElementById('tabGaleri').classList.toggle('active', tab === 'galeri');
};

// =============================================
// TAB INFO — Load & Save
// =============================================

const DEFAULTS = {
  nama: 'Homestay Chukai Utama',
  tagline: 'Homestay di Kemaman yang selesa, bersih & lengkap untuk keluarga anda',
  alamat: '15295 Taman Pandan, Jalan Cukai Utama 2, 24000 Chukai, Kemaman, Terengganu',
  noWa: '60199761693',
  noTel: '+60X-XXXXXXXX',
  kemudahan: ['❄️ Air Cond', '🍳 Dapur Lengkap', '🚗 Parking Luas', '📺 TV Astro NJOI', '🛏️ 3 Bilik Tidur', '🚿 2 Bilik Air', '💧 Penapis Air Cuckoo'],
  mapsEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=103.40558%2C4.21524%2C103.42958%2C4.23124&layer=mapnik&marker=4.223241%2C103.41758'
};

let currentData = { ...DEFAULTS };

async function loadInfo() {
  try {
    const snap = await getDoc(doc(db, 'config', 'homestay'));
    if (snap.exists()) currentData = { ...DEFAULTS, ...snap.data() };
  } catch (e) {
    console.warn('Load info error:', e.message);
  }
  populateForm();
}

function populateForm() {
  document.getElementById('fNama').value = currentData.nama || '';
  document.getElementById('fTagline').value = currentData.tagline || '';
  document.getElementById('fAlamat').value = currentData.alamat || '';
  document.getElementById('fNoWa').value = currentData.noWa || '';
  document.getElementById('fNoTel').value = currentData.noTel || '';
  document.getElementById('fMaps').value = currentData.mapsEmbed || '';
  renderKmd(currentData.kemudahan || []);
}

// Kemudahan items
function renderKmd(list) {
  const container = document.getElementById('kmdContainer');
  container.innerHTML = '';
  list.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'kmd-item';
    row.innerHTML = `
      <input type="text" value="${item}" placeholder="Contoh: 📶 WiFi Percuma" data-idx="${i}">
      <button type="button" class="kmd-del" data-idx="${i}" title="Padam">×</button>
    `;
    container.appendChild(row);
  });
  container.querySelectorAll('.kmd-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = +btn.dataset.idx;
      const items = getKmdValues();
      items.splice(idx, 1);
      renderKmd(items);
    });
  });
}

function getKmdValues() {
  return [...document.querySelectorAll('#kmdContainer .kmd-item input')].map(i => i.value.trim()).filter(Boolean);
}

document.getElementById('kmdAdd').addEventListener('click', () => {
  const items = getKmdValues();
  items.push('');
  renderKmd(items);
  const inputs = document.querySelectorAll('#kmdContainer .kmd-item input');
  if (inputs.length) inputs[inputs.length - 1].focus();
});

// Save info
document.getElementById('infoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('saveBtn');
  const status = document.getElementById('saveStatus');
  btn.disabled = true;
  document.getElementById('saveTxt').textContent = 'Menyimpan...';
  status.textContent = '';
  status.className = 'save-status';

  const data = {
    nama: document.getElementById('fNama').value.trim(),
    tagline: document.getElementById('fTagline').value.trim(),
    alamat: document.getElementById('fAlamat').value.trim(),
    noWa: document.getElementById('fNoWa').value.trim().replace(/\D/g, ''),
    noTel: document.getElementById('fNoTel').value.trim(),
    mapsEmbed: document.getElementById('fMaps').value.trim(),
    kemudahan: getKmdValues(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(doc(db, 'config', 'homestay'), data, { merge: true });
    status.textContent = '✅ Berjaya disimpan!';
    status.className = 'save-status ok';
    currentData = { ...data };
    setTimeout(() => { status.textContent = ''; }, 4000);
  } catch (err) {
    status.textContent = '❌ Gagal: ' + err.message;
    status.className = 'save-status err';
  }

  btn.disabled = false;
  document.getElementById('saveTxt').textContent = '💾 Simpan Maklumat';
});

// =============================================
// TAB GALERI — Load, Upload, Delete
// =============================================

let galeriDocs = [];

async function loadGaleri() {
  const grid = document.getElementById('gAdminGrid');
  const empty = document.getElementById('gEmpty');
  try {
    const q = query(collection(db, 'galeri'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    galeriDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderGaleriAdmin();
  } catch (err) {
    console.warn('Load galeri error:', err.message);
  }
}

function renderGaleriAdmin() {
  const grid = document.getElementById('gAdminGrid');
  const empty = document.getElementById('gEmpty');
  const count = document.getElementById('galeriCount');
  count.textContent = `Gambar: ${galeriDocs.length}`;

  if (!galeriDocs.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    grid.appendChild(empty);
    return;
  }
  empty.style.display = 'none';

  // Keep empty div, rebuild items
  grid.innerHTML = '';
  galeriDocs.forEach((img) => {
    const item = document.createElement('div');
    item.className = 'g-admin-item';
    item.dataset.id = img.id;
    item.innerHTML = `
      <img src="${img.url}" alt="${img.caption || ''}" loading="lazy">
      <div class="g-admin-overlay">
        <button class="g-del-btn" title="Padam gambar">🗑</button>
      </div>
    `;
    item.querySelector('.g-del-btn').addEventListener('click', () => deleteImage(img));
    grid.appendChild(item);
  });
}

// Upload
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const uploadProgress = document.getElementById('uploadProgress');
const progressBar = document.getElementById('progressBar');
const progressTxt = document.getElementById('progressTxt');

// Drag & drop
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag');
  const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
  if (files.length) uploadFiles(files);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) uploadFiles([...fileInput.files]);
  fileInput.value = '';
});

async function uploadFiles(files) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const valid = files.filter(f => {
    if (f.size > maxSize) { alert(`${f.name} melebihi 5MB. Sila kompres dahulu.`); return false; }
    return true;
  });
  if (!valid.length) return;

  uploadProgress.classList.remove('hidden');
  let done = 0;

  for (const file of valid) {
    progressTxt.textContent = `Memuat naik ${done + 1} / ${valid.length}...`;
    progressBar.style.width = `${(done / valid.length) * 100}%`;

    try {
      // Add placeholder card
      const placeholder = addPlaceholderCard();

      const filename = `galeri/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, filename);
      const task = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        task.on('state_changed',
          snap => {
            const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            progressBar.style.width = `${((done / valid.length) + (pct / 100 / valid.length)) * 100}%`;
          },
          reject,
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            const newDoc = await addDoc(collection(db, 'galeri'), {
              url, storagePath: filename,
              caption: file.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '),
              order: Date.now(),
              createdAt: serverTimestamp()
            });
            galeriDocs.push({ id: newDoc.id, url, storagePath: filename, order: Date.now() });
            placeholder.remove();
            resolve();
          }
        );
      });
      done++;
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Gagal muat naik ${file.name}: ${err.message}`);
    }
  }

  progressBar.style.width = '100%';
  progressTxt.textContent = `✅ ${done} gambar berjaya dimuat naik!`;
  renderGaleriAdmin();
  setTimeout(() => {
    uploadProgress.classList.add('hidden');
    progressBar.style.width = '0%';
  }, 2500);
}

function addPlaceholderCard() {
  const grid = document.getElementById('gAdminGrid');
  const item = document.createElement('div');
  item.className = 'g-admin-item';
  item.innerHTML = `<div class="g-upload-indicator"><div class="spinner"></div><span>Memuat naik...</span></div>`;
  grid.appendChild(item);
  return item;
}

async function deleteImage(img) {
  if (!confirm('Padam gambar ini?')) return;
  try {
    // Padam dari Firestore
    await deleteDoc(doc(db, 'galeri', img.id));
    // Padam dari Storage
    if (img.storagePath) {
      try { await deleteObject(ref(storage, img.storagePath)); } catch (_) {}
    }
    galeriDocs = galeriDocs.filter(d => d.id !== img.id);
    renderGaleriAdmin();
  } catch (err) {
    alert('Gagal padam: ' + err.message);
  }
}

// ===== INIT =====
loadInfo();
loadGaleri();
