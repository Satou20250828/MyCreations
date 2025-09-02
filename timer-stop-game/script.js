const display = document.getElementById('display');
const msInfo = document.getElementById('ms-info');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreEl = document.getElementById('score');
const diffEl = document.getElementById('diff');
const roundsEl = document.getElementById('rounds');
const bestEl = document.getElementById('best');
const targetInput = document.getElementById('targetSec');
const targetBtn = document.getElementById('setTargetBtn');
const targetDisplay = document.getElementById('targetDisplay');

let startTime = 0, rafId = null, running = false, elapsed = 0;
let rounds = 0;
let targetSec = 10; // デフォルト目標

function fmt(ms){
  const total = Math.floor(ms);
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const milli = total % 1000;
  return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(milli).padStart(3,'0')}`;
}

function tick(){
  const now = performance.now();
  elapsed = now - startTime;
  display.textContent = fmt(elapsed);
  rafId = requestAnimationFrame(tick);
}

function start(){
  if(running) return;
  running = true;
  startTime = performance.now() - elapsed;
  rafId = requestAnimationFrame(tick);
  msInfo.textContent = 'タイマー動作中 — ストップで止める';
  startBtn.disabled = true;
  stopBtn.disabled = false;
}

function stop(){
  if(!running) return;
  running = false;
  cancelAnimationFrame(rafId);
  evaluate(elapsed);
  msInfo.textContent = '停止 — リセットまたはスタートで再挑戦';
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function reset(){
  running = false;
  cancelAnimationFrame(rafId);
  elapsed = 0;
  display.textContent = '00:00.000';
  msInfo.textContent = '準備完了 — スタートボタンを押すかスペースキー';
  scoreEl.textContent = '—';
  diffEl.textContent = '—';
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

// 評価関数
function evaluate(ms){
  const sec = ms / 1000;
  const diffSec = Math.abs(sec - targetSec);

  // 誤差が1秒以上なら0点
  const score = Math.max(0, Math.round(100 * (1 - diffSec / 1)));

  rounds += 1;
  roundsEl.textContent = rounds;

  scoreEl.textContent = score + ' pts';
  diffEl.textContent = (diffSec*1000).toFixed(0) + ' ms';

  const best = Number(localStorage.getItem('timerstop_best') || 0);
  if(score > best){
    localStorage.setItem('timerstop_best', score);
    bestEl.textContent = score + ' pts';
  } else {
    bestEl.textContent = (best>0? best + ' pts': '—');
  }
}

// 初期化
(function(){
  const best = Number(localStorage.getItem('timerstop_best') || 0);
  bestEl.textContent = (best>0? best + ' pts' : '—');
  stopBtn.disabled = true;
})();

// 目標秒数の設定
targetBtn.addEventListener('click', ()=>{
  const val = parseInt(targetInput.value);
  if(!isNaN(val) && val > 0){
    targetSec = val;
    targetDisplay.textContent = targetSec + " 秒";
  }
});

// ボタンイベント
startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', ()=>{ reset(); rounds = 0; roundsEl.textContent = rounds; });

// キーボード操作
window.addEventListener('keydown', (e)=>{
  if(e.code === 'Space'){
    e.preventDefault();
    if(running) stop(); else start();
  }
  if(e.key.toLowerCase() === 'r'){
    reset(); rounds = 0; roundsEl.textContent = rounds;
  }
});

