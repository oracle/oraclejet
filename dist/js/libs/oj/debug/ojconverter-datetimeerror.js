/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojtranslation'], function (exports, Translations) { 'use strict';

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
        if (e instanceof RangeError && errorCode) {
            const paramMapPropName = parameterMap.propertyName;
            const propName = Translations.getTranslatedString('oj-converter.datetime.datetimeOutOfRange.' + paramMapPropName);
            if (errorCode === 'isoStringOutOfRange') {
                summary = Translations.getTranslatedString('oj-converter.datetime.invalidISOString.invalidRangeSummary', {
                    isoStr: parameterMap.isoStr,
                    propertyName: propName,
                    value: parameterMap.value
                });
                detail = Translations.getTranslatedString('oj-converter.datetime.datetimeOutOfRange.detail', {
                    minValue: parameterMap.minValue,
                    maxValue: parameterMap.maxValue
                });
            }
            else if (errorCode === 'datetimeOutOfRange') {
                summary = Translations.getTranslatedString('oj-converter.datetime.datetimeOutOfRange.summary', {
                    propertyName: propName,
                    value: parameterMap.value
                });
                detail = Translations.getTranslatedString('oj-converter.datetime.datetimeOutOfRange.detail', {
                    minValue: parameterMap.minValue,
                    maxValue: parameterMap.maxValue
                });
            }
        }
        else if (e instanceof Error && errorCode) {
            let resourceKey;
            if (errorCode === 'dateFormatMismatch') {
                resourceKey = 'oj-converter.datetime.dateFormatMismatch.summary';
            }
            else if (errorCode === 'timeFormatMismatch') {
                resourceKey = 'oj-converter.datetime.timeFormatMismatch.summary';
            }
            else if (errorCode === 'datetimeFormatMismatch') {
                resourceKey = 'oj-converter.datetime.datetimeFormatMismatch.summary';
            }
            else if (errorCode === 'dateToWeekdayMismatch') {
                summary = Translations.getTranslatedString('oj-converter.datetime.dateToWeekdayMismatch.summary', { date: parameterMap.date, weekday: parameterMap.weekday });
                detail = Translations.getTranslatedString('oj-converter.datetime.dateToWeekdayMismatch.detail');
            }
            else if (errorCode === 'invalidISOString') {
                summary = Translations.getTranslatedString('oj-converter.datetime.invalidISOString.summary', {
                    isoStr: parameterMap.isoStr
                });
                detail = Translations.getTranslatedString('oj-converter.datetime.invalidISOString.detail');
            }
            if (resourceKey) {
                summary = Translations.getTranslatedString(resourceKey, {
                    value: parameterMap.value || '',
                    format: parameterMap.format
                });
                detail = Translations.getTranslatedString('oj-converter.hint.detail', {
                    exampleValue: _getHintValue(formatter, exampleType)
                });
            }
        }
        if (summary || detail) {
            return { summary, detail };
        }
        return { summary: e.message, detail: e.message };
    };
    const _getHintValue = (formatter, exampleType = 'date') => {
        const now = new Date();
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

    exports._processConverterError = _processConverterError;

    Object.defineProperty(exports, '__esModule', { value: true });

});
