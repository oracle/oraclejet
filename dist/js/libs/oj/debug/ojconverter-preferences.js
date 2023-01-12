/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

    let dateTimePrefs = {};
    const setDateTimePreferences = (options) => {
        dateTimePrefs = Object.freeze(options);
    };
    const getDateTimePreferences = () => {
        return dateTimePrefs;
    };

    exports.getDateTimePreferences = getDateTimePreferences;
    exports.setDateTimePreferences = setDateTimePreferences;

    Object.defineProperty(exports, '__esModule', { value: true });

});
