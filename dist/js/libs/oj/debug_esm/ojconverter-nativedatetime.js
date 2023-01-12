/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { warn } from 'ojs/ojlogger';
import { getLocale } from 'ojs/ojconfig';
import { __getBundle } from 'ojs/ojlocaledata';
import { IntlConverterUtils as IntlConverterUtils$1, OraI18nUtils } from 'ojs/ojconverterutils-i18n';
import { getTranslatedString } from 'ojs/ojtranslation';
import oj from 'ojs/ojcore-base';
import { CalendarUtils } from 'ojs/ojcalendarutils';
import { getDateTimePreferences } from 'ojs/ojconverter-preferences';

class NativeDateTimeConstants {
}
NativeDateTimeConstants._YEAR_AND_DATE_REGEXP = /(\d{1,4})\D+?(\d{1,4})/g;
NativeDateTimeConstants._YMD_REGEXP = /(\d{1,4})\D+?(\d{1,4})\D+?(\d{1,4})/g;
NativeDateTimeConstants._TIME_REGEXP = /(\d{1,2})(?:\D(\d{1,2}))?(?:\D(\d{1,2}))?(?:\D(\d{1,3}))?/g;
NativeDateTimeConstants._TIME_FORMAT_REGEXP = /h|H|K|k/g;
NativeDateTimeConstants._YEAR_REGEXP = /y{1,4}/;
NativeDateTimeConstants._MONTH_REGEXP = /M{1,5}/;
NativeDateTimeConstants._DAY_REGEXP = /d{1,2}/;
NativeDateTimeConstants._WEEK_DAY_REGEXP = /E{1,5}/;
NativeDateTimeConstants._HOUR_REGEXP = /h{1,2}|k{1,2}/i;
NativeDateTimeConstants._MINUTE_REGEXP = /m{1,2}/;
NativeDateTimeConstants._SECOND_REGEXP = /s{1,2}/;
NativeDateTimeConstants._FRACTIONAL_SECOND_REGEXP = /S{1,3}/;
NativeDateTimeConstants._AMPM_REGEXP = /a{1,2}/;
NativeDateTimeConstants._WORD_REGEXP = '(\\D+?\\s*)';
NativeDateTimeConstants._ESCAPE_REGEXP = /([\^$.*+?|\[\](){}])/g;
NativeDateTimeConstants._TOKEN_REGEXP = /ccccc|cccc|ccc|cc|c|EEEEE|EEEE|EEE|EE|E|dd|d|MMMMM|MMMM|MMM|MM|M|LLLLL|LLLL|LLL|LL|L|yyyy|yy|y|hh|h|HH|H|KK|K|kk|k|mm|m|ss|s|aa|a|SSS|SS|S|zzzz|zzz|zz|z|v|ZZZ|ZZ|Z|XXX|XX|X|VV|GGGGG|GGGG|GGG|GG|G/g;
NativeDateTimeConstants._ZULU = 'zulu';
NativeDateTimeConstants._LOCAL = 'local';
NativeDateTimeConstants._AUTO = 'auto';
NativeDateTimeConstants._INVARIANT = 'invariant';
NativeDateTimeConstants._OFFSET = 'offset';
NativeDateTimeConstants._ALNUM_REGEXP = '(\\D+|\\d\\d?\\D|\\d\\d?|\\D+\\d\\d?)';
NativeDateTimeConstants._NON_DIGIT_REGEXP = '(\\D+|\\D+\\d\\d?)';
NativeDateTimeConstants._NON_DIGIT_OPT_REGEXP = '(\\D*)';
NativeDateTimeConstants._STR_REGEXP = '(.+?)';
NativeDateTimeConstants._TWO_DIGITS_REGEXP = '(\\d\\d?)';
NativeDateTimeConstants._THREE_DIGITS_REGEXP = '(\\d{1,3})';
NativeDateTimeConstants._FOUR_DIGITS_REGEXP = '(\\d{1,4})';
NativeDateTimeConstants._SLASH_REGEXP = '(\\/)';
NativeDateTimeConstants._PROPERTIES_MAP = {
    MMM: {
        token: 'months',
        style: 'format',
        mLen: 'abbreviated',
        matchIndex: 0,
        key: 'month',
        value: 'short',
        regExp: NativeDateTimeConstants._ALNUM_REGEXP
    },
    MMMM: {
        token: 'months',
        style: 'format',
        mLen: 'wide',
        matchIndex: 0,
        key: 'month',
        value: 'long',
        regExp: NativeDateTimeConstants._ALNUM_REGEXP
    },
    MMMMM: {
        token: 'months',
        style: 'format',
        mLen: 'narrow',
        matchIndex: 0,
        key: 'month',
        value: 'narrow',
        regExp: NativeDateTimeConstants._ALNUM_REGEXP
    },
    LLL: {
        token: 'months',
        style: 'stand-alone',
        mLen: 'abbreviated',
        matchIndex: 1,
        key: 'month',
        value: 'short',
        regExp: NativeDateTimeConstants._ALNUM_REGEXP
    },
    LLLL: {
        token: 'months',
        style: 'stand-alone',
        mLen: 'wide',
        matchIndex: 1,
        key: 'month',
        value: 'long',
        regExp: NativeDateTimeConstants._ALNUM_REGEXP
    },
    LLLLL: {
        token: 'months',
        style: 'stand-alone',
        mLen: 'narrow',
        matchIndex: 1,
        key: 'month',
        value: 'narrow',
        regExp: NativeDateTimeConstants._ALNUM_REGEXP
    },
    E: {
        token: 'days',
        style: 'format',
        dLen: 'abbreviated',
        matchIndex: 0,
        key: 'weekday',
        value: 'short',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    EE: {
        token: 'days',
        style: 'format',
        dLen: 'abbreviated',
        matchIndex: 0,
        key: 'weekday',
        value: 'short',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    EEE: {
        token: 'days',
        style: 'format',
        dLen: 'abbreviated',
        matchIndex: 0,
        key: 'weekday',
        value: 'short',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    EEEE: {
        token: 'days',
        style: 'format',
        dLen: 'wide',
        matchIndex: 0,
        key: 'weekday',
        value: 'long',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    EEEEE: {
        token: 'days',
        style: 'format',
        dLen: 'narrow',
        matchIndex: 0,
        key: 'weekday',
        value: 'narrow',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    c: {
        token: 'days',
        style: 'stand-alone',
        dLen: 'abbreviated',
        matchIndex: 1,
        key: 'weekday',
        value: 'short',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    cc: {
        token: 'days',
        style: 'stand-alone',
        dLen: 'abbreviated',
        matchIndex: 1,
        key: 'weekday',
        value: 'short',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    ccc: {
        token: 'days',
        style: 'stand-alone',
        dLen: 'abbreviated',
        matchIndex: 1,
        key: 'weekday',
        value: 'short',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    cccc: {
        token: 'days',
        style: 'stand-alone',
        dLen: 'wide',
        matchIndex: 1,
        key: 'weekday',
        value: 'long',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    ccccc: {
        token: 'days',
        style: 'stand-alone',
        dLen: 'narrow',
        matchIndex: 1,
        key: 'weekday',
        value: 'narrow',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    h: {
        token: 'time',
        timePart: 'hour',
        start1: 0,
        end1: 11,
        start2: 1,
        end2: 12,
        key: 'hour',
        value: 'numeric',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    hh: {
        token: 'time',
        timePart: 'hour',
        start1: 0,
        end1: 11,
        start2: 1,
        end2: 12,
        key: 'hour',
        value: '2-digit',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    K: {
        token: 'time',
        timePart: 'hour',
        start1: 0,
        end1: 12,
        start2: 0,
        end2: 12,
        key: 'hour',
        value: 'numeric',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    KK: {
        token: 'time',
        timePart: 'hour',
        start1: 0,
        end1: 12,
        start2: 0,
        end2: 12,
        key: 'hour',
        value: '2-digit',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    H: {
        token: 'time',
        timePart: 'hour',
        start1: 0,
        end1: 23,
        start2: 0,
        end2: 23,
        key: 'hour',
        value: 'numeric',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    HH: {
        token: 'time',
        timePart: 'hour',
        start1: 0,
        end1: 23,
        start2: 0,
        end2: 23,
        key: 'hour',
        value: '2-digit',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    k: {
        token: 'time',
        timePart: 'hour',
        start1: 0,
        end1: 24,
        start2: 0,
        end2: 24,
        key: 'hour',
        value: 'numeric',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    kk: {
        token: 'time',
        timePart: 'hour',
        start1: 0,
        end1: 24,
        start2: 0,
        end2: 24,
        key: 'hour',
        value: '2-digit',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    m: {
        token: 'time',
        timePart: 'minute',
        start1: 0,
        end1: 59,
        start2: 0,
        end2: 59,
        key: 'minute',
        value: 'numeric',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    mm: {
        token: 'time',
        timePart: 'minute',
        start1: 0,
        end1: 59,
        start2: 0,
        end2: 59,
        key: 'minute',
        value: '2-digit',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    s: {
        token: 'time',
        timePart: 'second',
        start1: 0,
        end1: 59,
        start2: 0,
        end2: 59,
        key: 'second',
        value: 'numeric',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    ss: {
        token: 'time',
        timePart: 'second',
        start1: 0,
        end1: 59,
        start2: 0,
        end2: 59,
        key: 'second',
        value: '2-digit',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    S: {
        token: 'time',
        timePart: 'millisec',
        start1: 0,
        end1: 999,
        start2: 0,
        end2: 999,
        key: 'millisecond',
        value: 'numeric',
        regExp: NativeDateTimeConstants._THREE_DIGITS_REGEXP
    },
    SS: {
        token: 'time',
        timePart: 'millisec',
        start1: 0,
        end1: 999,
        start2: 0,
        end2: 999,
        key: 'millisecond',
        value: 'numeric',
        regExp: NativeDateTimeConstants._THREE_DIGITS_REGEXP
    },
    SSS: {
        token: 'time',
        timePart: 'millisec',
        start1: 0,
        end1: 999,
        start2: 0,
        end2: 999,
        key: 'millisecond',
        value: 'numeric',
        regExp: NativeDateTimeConstants._THREE_DIGITS_REGEXP
    },
    d: {
        token: 'dayOfMonth',
        key: 'day',
        value: 'numeric',
        getPartIdx: 2,
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    dd: {
        token: 'dayOfMonth',
        key: 'day',
        value: '2-digit',
        getPartIdx: 2,
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    M: {
        token: 'monthIndex',
        key: 'month',
        value: 'numeric',
        getPartIdx: 1,
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    MM: {
        token: 'monthIndex',
        key: 'month',
        value: '2-digit',
        getPartIdx: 1,
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    L: {
        token: 'monthIndex',
        key: 'month',
        value: 'numeric',
        getPartIdx: 1,
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    LL: {
        token: 'monthIndex',
        key: 'month',
        value: '2-digit',
        getPartIdx: 1,
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    y: {
        token: 'year',
        key: 'year',
        value: 'numeric',
        regExp: NativeDateTimeConstants._FOUR_DIGITS_REGEXP
    },
    yy: {
        token: 'year',
        key: 'year',
        value: '2-digit',
        regExp: NativeDateTimeConstants._TWO_DIGITS_REGEXP
    },
    yyyy: {
        token: 'year',
        key: 'year',
        value: 'numeric',
        regExp: NativeDateTimeConstants._FOUR_DIGITS_REGEXP
    },
    a: {
        token: 'ampm',
        key: 'dayPeriod',
        value: undefined,
        regExp: NativeDateTimeConstants._WORD_REGEXP
    },
    z: {
        token: 'tzAbbrev',
        key: 'timeZoneName',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP
    },
    v: {
        token: 'tzAbbrev',
        key: 'timeZoneName',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP
    },
    zz: {
        token: 'tzAbbrev',
        key: 'timeZoneName',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP
    },
    zzz: {
        token: 'tzAbbrev',
        key: 'timeZoneName',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP
    },
    zzzz: {
        token: 'tzFull',
        key: 'timeZoneName',
        value: 'long',
        regExp: NativeDateTimeConstants._STR_REGEXP
    },
    Z: {
        token: 'tzhm',
        key: 'tzhm',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP,
        type: 'tzOffset'
    },
    ZZ: {
        token: 'tzhm',
        key: 'tzhm',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP,
        type: 'tzOffset'
    },
    ZZZ: {
        token: 'tzhm',
        key: 'tzhm',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP,
        type: 'tzOffset'
    },
    X: {
        token: 'tzh',
        key: 'tzh',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP,
        type: 'tzOffset'
    },
    XX: {
        token: 'tzhm',
        key: 'tzhm',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP,
        type: 'tzOffset'
    },
    XXX: {
        token: 'tzhsepm',
        key: 'tzhsepm',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP,
        type: 'tzOffset'
    },
    VV: {
        token: 'tzid',
        key: 'tzid',
        value: 'short',
        regExp: NativeDateTimeConstants._STR_REGEXP,
        type: 'tzOffset'
    },
    G: {
        token: 'era',
        key: 'era',
        value: 'eraAbbr',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    GG: {
        token: 'era',
        key: 'era',
        value: 'eraAbbr',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    GGG: {
        token: 'era',
        key: 'era',
        value: 'eraAbbr',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    GGGG: {
        token: 'era',
        key: 'era',
        value: 'eraName',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    GGGGG: {
        token: 'era',
        key: 'era',
        value: 'eraNarrow',
        regExp: NativeDateTimeConstants._NON_DIGIT_REGEXP
    },
    '/': {
        token: 'slash',
        regExp: NativeDateTimeConstants._SLASH_REGEXP
    }
};
NativeDateTimeConstants.FRACTIONAL_SECOND_MAP = {
    a: {
        key: 'dayPeriod',
        token: 'dayPeriod',
        value: 'narrow'
    },
    SSS: {
        key: 'fractionalSecondDigits',
        token: 'fractionalSecond',
        value: 3
    },
    SS: {
        key: 'fractionalSecondDigits',
        token: 'fractionalSecond',
        value: 2
    },
    S: {
        key: 'fractionalSecondDigits',
        token: 'fractionalSecond',
        value: 1
    }
};
NativeDateTimeConstants._tokenMap = {
    era: { short: 'GGG', long: 'GGGG', narrow: 'GGGGG' },
    month: { short: 'MMM', long: 'MMMM', narrow: 'MMMMM', numeric: 'M', '2-digit': 'MM' },
    weekday: { short: 'EEE', long: 'EEEE', narrow: 'EEEEE' },
    year: { numeric: 'y', '2-digit': 'yy' },
    day: { numeric: 'd', '2-digit': 'dd' },
    hour: { numeric: 'h', '2-digit': 'hh' },
    minute: { numeric: 'm', '2-digit': 'mm' },
    second: { numeric: 's', '2-digit': 'ss' },
    fractionalSecond: { 1: 'S', 2: 'SS', 3: 'SSS' },
    timeZoneName: { short: 'z', long: 'zzzz' }
};
NativeDateTimeConstants._dateTimeFormats = {
    dateStyle: {
        full: { year: 'y', month_s: 'MM', month_m: 'MMMM', weekday: 'EEEE', day: 'd' },
        long: { year: 'y', month_s: 'MM', month_m: 'MMMM', day: 'd' },
        medium: { year: 'y', month_s: 'MM', month_m: 'MMM', day: 'd' },
        short: { year: 'y', month_s: 'M', month_m: 'MMM', day: 'd' }
    },
    timeStyle: {
        full: { hour: 'h', minute: 'mm', second: 'ss', timeZoneName: 'zzzz' },
        long: { hour: 'h', minute: 'mm', second: 'ss', timeZoneName: 'z' },
        medium: { hour: 'h', minute: 'mm', second: 'ss' },
        short: { hour: 'h', minute: 'mm' }
    }
};
NativeDateTimeConstants._ALPHA_REGEXP = /([a-zA-Z]+)/;
NativeDateTimeConstants._HOUR12_REGEXP = /h/g;
NativeDateTimeConstants._hourCycleMap = {
    h12: 'h',
    h23: 'H',
    h11: 'K',
    h24: 'k'
};
NativeDateTimeConstants._zh_tw_locales = ['zh-TW', 'zh-Hant', 'zh-Hant-TW'];
NativeDateTimeConstants._zh_tw_pm_symbols = ['\u4e2d\u5348', '\u4e0b\u5348', '\u665a\u4e0a'];

const IntlConverterUtils = IntlConverterUtils$1;
class NativeConverterErrorHandler {
    static processError(e, value, hint) {
        let errorInfo = e.errorInfo;
        let summary = '';
        let detail = '';
        let converterError;
        let resourceKey = '';
        if (errorInfo) {
            var errorCode = errorInfo.errorCode;
            var parameterMap = errorInfo.parameterMap || {};
            oj.Assert.assertObject(parameterMap);
            var propName = parameterMap.propertyName;
            propName = getTranslatedString('oj-converter.datetime.datetimeOutOfRange.' + propName);
            parameterMap.propertyName = propName;
            if (e instanceof RangeError) {
                if (errorCode === 'datetimeOutOfRange') {
                    summary = getTranslatedString('oj-converter.datetime.datetimeOutOfRange.summary', {
                        propertyName: propName,
                        value: parameterMap.value
                    });
                    detail = getTranslatedString('oj-converter.datetime.datetimeOutOfRange.detail', {
                        minValue: parameterMap.minValue,
                        maxValue: parameterMap.maxValue
                    });
                    converterError = IntlConverterUtils.__getConverterError(summary, detail);
                }
                else if (errorCode === 'isoStringOutOfRange') {
                    summary = getTranslatedString('oj-converter.datetime.invalidISOString.invalidRangeSummary', {
                        isoStr: parameterMap.isoString,
                        propertyName: propName,
                        value: parameterMap.value
                    });
                    detail = getTranslatedString('oj-converter.datetime.datetimeOutOfRange.detail', {
                        minValue: parameterMap.minValue,
                        maxValue: parameterMap.maxValue
                    });
                    converterError = IntlConverterUtils.__getConverterError(summary, detail);
                }
            }
            else if (e instanceof SyntaxError) {
                if (errorCode === 'optionValueInvalid') {
                    converterError = IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
                }
            }
            else if (e instanceof Error) {
                if (errorCode === 'dateFormatMismatch') {
                    resourceKey = 'oj-converter.datetime.dateFormatMismatch.summary';
                }
                else if (errorCode === 'timeFormatMismatch') {
                    resourceKey = 'oj-converter.datetime.timeFormatMismatch.summary';
                }
                else if (errorCode === 'datetimeFormatMismatch') {
                    resourceKey = 'oj-converter.datetime.datetimeFormatMismatch.summary';
                }
                else if (errorCode === 'nonExistingTime') {
                    resourceKey = 'oj-converter.datetime.nonExistingTime.summary';
                }
                else if (errorCode === 'dateToWeekdayMismatch') {
                    summary = getTranslatedString('oj-converter.datetime.dateToWeekdayMismatch.summary', { date: parameterMap.date, weekday: parameterMap.weekday });
                    detail = getTranslatedString('oj-converter.datetime.dateToWeekdayMismatch.detail');
                    converterError = IntlConverterUtils.__getConverterError(summary, detail);
                }
                else if (errorCode === 'invalidISOString') {
                    summary = getTranslatedString('oj-converter.datetime.invalidISOString.summary', { isoStr: parameterMap.isoStr });
                    detail = getTranslatedString('oj-converter.datetime.invalidISOString.detail');
                    converterError = IntlConverterUtils.__getConverterError(summary, detail);
                }
                if (resourceKey) {
                    summary = getTranslatedString(resourceKey, {
                        value: value || parameterMap.value,
                        format: parameterMap.format
                    });
                    detail = getTranslatedString('oj-converter.hint.detail', {
                        exampleValue: hint
                    });
                    converterError = IntlConverterUtils.__getConverterError(summary, detail);
                }
            }
        }
        if (!converterError) {
            summary = e.message;
            detail = e.message;
            converterError = IntlConverterUtils.__getConverterError(summary, detail);
        }
        return converterError;
    }
}

let intlConverterCache = {};
function getISODateOffset(date, timeZone) {
    const d = new Date(Date.UTC(date.year, date.month - 1, date.date, date.hours, date.minutes));
    const utcDateAtTimezone = _applyTimezoneToDate(d, timeZone);
    const offset = _getOffset(date, utcDateAtTimezone);
    let adjustment = 0;
    d.setTime(d.getTime() - offset * 60000);
    if (!_compareDates(_applyTimezoneToDate(d, timeZone), date)) {
        adjustment = -60;
        d.setTime(d.getTime() + 60 * 60000);
        if (!_compareDates(_applyTimezoneToDate(d, timeZone), date)) {
            adjustment = 60;
            d.setTime(d.getTime() - 120 * 60000);
        }
    }
    const result = offset + adjustment;
    return result;
}
function _applyTimezoneToDate(d, timeZone) {
    const cnv = _getConverter(timeZone);
    const formattedUTC = cnv.format(d);
    const [localDate, localTime] = formattedUTC.split(',');
    const [month, date, year] = localDate.split('/');
    const [hours, minutes] = localTime.trim().split(':');
    return {
        year: parseInt(year),
        month: parseInt(month),
        date: parseInt(date),
        hours: parseInt(hours),
        minutes: parseInt(minutes)
    };
}
function _getOffset(original, asUTC) {
    let originalMins = original.hours * 60 + original.minutes;
    let utcMinutes = asUTC.hours * 60 + asUTC.minutes;
    let delta = original.year - asUTC.year;
    if (delta == 0) {
        delta = original.month - asUTC.month;
        if (delta === 0) {
            delta = original.date - asUTC.date;
        }
    }
    if (delta > 0) {
        originalMins += 24 * 60;
    }
    else if (delta < 0) {
        utcMinutes += 24 * 60;
    }
    return utcMinutes - originalMins;
}
function _compareDates(date1, date2) {
    return (date1.year === date2.year &&
        date1.month === date2.month &&
        date1.hours === date2.hours &&
        date1.minutes === date2.minutes);
}
function _getConverter(timezone) {
    let cnv = intlConverterCache[timezone];
    if (!cnv) {
        cnv = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hourCycle: 'h23',
            timeZone: timezone
        });
        intlConverterCache[timezone] = cnv;
    }
    return cnv;
}

const LocalOraI18nUtils = OraI18nUtils;
let localSystemTimeZone = null;
class NativeParserImpl {
    static parseImpl(str, pattern, resOptions, localeElements, cal) {
        const numberingSystemKey = resOptions.numberingSystem;
        if (numberingSystemKey !== undefined && numberingSystemKey !== 'latn') {
            str = LocalOraI18nUtils.getLatnDigits(str, numberingSystemKey);
        }
        let dtStyle = 0;
        let testIsoStr = LocalOraI18nUtils._ISO_DATE_REGEXP.test(str);
        let parsedIsoStr = '';
        let isoStrInfo = null;
        let res;
        if (testIsoStr === true) {
            parsedIsoStr = str;
            dtStyle = this._isoStrDateTimeStyle(str);
        }
        else {
            dtStyle = this._dateTimeStyle(resOptions);
            res = this._parseExact(str, pattern, resOptions, localeElements, cal);
            parsedIsoStr = res.value;
        }
        isoStrInfo = LocalOraI18nUtils.getISOStrFormatInfo(parsedIsoStr);
        if (resOptions.timeZone !== undefined && isoStrInfo.format !== NativeDateTimeConstants._LOCAL) {
            this._adjustHours(isoStrInfo, resOptions);
        }
        parsedIsoStr = this._createParseISOStringFromDate(dtStyle, isoStrInfo, resOptions);
        if (res === undefined) {
            res = { value: parsedIsoStr, warning: null };
        }
        else {
            res.value = parsedIsoStr;
            res.warning = null;
        }
        if (dtStyle === 2 && resOptions.isoStrFormat === NativeDateTimeConstants._LOCAL) {
            warn('isoStrFormat was set to local for date-time ISO string. local was ignored and parse returned an ISO string with offset.');
        }
        return res;
    }
    static _appendPreOrPostMatch(preMatch, strings) {
        let quoteCount = 0;
        let escaped = false;
        for (let i = 0, il = preMatch.length; i < il; i++) {
            const c = preMatch.charAt(i);
            switch (c) {
                case "'":
                    if (escaped) {
                        strings.push("'");
                    }
                    else {
                        quoteCount += 1;
                    }
                    escaped = false;
                    break;
                case '\\':
                    if (escaped) {
                        strings.push('\\');
                    }
                    escaped = !escaped;
                    break;
                default:
                    strings.push(c);
                    escaped = false;
                    break;
            }
        }
        return quoteCount;
    }
    static _validateRange(range) {
        if (range.value < range.low || range.value > range.high) {
            const msg = range.displayValue +
                ' is out of range.  Enter a value between ' +
                range.displayLow +
                ' and ' +
                range.displayHigh +
                ' for ' +
                range.name;
            let rangeError = new RangeError(msg);
            const errorInfo = {
                errorCode: 'datetimeOutOfRange',
                parameterMap: {
                    value: range.displayValue,
                    minValue: range.displayLow,
                    maxValue: range.displayHigh,
                    propertyName: range.name
                }
            };
            rangeError.errorInfo = errorInfo;
            throw rangeError;
        }
    }
    static _throwInvalidDateFormat(format, options, m) {
        const isDate = options.year !== undefined ||
            options.month !== undefined ||
            options.weekday !== undefined ||
            options.day !== undefined;
        const isTime = options.hour !== undefined || options.minute !== undefined || options.second !== undefined;
        let samplePattern = '';
        if (isDate && isTime) {
            samplePattern = 'MM/dd/yy hh:mm:ss a';
        }
        else if (isDate) {
            samplePattern = 'MM/dd/yy';
        }
        else {
            samplePattern = 'hh:mm:ss a';
        }
        const msg = 'Unexpected character(s) ' +
            m +
            ' encountered in the pattern "' +
            format +
            ' An example of a valid pattern is "' +
            samplePattern +
            '".';
        let error = new SyntaxError(msg);
        const errorInfo = {
            errorCode: 'optionValueInvalid',
            parameterMap: {
                propertyName: 'pattern',
                propertyValue: format,
                'propertyValueHint ': samplePattern
            }
        };
        error.errorInfo = errorInfo;
        throw error;
    }
    static _throwWeekdayMismatch(weekday, day) {
        const msg = 'The weekday ' + weekday + ' does not match the date ' + day;
        let error = new Error(msg);
        const errorInfo = {
            errorCode: 'dateToWeekdayMismatch',
            parameterMap: {
                weekday: weekday,
                date: day
            }
        };
        error.errorInfo = errorInfo;
        throw error;
    }
    static _throwDateFormatMismatch(value, format, style) {
        let msg = '';
        let errorCodeType = '';
        if (style === 2) {
            msg =
                'The value "' + value + '" does not match the expected date-time format "' + format + '"';
            errorCodeType = 'datetimeFormatMismatch';
        }
        else if (style === 0) {
            msg = 'The value "' + value + '" does not match the expected date format "' + format + '"';
            errorCodeType = 'dateFormatMismatch';
        }
        else {
            msg = 'The value "' + value + '" does not match the expected time format "' + format + '"';
            errorCodeType = 'timeFormatMismatch';
        }
        let error = new Error(msg);
        const errorInfo = {
            errorCode: errorCodeType,
            parameterMap: {
                value: value,
                format: format
            }
        };
        error.errorInfo = errorInfo;
        throw error;
    }
    static _parseTimezoneOffset(_offset) {
        let parts = _offset.split(':');
        let offsetParts = new Array(2);
        if (parts.length === 2) {
            offsetParts[0] = parseInt(parts[0], 10);
            offsetParts[1] = parseInt(parts[1], 10);
        }
        else if (_offset.length === 2 || _offset.length === 3) {
            offsetParts[0] = parseInt(_offset, 10);
            offsetParts[1] = 0;
        }
        else {
            offsetParts[0] = parseInt(_offset.substr(0, 3), 10);
            offsetParts[1] = parseInt(_offset.substr(3), 10);
        }
        return offsetParts;
    }
    static _expandYear(start2DigitYear, year) {
        year = Number(year);
        if (year < 100) {
            const ambiguousTwoDigitYear = start2DigitYear % 100;
            year += Math.floor(start2DigitYear / 100) * 100 + (year < ambiguousTwoDigitYear ? 100 : 0);
        }
        return year;
    }
    static _arrayIndexOfMonthOrDay(monthsObj, item) {
        let trimItem = LocalOraI18nUtils.toUpper(item);
        trimItem = LocalOraI18nUtils.trim(trimItem);
        trimItem = trimItem.replace(/\.$/, '');
        const monthsKeys = Object.keys(monthsObj);
        for (let i = 0; i < monthsKeys.length; i++) {
            let m = monthsKeys[i];
            m = LocalOraI18nUtils.toUpper(monthsObj[m]);
            m = LocalOraI18nUtils.trim(m);
            m = m.replace(/\.$/, '');
            if (trimItem == m) {
                return i;
            }
        }
        return -1;
    }
    static _getDayIndex(calNode, value, fmt) {
        let ret = 0;
        let days = [];
        const calDaysFmt = calNode.days.format;
        const calDaysStdAlone = calNode.days['stand-alone'];
        days = [
            calDaysFmt.abbreviated,
            calDaysFmt.wide,
            calDaysStdAlone.abbreviated,
            calDaysStdAlone.wide
        ];
        for (let m = 0; m < days.length; m++) {
            ret = this._arrayIndexOfMonthOrDay(days[m], value);
            if (ret !== -1) {
                return ret;
            }
        }
        return ret;
    }
    static _getMonthIndex(calNode, value, fmt) {
        let ret = -1;
        const calMonthsFmt = calNode.months.format;
        const calMonthsStdAlone = calNode.months['stand-alone'];
        const months = [
            calMonthsFmt.wide,
            calMonthsFmt.abbreviated,
            calMonthsStdAlone.wide,
            calMonthsStdAlone.abbreviated
        ];
        for (let m = 0; m < months.length; m++) {
            ret = this._arrayIndexOfMonthOrDay(months[m], value);
            if (ret !== -1) {
                return ret;
            }
        }
        return ret;
    }
    static _getParseRegExp(format, options) {
        const expFormat = format.replace(NativeDateTimeConstants._ESCAPE_REGEXP, '\\\\$1');
        let regexp = ['^'];
        let groups = [];
        let index = 0;
        let quoteCount = 0;
        let match = NativeDateTimeConstants._TOKEN_REGEXP.exec(expFormat);
        while (match !== null) {
            const preMatch = expFormat.slice(index, match.index);
            index = NativeDateTimeConstants._TOKEN_REGEXP.lastIndex;
            quoteCount += this._appendPreOrPostMatch(preMatch, regexp);
            if (quoteCount % 2) {
                regexp.push(match[0]);
            }
            else {
                const m = match[0];
                let add = '';
                if (NativeDateTimeConstants._PROPERTIES_MAP[m] !== undefined) {
                    add = NativeDateTimeConstants._PROPERTIES_MAP[m].regExp;
                }
                else {
                    this._throwInvalidDateFormat(format, options, m);
                }
                if (add) {
                    regexp.push(add);
                }
                groups.push(match[0]);
            }
            match = NativeDateTimeConstants._TOKEN_REGEXP.exec(expFormat);
        }
        this._appendPreOrPostMatch(expFormat.slice(index), regexp);
        regexp.push('$');
        const regexpStr = regexp.join('').replace(/\s+/g, '\\s+');
        const parseRegExp = {
            regExp: regexpStr,
            groups: groups
        };
        return parseRegExp;
    }
    static _getTokenIndex(arr, token) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][token] !== undefined) {
                return i;
            }
        }
        return 0;
    }
    static _parseLenienthms(result, timepart, format, dtype, calNode) {
        NativeDateTimeConstants._TIME_REGEXP.lastIndex = 0;
        let hour = 0;
        let minute = 0;
        let second = 0;
        let msec = 0;
        let idx;
        let match = NativeDateTimeConstants._TIME_REGEXP.exec(timepart);
        let range;
        if (match === null) {
            this._throwDateFormatMismatch(timepart, format, dtype);
        }
        if (match[1] !== undefined) {
            hour = parseInt(match[1], 10);
        }
        if (match[2] !== undefined) {
            minute = parseInt(match[2], 10);
        }
        if (match[3] !== undefined) {
            second = parseInt(match[3], 10);
        }
        if (match[4] !== undefined) {
            msec = parseInt(match[4], 10);
        }
        NativeDateTimeConstants._TIME_FORMAT_REGEXP.lastIndex = 0;
        match = NativeDateTimeConstants._TIME_FORMAT_REGEXP.exec(format);
        switch (match[0]) {
            case 'h':
                if (hour === 12) {
                    hour = 0;
                }
                range = {
                    name: 'hour',
                    value: hour,
                    low: 0,
                    high: 11,
                    displayValue: hour,
                    displayLow: 1,
                    displayHigh: 12
                };
                this._validateRange(range);
                idx = this._matchPMSymbol(calNode, timepart);
                if (idx && hour < 12) {
                    hour += 12;
                }
                break;
            case 'K':
                range = {
                    name: 'hour',
                    value: hour,
                    low: 0,
                    high: 11,
                    displayValue: hour,
                    displayLow: 0,
                    displayHigh: 11
                };
                this._validateRange(range);
                idx = this._matchPMSymbol(calNode, timepart);
                if (idx && hour < 12) {
                    hour += 12;
                }
                break;
            case 'H':
                range = {
                    name: 'hour',
                    value: hour,
                    low: 0,
                    high: 23,
                    displayValue: hour,
                    displayLow: 0,
                    displayHigh: 23
                };
                this._validateRange(range);
                break;
            case 'k':
                if (hour === 24) {
                    hour = 0;
                }
                range = {
                    name: 'hour',
                    value: hour,
                    low: 0,
                    high: 23,
                    displayValue: hour,
                    displayLow: 1,
                    displayHigh: 24
                };
                break;
            default:
                break;
        }
        range = {
            name: 'minute',
            value: minute,
            low: 0,
            high: 59,
            displayValue: minute,
            displayLow: 0,
            displayHigh: 59
        };
        this._validateRange(range);
        range = {
            name: 'second',
            value: second,
            low: 0,
            high: 59,
            displayValue: second,
            displayLow: 0,
            displayHigh: 59
        };
        this._validateRange(range);
        range = {
            name: 'farctionalSecond',
            value: msec,
            low: 0,
            high: 999,
            displayValue: msec,
            displayLow: 0,
            displayHigh: 999
        };
        this._validateRange(range);
        result.setHours(hour, minute, second, msec);
    }
    static _getWeekdayName(value, calNode) {
        const calDaysFmt = calNode.days.format;
        const calDaysStandAlone = calNode.days['stand-alone'];
        const days = [
            calDaysFmt.wide,
            calDaysFmt.abbreviated,
            calDaysStandAlone.wide,
            calDaysStandAlone.abbreviated
        ];
        for (let i = 0; i < days.length; i++) {
            const dayKeys = Object.keys(days[i]);
            for (let j = 0; j < dayKeys.length; j++) {
                const dName = days[i][dayKeys[j]];
                const dRegExp = new RegExp(dName + '\\b', 'i');
                if (dRegExp.test(value)) {
                    return dName;
                }
            }
        }
        return null;
    }
    static _parseLenientyMEd(value, format, options, cal, isDateTime) {
        NativeDateTimeConstants._YMD_REGEXP.lastIndex = 0;
        let match = NativeDateTimeConstants._YMD_REGEXP.exec(value);
        let dtype = 0;
        if (match === null) {
            dtype = isDateTime ? 2 : 0;
            this._throwDateFormatMismatch(value, format, dtype);
        }
        let tokenIndexes = [
            {
                y: format.indexOf('y')
            },
            {
                M: format.indexOf('M')
            },
            {
                d: format.indexOf('d')
            }
        ];
        tokenIndexes.sort(function (a, b) {
            let n1 = Object.keys(a)[0];
            let n2 = Object.keys(b)[0];
            return a[n1] - b[n2];
        });
        let year = 0;
        let month = 0;
        let day = 0;
        let yearIndex = 0;
        let foundDayIndex = 0;
        let i = 0;
        let dayIndex = this._getTokenIndex(tokenIndexes, 'd');
        let foundYear = false;
        let foundDay = false;
        for (i = 1; i <= 3; i++) {
            let tokenMatch = match[i];
            let intToken = parseInt(tokenMatch);
            if (tokenMatch.length > 2 || intToken > 31) {
                year = intToken;
                foundYear = true;
                yearIndex = i - 1;
            }
        }
        if (!foundYear) {
            yearIndex = this._getTokenIndex(tokenIndexes, 'y');
            year = match[this._getTokenIndex(tokenIndexes, 'y') + 1];
        }
        for (i = 0; i < 3; i++) {
            if (i !== yearIndex && match[i + 1] > 12) {
                day = match[i + 1];
                foundDay = true;
                foundDayIndex = i;
                break;
            }
        }
        if (!foundDay) {
            if (yearIndex === this._getTokenIndex(tokenIndexes, 'd')) {
                day = match[this._getTokenIndex(tokenIndexes, 'y') + 1];
                month = match[this._getTokenIndex(tokenIndexes, 'M') + 1];
            }
            else if (yearIndex === this._getTokenIndex(tokenIndexes, 'M')) {
                day = match[this._getTokenIndex(tokenIndexes, 'd') + 1];
                month = match[this._getTokenIndex(tokenIndexes, 'y') + 1];
            }
            else {
                day = match[this._getTokenIndex(tokenIndexes, 'd') + 1];
                month = match[this._getTokenIndex(tokenIndexes, 'M') + 1];
            }
        }
        else {
            for (i = 0; i < 3; i++) {
                if (i !== foundDayIndex && i !== yearIndex) {
                    month = match[i + 1];
                    break;
                }
            }
            if (month === undefined) {
                month = match[this._getTokenIndex(tokenIndexes, 'M') + 1];
            }
        }
        month -= 1;
        let daysInMonth = LocalOraI18nUtils._getDaysInMonth(year, month);
        let range;
        if (foundDay && dayIndex !== foundDayIndex && month > 12) {
            range = {
                name: 'month',
                value: day,
                low: 0,
                high: 11,
                displayValue: day,
                displayLow: 1,
                displayHigh: 12
            };
            this._validateRange(range);
        }
        range = {
            name: 'month',
            value: month,
            low: 0,
            high: 11,
            displayValue: month + 1,
            displayLow: 1,
            displayHigh: 12
        };
        this._validateRange(range);
        range = {
            name: 'day',
            value: day,
            low: 1,
            high: daysInMonth,
            displayValue: day,
            displayLow: 1,
            displayHigh: daysInMonth
        };
        this._validateRange(range);
        const start2DigitYear = options.twoDigitYearStart || 1950;
        year = this._expandYear(start2DigitYear, year);
        range = {
            name: 'year',
            value: year,
            low: 0,
            high: 9999,
            displayValue: year,
            displayLow: 0,
            displayHigh: 9999
        };
        this._validateRange(range);
        let parsedDate = new Date(year, month, day);
        let dName = this._getWeekdayName(value, cal);
        if (dName !== null) {
            const weekDay = this._getDayIndex(cal, dName, 0);
            if (parsedDate.getDay() !== weekDay) {
                this._throwWeekdayMismatch(dName, parsedDate.getDate());
            }
        }
        if (isDateTime) {
            const timepart = value.substr(NativeDateTimeConstants._YMD_REGEXP.lastIndex);
            if (timepart.length === 0) {
                parsedDate.setHours(0, 0, 0, 0);
            }
            else {
                this._parseLenienthms(parsedDate, timepart, format, 2, cal);
            }
        }
        const result = {
            value: LocalOraI18nUtils.dateToLocalIso(parsedDate),
            warning: 'lenient parsing was used'
        };
        return result;
    }
    static _parseLenientyMMMEd(value, format, options, cal, isDateTime) {
        let origValue = value;
        value = LocalOraI18nUtils.toUpper(value);
        const calMonthsFmt = cal.months.format;
        const calMonthsStandAlone = cal.months['stand-alone'];
        let months = [
            calMonthsFmt.wide,
            calMonthsFmt.abbreviated,
            calMonthsStandAlone.wide,
            calMonthsStandAlone.abbreviated
        ];
        let foundMatch = false;
        let reverseMonth = [];
        let i = 0;
        let mName = '';
        for (i = 0; i < months.length; i++) {
            reverseMonth = [];
            const monthKeys = Object.keys(months[i]);
            let j = 0;
            for (j = 0; j < monthKeys.length; j++) {
                mName = LocalOraI18nUtils.toUpper(months[i][monthKeys[j]]);
                reverseMonth.unshift({
                    idx: j,
                    name: mName
                });
            }
            reverseMonth.sort(function (a, b) {
                return b.idx - a.idx;
            });
            for (j = 0; j < reverseMonth.length; j++) {
                mName = reverseMonth[j].name;
                if (value.indexOf(mName) !== -1) {
                    foundMatch = true;
                    value = value.replace(mName, '');
                    break;
                }
            }
            if (foundMatch) {
                break;
            }
        }
        if (!foundMatch) {
            return this._parseLenientyMEd(origValue, format, options, cal, isDateTime);
        }
        const month = this._getMonthIndex(cal, mName, 2);
        let range = {
            name: 'month',
            value: month,
            low: 0,
            high: 11,
            displayValue: month,
            displayLow: 1,
            displayHigh: 12
        };
        this._validateRange(range);
        const dName = this._getWeekdayName(origValue, cal);
        const dRegExp = new RegExp(dName + '\\W', 'i');
        if (dName !== null) {
            value = value.replace(dRegExp, '');
        }
        NativeDateTimeConstants._YEAR_AND_DATE_REGEXP.lastIndex = 0;
        const match = NativeDateTimeConstants._YEAR_AND_DATE_REGEXP.exec(value);
        if (match === null) {
            const dtype = isDateTime ? 2 : 0;
            this._throwDateFormatMismatch(origValue, format, dtype);
        }
        let tokenIndexes = [
            {
                y: format.indexOf('y')
            },
            {
                d: format.indexOf('d')
            }
        ];
        tokenIndexes.sort(function (a, b) {
            const n1 = Object.keys(a)[0];
            const n2 = Object.keys(b)[0];
            return a[n1] - b[n2];
        });
        let year = 0;
        let day = 0;
        let yearIndex = 0;
        let foundYear = false;
        for (i = 1; i <= 2; i++) {
            const tokenMatch = match[i];
            const intToken = parseInt(tokenMatch);
            if (tokenMatch.length > 2 || intToken > 31) {
                year = intToken;
                foundYear = true;
                yearIndex = i - 1;
            }
        }
        if (!foundYear) {
            yearIndex = this._getTokenIndex(tokenIndexes, 'y');
            year = parseInt(match[this._getTokenIndex(tokenIndexes, 'y') + 1], 10);
        }
        if (yearIndex === this._getTokenIndex(tokenIndexes, 'd')) {
            day = parseInt(match[this._getTokenIndex(tokenIndexes, 'y') + 1], 10);
        }
        else {
            day = parseInt(match[this._getTokenIndex(tokenIndexes, 'd') + 1], 10);
        }
        const start2DigitYear = options.twoDigitYearStart || 1950;
        year = this._expandYear(start2DigitYear, year);
        range = {
            name: 'year',
            value: year,
            low: 0,
            high: 9999,
            displayValue: year,
            displayLow: 0,
            displayHigh: 9999
        };
        this._validateRange(range);
        const parsedDate = new Date(year, month, day);
        if (dName !== null) {
            const weekDay = this._getDayIndex(cal, dName, 0);
            if (parsedDate.getDay() !== weekDay) {
                this._throwWeekdayMismatch(dName, parsedDate.getDate());
            }
        }
        const daysInMonth = LocalOraI18nUtils._getDaysInMonth(year, month);
        range = {
            name: 'day',
            value: day,
            low: 1,
            high: daysInMonth,
            displayValue: day,
            displayLow: 1,
            displayHigh: daysInMonth
        };
        this._validateRange(range);
        if (isDateTime) {
            const timepart = value.substr(NativeDateTimeConstants._YEAR_AND_DATE_REGEXP.lastIndex);
            if (timepart.length === 0) {
                parsedDate.setHours(0, 0, 0, 0);
            }
            else {
                this._parseLenienthms(parsedDate, timepart, format, 2, cal);
            }
        }
        const result = {
            value: LocalOraI18nUtils.dateToLocalIso(parsedDate),
            warning: 'lenient parsing was used'
        };
        return result;
    }
    static _parseLenient(value, format, options, cal) {
        const dtStyle = this._dateTimeStyle(options);
        let result;
        switch (dtStyle) {
            case 0:
                result = this._parseLenientyMMMEd(value, format, options, cal, false);
                break;
            case 1:
                const d = new Date();
                this._parseLenienthms(d, value, format, 1, cal);
                const isoStr = LocalOraI18nUtils.dateToLocalIso(d);
                result = { value: isoStr, warning: 'lenient parsing was used' };
                break;
            case 2:
                result = this._parseLenientyMMMEd(value, format, options, cal, true);
                break;
            default:
                result = { value: '', warning: 'lenient parsing was used' };
                break;
        }
        const parts = LocalOraI18nUtils._IsoStrParts(result.value);
        const gregParts = [parts[0], parts[1], parts[2]];
        const isoParts = result.value.split('T');
        result.value =
            LocalOraI18nUtils.padZeros(gregParts[0], 4) +
                '-' +
                LocalOraI18nUtils.padZeros(gregParts[1], 2) +
                '-' +
                LocalOraI18nUtils.padZeros(gregParts[2], 2) +
                'T' +
                isoParts[1];
        return result;
    }
    static _getNameIndex(calNode, datePart, matchGroup, mLength, style, matchIndex, start1, end1, start2, end2, name) {
        let index = 0;
        const monthsFormat = calNode[datePart][style];
        let range;
        if (datePart === 'months') {
            index = this._getMonthIndex(calNode, matchGroup, matchIndex);
        }
        else {
            index = this._getDayIndex(calNode, matchGroup, matchIndex);
        }
        const startName = monthsFormat[mLength][start2];
        const endName = monthsFormat[mLength][end2];
        range = {
            name: name,
            value: index,
            low: start1,
            high: end1,
            displayValue: parseInt(matchGroup),
            displayLow: startName,
            displayHigh: endName
        };
        this._validateRange(range);
        return index;
    }
    static _validateTimePart(matchInt, _timeObj, objMap, timeToken) {
        let timeObj = _timeObj;
        timeObj[objMap.timePart] = matchInt;
        if (timeToken === 'h' || timeToken === 'hh') {
            if (matchInt === 12) {
                timeObj[objMap.timePart] = 0;
            }
        }
        else if (timeToken === 'k' || timeToken === 'kk') {
            timeObj.htoken = timeToken;
            if (matchInt === 24) {
                timeObj[objMap.timePart] = 0;
            }
        }
        else if (timeToken === 'K' || timeToken === 'KK') {
            if (matchInt === 12) {
                timeObj[objMap.timePart] = 0;
            }
        }
        const range = {
            name: objMap.timePart,
            value: timeObj[objMap.timePart],
            low: objMap.start1,
            high: objMap.end1,
            displayValue: matchInt,
            displayLow: objMap.start2,
            displayHigh: objMap.end2
        };
        this._validateRange(range);
    }
    static _dateTimeStyle(resOptions) {
        const isTime = resOptions.hour !== undefined ||
            resOptions.minute !== undefined ||
            resOptions.second !== undefined ||
            resOptions.fractionalSecondDigits !== undefined;
        const isDate = resOptions.year !== undefined ||
            resOptions.month !== undefined ||
            resOptions.day !== undefined ||
            resOptions.weekday !== undefined;
        if (isDate && isTime) {
            return 2;
        }
        else if (isTime) {
            return 1;
        }
        else if (isDate) {
            return 0;
        }
        if (resOptions.dateStyle !== undefined && resOptions.timeStyle !== undefined) {
            return 2;
        }
        if (resOptions.timeStyle !== undefined) {
            return 1;
        }
        return 0;
    }
    static _matchPMSymbol(cal, matchGroup) {
        const loc = cal.locale;
        let isPM = false;
        let i = 0;
        if (NativeDateTimeConstants._zh_tw_locales.includes(loc)) {
            const pmSymbols = NativeDateTimeConstants._zh_tw_pm_symbols;
            for (i = 0; i < pmSymbols.length; i++) {
                const pmSymbol = pmSymbols[i];
                if (matchGroup.indexOf(pmSymbol) !== -1) {
                    return true;
                }
            }
        }
        else {
            const calPM = cal.dayPeriods.format.wide.pm;
            isPM = LocalOraI18nUtils.toUpper(matchGroup).indexOf(LocalOraI18nUtils.toUpper(calPM)) !== -1;
        }
        return isPM;
    }
    static _parseExact(value, format, resOptions, localeElements, cal) {
        const eraPart = cal.eras.eraAbbr['1'];
        const trimEraPart = LocalOraI18nUtils.trimNumber(eraPart);
        value = value.replace(eraPart, trimEraPart);
        const getOption = LocalOraI18nUtils.getGetOption(resOptions, 'NativeDateTimeConverter.parse');
        const lenientParse = getOption('lenientParse', 'string', ['none', 'full'], 'full');
        const dtStyle = this._dateTimeStyle(resOptions);
        const parseInfo = this._getParseRegExp(format, resOptions);
        const match = new RegExp(parseInfo.regExp).exec(value);
        if (match === null) {
            if (lenientParse === 'full') {
                return this._parseLenient(value, format, resOptions, cal);
            }
            this._throwDateFormatMismatch(value, format, dtStyle);
        }
        const groups = parseInfo.groups;
        let year = null;
        let month = null;
        let date = null;
        let weekDay = null;
        let hourOffset = '';
        let tzID = null;
        let pmHour = undefined;
        let weekDayName = '';
        let range;
        let timeObj = {
            hour: 0,
            minute: 0,
            second: 0,
            millisec: 0,
            htoken: ''
        };
        const start2DigitYear = resOptions.twoDigitYearStart || 1950;
        for (let j = 0, jl = groups.length; j < jl; j++) {
            const matchGroup = match[j + 1];
            if (matchGroup) {
                const current = groups[j];
                const matchInt = parseInt(matchGroup, 10);
                const currentGroup = NativeDateTimeConstants._PROPERTIES_MAP[current];
                switch (currentGroup.token) {
                    case 'months':
                        month = this._getNameIndex(cal, currentGroup.token, matchGroup, currentGroup.mLen, currentGroup.style, currentGroup.matchIndex, 0, 11, '1', '12', 'month name');
                        break;
                    case 'days':
                        weekDayName = matchGroup;
                        weekDay = this._getNameIndex(cal, currentGroup.token, matchGroup, currentGroup.dLen, currentGroup.style, currentGroup.matchIndex, 0, 6, 'sun', 'sat', 'weekday');
                        break;
                    case 'time':
                        this._validateTimePart(matchInt, timeObj, currentGroup, current);
                        break;
                    case 'dayOfMonth':
                        date = matchInt;
                        break;
                    case 'monthIndex':
                        month = matchInt - 1;
                        if (month > 11 && lenientParse === 'full') {
                            try {
                                return this._parseLenient(value, format, resOptions, cal);
                            }
                            catch (e) {
                                range = {
                                    name: 'month',
                                    value: month,
                                    low: 0,
                                    high: 11,
                                    displayValue: month + 1,
                                    displayLow: 1,
                                    displayHigh: 12
                                };
                                this._validateRange(range);
                            }
                        }
                        break;
                    case 'year':
                        year = this._expandYear(start2DigitYear, matchInt);
                        break;
                    case 'ampm':
                        pmHour = this._matchPMSymbol(cal, matchGroup);
                        break;
                    case 'tzhm':
                        hourOffset = matchGroup.substr(-2);
                        hourOffset = matchGroup.substr(0, 3) + ':' + hourOffset;
                        break;
                    case 'tzhsepm':
                        hourOffset = matchGroup;
                        break;
                    case 'tzh':
                        hourOffset = matchGroup + ':00';
                        break;
                    case 'tzid':
                        tzID = matchGroup;
                        break;
                    default:
                        break;
                }
            }
        }
        const parsedDate = new Date();
        if (year === null) {
            year = parsedDate.getFullYear();
        }
        if (month === null && date === null) {
            month = parsedDate.getMonth();
            date = parsedDate.getDate();
        }
        else if (date === null) {
            date = 1;
        }
        parsedDate.setFullYear(year, month, date);
        const MonthDays = LocalOraI18nUtils._getDaysInMonth(year, month);
        range = {
            name: 'day',
            value: date,
            low: 1,
            high: MonthDays,
            displayValue: date,
            displayLow: 1,
            displayHigh: MonthDays
        };
        this._validateRange(range);
        if (pmHour == true && timeObj.hour < 12) {
            timeObj.hour += 12;
        }
        if (pmHour == false &&
            timeObj.hour == 12 &&
            (timeObj.htoken == 'k' || timeObj.htoken == 'kk')) {
            timeObj.hour = 0;
        }
        let parts = [year, month + 1, date];
        parts[3] = timeObj.hour;
        parts[4] = timeObj.minute;
        parts[5] = timeObj.second;
        parts[6] = timeObj.millisec;
        let isoParsedDate = LocalOraI18nUtils.partsToIsoString(parts);
        if (tzID !== null) {
            const zoneOffset = this._getTimeZoneOffset(parts, tzID);
            hourOffset = LocalOraI18nUtils.getTimeStringFromOffset('', zoneOffset, false, true);
        }
        if (hourOffset !== '') {
            isoParsedDate += hourOffset;
        }
        range = {
            name: 'year',
            value: year,
            low: 0,
            high: 9999,
            displayValue: year,
            displayLow: 0,
            displayHigh: 9999
        };
        this._validateRange(range);
        range = {
            name: 'month',
            value: month,
            low: 0,
            high: 11,
            displayValue: month + 1,
            displayLow: 1,
            displayHigh: 12
        };
        this._validateRange(range);
        const daysInMonth = LocalOraI18nUtils._getDaysInMonth(parts[0], parts[1] - 1);
        range = {
            name: 'day',
            value: parts[2],
            low: 1,
            high: daysInMonth,
            displayValue: parts[2],
            displayLow: 1,
            displayHigh: daysInMonth
        };
        this._validateRange(range);
        if (weekDay !== null) {
            const validateDay = LocalOraI18nUtils.isoToLocalDate(isoParsedDate);
            if (validateDay.getDay() !== weekDay) {
                this._throwWeekdayMismatch(weekDayName, validateDay.getDate());
            }
        }
        const result = { value: isoParsedDate };
        return result;
    }
    static _isoStrDateTimeStyle(isoStr) {
        const timeIndex = isoStr.indexOf('T');
        if (timeIndex === -1) {
            return 0;
        }
        if (timeIndex > 0) {
            return 2;
        }
        return 1;
    }
    static _getTimeZoneOffset(parts, tzName) {
        const localTtimeZone = this.getLocalSystemTimeZone();
        if (localTtimeZone === tzName) {
            const d = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
            const localOffset = d.getTimezoneOffset();
            return -localOffset;
        }
        const dateParts = {
            year: parts[0],
            month: parts[1],
            date: parts[2],
            hours: parts[3],
            minutes: parts[4]
        };
        let offset = getISODateOffset(dateParts, tzName);
        return offset;
    }
    static _getAdjustedOffset(timezone, isoStrInfo) {
        const parts = isoStrInfo.isoStrParts;
        return this._getTimeZoneOffset(parts, timezone);
    }
    static _adjustHours(isoStrInfo, options) {
        let value = isoStrInfo.isoStrParts;
        const isoStrFormat = isoStrInfo.format;
        let origOffset = 0;
        switch (isoStrFormat) {
            case NativeDateTimeConstants._OFFSET:
                let tzParts = this._parseTimezoneOffset(isoStrInfo.timeZone);
                const hoursOffset = tzParts[0];
                const minOffset = tzParts[1];
                origOffset = hoursOffset * 60 + (hoursOffset < 0 ? -minOffset : minOffset);
                break;
            case NativeDateTimeConstants._ZULU:
                origOffset = 0;
                break;
            default:
                break;
        }
        let newOffset = this._getAdjustedOffset(options.timeZone, isoStrInfo);
        newOffset -= origOffset;
        let newDate = new Date(value[0], value[1] - 1, value[2], value[3], value[4], value[4]);
        newDate.setHours(value[3] + ((newOffset / 60) << 0), newOffset % 60);
        const newDateIso = LocalOraI18nUtils.dateToLocalIso(newDate);
        const newDateIsoStrInfo = LocalOraI18nUtils.getISOStrFormatInfo(newDateIso);
        newOffset = this._getAdjustedOffset(options.timeZone, newDateIsoStrInfo);
        newOffset -= origOffset;
        let adjustD = new Date(Date.UTC(value[0], value[1] - 1, value[2], value[3], value[4], value[5]));
        const adjustedMin = adjustD.getUTCMinutes() + newOffset;
        adjustD.setUTCHours(adjustD.getUTCHours() + ((adjustedMin / 60) << 0), adjustedMin % 60);
        value[0] = adjustD.getUTCFullYear();
        value[1] = adjustD.getUTCMonth() + 1;
        value[2] = adjustD.getUTCDate();
        value[3] = adjustD.getUTCHours();
        value[4] = adjustD.getUTCMinutes();
        value[5] = adjustD.getUTCSeconds();
    }
    static _createISOStrParts(dtStyle, d) {
        let ms = 0;
        let val = '';
        switch (dtStyle) {
            case 0:
                val =
                    LocalOraI18nUtils.padZeros(d[0], 4) +
                        '-' +
                        LocalOraI18nUtils.padZeros(d[1], 2) +
                        '-' +
                        LocalOraI18nUtils.padZeros(d[2], 2);
                break;
            case 1:
                val =
                    'T' +
                        LocalOraI18nUtils.padZeros(d[3], 2) +
                        ':' +
                        LocalOraI18nUtils.padZeros(d[4], 2) +
                        ':' +
                        LocalOraI18nUtils.padZeros(d[5], 2);
                ms = d[6];
                if (ms > 0) {
                    val += '.' + LocalOraI18nUtils.trimRightZeros(ms);
                }
                break;
            default:
                val =
                    LocalOraI18nUtils.padZeros(d[0], 4) +
                        '-' +
                        LocalOraI18nUtils.padZeros(d[1], 2) +
                        '-' +
                        LocalOraI18nUtils.padZeros(d[2], 2) +
                        'T' +
                        LocalOraI18nUtils.padZeros(d[3], 2) +
                        ':' +
                        LocalOraI18nUtils.padZeros(d[4], 2) +
                        ':' +
                        LocalOraI18nUtils.padZeros(d[5], 2);
                ms = d[6];
                if (ms > 0) {
                    val += '.' + LocalOraI18nUtils.trimRightZeros(ms);
                }
                break;
        }
        return val;
    }
    static _getParseISOStringOffset(tzName, parts) {
        const offset = this._getTimeZoneOffset(parts, tzName);
        return LocalOraI18nUtils.getTimeStringFromOffset('', offset, false, true);
    }
    static _createParseISOStringFromDate(dtStyle, isoStrInfo, options) {
        let zone = null;
        let index = 0;
        let offset = '';
        let offsetParts = [];
        const getOption = LocalOraI18nUtils.getGetOption(options, 'NativeDateTimeConverter.parse');
        const isoFormat = getOption('isoStrFormat', 'string', [
            NativeDateTimeConstants._ZULU,
            NativeDateTimeConstants._OFFSET,
            NativeDateTimeConstants._INVARIANT,
            NativeDateTimeConstants._LOCAL,
            NativeDateTimeConstants._AUTO
        ], NativeDateTimeConstants._AUTO);
        const parts = isoStrInfo.isoStrParts;
        const dTimeZone = isoStrInfo.timeZone;
        const tzName = options.timeZone;
        const isoStrFormat = isoStrInfo.format;
        const optionsFormat = options.isoStrFormat;
        let val = this._createISOStrParts(dtStyle, parts);
        if (dtStyle === 0) {
            return val;
        }
        switch (isoFormat) {
            case NativeDateTimeConstants._OFFSET:
            case NativeDateTimeConstants._AUTO:
                val += this._getParseISOStringOffset(tzName, parts);
                break;
            case NativeDateTimeConstants._LOCAL:
                if (dtStyle === 2) {
                    val += this._getParseISOStringOffset(tzName, parts);
                }
                break;
            case NativeDateTimeConstants._ZULU:
                let adjustedMin = 0;
                adjustedMin = -this._getTimeZoneOffset(parts, tzName);
                if (adjustedMin !== 0) {
                    const adjustD = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], parts[6]));
                    adjustedMin = adjustD.getUTCMinutes() + adjustedMin;
                    adjustD.setUTCHours(adjustD.getUTCHours() + ((adjustedMin / 60) << 0), adjustedMin % 60);
                    parts[0] = adjustD.getUTCFullYear();
                    parts[1] = adjustD.getUTCMonth() + 1;
                    parts[2] = adjustD.getUTCDate();
                    parts[3] = adjustD.getUTCHours();
                    parts[4] = adjustD.getUTCMinutes();
                    parts[5] = adjustD.getUTCSeconds();
                    val = this._createISOStrParts(dtStyle, parts);
                }
                val += 'Z';
                break;
            default:
                break;
        }
        return val;
    }
    static getTimeZoneCurrentDate(tzName) {
        let options = { year: 'numeric', day: '2-digit', month: '2-digit' };
        if (tzName) {
            options.timeZone = tzName;
        }
        let cnv = Intl.DateTimeFormat('en-US', options);
        const fmt = cnv.format(new Date());
        const parts = fmt.split('/');
        const result = parts[2] + '-' + parts[0] + '-' + parts[1];
        return result;
    }
    static getTimeZoneCurrentOffset(timezone) {
        const d = new Date();
        const isoStr = LocalOraI18nUtils.dateToLocalIso(d);
        let isoStrInfo = LocalOraI18nUtils.getISOStrFormatInfo(isoStr);
        let parts = isoStrInfo.isoStrParts;
        return this._getAdjustedOffset(timezone, isoStrInfo);
    }
    static getLocalSystemTimeZone() {
        if (!localSystemTimeZone) {
            const intlCnv = new Intl.DateTimeFormat('en-US');
            localSystemTimeZone = intlCnv.resolvedOptions().timeZone;
        }
        return localSystemTimeZone;
    }
}

const LocalOraI18nUtils$1 = OraI18nUtils;
class NativeDateTimeConverter {
    constructor(options) {
        this.intlFormatter = null;
        this.pattern = null;
        this.inputTimeZone = false;
        this.intlFormatter = new Intl.DateTimeFormat(getLocale(), options);
        let tmpOptions = options || {};
        this.resOptions = this.intlFormatter.resolvedOptions();
        this.resOptions.isoStrFormat = tmpOptions.isoStrFormat || 'auto';
        this.resOptions.twoDigitYearStart = tmpOptions.twoDigitYearStart || 1950;
        this.resOptions.lenientParse = tmpOptions.lenientParse || 'full';
        if (tmpOptions.timeZone) {
            this.inputTimeZone = true;
        }
    }
    format(value) {
        const isoStr = this.normalizeIsoString(value);
        const fmt = this.intlFormatter.format(new Date(isoStr));
        return fmt;
    }
    parse(str) {
        if (str === undefined || str === null || str === '') {
            const msg = 'input value of the parse method cannot be empty';
            throw new Error(msg);
        }
        const cal = CalendarUtils.getCalendar(getLocale(), this.resOptions.calendar);
        const localeElements = __getBundle();
        try {
            const result = NativeParserImpl.parseImpl(str, this._getPatternFromOptions(this.resOptions), this.resOptions, localeElements, cal);
            const parsed = result.value;
            if (parsed) {
                if (result.warning) {
                    warn('The value ' + str + ' was leniently parsed to represent a date ' + parsed);
                }
            }
            return parsed;
        }
        catch (e) {
            const converterError = NativeConverterErrorHandler.processError(e, str, this.getHintValue());
            throw converterError;
        }
    }
    resolvedOptions() {
        if (!this.resOptions.patternFromOptions) {
            this.resOptions.patternFromOptions = this._getPatternFromOptions(this.resOptions);
        }
        return this.resOptions;
    }
    normalizeIsoString(value) {
        if (value === undefined || value === null || value === '') {
            const msg = 'input value of the format method cannot be empty';
            throw new Error(msg);
        }
        if (value.startsWith('T')) {
            const localeElements = __getBundle();
            let curDate = '';
            if (this.inputTimeZone) {
                curDate = NativeParserImpl.getTimeZoneCurrentDate(this.resOptions.timeZone);
            }
            else {
                curDate = LocalOraI18nUtils$1.dateToLocalIso(new Date()).split('T')[0];
            }
            value = curDate + value;
        }
        else if (value.indexOf('T') === -1) {
            value = value + 'T00:00:00';
        }
        const exe = LocalOraI18nUtils$1._ISO_DATE_REGEXP.exec(value);
        if (!exe) {
            const error = new Error('');
            const errorInfo = {
                errorCode: 'invalidISOString',
                parameterMap: {
                    isoStr: value
                }
            };
            error['errorInfo'] = errorInfo;
            const e = NativeConverterErrorHandler.processError(error, '', '');
            throw e;
        }
        if (this.inputTimeZone) {
            let islocalTimeZone = false;
            const localTimeZone = NativeParserImpl.getLocalSystemTimeZone();
            if (localTimeZone === this.resOptions.timeZone) {
                islocalTimeZone = true;
            }
            let timePart = value.substring(value.indexOf('T'));
            const isLocalValue = timePart.indexOf('Z') === -1 &&
                timePart.indexOf('+') === -1 &&
                timePart.indexOf('-') === -1;
            if (isLocalValue && !islocalTimeZone) {
                const parts = LocalOraI18nUtils$1._IsoStrParts(value);
                const dateParts = {
                    year: parts[0],
                    month: parts[1],
                    date: parts[2],
                    hours: parts[3],
                    minutes: parts[4]
                };
                let offset = getISODateOffset(dateParts, this.resOptions.timeZone);
                offset = LocalOraI18nUtils$1.getTimeStringFromOffset('', offset, false, true);
                value = value + offset;
            }
        }
        value = value.replace(/(T.*?[+-]..$)/, '$1:00');
        return value;
    }
    getHintValue() {
        const DEFAULT_DATE = '1998-11-29T15:45:31';
        let value = '';
        try {
            value = this.format(DEFAULT_DATE);
        }
        catch (e) {
            value = '';
        }
        return value;
    }
    static getPatternFromOptionsImpl(formatter, options) {
        const isoSTr = '2000-01-02T00:00:00';
        const date = new Date(isoSTr);
        let pattern = '';
        let optVal = '';
        let token = null;
        let dtokenMap = null;
        let ttokenMap = null;
        let dateStyle = false;
        let timeStyle = false;
        if (options.dateStyle !== undefined) {
            dtokenMap = NativeDateTimeConstants._dateTimeFormats.dateStyle;
            dtokenMap = dtokenMap[options.dateStyle];
            dateStyle = true;
        }
        if (options.timeStyle !== undefined) {
            ttokenMap = NativeDateTimeConstants._dateTimeFormats.timeStyle;
            ttokenMap = ttokenMap[options.timeStyle];
            timeStyle = true;
        }
        let tokenMap = NativeDateTimeConstants._tokenMap;
        formatter.formatToParts(date).map(({ type, value }) => {
            switch (type) {
                case 'literal':
                    token = value.replace(NativeDateTimeConstants._ALPHA_REGEXP, "'$1'");
                    break;
                case 'dayPeriod':
                    token = 'a';
                    break;
                case 'hour':
                    if (timeStyle) {
                        token = ttokenMap[type];
                    }
                    else {
                        optVal = options[type];
                        token = tokenMap[type][optVal];
                    }
                    let ish12 = options.hour12;
                    if (ish12 === undefined) {
                        ish12 = false;
                    }
                    if (options.hourCycle) {
                        token = token.replace(NativeDateTimeConstants._HOUR12_REGEXP, NativeDateTimeConstants._hourCycleMap[options.hourCycle]);
                    }
                    if (ish12 === true) {
                        token = token.replace(NativeDateTimeConstants._HOUR12_REGEXP, 'h');
                    }
                    break;
                case 'month':
                    if (dateStyle) {
                        if (isNaN(+value)) {
                            token = dtokenMap.month_m;
                        }
                        else {
                            token = dtokenMap.month_s;
                        }
                    }
                    else {
                        optVal = options[type];
                        token = tokenMap[type][optVal];
                    }
                    break;
                case 'year':
                case 'day':
                case 'weekday':
                    if (dateStyle) {
                        token = dtokenMap[type];
                    }
                    else {
                        optVal = options[type];
                        token = tokenMap[type][optVal];
                    }
                    break;
                case 'minute':
                case 'second':
                case 'timeZoneName':
                    if (timeStyle) {
                        token = ttokenMap[type];
                    }
                    else {
                        optVal = options[type];
                        token = tokenMap[type][optVal];
                    }
                    break;
                case 'era':
                    optVal = options[type] || 'short';
                    token = tokenMap[type][optVal];
                    break;
                case 'fractionalSecond':
                    token = options.fractionalSecondDigits;
                    token = tokenMap[type][token];
                    break;
                default:
                    break;
            }
            pattern += token;
        });
        return pattern;
    }
    _getPatternFromOptions(resolvedOptions) {
        if (!this.pattern) {
            this.pattern = NativeDateTimeConverter.getPatternFromOptionsImpl(this.intlFormatter, resolvedOptions);
        }
        return this.pattern;
    }
}

const LocalOraI18nUtils$2 = OraI18nUtils;
class NativeDateTimePatternConverter extends NativeDateTimeConverter {
    constructor(options) {
        const processOptionsObj = NativeDateTimePatternConverter._processOptions(options);
        super(processOptionsObj.opts);
        this.formatTokens = processOptionsObj.formatTokens;
        this.pattern = options.pattern;
        this.timeZone = this.resOptions.timeZone;
    }
    format(isostrvalue) {
        const isoStr = this.normalizeIsoString(isostrvalue);
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
            const parts = LocalOraI18nUtils$2._IsoStrParts(isoStr);
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
                    formatOffset =
                        (offset < 0 ? '-' : '+') +
                            LocalOraI18nUtils$2.padZeros(Math.floor(Math.abs(offset / 60)), 2) +
                            LocalOraI18nUtils$2.padZeros(Math.floor(Math.abs(offset % 60)), 2);
                    break;
                case 'tzhsepm':
                    formatOffset =
                        (offset < 0 ? '-' : '+') +
                            LocalOraI18nUtils$2.padZeros(Math.floor(Math.abs(offset / 60)), 2) +
                            ':' +
                            LocalOraI18nUtils$2.padZeros(Math.floor(Math.abs(offset % 60)), 2);
                    break;
                case 'tzh':
                    formatOffset =
                        (offset < 0 ? '-' : '+') +
                            LocalOraI18nUtils$2.padZeros(Math.floor(Math.abs(offset / 60)), 2);
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
        NativeDateTimeConstants._TOKEN_REGEXP.lastIndex = 0;
        for (;;) {
            let index = NativeDateTimeConstants._TOKEN_REGEXP.lastIndex;
            const match = NativeDateTimeConstants._TOKEN_REGEXP.exec(pattern);
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
                if (NativeDateTimeConstants._PROPERTIES_MAP[m] !== undefined) {
                    const key = NativeDateTimeConstants._PROPERTIES_MAP[m].key;
                    const type = NativeDateTimeConstants._PROPERTIES_MAP[m].type;
                    if (key !== undefined) {
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

class DateTimePreferencesUtils {
    static getPreferencesMergedWithConverterOptions(cnvOptions) {
        let userPrefPatternTimezone = DateTimePreferencesUtils._getPreferencesPatternAndTimezone(cnvOptions);
        let mo = {};
        Object.assign(mo, userPrefPatternTimezone, cnvOptions);
        return mo;
    }
    static _getPreferencesPatternAndTimezone(cnvOptions) {
        const userPrefOptions = getDateTimePreferences();
        const noUserPrefOptions = !userPrefOptions || Object.keys(userPrefOptions).length === 0;
        if (noUserPrefOptions) {
            return {};
        }
        let optionsToUse = {};
        const noCnvOptions = !cnvOptions || Object.keys(cnvOptions).length === 0;
        if (noCnvOptions) {
            const userPattern = DateTimePreferencesUtils._getUserPrefPattern('short', null, userPrefOptions);
            if (userPattern) {
                optionsToUse.pattern = userPattern;
            }
        }
        else if (cnvOptions.dateStyle || cnvOptions.timeStyle) {
            const userPattern = DateTimePreferencesUtils._getUserPrefPattern(cnvOptions.dateStyle, cnvOptions.timeStyle, userPrefOptions);
            if (userPattern) {
                optionsToUse.pattern = userPattern;
            }
        }
        if (userPrefOptions.timeZone) {
            optionsToUse.timeZone = userPrefOptions.timeZone;
        }
        return optionsToUse;
    }
    static _getUserPrefPattern(dateStyleCnvOption, timeStyleCnvOption, userPrefOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if ((!dateStyleCnvOption && !timeStyleCnvOption) || !userPrefOptions) {
            return null;
        }
        let datePattern = null;
        let timePattern = null;
        if (dateStyleCnvOption === 'short') {
            datePattern = (_b = (_a = userPrefOptions.dateStyle) === null || _a === void 0 ? void 0 : _a.short) !== null && _b !== void 0 ? _b : null;
        }
        else if (dateStyleCnvOption === 'medium') {
            datePattern = (_d = (_c = userPrefOptions.dateStyle) === null || _c === void 0 ? void 0 : _c.medium) !== null && _d !== void 0 ? _d : null;
        }
        if (timeStyleCnvOption === 'short') {
            timePattern = (_f = (_e = userPrefOptions.timeStyle) === null || _e === void 0 ? void 0 : _e.short) !== null && _f !== void 0 ? _f : null;
        }
        else if (timeStyleCnvOption === 'medium') {
            timePattern = (_h = (_g = userPrefOptions.timeStyle) === null || _g === void 0 ? void 0 : _g.medium) !== null && _h !== void 0 ? _h : null;
        }
        let userPrefPattern = DateTimePreferencesUtils._combinePatternsWithSpace(datePattern, timePattern);
        return userPrefPattern;
    }
    static _combinePatternsWithSpace(datePattern, timePattern) {
        let userPrefPattern;
        if (datePattern && timePattern) {
            userPrefPattern = `${datePattern} ${timePattern}`;
        }
        else if (timePattern) {
            userPrefPattern = timePattern;
        }
        else if (datePattern) {
            userPrefPattern = datePattern;
        }
        else {
            userPrefPattern = null;
        }
        return userPrefPattern;
    }
}

export { DateTimePreferencesUtils, NativeDateTimeConverter, NativeDateTimePatternConverter, NativeParserImpl, getISODateOffset };
