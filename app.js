// ==========================================
// PACKAGED SUPABASE CONFIG & CONSTANTS
// ==========================================
const SUPABASE_CONFIG = {
  url: 'https://piqtjrmkvrdnfzimwvyk.supabase.co',
  key: 'sb_publishable_JUbW6i8EybZSAouF94vRaA_K0dIrkZe',
  table: 'transaksi_part'
};

const STORAGE_KEYS = {
  PROFILE: 'teknisi_profile_data',
  HISTORY: 'teknisi_scan_history',
  SAVED_LOGIN: 'teknisi_saved_login',
  SESSION: 'teknisi_current_session',
  THEME: 'teknisi_app_theme'
};

let state = {
  isLoggedIn: false,
  theme: 'dark', // 'dark' | 'light'
  modalAction: null, // 'submit' | 'logout'
  profile: {
    id: '',
    nama: '',
    nik: '',
    psw: '',
    usePsw: true
  },
  draftList: [],
  history: [],
  html5Qrcode: null,
  isScanning: false,
  supabaseClient: null,
  realtimeChannel: null
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const DOM = {
  appRoot: document.getElementById('app-root'),
  
  // Screens
  screenLogin: document.getElementById('screen-login'),
  screenApp: document.getElementById('screen-app'),
  
  // Login Form Elements
  formLogin: document.getElementById('form-login'),
  loginUsername: document.getElementById('login-username'),
  loginPassword: document.getElementById('login-password'),
  btnLoginPswToggle: document.getElementById('btn-login-psw-toggle'),
  loginPswEye: document.getElementById('login-psw-eye'),
  rememberMe: document.getElementById('remember-me'),
  btnDoLogin: document.getElementById('btn-do-login'),
  
  // App Navigation & Tabs
  navItems: document.querySelectorAll('.nav-item'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  // App Header
  headerNama: document.getElementById('header-nama'),
  headerNik: document.getElementById('header-nik'),
  headerPswStatus: document.getElementById('header-psw-status'),
  headerPswText: document.getElementById('header-psw-text'),
  
  // Dedicated Profile Display
  profDispNama: document.getElementById('prof-disp-nama'),
  profDispNik: document.getElementById('prof-disp-nik'),
  btnLogout: document.getElementById('btn-logout'),
  
  // Theme Buttons
  btnThemeDark: document.getElementById('btn-theme-dark'),
  btnThemeLight: document.getElementById('btn-theme-light'),
  
  // Scan & Camera
  btnToggleCamera: document.getElementById('btn-toggle-camera'),
  btnSimulasiScan: document.getElementById('btn-simulasi-scan'),
  readerContainer: document.getElementById('reader-container'),
  
  // Manual Add Line
  inputNoGudang: document.getElementById('input-no-gudang'),
  btnClearGudang: document.getElementById('btn-clear-gudang'),
  btnAddManual: document.getElementById('btn-add-manual'),
  
  // Draft List (Pre-Submit Review)
  draftCount: document.getElementById('draft-count'),
  draftListContainer: document.getElementById('draft-list-container'),
  btnSubmit: document.getElementById('btn-submit'),
  btnSubmitText: document.getElementById('btn-submit-text'),
  
  // Modal Popup Confirmation
  modalConfirm: document.getElementById('modal-confirm'),
  modalConfirmTitle: document.getElementById('modal-confirm-title'),
  modalConfirmMsg: document.getElementById('modal-confirm-msg'),
  modalConfirmOkText: document.getElementById('modal-confirm-ok-text'),
  btnModalClose: document.getElementById('btn-modal-close'),
  btnConfirmCancel: document.getElementById('btn-confirm-cancel'),
  btnConfirmOk: document.getElementById('btn-confirm-ok'),
  
  // Blocking Queue Modal (No buttons)
  modalQueue: document.getElementById('modal-queue'),
  modalQueueMsg: document.getElementById('modal-queue-msg'),
  queueStatusText: document.getElementById('queue-status-text'),
  
  // Profile Form
  profileNama: document.getElementById('profile-nama'),
  profileNik: document.getElementById('profile-nik'),
  profilePsw: document.getElementById('profile-psw'),
  profilePswToggle: document.getElementById('profile-psw-toggle'),
  btnSaveProfile: document.getElementById('btn-save-profile'),
  btnTogglePswVisibility: document.getElementById('btn-toggle-psw-visibility'),
  pswEyeIcon: document.getElementById('psw-eye-icon'),
  
  // History
  historyList: document.getElementById('history-list'),
  btnClearHistory: document.getElementById('btn-clear-history'),
  
  // Toast
  toastContainer: document.getElementById('toast-container')
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  loadStoredData();
  applyTheme(state.theme);
  initSupabaseClient();
  setupEventListeners();
  checkLoginSession();
});

function loadStoredData() {
  // Load Theme
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) state.theme = savedTheme;

  // Load Saved Login Credentials
  const savedLogin = localStorage.getItem(STORAGE_KEYS.SAVED_LOGIN);
  if (savedLogin) {
    try {
      const parsed = JSON.parse(savedLogin);
      DOM.loginUsername.value = parsed.username || '';
      DOM.loginPassword.value = parsed.password || '';
      DOM.rememberMe.checked = !!parsed.remember;
    } catch (e) {}
  }

  // Load Profile Data
  const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (storedProfile) {
    try { state.profile = JSON.parse(storedProfile); } catch (e) {}
  }

  // Load Scan History
  const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
  if (storedHistory) {
    try { state.history = JSON.parse(storedHistory); } catch (e) {}
  }
}

