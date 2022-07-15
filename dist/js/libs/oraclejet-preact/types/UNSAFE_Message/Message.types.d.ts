/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export declare const variants: ("inline" | "banner")[];
export declare type MessageVariant = typeof variants[number];
export declare const severities: ("none" | "warning" | "info" | "confirmation" | "error")[];
export declare type MessageSeverity = typeof severities[number];
