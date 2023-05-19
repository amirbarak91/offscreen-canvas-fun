/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/entities/renderer/worker/renderer.worker.ts":
/*!*********************************************************!*\
  !*** ./src/entities/renderer/worker/renderer.worker.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const d3 = __importStar(__webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'd3'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
(() => {
    let x = 21;
    let y = 47;
    let xDir = 8;
    let yDir = 3;
    const rectWidth = 18;
    const rectHeight = 18;
    let color = 0;
    let colorDir = 1;
    const maxColor = 60 * 0.5;
    self.onmessage = (message) => {
        var _a;
        if (message === null || message === void 0 ? void 0 : message.data) {
            const offscreenCanvas = (_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.canvas;
            const context = offscreenCanvas.getContext("2d");
            if (context !== null) {
                mainLoop(context, offscreenCanvas);
            }
        }
    };
    function mainLoop(ctx, canvas) {
        debugger;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.beginPath();
        ctx.fillStyle = d3.interpolateSpectral(color / maxColor);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.rect(x, y, rectWidth, rectHeight);
        ctx.fill();
        // ctx.closePath();
        if (x < 0 || x > canvas.width - rectWidth) {
            xDir *= -1;
        }
        x += 1 * xDir;
        if (y < 0 || y > canvas.height - rectHeight) {
            yDir *= -1;
        }
        y += 1 * yDir;
        if (color < 0 || color > maxColor) {
            colorDir *= -1;
        }
        color += 1 * colorDir;
        const bitmap = canvas.transferToImageBitmap();
        self.postMessage({ action: "render", bitmap });
        requestAnimationFrame((_) => mainLoop(ctx, canvas));
    }
})();


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/entities/renderer/worker/renderer.worker.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=src_entities_renderer_worker_renderer_worker_ts.0d4ee31e3dd754967302.js.map