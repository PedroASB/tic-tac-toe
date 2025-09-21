function createPlayer(playerName, playerMark) {
    const name = playerName;
    const mark = playerMark;
    let score = 0;

    const getName = () => name;
    const getMark = () => mark;
    const getScore = () => score;
    const increaseScore = () => { score++; };
    const resetScore = () => { score = 0; };

    return {getName, getMark, getScore, increaseScore, resetScore};
}

function createSquare() {
    let mark = null;

    const getMark = () => mark;
    const setMark = (input) => { mark = input; };

    return {getMark, setMark};
}

function createGameboard() {
    const board = [[], [], []];
    let squaresMarked = 0;

    // Allocate squares
    for (let i = 0; i < 3; i++) 
        for (let j = 0; j < 3; j++) 
            board[i].push(createSquare());
  
    const markSquare = (i, j, mark) => {
        board[i][j].setMark(mark);
        squaresMarked++;
    };

    const isFreeSquare = (i, j) => board[i][j].getMark() === null;

    const clearBoard = () => {
        for (let i = 0; i < 3; i++) 
            for (let j = 0; j < 3; j++) 
                board[i][j].setMark(null);
        squaresMarked = 0;
    };

    const checkThreeInARow = (mark) => {
        // Check rows
        if (board[0][0].getMark() === mark && board[0][1].getMark() === mark && board[0][2].getMark() === mark) return true;
        if (board[1][0].getMark() === mark && board[1][1].getMark() === mark && board[1][2].getMark() === mark) return true;
        if (board[2][0].getMark() === mark && board[2][1].getMark() === mark && board[2][2].getMark() === mark) return true;

        // Check columns
        if (board[0][0].getMark() === mark && board[1][0].getMark() === mark && board[2][0].getMark() === mark) return true;
        if (board[0][1].getMark() === mark && board[1][1].getMark() === mark && board[2][1].getMark() === mark) return true;
        if (board[0][2].getMark() === mark && board[1][2].getMark() === mark && board[2][2].getMark() === mark) return true;

        // Check diagonals
        if (board[0][0].getMark() === mark && board[1][1].getMark() === mark && board[2][2].getMark() === mark) return true;
        if (board[0][2].getMark() === mark && board[1][1].getMark() === mark && board[2][0].getMark() === mark) return true;

        return false;
    };

    const isFullyMarked = () => squaresMarked >= 9;

    const getBoard = () => board;

    return {markSquare, isFreeSquare, clearBoard, checkThreeInARow, isFullyMarked, getBoard};
}

function createGameController() {
    const gameboard = createGameboard();
    let playerOne, playerTwo, currentPlayer, totalTies;

    const getPlayerOne = () => playerOne;

    const getPlayerTwo = () => playerTwo;

    const getCurrentPlayer = () => currentPlayer;

    const getTotalTies = () => totalTies;

    const swapCurrentPlayer = () => { 
        currentPlayer = (currentPlayer === playerOne ? playerTwo : playerOne);
    };

    const checkWinning = () => gameboard.checkThreeInARow(currentPlayer.getMark());

    const checkTie = () => gameboard.isFullyMarked();

    const getBoard = () => gameboard.getBoard();
    
    const startNewRound = () => {
        currentPlayer = playerOne;
        gameboard.clearBoard();
    };

    const playTurn = (squarePosition) => {
        const [i, j] = squarePosition;

        // Check if position was already marked
        if (!gameboard.isFreeSquare(i, j)) {
            return;
        }
       
        gameboard.markSquare(i, j, currentPlayer.getMark());

        if (checkWinning()) {
            currentPlayer.increaseScore();
            startNewRound();
        }
        else if (checkTie()) {
            totalTies++;
            startNewRound();
        }
        else {
            swapCurrentPlayer();
        }
    };

    const startGame = (playerOneName, playerOneMark, playerTwoName, playerTwoMark) => {
        playerOne = createPlayer(playerOneName, playerOneMark);
        playerTwo = createPlayer(playerTwoName, playerTwoMark);
        totalTies = 0;
        startNewRound();
    };

    return {playTurn, startGame, getPlayerOne, getPlayerTwo, getCurrentPlayer, getTotalTies, getBoard};
}