function applyTheme(themeName) {
  state.theme = themeName;
  localStorage.setItem(STORAGE_KEYS.THEME, themeName);

  document.documentElement.setAttribute('data-theme', themeName);
  document.body.setAttribute('data-theme', themeName);
  DOM.appRoot.setAttribute('data-theme', themeName);

  if (DOM.btnThemeDark && DOM.btnThemeLight) {
    DOM.btnThemeDark.classList.toggle('active', themeName === 'dark');
    DOM.btnThemeLight.classList.toggle('active', themeName === 'light');
  }
}

function initSupabaseClient() {
  if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.key && window.supabase) {
    try {
      state.supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
      console.log('Client Supabase berhasil diinisialisasi:', SUPABASE_CONFIG.url);
    } catch (err) {
      console.error('Gagal inisialisasi Supabase:', err);
      state.supabaseClient = null;
    }
  } else {
    state.supabaseClient = null;
  }
}

function checkLoginSession() {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed.isLoggedIn && parsed.nik) {
        state.isLoggedIn = true;
        syncProfileFromSupabase(parsed.nik);
        showAppScreen();
        return;
      }
    } catch (e) {}
  }

  showLoginScreen();
}

function showLoginScreen() {
  state.isLoggedIn = false;
  DOM.screenLogin.classList.add('active');
  DOM.screenApp.classList.remove('active');
  stopScanner();
  unsubscribeRealtime();
  if (state.globalQueuePollTimer) {
    clearInterval(state.globalQueuePollTimer);
    state.globalQueuePollTimer = null;
  }
  if (state.globalQueueChannel && state.supabaseClient) {
    state.supabaseClient.removeChannel(state.globalQueueChannel);
    state.globalQueueChannel = null;
  }
}

function showAppScreen() {
  DOM.screenLogin.classList.remove('active');
  DOM.screenApp.classList.add('active');

  updateUIFromState();
  subscribeRealtimeSettings();
  subscribeGlobalQueueRealtime();
  startScanner();
}

