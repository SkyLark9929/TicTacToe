const GAME_BOARD = (function(){
    let gameBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    
    function tickSquare(x, y){
        gameBoard[y][x] = 1;
    };

    function displayBoard(){
        for(let index = gameBoard.length - 1; index >= 0; index--){
            console.log(gameBoard[index]);
        };
    };

    function resetBoard(){
        gameBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    };

    return {tickSquare, displayBoard, resetBoard};
}())

