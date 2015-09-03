'use strict';

var component = require('omniscient');
var immutable = require('immutable');
var immstruct = require('immstruct');
var React = require('react');

var {div, h1, p} = React.DOM;

var structureActions = require('./actions');
var Main = require('./main');

var history = getHistory();
var structure = immstruct({
  board: [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
});

function nextEntry(entry) {
  var data = history[entry];
  console.log(`Playing ${entry}: ${data}`)
  if (!data) return;
  structure.cursor().update(() => immutable.fromJS(data));
  setTimeout(() => nextEntry(++entry), 500);
}

setTimeout(nextEntry.bind(null, 0), 500);

function render () {
  React.render(Main({
    state: structure.cursor(),
    actions: structureActions
  }), document.querySelector('#game'));
}

render();
structure.on('swap', render);


// Paste in history here.
function getHistory () {
  return [
    {
        board: [
            [
                "",
                "",
                ""
            ],
            [
                "",
                "",
                ""
            ],
            [
                "",
                "",
                ""
            ]
        ]
    },
    {
        board: [
            [
                "x",
                "",
                ""
            ],
            [
                "",
                "",
                ""
            ],
            [
                "",
                "",
                ""
            ]
        ]
    },
    {
        board: [
            [
                "x",
                "o",
                ""
            ],
            [
                "",
                "",
                ""
            ],
            [
                "",
                "",
                ""
            ]
        ]
    },
    {
        board: [
            [
                "x",
                "o",
                "x"
            ],
            [
                "",
                "",
                ""
            ],
            [
                "",
                "",
                ""
            ]
        ]
    },
    {
        board: [
            [
                "x",
                "o",
                "x"
            ],
            [
                "",
                "o",
                ""
            ],
            [
                "",
                "",
                ""
            ]
        ]
    },
    {
        board: [
            [
                "x",
                "o",
                "x"
            ],
            [
                "",
                "o",
                ""
            ],
            [
                "",
                "x",
                ""
            ]
        ]
    },
    {
        board: [
            [
                "x",
                "o",
                "x"
            ],
            [
                "o",
                "o",
                ""
            ],
            [
                "",
                "x",
                ""
            ]
        ]
    },
    {
        board: [
            [
                "x",
                "o",
                "x"
            ],
            [
                "o",
                "o",
                "x"
            ],
            [
                "",
                "x",
                ""
            ]
        ]
    },
    {
        board: [
            [
                "x",
                "o",
                "x"
            ],
            [
                "o",
                "o",
                "x"
            ],
            [
                "",
                "x",
                "o"
            ]
        ]
    },
    {
        board: [
            [
                "x",
                "o",
                "x"
            ],
            [
                "o",
                "o",
                "x"
            ],
            [
                "x",
                "x",
                "x"
            ]
        ]
    }
];
}
