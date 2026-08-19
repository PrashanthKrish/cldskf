// Optus Conversational AI Demo — application logic.
// Vanilla JS, no build step, no backend, no network calls. Deterministic simulation
// grounded entirely in ./data.js (see optus-uc1-prd.md for the source spec).
import { DATA } from './data.js';

/* ------------------------------------------------------------------ state */
function initialState(){
  return {
    stage: 0,
    route: '/',
    drawer: null,           // {panel:'ticket'|'topup'|'offer'}
    pinModal: null,         // {digits:'', error:null, warned:false}
    reviewMode: false,
    callRevealed: 0,        // index into stage1+stage2 combined
    deskTurns: DATA.conversation.stage4.concat(DATA.conversation.stage5),
    deskRevealed: 0,
    declined: false,
    auth: { nameConfirmed:false, pinVerified:false, failedAttempts:0 },
    diagnostics: { status:'idle', completedStepIds:[], expandedStep:null },
    ribbonMode: 'dim',
    sentiment: 'frustrated',
    captured: new Set(),
    ticket: { created:false, id:null, impact:null, priority:null },
    topup: { applied:false },
    coverageGapConfirmed: false,
    offer: { status:'locked', complianceTicked:new Set(), added:false, declined:false },
    handoffView: 'agent',
    valueTab: 0,
    agentsFilter: { suite:null, usedOnly:false },
    agentDrawerId: null,
    callTimerFrozen: false,
    toasts: [],
    _toastSeq: 0
  };
}
let state = initialState();

/* --------------------------------------------------------------- helpers */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function callTurns(){ return DATA.conversation.stage1.concat(DATA.conversation.stage2); }

function attrById(id){ return DATA.dataAttributes.find(a => a.id === id); }
function agentById(id){ return DATA.tcsAgents.find(a => a.id === id); }
function sopById(id){ return DATA.knowledge.sops.find(s => s.id === id); }

function captureAttrs(turn){
  (turn.attributesCaptured || []).forEach(id => state.captured.add(id));
  if (turn.sentimentAfter) state.sentiment = turn.sentimentAfter;
}

function toast(message, tone='default'){
  const id = ++state._toastSeq;
  state.toasts.push({ id, message, tone });
  renderToasts();
  setTimeout(() => {
    state.toasts = state.toasts.filter(t => t.id !== id);
    renderToasts();
  }, 4000);
}

function offerGateMet(){
  return state.ticket.created && state.topup.applied && state.coverageGapConfirmed;
}
function offerAddable(){
  const required = DATA.offers.smartWifiBooster.compliance.filter(c => c.required).map(c => c.id);
  return offerGateMet() && required.every(id => state.offer.complianceTicked.has(id));
}

/* ------------------------------------------------------------------ nav */
const STAGE_MIN_ROUTE = {
  '/': 0, '/overview': 0, '/call': 1, '/diagnostics': 2, '/handoff': 3,
  '/agent-desktop': 4, '/outcome': 6, '/value': 0, '/agents': 0
};
function routeForStage(){
  return { 0:'/', 1:'/call', 2:'/call', 3:'/handoff', 4:'/agent-desktop', 5:'/agent-desktop', 6:'/outcome' }[state.stage] || '/';
}

function navigate(route, opts={}){
  const min = STAGE_MIN_ROUTE[route] ?? 0;
  if (route === '/outcome' ? state.stage < 6 : state.stage < min){
    toast('That part of the demo hasn’t been reached yet.');
    route = routeForStage();
  }
  state.route = route;
  if (!opts.keepReview) state.reviewMode = opts.review ? true : false;
  render();
}

/* -------------------------------------------------------- conversation engine */
function revealCall(count){
  const turns = callTurns();
  const target = Math.min(turns.length, state.callRevealed + count);
  for (let i = state.callRevealed; i < target; i++) captureAttrs(turns[i]);
  state.callRevealed = target;
}
function revealDesk(count){
  const turns = state.deskTurns;
  const target = Math.min(turns.length, state.deskRevealed + count);
  for (let i = state.deskRevealed; i < target; i++) captureAttrs(turns[i]);
  state.deskRevealed = target;
}

function callFooterState(){
  const turns = callTurns();
  const n = state.callRevealed;
  if (n === 0) return { kind:'empty' };
  const last = turns[n-1];
  if (last.gate) return { kind:'gate', gate: last.gate };
  if (n >= turns.length) return { kind:'end' };
  return { kind:'next' };
}
function deskFooterState(){
  const turns = state.deskTurns;
  const n = state.deskRevealed;
  if (n === 0) return { kind:'empty' };
  const last = turns[n-1];
  if (last.gate) return { kind:'gate', gate: last.gate };
  if (n >= turns.length) return { kind:'end' };
  return { kind:'next' };
}

function handleCallGate(buttonId){
  switch(buttonId){
    case 'btn-confirm-name':
      state.auth.nameConfirmed = true;
      revealCall(1); // t04
      render();
      break;
    case 'btn-enter-pin':
      state.pinModal = { digits:'', error:null, warned:false };
      render();
      break;
    case 'btn-run-diagnostics':
      state.stage = 2;
      navigate('/diagnostics');
      break;
    case 'btn-explain-refresh':
      revealCall(2); // t12, t13
      render();
      break;
    case 'btn-check-topup-eligibility':
      state.ribbonMode = 'partially-resolved';
      revealCall(1); // t16
      render();
      break;
    case 'btn-transfer-specialist':
      state.stage = 3;
      navigate('/handoff');
      break;
  }
}
function handleDeskGate(buttonId){
  switch(buttonId){
    case 'btn-create-ticket':
      state.drawer = { panel:'ticket', impact: DATA.ticketTemplate.impactOptions[1], priority: DATA.ticketTemplate.priorityOptions[1] };
      render();
      break;
    case 'btn-apply-topup':
      state.drawer = { panel:'topup' };
      render();
      break;
    case 'btn-log-coverage-gap':
      state.coverageGapConfirmed = true;
      revealDesk(2); // t25, t26
      render();
      break;
    case 'btn-open-offer':
      if (!offerGateMet()) return;
      revealDesk(4); // t32-t35
      state.drawer = { panel:'offer' };
      render();
      break;
    case 'btn-wrap-call':
      state.stage = 6;
      state.callTimerFrozen = true;
      navigate('/outcome');
      break;
  }
}

/* ------------------------------------------------------------------ actions */
const Actions = {
  'btn-start-demo'(){ state.stage = 1; if(state.callRevealed===0) revealCall(2); navigate('/call'); },
  'btn-view-brief'(){ navigate('/overview'); },
  'btn-view-agents'(){ navigate('/agents'); },
  'btn-brief-start'(){ state.stage = Math.max(state.stage,1); if(state.callRevealed===0) revealCall(2); navigate('/call'); },
  'btn-brief-back'(){ navigate('/'); },
  'btn-reset'(){
    if (window.confirm('Reset the whole demo? All progress will be cleared.')) {
      state = initialState();
      render();
    }
  },
  'btn-advance-turn'(){ revealCall(1); render(); },
  'btn-desk-advance'(){ revealDesk(1); render(); },
  'btn-run-diagnostics-console'(){ startDiagnostics(); },
  'btn-diag-skip'(){ skipDiagnostics(); },
  'btn-diag-back-to-call'(){
    if (state.diagnostics.status !== 'complete') return;
    revealCall(3); // t09, t10, t11
    navigate('/call');
  },
  'btn-handoff-transfer'(){
    state.stage = 4;
    toast('Connecting to Daniel…');
    setTimeout(() => { navigate('/agent-desktop'); if(state.deskRevealed===0) revealDesk(2); render(); }, 900);
  },
  'btn-handoff-copy'(){ copyHandoff(); },
  'toggle-handoff-view'(view){ state.handoffView = view; render(); },
  'btn-handoff-back'(){ navigate('/call', { review:true }); },
  'btn-outcome-value'(){ navigate('/value'); },
  'btn-outcome-agents'(){ navigate('/agents'); },
  'btn-outcome-replay'(){
    if (window.confirm('Restart the whole demo from the beginning?')) { state = initialState(); render(); }
  },
  'btn-value-agents'(){ navigate('/agents'); },
  'btn-agents-restart'(){
    if (window.confirm('Restart the whole demo from the beginning?')) { state = initialState(); render(); }
  },
  'btn-return-current'(){ navigate(routeForStage(), { keepReview:false }); state.reviewMode=false; render(); },
};

