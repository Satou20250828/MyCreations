const boardElement = document.getElementById("board");
const difficultySelect = document.getElementById("difficulty");
const newPuzzleBtn = document.getElementById("newPuzzle");
const solveBtn = document.getElementById("solve");
const checkBtn = document.getElementById("check");

let board = [];
let solution = [];

// -------------------------
// ナンプレロジック
// -------------------------
function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  let startRow = Math.floor(row/3)*3;
  let startCol = Math.floor(col/3)*3;
  for (let i = startRow; i < startRow+3; i++) {
    for (let j = startCol; j < startCol+3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
}

function solveBoard(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, i, j, num)) {
            board[i][j] = num;
            if (solveBoard(board)) return true;
            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateFullBoard() {
  let b = Array.from({length:9}, () => Array(9).fill(0));
  solveBoard(b);
  return b;
}

function makePuzzle(board, holes=40) {
  let puzzle = board.map(r => [...r]);
  let count = 0;
  while (count < holes) {
    let row = Math.floor(Math.random()*9);
    let col = Math.floor(Math.random()*9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      count++;
    }
  }
  return puzzle;
}

// -------------------------
// GUI描画
// -------------------------
function renderBoard(puzzle) {
  boardElement.innerHTML = '';
  for (let i=0;i<9;i++){
    for (let j=0;j<9;j++){
      const cell = document.createElement("input");
      cell.type = "text";
      cell.maxLength = 1;
      cell.classList.add("cell");
      if (puzzle[i][j] !== 0){
        cell.value = puzzle[i][j];
        cell.disabled = true;
        cell.classList.add("prefilled");
      }
      boardElement.appendChild(cell);
    }
  }
}

// -------------------------
// ボタン機能
// -------------------------
function newPuzzle() {
  board = generateFullBoard();
  const holes = parseInt(difficultySelect.value);
  const puzzle = makePuzzle(board, holes);
  solution = board.map(r => [...r]);
  renderBoard(puzzle);
}

function fillSolution() {
  const cells = boardElement.querySelectorAll(".cell");
  for (let i=0;i<9;i++){
    for (let j=0;j<9;j++){
      const idx = i*9+j;
      cells[idx].value = solution[i][j];
      cells[idx].disabled = true;
    }
  }
}

function checkAnswer() {
  const cells = boardElement.querySelectorAll(".cell");
  for (let i=0;i<9;i++){
    for (let j=0;j<9;j++){
      const idx = i*9+j;
      const val = parseInt(cells[idx].value);
      cells[idx].classList.remove("correct","wrong");
      if (!val || val !== solution[i][j]){
        cells[idx].classList.add("wrong");
      } else {
        cells[idx].classList.add("correct");
      }
    }
  }
}

// -------------------------
// 初期起動
// -------------------------
newPuzzleBtn.addEventListener("click", newPuzzle);
solveBtn.addEventListener("click", fillSolution);
checkBtn.addEventListener("click", checkAnswer);

newPuzzle();

