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
  SHEETS_CACHE: 'google_sheets_cache',
  PIPO_CACHE: 'pipo_sheets_cache',
  FINISH_HISTORY: 'teknisi_finish_history',
  FINISH_SHEET_CACHE: 'finish_sheet_cache'
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
  finishHistory: [],
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
  appSettingsChannel: null,
  showTransferStok: false,
  transferProcessMode: 'STAFPART', // 'STAFPART' | 'HODS'
  // Google Sheets Data State
  tagihanSearchQuery: '',
  sheetsData: {
    lastUpdateTimestamp: 'Memuat data....',
    pendingTimestamp: 'Memuat data....',
    performaTimestamp: 'Memuat data....',
    partKembaliTimestamp: 'Memuat data....',
    tagihanTimestamp: 'Memuat data....',
    lastSyncTime: null,
    pendingCases: [],
    insentifRows: [],
    rata2Rows: [],
    outputHariIni: [],
    notifications: [],
    partBelumKembali: [],
    tagihanRows: []
  },
  sheetsPollTimer: null,
  isFetchingSheets: false,
  pendingSearchQuery: '',
  partKembaliSearchQuery: '',
  // PIPO Part Pengganti State
  pipoData: [],
  isFetchingPipo: false,
  pipoSearchQuery: '',
  pipoLimit: 40
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
  headerBtnMissing: document.getElementById('header-btn-missing'),
  headerNotifBtn: document.getElementById('header-notif-btn'),
  headerBellBadge: document.getElementById('header-bell-badge'),
  sheetUpdateBar: document.getElementById('sheet-update-bar'),
  syncIcon: document.getElementById('sync-icon'),
  sheetZ2Timestamp: document.getElementById('sheet-z2-timestamp'),
  syncStatusBadge: document.getElementById('sync-status-badge'),
  
  // Menu Hub Mode Selector
  btnSelectModeScan: document.getElementById('btn-select-mode-scan'),
  btnSelectModeTeknisi: document.getElementById('btn-select-mode-teknisi'),
  btnSelectModePipo: document.getElementById('btn-select-mode-pipo'),
  btnSelectModeFinish: document.getElementById('btn-select-mode-finish'),

  // Part Pengganti (PIPO) Controls
  inputSearchPipo: document.getElementById('input-search-pipo'),
  btnClearSearchPipo: document.getElementById('btn-clear-search-pipo'),
  pipoCount: document.getElementById('pipo-count'),
  pipoListContainer: document.getElementById('pipo-list-container'),

  // Finish Harian Controls (Google Form Fields)
  formFinishHarian: document.getElementById('form-finish-harian'),
  finishNama: document.getElementById('finish-nama'),
  finishTgl: document.getElementById('finish-tgl'),
  finishCaseOutdoor: document.getElementById('finish-case-outdoor'),
  finishFinishOutdoor: document.getElementById('finish-finish-outdoor'),
  finishFinishIndoor: document.getElementById('finish-finish-indoor'),
  finishWipComp: document.getElementById('finish-wip-comp'),
  finishWipTech: document.getElementById('finish-wip-tech'),
  finishBatal: document.getElementById('finish-batal'),
  finishAntar: document.getElementById('finish-antar'),
  finishNoVisit: document.getElementById('finish-no-visit'),
  finishKet: document.getElementById('finish-ket'),
  btnSubmitFinish: document.getElementById('btn-submit-finish'),
  finishHistoryList: document.getElementById('finish-history-list'),
  btnOpenMissingModal: document.getElementById('btn-open-missing-modal'),
  modalMissingFinish: document.getElementById('modal-missing-finish'),
  btnCloseMissingModal: document.getElementById('btn-close-missing-modal'),
  btnDismissMissingModal: document.getElementById('btn-dismiss-missing-modal'),
  btnRefreshMissing: document.getElementById('btn-refresh-missing'),
  syncIconMissing: document.getElementById('sync-icon-missing'),
  missingFinishSummary: document.getElementById('missing-finish-summary'),
  missingFinishList: document.getElementById('missing-finish-list'),
  btnFinishPageForm: document.getElementById('btn-finish-page-form'),
  btnFinishPageAll: document.getElementById('btn-finish-page-all'),
  finishPageForm: document.getElementById('finish-page-form'),
  finishPageAll: document.getElementById('finish-page-all'),
  btnRefreshFinishAll: document.getElementById('btn-refresh-finish-all'),
  syncIconFinishAll: document.getElementById('sync-icon-finish-all'),
  finishAllFilterDate: document.getElementById('finish-all-filter-date'),
  btnClearFinishFilterDate: document.getElementById('btn-clear-finish-filter-date'),
  finishAllFilterTech: document.getElementById('finish-all-filter-tech'),
  finishAllTechFilterWrapper: document.getElementById('finish-all-tech-filter-wrapper'),
  finishAllSummary: document.getElementById('finish-all-summary'),
  finishAllList: document.getElementById('finish-all-list'),

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
  
  // Part Bekas Controls
  inputSearchPartKembali: document.getElementById('input-search-part-kembali'),
  btnClearSearchPartKembali: document.getElementById('btn-clear-search-part-kembali'),
  partKembaliCount: document.getElementById('part-kembali-count'),
  partKembaliTotalQty: document.getElementById('part-kembali-total-qty'),
  partKembaliListContainer: document.getElementById('part-kembali-list-container'),

  // Tagihan Controls
  tagihanUpdateTimestamp: document.getElementById('tagihan-update-timestamp'),
  tagihanCount: document.getElementById('tagihan-count'),
  tagihanTotalJumlah: document.getElementById('tagihan-total-jumlah'),
  inputSearchTagihan: document.getElementById('input-search-tagihan'),
  btnClearSearchTagihan: document.getElementById('btn-clear-search-tagihan'),
  tagihanListContainer: document.getElementById('tagihan-list-container'),
  
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
  btnQueueBackMenu: document.getElementById('btn-queue-back-menu'),
  
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

  // Admin User Management & App Settings
  adminTransferStokToggle: document.getElementById('admin-transfer-stok-toggle'),
  adminProcessModeContainer: document.getElementById('admin-process-mode-container'),
  adminProcessModeToggle: document.getElementById('admin-process-mode-toggle'),
  adminProcessModeLabel: document.getElementById('admin-process-mode-label'),
  adminProcessModeDesc: document.getElementById('admin-process-mode-desc'),
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
  // Load Finish Harian History
  const storedFinishHistory = localStorage.getItem(STORAGE_KEYS.FINISH_HISTORY);
  if (storedFinishHistory) {
    try { state.finishHistory = JSON.parse(storedFinishHistory); } catch (e) {}
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
  unsubscribeAppSettingsRealtime();
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

  try {
    history.replaceState({ tab: 'tab-menu' }, '', '#tab-menu');
    history.pushState({ tab: 'tab-menu' }, '', '#tab-menu');
  } catch (e) {}

  switchTab('tab-menu', false);
  updateUIFromState();
  subscribeRealtimeSettings();
  subscribeGlobalQueueRealtime();
  fetchAppSettings();
  subscribeAppSettingsRealtime();
  startScanner();
  
  // Load PIPO Cache & Start Data Polling / Fetching
  loadSheetsCache();
  startSheetsPolling();
  loadPipoCache();
  fetchPipoData();
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

// ==========================================
// REALTIME APP SETTINGS (SHOW / HIDE TRANSFER STOK MENU & PROCESS MODE)
// ==========================================
async function fetchAppSettings() {
  if (!state.supabaseClient) return;

  try {
    const { data, error } = await state.supabaseClient
      .from('app_settings')
      .select('*')
      .in('setting_key', ['show_transfer_stok', 'transfer_process_mode']);

    if (error) {
      console.warn('Error fetch app_settings:', error);
      return;
    }

    if (data && data.length > 0) {
      const stokSetting = data.find(s => s.setting_key === 'show_transfer_stok');
      if (stokSetting) {
        state.showTransferStok = (stokSetting.setting_value === 'true' || stokSetting.setting_value === true);
      }
      const modeSetting = data.find(s => s.setting_key === 'transfer_process_mode');
      if (modeSetting) {
        state.transferProcessMode = modeSetting.setting_value || 'STAFPART';
      }
    } else {
      await state.supabaseClient
        .from('app_settings')
        .upsert([
          { setting_key: 'show_transfer_stok', setting_value: 'true', updated_at: new Date().toISOString() },
          { setting_key: 'transfer_process_mode', setting_value: 'STAFPART', updated_at: new Date().toISOString() }
        ]);
      state.showTransferStok = true;
      state.transferProcessMode = 'STAFPART';
    }
    applyTransferStokVisibilityUI();
  } catch (err) {
    console.warn('Gagal memuat app_settings dari Supabase:', err);
  }
}

function subscribeAppSettingsRealtime() {
  if (!state.supabaseClient) return;

  unsubscribeAppSettingsRealtime();

  state.appSettingsChannel = state.supabaseClient
    .channel('global_app_settings')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'app_settings' },
      (payload) => {
        console.log('Realtime App Settings Postgres Change:', payload);
        if (payload.new) {
          if (payload.new.setting_key === 'show_transfer_stok') {
            const newVal = (payload.new.setting_value === 'true' || payload.new.setting_value === true);
            if (state.showTransferStok !== newVal) {
              state.showTransferStok = newVal;
              applyTransferStokVisibilityUI();
            }
          } else if (payload.new.setting_key === 'transfer_process_mode') {
            const newMode = payload.new.setting_value || 'STAFPART';
            if (state.transferProcessMode !== newMode) {
              state.transferProcessMode = newMode;
              applyTransferStokVisibilityUI();
              showToast(`Pengaturan: Mode Proses Transfer beralih ke ${newMode}`, 'info');
            }
          }
        }
      }
    )
    .on('broadcast', { event: 'toggle_transfer_stok' }, (data) => {
      console.log('Realtime Broadcast App Settings (stok):', data);
      if (data && data.payload && typeof data.payload.enabled === 'boolean') {
        const newVal = data.payload.enabled;
        if (state.showTransferStok !== newVal) {
          state.showTransferStok = newVal;
          applyTransferStokVisibilityUI();
        }
      }
    })
    .on('broadcast', { event: 'toggle_process_mode' }, (data) => {
      console.log('Realtime Broadcast App Settings (mode):', data);
      if (data && data.payload && data.payload.mode) {
        const newMode = data.payload.mode;
        if (state.transferProcessMode !== newMode) {
          state.transferProcessMode = newMode;
          applyTransferStokVisibilityUI();
          showToast(`Pengaturan: Mode Proses Transfer beralih ke ${newMode}`, 'info');
        }
      }
    })
    .subscribe((status) => {
      console.log('Status Langganan Realtime App Settings:', status);
    });
}

