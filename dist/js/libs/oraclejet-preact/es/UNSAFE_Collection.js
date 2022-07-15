/* @oracle/oraclejet-preact: 13.0.0 */
import { jsx } from 'preact/jsx-runtime';
import { Fragment } from 'preact';

/**
 * Component that renders an array of data.
 */
function Collection({ items, children }) {
    return (jsx(Fragment, { children: items.map((data, index) => {
            let ctx = { index, data };
            return children(ctx);
        }) }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { Collection };
/*  */
//# sourceMappingURL=UNSAFE_Collection.js.map
