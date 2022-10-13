/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var _curry1$1 = require('./_curry1-94f22a19.js');

var _curry1 =

_curry1$1._curry1_1;

var _isPlaceholder =

_curry1$1._isPlaceholder_1;
/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;

      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
          return fn(a, _b);
        });

      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

var _curry2_1 = _curry2;

exports._curry2_1 = _curry2_1;
/*  */
//# sourceMappingURL=_curry2-e6dc9cf1.js.map
