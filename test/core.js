/* StudyOS 3.1.0: shared, dependency-free domain rules (browser + server). */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudyCore = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const KINDS = ['homework', 'assessment', 'notice', 'activity', 'revision'];
  const LABELS = {homework: '功課', assessment: '測驗', notice: '公告', activity: '活動', revision: '溫習'};
  function dateKey(value) {
    if (!value) return '';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = value?.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(d.getTime()) ? '' : `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function validDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(`${s}T12:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === s;
  }
  function tomorrow(now = new Date()) { const d = new Date(now); d.setDate(d.getDate()+1); return dateKey(d); }
  function visible(i) { return !i.isHidden && !i.withdrawn && !i.forceExpired; }
  function counts(items, now = new Date()) {
    const today = dateKey(now), next = tomorrow(now);
    const list = items.filter(i => visible(i) && i.type === 'homework');
    const forDay = day => {
      const all = list.filter(i => dateKey(i.dueDate) === day);
      return {pending: all.filter(i => !i.completed).length, total: all.length, completed: all.filter(i => i.completed).length};
    };
    return {today: forDay(today), tomorrow: forDay(next)};
  }
  function cleanText(v, min, max, label) {
    const s = typeof v === 'string' ? v.trim() : '';
    if (s.length < min || s.length > max) throw new Error(`${label}須為 ${min}–${max} 個字`);
    return s;
  }
  function payload(data) {
    if (!KINDS.includes(data.kind)) throw new Error('請選擇有效類型');
    if (!validDate(data.dueDate)) throw new Error('請選擇有效日期');
    if (!['low','normal','high'].includes(data.priority)) throw new Error('請選擇有效優先次序');
    return {kind: data.kind, type: data.kind === 'homework' ? 'homework' : 'assessment',
      subject: cleanText(data.subject, 1, 40, '科目'), description: cleanText(data.description, 1, 2000, '內容'),
      dueDate: data.dueDate, priority: data.priority};
  }
  function project(source, previous, now) {
    const changed = !!previous && source.version > (previous.sourceVersion || 0);
    return {...previous, type: source.type, sourceKind: source.kind, subject: source.subject,
      description: source.description, dueDate: source.dueDate, priority: source.priority,
      collabRefId: source.id, sourceGroupId: source.groupId || '', sourceGroupName: source.groupName || '私人發放',
      senderName: source.authorName, sourceVersion: source.version, sourceUpdatedAt: source.updatedAt,
      completed: previous?.completed === true, completedAt: previous?.completedAt || null,
      privateNote: previous?.privateNote || '', isHidden: previous?.isHidden === true,
      createdAt: previous?.createdAt || new Date(now).toISOString(),
      changedAfterCompletion: !!(previous?.changedAfterCompletion || (changed && previous?.completed)),
      withdrawn: source.state === 'withdrawn', forceExpired: source.state === 'withdrawn'};
  }
  function canManage(group, uid) { return group.ownerUid === uid || group.managers.includes(uid); }
  function canPublish(group, uid) { return group.state === 'active' && group.members.includes(uid) && (canManage(group, uid) || group.allowMemberPublish); }
  function shouldSync(source, pref, existing) {
    if (existing) return true;
    return source.kind !== 'notice' && source.state === 'active' && pref?.sync === true && source.createdAt >= (pref.since || 0);
  }
  return {KINDS, LABELS, dateKey, validDate, tomorrow, visible, counts, cleanText, payload, project, canManage, canPublish, shouldSync};
});
