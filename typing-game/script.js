// 単語リスト
const words = [
  "りんご", "みかん", "ぶどう", "ばなな", "すいか",
  "ねこ", "いぬ", "とり", "さかな", "うま",
  "やま", "かわ", "そら", "たいよう", "つき",
  "はな", "くさ", "き", "もり", "いけ"
];

// 文章リスト
const sentences = [
  "今日はいい天気です",
  "プログラミングは楽しい",
  "私はタイピングが得意です",
  "水をたくさん飲みましょう",
  "毎日少しずつ練習しよう"
];

// あいうえお順モードのリスト
const aiueoList = [
  "あいうえお", "かきくけこ", "さしすせそ", "たちつてと",
  "なにぬねの", "はひふへほ", "まみむめも",
  "やゆよ", "らりるれろ", "わをん"
];

let currentText = "";
let score = 0;
let time = 30;
let timer;
let mode = "normal";
let aiueoIndex = 0;

const target = document.getElementById("target");
const input = document.getElementById("input");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const modeSelect = document.getElementById("mode");
const gameArea = document.getElementById("game");
const feedback = document.getElementById("feedback");

// ゲーム開始
startBtn.addEventListener("click", startGame);

function startGame() {
  score = 0;
  time = 30;
  aiueoIndex = 0;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = time;
  mode = modeSelect.value;
  gameArea.classList.remove("hidden");
  input.value = "";
  input.focus();
  feedback.textContent = "";
  setNewText();

  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeDisplay.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      target.textContent = "ゲーム終了！";
      input.disabled = true;
    }
  }, 1000);
}

// 出題するテキストを決定
function setNewText() {
  if (mode === "normal") {
    currentText = words[Math.floor(Math.random() * words.length)];
  } else if (mode === "sentence") {
    currentText = sentences[Math.floor(Math.random() * sentences.length)];
  } else if (mode === "aiueo") {
    currentText = aiueoList[aiueoIndex];
  }
  target.textContent = currentText;
}

// Enterキーで判定
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (input.value === currentText) {
      // ✅ 正解
      score++;
      scoreDisplay.textContent = score;
      feedback.textContent = "○ 正解！";
      feedback.className = "correct";
      input.value = "";

      if (mode === "aiueo") {
        aiueoIndex++;
        if (aiueoIndex >= aiueoList.length) {
          aiueoIndex = 0; // 繰り返し
        }
      }
      setNewText();
    } else {
      // ❌ 不正解（次に進まない）
      score--;
      scoreDisplay.textContent = score;
      feedback.textContent = "× 不正解";
      feedback.className = "incorrect";
      input.value = "";
    }
  }
});