// Subscribe to Supabase Realtime changes for user settings
function subscribeRealtimeSettings() {
  if (!state.supabaseClient || !state.profile.nik) return;
  
  unsubscribeRealtime();

  state.realtimeChannel = state.supabaseClient
    .channel('public:users_teknisi')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'users_teknisi', filter: `nik=eq.${state.profile.nik}` },
      (payload) => {
        console.log('Realtime User Settings Update dari Supabase:', payload.new);
        if (payload.new) {
          state.profile.id = payload.new.id || state.profile.id;
          state.profile.usePsw = payload.new.use_password;
          state.profile.nama = payload.new.nama || state.profile.nama;
          state.profile.nik = payload.new.nik || state.profile.nik;
          state.profile.psw = payload.new.password || state.profile.psw;
          saveProfileSilently();
          updateUIFromState();
        }
      }
    )
    .subscribe();
}

function unsubscribeRealtime() {
  if (state.realtimeChannel && state.supabaseClient) {
    state.supabaseClient.removeChannel(state.realtimeChannel);
    state.realtimeChannel = null;
  }
}

async function syncProfileFromSupabase(nik) {
  if (!state.supabaseClient) return;

  try {
    const { data, error } = await state.supabaseClient
      .from('users_teknisi')
      .select('*')
      .eq('nik', nik)
      .single();

    if (data) {
      state.profile.id = data.id;
      state.profile.nik = data.nik;
      state.profile.nama = data.nama;
      state.profile.psw = data.password;
      state.profile.usePsw = data.use_password;
      saveProfileSilently();
      updateUIFromState();
    }
  } catch (err) {
    console.warn('Sync profile error:', err);
  }
}

function updateUIFromState() {
  // Update Header & Dedicated Profile Page
  DOM.headerNama.textContent = state.profile.nama || 'Teknisi (Belum Diset)';
  DOM.headerNik.innerHTML = `<i data-lucide="id-card"></i> NIK: ${state.profile.nik || '-'}`;

  if (DOM.headerPswText && DOM.headerPswStatus) {
    DOM.headerPswText.textContent = `PSW: ${state.profile.usePsw ? 'ON' : 'OFF'}`;
    DOM.headerPswStatus.classList.toggle('off', !state.profile.usePsw);
  }

  DOM.profDispNama.textContent = state.profile.nama || 'Teknisi Anonim';
  DOM.profDispNik.textContent = `NIK: ${state.profile.nik || '-'}`;

  // Update Profile Form Fields
  DOM.profileNama.value = state.profile.nama || '';
  DOM.profileNik.value = state.profile.nik || '';
  DOM.profilePsw.value = state.profile.psw || '';
  DOM.profilePswToggle.checked = !!state.profile.usePsw;

  // Render Draft & History Lists
  renderDraftList();
  renderHistory();
  
  lucide.createIcons();
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  // Theme Buttons
  DOM.btnThemeDark.addEventListener('click', () => applyTheme('dark'));
  DOM.btnThemeLight.addEventListener('click', () => applyTheme('light'));

  // Login Password Eye Toggle
  DOM.btnLoginPswToggle.addEventListener('click', () => {
    const isPsw = DOM.loginPassword.type === 'password';
    DOM.loginPassword.type = isPsw ? 'text' : 'password';
  });

  // Login Submit Buttons
  DOM.btnDoLogin.addEventListener('click', handleLogin);

  // Logout Button
  DOM.btnLogout.addEventListener('click', handleLogout);

  // Navigation Tabs
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.getAttribute('data-target'));
    });
  });

  // Camera Scanner Buttons
  DOM.btnToggleCamera.addEventListener('click', toggleScanner);
  DOM.btnSimulasiScan.addEventListener('click', simulateScan);

  // Manual Add Line
  DOM.btnAddManual.addEventListener('click', handleAddManualItem);
  DOM.inputNoGudang.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddManualItem();
  });

  DOM.btnClearGudang.addEventListener('click', () => {
    DOM.inputNoGudang.value = '';
    DOM.inputNoGudang.focus();
  });

  // Submit Button Triggers Centered Confirmation Modal Popup
  DOM.btnSubmit.addEventListener('click', openSubmitConfirmModal);
  if (DOM.btnModalClose) DOM.btnModalClose.addEventListener('click', closeSubmitConfirmModal);
  DOM.btnConfirmCancel.addEventListener('click', closeSubmitConfirmModal);
  DOM.btnConfirmOk.addEventListener('click', handleConfirmModalOk);

  // Profile Save
  DOM.btnSaveProfile.addEventListener('click', handleSaveProfileRealtime);
  DOM.profilePswToggle.addEventListener('change', handleTogglePasswordRealtime);

  // Password Visibility Toggle in Profile
  DOM.btnTogglePswVisibility.addEventListener('click', () => {
    const isPsw = DOM.profilePsw.type === 'password';
    DOM.profilePsw.type = isPsw ? 'text' : 'password';
  });

  // Clear History
  DOM.btnClearHistory.addEventListener('click', openClearHistoryConfirmModal);
}

