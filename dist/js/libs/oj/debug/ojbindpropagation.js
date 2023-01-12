/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

    const ROOT_BINDING_PROPAGATION = Symbol('RootBindingPropagation');
    function getPropagationMetadataViaCache(elemName, compMetadata) {
        var _a, _b, _c;
        let entry = _bindingPropagationMetadataCache.get(elemName);
        if (entry !== undefined) {
            return entry;
        }
        entry = null;
        const metadataProps = (_a = compMetadata.properties) !== null && _a !== void 0 ? _a : {};
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
        const rootProvideMeta = (_c = (_b = compMetadata.extension) === null || _b === void 0 ? void 0 : _b['_BINDING']) === null || _c === void 0 ? void 0 : _c.provide;
        if (rootProvideMeta) {
            entry = entry !== null && entry !== void 0 ? entry : new Map();
            entry.set(ROOT_BINDING_PROPAGATION, [rootProvideMeta, undefined]);
        }
        _bindingPropagationMetadataCache.set(elemName, entry);
        return entry;
    }
    const _bindingPropagationMetadataCache = new Map();

    exports.ROOT_BINDING_PROPAGATION = ROOT_BINDING_PROPAGATION;
    exports.getPropagationMetadataViaCache = getPropagationMetadataViaCache;

    Object.defineProperty(exports, '__esModule', { value: true });

});
