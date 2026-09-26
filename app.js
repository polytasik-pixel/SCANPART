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
  THEME: 'teknisi_app_theme',
  SHEETS_CACHE: 'google_sheets_cache'
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
  adminUsersChannel: null,
  // Google Sheets Data State
  sheetsData: {
    lastUpdateTimestamp: 'Memuat...',
    lastSyncTime: null,
    pendingCases: [],
    insentifRows: [],
    rata2Rows: [],
    outputHariIni: [],
    notifications: []
  },
  sheetsPollTimer: null,
  isFetchingSheets: false,
  pendingSearchQuery: ''
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
  appNav: document.getElementById('app-nav'),
  navItems: document.querySelectorAll('.nav-item'),
  tabContents: document.querySelectorAll('.tab-content'),
  navItemUsers: document.getElementById('nav-item-users'),
  
  // App Header & Sheet Update Bar
  headerNama: document.getElementById('header-nama'),
  headerNik: document.getElementById('header-nik'),
  headerPswStatus: document.getElementById('header-psw-status'),
  headerPswText: document.getElementById('header-psw-text'),
  headerNotifBtn: document.getElementById('header-notif-btn'),
  headerBellBadge: document.getElementById('header-bell-badge'),
  sheetUpdateBar: document.getElementById('sheet-update-bar'),
  syncIcon: document.getElementById('sync-icon'),
  sheetZ2Timestamp: document.getElementById('sheet-z2-timestamp'),
  syncStatusBadge: document.getElementById('sync-status-badge'),
  
  // Menu Hub Mode Selector
  btnSelectModeScan: document.getElementById('btn-select-mode-scan'),
  btnSelectModeTeknisi: document.getElementById('btn-select-mode-teknisi'),

  // Navigation Badges
  navPendingBadge: document.getElementById('nav-pending-badge'),
  navNotifBadge: document.getElementById('nav-notif-badge'),

  // Sheets View Containers & Controls
  btnRefreshPending: document.getElementById('btn-refresh-pending'),
  inputSearchPending: document.getElementById('input-search-pending'),
  btnClearSearchPending: document.getElementById('btn-clear-search-pending'),
  pendingTechCount: document.getElementById('pending-tech-count'),
  pendingListContainer: document.getElementById('pending-list-container'),
  
  btnRefreshPerforma: document.getElementById('btn-refresh-performa'),
  performaContentContainer: document.getElementById('performa-content-container'),
  
  btnRefreshNotif: document.getElementById('btn-refresh-notif'),
  notifTechCount: document.getElementById('notif-tech-count'),
  notifListContainer: document.getElementById('notif-list-container'),
  
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
  stopSheetsPolling();
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

  switchTab('tab-menu', false);
  updateUIFromState();
  subscribeRealtimeSettings();
  subscribeGlobalQueueRealtime();
  startScanner();
  
  // Google Sheets Single Source of Truth: load cache first, then start 10s auto poller
  loadSheetsCache();
  startSheetsPolling();
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

  // Mode Hub Cards Click Listeners
  if (DOM.btnSelectModeScan) {
    DOM.btnSelectModeScan.addEventListener('click', () => {
      requestTabSwitch('tab-scan');
    });
  }
  if (DOM.btnSelectModeTeknisi) {
    DOM.btnSelectModeTeknisi.addEventListener('click', () => {
      requestTabSwitch('tab-pending');
    });
  }

  // Navigation Tabs & Header Bell
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => {
      requestTabSwitch(item.getAttribute('data-target'));
    });
  });

  if (DOM.headerNotifBtn) {
    DOM.headerNotifBtn.addEventListener('click', () => {
      requestTabSwitch('tab-notif');
    });
  }

  // Google Sheets Refresh & Search Listeners
  if (DOM.sheetUpdateBar) {
    DOM.sheetUpdateBar.style.cursor = 'pointer';
    DOM.sheetUpdateBar.title = 'Klik untuk refresh data Google Sheet';
    DOM.sheetUpdateBar.addEventListener('click', () => {
      showToast('🔄 Memperbarui data dari Google Sheet...', 'info');
      fetchGoogleSheetsData();
    });
  }

  if (DOM.btnRefreshPending) DOM.btnRefreshPending.addEventListener('click', () => fetchGoogleSheetsData());
  if (DOM.btnRefreshPerforma) DOM.btnRefreshPerforma.addEventListener('click', () => fetchGoogleSheetsData());
  if (DOM.btnRefreshNotif) DOM.btnRefreshNotif.addEventListener('click', () => fetchGoogleSheetsData());

  if (DOM.inputSearchPending) {
    DOM.inputSearchPending.addEventListener('input', (e) => {
      state.pendingSearchQuery = e.target.value;
      if (DOM.btnClearSearchPending) {
        DOM.btnClearSearchPending.style.display = e.target.value ? 'block' : 'none';
      }
      renderPendingTab();
    });
  }

  if (DOM.btnClearSearchPending) {
    DOM.btnClearSearchPending.addEventListener('click', () => {
      state.pendingSearchQuery = '';
      if (DOM.inputSearchPending) DOM.inputSearchPending.value = '';
      DOM.btnClearSearchPending.style.display = 'none';
      renderPendingTab();
    });
  }

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

