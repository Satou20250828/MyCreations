(() => {
  const timeDisplay = document.getElementById('timeDisplay');
  const subLabel = document.getElementById('subLabel');
  const minsInput = document.getElementById('inputMinutes');
  const secsInput = document.getElementById('inputSeconds');
  const setBtn = document.getElementById('setBtn');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');

  let durationMs = 0;
  let remainingMs = 0;
  let endTime = null;
  let running = false;
  let rafId = null;

  function formatTime(ms) {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.ceil(ms / 1000);
    const mm = Math.floor(totalSeconds / 60);
    const ss = totalSeconds % 60;
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }

  function tick() {
    const now = performance.now();
    remainingMs = Math.max(0, endTime - now);
    timeDisplay.textContent = formatTime(remainingMs);
    subLabel.textContent = running ? 'カウント中…' : '一時停止';
    if (remainingMs <= 0) {
      stopTimer(true);
      flashFinish();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function startTimer() {
    if (running || remainingMs <= 0) return;
    running = true;
    endTime = performance.now() + remainingMs;
    startPauseBtn.textContent = '一時停止';
    subLabel.textContent = 'カウント中…';
    rafId = requestAnimationFrame(tick);
  }

  function pauseTimer() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
    rafId = null;
    const now = performance.now();
    remainingMs = Math.max(0, endTime - now);
    startPauseBtn.textContent = 'スタート';
    subLabel.textContent = '一時停止';
  }

  function stopTimer(finished = false) {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = null;
    if (finished) {
      timeDisplay.textContent = '00:00';
      subLabel.textContent = '時間になりました！';
      startPauseBtn.textContent = 'スタート';
      remainingMs = 0;
    }
  }

  function resetTimer() {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = null;
    remainingMs = durationMs;
    timeDisplay.textContent = formatTime(remainingMs);
    subLabel.textContent = 'リセット完了';
    startPauseBtn.textContent = 'スタート';
  }

  function setTimerFromInputs() {
    const m = Math.max(0, Math.floor(Number(minsInput.value) || 0));
    const s = Math.max(0, Math.floor(Number(secsInput.value) || 0));
    durationMs = (m * 60 + s) * 1000;
    remainingMs = durationMs;
    timeDisplay.textContent = formatTime(remainingMs);
    subLabel.textContent = 'セット完了';
  }

  // 完了時のアニメ＋「ピピピ」
  function flashFinish() {
    let countSound = 0;
    const playBeep = () => {
      const audio = new Audio('beep.mp3'); // 効果音ファイル
      audio.volume = 0.8;
      audio.play().catch(err => {
        console.log("音声再生がブロックされました:", err);
      });
      countSound++;
      if (countSound < 3) {
        setTimeout(playBeep, 600); // 0.6秒間隔で繰り返す
      }
    };
    playBeep();

    const orig = timeDisplay.style.color;
    timeDisplay.textContent = '00:00';
    let count = 0;
    const interval = setInterval(() => {
      timeDisplay.style.opacity = (count % 2 === 0) ? '0.25' : '1';
      count++;
      if (count > 5) {
        clearInterval(interval);
        timeDisplay.style.opacity = '1';
        timeDisplay.style.color = orig;
      }
    }, 250);
  }

  setBtn.addEventListener('click', setTimerFromInputs);
  startPauseBtn.addEventListener('click', () => {
    if (!running) startTimer(); else pauseTimer();
  });
  resetBtn.addEventListener('click', resetTimer);

  window.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
    if (isTyping) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!running) startTimer(); else pauseTimer();
    } else if (e.key.toLowerCase() === 'r') {
      resetTimer();
    }
  });

  (function init() {
    setTimerFromInputs();
    timeDisplay.textContent = formatTime(remainingMs);
    subLabel.textContent = '準備完了';
  })();
})();
