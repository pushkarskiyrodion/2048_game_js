'use strict';

import '../styles/main.scss';
import './help';

const tbody = document.querySelector('tbody');
const mainButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const dropdownValue = document.querySelector('.dropdown-value');
const wrapper = document.querySelector('.dropdown-wrapper');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const bestScore = document.querySelector('.score__best');

let cells = 4;
let score = 0;
let canMove = [];
let gameField = [];
let recordScore = 0;
let isNewCell = []
let isCombinedCell = []
let touchStartX = 0;
let touchStartY = 0;

const getLocalStorage = () => {
  const localField = JSON.parse(localStorage.getItem(`size ${cells}x${cells}`));

  if (!localField || !localField.length) {
    setLocalStorage(gameField, score, 0);

    return [gameField, score, 0];
  }

  return localField;
};

const setLocalStorage = (field, points, best) => {
  localStorage.setItem(
    `size ${cells}x${cells}`,
    JSON.stringify([field, points, best])
  );
};

const [, , localRecord = 0] = getLocalStorage();
recordScore = localRecord;
bestScore.innerHTML = localRecord;

const render = () => {
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      const cell = tbody.children[i].children[j];
      const value = gameField[i][j];
      const prevClassName = cell.className;

      cell.innerHTML = value || '';
      cell.className = (
        'field-cell' + (value ? ` field-cell--${value}` : '')
      )
      
      if (isCombinedCell[i][j] && !isNewCell[i][j] && value && cell.innerHTML) {
        cell.classList.add('field-cell--combine');
      } else {
        cell.classList.remove('field-cell--combine');
      }

      if (isNewCell[i][j] && value) {
        if (prevClassName.includes('field-cell--appear')) {
          cell.classList.add('field-cell--new')
        } else {
          cell.classList.add('field-cell--appear');
        }
      } else {
        cell.classList.remove('field-cell--appear');
      }
    }
  }
};

const appendNum = () => {
  const value = Math.random() > 0.9 ? 4 : 2;
  const falseIndices = [];

  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      if (!gameField[i][j]) {
        falseIndices.push([i, j]);
      }
    }
  }

  if (falseIndices.length > 0) {
    const randomIndex = Math.floor(Math.random() * falseIndices.length);
    const [i, j] = falseIndices[randomIndex];
    isNewCell[i][j] = true;
    gameField[i][j] = value;
  }
};

const draftField = (size, localField = []) => {
  let field = '';
  cells = size || cells;
  gameField = localField.length
    ? localField
    : Array.from({ length: cells }, () => Array(cells).fill(0));

  for (let i = 1; i <= cells; i++) {
    const td = '<td class="field-cell"></td>'.repeat(cells);
    field += `<tr class="field-row">${td}</tr>`;
  }

  tbody.innerHTML = field;
};

const updateScore = (points) => {
  if (points === 0) {
    score = points;
    gameScore.innerHTML = score;

    return;
  }

  score += points;
  gameScore.innerHTML = score;
};

const updateRecord = (score) => {
  if (score > recordScore) {
    recordScore = score;
    setLocalStorage(gameField, score, recordScore);
    bestScore.innerHTML = recordScore;
  }

  return recordScore;
};

const move = (direction) => {
  canMove = [];
  isNewCell = Array.from({ length: cells }, () => Array(cells).fill(false));
  const isLeftOrUp = direction === 'left' || direction === 'up';
  let steps = isLeftOrUp ? 0 : cells - 1;
  let cell;

  for (
    let i = isLeftOrUp ? 0 : cells - 1;
    isLeftOrUp ? i < cells : i >= 0;
    isLeftOrUp ? i++ : i--
  ) {
    steps = 0;

    for (
      let j = isLeftOrUp ? 0 : cells - 1;
      isLeftOrUp ? j < cells : j >= 0;
      isLeftOrUp ? j++ : j--
    ) {
      if (direction === 'left' || direction === 'right') {
        cell = gameField[i][j];
      } else {
        cell = gameField[j][i];
      }

      isLeftOrUp ? steps++ : steps--;

      if (!cell) {
        continue;
      }

      isLeftOrUp ? steps-- : steps++;
      let k = 0;

      if (direction === 'left' || direction == 'right') {
        while (k <= cells - 1) {
          if (gameField[i][j] && !gameField[i][j - steps]) {
            gameField[i][j - steps] = gameField[i][j];
            gameField[i][j] = 0;

            canMove.push(true);

            k = 0;
          }

          k++;
        }
      } else {
        while (k <= cells - 1) {
          if (gameField[j][i] && !gameField[j - steps][i]) {
            gameField[j - steps][i] = gameField[j][i];
            gameField[j][i] = 0;

            canMove.push(true);

            k = 0;
          }

          k++;
        }
      }
    }
  }
};

