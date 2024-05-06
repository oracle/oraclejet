/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojconfig', '@oracle/oraclejet-preact/UNSAFE_IntlDateTime', 'ojs/ojlogger', '@oracle/oraclejet-preact/UNSAFE_IntlFormatParse'], function (exports, ojconfig, UNSAFE_IntlDateTime, Logger, UNSAFE_IntlFormatParse) { 'use strict';

    class NativeDateTimeConverter {
        constructor(options) {
            let opt = options ?? {};
            opt.locale = opt.locale ?? ojconfig.getLocale();
            const { format: formatterFunc, parse: parserFunc, resolvedOptions } = UNSAFE_IntlDateTime.getFormatParse(opt);
            this.formatterFunc = formatterFunc;
            this.parserFunc = parserFunc;
            this.resOptions = resolvedOptions;
        }
        format(value) {
            return this.formatterFunc(value);
        }
        parse(str) {
            return this.parserFunc(str);
        }
        resolvedOptions() {
            return this.resOptions;
        }
    }

    class NativeDateTimePatternConverter {
        constructor(options) {
            this.intlFormatter = null;
            this.pattern = null;
            const processOptionsObj = NativeDateTimePatternConverter._processOptions(options);
            const processedOptions = processOptionsObj.opts;
            this.locale = processedOptions.locale ?? ojconfig.getLocale();
            this.intlFormatter = new Intl.DateTimeFormat(this.locale, processedOptions);
            this.resOptions = this.intlFormatter.resolvedOptions();
            this.resOptions.isoStrFormat = processedOptions.isoStrFormat || 'auto';
            this.resOptions.twoDigitYearStart = processedOptions.twoDigitYearStart || 1950;
            this.resOptions.lenientParse = processedOptions.lenientParse || 'full';
            this.formatTokens = processOptionsObj.formatTokens;
            this.pattern = options.pattern;
            this.timeZone = this.resOptions.timeZone;
        }
        format(isostrvalue) {
            const isoStr = UNSAFE_IntlDateTime.normalizeIsoString(this.timeZone, isostrvalue);
            var date = new Date(isoStr);
            this.intlFormatter.formatToParts(date).map(({ type, value }) => {
                if (type !== 'literal') {
                    const indexOfTypeInPattern = this.formatTokens.tokensIndexes[type];
                    if (indexOfTypeInPattern !== undefined) {
                        this.formatTokens.tokensArray[indexOfTypeInPattern] = value;
                    }
                }
            });
            this._formatTimeZoneTokens(isoStr, this.timeZone);
            return this.formatTokens.tokensArray.join('');
        }
        parse(str) {
            if (str === undefined || str === null || str === '') {
                throw new UNSAFE_IntlFormatParse.FormatParseError('The parse value cannot be empty.', {
                    cause: { code: 'emptyParseValue' }
                });
            }
            const cal = UNSAFE_IntlDateTime.CalendarUtils.getCalendar(this.locale, this.resOptions.calendar);
            const result = UNSAFE_IntlDateTime.NativeParserImpl.parseImpl(str, this.pattern, this.resOptions, cal);
            const parsed = result.value;
            if (parsed) {
                if (result.warning) {
                    Logger.warn('The value ' + str + ' was leniently parsed to represent a date ' + parsed);
                }
            }
            return parsed;
        }
        resolvedOptions() {
            if (!this.resOptions.patternFromOptions) {
                this.resOptions.patternFromOptions = this.pattern;
            }
            return this.resOptions;
        }
        static _processOptions(options) {
            const tokensObj = NativeDateTimePatternConverter._getOptionsFromPattern(options.pattern);
            if (options.timeZone) {
                tokensObj.opts.timeZone = options.timeZone;
            }
            if (options.hour12) {
                tokensObj.opts.hour12 = options.hour12;
            }
            tokensObj.opts.numberingSystem = 'latn';
            tokensObj.opts.calendar = 'gregory';
            tokensObj.opts.isoStrFormat = options.isoStrFormat || 'auto';
            tokensObj.opts.twoDigitYearStart = options.twoDigitYearStart || 1950;
            tokensObj.opts.lenientParse = options.lenientParse || 'full';
            return tokensObj;
        }
        _formatTimeZoneTokens(isoStr, timeZone) {
            const formatTokens = this.formatTokens;
            for (var idx = 0; idx < formatTokens.tzOffsetsArray.length; idx++) {
                const key = formatTokens.tzOffsetsArray[idx];
                const index = formatTokens.tokensIndexes[key];
                if (key === 'tzid') {
                    formatTokens.tokensArray[index] = timeZone;
                    continue;
                }
                const parts = UNSAFE_IntlDateTime.DateTimeUtils.IsoStrParts(isoStr);
                const dateParts = {
                    year: parts[0],
                    month: parts[1],
                    date: parts[2],
                    hours: parts[3],
                    minutes: parts[4]
                };
                const offset = UNSAFE_IntlDateTime.getISODateOffset(dateParts, this.resOptions.timeZone);
                var formatOffset = '';
                if (offset === 0) {
                    formatTokens.tokensArray[index] = 'Z';
                    continue;
                }
                switch (key) {
                    case 'tzhm':
                        formatOffset =
                            (offset < 0 ? '-' : '+') +
                                UNSAFE_IntlDateTime.DateTimeUtils.padZeros(Math.floor(Math.abs(offset / 60)), 2) +
                                UNSAFE_IntlDateTime.DateTimeUtils.padZeros(Math.floor(Math.abs(offset % 60)), 2);
                        break;
                    case 'tzhsepm':
                        formatOffset =
                            (offset < 0 ? '-' : '+') +
                                UNSAFE_IntlDateTime.DateTimeUtils.padZeros(Math.floor(Math.abs(offset / 60)), 2) +
                                ':' +
                                UNSAFE_IntlDateTime.DateTimeUtils.padZeros(Math.floor(Math.abs(offset % 60)), 2);
                        break;
                    case 'tzh':
                        formatOffset =
                            (offset < 0 ? '-' : '+') +
                                UNSAFE_IntlDateTime.DateTimeUtils.padZeros(Math.floor(Math.abs(offset / 60)), 2);
                        break;
                    default:
                        break;
                }
                formatTokens.tokensArray[index] = formatOffset;
            }
        }
        static _appendPreOrPostMatch(preMatch, pos, tokensArray) {
            let quoteCount = 0;
            let escaped = false;
            for (var i = 0, il = preMatch.length; i < il; i++) {
                var c = preMatch.charAt(i);
                switch (c) {
                    case "'":
                        if (escaped) {
                            tokensArray.push("'");
                            pos.count++;
                        }
                        else {
                            quoteCount += 1;
                        }
                        escaped = false;
                        break;
                    case '\\':
                        if (escaped) {
                            tokensArray.push('\\');
                            pos.count++;
                        }
                        escaped = !escaped;
                        break;
                    default:
                        tokensArray.push(c);
                        escaped = false;
                        pos.count++;
                        break;
                }
            }
            return quoteCount;
        }
        static _getOptionsFromPattern(pattern) {
            let quoteCount = 0;
            let pos = { count: 0 };
            let tzOffsetCount = 0;
            let tokensIndexes = {};
            let tokensArray = [];
            let options = {};
            let tzOffsetsArray = [];
            UNSAFE_IntlDateTime.NativeDateTimeConstants._TOKEN_REGEXP.lastIndex = 0;
            for (;;) {
                let index = UNSAFE_IntlDateTime.NativeDateTimeConstants._TOKEN_REGEXP.lastIndex;
                const match = UNSAFE_IntlDateTime.NativeDateTimeConstants._TOKEN_REGEXP.exec(pattern);
                const preMatch = pattern.slice(index, match ? match.index : pattern.length);
                quoteCount += NativeDateTimePatternConverter._appendPreOrPostMatch(preMatch, pos, tokensArray);
                if (!match) {
                    break;
                }
                if (quoteCount % 2) {
                    tokensArray.push(match[0]);
                    pos.count++;
                }
                else {
                    tokensArray.push(null);
                    let m = match[0];
                    if (UNSAFE_IntlDateTime.NativeDateTimeConstants._PROPERTIES_MAP[m] !== undefined) {
                        const key = UNSAFE_IntlDateTime.NativeDateTimeConstants._PROPERTIES_MAP[m].key;
                        const type = UNSAFE_IntlDateTime.NativeDateTimeConstants._PROPERTIES_MAP[m].type;
                        if (key !== undefined) {
                            if (key === 'millisecond') {
                                options[UNSAFE_IntlDateTime.NativeDateTimeConstants.FRACTIONAL_SECOND_MAP[m].key] =
                                    UNSAFE_IntlDateTime.NativeDateTimeConstants.FRACTIONAL_SECOND_MAP[m].value;
                                tokensIndexes[UNSAFE_IntlDateTime.NativeDateTimeConstants.FRACTIONAL_SECOND_MAP[m].token] = pos.count++;
                            }
                            else if (type === 'tzOffset') {
                                tzOffsetsArray[tzOffsetCount] = key;
                                tokensIndexes[key] = pos.count++;
                                tzOffsetCount++;
                            }
                            else {
                                options[key] = UNSAFE_IntlDateTime.NativeDateTimeConstants._PROPERTIES_MAP[m].value;
                                tokensIndexes[key] = pos.count++;
                            }
                        }
                        if (m === 'KK' || m === 'K') {
                            options.hourCycle = 'h11';
                        }
                        else if (m === 'kk' || m === 'k') {
                            options.hourCycle = 'h24';
                        }
                        else if (m === 'HH' || m === 'H') {
                            options.hourCycle = 'h23';
                        }
                        else if (m === 'hh' || m === 'h') {
                            options.hourCycle = 'h12';
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            return {
                opts: options,
                formatTokens: {
                    tokensArray: tokensArray,
                    tzOffsetsArray: tzOffsetsArray,
                    tokensIndexes: tokensIndexes
                }
            };
        }
    }

    Object.defineProperty(exports, 'NativeParserImpl', {
        enumerable: true,
        get: function () {
            return UNSAFE_IntlDateTime.NativeParserImpl;
        }
    });
    Object.defineProperty(exports, 'getISODateOffset', {
        enumerable: true,
        get: function () {
            return UNSAFE_IntlDateTime.getISODateOffset;
        }
    });
    Object.defineProperty(exports, 'FormatParseError', {
        enumerable: true,
        get: function () {
            return UNSAFE_IntlFormatParse.FormatParseError;
        }
    });
    exports.NativeDateTimeConverter = NativeDateTimeConverter;
    exports.NativeDateTimePatternConverter = NativeDateTimePatternConverter;

    Object.defineProperty(exports, '__esModule', { value: true });

});
