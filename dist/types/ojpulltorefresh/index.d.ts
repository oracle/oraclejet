/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export function setupPullToRefresh(element: Element, refreshFunc: (() => Promise<any>), options?: {
    threshold?: number;
    primaryText?: string;
    secondaryText?: string;
    refresherElement?: Element;
}): void;
export function tearDownPullToRefresh(element: Element): void;
