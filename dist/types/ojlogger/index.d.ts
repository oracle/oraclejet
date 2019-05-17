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
