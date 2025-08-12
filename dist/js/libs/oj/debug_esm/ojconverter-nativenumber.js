/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { getLocale } from 'ojs/ojconfig';
import { getMergedNumberPreferencesWithOptions } from 'ojs/ojconverter-preferences';

const _DECIMAL_SEP = '.';
const _MINUS = '-';
const _EXPONENTIAL_EXPR = /^([+|-])?(\d+\.\d+|\.?\d+)(?:[e|E])([+|-])?(\d+)$/;
const _DECIMAL_EXPR = /^([+|-])?(\d+\.\d+|\.?\d+)$/;
const _REMOVE_TRAILING = /0+$/;
const _REMOVE_LEADING = /^0+/;
function parse(value) {
    let parts = value.match(_DECIMAL_EXPR);
    if (parts) {
        const negative = parts[1] === _MINUS;
        return { negative, ..._splitDecimal(parts[2]) };
    }
    parts = value.match(_EXPONENTIAL_EXPR);
    if (parts) {
        const negative = parts[1] === _MINUS;
        const coefficient = _splitDecimal(parts[2]);
        // exponent is an integer whose precsion should be always sufficently handled by a Number type
        let exponentVal = parseInt(parts[4]);
        exponentVal = parts[3] === _MINUS ? -exponentVal : exponentVal;
        return { negative, ...multiplyCoefficient(coefficient, exponentVal) };
    }
    throw new Error('Not a valid number');
}
function multiplyCoefficient(coefficient, exponent) {
    let { whole, decimal } = coefficient;
    if (exponent === 0 || (whole === '' && decimal === '')) {
        return coefficient;
    }
    if (exponent > 0) {
        const shiftFromDecimal = Math.min(exponent, decimal.length);
        const extraZeros = Math.max(exponent - shiftFromDecimal, 0);
        whole = whole + decimal.substring(0, shiftFromDecimal) + '0'.repeat(extraZeros);
        if (shiftFromDecimal > 0) {
            decimal = decimal.substring(shiftFromDecimal);
        }
    }
    else {
        const shiftFromWhole = Math.min(-exponent, whole.length);
        const extraZeros = Math.max(-exponent - shiftFromWhole, 0);
        const moveFrom = whole.length - shiftFromWhole;
        decimal = '0'.repeat(extraZeros) + whole.substring(moveFrom) + decimal;
        if (shiftFromWhole > 0) {
            whole = whole.substring(0, moveFrom);
        }
    }
    whole = _normalize(whole, false);
    decimal = _normalize(decimal, true);
    return { whole, decimal };
}
function _splitDecimal(value) {
    let whole = '';
    let decimal = '';
    const parts = value.split(_DECIMAL_SEP);
    if (parts.length == 1) {
        const num = parts[0];
        if (value.startsWith(_DECIMAL_SEP)) {
            decimal = num; // .5
        }
        else {
            whole = num; // 5
        }
    }
    else {
        whole = parts[0];
        decimal = parts[1];
    }
    return { whole: _normalize(whole, false), decimal: _normalize(decimal, true) };
}
function _normalize(num, isDecimal) {
    return num.replace(isDecimal ? _REMOVE_TRAILING : _REMOVE_LEADING, '');
}

function getLocaleData(locale) {
    let data = _cache.get(locale);
    if (!data) {
        data = _loadData(locale);
        _cache.set(locale, data);
    }
    return data;
}
function _loadData(locale) {
    const localToAsciiNumbers = _getNumberCharacterMap(locale);
    const decimalSeparator = _getDecimalSeparator(locale);
    const negativeSign = _getSign(locale, false);
    const positiveSign = _getSign(locale, true);
    const percentSign = _getPercentSign(locale);
    const exponentSeparator = _getExponentSeparator(locale);
    const negativeAccountingSign = _getNegativeAccountingSign(locale);
    return {
        localToAsciiNumbers,
        decimalSeparator,
        negativeSign,
        positiveSign,
        percentSign,
        exponentSeparator,
        negativeAccountingSign
    };
}
function _getNumberCharacterMap(locale) {
    const fmt = new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 0 });
    const localToAsciiNumbers = new Map();
    const result = fmt.format(9876543210);
    for (let i = 0; i < 10; i++) {
        const char = result[i];
        const ascii = (9 - i).toString();
        localToAsciiNumbers.set(char, ascii);
    }
    return localToAsciiNumbers;
}
function _getDecimalSeparator(locale) {
    return _getPart(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 }, 1.1, 'decimal', '.');
}
/**
 * Returns the plus sign or minus sign for the locale.
 * The characters used for the +/- signs may not be the standard ASCII, even if they look like it.
 * They are locale-dependent. For example, the minus sign in these locales does not === '-',
 * 'sv', 'sl', 'no', 'nb', 'lt, 'hr', 'fi', 'et'.
 * @param locale
 * @param positive
 * @returns The positive sign for the locale if positive is true, else the negative sign for the locale.
 */
function _getSign(locale, positive) {
    const opts = { signDisplay: 'always' };
    return positive
        ? _getPart(locale, opts, 1, 'plusSign', '+')
        : _getPart(locale, opts, -1, 'minusSign', '-');
}
/**
 * Accounting format means to wrap a negative number with parentheses instead of appending a minus sign for many locales,
 * but not all. In some locales, accounting format uses a minus sign at the start.
 * This will return the accounting format character for the locale, a parenthesis or a minus sign.
 * @param locale
 * @returns a minus sign or a parenthesis.
 */
