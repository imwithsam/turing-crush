const chai = require('chai');
const assert = chai.assert;
const Tile = require('../lib/tile');
const Board = require('../lib/board');

describe('Board', function () {
  it('randomly generates all tiles for an 8x8 board', function() {
    var board = new Board(null, null, 8, 8, 70, 70);
    board.generate();

    assert.equal(board.tiles.length, 64);
    assert.isNumber(board.tiles[0].type);
    assert.isNumber(board.tiles[0].column);
    assert.isNumber(board.tiles[0].row);
  });

  it('can retrieve a specific tile', function() {
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

  it.skip('can swap two horizontally adjacent tiles', function() {
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

  it.skip('can swap two vertically adjacent tiles', function() {
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

  it('cannot swap two diagonally adjacent tiles', function() {
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

  it('can swap tiles if a 3 match is made', function() {
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

  it('cannot swap tiles unless a 3 match is made', function() {
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

  it.skip('can clear 3 horizontally matching tiles', function () {
    var board = new Board();
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
    var matches = board.getMatches();

    assert.equal(matches, [[ tile1, tile2, tile3 ]]);
  });

  it.skip('can retrieve 3 vertically matching tiles', function () {
    var board = new Board();
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