function bindAction(name, ...args){
  if (Actions[name]) return Actions[name](...args);
}

/* ------------------------------------------------------------------ diagnostics */
function startDiagnostics(){
  if (state.diagnostics.status === 'running') return;
  state.diagnostics = { status:'running', completedStepIds:[], expandedStep:null };
  render();
  runStepsFrom(0);
}
function runStepsFrom(i){
  const steps = DATA.diagnostics.steps;
  if (state.diagnostics.status !== 'running') return;
  if (i >= steps.length){
    state.diagnostics.status = 'complete';
    state.ribbonMode = 'analysed';
    render();
    return;
  }
  const step = steps[i];
  render(); // show as running
  state._diagTimer = setTimeout(() => {
    if (state.diagnostics.status !== 'running') return;
    state.diagnostics.completedStepIds.push(step.id);
    (step.attributesCaptured||[]).forEach(a => state.captured.add(a));
    runStepsFrom(i+1);
  }, Math.min(step.durationMs, 1400)); // keep the live pacing snappy; d5's "~20s" story is told via caption, not a real wait
}
function skipDiagnostics(){
  clearTimeout(state._diagTimer);
  state.diagnostics.completedStepIds = DATA.diagnostics.steps.map(s => s.id);
  DATA.diagnostics.steps.forEach(s => (s.attributesCaptured||[]).forEach(a => state.captured.add(a)));
  state.diagnostics.status = 'complete';
  state.ribbonMode = 'analysed';
  render();
}

/* ------------------------------------------------------------------ drawers */
function closeDrawer(){ state.drawer = null; render(); }

function submitTicket(){
  const d = state.drawer;
  state.ticket = { created:true, id: DATA.ticketTemplate.id, impact: d.impact, priority: d.priority };
  toast(`Ticket ${DATA.ticketTemplate.id} created`);
  closeDrawer();
  revealDesk(1); // t20
  render();
}
function submitTopup(){
  state.topup = { applied:true, reference: DATA.topup.reference };
  toast(`Temporary data top-up applied · ${DATA.topup.reference}`);
  closeDrawer();
  revealDesk(3); // t21,t22,t23
  render();
}
function toggleCompliance(id){
  if (state.offer.complianceTicked.has(id)) state.offer.complianceTicked.delete(id);
  else state.offer.complianceTicked.add(id);
  render();
}
function submitOfferAdd(){
  if (!offerAddable()) return;
  state.offer.status = 'added'; state.offer.added = true;
  toast('Smart WiFi Booster added — confirmation on its way');
  closeDrawer();
  revealDesk(4); // t36-t39
  render();
}
function submitOfferDecline(){
  state.offer.status = 'declined'; state.offer.declined = true;
  // splice the decline branch in place of the tail (t36-t39)
  state.deskTurns = state.deskTurns.slice(0, state.deskRevealed).concat(DATA.conversation.stage5Decline);
  closeDrawer();
  revealDesk(3);
  render();
}

function copyHandoff(){
  const h = DATA.handoff;
  const text = [
    `Customer identity: ${h.customerIdentity}`,
    `Reason for call: ${h.reasonForCall}`,
    `Sentiment: ${h.sentiment}`,
    `Diagnostics completed: ${h.diagnosticsCompleted.join('; ')}`,
    `Findings: ${h.findings.join('; ')}`,
    `Escalation reason: ${h.escalationReason}`,
    `Recommended next best actions: ${h.nextBestActions.map(a=>a.text).join('; ')}`,
    `Product insight: ${h.productInsight} (${h.productInsightCondition})`
  ].join('\n');
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>toast('Summary copied')).catch(()=>fallbackCopy(text));
  } else fallbackCopy(text);
}
function fallbackCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); toast('Summary copied'); } catch(e){}
  document.body.removeChild(ta);
}

/* ------------------------------------------------------------------ agent drawer */
function openAgentDrawer(id){
  state.agentDrawerId = id;
  navigate('/agents', { keepReview: state.reviewMode });
}

/* ============================================================ RENDER: shared bits */
function personaBadge(kind){
  const map = {
    customer: ['Priya Sharma', 'customer'], ai: ['Olivia · AI agent', 'ai'],
    human: ['Daniel · Care specialist', 'human'], assist: ['Agent Assist', 'assist']
  };
  return map[kind];
}

function renderTopBar(){
  const nodes = [1,2,3,4,5].map(n => {
    const cls = state.stage > n || (state.stage===6 && n<=5) ? 'done' : (mapStageDisplay(state.stage)===n ? 'current' : '');
    const label = ['Greeting & auth','AI diagnostics','Handoff','Agent desktop','Assisted sale'][n-1];
    return `<button class="stage-node ${cls}" data-stage-node="${n}" ${cls==='done'?'':'tabindex="-1"'}>
      <span class="dot"></span>${label}
    </button>`;
  }).join('');
  return `
  <div class="topbar">
    <div class="lockup"><span class="mark"></span>TCS <span class="x">×</span> Optus <span class="title">&nbsp;Conversational AI Demo</span></div>
    <div class="stage-rail">${nodes}</div>
    <div class="topbar-actions">
      <button class="btn btn-secondary btn-sm" id="btn-reset" data-act="btn-reset">Reset demo</button>
    </div>
  </div>`;
}
function mapStageDisplay(stage){ return stage===0?1:(stage===6?5:stage); }

function renderToasts(){
  const root = document.getElementById('toast-root');
  if (!root) return;
  root.innerHTML = state.toasts.map(t => `<div class="toast ${t.tone==='warn'?'tone-warn':''}">${esc(t.message)}</div>`).join('');
}

function ribbonHtml(mode){
  const hourly = DATA.telemetry.hourly;
  const ticks = hourly.map(h => {
    const dropout = h.dropout;
    const heightPct = mode==='dim' ? 20 : Math.max(8, Math.min(96, (h.snrMarginDb/20)*100));
    return `<div class="ribbon-tick ${dropout?'dropout':'ok'}" style="height:${heightPct}%" data-tip="${esc(h.hour)} · ${dropout?'dropout':'stable'} · ${h.snrMarginDb} dB SNR margin${h.note?' · '+esc(h.note):''}"></div>`;
  }).join('');
  const corrected = mode === 'partially-resolved'
    ? `<div class="ribbon-corrected-band">Provisioning mismatch corrected — line instability still open</div>` : '';
  const statusText = {
    dim: 'Awaiting diagnostics', scanning: 'Scanning line telemetry…',
    analysed: 'Diagnostics complete', 'partially-resolved': 'Partially resolved — 6 dropouts still open'
  }[mode];
  return `
  <div class="ribbon ${mode}">
    <div class="ribbon-head">
      <span class="eyebrow">Signal ribbon · last 24 hours</span>
      <span class="status ${mode==='partially-resolved'?'':''}" style="color:${mode==='partially-resolved'?'var(--fault)':'var(--ink-soft)'}">${statusText}</span>
    </div>
    <div class="ribbon-track" style="position:relative">${ticks}${corrected}</div>
  </div>`;
}

function agentBadge(agentId){
  const a = agentById(agentId);
  if (!a) return `<span class="agent-badge">Unattributed agent</span>`;
  return `<button class="agent-badge" data-act="open-agent" data-agent="${agentId}" title="${esc(a.availability)}"><span class="cloud">☁</span>${esc(a.name)}</button>`;
}

function bubbleWithEmphasis(text, emphasis){
  if (!emphasis || !emphasis.length) return esc(text);
  let out = esc(text);
  emphasis.forEach(frag => {
    const e = esc(frag);
    out = out.split(e).join(`<strong class="critical">${e}</strong>`);
  });
  return out;
}

function personaBubbleHtml(turn){
  const side = turn.speaker === 'customer' ? 'left' : 'right';
  const cls = turn.speaker;
  const [name] = personaBadge(turn.speaker);
  return `
  <div class="turn-row side-${side}">
    <div class="bubble-col">
      <div class="speaker-chip ${cls}">${esc(name)}</div>
      <div class="bubble ${cls}">${bubbleWithEmphasis(turn.text, turn.emphasis)}</div>
    </div>
  </div>`;
}

