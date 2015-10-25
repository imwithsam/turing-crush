const Tile = require('./tile');
const Board = require('./board');

// Generate 8x8 board with 70x70px tiles
var canvas = document.getElementById('board');
var context = canvas.getContext('2d');
var board = new Board(canvas, context, 8, 8, 70, 70);

board.generate();
board.render();