function _getNegativeAccountingSign(locale) {
    const opts = {
        style: 'currency',
        currency: 'USD',
        currencySign: 'accounting'
    };
    const firstPart = new Intl.NumberFormat(locale, opts).formatToParts(-1)[0].value;
    return firstPart;
}
function _getPercentSign(locale) {
    return _getPart(locale, { style: 'percent' }, 1, 'percentSign', '%');
}
function _getExponentSeparator(locale) {
    return _getPart(locale, { notation: 'scientific' }, 100, 'exponentSeparator', 'E');
}
function _getPart(locale, opts, value, type, backup) {
    const parts = new Intl.NumberFormat(locale, opts).formatToParts(value);
    return parts.find((part) => part.type === type)?.value ?? backup;
}
const _cache = new Map();

const _ROUNDING_MODE_TO_NATIVE = new Map([
    ['HALF_UP', 'halfExpand'],
    ['HALF_DOWN', 'halfTrunc'],
    ['HALF_EVEN', 'halfEven'],
    ['UP', 'expand'],
    ['DOWN', 'trunc'],
    ['CEILING', 'ceil'],
    ['FLOOR', 'floor']
]);
const _REMOVE_TRAILING_0 = /0+$/;
function round(parseResult, displayedFractionDigits, roundingMode) {
    // note that displayedFractionDigits is being used here only to determine how many digits
    // need to be cut, i.e. it does not matter whether displayedFractionDigits is greater than the
    // initial length of the decimal portion
    let { whole, negative, decimal } = parseResult;
    const decLength = decimal.length;
    const digitsToCut = decLength - displayedFractionDigits;
    if (digitsToCut > 0) {
        const digits = (whole || '0') + decimal;
        const rounded = [];
        // inspect one pair of digits at the time starting at the end of the string
        let i1 = digits.length - 2;
        let second = parseInt(digits[i1 + 1]);
        for (let cut = 0; i1 >= 0; i1--) {
            let first = parseInt(digits[i1]);
            const cutting = cut < digitsToCut;
            if (second === 10) {
                second = 0; // 0 value will cause _roundPair() to be a no-op
                // apply increment to the digit on the left
                first++;
            }
            if (!cutting) {
                rounded.unshift(String(second));
                second = first;
            }
            else {
                second = _roundPair(first, second, negative, roundingMode);
                cut++;
            }
        }
        if (second === 10) {
            rounded.unshift('0');
            rounded.unshift('1');
        }
        else {
            rounded.unshift(String(second));
        }
        if (displayedFractionDigits === 0) {
            whole = rounded.join('');
            decimal = '';
        }
        else {
            whole = rounded.slice(0, -displayedFractionDigits).join('');
            let decimalDigits = rounded.slice(-displayedFractionDigits);
            // remove trailing zeros
            decimal = decimalDigits.join('').replace(_REMOVE_TRAILING_0, '');
        }
    }
    whole === '0' ? '' : whole;
    return { whole, decimal };
}
function getNativeRoundingMode(options) {
    const mode = options.roundingMode ?? 'HALF_UP';
    const native = _ROUNDING_MODE_TO_NATIVE.get(mode);
    if (!native) {
        throw new Error('Invalid rounding mode');
    }
    return native;
}
function _roundPair(first, second, isNegative, roundingMode) {
    if (second === 0 ||
        roundingMode === 'DOWN' ||
        (roundingMode === 'CEILING' && isNegative) ||
        (roundingMode === 'FLOOR' && !isNegative)) {
        return first;
    }
    switch (roundingMode) {
        case 'HALF_UP':
            return first + (second >= 5 ? 1 : 0);
        case 'HALF_DOWN':
            return first + (second > 5 ? 1 : 0);
        case 'HALF_EVEN':
            return first + ((second == 5 && first % 2 === 0) || second < 5 ? 0 : 1);
        case 'UP':
        case 'CEILING': //'CEILING' for negative is handled in the first 'if' statement above
        case 'FLOOR': // 'FLOOR' for positive is handled in the first 'if' statement above
            return first + 1;
        default:
            throw new Error('Invalid rounding mode ' + roundingMode);
    }
}

