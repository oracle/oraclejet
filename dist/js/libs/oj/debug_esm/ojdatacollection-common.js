/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { getNoJQFocusHandlers as getNoJQFocusHandlers$1 } from 'ojs/ojdomutils';
import { error } from 'ojs/ojlogger';
import { getFocusableElementsInNode as getFocusableElementsInNode$1, checkVisibility, disableElement as disableElement$1, disableAllFocusableElements as disableAllFocusableElements$1, enableAllFocusableElements as enableAllFocusableElements$1, getActionableElementsInNode as getActionableElementsInNode$1, getLogicalChildPopup as getLogicalChildPopup$1 } from 'ojs/ojkeyboardfocus-utils';

/**
 * This class contains utility methods used by the data collection components (DataGrid, Listview, and Table).
 * @private
 */
const DataCollectionUtils = function () {};

/**
 * @private
 */
DataCollectionUtils._DATA_OJ_TABMOD = 'data-oj-tabmod';

/**
 * @private
 */
DataCollectionUtils._FOCUSABLE_ELEMENTS_TAG = [
  'input',
  'select',
  'button',
  'a',
  'textarea',
  'object'
];

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
  return getFocusableElementsInNode$1(node, skipVisibilityCheck);
};

/**
 * Check if the specified element is visible
 * @param {Element} element
 * @private
 */
DataCollectionUtils.checkVisibility = function (element) {
  return checkVisibility(element);
};

/**
 * Make the specified element unfocusable
 * @param {Element} element
 * @private
 */
DataCollectionUtils.disableElement = function (element) {
  disableElement$1(element);
};

/**
 * Make all focusable elements within the specified element unfocusable
 * @param {Element} element
 * @param {boolean=} excludeActiveElement
 * @param {boolean=} includeReadonly
 * @return {Element[]} An array of the disabled elements
 * @private
 */
DataCollectionUtils.disableAllFocusableElements = function (
  element,
  excludeActiveElement,
  includeReadonly
) {
  return disableAllFocusableElements$1(element, excludeActiveElement, includeReadonly);
};

/**
 * Enable all focusable elements within the specified element that were previously disabled
 * @param {Element} element
 * @return {Element[]} An array of the enabled elements
 * @private
 */
DataCollectionUtils.enableAllFocusableElements = function (element) {
  return enableAllFocusableElements$1(element);
};

/**
 * Helper method to check if click target is selector
 * @param {Event} event
 * @return {boolean} boolean if the click event target is selector
 * @private
 */
DataCollectionUtils.isFromDefaultSelector = function (event) {
  return event.target.classList.contains('oj-selectorbox');
};

/**
 * Finds all the actionable elements in a node including ones with tabmod on them (disabled by us)
 * @param {Element} element
 * @return {Element[]} An array of the enabled elements
 * @private
 */
DataCollectionUtils.getActionableElementsInNode = function (element) {
  return getActionableElementsInNode$1(element);
};

/**
 * Checks if the element is focusable or is contained inside a focusable element
 * @param {Element|undefined|null} element
 * @param {function=} stopCondition
 */
DataCollectionUtils.isElementOrAncestorFocusable = function (element, stopCondition) {
  if (element == null || (stopCondition && stopCondition(element))) {
    return false;
  } else if (element.hasAttribute(DataCollectionUtils._DATA_OJ_TABMOD)) {
    return true;
  } else if (element.tabIndex >= 0) {
    return true;
  } else if (
    DataCollectionUtils._FOCUSABLE_ELEMENTS_TAG.indexOf(element.tagName.toLowerCase()) > -1
  ) {
    return true;
  }

  return DataCollectionUtils.isElementOrAncestorFocusable(element.parentElement, stopCondition);
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
  return element.dataset.ojClickthrough === 'disabled';
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

  return (
    agentInfo.os === oj.AgentUtils.OS.IOS ||
    agentInfo.os === oj.AgentUtils.OS.ANDROID ||
    agentInfo.os === oj.AgentUtils.OS.WINDOWSPHONE
  );
};

DataCollectionUtils.getNoJQFocusHandlers = function (focusIn, focusOut) {
  return getNoJQFocusHandlers$1(focusIn, focusOut);
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
  _F2_CODE: 113,
  _NUM5_KEY: '5',
  _NUM5_KEY_CODE: 53,
  _LETTER_A: 'a',
  _LETTER_A_UPPERCASE: 'A',
  _LETTER_A_CODE: 65,
  _META: 'Meta',
  _META_CODE: 91
};

/**
 * @private
 */
