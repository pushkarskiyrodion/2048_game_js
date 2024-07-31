import { DIRECTION } from '../constants';

export default class Grid {
  constructor(cells = 4, gameField = null) {
    this.cells = cells;
    this.gameField = gameField || this.createGameField(cells);
  }

  createGameField(cells) {
    return Array.from({ length: cells }, () =>
      Array.from({ length: cells }, () => ({
        value: 0,
        isCombined: false,
        isNewCell: false,
        prevPosition: null,
      }))
    );
  }

  appendNum() {
    const value = Math.random() > 0.9 ? 4 : 2;
    const falseIndices = [];

    for (let i = 0; i < this.cells; i++) {
      for (let j = 0; j < this.cells; j++) {
        if (!this.gameField[i][j].value) {
          falseIndices.push([i, j]);
        }
      }
    }

    if (falseIndices.length > 0) {
      const randomIndex = Math.floor(Math.random() * falseIndices.length);
      const [i, j] = falseIndices[randomIndex];
      this.gameField[i][j].isNewCell = true;
      this.gameField[i][j].value = value;
      this.gameField[i][j].prevPosition = { x: j, y: i };
    }
  }

  getCells(direction, j, i, steps) {
    const index = !isNaN(steps) ? steps : j;
    const currCell = {
      ref: null,
      position: { x: 0, y: 0}
    };

    const nextCell = {
      ref: null,
      position: { x: 0, y: 0}
    };;

    switch (direction) {
      case DIRECTION.UP:
        currCell.ref = this.gameField[index][i];
        nextCell.ref = this.gameField[j + 1][i];
        currCell.position = { x: i, y: index };
        nextCell.position = { x: i, y: j + 1 };
        break;
      case DIRECTION.DOWN:
        currCell.ref = this.gameField[index][i];
        nextCell.ref = this.gameField[j - 1][i];
        currCell.position = { x: i, y: index };
        nextCell.position = { x: i, y: j - 1 };
        break;
      case DIRECTION.RIGHT:
        currCell.ref = this.gameField[i][index];
        nextCell.ref  = this.gameField[i][j - 1];
        currCell.position = { x: index, y: i };
        nextCell.position = { x: j - 1, y: i };
        break;
      case DIRECTION.LEFT:
        currCell.ref = this.gameField[i][index];
        nextCell.ref  = this.gameField[i][j + 1];
        currCell.position = { x: index, y: i };
        nextCell.position = { x: j + 1, y: i };
        break;
    }

    return [ currCell, nextCell ]
  }

  moveAndCombine(direction) {
    const isLeftOrUp = direction === DIRECTION.LEFT || direction === DIRECTION.UP;
    let startOrEnd = isLeftOrUp ? 0 : this.cells - 1;
    let isCombined = false;
    let isCanMove = false;
    let steps;

    for (
      let i = startOrEnd;
      isLeftOrUp ? i < this.cells : i >= 0;
      isLeftOrUp ? i++ : i--
    ) {
      steps = startOrEnd;

      for (
        let j = startOrEnd;
        isLeftOrUp ? j + 1 < this.cells : j > 0;
        isLeftOrUp ? j++ : j--
      ) {
        let [ currCell, nextCell ] = this.getCells(direction, j, i, steps)

        if (currCell.ref.value) {
          isLeftOrUp ? steps++ : steps--;
          currCell = this.getCells(direction, j, i, steps)[0]
        }

        if (!currCell.ref.value && nextCell.ref.value) {
          currCell.ref.value = nextCell.ref.value;
          currCell.ref.prevPosition = nextCell.ref.prevPosition || nextCell.position;
          currCell.ref.isCombined = nextCell.ref.isCombined;
          nextCell.ref.value = 0;
          nextCell.ref.prevPosition = null;
          nextCell.ref.isNewCell = false;
          nextCell.ref.isCombined = false;
          isCanMove = true;
        }

        if (isLeftOrUp ? j + 1 >= this.cells - 1 : j - 1 <= 0) {
          const isWasCombined = this.combine(direction, i);

          if (isWasCombined) {
            isCombined = true;
            steps = startOrEnd;
            j = isLeftOrUp ? startOrEnd - 1 : startOrEnd + 1;
          }
        }
      }
    }

    if (isCanMove || isCombined) {
      this.appendNum();
    }
  }

  combine(direction, i) {
    const isLeftOrUp = direction === DIRECTION.LEFT || direction === DIRECTION.UP;
    let k = isLeftOrUp ? 0 : this.cells - 1;
    let isWasCombined = false;

    while (isLeftOrUp ? k + 1 < this.cells : k > 0) {
      const [ currCell, nextCell ] = this.getCells(direction, k, i)

      if (
        currCell.ref.value === nextCell.ref.value &&
        currCell.ref.value &&
        nextCell.ref.value &&
        !nextCell.ref.isCombined &&
        !currCell.ref.isCombined
      ) {
        currCell.ref.value *= 2;
        nextCell.ref.value = 0;
        currCell.ref.isCombined = true;
        currCell.ref.prevPosition = {
          a: currCell.ref.prevPosition || currCell.position,
          b: nextCell.ref.prevPosition || nextCell.position,
        };

        nextCell.ref.isNewCell = false;
        isWasCombined = true;
      }

      isLeftOrUp ? k++ : k--;
    }

    return isWasCombined;
  }

  resetProps() {
    for (let i = 0; i < this.cells; i++) {
      for (let j = 0; j < this.cells; j++) {
        this.gameField[i][j].isCombined = false;
        this.gameField[i][j].isNewCell = false;
        this.gameField[i][j].prevPosition = null;
      }
    }
  }
}
