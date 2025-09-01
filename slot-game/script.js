const reelEls = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3'),
];
const spinBtn = document.getElementById('spinBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const betSelect = document.getElementById('betSelect');
const messageEl = document.getElementById('message');
const coinsEl = document.getElementById('coins');
const winsEl = document.getElementById('wins');

let spinIntervals = [null, null, null];
let isSpinning = false;
let coins = 100;
let wins = 0;

function randDigit() {
  return Math.floor(Math.random() * 10);
}

function startSpin() {
  if (isSpinning) return;
  const bet = parseInt(betSelect.value, 10);

  if (coins < bet) {
    messageEl.textContent = 'コインが足りません。リセットしてください。';
    return;
  }

  isSpinning = true;
  coins -= bet;
  coinsEl.textContent = coins;
  messageEl.textContent = `${bet}コインを賭けてスピン中…`;

  spinBtn.disabled = true;
  stopBtn.disabled = false;

  reelEls.forEach((el, idx) => {
    el.classList.add('spin');
    spinIntervals[idx] = setInterval(() => {
      el.textContent = randDigit();
    }, 60 + idx * 20);
  });

  setTimeout(() => autoStopSequence(), 3000);
}

function autoStopSequence() {
  if (!isSpinning) return;
  stopReel(0);
  setTimeout(() => stopReel(1), 350);
  setTimeout(() => stopReel(2), 700);
}

function stopReel(index) {
  if (!isSpinning) return;
  if (!spinIntervals[index]) return;

  clearInterval(spinIntervals[index]);
  spinIntervals[index] = null;
  reelEls[index].classList.remove('spin');

  if (spinIntervals.every(i => i === null)) {
    finalizeSpin();
  }
}

function manualStop() {
  if (!isSpinning) return;
  for (let i = 0; i < spinIntervals.length; i++) {
    if (spinIntervals[i]) {
      stopReel(i);
      break;
    }
  }
}

function finalizeSpin() {
  isSpinning = false;
  spinBtn.disabled = false;
  stopBtn.disabled = true;

  const results = reelEls.map(el => el.textContent);
  const bet = parseInt(betSelect.value, 10);

  if (results[0] === results[1] && results[1] === results[2]) {
    wins++;
    winsEl.textContent = wins;

    const matchedNum = parseInt(results[0], 10);
    let multiplier = matchedNum;

    // 特別ルール：0が揃ったら×10
    if (matchedNum === 0) multiplier = 10;

    const payout = bet * multiplier;
    coins += payout;
    coinsEl.textContent = coins;

    messageEl.textContent = `当たり！ ${results.join(' ')} 揃い 🎉 配当 ${payout}コイン！`;
    flashAccent();
  } else {
    messageEl.textContent = `残念！ ${results.join(' - ')}。また挑戦してね。`;
  }

  if (coins <= 0) {
    messageEl.textContent += ' コインが0になりました。リセットしてください。';
    spinBtn.disabled = true;
  }
}

function flashAccent() {
  reelEls.forEach(el => {
    el.style.transform = 'scale(1.06)';
    setTimeout(() => (el.style.transform = ''), 300);
  });
}

function resetGame() {
  spinIntervals.forEach((s, i) => {
    if (s) clearInterval(s);
    spinIntervals[i] = null;
  });

  isSpinning = false;
  spinBtn.disabled = false;
  stopBtn.disabled = true;
  coins = 100;
  wins = 0;
  coinsEl.textContent = coins;
  winsEl.textContent = wins;
  messageEl.textContent = '遊び方：コインを賭けて3つの数字を揃えよう。揃った数字によって配当が変わる！';
  reelEls.forEach(el => el.textContent = '0');
}

spinBtn.addEventListener('click', startSpin);
stopBtn.addEventListener('click', manualStop);
resetBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!isSpinning) startSpin();
    else manualStop();
  }
});

