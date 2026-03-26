const menu = document.querySelector('.menu');
const settings = document.querySelector('.settings');
const game = document.querySelector('.game');
const playerSelection = document.getElementById('playerSelection');
const board = document.querySelector('.board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const settingsButton = document.getElementById('settingsButton');
const backToMenuButton = document.getElementById('backToMenu');
const size3x3Button = document.getElementById('size3x3');
const size4x4Button = document.getElementById('size4x4');
const size5x5Button = document.getElementById('size5x5');
const selectXButton = document.getElementById('selectX');
const selectOButton = document.getElementById('selectO');

let currentPlayer = 'X';
let playerSymbol = null;
let gameMode = null;
let boardState = [];
let gridSize = 3; // Taille de la grille par défaut
const WIN_LENGTH = 3; // Nombre de symboles alignés pour gagner

function createGrid(size) {
    gridSize = size;
    boardState = Array(size * size).fill(null);
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.cellIndex = i;
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
    }
}

function checkWin() {
    for (let i = 0; i < gridSize; i++) {
        if (checkLine(boardState.slice(i * gridSize, i * gridSize + gridSize))) return currentPlayer; // Row
        if (checkLine(Array.from({ length: gridSize }, (_, j) => boardState[i + j * gridSize]))) return currentPlayer; // Column
    }
    if (checkLine(Array.from({ length: gridSize }, (_, i) => boardState[i * gridSize + i]))) return currentPlayer; // Main diagonal
    if (checkLine(Array.from({ length: gridSize }, (_, i) => boardState[(i + 1) * gridSize - i - 1]))) return currentPlayer; // Anti-diagonal
    return null;
}

function checkLine(line) {
    for (let i = 0; i <= line.length - WIN_LENGTH; i++) {
        if (line.slice(i, i + WIN_LENGTH).every(cell => cell === currentPlayer)) {
            return true;
        }
    }
    return false;
}

function handleClick(event) {
    const index = parseInt(event.target.dataset.cellIndex, 10);

    if (boardState[index] || checkWin()) return;

    boardState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    const winner = checkWin();
    if (winner) {
        message.textContent = `Joueur ${winner} a gagné !`;
        return;
    } else if (boardState.every(cell => cell)) {
        message.textContent = "Match nul !";
        return;
    }

    if (gameMode === 'vsComputer' && currentPlayer === playerSymbol) {
        currentPlayer = playerSymbol === 'X' ? 'O' : 'X';
        setTimeout(computerMove, 500);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function computerMove() {
    const bestMove = findBestMove(playerSymbol) || findBestMove(playerSymbol === 'X' ? 'O' : 'X');
    
    if (bestMove === null) {
        const availableMoves = boardState.map((state, index) => state === null ? index : null).filter(index => index !== null);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        move = bestMove;
    }
    
    boardState[move] = currentPlayer;
    board.children[move].textContent = currentPlayer;

    const winner = checkWin();
    if (winner) {
        message.textContent = `Joueur ${winner} a gagné !`;
    } else if (boardState.every(cell => cell)) {
        message.textContent = "Match nul !";
    } else {
        currentPlayer = playerSymbol; 
    }
}

function findBestMove(symbol) {
    const winningMove = boardState.findIndex((state, index) => {
        if (state === null) {
            const tempBoard = [...boardState];
            tempBoard[index] = symbol;
            return checkWinWithBoard(tempBoard, symbol);
        }
        return false;
    });
    if (winningMove !== -1) return winningMove;

    const opponentSymbol = symbol === 'X' ? 'O' : 'X';
    const blockingMove = boardState.findIndex((state, index) => {
        if (state === null) {
            const tempBoard = [...boardState];
            tempBoard[index] = opponentSymbol;
            return checkWinWithBoard(tempBoard, opponentSymbol);
        }
        return false;
    });
    return blockingMove !== -1 ? blockingMove : null;
}

function checkWinWithBoard(board, symbol) {
    for (let i = 0; i < gridSize; i++) {
        if (checkLine(board.slice(i * gridSize, i * gridSize + gridSize))) return true; // Row
        if (checkLine(Array.from({ length: gridSize }, (_, j) => board[i + j * gridSize]))) return true; // Column
    }
    if (checkLine(Array.from({ length: gridSize }, (_, i) => board[i * gridSize + i]))) return true; // Main diagonal
    if (checkLine(Array.from({ length: gridSize }, (_, i) => board[(i + 1) * gridSize - i - 1]))) return true; // Anti-diagonal
    return false;
}

function restartGame() {
    boardState = Array(gridSize * gridSize).fill(null);
    Array.from(board.children).forEach(cell => cell.textContent = '');
    message.textContent = '';
    currentPlayer = playerSymbol || 'X';
    if (gameMode === 'vsComputer' && playerSymbol === 'O') {
        currentPlayer = 'O';
    }
}

function startGame(mode) {
    menu.style.display = 'none';
    settings.style.display = 'none';
    game.style.display = 'block';
    playerSelection.style.display = mode === 'vsComputer' ? 'block' : 'none';
    gameMode = mode;
    restartGame();
}

function setPlayerSymbol(symbol) {
    playerSymbol = symbol;
    currentPlayer = playerSymbol;
    playerSelection.style.display = 'none';
    restartGame();
}

function showMenu() {
    menu.style.display = 'block';
    settings.style.display = 'none';
    game.style.display = 'none';
}

function showSettings() {
    menu.style.display = 'none';
    settings.style.display = 'block';
    game.style.display = 'none';
}

function initializeGame() {
    createGrid(gridSize); 
    showMenu(); 
}

size3x3Button.addEventListener('click', () => { createGrid(3); showMenu(); });
size4x4Button.addEventListener('click', () => { createGrid(4); showMenu(); });
size5x5Button.addEventListener('click', () => { createGrid(5); showMenu(); });
settingsButton.addEventListener('click', showSettings);
backToMenuButton.addEventListener('click', showMenu);

document.getElementById('modeTwoPlayers').addEventListener('click', () => startGame('twoPlayers'));
document.getElementById('modeVsComputer').addEventListener('click', () => startGame('vsComputer'));
document.getElementById('selectX').addEventListener('click', () => setPlayerSymbol('X'));
document.getElementById('selectO').addEventListener('click', () => setPlayerSymbol('O'));
restartButton.addEventListener('click', restartGame);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        showMenu();
    }
});

