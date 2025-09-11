const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');

const week = ["日","月","火","水","木","金","土"];

function formatTime(date){
  const h = String(date.getHours()).padStart(2,'0');
  const m = String(date.getMinutes()).padStart(2,'0');
  const s = String(date.getSeconds()).padStart(2,'0');
  return `${h}:${m}:${s}`;
}

function formatDate(date){
  const y = date.getFullYear();
  const mo = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  const w = week[date.getDay()];
  return `${y}年${mo}月${d}日 (${w})`;
}

function update(){
  const now = new Date();
  clockEl.textContent = formatTime(now);
  dateEl.textContent = formatDate(now);
}

// 初回更新
update();
// 秒ぴったりに同期
const now = new Date();
const delay = 1000 - now.getMilliseconds();
setTimeout(()=>{
  update();
  setInterval(update, 1000);
}, delay);

// タブ復帰時の即更新
document.addEventListener('visibilitychange', ()=>{
  if(!document.hidden) update();
});
