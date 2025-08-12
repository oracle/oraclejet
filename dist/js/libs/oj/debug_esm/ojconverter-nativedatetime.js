/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { getLocale } from 'ojs/ojconfig';
import { getFormatParse, normalizeIsoString, CalendarUtils, NativeParserImpl, DateTimeUtils, getISODateOffset, NativeDateTimeConstants } from '@oracle/oraclejet-preact/UNSAFE_IntlDateTime';
export { NativeParserImpl, getISODateOffset } from '@oracle/oraclejet-preact/UNSAFE_IntlDateTime';
import { warn } from 'ojs/ojlogger';
import { FormatParseError } from '@oracle/oraclejet-preact/UNSAFE_IntlFormatParse';
export { FormatParseError } from '@oracle/oraclejet-preact/UNSAFE_IntlFormatParse';

// Internal class that delegates to the browser's Intl.DateTimeFormat for formatting.
// This is not a public api
class NativeDateTimeConverter {
    constructor(options) {
        let opt = options ?? {};
        opt.locale = opt.locale ?? getLocale();
        const { format: formatterFunc, parse: parserFunc, resolvedOptions } = getFormatParse(opt);
        this.formatterFunc = formatterFunc;
        this.parserFunc = parserFunc;
        this.resOptions = resolvedOptions;
    }
    /**
     * Formats the iso string, and returns a formatted string.
     * @param value the iso string to be formatted into a string
     * @returns a formatted string, like 'December 14, 2021'
     * @throws Error if undefined, null, or '' or not an iso string, or if something went
     * wrong in the call to format.
     */
    format(value) {
        return this.formatterFunc(value);
    }
    /**
     * Parses the formatted string, and returns an iso string.
     * @param value a formatted string to be parsed into an iso string.
     * @returns an iso string
     * @throws Error if undefined, null, or '' or not an iso string, or if something went
     * wrong in the call to parse.
     */
    parse(str) {
        return this.parserFunc(str);
    }
    /**
     * Resolve options.
     * @returns resolvedOptions
     */
    resolvedOptions() {
        return this.resOptions;
    }
}