const ASSIST_KIND_LABEL = {
  recommendation: 'Recommendation', nextBestAction: 'Next best action', knowledge: 'Knowledge',
  productInsight: 'Product insight', compliance: 'Compliance', clarification: 'Clarification'
};
function assistCardHtml(turn){
  return `
  <div class="assist-card">
    <div class="head">
      <span class="kind">${ASSIST_KIND_LABEL[turn.assistKind] || 'Assist'}</span>
      <span class="agent-only">\u{1F441}‍\u{1F5E8} visible to agent only</span>
    </div>
    <p>${bubbleWithEmphasis(turn.text, turn.emphasis)}</p>
    <div class="foot">${turn.agentId ? agentBadge(turn.agentId) : ''}</div>
  </div>`;
}

function drawerHtml(){
  if (!state.drawer) return '';
  if (state.drawer.panel === 'ticket') return ticketDrawerHtml();
  if (state.drawer.panel === 'topup') return topupDrawerHtml();
  if (state.drawer.panel === 'offer') return offerDrawerHtml();
  return '';
}
function ticketDrawerHtml(){
  const t = DATA.ticketTemplate; const d = state.drawer;
  return `
  <div class="drawer-overlay" data-act="close-drawer"></div>
  <div class="drawer" role="dialog" aria-modal="true">
    <div class="drawer-head"><h3>Network investigation ticket</h3><button class="icon-btn" data-act="close-drawer">✕</button></div>
    <div class="drawer-body">
      <p class="muted" style="font-size:13.5px">${esc(t.description)}</p>
      <hr class="hairline"/>
      <label class="eyebrow">Impact</label>
      <select id="ticket-impact" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--rule);margin:6px 0 16px;font-size:14px;">
        ${t.impactOptions.map(o=>`<option ${o===d.impact?'selected':''}>${esc(o)}</option>`).join('')}
      </select>
      <label class="eyebrow">Priority</label>
      <select id="ticket-priority" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--rule);margin:6px 0 16px;font-size:14px;">
        ${t.priorityOptions.map(o=>`<option ${o===d.priority?'selected':''}>${esc(o)}</option>`).join('')}
      </select>
      <div class="data-chip" style="margin-bottom:8px;"><span class="k">SLA window</span><span class="v" style="font-family:inherit;font-weight:400">${esc(t.slaWindow)}</span></div>
      <div class="data-chip"><span class="k">Callback note</span><span class="v" style="font-family:inherit;font-weight:400">${esc(t.callbackNote)}</span></div>
    </div>
    <div class="drawer-foot">
      <button class="btn btn-secondary" data-act="close-drawer">Cancel</button>
      <button class="btn btn-primary" id="btn-ticket-submit" data-act="submit-ticket">Create ticket</button>
    </div>
  </div>`;
}
function topupDrawerHtml(){
  const e = DATA.eligibility.mobileTopup;
  return `
  <div class="drawer-overlay" data-act="close-drawer"></div>
  <div class="drawer" role="dialog" aria-modal="true">
    <div class="drawer-head"><h3>Temporary mobile data top-up</h3><button class="icon-btn" data-act="close-drawer">✕</button></div>
    <div class="drawer-body">
      <div class="data-chip" style="margin-bottom:8px;"><span class="k">Allowance</span><span class="v" style="font-family:inherit">${esc(e.allowance)}</span></div>
      <div class="data-chip" style="margin-bottom:8px;"><span class="k">Duration</span><span class="v" style="font-family:inherit">${e.durationDays} days</span></div>
      <div class="data-chip" style="margin-bottom:8px;"><span class="k">Cost</span><span class="v" style="font-family:inherit">${esc(e.cost)}</span></div>
      <div class="data-chip"><span class="k">Basis</span><span class="v" style="font-family:inherit;font-weight:400">${esc(e.basis)}</span></div>
    </div>
    <div class="drawer-foot">
      <button class="btn btn-secondary" data-act="close-drawer">Cancel</button>
      <button class="btn btn-primary" id="btn-topup-submit" data-act="submit-topup">Apply data top-up</button>
    </div>
  </div>`;
}
function offerDrawerHtml(){
  const o = DATA.offers.smartWifiBooster;
  const ticked = state.offer.complianceTicked;
  const addable = offerAddable();
  return `
  <div class="drawer-overlay" data-act="close-drawer"></div>
  <div class="drawer" role="dialog" aria-modal="true">
    <div class="drawer-head"><h3>${esc(o.name)}</h3><button class="icon-btn" data-act="close-drawer">✕</button></div>
    <div class="drawer-body">
      <p style="font-size:13.5px">${esc(o.what)}</p>
      <p style="font-size:13.5px" class="critical">${esc(o.whatItIsNot)}</p>
      <div class="data-chip" style="margin:10px 0 6px;"><span class="k">Charge</span><span class="v">A$${o.monthlyCharge.toFixed(2)}/mo</span></div>
      <div class="data-chip" style="margin-bottom:6px;"><span class="k">Term</span><span class="v" style="font-family:inherit">${esc(o.contractTerm)}</span></div>
      <div class="data-chip" style="margin-bottom:6px;"><span class="k">Cancellation</span><span class="v" style="font-family:inherit">${esc(o.cancellation)}</span></div>
      <div class="data-chip"><span class="k">Setup</span><span class="v" style="font-family:inherit">${esc(o.setup)}</span></div>
      <hr class="hairline"/>
      <div class="section-heading" style="font-size:14px;">Suitability check</div>
      ${o.suitability.map(s=>`<div style="display:flex;justify-content:space-between;font-size:13px;padding:5px 0;border-bottom:1px solid var(--rule)"><span class="muted">${esc(s.label)}</span><span class="chip chip-ok">${esc(s.value)}</span></div>`).join('')}
      <hr class="hairline"/>
      <div class="section-heading" style="font-size:14px;">Compliance checklist</div>
      ${o.compliance.map(c=>`
        <div class="compliance-item">
          <input type="checkbox" id="cmp-${c.id}" data-act="toggle-compliance" data-cmp="${c.id}" ${ticked.has(c.id)?'checked':''}/>
          <div>
            <label for="cmp-${c.id}">${esc(c.label)}</label>
            ${c.regulatoryNote?`<div class="reg-note">${esc(c.regulatoryNote)}</div>`:''}
          </div>
        </div>`).join('')}
    </div>
    <div class="drawer-foot">
      <button class="btn btn-text btn-danger-text" data-act="submit-offer-decline">Customer declined</button>
      <button class="btn btn-primary" id="btn-offer-add" data-act="submit-offer-add" ${addable?'':'disabled'}>Add Booster service</button>
    </div>
  </div>`;
}

function pinModalHtml(){
  if (!state.pinModal) return '';
  const pm = state.pinModal;
  const slots = Array.from({length:6}, (_,i) => `<div class="pin-slot ${i < pm.digits.length ? 'filled':''}">${i < pm.digits.length ? '●' : ''}</div>`).join('');
  const keys = [1,2,3,4,5,6,7,8,9].map(n=>`<button data-act="pin-key" data-k="${n}">${n}</button>`).join('')
    + `<button data-act="pin-clear">Clear</button><button data-act="pin-key" data-k="0">0</button><button data-act="pin-back">⌫</button>`;
  return `
  <div class="modal-overlay" data-act="pin-overlay">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="section-heading" style="font-size:16px;text-align:center;">Enter six-digit account PIN</div>
      <div class="pin-slots">${slots}</div>
      <div class="pinpad-grid">${keys}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
        <button class="btn-text" data-act="pin-autofill">Autofill PIN (presenter)</button>
        <button class="btn btn-primary btn-sm" id="pinpad-submit" data-act="pin-submit" ${pm.digits.length===6?'':'disabled'}>Submit</button>
      </div>
      ${pm.error?`<div class="pin-error">${esc(pm.error)}</div>`:''}
      ${pm.warned?`<div class="pin-warning">One more incorrect attempt will trigger a lock warning.</div>`:''}
    </div>
  </div>`;
}

