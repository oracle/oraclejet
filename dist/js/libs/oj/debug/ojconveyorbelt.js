/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojlogger', 'ojs/ojcontext', 'ojs/ojconfig', 'touchr'],
       function(oj, $, Components, Logger, Context, Config)
{
  "use strict";
var __oj_conveyor_belt_metadata = 
{
  "properties": {
    "contentParent": {
      "type": "string"
    },
    "orientation": {
      "type": "string",
      "enumValues": [
        "horizontal",
        "vertical"
      ],
      "value": "horizontal"
    },
    "translations": {
      "type": "object",
      "value": {}
    }
  },
  "methods": {
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};


/*
** Important:
** - This file is designed to be shared verbatim among the ADFui products.
** - Do not add framework-specific dependencies in this file (it must be self-contained).
** - Do not change this file without testing it in other ADFui products (ADF Faces, JET, etc.).
*/

/**
 * Constructor.
 * @param {Object} elem DOM element associated with the conveyor
 * @param {string} orientation Direction of scrolling, either horizontal or vertical
 * @param {Object} contentParent DOM element whose children are the items to scroll
 * @param {boolean} bRtl True if the reading direction is right-to-left, otherwise false
 * @param {Object} buttonInfo Map of properties for the following button information:
 *  - prevButtonStyleClass: Style class name to use for the scroll previous button,
 *  - nextButtonStyleClass: Style class name to use for the scroll next button,
 *  - prevButtonIcon: Icon element to use for the scroll previous button,
 *  - nextButtonIcon: Icon element to use for the scroll next button,
 * @param {Object} callbackInfo Map of properties for the following callback information:
 *  - scrollFunc: Callback function to animate scrolling a DOM element,
 *  - addResizeListener: Callback function to add a resize listener for a DOM element
 *  - removeResizeListener: Callback function to remove a resize listener for a DOM element
 *  - addStyleClassName: Callback function to add a style class name to a DOM element
 *  - removeStyleClassName: Callback functin to remove a style class name from a DOM element
 *  - hasStyleClassName: Callback function to check whether a style class name is applied
 *    to a DOM element,
 *  - filterContentElements: Callback function to filter the array of conveyor content elements,
 *  - subtreeAttached: Callback function to notify when a DOM subtree is attached,
 *  - subtreeDetached: Callback function to notify when a DOM subtree is detached,
 *  - addBusyState: Callback function to add a busy state to the busy context,
 *    has changed
 * @param {Object} styleInfo Map of properties for the following style information:
 *  - overflowContainerStyleClass: Style class name for the overflow container DOM element,
 *  - contentContainerStyleClass: Style class name for the content container DOM element,
 *  - itemStyleClass: Style class name for the DOM element of an item in the conveyor,
 *  - hiddenStyleClass: Style class name used to hide a DOM element
 * @param {Object} agentInfo Browser user agent information.
 * @class ConveyorBeltCommon
 * @memberof ConveyorBeltCommon
 * @protected
 * @constructor
 * @ignore
 * @ojtsignore
 */
function ConveyorBeltCommon(
  elem, orientation, contentParent, bRtl, buttonInfo, callbackInfo, styleInfo, agentInfo) {
  this._elem = elem;
  this._orientation = orientation;
  this._contentParent = contentParent;
  this._bRtl = bRtl;
  this._prevButtonStyleClass = buttonInfo.prevButtonStyleClass;
  this._nextButtonStyleClass = buttonInfo.nextButtonStyleClass;
  this._prevButtonIcon = buttonInfo.prevButtonIcon;
  this._nextButtonIcon = buttonInfo.nextButtonIcon;

  this._scrollFunc = callbackInfo.scrollFunc;
  this._addResizeListenerFunc = callbackInfo.addResizeListener;
  this._removeResizeListenerFunc = callbackInfo.removeResizeListener;
  this._addStyleClassNameFunc = callbackInfo.addStyleClassName;
  this._removeStyleClassNameFunc = callbackInfo.removeStyleClassName;
  this._hasStyleClassNameFunc = callbackInfo.hasStyleClassName;
  this._filterContentElementsFunc = callbackInfo.filterContentElements;
  this._subtreeDetachedFunc = callbackInfo.subtreeDetached;
  this._subtreeAttachedFunc = callbackInfo.subtreeAttached;
  this._addBusyStateFunc = callbackInfo.addBusyState;

  this._overflowContainerStyleClass = styleInfo.overflowContainerStyleClass;
  this._contentContainerStyleClass = styleInfo.contentContainerStyleClass;
  this._itemStyleClass = styleInfo.itemStyleClass;
  this._hiddenStyleClass = styleInfo.hiddenStyleClass;

  this._bExternalScroll = true;
  this._firstVisibleItemIndex = 0;
  this._agentVersion = agentInfo.browserVersion;

  // copied basic checks from AdfAgent
  var navUserAgent = navigator.userAgent;
  var agentName = navUserAgent.toLowerCase();
  if (agentName.indexOf('gecko/') !== -1) {
    this._bAgentGecko = true;
  } else if (agentInfo && agentInfo.browser === 'safari') {
    this._bAgentSafari = true;
  } else if (agentInfo && agentInfo.browser === 'edge') {
    this._bAgentEdge = true;
  } else if (agentName.indexOf('applewebkit') !== -1 ||
           agentName.indexOf('safari') !== -1) {
    this._bAgentWebkit = true;
  }
}

/**
 * Setup the conveyor belt.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 */
ConveyorBeltCommon.prototype.setup = function () {
  var self = this;
  var cbcClass = ConveyorBeltCommon;
  // create the content and overflow containers
  this._createInnerContainers();

  // create the next/prev buttons
  this._createPrevButton(this._prevButtonStyleClass, this._prevButtonIcon);
  this._createNextButton(this._nextButtonStyleClass, this._nextButtonIcon);

  var nextButton = this._nextButton;
  this._buttonWidth = nextButton.offsetWidth;
  this._buttonHeight = nextButton.offsetHeight;

  // hide the buttons until we know we need them
  this._hidePrevButton();
  this._hideNextButton();

  // handle the mouse wheel on the whole conveyor
  this._mouseWheelListener = function (event) {
    self._handleMouseWheel(event);
  };
  cbcClass._addBubbleEventListener(this._elem, 'mousewheel', this._mouseWheelListener, false);
  cbcClass._addBubbleEventListener(this._elem, 'wheel', this._mouseWheelListener, false);

  // handle swipe gestures on the overflow container, which excludes the next/prev buttons
  this._touchStartListener = function (event) {
    self._handleTouchStart(event);
  };
  cbcClass._addBubbleEventListener(this._overflowContainer, 'touchstart',
                                   this._touchStartListener, true);
  this._touchMoveListener = function (event) {
    self._handleTouchMove(event);
  };
  cbcClass._addBubbleEventListener(this._overflowContainer, 'touchmove',
                                   this._touchMoveListener, false);
  this._touchEndListener = function (event) {
    self._handleTouchEnd(event);
  };
  cbcClass._addBubbleEventListener(this._overflowContainer, 'touchend',
                                   this._touchEndListener);
  cbcClass._addBubbleEventListener(this._overflowContainer, 'touchcancel',
                                   this._touchEndListener);

  this._origScroll = 0;

  // clear any old sizes so that new sizes will be calculated
  this._clearCachedSizes();
  // adjust overflow size
  this._adjustOverflowSize(true);
  // handle an initial resize
  this._handleResize(true);

  // eslint-disable-next-line no-unused-vars
  this._handleResizeFunc = function (width, height) {
    self._handleResize(false);
  };
  // listen for resizes on both the conveyor itself and on its content
  this._addResizeListenerFunc.call(null, this._elem,
                                   this._handleResizeFunc);
  this._addResizeListenerFunc.call(null, this._contentContainer,
                                   this._handleResizeFunc);

  // notify the child that it's being re-attached to the DOM AFTER attaching it
  // (the detached notification happened in _reparentChildrenToContentContainer())
  this._subtreeAttachedFunc(this._contentContainer);
};

/**
 * Destroy the conveyor belt.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 */
ConveyorBeltCommon.prototype.destroy = function () {
  // FIX : resolve busy state when destroying
  this._resolveBusyState();

  var elem = this._elem;
  var cbcClass = ConveyorBeltCommon;
  cbcClass._removeBubbleEventListener(elem, 'mousewheel', this._mouseWheelListener, false);
  cbcClass._removeBubbleEventListener(elem, 'wheel', this._mouseWheelListener, false);
  cbcClass._removeBubbleEventListener(this._overflowContainer, 'touchstart',
                                      this._touchStartListener, true);
  cbcClass._removeBubbleEventListener(this._overflowContainer, 'touchmove',
                                      this._touchMoveListener, false);
  cbcClass._removeBubbleEventListener(this._overflowContainer, 'touchend',
                                      this._touchEndListener);
  cbcClass._removeBubbleEventListener(this._overflowContainer, 'touchcancel',
                                      this._touchEndListener);
  cbcClass._removeBubbleEventListener(this._overflowContainer, 'scroll',
                                      this._scrollListener);
  this._mouseWheelListener = null;
  this._touchStartListener = null;
  this._touchMoveListener = null;
  this._touchEndListener = null;
  this._scrollListener = null;

  // remove listeners before reparenting original children and clearing member
  // variables
  this._removeResizeListenerFunc.call(null, elem, this._handleResizeFunc);
  this._removeResizeListenerFunc.call(null,
                                      this._contentContainer, this._handleResizeFunc);
  this._handleResizeFunc = null;

  // move the original content children from the _contentContainer back to the
  // original DOM element
  this._reparentChildrenFromContentContainer(this._contentContainer, elem);

  // the content container is a child of the overflow container
  elem.removeChild(this._overflowContainer);
  elem.removeChild(this._nextButton);
  elem.removeChild(this._prevButton);

  this._nextButton = null;
  this._prevButton = null;
  this._overflowContainer = null;
  this._contentContainer = null;
  this._clearCachedSizes();

  this._elem = null;
  this._scrollFunc = null;
  this._addResizeListenerFunc = null;
  this._removeResizeListenerFunc = null;
  this._addStyleClassNameFunc = null;
  this._removeStyleClassNameFunc = null;
  this._hasStyleClassNameFunc = null;
  this._filterContentElementsFunc = null;
  this._subtreeDetachedFunc = null;
  this._subtreeAttachedFunc = null;
  this._addBusyStateFunc = null;

  this._contentParent = null;
};

/**
 * Handle a component resize.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 */
ConveyorBeltCommon.prototype.handleResize = function () {
  this._handleResize(false);
};

/**
 * Set the scroll position.
 * @param {number} scroll Desired logical scroll position
 * @param {boolean} bImmediate True to make the change immediately, false to animate it
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 */
ConveyorBeltCommon.prototype.setScroll = function (scroll, bImmediate) {
  this._setCurrScroll(scroll, bImmediate);
};

/**
 * Get the current scroll position.
 * @return {number} Logical scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 */
ConveyorBeltCommon.prototype.getScroll = function () {
  return this._getCurrScroll();
};

/**
 * Reparent the DOM child nodes from their old parent node to a new parent
 * content container node.
 * @param {Object} fromNode Old parent DOM node
 * @param {Object} toNode New parent DOM node
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._reparentChildrenToContentContainer = function (
  fromNode, toNode) {
  var fromNodeChildren = fromNode.childNodes;
  while (fromNodeChildren.length > 0) {
    var child = fromNodeChildren[0];

    // notify the child that it's being detached from the DOM BEFORE detaching it
    // (the re-attached notification will happen in setup())
    this._subtreeDetachedFunc(child);

    toNode.appendChild(child); // @HTMLUpdateOK

    if (child.nodeType === 1 && this._itemStyleClass) {
      this._addStyleClassNameFunc(child, this._itemStyleClass);
    }
  }
};

/**
 * Reparent the DOM child nodes from the content container to a new
 * parent node.
 * @param {Object} fromNode Old parent DOM node
 * @param {Object} toNode New parent DOM node
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._reparentChildrenFromContentContainer = function (
  fromNode, toNode) {
  var children = fromNode.childNodes;
  while (children.length > 0) {
    var child = children[0];
    toNode.appendChild(child); // @HTMLUpdateOK

    if (child.nodeType === 1 && this._itemStyleClass) {
      this._removeStyleClassNameFunc(child, this._itemStyleClass);
    }
  }
};

/**
 * Get the computed style of the given DOM element.
 * @param {Object} elem DOM element
 * @return {Object} Computed style for the element
 * @memberof ConveyorBeltCommon
 * @private
 */
ConveyorBeltCommon._getComputedStyle = function (elem) {
  var elemOwnerDoc = elem.ownerDocument;
  var defView = elemOwnerDoc.defaultView;
  var computedStyle = defView.getComputedStyle(elem, null);
  return computedStyle;
};

/**
 * Get the inner width of the given DOM element (inside borders and padding).
 * @param {Object} elem DOM element
 * @return {number} Width of element
 * @memberof ConveyorBeltCommon
 * @private
 */
ConveyorBeltCommon._getElemInnerWidth = function (elem) {
  var cbcClass = ConveyorBeltCommon;
  var computedStyle = cbcClass._getComputedStyle(elem);
  // the computedStyle width is the inner width of the elem
  return cbcClass._getCSSLengthAsInt(computedStyle.width);
};

/**
 * Get the inner height of the given DOM element (inside borders and padding).
 * @param {Object} elem DOM element
 * @return {number} Height of element
 * @memberof ConveyorBeltCommon
 * @private
 */
ConveyorBeltCommon._getElemInnerHeight = function (elem) {
  var cbcClass = ConveyorBeltCommon;
  var computedStyle = cbcClass._getComputedStyle(elem);
  // the computedStyle height is the inner height of the elem
  return cbcClass._getCSSLengthAsInt(computedStyle.height);
};

/**
 * Get the int value of a CSS length.
 * @param {string} cssLength cssLength as a string
 * @return {number} cssLength as an int
 * @memberof ConveyorBeltCommon
 * @private
 */
ConveyorBeltCommon._getCSSLengthAsInt = function (cssLength) {
  // this function copied from AdfAgent.getCSSLengthAsInt
  if ((cssLength.length) > 0 && (cssLength !== 'auto')) {
    // Fix  - CONVEYOR BELT TAB SCROLLING DOESN'T SCROLL THE LAST ITEM ENTIRELY INTO VIEW
    // offsetWidth/offsetHeight property will round the value to an integer
    // similarly, round the cssLength to the nearest integer
    var intLength = Math.round(parseFloat(cssLength));

    if (isNaN(intLength)) {
      intLength = 0;
    }

    return intLength;
  }
  return 0;
};

/**
 * Add a bubble event listener to the given DOM node.
 * @param {Object} node DOM node
 * @param {string} type Event type
 * @param {function(Event):void} listener Listener function
 * @param {boolean} passive passive option for listener
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @private
 */
ConveyorBeltCommon._addBubbleEventListener = function (node, type, listener, passive) {
  node.addEventListener(type, listener, { passive, capture: false });
};

/**
 * Remove a bubble event listener from the given DOM node.
 * @param {Object} node DOM node
 * @param {string} type Event type
 * @param {function(Event):void} listener Listener function
 * @param {boolean} passive passive option for listener
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @private
 */
ConveyorBeltCommon._removeBubbleEventListener = function (node, type, listener, passive) {
  node.removeEventListener(type, listener, { passive, capture: false });
};

/**
 * Get the wheel delta from a mousewheel event.
 * @param {Event} event Event object
 * @return {number} Wheel delta
 * @memberof ConveyorBeltCommon
 * @private
 */
ConveyorBeltCommon._getWheelDelta = function (event) {
  var wheelDelta = 0;
  if (event.wheelDelta != null) {
    wheelDelta = event.wheelDelta;
  } else if (event.deltaY != null) {
    wheelDelta = -event.deltaY;
  } else {
    wheelDelta = -event.detail;
  }
  return wheelDelta;
};

/**
 * Determine if this conveyor belt is horizontal or vertical.
 * @return {boolean} True if the conveyor belt is horizontal, false if vertical
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._isHorizontal = function () {
  return (this._orientation === 'horizontal');
};

/**
 * Determine if this conveyor belt is empty.
 * @return {boolean} True if the conveyor belt is empty, false if not
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._isEmpty = function () {
  var contentParent = this._getContentParent();
  return !contentParent.hasChildNodes();
};

/**
 * Restore inner DOM to its initial state before sizes were calculated.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._reinitializeInnerDom = function () {
  // restore inner DOM to initial state in order to accurately calculate new sizes

  // save original scroll value for use in _adjustOverflowSize()
  this._origScroll = this._getCurrScroll();
  this._setOverflowScroll(0);

  // hide the buttons until we know we need them
  this._hidePrevButton();
  this._hideNextButton();
};

/**
 * Clear cached sizes.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._clearCachedSizes = function () {
  this._totalSize = null;
  this._sizes = null;
};

/**
 * Handle a component resize.
 * @param {boolean} bSetup True when called from setup, false otherwise
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._handleResize = function (bSetup) {
  // if this is not the first call, need to reinitialize the inner DOM before
  // we can accurately calculate new sizes (if this is the first call, DOM
  // is already in initial state)
  if (!bSetup) {
    this._reinitializeInnerDom();
  }
  this._clearCachedSizes();
  // measure content size
  this._totalSize = this._measureContents();
  // if this is not the first call, need to adjust the overflow size (if this
  // is the first call, the overflow size was already adjusted in setup)
  if (!bSetup) {
    this._adjustOverflowSize(false);
  }
  // center buttons orthogonal to conveyor orientation
  this._alignButtons();
};

/**
 * Center the overflow buttons orthogonal to the conveyor orientation.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._alignButtons = function () {
  var nextButton = this._nextButton;
  var prevButton = this._prevButton;
  var nextButtonStyle = nextButton.style;
  var prevButtonStyle = prevButton.style;
  var contentContainer = this._contentContainer;
  var totalSize = this._totalSize;

  if (this._isHorizontal()) {
    var vOffset = 0.5 * (totalSize.h - contentContainer.offsetHeight);
    nextButtonStyle.top = vOffset + 'px';
    prevButtonStyle.top = vOffset + 'px';
  } else {
    var hOffset = 0.5 * (totalSize.w - contentContainer.offsetWidth);
    if (this._bRtl) {
      hOffset = -hOffset;
    }
    nextButtonStyle.left = hOffset + 'px';
    prevButtonStyle.left = hOffset + 'px';
  }
};

/**
 * Adjust the overflow size.
 * @param {boolean} bInit True for initialization, false for refresh
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._adjustOverflowSize = function (bInit) {
  var contentContainer = this._contentContainer;
  var bHoriz = this._isHorizontal();

  var cbcClass = ConveyorBeltCommon;
  var elemInnerSize = bHoriz ?
                      cbcClass._getElemInnerWidth(this._elem) :
                      cbcClass._getElemInnerHeight(this._elem);

  this._minScroll = 0;
  // take the button size into account for max scroll position
  this._maxScroll = bHoriz ?
    (contentContainer.offsetWidth - elemInnerSize) + this._buttonWidth :
    (contentContainer.offsetHeight - elemInnerSize) + this._buttonHeight;
  // constrain max scroll
  if (this._maxScroll < 0) {
    this._maxScroll = 0;
  }

  // hide buttons AFTER calculating sizes above, but BEFORE updating scroll position below
  this._hidePrevButton();
  this._hideNextButton();

  // refresh current scroll position AFTER calculating sizes above
  this._setCurrScroll(bInit ? this._minScroll : this._origScroll, true);
  this._origScroll = 0;
};

/**
 * Create the inner overflow and content containers.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._createInnerContainers = function () {
  // the original children of the conveyor elem will be reparented to the contentContainer;
  // the conveyor elem will contain the overflowContainer, which will contain the contentContainer,
  // which will contain the original children

  var self = this;

  var elem = this._elem;
  var cbcClass = ConveyorBeltCommon;
  var overflowContainer = document.createElement('div');
  this._overflowContainer = overflowContainer;
  this._addStyleClassNameFunc(overflowContainer, this._overflowContainerStyleClass);
  var contentContainer = document.createElement('div');
  this._contentContainer = contentContainer;
  this._addStyleClassNameFunc(contentContainer, this._contentContainerStyleClass);

  // reparent children from elem to contentContainer before adding
  // content container to elem
  this._reparentChildrenToContentContainer(elem, contentContainer);

  elem.appendChild(overflowContainer); // @HTMLUpdateOK
  overflowContainer.appendChild(contentContainer); // @HTMLUpdateOK

  // the overflow container listens to DOM scroll events in case the scroll was triggered externally,
  // for example when the user tabs through the child content
  this._scrollListener = function (event) {
    self._handleScroll(event);
  };
  cbcClass._addBubbleEventListener(overflowContainer, 'scroll', this._scrollListener);
};

/**
 * Get the content elements of the conveyor.
 * @return {Array} array of content elements
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._getContentElements = function () {
  var arContentElements = [];

  // if there is a nested contentParent, then we need to put its children into
  // arContentElements instead of the children of the contentContainer
  var parent = this._contentParent ? this._contentParent : this._contentContainer;

  var contentChildren = parent.children;
  var numContentChildren = contentChildren.length;
  var i;
  for (i = 0; i < numContentChildren; i++) {
    var child = contentChildren[i];
    if (child.nodeType === 1) {
      arContentElements.push(child);
    }
  }

  var filterFunc = this._filterContentElementsFunc;
  arContentElements = filterFunc(arContentElements);

  // if the content elements are direct children of the contentContainer, meaning there's no nested
  // contentParent, then make sure they have the itemStyleClass applied to them in case they were
  // added dynamically
  if (parent === this._contentContainer && this._itemStyleClass) {
    for (i = 0; i < arContentElements.length; i++) {
      var contentElem = arContentElements[i];
      if (!this._hasStyleClassNameFunc(contentElem, this._itemStyleClass)) {
        this._addStyleClassNameFunc(contentElem, this._itemStyleClass);
      }
    }
  }

  return arContentElements;
};

/**
 * Create the prev button.
 * @param {string} buttonStyleClass Style class to use for the button
 * @param {Node} icon Button icon element
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._createPrevButton = function (
  buttonStyleClass, icon) {
  var self = this;
  var prevButton = document.createElement('div');
  this._prevButton = prevButton;
  prevButton.setAttribute('class', buttonStyleClass);
  // hide the button from screen readers because it is not keyboard accessible
  prevButton.setAttribute('aria-hidden', 'true');
  var cbcClass = ConveyorBeltCommon;
  cbcClass._addBubbleEventListener(prevButton, 'click', function () {
    self._scrollPrev();
  });

  prevButton.appendChild(icon); // @HTMLUpdateOK

  var elem = this._elem;
  elem.insertBefore(prevButton, this._overflowContainer); // @HTMLUpdateOK
};

/**
 * Create the next button.
 * @param {string} buttonStyleClass Style class to use for the button
 * @param {Node} icon Button icon element
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._createNextButton = function (
  buttonStyleClass, icon) {
  var self = this;
  var nextButton = document.createElement('div');
  this._nextButton = nextButton;
  nextButton.setAttribute('class', buttonStyleClass);
  // hide the button from screen readers because it is not keyboard accessible
  nextButton.setAttribute('aria-hidden', 'true');
  var cbcClass = ConveyorBeltCommon;
  cbcClass._addBubbleEventListener(nextButton, 'click', function () {
    self._scrollNext();
  });

  nextButton.appendChild(icon); // @HTMLUpdateOK

  var elem = this._elem;
  elem.appendChild(nextButton); // @HTMLUpdateOK
};

/**
 * Get the content parent.
 * @return {Object} parent DOM element of the content
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._getContentParent = function () {
  // if an explicit content parent was not specified, it will be the _contentContainer
  var contentParent = this._contentParent;
  if (!contentParent) {
    contentParent = this._contentContainer;
  }
  return contentParent;
};

/**
 * Measure the contents of the conveyor.
 * @return {Object} Total size of the contents
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._measureContents = function () {
  // var contentParent = this._getContentParent();
  var arContentElements = this._getContentElements();
  var totalSize = { w: 0, h: 0 };
  var sizes = [];
  if (arContentElements.length > 0) {
    var children = arContentElements;
    var bHoriz = this._isHorizontal();
    var contentWidth = 0;

    // get the width of the contentContainer, not the contentParent, because
    // in JET, if the children are in a buttonset, for example, the offsetLeft
    // of the children is relative to the contentContainer, not the
    // contentParent
    var contentContainer = this._contentContainer;
    contentWidth = contentContainer.offsetWidth;

    var startOffset = 0;
    var prevSizeObj = null;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.nodeType === 1) {
        var ww = child.offsetWidth;
        var hh = child.offsetHeight;
        var childId = child.id;
        var sizeObj = { w: ww, h: hh, id: childId };
        var childParent;
        // calculating the start assumes that the browser has done the appropriate layout;
        // subtract 1 from the end so it's the last pixel of this child, not the start of the next child
        if (bHoriz) {
          // FIX : in IE, the conveyor items all report offsetLeft=0,
          // so we need to get the offset from the parent wrapping table cell div
          // instead
          var offLeft = child.offsetLeft;
          if (!this._contentParent && offLeft === 0) {
            childParent = child.parentNode;
            offLeft = childParent.offsetLeft;
          }

          // if RTL, still want to save the start coords in logical, ascending order beginning with 0
          if (this._bRtl) {
            sizeObj.start = contentWidth - (offLeft + ww);
          } else {
            sizeObj.start = offLeft;
          }

          // Offset each item's start coord by the first item's offset to handle cases like text-align:right,
          // where the items may be right-aligned within the content container.  We still want our logical
          // coords to start at 0.
          if (i === 0) {
            startOffset = sizeObj.start;
          }
          sizeObj.start -= startOffset;

          totalSize.w = sizeObj.start + ww;
          totalSize.h = Math.max(totalSize.h, hh);
          sizeObj.end = totalSize.w - 1;
        } else {
          // FIX : in IE, the conveyor items all report offsetTop=0,
          // so we need to get the offset from the parent wrapping table cell div
          // instead
          var offTop = child.offsetTop;
          if (!this._contentParent && offTop === 0) {
            childParent = child.parentNode;
            offTop = childParent.offsetTop;
          }

          sizeObj.start = offTop;
          totalSize.w = Math.max(totalSize.w, ww);
          totalSize.h = sizeObj.start + hh;
          sizeObj.end = totalSize.h - 1;
        }

        // if this item overlaps the previous item, adjust the previous item to
        // end just before this item (can happen, for example, with horizontal
        // JET buttonsets)
        if (prevSizeObj) {
          if (prevSizeObj.end >= sizeObj.start) {
            var overlap = prevSizeObj.end - (sizeObj.start - 1);
            prevSizeObj.end -= overlap;
            if (bHoriz) {
              prevSizeObj.w -= overlap;
            } else {
              prevSizeObj.h -= overlap;
            }
          }
        }

        sizes.push(sizeObj);
        prevSizeObj = sizeObj;
      }
    }
  }
  this._sizes = sizes;
  return totalSize;
};

/**
 * Get the array of content sizes.
 * @return {Array} Array of content sizes
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._getSizes = function () {
  return this._sizes;
};

/**
 * Show the next button.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._showNextButton = function () {
  this._removeStyleClassNameFunc(this._nextButton, this._hiddenStyleClass);
};

/**
 * Show the prev button.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._showPrevButton = function () {
  this._removeStyleClassNameFunc(this._prevButton, this._hiddenStyleClass);
};

/**
 * Hide the next button.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._hideNextButton = function () {
  this._addStyleClassNameFunc(this._nextButton, this._hiddenStyleClass);
};

/**
 * Hide the prev button.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._hidePrevButton = function () {
  this._addStyleClassNameFunc(this._prevButton, this._hiddenStyleClass);
};

/**
 * Determine if the next button is shown.
 * @return {boolean} true if shown, false if hidden
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._isNextButtonShown = function () {
  return !this._hasStyleClassNameFunc(this._nextButton, this._hiddenStyleClass);
};

/**
 * Determine if the prev button is shown.
 * @return {boolean} True if shown, false if hidden
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._isPrevButtonShown = function () {
  return !this._hasStyleClassNameFunc(this._prevButton, this._hiddenStyleClass);
};

/**
 * Get the size of a next/prev button along the direction of conveyor orientation.
 * @return {number} Size of a button
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._getButtonSize = function () {
  return this._isHorizontal() ? this._buttonWidth : this._buttonHeight;
};

/**
 * Update visibility of the next/prev buttons and adjust scroll position accordingly.
 * @param {number} scroll Desired scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._updateButtonVisibility = function (scroll) {
  var buttonSize = this._getButtonSize();
  var ovScroll = this._getCurrScroll();
  var bNeedsScroll = this._needsScroll();
  // if scrolling to the start, hide the prev button and reclaim its space
  if (scroll <= this._minScroll) {
    if (this._isPrevButtonShown()) {
      ovScroll -= buttonSize;
    }
    this._hidePrevButton();
  } else if (bNeedsScroll) {
    // if not at the start, show the prev button and allocate space for it
    if (!this._isPrevButtonShown()) {
      ovScroll += buttonSize;
    }
    this._showPrevButton();
  }

  // if scrolling to the end, hide the next button and reclaim its space
  if (scroll >= this._maxScroll) {
    this._hideNextButton();
  } else if (bNeedsScroll) {
    this._showNextButton();
  }
  // update the overflow container
  this._setOverflowScroll(ovScroll);
};

/**
 * Set the overflow scroll position.
 * @param {number} scroll Overflow logical scroll position
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._setOverflowScroll = function (scroll) {
  var container = this._overflowContainer;
  if (this._isHorizontal()) {
    container.scrollLeft = this._convertScrollLogicalToBrowser(scroll);
  } else {
    container.scrollTop = scroll;
  }
};

/**
 * Get the current overflow viewport size.
 * @return {number} Overflow viewport size
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._getCurrViewportSize = function () {
  var container = this._overflowContainer;
  return this._isHorizontal() ? container.offsetWidth : container.offsetHeight;
};

/**
 * Set the scroll position.
 * @param {number} scroll Desired logical scroll position
 * @param {boolean} bImmediate True to make the change immediately, false to animate it
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._setCurrScroll = function (scroll, bImmediate) {
  // don't do anything if we're already in the middle of scrolling
  if (!this._bScrolling) {
    // if this function is called, the conveyor internally initiated the scroll, so turn off the
    // flag for an externally triggered scroll
    this._bExternalScroll = false;
    this._setCurrScrollHelper(scroll, bImmediate);
  }
};

/**
 * Helper function to set scroll position.
 * @param {number} scroll Desired scroll position
 * @param {boolean} bImmediate True to make the change immediately, false to animate it
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._setCurrScrollHelper = function (scroll, bImmediate) {
  if (this._isEmpty()) {
    return;
  }

  this._bScrolling = true;
  // eslint-disable-next-line no-param-reassign
  scroll = this._constrainScroll(scroll);
  // update button visibility before scrolling
  this._updateButtonVisibility(scroll);
  var scrollFunc = this._scrollFunc;
  // if making the change immediately, simply call the anim end function
  if (bImmediate || !scrollFunc || scroll === this._getCurrScroll()) {
    // FIX : if this is an external scroll, set the current scroll
    // value again because it may be different from the passed in scroll value
    // due to showing/hiding scroll buttons (Note that for an external scroll,
    // the scroll has already happened before this function was called)
    this._onScrollAnimEnd(this._bExternalScroll ? this._getCurrScroll() : scroll);
  } else {
    // if animating the change, call out to the provided callback
    // FIX : add busy state before animating a scroll
    this._busyStateResolveFunc = this._addBusyStateFunc('scrolling');

    var cbcClass = ConveyorBeltCommon;
    // 1.1 px/ms is the desired animation speed, so calculate the duration based on the distance to scroll
    var duration = Math.abs(this._getCurrScroll() - scroll) / cbcClass._SCROLL_SPEED;
    var self = this;
    var onEndFunc = function () {
      self._onScrollAnimEnd(scroll);

      // FIX : resolve busy state after animating a scroll
      self._resolveBusyState();
    };
    // need to convert the logical scroll to the browser value for animating
    scrollFunc.call(null, this._overflowContainer,
                    this._convertScrollLogicalToBrowser(scroll),
                    duration, onEndFunc);
  }
};

/**
 * Resolve an outstanding busy state.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._resolveBusyState = function () {
  if (this._busyStateResolveFunc) {
    this._busyStateResolveFunc();
    this._busyStateResolveFunc = null;
  }
};

/**
 * Get the current scroll position.
 * @return {number} Logical scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._getCurrScroll = function () {
  var container = this._overflowContainer;
  return this._isHorizontal() ? this._convertScrollBrowserToLogical(container.scrollLeft) :
                                container.scrollTop;
};

/**
 * Determine if the conveyor needs to show scroll buttons.
 * @return {boolean} True if scrolling is needed, false if not
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._needsScroll = function () {
  var contentContainer = this._contentContainer;
  var overflowContainer = this._overflowContainer;
  return this._isHorizontal() ?
    contentContainer.offsetWidth > overflowContainer.offsetWidth :
    contentContainer.offsetHeight > overflowContainer.offsetHeight;
};

/**
 * Constrain the scroll position.
 * @param {number} scroll Desired scroll position
 * @return {number} Constrained scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._constrainScroll = function (scroll) {
  if (!this._needsScroll() || scroll < this._minScroll) {
    return this._minScroll;
  } else if (scroll > this._maxScroll) {
    return this._maxScroll;
  }
  return scroll;
};

/**
 * Handle a mousewheel event.
 * @param {Event} event Event object
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._handleMouseWheel = function (event) {
  // if we're already scrolling, just consume the event
  var bConsumeEvent = this._bScrolling;
  if (this._needsScroll() && !this._bScrolling) {
    var cbcClass = ConveyorBeltCommon;
    var wheelDelta = cbcClass._getWheelDelta(event);
    if (wheelDelta < 0 && this._isNextButtonShown()) {
      bConsumeEvent = true;
      this._scrollNext();
    } else if (wheelDelta > 0 && this._isPrevButtonShown()) {
      bConsumeEvent = true;
      this._scrollPrev();
    }
  }
  if (bConsumeEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
};

/**
 * Handle a touchstart event.
 * @param {Event} event Event object
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._handleTouchStart = function (event) {
  var eventTouches = event.touches;
  if (this._needsScroll() && !this._bScrolling && eventTouches.length === 1) {
    this._bTouch = true;
    // save off some initial information at the start of a swipe
    var firstTouch = eventTouches[0];
    this._touchStartCoord = this._isHorizontal() ? firstTouch.pageX : firstTouch.pageY;
    this._touchStartScroll = this._getCurrScroll();
    this._touchStartNextScroll = this._calcNextScroll();
    this._touchStartPrevScroll = this._calcPrevScroll();
    // FIX : save the initial button state
    this._touchStartNextButtonShown = this._isNextButtonShown();
    this._touchStartPrevButtonShown = this._isPrevButtonShown();
  }
};

/**
 * Handle a touchmove event.
 * @param {Event} event Event object
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._handleTouchMove = function (event) {
  var bHoriz = this._isHorizontal();
  var eventTouches = event.touches;
  var firstTouch = eventTouches[0];
  var touchCoord = bHoriz ? firstTouch.pageX : firstTouch.pageY;
  var diff = touchCoord - this._touchStartCoord;
  // in non-RTL, if swiping left or up, scroll next; otherwise scroll prev
  // in RTL, if swiping right or up, scroll next; otherwise scroll prev
  var bNext = (bHoriz && this._bRtl) ? (diff > 0) : (diff < 0);
  // determine whether the conveyor can be scrolled in the direction of the swipe
  var canScrollInSwipeDirection = (bNext && this._touchStartNextButtonShown) ||
                                  (!bNext && this._touchStartPrevButtonShown);
  // only need to do something if we also received the touchstart and if we can
  // scroll in the swipe direction
  if (this._bTouch && canScrollInSwipeDirection) {
    // only scroll next/prev if the swipe is longer than the threshold; if it's
    // less, then just drag the items with the swipe
    var cbcClass = ConveyorBeltCommon;
    var container = this._overflowContainer;
    var threshold = cbcClass._SWIPE_THRESHOLD *
                    (bHoriz ? container.offsetWidth : container.offsetHeight);

    // if swiping under the threshold, just move the conveyor with the swipe
    if (Math.abs(diff) < threshold) {
      this._setCurrScroll(this._touchStartScroll - diff, true);

      // if we're under the threshold, but we've already scrolled to the end,
      // then we don't need to continue trying to scroll and we don't need to
      // reset the scroll position at the end of the touch
      if ((this._touchStartNextButtonShown && !this._isNextButtonShown()) ||
          (this._touchStartPrevButtonShown && !this._isPrevButtonShown())) {
        this._bTouch = false;
      }
    } else {
      // if swiping beyond the threshold, scroll to the next/prev set of items
      this._setCurrScroll(bNext ? this._touchStartNextScroll : this._touchStartPrevScroll, false);
      // don't scroll again for this same swipe
      this._bTouch = false;
    }

    // FIX : set a flag indicating we've scrolled for this touch event
    this._scrolledForThisTouch = true;
  }

  // FIX : if we've scrolled for this touch event, consume the event
  // so that the page doesn't also scroll
  if (this._scrolledForThisTouch) {
    event.preventDefault();
    event.stopPropagation();
  }
};

/**
 * Handle a touchend event.
 * @param {Event} event Event object
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
// eslint-disable-next-line no-unused-vars
ConveyorBeltCommon.prototype._handleTouchEnd = function (event) {
  // if a full page swipe hasn't happened, scroll back to the original position
  if (this._bTouch) {
    this._setCurrScroll(this._touchStartScroll, false);
  }
  this._bTouch = false;
  // FIX : reset the flag indicating if we've scrolled for this touch
  // event
  this._scrolledForThisTouch = false;
};

/**
 * Handle a DOM scroll event.
 * @param {Event} event Event object
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
// eslint-disable-next-line no-unused-vars
ConveyorBeltCommon.prototype._handleScroll = function (event) {
  // if the scroll was triggered externally, for example by tabbing through
  // child items, then update the visual state of the conveyor to match the
  // new scroll state
  if (this._bExternalScroll && !this._bScrolling) {
    this._setCurrScrollHelper(this._getCurrScroll(), true);
  }
};

/**
 * Function called after a scroll finishes.
 * @param {number} scroll Scroll position
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._onScrollAnimEnd = function (scroll) {
  // set the desired value after the animation to make sure that the final value is exactly what was intended,
  // in case the animation introduced interpolation errors
  this._setOverflowScroll(scroll);
  this._bExternalScroll = true;
  this._bScrolling = false;
};

/**
 * Scroll to the next set of items.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._scrollNext = function () {
  if (!this._bScrolling) {
    this._setCurrScroll(this._calcNextScroll(), false);
  }
};

/**
 * Scroll to the previous set of items.
 * @return {void}
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._scrollPrev = function () {
  if (!this._bScrolling) {
    this._setCurrScroll(this._calcPrevScroll(), false);
  }
};

/**
 * Calculate the scroll position for the next set of items.
 * @return {number} Next scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._calcNextScroll = function () {
  var nextIndex = this._calcNextVisibleItemIndex();
  var scroll = 0;
  // if single item is bigger than viewport, then scroll by viewport size
  if (nextIndex === this._calcFirstVisibleItemIndex()) {
    scroll = this._getCurrScroll() + this._getCurrViewportSize();
  } else {
    scroll = this._calcStartScroll(nextIndex);
  }
  return scroll;
};

/**
 * Calculate the scroll position for the previous set of items.
 * @return {number} Previous scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._calcPrevScroll = function () {
  var prevIndex = this._calcPrevVisibleItemIndex();
  var scroll = 0;
  // if single item is bigger than viewport, then scroll by viewport size
  if (prevIndex === this._calcLastVisibleItemIndex()) {
    scroll = this._getCurrScroll() - this._getCurrViewportSize();
  } else {
    scroll = this._calcEndScroll(prevIndex);
  }
  // if at the end and scrolling prev, anticipate the next button becoming
  // visible and adjust the scroll position
  if (!this._isNextButtonShown()) {
    scroll += this._getButtonSize();
  }
  // if scrolling prev and the scroll position is less than or equal to the size of the prev button,
  // just scroll to the very beginning because the prev button should get hidden
  if (scroll <= this._getButtonSize()) {
    scroll = this._minScroll;
  }
  return scroll;
};

/**
 * Calculate the scroll position for the start of the specified item.
 * @param {number} index Index of the item to scroll to
 * @return {number} Scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._calcStartScroll = function (index) {
  var sizes = this._getSizes();
  var sizeObj = sizes[index];
  return sizeObj.start;
};

/**
 * Calculate the scroll position for the end of the specified item.
 * @param {number} index Index of the item to scroll to
 * @return {number} Scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._calcEndScroll = function (index) {
  var sizes = this._getSizes();
  var sizeObj = sizes[index];
  return (sizeObj.end - this._getCurrViewportSize()) + 1;
};

/**
 * Calculate the index of the first visible item.
 * @return {number} Index of first visible item
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._calcFirstVisibleItemIndex = function () {
  var currScroll = this._getCurrScroll();
  var i = this._calcItemIndex(currScroll);
  return (i < 0) ? 0 : i;
};

/**
 * Calculate the index of the last visible item.
 * @return {number} Index of last visible item
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._calcLastVisibleItemIndex = function () {
  var elemSize = this._getCurrViewportSize();
  var currScroll = (this._getCurrScroll() + elemSize) - 1;
  var i = this._calcItemIndex(currScroll);
  var sizes = this._getSizes();
  return (i < 0) ? sizes.length - 1 : i;
};

/**
 * Calculate the index of the previous visible item.
 * @return {number} Index of previous visible item
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._calcPrevVisibleItemIndex = function () {
  var currScroll = this._getCurrScroll() - 1;
  var i = this._calcItemIndex(currScroll);
  return (i < 0) ? 0 : i;
};

/**
 * Calculate the index of the next visible item.
 * @return {number} Index of next visible item
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._calcNextVisibleItemIndex = function () {
  var elemSize = this._getCurrViewportSize();
  var currScroll = this._getCurrScroll() + elemSize;
  var i = this._calcItemIndex(currScroll);
  var sizes = this._getSizes();
  return (i < 0) ? sizes.length - 1 : i;
};

/**
 * Calculate the index of the item at the given scroll position.
 * @param {number} scroll Scroll position
 * @return {number} Index of item at given scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._calcItemIndex = function (scroll) {
  var sizes = this._getSizes();
  for (var i = 0; i < sizes.length; i++) {
    var sizeObj = sizes[i];
    if (scroll <= sizeObj.end) {
      return i;
    }
  }
  return -1;
};

/**
 * Convert a logical scroll position to its corresponding browser value.
 * @param {number} scroll logical scroll position
 * @return {number} browser scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._convertScrollLogicalToBrowser = function (scroll) {
  // (comment mostly copied from AdfConveyorBeltSupport)
  // If this is LTR or RTL mode in IE, then we want the default positive new scroll value.
  // If FF in RTL, then get the negative scroll value
  // If Safari version 10+ in RTL, then get the negative scroll value
  // If Webkit in RTL, to scroll to a position, we resolve this equation:
  // contentContainerWidth - browserScroll = overflowContainerWidth + logicalScroll
  // browserScroll = contentContainerWidth = overflowContainerWidth - logicalScroll
  var newScroll = scroll;
  if (this._bRtl && this._isHorizontal()) {
    // Safari version 10+ has the correct scroll offset in RTL mode
    // So don't resolve the scroll equation for Safari version 10+
    if (this._bAgentGecko || (this._bAgentSafari && this._agentVersion >= 10)) {
      newScroll = -scroll;
    } else if (this._bAgentWebkit ||
              (this._bAgentSafari && this._agentVersion < 10)) {
      var contentContainer = this._contentContainer;
      var overflowContainer = this._overflowContainer;
      newScroll = contentContainer.offsetWidth - overflowContainer.offsetWidth - scroll;
    }
  }
  return newScroll;
};

/**
 * Convert a browser scroll position to its corresponding logical value.
 * @param {number} scroll browser scroll position
 * @return {number} logical scroll position
 * @memberof ConveyorBeltCommon
 * @instance
 * @private
 */
ConveyorBeltCommon.prototype._convertScrollBrowserToLogical = function (scroll) {
  // (comment mostly copied from AdfConveyorBeltSupport)
  // If this is LTR or RTL mode in IE, then we want the default positive new scroll value.
  // If FF in RTL, then get the negative scroll value
  // If Webkit in RTL, to scroll to a position, we resolve this equation:
  // contentContainerWidth - browserScroll = overflowContainerWidth + logicalScroll
  // browserScroll = contentContainerWidth = overflowContainerWidth - logicalScroll

  // because the equations are the same whether converting from browser -> logical or logical -> browser,
  // simply call _convertScrollLogicalToBrowser from here
  // (NOTE: want to leave _convertScrollBrowserToLogical as a separate function so that it's clear from the
  // calling code which conversion direction is used, and in case the conversion impls ever need to be changed)
  return this._convertScrollLogicalToBrowser(scroll);
};

/**
 * Scroll animation speed (px/ms).
 * @memberof ConveyorBeltCommon
 * @private
 */
ConveyorBeltCommon._SCROLL_SPEED = 1.1;
/**
 * Touch swipe threshold (percentage of conveyor size).
 * @memberof ConveyorBeltCommon
 * @private
 */
ConveyorBeltCommon._SWIPE_THRESHOLD = 0.33;



/* global ConveyorBeltCommon:false, Components:false, Logger:false, Config:false, Context:false */

/**
 * @ojcomponent oj.ojConveyorBelt
 * @augments oj.baseComponent
 * @since 0.6.0
 *
 * @ojshortdesc A conveyor belt manages overflow for its child elements and allows scrolling among them.
 * @class oj.ojConveyorBelt
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["orientation"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 2
 *
 * @classdesc
 * <h3 id="conveyorBeltOverview-section">
 *   JET ConveyorBelt
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#conveyorBeltOverview-section"></a>
 * </h3>
 *
 * <p>Description: Container element that manages overflow for its child
 * elements and allows scrolling among them.
 *
 * <p>Child elements of the ConveyorBelt must all be siblings at the same level.
 * The size of the ConveyorBelt must somehow be constrained in order for
 * there to be overflow to manage, for example by specifying CSS
 * <code class="prettyprint">max-width</code> or
 * <code class="prettyprint">max-height</code>.
 * <p>If the elements to be scrolled among are direct children of the
 * ConveyorBelt, then ConveyorBelt will ensure that they are laid out
 * appropriately for its orientation.  However, if the elements to be scrolled
 * among are contained by a single nested descendant element, the
 * <code class="prettyprint">content-parent</code>, then it is up to calling code
 * to ensure that the elements are laid out appropriately.  For example,
 * elements can be forced horizontal by using CSS
 * <code class="prettyprint">white-space:nowrap</code>, or vertical by using
 * <code class="prettyprint">display:block</code>.
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-conveyor-belt>
 *   &lt;oj-button>Alpha&lt;/oj-button>
 *   &lt;oj-button>Beta&lt;/oj-button>
 *   &lt;oj-button>Gamma&lt;/oj-button>
 *   &lt;oj-button>Delta&lt;/oj-button>
 *   &lt;oj-button>Epsilon&lt;/oj-button>
 *   &lt;oj-button>Zeta&lt;/oj-button>
 * &lt;/oj-conveyor-belt>
 * </code></pre>
 *
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 *
 * <h3 id="keyboard-appdev-section">
 *   Keyboard Application Developer Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-appdev-section"></a>
 * </h3>
 *
 * <p>Providing keyboard support for the items in the conveyor belt is the
 * responsibility of the application developer, if the items do not already
 * support keyboard interaction.  This could be done, for example, by specifying
 * <code class="prettyprint">tabindex</code> on each item to enable tab
 * navigation.  Alternatively, this could be done by adding a keyboard listener
 * and responding to key events, like pressing the arrow keys.
 *
 *
 * <h3 id="accessibility-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
 * </h3>
 *
 * <p>ConveyorBelt itself does nothing special for accessibility.
 * It is the responsibility of the application developer to make the items in
 * the conveyor accessible.  Sighted keyboard-only users need to be able to
 * access the items in the conveyor just by using the keyboard.
 * It is up to the child items of the ConveyorBelt to support keyboard
 * navigation.  If child items support tab navigation, the browser may scroll
 * them into view when they receive focus.  If child items support other forms
 * of keyboard navigation, for example by using the arrow keys, it is up to the
 * child items to scroll themselves into view.  This may be done, for example,
 * by calling the DOM function <code class="prettyprint">focus()</code> or
 * <code class="prettyprint">scrollIntoView()</code> on the item.
 * ConveyorBelt will be aware of tab based or programmatic scrolling and will
 * honor it, updating itself to toggle visibility of the overflow indicators as
 * needed.
 *
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>As with any JET element, in the unusual case that the directionality
 * (LTR or RTL) changes post-init, the conveyorBelt must be
 * <code class="prettyprint">refresh()</code>ed.
 */
/**
 * <p>The &lt;oj-conveyor-belt> element manages overflow for its child elements and allows scrolling among them.
 * Child elements of the &lt;oj-conveyor-belt> must all be siblings at the same level.</p>
 * <p>If the elements to be scrolled among are nested descendants and not direct
 * children of the conveyor belt, the <code class="prettyprint">content-parent</code>
 * attribute should specify the nested elements direct parent.</p>
 *
 * @ojchild Default
 * @ojshortdesc The oj-conveyor-belt element manages overflow for its child elements and allows scrolling among them. See the Help documentation for more information.
 * @memberof oj.ojConveyorBelt
 *
 * @example <caption>Initialize the conveyor belt with child content specified:</caption>
 * &lt;oj-conveyor-belt>
 *   &lt;oj-button>Alpha&lt;/oj-button>
 *   &lt;oj-button>Beta&lt;/oj-button>
 *   &lt;oj-button>Gamma&lt;/oj-button>
 *   &lt;oj-button>Delta&lt;/oj-button>
 *   &lt;oj-button>Epsilon&lt;/oj-button>
 *   &lt;oj-button>Zeta&lt;/oj-button>
 * &lt;/oj-conveyor-belt>
 *
 * @example <caption>Initialize the conveyor belt with nested child content
 * specified:</caption>
 * &lt;oj-conveyor-belt content-parent='#myContentElem'>
 *   &lt;div id='myContentElem'>
 *     &lt;oj-button>Item 1&lt;/oj-button>
 *     &lt;oj-button>Item 2&lt;/oj-button>
 *     &lt;oj-button>Item 3&lt;/oj-button>
 *     &lt;oj-button>Item 4&lt;/oj-button>
 *     &lt;oj-button>Item 5&lt;/oj-button>
 *   &lt;/div>
 * &lt;/oj-conveyor-belt>
 */
(function () {
  // start static members and functions //////////////////////////////////////////

  // FIX : log warning message when "disabled" property set
  /**
   * Warning message when "disabled" property is set.
   * @const
   * @private
   * @type {string}
   */
  var _WARNING_DISABLED_OPTION = "JET ConveyorBelt: 'disabled' property not supported";

  // make sure the collapseEventTimeout param is less than the one used in the unit tests
  // in order to ensure that the filmStrip listener gets the resize event before the unit test
  /**
   * Timeout in milliseconds for collapse event.
   * @const
   * @private
   * @type {number}
   */
  var _RESIZE_LISTENER_COLLAPSE_EVENT_TIMEOUT = 25;

  // end static members and functions ////////////////////////////////////////////


  oj.__registerWidget('oj.ojConveyorBelt', $.oj.baseComponent,
    {
      defaultElement: '<div>',
      widgetEventPrefix: 'oj',

      options: {
        /**
         * Specify the orientation of the conveyorBelt.
         *
         * @expose
         * @memberof oj.ojConveyorBelt
         * @instance
         * @type {string}
         * @ojvalue {string} "horizontal" Orient the conveyorBelt horizontally.
         * @ojvalue {string} "vertical" Orient the conveyorBelt vertically.
         * @default "horizontal"
         * @ojshortdesc Specifies the orientation of the conveyorBelt.
         *
         * @example <caption>Initialize the conveyorBelt with the
         * <code class="prettyprint">orientation</code> attribute specified:</caption>
         * &lt;oj-conveyor-belt orientation='vertical'>
         * &lt;/oj-conveyor-belt>
         *
         * @example <caption>Get or set the <code class="prettyprint">orientation</code>
         * property after initialization:</caption>
         * // getter
         * var orientation = myConveyorBelt.orientation;
         *
         * // setter
         * myConveyorBelt.orientation = 'vertical';
         */
        orientation: 'horizontal',
        /**
         * Specify the selector of the descendant DOM element in the conveyorBelt
         * that directly contains the items to scroll among.
         *
         * <p>This attribute value is <code class="prettyprint">null</code> by default,
         * meaning that the items to scroll among are direct children of the
         * oj-conveyor-belt.  In some cases, the items to scroll among
         * are not direct children of the oj-conveyor-belt, but are instead
         * nested in a descendant DOM element.  In such cases, this attribute should be
         * specified to point to the descendant DOM element whose direct children
         * are the items to scroll among.  For example, if the items to scroll
         * among are buttons in a buttonset, the buttons are direct children of
         * the DOM element representing the buttonset.  The buttonset would be
         * the direct child of the conveyorBelt.  If the
         * <code class="prettyprint">id</code> of the buttonset DOM element were
         * <code class="prettyprint">'myContentElem'</code>, then content-parent
         * would be specified as <code class="prettyprint">'#myContentElem'</code>.
         *
         * <p><b>WARNING:</b> The selector specified for this attribute should match
         * only a single descendant DOM element.  If multiple elements are matched,
         * then only the first one will be used.  Applications should not depend on
         * this behavior because we reserve the right to change it in the future in
         * order to allow and use multiple matching elements.
         *
         * @expose
         * @memberof oj.ojConveyorBelt
         * @instance
         * @type {?string}
         * @default null
         * @ojshortdesc Specify the selector of the descendant DOM element in the conveyorBelt that directly contains the items to scroll among.
         *
         * @example <caption>Initialize the conveyorBelt with the
         * <code class="prettyprint">content-parent</code> attribute specified:</caption>
         * &lt;oj-conveyor-belt content-parent='#myContentElem'>
         *   &lt;div id='myContentElem'>
         *     &lt;oj-button>Item 1&lt;/oj-button>
         *     &lt;oj-button>Item 2&lt;/oj-button>
         *     &lt;oj-button>Item 3&lt;/oj-button>
         *     &lt;oj-button>Item 4&lt;/oj-button>
         *     &lt;oj-button>Item 5&lt;/oj-button>
         *   &lt;/div>
         * &lt;/oj-conveyor-belt>
         *
         * @example <caption>Get or set the <code class="prettyprint">contentParent</code>
         * property after initialization:</caption>
         * // getter
         * var contentParent = myConveyorBelt.contentParent;
         *
         * // setter
         * myConveyorBelt.contentParent = '#myContentElem';
         */
        contentParent: null

        /**
         * To avoid tight coupling between a ConveyorBelt and its contents, JET
         * ConveyorBelt does not support the <code class="prettyprint">disabled</code>
         * attribute.
         *
         * <p><b>WARNING:</b> Applications should not depend on this behavior
         * because we reserve the right to change it in the future in order to
         * support <code class="prettyprint">disabled</code> and propagate it to
         * child elements of ConveyorBelt.
         *
         * @member
         * @name disabled
         * @memberof oj.ojConveyorBelt
         * @instance
         * @type {boolean}
         * @default false
         * @ignore
         */
        // disabled attribute declared in superclass, but we still want the above API doc

        // Events

        /**
         * Triggered when the conveyorBelt is created.
         *
         * @event
         * @name create
         * @memberof oj.ojConveyorBelt
         * @instance
         * @ignore
         */
        // create event declared in superclass, but we still want the above API doc
      },

      /**
       * After _ComponentCreate and _AfterCreate,
       * the widget should be 100% set up. this._super should be called first.
       * @return {void}
       * @override
       * @protected
       * @instance
       * @memberof oj.ojConveyorBelt
       */
      _ComponentCreate: function () { // Override of protected base class method.
        // call superclass first
        this._super();

        var elem = this.element;
        elem.addClass('oj-conveyorbelt oj-component');

        var options = this.options;
        // FIX : log warning message when "disabled" attribute set
        if (options.disabled) {
          Logger.warn(_WARNING_DISABLED_OPTION);
        }

        // FIX : remove override of _init() and call _setup() from here
        this._setup();
      },

      // This method currently runs at create, init, and refresh time (since refresh() is called by _init()).
      /**
       * Refreshes the visual state of the conveyorBelt. JET elements require a
       * <code class="prettyprint">refresh()</code> after the DOM is
       * programmatically changed underneath the element.
       *
       * <p>This method does not accept any arguments.
       *
       * @return {void}
       * @expose
       * @memberof oj.ojConveyorBelt
       * @instance
       * @ojshortdesc Refreshes the visual state of the conveyorBelt.
       *
       * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
       * myConveyorBelt.refresh();
       */
      refresh: function () { // Override of public base class method.
        this._super();

        // Check if the reading direction have changed
        var bRTL = (this._GetReadingDirection() === 'rtl');
        var bDirectionChanged = (this._bRTL !== bRTL);

        // save and restore scroll position only if the reading direction is not changed
        var scroll;
        // save the current scroll position
        if (!bDirectionChanged) {
          scroll = this._cbCommon.getScroll();
        }

        // destroy the cbCommon and setup from scratch in case items were added/removed
        this._destroyCBCommon();
        this._setup();

        // restore the saved scroll position
        if (!bDirectionChanged) {
          this._cbCommon.setScroll(scroll, true);
        }
      },

      /**
       * Notifies the component that its subtree has been made visible
       * programmatically after the component has been created.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @protected
       * @override
       */
      _NotifyShown: function () {
        this._super();
        // FIX : perform a deferred layout
        if (this._needsSetup) {
          this._setup();
        } else if (this._cbCommon) {
          // with internal flexbox layout, conveyor doesn't get notified when
          // content resizes while hidden, so explicitly handle a resize when
          // shown again
          var cbCommon = this._cbCommon;
          cbCommon.handleResize();
        }
      },

      /**
       * Notifies the component that its subtree has been connected to the document
       * programmatically after the component has been created.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @protected
       * @override
       */
      _NotifyAttached: function () {
        this._super();
        // FIX : perform a deferred layout
        if (this._needsSetup) {
          this._setup();
        } else if (this._cbCommon) {
          // with internal flexbox layout, conveyor doesn't get notified when
          // content resizes while detached, so explicitly handle a resize when
          // attached again
          var cbCommon = this._cbCommon;
          cbCommon.handleResize();
        }
      },

      /**
       * Setup the conveyorBelt.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _setup: function () { // Private, not an override (not in base class).
        var self = this;
        var elem = this.element;
        var options = this.options;
        var orientation = options.orientation;
        if (orientation === 'vertical') {
          elem.addClass('oj-conveyorbelt-vertical');
        } else {
          elem.removeClass('oj-conveyorbelt-vertical');
        }

        // FIX : if conveyor is detached or hidden, we can't layout
        // correctly, so defer layout until conveyor is attached or shown
        if (!this._canCalculateSizes()) {
          this._needsSetup = true;
          return;
        }
        this._needsSetup = null;

        this._bRTL = (this._GetReadingDirection() === 'rtl');
        if (!this._cbCommon) {
          var prevStyleClass = null;
          var nextStyleClass = null;
          var prevIcon = null;
          var nextIcon = null;
          var animateScrollFunc = null;
          if (orientation !== 'vertical') {
            prevStyleClass = 'oj-enabled oj-conveyorbelt-overflow-indicator oj-start oj-default';
            nextStyleClass = 'oj-enabled oj-conveyorbelt-overflow-indicator oj-end oj-default';
            prevIcon = this._createIcon('oj-conveyorbelt-overflow-icon oj-start');
            nextIcon = this._createIcon('oj-conveyorbelt-overflow-icon oj-end');
            animateScrollFunc = this._animateScrollLeft;
          } else {
            prevStyleClass = 'oj-enabled oj-conveyorbelt-overflow-indicator oj-top oj-default';
            nextStyleClass = 'oj-enabled oj-conveyorbelt-overflow-indicator oj-bottom oj-default';
            prevIcon = this._createIcon('oj-conveyorbelt-overflow-icon oj-top');
            nextIcon = this._createIcon('oj-conveyorbelt-overflow-icon oj-bottom');
            animateScrollFunc = this._animateScrollTop;
          }
          var buttonInfo = {};
          buttonInfo.prevButtonStyleClass = prevStyleClass;
          buttonInfo.nextButtonStyleClass = nextStyleClass;
          buttonInfo.prevButtonIcon = prevIcon;
          buttonInfo.nextButtonIcon = nextIcon;
          var styleInfo = {};
          styleInfo.overflowContainerStyleClass = 'oj-conveyorbelt-overflow-container';
          styleInfo.contentContainerStyleClass = 'oj-conveyorbelt-content-container';
          styleInfo.itemStyleClass = 'oj-conveyorbelt-item';
          styleInfo.hiddenStyleClass = 'oj-helper-hidden';
          var callbackInfo = {};
          callbackInfo.addResizeListener = function (_elem, listener) {
            oj.DomUtils.addResizeListener(_elem, listener,
                                          _RESIZE_LISTENER_COLLAPSE_EVENT_TIMEOUT);
          };
          callbackInfo.removeResizeListener = oj.DomUtils.removeResizeListener;
          callbackInfo.addStyleClassName = this._addStyleClassName;
          callbackInfo.removeStyleClassName = this._removeStyleClassName;
          callbackInfo.hasStyleClassName = this._hasStyleClassName;
          callbackInfo.filterContentElements =
            function (arContentElements) {
              return self._filterContentElements(arContentElements);
            };
          callbackInfo.subtreeDetached = Components.subtreeDetached;
          callbackInfo.subtreeAttached = Components.subtreeAttached;
          callbackInfo.addBusyState =
            function (description) {
              return self._addBusyState(description);
            };
          // disable scroll animation during testing
          if (Config.getAutomationMode() !== 'enabled') {
            callbackInfo.scrollFunc = animateScrollFunc;
          }
          var contentParentElem = null;
          if (options.contentParent) {
            // only use the first result returned from the contentParent selector
            contentParentElem = $(options.contentParent)[0];
          }
          var agentInfo = oj.AgentUtils.getAgentInfo(navigator.userAgent);
          this._cbCommon = new ConveyorBeltCommon(
            elem[0],
            orientation,
            contentParentElem,
            this._bRTL,
            buttonInfo,
            callbackInfo,
            styleInfo,
            agentInfo);
        }
        var cbCommon = this._cbCommon;
        cbCommon.setup();
        var children = elem.find('.oj-conveyorbelt-overflow-indicator');
        // need to setup listeners for styles on each button individually so that callbacks for that
        // listener are specific to each button and don't affect both buttons at the same time
        for (var i = 0; i < children.length; i++) {
          this._setupButtonMouseStyles($(children[i]));
        }
      },

      /**
       * Destroy the conveyorBelt.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @override
       * @protected
       */
      _destroy: function () { // Override of protected base class method.
        this._destroyCBCommon();
        var elem = this.element;
        elem.removeClass('oj-conveyorbelt oj-component oj-conveyorbelt-vertical');

        // call superclass last
        this._super();
      },

      /**
       * Set an option on the conveyorBelt.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @override
       * @protected
       */
      _setOption: function (key, value, flags) { // Override of protected base class method.
        // Method name needn't be quoted since is in externs.js.
        var bRecreate = false;
        var options = this.options;
        switch (key) {
            // when changing containerParent or orientation, just destroy and recreate
            // the ConveyorBeltCommon
          case 'containerParent':
          case 'orientation':
            bRecreate = (options.orientation !== value);
            break;
          case 'disabled':
            // FIX : log warning message when "disabled" attribute set
            Logger.warn(_WARNING_DISABLED_OPTION);
            break;
          default:
            break;
        }
        // if recreating, destroy the ConveyorBeltCommon before calling superclass
        // _setOption
        if (bRecreate) {
          this._destroyCBCommon();
        }
        this._super(key, value, flags);
        // if recreating, setup the new ConveyorBeltCommon after calling superclass
        // _setOption
        if (bRecreate) {
          this._setup();
        }
      },

      /**
       * Destroy the ConveyorBeltCommon.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _destroyCBCommon: function () {
        var cbCommon = this._cbCommon;
        if (cbCommon) {
          // FIX : detach mouse listeners from overflow indicators
          // before destroying cbCommon in order to avoid memory leaks
          var elem = this.element;
          var children = elem.find('.oj-conveyorbelt-overflow-indicator');
          children.off(this.eventNamespace);

          cbCommon.destroy();
        }
        this._cbCommon = null;
      },

      /**
       * Determine whether the conveyorBelt can calculate sizes (when it is
       * attached to the page DOM and not hidden).
       * @returns {boolean} true if sizes can be calculated, false if not
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _canCalculateSizes: function () {
        var div = document.createElement('div');
        var style = div.style;
        style.width = '10px';
        style.height = '10px';

        // make sure flexbox layout doesn't grow/shrink the item
        style['-webkit-flex'] = '0 0 auto';
        style.flex = '0 0 auto';

        var elem = this.element[0];
        elem.appendChild(div); // @HTMLUpdateOK
        var bCanCalcSizes = false;
        try {
          bCanCalcSizes = div.offsetWidth > 0 && div.offsetHeight > 0;
        } catch (e) {
          // do nothing
        }
        elem.removeChild(div);
        return bCanCalcSizes;
      },

      /**
       * Setup mouse listeners to change button styles.
       * @param {Object} element jQuery element to affect
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _setupButtonMouseStyles: function (element) {
        //  - conveyorbelt next/previous oj-hover color don't go away
        this._AddHoverable({
          element: element,
          afterToggle: function (eventtype) {
            if (eventtype === 'mouseenter') {
              element.removeClass('oj-default');
            } else if (eventtype === 'mouseleave') {
              element.addClass('oj-default');
            }
          }
        });

        this._AddActiveable({
          element: element,
          afterToggle: function (eventtype) {
            if (eventtype === 'mousedown' || eventtype === 'touchstart' ||
                eventtype === 'mouseenter') {
              element.removeClass('oj-default');
            } else if (eventtype === 'mouseup' || eventtype === 'touchend' ||
                       eventtype === 'touchcancel' || eventtype === 'mouseleave') {
              element.addClass('oj-default');
            }
          }
        });
      },

      /**
       * Create a DOM element for an icon.
       * @param {string} iconStyleClass Style class for the icon
       * @returns {Element} Icon DOM element
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _createIcon: function (iconStyleClass) {
        var span = document.createElement('span');
        span.setAttribute('class', 'oj-component-icon ' + iconStyleClass);
        return span;
      },

      /**
       * Animate setting the scrollLeft DOM property.
       * @param {Element} elem DOM element to scroll
       * @param {number} value Scroll value
       * @param {number} duration Duration of animation, in ms
       * @param {function():void} onEndFunc Function to call when the animation ends
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _animateScrollLeft: function (elem, value, duration, onEndFunc) {
        var props = {};
        props.scrollLeft = value;
        // use swing instead of easeInOutCubic because easeInOutCubic isn't found
        // when running in the cookbook
        $(elem).animate(props, duration, 'swing', onEndFunc);
      },

      /**
       * Animate setting the scrollTop DOM property.
       * @param {Element} elem DOM element to scroll
       * @param {number} value Scroll value
       * @param {number} duration Duration of animation, in ms
       * @param {function():void} onEndFunc Function to call when the animation ends
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _animateScrollTop: function (elem, value, duration, onEndFunc) {
        var props = {};
        props.scrollTop = value;
        // use swing instead of easeInOutCubic because easeInOutCubic isn't found
        // when running in the cookbook
        $(elem).animate(props, duration, 'swing', onEndFunc);
      },

      /**
       * Add a style class name to an element.
       * @param {Object} elem Element to which to add style class.
       * @param {string} styleClass Style class name to add.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _addStyleClassName: function (elem, styleClass) {
        $(elem).addClass(styleClass);
      },

      /**
       * Remove a style class name from an element.
       * @param {Object} elem Element from which to remove style class.
       * @param {string} styleClass Style class name to remove.
       * @return {void}
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _removeStyleClassName: function (elem, styleClass) {
        $(elem).removeClass(styleClass);
      },

      /**
       * Determine whether the given style class name is applied to the given
       * element.
       * @param {Object} elem Element to check for style class name.
       * @param {string} styleClass Style class name for which to look.
       * @returns {boolean} true if style class name is applied, false if not
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _hasStyleClassName: function (elem, styleClass) {
        return $(elem).hasClass(styleClass);
      },

      /**
       * Filter the given array of conveyor content elements to remove extraneous elements, like the
       * divs added by the resize listener.
       * @param {Array} arContentElements Array of conveyor content elements.
       * @returns {Array} filtered array of conveyor content elements
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _filterContentElements: function (arContentElements) {
        var ret = [];
        for (var i = 0; i < arContentElements.length; i++) {
          var contentElem = arContentElements[i];
          if (!this._hasStyleClassName(contentElem, 'oj-helper-detect-expansion') &&
              !this._hasStyleClassName(contentElem, 'oj-helper-detect-contraction')) {
            ret.push(contentElem);
          }
        }
        return ret;
      },

      /**
       * Add a busy state to the busy context.
       *
       * @param {string} description Additional information about busy state.
       * @returns {Function} Resolve function called by the registrant when the busy state completes.
       *          The resultant function will throw an error if the busy state is no longer registered.
       * @memberof oj.ojConveyorBelt
       * @instance
       * @private
       */
      _addBusyState: function (description) {
        var element = this.element;
        var context = Context.getContext(element[0]);
        var busyContext = context.getBusyContext();

        var desc = 'ConveyorBelt';
        var id = element.attr('id');
        desc += " (id='" + id + "')";
        desc += ': ' + description;

        var busyStateOptions = { description: desc };
        return busyContext.addBusyState(busyStateOptions);
      },

      // @inheritdoc
      getNodeBySubId: function (locator) {
        if (locator == null) {
          return this.element[0];
        }

        var subId = locator.subId;
        if (subId === 'oj-conveyorbelt-start-overflow-indicator') {
          return this.widget().find('.oj-conveyorbelt-overflow-indicator.oj-start')[0];
        }
        if (subId === 'oj-conveyorbelt-end-overflow-indicator') {
          return this.widget().find('.oj-conveyorbelt-overflow-indicator.oj-end')[0];
        }
        if (subId === 'oj-conveyorbelt-top-overflow-indicator') {
          return this.widget().find('.oj-conveyorbelt-overflow-indicator.oj-top')[0];
        }
        if (subId === 'oj-conveyorbelt-bottom-overflow-indicator') {
          return this.widget().find('.oj-conveyorbelt-overflow-indicator.oj-bottom')[0];
        }

        // Non-null locators have to be handled by the component subclasses
        return null;
      },

      // @inheritdoc
      getSubIdByNode: function (node) {
        var startIndicator =
            this.getNodeBySubId({ subId: 'oj-conveyorbelt-start-overflow-indicator' });
        var endIndicator =
            this.getNodeBySubId({ subId: 'oj-conveyorbelt-end-overflow-indicator' });
        var topIndicator =
            this.getNodeBySubId({ subId: 'oj-conveyorbelt-top-overflow-indicator' });
        var bottomIndicator =
            this.getNodeBySubId({ subId: 'oj-conveyorbelt-bottom-overflow-indicator' });
        var currentNode = node;
        var elem = this.element[0];
        while (currentNode && currentNode !== elem) {
          if (currentNode === startIndicator) {
            return { subId: 'oj-conveyorbelt-start-overflow-indicator' };
          } else if (currentNode === endIndicator) {
            return { subId: 'oj-conveyorbelt-end-overflow-indicator' };
          } else if (currentNode === topIndicator) {
            return { subId: 'oj-conveyorbelt-top-overflow-indicator' };
          } else if (currentNode === bottomIndicator) {
            return { subId: 'oj-conveyorbelt-bottom-overflow-indicator' };
          }

          currentNode = currentNode.parentElement;
        }
        return null;
      }

      // start API doc fragments /////////////////////////////////////////////////////

      /**
       * <p>Sub-ID for the start overflow indicator of a horizontal ConveyorBelt.</p>
       *
       * @ojsubid oj-conveyorbelt-start-overflow-indicator
       * @memberof oj.ojConveyorBelt
       *
       * @example <caption>Get the start overflow indicator:</caption>
       * var node = myConveyorBelt.getNodeBySubId({'subId': 'oj-conveyorbelt-start-overflow-indicator'} );
       */

      /**
       * <p>Sub-ID for the end overflow indicator of a horizontal ConveyorBelt.</p>
       *
       * @ojsubid oj-conveyorbelt-end-overflow-indicator
       * @memberof oj.ojConveyorBelt
       *
       * @example <caption>Get the end overflow indicator:</caption>
       * var node = myConveyorBelt.getNodeBySubId({'subId': 'oj-conveyorbelt-end-overflow-indicator'} );
       */

      /**
       * <p>Sub-ID for the top overflow indicator of a vertical ConveyorBelt.</p>
       *
       * @ojsubid oj-conveyorbelt-top-overflow-indicator
       * @memberof oj.ojConveyorBelt
       *
       * @example <caption>Get the top overflow indicator:</caption>
       * var node = myConveyorBelt.getNodeBySubId({'subId': 'oj-conveyorbelt-top-overflow-indicator'} );
       */

      /**
       * <p>Sub-ID for the bottom overflow indicator of a vertical ConveyorBelt.</p>
       *
       * @ojsubid oj-conveyorbelt-bottom-overflow-indicator
       * @memberof oj.ojConveyorBelt
       *
       * @example <caption>Get the bottom overflow indicator:</caption>
       * var node = myConveyorBelt.getNodeBySubId({'subId': 'oj-conveyorbelt-bottom-overflow-indicator'} );
       */

      /**
       * <table class="keyboard-table">
       *   <thead>
       *     <tr>
       *       <th>Target</th>
       *       <th>Gesture</th>
       *       <th>Action</th>
       *     </tr>
       *   </thead>
       *   <tbody>
       *     <tr>
       *       <td>ConveyorBelt</td>
       *       <td><kbd>Swipe</kbd></td>
       *       <td>Transition to an adjacent logical page of child items.</td>
       *     </tr>
       *     <tr>
       *       <td>Navigation Arrow</td>
       *       <td><kbd>Tap</kbd></td>
       *       <td>Transition to an adjacent logical page of child items.</td>
       *     </tr>
       *   </tbody>
       * </table>
       *
       * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
       * @memberof oj.ojConveyorBelt
       */

      /**
       * <p>ConveyorBelt is for layout only and does not directly support keyboard
       * interaction. It is up to the application to provide keyboard support.
       *
       * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
       * @memberof oj.ojConveyorBelt
       */

      // end API doc fragments ///////////////////////////////////////////////////////

    }); // end of oj.__registerWidget
}()); // end of ConveyorBelt wrapper function


/* global __oj_conveyor_belt_metadata:false */
(function () {
  __oj_conveyor_belt_metadata.extension._WIDGET_NAME = 'ojConveyorBelt';
  oj.CustomElementBridge.register('oj-conveyor-belt', { metadata: __oj_conveyor_belt_metadata });
}());

});