const Tile = require('./tile');

function Board(columnCount, rowCount, tileWidth, tileHeight) {
  this.columnCount = columnCount || 8;
  this.rowCount = rowCount || 8;
  this.tileWidth = tileWidth || 70;
  this.tileHeight = tileHeight || 70;
  this.width = this.tileWidth * this.columnCount;
  this.height = this.tileHeight * this.rowCount;
  this.tiles = [];
};

Board.prototype = {
  generateBoard: function() {
    // Add columns with tiles to board
    for (var column=0; column < this.columnCount; column++) {
      for (var row=0; row < this.rowCount; row++) {
        // Generate random tile type (1-7)
        // Zero is reserved for an empty tile
        var type = Math.floor((Math.random() * 7) + 1);
        var tile = new Tile(type, column, row)

        this.tiles.push(tile);
      }
    }
  }
};

module.exports = Board;
