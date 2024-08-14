/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojtranslation', '@oracle/oraclejet-preact/UNSAFE_IntlDateTime'], function (exports, Translations, UNSAFE_IntlDateTime) { 'use strict';

    class LocalDateRangeValidator {
        constructor(options) {
            if (!UNSAFE_IntlDateTime.DateTimeUtils.isDateOnlyIsoString(options.min) ||
                !UNSAFE_IntlDateTime.DateTimeUtils.isDateOnlyIsoString(options.max)) {
                throw new Error('If min/max are defined, they must be a date-only iso string.');
            }
            if (options.min &&
                options.max &&
                LocalDateRangeValidator._compareDateOnlyIsoString(options.min, options.max) > 0) {
                throw new Error('min must be less than max');
            }
            this.min = options.min;
            this.max = options.max;
            this.rangeOverflowMessageDetail = options.rangeOverflowMessageDetail;
            this.rangeUnderflowMessageDetail = options.rangeUnderflowMessageDetail;
            this.formatObj = options.formatObj;
        }
        validate(value) {
            const messageDetailRangeOverflow = this.rangeOverflowMessageDetail;
            const messageDetailRangeUnderflow = this.rangeUnderflowMessageDetail;
            const min = this.min;
            const max = this.max;
            let summary = '';
            let detail = '';
            const translations = Translations;
            let params = null;
            let minStr;
            let maxStr;
            if (value === null) {
                return;
            }
            const processValidation = () => {
                if (min) {
                    minStr = this.formatObj.format(min);
                }
                if (max) {
                    maxStr = this.formatObj.format(max);
                }
                if (min && max) {
                    if ((LocalDateRangeValidator._compareDateOnlyIsoString(value, min) >= 0 &&
                        LocalDateRangeValidator._compareDateOnlyIsoString(value, max) <= 0) ||
                        LocalDateRangeValidator._compareDateOnlyIsoString(min, max) > 0) {
                        return value;
                    }
                }
                else if (min) {
                    if (LocalDateRangeValidator._compareDateOnlyIsoString(value, min) >= 0) {
                        return value;
                    }
                }
                else if (!max || LocalDateRangeValidator._compareDateOnlyIsoString(value, max) <= 0) {
                    return value;
                }
                throw new Error();
            };
            const generateValidationError = (valStr) => {
                if (max !== null && LocalDateRangeValidator._compareDateOnlyIsoString(value, max) > 0) {
                    params = { value: valStr, max: maxStr };
                    summary = translations.getTranslatedString('oj-validator.range.date.messageSummary.rangeOverflow');
                    detail = messageDetailRangeOverflow
                        ? translations.applyParameters(messageDetailRangeOverflow, params)
                        : translations.getTranslatedString('oj-validator.range.date.messageDetail.rangeOverflow', params);
                }
                else if (min !== null &&
                    LocalDateRangeValidator._compareDateOnlyIsoString(value, min) < 0) {
                    params = { value: valStr, min: minStr };
                    summary = translations.getTranslatedString('oj-validator.range.date.messageSummary.rangeUnderflow');
                    detail = messageDetailRangeUnderflow
                        ? translations.applyParameters(messageDetailRangeUnderflow, params)
                        : translations.getTranslatedString('oj-validator.range.date.messageDetail.rangeUnderflow', params);
                }
                return [summary, detail];
            };
            try {
                processValidation();
            }
            catch (e) {
                var valStr = value ? this.formatObj.format(value) : value;
                var error = generateValidationError(valStr);
                throw new Error(error[1]);
            }
        }
        getHint() {
            let hint;
            const min = this.min;
            const max = this.max;
            const minStr = min && this.formatObj.format(min);
            const maxStr = max && this.formatObj.format(max);
            let params = null;
            const translations = Translations;
            if (min !== null && max !== null) {
                params = { min: minStr, max: maxStr };
                hint = translations.getTranslatedString('oj-validator.range.date.hint.inRange', params);
            }
            else if (min !== null) {
                params = { min: minStr };
                hint = translations.getTranslatedString('oj-validator.range.date.hint.min', params);
            }
            else if (max !== null) {
                params = { max: maxStr };
                hint = translations.getTranslatedString('oj-validator.range.date.hint.max', params);
            }
            return hint;
        }
        static _compareDateOnlyIsoString(isoStr1, isoStr2) {
            return new Date(isoStr1) - new Date(isoStr2);
        }
    }

    exports.LocalDateRangeValidator = LocalDateRangeValidator;

    Object.defineProperty(exports, '__esModule', { value: true });

});
