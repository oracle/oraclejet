/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore'],
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

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
 *  - prevButtonId: Id to use for the scroll previous button,
 *  - nextButtonId: Id to use for the scroll next button,
 *  - prevButtonStyleClass: Style class name to use for the scroll previous button,
 *  - nextButtonStyleClass: Style class name to use for the scroll next button,
 *  - prevButtonIcon: Icon element to use for the scroll previous button,
 *  - nextButtonIcon: Icon element to use for the scroll next button,
 * @param {Object} callbackInfo Map of properties for the following callback information:
 *  - scrollFunc: Callback function to animate scrolling a DOM element, 
 *  - firstVisibleItemChangedFunc: Callback function to notify when the first visible item changes, 
 *  - addResizeListener: Callback function to add a resize listener for a DOM element
 *  - removeResizeListener: Callback function to remove a resize listener for a DOM element
 *  - addStyleClassName: Callback function to add a style class name to a DOM element
 *  - removeStyleClassName: Callback functin to remove a style class name from a DOM element
 *  - hasStyleClassName: Callback function to check whether a style class name is applied
 *    to a DOM element,
 *  - filterContentElements: Callback function to filter the array of conveyor content elements,
 *  - callbackObj: Optional object on which the callback functions are defined
 *    has changed
 * @param {Object} styleInfo Map of properties for the following style information:
 *  - overflowContainerStyleClass: Style class name for the overflow container DOM element,
 *  - contentContainerStyleClass: Style class name for the content container DOM element,
 *  - itemStyleClass: Style class name for the DOM element of an item in the conveyor,
 *  - hiddenStyleClass: Style class name used to hide a DOM element
 * @constructor
 * @ignore
 */
function ConveyorBeltCommon(
  elem, orientation, contentParent, bRtl, buttonInfo, callbackInfo, styleInfo)
{
  this._elem = elem;
  this._orientation = orientation;
  this._contentParent = contentParent;
  this._bRtl = bRtl;
  if (buttonInfo)
  {
    //need to check for existence of properties on buttonInfo before assigning 
    //them to vars because advanced closure compiler will otherwise complain if 
    //they're not defined
    if (buttonInfo.prevButtonId)
      this._prevButtonId = buttonInfo.prevButtonId;
    if (buttonInfo.nextButtonId)
      this._nextButtonId = buttonInfo.nextButtonId;
    if (buttonInfo.prevButtonStyleClass)
      this._prevButtonStyleClass = buttonInfo.prevButtonStyleClass;
    if (buttonInfo.nextButtonStyleClass)
      this._nextButtonStyleClass = buttonInfo.nextButtonStyleClass;
    if (buttonInfo.prevButtonIcon)
      this._prevButtonIcon = buttonInfo.prevButtonIcon;
    if (buttonInfo.nextButtonIcon)
      this._nextButtonIcon = buttonInfo.nextButtonIcon;
  }
  if (callbackInfo)
  {
    //need to check for existence of properties on callbackInfo before assigning 
    //them to vars because advanced closure compiler will otherwise complain if 
    //they're not defined
    if (callbackInfo.scrollFunc)
      this._scrollFunc = callbackInfo.scrollFunc;
    if (callbackInfo.firstVisibleItemChangedFunc)
      this._firstVisibleItemChangedFunc = callbackInfo.firstVisibleItemChangedFunc;
    if (callbackInfo.callbackObj)
      this._callbackObj = callbackInfo.callbackObj;
    if (callbackInfo.addResizeListener)
      this._addResizeListenerFunc = callbackInfo.addResizeListener;
    if (callbackInfo.removeResizeListener)
      this._removeResizeListenerFunc = callbackInfo.removeResizeListener;
    if (callbackInfo.addStyleClassName)
      this._addStyleClassNameFunc = callbackInfo.addStyleClassName;
    if (callbackInfo.removeStyleClassName)
      this._removeStyleClassNameFunc = callbackInfo.removeStyleClassName;
    if (callbackInfo.hasStyleClassName)
      this._hasStyleClassNameFunc = callbackInfo.hasStyleClassName;
    if (callbackInfo.filterContentElements)
      this._filterContentElementsFunc = callbackInfo.filterContentElements;
  }
  if (styleInfo)
  {
    if (styleInfo.overflowContainerStyleClass)
      this._overflowContainerStyleClass = styleInfo.overflowContainerStyleClass;
    if (styleInfo.contentContainerStyleClass)
      this._contentContainerStyleClass = styleInfo.contentContainerStyleClass;
    if (styleInfo.itemStyleClass)
      this._itemStyleClass = styleInfo.itemStyleClass;
    if (styleInfo.hiddenStyleClass)
      this._hiddenStyleClass = styleInfo.hiddenStyleClass;
  }
  
  this._bExternalScroll = true;
  this._firstVisibleItemIndex = 0;
  
  //copied basic checks from AdfAgent
  var navUserAgent = navigator.userAgent;
  var agentName = navUserAgent.toLowerCase();
  if (agentName.indexOf("gecko/") !== -1)
  {
    this._bAgentGecko = true;
  }
  else if (agentName.indexOf("opera") !== -1)
  {
    this._bAgentOpera = true;
  }
  else if (agentName.indexOf("applewebkit") !== -1 ||
           agentName.indexOf("safari") !== -1)
  {
    this._bAgentWebkit = true;
  }
};

/**
 * Setup the conveyor belt.
 * @param {boolean} bInit True for initialization, false for refresh
 */
ConveyorBeltCommon.prototype.setup = function(bInit)
{
  var self = this;
  var cbcClass = ConveyorBeltCommon;
  if (bInit)
  {
    //create the content and overflow containers
    this._createInnerContainers();
    
    //create the next/prev buttons
    this._createPrevButton(this._prevButtonId, this._prevButtonStyleClass, this._prevButtonIcon);
    this._createNextButton(this._nextButtonId, this._nextButtonStyleClass, this._nextButtonIcon);
    
    var nextButton = this._nextButton;
    this._buttonWidth = nextButton.offsetWidth;
    this._buttonHeight = nextButton.offsetHeight;
    
    //hide the buttons until we know we need them
    this._hidePrevButton();
    this._hideNextButton();
    
    //handle the mouse wheel on the whole conveyor
    this._mouseWheelListener = function (event) {self._handleMouseWheel(event);};
    cbcClass._addBubbleEventListener(this._elem, "mousewheel", this._mouseWheelListener);
    cbcClass._addBubbleEventListener(this._elem, "wheel", this._mouseWheelListener);
    
    //handle swipe gestures on the overflow container, which excludes the next/prev buttons
    this._touchStartListener = function (event) {self._handleTouchStart(event);};
    cbcClass._addBubbleEventListener(this._overflowContainer, "touchstart", this._touchStartListener);
    this._touchMoveListener = function (event) {self._handleTouchMove(event);};
    cbcClass._addBubbleEventListener(this._overflowContainer, "touchmove", this._touchMoveListener);
    this._touchEndListener = function (event) {self._handleTouchEnd(event);};
    cbcClass._addBubbleEventListener(this._overflowContainer, "touchend", this._touchEndListener);
    cbcClass._addBubbleEventListener(this._overflowContainer, "touchcancel", this._touchEndListener);
    
    this._origScroll = 0;
  }
  else
  {
    //need to restore inner DOM to its initial state before we can accurately
    //calculate sizes
    this._reinitializeInnerDom();
  }

  //clear any old sizes so that new sizes will be calculated
  this._clearCachedSizes();
  //adjust overflow size
  this._adjustOverflowSize(bInit);
  //handle an initial resize
  this._handleResize(true);
  
  if (bInit && this._addResizeListenerFunc)
  {
    this._handleResizeFunc = function(width, height) {self._handleResize(false);};
    //listen for resizes on both the conveyor itself and on its content
    this._addResizeListenerFunc.call(this._callbackObj, this._elem, this._handleResizeFunc);
    this._addResizeListenerFunc.call(this._callbackObj, this._contentContainer, this._handleResizeFunc);
  }
};

/**
 * Destroy the conveyor belt.
 */
ConveyorBeltCommon.prototype.destroy = function()
{
  var elem = this._elem;
  var cbcClass = ConveyorBeltCommon;
  cbcClass._removeBubbleEventListener(elem, "mousewheel", this._mouseWheelListener);
  cbcClass._removeBubbleEventListener(elem, "wheel", this._mouseWheelListener);
  cbcClass._removeBubbleEventListener(this._overflowContainer, "touchstart", this._touchStartListener);
  cbcClass._removeBubbleEventListener(this._overflowContainer, "touchmove", this._touchMoveListener);
  cbcClass._removeBubbleEventListener(this._overflowContainer, "touchend", this._touchEndListener);
  cbcClass._removeBubbleEventListener(this._overflowContainer, "touchcancel", this._touchEndListener);
  this._mouseWheelListener = null;
  this._touchStartListener = null;
  this._touchMoveListener = null;
  this._touchEndListener = null;
  
  //remove listeners before reparenting original children and clearing member 
  //variables
  if (this._removeResizeListenerFunc && this._handleResizeFunc)
  {
    this._removeResizeListenerFunc.call(this._callbackObj, elem, this._handleResizeFunc);
    this._removeResizeListenerFunc.call(this._callbackObj, this._contentContainer, this._handleResizeFunc);
  }
  this._handleResizeFunc = null;
  
  //move the original content children from the _contentContainer back to the 
  //original DOM element
  this._reparentChildrenFromContentContainer(this._contentContainer, elem);
  
  //the content container is a child of the overflow container
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
  this._firstVisibleItemChangedFunc = null;
  this._addResizeListenerFunc = null;
  this._removeResizeListenerFunc = null;
  this._addStyleClassNameFunc = null;
  this._removeStyleClassNameFunc = null;
  this._hasStyleClassNameFunc = null;
  this._filterContentElementsFunc = null;
  this._callbackObj = null;

  this._contentParent = null;

};