function updateModeNavVisibility(targetTabId) {
  // Determine active mode
  if (targetTabId === 'tab-menu') {
    state.currentMode = 'menu';
  } else if (targetTabId === 'tab-scan' || targetTabId === 'tab-history') {
    state.currentMode = 'scan';
  } else if (targetTabId === 'tab-pending' || targetTabId === 'tab-performa' || targetTabId === 'tab-notif') {
    state.currentMode = 'teknisi';
  }

  // 1. PSW Status Badge (PSW: ON/OFF)
  // Hide on teknisi mode & menu mode, show only on scan mode or profile
  if (DOM.headerPswStatus) {
    DOM.headerPswStatus.classList.toggle('hidden', state.currentMode === 'teknisi' || state.currentMode === 'menu');
  }

  // 2. Header Bell Notification Button (#header-notif-btn)
  // Show ONLY when in teknisi mode (Pending / Performa / Notif), hide in scan mode & menu hub!
  if (DOM.headerNotifBtn) {
    DOM.headerNotifBtn.classList.toggle('hidden', state.currentMode !== 'teknisi');
  }

  // 3. On tab-menu (Menu Utama Hub), hide bottom navbar & sheet update bar completely!
  if (targetTabId === 'tab-menu') {
    if (DOM.appNav) DOM.appNav.classList.add('hidden');
    if (DOM.sheetUpdateBar) DOM.sheetUpdateBar.classList.add('hidden');
    return;
  }

  // 4. On sub-pages, show bottom navbar
  if (DOM.appNav) DOM.appNav.classList.remove('hidden');

  // Show sheet update bar only when in teknisi mode
  if (DOM.sheetUpdateBar) {
    DOM.sheetUpdateBar.classList.toggle('hidden', state.currentMode !== 'teknisi');
  }

  // Filter individual navbar items according to active mode
  DOM.navItems.forEach(item => {
    const mode = item.getAttribute('data-mode');
    const isTargetUserAdmin = item.id === 'nav-item-users';

    if (isTargetUserAdmin && !state.isAdmin) {
      item.classList.add('hidden');
      return;
    }

    if (mode === 'all') {
      item.classList.remove('hidden');
    } else if (mode === state.currentMode) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

function switchTab(targetTabId, pushState = true) {
  if (state.activeTab === targetTabId) return;

  if (pushState) {
    try {
      history.pushState({ tab: targetTabId }, '', '#' + targetTabId);
    } catch (e) {}
  }
  state.activeTab = targetTabId;

  updateModeNavVisibility(targetTabId);

  DOM.navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-target') === targetTabId);
  });
  DOM.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === targetTabId);
  });

  lucide.createIcons();
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
      .select('id, status, teknisi_nik')
      .in('status', ['pending', 'processing'])
      .limit(20);

    if (error) return;

    const hasPending = data && data.length > 0;

    if (hasPending) {
      openGlobalQueueModal(data);
    } else {
      closeGlobalQueueModal();
    }
  } catch (err) {
    console.warn('Check global queue error:', err);
  }
}