// ==========================================
// UNIFORM MODAL POPUP CONFIRMATION FLOW (YA / TIDAK)
// ==========================================
function openSubmitConfirmModal() {
  if (state.draftList.length === 0) return;
  state.modalAction = 'submit';

  DOM.modalConfirmTitle.innerHTML = `<i data-lucide="help-circle"></i> Konfirmasi Kirim Data`;
  DOM.modalConfirmMsg.textContent = 'Apakah Anda Yakin Melakukan Request?';
  DOM.modalConfirmOkText.textContent = 'Ya, Kirim Data';
  DOM.modalConfirm.classList.add('active');
  lucide.createIcons();
}

function openLogoutConfirmModal() {
  state.modalAction = 'logout';

  DOM.modalConfirmTitle.innerHTML = `<i data-lucide="log-out"></i> Konfirmasi Keluar`;
  DOM.modalConfirmMsg.textContent = 'Apakah Anda Yakin Ingin Keluar Akun?';
  DOM.modalConfirmOkText.textContent = 'Ya, Keluar';
  DOM.modalConfirm.classList.add('active');
  lucide.createIcons();
}

function openClearHistoryConfirmModal() {
  if (!state.history || state.history.length === 0) {
    showToast('Riwayat sudah kosong', 'info');
    return;
  }
  state.modalAction = 'clearHistory';

  DOM.modalConfirmTitle.innerHTML = `<i data-lucide="trash-2"></i> Konfirmasi Hapus Riwayat`;
  DOM.modalConfirmMsg.textContent = 'Apakah Anda Yakin Ingin Menghapus Semua Riwayat?';
  DOM.modalConfirmOkText.textContent = 'Ya, Hapus';
  DOM.modalConfirm.classList.add('active');
  lucide.createIcons();
}

function closeSubmitConfirmModal() {
  DOM.modalConfirm.classList.remove('active');
}

async function handleConfirmModalOk() {
  const currentAction = state.modalAction;
  closeSubmitConfirmModal();

  if (currentAction === 'submit') {
    await handleSubmitBatchToSupabase();
  } else if (currentAction === 'logout') {
    performLogout();
  } else if (currentAction === 'clearHistory') {
    performClearHistory();
  }
}

// ==========================================
// REALTIME PROFILE & SETTINGS UPDATES TO SUPABASE
// ==========================================