/**
 * Set the id of the item to make first visible.
 * @param {string} id id of the item to make first visible
 */
ConveyorBeltCommon.prototype.setFirstVisibleItem = function(id)
{
  var sizes = this._getSizes();
  for (var i = 0; i < sizes.length; i++)
  {
    var sizeObj = sizes[i];
    if (sizeObj.id === id)
    {
      this._setCurrScroll(sizeObj.start, true);
      break;
    }
  }
};

/**
 * Handle a component resize.
 */
ConveyorBeltCommon.prototype.handleResize = function()
{
  this._handleResize(false);
};

/**
 * Set the scroll position.
 * @param {number} scroll Desired logical scroll position
 * @param {boolean} bImmediate True to make the change immediately, false to animate it
 */
ConveyorBeltCommon.prototype.setScroll = function(scroll, bImmediate)
{
  this._setCurrScroll(scroll, bImmediate);
};

/**
 * Get the current scroll position.
 * @return {number} Logical scroll position
 */
ConveyorBeltCommon.prototype.getScroll = function()
{
  return this._getCurrScroll();
};

/**
 * Reparent the DOM child nodes from their old parent node to a new parent 
 * content container node.
 * @param {Object} fromNode Old parent DOM node
 * @param {Object} toNode New parent DOM node
 */
ConveyorBeltCommon.prototype._reparentChildrenToContentContainer = function(
  fromNode, toNode)
{
  var cbcClass = ConveyorBeltCommon;
  
  var fromNodeChildren = fromNode.childNodes;
  while (fromNodeChildren.length > 0)
  {
    var child = fromNodeChildren[0];
    toNode.appendChild(child); // @HtmlUpdateOK
    
    if (child.nodeType === 1 && this._itemStyleClass)
      this._addStyleClassNameFunc(child, this._itemStyleClass);
  }
};

/**
 * Reparent the DOM child nodes from the content container to a new 
 * parent node.
 * @param {Object} fromNode Old parent DOM node
 * @param {Object} toNode New parent DOM node
 */
ConveyorBeltCommon.prototype._reparentChildrenFromContentContainer = function(
  fromNode, toNode)
{
  if (!fromNode)
    return;
  
  var children = fromNode.childNodes;
  while (children.length > 0)
  {
    var child = children[0];
    toNode.appendChild(child); // @HtmlUpdateOK
    
    if (child.nodeType === 1 && this._itemStyleClass)
      this._removeStyleClassNameFunc(child, this._itemStyleClass);
  }
};

/**
 * Get the computed style of the given DOM element.
 * @param {Object} elem DOM element
 * @return {Object} Computed style for the element
 */
ConveyorBeltCommon._getComputedStyle = function(elem)
{
  var elemOwnerDoc = elem.ownerDocument;
  var defView = elemOwnerDoc.defaultView;
  var computedStyle = null;
  if (defView)
  {
    //this line copied from AdfAgent.getComputedStyle()
    computedStyle = defView.getComputedStyle(elem, null);
  }
  else
  {
    //this line copied from AdfIEAgent.getComputedStyle()
    computedStyle = elem.currentStyle;
  }
  return computedStyle;
};

/**
 * Get the inner width of the given DOM element (inside borders and padding).
 * @param {Object} elem DOM element
 * @return {number} Width of element
 */
ConveyorBeltCommon._getElemInnerWidth = function(elem)
{
  var cbcClass = ConveyorBeltCommon;
  var computedStyle = cbcClass._getComputedStyle(elem);
  //the computedStyle width is the inner width of the elem
  return cbcClass._getCSSLengthAsInt(computedStyle.width);
};

/**
 * Get the inner height of the given DOM element (inside borders and padding).
 * @param {Object} elem DOM element
 * @return {number} Height of element
 */
ConveyorBeltCommon._getElemInnerHeight = function(elem)
{
  var cbcClass = ConveyorBeltCommon;
  var computedStyle = cbcClass._getComputedStyle(elem);
  //the computedStyle height is the inner height of the elem
  return cbcClass._getCSSLengthAsInt(computedStyle.height);
};

/**
 * Get the int value of a CSS length.
 * @param {string} cssLength cssLength as a String
 * @return {number} cssLength as an int
 */
ConveyorBeltCommon._getCSSLengthAsInt = function(cssLength)
{
  //this function copied from AdfAgent.getCSSLengthAsInt
  if ((cssLength.length) > 0 && (cssLength != 'auto'))
  {
    var intLength = parseInt(cssLength, 10);

    if (isNaN(intLength))
      intLength = 0;

    return intLength;
  }
  return 0;
};

/**
 * Add a bubble event listener to the given DOM node.
 * @param {Object} node DOM node
 * @param {string} type Event type
 * @param {Function} listener Listener function
 */
ConveyorBeltCommon._addBubbleEventListener = function(node, type, listener)
{
  if (node.addEventListener)
  {
    node.addEventListener(type, listener, false);
  }
  else if (node.attachEvent)
  {
    node.attachEvent("on" + type, listener);
  }
};

/**
 * Remove a bubble event listener from the given DOM node.
 * @param {Object} node DOM node
 * @param {string} type Event type
 * @param {Function} listener Listener function
 */
ConveyorBeltCommon._removeBubbleEventListener = function(node, type, listener)
{
  if (node.removeEventListener)
  {
    node.removeEventListener(type, listener, false);
  }
  else if (node.detachEvent)
  {
    node.detachEvent("on" + type, listener);
  }
};

/**
 * Get the wheel delta from a mousewheel event.
 * @param {Object} event Event object
 * @return {number} Wheel delta
 */
ConveyorBeltCommon._getWheelDelta = function(event)
{
  var wheelDelta = 0;
  if (event.wheelDelta != null)
  {
    wheelDelta = event.wheelDelta;
  }
  //use bracket notation to avoid compilation warning in JET
  else if (event["deltaY"] != null)
  {
    wheelDelta = -event["deltaY"];
  }
  else
  {
    wheelDelta = -event.detail;
  }
  return wheelDelta;
};

/**
 * Create a div styled like a table.
 * @return {Node} div styled like a table row
 */
ConveyorBeltCommon._createTableDiv = function()
{
  var tableDiv = document.createElement("div");
  var style = tableDiv.style;
  style.display = "table";
  return tableDiv;
};

/**
 * Create a div styled like a table row.
 * @return {Node} div styled like a table row
 */
ConveyorBeltCommon._createTableRowDiv = function()
{
  var tableRowDiv = document.createElement("div");
  var style = tableRowDiv.style;
  style.display = "table-row";
  return tableRowDiv;
};

/**
 * Create a div styled like a table cell.
 * @return {Node} div styled like a table cell
 */
ConveyorBeltCommon._createTableCellDiv = function()
{
  var tableCellDiv = document.createElement("div");
  var style = tableCellDiv.style;
  style.display = "table-cell";
  return tableCellDiv;
};

/**
 * Wrap the given element in an inline-block div and append it to the given 
 * parent element.  Restrict the max size of the wrapper div to be its reported 
 * offset size.  This helps prevent off-by-one pixel errors when the size of the
 * element is really a float instead of an int, as reported by the offset size.  
 * @param {Node} elem DOM element to wrap
 * @param {Node} parentElem Parent DOM element to append child to
 * @param {boolean} bWidth True to restrict the element's width, false otherwise
 * @param {boolean} bHeight True to restrict the element's height, false otherwise
 * @return {Node} The wrapper div element
 */
ConveyorBeltCommon._wrapAndRestrictSize = function(
  elem, parentElem, bWidth, bHeight)
{
  var wrapperDiv = document.createElement("div");
  var wrapperDivStyle = wrapperDiv.style;
  //make sure the wrapper div fits its content
  wrapperDivStyle.display = "inline-block";

  //need to add everything to the DOM before getting sizes
  wrapperDiv.appendChild(elem); // @HtmlUpdateOK
  parentElem.appendChild(wrapperDiv); // @HtmlUpdateOK
  
  //restrict the size of the wrapper div so that it's an integer value
  if (bWidth)
  {
    wrapperDivStyle.maxWidth = wrapperDiv.offsetWidth + "px";
  }
  if (bHeight)
  {
    wrapperDivStyle.maxHeight = wrapperDiv.offsetHeight + "px";
  }
  
  return wrapperDiv;
};

/**
 * Determine if this conveyor belt is horizontal or vertical.
 * @return {boolean} True if the conveyor belt is horizontal, false if vertical
 */
ConveyorBeltCommon.prototype._isHorizontal = function()
{
  return (this._orientation === "horizontal");
};

/**
 * Determine if this conveyor belt is empty.
 * @return {boolean} True if the conveyor belt is empty, false if not
 */
ConveyorBeltCommon.prototype._isEmpty = function()
{
  var contentParent = this._getContentParent();
  return !contentParent.hasChildNodes();
};

/**
 * Restore inner DOM to its initial state before sizes were calculated.
 */
ConveyorBeltCommon.prototype._reinitializeInnerDom = function()
{
  //restore inner DOM to initial state in order to accurately calculate new sizes

  //save original scroll value for use in _adjustOverflowSize()
  this._origScroll = this._getCurrScroll();
  this._setOverflowScroll(0);

  //hide the buttons until we know we need them
  this._hidePrevButton();
  this._hideNextButton();
};

/**
 * Clear cached sizes.
 */
ConveyorBeltCommon.prototype._clearCachedSizes = function()
{
  this._totalSize = null;
  this._sizes = null;
};

/**
 * Handle a component resize.
 * @param {boolean} bSetup True when called from setup, false otherwise
 */
