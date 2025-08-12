/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojlogger', 'ojs/ojthemeutils', '@oracle/oraclejet-preact/UNSAFE_IntlDateTime'], function (exports, Logger, ojthemeutils, UNSAFE_IntlDateTime) { 'use strict';

    /**
     * @license
     * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */
    // Session storage
    let dateTimePrefs = {};
    const setDateTimePreferences = (options) => {
        // could have been set and frozen in the getDateTimePreferences
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
            // typescript will catch this, so this is an extra check.
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
                // We do this both in set/getDateTimePreferences because setDateTimePreferences doesn't
                // have to be called at all.
                // We set dateTimePrefs.dateStyle.short.year if apps didn't set dateStyle.short or timeStyle.short.
                dateTimePrefs.dateStyle = getDateStyleShortYearFromTheme();
            }
            Object.freeze(dateTimePrefs);
        }
    };
    const getDateStyleShortYearFromTheme = () => {
        const themeOptionDefaults = ojthemeutils.parseJSONFromFontFamily('oj-inputdatetime-option-defaults') || {};
        let yearFormat;
        // limit yearFormat in case the theme has a bug, like a typo for example.
        if (themeOptionDefaults.converterYear === 'numeric' ||
            themeOptionDefaults.converterYear === '2-digit') {
            yearFormat = themeOptionDefaults.converterYear;
        }
        else {
            yearFormat = 'numeric';
        }
        return { short: { year: yearFormat } };
        // possible optimization:
        // short gives us 2-digit for all locales we tried, so if yearFormat === '2-digit', return undefined.
        // we could not set short year at all, or when we are merging it in in the converter's format method,
        // we don't merge in if '2-digit' yearFormat.
        // I don't do this now since we didn't try every locale possible.
        // return yearFormat === 'numeric' ? { short: { year: yearFormat } } : undefined;
    };
    const isEmpty = (obj) => {
        return !obj || Object.keys(obj).length === 0;
    };

    /**
     * @license
     * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */
    // Session storage
    let numberPrefs = {};
    const setNumberPreferences = (options) => {
        if (Object.isFrozen(numberPrefs))
            return;
        // could have been set and frozen in the getNumberPreferences
        if (!hasValidOptions$1(options)) {
            return;
        }
        numberPrefs = options;
        Object.freeze(numberPrefs);
    };
    const getNumberPreferences = () => {
        return numberPrefs;
    };
    // Check the options for validity. If the options are invalid, a Logger.error will called
    // and the function returns false.
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
        // If you have a separators object, then both the decimal and group need to be set.
        if (!(separators.decimal && separators.group)) {
            return false;
        }
        return true;
    };
    const isEmpty$1 = (obj) => {
        return !obj || Object.keys(obj).length === 0;
    };

    // This takes the NumberPreferences and merges them into the NumberConverter's existing options.
    // Explicit converter options take precedence over user preferences.
    // This is called from the IntlNumberConverter and NumberConverter constructor.
    // The application is responsible for setting
    // the NumberPreferences before the page loads, so they are there when the Number Converter's constructor is called.
    const getMergedNumberPreferencesWithOptions = (cnvOptions) => {
        const preferenceOptions = getNumberPreferences();
        const hasNoPreferences = !preferenceOptions || Object.keys(preferenceOptions).length === 0;
        if (hasNoPreferences) {
            return cnvOptions;
        }
        // Does the converter's options already have separators? If so, do not use the user's separators.
        const cnvOptionsHasSeparators = !isEmpty$2(cnvOptions?.separators);
        if (cnvOptionsHasSeparators) {
            return cnvOptions;
        }
        const userPrefCurrencySeparators = preferenceOptions.style?.currency?.separators;
        const userPrefDecimalSeparators = preferenceOptions.style?.decimal?.separators;
        const hasCurrencySeparators = !isEmpty$2(userPrefCurrencySeparators);
        const hasDecimalSeparators = !isEmpty$2(userPrefDecimalSeparators);
        // Are the separators preference empty? If so, do nothing.
        if (!hasCurrencySeparators && !hasDecimalSeparators) {
            return cnvOptions;
        }
        // At this point we know that we have user preferences and the converter options do not already have separators.
        // So we merge in the separators from the preferences into the converter options.
        // If the converter has no style option, the converter defaults to decimal, so we want to merge in the decimal separators.
        if ((cnvOptions?.style === undefined || cnvOptions.style === 'decimal') && hasDecimalSeparators) {
            // merge in decimal separators and return;
            return mergeOptions(userPrefDecimalSeparators, cnvOptions);
        }
        if (cnvOptions?.style === 'currency' && hasCurrencySeparators) {
            // merge in currency separators and return.
            return mergeOptions(userPrefCurrencySeparators, cnvOptions);
        }
        // We can get here if there are preferences, but the style is one that we do not apply preferences to, like style: 'percent'.
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

    // This takes the DateTimePreferences and merges them into the DateTimeConverter's existing options.
    // We apply the pattern preferences when the options have dateStyle: 'short' and timeStyle is not specified,
    // when timeStyle: 'short' and dateStyle is not specified, or when both dateStyle and timeStyle are short.
    // For bw compatibility, we merge in user preference patterns when there are no converter options at all, and
    // we merge in user preference patterns when there is only a timeZone option.
    // Explicit converter options take precedence over user preferences; for example, if
    // the DateTimePreferences has timeZone set, that timeZone will be used for the converter if
    // the options don't already specify timeZone.
    //
    // This method is called from the IntlDateTimeConverter constructor. The application is responsible for setting
    // the DateTimePreferences before the page loads, so they are there when the IntlDateTimeConverter's constructor is called.
    // We do not merge in a four-digit year when there are no options at all, e.g., new IntlDateTimeConverter(),
    // and according to the IntlDateTimeConverter jsdoc:
    // if no options are provided, they default to day:"numeric", month:"numeric", year:"numeric".
    const getMergedDateTimePreferencesWithOptions = (cnvOptions) => {
        const preferenceOptions = getDateTimePreferences();
        const hasNoPreferences = !preferenceOptions || Object.keys(preferenceOptions).length === 0;
        if (hasNoPreferences) {
            return cnvOptions;
        }
        const userPrefPattern = _getPreferencesPattern(preferenceOptions, cnvOptions);
        // The type for the DateStylePreferences short allows for pattern OR year, never both.
        // So if there is no pattern specified, check the year.
        const dateStyleShortYearPref = preferenceOptions?.dateStyle?.short?.year;
        const dateStyleShortYearOption = userPrefPattern === undefined && dateStyleShortYearPref
            ? { dateStyleShortYear: dateStyleShortYearPref }
            : undefined;
        const timeZonePref = preferenceOptions.timeZone;
        const userPrefTimezone = timeZonePref ? { timeZone: timeZonePref } : {};
        // The options passed into the converter's constructor take precedence; e.g., if
        // new IntlDateTimeConverter({timeZone: 'America/Los_Angeles'}) is set,
        // we use this timeZone, and not the timeZone from the DateTimePreferences.
        let mo = {};
        Object.assign(mo, userPrefPattern ?? dateStyleShortYearOption, userPrefTimezone, cnvOptions);
        return mo;
    };
    const formatWithYearFormat = (formatInstance, yearInstance, value) => {
        return UNSAFE_IntlDateTime.formatWithYearFormat(formatInstance, yearInstance, value);
    };
    // Gets the DateTimePreferences date/time pattern.
    // Returns undefined if there are no user preference pattern to use.
    // Returns {pattern: string} if there is a pattern to use for dateStyle/timeStyle short.
    const _getPreferencesPattern = (preferenceOptions, cnvOptions) => {
        // If *no* converter options, get the preference 'pattern' for short dateStyle and no timeStyle.
        const noCnvOptions = !cnvOptions || Object.keys(cnvOptions).length === 0;
        // If *only* the timeZone option, get the preference 'pattern' for short dateStyle and no timeStyle.
        const timeZoneOptionOnly = cnvOptions && cnvOptions.timeZone && Object.keys(cnvOptions).length === 1;
        if (noCnvOptions || timeZoneOptionOnly) {
            return _getNoCvtrOptionsPrefPattern(preferenceOptions);
        }
        // We only apply the pattern preferences when the options have dateStyle: 'short' and timeStyle is not specified,
        // when timeStyle: 'short' and dateStyle is not specified, or when both dateStyle and timeStyle are short.
        const applyPreferences = (cnvOptions.dateStyle === 'short' && cnvOptions.timeStyle === undefined) ||
            (cnvOptions.timeStyle === 'short' && cnvOptions.dateStyle === undefined) ||
            (cnvOptions.dateStyle === 'short' && cnvOptions.timeStyle === 'short');
        if (!applyPreferences) {
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
    // If the converter has no options, we use DateTimePreferences dateStyle.short.pattern, if it exists.
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
