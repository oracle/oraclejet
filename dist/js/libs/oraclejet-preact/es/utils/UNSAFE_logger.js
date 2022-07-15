/* @oracle/oraclejet-preact: 13.0.0 */
import '../_curry1-8b0d63fc.js';
import { _ as _curry2_1 } from '../_curry2-6a0eecef.js';

var _curry2 =

_curry2_1;
/**
 * Returns a partial copy of an object containing only the keys specified. If
 * the key does not exist, the property is ignored.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> {k: v}
 * @param {Array} names an array of String property names to copy onto a new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties from `names` on it.
 * @see R.omit, R.props
 * @example
 *
 *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
 *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
 */


var pick =
/*#__PURE__*/
_curry2(function pick(names, obj) {
  var result = {};
  var idx = 0;

  while (idx < names.length) {
    if (names[idx] in obj) {
      result[names[idx]] = obj[names[idx]];
    }

    idx += 1;
  }

  return result;
});

var pick_1 = pick;

/**
 * @license
 * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
// TODO: fully implement Logger
const Logger = pick_1(['error', 'warn', 'info', 'log'], console);

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { Logger };
/*  */
//# sourceMappingURL=UNSAFE_logger.js.map
