const game = document.getElementById("game");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const difficultySelect = document.getElementById("difficulty");

let numbers = [];
let next = 1;
let startTime;
let timerId = null;

startBtn.addEventListener("click", startGame);

function startGame() {
  const size = parseInt(difficultySelect.value);
  numbers = shuffle([...Array(size).keys()].map(n => n + 1));
  next = 1;
  message.textContent = "1から順番にタッチ！";
  game.innerHTML = "";

  // グリッドサイズ決定（正方形になるように）
  const gridSize = Math.sqrt(size);
  game.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;

  numbers.forEach(num => {
    const div = document.createElement("div");
    div.textContent = num;
    div.classList.add("number");
    div.addEventListener("click", () => handleClick(div, num));
    game.appendChild(div);
  });

  // タイマー開始
  startTime = Date.now();
  if (timerId) clearInterval(timerId);
  timerId = setInterval(updateTimer, 10);
  timerDisplay.textContent = "時間：0.00 秒";
}

function handleClick(div, num) {
  if (num === next) {
    div.classList.add("clicked");
    next++;
    if (next > numbers.length) {
      clearInterval(timerId);
      const time = ((Date.now() - startTime) / 1000).toFixed(2);
      message.textContent = `クリア！🎉 記録：${time} 秒`;
    }
  } else {
    message.textContent = "間違い！😵 もう一度やり直そう";
    clearInterval(timerId);
  }
}

function updateTimer() {
  const now = Date.now();
  const elapsed = ((now - startTime) / 1000).toFixed(2);
  timerDisplay.textContent = `時間：${elapsed} 秒`;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
