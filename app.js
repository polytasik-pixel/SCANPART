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
  isAdmin: false,
  activeTab: 'tab-scan',
  theme: 'dark', // 'dark' | 'light'
  modalAction: null, // 'submit' | 'logout' | 'clearHistory' | 'deleteUser'
  profile: {
    id: '',
    nama: '',
    nik: '',
    psw: '',
    usePsw: true
  },
  draftList: [],
  history: [],
  adminUsers: [],
  pendingDeleteDraftItemId: null,
  pendingDeleteUserId: null,
  pendingDeleteUserNik: null,
  pendingTargetTabId: null,
  isReloading: false,
  html5Qrcode: null,
  isScanning: false,
  wasScanningBeforeSleep: false,
  isTorchOn: false,
  supabaseClient: null,
  realtimeChannel: null,
  adminUsersChannel: null
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
  navItemUsers: document.getElementById('nav-item-users'),
  
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
  btnToggleTorch: document.getElementById('btn-toggle-torch'),
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

  // Admin User Management
  adminUserCount: document.getElementById('admin-user-count'),
  btnOpenAddUser: document.getElementById('btn-open-add-user'),
  adminUsersList: document.getElementById('admin-users-list'),
  modalUserForm: document.getElementById('modal-user-form'),
  modalUserFormTitle: document.getElementById('modal-user-form-title'),
  userFormId: document.getElementById('user-form-id'),
  userFormNik: document.getElementById('user-form-nik'),
  userFormNama: document.getElementById('user-form-nama'),
  userFormPsw: document.getElementById('user-form-psw'),
  userFormPswToggle: document.getElementById('user-form-psw-toggle'),
  btnCloseUserModal: document.getElementById('btn-close-user-modal'),
  btnCancelUserForm: document.getElementById('btn-cancel-user-form'),
  btnSaveUserForm: document.getElementById('btn-save-user-form'),
  userFormSubmitText: document.getElementById('user-form-submit-text'),
  
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
        state.isAdmin = (parsed.nik.toUpperCase() === 'ADMIN' || !!parsed.isAdmin);
        if (state.isAdmin) {
          state.profile = {
            id: 'admin-id',
            nik: 'ADMIN',
            nama: 'Administrator',
            psw: '000',
            usePsw: true
          };
          updateUIFromState();
        } else {
          syncProfileFromSupabase(parsed.nik);
        }
        showAppScreen();
        return;
      }
    } catch (e) {}
  }

  showLoginScreen();
}

