/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as _curry1_1, a as _isPlaceholder_1 } from './_curry1-8b0d63fc.js';

var _curry1 =

_curry1_1;

var _isPlaceholder =

_isPlaceholder_1;
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

export { _curry2_1 as _ };
/*  */
//# sourceMappingURL=_curry2-6a0eecef.js.map
