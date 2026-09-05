const _excluded = ["children", "primary", "danger", "ghost"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  'use strict';

  const _React = React,
    useState = _React.useState,
    useEffect = _React.useEffect,
    useRef = _React.useRef,
    useMemo = _React.useMemo;
  const C = window.StudyCore;
  const rid = () => crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), x => x.toString(16).padStart(2, '0')).join('');
  const errorText = e => ({
    'functions/not-found': '協作服務未啟用，請由總管理員完成 3.1.0 更新。',
    'functions/unavailable': '暫時無法連接協作服務，請檢查網絡後重試。',
    'functions/unauthenticated': '登入已過期，請重新登入。',
    'permission-denied': '無法讀取協作資料，請由總管理員檢查更新狀態。',
    'functions/internal': '協作服務暫時無法使用，請稍後重試。'
  })[e === null || e === void 0 ? void 0 : e.code] || (e === null || e === void 0 ? void 0 : e.message) || '操作未完成，請重試';
  function Icon(_ref) {
    var _window$lucide;
    let _ref$name = _ref.name,
      name = _ref$name === void 0 ? 'users' : _ref$name,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 20 : _ref$size;
    const definition = (_window$lucide = window.lucide) === null || _window$lucide === void 0 || (_window$lucide = _window$lucide.icons) === null || _window$lucide === void 0 ? void 0 : _window$lucide[name.split('-').map(x => x[0].toUpperCase() + x.slice(1)).join('')];
    const nodes = Array.isArray(definition) ? definition[0] === 'svg' ? definition[2] : definition : [];
    return React.createElement("svg", {
      width: size,
      height: size,
      className: "co-icon",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, nodes.map((_ref2, i) => {
      let _ref3 = _slicedToArray(_ref2, 2),
        tag = _ref3[0],
        attrs = _ref3[1];
      return React.createElement(tag, {
        ...attrs,
        key: i
      });
    }));
  }
  const Button = _ref4 => {
    let children = _ref4.children,
      primary = _ref4.primary,
      danger = _ref4.danger,
      ghost = _ref4.ghost,
      props = _objectWithoutProperties(_ref4, _excluded);
    return React.createElement("button", _extends({
      type: "button"
    }, props, {
      className: `co-btn ${primary ? 'primary' : ''} ${danger ? 'danger' : ''} ${ghost ? 'ghost' : ''} ${props.className || ''}`
    }), children);
  };
  function Switch(_ref5) {
    let label = _ref5.label,
      description = _ref5.description,
      value = _ref5.value,
      onChange = _ref5.onChange,
      disabled = _ref5.disabled;
    return React.createElement("div", {
      className: "co-switch-row"
    }, React.createElement("div", null, React.createElement("strong", null, label), description && React.createElement("div", {
      className: "co-muted"
    }, description)), React.createElement("button", {
      type: "button",
      className: "co-switch",
      role: "switch",
      "aria-checked": !!value,
      "aria-label": label,
      disabled: disabled,
      onClick: () => onChange(!value)
    }, React.createElement("span", null)));
  }
  const Empty = _ref6 => {
    let title = _ref6.title,
      children = _ref6.children,
      _ref6$icon = _ref6.icon,
      icon = _ref6$icon === void 0 ? 'inbox' : _ref6$icon;
    return React.createElement("div", {
      className: "co-empty"
    }, React.createElement(Icon, {
      name: icon
    }), React.createElement("strong", null, title), React.createElement("div", null, children));
  };
  function Dialog(_ref7) {
    let title = _ref7.title,
      children = _ref7.children,
      onClose = _ref7.onClose,
      _ref7$busy = _ref7.busy,
      busy = _ref7$busy === void 0 ? false : _ref7$busy;
    const ref = useRef(),
      close = useRef(onClose);
    close.current = () => {
      if (!busy) onClose();
    };
    useEffect(() => {
      const previous = document.activeElement,
        overflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        var _ref$current;
        return (_ref$current = ref.current) === null || _ref$current === void 0 || (_ref$current = _ref$current.querySelector('input,textarea,button,select')) === null || _ref$current === void 0 ? void 0 : _ref$current.focus();
      }, 40);
      const key = e => {
        if (e.key === 'Escape') {
          var _close$current;
          e.stopPropagation();
          (_close$current = close.current) === null || _close$current === void 0 || _close$current.call(close);
        }
        if (e.key === 'Tab') {
          const all = [...ref.current.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(x => x.offsetParent !== null);
          const first = all[0],
            last = all.at(-1);
          if (!first) {
            e.preventDefault();
            return;
          }
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener('keydown', key, true);
      return () => {
        var _previous$focus;
        clearTimeout(timer);
        document.body.style.overflow = overflow;
        document.removeEventListener('keydown', key, true);
        previous === null || previous === void 0 || (_previous$focus = previous.focus) === null || _previous$focus === void 0 || _previous$focus.call(previous);
      };
    }, []);
    return ReactDOM.createPortal(React.createElement("div", {
      className: "co-overlay",
      onMouseDown: e => {
        if (e.target === e.currentTarget && !busy) onClose();
      }
    }, React.createElement("section", {
      className: "co-dialog",
      ref: ref,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title
    }, React.createElement("div", {
      className: "co-dialog-header"
    }, React.createElement("h2", null, title), React.createElement(Button, {
      className: "square",
      disabled: busy,
      onClick: onClose,
      "aria-label": "\u95DC\u9589"
    }, React.createElement(Icon, {
      name: "x"
    }))), children)), document.body);
  }
  function useCollaboration(user) {
    const _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      account = _useState2[0],
      setAccount = _useState2[1],
      _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      groups = _useState4[0],
      setGroups = _useState4[1],
      _useState5 = useState({}),
      _useState6 = _slicedToArray(_useState5, 2),
      preferences = _useState6[0],
      setPreferences = _useState6[1],
      _useState7 = useState([]),
      _useState8 = _slicedToArray(_useState7, 2),
      inbox = _useState8[0],
      setInbox = _useState8[1],
      _useState9 = useState([]),
      _useState0 = _slicedToArray(_useState9, 2),
      issued = _useState0[0],
      setIssued = _useState0[1],
      _useState1 = useState([]),
      _useState10 = _slicedToArray(_useState1, 2),
      drafts = _useState10[0],
      setDrafts = _useState10[1],
      _useState11 = useState(''),
      _useState12 = _slicedToArray(_useState11, 2),
      error = _useState12[0],
      setError = _useState12[1],
      _useState13 = useState(false),
      _useState14 = _slicedToArray(_useState13, 2),
      loading = _useState14[0],
      setLoading = _useState14[1],
      _useState15 = useState(0),
      _useState16 = _slicedToArray(_useState15, 2),
      tick = _useState16[0],
      setTick = _useState16[1];
    const alive = useRef('');
    alive.current = (user === null || user === void 0 ? void 0 : user.uid) || '';
    const api = async function (action) {
      var _result$data;
      let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let requestId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : rid();
      const svc = window.firebaseServices;
      if (!(svc !== null && svc !== void 0 && svc.callCollab)) throw Object.assign(new Error('協作服務尚未就緒'), {
        code: 'functions/unavailable'
      });
      const result = await svc.callCollab({
        action,
        ...data,
        requestId
      });
      if (((_result$data = result.data) === null || _result$data === void 0 ? void 0 : _result$data.ok) === false) throw new Error(result.data.message);
      return result.data;
    };
    useEffect(() => {
      setAccount(null);
      setGroups([]);
      setInbox([]);
      setIssued([]);
      setPreferences({});
      setDrafts([]);
      setError('');
      if (!user) return;
      let active = true;
      const unsubs = [];
      setLoading(true);
      api('bootstrap').then(() => {
        if (!active) return;
        const f = window.firebaseServices;
        const listen = (ref, cb) => unsubs.push(f.onSnapshot(ref, cb, e => {
          if (active) setError(errorText(e));
        }));
        listen(f.doc(f.db, 'collab_accounts', user.uid), snap => {
          setAccount(snap.data());
          setLoading(false);
        });
        listen(f.query(f.collection(f.db, 'collab_groups'), f.where('members', 'array-contains', user.uid)), snap => setGroups(snap.docs.map(x => ({
          ...x.data(),
          id: x.id
        }))));
        listen(f.collection(f.db, 'collab_preferences', user.uid, 'groups'), snap => setPreferences(Object.fromEntries(snap.docs.map(x => [x.id, x.data()]))));
        listen(f.query(f.collection(f.db, 'collab_inbox', user.uid, 'entries'), f.orderBy('createdAt', 'desc'), f.limit(100)), snap => setInbox(snap.docs.map(x => ({
          ...x.data(),
          id: x.id
        }))));
        listen(f.query(f.collection(f.db, 'collab_assignments'), f.where('ownerUid', '==', user.uid), f.orderBy('createdAt', 'desc'), f.limit(100)), snap => setIssued(snap.docs.map(x => ({
          ...x.data(),
          id: x.id
        }))));
        listen(f.query(f.collection(f.db, 'users', user.uid, 'drafts'), f.orderBy('updatedAt', 'desc'), f.limit(100)), snap => setDrafts(snap.docs.map(x => ({
          ...x.data(),
          id: x.id
        }))));
      }).catch(e => {
        if (active) {
          setLoading(false);
          setError(errorText(e));
        }
      });
      return () => {
        active = false;
        unsubs.forEach(f => f());
      };
    }, [user === null || user === void 0 ? void 0 : user.uid, tick]);
    const saveDraft = async draft => {
      const f = window.firebaseServices,
        key = draft.id || rid();
      await f.setDoc(f.doc(f.db, 'users', user.uid, 'drafts', key), {
        ...draft,
        id: key,
        updatedAt: Date.now()
      });
      return key;
    };
    const removeDraft = async key => {
      const f = window.firebaseServices;
      await f.deleteDoc(f.doc(f.db, 'users', user.uid, 'drafts', key));
    };
    return {
      account,
      groups,
      preferences,
      inbox,
      issued,
      drafts,
      loading,
      error,
      api,
      saveDraft,
      removeDraft,
      retry: () => setTick(x => x + 1),
      unread: inbox.filter(x => !x.read).length
    };
  }
  function useAction(notify) {
    const _useState17 = useState(false),
      _useState18 = _slicedToArray(_useState17, 2),
      busy = _useState18[0],
      setBusy = _useState18[1],
      lock = useRef(false);
    const run = async (fn, message) => {
      if (lock.current) return;
      lock.current = true;
      setBusy(true);
      try {
        const r = await fn();
        if (message) notify(message);
        return r;
      } catch (e) {
        notify(errorText(e), 'error');
        return null;
      } finally {
        lock.current = false;
        setBusy(false);
      }
    };
    return {
      busy,
      run
    };
  }
  function AccountCard(_ref8) {
    let collab = _ref8.collab,
      notify = _ref8.notify;
    const a = collab.account;
    const qr = useMemo(() => {
      if (!(a !== null && a !== void 0 && a.code) || !window.qrcode) return '';
      const q = window.qrcode(0, 'M');
      q.addData(`StudyOS account: ${a.code}`);
      q.make();
      return q.createSvgTag({
        cellSize: 4,
        margin: 2,
        scalable: true
      });
    }, [a === null || a === void 0 ? void 0 : a.code]);
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(a.code);
        notify('帳戶編號已複製');
      } catch (e) {
        notify(`請長按複製：${a.code}`);
      }
    };
    return React.createElement("div", {
      className: "co-card co-workspace"
    }, React.createElement("div", {
      className: "co-row co-between co-wrap"
    }, React.createElement("div", null, React.createElement("div", {
      className: "co-kicker"
    }, "\u4F60\u7684\u5E33\u6236\u7DE8\u865F"), React.createElement("div", {
      className: "co-code"
    }, (a === null || a === void 0 ? void 0 : a.code) || '•••••'), React.createElement("p", {
      className: "co-muted"
    }, "\u5206\u4EAB\u7DE8\u865F\u5373\u53EF\u9080\u8ACB\uFF1B\u52A0\u5165\u524D\u4ECD\u7531\u4F60\u78BA\u8A8D\u3002"), React.createElement("div", {
      className: "co-actions"
    }, React.createElement(Button, {
      disabled: !a,
      onClick: copy
    }, React.createElement(Icon, {
      name: "copy"
    }), "\u8907\u88FD\u7DE8\u865F"), navigator.share && React.createElement(Button, {
      disabled: !a,
      onClick: () => navigator.share({
        title: '我的 StudyOS 帳戶編號',
        text: `我的 StudyOS 帳戶編號：${a.code}`
      }).catch(() => {})
    }, React.createElement(Icon, {
      name: "share-2"
    }), "\u5206\u4EAB"))), qr && React.createElement("div", {
      className: "co-qr",
      "aria-label": `帳戶編號 ${a.code} 的二維碼`,
      dangerouslySetInnerHTML: {
        __html: qr
      }
    })), (a === null || a === void 0 ? void 0 : a.disabled) && React.createElement("p", {
      className: "co-notice error"
    }, "\u5354\u4F5C\u529F\u80FD\u5DF2\u88AB\u7E3D\u7BA1\u7406\u54E1\u66AB\u505C\u3002"), collab.error && React.createElement("p", {
      className: "co-muted"
    }, collab.error));
  }
  function Composer(_ref9) {
    var _subjects$, _initial$groupIds;
    let collab = _ref9.collab,
      subjects = _ref9.subjects,
      _ref9$initial = _ref9.initial,
      initial = _ref9$initial === void 0 ? {} : _ref9$initial,
      onClose = _ref9.onClose,
      notify = _ref9.notify;
    const blank = {
      kind: 'homework',
      subject: ((_subjects$ = subjects[0]) === null || _subjects$ === void 0 ? void 0 : _subjects$.name) || '其他',
      description: '',
      dueDate: C.tomorrow(),
      priority: 'normal',
      groupIds: [],
      codes: [],
      memberIds: []
    };
    const _useState19 = useState({
        ...blank,
        ...initial
      }),
      _useState20 = _slicedToArray(_useState19, 2),
      form = _useState20[0],
      setForm = _useState20[1],
      _useState21 = useState((initial.codes || []).join(' ')),
      _useState22 = _slicedToArray(_useState21, 2),
      codeText = _useState22[0],
      setCodeText = _useState22[1],
      _useState23 = useState((_initial$groupIds = initial.groupIds) !== null && _initial$groupIds !== void 0 && _initial$groupIds.length ? 'groups' : 'groups'),
      _useState24 = _slicedToArray(_useState23, 2),
      scope = _useState24[0],
      setScope = _useState24[1],
      _useState25 = useState(null),
      _useState26 = _slicedToArray(_useState25, 2),
      preview = _useState26[0],
      setPreview = _useState26[1],
      _useState27 = useState(rid),
      _useState28 = _slicedToArray(_useState27, 2),
      requestId = _useState28[0],
      setRequestId = _useState28[1],
      _useState29 = useState(initial.draftId || ''),
      _useState30 = _slicedToArray(_useState29, 2),
      savedId = _useState30[0],
      setSavedId = _useState30[1],
      _useState31 = useState(false),
      _useState32 = _slicedToArray(_useState31, 2),
      localSaved = _useState32[0],
      setLocalSaved = _useState32[1];
    const _useAction = useAction(notify),
      busy = _useAction.busy,
      run = _useAction.run,
      isEdit = !!initial.editId;
    const storageKey = `studyos-compose-${collab.account.uid}`;
    const update = (key, value) => {
      setForm(p => ({
        ...p,
        [key]: value
      }));
      setPreview(null);
      setRequestId(rid());
    };
    useEffect(() => {
      var _initial$codes;
      if ((_initial$codes = initial.codes) !== null && _initial$codes !== void 0 && _initial$codes.length) setScope('direct');
    }, []);
    useEffect(() => {
      if (isEdit) return;
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({
          ...form,
          codes: codeText.toUpperCase().split(/[\s,，]+/).filter(Boolean),
          scope
        }));
        setLocalSaved(!!form.description);
      } catch (e) {}
    }, [form, codeText, scope]);
    const payload = () => ({
      ...form,
      groupIds: scope === 'groups' ? form.groupIds : [],
      codes: scope === 'direct' ? codeText.trim().toUpperCase().split(/[\s,，]+/).filter(Boolean) : [],
      memberIds: scope === 'groups' && form.groupIds.length === 1 ? form.memberIds : []
    });
    const save = () => run(async () => {
      const key = await collab.saveDraft({
        ...payload(),
        id: savedId || rid()
      });
      setSavedId(key);
    }, '草稿已儲存，可在「我發放的」繼續');
    const submit = () => run(async () => {
      if (isEdit) {
        await collab.api('assignmentUpdate', {
          ...form,
          assignmentId: initial.editId
        }, requestId);
        notify('內容已更新；每個人的完成狀態保留');
        onClose();
        return;
      }
      if (!preview) {
        const p = await collab.api('preview', payload());
        setPreview(p);
        return;
      }
      const result = await collab.api('publish', payload(), requestId);
      try {
        sessionStorage.removeItem(storageKey);
      } catch (e) {}
      if (savedId) await collab.removeDraft(savedId).catch(() => {});
      notify(scope === 'direct' ? `已向 ${result.uniqueCount} 人發出邀請，等候接受` : `已向 ${result.uniqueCount} 人發放`);
      onClose();
    });
    const selectedGroup = collab.groups.find(g => g.id === form.groupIds[0]);
    return React.createElement(Dialog, {
      title: isEdit ? '修改已發放項目' : '發放功課或通知',
      onClose: () => {
        if (!busy) onClose();
      },
      busy: busy
    }, React.createElement("div", {
      className: "co-stack"
    }, React.createElement("div", {
      className: "co-two"
    }, React.createElement("label", {
      className: "co-field"
    }, "\u985E\u578B", React.createElement("select", {
      className: "co-input",
      value: form.kind,
      disabled: isEdit || busy,
      onChange: e => update('kind', e.target.value)
    }, C.KINDS.map(k => React.createElement("option", {
      key: k,
      value: k
    }, C.LABELS[k])))), React.createElement("label", {
      className: "co-field"
    }, "\u79D1\u76EE", React.createElement("input", {
      className: "co-input",
      list: "co-subject-list",
      maxLength: 40,
      value: form.subject,
      onChange: e => update('subject', e.target.value)
    }), React.createElement("datalist", {
      id: "co-subject-list"
    }, subjects.map(s => React.createElement("option", {
      key: s.name,
      value: s.name
    }))))), React.createElement("label", {
      className: "co-field"
    }, "\u5167\u5BB9", React.createElement("textarea", {
      className: "co-input",
      rows: 4,
      maxLength: 2000,
      value: form.description,
      onChange: e => update('description', e.target.value),
      placeholder: "\u4F8B\u5982\uFF1A\u5B8C\u6210\u5DE5\u4F5C\u7D19\u7B2C 1\u20132 \u9801"
    })), React.createElement("div", {
      className: "co-two"
    }, React.createElement("label", {
      className: "co-field"
    }, form.kind === 'notice' ? '公告日期' : form.kind === 'activity' ? '活動日期' : '交期／日期', React.createElement("input", {
      type: "date",
      className: "co-input",
      value: form.dueDate,
      onChange: e => update('dueDate', e.target.value)
    })), React.createElement("label", {
      className: "co-field"
    }, "\u512A\u5148\u6B21\u5E8F", React.createElement("select", {
      className: "co-input",
      value: form.priority,
      onChange: e => update('priority', e.target.value)
    }, React.createElement("option", {
      value: "low"
    }, "\u4F4E"), React.createElement("option", {
      value: "normal"
    }, "\u4E00\u822C"), React.createElement("option", {
      value: "high"
    }, "\u91CD\u8981")))), !isEdit && React.createElement(React.Fragment, null, React.createElement("hr", {
      className: "co-divider"
    }), React.createElement("div", {
      className: "co-tabs",
      role: "tablist",
      "aria-label": "\u767C\u653E\u5C0D\u8C61"
    }, React.createElement("button", {
      role: "tab",
      "aria-selected": scope === 'groups',
      onClick: () => {
        setScope('groups');
        setPreview(null);
        setRequestId(rid());
      }
    }, "\u7FA4\u7D44"), React.createElement("button", {
      role: "tab",
      "aria-selected": scope === 'direct',
      onClick: () => {
        setScope('direct');
        setPreview(null);
        setRequestId(rid());
      }
    }, "\u6307\u5B9A\u5E33\u6236")), scope === 'groups' ? React.createElement(React.Fragment, null, React.createElement("div", {
      className: "co-field"
    }, "\u9078\u64C7\u7FA4\u7D44\uFF08\u6700\u591A\u4E09\u500B\uFF09", React.createElement("div", {
      className: "co-stack co-scroll"
    }, collab.groups.filter(g => C.canPublish(g, collab.account.uid)).map(g => React.createElement("label", {
      key: g.id,
      className: "co-check"
    }, React.createElement("input", {
      type: "checkbox",
      checked: form.groupIds.includes(g.id),
      onChange: e => {
        update('groupIds', e.target.checked ? [...form.groupIds, g.id] : form.groupIds.filter(x => x !== g.id));
        setForm(p => ({
          ...p,
          memberIds: []
        }));
      }
    }), g.name, React.createElement("span", {
      className: "co-muted"
    }, g.members.length, " \u4EBA"))), !collab.groups.length && React.createElement("p", {
      className: "co-muted"
    }, "\u5148\u5EFA\u7ACB\u6216\u52A0\u5165\u7FA4\u7D44\uFF0C\u4EA6\u53EF\u4EE5\u7528\u5E33\u6236\u7DE8\u865F\u767C\u653E\u3002"))), form.groupIds.length === 1 && selectedGroup && React.createElement("details", null, React.createElement("summary", {
      className: "co-muted"
    }, "\u6307\u5B9A\u6210\u54E1\uFF08\u4E0D\u52FE\u9078\u5247\u767C\u653E\u5168\u7D44\uFF09"), React.createElement("div", {
      className: "co-two co-scroll"
    }, selectedGroup.members.map(u => React.createElement("label", {
      key: u,
      className: "co-check"
    }, React.createElement("input", {
      type: "checkbox",
      checked: form.memberIds.includes(u),
      onChange: e => update('memberIds', e.target.checked ? [...form.memberIds, u] : form.memberIds.filter(x => x !== u))
    }), selectedGroup.memberNames[u] || '同學'))))) : React.createElement("label", {
      className: "co-field"
    }, "\u4E94\u4F4D\u5E33\u6236\u7DE8\u865F\uFF08\u4EE5\u7A7A\u683C\u5206\u9694\uFF09", React.createElement("textarea", {
      className: "co-input",
      rows: 2,
      value: codeText,
      onChange: e => {
        setCodeText(e.target.value.toUpperCase());
        setPreview(null);
        setRequestId(rid());
      },
      autoCapitalize: "characters",
      spellCheck: false,
      placeholder: "ABCDE FGHIJ"
    }), React.createElement("span", {
      className: "co-muted"
    }, "\u5C0D\u65B9\u63A5\u53D7\u5F8C\u624D\u52A0\u5165\u500B\u4EBA\u624B\u518A\uFF1B\u6BCF\u6B21\u6700\u591A\u4E8C\u5341\u4EBA\u3002")), preview && React.createElement("div", {
      className: "co-notice"
    }, React.createElement("strong", null, "\u767C\u653E\u9810\u89BD\uFF1A", preview.uniqueCount, " \u4EBA \xB7 ", preview.count, " \u6B21\u6295\u905E"), preview.groups.map(g => React.createElement("div", {
      key: g.id
    }, g.name, "\uFF1A", g.count, " \u4EBA")), React.createElement("p", null, "\u540C\u5B78\u5404\u81EA\u63A7\u5236\u540C\u6B65\u8207\u901A\u77E5\u3002\u5B8C\u6210\u9032\u5EA6\u53EA\u5C6C\u65BC\u81EA\u5DF1\u3002"))), localSaved && !isEdit && React.createElement("span", {
      className: "co-muted"
    }, "\u672C\u6B21\u5167\u5BB9\u5DF2\u66AB\u5B58\u65BC\u6B64\u5206\u9801\uFF1B\u8DE8\u88DD\u7F6E\u8ACB\u5132\u5B58\u8349\u7A3F\u3002"), React.createElement("div", {
      className: "co-dialog-footer"
    }, !isEdit && React.createElement(Button, {
      disabled: busy,
      onClick: save
    }, "\u5132\u5B58\u8349\u7A3F"), React.createElement(Button, {
      primary: true,
      disabled: busy,
      onClick: submit
    }, busy ? '處理中…' : isEdit ? '儲存修改' : preview ? '確認發放' : '預覽發放'))));
  }
  function GroupForm(_ref0) {
    let collab = _ref0.collab,
      mode = _ref0.mode,
      group = _ref0.group,
      onClose = _ref0.onClose,
      notify = _ref0.notify;
    const _useState33 = useState((group === null || group === void 0 ? void 0 : group.name) || ''),
      _useState34 = _slicedToArray(_useState33, 2),
      name = _useState34[0],
      setName = _useState34[1],
      _useState35 = useState((group === null || group === void 0 ? void 0 : group.description) || ''),
      _useState36 = _slicedToArray(_useState35, 2),
      description = _useState36[0],
      setDescription = _useState36[1],
      _useState37 = useState(''),
      _useState38 = _slicedToArray(_useState37, 2),
      value = _useState38[0],
      setValue = _useState38[1],
      _useState39 = useState(null),
      _useState40 = _slicedToArray(_useState39, 2),
      found = _useState40[0],
      setFound = _useState40[1];
    const _useAction2 = useAction(notify),
      busy = _useAction2.busy,
      run = _useAction2.run;
    const submit = () => run(async () => {
      if (mode === 'invite' && !found) {
        const r = await collab.api('lookup', {
          code: value
        });
        if (!r.person) throw new Error('找不到可邀請的帳戶');
        setFound(r.person);
        return;
      }
      if (mode === 'create') await collab.api('createGroup', {
        name,
        description
      });
      if (mode === 'edit') await collab.api('groupUpdate', {
        groupId: group.id,
        name,
        description
      });
      if (mode === 'join') await collab.api('joinGroup', {
        code: value
      });
      if (mode === 'invite') await collab.api('invite', {
        groupId: group.id,
        code: value
      });
      notify(mode === 'join' ? '已提交申請，等候群主審批' : mode === 'invite' ? '已送出邀請，等候對方接受' : '群組已儲存');
      onClose();
    });
    return React.createElement(Dialog, {
      title: {
        create: '建立群組',
        join: '申請加入群組',
        invite: '邀請同學',
        edit: '編輯群組'
      }[mode],
      onClose: onClose,
      busy: busy
    }, React.createElement("div", {
      className: "co-stack"
    }, ['create', 'edit'].includes(mode) ? React.createElement(React.Fragment, null, React.createElement("label", {
      className: "co-field"
    }, "\u7FA4\u7D44\u540D\u7A31", React.createElement("input", {
      className: "co-input",
      value: name,
      maxLength: 60,
      onChange: e => setName(e.target.value),
      placeholder: "\u4F8B\u5982\uFF1A\u4E2D\u4E09\u7532\u73ED"
    })), React.createElement("label", {
      className: "co-field"
    }, "\u7C21\u4ECB", React.createElement("textarea", {
      className: "co-input",
      value: description,
      maxLength: 300,
      onChange: e => setDescription(e.target.value),
      rows: 3
    }))) : React.createElement("label", {
      className: "co-field"
    }, mode === 'invite' ? '對方帳戶編號' : '群組編號', React.createElement("input", {
      className: "co-input",
      value: value,
      onChange: e => {
        setValue(e.target.value.toUpperCase());
        setFound(null);
      },
      autoCapitalize: "characters",
      spellCheck: false,
      maxLength: mode === 'invite' ? 5 : 8,
      placeholder: mode === 'invite' ? 'ABCDE' : 'G-ABCDEF'
    }), React.createElement("span", {
      className: "co-muted"
    }, mode === 'invite' ? '五個英文字母；先核對姓名再邀請。' : '加入需經群主確認；接受後預設同步新功課。')), found && React.createElement("div", {
      className: "co-notice"
    }, "\u9080\u8ACB ", React.createElement("strong", null, found.name), "\uFF08", found.code, "\uFF09\u52A0\u5165 ", React.createElement("strong", null, group.name)), React.createElement("div", {
      className: "co-dialog-footer"
    }, React.createElement(Button, {
      disabled: busy,
      primary: true,
      onClick: submit
    }, busy ? '處理中…' : mode === 'invite' && !found ? '核對帳戶' : mode === 'join' ? '提交申請' : mode === 'invite' ? '送出邀請' : '儲存群組'))));
  }
  function SourceCard(_ref1) {
    let task = _ref1.task,
      personal = _ref1.personal,
      collab = _ref1.collab,
      notify = _ref1.notify,
      onEdit = _ref1.onEdit,
      onDuplicate = _ref1.onDuplicate,
      onConfirm = _ref1.onConfirm,
      onReport = _ref1.onReport,
      _ref1$issuer = _ref1.issuer,
      issuer = _ref1$issuer === void 0 ? false : _ref1$issuer;
    const _useAction3 = useAction(notify),
      busy = _useAction3.busy,
      run = _useAction3.run;
    return React.createElement("article", {
      className: "co-card"
    }, React.createElement("div", {
      className: "co-row co-between co-wrap"
    }, React.createElement("div", {
      className: "co-row co-wrap"
    }, React.createElement("span", {
      className: "co-chip"
    }, C.LABELS[task.kind] || '功課'), React.createElement("span", {
      className: "co-chip"
    }, task.subject), task.state === 'withdrawn' && React.createElement("span", {
      className: "co-chip warn"
    }, "\u5DF2\u64A4\u56DE")), React.createElement("span", {
      className: "co-muted"
    }, task.dueDate)), React.createElement("p", {
      className: "co-description",
      style: {
        fontWeight: 700,
        padding: '.4rem 0'
      }
    }, task.description), React.createElement("p", {
      className: "co-muted"
    }, task.groupName || '私人發放', " \xB7 ", task.authorName, " \xB7 \u7B2C ", task.version, " \u7248"), issuer && React.createElement("p", {
      className: "co-muted"
    }, task.groupId ? `已發放予 ${task.audience.length} 位成員` : `${task.acceptedUids.length} / ${task.audience.length} 人已接受`, " \xB7 \u5B8C\u6210\u8A18\u9304\u5C6C\u500B\u4EBA\u79C1\u96B1"), React.createElement("div", {
      className: "co-actions"
    }, issuer ? React.createElement(React.Fragment, null, React.createElement(Button, {
      disabled: busy || task.state === 'withdrawn',
      onClick: () => onEdit(task)
    }, React.createElement(Icon, {
      name: "pencil"
    }), "\u4FEE\u6539"), React.createElement(Button, {
      onClick: () => onDuplicate(task)
    }, React.createElement(Icon, {
      name: "copy"
    }), "\u518D\u6B21\u767C\u653E"), task.state !== 'withdrawn' && React.createElement(Button, {
      danger: true,
      disabled: busy,
      onClick: () => onConfirm('撤回後不再計入待辦，已同步的紀錄會保留並標示撤回。', () => run(() => collab.api('withdraw', {
        assignmentId: task.id
      }), '已撤回發放'))
    }, "\u64A4\u56DE")) : React.createElement(React.Fragment, null, task.kind !== 'notice' && React.createElement(Button, {
      primary: !personal,
      disabled: busy || task.state === 'withdrawn' || !!personal && !personal.isHidden,
      onClick: () => run(() => collab.api('addPersonal', {
        assignmentId: task.id
      }), '已加入個人手冊')
    }, personal ? personal.isHidden ? '重新加入個人' : personal.completed ? '個人已完成' : '已同步到個人' : '加入個人手冊'), React.createElement(Button, {
      ghost: true,
      onClick: () => onReport('assignment', task.id)
    }, "\u6AA2\u8209"))));
  }
  function GroupDetail(_ref10) {
    let group = _ref10.group,
      collab = _ref10.collab,
      items = _ref10.items,
      subjects = _ref10.subjects,
      notify = _ref10.notify,
      onBack = _ref10.onBack,
      onCompose = _ref10.onCompose,
      onForm = _ref10.onForm,
      onConfirm = _ref10.onConfirm,
      onReport = _ref10.onReport;
    const _useState41 = useState('tasks'),
      _useState42 = _slicedToArray(_useState41, 2),
      tab = _useState42[0],
      setTab = _useState42[1],
      _useState43 = useState([]),
      _useState44 = _slicedToArray(_useState43, 2),
      tasks = _useState44[0],
      setTasks = _useState44[1],
      _useState45 = useState(''),
      _useState46 = _slicedToArray(_useState45, 2),
      error = _useState46[0],
      setError = _useState46[1],
      _useState47 = useState(50),
      _useState48 = _slicedToArray(_useState47, 2),
      more = _useState48[0],
      setMore = _useState48[1],
      _useState49 = useState(false),
      _useState50 = _slicedToArray(_useState49, 2),
      syncChoice = _useState50[0],
      setSyncChoice = _useState50[1];
    const _useAction4 = useAction(notify),
      busy = _useAction4.busy,
      run = _useAction4.run,
      uid = collab.account.uid,
      manager = C.canManage(group, uid),
      owner = group.ownerUid === uid;
    const pref = collab.preferences[group.id] || {
      sync: true,
      notify: true
    };
    useEffect(() => {
      setTasks([]);
      setError('');
      const f = window.firebaseServices;
      return f.onSnapshot(f.query(f.collection(f.db, 'collab_assignments'), f.where('groupId', '==', group.id), f.where('audience', 'array-contains', uid), f.orderBy('createdAt', 'desc'), f.limit(more)), snap => setTasks(snap.docs.map(x => ({
        ...x.data(),
        id: x.id
      }))), e => setError(errorText(e)));
    }, [group.id, more, uid]);
    const update = function (key, value) {
      let extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return run(() => collab.api('preferences', {
        groupId: group.id,
        [key]: value,
        ...extra
      }), '群組設定已更新');
    };
    return React.createElement("div", {
      className: "co-stack"
    }, React.createElement("div", {
      className: "co-header"
    }, React.createElement("div", null, React.createElement(Button, {
      ghost: true,
      onClick: onBack
    }, React.createElement(Icon, {
      name: "arrow-left"
    }), "\u6240\u6709\u7FA4\u7D44"), React.createElement("h2", {
      style: {
        marginTop: '.7rem'
      }
    }, group.name), React.createElement("p", {
      className: "co-muted"
    }, group.description || '共同整理功課，各自安排進度。')), React.createElement("div", {
      className: "co-actions"
    }, manager && React.createElement(Button, {
      onClick: () => onForm('invite', group)
    }, React.createElement(Icon, {
      name: "user-plus"
    }), "\u9080\u8ACB\u540C\u5B78"), React.createElement(Button, {
      primary: true,
      disabled: !C.canPublish(group, uid) || collab.account.canPublish === false,
      onClick: () => onCompose({
        groupIds: [group.id]
      })
    }, React.createElement(Icon, {
      name: "send"
    }), "\u767C\u653E"))), group.state === 'frozen' && React.createElement("div", {
      className: "co-notice error"
    }, "\u7FA4\u7D44\u5DF2\u88AB\u7E3D\u7BA1\u7406\u54E1\u51CD\u7D50\uFF0C\u66AB\u505C\u52A0\u5165\u53CA\u767C\u653E\u3002"), React.createElement("div", {
      className: "co-tabs",
      role: "tablist",
      "aria-label": "\u7FA4\u7D44\u5167\u5BB9"
    }, [['tasks', '功課與通知'], ['members', `成員 ${group.members.length}`], ['settings', '群組設定']].map(_ref11 => {
      let _ref12 = _slicedToArray(_ref11, 2),
        key = _ref12[0],
        label = _ref12[1];
      return React.createElement("button", {
        key: key,
        role: "tab",
        "aria-selected": tab === key,
        onClick: () => setTab(key)
      }, label);
    })), tab === 'tasks' && React.createElement(React.Fragment, null, React.createElement("div", {
      className: "co-notice"
    }, pref.sync ? '同步已開啟：新功課會加入個人手冊。' : '同步已關閉：可逐份加入個人手冊。', " \u5B8C\u6210\u72C0\u614B\u53EA\u6703\u66F4\u6539\u81EA\u5DF1\u3002"), error && React.createElement("div", {
      className: "co-notice error"
    }, error), !tasks.length && !error && React.createElement(Empty, {
      title: "\u66AB\u6642\u6C92\u6709\u767C\u653E\u9805\u76EE"
    }, "\u7B2C\u4E00\u4EFD\u529F\u8AB2\u6216\u901A\u77E5\u6703\u986F\u793A\u5728\u9019\u88E1\u3002"), tasks.map(a => React.createElement(SourceCard, {
      key: a.id,
      task: a,
      personal: items.find(i => i.collabRefId === a.id),
      collab: collab,
      notify: notify,
      onReport: onReport
    })), tasks.length >= more && React.createElement(Button, {
      onClick: () => setMore(n => n + 50)
    }, "\u8F09\u5165\u66F4\u591A")), tab === 'members' && React.createElement("div", {
      className: "co-stack"
    }, group.members.map(u => React.createElement("div", {
      className: "co-card co-admin-row",
      key: u
    }, React.createElement("div", {
      className: "co-row"
    }, React.createElement("div", {
      className: "co-avatar"
    }, (group.memberNames[u] || '同').slice(0, 1)), React.createElement("div", null, React.createElement("strong", null, group.memberNames[u] || '同學', u === uid ? '（你）' : ''), React.createElement("div", {
      className: "co-muted"
    }, u === group.ownerUid ? '群主' : group.managers.includes(u) ? '管理員' : '成員'))), React.createElement("div", {
      className: "co-actions"
    }, owner && u !== uid && React.createElement(React.Fragment, null, React.createElement(Button, {
      disabled: busy,
      onClick: () => onConfirm(`${group.managers.includes(u) ? '取消' : '授予'}此成員的管理權限？`, () => run(() => collab.api('memberRole', {
        groupId: group.id,
        uid: u,
        manager: !group.managers.includes(u)
      }), '角色已更新'))
    }, group.managers.includes(u) ? '取消管理員' : '設為管理員'), React.createElement(Button, {
      disabled: busy,
      onClick: () => onConfirm('轉移後對方將成為群主，你會成為管理員。確定轉移？', () => run(() => collab.api('transferOwner', {
        groupId: group.id,
        uid: u
      }), '群主已轉移'))
    }, "\u8F49\u79FB\u7FA4\u4E3B")), manager && u !== uid && u !== group.ownerUid && React.createElement(Button, {
      danger: true,
      disabled: busy,
      onClick: () => onConfirm('移出此成員並禁止重新加入？已有個人紀錄會保留。', () => run(() => collab.api('removeMember', {
        groupId: group.id,
        uid: u
      }), '成員已移出'))
    }, "\u79FB\u51FA"), u !== uid && React.createElement(Button, {
      ghost: true,
      onClick: () => onConfirm('封鎖後雙方不能再直接邀請或發放新項目。', () => run(() => collab.api('block', {
        uid: u
      }), '已封鎖帳戶'))
    }, "\u5C01\u9396"))))), tab === 'settings' && React.createElement("div", {
      className: "co-two"
    }, React.createElement("div", {
      className: "co-card"
    }, React.createElement("h3", null, "\u6211\u7684\u63A5\u6536\u65B9\u5F0F"), React.createElement(Switch, {
      label: "\u540C\u6B65\u5230\u500B\u4EBA",
      description: "\u53EA\u5F71\u97FF\u4F60\uFF1B\u95DC\u9589\u5F8C\u4FDD\u7559\u5DF2\u6709\u529F\u8AB2\u3002",
      value: pref.sync,
      disabled: busy,
      onChange: value => value ? setSyncChoice(true) : update('sync', false)
    }), React.createElement(Switch, {
      label: "\u7FA4\u7D44\u901A\u77E5",
      description: "\u7368\u7ACB\u63A7\u5236\u6B64\u7FA4\u7D44\u7684\u65B0\u529F\u8AB2\u53CA\u66F4\u65B0\u63D0\u9192\u3002",
      value: pref.notify,
      disabled: busy,
      onChange: value => update('notify', value)
    }), React.createElement(Switch, {
      label: "\u7F6E\u9802\u7FA4\u7D44",
      value: pref.pinned,
      disabled: busy,
      onChange: value => update('pinned', value)
    }), React.createElement(Switch, {
      label: "\u5C01\u5B58\u7FA4\u7D44",
      description: "\u79FB\u81F3\u5C01\u5B58\u5217\u8868\uFF0C\u63A5\u6536\u65B9\u5F0F\u7DAD\u6301\u539F\u8A2D\u5B9A\u3002",
      value: pref.archived,
      disabled: busy,
      onChange: value => update('archived', value)
    })), React.createElement("div", {
      className: "co-card co-stack"
    }, React.createElement("div", null, React.createElement("h3", null, "\u7FA4\u7D44\u8CC7\u6599"), React.createElement("p", {
      className: "co-code small"
    }, group.code), React.createElement("p", {
      className: "co-muted"
    }, "\u8207\u4E94\u4F4D\u5E33\u6236\u7DE8\u865F\u5206\u958B\uFF1B\u52A0\u5165\u7533\u8ACB\u7531\u7FA4\u4E3B\u8655\u7406\u3002")), manager && React.createElement(React.Fragment, null, React.createElement(Button, {
      onClick: () => onForm('edit', group)
    }, "\u7DE8\u8F2F\u7FA4\u7D44"), React.createElement(Switch, {
      label: "\u6210\u54E1\u53EF\u4EE5\u767C\u653E",
      value: group.allowMemberPublish,
      disabled: busy,
      onChange: value => run(() => collab.api('groupUpdate', {
        groupId: group.id,
        allowMemberPublish: value
      }), '發放權限已更新')
    })), React.createElement(Button, {
      ghost: true,
      onClick: () => onReport('group', group.id)
    }, "\u6AA2\u8209\u7FA4\u7D44"), !owner && React.createElement(Button, {
      danger: true,
      disabled: busy,
      onClick: () => onConfirm('離開後不再接收新功課；個人手冊已有紀錄會保留。', () => run(async () => {
        await collab.api('leaveGroup', {
          groupId: group.id
        });
        onBack();
      }, '已離開群組'))
    }, "\u96E2\u958B\u7FA4\u7D44"), owner && React.createElement("p", {
      className: "co-muted"
    }, "\u5982\u8981\u96E2\u958B\uFF0C\u5148\u5728\u6210\u54E1\u9801\u8F49\u79FB\u7FA4\u4E3B\u3002"))), syncChoice && React.createElement(Dialog, {
      title: "\u958B\u555F\u540C\u6B65\u5230\u500B\u4EBA",
      onClose: () => setSyncChoice(false),
      busy: busy
    }, React.createElement("p", {
      className: "co-muted"
    }, "\u5DF2\u6709\u529F\u8AB2\u53CA\u5B8C\u6210\u72C0\u614B\u6703\u4FDD\u7559\uFF0C\u91CD\u8907\u9805\u76EE\u4E0D\u6703\u518D\u6B21\u52A0\u5165\u3002"), React.createElement("div", {
      className: "co-dialog-footer"
    }, React.createElement(Button, {
      disabled: busy,
      onClick: async () => {
        const r = await update('sync', true);
        if (r) setSyncChoice(false);
      }
    }, "\u53EA\u540C\u6B65\u4E4B\u5F8C\u7684\u65B0\u529F\u8AB2"), React.createElement(Button, {
      primary: true,
      disabled: busy,
      onClick: async () => {
        const r = await update('sync', true, {
          includeExisting: true
        });
        if (r) setSyncChoice(false);
      }
    }, "\u540C\u6642\u52A0\u5165\u672A\u5230\u671F\u529F\u8AB2"))));
  }
  function Inbox(_ref13) {
    let collab = _ref13.collab,
      notify = _ref13.notify,
      onGroup = _ref13.onGroup,
      onConfirm = _ref13.onConfirm;
    const _useState51 = useState('all'),
      _useState52 = _slicedToArray(_useState51, 2),
      filter = _useState52[0],
      setFilter = _useState52[1];
    const _useAction5 = useAction(notify),
      busy = _useAction5.busy,
      run = _useAction5.run;
    const entries = collab.inbox.filter(e => filter === 'all' || filter === 'pending' && e.status === 'pending' || filter === 'unread' && !e.read);
    return React.createElement("div", {
      className: "co-stack"
    }, React.createElement("div", {
      className: "co-header"
    }, React.createElement("div", null, React.createElement("h2", null, "\u6536\u4EF6\u5323"), React.createElement("p", {
      className: "co-muted"
    }, "\u9080\u8ACB\u5148\u78BA\u8A8D\uFF1B\u5DF2\u63A5\u53D7\u7684\u529F\u8AB2\u624D\u6703\u52A0\u5165\u500B\u4EBA\u3002")), React.createElement(Button, {
      disabled: busy || !collab.unread,
      onClick: () => run(() => collab.api('inboxRead', {
        ids: collab.inbox.filter(x => !x.read).map(x => x.id)
      }), '已標示為已讀')
    }, "\u5168\u90E8\u5DF2\u8B80")), React.createElement("div", {
      className: "co-tabs",
      role: "tablist",
      "aria-label": "\u6536\u4EF6\u5323\u7BE9\u9078"
    }, [['all', '全部'], ['pending', '待處理'], ['unread', '未讀']].map(_ref14 => {
      let _ref15 = _slicedToArray(_ref14, 2),
        k = _ref15[0],
        l = _ref15[1];
      return React.createElement("button", {
        key: k,
        role: "tab",
        "aria-selected": filter === k,
        onClick: () => setFilter(k)
      }, l);
    })), !entries.length && React.createElement(Empty, {
      title: "\u66AB\u6642\u6C92\u6709\u901A\u77E5"
    }, "\u9080\u8ACB\u3001\u767C\u653E\u53CA\u4EA4\u671F\u66F4\u65B0\u6703\u96C6\u4E2D\u5728\u9019\u88E1\u3002"), entries.map(e => React.createElement("article", {
      className: "co-card",
      key: e.id
    }, React.createElement("div", {
      className: "co-row co-between"
    }, React.createElement("h3", null, e.title), !e.read && React.createElement("span", {
      className: "co-dot",
      "aria-label": "\u672A\u8B80"
    })), e.description && React.createElement("p", {
      className: "co-description"
    }, e.description), React.createElement("p", {
      className: "co-muted"
    }, e.dueDate && `${e.subject || ''} · ${e.dueDate} · `, new Date(e.createdAt).toLocaleString('zh-HK')), React.createElement("div", {
      className: "co-actions"
    }, e.status === 'pending' ? React.createElement(React.Fragment, null, e.expiresAt < Date.now() ? React.createElement("span", {
      className: "co-chip warn"
    }, "\u5DF2\u5230\u671F") : React.createElement(Button, {
      primary: true,
      disabled: busy,
      onClick: () => run(() => collab.api('respond', {
        entryId: e.id,
        accept: true
      }), '已接受')
    }, "\u63A5\u53D7"), React.createElement(Button, {
      disabled: busy,
      onClick: () => run(() => collab.api('respond', {
        entryId: e.id,
        accept: false
      }), '已拒絕')
    }, "\u62D2\u7D55")) : React.createElement("span", {
      className: "co-chip"
    }, {
      accepted: '已接受',
      rejected: '已拒絕',
      withdrawn: '已撤回',
      info: '通知'
    }[e.status] || e.status), e.groupId && collab.groups.some(g => g.id === e.groupId) && React.createElement(Button, {
      onClick: () => {
        run(() => collab.api('inboxRead', {
          ids: [e.id]
        }));
        onGroup(e.groupId);
      }
    }, "\u67E5\u770B\u7FA4\u7D44"), !e.read && React.createElement(Button, {
      ghost: true,
      disabled: busy,
      onClick: () => run(() => collab.api('inboxRead', {
        ids: [e.id]
      }))
    }, "\u6A19\u793A\u5DF2\u8B80"), e.actorUid !== collab.account.uid && e.actorUid && React.createElement(Button, {
      ghost: true,
      onClick: () => onConfirm('封鎖此發放者？已有紀錄仍會保留。', () => run(() => collab.api('block', {
        uid: e.actorUid
      }), '已封鎖'))
    }, "\u5C01\u9396")))), React.createElement("p", {
      className: "co-muted"
    }, "\u986F\u793A\u6700\u8FD1 100 \u5247\u901A\u77E5\u3002"));
  }
  function Admin(_ref16) {
    let collab = _ref16.collab,
      notify = _ref16.notify,
      onConfirm = _ref16.onConfirm;
    const _useState53 = useState('accounts'),
      _useState54 = _slicedToArray(_useState53, 2),
      tab = _useState54[0],
      setTab = _useState54[1],
      _useState55 = useState([]),
      _useState56 = _slicedToArray(_useState55, 2),
      rows = _useState56[0],
      setRows = _useState56[1],
      _useState57 = useState(null),
      _useState58 = _slicedToArray(_useState57, 2),
      next = _useState58[0],
      setNext = _useState58[1],
      _useState59 = useState(false),
      _useState60 = _slicedToArray(_useState59, 2),
      loading = _useState60[0],
      setLoading = _useState60[1],
      _useState61 = useState(''),
      _useState62 = _slicedToArray(_useState61, 2),
      query = _useState62[0],
      setQuery = _useState62[1],
      _useState63 = useState(''),
      _useState64 = _slicedToArray(_useState63, 2),
      error = _useState64[0],
      setError = _useState64[1];
    const _useAction6 = useAction(notify),
      busy = _useAction6.busy,
      run = _useAction6.run,
      gen = useRef(0);
    const load = async function () {
      let more = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      const generation = ++gen.current;
      setLoading(true);
      setError('');
      try {
        const r = await collab.api('adminList', {
          tab,
          cursor: more ? next : null
        });
        if (generation === gen.current) {
          setRows(p => more ? [...p, ...r.rows] : r.rows);
          setNext(r.next);
        }
      } catch (e) {
        if (generation === gen.current) setError(errorText(e));
      } finally {
        if (generation === gen.current) setLoading(false);
      }
    };
    useEffect(() => {
      setRows([]);
      setQuery('');
      load();
      return () => {
        gen.current++;
      };
    }, [tab]);
    const change = data => run(async () => {
      await collab.api('adminUpdate', data);
      await load();
    }, '管理設定已更新');
    return React.createElement("div", {
      className: "co-stack"
    }, React.createElement("div", null, React.createElement("h2", null, "\u5354\u4F5C\u7BA1\u7406\u4E2D\u5FC3"), React.createElement("p", {
      className: "co-muted"
    }, "\u5E33\u6236\u7DE8\u865F\u3001\u767C\u653E\u6B0A\u9650\u3001\u7FA4\u7D44\u72C0\u614B\u53CA\u64CD\u4F5C\u8A18\u9304\u3002")), React.createElement("div", {
      className: "co-tabs",
      role: "tablist",
      "aria-label": "\u7BA1\u7406\u5206\u985E"
    }, [['accounts', '帳戶'], ['groups', '群組'], ['reports', '檢舉'], ['audit', '操作記錄']].map(_ref17 => {
      let _ref18 = _slicedToArray(_ref17, 2),
        k = _ref18[0],
        l = _ref18[1];
      return React.createElement("button", {
        role: "tab",
        key: k,
        "aria-selected": tab === k,
        onClick: () => setTab(k)
      }, l);
    })), React.createElement("label", {
      className: "co-field"
    }, "\u7BE9\u9078\u5DF2\u8F09\u5165\u8CC7\u6599", React.createElement("input", {
      className: "co-input",
      value: query,
      onChange: e => setQuery(e.target.value),
      placeholder: "\u59D3\u540D\u3001\u7DE8\u865F\u6216\u5167\u5BB9"
    })), error && React.createElement("div", {
      className: "co-notice error"
    }, error, React.createElement(Button, {
      onClick: () => load()
    }, "\u91CD\u8A66")), rows.filter(x => JSON.stringify(x).toLowerCase().includes(query.toLowerCase())).map(row => React.createElement("div", {
      key: row.id,
      className: "co-card co-admin-row"
    }, React.createElement("div", null, React.createElement("strong", null, row.name || row.reason || row.action), React.createElement("div", {
      className: "co-muted"
    }, row.code || row.actorName || row.targetId), tab === 'audit' && React.createElement("div", {
      className: "co-muted"
    }, new Date(row.createdAt).toLocaleString('zh-HK'), " \xB7 ", row.targetId), tab === 'reports' && React.createElement("p", {
      className: "co-muted"
    }, row.targetType, " \xB7 ", row.state)), React.createElement("div", {
      className: "co-actions"
    }, tab === 'accounts' && React.createElement(React.Fragment, null, React.createElement(Button, {
      disabled: busy || row.uid === collab.account.uid,
      onClick: () => onConfirm(`${row.canPublish ? '暫停' : '恢復'} ${row.name} 的發放權限？`, () => change({
        targetType: 'account',
        targetId: row.uid,
        canPublish: !row.canPublish
      }))
    }, row.canPublish ? '暫停發放' : '恢復發放'), React.createElement(Button, {
      danger: true,
      disabled: busy || row.uid === collab.account.uid,
      onClick: () => onConfirm(`${row.disabled ? '恢復' : '暫停'} ${row.name} 的協作功能？`, () => change({
        targetType: 'account',
        targetId: row.uid,
        disabled: !row.disabled
      }))
    }, row.disabled ? '恢復帳戶' : '暫停協作')), tab === 'groups' && React.createElement(Button, {
      danger: true,
      disabled: busy,
      onClick: () => onConfirm(`${row.state === 'active' ? '凍結' : '解凍'} ${row.name}？`, () => change({
        targetType: 'group',
        targetId: row.id,
        frozen: row.state === 'active'
      }))
    }, row.state === 'active' ? '凍結群組' : '解凍群組'), tab === 'reports' && row.state === 'open' && React.createElement(Button, {
      disabled: busy,
      onClick: () => change({
        targetType: 'report',
        targetId: row.id
      })
    }, "\u6A19\u793A\u5DF2\u8655\u7406")))), loading && React.createElement("div", {
      className: "co-loading",
      "aria-label": "\u8F09\u5165\u4E2D"
    }), !loading && !rows.length && !error && React.createElement(Empty, {
      title: "\u66AB\u6642\u6C92\u6709\u8CC7\u6599"
    }), next && React.createElement(Button, {
      disabled: loading,
      onClick: () => load(true)
    }, "\u8F09\u5165\u66F4\u591A"));
  }
  function Report(_ref19) {
    let collab = _ref19.collab,
      target = _ref19.target,
      onClose = _ref19.onClose,
      notify = _ref19.notify;
    const _useState65 = useState(''),
      _useState66 = _slicedToArray(_useState65, 2),
      reason = _useState66[0],
      setReason = _useState66[1];
    const _useAction7 = useAction(notify),
      busy = _useAction7.busy,
      run = _useAction7.run;
    return React.createElement(Dialog, {
      title: "\u63D0\u4EA4\u6AA2\u8209",
      onClose: onClose,
      busy: busy
    }, React.createElement("label", {
      className: "co-field"
    }, "\u8ACB\u8AAA\u660E\u539F\u56E0", React.createElement("textarea", {
      className: "co-input",
      rows: 4,
      value: reason,
      maxLength: 1000,
      onChange: e => setReason(e.target.value)
    })), React.createElement("div", {
      className: "co-dialog-footer"
    }, React.createElement(Button, {
      primary: true,
      disabled: busy,
      onClick: () => run(async () => {
        await collab.api('report', {
          targetType: target.type,
          targetId: target.id,
          reason
        });
        notify('已提交予總管理員');
        onClose();
      })
    }, "\u63D0\u4EA4")));
  }
  function PersonalNote(_ref20) {
    let item = _ref20.item,
      onClose = _ref20.onClose,
      onSave = _ref20.onSave,
      notify = _ref20.notify;
    const _useState67 = useState(item.privateNote || ''),
      _useState68 = _slicedToArray(_useState67, 2),
      value = _useState68[0],
      setValue = _useState68[1];
    const _useAction8 = useAction(notify),
      busy = _useAction8.busy,
      run = _useAction8.run;
    return React.createElement(Dialog, {
      title: "\u500B\u4EBA\u7B46\u8A18",
      onClose: onClose,
      busy: busy
    }, React.createElement("p", {
      className: "co-muted"
    }, "\u53EA\u8A18\u9304\u81EA\u5DF1\u7684\u5B89\u6392\uFF1B\u767C\u653E\u5167\u5BB9\u7531\u539F\u767C\u653E\u8005\u66F4\u65B0\u3002"), React.createElement("div", {
      className: "co-notice co-description"
    }, item.subject, " \xB7 ", item.dueDate, React.createElement("br", null), item.description), React.createElement("label", {
      className: "co-field",
      style: {
        marginTop: '1rem'
      }
    }, "\u6211\u7684\u7B46\u8A18", React.createElement("textarea", {
      className: "co-input",
      rows: 5,
      maxLength: 2000,
      value: value,
      onChange: e => setValue(e.target.value)
    })), React.createElement("div", {
      className: "co-dialog-footer"
    }, React.createElement(Button, {
      primary: true,
      disabled: busy,
      onClick: () => run(async () => {
        await onSave(item.id, {
          privateNote: value,
          changedAfterCompletion: false
        });
        onClose();
      })
    }, "\u5132\u5B58\u7B46\u8A18")));
  }
  function Workspace(_ref21) {
    let collab = _ref21.collab,
      user = _ref21.user,
      items = _ref21.items,
      subjects = _ref21.subjects,
      notify = _ref21.notify,
      onConfirm = _ref21.onConfirm,
      onLegacy = _ref21.onLegacy,
      _ref21$initialTab = _ref21.initialTab,
      initialTab = _ref21$initialTab === void 0 ? 'groups' : _ref21$initialTab;
    const _useState69 = useState(initialTab),
      _useState70 = _slicedToArray(_useState69, 2),
      tab = _useState70[0],
      setTab = _useState70[1],
      _useState71 = useState(''),
      _useState72 = _slicedToArray(_useState71, 2),
      selected = _useState72[0],
      setSelected = _useState72[1],
      _useState73 = useState(null),
      _useState74 = _slicedToArray(_useState73, 2),
      modal = _useState74[0],
      setModal = _useState74[1],
      _useState75 = useState(null),
      _useState76 = _slicedToArray(_useState75, 2),
      composer = _useState76[0],
      setComposer = _useState76[1],
      _useState77 = useState(null),
      _useState78 = _slicedToArray(_useState77, 2),
      report = _useState78[0],
      setReport = _useState78[1],
      _useState79 = useState(false),
      _useState80 = _slicedToArray(_useState79, 2),
      archived = _useState80[0],
      setArchived = _useState80[1],
      _useState81 = useState(''),
      _useState82 = _slicedToArray(_useState81, 2),
      search = _useState82[0],
      setSearch = _useState82[1];
    const _useAction9 = useAction(notify),
      busy = _useAction9.busy,
      run = _useAction9.run;
    const admin = (user === null || user === void 0 ? void 0 : user.email) === 'chimhinhin@gmail.com' && user.emailVerified;
    useEffect(() => {
      setTab(initialTab);
      setSelected('');
    }, [initialTab]);
    const group = collab.groups.find(g => g.id === selected);
    const compose = initial => setComposer(initial || {});
    const duplicate = a => compose({
      kind: a.kind,
      subject: a.subject,
      description: a.description,
      dueDate: C.tomorrow(),
      priority: a.priority,
      groupIds: a.groupId ? [a.groupId] : [],
      memberIds: []
    });
    if (collab.loading) return React.createElement("div", {
      className: "co-workspace co-stack"
    }, React.createElement("div", {
      className: "co-loading"
    }), React.createElement("div", {
      className: "co-loading"
    }), React.createElement("p", {
      className: "co-muted"
    }, "\u6B63\u5728\u9023\u63A5\u5354\u4F5C\u5DE5\u4F5C\u5340\u2026"));
    if (!collab.account) return React.createElement("div", {
      className: "co-workspace co-card"
    }, React.createElement(Empty, {
      title: "\u7FA4\u7D44\u5354\u4F5C\u672A\u80FD\u9023\u63A5"
    }, collab.error || '正在準備帳戶資料。'), React.createElement("div", {
      className: "co-actions"
    }, React.createElement(Button, {
      primary: true,
      onClick: collab.retry
    }, "\u91CD\u65B0\u9023\u63A5"), React.createElement(Button, {
      onClick: onLegacy
    }, "\u539F\u6709\u73ED\u7D1A")));
    const list = collab.groups.filter(g => {
      var _collab$preferences$g;
      return !!((_collab$preferences$g = collab.preferences[g.id]) !== null && _collab$preferences$g !== void 0 && _collab$preferences$g.archived) === archived && g.name.toLowerCase().includes(search.toLowerCase());
    }).sort((a, b) => {
      var _collab$preferences$b, _collab$preferences$a;
      return Number(!!((_collab$preferences$b = collab.preferences[b.id]) !== null && _collab$preferences$b !== void 0 && _collab$preferences$b.pinned)) - Number(!!((_collab$preferences$a = collab.preferences[a.id]) !== null && _collab$preferences$a !== void 0 && _collab$preferences$a.pinned)) || b.createdAt - a.createdAt;
    });
    return React.createElement("div", {
      className: "co-workspace"
    }, React.createElement("div", {
      className: "co-tabs",
      role: "tablist",
      "aria-label": "\u5354\u4F5C\u5DE5\u4F5C\u5340"
    }, [['groups', '群組'], ['inbox', '收件匣'], ['issued', '我發放的'], ['account', '我的編號'], ...(admin ? [['admin', '總管理']] : [])].map(_ref22 => {
      let _ref23 = _slicedToArray(_ref22, 2),
        k = _ref23[0],
        l = _ref23[1];
      return React.createElement("button", {
        role: "tab",
        key: k,
        "aria-selected": tab === k,
        onClick: () => {
          setTab(k);
          setSelected('');
        }
      }, l, k === 'inbox' && collab.unread > 0 && React.createElement("span", {
        className: "co-badge"
      }, collab.unread));
    })), collab.error && React.createElement("div", {
      className: "co-notice error",
      style: {
        marginBottom: '1rem'
      }
    }, collab.error, " ", React.createElement(Button, {
      onClick: collab.retry
    }, "\u91CD\u8A66")), tab === 'groups' && (group ? React.createElement(GroupDetail, {
      key: group.id,
      group: group,
      collab: collab,
      items: items,
      subjects: subjects,
      notify: notify,
      onBack: () => setSelected(''),
      onCompose: compose,
      onForm: (mode, g) => setModal({
        mode,
        group: g
      }),
      onConfirm: onConfirm,
      onReport: (type, id) => setReport({
        type,
        id
      })
    }) : React.createElement("div", {
      className: "co-stack"
    }, React.createElement("div", {
      className: "co-header"
    }, React.createElement("div", null, React.createElement("div", {
      className: "co-kicker"
    }, "StudyOS 3.1.0"), React.createElement("h2", null, "\u4E00\u8D77\u6574\u7406\uFF0C\u5404\u81EA\u5B8C\u6210\u3002"), React.createElement("p", {
      className: "co-muted"
    }, "\u6BCF\u500B\u4EBA\u90FD\u53EF\u4EE5\u767C\u653E\uFF0C\u529F\u8AB2\u8207\u9032\u5EA6\u5404\u81EA\u7BA1\u7406\u3002")), React.createElement("div", {
      className: "co-actions"
    }, React.createElement(Button, {
      onClick: () => setModal({
        mode: 'join'
      })
    }, React.createElement(Icon, {
      name: "user-plus"
    }), "\u52A0\u5165\u7FA4\u7D44"), React.createElement(Button, {
      primary: true,
      disabled: collab.account.canPublish === false || collab.account.disabled,
      onClick: () => setModal({
        mode: 'create'
      })
    }, React.createElement(Icon, {
      name: "plus"
    }), "\u5EFA\u7ACB\u7FA4\u7D44"))), React.createElement("div", {
      className: "co-row co-wrap"
    }, React.createElement("input", {
      className: "co-input",
      style: {
        flex: 1,
        minWidth: 140
      },
      "aria-label": "\u641C\u5C0B\u7FA4\u7D44",
      placeholder: "\u641C\u5C0B\u7FA4\u7D44\u2026",
      value: search,
      onChange: e => setSearch(e.target.value)
    }), React.createElement(Button, {
      onClick: () => setArchived(x => !x)
    }, archived ? '顯示使用中' : '已封存'), React.createElement(Button, {
      ghost: true,
      onClick: onLegacy
    }, "\u539F\u6709\u73ED\u7D1A")), !list.length && React.createElement(Empty, {
      title: archived ? '沒有封存群組' : '未有群組'
    }, "\u5EFA\u7ACB\u7FA4\u7D44\uFF0C\u6216\u8005\u8F38\u5165\u7FA4\u7D44\u7DE8\u865F\u7533\u8ACB\u52A0\u5165\u3002"), React.createElement("div", {
      className: "co-grid"
    }, list.map(g => {
      var _collab$preferences$g2, _collab$preferences$g3, _collab$preferences$g4;
      return React.createElement("article", {
        className: "co-card co-group-card",
        key: g.id
      }, React.createElement("div", {
        className: "co-row"
      }, React.createElement("span", {
        className: "co-avatar"
      }, g.name.slice(0, 1)), React.createElement("div", null, React.createElement("h3", null, g.name), React.createElement("div", {
        className: "co-muted"
      }, g.members.length, " \u4F4D\u6210\u54E1 \xB7 ", g.ownerUid === user.uid ? '群主' : g.managers.includes(user.uid) ? '管理員' : '成員'))), React.createElement("p", {
        className: "co-muted"
      }, g.description || '功課、測驗及班內通知集中一處。'), React.createElement("div", {
        className: "co-row co-wrap"
      }, React.createElement("span", {
        className: `co-chip ${(_collab$preferences$g2 = collab.preferences[g.id]) !== null && _collab$preferences$g2 !== void 0 && _collab$preferences$g2.sync ? 'good' : ''}`
      }, (_collab$preferences$g3 = collab.preferences[g.id]) !== null && _collab$preferences$g3 !== void 0 && _collab$preferences$g3.sync ? '同步已開' : '只在群組顯示'), ((_collab$preferences$g4 = collab.preferences[g.id]) === null || _collab$preferences$g4 === void 0 ? void 0 : _collab$preferences$g4.pinned) && React.createElement("span", {
        className: "co-chip"
      }, "\u5DF2\u7F6E\u9802"), g.state === 'frozen' && React.createElement("span", {
        className: "co-chip warn"
      }, "\u5DF2\u51CD\u7D50")), React.createElement("div", {
        className: "co-actions"
      }, React.createElement(Button, {
        primary: true,
        onClick: () => setSelected(g.id)
      }, "\u958B\u555F\u7FA4\u7D44", React.createElement(Icon, {
        name: "arrow-right"
      }))));
    })))), tab === 'inbox' && React.createElement(Inbox, {
      collab: collab,
      notify: notify,
      onGroup: gid => {
        setSelected(gid);
        setTab('groups');
      },
      onConfirm: onConfirm
    }), tab === 'issued' && React.createElement("div", {
      className: "co-stack"
    }, React.createElement("div", {
      className: "co-header"
    }, React.createElement("div", null, React.createElement("h2", null, "\u6211\u767C\u653E\u7684"), React.createElement("p", {
      className: "co-muted"
    }, "\u8349\u7A3F\u3001\u5DF2\u767C\u653E\u3001\u4FEE\u6539\u53CA\u64A4\u56DE\uFF0C\u96C6\u4E2D\u7BA1\u7406\u3002")), React.createElement(Button, {
      primary: true,
      disabled: collab.account.canPublish === false || collab.account.disabled,
      onClick: () => {
        let draft = {};
        try {
          draft = JSON.parse(sessionStorage.getItem(`studyos-compose-${collab.account.uid}`) || '{}');
        } catch (e) {}
        compose(draft);
      }
    }, React.createElement(Icon, {
      name: "send"
    }), "\u65B0\u589E\u767C\u653E")), collab.drafts.length > 0 && React.createElement(React.Fragment, null, React.createElement("h3", null, "\u8349\u7A3F"), React.createElement("div", {
      className: "co-grid"
    }, collab.drafts.map(d => React.createElement("div", {
      className: "co-card",
      key: d.id
    }, React.createElement("p", {
      className: "co-description"
    }, d.description || '未命名草稿'), React.createElement("p", {
      className: "co-muted"
    }, d.subject, " \xB7 ", d.dueDate), React.createElement("div", {
      className: "co-actions"
    }, React.createElement(Button, {
      onClick: () => compose({
        ...d,
        draftId: d.id
      })
    }, "\u7E7C\u7E8C\u7DE8\u8F2F"), React.createElement(Button, {
      danger: true,
      disabled: busy,
      onClick: () => onConfirm('刪除此草稿？', () => run(() => collab.removeDraft(d.id), '草稿已刪除'))
    }, "\u522A\u9664"))))), React.createElement("hr", {
      className: "co-divider"
    })), !collab.issued.length && React.createElement(Empty, {
      title: "\u9084\u672A\u767C\u653E\u9805\u76EE"
    }, "\u53EF\u4EE5\u5411\u7FA4\u7D44\u767C\u653E\uFF0C\u6216\u7528\u4E94\u4F4D\u5E33\u6236\u7DE8\u865F\u9080\u8ACB\u63A5\u6536\u3002"), collab.issued.map(a => React.createElement(SourceCard, {
      key: a.id,
      task: a,
      issuer: true,
      collab: collab,
      notify: notify,
      onEdit: x => compose({
        ...x,
        editId: x.id
      }),
      onDuplicate: duplicate,
      onConfirm: onConfirm
    })), React.createElement("p", {
      className: "co-muted"
    }, "\u986F\u793A\u6700\u8FD1 100 \u9805\u767C\u653E\u3002")), tab === 'account' && React.createElement("div", {
      className: "co-two"
    }, React.createElement(AccountCard, {
      collab: collab,
      notify: notify
    }), React.createElement("div", {
      className: "co-card co-stack"
    }, React.createElement("h3", null, "\u5C01\u9396\u6E05\u55AE"), !collab.account.blocked.length && React.createElement("p", {
      className: "co-muted"
    }, "\u66AB\u6642\u6C92\u6709\u5C01\u9396\u5E33\u6236\u3002"), collab.account.blocked.map(uid => React.createElement("div", {
      className: "co-row co-between",
      key: uid
    }, React.createElement("span", {
      className: "co-muted"
    }, "\u5E33\u6236 ", uid.slice(0, 8), "\u2026"), React.createElement(Button, {
      disabled: busy,
      onClick: () => run(() => collab.api('block', {
        uid,
        blocked: false
      }), '已解除封鎖')
    }, "\u89E3\u9664\u5C01\u9396"))))), tab === 'admin' && admin && React.createElement(Admin, {
      collab: collab,
      notify: notify,
      onConfirm: onConfirm
    }), modal && React.createElement(GroupForm, _extends({}, modal, {
      collab: collab,
      notify: notify,
      onClose: () => setModal(null)
    })), composer && React.createElement(Composer, {
      collab: collab,
      subjects: subjects,
      initial: composer,
      notify: notify,
      onClose: () => setComposer(null)
    }), report && React.createElement(Report, {
      collab: collab,
      target: report,
      notify: notify,
      onClose: () => setReport(null)
    }));
  }
  window.StudyCollabUI = {
    useCollaboration,
    Workspace,
    AccountCard,
    PersonalNote,
    Dialog
  };
})();