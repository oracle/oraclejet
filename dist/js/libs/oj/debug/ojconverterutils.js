/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojlogger'], 
 function(Logger)
{
  "use strict";
class ConverterUtils {
}
ConverterUtils.getConverterInstance = function (converterOption) {
    let cTypeStr = '';
    let cOptions = {};
    let converterInstance = null;
    if (converterOption) {
        if (typeof converterOption === 'object') {
            // TODO: Should we check that it duck types Converter?
            if ((converterOption.parse && typeof converterOption.parse === 'function') ||
                (converterOption.format && typeof converterOption.format === 'function')) {
                // we are dealing with a converter instance
                converterInstance = converterOption;
            }
            else {
                // check if there is a type set
                cTypeStr = converterOption.type;
                cOptions = converterOption.options || {};
            }
        }
        if (!converterInstance) {
            // either we have an object literal or just plain string.
            cTypeStr = cTypeStr || converterOption;
            if (cTypeStr && typeof cTypeStr === 'string') {
                // if we are passed a string get registered type.
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

  ;return ConverterUtils;
});