function showLoginScreen() {
  state.isLoggedIn = false;
  state.isAdmin = false;
  DOM.screenLogin.classList.add('active');
  DOM.screenApp.classList.remove('active');
  stopScanner();
  unsubscribeRealtime();
  unsubscribeAdminUsersRealtime();
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

  switchTab('tab-scan', false);
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

  // Toggle Admin Nav Item & Fetch Admin Users
  if (DOM.navItemUsers) {
    DOM.navItemUsers.classList.toggle('hidden', !state.isAdmin);
  }

  if (state.isAdmin) {
    fetchAdminUsersList();
    subscribeAdminUsersRealtime();
  }

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
      requestTabSwitch(item.getAttribute('data-target'));
    });
  });

  // Camera Scanner Buttons
  DOM.btnToggleCamera.addEventListener('click', toggleScanner);
  if (DOM.btnToggleTorch) DOM.btnToggleTorch.addEventListener('click', toggleTorch);
  if (DOM.btnSimulasiScan) DOM.btnSimulasiScan.addEventListener('click', simulateScan);

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

  // Profile Save & Header PSW Badge Click Toggle
  if (DOM.headerPswStatus) DOM.headerPswStatus.addEventListener('click', handleHeaderPswToggle);
  DOM.btnSaveProfile.addEventListener('click', handleSaveProfileRealtime);
  DOM.profilePswToggle.addEventListener('change', handleTogglePasswordRealtime);

  // Password Visibility Toggle in Profile
  DOM.btnTogglePswVisibility.addEventListener('click', () => {
    const isPsw = DOM.profilePsw.type === 'password';
    DOM.profilePsw.type = isPsw ? 'text' : 'password';
  });

  // Clear History
  DOM.btnClearHistory.addEventListener('click', openClearHistoryConfirmModal);

  // Admin User Management Listeners
  if (DOM.btnOpenAddUser) DOM.btnOpenAddUser.addEventListener('click', openAddUserModal);
  if (DOM.btnCloseUserModal) DOM.btnCloseUserModal.addEventListener('click', closeUserModal);
  if (DOM.btnCancelUserForm) DOM.btnCancelUserForm.addEventListener('click', closeUserModal);
  if (DOM.btnSaveUserForm) DOM.btnSaveUserForm.addEventListener('click', handleSaveUserForm);

  // Android & Hardware Back Button Navigation Handler
  window.addEventListener('popstate', (e) => {
    if (!state.isLoggedIn) return;

    // 1. Close active modals first if open
    if (DOM.modalUserForm && DOM.modalUserForm.classList.contains('active')) {
      closeUserModal();
      return;
    }
    if (DOM.modalConfirm && DOM.modalConfirm.classList.contains('active')) {
      closeSubmitConfirmModal();
      return;
    }

    // 2. Tab Navigation: check if leaving tab-scan with draft items
    const targetTab = (e.state && e.state.tab) ? e.state.tab : 'tab-scan';
    requestTabSwitch(targetTab);
  });

  // Intercept Keyboard Refresh Shortcuts (F5, Ctrl+R, Cmd+R) and show custom centered popup modal
  window.addEventListener('keydown', (e) => {
    const isF5 = e.key === 'F5' || e.keyCode === 116;
    const isCtrlR = (e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R' || e.keyCode === 82);

    if ((isF5 || isCtrlR) && state.isLoggedIn && state.draftList.length > 0) {
      e.preventDefault();
      e.stopPropagation();

      state.modalAction = 'refreshWarn';
      DOM.modalConfirmTitle.innerHTML = `<i data-lucide="alert-triangle"></i> Konfirmasi Muat Ulang Halaman`;
      DOM.modalConfirmMsg.textContent = 'No gudang yg sudah di input akan hilang. Lanjutkan?';
      DOM.modalConfirmOkText.textContent = 'Ya, Lanjutkan';
      DOM.modalConfirm.classList.add('active');
      lucide.createIcons();
      return false;
    }
  });

  // Warn user before refresh / closing browser tab if unsubmitted draft items exist
  window.addEventListener('beforeunload', (e) => {
    if (state.isReloading) return;

    if (state.isLoggedIn && state.draftList.length > 0) {
      const msg = 'No gudang yg sudah di input akan hilang. Lanjutkan?';
      e.preventDefault();
      e.returnValue = msg;
      return msg;
    }
  });

  // Auto-Resume Camera when screen turns back on / phone is unlocked / app brought to foreground
  document.addEventListener('visibilitychange', () => {
    if (!state.isLoggedIn) return;

    if (document.visibilityState === 'hidden') {
      if (state.isScanning) {
        state.wasScanningBeforeSleep = true;
        stopScanner();
      }
    } else if (document.visibilityState === 'visible') {
      if (state.wasScanningBeforeSleep && state.activeTab === 'tab-scan') {
        state.wasScanningBeforeSleep = false;
        setTimeout(() => {
          startScanner();
        }, 300);
      }
    }
  });
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
  } else if (currentAction === 'deleteUser') {
    await performDeleteUser();
  } else if (currentAction === 'deleteDraftItem') {
    performRemoveDraftItem();
  } else if (currentAction === 'switchTabWarn') {
    state.draftList = [];
    renderDraftList();
    if (state.pendingTargetTabId) {
      const nextTab = state.pendingTargetTabId;
      state.pendingTargetTabId = null;
      switchTab(nextTab, true);
    }
  } else if (currentAction === 'refreshWarn') {
    state.draftList = [];
    renderDraftList();
    state.isReloading = true;
    location.reload();
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

async function handleHeaderPswToggle() {
  const nextPswState = !state.profile.usePsw;
  state.profile.usePsw = nextPswState;

  if (DOM.profilePswToggle) {
    DOM.profilePswToggle.checked = nextPswState;
  }

  saveProfileSilently();
  updateUIFromState();

  if (state.supabaseClient && (state.profile.id || state.profile.nik)) {
    try {
      let query = state.supabaseClient
        .from('users_teknisi')
        .update({
          use_password: nextPswState,
          updated_at: new Date().toISOString()
        });

      if (state.profile.id) query = query.eq('id', state.profile.id);
      else query = query.eq('nik', state.profile.nik);

      const { error } = await query;
      if (error) throw error;

      showToast(`⚡ Status Password: ${nextPswState ? 'ON 🛡️' : 'OFF ⚠️'}`, 'success');
    } catch (err) {
      showToast(`Gagal update status password: ${err.message}`, 'error');
    }
  } else {
    showToast(`⚡ Status Password: ${nextPswState ? 'ON 🛡️' : 'OFF ⚠️'} (Lokal)`, 'info');
  }
}

async function handleTogglePasswordRealtime() {
  const newUsePsw = DOM.profilePswToggle.checked;
  if (state.profile.usePsw === newUsePsw) return;

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

      showToast(`⚡ Status Password: ${newUsePsw ? 'ON 🛡️' : 'OFF ⚠️'}`, 'success');
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
    const isAdmin = (username.toUpperCase() === 'ADMIN' && password === '000');

    if (isAdmin) {
      authenticatedUser = {
        id: 'admin-id',
        nik: 'ADMIN',
        nama: 'Administrator',
        password: '000',
        use_password: true,
        isAdmin: true
      };
    } else if (state.supabaseClient) {
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

    state.isAdmin = !!authenticatedUser.isAdmin || (authenticatedUser.nik.toUpperCase() === 'ADMIN');
    state.profile.id = authenticatedUser.id || '';
    state.profile.nik = authenticatedUser.nik;
    state.profile.nama = authenticatedUser.nama;
    state.profile.psw = authenticatedUser.password;
    state.profile.usePsw = authenticatedUser.use_password ?? true;

    saveProfileSilently();

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
      isLoggedIn: true,
      nik: authenticatedUser.nik,
      isAdmin: state.isAdmin,
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

function switchTab(targetTabId, pushState = true) {
  if (state.activeTab === targetTabId) return;

  if (pushState) {
    try {
      history.pushState({ tab: targetTabId }, '', '#' + targetTabId);
    } catch (e) {}
  }
  state.activeTab = targetTabId;

  DOM.navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-target') === targetTabId);
  });
  DOM.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === targetTabId);
  });
}

