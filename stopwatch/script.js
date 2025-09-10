let running = false;
let startTime = 0;
let elapsed = 0;
let rafId = null;

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapList = document.getElementById('lapList');

function formatTime(ms) {
  const total = Math.floor(ms);
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const milliseconds = total % 1000;
  return (
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + '.' +
    String(milliseconds).padStart(3, '0')
  );
}

function update() {
  const now = performance.now();
  const currentElapsed = elapsed + (running ? (now - startTime) : 0);
  display.textContent = formatTime(currentElapsed);
  rafId = requestAnimationFrame(update);
}

startStopBtn.addEventListener('click', () => {
  if (!running) {
    startTime = performance.now();
    running = true;
    startStopBtn.textContent = '停止';
    if (!rafId) update();
  } else {
    const now = performance.now();
    elapsed += now - startTime;
    running = false;
    startStopBtn.textContent = '開始';
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    display.textContent = formatTime(elapsed);
  }
});

resetBtn.addEventListener('click', () => {
  running = false;
  elapsed = 0;
  startTime = 0;
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  display.textContent = '00:00.000';
  startStopBtn.textContent = '開始';
  lapList.innerHTML = '';
});

lapBtn.addEventListener('click', () => {
  const nowElapsed = elapsed + (running ? (performance.now() - startTime) : 0);
  const li = document.createElement('li');
  const count = lapList.children.length + 1;
  li.textContent = `Lap ${count} — ${formatTime(nowElapsed)}`;
  lapList.prepend(li);
});
