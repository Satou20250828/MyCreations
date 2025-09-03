const choices = document.querySelectorAll(".choice");
const playerHandEl = document.getElementById("playerHand");
const cpuHandEl = document.getElementById("cpuHand");
const outcomeEl = document.getElementById("outcome");

const winScoreEl = document.getElementById("winScore");
const loseScoreEl = document.getElementById("loseScore");
const drawScoreEl = document.getElementById("drawScore");

let win = 0;
let lose = 0;
let draw = 0;

const hands = ["グー", "チョキ", "パー"];

choices.forEach(choice => {
  choice.addEventListener("click", () => {
    const playerHand = choice.dataset.hand;
    const cpuHand = hands[Math.floor(Math.random() * hands.length)];

    playerHandEl.textContent = playerHand;
    cpuHandEl.textContent = cpuHand;

    const result = judge(playerHand, cpuHand);
    outcomeEl.textContent = result;
  });
});

function judge(player, cpu) {
  if (player === cpu) {
    draw++;
    drawScoreEl.textContent = draw;
    return "😮 引き分け！";
  }

  if (
    (player === "グー" && cpu === "チョキ") ||
    (player === "チョキ" && cpu === "パー") ||
    (player === "パー" && cpu === "グー")
  ) {
    win++;
    winScoreEl.textContent = win;
    return "🎉 あなたの勝ち！";
  } else {
    lose++;
    loseScoreEl.textContent = lose;
    return "💦 あなたの負け…";
  }
}
