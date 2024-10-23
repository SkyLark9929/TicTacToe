// Game board module, which controls the board itself
const GAME_BOARD = (function(){
    let gameBoard = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    
    function tickSquare(index, mark){
        gameBoard[index] = mark;
    };

    function consoleLogBoard(){
        console.log(gameBoard.slice(0, 3));
        console.log(gameBoard.slice(3, 6));
        console.log(gameBoard.slice(6));
    };

    function checkEndConditions(mark){
        let strGameBoard = gameBoard.join('');
        let regexHorizontal = new RegExp(`.{3}${mark}{3}.{3}|${mark}{3}.{6}|.{6}${mark}{3}`);
        let regexVertical = new RegExp(`${mark}.{2}${mark}.{2}${mark}`);
        let regexDiagonal = new RegExp(`${mark}.{3}${mark}.{3}${mark}|.{2}${mark}.{1}${mark}.{1}${mark}.{2}`);
        if(regexHorizontal.test(strGameBoard) || regexVertical.test(strGameBoard) || regexDiagonal.test(strGameBoard)){
            return 'victory';
        };
        if(!gameBoard.includes(' ')){
            return 'draw';
        };
    };

    function resetBoard(){
        gameBoard = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    };

    return {tickSquare, consoleLogBoard, checkEndConditions, resetBoard};
}());


// GAME module, which controls the flow of the game, its start, restart and finish
const gameController = (function(){

    const board = GAME_BOARD;

    const createPlayer = (name, mark) => {
        return {name, mark};
    };

    const players = [createPlayer('Elijah', 'X'), 
                     createPlayer('Josiah', 'O')];

    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const promptCoordinates = () => {
        cell_number = prompt('Enter cell number 0-8 (top left to bottom right):');
        return cell_number;
    };

    const makeTurn = () => {
        announceTurn(currentPlayer.name);
        board.tickSquare(promptCoordinates(), currentPlayer.mark);
        board.consoleLogBoard();
        checkGameFinished(currentPlayer);
        switchPlayer();
    };

    const checkGameFinished = (player) => {
        let gameResult = board.checkEndConditions(player.mark);

        if(gameResult == 'victory'){
            announceVictory(player);
        } else if(gameResult == 'draw'){
            announceDraw();
        };
    };

    const announceTurn = (name) => {
        console.log(`${name} is making a turn:`);
    };

    const announceVictory = (player) => {
        alert(`${player.name} has won the game!`);
        console.log(`${player.name} has won the game!`);
    };

    const announceDraw = () => {
        alert(`It is a draw!`)
        console.log('It is a draw!');
    };

    const resetGame = () => {board.resetBoard()};

    return {makeTurn, resetGame};
}());

game = gameController
