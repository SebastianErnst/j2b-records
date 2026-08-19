/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktimetracker"] = self["webpackChunktimetracker"] || []).push([["vendor"],{

/***/ 510:
/*!*****************************!*\
  !*** ./src/scripts/main.js ***!
  \*****************************/
/***/ (() => {

eval("{class Main {\n    constructor() {\n        // const module = document.querySelector('[data-moddule]');\n        const module = document.querySelector('body');\n        console.log(module);\n    }\n    loadTimeTrackerIframe() {\n        window.TrelloPowerUp.initialize({\n            'card-back-section': function(t, options){\n                return {\n                    title: 'Zeiterfassung',\n                    icon: '69',\n                    content: {\n                        type: 'iframe',\n                        url: t.signUrl('../markup/timetracker.html'),\n                        height: 500,\n                    }\n                };\n            }\n        });\n    }\n}\n\nnew Main();\n\n\n//# sourceURL=webpack://timetracker/./src/scripts/main.js?\n}");

/***/ })

}]);