function findBestMove(symbol) {
    const opponentSymbol = symbol === 'X' ? 'O' : 'X';

    // Fonction pour vérifier s'il y a une victoire potentielle
    function isWinningMove(board, index, symbol) {
        const tempBoard = [...board];
        tempBoard[index] = symbol;
        return checkWinWithBoard(tempBoard, symbol);
    }

    // Chercher le coup gagnant ou bloquer le coup gagnant de l'adversaire
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === null) {
            if (isWinningMove(boardState, i, symbol)) return i;
            if (isWinningMove(boardState, i, opponentSymbol)) return i;
        }
    }

    // Si aucune victoire ou blocage, faire un coup aléatoire
    const availableMoves = boardState.map((state, index) => state === null ? index : null).filter(index => index !== null);
    return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
}

function checkWin() {
    const winner = checkWinWithBoard(boardState, currentPlayer);
    return winner ? currentPlayer : null;
}

function checkWinWithBoard(board, symbol) {
    for (let i = 0; i < gridSize; i++) {
        if (checkLine(board.slice(i * gridSize, i * gridSize + gridSize), symbol)) return true; // Ligne
        if (checkLine(Array.from({ length: gridSize }, (_, j) => board[i + j * gridSize]), symbol)) return true; // Colonne
    }
    if (checkLine(Array.from({ length: gridSize }, (_, i) => board[i * gridSize + i]), symbol)) return true; // Diagonale principale
    if (checkLine(Array.from({ length: gridSize }, (_, i) => board[(i + 1) * gridSize - i - 1]), symbol)) return true; // Diagonale inverse
    return false;
}

function checkLine(line, symbol) {
    for (let i = 0; i <= line.length - WIN_LENGTH; i++) {
        if (line.slice(i, i + WIN_LENGTH).every(cell => cell === symbol)) {
            return true;
        }
    }
    return false;
}

function computerMove() {
    const bestMove = findBestMove(currentPlayer) || findBestMove(currentPlayer === 'X' ? 'O' : 'X');
    
    let move;
    if (bestMove === null) {
        const availableMoves = boardState.map((state, index) => state === null ? index : null).filter(index => index !== null);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        move = bestMove;
    }
    
    boardState[move] = currentPlayer;
    board.children[move].textContent = currentPlayer;

    const winner = checkWin();
    if (winner) {
        message.textContent = `Joueur ${winner} a gagné !`;
    } else if (boardState.every(cell => cell)) {
        message.textContent = "Match nul !";
    } else {
        currentPlayer = playerSymbol; 
    }
}

initializeGame();