const _ASCII_NUMBER_CHARS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
function parseInput(input, resolvedOptions, locale) {
    const localeData = getLocaleData(locale);
    const { decimal, group } = resolvedOptions.separators;
    const { negativeSign, positiveSign, percentSign, localToAsciiNumbers, exponentSeparator, negativeAccountingSign } = localeData;
    let exponent = 0;
    let buffer = '';
    if (resolvedOptions.style === 'currency' &&
        resolvedOptions.currencySign === 'accounting' &&
        negativeAccountingSign !== negativeSign) {
        // negativeAccountingSign could be a negative sign or '(', because the 'accounting' format is locale dependent.
        // negativeSign is always a negative sign.
        // If the number is wrapped in (), then convert it to '-'. E.g., ($1,000.00) becomes -$1,000.00.
        input = _convertParenthesesToNegative(input);
    }
    for (let char of input) {
        switch (char) {
            case negativeSign:
            case '-':
                buffer += '-';
                break;
            case decimal:
                buffer += '.';
                break;
            case exponentSeparator:
            case 'E':
            case 'e':
                buffer += 'E';
                break;
            case percentSign:
            case '%':
            case positiveSign:
            case '+':
            case group:
                break;
            default:
                const number = localToAsciiNumbers.get(char);
                if (number) {
                    buffer += number;
                }
                else {
                    _possiblyThrowParseError(resolvedOptions);
                    if (_ASCII_NUMBER_CHARS.has(char)) {
                        buffer += char;
                    }
                }
        }
    }
    if (resolvedOptions.style === 'percent') {
        exponent = -2;
    }
    // Note that parseNum() below may throw errors even with lenient parsing, such as "--5".
    let parseResult;
    try {
        parseResult = parse(buffer);
    }
    catch (e) {
        _throwUserInputError();
    }
    if (exponent !== 0) {
        parseResult = {
            negative: parseResult.negative,
            ...multiplyCoefficient(parseResult, exponent)
        };
    }
    if (resolvedOptions.roundDuringParse) {
        parseResult = {
            negative: parseResult.negative,
            ...round(parseResult, resolvedOptions.maximumFractionDigits, resolvedOptions.roundingMode)
        };
    }
    const whole = parseResult.whole || '0';
    const hasDecimal = parseResult.decimal !== '';
    buffer =
        (parseResult.negative ? '-' : '') + whole + (hasDecimal ? '.' + parseResult.decimal : '');
    return buffer;
}
function _possiblyThrowParseError(options) {
    if (options.lenientParse === 'none') {
        _throwUserInputError();
    }
}
function _throwUserInputError() {
    throw new Error('Not a valid number', { cause: 'userInput' });
}
/**
 * Converts a string formatted with parentheses into a standard negative number format.
 * For example, it converts "($1,000.00)" to "-$1,000.00"
 * @param input string
 * @returns If the input starts and ends with parentheses, returns the trimmed string,
 * with the parentheses removed, and a '-' prepended to the result;
 * otherwise, returns the original string.
 */
function _convertParenthesesToNegative(input) {
    // first trim the input
    const trimmedInput = input.trim();
    const openParenthesis = '(';
    const closeParenthesis = ')';
    // Unicode escape sequences for full-width parenthesis as seen in some Asian languages
    const fullWidthOpenParenthesis = '\uFF08';
    const fullWidthCloseParenthesis = '\uFF09';
    const startsWithParenthesis = trimmedInput.startsWith(openParenthesis) || trimmedInput.startsWith(fullWidthOpenParenthesis);
    const endsWithParenthesis = trimmedInput.endsWith(closeParenthesis) || trimmedInput.endsWith(fullWidthCloseParenthesis);
    if (startsWithParenthesis && endsWithParenthesis) {
        const trimmed = trimmedInput.slice(1, -1);
        // Prepend a '-'
        return '-' + trimmed;
    }
    return input;
}

function getResolvedAndNativeOptions(options, locale) {
    const native = _getNativeOptions(options);
    const { defaultMinFractionDigits, defaultMaxFractionDigits } = _getDefaultFractionDigits(native, locale);
    const minimumFractionDigits = options.minimumFractionDigits ??
        Math.min(defaultMinFractionDigits, options.maximumFractionDigits ?? Number.MAX_SAFE_INTEGER);
    const maximumFractionDigits = options.maximumFractionDigits ?? Math.max(minimumFractionDigits, defaultMaxFractionDigits);
    if (minimumFractionDigits > maximumFractionDigits) {
        throw new Error('maximumFractionDigits value is out of range');
    }
    const common = {
        locale: locale,
        minimumIntegerDigits: options.minimumIntegerDigits ?? 0,
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping: options.useGrouping ?? _getDefaultGroupingSeparator(native, locale, false) !== undefined,
        lenientParse: options.lenientParse ?? 'full',
        roundDuringParse: options.roundDuringParse ?? false,
        roundingMode: options.roundingMode ?? 'HALF_UP',
        separators: {
            decimal: options.separators?.decimal ?? getLocaleData(locale).decimalSeparator,
            group: options.separators?.group ?? _getDefaultGroupingSeparator(native, locale)
        }
    };
    let resolved;
    switch (options.style) {
        case 'decimal':
        case undefined:
            resolved = {
                style: 'decimal',
                decimalFormat: options.decimalFormat ?? 'standard',
                virtualKeyboardHint: _getVirtualKeyboardHint(common.useGrouping, common.separators.decimal, common.separators.group),
                ...common
            };
            break;
        case 'currency':
            resolved = {
                style: 'currency',
                currency: options.currency,
                currencyFormat: options.currencyFormat ?? 'standard',
                currencyDisplay: options.currencyDisplay ?? 'symbol',
                currencySign: options.currencySign ?? 'standard',
                customCurrencyCode: options.customCurrencyCode,
                customCurrencySymbol: options.customCurrencySymbol,
                ...common
            };
            break;
        case 'percent':
            resolved = { style: 'percent', ...common };
            break;
        case 'unit':
            resolved = { style: 'unit', unit: options.unit, ...common };
    }
    return { resolved, native };
}
function _getNativeOptions(options) {
    let nativeOpts;
    switch (options.style) {
        case 'decimal':
        case undefined:
            nativeOpts = _getDecimalNativeOptions(options);
            break;
        case 'currency':
            nativeOpts = _getCurrencyNativeOptions(options);
            break;
        case 'percent':
            nativeOpts = { style: 'percent' };
            break;
        case 'unit':
            const unit = options.unit;
            if (unit !== 'byte' && unit !== 'bit') {
                throw new Error('invalid unit name');
            }
            nativeOpts = { style: 'unit', unitDisplay: 'short', unit };
            break;
        default:
            throw new Error('Invalid format style');
    }
    return nativeOpts;
}
function _getDefaultFractionDigits(options, locale) {
    // Certain versions of Chrome include minimumFractionDigits only when maximumFractionDigits is set and vice versa,
    // so we have to add those to retrieve default values
    const defaultMinFractionDigits = new Intl.NumberFormat(locale, options).resolvedOptions().minimumFractionDigits ?? 0;
    const defaultMaxFractionDigits = new Intl.NumberFormat(locale, options).resolvedOptions().maximumFractionDigits ?? 0;
    return { defaultMinFractionDigits, defaultMaxFractionDigits };
}
function _getDecimalNativeOptions(options) {
    const decimalFormat = options.decimalFormat ?? 'standard';
    const nativeOpts = { style: 'decimal' };
    switch (decimalFormat) {
        case 'short':
            nativeOpts.notation = 'compact';
            nativeOpts.compactDisplay = 'short';
            break;
        case 'long':
            nativeOpts.notation = 'compact';
            nativeOpts.compactDisplay = 'long';
            break;
        case 'standard':
            break;
        default:
            throw new Error('Invalid decimalFormat: ' + decimalFormat);
    }
    return nativeOpts;
}
function _getCurrencyNativeOptions(options) {
    const currencyFormat = options.currencyFormat ?? 'standard';
    const currency = options.currency;
    if (!currency) {
        throw new Error('Currency option is required for currency style');
    }
    const nativeOpts = {
        style: 'currency',
        currency,
        currencyDisplay: options.currencyDisplay ?? 'symbol',
        currencySign: options.currencySign ?? 'standard'
    };
    switch (currencyFormat) {
        case 'short':
            nativeOpts.notation = 'compact';
            nativeOpts.compactDisplay = 'short';
            break;
        case 'standard':
            break;
        default:
            throw new Error('Invalid currencyFormat: ' + currencyFormat);
    }
    return nativeOpts;
}
function _getDefaultGroupingSeparator(options, locale, forceGrouping = true) {
    const formatOpts = forceGrouping ? { ...options, useGrouping: true } : options;
    const parts = new Intl.NumberFormat(locale, formatOpts).formatToParts(1000000);
    return parts.find((part) => part.type === 'group')?.value;
}
// This returns a hint on which keyboard can be used for a mobile device
// when a component has this converter. The number keyboard will be sufficient if there is no
// grouping at all or if it is '', and the decimal separator is a '.'.
// Otherwise you should bring up the text keyboard.
// Call this function only when style is 'decimal' or unknown (which defaults to decimal).
function _getVirtualKeyboardHint(useGrouping, decimalSeparator, groupSeparator) {
    if (useGrouping && decimalSeparator === '.' && groupSeparator === '') {
        return 'number';
    }
    if (!useGrouping && decimalSeparator === '.') {
        return 'number';
    }
    return 'text';
}

