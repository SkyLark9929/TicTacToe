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

    function checkVictory(name, mark){ // Actually, we just need to make a string of it and parse it for repeating patterns of the mark
        for(row of gameBoard){
            let score = 0;
            for(cell of row){
                if(cell == mark){
                    score++;
                }
            }
            if(score == 3){
                GAME.stopGame(name);
                resetBoard();
            }
        }
    }

    function resetBoard(){
        gameBoard = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    };

    return {tickSquare, displayBoard, checkVictory};
}())

const GAME = (function(){
    let inProgress;

    function startGame(player1, player2){
        inProgress = true;

        while(inProgress){
            GAME_BOARD.displayBoard();
            player1.makeTurn();
            GAME_BOARD.checkVictory(player1.name, player1.mark);
            GAME_BOARD.displayBoard();

            if(inProgress){
                player2.makeTurn();
                GAME_BOARD.checkVictory(player2.name, player2.mark);
            };
        };
    };

    function stopGame(winningPlayer){
        inProgress = false;
        GAME_BOARD.displayBoard();
        alert(`${winningPlayer} has won the game!`);
        console.log(`${winningPlayer} has won the game!`)
    };

    return {startGame, stopGame};
}());

function createPlayer(name, mark){
    
    function makeTurn(){
        console.log(`Player ${name} is making a turn`);
        let coordinates = prompt(`${name}! Input the x;y :`);
        coordinates = coordinates.split(';');
        let x = Number(coordinates[0]);
        let y = Number(coordinates[1]);

        GAME_BOARD.tickSquare(x, y, mark);
    }

    return {makeTurn, mark, name};
};

const playerJohn = createPlayer('John', 'X');
const playerElijah = createPlayer('Elijah', 'O');

GAME.startGame(playerElijah, playerJohn);