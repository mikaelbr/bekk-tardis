'use strict';

var assert = require('assert');
var immstruct = require('immstruct');
var actions = require('../actions');

var Main = require('../main');
var React = require('react');

describe('integration tests', function () {
  var history = getHistory();
  it('should render winning screen', function () {
    history.forEach(function (state, key) {
      var structure = immstruct(state);
      var isLast = (key === history.length - 1);

      assert.equal(React.renderToString(Main({
        state: structure.cursor(),
        actions
      })).indexOf('Game finished') !== -1, isLast);
    });
  });
});

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
