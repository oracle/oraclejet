/* @oracle/oraclejet-preact: 13.1.0 */
import { stringLiteralArray } from './UNSAFE_arrayUtils.js';
import { isString } from './UNSAFE_stringUtils.js';

const is = (Ctor) => (val) => (val != null && val.constructor === Ctor) || val instanceof Ctor;
const isNumber = is(Number);
const isNumeral = (n) => !isNaN(parseFloat(n)) && !isNaN(n - 0);
const isZero = (n) => n === 0 || n === '0';
const units = stringLiteralArray(['px', '%', 'em', 'rem', 'vh', 'vw']);
const endsWithUnitRegExp = new RegExp(`(${units.join('|')})$`);
const hasUnit = (val) => isString(val) && endsWithUnitRegExp.test(val);
const toUnit = (unit) => (n) => isZero(n) || hasUnit(n) || !isNumeral(n) ? n : n + unit;
const px = toUnit('px');

export { hasUnit, isNumber, isZero, px };
/*  */
//# sourceMappingURL=UNSAFE_units.js.map
