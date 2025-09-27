(() => {
  const difficultyButtons = document.querySelectorAll('.difficulty-btn');
  const newGameBtn = document.getElementById('newGameBtn');
  const guessForm = document.getElementById('guessForm');
  const guessInput = document.getElementById('guessInput');
  const historyEl = document.getElementById('history');
  const messageEl = document.getElementById('message');

  let secret = [];
  let maxDigits = 3;
  let attempts = 0;
  let maxAttempts = Infinity;
  let currentDifficulty = 'easy';

  const difficulties = {
    easy: { digits: 3, limit: Infinity },
    normal: { digits: 4, limit: 15 },
    hard: { digits: 5, limit: 10 }
  };

  function pickSecret(n) {
    const pool = Array.from({length:10}, (_,i) => i.toString());
    const pick = [];
    while (pick.length < n) {
      const idx = Math.floor(Math.random() * pool.length);
      pick.push(pool.splice(idx,1)[0]);
    }
    return pick;
  }

  function startGame() {
    maxDigits = difficulties[currentDifficulty].digits;
    maxAttempts = difficulties[currentDifficulty].limit;

    secret = pickSecret(maxDigits);
    attempts = 0;
    historyEl.innerHTML = '';
    guessInput.value = '';
    guessInput.disabled = false;
    guessInput.maxLength = maxDigits;
    guessInput.placeholder = '例: ' + Array.from({length:maxDigits},(_,i)=>i+1).join('').slice(0,maxDigits);

    messageEl.textContent = `新しいゲーム開始！ ${maxDigits}桁で当ててください。制限回数：${maxAttempts === Infinity ? '無制限' : maxAttempts}回`;

    console.log('secret:', secret.join('')); // デバッグ用
    guessInput.focus();
  }

  function validateGuess(str) {
    if (!/^\d+$/.test(str)) return '数字のみを入力してください。';
    if (str.length !== maxDigits) return `${maxDigits}桁の数字を入力してください。`;
    const chars = str.split('');
    const set = new Set(chars);
    if (set.size !== chars.length) return '同じ数字は2回使えません。';
    return null;
  }

  function calcHitNear(guessArr, secretArr) {
    let hit = 0, near = 0;
    guessArr.forEach((g, i) => {
      if (secretArr[i] === g) hit++;
      else if (secretArr.includes(g)) near++;
    });
    return {hit, near};
  }

  guessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = guessInput.value.trim();
    const err = validateGuess(raw);
    if (err) {
      messageEl.textContent = err;
      return;
    }
    attempts++;
    const guessArr = raw.split('');
    const {hit, near} = calcHitNear(guessArr, secret);

    const li = document.createElement('li');
    li.innerHTML = `<span class="guess">${raw}</span> <span class="result">${hit}HIT - ${near}NEAR (${attempts}回目)</span>`;

    historyEl.prepend(li);

    if (hit === maxDigits) {
      li.classList.add('win');
      messageEl.textContent = `おめでとう！ ${attempts}回で当てました。正解：${secret.join('')}`;
      guessInput.disabled = true;
      return;
    }

    if (attempts >= maxAttempts) {
      messageEl.textContent = `ゲームオーバー！正解は：${secret.join('')}`;
      guessInput.disabled = true;
      return;
    }

    messageEl.textContent = `${hit}HIT - ${near}NEAR（${attempts}/${maxAttempts === Infinity ? '∞' : maxAttempts}回）`;
    guessInput.value = '';
    guessInput.focus();
  });

  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentDifficulty = btn.dataset.difficulty;
      startGame();
    });
  });

  newGameBtn.addEventListener('click', startGame);

  startGame();
})();
