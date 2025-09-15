const pegs = [
  document.getElementById("peg1"),
  document.getElementById("peg2"),
  document.getElementById("peg3")
];

let selectedDisk = null;
let diskCount = 3; // デフォルト
let moveCount = 0;

// 初期化（指定枚数のディスクを作る）
function initGame(count = 3) {
  diskCount = count;
  moveCount = 0;
  pegs.forEach(peg => peg.innerHTML = "");
  const colors = ["#e74c3c", "#f39c12", "#3498db", "#2ecc71", "#9b59b6",
                  "#1abc9c", "#e67e22", "#34495e", "#d35400", "#7f8c8d"];

  for (let i = count; i >= 1; i--) {
    const disk = document.createElement("div");
    disk.classList.add("disk");
    disk.style.width = (i * 20 + 40) + "px"; // 枚数が増えてもバランスよく表示
    disk.style.background = colors[(i - 1) % colors.length];
    disk.dataset.size = i;
    disk.textContent = i;
    pegs[0].appendChild(disk);
  }
  selectedDisk = null;
  updateInfo();
}

// 情報更新
function updateInfo() {
  const minMoves = Math.pow(2, diskCount) - 1;
  document.getElementById("info").textContent =
    `ディスク枚数: ${diskCount} ／ 移動回数: ${moveCount} ／ 最小手数: ${minMoves}`;
}

// 勝利判定
function checkWin() {
  if (pegs[1].childElementCount === diskCount ||
      pegs[2].childElementCount === diskCount) {
    setTimeout(() => {
      alert(`クリア！ ${moveCount}回で完成しました 🎉`);
    }, 100);
  }
}

// ペグをクリックしたときの処理
pegs.forEach(peg => {
  peg.addEventListener("click", () => {
    const disks = peg.querySelectorAll(".disk");
    const topDisk = disks[disks.length - 1];

    if (selectedDisk === null) {
      // まだ選んでないなら、このペグの一番上を選択
      if (topDisk) {
        selectedDisk = topDisk;
        selectedDisk.style.border = "2px solid yellow";
      }
    } else {
      // すでに選んであるなら、このペグに移動できるか確認
      const targetTop = disks[disks.length - 1];
      if (!targetTop || targetTop.dataset.size > selectedDisk.dataset.size) {
        peg.appendChild(selectedDisk);
        moveCount++;
        updateInfo();
        checkWin();
      }
      // 選択解除
      selectedDisk.style.border = "none";
      selectedDisk = null;
    }
  });
});

// スタートボタン
document.getElementById("start").addEventListener("click", () => {
  const count = parseInt(document.getElementById("diskCount").value);
  if (count >= 1 && count <= 10) {
    initGame(count);
  } else {
    alert("1〜10の範囲で入力してください");
  }
});

// リセットボタン
document.getElementById("reset").addEventListener("click", () => initGame(diskCount));

// 初期化
initGame(3);