function openGlobalQueueModal(pendingRecords = []) {
  const currentNik = String(state.profile.nik || '').trim();

  // Cek apakah transaksi yang pending ini adalah milik user yang sedang login sendiri
  const isSelfTransaction = pendingRecords.some(r => String(r.teknisi_nik || '').trim() === currentNik);

  if (DOM.modalQueueMsg) {
    if (isSelfTransaction) {
      DOM.modalQueueMsg.textContent = 'Transaksi sedang di proses mohon menunggu...';
    } else {
      DOM.modalQueueMsg.textContent = 'TERDAPAT TRANSAKSI YANG SEDANG DI PROSES. MOHON MENUNGGU...';
    }
  }

  if (!state.isGlobalQueueBlocking) {
    state.isGlobalQueueBlocking = true;
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

// ==========================================
// GOOGLE SHEETS LIVE DATA INTEGRATION & CACHE MODULE
// ==========================================
const GOOGLE_SHEET_ID = '1YhZ9aC-ypray0WwSZxY5dXNVraqLm-BNIuyWYNUkUQ0';

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function cleanNameString(str) {
  if (!str) return '';
  return String(str)
    .toUpperCase()
    .replace(/[\u00A0\u200B]/g, ' ')
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchTechName(sheetName, userName, userNik = '') {
  if (!sheetName) return false;

  const sClean = cleanNameString(sheetName);
  const uClean = cleanNameString(userName);
  const nClean = cleanNameString(userNik);

  if (!sClean) return false;

  // 1. Direct match with NIK if available in sheet cell
  if (nClean && nClean.length >= 3 && (sClean === nClean || sClean.includes(nClean))) {
    return true;
  }

  if (!uClean) return false;

  // 2. Direct equality or substring match
  if (sClean === uClean || sClean.includes(uClean) || uClean.includes(sClean)) {
    return true;
  }

  // 3. Token Word Match
  const sWords = sClean.split(' ').filter(w => w.length > 0);
  const uWords = uClean.split(' ').filter(w => w.length > 0);

  if (sWords.length === 0 || uWords.length === 0) return false;

  for (let uWord of uWords) {
    if (uWord.length < 2) continue;
    for (let sWord of sWords) {
      if (sWord.length < 2) continue;

      // Exact word match or inclusion
      if (sWord === uWord || sWord.includes(uWord) || uWord.includes(sWord)) {
        return true;
      }

      // Typo tolerance: allow 1 edit for 3-5 char words (e.g. REDI/REDY), 2 edits for >5 char words
      const maxLen = Math.max(sWord.length, uWord.length);
      if (Math.abs(sWord.length - uWord.length) <= 2) {
        const dist = levenshteinDistance(sWord, uWord);
        const maxAllowed = maxLen <= 5 ? 1 : 2;
        if (dist <= maxAllowed) {
          return true;
        }
      }
    }
  }

  // 4. Full string similarity
  const dist = levenshteinDistance(sClean, uClean);
  const maxL = Math.max(sClean.length, uClean.length);
  return ((maxL - dist) / maxL) >= 0.5;
}

function loadSheetsCache() {
  const cached = localStorage.getItem(STORAGE_KEYS.SHEETS_CACHE);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      state.sheetsData = {
        ...state.sheetsData,
        ...parsed
      };
      renderAllSheetsViews();
    } catch (e) {
      console.warn('Gagal parse cache Google Sheets:', e);
    }
  }
}

function saveSheetsCache() {
  try {
    localStorage.setItem(STORAGE_KEYS.SHEETS_CACHE, JSON.stringify(state.sheetsData));
  } catch (e) {
    console.warn('Gagal simpan cache Google Sheets:', e);
  }
}

async function fetchGVizSheet(sheetName) {
  // Use JSONP dynamic script injection to bypass CORS policy restrictions completely
  try {
    return await new Promise((resolve, reject) => {
      const callbackName = 'gviz_cb_' + Math.floor(Math.random() * 1000000);
      const timeout = setTimeout(() => {
        if (window[callbackName]) delete window[callbackName];
        const el = document.getElementById(callbackName);
        if (el) el.remove();
        reject(new Error(`Timeout fetching sheet ${sheetName}`));
      }, 10000);

      window[callbackName] = function(response) {
        clearTimeout(timeout);
        delete window[callbackName];
        const el = document.getElementById(callbackName);
        if (el) el.remove();
        if (response && response.table) {
          resolve(response.table);
        } else {
          reject(new Error(`Response table invalid for sheet ${sheetName}`));
        }
      };

      const script = document.createElement('script');
      script.id = callbackName;
      script.src = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=responseHandler:${callbackName}&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
      script.onerror = function(err) {
        clearTimeout(timeout);
        if (window[callbackName]) delete window[callbackName];
        script.remove();
        reject(err);
      };
      document.body.appendChild(script);
    });
  } catch (jsonpErr) {
    // Fallback to fetch API if JSONP fails
    const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
    const res = await fetch(url);
    const text = await res.text();
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    if (!jsonMatch) throw new Error(`Format respon Google Sheet ${sheetName} tidak valid`);
    const parsed = JSON.parse(jsonMatch[1]);
    return parsed.table;
  }
}

function extractMatrixFromGViz(table) {
  if (!table || !table.rows) return [];
  return table.rows.map(row => {
    if (!row || !row.c) return [];
    return row.c.map(cell => {
      if (!cell) return '';
      if (cell.f !== undefined && cell.f !== null) return String(cell.f).trim();
      if (cell.v !== undefined && cell.v !== null) return String(cell.v).trim();
      return '';
    });
  });
}

async function fetchGoogleSheetsData() {
  if (!state.isLoggedIn || state.isFetchingSheets) return;
  state.isFetchingSheets = true;

  if (DOM.syncIcon) DOM.syncIcon.classList.add('spinning');

  try {
    const [tableData, tableNotif] = await Promise.all([
      fetchGVizSheet('DATA'),
      fetchGVizSheet('NOTIF')
    ]);

    const rowsData = extractMatrixFromGViz(tableData);
    const rowsNotif = extractMatrixFromGViz(tableNotif);

    const techName = state.profile.nama || '';
    const techNik = state.profile.nik || '';

    // 1. Timestamp Z2 (Col index 25, Row index 1 = cell Z2)
    let lastUpdateStr = '';
    if (rowsData.length > 1 && rowsData[1][25]) {
      lastUpdateStr = rowsData[1][25];
    } else if (rowsData.length > 0 && rowsData[0][25]) {
      lastUpdateStr = rowsData[0][25];
    }
    
    if (!lastUpdateStr || lastUpdateStr.length < 3) {
      const now = new Date();
      lastUpdateStr = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }

    // 2. Pending Cases (Cols A-J, indices 0-9, Row 1+)
    // Col 0: TGL, 1: NO SCL, 2: TYPE, 3: SERI, 4: LAYANAN, 5: STOK IN, 6: STATUS, 7: TEKNISI (COL H), 8: KET PART, 9: USIA
    const pendingCases = [];
    for (let r = 0; r < rowsData.length; r++) {
      const row = rowsData[r];
      if (!row || row.length === 0) continue;
      const rowTech = row[7] || '';
      if (rowTech && matchTechName(rowTech, techName, techNik)) {
        pendingCases.push({
          tgl: row[0] || '',
          no_scl: row[1] || '',
          type: row[2] || '',
          seri: row[3] || '',
          layanan: row[4] || '',
          stok_in: row[5] || '',
          status: row[6] || '',
          teknisi: row[7] || '',
          ket_part: row[8] || '',
          usia: row[9] || ''
        });
      }
    }

    // 3. Insentif Rows (Cols K-V, indices 10-21, Row 1+)
    // 10: NAMA (COL K), 11: NIK, 12: JOB, 13: MULTI, 14: INDOOR, 15: OUTDOOR, 16: AC, 17: EV1, 18: EV2, 19: EV3, 20: KONVERSI (COL U), 21: INSENTIF (COL V)
    const insentifRows = [];
    for (let r = 0; r < rowsData.length; r++) {
      const row = rowsData[r];
      if (!row || row.length === 0) continue;
      const rowNama = row[10] || '';
      if (rowNama && matchTechName(rowNama, techName, techNik)) {
        insentifRows.push({
          nama: row[10] || '',
          nik: row[11] || '',
          job: row[12] || '',
          multi: row[13] || '',
          indoor: row[14] || '0',
          outdoor: row[15] || '0',
          ac: row[16] || '0',
          ev1: row[17] || '0',
          ev2: row[18] || '0',
          ev3: row[19] || '0',
          konversi: row[20] || '0',
          insentif: (row[21] && String(row[21]).trim() !== '' && String(row[21]).trim() !== '0') ? row[21] : (row[20] || '0')
        });
      }
    }

    // 4. Rata-Rata & Selisih Unit (Cols W-Y, indices 22-24, Row 1+)
    // 22: NAMA (COL W), 23: RATA-RATA, 24: SELISIH UNIT
    const rata2Rows = [];
    for (let r = 0; r < rowsData.length; r++) {
      const row = rowsData[r];
      if (!row || row.length === 0) continue;
      const rowNama = row[22] || '';
      if (rowNama && matchTechName(rowNama, techName, techNik)) {
        rata2Rows.push({
          nama: row[22] || '',
          rata_rata: row[23] || '0',
          selisih_unit: row[24] || '0'
        });
      }
    }

    // 5. Output Hari Ini (Tabel K12-L20, row indices 10 to 19)
    const outputHariIni = [];
    for (let r = 10; r <= 19; r++) {
      if (r < rowsData.length) {
        const row = rowsData[r];
        if (row && row.length > 10) {
          const rowNama = row[10] || '';
          const outputVal = row[11];
          if (rowNama && outputVal !== undefined && outputVal !== null && String(outputVal).trim() !== '' && matchTechName(rowNama, techName, techNik)) {
            outputHariIni.push({
              nama: rowNama,
              total_output: String(outputVal)
            });
          }
        }
      }
    }

    // 6. Notifications (Sheet NOTIF, Cols A-J, indices 0-9)
    // 0: NO SCL, 1: TYPE, 2: SERI, 3: LAYANAN, 4: STOK IN, 5: STATUS, 6: TEKNISI, 7: KET PART, 8: USIA, 9: NOTES
    const notifications = [];
    for (let r = 0; r < rowsNotif.length; r++) {
      const row = rowsNotif[r];
      if (!row || row.length === 0) continue;
      const rowTech = row[6] || row[7] || '';
      if (rowTech && matchTechName(rowTech, techName, techNik)) {
        notifications.push({
          no_scl: row[0] || '',
          type: row[1] || '',
          seri: row[2] || '',
          layanan: row[3] || '',
          stok_in: row[4] || '',
          status: row[5] || '',
          teknisi: rowTech || '',
          ket_part: row[7] || '',
          usia: row[8] || '',
          notes: row[9] || ''
        });
      }
    }

    // Update state & single source of truth cache
    state.sheetsData = {
      lastUpdateTimestamp: lastUpdateStr,
      lastSyncTime: Date.now(),
      pendingCases,
      insentifRows,
      rata2Rows,
      outputHariIni,
      notifications
    };

    saveSheetsCache();
    renderAllSheetsViews();

  } catch (err) {
    console.warn('Polling Google Sheets gagal (menggunakan cache):', err);
  } finally {
    state.isFetchingSheets = false;
    if (DOM.syncIcon) DOM.syncIcon.classList.remove('spinning');
  }
}

function startSheetsPolling() {
  stopSheetsPolling();
  fetchGoogleSheetsData();
  state.sheetsPollTimer = setInterval(fetchGoogleSheetsData, 10000);
}

function stopSheetsPolling() {
  if (state.sheetsPollTimer) {
    clearInterval(state.sheetsPollTimer);
    state.sheetsPollTimer = null;
  }
}

function renderAllSheetsViews() {
  renderSheetUpdateInfo();
  renderPendingTab();
  renderPerformaTab();
  renderNotifTab();
  updateBadges();
}

function renderSheetUpdateInfo() {
  if (DOM.sheetZ2Timestamp) {
    DOM.sheetZ2Timestamp.textContent = state.sheetsData.lastUpdateTimestamp || 'Live (Google Sheet)';
  }
}

function updateBadges() {
  const notifCount = state.sheetsData.notifications ? state.sheetsData.notifications.length : 0;
  const pendingCount = state.sheetsData.pendingCases ? state.sheetsData.pendingCases.length : 0;

  if (DOM.headerBellBadge) {
    DOM.headerBellBadge.textContent = notifCount;
    DOM.headerBellBadge.classList.toggle('hidden', notifCount === 0);
  }
  if (DOM.navNotifBadge) {
    DOM.navNotifBadge.textContent = notifCount;
    DOM.navNotifBadge.classList.toggle('hidden', notifCount === 0);
  }
  if (DOM.navPendingBadge) {
    DOM.navPendingBadge.textContent = pendingCount;
    DOM.navPendingBadge.classList.toggle('hidden', pendingCount === 0);
  }

  if (DOM.pendingTechCount) DOM.pendingTechCount.textContent = `${pendingCount} Case`;
  if (DOM.notifTechCount) DOM.notifTechCount.textContent = `${notifCount} Notif`;
}

function renderPendingTab() {
  if (!DOM.pendingListContainer) return;
  const cases = state.sheetsData.pendingCases || [];
  const searchQ = (state.pendingSearchQuery || '').trim().toUpperCase();

  const filtered = cases.filter(item => {
    if (!searchQ) return true;
    return (
      (item.no_scl && item.no_scl.toUpperCase().includes(searchQ)) ||
      (item.type && item.type.toUpperCase().includes(searchQ)) ||
      (item.seri && item.seri.toUpperCase().includes(searchQ)) ||
      (item.status && item.status.toUpperCase().includes(searchQ)) ||
      (item.ket_part && item.ket_part.toUpperCase().includes(searchQ))
    );
  });

  if (filtered.length === 0) {
    DOM.pendingListContainer.innerHTML = `
      <div class="empty-state-sm">
        <i data-lucide="check-circle-2" class="text-success" style="width:32px;height:32px;"></i>
        <p>${searchQ ? 'Tidak ada case pending yang cocok dengan pencarian.' : 'Tidak ada case pending untuk Anda saat ini.'}</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  DOM.pendingListContainer.innerHTML = filtered.map(item => {
    const statusLower = (item.status || '').toLowerCase();
    let statusClass = 'printed';
    if (statusLower.includes('wip comp') || statusLower.includes('selesai')) statusClass = 'wip-comp';
    else if (statusLower.includes('wip')) statusClass = 'wip';

    return `
      <div class="pending-card">
        <div class="pending-card-header">
          <div class="pending-scl">
            <i data-lucide="file-text"></i> ${item.no_scl || '-'}
          </div>
        </div>
        <div class="pending-info-grid">
          <div class="pending-info-item">
            <span>Tgl Case</span>
            <strong>${item.tgl || '-'}</strong>
          </div>
          <div class="pending-info-item">
            <span>Layanan</span>
            <strong>${item.layanan || '-'}</strong>
          </div>
          <div class="pending-info-item">
            <span>Type Unit</span>
            <strong>${item.type || '-'}</strong>
          </div>
          <div class="pending-info-item">
            <span>No Seri</span>
            <strong>${item.seri || '-'}</strong>
          </div>
        </div>
        ${item.ket_part ? `<div style="margin-top:4px;font-size:10px;"><span class="pending-part-desc">${item.ket_part}</span></div>` : ''}
        <div class="pending-card-footer">
          <span class="pending-status-badge ${statusClass}">${item.status || 'PENDING'}</span>
          <span class="pending-age-badge">Usia: ${item.usia ? item.usia + ' Hari' : '-'}</span>
        </div>
      </div>`;
  }).join('');

  lucide.createIcons();
}

function formatRupiah(val) {
  if (val === undefined || val === null || val === '') return 'Rp 0';
  let str = String(val).trim();
  if (!str || str === '0') return 'Rp 0';

  if (/^rp/i.test(str)) {
    return str.replace(/^rp\s*/i, 'Rp ');
  }

  if (/^\d{1,3}(\.\d{3})+$/.test(str)) {
    return 'Rp ' + str;
  }
  if (/^\d{1,3}(\.\d{3})+,\d+$/.test(str)) {
    return 'Rp ' + str;
  }

  let normalizedStr = str;
  if (str.includes(',') && !str.includes('.')) {
    normalizedStr = str.replace(',', '.');
  } else if (str.includes('.') && str.includes(',')) {
    normalizedStr = str.replace(/\./g, '').replace(',', '.');
  }

  let parsed = parseFloat(normalizedStr);
  if (isNaN(parsed)) {
    return 'Rp ' + str;
  }

  let formatted = parsed.toLocaleString('id-ID', {
    maximumFractionDigits: 2
  });

  return 'Rp ' + formatted;
}

function renderPerformaTab() {
  if (!DOM.performaContentContainer) return;
  const insentif = state.sheetsData.insentifRows[0] || {};
  const rata2 = state.sheetsData.rata2Rows[0] || {};
  const outputObj = state.sheetsData.outputHariIni[0] || {};

  DOM.performaContentContainer.innerHTML = `
    <!-- Hero Performance Overview -->
    <div class="performa-hero-card">
      <div class="performa-hero-title">
        <i data-lucide="user"></i> ${state.profile.nama || 'Teknisi'}
      </div>
      <div class="performa-hero-grid">
        <div class="performa-hero-item">
          <div class="performa-hero-value">${formatRupiah(insentif.insentif)}</div>
          <div class="performa-hero-label">Point Insentif</div>
        </div>
        <div class="performa-hero-item">
          <div class="performa-hero-value" style="color:var(--secondary);">${outputObj.total_output || '0'}</div>
          <div class="performa-hero-label">Output Hari Ini</div>
        </div>
      </div>
    </div>

    <!-- Rating & Selisih Stats -->
    <div class="performa-sub-title">
      <i data-lucide="award"></i> Evaluasi & Rata-Rata Unit
    </div>
    <div class="performa-stat-grid">
      <div class="performa-stat-box">
        <div class="stat-val" style="color:var(--warning);">${rata2.rata_rata || '0.0'}</div>
        <div class="stat-lbl">Rata-Rata</div>
      </div>
      <div class="performa-stat-box">
        <div class="stat-val" style="color:var(--secondary);">${rata2.selisih_unit || '0'}</div>
        <div class="stat-lbl">Selisih Unit</div>
      </div>
      <div class="performa-stat-box">
        <div class="stat-val">${insentif.konversi || '0'}</div>
        <div class="stat-lbl"># Konversi</div>
      </div>
    </div>

    <!-- Category Detail Units Breakdown -->
    <div class="performa-sub-title">
      <i data-lucide="layers"></i> Rincian Pengerjaan Unit
    </div>
    <div class="performa-stat-grid">
      <div class="performa-stat-box">
        <div class="stat-val">${insentif.indoor || '0'}</div>
        <div class="stat-lbl">Indoor</div>
      </div>
      <div class="performa-stat-box">
        <div class="stat-val">${insentif.outdoor || '0'}</div>
        <div class="stat-lbl">Outdoor</div>
      </div>
      <div class="performa-stat-box">
        <div class="stat-val">${insentif.ac || '0'}</div>
        <div class="stat-lbl">AC</div>
      </div>
      <div class="performa-stat-box">
        <div class="stat-val">${insentif.ev1 || '0'}</div>
        <div class="stat-lbl">EV 1</div>
      </div>
      <div class="performa-stat-box">
        <div class="stat-val">${insentif.ev2 || '0'}</div>
        <div class="stat-lbl">EV 2</div>
      </div>
      <div class="performa-stat-box">
        <div class="stat-val">${insentif.ev3 || '0'}</div>
        <div class="stat-lbl">EV 3</div>
      </div>
    </div>`;

  lucide.createIcons();
}

function renderNotifTab() {
  if (!DOM.notifListContainer) return;
  const list = state.sheetsData.notifications || [];

  if (list.length === 0) {
    DOM.notifListContainer.innerHTML = `
      <div class="empty-state-sm">
        <i data-lucide="bell-off" style="width:32px;height:32px;color:var(--text-muted);"></i>
        <p>Tidak ada notifikasi baru untuk Anda.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  DOM.notifListContainer.innerHTML = list.map(item => `
    <div class="notif-card">
      <div class="notif-card-header">
        <span class="notif-scl">${item.no_scl || 'INFORMASI'}</span>
        <span class="notif-status">${item.status || 'INFO'}</span>
      </div>
      <div class="notif-detail">
        <strong>${item.type || ''}</strong> ${item.seri ? ' - ' + item.seri : ''}
      </div>
      ${item.ket_part ? `<div style="font-size:10px;color:var(--warning);font-weight:600;"><i data-lucide="info" style="width:11px;height:11px;display:inline;"></i> ${item.ket_part}</div>` : ''}
    </div>`).join('');

  lucide.createIcons();
}
