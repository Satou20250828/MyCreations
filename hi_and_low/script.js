const suits = ["♠", "♥", "♦", "♣"];
const values = [1,2,3,4,5,6,7,8,9,10,11,12,13];

let deck = [];
let currentCard = null;
let score = 0;
let highscore = 0;
let gameOver = false;

const currentCardEl = document.getElementById("current-card");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const highBtn = document.getElementById("high-btn");
const lowBtn = document.getElementById("low-btn");
const resetBtn = document.getElementById("reset-btn");
const retryBtn = document.getElementById("retry-btn");

// 🔹 数値をトランプ表記に変換
function cardValueToString(value) {
  if (value === 1) return "A";
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  return value.toString();
}

// 🔹 スーツごとに色を付ける
function formatCard(card) {
  const display = `${cardValueToString(card.value)}${card.suit}`;
  if (card.suit === "♥" || card.suit === "♦") {
    return `<span class="red">${display}</span>`;
  } else {
    return `<span class="black">${display}</span>`;
  }
}

// 🔹 ページ読み込み時に保存されたハイスコアを取得
if (localStorage.getItem("highscore")) {
  highscore = parseInt(localStorage.getItem("highscore"));
  highscoreEl.textContent = highscore;
}

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard() {
  return deck.pop();
}

function showCard(card) {
  currentCardEl.innerHTML = `現在のカード: ${formatCard(card)}`;
}

function startGame() {
  createDeck();
  shuffleDeck();
  currentCard = drawCard();
  showCard(currentCard);
  messageEl.innerHTML = "";
  score = 0;
  scoreEl.textContent = score;
  gameOver = false;
  highBtn.disabled = false;
  lowBtn.disabled = false;
  retryBtn.style.display = "none";
}

function guess(isHigh) {
  if (deck.length === 0 || gameOver) return;

  const nextCard = drawCard();
  let result;

  if (nextCard.value > currentCard.value) {
    result = isHigh ? "勝ち" : "負け";
  } else if (nextCard.value < currentCard.value) {
    result = isHigh ? "負け" : "勝ち";
  } else {
    result = "引き分け";
  }

  if (result === "勝ち") {
    score++;
    scoreEl.textContent = score;
    if (score > highscore) {
      highscore = score;
      highscoreEl.textContent = highscore;
      localStorage.setItem("highscore", highscore); // 🔹 保存
    }
  } else if (result === "負け") {
    messageEl.innerHTML = `次のカード: ${formatCard(nextCard)} → 負け！ ゲームオーバー`;
    gameOver = true;
    highBtn.disabled = true;
    lowBtn.disabled = true;
    retryBtn.style.display = "inline-block"; // ← リトライ表示
    return;
  }

  messageEl.innerHTML = `次のカード: ${formatCard(nextCard)} → ${result}`;
  currentCard = nextCard;
  showCard(currentCard);
}

highBtn.addEventListener("click", () => guess(true));
lowBtn.addEventListener("click", () => guess(false));
resetBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", startGame);

startGame();

