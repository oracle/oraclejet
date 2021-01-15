/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

/**
 * This class contains utility methods used by the data collection components (DataGrid, Listview, and Table).
 * @private
 */
const DataCollectionUtils = function () {};

/**
 * @private
 */
DataCollectionUtils._TAB_INDEX = 'tabIndex';

/**
 * @private
 */
DataCollectionUtils._DATA_OJ_TABMOD = 'data-oj-tabmod';

/**
 * @private
 */
DataCollectionUtils._FOCUSABLE_ELEMENTS_QUERY = "input, select, button, a[href], textarea, object, [tabIndex]:not([tabIndex='-1'])";

/**
 * Number of times checkViewport occured during initial fetch before log a warning
 */
DataCollectionUtils.CHECKVIEWPORT_THRESHOLD = 3;

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

  // a nodes without href are not focusable
  var agentInfo = oj.AgentUtils.getAgentInfo();
  var check = true;
  if (oj.AgentUtils.BROWSER.IE === agentInfo.browser) {
    if (node.parentNode == null) {
      check = false;
    }
  }
  if (check) {
    var nodes = node.querySelectorAll(DataCollectionUtils._FOCUSABLE_ELEMENTS_QUERY);
    var nodeCount = nodes.length;
    // in IE, each 'option' after 'select' elem will be counted as an input element(and cause duplicate input elems returned)
    // this will cause problem with TAB/Shift-TAB (recognizing whether to go to next cell or to tab within the current cell
    for (var i = 0; i < nodeCount; i++) {
      var elem = nodes[i];
      if (!elem.disabled && (skipVisibilityCheck || elem.style.display !== 'none')) {
        var tabIndex = parseInt(elem.getAttribute(DataCollectionUtils._TAB_INDEX), 10);
        if (isNaN(tabIndex) || tabIndex >= 0) {
          inputElems.push(elem);
        }
      }
    }
  }
  return inputElems;
};

/**
 * Make the specified element unfocusable
 * @param {Element} element
 * @private
 */
DataCollectionUtils.disableElement = function (element) {
  var tabIndex = parseInt(element.getAttribute(DataCollectionUtils._TAB_INDEX), 10);
  // store the tabindex as an attribute
  element.setAttribute(DataCollectionUtils._DATA_OJ_TABMOD, tabIndex); // @HTMLUpdateOK
  element.setAttribute(DataCollectionUtils._TAB_INDEX, -1); // @HTMLUpdateOK
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
      DataCollectionUtils.disableElement(focusElems[i]);
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
      focusElems[i].setAttribute(DataCollectionUtils._TAB_INDEX, tabIndex); // @HTMLUpdateOK
    }
  }
  return focusElems;
};

/**
 * Finds all the focusable elements in a node including ones with tabmod on them (disbaled by us)
 * @param {Element} element
 * @return {Element[]} An array of the enabled elements
 * @private
 */
DataCollectionUtils.getFocusableElementsIncludingDisabled = function (element) {
  var inputElems = [];
  let nodes = element.querySelectorAll(DataCollectionUtils._FOCUSABLE_ELEMENTS_QUERY + ',[' + DataCollectionUtils._DATA_OJ_TABMOD + ']');
  for (var i = 0; i < nodes.length; i++) {
    var elem = nodes[i];
    if (!elem.disabled && elem.style.display !== 'none') {
      inputElems.push(elem);
    }
  }
  return inputElems;
};

/**
 * Handle a tab that is pressed when in actionable mode
 * @param {Event} event the event causing the actionable tab
 * @param {Element|undefined|null} element to unset actionable
 * @returns {boolean} true if we have shifted focus within the actionable cell
 * @private
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
 * @private
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

/**
 * Determines whether or not clickthrough is disabled for the given event
 * @param {Event} event the event to check
 * @param {Element} element the root element
 * @returns {boolean} true if clickthrough is disabled for the given event. false otherwise
 * @private
 */
