/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { getElementRegistration } from 'ojs/ojcustomelement-registry';

const STATIC_PROPAGATION = Symbol('StaticContextPropagation');
const CONSUMED_CONTEXT = Symbol('ConsumedContext');
function getPropagationMetadataViaCache(elemName, compMetadata) {
    let entry = _bindingPropagationMetadataCache.get(elemName);
    if (entry !== undefined) {
        return entry;
    }
    entry = null;
    const metadataProps = compMetadata.properties ?? {};
    const propKeys = Object.keys(metadataProps);
    propKeys.forEach((pName) => {
        const meta = metadataProps[pName];
        const provideMeta = meta?.binding?.provide;
        const consumeMeta = meta?.binding?.consume;
        if (provideMeta || consumeMeta) {
            if (meta.properties) {
                throw new Error('Propagating complex properties is not supported!');
            }
            entry = entry ?? new Map();
            entry.set(pName, [provideMeta, consumeMeta]);
        }
    });
    const staticProvideMeta = compMetadata.extension?.['_BINDING']?.provide;
    if (staticProvideMeta) {
        entry = entry ?? new Map();
        const provideMap = new Map();
        staticProvideMeta.forEach((value, key) => {
            provideMap.set(key, { name: key, default: value });
        });
        entry.set(STATIC_PROPAGATION, [provideMap, undefined]);
    }
    const consumedContexts = getElementRegistration(elemName)?.cache?.contexts;
    if (consumedContexts) {
        entry.set(CONSUMED_CONTEXT, [undefined, consumedContexts]);
    }
    _bindingPropagationMetadataCache.set(elemName, entry);
    return entry;
}
const _bindingPropagationMetadataCache = new Map();

export { CONSUMED_CONTEXT, STATIC_PROPAGATION, getPropagationMetadataViaCache };
