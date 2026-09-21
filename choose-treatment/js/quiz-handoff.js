/*
 * quiz-handoff.js — what the questionnaire (questionnaire/step1–16) tells this page.
 *
 * Loaded by v2.html BEFORE checkout.js. With no quiz record in localStorage it does nothing at
 * all, so v2.html opened on its own renders exactly as before (DOM diff vs the pre-quiz build = 0).
 *
 *  1. Guard: a visitor the screening turned away (dq_enforced) is sent back to the quiz's
 *     "closer look" page instead of being offered a plan.
 *  2. Preselect: someone who told step 6 they have taken Tirzepatide / Semaglutide gets that
 *     treatment selected in the phone "Select Treatment" step. checkout.js reads
 *     window.CHIME_CT_PRESELECT at mount — state only, no scroll, desktop unchanged.
 *  3. The quiz record's key is exposed for the payment step (not built) as CHIME_CT_QUIZ_KEY.
 */
(function (root) {
  'use strict';
  var KEY = 'chime_funnel';
  var TREATMENT_ID = { tirzepatide: 'injectable-tirzepatide', semaglutide: 'injectable-semaglutide' };

  function read(storage) {
    try { return JSON.parse(storage.getItem(KEY)) || null; } catch (e) { return null; }
  }
  function decide(record) {
    if (!record || typeof record !== 'object') return { redirect: null, preselect: null };
    if (record.dq_enforced === true) return { redirect: 'questionnaire/disqualified.html', preselect: null };
    return { redirect: null, preselect: TREATMENT_ID[record.glp1_history] || null };
  }

  if (typeof module !== 'undefined' && module.exports) { module.exports = { decide: decide, KEY: KEY }; return; }

  var record = read(root.localStorage);
  if (!record) return;
  var d = decide(record);
  if (d.redirect) { root.location.replace(d.redirect); return; }
  if (d.preselect) root.CHIME_CT_PRESELECT = d.preselect;
  root.CHIME_CT_QUIZ_KEY = KEY;
})(typeof window !== 'undefined' ? window : this);