const combine = (direction) => {
  let isCombined = false;
  isCombinedCell = Array.from({ length: cells }, () =>
    Array(cells).fill(false)
  );
  const isLeftOrUp = direction === 'left' || direction === 'up';

  for (let i = 0; i < cells; i++) {
    for (
      let j = isLeftOrUp ? 1 : cells - 1;
      isLeftOrUp ? j < cells : j > 0;
      isLeftOrUp ? j++ : j--
    ) {
      if (direction === 'right' || direction === 'left') {
        if (
          gameField[i][j] === gameField[i][j - 1] &&
          gameField[i][j] &&
          gameField[i][j - 1] &&
          !isCombinedCell[i][j] &&
          !isCombinedCell[i][j - 1]
        ) {
          gameField[i][j - 1] *= 2;
          gameField[i][j] = 0;
          isNewCell[i][j] = true;
          isCombinedCell[i][j] = true;
          isCombinedCell[i][j - 1] = true;
          updateScore(gameField[i][j - 1]);

          isCombined = true;
        }
      } else {
        if (
          gameField[j][i] === gameField[j - 1][i] &&
          gameField[j][i] &&
          gameField[j - 1][i] &&
          !isCombinedCell[j][i] &&
          !isCombinedCell[j - 1][i]
        ) {
          gameField[j - 1][i] *= 2;
          gameField[j][i] = 0;
          isCombinedCell[j][i] = true;
          isNewCell[j][i] = true;
          isCombinedCell[j - 1][i] = true;
          updateScore(gameField[j - 1][i]);

          isCombined = true;
        }
      }
    }
  }

  return isCombined;
};

const moveAndCombine = (direction) => {
  move(direction);
  const isCombined = combine(direction);

  if (isCombined) {
    move(direction);
  }

  if (canMove.includes(true) || isCombined) {
    appendNum();
  }

  render();

  setLocalStorage(gameField, score, updateRecord(score));

  checkIfGameFinished()
};

const checkIfGameFinished = () => {
  const isWon = gameField.flat().includes(2048);

  if (isWon) {
    document.querySelector('.message-win').classList.remove('hidden');

    return true;
  }

  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      if (!gameField[i][j]) {
        return false;
      }
    }
  }

  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells - 1; j++) {
      if (
        gameField[i][j] === gameField[i][j + 1] ||
        gameField[j][i] === gameField[j + 1][i]
      ) {
        return false;
      }
    }
  }

  document.querySelector('.message-lose').classList.remove('hidden');

  return true;
};

draftField();

const initializeGame = (size) => {
  const [localField = [], localScore = 0, localRecord = 0] = getLocalStorage();
  const isContainsCells = localField.flat().filter((el) => el).length;

  if (localField.length && isContainsCells) {
    draftField(size, localField);
    score = localScore;
    gameScore.innerHTML = score;
  } else {
    draftField(size);
    appendNum();
    appendNum();
  }

  isNewCell = Array.from({ length: cells }, () => Array(cells).fill(false));
  isCombinedCell = Array.from({ length: cells }, () => Array(cells).fill(false));

  bestScore.innerHTML = localRecord;

  render();
};

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  if (!touchStartX || !touchStartY) {
    return;
  }

  const touchEndX = e.touches[0].clientX;
  const touchEndY = e.touches[0].clientY;
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  Math.abs(deltaX) > Math.abs(deltaY)
    ? deltaX > 0
      ? moveAndCombine('right')
      : moveAndCombine('left')
    : deltaY > 0
      ? moveAndCombine('up')
      : moveAndCombine('down');

  touchStartX = 0;
  touchStartY = 0;
};

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

mainButton.addEventListener('click', (e) => {
  const { target } = e;

  if (target.classList.contains('restart')) {
    setLocalStorage([], 0, updateRecord(recordScore));
    score = 0;
    gameScore.innerHTML = score;
  }

  initializeGame();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  target.classList.remove('start');
  target.classList.add('restart');
  target.innerHTML = 'Restart';
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowDown') {
    moveAndCombine('down');
  } else if (e.key === 'ArrowUp') {
    moveAndCombine('up');
  } else if (e.key === 'ArrowRight') {
    moveAndCombine('right');
  } else if (e.key === 'ArrowLeft') {
    moveAndCombine('left');
  }
});

document.addEventListener('click', (e) => {
  if (
    (wrapper.classList.contains('dropdown--open') &&
      !e.target.contains(dropdownValue)) ||
    (e.target.id === 'header' && wrapper.classList.contains('dropdown--open'))
  ) {
    wrapper.classList.toggle('dropdown--open');
  }
});

wrapper.addEventListener('click', (e) => {
  if (!e.currentTarget.contains(e.target)) {
    wrapper.classList.toggle('dropdown--open');
  }

  if (wrapper.classList.contains('dropdown--open') && e.target !== wrapper) {
    const targetText = e.target.innerHTML;
    const selectedText = dropdownValue.innerHTML;
    const targetValue = parseInt(e.target.attributes[1].value, 10);
    const selectedValue = parseInt(dropdownValue.attributes[1].value, 10);

    if (targetValue === cells) {
      wrapper.classList.toggle('dropdown--open');

      return;
    }

    dropdownValue.innerHTML = targetText;
    e.target.innerHTML = selectedText;

    e.target.setAttribute('data-value', selectedValue);
    dropdownValue.setAttribute('data-value', targetValue);

    draftField(targetValue);

    const [, , localRecord] = getLocalStorage();

    recordScore = localRecord;
    bestScore.innerHTML = localRecord;

    messageStart.classList.remove('hidden');
    mainButton.classList.add('start');
    mainButton.classList.remove('restart');
    mainButton.innerHTML = 'Start';
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    updateScore(0);
  }

  wrapper.classList.toggle('dropdown--open');
});
