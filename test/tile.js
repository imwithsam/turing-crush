const chai = require('chai');
const assert = chai.assert;
const Tile = require('../lib/tile');

describe('Tile', function () {
  it('can move up', function() {
    var tile = new Tile(1, 0, 7);
    tile.move('up');

    assert.equal(tile.column, 0);
    assert.equal(tile.row, 6);
  });

  it('can move right', function() {
    var tile = new Tile(1, 0, 0);
    tile.move('right');

    assert.equal(tile.column, 1);
    assert.equal(tile.row, 0);
  });

  it('can move down', function() {
    var tile = new Tile(1, 0, 0);
    tile.move('down');

    assert.equal(tile.column, 0);
    assert.equal(tile.row, 1);
  });

  it('can move left', function() {
    var tile = new Tile(1, 1, 0);
    tile.move('left');

    assert.equal(tile.column, 0);
    assert.equal(tile.row, 0);
  });
});
