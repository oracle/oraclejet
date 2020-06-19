/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export let LEVEL_ERROR: number;
export let LEVEL_INFO: number;
export let LEVEL_LOG: number;
export let LEVEL_NONE: number;
export let LEVEL_WARN: number;
export function error(message?: any, ...optionalParams: any[]): void;
export function info(message?: any, ...optionalParams: any[]): void;
export function log(message?: any, ...optionalParams: any[]): void;
export function option(key?: 'level' | 'writer' | {
    level?: any;
    writer?: any;
}, value?: any): any;
export function warn(message?: any, ...optionalParams: any[]): void;