const _BYTE_SCALE_THRESHOLDS = [10 ** 3, 10 ** 6, 10 ** 9, 10 ** 12, 10 ** 15];
const _BIT_SCALE_THRESHOLDS = [10 ** 3, 10 ** 6, 10 ** 9, 10 ** 12];
const _DECIMAL_SCALE_THRESHOLDS = [10 ** 3, 10 ** 6, 10 ** 9, 10 ** 12];
const _BYTE_UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'];
const _BIT_UNITS = ['bit', 'kilobit', 'megabit', 'gigabit', 'terabit'];
function scaleCompact(parseResult, getDisplayedFractionDigits, resolvedOptions) {
    return _scale(parseResult, getDisplayedFractionDigits, _DECIMAL_SCALE_THRESHOLDS, resolvedOptions, true);
}
function scaleBytes(parseResult, getDisplayedFractionDigits, resolvedOptions) {
    const { scaled, scaleIndex } = _scale(parseResult, getDisplayedFractionDigits, _BYTE_SCALE_THRESHOLDS, resolvedOptions);
    return { scaled, unit: _BYTE_UNITS[scaleIndex] };
}
function scaleBits(parseResult, getDisplayedFractionDigits, resolvedOptions) {
    const { scaled, scaleIndex } = _scale(parseResult, getDisplayedFractionDigits, _BIT_SCALE_THRESHOLDS, resolvedOptions);
    return { scaled, unit: _BIT_UNITS[scaleIndex] };
}
function scaleBytesNumber(value, resolvedOptions) {
    const { scaled, scaleIndex } = _scaleNumber(value, _BYTE_SCALE_THRESHOLDS, resolvedOptions);
    return { scaled, unit: _BYTE_UNITS[scaleIndex] };
}
function scaleBitsNumber(value, resolvedOptions) {
    const { scaled, scaleIndex } = _scaleNumber(value, _BIT_SCALE_THRESHOLDS, resolvedOptions);
    return { scaled, unit: _BIT_UNITS[scaleIndex] };
}
function scalePercent(parseResult, resolvedOptions, getDisplayedFractionDigits) {
    let { whole, negative, decimal } = parseResult;
    const scaled = multiplyCoefficient({ whole, decimal }, 2); // multiply by 100
    return round({ whole: scaled.whole, decimal: scaled.decimal, negative }, getDisplayedFractionDigits(scaled.decimal.length), resolvedOptions.roundingMode);
}
// computes the scale (K, M, B, T and optionally multiplies the whole part of the number by the scale factor)
function _scale(parseResult, getDisplayedFractionDigits, thresholds, resolvedOptions, unscaleWhole = false) {
    let { whole, negative, decimal } = parseResult;
    const wholeVal = BigInt(whole);
    const scaleCount = thresholds.length;
    let scaleIndex = -1;
    for (let i = 0; i < scaleCount && wholeVal >= BigInt(thresholds[i]); i++, scaleIndex++)
        ;
    let exponent = 3 * (scaleIndex + 1);
    let scaled = multiplyCoefficient({ whole, decimal }, -exponent);
    let rounded = round({ whole: scaled.whole, decimal: scaled.decimal, negative }, getDisplayedFractionDigits(scaled.decimal.length), resolvedOptions.roundingMode);
    // check whether rounding the number will put it past the next threshold
    if (scaleIndex < scaleCount - 1 && BigInt(rounded.whole) === BigInt(thresholds[scaleIndex])) {
        scaleIndex++;
        exponent += 3;
        scaled = multiplyCoefficient({ whole, decimal }, -exponent);
        rounded = round({ whole: scaled.whole, decimal: scaled.decimal, negative }, getDisplayedFractionDigits(scaled.decimal.length), resolvedOptions.roundingMode);
    }
    scaled = {
        whole: unscaleWhole
            ? (BigInt(rounded.whole) * BigInt(10 ** exponent)).toString()
            : rounded.whole,
        decimal: rounded.decimal
    };
    return { scaled, scaleIndex: scaleIndex + 1 };
}
function _scaleNumber(value, thresholds, options) {
    // This format is used for rounding only
    const format = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: options.minimumFractionDigits,
        maximumFractionDigits: options.maximumFractionDigits,
        useGrouping: false
    });
    // Current version of TS does not have roundingMode on Intl.NumberFormatOptions
    format.roundingMode = getNativeRoundingMode(options);
    const scaleCount = thresholds.length;
    let scaleIndex = -1;
    for (let i = 0; i < scaleCount && value >= thresholds[i]; i++, scaleIndex++)
        ;
    let exponent = -3 * (scaleIndex + 1);
    // Scale and round
    let scaled = value * 10 ** exponent;
    let rounded = parseFloat(format.format(scaled));
    // check whether rounding the number will put it past the next threshold
    if (scaleIndex < scaleCount - 1 && rounded === thresholds[scaleIndex]) {
        scaleIndex++;
        exponent -= 3;
        scaled = value * 10 ** exponent;
    }
    return { scaled, scaleIndex: scaleIndex + 1 };
}

