/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'jquery'], function(oj, $)
{
  "use strict";
/**
 * This class contains utility methods used by the data collection components (DataGrid, Listview, and Table).
 * @private
 */
var DataCollectionUtils = function () {};

/**
 * @private
 */
DataCollectionUtils._TAB_INDEX = 'tabIndex';

/**
 * @private
 */
DataCollectionUtils._DATA_OJ_TABMOD = 'data-oj-tabmod';


/** ******************* focusable/editable element related methods *****************/

/**
 * Finds all the focusable elements in a node
 * @param {Element} node
 * @param {boolean=} skipVisibilityCheck
 * @return {Element[]} An array of all of the focusable elements in a node
 * @private
 */
DataCollectionUtils.getFocusableElementsInNode = function (node, skipVisibilityCheck) {
  var inputElems = [];

  var nodes = node.querySelectorAll(
    "input, select, button, a, textarea, object, [tabIndex]:not([tabIndex='-1'])");
  var nodeCount = nodes.length;
  // in IE, each 'option' after 'select' elem will be counted as an input element(and cause duplicate input elems returned)
  // this will cause problem with TAB/Shift-TAB (recognizing whether to go to next cell or to tab within the current cell
  for (var i = 0; i < nodeCount; i++) {
    var elem = nodes[i];
    if (!elem.disabled && (skipVisibilityCheck || elem.style.display !== 'none')) {
      var tabIndex = parseInt(elem.getAttribute('tabIndex'), 10);
      if (isNaN(tabIndex) || tabIndex >= 0) {
        inputElems.push(elem);
      }
    }
  }
  return inputElems;
};

/**
 * Make all focusable elements within the specified element unfocusable
 * @param {Element} element
 * @param {boolean=} skipVisibilityCheck
 * @param {boolean=} excludeActiveElement
 * @return {Element[]} An array of the disabled elements
 * @private
 */
DataCollectionUtils.disableAllFocusableElements = function (element, skipVisibilityCheck,
  excludeActiveElement) {
  var disabledElems = [];
  // make all focusable elements non-focusable, since we want to manage tab stops
  var focusElems = DataCollectionUtils.getFocusableElementsInNode(element, skipVisibilityCheck);
  for (var i = 0; i < focusElems.length; i++) {
    if (!excludeActiveElement || focusElems[i] !== document.activeElement) {
      var tabIndex = parseInt(focusElems[i].getAttribute(DataCollectionUtils._TAB_INDEX), 10);
      // store the tabindex as an attribute
      focusElems[i].setAttribute(DataCollectionUtils._DATA_OJ_TABMOD, tabIndex);
      focusElems[i].setAttribute(DataCollectionUtils._TAB_INDEX, -1);
      disabledElems.push(focusElems[i]);
    }
  }
  return disabledElems;
};

/**
 * Enable all focusable elements within the specified element that were previously disabled
 * @param {Element} element
 * @return {Element[]} An array of the enabled elements
 * @private
 */
DataCollectionUtils.enableAllFocusableElements = function (element) {
  // make all non-focusable elements focusable again
  var focusElems = element.querySelectorAll('[' + DataCollectionUtils._DATA_OJ_TABMOD + ']');
  for (var i = 0; i < focusElems.length; i++) {
    var tabIndex = parseInt(focusElems[i].getAttribute(DataCollectionUtils._DATA_OJ_TABMOD), 10);
    focusElems[i].removeAttribute(DataCollectionUtils._DATA_OJ_TABMOD);
    // restore tabIndex as needed
    if (isNaN(tabIndex)) {
      focusElems[i].removeAttribute(DataCollectionUtils._TAB_INDEX);
    } else {
      focusElems[i].setAttribute(DataCollectionUtils._TAB_INDEX, tabIndex);
    }
  }
  return focusElems;
};

/**
 * Handle a tab that is pressed when in actionable mode
 * @param {Event} event the event causing the actionable tab
 * @param {Element|undefined|null} element to unset actionable
 * @returns {boolean} true if we have shifted focus within the actionable cell
 */
DataCollectionUtils.handleActionableTab = function (event, element) {
  var focusElems = DataCollectionUtils.getFocusableElementsInNode(element);
  if (focusElems.length > 0 && event.target === focusElems[focusElems.length - 1]) {
    // recycle to first focusable element in the cell
    focusElems[0].focus();
    return true;
  }
  // let the tab go to the next item in the cell on its own
  return false;
};

/**
 * Handle a tab that is pressed when in actionable mode
 * @param {Event} event the event causing the actionable tab
 * @param {Element|undefined|null} element to unset actionable
 * @returns {boolean} true if we have shifted focus within the actionable cell
 */
DataCollectionUtils.handleActionablePrevTab = function (event, element) {
  var focusElems = DataCollectionUtils.getFocusableElementsInNode(element);
  if (focusElems.length > 0 && event.target === focusElems[0]) {
    // recycle to last focusable element in the cell
    focusElems[focusElems.length - 1].focus();
    return true;
  }
  // let the tab go to the previous item in the cell on its own
  return false;
};

;return DataCollectionUtils;
});