/* ============================================================ SCREENS */
function screenS0(){
  const c = DATA.customer, svc = DATA.services;
  return `
  <div class="hero-wrap">
    <div class="hero-inner">
      <div class="eyebrow"><span class="chip chip-info">Internal demo · synthetic data</span></div>
      <h1 class="hero-title">${esc(DATA.useCase.title)}</h1>
      <p class="hero-sub">${esc(DATA.useCase.subtitle)}</p>
      <div class="hero-cta-row">
        <button class="btn btn-signal btn-pill" id="btn-start-demo" data-act="btn-start-demo">Start the call</button>
        <button class="btn btn-secondary btn-pill" id="btn-view-brief" data-act="btn-view-brief">View the use-case brief</button>
      </div>
      <div class="hero-panel">
        <div class="eyebrow" style="margin-bottom:10px;">Customer on the line</div>
        <div class="hero-customer-row">
          <span class="data-chip"><span class="k">Name</span><span class="v" style="font-family:inherit">${esc(c.name)}</span></span>
          <span class="data-chip"><span class="k">Suburb</span><span class="v" style="font-family:inherit">${esc(c.suburb)}, ${c.state}</span></span>
          <span class="data-chip"><span class="k">Tenure</span><span class="v" style="font-family:inherit">${c.tenureMonths} months</span></span>
          <span class="data-chip"><span class="k">Services</span><span class="v" style="font-family:inherit">${svc.map(s=>s.name).join(' + ')}</span></span>
        </div>
      </div>
    </div>
    <div class="proof-grid">
      <div class="proof-card"><div class="num">1</div><h3>Real telco diagnostics, not scripted chat</h3><p>Outage check, dropout history, line telemetry, modem profile refresh — each with evidence, on the Diagnostics Console.</p></div>
      <div class="proof-card"><div class="num">2</div><h3>Nothing lost at handoff</h3><p>The human agent opens the exact state the AI accumulated. The customer never repeats a step.</p></div>
      <div class="proof-card"><div class="num">3</div><h3>Selling is earned, not pushed</h3><p>The offer stays locked until the ticket exists and the customer confirms a real coverage gap.</p></div>
    </div>
    <p class="lang-hint">A single continuous story — use the stage rail at the top, or the primary action on each screen, to move forward.</p>
    <button class="btn-text" id="btn-view-agents" data-act="btn-view-agents" style="display:block;margin:6px auto 0;">See the TCS agents this runs on →</button>
  </div>
  <p class="disclaimer-footer">${esc(DATA.meta.disclaimer)}</p>`;
}

