/* @oracle/oraclejet-preact: 13.0.0 */
import { useContext } from 'preact/hooks';
import { EnvironmentContext } from '../UNSAFE_Environment.js';
import 'preact';
import 'preact/jsx-runtime';
import '../UNSAFE_Layer.js';
import 'preact/compat';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
function useTheme() {
    return useContext(EnvironmentContext).theme;
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { useTheme };
/*  */
//# sourceMappingURL=UNSAFE_useTheme.js.map
