/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojlogger', 'ojs/ojthemeutils', '@oracle/oraclejet-preact/UNSAFE_IntlDateTime'], function (exports, Logger, ojthemeutils, UNSAFE_IntlDateTime) { 'use strict';

    let dateTimePrefs = {};
    const setDateTimePreferences = (options) => {
        if (Object.isFrozen(dateTimePrefs))
            return;
        if (!hasValidOptions(options)) {
            return;
        }
        dateTimePrefs = options;
        adjustAndFreeze();
    };
    const getDateTimePreferences = () => {
        adjustAndFreeze();
        return dateTimePrefs;
    };
    const hasValidOptions = (options) => {
        const timeStylePattern = options.timeStyle?.short?.pattern;
        const dateStylePattern = options.dateStyle?.short?.pattern;
        if ((timeStylePattern && !dateStylePattern) || (dateStylePattern && !timeStylePattern)) {
            Logger.error(`timeStyle.short.pattern and dateStyle.short.pattern must be set together.`);
            return false;
        }
        if (isEmpty(options)) {
            Logger.error(`setDateTimePreferences options must not be empty.`);
            return false;
        }
        return true;
    };
    const adjustAndFreeze = () => {
        if (!Object.isFrozen(dateTimePrefs)) {
            if (isEmpty(dateTimePrefs.dateStyle) && isEmpty(dateTimePrefs.timeStyle)) {
                dateTimePrefs.dateStyle = getDateStyleShortYearFromTheme();
            }
            Object.freeze(dateTimePrefs);
        }
    };
    const getDateStyleShortYearFromTheme = () => {
        const themeOptionDefaults = ojthemeutils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {};
        let yearFormat;
        if (themeOptionDefaults.converterYear === 'numeric' ||
            themeOptionDefaults.converterYear === '2-digit') {
            yearFormat = themeOptionDefaults.converterYear;
        }
        else {
            yearFormat = 'numeric';
        }
        return { short: { year: yearFormat } };
    };
    const isEmpty = (obj) => {
        return !obj || Object.keys(obj).length === 0;
    };

    let numberPrefs = {};
    const setNumberPreferences = (options) => {
        if (Object.isFrozen(numberPrefs))
            return;
        if (!hasValidOptions$1(options)) {
            return;
        }
        numberPrefs = options;
        Object.freeze(numberPrefs);
    };
    const getNumberPreferences = () => {
        return numberPrefs;
    };
    const hasValidOptions$1 = (options) => {
        const currencyStyleOptions = options.style?.currency;
        const decimalStyleOptions = options.style?.decimal;
        let valid = true;
        if (currencyStyleOptions && !isGroupAndDecimalBothSet(currencyStyleOptions.separators)) {
            Logger.error(`style.currency.separators group and decimal must be set together.`);
            valid = false;
        }
        if (decimalStyleOptions && !isGroupAndDecimalBothSet(decimalStyleOptions.separators)) {
            Logger.error(`style.decimal.separators group and decimal must be set together.`);
            valid = false;
        }
        if (isEmpty$1(options) || (isEmpty$1(currencyStyleOptions) && isEmpty$1(decimalStyleOptions))) {
            Logger.error(`setNumberPreferences options must not be empty.`);
            valid = false;
        }
        return valid;
    };
    const isGroupAndDecimalBothSet = (separators) => {
        if (!separators) {
            return false;
        }
        if (!(separators.decimal && separators.group)) {
            return false;
        }
        return true;
    };
    const isEmpty$1 = (obj) => {
        return !obj || Object.keys(obj).length === 0;
    };

    const getMergedNumberPreferencesWithOptions = (cnvOptions) => {
        const preferenceOptions = getNumberPreferences();
        const hasNoPreferences = !preferenceOptions || Object.keys(preferenceOptions).length === 0;
        if (hasNoPreferences) {
            return cnvOptions;
        }
        const cnvOptionsHasSeparators = !isEmpty$2(cnvOptions?.separators);
        if (cnvOptionsHasSeparators) {
            return cnvOptions;
        }
        const userPrefCurrencySeparators = preferenceOptions.style?.currency?.separators;
        const userPrefDecimalSeparators = preferenceOptions.style?.decimal?.separators;
        const hasCurrencySeparators = !isEmpty$2(userPrefCurrencySeparators);
        const hasDecimalSeparators = !isEmpty$2(userPrefDecimalSeparators);
        if (!hasCurrencySeparators && !hasDecimalSeparators) {
            return cnvOptions;
        }
        if ((cnvOptions?.style === undefined || cnvOptions.style === 'decimal') && hasDecimalSeparators) {
            return mergeOptions(userPrefDecimalSeparators, cnvOptions);
        }
        if (cnvOptions?.style === 'currency' && hasCurrencySeparators) {
            return mergeOptions(userPrefCurrencySeparators, cnvOptions);
        }
        return cnvOptions;
    };
    const mergeOptions = (prefSeparators, cnvOptions) => {
        let mo = {};
        const separators = {
            separators: prefSeparators
        };
        Object.assign(mo, separators, cnvOptions);
        return mo;
    };
    const isEmpty$2 = (obj) => {
        return !obj || Object.keys(obj).length === 0;
    };

    const getMergedDateTimePreferencesWithOptions = (cnvOptions) => {
        const preferenceOptions = getDateTimePreferences();
        const hasNoPreferences = !preferenceOptions || Object.keys(preferenceOptions).length === 0;
        if (hasNoPreferences) {
            return cnvOptions;
        }
        const userPrefPattern = _getPreferencesPattern(preferenceOptions, cnvOptions);
        const dateStyleShortYearPref = preferenceOptions?.dateStyle?.short?.year;
        const dateStyleShortYearOption = userPrefPattern === undefined && dateStyleShortYearPref
            ? { dateStyleShortYear: dateStyleShortYearPref }
            : undefined;
        const timeZonePref = preferenceOptions.timeZone;
        const userPrefTimezone = timeZonePref ? { timeZone: timeZonePref } : {};
        let mo = {};
        Object.assign(mo, userPrefPattern ?? dateStyleShortYearOption, userPrefTimezone, cnvOptions);
        return mo;
    };
    const formatWithYearFormat = (formatInstance, yearInstance, value) => {
        return UNSAFE_IntlDateTime.formatWithYearFormat(formatInstance, yearInstance, value);
    };
    const _getPreferencesPattern = (preferenceOptions, cnvOptions) => {
        const noCnvOptions = !cnvOptions || Object.keys(cnvOptions).length === 0;
        if (noCnvOptions) {
            return _getNoCvtrOptionsPrefPattern(preferenceOptions);
        }
        if (cnvOptions.dateStyle !== 'short' && cnvOptions.timeStyle !== 'short') {
            return undefined;
        }
        let datePattern;
        let timePattern;
        if (cnvOptions.dateStyle === 'short' && preferenceOptions.dateStyle?.short?.pattern) {
            datePattern = _getShortPattern(preferenceOptions.dateStyle);
        }
        if (cnvOptions.timeStyle === 'short') {
            timePattern = _getShortPattern(preferenceOptions.timeStyle);
        }
        const completePattern = _combinePatternsWithSpace(datePattern, timePattern);
        return completePattern ? { pattern: completePattern } : undefined;
    };
    const _getNoCvtrOptionsPrefPattern = (preferenceOptions) => {
        const datePattern = _getShortPattern(preferenceOptions.dateStyle);
        return datePattern ? { pattern: datePattern } : undefined;
    };
    const _getShortPattern = (prefs) => {
        return prefs?.short?.pattern;
    };
    const _combinePatternsWithSpace = (datePattern, timePattern) => {
        if (datePattern && timePattern) {
            return `${datePattern} ${timePattern}`;
        }
        return timePattern || datePattern || undefined;
    };

    exports.formatWithYearFormat = formatWithYearFormat;
    exports.getDateTimePreferences = getDateTimePreferences;
    exports.getMergedDateTimePreferencesWithOptions = getMergedDateTimePreferencesWithOptions;
    exports.getMergedNumberPreferencesWithOptions = getMergedNumberPreferencesWithOptions;
    exports.getNumberPreferences = getNumberPreferences;
    exports.setDateTimePreferences = setDateTimePreferences;
    exports.setNumberPreferences = setNumberPreferences;

    Object.defineProperty(exports, '__esModule', { value: true });

});
