function Tile(type, column, row) {
  this.type = type || 0;
  this.column = column;
  this.row = row;
};

Tile.prototype = {
  // TODO: May not need Tile.move()
  move: function(direction) {
    switch (direction) {
      case 'up':
        this.row--;
        break;
      case 'down':
        this.row++;
        break;
      case 'right':
        this.column++;
        break;
      case 'left':
        this.column--;
        break;
    }

    return this;
  },
  isAdjacentTo: function(tile) {
    if (this.column === tile.column) {
      if (this.row === tile.row + 1 || this.row === tile.row - 1) {
        return true;
      } else {
        return false;
      }
    } else if (this.row === tile.row) {
      if (this.column === tile.column + 1 || this.column === tile.column - 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  swapWith: function(tile) {
    if (this.isAdjacentTo(tile)) {
      var tempType = this.type;

      this.type = tile.type;
      tile.type = tempType;
    }

    return this;
  },
  select: function(board) {
    var x = this.column * board.tileWidth;
    var y = this.row * board.tileHeight;

    board.context.strokeStyle='turquoise';
    board.context.lineWidth=4;
    board.context.strokeRect(x, y, board.tileWidth, board.tileHeight);
    board.selectedTile = this;

    return this;
  },
  deselect: function(board) {
    var x = this.column * board.tileWidth;
    var y = this.row * board.tileHeight;

    board.context.strokeStyle='black';
    board.context.lineWidth=4;
    board.context.strokeRect(x, y, board.tileWidth, board.tileHeight);
    board.selectedTile = null;

    return this;
  }
};

module.exports = Tile;
