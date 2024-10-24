// Game board module, which controls the board itself
const GAME_BOARD = (function(){
    let gameBoard = [];
    let createCell = cell;
    for(let i=0; i<9; i++){
        gameBoard.push(createCell(i));
    };
    
    function tickSquare(index, mark){
        gameBoard[index].setValue(mark, index);
    };

    function consoleLogBoard(){
        console.log(gameBoard.slice(0, 3).map((obj) => obj.getValue()));
        console.log(gameBoard.slice(3, 6).map((obj) => obj.getValue()));
        console.log(gameBoard.slice(6).map((obj) => obj.getValue()));
    };

    function checkEndConditions(mark){
        let strGameBoard = gameBoard.map((obj) => obj.getValue()).join('');
        let regexHorizontal = new RegExp(`.{3}${mark}{3}.{3}|${mark}{3}.{6}|.{6}${mark}{3}`);
        let regexVertical = new RegExp(`${mark}.{2}${mark}.{2}${mark}`);
        let regexDiagonal = new RegExp(`${mark}.{3}${mark}.{3}${mark}|.{2}${mark}.{1}${mark}.{1}${mark}.{2}`);
        if(regexHorizontal.test(strGameBoard) || regexVertical.test(strGameBoard) || regexDiagonal.test(strGameBoard)){
            return 'victory';
        };
        if(!strGameBoard.includes(' ')){
            return 'draw';
        };
    };

    function resetBoard(){
        gameBoard = [];
        for(let i=0; i<9; i++){
            gameBoard.push(createCell(i));
        };
    };

    const getBoard = () => gameBoard;

    return {tickSquare, consoleLogBoard, checkEndConditions, resetBoard, getBoard};
}());

function cell(i){
    let value = ' ';

    const getIndex = () => i;

    const getValue = () => value;

    const setValue = (m) => {value = m}; // mark goes up to here, but it is not saved into the board itself.

    return {getValue, setValue, getIndex};
};

// GAME module, which controls the flow of the game, its start, restart and finish
const gameController = (function(){
    let inProgress = true;
    const board = GAME_BOARD;

    const createPlayer = (name, mark) => {
        return {name, mark};
    };

    const players = [createPlayer('Elijah', 'X'), 
                     createPlayer('Josiah', 'O')]; //TODO: get player names from a dialog; 

    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const promptCoordinates = () => {
        cell_number = prompt('Enter cell number 0-8 (top left to bottom right):');
        return cell_number;
    };

    const makeTurn = (coordinate) => {
        announceTurn(currentPlayer.name);
        board.tickSquare(coordinate, currentPlayer.mark);
        board.consoleLogBoard();
        checkGameFinished(currentPlayer);
        switchPlayer();
    };

    const checkGameFinished = (player) => {
        let gameResult = board.checkEndConditions(player.mark);

        if(gameResult == 'victory'){
            announceVictory(player);
            inProgress = false;
        } else if(gameResult == 'draw'){
            announceDraw();
            inProgress = false;
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

    const getGameStatus = () => inProgress;

    const resetGame = () => {board.resetBoard(); inProgress = true;};

    return {makeTurn, resetGame, getBoard: board.getBoard, getGameStatus};
}());


// Dom controller module which controls the render of the game
function domController(){
    const game = gameController;
    const restartGameModal = document.querySelector('.confirm_new_game');
    const restartButton = document.querySelector('.start_new_game');
    const restartConfirmBtn = document.querySelector('.newgame-yes');
    const boardContainer = document.querySelector('.game_board');
    let inProgress = game.getGameStatus();

    const displayCells = () =>{
        let board = game.getBoard();
        let cellElement;

        boardContainer.textContent = ''; //This method not only alters the text content node, but also removes all the other child nodes.

        for(cell of board){
            let cellValue = cell.getValue();
            console.log(cellValue);
            cellElement = document.createElement('button');
            cellElement.dataset.index = cell.getIndex();
            cellElement.classList.add('cell');
            if(cellValue === 'X'){
                cellElement.dataset.marked = true;
                cellElement.classList.add('cross');
            } else if(cellValue === 'O'){
                cellElement.dataset.marked = true;
                cellElement.classList.add('zero');
            };
            boardContainer.appendChild(cellElement);
        };
    };

    const clickCellEventHandler = (e) => {
        if(e.target.dataset.marked || !inProgress){
            return;
        }
        game.makeTurn(e.target.dataset.index);
        displayCells();
    };

    const restartGame = () => {
        game.resetGame();
        displayCells();
    };

    const restartGameModalHandler = () => {
        restartGameModal.showModal();
    };

    restartButton.addEventListener('click', restartGameModalHandler); // main button shows the modal
    restartConfirmBtn.addEventListener('click', restartGame); // confirm button initiates the restart
    boardContainer.addEventListener('click', clickCellEventHandler);



    displayCells();
}

domController();
