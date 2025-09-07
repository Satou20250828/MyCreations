let playerCoins = 20;
let cpuCoins = 20;
let playerCards = [1,2,3,4,5,6,7,8,9,10];
let cpuCards = [1,2,3,4,5,6,7,8,9,10];

const playerCoinsDisplay = document.getElementById("player-coins");
const cpuCoinsDisplay = document.getElementById("cpu-coins");
const playerCardsDiv = document.getElementById("player-cards");
const roundInfo = document.getElementById("round-info");
const playerChoiceDisplay = document.getElementById("player-choice");
const cpuChoiceDisplay = document.getElementById("cpu-choice");
const battleResultDisplay = document.getElementById("battle-result");
const resetBtn = document.getElementById("reset-btn");
const betInput = document.getElementById("bet-amount");

// カード表示
function renderCards() {
  playerCardsDiv.innerHTML = "";
  playerCards.forEach(card => {
    let btn = document.createElement("button");
    btn.textContent = card;
    btn.onclick = () => playRound(card);
    playerCardsDiv.appendChild(btn);
  });
}

// ラウンド処理
function playRound(playerCard) {
  const bet = parseInt(betInput.value);

  if (isNaN(bet) || bet <= 0) {
    alert("正しいベット額を入力してください。");
    return;
  }
  if (bet > playerCoins) {
    alert("ベット額が所持コインを超えています。");
    return;
  }

  // プレイヤーのカードを削除
  playerCards = playerCards.filter(c => c !== playerCard);

  // CPUカードをランダムに選択
  const cpuCard = cpuCards[Math.floor(Math.random() * cpuCards.length)];
  cpuCards = cpuCards.filter(c => c !== cpuCard);

  // 勝敗判定
  let result = "";
  if (playerCard === cpuCard) {
    result = "引き分け";
    // コイン変化なし
  } else if ((playerCard === 1 && cpuCard === 10) || (playerCard > cpuCard && !(cpuCard === 1 && playerCard === 10))) {
    result = "勝ち";
    playerCoins += bet;  // +ベット分（2倍-ベット戻し）
    cpuCoins -= bet;
  } else {
    result = "負け";
    playerCoins -= bet;
    cpuCoins += bet;
  }

  // 表示更新
  playerCoinsDisplay.textContent = `あなたのコイン: ${playerCoins}`;
  cpuCoinsDisplay.textContent = `CPUのコイン: ${cpuCoins}`;
  playerChoiceDisplay.textContent = `あなたのカード: ${playerCard}`;
  cpuChoiceDisplay.textContent = `CPUのカード: ${cpuCard}`;
  battleResultDisplay.textContent = `勝敗結果: ${result}`;

  // カード更新
  renderCards();

  // 終了判定
  if (playerCoins <= 0) {
    roundInfo.textContent = "ゲームオーバー！あなたの負けです。";
    disableAllCards();
  } else if (cpuCoins <= 0 || (playerCards.length === 0 && cpuCards.length === 0)) {
    roundInfo.textContent = "ゲーム終了！あなたの勝ちです！";
    disableAllCards();
  } else {
    roundInfo.textContent = "次のカードを選んでください";
  }
}

// カード無効化
function disableAllCards() {
  const buttons = document.querySelectorAll("#player-cards button");
  buttons.forEach(btn => btn.disabled = true);
}

// リセット
resetBtn.onclick = () => {
  playerCoins = 20;
  cpuCoins = 20;
  playerCards = [1,2,3,4,5,6,7,8,9,10];
  cpuCards = [1,2,3,4,5,6,7,8,9,10];
  playerChoiceDisplay.textContent = "あなたのカード: -";
  cpuChoiceDisplay.textContent = "CPUのカード: -";
  battleResultDisplay.textContent = "勝敗結果: -";
  roundInfo.textContent = "カードを選んでください";
  renderCards();
  playerCoinsDisplay.textContent = `あなたのコイン: ${playerCoins}`;
  cpuCoinsDisplay.textContent = `CPUのコイン: ${cpuCoins}`;
  betInput.value = 1;
};

// 初期描画
renderCards();