DataCollectionUtils.isEnterKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._ENTER ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._ENTER_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isSpaceBarKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._SPACEBAR ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._SPACEBAR_IE ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._SPACEBAR_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isEscapeKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._ESCAPE ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._ESCAPE_IE ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._ESCAPE_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isTabKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._TAB ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._TAB_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isF2KeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._F2 ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._F2_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isHomeKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._HOME ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._HOME_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isEndKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._END ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._END_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isArrowUpKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._UP ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._UP_IE ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._UP_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isArrowDownKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._DOWN ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._DOWN_IE ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._DOWN_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isArrowLeftKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._LEFT ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._LEFT_IE ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._LEFT_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isArrowRightKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._RIGHT ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._RIGHT_IE ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._RIGHT_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isNumberFiveKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._NUM5_KEY ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._NUM5_KEY_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isLetterAKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._LETTER_A ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._LETTER_A_UPPERCASE ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._LETTER_A_CODE
  );
};

/**
 * @private
 */
DataCollectionUtils.isMetaKeyEvent = function (eventKey) {
  return (
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._META ||
    eventKey === DataCollectionUtils.KEYBOARD_KEYS._META_CODE
  );
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

  var returnKeys = initialKeys.slice();
  var eventKeys = [];
  addEventDetail.keys.forEach(function (key) {
    eventKeys.push(key);
  });

  var eventBeforeKeys = [];
  // afterKeys is deprecated, but continue to support it until we can remove it.
  // forEach can be called on both array and set.
  var beforeKeyIter = addEventDetail.addBeforeKeys
    ? addEventDetail.addBeforeKeys
    : addEventDetail.afterKeys;
  if (beforeKeyIter != null) {
    beforeKeyIter.forEach(function (key) {
      eventBeforeKeys.push(key);
    });
  }

  var eventIndexes = addEventDetail.indexes;

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
        if (!DataCollectionUtils.containsKey(returnKeys, eventKey)) {
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
  } else if (eventIndexes != null && eventIndexes.length === eventKeys.length) {
    // if beforeKeys are not specified, we need to rely on the index values.
    // in order to be safely added, we need to ensure they are ordered in ascending order
    var indexItems = [];
    for (i = 0; i < eventKeys.length; i++) {
      eventKey = eventKeys[i];
      // ensure the key does not already exist in the data set
      if (!DataCollectionUtils.containsKey(returnKeys, eventKey)) {
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
  } else if (isLoadAll) {
    // if neither beforeKeys nor indexes are specified, just add all keys to the end in the current order
    eventKeys.forEach(function (key) {
      returnKeys.push(key);
    });
  }

  // return updated keys since any remaining beforeKey rows and index rows are not connected to the viewport
  return returnKeys;
};

/**
 * @private
 */
DataCollectionUtils.containsKey = function (array, key) {
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

/**
 * Helper method to calculate the offsetTop from element to ancestor
 * @param {Element} ancestor the ancestor element
 * @param {Element} element the element
 * @return {number} the distance between the specified element and ancestor
 */
DataCollectionUtils.calculateOffsetTop = function (ancestor, element) {
  var offset = 0;
  var current = element;
  while (current && current !== ancestor && ancestor.contains(current)) {
    offset += current.offsetTop;
    current = current.offsetParent;
  }

  return offset;
};

/**
 * Components that open popups (such as ojSelect, ojCombobox, ojInputDate, etc.) will trigger
 * focusout, but components don't want to exit actionable/edit mode in those cases.
 * This method should be used inside the component's focusout handler.
 * @param elem the component element
 * @return the logical popup element if one has been launched from within the component, null otherwise.
 */
DataCollectionUtils.getLogicalChildPopup = function (componentElement) {
  return getLogicalChildPopup$1(componentElement);
};

/**
 * Helper method to determine if an element is within the current viewport
 * @param {Element} elem
 * @param {Element} scroller
 */
DataCollectionUtils.isElementIntersectingScrollerBounds = function (elem, scroller) {
  var top;
  var bottom;
  var left;
  var right;
  if (scroller === document.documentElement) {
    top = 0;
    bottom = document.documentElement.clientHeight;
    left = 0;
    right = document.documentElement.clientWidth;
  } else {
    var scrollerBounds = scroller.getBoundingClientRect();
    top = scrollerBounds.top;
    bottom = scrollerBounds.bottom;
    left = scrollerBounds.left;
    right = scrollerBounds.right;
  }
  var bounds = elem.getBoundingClientRect();
  return (
    bounds.top <= bottom && bounds.bottom >= top && bounds.left <= right && bounds.right >= left
  );
};

/**
 * Helper method to complete data and metadata if either is missing from an event.
 * @param {Object} dataProvider
 * @param {Event} eventDetail event detail from dataprovider mutation event.
 */
DataCollectionUtils.getEventDetail = function (dataProvider, eventDetail) {
  // need to verify keys if we have a DataProvider that supports non-iteration 'fetchByKeys'
  return new Promise((resolve) => {
    if (eventDetail.data && eventDetail.metadata) {
      resolve(eventDetail);
    } else {
      const capability = dataProvider.getCapability('fetchByKeys');
      if (capability && capability.implementation === 'lookup') {
        dataProvider.fetchByKeys({ keys: new Set(eventDetail.keys), scope: 'global' }).then(
          (fetchByKeysResult) => {
            eventDetail.data = [];
            eventDetail.metadata = [];
            eventDetail.keys.forEach((key) => {
              const fetchByKeysValue = fetchByKeysResult.results.get(key);
              eventDetail.data.push(fetchByKeysValue.data);
              eventDetail.metadata.push(fetchByKeysValue.metadata);
            });
            resolve(eventDetail);
          },
          (reason) => {
            // something bad happened, return null.
            error('Error fetching event detail due to fetchByKeys: ' + reason);
            resolve(null);
          }
        );
      } else {
        // cant validate due to capability, return null
        error('Error fetching event detail due to fetchByKeys: capability');
        resolve(null);
      }
    }
  });
};

/**
 * Check for SDP-specific internal flag - not a public API
 */
DataCollectionUtils.isIterateAfterDoneNotAllowed = function (dataProvider) {
  if (dataProvider && dataProvider.getCapability) {
    var capability = dataProvider.getCapability('fetchFirst');
    if (capability && capability.iterateAfterDone === 'notAllowed') {
      return true;
    }
  }
  return false;
};

/**
 * Whether browser supports requestIdleCallback
 */
DataCollectionUtils.isRequestIdleCallbackSupported = function () {
  return (
    window.requestIdleCallback != null &&
    window.cancelIdleCallback != null &&
    window.IdleDeadline != null
  );
};

/**
 * Helper function which returns true if the browser is Chrome
 * @private
 */
DataCollectionUtils.isChrome = function () {
  return oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.CHROME;
};

/**
 * Helper function which returns true if the browser is FF
 * @private
 */
DataCollectionUtils.isFirefox = function () {
  return oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.FIREFOX;
};

/**
 * Helper function which returns true if the browser is IE
 * @private
 */
DataCollectionUtils.isIE = function () {
  return oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.IE;
};

/**
 * Helper function which returns true if the browser is Edge
 * @private
 */
DataCollectionUtils.isEdge = function () {
  return oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.EDGE;
};

/**
 * Helper function which returns true if the browser is Safari
 * @private
 */
DataCollectionUtils.isSafari = function () {
  return oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.SAFARI;
};

/**
 * Helper function which returns true if the os is Mac
 * @private
 */
DataCollectionUtils.isMac = function () {
  return oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.MAC;
};

/**
 * Helper function which returns true if the os is Windows
 * @private
 */
DataCollectionUtils.isWindows = function () {
  return oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.WINDOWS;
};

/**
 * Helper function which returns true if the os is IOS
 * @private
 */
DataCollectionUtils.isIos = function () {
  return oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS;
};

/**
 * Helper function which returns true if the os is Android
 * @private
 */
DataCollectionUtils.isAndroid = function () {
  return oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.ANDROID;
};

/**
 * Helper function which returns true if the engine is Blink
 * @private
 */
DataCollectionUtils.isBlink = function () {
  return oj.AgentUtils.getAgentInfo().engine === oj.AgentUtils.ENGINE.BLINK;
};

/**
 * Helper function which returns true if the engine is webkit
 * @private
 */
DataCollectionUtils.isWebkit = function () {
  return oj.AgentUtils.getAgentInfo().engine === oj.AgentUtils.ENGINE.WEBKIT;
};

/**
 * Helper function which returns browser version
 * @private
 */
DataCollectionUtils.getBrowserVersion = function () {
  return parseInt(oj.AgentUtils.getAgentInfo().browserVersion, 10);
};

const applyMergedInlineStyles = DataCollectionUtils.applyMergedInlineStyles;
const applyStyleObj = DataCollectionUtils.applyStyleObj;
const areKeySetsEqual = DataCollectionUtils.areKeySetsEqual;
const containsKey = DataCollectionUtils.containsKey;
const convertStringToStyleObj = DataCollectionUtils.convertStringToStyleObj;
const disableElement = DataCollectionUtils.disableElement;
const disableAllFocusableElements = DataCollectionUtils.disableAllFocusableElements;
const disableDefaultBrowserStyling = DataCollectionUtils.disableDefaultBrowserStyling;
const enableAllFocusableElements = DataCollectionUtils.enableAllFocusableElements;
const getActionableElementsInNode = DataCollectionUtils.getActionableElementsInNode;
const getAddEventKeysResult = DataCollectionUtils.getAddEventKeysResult;
const getDefaultScrollBarWidth = DataCollectionUtils.getDefaultScrollBarWidth;
const isElementOrAncestorFocusable = DataCollectionUtils.isElementOrAncestorFocusable;
const isIterateAfterDoneNotAllowed = DataCollectionUtils.isIterateAfterDoneNotAllowed;
const getFocusableElementsInNode = DataCollectionUtils.getFocusableElementsInNode;
const getLogicalChildPopup = DataCollectionUtils.getLogicalChildPopup;
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
const isFromDefaultSelector = DataCollectionUtils.isFromDefaultSelector;
const isF2KeyEvent = DataCollectionUtils.isF2KeyEvent;
const isHomeKeyEvent = DataCollectionUtils.isHomeKeyEvent;
const isMobileTouchDevice = DataCollectionUtils.isMobileTouchDevice;
const isSpaceBarKeyEvent = DataCollectionUtils.isSpaceBarKeyEvent;
const isTabKeyEvent = DataCollectionUtils.isTabKeyEvent;
const isNumberFiveKeyEvent = DataCollectionUtils.isNumberFiveKeyEvent;
const isLetterAKeyEvent = DataCollectionUtils.isLetterAKeyEvent;
const isMetaKeyEvent = DataCollectionUtils.isMetaKeyEvent;
const KEYBOARD_KEYS = DataCollectionUtils.KEYBOARD_KEYS;
const CHECKVIEWPORT_THRESHOLD = DataCollectionUtils.CHECKVIEWPORT_THRESHOLD;
const calculateOffsetTop = DataCollectionUtils.calculateOffsetTop;
const isElementIntersectingScrollerBounds = DataCollectionUtils.isElementIntersectingScrollerBounds;
const getEventDetail = DataCollectionUtils.getEventDetail;
const isRequestIdleCallbackSupported = DataCollectionUtils.isRequestIdleCallbackSupported;
const isChrome = DataCollectionUtils.isChrome;
const isFirefox = DataCollectionUtils.isFirefox;
const isSafari = DataCollectionUtils.isSafari;
const isEdge = DataCollectionUtils.isEdge;
const isIE = DataCollectionUtils.isIE;
const isMac = DataCollectionUtils.isMac;
const isWindows = DataCollectionUtils.isWindows;
const isIos = DataCollectionUtils.isIos;
const isAndroid = DataCollectionUtils.isAndroid;
const isWebkit = DataCollectionUtils.isWebkit;
const isBlink = DataCollectionUtils.isBlink;
const getBrowserVersion = DataCollectionUtils.getBrowserVersion;

export { CHECKVIEWPORT_THRESHOLD, KEYBOARD_KEYS, applyMergedInlineStyles, applyStyleObj, areKeySetsEqual, calculateOffsetTop, containsKey, convertStringToStyleObj, disableAllFocusableElements, disableDefaultBrowserStyling, disableElement, enableAllFocusableElements, getActionableElementsInNode, getAddEventKeysResult, getBrowserVersion, getDefaultScrollBarWidth, getEventDetail, getFocusableElementsInNode, getLogicalChildPopup, getNoJQFocusHandlers, handleActionablePrevTab, handleActionableTab, isAndroid, isArrowDownKeyEvent, isArrowLeftKeyEvent, isArrowRightKeyEvent, isArrowUpKeyEvent, isBlink, isChrome, isClickthroughDisabled, isEdge, isElementIntersectingScrollerBounds, isElementOrAncestorFocusable, isEndKeyEvent, isEnterKeyEvent, isEscapeKeyEvent, isEventClickthroughDisabled, isF2KeyEvent, isFirefox, isFromDefaultSelector, isHomeKeyEvent, isIE, isIos, isIterateAfterDoneNotAllowed, isLetterAKeyEvent, isMac, isMetaKeyEvent, isMobileTouchDevice, isNumberFiveKeyEvent, isRequestIdleCallbackSupported, isSafari, isSpaceBarKeyEvent, isTabKeyEvent, isWebkit, isWindows };
