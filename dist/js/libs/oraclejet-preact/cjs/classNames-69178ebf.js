/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

/**
 * Given a set of string arguments, join the values together into a string with
 * spaces. Falsey values will be omitted,
 * e.g. classNames(['A', 'B', false, 'D', false]) --> 'A B D'
 * @param values The set of values
 * @returns The values joined as a string, or blank string if no values
 */
function classNames(values) {
    return values.filter(Boolean).join(' ');
}

exports.classNames = classNames;
/*  */
//# sourceMappingURL=classNames-69178ebf.js.map
