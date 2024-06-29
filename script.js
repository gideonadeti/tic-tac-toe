const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (player, index) => {
    if (board[index] === "") {
      board[index] = player.getSymbol();
      // Successfully updated the board
      return true;
    }
    // Space already occupied
    return false;
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

const Player = (name, symbol) => {
  let score = 0;

  const getName = () => name;
  const getScore = () => score;
  const increaseScore = () => score++;
  const getSymbol = () => symbol;

  return {
    getName,
    getScore,
    increaseScore,
    getSymbol,
  };
};
