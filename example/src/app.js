'use strict';

var component = require('omniscient');
var immstruct = require('immstruct');
var React = require('react');

var structureActions = require('./actions');
var Main = require('./main');

var structure = immstruct.withHistory({
  board: [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
});

React.initializeTouchEvents(true);

function render () {
  React.render(Main({
    state: structure.cursor(),
    actions: structureActions.fn
  }), document.querySelector('#game'));
}

render();
structure.on('swap', render);

// Activate TARDIS
var tardis = require('./tardis');
tardis(structure, '#tardis');
