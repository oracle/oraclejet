/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojconfig', 'ojs/ojconverter-preferences'], function (exports, ojconfig, ojconverterPreferences) { 'use strict';

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
                decimal = num;
            }
            else {
                whole = num;
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
        return {
            localToAsciiNumbers,
            decimalSeparator,
            negativeSign,
            positiveSign,
            percentSign,
            exponentSeparator
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
    function _getSign(locale, positive) {
        const opts = { signDisplay: 'always' };
        return positive
            ? _getPart(locale, opts, 1, 'plusSign', '+')
            : _getPart(locale, opts, -1, 'minusSign', '-');
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
        let { whole, negative, decimal } = parseResult;
        const decLength = decimal.length;
        const digitsToCut = decLength - displayedFractionDigits;
        if (digitsToCut > 0) {
            const digits = (whole || '0') + decimal;
            const rounded = [];
            let i1 = digits.length - 2;
            let second = parseInt(digits[i1 + 1]);
            for (let cut = 0; i1 >= 0; i1--) {
                let first = parseInt(digits[i1]);
                const cutting = cut < digitsToCut;
                if (second === 10) {
                    second = 0;
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
            case 'CEILING':
            case 'FLOOR':
                return first + 1;
            default:
                throw new Error('Invalid rounding mode ' + roundingMode);
        }
    }

    const _ASCII_NUMBER_CHARS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
    function parseInput(input, resolvedOptions, locale) {
        const localeData = getLocaleData(locale);
        const { decimal, group } = resolvedOptions.separators;
        const { negativeSign, positiveSign, percentSign, localToAsciiNumbers, exponentSeparator } = localeData;
        let exponent = 0;
        let buffer = '';
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
                    ...common
                };
                break;
            case 'currency':
                resolved = {
                    style: 'currency',
                    currency: options.currency,
                    currencyFormat: options.currencyFormat ?? 'standard',
                    currencyDisplay: options.currencyDisplay ?? 'symbol',
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
            currencyDisplay: options.currencyDisplay ?? 'symbol'
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
        const scaled = multiplyCoefficient({ whole, decimal }, 2);
        return round({ whole: scaled.whole, decimal: scaled.decimal, negative }, getDisplayedFractionDigits(scaled.decimal.length), resolvedOptions.roundingMode);
    }
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
        const format = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: options.minimumFractionDigits,
            maximumFractionDigits: options.maximumFractionDigits,
            useGrouping: false
        });
        format.roundingMode = getNativeRoundingMode(options);
        const scaleCount = thresholds.length;
        let scaleIndex = -1;
        for (let i = 0; i < scaleCount && value >= thresholds[i]; i++, scaleIndex++)
            ;
        let exponent = -3 * (scaleIndex + 1);
        let scaled = value * 10 ** exponent;
        let rounded = parseFloat(format.format(scaled));
        if (scaleIndex < scaleCount - 1 && rounded === thresholds[scaleIndex]) {
            scaleIndex++;
            exponent -= 3;
            scaled = value * 10 ** exponent;
        }
        return { scaled, scaleIndex: scaleIndex + 1 };
    }

    class BigDecimalStringConverter {
        constructor(options) {
            const defaultOptions = options ?? { style: 'decimal' };
            const mo = ojconverterPreferences.getMergedNumberPreferencesWithOptions(defaultOptions);
            this.options = mo;
            this.locale = this.options.locale ?? ojconfig.getLocale();
        }
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
        parse(input) {
            return parseInput(input, this.resolvedOptions(), this.locale);
        }
        resolvedOptions() {
            return this._getResolvedAndNativeOptions().resolved;
        }
        getHint() {
            return null;
        }
        _format(parseResult, baseOptions = {}, scale) {
            let derivedOptions = baseOptions;
            const resolvedOptions = this.resolvedOptions();
            const { minimumFractionDigits, maximumFractionDigits } = resolvedOptions;
            function getDisplayedFractionDigits(decimalCount) {
                return Math.min(Math.max(minimumFractionDigits, decimalCount), maximumFractionDigits);
            }
            let { decimal, whole, negative } = parseResult;
            if (scale === 'compact') {
                const { scaled } = scaleCompact(parseResult, getDisplayedFractionDigits, resolvedOptions);
                whole = scaled.whole;
                decimal = scaled.decimal;
            }
            else if (scale === 'percent') {
                const scaled = scalePercent(parseResult, resolvedOptions, getDisplayedFractionDigits);
                whole = scaled.whole;
                decimal = scaled.decimal;
            }
            else if (scale === 'byte' || scale === 'bit') {
                const scaler = scale === 'byte' ? scaleBytes : scaleBits;
                const { scaled, unit } = scaler(parseResult, getDisplayedFractionDigits, resolvedOptions);
                whole = scaled.whole;
                decimal = scaled.decimal;
                derivedOptions = { ...derivedOptions, unit };
            }
            else {
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
            return this._stitchWholeAndFraction(whole, decimal, negative, minimumFractionDigits, derivedOptions);
        }
        _stitchFractionOnly(whole, decimal, negative, minimumFractionDigits, baseOptions = {}) {
            const options = this.options;
            const opts = {
                ...baseOptions,
                minimumIntegerDigits: options.minimumIntegerDigits,
                minimumFractionDigits: minimumFractionDigits
            };
            opts.useGrouping = options.useGrouping;
            const isWholeZero = whole === '0';
            let wholeNum = isWholeZero ? 0 : BigInt(whole);
            if (negative) {
                wholeNum = -wholeNum;
            }
            if (!decimal) {
                return this._formatWithCustomSeparators(new Intl.NumberFormat(this.locale, opts), wholeNum);
            }
            else {
                opts.minimumFractionDigits = 1;
                const parts = this._formatToPartsWithCustomSeparators(new Intl.NumberFormat(this.locale, opts), wholeNum);
                const fractionPart = this._getFractionPart(decimal, minimumFractionDigits);
                const decOpts = {
                    useGrouping: false,
                    minimumIntegerDigits: this._getMinimumIntegerDigitsForFraction(decimal.length)
                };
                const fraction = this._formatDecimalPart(decOpts, fractionPart, decimal.length);
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
            const patternOpts = {
                ...baseOptions,
                useGrouping: false,
                minimumFractionDigits: hasFraction ? Math.max(minimumFractionDigits, 1) : 0
            };
            const pattern = this._formatToPartsWithCustomSeparators(new Intl.NumberFormat(this.locale, patternOpts), negative ? -1 : 1);
            const intPartOpts = {
                minimumIntegerDigits: options.minimumIntegerDigits
            };
            intPartOpts.useGrouping = options.useGrouping;
            const formattedInt = this._formatWithCustomSeparators(new Intl.NumberFormat(this.locale, intPartOpts), BigInt(whole));
            let formattedFraction;
            if (decLength > 0) {
                const fractionPart = this._getFractionPart(decimal, minimumFractionDigits);
                const decPartOpts = {
                    useGrouping: false,
                    minimumIntegerDigits: this._getMinimumIntegerDigitsForFraction(decLength)
                };
                formattedFraction = this._formatDecimalPart(decPartOpts, fractionPart, decLength);
            }
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
            const parts = formatInstance.formatToParts(value);
            let formatted = '';
            for (let part of parts) {
                if (part.type === 'group') {
                    formatted += group ?? part.value;
                }
                else if (part.type === 'decimal') {
                    formatted += decimal ?? part.value;
                }
                else {
                    formatted += part.value;
                }
            }
            return formatted;
        }
        _formatToPartsWithCustomSeparators(formatInstance, value) {
            const decimal = this.options?.separators?.decimal;
            const group = this.options?.separators?.group;
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
        _getFractionPart(decimal, minimumFractionDigits) {
            const exp = minimumFractionDigits - decimal.length;
            return exp > 0 && decimal.length > 0 ? decimal + '0'.repeat(exp) : decimal;
        }
        _getMinimumIntegerDigitsForFraction(decimalLength) {
            return Math.min(decimalLength, 20);
        }
        _formatDecimalPart(decOpts, fractionPart, decimalLength) {
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
            const mo = ojconverterPreferences.getMergedNumberPreferencesWithOptions(defaultOptions);
            this.options = mo;
            this.locale = this.options.locale ?? ojconfig.getLocale();
        }
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
            if (options.separators) {
                const decimal = options?.separators?.decimal;
                const group = options?.separators?.group;
                if (decimal === undefined && group === undefined) {
                    return format.format(valueToFormat);
                }
                const parts = format.formatToParts(valueToFormat);
                return parts.reduce((acc, part) => {
                    if (part.type === 'group') {
                        return acc + (group ?? part.value);
                    }
                    else if (part.type === 'decimal') {
                        return acc + (decimal ?? part.value);
                    }
                    else {
                        return acc + part.value;
                    }
                }, '');
            }
            return format.format(valueToFormat);
        }
        parse(input) {
            return new Number(parseInput(input, this.resolvedOptions(), this.locale)).valueOf();
        }
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

    exports.BigDecimalStringConverter = BigDecimalStringConverter;
    exports.NumberConverter = NumberConverter;
    exports.USER_INPUT_ERROR = USER_INPUT_ERROR;

    Object.defineProperty(exports, '__esModule', { value: true });

});
