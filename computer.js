const username = prompt("Enter your username");

async function downloadUserData() {
    const url = "https://kool.krister.ee/chat/tictactoe"
    try {
        const a = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        })

        await a.json().then((UsersData) => {
            UsersData.sort((a, b) => b.message - a.message)
            const asd = Object.groupBy(UsersData, item => item.name)

            let leaderboardX = {}
            for (let [name, arrData] of Object.entries(asd)) {
                const scoreArr = arrData.map(item => item.message)
                const maxScore = Math.max(...scoreArr)
                leaderboardX[name] = maxScore
            }

            console.log(leaderboardX)

            console.log(asd)
            const leaderboard = document.querySelector('.leaderboard');
            console.log(UsersData)
            let array = []

            for (let i = 0; i < UsersData.length; i++) {
                if (!UsersData[i].name && !UsersData[i].message) continue;
                array.push("<p>" + UsersData[i].name + ": " + UsersData[i].message + "</p>")

            }
            let unique = [...new Set(array)];
            leaderboard.innerHTML += unique.join("");
        });



    } catch (e) {
        console.error(e)
    }
}

downloadUserData()


document.addEventListener('DOMContentLoaded', () => {
    const gridItems = document.querySelectorAll('.grid-item');
    const newGameButton = document.querySelector('.button');
    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let pscore = 0
    let cscore = 0
    const usernameBox = document.querySelector('.player');
    usernameBox.innerHTML = "<p>" + username.toUpperCase() + ": </p>"


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
            const element = document.querySelector('.score1');
            pscore += 1
            element.innerHTML = "<p>" + pscore + "</p>"
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
        const emptyCells = gameState
            .map((cell, index) => (cell === '' ? index : null))
            .filter(index => index !== null);

        if (emptyCells.length === 0) return; // No moves left

        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameState[randomIndex] = 'O';
        gridItems[randomIndex].textContent = 'O';

        if (checkWin()) {
            alert(`0 wins!`);
            const element = document.querySelector('.score2');
            cscore += 1
            element.innerHTML = "<p>" + cscore + "</p>"
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


    newGameButton.addEventListener('click', async function (event) {
        const url = "https://kool.krister.ee/chat/tictactoe"
        const message = {message: pscore, name: username}
        console.log("message outgoing", message)
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        console.log("POST result", result)


    })
    setInterval(checkWin, 3000)
})