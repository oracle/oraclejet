/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { getTranslatedString } from 'ojs/ojtranslation';

const _processConverterError = (e, formatter, exampleType = 'date') => {
    const cause = e.cause;
    let errorCode;
    let parameterMap = {};
    if (cause) {
        errorCode = cause.code;
        parameterMap = cause.parameterMap || {};
    }
    let summary;
    let detail;
    // Get the translated summary and detail for the error.
    if (e instanceof RangeError && errorCode) {
        const paramMapPropName = parameterMap.propertyName;
        const propName = getTranslatedString('oj-converter.datetime.datetimeOutOfRange.' + paramMapPropName);
        // this error happens during format via LocalOraI18nUtils._IsoStrParts
        // if timezone !== localtimezone and value is local and isostring has an invalid day, month, hour, etc.
        // This is not from a user error.
        // The detail might say Enter a value between '1' and '31'.
        if (errorCode === 'isoStringOutOfRange') {
            summary = getTranslatedString('oj-converter.datetime.invalidISOString.invalidRangeSummary', {
                isoStr: parameterMap.isoStr,
                propertyName: propName,
                value: parameterMap.value
            });
            detail = getTranslatedString('oj-converter.datetime.datetimeOutOfRange.detail', {
                minValue: parameterMap.minValue,
                maxValue: parameterMap.maxValue
            });
        }
        else if (errorCode === 'datetimeOutOfRange') {
            // These errors happen during parse. A user would see this error
            // if they entered an out-of-range date, like October 40, 2023.
            // The detail is Enter a value between '1' and '31'.
            summary = getTranslatedString('oj-converter.datetime.datetimeOutOfRange.summary', {
                propertyName: propName,
                value: parameterMap.value
            });
            detail = getTranslatedString('oj-converter.datetime.datetimeOutOfRange.detail', {
                minValue: parameterMap.minValue,
                maxValue: parameterMap.maxValue
            });
        }
    }
    else if (e instanceof Error && errorCode) {
        // Most of these are user errors.
        let resourceKey;
        if (errorCode === 'dateFormatMismatch') {
            // The '{value}' does not match the expected date format '{format}'.
            resourceKey = 'oj-converter.datetime.dateFormatMismatch.summary';
        }
        else if (errorCode === 'timeFormatMismatch') {
            // The {value} does not match the expected time format {format}.
            resourceKey = 'oj-converter.datetime.timeFormatMismatch.summary';
        }
        else if (errorCode === 'datetimeFormatMismatch') {
            resourceKey = 'oj-converter.datetime.datetimeFormatMismatch.summary';
        }
        else if (errorCode === 'dateToWeekdayMismatch') {
            summary = getTranslatedString('oj-converter.datetime.dateToWeekdayMismatch.summary', { date: parameterMap.date, weekday: parameterMap.weekday });
            detail = getTranslatedString('oj-converter.datetime.dateToWeekdayMismatch.detail');
        }
        else if (errorCode === 'invalidISOString') {
            // This is not a user error. It is from an app error where they provided an invalid iso string to the format function.
            summary = getTranslatedString('oj-converter.datetime.invalidISOString.summary', {
                isoStr: parameterMap.isoStr
            });
            detail = getTranslatedString('oj-converter.datetime.invalidISOString.detail');
        }
        if (resourceKey) {
            summary = getTranslatedString(resourceKey, {
                value: parameterMap.value || '',
                format: parameterMap.format
            });
            detail = getTranslatedString('oj-converter.hint.detail', {
                exampleValue: _getHintValue(formatter, exampleType)
            });
        }
    }
    // Return summary and detail, and the calling converter can create the Error. Older converters throw the oj.Converter error
    // but newer converters will throw Error(translatedMessage); from their parse and format functions.
    if (summary || detail) {
        return { summary, detail };
    }
    return { summary: e.message, detail: e.message };
};
const _getHintValue = (formatter, exampleType = 'date') => {
    const now = new Date();
    // getFullYear returns the year for the date according to local time.
    const currentYear = now.getFullYear();
    const DEFAULT_DATE = exampleType === 'datetime' ? `${currentYear}-11-29T15:45:31` : `${currentYear}-11-29`;
    let value = '';
    try {
        value = formatter(DEFAULT_DATE);
    }
    catch (e) {
        value = '';
    }
    return value;
};

export { _processConverterError };