/**
 * If it is determined from the converter options
 * that the currency code or symbol be replaced, then this function
 * replaces them with the customCurrencyCode/Symbol.
 * @param parts The formatter's formatToParts.
 * @param options The converter's options
 * @returns The parts with the 'currency' replaced or removed, and extra 'literal' whitespace removed.
 */
function applyCustomCurrency(parts, options) {
    if (options.style === 'currency') {
        const shouldReplaceCurrencyCode = options.currencyDisplay === 'code' && options.customCurrencyCode !== undefined;
        const shouldReplaceCurrencySign = options.currencyDisplay === 'symbol' && options.customCurrencySymbol !== undefined;
        if (shouldReplaceCurrencyCode || shouldReplaceCurrencySign) {
            const customString = shouldReplaceCurrencyCode
                ? options.customCurrencyCode
                : options.customCurrencySymbol;
            return replaceCurrencyParts(parts, customString);
        }
    }
    return parts;
}
/**
 * Uses formatToParts to replace currency code or symbol.
 * @param parts The formatter's formatToParts.
 * @param customCurrencyCodeOrSymbol The string that replaces the currency code or symbol. If the empty string,
 * the currency code or symbol will be removed.
 * @returns The parts with the 'currency' replaced or removed, and extra 'literal' whitespace removed.
 */
function replaceCurrencyParts(parts, customCurrencyCodeOrSymbol) {
    if (customCurrencyCodeOrSymbol !== '') {
        const partsWithCustomCurrency = parts.map((part) => {
            if (part.type === 'currency') {
                return { ...part, value: customCurrencyCodeOrSymbol };
            }
            else {
                return part;
            }
        });
        return partsWithCustomCurrency;
    }
    // This code gets called when the customCurrencyCode or customCurrencySymbol is ''.
    const processedPartsNoCurrency = removeCurrencyPart(parts);
    const processedParts = removeLiteralEmptyStringPart(processedPartsNoCurrency);
    return processedParts;
}
function removeCurrencyPart(parts) {
    return parts.filter((part) => part.type !== 'currency');
}
// Removes the empty string literal parts that might be left over after calling
// removeCurrencyPart.
// This is making the assumption, after analyzing formatToParts results, that
// the empty space is not within the number itself. It is around the currency symbol.
// Any sort of grouping separator is not reported as 'literal' even if the grouping symbol
// is a space.
// The parenthesis for accounting format are reported as 'literal', so we cannot
// simply look for all literals.
// Here is an example:
// format for locale fr is '-123 456,89 USD'
// The formatToParts is: "minusSign: '-', integer: '123', group: ' ', integer: '456', decimal: ',', fraction: '89', literal: ' ', currency: 'USD', "
// And when currencySign is accounting, it has this formatToParts
// "literal: '(', integer: '123', group: ' ', integer: '456', decimal: ',', fraction: '89', literal: ' ', currency: 'USD', literal: ')', "
function removeLiteralEmptyStringPart(parts) {
    return parts.filter((part) => !(part.type === 'literal' && part.value.trim() === ''));
}

