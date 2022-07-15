/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks_UNSAFE_useToggle = require('./UNSAFE_useToggle.js');
require('preact/hooks');

/**
 * Get status on whether target has touch or not
 * @returns
 */
function useTouch(settings = { isDisabled: false }) {
    const { bool, setTrue, setFalse } = hooks_UNSAFE_useToggle.useToggle(false);
    const touchProps = settings.isDisabled
        ? {}
        : {
            onTouchStart: setTrue,
            onTouchEnd: setFalse
        };
    return {
        isTouch: settings.isDisabled ? false : bool,
        touchProps: touchProps
    };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useTouch = useTouch;
/*  */
//# sourceMappingURL=UNSAFE_useTouch.js.map
