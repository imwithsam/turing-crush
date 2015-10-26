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
  this.selectedTile;
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
      var img = new Image();
      img.src = require('../assets/' + tile.type + '.png');

      this.context.drawImage(img, x, y);
      this.context.strokeStyle='black';
      this.context.lineWidth=3;
      this.context.strokeRect(x, y, this.tileWidth, this.tileHeight);
    }, this);

    return this;
  },
  getTile: function(column, row) {
    var retrievedTile;

    this.tiles.forEach(function(tile) {
      tileMatch: if (tile.column === column && tile.row === row) {
        retrievedTile = tile;
        break tileMatch;
      }
    }, this);

    return retrievedTile;
  },
  selectTile: function(tile) {
    var x = tile.column * this.tileWidth;
    var y = tile.row * this.tileHeight;

    this.context.strokeStyle='turquoise';
    this.context.lineWidth=5;
    this.context.strokeRect(x, y, this.tileWidth, this.tileHeight);
    this.selectedTile = tile;

    return this;
  },
  deselectTile: function(column, row) {
    var x = column * this.tileWidth;
    var y = row * this.tileHeight;

    this.context.strokeStyle='black';
    this.context.lineWidth=3;
    this.context.strokeRect(x, y, this.tileWidth, this.tileHeight);

    return this;
  },
  swapTiles: function(tile1, tile2) {
    var tempType = tile1.type;

    tile1.type = tile2.type;
    tile2.type = tempType;

    return this;
  }
};

module.exports = Board;
