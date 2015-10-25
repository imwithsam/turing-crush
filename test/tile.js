const chai = require('chai');
const assert = chai.assert;

describe('Tile', function () {
  it('can move up', function() {
    tile = new Tile(1, 0, 7);
    tile.move('up');

    assert.equal(tile.column, 0);
    assert.equal(tile.row, 6);
  });

  it('can move right', function() {
    tile = new Tile(1, 0, 0);
    tile.move('right');

    assert.equal(tile.column, 1);
    assert.equal(tile.row, 0);
  });

  it('can move down', function() {
    tile = new Tile(1, 0, 0);
    tile.move('down');

    assert.equal(tile.column, 0);
    assert.equal(tile.row, 1);
  });

  it('can move left', function() {
    tile = new Tile(1, 1, 0);
    tile.move('left');

    assert.equal(tile.column, 0);
    assert.equal(tile.row, 0);
  });
});
