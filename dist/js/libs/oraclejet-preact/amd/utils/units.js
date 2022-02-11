define(['exports', '@oracle/oraclejet-preact/utils/stringLiteralArray'], (function (exports, stringLiteralArray) { 'use strict';

  const is = (Ctor) => (val) => (val != null && val.constructor === Ctor) || val instanceof Ctor;
  const isNumber = is(Number);
  const isString = is(String);
  const isNumeral = (n) => !isNaN(parseFloat(n)) && !isNaN(n - 0);
  const isZero = (n) => n === 0 || n === "0";
  const units = stringLiteralArray.stringLiteralArray(["px", "%", "em", "rem", "vh", "vw"]);
  const endsWithUnitRegExp = new RegExp(`(${units.join("|")})$`);
  const hasUnit = (val) => isString(val) && endsWithUnitRegExp.test(val);
  const toUnit = (unit) => (n) => isZero(n) || hasUnit(n) || !isNumeral(n) ? n : n + unit;
  const px = toUnit("px");

  exports.hasUnit = hasUnit;
  exports.isNumber = isNumber;
  exports.isZero = isZero;
  exports.px = px;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