ConveyorBeltCommon.prototype._handleResize = function(bSetup)
{
  //if this is not the first call, need to reinitialize the inner DOM before
  //we can accurately calculate new sizes (if this is the first call, DOM
  //is already in initial state)
  if (!bSetup)
  {
    this._reinitializeInnerDom();
  }
  this._clearCachedSizes();
  if (!this._totalSize || !this._sizes)
  {
    //measure content size
    this._totalSize = this._measureContents();
  }
  //if this is not the first call, need to adjust the overflow size (if this 
  //is the first call, the overflow size was already adjusted in setup)
  if (!bSetup)
  {
    this._adjustOverflowSize(false);
  }
  //center buttons orthogonal to conveyor orientation
  this._alignButtons();
};

/**
 * Center the overflow buttons orthogonal to the conveyor orientation.
 */
ConveyorBeltCommon.prototype._alignButtons = function()
{
  var nextButton = this._nextButton;
  var prevButton = this._prevButton;
  var nextButtonStyle = nextButton.style;
  var prevButtonStyle = prevButton.style;
  var contentContainer = this._contentContainer;
  var totalSize = this._totalSize;
  var sizes = this._sizes;
  
  if (this._isHorizontal())
  {
    var vOffset = .5 * (totalSize.h - contentContainer.offsetHeight);
    nextButtonStyle.top = vOffset + "px";
    prevButtonStyle.top = vOffset + "px";
  }
  else
  {
    var hOffset = .5 * (totalSize.w - contentContainer.offsetWidth);
    if (this._bRtl)
      hOffset = -hOffset;
    nextButtonStyle.left = hOffset + "px";
    prevButtonStyle.left = hOffset + "px";
  }
};

/**
 * Adjust the overflow size.
 * @param {boolean} bInit True for initialization, false for refresh
 */
ConveyorBeltCommon.prototype._adjustOverflowSize = function(bInit)
{
  var contentContainer = this._contentContainer;
  var bHoriz = this._isHorizontal();

  var cbcClass = ConveyorBeltCommon;
  var elemInnerSize = bHoriz ? 
                      cbcClass._getElemInnerWidth(this._elem) : 
                      cbcClass._getElemInnerHeight(this._elem);
  
  this._minScroll = 0;
  //take the button size into account for max scroll position
  this._maxScroll = bHoriz ? 
                    contentContainer.offsetWidth - elemInnerSize + this._buttonWidth : 
                    contentContainer.offsetHeight - elemInnerSize + this._buttonHeight;
  //constrain max scroll
  if (this._maxScroll < 0)
  {
    this._maxScroll = 0;
  }
  
  //hide buttons AFTER calculating sizes above, but BEFORE updating scroll position below
  this._hidePrevButton();
  this._hideNextButton();
  
  //refresh current scroll position AFTER calculating sizes above
  this._setCurrScroll(bInit ? this._minScroll : this._origScroll, true);
  this._origScroll = 0;
};

/**
 * Create the inner overflow and content containers.
 */
ConveyorBeltCommon.prototype._createInnerContainers = function()
{
  //the original children of the conveyor elem will be reparented to the contentContainer;
  //the conveyor elem will contain the overflowContainer, which will contain the contentContainer, 
  //which will contain the original children
  
  var self = this;
  
  var elem = this._elem;
  var cbcClass = ConveyorBeltCommon;
  var overflowContainer = document.createElement("div");
  this._overflowContainer = overflowContainer;
  if (this._overflowContainerStyleClass)
    this._addStyleClassNameFunc(overflowContainer, this._overflowContainerStyleClass);
  var contentContainer = document.createElement("div");
  this._contentContainer = contentContainer;
  if (this._contentContainerStyleClass)
    this._addStyleClassNameFunc(contentContainer, this._contentContainerStyleClass);
  
  //reparent children from elem to contentContainer before adding 
  //content container to elem
  this._reparentChildrenToContentContainer(elem, contentContainer);
  
  elem.appendChild(overflowContainer); // @HtmlUpdateOK
  overflowContainer.appendChild(contentContainer); // @HtmlUpdateOK
  
  //the overflow container listens to DOM scroll events in case the scroll was triggered externally,
  //for example when the user tabs through the child content
  cbcClass._addBubbleEventListener(overflowContainer, "scroll", function (event) {self._handleScroll(event);});
};

/**
 * Get the content elements of the conveyor.
 * @return {Array} array of content elements
 */
ConveyorBeltCommon.prototype._getContentElements = function()
{
  var arContentElements = [];
  
  //if there is a nested contentParent, then we need to put its children into
  //arContentElements instead of the children of the contentContainer
  var parent = this._contentParent ? this._contentParent : this._contentContainer;
  
  var contentChildren = parent.children;
  var numContentChildren = contentChildren.length;
  for (var i = 0; i < numContentChildren; i++)
  {
    var child = contentChildren[i];
    if (child.nodeType === 1)
    {
      arContentElements.push(child);
    }
  }
  
  if (this._filterContentElementsFunc)
  {
    var filterFunc = this._filterContentElementsFunc;
    arContentElements = filterFunc(arContentElements);
  }
  
  //if the content elements are direct children of the contentContainer, meaning there's no nested
  //contentParent, then make sure they have the itemStyleClass applied to them in case they were
  //added dynamically
  if (parent === this._contentContainer && this._itemStyleClass)
  {
    for (var i = 0; i < arContentElements.length; i++)
    {
      var contentElem = arContentElements[i];
      if (!this._hasStyleClassNameFunc(contentElem, this._itemStyleClass))
        this._addStyleClassNameFunc(contentElem, this._itemStyleClass);
    }
  }
  
  return arContentElements;
};

/**
 * Create the prev button.
 * @param {string} buttonId Id to use for the button
 * @param {string} buttonStyleClass Style class to use for the button
 * @param {Node} icon Button icon element
 */
ConveyorBeltCommon.prototype._createPrevButton = function(
  buttonId, buttonStyleClass, icon)
{
  var self = this;
  var prevButton = document.createElement("div");
  this._prevButton = prevButton;
  if (buttonId)
  {
    prevButton.setAttribute("id", buttonId);
  }
  prevButton.setAttribute("class", buttonStyleClass);
  //hide the button from screen readers because it is not keyboard accessible
  prevButton.setAttribute("aria-hidden", "true");
  var bHoriz = this._isHorizontal();
  var cbcClass = ConveyorBeltCommon;
  cbcClass._addBubbleEventListener(prevButton, "click", function (event) {self._scrollPrev();});
  
  if (icon)
  {
    prevButton.appendChild(icon); // @HtmlUpdateOK
  }
  
  var elem = this._elem;
  elem.insertBefore(prevButton, this._overflowContainer); // @HtmlUpdateOK
};

/**
 * Create the next button.
 * @param {string} buttonId Id to use for the button
 * @param {string} buttonStyleClass Style class to use for the button
 * @param {Node} icon Button icon element
 */
ConveyorBeltCommon.prototype._createNextButton = function(
  buttonId, buttonStyleClass, icon)
{
  var self = this;
  var nextButton = document.createElement("div");
  this._nextButton = nextButton;
  if (buttonId)
  {
    nextButton.setAttribute("id", buttonId);
  }
  nextButton.setAttribute("class", buttonStyleClass);
  //hide the button from screen readers because it is not keyboard accessible
  nextButton.setAttribute("aria-hidden", "true");
  var bHoriz = this._isHorizontal();
  var cbcClass = ConveyorBeltCommon;
  cbcClass._addBubbleEventListener(nextButton, "click", function (event) {self._scrollNext();});
  
  if (icon)
  {
    nextButton.appendChild(icon); // @HtmlUpdateOK
  }
  
  var elem = this._elem;
  elem.appendChild(nextButton); // @HtmlUpdateOK
};

/**
 * Get the content parent.
 * @return {Object} parent DOM element of the content
 */
ConveyorBeltCommon.prototype._getContentParent = function()
{
  //if an explicit content parent was not specified, it will be the _contentContainer
  var contentParent = this._contentParent;
  if (!contentParent)
  {
    contentParent = this._contentContainer;
  }
  return contentParent;
};

/**
 * Measure the contents of the conveyor.
 * @return {Object} Total size of the contents
 */
