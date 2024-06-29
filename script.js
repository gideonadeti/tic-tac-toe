const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (player, index) => {
    if (board[index] === "") {
      board[index] = player.getSymbol();
      return true;
    }
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
    increaseScore,
    getScore,
    getName,
    getSymbol,
  };
};
