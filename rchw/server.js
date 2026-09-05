'use strict';
const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {createService} = require('./service');
initializeApp();
const service = createService(getFirestore());
// No privileged client write paths. Identity, quotas and membership are checked in every transaction.
exports.studyCollab = onCall({region: 'asia-east2', maxInstances: 5, timeoutSeconds: 120, memory: '256MiB'}, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', '請先登入');
  try {
    return await service(request.auth, request.data);
  } catch (e) {
    if (e instanceof HttpsError) throw e;
    if (e.publicCode) throw new HttpsError(e.publicCode, e.message);
    console.error('studyCollab failed', {action: request.data?.action, code: e.code, message: e.message});
    throw new HttpsError('internal', '暫時未能完成，請稍後重試');
  }
});
