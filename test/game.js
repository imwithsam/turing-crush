const chai = require('chai');
const assert = chai.assert;

describe.skip('Game', function () {
  it('can score a match', function() {
    var board = new Board;
    board.push(new Tile(1, 0, 7));
    board.push(new Tile(1, 1, 7));
    board.push(new Tile(1, 2, 7));
    var matches = board.getMatches();
    var game = new Game;
    game.addMatchScores(matches);

    assert.equal(game.score, 50);
  });
});