function unsubscribeAppSettingsRealtime() {
  if (state.appSettingsChannel && state.supabaseClient) {
    state.supabaseClient.removeChannel(state.appSettingsChannel);
    state.appSettingsChannel = null;
  }
}

function applyTransferStokVisibilityUI() {
  if (DOM.adminTransferStokToggle) {
    DOM.adminTransferStokToggle.checked = state.showTransferStok;
  }

  // Toggle card in main menu hub
  if (DOM.btnSelectModeScan) {
    DOM.btnSelectModeScan.style.display = state.showTransferStok ? '' : 'none';
  }

  // Toggle bottom navigation items for scan mode (Scan & Riwayat)
  const scanNavItems = document.querySelectorAll('.nav-item[data-mode="scan"]');
  scanNavItems.forEach(item => {
    item.style.display = state.showTransferStok ? '' : 'none';
  });

  // Show / Hide Admin Process Mode Container (ONLY visible when show_transfer_stok is TRUE)
  if (DOM.adminProcessModeContainer) {
    DOM.adminProcessModeContainer.style.display = state.showTransferStok ? '' : 'none';
  }

  // Update Process Mode Toggle UI
  const isHods = (state.transferProcessMode === 'HODS');
  if (DOM.adminProcessModeToggle) {
    DOM.adminProcessModeToggle.checked = isHods;
  }
  if (DOM.adminProcessModeLabel) {
    DOM.adminProcessModeLabel.textContent = isHods ? 'HODS' : 'STAFPART';
    DOM.adminProcessModeLabel.style.color = isHods ? 'var(--warning)' : 'var(--primary)';
  }
  if (DOM.adminProcessModeDesc) {
    DOM.adminProcessModeDesc.textContent = isHods
      ? 'HODS: Otomatis menjadi SKM (tanpa perlu milih dropdown SKM/HIT).'
      : 'STAFPART: Memerlukan pilihan dropdown SKM / HIT saat pengerjaan stok.';
  }

  // Redirect if currently on a scan tab and transfer stok is disabled
  if (!state.showTransferStok && (state.activeTab === 'tab-scan' || state.activeTab === 'tab-history')) {
    switchTab('tab-menu', false);
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
  applyTransferStokVisibilityUI();
  
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
      if (!state.showTransferStok) {
        showToast('Menu Transfer Stok sedang dinonaktifkan oleh Admin', 'warning');
        return;
      }
      requestTabSwitch('tab-scan');
    });
  }

  // Admin App Settings Toggle Listener (Show/Hide Transfer Stok)
  if (DOM.adminTransferStokToggle) {
    DOM.adminTransferStokToggle.addEventListener('change', async (e) => {
      const isChecked = e.target.checked;
      state.showTransferStok = isChecked;
      applyTransferStokVisibilityUI();

      if (state.supabaseClient) {
        try {
          const { error } = await state.supabaseClient
            .from('app_settings')
            .upsert({
              setting_key: 'show_transfer_stok',
              setting_value: isChecked ? 'true' : 'false',
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.error('Upsert app_settings error:', error);
            showToast(`Gagal update Supabase: ${error.message}`, 'error');
          }

          if (state.appSettingsChannel) {
            state.appSettingsChannel.send({
              type: 'broadcast',
              event: 'toggle_transfer_stok',
              payload: { enabled: isChecked }
            });
          }
        } catch (err) {
          console.error('Error saving app_settings toggle:', err);
        }
      }
    });
  }

  // Admin App Settings Toggle Listener (Process Mode: STAFPART / HODS)
  if (DOM.adminProcessModeToggle) {
    DOM.adminProcessModeToggle.addEventListener('change', async (e) => {
      const isHods = e.target.checked;
      const targetMode = isHods ? 'HODS' : 'STAFPART';
      state.transferProcessMode = targetMode;
      applyTransferStokVisibilityUI();
      showToast(`Mode Proses Transfer diubah ke ${targetMode}`, 'info');

      if (state.supabaseClient) {
        try {
          const { error } = await state.supabaseClient
            .from('app_settings')
            .upsert({
              setting_key: 'transfer_process_mode',
              setting_value: targetMode,
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.error('Upsert app_settings error:', error);
            showToast(`Gagal update mode proses: ${error.message}`, 'error');
          }

          if (state.appSettingsChannel) {
            state.appSettingsChannel.send({
              type: 'broadcast',
              event: 'toggle_process_mode',
              payload: { mode: targetMode }
            });
          }
        } catch (err) {
          console.error('Error saving process mode setting:', err);
        }
      }
    });
  }
  if (DOM.btnSelectModeTeknisi) {
    DOM.btnSelectModeTeknisi.addEventListener('click', () => {
      requestTabSwitch('tab-pending');
    });
  }
  if (DOM.btnSelectModePipo) {
    DOM.btnSelectModePipo.addEventListener('click', () => {
      requestTabSwitch('tab-pipo');
    });
  }
  if (DOM.btnSelectModeFinish) {
    DOM.btnSelectModeFinish.addEventListener('click', () => {
      requestTabSwitch('tab-finish');
    });
  }
  if (DOM.btnSelectModePartKembali) {
    DOM.btnSelectModePartKembali.addEventListener('click', () => {
      requestTabSwitch('tab-part-kembali');
    });
  }
  if (DOM.btnSelectModeTagihan) {
    DOM.btnSelectModeTagihan.addEventListener('click', () => {
      requestTabSwitch('tab-tagihan');
    });
  }
  if (DOM.btnSubmitFinish) {
    DOM.btnSubmitFinish.addEventListener('click', openFinishConfirmModal);
  }
  if (DOM.headerBtnMissing) DOM.headerBtnMissing.addEventListener('click', () => openMissingModal(false));
  if (DOM.btnOpenMissingModal) DOM.btnOpenMissingModal.addEventListener('click', () => openMissingModal(false));
  if (DOM.btnCloseMissingModal) DOM.btnCloseMissingModal.addEventListener('click', closeMissingModal);
  if (DOM.btnDismissMissingModal) DOM.btnDismissMissingModal.addEventListener('click', () => closeMissingModal());
  if (DOM.btnRefreshMissing) {
    DOM.btnRefreshMissing.addEventListener('click', () => {
      showToast('🔄 Memperbarui data dari Google Sheet...', 'info');
      openMissingModal(false);
    });
  }

  if (DOM.btnFinishPageForm) {
    DOM.btnFinishPageForm.addEventListener('click', () => {
      if (DOM.btnFinishPageForm) DOM.btnFinishPageForm.classList.add('active');
      if (DOM.btnFinishPageAll) DOM.btnFinishPageAll.classList.remove('active');
      if (DOM.finishPageForm) DOM.finishPageForm.style.display = 'block';
      if (DOM.finishPageAll) DOM.finishPageAll.style.display = 'none';
    });
  }

  if (DOM.btnFinishPageAll) {
    DOM.btnFinishPageAll.addEventListener('click', async () => {
      if (DOM.btnFinishPageAll) DOM.btnFinishPageAll.classList.add('active');
      if (DOM.btnFinishPageForm) DOM.btnFinishPageForm.classList.remove('active');
      if (DOM.finishPageAll) DOM.finishPageAll.style.display = 'block';
      if (DOM.finishPageForm) DOM.finishPageForm.style.display = 'none';
      
      if (DOM.syncIconFinishAll) DOM.syncIconFinishAll.classList.add('spinning');
      try {
        const { parsedAllRows } = await fetchFinishSheetData();
        renderFinishAllDataTab(parsedAllRows);
      } catch(e) {} finally {
        if (DOM.syncIconFinishAll) DOM.syncIconFinishAll.classList.remove('spinning');
      }
    });
  }

  if (DOM.btnRefreshFinishAll) {
    DOM.btnRefreshFinishAll.addEventListener('click', async () => {
      if (DOM.syncIconFinishAll) DOM.syncIconFinishAll.classList.add('spinning');
      showToast('🔄 Memperbarui data finish dari Google Sheet...', 'info');
      try {
        const { parsedAllRows } = await fetchFinishSheetData();
        renderFinishAllDataTab(parsedAllRows);
      } catch(e) {} finally {
        if (DOM.syncIconFinishAll) DOM.syncIconFinishAll.classList.remove('spinning');
      }
    });
  }

  if (DOM.finishAllFilterDate) {
    DOM.finishAllFilterDate.addEventListener('change', () => {
      renderFinishAllDataTab();
    });
  }

  if (DOM.btnClearFinishFilterDate) {
    DOM.btnClearFinishFilterDate.addEventListener('click', () => {
      if (DOM.finishAllFilterDate) DOM.finishAllFilterDate.value = '';
      if (DOM.finishAllFilterTech) DOM.finishAllFilterTech.value = '';
      renderFinishAllDataTab();
    });
  }

  if (DOM.finishNama) {
    DOM.finishNama.addEventListener('change', () => {
      if (DOM.modalMissingFinish && DOM.modalMissingFinish.classList.contains('active')) {
        openMissingModal(true);
      }
    });
  }

  // PIPO Search & Refresh Listeners
  if (DOM.btnRefreshPipo) {
    DOM.btnRefreshPipo.addEventListener('click', () => {
      showToast('🔄 Memperbarui data Part Pengganti (PIPO)...', 'info');
      fetchPipoData();
    });
  }

  if (DOM.inputSearchPipo) {
    let pipoTimer = null;
    DOM.inputSearchPipo.addEventListener('input', (e) => {
      const val = e.target.value;
      if (DOM.btnClearSearchPipo) {
        DOM.btnClearSearchPipo.style.display = val ? 'block' : 'none';
      }
      if (pipoTimer) clearTimeout(pipoTimer);
      pipoTimer = setTimeout(() => {
        state.pipoSearchQuery = val;
        state.pipoLimit = 40;
        renderPipoTab();
      }, 100);
    });
  }

  if (DOM.btnClearSearchPipo) {
    DOM.btnClearSearchPipo.addEventListener('click', () => {
      state.pipoSearchQuery = '';
      if (DOM.inputSearchPipo) DOM.inputSearchPipo.value = '';
      DOM.btnClearSearchPipo.style.display = 'none';
      renderPipoTab();
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

  // Refresh & Search Listeners
  if (DOM.sheetUpdateBar) {
    DOM.sheetUpdateBar.style.cursor = 'pointer';
    DOM.sheetUpdateBar.title = 'Klik untuk refresh data aplikasi';
    DOM.sheetUpdateBar.addEventListener('click', () => {
      showToast('🔄 Memperbarui data...', 'info');
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

  if (DOM.inputSearchPartKembali) {
    DOM.inputSearchPartKembali.addEventListener('input', (e) => {
      state.partKembaliSearchQuery = e.target.value;
      if (DOM.btnClearSearchPartKembali) {
        DOM.btnClearSearchPartKembali.style.display = e.target.value ? 'block' : 'none';
      }
      renderPartKembaliTab();
    });
  }

  if (DOM.btnClearSearchPartKembali) {
    DOM.btnClearSearchPartKembali.addEventListener('click', () => {
      state.partKembaliSearchQuery = '';
      if (DOM.inputSearchPartKembali) DOM.inputSearchPartKembali.value = '';
      DOM.btnClearSearchPartKembali.style.display = 'none';
      renderPartKembaliTab();
    });
  }

  if (DOM.inputSearchTagihan) {
    DOM.inputSearchTagihan.addEventListener('input', (e) => {
      state.tagihanSearchQuery = e.target.value;
      if (DOM.btnClearSearchTagihan) {
        DOM.btnClearSearchTagihan.style.display = e.target.value ? 'block' : 'none';
      }
      renderTagihanTab();
    });
  }

  if (DOM.btnClearSearchTagihan) {
    DOM.btnClearSearchTagihan.addEventListener('click', () => {
      state.tagihanSearchQuery = '';
      if (DOM.inputSearchTagihan) DOM.inputSearchTagihan.value = '';
      DOM.btnClearSearchTagihan.style.display = 'none';
      renderTagihanTab();
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

  // Queue Modal Back to Main Menu Button
  if (DOM.btnQueueBackMenu) {
    DOM.btnQueueBackMenu.addEventListener('click', () => {
      if (DOM.modalQueue) DOM.modalQueue.classList.remove('active');
      switchTab('tab-menu');
    });
  }

  let lastBackPressTime = 0;

  // Android & Hardware Back Button Navigation Handler
  window.addEventListener('popstate', (e) => {
    if (!state.isLoggedIn) return;

    // 1. Close active modals first if open
    if (DOM.modalMissingFinish && DOM.modalMissingFinish.classList.contains('active')) {
      closeMissingModal(false);
      return;
    }
    if (DOM.modalUserForm && DOM.modalUserForm.classList.contains('active')) {
      closeUserModal();
      try { history.pushState({ tab: state.activeTab }, '', '#' + state.activeTab); } catch (err) {}
      return;
    }
    if (DOM.modalConfirm && DOM.modalConfirm.classList.contains('active')) {
      closeSubmitConfirmModal();
      try { history.pushState({ tab: state.activeTab }, '', '#' + state.activeTab); } catch (err) {}
      return;
    }

    // 2. Intercept Back when at Main Menu (tab-menu)
    if (state.activeTab === 'tab-menu') {
      const now = Date.now();
      if (now - lastBackPressTime < 2000) {
        // Press twice within 2 seconds: Allow exit / back out
        return;
      }

      // First press back: push state back & show exit warning toast
      lastBackPressTime = now;
      try { history.pushState({ tab: 'tab-menu' }, '', '#tab-menu'); } catch (err) {}
      showToast('Tekan sekali lagi untuk keluar', 'warning');
      return;
    }

    // 3. Determine target tab: default to 'tab-menu' if e.state is missing or empty
    let targetTab = (e.state && e.state.tab) ? e.state.tab : 'tab-menu';

    // 4. Tab Navigation: check if leaving tab-scan with draft items
    if (state.activeTab === 'tab-scan' && state.draftList.length > 0 && targetTab !== 'tab-scan') {
      try { history.pushState({ tab: 'tab-scan' }, '', '#tab-scan'); } catch (err) {}
      state.modalAction = 'switchTabWarn';
      state.pendingTargetTabId = targetTab;

      DOM.modalConfirmTitle.innerHTML = `<i data-lucide="alert-triangle"></i> Konfirmasi Pindah Halaman`;
      DOM.modalConfirmMsg.textContent = 'No gudang yg sudah di input akan hilang. Lanjutkan?';
      DOM.modalConfirmOkText.textContent = 'Ya, Lanjutkan';
      DOM.modalConfirm.classList.add('active');
      lucide.createIcons();
      return;
    }

    switchTab(targetTab, false);
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
  } else if (currentAction === 'submitFinish') {
    await handleSubmitFinish();
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
  } else if (targetTabId === 'tab-pending' || targetTabId === 'tab-performa' || targetTabId === 'tab-notif' || targetTabId === 'tab-part-kembali' || targetTabId === 'tab-tagihan') {
    state.currentMode = 'teknisi';
  } else if (targetTabId === 'tab-pipo') {
    state.currentMode = 'pipo';
  } else if (targetTabId === 'tab-finish' || targetTabId === 'tab-finish-all') {
    state.currentMode = 'finish';
  }

  // 1. PSW Status Badge (PSW: ON/OFF)
  // Hide on PIPO, Finish, Teknisi portal, and Menu hub. Show ONLY on Scan mode or Profile.
  if (DOM.headerPswStatus) {
    DOM.headerPswStatus.classList.toggle('hidden', state.currentMode !== 'scan' && targetTabId !== 'tab-profile');
  }

  // 2. Header LIHAT DATA Button (#header-btn-missing)
  // Show ONLY on Form Input Finish page (tab-finish). Hide on all other pages.
  if (DOM.headerBtnMissing) {
    DOM.headerBtnMissing.classList.toggle('hidden', targetTabId !== 'tab-finish');
  }

  // 3. Header Bell Notification Button (#header-notif-btn)
  // Show ONLY when in teknisi mode (Pending / Performa / Notif), hide in scan mode & menu hub!
  if (DOM.headerNotifBtn) {
    DOM.headerNotifBtn.classList.toggle('hidden', state.currentMode !== 'teknisi');
  }

  // 4. On tab-menu (Menu Utama Hub), hide bottom navbar & sheet update bar completely!
  if (targetTabId === 'tab-menu') {
    if (DOM.appNav) DOM.appNav.classList.add('hidden');
    if (DOM.sheetUpdateBar) DOM.sheetUpdateBar.classList.add('hidden');
    return;
  }

  // 5. On sub-pages, show bottom navbar
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

  const activeSectionId = (targetTabId === 'tab-finish-all') ? 'tab-finish' : targetTabId;
  DOM.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === activeSectionId);
  });

  // Toggle Global Queue Modal visibility based on active tab (Show ONLY on Transfer Stok: tab-scan & tab-history)
  if (state.isGlobalQueueBlocking && (targetTabId === 'tab-scan' || targetTabId === 'tab-history')) {
    if (DOM.modalQueue) DOM.modalQueue.classList.add('active');
  } else {
    if (DOM.modalQueue) DOM.modalQueue.classList.remove('active');
  }

  if (targetTabId !== 'tab-finish-all') {
    if (DOM.finishAllFilterDate) DOM.finishAllFilterDate.value = '';
    if (DOM.finishAllFilterTech) DOM.finishAllFilterTech.value = '';
    if (DOM.btnClearFinishFilterDate) DOM.btnClearFinishFilterDate.style.display = 'none';
  }

  if (targetTabId === 'tab-pipo') {
    state.pipoSearchQuery = '';
    state.pipoLimit = 40;
    if (DOM.inputSearchPipo) DOM.inputSearchPipo.value = '';
    if (DOM.btnClearSearchPipo) DOM.btnClearSearchPipo.style.display = 'none';
    renderPipoTab();
  }
  if (targetTabId === 'tab-finish-all') {
    if (DOM.btnFinishPageAll) DOM.btnFinishPageAll.classList.add('active');
    if (DOM.btnFinishPageForm) DOM.btnFinishPageForm.classList.remove('active');
    if (DOM.finishPageAll) DOM.finishPageAll.style.display = 'flex';
    if (DOM.finishPageForm) DOM.finishPageForm.style.display = 'none';

    if (DOM.syncIconFinishAll) DOM.syncIconFinishAll.classList.add('spinning');
    fetchFinishSheetData().then(({ parsedAllRows }) => {
      renderFinishAllDataTab(parsedAllRows);
    }).catch(e => {}).finally(() => {
      if (DOM.syncIconFinishAll) DOM.syncIconFinishAll.classList.remove('spinning');
    });
  } else if (targetTabId === 'tab-finish') {
    prepareFinishForm();
    renderFinishHistory();

    if (DOM.btnFinishPageForm) DOM.btnFinishPageForm.classList.add('active');
    if (DOM.btnFinishPageAll) DOM.btnFinishPageAll.classList.remove('active');
    if (DOM.finishPageForm) DOM.finishPageForm.style.display = 'block';
    if (DOM.finishPageAll) DOM.finishPageAll.style.display = 'none';
  }

  renderSheetUpdateInfo();
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
    process_mode: state.transferProcessMode || 'STAFPART',
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

      // Fallback if unit_id, jenis, or process_mode column does not exist in Supabase schema yet
      if (error && error.message) {
        const hasMissingUnit = error.message.includes('unit_id');
        const hasMissingJenis = error.message.includes('jenis');
        const hasMissingProcessMode = error.message.includes('process_mode');

        if (hasMissingUnit || hasMissingJenis || hasMissingProcessMode) {
          console.warn('Column missing in Supabase schema, retrying fallback payload...', error.message);
          const fallbackPayloads = batchPayloads.map(p => {
            const payloadCopy = { ...p };
            if (hasMissingUnit) delete payloadCopy.unit_id;
            if (hasMissingJenis) delete payloadCopy.jenis;
            if (hasMissingProcessMode) delete payloadCopy.process_mode;
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

  state.isGlobalQueueBlocking = true;
  if (DOM.queueStatusText) DOM.queueStatusText.textContent = 'MENGANTRI / DIPROSES...';

  // Show modal ONLY IF user is currently on Transfer Stok menu (tab-scan or tab-history)
  if (state.activeTab === 'tab-scan' || state.activeTab === 'tab-history') {
    if (DOM.modalQueue) DOM.modalQueue.classList.add('active');
    lucide.createIcons();
  } else {
    if (DOM.modalQueue) DOM.modalQueue.classList.remove('active');
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
function showToast(message, type = 'info', duration = 600) {
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
    toast.style.transition = 'all 0.15s ease';
    setTimeout(() => toast.remove(), 150);
  }, duration);
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
const GOOGLE_SHEET_ID_PIPO = '1cFbwWRRxD6vj7XNFLzmxF_Mma9TP3qvsdMSEYIDg47M';

window.copyTextToClipboard = function(text, label = 'Kode Part') {
  if (!text || text === '-') return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 ${label} (${text}) berhasil disalin!`, 'success');
    }).catch(() => {
      fallbackCopyText(text, label);
    });
  } else {
    fallbackCopyText(text, label);
  }
};

function fallbackCopyText(text, label) {
  try {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast(`📋 ${label} (${text}) berhasil disalin!`, 'success');
  } catch (e) {
    showToast(`Gagal menyalin: ${text}`, 'error');
  }
}

async function fetchGVizSheetCustom(sheetId, sheetName) {
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
      script.src = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=responseHandler:${callbackName}&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
      script.onerror = function(err) {
        clearTimeout(timeout);
        if (window[callbackName]) delete window[callbackName];
        script.remove();
        reject(err);
      };
      document.body.appendChild(script);
    });
  } catch (jsonpErr) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
    const res = await fetch(url);
    const text = await res.text();
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    if (!jsonMatch) throw new Error(`Format respon Google Sheet ${sheetName} tidak valid`);
    const parsed = JSON.parse(jsonMatch[1]);
    return parsed.table;
  }
}

function loadPipoCache() {
  const cached = localStorage.getItem(STORAGE_KEYS.PIPO_CACHE);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.pipoData = parsed.map(item => {
          if (Array.isArray(item)) {
            return {
              typeOff: item[0] || '',
              partOff: item[1] || '',
              namaOff: item[2] || '',
              typeIn: item[3] || '',
              partIn: item[4] || '',
              namaIn: item[5] || '',
              teknisi: item[6] || '',
              hasilCek: item[7] || 'BISA MENGGANTIKAN'
            };
          }
          return item;
        });
        renderPipoTab();
      }
    } catch (e) {
      console.warn('Gagal parse cache PIPO:', e);
    }
  }
}

function savePipoCache() {
  if (!state.pipoData || state.pipoData.length === 0) return;

  try {
    // Compress objects into compact 2D tuple matrix (saves >75% LocalStorage quota space)
    const compactMatrix = state.pipoData.map(item => [
      item.typeOff || '',
      item.partOff || '',
      item.namaOff || '',
      item.typeIn || '',
      item.partIn || '',
      item.namaIn || '',
      item.teknisi || '',
      item.hasilCek || ''
    ]);

    localStorage.setItem(STORAGE_KEYS.PIPO_CACHE, JSON.stringify(compactMatrix));
  } catch (e) {
    console.warn('Quota LocalStorage penuh, membersihkan cache lama...', e);
    try {
      localStorage.removeItem('google_sheets_cache');
      const compactMatrix = state.pipoData.slice(0, 1000).map(item => [
        item.typeOff || '',
        item.partOff || '',
        item.namaOff || '',
        item.typeIn || '',
        item.partIn || '',
        item.namaIn || '',
        item.teknisi || '',
        item.hasilCek || ''
      ]);
      localStorage.setItem(STORAGE_KEYS.PIPO_CACHE, JSON.stringify(compactMatrix));
    } catch (err2) {
      // Silent fallback: app runs seamlessly using in-memory state
    }
  }
}

async function fetchPipoData() {
  if (state.isFetchingPipo) return;
  state.isFetchingPipo = true;

  try {
    const tablePipo = await fetchGVizSheetCustom(GOOGLE_SHEET_ID_PIPO, 'PIPO');
    const rows = extractMatrixFromGViz(tablePipo);

    const pipoItems = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 5) continue;

      const typeOff = row[0] || '';
      const partOff = row[1] || '';
      const namaOff = row[2] || '';
      const typeIn = row[3] || '';
      const partIn = row[4] || '';
      const namaIn = row[5] || '';
      const teknisi = row[6] || '';
      const hasilCek = row[7] || 'BISA MENGGANTIKAN';

      if (partOff || partIn) {
        pipoItems.push({
          typeOff,
          partOff,
          namaOff,
          typeIn,
          partIn,
          namaIn,
          teknisi,
          hasilCek
        });
      }
    }

    state.pipoData = pipoItems;
    savePipoCache();
    renderPipoTab();

  } catch (err) {
    console.warn('Gagal fetch data PIPO Sheet:', err);
    if (DOM.pipoListContainer) {
      // If cache exists, keep using cached data
      if (state.pipoData && state.pipoData.length > 0) {
        renderPipoTab();
      } else {
        DOM.pipoListContainer.innerHTML = `
          <div class="empty-state-sm text-danger">
            <i data-lucide="alert-circle"></i>
            <p>Gagal memuat data PIPO: ${escapeHtml(err.message)}</p>
          </div>`;
        lucide.createIcons();
      }
    }
  } finally {
    state.isFetchingPipo = false;
  }
}

function renderPipoTab() {
  if (!DOM.pipoListContainer) return;
  if (!DOM.pipoDefaultHeader) {
    DOM.pipoDefaultHeader = document.getElementById('pipo-default-header');
  }

  const list = state.pipoData || [];
  const searchQ = (state.pipoSearchQuery || '').trim().toUpperCase();

  // ==========================================================
  // MODE 1: TAMPILAN DATA DEFAULT (TANPA PENCARIAN)
  // Simpel perbaris: Kolom B (Kiri) ⇄ Kolom E (Kanan) - No Gudang SAJA
  // ==========================================================
  if (!searchQ) {
    if (DOM.pipoDefaultHeader) DOM.pipoDefaultHeader.style.display = 'grid';

    if (DOM.pipoCount) {
      DOM.pipoCount.textContent = `${list.length} Data`;
    }

    if (list.length === 0) {
      DOM.pipoListContainer.innerHTML = `
        <div class="empty-state-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted);margin-bottom:6px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <p>Belum ada data part pengganti.</p>
        </div>`;
      return;
    }

    const maxLimit = state.pipoLimit || 50;
    const visibleList = list.slice(0, maxLimit);

    let html = visibleList.map((item) => {
      const b = (item.partOff || '-').trim();
      const e = (item.partIn || '-').trim();
      const targetQuery = b !== '-' ? b : e;
      return `
        <div class="pipo-simple-row" onclick="fillPipoSearch('${escapeHtml(targetQuery)}')">
          <div class="pipo-col-left">${escapeHtml(b)}</div>
          <div class="pipo-col-mid"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--warning);"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
          <div class="pipo-col-right">${escapeHtml(e)}</div>
        </div>
      `;
    }).join('');

    if (list.length > maxLimit) {
      html += `
        <div class="my-3" style="padding: 6px 0 16px 0;">
          <button type="button" class="btn-load-more-pipo" onclick="window.loadMorePipoItems()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            Tampilkan Lebih Banyak (${visibleList.length} dari ${list.length} Data)
          </button>
        </div>`;
    }

    DOM.pipoListContainer.innerHTML = html;
    return;
  }

  // ==========================================================
  // MODE 2: TAMPILAN HASIL PENCARIAN (DETAIL KATA KUNCI)
  // Sederhana tapi detail: No Gudang, Deskripsi, Type (A/D)
  // ==========================================================
  if (DOM.pipoDefaultHeader) DOM.pipoDefaultHeader.style.display = 'none';

  const uniqueReplacementsMap = new Map();

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const partOff = (item.partOff || '').trim();
    const partOffUpper = partOff.toUpperCase();
    const namaOff = item.namaOff || '';
    const typeOff = item.typeOff || '';

    const partIn = (item.partIn || '').trim();
    const partInUpper = partIn.toUpperCase();
    const namaIn = item.namaIn || '';
    const typeIn = item.typeIn || '';

    if (!partOff && !partIn) continue;

    const matchOff = partOffUpper.includes(searchQ) || (namaOff && namaOff.toUpperCase().includes(searchQ)) || (typeOff && typeOff.toUpperCase().includes(searchQ));
    const matchIn = partInUpper.includes(searchQ) || (namaIn && namaIn.toUpperCase().includes(searchQ)) || (typeIn && typeIn.toUpperCase().includes(searchQ));

    // Direction A: Searched part matches PLUG OFF -> Replacement is PLUG IN
    if (matchOff && partIn) {
      if (!uniqueReplacementsMap.has(partInUpper)) {
        uniqueReplacementsMap.set(partInUpper, {
          partNo: partIn,
          namaPart: namaIn,
          type: typeIn || typeOff
        });
      }
    }

    // Direction B: Searched part matches PLUG IN -> Replacement is PLUG OFF
    if (matchIn && partOff) {
      if (!uniqueReplacementsMap.has(partOffUpper)) {
        uniqueReplacementsMap.set(partOffUpper, {
          partNo: partOff,
          namaPart: namaOff,
          type: typeOff
        });
      }
    }
  }

  const replacementsArray = Array.from(uniqueReplacementsMap.values());

  if (DOM.pipoCount) {
    DOM.pipoCount.textContent = `${replacementsArray.length} Data`;
  }

  if (replacementsArray.length === 0) {
    DOM.pipoListContainer.innerHTML = `
      <div class="empty-state-sm">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted);margin-bottom:6px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        <p>Part pengganti tidak ditemukan untuk "${escapeHtml(state.pipoSearchQuery)}".</p>
      </div>`;
    return;
  }

  const maxLimit = state.pipoLimit || 60;
  const visibleReplacements = replacementsArray.slice(0, maxLimit);

  let html = visibleReplacements.map(rep => `
    <div class="pipo-card">
      <div class="pipo-sub-part-no">${escapeHtml(rep.partNo || '-')}</div>
      ${rep.namaPart ? `<div class="pipo-sub-part-desc">${escapeHtml(rep.namaPart)}</div>` : ''}
      ${rep.type ? `<div class="pipo-sub-type-badge">Type: ${escapeHtml(rep.type)}</div>` : ''}
    </div>
  `).join('');

  if (replacementsArray.length > maxLimit) {
    html += `
      <div class="my-3" style="padding: 6px 0 16px 0;">
        <button type="button" class="btn-load-more-pipo" onclick="window.loadMorePipoItems()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          Tampilkan Lebih Banyak (${visibleReplacements.length} dari ${replacementsArray.length} Part)
        </button>
      </div>`;
  }

  DOM.pipoListContainer.innerHTML = html;
}

// ==========================================================
// MODULE INPUT FINISH HARIAN TEKNISI (GOOGLE FORM REPLACEMENT)
// ==========================================================
const GOOGLE_FORM_FINISH_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfHo-PIyYWBsEcfUfkpA8vc7AyeuAMNRot4wuU5T3xSNfcYnA/formResponse';

const VALID_FORM_TECHNICIANS = [
  'Amin Prayogo',
  'Redi Takwa',
  'Zulfi Fajriansyah',
  'Mursyid Alfiansyah',
  'M.Ilman',
  'SID Kenu ngudi Raharjo',
  'Irfan Taufan',
  'Roni Surya Nugraha'
];

function prepareFinishForm() {
  if (DOM.finishTgl && !DOM.finishTgl.value) {
    const today = new Date().toISOString().split('T')[0];
    DOM.finishTgl.value = today;
  }

  // Clear numeric inputs so they are empty by default (no 0)
  if (DOM.finishCaseOutdoor) DOM.finishCaseOutdoor.value = '';
  if (DOM.finishFinishOutdoor) DOM.finishFinishOutdoor.value = '';
  if (DOM.finishFinishIndoor) DOM.finishFinishIndoor.value = '';
  if (DOM.finishWipComp) DOM.finishWipComp.value = '';
  if (DOM.finishWipTech) DOM.finishWipTech.value = '';
  if (DOM.finishBatal) DOM.finishBatal.value = '';
  if (DOM.finishAntar) DOM.finishAntar.value = '';
  if (DOM.finishNoVisit) DOM.finishNoVisit.value = '';
  if (DOM.finishKet) DOM.finishKet.value = '';

  if (DOM.finishNama) {
    const rawList = [...VALID_FORM_TECHNICIANS];
    if (state.adminUsers && state.adminUsers.length > 0) {
      state.adminUsers.forEach(u => {
        if (u.nama && u.nama.trim()) rawList.push(u.nama.trim());
      });
    }

    // Deduplicate case-insensitively
    const seen = new Set();
    const choices = [];
    rawList.forEach(name => {
      const normalized = name.trim().toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        choices.push(name.trim());
      }
    });

    const currentSelected = DOM.finishNama.value;
    DOM.finishNama.innerHTML = choices.map(t =>
      `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`
    ).join('');

    const loggedInName = state.profile ? state.profile.nama : (state.user ? state.user.nama : '');

    if (state.isAdmin) {
      DOM.finishNama.disabled = false;
      if (currentSelected && choices.includes(currentSelected)) {
        DOM.finishNama.value = currentSelected;
      }
    } else {
      DOM.finishNama.disabled = true;
      let match = choices.find(
        t => t.toLowerCase().trim() === loggedInName.toLowerCase().trim()
      );
      if (!match) {
        match = choices.find(
          t => t.toLowerCase().includes(loggedInName.toLowerCase().trim()) || loggedInName.toLowerCase().includes(t.toLowerCase().trim())
        );
      }
      if (match) {
        DOM.finishNama.value = match;
      } else if (loggedInName) {
        const normLoggedIn = loggedInName.trim().toLowerCase();
        if (!seen.has(normLoggedIn)) {
          const opt = document.createElement('option');
          opt.value = loggedInName.trim();
          opt.textContent = loggedInName.trim();
          DOM.finishNama.appendChild(opt);
        }
        DOM.finishNama.value = loggedInName.trim();
      }
    }
  }
}

function openFinishConfirmModal() {
  const tglVal = DOM.finishTgl ? DOM.finishTgl.value : '';
  if (!tglVal) {
    showToast('⚠️ Mohon pilih tanggal laporan!', 'warning');
    if (DOM.finishTgl) DOM.finishTgl.focus();
    return;
  }

  state.modalAction = 'submitFinish';
  DOM.modalConfirmTitle.innerHTML = `<i data-lucide="clipboard-check"></i> Konfirmasi Kirim Finish Harian`;
  DOM.modalConfirmMsg.textContent = 'Apakah data yang Anda masukkan sudah benar?';
  DOM.modalConfirmOkText.textContent = 'Ya, Kirim Laporan';
  DOM.modalConfirm.classList.add('active');
  lucide.createIcons();
}

const INDONESIAN_HOLIDAYS_2026 = [
  '2026-01-01', '2026-01-16', '2026-02-17', '2026-03-19', '2026-03-20',
  '2026-03-21', '2026-04-03', '2026-04-05', '2026-05-01', '2026-05-14',
  '2026-05-27', '2026-05-31', '2026-06-01', '2026-06-16', '2026-08-17',
  '2026-08-25', '2026-12-25'
];

function isNationalHolidayOrSunday(d) {
  if (d.getDay() === 0) return true; // Sunday
  const isoStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return INDONESIAN_HOLIDAYS_2026.includes(isoStr);
}

function formatDateIndoFull(d) {
  const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${DAYS_ID[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

function normalizeDateString(str) {
  if (!str) return '';
  str = String(str).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const dmyMatch = str.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }
  const ymdMatch = str.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return str;
}

async function fetchFinishSheetData() {
  const filledDatesSet = new Set();
  const parsedAllRows = [];
  const targetTechName = DOM.finishNama ? DOM.finishNama.value : (state.profile ? state.profile.nama : '');

  const FINISH_SPREADSHEET_ID = '1cFbwWRRxD6vj7XNFLzmxF_Mma9TP3qvsdMSEYIDg47M';

  let rows = [];
  try {
    const table = await fetchGVizSheetCustom(FINISH_SPREADSHEET_ID, 'Form Responses 1');
    rows = extractMatrixFromGViz(table);
  } catch (e1) {
    try {
      const table = await fetchGVizSheetCustom(FINISH_SPREADSHEET_ID, 'Form Responses');
      rows = extractMatrixFromGViz(table);
    } catch (e2) {
      console.warn('Gagal fetch sheet finish response:', e2);
    }
  }

  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (rows && rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 4) continue;

      const rowNama = String(row[2] || '').trim();
      const rowTglRaw = String(row[3] || '').trim();

      if (rowNama && rowTglRaw) {
        const normTgl = normalizeDateString(rowTglRaw);
        if (normTgl && /^\d{4}-\d{2}-\d{2}$/.test(normTgl)) {
          // Check if record belongs to current month & year
          if (normTgl.startsWith(currentYearMonth)) {
            const entryObj = {
              id: row[0] || i,
              timestampCreated: String(row[1] || '').trim(),
              nama: rowNama,
              tglLaporan: normTgl,
              tglRaw: rowTglRaw,
              caseOutdoor: parseInt(row[4] || 0, 10) || 0,
              finishOutdoor: parseInt(row[5] || 0, 10) || 0,
              finishIndoor: parseInt(row[6] || 0, 10) || 0,
              wipComp: parseInt(row[7] || 0, 10) || 0,
              wipTech: parseInt(row[8] || 0, 10) || 0,
              batal: parseInt(row[9] || 0, 10) || 0,
              antar: parseInt(row[10] || 0, 10) || 0,
              noVisit: parseInt(row[11] || 0, 10) || 0,
              ket: String(row[12] || '').trim(),
              bulan: String(row[13] || '').trim()
            };

            // Filter according to user role / logged in user
            if (state.isAdmin || matchTechName(rowNama, targetTechName, state.profile ? state.profile.nik : '')) {
              parsedAllRows.push(entryObj);
            }

            if (targetTechName && isSameTechnicianName(rowNama, targetTechName)) {
              filledDatesSet.add(normTgl);
            }
          }
        }
      }
    }
  }

  // Sort parsedAllRows by tglLaporan descending
  parsedAllRows.sort((a, b) => b.tglLaporan.localeCompare(a.tglLaporan));
  state.finishParsedAllRows = parsedAllRows;

  return { filledDatesSet, parsedAllRows };
}

function renderFinishAllDataTab(parsedRows = null) {
  if (!DOM.finishPageAll) return;
  const rows = parsedRows || state.finishParsedAllRows || [];

  const dateFilter = DOM.finishAllFilterDate ? DOM.finishAllFilterDate.value : '';
  const techFilter = DOM.finishAllFilterTech ? DOM.finishAllFilterTech.value.trim().toUpperCase() : '';

  if (DOM.finishAllTechFilterWrapper) {
    DOM.finishAllTechFilterWrapper.style.display = state.isAdmin ? 'flex' : 'none';
  }

  if (DOM.btnClearFinishFilterDate) {
    DOM.btnClearFinishFilterDate.style.display = (dateFilter || techFilter) ? 'inline-flex' : 'none';
  }

  // Filter rows
  const filtered = rows.filter(item => {
    if (dateFilter && item.tglLaporan !== dateFilter) return false;
    if (techFilter && !item.nama.toUpperCase().includes(techFilter)) return false;
    return true;
  });

  let totalOutdoorFinish = 0;
  let totalIndoorFinish = 0;
  let totalWipComp = 0;
  let totalWipTech = 0;
  let totalBatal = 0;

  filtered.forEach(r => {
    totalOutdoorFinish += r.finishOutdoor;
    totalIndoorFinish += r.finishIndoor;
    totalWipComp += r.wipComp;
    totalWipTech += r.wipTech;
    totalBatal += r.batal;
  });

  const now = new Date();
  const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthLabel = `${MONTHS_ID[now.getMonth()]} ${now.getFullYear()}`;

  if (DOM.finishAllSummary) {
    DOM.finishAllSummary.innerHTML = `
      <div style="background:var(--card-bg-light); border-left:3px solid var(--primary); padding:8px 10px; border-radius:6px; margin-bottom:8px;">
        <div class="flex-between align-center">
          <strong style="color:var(--text-color); font-size:12px;">📊 Total Laporan Bulan Ini (${monthLabel})</strong>
          <span class="badge" style="background:var(--primary-light); color:var(--primary); font-size:11px; font-weight:700;">${filtered.length} Entry</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:4px; margin-top:6px; text-align:center; font-size:10px;">
          <div style="background:var(--bg-input); padding:4px; border-radius:4px;"><span style="color:var(--text-muted); font-size:9px;">OUTDOOR</span><br/><strong style="color:var(--success);">${totalOutdoorFinish}</strong></div>
          <div style="background:var(--bg-input); padding:4px; border-radius:4px;"><span style="color:var(--text-muted); font-size:9px;">INDOOR</span><br/><strong style="color:var(--primary);">${totalIndoorFinish}</strong></div>
          <div style="background:var(--bg-input); padding:4px; border-radius:4px;"><span style="color:var(--text-muted); font-size:9px;">WIP COMP</span><br/><strong style="color:var(--warning);">${totalWipComp}</strong></div>
          <div style="background:var(--bg-input); padding:4px; border-radius:4px;"><span style="color:var(--text-muted); font-size:9px;">WIP TECH</span><br/><strong style="color:var(--secondary);">${totalWipTech}</strong></div>
          <div style="background:var(--bg-input); padding:4px; border-radius:4px;"><span style="color:var(--text-muted); font-size:9px;">BATAL</span><br/><strong style="color:var(--danger);">${totalBatal}</strong></div>
        </div>
      </div>`;
  }

  if (DOM.finishAllList) {
    if (filtered.length === 0) {
      DOM.finishAllList.innerHTML = `
        <div style="text-align:center; padding:20px 10px; color:var(--text-muted);">
          <i data-lucide="inbox" style="width:36px; height:36px; margin-bottom:6px;"></i>
          <p style="font-weight:700; font-size:12px; margin:0;">Tidak Ada Data Laporan</p>
          <span style="font-size:10.5px;">${dateFilter ? `Tidak ada laporan pada tanggal ${dateFilter}` : 'Belum ada laporan terdaftar untuk bulan ini.'}</span>
        </div>`;
    } else {
      DOM.finishAllList.innerHTML = filtered.map(item => {
        const parts = item.tglLaporan.split('-');
        const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const formattedDate = formatDateIndoFull(dateObj);

        return `
          <div class="finish-data-card">
            <div class="finish-data-header">
              <div class="finish-data-tgl">
                <i data-lucide="calendar" style="width:14px; height:14px; color:var(--primary);"></i>
                ${escapeHtml(formattedDate)}
              </div>
              <span class="finish-data-tech">${escapeHtml(item.nama)}</span>
            </div>
            <div class="finish-stats-grid">
              <div class="finish-stat-box"><label>Outdoor (Fin/Tgs)</label><strong>${item.finishOutdoor} / ${item.caseOutdoor}</strong></div>
              <div class="finish-stat-box"><label>Indoor Finish</label><strong style="color:var(--primary);">${item.finishIndoor}</strong></div>
              <div class="finish-stat-box"><label>WIP COMP</label><strong style="color:var(--warning);">${item.wipComp}</strong></div>
              <div class="finish-stat-box"><label>WIP TECH</label><strong style="color:var(--secondary);">${item.wipTech}</strong></div>
              <div class="finish-stat-box"><label>Batal</label><strong style="color:var(--danger);">${item.batal}</strong></div>
              <div class="finish-stat-box"><label>Antar / No Visit</label><strong>${item.antar} / ${item.noVisit}</strong></div>
            </div>
            ${item.ket ? `<div style="margin-top:6px; font-size:10.5px; color:var(--text-muted); background:var(--bg-input); padding:4px 8px; border-radius:4px;"><i data-lucide="message-square" style="width:11px; height:11px; vertical-align:middle; margin-right:3px;"></i>${escapeHtml(item.ket)}</div>` : ''}
            ${item.timestampCreated ? `<div style="margin-top:4px; font-size:9.5px; color:var(--text-muted); text-align:right;">Input: ${escapeHtml(item.timestampCreated)}</div>` : ''}
          </div>`;
      }).join('');
    }
  }

  lucide.createIcons();
}

async function openMissingModal(isAutoRefresh = false) {
  if (!DOM.modalMissingFinish) return;

  // Automatically set active page to Form Input Finish
  switchTab('tab-finish');
  if (DOM.finishPageForm) DOM.finishPageForm.style.display = 'block';
  if (DOM.finishPageAll) DOM.finishPageAll.style.display = 'none';

  DOM.modalMissingFinish.classList.add('active');

  if (!isAutoRefresh) {
    try {
      history.pushState({ modal: 'missing_finish', tab: state.activeTab }, '', '#lihat-data');
    } catch (e) {}
  }

  if (DOM.syncIconMissing) DOM.syncIconMissing.classList.add('spinning');

  if (!isAutoRefresh && DOM.missingFinishSummary) {
    DOM.missingFinishSummary.innerHTML = `
      <div style="text-align:center; padding:14px; color:var(--text-muted);">
        <i data-lucide="loader-2" class="spin-lg"></i>
        <p style="margin-top:6px; font-size:12px; font-weight:600;">Memuat data terbaru dari Google Sheet...</p>
      </div>`;
    lucide.createIcons();
  }

  try {
    const { filledDatesSet, parsedAllRows } = await fetchFinishSheetData();
    renderMissingDatesList(filledDatesSet);
    renderFinishAllDataTab(parsedAllRows);
  } catch (err) {
    console.warn('Error openMissingModal:', err);
  } finally {
    if (DOM.syncIconMissing) DOM.syncIconMissing.classList.remove('spinning');
  }

  startMissingAutoRefresh();
}

function startMissingAutoRefresh() {
  stopMissingAutoRefresh();
  state.missingModalTimer = setInterval(() => {
    if (DOM.modalMissingFinish && DOM.modalMissingFinish.classList.contains('active')) {
      openMissingModal(true);
    } else {
      stopMissingAutoRefresh();
    }
  }, 10000); // Auto refresh every 10 seconds
}

function stopMissingAutoRefresh() {
  if (state.missingModalTimer) {
    clearInterval(state.missingModalTimer);
    state.missingModalTimer = null;
  }
}

function renderMissingDatesList(filledDatesSet) {
  const targetTechName = DOM.finishNama ? DOM.finishNama.value : (state.profile ? state.profile.nama : '');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();

  const missingDates = [];
  let totalWorkingDays = 0;
  let filledCount = 0;

  for (let day = 1; day <= todayDate; day++) {
    const d = new Date(year, month, day);
    if (!isNationalHolidayOrSunday(d)) {
      totalWorkingDays++;
      const isoStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (filledDatesSet.has(isoStr)) {
        filledCount++;
      } else {
        missingDates.push({ dateStr: isoStr, dateObj: d });
      }
    }
  }

  const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthLabel = `${MONTHS_ID[month]} ${year}`;

  if (DOM.missingFinishSummary) {
    DOM.missingFinishSummary.innerHTML = `
      <div style="background:var(--card-bg-light); border-left:3px solid var(--primary); padding:8px 10px; border-radius:6px; margin-bottom:8px;">
        <strong style="color:var(--text-color);">${escapeHtml(targetTechName || 'Teknisi')}</strong> &bull; Periode: <strong>${monthLabel}</strong> (s/d Hari Ini)<br/>
        <span>Total Hari Kerja: <strong>${totalWorkingDays} hari</strong> | Terisi: <strong style="color:var(--success);">${filledCount}</strong> | Belum Isi: <strong style="color:var(--danger);">${missingDates.length}</strong></span>
      </div>`;
  }

  if (DOM.missingFinishList) {
    if (missingDates.length === 0) {
      DOM.missingFinishList.innerHTML = `
        <div style="text-align:center; padding:20px 10px; color:var(--success);">
          <i data-lucide="check-circle-2" style="width:40px; height:40px; margin-bottom:6px;"></i>
          <p style="font-weight:700; font-size:13px; margin:0;">Luar Biasa! Semua Laporan Terisi</p>
          <span style="font-size:11px; color:var(--text-muted);">Tidak ada tanggal kerja yang terlewat bulan ini.</span>
        </div>`;
    } else {
      DOM.missingFinishList.innerHTML = missingDates.map(item => `
        <div class="missing-date-card flex-between align-center" onclick="selectMissingDate('${item.dateStr}')" style="background:var(--card-bg-light); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color); cursor:pointer; transition:all 0.2s ease;">
          <div>
            <div style="font-weight:700; font-size:13px; color:var(--text-color);">${escapeHtml(formatDateIndoFull(item.dateObj))}</div>
            <div style="font-size:10.5px; color:var(--danger); margin-top:1px;"><i data-lucide="alert-circle" style="width:11px; height:11px; vertical-align:middle; margin-right:2px;"></i>Belum ada laporan finish harian</div>
          </div>
          <button type="button" class="btn btn-primary btn-xs" style="font-weight:600; padding:4px 8px; font-size:11px;">
            Pilih Tanggal <i data-lucide="arrow-right" style="width:12px; height:12px;"></i>
          </button>
        </div>
      `).join('');
    }
  }

  lucide.createIcons();
}

function closeMissingModal(triggerHistoryBack = true) {
  stopMissingAutoRefresh();
  if (DOM.modalMissingFinish) {
    const wasActive = DOM.modalMissingFinish.classList.contains('active');
    DOM.modalMissingFinish.classList.remove('active');
    if (wasActive && triggerHistoryBack && history.state && history.state.modal === 'missing_finish') {
      try { history.back(); } catch (e) {}
    }
  }
}

window.selectMissingDate = function(dateStr) {
  if (DOM.finishTgl) {
    DOM.finishTgl.value = dateStr;
  }
  closeMissingModal();

  switchTab('tab-finish');
  if (DOM.finishPageForm) DOM.finishPageForm.style.display = 'block';
  if (DOM.finishPageAll) DOM.finishPageAll.style.display = 'none';

  showToast(`📅 Tanggal ${dateStr} dipilih untuk diisi!`, 'info');
};

async function handleSubmitFinish() {
  const namaTeknisi = DOM.finishNama ? DOM.finishNama.value.trim() : (state.user ? state.user.nama : (state.loggedInUser || ''));
  const tglVal = DOM.finishTgl ? DOM.finishTgl.value : '';
  const caseOutdoor = (DOM.finishCaseOutdoor && DOM.finishCaseOutdoor.value.trim() !== '') ? DOM.finishCaseOutdoor.value.trim() : '0';
  const finishOutdoor = (DOM.finishFinishOutdoor && DOM.finishFinishOutdoor.value.trim() !== '') ? DOM.finishFinishOutdoor.value.trim() : '0';
  const finishIndoor = (DOM.finishFinishIndoor && DOM.finishFinishIndoor.value.trim() !== '') ? DOM.finishFinishIndoor.value.trim() : '0';
  const wipComp = (DOM.finishWipComp && DOM.finishWipComp.value.trim() !== '') ? DOM.finishWipComp.value.trim() : '0';
  const wipTech = (DOM.finishWipTech && DOM.finishWipTech.value.trim() !== '') ? DOM.finishWipTech.value.trim() : '0';
  const caseBatal = (DOM.finishBatal && DOM.finishBatal.value.trim() !== '') ? DOM.finishBatal.value.trim() : '0';
  const pengembalian = (DOM.finishAntar && DOM.finishAntar.value.trim() !== '') ? DOM.finishAntar.value.trim() : '0';
  const noVisit = (DOM.finishNoVisit && DOM.finishNoVisit.value.trim() !== '') ? DOM.finishNoVisit.value.trim() : '0';
  const ket = (DOM.finishKet && DOM.finishKet.value.trim() !== '') ? DOM.finishKet.value.trim() : '-';

  if (!tglVal) {
    showToast('⚠️ Mohon pilih tanggal laporan!', 'warning');
    if (DOM.finishTgl) DOM.finishTgl.focus();
    return;
  }

  // Match technician name to Google Form dropdown option
  let matchedNama = VALID_FORM_TECHNICIANS.find(
    t => t.toLowerCase().trim() === namaTeknisi.toLowerCase().trim()
  );
  if (!matchedNama) {
    matchedNama = VALID_FORM_TECHNICIANS.find(
      t => t.toLowerCase().includes(namaTeknisi.toLowerCase().trim()) || namaTeknisi.toLowerCase().includes(t.toLowerCase().trim())
    ) || namaTeknisi;
  }

  // Send directly to Google Form endpoint
  const formData = new URLSearchParams();
  formData.append('entry.969834049', matchedNama);

  if (tglVal) {
    const parts = tglVal.split('-');
    if (parts.length === 3) {
      formData.append('entry.768881015_year', parts[0]);
      formData.append('entry.768881015_month', parts[1]);
      formData.append('entry.768881015_day', parts[2]);
    }
    formData.append('entry.768881015', tglVal);
  }

  formData.append('entry.70099420', caseOutdoor);
  formData.append('entry.700809225', finishOutdoor);
  formData.append('entry.1959698707', finishIndoor);
  formData.append('entry.1347707686', wipComp);
  formData.append('entry.696681271', wipTech);
  formData.append('entry.1529107143', caseBatal);
  formData.append('entry.1877397193', pengembalian);
  formData.append('entry.700484031', noVisit);
  formData.append('entry.2130929922', ket);

  try {
    fetch(GOOGLE_FORM_FINISH_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    }).catch(err => console.warn('Google Form submit error:', err));
  } catch (err) {
    console.warn('Submit error:', err);
  }

  prepareFinishForm();

  showToast('✅ Finish Harian berhasil dikirim ke Sheet!', 'success');
  playBeepSound();
}

function renderFinishHistory() {
  if (!DOM.finishHistoryList) return;
  const list = state.finishHistory || [];

  if (list.length === 0) {
    DOM.finishHistoryList.innerHTML = `
      <div class="empty-state-sm">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted);margin-bottom:6px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line></svg>
        <p>Belum ada riwayat finish harian yang di-submit.</p>
      </div>`;
    return;
  }

  DOM.finishHistoryList.innerHTML = list.map(item => `
    <div class="finish-history-card">
      <div class="flex-between align-center mb-1">
        <span style="font-size:11px; font-weight:600; color:var(--primary);">${escapeHtml(item.nama)}</span>
        <span style="font-size:10px; color:var(--text-muted);">${escapeHtml(item.timestamp)}</span>
      </div>
      <div style="font-weight:700; font-size:13px; color:var(--text-color);">Tanggal: ${escapeHtml(item.tgl)}</div>
      <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
        Finish In: ${escapeHtml(item.finishIndoor)} | Finish Out: ${escapeHtml(item.finishOutdoor)} | WIP Comp: ${escapeHtml(item.wipComp)} | Batal: ${escapeHtml(item.batal)}
      </div>
      ${item.ket ? `<div style="font-size:11px; color:var(--text-muted); font-style:italic; margin-top:2px;">Ket: ${escapeHtml(item.ket)}</div>` : ''}
    </div>
  `).join('');
}

window.loadMorePipoItems = function() {
  const currentLimit = state.pipoLimit || 50;
  state.pipoLimit = currentLimit + 50;
  renderPipoTab();
};

window.fillPipoSearch = function(partNo) {
  if (!DOM.pipoSearchInput) return;
  DOM.pipoSearchInput.value = partNo;
  state.pipoSearchQuery = partNo;
  if (DOM.pipoSearchClear) DOM.pipoSearchClear.style.display = 'block';
  renderPipoTab();
};

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

function isSameTechnicianName(sheetNama, targetNama) {
  if (!sheetNama || !targetNama) return false;
  const sUpper = String(sheetNama).trim().toUpperCase();
  const tUpper = String(targetNama).trim().toUpperCase();
  if (!sUpper || !tUpper) return false;
  if (sUpper === 'ADMIN' || tUpper === 'ADMIN') return false;
  if (sUpper === tUpper) return true;
  if (sUpper.includes(tUpper) || tUpper.includes(sUpper)) return true;
  const sWords = cleanNameString(sheetNama).split(' ').filter(w => w.length >= 2);
  const tWords = cleanNameString(targetNama).split(' ').filter(w => w.length >= 2);
  for (let tw of tWords) {
    for (let sw of sWords) {
      if (sw === tw) return true;
    }
  }
  return false;
}

function matchTechName(sheetName, userName, userNik = '') {
  const uUpper = (userName || '').toUpperCase().trim();
  const nUpper = (userNik || '').toUpperCase().trim();

  // If filter is empty ("") or user is admin (and not filtering for a specific technician name)
  if (!uUpper && !nUpper) return true;
  if (uUpper === 'ADMIN' || nUpper === 'ADMIN') return true;
  if (state.isAdmin && (uUpper === (state.profile.nama || '').toUpperCase().trim() || uUpper === (state.profile.nik || '').toUpperCase().trim())) return true;

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

async function fetchGVizSheet(sheetName, range = 'A1:Z1000', noHeaders = false) {
  // Use JSONP dynamic script injection to bypass CORS policy restrictions completely
  return new Promise((resolve, reject) => {
    const callbackName = 'gviz_cb_' + Math.floor(Math.random() * 1000000);

    const cleanup = () => {
      // Retain a dummy function so late responses do not throw Uncaught ReferenceError
      window[callbackName] = function() {};
      const el = document.getElementById(callbackName);
      if (el) el.remove();
      // Safely delete window[callbackName] after a 60-second grace period
      setTimeout(() => {
        try { delete window[callbackName]; } catch (e) {}
      }, 60000);
    };

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timeout fetching sheet ${sheetName}`));
    }, 25000);

    window[callbackName] = function(response) {
      clearTimeout(timeout);
      cleanup();
      if (response && response.table) {
        resolve(response.table);
      } else {
        reject(new Error(`Response table invalid for sheet ${sheetName}`));
      }
    };

    const script = document.createElement('script');
    script.id = callbackName;
    const headersParam = noHeaders ? '&headers=0' : '';
    script.src = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=responseHandler:${callbackName}&sheet=${encodeURIComponent(sheetName)}&range=${encodeURIComponent(range)}${headersParam}&t=${Date.now()}`;
    script.onerror = function(err) {
      clearTimeout(timeout);
      cleanup();
      reject(new Error(`Script load error for sheet ${sheetName}`));
    };
    document.body.appendChild(script);
  });
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
    const [tableData, tableAcAl, tableNotif] = await Promise.all([
      fetchGVizSheet('DATA', 'A1:Z1000'),
      fetchGVizSheet('DATA', 'AC1:AL1000', true),
      fetchGVizSheet('NOTIF', 'A1:J1000')
    ]);

    const rowsData = extractMatrixFromGViz(tableData);
    const rowsAcAl = extractMatrixFromGViz(tableAcAl);
    const rowsNotif = extractMatrixFromGViz(tableNotif);

    const techName = state.profile.nama || '';
    const techNik = state.profile.nik || '';

    // 1. Timestamps
    // 1a. Pending Timestamp (Cell Z2 / AG2 in sheet DATA)
    let pendingTimestamp = '';
    if (rowsAcAl && rowsAcAl.length >= 2 && rowsAcAl[1].length > 4) {
      const val = (rowsAcAl[1][4] || '').trim();
      if (val && val.length > 2 && !val.toUpperCase().startsWith('PART') && !val.toUpperCase().startsWith('NO')) {
        pendingTimestamp = val;
      }
    }
    if ((!pendingTimestamp || pendingTimestamp.length < 3) && rowsData && rowsData.length >= 2) {
      if (rowsData[1].length > 25 && rowsData[1][25]) {
        pendingTimestamp = (rowsData[1][25] || '').trim();
      }
    }
    if (!pendingTimestamp || pendingTimestamp.length < 3) {
      if (tableData && tableData.rows) {
        for (let r = 0; r < tableData.rows.length; r++) {
          const row = tableData.rows[r];
          if (row && row.c) {
            for (let c = 0; c < row.c.length; c++) {
              if (row.c[c]) {
                const val = (row.c[c].v || row.c[c].f || '').toString().trim();
                if (val && val.toUpperCase().startsWith('UPDATE DATA')) {
                  pendingTimestamp = val;
                  break;
                }
              }
            }
            if (pendingTimestamp) break;
          }
        }
      }
    }
    if (!pendingTimestamp || pendingTimestamp.length < 3) pendingTimestamp = 'Memuat data....';

    // 1b. Performa Timestamp (Cell AG3 -> row index 2, col index 4 of AC1:AL1000)
    let performaTimestamp = '';
    if (rowsAcAl && rowsAcAl.length >= 3 && rowsAcAl[2].length > 4) {
      performaTimestamp = (rowsAcAl[2][4] || '').trim();
    }
    if (!performaTimestamp || performaTimestamp.length < 3) performaTimestamp = pendingTimestamp;

    // 1c. Part Bekas Belum Kembali Timestamp (Cell AG5 -> row index 4, col index 4 of AC1:AL1000)
    let partKembaliTimestamp = '';
    if (rowsAcAl && rowsAcAl.length >= 5 && rowsAcAl[4].length > 4) {
      partKembaliTimestamp = (rowsAcAl[4][4] || '').trim();
    }
    if (!partKembaliTimestamp || partKembaliTimestamp.length < 3) partKembaliTimestamp = pendingTimestamp;

    // 1d. Tagihan Timestamp (Cell AG6 -> row index 5, col index 4 of AC1:AL1000)
    let tagihanTimestamp = '';
    if (rowsAcAl && rowsAcAl.length >= 6 && rowsAcAl[5].length > 4) {
      tagihanTimestamp = (rowsAcAl[5][4] || '').trim();
    }
    if (!tagihanTimestamp || tagihanTimestamp.length < 3) tagihanTimestamp = pendingTimestamp;

    // 2. Pending Cases (Cols A-J, indices 0-9, Row 1+)
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
    const insentifRows = [];
    for (let r = 0; r < rowsData.length; r++) {
      const row = rowsData[r];
      if (!row || row.length === 0) continue;
      const rowNama = row[10] || '';
      if (rowNama && matchTechName(rowNama, techName, techNik)) {
        const rawColV = (row[21] !== undefined && row[21] !== null) ? String(row[21]).trim() : '';
        const insentifVal = (rawColV === '' || rawColV === '-' || rawColV === '0') ? 'Rp 0' : rawColV;

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
          insentif: insentifVal
        });
      }
    }

    // 4. Rata-Rata & Selisih Unit (Cols W-Y, indices 22-24, Row 1+)
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

    // 7. Part Bekas (Sheet DATA, Range AC-AF, indices 0-3 of rowsAcAl)
    const partBelumKembali = [];
    for (let r = 0; r < rowsAcAl.length; r++) {
      const row = rowsAcAl[r];
      if (!row || row.length < 3) continue;
      const noGudang = (row[0] || '').trim();
      const qtyVal = (row[1] || '').trim();
      const techNameRow = (row[2] || '').trim();
      const noReservasi = (row[3] || '').trim();

      if (noGudang && noGudang.toUpperCase() !== 'PART' && techNameRow && matchTechName(techNameRow, techName, techNik)) {
        partBelumKembali.push({
          noGudang: noGudang,
          qty: qtyVal || '1',
          teknisi: techNameRow,
          noReservasi: (noReservasi && noReservasi.toUpperCase() !== 'NONE') ? noReservasi : ''
        });
      }
    }

    // 8. Tagihan Rows (Sheet DATA, Range AI-AL, indices 6-9 of rowsAcAl)
    const tagihanRows = [];
    for (let r = 0; r < rowsAcAl.length; r++) {
      const row = rowsAcAl[r];
      if (!row || row.length < 8) continue;
      const noInvoice = (row[6] || '').trim();
      const techNameRow = (row[7] || '').trim();
      const jumlahVal = (row[8] || '').trim();
      const namaKonsumen = (row[9] || '').trim();

      if (noInvoice && noInvoice.toUpperCase() !== 'NO INVOICE' && techNameRow && matchTechName(techNameRow, techName, techNik)) {
        tagihanRows.push({
          noInvoice: noInvoice,
          teknisi: techNameRow,
          jumlah: jumlahVal || '0',
          namaKonsumen: namaKonsumen || '-'
        });
      }
    }

    // Update state & single source of truth cache
    state.sheetsData = {
      lastUpdateTimestamp: pendingTimestamp,
      pendingTimestamp,
      performaTimestamp,
      partKembaliTimestamp,
      tagihanTimestamp,
      lastSyncTime: Date.now(),
      pendingCases,
      insentifRows,
      rata2Rows,
      outputHariIni,
      notifications,
      partBelumKembali,
      tagihanRows
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
  renderPartKembaliTab();
  renderTagihanTab();
  updateBadges();
}

function renderSheetUpdateInfo() {
  const pendingTs = state.sheetsData.pendingTimestamp || state.sheetsData.lastUpdateTimestamp || 'Memuat data....';
  const performaTs = state.sheetsData.performaTimestamp || 'Memuat data....';
  const partKembaliTs = state.sheetsData.partKembaliTimestamp || 'Memuat data....';
  const tagihanTs = state.sheetsData.tagihanTimestamp || 'Memuat data....';

  let activeTs = pendingTs;
  if (state.activeTab === 'tab-performa') activeTs = performaTs;
  else if (state.activeTab === 'tab-part-kembali') activeTs = partKembaliTs;
  else if (state.activeTab === 'tab-tagihan') activeTs = tagihanTs;

  if (DOM.sheetZ2Timestamp) {
    DOM.sheetZ2Timestamp.textContent = activeTs;
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
  if (!str || str === '0' || str === '-') return 'Rp 0';

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
  if (isNaN(parsed) || parsed === 0) {
    return 'Rp 0';
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
          <div class="performa-hero-label">Insentif</div>
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

function renderPartKembaliTab() {
  if (!DOM.partKembaliListContainer) return;
  const list = state.sheetsData.partBelumKembali || [];
  const searchQ = (state.partKembaliSearchQuery || '').trim().toUpperCase();

  const filtered = list.filter(item => {
    if (!searchQ) return true;
    return (
      (item.noGudang || '').toUpperCase().includes(searchQ) ||
      (item.noReservasi || '').toUpperCase().includes(searchQ)
    );
  });

  const totalQty = filtered.reduce((acc, item) => {
    const q = parseFloat(item.qty) || 1;
    return acc + q;
  }, 0);

  if (DOM.partKembaliTotalQty) {
    DOM.partKembaliTotalQty.textContent = `${totalQty} Pcs`;
  }
  if (DOM.partKembaliCount) {
    DOM.partKembaliCount.textContent = `${filtered.length} Item`;
  }

  if (filtered.length === 0) {
    DOM.partKembaliListContainer.innerHTML = `
      <div class="empty-state-sm" style="padding: 24px 10px;">
        <i data-lucide="package-open" style="width:36px; height:36px; color:var(--text-muted);"></i>
        <p style="font-weight:600; color:var(--text-muted); margin-top:4px;">${searchQ ? 'Tidak ada part yang cocok dengan pencarian.' : 'Tidak ada Part Bekas untuk Anda.'}</p>
        <span style="font-size:10.5px; color:var(--text-dark);">Semua part bekas telah diproses.</span>
      </div>`;
    lucide.createIcons();
    return;
  }

  DOM.partKembaliListContainer.innerHTML = filtered.map(item => `
    <div class="card-item-part-kembali" style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px 12px; display:flex; flex-direction:column; gap:4px;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
          <div style="width:30px; height:30px; border-radius:var(--radius-sm); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <i data-lucide="package" style="width:15px; height:15px;"></i>
          </div>
          <div style="flex:1; min-width:0;">
            <div style="font-size:13px; font-weight:800; color:var(--text-main); word-break:break-all;">${escapeHtml(item.noGudang)}</div>
          </div>
        </div>
        <div style="flex-shrink:0;">
          <span style="font-size:11.5px; font-weight:800; color:var(--primary); background:rgba(16, 185, 129, 0.15); padding:3px 8px; border-radius:var(--radius-sm); border:1px solid rgba(16, 185, 129, 0.3); display:inline-block;">
            Qty: ${escapeHtml(item.qty)}
          </span>
        </div>
      </div>
      ${item.noReservasi ? `
      <div style="font-size:10.5px; color:var(--primary); font-weight:700; word-break:break-all; padding-left:40px; margin-top:1px;">
        <i data-lucide="bookmark" style="width:10.5px;height:10.5px;display:inline;"></i> ${escapeHtml(item.noReservasi)}
      </div>` : ''}
    </div>
  `).join('');

  lucide.createIcons();
}

function renderTagihanTab() {
  if (!DOM.tagihanListContainer) return;
  const list = state.sheetsData.tagihanRows || [];
  const searchQ = (state.tagihanSearchQuery || '').trim().toUpperCase();

  const filtered = list.filter(item => {
    if (!searchQ) return true;
    return (
      (item.noInvoice || '').toUpperCase().includes(searchQ) ||
      (item.namaKonsumen || '').toUpperCase().includes(searchQ) ||
      (item.jumlah || '').toString().includes(searchQ)
    );
  });

  const totalJumlah = filtered.reduce((acc, item) => {
    let cleanVal = String(item.jumlah).replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleanVal) || 0;
    return acc + parsed;
  }, 0);

  if (DOM.tagihanTotalJumlah) {
    DOM.tagihanTotalJumlah.textContent = formatRupiah(totalJumlah);
  }
  if (DOM.tagihanCount) {
    DOM.tagihanCount.textContent = `${filtered.length} Invoice`;
  }

  if (filtered.length === 0) {
    DOM.tagihanListContainer.innerHTML = `
      <div class="empty-state-sm" style="padding: 24px 10px;">
        <i data-lucide="receipt" style="width:36px; height:36px; color:var(--text-muted);"></i>
        <p style="font-weight:600; color:var(--text-muted); margin-top:4px;">${searchQ ? 'Tidak ada tagihan yang cocok dengan pencarian.' : 'Tidak ada Tagihan untuk Anda.'}</p>
        <span style="font-size:10.5px; color:var(--text-dark);">Semua invoice tagihan telah diproses.</span>
      </div>`;
    lucide.createIcons();
    return;
  }

  DOM.tagihanListContainer.innerHTML = filtered.map(item => `
    <div class="card-item-tagihan" style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px 12px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
      <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
        <div style="width:34px; height:34px; border-radius:var(--radius-sm); background:rgba(245, 158, 11, 0.15); color:var(--warning); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <i data-lucide="file-text" style="width:18px; height:18px;"></i>
        </div>
        <div style="flex:1; min-width:0;">
          <div style="font-size:10.5px; font-weight:700; color:var(--text-main); word-break:break-all;">${escapeHtml(item.noInvoice)}</div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
            <i data-lucide="user" style="width:11px; height:11px; display:inline;"></i> Konsumen: <strong style="color:var(--text-main);">${escapeHtml(item.namaKonsumen)}</strong>
          </div>
        </div>
      </div>
      <div style="display:flex; align-items:center; flex-shrink:0;">
        <span style="font-size:12px; font-weight:800; color:var(--warning); background:rgba(245, 158, 11, 0.15); padding:5px 10px; border-radius:var(--radius-sm); border:1px solid rgba(245, 158, 11, 0.3);">
          ${formatRupiah(item.jumlah)}
        </span>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}
