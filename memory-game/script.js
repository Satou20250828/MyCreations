const PAD_COUNT = 4;
const FLASH_MS = 600;
const BETWEEN_MS = 260;

const pads = Array.from(document.querySelectorAll('.pad'));
const startBtn = document.getElementById('startBtn');
const levelEl = document.getElementById('level');
const resultEl = document.getElementById('result');
const showAnsCheckbox = document.getElementById('showAns');
const strictBtn = document.getElementById('strictBtn');

const ctx = new (window.AudioContext || window.webkitAudioContext)();
function tone(freq, dur){
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type='sine'; o.frequency.value=freq;
  g.gain.value=0.0001;
  o.connect(g); g.connect(ctx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur/1000);
  setTimeout(()=>o.stop(), dur+20);
}

let sequence = [];
let playerSeq = [];
let playing = false;
let acceptingInput = false;
let level = 0;
let strictMode = false;

function randInt(n){ return Math.floor(Math.random()*n); }

function setMessage(text, kind){
  resultEl.textContent = text;
  resultEl.classList.remove('correct','wrong');
  if(kind) resultEl.classList.add(kind);
}

function updateLevel(){ levelEl.textContent = `レベル: ${level}` }

function flashPad(id){
  return new Promise(res=>{
    const el = pads[id];
    el.classList.add('flash');
    tone(330 + id*80, FLASH_MS);
    setTimeout(()=>{
      el.classList.remove('flash');
      setTimeout(res, 90);
    }, FLASH_MS);
  });
}

async function playSequence(){
  playing = true; acceptingInput = false;
  setMessage('シーケンスを再生中…');
  for(let i=0;i<sequence.length;i++){
    await new Promise(r=>setTimeout(r, BETWEEN_MS));
    await flashPad(sequence[i]);
  }
  playing = false; acceptingInput = true; setMessage('あなたの番です');
}

function nextRound(){
  playerSeq = [];
  sequence.push(randInt(PAD_COUNT));
  level = sequence.length;
  updateLevel();
  playSequence();
}

function resetGame(){
  sequence=[]; playerSeq=[]; level=0;
  updateLevel(); setMessage('スタンバイ');
}

function startGame(){
  resetGame();
  nextRound();
}

function handlePlayerInput(id){
  if(!acceptingInput) return;
  playerSeq.push(id);
  flashPad(id);
  const pos = playerSeq.length - 1;
  if(playerSeq[pos] !== sequence[pos]){
    acceptingInput = false;
    setMessage('不正解！', showAnsCheckbox.checked ? 'wrong' : undefined);
    tone(150, 400);
    if(strictMode){
      setTimeout(()=>{ resetGame(); nextRound(); }, 800);
    } else {
      setTimeout(()=>{ playerSeq=[]; playSequence(); }, 900);
    }
    return;
  }
  if(playerSeq.length === sequence.length){
    acceptingInput = false;
    setMessage('正解！', showAnsCheckbox.checked ? 'correct' : undefined);
    tone(660, 160);
    setTimeout(()=>nextRound(), 800);
  }
}

pads.forEach(p=>{
  p.addEventListener('click',()=>{
    const id = Number(p.dataset.id);
    handlePlayerInput(id);
  });
});

startBtn.addEventListener('click',()=>{
  if(ctx.state === 'suspended') ctx.resume();
  startGame();
});

strictBtn.addEventListener('click',()=>{
  strictMode = !strictMode;
  strictBtn.textContent = `連続ミスでリセット: ${strictMode? 'ON':'OFF'}`;
});

window.addEventListener('keydown',(e)=>{
  if(e.key >= '1' && e.key <= String(PAD_COUNT)){
    const idx = Number(e.key)-1;
    if(acceptingInput) handlePlayerInput(idx);
  }
});

resetGame();
