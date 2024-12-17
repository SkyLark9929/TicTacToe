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
    let announcement = `${currentPlayer.name} is making a turn:`;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const forcePlayer0Turn = () => {
        currentPlayer = players[0];
    };

    const promptCoordinates = () => { // not in use anymore
        cell_number = prompt('Enter cell number 0-8 (top left to bottom right):');
        return cell_number;
    };

    const makeTurn = (coordinate) => {
        board.tickSquare(coordinate, currentPlayer.mark);
        board.consoleLogBoard();
        checkGameFinished(currentPlayer);
        switchPlayer(); // Need to change this so that players[0] is always first one to go
        if(inProgress){
            announceTurn(currentPlayer.name);
        };
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
        announcement = `${name} is making a turn:`;
    };

    const announceVictory = (player) => {
        announcement = `${player.name} has won the game!`;
    };

    const announceDraw = () => {
        announcement = `It is a draw!`;
    };

    const getGameStatus = () => inProgress;

    const resetGame = () => {board.resetBoard(); inProgress = true; forcePlayer0Turn();};

    const getAnnouncement = () => announcement;

    const changePlayerNames = (name1, name2) => {
        players[0].name = name1;
        players[1].name = name2;
        announcement = `${currentPlayer.name} is making a turn:`;
    };

    return {makeTurn, resetGame, getBoard: board.getBoard, getGameStatus, getAnnouncement, changePlayerNames};
}());


// Dom controller module which controls the render of the game
function domController(){
    const game = gameController;
    const announceDiv = document.querySelector('.announcer');
    const restartGameModal = document.querySelector('.confirm_new_game');
    const restartButton = document.querySelector('.start_new_game');
    const restartConfirmBtn = document.querySelector('.newgame-yes');
    const boardContainer = document.querySelector('.game_board');
    const player1NameInput = document.querySelector('#player1-name');
    const player2NameInput = document.querySelector('#player2-name');

    const initializeDOM = () => {
        announceDiv.textContent = 'Press "Start New Game"';
        let cellMock;
        for(let i = 0; i < 9; i++){
            cellMock = document.createElement('button');
            cellMock.classList.add('cell');
            cellMock.disabled = true;
            boardContainer.appendChild(cellMock);
        }
    }

    const displayCells = () =>{
        let board = game.getBoard();
        let cellElement;
        announceDiv.textContent = game.getAnnouncement();

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
        let inProgress = game.getGameStatus();

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

    const updatePlayerNames = () => {
        let player1Name = player1NameInput.value;
        let player2Name = player2NameInput.value;
        gameController.changePlayerNames(player1Name, player2Name);
    }

    restartButton.addEventListener('click', restartGameModalHandler); // main button shows the modal
    restartConfirmBtn.addEventListener('click', updatePlayerNames);
    restartConfirmBtn.addEventListener('click', restartGame); // confirm button initiates the restart
    boardContainer.addEventListener('click', clickCellEventHandler);

    initializeDOM();
}

domController();
