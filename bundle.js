/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://2048_game_js/./src/styles/main.scss?");

/***/ }),

/***/ "./src/scripts/help.js":
/*!*****************************!*\
  !*** ./src/scripts/help.js ***!
  \*****************************/
/***/ (() => {

eval("const helpButton = document.querySelector('.help');\nconst helpText = document.querySelector('.help-text');\n\nhelpButton.addEventListener('click', () => {\n  helpText.classList.toggle('hidden');\n});\n\n\n//# sourceURL=webpack://2048_game_js/./src/scripts/help.js?");

/***/ }),

/***/ "./src/scripts/main.js":
/*!*****************************!*\
  !*** ./src/scripts/main.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/main.scss */ \"./src/styles/main.scss\");\n/* harmony import */ var _help__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./help */ \"./src/scripts/help.js\");\n/* harmony import */ var _help__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_help__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n\n\nconst tbody = document.querySelector('tbody');\nconst mainButton = document.querySelector('.start');\nconst gameScore = document.querySelector('.game-score');\nconst dropdownValue = document.querySelector('.dropdown-value');\nconst wrapper = document.querySelector('.dropdown-wrapper');\nconst messageStart = document.querySelector('.message-start');\nconst messageWin = document.querySelector('.message-win');\nconst messageLose = document.querySelector('.message-lose');\nconst bestScore = document.querySelector('.score__best');\n\nlet cells = 4;\nlet score = 0;\nlet canMove = [];\nlet gameField = [];\nlet recordScore = 0;\nlet isNewCell = []\nlet isCombinedCell = []\nlet touchStartX = 0;\nlet touchStartY = 0;\n\nconst getLocalStorage = () => {\n  const localField = JSON.parse(localStorage.getItem(`size ${cells}x${cells}`));\n\n  if (!localField || !localField.length) {\n    setLocalStorage(gameField, score, 0);\n\n    return [gameField, score, 0];\n  }\n\n  return localField;\n};\n\nconst setLocalStorage = (field, points, best) => {\n  localStorage.setItem(\n    `size ${cells}x${cells}`,\n    JSON.stringify([field, points, best])\n  );\n};\n\nconst [, , localRecord = 0] = getLocalStorage();\nrecordScore = localRecord;\nbestScore.innerHTML = localRecord;\n\nconst render = () => {\n  for (let i = 0; i < cells; i++) {\n    for (let j = 0; j < cells; j++) {\n      const cell = tbody.children[i].children[j];\n      const value = gameField[i][j];\n      const prevClassName = cell.className;\n\n      cell.innerHTML = value || '';\n      cell.className = (\n        'field-cell' + (value ? ` field-cell--${value}` : '')\n      )\n      \n      if (isCombinedCell[i][j] && !isNewCell[i][j] && value && cell.innerHTML) {\n        cell.classList.add('field-cell--combine');\n      } else {\n        cell.classList.remove('field-cell--combine');\n      }\n\n      if (isNewCell[i][j] && value) {\n        if (prevClassName.includes('field-cell--appear')) {\n          cell.classList.add('field-cell--new')\n        } else {\n          cell.classList.add('field-cell--appear');\n        }\n      } else {\n        cell.classList.remove('field-cell--appear');\n      }\n    }\n  }\n};\n\nconst appendNum = () => {\n  const value = Math.random() > 0.9 ? 4 : 2;\n  const falseIndices = [];\n\n  for (let i = 0; i < gameField.length; i++) {\n    for (let j = 0; j < gameField[i].length; j++) {\n      if (!gameField[i][j]) {\n        falseIndices.push([i, j]);\n      }\n    }\n  }\n\n  if (falseIndices.length > 0) {\n    const randomIndex = Math.floor(Math.random() * falseIndices.length);\n    const [i, j] = falseIndices[randomIndex];\n    isNewCell[i][j] = true;\n    gameField[i][j] = value;\n  }\n};\n\nconst draftField = (size, localField = []) => {\n  let field = '';\n  cells = size || cells;\n  gameField = localField.length\n    ? localField\n    : Array.from({ length: cells }, () => Array(cells).fill(0));\n\n  for (let i = 1; i <= cells; i++) {\n    const td = '<td class=\"field-cell\"></td>'.repeat(cells);\n    field += `<tr class=\"field-row\">${td}</tr>`;\n  }\n\n  tbody.innerHTML = field;\n};\n\nconst updateScore = (points) => {\n  if (points === 0) {\n    score = points;\n    gameScore.innerHTML = score;\n\n    return;\n  }\n\n  score += points;\n  gameScore.innerHTML = score;\n};\n\nconst updateRecord = (score) => {\n  if (score > recordScore) {\n    recordScore = score;\n    setLocalStorage(gameField, score, recordScore);\n    bestScore.innerHTML = recordScore;\n  }\n\n  return recordScore;\n};\n\nconst move = (direction) => {\n  canMove = [];\n  isNewCell = Array.from({ length: cells }, () => Array(cells).fill(false));\n  const isLeftOrUp = direction === 'left' || direction === 'up';\n  let steps = isLeftOrUp ? 0 : cells - 1;\n  let cell;\n\n  for (\n    let i = isLeftOrUp ? 0 : cells - 1;\n    isLeftOrUp ? i < cells : i >= 0;\n    isLeftOrUp ? i++ : i--\n  ) {\n    steps = 0;\n\n    for (\n      let j = isLeftOrUp ? 0 : cells - 1;\n      isLeftOrUp ? j < cells : j >= 0;\n      isLeftOrUp ? j++ : j--\n    ) {\n      if (direction === 'left' || direction === 'right') {\n        cell = gameField[i][j];\n      } else {\n        cell = gameField[j][i];\n      }\n\n      isLeftOrUp ? steps++ : steps--;\n\n      if (!cell) {\n        continue;\n      }\n\n      isLeftOrUp ? steps-- : steps++;\n      let k = 0;\n\n      if (direction === 'left' || direction == 'right') {\n        while (k <= cells - 1) {\n          if (gameField[i][j] && !gameField[i][j - steps]) {\n            gameField[i][j - steps] = gameField[i][j];\n            gameField[i][j] = 0;\n\n            canMove.push(true);\n\n            k = 0;\n          }\n\n          k++;\n        }\n      } else {\n        while (k <= cells - 1) {\n          if (gameField[j][i] && !gameField[j - steps][i]) {\n            gameField[j - steps][i] = gameField[j][i];\n            gameField[j][i] = 0;\n\n            canMove.push(true);\n\n            k = 0;\n          }\n\n          k++;\n        }\n      }\n    }\n  }\n};\n\nconst combine = (direction) => {\n  let isCombined = false;\n  isCombinedCell = Array.from({ length: cells }, () =>\n    Array(cells).fill(false)\n  );\n  const isLeftOrUp = direction === 'left' || direction === 'up';\n\n  for (let i = 0; i < cells; i++) {\n    for (\n      let j = isLeftOrUp ? 1 : cells - 1;\n      isLeftOrUp ? j < cells : j > 0;\n      isLeftOrUp ? j++ : j--\n    ) {\n      if (direction === 'right' || direction === 'left') {\n        if (\n          gameField[i][j] === gameField[i][j - 1] &&\n          gameField[i][j] &&\n          gameField[i][j - 1] &&\n          !isCombinedCell[i][j] &&\n          !isCombinedCell[i][j - 1]\n        ) {\n          gameField[i][j - 1] *= 2;\n          gameField[i][j] = 0;\n          isNewCell[i][j] = true;\n          isCombinedCell[i][j] = true;\n          isCombinedCell[i][j - 1] = true;\n          updateScore(gameField[i][j - 1]);\n\n          isCombined = true;\n        }\n      } else {\n        if (\n          gameField[j][i] === gameField[j - 1][i] &&\n          gameField[j][i] &&\n          gameField[j - 1][i] &&\n          !isCombinedCell[j][i] &&\n          !isCombinedCell[j - 1][i]\n        ) {\n          gameField[j - 1][i] *= 2;\n          gameField[j][i] = 0;\n          isCombinedCell[j][i] = true;\n          isNewCell[j][i] = true;\n          isCombinedCell[j - 1][i] = true;\n          updateScore(gameField[j - 1][i]);\n\n          isCombined = true;\n        }\n      }\n    }\n  }\n\n  return isCombined;\n};\n\nconst moveAndCombine = (direction) => {\n  move(direction);\n  const isCombined = combine(direction);\n\n  if (isCombined) {\n    move(direction);\n  }\n\n  if (canMove.includes(true) || isCombined) {\n    appendNum();\n  }\n\n  render();\n\n  setLocalStorage(gameField, score, updateRecord(score));\n\n  checkIfGameFinished()\n};\n\nconst checkIfGameFinished = () => {\n  const isWon = gameField.flat().includes(2048);\n\n  if (isWon) {\n    document.querySelector('.message-win').classList.remove('hidden');\n\n    return true;\n  }\n\n  for (let i = 0; i < gameField.length; i++) {\n    for (let j = 0; j < gameField[i].length; j++) {\n      if (!gameField[i][j]) {\n        return false;\n      }\n    }\n  }\n\n  for (let i = 0; i < cells; i++) {\n    for (let j = 0; j < cells - 1; j++) {\n      if (\n        gameField[i][j] === gameField[i][j + 1] ||\n        gameField[j][i] === gameField[j + 1][i]\n      ) {\n        return false;\n      }\n    }\n  }\n\n  document.querySelector('.message-lose').classList.remove('hidden');\n\n  return true;\n};\n\ndraftField();\n\nconst initializeGame = (size) => {\n  const [localField = [], localScore = 0, localRecord = 0] = getLocalStorage();\n  const isContainsCells = localField.flat().filter((el) => el).length;\n\n  if (localField.length && isContainsCells) {\n    draftField(size, localField);\n    score = localScore;\n    gameScore.innerHTML = score;\n  } else {\n    draftField(size);\n    appendNum();\n    appendNum();\n  }\n\n  isNewCell = Array.from({ length: cells }, () => Array(cells).fill(false));\n  isCombinedCell = Array.from({ length: cells }, () => Array(cells).fill(false));\n\n  bestScore.innerHTML = localRecord;\n\n  render();\n};\n\nconst handleTouchStart = (e) => {\n  touchStartX = e.touches[0].clientX;\n  touchStartY = e.touches[0].clientY;\n};\n\nconst handleTouchMove = (e) => {\n  if (!touchStartX || !touchStartY) {\n    return;\n  }\n\n  const touchEndX = e.touches[0].clientX;\n  const touchEndY = e.touches[0].clientY;\n  const deltaX = touchEndX - touchStartX;\n  const deltaY = touchEndY - touchStartY;\n\n  Math.abs(deltaX) > Math.abs(deltaY)\n    ? deltaX > 0\n      ? moveAndCombine('right')\n      : moveAndCombine('left')\n    : deltaY > 0\n      ? moveAndCombine('up')\n      : moveAndCombine('down');\n\n  touchStartX = 0;\n  touchStartY = 0;\n};\n\ndocument.addEventListener('touchstart', handleTouchStart, false);\ndocument.addEventListener('touchmove', handleTouchMove, false);\n\nmainButton.addEventListener('click', (e) => {\n  const { target } = e;\n\n  if (target.classList.contains('restart')) {\n    setLocalStorage([], 0, updateRecord(recordScore));\n    score = 0;\n    gameScore.innerHTML = score;\n  }\n\n  initializeGame();\n\n  messageStart.classList.add('hidden');\n  messageWin.classList.add('hidden');\n  messageLose.classList.add('hidden');\n\n  target.classList.remove('start');\n  target.classList.add('restart');\n  target.innerHTML = 'Restart';\n});\n\ndocument.addEventListener('keyup', (e) => {\n  if (e.key === 'ArrowDown') {\n    moveAndCombine('down');\n  } else if (e.key === 'ArrowUp') {\n    moveAndCombine('up');\n  } else if (e.key === 'ArrowRight') {\n    moveAndCombine('right');\n  } else if (e.key === 'ArrowLeft') {\n    moveAndCombine('left');\n  }\n});\n\ndocument.addEventListener('click', (e) => {\n  if (\n    (wrapper.classList.contains('dropdown--open') &&\n      !e.target.contains(dropdownValue)) ||\n    (e.target.id === 'header' && wrapper.classList.contains('dropdown--open'))\n  ) {\n    wrapper.classList.toggle('dropdown--open');\n  }\n});\n\nwrapper.addEventListener('click', (e) => {\n  if (!e.currentTarget.contains(e.target)) {\n    wrapper.classList.toggle('dropdown--open');\n  }\n\n  if (wrapper.classList.contains('dropdown--open') && e.target !== wrapper) {\n    const targetText = e.target.innerHTML;\n    const selectedText = dropdownValue.innerHTML;\n    const targetValue = parseInt(e.target.attributes[1].value, 10);\n    const selectedValue = parseInt(dropdownValue.attributes[1].value, 10);\n\n    if (targetValue === cells) {\n      wrapper.classList.toggle('dropdown--open');\n\n      return;\n    }\n\n    dropdownValue.innerHTML = targetText;\n    e.target.innerHTML = selectedText;\n\n    e.target.setAttribute('data-value', selectedValue);\n    dropdownValue.setAttribute('data-value', targetValue);\n\n    draftField(targetValue);\n\n    const [, , localRecord] = getLocalStorage();\n\n    recordScore = localRecord;\n    bestScore.innerHTML = localRecord;\n\n    messageStart.classList.remove('hidden');\n    mainButton.classList.add('start');\n    mainButton.classList.remove('restart');\n    mainButton.innerHTML = 'Start';\n    messageWin.classList.add('hidden');\n    messageLose.classList.add('hidden');\n    updateScore(0);\n  }\n\n  wrapper.classList.toggle('dropdown--open');\n});\n\n\n//# sourceURL=webpack://2048_game_js/./src/scripts/main.js?");

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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