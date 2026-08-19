// Presenter walkthrough bot.
// Drives the real UI — moves a simulated cursor, clicks real buttons, types the PIN —
// exactly the way a person would. Started/stopped by the near-invisible dot in the
// bottom-right corner of the page (#walkthrough-hotspot). Click once to play, click
// again to stop at any point.

let running = false;
let stopRequested = false;
let runToken = 0;

const hotspot = document.getElementById('walkthrough-hotspot');
const cursor = document.getElementById('walkthrough-cursor');
const caption = document.getElementById('walkthrough-caption');

hotspot.addEventListener('click', () => {
  if (running) stopWalkthrough();
  else startWalkthrough();
});

function stopWalkthrough(){
  stopRequested = true;
  running = false;
  hotspot.classList.remove('running');
  hideCursor();
  hideCaption();
}

async function startWalkthrough(){
  running = true;
  stopRequested = false;
  const myToken = ++runToken;
  hotspot.classList.add('running');
  try {
    if (window.OptusDemoApp) window.OptusDemoApp.reset();
    await sleep(500, myToken);
    await runScript(myToken);
  } catch (err) {
    if (err !== STOPPED) console.error('Walkthrough error', err);
  } finally {
    if (myToken === runToken){
      running = false;
      hotspot.classList.remove('running');
      hideCursor();
      hideCaption();
    }
  }
}

const STOPPED = Symbol('stopped');
function checkStop(token){ if (stopRequested || token !== runToken) throw STOPPED; }

function sleep(ms, token){
  return new Promise((resolve, reject) => {
    const step = 60;
    let waited = 0;
    const iv = setInterval(() => {
      if (stopRequested || token !== runToken){ clearInterval(iv); reject(STOPPED); return; }
      waited += step;
      if (waited >= ms){ clearInterval(iv); resolve(); }
    }, step);
  });
}

function showCaption(text){
  caption.textContent = text;
  caption.classList.add('visible');
}
function hideCaption(){ caption.classList.remove('visible'); }

function moveCursorTo(el){
  const r = el.getBoundingClientRect();
  const x = r.left + r.width/2, y = r.top + r.height/2;
  cursor.style.left = x + 'px';
  cursor.style.top = y + 'px';
  cursor.classList.add('visible');
  return { x, y };
}
function hideCursor(){ cursor.classList.remove('visible'); }

function clickRing(x, y){
  const ring = document.createElement('div');
  ring.className = 'wt-click-ring';
  ring.style.left = x + 'px'; ring.style.top = y + 'px';
  document.body.appendChild(ring);
  setTimeout(() => ring.remove(), 550);
}

async function waitForEl(selector, token, timeoutMs=8000){
  const start = Date.now();
  while (Date.now() - start < timeoutMs){
    checkStop(token);
    const el = document.querySelector(selector);
    if (el && !el.disabled) return el;
    await sleep(80, token);
  }
  throw new Error('Timed out waiting for ' + selector);
}

async function clickEl(selector, token, opts={}){
  const el = await waitForEl(selector, token, opts.timeout);
  checkStop(token);
  const { x, y } = moveCursorTo(el);
  await sleep(380, token);
  clickRing(x, y);
  el.click();
  await sleep(opts.after ?? 550, token);
}

async function typePin(token){
  const digits = '483921'.split('');
  for (const d of digits){
    checkStop(token);
    await clickEl(`[data-act="pin-key"][data-k="${d}"]`, token, { after: 140 });
  }
  await clickEl('#pinpad-submit', token, { after: 700 });
}

async function say(text, token, ms=1400){
  checkStop(token);
  showCaption(text);
  await sleep(ms, token);
}

async function waitForState(predicate, token, timeoutMs=15000){
  const start = Date.now();
  while (Date.now() - start < timeoutMs){
    checkStop(token);
    if (predicate(window.OptusDemoApp.getState())) return;
    await sleep(150, token);
  }
}

