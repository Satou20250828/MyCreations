let currentNumber = 0;
let targetValue = 100;
let cpuCount = 1;
let totalPlayers = 0;
let currentPlayer = 0; // 0 = 自分, 1以降 = CPU
let gameActive = false;

const currentNumberEl = document.getElementById("currentNumber");
const turnInfoEl = document.getElementById("turnInfo");
const logArea = document.getElementById("logArea");
const playerControls = document.getElementById("playerControls");

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("resetBtn").addEventListener("click", resetGame);

playerControls.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (gameActive && currentPlayer === 0) {
      playerTurn(parseInt(btn.dataset.count));
    }
  });
});

function startGame() {
  currentNumber = 0;
  cpuCount = parseInt(document.getElementById("cpuCount").value);
  targetValue = parseInt(document.getElementById("targetValue").value);
  totalPlayers = cpuCount + 1;
  currentPlayer = 0;
  gameActive = true;
  logArea.innerHTML = "";
  updateUI();
  log(`ゲーム開始！（CPU: ${cpuCount}人, 目標: ${targetValue}）`);
}

function resetGame() {
  gameActive = false;
  currentNumber = 0;
  currentPlayer = 0;
  updateUI();
  logArea.innerHTML = "";
  log("リセットしました。");
}

function updateUI() {
  currentNumberEl.textContent = currentNumber;
  if (gameActive) {
    turnInfoEl.textContent = currentPlayer === 0 ? "あなたの番" : `CPU${currentPlayer}の番`;
  } else {
    turnInfoEl.textContent = "-";
  }
}

function log(message) {
  const p = document.createElement("p");
  p.textContent = message;
  logArea.appendChild(p);
  logArea.scrollTop = logArea.scrollHeight;
}

function playerTurn(count) {
  if (!gameActive) return;
  currentNumber += count;
  log(`あなた: +${count} → ${currentNumber}`);
  checkGameOver();
  if (gameActive) {
    nextTurn();
  }
}

function cpuTurn() {
  if (!gameActive) return;
  let remaining = targetValue - currentNumber;
  let choice;

  if (remaining <= 3) {
    choice = remaining; // 強制的にゴール
  } else {
    // 戦略: 4の倍数+1にしたい
    let target = (Math.floor((currentNumber) / 4) + 1) * 4 + 1;
    choice = target - currentNumber;
    if (choice < 1 || choice > 3) {
      choice = Math.floor(Math.random() * 3) + 1;
    }
  }

  currentNumber += choice;
  log(`CPU${currentPlayer}: +${choice} → ${currentNumber}`);
  checkGameOver();
  if (gameActive) {
    nextTurn();
  }
}

function nextTurn() {
  currentPlayer = (currentPlayer + 1) % totalPlayers;
  updateUI();
  if (gameActive && currentPlayer !== 0) {
    setTimeout(cpuTurn, 1000);
  }
}

function checkGameOver() {
  if (currentNumber >= targetValue) {
    log(`${currentPlayer === 0 ? "あなた" : "CPU" + currentPlayer} が ${targetValue} に到達！ 負けです。`);
    gameActive = false;
    updateUI();
  }
}
