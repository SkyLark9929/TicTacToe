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
        let strSequence;

        // check horizontals
        for(row of gameBoard){
            strSequence = row.join('');
            if(strSequence == victoryCondition){
                return 'victory';
            }
        };

        // check verticals
        for(let i = 0; i <=2; i++){
            strSequence = [gameBoard[0][i], gameBoard[1][i], gameBoard[2][i]].join('');
            if(strSequence == victoryCondition){
                return 'victory';
            }
        }
        
        // // check ascending diagonal
        // for(let i = 0; i <=2; i++){
        //     strSequence = [gameBoard[0][i], gameBoard[1][i], gameBoard[2][i]].join('');
        // }
        // if(strSequence == victoryCondition){
        //     return 'victory';
        // }

        // // check descending diagonal
        // for(let i = 2; i>=0; i--){
        //     strSequence = [gameBoard[0][i], gameBoard[1][i], gameBoard[2][i]].join('');
        // }
        // if(strSequence == victoryCondition){
        //     return 'victory';
        // }

        // // check draw
        // strSequence = '';
        // for(row of gameBoard){
        //     strSequence = strSequence + row.join('');
        // }

        // if(!!strSequence.includes(' ')){
        //     return 'draw';
        // }
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
        GAME_BOARD.resetBoard();
        GAME_BOARD.displayBoard();

        while(inProgress){
            player1.makeTurn();
            checkGameFinished(player1);

            if(inProgress){
                player2.makeTurn();
                checkGameFinished(player2);
            };
        };
    };

    function checkGameFinished(player){
        let gameResult = GAME_BOARD.checkEndConditions(player.mark);

        if(gameResult == 'victory'){
            alert(`${player.name} has won the game!`);
            console.log(`${player.name} has won the game!`);
            stopGame();
        } else if(gameResult == 'draw'){
            alert('DRAW');
            console.log('DRAW');
            stopGame();
        };
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