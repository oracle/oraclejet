/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_UNSAFE_arrayUtils = require('./UNSAFE_arrayUtils.js');
require('./UNSAFE_stringUtils.js');
var stringUtils = require('../stringUtils-bca189f8.js');

const is = (Ctor) => (val) => (val != null && val.constructor === Ctor) || val instanceof Ctor;
const isNumber = is(Number);
const isNumeral = (n) => !isNaN(parseFloat(n)) && !isNaN(n - 0);
const isZero = (n) => n === 0 || n === '0';
const units = utils_UNSAFE_arrayUtils.stringLiteralArray(['px', '%', 'em', 'rem', 'vh', 'vw']);
const endsWithUnitRegExp = new RegExp(`(${units.join('|')})$`);
const hasUnit = (val) => stringUtils.isString(val) && endsWithUnitRegExp.test(val);
const toUnit = (unit) => (n) => isZero(n) || hasUnit(n) || !isNumeral(n) ? n : n + unit;
const px = toUnit('px');

exports.hasUnit = hasUnit;
exports.isNumber = isNumber;
exports.isZero = isZero;
exports.px = px;
/*  */
//# sourceMappingURL=UNSAFE_units.js.map