// Handle Save Profile (Nama, NIK, Password) -> Realtime Supabase Update
async function handleSaveProfileRealtime() {
  const oldNik = state.profile.nik;
  const newNama = DOM.profileNama.value.trim();
  const newNik = DOM.profileNik.value.trim();
  const newPsw = DOM.profilePsw.value.trim();
  const newUsePsw = DOM.profilePswToggle.checked;

  if (!newNama) {
    showToast('Nama Teknisi tidak boleh kosong!', 'error');
    DOM.profileNama.focus();
    return;
  }
  if (!newNik) {
    showToast('NIK Teknisi tidak boleh kosong!', 'error');
    DOM.profileNik.focus();
    return;
  }

  DOM.btnSaveProfile.disabled = true;
  DOM.btnSaveProfile.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Memperbarui...`;
  lucide.createIcons();

  try {
    if (state.supabaseClient) {
      let query = state.supabaseClient
        .from('users_teknisi')
        .update({
          nama: newNama,
          nik: newNik,
          password: newPsw,
          use_password: newUsePsw,
          updated_at: new Date().toISOString()
        });

      if (state.profile.id) {
        query = query.eq('id', state.profile.id);
      } else {
        query = query.eq('nik', oldNik);
      }

      const { data, error } = await query.select();

      if (error) throw error;

      if (data && data.length > 0) {
        state.profile.id = data[0].id;
        state.profile.nik = data[0].nik;
        state.profile.nama = data[0].nama;
        state.profile.psw = data[0].password;
        state.profile.usePsw = data[0].use_password;
      }
    }

    state.profile.nama = newNama;
    state.profile.nik = newNik;
    state.profile.psw = newPsw;
    state.profile.usePsw = newUsePsw;

    saveProfileSilently();

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
      isLoggedIn: true,
      nik: newNik,
      loginAt: new Date().toISOString()
    }));

    updateUIFromState();
    subscribeRealtimeSettings();

    showToast('⚡ Profil Berhasil Terupdate!', 'success');

  } catch (err) {
    console.error('Error Update Profil:', err);
    showToast(`Gagal simpan profil: ${err.message}`, 'error');
  } finally {
    DOM.btnSaveProfile.disabled = false;
    DOM.btnSaveProfile.innerHTML = `<i data-lucide="save"></i> Simpan Profil & Pengaturan`;
    lucide.createIcons();
  }
}

async function handleTogglePasswordRealtime() {
  const newUsePsw = DOM.profilePswToggle.checked;
  state.profile.usePsw = newUsePsw;
  saveProfileSilently();
  updateUIFromState();

  if (state.supabaseClient && (state.profile.id || state.profile.nik)) {
    try {
      let query = state.supabaseClient
        .from('users_teknisi')
        .update({
          use_password: newUsePsw,
          updated_at: new Date().toISOString()
        });

      if (state.profile.id) query = query.eq('id', state.profile.id);
      else query = query.eq('nik', state.profile.nik);

      const { error } = await query;
      if (error) throw error;

      showToast(`⚡ Status Password: ${newUsePsw ? 'ON' : 'OFF'}`, 'success');
    } catch (err) {
      showToast(`Gagal update status password: ${err.message}`, 'error');
    }
  }
}

// ==========================================
// SUPABASE AUTHENTICATION & LOGIN HANDLER
// ==========================================
async function handleLogin() {
  const username = DOM.loginUsername.value.trim();
  const password = DOM.loginPassword.value.trim();
  const remember = DOM.rememberMe.checked;

  if (!username) {
    showToast('Harap masukkan Username / NIK!', 'error');
    DOM.loginUsername.focus();
    return;
  }
  if (!password) {
    showToast('Harap masukkan Password!', 'error');
    DOM.loginPassword.focus();
    return;
  }

  DOM.btnDoLogin.disabled = true;
  DOM.btnDoLogin.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Memeriksa Akun...`;
  lucide.createIcons();

  try {
    let authenticatedUser = null;

    if (state.supabaseClient) {
      const { data, error } = await state.supabaseClient
        .from('users_teknisi')
        .select('*')
        .eq('nik', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('NIK atau Password tidak cocok!');
      }

      authenticatedUser = data;

      await state.supabaseClient
        .from('users_teknisi')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.id);
    } else {
      authenticatedUser = {
        nik: username,
        nama: username.startsWith('TEK-') ? `Teknisi ${username}` : username,
        password: password,
        use_password: true
      };
    }

    if (remember) {
      localStorage.setItem(STORAGE_KEYS.SAVED_LOGIN, JSON.stringify({
        username: username,
        password: password,
        remember: true
      }));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SAVED_LOGIN);
    }

    state.profile.id = authenticatedUser.id || '';
    state.profile.nik = authenticatedUser.nik;
    state.profile.nama = authenticatedUser.nama;
    state.profile.psw = authenticatedUser.password;
    state.profile.usePsw = authenticatedUser.use_password ?? true;

    saveProfileSilently();

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
      isLoggedIn: true,
      nik: authenticatedUser.nik,
      loginAt: new Date().toISOString()
    }));

    state.isLoggedIn = true;
    showAppScreen();
    showToast(`Login Berhasil! Selamat Datang, ${state.profile.nama}`, 'success');

  } catch (err) {
    showToast(`Gagal Login: ${err.message}`, 'error');
  } finally {
    DOM.btnDoLogin.disabled = false;
    DOM.btnDoLogin.innerHTML = `<i data-lucide="log-in"></i> <span>MASUK APLIKASI</span>`;
    lucide.createIcons();
  }
}

