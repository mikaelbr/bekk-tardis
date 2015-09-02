var chai = require('chai');
var should = chai.should();

var unstoreCreator = require('./');
var immstruct = require('immstruct');

describe('unstore', function () {

  describe('without immstruct', function () {
    var unstore;
    beforeEach(function () {
      unstore = unstoreCreator();
    });

    describe('api', function () {

      var defaultApiMethods = [
        'register', 'remove', 'invoke', 'createComposedInvoker',
        'combine', 'actions'
      ];

      it('should expose an empty, clean store', function () {
        unstore.actions().should.eql({});
        shouldHaveFunctions(unstore, defaultApiMethods);
      });

      it('should return same API on added action', function () {
        var newUnstore = unstore.register(noop);
        shouldHaveFunctions(newUnstore, defaultApiMethods);
      });

      it('should return same API on remove action', function () {
        var newUnstore = unstore.register('foo', noop);
        shouldHaveFunctions(newUnstore, defaultApiMethods);
        newUnstore = newUnstore.remove('foo');
        shouldHaveFunctions(newUnstore, defaultApiMethods);
      });

    });

    describe('register', function () {

      it('should have immutable register method, returning new unstore with added action', function () {
        var fnName = 'fnName';
        var newUnstore = unstore.register(fnName, noop);
        unstore.actions().should.eql({});
        shouldHaveFunction(newUnstore.actions(), fnName);
      });

      it('should use function name implicitly', function () {
        var fnName = 'fnName';
        var newUnstore = unstore.register(function fnName () { });
        shouldHaveFunction(newUnstore.actions(), fnName);
      });

      it('should use defined name if explicitly defined, even though function has name', function () {
        var fnName = 'fnName';
        var newUnstore = unstore.register(fnName, function anotherFnName () { });
        shouldHaveFunction(newUnstore.actions(), fnName);
      });

    });

    describe('invoke', function () {

      it('should be able to invoke registered function', function (done) {
        var newUnstore = unstore.register('done', done);
        newUnstore.invoke('done');
      });

      it('should be able to pass arguments on single invoke', function (done) {
        var newUnstore = unstore.register('done', function (a, b) {
          a.should.equal('foo');
          b.should.equal('bar');
          done();
        });
        newUnstore.invoke('done', 'foo', 'bar');
      });

      it('should be able to invoke bulk functions', function () {
        var numCalls = 0;
        var increment = function () { numCalls++ };
        var newUnstore = unstore
          .register('1', increment)
          .register('2', increment);

        newUnstore.invoke(['1', '2']);
        numCalls.should.equal(2);
      });


      it('should be able to invoke bulk functions with arguments', function (done) {
        var numCalls = 0;
        var update = function (a, b) {
          a.should.equal('foo');
          b.should.equal('bar');

          if (++numCalls === 2) done();
        };

        var newUnstore = unstore
          .register('1', update)
          .register('2', update);

        newUnstore.invoke(['1', '2'], 'foo', 'bar');
      });

    });

    describe('remove', function () {

      it('should return new unstore on remove, not altering the existing one', function () {

        var fnName = 'fnName', otherFnName = 'shouldKeep';
        var newUnstore = unstore.register(fnName, noop).register(otherFnName, noop);
        shouldHaveFunction(newUnstore.actions(), fnName);

        var reducedUnstore = newUnstore.remove(fnName);
        shouldHaveFunction(newUnstore.actions(), fnName);
        shouldNotHaveFunction(reducedUnstore.actions(), fnName);
        shouldHaveFunction(reducedUnstore.actions(), otherFnName);
      });

      it('should remove multiple actions at once', function () {
        var newUnstore = unstore.register('1', noop).register('2', noop).register('3', noop);
        shouldHaveFunctions(newUnstore.actions(), ['1', '2']);

        var reducedUnstore = newUnstore.remove(['1', '2']);
        shouldHaveFunctions(newUnstore.actions(), ['1', '2']);
        shouldNotHaveFunctions(reducedUnstore.actions(), ['1', '2']);
        shouldHaveFunction(reducedUnstore.actions(), '3');
      });

    });

    describe('combine', function () {

      it('should combine one unstore with another', function () {
        var newUnstore = unstore.register('1', noop).register('2', noop)
        var anotherUnstore = unstore.register('3', noop);

        var combinedUnstore = newUnstore.combine(anotherUnstore);
        Object.keys(combinedUnstore.actions()).length.should.equal(3);

        shouldHaveFunctions(combinedUnstore.actions(), ['1', '2', '3']);
        shouldNotHaveFunctions(anotherUnstore.actions(), ['1', '2']);
        shouldNotHaveFunction(newUnstore.actions(), '3');
      });

      it('should combine multiple unstore', function () {
        var newUnstore = unstore.register('1', noop).register('2', noop)
        var anotherUnstore = unstore.register('3', noop);

        var combinedUnstore = unstore.combine(newUnstore, anotherUnstore);
        Object.keys(combinedUnstore.actions()).length.should.equal(3);

        shouldHaveFunctions(combinedUnstore.actions(), ['1', '2', '3']);
        shouldNotHaveFunctions(anotherUnstore.actions(), ['1', '2']);
        shouldNotHaveFunction(newUnstore.actions(), '3');
      });

    });

    describe('createComposedInvoker', function () {

      it('should create a composed invoker', function () {
        var newUnstore = unstore
          .register('square', function (input) {
            return input * input;
          })
          .register('timesTwo', function (input) {
            return input * 2;
          });

        var invoker = newUnstore.createComposedInvoker('square', 'timesTwo');
        invoker(4).should.equal( 8 * (4 * 2) );
      });

    });

  });


  describe('immstruct cursors', function () {
    var unstore, structure;
    beforeEach(function () {
      structure = immstruct({
        foo: 4
      });
      unstore = unstoreCreator(structure);
    });

    it('should group cursor updates to one swap event', function () {
      var numCalls = 0;

      var newUnstore = unstore
        .register('square', function (cursor) {
          return cursor.updateIn(['foo'], function (input) {
            return input * input;
          });
        })
        .register('timesTwo', function (cursor) {
          return cursor.updateIn(['foo'], function (input) {
            return input * 2;
          })
        });

      structure.on('swap', function () {
        numCalls++;
      });
      var invoker = newUnstore.createComposedInvoker('square', 'timesTwo');
      invoker(structure.cursor()).get('foo').valueOf().should.equal( 8 * (4 * 2) );
      numCalls.should.equal(1);
    });

    it('should group cursor updates to one swap event on lower level cursor to scalar value', function () {
      var structure = immstruct({
        foo: 4
      });
      var numCalls = 0;

      var newUnstore = unstore
        .register('square', function (cursor) {
          return cursor.update(function (input) {
            return input * input;
          });
        })
        .register('timesTwo', function (cursor) {
          return cursor.update(function (input) {
            return input * 2;
          })
        });

      structure.on('swap', function () {
        numCalls++;
      });
      var invoker = newUnstore.createComposedInvoker('square', 'timesTwo');
      invoker(structure.cursor('foo')).valueOf().should.equal( 8 * (4 * 2) );
      numCalls.should.equal(1);
    });

    it('should invoke single action', function () {
      var structure = immstruct({ foo: 4 });
      var newUnstore = unstore
        .register('square', function (cursor) {
          return cursor.update(function (input) {
            return input * input;
          });
        })
        .register('timesTwo', function (cursor) {
          return cursor.update(function (input) {
            return input * 2;
          })
        });

      var cursor = structure.cursor('foo');
      var newCursor = newUnstore.invoke('square', cursor);
      newCursor.valueOf().should.equal( 4 * 4 );

      newCursor = newUnstore.invoke('timesTwo', cursor);
      newCursor.valueOf().should.equal( 4 * 2 );
    });

  });

  function shouldHaveFunction (inst, fn) {
    return shouldHaveFunctions(inst, [fn]);
  }

  function shouldHaveFunctions (inst, functions) {
    functions.forEach(function (fnName) {
      inst.should.have.property(fnName).that.is.a('function');
    });
  }

  function shouldNotHaveFunction (inst, fn) {
    return shouldNotHaveFunctions(inst, [fn]);
  }

  function shouldNotHaveFunctions (inst, functions) {
    functions.forEach(function (fnName) {
      inst.should.not.have.property(fnName).that.is.a('function');
    });
  }

  function noop () { }

});
