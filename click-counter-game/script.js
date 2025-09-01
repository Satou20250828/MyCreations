(() => {
  // ----------------------
  // 共通
  // ----------------------
  const normalMode = document.getElementById('normalMode');
  const timeAttackMode = document.getElementById('timeAttackMode');
  const normalModeBtn = document.getElementById('normalModeBtn');
  const timeAttackBtn = document.getElementById('timeAttackBtn');

  const KEY = {
    COUNT: 'ccg:count',
    TOTAL: 'ccg:total',
    BEST:  'ccg:best',
    TA_BEST: 'ccg:ta_best'
  };

  const get = (k) => Number(localStorage.getItem(k) ?? 0);
  const set = (k, v) => localStorage.setItem(k, String(v));

  const bump = (el) => {
    el.classList.remove('bump');
    requestAnimationFrame(() => el.classList.add('bump'));
  };

  // ----------------------
  // 通常モード
  // ----------------------
  const countEl = document.getElementById('count');
  const totalEl = document.getElementById('total');
  const bestEl  = document.getElementById('best');
  const clickBtn = document.getElementById('clickBtn');
  const undoBtn  = document.getElementById('undoBtn');
  const resetBtn = document.getElementById('resetBtn');

  let count = get(KEY.COUNT);
  let total = get(KEY.TOTAL);
  let best  = get(KEY.BEST);

  const renderNormal = () => {
    countEl.textContent = count;
    totalEl.textContent = total;
    bestEl.textContent  = best;
  };

  const add = () => {
    count += 1;
    total += 1;
    if (count > best) best = count;
    set(KEY.COUNT, count);
    set(KEY.TOTAL, total);
    set(KEY.BEST, best);
    renderNormal();
    bump(countEl);
  };

  const undo = () => {
    if (count > 0) {
      count -= 1;
      set(KEY.COUNT, count);
      renderNormal();
      bump(countEl);
    }
  };

  const reset = () => {
    count = 0;
    set(KEY.COUNT, count);
    renderNormal();
    bump(countEl);
  };

  clickBtn.addEventListener('click', add);
  undoBtn.addEventListener('click', undo);
  resetBtn.addEventListener('click', reset);

  window.addEventListener('keydown', (e) => {
    if (timeAttackMode.classList.contains('hidden')) {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        add();
      }
    }
  });

  renderNormal();

  // ----------------------
  // タイムアタックモード
  // ----------------------
  const taSelect = document.getElementById('taSelect');
  const timerEl = document.getElementById('timer');
  const taCountEl = document.getElementById('taCount');
  const taScoreEl = document.getElementById('taScore');
  const taBestEl = document.getElementById('taBest');

  const taStartBtn = document.getElementById('taStartBtn');
  const taClickBtn = document.getElementById('taClickBtn');
  const taResetBtn = document.getElementById('taResetBtn');

  let taCount = 0;
  let taTime = 10;
  let taTimer = null;
  let taBest = get(KEY.TA_BEST);

  const renderTA = () => {
    timerEl.textContent = taTime;
    taCountEl.textContent = taCount;
    taScoreEl.textContent = taCount;
    taBestEl.textContent = taBest;
  };

  const taStart = () => {
    taCount = 0;
    taTime = Number(taSelect.value);
    taClickBtn.disabled = false;
    taStartBtn.disabled = true;

    timerEl.textContent = taTime;
    taTimer = setInterval(() => {
      taTime -= 1;
      timerEl.textContent = taTime;

      if (taTime <= 0) {
        clearInterval(taTimer);
        taClickBtn.disabled = true;
        taStartBtn.disabled = false;

        if (taCount > taBest) {
          taBest = taCount;
          set(KEY.TA_BEST, taBest);
        }
        renderTA();
      }
    }, 1000);

    renderTA();
  };

  const taClick = () => {
    taCount += 1;
    taCountEl.textContent = taCount;
    bump(taCountEl);
  };

  const taReset = () => {
    clearInterval(taTimer);
    taCount = 0;
    taTime = Number(taSelect.value);
    taClickBtn.disabled = true;
    taStartBtn.disabled = false;
    renderTA();
  };

  taStartBtn.addEventListener('click', taStart);
  taClickBtn.addEventListener('click', taClick);
  taResetBtn.addEventListener('click', taReset);

  renderTA();

  // ----------------------
  // モード切替
  // ----------------------
  normalModeBtn.addEventListener('click', () => {
    normalMode.classList.remove('hidden');
    timeAttackMode.classList.add('hidden');
    normalModeBtn.classList.add('primary');
    normalModeBtn.classList.remove('outline');
    timeAttackBtn.classList.add('outline');
    timeAttackBtn.classList.remove('primary');
  });

  timeAttackBtn.addEventListener('click', () => {
    normalMode.classList.add('hidden');
    timeAttackMode.classList.remove('hidden');
    timeAttackBtn.classList.add('primary');
    timeAttackBtn.classList.remove('outline');
    normalModeBtn.classList.add('outline');
    normalModeBtn.classList.remove('primary');
  });
})();