function handleLogout() {
  openLogoutConfirmModal();
}

function performLogout() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  showLoginScreen();
  showToast('Anda telah keluar dari akun.', 'info');
}

function performClearHistory() {
  state.history = [];
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  renderHistory();
  showToast('Riwayat berhasil dibersihkan', 'info');
}

function switchTab(targetTabId) {
  DOM.navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-target') === targetTabId);
  });
  DOM.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === targetTabId);
  });
}

// ==========================================
// DRAFT LIST MANAGEMENT
// ==========================================
function handleAddManualItem() {
  const code = DOM.inputNoGudang.value.trim();
  if (!code) {
    showToast('Ketik No. Gudang Part terlebih dahulu!', 'error');
    DOM.inputNoGudang.focus();
    return;
  }

  addItemToDraft(code, 1);
  DOM.inputNoGudang.value = '';
}

function addItemToDraft(code, qty = 1) {
  playBeepSound();
  vibrateDevice();

  const existingItem = state.draftList.find(i => i.no_gudang.toLowerCase() === code.toLowerCase());
  if (existingItem) {
    existingItem.qty += qty;
    showToast(`Qty ${code} diperbarui jadi: ${existingItem.qty}`, 'info');
  } else {
    state.draftList.push({
      id: Date.now() + Math.random(),
      no_gudang: code,
      qty: qty
    });
    showToast(`Ditambahkan ke daftar: ${code}`, 'success');
  }

  renderDraftList();
}

