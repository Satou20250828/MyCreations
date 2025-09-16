const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const remainingEl = document.getElementById("remaining");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

// プレイヤー
const player = { x: canvas.width/2, y: canvas.height-30, w: 40, h: 20, speed: 5 };

// 弾と的
let bullets = [];
let targets = [];
let score = 0;
let isGameOver = false;

// キー入力
let keys = {};
document.addEventListener("keydown", e => (keys[e.code] = true));
document.addEventListener("keyup", e => (keys[e.code] = false));

// 弾発射
function shoot() {
  if (!isGameOver) {
    bullets.push({ x: player.x, y: player.y, r: 6, speed: 7 });
  }
}
document.addEventListener("keydown", e => { if(e.code==="Space") shoot(); });
canvas.addEventListener("click", shoot);

// 的生成
function spawnTargets(n = 3) {
  targets = [];
  for (let i = 0; i < n; i++) {
    targets.push({
      x: 100 + i*160, // 600幅に合わせて間隔調整
      y: 70,
      r: 25,
      alive: true
    });
  }
}

// 初期化
function init() {
  bullets = [];
  score = 0;
  isGameOver = false;
  spawnTargets(3);
  updateHUD();
  messageEl.classList.add("hidden");
}
init();
restartBtn.addEventListener("click", init);

// HUD更新
function updateHUD() {
  scoreEl.textContent = "Score: " + score;
  const remaining = targets.filter(t => t.alive).length;
  remainingEl.textContent = "Targets: " + remaining;
}

// 当たり判定
function hit(b, t){
  const dx = b.x - t.x;
  const dy = b.y - t.y;
  return Math.sqrt(dx*dx + dy*dy) < b.r + t.r;
}

// 描画
function draw(){
  ctx.fillStyle = "#111";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // プレイヤー
  ctx.fillStyle = "#0af";
  ctx.fillRect(player.x-player.w/2, player.y-player.h/2, player.w, player.h);

  // 弾
  bullets.forEach(b => {
    const gradient = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*3);
    gradient.addColorStop(0,"rgba(255,0,0,0.9)");
    gradient.addColorStop(1,"rgba(255,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(b.x,b.y,b.r*3,0,Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.fillStyle = "#ff0000";
    ctx.fill();
  });

  // 的
  targets.forEach(t => {
    if(t.alive){
      ctx.beginPath();
      ctx.arc(t.x,t.y,t.r,0,Math.PI*2);
      ctx.fillStyle = "#0f0";
      ctx.fill();
    }
  });
}

// 更新
function update(){
  if(isGameOver) return;

  if(keys["ArrowLeft"] && player.x-player.w/2>0) player.x -= player.speed;
  if(keys["ArrowRight"] && player.x+player.w/2<canvas.width) player.x += player.speed;

  bullets.forEach(b => b.y -= b.speed);
  bullets = bullets.filter(b => b.y+b.r>0);

  bullets.forEach(b => {
    targets.forEach(t => {
      if(t.alive && hit(b,t)){
        t.alive = false;
        b.y = -100;
        score += 100;
        updateHUD();
      }
    });
  });

  if(targets.every(t => !t.alive)){
    isGameOver = true;
    messageEl.textContent = "クリア！ Score: " + score;
    messageEl.classList.remove("hidden");
  }
}

// ループ
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
