'use strict';

var component = require('omniscient');
var React = require('react');
var {div, h1, p, a} = React.DOM;

var Cell = component(({disabled, cell, board, actions: {change}}) => a({
    className: 'cell',
    onClick: () => !disabled && change(cell, board)
  },
  cell.valueOf()
));

var Board = component(({disabled, board, actions}) => div({
    className: 'board'
  },
  board.flatMap((row, x) =>
    row.map((cell, y) =>
      Cell(`cell-${x}-${y}`, {
        cell: board.cursor([x, y]),
        disabled, board, actions
      }))
  ).toArray()
));

var Winner = component(({board, actions: { reset }, winner}) => a({
    className: 'winner',
    onClick: () => reset(board)
  },
  h1({}, `Game finished! Winner: ${winner}`),
  p({}, 'Click to restart')
));

var App = component(function ({state, actions}) {
  var { findWinner } = actions;
  var board = state.cursor('board');
  var winner = findWinner(board);

  return div({
    className: 'tic-tac-toe'
  },
    !winner ? null : Winner({ winner, board, actions }),
    Board({
      board,
      actions: actions,
      disabled: !!winner
    })
  );
});

module.exports = App;
