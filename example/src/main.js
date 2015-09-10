'use strict';

var component = require('omniscient');
var React = require('react');
var {div, h1, p, a} = React.DOM;

var Cell = component(({disabled, cell, board, actions}) => (
  a({
    className: 'cell',
    onClick: () => !disabled && actions.invoke('change', cell, board)
  },
    cell.valueOf()
  )
));

var Board = component(({disabled, board, actions}) => (
  div({
    className: 'board'
  },
    board.flatMap((row, x) =>
      row.map((cell, y) =>
        Cell(`cell-${x}-${y}`, {
          cell: board.cursor([x, y]),
          disabled, board, actions
        }))
    ).toArray()
  )
));

var Winner = component(({board, actions, winner}) => (
  a({
    className: 'winner',
    onClick: function () {
      actions.invoke('reset', board);
    }
  },
    h1({}, `Game finished! Winner: ${winner}`),
    p({}, 'Click to restart')
  )
));

var App = component(function ({state, actions}) {
  var board = state.cursor('board');
  var winner = actions.invoke('findWinner', board);
  var winnerNote = !winner ? null : Winner({ winner, board, actions });

  return div({
    className: 'tic-tac-toe'
  },
    winnerNote,
    Board({
      board,
      actions,
      disabled: !!winner
    })
  )
});

module.exports = App;
