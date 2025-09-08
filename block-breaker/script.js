const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// パドル
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// ボール
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;

// ブロック
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// スコア
let score = 0;

// ゲーム状態
let isRunning = true;

// キー操作
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
document.getElementById("retryBtn").addEventListener("click", resetGame);

function keyDownHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if(e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if(e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    document.getElementById("score").textContent = "スコア: " + score;
                    if(score === brickRowCount*brickColumnCount) {
                        alert("おめでとう！クリアしました！");
                        resetGame();
                        return;
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#ff4500";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#008000";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status === 1) {
                let brickX = c*(brickWidth+brickPadding) + brickOffsetLeft;
                let brickY = r*(brickHeight+brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#1e90ff";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    if(!isRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // 壁で跳ね返り
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if(y + dy < ballRadius) dy = -dy;
    else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) dy = -dy;
        else {
            alert("ゲームオーバー");
            resetGame();
            return;
        }
    }

    // パドル移動（キーボード）
    if(rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
    else if(leftPressed && paddleX > 0) paddleX -= 7;

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function resetGame() {
    // 初期化
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    document.getElementById("score").textContent = "スコア: " + score;

    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }

    isRunning = true;
    draw();
}

// 最初の描画開始
draw();
