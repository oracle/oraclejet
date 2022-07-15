/* @oracle/oraclejet-preact: 13.0.0 */
/**
 * @license
 * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * pushProps
 * @param target
 * @param key
 * @param value
 * @returns
 */
function pushProp(target, key, value) {
    if (key === 'class') {
        const oldClass = target['class'];
        target['class'] = oldClass ? [oldClass, value].join(' ').trim() : value;
    }
    else if (key === 'style') {
        if (typeof value == 'object') {
            target['style'] = Object.assign(Object.assign({}, target['style']), value);
        }
        else {
            throw new Error(`Unable to merge prop '${key}'. ` + `Only support 'style' objects not 'style' strings`);
        }
    }
    else if (typeof value === 'function') {
        const oldFn = target[key];
        target[key] = oldFn
            ? (...args) => {
                oldFn(...args);
                value(...args);
            }
            : value;
    }
    else if (
    // skip undefined values
    value === undefined ||
        // skip if same
        (typeof value !== 'object' && value === target[key])) {
        return;
    }
    else if (!(key in target)) {
        target[key] = value;
    }
    else {
        // TODO: Could just let last value win, ie:
        throw new Error(`Unable to merge prop '${key}'. ` + `Only support 'className', 'style', and event handlers`
        // Merging other allProps seems troublesome
        );
    }
}
/**
 * Merges allProps together:
 *  - duplicate className and class allProps concatenated
 *  - duplicate style allProps merged - note that only style objects supported at this point
 *  - duplicate functions chained
 * @param allProps Props to merge together.
 */
function mergeProps(...allProps) {
    if (allProps.length === 1) {
        return allProps[0];
    }
    return allProps.reduce((merged, props) => {
        for (const key in props) {
            pushProp(merged, key, props[key]);
        }
        return merged;
    }, {});
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { mergeProps };
/*  */
//# sourceMappingURL=UNSAFE_mergeProps.js.map
