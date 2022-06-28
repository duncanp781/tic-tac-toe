const game = document.querySelector('.game');
const board = document.querySelector('.board');

const gameBoard = (function(){
  let board = new Array(3).fill(0).map(row => row = Array(3));

  let _currentSymbol = 'X';


  const _swapSymbol = () => {
    if (_currentSymbol == 'X') {
      _currentSymbol = 'O';
    }else{
      _currentSymbol = 'X';
    }
  }
  const _add = (letter, i, j) => {
    if(board[i][j] == undefined){
      board[i][j] = letter;
      if(_checkWin(i,j)){
        let result = (letter == 'X') ? 'win' : 'lose';
        displayController.endGame(result);
      }
      _swapSymbol();
    }
  }

  const clear = () => {
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        board[i][j] = undefined;
      }
    }
    _currentSymbol = 'X';
    displayController.displayBoard();
  }

  const tryMove = (i , j) => {
    let curr = _currentSymbol;
    _add(curr, i, j);
    displayController.addMove(curr, i, j);
  }

  const getSymbol = (i,j) => {
    return board[i][j];
  }

  const _getRow = (i,j) =>{
    return board[i];
  }

  const _getCol = (i,j) => {
    let out = [];
    for (row of board){
      out.push(row[j]);
    }
    return out;
  }

  const _leftDiag = () => {
    let out = [];
    for(i = 0; i < 3; i++){
      out.push(board[i][i]);
    }
    return out;
  };

  const _rightDiag = () => {
    let out = [];
    for(i = 0; i < 3; i++){
      out.push(board[i][2-i]);
    }
    return out;
  };

  const _crossing = (i,j) => {
    let out = [];
    out.push(_getRow(i,j));
    out.push(_getCol(i,j))
    if(i == j) out.push(_leftDiag());
    if(i == 2-j) out.push(_rightDiag());
    return out;
  }

  const _checkWin = (i,j) => {
    let toCheck = _crossing(i,j);
    for(arr of toCheck){
      if(_checkArr(arr)) return true;
    }
    return false;
  }

  //Return true if all are the same and not undefined
  const _checkArr = (arr) => {
    let symbol = arr[0];
    if(symbol == undefined) return false;
    for(char of arr){
      if(char != symbol) return false;
    }
    return true;
  }

  return{
    clear,
    tryMove,
    getSymbol,
  }

})();

const displayController = (function() {
  const resultText = document.querySelector('.result');

  const _createDisplay = () => {
    for(let i = 0; i < 9; i++){
      const cell = document.createElement('div');
      cell.setAttribute('id', i);
      cell.classList.add('cell');
      cell.addEventListener('click', () => _move(i));

      board.appendChild(cell);
    }
  }

  const _move = (k) =>{
    let [i,j] = _oneToTwo(k);
    gameBoard.tryMove(i, j);
  }

  const _updateCell = (symbol,i) => {
    const cell = document.getElementById(i);
    cell.innerHTML = symbol ? symbol : ' ';
  }

  const _twoToOne = (i,j) => {
    return 3*i + j;
  }

  const _oneToTwo = (k) =>{
    return [Math.floor(k/3), k%3];
  }

  const displayBoard = () => {
    for(let i = 0; i < 9; i++){
      let coords = _oneToTwo(i);
      let symbol = gameBoard.getSymbol(...coords);
      _updateCell(symbol, i);
    }
  }

  const initialize = () => {
    _createDisplay();
    displayBoard();

    const clear = document.createElement('button');
    clear.setAttribute('id', 'clear');
    clear.textContent = 'Restart Game'
    clear.addEventListener('click', _restart);
    game.appendChild(clear);
  }

  const addMove = (symbol, i, j) => {
    let tag = _twoToOne(i,j);
    _updateCell(symbol, tag);
  }

  const _restart = () => {
    gameBoard.clear();
    resultText.textContent = '';
  }
  const endGame = (result) =>{
    
    let text;
    switch(result){
      case 'win':
        text = 'Player 1 Wins!';
      break;
      case 'lose':
        text = 'Player 2 Wins!';
      break;
      case 'tie':
        text = 'Tie!';
      break;
    }
    resultText.textContent = text;
    game.appendChild(resultText);
  }

  return{
    initialize,
    displayBoard,
    addMove,
    endGame,
  }
})();


displayController.initialize();
