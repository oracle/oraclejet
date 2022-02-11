/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
function getPropagationMetadataViaCache(elemName, metadataProps) {
    let entry = _bindingPropagationMetadataCache.get(elemName);
    if (entry !== undefined) {
        return entry;
    }
    entry = null;
    const propKeys = Object.keys(metadataProps);
    propKeys.forEach((pName) => {
        var _a, _b;
        const meta = metadataProps[pName];
        const provideMeta = (_a = meta === null || meta === void 0 ? void 0 : meta.binding) === null || _a === void 0 ? void 0 : _a.provide;
        const consumeMeta = (_b = meta === null || meta === void 0 ? void 0 : meta.binding) === null || _b === void 0 ? void 0 : _b.consume;
        if (provideMeta || consumeMeta) {
            if (meta.properties) {
                throw new Error('Propagating complex properties is not supported!');
            }
            entry = entry !== null && entry !== void 0 ? entry : new Map();
            entry.set(pName, [provideMeta, consumeMeta]);
        }
    });
    _bindingPropagationMetadataCache.set(elemName, entry);
    return entry;
}
const _bindingPropagationMetadataCache = new Map();

export { getPropagationMetadataViaCache };
