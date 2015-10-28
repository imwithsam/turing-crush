const Tile = require('./tile');
const Board = require('./board');
const _ = require('lodash');

// Generate 8x8 board with 70x70px tiles
var canvas = document.getElementById('board');
var context = canvas.getContext('2d');
var board = new Board(canvas, context, 8, 8, 70, 70);

board.generate();
board.render();

canvas.addEventListener('mousedown', logCoordinates, false);

function logCoordinates(e) {
  var column = Math.ceil(e.offsetX / board.tileWidth) - 1;
  var row = Math.ceil(e.offsetY / board.tileHeight) - 1;

  if (column >= 0 && column < board.columnCount
      && row >= 0 && row < board.rowCount) {
    var tile = board.getTile(column, row);

    if (board.selectedTile) {
      if (board.areAdjacentTiles(board.selectedTile, tile)) {
        board.swapTiles(board.selectedTile, tile);
        board.render();
        board.selectedTile = null;
      } else {
        board.selectedTile.deselect(board);
        board.selectedTile = null;
      }
    } else {
      tile.select(board);
    }
  }

  console.log(e);
  console.log('x: ' + e.offsetX + ', y: ' + e.offsetY);
  console.log('col: ' + column + ', row: ' + row);
  board.getAllMatches();
}
