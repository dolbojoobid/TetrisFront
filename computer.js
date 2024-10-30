



document.addEventListener('DOMContentLoaded', () => {
    const gridItems = document.querySelectorAll('.grid-item');
    const newGameButton = document.querySelector('.button');
    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = Array.from(gridItems).indexOf(clickedCell);

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        if (checkWin()) {
            alert(`${currentPlayer} wins!`);
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            alert(`It's a draw!`);
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (currentPlayer === 'O' && gameActive) {
            computerMove();
        }
    }

    function computerMove() {
        // Find all empty cells
        const emptyCells = gameState
            .map((cell, index) => (cell === '' ? index : null))
            .filter(index => index !== null);

        if (emptyCells.length === 0) return; // No moves left

        // Choose a random empty cell
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameState[randomIndex] = 'O';
        gridItems[randomIndex].textContent = 'O';

        if (checkWin()) {
            alert(`O wins!`);
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            alert(`It's a draw!`);
            gameActive = false;
            return;
        }

        currentPlayer = 'X';
    }

    function checkWin() {
        return winningConditions.some(condition => {
            const [a, b, c] = condition;
            return gameState[a] !== '' && gameState[a] === gameState[b] && gameState[a] === gameState[c];
        });
    }

    function checkDraw() {
        return gameState.every(cell => cell !== '');
    }

    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gridItems.forEach(cell => {
            cell.textContent = '';
        });
    }

    gridItems.forEach(cell => cell.addEventListener('click', handleCellClick));
    newGameButton.addEventListener('click', resetGame);
});