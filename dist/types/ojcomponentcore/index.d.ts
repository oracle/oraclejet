/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export function subtreeAttached(node: Element): void;
export function subtreeDetached(node: Element): void;
export function subtreeHidden(node: Node): void;
export function subtreeShown(node: Node, options?: {
    initialRender: boolean;
}): void;