function createScreenController() {
    const squares = Array.from(document.querySelectorAll(".square"));
    const playerOne = document.querySelector("#player-one");
    const playerTwo = document.querySelector("#player-two");
    const tiesOutput = document.querySelector("#ties output");
    const statusSpan = document.querySelector("#status span");
    const gameInitializationContent = document.querySelector("#game-initialization");
    const gameplayContent = document.querySelector("#gameplay");
    const gameController = createGameController();
    const squarePositionMap = {
        "square-1": [0, 0],
        "square-2": [0, 1],
        "square-3": [0, 2],
        "square-4": [1, 0],
        "square-5": [1, 1],
        "square-6": [1, 2],
        "square-7": [2, 0],
        "square-8": [2, 1],
        "square-9": [2, 2]
    };

    const updateStatus = () => {
        const currentPlayer = gameController.getCurrentPlayer();
        statusSpan.innerText = currentPlayer.getName();
        statusSpan.setAttribute("mark", currentPlayer.getMark());
    };

    const updateScoreboard = () => {
        playerOne.querySelector("output").innerText = gameController.getPlayerOne().getScore();
        playerTwo.querySelector("output").innerText = gameController.getPlayerTwo().getScore();
        tiesOutput.innerText = gameController.getTotalTies();
    };

    const updateGameboard = () => {
        const board = gameController.getBoard();
        let squareDivIndex = 0;
    
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const mark = board[i][j].getMark();
                const squareDiv = squares[squareDivIndex];
                squareDiv.innerHTML = "";
                if (mark) {
                    const markDiv = document.createElement("div");
                    markDiv.classList.add(mark);
                    squareDiv.appendChild(markDiv);
                }
                squareDiv.setAttribute("mark", mark ? mark : "none");
                squareDivIndex++;
            }
        }
    };
    
    const handleSquareClick = (event) => {
        // When clicking on a child node (i.e. it's already marked)
        if (!event.target.id) {
            return;
        }

        const squarePosition = squarePositionMap[event.target.id];

        gameController.playTurn(squarePosition);
        updateGameboard();
        updateScoreboard();
        updateStatus();
    };

    const handleFormData = () => {
        const form = gameInitializationContent.querySelector("form");
        const formData = new FormData(form);
        let playerOneName, playerTwoName;
        
        for (const [key, value] of formData) {
            if (key === "player-one-name") playerOneName = value || "Player 1";
            if (key === "player-two-name") playerTwoName = value || "Player 2";
        }

        form.reset();
        return {playerOneName, playerTwoName};
    };

    const startGame = () => {
        let {playerOneName, playerTwoName} = handleFormData();

        gameInitializationContent.style.display = "none";
        gameplayContent.style.display = "flex";

        gameController.startGame(playerOneName, "cross", playerTwoName, "nought");
        playerOne.querySelector(".label").innerText = playerOneName;
        playerTwo.querySelector(".label").innerText = playerTwoName;
        updateGameboard();
        updateScoreboard();
        updateStatus();
    };

    const newGame = () => {
        if (window.confirm("Do you want to start a new game?")) {
            gameInitializationContent.style.display = "flex";
            gameplayContent.style.display = "none";
        }
    };

    const initialize = () => {
        const startGameButton = document.querySelector("button#start-game");
        const newGameButton = document.querySelector("button#new-game");

        startGameButton.addEventListener("click", startGame);
        newGameButton.addEventListener("click", newGame);
        squares.forEach((square) => { square.addEventListener("click", handleSquareClick); });
    };

    return {initialize};
}


// Start program
const screenController = createScreenController();
screenController.initialize();
