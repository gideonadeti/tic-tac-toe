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
      resetTieScore()
    }

    View.updateScores(playerX.getScore(), playerO.getScore(), tieScore)
    View.updateTurn(currentPlayer.getName())
  }

  const startNextGame = () => {
    startNewGame(playerX, playerO, true)
  }

  return {
    startNewGame,
    startNextGame,
    handleCellClick
  }
})()

const View = (() => {
  const playerNamesModal = document.querySelector('#player-names-modal')
  const gameOutcomeModal = document.querySelector('#game-outcome-modal')
  const playersNamesForm = playerNamesModal.querySelector('form')
  const closeModalBtns = document.querySelectorAll('.close-modal')

  const gameContainer = document.querySelector('.game-container')
  const newGameBtn = document.querySelector('.new-game')
  const nextGameBtn = document.querySelector('.next-game')

  nextGameBtn.addEventListener('click', GameController.startNextGame())
  newGameBtn.addEventListener('click', () => {
    clearGameContainer()
    hideModal(gameOutcomeModal)
    playerNamesModal.showModal()
  })

  closeModalBtns.forEach((closeModalBtn) => {
    closeModalBtn.addEventListener('click', () => {
      // Select the form within the (closest) modal
      const form = closeModalBtn.closest('.modal').querySelector('form')

      if (form) {
        form.reset()
        form.classList.remove('was-validated')
      }
    })
  })

  playersNamesForm.addEventListener('submit', (event) => {
    console.log('here')
    event.preventDefault()

    if (!playersNamesForm.checkValidity()) {
      event.stopPropagation()
    }

    playersNamesForm.classList.add('was-validated')

    if (playersNamesForm.checkValidity()) {
      const { playerXName, playerOName } = getPlayersNames()
      const { playerX, playerO } = createPlayers(playerXName, playerOName)

      GameController.startNewGame(playerX, playerO)

      hideModal(playerNamesModal)

      playersNamesForm.reset()
      playersNamesForm.classList.remove('was-validated')
    }
  })

  const hideModal = (modal) => {
    bootstrap.Modal.getInstance(modal).hide()
  }

  const getPlayersNames = () => {
    const playerXName = playersNamesForm.querySelector('.player-X-name')
    const playerOName = playersNamesForm.querySelector('.player-O-name')
    return { playerXName, playerOName }
  }

  const createPlayers = (playerXName, playerOName) => {
    const playerX = Player(playerXName, 'X')
    const playerO = Player(playerOName, 'O')

    return { playerX, playerO }
  }

  const updatePlayerNames = (playerXName, playerOName) => {
    gameContainer.querySelector(
      '.player-X-name'
    ).textContent = `${playerXName} (X)`
    gameContainer.querySelector(
      '.player-O-name'
    ).textContent = `${playerOName} (O)`
    gameContainer.querySelector('.vs').textContent = 'Vs.'
  }

  const updateScores = (playerXScore, playerOScore, tieScore) => {
    gameContainer.querySelector('.player-X-score').textContent = playerXScore
    gameContainer.querySelector('.player-O-score').textContent = playerOScore
    gameContainer.querySelector('.tie-score').textContent = tieScore
  }

  const updateTurn = (currentPlayer, alert = false) => {
    const turnSpan = gameContainer.querySelector('.turn')
    turnSpan.textContent = alert
      ? `${currentPlayer}, that space is already occupied!`
      : `${currentPlayer}'s turn`
  }

  const updateCell = (cellId, playerSymbol) => {
    document.querySelector(`#${cellId}`).textContent = playerSymbol
  }

  const clearCells = () => {
    document.querySelectorAll('.cell').forEach((cell) => {
      cell.textContent = ''
    })
  }

  const showGameOutcome = (winner) => {
    gameOutcomeModal.querySelector('.outcome').textContent =
      winner === 'tie' ? "It's a tie!" : `${winner} wins!`
    gameOutcomeModal.showModal()
  }

  const clearGameContainer = () => {
    gameContainer.querySelector('.player-X-name').textContent = ''
    gameContainer.querySelector('.player-O-name').textContent = ''
    gameContainer.querySelector('.vs').textContent = ''
    gameContainer.querySelector('.player-X-score').textContent = ''
    gameContainer.querySelector('.player-O-score').textContent = ''
    gameContainer.querySelector('.tie-score').textContent = ''
    gameContainer.querySelector('.turn').textContent = ''
    clearCells()
  }

  document.querySelectorAll('.cell').forEach((cell) => {
    cell.addEventListener('click', (event) =>
      GameController.handleCellClick(event.target.id)
    )
  })

  return {
    updatePlayerNames,
    updateScores,
    updateTurn,
    updateCell,
    clearCells,
    showGameOutcome,
    clearGameContainer
  }
})()
