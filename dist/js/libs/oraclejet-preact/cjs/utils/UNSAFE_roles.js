/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_UNSAFE_arrayUtils = require('./UNSAFE_arrayUtils.js');

/**
 * This file contains valid types and string literal arrays for aria roles
 * https://www.w3.org/WAI/PF/aria/roles#role_definitions_header
 */
// Roles that act as standalone user interface components or as part of a larger composition
const widget = utils_UNSAFE_arrayUtils.stringLiteralArray([
    'alertdialog',
    'button',
    'checkbox',
    'dialog',
    'gridcell',
    'link',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'option',
    'progressbar',
    'radio',
    'scrollbar',
    'slider',
    'spinbutton',
    'switch',
    'tab',
    'tabpanel',
    'textbox',
    'tooltip',
    'treeitem'
]);
const button = utils_UNSAFE_arrayUtils.stringLiteralArray([
    'checkbox',
    'link',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'radio',
    'switch',
    'tab'
]);
// Roles that act as composite components. These roles typically act as containers that manage other, contained components.
const compositeWidget = utils_UNSAFE_arrayUtils.stringLiteralArray([
    'combobox',
    'grid',
    'listbox',
    'menu',
    'menubar',
    'radiogroup',
    'tablist',
    'tree',
    'treegrid'
]);
// Roles that describe structures that organize content. Document structures are not usually interactive.
const content = utils_UNSAFE_arrayUtils.stringLiteralArray([
    'article',
    'columnheader',
    'definition',
    'directory',
    'document',
    'group',
    'heading',
    'img',
    'list',
    'listitem',
    'math',
    'note',
    'presentation',
    'region',
    'row',
    'rowheader',
    'separator',
    'toolbar'
]);
const liveRegion = utils_UNSAFE_arrayUtils.stringLiteralArray(['alert', 'log', 'marquee', 'status', 'timer']);
// Roles that act as navigational landmarks - should appear only once per page
const landmark = utils_UNSAFE_arrayUtils.stringLiteralArray([
    'application',
    'banner',
    'complementary',
    'contentinfo',
    'form',
    'main',
    'navigation',
    'search'
]);
const roles = Object.freeze(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, button), compositeWidget), content), landmark), liveRegion), widget));

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.button = button;
exports.compositeWidget = compositeWidget;
exports.content = content;
exports.landmark = landmark;
exports.liveRegion = liveRegion;
exports.widget = widget;
/*  */
//# sourceMappingURL=UNSAFE_roles.js.map
