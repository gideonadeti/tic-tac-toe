const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const updateBoard = (index, player) => {
    if (board[index] === "") {
      board[index] = player.getSymbol();
      return true; // Successfully updated the board
    }
    return false; // Space already occupied
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    updateBoard,
    resetBoard,
  };
})();

const Player = ((name, symbol) => {
  let score = 0;

  const getName = () => name;
  const getScore = () => score;
  const increaseScore = () => score++;
  const getSymbol = () => symbol;
  const makeMove = function (index) {
    return Gameboard.updateBoard(index, this);
  };

  return {
    increaseScore,
    getScore,
    getName,
    getSymbol,
    makeMove,
  };
})();
