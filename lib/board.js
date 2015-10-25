const Tile = require('./tile');

function Board(canvas, context, columnCount, rowCount, tileWidth, tileHeight) {
  this.canvas = canvas;
  this.context = context;
  this.columnCount = columnCount || 8;
  this.rowCount = rowCount || 8;
  this.tileWidth = tileWidth || 70;
  this.tileHeight = tileHeight || 70;
  this.width = this.tileWidth * this.columnCount;
  this.height = this.tileHeight * this.rowCount;
  this.tiles = [];
};

Board.prototype = {
  generate: function() {
    for (var column=0; column < this.columnCount; column++) {
      for (var row=0; row < this.rowCount; row++) {
        // Generate random tile type (1-7)
        // Zero is reserved for an empty tile
        var type = Math.floor((Math.random() * 7) + 1);
        var tile = new Tile(type, column, row)

        this.tiles.push(tile);
      }
    }

    return this;
  },
  render: function() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.tiles.forEach(function(tile) {
      var x = tile.column * this.tileWidth;
      var y = tile.row * this.tileHeight;

      this.context.strokeRect(x, y, this.tileWidth, this.tileHeight);
      this.context.fillText(
          tile.type,
          (x + this.tileWidth/2),
          (y + this.tileHeight/2)
      );
    }, this);

    return this;
  }
};

module.exports = Board;
