// Game board module, which controls the board itself
const GAME_BOARD = (function(){
    let gameBoard = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    
    function tickSquare(x, y, mark){
        gameBoard[y][x] = mark;
    };

    function displayBoard(){
        for(let index = gameBoard.length - 1; index >= 0; index--){
            console.log(gameBoard[index]);
        };
    };

    function checkEndConditions(mark){
        let victoryCondition = [mark, mark, mark].join(''); // join array into a string, for it is not simple to check array equality

        // check horizontals
        for(row of gameBoard){
            if(row.join('') == victoryCondition){
                return 'victory';
            };
        };

        // Here on we shall start working with strings
        let strGameBoard = gameBoard[0].join('') + gameBoard[1].join('') + gameBoard[2].join('');

        // check verticals and diagonals. This regex was not thoroughly checked, but seems to be reliable enough
        let regexVertical = new RegExp(`${mark}.{2}${mark}.{2}${mark}`);
        let regexDiagonal1 = new RegExp(`${mark}.{3}${mark}.{3}${mark}`);
        let regexDiagonal2 = new RegExp(`.{2}${mark}.{1}${mark}.{1}${mark}.{2}`);
        if(regexVertical.test(strGameBoard) || regexDiagonal1.test(strGameBoard) || regexDiagonal2.test(strGameBoard)){
            return 'victory';
        };
    }

    function resetBoard(){
        gameBoard = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    };

    return {tickSquare, displayBoard, checkEndConditions, resetBoard};
}())


// GAME module, which controls the flow of the game
const GAME = (function(){
    let inProgress;

    function startGame(player1, player2){
        inProgress = true;
        turnNumber = 1;
        GAME_BOARD.resetBoard();
        GAME_BOARD.displayBoard();

        while(inProgress){
            player1.makeTurn();
            checkGameFinished(player1);

            if(turnNumber == 5){
                stopGame();
                alert("It's a draw!");
                console.log("It's a draw!");
            };

            if(inProgress){
                player2.makeTurn();
                checkGameFinished(player2);
            };

            turnNumber++;
        };
    };

    function checkGameFinished(player){
        let gameResult = GAME_BOARD.checkEndConditions(player.mark);

        if(gameResult == 'victory'){
            alert(`${player.name} has won the game!`);
            console.log(`${player.name} has won the game!`);
            stopGame();
        }
    }

    function stopGame(){
        inProgress = false;
    };

    return {startGame, stopGame};
}());


// player factory, creates players which can make turns
function createPlayer(name, mark){
    
    function makeTurn(){
        console.log(`Player ${name} is making a turn`);
        let coordinates = prompt(`${name}! Input the x;y :`);
        coordinates = coordinates.split(';');
        let x = Number(coordinates[0]);
        let y = Number(coordinates[1]);

        GAME_BOARD.tickSquare(x, y, mark);
        GAME_BOARD.displayBoard();
    }

    return {makeTurn, mark, name};
};

const playerJohn = createPlayer('John', 'X');
const playerElijah = createPlayer('Elijah', 'O');

GAME.startGame(playerElijah, playerJohn);