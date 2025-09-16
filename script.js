function createPlayer(playerName, playerMark) {
    const name = playerName;
    const mark = playerMark;

    const getName = () => name;
    const getMark = () => mark;

    return {getName, getMark};
}

function createSquare() {
    let mark = null;

    const getMark = () => mark;
    const setMark = (input) => { mark = input; };

    return {getMark, setMark};
}

function createGameboard() {
    const board = [[], [], []];

    for (let i = 0; i < 3; i++) 
        for (let j = 0; j < 3; j++) 
            board[i].push(createSquare());
  
    const checkSquare = (i, j) => board[i][j] === null;

    const markSquare = (i, j, mark) => { board[i][j].setMark(mark); };

    // Printing at the standart output (terminal)
    const printBoard = () => { 
        for (let i = 0; i < 3; i++) {
            process.stdout.write(" ");
            for (let j = 0; j < 3; j++) {
                const mark = board[i][j].getMark();
                process.stdout.write((mark === null ? " " : mark));
                process.stdout.write(j < 2 ? " | " : " ");
            }
            process.stdout.write(i < 2 ? "\n-----------\n" : "\n\n");
        }
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
    }

    return {checkSquare, markSquare, printBoard, checkThreeInARow};
}

function createGameController() {
    const gameboard = createGameboard();

    // Two sample players
    const playerOne = createPlayer("Albert", "X");
    const playerTwo = createPlayer("Bethany", "O");

    let currentPlayer = playerOne;

    const getPlayerInput = () => {
        let i, j;
        console.log(`\n${currentPlayer.getName()}'s turn:`);

        // Simulating an input
        [i, j] = gameFlow[flowCounter];
        flowCounter++;

        return [i, j];
    };

    const swapCurrentPlayer = () => { 
        currentPlayer = (currentPlayer === playerOne ? playerTwo : playerOne);
    };

    const checkWinning = () => {
        return gameboard.checkThreeInARow(currentPlayer.getMark());
    };
    
    const playRound = () => {
        const [i, j] = getPlayerInput();

        /**
         * @TODO check if position was already marked
         */
        
        gameboard.markSquare(i, j, currentPlayer.getMark());
        gameboard.printBoard();

        if (checkWinning()) {
            return true;
        }

        swapCurrentPlayer();
        return false;
    };

    const playGame = () => {
        console.log("TIC TAC TOE\n");
        gameboard.printBoard();
        let hasWinner, maxRounds = 9;

        while (maxRounds--) {
            hasWinner = playRound();
            
            if (hasWinner) {
                console.log(`\n${currentPlayer.getName()} has won the game!`);
                return;
            }
        }

        console.log("It's a tie!");
    };

    return {playGame};
}


// TEMPORARY
const gameFlow = [
    [0, 2],
    [0, 0],
    [2, 0],
    [1, 1],
    [2, 2],
    [1, 2],
    [2, 1],
    [0, 1], // extra
    [1, 0]  // extra
];
let flowCounter = 0;

// Start program
const gameController = createGameController();
gameController.playGame();
