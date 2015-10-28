// TODO: Pass Board into Tile
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
  select: function(board) {
    // TODO: Move Board up to Tile object
    // TODO: Put select() & deselect() into a single draw()
    //       and give tile a status.
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
