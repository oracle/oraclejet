/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var UNSAFE_Environment = require('../UNSAFE_Environment.js');
require('preact');
require('preact/jsx-runtime');
require('../UNSAFE_Layer.js');
require('preact/compat');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
function useUser() {
    return hooks.useContext(UNSAFE_Environment.EnvironmentContext).user;
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useUser = useUser;
/*  */
//# sourceMappingURL=UNSAFE_useUser.js.map
