function Tile(type, column, row) {
  this.type = type || 0;
  this.column = column;
  this.row = row;
};

Tile.prototype = {
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
  }
};

module.exports = Tile;
