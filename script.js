let playerO = "O";
let playerX = "X";
let currPlayer; // current symbol (X or O)
let computerSymbol; // computer's symbol
let playerSymbol; // player's symbol
let score = 0;

//               0   1   2   3   4   5   6   7   8
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameCells;
let currentTurn; // will be set only after Start Game
let winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let GameButton;
let gameOver = false;
let wnnr;

window.onload = function () {
  gameCells = document.getElementsByClassName("game-cell");
  wnnr = document.getElementById("wnnr");

  document.getElementById("score").innerText = score;

  // Random X or O for player
  if (Math.random() < 0.5) {
    playerSymbol = "X";
    computerSymbol = "O";
  } else {
    playerSymbol = "O";
    computerSymbol = "X";
  }

  currPlayer = playerSymbol;

  for (let cell of gameCells) {
    cell.addEventListener("click", handlePlayerMove);
  }

  GameButton = document.getElementById("game-button");
  GameButton.innerText = "Start Game";
  GameButton.addEventListener("click", startGame);

  // Game does NOT start automatically!
};

// ---------------------- PLAYER MOVE --------------------------
function handlePlayerMove() {
  if (gameOver || currentTurn !== "player") return;

  const index = parseInt(this.getAttribute("data-cell-index"));
  if (gameBoard[index] !== "") return;

  makeMove(index, playerSymbol);

  if (!gameOver) {
    currentTurn = "computer";
    setTimeout(computerMove, 400);
  }
}

// ---------------------- MAKE A MOVE ---------------------------
function makeMove(index, symbol) {
  gameBoard[index] = symbol;
  gameCells[index].innerText = symbol;

  checkWinner(symbol);
}

// ---------------------- WIN CHECK ----------------------------
function checkWinner(symbol) {
  for (let cond of winningConditions) {
    let [a, b, c] = cond;

    if (gameBoard[a] === symbol && gameBoard[b] === symbol && gameBoard[c] === symbol) {
      cond.forEach((idx) => gameCells[idx].classList.add("winning-game-cell"));

      gameOver = true;
      wnnr.innerText = `${symbol} Wins!`;
      wnnr.style.visibility = "visible";
      wnnr.style.opacity = "1";

      if (symbol === playerSymbol) {
        score++;
        document.getElementById("score").innerText = score;
      }

      return true;
    }
  }

  // Tie
  if (!gameBoard.includes("") && !gameOver) {
    gameOver = true;
    wnnr.innerText = "Draw!";
    wnnr.style.visibility = "visible";
    wnnr.style.opacity = "1";
  }

  return false;
}

// ---------------------- COMPUTER AI --------------------------
function computerMove() {
  if (gameOver) return;

  let move;

  // 1. Try to win
  move = findBestMove(computerSymbol);
  if (move !== null) {
    makeMove(move, computerSymbol);
    computerEndsMove();
    return;
  }

  // 2. Block player
  move = findBestMove(playerSymbol);
  if (move !== null) {
    makeMove(move, computerSymbol);
    computerEndsMove();
    return;
  }

  // 3. Take center
  if (gameBoard[4] === "") {
    makeMove(4, computerSymbol);
    computerEndsMove();
    return;
  }

  // 4. Corners
  let corners = [0, 2, 6, 8].filter((i) => gameBoard[i] === "");
  if (corners.length > 0) {
    let c = corners[Math.floor(Math.random() * corners.length)];
    makeMove(c, computerSymbol);
    computerEndsMove();
    return;
  }

  // 5. Random empty
  let empty = gameBoard
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);

  makeMove(empty[0], computerSymbol);
  computerEndsMove();
}

// ---------------------- AFTER COMPUTER MOVE ------------------
function computerEndsMove() {
  if (!gameOver) {
    currentTurn = "player";
    showTurnMessage("Your Turn");
  }
}

// ---------------------- FIND BEST MOVE ------------------------
function findBestMove(symbol) {
  for (let cond of winningConditions) {
    let [a, b, c] = cond;
    let line = [gameBoard[a], gameBoard[b], gameBoard[c]];

    if (line.filter((v) => v === symbol).length === 2 && line.includes("")) {
      return cond[line.indexOf("")];
    }
  }
  return null;
}

// ---------------------- START / RESTART -----------------------
function startGame() {
  GameButton.innerText = "Restart Game";

  gameOver = false;
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currPlayer = playerSymbol;

  wnnr.innerText = "";
  wnnr.style.visibility = "hidden";
  wnnr.style.opacity = "0";

  for (let cell of gameCells) {
    cell.innerText = "";
    cell.classList.remove("winning-game-cell");
  }

  // Choose who starts
  currentTurn = Math.random() < 0.5 ? "player" : "computer";

  if (currentTurn === "computer") {
    setTimeout(computerMove, 1000);
  } else {
    showTurnMessage("Your Turn");
  }
}

// ---------------------- TURN MESSAGE -------------------------
function showTurnMessage(msg) {
  wnnr.innerText = msg;
  wnnr.style.visibility = "visible";
  wnnr.style.opacity = "1";

  setTimeout(() => {
    if (!gameOver) {
      wnnr.style.opacity = "0";
      wnnr.style.visibility = "hidden";
    }
  }, 1000);
}
