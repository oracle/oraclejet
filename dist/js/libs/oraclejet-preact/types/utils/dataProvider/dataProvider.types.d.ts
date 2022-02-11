/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * The interface for ItemMessage
 */
export declare type ItemMessage = {
    detail: string;
    severity?: ItemMessage.SEVERITY_TYPE | ItemMessage.SEVERITY_LEVEL;
    summary: string;
};
declare namespace ItemMessage {
    type SEVERITY_TYPE = 'confirmation' | 'info' | 'warning' | 'error' | 'fatal';
    type SEVERITY_LEVEL = 1 | 2 | 3 | 4 | 5;
}
/**
 * The interface for ItemMetadata<K>
 */
export declare type ItemMetadata<K> = {
    readonly key: K;
    readonly message?: ItemMessage;
    [propName: string]: any;
};
/**
 * The interface for Item<K, D>
 * Note: Using `Item` instead of `ItemContext` as context refers to preact Context in
 * this package.
 */
export declare type Item<K, D> = {
    readonly key: K;
    readonly data: D;
    readonly metadata?: ItemMetadata<K>;
};
export {};
