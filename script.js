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

const View = (() => {
  const playerNamesModal = document.querySelector('#player-names-modal')
  const playerNamesForm = playerNamesModal.querySelector('form')
  const closeModalBtns = document.querySelectorAll('.close-modal')
  const gameContainer = document.querySelector('.game-container')
  const cells = gameContainer.querySelector('.cells')
  const gameOutcomeModal = document.querySelector('#game-outcome-modal')
  const newGameBtn = document.querySelector('.new-game')
  const nextGameBtn = document.querySelector('.next-game')

  const hideModal = (modal) => {
    bootstrap.Modal.getInstance(modal).hide()
  }

  const showModal = (modal) => {
    const myModal = new bootstrap.Modal(modal)
    myModal.show()
  }

  const getPlayerNames = () => {
    const playerXName = playerNamesForm.querySelector('#player-X-name').value
    const playerOName = playerNamesForm.querySelector('#player-O-name').value
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

  const updateCell = (playerSymbol, index) => {
    document.getElementById(index).textContent = playerSymbol
  }

  const resetCells = () => {
    document.querySelectorAll('.cell').forEach((cell) => {
      cell.textContent = ''
    })
    removeCellEventListeners()
    cells.classList.remove('disabled')
  }

  const showGameOutcome = (winner) => {
    gameOutcomeModal.querySelector('.outcome').textContent =
      winner === 'tie' ? "It's a tie!" : `${winner} wins!`
    showModal(gameOutcomeModal)
    cells.classList.add('disabled')
  }

  const clearGameContainer = () => {
    gameContainer.querySelector('.player-X-name').textContent = ''
    gameContainer.querySelector('.player-O-name').textContent = ''
    gameContainer.querySelector('.vs').textContent = ''
    gameContainer.querySelector('.player-X-score').textContent = ''
    gameContainer.querySelector('.player-O-score').textContent = ''
    gameContainer.querySelector('.tie-score').textContent = ''
    gameContainer.querySelector('.turn').textContent = ''
    resetCells()
  }

  const cellClickHandler = (event) => {
    GameController.handleCellClick(event.target.id)
  }

  const addCellEventListeners = () => {
    document.querySelectorAll('.cell').forEach((cell) => {
      cell.addEventListener('click', cellClickHandler)
    })
  }

  const removeCellEventListeners = () => {
    document.querySelectorAll('.cell').forEach((cell) => {
      cell.removeEventListener('click', cellClickHandler)
    })
  }

  const init = () => {
    nextGameBtn.addEventListener('click', () => {
      GameController.startNextGame()
      hideModal(gameOutcomeModal)
    })
    newGameBtn.addEventListener('click', () => {
      clearGameContainer()
      hideModal(gameOutcomeModal)
      showModal(playerNamesModal)
    })

    closeModalBtns.forEach((closeModalBtn) => {
      closeModalBtn.addEventListener('click', () => {
        const form = closeModalBtn.closest('.modal').querySelector('form')

        if (form) {
          form.reset()
          form.classList.remove('was-validated')
        }
      })
    })

    playerNamesModal.addEventListener('shown.bs.modal', () => {
      playerNamesForm.querySelector('input').focus()
    })

    playerNamesForm.addEventListener('submit', (event) => {
      event.preventDefault()

      if (!playerNamesForm.checkValidity()) {
        event.stopPropagation()
      }

      playerNamesForm.classList.add('was-validated')

      if (playerNamesForm.checkValidity()) {
        const { playerXName, playerOName } = getPlayerNames()
        const { playerX, playerO } = createPlayers(playerXName, playerOName)

        GameController.startNewGame(playerX, playerO)

        hideModal(playerNamesModal)

        playerNamesForm.reset()
        playerNamesForm.classList.remove('was-validated')
      }
    })
  }

  return {
    updatePlayerNames,
    updateScores,
    updateTurn,
    updateCell,
    resetCells,
    showGameOutcome,
    clearGameContainer,
    addCellEventListeners,
    init
  }
})()

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
    // True if board is filled and there's no win
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

    View.resetCells()

    if (!nextGame) {
      View.updatePlayerNames(playerX.getName(), playerO.getName())
      resetTieScore()
    }

    View.updateScores(playerX.getScore(), playerO.getScore(), tieScore)
    View.updateTurn(currentPlayer.getName())

    View.addCellEventListeners()
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

// Initialize event listeners after all modules are defined
View.init()