DataCollectionUtils.isEventClickthroughDisabled = function (event, rootElement) {
  var node = event.target;
  while (node != null && node !== rootElement) {
    if (DataCollectionUtils.isClickthroughDisabled(node)) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

/**
 * Determines whether or not clickthrough is disabled for the given element
 * @param {Element} element the element to check
 * @returns {boolean} true if clickthrough is disabled for the given element. false otherwise
 */
DataCollectionUtils.isClickthroughDisabled = function (element) {
  return (element.dataset.ojClickthrough === 'disabled');
};

/** ******************* general collection utility methods *****************/

/**
 * Get the default scroll bar width of the given element
 * @param {Element} element the element to get the default scroll bar width of
 * @private
 */
DataCollectionUtils.getDefaultScrollBarWidth = function (element) {
  var scrollBarWidth;
  if (element && element.style) {
    // save current styling to ensure it is restored once completed
    var visibility = element.style.visibility;
    var position = element.style.position;
    var overflowY = element.style.overflowY;
    var height = element.style.height;
    var width = element.style.width;

    /* eslint-disable no-param-reassign */
    element.style.visibility = 'hidden';
    element.style.position = 'absolute';
    element.style.overflowY = 'hidden';
    element.style.height = '50px';
    element.style.width = '50px';

    // since offsetWidth includes padding and borders that clientWidth does not,
    // first save the initial difference when overflow is hidden to use below
    var initialDiff = element.offsetWidth - element.clientWidth;

    // set overflow to 'scroll', and then find the difference in offsetWidth and clientWidth
    // compared to the initial difference found above
    element.style.overflowY = 'scroll';
    scrollBarWidth = element.offsetWidth - element.clientWidth - initialDiff;

    element.style.width = width;
    element.style.height = height;
    element.style.overflowY = overflowY;
    element.style.position = position;
    element.style.visibility = visibility;
    /* eslint-enable no-param-reassign */
  }
  return scrollBarWidth;
};

/**
 * Disables unwanted default browser styling on the element specified
 * @param {Element} element the element to disable unwanted browser styling on
 * @private
 */
DataCollectionUtils.disableDefaultBrowserStyling = function (element) {
  // attribute to disable auto links for phone numbers on ie/edge which break accessibility
  element.setAttribute('x-ms-format-detection', 'none');
};

/**
 * Merges additional styling with an element's existing styling.
 * @param {Element} element the element to apply the merged styling to
 * @param {string} initStyle the current style string of the element
 * @param {string} addedStyle the additional style string to apply to the element
 */
DataCollectionUtils.applyMergedInlineStyles = function (element, initStyle, addedStyle) {
  var addedStyleObj = DataCollectionUtils.convertStringToStyleObj(addedStyle);
  var initStyleObj = DataCollectionUtils.convertStringToStyleObj(initStyle);
  var mergedStyle = Object.assign({}, addedStyleObj, initStyleObj);
  DataCollectionUtils.applyStyleObj(element, mergedStyle);
};

/**
 * Converts an HTML inline style string to a style object whose keys represent style properties
 * and whose values represent the style values.
 * @param {string} the HTML inline style string to be converted
 * @private
 */
DataCollectionUtils.convertStringToStyleObj = function (styleString) {
  var retObj = {};
  if (styleString.split) {
    var splitArr = styleString.split(';');
    for (var i = 0; i < splitArr.length; i++) {
      var property = splitArr[i];
      if (property !== '') {
        var propArr = property.split(':');
        if (propArr.length === 2) {
          retObj[propArr[0].trim()] = propArr[1].trim();
        }
      }
    }
  }
  return retObj;
};

/**
 * Applies an object whose keys represent style properties and whose values represent the style
 * values to a given element.
 * @param {element} the element to apply the style object to
 * @param {Object} the style object to be converted
 * @private
 */
DataCollectionUtils.applyStyleObj = function (element, styleObj) {
  var stylePropArr = Object.keys(styleObj);
  var styleValArr = Object.values(styleObj);
  for (var i = 0; i < stylePropArr.length; i++) {
    /* eslint-disable no-param-reassign */
    element.style[stylePropArr[i]] = styleValArr[i];
  }
};

/**
 * Determines if the current environment is a mobile touch device
 * @returns {boolean} true if the current environment is a mobile touch device
 * @private
 */
DataCollectionUtils.isMobileTouchDevice = function () {
  var agentInfo = oj.AgentUtils.getAgentInfo();

  return (agentInfo.os === oj.AgentUtils.OS.IOS ||
          agentInfo.os === oj.AgentUtils.OS.ANDROID ||
          agentInfo.os === oj.AgentUtils.OS.WINDOWSPHONE);
};

DataCollectionUtils.getNoJQFocusHandlers = function (focusIn, focusOut) {
  var noJQFocusInHandler = function (element) {
    return focusIn($(element));
  };

  var noJQFocusOutHandler = function (element) {
    return focusOut($(element));
  };

  return { focusIn: noJQFocusInHandler, focusOut: noJQFocusOutHandler };
};

/** ******************* selected KeySet related methods *****************/

/**
 * Checks whether the given KeySet instances represent equivalent sets
 * @param {KeySet} keySet1 the first KeySet
 * @param {KeySet} keySet2 the second KeySet
 * @returns {boolean} true if the given KeySet instances represent equivalent sets
 * @private
 */
DataCollectionUtils.areKeySetsEqual = function (keySet1, keySet2) {
  if (keySet1 === keySet2) {
    return true;
  }
  var isAddAll = keySet1.isAddAll();
  if (isAddAll !== keySet2.isAddAll()) {
    return false;
  }
  var valueSet1;
  var valueSet2;
  if (isAddAll) {
    valueSet1 = keySet1.deletedValues();
    valueSet2 = keySet2.deletedValues();
  } else {
    valueSet1 = keySet1.values();
    valueSet2 = keySet2.values();
  }
  if (valueSet1.size !== valueSet2.size) {
    return false;
  }
  var valueIterator1 = valueSet1.values();
  var valueIterator2 = valueSet2.values();
  var result1 = valueIterator1.next();
  var result2 = valueIterator2.next();
  while (!result1.done) {
    if (!oj.KeyUtils.equals(result1.value, result2.value)) {
      return false;
    }
    result1 = valueIterator1.next();
    result2 = valueIterator2.next();
  }
  return true;
};


/** **************** keyboard event handling methods ****************** */

DataCollectionUtils.KEYBOARD_KEYS = {
  _SPACEBAR: ' ',
  _SPACEBAR_IE: 'SpaceBar',
  _SPACEBAR_CODE: 32,
  _ENTER: 'Enter',
  _ENTER_CODE: 13,
  _UP: 'ArrowUp',
  _UP_IE: 'Up',
  _UP_CODE: 38,
  _DOWN: 'ArrowDown',
  _DOWN_IE: 'Down',
  _DOWN_CODE: 40,
  _LEFT: 'ArrowLeft',
  _LEFT_IE: 'Left',
  _LEFT_CODE: 37,
  _RIGHT: 'ArrowRight',
  _RIGHT_IE: 'Right',
  _RIGHT_CODE: 39,
  _HOME: 'Home',
  _HOME_CODE: 36,
  _END: 'End',
  _END_CODE: 35,
  _TAB: 'Tab',
  _TAB_CODE: 9,
  _ESCAPE: 'Escape',
  _ESCAPE_IE: 'Esc',
  _ESCAPE_CODE: 27,
  _F2: 'F2',
  _F2_CODE: 113
};

/**
 * @private
 */
DataCollectionUtils.isEnterKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._ENTER ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._ENTER_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isSpaceBarKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._SPACEBAR ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._SPACEBAR_IE ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._SPACEBAR_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isEscapeKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._ESCAPE ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._ESCAPE_IE ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._ESCAPE_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isTabKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._TAB ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._TAB_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isF2KeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._F2 ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._F2_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isHomeKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._HOME ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._HOME_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isEndKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._END ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._END_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isArrowUpKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._UP ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._UP_IE ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._UP_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isArrowDownKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._DOWN ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._DOWN_IE ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._DOWN_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isArrowLeftKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._LEFT ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._LEFT_IE ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._LEFT_CODE;
};

/**
 * @private
 */
DataCollectionUtils.isArrowRightKeyEvent = function (eventKey) {
  return eventKey === DataCollectionUtils.KEYBOARD_KEYS._RIGHT ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._RIGHT_IE ||
         eventKey === DataCollectionUtils.KEYBOARD_KEYS._RIGHT_CODE;
};

/** **************** data mutation event handling methods ****************** */

/**
 * Returns the resulting array of keys from the handling of an add event.
 * @param {Array} initialKeys
 * @param {Object} addEventDetail
 * @param {boolean} isLoadAll
 */
DataCollectionUtils.getAddEventKeysResult = function (initialKeys, addEventDetail, isLoadAll) {
  var i;
  var beforeKey;
  var eventKey;
  var eventIndex;
  var beforeIndex;

  // returns an object that stores the required insertion information for a given key
  function _createAddItem(itemKey, itemIndex) {
    return { key: itemKey, index: itemIndex };
  }

  var returnKeys = [...initialKeys];
  var eventKeys = [];
  addEventDetail.keys.forEach(function (key) {
    eventKeys.push(key);
  });

  var eventBeforeKeys = [];
  // afterKeys is deprecated, but continue to support it until we can remove it.
  // forEach can be called on both array and set.
  var beforeKeyIter = addEventDetail.addBeforeKeys ?
    addEventDetail.addBeforeKeys : addEventDetail.afterKeys;
  if (beforeKeyIter != null) {
    beforeKeyIter.forEach(function (key) {
      eventBeforeKeys.push(key);
    });
  }
  // if beforeKeys are specified, they take precedence over index values.
  if (eventBeforeKeys.length === eventKeys.length) {
    // loop through the beforeKeys, and perform insertions as we find them.
    // some beforeKeys may be in our list of keys to add, so we need to continuously loop through our adds until no insertions are made.
    // at that point, any left over rows are out of our rendered viewport, and we can safely ignore them.
    var leftOverLength = 0;
    while (eventKeys.length !== leftOverLength) {
      leftOverLength = eventKeys.length;
      // loop through in reverse order as most DP impls have an increasing global index order in their events.
      for (i = eventKeys.length - 1; i >= 0; i--) {
        eventKey = eventKeys[i];
        // ensure the key does not already exist in the data set.
        if (!DataCollectionUtils._containsKey(returnKeys, eventKey)) {
          beforeKey = eventBeforeKeys[i];
          if (beforeKey != null) {
            beforeIndex = DataCollectionUtils._indexOfKey(returnKeys, beforeKey);
            if (beforeIndex !== -1) {
              returnKeys.splice(beforeIndex, 0, eventKey);
              eventBeforeKeys.splice(i, 1);
              eventKeys.splice(i, 1);
            }
          } else if (isLoadAll) {
            // null beforeKey is at the end of the data set, only add if isLoadAll
            returnKeys.push(eventKey);
            eventBeforeKeys.splice(i, 1);
            eventKeys.splice(i, 1);
          }
        }
      }
    }
  } else {
    // if beforeKeys are not specified, we need to rely on the index values.
    // in order to be safely added, we need to ensure they are ordered in ascending order
    var eventIndexes = addEventDetail.indexes;
    var indexItems = [];
    for (i = 0; i < eventKeys.length; i++) {
      eventKey = eventKeys[i];
      // ensure the key does not already exist in the data set
      if (!DataCollectionUtils._containsKey(returnKeys, eventKey)) {
        eventIndex = eventIndexes[i];
        if (eventIndex != null) {
          var added = false;
          for (var j = 0; j < indexItems.length; j++) {
            // this is the absolute event index once all updates are made - store it (sorted low to high) and add after
            if (indexItems[j].index > eventIndex) {
              indexItems.splice(j, 0, _createAddItem(eventKey, eventIndex));
              added = true;
              break;
            }
          }
          if (!added) {
            indexItems.push(_createAddItem(eventKey, eventIndex));
          }
        } else if (isLoadAll) {
          // null index is at the end of the data set, only add if isLoadAll
          returnKeys.push(eventKey);
        }
      }
    }
    // add the sorted items by index to ensure final index values are correct
    for (i = 0; i < indexItems.length; i++) {
      var indexItem = indexItems[i];
      if (indexItem.index < returnKeys.length) {
        returnKeys.splice(indexItem.index, 0, indexItem.key);
      } else if (indexItem.index === returnKeys.length && isLoadAll) {
        // only add at the end if isLoadAll
        returnKeys.push(indexItem.key);
      }
    }
  }

  // return updated keys since any remaining beforeKey rows and index rows are not connected to the viewport
  return returnKeys;
};

/**
 * @private
 */
DataCollectionUtils._containsKey = function (array, key) {
  for (var i = 0; i < array.length; i++) {
    if (oj.KeyUtils.equals(array[i], key)) {
      return true;
    }
  }
  return false;
};

/**
 * @private
 */
DataCollectionUtils._indexOfKey = function (array, key) {
  for (var i = 0; i < array.length; i++) {
    if (oj.KeyUtils.equals(array[i], key)) {
      return i;
    }
  }
  return -1;
};

const applyMergedInlineStyles = DataCollectionUtils.applyMergedInlineStyles;
const applyStyleObj = DataCollectionUtils.applyStyleObj;
const areKeySetsEqual = DataCollectionUtils.areKeySetsEqual;
const convertStringToStyleObj = DataCollectionUtils.convertStringToStyleObj;
const disableElement = DataCollectionUtils.disableElement;
const disableAllFocusableElements = DataCollectionUtils.disableAllFocusableElements;
const disableDefaultBrowserStyling = DataCollectionUtils.disableDefaultBrowserStyling;
const enableAllFocusableElements = DataCollectionUtils.enableAllFocusableElements;
const getAddEventKeysResult = DataCollectionUtils.getAddEventKeysResult;
const getDefaultScrollBarWidth = DataCollectionUtils.getDefaultScrollBarWidth;
const getFocusableElementsIncludingDisabled = DataCollectionUtils.getFocusableElementsIncludingDisabled;
const getFocusableElementsInNode = DataCollectionUtils.getFocusableElementsInNode;
const getNoJQFocusHandlers = DataCollectionUtils.getNoJQFocusHandlers;
const handleActionablePrevTab = DataCollectionUtils.handleActionablePrevTab;
const handleActionableTab = DataCollectionUtils.handleActionableTab;
const isArrowDownKeyEvent = DataCollectionUtils.isArrowDownKeyEvent;
const isArrowLeftKeyEvent = DataCollectionUtils.isArrowLeftKeyEvent;
const isArrowRightKeyEvent = DataCollectionUtils.isArrowRightKeyEvent;
const isArrowUpKeyEvent = DataCollectionUtils.isArrowUpKeyEvent;
const isClickthroughDisabled = DataCollectionUtils.isClickthroughDisabled;
const isEndKeyEvent = DataCollectionUtils.isEndKeyEvent;
const isEnterKeyEvent = DataCollectionUtils.isEnterKeyEvent;
const isEscapeKeyEvent = DataCollectionUtils.isEscapeKeyEvent;
const isEventClickthroughDisabled = DataCollectionUtils.isEventClickthroughDisabled;
const isF2KeyEvent = DataCollectionUtils.isF2KeyEvent;
const isHomeKeyEvent = DataCollectionUtils.isHomeKeyEvent;
const isMobileTouchDevice = DataCollectionUtils.isMobileTouchDevice;
const isSpaceBarKeyEvent = DataCollectionUtils.isSpaceBarKeyEvent;
const isTabKeyEvent = DataCollectionUtils.isTabKeyEvent;
const KEYBOARD_KEYS = DataCollectionUtils.KEYBOARD_KEYS;
const CHECKVIEWPORT_THRESHOLD = DataCollectionUtils.CHECKVIEWPORT_THRESHOLD;

export { CHECKVIEWPORT_THRESHOLD, KEYBOARD_KEYS, applyMergedInlineStyles, applyStyleObj, areKeySetsEqual, convertStringToStyleObj, disableAllFocusableElements, disableDefaultBrowserStyling, disableElement, enableAllFocusableElements, getAddEventKeysResult, getDefaultScrollBarWidth, getFocusableElementsInNode, getFocusableElementsIncludingDisabled, getNoJQFocusHandlers, handleActionablePrevTab, handleActionableTab, isArrowDownKeyEvent, isArrowLeftKeyEvent, isArrowRightKeyEvent, isArrowUpKeyEvent, isClickthroughDisabled, isEndKeyEvent, isEnterKeyEvent, isEscapeKeyEvent, isEventClickthroughDisabled, isF2KeyEvent, isHomeKeyEvent, isMobileTouchDevice, isSpaceBarKeyEvent, isTabKeyEvent };
