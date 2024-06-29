const Gameboard = (() => {
  let board = ['', '', '', '', '', '', '', '', '']

  const getBoard = () => board

  const updateBoard = (player, index) => {
    if (board[index] === '') {
      board[index] = player.getSymbol()
      // Successfully updated the board
      return true
    }
    // Space already occupied
    return false
  }

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', '']
  }

  return {
    getBoard,
    updateBoard,
    resetBoard
  }
})()

const Player = (name, symbol) => {
  let score = 0

  const getName = () => name
  const getScore = () => score
  const increaseScore = () => score++
  const getSymbol = () => symbol

  return {
    getName,
    getScore,
    increaseScore,
    getSymbol
  }
}

const GameController = (() => {
  let tieScore = 0

  let playerX
  let playerO
  let currentPlayer

  const increaseTieScore = () => tieScore++
  const resetTieScore = () => (tieScore = 0)

  const switchTurn = () => {
    currentPlayer = currentPlayer === playerX ? playerO : playerX
  }

  const checkWin = () => {
    const board = Gameboard.getBoard()

    const winningCombinations = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6]
    ]

    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
        return true
      }
    }

    return false
  }

  const checkDraw = () => {
    const board = Gameboard.getBoard()
    // Board is filled and there's no win
    return board.every((cell) => cell !== '') && !checkWin()
  }

  const handleCellClick = (index) => {
    if (Gameboard.updateBoard(currentPlayer, index)) {
      View.updateCell(currentPlayer.getSymbol(), index)
      if (checkWin()) {
        currentPlayer.increaseScore()
        View.showGameOutcome(currentPlayer.getName())
      } else if (checkDraw()) {
        increaseTieScore()
        View.showGameOutcome('tie')
      } else {
        switchTurn()
        View.updateTurn(currentPlayer.getName())
      }
    } else {
      View.updateTurn(currentPlayer.getName(), true)
    }
  }

  const startNewGame = (pX, pO, nextGame = false) => {
    playerX = pX
    playerO = pO
    // Start with playerX
    currentPlayer = playerX

    Gameboard.resetBoard()

    View.clearCells()

    if (!nextGame) {
      View.updatePlayerNames(playerX.getName(), playerO.getName())
    }

    View.updateScores(playerX.getScore(), playerO.getScore(), tieScore)
    View.updateTurn(currentPlayer.getName())
  }

  const startNextGame = () => {
    View.hideGameOutcome()
    startNewGame(playerX, playerO, true)
  }

  const startNewRound = () => {
    resetTieScore()
    Gameboard.resetBoard()

    View.clearGameContainer()
    View.hideGameOutcome()
    View.showPlayersDetails()
  }

  return {
    startNewGame,
    startNextGame,
    startNewRound,
    handleCellClick
  }
})()