// The NativeDateTimePatternConverter is used when we have
// IntlDateTimeConverter's deprecated pattern option or when we have a pattern from
// FA's use preference date and time patterns.
// Intl.DateTimeFormat does not have a pattern option, so in the case where we must
// support a patten, we cannot use the preferred NativeDateTimeConverter.
class NativeDateTimePatternConverter {
    constructor(options) {
        this.intlFormatter = null;
        this.pattern = null;
        const processOptionsObj = NativeDateTimePatternConverter._processOptions(options);
        const processedOptions = processOptionsObj.opts;
        this.locale = processedOptions.locale ?? getLocale();
        this.intlFormatter = new Intl.DateTimeFormat(this.locale, processedOptions);
        this.resOptions = this.intlFormatter.resolvedOptions();
        this.resOptions.isoStrFormat = processedOptions.isoStrFormat || 'auto';
        this.resOptions.twoDigitYearStart = processedOptions.twoDigitYearStart || 1950;
        this.resOptions.lenientParse = processedOptions.lenientParse || 'full';
        this.formatTokens = processOptionsObj.formatTokens;
        this.pattern = options.pattern;
        this.timeZone = this.resOptions.timeZone;
    }
    // This method formats an isostring into a formatted string that matches a pattern.
    // This method throws Error if undefined, null, or '' or not an iso string, or if something went
    // wrong in the call to formatToParts.
    //
    // This method uses formatToParts and the tokens saved from the call to _getOptionsFromPattern
    // from the constructor to figure out the formatted string. See _getOptionsFromPattern for details of what the tokens mean
    // and how they are used to format an iso string to a formatted string that matches a pattern.
    //
    // This format method fills the tokensArray with actual values, for example format('2020-01-01T11:20:45').
    // tokensArray at the start of this method will contain something like:
    // [ null,	'-',	null,	'-',	null,	' ', null,	':',	null,	':',	null, ' ', 'null, null ]
    // make the content of tokensArray as follow:
    // [ '2020',	'-',	'01',	'-',	'01',	' ', '11',	':',	'20',	':',	45, ' ', 'America/Los_Angeles', ' (', '-08:00', ')' ]
    format(isostrvalue) {
        const isoStr = normalizeIsoString(this.timeZone, isostrvalue);
        var date = new Date(isoStr);
        // For details, see Intl.DateTimeFormat.formatToParts api doc.
        this.intlFormatter.formatToParts(date).map(({ type, value }) => {
            // literal is the string used for separating date and time values,
            // for example "/", ",", "o'clock", "de", etc.
            // Since we are using the literals from the pattern that we stored in formatTokens.tokensArray,
            // we can ignore these.
            if (type !== 'literal') {
                // E.g., if type is 'month', indexOfTypeInFormatToPartsArray is the index in the array
                // where month is. this is useful information for when we piece back the pieces into
                // the place it should be based on the pattern option.
                // E.g., if pattern is 'yyyy-MM-dd hh:mm:ss.SSS a', tokensIndexes is:
                // {day: 4, dayPeriod: 14, fractionalSecond: 12, hour: 6, minute: 8, month: 2, second: 10, year: 0}
                const indexOfTypeInPattern = this.formatTokens.tokensIndexes[type];
                if (indexOfTypeInPattern !== undefined) {
                    // tokensArray is what we are filling in.
                    // E.g., if type is 'month', and we know the index into the tokensArray for month is 2,
                    // fill the index 2 of tokensArray with the month (value from formatToParts for this type,
                    // so for example, if isostrvalue is '2013-12-01T18:00:00.123Z', and in our constructor
                    // we successfully returned the options for Intl.DateTimeFormat constructor to match the pattern,
                    // then this.intlFormatter.formatToParts(new Date('2013-12-01T18:00:00.123Z') will return
                    // value='12' for type='month')).
                    this.formatTokens.tokensArray[indexOfTypeInPattern] = value;
                }
            }
        });
        // process X, XX, XXX, Z, ZZ, ZZZ and VV tokens because they are not covered by formatToParts
        // tzOffsetArray will have a value if the pattern has one of these,
        // e.g., yyyy-MM-dd hh:mm:ss.SSS a zzzz (X)
        // This method will do nothing if tzOffsetsArray is empty.
        this._formatTimeZoneTokens(isoStr, this.timeZone);
        return this.formatTokens.tokensArray.join('');
    }
    /**
     * Parses the formatted string, and returns an iso string.
     * @param value a formatted string to be parsed into an iso string.
     * @returns an iso string
     * @throws Error if undefined, null, or '' or not an iso string, or if something went
     * wrong in the call to parse.
     */
    parse(str) {
        if (str === undefined || str === null || str === '') {
            throw new FormatParseError('The parse value cannot be empty.', {
                cause: { code: 'emptyParseValue' }
            });
        }
        const cal = CalendarUtils.getCalendar(this.locale, this.resOptions.calendar);
        // parseImpl might throw an error if the str cannot be parsed, and the converter that wraps
        // this one can transform it as they like.
        const result = NativeParserImpl.parseImpl(str, this.pattern, // NativeDateTimePatternConverter uses its own pattern here.
        this.resOptions, cal);
        const parsed = result.value;
        if (parsed) {
            if (result.warning) {
                warn('The value ' + str + ' was leniently parsed to represent a date ' + parsed);
            }
        }
        return parsed;
    }
    /**
     * Resolve options.
     * @returns resolvedOptions
     */
    resolvedOptions() {
        if (!this.resOptions.patternFromOptions) {
            this.resOptions.patternFromOptions = this.pattern;
        }
        return this.resOptions;
    }
    // Figure out the options from a pattern and then append some other options.
    // The final options can be used to create an instance of NativeDateTimeConverter/Intl.DateTimeFormat.
    static _processOptions(options) {
        const tokensObj = NativeDateTimePatternConverter._getOptionsFromPattern(options.pattern);
        if (options.timeZone) {
            tokensObj.opts.timeZone = options.timeZone;
        }
        if (options.hour12) {
            tokensObj.opts.hour12 = options.hour12;
        }
        // Always set numbering system to latn because IntlDateTimeConverter did not
        // support other numbering systems. Also the only supported calendar was gregory
        tokensObj.opts.numberingSystem = 'latn';
        tokensObj.opts.calendar = 'gregory';
        // the following attributes are not filled by getOptionsFromPattern, need to add them
        tokensObj.opts.isoStrFormat = options.isoStrFormat || 'auto';
        tokensObj.opts.twoDigitYearStart = options.twoDigitYearStart || 1950;
        tokensObj.opts.lenientParse = options.lenientParse || 'full';
        return tokensObj;
    }
    // process X, XX, XXX, Z, ZZ, ZZZ and VV tokens because they are not covered by formatToParts
    _formatTimeZoneTokens(isoStr, timeZone) {
        const formatTokens = this.formatTokens;
        for (var idx = 0; idx < formatTokens.tzOffsetsArray.length; idx++) {
            const key = formatTokens.tzOffsetsArray[idx];
            const index = formatTokens.tokensIndexes[key];
            if (key === 'tzid') {
                formatTokens.tokensArray[index] = timeZone;
                continue;
            }
            const parts = DateTimeUtils.IsoStrParts(isoStr);
            const dateParts = {
                year: parts[0],
                month: parts[1],
                date: parts[2],
                hours: parts[3],
                minutes: parts[4]
            };
            const offset = getISODateOffset(dateParts, this.resOptions.timeZone);
            var formatOffset = '';
            if (offset === 0) {
                formatTokens.tokensArray[index] = 'Z';
                continue;
            }
            switch (key) {
                case 'tzhm':
                    // Time zone hours minutes: -0800
                    formatOffset =
                        (offset < 0 ? '-' : '+') +
                            DateTimeUtils.padZeros(Math.floor(Math.abs(offset / 60)), 2) +
                            DateTimeUtils.padZeros(Math.floor(Math.abs(offset % 60)), 2);
                    break;
                case 'tzhsepm':
                    // Time zone hours minutes: -08:00
                    formatOffset =
                        (offset < 0 ? '-' : '+') +
                            DateTimeUtils.padZeros(Math.floor(Math.abs(offset / 60)), 2) +
                            ':' +
                            DateTimeUtils.padZeros(Math.floor(Math.abs(offset % 60)), 2);
                    break;
                case 'tzh':
                    // Time zone hours: -08
                    formatOffset =
                        (offset < 0 ? '-' : '+') +
                            DateTimeUtils.padZeros(Math.floor(Math.abs(offset / 60)), 2);
                    break;
                default:
                    break;
            }
            formatTokens.tokensArray[index] = formatOffset;
        }
    }
    // appends pre and post token match strings while removing escaped
    // characters. Returns a single quote count which is used to determine if the
    // token occurs in a string literal.
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
    /*
     * This method converts the pattern into options so that we can use IntlDateTimeFormat.formatToParts to format the pattern.
     * We parse the pattern and save the generated date-time tokens into an array. We also use a map that stores the location
     * of each token in the array. In format(value) we use formatToParts to place the actual values in the array by using the map.
     * This method returns an object with four attributes described below:
     * 1. tokensArray is an array that contains the tokens generated from the pattern
     *  For example if the pattern is  'MM-dd-YYYY hh:mm:ss VV (ZZZ)' tokensArray will be the following:
     * [ null,	'-',	null,	'-',	null,	' ',	null,	':',	null,	':',	null, ' ', null, ' (', null, ')'] The date-time tokens
     * positions in the array are null because they will be filled by actual values from format method.
     * 2. tzOffsetsArray is another array that holds timezone tokens because formatToParts cannot handle them,
     * these tokens are X, XX, XXX, Z, ZZ, ZZZ and VV. tzOffsetsArray will look like:
     * ['tzid', 'tzhsepm']
     * 3. tokensIndexes is an object that contain the index of each date-time token in the tokensArray. It
     * looks like this:
     * { month: 0, day: 2, year: 4, hour: 6, minute: 8, second: 10, tzid: 12, tzhsepm: 14}
     * 4. options are the ECMA options derived from the pattern and will be passed to the Intl.DateTimeFormat
     * constructor in our constructor. In this example the options will be:
     * {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-diigit', minute: '2-digit', second: '2-digit'}
     * ZZZ and VV do not generate options because they are not supported by Intl object. They will be processed
     * separately by formatTzTokens method.
     * The format method fill the tokensArray with actual values, for example format('2020-01-01T11:20:45') will
     * make the content of tokensArray as follow:
     * [ '2020',	'-',	'01',	'-',	'01',	' ', '11',	':',	'20',	':',	45, ' ', 'America/Los_Angeles', ' (', '-08:00', ')' ]
     */
    static _getOptionsFromPattern(pattern) {
        let quoteCount = 0;
        let pos = { count: 0 };
        let tzOffsetCount = 0;
        let tokensIndexes = {};
        let tokensArray = [];
        let options = {};
        let tzOffsetsArray = [];
        NativeDateTimeConstants._TOKEN_REGEXP.lastIndex = 0;
        for (;;) {
            // Save the current index
            let index = NativeDateTimeConstants._TOKEN_REGEXP.lastIndex;
            // Look for the next pattern
            const match = NativeDateTimeConstants._TOKEN_REGEXP.exec(pattern);
            // Append the text before the pattern (or the end of the string if
            // not found)
            const preMatch = pattern.slice(index, match ? match.index : pattern.length);
            quoteCount += NativeDateTimePatternConverter._appendPreOrPostMatch(preMatch, pos, tokensArray);
            if (!match) {
                break;
            }
            // do not replace any matches that occur inside a string literal.
            if (quoteCount % 2) {
                tokensArray.push(match[0]);
                pos.count++;
            }
            else {
                tokensArray.push(null);
                let m = match[0];
                if (NativeDateTimeConstants._PROPERTIES_MAP[m] !== undefined) {
                    const key = NativeDateTimeConstants._PROPERTIES_MAP[m].key;
                    const type = NativeDateTimeConstants._PROPERTIES_MAP[m].type;
                    if (key !== undefined) {
                        // In the new converter we use fractional second digits instead of
                        // millisecond.
                        if (key === 'millisecond') {
                            options[NativeDateTimeConstants.FRACTIONAL_SECOND_MAP[m].key] =
                                NativeDateTimeConstants.FRACTIONAL_SECOND_MAP[m].value;
                            tokensIndexes[NativeDateTimeConstants.FRACTIONAL_SECOND_MAP[m].token] = pos.count++;
                        }
                        else if (type === 'tzOffset') {
                            tzOffsetsArray[tzOffsetCount] = key;
                            tokensIndexes[key] = pos.count++;
                            tzOffsetCount++;
                        }
                        else {
                            options[key] = NativeDateTimeConstants._PROPERTIES_MAP[m].value;
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

export { NativeDateTimeConverter, NativeDateTimePatternConverter };