function screenS1(){
  const u = DATA.useCase;
  return `
  <div class="screen grid-12">
    <div class="col-8">
      <div class="eyebrow">Use-case brief</div>
      <h1 class="screen-title">${esc(u.title)}</h1>
      ${u.executiveSummary.map(p=>`<p class="muted">${esc(p)}</p>`).join('')}
      <div class="card" style="border-left:4px solid var(--brand-signal); margin:20px 0;">
        <strong>${esc(u.criticalMessage)}</strong>
      </div>
      <h2 class="section-heading">Scenario</h2>
      <div class="no-scroll-x"><table class="scenario">
        <thead><tr><th>Aspect</th><th>Design</th></tr></thead>
        <tbody>${u.scenario.map(r=>`<tr><td data-label="Aspect"><strong>${esc(r.item)}</strong></td><td data-label="Design">${esc(r.design)}</td></tr>`).join('')}</tbody>
      </table></div>
      <h2 class="section-heading" style="margin-top:28px;">Capabilities demonstrated</h2>
      <div>${u.capabilities.map((cap,i)=>`
        <div class="accordion-row">
          <button data-act="toggle-accordion" data-i="${i}">${esc(cap.name)} <span>${state._openAcc===i?'−':'+'}</span></button>
          ${state._openAcc===i?`<div class="accordion-body">${esc(cap.shownBy)}</div>`:''}
        </div>`).join('')}</div>
    </div>
    <div class="col-4">
      <div class="card" style="margin-bottom:16px;">
        <h3 class="section-heading" style="font-size:15px;">Personas</h3>
        ${u.personaLegend.map(p=>`<div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0;"><span class="chip" style="background:var(--p-${p.id}-bg, #EEF2F5);color:var(--p-${p.id}-ink, var(--ink))">${esc(p.role)}</span><span class="muted" style="font-size:12.5px;">${esc(p.detail)}</span></div>`).join('')}
      </div>
      <div class="card" style="margin-bottom:16px;">
        <h3 class="section-heading" style="font-size:15px;">Success measures</h3>
        ${u.successMeasures.map(s=>`<div style="padding:8px 0;border-bottom:1px solid var(--rule)"><strong style="font-size:13px;">${esc(s.label)}</strong><div class="muted" style="font-size:12.5px;">${esc(s.detail)}</div></div>`).join('')}
      </div>
      <div class="card faint" style="font-size:12px;">
        <p>${esc(u.positioningStatement)}</p>
        <p style="margin-top:8px;">${esc(u.sourceBasis)}</p>
      </div>
    </div>
  </div>
  <div class="footer-bar">
    <button class="btn btn-secondary" id="btn-brief-back" data-act="btn-brief-back">Back</button>
    <button class="btn btn-primary" id="btn-brief-start" data-act="btn-brief-start">Start the call</button>
  </div>`;
}

function screenS2(){
  const turns = callTurns();
  const revealed = turns.slice(0, state.callRevealed);
  const foot = callFooterState();
  const c = DATA.customer, a = DATA.auth, iv = DATA.intent;
  const unlocked = state.auth.pinVerified;

  let footerHtml = '';
  if (foot.kind === 'empty'){
    footerHtml = `<span class="turn-counter">Call not started</span><button class="btn btn-primary" data-act="btn-advance-turn">Start the call</button>`;
  } else if (foot.kind === 'gate'){
    const disabled = foot.gate.requires && !foot.gate.requires.every(r => getFlag(r));
    footerHtml = `<span class="turn-counter">Turn ${state.callRevealed} of ${turns.length}</span>
      <div class="tooltip-wrap">
      <button class="btn btn-primary" id="${foot.gate.buttonId}" data-act="call-gate" data-gate="${foot.gate.buttonId}" ${disabled?'disabled':''}>${esc(foot.gate.labelKey)}</button>
      ${disabled?`<span class="tooltip">Complete authentication first.</span>`:''}
      </div>`;
  } else if (foot.kind === 'end'){
    footerHtml = `<span class="turn-counter">Call transferring…</span>`;
  } else {
    footerHtml = `<span class="turn-counter">Turn ${state.callRevealed} of ${turns.length}</span><button class="btn btn-primary" id="btn-advance-turn" data-act="btn-advance-turn">Next turn</button>`;
  }

  const attrsByCat = groupCapturedByCategory();

  return `
  ${ribbonHtml(state.ribbonMode)}
  <div class="screen grid-12">
    ${state.reviewMode ? `<div class="col-8" style="grid-column:1/-1;"><div class="review-banner"><span>You are viewing this screen in read-only review mode.</span><button class="btn btn-secondary btn-sm" data-act="btn-return-current">Return to current stage</button></div></div>` : ''}
    <div class="col-8">
      <div class="eyebrow">Live call · Voice · <span class="mono">${esc(c.name)}</span></div>
      <h1 class="screen-title" style="font-size:22px;margin-bottom:14px;">Priya Sharma — broadband technical support</h1>
      ${revealed.length===0 ? `<div class="empty-state"><div class="title">The call hasn’t started yet</div><p>Click Start the call to begin.</p></div>` : ''}
      <div class="conversation" role="log" aria-live="polite">
        ${revealed.map(t => t.channel==='assist' ? '' : personaBubbleHtml(t)).join('')}
      </div>
    </div>
    <div class="col-4">
      <div class="card" style="margin-bottom:14px;">
        <h3 class="section-heading" style="font-size:14px;">Authentication</h3>
        ${authRow('Calling number matched', true, 'cca-customer-data')}
        ${authRow('Full name confirmed', state.auth.nameConfirmed, 'cca-customer-data')}
        ${authRow('Six-digit PIN validated', state.auth.pinVerified, 'cx-validation')}
        ${authRow('Authentication outcome', state.auth.pinVerified ? a.outcome : '—', null, true)}
        <div style="font-size:12px;color:var(--ink-faint);margin-top:4px;">Failed attempts: ${state.auth.failedAttempts} of ${a.failedAttemptsAllowed}</div>
      </div>
      <div class="card" style="margin-bottom:14px;">
        <h3 class="section-heading" style="font-size:14px;">Customer 360</h3>
        ${unlocked ? custy360Html() : `<div class="locked-panel"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><span>Locked until authentication passes</span></div>`}
      </div>
      <div class="card" style="margin-bottom:14px;">
        <h3 class="section-heading" style="font-size:14px;">Intent & sentiment</h3>
        <div class="data-chip" style="margin-bottom:6px;"><span class="k">Intent</span><span class="v" style="font-family:inherit">${esc(iv.intent)} · ${esc(iv.subIntent)}</span></div>
        <div class="data-chip" style="margin-bottom:6px;"><span class="k">Sentiment</span><span class="v" style="font-family:inherit">${sentimentLabel(state.sentiment)}</span></div>
        <div class="data-chip" style="margin-bottom:6px;"><span class="k">Urgency</span><span class="v" style="font-family:inherit">${esc(iv.urgency)}</span></div>
        <div class="data-chip"><span class="k">Repeat contact</span><span class="v" style="font-family:inherit">${esc(iv.repeatContactDetail)}</span></div>
      </div>
      <div class="card">
        <h3 class="section-heading" style="font-size:14px;">Evidence · <span class="mono">${state.captured.size} attributes captured</span></h3>
        ${Object.entries(attrsByCat).map(([cat,items])=>`
          <div style="margin-bottom:8px;">
            <div class="eyebrow">${cat}</div>
            ${items.map(a=>`<div style="font-size:12.5px;padding:2px 0;">${esc(a.label)}: <span class="mono">${esc(a.masked?maskAlways(a):a.value)}</span></div>`).join('')}
          </div>`).join('') || `<p class="muted" style="font-size:12.5px;">No attributes captured yet.</p>`}
      </div>
    </div>
  </div>
  <div class="footer-bar">${footerHtml}</div>
  ${pinModalHtml()}`;
}
function maskAlways(a){ return a.value; }
function authRow(label, passed, agentId, isOutcome){
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:12.5px;">
    <span class="muted">${esc(label)}</span>
    ${isOutcome ? `<span class="chip ${passed!=='—'?'chip-ok':''}">${esc(passed)}</span>` : `<span class="chip ${passed?'chip-ok':''}">${passed?'✓ Pass':'Pending'}</span>`}
  </div>`;
}
function custy360Html(){
  const c = DATA.customer, s = DATA.services, acc = DATA.account;
  return `
    <div class="data-chip" style="margin-bottom:6px;"><span class="k">Tenure</span><span class="v">${c.tenureMonths} mo</span></div>
    <div class="data-chip" style="margin-bottom:6px;"><span class="k">Services</span><span class="v" style="font-family:inherit">${s.map(x=>x.name).join(', ')}</span></div>
    <div class="data-chip" style="margin-bottom:6px;"><span class="k">Billing</span><span class="v" style="font-family:inherit">${esc(acc.billingStatus)}</span></div>
    <div class="data-chip"><span class="k">Marketing consent</span><span class="v">${c.consent.marketing?'Yes':'No'}</span></div>`;
}
function sentimentLabel(s){
  return { frustrated:'\u{1F534} Frustrated', concerned:'\u{1F7E0} Concerned', neutral:'⚪ Neutral', reassured:'\u{1F7E1} Reassured', satisfied:'\u{1F7E2} Satisfied' }[s] || s;
}
function getFlag(path){
  if (path === 'ticket.created') return state.ticket.created;
  if (path === 'topup.applied') return state.topup.applied;
  if (path === 'coverageGapConfirmed') return state.coverageGapConfirmed;
  return true;
}
function groupCapturedByCategory(){
  const order = ['identity','profile','interaction','technical','resolution'];
  const out = {};
  order.forEach(cat=>{
    const items = DATA.dataAttributes.filter(a => a.category===cat && state.captured.has(a.id));
    if (items.length) out[cat] = items;
  });
  return out;
}

function screenS3(){
  const steps = DATA.diagnostics.steps;
  const status = state.diagnostics.status;
  return `
  ${ribbonHtml(status==='running'?'scanning':(status==='complete'?'analysed':'dim'))}
  <div class="screen grid-12">
    <div class="col-7">
      <div class="eyebrow">AI Diagnostics Console</div>
      <h1 class="screen-title" style="font-size:22px;">Seven-step troubleshooting sequence</h1>
      <div class="card">
        ${steps.map((s,i)=>diagRowHtml(s,i)).join('')}
      </div>
    </div>
    <div class="col-5">
      <div class="card" style="margin-bottom:16px;">
        <h3 class="section-heading" style="font-size:14px;">Line telemetry · 24h SNR margin</h3>
        ${sparklineSvg()}
        <div class="muted" style="font-size:12px;margin-top:6px;">${esc(DATA.telemetry.verdict)}</div>
      </div>
      <div class="card">
        <h3 class="section-heading" style="font-size:14px;">Modem health</h3>
        <div class="data-chip" style="margin-bottom:6px;"><span class="k">Uptime</span><span class="v">${DATA.modem.uptimeMinutes} min</span></div>
        <div class="data-chip" style="margin-bottom:6px;"><span class="k">Firmware</span><span class="v">${esc(DATA.modem.firmware)}</span></div>
        <div class="data-chip" style="margin-bottom:6px;"><span class="k">WiFi radios</span><span class="v" style="font-family:inherit">${esc(DATA.modem.wifiRadios)}</span></div>
        <div class="data-chip"><span class="k">Connected devices</span><span class="v">${DATA.modem.connectedDevices}</span></div>
      </div>
    </div>
  </div>
  <div class="footer-bar">
    <span class="turn-counter">${status==='complete' ? 'Diagnostics complete' : (status==='running' ? 'Running…' : 'Ready to run')}</span>
    <div style="display:flex;gap:10px;">
      ${status==='running' ? `<button class="btn btn-text" data-act="btn-diag-skip">Skip to results</button>` : ''}
      ${status==='idle' ? `<button class="btn btn-primary" id="btn-diag-run" data-act="btn-run-diagnostics-console">Run diagnostics</button>` : ''}
      ${status!=='idle' ? `<button class="btn btn-primary" id="btn-diag-back-to-call" data-act="btn-diag-back-to-call" ${status!=='complete'?'disabled':''}>Return to call</button>` : ''}
    </div>
  </div>`;
}
function diagRowHtml(s, i){
  const done = state.diagnostics.completedStepIds.includes(s.id);
  const runningIdx = state.diagnostics.completedStepIds.length;
  const isRunning = state.diagnostics.status==='running' && i===runningIdx;
  const statusCls = done ? s.status : (isRunning ? 'running' : 'pending');
  const expanded = state.diagnostics.expandedStep === s.id;
  const statusLabel = { pass:'✓ Pass', attention:'⚠ Attention', fault:'✕ Fault', running:'Running', pending:'Pending' }[statusCls];
  return `
  <div class="diag-row">
    <div class="name" data-act="toggle-diag-step" data-step="${s.id}">${s.order}. ${esc(s.name)}</div>
    <div class="diag-status ${statusCls}">${isRunning?`<span class="dot3"><span></span><span></span><span></span></span>`:''}${statusLabel}</div>
    <div class="diag-evidence">${done ? esc(s.evidence) : (isRunning?'…':'')}</div>
    <div class="diag-elapsed">${done ? s.durationMs+' ms' : ''}</div>
    <div>${agentBadge(s.agentId)}</div>
    ${expanded ? `<div class="diag-detail">
      ${s.detail.map(d=>`<div class="drow"><span class="l">${esc(d.label)}</span><span>${esc(d.value)}</span></div>`).join('')}
      ${s.thresholdCrossed?`<div class="drow"><span class="l">Threshold</span><span class="critical">${esc(s.thresholdCrossed)}</span></div>`:''}
      ${s.sopRef?`<div class="drow"><span class="l">SOP reference</span><span>${esc(sopById(s.sopRef)?.title||s.sopRef)}</span></div>`:''}
      ${s.id==='d5'?`<div class="drow"><span class="l">Timing</span><span class="faint">Quoted to customer as ~20 seconds; compressed for this demo.</span></div>`:''}
    </div>` : ''}
  </div>`;
}
function sparklineSvg(){
  const pts = DATA.telemetry.hourly;
  const w=280,h=90,pad=6;
  const max=20,min=0;
  const step = (w-2*pad)/(pts.length-1);
  const coords = pts.map((p,i)=>[pad+i*step, pad + (h-2*pad)*(1-(p.snrMarginDb-min)/(max-min))]);
  const path = coords.map((c,i)=>(i===0?'M':'L')+c[0].toFixed(1)+','+c[1].toFixed(1)).join(' ');
  const floorY = pad + (h-2*pad)*(1-9/max);
  const dots = coords.map((c,i)=> pts[i].dropout ? `<circle cx="${c[0]}" cy="${c[1]}" r="3" fill="var(--fault)"/>` : '').join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="SNR margin over 24 hours">
    <line x1="${pad}" y1="${floorY}" x2="${w-pad}" y2="${floorY}" stroke="var(--fault)" stroke-dasharray="3,3" stroke-width="1"/>
    <path d="${path}" fill="none" stroke="var(--info)" stroke-width="2"/>
    ${dots}
  </svg>`;
}

function screenS4(){
  const h = DATA.handoff;
  return `
  ${ribbonHtml(state.ribbonMode)}
  <div class="screen screen-narrow">
    <div class="eyebrow">Generated by Summary Agent ${agentBadge('cca-summary')} · 14:40</div>
    <h1 class="screen-title" style="font-size:24px;">AI-to-human handoff package</h1>
    <div style="margin-bottom:16px;">
      <button class="btn btn-secondary btn-sm" data-act="toggle-handoff-view" data-view="agent" ${state.handoffView==='agent'?'style="background:var(--ink);color:#fff"':''}>Agent view</button>
      <button class="btn btn-secondary btn-sm" data-act="toggle-handoff-view" data-view="raw" ${state.handoffView==='raw'?'style="background:var(--ink);color:#fff"':''}>Raw JSON</button>
    </div>
    ${state.handoffView==='raw' ? `<pre class="card no-scroll-x" style="font-family:var(--font-data);font-size:12px;overflow:auto;">${esc(JSON.stringify({
        customerIdentity:h.customerIdentity, reasonForCall:h.reasonForCall, sentiment:h.sentiment,
        diagnosticsCompleted:h.diagnosticsCompleted, findings:h.findings, escalationReason:h.escalationReason,
        nextBestActions:h.nextBestActions.map(a=>a.text), productInsight:h.productInsight,
        productInsightCondition:h.productInsightCondition, failedAttempts: state.auth.failedAttempts
      }, null, 2))}</pre>` : `
    <div class="card">
      ${handoffRow('Customer identity', h.customerIdentity + (state.auth.failedAttempts? ` (${state.auth.failedAttempts} failed PIN attempt(s) recorded)`:''))}
      ${handoffRow('Reason for call', h.reasonForCall)}
      ${handoffRow('Sentiment', h.sentiment)}
      ${handoffRow('Diagnostics completed', h.diagnosticsCompleted.join(' · '))}
      ${handoffRow('Findings', h.findings.join(' '))}
      ${handoffRow('Escalation reason', h.escalationReason)}
      ${handoffRow('Recommended next best actions', h.nextBestActions.map((a,i)=>`${i+1}. ${a.text}`).join(' '))}
      <div style="border-left:4px solid var(--warn); padding:10px 14px; background:rgba(184,105,15,.06); border-radius:8px; margin-top:10px;">
        <div class="eyebrow" style="color:var(--warn);">Conditional recommendation</div>
        <p style="margin:4px 0"><strong>${esc(h.productInsight)}</strong></p>
        <p style="margin:0;font-size:13px;">${esc(h.productInsightCondition)}</p>
      </div>
    </div>`}
    <div class="footer-bar" style="margin-top:16px;border-top:none;position:static;background:none;padding:0;">
      <button class="btn btn-secondary" data-act="btn-handoff-back">Back</button>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-secondary" data-act="btn-handoff-copy">Copy summary</button>
        <button class="btn btn-primary" id="btn-handoff-transfer" data-act="btn-handoff-transfer">Connect to specialist</button>
      </div>
    </div>
  </div>`;
}
function handoffRow(label, value){
  return `<div style="padding:10px 0;border-bottom:1px solid var(--rule);"><div class="eyebrow">${esc(label)}</div><div style="font-size:14px;margin-top:2px;">${esc(value)}</div></div>`;
}

function screenS5(){
  const turns = state.deskTurns;
  const revealed = turns.slice(0, state.deskRevealed);
  const foot = deskFooterState();
  const assistTurns = revealed.filter(t=>t.channel==='assist');
  const voiceTurns = revealed.filter(t=>t.channel!=='assist');
  const nba = DATA.handoff.nextBestActions;

  let footerHtml = '';
  if (state.drawer){
    footerHtml = `<span class="turn-counter">Turn ${state.deskRevealed} of ${turns.length}</span><span class="muted" style="font-size:12.5px;">Complete the panel on the right to continue.</span>`;
  } else if (foot.kind === 'gate'){
    const reqs = foot.gate.requires || [];
    const disabled = !reqs.every(getFlag);
    let reasonLine = '';
    if (foot.gate.buttonId === 'btn-open-offer'){
      reasonLine = `<div style="font-size:11.5px;color:var(--ink-faint);margin-top:4px;">
        ${gateReasonChip('Service issue actioned', state.ticket.created)}
        ${gateReasonChip('Temporary support applied', state.topup.applied)}
        ${gateReasonChip('Coverage gap confirmed', state.coverageGapConfirmed)}
      </div>`;
    }
    footerHtml = `<div><span class="turn-counter">Turn ${state.deskRevealed} of ${turns.length}</span>${reasonLine}</div>
      <button class="btn btn-primary" id="${foot.gate.buttonId}" data-act="desk-gate" data-gate="${foot.gate.buttonId}" ${disabled?'disabled':''}>${esc(foot.gate.labelKey)}</button>`;
  } else if (foot.kind === 'end'){
    footerHtml = `<span class="turn-counter">Call complete</span>`;
  } else {
    footerHtml = `<span class="turn-counter">Turn ${state.deskRevealed} of ${turns.length}</span><button class="btn btn-primary" data-act="btn-desk-advance">Next turn</button>`;
  }

  return `
  ${ribbonHtml(state.ribbonMode)}
  <div class="screen grid-12">
    ${state.reviewMode ? `<div style="grid-column:1/-1;"><div class="review-banner"><span>Read-only review mode.</span><button class="btn btn-secondary btn-sm" data-act="btn-return-current">Return to current stage</button></div></div>` : ''}
    <div class="col-3">
      <div class="card" style="margin-bottom:14px;">
        <h3 class="section-heading" style="font-size:13px;">Customer context</h3>
        <div class="data-chip" style="margin-bottom:6px;"><span class="k">Identity</span><span class="v" style="font-family:inherit">Verified</span></div>
        <div class="data-chip" style="margin-bottom:6px;"><span class="k">Services</span><span class="v" style="font-family:inherit">${DATA.services.map(s=>s.name).join(', ')}</span></div>
      </div>
      <div class="card">
        <h3 class="section-heading" style="font-size:13px;">Context carried over (${state.captured.size})</h3>
        <button class="btn-text" data-act="toggle-carryover">${state._openCarry?'Hide':'Expand'}</button>
        ${state._openCarry?`<div style="margin-top:8px;">${Object.entries(groupCapturedByCategory()).map(([cat,items])=>`<div class="eyebrow" style="margin-top:6px;">${cat}</div>${items.map(a=>`<div style="font-size:12px;">${esc(a.label)}: <span class="mono">${esc(a.value)}</span></div>`).join('')}`).join('')}</div>`:''}
      </div>
    </div>
    <div class="col-5">
      <div class="eyebrow">Daniel · Care Desktop</div>
      <div class="conversation" role="log" aria-live="polite">
        ${voiceTurns.map(personaBubbleHtml).join('')}
      </div>
    </div>
    <div class="col-4">
      <div class="assist-stream">
        <div class="assist-card" style="border-left-color:var(--ink-faint);background:#F7F9FB;border-color:var(--rule);">
          <div class="kind" style="color:var(--ink-soft)">Next-best-action queue</div>
          ${nba.map(a=>{
            const st = nbaStatus(a);
            return `<div style="display:flex;gap:8px;align-items:flex-start;padding:4px 0;font-size:12.5px;">
              <span class="chip ${st==='done'?'chip-ok':''}" style="min-width:60px;justify-content:center;">${st}</span><span>${esc(a.text)}</span>
            </div>`;
          }).join('')}
        </div>
        ${assistTurns.map(assistCardHtml).join('')}
      </div>
    </div>
  </div>
  <div class="footer-bar">${footerHtml}</div>
  ${drawerHtml()}`;
}
function gateReasonChip(label, met){
  return `<span class="chip ${met?'chip-ok':''}" style="margin-right:6px;">${met?'✓':'○'} ${esc(label)}</span>`;
}
function nbaStatus(a){
  if (a.id==='nba1') return 'done';
  if (a.id==='nba2') return state.ticket.created ? 'done':'pending';
  if (a.id==='nba3') return state.topup.applied ? 'done':'pending';
  if (a.id==='nba4') return state.ticket.created ? 'done':'pending';
  if (a.id==='nba5') return state.coverageGapConfirmed ? (state.offer.added||state.offer.declined?'done':'pending') : 'n/a';
  return 'pending';
}

function screenS6(){
  const declined = state.offer.declined;
  const events = [
    { actor:'ai', label:'Identity authenticated', time:'14:34' },
    { actor:'ai', label:'Diagnostics run · 7 steps', time:'14:39' },
    { actor:'ai', label:'Provisioning mismatch corrected by AI', time:'14:38' },
    { actor:'human', label:`Network investigation ticket ${DATA.ticketTemplate.id} raised`, time:'14:47' },
    { actor:'human', label:'Temporary 20 GB data support applied', time:'14:49' },
    { actor:'human', label: declined ? 'Smart WiFi Booster declined by customer' : 'Smart WiFi Booster added', time:'14:56' }
  ];
  const smsToShow = declined ? DATA.notifications.filter(n=>n.condition!=='offerAdded') : DATA.notifications;
  return `
  <div class="screen grid-12">
    <div class="col-7">
      <div class="eyebrow">Resolution summary</div>
      <h1 class="screen-title" style="font-size:24px;">What was done for Priya</h1>
      <div class="open-banner">
        <div class="head">Line instability remains open</div>
        <p style="margin:0;font-size:13.5px;">Ticket ${DATA.ticketTemplate.id} is under investigation. Priya will receive SMS updates at each milestone. This demo does not claim the network fault is fully solved — that is the point.</p>
      </div>
      <div class="card">
        <div class="timeline">
          ${events.map(e=>`<div class="timeline-item"><div class="timeline-dot ${e.actor}"></div><div><div class="timeline-actor ${e.actor}">${e.actor==='ai'?'AI · Olivia':'Human · Daniel'}</div><div>${esc(e.label)}</div></div><div class="timeline-time" style="margin-left:auto;">${e.time}</div></div>`).join('')}
        </div>
      </div>
      <div class="bubble customer" style="margin-top:16px;max-width:520px;">${declined ? '“Thanks, that’s all I needed.”' : '“No, that’s everything. Thanks for not making me repeat the whole story.”'}</div>
    </div>
    <div class="col-5">
      <h3 class="section-heading" style="font-size:14px;">SMS confirmations</h3>
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${smsToShow.map((s,i)=>`
          <div class="sms-card" data-act="toggle-sms" data-i="${i}">
            <div class="meta"><span>${esc(s.sender)} → ${esc(s.to)}</span><span>${esc(s.sentAt)}</span></div>
            <div class="body ${state._openSms===i?'':'clamped'}">${esc(s.body)}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>
  <div class="footer-bar">
    <button class="btn btn-secondary" data-act="btn-outcome-agents">View TCS agent stack</button>
    <div style="display:flex;gap:10px;">
      <button class="btn btn-text" data-act="btn-outcome-replay">Replay demo</button>
      <button class="btn btn-primary" data-act="btn-outcome-value">View value dashboard</button>
    </div>
  </div>`;
}

function screenS7(){
  const groups = DATA.metrics.groups;
  const g = groups[state.valueTab];
  return `
  <div class="screen">
    <div class="eyebrow">Demo value dashboard</div>
    <h1 class="screen-title" style="font-size:26px;">${esc(DATA.metrics.scopeNote)}</h1>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:16px 0;">
      ${groups.map((gr,i)=>`<button class="filter-chip ${i===state.valueTab?'active':''}" data-act="value-tab" data-i="${i}">${esc(gr.label)}</button>`).join('')}
    </div>
    <div class="grid-12" style="margin-bottom:28px;">
      ${g.tiles.map(t=>`
        <div class="col-4 card metric-tile">
          <span class="metric-label">${esc(t.label)}</span>
          <span class="metric-figure tone-${t.tone}">${esc(t.value)}</span>
          <span class="metric-basis">${esc(t.basis)}</span>
        </div>`).join('')}
    </div>
    <div class="grid-12">
      <div class="col-7 card">
        <h3 class="section-heading" style="font-size:14px;">Work split — AI vs human, by stage</h3>
        ${workSplitChart()}
      </div>
      <div class="col-5 card">
        <h3 class="section-heading" style="font-size:14px;">SNR margin over 24h</h3>
        ${sparklineSvg()}
        <p class="faint" style="font-size:12px;">Fault domain remains open under ${DATA.ticketTemplate.id}.</p>
      </div>
    </div>
  </div>
  <div class="footer-bar">
    <button class="btn btn-secondary" data-act="btn-value-audit">View audit log (34 events)</button>
    <button class="btn btn-primary" data-act="btn-value-agents">View TCS agent stack</button>
  </div>
  ${state._auditOpen ? auditDrawerHtml() : ''}`;
}
function workSplitChart(){
  const rows = DATA.metrics.workSplit;
  const max = Math.max(...rows.map(r=>r.aiUnits+r.humanUnits));
  return `<div style="display:flex;flex-direction:column;gap:10px;">
    ${rows.map(r=>{
      const total = r.aiUnits+r.humanUnits;
      const aiPct = (r.aiUnits/max*100).toFixed(1), huPct=(r.humanUnits/max*100).toFixed(1);
      return `<div>
        <div style="font-size:12.5px;margin-bottom:3px;">${esc(r.stage)} <span class="faint">(${r.aiUnits} AI · ${r.humanUnits} human)</span></div>
        <div style="display:flex;height:14px;border-radius:6px;overflow:hidden;background:#EEF2F5;">
          <div style="width:${aiPct}%;background:var(--p-ai-ink);"></div>
          <div style="width:${huPct}%;background:var(--p-human-ink);"></div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}
function auditDrawerHtml(){
  return `
  <div class="drawer-overlay" data-act="close-audit"></div>
  <div class="drawer" role="dialog" aria-modal="true">
    <div class="drawer-head"><h3>Audit log · 34 events</h3><button class="icon-btn" data-act="close-audit">✕</button></div>
    <div class="drawer-body">
      ${DATA.auditLog.map(e=>`<div style="padding:7px 0;border-bottom:1px solid var(--rule);font-size:12.5px;">
        <span class="mono faint">#${e.seq} · ${e.at}</span> · <strong>${e.actor}</strong>${e.agentId?' · '+esc(agentById(e.agentId)?.name||e.agentId):''}<br/>${esc(e.event)}
      </div>`).join('')}
    </div>
    <div class="drawer-foot"><button class="btn btn-secondary" data-act="copy-audit">Copy log as text</button></div>
  </div>`;
}

function screenS8(){
  const agents = DATA.tcsAgents.filter(a => (!state.agentsFilter.suite || a.suiteId===state.agentsFilter.suite) && (!state.agentsFilter.usedOnly || a.usedInDemo));
  const suites = [...new Set(DATA.tcsAgents.map(a=>a.suiteId))].map(id => ({id, name: DATA.tcsAgents.find(a=>a.suiteId===id).suite}));
  const byStage = [1,2,3,4,5].map(n => DATA.tcsAgents.filter(a=>a.firedAtStages.includes(n)));
  const stageNames = ['Greeting & auth','Diagnostics','Handoff','Agent desktop','Assisted sale'];
  const open = state.agentDrawerId ? agentById(state.agentDrawerId) : null;
  return `
  <div class="screen">
    <div class="eyebrow">TCS agent composition on Google Cloud</div>
    <h1 class="screen-title" style="font-size:24px;">This prototype is assembled from pre-built TCS agents</h1>
    <div class="card" style="margin-bottom:20px;overflow-x:auto;">
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;min-width:760px;">
        ${byStage.map((list,i)=>`
          <div>
            <div class="eyebrow" style="margin-bottom:8px;">${i+1}. ${stageNames[i]}</div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${list.map(a=>`<button class="agent-node" data-act="open-agent" data-agent="${a.id}" style="text-align:left;font-size:12px;padding:8px 10px;">${esc(a.name)}</button>`).join('') || '<span class="faint" style="font-size:12px;">—</span>'}
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:16px;">
      <button class="filter-chip ${!state.agentsFilter.suite?'active':''}" data-act="filter-suite" data-suite="">All suites</button>
      ${suites.map(s=>`<button class="filter-chip ${state.agentsFilter.suite===s.id?'active':''}" data-act="filter-suite" data-suite="${s.id}">${esc(s.name)}</button>`).join('')}
      <label style="margin-left:auto;font-size:12.5px;display:flex;gap:6px;align-items:center;"><input type="checkbox" id="toggle-used-only" data-act="toggle-used-only" ${state.agentsFilter.usedOnly?'checked':''}/> Used in demo only (12)</label>
    </div>
    <div class="grid-12">
      ${suites.filter(s=>!state.agentsFilter.suite || s.id===state.agentsFilter.suite).map(s=>`
        <div class="col-3 suite-col">
          <h4>${esc(s.name)}</h4>
          ${agents.filter(a=>a.suiteId===s.id).map(a=>`
            <button class="agent-node ${a.usedInDemo?'':'unused'}" data-act="open-agent" data-agent="${a.id}">
              <strong style="font-size:13px;">${esc(a.name)}</strong>
              <div class="fired">${a.usedInDemo ? `Fired ${a.fireCount}×` : 'Available, not used'}</div>
            </button>`).join('')}
        </div>`).join('')}
    </div>
  </div>
  <div class="footer-bar">
    <span class="turn-counter">12 of 24 agents used in this demo</span>
    <button class="btn btn-secondary" data-act="btn-agents-restart">Replay demo</button>
  </div>
  ${open ? `
  <div class="drawer-overlay" data-act="close-agent"></div>
  <div class="drawer" role="dialog" aria-modal="true">
    <div class="drawer-head"><h3>${esc(open.name)}</h3><button class="icon-btn" data-act="close-agent">✕</button></div>
    <div class="drawer-body">
      <div class="chip chip-info" style="margin-bottom:10px;">${esc(open.suite)}</div>
      <p style="font-size:13.5px;">${esc(open.roleInDemo)}</p>
      <div class="eyebrow" style="margin-top:14px;">Inputs</div>
      <ul style="font-size:13px;margin:4px 0 12px;">${open.inputs.map(i=>`<li>${esc(i)}</li>`).join('') || '<li class="faint">None in this demo</li>'}</ul>
      <div class="eyebrow">Outputs</div>
      <ul style="font-size:13px;margin:4px 0 12px;">${open.outputs.map(o=>`<li>${esc(o)}</li>`).join('') || '<li class="faint">None in this demo</li>'}</ul>
      <div class="eyebrow">Fired at stages</div>
      <p style="font-size:13px;">${open.firedAtStages.length ? open.firedAtStages.join(', ') : 'Not exercised in this demo'}</p>
      <div class="chip chip-ok">${esc(open.availability)}</div>
    </div>
  </div>` : ''}`;
}

/* ============================================================ ROOT RENDER */
function render(){
  const app = document.getElementById('app');
  let body = '';
  switch(state.route){
    case '/': body = screenS0(); break;
    case '/overview': body = screenS1(); break;
    case '/call': body = screenS2(); break;
    case '/diagnostics': body = screenS3(); break;
    case '/handoff': body = screenS4(); break;
    case '/agent-desktop': body = screenS5(); break;
    case '/outcome': body = screenS6(); break;
    case '/value': body = screenS7(); break;
    case '/agents': body = screenS8(); break;
    default: body = screenS0();
  }
  app.innerHTML = renderTopBar() + body;
  renderToasts();
}

/* ============================================================ EVENT DELEGATION */
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]');
  const stageNode = e.target.closest('[data-stage-node]');
  if (stageNode && stageNode.classList.contains('done')){
    const n = Number(stageNode.dataset.stageNode);
    const route = { 1:'/call', 2:'/diagnostics', 3:'/handoff', 4:'/agent-desktop', 5:'/agent-desktop' }[n] || '/call';
    navigate(route, { review:true });
    return;
  }
  if (!t) return;
  const act = t.dataset.act;
  switch(act){
    case 'toggle-accordion': state._openAcc = state._openAcc===Number(t.dataset.i)?null:Number(t.dataset.i); render(); break;
    case 'toggle-diag-step': state.diagnostics.expandedStep = state.diagnostics.expandedStep===t.dataset.step ? null : t.dataset.step; render(); break;
    case 'toggle-carryover': state._openCarry = !state._openCarry; render(); break;
    case 'toggle-sms': state._openSms = state._openSms===Number(t.dataset.i)?null:Number(t.dataset.i); render(); break;
    case 'value-tab': state.valueTab = Number(t.dataset.i); render(); break;
    case 'call-gate': handleCallGate(t.dataset.gate); break;
    case 'desk-gate': handleDeskGate(t.dataset.gate); break;
    case 'close-drawer': closeDrawer(); break;
    case 'submit-ticket': {
      const imp = document.getElementById('ticket-impact'), pri = document.getElementById('ticket-priority');
      state.drawer.impact = imp ? imp.value : state.drawer.impact;
      state.drawer.priority = pri ? pri.value : state.drawer.priority;
      submitTicket(); break;
    }
    case 'submit-topup': submitTopup(); break;
    case 'toggle-compliance': toggleCompliance(t.dataset.cmp); break;
    case 'submit-offer-add': submitOfferAdd(); break;
    case 'submit-offer-decline': submitOfferDecline(); break;
    case 'toggle-handoff-view': state.handoffView = t.dataset.view; render(); break;
    case 'btn-value-audit': state._auditOpen = true; render(); break;
    case 'close-audit': state._auditOpen = false; render(); break;
    case 'copy-audit': {
      const text = DATA.auditLog.map(e=>`#${e.seq} ${e.at} [${e.actor}] ${e.event}`).join('\n');
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(()=>toast('Audit log copied')).catch(()=>fallbackCopy(text));
      else fallbackCopy(text);
      break;
    }
    case 'open-agent': openAgentDrawer(t.dataset.agent); break;
    case 'close-agent': state.agentDrawerId = null; render(); break;
    case 'filter-suite': state.agentsFilter.suite = t.dataset.suite || null; render(); break;
    case 'toggle-used-only': state.agentsFilter.usedOnly = !state.agentsFilter.usedOnly; render(); break;
    case 'pin-overlay': if (e.target === t) closePin(); break;
    case 'pin-key': pinDigit(t.dataset.k); break;
    case 'pin-back': pinBackspace(); break;
    case 'pin-clear': state.pinModal.digits=''; state.pinModal.error=null; render(); break;
    case 'pin-autofill': state.pinModal.digits = DATA.auth.accountPin; render(); break;
    case 'pin-submit': pinSubmit(); break;
    default: bindAction(act, t.dataset.view);
  }
});
document.addEventListener('keydown', (e) => {
  if (state.pinModal && /^[0-9]$/.test(e.key) && state.pinModal.digits.length < 6){
    pinDigit(e.key);
  } else if (state.pinModal && e.key === 'Backspace'){ pinBackspace(); }
  else if (state.pinModal && e.key === 'Enter' && state.pinModal.digits.length===6){ pinSubmit(); }
  else if (state.pinModal && e.key === 'Escape'){ closePin(); }
});
function closePin(){ state.pinModal = null; render(); }
function pinDigit(k){
  if (!state.pinModal || state.pinModal.digits.length>=6) return;
  state.pinModal.digits += k; state.pinModal.error=null; render();
}
function pinBackspace(){
  if (!state.pinModal) return;
  state.pinModal.digits = state.pinModal.digits.slice(0,-1); render();
}
function pinSubmit(){
  const pm = state.pinModal;
  if (pm.digits.length !== 6) return;
  if (pm.digits === DATA.auth.accountPin){
    state.auth.pinVerified = true;
    state.pinModal = null;
    toast('Identity verified successfully');
    revealCall(2); // t06, t07
    render();
  } else {
    state.auth.failedAttempts++;
    const remaining = DATA.auth.failedAttemptsAllowed - state.auth.failedAttempts;
    pm.error = `Incorrect PIN. ${remaining} attempt${remaining===1?'':'s'} remaining.`;
    pm.warned = state.auth.failedAttempts >= 2;
    pm.digits = '';
    render();
  }
}

/* ============================================================ PUBLIC API for the walkthrough bot */
window.OptusDemoApp = {
  getState: () => state,
  navigate,
  reset: () => { state = initialState(); render(); }
};

render();
