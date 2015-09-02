var assert = require('assert');
var Immutable = require('immutable');
var actions = require('./actions');

var validate = actions.fn.findWinner;

describe('board', function () {
  it('should find winner of board', function () {
    var board = createBoard([
      ['x', 'o', 'x'],
      ['o', 'x', ''],
      ['o', 'x', '']
    ]);
    assert.ok(validate(board) === false);

    var board = createBoard([
      ['x', 'o', 'x'],
      ['o', 'x', 'o'],
      ['o', 'x', 'o']
    ]);
    assert.ok(validate(board) === 'No one');

    board = createBoard([
      ['x', 'x', 'x'],
      ['x', 'o', 'o'],
      ['o', 'x', 'o']
    ]);
    assert.ok(validate(board) === 'x');

    board = createBoard([
      ['x', 'o', 'x'],
      ['x', 'o', 'x'],
      ['o', 'o', 'x']
    ]);
    assert.ok(validate(board) === 'o');

    board = createBoard([
      ['x', 'o', 'x'],
      ['x', 'o', 'x'],
      ['o', 'o', 'o']
    ]);
    assert.ok(validate(board) === 'o');

    board = createBoard([
      ['o', 'x', 'x'],
      ['x', 'o', 'x'],
      ['x', 'o', 'o']
    ]);
    assert.ok(validate(board) === 'o');

    board = createBoard([
      ['o', 'x', 'x'],
      ['x', 'x', 'x'],
      ['x', 'o', 'o']
    ]);
    assert.ok(validate(board) === 'x');

    board = createBoard([
      ['o', 'x', 'x'],
      ['x', 'x', 'o'],
      ['x', 'o', 'o']
    ]);
    assert.ok(validate(board) === 'x');
  });

  function createBoard (arr) {
    return Immutable.fromJS(arr);
  }
});
