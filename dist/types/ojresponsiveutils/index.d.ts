/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export function compare(size1: SCREEN_RANGE, size2: SCREEN_RANGE): number;
export function getFrameworkQuery(frameworkQueryKey: FRAMEWORK_QUERY_KEY): string | null;
export type FRAMEWORK_QUERY_KEY = "sm-up" | "md-up" | "lg-up" | "xl-up" | "xxl-up" | "sm-only" | "md-only" | "lg-only" | "xl-only" | "md-down" | "lg-down" | "xl-down" | "high-resolution";
export type SCREEN_RANGE = "sm" | "md" | "lg" | "xl" | "xxl";
