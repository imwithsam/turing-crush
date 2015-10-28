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
  this.selectedTile = null;
  this.tiles = [];
}

Board.prototype = {
  generate: function() {
    for (var column=0; column < this.columnCount; column++) {
      for (var row=0; row < this.rowCount; row++) {
        // Generate random tile type (1-7)
        // Zero is reserved for an empty tile
        var type = Math.floor((Math.random() * 7) + 1);
        var tile = new Tile(type, column, row);

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
  getMatchesFor: function(tile) {
    var aboveTile, belowTile, leftTile, rightTile;
    var match = false;
    var verticalMatches = [tile];
    var horizontalMatches = [tile];
    var i;

    i = 0;
    do {
      i++;
      aboveTile = this.getTile(tile.column, tile.row - i);
      match = aboveTile && (aboveTile.type === tile.type);

      if (match) {
        verticalMatches.push(aboveTile);
      }
    } while (match);

    i = 0;
    do {
      i++;
      belowTile = this.getTile(tile.column, tile.row + i);
      match = belowTile && (belowTile.type === tile.type);

      if (match) {
        verticalMatches.push(belowTile);
      }
    } while (match);

    i = 0;
    do {
      i++;
      leftTile = this.getTile(tile.column - i, tile.row);
      match = leftTile && (leftTile.type === tile.type);

      if (match) {
        horizontalMatches.push(leftTile);
      }
    } while (match);

    i = 0;
    do {
      i++;
      rightTile = this.getTile(tile.column + i, tile.row);
      match = rightTile && (rightTile.type === tile.type);

      if (match) {
        horizontalMatches.push(rightTile);
      }
    } while (match);

    var matches = {};
    if (verticalMatches.length >= 3) {
      matches.vertical = verticalMatches;
    }
    if (horizontalMatches.length >= 3) {
      matches.horizontal = horizontalMatches;
    }

    if (!matches.vertical && !matches.horizontal) {
      matches = null;
    }

    return matches;
  },
  getAllMatches: function() {
    // Group by tile type
    //   { 1: [tile, tile], 2: [tile, tile] }

    var tilesByColumn = _.groupBy(this.tiles, function(tile) {
      return tile.column;
    });
    var matches = [];
    var matchCount = 0;
    var verticalMatches = [];
    for (var column in tilesByColumn) {
      for (var i = 0; i < tilesByColumn[column].length; i++) {
        var tile = tilesByColumn[column][i];
        var nextTile = tilesByColumn[column][i + 1];

        if (nextTile && tile.type === nextTile.type) {
          matches.push(tile);
          matchCount++;
        } else {
          if (matchCount >= 2) {
            matches.push(tile);
            verticalMatches.push(matches);
          }

          matches = [];
          matchCount = 0;
        }
      }

      if (verticalMatches.length > 0) {
        // Clear and score matches
      }
    };

    console.log('verticalMatches', verticalMatches);

    var tilesByRow = _.groupBy(this.tiles, function(tile) {
      return tile.row;
    });
    matches = [];
    matchCount = 0;
    var horizontalMatches = [];
    for (var row in tilesByRow) {
      for (var i = 0; i < tilesByRow[row].length; i++) {
        var tile = tilesByRow[row][i];
        var nextTile = tilesByRow[row][i + 1];

        if (nextTile && tile.type === nextTile.type) {
          matches.push(tile);
          matchCount++;
        } else {
          if (matchCount >= 2) {
            matches.push(tile);
            horizontalMatches.push(matches);
          }

          matches = [];
          matchCount = 0;
        }
      }

      if (horizontalMatches.length > 0) {
        // Clear and score matches
      }
    };

    console.log('horizontalMatches', horizontalMatches);
  },
  areAdjacentTiles: function(tile1, tile2) {
    if (tile1.column === tile2.column) {
      if (tile1.row === tile2.row + 1 || tile1.row === tile2.row - 1) {
        return true;
      } else {
        return false;
      }
    } else if (tile1.row === tile2.row) {
      if (tile1.column === tile2.column + 1 || tile1.column === tile2.column - 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  swapTiles: function(tile1, tile2) {
    var tempType;

    if (this.areAdjacentTiles(tile1, tile2)) {
      tempType = tile1.type;
      tile1.type = tile2.type;
      tile2.type = tempType;

      // Undo swap if there are no matches
      if (!this.getMatchesFor(tile1) && !this.getMatchesFor(tile2)) {
        tempType = tile1.type;
        tile1.type = tile2.type;
        tile2.type = tempType;

        if (this.context) {
          tile1.deselect(this);
        }
      }
    }

    return this;
  }
};

module.exports = Board;
