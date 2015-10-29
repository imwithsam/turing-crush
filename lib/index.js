const Tile = require('./tile');
const Board = require('./board');
const $ = require('jquery');
const _ = require('lodash');

// Generate 8x8 board with 70x70px tiles
var canvas = document.getElementById('board');
var context = canvas.getContext('2d');
var board = new Board(canvas, context, 8, 8, 70, 70);

board.generate();
board.render();

canvas.addEventListener('mousedown', gameLoop, false);

function gameLoop(e) {
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
  var matches = board.getAllMatches();
  console.log('matches', matches);
  var score = getScore(matches);
  console.log('score', score);
  renderScore(score);
  var flattened_matches = _.chain(matches).flatten().uniq().value();
  if (flattened_matches.length > 0) {
    board.clearTiles(flattened_matches);
    board.render();
  }
  // board.clearTiles(_.chain(matches).flatten().uniq().value());
  // console.log('flattened matches', _.chain(matches).flatten().uniq().value());
  // board.render();
  // board.replaceTiles(flattened);
  // board.render();
}

function getScore(matchSets) {
  var score = 0;

  matchSets.forEach(function(matchSet) {
    switch (matchSet.length) {
      case 3:
        score += 50;
        break;
      case 4:
        score += 100;
        break;
      case 5:
        score += 500;
        break;
      default:
        score += 500;
    }
  })

  return score;
}

function renderScore(score) {
  document.getElementById('score').innerHTML = score;

  return score;
}
