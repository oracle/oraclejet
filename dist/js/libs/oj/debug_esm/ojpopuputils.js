/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { isLogicalAncestor as isLogicalAncestor$1 } from '@oracle/oraclejet-preact/utils/UNSAFE_popupUtils';

/**
 *
 * @ojmodulecontainer ojpopuputils
 * @ojtsmodule
 * @ojhidden
 * @since 19.0.0
 *
 * @classdesc
 * <p>
 *    This module contains a utility function <code>isLogicalAncestor()</code> that allows to link
 *    reparented popup content to its logical ancestor.
 * </p>
 */

/**
 *
 * Utility function that checks if two DOM nodes are directly or logically connected
 *
 * @ojexports
 * @memberof ojpopuputils
 * @method
 * @name isLogicalAncestor
 * @param {Node} ancestorNode - the assumed ancestor node
 * @param {Node} node - child node
 * @return {boolean} true if the two DOM nodes are directly or logically connected, false otherwise.
 */

function isLogicalAncestor(ancestorNode, node) {
    return isLogicalAncestor$1(ancestorNode, node);
}

export { isLogicalAncestor };
