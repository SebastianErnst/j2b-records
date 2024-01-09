/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkvaia_finanz"] = self["webpackChunkvaia_finanz"] || []).push([["vendor"],{

/***/ 630:
/*!*****************************!*\
  !*** ./src/scripts/main.js ***!
  \*****************************/
/***/ (() => {

eval("class Application {\r\n    constructor() {\r\n        this.initMainNav();\r\n    }\r\n    initMainNav() {\r\n        const $triggerMainMenu = document.querySelector('[data-trigger-main-menu]');\r\n        const $targetMainMenu = document.querySelector('[data-target-main-menu]');\r\n\r\n        $triggerMainMenu.addEventListener('click', () => {\r\n            const hasClassIsActive = $targetMainMenu.classList.contains('is-active');\r\n\r\n            if (hasClassIsActive) {\r\n                $targetMainMenu.classList.remove('is-active');\r\n            } else {\r\n                $targetMainMenu.classList.add('is-active');\r\n            }\r\n        });\r\n    }\r\n}\r\n\r\nnew Application();\n\n//# sourceURL=webpack://vaia-finanz/./src/scripts/main.js?");

/***/ })

}]);