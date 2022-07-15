/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var preact = require('preact');

/**
 * Component that renders an array of data.
 */
function Collection({ items, children }) {
    return (jsxRuntime.jsx(preact.Fragment, { children: items.map((data, index) => {
            let ctx = { index, data };
            return children(ctx);
        }) }));
}

exports.Collection = Collection;
/*  */
//# sourceMappingURL=Collection-86dbad21.js.map