/**
 * Uses formatToParts to replace the decimal and/or the group with the custom decimal and/or custom group.
 * @param formatInstance The Intl.NumberFormat instance.
 * @param value The value to pass into the formatInstance.formatToParts function.
 * @param decimal The custom decimal to replace the decimal part in formatInstance.formatToParts(value).
 * @param group The custom group to group the decimal part in formatInstance.formatToParts(value).
 * @returns The parts with the decimal and/or group replaced with the decimal and/or group passed into the function.
 * If no decimal and group is passed in, then this returns the formatInstance.formatToParts(value) with nothing replaced.
 */
function formatToPartsWithCustomSeparators(formatInstance, value, decimal, group) {
    if (decimal === undefined && group === undefined) {
        return formatInstance.formatToParts(value);
    }
    const parts = formatInstance.formatToParts(value);
    return parts.map((part) => {
        if (part.type === 'group') {
            return { ...part, value: group ?? part.value };
        }
        else if (part.type === 'decimal') {
            return { ...part, value: decimal ?? part.value };
        }
        else {
            return part;
        }
    });
}

class BigDecimalStringConverter {
    constructor(options) {
        const defaultOptions = options ?? { style: 'decimal' };
        const mo = getMergedNumberPreferencesWithOptions(defaultOptions);
        this.options = mo;
        this.locale = this.options.locale ?? getLocale();
    }
    /**
     * Formats a big decimal and returns the formatted string, using the options this converter was
     * initialized with.
     *
     * @param {string} value to be formatted for display
     * @return {string} the localized and formatted value suitable for display. When the value is
     * formatted as a percent it's multiplied by 100.
     *
     * @throws {Error} an error when both when formatting fails, or if the options provided during
     * initialization cannot be resolved correctly.
     * @memberof BigDecimalStringConverter
     * @instance
     * @method format
     */
    format(value) {
        if (typeof value !== 'string') {
            throw new Error('the value must be a string');
        }
        const parseResult = parse(value);
        const { native, resolved } = this._getResolvedAndNativeOptions();
        switch (resolved.style) {
            case 'decimal':
            case 'currency':
                const scale = native.notation === 'compact' ? 'compact' : null;
                return this._format(parseResult, native, scale);
            case 'percent':
                return this._format(parseResult, native, 'percent');
            case 'unit':
                return this._format(parseResult, native, resolved.unit);
        }
    }
    /**
     * Parses a string value to return a string representation of the number, using the options this converter was initialized with.
     *
     * @param {string} input to parse
     * @return {string} the string representation of the number
     * @throws {Error} an error when parsing fails, or when the options provided during
     * initialization cannot be resolved correctly.
     * @memberof BigDecimalStringConverter
     * @instance
     * @method parse
     */
    parse(input) {
        return parseInput(input, this.resolvedOptions(), this.locale);
    }
    /**
     * Returns an object literal with properties reflecting the number formatting options computed based
     * on the options parameter. If an option is not provided, the properties will be derived from the
     * locale defaults.
     * @return {Object} An object literal containing the resolved options.
     * @see BigDecimalStringConverter.ConverterOptions
     *
     * @throws an error when the options that the converter was initialized with are invalid.
     * @ojsignature {target:"Type", for: "returns",
     *    value: "BigDecimalStringConverter.ConverterOptions"}
     * @memberof BigDecimalStringConverter
     * @instance
     * @method resolvedOptions
     */
    resolvedOptions() {
        return this._getResolvedAndNativeOptions().resolved;
    }
    getHint() {
        return null;
    }
    _format(parseResult, baseOptions = {}, scale) {
        // When formatting, the number will be broken into separate pieces: the integer whole and the
        // fractional decimal.  Each piece will be formatted separately as an integer and then the
        // pieces will be "stitched" back together to form the final result.
        let derivedOptions = baseOptions;
        const resolvedOptions = this.resolvedOptions();
        const { minimumFractionDigits, maximumFractionDigits } = resolvedOptions;
        function getDisplayedFractionDigits(decimalCount) {
            return Math.min(Math.max(minimumFractionDigits, decimalCount), maximumFractionDigits);
        }
        let { decimal, whole, negative } = parseResult;
        if (scale === 'compact') {
            // scaleCompact() will figure out the eventual scale for the number (K, M, B, etc.), round
            // the number and then deal with a possible change of scale. It will then return and separate values
            // for the 'whole' and 'fraction' portions of the number. The 'whole' portion will be 'unscaled' back
            // (i.e. multiplied by a 1000 if the scale is K), so that the native NumberFormat can produce a correct
            // label for the scale.
            const { scaled } = scaleCompact(parseResult, getDisplayedFractionDigits, resolvedOptions);
            whole = scaled.whole;
            decimal = scaled.decimal;
        }
        else if (scale === 'percent') {
            // Percent values will be multiplied by 100 and rounded
            const scaled = scalePercent(parseResult, resolvedOptions, getDisplayedFractionDigits);
            whole = scaled.whole;
            decimal = scaled.decimal;
        }
        else if (scale === 'byte' || scale === 'bit') {
            // Values for the 'byte' and 'bit' units will be scaled and rounded similarly to those for the 'compact' notation,
            // but the 'whole' part will not be 'unscaled'. The native format does not apply any automatic scaling to these units,
            // and we are getting the 'scaled' unit (kB, mB, etc.) from the scaler
            const scaler = scale === 'byte' ? scaleBytes : scaleBits;
            const { scaled, unit } = scaler(parseResult, getDisplayedFractionDigits, resolvedOptions);
            whole = scaled.whole;
            decimal = scaled.decimal;
            derivedOptions = { ...derivedOptions, unit };
        }
        else {
            // regular decimal and currency values
            const displayedFractionDigits = getDisplayedFractionDigits(decimal.length);
            if (displayedFractionDigits < decimal.length) {
                const rounded = round({ negative, decimal, whole }, displayedFractionDigits, resolvedOptions.roundingMode);
                whole = rounded.whole;
                decimal = rounded.decimal;
            }
        }
        whole = whole || '0';
        if (scale !== 'percent') {
            return this._stitchFractionOnly(whole, decimal, negative, minimumFractionDigits, derivedOptions);
        }
        // Since the native Intl.NumberFormat multiplies percent values by 100, we cannot just 'stitch' only the fraction portion
        // of the number like we do for other scenarios.
        return this._stitchWholeAndFraction(whole, decimal, negative, minimumFractionDigits, derivedOptions);
    }
    _stitchFractionOnly(whole, decimal, negative, minimumFractionDigits, baseOptions = {}) {
        const options = this.options;
        // These options will be used to format a BigInt representing the 'whole' portion of the number
        // The fraction portion will be 'stitched in' later
        const opts = {
            ...baseOptions,
            minimumIntegerDigits: options.minimumIntegerDigits,
            minimumFractionDigits: minimumFractionDigits
        };
        opts.useGrouping = options.useGrouping;
        const isWholeZero = whole === '0';
        // We are using a regular JS number for when the whole number is 0 because BigInt has no concept of '-0',
        let wholeNum = isWholeZero ? 0 : BigInt(whole);
        if (negative) {
            wholeNum = -wholeNum;
        }
        if (!decimal) {
            // decimal is passed as a string
            let parts = formatToPartsWithCustomSeparators(new Intl.NumberFormat(this.locale, opts), wholeNum, options?.separators?.decimal, options?.separators?.group);
            parts = applyCustomCurrency(parts, this.options);
            let formatted = '';
            for (let part of parts) {
                formatted += `${part.value}`;
            }
            return formatted;
        }
        else {
            opts.minimumFractionDigits = 1; // this is just a placeholder that will be replaced by the actual fraction part
            let parts = formatToPartsWithCustomSeparators(new Intl.NumberFormat(this.locale, opts), wholeNum, options?.separators?.decimal, options?.separators?.group);
            parts = applyCustomCurrency(parts, this.options);
            // The fractional part of the number will be formatted separately as an integer and then
            // "stitched" back into the final result after the decimal separator.
            const fractionPart = this._getFractionPart(decimal, minimumFractionDigits);
            // options for the fraction part
            const decOpts = {
                useGrouping: false,
                minimumIntegerDigits: this._getMinimumIntegerDigitsForFraction(decimal.length)
            };
            const fraction = this._formatDecimalPart(decOpts, fractionPart, decimal.length);
            // replace the 'placeholder' fraction part with the previously formatted real one
            let formatted = '';
            for (let part of parts) {
                if (part.type === 'fraction') {
                    formatted += fraction;
                }
                else {
                    formatted += part.value;
                }
            }
            return formatted;
        }
    }
    _stitchWholeAndFraction(whole, decimal, negative, minimumFractionDigits, baseOptions = {}) {
        const options = this.options;
        const decLength = decimal.length;
        const hasFraction = decLength > 0 || minimumFractionDigits > 0;
        // Get the pattern used to stitch the integer and the fraction portions
        const patternOpts = {
            ...baseOptions,
            useGrouping: false,
            minimumFractionDigits: hasFraction ? Math.max(minimumFractionDigits, 1) : 0
        };
        const pattern = formatToPartsWithCustomSeparators(new Intl.NumberFormat(this.locale, patternOpts), negative ? -1 : 1, options?.separators?.decimal, options?.separators?.group);
        const intPartOpts = {
            minimumIntegerDigits: options.minimumIntegerDigits
        };
        intPartOpts.useGrouping = options.useGrouping;
        // Format the integer part on its own as a BigInt
        const formattedInt = this._formatWithCustomSeparators(new Intl.NumberFormat(this.locale, intPartOpts), BigInt(whole));
        let formattedFraction;
        if (decLength > 0) {
            // The fractional part of the number will be formatted separately as an integer and then
            // "stitched" back into the final result after the decimal separator.
            const fractionPart = this._getFractionPart(decimal, minimumFractionDigits);
            const decPartOpts = {
                useGrouping: false,
                minimumIntegerDigits: this._getMinimumIntegerDigitsForFraction(decLength)
            };
            formattedFraction = this._formatDecimalPart(decPartOpts, fractionPart, decLength);
        }
        // Replace both the 'fraction' and the 'integer' parts
        let formatted = '';
        for (let part of pattern) {
            const type = part.type;
            if (type === 'fraction') {
                formatted += formattedFraction ?? part.value;
            }
            else if (type === 'integer') {
                formatted += formattedInt;
            }
            else {
                formatted += part.value;
            }
        }
        return formatted;
    }
    _formatWithCustomSeparators(formatInstance, value) {
        const decimal = this.options?.separators?.decimal;
        const group = this.options?.separators?.group;
        if (decimal === undefined && group === undefined) {
            return formatInstance.format(value);
        }
        const parts = formatToPartsWithCustomSeparators(formatInstance, value, decimal, group);
        // take the parts and return the formatted string.
        let formatted = '';
        for (let part of parts) {
            formatted += part.value;
        }
        return formatted;
    }
    _getFractionPart(decimal, minimumFractionDigits) {
        // decimals are already guaranteed to have been shortened below maximumFractionDigits by rounding
        const exp = minimumFractionDigits - decimal.length;
        // add extra zeros to the fraction if minimumFractionDigits dictates it.
        // Note that empty string is OK since minimumIntegerDigits works in that case (we are formatting fractions as ints)
        return exp > 0 && decimal.length > 0 ? decimal + '0'.repeat(exp) : decimal;
    }
    _getMinimumIntegerDigitsForFraction(decimalLength) {
        // JET-66203 - BigDecimalConverter not honoring the maximumFractionDigits above 15
        // Maximum value of minimumIntegerDigits supported by Intl.NumberFormat is 20.
        // If 20 is not enough to preserve the leading zeros, we will re-add them in
        // _formatDecimalPart below.
        return Math.min(decimalLength, 20);
    }
    // Format the decimal part of the number AND pad it with missing leading zeros.
    _formatDecimalPart(decOpts, fractionPart, decimalLength) {
        // The fractional part of the number is formatted separately as an integer and then
        // "stitched" back into the final result after the decimal separator.
        let fraction = new Intl.NumberFormat(this.locale, decOpts).format(BigInt(fractionPart));
        const missingLeadingZeroCount = decimalLength - fraction.length;
        if (missingLeadingZeroCount > 0) {
            const formattedZero = new Intl.NumberFormat(this.locale).format(0);
            fraction = formattedZero.repeat(missingLeadingZeroCount) + fraction;
        }
        return fraction;
    }
    _getResolvedAndNativeOptions() {
        if (!this.cachedResolvedAndNativeOptions) {
            this.cachedResolvedAndNativeOptions = getResolvedAndNativeOptions(this.options, this.locale);
        }
        return this.cachedResolvedAndNativeOptions;
    }
}

