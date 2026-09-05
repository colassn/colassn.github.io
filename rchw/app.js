(function(){
const _excluded = ["originalName"],
  _excluded2 = ["id"],
  _excluded3 = ["id"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
const _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef,
  useMemo = _React.useMemo;
const _window$StudyCollabUI = window.StudyCollabUI,
  useCollaboration = _window$StudyCollabUI.useCollaboration,
  CollaborationWorkspace = _window$StudyCollabUI.Workspace,
  CollaborationAccountCard = _window$StudyCollabUI.AccountCard,
  CollaborationPersonalNote = _window$StudyCollabUI.PersonalNote;
const ADMIN_EMAIL = 'chimhinhin@gmail.com';
const CURRENT_RELEASE_NOTICE = {
  version: window.__EHANDBOOK_VERSION__ || 'v3.1.0-studyos-collaboration',
  title: 'StudyOS 3.1.0 群組協作',
  summary: ['五位帳戶編號、群組邀請及人人發放制度。', '同步到個人、群組通知分開控制；每人保留自己的完成狀態。', '收件匣、我發放的、雲端草稿、修改、撤回及個人筆記。', '總管理員可管理帳戶權限、凍結群組及處理檢舉。', '修正細畫面時間表、彈窗、導航及設定頁重複動畫。', '明日功課依實際交期計算；完成後可查看紀錄或還原。'].join('\n'),
  guide: ['「群組」進入協作工作區；舊班級保留於「原有班級」。', '五位英文字母是個人帳戶編號；G- 開頭是群組編號。', '每個群組的設定可獨立開關同步及通知。', '協作服務啟用後才會分配帳戶編號；個人功能保留。'].join('\n'),
  audience: 'all',
  popupEnabled: true,
  publishedAt: '2026-09-04T16:00:00+08:00',
  source: 'built-in'
};
const isIPadLike = () => {
  try {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    return /iPad|iPhone|iPod/i.test(ua) || platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  } catch (e) {
    return false;
  }
};
const isSafariLike = () => {
  try {
    const ua = navigator.userAgent || '';
    return /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|Edg|Android/i.test(ua);
  } catch (e) {
    return false;
  }
};
const isStandaloneMode = () => {
  try {
    return window.navigator.standalone === true || window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  } catch (e) {
    return false;
  }
};
const isInAppBrowser = () => {
  try {
    const ua = navigator.userAgent || '';
    return /Instagram|FBAN|FBAV|Line|MicroMessenger|WhatsApp|TikTok|ByteDance|Snapchat|Twitter|LinkedInApp/i.test(ua);
  } catch (e) {
    return false;
  }
};
const getBrowserLoginModeText = () => {
  if (isInAppBrowser()) return '偵測到內置瀏覽器；為保障登入狀態，請用 Chrome / Safari 正常瀏覽器開啟。';
  if (isStandaloneMode()) return '目前是 iPad／iPhone 主畫面版本，Google 登入會使用獨立安全視窗；Email 登入亦可直接使用。';
  if (isIPadLike() || isSafariLike()) return '此裝置會先用彈出式登入；如果瀏覽器阻擋，才會改用跳轉登入。';
  return '此瀏覽器會先使用彈出式 Google 登入，失敗時再自動改用跳轉登入。';
};
const getFriendlyAuthError = function (error) {
  let mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'login';
  const code = (error === null || error === void 0 ? void 0 : error.code) || '';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') return '登入失敗：帳號或密碼不正確。請重新輸入，或使用「忘記密碼」重設。若你之前用 Google 登入，請按「使用 Google 繼續」。';
  if (code === 'auth/invalid-email') return 'Email 格式不正確，請檢查有沒有打錯。';
  if (code === 'auth/email-already-in-use') return '此 Email 已經註冊過，請改用登入或重設密碼。';
  if (code === 'auth/account-exists-with-different-credential') return '這個 Email 已經用另一種登入方式建立。請先用原本方式登入，再到帳號設定連結 Google。';
  if (code === 'auth/weak-password') return '密碼太短或太簡單，請設定至少 6 個字元。';
  if (code === 'auth/too-many-requests') return '登入嘗試太多次，Firebase 暫時保護帳號，請稍後再試或重設密碼。';
  if (code === 'auth/network-request-failed') return '網絡連線不穩定，請檢查網絡後再試。';
  if (code === 'auth/popup-blocked') return '瀏覽器阻擋了登入視窗，請再按一次 Google 登入，系統會自動改用跳轉登入。';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return '你已取消 Google 登入，請再按一次「使用 Google 繼續」。';
  if (code === 'auth/operation-not-supported-in-this-environment' || code === 'auth/web-storage-unsupported') return '這個瀏覽器不支援彈出式登入，請用 Chrome / Safari 開啟，或再按一次讓系統改用跳轉登入。';
  if (code === 'auth/pwa-popup-unavailable') return 'iPad 主畫面版本未能開啟 Google 登入視窗。請先允許彈出式視窗，或暫時使用 Email 登入。';
  if (code === 'auth/unauthorized-domain') return '此網站網域未加入 Firebase 授權網域，請管理員到 Firebase Authentication > Settings > Authorized domains 加入目前網址。';
  if (code === 'auth/operation-not-allowed') return 'Firebase 尚未開啟 Google 或 Email 登入方式，請管理員到 Firebase Authentication 啟用。';
  if (code === 'auth/argument-error') return 'Google 登入參數錯誤。請重新整理頁面；如問題持續，請檢查 Firebase 授權網域設定。';
  return (mode === 'reset' ? '重設密碼失敗：' : mode === 'register' ? '註冊失敗：' : '登入失敗：') + ((error === null || error === void 0 ? void 0 : error.message) || code || '請稍後再試');
};
const safeStorageGet = function (key) {
  let fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  try {
    const value = window.localStorage.getItem(key);
    return value === null || value === undefined ? fallback : value;
  } catch (e) {
    return fallback;
  }
};
const safeStorageSet = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {}
};
const safeStorageRemove = key => {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {}
};
const safeStorageJSON = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === undefined || parsed === null ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
};
const DEFAULT_SUBJECTS = [{
  name: '中文',
  color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
}, {
  name: '英文',
  color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
}, {
  name: '數學',
  color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
}, {
  name: '公社',
  color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
}, {
  name: '佛學',
  color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
}, {
  name: '生物',
  color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
}, {
  name: '物理',
  color: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800'
}, {
  name: '化學',
  color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
}, {
  name: '歷史',
  color: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900/30 dark:text-stone-400 dark:border-stone-800'
}, {
  name: '電腦',
  color: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800'
}, {
  name: '其他',
  color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
}];
const COLOR_PALETTE = [{
  label: '紅',
  value: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
}, {
  label: '橙',
  value: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
}, {
  label: '黃',
  value: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
}, {
  label: '綠',
  value: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
}, {
  label: '翡翠',
  value: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
}, {
  label: '天藍',
  value: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800'
}, {
  label: '藍',
  value: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
}, {
  label: '靛',
  value: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800'
}, {
  label: '紫',
  value: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
}, {
  label: '石板',
  value: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
}];
const THEME_CONFIG = {
  indigo: {
    name: '靛藍',
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-600 hover:bg-indigo-700',
    ring: 'ring-indigo-100 dark:ring-indigo-900',
    gradient: 'from-indigo-600 to-blue-600',
    lightBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    shadow: 'shadow-indigo-200/50 dark:shadow-indigo-900/20'
  },
  rose: {
    name: '櫻粉',
    text: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-600 hover:bg-rose-700',
    ring: 'ring-rose-100 dark:ring-rose-900',
    gradient: 'from-rose-600 to-pink-600',
    lightBg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800',
    shadow: 'shadow-rose-200/50 dark:shadow-rose-900/20'
  },
  emerald: {
    name: '翡翠',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-600 hover:bg-emerald-700',
    ring: 'ring-emerald-100 dark:ring-emerald-900',
    gradient: 'from-emerald-600 to-teal-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    shadow: 'shadow-emerald-200/50 dark:shadow-emerald-900/20'
  },
  amber: {
    name: '琥珀',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500 hover:bg-amber-600',
    ring: 'ring-amber-100 dark:ring-amber-900',
    gradient: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    shadow: 'shadow-amber-200/50 dark:shadow-amber-900/20'
  },
  violet: {
    name: '紫羅蘭',
    text: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-600 hover:bg-violet-700',
    ring: 'ring-violet-100 dark:ring-violet-900',
    gradient: 'from-violet-600 to-purple-600',
    lightBg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-200 dark:border-violet-800',
    shadow: 'shadow-violet-200/50 dark:shadow-violet-900/20'
  },
  sky: {
    name: '天空',
    text: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500 hover:bg-sky-600',
    ring: 'ring-sky-100 dark:ring-sky-900',
    gradient: 'from-sky-500 to-blue-500',
    lightBg: 'bg-sky-50 dark:bg-sky-900/20',
    border: 'border-sky-200 dark:border-sky-800',
    shadow: 'shadow-sky-200/50 dark:shadow-sky-900/20'
  },
  zinc: {
    name: '鋅灰',
    text: 'text-zinc-600 dark:text-zinc-300',
    bg: 'bg-zinc-700 hover:bg-zinc-800',
    ring: 'ring-zinc-100 dark:ring-zinc-800',
    gradient: 'from-zinc-600 to-slate-800',
    lightBg: 'bg-zinc-100 dark:bg-zinc-800/50',
    border: 'border-zinc-200 dark:border-zinc-700',
    shadow: 'shadow-zinc-200/50 dark:shadow-zinc-900/20'
  }
};
const DEFAULT_TIME_SLOTS = [{
  id: 'l1',
  label: '第1節',
  type: 'lesson',
  startTime: '08:30',
  duration: 35
}, {
  id: 'l2',
  label: '第2節',
  type: 'lesson',
  startTime: '09:05',
  duration: 35
}, {
  id: 'b1',
  label: '小息',
  type: 'break',
  startTime: '09:40',
  duration: 15
}, {
  id: 'l3',
  label: '第3節',
  type: 'lesson',
  startTime: '09:55',
  duration: 35
}];
const DEFAULT_SCHEDULE = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: []
};
const Icon = _ref => {
  let name = _ref.name,
    className = _ref.className;
  const ref = useRef(null);
  useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const i = document.createElement('i');
      i.setAttribute('data-lucide', name);
      if (className) i.setAttribute('class', className);
      ref.current.appendChild(i);
      window.lucide.createIcons({
        root: ref.current
      });
    }
  }, [name, className]);
  return React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });
};
function CustomDropdown(_ref2) {
  let value = _ref2.value,
    onChange = _ref2.onChange,
    options = _ref2.options,
    customClasses = _ref2.customClasses;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedOption = options.find(o => o.value === value);
  return React.createElement("div", {
    className: "relative z-50",
    ref: dropdownRef
  }, React.createElement("button", {
    type: "button",
    onClick: () => setIsOpen(!isOpen),
    className: customClasses || "flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
  }, (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.icon) && React.createElement(Icon, {
    name: selectedOption.icon,
    className: "w-4 h-4"
  }), React.createElement("span", {
    className: "hidden sm:inline"
  }, (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label) || '排序'), React.createElement(Icon, {
    name: "chevron-down",
    className: `w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`
  })), isOpen && React.createElement("div", {
    className: "absolute right-0 mt-2 min-w-[140px] glass-card bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right"
  }, options.map(opt => React.createElement("button", {
    key: opt.value,
    onClick: () => {
      onChange(opt.value);
      setIsOpen(false);
    },
    className: `w-full text-left px-4 py-2 text-sm font-bold flex items-center gap-3 transition-colors ${value === opt.value ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`
  }, opt.label))));
}
const formatCountdown = ms => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
const formatTimeStr = date => {
  try {
    return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleTimeString('zh-HK', {
      hour: '2-digit',
      minute: '2-digit'
    }) : '--:--';
  } catch (e) {
    return '--:--';
  }
};
const formatRelativeTime = lastSeen => {
  if (!lastSeen || typeof lastSeen.toDate !== 'function') return '無紀錄';
  const date = lastSeen.toDate();
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffSec < 60) return '剛剛';
  if (diffMin < 60) return `${diffMin} 分鐘前`;
  if (diffHour < 24) return `${diffHour} 小時前`;
  if (diffDay < 30) return `${diffDay} 天前`;
  return date.toLocaleDateString('zh-HK');
};
const formatDueDate = dateStr => {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' && typeof dateStr.toDate !== 'function' ? new Date(dateStr) : dateStr.toDate();
    if (isNaN(d.getTime())) return String(dateStr);
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} (星期${weekDays[d.getDay()]})`;
  } catch (e) {
    return String(dateStr);
  }
};
const toLocalDateKey = dateValue => {
  if (!dateValue) return '';
  if (typeof dateValue === 'string') return dateValue.slice(0, 10);
  try {
    const date = typeof (dateValue === null || dateValue === void 0 ? void 0 : dateValue.toDate) === 'function' ? dateValue.toDate() : new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    return '';
  }
};
const generateFullSchedule = function (config, now) {
  var _config$schedule;
  let dayOverride = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (!config || !Array.isArray(config.timeSlots)) return [];
  const day = dayOverride !== null ? dayOverride : now.getDay();
  if (day === 0 || day === 6) return [];
  const daySubjects = ((_config$schedule = config.schedule) === null || _config$schedule === void 0 ? void 0 : _config$schedule[day]) || [];
  let lessonIndex = 0;
  const baseDate = new Date(now);
  baseDate.setHours(0, 0, 0, 0);
  return config.timeSlots.map(slot => {
    const parts = (slot.startTime || "00:00").split(':');
    const start = new Date(baseDate);
    start.setHours(parseInt(parts[0]) || 0, parseInt(parts[1]) || 0, 0, 0);
    const end = new Date(start.getTime() + (parseInt(slot.duration) || 35) * 60000);
    let subject = slot.label || '';
    if (slot.type === 'lesson') {
      subject = daySubjects[lessonIndex] || '---';
      lessonIndex++;
    }
    return {
      ...slot,
      start,
      end,
      subjectName: subject
    };
  });
};
const inferSubjectFromTimetable = function (config) {
  let now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  try {
    const schedule = generateFullSchedule(config, now);
    if (!schedule.length) return '';
    const nowMs = now.getTime();
    const lessonSlots = schedule.filter(slot => slot.type === 'lesson' && slot.subjectName && slot.subjectName !== '---');
    const currentLesson = lessonSlots.find(slot => nowMs >= slot.start.getTime() && nowMs < slot.end.getTime());
    if (currentLesson) return currentLesson.subjectName;
    const justEndedLessons = lessonSlots.filter(slot => nowMs >= slot.end.getTime() && nowMs - slot.end.getTime() <= 30 * 60 * 1000).sort((a, b) => nowMs - a.end.getTime() - (nowMs - b.end.getTime()));
    if (justEndedLessons.length) return justEndedLessons[0].subjectName;
    const nearestPastLesson = lessonSlots.filter(slot => nowMs >= slot.end.getTime()).sort((a, b) => b.end.getTime() - a.end.getTime())[0];
    return (nearestPastLesson === null || nearestPastLesson === void 0 ? void 0 : nearestPastLesson.subjectName) || '';
  } catch (e) {
    console.warn("Subject prediction failed:", e);
    return '';
  }
};
const formatFirebaseDateTime = value => {
  try {
    if (!value) return '';
    const d = typeof (value === null || value === void 0 ? void 0 : value.toDate) === 'function' ? value.toDate() : new Date(value);
    if (!(d instanceof Date) || isNaN(d.getTime())) return '';
    return d.toLocaleString('zh-HK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return '';
  }
};
function AuthPage(_ref3) {
  let triggerAlert = _ref3.triggerAlert,
    onAuthenticated = _ref3.onAuthenticated;
  const _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    isLogin = _useState4[0],
    setIsLogin = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isResetMode = _useState6[0],
    setIsResetMode = _useState6[1];
  const _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    email = _useState8[0],
    setEmail = _useState8[1];
  const _useState9 = useState(''),
    _useState0 = _slicedToArray(_useState9, 2),
    password = _useState0[0],
    setPassword = _useState0[1];
  const _useState1 = useState(false),
    _useState10 = _slicedToArray(_useState1, 2),
    loading = _useState10[0],
    setLoading = _useState10[1];
  const services = window.firebaseServices || {};
  const auth = services.auth,
    googleProvider = services.googleProvider,
    createGoogleProvider = services.createGoogleProvider,
    signInWithPopup = services.signInWithPopup,
    signInWithRedirect = services.signInWithRedirect,
    browserPopupRedirectResolver = services.browserPopupRedirectResolver,
    redirectSignInSafe = services.redirectSignInSafe,
    createUserWithEmailAndPassword = services.createUserWithEmailAndPassword,
    signInWithEmailAndPassword = services.signInWithEmailAndPassword,
    sendPasswordResetEmail = services.sendPasswordResetEmail;
  const inAppBrowser = isInAppBrowser();
  const standaloneMode = isStandaloneMode();
  const mustUseRedirectLogin = () => isInAppBrowser() && redirectSignInSafe;
  const shouldFallbackToRedirect = error => {
    const code = (error === null || error === void 0 ? void 0 : error.code) || '';
    return ['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/web-storage-unsupported', 'auth/argument-error', 'auth/cancelled-popup-request'].includes(code);
  };
  const getFreshGoogleProvider = () => {
    try {
      var _googleProvider$setCu;
      if (typeof createGoogleProvider === 'function') return createGoogleProvider();
      googleProvider === null || googleProvider === void 0 || (_googleProvider$setCu = googleProvider.setCustomParameters) === null || _googleProvider$setCu === void 0 || _googleProvider$setCu.call(googleProvider, {
        prompt: 'select_account'
      });
      return googleProvider;
    } catch (e) {
      console.warn('Create Google provider fallback failed:', e);
      return googleProvider;
    }
  };
  const startRedirectLogin = async () => {
    var _window$__EHANDBOOK_M, _window;
    if (!redirectSignInSafe) throw {
      code: 'auth/pwa-popup-unavailable',
      message: 'Cross-origin redirect sign-in is not safe in this browser.'
    };
    const provider = getFreshGoogleProvider();
    if (!provider) throw new Error('Google Provider 尚未準備好');
    await (window.__EHANDBOOK_AUTH_PERSISTENCE_READY__ || Promise.resolve());
    (_window$__EHANDBOOK_M = (_window = window).__EHANDBOOK_MARK_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_M === void 0 || _window$__EHANDBOOK_M.call(_window);
    try {
      window.__EHANDBOOK_AUTH_DEBUG__.redirectResultState = 'redirect-started';
    } catch (e) {}
    await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
  };
  useEffect(() => {
    if (!auth) return;
    let cancelled = false;
    const wasRedirecting = safeStorageGet('ehandbook_google_redirect_pending', '') === '1';
    if (wasRedirecting) setLoading(true);
    const redirectPromise = window.__EHANDBOOK_REDIRECT_RESULT_PROMISE__ || Promise.resolve(null);
    const persistencePromise = window.__EHANDBOOK_AUTH_PERSISTENCE_READY__ || Promise.resolve();
    Promise.allSettled([persistencePromise, redirectPromise]).then(settled => {
      var _settled$;
      if (cancelled) return;
      const result = ((_settled$ = settled[1]) === null || _settled$ === void 0 ? void 0 : _settled$.value) || window.__EHANDBOOK_REDIRECT_RESULT__ || null;
      const signedInUser = (result === null || result === void 0 ? void 0 : result.user) || auth.currentUser;
      if (signedInUser) {
        var _window$__EHANDBOOK_C, _window2;
        (_window$__EHANDBOOK_C = (_window2 = window).__EHANDBOOK_CLEAR_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_C === void 0 || _window$__EHANDBOOK_C.call(_window2);
        onAuthenticated === null || onAuthenticated === void 0 || onAuthenticated(signedInUser);
        triggerAlert('Google 登入成功，正在進入主頁…');
      } else if (wasRedirecting && window.__EHANDBOOK_REDIRECT_ERROR__) {
        triggerAlert(getFriendlyAuthError(window.__EHANDBOOK_REDIRECT_ERROR__, 'login'), 'error');
      } else if (wasRedirecting && window.__EHANDBOOK_REDIRECT_RESULT_SETTLED__) {
        triggerAlert('Google 已返回，但未取得登入狀態。請再按一次 Google 登入。', 'error');
      }
    }).finally(() => {
      if (!cancelled && !auth.currentUser) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [auth]);
  const handleGoogleLogin = async () => {
    if (!auth || !signInWithPopup || !signInWithRedirect) {
      triggerAlert('Firebase 尚未準備好，請重新整理後再試。', 'error');
      return;
    }
    try {
      var _window$__EHANDBOOK_C2, _window3;
      setLoading(true);
      if (mustUseRedirectLogin()) {
        await startRedirectLogin();
        return;
      }
      (_window$__EHANDBOOK_C2 = (_window3 = window).__EHANDBOOK_CLEAR_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_C2 === void 0 || _window$__EHANDBOOK_C2.call(_window3);
      const provider = getFreshGoogleProvider();
      const credential = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      if (credential !== null && credential !== void 0 && credential.user) {
        var _window$__EHANDBOOK_C3, _window4;
        (_window$__EHANDBOOK_C3 = (_window4 = window).__EHANDBOOK_CLEAR_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_C3 === void 0 || _window$__EHANDBOOK_C3.call(_window4);
        onAuthenticated === null || onAuthenticated === void 0 || onAuthenticated(credential.user);
        triggerAlert('Google 登入成功，正在進入主頁…');
      } else if (auth.currentUser) {
        var _window$__EHANDBOOK_C4, _window5;
        (_window$__EHANDBOOK_C4 = (_window5 = window).__EHANDBOOK_CLEAR_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_C4 === void 0 || _window$__EHANDBOOK_C4.call(_window5);
        onAuthenticated === null || onAuthenticated === void 0 || onAuthenticated(auth.currentUser);
        triggerAlert('Google 登入成功，正在進入主頁…');
      } else {
        throw {
          code: 'auth/no-user-after-popup',
          message: 'Google 登入完成，但系統未取得使用者狀態。'
        };
      }
    } catch (error) {
      console.warn('Google login failed:', error);
      if (shouldFallbackToRedirect(error) && signInWithRedirect && redirectSignInSafe) {
        try {
          await startRedirectLogin();
          return;
        } catch (redirectError) {
          var _window$__EHANDBOOK_C5, _window6;
          console.warn('Google redirect fallback failed:', redirectError);
          (_window$__EHANDBOOK_C5 = (_window6 = window).__EHANDBOOK_CLEAR_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_C5 === void 0 || _window$__EHANDBOOK_C5.call(_window6);
          triggerAlert(getFriendlyAuthError(redirectError, 'login'), 'error');
        }
      } else {
        const finalError = standaloneMode && shouldFallbackToRedirect(error) && !redirectSignInSafe ? {
          code: 'auth/pwa-popup-unavailable',
          message: (error === null || error === void 0 ? void 0 : error.message) || ''
        } : error;
        triggerAlert(getFriendlyAuthError(finalError, 'login'), 'error');
      }
      setLoading(false);
    }
  };
  const handlePasswordReset = async e => {
    e.preventDefault();
    const targetEmail = email.trim();
    if (!targetEmail) {
      triggerAlert('請先輸入 Email。', 'error');
      return;
    }
    if (!sendPasswordResetEmail || !auth) {
      triggerAlert('密碼重設服務尚未準備好，請重新整理後再試。', 'error');
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, targetEmail);
      triggerAlert('已發送重設密碼電郵，請到信箱查看。');
      setIsResetMode(false);
      setIsLogin(true);
    } catch (error) {
      triggerAlert(getFriendlyAuthError(error, 'reset'), 'error');
    } finally {
      setLoading(false);
    }
  };
  const handleEmailAuth = async e => {
    e.preventDefault();
    if (isResetMode) {
      await handlePasswordReset(e);
      return;
    }
    const targetEmail = email.trim();
    if (!targetEmail || !password) {
      triggerAlert('請輸入 Email 同密碼。', 'error');
      return;
    }
    if (!auth || !signInWithEmailAndPassword || !createUserWithEmailAndPassword) {
      triggerAlert('Firebase 尚未準備好，請重新整理後再試。', 'error');
      return;
    }
    try {
      setLoading(true);
      await (window.__EHANDBOOK_AUTH_PERSISTENCE_READY__ || Promise.resolve());
      const credential = isLogin ? await signInWithEmailAndPassword(auth, targetEmail, password) : await createUserWithEmailAndPassword(auth, targetEmail, password);
      if (!(credential !== null && credential !== void 0 && credential.user)) throw {
        code: 'auth/no-user-after-email',
        message: '登入完成但未取得使用者狀態。'
      };
      onAuthenticated === null || onAuthenticated === void 0 || onAuthenticated(credential.user);
      triggerAlert(isLogin ? '登入成功，正在進入主頁…' : '註冊成功，正在建立個人資料…');
    } catch (error) {
      triggerAlert(getFriendlyAuthError(error, isLogin ? 'login' : 'register'), 'error');
      setLoading(false);
    }
  };
  const titleText = isResetMode ? '重設密碼' : isLogin ? '歡迎回來' : '建立帳戶';
  const subtitleText = isResetMode ? '輸入 Email 收取重設連結' : isLogin ? '登入你的學習空間' : '開始使用電子手冊 Pro';
  const submitText = isResetMode ? '發送重設連結' : isLogin ? '登入' : '建立帳戶';
  return React.createElement("div", {
    className: "min-h-screen bg-[radial-gradient(circle_at_top_left,#e0e7ff,transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_45%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.28),transparent_32%),linear-gradient(135deg,#020617_0%,#111827_48%,#020617_100%)] flex items-center justify-center px-4 py-8 relative overflow-hidden"
  }, React.createElement("div", {
    className: "absolute inset-x-0 top-0 h-24 bg-white/40 dark:bg-white/5 backdrop-blur-3xl pointer-events-none"
  }), React.createElement("div", {
    className: "w-full max-w-4xl grid md:grid-cols-[0.95fr_1.05fr] rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-200/40 dark:shadow-black/40 border border-white/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl modal-animate relative z-10"
  }, React.createElement("div", {
    className: "hidden md:flex flex-col justify-between p-10 bg-slate-950 text-white relative overflow-hidden"
  }, React.createElement("div", {
    className: "absolute -right-20 -top-20 w-64 h-64 rounded-full bg-indigo-500/30 blur-3xl"
  }), React.createElement("div", {
    className: "absolute -left-24 bottom-0 w-72 h-72 rounded-full bg-sky-500/20 blur-3xl"
  }), React.createElement("div", {
    className: "relative z-10"
  }, React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-8 shadow-lg"
  }, React.createElement(Icon, {
    name: "book-open",
    className: "w-6 h-6 text-white"
  })), React.createElement("div", {
    className: "text-xs font-black tracking-[0.28em] text-indigo-200 uppercase mb-4"
  }, "E-HANDBOOK PRO"), React.createElement("h1", {
    className: "text-4xl font-black tracking-tight leading-tight mb-4"
  }, "\u5C08\u6CE8\u8A18\u9304\uFF0C", React.createElement("br", null), "\u7C21\u55AE\u5B8C\u6210\u3002"), React.createElement("p", {
    className: "text-sm text-slate-300 leading-7 max-w-xs"
  }, "\u529F\u8AB2\u3001\u6E2C\u9A57\u3001\u6642\u9593\u8868\uFF0C\u4E00\u500B\u5730\u65B9\u7BA1\u7406\u3002")), React.createElement("div", {
    className: "relative z-10 flex items-center gap-3 text-xs text-slate-400 font-bold"
  }, React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
  }), "Google \u767B\u5165\u5DF2\u555F\u7528")), React.createElement("div", {
    className: "p-6 sm:p-10 md:p-12 bg-white/[0.85] dark:bg-slate-900/[0.85]"
  }, React.createElement("div", {
    className: "max-w-sm mx-auto"
  }, React.createElement("div", {
    className: "md:hidden flex items-center gap-3 mb-8"
  }, React.createElement("div", {
    className: "w-11 h-11 rounded-2xl bg-slate-950 dark:bg-white flex items-center justify-center shadow-lg"
  }, React.createElement(Icon, {
    name: "book-open",
    className: "w-5 h-5 text-white dark:text-slate-950"
  })), React.createElement("div", null, React.createElement("div", {
    className: "text-sm font-black text-slate-900 dark:text-white"
  }, "\u96FB\u5B50\u624B\u518A Pro"), React.createElement("div", {
    className: "text-xs font-bold text-slate-400"
  }, "E-HANDBOOK PRO"))), React.createElement("div", {
    className: "mb-8"
  }, React.createElement("h2", {
    className: "text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2"
  }, titleText), React.createElement("p", {
    className: "text-sm font-semibold text-slate-500 dark:text-slate-400"
  }, subtitleText)), !isResetMode && React.createElement("button", {
    type: "button",
    onClick: handleGoogleLogin,
    disabled: loading,
    className: "w-full h-13 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-slate-300/50 dark:shadow-black/30 disabled:opacity-70"
  }, loading ? React.createElement(Icon, {
    name: "loader",
    className: "w-5 h-5 animate-spin"
  }) : React.createElement("img", {
    src: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
    alt: "Google",
    className: "w-5 h-5 bg-white rounded-full"
  }), "\u4F7F\u7528 Google \u767B\u5165"), standaloneMode && !isResetMode && React.createElement("div", {
    className: "mt-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 px-3 py-2.5 text-xs font-bold text-sky-700 dark:text-sky-300 flex gap-2 items-start"
  }, React.createElement(Icon, {
    name: "tablet-smartphone",
    className: "w-4 h-4 shrink-0 mt-0.5"
  }), React.createElement("span", null, "\u5DF2\u555F\u7528 iPad \u4E3B\u756B\u9762\u767B\u5165\u6A21\u5F0F\uFF1B\u6309 Google \u5F8C\u8ACB\u5B8C\u6210\u7368\u7ACB\u767B\u5165\u8996\u7A97\uFF0C\u6216\u76F4\u63A5\u4F7F\u7528\u4E0B\u65B9 Email \u767B\u5165\u3002")), inAppBrowser && !isResetMode && React.createElement("div", {
    className: "mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 flex gap-2 items-center"
  }, React.createElement(Icon, {
    name: "alert-triangle",
    className: "w-4 h-4 shrink-0"
  }), "\u5982\u767B\u5165\u4E0D\u9806\uFF0C\u8ACB\u7528 Safari / Chrome \u958B\u555F\u3002"), !isResetMode && React.createElement("div", {
    className: "relative my-7"
  }, React.createElement("div", {
    className: "absolute inset-0 flex items-center"
  }, React.createElement("div", {
    className: "w-full border-t border-slate-200 dark:border-slate-800"
  })), React.createElement("div", {
    className: "relative flex justify-center text-[11px] font-black text-slate-400"
  }, React.createElement("span", {
    className: "px-4 bg-white/90 dark:bg-slate-900/90"
  }, "\u6216\u7528 Email"))), React.createElement("form", {
    onSubmit: handleEmailAuth,
    className: "space-y-4"
  }, React.createElement("div", null, React.createElement("label", {
    className: "text-xs font-black text-slate-500 dark:text-slate-400 ml-1"
  }, "Email"), React.createElement("div", {
    className: "relative mt-1.5"
  }, React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"
  }, React.createElement(Icon, {
    name: "mail",
    className: "w-5 h-5"
  })), React.createElement("input", {
    type: "email",
    inputMode: "email",
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: "false",
    className: "w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold dark:text-white",
    placeholder: "name@example.com",
    value: email,
    onChange: e => setEmail(e.target.value),
    required: true
  }))), !isResetMode && React.createElement("div", null, React.createElement("div", {
    className: "flex items-center justify-between ml-1 mb-1.5"
  }, React.createElement("label", {
    className: "text-xs font-black text-slate-500 dark:text-slate-400"
  }, "\u5BC6\u78BC"), React.createElement("button", {
    type: "button",
    onClick: () => setIsResetMode(true),
    className: "text-xs font-black text-indigo-600 dark:text-indigo-400 hover:opacity-80"
  }, "\u5FD8\u8A18\u5BC6\u78BC\uFF1F")), React.createElement("div", {
    className: "relative"
  }, React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"
  }, React.createElement(Icon, {
    name: "lock",
    className: "w-5 h-5"
  })), React.createElement("input", {
    type: "password",
    className: "w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold dark:text-white",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: password,
    onChange: e => setPassword(e.target.value),
    required: true
  }))), React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-200/60 dark:shadow-indigo-950/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-5 disabled:opacity-70"
  }, loading ? React.createElement(Icon, {
    name: "loader",
    className: "w-5 h-5 animate-spin"
  }) : submitText)), isResetMode ? React.createElement("div", {
    className: "mt-6 text-center"
  }, React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsResetMode(false);
      setIsLogin(true);
    },
    className: "text-sm font-black text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
  }, "\u8FD4\u56DE\u767B\u5165")) : React.createElement("div", {
    className: "mt-7 text-center"
  }, React.createElement("p", {
    className: "text-slate-500 dark:text-slate-400 text-sm font-semibold"
  }, isLogin ? '未有帳戶？' : '已有帳戶？', React.createElement("button", {
    type: "button",
    onClick: () => setIsLogin(!isLogin),
    className: "text-indigo-600 dark:text-indigo-400 font-black hover:opacity-80 ml-1.5"
  }, isLogin ? '建立帳戶' : '返回登入'))), React.createElement("div", {
    className: "mt-8 text-center text-xs font-bold text-slate-300 dark:text-slate-700 select-none"
  }, "StudyOS \xB7 v3.1.0")))));
}
function CurrentLessonWidget(_ref4) {
  let config = _ref4.config,
    t = _ref4.t,
    onClick = _ref4.onClick,
    globalNow = _ref4.globalNow;
  const now = globalNow || new Date();
  const day = now.getDay();
  if (day === 0 || day === 6) return React.createElement("div", {
    className: "glass-card rounded-2xl p-4 mb-6 text-center"
  }, React.createElement("div", {
    className: "font-bold text-slate-500 flex items-center justify-center gap-2"
  }, React.createElement(Icon, {
    name: "coffee",
    className: "w-5 h-5 text-orange-500"
  }), " \u653E\u5047\u5566\uFF01\u597D\u597D\u4F11\u606F"));
  const schedule = generateFullSchedule(config, now);
  const currentMs = now.getTime();
  let currentSlot = null,
    nextSlot = null,
    status = 'ended';
  for (let i = 0; i < schedule.length; i++) {
    const s = schedule[i];
    if (currentMs >= s.start.getTime() && currentMs < s.end.getTime()) {
      currentSlot = s;
      status = s.type === 'lesson' ? 'current' : 'break';
      nextSlot = schedule[i + 1];
      break;
    }
    if (currentMs < s.start.getTime()) {
      nextSlot = s;
      status = 'not-started';
      break;
    }
  }
  if (!currentSlot && !nextSlot) status = 'ended';
  const diff = currentSlot ? currentSlot.end.getTime() - currentMs : nextSlot ? nextSlot.start.getTime() - currentMs : 0;
  return React.createElement("div", {
    onClick: onClick,
    className: "cursor-pointer mb-6 relative overflow-hidden rounded-2xl p-[2px] shadow-lg hover:scale-[1.01] transition-transform duration-300"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 animate-gradient-x"
  }), React.createElement("div", {
    className: "relative glass-card bg-white/90 dark:bg-slate-900/90 rounded-2xl p-4 flex items-center justify-between h-full"
  }, React.createElement("div", {
    className: `absolute top-0 left-0 h-[2px] transition-all duration-1000 ${status === 'current' ? 'bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)]' : 'bg-transparent'}`,
    style: {
      width: currentSlot ? `${100 - diff / (currentSlot.end - currentSlot.start) * 100}%` : '0%'
    }
  }), React.createElement("div", {
    className: "flex-1 text-left min-w-0 z-10"
  }, React.createElement("div", {
    className: "text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-0.5 flex items-center gap-1"
  }, status === 'current' ? React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-green-500 animate-pulse"
  }) : React.createElement(Icon, {
    name: "clock",
    className: "w-3 h-3"
  }), status === 'current' ? '正在上課' : status === 'break' ? '小息時間' : status === 'not-started' ? '準備上課' : '放學'), React.createElement("div", {
    className: "font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 truncate"
  }, status === 'ended' ? '🎉 是日已完結' : currentSlot ? currentSlot.subjectName : '---')), status !== 'ended' && React.createElement("div", {
    className: "flex-1 text-center z-10"
  }, React.createElement("div", {
    className: `text-3xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-br ${status === 'current' ? 'from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400' : 'from-slate-400 to-slate-600'}`
  }, formatCountdown(diff)), React.createElement("div", {
    className: "text-[9px] text-slate-400 font-bold tracking-widest uppercase"
  }, status === 'current' ? 'REMAINING' : 'NEXT LESSON')), React.createElement("div", {
    className: "flex-1 text-right min-w-0 pl-2 z-10"
  }, React.createElement("div", {
    className: "text-[10px] text-slate-400 font-bold uppercase mb-0.5"
  }, "\u4E0B\u4E00\u7BC0"), React.createElement("div", {
    className: "font-bold text-sm text-slate-600 dark:text-slate-300 truncate"
  }, nextSlot ? nextSlot.subjectName : '放學'))));
}
function BlockScreen(_ref5) {
  let type = _ref5.type,
    estimatedTime = _ref5.estimatedTime,
    customMessage = _ref5.customMessage,
    customTitle = _ref5.customTitle,
    user = _ref5.user;
  const defaultMessage = type === 'access_denied' || type === 'whitelist_blocked' ? '抱歉，此系統目前已限制您的存取權限。\n請聯絡管理員了解詳情。' : '管理員正在進行系統維護，請稍後再回來。';
  const iconName = type === 'access_denied' || type === 'whitelist_blocked' ? 'shield-ban' : type === 'updating' ? 'hammer' : type === 'restructuring' ? 'database' : 'lock';
  const defaultTitle = type === 'access_denied' || type === 'whitelist_blocked' ? '存取被拒' : type === 'updating' ? '網站更新中' : type === 'restructuring' ? '資料重整中' : '系統維護中';
  return React.createElement("div", {
    className: "fixed inset-0 z-40 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 text-center overflow-hidden"
  }, React.createElement("div", {
    className: "absolute inset-0 z-0 opacity-30"
  }, React.createElement("div", {
    className: "absolute top-10 left-10 w-64 h-64 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
  }), React.createElement("div", {
    className: "absolute bottom-10 right-10 w-64 h-64 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
  })), React.createElement("div", {
    className: "glass-card bg-white/80 dark:bg-slate-800/80 p-8 rounded-3xl shadow-xl max-w-md w-full relative z-10"
  }, React.createElement("div", {
    className: "w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6"
  }, React.createElement(Icon, {
    name: iconName,
    className: "w-10 h-10 text-red-500"
  })), React.createElement("h1", {
    className: "text-2xl font-black text-slate-800 dark:text-white mb-2"
  }, customTitle || defaultTitle), React.createElement("p", {
    className: "text-slate-500 dark:text-slate-400 font-medium mb-6 whitespace-pre-wrap"
  }, customMessage || defaultMessage), estimatedTime && (type === 'updating' || type === 'restructuring') && React.createElement("div", {
    className: "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 flex items-center gap-3"
  }, React.createElement(Icon, {
    name: "timer",
    className: "w-5 h-5 text-indigo-600 dark:text-indigo-400"
  }), React.createElement("div", {
    className: "text-left"
  }, React.createElement("div", {
    className: "text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase"
  }, "\u9810\u8A08\u6062\u5FA9\u6642\u9593"), React.createElement("div", {
    className: "text-sm font-bold text-indigo-700 dark:text-indigo-300"
  }, estimatedTime))), user && React.createElement("div", {
    className: "mt-6"
  }, React.createElement("p", {
    className: "text-xs text-slate-400 mb-2"
  }, "\u7576\u524D\u5E33\u865F: ", user.email), React.createElement("button", {
    onClick: () => {
      var _window$firebaseServi;
      return (_window$firebaseServi = window.firebaseServices) === null || _window$firebaseServi === void 0 ? void 0 : _window$firebaseServi.signOut(window.firebaseServices.auth);
    },
    className: "text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
  }, "\u767B\u51FA / \u5207\u63DB\u5E33\u865F"))));
}
function QuickViewModal(_ref6) {
  let isOpen = _ref6.isOpen,
    onClose = _ref6.onClose,
    title = _ref6.title,
    items = _ref6.items,
    subjects = _ref6.subjects,
    onEdit = _ref6.onEdit,
    onDelete = _ref6.onDelete,
    isAdmin = _ref6.isAdmin,
    userUid = _ref6.userUid;
  if (!isOpen) return null;
  const getDaysRemaining = dString => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dString);
    due.setHours(0, 0, 0, 0);
    return Math.ceil((due - today) / 86400000);
  };
  return React.createElement("div", {
    className: "fixed inset-0 z-[160] flex items-end justify-center sm:items-center sm:p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity",
    onClick: onClose
  }), React.createElement("div", {
    className: "animate-item glass-card bg-white/90 dark:bg-slate-800/90 rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-md p-6 pt-2 relative z-10 flex flex-col max-h-[85vh] sm:max-h-[80vh]"
  }, React.createElement("div", {
    className: "w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5 mt-2 sm:hidden opacity-80"
  }), React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, React.createElement("h3", {
    className: "text-2xl font-black text-slate-800 dark:text-white tracking-tight"
  }, title), React.createElement("button", {
    onClick: onClose,
    className: "p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-all active:scale-90"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-5 h-5 text-slate-500 dark:text-slate-300"
  }))), React.createElement("div", {
    className: "overflow-y-auto flex-1 pr-1 space-y-3 scrollbar-hide pb-4"
  }, items.length === 0 ? React.createElement("div", {
    className: "text-center py-12 text-slate-400 font-bold"
  }, React.createElement("div", {
    className: "bg-slate-100 dark:bg-slate-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
  }, React.createElement(Icon, {
    name: "check-circle-2",
    className: "w-8 h-8 text-slate-300 dark:text-slate-500"
  })), "\u6C92\u6709\u76F8\u95DC\u7D00\u9304 \uD83C\uDF89") : items.map(item => {
    var _subjects$find;
    const subjectStyle = ((_subjects$find = subjects.find(s => s.name === item.subject)) === null || _subjects$find === void 0 ? void 0 : _subjects$find.color) || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600';
    const dl = getDaysRemaining(item.dueDate);
    const priorityMeta = getPriorityMeta(item.priority);
    let statusText = `${dl} 天後`;
    let statusColor = "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30";
    if (dl < 0) {
      statusText = `過期 ${Math.abs(dl)} 天`;
      statusColor = "text-red-600 bg-red-100 dark:bg-red-900/30";
    }
    if (dl === 0) {
      statusText = "今日到期";
      statusColor = "text-orange-600 bg-orange-100 dark:bg-orange-900/30 animate-pulse";
    }
    return React.createElement("div", {
      key: item.id,
      className: "p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-2 group hover:border-indigo-300 hover:shadow-sm transition-all"
    }, React.createElement("div", {
      className: "flex justify-between items-start"
    }, React.createElement("div", {
      className: "flex gap-2 items-center flex-wrap"
    }, React.createElement("span", {
      className: `text-xs font-bold px-2.5 py-0.5 rounded-md border ${subjectStyle}`
    }, item.subject), React.createElement("span", {
      className: `text-xs font-bold px-2.5 py-0.5 rounded-md border ${priorityMeta.classes}`
    }, priorityMeta.label), React.createElement("span", {
      className: `text-xs font-bold px-2.5 py-0.5 rounded-md ${statusColor}`
    }, statusText)), React.createElement("div", {
      className: "flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
    }, !item.forceExpired && React.createElement("button", {
      onClick: () => {
        onEdit(item);
        onClose();
      },
      className: "p-1.5 text-slate-400 hover:text-blue-500 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"
    }, React.createElement(Icon, {
      name: "pencil",
      className: "w-3.5 h-3.5"
    })), React.createElement("button", {
      onClick: () => onDelete(item.id),
      className: "p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"
    }, React.createElement(Icon, {
      name: "trash-2",
      className: "w-3.5 h-3.5"
    })))), React.createElement("div", {
      className: "font-bold text-slate-800 dark:text-slate-200 text-sm break-words mt-1"
    }, item.description), React.createElement("div", {
      className: "text-[11px] text-slate-400 font-mono text-right flex justify-end items-center gap-1"
    }, React.createElement(Icon, {
      name: "calendar",
      className: "w-3 h-3"
    }), " ", formatDueDate(item.dueDate)));
  }))));
}
function AppearanceModal(_ref7) {
  let isOpen = _ref7.isOpen,
    onClose = _ref7.onClose,
    t = _ref7.t,
    themeColor = _ref7.themeColor,
    setThemeColor = _ref7.setThemeColor,
    isDarkMode = _ref7.isDarkMode,
    setIsDarkMode = _ref7.setIsDarkMode,
    layoutMode = _ref7.layoutMode,
    setLayoutMode = _ref7.setLayoutMode,
    customLayout = _ref7.customLayout,
    setCustomLayout = _ref7.setCustomLayout;
  if (!isOpen) return null;
  const handleCustomToggle = key => setCustomLayout({
    ...customLayout,
    [key]: !customLayout[key]
  });
  return React.createElement("div", {
    className: "fixed inset-0 z-[160] flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm",
    onClick: onClose
  }), React.createElement("div", {
    className: "modal-animate glass-card bg-white/90 dark:bg-slate-800/90 rounded-3xl shadow-2xl w-full max-w-sm p-6 relative z-10 max-h-[85vh] overflow-y-auto"
  }, React.createElement("div", {
    className: "flex justify-between items-center mb-6"
  }, React.createElement("h3", {
    className: "text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "palette",
    className: `w-5 h-5 ${t.text}`
  }), " \u5916\u89C0\u8A2D\u5B9A"), React.createElement("button", {
    onClick: onClose,
    className: "p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-5 h-5 dark:text-slate-300"
  }))), React.createElement("div", {
    className: "space-y-6"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-sm font-bold text-slate-500 dark:text-slate-400 mb-3"
  }, "\u7248\u9762\u6A21\u5F0F"), React.createElement("div", {
    className: "grid grid-cols-3 gap-2 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700"
  }, ['normal', 'minimal', 'custom'].map(mode => React.createElement("button", {
    key: mode,
    onClick: () => setLayoutMode(mode),
    className: `py-2 rounded-lg text-xs font-bold transition-all ${layoutMode === mode ? 'bg-white dark:bg-slate-700 shadow-sm dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`
  }, mode === 'normal' ? '正常' : mode === 'minimal' ? '極簡' : '自定義'))), layoutMode === 'custom' && React.createElement("div", {
    className: "mt-3 space-y-2 p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800"
  }, [{
    key: 'cards',
    label: '狀態卡片'
  }, {
    key: 'timetable',
    label: '流動時間表'
  }, {
    key: 'input',
    label: '新增欄位'
  }, {
    key: 'list',
    label: '任務列表'
  }].map(item => React.createElement("label", {
    key: item.key,
    className: "flex items-center justify-between cursor-pointer group"
  }, React.createElement("span", {
    className: "text-sm font-bold text-slate-600 dark:text-slate-400"
  }, item.label), React.createElement("div", {
    className: "relative w-12 h-7 shrink-0"
  }, React.createElement("input", {
    type: "checkbox",
    className: "sr-only peer",
    checked: customLayout[item.key],
    onChange: () => handleCustomToggle(item.key)
  }), React.createElement("div", {
    className: "absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-indigo-500 transition-colors shadow-inner"
  }), React.createElement("div", {
    className: "absolute top-[2px] left-[2px] bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-[20px] shadow-sm border border-slate-300 dark:border-slate-600"
  })))))), React.createElement("div", null, React.createElement("label", {
    className: "block text-sm font-bold text-slate-500 dark:text-slate-400 mb-3"
  }, "\u4E3B\u984C\u984F\u8272"), React.createElement("div", {
    className: "grid grid-cols-4 gap-3"
  }, Object.entries(THEME_CONFIG).map(_ref8 => {
    let _ref9 = _slicedToArray(_ref8, 2),
      key = _ref9[0],
      config = _ref9[1];
    return React.createElement("button", {
      key: key,
      onClick: () => setThemeColor(key),
      className: `flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${themeColor === key ? `${config.border} ${config.lightBg}` : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`
    }, React.createElement("div", {
      className: `w-6 h-6 rounded-full bg-gradient-to-br ${config.gradient}`
    }), React.createElement("span", {
      className: `text-[10px] font-bold ${themeColor === key ? config.text : 'dark:text-slate-300'}`
    }, config.name));
  }))), React.createElement("div", null, React.createElement("label", {
    className: "block text-sm font-bold text-slate-500 dark:text-slate-400 mb-3"
  }, "\u4ECB\u9762\u6A21\u5F0F"), React.createElement("div", {
    className: "flex bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700"
  }, React.createElement("button", {
    onClick: () => setIsDarkMode(false),
    className: `flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${!isDarkMode ? 'bg-white dark:bg-slate-700 shadow-sm dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`
  }, React.createElement(Icon, {
    name: "sun",
    className: "w-4 h-4 text-orange-500"
  }), " \u6DFA\u8272"), React.createElement("button", {
    onClick: () => setIsDarkMode(true),
    className: `flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${isDarkMode ? 'bg-white dark:bg-slate-700 shadow-sm dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`
  }, React.createElement(Icon, {
    name: "moon",
    className: "w-4 h-4 text-indigo-400"
  }), " \u6DF1\u8272"))))));
}
function NameSetupModal(_ref0) {
  let user = _ref0.user,
    onSave = _ref0.onSave,
    loading = _ref0.loading,
    triggerAlert = _ref0.triggerAlert,
    triggerConfirm = _ref0.triggerConfirm,
    t = _ref0.t;
  const _useState11 = useState((user === null || user === void 0 ? void 0 : user.displayName) || ''),
    _useState12 = _slicedToArray(_useState11, 2),
    name = _useState12[0],
    setName = _useState12[1];
  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim()) {
      triggerAlert("請輸入名字", "error");
      return;
    }
    triggerConfirm(`確定使用這個名字「${name.trim()}」嗎？`, () => {
      onSave(name.trim());
    });
  };
  return React.createElement("div", {
    className: "fixed inset-0 z-[150] flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
  }), React.createElement("div", {
    className: "modal-animate glass-card bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative z-10 text-center border border-slate-100 dark:border-slate-700"
  }, React.createElement("div", {
    className: `w-16 h-16 ${t.lightBg} rounded-full flex items-center justify-center mx-auto mb-4 ${t.text}`
  }, React.createElement(Icon, {
    name: "user",
    className: "w-8 h-8"
  })), React.createElement("h2", {
    className: "text-2xl font-black text-slate-800 dark:text-white mb-2"
  }, "\u500B\u4EBA\u6A21\u5F0F\u8A2D\u5B9A"), React.createElement("p", {
    className: "text-slate-500 dark:text-slate-400 mb-6 text-sm"
  }, "\u8ACB\u8F38\u5165\u4F60\u7684", React.createElement("strong", null, "\u82F1\u6587\u77ED\u540D"), "\uFF0C\u65B9\u4FBF\u8001\u5E2B\u8FA8\u8B58"), React.createElement("form", {
    onSubmit: handleSubmit
  }, React.createElement("input", {
    type: "text",
    className: `w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white text-center font-bold text-lg focus:ring-2 focus:${t.ring} outline-none mb-4`,
    placeholder: "\u540D\u5B57 (\u4F8B\u5982: Peter)",
    value: name,
    onChange: e => setName(e.target.value),
    autoFocus: true,
    required: true
  }), React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: `w-full py-3 rounded-xl text-white font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${t.bg}`
  }, loading ? '設定中...' : '開始使用'))));
}
function JoinClassModal(_ref1) {
  let isOpen = _ref1.isOpen,
    onClose = _ref1.onClose,
    systemClasses = _ref1.systemClasses,
    joinedClasses = _ref1.joinedClasses,
    onJoin = _ref1.onJoin,
    triggerConfirm = _ref1.triggerConfirm,
    t = _ref1.t;
  const _useState13 = useState(''),
    _useState14 = _slicedToArray(_useState13, 2),
    code = _useState14[0],
    setCode = _useState14[1];
  const _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    loading = _useState16[0],
    setLoading = _useState16[1];
  const _useState17 = useState(''),
    _useState18 = _slicedToArray(_useState17, 2),
    floatingError = _useState18[0],
    setFloatingError = _useState18[1];
  if (!isOpen) return null;
  const showError = msg => {
    setFloatingError(msg);
    setTimeout(() => setFloatingError(''), 3000);
  };
  const handleJoin = async e => {
    e.preventDefault();
    const upperCode = code.trim().toUpperCase();
    const targetClass = systemClasses.find(c => c.code === upperCode);
    if (!targetClass) return showError('無效的班級代碼！請確認後再試。');
    if (joinedClasses.includes(upperCode)) return showError('你已經加入過這個班級了！');
    triggerConfirm(`確定要加入【${targetClass.name}】嗎？`, async () => {
      setLoading(true);
      try {
        await onJoin(upperCode, targetClass.name);
        setCode('');
      } catch (err) {
        showError('加入失敗，請重試');
      }
      setLoading(false);
    });
  };
  return React.createElement("div", {
    className: "fixed inset-0 z-[150] flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm",
    onClick: onClose
  }), React.createElement("div", {
    className: "modal-animate glass-card bg-white/90 dark:bg-slate-800/90 rounded-3xl shadow-2xl w-full max-w-sm p-6 relative z-10 text-center border border-white/50"
  }, floatingError && React.createElement("div", {
    className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-5 py-3 rounded-2xl shadow-lg z-50 font-bold text-sm whitespace-nowrap pop-in-error flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "alert-circle",
    className: "w-5 h-5"
  }), floatingError), React.createElement("button", {
    onClick: onClose,
    className: "absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-5 h-5 dark:text-slate-300"
  })), React.createElement("div", {
    className: `w-16 h-16 ${t.lightBg} rounded-full flex items-center justify-center mx-auto mb-4 mt-2 ${t.text}`
  }, React.createElement(Icon, {
    name: "school",
    className: "w-8 h-8"
  })), React.createElement("h2", {
    className: "text-xl font-bold text-slate-800 dark:text-white mb-2"
  }, "\u52A0\u5165\u73ED\u7D1A"), React.createElement("p", {
    className: "text-slate-500 dark:text-slate-400 mb-6 text-sm"
  }, "\u8ACB\u8F38\u5165\u7531\u8001\u5E2B\u63D0\u4F9B\u7684 6 \u4F4D\u6578\u73ED\u7D1A\u4EE3\u78BC"), React.createElement("form", {
    onSubmit: handleJoin
  }, React.createElement("input", {
    type: "text",
    maxLength: 6,
    className: `w-full px-4 py-4 rounded-2xl border ${floatingError ? 'border-red-400 bg-red-50 focus:ring-red-400' : `border-slate-200 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:${t.ring}`} dark:text-white text-center font-mono font-bold text-2xl tracking-[0.5em] outline-none mb-4 uppercase`,
    placeholder: "\u8F38\u5165\u4EE3\u78BC",
    value: code,
    onChange: e => {
      setCode(e.target.value);
      setFloatingError('');
    },
    autoFocus: true,
    required: true
  }), React.createElement("button", {
    type: "submit",
    disabled: loading || code.length !== 6,
    className: `w-full py-3 rounded-xl text-white font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${t.bg}`
  }, loading ? '處理中...' : '確認加入'))));
}
function DatePickerModal(_ref10) {
  let isOpen = _ref10.isOpen,
    value = _ref10.value,
    onSelect = _ref10.onSelect,
    onClose = _ref10.onClose,
    _ref10$title = _ref10.title,
    title = _ref10$title === void 0 ? '選擇日期' : _ref10$title;
  const parseInitial = () => {
    const d = value ? new Date(value) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  };
  const _useState19 = useState(parseInitial()),
    _useState20 = _slicedToArray(_useState19, 2),
    viewDate = _useState20[0],
    setViewDate = _useState20[1];
  useEffect(() => {
    if (isOpen) setViewDate(parseInitial());
  }, [isOpen, value]);
  if (!isOpen) return null;
  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  const first = new Date(y, m, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const selected = value ? new Date(value) : null;
  const days = Array.from({
    length: 42
  }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const toKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const todayKey = toKey(new Date());
  const selectedKey = selected && !isNaN(selected.getTime()) ? toKey(selected) : '';
  return React.createElement("div", {
    className: "fixed inset-0 z-[190] flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-950/60 backdrop-blur-sm",
    onClick: onClose
  }), React.createElement("div", {
    className: "relative z-10 w-full max-w-sm rounded-[2rem] bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700 shadow-2xl p-5 modal-animate"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, React.createElement("div", null, React.createElement("h3", {
    className: "text-lg font-black text-slate-800 dark:text-white"
  }, title), React.createElement("p", {
    className: "text-xs font-bold text-slate-400"
  }, "\u7DB2\u7AD9\u81EA\u88FD\u65E5\u671F\u9762\u677F")), React.createElement("button", {
    type: "button",
    onClick: onClose,
    className: "p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-4 h-4"
  }))), React.createElement("div", {
    className: "flex items-center justify-between mb-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-2"
  }, React.createElement("button", {
    type: "button",
    onClick: () => setViewDate(new Date(y, m - 1, 1)),
    className: "p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-500"
  }, React.createElement(Icon, {
    name: "chevron-left",
    className: "w-4 h-4"
  })), React.createElement("div", {
    className: "font-black text-slate-700 dark:text-slate-100"
  }, y, " \u5E74 ", m + 1, " \u6708"), React.createElement("button", {
    type: "button",
    onClick: () => setViewDate(new Date(y, m + 1, 1)),
    className: "p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-500"
  }, React.createElement(Icon, {
    name: "chevron-right",
    className: "w-4 h-4"
  }))), React.createElement("div", {
    className: "grid grid-cols-7 gap-1 text-center text-[11px] font-black text-slate-400 mb-2"
  }, ['日', '一', '二', '三', '四', '五', '六'].map(d => React.createElement("div", {
    key: d,
    className: "py-1"
  }, d))), React.createElement("div", {
    className: "grid grid-cols-7 gap-1"
  }, days.map(d => {
    const key = toKey(d);
    const inMonth = d.getMonth() === m;
    const isSel = key === selectedKey;
    const isToday = key === todayKey;
    return React.createElement("button", {
      key: key,
      type: "button",
      onClick: () => {
        onSelect(key);
        onClose();
      },
      className: `aspect-square rounded-xl text-sm font-black transition-all ${isSel ? 'bg-indigo-600 text-white shadow-lg scale-105' : isToday ? 'bg-orange-50 text-orange-600 border border-orange-200' : inMonth ? 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600' : 'text-slate-300 dark:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`
    }, d.getDate());
  })), React.createElement("div", {
    className: "grid grid-cols-3 gap-2 mt-4"
  }, [0, 1, 7].map(offset => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return React.createElement("button", {
      key: offset,
      type: "button",
      onClick: () => {
        onSelect(toKey(d));
        onClose();
      },
      className: "py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black hover:bg-indigo-50 hover:text-indigo-600"
    }, offset === 0 ? '今日' : offset === 1 ? '聽日' : '一星期後');
  }))));
}
function TimePickerModal(_ref11) {
  let isOpen = _ref11.isOpen,
    value = _ref11.value,
    onSelect = _ref11.onSelect,
    onClose = _ref11.onClose,
    _ref11$title = _ref11.title,
    title = _ref11$title === void 0 ? '選擇時間' : _ref11$title;
  const _useState21 = useState(value ? value.split(':')[0] : '08'),
    _useState22 = _slicedToArray(_useState21, 2),
    hour = _useState22[0],
    setHour = _useState22[1];
  const _useState23 = useState(value ? value.split(':')[1] : '00'),
    _useState24 = _slicedToArray(_useState23, 2),
    minute = _useState24[0],
    setMinute = _useState24[1];
  useEffect(() => {
    if (isOpen && value) {
      const _value$split = value.split(':'),
        _value$split2 = _slicedToArray(_value$split, 2),
        h = _value$split2[0],
        m = _value$split2[1];
      setHour(h || '08');
      setMinute(m || '00');
    }
  }, [isOpen, value]);
  if (!isOpen) return null;
  const hours = Array.from({
    length: 16
  }, (_, i) => String(i + 6).padStart(2, '0'));
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  const confirm = () => {
    onSelect(`${hour}:${minute}`);
    onClose();
  };
  return React.createElement("div", {
    className: "fixed inset-0 z-[190] flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-950/60 backdrop-blur-sm",
    onClick: onClose
  }), React.createElement("div", {
    className: "relative z-10 w-full max-w-md rounded-[2rem] bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700 shadow-2xl p-5 modal-animate"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, React.createElement("div", null, React.createElement("h3", {
    className: "text-lg font-black text-slate-800 dark:text-white"
  }, title), React.createElement("p", {
    className: "text-xs font-bold text-slate-400"
  }, "\u7DB2\u7AD9\u81EA\u88FD\u6642\u9593\u9762\u677F")), React.createElement("button", {
    type: "button",
    onClick: onClose,
    className: "p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-4 h-4"
  }))), React.createElement("div", {
    className: "text-center py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-3xl tracking-widest shadow-lg mb-4"
  }, hour, ":", minute), React.createElement("div", {
    className: "grid grid-cols-[1fr_1fr] gap-4"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-[10px] font-black text-slate-400 uppercase mb-2 ml-1"
  }, "\u5C0F\u6642"), React.createElement("div", {
    className: "grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto scrollbar-hide pr-1"
  }, hours.map(h => React.createElement("button", {
    key: h,
    type: "button",
    onClick: () => setHour(h),
    className: `py-2 rounded-xl text-sm font-black transition-all ${hour === h ? 'bg-indigo-600 text-white shadow' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600'}`
  }, h)))), React.createElement("div", null, React.createElement("div", {
    className: "text-[10px] font-black text-slate-400 uppercase mb-2 ml-1"
  }, "\u5206\u9418"), React.createElement("div", {
    className: "grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto scrollbar-hide pr-1"
  }, minutes.map(m => React.createElement("button", {
    key: m,
    type: "button",
    onClick: () => setMinute(m),
    className: `py-2 rounded-xl text-sm font-black transition-all ${minute === m ? 'bg-indigo-600 text-white shadow' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600'}`
  }, m))))), React.createElement("button", {
    type: "button",
    onClick: confirm,
    className: "w-full mt-5 py-3 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 active:scale-95 transition-all"
  }, "\u5957\u7528\u6642\u9593")));
}
function EditModal(_ref12) {
  let item = _ref12.item,
    onClose = _ref12.onClose,
    onSave = _ref12.onSave,
    triggerAlert = _ref12.triggerAlert,
    triggerConfirm = _ref12.triggerConfirm,
    subjects = _ref12.subjects;
  const _useState25 = useState(item.description || ''),
    _useState26 = _slicedToArray(_useState25, 2),
    description = _useState26[0],
    setDescription = _useState26[1];
  const _useState27 = useState(item.subject || '其他'),
    _useState28 = _slicedToArray(_useState27, 2),
    subject = _useState28[0],
    setSubject = _useState28[1];
  const _useState29 = useState(item.dueDate || ''),
    _useState30 = _slicedToArray(_useState29, 2),
    dueDate = _useState30[0],
    setDueDate = _useState30[1];
  const _useState31 = useState(item.priority || 'normal'),
    _useState32 = _slicedToArray(_useState31, 2),
    priority = _useState32[0],
    setPriority = _useState32[1];
  const _useState33 = useState(false),
    _useState34 = _slicedToArray(_useState33, 2),
    isDatePickerOpen = _useState34[0],
    setIsDatePickerOpen = _useState34[1];
  const _useState35 = useState(false),
    _useState36 = _slicedToArray(_useState35, 2),
    loading = _useState36[0],
    setLoading = _useState36[1];
  const handleSubjectSelect = subjectName => setSubject(subjectName);
  const handleSave = async e => {
    e.preventDefault();
    triggerConfirm("確定要儲存修改嗎？", async () => {
      setLoading(true);
      try {
        await onSave(item.id, {
          description: description.trim(),
          subject,
          dueDate,
          priority
        });
        onClose();
      } catch (error) {
        triggerAlert("更新失敗", "error");
      } finally {
        setLoading(false);
      }
    });
  };
  return React.createElement("div", {
    className: "fixed inset-0 z-[110] flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm",
    onClick: onClose
  }), React.createElement("div", {
    className: "modal-animate glass-card bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 overflow-hidden border border-white/50"
  }, React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, React.createElement("h3", {
    className: "text-xl font-bold text-slate-800 dark:text-white"
  }, "\u4FEE\u6539\u7D00\u9304"), React.createElement("button", {
    onClick: onClose,
    className: "p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-5 h-5 text-slate-500 dark:text-slate-400"
  }))), React.createElement("form", {
    onSubmit: handleSave,
    className: "space-y-4"
  }, React.createElement("div", null, React.createElement("label", {
    className: "block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2"
  }, "\u79D1\u76EE"), React.createElement("div", {
    className: "flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
  }, subjects.map(sub => React.createElement("button", {
    key: sub.name,
    type: "button",
    onClick: () => handleSubjectSelect(sub.name),
    className: `flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${subject === sub.name ? sub.color + ' ring-2 ring-indigo-100 dark:ring-indigo-900' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`
  }, sub.name)))), React.createElement("div", null, React.createElement("label", {
    className: "block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1"
  }, "\u5167\u5BB9"), React.createElement("textarea", {
    value: description,
    onChange: e => setDescription(e.target.value),
    rows: "3",
    className: "w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all p-3 border text-slate-700 dark:text-slate-200 text-sm outline-none",
    required: true
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1"
  }, "\u7E73\u4EA4/\u8003\u8A66\u65E5\u671F"), React.createElement("button", {
    type: "button",
    onClick: () => setIsDatePickerOpen(true),
    className: `w-full h-11 rounded-xl border text-left px-3 text-sm font-bold transition-all flex items-center justify-between ${dueDate ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:border-indigo-300'}`
  }, React.createElement("span", null, dueDate ? formatDueDate(dueDate) : '選擇日期'), React.createElement(Icon, {
    name: "calendar",
    className: "w-4 h-4"
  }))), React.createElement("div", null, React.createElement("label", {
    className: "block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2"
  }, "\u91CD\u8981\u7A0B\u5EA6"), React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, [{
    value: 'low',
    label: '稍後',
    icon: 'circle-dot'
  }, {
    value: 'normal',
    label: '一般',
    icon: 'minus'
  }, {
    value: 'high',
    label: '重要',
    icon: 'flame'
  }].map(option => React.createElement("button", {
    key: option.value,
    type: "button",
    onClick: () => setPriority(option.value),
    className: `h-11 rounded-xl border text-sm font-black flex items-center justify-center gap-1.5 transition-all ${priority === option.value ? option.value === 'high' ? 'bg-rose-500 border-rose-500 text-white' : option.value === 'low' ? 'bg-sky-500 border-sky-500 text-white' : 'bg-slate-800 border-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'}`
  }, React.createElement(Icon, {
    name: option.icon,
    className: "w-4 h-4"
  }), option.label)))), React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
  }, loading ? '儲存中...' : React.createElement(React.Fragment, null, React.createElement(Icon, {
    name: "save",
    className: "w-4 h-4"
  }), " \u5132\u5B58\u4FEE\u6539"))), React.createElement(DatePickerModal, {
    isOpen: isDatePickerOpen,
    value: dueDate,
    onSelect: setDueDate,
    onClose: () => setIsDatePickerOpen(false),
    title: "\u9078\u64C7\u7E73\u4EA4 / \u8003\u8A66\u65E5\u671F"
  })));
}
function SubjectSelectionModal(_ref13) {
  let onClose = _ref13.onClose,
    onSelect = _ref13.onSelect,
    subjects = _ref13.subjects;
  return React.createElement("div", {
    className: "fixed inset-0 z-[160] flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm",
    onClick: onClose
  }), React.createElement("div", {
    className: "modal-animate glass-card bg-white/95 dark:bg-slate-800/95 rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative z-10 flex flex-col max-h-[80vh]"
  }, React.createElement("div", {
    className: "flex justify-between items-center mb-6"
  }, React.createElement("h3", {
    className: "text-2xl font-bold text-slate-800 dark:text-white"
  }, "\u9078\u64C7\u79D1\u76EE"), React.createElement("button", {
    onClick: onClose,
    className: "p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-6 h-6 text-slate-500 dark:text-slate-400"
  }))), React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto p-1"
  }, React.createElement("button", {
    onClick: () => onSelect(""),
    className: "p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 flex flex-col items-center justify-center gap-2 min-h-[80px]"
  }, React.createElement(Icon, {
    name: "minus-circle",
    className: "w-6 h-6"
  }), "\u7A7A\u5802"), subjects.map(sub => React.createElement("button", {
    key: sub.name,
    onClick: () => onSelect(sub.name),
    className: `p-4 rounded-2xl border-2 font-bold shadow-sm hover:scale-[1.02] flex flex-col items-center justify-center gap-2 min-h-[80px] ${sub.color}`
  }, React.createElement("span", {
    className: "text-lg"
  }, sub.name))))));
}
function SubjectManagerModal(_ref14) {
  let isOpen = _ref14.isOpen,
    onClose = _ref14.onClose,
    currentSubjects = _ref14.currentSubjects,
    onSave = _ref14.onSave,
    triggerConfirm = _ref14.triggerConfirm,
    triggerAlert = _ref14.triggerAlert,
    _ref14$usageCounts = _ref14.usageCounts,
    usageCounts = _ref14$usageCounts === void 0 ? {} : _ref14$usageCounts;
  const _useState37 = useState(''),
    _useState38 = _slicedToArray(_useState37, 2),
    newSubjectName = _useState38[0],
    setNewSubjectName = _useState38[1];
  const _useState39 = useState(COLOR_PALETTE[0].value),
    _useState40 = _slicedToArray(_useState39, 2),
    newSubjectColor = _useState40[0],
    setNewSubjectColor = _useState40[1];
  const _useState41 = useState(() => currentSubjects.map(subject => ({
      ...subject,
      originalName: subject.name
    }))),
    _useState42 = _slicedToArray(_useState41, 2),
    tempSubjects = _useState42[0],
    setTempSubjects = _useState42[1];
  const _useState43 = useState(null),
    _useState44 = _slicedToArray(_useState43, 2),
    editingColorIndex = _useState44[0],
    setEditingColorIndex = _useState44[1];
  const cleanSubjects = tempSubjects.map(_ref15 => {
    let originalName = _ref15.originalName,
      subject = _objectWithoutProperties(_ref15, _excluded);
    return {
      ...subject,
      name: subject.name.trim()
    };
  });
  const hasChanges = JSON.stringify(cleanSubjects) !== JSON.stringify(currentSubjects);
  const requestClose = () => {
    if (!hasChanges) {
      onClose();
      return;
    }
    triggerConfirm('你有未儲存的科目變更，確定離開嗎？', onClose);
  };
  useEffect(() => {
    if (!isOpen) return;
    setTempSubjects(currentSubjects.map(subject => ({
      ...subject,
      originalName: subject.name
    })));
    setNewSubjectName('');
    setNewSubjectColor(COLOR_PALETTE[0].value);
    setEditingColorIndex(null);
  }, [isOpen, currentSubjects]);
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') requestClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, tempSubjects, currentSubjects]);
  if (!isOpen) return null;
  const updateSubject = (index, patch) => setTempSubjects(previous => previous.map((subject, subjectIndex) => subjectIndex === index ? {
    ...subject,
    ...patch
  } : subject));
  const handleAdd = event => {
    event.preventDefault();
    const name = newSubjectName.trim();
    if (!name) return;
    if (tempSubjects.some(subject => subject.name.trim().toLowerCase() === name.toLowerCase())) {
      triggerAlert('科目名稱重複', 'error');
      return;
    }
    setTempSubjects(previous => [...previous, {
      name,
      color: newSubjectColor,
      originalName: null
    }]);
    setNewSubjectName('');
  };
  const handleDelete = index => {
    if (tempSubjects.length <= 1) {
      triggerAlert('最少要保留一個科目', 'error');
      return;
    }
    const target = tempSubjects[index];
    const count = usageCounts[target.originalName || target.name] || 0;
    const extra = count > 0 ? `，現有 ${count} 份紀錄仍會保留原有科目名稱` : '';
    triggerConfirm(`確定要移除「${target.name || '未命名科目'}」${extra}嗎？`, () => setTempSubjects(previous => previous.filter((_, subjectIndex) => subjectIndex !== index)));
  };
  const moveSubject = (index, direction) => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= tempSubjects.length) return;
    setTempSubjects(previous => {
      const next = [...previous];
      var _ref16 = [next[nextIndex], next[index]];
      next[index] = _ref16[0];
      next[nextIndex] = _ref16[1];
      return next;
    });
  };
  const handleCommonSort = () => {
    const priority = ['中文', '英文', '數學', '常識', '公社', '通識', '物理', '化學', '生物', '歷史', '地理', '電腦', '其他'];
    setTempSubjects(previous => [...previous].sort((a, b) => {
      const indexA = priority.indexOf(a.name.trim());
      const indexB = priority.indexOf(b.name.trim());
      if (indexA !== -1 || indexB !== -1) return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      return a.name.localeCompare(b.name, 'zh-HK');
    }));
  };
  const handleSave = () => {
    const normalized = cleanSubjects.filter(subject => subject.name);
    if (normalized.length !== cleanSubjects.length) {
      triggerAlert('科目名稱不可留空', 'error');
      return;
    }
    const normalizedNames = normalized.map(subject => subject.name.toLowerCase());
    if (new Set(normalizedNames).size !== normalizedNames.length) {
      triggerAlert('科目名稱不可重複', 'error');
      return;
    }
    const renameMap = {};
    tempSubjects.forEach(subject => {
      const newName = subject.name.trim();
      if (subject.originalName && subject.originalName !== newName) renameMap[subject.originalName] = newName;
    });
    triggerConfirm('確定儲存科目名稱、顏色及次序嗎？', async () => {
      const saved = await onSave(normalized, renameMap);
      if (saved !== false) onClose();
    });
  };
  return React.createElement("div", {
    className: "fixed inset-0 z-[180] flex items-center justify-center p-2 sm:p-5",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "subject-manager-title"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-950/65 backdrop-blur-md motion-scrim",
    onClick: requestClose
  }), React.createElement("div", {
    className: "modal-animate relative z-10 w-full max-w-4xl max-h-[92dvh] overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem] bg-slate-50/98 dark:bg-slate-950/98 border border-white/60 dark:border-slate-700 shadow-[0_35px_110px_-30px_rgba(2,6,23,.9)] flex flex-col"
  }, React.createElement("div", {
    className: "relative overflow-hidden shrink-0 px-5 py-5 sm:px-7 sm:py-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 text-white"
  }, React.createElement("div", {
    className: "absolute -right-12 -top-20 w-52 h-52 rounded-full bg-cyan-300/15 blur-3xl"
  }), React.createElement("div", {
    className: "relative flex items-start justify-between gap-4"
  }, React.createElement("div", {
    className: "flex items-center gap-3 min-w-0"
  }, React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-white/15 border border-white/20 grid place-items-center shrink-0"
  }, React.createElement(Icon, {
    name: "book-marked",
    className: "w-6 h-6"
  })), React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "text-xs font-black tracking-widest text-indigo-200 uppercase"
  }, "Subjects"), React.createElement("h3", {
    id: "subject-manager-title",
    className: "text-xl sm:text-2xl font-black mt-0.5"
  }, "\u79D1\u76EE\u7BA1\u7406"), React.createElement("p", {
    className: "text-xs sm:text-sm font-bold text-indigo-100 mt-1"
  }, "\u65B0\u589E\u3001\u6539\u540D\u3001\u6539\u8272\u53CA\u5B89\u6392\u986F\u793A\u6B21\u5E8F"))), React.createElement("button", {
    type: "button",
    onClick: requestClose,
    "aria-label": "\u95DC\u9589\u79D1\u76EE\u7BA1\u7406",
    className: "w-11 h-11 rounded-2xl bg-white/10 border border-white/15 grid place-items-center hover:bg-white/20 active:scale-95 transition-all"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-5 h-5"
  })))), React.createElement("div", {
    className: "min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"
  }, React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-[18rem_minmax(0,1fr)] gap-4 sm:gap-5 items-start"
  }, React.createElement("form", {
    onSubmit: handleAdd,
    className: "md:sticky md:top-0 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 p-4 shadow-sm"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-3"
  }, React.createElement("div", {
    className: "w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 grid place-items-center"
  }, React.createElement(Icon, {
    name: "plus",
    className: "w-4 h-4"
  })), React.createElement("div", null, React.createElement("h4", {
    className: "text-sm font-black text-slate-800 dark:text-white"
  }, "\u65B0\u589E\u79D1\u76EE"), React.createElement("p", {
    className: "text-xs font-bold text-slate-400"
  }, "\u5148\u8F38\u5165\u540D\u7A31\uFF0C\u518D\u63C0\u984F\u8272"))), React.createElement("label", {
    className: "block text-xs font-black text-slate-500 dark:text-slate-400 mb-1.5"
  }, "\u79D1\u76EE\u540D\u7A31"), React.createElement("input", {
    type: "text",
    maxLength: "16",
    value: newSubjectName,
    onChange: event => setNewSubjectName(event.target.value),
    className: "w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400",
    placeholder: "\u4F8B\u5982\uFF1A\u97F3\u6A02"
  }), React.createElement("div", {
    className: "mt-4 text-xs font-black text-slate-500 dark:text-slate-400"
  }, "\u79D1\u76EE\u984F\u8272"), React.createElement("div", {
    className: "grid grid-cols-6 gap-2 mt-2"
  }, COLOR_PALETTE.map(color => React.createElement("button", {
    key: color.label,
    type: "button",
    title: color.label,
    "aria-label": `選擇${color.label}色`,
    onClick: () => setNewSubjectColor(color.value),
    className: `h-8 rounded-xl border-2 ${color.value} ${newSubjectColor === color.value ? 'ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900 opacity-100' : 'border-transparent opacity-[.55] hover:opacity-100'}`
  }))), React.createElement("button", {
    type: "submit",
    disabled: !newSubjectName.trim(),
    className: "w-full mt-4 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/50 dark:shadow-none disabled:opacity-40 disabled:shadow-none active:scale-[.98] transition-all"
  }, React.createElement(Icon, {
    name: "plus",
    className: "w-4 h-4"
  }), "\u52A0\u5165\u79D1\u76EE"), React.createElement("button", {
    type: "button",
    onClick: () => {
      setTempSubjects(DEFAULT_SUBJECTS.map(subject => {
        var _currentSubjects$find;
        return {
          ...subject,
          originalName: ((_currentSubjects$find = currentSubjects.find(item => item.name === subject.name)) === null || _currentSubjects$find === void 0 ? void 0 : _currentSubjects$find.name) || null
        };
      }));
      setEditingColorIndex(null);
    },
    className: "w-full mt-2 h-10 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
  }, "\u56DE\u5FA9\u9810\u8A2D\u79D1\u76EE")), React.createElement("section", {
    className: "min-w-0 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 p-4 shadow-sm"
  }, React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3 mb-4"
  }, React.createElement("div", null, React.createElement("h4", {
    className: "text-sm font-black text-slate-800 dark:text-white"
  }, "\u73FE\u6709\u79D1\u76EE ", React.createElement("span", {
    className: "text-indigo-500"
  }, tempSubjects.length)), React.createElement("p", {
    className: "text-xs font-bold text-slate-400 mt-0.5"
  }, "\u76F4\u63A5\u4FEE\u6539\u540D\u7A31\uFF1B\u6309\u8272\u9EDE\u53EF\u66F4\u63DB\u984F\u8272")), React.createElement("button", {
    type: "button",
    onClick: handleCommonSort,
    className: "h-9 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/[0.25] text-indigo-600 dark:text-indigo-300 text-xs font-black flex items-center gap-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 active:scale-95 transition-all"
  }, React.createElement(Icon, {
    name: "list-restart",
    className: "w-4 h-4"
  }), "\u5E38\u7528\u6B21\u5E8F")), React.createElement("div", {
    className: "space-y-2.5"
  }, tempSubjects.map((subject, index) => React.createElement("div", {
    key: `${subject.originalName || 'new'}-${index}`,
    className: "rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/[0.45] p-3 transition-all hover:border-indigo-200 dark:hover:border-indigo-800"
  }, React.createElement("div", {
    className: "grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2.5 items-center"
  }, React.createElement("button", {
    type: "button",
    onClick: () => setEditingColorIndex(editingColorIndex === index ? null : index),
    "aria-label": `更改${subject.name || '未命名科目'}顏色`,
    className: `w-10 h-10 rounded-xl border-2 grid place-items-center font-black text-sm ${subject.color}`
  }, React.createElement(Icon, {
    name: "palette",
    className: "w-4 h-4"
  })), React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("input", {
    type: "text",
    maxLength: "16",
    value: subject.name,
    onChange: event => updateSubject(index, {
      name: event.target.value
    }),
    className: "w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-800 dark:text-white outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10",
    "aria-label": `第 ${index + 1} 個科目名稱`
  }), React.createElement("div", {
    className: "text-[11px] font-bold text-slate-400 mt-1 px-1"
  }, usageCounts[subject.originalName || subject.name] || 0, " \u4EFD\u7D00\u9304")), React.createElement("div", {
    className: "flex items-center gap-0.5"
  }, React.createElement("button", {
    type: "button",
    onClick: () => moveSubject(index, 'up'),
    disabled: index === 0,
    "aria-label": "\u5411\u4E0A\u79FB",
    className: "w-8 h-8 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 disabled:opacity-20"
  }, React.createElement(Icon, {
    name: "chevron-up",
    className: "w-4 h-4 mx-auto"
  })), React.createElement("button", {
    type: "button",
    onClick: () => moveSubject(index, 'down'),
    disabled: index === tempSubjects.length - 1,
    "aria-label": "\u5411\u4E0B\u79FB",
    className: "w-8 h-8 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 disabled:opacity-20"
  }, React.createElement(Icon, {
    name: "chevron-down",
    className: "w-4 h-4 mx-auto"
  })), React.createElement("button", {
    type: "button",
    onClick: () => handleDelete(index),
    "aria-label": "\u79FB\u9664\u79D1\u76EE",
    className: "w-8 h-8 rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500"
  }, React.createElement(Icon, {
    name: "trash-2",
    className: "w-4 h-4 mx-auto"
  })))), editingColorIndex === index && React.createElement("div", {
    className: "grid grid-cols-6 sm:grid-cols-9 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700"
  }, COLOR_PALETTE.map(color => React.createElement("button", {
    key: color.label,
    type: "button",
    title: color.label,
    "aria-label": `改為${color.label}色`,
    onClick: () => {
      updateSubject(index, {
        color: color.value
      });
      setEditingColorIndex(null);
    },
    className: `h-8 rounded-xl border-2 ${color.value} ${subject.color === color.value ? 'ring-2 ring-indigo-400 ring-offset-1 dark:ring-offset-slate-950' : 'border-transparent opacity-60 hover:opacity-100'}`
  }))))))))), React.createElement("div", {
    className: "shrink-0 px-4 py-4 sm:px-6 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex items-center justify-between gap-3"
  }, React.createElement("div", {
    className: `hidden sm:flex items-center gap-2 text-xs font-black ${hasChanges ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-300'}`
  }, React.createElement("span", {
    className: `w-2 h-2 rounded-full ${hasChanges ? 'bg-amber-500' : 'bg-emerald-500'}`
  }), hasChanges ? '有未儲存變更' : '全部變更已儲存'), React.createElement("div", {
    className: "flex gap-2 w-full sm:w-auto"
  }, React.createElement("button", {
    type: "button",
    onClick: requestClose,
    className: "flex-1 sm:flex-none h-11 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-black"
  }, "\u53D6\u6D88"), React.createElement("button", {
    type: "button",
    onClick: handleSave,
    disabled: !hasChanges,
    className: "flex-[1.5] sm:flex-none h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/60 dark:shadow-none disabled:opacity-40 disabled:shadow-none active:scale-[.98] transition-all"
  }, React.createElement(Icon, {
    name: "save",
    className: "w-4 h-4"
  }), "\u5132\u5B58\u8B8A\u66F4")))));
}
function SlotTypeSelector(_ref17) {
  let value = _ref17.value,
    onChange = _ref17.onChange;
  const types = [{
    id: 'lesson',
    label: '課堂',
    icon: 'book-open'
  }, {
    id: 'break',
    label: '小息',
    icon: 'coffee'
  }, {
    id: 'lunch',
    label: '午膳',
    icon: 'utensils'
  }];
  return React.createElement("div", {
    className: "flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl"
  }, types.map(t => React.createElement("button", {
    key: t.id,
    onClick: () => onChange(t.id),
    className: `flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${value === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`
  }, React.createElement(Icon, {
    name: t.icon,
    className: "w-3 h-3"
  }), " ", t.label)));
}
function TimetableEditor(_ref18) {
  var _timeSlots$editingTim;
  let initialConfig = _ref18.initialConfig,
    onSave = _ref18.onSave,
    onCancel = _ref18.onCancel,
    subjects = _ref18.subjects,
    triggerConfirm = _ref18.triggerConfirm,
    triggerAlert = _ref18.triggerAlert;
  const _useState45 = useState('slots'),
    _useState46 = _slicedToArray(_useState45, 2),
    activeTab = _useState46[0],
    setActiveTab = _useState46[1];
  const _useState47 = useState((initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.timeSlots) || [...DEFAULT_TIME_SLOTS]),
    _useState48 = _slicedToArray(_useState47, 2),
    timeSlots = _useState48[0],
    setTimeSlots = _useState48[1];
  const _useState49 = useState((initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.schedule) || {
      ...DEFAULT_SCHEDULE
    }),
    _useState50 = _slicedToArray(_useState49, 2),
    schedule = _useState50[0],
    setSchedule = _useState50[1];
  const _useState51 = useState(1),
    _useState52 = _slicedToArray(_useState51, 2),
    editDay = _useState52[0],
    setEditDay = _useState52[1];
  const _useState53 = useState(null),
    _useState54 = _slicedToArray(_useState53, 2),
    editingCell = _useState54[0],
    setEditingCell = _useState54[1];
  const _useState55 = useState(null),
    _useState56 = _slicedToArray(_useState55, 2),
    editingTimeIndex = _useState56[0],
    setEditingTimeIndex = _useState56[1];
  const initialSnapshot = useMemo(() => JSON.stringify({
    timeSlots: (initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.timeSlots) || DEFAULT_TIME_SLOTS,
    schedule: (initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.schedule) || DEFAULT_SCHEDULE
  }), []);
  const isDirty = useMemo(() => JSON.stringify({
    timeSlots,
    schedule
  }) !== initialSnapshot, [timeSlots, schedule, initialSnapshot]);
  const remapScheduleForSlots = (oldSlots, newSlots, currentSchedule) => {
    const oldLessonIds = oldSlots.filter(slot => slot.type === 'lesson').map(slot => slot.id);
    const newLessonIds = newSlots.filter(slot => slot.type === 'lesson').map(slot => slot.id);
    const nextSchedule = {};
    [1, 2, 3, 4, 5].forEach(day => {
      const subjectsBySlot = {};
      oldLessonIds.forEach((slotId, lessonIndex) => {
        var _currentSchedule$day;
        subjectsBySlot[slotId] = (currentSchedule === null || currentSchedule === void 0 || (_currentSchedule$day = currentSchedule[day]) === null || _currentSchedule$day === void 0 ? void 0 : _currentSchedule$day[lessonIndex]) || '';
      });
      nextSchedule[day] = newLessonIds.map(slotId => subjectsBySlot[slotId] || '');
    });
    return nextSchedule;
  };
  const handleSlotChange = (index, field, value) => {
    const newSlots = [...timeSlots];
    newSlots[index] = {
      ...newSlots[index],
      [field]: value
    };
    if (field === 'type') setSchedule(remapScheduleForSlots(timeSlots, newSlots, schedule));
    setTimeSlots(newSlots);
  };
  const addSlot = () => setTimeSlots([...timeSlots, {
    id: 's' + Date.now(),
    label: '新課節',
    type: 'lesson',
    startTime: '08:00',
    duration: 35
  }]);
  const removeSlot = index => {
    const newSlots = timeSlots.filter((_, i) => i !== index);
    setSchedule(remapScheduleForSlots(timeSlots, newSlots, schedule));
    setTimeSlots(newSlots);
  };
  const moveSlot = (index, direction) => {
    const newSlots = [...timeSlots];
    if (direction === 'up' && index > 0) {
      var _ref19 = [newSlots[index - 1], newSlots[index]];
      newSlots[index] = _ref19[0];
      newSlots[index - 1] = _ref19[1];
    } else if (direction === 'down' && index < newSlots.length - 1) {
      var _ref20 = [newSlots[index + 1], newSlots[index]];
      newSlots[index] = _ref20[0];
      newSlots[index + 1] = _ref20[1];
    } else return;
    setSchedule(remapScheduleForSlots(timeSlots, newSlots, schedule));
    setTimeSlots(newSlots);
  };
  const resetTimetable = () => {
    setTimeSlots(JSON.parse(JSON.stringify(DEFAULT_TIME_SLOTS)));
    setSchedule(JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)));
  };
  const requestCancel = () => {
    if (!isDirty) {
      onCancel();
      return;
    }
    triggerConfirm('你有尚未儲存的時間表修改，確定要離開嗎？', onCancel);
  };
  const requestSave = () => {
    if (!timeSlots.length) {
      triggerAlert('請至少保留一個時間段', 'error');
      return;
    }
    if (timeSlots.some(slot => {
      var _slot$label;
      return !slot.startTime || !((_slot$label = slot.label) !== null && _slot$label !== void 0 && _slot$label.trim()) || Number(slot.duration) <= 0;
    })) {
      triggerAlert('請檢查每個時間段的時間、名稱及分鐘數', 'error');
      return;
    }
    const uniqueTimes = new Set(timeSlots.map(slot => slot.startTime));
    if (uniqueTimes.size !== timeSlots.length) {
      triggerAlert('開始時間不可重複', 'error');
      return;
    }
    triggerConfirm('確定要儲存時間表設定嗎？', () => onSave({
      timeSlots,
      schedule
    }));
  };
  const handleSubjectSelect = subjectName => {
    if (editingCell) {
      const day = editingCell.day,
        lessonIndex = editingCell.lessonIndex;
      const newSchedule = {
        ...schedule
      };
      if (!newSchedule[day]) newSchedule[day] = [];
      while (newSchedule[day].length <= lessonIndex) newSchedule[day].push("");
      newSchedule[day][lessonIndex] = subjectName;
      setSchedule(newSchedule);
      setEditingCell(null);
    }
  };
  const lessonSlots = timeSlots.map((s, i) => ({
    ...s,
    originalIndex: i
  })).filter(s => s.type === 'lesson');
  return React.createElement("div", {
    className: "timetable-editor-panel glass-card bg-white/95 dark:bg-slate-900/95 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[68vh] max-h-[calc(100vh-10rem)] max-w-4xl mx-auto relative z-10 mt-3 sm:mt-6"
  }, React.createElement("div", {
    className: "p-5 sm:p-6 flex justify-between items-center gap-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 text-white"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("div", {
    className: "w-10 h-10 rounded-2xl bg-white/10 border border-white/15 grid place-items-center"
  }, React.createElement(Icon, {
    name: "calendar-cog",
    className: "w-5 h-5 text-indigo-200"
  })), React.createElement("div", null, React.createElement("h2", {
    className: "text-xl font-black"
  }, "\u7DE8\u8F2F\u6642\u9593\u8868"), React.createElement("p", {
    className: "text-xs sm:text-sm font-bold text-indigo-200 mt-0.5"
  }, "\u5148\u8A2D\u5B9A\u6642\u9593\uFF0C\u518D\u7DE8\u6392\u661F\u671F\u4E00\u81F3\u4E94\u8AB2\u7A0B"))), isDirty && React.createElement("div", {
    className: "inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-300/20 text-amber-200 text-xs font-black"
  }, React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-amber-300"
  }), "\u5C1A\u672A\u5132\u5B58")), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    type: "button",
    onClick: () => triggerConfirm("確定要重置為預設時間表嗎？", resetTimetable),
    className: "h-10 px-3 rounded-xl text-xs font-black text-white bg-white/10 border border-white/15 hover:bg-white/20"
  }, "\u91CD\u7F6E"), React.createElement("button", {
    type: "button",
    onClick: requestCancel,
    "aria-label": "\u95DC\u9589\u7DE8\u8F2F\u6642\u9593\u8868",
    className: "w-10 h-10 grid place-items-center rounded-xl text-white bg-white/10 border border-white/15 hover:bg-white/20"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-5 h-5"
  })))), React.createElement("div", {
    className: "grid grid-cols-2 gap-2 m-4 mb-0 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800"
  }, React.createElement("button", {
    type: "button",
    onClick: () => setActiveTab('slots'),
    className: `h-11 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'slots' ? 'text-indigo-600 dark:text-indigo-300 bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`
  }, React.createElement("span", {
    className: "w-6 h-6 rounded-lg bg-current/10 grid place-items-center text-xs"
  }, "1"), "\u6642\u9593\u8A2D\u5B9A"), React.createElement("button", {
    type: "button",
    onClick: () => setActiveTab('schedule'),
    className: `h-11 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'schedule' ? 'text-indigo-600 dark:text-indigo-300 bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`
  }, React.createElement("span", {
    className: "w-6 h-6 rounded-lg bg-current/10 grid place-items-center text-xs"
  }, "2"), "\u8AB2\u7A0B\u7DE8\u6392")), React.createElement("div", {
    className: "flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-950/30 scrollbar-hide"
  }, activeTab === 'slots' ? React.createElement("div", {
    key: "slots",
    className: "tab-panel-motion space-y-3"
  }, timeSlots.map((slot, index) => React.createElement("div", {
    key: slot.id || index,
    style: {
      animationDelay: `${Math.min(index, 10) * 0.045}s`
    },
    className: "timetable-slot-card motion-list-item flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
  }, React.createElement("div", {
    className: "w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 grid place-items-center text-xs font-black shrink-0"
  }, index + 1), React.createElement("div", {
    className: "flex flex-col gap-1 mr-2"
  }, React.createElement("button", {
    onClick: () => moveSlot(index, 'up'),
    disabled: index === 0,
    className: "p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-20 active:scale-90"
  }, React.createElement(Icon, {
    name: "chevron-up",
    className: "w-4 h-4"
  })), React.createElement("button", {
    onClick: () => moveSlot(index, 'down'),
    disabled: index === timeSlots.length - 1,
    className: "p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-20 active:scale-90"
  }, React.createElement(Icon, {
    name: "chevron-down",
    className: "w-4 h-4"
  }))), React.createElement("button", {
    type: "button",
    onClick: () => setEditingTimeIndex(index),
    className: "w-24 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-black flex items-center justify-center gap-1"
  }, React.createElement(Icon, {
    name: "clock",
    className: "w-3.5 h-3.5 text-indigo-500"
  }), slot.startTime), React.createElement("div", {
    className: "flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2 rounded-lg border border-slate-200 dark:border-slate-700"
  }, React.createElement("input", {
    type: "number",
    value: slot.duration,
    onChange: e => handleSlotChange(index, 'duration', parseInt(e.target.value) || 0),
    className: "w-12 p-2 bg-transparent text-sm text-center outline-none text-slate-800 dark:text-white"
  }), React.createElement("span", {
    className: "text-xs text-slate-500 pr-1"
  }, "\u5206")), React.createElement("div", {
    className: "min-w-[180px]"
  }, React.createElement(SlotTypeSelector, {
    value: slot.type,
    onChange: val => handleSlotChange(index, 'type', val)
  })), React.createElement("input", {
    type: "text",
    value: slot.label,
    onChange: e => handleSlotChange(index, 'label', e.target.value),
    className: "flex-1 min-w-[100px] p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500",
    placeholder: "\u6A19\u7C64"
  }), React.createElement("button", {
    type: "button",
    onClick: () => removeSlot(index),
    "aria-label": `刪除${slot.label || '時間段'}`,
    className: "w-10 h-10 grid place-items-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
  }, React.createElement(Icon, {
    name: "trash-2",
    className: "w-4 h-4"
  })))), React.createElement("button", {
    type: "button",
    onClick: addSlot,
    className: "w-full min-h-12 py-3 border-2 border-dashed border-indigo-200 dark:border-indigo-800 text-indigo-500 rounded-2xl font-black hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center justify-center gap-2"
  }, React.createElement(Icon, {
    name: "plus",
    className: "w-4 h-4"
  }), " \u65B0\u589E\u6642\u9593\u6BB5")) : React.createElement("div", {
    key: `schedule-${editDay}`,
    className: "tab-panel-motion space-y-4"
  }, React.createElement("div", {
    className: "grid grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800"
  }, ['一', '二', '三', '四', '五'].map((d, i) => React.createElement("button", {
    type: "button",
    key: i,
    onClick: () => setEditDay(i + 1),
    className: `min-w-0 py-2.5 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${editDay === i + 1 ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'}`
  }, React.createElement("span", {
    className: "hidden sm:inline"
  }, "\u661F\u671F"), d))), React.createElement("div", {
    className: "bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
  }, React.createElement("h3", {
    className: "font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"
  }, React.createElement("span", {
    className: "w-2 h-6 bg-indigo-500 rounded-full"
  }), "\u661F\u671F", ['日', '一', '二', '三', '四', '五', '六'][editDay], " \u8AB2\u7A0B"), lessonSlots.length === 0 ? React.createElement("p", {
    className: "text-slate-400 text-center py-4"
  }, "\u8ACB\u5148\u5728\u300C\u6642\u9593\u8A2D\u5B9A\u300D\u65B0\u589E\u8AB2\u5802\u985E\u578B\u7684\u6642\u9593\u6BB5") : lessonSlots.map((slot, lessonIdx) => {
    var _schedule$editDay;
    const currentSubjectName = (_schedule$editDay = schedule[editDay]) === null || _schedule$editDay === void 0 ? void 0 : _schedule$editDay[lessonIdx];
    const subObj = subjects.find(s => s.name === currentSubjectName);
    const colorClass = subObj ? subObj.color : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-700 dark:border-slate-600';
    return React.createElement("div", {
      key: lessonIdx,
      style: {
        animationDelay: `${lessonIdx * 0.045}s`
      },
      className: "motion-list-item flex items-center gap-3"
    }, React.createElement("div", {
      className: "w-20 text-xs font-bold text-slate-500 text-right"
    }, slot.label), React.createElement("div", {
      className: "flex-1"
    }, React.createElement("button", {
      onClick: () => setEditingCell({
        day: editDay,
        lessonIndex: lessonIdx
      }),
      className: `w-full p-3 rounded-xl border-2 text-left font-bold transition-all hover:brightness-95 flex justify-between items-center ${currentSubjectName ? colorClass : 'bg-slate-50 border-slate-200 text-slate-400'}`
    }, React.createElement("span", null, currentSubjectName || '(空堂)'), React.createElement(Icon, {
      name: "chevron-right",
      className: "w-4 h-4 opacity-50"
    }))));
  })))), React.createElement("div", {
    className: "p-4 border-t border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
  }, React.createElement("button", {
    type: "button",
    onClick: requestSave,
    className: "w-full min-h-12 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-black hover:opacity-95 active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-950/30"
  }, React.createElement(Icon, {
    name: "save",
    className: "w-4 h-4"
  }), " \u5132\u5B58\u6642\u9593\u8868")), editingCell && React.createElement(SubjectSelectionModal, {
    onClose: () => setEditingCell(null),
    onSelect: handleSubjectSelect,
    subjects: subjects
  }), editingTimeIndex !== null && React.createElement(TimePickerModal, {
    isOpen: editingTimeIndex !== null,
    value: (_timeSlots$editingTim = timeSlots[editingTimeIndex]) === null || _timeSlots$editingTim === void 0 ? void 0 : _timeSlots$editingTim.startTime,
    onSelect: val => handleSlotChange(editingTimeIndex, 'startTime', val),
    onClose: () => setEditingTimeIndex(null),
    title: "\u9078\u64C7\u8AB2\u7BC0\u958B\u59CB\u6642\u9593"
  }));
}
function Timetable(_ref21) {
  let currentDay = _ref21.currentDay,
    config = _ref21.config,
    onDayChange = _ref21.onDayChange,
    subjects = _ref21.subjects,
    globalNow = _ref21.globalNow;
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const now = globalNow || new Date();
  const scheduleData = generateFullSchedule(config, now, currentDay);
  const currentSlot = currentDay === now.getDay() && scheduleData.find(slot => now.getTime() >= slot.start.getTime() && now.getTime() <= slot.end.getTime());
  const lessonCount = scheduleData.filter(slot => slot.type === 'lesson').length;
  return React.createElement("div", {
    className: "max-w-5xl mx-auto space-y-5 pb-12"
  }, React.createElement("div", {
    className: "relative overflow-hidden rounded-[2rem] p-5 sm:p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-800 text-white shadow-[0_30px_80px_-38px_rgba(15,23,42,.9)]"
  }, React.createElement("div", {
    className: "absolute -right-16 -top-20 w-60 h-60 rounded-full bg-cyan-400/15 blur-3xl"
  }), React.createElement("div", {
    className: "relative flex items-center justify-between gap-5"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black tracking-[.18em] text-indigo-300"
  }, "\u661F\u671F", weekDays[currentDay], " \xB7 ", lessonCount, " \u7BC0\u8AB2"), React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-black mt-2"
  }, currentSlot ? `而家係 ${currentSlot.subjectName}` : scheduleData.length ? '課堂一目了然' : '這天未有課堂'), React.createElement("p", {
    className: "text-sm font-bold text-slate-300 mt-2"
  }, currentSlot ? `${formatTimeStr(currentSlot.start)}–${formatTimeStr(currentSlot.end)} · 尚餘 ${formatCountdown(currentSlot.end.getTime() - now.getTime())}` : '揀選星期即可查看完整時間表')), React.createElement("div", {
    className: "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/15 grid place-items-center shrink-0"
  }, React.createElement(Icon, {
    name: "calendar-clock",
    className: "w-7 h-7 text-indigo-200"
  })))), React.createElement("div", {
    className: "grid md:grid-cols-[12rem_minmax(0,1fr)] gap-4 items-start"
  }, React.createElement("div", {
    className: "flex md:flex-col glass-card bg-white/[0.85] dark:bg-slate-900/[0.85] rounded-[1.6rem] p-2 shadow-sm overflow-x-auto md:sticky md:top-4"
  }, [1, 2, 3, 4, 5].map(day => React.createElement("button", {
    key: day,
    onClick: () => onDayChange(day),
    className: `flex-1 md:w-full min-w-[5.3rem] py-3 px-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all flex md:justify-between items-center justify-center gap-2 ${currentDay === day ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`
  }, React.createElement("span", null, "\u661F\u671F", weekDays[day]), day === now.getDay() && React.createElement("span", {
    className: `w-2 h-2 rounded-full ${currentDay === day ? 'bg-white' : 'bg-emerald-400'}`
  })))), React.createElement("div", {
    className: "glass-card bg-white/90 dark:bg-slate-900/[0.88] rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-6 min-h-[22rem]"
  }, scheduleData.length > 0 ? scheduleData.map((slot, idx) => {
    const nowTime = now.getTime();
    const startTime = slot.start.getTime();
    const endTime = slot.end.getTime();
    let status = 'future';
    let diff = 0;
    if (currentDay === now.getDay() && nowTime > endTime) {
      status = 'past';
    } else if (currentDay === now.getDay() && nowTime >= startTime && nowTime <= endTime) {
      status = 'current';
      diff = endTime - nowTime;
    }
    return React.createElement("div", {
      key: idx,
      className: `timetable-slot-card relative pl-6 pb-5 last:pb-0 border-l-2 ${status === 'current' ? 'border-purple-500' : status === 'past' ? 'border-slate-200 dark:border-slate-700' : 'border-indigo-200 dark:border-indigo-900'}`
    }, React.createElement("div", {
      className: `absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${status === 'current' ? 'bg-purple-500 border-purple-100 animate-pulse scale-110' : status === 'past' ? 'bg-slate-200 dark:bg-slate-700 border-slate-100 dark:border-slate-600' : 'bg-white dark:bg-slate-900 border-green-400'}`
    }), React.createElement("div", {
      className: `rounded-2xl p-4 transition-all ${status === 'current' ? 'bg-purple-50 dark:bg-purple-900/20 shadow-md border border-purple-100 dark:border-purple-800 transform scale-[1.01]' : status === 'past' ? 'opacity-[.55] bg-slate-50 dark:bg-slate-800/50' : 'bg-indigo-50/[0.45] dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30'}`
    }, React.createElement("div", {
      className: "flex justify-between items-start"
    }, React.createElement("div", null, React.createElement("div", {
      className: `text-xs font-mono mb-1 ${status === 'current' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400'}`
    }, formatTimeStr(slot.start), " - ", formatTimeStr(slot.end)), React.createElement("div", {
      className: `text-base sm:text-lg font-bold ${slot.type === 'lesson' ? 'text-slate-800 dark:text-white' : 'text-slate-500 italic'} ${status === 'current' ? 'text-purple-900 dark:text-purple-300' : ''}`
    }, slot.subjectName)), status === 'current' && React.createElement("div", {
      className: "text-right"
    }, React.createElement("span", {
      className: "inline-block text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold mb-1 animate-pulse"
    }, "\u9032\u884C\u4E2D"), React.createElement("div", {
      className: "text-xs font-mono font-bold text-purple-600 dark:text-purple-400"
    }, "\u5269 ", formatCountdown(diff))), status === 'past' && React.createElement(Icon, {
      name: "check-circle",
      className: "w-5 h-5 text-slate-300 dark:text-slate-600"
    }))));
  }) : React.createElement("div", {
    className: "text-center py-16 text-slate-400"
  }, React.createElement("div", {
    className: "w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 grid place-items-center mx-auto mb-4"
  }, React.createElement(Icon, {
    name: "coffee",
    className: "w-7 h-7"
  })), React.createElement("div", {
    className: "text-lg font-black text-slate-600 dark:text-slate-300"
  }, "\u9019\u5929\u672A\u8A2D\u5B9A\u8AB2\u5802"), React.createElement("div", {
    className: "text-sm font-bold mt-2"
  }, "\u53EF\u4EE5\u4F11\u606F\uFF0C\u6216\u8005\u5230\u53F3\u4E0A\u89D2\u7DE8\u8F2F\u6642\u9593\u8868")))));
}
const getPriorityMeta = function () {
  let priority = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'normal';
  if (priority === 'high') return {
    label: '重要',
    icon: 'flame',
    classes: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800'
  };
  if (priority === 'low') return {
    label: '稍後',
    icon: 'circle-dot',
    classes: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800'
  };
  return {
    label: '一般',
    icon: 'minus',
    classes: 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };
};
function TaskCalendar(_ref22) {
  let items = _ref22.items,
    subjects = _ref22.subjects,
    onEdit = _ref22.onEdit,
    onToggle = _ref22.onToggle;
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const _useState57 = useState(() => new Date(now.getFullYear(), now.getMonth(), 1)),
    _useState58 = _slicedToArray(_useState57, 2),
    cursor = _useState58[0],
    setCursor = _useState58[1];
  const _useState59 = useState(todayKey),
    _useState60 = _slicedToArray(_useState59, 2),
    selectedDate = _useState60[0],
    setSelectedDate = _useState60[1];
  const visibleItems = useMemo(() => items.filter(item => !item.isHidden && !item.withdrawn && item.dueDate), [items]);
  const itemsByDate = useMemo(() => {
    const grouped = {};
    visibleItems.forEach(item => {
      const key = toLocalDateKey(item.dueDate);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    return grouped;
  }, [visibleItems]);
  const monthDays = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - mondayOffset);
    return Array.from({
      length: 42
    }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return {
        date,
        key,
        inMonth: date.getMonth() === month
      };
    });
  }, [cursor]);
  const selectedItems = (itemsByDate[selectedDate] || []).slice().sort((a, b) => {
    const weight = {
      high: 0,
      normal: 1,
      low: 2
    };
    return (weight[a.priority || 'normal'] ?? 1) - (weight[b.priority || 'normal'] ?? 1);
  });
  const moveMonth = delta => setCursor(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  const jumpToday = () => {
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(todayKey);
  };
  const selectedDateText = (() => {
    const d = new Date(`${selectedDate}T00:00:00`);
    return d.toLocaleDateString('zh-HK', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  })();
  const monthItems = visibleItems.filter(item => {
    const d = new Date(`${toLocalDateKey(item.dueDate)}T00:00:00`);
    return !isNaN(d.getTime()) && d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
  });
  const monthPending = monthItems.filter(item => !item.completed).length;
  const monthCompleted = monthItems.filter(item => item.completed).length;
  return React.createElement("div", {
    className: "max-w-5xl mx-auto space-y-5 pb-12"
  }, React.createElement("div", {
    className: "relative overflow-hidden rounded-[2rem] p-5 sm:p-6 bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-700 text-white shadow-[0_30px_80px_-38px_rgba(15,23,42,.9)]"
  }, React.createElement("div", {
    className: "absolute -right-16 -top-20 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl"
  }), React.createElement("div", {
    className: "relative flex items-center justify-between gap-4"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black tracking-[.18em] text-sky-200"
  }, "MONTH OVERVIEW"), React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-black mt-2"
  }, cursor.getMonth() + 1, "\u6708\u5B78\u7FD2\u6708\u66C6"), React.createElement("div", {
    className: "flex flex-wrap gap-2 mt-3"
  }, React.createElement("span", {
    className: "px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-black"
  }, monthPending, " \u9805\u5F85\u8FA6"), React.createElement("span", {
    className: "px-3 py-1.5 rounded-xl bg-emerald-400/15 border border-emerald-300/15 text-xs font-black text-emerald-200"
  }, monthCompleted, " \u9805\u5B8C\u6210"))), React.createElement("div", {
    className: "w-14 h-14 rounded-2xl bg-white/10 border border-white/15 grid place-items-center"
  }, React.createElement(Icon, {
    name: "calendar-days",
    className: "w-7 h-7 text-sky-200"
  })))), React.createElement("div", {
    className: "grid lg:grid-cols-[1.16fr_.84fr] gap-5 items-start"
  }, React.createElement("section", {
    className: "calendar-board rounded-[2rem] bg-white/95 dark:bg-slate-900/90 p-4 sm:p-6"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3 mb-5"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black tracking-widest text-indigo-500 uppercase"
  }, "Calendar"), React.createElement("h2", {
    className: "text-2xl font-black text-slate-900 dark:text-white mt-1"
  }, cursor.getFullYear(), "\u5E74 ", cursor.getMonth() + 1, "\u6708")), React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("button", {
    type: "button",
    onClick: () => moveMonth(-1),
    "aria-label": "\u4E0A\u4E00\u500B\u6708",
    className: "w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 grid place-items-center active:scale-95"
  }, React.createElement(Icon, {
    name: "chevron-left",
    className: "w-5 h-5"
  })), React.createElement("button", {
    type: "button",
    onClick: jumpToday,
    className: "h-11 px-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-black text-sm active:scale-95"
  }, "\u4ECA\u65E5"), React.createElement("button", {
    type: "button",
    onClick: () => moveMonth(1),
    "aria-label": "\u4E0B\u4E00\u500B\u6708",
    className: "w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 grid place-items-center active:scale-95"
  }, React.createElement(Icon, {
    name: "chevron-right",
    className: "w-5 h-5"
  })))), React.createElement("div", {
    className: "grid grid-cols-7 mb-2 text-center text-xs font-black text-slate-400"
  }, ['一', '二', '三', '四', '五', '六', '日'].map(day => React.createElement("div", {
    key: day,
    className: "py-2"
  }, day))), React.createElement("div", {
    className: "grid grid-cols-7 gap-1 sm:gap-2"
  }, monthDays.map(_ref23 => {
    let date = _ref23.date,
      key = _ref23.key,
      inMonth = _ref23.inMonth;
    const dayItems = itemsByDate[key] || [];
    const unfinished = dayItems.filter(item => !item.completed).length;
    const isSelected = key === selectedDate;
    return React.createElement("button", {
      key: key,
      type: "button",
      onClick: () => setSelectedDate(key),
      className: `calendar-day rounded-2xl p-1.5 flex flex-col items-center justify-center ${isSelected ? 'is-selected' : ''} ${key === todayKey ? 'is-today' : ''} ${inMonth ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300 dark:text-slate-700'}`
    }, React.createElement("span", {
      className: "text-sm font-black"
    }, date.getDate()), React.createElement("span", {
      className: "h-2 mt-1 flex items-center gap-0.5"
    }, dayItems.length > 0 && React.createElement("span", {
      className: `w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : unfinished > 0 ? 'bg-rose-500' : 'bg-emerald-400'}`
    }), dayItems.length > 1 && React.createElement("span", {
      className: `text-[9px] font-black ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`
    }, dayItems.length)));
  }))), React.createElement("section", {
    className: "rounded-[2rem] bg-white/90 dark:bg-slate-900/[0.85] border border-slate-200/60 dark:border-slate-800 p-4 sm:p-6 lg:sticky lg:top-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3 mb-4"
  }, React.createElement("div", null, React.createElement("h3", {
    className: "text-lg font-black text-slate-900 dark:text-white"
  }, selectedDateText), React.createElement("p", {
    className: "text-sm font-bold text-slate-400 mt-1"
  }, selectedItems.length ? `${selectedItems.length} 項紀錄` : '沒有功課或測驗')), React.createElement("div", {
    className: "w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 grid place-items-center"
  }, React.createElement(Icon, {
    name: "calendar-days",
    className: "w-5 h-5"
  }))), React.createElement("div", {
    className: "space-y-3"
  }, selectedItems.length === 0 ? React.createElement("div", {
    className: "py-10 text-center text-slate-400"
  }, React.createElement(Icon, {
    name: "coffee",
    className: "w-8 h-8 mx-auto mb-3"
  }), React.createElement("div", {
    className: "font-bold"
  }, "\u5462\u65E5\u53EF\u4EE5\u8F15\u9B06\u4E00\u4E0B")) : selectedItems.map(item => {
    var _subjects$find2;
    const subjectStyle = ((_subjects$find2 = subjects.find(s => s.name === item.subject)) === null || _subjects$find2 === void 0 ? void 0 : _subjects$find2.color) || 'bg-slate-100 text-slate-600 border-slate-200';
    const priority = getPriorityMeta(item.priority);
    return React.createElement("div", {
      key: item.id,
      className: `task-card rounded-2xl p-4 bg-white dark:bg-slate-800 ${item.completed ? 'opacity-65' : ''} ${item.priority === 'high' ? 'priority-high' : item.priority === 'low' ? 'priority-low' : ''}`
    }, React.createElement("div", {
      className: "flex items-start gap-3"
    }, React.createElement("button", {
      type: "button",
      onClick: () => onToggle(item.id, item.completed),
      "aria-label": item.completed ? '標示為未完成' : '標示為完成',
      className: `w-7 h-7 mt-0.5 rounded-full border-2 shrink-0 grid place-items-center ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`
    }, React.createElement(Icon, {
      name: "check",
      className: `w-4 h-4 ${item.completed ? '' : 'opacity-0'}`
    })), React.createElement("div", {
      className: "flex-1 min-w-0"
    }, React.createElement("div", {
      className: "flex flex-wrap items-center gap-2 mb-2"
    }, React.createElement("span", {
      className: `text-xs font-black px-2 py-1 rounded-lg border ${subjectStyle}`
    }, item.subject || '其他'), React.createElement("span", {
      className: `text-xs font-black px-2 py-1 rounded-lg border ${priority.classes}`
    }, React.createElement(Icon, {
      name: priority.icon,
      className: "w-3 h-3 mr-1"
    }), priority.label), item.publicRefId && React.createElement("span", {
      className: "text-xs font-black px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300"
    }, "\u73ED\u7D1A")), React.createElement("div", {
      className: `font-black text-slate-800 dark:text-white break-words ${item.completed ? 'line-through' : ''}`
    }, item.description)), !item.forceExpired && React.createElement("button", {
      type: "button",
      onClick: () => onEdit(item),
      "aria-label": "\u4FEE\u6539\u7D00\u9304",
      className: "w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 grid place-items-center active:scale-95"
    }, React.createElement(Icon, {
      name: "pencil",
      className: "w-4 h-4"
    }))));
  })))));
}
function AdminConsole(_ref24) {
  let db = _ref24.db,
    systemConfig = _ref24.systemConfig,
    systemClasses = _ref24.systemClasses,
    onBack = _ref24.onBack,
    subjects = _ref24.subjects,
    triggerAlert = _ref24.triggerAlert,
    triggerConfirm = _ref24.triggerConfirm;
  const _useState61 = useState('overview'),
    _useState62 = _slicedToArray(_useState61, 2),
    activeTab = _useState62[0],
    setActiveTab = _useState62[1];
  const _useState63 = useState([]),
    _useState64 = _slicedToArray(_useState63, 2),
    users = _useState64[0],
    setUsers = _useState64[1];
  const _useState65 = useState(null),
    _useState66 = _slicedToArray(_useState65, 2),
    usersLastDoc = _useState66[0],
    setUsersLastDoc = _useState66[1];
  const _useState67 = useState(true),
    _useState68 = _slicedToArray(_useState67, 2),
    usersHasMore = _useState68[0],
    setUsersHasMore = _useState68[1];
  const _useState69 = useState(false),
    _useState70 = _slicedToArray(_useState69, 2),
    usersLoading = _useState70[0],
    setUsersLoading = _useState70[1];
  const _useState71 = useState(false),
    _useState72 = _slicedToArray(_useState71, 2),
    usersLoadedOnce = _useState72[0],
    setUsersLoadedOnce = _useState72[1];
  const _useState73 = useState([]),
    _useState74 = _slicedToArray(_useState73, 2),
    publicTasks = _useState74[0],
    setPublicTasks = _useState74[1];
  const _useState75 = useState(''),
    _useState76 = _slicedToArray(_useState75, 2),
    searchQuery = _useState76[0],
    setSearchQuery = _useState76[1];
  const _useState77 = useState(null),
    _useState78 = _slicedToArray(_useState77, 2),
    selectedUser = _useState78[0],
    setSelectedUser = _useState78[1];
  const _useState79 = useState([]),
    _useState80 = _slicedToArray(_useState79, 2),
    userHomeworks = _useState80[0],
    setUserHomeworks = _useState80[1];
  const _useState81 = useState(''),
    _useState82 = _slicedToArray(_useState81, 2),
    newEmail = _useState82[0],
    setNewEmail = _useState82[1];
  const _useState83 = useState(''),
    _useState84 = _slicedToArray(_useState83, 2),
    newBlacklistEmail = _useState84[0],
    setNewBlacklistEmail = _useState84[1];
  const _useState85 = useState(''),
    _useState86 = _slicedToArray(_useState85, 2),
    newClassName = _useState86[0],
    setNewClassName = _useState86[1];
  const _useState87 = useState(false),
    _useState88 = _slicedToArray(_useState87, 2),
    isSubmitting = _useState88[0],
    setIsSubmitting = _useState88[1];
  const _useState89 = useState(''),
    _useState90 = _slicedToArray(_useState89, 2),
    newName = _useState90[0],
    setNewName = _useState90[1];
  const _useState91 = useState(null),
    _useState92 = _slicedToArray(_useState91, 2),
    editingAdminItem = _useState92[0],
    setEditingAdminItem = _useState92[1];
  const _useState93 = useState(false),
    _useState94 = _slicedToArray(_useState93, 2),
    isScanning = _useState94[0],
    setIsScanning = _useState94[1];
  const _useState95 = useState(null),
    _useState96 = _slicedToArray(_useState95, 2),
    expiredReport = _useState96[0],
    setExpiredReport = _useState96[1];
  const _useState97 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.announcementText) || ''),
    _useState98 = _slicedToArray(_useState97, 2),
    announcementInput = _useState98[0],
    setAnnouncementInput = _useState98[1];
  const _useState99 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateVersion) || ''),
    _useState100 = _slicedToArray(_useState99, 2),
    updateVersionInput = _useState100[0],
    setUpdateVersionInput = _useState100[1];
  const _useState101 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateTitle) || '系統已更新'),
    _useState102 = _slicedToArray(_useState101, 2),
    updateTitleInput = _useState102[0],
    setUpdateTitleInput = _useState102[1];
  const _useState103 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateSummary) || ''),
    _useState104 = _slicedToArray(_useState103, 2),
    updateSummaryInput = _useState104[0],
    setUpdateSummaryInput = _useState104[1];
  const _useState105 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateGuide) || ''),
    _useState106 = _slicedToArray(_useState105, 2),
    updateGuideInput = _useState106[0],
    setUpdateGuideInput = _useState106[1];
  const _useState107 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateAudience) || 'students'),
    _useState108 = _slicedToArray(_useState107, 2),
    updateAudienceInput = _useState108[0],
    setUpdateAudienceInput = _useState108[1];
  const _useState109 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updatePopupEnabled) !== false),
    _useState110 = _slicedToArray(_useState109, 2),
    updatePopupEnabledInput = _useState110[0],
    setUpdatePopupEnabledInput = _useState110[1];
  const _useState111 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.maintenanceMode) || 'normal'),
    _useState112 = _slicedToArray(_useState111, 2),
    maintenanceModeInput = _useState112[0],
    setMaintenanceModeInput = _useState112[1];
  const _useState113 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.maintenanceTitle) || '網站更新中'),
    _useState114 = _slicedToArray(_useState113, 2),
    maintenanceTitleInput = _useState114[0],
    setMaintenanceTitleInput = _useState114[1];
  const _useState115 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.message) || '管理員正在更新系統，請稍後再回來。'),
    _useState116 = _slicedToArray(_useState115, 2),
    maintenanceMessageInput = _useState116[0],
    setMaintenanceMessageInput = _useState116[1];
  const _useState117 = useState((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.estimatedTime) || '約 10 分鐘'),
    _useState118 = _slicedToArray(_useState117, 2),
    estimatedTimeInput = _useState118[0],
    setEstimatedTimeInput = _useState118[1];
  const _useState119 = useState(null),
    _useState120 = _slicedToArray(_useState119, 2),
    viewingClass = _useState120[0],
    setViewingClass = _useState120[1];
  const _useState121 = useState({}),
    _useState122 = _slicedToArray(_useState121, 2),
    taskStats = _useState122[0],
    setTaskStats = _useState122[1];
  const _useState123 = useState(false),
    _useState124 = _slicedToArray(_useState123, 2),
    isFetchingStats = _useState124[0],
    setIsFetchingStats = _useState124[1];
  const _useState125 = useState(false),
    _useState126 = _slicedToArray(_useState125, 2),
    isPushingPublic = _useState126[0],
    setIsPushingPublic = _useState126[1];
  const _useState127 = useState(null),
    _useState128 = _slicedToArray(_useState127, 2),
    pushReport = _useState128[0],
    setPushReport = _useState128[1];
  const _ref25 = window.firebaseServices || {},
    collection = _ref25.collection,
    getDocs = _ref25.getDocs,
    query = _ref25.query,
    orderBy = _ref25.orderBy,
    onSnapshot = _ref25.onSnapshot,
    doc = _ref25.doc,
    updateDoc = _ref25.updateDoc,
    arrayUnion = _ref25.arrayUnion,
    arrayRemove = _ref25.arrayRemove,
    deleteDoc = _ref25.deleteDoc,
    setDoc = _ref25.setDoc,
    getDoc = _ref25.getDoc,
    writeBatch = _ref25.writeBatch,
    limit = _ref25.limit,
    startAfter = _ref25.startAfter,
    where = _ref25.where;
  const allowedEmails = (systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.allowedEmails) || [];
  const blacklistedEmails = (systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.blacklistedEmails) || [];
  const USERS_PAGE_SIZE = 20;
  const fetchUsersPage = async function () {
    let reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!db || !collection || !getDocs || usersLoading) return;
    setUsersLoading(true);
    try {
      const usersRef = collection(db, "users_public");
      const baseQuery = reset || !usersLastDoc ? query(usersRef, orderBy("lastSeen", "desc"), limit(USERS_PAGE_SIZE)) : query(usersRef, orderBy("lastSeen", "desc"), startAfter(usersLastDoc), limit(USERS_PAGE_SIZE));
      const snapshot = await getDocs(baseQuery);
      const pageUsers = snapshot.docs.map(d => ({
        uid: d.id,
        ...d.data()
      }));
      setUsers(prev => {
        if (reset) return pageUsers;
        const existing = new Set(prev.map(u => u.uid));
        return [...prev, ...pageUsers.filter(u => !existing.has(u.uid))];
      });
      setUsersLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setUsersHasMore(snapshot.docs.length === USERS_PAGE_SIZE);
      setUsersLoadedOnce(true);
    } catch (err) {
      console.warn("Admin users pagination err:", err);
      triggerAlert("載入用戶失敗：" + err.message, "error");
    } finally {
      setUsersLoading(false);
    }
  };
  useEffect(() => {
    if (!db || !collection) return;
    setUsers([]);
    setUsersLastDoc(null);
    setUsersHasMore(true);
    setUsersLoadedOnce(false);
    fetchUsersPage(true);
  }, [db, collection]);
  useEffect(() => {
    if (!db || !collection) return;
    const q = query(collection(db, "public_assignments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => setPublicTasks(snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))), err => console.warn("Admin tasks err:", err));
    return () => unsubscribe();
  }, [db, collection]);
  useEffect(() => {
    if (!selectedUser || !db || !collection) return;
    const q = query(collection(db, "users", selectedUser.uid, "items"), orderBy("dueDate", "asc"));
    const unsubscribe = onSnapshot(q, snapshot => setUserHomeworks(snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))), err => console.warn("Admin user items err:", err));
    setNewName(selectedUser.displayName || '');
    return () => unsubscribe();
  }, [selectedUser, db, collection]);
  useEffect(() => {
    setAnnouncementInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.announcementText) || '');
  }, [systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.announcementText]);
  useEffect(() => {
    setUpdateVersionInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateVersion) || '');
    setUpdateTitleInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateTitle) || '系統已更新');
    setUpdateSummaryInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateSummary) || '');
    setUpdateGuideInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateGuide) || '');
    setUpdateAudienceInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateAudience) || 'students');
    setUpdatePopupEnabledInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updatePopupEnabled) !== false);
    setMaintenanceModeInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.maintenanceMode) || 'normal');
    setMaintenanceTitleInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.maintenanceTitle) || '網站更新中');
    setMaintenanceMessageInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.message) || '管理員正在更新系統，請稍後再回來。');
    setEstimatedTimeInput((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.estimatedTime) || '約 10 分鐘');
  }, [systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateVersion, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateTitle, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateSummary, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateGuide, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateAudience, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updatePopupEnabled, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.maintenanceMode, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.maintenanceTitle, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.message, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.estimatedTime]);
  const handlePublishUpdateNotice = async () => {
    const version = updateVersionInput.trim();
    const title = updateTitleInput.trim() || '系統已更新';
    const summary = updateSummaryInput.trim();
    const guide = updateGuideInput.trim();
    if (!version) {
      triggerAlert('請輸入版本號，例如 v1.4.0', 'error');
      return;
    }
    if (!summary && !guide) {
      triggerAlert('請至少填寫更新內容或使用教學', 'error');
      return;
    }
    triggerConfirm('確定要發佈版本更新彈窗嗎？用戶下次開頁面會自動看到。', async () => {
      try {
        await setDoc(doc(db, 'system_settings', 'config'), {
          updatePopupEnabled: updatePopupEnabledInput,
          updateVersion: version,
          updateTitle: title,
          updateSummary: summary,
          updateGuide: guide,
          updateAudience: updateAudienceInput,
          updatePublishedAt: new Date().toISOString(),
          updateHistory: arrayUnion({
            version,
            title,
            summary,
            guide,
            audience: updateAudienceInput,
            popupEnabled: updatePopupEnabledInput,
            publishedAt: new Date().toISOString()
          })
        }, {
          merge: true
        });
        triggerAlert('版本更新彈窗已發佈');
      } catch (e) {
        triggerAlert('發佈失敗：' + e.message, 'error');
      }
    });
  };
  const handleRepublishUpdateNotice = notice => {
    const version = notice.version || updateVersionInput || 'v1.0.0';
    triggerConfirm(`確定要重新發放「${version}」更新資訊嗎？用戶下次開頁面會再次看到。`, async () => {
      try {
        await setDoc(doc(db, 'system_settings', 'config'), {
          updatePopupEnabled: notice.popupEnabled !== false,
          updateVersion: version,
          updateTitle: notice.title || '系統已更新',
          updateSummary: notice.summary || '',
          updateGuide: notice.guide || '',
          updateAudience: notice.audience || 'students',
          updatePublishedAt: new Date().toISOString()
        }, {
          merge: true
        });
        triggerAlert('已重新發放舊版更新資訊');
      } catch (e) {
        triggerAlert('重新發放失敗：' + e.message, 'error');
      }
    });
  };
  const handleSaveMaintenanceBlock = async () => {
    triggerConfirm(maintenanceModeInput === 'normal' ? '確定要關閉更新阻攔畫面嗎？' : '確定要開啟更新阻攔畫面嗎？普通用戶會被暫時阻擋。', async () => {
      try {
        await setDoc(doc(db, 'system_settings', 'config'), {
          maintenanceMode: maintenanceModeInput,
          maintenanceTitle: maintenanceTitleInput.trim() || '網站更新中',
          message: maintenanceMessageInput.trim() || '管理員正在更新系統，請稍後再回來。',
          estimatedTime: estimatedTimeInput.trim() || ''
        }, {
          merge: true
        });
        triggerAlert(maintenanceModeInput === 'normal' ? '已關閉阻攔畫面' : '已啟用阻攔畫面');
      } catch (e) {
        triggerAlert('更新阻攔設定失敗：' + e.message, 'error');
      }
    });
  };
  const handleSendSyncReminder = async (task, stats) => {
    var _stats$pendingList;
    if (!task || !stats || !((_stats$pendingList = stats.pendingList) !== null && _stats$pendingList !== void 0 && _stats$pendingList.length)) {
      triggerAlert('目前沒有未到位學生需要提醒');
      return;
    }
    const title = '你有廣播功課未到位';
    const message = `${task.subject || '功課'}：${task.description || '未填寫內容'}，系統會自動加入個人手冊。`;
    triggerConfirm(`確定提醒 ${stats.pendingList.length} 位未到位學生嗎？`, async () => {
      try {
        await setDoc(doc(db, 'system_settings', 'config'), {
          adminReminders: arrayUnion({
            id: `reminder-${task.id}-${Date.now()}`,
            taskId: task.id,
            targetClass: task.targetClass || '全校',
            title,
            message,
            createdAt: new Date().toISOString()
          })
        }, {
          merge: true
        });
        triggerAlert('已發送提醒到學生通知中心');
      } catch (e) {
        triggerAlert('發送提醒失敗：' + e.message, 'error');
      }
    });
  };
  const updateConfig = async (key, value) => {
    triggerConfirm("確定要更改此系統設定嗎？", async () => {
      try {
        await setDoc(doc(db, "system_settings", "config"), {
          [key]: value
        }, {
          merge: true
        });
        triggerAlert("設定已更新");
      } catch (e) {
        triggerAlert("設定更新失敗", "error");
      }
    });
  };
  const handleAddWhitelist = async e => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    triggerConfirm(`確定要將 ${newEmail.trim()} 加入白名單嗎？`, async () => {
      setIsSubmitting(true);
      try {
        await updateDoc(doc(db, "system_settings", "config"), {
          allowedEmails: arrayUnion(newEmail.trim())
        });
        setNewEmail('');
        triggerAlert("已新增至白名單");
      } catch (e) {
        triggerAlert("新增失敗", "error");
      }
      setIsSubmitting(false);
    });
  };
  const handleRemoveWhitelist = async email => {
    triggerConfirm(`確定要將 ${email} 移出白名單嗎？`, async () => {
      try {
        await updateDoc(doc(db, "system_settings", "config"), {
          allowedEmails: arrayRemove(email)
        });
        triggerAlert("已移除");
      } catch (e) {}
    });
  };
  const handleAddBlacklist = async e => {
    e.preventDefault();
    if (!newBlacklistEmail.trim()) return;
    triggerConfirm(`確定要封鎖 ${newBlacklistEmail.trim()} 嗎？`, async () => {
      setIsSubmitting(true);
      try {
        await setDoc(doc(db, "system_settings", "config"), {
          blacklistedEmails: arrayUnion(newBlacklistEmail.trim()),
          blacklistEnabled: true
        }, {
          merge: true
        });
        setNewBlacklistEmail('');
        triggerAlert("已新增至黑名單並啟用封鎖");
      } catch (e) {
        triggerAlert("新增失敗", "error");
      }
      setIsSubmitting(false);
    });
  };
  const handleRemoveBlacklist = async email => {
    triggerConfirm(`確定要解除封鎖 ${email} 嗎？`, async () => {
      try {
        await updateDoc(doc(db, "system_settings", "config"), {
          blacklistedEmails: arrayRemove(email)
        });
        triggerAlert("已解除封鎖");
      } catch (e) {}
    });
  };
  const handleBlockUserEmail = email => {
    if (!email) return;
    triggerConfirm(`確定要即時封鎖 ${email} 嗎？`, async () => {
      try {
        await setDoc(doc(db, "system_settings", "config"), {
          blacklistedEmails: arrayUnion(email),
          blacklistEnabled: true
        }, {
          merge: true
        });
        triggerAlert("已封鎖用戶，黑名單系統已啟用");
      } catch (e) {
        triggerAlert("封鎖失敗", "error");
      }
    });
  };
  const handleCreateClass = async e => {
    e.preventDefault();
    const name = newClassName.trim();
    if (!name) return;
    triggerConfirm(`確定要建立班級【${name}】嗎？`, async () => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      try {
        await updateDoc(doc(db, 'system_settings', 'classes'), {
          list: arrayUnion({
            code,
            name,
            createdAt: new Date().toISOString()
          })
        });
        setNewClassName('');
        triggerAlert(`成功建立班級：${name} (代碼: ${code})`);
      } catch (e) {
        await setDoc(doc(db, 'system_settings', 'classes'), {
          list: arrayUnion({
            code,
            name,
            createdAt: new Date().toISOString()
          })
        }, {
          merge: true
        });
        setNewClassName('');
        triggerAlert(`成功建立班級：${name} (代碼: ${code})`);
      }
    });
  };
  const handleDeepDeleteClass = async classObj => {
    triggerConfirm(`⚠️ 警告：確定要刪除班級 ${classObj.name}？\n\n此操作將會：\n1. 刪除班級代碼\n2. 刪除該班級所有廣播功課\n3. 將所有學生踢出該班級`, async () => {
      try {
        const batch = writeBatch(db);
        const tasksQ = query(collection(db, "public_assignments"), where("targetClass", "==", classObj.code));
        const tasksSnap = await getDocs(tasksQ);
        tasksSnap.forEach(d => batch.delete(d.ref));
        const usersQ = query(collection(db, "users_public"), where("joinedClasses", "array-contains", classObj.code));
        const usersSnap = await getDocs(usersQ);
        usersSnap.forEach(d => batch.update(d.ref, {
          joinedClasses: arrayRemove(classObj.code)
        }));
        const classesRef = doc(db, 'system_settings', 'classes');
        const classesSnap = await getDoc(classesRef);
        if (classesSnap.exists()) {
          const currentList = classesSnap.data().list || [];
          const newList = currentList.filter(c => c.code !== classObj.code);
          batch.update(classesRef, {
            list: newList
          });
        }
        await batch.commit();
        triggerAlert("班級已徹底刪除及清理");
        if (viewingClass === classObj.code) setViewingClass(null);
      } catch (e) {
        triggerAlert("刪除過程發生錯誤：" + e.message, "error");
      }
    });
  };
  const handleKickUserFromClass = async (userObj, classCode) => {
    triggerConfirm(`確定要將 ${userObj.displayName || userObj.email} 踢出此班級嗎？`, async () => {
      try {
        await updateDoc(doc(db, "users_public", userObj.uid), {
          joinedClasses: arrayRemove(classCode)
        });
        triggerAlert("已踢出班級");
      } catch (e) {
        triggerAlert("移除失敗: " + e.message, "error");
      }
    });
  };
  const getTargetUsersForPublicTask = async task => {
    if (!db || !collection || !getDocs || !query) return [];
    const targetClass = (task === null || task === void 0 ? void 0 : task.targetClass) || '全校';
    const usersRef = collection(db, "users_public");
    const targetQuery = targetClass === '全校' ? query(usersRef) : query(usersRef, where("joinedClasses", "array-contains", targetClass));
    const snapshot = await getDocs(targetQuery);
    const allTargetUsers = snapshot.docs.map(d => ({
      uid: d.id,
      ...d.data()
    }));
    return allTargetUsers.filter(u => {
      if (!(u !== null && u !== void 0 && u.uid)) return false;
      if (u.email === ADMIN_EMAIL) return false;
      if (blacklistedEmails.includes(u.email)) return false;
      return true;
    });
  };
  const buildPublicInsertPayload = task => ({
    type: task.type || 'homework',
    subject: task.subject || '其他',
    description: task.description || '',
    dueDate: task.dueDate || '',
    completed: false,
    createdAt: new Date().toISOString(),
    publicRefId: task.id,
    senderName: task.senderName || '管理員',
    targetClass: task.targetClass || '全校',
    autoSynced: true,
    syncedByAdmin: true,
    syncedAt: new Date().toISOString(),
    forceExpired: false,
    isHidden: false
  });
  const buildPublicUpdatePayload = task => ({
    type: task.type || 'homework',
    subject: task.subject || '其他',
    description: task.description || '',
    dueDate: task.dueDate || '',
    publicRefId: task.id,
    senderName: task.senderName || '管理員',
    targetClass: task.targetClass || '全校',
    syncedByAdmin: true,
    syncedAt: new Date().toISOString(),
    forceExpired: false,
    isHidden: false
  });
  const updateTaskStatsFromTargetUsers = async (task, targetUsers) => {
    let synced = 0;
    let completed = 0;
    const pendingList = [];
    const syncedList = [];
    const completedList = [];
    for (const u of targetUsers) {
      const q = query(collection(db, "users", u.uid, "items"), where("publicRefId", "==", task.id));
      const snap = await getDocs(q);
      const display = u.displayName || u.email || u.uid;
      if (!snap.empty) {
        synced++;
        syncedList.push(display);
        const hasCompleted = snap.docs.some(d => {
          var _d$data, _d$data2;
          return ((_d$data = d.data()) === null || _d$data === void 0 ? void 0 : _d$data.completed) === true && ((_d$data2 = d.data()) === null || _d$data2 === void 0 ? void 0 : _d$data2.isHidden) !== true;
        });
        if (hasCompleted) {
          completed++;
          completedList.push(display);
        }
      } else {
        pendingList.push(display);
      }
    }
    setTaskStats(prev => ({
      ...prev,
      [task.id]: {
        total: targetUsers.length,
        synced,
        completed,
        pendingList,
        syncedList,
        completedList,
        syncRate: targetUsers.length ? Math.round(synced / targetUsers.length * 100) : 0,
        completedRate: targetUsers.length ? Math.round(completed / targetUsers.length * 100) : 0,
        scannedAt: new Date().toISOString()
      }
    }));
    return {
      total: targetUsers.length,
      synced,
      completed,
      pendingList,
      syncedList,
      completedList
    };
  };
  const pushPublicTaskToTargets = async function (task) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const _options$refreshStats = options.refreshStats,
      refreshStats = _options$refreshStats === void 0 ? true : _options$refreshStats;
    if (!(task !== null && task !== void 0 && task.id)) return {
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0
    };
    if (task.forceExpired) throw new Error('這份廣播功課已撤回，不能再派發。');
    const targetUsers = await getTargetUsersForPublicTask(task);
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let batch = writeBatch(db);
    let pendingWrites = 0;
    const commitBatch = async () => {
      if (pendingWrites <= 0) return;
      await batch.commit();
      batch = writeBatch(db);
      pendingWrites = 0;
    };
    for (const u of targetUsers) {
      const duplicateQ = query(collection(db, "users", u.uid, "items"), where("publicRefId", "==", task.id));
      const duplicateSnap = await getDocs(duplicateQ);
      if (duplicateSnap.empty) {
        batch.set(doc(db, "users", u.uid, "items", `public_${task.id}`), buildPublicInsertPayload(task), {
          merge: true
        });
        created++;
        pendingWrites++;
      } else {
        duplicateSnap.docs.forEach(existingDoc => {
          batch.update(existingDoc.ref, buildPublicUpdatePayload(task));
          pendingWrites++;
        });
        updated++;
      }
      if (pendingWrites >= 420) await commitBatch();
    }
    await commitBatch();
    if (refreshStats) await updateTaskStatsFromTargetUsers(task, targetUsers);
    return {
      total: targetUsers.length,
      created,
      updated,
      skipped
    };
  };
  const handlePushPublicTaskNow = task => {
    const cls = systemClasses.find(c => c.code === task.targetClass);
    const targetName = task.targetClass === '全校' || !task.targetClass ? '全校' : (cls === null || cls === void 0 ? void 0 : cls.name) || task.targetClass;
    triggerConfirm(`確定要重新派發「${task.subject || '功課'}」到 ${targetName} 所有學生個人手冊嗎？`, async () => {
      setIsPushingPublic(true);
      try {
        const report = await pushPublicTaskToTargets(task);
        setPushReport({
          type: 'single',
          taskId: task.id,
          subject: task.subject || '功課',
          ...report,
          pushedAt: new Date().toISOString()
        });
        triggerAlert(`派發完成：新增 ${report.created} 人，修復/更新 ${report.updated} 人。`);
      } catch (e) {
        triggerAlert('派發失敗：' + e.message, 'error');
      } finally {
        setIsPushingPublic(false);
      }
    });
  };
  const handlePushAllPublicTasksNow = () => {
    const activeTasks = publicTasks.filter(task => !task.forceExpired);
    if (!activeTasks.length) {
      triggerAlert('目前沒有可推送的廣播功課', 'error');
      return;
    }
    triggerConfirm(`確定重新派發 ${activeTasks.length} 份廣播功課到各自目標學生嗎？系統會自動修復未到位紀錄。`, async () => {
      setIsPushingPublic(true);
      try {
        const summary = {
          totalTasks: activeTasks.length,
          totalTargets: 0,
          created: 0,
          updated: 0,
          skipped: 0
        };
        for (const task of activeTasks) {
          const report = await pushPublicTaskToTargets(task, {
            refreshStats: false
          });
          summary.totalTargets += report.total;
          summary.created += report.created;
          summary.updated += report.updated;
          summary.skipped += report.skipped;
        }
        setPushReport({
          type: 'all',
          ...summary,
          pushedAt: new Date().toISOString()
        });
        triggerAlert(`重新派發完成：新增 ${summary.created} 項，修復/更新 ${summary.updated} 項。`);
      } catch (e) {
        triggerAlert('重新派發失敗：' + e.message, 'error');
      } finally {
        setIsPushingPublic(false);
      }
    });
  };
  const fetchTaskProgress = async task => {
    setIsFetchingStats(true);
    try {
      const targetUsers = await getTargetUsersForPublicTask(task);
      await updateTaskStatsFromTargetUsers(task, targetUsers);
    } catch (e) {
      triggerAlert("讀取派發狀態失敗: " + e.message, "error");
    }
    setIsFetchingStats(false);
  };
  const fetchAllTaskProgress = async () => {
    if (!publicTasks.length) return triggerAlert("目前沒有廣播任務可掃描", "error");
    for (const task of publicTasks) {
      await fetchTaskProgress(task);
    }
    triggerAlert("已更新所有廣播任務的派發狀態");
  };
  const handleDeleteUser = async targetUser => {
    triggerConfirm(`⚠️ 危險操作！確定要刪除用戶 ${targetUser.displayName} 的所有資料？此操作無法復原！`, async () => {
      try {
        const batch = writeBatch(db);
        const itemsQ = query(collection(db, "users", targetUser.uid, "items"));
        const itemsSnap = await getDocs(itemsQ);
        itemsSnap.forEach(d => batch.delete(d.ref));
        batch.delete(doc(db, "users", targetUser.uid, "settings", "timetable"));
        batch.delete(doc(db, "users", targetUser.uid, "settings", "subjects"));
        batch.delete(doc(db, "users_public", targetUser.uid));
        await batch.commit();
        triggerAlert("用戶資料已徹底刪除");
        if ((selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.uid) === targetUser.uid) setSelectedUser(null);
      } catch (e) {
        triggerAlert("刪除失敗: " + e.message, "error");
      }
    });
  };
  const handleUpdateUserName = async () => {
    if (!selectedUser || !newName.trim()) return;
    triggerConfirm("確定要更新該用戶的名字嗎？", async () => {
      try {
        await updateDoc(doc(db, "users_public", selectedUser.uid), {
          displayName: newName.trim()
        });
        triggerAlert("用戶名稱已更新");
      } catch (e) {
        triggerAlert("更新失敗", "error");
      }
    });
  };
  const handleAdminUpdateItem = async (itemId, updatedData) => {
    if (!selectedUser) return;
    try {
      await updateDoc(doc(db, "users", selectedUser.uid, "items", itemId), updatedData);
      triggerAlert("已修改該用戶紀錄");
    } catch (e) {
      triggerAlert("修改失敗: " + e.message, "error");
      throw e;
    }
  };
  const handleAdminDeleteItem = async itemId => {
    if (!selectedUser) return;
    const targetItem = userHomeworks.find(i => i.id === itemId);
    if (!targetItem) return;
    triggerConfirm("確定要刪除該用戶的這項紀錄嗎？", async () => {
      try {
        if (targetItem.publicRefId) await updateDoc(doc(db, "users", selectedUser.uid, "items", itemId), {
          isHidden: true
        });else await deleteDoc(doc(db, "users", selectedUser.uid, "items", itemId));
        triggerAlert("成功刪除");
      } catch (e) {
        triggerAlert("刪除失敗", "error");
      }
    });
  };
  const handleDeletePublicTask = taskOrId => {
    const task = typeof taskOrId === 'object' ? taskOrId : publicTasks.find(t => t.id === taskOrId);
    const taskId = (task === null || task === void 0 ? void 0 : task.id) || taskOrId;
    triggerConfirm("確定要撤回這份廣播功課嗎？這會同時從所有目標學生的清單中移除。", async () => {
      try {
        const targetUsers = task ? await getTargetUsersForPublicTask(task) : users;
        let batch = writeBatch(db);
        let pendingWrites = 0;
        const commitBatch = async () => {
          if (pendingWrites <= 0) return;
          await batch.commit();
          batch = writeBatch(db);
          pendingWrites = 0;
        };
        batch.delete(doc(db, "public_assignments", taskId));
        pendingWrites++;
        for (const u of targetUsers) {
          const dupQ = query(collection(db, "users", u.uid, "items"), where("publicRefId", "==", taskId));
          const snap = await getDocs(dupQ);
          snap.forEach(d => {
            batch.delete(d.ref);
            pendingWrites++;
          });
          if (pendingWrites >= 420) await commitBatch();
        }
        await commitBatch();
        triggerAlert("廣播功課已撤回，並已清理所有目標學生紀錄");
      } catch (e) {
        triggerAlert("撤回失敗: " + e.message, "error");
      }
    });
  };
  const handleScanExpired = async () => {
    triggerConfirm("確定要掃描全校未清理過期功課嗎？", async () => {
      setIsScanning(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const report = [];
      try {
        for (const u of users) {
          const q = query(collection(db, "users", u.uid, "items"));
          const snap = await getDocs(q);
          const userItems = snap.docs.map(d => d.data());
          const expired = userItems.filter(item => {
            if (item.completed) return false;
            const due = new Date(item.dueDate);
            due.setHours(0, 0, 0, 0);
            return due < today;
          });
          if (expired.length > 0) report.push({
            user: u,
            expiredCount: expired.length,
            items: expired
          });
        }
        setExpiredReport(report.sort((a, b) => b.expiredCount - a.expiredCount));
        if (report.length === 0) triggerAlert("太棒了！所有學生都沒有未清理的過期功課。");
      } catch (e) {
        triggerAlert("掃描失敗: " + e.message, "error");
      }
      setIsScanning(false);
    });
  };
  const getUserStatus = lastSeen => {
    if (!lastSeen || typeof lastSeen.toDate !== 'function') return 'offline';
    const diff = new Date() - lastSeen.toDate();
    if (diff < 2 * 60 * 1000) return 'online';
    if (diff < 10 * 60 * 1000) return 'idle';
    return 'offline';
  };
  const activeTodayCount = users.filter(u => u.lastSeen && typeof u.lastSeen.toDate === 'function' && new Date() - u.lastSeen.toDate() < 24 * 60 * 60 * 1000).length;
  const onlineNowCount = users.filter(u => u.lastSeen && typeof u.lastSeen.toDate === 'function' && new Date() - u.lastSeen.toDate() < 10 * 60 * 1000).length;
  const recent7DayTaskCount = publicTasks.filter(t => t.createdAt && typeof t.createdAt.toDate === 'function' && new Date() - t.createdAt.toDate() < 7 * 24 * 60 * 60 * 1000).length;
  const classMemberTotal = systemClasses.reduce((sum, c) => sum + users.filter(u => (u.joinedClasses || []).includes(c.code)).length, 0);
  const selectedUserStats = selectedUser ? {
    total: userHomeworks.length,
    unfinished: userHomeworks.filter(h => !h.completed && !h.isHidden).length,
    synced: userHomeworks.filter(h => h.publicRefId).length,
    expired: userHomeworks.filter(h => {
      if (h.completed || h.isHidden) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(h.dueDate);
      due.setHours(0, 0, 0, 0);
      return due instanceof Date && !isNaN(due.getTime()) && due < today;
    }).length,
    classes: (selectedUser.joinedClasses || []).length
  } : {
    total: 0,
    unfinished: 0,
    synced: 0,
    expired: 0,
    classes: 0
  };
  const filteredUsers = users.filter(u => (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()));
  return React.createElement("div", {
    className: "admin-console glass-card bg-white/95 dark:bg-slate-900/95 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row min-h-[680px] relative z-20 mt-4"
  }, React.createElement("div", {
    className: "admin-sidebar w-full md:w-64 bg-slate-950 dark:bg-[#111827] text-slate-300 p-5 md:p-6 flex flex-col gap-2 shrink-0 border-r border-slate-800"
  }, React.createElement("div", {
    className: "admin-sidebar-header flex items-center gap-3 mb-6 text-white px-2"
  }, React.createElement("button", {
    onClick: onBack,
    className: "p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors"
  }, React.createElement(Icon, {
    name: "arrow-left",
    className: "w-5 h-5"
  })), React.createElement("h2", {
    className: "text-xl font-black tracking-wide"
  }, "\u8D85\u7D1A\u7BA1\u7406\u4E2D\u5FC3")), React.createElement("div", {
    className: "admin-tabs flex flex-row md:flex-col gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0"
  }, [{
    id: 'overview',
    icon: 'layout-dashboard',
    label: '總覽'
  }, {
    id: 'users',
    icon: 'users',
    label: '用戶'
  }, {
    id: 'classes',
    icon: 'school',
    label: '班級'
  }, {
    id: 'tasks',
    icon: 'bell',
    label: '廣播'
  }, {
    id: 'syncMonitor',
    icon: 'activity',
    label: '派發'
  }, {
    id: 'settings',
    icon: 'settings',
    label: '系統'
  }].map(tab => React.createElement("button", {
    key: tab.id,
    onClick: () => {
      setActiveTab(tab.id);
      setSelectedUser(null);
      setViewingClass(null);
    },
    className: `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'}`
  }, React.createElement(Icon, {
    name: tab.icon,
    className: `w-5 h-5 ${activeTab === tab.id ? 'text-indigo-200' : 'text-slate-500'}`
  }), " ", tab.label)))), React.createElement("div", {
    key: activeTab,
    className: "admin-content admin-panel-motion flex-1 p-5 md:p-8 overflow-y-auto bg-slate-50/70 dark:bg-slate-900/50 text-slate-800 relative"
  }, editingAdminItem && React.createElement(EditModal, {
    item: editingAdminItem,
    onClose: () => setEditingAdminItem(null),
    onSave: handleAdminUpdateItem,
    triggerAlert: triggerAlert,
    triggerConfirm: triggerConfirm,
    subjects: subjects
  }), activeTab === 'overview' && React.createElement("div", {
    className: "space-y-6 animate-fadeIn"
  }, React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-2"
  }, React.createElement("div", null, React.createElement("h3", {
    className: "text-2xl font-black dark:text-white"
  }, "\u5C08\u696D\u7CFB\u7D71\u7E3D\u89BD"), React.createElement("p", {
    className: "text-sm text-slate-500 mt-1"
  }, "\u5FEB\u901F\u67E5\u770B\u7528\u6236\u6D3B\u8E8D\u3001\u5EE3\u64AD\u4EFB\u52D9\u3001\u73ED\u7D1A\u71DF\u904B\u8207\u5B89\u5168\u72C0\u614B\u3002")), React.createElement("button", {
    onClick: () => fetchUsersPage(true),
    disabled: usersLoading,
    className: "px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 active:scale-95 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "refresh-cw",
    className: `w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`
  }), " \u91CD\u65B0\u6574\u7406\u7528\u6236")), React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
  }, React.createElement("div", {
    className: "bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg"
  }, React.createElement("div", {
    className: "text-blue-100 text-sm font-bold mb-1"
  }, "\u5DF2\u8F09\u5165\u7528\u6236"), React.createElement("div", {
    className: "text-4xl font-black"
  }, users.length), React.createElement("div", {
    className: "text-[11px] text-blue-100 mt-2"
  }, "\u7528\u6236\u7BA1\u7406\u4F7F\u7528\u5206\u9801\u8F09\u5165\uFF0C\u6BCF\u9801 20 \u4EBA")), React.createElement("div", {
    className: "bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-6 text-white shadow-lg"
  }, React.createElement("div", {
    className: "text-emerald-100 text-sm font-bold mb-1"
  }, "10\u5206\u9418\u5167\u5728\u7DDA"), React.createElement("div", {
    className: "text-4xl font-black"
  }, onlineNowCount), React.createElement("div", {
    className: "text-[11px] text-emerald-50 mt-2"
  }, "24\u5C0F\u6642\u6D3B\u8E8D\uFF1A", activeTodayCount, " \u4EBA")), React.createElement("div", {
    className: "bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white shadow-lg"
  }, React.createElement("div", {
    className: "text-orange-100 text-sm font-bold mb-1"
  }, "\u5EE3\u64AD\u4EFB\u52D9"), React.createElement("div", {
    className: "text-4xl font-black"
  }, publicTasks.length), React.createElement("div", {
    className: "text-[11px] text-orange-50 mt-2"
  }, "\u6700\u8FD1 7 \u65E5\uFF1A", recent7DayTaskCount, " \u4EFD")), React.createElement("div", {
    className: "bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-3xl p-6 text-white shadow-lg"
  }, React.createElement("div", {
    className: "text-violet-100 text-sm font-bold mb-1"
  }, "\u73ED\u7D1A\u7CFB\u7D71"), React.createElement("div", {
    className: "text-4xl font-black"
  }, systemClasses.length), React.createElement("div", {
    className: "text-[11px] text-violet-50 mt-2"
  }, "\u5DF2\u8F09\u5165\u73ED\u7D1A\u6210\u54E1\u8A18\u9304\uFF1A", classMemberTotal))), React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-4"
  }, React.createElement("div", {
    className: "lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, React.createElement("h4", {
    className: "font-black dark:text-white flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "radio",
    className: "w-5 h-5 text-orange-500"
  }), " \u6700\u8FD1\u5EE3\u64AD"), React.createElement("button", {
    onClick: () => setActiveTab('syncMonitor'),
    className: "text-xs font-black text-indigo-600 dark:text-indigo-400"
  }, "\u67E5\u770B\u6D3E\u767C\u72C0\u614B")), React.createElement("div", {
    className: "space-y-3"
  }, publicTasks.slice(0, 5).map(task => {
    const cls = systemClasses.find(c => c.code === task.targetClass);
    const targetName = task.targetClass === '全校' || !task.targetClass ? '全校' : (cls === null || cls === void 0 ? void 0 : cls.name) || task.targetClass;
    return React.createElement("div", {
      key: task.id,
      className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 flex items-start justify-between gap-3"
    }, React.createElement("div", {
      className: "min-w-0"
    }, React.createElement("div", {
      className: "font-black text-sm dark:text-white truncate"
    }, task.description), React.createElement("div", {
      className: "text-[11px] text-slate-400 mt-1"
    }, targetName, " \xB7 ", task.subject || '其他', " \xB7 ", formatFirebaseDateTime(task.createdAt) || '最近發佈')), React.createElement("button", {
      onClick: () => fetchTaskProgress(task),
      className: "shrink-0 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-[11px] font-black"
    }, "\u6383\u63CF"));
  }), publicTasks.length === 0 && React.createElement("div", {
    className: "text-center py-8 text-slate-400 font-bold"
  }, "\u66AB\u6642\u672A\u6709\u5EE3\u64AD\u4EFB\u52D9"))), React.createElement("div", {
    className: "bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm"
  }, React.createElement("h4", {
    className: "font-black dark:text-white mb-4 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "shield-check",
    className: "w-5 h-5 text-emerald-500"
  }), " \u5B89\u5168\u72C0\u614B"), React.createElement("div", {
    className: "space-y-3 text-sm"
  }, React.createElement("div", {
    className: "flex justify-between items-center"
  }, React.createElement("span", {
    className: "font-bold text-slate-500"
  }, "\u767D\u540D\u55AE"), React.createElement("span", {
    className: `px-2.5 py-1 rounded-lg text-xs font-black ${systemConfig !== null && systemConfig !== void 0 && systemConfig.whitelistEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`
  }, systemConfig !== null && systemConfig !== void 0 && systemConfig.whitelistEnabled ? '已啟用' : '未啟用')), React.createElement("div", {
    className: "flex justify-between items-center"
  }, React.createElement("span", {
    className: "font-bold text-slate-500"
  }, "\u767D\u540D\u55AE\u4EBA\u6578"), React.createElement("span", {
    className: "font-black dark:text-white"
  }, allowedEmails.length)), React.createElement("div", {
    className: "flex justify-between items-center"
  }, React.createElement("span", {
    className: "font-bold text-slate-500"
  }, "\u9ED1\u540D\u55AE"), React.createElement("span", {
    className: `px-2.5 py-1 rounded-lg text-xs font-black ${systemConfig !== null && systemConfig !== void 0 && systemConfig.blacklistEnabled ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`
  }, systemConfig !== null && systemConfig !== void 0 && systemConfig.blacklistEnabled ? '已啟用' : '未啟用')), React.createElement("div", {
    className: "flex justify-between items-center"
  }, React.createElement("span", {
    className: "font-bold text-slate-500"
  }, "\u5C01\u9396\u4EBA\u6578"), React.createElement("span", {
    className: "font-black dark:text-white"
  }, blacklistedEmails.length)), React.createElement("button", {
    onClick: () => setActiveTab('settings'),
    className: "w-full mt-2 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs"
  }, "\u524D\u5F80\u5B89\u5168\u8A2D\u5B9A"))))), activeTab === 'classes' && !viewingClass && React.createElement("div", {
    className: "space-y-6 animate-fadeIn h-full flex flex-col"
  }, React.createElement("h3", {
    className: "text-2xl font-bold dark:text-white"
  }, "\u73ED\u7D1A\u4EE3\u78BC\u7BA1\u7406"), React.createElement("p", {
    className: "text-sm text-slate-500 -mt-2"
  }, "\u5EFA\u7ACB\u73ED\u7D1A\u7FA4\u7D44\uFF0C\u5B78\u751F\u6191\u4EE3\u78BC\u52A0\u5165\u5F8C\uFF0C\u5373\u53EF\u63A5\u6536\u8A72\u73ED\u5C08\u5C6C\u7684\u5EE3\u64AD\u529F\u8AB2\u3002"), React.createElement("form", {
    onSubmit: handleCreateClass,
    className: "flex gap-3 mt-4"
  }, React.createElement("input", {
    type: "text",
    placeholder: "\u8F38\u5165\u73ED\u7D1A\u540D\u7A31 (\u4F8B\u5982: 3A \u73ED)...",
    value: newClassName,
    onChange: e => setNewClassName(e.target.value),
    className: "flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm dark:text-white",
    required: true
  }), React.createElement("button", {
    type: "submit",
    className: "bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "plus",
    className: "w-4 h-4"
  }), " \u5EFA\u7ACB\u73ED\u7D1A")), React.createElement("div", {
    className: "flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col mt-4"
  }, React.createElement("div", {
    className: "overflow-y-auto flex-1"
  }, React.createElement("table", {
    className: "w-full text-left text-sm whitespace-nowrap"
  }, React.createElement("thead", {
    className: "bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 font-bold sticky top-0 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-700"
  }, React.createElement("tr", null, React.createElement("th", {
    className: "px-6 py-4"
  }, "\u73ED\u7D1A\u540D\u7A31"), React.createElement("th", {
    className: "px-6 py-4"
  }, "\u52A0\u5165\u4EE3\u78BC (6\u78BC)"), React.createElement("th", {
    className: "px-6 py-4 text-right"
  }, "\u64CD\u4F5C"))), React.createElement("tbody", {
    className: "divide-y divide-slate-50 dark:divide-slate-700/50"
  }, systemClasses.map(c => {
    const classMemberCount = users.filter(u => (u.joinedClasses || []).includes(c.code)).length;
    return React.createElement("tr", {
      key: c.code,
      className: "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
    }, React.createElement("td", {
      className: "px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-2"
    }, React.createElement(Icon, {
      name: "school",
      className: "w-4 h-4 text-indigo-500"
    }), " ", c.name), React.createElement("td", {
      className: "px-6 py-4"
    }, React.createElement("span", {
      className: "px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-widest"
    }, c.code)), React.createElement("td", {
      className: "px-6 py-4 text-right"
    }, React.createElement("div", {
      className: "flex justify-end gap-2"
    }, React.createElement("button", {
      onClick: () => setViewingClass(c),
      className: "px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors"
    }, "\u67E5\u770B\u540D\u55AE (", classMemberCount, ")"), React.createElement("button", {
      onClick: () => handleDeepDeleteClass(c),
      className: "p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
    }, React.createElement(Icon, {
      name: "trash-2",
      className: "w-4 h-4"
    })))));
  }), systemClasses.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "3",
    className: "px-6 py-12 text-center text-slate-400"
  }, "\u76EE\u524D\u5C1A\u7121\u4EFB\u4F55\u73ED\u7D1A"))))))), activeTab === 'classes' && viewingClass && React.createElement("div", {
    className: "space-y-6 animate-fadeIn h-full flex flex-col"
  }, React.createElement("div", {
    className: "flex items-center gap-3 mb-2"
  }, React.createElement("button", {
    onClick: () => setViewingClass(null),
    className: "p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
  }, React.createElement(Icon, {
    name: "arrow-left",
    className: "w-4 h-4 text-slate-600 dark:text-slate-300"
  })), React.createElement("div", null, React.createElement("h3", {
    className: "text-xl font-bold dark:text-white flex items-center gap-2"
  }, viewingClass.name, " - \u6210\u54E1\u540D\u55AE"), React.createElement("p", {
    className: "text-xs text-slate-500 font-mono tracking-widest"
  }, "\u4EE3\u78BC: ", viewingClass.code))), React.createElement("div", {
    className: "flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col"
  }, React.createElement("div", {
    className: "overflow-y-auto flex-1 p-2"
  }, React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
  }, users.filter(u => (u.joinedClasses || []).includes(viewingClass.code)).map(u => {
    var _u$displayName;
    return React.createElement("div", {
      key: u.uid,
      className: "flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-indigo-200 transition-colors"
    }, React.createElement("div", {
      className: "flex items-center gap-3 overflow-hidden"
    }, React.createElement("div", {
      className: "w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 text-slate-500 dark:text-slate-300"
    }, ((_u$displayName = u.displayName) === null || _u$displayName === void 0 || (_u$displayName = _u$displayName[0]) === null || _u$displayName === void 0 ? void 0 : _u$displayName.toUpperCase()) || 'U'), React.createElement("div", {
      className: "truncate"
    }, React.createElement("div", {
      className: "font-bold text-sm dark:text-white truncate"
    }, u.displayName || '未命名'), React.createElement("div", {
      className: "text-[10px] text-slate-400 truncate"
    }, u.email))), React.createElement("button", {
      onClick: () => handleKickUserFromClass(u, viewingClass.code),
      className: "p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors shrink-0",
      title: "\u8E22\u51FA\u73ED\u7D1A"
    }, React.createElement(Icon, {
      name: "user-minus",
      className: "w-4 h-4"
    })));
  }), users.filter(u => (u.joinedClasses || []).includes(viewingClass.code)).length === 0 && React.createElement("div", {
    className: "col-span-full py-12 text-center text-slate-400 text-sm"
  }, "\u8A72\u73ED\u7D1A\u76EE\u524D\u6C92\u6709\u4EFB\u4F55\u5B78\u751F"))))), activeTab === 'users' && !selectedUser && React.createElement("div", {
    className: "space-y-6 animate-fadeIn h-full flex flex-col"
  }, React.createElement("div", {
    className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
  }, React.createElement("h3", {
    className: "text-2xl font-bold dark:text-white"
  }, "\u7528\u6236\u6578\u64DA\u7BA1\u7406"), React.createElement("div", {
    className: "flex gap-2 w-full sm:w-auto flex-col sm:flex-row"
  }, React.createElement("button", {
    onClick: handleScanExpired,
    disabled: isScanning,
    className: "bg-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-sm hover:bg-orange-600 flex items-center justify-center gap-2 disabled:opacity-50"
  }, isScanning ? React.createElement(Icon, {
    name: "loader",
    className: "w-4 h-4 animate-spin"
  }) : '掃描未清過期'), React.createElement("div", {
    className: "relative w-full sm:w-auto flex-1"
  }, React.createElement("input", {
    type: "text",
    placeholder: "\u641C\u5C0B\u7528\u6236\u540D\u5B57\u6216 Email...",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    className: "w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm dark:text-white"
  })))), expiredReport && React.createElement("div", {
    className: "p-4 bg-orange-50 border border-orange-200 rounded-3xl animate-fadeIn shrink-0"
  }, React.createElement("div", {
    className: "flex justify-between items-center mb-3"
  }, React.createElement("h4", {
    className: "font-bold text-orange-800 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "alert-circle",
    className: "w-5 h-5"
  }), " \u672A\u6E05\u7406\u904E\u671F\u529F\u8AB2\u7684\u5B78\u751F\u540D\u55AE (", expiredReport.length, " \u4EBA)"), React.createElement("button", {
    onClick: () => setExpiredReport(null),
    className: "text-orange-500"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-5 h-5"
  }))), React.createElement("div", {
    className: "max-h-40 overflow-y-auto space-y-2 pr-2 scrollbar-hide"
  }, expiredReport.map(r => {
    var _r$user$displayName;
    return React.createElement("div", {
      key: r.user.uid,
      className: "flex justify-between items-center bg-white p-3 rounded-2xl border border-orange-100 cursor-pointer shadow-sm hover:scale-[1.01] transition-transform",
      onClick: () => setSelectedUser(r.user)
    }, React.createElement("span", {
      className: "font-bold text-sm flex items-center gap-2"
    }, React.createElement("div", {
      className: "w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs"
    }, ((_r$user$displayName = r.user.displayName) === null || _r$user$displayName === void 0 || (_r$user$displayName = _r$user$displayName[0]) === null || _r$user$displayName === void 0 ? void 0 : _r$user$displayName.toUpperCase()) || 'U'), r.user.displayName, " ", React.createElement("span", {
      className: "text-xs text-slate-400 font-normal hidden sm:inline-block ml-1"
    }, r.user.email)), React.createElement("span", {
      className: "bg-red-100 text-red-600 px-3 py-1 rounded-lg font-bold text-xs"
    }, r.expiredCount, " \u9805\u672A\u6E05"));
  }))), React.createElement("div", {
    className: "flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col"
  }, React.createElement("div", {
    className: "overflow-y-auto flex-1"
  }, React.createElement("table", {
    className: "w-full text-left text-sm whitespace-nowrap"
  }, React.createElement("thead", {
    className: "bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 font-bold sticky top-0 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-700"
  }, React.createElement("tr", null, React.createElement("th", {
    className: "px-6 py-4"
  }, "\u7528\u6236\u8CC7\u8A0A"), React.createElement("th", {
    className: "px-6 py-4"
  }, "\u8EAB\u5206\u6B0A\u9650"), React.createElement("th", {
    className: "px-6 py-4"
  }, "\u6700\u5F8C\u4E0A\u7DDA"))), React.createElement("tbody", {
    className: "divide-y divide-slate-50 dark:divide-slate-700/50"
  }, filteredUsers.map(u => {
    var _u$displayName2;
    const isAdm = u.email === ADMIN_EMAIL;
    const isWhite = allowedEmails.includes(u.email);
    const isBlack = blacklistedEmails.includes(u.email);
    const onlineStatus = getUserStatus(u.lastSeen);
    return React.createElement("tr", {
      key: u.uid,
      className: `hover:bg-indigo-50/30 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer ${isBlack ? 'opacity-60' : ''}`,
      onClick: () => setSelectedUser(u)
    }, React.createElement("td", {
      className: "px-6 py-4"
    }, React.createElement("div", {
      className: "flex items-center gap-3"
    }, React.createElement("div", {
      className: `relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${isBlack ? 'bg-red-800' : isAdm ? 'bg-purple-500' : isWhite ? 'bg-emerald-500' : 'bg-slate-400'}`
    }, ((_u$displayName2 = u.displayName) === null || _u$displayName2 === void 0 || (_u$displayName2 = _u$displayName2[0]) === null || _u$displayName2 === void 0 ? void 0 : _u$displayName2.toUpperCase()) || 'U'), React.createElement("div", null, React.createElement("div", {
      className: "font-bold flex items-center gap-2 dark:text-white"
    }, u.displayName || '未命名'), React.createElement("div", {
      className: "text-xs text-slate-400"
    }, u.email)))), React.createElement("td", {
      className: "px-6 py-4"
    }, isBlack ? React.createElement("span", {
      className: "inline-flex px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold"
    }, "\u9ED1\u540D\u55AE (\u5DF2\u5C01\u9396)") : isAdm ? React.createElement("span", {
      className: "inline-flex px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold"
    }, "\u7BA1\u7406\u54E1") : isWhite ? React.createElement("span", {
      className: "inline-flex px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold"
    }, "\u767D\u540D\u55AE") : React.createElement("span", {
      className: "inline-flex px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold"
    }, "\u666E\u901A\u7528\u6236")), React.createElement("td", {
      className: "px-6 py-4 text-slate-500 text-xs font-mono"
    }, formatRelativeTime(u.lastSeen)));
  }), filteredUsers.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "3",
    className: "px-6 py-12 text-center text-slate-400"
  }, usersLoading && !usersLoadedOnce ? "正在載入用戶..." : "找不到符合條件的用戶"))))), React.createElement("div", {
    className: "p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3"
  }, React.createElement("div", {
    className: "text-xs font-bold text-slate-400"
  }, "\u5DF2\u8F09\u5165 ", users.length, " \u4F4D\u7528\u6236\uFF0C\u6BCF\u9801 20 \u4F4D\uFF1B\u641C\u5C0B\u53EA\u6703\u5957\u7528\u65BC\u5DF2\u8F09\u5165\u8CC7\u6599\u3002"), usersHasMore ? React.createElement("button", {
    onClick: () => fetchUsersPage(false),
    disabled: usersLoading,
    className: "px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
  }, usersLoading ? React.createElement(React.Fragment, null, React.createElement(Icon, {
    name: "loader",
    className: "w-4 h-4 animate-spin"
  }), " \u8F09\u5165\u4E2D...") : React.createElement(React.Fragment, null, React.createElement(Icon, {
    name: "chevrons-down",
    className: "w-4 h-4"
  }), " \u52A0\u8F09\u66F4\u591A")) : React.createElement("span", {
    className: "px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100"
  }, "\u5DF2\u8F09\u5165\u5168\u90E8\u5DF2\u8B80\u53D6\u7528\u6236")))), activeTab === 'users' && selectedUser && React.createElement("div", {
    className: "space-y-6 animate-fadeIn"
  }, React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("button", {
    onClick: () => setSelectedUser(null),
    className: "p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-5 h-5 text-slate-600 dark:text-slate-400"
  })), React.createElement("div", null, React.createElement("h3", {
    className: "text-2xl font-bold flex items-center gap-2 dark:text-white"
  }, selectedUser.displayName, " \u7684\u8A73\u7D30\u7D00\u9304"), React.createElement("p", {
    className: "text-sm text-slate-500"
  }, selectedUser.email))), React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-5 gap-3"
  }, React.createElement("div", {
    className: "p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
  }, React.createElement("div", {
    className: "text-[10px] font-black text-slate-400 uppercase"
  }, "\u529F\u8AB2\u7E3D\u6578"), React.createElement("div", {
    className: "text-2xl font-black dark:text-white"
  }, selectedUserStats.total)), React.createElement("div", {
    className: "p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
  }, React.createElement("div", {
    className: "text-[10px] font-black text-slate-400 uppercase"
  }, "\u672A\u5B8C\u6210"), React.createElement("div", {
    className: "text-2xl font-black text-orange-500"
  }, selectedUserStats.unfinished)), React.createElement("div", {
    className: "p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
  }, React.createElement("div", {
    className: "text-[10px] font-black text-slate-400 uppercase"
  }, "\u5EE3\u64AD\u529F\u8AB2"), React.createElement("div", {
    className: "text-2xl font-black text-indigo-500"
  }, selectedUserStats.synced)), React.createElement("div", {
    className: "p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
  }, React.createElement("div", {
    className: "text-[10px] font-black text-slate-400 uppercase"
  }, "\u904E\u671F\u672A\u8655\u7406"), React.createElement("div", {
    className: "text-2xl font-black text-red-500"
  }, selectedUserStats.expired)), React.createElement("div", {
    className: "p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
  }, React.createElement("div", {
    className: "text-[10px] font-black text-slate-400 uppercase"
  }, "\u52A0\u5165\u73ED\u7D1A"), React.createElement("div", {
    className: "text-2xl font-black text-emerald-500"
  }, selectedUserStats.classes))), React.createElement("div", {
    className: "bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start"
  }, React.createElement("div", {
    className: "w-full md:w-auto flex-1 space-y-4"
  }, React.createElement("h4", {
    className: "font-bold text-slate-700 dark:text-slate-200"
  }, "\u7528\u6236\u6A94\u6848\u7DE8\u8F2F"), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("input", {
    type: "text",
    value: newName,
    onChange: e => setNewName(e.target.value),
    className: "flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white",
    placeholder: "\u986F\u793A\u540D\u7A31"
  }), React.createElement("button", {
    onClick: handleUpdateUserName,
    className: "px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-transform"
  }, "\u66F4\u65B0")), React.createElement("div", {
    className: "flex gap-2 pt-2 flex-wrap"
  }, !allowedEmails.includes(selectedUser.email) ? React.createElement("button", {
    onClick: () => updateConfig('allowedEmails', arrayUnion(selectedUser.email)),
    className: "text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1"
  }, React.createElement(Icon, {
    name: "plus",
    className: "w-3 h-3"
  }), " \u52A0\u5165\u767D\u540D\u55AE") : React.createElement("button", {
    onClick: () => updateConfig('allowedEmails', arrayRemove(selectedUser.email)),
    className: "text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-1"
  }, React.createElement(Icon, {
    name: "minus",
    className: "w-3 h-3"
  }), " \u79FB\u51FA\u767D\u540D\u55AE"), !blacklistedEmails.includes(selectedUser.email) ? React.createElement("button", {
    onClick: () => handleBlockUserEmail(selectedUser.email),
    className: "text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1"
  }, "\u5C01\u9396 (\u9ED1\u540D\u55AE)") : React.createElement("button", {
    onClick: () => updateConfig('blacklistedEmails', arrayRemove(selectedUser.email)),
    className: "text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-xl hover:bg-green-100 transition-colors flex items-center gap-1"
  }, "\u89E3\u9664\u5C01\u9396"), React.createElement("button", {
    onClick: () => handleDeleteUser(selectedUser),
    className: "text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 ml-auto"
  }, React.createElement(Icon, {
    name: "trash-2",
    className: "w-3 h-3"
  }), " \u5FB9\u5E95\u522A\u9664\u5E33\u865F")))), React.createElement("div", {
    className: "bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden p-3"
  }, React.createElement("div", {
    className: "max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-hide"
  }, userHomeworks.length === 0 ? React.createElement("p", {
    className: "text-slate-400 text-center py-6"
  }, "\u6B64\u7528\u6236\u6C92\u6709\u4EFB\u4F55\u7D00\u9304") : userHomeworks.map(h => {
    var _subjects$find3;
    return React.createElement("div", {
      key: h.id,
      className: `p-4 rounded-2xl border text-sm flex justify-between items-start transition-all ${h.completed ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm'}`
    }, React.createElement("div", null, React.createElement("div", {
      className: "flex items-center gap-2 mb-1.5"
    }, React.createElement("span", {
      className: `inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${((_subjects$find3 = subjects.find(s => s.name === h.subject)) === null || _subjects$find3 === void 0 ? void 0 : _subjects$find3.color) || 'bg-slate-100 text-slate-600 border-slate-200'}`
    }, h.subject || '其他'), h.completed ? React.createElement("span", {
      className: "text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold"
    }, "\u5DF2\u5B8C\u6210") : React.createElement("span", {
      className: "text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md font-bold"
    }, "\u672A\u5B8C\u6210")), React.createElement("div", {
      className: `font-medium ${h.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`
    }, h.description)), React.createElement("div", {
      className: "flex items-center gap-3"
    }, React.createElement("div", {
      className: "text-xs font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800"
    }, formatDueDate(h.dueDate)), React.createElement("div", {
      className: "flex gap-1"
    }, React.createElement("button", {
      onClick: () => handleAdminDeleteItem(h.id),
      className: "p-2 text-slate-400 hover:text-red-600 bg-slate-100 dark:bg-slate-900 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
    }, React.createElement(Icon, {
      name: "trash-2",
      className: "w-4 h-4"
    })))));
  })))), activeTab === 'tasks' && React.createElement("div", {
    className: "space-y-6 animate-fadeIn"
  }, React.createElement("div", {
    className: "flex flex-col lg:flex-row lg:items-end justify-between gap-4"
  }, React.createElement("div", null, React.createElement("h3", {
    className: "text-2xl font-bold dark:text-white"
  }, "\u5EE3\u64AD\u4EFB\u52D9\u4E2D\u5FC3"), React.createElement("p", {
    className: "text-sm text-slate-500 mt-1"
  }, "\u7BA1\u7406\u54E1\u4E00\u767C\u653E\u5EE3\u64AD\u529F\u8AB2\uFF0C\u7CFB\u7D71\u6703\u5373\u6642\u52A0\u5165\u76EE\u6A19\u5B78\u751F\u500B\u4EBA\u624B\u518A\u3002")), React.createElement("button", {
    type: "button",
    onClick: handlePushAllPublicTasksNow,
    disabled: isPushingPublic || publicTasks.filter(task => !task.forceExpired).length === 0,
    className: "px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-black shadow-lg hover:opacity-95 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
  }, React.createElement(Icon, {
    name: isPushingPublic ? "loader" : "send",
    className: `w-4 h-4 ${isPushingPublic ? 'animate-spin' : ''}`
  }), " \u91CD\u65B0\u6D3E\u767C\u5168\u90E8\u529F\u8AB2")), pushReport && React.createElement("div", {
    className: "rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
  }, React.createElement("div", null, React.createElement("div", {
    className: "font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "check-circle-2",
    className: "w-5 h-5"
  }), " \u6700\u8FD1\u6D3E\u767C\u5B8C\u6210"), React.createElement("div", {
    className: "text-xs font-bold text-emerald-700/80 dark:text-emerald-200/80 mt-1"
  }, pushReport.type === 'all' ? `共 ${pushReport.totalTasks} 份功課` : pushReport.subject, " \xB7 \u76EE\u6A19 ", pushReport.totalTargets || pushReport.total || 0, " \xB7 \u65B0\u589E ", pushReport.created || 0, " \xB7 \u4FEE\u5FA9/\u66F4\u65B0 ", pushReport.updated || 0)), React.createElement("button", {
    type: "button",
    onClick: () => setPushReport(null),
    className: "text-xs font-black text-emerald-700 dark:text-emerald-300 underline"
  }, "\u6536\u8D77")), React.createElement("div", {
    className: "bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col shadow-sm"
  }, React.createElement("div", {
    className: "overflow-y-auto max-h-[600px]"
  }, React.createElement("table", {
    className: "w-full text-left text-sm whitespace-nowrap"
  }, React.createElement("thead", {
    className: "bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 font-bold sticky top-0 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-700"
  }, React.createElement("tr", null, React.createElement("th", {
    className: "px-6 py-4"
  }, "\u4EFB\u52D9\u5167\u5BB9"), React.createElement("th", {
    className: "px-6 py-4"
  }, "\u76EE\u6A19/\u5E7E\u6642\u4EA4"), React.createElement("th", {
    className: "px-6 py-4"
  }, "\u5B78\u751F\u9032\u5EA6"), React.createElement("th", {
    className: "px-6 py-4 text-right"
  }, "\u64CD\u4F5C"))), React.createElement("tbody", {
    className: "divide-y divide-slate-50 dark:divide-slate-700/50"
  }, publicTasks.map(task => {
    var _subjects$find4;
    const cls = systemClasses.find(c => c.code === task.targetClass);
    const targetName = cls ? cls.name : task.targetClass || '全校';
    const stats = taskStats[task.id];
    return React.createElement("tr", {
      key: task.id,
      className: "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
    }, React.createElement("td", {
      className: "px-6 py-4 whitespace-normal min-w-[200px] max-w-[300px]"
    }, React.createElement("div", {
      className: "flex gap-2 items-center mb-1.5"
    }, React.createElement("span", {
      className: `px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${((_subjects$find4 = subjects.find(s => s.name === task.subject)) === null || _subjects$find4 === void 0 ? void 0 : _subjects$find4.color) || 'bg-slate-100 text-slate-600 border-slate-200'}`
    }, task.subject)), React.createElement("div", {
      className: "font-bold dark:text-white leading-relaxed"
    }, task.description)), React.createElement("td", {
      className: "px-6 py-4"
    }, React.createElement("div", {
      className: "flex flex-col gap-1.5 items-start"
    }, React.createElement("span", {
      className: "text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-lg font-bold max-w-[120px] truncate"
    }, targetName), React.createElement("span", {
      className: "text-xs text-slate-400 font-mono mt-1"
    }, "Due: ", formatDueDate(task.dueDate)))), React.createElement("td", {
      className: "px-6 py-4 min-w-[200px]"
    }, stats ? React.createElement("div", {
      className: "flex flex-col gap-2"
    }, React.createElement("div", {
      className: "flex items-center justify-between text-xs font-bold text-slate-500"
    }, React.createElement("span", {
      className: "text-indigo-500"
    }, stats.synced, " \u5DF2\u5230\u4F4D"), React.createElement("span", null, "\u5171 ", stats.total, " \u4EBA")), React.createElement("div", {
      className: "w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden"
    }, React.createElement("div", {
      className: "bg-emerald-500 h-1.5 rounded-full",
      style: {
        width: stats.total ? `${stats.synced / stats.total * 100}%` : '0%'
      }
    })), stats.pendingList.length > 0 && React.createElement("div", {
      className: "mt-1 text-[10px] text-slate-400 max-w-[150px] truncate",
      title: stats.pendingList.join(', ')
    }, "\u672A\u5230\u4F4D: ", stats.pendingList.join(', ')), stats.pendingList.length === 0 && stats.total > 0 && React.createElement("span", {
      className: "text-[10px] text-emerald-500 font-bold"
    }, "\u5168\u90E8\u5DF2\u5230\u4F4D \uD83C\uDF89"), React.createElement("span", {
      className: "text-[10px] text-slate-400"
    }, "\u5176\u4E2D ", stats.completed || 0, " \u4EBA\u5DF2\u6A19\u8A18\u5B8C\u6210")) : React.createElement("button", {
      onClick: () => fetchTaskProgress(task),
      disabled: isFetchingStats,
      className: "px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
    }, "\u67E5\u770B\u9032\u5EA6")), React.createElement("td", {
      className: "px-6 py-4 text-right"
    }, React.createElement("div", {
      className: "flex flex-col sm:flex-row justify-end gap-2"
    }, React.createElement("button", {
      onClick: () => handlePushPublicTaskNow(task),
      disabled: isPushingPublic || task.forceExpired,
      className: "px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold text-xs transition-colors shadow-sm disabled:opacity-40 flex items-center justify-center gap-1.5"
    }, React.createElement(Icon, {
      name: isPushingPublic ? "loader" : "send",
      className: `w-3.5 h-3.5 ${isPushingPublic ? 'animate-spin' : ''}`
    }), " \u63A8\u9001"), React.createElement("button", {
      onClick: () => handleDeletePublicTask(task),
      className: "px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
    }, "\u64A4\u56DE"))));
  }), publicTasks.length === 0 && React.createElement("tr", null, React.createElement("td", {
    colSpan: "4",
    className: "px-6 py-12 text-center text-slate-400"
  }, "\u66AB\u7121\u5EE3\u64AD\u4EFB\u52D9"))))))), activeTab === 'syncMonitor' && React.createElement("div", {
    className: "space-y-7 animate-fadeIn"
  }, React.createElement("div", {
    className: "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-slate-900 p-6 text-white shadow-xl"
  }, React.createElement("div", {
    className: "absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
  }), React.createElement("div", {
    className: "relative z-10 grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-6 items-end"
  }, React.createElement("div", null, React.createElement("div", {
    className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-black mb-3"
  }, React.createElement(Icon, {
    name: "activity",
    className: "w-4 h-4"
  }), " \u5EE3\u64AD\u6D3E\u767C\u72C0\u614B"), React.createElement("h3", {
    className: "text-3xl font-black tracking-tight"
  }, "\u67E5\u770B\u6BCF\u4EFD\u5EE3\u64AD\u529F\u8AB2\u662F\u5426\u5DF2\u6D3E\u767C\u5230\u5B78\u751F\u500B\u4EBA\u624B\u518A"), React.createElement("p", {
    className: "text-sm text-indigo-100 mt-2 font-bold"
  }, "\u67E5\u770B\u5DF2\u5230\u4F4D\u3001\u672A\u5230\u4F4D\u3001\u5B8C\u6210\u7387\uFF0C\u4E26\u53EF\u76F4\u63A5\u63D0\u9192\u672A\u5230\u4F4D\u5B78\u751F\u6216\u958B\u555F\u66F4\u65B0\u963B\u6514\u756B\u9762\u3002")), React.createElement("div", {
    className: "flex flex-col sm:flex-row lg:flex-col gap-2"
  }, React.createElement("button", {
    onClick: fetchAllTaskProgress,
    disabled: isFetchingStats || publicTasks.length === 0,
    className: "px-5 py-3 rounded-2xl bg-white text-indigo-700 text-sm font-black shadow-md hover:bg-indigo-50 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
  }, React.createElement(Icon, {
    name: isFetchingStats ? "loader" : "scan-search",
    className: `w-4 h-4 ${isFetchingStats ? 'animate-spin' : ''}`
  }), " \u6383\u63CF\u5168\u90E8\u4EFB\u52D9"), React.createElement("button", {
    onClick: () => setActiveTab('settings'),
    className: "px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-black hover:bg-white/20 active:scale-95 flex items-center justify-center gap-2"
  }, React.createElement(Icon, {
    name: "shield-alert",
    className: "w-4 h-4"
  }), " \u7BA1\u7406\u66F4\u65B0\u963B\u6514\u756B\u9762")))), React.createElement("div", {
    className: "grid grid-cols-1 gap-5"
  }, publicTasks.length === 0 && React.createElement("div", {
    className: "text-center py-16 rounded-3xl bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 font-bold"
  }, "\u76EE\u524D\u6C92\u6709\u5EE3\u64AD\u4EFB\u52D9\u53EF\u76E3\u63A7"), publicTasks.map(task => {
    var _subjects$find5, _stats$pendingList2, _stats$pendingList3;
    const cls = systemClasses.find(c => c.code === task.targetClass);
    const targetName = task.targetClass === '全校' || !task.targetClass ? '全校' : (cls === null || cls === void 0 ? void 0 : cls.name) || task.targetClass;
    const stats = taskStats[task.id];
    const percent = stats !== null && stats !== void 0 && stats.total ? Math.round(stats.synced / stats.total * 100) : 0;
    return React.createElement("div", {
      key: task.id,
      className: "bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 p-5 shadow-sm overflow-hidden hover:shadow-xl transition-all"
    }, React.createElement("div", {
      className: "flex flex-col xl:flex-row xl:items-start justify-between gap-4"
    }, React.createElement("div", {
      className: "min-w-0 flex-1"
    }, React.createElement("div", {
      className: "flex flex-wrap items-center gap-2 mb-2"
    }, React.createElement("span", {
      className: `px-2.5 py-1 rounded-lg text-[10px] font-bold border ${((_subjects$find5 = subjects.find(s => s.name === task.subject)) === null || _subjects$find5 === void 0 ? void 0 : _subjects$find5.color) || 'bg-slate-100 text-slate-600 border-slate-200'}`
    }, task.subject || '其他'), React.createElement("span", {
      className: "px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
    }, targetName), React.createElement("span", {
      className: "text-[10px] text-slate-400 font-mono"
    }, formatFirebaseDateTime(task.createdAt) || '最近發佈')), React.createElement("div", {
      className: "font-black text-slate-800 dark:text-white text-base break-words"
    }, task.description), React.createElement("div", {
      className: "text-xs text-slate-400 mt-2"
    }, "\u4EA4\u671F\uFF1A", formatDueDate(task.dueDate))), React.createElement("button", {
      onClick: () => fetchTaskProgress(task),
      disabled: isFetchingStats,
      className: "px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
    }, React.createElement(Icon, {
      name: isFetchingStats ? "loader" : "refresh-cw",
      className: `w-4 h-4 ${isFetchingStats ? 'animate-spin' : ''}`
    }), " \u66F4\u65B0\u72C0\u614B")), stats ? React.createElement("div", {
      className: "mt-5 space-y-4"
    }, React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-4 gap-3"
    }, React.createElement("div", {
      className: "rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4"
    }, React.createElement("div", {
      className: "text-[10px] font-black text-slate-400 uppercase"
    }, "\u76EE\u6A19\u5B78\u751F"), React.createElement("div", {
      className: "text-2xl font-black dark:text-white"
    }, stats.total)), React.createElement("div", {
      className: "rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 p-4"
    }, React.createElement("div", {
      className: "text-[10px] font-black text-indigo-400 uppercase"
    }, "\u5DF2\u5230\u4F4D"), React.createElement("div", {
      className: "text-2xl font-black text-indigo-600 dark:text-indigo-300"
    }, stats.synced)), React.createElement("div", {
      className: "rounded-2xl bg-orange-50 dark:bg-orange-900/20 p-4"
    }, React.createElement("div", {
      className: "text-[10px] font-black text-orange-400 uppercase"
    }, "\u672A\u5230\u4F4D"), React.createElement("div", {
      className: "text-2xl font-black text-orange-600 dark:text-orange-300"
    }, stats.pendingList.length)), React.createElement("div", {
      className: "rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-4"
    }, React.createElement("div", {
      className: "text-[10px] font-black text-emerald-400 uppercase"
    }, "\u5DF2\u5B8C\u6210"), React.createElement("div", {
      className: "text-2xl font-black text-emerald-600 dark:text-emerald-300"
    }, stats.completed))), React.createElement("div", null, React.createElement("div", {
      className: "flex justify-between text-xs font-black text-slate-500 mb-1"
    }, React.createElement("span", null, "\u5230\u4F4D\u7387"), React.createElement("span", null, percent, "%")), React.createElement("div", {
      className: "w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
    }, React.createElement("div", {
      className: "h-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all",
      style: {
        width: `${percent}%`
      }
    }))), React.createElement("div", {
      className: "grid grid-cols-1 sm:grid-cols-4 gap-2"
    }, React.createElement("button", {
      type: "button",
      onClick: () => handlePushPublicTaskNow(task),
      disabled: isPushingPublic || !((_stats$pendingList2 = stats.pendingList) !== null && _stats$pendingList2 !== void 0 && _stats$pendingList2.length),
      className: "px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center gap-2"
    }, React.createElement(Icon, {
      name: isPushingPublic ? "loader" : "send",
      className: `w-4 h-4 ${isPushingPublic ? 'animate-spin' : ''}`
    }), " \u91CD\u65B0\u6D3E\u767C\u672A\u5230\u4F4D"), React.createElement("button", {
      type: "button",
      onClick: () => handleSendSyncReminder(task, stats),
      disabled: !((_stats$pendingList3 = stats.pendingList) !== null && _stats$pendingList3 !== void 0 && _stats$pendingList3.length),
      className: "px-4 py-3 rounded-2xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 disabled:opacity-40 flex items-center justify-center gap-2"
    }, React.createElement(Icon, {
      name: "bell-ring",
      className: "w-4 h-4"
    }), " \u63D0\u9192\u672A\u5230\u4F4D"), React.createElement("button", {
      type: "button",
      onClick: () => {
        setActiveTab('settings');
        setMaintenanceModeInput('updating');
        setMaintenanceTitleInput('系統更新中');
        setMaintenanceMessageInput('管理員正在更新電子手冊功能，請稍後再回來。');
      },
      className: "px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:opacity-90 flex items-center justify-center gap-2"
    }, React.createElement(Icon, {
      name: "shield-alert",
      className: "w-4 h-4"
    }), " \u958B\u555F\u963B\u6514\u8A2D\u5B9A"), React.createElement("button", {
      type: "button",
      onClick: () => setActiveTab('tasks'),
      className: "px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center gap-2"
    }, React.createElement(Icon, {
      name: "list-checks",
      className: "w-4 h-4"
    }), " \u8FD4\u56DE\u4EFB\u52D9\u4E2D\u5FC3")), stats.pendingList.length > 0 ? React.createElement("div", {
      className: "rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 p-4"
    }, React.createElement("div", {
      className: "font-black text-orange-700 dark:text-orange-300 text-sm mb-2 flex items-center gap-2"
    }, React.createElement(Icon, {
      name: "user-x",
      className: "w-4 h-4"
    }), " \u672A\u5230\u4F4D\u5B78\u751F"), React.createElement("div", {
      className: "flex flex-wrap gap-2"
    }, stats.pendingList.map(name => React.createElement("span", {
      key: name,
      className: "px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/40 text-orange-700 dark:text-orange-200 text-xs font-bold border border-orange-100 dark:border-orange-800"
    }, name)))) : stats.total > 0 ? React.createElement("div", {
      className: "rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-2"
    }, React.createElement(Icon, {
      name: "party-popper",
      className: "w-4 h-4"
    }), " \u5168\u90E8\u76EE\u6A19\u5B78\u751F\u5DF2\u6536\u5230") : React.createElement("div", {
      className: "rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 p-4 font-bold text-slate-400"
    }, "\u76EE\u524D\u6C92\u6709\u7B26\u5408\u6B64\u76EE\u6A19\u7684\u5B78\u751F\u3002\u8ACB\u78BA\u8A8D\u5B78\u751F\u5DF2\u52A0\u5165\u6B63\u78BA\u73ED\u7D1A\u3002")) : React.createElement("div", {
      className: "mt-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-5 text-center text-slate-400 font-bold text-sm"
    }, "\u6309\u300C\u66F4\u65B0\u72C0\u614B\u300D\u5F8C\u6703\u986F\u793A\u5DF2\u6D3E\u767C / \u672A\u5230\u4F4D\u5B78\u751F\u540D\u55AE\u3002"));
  }))), activeTab === 'settings' && React.createElement("div", {
    className: "space-y-8 animate-fadeIn max-w-5xl"
  }, React.createElement("div", null, React.createElement("h3", {
    className: "text-2xl font-bold mb-2 dark:text-white"
  }, "\u6838\u5FC3\u7CFB\u7D71\u8A2D\u5B9A")), React.createElement("div", {
    className: "bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
  }, React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-2"
  }, React.createElement("h4", {
    className: "font-bold flex items-center gap-2 dark:text-white"
  }, React.createElement(Icon, {
    name: "radio",
    className: "w-5 h-5 text-orange-500"
  }), " \u5168\u57DF\u8DD1\u99AC\u71C8\u516C\u544A"), React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "\u8F38\u5165\u516C\u544A\u5167\u5BB9\uFF0C\u5168\u6821\u6240\u6709\u5B78\u751F\u756B\u9762\u4E0A\u65B9\u5C07\u6703\u5373\u6642\u986F\u793A\u8DD1\u99AC\u71C8\u63D0\u793A\u3002\u6E05\u7A7A\u5247\u96B1\u85CF\u8DD1\u99AC\u71C8\u3002")), React.createElement("div", {
    className: "p-6"
  }, React.createElement("div", {
    className: "flex gap-3"
  }, React.createElement("input", {
    type: "text",
    placeholder: "\u4F8B\u5982\uFF1A\u660E\u5929\u56E0\u98B1\u98A8\u8972\u6E2F\uFF0C\u5168\u6821\u505C\u8AB2\u4E00\u5929...",
    value: announcementInput,
    onChange: e => setAnnouncementInput(e.target.value),
    className: "flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:text-white transition-all"
  }), React.createElement("button", {
    onClick: () => updateConfig('announcementText', announcementInput),
    className: "bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors flex items-center gap-2 active:scale-95 shadow-sm"
  }, React.createElement(Icon, {
    name: "save",
    className: "w-4 h-4"
  }), " \u767C\u4F48\u516C\u544A")))), React.createElement("div", {
    className: "bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
  }, React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/40 flex flex-col gap-2"
  }, React.createElement("h4", {
    className: "font-bold flex items-center gap-2 dark:text-white"
  }, React.createElement(Icon, {
    name: "shield-alert",
    className: "w-5 h-5 text-indigo-500"
  }), " \u66F4\u65B0\u963B\u6514\u756B\u9762"), React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "\u7CFB\u7D71\u66F4\u65B0\u3001\u8CC7\u6599\u91CD\u6574\u6216\u7DAD\u8B77\u6642\uFF0C\u53EF\u66AB\u6642\u963B\u64CB\u666E\u901A\u7528\u6236\u9032\u5165\uFF0C\u7BA1\u7406\u54E1\u4ECD\u53EF\u9032\u5165\u5F8C\u53F0\u64CD\u4F5C\u3002")), React.createElement("div", {
    className: "p-6 space-y-4"
  }, React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-2"
  }, [{
    value: 'normal',
    label: '正常開放',
    icon: 'unlock'
  }, {
    value: 'updating',
    label: '網站更新中',
    icon: 'hammer'
  }, {
    value: 'restructuring',
    label: '資料重整中',
    icon: 'database'
  }, {
    value: 'maintenance',
    label: '系統維護中',
    icon: 'lock'
  }].map(opt => React.createElement("button", {
    key: opt.value,
    type: "button",
    onClick: () => setMaintenanceModeInput(opt.value),
    className: `p-3 rounded-2xl border text-left transition-all ${maintenanceModeInput === opt.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'}`
  }, React.createElement(Icon, {
    name: opt.icon,
    className: "w-4 h-4 mb-2"
  }), React.createElement("div", {
    className: "text-xs font-black"
  }, opt.label)))), React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-3"
  }, React.createElement("input", {
    type: "text",
    placeholder: "\u963B\u6514\u756B\u9762\u6A19\u984C",
    value: maintenanceTitleInput,
    onChange: e => setMaintenanceTitleInput(e.target.value),
    className: "px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
  }), React.createElement("input", {
    type: "text",
    placeholder: "\u9810\u8A08\u6062\u5FA9\u6642\u9593\uFF0C\u4F8B\u5982 \u7D04 10 \u5206\u9418",
    value: estimatedTimeInput,
    onChange: e => setEstimatedTimeInput(e.target.value),
    className: "px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
  })), React.createElement("textarea", {
    rows: "3",
    placeholder: "\u963B\u6514\u756B\u9762\u8AAA\u660E\u6587\u5B57",
    value: maintenanceMessageInput,
    onChange: e => setMaintenanceMessageInput(e.target.value),
    className: "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white resize-none"
  }), React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-2"
  }, React.createElement("button", {
    onClick: handleSaveMaintenanceBlock,
    className: "flex-1 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-sm"
  }, React.createElement(Icon, {
    name: "save",
    className: "w-4 h-4"
  }), " \u5132\u5B58\u963B\u6514\u8A2D\u5B9A"), React.createElement("button", {
    onClick: () => {
      setMaintenanceModeInput('normal');
      setMaintenanceTitleInput('網站已恢復');
      setMaintenanceMessageInput('');
      setEstimatedTimeInput('');
    },
    className: "px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600"
  }, "\u5FEB\u901F\u8A2D\u70BA\u6B63\u5E38")))), React.createElement("div", {
    className: "bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
  }, React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-2"
  }, React.createElement("h4", {
    className: "font-bold flex items-center gap-2 dark:text-white"
  }, React.createElement(Icon, {
    name: "sparkles",
    className: "w-5 h-5 text-indigo-500"
  }), " \u7248\u672C\u66F4\u65B0\u5F48\u7A97"), React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "\u767C\u4F48\u65B0\u7248\u5F8C\uFF0C\u7528\u6236\u7B2C\u4E00\u6B21\u6253\u958B\u9801\u9762\u6703\u81EA\u52D5\u770B\u5230\u300C\u66F4\u65B0\u5167\u5BB9 + \u4F7F\u7528\u65B9\u6CD5\u300D\u3002\u540C\u4E00\u7248\u672C\u53EA\u6703\u5F48\u4E00\u6B21\uFF1B\u60F3\u518D\u6B21\u5F48\u51FA\u8ACB\u66F4\u6539\u7248\u672C\u865F\u3002")), React.createElement("div", {
    className: "p-6 space-y-4"
  }, React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, React.createElement("div", null, React.createElement("label", {
    className: "text-xs font-black text-slate-400 uppercase ml-1"
  }, "\u7248\u672C\u865F"), React.createElement("input", {
    type: "text",
    placeholder: "\u4F8B\u5982\uFF1Av1.4.0",
    value: updateVersionInput,
    onChange: e => setUpdateVersionInput(e.target.value),
    className: "mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
  })), React.createElement("div", null, React.createElement("label", {
    className: "text-xs font-black text-slate-400 uppercase ml-1"
  }, "\u986F\u793A\u5C0D\u8C61"), React.createElement("div", {
    className: "mt-1"
  }, React.createElement(CustomDropdown, {
    value: updateAudienceInput,
    onChange: setUpdateAudienceInput,
    options: [{
      value: 'students',
      label: '普通用戶'
    }, {
      value: 'all',
      label: '所有人'
    }, {
      value: 'admin',
      label: '只給管理員'
    }],
    customClasses: "w-full flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none font-bold hover:bg-white dark:hover:bg-slate-800 transition-all"
  })))), React.createElement("div", null, React.createElement("label", {
    className: "text-xs font-black text-slate-400 uppercase ml-1"
  }, "\u5F48\u7A97\u6A19\u984C"), React.createElement("input", {
    type: "text",
    placeholder: "\u4F8B\u5982\uFF1A\u96FB\u5B50\u624B\u518A Pro \u5DF2\u66F4\u65B0",
    value: updateTitleInput,
    onChange: e => setUpdateTitleInput(e.target.value),
    className: "mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
  })), React.createElement("div", null, React.createElement("label", {
    className: "text-xs font-black text-slate-400 uppercase ml-1"
  }, "\u66F4\u65B0\u5497\u5572\u4E5C"), React.createElement("textarea", {
    rows: "4",
    placeholder: "例如：\n新增通知中心\n新增廣播功課自動派發\n修正科目自動預測問題",
    value: updateSummaryInput,
    onChange: e => setUpdateSummaryInput(e.target.value),
    className: "mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all resize-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "text-xs font-black text-slate-400 uppercase ml-1"
  }, "\u9EDE\u6A23\u4F7F\u7528\u65B0\u529F\u80FD"), React.createElement("textarea", {
    rows: "4",
    placeholder: "例如：\n1. 按右上角小鈴鐺查看通知\n2. 有新廣播功課時，打開通知中心查看\n3. 廣播功課會出現在個人手冊",
    value: updateGuideInput,
    onChange: e => setUpdateGuideInput(e.target.value),
    className: "mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all resize-none"
  })), React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4"
  }, React.createElement("label", {
    className: "flex items-center gap-3 cursor-pointer"
  }, React.createElement("input", {
    type: "checkbox",
    checked: updatePopupEnabledInput,
    onChange: e => setUpdatePopupEnabledInput(e.target.checked),
    className: "w-4 h-4 accent-indigo-600"
  }), React.createElement("span", {
    className: "text-sm font-black text-indigo-700 dark:text-indigo-300"
  }, "\u555F\u7528\u81EA\u52D5\u5F48\u7A97")), React.createElement("button", {
    onClick: handlePublishUpdateNotice,
    className: "bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-sm"
  }, React.createElement(Icon, {
    name: "send",
    className: "w-4 h-4"
  }), " \u767C\u4F48\u66F4\u65B0\u5F48\u7A97")), React.createElement("div", {
    className: "rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, React.createElement("h5", {
    className: "font-black text-sm dark:text-white flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "history",
    className: "w-4 h-4 text-indigo-500"
  }), " \u4E4B\u524D\u767C\u653E\u904E\u7684\u66F4\u65B0\u8CC7\u8A0A"), React.createElement("span", {
    className: "text-[10px] font-black text-slate-400"
  }, "\u53EF\u91CD\u65B0\u767C\u653E")), ((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateHistory) || []).length === 0 ? React.createElement("div", {
    className: "text-xs font-bold text-slate-400 py-4 text-center"
  }, "\u66AB\u6642\u672A\u6709\u6B77\u53F2\u66F4\u65B0\u8CC7\u8A0A") : React.createElement("div", {
    className: "space-y-2 max-h-56 overflow-y-auto scrollbar-hide"
  }, ((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateHistory) || []).slice().reverse().map((notice, idx) => React.createElement("div", {
    key: `${notice.version || 'old'}-${notice.publishedAt || idx}`,
    className: "flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "font-black text-sm dark:text-white truncate"
  }, notice.title || '系統已更新'), React.createElement("div", {
    className: "text-[11px] text-slate-400 font-mono truncate"
  }, notice.version || '無版本', " \xB7 ", formatFirebaseDateTime(notice.publishedAt) || '未知時間')), React.createElement("button", {
    type: "button",
    onClick: () => handleRepublishUpdateNotice(notice),
    className: "px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-black hover:bg-indigo-100 dark:hover:bg-indigo-800/50 shrink-0"
  }, "\u518D\u6B21\u767C\u653E"))))))), React.createElement("div", {
    className: "bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
  }, React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center"
  }, React.createElement("h4", {
    className: "font-bold flex items-center gap-2 dark:text-white"
  }, React.createElement(Icon, {
    name: "check-circle-2",
    className: "w-5 h-5 text-emerald-500"
  }), " \u767D\u540D\u55AE\u7CFB\u7D71"), React.createElement("label", {
    className: "relative cursor-pointer w-12 h-7 shrink-0"
  }, React.createElement("input", {
    type: "checkbox",
    className: "sr-only peer",
    checked: (systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.whitelistEnabled) || false,
    onChange: e => updateConfig('whitelistEnabled', e.target.checked)
  }), React.createElement("div", {
    className: "absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-emerald-500 transition-colors shadow-inner"
  }), React.createElement("div", {
    className: "absolute top-[2px] left-[2px] bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-[20px] shadow-sm border border-slate-300 dark:border-slate-600"
  }))), React.createElement("div", {
    className: "p-6"
  }, React.createElement("form", {
    onSubmit: handleAddWhitelist,
    className: "flex gap-3 mb-6"
  }, React.createElement("input", {
    type: "email",
    placeholder: "\u8F38\u5165\u96FB\u90F5\u5730\u5740...",
    value: newEmail,
    onChange: e => setNewEmail(e.target.value),
    className: "flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white transition-all",
    required: true
  }), React.createElement("button", {
    type: "submit",
    disabled: isSubmitting,
    className: "bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 active:scale-95 shadow-sm"
  }, React.createElement(Icon, {
    name: "plus",
    className: "w-4 h-4"
  }), " \u65B0\u589E")), React.createElement("div", {
    className: "max-h-60 overflow-y-auto border border-slate-100 dark:border-slate-700 rounded-2xl scrollbar-hide"
  }, allowedEmails.length === 0 ? React.createElement("div", {
    className: "p-8 text-center text-slate-400 text-sm"
  }, "\u767D\u540D\u55AE\u76EE\u524D\u70BA\u7A7A") : React.createElement("table", {
    className: "w-full text-left text-sm"
  }, React.createElement("thead", {
    className: "bg-slate-50 dark:bg-slate-900/50 text-slate-500"
  }, React.createElement("tr", null, React.createElement("th", {
    className: "px-5 py-3 font-bold"
  }, "\u96FB\u90F5\u5730\u5740"), React.createElement("th", {
    className: "px-5 py-3 text-right font-bold"
  }, "\u64CD\u4F5C"))), React.createElement("tbody", {
    className: "divide-y divide-slate-100 dark:divide-slate-700/50"
  }, allowedEmails.map(email => React.createElement("tr", {
    key: email,
    className: "hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
  }, React.createElement("td", {
    className: "px-5 py-4 dark:text-slate-300"
  }, email), React.createElement("td", {
    className: "px-5 py-4 text-right"
  }, React.createElement("button", {
    onClick: () => handleRemoveWhitelist(email),
    className: "p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
  }, React.createElement(Icon, {
    name: "trash-2",
    className: "w-4 h-4"
  })))))))))), React.createElement("div", {
    className: "bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
  }, React.createElement("div", {
    className: "p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center"
  }, React.createElement("h4", {
    className: "font-bold flex items-center gap-2 dark:text-white"
  }, React.createElement(Icon, {
    name: "alert-circle",
    className: "w-5 h-5 text-red-500"
  }), " \u9ED1\u540D\u55AE\u7CFB\u7D71"), React.createElement("label", {
    className: "relative cursor-pointer w-12 h-7 shrink-0"
  }, React.createElement("input", {
    type: "checkbox",
    className: "sr-only peer",
    checked: (systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.blacklistEnabled) || false,
    onChange: e => updateConfig('blacklistEnabled', e.target.checked)
  }), React.createElement("div", {
    className: "absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-red-500 transition-colors shadow-inner"
  }), React.createElement("div", {
    className: "absolute top-[2px] left-[2px] bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-[20px] shadow-sm border border-slate-300 dark:border-slate-600"
  }))), React.createElement("div", {
    className: "p-6"
  }, React.createElement("form", {
    onSubmit: handleAddBlacklist,
    className: "flex gap-3 mb-6"
  }, React.createElement("input", {
    type: "email",
    placeholder: "\u8F38\u5165\u8981\u5C01\u9396\u7684\u96FB\u90F5\u5730\u5740...",
    value: newBlacklistEmail,
    onChange: e => setNewBlacklistEmail(e.target.value),
    className: "flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-red-500 outline-none dark:text-white transition-all",
    required: true
  }), React.createElement("button", {
    type: "submit",
    disabled: isSubmitting,
    className: "bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center gap-2 active:scale-95 shadow-sm"
  }, "\u5C01\u9396")), React.createElement("div", {
    className: "max-h-60 overflow-y-auto border border-slate-100 dark:border-slate-700 rounded-2xl scrollbar-hide"
  }, blacklistedEmails.length === 0 ? React.createElement("div", {
    className: "p-8 text-center text-slate-400 text-sm"
  }, "\u9ED1\u540D\u55AE\u76EE\u524D\u70BA\u7A7A") : React.createElement("table", {
    className: "w-full text-left text-sm"
  }, React.createElement("thead", {
    className: "bg-slate-50 dark:bg-slate-900/50 text-slate-500"
  }, React.createElement("tr", null, React.createElement("th", {
    className: "px-5 py-3 font-bold"
  }, "\u88AB\u5C01\u9396\u7684\u96FB\u90F5\u5730\u5740"), React.createElement("th", {
    className: "px-5 py-3 text-right font-bold"
  }, "\u64CD\u4F5C"))), React.createElement("tbody", {
    className: "divide-y divide-slate-100 dark:divide-slate-700/50"
  }, blacklistedEmails.map(email => React.createElement("tr", {
    key: email,
    className: "hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
  }, React.createElement("td", {
    className: "px-5 py-4 dark:text-slate-300"
  }, email), React.createElement("td", {
    className: "px-5 py-4 text-right"
  }, React.createElement("button", {
    onClick: () => handleRemoveBlacklist(email),
    className: "px-3 py-1.5 rounded-lg text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 font-bold transition-colors"
  }, "\u89E3\u9664\u5C01\u9396"))))))))))));
}
function NavItem(_ref26) {
  let id = _ref26.id,
    icon = _ref26.icon,
    label = _ref26.label,
    active = _ref26.active,
    onClick = _ref26.onClick,
    t = _ref26.t;
  return React.createElement("button", {
    type: "button",
    onClick: onClick,
    "aria-label": label,
    "aria-current": active ? 'page' : undefined,
    className: `relative flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-2xl transition-all duration-300 ease-out ${active ? `nav-active ${t.lightBg} ${t.text} shadow-sm -translate-y-0.5` : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`
  }, React.createElement(Icon, {
    name: icon,
    className: `w-5 h-5 shrink-0 transition-transform duration-300 ${active ? 'scale-110' : ''}`
  }), React.createElement("span", {
    className: "font-black text-[10px] leading-none whitespace-nowrap"
  }, label));
}
function LegacyUserSettingsPage(_ref27) {
  let user = _ref27.user,
    userProfile = _ref27.userProfile,
    t = _ref27.t,
    unreadNotificationCount = _ref27.unreadNotificationCount,
    subjectCount = _ref27.subjectCount,
    isDarkMode = _ref27.isDarkMode,
    setIsDarkMode = _ref27.setIsDarkMode,
    themeColor = _ref27.themeColor,
    setThemeColor = _ref27.setThemeColor,
    layoutMode = _ref27.layoutMode,
    setLayoutMode = _ref27.setLayoutMode,
    customLayout = _ref27.customLayout,
    setCustomLayout = _ref27.setCustomLayout,
    advancedPrefs = _ref27.advancedPrefs,
    setAdvancedPrefs = _ref27.setAdvancedPrefs,
    onOpenNotifications = _ref27.onOpenNotifications,
    onOpenAppearance = _ref27.onOpenAppearance,
    onOpenSubjects = _ref27.onOpenSubjects,
    onGoClass = _ref27.onGoClass,
    onExport = _ref27.onExport,
    onLogout = _ref27.onLogout;
  const displayName = (userProfile === null || userProfile === void 0 ? void 0 : userProfile.displayName) || (user === null || user === void 0 ? void 0 : user.displayName) || '學生';
  const email = (user === null || user === void 0 ? void 0 : user.email) || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.email) || '';
  const initial = String(displayName || email || 'E').trim().charAt(0).toUpperCase();
  const layoutOptions = [{
    value: 'normal',
    label: '完整模式',
    desc: '顯示主頁卡片、時間表、輸入欄同任務列表',
    icon: 'layout-dashboard'
  }, {
    value: 'minimal',
    label: '極簡模式',
    desc: '只保留重要卡片同任務列表，主頁更乾淨',
    icon: 'minimize-2'
  }, {
    value: 'custom',
    label: '自定義',
    desc: '自己決定主頁每個區塊是否顯示',
    icon: 'sliders-horizontal'
  }];
  const customBlocks = [{
    key: 'cards',
    label: '狀態卡片',
    desc: '今日急件、明日預告、測驗考試統計',
    icon: 'columns-3'
  }, {
    key: 'timetable',
    label: '即時課堂',
    desc: '顯示目前課節、倒數及下一節',
    icon: 'calendar-clock'
  }, {
    key: 'input',
    label: '新增功課欄',
    desc: '主頁直接新增功課或測驗',
    icon: 'square-pen'
  }, {
    key: 'list',
    label: '任務列表',
    desc: '顯示個人手冊功課列表',
    icon: 'list-checks'
  }];
  const advancedOptions = [{
    key: 'largeText',
    label: '大字體模式',
    desc: 'iPad 同手機閱讀更舒服，適合長時間使用',
    icon: 'text'
  }, {
    key: 'reduceMotion',
    label: '減少動畫',
    desc: '降低過場動畫，頁面操作更穩定',
    icon: 'wind'
  }, {
    key: 'cleanGlass',
    label: '清晰玻璃模式',
    desc: '降低磨砂透明度，文字更清楚',
    icon: 'glass-water'
  }, {
    key: 'comfortSpacing',
    label: '舒適間距',
    desc: '設定卡片與文字呼吸感更強',
    icon: 'move-horizontal'
  }, {
    key: 'smartHints',
    label: '智能提示',
    desc: '保留過期、時間表等使用提示',
    icon: 'sparkles'
  }, {
    key: 'focusFirst',
    label: '專注優先',
    desc: '主頁更重視今日任務與待辦事項',
    icon: 'target'
  }];
  const quickActionOptions = [{
    key: 'showClassShortcut',
    label: '班級廣播快捷',
    desc: '在設定頁快速查看班級廣播',
    icon: 'school-2'
  }, {
    key: 'showNotificationShortcut',
    label: '通知快捷',
    desc: '在設定頁快速打開通知中心',
    icon: 'bell'
  }, {
    key: 'showSubjectShortcut',
    label: '科目快捷',
    desc: '方便快速進入科目管理',
    icon: 'book-marked'
  }, {
    key: 'showAccountShortcut',
    label: '帳號操作',
    desc: '顯示登出與帳號相關操作',
    icon: 'user-cog'
  }];
  const handleCustomToggle = key => setCustomLayout({
    ...customLayout,
    [key]: !customLayout[key]
  });
  const handleAdvancedToggle = key => setAdvancedPrefs({
    ...advancedPrefs,
    [key]: !(advancedPrefs !== null && advancedPrefs !== void 0 && advancedPrefs[key])
  });
  const themeEntries = Object.entries(THEME_CONFIG);
  const _useState129 = useState({
      appearance: true
    }),
    _useState130 = _slicedToArray(_useState129, 2),
    openSettingsSections = _useState130[0],
    setOpenSettingsSections = _useState130[1];
  const toggleSettingsSection = id => setOpenSettingsSections(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
  const SettingSection = _ref28 => {
    let id = _ref28.id,
      title = _ref28.title,
      desc = _ref28.desc,
      icon = _ref28.icon,
      children = _ref28.children,
      right = _ref28.right,
      _ref28$collapsible = _ref28.collapsible,
      collapsible = _ref28$collapsible === void 0 ? true : _ref28$collapsible;
    const isOpen = collapsible ? !!openSettingsSections[id] : true;
    return React.createElement("section", {
      className: "settings-section rounded-[2rem] bg-white/90 dark:bg-slate-900/90 border border-white/70 dark:border-slate-700 shadow-sm overflow-hidden"
    }, React.createElement("div", {
      className: `p-4 sm:p-5 flex items-start justify-between gap-3 ${isOpen ? 'border-b border-slate-100 dark:border-slate-800' : ''}`
    }, React.createElement("button", {
      type: "button",
      onClick: () => collapsible && toggleSettingsSection(id),
      className: "flex-1 flex items-start gap-3 min-w-0 text-left",
      "aria-expanded": isOpen
    }, React.createElement("div", {
      className: `w-11 h-11 rounded-2xl ${t.lightBg} ${t.text} flex items-center justify-center shrink-0`
    }, React.createElement(Icon, {
      name: icon,
      className: "w-5 h-5"
    })), React.createElement("div", {
      className: "min-w-0"
    }, React.createElement("h3", {
      className: "text-base sm:text-lg font-black text-slate-800 dark:text-white"
    }, title), React.createElement("p", {
      className: "text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 mt-1 leading-relaxed"
    }, desc))), React.createElement("div", {
      className: "flex items-center gap-2 shrink-0"
    }, right, collapsible && React.createElement("button", {
      type: "button",
      onClick: () => toggleSettingsSection(id),
      "aria-label": `${isOpen ? '收合' : '展開'}${title}`,
      className: "w-10 h-10 rounded-xl grid place-items-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
    }, React.createElement(Icon, {
      name: "chevron-down",
      className: `w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`
    })))), isOpen && React.createElement("div", {
      className: "settings-section-content p-4 sm:p-5"
    }, children));
  };
  return React.createElement("div", {
    className: "settings-page-stable settings-shell max-w-3xl mx-auto pb-10 space-y-5 sm:space-y-6"
  }, React.createElement("div", {
    className: "relative overflow-hidden rounded-[1.75rem] p-5 sm:p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-800 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.8)]"
  }, React.createElement("div", {
    className: "absolute -top-20 -right-16 w-56 h-56 rounded-full bg-cyan-300/20 blur-3xl"
  }), React.createElement("div", {
    className: "absolute bottom-0 left-16 w-60 h-32 rounded-full bg-violet-300/20 blur-3xl"
  }), React.createElement("div", {
    className: "relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
  }, React.createElement("div", {
    className: "flex items-center gap-4 min-w-0"
  }, React.createElement("div", {
    className: "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-xl flex items-center justify-center text-2xl font-black shadow-lg shrink-0"
  }, initial), React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-300/20 text-xs font-black text-emerald-200 mb-2"
  }, React.createElement(Icon, {
    name: "badge-check",
    className: "w-3.5 h-3.5"
  }), " v3.1.0 \u5168\u9801\u5DE5\u4F5C\u5340"), React.createElement("h2", {
    className: "text-xl sm:text-2xl font-black tracking-tight truncate"
  }, "\u61C9\u7528\u7A0B\u5F0F\u8A2D\u5B9A"), React.createElement("p", {
    className: "text-sm text-indigo-100 font-bold mt-0.5 truncate"
  }, displayName, " \xB7 ", email || '個人帳戶'))), React.createElement("div", {
    className: "grid grid-cols-2 gap-2 shrink-0"
  }, React.createElement("button", {
    type: "button",
    onClick: onOpenNotifications,
    className: "min-w-0 px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-left hover:bg-white/20 active:scale-[0.98] transition-all"
  }, React.createElement("div", {
    className: "flex items-center gap-2 text-xs font-black text-indigo-100"
  }, React.createElement(Icon, {
    name: "bell",
    className: "w-4 h-4"
  }), "\u901A\u77E5"), React.createElement("div", {
    className: "text-sm font-black mt-1"
  }, unreadNotificationCount > 0 ? `${unreadNotificationCount} 則未讀` : '全部已讀')), React.createElement("button", {
    type: "button",
    onClick: onExport,
    className: "min-w-0 px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-left hover:bg-white/20 active:scale-[0.98] transition-all"
  }, React.createElement("div", {
    className: "flex items-center gap-2 text-xs font-black text-indigo-100"
  }, React.createElement(Icon, {
    name: "download",
    className: "w-4 h-4"
  }), "\u5099\u4EFD"), React.createElement("div", {
    className: "text-sm font-black mt-1"
  }, "\u7ACB\u5373\u532F\u51FA"))))), React.createElement(SettingSection, {
    id: "appearance",
    title: "\u5916\u89C0\u500B\u4EBA\u5316",
    desc: "\u4E3B\u984C\u8272\u3001\u6DF1\u8272\u6A21\u5F0F\u8207\u986F\u793A\u7D30\u7BC0\u3002",
    icon: "palette",
    right: React.createElement("button", {
      type: "button",
      onClick: onOpenAppearance,
      className: "px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700"
    }, "\u9032\u968E")
  }, React.createElement("div", {
    className: "space-y-5"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black text-slate-400 uppercase mb-3"
  }, "\u4E3B\u984C\u984F\u8272"), React.createElement("div", {
    className: "grid grid-cols-4 sm:grid-cols-7 gap-3"
  }, themeEntries.map(_ref29 => {
    let _ref30 = _slicedToArray(_ref29, 2),
      key = _ref30[0],
      config = _ref30[1];
    return React.createElement("button", {
      key: key,
      type: "button",
      onClick: () => setThemeColor(key),
      className: `rounded-[1.25rem] p-2 border transition-all active:scale-95 ${themeColor === key ? `${config.lightBg} ${config.border} shadow-md scale-[1.02]` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:scale-[1.02]'}`
    }, React.createElement("div", {
      className: `w-full h-10 rounded-xl bg-gradient-to-br ${config.gradient} mb-2`
    }), React.createElement("div", {
      className: `text-[11px] font-black ${themeColor === key ? config.text : 'text-slate-400'}`
    }, config.name));
  }))), React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, React.createElement("button", {
    type: "button",
    onClick: () => setIsDarkMode(false),
    className: `p-4 rounded-[1.5rem] border flex items-center gap-3 text-left transition-all ${!isDarkMode ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300'}`
  }, React.createElement(Icon, {
    name: "sun",
    className: "w-5 h-5"
  }), React.createElement("div", null, React.createElement("div", {
    className: "font-black text-sm"
  }, "\u6DFA\u8272\u6A21\u5F0F"), React.createElement("div", {
    className: "text-[11px] font-bold opacity-75"
  }, "\u4E7E\u6DE8\u6E05\u723D"))), React.createElement("button", {
    type: "button",
    onClick: () => setIsDarkMode(true),
    className: `p-4 rounded-[1.5rem] border flex items-center gap-3 text-left transition-all ${isDarkMode ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300'}`
  }, React.createElement(Icon, {
    name: "moon",
    className: "w-5 h-5"
  }), React.createElement("div", null, React.createElement("div", {
    className: "font-black text-sm"
  }, "\u6DF1\u8272\u6A21\u5F0F"), React.createElement("div", {
    className: "text-[11px] font-bold opacity-75"
  }, "\u591C\u665A\u8B77\u773C")))))), React.createElement(SettingSection, {
    id: "layout",
    title: "\u4E3B\u9801\u6392\u7248",
    desc: "\u9078\u64C7\u5B8C\u6574\u3001\u6975\u7C21\u6216\u81EA\u5B9A\u7FA9\u986F\u793A\u3002",
    icon: "layout-template"
  }, React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-3"
  }, layoutOptions.map(opt => React.createElement("button", {
    key: opt.value,
    type: "button",
    onClick: () => setLayoutMode(opt.value),
    className: `p-4 rounded-[1.5rem] border text-left transition-all active:scale-95 ${layoutMode === opt.value ? `${t.lightBg} ${t.border} ${t.text} shadow-md` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:border-slate-300'}`
  }, React.createElement(Icon, {
    name: opt.icon,
    className: "w-5 h-5 mb-3"
  }), React.createElement("div", {
    className: "font-black text-sm"
  }, opt.label), React.createElement("div", {
    className: "text-[11px] font-bold opacity-70 mt-1 leading-relaxed"
  }, opt.desc)))), React.createElement("div", {
    className: `rounded-[1.75rem] border p-4 transition-all ${layoutMode === 'custom' ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-800' : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-75'}`
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3 mb-3"
  }, React.createElement("div", null, React.createElement("div", {
    className: "font-black text-sm text-slate-800 dark:text-white"
  }, "\u81EA\u5B9A\u7FA9\u4E3B\u9801\u5340\u584A"), React.createElement("div", {
    className: "text-[11px] font-bold text-slate-400"
  }, "\u9078\u64C7\u300C\u81EA\u5B9A\u7FA9\u300D\u5F8C\uFF0C\u4EE5\u4E0B\u958B\u95DC\u6703\u5957\u7528\u5230\u4E3B\u9801\u3002"))), React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, customBlocks.map(block => React.createElement("button", {
    key: block.key,
    type: "button",
    onClick: () => {
      setLayoutMode('custom');
      handleCustomToggle(block.key);
    },
    className: `rounded-2xl border p-4 text-left flex items-start justify-between gap-3 transition-all active:scale-[0.98] ${customLayout[block.key] ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`
  }, React.createElement("div", {
    className: "flex items-start gap-3 min-w-0"
  }, React.createElement("div", {
    className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${customLayout[block.key] ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`
  }, React.createElement(Icon, {
    name: block.icon,
    className: "w-4 h-4"
  })), React.createElement("div", null, React.createElement("div", {
    className: "font-black text-sm text-slate-800 dark:text-white"
  }, block.label), React.createElement("div", {
    className: "text-[11px] font-bold text-slate-400 mt-0.5 leading-relaxed"
  }, block.desc))), React.createElement("div", {
    className: `w-12 h-7 rounded-full relative shrink-0 transition-all ${customLayout[block.key] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`
  }, React.createElement("span", {
    className: `absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all ${customLayout[block.key] ? 'left-[24px]' : 'left-[4px]'}`
  })))))))), React.createElement(SettingSection, {
    id: "experience",
    title: "\u4F7F\u7528\u9AD4\u9A57",
    desc: "\u8ABF\u6574\u6587\u5B57\u3001\u52D5\u756B\u3001\u73BB\u7483\u6548\u679C\u53CA\u5FEB\u6377\u5165\u53E3\u3002",
    icon: "sliders-horizontal"
  }, React.createElement("div", {
    className: "space-y-5"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black text-slate-400 uppercase mb-3"
  }, "\u9AD4\u9A57\u958B\u95DC"), React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, advancedOptions.map(opt => {
    const actualEnabled = opt.key === 'smartHints' ? (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.smartHints) !== false : (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs[opt.key]) === true;
    return React.createElement("button", {
      key: opt.key,
      type: "button",
      onClick: () => handleAdvancedToggle(opt.key),
      className: `rounded-2xl border p-4 text-left flex items-start justify-between gap-3 transition-all active:scale-[0.98] ${actualEnabled ? `${t.lightBg} ${t.border}` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`
    }, React.createElement("div", {
      className: "flex items-start gap-3 min-w-0"
    }, React.createElement("div", {
      className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${actualEnabled ? `bg-gradient-to-br ${t.gradient} text-white` : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`
    }, React.createElement(Icon, {
      name: opt.icon,
      className: "w-4 h-4"
    })), React.createElement("div", null, React.createElement("div", {
      className: "font-black text-sm text-slate-800 dark:text-white"
    }, opt.label), React.createElement("div", {
      className: "text-[11px] font-bold text-slate-400 mt-0.5 leading-relaxed"
    }, opt.desc))), React.createElement("div", {
      className: `w-11 h-6 rounded-full relative shrink-0 transition-all ${actualEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`
    }, React.createElement("span", {
      className: `absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${actualEnabled ? 'left-[21px]' : 'left-[3px]'}`
    })));
  }))), React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black text-slate-400 uppercase mb-3"
  }, "\u5FEB\u6377\u5165\u53E3\u986F\u793A"), React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, quickActionOptions.map(opt => {
    const enabled = (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs[opt.key]) !== false;
    return React.createElement("button", {
      key: opt.key,
      type: "button",
      onClick: () => handleAdvancedToggle(opt.key),
      className: `rounded-2xl border p-4 text-left flex items-start justify-between gap-3 transition-all active:scale-[0.98] ${enabled ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-75'}`
    }, React.createElement("div", {
      className: "flex items-start gap-3 min-w-0"
    }, React.createElement("div", {
      className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${enabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`
    }, React.createElement(Icon, {
      name: opt.icon,
      className: "w-4 h-4"
    })), React.createElement("div", null, React.createElement("div", {
      className: "font-black text-sm text-slate-800 dark:text-white"
    }, opt.label), React.createElement("div", {
      className: "text-[11px] font-bold text-slate-400 mt-0.5 leading-relaxed"
    }, opt.desc))), React.createElement("div", {
      className: `w-11 h-6 rounded-full relative shrink-0 transition-all ${enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`
    }, React.createElement("span", {
      className: `absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${enabled ? 'left-[21px]' : 'left-[3px]'}`
    })));
  }))))), React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-5"
  }, React.createElement(SettingSection, {
    id: "notifications",
    title: "\u901A\u77E5\u8207\u63D0\u9192",
    desc: "\u67E5\u770B\u672A\u8B80\u3001\u5EE3\u64AD\u8207\u66F4\u65B0\u3002",
    icon: "bell-ring",
    collapsible: false,
    right: unreadNotificationCount > 0 ? React.createElement("span", {
      className: "px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-black"
    }, unreadNotificationCount) : null
  }, React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.showNotificationShortcut) !== false && React.createElement("button", {
    type: "button",
    onClick: onOpenNotifications,
    className: "p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 text-left hover:scale-[1.01] active:scale-[0.98] transition-all"
  }, React.createElement(Icon, {
    name: "bell",
    className: "w-5 h-5 text-orange-500 mb-2"
  }), React.createElement("div", {
    className: "font-black text-sm text-orange-700 dark:text-orange-300"
  }, "\u6253\u958B\u901A\u77E5\u4E2D\u5FC3"), React.createElement("div", {
    className: "text-[11px] font-bold text-orange-600/70 dark:text-orange-200/70 mt-1"
  }, "\u67E5\u770B\u5EE3\u64AD\u3001\u66F4\u65B0\u3001\u904E\u671F\u529F\u8AB2")), (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.showClassShortcut) !== false && React.createElement("button", {
    type: "button",
    onClick: onGoClass,
    className: "p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-left hover:scale-[1.01] active:scale-[0.98] transition-all"
  }, React.createElement(Icon, {
    name: "school-2",
    className: "w-5 h-5 text-emerald-500 mb-2"
  }), React.createElement("div", {
    className: "font-black text-sm text-emerald-700 dark:text-emerald-300"
  }, "\u67E5\u770B\u73ED\u7D1A\u5EE3\u64AD"), React.createElement("div", {
    className: "text-[11px] font-bold text-emerald-600/70 dark:text-emerald-200/70 mt-1"
  }, "\u67E5\u770B\u8001\u5E2B\u767C\u653E\u7684\u529F\u8AB2")))), React.createElement(SettingSection, {
    id: "account",
    title: "\u79D1\u76EE\u8207\u5E33\u865F",
    desc: "\u7BA1\u7406\u79D1\u76EE\u3001\u5099\u4EFD\u53CA\u5E33\u6236\u3002",
    icon: "user-cog",
    collapsible: false
  }, React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.showSubjectShortcut) !== false && React.createElement("button", {
    type: "button",
    onClick: onOpenSubjects,
    className: "sm:col-span-2 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-900/[0.25] dark:to-sky-900/20 border border-indigo-100 dark:border-indigo-800 text-left hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-between gap-4"
  }, React.createElement("div", {
    className: "flex items-center gap-3 min-w-0"
  }, React.createElement("div", {
    className: "w-11 h-11 rounded-2xl bg-indigo-600 text-white grid place-items-center shrink-0 shadow-md"
  }, React.createElement(Icon, {
    name: "book-marked",
    className: "w-5 h-5"
  })), React.createElement("div", null, React.createElement("div", {
    className: "font-black text-sm text-indigo-700 dark:text-indigo-300"
  }, "\u79D1\u76EE\u7BA1\u7406"), React.createElement("div", {
    className: "text-xs font-bold text-indigo-600/70 dark:text-indigo-200/70 mt-1"
  }, "\u5DF2\u8A2D\u5B9A ", subjectCount, " \u500B\u79D1\u76EE \xB7 \u6539\u540D\u3001\u6392\u5E8F\u53CA\u984F\u8272"))), React.createElement(Icon, {
    name: "chevron-right",
    className: "w-5 h-5 text-indigo-400 shrink-0"
  })), React.createElement("button", {
    type: "button",
    onClick: onExport,
    className: "p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-left hover:scale-[1.01] active:scale-[0.98] transition-all"
  }, React.createElement(Icon, {
    name: "download",
    className: "w-5 h-5 text-emerald-500 mb-2"
  }), React.createElement("div", {
    className: "font-black text-sm text-emerald-700 dark:text-emerald-300"
  }, "\u532F\u51FA\u5099\u4EFD"), React.createElement("div", {
    className: "text-xs font-bold text-emerald-600/70 dark:text-emerald-200/70 mt-1"
  }, "\u4E0B\u8F09\u529F\u8AB2\u3001\u79D1\u76EE\u53CA\u6642\u9593\u8868")), (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.showAccountShortcut) !== false && React.createElement("button", {
    type: "button",
    onClick: onLogout,
    className: "p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-left hover:scale-[1.01] active:scale-[0.98] transition-all"
  }, React.createElement(Icon, {
    name: "log-out",
    className: "w-5 h-5 text-red-500 mb-2"
  }), React.createElement("div", {
    className: "font-black text-sm text-red-700 dark:text-red-300"
  }, "\u767B\u51FA\u5E33\u865F"), React.createElement("div", {
    className: "text-[11px] font-bold text-red-600/70 dark:text-red-200/70 mt-1"
  }, "\u5207\u63DB\u6216\u91CD\u65B0\u767B\u5165"))))));
}
const SettingToggle = _ref31 => {
  let t = _ref31.t,
    enabled = _ref31.enabled,
    onChange = _ref31.onChange,
    icon = _ref31.icon,
    title = _ref31.title,
    desc = _ref31.desc;
  return React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": enabled,
    onClick: onChange,
    className: "settings-control-row w-full flex items-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/70 text-left hover:border-indigo-200 dark:hover:border-indigo-700"
  }, React.createElement("span", {
    className: `w-10 h-10 rounded-xl grid place-items-center shrink-0 ${enabled ? `bg-gradient-to-br ${t.gradient} text-white shadow-md` : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`
  }, React.createElement(Icon, {
    name: icon,
    className: "w-4 h-4"
  })), React.createElement("span", {
    className: "min-w-0 flex-1"
  }, React.createElement("span", {
    className: "block text-sm font-black text-slate-800 dark:text-white"
  }, title), React.createElement("span", {
    className: "block text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 leading-relaxed"
  }, desc)), React.createElement("span", {
    className: `w-12 h-7 rounded-full relative shrink-0 transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`
  }, React.createElement("span", {
    className: `absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all ${enabled ? 'left-[25px]' : 'left-[3px]'}`
  })));
};
const SettingsActionRow = _ref32 => {
  let icon = _ref32.icon,
    title = _ref32.title,
    desc = _ref32.desc,
    onClick = _ref32.onClick,
    _ref32$tone = _ref32.tone,
    tone = _ref32$tone === void 0 ? 'slate' : _ref32$tone,
    _ref32$trailing = _ref32.trailing,
    trailing = _ref32$trailing === void 0 ? 'chevron' : _ref32$trailing;
  const toneMap = {
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/[0.35] text-indigo-600 dark:text-indigo-300',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/[0.35] text-emerald-600 dark:text-emerald-300',
    orange: 'bg-orange-100 dark:bg-orange-900/[0.35] text-orange-600 dark:text-orange-300',
    red: 'bg-red-100 dark:bg-red-900/[0.35] text-red-600 dark:text-red-300'
  };
  return React.createElement("button", {
    type: "button",
    onClick: onClick,
    className: "settings-control-row w-full flex items-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
  }, React.createElement("span", {
    className: `w-11 h-11 rounded-2xl grid place-items-center shrink-0 ${toneMap[tone] || toneMap.slate}`
  }, React.createElement(Icon, {
    name: icon,
    className: "w-5 h-5"
  })), React.createElement("span", {
    className: "min-w-0 flex-1"
  }, React.createElement("span", {
    className: "block text-sm font-black text-slate-800 dark:text-white"
  }, title), React.createElement("span", {
    className: "block text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 leading-relaxed"
  }, desc)), trailing === 'chevron' ? React.createElement(Icon, {
    name: "chevron-right",
    className: "w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0"
  }) : React.createElement("span", {
    className: "text-xs font-black text-slate-500 dark:text-slate-300 shrink-0"
  }, trailing));
};
const SettingsPanel = _ref33 => {
  let t = _ref33.t,
    title = _ref33.title,
    desc = _ref33.desc,
    icon = _ref33.icon,
    children = _ref33.children;
  return React.createElement("section", {
    className: "settings-panel-enter rounded-[2rem] bg-white/[0.92] dark:bg-slate-900/[0.92] border border-white/70 dark:border-slate-700 shadow-[0_24px_70px_-38px_rgba(15,23,42,.55)] overflow-hidden"
  }, React.createElement("div", {
    className: "p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4"
  }, React.createElement("div", {
    className: `w-12 h-12 rounded-2xl ${t.lightBg} ${t.text} grid place-items-center shrink-0`
  }, React.createElement(Icon, {
    name: icon,
    className: "w-5 h-5"
  })), React.createElement("div", null, React.createElement("h3", {
    className: "text-xl font-black text-slate-900 dark:text-white"
  }, title), React.createElement("p", {
    className: "text-sm font-bold text-slate-400 dark:text-slate-500 mt-1"
  }, desc))), React.createElement("div", {
    className: "p-4 sm:p-6"
  }, children));
};
function UserSettingsPage(_ref34) {
  var _window$__EHANDBOOK_A;
  let user = _ref34.user,
    userProfile = _ref34.userProfile,
    t = _ref34.t,
    unreadNotificationCount = _ref34.unreadNotificationCount,
    subjectCount = _ref34.subjectCount,
    itemCount = _ref34.itemCount,
    isOnline = _ref34.isOnline,
    appearanceMode = _ref34.appearanceMode,
    setAppearanceMode = _ref34.setAppearanceMode,
    themeColor = _ref34.themeColor,
    setThemeColor = _ref34.setThemeColor,
    layoutMode = _ref34.layoutMode,
    setLayoutMode = _ref34.setLayoutMode,
    customLayout = _ref34.customLayout,
    setCustomLayout = _ref34.setCustomLayout,
    advancedPrefs = _ref34.advancedPrefs,
    setAdvancedPrefs = _ref34.setAdvancedPrefs,
    onOpenNotifications = _ref34.onOpenNotifications,
    onOpenSubjects = _ref34.onOpenSubjects,
    collab = _ref34.collab,
    notify = _ref34.notify,
    onGoClass = _ref34.onGoClass,
    onExport = _ref34.onExport,
    onResetPassword = _ref34.onResetPassword,
    onRefreshApp = _ref34.onRefreshApp,
    onLogout = _ref34.onLogout;
  const _useState131 = useState('account'),
    _useState132 = _slicedToArray(_useState131, 2),
    activeCategory = _useState132[0],
    setActiveCategory = _useState132[1];
  const displayName = (userProfile === null || userProfile === void 0 ? void 0 : userProfile.displayName) || (user === null || user === void 0 ? void 0 : user.displayName) || '學生';
  const email = (user === null || user === void 0 ? void 0 : user.email) || (userProfile === null || userProfile === void 0 ? void 0 : userProfile.email) || '';
  const initial = String(displayName || email || 'E').trim().charAt(0).toUpperCase();
  const persistenceMode = ((_window$__EHANDBOOK_A = window.__EHANDBOOK_AUTH_DEBUG__) === null || _window$__EHANDBOOK_A === void 0 ? void 0 : _window$__EHANDBOOK_A.persistenceMode) || 'checking';
  const standaloneMode = isStandaloneMode();
  const themeEntries = Object.entries(THEME_CONFIG);
  const updatePref = (key, value) => setAdvancedPrefs({
    ...advancedPrefs,
    [key]: value
  });
  const togglePref = function (key) {
    let defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return updatePref(key, !((advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs[key]) ?? defaultValue));
  };
  const updateCustomBlock = key => {
    setLayoutMode('custom');
    setCustomLayout({
      ...customLayout,
      [key]: !(customLayout !== null && customLayout !== void 0 && customLayout[key])
    });
  };
  const categories = [{
    id: 'account',
    label: '帳戶',
    desc: '個人資料與班級',
    icon: 'user-cog'
  }, {
    id: 'appearance',
    label: '外觀與體驗',
    desc: '主題、字體與動畫',
    icon: 'palette'
  }, {
    id: 'homepage',
    label: '首頁與功課',
    desc: '版面及顯示內容',
    icon: 'layout-template'
  }, {
    id: 'reminders',
    label: '通知與提醒',
    desc: '控制通知分類',
    icon: 'bell-ring',
    badge: unreadNotificationCount
  }, {
    id: 'data',
    label: '資料與同步',
    desc: '備份及連線狀態',
    icon: 'database'
  }, {
    id: 'app',
    label: '應用程式',
    desc: 'PWA、版本及更新',
    icon: 'smartphone'
  }];
  const layoutOptions = [{
    value: 'normal',
    label: '完整',
    desc: '顯示全部學習資訊',
    icon: 'layout-dashboard'
  }, {
    value: 'minimal',
    label: '極簡',
    desc: '只留下重要工作',
    icon: 'minimize-2'
  }, {
    value: 'custom',
    label: '自訂',
    desc: '逐項選擇首頁內容',
    icon: 'sliders-horizontal'
  }];
  const customBlocks = [{
    key: 'cards',
    label: '明日功課與進度',
    desc: '首頁摘要、完成率及逾期數量',
    icon: 'columns-3'
  }, {
    key: 'timetable',
    label: '即時課堂',
    desc: '目前課節及下一節課',
    icon: 'calendar-clock'
  }, {
    key: 'input',
    label: '快速新增',
    desc: '直接新增功課或測驗',
    icon: 'square-pen'
  }, {
    key: 'list',
    label: '功課列表',
    desc: '個人待辦及完成狀態',
    icon: 'list-checks'
  }];
  return React.createElement("div", {
    className: "settings-shell max-w-5xl mx-auto pb-12 space-y-5"
  }, activeCategory === 'account' && collab && React.createElement(CollaborationAccountCard, {
    collab: collab,
    notify: notify
  }), React.createElement("div", {
    className: "relative overflow-hidden rounded-[2rem] p-5 sm:p-7 bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-800 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,.8)]"
  }, React.createElement("div", {
    className: "absolute -top-24 -right-12 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl"
  }), React.createElement("div", {
    className: "absolute -bottom-24 left-1/3 w-72 h-64 rounded-full bg-violet-400/20 blur-3xl"
  }), React.createElement("div", {
    className: "relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
  }, React.createElement("div", {
    className: "flex items-center gap-4 min-w-0"
  }, React.createElement("div", {
    className: "w-16 h-16 rounded-[1.35rem] bg-white/15 border border-white/20 backdrop-blur-xl grid place-items-center text-2xl font-black shadow-xl shrink-0"
  }, initial), React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "text-xs font-black tracking-[.18em] text-indigo-200"
  }, "STUDYOS SETTINGS"), React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-black tracking-tight mt-1 truncate"
  }, displayName), React.createElement("p", {
    className: "text-sm text-indigo-100 font-bold mt-1 truncate"
  }, email || '個人帳戶'))), React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("span", {
    className: `px-3 py-2 rounded-xl border text-xs font-black ${isOnline ? 'bg-emerald-400/15 border-emerald-300/20 text-emerald-200' : 'bg-orange-400/15 border-orange-300/20 text-orange-200'}`
  }, React.createElement("span", {
    className: `inline-block w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-orange-300'}`
  }), isOnline ? '網絡已連線' : '離線模式'), React.createElement("span", {
    className: "px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-black text-indigo-100"
  }, "v3.1.0")))), React.createElement("div", {
    className: "settings-workspace"
  }, React.createElement("aside", {
    className: "settings-sidebar rounded-[1.75rem] bg-white/[0.88] dark:bg-slate-900/[0.88] border border-white/70 dark:border-slate-700 shadow-sm p-2.5"
  }, React.createElement("div", {
    className: "settings-category-list"
  }, categories.map(category => {
    const active = activeCategory === category.id;
    return React.createElement("button", {
      key: category.id,
      type: "button",
      onClick: () => setActiveCategory(category.id),
      className: `settings-category-button ${active ? 'is-active' : ''} w-full rounded-2xl px-3.5 py-3 flex items-center gap-3 text-left ${active ? `${t.lightBg} ${t.text} shadow-sm` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`
    }, React.createElement("span", {
      className: `w-9 h-9 rounded-xl grid place-items-center shrink-0 ${active ? `bg-gradient-to-br ${t.gradient} text-white shadow-md` : 'bg-slate-100 dark:bg-slate-800'}`
    }, React.createElement(Icon, {
      name: category.icon,
      className: "w-4 h-4"
    })), React.createElement("span", {
      className: "min-w-0 flex-1"
    }, React.createElement("span", {
      className: "block text-sm font-black whitespace-nowrap"
    }, category.label), React.createElement("span", {
      className: "hidden lg:block text-[11px] font-bold opacity-60 mt-0.5 truncate"
    }, category.desc)), !!category.badge && React.createElement("span", {
      className: "min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black grid place-items-center"
    }, category.badge > 9 ? '9+' : category.badge));
  }))), React.createElement("main", {
    className: "min-w-0"
  }, activeCategory === 'account' && React.createElement(SettingsPanel, {
    t: t,
    title: "\u5E33\u6236",
    desc: "\u500B\u4EBA\u8CC7\u6599\u3001\u73ED\u7D1A\u53CA\u767B\u5165\u5B89\u5168\u3002",
    icon: "user-cog"
  }, React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "rounded-[1.5rem] p-4 bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-900/[0.25] dark:to-sky-900/20 border border-indigo-100 dark:border-indigo-800 flex items-center gap-4"
  }, React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-indigo-600 text-white grid place-items-center text-lg font-black shrink-0"
  }, initial), React.createElement("div", {
    className: "min-w-0 flex-1"
  }, React.createElement("div", {
    className: "font-black text-slate-900 dark:text-white truncate"
  }, displayName), React.createElement("div", {
    className: "text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 truncate"
  }, email)), React.createElement("span", {
    className: "px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-black"
  }, "\u5DF2\u767B\u5165")), React.createElement(SettingsActionRow, {
    icon: "book-marked",
    title: "\u79D1\u76EE\u7BA1\u7406",
    desc: `已設定 ${subjectCount} 個科目 · 改名、顏色及排序`,
    onClick: onOpenSubjects,
    tone: "indigo"
  }), React.createElement(SettingsActionRow, {
    icon: "school-2",
    title: "\u6211\u7684\u73ED\u7D1A",
    desc: "\u67E5\u770B\u73ED\u7D1A\u5EE3\u64AD\u53CA\u5DF2\u52A0\u5165\u7684\u73ED\u5225",
    onClick: onGoClass,
    tone: "emerald"
  }), React.createElement(SettingsActionRow, {
    icon: "key-round",
    title: "\u91CD\u8A2D\u5BC6\u78BC",
    desc: "\u767C\u9001\u5BC6\u78BC\u91CD\u8A2D\u9023\u7D50\u5230\u5E33\u6236 Email",
    onClick: onResetPassword,
    tone: "orange"
  }), React.createElement(SettingsActionRow, {
    icon: "log-out",
    title: "\u767B\u51FA\u5E33\u865F",
    desc: "\u96E2\u958B\u76EE\u524D\u5E33\u6236\uFF0C\u8FD4\u56DE\u767B\u5165\u756B\u9762",
    onClick: onLogout,
    tone: "red"
  }))), activeCategory === 'appearance' && React.createElement(SettingsPanel, {
    t: t,
    title: "\u5916\u89C0\u8207\u9AD4\u9A57",
    desc: "\u6240\u6709\u8B8A\u66F4\u90FD\u6703\u5373\u6642\u5957\u7528\u4E26\u81EA\u52D5\u4FDD\u5B58\u3002",
    icon: "palette"
  }, React.createElement("div", {
    className: "space-y-6"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black text-slate-400 uppercase tracking-wider mb-3"
  }, "\u986F\u793A\u6A21\u5F0F"), React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, [{
    value: 'light',
    label: '淺色',
    icon: 'sun'
  }, {
    value: 'dark',
    label: '深色',
    icon: 'moon'
  }, {
    value: 'system',
    label: '跟隨系統',
    icon: 'monitor'
  }].map(mode => React.createElement("button", {
    key: mode.value,
    type: "button",
    onClick: () => setAppearanceMode(mode.value),
    className: `h-20 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${appearanceMode === mode.value ? `${t.lightBg} ${t.border} ${t.text} shadow-sm` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300'}`
  }, React.createElement(Icon, {
    name: mode.icon,
    className: "w-5 h-5"
  }), React.createElement("span", {
    className: "text-xs font-black"
  }, mode.label))))), React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black text-slate-400 uppercase tracking-wider mb-3"
  }, "\u4E3B\u984C\u984F\u8272"), React.createElement("div", {
    className: "grid grid-cols-4 sm:grid-cols-7 gap-2"
  }, themeEntries.map(_ref35 => {
    let _ref36 = _slicedToArray(_ref35, 2),
      key = _ref36[0],
      config = _ref36[1];
    return React.createElement("button", {
      key: key,
      type: "button",
      "aria-label": config.name,
      onClick: () => setThemeColor(key),
      className: `rounded-2xl p-2 border transition-all active:scale-95 ${themeColor === key ? `${config.lightBg} ${config.border} shadow-md` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`
    }, React.createElement("span", {
      className: `block h-9 rounded-xl bg-gradient-to-br ${config.gradient}`
    }), React.createElement("span", {
      className: `block text-[11px] font-black mt-1.5 ${themeColor === key ? config.text : 'text-slate-400'}`
    }, config.name));
  }))), React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black text-slate-400 uppercase tracking-wider mb-3"
  }, "\u52D5\u614B\u6548\u679C"), React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, [{
    value: 'full',
    label: '完整'
  }, {
    value: 'simple',
    label: '簡約'
  }, {
    value: 'none',
    label: '關閉'
  }].map(level => React.createElement("button", {
    key: level.value,
    type: "button",
    onClick: () => updatePref('animationLevel', level.value),
    className: `h-11 rounded-xl border text-xs font-black transition-all ${((advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.animationLevel) || (advancedPrefs !== null && advancedPrefs !== void 0 && advancedPrefs.reduceMotion ? 'none' : 'full')) === level.value ? `${t.lightBg} ${t.border} ${t.text}` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300'}`
  }, level.label)))), React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, React.createElement(SettingToggle, {
    t: t,
    enabled: !!(advancedPrefs !== null && advancedPrefs !== void 0 && advancedPrefs.largeText),
    onChange: () => togglePref('largeText'),
    icon: "text",
    title: "\u5927\u5B57\u9AD4\u6A21\u5F0F",
    desc: "\u624B\u6A5F\u53CA iPad \u95B1\u8B80\u66F4\u8F15\u9B06"
  }), React.createElement(SettingToggle, {
    t: t,
    enabled: !!(advancedPrefs !== null && advancedPrefs !== void 0 && advancedPrefs.cleanGlass),
    onChange: () => togglePref('cleanGlass'),
    icon: "glass-water",
    title: "\u6E05\u6670\u73BB\u7483\u6548\u679C",
    desc: "\u63D0\u9AD8\u5361\u7247\u80CC\u666F\u53CA\u6587\u5B57\u5C0D\u6BD4"
  }), React.createElement(SettingToggle, {
    t: t,
    enabled: (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.comfortSpacing) !== false,
    onChange: () => togglePref('comfortSpacing', true),
    icon: "move-horizontal",
    title: "\u8212\u9069\u9593\u8DDD",
    desc: "\u589E\u52A0\u5361\u7247\u8207\u6587\u5B57\u4E4B\u9593\u7A7A\u9593"
  })))), activeCategory === 'homepage' && React.createElement(SettingsPanel, {
    t: t,
    title: "\u9996\u9801\u8207\u529F\u8AB2",
    desc: "\u6C7A\u5B9A\u9996\u9801\u986F\u793A\u65B9\u5F0F\u53CA\u512A\u5148\u5167\u5BB9\u3002",
    icon: "layout-template"
  }, React.createElement("div", {
    className: "space-y-5"
  }, React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3"
  }, layoutOptions.map(option => React.createElement("button", {
    key: option.value,
    type: "button",
    onClick: () => setLayoutMode(option.value),
    className: `p-4 rounded-2xl border text-left transition-all active:scale-[.98] ${layoutMode === option.value ? `${t.lightBg} ${t.border} ${t.text} shadow-sm` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300'}`
  }, React.createElement(Icon, {
    name: option.icon,
    className: "w-5 h-5 mb-3"
  }), React.createElement("div", {
    className: "text-sm font-black"
  }, option.label), React.createElement("div", {
    className: "text-xs font-bold opacity-65 mt-1"
  }, option.desc)))), React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "text-xs font-black text-slate-400 uppercase tracking-wider"
  }, "\u9996\u9801\u5340\u584A"), customBlocks.map(block => React.createElement(SettingToggle, {
    t: t,
    key: block.key,
    enabled: (customLayout === null || customLayout === void 0 ? void 0 : customLayout[block.key]) !== false,
    onChange: () => updateCustomBlock(block.key),
    icon: block.icon,
    title: block.label,
    desc: block.desc
  }))), React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, React.createElement(SettingToggle, {
    t: t,
    enabled: (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.smartHints) !== false,
    onChange: () => togglePref('smartHints', true),
    icon: "sparkles",
    title: "\u667A\u80FD\u63D0\u793A",
    desc: "\u986F\u793A\u903E\u671F\u3001\u6642\u9593\u8868\u53CA\u64CD\u4F5C\u5EFA\u8B70"
  }), React.createElement(SettingToggle, {
    t: t,
    enabled: !!(advancedPrefs !== null && advancedPrefs !== void 0 && advancedPrefs.focusFirst),
    onChange: () => togglePref('focusFirst'),
    icon: "target",
    title: "\u5C08\u6CE8\u512A\u5148",
    desc: "\u5C07\u6700\u91CD\u8981\u529F\u8AB2\u6392\u5217\u5728\u6700\u524D"
  })))), activeCategory === 'reminders' && React.createElement(SettingsPanel, {
    t: t,
    title: "\u901A\u77E5\u8207\u63D0\u9192",
    desc: "\u9078\u64C7\u6703\u51FA\u73FE\u5728\u901A\u77E5\u4E2D\u5FC3\u7684\u5167\u5BB9\u3002",
    icon: "bell-ring"
  }, React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 p-4 flex items-center gap-3"
  }, React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-orange-500 text-white grid place-items-center"
  }, React.createElement(Icon, {
    name: "bell",
    className: "w-4 h-4"
  })), React.createElement("div", {
    className: "flex-1"
  }, React.createElement("div", {
    className: "text-sm font-black text-orange-800 dark:text-orange-200"
  }, unreadNotificationCount ? `${unreadNotificationCount} 則未讀通知` : '通知已全部讀取'), React.createElement("div", {
    className: "text-xs font-bold text-orange-600/70 dark:text-orange-300/70 mt-1"
  }, "\u5EE3\u64AD\u3001\u66F4\u65B0\u53CA\u529F\u8AB2\u63D0\u9192\u96C6\u4E2D\u986F\u793A")), React.createElement("button", {
    type: "button",
    onClick: onOpenNotifications,
    className: "px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-orange-600 text-xs font-black shadow-sm"
  }, "\u67E5\u770B")), React.createElement(SettingToggle, {
    t: t,
    enabled: (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.homeworkReminder) !== false,
    onChange: () => togglePref('homeworkReminder', true),
    icon: "list-checks",
    title: "\u529F\u8AB2\u53CA\u903E\u671F\u63D0\u9192",
    desc: "\u986F\u793A\u5FEB\u5230\u671F\u53CA\u5DF2\u903E\u671F\u529F\u8AB2"
  }), React.createElement(SettingToggle, {
    t: t,
    enabled: (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.broadcastReminder) !== false,
    onChange: () => togglePref('broadcastReminder', true),
    icon: "school-2",
    title: "\u73ED\u7D1A\u5EE3\u64AD",
    desc: "\u986F\u793A\u8001\u5E2B\u6216\u7BA1\u7406\u54E1\u6D3E\u767C\u7684\u529F\u8AB2"
  }), React.createElement(SettingToggle, {
    t: t,
    enabled: (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.timetableReminder) !== false,
    onChange: () => togglePref('timetableReminder', true),
    icon: "calendar-clock",
    title: "\u6642\u9593\u8868\u66F4\u65B0",
    desc: "\u6642\u9593\u8868\u6709\u66F4\u6539\u6642\u986F\u793A\u901A\u77E5"
  }), React.createElement(SettingToggle, {
    t: t,
    enabled: (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.updateReminder) !== false,
    onChange: () => togglePref('updateReminder', true),
    icon: "sparkles",
    title: "\u7A0B\u5F0F\u66F4\u65B0",
    desc: "\u986F\u793A\u65B0\u7248\u672C\u5167\u5BB9\u53CA\u91CD\u8981\u516C\u544A"
  }))), activeCategory === 'data' && React.createElement(SettingsPanel, {
    t: t,
    title: "\u8CC7\u6599\u8207\u540C\u6B65",
    desc: "\u6AA2\u67E5\u96F2\u7AEF\u9023\u7DDA\u3001\u5099\u4EFD\u53CA\u79D1\u76EE\u8CC7\u6599\u3002",
    icon: "database"
  }, React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, React.createElement("div", {
    className: "rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
  }, React.createElement("div", {
    className: "text-xs font-black text-slate-400"
  }, "\u540C\u6B65\u72C0\u614B"), React.createElement("div", {
    className: `text-base font-black mt-2 ${isOnline ? 'text-emerald-600 dark:text-emerald-300' : 'text-orange-600 dark:text-orange-300'}`
  }, isOnline ? '雲端已連線' : '等待網絡')), React.createElement("div", {
    className: "rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
  }, React.createElement("div", {
    className: "text-xs font-black text-slate-400"
  }, "\u76EE\u524D\u8CC7\u6599"), React.createElement("div", {
    className: "text-base font-black text-slate-800 dark:text-white mt-2"
  }, itemCount, " \u9805\u529F\u8AB2"))), React.createElement(SettingsActionRow, {
    icon: "download",
    title: "\u532F\u51FA\u5B8C\u6574\u5099\u4EFD",
    desc: "\u4E0B\u8F09\u529F\u8AB2\u3001\u79D1\u76EE\u53CA\u6642\u9593\u8868 JSON \u5099\u4EFD",
    onClick: onExport,
    tone: "emerald"
  }), React.createElement(SettingsActionRow, {
    icon: "book-marked",
    title: "\u7BA1\u7406\u79D1\u76EE\u8CC7\u6599",
    desc: `${subjectCount} 個科目 · 同步更新功課與時間表`,
    onClick: onOpenSubjects,
    tone: "indigo"
  }), React.createElement("div", {
    className: "rounded-2xl p-4 border border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/70 flex items-center justify-between gap-3"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-sm font-black text-slate-800 dark:text-white"
  }, "\u767B\u5165\u4FDD\u5B58\u65B9\u5F0F"), React.createElement("div", {
    className: "text-xs font-bold text-slate-400 mt-1"
  }, "iPad \u6703\u512A\u5148\u4F7F\u7528\u6700\u7A69\u5B9A\u7684\u672C\u6A5F\u4FDD\u5B58\u65B9\u5F0F")), React.createElement("span", {
    className: "px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-black text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
  }, persistenceMode)))), activeCategory === 'app' && React.createElement(SettingsPanel, {
    t: t,
    title: "\u61C9\u7528\u7A0B\u5F0F",
    desc: "PWA \u5B89\u88DD\u72C0\u614B\u3001\u7248\u672C\u53CA\u66F4\u65B0\u5DE5\u5177\u3002",
    icon: "smartphone"
  }, React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "rounded-[1.5rem] p-5 bg-slate-950 text-white relative overflow-hidden"
  }, React.createElement("div", {
    className: "absolute -right-12 -top-12 w-36 h-36 rounded-full bg-indigo-500/30 blur-2xl"
  }), React.createElement("div", {
    className: "relative"
  }, React.createElement("div", {
    className: "flex items-center justify-between"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black text-indigo-300 tracking-wider"
  }, "E-HANDBOOK PRO"), React.createElement("div", {
    className: "text-xl font-black mt-1"
  }, "StudyOS 3.1.0")), React.createElement("div", {
    className: "w-11 h-11 rounded-2xl bg-white/10 grid place-items-center"
  }, React.createElement(Icon, {
    name: "book-open",
    className: "w-5 h-5"
  }))), React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mt-5"
  }, React.createElement("div", {
    className: "rounded-xl bg-white/10 p-3"
  }, React.createElement("div", {
    className: "text-[11px] text-slate-400 font-bold"
  }, "\u986F\u793A\u6A21\u5F0F"), React.createElement("div", {
    className: "text-sm font-black mt-1"
  }, standaloneMode ? '主畫面 PWA' : '瀏覽器')), React.createElement("div", {
    className: "rounded-xl bg-white/10 p-3"
  }, React.createElement("div", {
    className: "text-[11px] text-slate-400 font-bold"
  }, "\u7DB2\u7D61"), React.createElement("div", {
    className: "text-sm font-black mt-1"
  }, isOnline ? '正常連線' : '離線'))))), React.createElement(SettingsActionRow, {
    icon: "refresh-cw",
    title: "\u91CD\u65B0\u8F09\u5165\u6700\u65B0\u7248\u672C",
    desc: "\u6E05\u9664\u7A0B\u5F0F\u5FEB\u53D6\u5F8C\u91CD\u65B0\u8F09\u5165\uFF0C\u4E0D\u6703\u522A\u9664\u529F\u8AB2\u8CC7\u6599",
    onClick: onRefreshApp,
    tone: "indigo"
  }), React.createElement(SettingsActionRow, {
    icon: "bell",
    title: "\u958B\u555F\u901A\u77E5\u4E2D\u5FC3",
    desc: "\u67E5\u770B\u7248\u672C\u66F4\u65B0\u3001\u516C\u544A\u53CA\u5EE3\u64AD",
    onClick: onOpenNotifications,
    tone: "orange",
    trailing: unreadNotificationCount ? `${unreadNotificationCount} 未讀` : '全部已讀'
  }), React.createElement("div", {
    className: "text-center text-xs font-bold text-slate-400 pt-2"
  }, "\u79C1\u4EBA\u53CA\u73ED\u5167\u4F7F\u7528 \xB7 \u8A2D\u5B9A\u6703\u81EA\u52D5\u5132\u5B58\u5728\u6B64\u88DD\u7F6E"))))));
}
function App() {
  var _systemConfig$allowed, _systemConfig$blackli;
  const _useState133 = useState(null),
    _useState134 = _slicedToArray(_useState133, 2),
    user = _useState134[0],
    setUser = _useState134[1];
  const _useState135 = useState(true),
    _useState136 = _slicedToArray(_useState135, 2),
    authLoading = _useState136[0],
    setAuthLoading = _useState136[1];
  const _useState137 = useState(() => window.__EHANDBOOK_FIREBASE_READY__ ? 1 : 0),
    _useState138 = _slicedToArray(_useState137, 2),
    firebaseReadyTick = _useState138[0],
    setFirebaseReadyTick = _useState138[1];
  const _useState139 = useState([]),
    _useState140 = _slicedToArray(_useState139, 2),
    items = _useState140[0],
    setItems = _useState140[1];
  const collab = useCollaboration(user);
  const _useState141 = useState('groups'),
    _useState142 = _slicedToArray(_useState141, 2),
    collabTab = _useState142[0],
    setCollabTab = _useState142[1];
  const _useState143 = useState(''),
    _useState144 = _slicedToArray(_useState143, 2),
    dataError = _useState144[0],
    setDataError = _useState144[1];
  const _useState145 = useState(false),
    _useState146 = _slicedToArray(_useState145, 2),
    isSavingTask = _useState146[0],
    setIsSavingTask = _useState146[1];
  const savingTaskRef = useRef(false);
  const toggleLocksRef = useRef(new Set());
  const _useState147 = useState({
      timeSlots: DEFAULT_TIME_SLOTS,
      schedule: DEFAULT_SCHEDULE
    }),
    _useState148 = _slicedToArray(_useState147, 2),
    timetableConfig = _useState148[0],
    setTimetableConfig = _useState148[1];
  const _useState149 = useState(DEFAULT_SUBJECTS),
    _useState150 = _slicedToArray(_useState149, 2),
    subjects = _useState150[0],
    setSubjects = _useState150[1];
  const _ref37 = window.firebaseServices || {},
    auth = _ref37.auth,
    db = _ref37.db,
    signOut = _ref37.signOut,
    sendPasswordResetEmail = _ref37.sendPasswordResetEmail,
    onAuthStateChanged = _ref37.onAuthStateChanged,
    collection = _ref37.collection,
    addDoc = _ref37.addDoc,
    updateDoc = _ref37.updateDoc,
    deleteDoc = _ref37.deleteDoc,
    doc = _ref37.doc,
    onSnapshot = _ref37.onSnapshot,
    query = _ref37.query,
    orderBy = _ref37.orderBy,
    serverTimestamp = _ref37.serverTimestamp,
    getDocs = _ref37.getDocs,
    setDoc = _ref37.setDoc,
    updateProfile = _ref37.updateProfile,
    arrayUnion = _ref37.arrayUnion,
    arrayRemove = _ref37.arrayRemove,
    writeBatch = _ref37.writeBatch,
    where = _ref37.where;
  const _useState151 = useState('homework'),
    _useState152 = _slicedToArray(_useState151, 2),
    inputType = _useState152[0],
    setInputType = _useState152[1];
  const _useState153 = useState('中文'),
    _useState154 = _slicedToArray(_useState153, 2),
    subject = _useState154[0],
    setSubject = _useState154[1];
  const _useState155 = useState(''),
    _useState156 = _slicedToArray(_useState155, 2),
    description = _useState156[0],
    setDescription = _useState156[1];
  const _useState157 = useState(''),
    _useState158 = _slicedToArray(_useState157, 2),
    dueDate = _useState158[0],
    setDueDate = _useState158[1];
  const _useState159 = useState('normal'),
    _useState160 = _slicedToArray(_useState159, 2),
    priority = _useState160[0],
    setPriority = _useState160[1];
  const _useState161 = useState(false),
    _useState162 = _slicedToArray(_useState161, 2),
    isComposerOpen = _useState162[0],
    setIsComposerOpen = _useState162[1];
  const _useState163 = useState(false),
    _useState164 = _slicedToArray(_useState163, 2),
    isDueDatePickerOpen = _useState164[0],
    setIsDueDatePickerOpen = _useState164[1];
  const _useState165 = useState(''),
    _useState166 = _slicedToArray(_useState165, 2),
    searchQuery = _useState166[0],
    setSearchQuery = _useState166[1];
  const _useState167 = useState(false),
    _useState168 = _slicedToArray(_useState167, 2),
    isBroadcast = _useState168[0],
    setIsBroadcast = _useState168[1];
  const _useState169 = useState('全校'),
    _useState170 = _slicedToArray(_useState169, 2),
    targetClassInput = _useState170[0],
    setTargetClassInput = _useState170[1];
  const _useState171 = useState('current'),
    _useState172 = _slicedToArray(_useState171, 2),
    viewMode = _useState172[0],
    setViewMode = _useState172[1];
  const _useState173 = useState('personal'),
    _useState174 = _slicedToArray(_useState173, 2),
    appMode = _useState174[0],
    setAppMode = _useState174[1];
  const _useState175 = useState(() => safeStorageGet('isDarkMode') === 'true'),
    _useState176 = _slicedToArray(_useState175, 2),
    isDarkMode = _useState176[0],
    setIsDarkMode = _useState176[1];
  const _useState177 = useState(() => safeStorageGet('appearanceMode', safeStorageGet('isDarkMode') === 'true' ? 'dark' : 'light') || 'light'),
    _useState178 = _slicedToArray(_useState177, 2),
    appearanceMode = _useState178[0],
    setAppearanceMode = _useState178[1];
  const _useState179 = useState(() => safeStorageGet('themeColor', 'indigo') || 'indigo'),
    _useState180 = _slicedToArray(_useState179, 2),
    themeColor = _useState180[0],
    setThemeColor = _useState180[1];
  const _useState181 = useState(false),
    _useState182 = _slicedToArray(_useState181, 2),
    isPreferencesOpen = _useState182[0],
    setIsPreferencesOpen = _useState182[1];
  const _useState183 = useState(() => safeStorageGet('layoutMode', 'normal') || 'normal'),
    _useState184 = _slicedToArray(_useState183, 2),
    layoutMode = _useState184[0],
    setLayoutMode = _useState184[1];
  const _useState185 = useState(() => safeStorageJSON('customLayout', {
      cards: true,
      timetable: true,
      input: true,
      list: true
    })),
    _useState186 = _slicedToArray(_useState185, 2),
    customLayout = _useState186[0],
    setCustomLayout = _useState186[1];
  const _useState187 = useState(() => safeStorageJSON('advancedPrefs', {
      largeText: false,
      reduceMotion: false,
      cleanGlass: false,
      comfortSpacing: true,
      smartHints: true,
      focusFirst: false,
      showClassShortcut: true,
      showNotificationShortcut: true,
      showSubjectShortcut: true,
      showAccountShortcut: true,
      animationLevel: 'full',
      homeworkReminder: true,
      broadcastReminder: true,
      timetableReminder: true,
      updateReminder: true
    })),
    _useState188 = _slicedToArray(_useState187, 2),
    advancedPrefs = _useState188[0],
    setAdvancedPrefs = _useState188[1];
  const t = THEME_CONFIG[themeColor] || THEME_CONFIG.indigo;
  const _useState189 = useState([]),
    _useState190 = _slicedToArray(_useState189, 2),
    exitingIds = _useState190[0],
    setExitingIds = _useState190[1];
  const _useState191 = useState(false),
    _useState192 = _slicedToArray(_useState191, 2),
    isSubjectManagerOpen = _useState192[0],
    setIsSubjectManagerOpen = _useState192[1];
  const _useState193 = useState(null),
    _useState194 = _slicedToArray(_useState193, 2),
    systemConfig = _useState194[0],
    setSystemConfig = _useState194[1];
  const _useState195 = useState([]),
    _useState196 = _slicedToArray(_useState195, 2),
    systemClasses = _useState196[0],
    setSystemClasses = _useState196[1];
  const _useState197 = useState('全部'),
    _useState198 = _slicedToArray(_useState197, 2),
    filterSubject = _useState198[0],
    setFilterSubject = _useState198[1];
  const _useState199 = useState('date_asc'),
    _useState200 = _slicedToArray(_useState199, 2),
    sortOption = _useState200[0],
    setSortOption = _useState200[1];
  const _useState201 = useState(true),
    _useState202 = _slicedToArray(_useState201, 2),
    isListVisible = _useState202[0],
    setIsListVisible = _useState202[1];
  const _useState203 = useState(null),
    _useState204 = _slicedToArray(_useState203, 2),
    editingItem = _useState204[0],
    setEditingItem = _useState204[1];
  const _useState205 = useState(false),
    _useState206 = _slicedToArray(_useState205, 2),
    isAdmin = _useState206[0],
    setIsAdmin = _useState206[1];
  const _useState207 = useState({
      isOpen: false,
      type: 'confirm',
      message: '',
      onConfirm: null
    }),
    _useState208 = _slicedToArray(_useState207, 2),
    notification = _useState208[0],
    setNotification = _useState208[1];
  const _useState209 = useState({
      isVisible: false,
      message: '',
      type: 'success',
      action: null
    }),
    _useState210 = _slicedToArray(_useState209, 2),
    toast = _useState210[0],
    setToast = _useState210[1];
  const toastTimerRef = useRef(null);
  const _useState211 = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine),
    _useState212 = _slicedToArray(_useState211, 2),
    isOnline = _useState212[0],
    setIsOnline = _useState212[1];
  const _useState213 = useState(false),
    _useState214 = _slicedToArray(_useState213, 2),
    showNameSetup = _useState214[0],
    setShowNameSetup = _useState214[1];
  const _useState215 = useState(false),
    _useState216 = _slicedToArray(_useState215, 2),
    nameSetupLoading = _useState216[0],
    setNameSetupLoading = _useState216[1];
  const _useState217 = useState(null),
    _useState218 = _slicedToArray(_useState217, 2),
    userProfile = _useState218[0],
    setUserProfile = _useState218[1];
  const joinedClasses = (userProfile === null || userProfile === void 0 ? void 0 : userProfile.joinedClasses) || [];
  const joinedClassesStr = joinedClasses.join(',');
  const activeUpdateNotice = useMemo(() => {
    const builtInNotice = CURRENT_RELEASE_NOTICE;
    const configuredVersion = String((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateVersion) || '').trim();
    const currentVersion = String(builtInNotice.version || '').trim();
    const configIsForCurrentVersion = configuredVersion && configuredVersion === currentVersion;
    if (configIsForCurrentVersion && (systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updatePopupEnabled) !== false) {
      return {
        version: configuredVersion,
        title: systemConfig.updateTitle || builtInNotice.title,
        summary: systemConfig.updateSummary || builtInNotice.summary,
        guide: systemConfig.updateGuide || builtInNotice.guide,
        audience: systemConfig.updateAudience || builtInNotice.audience || 'all',
        popupEnabled: systemConfig.updatePopupEnabled !== false,
        publishedAt: systemConfig.updatePublishedAt || builtInNotice.publishedAt,
        source: 'admin'
      };
    }
    return builtInNotice;
  }, [systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateVersion, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateTitle, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateSummary, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateGuide, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updateAudience, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updatePopupEnabled, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.updatePublishedAt]);
  const _useState219 = useState(false),
    _useState220 = _slicedToArray(_useState219, 2),
    isJoinClassOpen = _useState220[0],
    setIsJoinClassOpen = _useState220[1];
  const _useState221 = useState('全校'),
    _useState222 = _slicedToArray(_useState221, 2),
    selectedClassBoard = _useState222[0],
    setSelectedClassBoard = _useState222[1];
  const _useState223 = useState([]),
    _useState224 = _slicedToArray(_useState223, 2),
    publicTasks = _useState224[0],
    setPublicTasks = _useState224[1];
  const _useState225 = useState({}),
    _useState226 = _slicedToArray(_useState225, 2),
    syncingPublicIds = _useState226[0],
    setSyncingPublicIds = _useState226[1];
  const _useState227 = useState(false),
    _useState228 = _slicedToArray(_useState227, 2),
    itemsLoaded = _useState228[0],
    setItemsLoaded = _useState228[1];
  const _useState229 = useState(false),
    _useState230 = _slicedToArray(_useState229, 2),
    publicTasksLoaded = _useState230[0],
    setPublicTasksLoaded = _useState230[1];
  const _useState231 = useState(false),
    _useState232 = _slicedToArray(_useState231, 2),
    isNotificationCenterOpen = _useState232[0],
    setIsNotificationCenterOpen = _useState232[1];
  const _useState233 = useState('all'),
    _useState234 = _slicedToArray(_useState233, 2),
    notificationFilter = _useState234[0],
    setNotificationFilter = _useState234[1];
  const _useState235 = useState(false),
    _useState236 = _slicedToArray(_useState235, 2),
    showUpdateIntro = _useState236[0],
    setShowUpdateIntro = _useState236[1];
  const _useState237 = useState([]),
    _useState238 = _slicedToArray(_useState237, 2),
    readNotificationIds = _useState238[0],
    setReadNotificationIds = _useState238[1];
  const _useState239 = useState(''),
    _useState240 = _slicedToArray(_useState239, 2),
    predictedSubject = _useState240[0],
    setPredictedSubject = _useState240[1];
  const _useState241 = useState(false),
    _useState242 = _slicedToArray(_useState241, 2),
    subjectManuallySelected = _useState242[0],
    setSubjectManuallySelected = _useState242[1];
  const _useState243 = useState(false),
    _useState244 = _slicedToArray(_useState243, 2),
    subjectPredictionApplied = _useState244[0],
    setSubjectPredictionApplied = _useState244[1];
  const _useState245 = useState(Date.now()),
    _useState246 = _slicedToArray(_useState245, 1),
    pageLoadTime = _useState246[0];
  const _useState247 = useState(new Date().getDay() || 1),
    _useState248 = _slicedToArray(_useState247, 2),
    currentTimetableDay = _useState248[0],
    setCurrentTimetableDay = _useState248[1];
  const _useState249 = useState({
      isOpen: false,
      title: '',
      items: []
    }),
    _useState250 = _slicedToArray(_useState249, 2),
    quickView = _useState250[0],
    setQuickView = _useState250[1];
  const _useState251 = useState(new Date()),
    _useState252 = _slicedToArray(_useState251, 2),
    globalNow = _useState252[0],
    setGlobalNow = _useState252[1];
  const itemsRef = useRef([]);
  const publicTasksRef = useRef([]);
  const autoSyncingPublicIdsRef = useRef(new Set());
  useEffect(() => {
    var _window$visualViewpor3, _window$visualViewpor4;
    const resize = () => {
      var _window$visualViewpor, _window$visualViewpor2;
      document.documentElement.style.setProperty('--visual-height', `${((_window$visualViewpor = window.visualViewport) === null || _window$visualViewpor === void 0 ? void 0 : _window$visualViewpor.height) || window.innerHeight}px`);
      document.documentElement.style.setProperty('--visual-top', `${((_window$visualViewpor2 = window.visualViewport) === null || _window$visualViewpor2 === void 0 ? void 0 : _window$visualViewpor2.offsetTop) || 0}px`);
    };
    resize();
    window.addEventListener('resize', resize);
    (_window$visualViewpor3 = window.visualViewport) === null || _window$visualViewpor3 === void 0 || _window$visualViewpor3.addEventListener('resize', resize);
    (_window$visualViewpor4 = window.visualViewport) === null || _window$visualViewpor4 === void 0 || _window$visualViewpor4.addEventListener('scroll', resize);
    return () => {
      var _window$visualViewpor5, _window$visualViewpor6;
      window.removeEventListener('resize', resize);
      (_window$visualViewpor5 = window.visualViewport) === null || _window$visualViewpor5 === void 0 || _window$visualViewpor5.removeEventListener('resize', resize);
      (_window$visualViewpor6 = window.visualViewport) === null || _window$visualViewpor6 === void 0 || _window$visualViewpor6.removeEventListener('scroll', resize);
    };
  }, []);
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    window.__EHANDBOOK_RENDERED__ = true;
    if (loadingScreen) {
      loadingScreen.classList.add('hidden-loader');
      setTimeout(() => loadingScreen.remove(), 500);
    }
  }, []);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerAlert('網絡已恢復');
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  useEffect(() => {
    if (!isComposerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') setIsComposerOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isComposerOpen]);
  useEffect(() => {
    var _window$firebaseServi2;
    if (window.__EHANDBOOK_FIREBASE_READY__ && (_window$firebaseServi2 = window.firebaseServices) !== null && _window$firebaseServi2 !== void 0 && _window$firebaseServi2.auth) {
      setFirebaseReadyTick(v => v + 1);
      return;
    }
    const handleReady = () => setFirebaseReadyTick(v => v + 1);
    const handleError = () => {
      console.warn('Firebase ready event reported an init error:', window.__EHANDBOOK_FIREBASE_INIT_ERROR__);
      setAuthLoading(false);
    };
    window.addEventListener('ehandbook:firebase-ready', handleReady);
    window.addEventListener('ehandbook:firebase-error', handleError);
    const timeout = setTimeout(() => {
      var _window$firebaseServi3;
      if (!window.__EHANDBOOK_FIREBASE_READY__ || !((_window$firebaseServi3 = window.firebaseServices) !== null && _window$firebaseServi3 !== void 0 && _window$firebaseServi3.auth)) {
        console.warn('Firebase services were not ready after timeout');
        setAuthLoading(false);
      }
    }, 15000);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('ehandbook:firebase-ready', handleReady);
      window.removeEventListener('ehandbook:firebase-error', handleError);
    };
  }, []);
  useEffect(() => {
    const intervalMs = viewMode === 'settings' || viewMode === 'admin' ? 60000 : 1000;
    const timer = setInterval(() => setGlobalNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [viewMode]);
  useEffect(() => {
    var _window$matchMedia, _window7, _media$addEventListen;
    safeStorageSet('appearanceMode', appearanceMode);
    if (appearanceMode !== 'system') {
      setIsDarkMode(appearanceMode === 'dark');
      return;
    }
    const media = (_window$matchMedia = (_window7 = window).matchMedia) === null || _window$matchMedia === void 0 ? void 0 : _window$matchMedia.call(_window7, '(prefers-color-scheme: dark)');
    const applySystemMode = () => setIsDarkMode(!!(media !== null && media !== void 0 && media.matches));
    applySystemMode();
    media === null || media === void 0 || (_media$addEventListen = media.addEventListener) === null || _media$addEventListen === void 0 || _media$addEventListen.call(media, 'change', applySystemMode);
    return () => {
      var _media$removeEventLis;
      return media === null || media === void 0 || (_media$removeEventLis = media.removeEventListener) === null || _media$removeEventLis === void 0 ? void 0 : _media$removeEventLis.call(media, 'change', applySystemMode);
    };
  }, [appearanceMode]);
  useEffect(() => {
    safeStorageSet('isDarkMode', String(isDarkMode));
    if (isDarkMode) document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);
  useEffect(() => {
    safeStorageSet('themeColor', themeColor);
    safeStorageSet('layoutMode', layoutMode);
    safeStorageSet('customLayout', JSON.stringify(customLayout));
  }, [themeColor, layoutMode, customLayout]);
  useEffect(() => {
    safeStorageSet('advancedPrefs', JSON.stringify(advancedPrefs));
    const root = document.documentElement;
    const animationLevel = advancedPrefs.animationLevel || (advancedPrefs.reduceMotion ? 'none' : 'full');
    root.classList.toggle('reduce-motion-mode', animationLevel === 'none');
    root.classList.toggle('simple-motion-mode', animationLevel === 'simple');
    root.classList.toggle('large-text-mode', !!advancedPrefs.largeText);
    root.classList.toggle('clean-glass-mode', !!advancedPrefs.cleanGlass);
    root.classList.toggle('comfort-spacing-mode', advancedPrefs.comfortSpacing !== false);
  }, [advancedPrefs]);
  useEffect(() => {
    if (!window.firebaseServices || !auth || !db || !onAuthStateChanged) {
      console.warn('Firebase Auth services not ready yet; waiting for ready event...', {
        firebaseReadyTick
      });
      return;
    }
    let mounted = true;
    let profileUnsubscribe = null;
    const cleanupProfile = () => {
      if (profileUnsubscribe) {
        try {
          profileUnsubscribe();
        } catch (e) {}
        profileUnsubscribe = null;
      }
    };
    const resolveSignedOut = () => {
      var _window$__EHANDBOOK_C6, _window8;
      if (!mounted) return;
      cleanupProfile();
      (_window$__EHANDBOOK_C6 = (_window8 = window).__EHANDBOOK_CLEAR_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_C6 === void 0 || _window$__EHANDBOOK_C6.call(_window8);
      safeStorageRemove('ehandbook_google_redirect_pending');
      safeStorageRemove('ehandbook_google_redirect_started_at');
      setUser(null);
      setItems([]);
      setPublicTasks([]);
      itemsRef.current = [];
      publicTasksRef.current = [];
      setItemsLoaded(false);
      setPublicTasksLoaded(false);
      setIsAdmin(false);
      setShowNameSetup(false);
      setUserProfile(null);
      setTimetableConfig({
        timeSlots: DEFAULT_TIME_SLOTS,
        schedule: DEFAULT_SCHEDULE
      });
      setSubjects(DEFAULT_SUBJECTS);
      setAuthLoading(false);
    };
    const resolveSignedInUser = async currentUser => {
      if (!mounted || !currentUser) return;
      cleanupProfile();
      try {
        var _window$__EHANDBOOK_C7, _window9;
        setUser(currentUser);
        const d = new Date();
        d.setDate(d.getDate() + 1);
        setDueDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
        setIsAdmin(currentUser.email === ADMIN_EMAIL && currentUser.emailVerified);
        (_window$__EHANDBOOK_C7 = (_window9 = window).__EHANDBOOK_CLEAR_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_C7 === void 0 || _window$__EHANDBOOK_C7.call(_window9);
        safeStorageRemove('ehandbook_google_redirect_pending');
        safeStorageRemove('ehandbook_google_redirect_started_at');
        profileUnsubscribe = onSnapshot(doc(db, "users_public", currentUser.uid), async docSnap => {
          try {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data());
              if (!currentUser.displayName) setShowNameSetup(true);
            } else {
              if (!currentUser.displayName) setShowNameSetup(true);else await setDoc(doc(db, "users_public", currentUser.uid), {
                email: currentUser.email,
                displayName: currentUser.displayName,
                joinedClasses: [],
                lastSeen: serverTimestamp()
              }, {
                merge: true
              });
            }
          } catch (e) {
            console.warn("Profile inner err:", e);
          }
        }, err => console.warn("Profile err:", err));
        setAuthLoading(false);
      } catch (e) {
        console.warn("Auth signed-in resolve err:", e);
        setAuthLoading(false);
      }
    };
    const authFallbackTimer = setTimeout(() => {
      if (!mounted) return;
      console.warn('Auth loading fallback triggered');
      if (auth.currentUser) resolveSignedInUser(auth.currentUser);else setAuthLoading(false);
    }, 25000);
    const redirectPromise = window.__EHANDBOOK_REDIRECT_RESULT_PROMISE__;
    if (redirectPromise) {
      redirectPromise.then(result => {
        const redirectUser = (result === null || result === void 0 ? void 0 : result.user) || auth.currentUser;
        if (redirectUser) {
          clearTimeout(authFallbackTimer);
          resolveSignedInUser(redirectUser);
        } else if (window.__EHANDBOOK_REDIRECT_ERROR__) {
          var _window$__EHANDBOOK_C8, _window0;
          console.warn('Redirect callback returned an error:', window.__EHANDBOOK_REDIRECT_ERROR__);
          (_window$__EHANDBOOK_C8 = (_window0 = window).__EHANDBOOK_CLEAR_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_C8 === void 0 || _window$__EHANDBOOK_C8.call(_window0);
          if (!auth.currentUser) setAuthLoading(false);
        }
      }).catch(error => {
        var _window$__EHANDBOOK_C9, _window1;
        console.warn('Redirect callback processing error:', error);
        (_window$__EHANDBOOK_C9 = (_window1 = window).__EHANDBOOK_CLEAR_REDIRECT_PENDING__) === null || _window$__EHANDBOOK_C9 === void 0 || _window$__EHANDBOOK_C9.call(_window1);
        if (!auth.currentUser) setAuthLoading(false);
      });
    }
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      clearTimeout(authFallbackTimer);
      try {
        if (currentUser) {
          await resolveSignedInUser(currentUser);
        } else {
          const redirectPending = safeStorageGet('ehandbook_google_redirect_pending', '') === '1';
          const startedAt = Number(safeStorageGet('ehandbook_google_redirect_started_at', '0') || 0);
          const redirectStillFresh = redirectPending && startedAt && Date.now() - startedAt < 5 * 60 * 1000;
          if (redirectStillFresh && redirectPromise) {
            redirectPromise.finally(() => {
              if (!auth.currentUser) resolveSignedOut();
            });
            return;
          }
          resolveSignedOut();
        }
      } catch (e) {
        console.warn("Auth err:", e);
        setAuthLoading(false);
      }
    });
    return () => {
      mounted = false;
      clearTimeout(authFallbackTimer);
      unsubscribe();
      cleanupProfile();
    };
  }, [firebaseReadyTick]);
  useEffect(() => {
    if (!user || !db) return;
    updateDoc(doc(db, "users_public", user.uid), {
      lastSeen: serverTimestamp()
    }).catch(e => {});
    const interval = setInterval(() => {
      updateDoc(doc(db, "users_public", user.uid), {
        lastSeen: serverTimestamp()
      }).catch(e => {});
    }, 60000);
    return () => clearInterval(interval);
  }, [user, db]);
  useEffect(() => {
    if (!(user !== null && user !== void 0 && user.uid)) {
      setReadNotificationIds([]);
      return;
    }
    try {
      const saved = safeStorageJSON(`ehandbook_read_notifications_${user.uid}`, []);
      setReadNotificationIds(Array.isArray(saved) ? saved : []);
    } catch (e) {
      setReadNotificationIds([]);
    }
  }, [user === null || user === void 0 ? void 0 : user.uid]);
  useEffect(() => {
    if (!(user !== null && user !== void 0 && user.uid) || !activeUpdateNotice) {
      setShowUpdateIntro(false);
      return;
    }
    const enabled = activeUpdateNotice.popupEnabled !== false;
    const version = String(activeUpdateNotice.version || '').trim();
    if (!enabled || !version) {
      setShowUpdateIntro(false);
      return;
    }
    const audience = activeUpdateNotice.audience || 'all';
    const audienceMatched = audience === 'all' || audience === 'admin' && isAdmin || audience === 'students' && !isAdmin;
    if (!audienceMatched) {
      setShowUpdateIntro(false);
      return;
    }
    const releaseKey = `${activeUpdateNotice.source || 'notice'}::${version}::${activeUpdateNotice.publishedAt || ''}`;
    let hiddenReleases = [];
    try {
      const rawHidden = safeStorageGet(`ehandbook_update_hidden_${user.uid}`, '[]');
      const parsedHidden = JSON.parse(rawHidden);
      hiddenReleases = Array.isArray(parsedHidden) ? parsedHidden : [];
    } catch (e) {
      hiddenReleases = [];
    }
    setShowUpdateIntro(!hiddenReleases.includes(releaseKey));
  }, [user === null || user === void 0 ? void 0 : user.uid, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.version, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.publishedAt, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.popupEnabled, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.audience, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.source, isAdmin]);
  const closeUpdateIntroForNow = () => {
    setShowUpdateIntro(false);
  };
  const hideUpdateIntroForThisRelease = () => {
    const version = String((activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.version) || '').trim();
    const releaseKey = `${(activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.source) || 'notice'}::${version}::${(activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.publishedAt) || ''}`;
    if (user !== null && user !== void 0 && user.uid && version) {
      const key = `ehandbook_update_hidden_${user.uid}`;
      let old = [];
      try {
        const parsedOld = safeStorageJSON(key, []);
        old = Array.isArray(parsedOld) ? parsedOld : [];
      } catch (e) {
        old = [];
      }
      safeStorageSet(key, JSON.stringify(Array.from(new Set([...old, releaseKey]))));
    }
    setShowUpdateIntro(false);
  };
  useEffect(() => {
    if (!db || !user) return;
    const unsubConfig = onSnapshot(doc(db, "system_settings", "config"), docSnap => {
      setSystemConfig(docSnap.exists() ? docSnap.data() : null);
    }, err => {
      console.warn("Config err:", err);
    });
    const unsubClasses = onSnapshot(doc(db, "system_settings", "classes"), docSnap => setSystemClasses(docSnap.exists() && docSnap.data().list ? docSnap.data().list : []), err => console.warn("Classes err:", err));
    return () => {
      unsubConfig();
      unsubClasses();
    };
  }, [db, user]);
  useEffect(() => {
    if (!user || !db) return;
    setItemsLoaded(false);
    const unsubItems = onSnapshot(query(collection(db, "users", user.uid, "items"), orderBy("dueDate")), snapshot => {
      const loadedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(loadedItems);
      itemsRef.current = loadedItems;
      setItemsLoaded(true);
      setDataError('');
    }, err => {
      console.warn("Items err:", err);
      setItemsLoaded(true);
      setDataError('未能載入個人功課，請檢查網絡或重新登入；目前顯示可能不完整。');
    });
    const unsubTimetable = onSnapshot(doc(db, 'users', user.uid, 'settings', 'timetable'), docSnap => setTimetableConfig(docSnap.exists() && docSnap.data().timeSlots ? docSnap.data() : {
      timeSlots: DEFAULT_TIME_SLOTS,
      schedule: DEFAULT_SCHEDULE
    }), err => console.warn("Timetable err:", err));
    const unsubSubjects = onSnapshot(doc(db, 'users', user.uid, 'settings', 'subjects'), docSnap => setSubjects(docSnap.exists() && docSnap.data().list ? docSnap.data().list : DEFAULT_SUBJECTS), err => console.warn("Subjects err:", err));
    return () => {
      unsubItems();
      unsubTimetable();
      unsubSubjects();
    };
  }, [user, db]);
  useEffect(() => {
    const availableBoards = ['全校', ...(joinedClassesStr ? joinedClassesStr.split(',') : [])];
    if (!availableBoards.includes(selectedClassBoard)) setSelectedClassBoard('全校');
  }, [joinedClassesStr, selectedClassBoard]);
  useEffect(() => {
    if (!user || !db) return;
    setPublicTasksLoaded(false);
    const allowedTargets = ['全校', ...(joinedClassesStr ? joinedClassesStr.split(',') : [])].slice(0, 30);
    const q = isAdmin ? query(collection(db, "public_assignments"), orderBy("createdAt", "desc")) : query(collection(db, "public_assignments"), where("targetClass", "in", allowedTargets));
    const unsubscribe = onSnapshot(q, snapshot => {
      try {
        const getTaskTime = task => {
          const value = task === null || task === void 0 ? void 0 : task.createdAt;
          return typeof (value === null || value === void 0 ? void 0 : value.toDate) === 'function' ? value.toDate().getTime() : value ? new Date(value).getTime() : 0;
        };
        const loadedPublicTasks = snapshot.docs.map(publicDoc => ({
          id: publicDoc.id,
          ...publicDoc.data()
        })).sort((a, b) => getTaskTime(b) - getTaskTime(a));
        setPublicTasks(loadedPublicTasks);
        publicTasksRef.current = loadedPublicTasks;
        setPublicTasksLoaded(true);
        const currentClasses = joinedClassesStr ? joinedClassesStr.split(',') : [];
        const existingPublicIds = new Set(itemsRef.current.map(i => i.publicRefId).filter(Boolean));
        snapshot.docChanges().forEach(change => {
          if (change.type !== "added") return;
          const publicData = change.doc.data();
          const publicId = change.doc.id;
          const target = publicData.targetClass || '全校';
          const isForMe = target === '全校' || currentClasses.includes(target);
          const createdValue = publicData.createdAt;
          const createdTime = typeof (createdValue === null || createdValue === void 0 ? void 0 : createdValue.toDate) === 'function' ? createdValue.toDate().getTime() : createdValue ? new Date(createdValue).getTime() : 0;
          if (isForMe && !existingPublicIds.has(publicId) && createdTime > pageLoadTime) {
            triggerAlert(`收到新廣播功課：${publicData.subject || '未命名科目'}`);
          }
        });
      } catch (e) {
        console.warn("Public tasks wrapper err:", e);
      }
    }, err => {
      console.warn("Public tasks err:", err);
      setPublicTasksLoaded(true);
    });
    return () => unsubscribe();
  }, [user, db, joinedClassesStr, pageLoadTime, isAdmin]);
  const triggerAlert = function (message) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
    let action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    setToast({
      isVisible: true,
      message,
      type,
      action
    });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(prev => ({
      ...prev,
      isVisible: false,
      action: null
    })), action ? 6500 : 3200);
  };
  const triggerConfirm = (message, onConfirmAction) => setNotification({
    isOpen: true,
    type: 'confirm',
    message,
    onConfirm: onConfirmAction
  });
  const closeNotification = () => setNotification(prev => ({
    ...prev,
    isOpen: false
  }));
  const handleNotificationConfirm = () => {
    if (notification.onConfirm) notification.onConfirm();
    closeNotification();
  };
  const handleFilterChange = f => {
    setIsListVisible(false);
    setTimeout(() => {
      setFilterSubject(f);
      setIsListVisible(true);
    }, 200);
  };
  const handleSortChange = newSort => {
    setIsListVisible(false);
    setTimeout(() => {
      setSortOption(newSort);
      setIsListVisible(true);
    }, 200);
  };
  const handleNameSetupSave = async name => {
    if (!user) return;
    setNameSetupLoading(true);
    try {
      await updateProfile(user, {
        displayName: name
      });
      await setDoc(doc(db, "users_public", user.uid), {
        email: user.email,
        displayName: name,
        lastSeen: serverTimestamp()
      }, {
        merge: true
      });
      setShowNameSetup(false);
      triggerAlert(`歡迎, ${name}!`);
    } catch (e) {
      triggerAlert("設定失敗，請重試", "error");
    } finally {
      setNameSetupLoading(false);
    }
  };
  const handleJoinClassSubmit = async (code, name) => {
    try {
      await updateDoc(doc(db, "users_public", user.uid), {
        joinedClasses: arrayUnion(code)
      });
      triggerAlert(`成功加入班級：${name}`);
      setIsJoinClassOpen(false);
    } catch (e) {
      triggerAlert("加入失敗，請重試", "error");
    }
  };
  const handleLeaveClass = (code, name) => {
    if (!user || !code || code === '全校') return;
    triggerConfirm(`確定要離開「${name}」嗎？現有功課會保留，但之後唔會再收到呢班嘅新廣播。`, async () => {
      try {
        await updateDoc(doc(db, "users_public", user.uid), {
          joinedClasses: arrayRemove(code)
        });
        if (selectedClassBoard === code) setSelectedClassBoard('全校');
        triggerAlert(`已離開班級：${name}`);
      } catch (e) {
        triggerAlert('未能離開班級，請稍後再試', 'error');
      }
    });
  };
  const handleSubjectSelect = subjectName => {
    setSubject(subjectName);
    setSubjectPredictionApplied(false);
    setSubjectManuallySelected(true);
  };
  useEffect(() => {
    const updatePredictedSubject = () => {
      const nextSubject = inferSubjectFromTimetable(timetableConfig, new Date());
      setPredictedSubject(nextSubject);
    };
    updatePredictedSubject();
    const timer = setInterval(updatePredictedSubject, 30000);
    return () => clearInterval(timer);
  }, [timetableConfig]);
  useEffect(() => {
    if (viewMode !== 'current' || appMode !== 'personal' || isBroadcast) return;
    if (subjectManuallySelected) return;
    if (!predictedSubject || !subjects.some(s => s.name === predictedSubject)) return;
    if (subject === predictedSubject && !subjectPredictionApplied && !description.trim()) {
      setSubjectPredictionApplied(true);
      return;
    }
    if (subject !== predictedSubject && (!description.trim() || subjectPredictionApplied)) {
      setSubject(predictedSubject);
      setSubjectPredictionApplied(true);
    }
  }, [viewMode, appMode, isBroadcast, predictedSubject, subjects, description, subjectPredictionApplied, subject, subjectManuallySelected]);
  const syncedPublicIds = useMemo(() => new Set(items.map(i => i.publicRefId).filter(Boolean)), [items]);
  const visiblePublicTasks = useMemo(() => {
    const currentClasses = joinedClassesStr ? joinedClassesStr.split(',') : [];
    return publicTasks.filter(task => {
      const target = task.targetClass || '全校';
      return target === '全校' || currentClasses.includes(target);
    });
  }, [publicTasks, joinedClassesStr]);
  const unsyncedPublicTasks = useMemo(() => visiblePublicTasks.filter(task => !syncedPublicIds.has(task.id) && !task.forceExpired), [visiblePublicTasks, syncedPublicIds]);
  const syncPublicTaskToPersonal = async function (task) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!user || !db || !(task !== null && task !== void 0 && task.id)) return false;
    const _options$silent = options.silent,
      silent = _options$silent === void 0 ? false : _options$silent,
      _options$auto = options.auto,
      auto = _options$auto === void 0 ? false : _options$auto,
      _options$source = options.source,
      source = _options$source === void 0 ? 'student_claim' : _options$source;
    try {
      const duplicateQ = query(collection(db, "users", user.uid, "items"), where("publicRefId", "==", task.id));
      const duplicateSnap = await getDocs(duplicateQ);
      if (!duplicateSnap.empty || syncedPublicIds.has(task.id)) {
        if (!silent) triggerAlert("呢份廣播功課已經喺你個人手冊入面");
        return false;
      }
      const deliveredItem = {
        type: task.type || 'homework',
        subject: task.subject || '其他',
        description: task.description || '',
        dueDate: task.dueDate || '',
        completed: false,
        createdAt: new Date().toISOString(),
        publicRefId: task.id,
        senderName: task.senderName || '老師',
        targetClass: task.targetClass || '全校',
        priority: task.priority || 'normal',
        autoDelivered: true,
        autoSynced: true,
        deliveryMode: 'login_claim',
        deliverySource: source,
        deliveredAt: new Date().toISOString(),
        forceExpired: task.forceExpired === true,
        isHidden: false
      };
      await setDoc(doc(db, "users", user.uid, "items", `public_${task.id}`), deliveredItem, {
        merge: true
      });
      if (!silent) triggerAlert("已加入你嘅個人手冊");
      return true;
    } catch (error) {
      console.warn("Deliver public task to personal list failed:", error);
      if (!silent) triggerAlert("加入失敗，請稍後再試", "error");
      throw error;
    }
  };
  useEffect(() => {
    if (!(user !== null && user !== void 0 && user.uid) || !db || !itemsLoaded || !publicTasksLoaded || unsyncedPublicTasks.length === 0) return;
    const targets = unsyncedPublicTasks.filter(task => !task.forceExpired && !autoSyncingPublicIdsRef.current.has(task.id));
    if (targets.length === 0) return;
    targets.forEach(async task => {
      autoSyncingPublicIdsRef.current.add(task.id);
      setSyncingPublicIds(prev => ({
        ...prev,
        [task.id]: true
      }));
      try {
        await syncPublicTaskToPersonal(task, {
          silent: true,
          auto: true,
          source: 'login_claim'
        });
      } catch (e) {} finally {
        autoSyncingPublicIdsRef.current.delete(task.id);
        setSyncingPublicIds(prev => {
          const next = {
            ...prev
          };
          delete next[task.id];
          return next;
        });
      }
    });
  }, [user === null || user === void 0 ? void 0 : user.uid, db, itemsLoaded, publicTasksLoaded, unsyncedPublicTasks]);
  const userNotifications = useMemo(() => {
    const notices = [];
    const makeHash = text => Array.from(String(text || '')).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const getSortTime = value => {
      try {
        if (!value) return 0;
        const d = typeof (value === null || value === void 0 ? void 0 : value.toDate) === 'function' ? value.toDate() : new Date(value);
        return d instanceof Date && !isNaN(d.getTime()) ? d.getTime() : 0;
      } catch (e) {
        return 0;
      }
    };
    if (systemConfig !== null && systemConfig !== void 0 && systemConfig.announcementText) {
      const text = String(systemConfig.announcementText || '').trim();
      notices.push({
        id: `announcement-${makeHash(text)}-${text.length}`,
        type: 'announcement',
        icon: 'megaphone',
        title: '全校公告已更新',
        message: text || '管理員更新了全校公告。',
        meta: '置頂公告',
        time: '置頂公告',
        sortTime: Date.now() + 2,
        accent: 'amber',
        action: 'none'
      });
    }
    ((systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.adminReminders) || []).forEach(reminder => {
      const target = reminder.targetClass || '全校';
      const visible = target === '全校' || joinedClasses.includes(target);
      if (!visible) return;
      notices.push({
        id: reminder.id || `reminder-${reminder.taskId || makeHash(reminder.message || '')}`,
        type: 'admin-reminder',
        icon: 'bell-ring',
        title: reminder.title || '管理員提醒',
        message: reminder.message || '請查看最新系統提醒。',
        meta: target === '全校' ? '全校提醒' : `班級 ${target}`,
        time: formatFirebaseDateTime(reminder.createdAt) || '剛剛',
        sortTime: getSortTime(reminder.createdAt) || Date.now(),
        accent: 'orange',
        action: 'class',
        targetClass: target
      });
    });
    if ((activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.popupEnabled) !== false && activeUpdateNotice !== null && activeUpdateNotice !== void 0 && activeUpdateNotice.version) {
      const audience = activeUpdateNotice.audience || 'all';
      const audienceMatched = audience === 'all' || audience === 'admin' && isAdmin || audience === 'students' && !isAdmin;
      if (audienceMatched) {
        const summary = String(activeUpdateNotice.summary || '').split('\n').filter(Boolean)[0] || '系統加入了新功能，打開後會顯示使用提示。';
        notices.push({
          id: `release-${activeUpdateNotice.source || 'notice'}-${activeUpdateNotice.version}`,
          type: 'release',
          icon: 'sparkles',
          title: activeUpdateNotice.title || '系統已更新',
          message: summary,
          meta: `版本 ${activeUpdateNotice.version}`,
          time: formatFirebaseDateTime(activeUpdateNotice.publishedAt) || '最近更新',
          sortTime: getSortTime(activeUpdateNotice.publishedAt) || Date.now(),
          accent: 'sky',
          action: 'release'
        });
      }
    }
    const expiredItems = items.filter(item => {
      if (!item || item.completed || item.isHidden) return false;
      if (item.forceExpired) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(item.dueDate);
      due.setHours(0, 0, 0, 0);
      return due instanceof Date && !isNaN(due.getTime()) && due < today;
    });
    if (expiredItems.length > 0) {
      notices.push({
        id: `cleanup-expired-${expiredItems.length}-${expiredItems.map(i => i.id).join('-')}`,
        type: 'cleanup',
        icon: 'trash-2',
        title: '要清理過期功課',
        message: `你有 ${expiredItems.length} 份過期功課未處理，建議盡快清理。`,
        meta: '個人手冊提醒',
        time: '現在',
        sortTime: Date.now() + 1,
        accent: 'rose',
        action: 'cleanup'
      });
    }
    if (timetableConfig !== null && timetableConfig !== void 0 && timetableConfig.updatedAt) {
      const updater = timetableConfig.updatedBy || '你';
      notices.push({
        id: `timetable-${timetableConfig.updatedAt}`,
        type: 'timetable',
        icon: 'calendar-clock',
        title: '時間表已更新',
        message: `${updater} 剛剛更改了上課時間表。`,
        meta: formatFirebaseDateTime(timetableConfig.updatedAt) || '最近更新',
        time: formatFirebaseDateTime(timetableConfig.updatedAt),
        sortTime: getSortTime(timetableConfig.updatedAt),
        accent: 'sky',
        action: 'timetable'
      });
    }
    visiblePublicTasks.slice(0, 12).forEach(task => {
      const targetCode = task.targetClass || '全校';
      const cls = systemClasses.find(c => c.code === targetCode);
      const targetName = targetCode === '全校' ? '全校' : (cls === null || cls === void 0 ? void 0 : cls.name) || targetCode;
      const sender = task.senderName || '管理員';
      const subjectName = task.subject || '其他';
      const taskText = task.description || '未填寫內容';
      const synced = syncedPublicIds.has(task.id);
      const forceExpired = task.forceExpired === true;
      notices.push({
        id: `public-${task.id}-${forceExpired ? 'expired' : 'active'}-${synced ? 'synced' : 'unsynced'}`,
        type: 'broadcast',
        icon: forceExpired ? 'archive-x' : synced ? 'check-circle-2' : 'bell-ring',
        title: forceExpired ? '一份廣播功課已撤回' : synced ? '你已收到一份功課' : `${sender} 新增了一份功課`,
        message: forceExpired ? `「${subjectName}｜${taskText}」已被撤回。` : synced ? `「${subjectName}｜${taskText}」已加入你的個人手冊。` : `${sender} 新增了「${subjectName}」功課：${taskText}`,
        meta: `${targetName}${task.dueDate ? ` · 交期 ${formatDueDate(task.dueDate)}` : ''}`,
        time: formatFirebaseDateTime(task.createdAt),
        sortTime: getSortTime(task.createdAt),
        accent: forceExpired ? 'slate' : synced ? 'emerald' : 'orange',
        action: forceExpired ? 'none' : 'class',
        targetClass: targetCode
      });
    });
    return notices.filter(notice => {
      if (notice.type === 'broadcast' && (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.broadcastReminder) === false) return false;
      if (notice.type === 'timetable' && (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.timetableReminder) === false) return false;
      if ((notice.type === 'overdue' || notice.type === 'reminder' || notice.type === 'cleanup') && (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.homeworkReminder) === false) return false;
      if ((notice.type === 'release' || notice.type === 'update') && (advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.updateReminder) === false) return false;
      return true;
    }).sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0)).map(n => ({
      ...n,
      unread: !readNotificationIds.includes(n.id)
    }));
  }, [systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.announcementText, systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.adminReminders, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.popupEnabled, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.version, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.title, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.summary, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.audience, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.publishedAt, activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.source, isAdmin, visiblePublicTasks, joinedClassesStr, systemClasses, syncedPublicIds, readNotificationIds, items, timetableConfig === null || timetableConfig === void 0 ? void 0 : timetableConfig.updatedAt, timetableConfig === null || timetableConfig === void 0 ? void 0 : timetableConfig.updatedBy, advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.broadcastReminder, advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.timetableReminder, advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.homeworkReminder, advancedPrefs === null || advancedPrefs === void 0 ? void 0 : advancedPrefs.updateReminder]);
  const unreadNotificationCount = useMemo(() => userNotifications.filter(n => n.unread).length, [userNotifications]);
  const filteredUserNotifications = useMemo(() => notificationFilter === 'unread' ? userNotifications.filter(n => n.unread) : userNotifications, [userNotifications, notificationFilter]);
  const markNotificationsRead = ids => {
    if (!(user !== null && user !== void 0 && user.uid)) return;
    const targetIds = Array.isArray(ids) ? ids : [ids];
    setReadNotificationIds(prev => {
      const merged = Array.from(new Set([...prev, ...targetIds.filter(Boolean)]));
      safeStorageSet(`ehandbook_read_notifications_${user.uid}`, JSON.stringify(merged));
      return merged;
    });
  };
  const handleOpenUserNotification = note => {
    if (!note) return;
    markNotificationsRead(note.id);
    if (note.action === 'class') {
      setViewMode('current');
      setAppMode('class');
      setSelectedClassBoard(note.targetClass || '全校');
    } else if (note.action === 'timetable') {
      setViewMode('timetable');
      setAppMode('personal');
    } else if (note.action === 'cleanup') {
      setViewMode('current');
      setAppMode('personal');
      triggerAlert('可以在主頁使用「清理過期」功能處理過期功課。');
    } else if (note.action === 'release') {
      setShowUpdateIntro(true);
    }
    setIsNotificationCenterOpen(false);
  };
  const classBoardOptions = useMemo(() => ['全校', ...(joinedClassesStr ? joinedClassesStr.split(',') : [])], [joinedClassesStr]);
  const selectedClassTasks = useMemo(() => {
    return visiblePublicTasks.filter(task => (task.targetClass || '全校') === selectedClassBoard);
  }, [visiblePublicTasks, selectedClassBoard]);
  const getTargetUsersForBroadcastTask = async task => {
    if (!db || !collection || !getDocs || !query) return [];
    const targetClass = (task === null || task === void 0 ? void 0 : task.targetClass) || '全校';
    const usersRef = collection(db, "users_public");
    const targetQuery = targetClass === '全校' ? query(usersRef) : query(usersRef, where("joinedClasses", "array-contains", targetClass));
    const snapshot = await getDocs(targetQuery);
    const blacklisted = (systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.blacklistedEmails) || [];
    return snapshot.docs.map(d => ({
      uid: d.id,
      ...d.data()
    })).filter(u => (u === null || u === void 0 ? void 0 : u.uid) && u.email !== ADMIN_EMAIL && !blacklisted.includes(u.email));
  };
  const buildBroadcastPersonalPayload = task => ({
    type: task.type || 'homework',
    subject: task.subject || '其他',
    description: task.description || '',
    dueDate: task.dueDate || '',
    completed: false,
    createdAt: new Date().toISOString(),
    publicRefId: task.id,
    senderName: task.senderName || '老師',
    targetClass: task.targetClass || '全校',
    priority: task.priority || 'normal',
    autoDelivered: true,
    autoSynced: true,
    syncedByAdmin: true,
    syncedAt: new Date().toISOString(),
    deliveryMode: 'auto_immediate',
    forceExpired: false,
    isHidden: false
  });
  const deliverBroadcastTaskToTargets = async (publicId, taskData) => {
    if (!db || !publicId) return 0;
    const task = {
      id: publicId,
      ...taskData
    };
    const targetUsers = await getTargetUsersForBroadcastTask(task);
    let batch = writeBatch(db);
    let pendingWrites = 0;
    let delivered = 0;
    const commitBatch = async () => {
      if (pendingWrites <= 0) return;
      await batch.commit();
      batch = writeBatch(db);
      pendingWrites = 0;
    };
    for (const targetUser of targetUsers) {
      batch.set(doc(db, "users", targetUser.uid, "items", `public_${publicId}`), buildBroadcastPersonalPayload(task), {
        merge: true
      });
      delivered++;
      pendingWrites++;
      if (pendingWrites >= 420) await commitBatch();
    }
    await commitBatch();
    await updateDoc(doc(db, "public_assignments", publicId), {
      deliveredAt: serverTimestamp(),
      deliveredCount: delivered,
      deliveryMode: 'auto_immediate'
    });
    return delivered;
  };
  const handleClaimPublicTask = async task => {
    if (!user || !db || !(task !== null && task !== void 0 && task.id)) return;
    if (syncingPublicIds[task.id]) return;
    setSyncingPublicIds(prev => ({
      ...prev,
      [task.id]: true
    }));
    try {
      await syncPublicTaskToPersonal(task, {
        silent: false,
        auto: false,
        source: 'manual_claim'
      });
    } catch (error) {
      console.warn("Manual claim public task failed:", error);
    } finally {
      setSyncingPublicIds(prev => {
        const next = {
          ...prev
        };
        delete next[task.id];
        return next;
      });
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (savingTaskRef.current) return;
    if (!description.trim() || !window.StudyCore.validDate(dueDate)) {
      triggerAlert("請輸入功課內容！", "error");
      return;
    }
    const performSubmit = async () => {
      if (savingTaskRef.current) return;
      savingTaskRef.current = true;
      setIsSavingTask(true);
      const newItem = {
        type: inputType,
        subject,
        description: description.trim(),
        dueDate,
        priority,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isTomorrowHomework = inputType === 'homework' && toLocalDateKey(dueDate) === toLocalDateKey(tomorrow);
      try {
        if (isBroadcast && isAdmin) {
          var _systemClasses$find;
          newItem.senderName = user.displayName || '老師';
          newItem.targetClass = targetClassInput;
          newItem.deliveryMode = 'auto_immediate';
          const publicRef = await addDoc(collection(db, "public_assignments"), newItem);
          const deliveredCount = await deliverBroadcastTaskToTargets(publicRef.id, newItem);
          const className = targetClassInput === '全校' ? '全校' : ((_systemClasses$find = systemClasses.find(c => c.code === targetClassInput)) === null || _systemClasses$find === void 0 ? void 0 : _systemClasses$find.name) || targetClassInput;
          triggerAlert(`已發送廣播功課給 ${className}，並已自動加入 ${deliveredCount} 位學生個人手冊！`);
        } else {
          await addDoc(collection(db, "users", user.uid, "items"), newItem);
          triggerAlert(isTomorrowHomework ? '已新增，明天功課數量已更新' : '已新增紀錄');
        }
        setDescription('');
        setPriority('normal');
        setIsComposerOpen(false);
        setAppMode('personal');
        setIsBroadcast(false);
        setTargetClassInput('全校');
        setSubjectManuallySelected(false);
        setSubjectPredictionApplied(false);
      } catch (error) {
        console.warn("新增或派發失敗", error);
        triggerAlert("新增或派發失敗：" + ((error === null || error === void 0 ? void 0 : error.message) || '請稍後再試'), "error");
      } finally {
        savingTaskRef.current = false;
        setIsSavingTask(false);
      }
    };
    if (isBroadcast && isAdmin) {
      var _systemClasses$find2;
      const targetName = targetClassInput === '全校' ? '全校' : ((_systemClasses$find2 = systemClasses.find(c => c.code === targetClassInput)) === null || _systemClasses$find2 === void 0 ? void 0 : _systemClasses$find2.name) || targetClassInput;
      triggerConfirm(`確定要發送廣播功課給【${targetName}】嗎？`, performSubmit);
    } else {
      performSubmit();
    }
  };
  const handleToggle = (id, currentCompletedStatus) => {
    if (!user || toggleLocksRef.current.has(id)) return;
    const targetItem = items.find(item => item.id === id);
    if (!targetItem || targetItem.withdrawn) return;
    toggleLocksRef.current.add(id);
    if (!currentCompletedStatus) {
      setExitingIds(prev => [...prev, id]);
      setTimeout(async () => {
        try {
          await updateDoc(doc(db, "users", user.uid, "items", id), {
            completed: true,
            completedAt: new Date().toISOString()
          });
          triggerAlert(`已完成「${(targetItem === null || targetItem === void 0 ? void 0 : targetItem.description) || '功課'}」`, 'success', {
            label: '查看紀錄',
            onClick: () => {
              setViewMode('history');
              setAppMode('personal');
              setSearchQuery('');
              setFilterSubject('全部');
              setSortOption('date_desc');
            }
          });
        } catch (error) {
          triggerAlert('未能更新完成狀態，請再試一次', 'error');
        } finally {
          toggleLocksRef.current.delete(id);
          setExitingIds(prev => prev.filter(eid => eid !== id));
        }
      }, 400);
    } else {
      updateDoc(doc(db, "users", user.uid, "items", id), {
        completed: false,
        completedAt: null
      }).then(() => triggerAlert('已放回待辦清單', 'success', {
        label: '查看待辦',
        onClick: () => {
          setViewMode('current');
          setAppMode('personal');
          setSearchQuery('');
        }
      })).catch(() => triggerAlert('未能還原功課，請再試一次', 'error')).finally(() => toggleLocksRef.current.delete(id));
    }
  };
  const handleUpdateItem = async (id, updatedData) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "items", id), updatedData);
      triggerAlert("更新成功！");
    } catch (e) {
      triggerAlert("更新失敗", "error");
      throw e;
    }
  };
  const deleteItem = id => {
    if (!user) return;
    const targetItem = items.find(i => i.id === id);
    if (!targetItem) return;
    triggerConfirm('確定要刪除這項紀錄嗎？', async () => {
      try {
        const itemRef = doc(db, "users", user.uid, "items", id);
        if (targetItem.publicRefId || targetItem.collabRefId) await updateDoc(itemRef, {
          isHidden: true
        });else await deleteDoc(itemRef);
        triggerAlert("已刪除紀錄", "success", {
          label: '復原',
          onClick: async () => {
            try {
              if (targetItem.publicRefId || targetItem.collabRefId) await updateDoc(itemRef, {
                isHidden: false
              });else {
                const ignoredId = targetItem.id,
                  restoreData = _objectWithoutProperties(targetItem, _excluded2);
                await setDoc(itemRef, restoreData);
              }
              triggerAlert('紀錄已復原');
            } catch (restoreError) {
              triggerAlert('未能復原紀錄', 'error');
            }
          }
        });
      } catch (e) {
        triggerAlert("刪除失敗", "error");
      }
    });
  };
  const deletePublicItem = (publicId, privateId) => {
    if (!user) return;
    const publicTask = publicTasks.find(task => task.id === publicId);
    triggerConfirm('確定要撤回呢份班級功課嗎？所有目標學生個人手冊內的副本亦會一併移除。', async () => {
      try {
        const targetUsers = publicTask ? await getTargetUsersForBroadcastTask(publicTask) : [];
        let batch = writeBatch(db);
        let pendingWrites = 0;
        const commitBatch = async () => {
          if (!pendingWrites) return;
          await batch.commit();
          batch = writeBatch(db);
          pendingWrites = 0;
        };
        batch.delete(doc(db, "public_assignments", publicId));
        pendingWrites++;
        for (const targetUser of targetUsers) {
          const copies = await getDocs(query(collection(db, "users", targetUser.uid, "items"), where("publicRefId", "==", publicId)));
          copies.forEach(copy => {
            batch.delete(copy.ref);
            pendingWrites++;
          });
          if (pendingWrites >= 420) await commitBatch();
        }
        if (privateId) {
          batch.delete(doc(db, "users", user.uid, "items", privateId));
          pendingWrites++;
        }
        await commitBatch();
        triggerAlert("廣播功課已完全撤回");
      } catch (e) {
        triggerAlert("撤回失敗：" + ((e === null || e === void 0 ? void 0 : e.message) || '請稍後再試'), "error");
      }
    });
  };
  const handleClearExpired = () => {
    if (!user) return;
    const expiredItems = items.filter(item => {
      if (item.completed) return false;
      if (item.forceExpired) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(item.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    });
    if (expiredItems.length === 0) {
      triggerAlert("目前沒有過期的未完成功課！🎉");
      return;
    }
    triggerConfirm(`確定要一鍵清理 ${expiredItems.length} 個過期項目嗎？`, async () => {
      try {
        const batch = writeBatch(db);
        expiredItems.forEach(item => {
          if (item.publicRefId || item.collabRefId) batch.update(doc(db, "users", user.uid, "items", item.id), {
            isHidden: true
          });else batch.delete(doc(db, "users", user.uid, "items", item.id));
        });
        await batch.commit();
        triggerAlert(`成功清理了 ${expiredItems.length} 個過期項目！`);
      } catch (e) {
        triggerAlert("清理發生錯誤", "error");
      }
    });
  };
  const handleClearHistory = () => {
    if (!user) return;
    const completedItems = items.filter(item => item.completed);
    if (completedItems.length === 0) {
      triggerAlert("目前沒有任何已完成的歷史紀錄！");
      return;
    }
    triggerConfirm(`確定要一鍵清理全部 ${completedItems.length} 個歷史紀錄嗎？`, async () => {
      try {
        const batch = writeBatch(db);
        completedItems.forEach(item => {
          if (item.publicRefId || item.collabRefId) batch.update(doc(db, "users", user.uid, "items", item.id), {
            isHidden: true
          });else batch.delete(doc(db, "users", user.uid, "items", item.id));
        });
        await batch.commit();
        triggerAlert(`成功清理了 ${completedItems.length} 個歷史紀錄！`);
      } catch (e) {
        triggerAlert("清理發生錯誤", "error");
      }
    });
  };
  const saveTimetableConfig = async newConfig => {
    if (!user) return;
    try {
      const payload = {
        ...JSON.parse(JSON.stringify(newConfig)),
        updatedAt: new Date().toISOString(),
        updatedBy: user.displayName || '你'
      };
      await setDoc(doc(db, 'users', user.uid, 'settings', 'timetable'), payload);
      triggerAlert("時間表已儲存");
      setViewMode('timetable');
    } catch (e) {
      triggerAlert("儲存失敗", "error");
    }
  };
  const saveSubjects = async function (newSubjects) {
    let renameMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!user) return;
    try {
      const cleanSubjects = JSON.parse(JSON.stringify(newSubjects));
      const hasRenames = Object.keys(renameMap).length > 0;
      const nextTimetable = hasRenames ? {
        ...timetableConfig,
        schedule: Object.fromEntries(Object.entries(timetableConfig.schedule || {}).map(_ref38 => {
          let _ref39 = _slicedToArray(_ref38, 2),
            day = _ref39[0],
            daySubjects = _ref39[1];
          return [day, (daySubjects || []).map(name => renameMap[name] || name)];
        }))
      } : timetableConfig;
      let batch = writeBatch(db);
      let writeCount = 0;
      const commitBatch = async () => {
        if (!writeCount) return;
        await batch.commit();
        batch = writeBatch(db);
        writeCount = 0;
      };
      batch.set(doc(db, 'users', user.uid, 'settings', 'subjects'), {
        list: cleanSubjects
      });
      writeCount++;
      if (hasRenames) {
        batch.set(doc(db, 'users', user.uid, 'settings', 'timetable'), JSON.parse(JSON.stringify(nextTimetable)));
        writeCount++;
        for (const item of items.filter(entry => renameMap[entry.subject] && !entry.collabRefId)) {
          batch.update(doc(db, 'users', user.uid, 'items', item.id), {
            subject: renameMap[item.subject]
          });
          writeCount++;
          if (writeCount >= 400) await commitBatch();
        }
      }
      await commitBatch();
      setSubjects(cleanSubjects);
      if (hasRenames) setTimetableConfig(nextTimetable);
      const nextSelectedSubject = renameMap[subject] || subject;
      const availableNames = cleanSubjects.map(item => item.name);
      setSubject(availableNames.includes(nextSelectedSubject) ? nextSelectedSubject : availableNames[0] || '其他');
      if (filterSubject !== '全部') {
        const nextFilter = renameMap[filterSubject] || filterSubject;
        setFilterSubject(availableNames.includes(nextFilter) ? nextFilter : '全部');
      }
      triggerAlert(hasRenames ? '科目及相關功課已同步更新' : '科目設定已更新');
      return true;
    } catch (error) {
      console.warn('儲存科目失敗', error);
      triggerAlert('儲存科目失敗，請稍後再試', 'error');
      return false;
    }
  };
  const handleExportData = () => {
    try {
      const backup = {
        app: '電子手冊 Pro StudyOS',
        version: window.__EHANDBOOK_VERSION__,
        exportedAt: new Date().toISOString(),
        user: {
          displayName,
          email: (user === null || user === void 0 ? void 0 : user.email) || ''
        },
        items: items.map(_ref40 => {
          let id = _ref40.id,
            item = _objectWithoutProperties(_ref40, _excluded3);
          return {
            id,
            ...item
          };
        }),
        subjects,
        timetable: timetableConfig,
        joinedClasses,
        collaboration: {
          account: collab.account,
          groups: collab.groups,
          preferences: collab.preferences,
          issued: collab.issued,
          drafts: collab.drafts,
          inbox: collab.inbox
        }
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ehandbook-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      triggerAlert('備份檔案已下載');
    } catch (e) {
      triggerAlert('未能匯出備份', 'error');
    }
  };
  const handleSettingsPasswordReset = async () => {
    if (!(user !== null && user !== void 0 && user.email) || !sendPasswordResetEmail || !auth) {
      triggerAlert('目前帳戶未能使用電郵重設密碼。', 'error');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      triggerAlert(`密碼重設連結已發送到 ${user.email}`);
    } catch (error) {
      triggerAlert(getFriendlyAuthError(error, 'reset'), 'error');
    }
  };
  const handleRefreshApp = async () => {
    try {
      var _navigator$serviceWor, _navigator$serviceWor2, _registration$update;
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.filter(key => key.startsWith('ehandbook-')).map(key => caches.delete(key)));
      }
      const registration = await ((_navigator$serviceWor = navigator.serviceWorker) === null || _navigator$serviceWor === void 0 || (_navigator$serviceWor2 = _navigator$serviceWor.getRegistration) === null || _navigator$serviceWor2 === void 0 ? void 0 : _navigator$serviceWor2.call(_navigator$serviceWor));
      await (registration === null || registration === void 0 || (_registration$update = registration.update) === null || _registration$update === void 0 ? void 0 : _registration$update.call(registration));
      triggerAlert('已準備最新版本，正在重新載入…');
      setTimeout(() => window.location.reload(), 650);
    } catch (error) {
      triggerAlert('未能重新載入更新，請完全關閉程式後再開。', 'error');
    }
  };
  const handleLogout = () => {
    triggerConfirm("確定要登出系統嗎？", () => window.firebaseServices.signOut(auth));
  };
  const activeItems = items.filter(i => !i.completed && !i.forceExpired && !i.withdrawn && !i.isHidden);
  const completedVisibleCount = items.filter(item => item.completed && !item.isHidden).length;
  const subjectUsageCounts = useMemo(() => items.reduce((countsBySubject, item) => {
    const subjectName = item.subject || '其他';
    countsBySubject[subjectName] = (countsBySubject[subjectName] || 0) + 1;
    return countsBySubject;
  }, {}), [items]);
  const getDaysRemaining = dateValue => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueKey = toLocalDateKey(dateValue);
    if (!dueKey) return 0;
    const _dueKey$split$map = dueKey.split('-').map(Number),
      _dueKey$split$map2 = _slicedToArray(_dueKey$split$map, 3),
      year = _dueKey$split$map2[0],
      month = _dueKey$split$map2[1],
      day = _dueKey$split$map2[2];
    const due = new Date(year, month - 1, day);
    return Math.round((due - today) / 86400000);
  };
  const displayedItems = items.filter(item => {
    if (item.isHidden) return false;
    if (viewMode === 'history' && !item.completed && !item.withdrawn) return false;
    if (viewMode === 'current' && (item.completed || item.withdrawn)) return false;
    if (filterSubject !== '全部' && (item.subject || '其他') !== filterSubject) return false;
    if (searchQuery.trim() && !String(item.description || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    if (a.forceExpired !== b.forceExpired) return a.forceExpired ? 1 : -1;
    if (viewMode === 'history') {
      const completedTimeA = new Date(a.completedAt || a.dueDate || a.createdAt || 0).getTime() || 0;
      const completedTimeB = new Date(b.completedAt || b.dueDate || b.createdAt || 0).getTime() || 0;
      return sortOption === 'date_asc' ? completedTimeA - completedTimeB : completedTimeB - completedTimeA;
    }
    if (advancedPrefs !== null && advancedPrefs !== void 0 && advancedPrefs.focusFirst && viewMode === 'current') {
      const priorityWeight = {
        high: 0,
        normal: 1,
        low: 2
      };
      const priorityDiff = (priorityWeight[a.priority || 'normal'] ?? 1) - (priorityWeight[b.priority || 'normal'] ?? 1);
      if (priorityDiff !== 0) return priorityDiff;
    }
    return sortOption === 'date_desc' ? dateB - dateA : dateA - dateB;
  });
  const openQuickView = type => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    let title = '';
    let filteredItems = [];
    if (type === 'today') {
      title = '今天到期的功課';
      filteredItems = activeItems.filter(i => toLocalDateKey(i.dueDate) === todayStr && i.type === 'homework');
    } else if (type === 'tomorrow') {
      title = '明天到期的功課';
      filteredItems = activeItems.filter(i => toLocalDateKey(i.dueDate) === tomorrowStr && i.type === 'homework');
    } else if (type === 'future') {
      title = '日後要交的功課';
      filteredItems = activeItems.filter(i => toLocalDateKey(i.dueDate) > tomorrowStr && i.type === 'homework');
    } else if (type === 'test') {
      title = '默書測驗考試';
      filteredItems = activeItems.filter(i => i.type !== 'homework');
    }
    setQuickView({
      isOpen: true,
      title,
      items: filteredItems
    });
  };
  const getCounts = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    const todayActive = activeItems.filter(i => toLocalDateKey(i.dueDate) === todayStr && i.type === 'homework');
    const calendarCounts = window.StudyCore.counts(items, today);
    const todayCompletedCount = calendarCounts.today.completed;
    const totalToday = todayActive.length + todayCompletedCount;
    const progressPercent = totalToday === 0 ? 100 : Math.round(todayCompletedCount / totalToday * 100);
    const tomorrowActive = activeItems.filter(i => toLocalDateKey(i.dueDate) === tomorrowStr && i.type === 'homework');
    const tomorrowCompletedCount = calendarCounts.tomorrow.completed;
    const totalTomorrow = tomorrowActive.length + tomorrowCompletedCount;
    const tomorrowProgressPercent = totalTomorrow === 0 ? 0 : Math.round(tomorrowCompletedCount / totalTomorrow * 100);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (today.getDay() + 6) % 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    const weekItems = items.filter(i => !i.isHidden && !i.withdrawn && !i.forceExpired && i.dueDate && (() => {
      const d = new Date(`${toLocalDateKey(i.dueDate)}T00:00:00`);
      return d >= weekStart && d <= weekEnd;
    })());
    const weekCompleted = weekItems.filter(i => i.completed).length;
    const weekProgressPercent = weekItems.length === 0 ? 100 : Math.round(weekCompleted / weekItems.length * 100);
    return {
      today: todayActive.length,
      todayCompleted: todayCompletedCount,
      todayTotal: totalToday,
      tomorrow: tomorrowActive.length,
      tomorrowCompleted: tomorrowCompletedCount,
      tomorrowTotal: totalTomorrow,
      tomorrowProgressPercent,
      future: activeItems.filter(i => toLocalDateKey(i.dueDate) > tomorrowStr && i.type === 'homework').length,
      test: activeItems.filter(i => i.type !== 'homework').length,
      overdue: items.filter(i => !i.completed && !i.isHidden && !i.withdrawn && (i.forceExpired || i.dueDate && toLocalDateKey(i.dueDate) < todayStr)).length,
      progressPercent,
      weekCompleted,
      weekTotal: weekItems.length,
      weekProgressPercent
    };
  };
  const counts = getCounts();
  const displayName = (userProfile === null || userProfile === void 0 ? void 0 : userProfile.displayName) || (user === null || user === void 0 ? void 0 : user.displayName) || String((user === null || user === void 0 ? void 0 : user.email) || '').split('@')[0] || '同學';
  const greetingText = globalNow.getHours() < 12 ? '早晨' : globalNow.getHours() < 18 ? '下午好' : '晚上好';
  const tomorrowHeadline = counts.tomorrow > 0 ? `明天有 ${counts.tomorrow} 份功課要交` : counts.tomorrowTotal > 0 ? '明天功課已全部完成' : '明天暫時沒有功課要交';
  const todaySummary = counts.today > 0 ? `今日尚餘 ${counts.today} 份功課` : counts.todayTotal > 0 ? '今日功課已全部完成' : '今日沒有功課要交';
  const isVisible = componentName => {
    if (viewMode === 'history') return componentName === 'list';
    if (layoutMode === 'normal') return true;
    if (layoutMode === 'minimal') return componentName === 'cards' || componentName === 'list';
    if (layoutMode === 'custom') return customLayout[componentName];
    return true;
  };
  if (authLoading) return React.createElement("div", {
    className: "min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"
  }, React.createElement("div", {
    className: "spinner"
  }));
  if (!user) {
    return React.createElement(React.Fragment, null, React.createElement(AuthPage, {
      triggerAlert: triggerAlert,
      onAuthenticated: signedInUser => {
        setUser(signedInUser);
        setAuthLoading(false);
      }
    }), React.createElement("div", {
      className: `fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${toast.isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-95 pointer-events-none'}`
    }, React.createElement("div", {
      className: `px-5 py-3 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-xl flex items-center gap-3 font-bold text-sm tracking-wide border ${toast.type === 'error' ? 'bg-red-500/95 text-white border-red-400' : 'bg-slate-900/95 text-white border-slate-800 dark:bg-white/95 dark:text-slate-900 dark:border-white/50'}`
    }, React.createElement(Icon, {
      name: toast.type === 'error' ? 'alert-triangle' : 'check-circle-2',
      className: `w-5 h-5 ${toast.type === 'error' ? 'text-white' : 'text-emerald-400'}`
    }), toast.message, toast.action && React.createElement("button", {
      type: "button",
      onClick: () => {
        var _toast$action, _toast$action$onClick;
        (_toast$action = toast.action) === null || _toast$action === void 0 || (_toast$action$onClick = _toast$action.onClick) === null || _toast$action$onClick === void 0 || _toast$action$onClick.call(_toast$action);
        setToast(prev => ({
          ...prev,
          isVisible: false,
          action: null
        }));
      },
      className: "ml-2 px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs font-black"
    }, toast.action.label || '復原'))));
  }
  const maintenanceMode = (systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.maintenanceMode) || 'normal';
  if (maintenanceMode !== 'normal' && !isAdmin) return React.createElement(BlockScreen, {
    type: maintenanceMode,
    estimatedTime: systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.estimatedTime,
    customMessage: systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.message,
    customTitle: systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.maintenanceTitle,
    user: user
  });
  if (systemConfig !== null && systemConfig !== void 0 && systemConfig.whitelistEnabled && !isAdmin && !(systemConfig !== null && systemConfig !== void 0 && (_systemConfig$allowed = systemConfig.allowedEmails) !== null && _systemConfig$allowed !== void 0 && _systemConfig$allowed.includes(user.email))) return React.createElement(BlockScreen, {
    type: "whitelist_blocked",
    user: user
  });
  if (systemConfig !== null && systemConfig !== void 0 && systemConfig.blacklistEnabled && !isAdmin && systemConfig !== null && systemConfig !== void 0 && (_systemConfig$blackli = systemConfig.blacklistedEmails) !== null && _systemConfig$blackli !== void 0 && _systemConfig$blackli.includes(user.email)) return React.createElement(BlockScreen, {
    type: "access_denied",
    customTitle: "\u5E33\u865F\u505C\u6B0A",
    customMessage: "\u60A8\u7684\u5E33\u865F\u5DF2\u88AB\u7BA1\u7406\u54E1\u5217\u5165\u9ED1\u540D\u55AE\uFF0C\u7121\u6CD5\u5B58\u53D6\u672C\u7CFB\u7D71\u3002",
    user: user
  });
  const pageMeta = viewMode === 'collaboration' ? {
    title: '群組協作',
    subtitle: '邀請、發放與個人同步',
    icon: 'users'
  } : viewMode === 'settings' ? {
    title: '應用程式設定',
    subtitle: '按分類調整帳戶、外觀、提醒與資料',
    icon: 'sliders-horizontal'
  } : viewMode === 'calendar' ? {
    title: '功課月曆',
    subtitle: '按日期檢視、完成或修改功課',
    icon: 'calendar-days'
  } : viewMode === 'timetable' ? {
    title: '上課時間表',
    subtitle: '即時查看課堂、轉堂及下一節',
    icon: 'calendar-clock'
  } : viewMode === 'timetable_edit' ? {
    title: '編輯時間表',
    subtitle: '先設定時間，再編排星期一至五課堂',
    icon: 'calendar-cog'
  } : viewMode === 'history' ? {
    title: '完成紀錄',
    subtitle: `${completedVisibleCount} 項已完成，可隨時放回待辦`,
    icon: 'archive-restore'
  } : appMode === 'class' ? {
    title: '我的班級',
    subtitle: `${joinedClasses.length} 個班級，自動接收最新功課`,
    icon: 'school'
  } : {
    title: '今日工作台',
    subtitle: `明天 ${counts.tomorrow} 份功課 · 今日尚餘 ${counts.today} 份`,
    icon: 'book-open'
  };
  return React.createElement("div", {
    className: `app-shell min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-900 font-sans relative overflow-hidden p-4 sm:p-6 md:p-8 pb-32 ${systemConfig !== null && systemConfig !== void 0 && systemConfig.announcementText ? 'pt-14 sm:pt-16 md:pt-20' : ''}`
  }, React.createElement("div", {
    className: `fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${toast.isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-95 pointer-events-none'}`
  }, React.createElement("div", {
    className: `px-5 py-3 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-xl flex items-center gap-3 font-bold text-sm tracking-wide border ${toast.type === 'error' ? 'bg-red-500/95 text-white border-red-400' : 'bg-slate-900/95 text-white border-slate-800 dark:bg-white/95 dark:text-slate-900 dark:border-white/50'}`
  }, React.createElement(Icon, {
    name: toast.type === 'error' ? 'alert-triangle' : 'check-circle-2',
    className: `w-5 h-5 ${toast.type === 'error' ? 'text-white' : 'text-emerald-400'}`
  }), toast.message, toast.action && React.createElement("button", {
    type: "button",
    onClick: () => {
      var _toast$action2, _toast$action2$onClic;
      (_toast$action2 = toast.action) === null || _toast$action2 === void 0 || (_toast$action2$onClic = _toast$action2.onClick) === null || _toast$action2$onClic === void 0 || _toast$action2$onClic.call(_toast$action2);
      setToast(prev => ({
        ...prev,
        isVisible: false,
        action: null
      }));
    },
    className: "ml-2 px-3 py-1.5 rounded-xl bg-white/15 dark:bg-slate-900/10 border border-white/20 dark:border-slate-300/30 text-xs font-black"
  }, toast.action.label || '復原'))), React.createElement("div", {
    className: "fixed inset-0 z-0 pointer-events-none overflow-hidden"
  }, React.createElement("div", {
    className: `ambient-orb absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 dark:opacity-10 animate-blob ${t.bg}`
  }), React.createElement("div", {
    className: "ambient-orb absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-purple-500"
  })), (systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.announcementText) && React.createElement("div", {
    className: "fixed top-0 left-0 w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white overflow-hidden shadow-md z-40 flex items-center h-10 sm:h-12"
  }, React.createElement("div", {
    className: "px-3 sm:px-4 h-full bg-amber-500 z-20 shrink-0 flex items-center gap-2 font-bold text-xs sm:text-sm shadow-[5px_0_15px_rgba(245,158,11,0.5)]"
  }, React.createElement(Icon, {
    name: "bell",
    className: "w-4 h-4 animate-bounce"
  }), " \u6700\u65B0\u516C\u544A"), React.createElement("div", {
    className: "flex-1 overflow-hidden h-full flex items-center group"
  }, React.createElement("div", {
    className: "animate-marquee whitespace-nowrap text-xs sm:text-sm font-bold tracking-wider"
  }, systemConfig.announcementText))), !isOnline && React.createElement("div", {
    className: `fixed ${systemConfig !== null && systemConfig !== void 0 && systemConfig.announcementText ? 'top-10 sm:top-12' : 'top-0'} left-0 right-0 z-50 bg-slate-900 text-white px-4 py-2 text-center text-sm font-black shadow-lg`
  }, React.createElement("span", {
    className: "inline-flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "wifi-off",
    className: "w-4 h-4"
  }), "\u76EE\u524D\u96E2\u7DDA\uFF1B\u5DF2\u8F09\u5165\u5167\u5BB9\u4ECD\u53EF\u67E5\u770B\uFF0C\u4FEE\u6539\u6703\u5728\u6062\u5FA9\u7DB2\u7D61\u5F8C\u518D\u8A66\u3002")), React.createElement("div", {
    className: "max-w-[1200px] mx-auto relative z-10 transition-all duration-500"
  }, viewMode !== 'admin' && React.createElement("header", {
    className: "app-header flex items-center justify-between gap-2 mb-6 max-w-5xl mx-auto glass-card bg-white/90 dark:bg-slate-900/90 px-4 sm:px-5 py-3.5 sm:py-4 rounded-[2rem]"
  }, React.createElement("div", {
    className: "flex items-center gap-2 sm:gap-3 min-w-0 flex-1"
  }, React.createElement("div", {
    className: `app-header-icon w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br ${t.gradient} text-white shadow-lg`
  }, React.createElement(Icon, {
    name: pageMeta.icon,
    className: "w-6 h-6"
  })), React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("h1", {
    className: "text-lg sm:text-xl font-black text-slate-800 dark:text-white leading-tight tracking-tight truncate"
  }, pageMeta.title, " ", React.createElement("span", {
    className: "co-version"
  }, "3.1.0")), React.createElement("p", {
    className: "text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate"
  }, pageMeta.subtitle))), React.createElement("div", {
    className: "flex items-center gap-1.5 sm:gap-3 shrink-0"
  }, React.createElement("div", {
    className: "hidden lg:block text-right mr-1"
  }, React.createElement("div", {
    className: "text-xs font-black text-slate-600 dark:text-slate-300"
  }, globalNow.toLocaleDateString('zh-HK', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  })), React.createElement("div", {
    className: "text-[10px] font-bold text-slate-400 mt-0.5"
  }, "StudyOS v3.1.0")), viewMode === 'current' && appMode === 'personal' && React.createElement("button", {
    type: "button",
    onClick: () => setIsSubjectManagerOpen(true),
    "aria-label": "\u958B\u555F\u79D1\u76EE\u7BA1\u7406",
    className: "flex p-2.5 sm:px-3 sm:py-2.5 rounded-2xl font-black text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-600 active:scale-95 transition-all items-center gap-2",
    title: "\u79D1\u76EE\u7BA1\u7406"
  }, React.createElement(Icon, {
    name: "book-marked",
    className: "w-4 h-4"
  }), React.createElement("span", {
    className: "hidden sm:inline"
  }, "\u79D1\u76EE")), viewMode === 'timetable' && React.createElement("button", {
    onClick: () => setViewMode('timetable_edit'),
    className: "px-3 py-2 rounded-xl font-bold text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 shadow-sm transition-all flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "book-open",
    className: "w-4 h-4"
  }), React.createElement("span", {
    className: "hidden sm:inline"
  }, "\u7DE8\u8F2F\u6642\u9593\u8868")), React.createElement("button", {
    type: "button",
    onClick: () => setIsNotificationCenterOpen(true),
    className: `relative p-2.5 rounded-2xl border shadow-sm transition-all active:scale-95 ${unreadNotificationCount + collab.unread > 0 ? 'bg-orange-500 text-white border-orange-400 shadow-orange-200/60 dark:shadow-orange-900/30' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`,
    title: "\u901A\u77E5\u4E2D\u5FC3"
  }, React.createElement(Icon, {
    name: "bell",
    className: "w-4 h-4"
  }), unreadNotificationCount + collab.unread > 0 && React.createElement("span", {
    className: "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 leading-none"
  }, unreadNotificationCount + collab.unread > 9 ? '9+' : unreadNotificationCount + collab.unread)))), viewMode === 'admin' && React.createElement("div", {
    className: "animate-item"
  }, React.createElement("button", {
    type: "button",
    className: "co-btn primary mb-4",
    onClick: () => {
      setViewMode('collaboration');
      setCollabTab('admin');
    }
  }, "\u5E33\u6236\u7DE8\u865F\u53CA\u7FA4\u7D44\u7BA1\u7406 \u2192"), React.createElement(AdminConsole, {
    db: db,
    systemConfig: systemConfig,
    systemClasses: systemClasses,
    onBack: () => {
      setViewMode('current');
      setAppMode('personal');
    },
    subjects: subjects,
    triggerAlert: triggerAlert,
    triggerConfirm: triggerConfirm
  })), dataError && React.createElement("div", {
    role: "alert",
    className: "co-notice error",
    style: {
      marginBottom: '1rem'
    }
  }, dataError), viewMode !== 'admin' && React.createElement("div", {
    key: `${viewMode}-${appMode}`,
    className: "view-stage"
  }, viewMode === 'collaboration' ? React.createElement(CollaborationWorkspace, {
    collab: collab,
    user: user,
    items: items,
    subjects: subjects,
    notify: triggerAlert,
    onConfirm: triggerConfirm,
    initialTab: collabTab,
    onLegacy: () => {
      setViewMode('current');
      setAppMode('class');
    }
  }) : viewMode === 'calendar' ? React.createElement(TaskCalendar, {
    items: items,
    subjects: subjects,
    onEdit: setEditingItem,
    onToggle: handleToggle
  }) : viewMode === 'timetable' ? React.createElement("div", {
    className: "max-w-3xl mx-auto"
  }, React.createElement(Timetable, {
    currentDay: currentTimetableDay,
    config: timetableConfig,
    onDayChange: setCurrentTimetableDay,
    subjects: subjects,
    globalNow: globalNow
  })) : viewMode === 'timetable_edit' ? React.createElement(TimetableEditor, {
    initialConfig: timetableConfig,
    onSave: saveTimetableConfig,
    onCancel: () => setViewMode('timetable'),
    subjects: subjects,
    triggerConfirm: triggerConfirm,
    triggerAlert: triggerAlert
  }) : viewMode === 'settings' ? React.createElement(UserSettingsPage, {
    user: user,
    collab: collab,
    notify: triggerAlert,
    userProfile: userProfile,
    t: t,
    unreadNotificationCount: unreadNotificationCount,
    subjectCount: subjects.length,
    itemCount: items.length,
    isOnline: isOnline,
    appearanceMode: appearanceMode,
    setAppearanceMode: setAppearanceMode,
    themeColor: themeColor,
    setThemeColor: setThemeColor,
    layoutMode: layoutMode,
    setLayoutMode: setLayoutMode,
    customLayout: customLayout,
    setCustomLayout: setCustomLayout,
    advancedPrefs: advancedPrefs,
    setAdvancedPrefs: setAdvancedPrefs,
    onOpenNotifications: () => setIsNotificationCenterOpen(true),
    onOpenAppearance: () => setIsPreferencesOpen(true),
    onOpenSubjects: () => setIsSubjectManagerOpen(true),
    onGoClass: () => {
      setViewMode('collaboration');
      setCollabTab('groups');
    },
    onExport: handleExportData,
    onResetPassword: handleSettingsPasswordReset,
    onRefreshApp: handleRefreshApp,
    onLogout: handleLogout
  }) : React.createElement("div", {
    className: "max-w-3xl mx-auto pt-2"
  }, appMode === 'personal' && viewMode === 'current' && React.createElement("button", {
    type: "button",
    className: "co-history-link w-full mb-4",
    onClick: () => {
      setViewMode('history');
      setSearchQuery('');
      setFilterSubject('全部');
      setSortOption('date_desc');
    }
  }, React.createElement("span", null, "\u5B8C\u6210\u7D00\u9304\u8207\u5DF2\u64A4\u56DE\u9805\u76EE"), React.createElement("span", null, completedVisibleCount, " \u9805\u5B8C\u6210 \u2192")), viewMode === 'current' && appMode === 'personal' && isVisible('cards') && React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 animate-fadeIn"
  }, React.createElement("div", {
    className: "study-hero motion-hero col-span-2 sm:col-span-3"
  }, React.createElement("div", {
    className: "relative z-10 flex items-center justify-between gap-5"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "text-sm font-black text-indigo-200"
  }, greetingText, "\uFF0C", displayName, " \xB7 \u660E\u5929\u529F\u8AB2"), React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-black tracking-tight mt-1"
  }, tomorrowHeadline), React.createElement("div", {
    className: "flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm font-bold text-slate-300"
  }, React.createElement("span", null, todaySummary), React.createElement("span", null, "\u672C\u9031\u5B8C\u6210 ", counts.weekCompleted, "/", counts.weekTotal), React.createElement("span", {
    className: counts.overdue > 0 ? 'text-rose-300' : 'text-emerald-300'
  }, counts.overdue > 0 ? `${counts.overdue} 項逾期` : '沒有逾期'))), React.createElement("div", {
    className: "progress-ring",
    style: {
      '--progress': `${counts.weekProgressPercent}%`
    },
    "aria-label": `本週完成進度 ${counts.weekProgressPercent}%`
  }, React.createElement("span", null, counts.weekProgressPercent, "%")))), React.createElement("button", {
    onClick: () => openQuickView('tomorrow'),
    className: "metric-card motion-card motion-delay-1 col-span-2 sm:col-span-1 relative overflow-hidden glass-card bg-white/95 dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl flex justify-between items-center hover:-translate-y-0.5 transition-all group border border-white/40"
  }, React.createElement("div", {
    className: "flex flex-col items-start gap-1 z-10 w-full"
  }, React.createElement("div", {
    className: "text-slate-500 text-xs font-bold flex items-center gap-1.5"
  }, React.createElement("div", {
    className: "w-2 h-2 rounded-full bg-indigo-500 shadow-sm"
  }), "\u660E\u5929\u529F\u8AB2"), React.createElement("div", {
    className: "motion-number text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-blue-600 font-black text-3xl sm:text-4xl tracking-tight"
  }, counts.tomorrow), React.createElement("div", {
    className: "w-full mt-1 sm:mt-2"
  }, React.createElement("div", {
    className: "flex justify-between text-[10px] font-bold text-slate-400 mb-1"
  }, React.createElement("span", null, "\u660E\u65E5\u529F\u8AB2\u9032\u5EA6"), React.createElement("span", null, counts.tomorrowProgressPercent, "%")), React.createElement("div", {
    className: "h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
  }, React.createElement("div", {
    className: "motion-progress h-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-1000 ease-out",
    style: {
      width: `${counts.tomorrowProgressPercent}%`
    }
  })))), React.createElement(Icon, {
    name: "calendar-clock",
    className: "absolute -bottom-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 text-indigo-500/10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 z-0 pointer-events-none"
  })), React.createElement("button", {
    onClick: () => openQuickView('today'),
    className: "metric-card motion-card motion-delay-2 col-span-1 relative overflow-hidden glass-card bg-white/95 dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl flex flex-col justify-center items-start hover:-translate-y-0.5 transition-all group border border-white/40"
  }, React.createElement("div", {
    className: "text-slate-500 text-xs font-bold flex items-center gap-1.5 mb-1 z-10"
  }, React.createElement("div", {
    className: "w-1.5 h-1.5 rounded-full bg-orange-500"
  }), "\u4ECA\u65E5\u5C1A\u9918"), React.createElement("div", {
    className: "motion-number text-orange-500 font-black text-2xl sm:text-3xl z-10"
  }, counts.today)), React.createElement("button", {
    onClick: () => openQuickView('test'),
    className: "metric-card motion-card motion-delay-3 col-span-1 relative overflow-hidden glass-card bg-white/95 dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl flex flex-col justify-center items-start hover:-translate-y-0.5 transition-all group border border-white/40"
  }, React.createElement("div", {
    className: "text-slate-500 text-xs font-bold flex items-center gap-1.5 mb-1 z-10"
  }, React.createElement("div", {
    className: "w-1.5 h-1.5 rounded-full bg-violet-500"
  }), "\u6E2C\u9A57\u8003\u8A66"), React.createElement("div", {
    className: "motion-number text-violet-500 font-black text-2xl sm:text-3xl z-10"
  }, counts.test))), viewMode === 'current' && appMode === 'personal' && isVisible('timetable') && React.createElement(CurrentLessonWidget, {
    config: timetableConfig,
    t: t,
    onClick: () => setViewMode('timetable'),
    globalNow: globalNow
  }), (viewMode === 'current' || viewMode === 'history') && appMode === 'personal' && React.createElement(React.Fragment, null, (isVisible('input') || isComposerOpen) && ReactDOM.createPortal(React.createElement(React.Fragment, null, isComposerOpen && React.createElement("div", {
    className: "composer-scrim",
    "aria-hidden": "true",
    onClick: () => setIsComposerOpen(false)
  }), React.createElement("form", {
    onSubmit: handleSubmit,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "task-composer-title",
    className: `task-composer ${isComposerOpen ? 'task-composer-open' : 'task-composer-closed'} relative flex flex-col gap-4 p-5 sm:p-6 glass-card bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700`
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black tracking-widest text-indigo-500 uppercase"
  }, "Quick add"), React.createElement("h3", {
    id: "task-composer-title",
    className: "text-xl font-black text-slate-900 dark:text-white mt-1"
  }, "\u65B0\u589E\u7D00\u9304")), React.createElement("button", {
    type: "button",
    onClick: () => setIsComposerOpen(false),
    "aria-label": "\u95DC\u9589\u65B0\u589E\u7D00\u9304",
    className: "w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 grid place-items-center active:scale-95"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-5 h-5"
  }))), React.createElement("div", {
    className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
  }, React.createElement("div", {
    className: "flex bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl w-full sm:w-auto shadow-inner"
  }, React.createElement("button", {
    type: "button",
    onClick: () => setInputType('homework'),
    className: `flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${inputType === 'homework' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  }, "\u529F\u8AB2"), React.createElement("button", {
    type: "button",
    onClick: () => setInputType('assessment'),
    className: `flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${inputType === 'assessment' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  }, "\u6E2C\u9A57")), isAdmin && React.createElement("label", {
    className: `w-full sm:w-auto flex items-center justify-between sm:justify-start cursor-pointer gap-4 px-4 py-2.5 rounded-2xl border-2 transition-all ${isBroadcast ? 'bg-orange-50 border-orange-300' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`
  }, React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, React.createElement(Icon, {
    name: "bell",
    className: `w-5 h-5 ${isBroadcast ? 'text-orange-500 animate-pulse' : 'text-slate-400'}`
  }), React.createElement("span", {
    className: `text-sm font-bold ${isBroadcast ? 'text-orange-700' : 'text-slate-500'}`
  }, "\u5168\u6821\u5EE3\u64AD\u767C\u4F48")), React.createElement("div", {
    className: "relative w-12 h-7 shrink-0"
  }, React.createElement("input", {
    type: "checkbox",
    className: "sr-only peer",
    checked: isBroadcast,
    onChange: e => setIsBroadcast(e.target.checked)
  }), React.createElement("div", {
    className: "absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-orange-500 transition-colors shadow-inner"
  }), React.createElement("div", {
    className: "absolute top-[2px] left-[2px] bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-[20px] shadow-sm border border-slate-300 dark:border-slate-600"
  })))), isAdmin && isBroadcast && React.createElement("div", {
    className: "rounded-2xl p-4 bg-orange-50 dark:bg-orange-900/15 border border-orange-100 dark:border-orange-800"
  }, React.createElement("label", {
    className: "block text-xs font-black text-orange-700 dark:text-orange-300 mb-2"
  }, "\u6D3E\u767C\u5C0D\u8C61"), React.createElement(CustomDropdown, {
    value: targetClassInput,
    onChange: setTargetClassInput,
    options: [{
      value: '全校',
      label: '全校'
    }, ...systemClasses.map(cls => ({
      value: cls.code,
      label: `${cls.name} · ${cls.code}`
    }))],
    customClasses: "w-full h-11 px-4 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 flex items-center justify-between text-sm font-black"
  })), React.createElement("div", {
    className: "relative -mx-2 px-2 mt-2"
  }, React.createElement("div", {
    className: "flex gap-2.5 overflow-x-auto scrollbar-hide pb-4 pt-2 snap-x snap-mandatory"
  }, subjects.map(sub => {
    const isSelected = subject === sub.name;
    return React.createElement("button", {
      key: sub.name,
      type: "button",
      onClick: () => handleSubjectSelect(sub.name),
      className: `snap-start shrink-0 px-5 py-2.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center min-w-[80px] border-2 ${isSelected ? `${sub.color} shadow-sm -translate-y-1 border-transparent` : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:-translate-y-0.5'}`
    }, sub.name);
  }))), subjectPredictionApplied && predictedSubject && !isBroadcast && React.createElement("div", {
    className: "flex items-center gap-1.5 px-2 text-[11px] font-bold text-indigo-500 dark:text-indigo-300 -mt-1 mb-1"
  }, React.createElement(Icon, {
    name: "sparkles",
    className: "w-3.5 h-3.5"
  }), "\u7CFB\u7D71\u5DF2\u81EA\u52D5\u6839\u64DA\u6642\u9593\u8868\u70BA\u4F60\u9810\u6E2C\u79D1\u76EE\uFF1A", predictedSubject), React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, [{
    value: 'low',
    label: '稍後',
    icon: 'circle-dot'
  }, {
    value: 'normal',
    label: '一般',
    icon: 'minus'
  }, {
    value: 'high',
    label: '重要',
    icon: 'flame'
  }].map(option => React.createElement("button", {
    key: option.value,
    type: "button",
    onClick: () => setPriority(option.value),
    className: `h-11 rounded-xl border text-sm font-black flex items-center justify-center gap-1.5 transition-all ${priority === option.value ? option.value === 'high' ? 'bg-rose-500 border-rose-500 text-white' : option.value === 'low' ? 'bg-sky-500 border-sky-500 text-white' : 'bg-slate-800 border-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`
  }, React.createElement(Icon, {
    name: option.icon,
    className: "w-4 h-4"
  }), option.label))), React.createElement("div", {
    className: "bg-slate-50/60 dark:bg-slate-950/50 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-700 p-2 sm:p-3 transition-all focus-within:bg-white dark:focus-within:bg-slate-950 focus-within:border-indigo-300"
  }, React.createElement("input", {
    type: "text",
    placeholder: inputType === 'homework' ? "輸入功課細節 (例如: 中文作句 P.4-5)..." : "輸入測驗/大考範圍...",
    value: description,
    onChange: e => setDescription(e.target.value),
    className: "w-full bg-transparent px-4 py-3 sm:py-4 text-lg sm:text-xl font-bold text-slate-800 dark:text-white outline-none placeholder:text-slate-400 placeholder:font-medium",
    autoComplete: "off"
  }), React.createElement("div", {
    className: "flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 mt-2 pt-3 border-t border-slate-200/60 px-2 pb-1"
  }, React.createElement("div", {
    className: "flex items-center gap-2.5 overflow-x-auto scrollbar-hide py-1 flex-1"
  }, React.createElement("div", {
    className: "relative group cursor-pointer shrink-0"
  }, React.createElement("button", {
    type: "button",
    onClick: () => setIsDueDatePickerOpen(true),
    className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${dueDate ? t.bg + ' text-white shadow-sm border-transparent' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400'}`
  }, React.createElement(Icon, {
    name: "calendar-clock",
    className: "w-4 h-4"
  }), React.createElement("span", null, dueDate ? formatDueDate(dueDate) : '選擇交期'))), React.createElement("button", {
    type: "button",
    onClick: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      setDueDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    },
    className: "shrink-0 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
  }, React.createElement(Icon, {
    name: "check-circle-2",
    className: "w-4 h-4 text-orange-500"
  }), "\u807D\u65E5")), React.createElement("button", {
    type: "submit",
    "aria-label": "\u5132\u5B58\u529F\u8AB2",
    disabled: isSavingTask || !description.trim() || !dueDate,
    className: `shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center transition-all ${!description.trim() || !dueDate ? 'bg-slate-300 opacity-60 cursor-not-allowed scale-95' : `${t.bg} hover:scale-110 active:scale-90 shadow-lg`}`
  }, React.createElement(Icon, {
    name: "check-circle",
    className: "w-5 h-5 sm:w-6 sm:h-6"
  })))))), document.body), isVisible('list') && React.createElement(React.Fragment, null, viewMode === 'history' && React.createElement("div", {
    className: "relative overflow-hidden mb-5 rounded-[2rem] p-5 sm:p-6 bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-700 text-white shadow-[0_28px_70px_-36px_rgba(6,78,59,.9)]"
  }, React.createElement("div", {
    className: "absolute -right-16 -top-20 w-56 h-56 rounded-full bg-emerald-300/20 blur-3xl"
  }), React.createElement("div", {
    className: "relative flex items-center justify-between gap-5"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black tracking-[.18em] text-emerald-200"
  }, "COMPLETED"), React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-black mt-2"
  }, "\u5DF2\u5B8C\u6210 ", completedVisibleCount, " \u9805\u529F\u8AB2"), React.createElement("p", {
    className: "text-sm font-bold text-emerald-100/80 mt-2"
  }, "\u6700\u65B0\u5B8C\u6210\u6392\u6700\u524D\uFF1B\u6309\u7DA0\u8272\u5254\u865F\u5373\u53EF\u653E\u56DE\u5F85\u8FA6\u3002")), React.createElement("div", {
    className: "w-16 h-16 rounded-2xl bg-white/10 border border-white/15 grid place-items-center shrink-0"
  }, React.createElement(Icon, {
    name: "archive-restore",
    className: "w-8 h-8 text-emerald-200"
  })))), React.createElement("div", {
    className: "mb-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700 p-1.5 shadow-sm flex items-center gap-1.5"
  }, React.createElement("button", {
    type: "button",
    onClick: () => {
      setViewMode('current');
      setAppMode('personal');
      setSearchQuery('');
      setSortOption('date_asc');
    },
    className: `flex-1 min-w-0 h-11 px-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${viewMode !== 'history' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`
  }, React.createElement(Icon, {
    name: "list-todo",
    className: "w-4 h-4"
  }), "\u5F85\u8FA6\u9805\u76EE ", React.createElement("span", {
    className: `min-w-6 h-6 px-1.5 rounded-lg grid place-items-center text-xs ${viewMode !== 'history' ? 'bg-white/15 dark:bg-slate-900/10' : 'bg-slate-100 dark:bg-slate-800'}`
  }, activeItems.length)), React.createElement("button", {
    type: "button",
    onClick: () => {
      setViewMode('history');
      setAppMode('personal');
      setSearchQuery('');
      setSortOption('date_desc');
    },
    className: `flex-1 min-w-0 h-11 px-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${viewMode === 'history' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200/50 dark:shadow-none' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`
  }, React.createElement(Icon, {
    name: "archive-restore",
    className: "w-4 h-4"
  }), "\u5B8C\u6210\u7D00\u9304 ", React.createElement("span", {
    className: `min-w-6 h-6 px-1.5 rounded-lg grid place-items-center text-xs ${viewMode === 'history' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`
  }, completedVisibleCount))), viewMode === 'history' && React.createElement("div", {
    className: "mb-4 px-3 py-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "info",
    className: "w-4 h-4 shrink-0"
  }), "\u6309\u5DE6\u908A\u7DA0\u8272\u5254\u865F\uFF0C\u53EF\u5C07\u529F\u8AB2\u653E\u56DE\u5F85\u8FA6\u6E05\u55AE\u3002"), React.createElement("div", {
    className: "task-toolbar flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 relative"
  }, React.createElement("div", {
    className: `flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide pb-1 transition-opacity ${!isListVisible ? 'opacity-50' : 'opacity-100'}`
  }, React.createElement("span", {
    className: "text-slate-400 text-xs font-bold whitespace-nowrap"
  }, "\u7BE9\u9078:"), React.createElement("button", {
    onClick: () => handleFilterChange('全部'),
    className: `flex-shrink-0 px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${filterSubject === '全部' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`
  }, "\u5168\u90E8"), subjects.map(sub => React.createElement("button", {
    key: sub.name,
    onClick: () => handleFilterChange(sub.name),
    className: `flex-shrink-0 px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${filterSubject === sub.name ? `${t.border} ${t.lightBg} ${t.text}` : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`
  }, sub.name))), React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 w-full sm:w-auto z-30"
  }, React.createElement("div", {
    className: "relative w-full sm:w-auto flex-1 max-w-[150px] sm:max-w-[200px]"
  }, React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400"
  }, React.createElement(Icon, {
    name: "search",
    className: "w-3.5 h-3.5"
  })), React.createElement("input", {
    type: "text",
    placeholder: "\u641C\u5C0B...",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    className: "w-full pl-8 pr-3 py-1.5 glass-card bg-white/70 dark:bg-slate-800/70 border border-white/50 dark:border-slate-700 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-400 outline-none transition-all dark:text-white placeholder:text-slate-400"
  })), viewMode !== 'history' ? React.createElement("button", {
    onClick: handleClearExpired,
    className: "flex-shrink-0 text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 flex items-center gap-1"
  }, React.createElement(Icon, {
    name: "trash-2",
    className: "w-3 h-3"
  }), " \u6E05\u7406\u904E\u671F") : React.createElement("button", {
    onClick: handleClearHistory,
    className: "flex-shrink-0 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
  }, React.createElement(Icon, {
    name: "trash-2",
    className: "w-3 h-3"
  }), " \u6E05\u7406\u5B8C\u6210\u7D00\u9304"), React.createElement("span", {
    className: "text-slate-400 text-xs font-bold whitespace-nowrap ml-1"
  }, "\u6392\u5E8F:"), React.createElement(CustomDropdown, {
    value: sortOption,
    onChange: handleSortChange,
    options: viewMode === 'history' ? [{
      value: 'date_desc',
      label: '最近完成'
    }, {
      value: 'date_asc',
      label: '較早完成'
    }] : [{
      value: 'date_asc',
      label: '趕急先'
    }, {
      value: 'date_desc',
      label: '長遠先'
    }]
  }))), React.createElement("div", {
    className: `space-y-4 pb-10 transition-opacity duration-300 ${!isListVisible ? 'opacity-0' : 'opacity-100'}`
  }, displayedItems.length === 0 ? React.createElement("div", {
    className: "text-center py-20"
  }, React.createElement("div", {
    className: `inline-flex p-6 rounded-full ${t.lightBg} mb-4`
  }, React.createElement(Icon, {
    name: "check-circle-2",
    className: `w-12 h-12 ${t.text}`
  })), React.createElement("h3", {
    className: "text-xl font-bold text-slate-700 dark:text-slate-300"
  }, viewMode === 'history' ? '沒有已完成的紀錄' : searchQuery ? '搵唔到相關功課' : '太好了！任務清單空空如也')) : displayedItems.map((item, index) => {
    var _subjects$find6;
    const isExiting = exitingIds.includes(item.id);
    const isCompleted = item.completed || isExiting;
    const dl = getDaysRemaining(item.dueDate);
    let statusColor = "text-emerald-500 bg-emerald-50";
    let statusText = `${dl} 天後`;
    if (dl < 0) {
      statusColor = "text-red-500 bg-red-50";
      statusText = `已過期`;
    }
    if (dl === 0) {
      statusColor = "text-orange-500 bg-orange-50 animate-pulse";
      statusText = "今日到期";
    }
    if (isCompleted) {
      statusColor = "text-slate-400 bg-slate-100";
      statusText = "已完成";
    }
    if (item.withdrawn) {
      statusColor = "text-slate-500 bg-slate-100";
      statusText = "已撤回";
    }
    const subjectStyle = ((_subjects$find6 = subjects.find(s => s.name === item.subject)) === null || _subjects$find6 === void 0 ? void 0 : _subjects$find6.color) || 'bg-slate-100 text-slate-600 border-slate-200';
    const priorityMeta = getPriorityMeta(item.priority);
    return React.createElement("div", {
      key: item.id,
      style: {
        animationDelay: `${index * 0.05}s`
      },
      className: `task-card animate-item glass-card bg-white/95 dark:bg-slate-800/90 rounded-3xl p-5 transition-all hover:-translate-y-0.5 group ${item.priority === 'high' ? 'priority-high' : item.priority === 'low' ? 'priority-low' : ''} ${isExiting ? 'scale-95 opacity-0' : ''}`
    }, React.createElement("div", {
      className: "flex items-start gap-4"
    }, React.createElement("button", {
      "aria-label": item.completed ? "還原至待辦" : "標記完成",
      disabled: !!item.withdrawn || exitingIds.includes(item.id),
      onClick: () => handleToggle(item.id, item.completed),
      className: `mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-400 dark:hover:border-emerald-500'}`
    }, React.createElement(Icon, {
      name: "check",
      className: `w-4 h-4 transition-transform duration-200 ${isCompleted ? 'scale-100' : 'scale-0'}`
    })), React.createElement("div", {
      className: "flex-1 min-w-0"
    }, React.createElement("div", {
      className: "flex justify-between items-start mb-1.5"
    }, React.createElement("div", {
      className: "flex gap-2 items-center flex-wrap"
    }, React.createElement("span", {
      className: `text-xs font-bold px-2 py-0.5 rounded-lg border ${subjectStyle}`
    }, item.subject || '其他'), React.createElement("span", {
      className: `text-xs font-bold px-2 py-0.5 rounded-lg border ${priorityMeta.classes}`
    }, React.createElement(Icon, {
      name: priorityMeta.icon,
      className: "w-3 h-3 mr-1"
    }), priorityMeta.label), item.publicRefId && React.createElement("span", {
      className: `text-xs font-bold px-2 py-0.5 rounded-lg ${t.lightBg} ${t.text}`
    }, "\u73ED\u7D1A")), React.createElement("div", {
      className: `text-xs font-bold flex items-center px-2 py-0.5 rounded-lg gap-1 ${statusColor}`
    }, statusText)), React.createElement("div", {
      className: `text-base sm:text-lg font-bold mb-2 break-words ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`
    }, item.description), item.collabRefId && React.createElement("div", {
      className: "co-source"
    }, React.createElement("strong", null, item.sourceGroupName, " \xB7 ", item.senderName), item.changedAfterCompletion && React.createElement("div", {
      className: "text-amber-600 font-bold mt-1"
    }, "\u5B8C\u6210\u5F8C\u6709\u66F4\u65B0\uFF0C\u8ACB\u518D\u6838\u5C0D\u5167\u5BB9\u6216\u4EA4\u671F"), item.privateNote && React.createElement("div", {
      className: "whitespace-pre-wrap mt-1"
    }, "\u6211\u7684\u7B46\u8A18\uFF1A", item.privateNote)), React.createElement("div", {
      className: "flex items-center justify-between mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50"
    }, React.createElement("div", {
      className: "text-xs text-slate-400 flex items-center gap-1 font-medium"
    }, formatDueDate(item.dueDate)), React.createElement("div", {
      className: "flex gap-2 opacity-100 sm:opacity-40 group-hover:opacity-100 transition-opacity duration-300"
    }, !item.forceExpired && React.createElement("button", {
      "aria-label": item.collabRefId ? "查看及編輯個人筆記" : "編輯功課",
      onClick: () => setEditingItem(item),
      className: "p-1.5 text-slate-500 hover:text-blue-500 transition hover:bg-blue-50 rounded-lg"
    }, React.createElement(Icon, {
      name: "book-open",
      className: "w-4 h-4"
    })), isAdmin && item.publicRefId ? React.createElement(React.Fragment, null, React.createElement("button", {
      "aria-label": "\u79FB\u9664\u500B\u4EBA\u7D00\u9304",
      onClick: () => deleteItem(item.id),
      className: "p-1.5 text-slate-500 hover:text-red-500 transition hover:bg-red-50 rounded-lg"
    }, React.createElement(Icon, {
      name: "trash-2",
      className: "w-4 h-4"
    })), React.createElement("button", {
      onClick: () => deletePublicItem(item.publicRefId, item.id),
      className: "p-1.5 text-slate-500 hover:text-indigo-600 transition hover:bg-indigo-50 rounded-lg"
    }, React.createElement(Icon, {
      name: "bell",
      className: "w-4 h-4"
    }))) : React.createElement("button", {
      "aria-label": "\u79FB\u9664\u500B\u4EBA\u7D00\u9304",
      onClick: () => deleteItem(item.id),
      className: "p-1.5 text-slate-500 hover:text-red-500 transition hover:bg-red-50 rounded-lg"
    }, React.createElement(Icon, {
      name: "trash-2",
      className: "w-4 h-4"
    })))))));
  })))), viewMode === 'current' && appMode === 'class' && React.createElement("div", {
    className: "space-y-6 animate-fadeIn pb-10"
  }, React.createElement("div", {
    className: "relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-800 text-white rounded-[2rem] p-5 sm:p-6 shadow-[0_30px_80px_-38px_rgba(15,23,42,.9)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5"
  }, React.createElement("div", {
    className: "absolute -right-16 -top-20 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl"
  }), React.createElement("div", null, React.createElement("div", {
    className: "text-xs font-black tracking-[.18em] text-indigo-300 mb-2"
  }, "CLASS BOARD"), React.createElement("h3", {
    className: "text-2xl sm:text-3xl font-black flex items-center gap-2"
  }, React.createElement(Icon, {
    name: "school",
    className: "text-indigo-200"
  }), " \u73ED\u7D1A\u5EE3\u64AD"), React.createElement("p", {
    className: "text-sm font-bold text-indigo-100/80 mt-2"
  }, "\u5168\u6821\u53CA\u5DF2\u52A0\u5165\u73ED\u7D1A\u7684\u529F\u8AB2\u6703\u81EA\u52D5\u52A0\u5165\u500B\u4EBA\u624B\u518A\u3002")), React.createElement("div", {
    className: "relative flex flex-col sm:flex-row gap-2 w-full lg:w-auto"
  }, React.createElement("div", {
    className: "px-4 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 bg-emerald-400/15 border border-emerald-300/20 text-emerald-200"
  }, React.createElement(Icon, {
    name: "check-circle-2",
    className: "w-4 h-4"
  }), " \u81EA\u52D5\u6536\u53D6"), React.createElement("button", {
    onClick: () => setIsJoinClassOpen(true),
    className: "px-4 py-3 rounded-2xl font-black text-sm bg-white text-indigo-700 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
  }, React.createElement(Icon, {
    name: "plus",
    className: "w-4 h-4"
  }), " \u52A0\u5165\u73ED\u7D1A"))), joinedClasses.length === 0 && React.createElement("div", {
    className: "rounded-3xl border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-900/20 p-4 flex items-start gap-3"
  }, React.createElement(Icon, {
    name: "info",
    className: "w-5 h-5 text-indigo-500 mt-0.5 shrink-0"
  }), React.createElement("div", null, React.createElement("div", {
    className: "font-bold text-sm text-indigo-700 dark:text-indigo-300"
  }, "\u4F60\u4ECD\u7136\u53EF\u4EE5\u67E5\u770B\u300C\u5168\u6821\u300D\u5EE3\u64AD"), React.createElement("p", {
    className: "text-xs text-indigo-500/80 dark:text-indigo-300/80 mt-1"
  }, "\u5982\u8981\u63A5\u6536\u73ED\u7D1A\u5C08\u5C6C\u529F\u8AB2\uFF0C\u8ACB\u5411\u8001\u5E2B\u7D22\u53D6 6 \u4F4D\u73ED\u7D1A\u4EE3\u78BC\u3002"))), React.createElement("div", {
    className: "flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
  }, classBoardOptions.map(code => {
    const cls = systemClasses.find(c => c.code === code);
    const name = code === '全校' ? '全校' : cls ? cls.name : code;
    const taskCount = visiblePublicTasks.filter(task => (task.targetClass || '全校') === code).length;
    return React.createElement("div", {
      key: code,
      className: `shrink-0 rounded-xl border-2 transition-all flex items-center overflow-hidden ${selectedClassBoard === code ? `${t.border} ${t.lightBg} ${t.text}` : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700'}`
    }, React.createElement("button", {
      type: "button",
      onClick: () => setSelectedClassBoard(code),
      className: "px-4 py-2.5 text-sm font-bold flex items-center gap-2"
    }, name, React.createElement("span", {
      className: "text-xs px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-400"
    }, taskCount)), code !== '全校' && React.createElement("button", {
      type: "button",
      onClick: () => handleLeaveClass(code, name),
      "aria-label": `離開${name}`,
      className: "w-10 self-stretch border-l border-current/10 grid place-items-center opacity-[.55] hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20"
    }, React.createElement(Icon, {
      name: "log-out",
      className: "w-4 h-4"
    })));
  })), React.createElement("div", {
    className: "space-y-4"
  }, selectedClassTasks.length === 0 ? React.createElement("div", {
    className: "text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700"
  }, React.createElement(Icon, {
    name: "inbox",
    className: "w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3"
  }), React.createElement("p", {
    className: "text-slate-500 font-medium"
  }, "\u76EE\u524D\u6C92\u6709\u5EE3\u64AD\u4EFB\u52D9 \uD83C\uDF89")) : selectedClassTasks.map((task, idx) => {
    var _subjects$find7;
    const subjectStyle = ((_subjects$find7 = subjects.find(s => s.name === task.subject)) === null || _subjects$find7 === void 0 ? void 0 : _subjects$find7.color) || 'bg-slate-100 text-slate-600 border-slate-200';
    const isDelivered = syncedPublicIds.has(task.id);
    const isDelivering = syncingPublicIds[task.id];
    const targetCode = task.targetClass || '全校';
    const targetClass = systemClasses.find(c => c.code === targetCode);
    const targetName = targetCode === '全校' ? '全校' : (targetClass === null || targetClass === void 0 ? void 0 : targetClass.name) || targetCode;
    const priorityMeta = getPriorityMeta(task.priority);
    return React.createElement("div", {
      key: task.id,
      style: {
        animationDelay: `${idx * 0.05}s`
      },
      className: "animate-item glass-card bg-white/80 dark:bg-slate-800/80 p-5 rounded-2xl shadow-sm border border-white/50 dark:border-slate-700 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
    }, task.forceExpired && React.createElement("div", {
      className: "absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none"
    }, React.createElement("span", {
      className: "bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg rotate-[-6deg]"
    }, "\u5DF2\u64A4\u56DE / \u5DF2\u5931\u6548")), React.createElement("div", {
      className: "relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
    }, React.createElement("div", {
      className: "min-w-0 flex-1"
    }, React.createElement("div", {
      className: "flex justify-between items-start mb-3"
    }, React.createElement("div", {
      className: "flex gap-2 items-center flex-wrap"
    }, React.createElement("span", {
      className: `text-[10px] font-bold px-2.5 py-1 rounded border ${subjectStyle}`
    }, task.subject || '其他'), React.createElement("span", {
      className: "text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2.5 py-1 rounded font-bold"
    }, targetName), React.createElement("span", {
      className: `text-xs px-2.5 py-1 rounded font-bold border ${priorityMeta.classes}`
    }, React.createElement(Icon, {
      name: priorityMeta.icon,
      className: "w-3 h-3 mr-1"
    }), priorityMeta.label), !task.forceExpired && React.createElement("span", {
      className: `text-[10px] px-2.5 py-1 rounded font-bold ${isDelivered ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300' : isDelivering ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300' : 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300'}`
    }, isDelivered ? '已加入個人清單' : isDelivering ? '自動加入中' : '登入後自動加入'))), React.createElement("p", {
      className: "font-bold text-lg text-slate-800 dark:text-white mb-3 break-words"
    }, task.description), React.createElement("div", {
      className: "text-xs text-slate-400 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-t border-slate-50 dark:border-slate-700 pt-3"
    }, React.createElement("span", {
      className: "flex items-center gap-1"
    }, React.createElement(Icon, {
      name: "user-round",
      className: "w-3.5 h-3.5"
    }), " \u767C\u4F48\u4EBA: ", task.senderName || '老師'), React.createElement("span", {
      className: "flex items-center gap-1"
    }, React.createElement(Icon, {
      name: "calendar-clock",
      className: "w-3.5 h-3.5"
    }), " \u4EA4\u671F: ", formatDueDate(task.dueDate)), React.createElement("span", null, formatFirebaseDateTime(task.createdAt))))));
  })))))), viewMode === 'current' && appMode === 'personal' && React.createElement("button", {
    type: "button",
    onClick: () => setIsComposerOpen(true),
    "aria-label": "\u65B0\u589E\u529F\u8AB2\u6216\u6E2C\u9A57",
    className: `quick-add-fab fab-motion bg-gradient-to-br ${t.gradient} active:scale-90 transition-transform`
  }, React.createElement(Icon, {
    name: "plus",
    className: "w-7 h-7"
  })), React.createElement("div", {
    className: "bottom-nav fixed bottom-6 left-1/2 -translate-x-1/2 glass-card bg-white/95 dark:bg-slate-800/95 rounded-full p-2 shadow-lg border border-white/50 dark:border-slate-700/50 z-[100] flex items-center justify-between gap-1 sm:gap-2 max-w-[95%] overflow-x-auto dynamic-island-scroll"
  }, React.createElement(NavItem, {
    icon: "book-open",
    label: "\u4E3B\u9801",
    active: viewMode === 'current' && appMode === 'personal',
    onClick: () => {
      setIsComposerOpen(false);
      setViewMode('current');
      setAppMode('personal');
      setIsListVisible(true);
    },
    t: t
  }), React.createElement(NavItem, {
    icon: "calendar-days",
    label: "\u6708\u66C6",
    active: viewMode === 'calendar',
    onClick: () => {
      setIsComposerOpen(false);
      setViewMode('calendar');
      setAppMode('personal');
    },
    t: t
  }), React.createElement(NavItem, {
    icon: "users",
    label: "\u7FA4\u7D44",
    active: viewMode === 'collaboration' || appMode === 'class',
    onClick: () => {
      setIsComposerOpen(false);
      setViewMode('collaboration');
      setCollabTab('groups');
      setAppMode('personal');
    },
    t: t
  }), React.createElement(NavItem, {
    icon: "calendar-clock",
    label: "\u6642\u9593\u8868",
    active: viewMode === 'timetable' || viewMode === 'timetable_edit',
    onClick: () => {
      setIsComposerOpen(false);
      setViewMode('timetable');
      setIsListVisible(true);
    },
    t: t
  }), React.createElement(NavItem, {
    icon: "sliders-horizontal",
    label: "\u8A2D\u5B9A",
    active: viewMode === 'settings',
    onClick: () => {
      setIsComposerOpen(false);
      setViewMode('settings');
      setAppMode('personal');
      setIsListVisible(true);
    },
    t: t
  }), isAdmin && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"
  }), React.createElement(NavItem, {
    icon: "shield",
    label: "\u5F8C\u53F0",
    active: viewMode === 'admin',
    onClick: () => setViewMode('admin'),
    t: t
  }))), editingItem !== null && editingItem !== void 0 && editingItem.collabRefId ? React.createElement(CollaborationPersonalNote, {
    item: editingItem,
    onClose: () => setEditingItem(null),
    onSave: handleUpdateItem,
    notify: triggerAlert
  }) : editingItem && React.createElement(EditModal, {
    item: editingItem,
    onClose: () => setEditingItem(null),
    onSave: handleUpdateItem,
    triggerAlert: triggerAlert,
    triggerConfirm: triggerConfirm,
    subjects: subjects
  }), React.createElement(DatePickerModal, {
    isOpen: isDueDatePickerOpen,
    value: dueDate,
    onSelect: setDueDate,
    onClose: () => setIsDueDatePickerOpen(false),
    title: "\u9078\u64C7\u529F\u8AB2\u4EA4\u671F"
  }), quickView.isOpen && React.createElement(QuickViewModal, {
    isOpen: quickView.isOpen,
    onClose: () => setQuickView({
      isOpen: false,
      title: '',
      items: []
    }),
    title: quickView.title,
    items: quickView.items,
    subjects: subjects,
    onEdit: setEditingItem,
    onDelete: deleteItem,
    isAdmin: isAdmin,
    userUid: user === null || user === void 0 ? void 0 : user.uid
  }), showUpdateIntro && (activeUpdateNotice === null || activeUpdateNotice === void 0 ? void 0 : activeUpdateNotice.version) && React.createElement("div", {
    className: "fixed inset-0 z-[270] flex items-center justify-center p-4 sm:p-6"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-950/60 backdrop-blur-md"
  }), React.createElement("div", {
    className: "relative w-full max-w-[500px] max-h-[86vh] overflow-hidden rounded-[2rem] glass-card bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700 shadow-2xl flex flex-col animate-pop-in"
  }, React.createElement("div", {
    className: "relative overflow-hidden p-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 text-white"
  }, React.createElement("div", {
    className: "absolute -top-12 -right-10 w-36 h-36 rounded-full bg-white/20 blur-2xl"
  }), React.createElement("div", {
    className: "relative z-10"
  }, React.createElement("div", {
    className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-black mb-4"
  }, React.createElement(Icon, {
    name: "sparkles",
    className: "w-4 h-4"
  }), " \u7248\u672C ", activeUpdateNotice.version), React.createElement("h3", {
    className: "text-2xl font-black tracking-tight"
  }, activeUpdateNotice.title || '電子手冊 Pro 已更新'), React.createElement("p", {
    className: "text-sm text-indigo-100 font-bold mt-2"
  }, "\u4EE5\u4E0B\u4FC2\u4ECA\u6B21\u66F4\u65B0\u5167\u5BB9\u540C\u4F7F\u7528\u65B9\u6CD5\u3002"))), React.createElement("div", {
    className: "overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-hide"
  }, activeUpdateNotice.summary && React.createElement("div", {
    className: "rounded-3xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 p-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2 font-black text-slate-800 dark:text-white mb-3"
  }, React.createElement(Icon, {
    name: "list-checks",
    className: "w-5 h-5 text-indigo-500"
  }), " \u66F4\u65B0\u5497\u5572\u4E5C"), React.createElement("div", {
    className: "space-y-2"
  }, String(activeUpdateNotice.summary).split('\n').map((line, idx) => line.trim() && React.createElement("div", {
    key: idx,
    className: "flex items-start gap-2 text-sm font-bold text-slate-600 dark:text-slate-300"
  }, React.createElement("span", {
    className: "mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"
  }), React.createElement("span", null, line.trim().replace(/^[-•\d.、)）\s]+/, '')))))), activeUpdateNotice.guide && React.createElement("div", {
    className: "rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4"
  }, React.createElement("div", {
    className: "flex items-center gap-2 font-black text-emerald-700 dark:text-emerald-300 mb-3"
  }, React.createElement(Icon, {
    name: "mouse-pointer-click",
    className: "w-5 h-5"
  }), " \u9EDE\u6A23\u4F7F\u7528"), React.createElement("div", {
    className: "space-y-2"
  }, String(activeUpdateNotice.guide).split('\n').map((line, idx) => line.trim() && React.createElement("div", {
    key: idx,
    className: "flex items-start gap-2 text-sm font-bold text-emerald-800/80 dark:text-emerald-100/90"
  }, React.createElement("span", {
    className: "w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5"
  }, idx + 1), React.createElement("span", null, line.trim().replace(/^[-•\d.、)）\s]+/, ''))))))), React.createElement("div", {
    className: "p-5 border-t border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl"
  }, React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, React.createElement("button", {
    onClick: closeUpdateIntroForNow,
    className: "py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 font-black active:scale-[0.98] transition-all"
  }, "\u4ECA\u6B21\u95DC\u9589\uFF0C\u4E0B\u6B21\u518D\u63D0\u793A"), React.createElement("button", {
    onClick: hideUpdateIntroForThisRelease,
    className: "py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg active:scale-[0.98] transition-all"
  }, "\u4E0D\u518D\u986F\u793A\u4ECA\u6B21\u66F4\u65B0")), React.createElement("p", {
    className: "text-center text-[11px] text-slate-400 font-bold mt-3"
  }, "\u540C\u4E00\u7248\u672C\u53EA\u6703\u81EA\u52D5\u986F\u793A\u4E00\u6B21\uFF0C\u53EF\u5728\u901A\u77E5\u4E2D\u5FC3\u518D\u6B21\u67E5\u770B\u3002")))), isNotificationCenterOpen && React.createElement("div", {
    className: "fixed inset-0 z-[260] flex items-end sm:items-center justify-center p-0 sm:p-6"
  }, React.createElement("div", {
    className: "motion-scrim absolute inset-0 bg-slate-950/[0.45] backdrop-blur-sm",
    onClick: () => setIsNotificationCenterOpen(false)
  }), React.createElement("div", {
    className: "notification-center-panel relative w-full max-w-[480px] max-h-[86vh] overflow-hidden rounded-[2rem] glass-card bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700 shadow-2xl flex flex-col animate-pop-in"
  }, React.createElement("div", {
    className: "px-5 pt-5 pb-4 shrink-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 text-white"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "flex items-center gap-2 font-black text-lg"
  }, React.createElement("span", {
    className: "w-10 h-10 rounded-2xl bg-white/10 border border-white/15 grid place-items-center"
  }, React.createElement(Icon, {
    name: "bell-ring",
    className: "w-5 h-5 text-amber-300"
  })), " \u901A\u77E5\u4E2D\u5FC3"), React.createElement("div", {
    className: "text-xs font-bold text-indigo-200 mt-1"
  }, "\u529F\u8AB2\u3001\u6642\u9593\u8868\u8207\u7CFB\u7D71\u63D0\u9192")), React.createElement("div", {
    className: "flex items-center gap-2 shrink-0"
  }, unreadNotificationCount > 0 && React.createElement("button", {
    type: "button",
    onClick: () => markNotificationsRead(userNotifications.map(n => n.id)),
    className: "px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-black border border-white/15 hover:bg-white/20"
  }, "\u5168\u90E8\u5DF2\u8B80"), React.createElement("button", {
    type: "button",
    onClick: () => setIsNotificationCenterOpen(false),
    className: "w-10 h-10 grid place-items-center rounded-xl bg-white/10 text-white border border-white/15 hover:bg-white/20 transition-colors"
  }, React.createElement(Icon, {
    name: "x",
    className: "w-4 h-4"
  })))), React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mt-4 p-1 rounded-2xl bg-white/10 border border-white/10"
  }, React.createElement("button", {
    type: "button",
    onClick: () => setNotificationFilter('all'),
    className: `h-10 rounded-xl text-xs font-black transition-all ${notificationFilter === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100'}`
  }, "\u5168\u90E8 \xB7 ", userNotifications.length), React.createElement("button", {
    type: "button",
    onClick: () => setNotificationFilter('unread'),
    className: `h-10 rounded-xl text-xs font-black transition-all ${notificationFilter === 'unread' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100'}`
  }, "\u672A\u8B80 \xB7 ", unreadNotificationCount))), React.createElement("button", {
    type: "button",
    onClick: () => {
      setIsNotificationCenterOpen(false);
      setViewMode('collaboration');
      setCollabTab('inbox');
    },
    className: "co-history-link mx-4 mt-4"
  }, React.createElement("span", null, "\u7FA4\u7D44\u9080\u8ACB\u8207\u767C\u653E\u6536\u4EF6\u5323"), React.createElement("span", null, collab.unread ? `${collab.unread} 則未讀` : '查看', " \u2192")), React.createElement("div", {
    key: notificationFilter,
    className: "overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[70vh] scrollbar-hide"
  }, filteredUserNotifications.length === 0 ? React.createElement("div", {
    className: "h-[220px] flex flex-col items-center justify-center text-center text-slate-400"
  }, React.createElement("div", {
    className: "w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3"
  }, React.createElement(Icon, {
    name: "bell-off",
    className: "w-7 h-7"
  })), React.createElement("div", {
    className: "font-black text-sm"
  }, notificationFilter === 'unread' ? '沒有未讀通知' : '暫時未有通知'), React.createElement("div", {
    className: "text-xs mt-1"
  }, notificationFilter === 'unread' ? '新提醒會集中顯示在這裡' : '有新公告或廣播功課時會出現在這裡')) : filteredUserNotifications.map((note, noteIndex) => {
    const accentMap = {
      amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-300',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800 text-orange-600 dark:text-orange-300',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300',
      rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-300',
      sky: 'bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800 text-sky-600 dark:text-sky-300',
      slate: 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300'
    };
    const accentClass = accentMap[note.accent] || accentMap.slate;
    return React.createElement("button", {
      key: note.id,
      type: "button",
      style: {
        animationDelay: `${Math.min(noteIndex, 8) * 0.055}s`
      },
      onClick: () => handleOpenUserNotification(note),
      className: `notification-entry w-full text-left rounded-3xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${note.unread ? accentClass : 'bg-white/70 dark:bg-slate-800/70 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300'}`
    }, React.createElement("div", {
      className: "flex items-start gap-3"
    }, React.createElement("div", {
      className: `w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${note.unread ? 'bg-white/80 dark:bg-slate-950/40' : 'bg-slate-100 dark:bg-slate-900/60'}`
    }, React.createElement(Icon, {
      name: note.icon,
      className: "w-5 h-5"
    })), React.createElement("div", {
      className: "min-w-0 flex-1"
    }, React.createElement("div", {
      className: "flex items-center justify-between gap-2"
    }, React.createElement("div", {
      className: "font-black text-sm text-slate-800 dark:text-white truncate"
    }, note.title), note.unread && React.createElement("span", {
      className: "w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 shadow-sm"
    })), React.createElement("div", {
      className: "text-xs font-bold mt-1 line-clamp-2 break-words"
    }, note.message), React.createElement("div", {
      className: "mt-2 flex items-center justify-between gap-2 text-[10px] font-black opacity-70"
    }, React.createElement("span", {
      className: "truncate"
    }, note.meta || note.time || '剛剛'), note.action === 'class' && React.createElement("span", {
      className: "shrink-0 flex items-center gap-1"
    }, "\u67E5\u770B\u529F\u8AB2 ", React.createElement(Icon, {
      name: "arrow-right",
      className: "w-3 h-3"
    })), note.action === 'timetable' && React.createElement("span", {
      className: "shrink-0 flex items-center gap-1"
    }, "\u67E5\u770B\u6642\u9593\u8868 ", React.createElement(Icon, {
      name: "arrow-right",
      className: "w-3 h-3"
    })), note.action === 'cleanup' && React.createElement("span", {
      className: "shrink-0 flex items-center gap-1"
    }, "\u8FD4\u56DE\u4E3B\u9801 ", React.createElement(Icon, {
      name: "arrow-right",
      className: "w-3 h-3"
    })), note.action === 'release' && React.createElement("span", {
      className: "shrink-0 flex items-center gap-1"
    }, "\u67E5\u770B\u66F4\u65B0 ", React.createElement(Icon, {
      name: "arrow-right",
      className: "w-3 h-3"
    }))))));
  })))), React.createElement(SubjectManagerModal, {
    isOpen: isSubjectManagerOpen,
    onClose: () => setIsSubjectManagerOpen(false),
    currentSubjects: subjects,
    onSave: saveSubjects,
    triggerConfirm: triggerConfirm,
    triggerAlert: triggerAlert,
    usageCounts: subjectUsageCounts
  }), notification.isOpen && React.createElement("div", {
    className: "fixed inset-0 z-[1500] flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity",
    onClick: closeNotification
  }), React.createElement("div", {
    className: "dialog-animate glass-card bg-white/95 dark:bg-slate-800/95 rounded-3xl shadow-2xl w-full max-w-sm p-6 relative z-10 text-center border border-white/50"
  }, React.createElement("div", {
    className: "w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4"
  }, React.createElement(Icon, {
    name: "alert-circle",
    className: "w-8 h-8"
  })), React.createElement("h3", {
    className: "text-xl font-bold text-slate-800 dark:text-white mb-2"
  }, "\u8ACB\u78BA\u8A8D"), React.createElement("p", {
    className: "text-slate-500 dark:text-slate-400 mb-6 text-sm"
  }, notification.message), React.createElement("div", {
    className: "flex gap-3"
  }, React.createElement("button", {
    onClick: closeNotification,
    className: "flex-1 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
  }, "\u53D6\u6D88"), React.createElement("button", {
    onClick: handleNotificationConfirm,
    className: "flex-1 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg active:scale-95"
  }, "\u78BA\u5B9A")))));
}
try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App, null));
} catch (e) {
  console.error('Root render failed:', e);
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.innerHTML = "<div style='max-width:420px;padding:22px;text-align:center'><div style='font-size:42px;margin-bottom:10px'>⚠️</div><h2 style='font-size:1.2rem;font-weight:800;margin-bottom:8px;color:#ef4444'>主畫面啟動失敗</h2><p style='font-size:13px;color:#64748b;line-height:1.6'>請先使用上一個穩定版，或截圖 Console 錯誤。</p></div>";
  }
}
})();