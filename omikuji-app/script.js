// 運勢の定義
const fortunes = [
  {key:'大吉', text:'今日は全てが味方になります。大胆に行動を。', emoji:'🌟', color:'#ffb86b'},
  {key:'中吉', text:'嬉しい出来事があるかも。小さなチャンスを見逃さないで。', emoji:'🌸', color:'#ffd6e0'},
  {key:'小吉', text:'穏やかな一日。じっくり取り組むと吉。', emoji:'☀️', color:'#b2f5ea'},
  {key:'末吉', text:'少しずつ前進。気長に進めると実ります。', emoji:'🍀', color:'#c6f6d5'},
  {key:'凶', text:'今日は無理をしないで。休む勇気が吉。', emoji:'⚠️', color:'#fbd5d5'}
];

const drawBtn = document.getElementById('drawBtn');
const result = document.getElementById('result');
const historyEl = document.getElementById('history');
const resetBtn = document.getElementById('resetBtn');

function randInt(max){ return Math.floor(Math.random()*max); }

function showFortune(f){
  result.style.background = `linear-gradient(120deg, rgba(255,255,255,0.15), ${f.color}33)`;
  result.querySelector('.fortune-emoji').textContent = f.emoji;
  result.querySelector('.fortune-text').textContent = f.key;
  result.querySelector('.fortune-desc').textContent = f.text;
  result.classList.add('show');
}

function addHistory(f){
  const item = document.createElement('div');
  item.className='history-item';
  const now = new Date();
  item.innerHTML = `<strong>${f.key}</strong> ${f.emoji} <br><small>${f.text}</small><br><small>${now.toLocaleString()}</small>`;
  historyEl.prepend(item);
  while(historyEl.children.length>10) historyEl.removeChild(historyEl.lastChild);
}

drawBtn.addEventListener('click', ()=>{
  const f = fortunes[randInt(fortunes.length)];
  showFortune(f);
  addHistory(f);
});

resetBtn.addEventListener('click', ()=>{
  if(confirm('履歴を本当に消しますか？')){
    historyEl.innerHTML='';
  }
});


