import { DIRECTION } from '../constants';

export default class ActuateUI {
  constructor(gamefield, metadata = null) {
    this.gameField = gamefield;
    this.metadata = metadata || {
      isWon: false,
      isGameOver: false,
      isPaused: false,
      updatedScores: 0,
      scores: 0,
      best: 0,
    };
    this.tileContainer = document.querySelector('.tile-container');
    this.bestScores = document.querySelector('.game-scores-best');
    this.gameScores = document.querySelector('.game-scores');
    this.bestScores.innerHTML = this.metadata.best;
    this.gameScores.firstChild.textContent = this.metadata.scores;
  }

  createTile(y, x) {
    const { value, isCombined, isNewCell } = this.gameField[y][x];
    const wrapper = document.createElement('div');
    const tile = document.createElement('div');
    wrapper.className = `tile ${this.positionClass(y, x)}`;
    tile.className = `tile-inner tile--${value}`;
    tile.innerHTML = value;

    if (isNewCell) {
      tile.classList.add('tile--appear');
    }

    if (isCombined) {
      tile.classList.add('tile--combine');
    }

    wrapper.appendChild(tile)
    this.tileContainer.appendChild(wrapper);
  }

  positionClass(y, x) {
    return `tile-position-${x + 1}-${y + 1}`
  }

  updatePosition({ x, y }, i, j) {
    // Sometimes there are two elements with the same position
    const tile = this.tileContainer.querySelectorAll(`.${this.positionClass(y, x)}`);

    if (tile.length && (x !== j || i !== y)) {
      tile[0].classList.add(`${this.positionClass(i, j)}`);
      tile[0].classList.remove(`${this.positionClass(y, x)}`);
    }

    return tile;
  }

  isNotMoveable() {
    for (let i = 0; i < this.gameField.length; i++) {
      for (let j = 0; j + 1 < this.gameField[i].length; j++) {
        if (
          !this.gameField[i][j].value ||
          !this.gameField[i][j + 1].value ||
          this.gameField[i][j].value === this.gameField[i][j + 1].value ||
          this.gameField[j][i].value === this.gameField[j + 1][i].value
        ) {
          return false;
        }
      }
    }

    return true;
  }

  gameFinishing() {
    const gameMessage = document.querySelector('.game-message');
    const gameStatus = document.querySelector('.game-message-status');

    gameMessage.classList.remove('hidden');
    gameStatus.innerHTML = 'Game Over!';
    gameStatus.style.color = '#776e65';
    gameMessage.classList.add('game-message--game-over');
  }

  gameWinning() {
    const keepPlayingButton = document.querySelector('.game-message-keep-playing');
    const gameMessageContainer = document.querySelector('.game-message');
    const gameStatus = document.querySelector('.game-message-status');
    this.metadata.isPaused = true;

    keepPlayingButton.style.display = 'flex';
    gameStatus.innerHTML = 'You Win!'
    gameStatus.style.color = '#fff';
    gameMessageContainer.classList.remove('hidden');
    gameMessageContainer.classList.add('game-message--game-won');

    keepPlayingButton.addEventListener('click', () => {
      this.metadata.isPaused = false;
      gameMessageContainer.classList.remove('game-message--game-won')
      gameMessageContainer.classList.add('game-message--fade-out');
      
      gameMessageContainer.addEventListener('animationend', () => {
        if (gameMessageContainer.classList.contains('game-message--fade-out')) {
          keepPlayingButton.style.display = 'none';
          gameMessageContainer.classList.remove('game-message--fade-out');
          gameMessageContainer.classList.add('hidden');
        }
      })
    })
  }

  updateScores() {
    this.metadata.scores += this.metadata.updatedScores;
    const div = document.createElement('div');
    div.classList.add('game-scores--addition');

    this.gameScores.removeChild(this.gameScores.firstElementChild);

    if (this.metadata.best < this.metadata.scores) {
      this.metadata.best = this.metadata.scores;
      this.bestScores.textContent = this.metadata.best;
    }

    div.textContent = `+${this.metadata.updatedScores}`;
    this.gameScores.textContent = this.metadata.scores;
    this.gameScores.appendChild(div)
    this.metadata.updatedScores = 0;
  }

  combineTile(prevPosition, i, j) {
    const { a, b } = prevPosition;
    const current = this.gameField[i][j];
    const tileA = this.updatePosition({ x: a.x, y: a.y }, i, j);
    const tileB = this.updatePosition({ x: b.x, y: b.y }, i, j);

    if (current.isCombined) {
      this.createTile(i, j);
    }

    [...tileA, ...tileB].forEach(el => el.classList.add('tile--fade-out'))
  }

  clearContainer() {
    [...this.tileContainer.children].forEach(el => {
      el.firstChild.classList.remove('tile--appear')
      el.firstChild.classList.remove('tile--combine')

      if (el.classList.contains('tile--fade-out')) {
        this.tileContainer.removeChild(el);
      }
    })
  }

  render(direction) {
    let isWasCombined = false;
    const isLeftOrUp = direction === DIRECTION.LEFT || direction === DIRECTION.UP;
    this.clearContainer();

    for (
      let i = isLeftOrUp ? 0 : this.gameField.length - 1;
      isLeftOrUp ? i < this.gameField.length : i >= 0;
      isLeftOrUp ? i++ : i--
    ) {
      for (
        let j = isLeftOrUp ? 0 : this.gameField.length - 1;
        isLeftOrUp ? j < this.gameField.length : j >= 0;
        isLeftOrUp ? j++ : j--
      ) {
        const { value, prevPosition, isCombined, isNewCell } = this.gameField[i][j];
          
        if (!value) {
          continue;
        }

        if (isCombined) {
          if (value === 2048 && !this.metadata.isWon) {
            this.metadata.isWon = true;
            this.gameWinning();
          }

          isWasCombined = true;
          this.metadata.updatedScores += value;
          this.combineTile(prevPosition, i, j);
          continue;
        }

        if (isNewCell) {
          this.createTile(i, j);
          continue;
        }

        if (prevPosition) {
          this.updatePosition(prevPosition, i, j);
        }
      }
    }

    if (isWasCombined) {
      this.updateScores();
    }
    
    if (this.isNotMoveable()) {
      this.metadata.isGameOver = true;
      this.gameFinishing();
    }
  }

  drawField() {
    let field = '';

    this.gameField.forEach(() => {
      const cells = '<div class="game-cell"></div>'.repeat(this.gameField.length);
      field += `<div class="game-row">${cells}</div>`;
    });

    document.querySelector('.game-field').innerHTML = field;
  }

  start() {
    while (this.tileContainer.firstChild) {
      this.tileContainer.removeChild(this.tileContainer.firstChild);
    }
    
    for (let i = 0; i < this.gameField.length; i++) {
      for (let j = 0; j < this.gameField.length; j++) {
        const { value } = this.gameField[i][j];

        if (value) {
          this.gameField[i][j].isNewCell = true;
          this.createTile(i, j);
        }
      }
    }

    if (this.metadata.isWon) {
      this.gameWinning();
    } else if (this.metadata.isGameOver) {
      this.gameFinishing();
    }
  }
}