async function runScript(token){
  await say('Walking through the Optus AI demo end to end…', token, 1600);

  await clickEl('#btn-view-brief', token);
  await say('This is the use-case brief a stakeholder can read alone.', token, 1800);
  await clickEl('#btn-brief-start', token);

  await say('Olivia recognises the caller, but still authenticates properly.', token, 1900);
  await clickEl('[data-act="btn-advance-turn"]', token);
  await clickEl('[data-gate="btn-confirm-name"]', token);

  await clickEl('[data-act="btn-advance-turn"]', token);
  await clickEl('[data-gate="btn-enter-pin"]', token);
  await say('Typing the six-digit account PIN…', token, 900);
  await typePin(token);
  await say('Identity verified — Customer 360 unlocks.', token, 1500);

  await clickEl('[data-act="btn-advance-turn"]', token);
  await say('Now the AI runs real telco diagnostics, not scripted chat.', token, 1600);
  await clickEl('[data-gate="btn-run-diagnostics"]', token);

  await clickEl('#btn-diag-run', token, { after: 800 });
  await say('Seven diagnostic steps, each with evidence…', token, 1600);
  await waitForState(s => s.diagnostics.status === 'complete', token, 20000);
  await say('Provisioning mismatch corrected by AI — the line instability stays open.', token, 2000);
  await clickEl('#btn-diag-back-to-call', token);

  await clickEl('[data-gate="btn-explain-refresh"]', token);
  await say('“This is not a basic restart” — Olivia explains the network-side fix.', token, 1800);
  await clickEl('[data-act="btn-advance-turn"]', token);
  await clickEl('[data-act="btn-advance-turn"]', token);
  await clickEl('[data-gate="btn-check-topup-eligibility"]', token);
  await say('AI resolved what it could. The rest needs a human.', token, 1600);
  await clickEl('[data-gate="btn-transfer-specialist"]', token);

  await say('Everything Olivia learned travels with the call.', token, 1800);
  await clickEl('#btn-handoff-transfer', token, { after: 1400 });

  await say('Daniel opens the AI summary before he even speaks.', token, 1800);
  await clickEl('[data-act="btn-desk-advance"]', token);
  await clickEl('[data-gate="btn-create-ticket"]', token);
  await clickEl('#btn-ticket-submit', token);

  await clickEl('[data-gate="btn-apply-topup"]', token);
  await clickEl('#btn-topup-submit', token);

  await clickEl('[data-act="btn-desk-advance"]', token);
  await say('Priya mentions weak WiFi in the back room…', token, 1500);
  await clickEl('[data-gate="btn-log-coverage-gap"]', token);

  await say('The offer stays locked until three things are true.', token, 1800);
  for (let i=0;i<10;i++){
    const el = document.querySelector('[data-gate="btn-open-offer"]');
    if (el) break;
    checkStop(token);
    await clickEl('[data-act="btn-desk-advance"]', token, { after: 650 });
  }
  await clickEl('[data-gate="btn-open-offer"]', token, { after: 900 });
  await say('Selling is earned, not pushed — ticking every compliance item.', token, 1800);
  const cmpBoxes = Array.from(document.querySelectorAll('[data-act="toggle-compliance"]'));
  for (const box of cmpBoxes){
    checkStop(token);
    await clickEl(`#${box.id}`, token, { after: 260 });
  }
  await clickEl('#btn-offer-add', token, { after: 1000 });

  await clickEl('[data-gate="btn-wrap-call"]', token, { after: 1200 });
  await say('The line fault stays open — the demo doesn’t pretend otherwise.', token, 2000);

  await clickEl('[data-act="btn-outcome-value"]', token);
  await say('Every number here is traceable to this one interaction.', token, 1800);
  await sleep(600, token);
  const tabs = Array.from(document.querySelectorAll('[data-act="value-tab"]'));
  for (const tab of tabs.slice(0,3)){
    await clickEl(`[data-act="value-tab"][data-i="${tab.dataset.i}"]`, token, { after: 900 });
  }

  await clickEl('[data-act="btn-value-agents"]', token);
  await say('Built entirely from TCS agents already available on Google Cloud.', token, 2000);
  const firstAgentNode = document.querySelector('[data-act="open-agent"]');
  if (firstAgentNode) await clickEl(`[data-agent="${firstAgentNode.dataset.agent}"]`, token, { after: 1400 });

  await say('Walkthrough complete. Click the same dot to run it again.', token, 2600);
}
