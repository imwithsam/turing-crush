/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(13);
	mocha.setup("bdd");
	__webpack_require__(21)
	__webpack_require__(64);
	if(false) {
		module.hot.accept();
		module.hot.dispose(function() {
			mocha.suite.suites.length = 0;
			var stats = document.getElementById('mocha-stats');
			var report = document.getElementById('mocha-report');
			stats.parentNode.removeChild(stats);
			report.parentNode.removeChild(report);
		});
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	// TODO: Pass Board into Tile
	'use strict';

	function Tile(type, column, row) {
	  this.type = type || 0;
	  this.column = column;
	  this.row = row;
	};

	Tile.prototype = {
	  // TODO: May not need Tile.move()
	  move: function move(direction) {
	    switch (direction) {
	      case 'up':
	        this.row--;
	        break;
	      case 'down':
	        this.row++;
	        break;
	      case 'right':
	        this.column++;
	        break;
	      case 'left':
	        this.column--;
	        break;
	    }

	    return this;
	  },
	  select: function select(board) {
	    // TODO: Move Board up to Tile object
	    // TODO: Put select() & deselect() into a single draw()
	    //       and give tile a status.
	    var x = this.column * board.tileWidth;
	    var y = this.row * board.tileHeight;

	    board.context.strokeStyle = 'turquoise';
	    board.context.lineWidth = 4;
	    board.context.strokeRect(x, y, board.tileWidth, board.tileHeight);
	    board.selectedTile = this;

	    return this;
	  },
	  deselect: function deselect(board) {
	    var x = this.column * board.tileWidth;
	    var y = this.row * board.tileHeight;

	    board.context.strokeStyle = 'black';
	    board.context.lineWidth = 4;
	    board.context.strokeRect(x, y, board.tileWidth, board.tileHeight);
	    board.selectedTile = null;

	    return this;
	  }
	};

	module.exports = Tile;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Tile = __webpack_require__(1);

	function Board(canvas, context, columnCount, rowCount, tileWidth, tileHeight) {
	  this.canvas = canvas;
	  this.context = context;
	  this.columnCount = columnCount || 8;
	  this.rowCount = rowCount || 8;
	  this.tileWidth = tileWidth || 70;
	  this.tileHeight = tileHeight || 70;
	  this.width = this.tileWidth * this.columnCount;
	  this.height = this.tileHeight * this.rowCount;
	  this.selectedTile = null;
	  this.tiles = [];
	};

	Board.prototype = {
	  generate: function generate() {
	    for (var column = 0; column < this.columnCount; column++) {
	      for (var row = 0; row < this.rowCount; row++) {
	        // Generate random tile type (1-7)
	        // Zero is reserved for an empty tile
	        var type = Math.floor(Math.random() * 7 + 1);
	        var tile = new Tile(type, column, row);

	        this.tiles.push(tile);
	      }
	    }

	    return this;
	  },
	  render: function render() {
	    this.canvas.width = this.width;
	    this.canvas.height = this.height;

	    this.tiles.forEach(function (tile) {
	      var x = tile.column * this.tileWidth;
	      var y = tile.row * this.tileHeight;
	      var img = new Image();
	      img.src = __webpack_require__(3)("./" + tile.type + '.png');

	      this.context.drawImage(img, x, y);
	      this.context.strokeStyle = 'black';
	      this.context.lineWidth = 3;
	      this.context.strokeRect(x, y, this.tileWidth, this.tileHeight);
	    }, this);

	    return this;
	  },
	  getTile: function getTile(column, row) {
	    var retrievedTile;

	    this.tiles.forEach(function (tile) {
	      tileMatch: if (tile.column === column && tile.row === row) {
	        retrievedTile = tile;
	        break tileMatch;
	      }
	    }, this);

	    return retrievedTile;
	  },
	  getMatchesFor: function getMatchesFor(tile) {
	    var aboveTile, belowTile, leftTile, rightTile;
	    var match = false;
	    var verticalMatches = [tile];
	    var horizontalMatches = [tile];
	    var i;

	    i = 0;
	    do {
	      i++;
	      aboveTile = this.getTile(tile.column, tile.row - i);
	      match = aboveTile && aboveTile.type === tile.type;

	      if (match) {
	        verticalMatches.push(aboveTile);
	      }
	    } while (match);

	    i = 0;
	    do {
	      i++;
	      belowTile = this.getTile(tile.column, tile.row + i);
	      match = belowTile && belowTile.type === tile.type;

	      if (match) {
	        verticalMatches.push(belowTile);
	      }
	    } while (match);

	    i = 0;
	    do {
	      i++;
	      leftTile = this.getTile(tile.column - i, tile.row);
	      match = leftTile && leftTile.type === tile.type;

	      if (match) {
	        horizontalMatches.push(leftTile);
	      }
	    } while (match);

	    i = 0;
	    do {
	      i++;
	      rightTile = this.getTile(tile.column + i, tile.row);
	      match = rightTile && rightTile.type === tile.type;

	      if (match) {
	        horizontalMatches.push(rightTile);
	      }
	    } while (match);

	    var matches = {};
	    if (verticalMatches.length >= 3) {
	      matches.vertical = verticalMatches;
	    }
	    if (horizontalMatches.length >= 3) {
	      matches.horizontal = horizontalMatches;
	    }

	    if (!matches.vertical && !matches.horizontal) {
	      matches = null;
	    }

	    return matches;
	  },
	  getAllMatches: function getAllMatches() {
	    // Group by tile type
	    //   { 1: [tile, tile], 2: [tile, tile] }

	    var tilesByColumn = _.groupBy(this.tiles, function (tile) {
	      return tile.column;
	    });
	    var columnsByType = [];
	    for (var column in tilesByColumn) {
	      columnsByType.push(_.groupBy(tilesByColumn[column], function (tile) {
	        return tile.type;
	      }));
	    }

	    var tilesByRow = _.groupBy(this.tiles, function (tile) {
	      return tile.row;
	    });
	    var rowsByType = [];
	    for (var row in tilesByRow) {
	      rowsByType.push(_.groupBy(tilesByRow[row], function (tile) {
	        return tile.type;
	      }));
	    }

	    console.log('columnsByType', columnsByType);
	    console.log('rowsByType', rowsByType);
	  },
	  areAdjacentTiles: function areAdjacentTiles(tile1, tile2) {
	    if (tile1.column === tile2.column) {
	      if (tile1.row === tile2.row + 1 || tile1.row === tile2.row - 1) {
	        return true;
	      } else {
	        return false;
	      }
	    } else if (tile1.row === tile2.row) {
	      if (tile1.column === tile2.column + 1 || tile1.column === tile2.column - 1) {
	        return true;
	      } else {
	        return false;
	      }
	    } else {
	      return false;
	    }
	  },
	  swapTiles: function swapTiles(tile1, tile2) {
	    var tempType;

	    if (this.areAdjacentTiles(tile1, tile2)) {
	      tempType = tile1.type;
	      tile1.type = tile2.type;
	      tile2.type = tempType;

	      // Undo swap if there are no matches
	      if (!this.getMatchesFor(tile1) && !this.getMatchesFor(tile2)) {
	        tempType = tile1.type;
	        tile1.type = tile2.type;
	        tile2.type = tempType;

	        if (this.context) {
	          tile1.deselect(this);
	        }
	      }
	    }

	    return this;
	  }
	};

	module.exports = Board;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./1.png": 4,
		"./2.png": 5,
		"./3.png": 6,
		"./4.png": 7,
		"./5.png": 8,
		"./6.png": 9,
		"./7.png": 10
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 3;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	if (! document.getElementById("mocha")) { document.write("<div id=\"mocha\"></div>"); }

	__webpack_require__(14);
	__webpack_require__(18);


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(15);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(17)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/samson/turing/4module/turing-crush/node_modules/mocha-loader/node_modules/css-loader/index.js!/Users/samson/turing/4module/turing-crush/node_modules/mocha/mocha.css", function() {
			var newContent = require("!!/Users/samson/turing/4module/turing-crush/node_modules/mocha-loader/node_modules/css-loader/index.js!/Users/samson/turing/4module/turing-crush/node_modules/mocha/mocha.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(16)();
	exports.push([module.id, "@charset \"utf-8\";\n\nbody {\n  margin:0;\n}\n\n#mocha {\n  font: 20px/1.5 \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  margin: 60px 50px;\n}\n\n#mocha ul,\n#mocha li {\n  margin: 0;\n  padding: 0;\n}\n\n#mocha ul {\n  list-style: none;\n}\n\n#mocha h1,\n#mocha h2 {\n  margin: 0;\n}\n\n#mocha h1 {\n  margin-top: 15px;\n  font-size: 1em;\n  font-weight: 200;\n}\n\n#mocha h1 a {\n  text-decoration: none;\n  color: inherit;\n}\n\n#mocha h1 a:hover {\n  text-decoration: underline;\n}\n\n#mocha .suite .suite h1 {\n  margin-top: 0;\n  font-size: .8em;\n}\n\n#mocha .hidden {\n  display: none;\n}\n\n#mocha h2 {\n  font-size: 12px;\n  font-weight: normal;\n  cursor: pointer;\n}\n\n#mocha .suite {\n  margin-left: 15px;\n}\n\n#mocha .test {\n  margin-left: 15px;\n  overflow: hidden;\n}\n\n#mocha .test.pending:hover h2::after {\n  content: '(pending)';\n  font-family: arial, sans-serif;\n}\n\n#mocha .test.pass.medium .duration {\n  background: #c09853;\n}\n\n#mocha .test.pass.slow .duration {\n  background: #b94a48;\n}\n\n#mocha .test.pass::before {\n  content: '✓';\n  font-size: 12px;\n  display: block;\n  float: left;\n  margin-right: 5px;\n  color: #00d6b2;\n}\n\n#mocha .test.pass .duration {\n  font-size: 9px;\n  margin-left: 5px;\n  padding: 2px 5px;\n  color: #fff;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.2);\n  -moz-box-shadow: inset 0 1px 1px rgba(0,0,0,.2);\n  box-shadow: inset 0 1px 1px rgba(0,0,0,.2);\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  -ms-border-radius: 5px;\n  -o-border-radius: 5px;\n  border-radius: 5px;\n}\n\n#mocha .test.pass.fast .duration {\n  display: none;\n}\n\n#mocha .test.pending {\n  color: #0b97c4;\n}\n\n#mocha .test.pending::before {\n  content: '◦';\n  color: #0b97c4;\n}\n\n#mocha .test.fail {\n  color: #c00;\n}\n\n#mocha .test.fail pre {\n  color: black;\n}\n\n#mocha .test.fail::before {\n  content: '✖';\n  font-size: 12px;\n  display: block;\n  float: left;\n  margin-right: 5px;\n  color: #c00;\n}\n\n#mocha .test pre.error {\n  color: #c00;\n  max-height: 300px;\n  overflow: auto;\n}\n\n#mocha .test .html-error {\n  overflow: auto;\n  color: black;\n  line-height: 1.5;\n  display: block;\n  float: left;\n  clear: left;\n  font: 12px/1.5 monaco, monospace;\n  margin: 5px;\n  padding: 15px;\n  border: 1px solid #eee;\n  max-width: 85%; /*(1)*/\n  max-width: calc(100% - 42px); /*(2)*/\n  max-height: 300px;\n  word-wrap: break-word;\n  border-bottom-color: #ddd;\n  -webkit-border-radius: 3px;\n  -webkit-box-shadow: 0 1px 3px #eee;\n  -moz-border-radius: 3px;\n  -moz-box-shadow: 0 1px 3px #eee;\n  border-radius: 3px;\n}\n\n#mocha .test .html-error pre.error {\n  border: none;\n  -webkit-border-radius: none;\n  -webkit-box-shadow: none;\n  -moz-border-radius: none;\n  -moz-box-shadow: none;\n  padding: 0;\n  margin: 0;\n  margin-top: 18px;\n  max-height: none;\n}\n\n/**\n * (1): approximate for browsers not supporting calc\n * (2): 42 = 2*15 + 2*10 + 2*1 (padding + margin + border)\n *      ^^ seriously\n */\n#mocha .test pre {\n  display: block;\n  float: left;\n  clear: left;\n  font: 12px/1.5 monaco, monospace;\n  margin: 5px;\n  padding: 15px;\n  border: 1px solid #eee;\n  max-width: 85%; /*(1)*/\n  max-width: calc(100% - 42px); /*(2)*/\n  word-wrap: break-word;\n  border-bottom-color: #ddd;\n  -webkit-border-radius: 3px;\n  -webkit-box-shadow: 0 1px 3px #eee;\n  -moz-border-radius: 3px;\n  -moz-box-shadow: 0 1px 3px #eee;\n  border-radius: 3px;\n}\n\n#mocha .test h2 {\n  position: relative;\n}\n\n#mocha .test a.replay {\n  position: absolute;\n  top: 3px;\n  right: 0;\n  text-decoration: none;\n  vertical-align: middle;\n  display: block;\n  width: 15px;\n  height: 15px;\n  line-height: 15px;\n  text-align: center;\n  background: #eee;\n  font-size: 15px;\n  -moz-border-radius: 15px;\n  border-radius: 15px;\n  -webkit-transition: opacity 200ms;\n  -moz-transition: opacity 200ms;\n  transition: opacity 200ms;\n  opacity: 0.3;\n  color: #888;\n}\n\n#mocha .test:hover a.replay {\n  opacity: 1;\n}\n\n#mocha-report.pass .test.fail {\n  display: none;\n}\n\n#mocha-report.fail .test.pass {\n  display: none;\n}\n\n#mocha-report.pending .test.pass,\n#mocha-report.pending .test.fail {\n  display: none;\n}\n#mocha-report.pending .test.pass.pending {\n  display: block;\n}\n\n#mocha-error {\n  color: #c00;\n  font-size: 1.5em;\n  font-weight: 100;\n  letter-spacing: 1px;\n}\n\n#mocha-stats {\n  position: fixed;\n  top: 15px;\n  right: 10px;\n  font-size: 12px;\n  margin: 0;\n  color: #888;\n  z-index: 1;\n}\n\n#mocha-stats .progress {\n  float: right;\n  padding-top: 0;\n}\n\n#mocha-stats em {\n  color: black;\n}\n\n#mocha-stats a {\n  text-decoration: none;\n  color: inherit;\n}\n\n#mocha-stats a:hover {\n  border-bottom: 1px solid #eee;\n}\n\n#mocha-stats li {\n  display: inline-block;\n  margin: 0 5px;\n  list-style: none;\n  padding-top: 11px;\n}\n\n#mocha-stats canvas {\n  width: 40px;\n  height: 40px;\n}\n\n#mocha code .comment { color: #ddd; }\n#mocha code .init { color: #2f6fad; }\n#mocha code .string { color: #5890ad; }\n#mocha code .keyword { color: #8a6343; }\n#mocha code .number { color: #2f6fad; }\n\n@media screen and (max-device-width: 480px) {\n  #mocha {\n    margin: 60px 0px;\n  }\n\n  #mocha #stats {\n    position: absolute;\n  }\n}\n", ""]);

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function () {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(19)(__webpack_require__(20))

/***/ },
/* 19 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(src) {
		if (typeof execScript === "function")
			execScript(src);
		else
			eval.call(null, src);
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error(\"Cannot find module '\"+o+\"'\");throw f.code=\"MODULE_NOT_FOUND\",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n(function (process){\nmodule.exports = process.env.COV\n  ? require('./lib-cov/mocha')\n  : require('./lib/mocha');\n\n}).call(this,require('_process'))\n},{\"./lib-cov/mocha\":undefined,\"./lib/mocha\":14,\"_process\":51}],2:[function(require,module,exports){\n/* eslint-disable no-unused-vars */\nmodule.exports = function(type) {\n  return function() {};\n};\n\n},{}],3:[function(require,module,exports){\n/**\n * Module exports.\n */\n\nexports.EventEmitter = EventEmitter;\n\n/**\n * Object#hasOwnProperty reference.\n */\nvar objToString = Object.prototype.toString;\n\n/**\n * Check if a value is an array.\n *\n * @api private\n * @param {*} val The value to test.\n * @return {boolean} true if the value is a boolean, otherwise false.\n */\nfunction isArray(val) {\n  return objToString.call(val) === '[object Array]';\n}\n\n/**\n * Event emitter constructor.\n *\n * @api public\n */\nfunction EventEmitter() {}\n\n/**\n * Add a listener.\n *\n * @api public\n * @param {string} name Event name.\n * @param {Function} fn Event handler.\n * @return {EventEmitter} Emitter instance.\n */\nEventEmitter.prototype.on = function(name, fn) {\n  if (!this.$events) {\n    this.$events = {};\n  }\n\n  if (!this.$events[name]) {\n    this.$events[name] = fn;\n  } else if (isArray(this.$events[name])) {\n    this.$events[name].push(fn);\n  } else {\n    this.$events[name] = [this.$events[name], fn];\n  }\n\n  return this;\n};\n\nEventEmitter.prototype.addListener = EventEmitter.prototype.on;\n\n/**\n * Adds a volatile listener.\n *\n * @api public\n * @param {string} name Event name.\n * @param {Function} fn Event handler.\n * @return {EventEmitter} Emitter instance.\n */\nEventEmitter.prototype.once = function(name, fn) {\n  var self = this;\n\n  function on() {\n    self.removeListener(name, on);\n    fn.apply(this, arguments);\n  }\n\n  on.listener = fn;\n  this.on(name, on);\n\n  return this;\n};\n\n/**\n * Remove a listener.\n *\n * @api public\n * @param {string} name Event name.\n * @param {Function} fn Event handler.\n * @return {EventEmitter} Emitter instance.\n */\nEventEmitter.prototype.removeListener = function(name, fn) {\n  if (this.$events && this.$events[name]) {\n    var list = this.$events[name];\n\n    if (isArray(list)) {\n      var pos = -1;\n\n      for (var i = 0, l = list.length; i < l; i++) {\n        if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {\n          pos = i;\n          break;\n        }\n      }\n\n      if (pos < 0) {\n        return this;\n      }\n\n      list.splice(pos, 1);\n\n      if (!list.length) {\n        delete this.$events[name];\n      }\n    } else if (list === fn || (list.listener && list.listener === fn)) {\n      delete this.$events[name];\n    }\n  }\n\n  return this;\n};\n\n/**\n * Remove all listeners for an event.\n *\n * @api public\n * @param {string} name Event name.\n * @return {EventEmitter} Emitter instance.\n */\nEventEmitter.prototype.removeAllListeners = function(name) {\n  if (name === undefined) {\n    this.$events = {};\n    return this;\n  }\n\n  if (this.$events && this.$events[name]) {\n    this.$events[name] = null;\n  }\n\n  return this;\n};\n\n/**\n * Get all listeners for a given event.\n *\n * @api public\n * @param {string} name Event name.\n * @return {EventEmitter} Emitter instance.\n */\nEventEmitter.prototype.listeners = function(name) {\n  if (!this.$events) {\n    this.$events = {};\n  }\n\n  if (!this.$events[name]) {\n    this.$events[name] = [];\n  }\n\n  if (!isArray(this.$events[name])) {\n    this.$events[name] = [this.$events[name]];\n  }\n\n  return this.$events[name];\n};\n\n/**\n * Emit an event.\n *\n * @api public\n * @param {string} name Event name.\n * @return {boolean} true if at least one handler was invoked, else false.\n */\nEventEmitter.prototype.emit = function(name) {\n  if (!this.$events) {\n    return false;\n  }\n\n  var handler = this.$events[name];\n\n  if (!handler) {\n    return false;\n  }\n\n  var args = Array.prototype.slice.call(arguments, 1);\n\n  if (typeof handler === 'function') {\n    handler.apply(this, args);\n  } else if (isArray(handler)) {\n    var listeners = handler.slice();\n\n    for (var i = 0, l = listeners.length; i < l; i++) {\n      listeners[i].apply(this, args);\n    }\n  } else {\n    return false;\n  }\n\n  return true;\n};\n\n},{}],4:[function(require,module,exports){\n/**\n * Expose `Progress`.\n */\n\nmodule.exports = Progress;\n\n/**\n * Initialize a new `Progress` indicator.\n */\nfunction Progress() {\n  this.percent = 0;\n  this.size(0);\n  this.fontSize(11);\n  this.font('helvetica, arial, sans-serif');\n}\n\n/**\n * Set progress size to `size`.\n *\n * @api public\n * @param {number} size\n * @return {Progress} Progress instance.\n */\nProgress.prototype.size = function(size) {\n  this._size = size;\n  return this;\n};\n\n/**\n * Set text to `text`.\n *\n * @api public\n * @param {string} text\n * @return {Progress} Progress instance.\n */\nProgress.prototype.text = function(text) {\n  this._text = text;\n  return this;\n};\n\n/**\n * Set font size to `size`.\n *\n * @api public\n * @param {number} size\n * @return {Progress} Progress instance.\n */\nProgress.prototype.fontSize = function(size) {\n  this._fontSize = size;\n  return this;\n};\n\n/**\n * Set font to `family`.\n *\n * @param {string} family\n * @return {Progress} Progress instance.\n */\nProgress.prototype.font = function(family) {\n  this._font = family;\n  return this;\n};\n\n/**\n * Update percentage to `n`.\n *\n * @param {number} n\n * @return {Progress} Progress instance.\n */\nProgress.prototype.update = function(n) {\n  this.percent = n;\n  return this;\n};\n\n/**\n * Draw on `ctx`.\n *\n * @param {CanvasRenderingContext2d} ctx\n * @return {Progress} Progress instance.\n */\nProgress.prototype.draw = function(ctx) {\n  try {\n    var percent = Math.min(this.percent, 100);\n    var size = this._size;\n    var half = size / 2;\n    var x = half;\n    var y = half;\n    var rad = half - 1;\n    var fontSize = this._fontSize;\n\n    ctx.font = fontSize + 'px ' + this._font;\n\n    var angle = Math.PI * 2 * (percent / 100);\n    ctx.clearRect(0, 0, size, size);\n\n    // outer circle\n    ctx.strokeStyle = '#9f9f9f';\n    ctx.beginPath();\n    ctx.arc(x, y, rad, 0, angle, false);\n    ctx.stroke();\n\n    // inner circle\n    ctx.strokeStyle = '#eee';\n    ctx.beginPath();\n    ctx.arc(x, y, rad - 1, 0, angle, true);\n    ctx.stroke();\n\n    // text\n    var text = this._text || (percent | 0) + '%';\n    var w = ctx.measureText(text).width;\n\n    ctx.fillText(text, x - w / 2 + 1, y + fontSize / 2 - 1);\n  } catch (err) {\n    // don't fail if we can't render progress\n  }\n  return this;\n};\n\n},{}],5:[function(require,module,exports){\n(function (global){\nexports.isatty = function isatty() {\n  return true;\n};\n\nexports.getWindowSize = function getWindowSize() {\n  if ('innerHeight' in global) {\n    return [global.innerHeight, global.innerWidth];\n  }\n  // In a Web Worker, the DOM Window is not available.\n  return [640, 480];\n};\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{}],6:[function(require,module,exports){\n/**\n * Expose `Context`.\n */\n\nmodule.exports = Context;\n\n/**\n * Initialize a new `Context`.\n *\n * @api private\n */\nfunction Context() {}\n\n/**\n * Set or get the context `Runnable` to `runnable`.\n *\n * @api private\n * @param {Runnable} runnable\n * @return {Context}\n */\nContext.prototype.runnable = function(runnable) {\n  if (!arguments.length) {\n    return this._runnable;\n  }\n  this.test = this._runnable = runnable;\n  return this;\n};\n\n/**\n * Set test timeout `ms`.\n *\n * @api private\n * @param {number} ms\n * @return {Context} self\n */\nContext.prototype.timeout = function(ms) {\n  if (!arguments.length) {\n    return this.runnable().timeout();\n  }\n  this.runnable().timeout(ms);\n  return this;\n};\n\n/**\n * Set test timeout `enabled`.\n *\n * @api private\n * @param {boolean} enabled\n * @return {Context} self\n */\nContext.prototype.enableTimeouts = function(enabled) {\n  this.runnable().enableTimeouts(enabled);\n  return this;\n};\n\n/**\n * Set test slowness threshold `ms`.\n *\n * @api private\n * @param {number} ms\n * @return {Context} self\n */\nContext.prototype.slow = function(ms) {\n  this.runnable().slow(ms);\n  return this;\n};\n\n/**\n * Mark a test as skipped.\n *\n * @api private\n * @return {Context} self\n */\nContext.prototype.skip = function() {\n  this.runnable().skip();\n  return this;\n};\n\n/**\n * Inspect the context void of `._runnable`.\n *\n * @api private\n * @return {string}\n */\nContext.prototype.inspect = function() {\n  return JSON.stringify(this, function(key, val) {\n    return key === 'runnable' || key === 'test' ? undefined : val;\n  }, 2);\n};\n\n},{}],7:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar Runnable = require('./runnable');\nvar inherits = require('./utils').inherits;\n\n/**\n * Expose `Hook`.\n */\n\nmodule.exports = Hook;\n\n/**\n * Initialize a new `Hook` with the given `title` and callback `fn`.\n *\n * @param {String} title\n * @param {Function} fn\n * @api private\n */\nfunction Hook(title, fn) {\n  Runnable.call(this, title, fn);\n  this.type = 'hook';\n}\n\n/**\n * Inherit from `Runnable.prototype`.\n */\ninherits(Hook, Runnable);\n\n/**\n * Get or set the test `err`.\n *\n * @param {Error} err\n * @return {Error}\n * @api public\n */\nHook.prototype.error = function(err) {\n  if (!arguments.length) {\n    err = this._error;\n    this._error = null;\n    return err;\n  }\n\n  this._error = err;\n};\n\n},{\"./runnable\":35,\"./utils\":39}],8:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar Suite = require('../suite');\nvar Test = require('../test');\nvar escapeRe = require('escape-string-regexp');\n\n/**\n * BDD-style interface:\n *\n *      describe('Array', function() {\n *        describe('#indexOf()', function() {\n *          it('should return -1 when not present', function() {\n *            // ...\n *          });\n *\n *          it('should return the index when present', function() {\n *            // ...\n *          });\n *        });\n *      });\n *\n * @param {Suite} suite Root suite.\n */\nmodule.exports = function(suite) {\n  var suites = [suite];\n\n  suite.on('pre-require', function(context, file, mocha) {\n    var common = require('./common')(suites, context);\n\n    context.before = common.before;\n    context.after = common.after;\n    context.beforeEach = common.beforeEach;\n    context.afterEach = common.afterEach;\n    context.run = mocha.options.delay && common.runWithSuite(suite);\n    /**\n     * Describe a \"suite\" with the given `title`\n     * and callback `fn` containing nested suites\n     * and/or tests.\n     */\n\n    context.describe = context.context = function(title, fn) {\n      var suite = Suite.create(suites[0], title);\n      suite.file = file;\n      suites.unshift(suite);\n      fn.call(suite);\n      suites.shift();\n      return suite;\n    };\n\n    /**\n     * Pending describe.\n     */\n\n    context.xdescribe = context.xcontext = context.describe.skip = function(title, fn) {\n      var suite = Suite.create(suites[0], title);\n      suite.pending = true;\n      suites.unshift(suite);\n      fn.call(suite);\n      suites.shift();\n    };\n\n    /**\n     * Exclusive suite.\n     */\n\n    context.describe.only = function(title, fn) {\n      var suite = context.describe(title, fn);\n      mocha.grep(suite.fullTitle());\n      return suite;\n    };\n\n    /**\n     * Describe a specification or test-case\n     * with the given `title` and callback `fn`\n     * acting as a thunk.\n     */\n\n    context.it = context.specify = function(title, fn) {\n      var suite = suites[0];\n      if (suite.pending) {\n        fn = null;\n      }\n      var test = new Test(title, fn);\n      test.file = file;\n      suite.addTest(test);\n      return test;\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n\n    context.it.only = function(title, fn) {\n      var test = context.it(title, fn);\n      var reString = '^' + escapeRe(test.fullTitle()) + '$';\n      mocha.grep(new RegExp(reString));\n      return test;\n    };\n\n    /**\n     * Pending test case.\n     */\n\n    context.xit = context.xspecify = context.it.skip = function(title) {\n      context.it(title);\n    };\n  });\n};\n\n},{\"../suite\":37,\"../test\":38,\"./common\":9,\"escape-string-regexp\":68}],9:[function(require,module,exports){\n'use strict';\n\n/**\n * Functions common to more than one interface.\n *\n * @param {Suite[]} suites\n * @param {Context} context\n * @return {Object} An object containing common functions.\n */\nmodule.exports = function(suites, context) {\n  return {\n    /**\n     * This is only present if flag --delay is passed into Mocha. It triggers\n     * root suite execution.\n     *\n     * @param {Suite} suite The root wuite.\n     * @return {Function} A function which runs the root suite\n     */\n    runWithSuite: function runWithSuite(suite) {\n      return function run() {\n        suite.run();\n      };\n    },\n\n    /**\n     * Execute before running tests.\n     *\n     * @param {string} name\n     * @param {Function} fn\n     */\n    before: function(name, fn) {\n      suites[0].beforeAll(name, fn);\n    },\n\n    /**\n     * Execute after running tests.\n     *\n     * @param {string} name\n     * @param {Function} fn\n     */\n    after: function(name, fn) {\n      suites[0].afterAll(name, fn);\n    },\n\n    /**\n     * Execute before each test case.\n     *\n     * @param {string} name\n     * @param {Function} fn\n     */\n    beforeEach: function(name, fn) {\n      suites[0].beforeEach(name, fn);\n    },\n\n    /**\n     * Execute after each test case.\n     *\n     * @param {string} name\n     * @param {Function} fn\n     */\n    afterEach: function(name, fn) {\n      suites[0].afterEach(name, fn);\n    },\n\n    test: {\n      /**\n       * Pending test case.\n       *\n       * @param {string} title\n       */\n      skip: function(title) {\n        context.test(title);\n      }\n    }\n  };\n};\n\n},{}],10:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar Suite = require('../suite');\nvar Test = require('../test');\n\n/**\n * TDD-style interface:\n *\n *     exports.Array = {\n *       '#indexOf()': {\n *         'should return -1 when the value is not present': function() {\n *\n *         },\n *\n *         'should return the correct index when the value is present': function() {\n *\n *         }\n *       }\n *     };\n *\n * @param {Suite} suite Root suite.\n */\nmodule.exports = function(suite) {\n  var suites = [suite];\n\n  suite.on('require', visit);\n\n  function visit(obj, file) {\n    var suite;\n    for (var key in obj) {\n      if (typeof obj[key] === 'function') {\n        var fn = obj[key];\n        switch (key) {\n          case 'before':\n            suites[0].beforeAll(fn);\n            break;\n          case 'after':\n            suites[0].afterAll(fn);\n            break;\n          case 'beforeEach':\n            suites[0].beforeEach(fn);\n            break;\n          case 'afterEach':\n            suites[0].afterEach(fn);\n            break;\n          default:\n            var test = new Test(key, fn);\n            test.file = file;\n            suites[0].addTest(test);\n        }\n      } else {\n        suite = Suite.create(suites[0], key);\n        suites.unshift(suite);\n        visit(obj[key]);\n        suites.shift();\n      }\n    }\n  }\n};\n\n},{\"../suite\":37,\"../test\":38}],11:[function(require,module,exports){\nexports.bdd = require('./bdd');\nexports.tdd = require('./tdd');\nexports.qunit = require('./qunit');\nexports.exports = require('./exports');\n\n},{\"./bdd\":8,\"./exports\":10,\"./qunit\":12,\"./tdd\":13}],12:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar Suite = require('../suite');\nvar Test = require('../test');\nvar escapeRe = require('escape-string-regexp');\n\n/**\n * QUnit-style interface:\n *\n *     suite('Array');\n *\n *     test('#length', function() {\n *       var arr = [1,2,3];\n *       ok(arr.length == 3);\n *     });\n *\n *     test('#indexOf()', function() {\n *       var arr = [1,2,3];\n *       ok(arr.indexOf(1) == 0);\n *       ok(arr.indexOf(2) == 1);\n *       ok(arr.indexOf(3) == 2);\n *     });\n *\n *     suite('String');\n *\n *     test('#length', function() {\n *       ok('foo'.length == 3);\n *     });\n *\n * @param {Suite} suite Root suite.\n */\nmodule.exports = function(suite) {\n  var suites = [suite];\n\n  suite.on('pre-require', function(context, file, mocha) {\n    var common = require('./common')(suites, context);\n\n    context.before = common.before;\n    context.after = common.after;\n    context.beforeEach = common.beforeEach;\n    context.afterEach = common.afterEach;\n    context.run = mocha.options.delay && common.runWithSuite(suite);\n    /**\n     * Describe a \"suite\" with the given `title`.\n     */\n\n    context.suite = function(title) {\n      if (suites.length > 1) {\n        suites.shift();\n      }\n      var suite = Suite.create(suites[0], title);\n      suite.file = file;\n      suites.unshift(suite);\n      return suite;\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n\n    context.suite.only = function(title, fn) {\n      var suite = context.suite(title, fn);\n      mocha.grep(suite.fullTitle());\n    };\n\n    /**\n     * Describe a specification or test-case\n     * with the given `title` and callback `fn`\n     * acting as a thunk.\n     */\n\n    context.test = function(title, fn) {\n      var test = new Test(title, fn);\n      test.file = file;\n      suites[0].addTest(test);\n      return test;\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n\n    context.test.only = function(title, fn) {\n      var test = context.test(title, fn);\n      var reString = '^' + escapeRe(test.fullTitle()) + '$';\n      mocha.grep(new RegExp(reString));\n    };\n\n    context.test.skip = common.test.skip;\n  });\n};\n\n},{\"../suite\":37,\"../test\":38,\"./common\":9,\"escape-string-regexp\":68}],13:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar Suite = require('../suite');\nvar Test = require('../test');\nvar escapeRe = require('escape-string-regexp');\n\n/**\n * TDD-style interface:\n *\n *      suite('Array', function() {\n *        suite('#indexOf()', function() {\n *          suiteSetup(function() {\n *\n *          });\n *\n *          test('should return -1 when not present', function() {\n *\n *          });\n *\n *          test('should return the index when present', function() {\n *\n *          });\n *\n *          suiteTeardown(function() {\n *\n *          });\n *        });\n *      });\n *\n * @param {Suite} suite Root suite.\n */\nmodule.exports = function(suite) {\n  var suites = [suite];\n\n  suite.on('pre-require', function(context, file, mocha) {\n    var common = require('./common')(suites, context);\n\n    context.setup = common.beforeEach;\n    context.teardown = common.afterEach;\n    context.suiteSetup = common.before;\n    context.suiteTeardown = common.after;\n    context.run = mocha.options.delay && common.runWithSuite(suite);\n\n    /**\n     * Describe a \"suite\" with the given `title` and callback `fn` containing\n     * nested suites and/or tests.\n     */\n    context.suite = function(title, fn) {\n      var suite = Suite.create(suites[0], title);\n      suite.file = file;\n      suites.unshift(suite);\n      fn.call(suite);\n      suites.shift();\n      return suite;\n    };\n\n    /**\n     * Pending suite.\n     */\n    context.suite.skip = function(title, fn) {\n      var suite = Suite.create(suites[0], title);\n      suite.pending = true;\n      suites.unshift(suite);\n      fn.call(suite);\n      suites.shift();\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n    context.suite.only = function(title, fn) {\n      var suite = context.suite(title, fn);\n      mocha.grep(suite.fullTitle());\n    };\n\n    /**\n     * Describe a specification or test-case with the given `title` and\n     * callback `fn` acting as a thunk.\n     */\n    context.test = function(title, fn) {\n      var suite = suites[0];\n      if (suite.pending) {\n        fn = null;\n      }\n      var test = new Test(title, fn);\n      test.file = file;\n      suite.addTest(test);\n      return test;\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n\n    context.test.only = function(title, fn) {\n      var test = context.test(title, fn);\n      var reString = '^' + escapeRe(test.fullTitle()) + '$';\n      mocha.grep(new RegExp(reString));\n    };\n\n    context.test.skip = common.test.skip;\n  });\n};\n\n},{\"../suite\":37,\"../test\":38,\"./common\":9,\"escape-string-regexp\":68}],14:[function(require,module,exports){\n(function (process,global,__dirname){\n/*!\n * mocha\n * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>\n * MIT Licensed\n */\n\n/**\n * Module dependencies.\n */\n\nvar escapeRe = require('escape-string-regexp');\nvar path = require('path');\nvar reporters = require('./reporters');\nvar utils = require('./utils');\n\n/**\n * Expose `Mocha`.\n */\n\nexports = module.exports = Mocha;\n\n/**\n * To require local UIs and reporters when running in node.\n */\n\nif (!process.browser) {\n  var cwd = process.cwd();\n  module.paths.push(cwd, path.join(cwd, 'node_modules'));\n}\n\n/**\n * Expose internals.\n */\n\nexports.utils = utils;\nexports.interfaces = require('./interfaces');\nexports.reporters = reporters;\nexports.Runnable = require('./runnable');\nexports.Context = require('./context');\nexports.Runner = require('./runner');\nexports.Suite = require('./suite');\nexports.Hook = require('./hook');\nexports.Test = require('./test');\n\n/**\n * Return image `name` path.\n *\n * @api private\n * @param {string} name\n * @return {string}\n */\nfunction image(name) {\n  return path.join(__dirname, '../images', name + '.png');\n}\n\n/**\n * Set up mocha with `options`.\n *\n * Options:\n *\n *   - `ui` name \"bdd\", \"tdd\", \"exports\" etc\n *   - `reporter` reporter instance, defaults to `mocha.reporters.spec`\n *   - `globals` array of accepted globals\n *   - `timeout` timeout in milliseconds\n *   - `bail` bail on the first test failure\n *   - `slow` milliseconds to wait before considering a test slow\n *   - `ignoreLeaks` ignore global leaks\n *   - `fullTrace` display the full stack-trace on failing\n *   - `grep` string or regexp to filter tests with\n *\n * @param {Object} options\n * @api public\n */\nfunction Mocha(options) {\n  options = options || {};\n  this.files = [];\n  this.options = options;\n  if (options.grep) {\n    this.grep(new RegExp(options.grep));\n  }\n  if (options.fgrep) {\n    this.grep(options.fgrep);\n  }\n  this.suite = new exports.Suite('', new exports.Context());\n  this.ui(options.ui);\n  this.bail(options.bail);\n  this.reporter(options.reporter, options.reporterOptions);\n  if (typeof options.timeout !== 'undefined' && options.timeout !== null) {\n    this.timeout(options.timeout);\n  }\n  this.useColors(options.useColors);\n  if (options.enableTimeouts !== null) {\n    this.enableTimeouts(options.enableTimeouts);\n  }\n  if (options.slow) {\n    this.slow(options.slow);\n  }\n\n  this.suite.on('pre-require', function(context) {\n    exports.afterEach = context.afterEach || context.teardown;\n    exports.after = context.after || context.suiteTeardown;\n    exports.beforeEach = context.beforeEach || context.setup;\n    exports.before = context.before || context.suiteSetup;\n    exports.describe = context.describe || context.suite;\n    exports.it = context.it || context.test;\n    exports.setup = context.setup || context.beforeEach;\n    exports.suiteSetup = context.suiteSetup || context.before;\n    exports.suiteTeardown = context.suiteTeardown || context.after;\n    exports.suite = context.suite || context.describe;\n    exports.teardown = context.teardown || context.afterEach;\n    exports.test = context.test || context.it;\n    exports.run = context.run;\n  });\n}\n\n/**\n * Enable or disable bailing on the first failure.\n *\n * @api public\n * @param {boolean} [bail]\n */\nMocha.prototype.bail = function(bail) {\n  if (!arguments.length) {\n    bail = true;\n  }\n  this.suite.bail(bail);\n  return this;\n};\n\n/**\n * Add test `file`.\n *\n * @api public\n * @param {string} file\n */\nMocha.prototype.addFile = function(file) {\n  this.files.push(file);\n  return this;\n};\n\n/**\n * Set reporter to `reporter`, defaults to \"spec\".\n *\n * @param {String|Function} reporter name or constructor\n * @param {Object} reporterOptions optional options\n * @api public\n * @param {string|Function} reporter name or constructor\n * @param {Object} reporterOptions optional options\n */\nMocha.prototype.reporter = function(reporter, reporterOptions) {\n  if (typeof reporter === 'function') {\n    this._reporter = reporter;\n  } else {\n    reporter = reporter || 'spec';\n    var _reporter;\n    // Try to load a built-in reporter.\n    if (reporters[reporter]) {\n      _reporter = reporters[reporter];\n    }\n    // Try to load reporters from process.cwd() and node_modules\n    if (!_reporter) {\n      try {\n        _reporter = require(reporter);\n      } catch (err) {\n        err.message.indexOf('Cannot find module') !== -1\n          ? console.warn('\"' + reporter + '\" reporter not found')\n          : console.warn('\"' + reporter + '\" reporter blew up with error:\\n' + err.stack);\n      }\n    }\n    if (!_reporter && reporter === 'teamcity') {\n      console.warn('The Teamcity reporter was moved to a package named '\n        + 'mocha-teamcity-reporter '\n        + '(https://npmjs.org/package/mocha-teamcity-reporter).');\n    }\n    if (!_reporter) {\n      throw new Error('invalid reporter \"' + reporter + '\"');\n    }\n    this._reporter = _reporter;\n  }\n  this.options.reporterOptions = reporterOptions;\n  return this;\n};\n\n/**\n * Set test UI `name`, defaults to \"bdd\".\n *\n * @api public\n * @param {string} bdd\n */\nMocha.prototype.ui = function(name) {\n  name = name || 'bdd';\n  this._ui = exports.interfaces[name];\n  if (!this._ui) {\n    try {\n      this._ui = require(name);\n    } catch (err) {\n      throw new Error('invalid interface \"' + name + '\"');\n    }\n  }\n  this._ui = this._ui(this.suite);\n  return this;\n};\n\n/**\n * Load registered files.\n *\n * @api private\n */\nMocha.prototype.loadFiles = function(fn) {\n  var self = this;\n  var suite = this.suite;\n  var pending = this.files.length;\n  this.files.forEach(function(file) {\n    file = path.resolve(file);\n    suite.emit('pre-require', global, file, self);\n    suite.emit('require', require(file), file, self);\n    suite.emit('post-require', global, file, self);\n    --pending || (fn && fn());\n  });\n};\n\n/**\n * Enable growl support.\n *\n * @api private\n */\nMocha.prototype._growl = function(runner, reporter) {\n  var notify = require('growl');\n\n  runner.on('end', function() {\n    var stats = reporter.stats;\n    if (stats.failures) {\n      var msg = stats.failures + ' of ' + runner.total + ' tests failed';\n      notify(msg, { name: 'mocha', title: 'Failed', image: image('error') });\n    } else {\n      notify(stats.passes + ' tests passed in ' + stats.duration + 'ms', {\n        name: 'mocha',\n        title: 'Passed',\n        image: image('ok')\n      });\n    }\n  });\n};\n\n/**\n * Add regexp to grep, if `re` is a string it is escaped.\n *\n * @param {RegExp|String} re\n * @return {Mocha}\n * @api public\n * @param {RegExp|string} re\n * @return {Mocha}\n */\nMocha.prototype.grep = function(re) {\n  this.options.grep = typeof re === 'string' ? new RegExp(escapeRe(re)) : re;\n  return this;\n};\n\n/**\n * Invert `.grep()` matches.\n *\n * @return {Mocha}\n * @api public\n */\nMocha.prototype.invert = function() {\n  this.options.invert = true;\n  return this;\n};\n\n/**\n * Ignore global leaks.\n *\n * @param {Boolean} ignore\n * @return {Mocha}\n * @api public\n * @param {boolean} ignore\n * @return {Mocha}\n */\nMocha.prototype.ignoreLeaks = function(ignore) {\n  this.options.ignoreLeaks = Boolean(ignore);\n  return this;\n};\n\n/**\n * Enable global leak checking.\n *\n * @return {Mocha}\n * @api public\n */\nMocha.prototype.checkLeaks = function() {\n  this.options.ignoreLeaks = false;\n  return this;\n};\n\n/**\n * Display long stack-trace on failing\n *\n * @return {Mocha}\n * @api public\n */\nMocha.prototype.fullTrace = function() {\n  this.options.fullStackTrace = true;\n  return this;\n};\n\n/**\n * Enable growl support.\n *\n * @return {Mocha}\n * @api public\n */\nMocha.prototype.growl = function() {\n  this.options.growl = true;\n  return this;\n};\n\n/**\n * Ignore `globals` array or string.\n *\n * @param {Array|String} globals\n * @return {Mocha}\n * @api public\n * @param {Array|string} globals\n * @return {Mocha}\n */\nMocha.prototype.globals = function(globals) {\n  this.options.globals = (this.options.globals || []).concat(globals);\n  return this;\n};\n\n/**\n * Emit color output.\n *\n * @param {Boolean} colors\n * @return {Mocha}\n * @api public\n * @param {boolean} colors\n * @return {Mocha}\n */\nMocha.prototype.useColors = function(colors) {\n  if (colors !== undefined) {\n    this.options.useColors = colors;\n  }\n  return this;\n};\n\n/**\n * Use inline diffs rather than +/-.\n *\n * @param {Boolean} inlineDiffs\n * @return {Mocha}\n * @api public\n * @param {boolean} inlineDiffs\n * @return {Mocha}\n */\nMocha.prototype.useInlineDiffs = function(inlineDiffs) {\n  this.options.useInlineDiffs = inlineDiffs !== undefined && inlineDiffs;\n  return this;\n};\n\n/**\n * Set the timeout in milliseconds.\n *\n * @param {Number} timeout\n * @return {Mocha}\n * @api public\n * @param {number} timeout\n * @return {Mocha}\n */\nMocha.prototype.timeout = function(timeout) {\n  this.suite.timeout(timeout);\n  return this;\n};\n\n/**\n * Set slowness threshold in milliseconds.\n *\n * @param {Number} slow\n * @return {Mocha}\n * @api public\n * @param {number} slow\n * @return {Mocha}\n */\nMocha.prototype.slow = function(slow) {\n  this.suite.slow(slow);\n  return this;\n};\n\n/**\n * Enable timeouts.\n *\n * @param {Boolean} enabled\n * @return {Mocha}\n * @api public\n * @param {boolean} enabled\n * @return {Mocha}\n */\nMocha.prototype.enableTimeouts = function(enabled) {\n  this.suite.enableTimeouts(arguments.length && enabled !== undefined ? enabled : true);\n  return this;\n};\n\n/**\n * Makes all tests async (accepting a callback)\n *\n * @return {Mocha}\n * @api public\n */\nMocha.prototype.asyncOnly = function() {\n  this.options.asyncOnly = true;\n  return this;\n};\n\n/**\n * Disable syntax highlighting (in browser).\n *\n * @api public\n */\nMocha.prototype.noHighlighting = function() {\n  this.options.noHighlighting = true;\n  return this;\n};\n\n/**\n * Enable uncaught errors to propagate (in browser).\n *\n * @return {Mocha}\n * @api public\n */\nMocha.prototype.allowUncaught = function() {\n  this.options.allowUncaught = true;\n  return this;\n};\n\n/**\n * Delay root suite execution.\n * @returns {Mocha}\n */\nMocha.prototype.delay = function delay() {\n  this.options.delay = true;\n  return this;\n};\n\n/**\n * Run tests and invoke `fn()` when complete.\n *\n * @api public\n * @param {Function} fn\n * @return {Runner}\n */\nMocha.prototype.run = function(fn) {\n  if (this.files.length) {\n    this.loadFiles();\n  }\n  var suite = this.suite;\n  var options = this.options;\n  options.files = this.files;\n  var runner = new exports.Runner(suite, options.delay);\n  var reporter = new this._reporter(runner, options);\n  runner.ignoreLeaks = options.ignoreLeaks !== false;\n  runner.fullStackTrace = options.fullStackTrace;\n  runner.asyncOnly = options.asyncOnly;\n  runner.allowUncaught = options.allowUncaught;\n  if (options.grep) {\n    runner.grep(options.grep, options.invert);\n  }\n  if (options.globals) {\n    runner.globals(options.globals);\n  }\n  if (options.growl) {\n    this._growl(runner, reporter);\n  }\n  if (options.useColors !== undefined) {\n    exports.reporters.Base.useColors = options.useColors;\n  }\n  exports.reporters.Base.inlineDiffs = options.useInlineDiffs;\n\n  function done(failures) {\n    if (reporter.done) {\n      reporter.done(failures, fn);\n    } else {\n      fn && fn(failures);\n    }\n  }\n\n  return runner.run(done);\n};\n\n}).call(this,require('_process'),typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {},\"/lib\")\n},{\"./context\":6,\"./hook\":7,\"./interfaces\":11,\"./reporters\":22,\"./runnable\":35,\"./runner\":36,\"./suite\":37,\"./test\":38,\"./utils\":39,\"_process\":51,\"escape-string-regexp\":68,\"growl\":69,\"path\":41}],15:[function(require,module,exports){\n/**\n * Helpers.\n */\n\nvar s = 1000;\nvar m = s * 60;\nvar h = m * 60;\nvar d = h * 24;\nvar y = d * 365.25;\n\n/**\n * Parse or format the given `val`.\n *\n * Options:\n *\n *  - `long` verbose formatting [false]\n *\n * @api public\n * @param {string|number} val\n * @param {Object} options\n * @return {string|number}\n */\nmodule.exports = function(val, options) {\n  options = options || {};\n  if (typeof val === 'string') {\n    return parse(val);\n  }\n  // https://github.com/mochajs/mocha/pull/1035\n  return options['long'] ? longFormat(val) : shortFormat(val);\n};\n\n/**\n * Parse the given `str` and return milliseconds.\n *\n * @api private\n * @param {string} str\n * @return {number}\n */\nfunction parse(str) {\n  var match = (/^((?:\\d+)?\\.?\\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i).exec(str);\n  if (!match) {\n    return;\n  }\n  var n = parseFloat(match[1]);\n  var type = (match[2] || 'ms').toLowerCase();\n  switch (type) {\n    case 'years':\n    case 'year':\n    case 'y':\n      return n * y;\n    case 'days':\n    case 'day':\n    case 'd':\n      return n * d;\n    case 'hours':\n    case 'hour':\n    case 'h':\n      return n * h;\n    case 'minutes':\n    case 'minute':\n    case 'm':\n      return n * m;\n    case 'seconds':\n    case 'second':\n    case 's':\n      return n * s;\n    case 'ms':\n      return n;\n    default:\n      // No default case\n  }\n}\n\n/**\n * Short format for `ms`.\n *\n * @api private\n * @param {number} ms\n * @return {string}\n */\nfunction shortFormat(ms) {\n  if (ms >= d) {\n    return Math.round(ms / d) + 'd';\n  }\n  if (ms >= h) {\n    return Math.round(ms / h) + 'h';\n  }\n  if (ms >= m) {\n    return Math.round(ms / m) + 'm';\n  }\n  if (ms >= s) {\n    return Math.round(ms / s) + 's';\n  }\n  return ms + 'ms';\n}\n\n/**\n * Long format for `ms`.\n *\n * @api private\n * @param {number} ms\n * @return {string}\n */\nfunction longFormat(ms) {\n  return plural(ms, d, 'day')\n    || plural(ms, h, 'hour')\n    || plural(ms, m, 'minute')\n    || plural(ms, s, 'second')\n    || ms + ' ms';\n}\n\n/**\n * Pluralization helper.\n *\n * @api private\n * @param {number} ms\n * @param {number} n\n * @param {string} name\n */\nfunction plural(ms, n, name) {\n  if (ms < n) {\n    return;\n  }\n  if (ms < n * 1.5) {\n    return Math.floor(ms / n) + ' ' + name;\n  }\n  return Math.ceil(ms / n) + ' ' + name + 's';\n}\n\n},{}],16:[function(require,module,exports){\n\n/**\n * Expose `Pending`.\n */\n\nmodule.exports = Pending;\n\n/**\n * Initialize a new `Pending` error with the given message.\n *\n * @param {string} message\n */\nfunction Pending(message) {\n  this.message = message;\n}\n\n},{}],17:[function(require,module,exports){\n(function (process,global){\n/**\n * Module dependencies.\n */\n\nvar tty = require('tty');\nvar diff = require('diff');\nvar ms = require('../ms');\nvar utils = require('../utils');\nvar supportsColor = process.browser ? null : require('supports-color');\n\n/**\n * Expose `Base`.\n */\n\nexports = module.exports = Base;\n\n/**\n * Save timer references to avoid Sinon interfering.\n * See: https://github.com/mochajs/mocha/issues/237\n */\n\n/* eslint-disable no-unused-vars, no-native-reassign */\nvar Date = global.Date;\nvar setTimeout = global.setTimeout;\nvar setInterval = global.setInterval;\nvar clearTimeout = global.clearTimeout;\nvar clearInterval = global.clearInterval;\n/* eslint-enable no-unused-vars, no-native-reassign */\n\n/**\n * Check if both stdio streams are associated with a tty.\n */\n\nvar isatty = tty.isatty(1) && tty.isatty(2);\n\n/**\n * Enable coloring by default, except in the browser interface.\n */\n\nexports.useColors = !process.browser && (supportsColor || (process.env.MOCHA_COLORS !== undefined));\n\n/**\n * Inline diffs instead of +/-\n */\n\nexports.inlineDiffs = false;\n\n/**\n * Default color map.\n */\n\nexports.colors = {\n  pass: 90,\n  fail: 31,\n  'bright pass': 92,\n  'bright fail': 91,\n  'bright yellow': 93,\n  pending: 36,\n  suite: 0,\n  'error title': 0,\n  'error message': 31,\n  'error stack': 90,\n  checkmark: 32,\n  fast: 90,\n  medium: 33,\n  slow: 31,\n  green: 32,\n  light: 90,\n  'diff gutter': 90,\n  'diff added': 32,\n  'diff removed': 31\n};\n\n/**\n * Default symbol map.\n */\n\nexports.symbols = {\n  ok: '✓',\n  err: '✖',\n  dot: '․'\n};\n\n// With node.js on Windows: use symbols available in terminal default fonts\nif (process.platform === 'win32') {\n  exports.symbols.ok = '\\u221A';\n  exports.symbols.err = '\\u00D7';\n  exports.symbols.dot = '.';\n}\n\n/**\n * Color `str` with the given `type`,\n * allowing colors to be disabled,\n * as well as user-defined color\n * schemes.\n *\n * @param {string} type\n * @param {string} str\n * @return {string}\n * @api private\n */\nvar color = exports.color = function(type, str) {\n  if (!exports.useColors) {\n    return String(str);\n  }\n  return '\\u001b[' + exports.colors[type] + 'm' + str + '\\u001b[0m';\n};\n\n/**\n * Expose term window size, with some defaults for when stderr is not a tty.\n */\n\nexports.window = {\n  width: 75\n};\n\nif (isatty) {\n  exports.window.width = process.stdout.getWindowSize\n      ? process.stdout.getWindowSize(1)[0]\n      : tty.getWindowSize()[1];\n}\n\n/**\n * Expose some basic cursor interactions that are common among reporters.\n */\n\nexports.cursor = {\n  hide: function() {\n    isatty && process.stdout.write('\\u001b[?25l');\n  },\n\n  show: function() {\n    isatty && process.stdout.write('\\u001b[?25h');\n  },\n\n  deleteLine: function() {\n    isatty && process.stdout.write('\\u001b[2K');\n  },\n\n  beginningOfLine: function() {\n    isatty && process.stdout.write('\\u001b[0G');\n  },\n\n  CR: function() {\n    if (isatty) {\n      exports.cursor.deleteLine();\n      exports.cursor.beginningOfLine();\n    } else {\n      process.stdout.write('\\r');\n    }\n  }\n};\n\n/**\n * Outut the given `failures` as a list.\n *\n * @param {Array} failures\n * @api public\n */\n\nexports.list = function(failures) {\n  console.log();\n  failures.forEach(function(test, i) {\n    // format\n    var fmt = color('error title', '  %s) %s:\\n')\n      + color('error message', '     %s')\n      + color('error stack', '\\n%s\\n');\n\n    // msg\n    var msg;\n    var err = test.err;\n    var message;\n    if (err.message) {\n      message = err.message;\n    } else if (typeof err.inspect === 'function') {\n      message = err.inspect() + '';\n    } else {\n      message = '';\n    }\n    var stack = err.stack || message;\n    var index = stack.indexOf(message);\n    var actual = err.actual;\n    var expected = err.expected;\n    var escape = true;\n\n    if (index === -1) {\n      msg = message;\n    } else {\n      index += message.length;\n      msg = stack.slice(0, index);\n      // remove msg from stack\n      stack = stack.slice(index + 1);\n    }\n\n    // uncaught\n    if (err.uncaught) {\n      msg = 'Uncaught ' + msg;\n    }\n    // explicitly show diff\n    if (err.showDiff !== false && sameType(actual, expected) && expected !== undefined) {\n      escape = false;\n      if (!(utils.isString(actual) && utils.isString(expected))) {\n        err.actual = actual = utils.stringify(actual);\n        err.expected = expected = utils.stringify(expected);\n      }\n\n      fmt = color('error title', '  %s) %s:\\n%s') + color('error stack', '\\n%s\\n');\n      var match = message.match(/^([^:]+): expected/);\n      msg = '\\n      ' + color('error message', match ? match[1] : msg);\n\n      if (exports.inlineDiffs) {\n        msg += inlineDiff(err, escape);\n      } else {\n        msg += unifiedDiff(err, escape);\n      }\n    }\n\n    // indent stack trace\n    stack = stack.replace(/^/gm, '  ');\n\n    console.log(fmt, (i + 1), test.fullTitle(), msg, stack);\n  });\n};\n\n/**\n * Initialize a new `Base` reporter.\n *\n * All other reporters generally\n * inherit from this reporter, providing\n * stats such as test duration, number\n * of tests passed / failed etc.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction Base(runner) {\n  var stats = this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 };\n  var failures = this.failures = [];\n\n  if (!runner) {\n    return;\n  }\n  this.runner = runner;\n\n  runner.stats = stats;\n\n  runner.on('start', function() {\n    stats.start = new Date();\n  });\n\n  runner.on('suite', function(suite) {\n    stats.suites = stats.suites || 0;\n    suite.root || stats.suites++;\n  });\n\n  runner.on('test end', function() {\n    stats.tests = stats.tests || 0;\n    stats.tests++;\n  });\n\n  runner.on('pass', function(test) {\n    stats.passes = stats.passes || 0;\n\n    if (test.duration > test.slow()) {\n      test.speed = 'slow';\n    } else if (test.duration > test.slow() / 2) {\n      test.speed = 'medium';\n    } else {\n      test.speed = 'fast';\n    }\n\n    stats.passes++;\n  });\n\n  runner.on('fail', function(test, err) {\n    stats.failures = stats.failures || 0;\n    stats.failures++;\n    test.err = err;\n    failures.push(test);\n  });\n\n  runner.on('end', function() {\n    stats.end = new Date();\n    stats.duration = new Date() - stats.start;\n  });\n\n  runner.on('pending', function() {\n    stats.pending++;\n  });\n}\n\n/**\n * Output common epilogue used by many of\n * the bundled reporters.\n *\n * @api public\n */\nBase.prototype.epilogue = function() {\n  var stats = this.stats;\n  var fmt;\n\n  console.log();\n\n  // passes\n  fmt = color('bright pass', ' ')\n    + color('green', ' %d passing')\n    + color('light', ' (%s)');\n\n  console.log(fmt,\n    stats.passes || 0,\n    ms(stats.duration));\n\n  // pending\n  if (stats.pending) {\n    fmt = color('pending', ' ')\n      + color('pending', ' %d pending');\n\n    console.log(fmt, stats.pending);\n  }\n\n  // failures\n  if (stats.failures) {\n    fmt = color('fail', '  %d failing');\n\n    console.log(fmt, stats.failures);\n\n    Base.list(this.failures);\n    console.log();\n  }\n\n  console.log();\n};\n\n/**\n * Pad the given `str` to `len`.\n *\n * @api private\n * @param {string} str\n * @param {string} len\n * @return {string}\n */\nfunction pad(str, len) {\n  str = String(str);\n  return Array(len - str.length + 1).join(' ') + str;\n}\n\n/**\n * Returns an inline diff between 2 strings with coloured ANSI output\n *\n * @api private\n * @param {Error} err with actual/expected\n * @param {boolean} escape\n * @return {string} Diff\n */\nfunction inlineDiff(err, escape) {\n  var msg = errorDiff(err, 'WordsWithSpace', escape);\n\n  // linenos\n  var lines = msg.split('\\n');\n  if (lines.length > 4) {\n    var width = String(lines.length).length;\n    msg = lines.map(function(str, i) {\n      return pad(++i, width) + ' |' + ' ' + str;\n    }).join('\\n');\n  }\n\n  // legend\n  msg = '\\n'\n    + color('diff removed', 'actual')\n    + ' '\n    + color('diff added', 'expected')\n    + '\\n\\n'\n    + msg\n    + '\\n';\n\n  // indent\n  msg = msg.replace(/^/gm, '      ');\n  return msg;\n}\n\n/**\n * Returns a unified diff between two strings.\n *\n * @api private\n * @param {Error} err with actual/expected\n * @param {boolean} escape\n * @return {string} The diff.\n */\nfunction unifiedDiff(err, escape) {\n  var indent = '      ';\n  function cleanUp(line) {\n    if (escape) {\n      line = escapeInvisibles(line);\n    }\n    if (line[0] === '+') {\n      return indent + colorLines('diff added', line);\n    }\n    if (line[0] === '-') {\n      return indent + colorLines('diff removed', line);\n    }\n    if (line.match(/\\@\\@/)) {\n      return null;\n    }\n    if (line.match(/\\\\ No newline/)) {\n      return null;\n    }\n    return indent + line;\n  }\n  function notBlank(line) {\n    return typeof line !== 'undefined' && line !== null;\n  }\n  var msg = diff.createPatch('string', err.actual, err.expected);\n  var lines = msg.split('\\n').splice(4);\n  return '\\n      '\n    + colorLines('diff added', '+ expected') + ' '\n    + colorLines('diff removed', '- actual')\n    + '\\n\\n'\n    + lines.map(cleanUp).filter(notBlank).join('\\n');\n}\n\n/**\n * Return a character diff for `err`.\n *\n * @api private\n * @param {Error} err\n * @param {string} type\n * @param {boolean} escape\n * @return {string}\n */\nfunction errorDiff(err, type, escape) {\n  var actual = escape ? escapeInvisibles(err.actual) : err.actual;\n  var expected = escape ? escapeInvisibles(err.expected) : err.expected;\n  return diff['diff' + type](actual, expected).map(function(str) {\n    if (str.added) {\n      return colorLines('diff added', str.value);\n    }\n    if (str.removed) {\n      return colorLines('diff removed', str.value);\n    }\n    return str.value;\n  }).join('');\n}\n\n/**\n * Returns a string with all invisible characters in plain text\n *\n * @api private\n * @param {string} line\n * @return {string}\n */\nfunction escapeInvisibles(line) {\n  return line.replace(/\\t/g, '<tab>')\n    .replace(/\\r/g, '<CR>')\n    .replace(/\\n/g, '<LF>\\n');\n}\n\n/**\n * Color lines for `str`, using the color `name`.\n *\n * @api private\n * @param {string} name\n * @param {string} str\n * @return {string}\n */\nfunction colorLines(name, str) {\n  return str.split('\\n').map(function(str) {\n    return color(name, str);\n  }).join('\\n');\n}\n\n/**\n * Object#toString reference.\n */\nvar objToString = Object.prototype.toString;\n\n/**\n * Check that a / b have the same type.\n *\n * @api private\n * @param {Object} a\n * @param {Object} b\n * @return {boolean}\n */\nfunction sameType(a, b) {\n  return objToString.call(a) === objToString.call(b);\n}\n\n}).call(this,require('_process'),typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{\"../ms\":15,\"../utils\":39,\"_process\":51,\"diff\":67,\"supports-color\":41,\"tty\":5}],18:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar utils = require('../utils');\n\n/**\n * Expose `Doc`.\n */\n\nexports = module.exports = Doc;\n\n/**\n * Initialize a new `Doc` reporter.\n *\n * @param {Runner} runner\n * @api public\n */\nfunction Doc(runner) {\n  Base.call(this, runner);\n\n  var indents = 2;\n\n  function indent() {\n    return Array(indents).join('  ');\n  }\n\n  runner.on('suite', function(suite) {\n    if (suite.root) {\n      return;\n    }\n    ++indents;\n    console.log('%s<section class=\"suite\">', indent());\n    ++indents;\n    console.log('%s<h1>%s</h1>', indent(), utils.escape(suite.title));\n    console.log('%s<dl>', indent());\n  });\n\n  runner.on('suite end', function(suite) {\n    if (suite.root) {\n      return;\n    }\n    console.log('%s</dl>', indent());\n    --indents;\n    console.log('%s</section>', indent());\n    --indents;\n  });\n\n  runner.on('pass', function(test) {\n    console.log('%s  <dt>%s</dt>', indent(), utils.escape(test.title));\n    var code = utils.escape(utils.clean(test.fn.toString()));\n    console.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);\n  });\n\n  runner.on('fail', function(test, err) {\n    console.log('%s  <dt class=\"error\">%s</dt>', indent(), utils.escape(test.title));\n    var code = utils.escape(utils.clean(test.fn.toString()));\n    console.log('%s  <dd class=\"error\"><pre><code>%s</code></pre></dd>', indent(), code);\n    console.log('%s  <dd class=\"error\">%s</dd>', indent(), utils.escape(err));\n  });\n}\n\n},{\"../utils\":39,\"./base\":17}],19:[function(require,module,exports){\n(function (process){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar inherits = require('../utils').inherits;\nvar color = Base.color;\n\n/**\n * Expose `Dot`.\n */\n\nexports = module.exports = Dot;\n\n/**\n * Initialize a new `Dot` matrix test reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction Dot(runner) {\n  Base.call(this, runner);\n\n  var self = this;\n  var width = Base.window.width * .75 | 0;\n  var n = -1;\n\n  runner.on('start', function() {\n    process.stdout.write('\\n');\n  });\n\n  runner.on('pending', function() {\n    if (++n % width === 0) {\n      process.stdout.write('\\n  ');\n    }\n    process.stdout.write(color('pending', Base.symbols.dot));\n  });\n\n  runner.on('pass', function(test) {\n    if (++n % width === 0) {\n      process.stdout.write('\\n  ');\n    }\n    if (test.speed === 'slow') {\n      process.stdout.write(color('bright yellow', Base.symbols.dot));\n    } else {\n      process.stdout.write(color(test.speed, Base.symbols.dot));\n    }\n  });\n\n  runner.on('fail', function() {\n    if (++n % width === 0) {\n      process.stdout.write('\\n  ');\n    }\n    process.stdout.write(color('fail', Base.symbols.dot));\n  });\n\n  runner.on('end', function() {\n    console.log();\n    self.epilogue();\n  });\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\ninherits(Dot, Base);\n\n}).call(this,require('_process'))\n},{\"../utils\":39,\"./base\":17,\"_process\":51}],20:[function(require,module,exports){\n(function (process,__dirname){\n/**\n * Module dependencies.\n */\n\nvar JSONCov = require('./json-cov');\nvar readFileSync = require('fs').readFileSync;\nvar join = require('path').join;\n\n/**\n * Expose `HTMLCov`.\n */\n\nexports = module.exports = HTMLCov;\n\n/**\n * Initialize a new `JsCoverage` reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction HTMLCov(runner) {\n  var jade = require('jade');\n  var file = join(__dirname, '/templates/coverage.jade');\n  var str = readFileSync(file, 'utf8');\n  var fn = jade.compile(str, { filename: file });\n  var self = this;\n\n  JSONCov.call(this, runner, false);\n\n  runner.on('end', function() {\n    process.stdout.write(fn({\n      cov: self.cov,\n      coverageClass: coverageClass\n    }));\n  });\n}\n\n/**\n * Return coverage class for a given coverage percentage.\n *\n * @api private\n * @param {number} coveragePctg\n * @return {string}\n */\nfunction coverageClass(coveragePctg) {\n  if (coveragePctg >= 75) {\n    return 'high';\n  }\n  if (coveragePctg >= 50) {\n    return 'medium';\n  }\n  if (coveragePctg >= 25) {\n    return 'low';\n  }\n  return 'terrible';\n}\n\n}).call(this,require('_process'),\"/lib/reporters\")\n},{\"./json-cov\":23,\"_process\":51,\"fs\":41,\"jade\":41,\"path\":41}],21:[function(require,module,exports){\n(function (global){\n/* eslint-env browser */\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar utils = require('../utils');\nvar Progress = require('../browser/progress');\nvar escapeRe = require('escape-string-regexp');\nvar escape = utils.escape;\n\n/**\n * Save timer references to avoid Sinon interfering (see GH-237).\n */\n\n/* eslint-disable no-unused-vars, no-native-reassign */\nvar Date = global.Date;\nvar setTimeout = global.setTimeout;\nvar setInterval = global.setInterval;\nvar clearTimeout = global.clearTimeout;\nvar clearInterval = global.clearInterval;\n/* eslint-enable no-unused-vars, no-native-reassign */\n\n/**\n * Expose `HTML`.\n */\n\nexports = module.exports = HTML;\n\n/**\n * Stats template.\n */\n\nvar statsTemplate = '<ul id=\"mocha-stats\">'\n  + '<li class=\"progress\"><canvas width=\"40\" height=\"40\"></canvas></li>'\n  + '<li class=\"passes\"><a href=\"javascript:void(0);\">passes:</a> <em>0</em></li>'\n  + '<li class=\"failures\"><a href=\"javascript:void(0);\">failures:</a> <em>0</em></li>'\n  + '<li class=\"duration\">duration: <em>0</em>s</li>'\n  + '</ul>';\n\n/**\n * Initialize a new `HTML` reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction HTML(runner) {\n  Base.call(this, runner);\n\n  var self = this;\n  var stats = this.stats;\n  var stat = fragment(statsTemplate);\n  var items = stat.getElementsByTagName('li');\n  var passes = items[1].getElementsByTagName('em')[0];\n  var passesLink = items[1].getElementsByTagName('a')[0];\n  var failures = items[2].getElementsByTagName('em')[0];\n  var failuresLink = items[2].getElementsByTagName('a')[0];\n  var duration = items[3].getElementsByTagName('em')[0];\n  var canvas = stat.getElementsByTagName('canvas')[0];\n  var report = fragment('<ul id=\"mocha-report\"></ul>');\n  var stack = [report];\n  var progress;\n  var ctx;\n  var root = document.getElementById('mocha');\n\n  if (canvas.getContext) {\n    var ratio = window.devicePixelRatio || 1;\n    canvas.style.width = canvas.width;\n    canvas.style.height = canvas.height;\n    canvas.width *= ratio;\n    canvas.height *= ratio;\n    ctx = canvas.getContext('2d');\n    ctx.scale(ratio, ratio);\n    progress = new Progress();\n  }\n\n  if (!root) {\n    return error('#mocha div missing, add it to your document');\n  }\n\n  // pass toggle\n  on(passesLink, 'click', function() {\n    unhide();\n    var name = (/pass/).test(report.className) ? '' : ' pass';\n    report.className = report.className.replace(/fail|pass/g, '') + name;\n    if (report.className.trim()) {\n      hideSuitesWithout('test pass');\n    }\n  });\n\n  // failure toggle\n  on(failuresLink, 'click', function() {\n    unhide();\n    var name = (/fail/).test(report.className) ? '' : ' fail';\n    report.className = report.className.replace(/fail|pass/g, '') + name;\n    if (report.className.trim()) {\n      hideSuitesWithout('test fail');\n    }\n  });\n\n  root.appendChild(stat);\n  root.appendChild(report);\n\n  if (progress) {\n    progress.size(40);\n  }\n\n  runner.on('suite', function(suite) {\n    if (suite.root) {\n      return;\n    }\n\n    // suite\n    var url = self.suiteURL(suite);\n    var el = fragment('<li class=\"suite\"><h1><a href=\"%s\">%s</a></h1></li>', url, escape(suite.title));\n\n    // container\n    stack[0].appendChild(el);\n    stack.unshift(document.createElement('ul'));\n    el.appendChild(stack[0]);\n  });\n\n  runner.on('suite end', function(suite) {\n    if (suite.root) {\n      return;\n    }\n    stack.shift();\n  });\n\n  runner.on('fail', function(test) {\n    if (test.type === 'hook') {\n      runner.emit('test end', test);\n    }\n  });\n\n  runner.on('test end', function(test) {\n    // TODO: add to stats\n    var percent = stats.tests / this.total * 100 | 0;\n    if (progress) {\n      progress.update(percent).draw(ctx);\n    }\n\n    // update stats\n    var ms = new Date() - stats.start;\n    text(passes, stats.passes);\n    text(failures, stats.failures);\n    text(duration, (ms / 1000).toFixed(2));\n\n    // test\n    var el;\n    if (test.state === 'passed') {\n      var url = self.testURL(test);\n      el = fragment('<li class=\"test pass %e\"><h2>%e<span class=\"duration\">%ems</span> <a href=\"%s\" class=\"replay\">‣</a></h2></li>', test.speed, test.title, test.duration, url);\n    } else if (test.pending) {\n      el = fragment('<li class=\"test pass pending\"><h2>%e</h2></li>', test.title);\n    } else {\n      el = fragment('<li class=\"test fail\"><h2>%e <a href=\"%e\" class=\"replay\">‣</a></h2></li>', test.title, self.testURL(test));\n      var stackString; // Note: Includes leading newline\n      var message = test.err.toString();\n\n      // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we\n      // check for the result of the stringifying.\n      if (message === '[object Error]') {\n        message = test.err.message;\n      }\n\n      if (test.err.stack) {\n        var indexOfMessage = test.err.stack.indexOf(test.err.message);\n        if (indexOfMessage === -1) {\n          stackString = test.err.stack;\n        } else {\n          stackString = test.err.stack.substr(test.err.message.length + indexOfMessage);\n        }\n      } else if (test.err.sourceURL && test.err.line !== undefined) {\n        // Safari doesn't give you a stack. Let's at least provide a source line.\n        stackString = '\\n(' + test.err.sourceURL + ':' + test.err.line + ')';\n      }\n\n      stackString = stackString || '';\n\n      if (test.err.htmlMessage && stackString) {\n        el.appendChild(fragment('<div class=\"html-error\">%s\\n<pre class=\"error\">%e</pre></div>', test.err.htmlMessage, stackString));\n      } else if (test.err.htmlMessage) {\n        el.appendChild(fragment('<div class=\"html-error\">%s</div>', test.err.htmlMessage));\n      } else {\n        el.appendChild(fragment('<pre class=\"error\">%e%e</pre>', message, stackString));\n      }\n    }\n\n    // toggle code\n    // TODO: defer\n    if (!test.pending) {\n      var h2 = el.getElementsByTagName('h2')[0];\n\n      on(h2, 'click', function() {\n        pre.style.display = pre.style.display === 'none' ? 'block' : 'none';\n      });\n\n      var pre = fragment('<pre><code>%e</code></pre>', utils.clean(test.fn.toString()));\n      el.appendChild(pre);\n      pre.style.display = 'none';\n    }\n\n    // Don't call .appendChild if #mocha-report was already .shift()'ed off the stack.\n    if (stack[0]) {\n      stack[0].appendChild(el);\n    }\n  });\n}\n\n/**\n * Makes a URL, preserving querystring (\"search\") parameters.\n *\n * @param {string} s\n * @return {string} A new URL.\n */\nfunction makeUrl(s) {\n  var search = window.location.search;\n\n  // Remove previous grep query parameter if present\n  if (search) {\n    search = search.replace(/[?&]grep=[^&\\s]*/g, '').replace(/^&/, '?');\n  }\n\n  return window.location.pathname + (search ? search + '&' : '?') + 'grep=' + encodeURIComponent(escapeRe(s));\n}\n\n/**\n * Provide suite URL.\n *\n * @param {Object} [suite]\n */\nHTML.prototype.suiteURL = function(suite) {\n  return makeUrl(suite.fullTitle());\n};\n\n/**\n * Provide test URL.\n *\n * @param {Object} [test]\n */\nHTML.prototype.testURL = function(test) {\n  return makeUrl(test.fullTitle());\n};\n\n/**\n * Display error `msg`.\n *\n * @param {string} msg\n */\nfunction error(msg) {\n  document.body.appendChild(fragment('<div id=\"mocha-error\">%s</div>', msg));\n}\n\n/**\n * Return a DOM fragment from `html`.\n *\n * @param {string} html\n */\nfunction fragment(html) {\n  var args = arguments;\n  var div = document.createElement('div');\n  var i = 1;\n\n  div.innerHTML = html.replace(/%([se])/g, function(_, type) {\n    switch (type) {\n      case 's': return String(args[i++]);\n      case 'e': return escape(args[i++]);\n      // no default\n    }\n  });\n\n  return div.firstChild;\n}\n\n/**\n * Check for suites that do not have elements\n * with `classname`, and hide them.\n *\n * @param {text} classname\n */\nfunction hideSuitesWithout(classname) {\n  var suites = document.getElementsByClassName('suite');\n  for (var i = 0; i < suites.length; i++) {\n    var els = suites[i].getElementsByClassName(classname);\n    if (!els.length) {\n      suites[i].className += ' hidden';\n    }\n  }\n}\n\n/**\n * Unhide .hidden suites.\n */\nfunction unhide() {\n  var els = document.getElementsByClassName('suite hidden');\n  for (var i = 0; i < els.length; ++i) {\n    els[i].className = els[i].className.replace('suite hidden', 'suite');\n  }\n}\n\n/**\n * Set an element's text contents.\n *\n * @param {HTMLElement} el\n * @param {string} contents\n */\nfunction text(el, contents) {\n  if (el.textContent) {\n    el.textContent = contents;\n  } else {\n    el.innerText = contents;\n  }\n}\n\n/**\n * Listen on `event` with callback `fn`.\n */\nfunction on(el, event, fn) {\n  if (el.addEventListener) {\n    el.addEventListener(event, fn, false);\n  } else {\n    el.attachEvent('on' + event, fn);\n  }\n}\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{\"../browser/progress\":4,\"../utils\":39,\"./base\":17,\"escape-string-regexp\":68}],22:[function(require,module,exports){\n// Alias exports to a their normalized format Mocha#reporter to prevent a need\n// for dynamic (try/catch) requires, which Browserify doesn't handle.\nexports.Base = exports.base = require('./base');\nexports.Dot = exports.dot = require('./dot');\nexports.Doc = exports.doc = require('./doc');\nexports.TAP = exports.tap = require('./tap');\nexports.JSON = exports.json = require('./json');\nexports.HTML = exports.html = require('./html');\nexports.List = exports.list = require('./list');\nexports.Min = exports.min = require('./min');\nexports.Spec = exports.spec = require('./spec');\nexports.Nyan = exports.nyan = require('./nyan');\nexports.XUnit = exports.xunit = require('./xunit');\nexports.Markdown = exports.markdown = require('./markdown');\nexports.Progress = exports.progress = require('./progress');\nexports.Landing = exports.landing = require('./landing');\nexports.JSONCov = exports['json-cov'] = require('./json-cov');\nexports.HTMLCov = exports['html-cov'] = require('./html-cov');\nexports.JSONStream = exports['json-stream'] = require('./json-stream');\n\n},{\"./base\":17,\"./doc\":18,\"./dot\":19,\"./html\":21,\"./html-cov\":20,\"./json\":25,\"./json-cov\":23,\"./json-stream\":24,\"./landing\":26,\"./list\":27,\"./markdown\":28,\"./min\":29,\"./nyan\":30,\"./progress\":31,\"./spec\":32,\"./tap\":33,\"./xunit\":34}],23:[function(require,module,exports){\n(function (process,global){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\n\n/**\n * Expose `JSONCov`.\n */\n\nexports = module.exports = JSONCov;\n\n/**\n * Initialize a new `JsCoverage` reporter.\n *\n * @api public\n * @param {Runner} runner\n * @param {boolean} output\n */\nfunction JSONCov(runner, output) {\n  Base.call(this, runner);\n\n  output = arguments.length === 1 || output;\n  var self = this;\n  var tests = [];\n  var failures = [];\n  var passes = [];\n\n  runner.on('test end', function(test) {\n    tests.push(test);\n  });\n\n  runner.on('pass', function(test) {\n    passes.push(test);\n  });\n\n  runner.on('fail', function(test) {\n    failures.push(test);\n  });\n\n  runner.on('end', function() {\n    var cov = global._$jscoverage || {};\n    var result = self.cov = map(cov);\n    result.stats = self.stats;\n    result.tests = tests.map(clean);\n    result.failures = failures.map(clean);\n    result.passes = passes.map(clean);\n    if (!output) {\n      return;\n    }\n    process.stdout.write(JSON.stringify(result, null, 2));\n  });\n}\n\n/**\n * Map jscoverage data to a JSON structure\n * suitable for reporting.\n *\n * @api private\n * @param {Object} cov\n * @return {Object}\n */\n\nfunction map(cov) {\n  var ret = {\n    instrumentation: 'node-jscoverage',\n    sloc: 0,\n    hits: 0,\n    misses: 0,\n    coverage: 0,\n    files: []\n  };\n\n  for (var filename in cov) {\n    if (Object.prototype.hasOwnProperty.call(cov, filename)) {\n      var data = coverage(filename, cov[filename]);\n      ret.files.push(data);\n      ret.hits += data.hits;\n      ret.misses += data.misses;\n      ret.sloc += data.sloc;\n    }\n  }\n\n  ret.files.sort(function(a, b) {\n    return a.filename.localeCompare(b.filename);\n  });\n\n  if (ret.sloc > 0) {\n    ret.coverage = (ret.hits / ret.sloc) * 100;\n  }\n\n  return ret;\n}\n\n/**\n * Map jscoverage data for a single source file\n * to a JSON structure suitable for reporting.\n *\n * @api private\n * @param {string} filename name of the source file\n * @param {Object} data jscoverage coverage data\n * @return {Object}\n */\nfunction coverage(filename, data) {\n  var ret = {\n    filename: filename,\n    coverage: 0,\n    hits: 0,\n    misses: 0,\n    sloc: 0,\n    source: {}\n  };\n\n  data.source.forEach(function(line, num) {\n    num++;\n\n    if (data[num] === 0) {\n      ret.misses++;\n      ret.sloc++;\n    } else if (data[num] !== undefined) {\n      ret.hits++;\n      ret.sloc++;\n    }\n\n    ret.source[num] = {\n      source: line,\n      coverage: data[num] === undefined ? '' : data[num]\n    };\n  });\n\n  ret.coverage = ret.hits / ret.sloc * 100;\n\n  return ret;\n}\n\n/**\n * Return a plain-object representation of `test`\n * free of cyclic properties etc.\n *\n * @api private\n * @param {Object} test\n * @return {Object}\n */\nfunction clean(test) {\n  return {\n    duration: test.duration,\n    fullTitle: test.fullTitle(),\n    title: test.title\n  };\n}\n\n}).call(this,require('_process'),typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{\"./base\":17,\"_process\":51}],24:[function(require,module,exports){\n(function (process){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\n\n/**\n * Expose `List`.\n */\n\nexports = module.exports = List;\n\n/**\n * Initialize a new `List` test reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction List(runner) {\n  Base.call(this, runner);\n\n  var self = this;\n  var total = runner.total;\n\n  runner.on('start', function() {\n    console.log(JSON.stringify(['start', { total: total }]));\n  });\n\n  runner.on('pass', function(test) {\n    console.log(JSON.stringify(['pass', clean(test)]));\n  });\n\n  runner.on('fail', function(test, err) {\n    test = clean(test);\n    test.err = err.message;\n    test.stack = err.stack || null;\n    console.log(JSON.stringify(['fail', test]));\n  });\n\n  runner.on('end', function() {\n    process.stdout.write(JSON.stringify(['end', self.stats]));\n  });\n}\n\n/**\n * Return a plain-object representation of `test`\n * free of cyclic properties etc.\n *\n * @api private\n * @param {Object} test\n * @return {Object}\n */\nfunction clean(test) {\n  return {\n    title: test.title,\n    fullTitle: test.fullTitle(),\n    duration: test.duration\n  };\n}\n\n}).call(this,require('_process'))\n},{\"./base\":17,\"_process\":51}],25:[function(require,module,exports){\n(function (process){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\n\n/**\n * Expose `JSON`.\n */\n\nexports = module.exports = JSONReporter;\n\n/**\n * Initialize a new `JSON` reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction JSONReporter(runner) {\n  Base.call(this, runner);\n\n  var self = this;\n  var tests = [];\n  var pending = [];\n  var failures = [];\n  var passes = [];\n\n  runner.on('test end', function(test) {\n    tests.push(test);\n  });\n\n  runner.on('pass', function(test) {\n    passes.push(test);\n  });\n\n  runner.on('fail', function(test) {\n    failures.push(test);\n  });\n\n  runner.on('pending', function(test) {\n    pending.push(test);\n  });\n\n  runner.on('end', function() {\n    var obj = {\n      stats: self.stats,\n      tests: tests.map(clean),\n      pending: pending.map(clean),\n      failures: failures.map(clean),\n      passes: passes.map(clean)\n    };\n\n    runner.testResults = obj;\n\n    process.stdout.write(JSON.stringify(obj, null, 2));\n  });\n}\n\n/**\n * Return a plain-object representation of `test`\n * free of cyclic properties etc.\n *\n * @api private\n * @param {Object} test\n * @return {Object}\n */\nfunction clean(test) {\n  return {\n    title: test.title,\n    fullTitle: test.fullTitle(),\n    duration: test.duration,\n    err: errorJSON(test.err || {})\n  };\n}\n\n/**\n * Transform `error` into a JSON object.\n *\n * @api private\n * @param {Error} err\n * @return {Object}\n */\nfunction errorJSON(err) {\n  var res = {};\n  Object.getOwnPropertyNames(err).forEach(function(key) {\n    res[key] = err[key];\n  }, err);\n  return res;\n}\n\n}).call(this,require('_process'))\n},{\"./base\":17,\"_process\":51}],26:[function(require,module,exports){\n(function (process){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar inherits = require('../utils').inherits;\nvar cursor = Base.cursor;\nvar color = Base.color;\n\n/**\n * Expose `Landing`.\n */\n\nexports = module.exports = Landing;\n\n/**\n * Airplane color.\n */\n\nBase.colors.plane = 0;\n\n/**\n * Airplane crash color.\n */\n\nBase.colors['plane crash'] = 31;\n\n/**\n * Runway color.\n */\n\nBase.colors.runway = 90;\n\n/**\n * Initialize a new `Landing` reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction Landing(runner) {\n  Base.call(this, runner);\n\n  var self = this;\n  var width = Base.window.width * .75 | 0;\n  var total = runner.total;\n  var stream = process.stdout;\n  var plane = color('plane', '✈');\n  var crashed = -1;\n  var n = 0;\n\n  function runway() {\n    var buf = Array(width).join('-');\n    return '  ' + color('runway', buf);\n  }\n\n  runner.on('start', function() {\n    stream.write('\\n\\n\\n  ');\n    cursor.hide();\n  });\n\n  runner.on('test end', function(test) {\n    // check if the plane crashed\n    var col = crashed === -1 ? width * ++n / total | 0 : crashed;\n\n    // show the crash\n    if (test.state === 'failed') {\n      plane = color('plane crash', '✈');\n      crashed = col;\n    }\n\n    // render landing strip\n    stream.write('\\u001b[' + (width + 1) + 'D\\u001b[2A');\n    stream.write(runway());\n    stream.write('\\n  ');\n    stream.write(color('runway', Array(col).join('⋅')));\n    stream.write(plane);\n    stream.write(color('runway', Array(width - col).join('⋅') + '\\n'));\n    stream.write(runway());\n    stream.write('\\u001b[0m');\n  });\n\n  runner.on('end', function() {\n    cursor.show();\n    console.log();\n    self.epilogue();\n  });\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\ninherits(Landing, Base);\n\n}).call(this,require('_process'))\n},{\"../utils\":39,\"./base\":17,\"_process\":51}],27:[function(require,module,exports){\n(function (process){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar inherits = require('../utils').inherits;\nvar color = Base.color;\nvar cursor = Base.cursor;\n\n/**\n * Expose `List`.\n */\n\nexports = module.exports = List;\n\n/**\n * Initialize a new `List` test reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction List(runner) {\n  Base.call(this, runner);\n\n  var self = this;\n  var n = 0;\n\n  runner.on('start', function() {\n    console.log();\n  });\n\n  runner.on('test', function(test) {\n    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));\n  });\n\n  runner.on('pending', function(test) {\n    var fmt = color('checkmark', '  -')\n      + color('pending', ' %s');\n    console.log(fmt, test.fullTitle());\n  });\n\n  runner.on('pass', function(test) {\n    var fmt = color('checkmark', '  ' + Base.symbols.dot)\n      + color('pass', ' %s: ')\n      + color(test.speed, '%dms');\n    cursor.CR();\n    console.log(fmt, test.fullTitle(), test.duration);\n  });\n\n  runner.on('fail', function(test) {\n    cursor.CR();\n    console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());\n  });\n\n  runner.on('end', self.epilogue.bind(self));\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\ninherits(List, Base);\n\n}).call(this,require('_process'))\n},{\"../utils\":39,\"./base\":17,\"_process\":51}],28:[function(require,module,exports){\n(function (process){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar utils = require('../utils');\n\n/**\n * Constants\n */\n\nvar SUITE_PREFIX = '$';\n\n/**\n * Expose `Markdown`.\n */\n\nexports = module.exports = Markdown;\n\n/**\n * Initialize a new `Markdown` reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction Markdown(runner) {\n  Base.call(this, runner);\n\n  var level = 0;\n  var buf = '';\n\n  function title(str) {\n    return Array(level).join('#') + ' ' + str;\n  }\n\n  function mapTOC(suite, obj) {\n    var ret = obj;\n    var key = SUITE_PREFIX + suite.title;\n\n    obj = obj[key] = obj[key] || { suite: suite };\n    suite.suites.forEach(function(suite) {\n      mapTOC(suite, obj);\n    });\n\n    return ret;\n  }\n\n  function stringifyTOC(obj, level) {\n    ++level;\n    var buf = '';\n    var link;\n    for (var key in obj) {\n      if (key === 'suite') {\n        continue;\n      }\n      if (key !== SUITE_PREFIX) {\n        link = ' - [' + key.substring(1) + ']';\n        link += '(#' + utils.slug(obj[key].suite.fullTitle()) + ')\\n';\n        buf += Array(level).join('  ') + link;\n      }\n      buf += stringifyTOC(obj[key], level);\n    }\n    return buf;\n  }\n\n  function generateTOC(suite) {\n    var obj = mapTOC(suite, {});\n    return stringifyTOC(obj, 0);\n  }\n\n  generateTOC(runner.suite);\n\n  runner.on('suite', function(suite) {\n    ++level;\n    var slug = utils.slug(suite.fullTitle());\n    buf += '<a name=\"' + slug + '\"></a>' + '\\n';\n    buf += title(suite.title) + '\\n';\n  });\n\n  runner.on('suite end', function() {\n    --level;\n  });\n\n  runner.on('pass', function(test) {\n    var code = utils.clean(test.fn.toString());\n    buf += test.title + '.\\n';\n    buf += '\\n```js\\n';\n    buf += code + '\\n';\n    buf += '```\\n\\n';\n  });\n\n  runner.on('end', function() {\n    process.stdout.write('# TOC\\n');\n    process.stdout.write(generateTOC(runner.suite));\n    process.stdout.write(buf);\n  });\n}\n\n}).call(this,require('_process'))\n},{\"../utils\":39,\"./base\":17,\"_process\":51}],29:[function(require,module,exports){\n(function (process){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar inherits = require('../utils').inherits;\n\n/**\n * Expose `Min`.\n */\n\nexports = module.exports = Min;\n\n/**\n * Initialize a new `Min` minimal test reporter (best used with --watch).\n *\n * @api public\n * @param {Runner} runner\n */\nfunction Min(runner) {\n  Base.call(this, runner);\n\n  runner.on('start', function() {\n    // clear screen\n    process.stdout.write('\\u001b[2J');\n    // set cursor position\n    process.stdout.write('\\u001b[1;3H');\n  });\n\n  runner.on('end', this.epilogue.bind(this));\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\ninherits(Min, Base);\n\n}).call(this,require('_process'))\n},{\"../utils\":39,\"./base\":17,\"_process\":51}],30:[function(require,module,exports){\n(function (process){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar inherits = require('../utils').inherits;\n\n/**\n * Expose `Dot`.\n */\n\nexports = module.exports = NyanCat;\n\n/**\n * Initialize a new `Dot` matrix test reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction NyanCat(runner) {\n  Base.call(this, runner);\n\n  var self = this;\n  var width = Base.window.width * .75 | 0;\n  var nyanCatWidth = this.nyanCatWidth = 11;\n\n  this.colorIndex = 0;\n  this.numberOfLines = 4;\n  this.rainbowColors = self.generateColors();\n  this.scoreboardWidth = 5;\n  this.tick = 0;\n  this.trajectories = [[], [], [], []];\n  this.trajectoryWidthMax = (width - nyanCatWidth);\n\n  runner.on('start', function() {\n    Base.cursor.hide();\n    self.draw();\n  });\n\n  runner.on('pending', function() {\n    self.draw();\n  });\n\n  runner.on('pass', function() {\n    self.draw();\n  });\n\n  runner.on('fail', function() {\n    self.draw();\n  });\n\n  runner.on('end', function() {\n    Base.cursor.show();\n    for (var i = 0; i < self.numberOfLines; i++) {\n      write('\\n');\n    }\n    self.epilogue();\n  });\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\ninherits(NyanCat, Base);\n\n/**\n * Draw the nyan cat\n *\n * @api private\n */\n\nNyanCat.prototype.draw = function() {\n  this.appendRainbow();\n  this.drawScoreboard();\n  this.drawRainbow();\n  this.drawNyanCat();\n  this.tick = !this.tick;\n};\n\n/**\n * Draw the \"scoreboard\" showing the number\n * of passes, failures and pending tests.\n *\n * @api private\n */\n\nNyanCat.prototype.drawScoreboard = function() {\n  var stats = this.stats;\n\n  function draw(type, n) {\n    write(' ');\n    write(Base.color(type, n));\n    write('\\n');\n  }\n\n  draw('green', stats.passes);\n  draw('fail', stats.failures);\n  draw('pending', stats.pending);\n  write('\\n');\n\n  this.cursorUp(this.numberOfLines);\n};\n\n/**\n * Append the rainbow.\n *\n * @api private\n */\n\nNyanCat.prototype.appendRainbow = function() {\n  var segment = this.tick ? '_' : '-';\n  var rainbowified = this.rainbowify(segment);\n\n  for (var index = 0; index < this.numberOfLines; index++) {\n    var trajectory = this.trajectories[index];\n    if (trajectory.length >= this.trajectoryWidthMax) {\n      trajectory.shift();\n    }\n    trajectory.push(rainbowified);\n  }\n};\n\n/**\n * Draw the rainbow.\n *\n * @api private\n */\n\nNyanCat.prototype.drawRainbow = function() {\n  var self = this;\n\n  this.trajectories.forEach(function(line) {\n    write('\\u001b[' + self.scoreboardWidth + 'C');\n    write(line.join(''));\n    write('\\n');\n  });\n\n  this.cursorUp(this.numberOfLines);\n};\n\n/**\n * Draw the nyan cat\n *\n * @api private\n */\nNyanCat.prototype.drawNyanCat = function() {\n  var self = this;\n  var startWidth = this.scoreboardWidth + this.trajectories[0].length;\n  var dist = '\\u001b[' + startWidth + 'C';\n  var padding = '';\n\n  write(dist);\n  write('_,------,');\n  write('\\n');\n\n  write(dist);\n  padding = self.tick ? '  ' : '   ';\n  write('_|' + padding + '/\\\\_/\\\\ ');\n  write('\\n');\n\n  write(dist);\n  padding = self.tick ? '_' : '__';\n  var tail = self.tick ? '~' : '^';\n  write(tail + '|' + padding + this.face() + ' ');\n  write('\\n');\n\n  write(dist);\n  padding = self.tick ? ' ' : '  ';\n  write(padding + '\"\"  \"\" ');\n  write('\\n');\n\n  this.cursorUp(this.numberOfLines);\n};\n\n/**\n * Draw nyan cat face.\n *\n * @api private\n * @return {string}\n */\n\nNyanCat.prototype.face = function() {\n  var stats = this.stats;\n  if (stats.failures) {\n    return '( x .x)';\n  } else if (stats.pending) {\n    return '( o .o)';\n  } else if (stats.passes) {\n    return '( ^ .^)';\n  }\n  return '( - .-)';\n};\n\n/**\n * Move cursor up `n`.\n *\n * @api private\n * @param {number} n\n */\n\nNyanCat.prototype.cursorUp = function(n) {\n  write('\\u001b[' + n + 'A');\n};\n\n/**\n * Move cursor down `n`.\n *\n * @api private\n * @param {number} n\n */\n\nNyanCat.prototype.cursorDown = function(n) {\n  write('\\u001b[' + n + 'B');\n};\n\n/**\n * Generate rainbow colors.\n *\n * @api private\n * @return {Array}\n */\nNyanCat.prototype.generateColors = function() {\n  var colors = [];\n\n  for (var i = 0; i < (6 * 7); i++) {\n    var pi3 = Math.floor(Math.PI / 3);\n    var n = (i * (1.0 / 6));\n    var r = Math.floor(3 * Math.sin(n) + 3);\n    var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);\n    var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);\n    colors.push(36 * r + 6 * g + b + 16);\n  }\n\n  return colors;\n};\n\n/**\n * Apply rainbow to the given `str`.\n *\n * @api private\n * @param {string} str\n * @return {string}\n */\nNyanCat.prototype.rainbowify = function(str) {\n  if (!Base.useColors) {\n    return str;\n  }\n  var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];\n  this.colorIndex += 1;\n  return '\\u001b[38;5;' + color + 'm' + str + '\\u001b[0m';\n};\n\n/**\n * Stdout helper.\n *\n * @param {string} string A message to write to stdout.\n */\nfunction write(string) {\n  process.stdout.write(string);\n}\n\n}).call(this,require('_process'))\n},{\"../utils\":39,\"./base\":17,\"_process\":51}],31:[function(require,module,exports){\n(function (process){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar inherits = require('../utils').inherits;\nvar color = Base.color;\nvar cursor = Base.cursor;\n\n/**\n * Expose `Progress`.\n */\n\nexports = module.exports = Progress;\n\n/**\n * General progress bar color.\n */\n\nBase.colors.progress = 90;\n\n/**\n * Initialize a new `Progress` bar test reporter.\n *\n * @api public\n * @param {Runner} runner\n * @param {Object} options\n */\nfunction Progress(runner, options) {\n  Base.call(this, runner);\n\n  var self = this;\n  var width = Base.window.width * .50 | 0;\n  var total = runner.total;\n  var complete = 0;\n  var lastN = -1;\n\n  // default chars\n  options = options || {};\n  options.open = options.open || '[';\n  options.complete = options.complete || '▬';\n  options.incomplete = options.incomplete || Base.symbols.dot;\n  options.close = options.close || ']';\n  options.verbose = false;\n\n  // tests started\n  runner.on('start', function() {\n    console.log();\n    cursor.hide();\n  });\n\n  // tests complete\n  runner.on('test end', function() {\n    complete++;\n\n    var percent = complete / total;\n    var n = width * percent | 0;\n    var i = width - n;\n\n    if (n === lastN && !options.verbose) {\n      // Don't re-render the line if it hasn't changed\n      return;\n    }\n    lastN = n;\n\n    cursor.CR();\n    process.stdout.write('\\u001b[J');\n    process.stdout.write(color('progress', '  ' + options.open));\n    process.stdout.write(Array(n).join(options.complete));\n    process.stdout.write(Array(i).join(options.incomplete));\n    process.stdout.write(color('progress', options.close));\n    if (options.verbose) {\n      process.stdout.write(color('progress', ' ' + complete + ' of ' + total));\n    }\n  });\n\n  // tests are complete, output some stats\n  // and the failures if any\n  runner.on('end', function() {\n    cursor.show();\n    console.log();\n    self.epilogue();\n  });\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\ninherits(Progress, Base);\n\n}).call(this,require('_process'))\n},{\"../utils\":39,\"./base\":17,\"_process\":51}],32:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar inherits = require('../utils').inherits;\nvar color = Base.color;\nvar cursor = Base.cursor;\n\n/**\n * Expose `Spec`.\n */\n\nexports = module.exports = Spec;\n\n/**\n * Initialize a new `Spec` test reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction Spec(runner) {\n  Base.call(this, runner);\n\n  var self = this;\n  var indents = 0;\n  var n = 0;\n\n  function indent() {\n    return Array(indents).join('  ');\n  }\n\n  runner.on('start', function() {\n    console.log();\n  });\n\n  runner.on('suite', function(suite) {\n    ++indents;\n    console.log(color('suite', '%s%s'), indent(), suite.title);\n  });\n\n  runner.on('suite end', function() {\n    --indents;\n    if (indents === 1) {\n      console.log();\n    }\n  });\n\n  runner.on('pending', function(test) {\n    var fmt = indent() + color('pending', '  - %s');\n    console.log(fmt, test.title);\n  });\n\n  runner.on('pass', function(test) {\n    var fmt;\n    if (test.speed === 'fast') {\n      fmt = indent()\n        + color('checkmark', '  ' + Base.symbols.ok)\n        + color('pass', ' %s');\n      cursor.CR();\n      console.log(fmt, test.title);\n    } else {\n      fmt = indent()\n        + color('checkmark', '  ' + Base.symbols.ok)\n        + color('pass', ' %s')\n        + color(test.speed, ' (%dms)');\n      cursor.CR();\n      console.log(fmt, test.title, test.duration);\n    }\n  });\n\n  runner.on('fail', function(test) {\n    cursor.CR();\n    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);\n  });\n\n  runner.on('end', self.epilogue.bind(self));\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\ninherits(Spec, Base);\n\n},{\"../utils\":39,\"./base\":17}],33:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\n\n/**\n * Expose `TAP`.\n */\n\nexports = module.exports = TAP;\n\n/**\n * Initialize a new `TAP` reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction TAP(runner) {\n  Base.call(this, runner);\n\n  var n = 1;\n  var passes = 0;\n  var failures = 0;\n\n  runner.on('start', function() {\n    var total = runner.grepTotal(runner.suite);\n    console.log('%d..%d', 1, total);\n  });\n\n  runner.on('test end', function() {\n    ++n;\n  });\n\n  runner.on('pending', function(test) {\n    console.log('ok %d %s # SKIP -', n, title(test));\n  });\n\n  runner.on('pass', function(test) {\n    passes++;\n    console.log('ok %d %s', n, title(test));\n  });\n\n  runner.on('fail', function(test, err) {\n    failures++;\n    console.log('not ok %d %s', n, title(test));\n    if (err.stack) {\n      console.log(err.stack.replace(/^/gm, '  '));\n    }\n  });\n\n  runner.on('end', function() {\n    console.log('# tests ' + (passes + failures));\n    console.log('# pass ' + passes);\n    console.log('# fail ' + failures);\n  });\n}\n\n/**\n * Return a TAP-safe title of `test`\n *\n * @api private\n * @param {Object} test\n * @return {String}\n */\nfunction title(test) {\n  return test.fullTitle().replace(/#/g, '');\n}\n\n},{\"./base\":17}],34:[function(require,module,exports){\n(function (global){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\nvar utils = require('../utils');\nvar inherits = utils.inherits;\nvar fs = require('fs');\nvar escape = utils.escape;\n\n/**\n * Save timer references to avoid Sinon interfering (see GH-237).\n */\n\n/* eslint-disable no-unused-vars, no-native-reassign */\nvar Date = global.Date;\nvar setTimeout = global.setTimeout;\nvar setInterval = global.setInterval;\nvar clearTimeout = global.clearTimeout;\nvar clearInterval = global.clearInterval;\n/* eslint-enable no-unused-vars, no-native-reassign */\n\n/**\n * Expose `XUnit`.\n */\n\nexports = module.exports = XUnit;\n\n/**\n * Initialize a new `XUnit` reporter.\n *\n * @api public\n * @param {Runner} runner\n */\nfunction XUnit(runner, options) {\n  Base.call(this, runner);\n\n  var stats = this.stats;\n  var tests = [];\n  var self = this;\n\n  if (options.reporterOptions && options.reporterOptions.output) {\n    if (!fs.createWriteStream) {\n      throw new Error('file output not supported in browser');\n    }\n    self.fileStream = fs.createWriteStream(options.reporterOptions.output);\n  }\n\n  runner.on('pending', function(test) {\n    tests.push(test);\n  });\n\n  runner.on('pass', function(test) {\n    tests.push(test);\n  });\n\n  runner.on('fail', function(test) {\n    tests.push(test);\n  });\n\n  runner.on('end', function() {\n    self.write(tag('testsuite', {\n      name: 'Mocha Tests',\n      tests: stats.tests,\n      failures: stats.failures,\n      errors: stats.failures,\n      skipped: stats.tests - stats.failures - stats.passes,\n      timestamp: (new Date()).toUTCString(),\n      time: (stats.duration / 1000) || 0\n    }, false));\n\n    tests.forEach(function(t) {\n      self.test(t);\n    });\n\n    self.write('</testsuite>');\n  });\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\ninherits(XUnit, Base);\n\n/**\n * Override done to close the stream (if it's a file).\n *\n * @param failures\n * @param {Function} fn\n */\nXUnit.prototype.done = function(failures, fn) {\n  if (this.fileStream) {\n    this.fileStream.end(function() {\n      fn(failures);\n    });\n  } else {\n    fn(failures);\n  }\n};\n\n/**\n * Write out the given line.\n *\n * @param {string} line\n */\nXUnit.prototype.write = function(line) {\n  if (this.fileStream) {\n    this.fileStream.write(line + '\\n');\n  } else {\n    console.log(line);\n  }\n};\n\n/**\n * Output tag for the given `test.`\n *\n * @param {Test} test\n */\nXUnit.prototype.test = function(test) {\n  var attrs = {\n    classname: test.parent.fullTitle(),\n    name: test.title,\n    time: (test.duration / 1000) || 0\n  };\n\n  if (test.state === 'failed') {\n    var err = test.err;\n    this.write(tag('testcase', attrs, false, tag('failure', {}, false, cdata(escape(err.message) + '\\n' + err.stack))));\n  } else if (test.pending) {\n    this.write(tag('testcase', attrs, false, tag('skipped', {}, true)));\n  } else {\n    this.write(tag('testcase', attrs, true));\n  }\n};\n\n/**\n * HTML tag helper.\n *\n * @param name\n * @param attrs\n * @param close\n * @param content\n * @return {string}\n */\nfunction tag(name, attrs, close, content) {\n  var end = close ? '/>' : '>';\n  var pairs = [];\n  var tag;\n\n  for (var key in attrs) {\n    if (Object.prototype.hasOwnProperty.call(attrs, key)) {\n      pairs.push(key + '=\"' + escape(attrs[key]) + '\"');\n    }\n  }\n\n  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;\n  if (content) {\n    tag += content + '</' + name + end;\n  }\n  return tag;\n}\n\n/**\n * Return cdata escaped CDATA `str`.\n */\n\nfunction cdata(str) {\n  return '<![CDATA[' + escape(str) + ']]>';\n}\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{\"../utils\":39,\"./base\":17,\"fs\":41}],35:[function(require,module,exports){\n(function (global){\n/**\n * Module dependencies.\n */\n\nvar EventEmitter = require('events').EventEmitter;\nvar Pending = require('./pending');\nvar debug = require('debug')('mocha:runnable');\nvar milliseconds = require('./ms');\nvar utils = require('./utils');\nvar inherits = utils.inherits;\n\n/**\n * Save timer references to avoid Sinon interfering (see GH-237).\n */\n\n/* eslint-disable no-unused-vars, no-native-reassign */\nvar Date = global.Date;\nvar setTimeout = global.setTimeout;\nvar setInterval = global.setInterval;\nvar clearTimeout = global.clearTimeout;\nvar clearInterval = global.clearInterval;\n/* eslint-enable no-unused-vars, no-native-reassign */\n\n/**\n * Object#toString().\n */\n\nvar toString = Object.prototype.toString;\n\n/**\n * Expose `Runnable`.\n */\n\nmodule.exports = Runnable;\n\n/**\n * Initialize a new `Runnable` with the given `title` and callback `fn`.\n *\n * @param {String} title\n * @param {Function} fn\n * @api private\n * @param {string} title\n * @param {Function} fn\n */\nfunction Runnable(title, fn) {\n  this.title = title;\n  this.fn = fn;\n  this.async = fn && fn.length;\n  this.sync = !this.async;\n  this._timeout = 2000;\n  this._slow = 75;\n  this._enableTimeouts = true;\n  this.timedOut = false;\n  this._trace = new Error('done() called multiple times');\n}\n\n/**\n * Inherit from `EventEmitter.prototype`.\n */\ninherits(Runnable, EventEmitter);\n\n/**\n * Set & get timeout `ms`.\n *\n * @api private\n * @param {number|string} ms\n * @return {Runnable|number} ms or Runnable instance.\n */\nRunnable.prototype.timeout = function(ms) {\n  if (!arguments.length) {\n    return this._timeout;\n  }\n  if (ms === 0) {\n    this._enableTimeouts = false;\n  }\n  if (typeof ms === 'string') {\n    ms = milliseconds(ms);\n  }\n  debug('timeout %d', ms);\n  this._timeout = ms;\n  if (this.timer) {\n    this.resetTimeout();\n  }\n  return this;\n};\n\n/**\n * Set & get slow `ms`.\n *\n * @api private\n * @param {number|string} ms\n * @return {Runnable|number} ms or Runnable instance.\n */\nRunnable.prototype.slow = function(ms) {\n  if (!arguments.length) {\n    return this._slow;\n  }\n  if (typeof ms === 'string') {\n    ms = milliseconds(ms);\n  }\n  debug('timeout %d', ms);\n  this._slow = ms;\n  return this;\n};\n\n/**\n * Set and get whether timeout is `enabled`.\n *\n * @api private\n * @param {boolean} enabled\n * @return {Runnable|boolean} enabled or Runnable instance.\n */\nRunnable.prototype.enableTimeouts = function(enabled) {\n  if (!arguments.length) {\n    return this._enableTimeouts;\n  }\n  debug('enableTimeouts %s', enabled);\n  this._enableTimeouts = enabled;\n  return this;\n};\n\n/**\n * Halt and mark as pending.\n *\n * @api private\n */\nRunnable.prototype.skip = function() {\n  throw new Pending();\n};\n\n/**\n * Return the full title generated by recursively concatenating the parent's\n * full title.\n *\n * @api public\n * @return {string}\n */\nRunnable.prototype.fullTitle = function() {\n  return this.parent.fullTitle() + ' ' + this.title;\n};\n\n/**\n * Clear the timeout.\n *\n * @api private\n */\nRunnable.prototype.clearTimeout = function() {\n  clearTimeout(this.timer);\n};\n\n/**\n * Inspect the runnable void of private properties.\n *\n * @api private\n * @return {string}\n */\nRunnable.prototype.inspect = function() {\n  return JSON.stringify(this, function(key, val) {\n    if (key[0] === '_') {\n      return;\n    }\n    if (key === 'parent') {\n      return '#<Suite>';\n    }\n    if (key === 'ctx') {\n      return '#<Context>';\n    }\n    return val;\n  }, 2);\n};\n\n/**\n * Reset the timeout.\n *\n * @api private\n */\nRunnable.prototype.resetTimeout = function() {\n  var self = this;\n  var ms = this.timeout() || 1e9;\n\n  if (!this._enableTimeouts) {\n    return;\n  }\n  this.clearTimeout();\n  this.timer = setTimeout(function() {\n    if (!self._enableTimeouts) {\n      return;\n    }\n    self.callback(new Error('timeout of ' + ms + 'ms exceeded. Ensure the done() callback is being called in this test.'));\n    self.timedOut = true;\n  }, ms);\n};\n\n/**\n * Whitelist a list of globals for this test run.\n *\n * @api private\n * @param {string[]} globals\n */\nRunnable.prototype.globals = function(globals) {\n  this._allowedGlobals = globals;\n};\n\n/**\n * Run the test and invoke `fn(err)`.\n *\n * @param {Function} fn\n * @api private\n */\nRunnable.prototype.run = function(fn) {\n  var self = this;\n  var start = new Date();\n  var ctx = this.ctx;\n  var finished;\n  var emitted;\n\n  // Sometimes the ctx exists, but it is not runnable\n  if (ctx && ctx.runnable) {\n    ctx.runnable(this);\n  }\n\n  // called multiple times\n  function multiple(err) {\n    if (emitted) {\n      return;\n    }\n    emitted = true;\n    self.emit('error', err || new Error('done() called multiple times; stacktrace may be inaccurate'));\n  }\n\n  // finished\n  function done(err) {\n    var ms = self.timeout();\n    if (self.timedOut) {\n      return;\n    }\n    if (finished) {\n      return multiple(err || self._trace);\n    }\n\n    self.clearTimeout();\n    self.duration = new Date() - start;\n    finished = true;\n    if (!err && self.duration > ms && self._enableTimeouts) {\n      err = new Error('timeout of ' + ms + 'ms exceeded. Ensure the done() callback is being called in this test.');\n    }\n    fn(err);\n  }\n\n  // for .resetTimeout()\n  this.callback = done;\n\n  // explicit async with `done` argument\n  if (this.async) {\n    this.resetTimeout();\n\n    if (this.allowUncaught) {\n      return callFnAsync(this.fn);\n    }\n    try {\n      callFnAsync(this.fn);\n    } catch (err) {\n      done(utils.getError(err));\n    }\n    return;\n  }\n\n  if (this.allowUncaught) {\n    callFn(this.fn);\n    done();\n    return;\n  }\n\n  // sync or promise-returning\n  try {\n    if (this.pending) {\n      done();\n    } else {\n      callFn(this.fn);\n    }\n  } catch (err) {\n    done(utils.getError(err));\n  }\n\n  function callFn(fn) {\n    var result = fn.call(ctx);\n    if (result && typeof result.then === 'function') {\n      self.resetTimeout();\n      result\n        .then(function() {\n          done();\n        },\n        function(reason) {\n          done(reason || new Error('Promise rejected with no or falsy reason'));\n        });\n    } else {\n      if (self.asyncOnly) {\n        return done(new Error('--async-only option in use without declaring `done()` or returning a promise'));\n      }\n\n      done();\n    }\n  }\n\n  function callFnAsync(fn) {\n    fn.call(ctx, function(err) {\n      if (err instanceof Error || toString.call(err) === '[object Error]') {\n        return done(err);\n      }\n      if (err) {\n        if (Object.prototype.toString.call(err) === '[object Object]') {\n          return done(new Error('done() invoked with non-Error: '\n            + JSON.stringify(err)));\n        }\n        return done(new Error('done() invoked with non-Error: ' + err));\n      }\n      done();\n    });\n  }\n};\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{\"./ms\":15,\"./pending\":16,\"./utils\":39,\"debug\":2,\"events\":3}],36:[function(require,module,exports){\n(function (process,global){\n/**\n * Module dependencies.\n */\n\nvar EventEmitter = require('events').EventEmitter;\nvar Pending = require('./pending');\nvar utils = require('./utils');\nvar inherits = utils.inherits;\nvar debug = require('debug')('mocha:runner');\nvar Runnable = require('./runnable');\nvar filter = utils.filter;\nvar indexOf = utils.indexOf;\nvar keys = utils.keys;\nvar stackFilter = utils.stackTraceFilter();\nvar stringify = utils.stringify;\nvar type = utils.type;\nvar undefinedError = utils.undefinedError;\n\n/**\n * Non-enumerable globals.\n */\n\nvar globals = [\n  'setTimeout',\n  'clearTimeout',\n  'setInterval',\n  'clearInterval',\n  'XMLHttpRequest',\n  'Date',\n  'setImmediate',\n  'clearImmediate'\n];\n\n/**\n * Expose `Runner`.\n */\n\nmodule.exports = Runner;\n\n/**\n * Initialize a `Runner` for the given `suite`.\n *\n * Events:\n *\n *   - `start`  execution started\n *   - `end`  execution complete\n *   - `suite`  (suite) test suite execution started\n *   - `suite end`  (suite) all tests (and sub-suites) have finished\n *   - `test`  (test) test execution started\n *   - `test end`  (test) test completed\n *   - `hook`  (hook) hook execution started\n *   - `hook end`  (hook) hook complete\n *   - `pass`  (test) test passed\n *   - `fail`  (test, err) test failed\n *   - `pending`  (test) test pending\n *\n * @api public\n * @param {Suite} suite Root suite\n * @param {boolean} [delay] Whether or not to delay execution of root suite\n * until ready.\n */\nfunction Runner(suite, delay) {\n  var self = this;\n  this._globals = [];\n  this._abort = false;\n  this._delay = delay;\n  this.suite = suite;\n  this.started = false;\n  this.total = suite.total();\n  this.failures = 0;\n  this.on('test end', function(test) {\n    self.checkGlobals(test);\n  });\n  this.on('hook end', function(hook) {\n    self.checkGlobals(hook);\n  });\n  this._defaultGrep = /.*/;\n  this.grep(this._defaultGrep);\n  this.globals(this.globalProps().concat(extraGlobals()));\n}\n\n/**\n * Wrapper for setImmediate, process.nextTick, or browser polyfill.\n *\n * @param {Function} fn\n * @api private\n */\nRunner.immediately = global.setImmediate || process.nextTick;\n\n/**\n * Inherit from `EventEmitter.prototype`.\n */\ninherits(Runner, EventEmitter);\n\n/**\n * Run tests with full titles matching `re`. Updates runner.total\n * with number of tests matched.\n *\n * @param {RegExp} re\n * @param {Boolean} invert\n * @return {Runner} for chaining\n * @api public\n * @param {RegExp} re\n * @param {boolean} invert\n * @return {Runner} Runner instance.\n */\nRunner.prototype.grep = function(re, invert) {\n  debug('grep %s', re);\n  this._grep = re;\n  this._invert = invert;\n  this.total = this.grepTotal(this.suite);\n  return this;\n};\n\n/**\n * Returns the number of tests matching the grep search for the\n * given suite.\n *\n * @param {Suite} suite\n * @return {Number}\n * @api public\n * @param {Suite} suite\n * @return {number}\n */\nRunner.prototype.grepTotal = function(suite) {\n  var self = this;\n  var total = 0;\n\n  suite.eachTest(function(test) {\n    var match = self._grep.test(test.fullTitle());\n    if (self._invert) {\n      match = !match;\n    }\n    if (match) {\n      total++;\n    }\n  });\n\n  return total;\n};\n\n/**\n * Return a list of global properties.\n *\n * @return {Array}\n * @api private\n */\nRunner.prototype.globalProps = function() {\n  var props = keys(global);\n\n  // non-enumerables\n  for (var i = 0; i < globals.length; ++i) {\n    if (~indexOf(props, globals[i])) {\n      continue;\n    }\n    props.push(globals[i]);\n  }\n\n  return props;\n};\n\n/**\n * Allow the given `arr` of globals.\n *\n * @param {Array} arr\n * @return {Runner} for chaining\n * @api public\n * @param {Array} arr\n * @return {Runner} Runner instance.\n */\nRunner.prototype.globals = function(arr) {\n  if (!arguments.length) {\n    return this._globals;\n  }\n  debug('globals %j', arr);\n  this._globals = this._globals.concat(arr);\n  return this;\n};\n\n/**\n * Check for global variable leaks.\n *\n * @api private\n */\nRunner.prototype.checkGlobals = function(test) {\n  if (this.ignoreLeaks) {\n    return;\n  }\n  var ok = this._globals;\n\n  var globals = this.globalProps();\n  var leaks;\n\n  if (test) {\n    ok = ok.concat(test._allowedGlobals || []);\n  }\n\n  if (this.prevGlobalsLength === globals.length) {\n    return;\n  }\n  this.prevGlobalsLength = globals.length;\n\n  leaks = filterLeaks(ok, globals);\n  this._globals = this._globals.concat(leaks);\n\n  if (leaks.length > 1) {\n    this.fail(test, new Error('global leaks detected: ' + leaks.join(', ') + ''));\n  } else if (leaks.length) {\n    this.fail(test, new Error('global leak detected: ' + leaks[0]));\n  }\n};\n\n/**\n * Fail the given `test`.\n *\n * @api private\n * @param {Test} test\n * @param {Error} err\n */\nRunner.prototype.fail = function(test, err) {\n  ++this.failures;\n  test.state = 'failed';\n\n  if (!(err instanceof Error || err && typeof err.message === 'string')) {\n    err = new Error('the ' + type(err) + ' ' + stringify(err) + ' was thrown, throw an Error :)');\n  }\n\n  err.stack = (this.fullStackTrace || !err.stack)\n    ? err.stack\n    : stackFilter(err.stack);\n\n  this.emit('fail', test, err);\n};\n\n/**\n * Fail the given `hook` with `err`.\n *\n * Hook failures work in the following pattern:\n * - If bail, then exit\n * - Failed `before` hook skips all tests in a suite and subsuites,\n *   but jumps to corresponding `after` hook\n * - Failed `before each` hook skips remaining tests in a\n *   suite and jumps to corresponding `after each` hook,\n *   which is run only once\n * - Failed `after` hook does not alter\n *   execution order\n * - Failed `after each` hook skips remaining tests in a\n *   suite and subsuites, but executes other `after each`\n *   hooks\n *\n * @api private\n * @param {Hook} hook\n * @param {Error} err\n */\nRunner.prototype.failHook = function(hook, err) {\n  if (hook.ctx && hook.ctx.currentTest) {\n    hook.originalTitle = hook.originalTitle || hook.title;\n    hook.title = hook.originalTitle + ' for \"' + hook.ctx.currentTest.title + '\"';\n  }\n\n  this.fail(hook, err);\n  if (this.suite.bail()) {\n    this.emit('end');\n  }\n};\n\n/**\n * Run hook `name` callbacks and then invoke `fn()`.\n *\n * @api private\n * @param {string} name\n * @param {Function} fn\n */\n\nRunner.prototype.hook = function(name, fn) {\n  var suite = this.suite;\n  var hooks = suite['_' + name];\n  var self = this;\n\n  function next(i) {\n    var hook = hooks[i];\n    if (!hook) {\n      return fn();\n    }\n    self.currentRunnable = hook;\n\n    hook.ctx.currentTest = self.test;\n\n    self.emit('hook', hook);\n\n    if (!hook.listeners('error').length) {\n      hook.on('error', function(err) {\n        self.failHook(hook, err);\n      });\n    }\n\n    hook.run(function(err) {\n      var testError = hook.error();\n      if (testError) {\n        self.fail(self.test, testError);\n      }\n      if (err) {\n        if (err instanceof Pending) {\n          suite.pending = true;\n        } else {\n          self.failHook(hook, err);\n\n          // stop executing hooks, notify callee of hook err\n          return fn(err);\n        }\n      }\n      self.emit('hook end', hook);\n      delete hook.ctx.currentTest;\n      next(++i);\n    });\n  }\n\n  Runner.immediately(function() {\n    next(0);\n  });\n};\n\n/**\n * Run hook `name` for the given array of `suites`\n * in order, and callback `fn(err, errSuite)`.\n *\n * @api private\n * @param {string} name\n * @param {Array} suites\n * @param {Function} fn\n */\nRunner.prototype.hooks = function(name, suites, fn) {\n  var self = this;\n  var orig = this.suite;\n\n  function next(suite) {\n    self.suite = suite;\n\n    if (!suite) {\n      self.suite = orig;\n      return fn();\n    }\n\n    self.hook(name, function(err) {\n      if (err) {\n        var errSuite = self.suite;\n        self.suite = orig;\n        return fn(err, errSuite);\n      }\n\n      next(suites.pop());\n    });\n  }\n\n  next(suites.pop());\n};\n\n/**\n * Run hooks from the top level down.\n *\n * @param {String} name\n * @param {Function} fn\n * @api private\n */\nRunner.prototype.hookUp = function(name, fn) {\n  var suites = [this.suite].concat(this.parents()).reverse();\n  this.hooks(name, suites, fn);\n};\n\n/**\n * Run hooks from the bottom up.\n *\n * @param {String} name\n * @param {Function} fn\n * @api private\n */\nRunner.prototype.hookDown = function(name, fn) {\n  var suites = [this.suite].concat(this.parents());\n  this.hooks(name, suites, fn);\n};\n\n/**\n * Return an array of parent Suites from\n * closest to furthest.\n *\n * @return {Array}\n * @api private\n */\nRunner.prototype.parents = function() {\n  var suite = this.suite;\n  var suites = [];\n  while (suite.parent) {\n    suite = suite.parent;\n    suites.push(suite);\n  }\n  return suites;\n};\n\n/**\n * Run the current test and callback `fn(err)`.\n *\n * @param {Function} fn\n * @api private\n */\nRunner.prototype.runTest = function(fn) {\n  var self = this;\n  var test = this.test;\n\n  if (this.asyncOnly) {\n    test.asyncOnly = true;\n  }\n\n  if (this.allowUncaught) {\n    test.allowUncaught = true;\n    return test.run(fn);\n  }\n  try {\n    test.on('error', function(err) {\n      self.fail(test, err);\n    });\n    test.run(fn);\n  } catch (err) {\n    fn(err);\n  }\n};\n\n/**\n * Run tests in the given `suite` and invoke the callback `fn()` when complete.\n *\n * @api private\n * @param {Suite} suite\n * @param {Function} fn\n */\nRunner.prototype.runTests = function(suite, fn) {\n  var self = this;\n  var tests = suite.tests.slice();\n  var test;\n\n  function hookErr(_, errSuite, after) {\n    // before/after Each hook for errSuite failed:\n    var orig = self.suite;\n\n    // for failed 'after each' hook start from errSuite parent,\n    // otherwise start from errSuite itself\n    self.suite = after ? errSuite.parent : errSuite;\n\n    if (self.suite) {\n      // call hookUp afterEach\n      self.hookUp('afterEach', function(err2, errSuite2) {\n        self.suite = orig;\n        // some hooks may fail even now\n        if (err2) {\n          return hookErr(err2, errSuite2, true);\n        }\n        // report error suite\n        fn(errSuite);\n      });\n    } else {\n      // there is no need calling other 'after each' hooks\n      self.suite = orig;\n      fn(errSuite);\n    }\n  }\n\n  function next(err, errSuite) {\n    // if we bail after first err\n    if (self.failures && suite._bail) {\n      return fn();\n    }\n\n    if (self._abort) {\n      return fn();\n    }\n\n    if (err) {\n      return hookErr(err, errSuite, true);\n    }\n\n    // next test\n    test = tests.shift();\n\n    // all done\n    if (!test) {\n      return fn();\n    }\n\n    // grep\n    var match = self._grep.test(test.fullTitle());\n    if (self._invert) {\n      match = !match;\n    }\n    if (!match) {\n      // Run immediately only if we have defined a grep. When we\n      // define a grep — It can cause maximum callstack error if\n      // the grep is doing a large recursive loop by neglecting\n      // all tests. The run immediately function also comes with\n      // a performance cost. So we don't want to run immediately\n      // if we run the whole test suite, because running the whole\n      // test suite don't do any immediate recursive loops. Thus,\n      // allowing a JS runtime to breathe.\n      if (self._grep !== self._defaultGrep) {\n        Runner.immediately(next);\n      } else {\n        next();\n      }\n      return;\n    }\n\n    // pending\n    if (test.pending) {\n      self.emit('pending', test);\n      self.emit('test end', test);\n      return next();\n    }\n\n    // execute test and hook(s)\n    self.emit('test', self.test = test);\n    self.hookDown('beforeEach', function(err, errSuite) {\n      if (suite.pending) {\n        self.emit('pending', test);\n        self.emit('test end', test);\n        return next();\n      }\n      if (err) {\n        return hookErr(err, errSuite, false);\n      }\n      self.currentRunnable = self.test;\n      self.runTest(function(err) {\n        test = self.test;\n\n        if (err) {\n          if (err instanceof Pending) {\n            self.emit('pending', test);\n          } else {\n            self.fail(test, err);\n          }\n          self.emit('test end', test);\n\n          if (err instanceof Pending) {\n            return next();\n          }\n\n          return self.hookUp('afterEach', next);\n        }\n\n        test.state = 'passed';\n        self.emit('pass', test);\n        self.emit('test end', test);\n        self.hookUp('afterEach', next);\n      });\n    });\n  }\n\n  this.next = next;\n  this.hookErr = hookErr;\n  next();\n};\n\n/**\n * Run the given `suite` and invoke the callback `fn()` when complete.\n *\n * @api private\n * @param {Suite} suite\n * @param {Function} fn\n */\nRunner.prototype.runSuite = function(suite, fn) {\n  var i = 0;\n  var self = this;\n  var total = this.grepTotal(suite);\n  var afterAllHookCalled = false;\n\n  debug('run suite %s', suite.fullTitle());\n\n  if (!total || (self.failures && suite._bail)) {\n    return fn();\n  }\n\n  this.emit('suite', this.suite = suite);\n\n  function next(errSuite) {\n    if (errSuite) {\n      // current suite failed on a hook from errSuite\n      if (errSuite === suite) {\n        // if errSuite is current suite\n        // continue to the next sibling suite\n        return done();\n      }\n      // errSuite is among the parents of current suite\n      // stop execution of errSuite and all sub-suites\n      return done(errSuite);\n    }\n\n    if (self._abort) {\n      return done();\n    }\n\n    var curr = suite.suites[i++];\n    if (!curr) {\n      return done();\n    }\n\n    // Avoid grep neglecting large number of tests causing a\n    // huge recursive loop and thus a maximum call stack error.\n    // See comment in `this.runTests()` for more information.\n    if (self._grep !== self._defaultGrep) {\n      Runner.immediately(function() {\n        self.runSuite(curr, next);\n      });\n    } else {\n      self.runSuite(curr, next);\n    }\n  }\n\n  function done(errSuite) {\n    self.suite = suite;\n    self.nextSuite = next;\n\n    if (afterAllHookCalled) {\n      fn(errSuite);\n    } else {\n      // mark that the afterAll block has been called once\n      // and so can be skipped if there is an error in it.\n      afterAllHookCalled = true;\n      self.hook('afterAll', function() {\n        self.emit('suite end', suite);\n        fn(errSuite);\n      });\n    }\n  }\n\n  this.nextSuite = next;\n\n  this.hook('beforeAll', function(err) {\n    if (err) {\n      return done();\n    }\n    self.runTests(suite, next);\n  });\n};\n\n/**\n * Handle uncaught exceptions.\n *\n * @param {Error} err\n * @api private\n */\nRunner.prototype.uncaught = function(err) {\n  if (err) {\n    debug('uncaught exception %s', err !== function() {\n      return this;\n    }.call(err) ? err : (err.message || err));\n  } else {\n    debug('uncaught undefined exception');\n    err = undefinedError();\n  }\n  err.uncaught = true;\n\n  var runnable = this.currentRunnable;\n\n  if (!runnable) {\n    runnable = new Runnable('Uncaught error outside test suite');\n    runnable.parent = this.suite;\n\n    if (this.started) {\n      this.fail(runnable, err);\n    } else {\n      // Can't recover from this failure\n      this.emit('start');\n      this.fail(runnable, err);\n      this.emit('end');\n    }\n\n    return;\n  }\n\n  runnable.clearTimeout();\n\n  // Ignore errors if complete\n  if (runnable.state) {\n    return;\n  }\n  this.fail(runnable, err);\n\n  // recover from test\n  if (runnable.type === 'test') {\n    this.emit('test end', runnable);\n    this.hookUp('afterEach', this.next);\n    return;\n  }\n\n // recover from hooks\n  if (runnable.type === 'hook') {\n    var errSuite = this.suite;\n    // if hook failure is in afterEach block\n    if (runnable.fullTitle().indexOf('after each') > -1) {\n      return this.hookErr(err, errSuite, true);\n    }\n    // if hook failure is in beforeEach block\n    if (runnable.fullTitle().indexOf('before each') > -1) {\n      return this.hookErr(err, errSuite, false);\n    }\n    // if hook failure is in after or before blocks\n    return this.nextSuite(errSuite);\n  }\n\n  // bail\n  this.emit('end');\n};\n\n/**\n * Run the root suite and invoke `fn(failures)`\n * on completion.\n *\n * @param {Function} fn\n * @return {Runner} for chaining\n * @api public\n * @param {Function} fn\n * @return {Runner} Runner instance.\n */\nRunner.prototype.run = function(fn) {\n  var self = this;\n  var rootSuite = this.suite;\n\n  fn = fn || function() {};\n\n  function uncaught(err) {\n    self.uncaught(err);\n  }\n\n  function start() {\n    self.started = true;\n    self.emit('start');\n    self.runSuite(rootSuite, function() {\n      debug('finished running');\n      self.emit('end');\n    });\n  }\n\n  debug('start');\n\n  // callback\n  this.on('end', function() {\n    debug('end');\n    process.removeListener('uncaughtException', uncaught);\n    fn(self.failures);\n  });\n\n  // uncaught exception\n  process.on('uncaughtException', uncaught);\n\n  if (this._delay) {\n    // for reporters, I guess.\n    // might be nice to debounce some dots while we wait.\n    this.emit('waiting', rootSuite);\n    rootSuite.once('run', start);\n  } else {\n    start();\n  }\n\n  return this;\n};\n\n/**\n * Cleanly abort execution.\n *\n * @api public\n * @return {Runner} Runner instance.\n */\nRunner.prototype.abort = function() {\n  debug('aborting');\n  this._abort = true;\n\n  return this;\n};\n\n/**\n * Filter leaks with the given globals flagged as `ok`.\n *\n * @api private\n * @param {Array} ok\n * @param {Array} globals\n * @return {Array}\n */\nfunction filterLeaks(ok, globals) {\n  return filter(globals, function(key) {\n    // Firefox and Chrome exposes iframes as index inside the window object\n    if (/^d+/.test(key)) {\n      return false;\n    }\n\n    // in firefox\n    // if runner runs in an iframe, this iframe's window.getInterface method not init at first\n    // it is assigned in some seconds\n    if (global.navigator && (/^getInterface/).test(key)) {\n      return false;\n    }\n\n    // an iframe could be approached by window[iframeIndex]\n    // in ie6,7,8 and opera, iframeIndex is enumerable, this could cause leak\n    if (global.navigator && (/^\\d+/).test(key)) {\n      return false;\n    }\n\n    // Opera and IE expose global variables for HTML element IDs (issue #243)\n    if (/^mocha-/.test(key)) {\n      return false;\n    }\n\n    var matched = filter(ok, function(ok) {\n      if (~ok.indexOf('*')) {\n        return key.indexOf(ok.split('*')[0]) === 0;\n      }\n      return key === ok;\n    });\n    return !matched.length && (!global.navigator || key !== 'onerror');\n  });\n}\n\n/**\n * Array of globals dependent on the environment.\n *\n * @return {Array}\n * @api private\n */\nfunction extraGlobals() {\n  if (typeof process === 'object' && typeof process.version === 'string') {\n    var parts = process.version.split('.');\n    var nodeVersion = utils.reduce(parts, function(a, v) {\n      return a << 8 | v;\n    });\n\n    // 'errno' was renamed to process._errno in v0.9.11.\n\n    if (nodeVersion < 0x00090B) {\n      return ['errno'];\n    }\n  }\n\n  return [];\n}\n\n}).call(this,require('_process'),typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{\"./pending\":16,\"./runnable\":35,\"./utils\":39,\"_process\":51,\"debug\":2,\"events\":3}],37:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar EventEmitter = require('events').EventEmitter;\nvar Hook = require('./hook');\nvar utils = require('./utils');\nvar inherits = utils.inherits;\nvar debug = require('debug')('mocha:suite');\nvar milliseconds = require('./ms');\n\n/**\n * Expose `Suite`.\n */\n\nexports = module.exports = Suite;\n\n/**\n * Create a new `Suite` with the given `title` and parent `Suite`. When a suite\n * with the same title is already present, that suite is returned to provide\n * nicer reporter and more flexible meta-testing.\n *\n * @api public\n * @param {Suite} parent\n * @param {string} title\n * @return {Suite}\n */\nexports.create = function(parent, title) {\n  var suite = new Suite(title, parent.ctx);\n  suite.parent = parent;\n  if (parent.pending) {\n    suite.pending = true;\n  }\n  title = suite.fullTitle();\n  parent.addSuite(suite);\n  return suite;\n};\n\n/**\n * Initialize a new `Suite` with the given `title` and `ctx`.\n *\n * @api private\n * @param {string} title\n * @param {Context} parentContext\n */\nfunction Suite(title, parentContext) {\n  this.title = title;\n  function Context() {}\n  Context.prototype = parentContext;\n  this.ctx = new Context();\n  this.suites = [];\n  this.tests = [];\n  this.pending = false;\n  this._beforeEach = [];\n  this._beforeAll = [];\n  this._afterEach = [];\n  this._afterAll = [];\n  this.root = !title;\n  this._timeout = 2000;\n  this._enableTimeouts = true;\n  this._slow = 75;\n  this._bail = false;\n  this.delayed = false;\n}\n\n/**\n * Inherit from `EventEmitter.prototype`.\n */\ninherits(Suite, EventEmitter);\n\n/**\n * Return a clone of this `Suite`.\n *\n * @api private\n * @return {Suite}\n */\nSuite.prototype.clone = function() {\n  var suite = new Suite(this.title);\n  debug('clone');\n  suite.ctx = this.ctx;\n  suite.timeout(this.timeout());\n  suite.enableTimeouts(this.enableTimeouts());\n  suite.slow(this.slow());\n  suite.bail(this.bail());\n  return suite;\n};\n\n/**\n * Set timeout `ms` or short-hand such as \"2s\".\n *\n * @api private\n * @param {number|string} ms\n * @return {Suite|number} for chaining\n */\nSuite.prototype.timeout = function(ms) {\n  if (!arguments.length) {\n    return this._timeout;\n  }\n  if (ms.toString() === '0') {\n    this._enableTimeouts = false;\n  }\n  if (typeof ms === 'string') {\n    ms = milliseconds(ms);\n  }\n  debug('timeout %d', ms);\n  this._timeout = parseInt(ms, 10);\n  return this;\n};\n\n/**\n  * Set timeout to `enabled`.\n  *\n  * @api private\n  * @param {boolean} enabled\n  * @return {Suite|boolean} self or enabled\n  */\nSuite.prototype.enableTimeouts = function(enabled) {\n  if (!arguments.length) {\n    return this._enableTimeouts;\n  }\n  debug('enableTimeouts %s', enabled);\n  this._enableTimeouts = enabled;\n  return this;\n};\n\n/**\n * Set slow `ms` or short-hand such as \"2s\".\n *\n * @api private\n * @param {number|string} ms\n * @return {Suite|number} for chaining\n */\nSuite.prototype.slow = function(ms) {\n  if (!arguments.length) {\n    return this._slow;\n  }\n  if (typeof ms === 'string') {\n    ms = milliseconds(ms);\n  }\n  debug('slow %d', ms);\n  this._slow = ms;\n  return this;\n};\n\n/**\n * Sets whether to bail after first error.\n *\n * @api private\n * @param {boolean} bail\n * @return {Suite|number} for chaining\n */\nSuite.prototype.bail = function(bail) {\n  if (!arguments.length) {\n    return this._bail;\n  }\n  debug('bail %s', bail);\n  this._bail = bail;\n  return this;\n};\n\n/**\n * Run `fn(test[, done])` before running tests.\n *\n * @api private\n * @param {string} title\n * @param {Function} fn\n * @return {Suite} for chaining\n */\nSuite.prototype.beforeAll = function(title, fn) {\n  if (this.pending) {\n    return this;\n  }\n  if (typeof title === 'function') {\n    fn = title;\n    title = fn.name;\n  }\n  title = '\"before all\" hook' + (title ? ': ' + title : '');\n\n  var hook = new Hook(title, fn);\n  hook.parent = this;\n  hook.timeout(this.timeout());\n  hook.enableTimeouts(this.enableTimeouts());\n  hook.slow(this.slow());\n  hook.ctx = this.ctx;\n  this._beforeAll.push(hook);\n  this.emit('beforeAll', hook);\n  return this;\n};\n\n/**\n * Run `fn(test[, done])` after running tests.\n *\n * @api private\n * @param {string} title\n * @param {Function} fn\n * @return {Suite} for chaining\n */\nSuite.prototype.afterAll = function(title, fn) {\n  if (this.pending) {\n    return this;\n  }\n  if (typeof title === 'function') {\n    fn = title;\n    title = fn.name;\n  }\n  title = '\"after all\" hook' + (title ? ': ' + title : '');\n\n  var hook = new Hook(title, fn);\n  hook.parent = this;\n  hook.timeout(this.timeout());\n  hook.enableTimeouts(this.enableTimeouts());\n  hook.slow(this.slow());\n  hook.ctx = this.ctx;\n  this._afterAll.push(hook);\n  this.emit('afterAll', hook);\n  return this;\n};\n\n/**\n * Run `fn(test[, done])` before each test case.\n *\n * @api private\n * @param {string} title\n * @param {Function} fn\n * @return {Suite} for chaining\n */\nSuite.prototype.beforeEach = function(title, fn) {\n  if (this.pending) {\n    return this;\n  }\n  if (typeof title === 'function') {\n    fn = title;\n    title = fn.name;\n  }\n  title = '\"before each\" hook' + (title ? ': ' + title : '');\n\n  var hook = new Hook(title, fn);\n  hook.parent = this;\n  hook.timeout(this.timeout());\n  hook.enableTimeouts(this.enableTimeouts());\n  hook.slow(this.slow());\n  hook.ctx = this.ctx;\n  this._beforeEach.push(hook);\n  this.emit('beforeEach', hook);\n  return this;\n};\n\n/**\n * Run `fn(test[, done])` after each test case.\n *\n * @api private\n * @param {string} title\n * @param {Function} fn\n * @return {Suite} for chaining\n */\nSuite.prototype.afterEach = function(title, fn) {\n  if (this.pending) {\n    return this;\n  }\n  if (typeof title === 'function') {\n    fn = title;\n    title = fn.name;\n  }\n  title = '\"after each\" hook' + (title ? ': ' + title : '');\n\n  var hook = new Hook(title, fn);\n  hook.parent = this;\n  hook.timeout(this.timeout());\n  hook.enableTimeouts(this.enableTimeouts());\n  hook.slow(this.slow());\n  hook.ctx = this.ctx;\n  this._afterEach.push(hook);\n  this.emit('afterEach', hook);\n  return this;\n};\n\n/**\n * Add a test `suite`.\n *\n * @api private\n * @param {Suite} suite\n * @return {Suite} for chaining\n */\nSuite.prototype.addSuite = function(suite) {\n  suite.parent = this;\n  suite.timeout(this.timeout());\n  suite.enableTimeouts(this.enableTimeouts());\n  suite.slow(this.slow());\n  suite.bail(this.bail());\n  this.suites.push(suite);\n  this.emit('suite', suite);\n  return this;\n};\n\n/**\n * Add a `test` to this suite.\n *\n * @api private\n * @param {Test} test\n * @return {Suite} for chaining\n */\nSuite.prototype.addTest = function(test) {\n  test.parent = this;\n  test.timeout(this.timeout());\n  test.enableTimeouts(this.enableTimeouts());\n  test.slow(this.slow());\n  test.ctx = this.ctx;\n  this.tests.push(test);\n  this.emit('test', test);\n  return this;\n};\n\n/**\n * Return the full title generated by recursively concatenating the parent's\n * full title.\n *\n * @api public\n * @return {string}\n */\nSuite.prototype.fullTitle = function() {\n  if (this.parent) {\n    var full = this.parent.fullTitle();\n    if (full) {\n      return full + ' ' + this.title;\n    }\n  }\n  return this.title;\n};\n\n/**\n * Return the total number of tests.\n *\n * @api public\n * @return {number}\n */\nSuite.prototype.total = function() {\n  return utils.reduce(this.suites, function(sum, suite) {\n    return sum + suite.total();\n  }, 0) + this.tests.length;\n};\n\n/**\n * Iterates through each suite recursively to find all tests. Applies a\n * function in the format `fn(test)`.\n *\n * @api private\n * @param {Function} fn\n * @return {Suite}\n */\nSuite.prototype.eachTest = function(fn) {\n  utils.forEach(this.tests, fn);\n  utils.forEach(this.suites, function(suite) {\n    suite.eachTest(fn);\n  });\n  return this;\n};\n\n/**\n * This will run the root suite if we happen to be running in delayed mode.\n */\nSuite.prototype.run = function run() {\n  if (this.root) {\n    this.emit('run');\n  }\n};\n\n},{\"./hook\":7,\"./ms\":15,\"./utils\":39,\"debug\":2,\"events\":3}],38:[function(require,module,exports){\n/**\n * Module dependencies.\n */\n\nvar Runnable = require('./runnable');\nvar inherits = require('./utils').inherits;\n\n/**\n * Expose `Test`.\n */\n\nmodule.exports = Test;\n\n/**\n * Initialize a new `Test` with the given `title` and callback `fn`.\n *\n * @api private\n * @param {String} title\n * @param {Function} fn\n */\nfunction Test(title, fn) {\n  Runnable.call(this, title, fn);\n  this.pending = !fn;\n  this.type = 'test';\n}\n\n/**\n * Inherit from `Runnable.prototype`.\n */\ninherits(Test, Runnable);\n\n},{\"./runnable\":35,\"./utils\":39}],39:[function(require,module,exports){\n(function (process,Buffer){\n/* eslint-env browser */\n\n/**\n * Module dependencies.\n */\n\nvar basename = require('path').basename;\nvar debug = require('debug')('mocha:watch');\nvar exists = require('fs').existsSync || require('path').existsSync;\nvar glob = require('glob');\nvar join = require('path').join;\nvar readdirSync = require('fs').readdirSync;\nvar statSync = require('fs').statSync;\nvar watchFile = require('fs').watchFile;\n\n/**\n * Ignored directories.\n */\n\nvar ignore = ['node_modules', '.git'];\n\nexports.inherits = require('util').inherits;\n\n/**\n * Escape special characters in the given string of html.\n *\n * @api private\n * @param  {string} html\n * @return {string}\n */\nexports.escape = function(html) {\n  return String(html)\n    .replace(/&/g, '&amp;')\n    .replace(/\"/g, '&quot;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;');\n};\n\n/**\n * Array#forEach (<=IE8)\n *\n * @api private\n * @param {Array} arr\n * @param {Function} fn\n * @param {Object} scope\n */\nexports.forEach = function(arr, fn, scope) {\n  for (var i = 0, l = arr.length; i < l; i++) {\n    fn.call(scope, arr[i], i);\n  }\n};\n\n/**\n * Test if the given obj is type of string.\n *\n * @api private\n * @param {Object} obj\n * @return {boolean}\n */\nexports.isString = function(obj) {\n  return typeof obj === 'string';\n};\n\n/**\n * Array#map (<=IE8)\n *\n * @api private\n * @param {Array} arr\n * @param {Function} fn\n * @param {Object} scope\n * @return {Array}\n */\nexports.map = function(arr, fn, scope) {\n  var result = [];\n  for (var i = 0, l = arr.length; i < l; i++) {\n    result.push(fn.call(scope, arr[i], i, arr));\n  }\n  return result;\n};\n\n/**\n * Array#indexOf (<=IE8)\n *\n * @api private\n * @param {Array} arr\n * @param {Object} obj to find index of\n * @param {number} start\n * @return {number}\n */\nexports.indexOf = function(arr, obj, start) {\n  for (var i = start || 0, l = arr.length; i < l; i++) {\n    if (arr[i] === obj) {\n      return i;\n    }\n  }\n  return -1;\n};\n\n/**\n * Array#reduce (<=IE8)\n *\n * @api private\n * @param {Array} arr\n * @param {Function} fn\n * @param {Object} val Initial value.\n * @return {*}\n */\nexports.reduce = function(arr, fn, val) {\n  var rval = val;\n\n  for (var i = 0, l = arr.length; i < l; i++) {\n    rval = fn(rval, arr[i], i, arr);\n  }\n\n  return rval;\n};\n\n/**\n * Array#filter (<=IE8)\n *\n * @api private\n * @param {Array} arr\n * @param {Function} fn\n * @return {Array}\n */\nexports.filter = function(arr, fn) {\n  var ret = [];\n\n  for (var i = 0, l = arr.length; i < l; i++) {\n    var val = arr[i];\n    if (fn(val, i, arr)) {\n      ret.push(val);\n    }\n  }\n\n  return ret;\n};\n\n/**\n * Object.keys (<=IE8)\n *\n * @api private\n * @param {Object} obj\n * @return {Array} keys\n */\nexports.keys = typeof Object.keys === 'function' ? Object.keys : function(obj) {\n  var keys = [];\n  var has = Object.prototype.hasOwnProperty; // for `window` on <=IE8\n\n  for (var key in obj) {\n    if (has.call(obj, key)) {\n      keys.push(key);\n    }\n  }\n\n  return keys;\n};\n\n/**\n * Watch the given `files` for changes\n * and invoke `fn(file)` on modification.\n *\n * @api private\n * @param {Array} files\n * @param {Function} fn\n */\nexports.watch = function(files, fn) {\n  var options = { interval: 100 };\n  files.forEach(function(file) {\n    debug('file %s', file);\n    watchFile(file, options, function(curr, prev) {\n      if (prev.mtime < curr.mtime) {\n        fn(file);\n      }\n    });\n  });\n};\n\n/**\n * Array.isArray (<=IE8)\n *\n * @api private\n * @param {Object} obj\n * @return {Boolean}\n */\nvar isArray = typeof Array.isArray === 'function' ? Array.isArray : function(obj) {\n  return Object.prototype.toString.call(obj) === '[object Array]';\n};\n\n/**\n * Buffer.prototype.toJSON polyfill.\n *\n * @type {Function}\n */\nif (typeof Buffer !== 'undefined' && Buffer.prototype) {\n  Buffer.prototype.toJSON = Buffer.prototype.toJSON || function() {\n    return Array.prototype.slice.call(this, 0);\n  };\n}\n\n/**\n * Ignored files.\n *\n * @api private\n * @param {string} path\n * @return {boolean}\n */\nfunction ignored(path) {\n  return !~ignore.indexOf(path);\n}\n\n/**\n * Lookup files in the given `dir`.\n *\n * @api private\n * @param {string} dir\n * @param {string[]} [ext=['.js']]\n * @param {Array} [ret=[]]\n * @return {Array}\n */\nexports.files = function(dir, ext, ret) {\n  ret = ret || [];\n  ext = ext || ['js'];\n\n  var re = new RegExp('\\\\.(' + ext.join('|') + ')$');\n\n  readdirSync(dir)\n    .filter(ignored)\n    .forEach(function(path) {\n      path = join(dir, path);\n      if (statSync(path).isDirectory()) {\n        exports.files(path, ext, ret);\n      } else if (path.match(re)) {\n        ret.push(path);\n      }\n    });\n\n  return ret;\n};\n\n/**\n * Compute a slug from the given `str`.\n *\n * @api private\n * @param {string} str\n * @return {string}\n */\nexports.slug = function(str) {\n  return str\n    .toLowerCase()\n    .replace(/ +/g, '-')\n    .replace(/[^-\\w]/g, '');\n};\n\n/**\n * Strip the function definition from `str`, and re-indent for pre whitespace.\n *\n * @param {string} str\n * @return {string}\n */\nexports.clean = function(str) {\n  str = str\n    .replace(/\\r\\n?|[\\n\\u2028\\u2029]/g, '\\n').replace(/^\\uFEFF/, '')\n    .replace(/^function *\\(.*\\)\\s*{|\\(.*\\) *=> *{?/, '')\n    .replace(/\\s+\\}$/, '');\n\n  var spaces = str.match(/^\\n?( *)/)[1].length;\n  var tabs = str.match(/^\\n?(\\t*)/)[1].length;\n  var re = new RegExp('^\\n?' + (tabs ? '\\t' : ' ') + '{' + (tabs ? tabs : spaces) + '}', 'gm');\n\n  str = str.replace(re, '');\n\n  return exports.trim(str);\n};\n\n/**\n * Trim the given `str`.\n *\n * @api private\n * @param {string} str\n * @return {string}\n */\nexports.trim = function(str) {\n  return str.replace(/^\\s+|\\s+$/g, '');\n};\n\n/**\n * Parse the given `qs`.\n *\n * @api private\n * @param {string} qs\n * @return {Object}\n */\nexports.parseQuery = function(qs) {\n  return exports.reduce(qs.replace('?', '').split('&'), function(obj, pair) {\n    var i = pair.indexOf('=');\n    var key = pair.slice(0, i);\n    var val = pair.slice(++i);\n\n    obj[key] = decodeURIComponent(val);\n    return obj;\n  }, {});\n};\n\n/**\n * Highlight the given string of `js`.\n *\n * @api private\n * @param {string} js\n * @return {string}\n */\nfunction highlight(js) {\n  return js\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;')\n    .replace(/\\/\\/(.*)/gm, '<span class=\"comment\">//$1</span>')\n    .replace(/('.*?')/gm, '<span class=\"string\">$1</span>')\n    .replace(/(\\d+\\.\\d+)/gm, '<span class=\"number\">$1</span>')\n    .replace(/(\\d+)/gm, '<span class=\"number\">$1</span>')\n    .replace(/\\bnew[ \\t]+(\\w+)/gm, '<span class=\"keyword\">new</span> <span class=\"init\">$1</span>')\n    .replace(/\\b(function|new|throw|return|var|if|else)\\b/gm, '<span class=\"keyword\">$1</span>');\n}\n\n/**\n * Highlight the contents of tag `name`.\n *\n * @api private\n * @param {string} name\n */\nexports.highlightTags = function(name) {\n  var code = document.getElementById('mocha').getElementsByTagName(name);\n  for (var i = 0, len = code.length; i < len; ++i) {\n    code[i].innerHTML = highlight(code[i].innerHTML);\n  }\n};\n\n/**\n * If a value could have properties, and has none, this function is called,\n * which returns a string representation of the empty value.\n *\n * Functions w/ no properties return `'[Function]'`\n * Arrays w/ length === 0 return `'[]'`\n * Objects w/ no properties return `'{}'`\n * All else: return result of `value.toString()`\n *\n * @api private\n * @param {*} value The value to inspect.\n * @param {string} [type] The type of the value, if known.\n * @returns {string}\n */\nfunction emptyRepresentation(value, type) {\n  type = type || exports.type(value);\n\n  switch (type) {\n    case 'function':\n      return '[Function]';\n    case 'object':\n      return '{}';\n    case 'array':\n      return '[]';\n    default:\n      return value.toString();\n  }\n}\n\n/**\n * Takes some variable and asks `Object.prototype.toString()` what it thinks it\n * is.\n *\n * @api private\n * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString\n * @param {*} value The value to test.\n * @returns {string}\n * @example\n * type({}) // 'object'\n * type([]) // 'array'\n * type(1) // 'number'\n * type(false) // 'boolean'\n * type(Infinity) // 'number'\n * type(null) // 'null'\n * type(new Date()) // 'date'\n * type(/foo/) // 'regexp'\n * type('type') // 'string'\n * type(global) // 'global'\n */\nexports.type = function type(value) {\n  if (value === undefined) {\n    return 'undefined';\n  } else if (value === null) {\n    return 'null';\n  } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {\n    return 'buffer';\n  }\n  return Object.prototype.toString.call(value)\n    .replace(/^\\[.+\\s(.+?)\\]$/, '$1')\n    .toLowerCase();\n};\n\n/**\n * Stringify `value`. Different behavior depending on type of value:\n *\n * - If `value` is undefined or null, return `'[undefined]'` or `'[null]'`, respectively.\n * - If `value` is not an object, function or array, return result of `value.toString()` wrapped in double-quotes.\n * - If `value` is an *empty* object, function, or array, return result of function\n *   {@link emptyRepresentation}.\n * - If `value` has properties, call {@link exports.canonicalize} on it, then return result of\n *   JSON.stringify().\n *\n * @api private\n * @see exports.type\n * @param {*} value\n * @return {string}\n */\nexports.stringify = function(value) {\n  var type = exports.type(value);\n\n  if (!~exports.indexOf(['object', 'array', 'function'], type)) {\n    if (type !== 'buffer') {\n      return jsonStringify(value);\n    }\n    var json = value.toJSON();\n    // Based on the toJSON result\n    return jsonStringify(json.data && json.type ? json.data : json, 2)\n      .replace(/,(\\n|$)/g, '$1');\n  }\n\n  for (var prop in value) {\n    if (Object.prototype.hasOwnProperty.call(value, prop)) {\n      return jsonStringify(exports.canonicalize(value), 2).replace(/,(\\n|$)/g, '$1');\n    }\n  }\n\n  return emptyRepresentation(value, type);\n};\n\n/**\n * like JSON.stringify but more sense.\n *\n * @api private\n * @param {Object}  object\n * @param {number=} spaces\n * @param {number=} depth\n * @returns {*}\n */\nfunction jsonStringify(object, spaces, depth) {\n  if (typeof spaces === 'undefined') {\n    // primitive types\n    return _stringify(object);\n  }\n\n  depth = depth || 1;\n  var space = spaces * depth;\n  var str = isArray(object) ? '[' : '{';\n  var end = isArray(object) ? ']' : '}';\n  var length = object.length || exports.keys(object).length;\n  // `.repeat()` polyfill\n  function repeat(s, n) {\n    return new Array(n).join(s);\n  }\n\n  function _stringify(val) {\n    switch (exports.type(val)) {\n      case 'null':\n      case 'undefined':\n        val = '[' + val + ']';\n        break;\n      case 'array':\n      case 'object':\n        val = jsonStringify(val, spaces, depth + 1);\n        break;\n      case 'boolean':\n      case 'regexp':\n      case 'number':\n        val = val === 0 && (1 / val) === -Infinity // `-0`\n          ? '-0'\n          : val.toString();\n        break;\n      case 'date':\n        var sDate = isNaN(val.getTime())        // Invalid date\n          ? val.toString()\n          : val.toISOString();\n        val = '[Date: ' + sDate + ']';\n        break;\n      case 'buffer':\n        var json = val.toJSON();\n        // Based on the toJSON result\n        json = json.data && json.type ? json.data : json;\n        val = '[Buffer: ' + jsonStringify(json, 2, depth + 1) + ']';\n        break;\n      default:\n        val = (val === '[Function]' || val === '[Circular]')\n          ? val\n          : JSON.stringify(val); // string\n    }\n    return val;\n  }\n\n  for (var i in object) {\n    if (!object.hasOwnProperty(i)) {\n      continue; // not my business\n    }\n    --length;\n    str += '\\n ' + repeat(' ', space)\n      + (isArray(object) ? '' : '\"' + i + '\": ') // key\n      + _stringify(object[i])                     // value\n      + (length ? ',' : '');                     // comma\n  }\n\n  return str\n    // [], {}\n    + (str.length !== 1 ? '\\n' + repeat(' ', --space) + end : end);\n}\n\n/**\n * Test if a value is a buffer.\n *\n * @api private\n * @param {*} value The value to test.\n * @return {boolean} True if `value` is a buffer, otherwise false\n */\nexports.isBuffer = function(value) {\n  return typeof Buffer !== 'undefined' && Buffer.isBuffer(value);\n};\n\n/**\n * Return a new Thing that has the keys in sorted order. Recursive.\n *\n * If the Thing...\n * - has already been seen, return string `'[Circular]'`\n * - is `undefined`, return string `'[undefined]'`\n * - is `null`, return value `null`\n * - is some other primitive, return the value\n * - is not a primitive or an `Array`, `Object`, or `Function`, return the value of the Thing's `toString()` method\n * - is a non-empty `Array`, `Object`, or `Function`, return the result of calling this function again.\n * - is an empty `Array`, `Object`, or `Function`, return the result of calling `emptyRepresentation()`\n *\n * @api private\n * @see {@link exports.stringify}\n * @param {*} value Thing to inspect.  May or may not have properties.\n * @param {Array} [stack=[]] Stack of seen values\n * @return {(Object|Array|Function|string|undefined)}\n */\nexports.canonicalize = function(value, stack) {\n  var canonicalizedObj;\n  /* eslint-disable no-unused-vars */\n  var prop;\n  /* eslint-enable no-unused-vars */\n  var type = exports.type(value);\n  function withStack(value, fn) {\n    stack.push(value);\n    fn();\n    stack.pop();\n  }\n\n  stack = stack || [];\n\n  if (exports.indexOf(stack, value) !== -1) {\n    return '[Circular]';\n  }\n\n  switch (type) {\n    case 'undefined':\n    case 'buffer':\n    case 'null':\n      canonicalizedObj = value;\n      break;\n    case 'array':\n      withStack(value, function() {\n        canonicalizedObj = exports.map(value, function(item) {\n          return exports.canonicalize(item, stack);\n        });\n      });\n      break;\n    case 'function':\n      /* eslint-disable guard-for-in */\n      for (prop in value) {\n        canonicalizedObj = {};\n        break;\n      }\n      /* eslint-enable guard-for-in */\n      if (!canonicalizedObj) {\n        canonicalizedObj = emptyRepresentation(value, type);\n        break;\n      }\n    /* falls through */\n    case 'object':\n      canonicalizedObj = canonicalizedObj || {};\n      withStack(value, function() {\n        exports.forEach(exports.keys(value).sort(), function(key) {\n          canonicalizedObj[key] = exports.canonicalize(value[key], stack);\n        });\n      });\n      break;\n    case 'date':\n    case 'number':\n    case 'regexp':\n    case 'boolean':\n      canonicalizedObj = value;\n      break;\n    default:\n      canonicalizedObj = value.toString();\n  }\n\n  return canonicalizedObj;\n};\n\n/**\n * Lookup file names at the given `path`.\n *\n * @api public\n * @param {string} path Base path to start searching from.\n * @param {string[]} extensions File extensions to look for.\n * @param {boolean} recursive Whether or not to recurse into subdirectories.\n * @return {string[]} An array of paths.\n */\nexports.lookupFiles = function lookupFiles(path, extensions, recursive) {\n  var files = [];\n  var re = new RegExp('\\\\.(' + extensions.join('|') + ')$');\n\n  if (!exists(path)) {\n    if (exists(path + '.js')) {\n      path += '.js';\n    } else {\n      files = glob.sync(path);\n      if (!files.length) {\n        throw new Error(\"cannot resolve path (or pattern) '\" + path + \"'\");\n      }\n      return files;\n    }\n  }\n\n  try {\n    var stat = statSync(path);\n    if (stat.isFile()) {\n      return path;\n    }\n  } catch (err) {\n    // ignore error\n    return;\n  }\n\n  readdirSync(path).forEach(function(file) {\n    file = join(path, file);\n    try {\n      var stat = statSync(file);\n      if (stat.isDirectory()) {\n        if (recursive) {\n          files = files.concat(lookupFiles(file, extensions, recursive));\n        }\n        return;\n      }\n    } catch (err) {\n      // ignore error\n      return;\n    }\n    if (!stat.isFile() || !re.test(file) || basename(file)[0] === '.') {\n      return;\n    }\n    files.push(file);\n  });\n\n  return files;\n};\n\n/**\n * Generate an undefined error with a message warning the user.\n *\n * @return {Error}\n */\n\nexports.undefinedError = function() {\n  return new Error('Caught undefined error, did you throw without specifying what?');\n};\n\n/**\n * Generate an undefined error if `err` is not defined.\n *\n * @param {Error} err\n * @return {Error}\n */\n\nexports.getError = function(err) {\n  return err || exports.undefinedError();\n};\n\n/**\n * @summary\n * This Filter based on `mocha-clean` module.(see: `github.com/rstacruz/mocha-clean`)\n * @description\n * When invoking this function you get a filter function that get the Error.stack as an input,\n * and return a prettify output.\n * (i.e: strip Mocha and internal node functions from stack trace).\n * @returns {Function}\n */\nexports.stackTraceFilter = function() {\n  // TODO: Replace with `process.browser`\n  var slash = '/';\n  var is = typeof document === 'undefined' ? { node: true } : { browser: true };\n  var cwd = is.node\n      ? process.cwd() + slash\n      : (typeof location === 'undefined' ? window.location : location).href.replace(/\\/[^\\/]*$/, '/');\n\n  function isMochaInternal(line) {\n    return (~line.indexOf('node_modules' + slash + 'mocha' + slash))\n      || (~line.indexOf('components' + slash + 'mochajs' + slash))\n      || (~line.indexOf('components' + slash + 'mocha' + slash))\n      || (~line.indexOf(slash + 'mocha.js'));\n  }\n\n  function isNodeInternal(line) {\n    return (~line.indexOf('(timers.js:'))\n      || (~line.indexOf('(events.js:'))\n      || (~line.indexOf('(node.js:'))\n      || (~line.indexOf('(module.js:'))\n      || (~line.indexOf('GeneratorFunctionPrototype.next (native)'))\n      || false;\n  }\n\n  return function(stack) {\n    stack = stack.split('\\n');\n\n    stack = exports.reduce(stack, function(list, line) {\n      if (isMochaInternal(line)) {\n        return list;\n      }\n\n      if (is.node && isNodeInternal(line)) {\n        return list;\n      }\n\n      // Clean up cwd(absolute)\n      list.push(line.replace(cwd, ''));\n      return list;\n    }, []);\n\n    return stack.join('\\n');\n  };\n};\n\n}).call(this,require('_process'),require(\"buffer\").Buffer)\n},{\"_process\":51,\"buffer\":43,\"debug\":2,\"fs\":41,\"glob\":41,\"path\":41,\"util\":66}],40:[function(require,module,exports){\n(function (process){\nvar WritableStream = require('stream').Writable\nvar inherits = require('util').inherits\n\nmodule.exports = BrowserStdout\n\n\ninherits(BrowserStdout, WritableStream)\n\nfunction BrowserStdout(opts) {\n  if (!(this instanceof BrowserStdout)) return new BrowserStdout(opts)\n\n  opts = opts || {}\n  WritableStream.call(this, opts)\n  this.label = (opts.label !== undefined) ? opts.label : 'stdout'\n}\n\nBrowserStdout.prototype._write = function(chunks, encoding, cb) {\n  var output = chunks.toString ? chunks.toString() : chunks\n  if (this.label === false) {\n    console.log(output)\n  } else {\n    console.log(this.label+':', output)\n  }\n  process.nextTick(cb)\n}\n\n}).call(this,require('_process'))\n},{\"_process\":51,\"stream\":63,\"util\":66}],41:[function(require,module,exports){\n\n},{}],42:[function(require,module,exports){\narguments[4][41][0].apply(exports,arguments)\n},{\"dup\":41}],43:[function(require,module,exports){\n/*!\n * The buffer module from node.js, for the browser.\n *\n * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>\n * @license  MIT\n */\n\nvar base64 = require('base64-js')\nvar ieee754 = require('ieee754')\nvar isArray = require('is-array')\n\nexports.Buffer = Buffer\nexports.SlowBuffer = SlowBuffer\nexports.INSPECT_MAX_BYTES = 50\nBuffer.poolSize = 8192 // not used by this implementation\n\nvar rootParent = {}\n\n/**\n * If `Buffer.TYPED_ARRAY_SUPPORT`:\n *   === true    Use Uint8Array implementation (fastest)\n *   === false   Use Object implementation (most compatible, even IE6)\n *\n * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,\n * Opera 11.6+, iOS 4.2+.\n *\n * Due to various browser bugs, sometimes the Object implementation will be used even\n * when the browser supports typed arrays.\n *\n * Note:\n *\n *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,\n *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.\n *\n *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property\n *     on objects.\n *\n *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.\n *\n *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of\n *     incorrect length in some situations.\n\n * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they\n * get the Object implementation, which is slower but behaves correctly.\n */\nBuffer.TYPED_ARRAY_SUPPORT = (function () {\n  function Bar () {}\n  try {\n    var arr = new Uint8Array(1)\n    arr.foo = function () { return 42 }\n    arr.constructor = Bar\n    return arr.foo() === 42 && // typed array instances can be augmented\n        arr.constructor === Bar && // constructor can be set\n        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`\n        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`\n  } catch (e) {\n    return false\n  }\n})()\n\nfunction kMaxLength () {\n  return Buffer.TYPED_ARRAY_SUPPORT\n    ? 0x7fffffff\n    : 0x3fffffff\n}\n\n/**\n * Class: Buffer\n * =============\n *\n * The Buffer constructor returns instances of `Uint8Array` that are augmented\n * with function properties for all the node `Buffer` API functions. We use\n * `Uint8Array` so that square bracket notation works as expected -- it returns\n * a single octet.\n *\n * By augmenting the instances, we can avoid modifying the `Uint8Array`\n * prototype.\n */\nfunction Buffer (arg) {\n  if (!(this instanceof Buffer)) {\n    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.\n    if (arguments.length > 1) return new Buffer(arg, arguments[1])\n    return new Buffer(arg)\n  }\n\n  this.length = 0\n  this.parent = undefined\n\n  // Common case.\n  if (typeof arg === 'number') {\n    return fromNumber(this, arg)\n  }\n\n  // Slightly less common case.\n  if (typeof arg === 'string') {\n    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')\n  }\n\n  // Unusual.\n  return fromObject(this, arg)\n}\n\nfunction fromNumber (that, length) {\n  that = allocate(that, length < 0 ? 0 : checked(length) | 0)\n  if (!Buffer.TYPED_ARRAY_SUPPORT) {\n    for (var i = 0; i < length; i++) {\n      that[i] = 0\n    }\n  }\n  return that\n}\n\nfunction fromString (that, string, encoding) {\n  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'\n\n  // Assumption: byteLength() return value is always < kMaxLength.\n  var length = byteLength(string, encoding) | 0\n  that = allocate(that, length)\n\n  that.write(string, encoding)\n  return that\n}\n\nfunction fromObject (that, object) {\n  if (Buffer.isBuffer(object)) return fromBuffer(that, object)\n\n  if (isArray(object)) return fromArray(that, object)\n\n  if (object == null) {\n    throw new TypeError('must start with number, buffer, array or string')\n  }\n\n  if (typeof ArrayBuffer !== 'undefined') {\n    if (object.buffer instanceof ArrayBuffer) {\n      return fromTypedArray(that, object)\n    }\n    if (object instanceof ArrayBuffer) {\n      return fromArrayBuffer(that, object)\n    }\n  }\n\n  if (object.length) return fromArrayLike(that, object)\n\n  return fromJsonObject(that, object)\n}\n\nfunction fromBuffer (that, buffer) {\n  var length = checked(buffer.length) | 0\n  that = allocate(that, length)\n  buffer.copy(that, 0, 0, length)\n  return that\n}\n\nfunction fromArray (that, array) {\n  var length = checked(array.length) | 0\n  that = allocate(that, length)\n  for (var i = 0; i < length; i += 1) {\n    that[i] = array[i] & 255\n  }\n  return that\n}\n\n// Duplicate of fromArray() to keep fromArray() monomorphic.\nfunction fromTypedArray (that, array) {\n  var length = checked(array.length) | 0\n  that = allocate(that, length)\n  // Truncating the elements is probably not what people expect from typed\n  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior\n  // of the old Buffer constructor.\n  for (var i = 0; i < length; i += 1) {\n    that[i] = array[i] & 255\n  }\n  return that\n}\n\nfunction fromArrayBuffer (that, array) {\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    // Return an augmented `Uint8Array` instance, for best performance\n    array.byteLength\n    that = Buffer._augment(new Uint8Array(array))\n  } else {\n    // Fallback: Return an object instance of the Buffer class\n    that = fromTypedArray(that, new Uint8Array(array))\n  }\n  return that\n}\n\nfunction fromArrayLike (that, array) {\n  var length = checked(array.length) | 0\n  that = allocate(that, length)\n  for (var i = 0; i < length; i += 1) {\n    that[i] = array[i] & 255\n  }\n  return that\n}\n\n// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.\n// Returns a zero-length buffer for inputs that don't conform to the spec.\nfunction fromJsonObject (that, object) {\n  var array\n  var length = 0\n\n  if (object.type === 'Buffer' && isArray(object.data)) {\n    array = object.data\n    length = checked(array.length) | 0\n  }\n  that = allocate(that, length)\n\n  for (var i = 0; i < length; i += 1) {\n    that[i] = array[i] & 255\n  }\n  return that\n}\n\nfunction allocate (that, length) {\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    // Return an augmented `Uint8Array` instance, for best performance\n    that = Buffer._augment(new Uint8Array(length))\n  } else {\n    // Fallback: Return an object instance of the Buffer class\n    that.length = length\n    that._isBuffer = true\n  }\n\n  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1\n  if (fromPool) that.parent = rootParent\n\n  return that\n}\n\nfunction checked (length) {\n  // Note: cannot use `length < kMaxLength` here because that fails when\n  // length is NaN (which is otherwise coerced to zero.)\n  if (length >= kMaxLength()) {\n    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +\n                         'size: 0x' + kMaxLength().toString(16) + ' bytes')\n  }\n  return length | 0\n}\n\nfunction SlowBuffer (subject, encoding) {\n  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)\n\n  var buf = new Buffer(subject, encoding)\n  delete buf.parent\n  return buf\n}\n\nBuffer.isBuffer = function isBuffer (b) {\n  return !!(b != null && b._isBuffer)\n}\n\nBuffer.compare = function compare (a, b) {\n  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {\n    throw new TypeError('Arguments must be Buffers')\n  }\n\n  if (a === b) return 0\n\n  var x = a.length\n  var y = b.length\n\n  var i = 0\n  var len = Math.min(x, y)\n  while (i < len) {\n    if (a[i] !== b[i]) break\n\n    ++i\n  }\n\n  if (i !== len) {\n    x = a[i]\n    y = b[i]\n  }\n\n  if (x < y) return -1\n  if (y < x) return 1\n  return 0\n}\n\nBuffer.isEncoding = function isEncoding (encoding) {\n  switch (String(encoding).toLowerCase()) {\n    case 'hex':\n    case 'utf8':\n    case 'utf-8':\n    case 'ascii':\n    case 'binary':\n    case 'base64':\n    case 'raw':\n    case 'ucs2':\n    case 'ucs-2':\n    case 'utf16le':\n    case 'utf-16le':\n      return true\n    default:\n      return false\n  }\n}\n\nBuffer.concat = function concat (list, length) {\n  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')\n\n  if (list.length === 0) {\n    return new Buffer(0)\n  }\n\n  var i\n  if (length === undefined) {\n    length = 0\n    for (i = 0; i < list.length; i++) {\n      length += list[i].length\n    }\n  }\n\n  var buf = new Buffer(length)\n  var pos = 0\n  for (i = 0; i < list.length; i++) {\n    var item = list[i]\n    item.copy(buf, pos)\n    pos += item.length\n  }\n  return buf\n}\n\nfunction byteLength (string, encoding) {\n  if (typeof string !== 'string') string = '' + string\n\n  var len = string.length\n  if (len === 0) return 0\n\n  // Use a for loop to avoid recursion\n  var loweredCase = false\n  for (;;) {\n    switch (encoding) {\n      case 'ascii':\n      case 'binary':\n      // Deprecated\n      case 'raw':\n      case 'raws':\n        return len\n      case 'utf8':\n      case 'utf-8':\n        return utf8ToBytes(string).length\n      case 'ucs2':\n      case 'ucs-2':\n      case 'utf16le':\n      case 'utf-16le':\n        return len * 2\n      case 'hex':\n        return len >>> 1\n      case 'base64':\n        return base64ToBytes(string).length\n      default:\n        if (loweredCase) return utf8ToBytes(string).length // assume utf8\n        encoding = ('' + encoding).toLowerCase()\n        loweredCase = true\n    }\n  }\n}\nBuffer.byteLength = byteLength\n\n// pre-set for values that may exist in the future\nBuffer.prototype.length = undefined\nBuffer.prototype.parent = undefined\n\nfunction slowToString (encoding, start, end) {\n  var loweredCase = false\n\n  start = start | 0\n  end = end === undefined || end === Infinity ? this.length : end | 0\n\n  if (!encoding) encoding = 'utf8'\n  if (start < 0) start = 0\n  if (end > this.length) end = this.length\n  if (end <= start) return ''\n\n  while (true) {\n    switch (encoding) {\n      case 'hex':\n        return hexSlice(this, start, end)\n\n      case 'utf8':\n      case 'utf-8':\n        return utf8Slice(this, start, end)\n\n      case 'ascii':\n        return asciiSlice(this, start, end)\n\n      case 'binary':\n        return binarySlice(this, start, end)\n\n      case 'base64':\n        return base64Slice(this, start, end)\n\n      case 'ucs2':\n      case 'ucs-2':\n      case 'utf16le':\n      case 'utf-16le':\n        return utf16leSlice(this, start, end)\n\n      default:\n        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)\n        encoding = (encoding + '').toLowerCase()\n        loweredCase = true\n    }\n  }\n}\n\nBuffer.prototype.toString = function toString () {\n  var length = this.length | 0\n  if (length === 0) return ''\n  if (arguments.length === 0) return utf8Slice(this, 0, length)\n  return slowToString.apply(this, arguments)\n}\n\nBuffer.prototype.equals = function equals (b) {\n  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')\n  if (this === b) return true\n  return Buffer.compare(this, b) === 0\n}\n\nBuffer.prototype.inspect = function inspect () {\n  var str = ''\n  var max = exports.INSPECT_MAX_BYTES\n  if (this.length > 0) {\n    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')\n    if (this.length > max) str += ' ... '\n  }\n  return '<Buffer ' + str + '>'\n}\n\nBuffer.prototype.compare = function compare (b) {\n  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')\n  if (this === b) return 0\n  return Buffer.compare(this, b)\n}\n\nBuffer.prototype.indexOf = function indexOf (val, byteOffset) {\n  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff\n  else if (byteOffset < -0x80000000) byteOffset = -0x80000000\n  byteOffset >>= 0\n\n  if (this.length === 0) return -1\n  if (byteOffset >= this.length) return -1\n\n  // Negative offsets start from the end of the buffer\n  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)\n\n  if (typeof val === 'string') {\n    if (val.length === 0) return -1 // special case: looking for empty string always fails\n    return String.prototype.indexOf.call(this, val, byteOffset)\n  }\n  if (Buffer.isBuffer(val)) {\n    return arrayIndexOf(this, val, byteOffset)\n  }\n  if (typeof val === 'number') {\n    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {\n      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)\n    }\n    return arrayIndexOf(this, [ val ], byteOffset)\n  }\n\n  function arrayIndexOf (arr, val, byteOffset) {\n    var foundIndex = -1\n    for (var i = 0; byteOffset + i < arr.length; i++) {\n      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {\n        if (foundIndex === -1) foundIndex = i\n        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex\n      } else {\n        foundIndex = -1\n      }\n    }\n    return -1\n  }\n\n  throw new TypeError('val must be string, number or Buffer')\n}\n\n// `get` is deprecated\nBuffer.prototype.get = function get (offset) {\n  console.log('.get() is deprecated. Access using array indexes instead.')\n  return this.readUInt8(offset)\n}\n\n// `set` is deprecated\nBuffer.prototype.set = function set (v, offset) {\n  console.log('.set() is deprecated. Access using array indexes instead.')\n  return this.writeUInt8(v, offset)\n}\n\nfunction hexWrite (buf, string, offset, length) {\n  offset = Number(offset) || 0\n  var remaining = buf.length - offset\n  if (!length) {\n    length = remaining\n  } else {\n    length = Number(length)\n    if (length > remaining) {\n      length = remaining\n    }\n  }\n\n  // must be an even number of digits\n  var strLen = string.length\n  if (strLen % 2 !== 0) throw new Error('Invalid hex string')\n\n  if (length > strLen / 2) {\n    length = strLen / 2\n  }\n  for (var i = 0; i < length; i++) {\n    var parsed = parseInt(string.substr(i * 2, 2), 16)\n    if (isNaN(parsed)) throw new Error('Invalid hex string')\n    buf[offset + i] = parsed\n  }\n  return i\n}\n\nfunction utf8Write (buf, string, offset, length) {\n  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)\n}\n\nfunction asciiWrite (buf, string, offset, length) {\n  return blitBuffer(asciiToBytes(string), buf, offset, length)\n}\n\nfunction binaryWrite (buf, string, offset, length) {\n  return asciiWrite(buf, string, offset, length)\n}\n\nfunction base64Write (buf, string, offset, length) {\n  return blitBuffer(base64ToBytes(string), buf, offset, length)\n}\n\nfunction ucs2Write (buf, string, offset, length) {\n  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)\n}\n\nBuffer.prototype.write = function write (string, offset, length, encoding) {\n  // Buffer#write(string)\n  if (offset === undefined) {\n    encoding = 'utf8'\n    length = this.length\n    offset = 0\n  // Buffer#write(string, encoding)\n  } else if (length === undefined && typeof offset === 'string') {\n    encoding = offset\n    length = this.length\n    offset = 0\n  // Buffer#write(string, offset[, length][, encoding])\n  } else if (isFinite(offset)) {\n    offset = offset | 0\n    if (isFinite(length)) {\n      length = length | 0\n      if (encoding === undefined) encoding = 'utf8'\n    } else {\n      encoding = length\n      length = undefined\n    }\n  // legacy write(string, encoding, offset, length) - remove in v0.13\n  } else {\n    var swap = encoding\n    encoding = offset\n    offset = length | 0\n    length = swap\n  }\n\n  var remaining = this.length - offset\n  if (length === undefined || length > remaining) length = remaining\n\n  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {\n    throw new RangeError('attempt to write outside buffer bounds')\n  }\n\n  if (!encoding) encoding = 'utf8'\n\n  var loweredCase = false\n  for (;;) {\n    switch (encoding) {\n      case 'hex':\n        return hexWrite(this, string, offset, length)\n\n      case 'utf8':\n      case 'utf-8':\n        return utf8Write(this, string, offset, length)\n\n      case 'ascii':\n        return asciiWrite(this, string, offset, length)\n\n      case 'binary':\n        return binaryWrite(this, string, offset, length)\n\n      case 'base64':\n        // Warning: maxLength not taken into account in base64Write\n        return base64Write(this, string, offset, length)\n\n      case 'ucs2':\n      case 'ucs-2':\n      case 'utf16le':\n      case 'utf-16le':\n        return ucs2Write(this, string, offset, length)\n\n      default:\n        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)\n        encoding = ('' + encoding).toLowerCase()\n        loweredCase = true\n    }\n  }\n}\n\nBuffer.prototype.toJSON = function toJSON () {\n  return {\n    type: 'Buffer',\n    data: Array.prototype.slice.call(this._arr || this, 0)\n  }\n}\n\nfunction base64Slice (buf, start, end) {\n  if (start === 0 && end === buf.length) {\n    return base64.fromByteArray(buf)\n  } else {\n    return base64.fromByteArray(buf.slice(start, end))\n  }\n}\n\nfunction utf8Slice (buf, start, end) {\n  end = Math.min(buf.length, end)\n  var res = []\n\n  var i = start\n  while (i < end) {\n    var firstByte = buf[i]\n    var codePoint = null\n    var bytesPerSequence = (firstByte > 0xEF) ? 4\n      : (firstByte > 0xDF) ? 3\n      : (firstByte > 0xBF) ? 2\n      : 1\n\n    if (i + bytesPerSequence <= end) {\n      var secondByte, thirdByte, fourthByte, tempCodePoint\n\n      switch (bytesPerSequence) {\n        case 1:\n          if (firstByte < 0x80) {\n            codePoint = firstByte\n          }\n          break\n        case 2:\n          secondByte = buf[i + 1]\n          if ((secondByte & 0xC0) === 0x80) {\n            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)\n            if (tempCodePoint > 0x7F) {\n              codePoint = tempCodePoint\n            }\n          }\n          break\n        case 3:\n          secondByte = buf[i + 1]\n          thirdByte = buf[i + 2]\n          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {\n            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)\n            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {\n              codePoint = tempCodePoint\n            }\n          }\n          break\n        case 4:\n          secondByte = buf[i + 1]\n          thirdByte = buf[i + 2]\n          fourthByte = buf[i + 3]\n          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {\n            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)\n            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {\n              codePoint = tempCodePoint\n            }\n          }\n      }\n    }\n\n    if (codePoint === null) {\n      // we did not generate a valid codePoint so insert a\n      // replacement char (U+FFFD) and advance only 1 byte\n      codePoint = 0xFFFD\n      bytesPerSequence = 1\n    } else if (codePoint > 0xFFFF) {\n      // encode to utf16 (surrogate pair dance)\n      codePoint -= 0x10000\n      res.push(codePoint >>> 10 & 0x3FF | 0xD800)\n      codePoint = 0xDC00 | codePoint & 0x3FF\n    }\n\n    res.push(codePoint)\n    i += bytesPerSequence\n  }\n\n  return decodeCodePointsArray(res)\n}\n\n// Based on http://stackoverflow.com/a/22747272/680742, the browser with\n// the lowest limit is Chrome, with 0x10000 args.\n// We go 1 magnitude less, for safety\nvar MAX_ARGUMENTS_LENGTH = 0x1000\n\nfunction decodeCodePointsArray (codePoints) {\n  var len = codePoints.length\n  if (len <= MAX_ARGUMENTS_LENGTH) {\n    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()\n  }\n\n  // Decode in chunks to avoid \"call stack size exceeded\".\n  var res = ''\n  var i = 0\n  while (i < len) {\n    res += String.fromCharCode.apply(\n      String,\n      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)\n    )\n  }\n  return res\n}\n\nfunction asciiSlice (buf, start, end) {\n  var ret = ''\n  end = Math.min(buf.length, end)\n\n  for (var i = start; i < end; i++) {\n    ret += String.fromCharCode(buf[i] & 0x7F)\n  }\n  return ret\n}\n\nfunction binarySlice (buf, start, end) {\n  var ret = ''\n  end = Math.min(buf.length, end)\n\n  for (var i = start; i < end; i++) {\n    ret += String.fromCharCode(buf[i])\n  }\n  return ret\n}\n\nfunction hexSlice (buf, start, end) {\n  var len = buf.length\n\n  if (!start || start < 0) start = 0\n  if (!end || end < 0 || end > len) end = len\n\n  var out = ''\n  for (var i = start; i < end; i++) {\n    out += toHex(buf[i])\n  }\n  return out\n}\n\nfunction utf16leSlice (buf, start, end) {\n  var bytes = buf.slice(start, end)\n  var res = ''\n  for (var i = 0; i < bytes.length; i += 2) {\n    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)\n  }\n  return res\n}\n\nBuffer.prototype.slice = function slice (start, end) {\n  var len = this.length\n  start = ~~start\n  end = end === undefined ? len : ~~end\n\n  if (start < 0) {\n    start += len\n    if (start < 0) start = 0\n  } else if (start > len) {\n    start = len\n  }\n\n  if (end < 0) {\n    end += len\n    if (end < 0) end = 0\n  } else if (end > len) {\n    end = len\n  }\n\n  if (end < start) end = start\n\n  var newBuf\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    newBuf = Buffer._augment(this.subarray(start, end))\n  } else {\n    var sliceLen = end - start\n    newBuf = new Buffer(sliceLen, undefined)\n    for (var i = 0; i < sliceLen; i++) {\n      newBuf[i] = this[i + start]\n    }\n  }\n\n  if (newBuf.length) newBuf.parent = this.parent || this\n\n  return newBuf\n}\n\n/*\n * Need to make sure that buffer isn't trying to write out of bounds.\n */\nfunction checkOffset (offset, ext, length) {\n  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')\n  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')\n}\n\nBuffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkOffset(offset, byteLength, this.length)\n\n  var val = this[offset]\n  var mul = 1\n  var i = 0\n  while (++i < byteLength && (mul *= 0x100)) {\n    val += this[offset + i] * mul\n  }\n\n  return val\n}\n\nBuffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) {\n    checkOffset(offset, byteLength, this.length)\n  }\n\n  var val = this[offset + --byteLength]\n  var mul = 1\n  while (byteLength > 0 && (mul *= 0x100)) {\n    val += this[offset + --byteLength] * mul\n  }\n\n  return val\n}\n\nBuffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 1, this.length)\n  return this[offset]\n}\n\nBuffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  return this[offset] | (this[offset + 1] << 8)\n}\n\nBuffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  return (this[offset] << 8) | this[offset + 1]\n}\n\nBuffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return ((this[offset]) |\n      (this[offset + 1] << 8) |\n      (this[offset + 2] << 16)) +\n      (this[offset + 3] * 0x1000000)\n}\n\nBuffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return (this[offset] * 0x1000000) +\n    ((this[offset + 1] << 16) |\n    (this[offset + 2] << 8) |\n    this[offset + 3])\n}\n\nBuffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkOffset(offset, byteLength, this.length)\n\n  var val = this[offset]\n  var mul = 1\n  var i = 0\n  while (++i < byteLength && (mul *= 0x100)) {\n    val += this[offset + i] * mul\n  }\n  mul *= 0x80\n\n  if (val >= mul) val -= Math.pow(2, 8 * byteLength)\n\n  return val\n}\n\nBuffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkOffset(offset, byteLength, this.length)\n\n  var i = byteLength\n  var mul = 1\n  var val = this[offset + --i]\n  while (i > 0 && (mul *= 0x100)) {\n    val += this[offset + --i] * mul\n  }\n  mul *= 0x80\n\n  if (val >= mul) val -= Math.pow(2, 8 * byteLength)\n\n  return val\n}\n\nBuffer.prototype.readInt8 = function readInt8 (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 1, this.length)\n  if (!(this[offset] & 0x80)) return (this[offset])\n  return ((0xff - this[offset] + 1) * -1)\n}\n\nBuffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  var val = this[offset] | (this[offset + 1] << 8)\n  return (val & 0x8000) ? val | 0xFFFF0000 : val\n}\n\nBuffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  var val = this[offset + 1] | (this[offset] << 8)\n  return (val & 0x8000) ? val | 0xFFFF0000 : val\n}\n\nBuffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return (this[offset]) |\n    (this[offset + 1] << 8) |\n    (this[offset + 2] << 16) |\n    (this[offset + 3] << 24)\n}\n\nBuffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return (this[offset] << 24) |\n    (this[offset + 1] << 16) |\n    (this[offset + 2] << 8) |\n    (this[offset + 3])\n}\n\nBuffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n  return ieee754.read(this, offset, true, 23, 4)\n}\n\nBuffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n  return ieee754.read(this, offset, false, 23, 4)\n}\n\nBuffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 8, this.length)\n  return ieee754.read(this, offset, true, 52, 8)\n}\n\nBuffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 8, this.length)\n  return ieee754.read(this, offset, false, 52, 8)\n}\n\nfunction checkInt (buf, value, offset, ext, max, min) {\n  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')\n  if (value > max || value < min) throw new RangeError('value is out of bounds')\n  if (offset + ext > buf.length) throw new RangeError('index out of range')\n}\n\nBuffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)\n\n  var mul = 1\n  var i = 0\n  this[offset] = value & 0xFF\n  while (++i < byteLength && (mul *= 0x100)) {\n    this[offset + i] = (value / mul) & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)\n\n  var i = byteLength - 1\n  var mul = 1\n  this[offset + i] = value & 0xFF\n  while (--i >= 0 && (mul *= 0x100)) {\n    this[offset + i] = (value / mul) & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)\n  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)\n  this[offset] = value\n  return offset + 1\n}\n\nfunction objectWriteUInt16 (buf, value, offset, littleEndian) {\n  if (value < 0) value = 0xffff + value + 1\n  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {\n    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>\n      (littleEndian ? i : 1 - i) * 8\n  }\n}\n\nBuffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = value\n    this[offset + 1] = (value >>> 8)\n  } else {\n    objectWriteUInt16(this, value, offset, true)\n  }\n  return offset + 2\n}\n\nBuffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 8)\n    this[offset + 1] = value\n  } else {\n    objectWriteUInt16(this, value, offset, false)\n  }\n  return offset + 2\n}\n\nfunction objectWriteUInt32 (buf, value, offset, littleEndian) {\n  if (value < 0) value = 0xffffffff + value + 1\n  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {\n    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff\n  }\n}\n\nBuffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset + 3] = (value >>> 24)\n    this[offset + 2] = (value >>> 16)\n    this[offset + 1] = (value >>> 8)\n    this[offset] = value\n  } else {\n    objectWriteUInt32(this, value, offset, true)\n  }\n  return offset + 4\n}\n\nBuffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 24)\n    this[offset + 1] = (value >>> 16)\n    this[offset + 2] = (value >>> 8)\n    this[offset + 3] = value\n  } else {\n    objectWriteUInt32(this, value, offset, false)\n  }\n  return offset + 4\n}\n\nBuffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) {\n    var limit = Math.pow(2, 8 * byteLength - 1)\n\n    checkInt(this, value, offset, byteLength, limit - 1, -limit)\n  }\n\n  var i = 0\n  var mul = 1\n  var sub = value < 0 ? 1 : 0\n  this[offset] = value & 0xFF\n  while (++i < byteLength && (mul *= 0x100)) {\n    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) {\n    var limit = Math.pow(2, 8 * byteLength - 1)\n\n    checkInt(this, value, offset, byteLength, limit - 1, -limit)\n  }\n\n  var i = byteLength - 1\n  var mul = 1\n  var sub = value < 0 ? 1 : 0\n  this[offset + i] = value & 0xFF\n  while (--i >= 0 && (mul *= 0x100)) {\n    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)\n  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)\n  if (value < 0) value = 0xff + value + 1\n  this[offset] = value\n  return offset + 1\n}\n\nBuffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = value\n    this[offset + 1] = (value >>> 8)\n  } else {\n    objectWriteUInt16(this, value, offset, true)\n  }\n  return offset + 2\n}\n\nBuffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 8)\n    this[offset + 1] = value\n  } else {\n    objectWriteUInt16(this, value, offset, false)\n  }\n  return offset + 2\n}\n\nBuffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = value\n    this[offset + 1] = (value >>> 8)\n    this[offset + 2] = (value >>> 16)\n    this[offset + 3] = (value >>> 24)\n  } else {\n    objectWriteUInt32(this, value, offset, true)\n  }\n  return offset + 4\n}\n\nBuffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)\n  if (value < 0) value = 0xffffffff + value + 1\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 24)\n    this[offset + 1] = (value >>> 16)\n    this[offset + 2] = (value >>> 8)\n    this[offset + 3] = value\n  } else {\n    objectWriteUInt32(this, value, offset, false)\n  }\n  return offset + 4\n}\n\nfunction checkIEEE754 (buf, value, offset, ext, max, min) {\n  if (value > max || value < min) throw new RangeError('value is out of bounds')\n  if (offset + ext > buf.length) throw new RangeError('index out of range')\n  if (offset < 0) throw new RangeError('index out of range')\n}\n\nfunction writeFloat (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)\n  }\n  ieee754.write(buf, value, offset, littleEndian, 23, 4)\n  return offset + 4\n}\n\nBuffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {\n  return writeFloat(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {\n  return writeFloat(this, value, offset, false, noAssert)\n}\n\nfunction writeDouble (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)\n  }\n  ieee754.write(buf, value, offset, littleEndian, 52, 8)\n  return offset + 8\n}\n\nBuffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {\n  return writeDouble(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {\n  return writeDouble(this, value, offset, false, noAssert)\n}\n\n// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)\nBuffer.prototype.copy = function copy (target, targetStart, start, end) {\n  if (!start) start = 0\n  if (!end && end !== 0) end = this.length\n  if (targetStart >= target.length) targetStart = target.length\n  if (!targetStart) targetStart = 0\n  if (end > 0 && end < start) end = start\n\n  // Copy 0 bytes; we're done\n  if (end === start) return 0\n  if (target.length === 0 || this.length === 0) return 0\n\n  // Fatal error conditions\n  if (targetStart < 0) {\n    throw new RangeError('targetStart out of bounds')\n  }\n  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')\n  if (end < 0) throw new RangeError('sourceEnd out of bounds')\n\n  // Are we oob?\n  if (end > this.length) end = this.length\n  if (target.length - targetStart < end - start) {\n    end = target.length - targetStart + start\n  }\n\n  var len = end - start\n  var i\n\n  if (this === target && start < targetStart && targetStart < end) {\n    // descending copy from end\n    for (i = len - 1; i >= 0; i--) {\n      target[i + targetStart] = this[i + start]\n    }\n  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {\n    // ascending copy from start\n    for (i = 0; i < len; i++) {\n      target[i + targetStart] = this[i + start]\n    }\n  } else {\n    target._set(this.subarray(start, start + len), targetStart)\n  }\n\n  return len\n}\n\n// fill(value, start=0, end=buffer.length)\nBuffer.prototype.fill = function fill (value, start, end) {\n  if (!value) value = 0\n  if (!start) start = 0\n  if (!end) end = this.length\n\n  if (end < start) throw new RangeError('end < start')\n\n  // Fill 0 bytes; we're done\n  if (end === start) return\n  if (this.length === 0) return\n\n  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')\n  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')\n\n  var i\n  if (typeof value === 'number') {\n    for (i = start; i < end; i++) {\n      this[i] = value\n    }\n  } else {\n    var bytes = utf8ToBytes(value.toString())\n    var len = bytes.length\n    for (i = start; i < end; i++) {\n      this[i] = bytes[i % len]\n    }\n  }\n\n  return this\n}\n\n/**\n * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.\n * Added in Node 0.12. Only available in browsers that support ArrayBuffer.\n */\nBuffer.prototype.toArrayBuffer = function toArrayBuffer () {\n  if (typeof Uint8Array !== 'undefined') {\n    if (Buffer.TYPED_ARRAY_SUPPORT) {\n      return (new Buffer(this)).buffer\n    } else {\n      var buf = new Uint8Array(this.length)\n      for (var i = 0, len = buf.length; i < len; i += 1) {\n        buf[i] = this[i]\n      }\n      return buf.buffer\n    }\n  } else {\n    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')\n  }\n}\n\n// HELPER FUNCTIONS\n// ================\n\nvar BP = Buffer.prototype\n\n/**\n * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods\n */\nBuffer._augment = function _augment (arr) {\n  arr.constructor = Buffer\n  arr._isBuffer = true\n\n  // save reference to original Uint8Array set method before overwriting\n  arr._set = arr.set\n\n  // deprecated\n  arr.get = BP.get\n  arr.set = BP.set\n\n  arr.write = BP.write\n  arr.toString = BP.toString\n  arr.toLocaleString = BP.toString\n  arr.toJSON = BP.toJSON\n  arr.equals = BP.equals\n  arr.compare = BP.compare\n  arr.indexOf = BP.indexOf\n  arr.copy = BP.copy\n  arr.slice = BP.slice\n  arr.readUIntLE = BP.readUIntLE\n  arr.readUIntBE = BP.readUIntBE\n  arr.readUInt8 = BP.readUInt8\n  arr.readUInt16LE = BP.readUInt16LE\n  arr.readUInt16BE = BP.readUInt16BE\n  arr.readUInt32LE = BP.readUInt32LE\n  arr.readUInt32BE = BP.readUInt32BE\n  arr.readIntLE = BP.readIntLE\n  arr.readIntBE = BP.readIntBE\n  arr.readInt8 = BP.readInt8\n  arr.readInt16LE = BP.readInt16LE\n  arr.readInt16BE = BP.readInt16BE\n  arr.readInt32LE = BP.readInt32LE\n  arr.readInt32BE = BP.readInt32BE\n  arr.readFloatLE = BP.readFloatLE\n  arr.readFloatBE = BP.readFloatBE\n  arr.readDoubleLE = BP.readDoubleLE\n  arr.readDoubleBE = BP.readDoubleBE\n  arr.writeUInt8 = BP.writeUInt8\n  arr.writeUIntLE = BP.writeUIntLE\n  arr.writeUIntBE = BP.writeUIntBE\n  arr.writeUInt16LE = BP.writeUInt16LE\n  arr.writeUInt16BE = BP.writeUInt16BE\n  arr.writeUInt32LE = BP.writeUInt32LE\n  arr.writeUInt32BE = BP.writeUInt32BE\n  arr.writeIntLE = BP.writeIntLE\n  arr.writeIntBE = BP.writeIntBE\n  arr.writeInt8 = BP.writeInt8\n  arr.writeInt16LE = BP.writeInt16LE\n  arr.writeInt16BE = BP.writeInt16BE\n  arr.writeInt32LE = BP.writeInt32LE\n  arr.writeInt32BE = BP.writeInt32BE\n  arr.writeFloatLE = BP.writeFloatLE\n  arr.writeFloatBE = BP.writeFloatBE\n  arr.writeDoubleLE = BP.writeDoubleLE\n  arr.writeDoubleBE = BP.writeDoubleBE\n  arr.fill = BP.fill\n  arr.inspect = BP.inspect\n  arr.toArrayBuffer = BP.toArrayBuffer\n\n  return arr\n}\n\nvar INVALID_BASE64_RE = /[^+\\/0-9A-Za-z-_]/g\n\nfunction base64clean (str) {\n  // Node strips out invalid characters like \\n and \\t from the string, base64-js does not\n  str = stringtrim(str).replace(INVALID_BASE64_RE, '')\n  // Node converts strings with length < 2 to ''\n  if (str.length < 2) return ''\n  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not\n  while (str.length % 4 !== 0) {\n    str = str + '='\n  }\n  return str\n}\n\nfunction stringtrim (str) {\n  if (str.trim) return str.trim()\n  return str.replace(/^\\s+|\\s+$/g, '')\n}\n\nfunction toHex (n) {\n  if (n < 16) return '0' + n.toString(16)\n  return n.toString(16)\n}\n\nfunction utf8ToBytes (string, units) {\n  units = units || Infinity\n  var codePoint\n  var length = string.length\n  var leadSurrogate = null\n  var bytes = []\n\n  for (var i = 0; i < length; i++) {\n    codePoint = string.charCodeAt(i)\n\n    // is surrogate component\n    if (codePoint > 0xD7FF && codePoint < 0xE000) {\n      // last char was a lead\n      if (!leadSurrogate) {\n        // no lead yet\n        if (codePoint > 0xDBFF) {\n          // unexpected trail\n          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n          continue\n        } else if (i + 1 === length) {\n          // unpaired lead\n          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n          continue\n        }\n\n        // valid lead\n        leadSurrogate = codePoint\n\n        continue\n      }\n\n      // 2 leads in a row\n      if (codePoint < 0xDC00) {\n        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n        leadSurrogate = codePoint\n        continue\n      }\n\n      // valid surrogate pair\n      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000\n    } else if (leadSurrogate) {\n      // valid bmp char, but last char was a lead\n      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n    }\n\n    leadSurrogate = null\n\n    // encode utf8\n    if (codePoint < 0x80) {\n      if ((units -= 1) < 0) break\n      bytes.push(codePoint)\n    } else if (codePoint < 0x800) {\n      if ((units -= 2) < 0) break\n      bytes.push(\n        codePoint >> 0x6 | 0xC0,\n        codePoint & 0x3F | 0x80\n      )\n    } else if (codePoint < 0x10000) {\n      if ((units -= 3) < 0) break\n      bytes.push(\n        codePoint >> 0xC | 0xE0,\n        codePoint >> 0x6 & 0x3F | 0x80,\n        codePoint & 0x3F | 0x80\n      )\n    } else if (codePoint < 0x110000) {\n      if ((units -= 4) < 0) break\n      bytes.push(\n        codePoint >> 0x12 | 0xF0,\n        codePoint >> 0xC & 0x3F | 0x80,\n        codePoint >> 0x6 & 0x3F | 0x80,\n        codePoint & 0x3F | 0x80\n      )\n    } else {\n      throw new Error('Invalid code point')\n    }\n  }\n\n  return bytes\n}\n\nfunction asciiToBytes (str) {\n  var byteArray = []\n  for (var i = 0; i < str.length; i++) {\n    // Node's code seems to be doing this and not & 0x7F..\n    byteArray.push(str.charCodeAt(i) & 0xFF)\n  }\n  return byteArray\n}\n\nfunction utf16leToBytes (str, units) {\n  var c, hi, lo\n  var byteArray = []\n  for (var i = 0; i < str.length; i++) {\n    if ((units -= 2) < 0) break\n\n    c = str.charCodeAt(i)\n    hi = c >> 8\n    lo = c % 256\n    byteArray.push(lo)\n    byteArray.push(hi)\n  }\n\n  return byteArray\n}\n\nfunction base64ToBytes (str) {\n  return base64.toByteArray(base64clean(str))\n}\n\nfunction blitBuffer (src, dst, offset, length) {\n  for (var i = 0; i < length; i++) {\n    if ((i + offset >= dst.length) || (i >= src.length)) break\n    dst[i + offset] = src[i]\n  }\n  return i\n}\n\n},{\"base64-js\":44,\"ieee754\":45,\"is-array\":46}],44:[function(require,module,exports){\nvar lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';\n\n;(function (exports) {\n\t'use strict';\n\n  var Arr = (typeof Uint8Array !== 'undefined')\n    ? Uint8Array\n    : Array\n\n\tvar PLUS   = '+'.charCodeAt(0)\n\tvar SLASH  = '/'.charCodeAt(0)\n\tvar NUMBER = '0'.charCodeAt(0)\n\tvar LOWER  = 'a'.charCodeAt(0)\n\tvar UPPER  = 'A'.charCodeAt(0)\n\tvar PLUS_URL_SAFE = '-'.charCodeAt(0)\n\tvar SLASH_URL_SAFE = '_'.charCodeAt(0)\n\n\tfunction decode (elt) {\n\t\tvar code = elt.charCodeAt(0)\n\t\tif (code === PLUS ||\n\t\t    code === PLUS_URL_SAFE)\n\t\t\treturn 62 // '+'\n\t\tif (code === SLASH ||\n\t\t    code === SLASH_URL_SAFE)\n\t\t\treturn 63 // '/'\n\t\tif (code < NUMBER)\n\t\t\treturn -1 //no match\n\t\tif (code < NUMBER + 10)\n\t\t\treturn code - NUMBER + 26 + 26\n\t\tif (code < UPPER + 26)\n\t\t\treturn code - UPPER\n\t\tif (code < LOWER + 26)\n\t\t\treturn code - LOWER + 26\n\t}\n\n\tfunction b64ToByteArray (b64) {\n\t\tvar i, j, l, tmp, placeHolders, arr\n\n\t\tif (b64.length % 4 > 0) {\n\t\t\tthrow new Error('Invalid string. Length must be a multiple of 4')\n\t\t}\n\n\t\t// the number of equal signs (place holders)\n\t\t// if there are two placeholders, than the two characters before it\n\t\t// represent one byte\n\t\t// if there is only one, then the three characters before it represent 2 bytes\n\t\t// this is just a cheap hack to not do indexOf twice\n\t\tvar len = b64.length\n\t\tplaceHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0\n\n\t\t// base64 is 4/3 + up to two characters of the original data\n\t\tarr = new Arr(b64.length * 3 / 4 - placeHolders)\n\n\t\t// if there are placeholders, only get up to the last complete 4 chars\n\t\tl = placeHolders > 0 ? b64.length - 4 : b64.length\n\n\t\tvar L = 0\n\n\t\tfunction push (v) {\n\t\t\tarr[L++] = v\n\t\t}\n\n\t\tfor (i = 0, j = 0; i < l; i += 4, j += 3) {\n\t\t\ttmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))\n\t\t\tpush((tmp & 0xFF0000) >> 16)\n\t\t\tpush((tmp & 0xFF00) >> 8)\n\t\t\tpush(tmp & 0xFF)\n\t\t}\n\n\t\tif (placeHolders === 2) {\n\t\t\ttmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)\n\t\t\tpush(tmp & 0xFF)\n\t\t} else if (placeHolders === 1) {\n\t\t\ttmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)\n\t\t\tpush((tmp >> 8) & 0xFF)\n\t\t\tpush(tmp & 0xFF)\n\t\t}\n\n\t\treturn arr\n\t}\n\n\tfunction uint8ToBase64 (uint8) {\n\t\tvar i,\n\t\t\textraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes\n\t\t\toutput = \"\",\n\t\t\ttemp, length\n\n\t\tfunction encode (num) {\n\t\t\treturn lookup.charAt(num)\n\t\t}\n\n\t\tfunction tripletToBase64 (num) {\n\t\t\treturn encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)\n\t\t}\n\n\t\t// go through the array every three bytes, we'll deal with trailing stuff later\n\t\tfor (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {\n\t\t\ttemp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])\n\t\t\toutput += tripletToBase64(temp)\n\t\t}\n\n\t\t// pad the end with zeros, but make sure to not forget the extra bytes\n\t\tswitch (extraBytes) {\n\t\t\tcase 1:\n\t\t\t\ttemp = uint8[uint8.length - 1]\n\t\t\t\toutput += encode(temp >> 2)\n\t\t\t\toutput += encode((temp << 4) & 0x3F)\n\t\t\t\toutput += '=='\n\t\t\t\tbreak\n\t\t\tcase 2:\n\t\t\t\ttemp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])\n\t\t\t\toutput += encode(temp >> 10)\n\t\t\t\toutput += encode((temp >> 4) & 0x3F)\n\t\t\t\toutput += encode((temp << 2) & 0x3F)\n\t\t\t\toutput += '='\n\t\t\t\tbreak\n\t\t}\n\n\t\treturn output\n\t}\n\n\texports.toByteArray = b64ToByteArray\n\texports.fromByteArray = uint8ToBase64\n}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))\n\n},{}],45:[function(require,module,exports){\nexports.read = function (buffer, offset, isLE, mLen, nBytes) {\n  var e, m\n  var eLen = nBytes * 8 - mLen - 1\n  var eMax = (1 << eLen) - 1\n  var eBias = eMax >> 1\n  var nBits = -7\n  var i = isLE ? (nBytes - 1) : 0\n  var d = isLE ? -1 : 1\n  var s = buffer[offset + i]\n\n  i += d\n\n  e = s & ((1 << (-nBits)) - 1)\n  s >>= (-nBits)\n  nBits += eLen\n  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}\n\n  m = e & ((1 << (-nBits)) - 1)\n  e >>= (-nBits)\n  nBits += mLen\n  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}\n\n  if (e === 0) {\n    e = 1 - eBias\n  } else if (e === eMax) {\n    return m ? NaN : ((s ? -1 : 1) * Infinity)\n  } else {\n    m = m + Math.pow(2, mLen)\n    e = e - eBias\n  }\n  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)\n}\n\nexports.write = function (buffer, value, offset, isLE, mLen, nBytes) {\n  var e, m, c\n  var eLen = nBytes * 8 - mLen - 1\n  var eMax = (1 << eLen) - 1\n  var eBias = eMax >> 1\n  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)\n  var i = isLE ? 0 : (nBytes - 1)\n  var d = isLE ? 1 : -1\n  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0\n\n  value = Math.abs(value)\n\n  if (isNaN(value) || value === Infinity) {\n    m = isNaN(value) ? 1 : 0\n    e = eMax\n  } else {\n    e = Math.floor(Math.log(value) / Math.LN2)\n    if (value * (c = Math.pow(2, -e)) < 1) {\n      e--\n      c *= 2\n    }\n    if (e + eBias >= 1) {\n      value += rt / c\n    } else {\n      value += rt * Math.pow(2, 1 - eBias)\n    }\n    if (value * c >= 2) {\n      e++\n      c /= 2\n    }\n\n    if (e + eBias >= eMax) {\n      m = 0\n      e = eMax\n    } else if (e + eBias >= 1) {\n      m = (value * c - 1) * Math.pow(2, mLen)\n      e = e + eBias\n    } else {\n      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)\n      e = 0\n    }\n  }\n\n  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}\n\n  e = (e << mLen) | m\n  eLen += mLen\n  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}\n\n  buffer[offset + i - d] |= s * 128\n}\n\n},{}],46:[function(require,module,exports){\n\n/**\n * isArray\n */\n\nvar isArray = Array.isArray;\n\n/**\n * toString\n */\n\nvar str = Object.prototype.toString;\n\n/**\n * Whether or not the given `val`\n * is an array.\n *\n * example:\n *\n *        isArray([]);\n *        // > true\n *        isArray(arguments);\n *        // > false\n *        isArray('');\n *        // > false\n *\n * @param {mixed} val\n * @return {bool}\n */\n\nmodule.exports = isArray || function (val) {\n  return !! val && '[object Array]' == str.call(val);\n};\n\n},{}],47:[function(require,module,exports){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nfunction EventEmitter() {\n  this._events = this._events || {};\n  this._maxListeners = this._maxListeners || undefined;\n}\nmodule.exports = EventEmitter;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nEventEmitter.defaultMaxListeners = 10;\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function(n) {\n  if (!isNumber(n) || n < 0 || isNaN(n))\n    throw TypeError('n must be a positive number');\n  this._maxListeners = n;\n  return this;\n};\n\nEventEmitter.prototype.emit = function(type) {\n  var er, handler, len, args, i, listeners;\n\n  if (!this._events)\n    this._events = {};\n\n  // If there is no 'error' event listener then throw.\n  if (type === 'error') {\n    if (!this._events.error ||\n        (isObject(this._events.error) && !this._events.error.length)) {\n      er = arguments[1];\n      if (er instanceof Error) {\n        throw er; // Unhandled 'error' event\n      }\n      throw TypeError('Uncaught, unspecified \"error\" event.');\n    }\n  }\n\n  handler = this._events[type];\n\n  if (isUndefined(handler))\n    return false;\n\n  if (isFunction(handler)) {\n    switch (arguments.length) {\n      // fast cases\n      case 1:\n        handler.call(this);\n        break;\n      case 2:\n        handler.call(this, arguments[1]);\n        break;\n      case 3:\n        handler.call(this, arguments[1], arguments[2]);\n        break;\n      // slower\n      default:\n        len = arguments.length;\n        args = new Array(len - 1);\n        for (i = 1; i < len; i++)\n          args[i - 1] = arguments[i];\n        handler.apply(this, args);\n    }\n  } else if (isObject(handler)) {\n    len = arguments.length;\n    args = new Array(len - 1);\n    for (i = 1; i < len; i++)\n      args[i - 1] = arguments[i];\n\n    listeners = handler.slice();\n    len = listeners.length;\n    for (i = 0; i < len; i++)\n      listeners[i].apply(this, args);\n  }\n\n  return true;\n};\n\nEventEmitter.prototype.addListener = function(type, listener) {\n  var m;\n\n  if (!isFunction(listener))\n    throw TypeError('listener must be a function');\n\n  if (!this._events)\n    this._events = {};\n\n  // To avoid recursion in the case that type === \"newListener\"! Before\n  // adding it to the listeners, first emit \"newListener\".\n  if (this._events.newListener)\n    this.emit('newListener', type,\n              isFunction(listener.listener) ?\n              listener.listener : listener);\n\n  if (!this._events[type])\n    // Optimize the case of one listener. Don't need the extra array object.\n    this._events[type] = listener;\n  else if (isObject(this._events[type]))\n    // If we've already got an array, just append.\n    this._events[type].push(listener);\n  else\n    // Adding the second element, need to change to array.\n    this._events[type] = [this._events[type], listener];\n\n  // Check for listener leak\n  if (isObject(this._events[type]) && !this._events[type].warned) {\n    var m;\n    if (!isUndefined(this._maxListeners)) {\n      m = this._maxListeners;\n    } else {\n      m = EventEmitter.defaultMaxListeners;\n    }\n\n    if (m && m > 0 && this._events[type].length > m) {\n      this._events[type].warned = true;\n      console.error('(node) warning: possible EventEmitter memory ' +\n                    'leak detected. %d listeners added. ' +\n                    'Use emitter.setMaxListeners() to increase limit.',\n                    this._events[type].length);\n      if (typeof console.trace === 'function') {\n        // not supported in IE 10\n        console.trace();\n      }\n    }\n  }\n\n  return this;\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.once = function(type, listener) {\n  if (!isFunction(listener))\n    throw TypeError('listener must be a function');\n\n  var fired = false;\n\n  function g() {\n    this.removeListener(type, g);\n\n    if (!fired) {\n      fired = true;\n      listener.apply(this, arguments);\n    }\n  }\n\n  g.listener = listener;\n  this.on(type, g);\n\n  return this;\n};\n\n// emits a 'removeListener' event iff the listener was removed\nEventEmitter.prototype.removeListener = function(type, listener) {\n  var list, position, length, i;\n\n  if (!isFunction(listener))\n    throw TypeError('listener must be a function');\n\n  if (!this._events || !this._events[type])\n    return this;\n\n  list = this._events[type];\n  length = list.length;\n  position = -1;\n\n  if (list === listener ||\n      (isFunction(list.listener) && list.listener === listener)) {\n    delete this._events[type];\n    if (this._events.removeListener)\n      this.emit('removeListener', type, listener);\n\n  } else if (isObject(list)) {\n    for (i = length; i-- > 0;) {\n      if (list[i] === listener ||\n          (list[i].listener && list[i].listener === listener)) {\n        position = i;\n        break;\n      }\n    }\n\n    if (position < 0)\n      return this;\n\n    if (list.length === 1) {\n      list.length = 0;\n      delete this._events[type];\n    } else {\n      list.splice(position, 1);\n    }\n\n    if (this._events.removeListener)\n      this.emit('removeListener', type, listener);\n  }\n\n  return this;\n};\n\nEventEmitter.prototype.removeAllListeners = function(type) {\n  var key, listeners;\n\n  if (!this._events)\n    return this;\n\n  // not listening for removeListener, no need to emit\n  if (!this._events.removeListener) {\n    if (arguments.length === 0)\n      this._events = {};\n    else if (this._events[type])\n      delete this._events[type];\n    return this;\n  }\n\n  // emit removeListener for all listeners on all events\n  if (arguments.length === 0) {\n    for (key in this._events) {\n      if (key === 'removeListener') continue;\n      this.removeAllListeners(key);\n    }\n    this.removeAllListeners('removeListener');\n    this._events = {};\n    return this;\n  }\n\n  listeners = this._events[type];\n\n  if (isFunction(listeners)) {\n    this.removeListener(type, listeners);\n  } else {\n    // LIFO order\n    while (listeners.length)\n      this.removeListener(type, listeners[listeners.length - 1]);\n  }\n  delete this._events[type];\n\n  return this;\n};\n\nEventEmitter.prototype.listeners = function(type) {\n  var ret;\n  if (!this._events || !this._events[type])\n    ret = [];\n  else if (isFunction(this._events[type]))\n    ret = [this._events[type]];\n  else\n    ret = this._events[type].slice();\n  return ret;\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  var ret;\n  if (!emitter._events || !emitter._events[type])\n    ret = 0;\n  else if (isFunction(emitter._events[type]))\n    ret = 1;\n  else\n    ret = emitter._events[type].length;\n  return ret;\n};\n\nfunction isFunction(arg) {\n  return typeof arg === 'function';\n}\n\nfunction isNumber(arg) {\n  return typeof arg === 'number';\n}\n\nfunction isObject(arg) {\n  return typeof arg === 'object' && arg !== null;\n}\n\nfunction isUndefined(arg) {\n  return arg === void 0;\n}\n\n},{}],48:[function(require,module,exports){\nif (typeof Object.create === 'function') {\n  // implementation from standard node.js 'util' module\n  module.exports = function inherits(ctor, superCtor) {\n    ctor.super_ = superCtor\n    ctor.prototype = Object.create(superCtor.prototype, {\n      constructor: {\n        value: ctor,\n        enumerable: false,\n        writable: true,\n        configurable: true\n      }\n    });\n  };\n} else {\n  // old school shim for old browsers\n  module.exports = function inherits(ctor, superCtor) {\n    ctor.super_ = superCtor\n    var TempCtor = function () {}\n    TempCtor.prototype = superCtor.prototype\n    ctor.prototype = new TempCtor()\n    ctor.prototype.constructor = ctor\n  }\n}\n\n},{}],49:[function(require,module,exports){\nmodule.exports = Array.isArray || function (arr) {\n  return Object.prototype.toString.call(arr) == '[object Array]';\n};\n\n},{}],50:[function(require,module,exports){\nexports.endianness = function () { return 'LE' };\n\nexports.hostname = function () {\n    if (typeof location !== 'undefined') {\n        return location.hostname\n    }\n    else return '';\n};\n\nexports.loadavg = function () { return [] };\n\nexports.uptime = function () { return 0 };\n\nexports.freemem = function () {\n    return Number.MAX_VALUE;\n};\n\nexports.totalmem = function () {\n    return Number.MAX_VALUE;\n};\n\nexports.cpus = function () { return [] };\n\nexports.type = function () { return 'Browser' };\n\nexports.release = function () {\n    if (typeof navigator !== 'undefined') {\n        return navigator.appVersion;\n    }\n    return '';\n};\n\nexports.networkInterfaces\n= exports.getNetworkInterfaces\n= function () { return {} };\n\nexports.arch = function () { return 'javascript' };\n\nexports.platform = function () { return 'browser' };\n\nexports.tmpdir = exports.tmpDir = function () {\n    return '/tmp';\n};\n\nexports.EOL = '\\n';\n\n},{}],51:[function(require,module,exports){\n// shim for using process in browser\n\nvar process = module.exports = {};\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = setTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    clearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        setTimeout(drainQueue, 0);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n},{}],52:[function(require,module,exports){\nmodule.exports = require(\"./lib/_stream_duplex.js\")\n\n},{\"./lib/_stream_duplex.js\":53}],53:[function(require,module,exports){\n(function (process){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// a duplex stream is just a stream that is both readable and writable.\n// Since JS doesn't have multiple prototypal inheritance, this class\n// prototypally inherits from Readable, and then parasitically from\n// Writable.\n\nmodule.exports = Duplex;\n\n/*<replacement>*/\nvar objectKeys = Object.keys || function (obj) {\n  var keys = [];\n  for (var key in obj) keys.push(key);\n  return keys;\n}\n/*</replacement>*/\n\n\n/*<replacement>*/\nvar util = require('core-util-is');\nutil.inherits = require('inherits');\n/*</replacement>*/\n\nvar Readable = require('./_stream_readable');\nvar Writable = require('./_stream_writable');\n\nutil.inherits(Duplex, Readable);\n\nforEach(objectKeys(Writable.prototype), function(method) {\n  if (!Duplex.prototype[method])\n    Duplex.prototype[method] = Writable.prototype[method];\n});\n\nfunction Duplex(options) {\n  if (!(this instanceof Duplex))\n    return new Duplex(options);\n\n  Readable.call(this, options);\n  Writable.call(this, options);\n\n  if (options && options.readable === false)\n    this.readable = false;\n\n  if (options && options.writable === false)\n    this.writable = false;\n\n  this.allowHalfOpen = true;\n  if (options && options.allowHalfOpen === false)\n    this.allowHalfOpen = false;\n\n  this.once('end', onend);\n}\n\n// the no-half-open enforcer\nfunction onend() {\n  // if we allow half-open state, or if the writable side ended,\n  // then we're ok.\n  if (this.allowHalfOpen || this._writableState.ended)\n    return;\n\n  // no more data can be written.\n  // But allow more writes to happen in this tick.\n  process.nextTick(this.end.bind(this));\n}\n\nfunction forEach (xs, f) {\n  for (var i = 0, l = xs.length; i < l; i++) {\n    f(xs[i], i);\n  }\n}\n\n}).call(this,require('_process'))\n},{\"./_stream_readable\":55,\"./_stream_writable\":57,\"_process\":51,\"core-util-is\":58,\"inherits\":48}],54:[function(require,module,exports){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// a passthrough stream.\n// basically just the most minimal sort of Transform stream.\n// Every written chunk gets output as-is.\n\nmodule.exports = PassThrough;\n\nvar Transform = require('./_stream_transform');\n\n/*<replacement>*/\nvar util = require('core-util-is');\nutil.inherits = require('inherits');\n/*</replacement>*/\n\nutil.inherits(PassThrough, Transform);\n\nfunction PassThrough(options) {\n  if (!(this instanceof PassThrough))\n    return new PassThrough(options);\n\n  Transform.call(this, options);\n}\n\nPassThrough.prototype._transform = function(chunk, encoding, cb) {\n  cb(null, chunk);\n};\n\n},{\"./_stream_transform\":56,\"core-util-is\":58,\"inherits\":48}],55:[function(require,module,exports){\n(function (process){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nmodule.exports = Readable;\n\n/*<replacement>*/\nvar isArray = require('isarray');\n/*</replacement>*/\n\n\n/*<replacement>*/\nvar Buffer = require('buffer').Buffer;\n/*</replacement>*/\n\nReadable.ReadableState = ReadableState;\n\nvar EE = require('events').EventEmitter;\n\n/*<replacement>*/\nif (!EE.listenerCount) EE.listenerCount = function(emitter, type) {\n  return emitter.listeners(type).length;\n};\n/*</replacement>*/\n\nvar Stream = require('stream');\n\n/*<replacement>*/\nvar util = require('core-util-is');\nutil.inherits = require('inherits');\n/*</replacement>*/\n\nvar StringDecoder;\n\n\n/*<replacement>*/\nvar debug = require('util');\nif (debug && debug.debuglog) {\n  debug = debug.debuglog('stream');\n} else {\n  debug = function () {};\n}\n/*</replacement>*/\n\n\nutil.inherits(Readable, Stream);\n\nfunction ReadableState(options, stream) {\n  var Duplex = require('./_stream_duplex');\n\n  options = options || {};\n\n  // the point at which it stops calling _read() to fill the buffer\n  // Note: 0 is a valid value, means \"don't call _read preemptively ever\"\n  var hwm = options.highWaterMark;\n  var defaultHwm = options.objectMode ? 16 : 16 * 1024;\n  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;\n\n  // cast to ints.\n  this.highWaterMark = ~~this.highWaterMark;\n\n  this.buffer = [];\n  this.length = 0;\n  this.pipes = null;\n  this.pipesCount = 0;\n  this.flowing = null;\n  this.ended = false;\n  this.endEmitted = false;\n  this.reading = false;\n\n  // a flag to be able to tell if the onwrite cb is called immediately,\n  // or on a later tick.  We set this to true at first, because any\n  // actions that shouldn't happen until \"later\" should generally also\n  // not happen before the first write call.\n  this.sync = true;\n\n  // whenever we return null, then we set a flag to say\n  // that we're awaiting a 'readable' event emission.\n  this.needReadable = false;\n  this.emittedReadable = false;\n  this.readableListening = false;\n\n\n  // object stream flag. Used to make read(n) ignore n and to\n  // make all the buffer merging and length checks go away\n  this.objectMode = !!options.objectMode;\n\n  if (stream instanceof Duplex)\n    this.objectMode = this.objectMode || !!options.readableObjectMode;\n\n  // Crypto is kind of old and crusty.  Historically, its default string\n  // encoding is 'binary' so we have to make this configurable.\n  // Everything else in the universe uses 'utf8', though.\n  this.defaultEncoding = options.defaultEncoding || 'utf8';\n\n  // when piping, we only care about 'readable' events that happen\n  // after read()ing all the bytes and not getting any pushback.\n  this.ranOut = false;\n\n  // the number of writers that are awaiting a drain event in .pipe()s\n  this.awaitDrain = 0;\n\n  // if true, a maybeReadMore has been scheduled\n  this.readingMore = false;\n\n  this.decoder = null;\n  this.encoding = null;\n  if (options.encoding) {\n    if (!StringDecoder)\n      StringDecoder = require('string_decoder/').StringDecoder;\n    this.decoder = new StringDecoder(options.encoding);\n    this.encoding = options.encoding;\n  }\n}\n\nfunction Readable(options) {\n  var Duplex = require('./_stream_duplex');\n\n  if (!(this instanceof Readable))\n    return new Readable(options);\n\n  this._readableState = new ReadableState(options, this);\n\n  // legacy\n  this.readable = true;\n\n  Stream.call(this);\n}\n\n// Manually shove something into the read() buffer.\n// This returns true if the highWaterMark has not been hit yet,\n// similar to how Writable.write() returns true if you should\n// write() some more.\nReadable.prototype.push = function(chunk, encoding) {\n  var state = this._readableState;\n\n  if (util.isString(chunk) && !state.objectMode) {\n    encoding = encoding || state.defaultEncoding;\n    if (encoding !== state.encoding) {\n      chunk = new Buffer(chunk, encoding);\n      encoding = '';\n    }\n  }\n\n  return readableAddChunk(this, state, chunk, encoding, false);\n};\n\n// Unshift should *always* be something directly out of read()\nReadable.prototype.unshift = function(chunk) {\n  var state = this._readableState;\n  return readableAddChunk(this, state, chunk, '', true);\n};\n\nfunction readableAddChunk(stream, state, chunk, encoding, addToFront) {\n  var er = chunkInvalid(state, chunk);\n  if (er) {\n    stream.emit('error', er);\n  } else if (util.isNullOrUndefined(chunk)) {\n    state.reading = false;\n    if (!state.ended)\n      onEofChunk(stream, state);\n  } else if (state.objectMode || chunk && chunk.length > 0) {\n    if (state.ended && !addToFront) {\n      var e = new Error('stream.push() after EOF');\n      stream.emit('error', e);\n    } else if (state.endEmitted && addToFront) {\n      var e = new Error('stream.unshift() after end event');\n      stream.emit('error', e);\n    } else {\n      if (state.decoder && !addToFront && !encoding)\n        chunk = state.decoder.write(chunk);\n\n      if (!addToFront)\n        state.reading = false;\n\n      // if we want the data now, just emit it.\n      if (state.flowing && state.length === 0 && !state.sync) {\n        stream.emit('data', chunk);\n        stream.read(0);\n      } else {\n        // update the buffer info.\n        state.length += state.objectMode ? 1 : chunk.length;\n        if (addToFront)\n          state.buffer.unshift(chunk);\n        else\n          state.buffer.push(chunk);\n\n        if (state.needReadable)\n          emitReadable(stream);\n      }\n\n      maybeReadMore(stream, state);\n    }\n  } else if (!addToFront) {\n    state.reading = false;\n  }\n\n  return needMoreData(state);\n}\n\n\n\n// if it's past the high water mark, we can push in some more.\n// Also, if we have no data yet, we can stand some\n// more bytes.  This is to work around cases where hwm=0,\n// such as the repl.  Also, if the push() triggered a\n// readable event, and the user called read(largeNumber) such that\n// needReadable was set, then we ought to push more, so that another\n// 'readable' event will be triggered.\nfunction needMoreData(state) {\n  return !state.ended &&\n         (state.needReadable ||\n          state.length < state.highWaterMark ||\n          state.length === 0);\n}\n\n// backwards compatibility.\nReadable.prototype.setEncoding = function(enc) {\n  if (!StringDecoder)\n    StringDecoder = require('string_decoder/').StringDecoder;\n  this._readableState.decoder = new StringDecoder(enc);\n  this._readableState.encoding = enc;\n  return this;\n};\n\n// Don't raise the hwm > 128MB\nvar MAX_HWM = 0x800000;\nfunction roundUpToNextPowerOf2(n) {\n  if (n >= MAX_HWM) {\n    n = MAX_HWM;\n  } else {\n    // Get the next highest power of 2\n    n--;\n    for (var p = 1; p < 32; p <<= 1) n |= n >> p;\n    n++;\n  }\n  return n;\n}\n\nfunction howMuchToRead(n, state) {\n  if (state.length === 0 && state.ended)\n    return 0;\n\n  if (state.objectMode)\n    return n === 0 ? 0 : 1;\n\n  if (isNaN(n) || util.isNull(n)) {\n    // only flow one buffer at a time\n    if (state.flowing && state.buffer.length)\n      return state.buffer[0].length;\n    else\n      return state.length;\n  }\n\n  if (n <= 0)\n    return 0;\n\n  // If we're asking for more than the target buffer level,\n  // then raise the water mark.  Bump up to the next highest\n  // power of 2, to prevent increasing it excessively in tiny\n  // amounts.\n  if (n > state.highWaterMark)\n    state.highWaterMark = roundUpToNextPowerOf2(n);\n\n  // don't have that much.  return null, unless we've ended.\n  if (n > state.length) {\n    if (!state.ended) {\n      state.needReadable = true;\n      return 0;\n    } else\n      return state.length;\n  }\n\n  return n;\n}\n\n// you can override either this method, or the async _read(n) below.\nReadable.prototype.read = function(n) {\n  debug('read', n);\n  var state = this._readableState;\n  var nOrig = n;\n\n  if (!util.isNumber(n) || n > 0)\n    state.emittedReadable = false;\n\n  // if we're doing read(0) to trigger a readable event, but we\n  // already have a bunch of data in the buffer, then just trigger\n  // the 'readable' event and move on.\n  if (n === 0 &&\n      state.needReadable &&\n      (state.length >= state.highWaterMark || state.ended)) {\n    debug('read: emitReadable', state.length, state.ended);\n    if (state.length === 0 && state.ended)\n      endReadable(this);\n    else\n      emitReadable(this);\n    return null;\n  }\n\n  n = howMuchToRead(n, state);\n\n  // if we've ended, and we're now clear, then finish it up.\n  if (n === 0 && state.ended) {\n    if (state.length === 0)\n      endReadable(this);\n    return null;\n  }\n\n  // All the actual chunk generation logic needs to be\n  // *below* the call to _read.  The reason is that in certain\n  // synthetic stream cases, such as passthrough streams, _read\n  // may be a completely synchronous operation which may change\n  // the state of the read buffer, providing enough data when\n  // before there was *not* enough.\n  //\n  // So, the steps are:\n  // 1. Figure out what the state of things will be after we do\n  // a read from the buffer.\n  //\n  // 2. If that resulting state will trigger a _read, then call _read.\n  // Note that this may be asynchronous, or synchronous.  Yes, it is\n  // deeply ugly to write APIs this way, but that still doesn't mean\n  // that the Readable class should behave improperly, as streams are\n  // designed to be sync/async agnostic.\n  // Take note if the _read call is sync or async (ie, if the read call\n  // has returned yet), so that we know whether or not it's safe to emit\n  // 'readable' etc.\n  //\n  // 3. Actually pull the requested chunks out of the buffer and return.\n\n  // if we need a readable event, then we need to do some reading.\n  var doRead = state.needReadable;\n  debug('need readable', doRead);\n\n  // if we currently have less than the highWaterMark, then also read some\n  if (state.length === 0 || state.length - n < state.highWaterMark) {\n    doRead = true;\n    debug('length less than watermark', doRead);\n  }\n\n  // however, if we've ended, then there's no point, and if we're already\n  // reading, then it's unnecessary.\n  if (state.ended || state.reading) {\n    doRead = false;\n    debug('reading or ended', doRead);\n  }\n\n  if (doRead) {\n    debug('do read');\n    state.reading = true;\n    state.sync = true;\n    // if the length is currently zero, then we *need* a readable event.\n    if (state.length === 0)\n      state.needReadable = true;\n    // call internal read method\n    this._read(state.highWaterMark);\n    state.sync = false;\n  }\n\n  // If _read pushed data synchronously, then `reading` will be false,\n  // and we need to re-evaluate how much data we can return to the user.\n  if (doRead && !state.reading)\n    n = howMuchToRead(nOrig, state);\n\n  var ret;\n  if (n > 0)\n    ret = fromList(n, state);\n  else\n    ret = null;\n\n  if (util.isNull(ret)) {\n    state.needReadable = true;\n    n = 0;\n  }\n\n  state.length -= n;\n\n  // If we have nothing in the buffer, then we want to know\n  // as soon as we *do* get something into the buffer.\n  if (state.length === 0 && !state.ended)\n    state.needReadable = true;\n\n  // If we tried to read() past the EOF, then emit end on the next tick.\n  if (nOrig !== n && state.ended && state.length === 0)\n    endReadable(this);\n\n  if (!util.isNull(ret))\n    this.emit('data', ret);\n\n  return ret;\n};\n\nfunction chunkInvalid(state, chunk) {\n  var er = null;\n  if (!util.isBuffer(chunk) &&\n      !util.isString(chunk) &&\n      !util.isNullOrUndefined(chunk) &&\n      !state.objectMode) {\n    er = new TypeError('Invalid non-string/buffer chunk');\n  }\n  return er;\n}\n\n\nfunction onEofChunk(stream, state) {\n  if (state.decoder && !state.ended) {\n    var chunk = state.decoder.end();\n    if (chunk && chunk.length) {\n      state.buffer.push(chunk);\n      state.length += state.objectMode ? 1 : chunk.length;\n    }\n  }\n  state.ended = true;\n\n  // emit 'readable' now to make sure it gets picked up.\n  emitReadable(stream);\n}\n\n// Don't emit readable right away in sync mode, because this can trigger\n// another read() call => stack overflow.  This way, it might trigger\n// a nextTick recursion warning, but that's not so bad.\nfunction emitReadable(stream) {\n  var state = stream._readableState;\n  state.needReadable = false;\n  if (!state.emittedReadable) {\n    debug('emitReadable', state.flowing);\n    state.emittedReadable = true;\n    if (state.sync)\n      process.nextTick(function() {\n        emitReadable_(stream);\n      });\n    else\n      emitReadable_(stream);\n  }\n}\n\nfunction emitReadable_(stream) {\n  debug('emit readable');\n  stream.emit('readable');\n  flow(stream);\n}\n\n\n// at this point, the user has presumably seen the 'readable' event,\n// and called read() to consume some data.  that may have triggered\n// in turn another _read(n) call, in which case reading = true if\n// it's in progress.\n// However, if we're not ended, or reading, and the length < hwm,\n// then go ahead and try to read some more preemptively.\nfunction maybeReadMore(stream, state) {\n  if (!state.readingMore) {\n    state.readingMore = true;\n    process.nextTick(function() {\n      maybeReadMore_(stream, state);\n    });\n  }\n}\n\nfunction maybeReadMore_(stream, state) {\n  var len = state.length;\n  while (!state.reading && !state.flowing && !state.ended &&\n         state.length < state.highWaterMark) {\n    debug('maybeReadMore read 0');\n    stream.read(0);\n    if (len === state.length)\n      // didn't get any data, stop spinning.\n      break;\n    else\n      len = state.length;\n  }\n  state.readingMore = false;\n}\n\n// abstract method.  to be overridden in specific implementation classes.\n// call cb(er, data) where data is <= n in length.\n// for virtual (non-string, non-buffer) streams, \"length\" is somewhat\n// arbitrary, and perhaps not very meaningful.\nReadable.prototype._read = function(n) {\n  this.emit('error', new Error('not implemented'));\n};\n\nReadable.prototype.pipe = function(dest, pipeOpts) {\n  var src = this;\n  var state = this._readableState;\n\n  switch (state.pipesCount) {\n    case 0:\n      state.pipes = dest;\n      break;\n    case 1:\n      state.pipes = [state.pipes, dest];\n      break;\n    default:\n      state.pipes.push(dest);\n      break;\n  }\n  state.pipesCount += 1;\n  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);\n\n  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&\n              dest !== process.stdout &&\n              dest !== process.stderr;\n\n  var endFn = doEnd ? onend : cleanup;\n  if (state.endEmitted)\n    process.nextTick(endFn);\n  else\n    src.once('end', endFn);\n\n  dest.on('unpipe', onunpipe);\n  function onunpipe(readable) {\n    debug('onunpipe');\n    if (readable === src) {\n      cleanup();\n    }\n  }\n\n  function onend() {\n    debug('onend');\n    dest.end();\n  }\n\n  // when the dest drains, it reduces the awaitDrain counter\n  // on the source.  This would be more elegant with a .once()\n  // handler in flow(), but adding and removing repeatedly is\n  // too slow.\n  var ondrain = pipeOnDrain(src);\n  dest.on('drain', ondrain);\n\n  function cleanup() {\n    debug('cleanup');\n    // cleanup event handlers once the pipe is broken\n    dest.removeListener('close', onclose);\n    dest.removeListener('finish', onfinish);\n    dest.removeListener('drain', ondrain);\n    dest.removeListener('error', onerror);\n    dest.removeListener('unpipe', onunpipe);\n    src.removeListener('end', onend);\n    src.removeListener('end', cleanup);\n    src.removeListener('data', ondata);\n\n    // if the reader is waiting for a drain event from this\n    // specific writer, then it would cause it to never start\n    // flowing again.\n    // So, if this is awaiting a drain, then we just call it now.\n    // If we don't know, then assume that we are waiting for one.\n    if (state.awaitDrain &&\n        (!dest._writableState || dest._writableState.needDrain))\n      ondrain();\n  }\n\n  src.on('data', ondata);\n  function ondata(chunk) {\n    debug('ondata');\n    var ret = dest.write(chunk);\n    if (false === ret) {\n      debug('false write response, pause',\n            src._readableState.awaitDrain);\n      src._readableState.awaitDrain++;\n      src.pause();\n    }\n  }\n\n  // if the dest has an error, then stop piping into it.\n  // however, don't suppress the throwing behavior for this.\n  function onerror(er) {\n    debug('onerror', er);\n    unpipe();\n    dest.removeListener('error', onerror);\n    if (EE.listenerCount(dest, 'error') === 0)\n      dest.emit('error', er);\n  }\n  // This is a brutally ugly hack to make sure that our error handler\n  // is attached before any userland ones.  NEVER DO THIS.\n  if (!dest._events || !dest._events.error)\n    dest.on('error', onerror);\n  else if (isArray(dest._events.error))\n    dest._events.error.unshift(onerror);\n  else\n    dest._events.error = [onerror, dest._events.error];\n\n\n\n  // Both close and finish should trigger unpipe, but only once.\n  function onclose() {\n    dest.removeListener('finish', onfinish);\n    unpipe();\n  }\n  dest.once('close', onclose);\n  function onfinish() {\n    debug('onfinish');\n    dest.removeListener('close', onclose);\n    unpipe();\n  }\n  dest.once('finish', onfinish);\n\n  function unpipe() {\n    debug('unpipe');\n    src.unpipe(dest);\n  }\n\n  // tell the dest that it's being piped to\n  dest.emit('pipe', src);\n\n  // start the flow if it hasn't been started already.\n  if (!state.flowing) {\n    debug('pipe resume');\n    src.resume();\n  }\n\n  return dest;\n};\n\nfunction pipeOnDrain(src) {\n  return function() {\n    var state = src._readableState;\n    debug('pipeOnDrain', state.awaitDrain);\n    if (state.awaitDrain)\n      state.awaitDrain--;\n    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {\n      state.flowing = true;\n      flow(src);\n    }\n  };\n}\n\n\nReadable.prototype.unpipe = function(dest) {\n  var state = this._readableState;\n\n  // if we're not piping anywhere, then do nothing.\n  if (state.pipesCount === 0)\n    return this;\n\n  // just one destination.  most common case.\n  if (state.pipesCount === 1) {\n    // passed in one, but it's not the right one.\n    if (dest && dest !== state.pipes)\n      return this;\n\n    if (!dest)\n      dest = state.pipes;\n\n    // got a match.\n    state.pipes = null;\n    state.pipesCount = 0;\n    state.flowing = false;\n    if (dest)\n      dest.emit('unpipe', this);\n    return this;\n  }\n\n  // slow case. multiple pipe destinations.\n\n  if (!dest) {\n    // remove all.\n    var dests = state.pipes;\n    var len = state.pipesCount;\n    state.pipes = null;\n    state.pipesCount = 0;\n    state.flowing = false;\n\n    for (var i = 0; i < len; i++)\n      dests[i].emit('unpipe', this);\n    return this;\n  }\n\n  // try to find the right one.\n  var i = indexOf(state.pipes, dest);\n  if (i === -1)\n    return this;\n\n  state.pipes.splice(i, 1);\n  state.pipesCount -= 1;\n  if (state.pipesCount === 1)\n    state.pipes = state.pipes[0];\n\n  dest.emit('unpipe', this);\n\n  return this;\n};\n\n// set up data events if they are asked for\n// Ensure readable listeners eventually get something\nReadable.prototype.on = function(ev, fn) {\n  var res = Stream.prototype.on.call(this, ev, fn);\n\n  // If listening to data, and it has not explicitly been paused,\n  // then call resume to start the flow of data on the next tick.\n  if (ev === 'data' && false !== this._readableState.flowing) {\n    this.resume();\n  }\n\n  if (ev === 'readable' && this.readable) {\n    var state = this._readableState;\n    if (!state.readableListening) {\n      state.readableListening = true;\n      state.emittedReadable = false;\n      state.needReadable = true;\n      if (!state.reading) {\n        var self = this;\n        process.nextTick(function() {\n          debug('readable nexttick read 0');\n          self.read(0);\n        });\n      } else if (state.length) {\n        emitReadable(this, state);\n      }\n    }\n  }\n\n  return res;\n};\nReadable.prototype.addListener = Readable.prototype.on;\n\n// pause() and resume() are remnants of the legacy readable stream API\n// If the user uses them, then switch into old mode.\nReadable.prototype.resume = function() {\n  var state = this._readableState;\n  if (!state.flowing) {\n    debug('resume');\n    state.flowing = true;\n    if (!state.reading) {\n      debug('resume read 0');\n      this.read(0);\n    }\n    resume(this, state);\n  }\n  return this;\n};\n\nfunction resume(stream, state) {\n  if (!state.resumeScheduled) {\n    state.resumeScheduled = true;\n    process.nextTick(function() {\n      resume_(stream, state);\n    });\n  }\n}\n\nfunction resume_(stream, state) {\n  state.resumeScheduled = false;\n  stream.emit('resume');\n  flow(stream);\n  if (state.flowing && !state.reading)\n    stream.read(0);\n}\n\nReadable.prototype.pause = function() {\n  debug('call pause flowing=%j', this._readableState.flowing);\n  if (false !== this._readableState.flowing) {\n    debug('pause');\n    this._readableState.flowing = false;\n    this.emit('pause');\n  }\n  return this;\n};\n\nfunction flow(stream) {\n  var state = stream._readableState;\n  debug('flow', state.flowing);\n  if (state.flowing) {\n    do {\n      var chunk = stream.read();\n    } while (null !== chunk && state.flowing);\n  }\n}\n\n// wrap an old-style stream as the async data source.\n// This is *not* part of the readable stream interface.\n// It is an ugly unfortunate mess of history.\nReadable.prototype.wrap = function(stream) {\n  var state = this._readableState;\n  var paused = false;\n\n  var self = this;\n  stream.on('end', function() {\n    debug('wrapped end');\n    if (state.decoder && !state.ended) {\n      var chunk = state.decoder.end();\n      if (chunk && chunk.length)\n        self.push(chunk);\n    }\n\n    self.push(null);\n  });\n\n  stream.on('data', function(chunk) {\n    debug('wrapped data');\n    if (state.decoder)\n      chunk = state.decoder.write(chunk);\n    if (!chunk || !state.objectMode && !chunk.length)\n      return;\n\n    var ret = self.push(chunk);\n    if (!ret) {\n      paused = true;\n      stream.pause();\n    }\n  });\n\n  // proxy all the other methods.\n  // important when wrapping filters and duplexes.\n  for (var i in stream) {\n    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {\n      this[i] = function(method) { return function() {\n        return stream[method].apply(stream, arguments);\n      }}(i);\n    }\n  }\n\n  // proxy certain important events.\n  var events = ['error', 'close', 'destroy', 'pause', 'resume'];\n  forEach(events, function(ev) {\n    stream.on(ev, self.emit.bind(self, ev));\n  });\n\n  // when we try to consume some more bytes, simply unpause the\n  // underlying stream.\n  self._read = function(n) {\n    debug('wrapped _read', n);\n    if (paused) {\n      paused = false;\n      stream.resume();\n    }\n  };\n\n  return self;\n};\n\n\n\n// exposed for testing purposes only.\nReadable._fromList = fromList;\n\n// Pluck off n bytes from an array of buffers.\n// Length is the combined lengths of all the buffers in the list.\nfunction fromList(n, state) {\n  var list = state.buffer;\n  var length = state.length;\n  var stringMode = !!state.decoder;\n  var objectMode = !!state.objectMode;\n  var ret;\n\n  // nothing in the list, definitely empty.\n  if (list.length === 0)\n    return null;\n\n  if (length === 0)\n    ret = null;\n  else if (objectMode)\n    ret = list.shift();\n  else if (!n || n >= length) {\n    // read it all, truncate the array.\n    if (stringMode)\n      ret = list.join('');\n    else\n      ret = Buffer.concat(list, length);\n    list.length = 0;\n  } else {\n    // read just some of it.\n    if (n < list[0].length) {\n      // just take a part of the first list item.\n      // slice is the same for buffers and strings.\n      var buf = list[0];\n      ret = buf.slice(0, n);\n      list[0] = buf.slice(n);\n    } else if (n === list[0].length) {\n      // first list is a perfect match\n      ret = list.shift();\n    } else {\n      // complex case.\n      // we have enough to cover it, but it spans past the first buffer.\n      if (stringMode)\n        ret = '';\n      else\n        ret = new Buffer(n);\n\n      var c = 0;\n      for (var i = 0, l = list.length; i < l && c < n; i++) {\n        var buf = list[0];\n        var cpy = Math.min(n - c, buf.length);\n\n        if (stringMode)\n          ret += buf.slice(0, cpy);\n        else\n          buf.copy(ret, c, 0, cpy);\n\n        if (cpy < buf.length)\n          list[0] = buf.slice(cpy);\n        else\n          list.shift();\n\n        c += cpy;\n      }\n    }\n  }\n\n  return ret;\n}\n\nfunction endReadable(stream) {\n  var state = stream._readableState;\n\n  // If we get here before consuming all the bytes, then that is a\n  // bug in node.  Should never happen.\n  if (state.length > 0)\n    throw new Error('endReadable called on non-empty stream');\n\n  if (!state.endEmitted) {\n    state.ended = true;\n    process.nextTick(function() {\n      // Check that we didn't get one last unshift.\n      if (!state.endEmitted && state.length === 0) {\n        state.endEmitted = true;\n        stream.readable = false;\n        stream.emit('end');\n      }\n    });\n  }\n}\n\nfunction forEach (xs, f) {\n  for (var i = 0, l = xs.length; i < l; i++) {\n    f(xs[i], i);\n  }\n}\n\nfunction indexOf (xs, x) {\n  for (var i = 0, l = xs.length; i < l; i++) {\n    if (xs[i] === x) return i;\n  }\n  return -1;\n}\n\n}).call(this,require('_process'))\n},{\"./_stream_duplex\":53,\"_process\":51,\"buffer\":43,\"core-util-is\":58,\"events\":47,\"inherits\":48,\"isarray\":49,\"stream\":63,\"string_decoder/\":64,\"util\":42}],56:[function(require,module,exports){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n// a transform stream is a readable/writable stream where you do\n// something with the data.  Sometimes it's called a \"filter\",\n// but that's not a great name for it, since that implies a thing where\n// some bits pass through, and others are simply ignored.  (That would\n// be a valid example of a transform, of course.)\n//\n// While the output is causally related to the input, it's not a\n// necessarily symmetric or synchronous transformation.  For example,\n// a zlib stream might take multiple plain-text writes(), and then\n// emit a single compressed chunk some time in the future.\n//\n// Here's how this works:\n//\n// The Transform stream has all the aspects of the readable and writable\n// stream classes.  When you write(chunk), that calls _write(chunk,cb)\n// internally, and returns false if there's a lot of pending writes\n// buffered up.  When you call read(), that calls _read(n) until\n// there's enough pending readable data buffered up.\n//\n// In a transform stream, the written data is placed in a buffer.  When\n// _read(n) is called, it transforms the queued up data, calling the\n// buffered _write cb's as it consumes chunks.  If consuming a single\n// written chunk would result in multiple output chunks, then the first\n// outputted bit calls the readcb, and subsequent chunks just go into\n// the read buffer, and will cause it to emit 'readable' if necessary.\n//\n// This way, back-pressure is actually determined by the reading side,\n// since _read has to be called to start processing a new chunk.  However,\n// a pathological inflate type of transform can cause excessive buffering\n// here.  For example, imagine a stream where every byte of input is\n// interpreted as an integer from 0-255, and then results in that many\n// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in\n// 1kb of data being output.  In this case, you could write a very small\n// amount of input, and end up with a very large amount of output.  In\n// such a pathological inflating mechanism, there'd be no way to tell\n// the system to stop doing the transform.  A single 4MB write could\n// cause the system to run out of memory.\n//\n// However, even in such a pathological case, only a single written chunk\n// would be consumed, and then the rest would wait (un-transformed) until\n// the results of the previous transformed chunk were consumed.\n\nmodule.exports = Transform;\n\nvar Duplex = require('./_stream_duplex');\n\n/*<replacement>*/\nvar util = require('core-util-is');\nutil.inherits = require('inherits');\n/*</replacement>*/\n\nutil.inherits(Transform, Duplex);\n\n\nfunction TransformState(options, stream) {\n  this.afterTransform = function(er, data) {\n    return afterTransform(stream, er, data);\n  };\n\n  this.needTransform = false;\n  this.transforming = false;\n  this.writecb = null;\n  this.writechunk = null;\n}\n\nfunction afterTransform(stream, er, data) {\n  var ts = stream._transformState;\n  ts.transforming = false;\n\n  var cb = ts.writecb;\n\n  if (!cb)\n    return stream.emit('error', new Error('no writecb in Transform class'));\n\n  ts.writechunk = null;\n  ts.writecb = null;\n\n  if (!util.isNullOrUndefined(data))\n    stream.push(data);\n\n  if (cb)\n    cb(er);\n\n  var rs = stream._readableState;\n  rs.reading = false;\n  if (rs.needReadable || rs.length < rs.highWaterMark) {\n    stream._read(rs.highWaterMark);\n  }\n}\n\n\nfunction Transform(options) {\n  if (!(this instanceof Transform))\n    return new Transform(options);\n\n  Duplex.call(this, options);\n\n  this._transformState = new TransformState(options, this);\n\n  // when the writable side finishes, then flush out anything remaining.\n  var stream = this;\n\n  // start out asking for a readable event once data is transformed.\n  this._readableState.needReadable = true;\n\n  // we have implemented the _read method, and done the other things\n  // that Readable wants before the first _read call, so unset the\n  // sync guard flag.\n  this._readableState.sync = false;\n\n  this.once('prefinish', function() {\n    if (util.isFunction(this._flush))\n      this._flush(function(er) {\n        done(stream, er);\n      });\n    else\n      done(stream);\n  });\n}\n\nTransform.prototype.push = function(chunk, encoding) {\n  this._transformState.needTransform = false;\n  return Duplex.prototype.push.call(this, chunk, encoding);\n};\n\n// This is the part where you do stuff!\n// override this function in implementation classes.\n// 'chunk' is an input chunk.\n//\n// Call `push(newChunk)` to pass along transformed output\n// to the readable side.  You may call 'push' zero or more times.\n//\n// Call `cb(err)` when you are done with this chunk.  If you pass\n// an error, then that'll put the hurt on the whole operation.  If you\n// never call cb(), then you'll never get another chunk.\nTransform.prototype._transform = function(chunk, encoding, cb) {\n  throw new Error('not implemented');\n};\n\nTransform.prototype._write = function(chunk, encoding, cb) {\n  var ts = this._transformState;\n  ts.writecb = cb;\n  ts.writechunk = chunk;\n  ts.writeencoding = encoding;\n  if (!ts.transforming) {\n    var rs = this._readableState;\n    if (ts.needTransform ||\n        rs.needReadable ||\n        rs.length < rs.highWaterMark)\n      this._read(rs.highWaterMark);\n  }\n};\n\n// Doesn't matter what the args are here.\n// _transform does all the work.\n// That we got here means that the readable side wants more data.\nTransform.prototype._read = function(n) {\n  var ts = this._transformState;\n\n  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {\n    ts.transforming = true;\n    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);\n  } else {\n    // mark that we need a transform, so that any data that comes in\n    // will get processed, now that we've asked for it.\n    ts.needTransform = true;\n  }\n};\n\n\nfunction done(stream, er) {\n  if (er)\n    return stream.emit('error', er);\n\n  // if there's nothing in the write buffer, then that means\n  // that nothing more will ever be provided\n  var ws = stream._writableState;\n  var ts = stream._transformState;\n\n  if (ws.length)\n    throw new Error('calling transform done when ws.length != 0');\n\n  if (ts.transforming)\n    throw new Error('calling transform done when still transforming');\n\n  return stream.push(null);\n}\n\n},{\"./_stream_duplex\":53,\"core-util-is\":58,\"inherits\":48}],57:[function(require,module,exports){\n(function (process){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// A bit simpler than readable streams.\n// Implement an async ._write(chunk, cb), and it'll handle all\n// the drain event emission and buffering.\n\nmodule.exports = Writable;\n\n/*<replacement>*/\nvar Buffer = require('buffer').Buffer;\n/*</replacement>*/\n\nWritable.WritableState = WritableState;\n\n\n/*<replacement>*/\nvar util = require('core-util-is');\nutil.inherits = require('inherits');\n/*</replacement>*/\n\nvar Stream = require('stream');\n\nutil.inherits(Writable, Stream);\n\nfunction WriteReq(chunk, encoding, cb) {\n  this.chunk = chunk;\n  this.encoding = encoding;\n  this.callback = cb;\n}\n\nfunction WritableState(options, stream) {\n  var Duplex = require('./_stream_duplex');\n\n  options = options || {};\n\n  // the point at which write() starts returning false\n  // Note: 0 is a valid value, means that we always return false if\n  // the entire buffer is not flushed immediately on write()\n  var hwm = options.highWaterMark;\n  var defaultHwm = options.objectMode ? 16 : 16 * 1024;\n  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;\n\n  // object stream flag to indicate whether or not this stream\n  // contains buffers or objects.\n  this.objectMode = !!options.objectMode;\n\n  if (stream instanceof Duplex)\n    this.objectMode = this.objectMode || !!options.writableObjectMode;\n\n  // cast to ints.\n  this.highWaterMark = ~~this.highWaterMark;\n\n  this.needDrain = false;\n  // at the start of calling end()\n  this.ending = false;\n  // when end() has been called, and returned\n  this.ended = false;\n  // when 'finish' is emitted\n  this.finished = false;\n\n  // should we decode strings into buffers before passing to _write?\n  // this is here so that some node-core streams can optimize string\n  // handling at a lower level.\n  var noDecode = options.decodeStrings === false;\n  this.decodeStrings = !noDecode;\n\n  // Crypto is kind of old and crusty.  Historically, its default string\n  // encoding is 'binary' so we have to make this configurable.\n  // Everything else in the universe uses 'utf8', though.\n  this.defaultEncoding = options.defaultEncoding || 'utf8';\n\n  // not an actual buffer we keep track of, but a measurement\n  // of how much we're waiting to get pushed to some underlying\n  // socket or file.\n  this.length = 0;\n\n  // a flag to see when we're in the middle of a write.\n  this.writing = false;\n\n  // when true all writes will be buffered until .uncork() call\n  this.corked = 0;\n\n  // a flag to be able to tell if the onwrite cb is called immediately,\n  // or on a later tick.  We set this to true at first, because any\n  // actions that shouldn't happen until \"later\" should generally also\n  // not happen before the first write call.\n  this.sync = true;\n\n  // a flag to know if we're processing previously buffered items, which\n  // may call the _write() callback in the same tick, so that we don't\n  // end up in an overlapped onwrite situation.\n  this.bufferProcessing = false;\n\n  // the callback that's passed to _write(chunk,cb)\n  this.onwrite = function(er) {\n    onwrite(stream, er);\n  };\n\n  // the callback that the user supplies to write(chunk,encoding,cb)\n  this.writecb = null;\n\n  // the amount that is being written when _write is called.\n  this.writelen = 0;\n\n  this.buffer = [];\n\n  // number of pending user-supplied write callbacks\n  // this must be 0 before 'finish' can be emitted\n  this.pendingcb = 0;\n\n  // emit prefinish if the only thing we're waiting for is _write cbs\n  // This is relevant for synchronous Transform streams\n  this.prefinished = false;\n\n  // True if the error was already emitted and should not be thrown again\n  this.errorEmitted = false;\n}\n\nfunction Writable(options) {\n  var Duplex = require('./_stream_duplex');\n\n  // Writable ctor is applied to Duplexes, though they're not\n  // instanceof Writable, they're instanceof Readable.\n  if (!(this instanceof Writable) && !(this instanceof Duplex))\n    return new Writable(options);\n\n  this._writableState = new WritableState(options, this);\n\n  // legacy.\n  this.writable = true;\n\n  Stream.call(this);\n}\n\n// Otherwise people can pipe Writable streams, which is just wrong.\nWritable.prototype.pipe = function() {\n  this.emit('error', new Error('Cannot pipe. Not readable.'));\n};\n\n\nfunction writeAfterEnd(stream, state, cb) {\n  var er = new Error('write after end');\n  // TODO: defer error events consistently everywhere, not just the cb\n  stream.emit('error', er);\n  process.nextTick(function() {\n    cb(er);\n  });\n}\n\n// If we get something that is not a buffer, string, null, or undefined,\n// and we're not in objectMode, then that's an error.\n// Otherwise stream chunks are all considered to be of length=1, and the\n// watermarks determine how many objects to keep in the buffer, rather than\n// how many bytes or characters.\nfunction validChunk(stream, state, chunk, cb) {\n  var valid = true;\n  if (!util.isBuffer(chunk) &&\n      !util.isString(chunk) &&\n      !util.isNullOrUndefined(chunk) &&\n      !state.objectMode) {\n    var er = new TypeError('Invalid non-string/buffer chunk');\n    stream.emit('error', er);\n    process.nextTick(function() {\n      cb(er);\n    });\n    valid = false;\n  }\n  return valid;\n}\n\nWritable.prototype.write = function(chunk, encoding, cb) {\n  var state = this._writableState;\n  var ret = false;\n\n  if (util.isFunction(encoding)) {\n    cb = encoding;\n    encoding = null;\n  }\n\n  if (util.isBuffer(chunk))\n    encoding = 'buffer';\n  else if (!encoding)\n    encoding = state.defaultEncoding;\n\n  if (!util.isFunction(cb))\n    cb = function() {};\n\n  if (state.ended)\n    writeAfterEnd(this, state, cb);\n  else if (validChunk(this, state, chunk, cb)) {\n    state.pendingcb++;\n    ret = writeOrBuffer(this, state, chunk, encoding, cb);\n  }\n\n  return ret;\n};\n\nWritable.prototype.cork = function() {\n  var state = this._writableState;\n\n  state.corked++;\n};\n\nWritable.prototype.uncork = function() {\n  var state = this._writableState;\n\n  if (state.corked) {\n    state.corked--;\n\n    if (!state.writing &&\n        !state.corked &&\n        !state.finished &&\n        !state.bufferProcessing &&\n        state.buffer.length)\n      clearBuffer(this, state);\n  }\n};\n\nfunction decodeChunk(state, chunk, encoding) {\n  if (!state.objectMode &&\n      state.decodeStrings !== false &&\n      util.isString(chunk)) {\n    chunk = new Buffer(chunk, encoding);\n  }\n  return chunk;\n}\n\n// if we're already writing something, then just put this\n// in the queue, and wait our turn.  Otherwise, call _write\n// If we return false, then we need a drain event, so set that flag.\nfunction writeOrBuffer(stream, state, chunk, encoding, cb) {\n  chunk = decodeChunk(state, chunk, encoding);\n  if (util.isBuffer(chunk))\n    encoding = 'buffer';\n  var len = state.objectMode ? 1 : chunk.length;\n\n  state.length += len;\n\n  var ret = state.length < state.highWaterMark;\n  // we must ensure that previous needDrain will not be reset to false.\n  if (!ret)\n    state.needDrain = true;\n\n  if (state.writing || state.corked)\n    state.buffer.push(new WriteReq(chunk, encoding, cb));\n  else\n    doWrite(stream, state, false, len, chunk, encoding, cb);\n\n  return ret;\n}\n\nfunction doWrite(stream, state, writev, len, chunk, encoding, cb) {\n  state.writelen = len;\n  state.writecb = cb;\n  state.writing = true;\n  state.sync = true;\n  if (writev)\n    stream._writev(chunk, state.onwrite);\n  else\n    stream._write(chunk, encoding, state.onwrite);\n  state.sync = false;\n}\n\nfunction onwriteError(stream, state, sync, er, cb) {\n  if (sync)\n    process.nextTick(function() {\n      state.pendingcb--;\n      cb(er);\n    });\n  else {\n    state.pendingcb--;\n    cb(er);\n  }\n\n  stream._writableState.errorEmitted = true;\n  stream.emit('error', er);\n}\n\nfunction onwriteStateUpdate(state) {\n  state.writing = false;\n  state.writecb = null;\n  state.length -= state.writelen;\n  state.writelen = 0;\n}\n\nfunction onwrite(stream, er) {\n  var state = stream._writableState;\n  var sync = state.sync;\n  var cb = state.writecb;\n\n  onwriteStateUpdate(state);\n\n  if (er)\n    onwriteError(stream, state, sync, er, cb);\n  else {\n    // Check if we're actually ready to finish, but don't emit yet\n    var finished = needFinish(stream, state);\n\n    if (!finished &&\n        !state.corked &&\n        !state.bufferProcessing &&\n        state.buffer.length) {\n      clearBuffer(stream, state);\n    }\n\n    if (sync) {\n      process.nextTick(function() {\n        afterWrite(stream, state, finished, cb);\n      });\n    } else {\n      afterWrite(stream, state, finished, cb);\n    }\n  }\n}\n\nfunction afterWrite(stream, state, finished, cb) {\n  if (!finished)\n    onwriteDrain(stream, state);\n  state.pendingcb--;\n  cb();\n  finishMaybe(stream, state);\n}\n\n// Must force callback to be called on nextTick, so that we don't\n// emit 'drain' before the write() consumer gets the 'false' return\n// value, and has a chance to attach a 'drain' listener.\nfunction onwriteDrain(stream, state) {\n  if (state.length === 0 && state.needDrain) {\n    state.needDrain = false;\n    stream.emit('drain');\n  }\n}\n\n\n// if there's something in the buffer waiting, then process it\nfunction clearBuffer(stream, state) {\n  state.bufferProcessing = true;\n\n  if (stream._writev && state.buffer.length > 1) {\n    // Fast case, write everything using _writev()\n    var cbs = [];\n    for (var c = 0; c < state.buffer.length; c++)\n      cbs.push(state.buffer[c].callback);\n\n    // count the one we are adding, as well.\n    // TODO(isaacs) clean this up\n    state.pendingcb++;\n    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {\n      for (var i = 0; i < cbs.length; i++) {\n        state.pendingcb--;\n        cbs[i](err);\n      }\n    });\n\n    // Clear buffer\n    state.buffer = [];\n  } else {\n    // Slow case, write chunks one-by-one\n    for (var c = 0; c < state.buffer.length; c++) {\n      var entry = state.buffer[c];\n      var chunk = entry.chunk;\n      var encoding = entry.encoding;\n      var cb = entry.callback;\n      var len = state.objectMode ? 1 : chunk.length;\n\n      doWrite(stream, state, false, len, chunk, encoding, cb);\n\n      // if we didn't call the onwrite immediately, then\n      // it means that we need to wait until it does.\n      // also, that means that the chunk and cb are currently\n      // being processed, so move the buffer counter past them.\n      if (state.writing) {\n        c++;\n        break;\n      }\n    }\n\n    if (c < state.buffer.length)\n      state.buffer = state.buffer.slice(c);\n    else\n      state.buffer.length = 0;\n  }\n\n  state.bufferProcessing = false;\n}\n\nWritable.prototype._write = function(chunk, encoding, cb) {\n  cb(new Error('not implemented'));\n\n};\n\nWritable.prototype._writev = null;\n\nWritable.prototype.end = function(chunk, encoding, cb) {\n  var state = this._writableState;\n\n  if (util.isFunction(chunk)) {\n    cb = chunk;\n    chunk = null;\n    encoding = null;\n  } else if (util.isFunction(encoding)) {\n    cb = encoding;\n    encoding = null;\n  }\n\n  if (!util.isNullOrUndefined(chunk))\n    this.write(chunk, encoding);\n\n  // .end() fully uncorks\n  if (state.corked) {\n    state.corked = 1;\n    this.uncork();\n  }\n\n  // ignore unnecessary end() calls.\n  if (!state.ending && !state.finished)\n    endWritable(this, state, cb);\n};\n\n\nfunction needFinish(stream, state) {\n  return (state.ending &&\n          state.length === 0 &&\n          !state.finished &&\n          !state.writing);\n}\n\nfunction prefinish(stream, state) {\n  if (!state.prefinished) {\n    state.prefinished = true;\n    stream.emit('prefinish');\n  }\n}\n\nfunction finishMaybe(stream, state) {\n  var need = needFinish(stream, state);\n  if (need) {\n    if (state.pendingcb === 0) {\n      prefinish(stream, state);\n      state.finished = true;\n      stream.emit('finish');\n    } else\n      prefinish(stream, state);\n  }\n  return need;\n}\n\nfunction endWritable(stream, state, cb) {\n  state.ending = true;\n  finishMaybe(stream, state);\n  if (cb) {\n    if (state.finished)\n      process.nextTick(cb);\n    else\n      stream.once('finish', cb);\n  }\n  state.ended = true;\n}\n\n}).call(this,require('_process'))\n},{\"./_stream_duplex\":53,\"_process\":51,\"buffer\":43,\"core-util-is\":58,\"inherits\":48,\"stream\":63}],58:[function(require,module,exports){\n(function (Buffer){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// NOTE: These type checking functions intentionally don't use `instanceof`\n// because it is fragile and can be easily faked with `Object.create()`.\nfunction isArray(ar) {\n  return Array.isArray(ar);\n}\nexports.isArray = isArray;\n\nfunction isBoolean(arg) {\n  return typeof arg === 'boolean';\n}\nexports.isBoolean = isBoolean;\n\nfunction isNull(arg) {\n  return arg === null;\n}\nexports.isNull = isNull;\n\nfunction isNullOrUndefined(arg) {\n  return arg == null;\n}\nexports.isNullOrUndefined = isNullOrUndefined;\n\nfunction isNumber(arg) {\n  return typeof arg === 'number';\n}\nexports.isNumber = isNumber;\n\nfunction isString(arg) {\n  return typeof arg === 'string';\n}\nexports.isString = isString;\n\nfunction isSymbol(arg) {\n  return typeof arg === 'symbol';\n}\nexports.isSymbol = isSymbol;\n\nfunction isUndefined(arg) {\n  return arg === void 0;\n}\nexports.isUndefined = isUndefined;\n\nfunction isRegExp(re) {\n  return isObject(re) && objectToString(re) === '[object RegExp]';\n}\nexports.isRegExp = isRegExp;\n\nfunction isObject(arg) {\n  return typeof arg === 'object' && arg !== null;\n}\nexports.isObject = isObject;\n\nfunction isDate(d) {\n  return isObject(d) && objectToString(d) === '[object Date]';\n}\nexports.isDate = isDate;\n\nfunction isError(e) {\n  return isObject(e) &&\n      (objectToString(e) === '[object Error]' || e instanceof Error);\n}\nexports.isError = isError;\n\nfunction isFunction(arg) {\n  return typeof arg === 'function';\n}\nexports.isFunction = isFunction;\n\nfunction isPrimitive(arg) {\n  return arg === null ||\n         typeof arg === 'boolean' ||\n         typeof arg === 'number' ||\n         typeof arg === 'string' ||\n         typeof arg === 'symbol' ||  // ES6 symbol\n         typeof arg === 'undefined';\n}\nexports.isPrimitive = isPrimitive;\n\nfunction isBuffer(arg) {\n  return Buffer.isBuffer(arg);\n}\nexports.isBuffer = isBuffer;\n\nfunction objectToString(o) {\n  return Object.prototype.toString.call(o);\n}\n}).call(this,require(\"buffer\").Buffer)\n},{\"buffer\":43}],59:[function(require,module,exports){\nmodule.exports = require(\"./lib/_stream_passthrough.js\")\n\n},{\"./lib/_stream_passthrough.js\":54}],60:[function(require,module,exports){\nexports = module.exports = require('./lib/_stream_readable.js');\nexports.Stream = require('stream');\nexports.Readable = exports;\nexports.Writable = require('./lib/_stream_writable.js');\nexports.Duplex = require('./lib/_stream_duplex.js');\nexports.Transform = require('./lib/_stream_transform.js');\nexports.PassThrough = require('./lib/_stream_passthrough.js');\n\n},{\"./lib/_stream_duplex.js\":53,\"./lib/_stream_passthrough.js\":54,\"./lib/_stream_readable.js\":55,\"./lib/_stream_transform.js\":56,\"./lib/_stream_writable.js\":57,\"stream\":63}],61:[function(require,module,exports){\nmodule.exports = require(\"./lib/_stream_transform.js\")\n\n},{\"./lib/_stream_transform.js\":56}],62:[function(require,module,exports){\nmodule.exports = require(\"./lib/_stream_writable.js\")\n\n},{\"./lib/_stream_writable.js\":57}],63:[function(require,module,exports){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nmodule.exports = Stream;\n\nvar EE = require('events').EventEmitter;\nvar inherits = require('inherits');\n\ninherits(Stream, EE);\nStream.Readable = require('readable-stream/readable.js');\nStream.Writable = require('readable-stream/writable.js');\nStream.Duplex = require('readable-stream/duplex.js');\nStream.Transform = require('readable-stream/transform.js');\nStream.PassThrough = require('readable-stream/passthrough.js');\n\n// Backwards-compat with node 0.4.x\nStream.Stream = Stream;\n\n\n\n// old-style streams.  Note that the pipe method (the only relevant\n// part of this class) is overridden in the Readable class.\n\nfunction Stream() {\n  EE.call(this);\n}\n\nStream.prototype.pipe = function(dest, options) {\n  var source = this;\n\n  function ondata(chunk) {\n    if (dest.writable) {\n      if (false === dest.write(chunk) && source.pause) {\n        source.pause();\n      }\n    }\n  }\n\n  source.on('data', ondata);\n\n  function ondrain() {\n    if (source.readable && source.resume) {\n      source.resume();\n    }\n  }\n\n  dest.on('drain', ondrain);\n\n  // If the 'end' option is not supplied, dest.end() will be called when\n  // source gets the 'end' or 'close' events.  Only dest.end() once.\n  if (!dest._isStdio && (!options || options.end !== false)) {\n    source.on('end', onend);\n    source.on('close', onclose);\n  }\n\n  var didOnEnd = false;\n  function onend() {\n    if (didOnEnd) return;\n    didOnEnd = true;\n\n    dest.end();\n  }\n\n\n  function onclose() {\n    if (didOnEnd) return;\n    didOnEnd = true;\n\n    if (typeof dest.destroy === 'function') dest.destroy();\n  }\n\n  // don't leave dangling pipes when there are errors.\n  function onerror(er) {\n    cleanup();\n    if (EE.listenerCount(this, 'error') === 0) {\n      throw er; // Unhandled stream error in pipe.\n    }\n  }\n\n  source.on('error', onerror);\n  dest.on('error', onerror);\n\n  // remove all the event listeners that were added.\n  function cleanup() {\n    source.removeListener('data', ondata);\n    dest.removeListener('drain', ondrain);\n\n    source.removeListener('end', onend);\n    source.removeListener('close', onclose);\n\n    source.removeListener('error', onerror);\n    dest.removeListener('error', onerror);\n\n    source.removeListener('end', cleanup);\n    source.removeListener('close', cleanup);\n\n    dest.removeListener('close', cleanup);\n  }\n\n  source.on('end', cleanup);\n  source.on('close', cleanup);\n\n  dest.on('close', cleanup);\n\n  dest.emit('pipe', source);\n\n  // Allow for unix-like usage: A.pipe(B).pipe(C)\n  return dest;\n};\n\n},{\"events\":47,\"inherits\":48,\"readable-stream/duplex.js\":52,\"readable-stream/passthrough.js\":59,\"readable-stream/readable.js\":60,\"readable-stream/transform.js\":61,\"readable-stream/writable.js\":62}],64:[function(require,module,exports){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nvar Buffer = require('buffer').Buffer;\n\nvar isBufferEncoding = Buffer.isEncoding\n  || function(encoding) {\n       switch (encoding && encoding.toLowerCase()) {\n         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;\n         default: return false;\n       }\n     }\n\n\nfunction assertEncoding(encoding) {\n  if (encoding && !isBufferEncoding(encoding)) {\n    throw new Error('Unknown encoding: ' + encoding);\n  }\n}\n\n// StringDecoder provides an interface for efficiently splitting a series of\n// buffers into a series of JS strings without breaking apart multi-byte\n// characters. CESU-8 is handled as part of the UTF-8 encoding.\n//\n// @TODO Handling all encodings inside a single object makes it very difficult\n// to reason about this code, so it should be split up in the future.\n// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code\n// points as used by CESU-8.\nvar StringDecoder = exports.StringDecoder = function(encoding) {\n  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');\n  assertEncoding(encoding);\n  switch (this.encoding) {\n    case 'utf8':\n      // CESU-8 represents each of Surrogate Pair by 3-bytes\n      this.surrogateSize = 3;\n      break;\n    case 'ucs2':\n    case 'utf16le':\n      // UTF-16 represents each of Surrogate Pair by 2-bytes\n      this.surrogateSize = 2;\n      this.detectIncompleteChar = utf16DetectIncompleteChar;\n      break;\n    case 'base64':\n      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.\n      this.surrogateSize = 3;\n      this.detectIncompleteChar = base64DetectIncompleteChar;\n      break;\n    default:\n      this.write = passThroughWrite;\n      return;\n  }\n\n  // Enough space to store all bytes of a single character. UTF-8 needs 4\n  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).\n  this.charBuffer = new Buffer(6);\n  // Number of bytes received for the current incomplete multi-byte character.\n  this.charReceived = 0;\n  // Number of bytes expected for the current incomplete multi-byte character.\n  this.charLength = 0;\n};\n\n\n// write decodes the given buffer and returns it as JS string that is\n// guaranteed to not contain any partial multi-byte characters. Any partial\n// character found at the end of the buffer is buffered up, and will be\n// returned when calling write again with the remaining bytes.\n//\n// Note: Converting a Buffer containing an orphan surrogate to a String\n// currently works, but converting a String to a Buffer (via `new Buffer`, or\n// Buffer#write) will replace incomplete surrogates with the unicode\n// replacement character. See https://codereview.chromium.org/121173009/ .\nStringDecoder.prototype.write = function(buffer) {\n  var charStr = '';\n  // if our last write ended with an incomplete multibyte character\n  while (this.charLength) {\n    // determine how many remaining bytes this buffer has to offer for this char\n    var available = (buffer.length >= this.charLength - this.charReceived) ?\n        this.charLength - this.charReceived :\n        buffer.length;\n\n    // add the new bytes to the char buffer\n    buffer.copy(this.charBuffer, this.charReceived, 0, available);\n    this.charReceived += available;\n\n    if (this.charReceived < this.charLength) {\n      // still not enough chars in this buffer? wait for more ...\n      return '';\n    }\n\n    // remove bytes belonging to the current character from the buffer\n    buffer = buffer.slice(available, buffer.length);\n\n    // get the character that was split\n    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);\n\n    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character\n    var charCode = charStr.charCodeAt(charStr.length - 1);\n    if (charCode >= 0xD800 && charCode <= 0xDBFF) {\n      this.charLength += this.surrogateSize;\n      charStr = '';\n      continue;\n    }\n    this.charReceived = this.charLength = 0;\n\n    // if there are no more bytes in this buffer, just emit our char\n    if (buffer.length === 0) {\n      return charStr;\n    }\n    break;\n  }\n\n  // determine and set charLength / charReceived\n  this.detectIncompleteChar(buffer);\n\n  var end = buffer.length;\n  if (this.charLength) {\n    // buffer the incomplete character bytes we got\n    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);\n    end -= this.charReceived;\n  }\n\n  charStr += buffer.toString(this.encoding, 0, end);\n\n  var end = charStr.length - 1;\n  var charCode = charStr.charCodeAt(end);\n  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character\n  if (charCode >= 0xD800 && charCode <= 0xDBFF) {\n    var size = this.surrogateSize;\n    this.charLength += size;\n    this.charReceived += size;\n    this.charBuffer.copy(this.charBuffer, size, 0, size);\n    buffer.copy(this.charBuffer, 0, 0, size);\n    return charStr.substring(0, end);\n  }\n\n  // or just emit the charStr\n  return charStr;\n};\n\n// detectIncompleteChar determines if there is an incomplete UTF-8 character at\n// the end of the given buffer. If so, it sets this.charLength to the byte\n// length that character, and sets this.charReceived to the number of bytes\n// that are available for this character.\nStringDecoder.prototype.detectIncompleteChar = function(buffer) {\n  // determine how many bytes we have to check at the end of this buffer\n  var i = (buffer.length >= 3) ? 3 : buffer.length;\n\n  // Figure out if one of the last i bytes of our buffer announces an\n  // incomplete char.\n  for (; i > 0; i--) {\n    var c = buffer[buffer.length - i];\n\n    // See http://en.wikipedia.org/wiki/UTF-8#Description\n\n    // 110XXXXX\n    if (i == 1 && c >> 5 == 0x06) {\n      this.charLength = 2;\n      break;\n    }\n\n    // 1110XXXX\n    if (i <= 2 && c >> 4 == 0x0E) {\n      this.charLength = 3;\n      break;\n    }\n\n    // 11110XXX\n    if (i <= 3 && c >> 3 == 0x1E) {\n      this.charLength = 4;\n      break;\n    }\n  }\n  this.charReceived = i;\n};\n\nStringDecoder.prototype.end = function(buffer) {\n  var res = '';\n  if (buffer && buffer.length)\n    res = this.write(buffer);\n\n  if (this.charReceived) {\n    var cr = this.charReceived;\n    var buf = this.charBuffer;\n    var enc = this.encoding;\n    res += buf.slice(0, cr).toString(enc);\n  }\n\n  return res;\n};\n\nfunction passThroughWrite(buffer) {\n  return buffer.toString(this.encoding);\n}\n\nfunction utf16DetectIncompleteChar(buffer) {\n  this.charReceived = buffer.length % 2;\n  this.charLength = this.charReceived ? 2 : 0;\n}\n\nfunction base64DetectIncompleteChar(buffer) {\n  this.charReceived = buffer.length % 3;\n  this.charLength = this.charReceived ? 3 : 0;\n}\n\n},{\"buffer\":43}],65:[function(require,module,exports){\nmodule.exports = function isBuffer(arg) {\n  return arg && typeof arg === 'object'\n    && typeof arg.copy === 'function'\n    && typeof arg.fill === 'function'\n    && typeof arg.readUInt8 === 'function';\n}\n},{}],66:[function(require,module,exports){\n(function (process,global){\n// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nvar formatRegExp = /%[sdj%]/g;\nexports.format = function(f) {\n  if (!isString(f)) {\n    var objects = [];\n    for (var i = 0; i < arguments.length; i++) {\n      objects.push(inspect(arguments[i]));\n    }\n    return objects.join(' ');\n  }\n\n  var i = 1;\n  var args = arguments;\n  var len = args.length;\n  var str = String(f).replace(formatRegExp, function(x) {\n    if (x === '%%') return '%';\n    if (i >= len) return x;\n    switch (x) {\n      case '%s': return String(args[i++]);\n      case '%d': return Number(args[i++]);\n      case '%j':\n        try {\n          return JSON.stringify(args[i++]);\n        } catch (_) {\n          return '[Circular]';\n        }\n      default:\n        return x;\n    }\n  });\n  for (var x = args[i]; i < len; x = args[++i]) {\n    if (isNull(x) || !isObject(x)) {\n      str += ' ' + x;\n    } else {\n      str += ' ' + inspect(x);\n    }\n  }\n  return str;\n};\n\n\n// Mark that a method should not be used.\n// Returns a modified function which warns once by default.\n// If --no-deprecation is set, then it is a no-op.\nexports.deprecate = function(fn, msg) {\n  // Allow for deprecating things in the process of starting up.\n  if (isUndefined(global.process)) {\n    return function() {\n      return exports.deprecate(fn, msg).apply(this, arguments);\n    };\n  }\n\n  if (process.noDeprecation === true) {\n    return fn;\n  }\n\n  var warned = false;\n  function deprecated() {\n    if (!warned) {\n      if (process.throwDeprecation) {\n        throw new Error(msg);\n      } else if (process.traceDeprecation) {\n        console.trace(msg);\n      } else {\n        console.error(msg);\n      }\n      warned = true;\n    }\n    return fn.apply(this, arguments);\n  }\n\n  return deprecated;\n};\n\n\nvar debugs = {};\nvar debugEnviron;\nexports.debuglog = function(set) {\n  if (isUndefined(debugEnviron))\n    debugEnviron = process.env.NODE_DEBUG || '';\n  set = set.toUpperCase();\n  if (!debugs[set]) {\n    if (new RegExp('\\\\b' + set + '\\\\b', 'i').test(debugEnviron)) {\n      var pid = process.pid;\n      debugs[set] = function() {\n        var msg = exports.format.apply(exports, arguments);\n        console.error('%s %d: %s', set, pid, msg);\n      };\n    } else {\n      debugs[set] = function() {};\n    }\n  }\n  return debugs[set];\n};\n\n\n/**\n * Echos the value of a value. Trys to print the value out\n * in the best way possible given the different types.\n *\n * @param {Object} obj The object to print out.\n * @param {Object} opts Optional options object that alters the output.\n */\n/* legacy: obj, showHidden, depth, colors*/\nfunction inspect(obj, opts) {\n  // default options\n  var ctx = {\n    seen: [],\n    stylize: stylizeNoColor\n  };\n  // legacy...\n  if (arguments.length >= 3) ctx.depth = arguments[2];\n  if (arguments.length >= 4) ctx.colors = arguments[3];\n  if (isBoolean(opts)) {\n    // legacy...\n    ctx.showHidden = opts;\n  } else if (opts) {\n    // got an \"options\" object\n    exports._extend(ctx, opts);\n  }\n  // set default options\n  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;\n  if (isUndefined(ctx.depth)) ctx.depth = 2;\n  if (isUndefined(ctx.colors)) ctx.colors = false;\n  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;\n  if (ctx.colors) ctx.stylize = stylizeWithColor;\n  return formatValue(ctx, obj, ctx.depth);\n}\nexports.inspect = inspect;\n\n\n// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics\ninspect.colors = {\n  'bold' : [1, 22],\n  'italic' : [3, 23],\n  'underline' : [4, 24],\n  'inverse' : [7, 27],\n  'white' : [37, 39],\n  'grey' : [90, 39],\n  'black' : [30, 39],\n  'blue' : [34, 39],\n  'cyan' : [36, 39],\n  'green' : [32, 39],\n  'magenta' : [35, 39],\n  'red' : [31, 39],\n  'yellow' : [33, 39]\n};\n\n// Don't use 'blue' not visible on cmd.exe\ninspect.styles = {\n  'special': 'cyan',\n  'number': 'yellow',\n  'boolean': 'yellow',\n  'undefined': 'grey',\n  'null': 'bold',\n  'string': 'green',\n  'date': 'magenta',\n  // \"name\": intentionally not styling\n  'regexp': 'red'\n};\n\n\nfunction stylizeWithColor(str, styleType) {\n  var style = inspect.styles[styleType];\n\n  if (style) {\n    return '\\u001b[' + inspect.colors[style][0] + 'm' + str +\n           '\\u001b[' + inspect.colors[style][1] + 'm';\n  } else {\n    return str;\n  }\n}\n\n\nfunction stylizeNoColor(str, styleType) {\n  return str;\n}\n\n\nfunction arrayToHash(array) {\n  var hash = {};\n\n  array.forEach(function(val, idx) {\n    hash[val] = true;\n  });\n\n  return hash;\n}\n\n\nfunction formatValue(ctx, value, recurseTimes) {\n  // Provide a hook for user-specified inspect functions.\n  // Check that value is an object with an inspect function on it\n  if (ctx.customInspect &&\n      value &&\n      isFunction(value.inspect) &&\n      // Filter out the util module, it's inspect function is special\n      value.inspect !== exports.inspect &&\n      // Also filter out any prototype objects using the circular check.\n      !(value.constructor && value.constructor.prototype === value)) {\n    var ret = value.inspect(recurseTimes, ctx);\n    if (!isString(ret)) {\n      ret = formatValue(ctx, ret, recurseTimes);\n    }\n    return ret;\n  }\n\n  // Primitive types cannot have properties\n  var primitive = formatPrimitive(ctx, value);\n  if (primitive) {\n    return primitive;\n  }\n\n  // Look up the keys of the object.\n  var keys = Object.keys(value);\n  var visibleKeys = arrayToHash(keys);\n\n  if (ctx.showHidden) {\n    keys = Object.getOwnPropertyNames(value);\n  }\n\n  // IE doesn't make error fields non-enumerable\n  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx\n  if (isError(value)\n      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {\n    return formatError(value);\n  }\n\n  // Some type of object without properties can be shortcutted.\n  if (keys.length === 0) {\n    if (isFunction(value)) {\n      var name = value.name ? ': ' + value.name : '';\n      return ctx.stylize('[Function' + name + ']', 'special');\n    }\n    if (isRegExp(value)) {\n      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');\n    }\n    if (isDate(value)) {\n      return ctx.stylize(Date.prototype.toString.call(value), 'date');\n    }\n    if (isError(value)) {\n      return formatError(value);\n    }\n  }\n\n  var base = '', array = false, braces = ['{', '}'];\n\n  // Make Array say that they are Array\n  if (isArray(value)) {\n    array = true;\n    braces = ['[', ']'];\n  }\n\n  // Make functions say that they are functions\n  if (isFunction(value)) {\n    var n = value.name ? ': ' + value.name : '';\n    base = ' [Function' + n + ']';\n  }\n\n  // Make RegExps say that they are RegExps\n  if (isRegExp(value)) {\n    base = ' ' + RegExp.prototype.toString.call(value);\n  }\n\n  // Make dates with properties first say the date\n  if (isDate(value)) {\n    base = ' ' + Date.prototype.toUTCString.call(value);\n  }\n\n  // Make error with message first say the error\n  if (isError(value)) {\n    base = ' ' + formatError(value);\n  }\n\n  if (keys.length === 0 && (!array || value.length == 0)) {\n    return braces[0] + base + braces[1];\n  }\n\n  if (recurseTimes < 0) {\n    if (isRegExp(value)) {\n      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');\n    } else {\n      return ctx.stylize('[Object]', 'special');\n    }\n  }\n\n  ctx.seen.push(value);\n\n  var output;\n  if (array) {\n    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);\n  } else {\n    output = keys.map(function(key) {\n      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);\n    });\n  }\n\n  ctx.seen.pop();\n\n  return reduceToSingleString(output, base, braces);\n}\n\n\nfunction formatPrimitive(ctx, value) {\n  if (isUndefined(value))\n    return ctx.stylize('undefined', 'undefined');\n  if (isString(value)) {\n    var simple = '\\'' + JSON.stringify(value).replace(/^\"|\"$/g, '')\n                                             .replace(/'/g, \"\\\\'\")\n                                             .replace(/\\\\\"/g, '\"') + '\\'';\n    return ctx.stylize(simple, 'string');\n  }\n  if (isNumber(value))\n    return ctx.stylize('' + value, 'number');\n  if (isBoolean(value))\n    return ctx.stylize('' + value, 'boolean');\n  // For some reason typeof null is \"object\", so special case here.\n  if (isNull(value))\n    return ctx.stylize('null', 'null');\n}\n\n\nfunction formatError(value) {\n  return '[' + Error.prototype.toString.call(value) + ']';\n}\n\n\nfunction formatArray(ctx, value, recurseTimes, visibleKeys, keys) {\n  var output = [];\n  for (var i = 0, l = value.length; i < l; ++i) {\n    if (hasOwnProperty(value, String(i))) {\n      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,\n          String(i), true));\n    } else {\n      output.push('');\n    }\n  }\n  keys.forEach(function(key) {\n    if (!key.match(/^\\d+$/)) {\n      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,\n          key, true));\n    }\n  });\n  return output;\n}\n\n\nfunction formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {\n  var name, str, desc;\n  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };\n  if (desc.get) {\n    if (desc.set) {\n      str = ctx.stylize('[Getter/Setter]', 'special');\n    } else {\n      str = ctx.stylize('[Getter]', 'special');\n    }\n  } else {\n    if (desc.set) {\n      str = ctx.stylize('[Setter]', 'special');\n    }\n  }\n  if (!hasOwnProperty(visibleKeys, key)) {\n    name = '[' + key + ']';\n  }\n  if (!str) {\n    if (ctx.seen.indexOf(desc.value) < 0) {\n      if (isNull(recurseTimes)) {\n        str = formatValue(ctx, desc.value, null);\n      } else {\n        str = formatValue(ctx, desc.value, recurseTimes - 1);\n      }\n      if (str.indexOf('\\n') > -1) {\n        if (array) {\n          str = str.split('\\n').map(function(line) {\n            return '  ' + line;\n          }).join('\\n').substr(2);\n        } else {\n          str = '\\n' + str.split('\\n').map(function(line) {\n            return '   ' + line;\n          }).join('\\n');\n        }\n      }\n    } else {\n      str = ctx.stylize('[Circular]', 'special');\n    }\n  }\n  if (isUndefined(name)) {\n    if (array && key.match(/^\\d+$/)) {\n      return str;\n    }\n    name = JSON.stringify('' + key);\n    if (name.match(/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)) {\n      name = name.substr(1, name.length - 2);\n      name = ctx.stylize(name, 'name');\n    } else {\n      name = name.replace(/'/g, \"\\\\'\")\n                 .replace(/\\\\\"/g, '\"')\n                 .replace(/(^\"|\"$)/g, \"'\");\n      name = ctx.stylize(name, 'string');\n    }\n  }\n\n  return name + ': ' + str;\n}\n\n\nfunction reduceToSingleString(output, base, braces) {\n  var numLinesEst = 0;\n  var length = output.reduce(function(prev, cur) {\n    numLinesEst++;\n    if (cur.indexOf('\\n') >= 0) numLinesEst++;\n    return prev + cur.replace(/\\u001b\\[\\d\\d?m/g, '').length + 1;\n  }, 0);\n\n  if (length > 60) {\n    return braces[0] +\n           (base === '' ? '' : base + '\\n ') +\n           ' ' +\n           output.join(',\\n  ') +\n           ' ' +\n           braces[1];\n  }\n\n  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];\n}\n\n\n// NOTE: These type checking functions intentionally don't use `instanceof`\n// because it is fragile and can be easily faked with `Object.create()`.\nfunction isArray(ar) {\n  return Array.isArray(ar);\n}\nexports.isArray = isArray;\n\nfunction isBoolean(arg) {\n  return typeof arg === 'boolean';\n}\nexports.isBoolean = isBoolean;\n\nfunction isNull(arg) {\n  return arg === null;\n}\nexports.isNull = isNull;\n\nfunction isNullOrUndefined(arg) {\n  return arg == null;\n}\nexports.isNullOrUndefined = isNullOrUndefined;\n\nfunction isNumber(arg) {\n  return typeof arg === 'number';\n}\nexports.isNumber = isNumber;\n\nfunction isString(arg) {\n  return typeof arg === 'string';\n}\nexports.isString = isString;\n\nfunction isSymbol(arg) {\n  return typeof arg === 'symbol';\n}\nexports.isSymbol = isSymbol;\n\nfunction isUndefined(arg) {\n  return arg === void 0;\n}\nexports.isUndefined = isUndefined;\n\nfunction isRegExp(re) {\n  return isObject(re) && objectToString(re) === '[object RegExp]';\n}\nexports.isRegExp = isRegExp;\n\nfunction isObject(arg) {\n  return typeof arg === 'object' && arg !== null;\n}\nexports.isObject = isObject;\n\nfunction isDate(d) {\n  return isObject(d) && objectToString(d) === '[object Date]';\n}\nexports.isDate = isDate;\n\nfunction isError(e) {\n  return isObject(e) &&\n      (objectToString(e) === '[object Error]' || e instanceof Error);\n}\nexports.isError = isError;\n\nfunction isFunction(arg) {\n  return typeof arg === 'function';\n}\nexports.isFunction = isFunction;\n\nfunction isPrimitive(arg) {\n  return arg === null ||\n         typeof arg === 'boolean' ||\n         typeof arg === 'number' ||\n         typeof arg === 'string' ||\n         typeof arg === 'symbol' ||  // ES6 symbol\n         typeof arg === 'undefined';\n}\nexports.isPrimitive = isPrimitive;\n\nexports.isBuffer = require('./support/isBuffer');\n\nfunction objectToString(o) {\n  return Object.prototype.toString.call(o);\n}\n\n\nfunction pad(n) {\n  return n < 10 ? '0' + n.toString(10) : n.toString(10);\n}\n\n\nvar months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',\n              'Oct', 'Nov', 'Dec'];\n\n// 26 Feb 16:19:34\nfunction timestamp() {\n  var d = new Date();\n  var time = [pad(d.getHours()),\n              pad(d.getMinutes()),\n              pad(d.getSeconds())].join(':');\n  return [d.getDate(), months[d.getMonth()], time].join(' ');\n}\n\n\n// log is just a thin wrapper to console.log that prepends a timestamp\nexports.log = function() {\n  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));\n};\n\n\n/**\n * Inherit the prototype methods from one constructor into another.\n *\n * The Function.prototype.inherits from lang.js rewritten as a standalone\n * function (not on Function.prototype). NOTE: If this file is to be loaded\n * during bootstrapping this function needs to be rewritten using some native\n * functions as prototype setup using normal JavaScript does not work as\n * expected during bootstrapping (see mirror.js in r114903).\n *\n * @param {function} ctor Constructor function which needs to inherit the\n *     prototype.\n * @param {function} superCtor Constructor function to inherit prototype from.\n */\nexports.inherits = require('inherits');\n\nexports._extend = function(origin, add) {\n  // Don't do anything if add isn't an object\n  if (!add || !isObject(add)) return origin;\n\n  var keys = Object.keys(add);\n  var i = keys.length;\n  while (i--) {\n    origin[keys[i]] = add[keys[i]];\n  }\n  return origin;\n};\n\nfunction hasOwnProperty(obj, prop) {\n  return Object.prototype.hasOwnProperty.call(obj, prop);\n}\n\n}).call(this,require('_process'),typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{\"./support/isBuffer\":65,\"_process\":51,\"inherits\":48}],67:[function(require,module,exports){\n/* See LICENSE file for terms of use */\n\n/*\n * Text diff implementation.\n *\n * This library supports the following APIS:\n * JsDiff.diffChars: Character by character diff\n * JsDiff.diffWords: Word (as defined by \\b regex) diff which ignores whitespace\n * JsDiff.diffLines: Line based diff\n *\n * JsDiff.diffCss: Diff targeted at CSS content\n *\n * These methods are based on the implementation proposed in\n * \"An O(ND) Difference Algorithm and its Variations\" (Myers, 1986).\n * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927\n */\n(function(global, undefined) {\n  var objectPrototypeToString = Object.prototype.toString;\n\n  /*istanbul ignore next*/\n  function map(arr, mapper, that) {\n    if (Array.prototype.map) {\n      return Array.prototype.map.call(arr, mapper, that);\n    }\n\n    var other = new Array(arr.length);\n\n    for (var i = 0, n = arr.length; i < n; i++) {\n      other[i] = mapper.call(that, arr[i], i, arr);\n    }\n    return other;\n  }\n  function clonePath(path) {\n    return { newPos: path.newPos, components: path.components.slice(0) };\n  }\n  function removeEmpty(array) {\n    var ret = [];\n    for (var i = 0; i < array.length; i++) {\n      if (array[i]) {\n        ret.push(array[i]);\n      }\n    }\n    return ret;\n  }\n  function escapeHTML(s) {\n    var n = s;\n    n = n.replace(/&/g, '&amp;');\n    n = n.replace(/</g, '&lt;');\n    n = n.replace(/>/g, '&gt;');\n    n = n.replace(/\"/g, '&quot;');\n\n    return n;\n  }\n\n  // This function handles the presence of circular references by bailing out when encountering an\n  // object that is already on the \"stack\" of items being processed.\n  function canonicalize(obj, stack, replacementStack) {\n    stack = stack || [];\n    replacementStack = replacementStack || [];\n\n    var i;\n\n    for (i = 0; i < stack.length; i += 1) {\n      if (stack[i] === obj) {\n        return replacementStack[i];\n      }\n    }\n\n    var canonicalizedObj;\n\n    if ('[object Array]' === objectPrototypeToString.call(obj)) {\n      stack.push(obj);\n      canonicalizedObj = new Array(obj.length);\n      replacementStack.push(canonicalizedObj);\n      for (i = 0; i < obj.length; i += 1) {\n        canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack);\n      }\n      stack.pop();\n      replacementStack.pop();\n    } else if (typeof obj === 'object' && obj !== null) {\n      stack.push(obj);\n      canonicalizedObj = {};\n      replacementStack.push(canonicalizedObj);\n      var sortedKeys = [],\n          key;\n      for (key in obj) {\n        sortedKeys.push(key);\n      }\n      sortedKeys.sort();\n      for (i = 0; i < sortedKeys.length; i += 1) {\n        key = sortedKeys[i];\n        canonicalizedObj[key] = canonicalize(obj[key], stack, replacementStack);\n      }\n      stack.pop();\n      replacementStack.pop();\n    } else {\n      canonicalizedObj = obj;\n    }\n    return canonicalizedObj;\n  }\n\n  function buildValues(components, newString, oldString, useLongestToken) {\n    var componentPos = 0,\n        componentLen = components.length,\n        newPos = 0,\n        oldPos = 0;\n\n    for (; componentPos < componentLen; componentPos++) {\n      var component = components[componentPos];\n      if (!component.removed) {\n        if (!component.added && useLongestToken) {\n          var value = newString.slice(newPos, newPos + component.count);\n          value = map(value, function(value, i) {\n            var oldValue = oldString[oldPos + i];\n            return oldValue.length > value.length ? oldValue : value;\n          });\n\n          component.value = value.join('');\n        } else {\n          component.value = newString.slice(newPos, newPos + component.count).join('');\n        }\n        newPos += component.count;\n\n        // Common case\n        if (!component.added) {\n          oldPos += component.count;\n        }\n      } else {\n        component.value = oldString.slice(oldPos, oldPos + component.count).join('');\n        oldPos += component.count;\n\n        // Reverse add and remove so removes are output first to match common convention\n        // The diffing algorithm is tied to add then remove output and this is the simplest\n        // route to get the desired output with minimal overhead.\n        if (componentPos && components[componentPos - 1].added) {\n          var tmp = components[componentPos - 1];\n          components[componentPos - 1] = components[componentPos];\n          components[componentPos] = tmp;\n        }\n      }\n    }\n\n    return components;\n  }\n\n  function Diff(ignoreWhitespace) {\n    this.ignoreWhitespace = ignoreWhitespace;\n  }\n  Diff.prototype = {\n    diff: function(oldString, newString, callback) {\n      var self = this;\n\n      function done(value) {\n        if (callback) {\n          setTimeout(function() { callback(undefined, value); }, 0);\n          return true;\n        } else {\n          return value;\n        }\n      }\n\n      // Handle the identity case (this is due to unrolling editLength == 0\n      if (newString === oldString) {\n        return done([{ value: newString }]);\n      }\n      if (!newString) {\n        return done([{ value: oldString, removed: true }]);\n      }\n      if (!oldString) {\n        return done([{ value: newString, added: true }]);\n      }\n\n      newString = this.tokenize(newString);\n      oldString = this.tokenize(oldString);\n\n      var newLen = newString.length, oldLen = oldString.length;\n      var editLength = 1;\n      var maxEditLength = newLen + oldLen;\n      var bestPath = [{ newPos: -1, components: [] }];\n\n      // Seed editLength = 0, i.e. the content starts with the same values\n      var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);\n      if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {\n        // Identity per the equality and tokenizer\n        return done([{value: newString.join('')}]);\n      }\n\n      // Main worker method. checks all permutations of a given edit length for acceptance.\n      function execEditLength() {\n        for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {\n          var basePath;\n          var addPath = bestPath[diagonalPath - 1],\n              removePath = bestPath[diagonalPath + 1],\n              oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;\n          if (addPath) {\n            // No one else is going to attempt to use this value, clear it\n            bestPath[diagonalPath - 1] = undefined;\n          }\n\n          var canAdd = addPath && addPath.newPos + 1 < newLen,\n              canRemove = removePath && 0 <= oldPos && oldPos < oldLen;\n          if (!canAdd && !canRemove) {\n            // If this path is a terminal then prune\n            bestPath[diagonalPath] = undefined;\n            continue;\n          }\n\n          // Select the diagonal that we want to branch from. We select the prior\n          // path whose position in the new string is the farthest from the origin\n          // and does not pass the bounds of the diff graph\n          if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {\n            basePath = clonePath(removePath);\n            self.pushComponent(basePath.components, undefined, true);\n          } else {\n            basePath = addPath;   // No need to clone, we've pulled it from the list\n            basePath.newPos++;\n            self.pushComponent(basePath.components, true, undefined);\n          }\n\n          oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath);\n\n          // If we have hit the end of both strings, then we are done\n          if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {\n            return done(buildValues(basePath.components, newString, oldString, self.useLongestToken));\n          } else {\n            // Otherwise track this path as a potential candidate and continue.\n            bestPath[diagonalPath] = basePath;\n          }\n        }\n\n        editLength++;\n      }\n\n      // Performs the length of edit iteration. Is a bit fugly as this has to support the\n      // sync and async mode which is never fun. Loops over execEditLength until a value\n      // is produced.\n      if (callback) {\n        (function exec() {\n          setTimeout(function() {\n            // This should not happen, but we want to be safe.\n            /*istanbul ignore next */\n            if (editLength > maxEditLength) {\n              return callback();\n            }\n\n            if (!execEditLength()) {\n              exec();\n            }\n          }, 0);\n        }());\n      } else {\n        while (editLength <= maxEditLength) {\n          var ret = execEditLength();\n          if (ret) {\n            return ret;\n          }\n        }\n      }\n    },\n\n    pushComponent: function(components, added, removed) {\n      var last = components[components.length - 1];\n      if (last && last.added === added && last.removed === removed) {\n        // We need to clone here as the component clone operation is just\n        // as shallow array clone\n        components[components.length - 1] = {count: last.count + 1, added: added, removed: removed };\n      } else {\n        components.push({count: 1, added: added, removed: removed });\n      }\n    },\n    extractCommon: function(basePath, newString, oldString, diagonalPath) {\n      var newLen = newString.length,\n          oldLen = oldString.length,\n          newPos = basePath.newPos,\n          oldPos = newPos - diagonalPath,\n\n          commonCount = 0;\n      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {\n        newPos++;\n        oldPos++;\n        commonCount++;\n      }\n\n      if (commonCount) {\n        basePath.components.push({count: commonCount});\n      }\n\n      basePath.newPos = newPos;\n      return oldPos;\n    },\n\n    equals: function(left, right) {\n      var reWhitespace = /\\S/;\n      return left === right || (this.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right));\n    },\n    tokenize: function(value) {\n      return value.split('');\n    }\n  };\n\n  var CharDiff = new Diff();\n\n  var WordDiff = new Diff(true);\n  var WordWithSpaceDiff = new Diff();\n  WordDiff.tokenize = WordWithSpaceDiff.tokenize = function(value) {\n    return removeEmpty(value.split(/(\\s+|\\b)/));\n  };\n\n  var CssDiff = new Diff(true);\n  CssDiff.tokenize = function(value) {\n    return removeEmpty(value.split(/([{}:;,]|\\s+)/));\n  };\n\n  var LineDiff = new Diff();\n\n  var TrimmedLineDiff = new Diff();\n  TrimmedLineDiff.ignoreTrim = true;\n\n  LineDiff.tokenize = TrimmedLineDiff.tokenize = function(value) {\n    var retLines = [],\n        lines = value.split(/^/m);\n    for (var i = 0; i < lines.length; i++) {\n      var line = lines[i],\n          lastLine = lines[i - 1],\n          lastLineLastChar = lastLine && lastLine[lastLine.length - 1];\n\n      // Merge lines that may contain windows new lines\n      if (line === '\\n' && lastLineLastChar === '\\r') {\n          retLines[retLines.length - 1] = retLines[retLines.length - 1].slice(0, -1) + '\\r\\n';\n      } else {\n        if (this.ignoreTrim) {\n          line = line.trim();\n          // add a newline unless this is the last line.\n          if (i < lines.length - 1) {\n            line += '\\n';\n          }\n        }\n        retLines.push(line);\n      }\n    }\n\n    return retLines;\n  };\n\n  var PatchDiff = new Diff();\n  PatchDiff.tokenize = function(value) {\n    var ret = [],\n        linesAndNewlines = value.split(/(\\n|\\r\\n)/);\n\n    // Ignore the final empty token that occurs if the string ends with a new line\n    if (!linesAndNewlines[linesAndNewlines.length - 1]) {\n      linesAndNewlines.pop();\n    }\n\n    // Merge the content and line separators into single tokens\n    for (var i = 0; i < linesAndNewlines.length; i++) {\n      var line = linesAndNewlines[i];\n\n      if (i % 2) {\n        ret[ret.length - 1] += line;\n      } else {\n        ret.push(line);\n      }\n    }\n    return ret;\n  };\n\n  var SentenceDiff = new Diff();\n  SentenceDiff.tokenize = function(value) {\n    return removeEmpty(value.split(/(\\S.+?[.!?])(?=\\s+|$)/));\n  };\n\n  var JsonDiff = new Diff();\n  // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a\n  // dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:\n  JsonDiff.useLongestToken = true;\n  JsonDiff.tokenize = LineDiff.tokenize;\n  JsonDiff.equals = function(left, right) {\n    return LineDiff.equals(left.replace(/,([\\r\\n])/g, '$1'), right.replace(/,([\\r\\n])/g, '$1'));\n  };\n\n  var JsDiff = {\n    Diff: Diff,\n\n    diffChars: function(oldStr, newStr, callback) { return CharDiff.diff(oldStr, newStr, callback); },\n    diffWords: function(oldStr, newStr, callback) { return WordDiff.diff(oldStr, newStr, callback); },\n    diffWordsWithSpace: function(oldStr, newStr, callback) { return WordWithSpaceDiff.diff(oldStr, newStr, callback); },\n    diffLines: function(oldStr, newStr, callback) { return LineDiff.diff(oldStr, newStr, callback); },\n    diffTrimmedLines: function(oldStr, newStr, callback) { return TrimmedLineDiff.diff(oldStr, newStr, callback); },\n\n    diffSentences: function(oldStr, newStr, callback) { return SentenceDiff.diff(oldStr, newStr, callback); },\n\n    diffCss: function(oldStr, newStr, callback) { return CssDiff.diff(oldStr, newStr, callback); },\n    diffJson: function(oldObj, newObj, callback) {\n      return JsonDiff.diff(\n        typeof oldObj === 'string' ? oldObj : JSON.stringify(canonicalize(oldObj), undefined, '  '),\n        typeof newObj === 'string' ? newObj : JSON.stringify(canonicalize(newObj), undefined, '  '),\n        callback\n      );\n    },\n\n    createTwoFilesPatch: function(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader) {\n      var ret = [];\n\n      if (oldFileName == newFileName) {\n        ret.push('Index: ' + oldFileName);\n      }\n      ret.push('===================================================================');\n      ret.push('--- ' + oldFileName + (typeof oldHeader === 'undefined' ? '' : '\\t' + oldHeader));\n      ret.push('+++ ' + newFileName + (typeof newHeader === 'undefined' ? '' : '\\t' + newHeader));\n\n      var diff = PatchDiff.diff(oldStr, newStr);\n      diff.push({value: '', lines: []});   // Append an empty value to make cleanup easier\n\n      // Formats a given set of lines for printing as context lines in a patch\n      function contextLines(lines) {\n        return map(lines, function(entry) { return ' ' + entry; });\n      }\n\n      // Outputs the no newline at end of file warning if needed\n      function eofNL(curRange, i, current) {\n        var last = diff[diff.length - 2],\n            isLast = i === diff.length - 2,\n            isLastOfType = i === diff.length - 3 && current.added !== last.added;\n\n        // Figure out if this is the last line for the given file and missing NL\n        if (!(/\\n$/.test(current.value)) && (isLast || isLastOfType)) {\n          curRange.push('\\\\ No newline at end of file');\n        }\n      }\n\n      var oldRangeStart = 0, newRangeStart = 0, curRange = [],\n          oldLine = 1, newLine = 1;\n      for (var i = 0; i < diff.length; i++) {\n        var current = diff[i],\n            lines = current.lines || current.value.replace(/\\n$/, '').split('\\n');\n        current.lines = lines;\n\n        if (current.added || current.removed) {\n          // If we have previous context, start with that\n          if (!oldRangeStart) {\n            var prev = diff[i - 1];\n            oldRangeStart = oldLine;\n            newRangeStart = newLine;\n\n            if (prev) {\n              curRange = contextLines(prev.lines.slice(-4));\n              oldRangeStart -= curRange.length;\n              newRangeStart -= curRange.length;\n            }\n          }\n\n          // Output our changes\n          curRange.push.apply(curRange, map(lines, function(entry) {\n            return (current.added ? '+' : '-') + entry;\n          }));\n          eofNL(curRange, i, current);\n\n          // Track the updated file position\n          if (current.added) {\n            newLine += lines.length;\n          } else {\n            oldLine += lines.length;\n          }\n        } else {\n          // Identical context lines. Track line changes\n          if (oldRangeStart) {\n            // Close out any changes that have been output (or join overlapping)\n            if (lines.length <= 8 && i < diff.length - 2) {\n              // Overlapping\n              curRange.push.apply(curRange, contextLines(lines));\n            } else {\n              // end the range and output\n              var contextSize = Math.min(lines.length, 4);\n              ret.push(\n                  '@@ -' + oldRangeStart + ',' + (oldLine - oldRangeStart + contextSize)\n                  + ' +' + newRangeStart + ',' + (newLine - newRangeStart + contextSize)\n                  + ' @@');\n              ret.push.apply(ret, curRange);\n              ret.push.apply(ret, contextLines(lines.slice(0, contextSize)));\n              if (lines.length <= 4) {\n                eofNL(ret, i, current);\n              }\n\n              oldRangeStart = 0;\n              newRangeStart = 0;\n              curRange = [];\n            }\n          }\n          oldLine += lines.length;\n          newLine += lines.length;\n        }\n      }\n\n      return ret.join('\\n') + '\\n';\n    },\n\n    createPatch: function(fileName, oldStr, newStr, oldHeader, newHeader) {\n      return JsDiff.createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader);\n    },\n\n    applyPatch: function(oldStr, uniDiff) {\n      var diffstr = uniDiff.split('\\n'),\n          hunks = [],\n          i = 0,\n          remEOFNL = false,\n          addEOFNL = false;\n\n      // Skip to the first change hunk\n      while (i < diffstr.length && !(/^@@/.test(diffstr[i]))) {\n        i++;\n      }\n\n      // Parse the unified diff\n      for (; i < diffstr.length; i++) {\n        if (diffstr[i][0] === '@') {\n          var chnukHeader = diffstr[i].split(/@@ -(\\d+),(\\d+) \\+(\\d+),(\\d+) @@/);\n          hunks.unshift({\n            start: chnukHeader[3],\n            oldlength: +chnukHeader[2],\n            removed: [],\n            newlength: chnukHeader[4],\n            added: []\n          });\n        } else if (diffstr[i][0] === '+') {\n          hunks[0].added.push(diffstr[i].substr(1));\n        } else if (diffstr[i][0] === '-') {\n          hunks[0].removed.push(diffstr[i].substr(1));\n        } else if (diffstr[i][0] === ' ') {\n          hunks[0].added.push(diffstr[i].substr(1));\n          hunks[0].removed.push(diffstr[i].substr(1));\n        } else if (diffstr[i][0] === '\\\\') {\n          if (diffstr[i - 1][0] === '+') {\n            remEOFNL = true;\n          } else if (diffstr[i - 1][0] === '-') {\n            addEOFNL = true;\n          }\n        }\n      }\n\n      // Apply the diff to the input\n      var lines = oldStr.split('\\n');\n      for (i = hunks.length - 1; i >= 0; i--) {\n        var hunk = hunks[i];\n        // Sanity check the input string. Bail if we don't match.\n        for (var j = 0; j < hunk.oldlength; j++) {\n          if (lines[hunk.start - 1 + j] !== hunk.removed[j]) {\n            return false;\n          }\n        }\n        Array.prototype.splice.apply(lines, [hunk.start - 1, hunk.oldlength].concat(hunk.added));\n      }\n\n      // Handle EOFNL insertion/removal\n      if (remEOFNL) {\n        while (!lines[lines.length - 1]) {\n          lines.pop();\n        }\n      } else if (addEOFNL) {\n        lines.push('');\n      }\n      return lines.join('\\n');\n    },\n\n    convertChangesToXML: function(changes) {\n      var ret = [];\n      for (var i = 0; i < changes.length; i++) {\n        var change = changes[i];\n        if (change.added) {\n          ret.push('<ins>');\n        } else if (change.removed) {\n          ret.push('<del>');\n        }\n\n        ret.push(escapeHTML(change.value));\n\n        if (change.added) {\n          ret.push('</ins>');\n        } else if (change.removed) {\n          ret.push('</del>');\n        }\n      }\n      return ret.join('');\n    },\n\n    // See: http://code.google.com/p/google-diff-match-patch/wiki/API\n    convertChangesToDMP: function(changes) {\n      var ret = [],\n          change,\n          operation;\n      for (var i = 0; i < changes.length; i++) {\n        change = changes[i];\n        if (change.added) {\n          operation = 1;\n        } else if (change.removed) {\n          operation = -1;\n        } else {\n          operation = 0;\n        }\n\n        ret.push([operation, change.value]);\n      }\n      return ret;\n    },\n\n    canonicalize: canonicalize\n  };\n\n  /*istanbul ignore next */\n  /*global module */\n  if (typeof module !== 'undefined' && module.exports) {\n    module.exports = JsDiff;\n  } else if (typeof define === 'function' && define.amd) {\n    /*global define */\n    define([], function() { return JsDiff; });\n  } else if (typeof global.JsDiff === 'undefined') {\n    global.JsDiff = JsDiff;\n  }\n}(this));\n\n},{}],68:[function(require,module,exports){\n'use strict';\n\nvar matchOperatorsRe = /[|\\\\{}()[\\]^$+*?.]/g;\n\nmodule.exports = function (str) {\n\tif (typeof str !== 'string') {\n\t\tthrow new TypeError('Expected a string');\n\t}\n\n\treturn str.replace(matchOperatorsRe,  '\\\\$&');\n};\n\n},{}],69:[function(require,module,exports){\n(function (process){\n// Growl - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)\n\n/**\n * Module dependencies.\n */\n\nvar exec = require('child_process').exec\n  , fs = require('fs')\n  , path = require('path')\n  , exists = fs.existsSync || path.existsSync\n  , os = require('os')\n  , quote = JSON.stringify\n  , cmd;\n\nfunction which(name) {\n  var paths = process.env.PATH.split(':');\n  var loc;\n  \n  for (var i = 0, len = paths.length; i < len; ++i) {\n    loc = path.join(paths[i], name);\n    if (exists(loc)) return loc;\n  }\n}\n\nswitch(os.type()) {\n  case 'Darwin':\n    if (which('terminal-notifier')) {\n      cmd = {\n          type: \"Darwin-NotificationCenter\"\n        , pkg: \"terminal-notifier\"\n        , msg: '-message'\n        , title: '-title'\n        , subtitle: '-subtitle'\n        , priority: {\n              cmd: '-execute'\n            , range: []\n          }\n      };\n    } else {\n      cmd = {\n          type: \"Darwin-Growl\"\n        , pkg: \"growlnotify\"\n        , msg: '-m'\n        , sticky: '--sticky'\n        , priority: {\n              cmd: '--priority'\n            , range: [\n                -2\n              , -1\n              , 0\n              , 1\n              , 2\n              , \"Very Low\"\n              , \"Moderate\"\n              , \"Normal\"\n              , \"High\"\n              , \"Emergency\"\n            ]\n          }\n      };\n    }\n    break;\n  case 'Linux':\n    cmd = {\n        type: \"Linux\"\n      , pkg: \"notify-send\"\n      , msg: ''\n      , sticky: '-t 0'\n      , icon: '-i'\n      , priority: {\n          cmd: '-u'\n        , range: [\n            \"low\"\n          , \"normal\"\n          , \"critical\"\n        ]\n      }\n    };\n    break;\n  case 'Windows_NT':\n    cmd = {\n        type: \"Windows\"\n      , pkg: \"growlnotify\"\n      , msg: ''\n      , sticky: '/s:true'\n      , title: '/t:'\n      , icon: '/i:'\n      , priority: {\n            cmd: '/p:'\n          , range: [\n              -2\n            , -1\n            , 0\n            , 1\n            , 2\n          ]\n        }\n    };\n    break;\n}\n\n/**\n * Expose `growl`.\n */\n\nexports = module.exports = growl;\n\n/**\n * Node-growl version.\n */\n\nexports.version = '1.4.1'\n\n/**\n * Send growl notification _msg_ with _options_.\n *\n * Options:\n *\n *  - title   Notification title\n *  - sticky  Make the notification stick (defaults to false)\n *  - priority  Specify an int or named key (default is 0)\n *  - name    Application name (defaults to growlnotify)\n *  - image\n *    - path to an icon sets --iconpath\n *    - path to an image sets --image\n *    - capitalized word sets --appIcon\n *    - filename uses extname as --icon\n *    - otherwise treated as --icon\n *\n * Examples:\n *\n *   growl('New email')\n *   growl('5 new emails', { title: 'Thunderbird' })\n *   growl('Email sent', function(){\n *     // ... notification sent\n *   })\n *\n * @param {string} msg\n * @param {object} options\n * @param {function} fn\n * @api public\n */\n\nfunction growl(msg, options, fn) {\n  var image\n    , args\n    , options = options || {}\n    , fn = fn || function(){};\n\n  // noop\n  if (!cmd) return fn(new Error('growl not supported on this platform'));\n  args = [cmd.pkg];\n\n  // image\n  if (image = options.image) {\n    switch(cmd.type) {\n      case 'Darwin-Growl':\n        var flag, ext = path.extname(image).substr(1)\n        flag = flag || ext == 'icns' && 'iconpath'\n        flag = flag || /^[A-Z]/.test(image) && 'appIcon'\n        flag = flag || /^png|gif|jpe?g$/.test(ext) && 'image'\n        flag = flag || ext && (image = ext) && 'icon'\n        flag = flag || 'icon'\n        args.push('--' + flag, quote(image))\n        break;\n      case 'Linux':\n        args.push(cmd.icon, quote(image));\n        // libnotify defaults to sticky, set a hint for transient notifications\n        if (!options.sticky) args.push('--hint=int:transient:1');\n        break;\n      case 'Windows':\n        args.push(cmd.icon + quote(image));\n        break;\n    }\n  }\n\n  // sticky\n  if (options.sticky) args.push(cmd.sticky);\n\n  // priority\n  if (options.priority) {\n    var priority = options.priority + '';\n    var checkindexOf = cmd.priority.range.indexOf(priority);\n    if (~cmd.priority.range.indexOf(priority)) {\n      args.push(cmd.priority, options.priority);\n    }\n  }\n\n  // name\n  if (options.name && cmd.type === \"Darwin-Growl\") {\n    args.push('--name', options.name);\n  }\n\n  switch(cmd.type) {\n    case 'Darwin-Growl':\n      args.push(cmd.msg);\n      args.push(quote(msg));\n      if (options.title) args.push(quote(options.title));\n      break;\n    case 'Darwin-NotificationCenter':\n      args.push(cmd.msg);\n      args.push(quote(msg));\n      if (options.title) {\n        args.push(cmd.title);\n        args.push(quote(options.title));\n      }\n      if (options.subtitle) {\n        args.push(cmd.subtitle);\n        args.push(quote(options.subtitle));\n      }\n      break;\n    case 'Darwin-Growl':\n      args.push(cmd.msg);\n      args.push(quote(msg));\n      if (options.title) args.push(quote(options.title));\n      break;\n    case 'Linux':\n      if (options.title) {\n        args.push(quote(options.title));\n        args.push(cmd.msg);\n        args.push(quote(msg));\n      } else {\n        args.push(quote(msg));\n      }\n      break;\n    case 'Windows':\n      args.push(quote(msg));\n      if (options.title) args.push(cmd.title + quote(options.title));\n      break;\n  }\n\n  // execute\n  exec(args.join(' '), fn);\n};\n\n}).call(this,require('_process'))\n},{\"_process\":51,\"child_process\":41,\"fs\":41,\"os\":50,\"path\":41}],70:[function(require,module,exports){\n(function (process,global){\n/**\n * Shim process.stdout.\n */\n\nprocess.stdout = require('browser-stdout')();\n\nvar Mocha = require('../');\n\n/**\n * Create a Mocha instance.\n *\n * @return {undefined}\n */\n\nvar mocha = new Mocha({ reporter: 'html' });\n\n/**\n * Save timer references to avoid Sinon interfering (see GH-237).\n */\n\nvar Date = global.Date;\nvar setTimeout = global.setTimeout;\nvar setInterval = global.setInterval;\nvar clearTimeout = global.clearTimeout;\nvar clearInterval = global.clearInterval;\n\nvar uncaughtExceptionHandlers = [];\n\nvar originalOnerrorHandler = global.onerror;\n\n/**\n * Remove uncaughtException listener.\n * Revert to original onerror handler if previously defined.\n */\n\nprocess.removeListener = function(e, fn){\n  if ('uncaughtException' == e) {\n    if (originalOnerrorHandler) {\n      global.onerror = originalOnerrorHandler;\n    } else {\n      global.onerror = function() {};\n    }\n    var i = Mocha.utils.indexOf(uncaughtExceptionHandlers, fn);\n    if (i != -1) { uncaughtExceptionHandlers.splice(i, 1); }\n  }\n};\n\n/**\n * Implements uncaughtException listener.\n */\n\nprocess.on = function(e, fn){\n  if ('uncaughtException' == e) {\n    global.onerror = function(err, url, line){\n      fn(new Error(err + ' (' + url + ':' + line + ')'));\n      return !mocha.allowUncaught;\n    };\n    uncaughtExceptionHandlers.push(fn);\n  }\n};\n\n// The BDD UI is registered by default, but no UI will be functional in the\n// browser without an explicit call to the overridden `mocha.ui` (see below).\n// Ensure that this default UI does not expose its methods to the global scope.\nmocha.suite.removeAllListeners('pre-require');\n\nvar immediateQueue = []\n  , immediateTimeout;\n\nfunction timeslice() {\n  var immediateStart = new Date().getTime();\n  while (immediateQueue.length && (new Date().getTime() - immediateStart) < 100) {\n    immediateQueue.shift()();\n  }\n  if (immediateQueue.length) {\n    immediateTimeout = setTimeout(timeslice, 0);\n  } else {\n    immediateTimeout = null;\n  }\n}\n\n/**\n * High-performance override of Runner.immediately.\n */\n\nMocha.Runner.immediately = function(callback) {\n  immediateQueue.push(callback);\n  if (!immediateTimeout) {\n    immediateTimeout = setTimeout(timeslice, 0);\n  }\n};\n\n/**\n * Function to allow assertion libraries to throw errors directly into mocha.\n * This is useful when running tests in a browser because window.onerror will\n * only receive the 'message' attribute of the Error.\n */\nmocha.throwError = function(err) {\n  Mocha.utils.forEach(uncaughtExceptionHandlers, function (fn) {\n    fn(err);\n  });\n  throw err;\n};\n\n/**\n * Override ui to ensure that the ui functions are initialized.\n * Normally this would happen in Mocha.prototype.loadFiles.\n */\n\nmocha.ui = function(ui){\n  Mocha.prototype.ui.call(this, ui);\n  this.suite.emit('pre-require', global, null, this);\n  return this;\n};\n\n/**\n * Setup mocha with the given setting options.\n */\n\nmocha.setup = function(opts){\n  if ('string' == typeof opts) opts = { ui: opts };\n  for (var opt in opts) this[opt](opts[opt]);\n  return this;\n};\n\n/**\n * Run mocha, returning the Runner.\n */\n\nmocha.run = function(fn){\n  var options = mocha.options;\n  mocha.globals('location');\n\n  var query = Mocha.utils.parseQuery(global.location.search || '');\n  if (query.grep) mocha.grep(new RegExp(query.grep));\n  if (query.fgrep) mocha.grep(query.fgrep);\n  if (query.invert) mocha.invert();\n\n  return Mocha.prototype.run.call(mocha, function(err){\n    // The DOM Document is not available in Web Workers.\n    var document = global.document;\n    if (document && document.getElementById('mocha') && options.noHighlighting !== true) {\n      Mocha.utils.highlightTags('code');\n    }\n    if (fn) fn(err);\n  });\n};\n\n/**\n * Expose the process shim.\n * https://github.com/mochajs/mocha/pull/916\n */\n\nMocha.process = process;\n\n/**\n * Expose mocha.\n */\n\nwindow.Mocha = Mocha;\nwindow.mocha = mocha;\n\n}).call(this,require('_process'),typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{\"../\":1,\"_process\":51,\"browser-stdout\":40}]},{},[70]);\n"

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(22);
	__webpack_require__(62);
	__webpack_require__(63);

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var chai = __webpack_require__(23);
	var assert = chai.assert;
	var Tile = __webpack_require__(1);

	describe('Tile', function () {
	  it('can move up', function () {
	    var tile = new Tile(1, 0, 7);
	    tile.move('up');

	    assert.equal(tile.column, 0);
	    assert.equal(tile.row, 6);
	  });

	  it('can move right', function () {
	    var tile = new Tile(1, 0, 0);
	    tile.move('right');

	    assert.equal(tile.column, 1);
	    assert.equal(tile.row, 0);
	  });

	  it('can move down', function () {
	    var tile = new Tile(1, 0, 0);
	    tile.move('down');

	    assert.equal(tile.column, 0);
	    assert.equal(tile.row, 1);
	  });

	  it('can move left', function () {
	    var tile = new Tile(1, 1, 0);
	    tile.move('left');

	    assert.equal(tile.column, 0);
	    assert.equal(tile.row, 0);
	  });
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(24);

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	var used = [],
	    _exports = module.exports = {};

	/*!
	 * Chai version
	 */

	_exports.version = '3.3.0';

	/*!
	 * Assertion Error
	 */

	_exports.AssertionError = __webpack_require__(25);

	/*!
	 * Utils for plugins (not exported)
	 */

	var util = __webpack_require__(26);

	/**
	 * # .use(function)
	 *
	 * Provides a way to extend the internals of Chai
	 *
	 * @param {Function}
	 * @returns {this} for chaining
	 * @api public
	 */

	_exports.use = function (fn) {
	  if (! ~used.indexOf(fn)) {
	    fn(this, util);
	    used.push(fn);
	  }

	  return this;
	};

	/*!
	 * Utility Functions
	 */

	_exports.util = util;

	/*!
	 * Configuration
	 */

	var config = __webpack_require__(38);
	_exports.config = config;

	/*!
	 * Primary `Assertion` prototype
	 */

	var assertion = __webpack_require__(57);
	_exports.use(assertion);

	/*!
	 * Core Assertions
	 */

	var core = __webpack_require__(58);
	_exports.use(core);

	/*!
	 * Expect interface
	 */

	var expect = __webpack_require__(59);
	_exports.use(expect);

	/*!
	 * Should interface
	 */

	var should = __webpack_require__(60);
	_exports.use(should);

	/*!
	 * Assert interface
	 */

	var assert = __webpack_require__(61);
	_exports.use(assert);

/***/ },
/* 25 */
/***/ function(module, exports) {

	/*!
	 * assertion-error
	 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
	 * MIT Licensed
	 */

	/*!
	 * Return a function that will copy properties from
	 * one object to another excluding any originally
	 * listed. Returned function will create a new `{}`.
	 *
	 * @param {String} excluded properties ...
	 * @return {Function}
	 */

	'use strict';

	function exclude() {
	  var excludes = [].slice.call(arguments);

	  function excludeProps(res, obj) {
	    Object.keys(obj).forEach(function (key) {
	      if (! ~excludes.indexOf(key)) res[key] = obj[key];
	    });
	  }

	  return function extendExclude() {
	    var args = [].slice.call(arguments),
	        i = 0,
	        res = {};

	    for (; i < args.length; i++) {
	      excludeProps(res, args[i]);
	    }

	    return res;
	  };
	};

	/*!
	 * Primary Exports
	 */

	module.exports = AssertionError;

	/**
	 * ### AssertionError
	 *
	 * An extension of the JavaScript `Error` constructor for
	 * assertion and validation scenarios.
	 *
	 * @param {String} message
	 * @param {Object} properties to include (optional)
	 * @param {callee} start stack function (optional)
	 */

	function AssertionError(message, _props, ssf) {
	  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON'),
	      props = extend(_props || {});

	  // default values
	  this.message = message || 'Unspecified AssertionError';
	  this.showDiff = false;

	  // copy from properties
	  for (var key in props) {
	    this[key] = props[key];
	  }

	  // capture stack trace
	  ssf = ssf || arguments.callee;
	  if (ssf && Error.captureStackTrace) {
	    Error.captureStackTrace(this, ssf);
	  } else {
	    this.stack = new Error().stack;
	  }
	}

	/*!
	 * Inherit from Error.prototype
	 */

	AssertionError.prototype = Object.create(Error.prototype);

	/*!
	 * Statically set name
	 */

	AssertionError.prototype.name = 'AssertionError';

	/*!
	 * Ensure correct constructor
	 */

	AssertionError.prototype.constructor = AssertionError;

	/**
	 * Allow errors to be converted to JSON for static transfer.
	 *
	 * @param {Boolean} include stack (default: `true`)
	 * @return {Object} object that can be `JSON.stringify`
	 */

	AssertionError.prototype.toJSON = function (stack) {
	  var extend = exclude('constructor', 'toJSON', 'stack'),
	      props = extend({ name: this.name }, this);

	  // include stack if exists and not turned off
	  if (false !== stack && this.stack) {
	    props.stack = this.stack;
	  }

	  return props;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * chai
	 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Main exports
	 */

	'use strict';

	var _exports = module.exports = {};

	/*!
	 * test utility
	 */

	_exports.test = __webpack_require__(27);

	/*!
	 * type utility
	 */

	_exports.type = __webpack_require__(29);

	/*!
	 * message utility
	 */

	_exports.getMessage = __webpack_require__(31);

	/*!
	 * actual utility
	 */

	_exports.getActual = __webpack_require__(32);

	/*!
	 * Inspect util
	 */

	_exports.inspect = __webpack_require__(33);

	/*!
	 * Object Display util
	 */

	_exports.objDisplay = __webpack_require__(37);

	/*!
	 * Flag utility
	 */

	_exports.flag = __webpack_require__(28);

	/*!
	 * Flag transferring utility
	 */

	_exports.transferFlags = __webpack_require__(39);

	/*!
	 * Deep equal utility
	 */

	_exports.eql = __webpack_require__(40);

	/*!
	 * Deep path value
	 */

	_exports.getPathValue = __webpack_require__(48);

	/*!
	 * Deep path info
	 */

	_exports.getPathInfo = __webpack_require__(49);

	/*!
	 * Check if a property exists
	 */

	_exports.hasProperty = __webpack_require__(50);

	/*!
	 * Function name
	 */

	_exports.getName = __webpack_require__(34);

	/*!
	 * add Property
	 */

	_exports.addProperty = __webpack_require__(51);

	/*!
	 * add Method
	 */

	_exports.addMethod = __webpack_require__(52);

	/*!
	 * overwrite Property
	 */

	_exports.overwriteProperty = __webpack_require__(53);

	/*!
	 * overwrite Method
	 */

	_exports.overwriteMethod = __webpack_require__(54);

	/*!
	 * Add a chainable method
	 */

	_exports.addChainableMethod = __webpack_require__(55);

	/*!
	 * Overwrite chainable method
	 */

	_exports.overwriteChainableMethod = __webpack_require__(56);

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Chai - test utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependancies
	 */

	'use strict';

	var flag = __webpack_require__(28);

	/**
	 * # test(object, expression)
	 *
	 * Test and object for expression.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 */

	module.exports = function (obj, args) {
	  var negate = flag(obj, 'negate'),
	      expr = args[0];
	  return negate ? !expr : expr;
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	/*!
	 * Chai - flag utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### flag(object, key, [value])
	 *
	 * Get or set a flag value on an object. If a
	 * value is provided it will be set, else it will
	 * return the currently set value or `undefined` if
	 * the value is not set.
	 *
	 *     utils.flag(this, 'foo', 'bar'); // setter
	 *     utils.flag(this, 'foo'); // getter, returns `bar`
	 *
	 * @param {Object} object constructed Assertion
	 * @param {String} key
	 * @param {Mixed} value (optional)
	 * @name flag
	 * @api private
	 */

	"use strict";

	module.exports = function (obj, key, value) {
	  var flags = obj.__flags || (obj.__flags = Object.create(null));
	  if (arguments.length === 3) {
	    flags[key] = value;
	  } else {
	    return flags[key];
	  }
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(30);

/***/ },
/* 30 */
/***/ function(module, exports) {

	/*!
	 * type-detect
	 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Primary Exports
	 */

	'use strict';

	var _exports = module.exports = getType;

	/**
	 * ### typeOf (obj)
	 *
	 * Use several different techniques to determine
	 * the type of object being tested.
	 *
	 *
	 * @param {Mixed} object
	 * @return {String} object type
	 * @api public
	 */
	var objectTypeRegexp = /^\[object (.*)\]$/;

	function getType(obj) {
	  var type = Object.prototype.toString.call(obj).match(objectTypeRegexp)[1].toLowerCase();
	  // Let "new String('')" return 'object'
	  if (typeof Promise === 'function' && obj instanceof Promise) return 'promise';
	  // PhantomJS has type "DOMWindow" for null
	  if (obj === null) return 'null';
	  // PhantomJS has type "DOMWindow" for undefined
	  if (obj === undefined) return 'undefined';
	  return type;
	}

	_exports.Library = Library;

	/**
	 * ### Library
	 *
	 * Create a repository for custom type detection.
	 *
	 * ```js
	 * var lib = new type.Library;
	 * ```
	 *
	 */

	function Library() {
	  if (!(this instanceof Library)) return new Library();
	  this.tests = {};
	}

	/**
	 * #### .of (obj)
	 *
	 * Expose replacement `typeof` detection to the library.
	 *
	 * ```js
	 * if ('string' === lib.of('hello world')) {
	 *   // ...
	 * }
	 * ```
	 *
	 * @param {Mixed} object to test
	 * @return {String} type
	 */

	Library.prototype.of = getType;

	/**
	 * #### .define (type, test)
	 *
	 * Add a test to for the `.test()` assertion.
	 *
	 * Can be defined as a regular expression:
	 *
	 * ```js
	 * lib.define('int', /^[0-9]+$/);
	 * ```
	 *
	 * ... or as a function:
	 *
	 * ```js
	 * lib.define('bln', function (obj) {
	 *   if ('boolean' === lib.of(obj)) return true;
	 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];
	 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();
	 *   return !! ~blns.indexOf(obj);
	 * });
	 * ```
	 *
	 * @param {String} type
	 * @param {RegExp|Function} test
	 * @api public
	 */

	Library.prototype.define = function (type, test) {
	  if (arguments.length === 1) return this.tests[type];
	  this.tests[type] = test;
	  return this;
	};

	/**
	 * #### .test (obj, test)
	 *
	 * Assert that an object is of type. Will first
	 * check natives, and if that does not pass it will
	 * use the user defined custom tests.
	 *
	 * ```js
	 * assert(lib.test('1', 'int'));
	 * assert(lib.test('yes', 'bln'));
	 * ```
	 *
	 * @param {Mixed} object
	 * @param {String} type
	 * @return {Boolean} result
	 * @api public
	 */

	Library.prototype.test = function (obj, type) {
	  if (type === getType(obj)) return true;
	  var test = this.tests[type];

	  if (test && 'regexp' === getType(test)) {
	    return test.test(obj);
	  } else if (test && 'function' === getType(test)) {
	    return test(obj);
	  } else {
	    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
	  }
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Chai - message composition utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependancies
	 */

	'use strict';

	var flag = __webpack_require__(28),
	    getActual = __webpack_require__(32),
	    inspect = __webpack_require__(33),
	    objDisplay = __webpack_require__(37);

	/**
	 * ### .getMessage(object, message, negateMessage)
	 *
	 * Construct the error message based on flags
	 * and template tags. Template tags will return
	 * a stringified inspection of the object referenced.
	 *
	 * Message template tags:
	 * - `#{this}` current asserted object
	 * - `#{act}` actual value
	 * - `#{exp}` expected value
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @name getMessage
	 * @api public
	 */

	module.exports = function (obj, args) {
	  var negate = flag(obj, 'negate'),
	      val = flag(obj, 'object'),
	      expected = args[3],
	      actual = getActual(obj, args),
	      msg = negate ? args[2] : args[1],
	      flagMsg = flag(obj, 'message');

	  if (typeof msg === "function") msg = msg();
	  msg = msg || '';
	  msg = msg.replace(/#{this}/g, objDisplay(val)).replace(/#{act}/g, objDisplay(actual)).replace(/#{exp}/g, objDisplay(expected));

	  return flagMsg ? flagMsg + ': ' + msg : msg;
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	/*!
	 * Chai - getActual utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * # getActual(object, [actual])
	 *
	 * Returns the `actual` value for an Assertion
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 */

	"use strict";

	module.exports = function (obj, args) {
	  return args.length > 4 ? args[4] : obj._obj;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// This is (almost) directly from Node.js utils
	// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js

	'use strict';

	var getName = __webpack_require__(34);
	var getProperties = __webpack_require__(35);
	var getEnumerableProperties = __webpack_require__(36);

	module.exports = inspect;

	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
	 *    properties of objects.
	 * @param {Number} depth Depth in which to descend in object. Default is 2.
	 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
	 *    output. Default is false (no coloring).
	 */
	function inspect(obj, showHidden, depth, colors) {
	  var ctx = {
	    showHidden: showHidden,
	    seen: [],
	    stylize: function stylize(str) {
	      return str;
	    }
	  };
	  return formatValue(ctx, obj, typeof depth === 'undefined' ? 2 : depth);
	}

	// Returns true if object is a DOM element.
	var isDOMElement = function isDOMElement(object) {
	  if (typeof HTMLElement === 'object') {
	    return object instanceof HTMLElement;
	  } else {
	    return object && typeof object === 'object' && object.nodeType === 1 && typeof object.nodeName === 'string';
	  }
	};

	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (value && typeof value.inspect === 'function' &&
	  // Filter out the util module, it's inspect function is special
	  value.inspect !== exports.inspect &&
	  // Also filter out any prototype objects using the circular check.
	  !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes);
	    if (typeof ret !== 'string') {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // If this is a DOM element, try to get the outer HTML.
	  if (isDOMElement(value)) {
	    if ('outerHTML' in value) {
	      return value.outerHTML;
	      // This value does not have an outerHTML attribute,
	      //   it could still be an XML element
	    } else {
	        // Attempt to serialize it
	        try {
	          if (document.xmlVersion) {
	            var xmlSerializer = new XMLSerializer();
	            return xmlSerializer.serializeToString(value);
	          } else {
	            // Firefox 11- do not support outerHTML
	            //   It does, however, support innerHTML
	            //   Use the following to render the element
	            var ns = "http://www.w3.org/1999/xhtml";
	            var container = document.createElementNS(ns, '_');

	            container.appendChild(value.cloneNode(false));
	            html = container.innerHTML.replace('><', '>' + value.innerHTML + '<');
	            container.innerHTML = '';
	            return html;
	          }
	        } catch (err) {
	          // This could be a non-native DOM implementation,
	          //   continue with the normal flow:
	          //   printing the element as if it is an object.
	        }
	      }
	  }

	  // Look up the keys of the object.
	  var visibleKeys = getEnumerableProperties(value);
	  var keys = ctx.showHidden ? getProperties(value) : visibleKeys;

	  // Some type of object without properties can be shortcutted.
	  // In IE, errors have a single `stack` property, or if they are vanilla `Error`,
	  // a `stack` plus `description` property; ignore those for consistency.
	  if (keys.length === 0 || isError(value) && (keys.length === 1 && keys[0] === 'stack' || keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')) {
	    if (typeof value === 'function') {
	      var name = getName(value);
	      var nameSuffix = name ? ': ' + name : '';
	      return ctx.stylize('[Function' + nameSuffix + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '',
	      array = false,
	      braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (typeof value === 'function') {
	    var name = getName(value);
	    var nameSuffix = name ? ': ' + name : '';
	    base = ' [Function' + nameSuffix + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    return formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function (key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}

	function formatPrimitive(ctx, value) {
	  switch (typeof value) {
	    case 'undefined':
	      return ctx.stylize('undefined', 'undefined');

	    case 'string':
	      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
	      return ctx.stylize(simple, 'string');

	    case 'number':
	      if (value === 0 && 1 / value === -Infinity) {
	        return ctx.stylize('-0', 'number');
	      }
	      return ctx.stylize('' + value, 'number');

	    case 'boolean':
	      return ctx.stylize('' + value, 'boolean');
	  }
	  // For some reason typeof null is "object", so special case here.
	  if (value === null) {
	    return ctx.stylize('null', 'null');
	  }
	}

	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}

	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function (key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
	    }
	  });
	  return output;
	}

	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str;
	  if (value.__lookupGetter__) {
	    if (value.__lookupGetter__(key)) {
	      if (value.__lookupSetter__(key)) {
	        str = ctx.stylize('[Getter/Setter]', 'special');
	      } else {
	        str = ctx.stylize('[Getter]', 'special');
	      }
	    } else {
	      if (value.__lookupSetter__(key)) {
	        str = ctx.stylize('[Setter]', 'special');
	      }
	    }
	  }
	  if (visibleKeys.indexOf(key) < 0) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(value[key]) < 0) {
	      if (recurseTimes === null) {
	        str = formatValue(ctx, value[key], null);
	      } else {
	        str = formatValue(ctx, value[key], recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function (line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function (line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (typeof name === 'undefined') {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}

	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function (prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}

	function isArray(ar) {
	  return Array.isArray(ar) || typeof ar === 'object' && objectToString(ar) === '[object Array]';
	}

	function isRegExp(re) {
	  return typeof re === 'object' && objectToString(re) === '[object RegExp]';
	}

	function isDate(d) {
	  return typeof d === 'object' && objectToString(d) === '[object Date]';
	}

	function isError(e) {
	  return typeof e === 'object' && objectToString(e) === '[object Error]';
	}

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

/***/ },
/* 34 */
/***/ function(module, exports) {

	/*!
	 * Chai - getName utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * # getName(func)
	 *
	 * Gets the name of a function, in a cross-browser way.
	 *
	 * @param {Function} a function (usually a constructor)
	 */

	"use strict";

	module.exports = function (func) {
	  if (func.name) return func.name;

	  var match = /^\s?function ([^(]*)\(/.exec(func);
	  return match && match[1] ? match[1] : "";
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	/*!
	 * Chai - getProperties utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getProperties(object)
	 *
	 * This allows the retrieval of property names of an object, enumerable or not,
	 * inherited or not.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @name getProperties
	 * @api public
	 */

	"use strict";

	module.exports = function getProperties(object) {
	  var result = Object.getOwnPropertyNames(object);

	  function addProperty(property) {
	    if (result.indexOf(property) === -1) {
	      result.push(property);
	    }
	  }

	  var proto = Object.getPrototypeOf(object);
	  while (proto !== null) {
	    Object.getOwnPropertyNames(proto).forEach(addProperty);
	    proto = Object.getPrototypeOf(proto);
	  }

	  return result;
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	/*!
	 * Chai - getEnumerableProperties utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getEnumerableProperties(object)
	 *
	 * This allows the retrieval of enumerable property names of an object,
	 * inherited or not.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @name getEnumerableProperties
	 * @api public
	 */

	"use strict";

	module.exports = function getEnumerableProperties(object) {
	  var result = [];
	  for (var name in object) {
	    result.push(name);
	  }
	  return result;
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Chai - flag utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependancies
	 */

	'use strict';

	var inspect = __webpack_require__(33);
	var config = __webpack_require__(38);

	/**
	 * ### .objDisplay (object)
	 *
	 * Determines if an object or an array matches
	 * criteria to be inspected in-line for error
	 * messages or should be truncated.
	 *
	 * @param {Mixed} javascript object to inspect
	 * @name objDisplay
	 * @api public
	 */

	module.exports = function (obj) {
	  var str = inspect(obj),
	      type = Object.prototype.toString.call(obj);

	  if (config.truncateThreshold && str.length >= config.truncateThreshold) {
	    if (type === '[object Function]') {
	      return !obj.name || obj.name === '' ? '[Function]' : '[Function: ' + obj.name + ']';
	    } else if (type === '[object Array]') {
	      return '[ Array(' + obj.length + ') ]';
	    } else if (type === '[object Object]') {
	      var keys = Object.keys(obj),
	          kstr = keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...' : keys.join(', ');
	      return '{ Object (' + kstr + ') }';
	    } else {
	      return str;
	    }
	  } else {
	    return str;
	  }
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {

	  /**
	   * ### config.includeStack
	   *
	   * User configurable property, influences whether stack trace
	   * is included in Assertion error message. Default of false
	   * suppresses stack trace in the error message.
	   *
	   *     chai.config.includeStack = true;  // enable stack on error
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  includeStack: false,

	  /**
	   * ### config.showDiff
	   *
	   * User configurable property, influences whether or not
	   * the `showDiff` flag should be included in the thrown
	   * AssertionErrors. `false` will always be `false`; `true`
	   * will be true when the assertion has requested a diff
	   * be shown.
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  showDiff: true,

	  /**
	   * ### config.truncateThreshold
	   *
	   * User configurable property, sets length threshold for actual and
	   * expected values in assertion errors. If this threshold is exceeded, for
	   * example for large data structures, the value is replaced with something
	   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
	   *
	   * Set it to zero if you want to disable truncating altogether.
	   *
	   * This is especially userful when doing assertions on arrays: having this
	   * set to a reasonable large value makes the failure messages readily
	   * inspectable.
	   *
	   *     chai.config.truncateThreshold = 0;  // disable truncating
	   *
	   * @param {Number}
	   * @api public
	   */

	  truncateThreshold: 40

	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	/*!
	 * Chai - transferFlags utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### transferFlags(assertion, object, includeAll = true)
	 *
	 * Transfer all the flags for `assertion` to `object`. If
	 * `includeAll` is set to `false`, then the base Chai
	 * assertion flags (namely `object`, `ssfi`, and `message`)
	 * will not be transferred.
	 *
	 *
	 *     var newAssertion = new Assertion();
	 *     utils.transferFlags(assertion, newAssertion);
	 *
	 *     var anotherAsseriton = new Assertion(myObj);
	 *     utils.transferFlags(assertion, anotherAssertion, false);
	 *
	 * @param {Assertion} assertion the assertion to transfer the flags from
	 * @param {Object} object the object to transfer the flags to; usually a new assertion
	 * @param {Boolean} includeAll
	 * @name transferFlags
	 * @api private
	 */

	'use strict';

	module.exports = function (assertion, object, includeAll) {
	  var flags = assertion.__flags || (assertion.__flags = Object.create(null));

	  if (!object.__flags) {
	    object.__flags = Object.create(null);
	  }

	  includeAll = arguments.length === 3 ? includeAll : true;

	  for (var flag in flags) {
	    if (includeAll || flag !== 'object' && flag !== 'ssfi' && flag != 'message') {
	      object.__flags[flag] = flags[flag];
	    }
	  }
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(41);

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * deep-eql
	 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	'use strict';

	var type = __webpack_require__(42);

	/*!
	 * Buffer.isBuffer browser shim
	 */

	var Buffer;
	try {
	  Buffer = __webpack_require__(44).Buffer;
	} catch (ex) {
	  Buffer = {};
	  Buffer.isBuffer = function () {
	    return false;
	  };
	}

	/*!
	 * Primary Export
	 */

	module.exports = deepEqual;

	/**
	 * Assert super-strict (egal) equality between
	 * two objects of any type.
	 *
	 * @param {Mixed} a
	 * @param {Mixed} b
	 * @param {Array} memoised (optional)
	 * @return {Boolean} equal match
	 */

	function deepEqual(a, b, m) {
	  if (sameValue(a, b)) {
	    return true;
	  } else if ('date' === type(a)) {
	    return dateEqual(a, b);
	  } else if ('regexp' === type(a)) {
	    return regexpEqual(a, b);
	  } else if (Buffer.isBuffer(a)) {
	    return bufferEqual(a, b);
	  } else if ('arguments' === type(a)) {
	    return argumentsEqual(a, b, m);
	  } else if (!typeEqual(a, b)) {
	    return false;
	  } else if ('object' !== type(a) && 'object' !== type(b) && ('array' !== type(a) && 'array' !== type(b))) {
	    return sameValue(a, b);
	  } else {
	    return objectEqual(a, b, m);
	  }
	}

	/*!
	 * Strict (egal) equality test. Ensures that NaN always
	 * equals NaN and `-0` does not equal `+0`.
	 *
	 * @param {Mixed} a
	 * @param {Mixed} b
	 * @return {Boolean} equal match
	 */

	function sameValue(a, b) {
	  if (a === b) return a !== 0 || 1 / a === 1 / b;
	  return a !== a && b !== b;
	}

	/*!
	 * Compare the types of two given objects and
	 * return if they are equal. Note that an Array
	 * has a type of `array` (not `object`) and arguments
	 * have a type of `arguments` (not `array`/`object`).
	 *
	 * @param {Mixed} a
	 * @param {Mixed} b
	 * @return {Boolean} result
	 */

	function typeEqual(a, b) {
	  return type(a) === type(b);
	}

	/*!
	 * Compare two Date objects by asserting that
	 * the time values are equal using `saveValue`.
	 *
	 * @param {Date} a
	 * @param {Date} b
	 * @return {Boolean} result
	 */

	function dateEqual(a, b) {
	  if ('date' !== type(b)) return false;
	  return sameValue(a.getTime(), b.getTime());
	}

	/*!
	 * Compare two regular expressions by converting them
	 * to string and checking for `sameValue`.
	 *
	 * @param {RegExp} a
	 * @param {RegExp} b
	 * @return {Boolean} result
	 */

	function regexpEqual(a, b) {
	  if ('regexp' !== type(b)) return false;
	  return sameValue(a.toString(), b.toString());
	}

	/*!
	 * Assert deep equality of two `arguments` objects.
	 * Unfortunately, these must be sliced to arrays
	 * prior to test to ensure no bad behavior.
	 *
	 * @param {Arguments} a
	 * @param {Arguments} b
	 * @param {Array} memoize (optional)
	 * @return {Boolean} result
	 */

	function argumentsEqual(a, b, m) {
	  if ('arguments' !== type(b)) return false;
	  a = [].slice.call(a);
	  b = [].slice.call(b);
	  return deepEqual(a, b, m);
	}

	/*!
	 * Get enumerable properties of a given object.
	 *
	 * @param {Object} a
	 * @return {Array} property names
	 */

	function enumerable(a) {
	  var res = [];
	  for (var key in a) res.push(key);
	  return res;
	}

	/*!
	 * Simple equality for flat iterable objects
	 * such as Arrays or Node.js buffers.
	 *
	 * @param {Iterable} a
	 * @param {Iterable} b
	 * @return {Boolean} result
	 */

	function iterableEqual(a, b) {
	  if (a.length !== b.length) return false;

	  var i = 0;
	  var match = true;

	  for (; i < a.length; i++) {
	    if (a[i] !== b[i]) {
	      match = false;
	      break;
	    }
	  }

	  return match;
	}

	/*!
	 * Extension to `iterableEqual` specifically
	 * for Node.js Buffers.
	 *
	 * @param {Buffer} a
	 * @param {Mixed} b
	 * @return {Boolean} result
	 */

	function bufferEqual(a, b) {
	  if (!Buffer.isBuffer(b)) return false;
	  return iterableEqual(a, b);
	}

	/*!
	 * Block for `objectEqual` ensuring non-existing
	 * values don't get in.
	 *
	 * @param {Mixed} object
	 * @return {Boolean} result
	 */

	function isValue(a) {
	  return a !== null && a !== undefined;
	}

	/*!
	 * Recursively check the equality of two objects.
	 * Once basic sameness has been established it will
	 * defer to `deepEqual` for each enumerable key
	 * in the object.
	 *
	 * @param {Mixed} a
	 * @param {Mixed} b
	 * @return {Boolean} result
	 */

	function objectEqual(a, b, m) {
	  if (!isValue(a) || !isValue(b)) {
	    return false;
	  }

	  if (a.prototype !== b.prototype) {
	    return false;
	  }

	  var i;
	  if (m) {
	    for (i = 0; i < m.length; i++) {
	      if (m[i][0] === a && m[i][1] === b || m[i][0] === b && m[i][1] === a) {
	        return true;
	      }
	    }
	  } else {
	    m = [];
	  }

	  try {
	    var ka = enumerable(a);
	    var kb = enumerable(b);
	  } catch (ex) {
	    return false;
	  }

	  ka.sort();
	  kb.sort();

	  if (!iterableEqual(ka, kb)) {
	    return false;
	  }

	  m.push([a, b]);

	  var key;
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], m)) {
	      return false;
	    }
	  }

	  return true;
	}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(43);

/***/ },
/* 43 */
/***/ function(module, exports) {

	/*!
	 * type-detect
	 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Primary Exports
	 */

	'use strict';

	var _exports = module.exports = getType;

	/*!
	 * Detectable javascript natives
	 */

	var natives = {
	  '[object Array]': 'array',
	  '[object RegExp]': 'regexp',
	  '[object Function]': 'function',
	  '[object Arguments]': 'arguments',
	  '[object Date]': 'date'
	};

	/**
	 * ### typeOf (obj)
	 *
	 * Use several different techniques to determine
	 * the type of object being tested.
	 *
	 *
	 * @param {Mixed} object
	 * @return {String} object type
	 * @api public
	 */

	function getType(obj) {
	  var str = Object.prototype.toString.call(obj);
	  if (natives[str]) return natives[str];
	  if (obj === null) return 'null';
	  if (obj === undefined) return 'undefined';
	  if (obj === Object(obj)) return 'object';
	  return typeof obj;
	}

	_exports.Library = Library;

	/**
	 * ### Library
	 *
	 * Create a repository for custom type detection.
	 *
	 * ```js
	 * var lib = new type.Library;
	 * ```
	 *
	 */

	function Library() {
	  this.tests = {};
	}

	/**
	 * #### .of (obj)
	 *
	 * Expose replacement `typeof` detection to the library.
	 *
	 * ```js
	 * if ('string' === lib.of('hello world')) {
	 *   // ...
	 * }
	 * ```
	 *
	 * @param {Mixed} object to test
	 * @return {String} type
	 */

	Library.prototype.of = getType;

	/**
	 * #### .define (type, test)
	 *
	 * Add a test to for the `.test()` assertion.
	 *
	 * Can be defined as a regular expression:
	 *
	 * ```js
	 * lib.define('int', /^[0-9]+$/);
	 * ```
	 *
	 * ... or as a function:
	 *
	 * ```js
	 * lib.define('bln', function (obj) {
	 *   if ('boolean' === lib.of(obj)) return true;
	 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];
	 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();
	 *   return !! ~blns.indexOf(obj);
	 * });
	 * ```
	 *
	 * @param {String} type
	 * @param {RegExp|Function} test
	 * @api public
	 */

	Library.prototype.define = function (type, test) {
	  if (arguments.length === 1) return this.tests[type];
	  this.tests[type] = test;
	  return this;
	};

	/**
	 * #### .test (obj, test)
	 *
	 * Assert that an object is of type. Will first
	 * check natives, and if that does not pass it will
	 * use the user defined custom tests.
	 *
	 * ```js
	 * assert(lib.test('1', 'int'));
	 * assert(lib.test('yes', 'bln'));
	 * ```
	 *
	 * @param {Mixed} object
	 * @param {String} type
	 * @return {Boolean} result
	 * @api public
	 */

	Library.prototype.test = function (obj, type) {
	  if (type === getType(obj)) return true;
	  var test = this.tests[type];

	  if (test && 'regexp' === getType(test)) {
	    return test.test(obj);
	  } else if (test && 'function' === getType(test)) {
	    return test(obj);
	  } else {
	    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
	  }
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict';

	var base64 = __webpack_require__(45);
	var ieee754 = __webpack_require__(46);
	var isArray = __webpack_require__(47);

	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;
	Buffer.poolSize = 8192; // not used by this implementation

	var rootParent = {};

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

	function typedArraySupport() {
	  function Bar() {}
	  try {
	    var arr = new Uint8Array(1);
	    arr.foo = function () {
	      return 42;
	    };
	    arr.constructor = Bar;
	    return arr.foo() === 42 && // typed array instances can be augmented
	    arr.constructor === Bar && // constructor can be set
	    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
	  } catch (e) {
	    return false;
	  }
	}

	function kMaxLength() {
	  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer(arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1]);
	    return new Buffer(arg);
	  }

	  this.length = 0;
	  this.parent = undefined;

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg);
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8');
	  }

	  // Unusual.
	  return fromObject(this, arg);
	}

	function fromNumber(that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0;
	    }
	  }
	  return that;
	}

	function fromString(that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0;
	  that = allocate(that, length);

	  that.write(string, encoding);
	  return that;
	}

	function fromObject(that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object);

	  if (isArray(object)) return fromArray(that, object);

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string');
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object);
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object);
	    }
	  }

	  if (object.length) return fromArrayLike(that, object);

	  return fromJsonObject(that, object);
	}

	function fromBuffer(that, buffer) {
	  var length = checked(buffer.length) | 0;
	  that = allocate(that, length);
	  buffer.copy(that, 0, 0, length);
	  return that;
	}

	function fromArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	function fromArrayBuffer(that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength;
	    that = Buffer._augment(new Uint8Array(array));
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array));
	  }
	  return that;
	}

	function fromArrayLike(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject(that, object) {
	  var array;
	  var length = 0;

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data;
	    length = checked(array.length) | 0;
	  }
	  that = allocate(that, length);

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}

	function allocate(that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length));
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length;
	    that._isBuffer = true;
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1;
	  if (fromPool) that.parent = rootParent;

	  return that;
	}

	function checked(length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
	  }
	  return length | 0;
	}

	function SlowBuffer(subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);

	  var buf = new Buffer(subject, encoding);
	  delete buf.parent;
	  return buf;
	}

	Buffer.isBuffer = function isBuffer(b) {
	  return !!(b != null && b._isBuffer);
	};

	Buffer.compare = function compare(a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers');
	  }

	  if (a === b) return 0;

	  var x = a.length;
	  var y = b.length;

	  var i = 0;
	  var len = Math.min(x, y);
	  while (i < len) {
	    if (a[i] !== b[i]) break;

	    ++i;
	  }

	  if (i !== len) {
	    x = a[i];
	    y = b[i];
	  }

	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};

	Buffer.isEncoding = function isEncoding(encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true;
	    default:
	      return false;
	  }
	};

	Buffer.concat = function concat(list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.');

	  if (list.length === 0) {
	    return new Buffer(0);
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length;
	    }
	  }

	  var buf = new Buffer(length);
	  var pos = 0;
	  for (i = 0; i < list.length; i++) {
	    var item = list[i];
	    item.copy(buf, pos);
	    pos += item.length;
	  }
	  return buf;
	};

	function byteLength(string, encoding) {
	  if (typeof string !== 'string') string = '' + string;

	  var len = string.length;
	  if (len === 0) return 0;

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len;
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length;
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2;
	      case 'hex':
	        return len >>> 1;
	      case 'base64':
	        return base64ToBytes(string).length;
	      default:
	        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined;
	Buffer.prototype.parent = undefined;

	function slowToString(encoding, start, end) {
	  var loweredCase = false;

	  start = start | 0;
	  end = end === undefined || end === Infinity ? this.length : end | 0;

	  if (!encoding) encoding = 'utf8';
	  if (start < 0) start = 0;
	  if (end > this.length) end = this.length;
	  if (end <= start) return '';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end);

	      case 'ascii':
	        return asciiSlice(this, start, end);

	      case 'binary':
	        return binarySlice(this, start, end);

	      case 'base64':
	        return base64Slice(this, start, end);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	Buffer.prototype.toString = function toString() {
	  var length = this.length | 0;
	  if (length === 0) return '';
	  if (arguments.length === 0) return utf8Slice(this, 0, length);
	  return slowToString.apply(this, arguments);
	};

	Buffer.prototype.equals = function equals(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return true;
	  return Buffer.compare(this, b) === 0;
	};

	Buffer.prototype.inspect = function inspect() {
	  var str = '';
	  var max = exports.INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>';
	};

	Buffer.prototype.compare = function compare(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return 0;
	  return Buffer.compare(this, b);
	};

	Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;else if (byteOffset < -0x80000000) byteOffset = -0x80000000;
	  byteOffset >>= 0;

	  if (this.length === 0) return -1;
	  if (byteOffset >= this.length) return -1;

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0);

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1; // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset);
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset);
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset);
	    }
	    return arrayIndexOf(this, [val], byteOffset);
	  }

	  function arrayIndexOf(arr, val, byteOffset) {
	    var foundIndex = -1;
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex;
	      } else {
	        foundIndex = -1;
	      }
	    }
	    return -1;
	  }

	  throw new TypeError('val must be string, number or Buffer');
	};

	// `get` is deprecated
	Buffer.prototype.get = function get(offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.');
	  return this.readUInt8(offset);
	};

	// `set` is deprecated
	Buffer.prototype.set = function set(v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.');
	  return this.writeUInt8(v, offset);
	};

	function hexWrite(buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string');

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) throw new Error('Invalid hex string');
	    buf[offset + i] = parsed;
	  }
	  return i;
	}

	function utf8Write(buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	}

	function asciiWrite(buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length);
	}

	function binaryWrite(buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length);
	}

	function base64Write(buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length);
	}

	function ucs2Write(buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	}

	Buffer.prototype.write = function write(string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	    // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	      encoding = offset;
	      length = this.length;
	      offset = 0;
	      // Buffer#write(string, offset[, length][, encoding])
	    } else if (isFinite(offset)) {
	        offset = offset | 0;
	        if (isFinite(length)) {
	          length = length | 0;
	          if (encoding === undefined) encoding = 'utf8';
	        } else {
	          encoding = length;
	          length = undefined;
	        }
	        // legacy write(string, encoding, offset, length) - remove in v0.13
	      } else {
	          var swap = encoding;
	          encoding = offset;
	          offset = length | 0;
	          length = swap;
	        }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds');
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length);

	      case 'ascii':
	        return asciiWrite(this, string, offset, length);

	      case 'binary':
	        return binaryWrite(this, string, offset, length);

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON() {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  };
	};

	function base64Slice(buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf);
	  } else {
	    return base64.fromByteArray(buf.slice(start, end));
	  }
	}

	function utf8Slice(buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break;
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res);
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray(codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
	  }
	  return res;
	}

	function asciiSlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret;
	}

	function binarySlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret;
	}

	function hexSlice(buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i]);
	  }
	  return out;
	}

	function utf16leSlice(buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res;
	}

	Buffer.prototype.slice = function slice(start, end) {
	  var len = this.length;
	  start = ~ ~start;
	  end = end === undefined ? len : ~ ~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end));
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this;

	  return newBuf;
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset(offset, ext, length) {
	  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
	}

	Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset];
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | this[offset + 1] << 8;
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] << 8 | this[offset + 1];
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	};

	Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return this[offset];
	  return (0xff - this[offset] + 1) * -1;
	};

	Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | this[offset + 1] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | this[offset] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	};

	Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	};

	Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, true, 23, 4);
	};

	Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, false, 23, 4);
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, true, 52, 8);
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, false, 52, 8);
	};

	function checkInt(buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance');
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	function objectWriteUInt16(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	function objectWriteUInt32(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = value >>> 24;
	    this[offset + 2] = value >>> 16;
	    this[offset + 1] = value >>> 8;
	    this[offset] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	    this[offset + 2] = value >>> 16;
	    this[offset + 3] = value >>> 24;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	function checkIEEE754(buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	  if (offset < 0) throw new RangeError('index out of range');
	}

	function writeFloat(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4;
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert);
	};

	function writeDouble(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8;
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert);
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy(target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length === 0 || this.length === 0) return 0;

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds');
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
	  if (end < 0) throw new RangeError('sourceEnd out of bounds');

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart);
	  }

	  return len;
	};

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill(value, start, end) {
	  if (!value) value = 0;
	  if (!start) start = 0;
	  if (!end) end = this.length;

	  if (end < start) throw new RangeError('end < start');

	  // Fill 0 bytes; we're done
	  if (end === start) return;
	  if (this.length === 0) return;

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds');
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds');

	  var i;
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value;
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString());
	    var len = bytes.length;
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len];
	    }
	  }

	  return this;
	};

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return new Buffer(this).buffer;
	    } else {
	      var buf = new Uint8Array(this.length);
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i];
	      }
	      return buf.buffer;
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
	  }
	};

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype;

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment(arr) {
	  arr.constructor = Buffer;
	  arr._isBuffer = true;

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set;

	  // deprecated
	  arr.get = BP.get;
	  arr.set = BP.set;

	  arr.write = BP.write;
	  arr.toString = BP.toString;
	  arr.toLocaleString = BP.toString;
	  arr.toJSON = BP.toJSON;
	  arr.equals = BP.equals;
	  arr.compare = BP.compare;
	  arr.indexOf = BP.indexOf;
	  arr.copy = BP.copy;
	  arr.slice = BP.slice;
	  arr.readUIntLE = BP.readUIntLE;
	  arr.readUIntBE = BP.readUIntBE;
	  arr.readUInt8 = BP.readUInt8;
	  arr.readUInt16LE = BP.readUInt16LE;
	  arr.readUInt16BE = BP.readUInt16BE;
	  arr.readUInt32LE = BP.readUInt32LE;
	  arr.readUInt32BE = BP.readUInt32BE;
	  arr.readIntLE = BP.readIntLE;
	  arr.readIntBE = BP.readIntBE;
	  arr.readInt8 = BP.readInt8;
	  arr.readInt16LE = BP.readInt16LE;
	  arr.readInt16BE = BP.readInt16BE;
	  arr.readInt32LE = BP.readInt32LE;
	  arr.readInt32BE = BP.readInt32BE;
	  arr.readFloatLE = BP.readFloatLE;
	  arr.readFloatBE = BP.readFloatBE;
	  arr.readDoubleLE = BP.readDoubleLE;
	  arr.readDoubleBE = BP.readDoubleBE;
	  arr.writeUInt8 = BP.writeUInt8;
	  arr.writeUIntLE = BP.writeUIntLE;
	  arr.writeUIntBE = BP.writeUIntBE;
	  arr.writeUInt16LE = BP.writeUInt16LE;
	  arr.writeUInt16BE = BP.writeUInt16BE;
	  arr.writeUInt32LE = BP.writeUInt32LE;
	  arr.writeUInt32BE = BP.writeUInt32BE;
	  arr.writeIntLE = BP.writeIntLE;
	  arr.writeIntBE = BP.writeIntBE;
	  arr.writeInt8 = BP.writeInt8;
	  arr.writeInt16LE = BP.writeInt16LE;
	  arr.writeInt16BE = BP.writeInt16BE;
	  arr.writeInt32LE = BP.writeInt32LE;
	  arr.writeInt32BE = BP.writeInt32BE;
	  arr.writeFloatLE = BP.writeFloatLE;
	  arr.writeFloatBE = BP.writeFloatBE;
	  arr.writeDoubleLE = BP.writeDoubleLE;
	  arr.writeDoubleBE = BP.writeDoubleBE;
	  arr.fill = BP.fill;
	  arr.inspect = BP.inspect;
	  arr.toArrayBuffer = BP.toArrayBuffer;

	  return arr;
	};

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean(str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return '';
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str;
	}

	function stringtrim(str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	}

	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}

	function utf8ToBytes(string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue;
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue;
	      }

	      // valid surrogate pair
	      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break;
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break;
	      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break;
	      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break;
	      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else {
	      throw new Error('Invalid code point');
	    }
	  }

	  return bytes;
	}

	function asciiToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray;
	}

	function utf16leToBytes(str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break;

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray;
	}

	function base64ToBytes(str) {
	  return base64.toByteArray(base64clean(str));
	}

	function blitBuffer(src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if (i + offset >= dst.length || i >= src.length) break;
	    dst[i + offset] = src[i];
	  }
	  return i;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(44).Buffer, (function() { return this; }())))

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

		var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

		var PLUS = '+'.charCodeAt(0);
		var SLASH = '/'.charCodeAt(0);
		var NUMBER = '0'.charCodeAt(0);
		var LOWER = 'a'.charCodeAt(0);
		var UPPER = 'A'.charCodeAt(0);
		var PLUS_URL_SAFE = '-'.charCodeAt(0);
		var SLASH_URL_SAFE = '_'.charCodeAt(0);

		function decode(elt) {
			var code = elt.charCodeAt(0);
			if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
			if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
			if (code < NUMBER) return -1; //no match
			if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
			if (code < UPPER + 26) return code - UPPER;
			if (code < LOWER + 26) return code - LOWER + 26;
		}

		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4');
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length;
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders);

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;

			var L = 0;

			function push(v) {
				arr[L++] = v;
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
				push((tmp & 0xFF0000) >> 16);
				push((tmp & 0xFF00) >> 8);
				push(tmp & 0xFF);
			}

			if (placeHolders === 2) {
				tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
				push(tmp & 0xFF);
			} else if (placeHolders === 1) {
				tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
				push(tmp >> 8 & 0xFF);
				push(tmp & 0xFF);
			}

			return arr;
		}

		function uint8ToBase64(uint8) {
			var i,
			    extraBytes = uint8.length % 3,
			    // if we have 1 byte left, pad 2 bytes
			output = "",
			    temp,
			    length;

			function encode(num) {
				return lookup.charAt(num);
			}

			function tripletToBase64(num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
				output += tripletToBase64(temp);
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += encode(temp >> 2);
					output += encode(temp << 4 & 0x3F);
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
					output += encode(temp >> 10);
					output += encode(temp >> 4 & 0x3F);
					output += encode(temp << 2 & 0x3F);
					output += '=';
					break;
			}

			return output;
		}

		exports.toByteArray = b64ToByteArray;
		exports.fromByteArray = uint8ToBase64;
	})( false ? undefined.base64js = {} : exports);

/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? nBytes - 1 : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
	  var i = isLE ? 0 : nBytes - 1;
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */

	'use strict';

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !!val && '[object Array]' == str.call(val);
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Chai - getPathValue utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * @see https://github.com/logicalparadox/filtr
	 * MIT Licensed
	 */

	'use strict';

	var getPathInfo = __webpack_require__(49);

	/**
	 * ### .getPathValue(path, object)
	 *
	 * This allows the retrieval of values in an
	 * object given a string path.
	 *
	 *     var obj = {
	 *         prop1: {
	 *             arr: ['a', 'b', 'c']
	 *           , str: 'Hello'
	 *         }
	 *       , prop2: {
	 *             arr: [ { nested: 'Universe' } ]
	 *           , str: 'Hello again!'
	 *         }
	 *     }
	 *
	 * The following would be the results.
	 *
	 *     getPathValue('prop1.str', obj); // Hello
	 *     getPathValue('prop1.att[2]', obj); // b
	 *     getPathValue('prop2.arr[0].nested', obj); // Universe
	 *
	 * @param {String} path
	 * @param {Object} object
	 * @returns {Object} value or `undefined`
	 * @name getPathValue
	 * @api public
	 */
	module.exports = function (path, obj) {
	  var info = getPathInfo(path, obj);
	  return info.value;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Chai - getPathInfo utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	var hasProperty = __webpack_require__(50);

	/**
	 * ### .getPathInfo(path, object)
	 *
	 * This allows the retrieval of property info in an
	 * object given a string path.
	 *
	 * The path info consists of an object with the
	 * following properties:
	 *
	 * * parent - The parent object of the property referenced by `path`
	 * * name - The name of the final property, a number if it was an array indexer
	 * * value - The value of the property, if it exists, otherwise `undefined`
	 * * exists - Whether the property exists or not
	 *
	 * @param {String} path
	 * @param {Object} object
	 * @returns {Object} info
	 * @name getPathInfo
	 * @api public
	 */

	module.exports = function getPathInfo(path, obj) {
	  var parsed = parsePath(path),
	      last = parsed[parsed.length - 1];

	  var info = {
	    parent: parsed.length > 1 ? _getPathValue(parsed, obj, parsed.length - 1) : obj,
	    name: last.p || last.i,
	    value: _getPathValue(parsed, obj)
	  };
	  info.exists = hasProperty(info.name, info.parent);

	  return info;
	};

	/*!
	 * ## parsePath(path)
	 *
	 * Helper function used to parse string object
	 * paths. Use in conjunction with `_getPathValue`.
	 *
	 *      var parsed = parsePath('myobject.property.subprop');
	 *
	 * ### Paths:
	 *
	 * * Can be as near infinitely deep and nested
	 * * Arrays are also valid using the formal `myobject.document[3].property`.
	 * * Literal dots and brackets (not delimiter) must be backslash-escaped.
	 *
	 * @param {String} path
	 * @returns {Object} parsed
	 * @api private
	 */

	function parsePath(path) {
	  var str = path.replace(/([^\\])\[/g, '$1.['),
	      parts = str.match(/(\\\.|[^.]+?)+/g);
	  return parts.map(function (value) {
	    var re = /^\[(\d+)\]$/,
	        mArr = re.exec(value);
	    if (mArr) return { i: parseFloat(mArr[1]) };else return { p: value.replace(/\\([.\[\]])/g, '$1') };
	  });
	}

	/*!
	 * ## _getPathValue(parsed, obj)
	 *
	 * Helper companion function for `.parsePath` that returns
	 * the value located at the parsed address.
	 *
	 *      var value = getPathValue(parsed, obj);
	 *
	 * @param {Object} parsed definition from `parsePath`.
	 * @param {Object} object to search against
	 * @param {Number} object to search against
	 * @returns {Object|Undefined} value
	 * @api private
	 */

	function _getPathValue(parsed, obj, index) {
	  var tmp = obj,
	      res;

	  index = index === undefined ? parsed.length : index;

	  for (var i = 0, l = index; i < l; i++) {
	    var part = parsed[i];
	    if (tmp) {
	      if ('undefined' !== typeof part.p) tmp = tmp[part.p];else if ('undefined' !== typeof part.i) tmp = tmp[part.i];
	      if (i == l - 1) res = tmp;
	    } else {
	      res = undefined;
	    }
	  }
	  return res;
	}

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Chai - hasProperty utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	var type = __webpack_require__(29);

	/**
	 * ### .hasProperty(object, name)
	 *
	 * This allows checking whether an object has
	 * named property or numeric array index.
	 *
	 * Basically does the same thing as the `in`
	 * operator but works properly with natives
	 * and null/undefined values.
	 *
	 *     var obj = {
	 *         arr: ['a', 'b', 'c']
	 *       , str: 'Hello'
	 *     }
	 *
	 * The following would be the results.
	 *
	 *     hasProperty('str', obj);  // true
	 *     hasProperty('constructor', obj);  // true
	 *     hasProperty('bar', obj);  // false
	 *     
	 *     hasProperty('length', obj.str); // true
	 *     hasProperty(1, obj.str);  // true
	 *     hasProperty(5, obj.str);  // false
	 *
	 *     hasProperty('length', obj.arr);  // true
	 *     hasProperty(2, obj.arr);  // true
	 *     hasProperty(3, obj.arr);  // false
	 *
	 * @param {Objuect} object
	 * @param {String|Number} name
	 * @returns {Boolean} whether it exists
	 * @name getPathInfo
	 * @api public
	 */

	var literals = {
	  'number': Number,
	  'string': String
	};

	module.exports = function hasProperty(name, obj) {
	  var ot = type(obj);

	  // Bad Object, obviously no props at all
	  if (ot === 'null' || ot === 'undefined') return false;

	  // The `in` operator does not work with certain literals
	  // box these before the check
	  if (literals[ot] && typeof obj !== 'object') obj = new literals[ot](obj);

	  return name in obj;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Chai - addProperty utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	var config = __webpack_require__(38);
	var flag = __webpack_require__(28);

	/**
	 * ### addProperty (ctx, name, getter)
	 *
	 * Adds a property to the prototype of an object.
	 *
	 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
	 *       var obj = utils.flag(this, 'object');
	 *       new chai.Assertion(obj).to.be.instanceof(Foo);
	 *     });
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.addProperty('foo', fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(myFoo).to.be.foo;
	 *
	 * @param {Object} ctx object to which the property is added
	 * @param {String} name of property to add
	 * @param {Function} getter function to be used for name
	 * @name addProperty
	 * @api public
	 */

	module.exports = function (ctx, name, getter) {
	  Object.defineProperty(ctx, name, { get: function addProperty() {
	      var old_ssfi = flag(this, 'ssfi');
	      if (old_ssfi && config.includeStack === false) flag(this, 'ssfi', addProperty);

	      var result = getter.call(this);
	      return result === undefined ? this : result;
	    },
	    configurable: true
	  });
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Chai - addMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	var config = __webpack_require__(38);

	/**
	 * ### .addMethod (ctx, name, method)
	 *
	 * Adds a method to the prototype of an object.
	 *
	 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
	 *       var obj = utils.flag(this, 'object');
	 *       new chai.Assertion(obj).to.be.equal(str);
	 *     });
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.addMethod('foo', fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(fooStr).to.be.foo('bar');
	 *
	 * @param {Object} ctx object to which the method is added
	 * @param {String} name of method to add
	 * @param {Function} method function to be used for name
	 * @name addMethod
	 * @api public
	 */
	var flag = __webpack_require__(28);

	module.exports = function (ctx, name, method) {
	  ctx[name] = function () {
	    var old_ssfi = flag(this, 'ssfi');
	    if (old_ssfi && config.includeStack === false) flag(this, 'ssfi', ctx[name]);
	    var result = method.apply(this, arguments);
	    return result === undefined ? this : result;
	  };
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	/*!
	 * Chai - overwriteProperty utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### overwriteProperty (ctx, name, fn)
	 *
	 * Overwites an already existing property getter and provides
	 * access to previous value. Must return function to use as getter.
	 *
	 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {
	 *       return function () {
	 *         var obj = utils.flag(this, 'object');
	 *         if (obj instanceof Foo) {
	 *           new chai.Assertion(obj.name).to.equal('bar');
	 *         } else {
	 *           _super.call(this);
	 *         }
	 *       }
	 *     });
	 *
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.overwriteProperty('foo', fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(myFoo).to.be.ok;
	 *
	 * @param {Object} ctx object whose property is to be overwritten
	 * @param {String} name of property to overwrite
	 * @param {Function} getter function that returns a getter function to be used for name
	 * @name overwriteProperty
	 * @api public
	 */

	'use strict';

	module.exports = function (ctx, name, getter) {
	  var _get = Object.getOwnPropertyDescriptor(ctx, name),
	      _super = function _super() {};

	  if (_get && 'function' === typeof _get.get) _super = _get.get;

	  Object.defineProperty(ctx, name, { get: function get() {
	      var result = getter(_super).call(this);
	      return result === undefined ? this : result;
	    },
	    configurable: true
	  });
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	/*!
	 * Chai - overwriteMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### overwriteMethod (ctx, name, fn)
	 *
	 * Overwites an already existing method and provides
	 * access to previous function. Must return function
	 * to be used for name.
	 *
	 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {
	 *       return function (str) {
	 *         var obj = utils.flag(this, 'object');
	 *         if (obj instanceof Foo) {
	 *           new chai.Assertion(obj.value).to.equal(str);
	 *         } else {
	 *           _super.apply(this, arguments);
	 *         }
	 *       }
	 *     });
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.overwriteMethod('foo', fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(myFoo).to.equal('bar');
	 *
	 * @param {Object} ctx object whose method is to be overwritten
	 * @param {String} name of method to overwrite
	 * @param {Function} method function that returns a function to be used for name
	 * @name overwriteMethod
	 * @api public
	 */

	'use strict';

	module.exports = function (ctx, name, method) {
	  var _method = ctx[name],
	      _super = function _super() {
	    return this;
	  };

	  if (_method && 'function' === typeof _method) _super = _method;

	  ctx[name] = function () {
	    var result = method(_super).apply(this, arguments);
	    return result === undefined ? this : result;
	  };
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Chai - addChainingMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	'use strict';

	var transferFlags = __webpack_require__(39);
	var flag = __webpack_require__(28);
	var config = __webpack_require__(38);

	/*!
	 * Module variables
	 */

	// Check whether `__proto__` is supported
	var hasProtoSupport = ('__proto__' in Object);

	// Without `__proto__` support, this module will need to add properties to a function.
	// However, some Function.prototype methods cannot be overwritten,
	// and there seems no easy cross-platform way to detect them (@see chaijs/chai/issues/69).
	var excludeNames = /^(?:length|name|arguments|caller)$/;

	// Cache `Function` properties
	var call = Function.prototype.call,
	    apply = Function.prototype.apply;

	/**
	 * ### addChainableMethod (ctx, name, method, chainingBehavior)
	 *
	 * Adds a method to an object, such that the method can also be chained.
	 *
	 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {
	 *       var obj = utils.flag(this, 'object');
	 *       new chai.Assertion(obj).to.be.equal(str);
	 *     });
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);
	 *
	 * The result can then be used as both a method assertion, executing both `method` and
	 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.
	 *
	 *     expect(fooStr).to.be.foo('bar');
	 *     expect(fooStr).to.be.foo.equal('foo');
	 *
	 * @param {Object} ctx object to which the method is added
	 * @param {String} name of method to add
	 * @param {Function} method function to be used for `name`, when called
	 * @param {Function} chainingBehavior function to be called every time the property is accessed
	 * @name addChainableMethod
	 * @api public
	 */

	module.exports = function (ctx, name, method, chainingBehavior) {
	  if (typeof chainingBehavior !== 'function') {
	    chainingBehavior = function () {};
	  }

	  var chainableBehavior = {
	    method: method,
	    chainingBehavior: chainingBehavior
	  };

	  // save the methods so we can overwrite them later, if we need to.
	  if (!ctx.__methods) {
	    ctx.__methods = {};
	  }
	  ctx.__methods[name] = chainableBehavior;

	  Object.defineProperty(ctx, name, { get: function get() {
	      chainableBehavior.chainingBehavior.call(this);

	      var assert = function assert() {
	        var old_ssfi = flag(this, 'ssfi');
	        if (old_ssfi && config.includeStack === false) flag(this, 'ssfi', assert);
	        var result = chainableBehavior.method.apply(this, arguments);
	        return result === undefined ? this : result;
	      };

	      // Use `__proto__` if available
	      if (hasProtoSupport) {
	        // Inherit all properties from the object by replacing the `Function` prototype
	        var prototype = assert.__proto__ = Object.create(this);
	        // Restore the `call` and `apply` methods from `Function`
	        prototype.call = call;
	        prototype.apply = apply;
	      }
	      // Otherwise, redefine all properties (slow!)
	      else {
	          var asserterNames = Object.getOwnPropertyNames(ctx);
	          asserterNames.forEach(function (asserterName) {
	            if (!excludeNames.test(asserterName)) {
	              var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
	              Object.defineProperty(assert, asserterName, pd);
	            }
	          });
	        }

	      transferFlags(this, assert);
	      return assert;
	    },
	    configurable: true
	  });
	};

/***/ },
/* 56 */
/***/ function(module, exports) {

	/*!
	 * Chai - overwriteChainableMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### overwriteChainableMethod (ctx, name, method, chainingBehavior)
	 *
	 * Overwites an already existing chainable method
	 * and provides access to the previous function or
	 * property.  Must return functions to be used for
	 * name.
	 *
	 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'length',
	 *       function (_super) {
	 *       }
	 *     , function (_super) {
	 *       }
	 *     );
	 *
	 * Can also be accessed directly from `chai.Assertion`.
	 *
	 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);
	 *
	 * Then can be used as any other assertion.
	 *
	 *     expect(myFoo).to.have.length(3);
	 *     expect(myFoo).to.have.length.above(3);
	 *
	 * @param {Object} ctx object whose method / property is to be overwritten
	 * @param {String} name of method / property to overwrite
	 * @param {Function} method function that returns a function to be used for name
	 * @param {Function} chainingBehavior function that returns a function to be used for property
	 * @name overwriteChainableMethod
	 * @api public
	 */

	"use strict";

	module.exports = function (ctx, name, method, chainingBehavior) {
	  var chainableBehavior = ctx.__methods[name];

	  var _chainingBehavior = chainableBehavior.chainingBehavior;
	  chainableBehavior.chainingBehavior = function () {
	    var result = chainingBehavior(_chainingBehavior).call(this);
	    return result === undefined ? this : result;
	  };

	  var _method = chainableBehavior.method;
	  chainableBehavior.method = function () {
	    var result = method(_method).apply(this, arguments);
	    return result === undefined ? this : result;
	  };
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * chai
	 * http://chaijs.com
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	var config = __webpack_require__(38);

	module.exports = function (_chai, util) {
	  /*!
	   * Module dependencies.
	   */

	  var AssertionError = _chai.AssertionError,
	      flag = util.flag;

	  /*!
	   * Module export.
	   */

	  _chai.Assertion = Assertion;

	  /*!
	   * Assertion Constructor
	   *
	   * Creates object for chaining.
	   *
	   * @api private
	   */

	  function Assertion(obj, msg, stack) {
	    flag(this, 'ssfi', stack || arguments.callee);
	    flag(this, 'object', obj);
	    flag(this, 'message', msg);
	  }

	  Object.defineProperty(Assertion, 'includeStack', {
	    get: function get() {
	      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
	      return config.includeStack;
	    },
	    set: function set(value) {
	      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
	      config.includeStack = value;
	    }
	  });

	  Object.defineProperty(Assertion, 'showDiff', {
	    get: function get() {
	      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
	      return config.showDiff;
	    },
	    set: function set(value) {
	      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
	      config.showDiff = value;
	    }
	  });

	  Assertion.addProperty = function (name, fn) {
	    util.addProperty(this.prototype, name, fn);
	  };

	  Assertion.addMethod = function (name, fn) {
	    util.addMethod(this.prototype, name, fn);
	  };

	  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
	    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
	  };

	  Assertion.overwriteProperty = function (name, fn) {
	    util.overwriteProperty(this.prototype, name, fn);
	  };

	  Assertion.overwriteMethod = function (name, fn) {
	    util.overwriteMethod(this.prototype, name, fn);
	  };

	  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
	    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
	  };

	  /**
	   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
	   *
	   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
	   *
	   * @name assert
	   * @param {Philosophical} expression to be tested
	   * @param {String or Function} message or function that returns message to display if expression fails
	   * @param {String or Function} negatedMessage or function that returns negatedMessage to display if negated expression fails
	   * @param {Mixed} expected value (remember to check for negation)
	   * @param {Mixed} actual (optional) will default to `this.obj`
	   * @param {Boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
	   * @api private
	   */

	  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
	    var ok = util.test(this, arguments);
	    if (true !== showDiff) showDiff = false;
	    if (true !== config.showDiff) showDiff = false;

	    if (!ok) {
	      var msg = util.getMessage(this, arguments),
	          actual = util.getActual(this, arguments);
	      throw new AssertionError(msg, {
	        actual: actual,
	        expected: expected,
	        showDiff: showDiff
	      }, config.includeStack ? this.assert : flag(this, 'ssfi'));
	    }
	  };

	  /*!
	   * ### ._obj
	   *
	   * Quick reference to stored `actual` value for plugin developers.
	   *
	   * @api private
	   */

	  Object.defineProperty(Assertion.prototype, '_obj', { get: function get() {
	      return flag(this, 'object');
	    },
	    set: function set(val) {
	      flag(this, 'object', val);
	    }
	  });
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	/*!
	 * chai
	 * http://chaijs.com
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	module.exports = function (chai, _) {
	  var Assertion = chai.Assertion,
	      toString = Object.prototype.toString,
	      flag = _.flag;

	  /**
	   * ### Language Chains
	   *
	   * The following are provided as chainable getters to
	   * improve the readability of your assertions. They
	   * do not provide testing capabilities unless they
	   * have been overwritten by a plugin.
	   *
	   * **Chains**
	   *
	   * - to
	   * - be
	   * - been
	   * - is
	   * - that
	   * - which
	   * - and
	   * - has
	   * - have
	   * - with
	   * - at
	   * - of
	   * - same
	   *
	   * @name language chains
	   * @api public
	   */

	  ['to', 'be', 'been', 'is', 'and', 'has', 'have', 'with', 'that', 'which', 'at', 'of', 'same'].forEach(function (chain) {
	    Assertion.addProperty(chain, function () {
	      return this;
	    });
	  });

	  /**
	   * ### .not
	   *
	   * Negates any of assertions following in the chain.
	   *
	   *     expect(foo).to.not.equal('bar');
	   *     expect(goodFn).to.not.throw(Error);
	   *     expect({ foo: 'baz' }).to.have.property('foo')
	   *       .and.not.equal('bar');
	   *
	   * @name not
	   * @api public
	   */

	  Assertion.addProperty('not', function () {
	    flag(this, 'negate', true);
	  });

	  /**
	   * ### .deep
	   *
	   * Sets the `deep` flag, later used by the `equal` and
	   * `property` assertions.
	   *
	   *     expect(foo).to.deep.equal({ bar: 'baz' });
	   *     expect({ foo: { bar: { baz: 'quux' } } })
	   *       .to.have.deep.property('foo.bar.baz', 'quux');
	   *
	   * `.deep.property` special characters can be escaped
	   * by adding two slashes before the `.` or `[]`.
	   *
	   *     var deepCss = { '.link': { '[target]': 42 }};
	   *     expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
	   *
	   * @name deep
	   * @api public
	   */

	  Assertion.addProperty('deep', function () {
	    flag(this, 'deep', true);
	  });

	  /**
	   * ### .any
	   *
	   * Sets the `any` flag, (opposite of the `all` flag)
	   * later used in the `keys` assertion.
	   *
	   *     expect(foo).to.have.any.keys('bar', 'baz');
	   *
	   * @name any
	   * @api public
	   */

	  Assertion.addProperty('any', function () {
	    flag(this, 'any', true);
	    flag(this, 'all', false);
	  });

	  /**
	   * ### .all
	   *
	   * Sets the `all` flag (opposite of the `any` flag)
	   * later used by the `keys` assertion.
	   *
	   *     expect(foo).to.have.all.keys('bar', 'baz');
	   *
	   * @name all
	   * @api public
	   */

	  Assertion.addProperty('all', function () {
	    flag(this, 'all', true);
	    flag(this, 'any', false);
	  });

	  /**
	   * ### .a(type)
	   *
	   * The `a` and `an` assertions are aliases that can be
	   * used either as language chains or to assert a value's
	   * type.
	   *
	   *     // typeof
	   *     expect('test').to.be.a('string');
	   *     expect({ foo: 'bar' }).to.be.an('object');
	   *     expect(null).to.be.a('null');
	   *     expect(undefined).to.be.an('undefined');
	   *     expect(new Promise).to.be.a('promise');
	   *     expect(new Float32Array()).to.be.a('float32array');
	   *     expect(Symbol()).to.be.a('symbol');
	   *
	   *     // es6 overrides
	   *     expect({[Symbol.toStringTag]:()=>'foo'}).to.be.a('foo');
	   *
	   *     // language chain
	   *     expect(foo).to.be.an.instanceof(Foo);
	   *
	   * @name a
	   * @alias an
	   * @param {String} type
	   * @param {String} message _optional_
	   * @api public
	   */

	  function an(type, msg) {
	    if (msg) flag(this, 'message', msg);
	    type = type.toLowerCase();
	    var obj = flag(this, 'object'),
	        article = ~['a', 'e', 'i', 'o', 'u'].indexOf(type.charAt(0)) ? 'an ' : 'a ';

	    this.assert(type === _.type(obj), 'expected #{this} to be ' + article + type, 'expected #{this} not to be ' + article + type);
	  }

	  Assertion.addChainableMethod('an', an);
	  Assertion.addChainableMethod('a', an);

	  /**
	   * ### .include(value)
	   *
	   * The `include` and `contain` assertions can be used as either property
	   * based language chains or as methods to assert the inclusion of an object
	   * in an array or a substring in a string. When used as language chains,
	   * they toggle the `contains` flag for the `keys` assertion.
	   *
	   *     expect([1,2,3]).to.include(2);
	   *     expect('foobar').to.contain('foo');
	   *     expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');
	   *
	   * @name include
	   * @alias contain
	   * @alias includes
	   * @alias contains
	   * @param {Object|String|Number} obj
	   * @param {String} message _optional_
	   * @api public
	   */

	  function includeChainingBehavior() {
	    flag(this, 'contains', true);
	  }

	  function include(val, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    var expected = false;
	    if (_.type(obj) === 'array' && _.type(val) === 'object') {
	      for (var i in obj) {
	        if (_.eql(obj[i], val)) {
	          expected = true;
	          break;
	        }
	      }
	    } else if (_.type(val) === 'object') {
	      if (!flag(this, 'negate')) {
	        for (var k in val) new Assertion(obj).property(k, val[k]);
	        return;
	      }
	      var subset = {};
	      for (var k in val) subset[k] = obj[k];
	      expected = _.eql(subset, val);
	    } else {
	      expected = obj != undefined && ~obj.indexOf(val);
	    }
	    this.assert(expected, 'expected #{this} to include ' + _.inspect(val), 'expected #{this} to not include ' + _.inspect(val));
	  }

	  Assertion.addChainableMethod('include', include, includeChainingBehavior);
	  Assertion.addChainableMethod('contain', include, includeChainingBehavior);
	  Assertion.addChainableMethod('contains', include, includeChainingBehavior);
	  Assertion.addChainableMethod('includes', include, includeChainingBehavior);

	  /**
	   * ### .ok
	   *
	   * Asserts that the target is truthy.
	   *
	   *     expect('everthing').to.be.ok;
	   *     expect(1).to.be.ok;
	   *     expect(false).to.not.be.ok;
	   *     expect(undefined).to.not.be.ok;
	   *     expect(null).to.not.be.ok;
	   *
	   * @name ok
	   * @api public
	   */

	  Assertion.addProperty('ok', function () {
	    this.assert(flag(this, 'object'), 'expected #{this} to be truthy', 'expected #{this} to be falsy');
	  });

	  /**
	   * ### .true
	   *
	   * Asserts that the target is `true`.
	   *
	   *     expect(true).to.be.true;
	   *     expect(1).to.not.be.true;
	   *
	   * @name true
	   * @api public
	   */

	  Assertion.addProperty('true', function () {
	    this.assert(true === flag(this, 'object'), 'expected #{this} to be true', 'expected #{this} to be false', this.negate ? false : true);
	  });

	  /**
	   * ### .false
	   *
	   * Asserts that the target is `false`.
	   *
	   *     expect(false).to.be.false;
	   *     expect(0).to.not.be.false;
	   *
	   * @name false
	   * @api public
	   */

	  Assertion.addProperty('false', function () {
	    this.assert(false === flag(this, 'object'), 'expected #{this} to be false', 'expected #{this} to be true', this.negate ? true : false);
	  });

	  /**
	   * ### .null
	   *
	   * Asserts that the target is `null`.
	   *
	   *     expect(null).to.be.null;
	   *     expect(undefined).to.not.be.null;
	   *
	   * @name null
	   * @api public
	   */

	  Assertion.addProperty('null', function () {
	    this.assert(null === flag(this, 'object'), 'expected #{this} to be null', 'expected #{this} not to be null');
	  });

	  /**
	   * ### .undefined
	   *
	   * Asserts that the target is `undefined`.
	   *
	   *     expect(undefined).to.be.undefined;
	   *     expect(null).to.not.be.undefined;
	   *
	   * @name undefined
	   * @api public
	   */

	  Assertion.addProperty('undefined', function () {
	    this.assert(undefined === flag(this, 'object'), 'expected #{this} to be undefined', 'expected #{this} not to be undefined');
	  });

	  /**
	   * ### .NaN
	   * Asserts that the target is `NaN`.
	   *
	   *     expect('foo').to.be.NaN;
	   *     expect(4).not.to.be.NaN;
	   *
	   * @name NaN
	   * @api public
	   */

	  Assertion.addProperty('NaN', function () {
	    this.assert(isNaN(flag(this, 'object')), 'expected #{this} to be NaN', 'expected #{this} not to be NaN');
	  });

	  /**
	   * ### .exist
	   *
	   * Asserts that the target is neither `null` nor `undefined`.
	   *
	   *     var foo = 'hi'
	   *       , bar = null
	   *       , baz;
	   *
	   *     expect(foo).to.exist;
	   *     expect(bar).to.not.exist;
	   *     expect(baz).to.not.exist;
	   *
	   * @name exist
	   * @api public
	   */

	  Assertion.addProperty('exist', function () {
	    this.assert(null != flag(this, 'object'), 'expected #{this} to exist', 'expected #{this} to not exist');
	  });

	  /**
	   * ### .empty
	   *
	   * Asserts that the target's length is `0`. For arrays and strings, it checks
	   * the `length` property. For objects, it gets the count of
	   * enumerable keys.
	   *
	   *     expect([]).to.be.empty;
	   *     expect('').to.be.empty;
	   *     expect({}).to.be.empty;
	   *
	   * @name empty
	   * @api public
	   */

	  Assertion.addProperty('empty', function () {
	    this.assert(Object.keys(Object(flag(this, 'object'))).length === 0, 'expected #{this} to be empty', 'expected #{this} not to be empty');
	  });

	  /**
	   * ### .arguments
	   *
	   * Asserts that the target is an arguments object.
	   *
	   *     function test () {
	   *       expect(arguments).to.be.arguments;
	   *     }
	   *
	   * @name arguments
	   * @alias Arguments
	   * @api public
	   */

	  function checkArguments() {
	    var obj = flag(this, 'object'),
	        type = Object.prototype.toString.call(obj);
	    this.assert('[object Arguments]' === type, 'expected #{this} to be arguments but got ' + type, 'expected #{this} to not be arguments');
	  }

	  Assertion.addProperty('arguments', checkArguments);
	  Assertion.addProperty('Arguments', checkArguments);

	  /**
	   * ### .equal(value)
	   *
	   * Asserts that the target is strictly equal (`===`) to `value`.
	   * Alternately, if the `deep` flag is set, asserts that
	   * the target is deeply equal to `value`.
	   *
	   *     expect('hello').to.equal('hello');
	   *     expect(42).to.equal(42);
	   *     expect(1).to.not.equal(true);
	   *     expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });
	   *     expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });
	   *
	   * @name equal
	   * @alias equals
	   * @alias eq
	   * @alias deep.equal
	   * @param {Mixed} value
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertEqual(val, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    if (flag(this, 'deep')) {
	      return this.eql(val);
	    } else {
	      this.assert(val === obj, 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{exp}', val, this._obj, true);
	    }
	  }

	  Assertion.addMethod('equal', assertEqual);
	  Assertion.addMethod('equals', assertEqual);
	  Assertion.addMethod('eq', assertEqual);

	  /**
	   * ### .eql(value)
	   *
	   * Asserts that the target is deeply equal to `value`.
	   *
	   *     expect({ foo: 'bar' }).to.eql({ foo: 'bar' });
	   *     expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);
	   *
	   * @name eql
	   * @alias eqls
	   * @param {Mixed} value
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertEql(obj, msg) {
	    if (msg) flag(this, 'message', msg);
	    this.assert(_.eql(obj, flag(this, 'object')), 'expected #{this} to deeply equal #{exp}', 'expected #{this} to not deeply equal #{exp}', obj, this._obj, true);
	  }

	  Assertion.addMethod('eql', assertEql);
	  Assertion.addMethod('eqls', assertEql);

	  /**
	   * ### .above(value)
	   *
	   * Asserts that the target is greater than `value`.
	   *
	   *     expect(10).to.be.above(5);
	   *
	   * Can also be used in conjunction with `length` to
	   * assert a minimum length. The benefit being a
	   * more informative error message than if the length
	   * was supplied directly.
	   *
	   *     expect('foo').to.have.length.above(2);
	   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
	   *
	   * @name above
	   * @alias gt
	   * @alias greaterThan
	   * @param {Number} value
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertAbove(n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    if (flag(this, 'doLength')) {
	      new Assertion(obj, msg).to.have.property('length');
	      var len = obj.length;
	      this.assert(len > n, 'expected #{this} to have a length above #{exp} but got #{act}', 'expected #{this} to not have a length above #{exp}', n, len);
	    } else {
	      this.assert(obj > n, 'expected #{this} to be above ' + n, 'expected #{this} to be at most ' + n);
	    }
	  }

	  Assertion.addMethod('above', assertAbove);
	  Assertion.addMethod('gt', assertAbove);
	  Assertion.addMethod('greaterThan', assertAbove);

	  /**
	   * ### .least(value)
	   *
	   * Asserts that the target is greater than or equal to `value`.
	   *
	   *     expect(10).to.be.at.least(10);
	   *
	   * Can also be used in conjunction with `length` to
	   * assert a minimum length. The benefit being a
	   * more informative error message than if the length
	   * was supplied directly.
	   *
	   *     expect('foo').to.have.length.of.at.least(2);
	   *     expect([ 1, 2, 3 ]).to.have.length.of.at.least(3);
	   *
	   * @name least
	   * @alias gte
	   * @param {Number} value
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertLeast(n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    if (flag(this, 'doLength')) {
	      new Assertion(obj, msg).to.have.property('length');
	      var len = obj.length;
	      this.assert(len >= n, 'expected #{this} to have a length at least #{exp} but got #{act}', 'expected #{this} to have a length below #{exp}', n, len);
	    } else {
	      this.assert(obj >= n, 'expected #{this} to be at least ' + n, 'expected #{this} to be below ' + n);
	    }
	  }

	  Assertion.addMethod('least', assertLeast);
	  Assertion.addMethod('gte', assertLeast);

	  /**
	   * ### .below(value)
	   *
	   * Asserts that the target is less than `value`.
	   *
	   *     expect(5).to.be.below(10);
	   *
	   * Can also be used in conjunction with `length` to
	   * assert a maximum length. The benefit being a
	   * more informative error message than if the length
	   * was supplied directly.
	   *
	   *     expect('foo').to.have.length.below(4);
	   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
	   *
	   * @name below
	   * @alias lt
	   * @alias lessThan
	   * @param {Number} value
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertBelow(n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    if (flag(this, 'doLength')) {
	      new Assertion(obj, msg).to.have.property('length');
	      var len = obj.length;
	      this.assert(len < n, 'expected #{this} to have a length below #{exp} but got #{act}', 'expected #{this} to not have a length below #{exp}', n, len);
	    } else {
	      this.assert(obj < n, 'expected #{this} to be below ' + n, 'expected #{this} to be at least ' + n);
	    }
	  }

	  Assertion.addMethod('below', assertBelow);
	  Assertion.addMethod('lt', assertBelow);
	  Assertion.addMethod('lessThan', assertBelow);

	  /**
	   * ### .most(value)
	   *
	   * Asserts that the target is less than or equal to `value`.
	   *
	   *     expect(5).to.be.at.most(5);
	   *
	   * Can also be used in conjunction with `length` to
	   * assert a maximum length. The benefit being a
	   * more informative error message than if the length
	   * was supplied directly.
	   *
	   *     expect('foo').to.have.length.of.at.most(4);
	   *     expect([ 1, 2, 3 ]).to.have.length.of.at.most(3);
	   *
	   * @name most
	   * @alias lte
	   * @param {Number} value
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertMost(n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    if (flag(this, 'doLength')) {
	      new Assertion(obj, msg).to.have.property('length');
	      var len = obj.length;
	      this.assert(len <= n, 'expected #{this} to have a length at most #{exp} but got #{act}', 'expected #{this} to have a length above #{exp}', n, len);
	    } else {
	      this.assert(obj <= n, 'expected #{this} to be at most ' + n, 'expected #{this} to be above ' + n);
	    }
	  }

	  Assertion.addMethod('most', assertMost);
	  Assertion.addMethod('lte', assertMost);

	  /**
	   * ### .within(start, finish)
	   *
	   * Asserts that the target is within a range.
	   *
	   *     expect(7).to.be.within(5,10);
	   *
	   * Can also be used in conjunction with `length` to
	   * assert a length range. The benefit being a
	   * more informative error message than if the length
	   * was supplied directly.
	   *
	   *     expect('foo').to.have.length.within(2,4);
	   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
	   *
	   * @name within
	   * @param {Number} start lowerbound inclusive
	   * @param {Number} finish upperbound inclusive
	   * @param {String} message _optional_
	   * @api public
	   */

	  Assertion.addMethod('within', function (start, finish, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object'),
	        range = start + '..' + finish;
	    if (flag(this, 'doLength')) {
	      new Assertion(obj, msg).to.have.property('length');
	      var len = obj.length;
	      this.assert(len >= start && len <= finish, 'expected #{this} to have a length within ' + range, 'expected #{this} to not have a length within ' + range);
	    } else {
	      this.assert(obj >= start && obj <= finish, 'expected #{this} to be within ' + range, 'expected #{this} to not be within ' + range);
	    }
	  });

	  /**
	   * ### .instanceof(constructor)
	   *
	   * Asserts that the target is an instance of `constructor`.
	   *
	   *     var Tea = function (name) { this.name = name; }
	   *       , Chai = new Tea('chai');
	   *
	   *     expect(Chai).to.be.an.instanceof(Tea);
	   *     expect([ 1, 2, 3 ]).to.be.instanceof(Array);
	   *
	   * @name instanceof
	   * @param {Constructor} constructor
	   * @param {String} message _optional_
	   * @alias instanceOf
	   * @api public
	   */

	  function assertInstanceOf(constructor, msg) {
	    if (msg) flag(this, 'message', msg);
	    var name = _.getName(constructor);
	    this.assert(flag(this, 'object') instanceof constructor, 'expected #{this} to be an instance of ' + name, 'expected #{this} to not be an instance of ' + name);
	  };

	  Assertion.addMethod('instanceof', assertInstanceOf);
	  Assertion.addMethod('instanceOf', assertInstanceOf);

	  /**
	   * ### .property(name, [value])
	   *
	   * Asserts that the target has a property `name`, optionally asserting that
	   * the value of that property is strictly equal to  `value`.
	   * If the `deep` flag is set, you can use dot- and bracket-notation for deep
	   * references into objects and arrays.
	   *
	   *     // simple referencing
	   *     var obj = { foo: 'bar' };
	   *     expect(obj).to.have.property('foo');
	   *     expect(obj).to.have.property('foo', 'bar');
	   *
	   *     // deep referencing
	   *     var deepObj = {
	   *         green: { tea: 'matcha' }
	   *       , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]
	   *     };
	   *
	   *     expect(deepObj).to.have.deep.property('green.tea', 'matcha');
	   *     expect(deepObj).to.have.deep.property('teas[1]', 'matcha');
	   *     expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');
	   *
	   * You can also use an array as the starting point of a `deep.property`
	   * assertion, or traverse nested arrays.
	   *
	   *     var arr = [
	   *         [ 'chai', 'matcha', 'konacha' ]
	   *       , [ { tea: 'chai' }
	   *         , { tea: 'matcha' }
	   *         , { tea: 'konacha' } ]
	   *     ];
	   *
	   *     expect(arr).to.have.deep.property('[0][1]', 'matcha');
	   *     expect(arr).to.have.deep.property('[1][2].tea', 'konacha');
	   *
	   * Furthermore, `property` changes the subject of the assertion
	   * to be the value of that property from the original object. This
	   * permits for further chainable assertions on that property.
	   *
	   *     expect(obj).to.have.property('foo')
	   *       .that.is.a('string');
	   *     expect(deepObj).to.have.property('green')
	   *       .that.is.an('object')
	   *       .that.deep.equals({ tea: 'matcha' });
	   *     expect(deepObj).to.have.property('teas')
	   *       .that.is.an('array')
	   *       .with.deep.property('[2]')
	   *         .that.deep.equals({ tea: 'konacha' });
	   *
	   * Note that dots and bracket in `name` must be backslash-escaped when
	   * the `deep` flag is set, while they must NOT be escaped when the `deep`
	   * flag is not set.
	   *
	   *     // simple referencing
	   *     var css = { '.link[target]': 42 };
	   *     expect(css).to.have.property('.link[target]', 42);
	   *
	   *     // deep referencing
	   *     var deepCss = { '.link': { '[target]': 42 }};
	   *     expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
	   *
	   * @name property
	   * @alias deep.property
	   * @param {String} name
	   * @param {Mixed} value (optional)
	   * @param {String} message _optional_
	   * @returns value of property for chaining
	   * @api public
	   */

	  Assertion.addMethod('property', function (name, val, msg) {
	    if (msg) flag(this, 'message', msg);

	    var isDeep = !!flag(this, 'deep'),
	        descriptor = isDeep ? 'deep property ' : 'property ',
	        negate = flag(this, 'negate'),
	        obj = flag(this, 'object'),
	        pathInfo = isDeep ? _.getPathInfo(name, obj) : null,
	        hasProperty = isDeep ? pathInfo.exists : _.hasProperty(name, obj),
	        value = isDeep ? pathInfo.value : obj[name];

	    if (negate && arguments.length > 1) {
	      if (undefined === value) {
	        msg = msg != null ? msg + ': ' : '';
	        throw new Error(msg + _.inspect(obj) + ' has no ' + descriptor + _.inspect(name));
	      }
	    } else {
	      this.assert(hasProperty, 'expected #{this} to have a ' + descriptor + _.inspect(name), 'expected #{this} to not have ' + descriptor + _.inspect(name));
	    }

	    if (arguments.length > 1) {
	      this.assert(val === value, 'expected #{this} to have a ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}', 'expected #{this} to not have a ' + descriptor + _.inspect(name) + ' of #{act}', val, value);
	    }

	    flag(this, 'object', value);
	  });

	  /**
	   * ### .ownProperty(name)
	   *
	   * Asserts that the target has an own property `name`.
	   *
	   *     expect('test').to.have.ownProperty('length');
	   *
	   * @name ownProperty
	   * @alias haveOwnProperty
	   * @param {String} name
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertOwnProperty(name, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    this.assert(obj.hasOwnProperty(name), 'expected #{this} to have own property ' + _.inspect(name), 'expected #{this} to not have own property ' + _.inspect(name));
	  }

	  Assertion.addMethod('ownProperty', assertOwnProperty);
	  Assertion.addMethod('haveOwnProperty', assertOwnProperty);

	  /**
	   * ### .ownPropertyDescriptor(name[, descriptor[, message]])
	   *
	   * Asserts that the target has an own property descriptor `name`, that optionally matches `descriptor`.
	   *
	   *     expect('test').to.have.ownPropertyDescriptor('length');
	   *     expect('test').to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 4 });
	   *     expect('test').not.to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 3 });
	   *     expect('test').ownPropertyDescriptor('length').to.have.property('enumerable', false);
	   *     expect('test').ownPropertyDescriptor('length').to.have.keys('value');
	   *
	   * @name ownPropertyDescriptor
	   * @alias haveOwnPropertyDescriptor
	   * @param {String} name
	   * @param {Object} descriptor _optional_
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertOwnPropertyDescriptor(name, descriptor, msg) {
	    if (typeof descriptor === 'string') {
	      msg = descriptor;
	      descriptor = null;
	    }
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
	    if (actualDescriptor && descriptor) {
	      this.assert(_.eql(descriptor, actualDescriptor), 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor), 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor), descriptor, actualDescriptor, true);
	    } else {
	      this.assert(actualDescriptor, 'expected #{this} to have an own property descriptor for ' + _.inspect(name), 'expected #{this} to not have an own property descriptor for ' + _.inspect(name));
	    }
	    flag(this, 'object', actualDescriptor);
	  }

	  Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
	  Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);

	  /**
	   * ### .length
	   *
	   * Sets the `doLength` flag later used as a chain precursor to a value
	   * comparison for the `length` property.
	   *
	   *     expect('foo').to.have.length.above(2);
	   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
	   *     expect('foo').to.have.length.below(4);
	   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
	   *     expect('foo').to.have.length.within(2,4);
	   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
	   *
	   * *Deprecation notice:* Using `length` as an assertion will be deprecated
	   * in version 2.4.0 and removed in 3.0.0. Code using the old style of
	   * asserting for `length` property value using `length(value)` should be
	   * switched to use `lengthOf(value)` instead.
	   *
	   * @name length
	   * @api public
	   */

	  /**
	   * ### .lengthOf(value[, message])
	   *
	   * Asserts that the target's `length` property has
	   * the expected value.
	   *
	   *     expect([ 1, 2, 3]).to.have.lengthOf(3);
	   *     expect('foobar').to.have.lengthOf(6);
	   *
	   * @name lengthOf
	   * @param {Number} length
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertLengthChain() {
	    flag(this, 'doLength', true);
	  }

	  function assertLength(n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    new Assertion(obj, msg).to.have.property('length');
	    var len = obj.length;

	    this.assert(len == n, 'expected #{this} to have a length of #{exp} but got #{act}', 'expected #{this} to not have a length of #{act}', n, len);
	  }

	  Assertion.addChainableMethod('length', assertLength, assertLengthChain);
	  Assertion.addMethod('lengthOf', assertLength);

	  /**
	   * ### .match(regexp)
	   *
	   * Asserts that the target matches a regular expression.
	   *
	   *     expect('foobar').to.match(/^foo/);
	   *
	   * @name match
	   * @alias matches
	   * @param {RegExp} RegularExpression
	   * @param {String} message _optional_
	   * @api public
	   */
	  function assertMatch(re, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    this.assert(re.exec(obj), 'expected #{this} to match ' + re, 'expected #{this} not to match ' + re);
	  }

	  Assertion.addMethod('match', assertMatch);
	  Assertion.addMethod('matches', assertMatch);

	  /**
	   * ### .string(string)
	   *
	   * Asserts that the string target contains another string.
	   *
	   *     expect('foobar').to.have.string('bar');
	   *
	   * @name string
	   * @param {String} string
	   * @param {String} message _optional_
	   * @api public
	   */

	  Assertion.addMethod('string', function (str, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    new Assertion(obj, msg).is.a('string');

	    this.assert(~obj.indexOf(str), 'expected #{this} to contain ' + _.inspect(str), 'expected #{this} to not contain ' + _.inspect(str));
	  });

	  /**
	   * ### .keys(key1, [key2], [...])
	   *
	   * Asserts that the target contains any or all of the passed-in keys.
	   * Use in combination with `any`, `all`, `contains`, or `have` will affect
	   * what will pass.
	   *
	   * When used in conjunction with `any`, at least one key that is passed
	   * in must exist in the target object. This is regardless whether or not
	   * the `have` or `contain` qualifiers are used. Note, either `any` or `all`
	   * should be used in the assertion. If neither are used, the assertion is
	   * defaulted to `all`.
	   *
	   * When both `all` and `contain` are used, the target object must have at
	   * least all of the passed-in keys but may have more keys not listed.
	   *
	   * When both `all` and `have` are used, the target object must both contain
	   * all of the passed-in keys AND the number of keys in the target object must
	   * match the number of keys passed in (in other words, a target object must
	   * have all and only all of the passed-in keys).
	   *
	   *     expect({ foo: 1, bar: 2 }).to.have.any.keys('foo', 'baz');
	   *     expect({ foo: 1, bar: 2 }).to.have.any.keys('foo');
	   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys('bar', 'baz');
	   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys(['foo']);
	   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys({'foo': 6});
	   *     expect({ foo: 1, bar: 2 }).to.have.all.keys(['bar', 'foo']);
	   *     expect({ foo: 1, bar: 2 }).to.have.all.keys({'bar': 6, 'foo': 7});
	   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys(['bar', 'foo']);
	   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys({'bar': 6});
	   *
	   *
	   * @name keys
	   * @alias key
	   * @param {String...|Array|Object} keys
	   * @api public
	   */

	  function assertKeys(keys) {
	    var obj = flag(this, 'object'),
	        str,
	        ok = true,
	        mixedArgsMsg = 'keys must be given single argument of Array|Object|String, or multiple String arguments';

	    switch (_.type(keys)) {
	      case "array":
	        if (arguments.length > 1) throw new Error(mixedArgsMsg);
	        break;
	      case "object":
	        if (arguments.length > 1) throw new Error(mixedArgsMsg);
	        keys = Object.keys(keys);
	        break;
	      default:
	        keys = Array.prototype.slice.call(arguments);
	    }

	    if (!keys.length) throw new Error('keys required');

	    var actual = Object.keys(obj),
	        expected = keys,
	        len = keys.length,
	        any = flag(this, 'any'),
	        all = flag(this, 'all');

	    if (!any && !all) {
	      all = true;
	    }

	    // Has any
	    if (any) {
	      var intersection = expected.filter(function (key) {
	        return ~actual.indexOf(key);
	      });
	      ok = intersection.length > 0;
	    }

	    // Has all
	    if (all) {
	      ok = keys.every(function (key) {
	        return ~actual.indexOf(key);
	      });
	      if (!flag(this, 'negate') && !flag(this, 'contains')) {
	        ok = ok && keys.length == actual.length;
	      }
	    }

	    // Key string
	    if (len > 1) {
	      keys = keys.map(function (key) {
	        return _.inspect(key);
	      });
	      var last = keys.pop();
	      if (all) {
	        str = keys.join(', ') + ', and ' + last;
	      }
	      if (any) {
	        str = keys.join(', ') + ', or ' + last;
	      }
	    } else {
	      str = _.inspect(keys[0]);
	    }

	    // Form
	    str = (len > 1 ? 'keys ' : 'key ') + str;

	    // Have / include
	    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

	    // Assertion
	    this.assert(ok, 'expected #{this} to ' + str, 'expected #{this} to not ' + str, expected.slice(0).sort(), actual.sort(), true);
	  }

	  Assertion.addMethod('keys', assertKeys);
	  Assertion.addMethod('key', assertKeys);

	  /**
	   * ### .throw(constructor)
	   *
	   * Asserts that the function target will throw a specific error, or specific type of error
	   * (as determined using `instanceof`), optionally with a RegExp or string inclusion test
	   * for the error's message.
	   *
	   *     var err = new ReferenceError('This is a bad function.');
	   *     var fn = function () { throw err; }
	   *     expect(fn).to.throw(ReferenceError);
	   *     expect(fn).to.throw(Error);
	   *     expect(fn).to.throw(/bad function/);
	   *     expect(fn).to.not.throw('good function');
	   *     expect(fn).to.throw(ReferenceError, /bad function/);
	   *     expect(fn).to.throw(err);
	   *     expect(fn).to.not.throw(new RangeError('Out of range.'));
	   *
	   * Please note that when a throw expectation is negated, it will check each
	   * parameter independently, starting with error constructor type. The appropriate way
	   * to check for the existence of a type of error but for a message that does not match
	   * is to use `and`.
	   *
	   *     expect(fn).to.throw(ReferenceError)
	   *        .and.not.throw(/good function/);
	   *
	   * @name throw
	   * @alias throws
	   * @alias Throw
	   * @param {ErrorConstructor} constructor
	   * @param {String|RegExp} expected error message
	   * @param {String} message _optional_
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @returns error for chaining (null if no error)
	   * @api public
	   */

	  function assertThrows(constructor, errMsg, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    new Assertion(obj, msg).is.a('function');

	    var thrown = false,
	        desiredError = null,
	        name = null,
	        thrownError = null;

	    if (arguments.length === 0) {
	      errMsg = null;
	      constructor = null;
	    } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {
	      errMsg = constructor;
	      constructor = null;
	    } else if (constructor && constructor instanceof Error) {
	      desiredError = constructor;
	      constructor = null;
	      errMsg = null;
	    } else if (typeof constructor === 'function') {
	      name = constructor.prototype.name || constructor.name;
	      if (name === 'Error' && constructor !== Error) {
	        name = new constructor().name;
	      }
	    } else {
	      constructor = null;
	    }

	    try {
	      obj();
	    } catch (err) {
	      // first, check desired error
	      if (desiredError) {
	        this.assert(err === desiredError, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp}', desiredError instanceof Error ? desiredError.toString() : desiredError, err instanceof Error ? err.toString() : err);

	        flag(this, 'object', err);
	        return this;
	      }

	      // next, check constructor
	      if (constructor) {
	        this.assert(err instanceof constructor, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp} but #{act} was thrown', name, err instanceof Error ? err.toString() : err);

	        if (!errMsg) {
	          flag(this, 'object', err);
	          return this;
	        }
	      }

	      // next, check message
	      var message = 'error' === _.type(err) && "message" in err ? err.message : '' + err;

	      if (message != null && errMsg && errMsg instanceof RegExp) {
	        this.assert(errMsg.exec(message), 'expected #{this} to throw error matching #{exp} but got #{act}', 'expected #{this} to throw error not matching #{exp}', errMsg, message);

	        flag(this, 'object', err);
	        return this;
	      } else if (message != null && errMsg && 'string' === typeof errMsg) {
	        this.assert(~message.indexOf(errMsg), 'expected #{this} to throw error including #{exp} but got #{act}', 'expected #{this} to throw error not including #{act}', errMsg, message);

	        flag(this, 'object', err);
	        return this;
	      } else {
	        thrown = true;
	        thrownError = err;
	      }
	    }

	    var actuallyGot = '',
	        expectedThrown = name !== null ? name : desiredError ? '#{exp}' //_.inspect(desiredError)
	    : 'an error';

	    if (thrown) {
	      actuallyGot = ' but #{act} was thrown';
	    }

	    this.assert(thrown === true, 'expected #{this} to throw ' + expectedThrown + actuallyGot, 'expected #{this} to not throw ' + expectedThrown + actuallyGot, desiredError instanceof Error ? desiredError.toString() : desiredError, thrownError instanceof Error ? thrownError.toString() : thrownError);

	    flag(this, 'object', thrownError);
	  };

	  Assertion.addMethod('throw', assertThrows);
	  Assertion.addMethod('throws', assertThrows);
	  Assertion.addMethod('Throw', assertThrows);

	  /**
	   * ### .respondTo(method)
	   *
	   * Asserts that the object or class target will respond to a method.
	   *
	   *     Klass.prototype.bar = function(){};
	   *     expect(Klass).to.respondTo('bar');
	   *     expect(obj).to.respondTo('bar');
	   *
	   * To check if a constructor will respond to a static function,
	   * set the `itself` flag.
	   *
	   *     Klass.baz = function(){};
	   *     expect(Klass).itself.to.respondTo('baz');
	   *
	   * @name respondTo
	   * @alias respondsTo
	   * @param {String} method
	   * @param {String} message _optional_
	   * @api public
	   */

	  function respondTo(method, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object'),
	        itself = flag(this, 'itself'),
	        context = 'function' === _.type(obj) && !itself ? obj.prototype[method] : obj[method];

	    this.assert('function' === typeof context, 'expected #{this} to respond to ' + _.inspect(method), 'expected #{this} to not respond to ' + _.inspect(method));
	  }

	  Assertion.addMethod('respondTo', respondTo);
	  Assertion.addMethod('respondsTo', respondTo);

	  /**
	   * ### .itself
	   *
	   * Sets the `itself` flag, later used by the `respondTo` assertion.
	   *
	   *     function Foo() {}
	   *     Foo.bar = function() {}
	   *     Foo.prototype.baz = function() {}
	   *
	   *     expect(Foo).itself.to.respondTo('bar');
	   *     expect(Foo).itself.not.to.respondTo('baz');
	   *
	   * @name itself
	   * @api public
	   */

	  Assertion.addProperty('itself', function () {
	    flag(this, 'itself', true);
	  });

	  /**
	   * ### .satisfy(method)
	   *
	   * Asserts that the target passes a given truth test.
	   *
	   *     expect(1).to.satisfy(function(num) { return num > 0; });
	   *
	   * @name satisfy
	   * @alias satisfies
	   * @param {Function} matcher
	   * @param {String} message _optional_
	   * @api public
	   */

	  function satisfy(matcher, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    var result = matcher(obj);
	    this.assert(result, 'expected #{this} to satisfy ' + _.objDisplay(matcher), 'expected #{this} to not satisfy' + _.objDisplay(matcher), this.negate ? false : true, result);
	  }

	  Assertion.addMethod('satisfy', satisfy);
	  Assertion.addMethod('satisfies', satisfy);

	  /**
	   * ### .closeTo(expected, delta)
	   *
	   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
	   *
	   *     expect(1.5).to.be.closeTo(1, 0.5);
	   *
	   * @name closeTo
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} message _optional_
	   * @api public
	   */

	  Assertion.addMethod('closeTo', function (expected, delta, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');

	    new Assertion(obj, msg).is.a('number');
	    if (_.type(expected) !== 'number' || _.type(delta) !== 'number') {
	      throw new Error('the arguments to closeTo must be numbers');
	    }

	    this.assert(Math.abs(obj - expected) <= delta, 'expected #{this} to be close to ' + expected + ' +/- ' + delta, 'expected #{this} not to be close to ' + expected + ' +/- ' + delta);
	  });

	  function isSubsetOf(subset, superset, cmp) {
	    return subset.every(function (elem) {
	      if (!cmp) return superset.indexOf(elem) !== -1;

	      return superset.some(function (elem2) {
	        return cmp(elem, elem2);
	      });
	    });
	  }

	  /**
	   * ### .members(set)
	   *
	   * Asserts that the target is a superset of `set`,
	   * or that the target and `set` have the same strictly-equal (===) members.
	   * Alternately, if the `deep` flag is set, set members are compared for deep
	   * equality.
	   *
	   *     expect([1, 2, 3]).to.include.members([3, 2]);
	   *     expect([1, 2, 3]).to.not.include.members([3, 2, 8]);
	   *
	   *     expect([4, 2]).to.have.members([2, 4]);
	   *     expect([5, 2]).to.not.have.members([5, 2, 1]);
	   *
	   *     expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }]);
	   *
	   * @name members
	   * @param {Array} set
	   * @param {String} message _optional_
	   * @api public
	   */

	  Assertion.addMethod('members', function (subset, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');

	    new Assertion(obj).to.be.an('array');
	    new Assertion(subset).to.be.an('array');

	    var cmp = flag(this, 'deep') ? _.eql : undefined;

	    if (flag(this, 'contains')) {
	      return this.assert(isSubsetOf(subset, obj, cmp), 'expected #{this} to be a superset of #{act}', 'expected #{this} to not be a superset of #{act}', obj, subset);
	    }

	    this.assert(isSubsetOf(obj, subset, cmp) && isSubsetOf(subset, obj, cmp), 'expected #{this} to have the same members as #{act}', 'expected #{this} to not have the same members as #{act}', obj, subset);
	  });

	  /**
	   * ### .change(function)
	   *
	   * Asserts that a function changes an object property
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 3 };
	   *     var noChangeFn = function() { return 'foo' + 'bar'; }
	   *     expect(fn).to.change(obj, 'val');
	   *     expect(noChangFn).to.not.change(obj, 'val')
	   *
	   * @name change
	   * @alias changes
	   * @alias Change
	   * @param {String} object
	   * @param {String} property name
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertChanges(object, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object');
	    new Assertion(object, msg).to.have.property(prop);
	    new Assertion(fn).is.a('function');

	    var initial = object[prop];
	    fn();

	    this.assert(initial !== object[prop], 'expected .' + prop + ' to change', 'expected .' + prop + ' to not change');
	  }

	  Assertion.addChainableMethod('change', assertChanges);
	  Assertion.addChainableMethod('changes', assertChanges);

	  /**
	   * ### .increase(function)
	   *
	   * Asserts that a function increases an object property
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 15 };
	   *     expect(fn).to.increase(obj, 'val');
	   *
	   * @name increase
	   * @alias increases
	   * @alias Increase
	   * @param {String} object
	   * @param {String} property name
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertIncreases(object, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object');
	    new Assertion(object, msg).to.have.property(prop);
	    new Assertion(fn).is.a('function');

	    var initial = object[prop];
	    fn();

	    this.assert(object[prop] - initial > 0, 'expected .' + prop + ' to increase', 'expected .' + prop + ' to not increase');
	  }

	  Assertion.addChainableMethod('increase', assertIncreases);
	  Assertion.addChainableMethod('increases', assertIncreases);

	  /**
	   * ### .decrease(function)
	   *
	   * Asserts that a function decreases an object property
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     expect(fn).to.decrease(obj, 'val');
	   *
	   * @name decrease
	   * @alias decreases
	   * @alias Decrease
	   * @param {String} object
	   * @param {String} property name
	   * @param {String} message _optional_
	   * @api public
	   */

	  function assertDecreases(object, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object');
	    new Assertion(object, msg).to.have.property(prop);
	    new Assertion(fn).is.a('function');

	    var initial = object[prop];
	    fn();

	    this.assert(object[prop] - initial < 0, 'expected .' + prop + ' to decrease', 'expected .' + prop + ' to not decrease');
	  }

	  Assertion.addChainableMethod('decrease', assertDecreases);
	  Assertion.addChainableMethod('decreases', assertDecreases);

	  /**
	   * ### .extensible
	   *
	   * Asserts that the target is extensible (can have new properties added to
	   * it).
	   *
	   *     var nonExtensibleObject = Object.preventExtensions({});
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.freeze({});
	   *
	   *     expect({}).to.be.extensible;
	   *     expect(nonExtensibleObject).to.not.be.extensible;
	   *     expect(sealedObject).to.not.be.extensible;
	   *     expect(frozenObject).to.not.be.extensible;
	   *
	   * @name extensible
	   * @api public
	   */

	  Assertion.addProperty('extensible', function () {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return false.
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
	    // The following provides ES6 behavior when a TypeError is thrown under ES5.

	    var isExtensible;

	    try {
	      isExtensible = Object.isExtensible(obj);
	    } catch (err) {
	      if (err instanceof TypeError) isExtensible = false;else throw err;
	    }

	    this.assert(isExtensible, 'expected #{this} to be extensible', 'expected #{this} to not be extensible');
	  });

	  /**
	   * ### .sealed
	   *
	   * Asserts that the target is sealed (cannot have new properties added to it
	   * and its existing properties cannot be removed).
	   *
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.freeze({});
	   *
	   *     expect(sealedObject).to.be.sealed;
	   *     expect(frozenObject).to.be.sealed;
	   *     expect({}).to.not.be.sealed;
	   *
	   * @name sealed
	   * @api public
	   */

	  Assertion.addProperty('sealed', function () {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a sealed ordinary object, simply return true.
	    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
	    // The following provides ES6 behavior when a TypeError is thrown under ES5.

	    var isSealed;

	    try {
	      isSealed = Object.isSealed(obj);
	    } catch (err) {
	      if (err instanceof TypeError) isSealed = true;else throw err;
	    }

	    this.assert(isSealed, 'expected #{this} to be sealed', 'expected #{this} to not be sealed');
	  });

	  /**
	   * ### .frozen
	   *
	   * Asserts that the target is frozen (cannot have new properties added to it
	   * and its existing properties cannot be modified).
	   *
	   *     var frozenObject = Object.freeze({});
	   *
	   *     expect(frozenObject).to.be.frozen;
	   *     expect({}).to.not.be.frozen;
	   *
	   * @name frozen
	   * @api public
	   */

	  Assertion.addProperty('frozen', function () {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a frozen ordinary object, simply return true.
	    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
	    // The following provides ES6 behavior when a TypeError is thrown under ES5.

	    var isFrozen;

	    try {
	      isFrozen = Object.isFrozen(obj);
	    } catch (err) {
	      if (err instanceof TypeError) isFrozen = true;else throw err;
	    }

	    this.assert(isFrozen, 'expected #{this} to be frozen', 'expected #{this} to not be frozen');
	  });
	};

/***/ },
/* 59 */
/***/ function(module, exports) {

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	module.exports = function (chai, util) {
	  chai.expect = function (val, message) {
	    return new chai.Assertion(val, message);
	  };

	  /**
	   * ### .fail(actual, expected, [message], [operator])
	   *
	   * Throw a failure.
	   *
	   * @name fail
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @param {String} operator
	   * @api public
	   */

	  chai.expect.fail = function (actual, expected, message, operator) {
	    message = message || 'expect.fail()';
	    throw new chai.AssertionError(message, {
	      actual: actual,
	      expected: expected,
	      operator: operator
	    }, chai.expect.fail);
	  };
	};

/***/ },
/* 60 */
/***/ function(module, exports) {

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	module.exports = function (chai, util) {
	  var Assertion = chai.Assertion;

	  function loadShould() {
	    // explicitly define this method as function as to have it's name to include as `ssfi`
	    function shouldGetter() {
	      if (this instanceof String || this instanceof Number || this instanceof Boolean) {
	        return new Assertion(this.valueOf(), null, shouldGetter);
	      }
	      return new Assertion(this, null, shouldGetter);
	    }
	    function shouldSetter(value) {
	      // See https://github.com/chaijs/chai/issues/86: this makes
	      // `whatever.should = someValue` actually set `someValue`, which is
	      // especially useful for `global.should = require('chai').should()`.
	      //
	      // Note that we have to use [[DefineProperty]] instead of [[Put]]
	      // since otherwise we would trigger this very setter!
	      Object.defineProperty(this, 'should', {
	        value: value,
	        enumerable: true,
	        configurable: true,
	        writable: true
	      });
	    }
	    // modify Object.prototype to have `should`
	    Object.defineProperty(Object.prototype, 'should', {
	      set: shouldSetter,
	      get: shouldGetter,
	      configurable: true
	    });

	    var should = {};

	    /**
	     * ### .fail(actual, expected, [message], [operator])
	     *
	     * Throw a failure.
	     *
	     * @name fail
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @param {String} operator
	     * @api public
	     */

	    should.fail = function (actual, expected, message, operator) {
	      message = message || 'should.fail()';
	      throw new chai.AssertionError(message, {
	        actual: actual,
	        expected: expected,
	        operator: operator
	      }, should.fail);
	    };

	    should.equal = function (val1, val2, msg) {
	      new Assertion(val1, msg).to.equal(val2);
	    };

	    should.Throw = function (fn, errt, errs, msg) {
	      new Assertion(fn, msg).to.Throw(errt, errs);
	    };

	    should.exist = function (val, msg) {
	      new Assertion(val, msg).to.exist;
	    };

	    // negation
	    should.not = {};

	    should.not.equal = function (val1, val2, msg) {
	      new Assertion(val1, msg).to.not.equal(val2);
	    };

	    should.not.Throw = function (fn, errt, errs, msg) {
	      new Assertion(fn, msg).to.not.Throw(errt, errs);
	    };

	    should.not.exist = function (val, msg) {
	      new Assertion(val, msg).to.not.exist;
	    };

	    should['throw'] = should['Throw'];
	    should.not['throw'] = should.not['Throw'];

	    return should;
	  };

	  chai.should = loadShould;
	  chai.Should = loadShould;
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	'use strict';

	module.exports = function (chai, util) {

	  /*!
	   * Chai dependencies.
	   */

	  var Assertion = chai.Assertion,
	      flag = util.flag;

	  /*!
	   * Module export.
	   */

	  /**
	   * ### assert(expression, message)
	   *
	   * Write your own test expressions.
	   *
	   *     assert('foo' !== 'bar', 'foo is not bar');
	   *     assert(Array.isArray([]), 'empty arrays are arrays');
	   *
	   * @param {Mixed} expression to test for truthiness
	   * @param {String} message to display on error
	   * @name assert
	   * @api public
	   */

	  var assert = chai.assert = function (express, errmsg) {
	    var test = new Assertion(null, null, chai.assert);
	    test.assert(express, errmsg, '[ negation message unavailable ]');
	  };

	  /**
	   * ### .fail(actual, expected, [message], [operator])
	   *
	   * Throw a failure. Node.js `assert` module-compatible.
	   *
	   * @name fail
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @param {String} operator
	   * @api public
	   */

	  assert.fail = function (actual, expected, message, operator) {
	    message = message || 'assert.fail()';
	    throw new chai.AssertionError(message, {
	      actual: actual,
	      expected: expected,
	      operator: operator
	    }, assert.fail);
	  };

	  /**
	   * ### .isOk(object, [message])
	   *
	   * Asserts that `object` is truthy.
	   *
	   *     assert.isOk('everything', 'everything is ok');
	   *     assert.isOk(false, 'this will fail');
	   *
	   * @name isOk
	   * @alias ok
	   * @param {Mixed} object to test
	   * @param {String} message
	   * @api public
	   */

	  assert.isOk = function (val, msg) {
	    new Assertion(val, msg).is.ok;
	  };

	  /**
	   * ### .isNotOk(object, [message])
	   *
	   * Asserts that `object` is falsy.
	   *
	   *     assert.isNotOk('everything', 'this will fail');
	   *     assert.isNotOk(false, 'this will pass');
	   *
	   * @name isNotOk
	   * @alias notOk
	   * @param {Mixed} object to test
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotOk = function (val, msg) {
	    new Assertion(val, msg).is.not.ok;
	  };

	  /**
	   * ### .equal(actual, expected, [message])
	   *
	   * Asserts non-strict equality (`==`) of `actual` and `expected`.
	   *
	   *     assert.equal(3, '3', '== coerces values to strings');
	   *
	   * @name equal
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @api public
	   */

	  assert.equal = function (act, exp, msg) {
	    var test = new Assertion(act, msg, assert.equal);

	    test.assert(exp == flag(test, 'object'), 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{act}', exp, act);
	  };

	  /**
	   * ### .notEqual(actual, expected, [message])
	   *
	   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
	   *
	   *     assert.notEqual(3, 4, 'these numbers are not equal');
	   *
	   * @name notEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @api public
	   */

	  assert.notEqual = function (act, exp, msg) {
	    var test = new Assertion(act, msg, assert.notEqual);

	    test.assert(exp != flag(test, 'object'), 'expected #{this} to not equal #{exp}', 'expected #{this} to equal #{act}', exp, act);
	  };

	  /**
	   * ### .strictEqual(actual, expected, [message])
	   *
	   * Asserts strict equality (`===`) of `actual` and `expected`.
	   *
	   *     assert.strictEqual(true, true, 'these booleans are strictly equal');
	   *
	   * @name strictEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @api public
	   */

	  assert.strictEqual = function (act, exp, msg) {
	    new Assertion(act, msg).to.equal(exp);
	  };

	  /**
	   * ### .notStrictEqual(actual, expected, [message])
	   *
	   * Asserts strict inequality (`!==`) of `actual` and `expected`.
	   *
	   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');
	   *
	   * @name notStrictEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @api public
	   */

	  assert.notStrictEqual = function (act, exp, msg) {
	    new Assertion(act, msg).to.not.equal(exp);
	  };

	  /**
	   * ### .deepEqual(actual, expected, [message])
	   *
	   * Asserts that `actual` is deeply equal to `expected`.
	   *
	   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });
	   *
	   * @name deepEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @api public
	   */

	  assert.deepEqual = function (act, exp, msg) {
	    new Assertion(act, msg).to.eql(exp);
	  };

	  /**
	   * ### .notDeepEqual(actual, expected, [message])
	   *
	   * Assert that `actual` is not deeply equal to `expected`.
	   *
	   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
	   *
	   * @name notDeepEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @api public
	   */

	  assert.notDeepEqual = function (act, exp, msg) {
	    new Assertion(act, msg).to.not.eql(exp);
	  };

	  /**
	  * ### .isAbove(valueToCheck, valueToBeAbove, [message])
	  *
	  * Asserts `valueToCheck` is strictly greater than (>) `valueToBeAbove`
	  *
	  *     assert.isAbove(5, 2, '5 is strictly greater than 2');
	  *
	  * @name isAbove
	  * @param {Mixed} valueToCheck
	  * @param {Mixed} valueToBeAbove
	  * @param {String} message
	  * @api public
	  */

	  assert.isAbove = function (val, abv, msg) {
	    new Assertion(val, msg).to.be.above(abv);
	  };

	  /**
	  * ### .isAtLeast(valueToCheck, valueToBeAtLeast, [message])
	  *
	  * Asserts `valueToCheck` is greater than or equal to (>=) `valueToBeAtLeast`
	  *
	  *     assert.isAtLeast(5, 2, '5 is greater or equal to 2');
	  *     assert.isAtLeast(3, 3, '3 is greater or equal to 3');
	  *
	  * @name isAtLeast
	  * @param {Mixed} valueToCheck
	  * @param {Mixed} valueToBeAtLeast
	  * @param {String} message
	  * @api public
	  */

	  assert.isAtLeast = function (val, atlst, msg) {
	    new Assertion(val, msg).to.be.least(atlst);
	  };

	  /**
	  * ### .isBelow(valueToCheck, valueToBeBelow, [message])
	  *
	  * Asserts `valueToCheck` is strictly less than (<) `valueToBeBelow`
	  *
	  *     assert.isBelow(3, 6, '3 is strictly less than 6');
	  *
	  * @name isBelow
	  * @param {Mixed} valueToCheck
	  * @param {Mixed} valueToBeBelow
	  * @param {String} message
	  * @api public
	  */

	  assert.isBelow = function (val, blw, msg) {
	    new Assertion(val, msg).to.be.below(blw);
	  };

	  /**
	  * ### .isAtMost(valueToCheck, valueToBeAtMost, [message])
	  *
	  * Asserts `valueToCheck` is less than or equal to (<=) `valueToBeAtMost`
	  *
	  *     assert.isAtMost(3, 6, '3 is less than or equal to 6');
	  *     assert.isAtMost(4, 4, '4 is less than or equal to 4');
	  *
	  * @name isAtMost
	  * @param {Mixed} valueToCheck
	  * @param {Mixed} valueToBeAtMost
	  * @param {String} message
	  * @api public
	  */

	  assert.isAtMost = function (val, atmst, msg) {
	    new Assertion(val, msg).to.be.most(atmst);
	  };

	  /**
	   * ### .isTrue(value, [message])
	   *
	   * Asserts that `value` is true.
	   *
	   *     var teaServed = true;
	   *     assert.isTrue(teaServed, 'the tea has been served');
	   *
	   * @name isTrue
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isTrue = function (val, msg) {
	    new Assertion(val, msg).is['true'];
	  };

	  /**
	   * ### .isNotTrue(value, [message])
	   *
	   * Asserts that `value` is not true.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotTrue(tea, 'great, time for tea!');
	   *
	   * @name isNotTrue
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotTrue = function (val, msg) {
	    new Assertion(val, msg).to.not.equal(true);
	  };

	  /**
	   * ### .isFalse(value, [message])
	   *
	   * Asserts that `value` is false.
	   *
	   *     var teaServed = false;
	   *     assert.isFalse(teaServed, 'no tea yet? hmm...');
	   *
	   * @name isFalse
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isFalse = function (val, msg) {
	    new Assertion(val, msg).is['false'];
	  };

	  /**
	   * ### .isNotFalse(value, [message])
	   *
	   * Asserts that `value` is not false.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotFalse(tea, 'great, time for tea!');
	   *
	   * @name isNotFalse
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotFalse = function (val, msg) {
	    new Assertion(val, msg).to.not.equal(false);
	  };

	  /**
	   * ### .isNull(value, [message])
	   *
	   * Asserts that `value` is null.
	   *
	   *     assert.isNull(err, 'there was no error');
	   *
	   * @name isNull
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNull = function (val, msg) {
	    new Assertion(val, msg).to.equal(null);
	  };

	  /**
	   * ### .isNotNull(value, [message])
	   *
	   * Asserts that `value` is not null.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotNull(tea, 'great, time for tea!');
	   *
	   * @name isNotNull
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotNull = function (val, msg) {
	    new Assertion(val, msg).to.not.equal(null);
	  };

	  /**
	   * ### .isNaN
	   * Asserts that value is NaN
	   *
	   *    assert.isNaN('foo', 'foo is NaN');
	   *
	   * @name isNaN
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNaN = function (val, msg) {
	    new Assertion(val, msg).to.be.NaN;
	  };

	  /**
	   * ### .isNotNaN
	   * Asserts that value is not NaN
	   *
	   *    assert.isNotNaN(4, '4 is not NaN');
	   *
	   * @name isNotNaN
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */
	  assert.isNotNaN = function (val, msg) {
	    new Assertion(val, msg).not.to.be.NaN;
	  };

	  /**
	   * ### .isUndefined(value, [message])
	   *
	   * Asserts that `value` is `undefined`.
	   *
	   *     var tea;
	   *     assert.isUndefined(tea, 'no tea defined');
	   *
	   * @name isUndefined
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isUndefined = function (val, msg) {
	    new Assertion(val, msg).to.equal(undefined);
	  };

	  /**
	   * ### .isDefined(value, [message])
	   *
	   * Asserts that `value` is not `undefined`.
	   *
	   *     var tea = 'cup of chai';
	   *     assert.isDefined(tea, 'tea has been defined');
	   *
	   * @name isDefined
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isDefined = function (val, msg) {
	    new Assertion(val, msg).to.not.equal(undefined);
	  };

	  /**
	   * ### .isFunction(value, [message])
	   *
	   * Asserts that `value` is a function.
	   *
	   *     function serveTea() { return 'cup of tea'; };
	   *     assert.isFunction(serveTea, 'great, we can have tea now');
	   *
	   * @name isFunction
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isFunction = function (val, msg) {
	    new Assertion(val, msg).to.be.a('function');
	  };

	  /**
	   * ### .isNotFunction(value, [message])
	   *
	   * Asserts that `value` is _not_ a function.
	   *
	   *     var serveTea = [ 'heat', 'pour', 'sip' ];
	   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');
	   *
	   * @name isNotFunction
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotFunction = function (val, msg) {
	    new Assertion(val, msg).to.not.be.a('function');
	  };

	  /**
	   * ### .isObject(value, [message])
	   *
	   * Asserts that `value` is an object (as revealed by
	   * `Object.prototype.toString`).
	   *
	   *     var selection = { name: 'Chai', serve: 'with spices' };
	   *     assert.isObject(selection, 'tea selection is an object');
	   *
	   * @name isObject
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isObject = function (val, msg) {
	    new Assertion(val, msg).to.be.a('object');
	  };

	  /**
	   * ### .isNotObject(value, [message])
	   *
	   * Asserts that `value` is _not_ an object.
	   *
	   *     var selection = 'chai'
	   *     assert.isNotObject(selection, 'tea selection is not an object');
	   *     assert.isNotObject(null, 'null is not an object');
	   *
	   * @name isNotObject
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotObject = function (val, msg) {
	    new Assertion(val, msg).to.not.be.a('object');
	  };

	  /**
	   * ### .isArray(value, [message])
	   *
	   * Asserts that `value` is an array.
	   *
	   *     var menu = [ 'green', 'chai', 'oolong' ];
	   *     assert.isArray(menu, 'what kind of tea do we want?');
	   *
	   * @name isArray
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isArray = function (val, msg) {
	    new Assertion(val, msg).to.be.an('array');
	  };

	  /**
	   * ### .isNotArray(value, [message])
	   *
	   * Asserts that `value` is _not_ an array.
	   *
	   *     var menu = 'green|chai|oolong';
	   *     assert.isNotArray(menu, 'what kind of tea do we want?');
	   *
	   * @name isNotArray
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotArray = function (val, msg) {
	    new Assertion(val, msg).to.not.be.an('array');
	  };

	  /**
	   * ### .isString(value, [message])
	   *
	   * Asserts that `value` is a string.
	   *
	   *     var teaOrder = 'chai';
	   *     assert.isString(teaOrder, 'order placed');
	   *
	   * @name isString
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isString = function (val, msg) {
	    new Assertion(val, msg).to.be.a('string');
	  };

	  /**
	   * ### .isNotString(value, [message])
	   *
	   * Asserts that `value` is _not_ a string.
	   *
	   *     var teaOrder = 4;
	   *     assert.isNotString(teaOrder, 'order placed');
	   *
	   * @name isNotString
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotString = function (val, msg) {
	    new Assertion(val, msg).to.not.be.a('string');
	  };

	  /**
	   * ### .isNumber(value, [message])
	   *
	   * Asserts that `value` is a number.
	   *
	   *     var cups = 2;
	   *     assert.isNumber(cups, 'how many cups');
	   *
	   * @name isNumber
	   * @param {Number} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNumber = function (val, msg) {
	    new Assertion(val, msg).to.be.a('number');
	  };

	  /**
	   * ### .isNotNumber(value, [message])
	   *
	   * Asserts that `value` is _not_ a number.
	   *
	   *     var cups = '2 cups please';
	   *     assert.isNotNumber(cups, 'how many cups');
	   *
	   * @name isNotNumber
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotNumber = function (val, msg) {
	    new Assertion(val, msg).to.not.be.a('number');
	  };

	  /**
	   * ### .isBoolean(value, [message])
	   *
	   * Asserts that `value` is a boolean.
	   *
	   *     var teaReady = true
	   *       , teaServed = false;
	   *
	   *     assert.isBoolean(teaReady, 'is the tea ready');
	   *     assert.isBoolean(teaServed, 'has tea been served');
	   *
	   * @name isBoolean
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isBoolean = function (val, msg) {
	    new Assertion(val, msg).to.be.a('boolean');
	  };

	  /**
	   * ### .isNotBoolean(value, [message])
	   *
	   * Asserts that `value` is _not_ a boolean.
	   *
	   *     var teaReady = 'yep'
	   *       , teaServed = 'nope';
	   *
	   *     assert.isNotBoolean(teaReady, 'is the tea ready');
	   *     assert.isNotBoolean(teaServed, 'has tea been served');
	   *
	   * @name isNotBoolean
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.isNotBoolean = function (val, msg) {
	    new Assertion(val, msg).to.not.be.a('boolean');
	  };

	  /**
	   * ### .typeOf(value, name, [message])
	   *
	   * Asserts that `value`'s type is `name`, as determined by
	   * `Object.prototype.toString`.
	   *
	   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');
	   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');
	   *     assert.typeOf('tea', 'string', 'we have a string');
	   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');
	   *     assert.typeOf(null, 'null', 'we have a null');
	   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');
	   *
	   * @name typeOf
	   * @param {Mixed} value
	   * @param {String} name
	   * @param {String} message
	   * @api public
	   */

	  assert.typeOf = function (val, type, msg) {
	    new Assertion(val, msg).to.be.a(type);
	  };

	  /**
	   * ### .notTypeOf(value, name, [message])
	   *
	   * Asserts that `value`'s type is _not_ `name`, as determined by
	   * `Object.prototype.toString`.
	   *
	   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');
	   *
	   * @name notTypeOf
	   * @param {Mixed} value
	   * @param {String} typeof name
	   * @param {String} message
	   * @api public
	   */

	  assert.notTypeOf = function (val, type, msg) {
	    new Assertion(val, msg).to.not.be.a(type);
	  };

	  /**
	   * ### .instanceOf(object, constructor, [message])
	   *
	   * Asserts that `value` is an instance of `constructor`.
	   *
	   *     var Tea = function (name) { this.name = name; }
	   *       , chai = new Tea('chai');
	   *
	   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');
	   *
	   * @name instanceOf
	   * @param {Object} object
	   * @param {Constructor} constructor
	   * @param {String} message
	   * @api public
	   */

	  assert.instanceOf = function (val, type, msg) {
	    new Assertion(val, msg).to.be.instanceOf(type);
	  };

	  /**
	   * ### .notInstanceOf(object, constructor, [message])
	   *
	   * Asserts `value` is not an instance of `constructor`.
	   *
	   *     var Tea = function (name) { this.name = name; }
	   *       , chai = new String('chai');
	   *
	   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');
	   *
	   * @name notInstanceOf
	   * @param {Object} object
	   * @param {Constructor} constructor
	   * @param {String} message
	   * @api public
	   */

	  assert.notInstanceOf = function (val, type, msg) {
	    new Assertion(val, msg).to.not.be.instanceOf(type);
	  };

	  /**
	   * ### .include(haystack, needle, [message])
	   *
	   * Asserts that `haystack` includes `needle`. Works
	   * for strings and arrays.
	   *
	   *     assert.include('foobar', 'bar', 'foobar contains string "bar"');
	   *     assert.include([ 1, 2, 3 ], 3, 'array contains value');
	   *
	   * @name include
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @api public
	   */

	  assert.include = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.include).include(inc);
	  };

	  /**
	   * ### .notInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` does not include `needle`. Works
	   * for strings and arrays.
	   *
	   *     assert.notInclude('foobar', 'baz', 'string not include substring');
	   *     assert.notInclude([ 1, 2, 3 ], 4, 'array not include contain value');
	   *
	   * @name notInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @api public
	   */

	  assert.notInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notInclude).not.include(inc);
	  };

	  /**
	   * ### .match(value, regexp, [message])
	   *
	   * Asserts that `value` matches the regular expression `regexp`.
	   *
	   *     assert.match('foobar', /^foo/, 'regexp matches');
	   *
	   * @name match
	   * @param {Mixed} value
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @api public
	   */

	  assert.match = function (exp, re, msg) {
	    new Assertion(exp, msg).to.match(re);
	  };

	  /**
	   * ### .notMatch(value, regexp, [message])
	   *
	   * Asserts that `value` does not match the regular expression `regexp`.
	   *
	   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');
	   *
	   * @name notMatch
	   * @param {Mixed} value
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @api public
	   */

	  assert.notMatch = function (exp, re, msg) {
	    new Assertion(exp, msg).to.not.match(re);
	  };

	  /**
	   * ### .property(object, property, [message])
	   *
	   * Asserts that `object` has a property named by `property`.
	   *
	   *     assert.property({ tea: { green: 'matcha' }}, 'tea');
	   *
	   * @name property
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.property = function (obj, prop, msg) {
	    new Assertion(obj, msg).to.have.property(prop);
	  };

	  /**
	   * ### .notProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property`.
	   *
	   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');
	   *
	   * @name notProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.notProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg).to.not.have.property(prop);
	  };

	  /**
	   * ### .deepProperty(object, property, [message])
	   *
	   * Asserts that `object` has a property named by `property`, which can be a
	   * string using dot- and bracket-notation for deep reference.
	   *
	   *     assert.deepProperty({ tea: { green: 'matcha' }}, 'tea.green');
	   *
	   * @name deepProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.deepProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg).to.have.deep.property(prop);
	  };

	  /**
	   * ### .notDeepProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property`, which
	   * can be a string using dot- and bracket-notation for deep reference.
	   *
	   *     assert.notDeepProperty({ tea: { green: 'matcha' }}, 'tea.oolong');
	   *
	   * @name notDeepProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.notDeepProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg).to.not.have.deep.property(prop);
	  };

	  /**
	   * ### .propertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property` with value given
	   * by `value`.
	   *
	   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');
	   *
	   * @name propertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.propertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg).to.have.property(prop, val);
	  };

	  /**
	   * ### .propertyNotVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property`, but with a value
	   * different from that given by `value`.
	   *
	   *     assert.propertyNotVal({ tea: 'is good' }, 'tea', 'is bad');
	   *
	   * @name propertyNotVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.propertyNotVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg).to.not.have.property(prop, val);
	  };

	  /**
	   * ### .deepPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property` with value given
	   * by `value`. `property` can use dot- and bracket-notation for deep
	   * reference.
	   *
	   *     assert.deepPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');
	   *
	   * @name deepPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.deepPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg).to.have.deep.property(prop, val);
	  };

	  /**
	   * ### .deepPropertyNotVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property`, but with a value
	   * different from that given by `value`. `property` can use dot- and
	   * bracket-notation for deep reference.
	   *
	   *     assert.deepPropertyNotVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');
	   *
	   * @name deepPropertyNotVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.deepPropertyNotVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg).to.not.have.deep.property(prop, val);
	  };

	  /**
	   * ### .lengthOf(object, length, [message])
	   *
	   * Asserts that `object` has a `length` property with the expected value.
	   *
	   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');
	   *     assert.lengthOf('foobar', 5, 'string has length of 6');
	   *
	   * @name lengthOf
	   * @param {Mixed} object
	   * @param {Number} length
	   * @param {String} message
	   * @api public
	   */

	  assert.lengthOf = function (exp, len, msg) {
	    new Assertion(exp, msg).to.have.length(len);
	  };

	  /**
	   * ### .throws(function, [constructor/string/regexp], [string/regexp], [message])
	   *
	   * Asserts that `function` will throw an error that is an instance of
	   * `constructor`, or alternately that it will throw an error with message
	   * matching `regexp`.
	   *
	   *     assert.throws(fn, 'function throws a reference error');
	   *     assert.throws(fn, /function throws a reference error/);
	   *     assert.throws(fn, ReferenceError);
	   *     assert.throws(fn, ReferenceError, 'function throws a reference error');
	   *     assert.throws(fn, ReferenceError, /function throws a reference error/);
	   *
	   * @name throws
	   * @alias throw
	   * @alias Throw
	   * @param {Function} function
	   * @param {ErrorConstructor} constructor
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @api public
	   */

	  assert.throws = function (fn, errt, errs, msg) {
	    if ('string' === typeof errt || errt instanceof RegExp) {
	      errs = errt;
	      errt = null;
	    }

	    var assertErr = new Assertion(fn, msg).to['throw'](errt, errs);
	    return flag(assertErr, 'object');
	  };

	  /**
	   * ### .doesNotThrow(function, [constructor/regexp], [message])
	   *
	   * Asserts that `function` will _not_ throw an error that is an instance of
	   * `constructor`, or alternately that it will not throw an error with message
	   * matching `regexp`.
	   *
	   *     assert.doesNotThrow(fn, Error, 'function does not throw');
	   *
	   * @name doesNotThrow
	   * @param {Function} function
	   * @param {ErrorConstructor} constructor
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @api public
	   */

	  assert.doesNotThrow = function (fn, type, msg) {
	    if ('string' === typeof type) {
	      msg = type;
	      type = null;
	    }

	    new Assertion(fn, msg).to.not.Throw(type);
	  };

	  /**
	   * ### .operator(val1, operator, val2, [message])
	   *
	   * Compares two values using `operator`.
	   *
	   *     assert.operator(1, '<', 2, 'everything is ok');
	   *     assert.operator(1, '>', 2, 'this will fail');
	   *
	   * @name operator
	   * @param {Mixed} val1
	   * @param {String} operator
	   * @param {Mixed} val2
	   * @param {String} message
	   * @api public
	   */

	  assert.operator = function (val, operator, val2, msg) {
	    var ok;
	    switch (operator) {
	      case '==':
	        ok = val == val2;
	        break;
	      case '===':
	        ok = val === val2;
	        break;
	      case '>':
	        ok = val > val2;
	        break;
	      case '>=':
	        ok = val >= val2;
	        break;
	      case '<':
	        ok = val < val2;
	        break;
	      case '<=':
	        ok = val <= val2;
	        break;
	      case '!=':
	        ok = val != val2;
	        break;
	      case '!==':
	        ok = val !== val2;
	        break;
	      default:
	        throw new Error('Invalid operator "' + operator + '"');
	    }
	    var test = new Assertion(ok, msg);
	    test.assert(true === flag(test, 'object'), 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2), 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2));
	  };

	  /**
	   * ### .closeTo(actual, expected, delta, [message])
	   *
	   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
	   *
	   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');
	   *
	   * @name closeTo
	   * @param {Number} actual
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} message
	   * @api public
	   */

	  assert.closeTo = function (act, exp, delta, msg) {
	    new Assertion(act, msg).to.be.closeTo(exp, delta);
	  };

	  /**
	   * ### .sameMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members.
	   * Order is not taken into account.
	   *
	   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
	   *
	   * @name sameMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @api public
	   */

	  assert.sameMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg).to.have.same.members(set2);
	  };

	  /**
	   * ### .sameDeepMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members - using a deep equality checking.
	   * Order is not taken into account.
	   *
	   *     assert.sameDeepMembers([ {b: 3}, {a: 2}, {c: 5} ], [ {c: 5}, {b: 3}, {a: 2} ], 'same deep members');
	   *
	   * @name sameDeepMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @api public
	   */

	  assert.sameDeepMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg).to.have.same.deep.members(set2);
	  };

	  /**
	   * ### .includeMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset`.
	   * Order is not taken into account.
	   *
	   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1 ], 'include members');
	   *
	   * @name includeMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @api public
	   */

	  assert.includeMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg).to.include.members(subset);
	  };

	  /**
	  * ### .changes(function, object, property)
	  *
	  * Asserts that a function changes the value of a property
	  *
	  *     var obj = { val: 10 };
	  *     var fn = function() { obj.val = 22 };
	  *     assert.changes(fn, obj, 'val');
	  *
	  * @name changes
	  * @param {Function} modifier function
	  * @param {Object} object
	  * @param {String} property name
	  * @param {String} message _optional_
	  * @api public
	  */

	  assert.changes = function (fn, obj, prop) {
	    new Assertion(fn).to.change(obj, prop);
	  };

	  /**
	  * ### .doesNotChange(function, object, property)
	  *
	  * Asserts that a function does not changes the value of a property
	  *
	  *     var obj = { val: 10 };
	  *     var fn = function() { console.log('foo'); };
	  *     assert.doesNotChange(fn, obj, 'val');
	  *
	  * @name doesNotChange
	  * @param {Function} modifier function
	  * @param {Object} object
	  * @param {String} property name
	  * @param {String} message _optional_
	  * @api public
	  */

	  assert.doesNotChange = function (fn, obj, prop) {
	    new Assertion(fn).to.not.change(obj, prop);
	  };

	  /**
	  * ### .increases(function, object, property)
	  *
	  * Asserts that a function increases an object property
	  *
	  *     var obj = { val: 10 };
	  *     var fn = function() { obj.val = 13 };
	  *     assert.increases(fn, obj, 'val');
	  *
	  * @name increases
	  * @param {Function} modifier function
	  * @param {Object} object
	  * @param {String} property name
	  * @param {String} message _optional_
	  * @api public
	  */

	  assert.increases = function (fn, obj, prop) {
	    new Assertion(fn).to.increase(obj, prop);
	  };

	  /**
	  * ### .doesNotIncrease(function, object, property)
	  *
	  * Asserts that a function does not increase object property
	  *
	  *     var obj = { val: 10 };
	  *     var fn = function() { obj.val = 8 };
	  *     assert.doesNotIncrease(fn, obj, 'val');
	  *
	  * @name doesNotIncrease
	  * @param {Function} modifier function
	  * @param {Object} object
	  * @param {String} property name
	  * @param {String} message _optional_
	  * @api public
	  */

	  assert.doesNotIncrease = function (fn, obj, prop) {
	    new Assertion(fn).to.not.increase(obj, prop);
	  };

	  /**
	  * ### .decreases(function, object, property)
	  *
	  * Asserts that a function decreases an object property
	  *
	  *     var obj = { val: 10 };
	  *     var fn = function() { obj.val = 5 };
	  *     assert.decreases(fn, obj, 'val');
	  *
	  * @name decreases
	  * @param {Function} modifier function
	  * @param {Object} object
	  * @param {String} property name
	  * @param {String} message _optional_
	  * @api public
	  */

	  assert.decreases = function (fn, obj, prop) {
	    new Assertion(fn).to.decrease(obj, prop);
	  };

	  /**
	  * ### .doesNotDecrease(function, object, property)
	  *
	  * Asserts that a function does not decreases an object property
	  *
	  *     var obj = { val: 10 };
	  *     var fn = function() { obj.val = 15 };
	  *     assert.doesNotDecrease(fn, obj, 'val');
	  *
	  * @name doesNotDecrease
	  * @param {Function} modifier function
	  * @param {Object} object
	  * @param {String} property name
	  * @param {String} message _optional_
	  * @api public
	  */

	  assert.doesNotDecrease = function (fn, obj, prop) {
	    new Assertion(fn).to.not.decrease(obj, prop);
	  };

	  /*!
	   * ### .ifError(object)
	   *
	   * Asserts if value is not a false value, and throws if it is a true value.
	   * This is added to allow for chai to be a drop-in replacement for Node's
	   * assert class.
	   *
	   *     var err = new Error('I am a custom error');
	   *     assert.ifError(err); // Rethrows err!
	   *
	   * @name ifError
	   * @param {Object} object
	   * @api public
	   */

	  assert.ifError = function (val) {
	    if (val) {
	      throw val;
	    }
	  };

	  /**
	   * ### .isExtensible(object)
	   *
	   * Asserts that `object` is extensible (can have new properties added to it).
	   *
	   *     assert.isExtensible({});
	   *
	   * @name isExtensible
	   * @alias extensible
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @api public
	   */

	  assert.isExtensible = function (obj, msg) {
	    new Assertion(obj, msg).to.be.extensible;
	  };

	  /**
	   * ### .isNotExtensible(object)
	   *
	   * Asserts that `object` is _not_ extensible.
	   *
	   *     var nonExtensibleObject = Object.preventExtensions({});
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.freese({});
	   *
	   *     assert.isNotExtensible(nonExtensibleObject);
	   *     assert.isNotExtensible(sealedObject);
	   *     assert.isNotExtensible(frozenObject);
	   *
	   * @name isNotExtensible
	   * @alias notExtensible
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @api public
	   */

	  assert.isNotExtensible = function (obj, msg) {
	    new Assertion(obj, msg).to.not.be.extensible;
	  };

	  /**
	   * ### .isSealed(object)
	   *
	   * Asserts that `object` is sealed (cannot have new properties added to it
	   * and its existing properties cannot be removed).
	   *
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.seal({});
	   *
	   *     assert.isSealed(sealedObject);
	   *     assert.isSealed(frozenObject);
	   *
	   * @name isSealed
	   * @alias sealed
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @api public
	   */

	  assert.isSealed = function (obj, msg) {
	    new Assertion(obj, msg).to.be.sealed;
	  };

	  /**
	   * ### .isNotSealed(object)
	   *
	   * Asserts that `object` is _not_ sealed.
	   *
	   *     assert.isNotSealed({});
	   *
	   * @name isNotSealed
	   * @alias notSealed
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @api public
	   */

	  assert.isNotSealed = function (obj, msg) {
	    new Assertion(obj, msg).to.not.be.sealed;
	  };

	  /**
	   * ### .isFrozen(object)
	   *
	   * Asserts that `object` is frozen (cannot have new properties added to it
	   * and its existing properties cannot be modified).
	   *
	   *     var frozenObject = Object.freeze({});
	   *     assert.frozen(frozenObject);
	   *
	   * @name isFrozen
	   * @alias frozen
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @api public
	   */

	  assert.isFrozen = function (obj, msg) {
	    new Assertion(obj, msg).to.be.frozen;
	  };

	  /**
	   * ### .isNotFrozen(object)
	   *
	   * Asserts that `object` is _not_ frozen.
	   *
	   *     assert.isNotFrozen({});
	   *
	   * @name isNotFrozen
	   * @alias notFrozen
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @api public
	   */

	  assert.isNotFrozen = function (obj, msg) {
	    new Assertion(obj, msg).to.not.be.frozen;
	  };

	  /*!
	   * Aliases.
	   */

	  (function alias(name, as) {
	    assert[as] = assert[name];
	    return alias;
	  })('isOk', 'ok')('isNotOk', 'notOk')('throws', 'throw')('throws', 'Throw')('isExtensible', 'extensible')('isNotExtensible', 'notExtensible')('isSealed', 'sealed')('isNotSealed', 'notSealed')('isFrozen', 'frozen')('isNotFrozen', 'notFrozen');
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var chai = __webpack_require__(23);
	var assert = chai.assert;
	var Tile = __webpack_require__(1);
	var Board = __webpack_require__(2);

	describe('Board', function () {
	  it('randomly generates all tiles for an 8x8 board', function () {
	    var board = new Board(null, null, 8, 8, 70, 70);
	    board.generate();

	    assert.equal(board.tiles.length, 64);
	    assert.isNumber(board.tiles[0].type);
	    assert.isNumber(board.tiles[0].column);
	    assert.isNumber(board.tiles[0].row);
	  });

	  it('can retrieve a specific tile', function () {
	    var board = new Board(null, null, 8, 8, 70, 70);
	    board.generate();
	    var tile1 = board.getTile(0, 0);
	    var tile2 = board.getTile(7, 7);
	    var types = [1, 2, 3, 4, 5, 6, 7];

	    assert.instanceOf(tile1, Tile);
	    assert.include(types, tile1.type);
	    assert.instanceOf(tile2, Tile);
	    assert.include(types, tile2.type);
	  });

	  it.skip('can swap two horizontally adjacent tiles', function () {
	    var board = new Board(null, null, 8, 8, 70, 70);
	    var tile1 = new Tile(1, 0, 0);
	    var tile2 = new Tile(2, 1, 0);
	    board.tiles.push(tile1);
	    board.tiles.push(tile2);
	    board.swapTiles(tile1, tile2);
	    var newTile1 = board.getTile(0, 0);
	    var newTile2 = board.getTile(1, 0);

	    assert.equal(newTile1.type, 2);
	    assert.equal(newTile1.column, 0);
	    assert.equal(newTile1.row, 0);
	    assert.equal(newTile2.type, 1);
	    assert.equal(newTile2.column, 1);
	    assert.equal(newTile2.row, 0);
	  });

	  it.skip('can swap two vertically adjacent tiles', function () {
	    var board = new Board(null, null, 8, 8, 70, 70);
	    var tile1 = new Tile(1, 0, 0);
	    var tile2 = new Tile(2, 0, 1);
	    board.tiles.push(tile1);
	    board.tiles.push(tile2);
	    board.swapTiles(tile1, tile2);
	    var newTile1 = board.getTile(0, 0);
	    var newTile2 = board.getTile(0, 1);

	    assert.equal(newTile1.type, 2);
	    assert.equal(newTile1.column, 0);
	    assert.equal(newTile1.row, 0);
	    assert.equal(newTile2.type, 1);
	    assert.equal(newTile2.column, 0);
	    assert.equal(newTile2.row, 1);
	  });

	  it('cannot swap two diagonally adjacent tiles', function () {
	    var board = new Board(null, null, 8, 8, 70, 70);
	    var tile1 = new Tile(1, 0, 0);
	    var tile2 = new Tile(2, 1, 1);
	    board.tiles.push(tile1);
	    board.tiles.push(tile2);
	    board.swapTiles(tile1, tile2);
	    var newTile1 = board.getTile(0, 0);
	    var newTile2 = board.getTile(1, 1);

	    assert.equal(newTile1.type, 1);
	    assert.equal(newTile1.column, 0);
	    assert.equal(newTile1.row, 0);
	    assert.equal(newTile2.type, 2);
	    assert.equal(newTile2.column, 1);
	    assert.equal(newTile2.row, 1);
	  });

	  it('can swap tiles if a 3 match is made', function () {
	    var board = new Board(null, null, 8, 8, 70, 70);
	    var tile1 = new Tile(1, 0, 0);
	    var tile2 = new Tile(2, 1, 0);
	    var tile3 = new Tile(1, 0, 1);
	    var tile4 = new Tile(2, 1, 1);
	    var tile5 = new Tile(2, 0, 2);
	    var tile6 = new Tile(1, 1, 2);
	    board.tiles.push(tile1);
	    board.tiles.push(tile2);
	    board.tiles.push(tile3);
	    board.tiles.push(tile4);
	    board.tiles.push(tile5);
	    board.tiles.push(tile6);

	    // Valid swap
	    board.swapTiles(tile5, tile6);
	    var newTile5 = board.getTile(0, 2);
	    var newTile6 = board.getTile(1, 2);

	    assert.equal(newTile5.type, 1);
	    assert.equal(newTile5.column, 0);
	    assert.equal(newTile5.row, 2);
	    assert.equal(newTile6.type, 2);
	    assert.equal(newTile6.column, 1);
	    assert.equal(newTile6.row, 2);
	  });

	  it('cannot swap tiles unless a 3 match is made', function () {
	    var board = new Board(null, null, 8, 8, 70, 70);
	    var tile1 = new Tile(1, 0, 0);
	    var tile2 = new Tile(2, 1, 0);
	    var tile3 = new Tile(1, 0, 1);
	    var tile4 = new Tile(2, 1, 1);
	    var tile5 = new Tile(2, 0, 2);
	    var tile6 = new Tile(1, 1, 2);
	    board.tiles.push(tile1);
	    board.tiles.push(tile2);
	    board.tiles.push(tile3);
	    board.tiles.push(tile4);
	    board.tiles.push(tile5);
	    board.tiles.push(tile6);

	    // Invalid swap
	    board.swapTiles(tile1, tile2);
	    var newTile1 = board.getTile(0, 0);
	    var newTile2 = board.getTile(1, 0);

	    assert.equal(newTile1.type, 1);
	    assert.equal(newTile1.column, 0);
	    assert.equal(newTile1.row, 0);
	    assert.equal(newTile2.type, 2);
	    assert.equal(newTile2.column, 1);
	    assert.equal(newTile2.row, 0);

	    // Invalid swap
	    board.swapTiles(tile2, tile1);
	    var newTile1 = board.getTile(0, 0);
	    var newTile2 = board.getTile(1, 0);

	    assert.equal(newTile1.type, 1);
	    assert.equal(newTile1.column, 0);
	    assert.equal(newTile1.row, 0);
	    assert.equal(newTile2.type, 2);
	    assert.equal(newTile2.column, 1);
	    assert.equal(newTile2.row, 0);

	    // Invalid swap
	    board.swapTiles(tile3, tile4);
	    var newTile3 = board.getTile(0, 1);
	    var newTile4 = board.getTile(1, 1);

	    assert.equal(newTile3.type, 1);
	    assert.equal(newTile3.column, 0);
	    assert.equal(newTile3.row, 1);
	    assert.equal(newTile4.type, 2);
	    assert.equal(newTile4.column, 1);
	    assert.equal(newTile4.row, 1);

	    // Invalid swap
	    board.swapTiles(tile4, tile3);
	    var newTile3 = board.getTile(0, 1);
	    var newTile4 = board.getTile(1, 1);

	    assert.equal(newTile3.type, 1);
	    assert.equal(newTile3.column, 0);
	    assert.equal(newTile3.row, 1);
	    assert.equal(newTile4.type, 2);
	    assert.equal(newTile4.column, 1);
	    assert.equal(newTile4.row, 1);
	  });

	  it('can clear 3 horizontally matching tiles', function () {
	    var board = new Board();
	    board.tiles.push(new Tile(1, 0, 7));
	    board.tiles.push(new Tile(1, 1, 7));
	    board.tiles.push(new Tile(1, 2, 7));
	    board.tiles.push(new Tile(2, 3, 7));
	    board.getAllMatches();
	    // [{tile1, tile2, tile3}, {tile1, tile2, tile3, tile4}]

	    assert.equal(board.getTile(0, 7).type, 0);
	    assert.equal(board.getTile(1, 7).type, 0);
	    assert.equal(board.getTile(2, 7).type, 0);
	    assert.equal(board.getTile(3, 7).type, 2);
	  });

	  it.skip('can clear 3 vertically matching tiles', function () {
	    var board = new Board();
	    board.push(new Tile(2, 0, 4));
	    board.push(new Tile(1, 0, 5));
	    board.push(new Tile(1, 0, 6));
	    board.push(new Tile(1, 0, 7));
	    board.clearMatches();

	    assert.equal(board.tileAt(0, 4).type, 2);
	    assert.equal(board.tileAt(0, 5).type, 0);
	    assert.equal(board.tileAt(0, 6).type, 0);
	    assert.equal(board.tileAt(0, 7).type, 0);
	  });

	  it.skip('can retrieve 3 horizontally matching tiles', function () {
	    var board = new Board();
	    tile1 = new Tile(1, 0, 7);
	    tile2 = new Tile(1, 1, 7);
	    tile3 = new Tile(1, 2, 7);
	    board.push(tile1);
	    board.push(tile2);
	    board.push(tile3);
	    var matches = board.getMatchesFor();

	    assert.equal(matches, [[tile1, tile2, tile3]]);
	  });

	  it.skip('can retrieve 3 vertically matching tiles', function () {
	    var board = new Board();
	    tile1 = new Tile(1, 0, 5);
	    tile2 = new Tile(1, 0, 6);
	    tile3 = new Tile(1, 0, 7);
	    board.push(tile1);
	    board.push(tile2);
	    board.push(tile3);
	    var matches = board.getMatchesFor();

	    assert.equal(matches, [[tile1, tile2, tile3]]);
	  });
	});

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var chai = __webpack_require__(23);
	var assert = chai.assert;

	describe.skip('Game', function () {
	  it('can score a match', function () {
	    var board = new Board();
	    board.push(new Tile(1, 0, 7));
	    board.push(new Tile(1, 1, 7));
	    board.push(new Tile(1, 2, 7));
	    var matches = board.getMatches();
	    var game = new Game();
	    game.addMatchScores(matches);

	    assert.equal(game.score, 50);
	  });
	});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {process.nextTick(function() {
		delete __webpack_require__.c[module.id];
		if(typeof window !== "undefined" && window.mochaPhantomJS)
			mochaPhantomJS.run();
		else
			mocha.run();
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(65)))

/***/ },
/* 65 */
/***/ function(module, exports) {

	// shim for using process in browser

	'use strict';

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ }
/******/ ]);