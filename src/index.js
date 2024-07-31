import { getLocalStorage, setLocalStorage, handleSwipe, handlePlay } from './js/helpers';
import { Dropdown } from './js/classes/Dropdown';
import ActuateUI from './js/classes/ActuateUI';
import Grid from './js/classes/Grid';
import './js/help';
import './main.scss';

let grid;
let actuate;

const initializeGame = (cells, isNewGame) => {
  const size = cells ? cells : getLocalStorage('cells') || 4;
  let [field = null, metadata = {
    isWon: false,
    isGameOver: false,
    isPaused: false,
    updatedScores: 0,
    scores: 0,
    best: 0,
  }] = getLocalStorage(`size${size}x${size}`) || [];
  
  if (isNewGame) {
    metadata.scores = 0;
    metadata.isGameOver = false;
    metadata.isPaused = false;
    metadata.isWon = false;
    field = null;
  }

  grid = new Grid(size, field);
  actuate = new ActuateUI(grid.gameField, metadata);

  if (!field || !field.length) {
    grid.appendNum();
    grid.appendNum();
  }

  actuate.drawField();
  actuate.start();
  grid.resetProps();
};

const saveGameField = () => {
  const size = grid.cells;
  setLocalStorage(`size${size}x${size}`, [grid.gameField, actuate.metadata])
}

const startNewGame = (size, isNewGame = false) => {
  document.querySelector('.game-message').className = 'game-message hidden'
  saveGameField();
  initializeGame(size, isNewGame);
}

initializeGame();

const dropdown = new Dropdown(grid.cells, startNewGame)
dropdown.render();

const handleMove = (direction) => {
  if (!actuate.metadata.isGameOver && !actuate.metadata.isPaused) {
    grid.moveAndCombine(direction);
    actuate.render(direction);
    grid.resetProps();
  }
}

handleSwipe(handleMove);
handlePlay(handleMove);

document.querySelector('.game-start').addEventListener('click', () => {
  startNewGame(grid.cells, true);
});
window.addEventListener('beforeunload', () => {
  saveGameField();
  setLocalStorage('cells', grid.cells)
});
document.querySelector('.game-message-retry').addEventListener('click', () => {
  startNewGame(grid.cells, true);
})