function requestTabSwitch(targetTabId) {
  if (state.activeTab === targetTabId) return;

  // Jika sedang di tab-scan dan ada item yang belum di-submit di daftar (draftList > 0), minta konfirmasi!
  if (state.activeTab === 'tab-scan' && state.draftList.length > 0) {
    state.modalAction = 'switchTabWarn';
    state.pendingTargetTabId = targetTabId;

    DOM.modalConfirmTitle.innerHTML = `<i data-lucide="alert-triangle"></i> Konfirmasi Pindah Halaman`;
    DOM.modalConfirmMsg.textContent = 'No gudang yg sudah di input akan hilang. Lanjutkan?';
    DOM.modalConfirmOkText.textContent = 'Ya, Lanjutkan';
    DOM.modalConfirm.classList.add('active');
    lucide.createIcons();
    return;
  }

  switchTab(targetTabId, true);
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
  if (!code) return;
  const upperCode = String(code).trim().toUpperCase();

  const existingItem = state.draftList.find(i => i.no_gudang.toUpperCase() === upperCode);
  
  // Jika part sudah pernah di-scan, abaikan secara diam-diam (tanpa notif / beep / getar)
  if (existingItem) {
    return;
  }

  // Hanya bunyikan beep & getar untuk part baru yang belum pernah di-scan
  playBeepSound();
  vibrateDevice();

  state.draftList.push({
    id: Date.now() + Math.random(),
    no_gudang: upperCode,
    qty: 1
  });

  showToast(`Ditambahkan ke daftar: ${upperCode}`, 'success');
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
        <span class="draft-code">${escapeHtml(item.no_gudang)}</span>
      </div>
      <div class="draft-qty-controls">
        <button type="button" onclick="changeDraftQty('${item.id}', -1)">-</button>
        <input 
          type="text" 
          class="draft-qty-input" 
          data-id="${item.id}"
          value="${item.qty}" 
          inputmode="numeric" 
          pattern="[0-9]*" 
          onfocus="this.select()"
          onkeydown="return event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Tab' || (event.key >= '0' && event.key <= '9')"
          oninput="this.value = this.value.replace(/[^0-9]/g, ''); updateDraftQtyDirect('${item.id}', this.value)"
          onblur="updateDraftQtyDirect('${item.id}', this.value, true)"
        />
        <button type="button" onclick="changeDraftQty('${item.id}', 1)">+</button>
        <button type="button" class="btn-del-item" onclick="confirmRemoveDraftItem('${item.id}', '${escapeHtml(item.no_gudang)}')" title="Hapus Item">
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

window.updateDraftQtyDirect = function(id, val, isBlur = false) {
  const item = state.draftList.find(i => String(i.id) === String(id));
  if (item) {
    let cleanVal = String(val).replace(/[^0-9]/g, '');
    let parsed = parseInt(cleanVal, 10);
    
    if (isNaN(parsed) || parsed < 1) {
      item.qty = 1;
      if (isBlur) {
        const inputElem = document.querySelector(`.draft-qty-input[data-id="${id}"]`);
        if (inputElem) inputElem.value = '1';
        renderDraftList();
        return;
      }
    } else {
      item.qty = parsed;
    }
    
    // Live update total count indicators
    const count = state.draftList.reduce((acc, curr) => acc + curr.qty, 0);
    const itemCount = state.draftList.length;
    if (DOM.draftCount) DOM.draftCount.textContent = `${itemCount} Jenis (${count} Total)`;
    if (DOM.btnSubmitText) DOM.btnSubmitText.textContent = `SUBMIT (${itemCount} ITEM)`;
  }
};

window.confirmRemoveDraftItem = function(id, noGudang) {
  state.modalAction = 'deleteDraftItem';
  state.pendingDeleteDraftItemId = id;

  DOM.modalConfirmTitle.innerHTML = `<i data-lucide="trash-2"></i> Konfirmasi Hapus Item`;
  DOM.modalConfirmMsg.textContent = `Apakah Anda Yakin Ingin Menghapus (${noGudang}) dari Daftar Ter-Scan?`;
  DOM.modalConfirmOkText.textContent = 'Ya, Hapus Item';
  DOM.modalConfirm.classList.add('active');
  lucide.createIcons();
};

function performRemoveDraftItem() {
  if (!state.pendingDeleteDraftItemId) return;

  const itemToDelete = state.draftList.find(i => String(i.id) === String(state.pendingDeleteDraftItemId));
  state.draftList = state.draftList.filter(i => String(i.id) !== String(state.pendingDeleteDraftItemId));
  
  if (itemToDelete) {
    showToast(`🗑️ Item (${itemToDelete.no_gudang}) Berhasil Dihapus!`, 'info');
  }

  renderDraftList();
  state.pendingDeleteDraftItemId = null;
}

// ==========================================
// BARCODE SCANNER ENGINE & TORCH (LIGHT)
// ==========================================
function startScanner() {
  if (state.isScanning || !state.isLoggedIn) return;

  if (!state.html5Qrcode) {
    state.html5Qrcode = new Html5Qrcode("reader");
  }

  const config = { 
    fps: 15, 
    qrbox: (viewfinderWidth, viewfinderHeight) => {
      const width = Math.max(160, Math.floor(viewfinderWidth - 16));
      const height = Math.max(100, Math.floor(viewfinderHeight - 16));
      return { width: width, height: height };
    } 
  };

  state.html5Qrcode.start(
    { facingMode: "environment" },
    config,
    onScanSuccess,
    onScanFailure
  ).then(() => {
    state.isScanning = true;
    if (DOM.btnToggleTorch) {
      DOM.btnToggleTorch.style.display = 'inline-flex';
    }
  }).catch(err => {
    state.isScanning = false;
  });
}

function stopScanner() {
  if (state.html5Qrcode && state.isScanning) {
    state.html5Qrcode.stop().then(() => {
      state.isScanning = false;
      state.isTorchOn = false;
      updateTorchUI();
      if (DOM.btnToggleTorch) {
        DOM.btnToggleTorch.style.display = 'none';
      }
    }).catch(err => console.error(err));
  }
}

function toggleScanner() {
  if (state.isScanning) stopScanner();
  else startScanner();
}

function getActiveVideoTrack() {
  const videoElem = document.querySelector('#reader video');
  if (videoElem && videoElem.srcObject && typeof videoElem.srcObject.getVideoTracks === 'function') {
    const tracks = videoElem.srcObject.getVideoTracks();
    if (tracks && tracks.length > 0) return tracks[0];
  }
  return null;
}

async function toggleTorch() {
  if (!state.isScanning) {
    showToast('Nyalakan kamera terlebih dahulu!', 'error');
    return;
  }

  const track = getActiveVideoTrack();
  const nextTorchState = !state.isTorchOn;

  try {
    if (track && typeof track.applyConstraints === 'function') {
      const capabilities = (typeof track.getCapabilities === 'function') ? track.getCapabilities() : {};
      
      if (capabilities && 'torch' in capabilities && !capabilities.torch) {
        showToast('Lampu flash tidak didukung kamera ini', 'error');
        return;
      }

      await track.applyConstraints({
        advanced: [{ torch: nextTorchState }]
      });

      state.isTorchOn = nextTorchState;
      updateTorchUI();
      showToast(`Lampu Flash: ${state.isTorchOn ? 'ON 💡' : 'OFF 🌙'}`, 'info');
      return;
    }

    if (state.html5Qrcode && typeof state.html5Qrcode.applyVideoConstraints === 'function') {
      await state.html5Qrcode.applyVideoConstraints({
        advanced: [{ torch: nextTorchState }]
      });
      state.isTorchOn = nextTorchState;
      updateTorchUI();
      showToast(`Lampu Flash: ${state.isTorchOn ? 'ON 💡' : 'OFF 🌙'}`, 'info');
      return;
    }

    showToast('Fitur lampu flash tidak didukung oleh browser ini', 'error');

  } catch (err) {
    console.error('Torch error:', err);
    showToast('Gagal mengubah status lampu flash', 'error');
  }
}

function updateTorchUI() {
  if (DOM.btnToggleTorch) {
    DOM.btnToggleTorch.classList.toggle('active', state.isTorchOn);
    DOM.btnToggleTorch.title = state.isTorchOn ? 'Matikan Lampu Flash' : 'Nyalakan Lampu Flash';
  }
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

  const currentNik = (state.profile.nik || '').trim();
  const jenisUser = (currentNik === '02002105') ? 'SALES' : 'TEKNISI';

  const batchPayloads = state.draftList.map(item => ({
    unit_id: batchUnitId,
    teknisi_nik: currentNik || 'TEK-0000',
    nama_teknisi: state.profile.nama || 'Teknisi Anonim',
    jenis: jenisUser,
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

      // Fallback if unit_id or jenis column does not exist in Supabase schema yet
      if (error && error.message) {
        const hasMissingUnit = error.message.includes('unit_id');
        const hasMissingJenis = error.message.includes('jenis');

        if (hasMissingUnit || hasMissingJenis) {
          console.warn('Column missing in Supabase schema, retrying fallback payload...', error.message);
          const fallbackPayloads = batchPayloads.map(p => {
            const payloadCopy = { ...p };
            if (hasMissingUnit) delete payloadCopy.unit_id;
            if (hasMissingJenis) delete payloadCopy.jenis;
            return payloadCopy;
          });

          const resFallback = await state.supabaseClient
            .from(SUPABASE_CONFIG.table)
            .insert(fallbackPayloads)
            .select('id, status');

          if (resFallback.error) throw resFallback.error;
          data = resFallback.data;
          error = null;
        } else {
          throw error;
        }
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

// ==========================================
// ADMIN USER MANAGEMENT FUNCTIONS (NIK=ADMIN, PSW=000)
// ==========================================
async function fetchAdminUsersList() {
  if (!state.supabaseClient || !state.isAdmin) return;

  try {
    const { data, error } = await state.supabaseClient
      .from('users_teknisi')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    state.adminUsers = data || [];
    renderAdminUsersList(state.adminUsers);
  } catch (err) {
    console.error('Error fetch admin users:', err);
    if (DOM.adminUsersList) {
      DOM.adminUsersList.innerHTML = `
        <div class="empty-state-sm text-danger">
          <i data-lucide="alert-circle"></i>
          <p>Gagal memuat data user: ${escapeHtml(err.message)}</p>
        </div>`;
      lucide.createIcons();
    }
  }
}

function subscribeAdminUsersRealtime() {
  if (!state.supabaseClient || !state.isAdmin || state.adminUsersChannel) return;

  state.adminUsersChannel = state.supabaseClient
    .channel('public:users_teknisi_admin')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'users_teknisi' },
      (payload) => {
        console.log('Realtime Admin User Table Change:', payload);
        fetchAdminUsersList();
      }
    )
    .subscribe();
}

function unsubscribeAdminUsersRealtime() {
  if (state.adminUsersChannel && state.supabaseClient) {
    state.supabaseClient.removeChannel(state.adminUsersChannel);
    state.adminUsersChannel = null;
  }
}

function renderAdminUsersList(users) {
  if (!DOM.adminUsersList) return;

  if (DOM.adminUserCount) {
    DOM.adminUserCount.textContent = `${users.length} User`;
  }

  if (users.length === 0) {
    DOM.adminUsersList.innerHTML = `
      <div class="empty-state-sm">
        <i data-lucide="users"></i>
        <p>Belum ada data user teknisi di Supabase.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  DOM.adminUsersList.innerHTML = users.map(user => {
    const isPswOn = user.use_password ?? true;
    const pswBadgeClass = isPswOn ? 'on' : 'off';
    const pswBadgeText = isPswOn ? 'PSW: ON' : 'PSW: OFF';

    return `
      <div class="user-item-card">
        <div class="user-item-info">
          <div class="user-avatar-sm">
            <i data-lucide="user"></i>
          </div>
          <div class="user-text-details">
            <div class="user-text-nama">
              ${escapeHtml(user.nama)}
              <span class="badge-psw-status ${pswBadgeClass}">${pswBadgeText}</span>
            </div>
            <div class="user-text-meta">
              <span><b>NIK:</b> ${escapeHtml(user.nik)}</span>
              <span>• <b>Pass:</b> ${escapeHtml(user.password || '-')}</span>
            </div>
          </div>
        </div>
        <div class="user-item-actions">
          <button type="button" class="btn-icon" onclick="openEditUserModal('${user.id}')" title="Edit User">
            <i data-lucide="edit-3"></i>
          </button>
          <button type="button" class="btn-icon text-danger" onclick="confirmDeleteUser('${user.id}', '${escapeHtml(user.nik)}')" title="Hapus User">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function openAddUserModal() {
  if (!DOM.modalUserForm) return;
  DOM.modalUserFormTitle.innerHTML = `<i data-lucide="user-plus"></i> Tambah User Baru`;
  DOM.userFormSubmitText.textContent = 'Simpan User';
  DOM.userFormId.value = '';
  DOM.userFormNik.value = '';
  DOM.userFormNama.value = '';
  DOM.userFormPsw.value = '';
  DOM.userFormPswToggle.checked = true;
  DOM.modalUserForm.classList.add('active');
  DOM.userFormNik.focus();
  lucide.createIcons();
}

window.openEditUserModal = function(userId) {
  const targetUser = state.adminUsers.find(u => String(u.id) === String(userId));
  if (!targetUser || !DOM.modalUserForm) return;

  DOM.modalUserFormTitle.innerHTML = `<i data-lucide="edit-3"></i> Edit User (${escapeHtml(targetUser.nik)})`;
  DOM.userFormSubmitText.textContent = 'Perbarui User';
  DOM.userFormId.value = targetUser.id;
  DOM.userFormNik.value = targetUser.nik || '';
  DOM.userFormNama.value = targetUser.nama || '';
  DOM.userFormPsw.value = targetUser.password || '';
  DOM.userFormPswToggle.checked = targetUser.use_password ?? true;
  DOM.modalUserForm.classList.add('active');
  DOM.userFormNama.focus();
  lucide.createIcons();
};

function closeUserModal() {
  if (DOM.modalUserForm) {
    DOM.modalUserForm.classList.remove('active');
  }
}

async function handleSaveUserForm() {
  const userId = DOM.userFormId.value.trim();
  const nik = DOM.userFormNik.value.trim();
  const nama = DOM.userFormNama.value.trim();
  const psw = DOM.userFormPsw.value.trim();
  const usePsw = DOM.userFormPswToggle.checked;

  if (!nik) {
    showToast('Harap isi NIK Teknisi!', 'error');
    DOM.userFormNik.focus();
    return;
  }
  if (!nama) {
    showToast('Harap isi Nama Teknisi!', 'error');
    DOM.userFormNama.focus();
    return;
  }

  DOM.btnSaveUserForm.disabled = true;
  DOM.btnSaveUserForm.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Menyimpan...`;
  lucide.createIcons();

  try {
    if (!state.supabaseClient) {
      throw new Error('Koneksi Supabase belum siap!');
    }

    if (userId) {
      // UPDATE EXISTING USER IN SUPABASE
      const { error } = await state.supabaseClient
        .from('users_teknisi')
        .update({
          nik: nik,
          nama: nama,
          password: psw,
          use_password: usePsw,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      showToast(`⚡ User (${nik}) Berhasil Diperbarui!`, 'success');
    } else {
      // INSERT NEW USER INTO SUPABASE
      const { error } = await state.supabaseClient
        .from('users_teknisi')
        .insert([{
          nik: nik,
          nama: nama,
          password: psw,
          use_password: usePsw
        }]);

      if (error) throw error;
      showToast(`⚡ User Baru (${nik}) Berhasil Ditambahkan!`, 'success');
    }

    closeUserModal();
    fetchAdminUsersList();

  } catch (err) {
    console.error('Save user error:', err);
    showToast(`Gagal simpan user: ${err.message}`, 'error');
  } finally {
    DOM.btnSaveUserForm.disabled = false;
    DOM.btnSaveUserForm.innerHTML = `<i data-lucide="save"></i> <span id="user-form-submit-text">${userId ? 'Perbarui User' : 'Simpan User'}</span>`;
    lucide.createIcons();
  }
}

window.confirmDeleteUser = function(userId, userNik) {
  state.modalAction = 'deleteUser';
  state.pendingDeleteUserId = userId;
  state.pendingDeleteUserNik = userNik;

  DOM.modalConfirmTitle.innerHTML = `<i data-lucide="trash-2"></i> Konfirmasi Hapus User`;
  DOM.modalConfirmMsg.textContent = `Apakah Anda yakin ingin menghapus user (${userNik}) secara permanen?`;
  DOM.modalConfirmOkText.textContent = 'Ya, Hapus User';
  DOM.modalConfirm.classList.add('active');
  lucide.createIcons();
};

async function performDeleteUser() {
  if (!state.pendingDeleteUserId || !state.supabaseClient) return;

  try {
    const { error } = await state.supabaseClient
      .from('users_teknisi')
      .delete()
      .eq('id', state.pendingDeleteUserId);

    if (error) throw error;

    showToast(`🗑️ User (${state.pendingDeleteUserNik}) Berhasil Dihapus!`, 'info');
    fetchAdminUsersList();
  } catch (err) {
    console.error('Delete user error:', err);
    showToast(`Gagal hapus user: ${err.message}`, 'error');
  } finally {
    state.pendingDeleteUserId = null;
    state.pendingDeleteUserNik = null;
  }
}