ConveyorBeltCommon.prototype._measureContents = function()
{
  var contentParent = this._getContentParent();
  var arContentElements = this._getContentElements();
  var totalSize = {w: 0, h: 0};
  var sizes = [];
  if (contentParent.hasChildNodes() && arContentElements &&
      arContentElements.length > 0)
  {
    var children = arContentElements;
    var bHoriz = this._isHorizontal();
    var contentWidth = 0;

    //get the width of the contentContainer, not the contentParent, because
    //in JET, if the children are in a buttonset, for example, the offsetLeft
    //of the children is relative to the contentContainer, not the 
    //contentParent
    var contentContainer = this._contentContainer;
    contentWidth = contentContainer.offsetWidth;

    var startOffset = 0;
    var prevSizeObj = null;
    for (var i = 0; i < children.length; i++)
    {
      var child = children[i];
      if (child.nodeType === 1)
      {
        var ww = child.offsetWidth;
        var hh = child.offsetHeight;
        var childId = child.id;
        var sizeObj = {w: ww, h: hh, id: childId};
        //calculating the start assumes that the browser has done the appropriate layout;
        //subtract 1 from the end so it's the last pixel of this child, not the start of the next child
        if (bHoriz)
        {
          //FIX : in IE, the conveyor items all report offsetLeft=0,
          //so we need to get the offset from the parent wrapping table cell div
          //instead
          var offLeft = child.offsetLeft;
          if (!this._contentParent && offLeft === 0)
          {
            var childParent = child.parentNode;
            offLeft = childParent.offsetLeft;
          }
          
          //if RTL, still want to save the start coords in logical, ascending order beginning with 0
          if (this._bRtl)
          {
            sizeObj.start = contentWidth - (offLeft + ww);
          }
          else
          {
            sizeObj.start = offLeft;
          }
          
          //Offset each item's start coord by the first item's offset to handle cases like text-align:right,
          //where the items may be right-aligned within the content container.  We still want our logical 
          //coords to start at 0.
          if (i === 0)
            startOffset = sizeObj.start;
          sizeObj.start -= startOffset;
          
          totalSize.w = sizeObj.start + ww;
          totalSize.h = Math.max(totalSize.h, hh);
          sizeObj.end = totalSize.w - 1;
        }
        else
        {
          //FIX : in IE, the conveyor items all report offsetTop=0,
          //so we need to get the offset from the parent wrapping table cell div
          //instead
          var offTop = child.offsetTop;
          if (!this._contentParent && offTop === 0)
          {
            var childParent = child.parentNode;
            offTop = childParent.offsetTop;
          }
          
          sizeObj.start = offTop;
          totalSize.w = Math.max(totalSize.w, ww);
          totalSize.h = sizeObj.start + hh;
          sizeObj.end = totalSize.h - 1;
        }
        
        //if this item overlaps the previous item, adjust the previous item to
        //end just before this item (can happen, for example, with horizontal
        //JET buttonsets)
        if (prevSizeObj)
        {
          if (prevSizeObj.end >= sizeObj.start)
          {
            var overlap = prevSizeObj.end - (sizeObj.start - 1);
            prevSizeObj.end -= overlap;
            if (bHoriz)
            {
              prevSizeObj.w -= overlap;
            }
            else
            {
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
 */
ConveyorBeltCommon.prototype._getSizes = function()
{
  //only calculate sizes if they haven't been calculated already
  if (!this._sizes)
  {
    var totalSize = this._measureContents();
    //only save the total size if it hasn't already been saved
    if (!this._totalSize)
    {
      this._totalSize = totalSize;
    }
  }
  return this._sizes;
};

/**
 * Show the next button.
 */
ConveyorBeltCommon.prototype._showNextButton = function()
{
  this._removeStyleClassNameFunc(this._nextButton, this._hiddenStyleClass);
};

/**
 * Show the prev button.
 */
ConveyorBeltCommon.prototype._showPrevButton = function()
{
  this._removeStyleClassNameFunc(this._prevButton, this._hiddenStyleClass);
};

/**
 * Hide the next button.
 */
ConveyorBeltCommon.prototype._hideNextButton = function()
{
  this._addStyleClassNameFunc(this._nextButton, this._hiddenStyleClass);
};

/**
 * Hide the prev button.
 */
ConveyorBeltCommon.prototype._hidePrevButton = function()
{
  this._addStyleClassNameFunc(this._prevButton, this._hiddenStyleClass);
};

/**
 * Determine if the next button is shown.
 * @return {boolean} true if shown, false if hidden
 */
ConveyorBeltCommon.prototype._isNextButtonShown = function()
{
  return !this._hasStyleClassNameFunc(this._nextButton, this._hiddenStyleClass);
};

/**
 * Determine if the prev button is shown.
 * @return {boolean} True if shown, false if hidden
 */
ConveyorBeltCommon.prototype._isPrevButtonShown = function()
{
  return !this._hasStyleClassNameFunc(this._prevButton, this._hiddenStyleClass);
};

/**
 * Get the size of a next/prev button along the direction of conveyor orientation.
 * @return {number} Size of a button
 */
ConveyorBeltCommon.prototype._getButtonSize = function()
{
  return this._isHorizontal() ? this._buttonWidth : this._buttonHeight;
};

/**
 * Update visibility of the next/prev buttons and adjust scroll position accordingly.
 * @param {number} scroll Desired scroll position
 */
ConveyorBeltCommon.prototype._updateButtonVisibility = function(scroll)
{
  var buttonSize = this._getButtonSize();
  var ovScroll = this._getCurrScroll();
  var ovSize = this._getCurrViewportSize();
  var bNeedsScroll = this._needsScroll();
  //if scrolling to the start, hide the prev button and reclaim its space
  if (scroll <= this._minScroll)
  {
    if (this._isPrevButtonShown())
    {
      ovSize += buttonSize;
      ovScroll -= buttonSize;
    }
    this._hidePrevButton();
  }
  //if not at the start, show the prev button and allocate space for it
  else if (bNeedsScroll)
  {
    if (!this._isPrevButtonShown())
    {
      ovSize -= buttonSize;
      ovScroll += buttonSize;
    }
    this._showPrevButton();
  }

  //if scrolling to the end, hide the next button and reclaim its space
  if (scroll >= this._maxScroll)
  {
    if (this._isNextButtonShown())
    {
      ovSize += buttonSize;
    }
    this._hideNextButton();
  }
  //if not at the end, show the next button and allocate space for it
  else if (bNeedsScroll)
  {
    if (!this._isNextButtonShown())
    {
      ovSize -= buttonSize;
    }
    this._showNextButton();
  }
  //update the overflow container
  this._setOverflowScroll(ovScroll);
};

/**
 * Set the overflow scroll position.
 * @param {number} scroll Overflow logical scroll position
 */
ConveyorBeltCommon.prototype._setOverflowScroll = function(scroll)
{
  var container = this._overflowContainer;
  if (this._isHorizontal())
  {
    container.scrollLeft = this._convertScrollLogicalToBrowser(scroll);
  }
  else
  {
    container.scrollTop = scroll;
  }
};

/**
 * Get the current overflow viewport size.
 * @return {number} Overflow viewport size
 */
ConveyorBeltCommon.prototype._getCurrViewportSize = function()
{
  var container = this._overflowContainer;
  return this._isHorizontal() ? container.offsetWidth : container.offsetHeight;
};

/**
 * Set the scroll position.
 * @param {number} scroll Desired logical scroll position
 * @param {boolean} bImmediate True to make the change immediately, false to animate it
 */
ConveyorBeltCommon.prototype._setCurrScroll = function(scroll, bImmediate)
{
  //don't do anything if we're already in the middle of scrolling
  if (!this._bScrolling)
  {
    //if this function is called, the conveyor internally initiated the scroll, so turn off the 
    //flag for an externally triggered scroll
    this._bExternalScroll = false;
    this._setCurrScrollHelper(scroll, bImmediate);
  }
};

/**
 * Helper function to set scroll position.
 * @param {number} scroll Desired scroll position
 * @param {boolean} bImmediate True to make the change immediately, false to animate it
 */
ConveyorBeltCommon.prototype._setCurrScrollHelper = function(scroll, bImmediate)
{
  if (this._isEmpty())
    return;
  
  this._bScrolling = true;
  scroll = this._constrainScroll(scroll);
  //update button visibility before scrolling
  this._updateButtonVisibility(scroll);
  var scrollFunc = this._scrollFunc;
  //if making the change immediately, simply call the anim end function
  if (bImmediate || !scrollFunc || scroll === this._getCurrScroll())
  {
    //FIX : if this is an external scroll, set the current scroll
    //value again because it may be different from the passed in scroll value
    //due to showing/hiding scroll buttons (Note that for an external scroll,
    //the scroll has already happened before this function was called)
    this._onScrollAnimEnd(this._bExternalScroll ? this._getCurrScroll() : scroll);
  }
  //if animating the change, call out to the provided callback
  else
  {
    var cbcClass = ConveyorBeltCommon;
    // 1.1 px/ms is the desired animation speed, so calculate the duration based on the distance to scroll
    var duration = Math.abs(this._getCurrScroll() - scroll) / cbcClass._SCROLL_SPEED;
    var self = this;
    var onEndFunc = function () {self._onScrollAnimEnd(scroll);};
    //need to convert the logical scroll to the browser value for animating
    scrollFunc.call(this._callbackObj, this._overflowContainer, this._convertScrollLogicalToBrowser(scroll), 
                    duration, onEndFunc);
  }
};

/**
 * Get the current scroll position.
 * @return {number} Logical scroll position
 */
ConveyorBeltCommon.prototype._getCurrScroll = function()
{
  var container = this._overflowContainer;
  return this._isHorizontal() ? this._convertScrollBrowserToLogical(container.scrollLeft) : 
                                container.scrollTop;
};

/**
 * Determine if the conveyor needs to show scroll buttons.
 * @return {boolean} True if scrolling is needed, false if not
 */
ConveyorBeltCommon.prototype._needsScroll = function()
{
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
 */
ConveyorBeltCommon.prototype._constrainScroll = function(scroll)
{
  if (!this._needsScroll() || scroll < this._minScroll)
  {
    scroll = this._minScroll;
  }
  else if (scroll > this._maxScroll)
  {
    scroll = this._maxScroll;
  }
  return scroll;
};

/**
 * Handle a mousewheel event.
 * @param {Object} event Event object
 */
ConveyorBeltCommon.prototype._handleMouseWheel = function(event)
{
  //if we're already scrolling, just consume the event
  var bConsumeEvent = this._bScrolling;
  if (this._needsScroll() && !this._bScrolling)
  {
    var cbcClass = ConveyorBeltCommon;
    var wheelDelta = cbcClass._getWheelDelta(event);
    if (wheelDelta < 0 && this._isNextButtonShown())
    {
      bConsumeEvent = true;
      this._scrollNext();
    }
    else if (wheelDelta > 0 && this._isPrevButtonShown())
    {
      bConsumeEvent = true;
      this._scrollPrev();
    }
  }
  if (bConsumeEvent)
  {
    event.preventDefault();
    event.stopPropagation();
  }
};

/**
 * Handle a touchstart event.
 * @param {Object} event Event object
 */
ConveyorBeltCommon.prototype._handleTouchStart = function(event)
{
  var eventTouches = event.touches;
  if (this._needsScroll() && !this._bScrolling && eventTouches.length === 1)
  {
    this._bTouch = true;
    //save off some initial information at the start of a swipe
    var firstTouch = eventTouches[0];
    this._touchStartCoord = this._isHorizontal() ? firstTouch.pageX : firstTouch.pageY;
    this._touchStartScroll = this._getCurrScroll();
    this._touchStartNextScroll = this._calcNextScroll();
    this._touchStartPrevScroll = this._calcPrevScroll();
    //FIX : save the initial button state
    this._touchStartNextButtonShown = this._isNextButtonShown();
    this._touchStartPrevButtonShown = this._isPrevButtonShown();
  }
};

/**
 * Handle a touchmove event.
 * @param {Object} event Event object
 */
ConveyorBeltCommon.prototype._handleTouchMove = function(event)
{
  var bHoriz = this._isHorizontal();
  var eventTouches = event.touches;
  var firstTouch = eventTouches[0];
  var touchCoord = bHoriz ? firstTouch.pageX : firstTouch.pageY;
  var diff = touchCoord - this._touchStartCoord;
  //in non-RTL, if swiping left or up, scroll next; otherwise scroll prev
  //in RTL, if swiping right or up, scroll next; otherwise scroll prev
  var bNext = (bHoriz && this._bRtl) ? (diff > 0) : (diff < 0);
  //determine whether the conveyor can be scrolled in the direction of the swipe
  var canScrollInSwipeDirection = (bNext && this._touchStartNextButtonShown) ||
                                  (!bNext && this._touchStartPrevButtonShown);
  //only need to do something if we also received the touchstart and if we can
  //scroll in the swipe direction
  if (this._bTouch && canScrollInSwipeDirection)
  {
    //only scroll next/prev if the swipe is longer than the threshold; if it's
    //less, then just drag the items with the swipe
    var cbcClass = ConveyorBeltCommon;
    var container = this._overflowContainer;
    var threshold = cbcClass._SWIPE_THRESHOLD * 
                    (bHoriz ? container.offsetWidth : container.offsetHeight);
    
    //if swiping under the threshold, just move the conveyor with the swipe
    if (Math.abs(diff) < threshold)
    {
      this._setCurrScroll(this._touchStartScroll - diff, true);
      
      //if we're under the threshold, but we've already scrolled to the end,
      //then we don't need to continue trying to scroll and we don't need to
      //reset the scroll position at the end of the touch
      if ((this._touchStartNextButtonShown && !this._isNextButtonShown()) ||
          (this._touchStartPrevButtonShown && !this._isPrevButtonShown()))
      {
        this._bTouch = false;
      }
    }
    //if swiping beyond the threshold, scroll to the next/prev set of items
    else
    {
      this._setCurrScroll(bNext ? this._touchStartNextScroll : this._touchStartPrevScroll, false);
      //don't scroll again for this same swipe
      this._bTouch = false;
    }
    
    //FIX : set a flag indicating we've scrolled for this touch event
    this._scrolledForThisTouch = true;
  }
  
  //FIX : if we've scrolled for this touch event, consume the event
  //so that the page doesn't also scroll
  if (this._scrolledForThisTouch)
  {
    event.preventDefault();
    event.stopPropagation();
  }
};

/**
 * Handle a touchend event.
 * @param {Object} event Event object
 */
ConveyorBeltCommon.prototype._handleTouchEnd = function(event)
{
  //if a full page swipe hasn't happened, scroll back to the original position
  if (this._bTouch)
  {
    this._setCurrScroll(this._touchStartScroll, false);
  }
  this._bTouch = false;
  //FIX : reset the flag indicating if we've scrolled for this touch
  //event
  this._scrolledForThisTouch = false;
};

/**
 * Handle a DOM scroll event.
 * @param {Object} event Event object
 */
ConveyorBeltCommon.prototype._handleScroll = function(event)
{
  //if the scroll was triggered externally, for example by tabbing through 
  //child items, then update the visual state of the conveyor to match the
  //new scroll state
  if (this._bExternalScroll && !this._bScrolling)
  {
    this._setCurrScrollHelper(this._getCurrScroll(), true);
  }
};

/**
 * Function called after a scroll finishes.
 * @param {number} scroll Scroll position
 */
ConveyorBeltCommon.prototype._onScrollAnimEnd = function(scroll)
{
  //set the desired value after the animation to make sure that the final value is exactly what was intended,
  //in case the animation introduced interpolation errors
  this._setOverflowScroll(scroll);
  this._bExternalScroll = true;
  this._bScrolling = false;
  //if there is a callback to notify about a change of first visible item, call it now
  if (this._firstVisibleItemChangedFunc)
  {
    this._firstVisibleItemIndex = this._calcFirstVisibleItemIndex();
    //if there is more than one item visible, and the first item is only 
    //partially visible, then save the second item as the actual first visible 
    //item for state purposes (if the last navigation had been prev,
    //we would want the last visible item to remain visible)
    var lastVisIndex = this._calcLastVisibleItemIndex();
    var sizes = this._getSizes();
    var sizeObj = sizes[this._firstVisibleItemIndex];
    if (this._firstVisibleItemIndex !== lastVisIndex &&
        this._getCurrScroll() > sizeObj.start &&
        this._firstVisibleItemIndex < sizes.length - 2)
    {
      this._firstVisibleItemIndex++;
      sizeObj = sizes[this._firstVisibleItemIndex];
    }
    this._firstVisibleItemId = sizeObj.id;
    var firstVisibleItemChangedFunc = this._firstVisibleItemChangedFunc;
    firstVisibleItemChangedFunc.call(this._callbackObj, this._firstVisibleItemId);
  }
};

/**
 * Set a timout to reset the externalScroll flag.
 */
ConveyorBeltCommon.prototype._setExternalScrollTimeout = function()
{
  var self = this;
  var f = function () {if (self) self._bExternalScroll = true;};
  window.setTimeout(f, 0); // @HtmlUpdateOK
};

/**
 * Scroll to the next set of items.
 */
ConveyorBeltCommon.prototype._scrollNext = function()
{
  if (!this._bScrolling)
    this._setCurrScroll(this._calcNextScroll(), false);
};

/**
 * Scroll to the previous set of items.
 */
ConveyorBeltCommon.prototype._scrollPrev = function()
{
  if (!this._bScrolling)
    this._setCurrScroll(this._calcPrevScroll(), false);
};

/**
 * Calculate the scroll position for the next set of items.
 * @return {number} Next scroll position
 */
ConveyorBeltCommon.prototype._calcNextScroll = function()
{
  var nextIndex = this._calcNextVisibleItemIndex();
  var scroll = 0;
  //if single item is bigger than viewport, then scroll by viewport size
  if (nextIndex === this._calcFirstVisibleItemIndex())
  {
    scroll = this._getCurrScroll() + this._getCurrViewportSize();
  }
  else
  {
    scroll = this._calcStartScroll(nextIndex);
  }
  return scroll;
};

/**
 * Calculate the scroll position for the previous set of items.
 * @return {number} Previous scroll position
 */
ConveyorBeltCommon.prototype._calcPrevScroll = function()
{
  var prevIndex = this._calcPrevVisibleItemIndex();
  var scroll = 0;
  //if single item is bigger than viewport, then scroll by viewport size
  if (prevIndex === this._calcLastVisibleItemIndex())
  {
    scroll = this._getCurrScroll() - this._getCurrViewportSize();
  }
  else
  {
    scroll = this._calcEndScroll(prevIndex);
  }
  //if at the end and scrolling prev, anticipate the next button becoming 
  //visible and adjust the scroll position
  if (!this._isNextButtonShown())
  {
    scroll += this._getButtonSize();
  }
  //if scrolling prev and the scroll position is less than the size of the prev button, just
  //scroll to the very beginning because the prev button should get hidden
  if (scroll < this._getButtonSize())
  {
    scroll = this._minScroll;
  }
  return scroll;
};

/**
 * Calculate the scroll position for the start of the specified item.
 * @param {number} index Index of the item to scroll to
 * @return {number} Scroll position
 */
ConveyorBeltCommon.prototype._calcStartScroll = function(index)
{
  var sizes = this._getSizes();
  var sizeObj = sizes[index];
  return sizeObj.start;
};

/**
 * Calculate the scroll position for the end of the specified item.
 * @param {number} index Index of the item to scroll to
 * @return {number} Scroll position
 */
ConveyorBeltCommon.prototype._calcEndScroll = function(index)
{
  var sizes = this._getSizes();
  var sizeObj = sizes[index];
  return sizeObj.end - this._getCurrViewportSize() + 1;
};

/**
 * Calculate the index of the first visible item.
 * @return {number} Index of first visible item
 */
ConveyorBeltCommon.prototype._calcFirstVisibleItemIndex = function()
{
  var currScroll = this._getCurrScroll();
  var i = this._calcItemIndex(currScroll);
  return (i < 0) ? 0 : i;
};

/**
 * Calculate the index of the last visible item.
 * @return {number} Index of last visible item
 */
ConveyorBeltCommon.prototype._calcLastVisibleItemIndex = function()
{
  var elemSize = this._getCurrViewportSize();
  var currScroll = this._getCurrScroll() + elemSize - 1;
  var i = this._calcItemIndex(currScroll);
  var sizes = this._getSizes();
  return (i < 0) ? sizes.length - 1 : i;
};

/**
 * Calculate the index of the previous visible item.
 * @return {number} Index of previous visible item
 */
ConveyorBeltCommon.prototype._calcPrevVisibleItemIndex = function()
{
  var currScroll = this._getCurrScroll() - 1;
  var i = this._calcItemIndex(currScroll);
  return (i < 0) ? 0 : i;
};

/**
 * Calculate the index of the next visible item.
 * @return {number} Index of next visible item
 */
ConveyorBeltCommon.prototype._calcNextVisibleItemIndex = function()
{
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
 */
ConveyorBeltCommon.prototype._calcItemIndex = function(scroll)
{
  var sizes = this._getSizes();
  for (var i = 0; i < sizes.length; i++)
  {
    var sizeObj = sizes[i];
    if (scroll <= sizeObj.end)
      return i;
  }
  return -1;
};

/**
 * Convert a logical scroll position to its corresponding browser value.
 * @param {number} scroll logical scroll position
 * @return {number} browser scroll position
 */
ConveyorBeltCommon.prototype._convertScrollLogicalToBrowser = function(scroll)
{
  //(comment mostly copied from AdfConveyorBeltSupport)
  //If this is LTR or RTL mode in IE, then we want the default positive new scroll value.
  //If FF in RTL, then get the negative scroll value
  //If Webkit in RTL, to scroll to a position, we resolve this equation:
  // contentContainerWidth - browserScroll = overflowContainerWidth + logicalScroll
  // browserScroll = contentContainerWidth = overflowContainerWidth - logicalScroll
  var newScroll = scroll;
  if (this._bRtl && this._isHorizontal())
  {
    if (this._bAgentGecko) {
      newScroll = -scroll;
    }
    else if (this._bAgentWebkit || this._bAgentOpera) {
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
 */
ConveyorBeltCommon.prototype._convertScrollBrowserToLogical = function(scroll)
{
  //(comment mostly copied from AdfConveyorBeltSupport)
  //If this is LTR or RTL mode in IE, then we want the default positive new scroll value.
  //If FF in RTL, then get the negative scroll value
  //If Webkit in RTL, to scroll to a position, we resolve this equation:
  // contentContainerWidth - browserScroll = overflowContainerWidth + logicalScroll
  // browserScroll = contentContainerWidth = overflowContainerWidth - logicalScroll
  
  //because the equations are the same whether converting from browser -> logical or logical -> browser,
  //simply call _convertScrollLogicalToBrowser from here
  //(NOTE: want to leave _convertScrollBrowserToLogical as a separate function so that it's clear from the
  //calling code which conversion direction is used, and in case the conversion impls ever need to be changed)
  return this._convertScrollLogicalToBrowser(scroll);
};

/**
 * Scroll animation speed (px/ms).
 */
ConveyorBeltCommon._SCROLL_SPEED = 1.1;
/**
 * Touch swipe threshold (percentage of conveyor size).
 */
ConveyorBeltCommon._SWIPE_THRESHOLD = .33;
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojConveyorBelt
 * @augments oj.baseComponent
 * @since 0.6
 * 
 * @classdesc
 * <h3 id="conveyorBeltOverview-section">
 *   JET ConveyorBelt Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#conveyorBeltOverview-section"></a>
 * </h3>
 * 
 * <p>Description: Container component that manages overflow for its child
 * components and allows scrolling among them.
 * 
 * <p>A JET ConveyorBelt can be created from any 
 * <code class="prettyprint">&lt;div></code> element that contains
 * multiple child elements at the same level to scroll among.  The root must be
 * a <code class="prettyprint">&lt;div></code> element because the ConveyorBelt 
 * will create additional DOM elements between the root and the scrollable child
 * elements.  
 * <p>The size of the ConveyorBelt must somehow be constrained in order for 
 * there to be overflow to manage, for example by specifying CSS 
 * <code class="prettyprint">max-width</code> or
 * <code class="prettyprint">max-height</code>.  
 * <p>If the elements to be scrolled among are direct children of the
 * ConveyorBelt, then ConveyorBelt will ensure that they are laid out
 * appropriately for its orientation.  However, if the elements to be scrolled
 * among are contained by a single nested descendant element, the 
 * <code class="prettyprint">contentParent</code>, then it is up to calling code
 * to ensure that the elements are laid out appropriately.  For example, 
 * elements can be forced horizontal by using CSS
 * <code class="prettyprint">white-space:nowrap</code>, or vertical by using 
 * <code class="prettyprint">display:block</code>, before creating the 
 * ConveyorBelt.  
 * 
 * <pre class="prettyprint">
 * <code>
 * &lt;div id="conveyorBelt" style="max-width:100px;"
 *      data-bind="ojComponent: {component: 'ojConveyorBelt'}">
 *   &lt;button id="button1">Alpha&lt;/button>
 *   &lt;button id="button2">Beta&lt;/button>
 *   &lt;button id="button3">Gamma&lt;/button>
 *   &lt;button id="button4">Delta&lt;/button>
 *   &lt;button id="button5">Epsilon&lt;/button>
 *   &lt;button id="button6">Zeta&lt;/button>
 * &lt;/div>
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
 * <p>As with any JET component, in the unusual case that the directionality 
 * (LTR or RTL) changes post-init, the conveyorBelt must be 
 * <code class="prettyprint">refresh()</code>ed.
 * 
 * 
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 * 
 * <p>The <code class="prettyprint">:oj-conveyorbelt</code> pseudo-selector can 
 * be used in jQuery expressions to select JET ConveyorBelt.  For example:
 * 
 * <pre class="prettyprint">
 * <code>$( ":oj-conveyorbelt" ) // selects all JET ConveyorBelts on the page
 * $myEventTarget.closest( ":oj-conveyorbelt" ) // selects the closest ancestor that is a JET ConveyorBelt
 * </code></pre>
 * 
 * 
 * <h3 id="jqui2jet-section">
 *   JET for jQuery UI developers
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
 * </h3>
 * 
 * <p>Event names for all JET components are prefixed with "oj", instead of 
 * component-specific prefixes like "conveyorBelt".  
 * 
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 * 
 * @desc Creates a JET ConveyorBelt. 
 * @example <caption>Initialize the conveyorBelt with no options specified:</caption>
 * $( ".selector" ).ojConveyorBelt();
 * 
 * @example <caption>Initialize the conveyorBelt with some options specified:</caption>
 * $( ".selector" ).ojConveyorBelt( { "orientation": "vertical" } );
 * 
 * @example <caption>Initialize the conveyorBelt via the JET 
 * <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div id="conveyorBelt" data-bind="ojComponent: { component: 'ojConveyorBelt', orientation: 'vertical'}">
 */
(function()
{
oj.__registerWidget("oj.ojConveyorBelt", $['oj']['baseComponent'],
{
  defaultElement: "<div>",
  widgetEventPrefix: "oj",

  options:
  {
    /** 
     * Specify the orientation of the conveyorBelt.
     *
     * @expose 
     * @memberof! oj.ojConveyorBelt
     * @instance
     * @type {string}
     * @ojvalue {string} "horizontal" Orient the conveyorBelt horizontally.
     * @ojvalue {string} "vertical" Orient the conveyorBelt vertically.
     * @default <code class="prettyprint">"horizontal"</code>
     *
     * @example <caption>Initialize the conveyorBelt with the 
     * <code class="prettyprint">orientation</code> option specified:</caption>
     * $( ".selector" ).ojConveyorBelt( { "orientation": "vertical" } );
     * 
     * @example <caption>Get or set the <code class="prettyprint">orientation</code> 
     * option after initialization:</caption>
     * // getter
     * var orientation = $( ".selector" ).ojConveyorBelt( "option", "orientation" );
     * 
     * // setter
     * $( ".selector" ).ojConveyorBelt( "option", "orientation", "vertical" );
     */
    orientation: "horizontal",
    /** 
     * Specify the selector of the descendant DOM element in the conveyorBelt
     * that directly contains the items to scroll among.  
     * 
     * <p>This option is <code class="prettyprint">null</code> by default, 
     * meaning that the items to scroll among are direct children of the 
     * conveyorBelt DOM element.  In some cases, the items to scroll among
     * are not direct children of the conveyorBelt DOM element, but are instead
     * nested in a descendant DOM element.  In such cases, this option should be 
     * specified to point to the descendant DOM element whose direct children
     * are the items to scroll among.  For example, if the items to scroll
     * among are buttons in a buttonset, the buttons are direct children of 
     * the DOM element representing the buttonset.  The buttonset would be 
     * the direct child of the conveyorBelt.  If the 
     * <code class="prettyprint">id</code> of the buttonset DOM element were
     * <code class="prettyprint">'myContentDiv'</code>, then contentParent
     * would be specified as <code class="prettyprint">'#myContentDiv'</code>.
     * 
     * <p><b>WARNING:</b> The selector specified for this option should match 
     * only a single descendant DOM element.  If multiple elements are matched, 
     * then only the first one will be used.  Applications should not depend on 
     * this behavior because we reserve the right to change it in the future in 
     * order to allow and use multiple matching elements.  
     *
     * @expose 
     * @memberof! oj.ojConveyorBelt
     * @instance
     * @type {?string}
     * @default <code class="prettyprint">null</code>
     *
     * @example <caption>Initialize the conveyorBelt with the 
     * <code class="prettyprint">contentParent</code> option specified:</caption>
     * // HTML
     * &lt;div>                       // conveyorBelt DOM element
     *   &lt;div id="myContentDiv">     // contentParent DOM element
     *     &lt;button>Item 1&lt;/button>     // items to scroll among... 
     *     &lt;button>Item 2&lt;/button>
     *     &lt;button>Item 3&lt;/button>
     *     &lt;button>Item 4&lt;/button>
     *     &lt;button>Item 5&lt;/button>
     *   &lt;/div>
     * &lt;/div>
     * 
     * // JS
     * $( ".selector" ).ojConveyorBelt( { "contentParent": "#myContentDiv" } );
     * 
     * @example <caption>Get or set the <code class="prettyprint">contentParent</code> 
     * option after initialization:</caption>
     * // getter
     * var contentParent = $( ".selector" ).ojConveyorBelt( "option", "contentParent" );
     * 
     * // setter
     * $( ".selector" ).ojConveyorBelt( "option", "contentParent", "#myContentDiv" );
     */
    contentParent: null
    
    /**
     * To avoid tight coupling between a ConveyorBelt and its contents, JET 
     * ConveyorBelt does not support the <code class="prettyprint">disabled</code> 
     * option.
     * 
     * <p><b>WARNING:</b> Applications should not depend on this behavior 
     * because we reserve the right to change it in the future in order to 
     * support <code class="prettyprint">disabled</code> and propagate it to 
     * child components of ConveyorBelt.  
     * 
     * @member
     * @name disabled
     * @memberof oj.ojConveyorBelt
     * @instance
     * @type {boolean}
     * @default <code class="prettyprint">false</code>
     */
    // disabled option declared in superclass, but we still want the above API doc

    // Events

    /**
     * Triggered when the conveyorBelt is created.
     *
     * @event
     * @name create
     * @memberof oj.ojConveyorBelt
     * @instance
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} ui Currently empty
     *
     * @example <caption>Initialize the conveyorBelt with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojConveyorBelt({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },

  /**
   * After _ComponentCreate and _AfterCreate, 
   * the widget should be 100% set up. this._super should be called first.
   * @override
   * @protected
   * @instance
   * @memberof! oj.ojConveyorBelt
   */
  _ComponentCreate : function () // Override of protected base class method.  
  {
    //call superclass first
    this._super();
    
    var elem = this.element;  
    elem.addClass("oj-conveyorbelt oj-component");
    
    var options = this.options;
    //FIX : log warning message when "disabled" option set
    if (options.disabled)
    {
      oj.Logger.warn(_WARNING_DISABLED_OPTION);
    }
    
    //FIX : remove override of _init() and call _setup() from here
    this._setup(true);
  },

  // This method currently runs at create, init, and refresh time (since refresh() is called by _init()).
  /**
   * Refreshes the visual state of the conveyorBelt. JET components require a 
   * <code class="prettyprint">refresh()</code> or re-init after the DOM is 
   * programmatically changed underneath the component.
   * 
   * <p>This method does not accept any arguments.
   * 
   * @expose 
   * @memberof! oj.ojConveyorBelt
   * @instance
   * 
   * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
   * $( ".selector" ).ojConveyorBelt( "refresh" );
   */
  refresh: function() // Override of public base class method.  
  {
    this._super();
    
    //save the current scroll position
    var scroll = this._cbCommon.getScroll();
    
    //destroy the cbCommon and setup from scratch in case items were added/removed
    this._destroyCBCommon();
    this._setup(true);
    
    //restore the saved scroll position
    this._cbCommon.setScroll(scroll, true);
  },
  
  /**
   * Notifies the component that its subtree has been made visible 
   * programmatically after the component has been created.
   * @memberof! oj.ojConveyorBelt
   * @instance
   * @protected 
   * @override
   */
  _NotifyShown: function()
  {
    this._super();
    //FIX : perform a deferred layout
    if (this._needsSetup)
    {
      this._setup(this._needsSetup[0]);
    }
    //with internal flexbox layout, conveyor doesn't get notified when
    //content resizes while hidden, so explicitly handle a resize when
    //shown again
    else if (this._cbCommon)
    {
      var cbCommon = this._cbCommon;
      cbCommon.handleResize();
    }
  },
  
  /**
   * Notifies the component that its subtree has been connected to the document
   * programmatically after the component has been created.
   * @memberof! oj.ojConveyorBelt
   * @instance
   * @protected 
   * @override
   */
  _NotifyAttached: function()
  {
    this._super();
    //FIX : perform a deferred layout
    if (this._needsSetup)
    {
      this._setup(this._needsSetup[0]);
    }
  },

  // isInit is true for init (create and re-init), false for refresh
  /** 
   * Setup the conveyorBelt.
   * @param {boolean} isInit true if _setup is called from _init(), false
   *        if called from refresh()
   * @memberof! oj.ojConveyorBelt
   * @instance
   * @private
   */
  _setup: function(isInit) // Private, not an override (not in base class).  
  {
    var self = this;
    var elem = this.element;
    var options = this.options;
    var orientation = options.orientation;
    if (orientation === "vertical")
      elem.addClass("oj-conveyorbelt-vertical");
    else
      elem.removeClass("oj-conveyorbelt-vertical");
    
    //FIX : if conveyor is detached or hidden, we can't layout
    //correctly, so defer layout until conveyor is attached or shown
    if (!this._canCalculateSizes())
    {
      //want a true value of isInit to take precedence over a false value
      var oldIsInit = false;
      if (this._needsSetup)
      {
        oldIsInit = this._needsSetup[0];
      }
      this._needsSetup = [isInit || oldIsInit];
      return;
    }
    this._needsSetup = null;
    
    this._bRTL = (this._GetReadingDirection() === "rtl");
    if (isInit)
    {
      if (!this._cbCommon)
      {
        var prevStyleClass = null;
        var nextStyleClass = null;
        var prevIcon = null;
        var nextIcon = null;
        var animateScrollFunc = null;
        if (orientation !== "vertical")
        {
          prevStyleClass = "oj-enabled oj-conveyorbelt-overflow-indicator oj-start oj-default";
          nextStyleClass = "oj-enabled oj-conveyorbelt-overflow-indicator oj-end oj-default";
          prevIcon = this._createIcon("oj-conveyorbelt-overflow-icon oj-start");
          nextIcon = this._createIcon("oj-conveyorbelt-overflow-icon oj-end");
          animateScrollFunc = this._animateScrollLeft;
        }
        else
        {
          prevStyleClass = "oj-enabled oj-conveyorbelt-overflow-indicator oj-top oj-default";
          nextStyleClass = "oj-enabled oj-conveyorbelt-overflow-indicator oj-bottom oj-default";
          prevIcon = this._createIcon("oj-conveyorbelt-overflow-icon oj-top");
          nextIcon = this._createIcon("oj-conveyorbelt-overflow-icon oj-bottom");
          animateScrollFunc = this._animateScrollTop;
        }
        var buttonInfo = {};
        buttonInfo.prevButtonStyleClass = prevStyleClass;
        buttonInfo.nextButtonStyleClass = nextStyleClass;
        buttonInfo.prevButtonIcon = prevIcon;
        buttonInfo.nextButtonIcon = nextIcon;
        var styleInfo = {};
        styleInfo.overflowContainerStyleClass = "oj-conveyorbelt-overflow-container";
        styleInfo.contentContainerStyleClass = "oj-conveyorbelt-content-container";
        styleInfo.itemStyleClass = "oj-conveyorbelt-item";
        styleInfo.hiddenStyleClass = "oj-helper-hidden";
        var callbackInfo = {};
        callbackInfo.addResizeListener = oj.DomUtils.addResizeListener;
        callbackInfo.removeResizeListener = oj.DomUtils.removeResizeListener;
        callbackInfo.addStyleClassName = this._addStyleClassName;
        callbackInfo.removeStyleClassName = this._removeStyleClassName;
        callbackInfo.hasStyleClassName = this._hasStyleClassName;
        callbackInfo.filterContentElements = 
          function(arContentElements) { return self._filterContentElements(arContentElements); };
        //disable scroll animation during testing
        if (oj.Config.getAutomationMode() !== "enabled")
        {
          callbackInfo.scrollFunc = animateScrollFunc;
        }
        var contentParentElem = null;
        if (options.contentParent)
        {
          //only use the first result returned from the contentParent selector
          contentParentElem = $(options.contentParent)[0];
        }
        this._cbCommon = new ConveyorBeltCommon(
            elem[0],
            orientation, 
            contentParentElem,
            this._bRTL, 
            buttonInfo, 
            callbackInfo, 
            styleInfo);
      }
    }
    var cbCommon = this._cbCommon;
    cbCommon.setup(isInit);
    if (isInit)
    {
      var children = elem.find(".oj-conveyorbelt-overflow-indicator");
      //need to setup listeners for styles on each button individually so that callbacks for that
      //listener are specific to each button and don't affect both buttons at the same time
      for (var i = 0; i < children.length; i++)
      {
        this._setupButtonMouseStyles($(children[i]));
      }
    }
  },

  /** 
   * Destroy the conveyorBelt.
   * @memberof! oj.ojConveyorBelt
   * @instance
   * @override
   * @protected
   */
  _destroy: function() // Override of protected base class method.  
  {
    this._destroyCBCommon();
    var elem = this.element;
    elem.removeClass("oj-conveyorbelt oj-component oj-conveyorbelt-vertical");
    
    //call superclass last
    this._super();
  },

  /** 
   * Set an option on the conveyorBelt.
   * @memberof! oj.ojConveyorBelt
   * @instance
   * @override
   * @protected
   */
  _setOption: function(key, value, flags) // Override of protected base class method.
                                   // Method name needn't be quoted since is in externs.js.
  {
    var bRecreate = false;
    var options = this.options;
    switch (key) 
    {
      //when changing containerParent or orientation, just destroy and recreate
      //the ConveyorBeltCommon
      case "containerParent":
      case "orientation":
        bRecreate = (options.orientation != value);
        break;
      case "disabled":
        //FIX : log warning message when "disabled" option set
        oj.Logger.warn(_WARNING_DISABLED_OPTION);
        break;
    }
    //if recreating, destroy the ConveyorBeltCommon before calling superclass
    //_setOption
    if (bRecreate)
    {
      this._destroyCBCommon();
    }
    this._super(key, value, flags);
    //if recreating, setup the new ConveyorBeltCommon after calling superclass
    //_setOption
    if (bRecreate)
    {
      this._setup(true);
    }
  },

  /** 
   * Destroy the ConveyorBeltCommon.
   * @memberof! oj.ojConveyorBelt
   * @instance
   * @private
   */
  _destroyCBCommon: function()
  {
    var cbCommon = this._cbCommon;
    if (cbCommon)
    {
      //FIX : detach mouse listeners from overflow indicators
      //before destroying cbCommon in order to avoid memory leaks
      var elem = this.element;
      var children = elem.find(".oj-conveyorbelt-overflow-indicator");
      children.off(this.eventNamespace);
      
      cbCommon.destroy();
    }
    this._cbCommon = null;
  },

  /** 
   * Determine whether the conveyorBelt can calculate sizes (when it is 
   * attached to the page DOM and not hidden).
   * @returns {boolean} true if sizes can be calculated, false if not
   * @memberof! oj.ojConveyorBelt
   * @instance
   * @private
   */
  _canCalculateSizes: function() 
  {
    var div = document.createElement("div");
    var style = div.style;
    style.width = "10px";
    style.height = "10px";
    
    //make sure flexbox layout doesn't grow/shrink the item
    style["-webkit-flex"] = "0 0 auto";
    style["flex"] = "0 0 auto";
    
    var elem = this.element[0];
    elem.appendChild(div); // @HtmlUpdateOK
    var bCanCalcSizes = false;
    try {
      bCanCalcSizes = div.offsetWidth > 0 && div.offsetHeight > 0;
    }
    catch (e) {
      //do nothing
    }
    elem.removeChild(div);
    return bCanCalcSizes;
  },

  /** 
   * Setup mouse listeners to change button styles.
   * @param {Object} element jQuery element to affect
   * @memberof! oj.ojConveyorBelt
   * @private
   */
  _setupButtonMouseStyles: function(element)
  {
    //  - conveyorbelt next/previous oj-hover color don't go away
    this._AddHoverable({
      'element': element,
      'afterToggle': function(eventtype) {
        if (eventtype === "mouseenter") {
          element.removeClass("oj-default");
        }
        else if (eventtype === "mouseleave") {
          element.addClass("oj-default");
        }
      }
    });

    this._AddActiveable({
      'element': element,
      'afterToggle': function(eventtype) {
        if (eventtype === "mousedown" || eventtype === "touchstart") {
          element.removeClass("oj-default");
        }
        else if (eventtype === "mouseup" || eventtype === "touchend" || eventtype === "touchcancel") {
          element.addClass("oj-default");
        }
      }
    });
  },

  /** 
   * Create a DOM element for an icon.
   * @param {string} iconStyleClass Style class for the icon
   * @memberof! oj.ojConveyorBelt
   * @private
   */
  _createIcon: function(iconStyleClass)
  {
    var span = document.createElement("span");
    span.setAttribute("class", "oj-component-icon " + iconStyleClass);
    return span;
  },

  /** 
   * Animate setting the scrollLeft DOM property.
   * @param {Element} elem DOM element to scroll
   * @param {number} value Scroll value
   * @param {number} duration Duration of animation, in ms
   * @param {function()} onEndFunc Function to call when the animation ends
   * @memberof! oj.ojConveyorBelt
   * @private
   */
  _animateScrollLeft: function(elem, value, duration, onEndFunc)
  {
    var props = {};
    props["scrollLeft"] = value;
    //use swing instead of easeInOutCubic because easeInOutCubic isn't found
    //when running in the cookbook
    $(elem).animate(props, duration, "swing", onEndFunc);
  },

  /** 
   * Animate setting the scrollTop DOM property.
   * @param {Element} elem DOM element to scroll
   * @param {number} value Scroll value
   * @param {number} duration Duration of animation, in ms
   * @param {function()} onEndFunc Function to call when the animation ends
   * @memberof! oj.ojConveyorBelt
   * @private
   */
  _animateScrollTop: function(elem, value, duration, onEndFunc)
  {
    var props = {};
    props["scrollTop"] = value;
    //use swing instead of easeInOutCubic because easeInOutCubic isn't found
    //when running in the cookbook
    $(elem).animate(props, duration, "swing", onEndFunc);
  },

  /** 
   * Add a style class name to an element.
   * @param {Object} elem Element to which to add style class.
   * @param {string} styleClass Style class name to add.
   * @memberof! oj.ojConveyorBelt
   * @private
   */
  _addStyleClassName: function(elem, styleClass)
  {
    $(elem).addClass(styleClass);
  },

  /** 
   * Remove a style class name from an element.
   * @param {Object} elem Element from which to remove style class.
   * @param {string} styleClass Style class name to remove.
   * @memberof! oj.ojConveyorBelt
   * @private
   */
  _removeStyleClassName: function(elem, styleClass)
  {
    $(elem).removeClass(styleClass);
  },
  
  /** 
   * Determine whether the given style class name is applied to the given
   * element.
   * @param {Object} elem Element to check for style class name.
   * @param {string} styleClass Style class name for which to look.
   * @returns {boolean} true if style class name is applied, false if not
   * @memberof! oj.ojConveyorBelt
   * @private
   */
  _hasStyleClassName: function(elem, styleClass)
  {
    return $(elem).hasClass(styleClass);
  },
  
  /** 
   * Filter the given array of conveyor content elements to remove extraneous elements, like the
   * divs added by the resize listener.
   * @param {Array} arContentElements Array of conveyor content elements.
   * @returns {Array} filtered array of conveyor content elements
   * @memberof! oj.ojConveyorBelt
   * @private
   */
  _filterContentElements: function(arContentElements)
  {
    var ret = [];
    for (var i = 0; i < arContentElements.length; i++)
    {
      var contentElem = arContentElements[i];
      if (!this._hasStyleClassName(contentElem, "oj-helper-detect-expansion") &&
          !this._hasStyleClassName(contentElem, "oj-helper-detect-contraction"))
      {
        ret.push(contentElem);
      }
    }
    return ret;
  },
  
  //** @inheritdoc */
  getNodeBySubId: function(locator)
  {
    if (locator == null)
    {
      return this.element ? this.element[0] : null;
    }
    
    var subId = locator['subId'];
    if (subId === "oj-conveyorbelt-start-overflow-indicator") {
      return this.widget().find(".oj-conveyorbelt-overflow-indicator.oj-start")[0];
    }
    if (subId === "oj-conveyorbelt-end-overflow-indicator") {
      return this.widget().find(".oj-conveyorbelt-overflow-indicator.oj-end")[0];
    }
    if (subId === "oj-conveyorbelt-top-overflow-indicator") {
      return this.widget().find(".oj-conveyorbelt-overflow-indicator.oj-top")[0];
    }
    if (subId === "oj-conveyorbelt-bottom-overflow-indicator") {
      return this.widget().find(".oj-conveyorbelt-overflow-indicator.oj-bottom")[0];
    }
    
    // Non-null locators have to be handled by the component subclasses
    return null;
  },

  //** @inheritdoc */
  getSubIdByNode: function(node) {
    var startIndicator = this.getNodeBySubId({'subId':'oj-conveyorbelt-start-overflow-indicator'});
    var endIndicator = this.getNodeBySubId({'subId':'oj-conveyorbelt-end-overflow-indicator'});
    var topIndicator = this.getNodeBySubId({'subId':'oj-conveyorbelt-top-overflow-indicator'});
    var bottomIndicator = this.getNodeBySubId({'subId':'oj-conveyorbelt-bottom-overflow-indicator'});
    var currentNode = node;
    var elem = this.element[0];
    while (currentNode && currentNode != elem) {
      if (currentNode === startIndicator)
        return {'subId':'oj-conveyorbelt-start-overflow-indicator'};
      else if (currentNode === endIndicator)
        return {'subId':'oj-conveyorbelt-end-overflow-indicator'};
      else if (currentNode === topIndicator)
        return {'subId':'oj-conveyorbelt-top-overflow-indicator'};
      else if (currentNode === bottomIndicator)
        return {'subId':'oj-conveyorbelt-bottom-overflow-indicator'};

      currentNode = currentNode.parentElement;          
    }
    return null;
  }
  
  // start jsdoc fragments /////////////////////////////////////////////////////
  
  /**
   * <p>Sub-ID for the start overflow indicator of a horizontal ConveyorBelt.</p>
   *
   * @ojsubid oj-conveyorbelt-start-overflow-indicator
   * @memberof oj.ojConveyorBelt
   *
   * @example <caption>Get the start overflow indicator:</caption>
   * var node = $( ".selector" ).ojConveyorBelt( "getNodeBySubId", {'subId': 'oj-conveyorbelt-start-overflow-indicator'} );
   */
  
  /**
   * <p>Sub-ID for the end overflow indicator of a horizontal ConveyorBelt.</p>
   *
   * @ojsubid oj-conveyorbelt-end-overflow-indicator
   * @memberof oj.ojConveyorBelt
   *
   * @example <caption>Get the end overflow indicator:</caption>
   * var node = $( ".selector" ).ojConveyorBelt( "getNodeBySubId", {'subId': 'oj-conveyorbelt-end-overflow-indicator'} );
   */
  
  /**
   * <p>Sub-ID for the top overflow indicator of a vertical ConveyorBelt.</p>
   *
   * @ojsubid oj-conveyorbelt-top-overflow-indicator
   * @memberof oj.ojConveyorBelt
   *
   * @example <caption>Get the top overflow indicator:</caption>
   * var node = $( ".selector" ).ojConveyorBelt( "getNodeBySubId", {'subId': 'oj-conveyorbelt-top-overflow-indicator'} );
   */
  
  /**
   * <p>Sub-ID for the bottom overflow indicator of a vertical ConveyorBelt.</p>
   *
   * @ojsubid oj-conveyorbelt-bottom-overflow-indicator
   * @memberof oj.ojConveyorBelt
   *
   * @example <caption>Get the bottom overflow indicator:</caption>
   * var node = $( ".selector" ).ojConveyorBelt( "getNodeBySubId", {'subId': 'oj-conveyorbelt-bottom-overflow-indicator'} );
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
  
  // end jsdoc fragments ///////////////////////////////////////////////////////
  
}); // end of oj.__registerWidget

// start static members and functions //////////////////////////////////////////

//FIX : log warning message when "disabled" option set
var _WARNING_DISABLED_OPTION = "JET ConveyorBelt: 'disabled' option not supported";
    
// end static members and functions ////////////////////////////////////////////

}()); // end of ConveyorBelt wrapper function
(function() {
var ojConveyorBeltMeta = {
  "properties": {
    "contentParent": {
      "type": "string"
    },
    "disabled": {
      "type": "boolean"
    },
    "orientation": {
      "type": "string"
    }
  },
  "methods": {
    "refresh": {}
  },
  "extension": {
    "_widgetName": "ojConveyorBelt"
  }
};
oj.Components.registerMetadata('ojConveyorBelt', 'baseComponent', ojConveyorBeltMeta);
oj.Components.register('oj-conveyor-belt', oj.Components.getMetadata('ojConveyorBelt'));
})();
});
