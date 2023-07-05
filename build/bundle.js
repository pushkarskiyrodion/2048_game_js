/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://2048_game_js/./src/styles/main.scss?");

/***/ }),

/***/ "./src/scripts/directionsConfig.js":
/*!*****************************************!*\
  !*** ./src/scripts/directionsConfig.js ***!
  \*****************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = {\n  up: 'up',\n  down: 'down',\n  right: 'right',\n  left: 'left',\n};\n\n\n//# sourceURL=webpack://2048_game_js/./src/scripts/directionsConfig.js?");

/***/ }),

/***/ "./src/scripts/main.js":
/*!*****************************!*\
  !*** ./src/scripts/main.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/main.scss */ \"./src/styles/main.scss\");\n\n\n\n\nconst offset = __webpack_require__(/*! ./offsetConfig */ \"./src/scripts/offsetConfig.js\");\nconst directions = __webpack_require__(/*! ./directionsConfig */ \"./src/scripts/directionsConfig.js\");\n\nconst everySquare = Array.from(document.querySelectorAll('.field-cell'));\nconst everyRow = Array.from(document.querySelectorAll('.field-row'));\nconst mainButton = document.querySelector('.start');\nconst gameScore = document.querySelector('.game-score');\nlet canMoveInAnyDirection = [];\nlet touchStartX = 0;\nlet touchStartY = 0;\nlet score = 0;\n\nconst COLUMN_LENGTH = 4;\n\nfunction appendNumber() {\n  const emptySquares = everySquare.filter(square => square.innerHTML === '');\n\n  if (emptySquares.length === 0) {\n    return;\n  }\n\n  const index = Math.floor(Math.random() * emptySquares.length);\n  const randomSquare = emptySquares[index];\n  const value = Math.random() > 0.9 ? 4 : 2;\n\n  setCellValue(randomSquare, value);\n}\n\nfunction setColumn(filtered) {\n  return filtered.map(cell => parseInt(cell.innerHTML, 10) || '');\n}\n\nfunction setCellValue(cell, value) {\n  cell.innerHTML = value || '';\n  cell.className = 'field-cell' + (value ? ` field-cell--${value}` : '');\n}\n\nfunction getNewRow(column, direction) {\n  const filtered = column.filter(num => num);\n  const missing = COLUMN_LENGTH - filtered.length;\n  const unfilled = Array(missing).fill('');\n\n  return (\n    direction === directions.down || direction === directions.right\n      ? unfilled.concat(filtered)\n      : filtered.concat(unfilled)\n  );\n}\n\nfunction checkMoveAndFinish() {\n  if (canMoveInAnyDirection.includes(true)) {\n    canMoveInAnyDirection = [];\n    appendNumber();\n  }\n\n  checkIfGameFinished();\n}\n\nfunction moveDown() {\n  for (let i = 0; i < everyRow.length; i++) {\n    const filteredColumn = everySquare.filter(td => td.cellIndex === i);\n\n    moveAndCombine(directions.down, filteredColumn);\n  };\n\n  checkMoveAndFinish();\n}\n\nfunction moveUp() {\n  for (let i = 0; i < everyRow.length; i++) {\n    const filteredColumn = everySquare.filter(td => td.cellIndex === i);\n\n    moveAndCombine(directions.up, filteredColumn);\n  };\n\n  checkMoveAndFinish();\n}\n\nfunction moveRight() {\n  for (let i = 0; i < everyRow.length; i++) {\n    const filteredColumn = everyRow.filter(tr => tr.rowIndex === i)[0].cells;\n\n    moveAndCombine(directions.right, filteredColumn);\n  };\n\n  checkMoveAndFinish();\n}\n\nfunction moveLeft() {\n  for (let i = 0; i < everyRow.length; i++) {\n    const filteredColumn = everyRow.filter(tr => tr.rowIndex === i)[0].cells;\n\n    moveAndCombine(directions.left, filteredColumn);\n  };\n\n  checkMoveAndFinish();\n}\n\nfunction moveAndCombine(direction, filteredColumn) {\n  const column = setColumn([...filteredColumn]);\n  const newRow = getNewRow(column, direction);\n\n  if (canMove(direction, column)) {\n    move(filteredColumn, newRow);\n    combine(direction, newRow, filteredColumn);\n  }\n}\n\nfunction combine(direction, row, collection) {\n  if (direction === directions.left || direction === directions.up) {\n    for (let k = 1; k < row.length; k++) {\n      const prev = row[k - offset.one];\n      const total = row[k] + prev;\n      const hasPairs = (\n        row[k] === prev\n        && prev !== ''\n        && row[k + offset.one]\n        && row[k + offset.two]\n        && row[k + offset.one] === row[k + offset.two]\n      );\n\n      if (hasPairs) {\n        row[k - offset.one] = total;\n        row[k] = row[k + offset.one] + row[k + offset.two];\n        row[k + offset.one] = '';\n        row[k + offset.two] = '';\n\n        updateScore(total + row[k]);\n\n        setCellValue(collection[k - offset.one], total);\n        setCellValue(collection[k], row[k]);\n        setCellValue(collection[k + offset.one], row[k + offset.one]);\n        setCellValue(collection[k + offset.two], row[k + offset.two]);\n\n        break;\n      }\n\n      if (row[k] === prev && row[k]) {\n        row[k - offset.one] = total;\n        row[k] = '';\n\n        updateScore(total);\n\n        setCellValue(collection[k - offset.one], total);\n        setCellValue(collection[k], row[k]);\n      }\n\n      if (row[k] && prev === '') {\n        row[k - offset.one] = row[k];\n        row[k] = '';\n\n        setCellValue(collection[k - offset.one], row[k - offset.one]);\n        setCellValue(collection[k], row[k]);\n      }\n    }\n  }\n\n  if (direction === directions.right || direction === directions.down) {\n    for (let k = row.length - 1; k > 0; k--) {\n      const prev = row[k - offset.one];\n      const total = row[k] + prev;\n      const hasPairs = (\n        row[k] === prev\n        && prev !== ''\n        && row[k - offset.two]\n        && row[k - offset.three]\n        && row[k - offset.two] === row[k - offset.three]\n      );\n\n      if (hasPairs) {\n        row[k] = total;\n        row[k - offset.one] = row[k - offset.two] + row[k - offset.three];\n        row[k - offset.two] = '';\n        row[k - offset.three] = '';\n\n        updateScore(total + row[k]);\n\n        setCellValue(collection[k], total);\n        setCellValue(collection[k - offset.one], row[k - offset.one]);\n        setCellValue(collection[k - offset.two], '');\n        setCellValue(collection[k - offset.three], '');\n\n        break;\n      }\n\n      if (row[k] === prev && prev) {\n        row[k - offset.one] = '';\n        row[k] = total;\n\n        updateScore(total);\n\n        setCellValue(collection[k], total);\n        setCellValue(collection[k - offset.one], '');\n      }\n\n      if (prev && row[k] === '') {\n        row[k] = row[k - offset.one];\n        row[k - offset.one] = '';\n\n        setCellValue(collection[k], row[k]);\n        setCellValue(collection[k - offset.one], '');\n      }\n    }\n  }\n}\n\nfunction markMovementPossible() {\n  canMoveInAnyDirection.push(true);\n\n  return true;\n}\n\nfunction move(filteredColumn, row) {\n  for (let j = 0; j < filteredColumn.length; j++) {\n    setCellValue(filteredColumn[j], row[j]);\n  }\n}\n\nfunction canMove(direction, column) {\n  if (direction === directions.left || direction === directions.up) {\n    for (let j = 1; j < column.length; j++) {\n      const emptyString = column.find(col => col === '');\n      const curr = column[j];\n      const prev = column[j - offset.one];\n\n      if (prev === emptyString && curr) {\n        return markMovementPossible();\n      }\n\n      if (column[0] === '' && curr) {\n        return markMovementPossible();\n      }\n\n      if ((curr && prev) && (curr === prev)) {\n        return markMovementPossible();\n      }\n    }\n  }\n\n  if (direction === directions.right || direction === directions.down) {\n    for (let j = column.length - 1; j > 0; j--) {\n      const emptyString = column.find(col => col === '');\n      const curr = column[j];\n      const prev = column[j - offset.one];\n\n      if (curr === emptyString && prev) {\n        return markMovementPossible();\n      }\n\n      if (column[column.length - 1] === '' && curr) {\n        return markMovementPossible();\n      }\n\n      if ((curr && prev) && (curr === prev)) {\n        return markMovementPossible();\n      }\n    }\n  }\n\n  return false;\n}\n\nfunction checkIfGameFinished() {\n  const cells = Array.from(document.querySelectorAll('td'));\n  const isWon = cells.find(cell => cell.innerHTML.includes('2048'));\n\n  if (isWon) {\n    document.querySelector('.message-win').classList.remove('hidden');\n\n    return;\n  }\n\n  let gameOver = true;\n\n  for (let i = 0; i < cells.length; i++) {\n    const currCell = cells[i];\n    const rightCell = cells[i + offset.one];\n    const bottomCell = cells[i + offset.four];\n    const isGameOver = !currCell.innerHTML || (\n      rightCell && currCell.cellIndex !== 3\n      && currCell.innerHTML === rightCell.innerHTML\n    ) || (bottomCell && currCell.innerHTML === bottomCell.innerHTML);\n\n    if (isGameOver) {\n      gameOver = false;\n      break;\n    }\n  }\n\n  if (gameOver) {\n    document.querySelector('.message-lose').classList.remove('hidden');\n  }\n}\n\nfunction updateScore(value) {\n  score += value;\n  gameScore.innerHTML = score;\n}\n\nfunction restart() {\n  Array.from(document.querySelectorAll('td')).forEach(cell => {\n    setCellValue(cell, '');\n  });\n\n  score = 0;\n\n  updateScore(score);\n  appendNumber();\n  appendNumber();\n}\n\nmainButton.addEventListener('click', (e) => {\n  const { target } = e;\n\n  document.querySelector('.message-start').classList.add('hidden');\n  document.querySelector('.message-win').classList.add('hidden');\n  document.querySelector('.message-lose').classList.add('hidden');\n\n  target.classList.remove('start');\n  target.classList.add('restart');\n  target.innerHTML = 'Restart';\n\n  if (target.classList.contains('restart')) {\n    restart();\n  }\n});\n\ndocument.addEventListener('keyup', (e) => {\n  switch (e.key) {\n    case 'ArrowDown':\n      moveDown();\n      break;\n\n    case 'ArrowUp':\n      moveUp();\n      break;\n\n    case 'ArrowRight':\n      moveRight();\n      break;\n\n    case 'ArrowLeft':\n      moveLeft();\n      break;\n\n    default:\n      break;\n  }\n});\n\ndocument.addEventListener('touchstart', handleTouchStart, false);\ndocument.addEventListener('touchmove', handleTouchMove, false);\n\nfunction handleTouchStart(e) {\n  touchStartX = e.touches[0].clientX;\n  touchStartY = e.touches[0].clientY;\n}\n\nfunction handleTouchMove(e) {\n  if (!touchStartX || !touchStartY) {\n    return;\n  }\n\n  const touchEndX = e.touches[0].clientX;\n  const touchEndY = e.touches[0].clientY;\n  const deltaX = touchEndX - touchStartX;\n  const deltaY = touchEndY - touchStartY;\n\n  Math.abs(deltaX) > Math.abs(deltaY)\n    ? deltaX > 0 ? moveRight() : moveLeft()\n    : deltaY > 0 ? moveDown() : moveUp();\n\n  touchStartX = 0;\n  touchStartY = 0;\n}\n\n\n//# sourceURL=webpack://2048_game_js/./src/scripts/main.js?");

/***/ }),

/***/ "./src/scripts/offsetConfig.js":
/*!*************************************!*\
  !*** ./src/scripts/offsetConfig.js ***!
  \*************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = {\n  one: 1,\n  two: 2,\n  three: 3,\n  four: 4,\n};\n\n\n//# sourceURL=webpack://2048_game_js/./src/scripts/offsetConfig.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/main.js");
/******/ 	
/******/ })()
;