function renderDraftList() {
  const count = state.draftList.reduce((acc, curr) => acc + curr.qty, 0);
  const itemCount = state.draftList.length;

  DOM.draftCount.textContent = `${itemCount} Jenis (${count} Total)`;
  DOM.btnSubmitText.textContent = `SUBMIT (${itemCount} ITEM)`;
  DOM.btnSubmit.disabled = itemCount === 0;

  if (itemCount === 0) {
    DOM.draftListContainer.innerHTML = `
      <div class="empty-state-sm">
        <i data-lucide="package-open"></i>
        <p>Belum ada item di daftar. Arahkan kamera ke barcode atau ketik manual di atas.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  DOM.draftListContainer.innerHTML = state.draftList.map(item => `
    <div class="draft-item">
      <div class="draft-item-left">
        <i data-lucide="package" style="width:14px; height:14px; color:var(--primary);"></i>
        <span class="draft-code">${escapeHtml(item.no_gudang)}</span>
      </div>
      <div class="draft-qty-controls">
        <button type="button" onclick="changeDraftQty('${item.id}', -1)">-</button>
        <span class="draft-qty-val">${item.qty}</span>
        <button type="button" onclick="changeDraftQty('${item.id}', 1)">+</button>
        <button type="button" class="btn-del-item" onclick="removeDraftItem('${item.id}')" title="Hapus Item">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

window.changeDraftQty = function(id, delta) {
  const item = state.draftList.find(i => String(i.id) === String(id));
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    renderDraftList();
  }
};

window.removeDraftItem = function(id) {
  state.draftList = state.draftList.filter(i => String(i.id) !== String(id));
  renderDraftList();
};

// ==========================================
// BARCODE SCANNER ENGINE
// ==========================================
function startScanner() {
  if (state.isScanning || !state.isLoggedIn) return;

  if (!state.html5Qrcode) {
    state.html5Qrcode = new Html5Qrcode("reader");
  }

  const config = { fps: 10, qrbox: { width: 180, height: 110 } };

  state.html5Qrcode.start(
    { facingMode: "environment" },
    config,
    onScanSuccess,
    onScanFailure
  ).then(() => {
    state.isScanning = true;
  }).catch(err => {
    state.isScanning = false;
  });
}

function stopScanner() {
  if (state.html5Qrcode && state.isScanning) {
    state.html5Qrcode.stop().then(() => {
      state.isScanning = false;
    }).catch(err => console.error(err));
  }
}

function toggleScanner() {
  if (state.isScanning) stopScanner();
  else startScanner();
}

function onScanSuccess(decodedText) {
  addItemToDraft(decodedText, 1);
}

function onScanFailure(error) {}

function simulateScan() {
  const mockParts = ['GDG-A1-8849', 'GDG-B3-9921', 'GDG-C7-1044', 'GDG-X9-5502', 'PART-ELEK-203'];
  const randomPart = mockParts[Math.floor(Math.random() * mockParts.length)];
  addItemToDraft(randomPart, 1);
}

// Sound & Vibration Feedback
function playBeepSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {}
}

function vibrateDevice() {
  if (navigator.vibrate) navigator.vibrate(80);
}

// ==========================================
// SUBMIT BATCH TO SUPABASE & QUEUE SYSTEM
// ==========================================
async function handleSubmitBatchToSupabase() {
  if (state.draftList.length === 0) return;

  DOM.btnSubmit.disabled = true;
  DOM.btnSubmitText.textContent = 'MEMPROSES SUBMIT...';

  // Generate a single unique Batch/Header Unit ID for this submit action
  const batchUnitId = 'UNIT-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

  const batchPayloads = state.draftList.map(item => ({
    unit_id: batchUnitId,
    teknisi_nik: state.profile.nik || 'TEK-0000',
    nama_teknisi: state.profile.nama || 'Teknisi Anonim',
    no_gudang: item.no_gudang,
    qty: item.qty,
    use_password: state.profile.usePsw,
    password: state.profile.usePsw ? (state.profile.psw || '') : '',
    status: 'pending',
    created_at: new Date().toISOString()
  }));

  try {
    let isSupabaseSuccess = false;
    let insertedIds = [];

    if (state.supabaseClient) {
      let { data, error } = await state.supabaseClient
        .from(SUPABASE_CONFIG.table)
        .insert(batchPayloads)
        .select('id, status');

      // Fallback if unit_id column does not exist in Supabase schema yet
      if (error && error.message && error.message.includes('unit_id')) {
        console.warn('unit_id column missing in Supabase, retrying without unit_id field...');
        const fallbackPayloads = batchPayloads.map(({ unit_id, ...rest }) => rest);
        const resFallback = await state.supabaseClient
          .from(SUPABASE_CONFIG.table)
          .insert(fallbackPayloads)
          .select('id, status');
        if (resFallback.error) throw resFallback.error;
        data = resFallback.data;
        error = null;
      } else if (error) {
        throw error;
      }

      isSupabaseSuccess = true;
      if (data) insertedIds = data.map(d => d.id);
    }

    // Save to Local History Log
    batchPayloads.forEach(p => {
      state.history.unshift({
        ...p,
        id: Date.now() + Math.random(),
        sentToSupabase: isSupabaseSuccess
      });
    });

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
    renderHistory();

    const countSent = state.draftList.length;
    state.draftList = [];
    renderDraftList();

    if (isSupabaseSuccess) {
      checkGlobalPendingQueueStatus();
    } else {
      showToast(`✅ ${countSent} Item Tersimpan (Mode Demo)`, 'info');
    }

  } catch (err) {
    showToast(`Gagal kirim: ${err.message || 'Cek koneksi/kredensial'}`, 'error');
  } finally {
    DOM.btnSubmit.disabled = state.draftList.length === 0;
    renderDraftList();
  }
}