class NumberConverter {
    constructor(options) {
        const defaultOptions = options ?? { style: 'decimal' };
        const mo = getMergedNumberPreferencesWithOptions(defaultOptions);
        this.options = mo;
        this.locale = this.options.locale ?? getLocale();
    }
    /**
     * Formats a number and returns the formatted string, using the options this converter was
     * initialized with.
     *
     * @param {number} value to be formatted for display
     * @return {string} the localized and formatted value suitable for display. When the value is
     * formatted as a percent it's multiplied by 100.
     *
     * @throws {Error} an error when both when formatting fails, or if the options provided during
     * initialization cannot be resolved correctly.
     * @memberof NumberConverter
     * @instance
     * @method format
     */
    format(value) {
        let valueToFormat = value;
        if (typeof valueToFormat !== 'number') {
            throw new Error('the value must be a number');
        }
        const { resolved, native } = this._getResolvedAndNativeOptions();
        const options = this.options;
        const numberNativeOpts = {
            ...native,
            minimumIntegerDigits: options.minimumIntegerDigits,
            minimumFractionDigits: options.minimumFractionDigits,
            maximumFractionDigits: options.maximumFractionDigits,
            useGrouping: options.useGrouping,
            roundingMode: getNativeRoundingMode(resolved)
        };
        if (resolved.style === 'unit') {
            const scaler = resolved.unit === 'bit' ? scaleBitsNumber : scaleBytesNumber;
            const { scaled, unit } = scaler(value, options);
            valueToFormat = scaled;
            numberNativeOpts.unit = unit;
        }
        const format = new Intl.NumberFormat(this.locale, numberNativeOpts);
        // Use formatToParts() to replace separators
        const decimal = options?.separators?.decimal;
        const group = options?.separators?.group;
        let parts = formatToPartsWithCustomSeparators(format, valueToFormat, decimal, group);
        // Use formatToParts() to replace currency code or symbol
        parts = applyCustomCurrency(parts, options);
        // stitch back together
        let formatted = '';
        for (let part of parts) {
            formatted += `${part.value}`;
        }
        return formatted;
    }
    /**
     * Parses a string value to return a number, using the options this converter was initialized with.
     *
     * @param {string} input to parse
     * @return {number} the parsed number
     * @throws {Error} an error when parsing fails, or when the options provided during
     * initialization cannot be resolved correctly.
     * @memberof NumberConverter
     * @instance
     * @method parse
     */
    parse(input) {
        return new Number(parseInput(input, this.resolvedOptions(), this.locale)).valueOf();
    }
    /**
     * Returns an object literal with properties reflecting the number formatting options computed based
     * on the options parameter. If an option is not provided, the properties will be derived from the
     * locale defaults.
     * @return {Object} An object literal containing the resolved options.
     *
     * @throws {Error} an error when the options that the converter was initialized with are invalid.
     * @ojsignature {target:"Type", for: "returns",
     *    value: "NumberConverter.ConverterOptions"}
     * @memberof NumberConverter
     * @instance
     * @method resolvedOptions
     */
    resolvedOptions() {
        return this._getResolvedAndNativeOptions().resolved;
    }
    getHint() {
        return null;
    }
    _getResolvedAndNativeOptions() {
        if (!this.cachedResolvedAndNativeOptions) {
            this.cachedResolvedAndNativeOptions = getResolvedAndNativeOptions(this.options, this.locale);
        }
        return this.cachedResolvedAndNativeOptions;
    }
}

const USER_INPUT_ERROR = 'userInput';

export { BigDecimalStringConverter, NumberConverter, USER_INPUT_ERROR };
