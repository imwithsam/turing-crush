const chai = require('chai');
const assert = chai.assert;
const Board = require('../lib/board');

describe('Board', function () {
  it.only('randomly generates all tiles for an 8x8 board', function () {
    var board = new Board(8, 8, 70, 70);
    board.generateBoard();

    assert.equal(board.tiles.length, 64);
    assert.equal(typeof board.tiles[0].type, 'number');
    assert.equal(typeof board.tiles[0].column, 'number');
    assert.equal(typeof board.tiles[0].row, 'number');
  });

  it('can clear 3 horizontally matching tiles', function () {
    var board = new Board;
    board.push(new Tile(1, 0, 7));
    board.push(new Tile(1, 1, 7));
    board.push(new Tile(1, 2, 7));
    board.push(new Tile(2, 3, 7));
    board.clearMatches();

    assert.equal(board.tileAt(0, 7).type, 0);
    assert.equal(board.tileAt(1, 7).type, 0);
    assert.equal(board.tileAt(2, 7).type, 0);
    assert.equal(board.tileAt(3, 7).type, 2);
  });

  it('can clear 3 vertically matching tiles', function () {
    var board = new Board;
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

  it('can retrieve 3 horizontally matching tiles', function () {
    var board = new Board;
    tile1 = new Tile(1, 0, 7);
    tile2 = new Tile(1, 1, 7);
    tile3 = new Tile(1, 2, 7);
    board.push(tile1);
    board.push(tile2);
    board.push(tile3);
    var matches = board.getMatches();

    assert.equal(matches, [[ tile1, tile2, tile3 ]]);
  });

  it('can retrieve 3 vertically matching tiles', function () {
    var board = new Board;
    tile1 = new Tile(1, 0, 5);
    tile2 = new Tile(1, 0, 6);
    tile3 = new Tile(1, 0, 7);
    board.push(tile1);
    board.push(tile2);
    board.push(tile3);
    var matches = board.getMatches();

    assert.equal(matches, [[ tile1, tile2, tile3 ]]);
  });
});