// ==========================================
// GLOBAL REALTIME QUEUE MONITORING ACROSS ALL DEVICES
// ==========================================
function subscribeGlobalQueueRealtime() {
  if (!state.supabaseClient) return;

  if (state.globalQueueChannel) {
    state.supabaseClient.removeChannel(state.globalQueueChannel);
    state.globalQueueChannel = null;
  }

  // Initial check upon load
  checkGlobalPendingQueueStatus();

  // Supabase Realtime Listener on ALL transaksi_part events (INSERT, UPDATE, DELETE)
  state.globalQueueChannel = state.supabaseClient
    .channel('global_queue_monitor')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: SUPABASE_CONFIG.table },
      (payload) => {
        console.log('Realtime Global Queue Change:', payload);
        checkGlobalPendingQueueStatus();
      }
    )
    .subscribe();

  // Periodic Polling Fallback every 2.5 seconds
  if (!state.globalQueuePollTimer) {
    state.globalQueuePollTimer = setInterval(checkGlobalPendingQueueStatus, 2500);
  }
}

async function checkGlobalPendingQueueStatus() {
  if (!state.supabaseClient || !state.isLoggedIn) return;

  try {
    const { data, error } = await state.supabaseClient
      .from(SUPABASE_CONFIG.table)
      .select('id, status')
      .in('status', ['pending', 'processing'])
      .limit(5);

    if (error) return;

    const hasPending = data && data.length > 0;

    if (hasPending) {
      openGlobalQueueModal();
    } else {
      closeGlobalQueueModal();
    }
  } catch (err) {
    console.warn('Check global queue error:', err);
  }
}

function openGlobalQueueModal() {
  if (!state.isGlobalQueueBlocking) {
    state.isGlobalQueueBlocking = true;
    if (DOM.modalQueueMsg) DOM.modalQueueMsg.textContent = 'TERDAPAT TRANSAKSI YANG BELUM / SEDANG DI PROSES. MOHON MENUNGGU...';
    if (DOM.queueStatusText) DOM.queueStatusText.textContent = 'MENGANTRI / DIPROSES...';
    if (DOM.modalQueue) DOM.modalQueue.classList.add('active');
    lucide.createIcons();
  }
}

function closeGlobalQueueModal() {
  if (state.isGlobalQueueBlocking) {
    state.isGlobalQueueBlocking = false;
    if (DOM.modalQueue) DOM.modalQueue.classList.remove('active');
    showToast('🚀 Transfer Berhasil!', 'success');
  }
}

function saveProfileSilently() {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(state.profile));
}

// ==========================================
// HISTORY RENDERER
// ==========================================
function renderHistory() {
  if (!state.history || state.history.length === 0) {
    DOM.historyList.innerHTML = `
      <div class="empty-state-sm">
        <i data-lucide="inbox"></i>
        <p>Belum ada riwayat pengiriman.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  DOM.historyList.innerHTML = state.history.map(item => {
    const timeFormatted = new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="history-item">
        <div>
          <div class="item-gudang">${escapeHtml(item.no_gudang)}</div>
          <div class="item-meta">${escapeHtml(item.nama_teknisi)} • ${timeFormatted}</div>
        </div>
        <span class="item-qty-plain">Qty: ${item.qty}</span>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================
// TOAST SYSTEM
// ==========================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle-2';
  if (type === 'error') iconName = 'alert-circle';

  toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${escapeHtml(message)}</span>`;
  DOM.toastContainer.appendChild(toast);

  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-6px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}
