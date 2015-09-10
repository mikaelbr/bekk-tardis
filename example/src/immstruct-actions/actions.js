'use strict';

var assign = require('lodash.assign');

function unstore (initialActions, subscribers) {
  var storedActions = (initialActions || {});
  var storedSubscribers = (subscribers || []);

  var methods = {
    invoke: function (actionName) {
      var actions = pickActions(storedActions, arrify(actionName));
      var args = toArray(arguments).slice(1);

      var result = Object.keys(actions).reduce(function (acc, name) {
        acc[name] = actions[name].apply(null, args);
        return acc;
      }, {});

      if (!Array.isArray(actionName)) {
        return result[actionName];
      }
      triggerSubscribers(storedSubscribers, result);

      return result;
    },

    subscribe: function (fn) {
      return unstore(
        assign({}, storedActions),
        assign([], storedSubscribers.concat(fn))
      );
    },

    register: function (actionName, action) {
      var newActionMerger = {};

      if (typeof actionName === 'function') {
        action = actionName;
        actionName = action.name;
      }

      if (!actionName) {
        return methods;
      }
      newActionMerger[actionName] = action;
      return unstore(
        assign({}, storedActions, newActionMerger),
        assign([], storedSubscribers)
      );
    },

    remove: function (actionName) {
      var actionNames = arrify(actionName);
      return unstore(Object.keys(storedActions).reduce(function (acc, key) {
        if (actionNames.indexOf(key) !== -1) return acc;
        acc[key] = storedActions[key];
        return acc;
      }, {}));
    },

    createComposedInvoker: function (/* fns */) {
      var actions = pickActions(storedActions, toArray(arguments));
      return function composedInvoker (args) {
        var outerContext = this;
        var result = updateOrInvoke(actions, args, outerContext);
        triggerSubscribers(storedSubscribers, result);
        return result;
      };
    },

    combine: function (/* other stores */) {
      var newStoredActions = [storedActions]
        .concat(
          toArray(arguments)
          .map(function (store) {
            return store.actions();
          })
        );
      return unstore(
        assign.apply(null, [{}].concat(newStoredActions)),
        assign([], storedSubscribers)
      );
    },
  };

  Object.defineProperty(methods, 'fn', {
    get: function () {
      return Object.keys(storedActions).reduce(function (acc, fnName) {
        acc[fnName] = methods.invoke.bind(methods, fnName);
        return acc;
      }, {});
    },
    enumerable: true,
    configurable: false,
  });

  return methods;
};

module.exports = unstore();

function updateOrInvoke (actions, args, context) {
  var invoke = function (args) {
    return Object.keys(actions).reduceRight(function (result, name) {
      return actions[name].call(context, result);
    }, args);
  };

  if (args && args.deref && args.groupedOperations) {
    return args.groupedOperations(invoke);
  }

  return invoke(args);
}

function triggerSubscribers (subscribers, structure) {
  subscribers.forEach(function (fn) {
    fn(structure);
  });
}

function arrify (input) {
  if (Array.isArray(input)) {
    return input;
  }
  return [input];
}

function toArray (input) {
  return [].slice.apply(input);
}

function pickActions (actions, names) {
  return names.reduce(function (acc, name) {
    if (typeof name === 'function') {
      acc[name.name] = name;
    }
    if (!actions[name]) return acc;
    acc[name] = actions[name];
    return acc;
  }, {});
}
