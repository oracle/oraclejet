/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojlogger'], function (oj, Logger) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    class ConverterUtils {
    }
    ConverterUtils.getConverterInstance = function (converterOption) {
        let cTypeStr = '';
        let cOptions = {};
        let converterInstance = null;
        if (converterOption) {
            if (typeof converterOption === 'object') {
                if ((converterOption.parse && typeof converterOption.parse === 'function') ||
                    (converterOption.format && typeof converterOption.format === 'function')) {
                    converterInstance = converterOption;
                }
                else {
                    cTypeStr = converterOption.type;
                    cOptions = converterOption.options || {};
                }
            }
            if (!converterInstance) {
                cTypeStr = cTypeStr || converterOption;
                if (cTypeStr && typeof cTypeStr === 'string') {
                    if (oj.Validation && oj.Validation.converterFactory) {
                        var cf = oj.Validation.converterFactory(cTypeStr);
                        return cf.createConverter(cOptions);
                    }
                    else {
                        Logger.error('oj.Validation.converterFactory is not available and it is needed to support the deprecated json format for the converters property. Please include the backward compatibility "ojvalidation-base" module.');
                    }
                }
            }
        }
        return converterInstance;
    };

    return ConverterUtils;

});
