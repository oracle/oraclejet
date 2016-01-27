/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
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
 *  - callbackObj: Optional object on which the callback functions are defined
 *    has changed
 * @constructor
 * @ignore
 */
function ConveyorBeltCommon(
  elem, orientation, contentParent, bRtl, buttonInfo, callbackInfo)
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
    var tableCellDivNextButton = this._tableCellDivNextButton;
    if (tableCellDivNextButton)
    {
      //use the width of the div containing the button because it will include 
      //any margins specified in the button style class
      this._buttonWidth = tableCellDivNextButton.offsetWidth;
      this._buttonHeight = nextButton.offsetHeight;
    }
    else
    {
      var vertDivNextButton = this._vertDivNextButton;
      this._buttonWidth = nextButton.offsetWidth;
      //use the height of the div containing the button because it will include 
      //any margins specified in the button style class
      this._buttonHeight = vertDivNextButton.offsetHeight;
    }
    
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
  
  //move the original content children from the _contentTableDiv back to the 
  //original DOM element
  cbcClass._reparentChildrenFromTable(this._contentTableDiv, elem, this._isHorizontal());
  //clear the stored array of content elements
  this._arContentElements = null;
  if (this._tableDiv)
  {
    //the overflow, content, and buttons are all children of the table div
    elem.removeChild(this._tableDiv);
  }
  else
  {
    //the _contentContainer is a child of the _overflowContainer, so will be removed with it
    elem.removeChild(this._overflowContainer);
    elem.removeChild(this._vertDivNextButton);
    elem.removeChild(this._vertDivPrevButton);
  }
  
  this._nextButton = null;
  this._prevButton = null;
  this._contentContainer = null;
  this._overflowContainer = null;
  this._contentTableDiv = null;
  this._tableDiv = null;
  this._tableCellDivPrevButton = null;
  this._tableCellDivNextButton = null;
  this._prevButtonWrapper = null;
  this._nextButtonWrapper = null;
  this._vertDivPrevButton = null;
  this._vertDivNextButton = null;
  this._clearCachedSizes();
  
  this._elem = null;
  this._scrollFunc = null;
  this._firstVisibleItemChangedFunc = null;
  this._addResizeListenerFunc = null;
  this._removeResizeListenerFunc = null;
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
 * Reparent the DOM child nodes from their old parent node to a new parent table
 * node.
 * @param {Object} fromNode Old parent DOM node
 * @param {Object} toTable New parent table DOM node
 * @param {boolean} bHoriz True to make the table horizontal, false for vertical
 * @return {Array} Array of child elements reparented to the table
 */
ConveyorBeltCommon._reparentChildrenToTable = function(fromNode, toTable, bHoriz)
{
  var cbcClass = ConveyorBeltCommon;
  var tableRow = null;
  if (bHoriz)
  {
    tableRow = cbcClass._createTableRowDiv();
    toTable.appendChild(tableRow); // @HtmlUpdateOK
  }
  var arElements = null;
  
  var fromNodeChildren = fromNode.childNodes;
  while (fromNodeChildren.length > 0)
  {
    if (!arElements)
      arElements = [];
    
    var child = fromNodeChildren[0];
    if (child.nodeType === 1)
    {
      if (!bHoriz)
      {
        tableRow = cbcClass._createTableRowDiv();
        toTable.appendChild(tableRow); // @HtmlUpdateOK
      }
      
      var tableCell = cbcClass._createTableCellDiv();
      tableCell.appendChild(child); // @HtmlUpdateOK
      tableRow.appendChild(tableCell); // @HtmlUpdateOK
      arElements.push(child);
    }
    else
    {
      //if child is not an element node, simply append it to the table or 
      //tableRow without wrapping it in a tableCell
      if (bHoriz)
      {
        tableRow.appendChild(child); // @HtmlUpdateOK
      }
      else
      {
        toTable.appendChild(child); // @HtmlUpdateOK
      }
    }
  }
  return arElements;
};

/**
 * Reparent the DOM child nodes from a table to a new parent node.
 * @param {Object} fromTable Old parent table DOM node
 * @param {Object} toNode New parent DOM node
 * @param {boolean} bHoriz True if the table is horizontal, false if vertical
 */
ConveyorBeltCommon._reparentChildrenFromTable = function(fromTable, toNode, bHoriz)
{
  if (!fromTable)
    return;
  
  var tableRows = fromTable.childNodes;
  while (tableRows.length > 0)
  {
    var tableRow = tableRows[0];
    if (tableRow.nodeType === 1)
    {
      var tableCells = tableRow.childNodes;
      while (tableCells.length > 0)
      {
        var tableCell = tableCells[0];
        if (tableCell.nodeType === 1)
        {
          var cellContent = tableCell.firstChild;
          toNode.appendChild(cellContent); // @HtmlUpdateOK
          //only reparented child of tableCell, so still need to remove
          //tableCell itself
          tableRow.removeChild(tableCell);
        }
        else
        {
          //if child is not an element node, simply append it to the new parent
          toNode.appendChild(tableCell); // @HtmlUpdateOK
        }
      }
      //need to remove row from table
      fromTable.removeChild(tableRow);
    }
    else
    {
      //if child is not an element node, simply append it to the new parent
      toNode.appendChild(tableRow); // @HtmlUpdateOK
    }
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
  this._clearOverflowMaxSize();
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
  var totalSize = this._totalSize;
  this._alignButtons(totalSize.w, totalSize.h);
};

/**
 * Center the overflow buttons orthogonal to the conveyor orientation.
 * @param {number} w Width to align inside
 * @param {number} h Height to align inside
 */
ConveyorBeltCommon.prototype._alignButtons = function(w, h)
{
  var nextButton = this._nextButton;
  var prevButton = this._prevButton;
  var nextButtonStyle = nextButton.style;
  var prevButtonStyle = prevButton.style;
  
  if (this._isHorizontal())
  {
    var vOffset = .5 * (h - this._buttonHeight);
    nextButtonStyle.top = vOffset + "px";
    prevButtonStyle.top = vOffset + "px";
  }
  else
  {
    var hOffset = .5 * (w - this._buttonWidth);
    if (!this._bRtl)
    {
      nextButtonStyle.left = hOffset + "px";
      prevButtonStyle.left = hOffset + "px";
    }
    else
    {
      nextButtonStyle.left = -hOffset + "px";
      prevButtonStyle.left = -hOffset + "px";
    }
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
  //constrain the max overflow size if necessary
  if ((bHoriz ? contentContainer.offsetWidth : contentContainer.offsetHeight) > elemInnerSize)
  {
    this._setOverflowMaxSize(elemInnerSize);
  }
  
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
  //the conveyor elem will contain the overflowContainer, which will contain the contentContainer, which
  //will contain the original children
  
  var self = this;
  var bHoriz = this._isHorizontal();
  
  var overflowContainer = document.createElement("div");
  this._overflowContainer = overflowContainer;
  var overflowContainerStyle = overflowContainer.style;
  overflowContainerStyle.overflow = "hidden";
  overflowContainerStyle.display = this._getCssDisplay();
  overflowContainerStyle.position = "relative";
  //ojTabs: verticalAlign top is needed so there's no gap between the tab bar and the tab content in Jet Tabs
  if (bHoriz)
  {
    overflowContainerStyle.verticalAlign = "top";
  }
  
  var elem = this._elem;
  var cbcClass = ConveyorBeltCommon;
  var contentContainer = document.createElement("div");
  this._contentContainer = contentContainer;
  var contentContainerStyle = contentContainer.style;
  contentContainerStyle.position = "relative";
  if (bHoriz)
  {
    //ojTabs: set display of content container to inline-block so that its size
    //will be driven by its children
    contentContainerStyle.display = "inline-block";
  }
  overflowContainer.appendChild(contentContainer); // @HtmlUpdateOK
  
  var tableDiv = null;
  if (bHoriz)
  {
    //layout the buttons and overflow container in divs styled like table cells
    //in a single row in order to guarantee that they don't accidentally wrap
    //(don't want to specify white-space:nowrap because that would get inherited
    //by the content and either conveyor or the app would potentially have to
    //restore the initial value)
    tableDiv = cbcClass._createTableDiv();
    this._tableDiv = tableDiv;
    var tableRowDiv = cbcClass._createTableRowDiv();
    var tableCellDivPrevButton = cbcClass._createTableCellDiv();
    this._tableCellDivPrevButton = tableCellDivPrevButton;
    var tableCellDivOverflow = cbcClass._createTableCellDiv();
    var tableCellDivNextButton = cbcClass._createTableCellDiv();
    this._tableCellDivNextButton = tableCellDivNextButton;
    
    //FIX : in IE, the table cell divs wrapping the buttons must
    //specify vertical-align:top in order for the buttons to start out top
    //aligned
    var tableCellDivPrevButtonStyle = tableCellDivPrevButton.style;
    var tableCellDivNextButtonStyle = tableCellDivNextButton.style;
    tableCellDivPrevButtonStyle.verticalAlign = "top";
    tableCellDivNextButtonStyle.verticalAlign = "top";
    
    tableCellDivOverflow.appendChild(overflowContainer); // @HtmlUpdateOK
    tableRowDiv.appendChild(tableCellDivPrevButton); // @HtmlUpdateOK
    tableRowDiv.appendChild(tableCellDivOverflow); // @HtmlUpdateOK
    tableRowDiv.appendChild(tableCellDivNextButton); // @HtmlUpdateOK
    tableDiv.appendChild(tableRowDiv); // @HtmlUpdateOK
  }
  
  //reparent children from elem to contentContainer before adding overflow and
  //content containers to elem;
  //create table to hold content items to enforce either single column or single
  //row layout
  var contentTableDiv = cbcClass._createTableDiv();
  var arContentElements = cbcClass._reparentChildrenToTable(elem, contentTableDiv, bHoriz);
  //if there is a nested contentParent, then we need to put its children into
  //arContentElements instead of the children of the elem
  if (this._contentParent)
  {
    arContentElements = [];
    var contentParent = this._contentParent;
    var contentChildren = contentParent.children;
    var numContentChildren = contentChildren.length;
    for (var i = 0; i < numContentChildren; i++)
    {
      var child = contentChildren[i];
      if (child.nodeType === 1)
      {
        arContentElements.push(child);
      }
    }
  }
  //save the content elements so we can walk through them in _measureContents
  //instead of walking through the table div itself
  this._arContentElements = arContentElements;
  //only need to save the content table and add it to the content container if 
  //there is actual content (this also helps _isEmpty() to function correctly)
  if (arContentElements && arContentElements.length > 0)
  {
    this._contentTableDiv = contentTableDiv;
    contentContainer.appendChild(contentTableDiv); // @HtmlUpdateOK
  }
  
  if (tableDiv)
  {
    elem.appendChild(tableDiv); // @HtmlUpdateOK
  }
  else
  {
    var vertDivPrevButton = document.createElement("div");
    this._vertDivPrevButton = vertDivPrevButton;
    var vertDivNextButton = document.createElement("div");
    this._vertDivNextButton = vertDivNextButton;
    elem.appendChild(vertDivPrevButton); // @HtmlUpdateOK
    elem.appendChild(overflowContainer); // @HtmlUpdateOK
    elem.appendChild(vertDivNextButton); // @HtmlUpdateOK
  }
  
  if (bHoriz)
  {
    //the overflow container is sometimes taller than the content container,
    //apparently because the content container is an inline-block, so we 
    //compensate for that extra, artificial vertical space by reducing the 
    //bottom margin of the overflow container
    var overflowHeight = overflowContainer.offsetHeight;
    var contentHeight = contentContainer.offsetHeight;
    if (overflowHeight > contentHeight)
    {
      overflowContainerStyle.marginBottom = (contentHeight - overflowHeight) + "px";
    }
  }
  
  //the overflow container listens to DOM scroll events in case the scroll was triggered externally,
  //for example when the user tabs through the child content
  cbcClass._addBubbleEventListener(overflowContainer, "scroll", function (event) {self._handleScroll(event);});
};

/**
 * Get the value to use for the CSS display attribute.
 * @return {string} Value to use for CSS display attribute
 */
ConveyorBeltCommon.prototype._getCssDisplay = function()
{
  return this._isHorizontal() ? "inline-block" : "block";
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
  var prevButtonStyle = prevButton.style;
  prevButtonStyle.display = this._getCssDisplay();
  prevButtonStyle.position = "relative";
  var bHoriz = this._isHorizontal();
  if (bHoriz)
  {
    prevButtonStyle.verticalAlign = "top";
  }
  var cbcClass = ConveyorBeltCommon;
  cbcClass._addBubbleEventListener(prevButton, "click", function (event) {self._scrollPrev();});
  if (this._tableCellDivPrevButton)
  {
    //the button belongs to the table cell
    var tableCell = this._tableCellDivPrevButton;
    
    //wrap the button in another div that we can use to get the size, because
    //the table cell div seems to be one pixel bigger (maybe when the button
    //size is really a float?);
    //then the wrapper div size will be restricted to be the actual reported
    //size of the button, which results in the table cell div being the same size
    this._prevButtonWrapper = cbcClass._wrapAndRestrictSize(prevButton, tableCell, bHoriz, !bHoriz);
  }
  else
  {
    //make the prev button the first child
    var elem = this._vertDivPrevButton;
    elem.appendChild(prevButton); // @HtmlUpdateOK
  }
  
  if (icon)
  {
    prevButton.appendChild(icon); // @HtmlUpdateOK
  }
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
  var nextButtonStyle = nextButton.style;
  nextButtonStyle.display = this._getCssDisplay();
  nextButtonStyle.position = "relative";
  var bHoriz = this._isHorizontal();
  if (bHoriz)
  {
    nextButtonStyle.verticalAlign = "top";
  }
  var cbcClass = ConveyorBeltCommon;
  cbcClass._addBubbleEventListener(nextButton, "click", function (event) {self._scrollNext();});
  if (this._tableCellDivNextButton)
  {
    //the button belongs to the table cell
    var tableCell = this._tableCellDivNextButton;
    
    //wrap the button in another div that we can use to get the size, because
    //the table cell div seems to be one pixel bigger (maybe when the button
    //size is really a float?);
    //then the wrapper div size will be restricted to be the actual reported
    //size of the button, which results in the table cell div being the same size
    this._nextButtonWrapper = cbcClass._wrapAndRestrictSize(nextButton, tableCell, bHoriz, !bHoriz);
  }
  else
  {
    //make the next button the last child
    var elem = this._vertDivNextButton;
    elem.appendChild(nextButton); // @HtmlUpdateOK
  }
  
  if (icon)
  {
    nextButton.appendChild(icon); // @HtmlUpdateOK
  }
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
  var contentTableDiv = this._contentTableDiv;
  var arContentElements = this._arContentElements;
  var totalSize = {w: 0, h: 0};
  var sizes = [];
  if (contentParent.hasChildNodes() && contentTableDiv && arContentElements &&
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
 * Get the DOM element to use to show or hide the next button.
 * @return {Node} DOM element to use to show or hide the next button
 */
ConveyorBeltCommon.prototype._getNextButtonDisplayElem = function()
{
  return this._nextButtonWrapper ? this._nextButtonWrapper : this._nextButton;
};

/**
 * Get the DOM element to use to show or hide the prev button.
 * @return {Node} DOM element to use to show or hide the prev button
 */
ConveyorBeltCommon.prototype._getPrevButtonDisplayElem = function()
{
  return this._prevButtonWrapper ? this._prevButtonWrapper : this._prevButton;
};

/**
 * Show the next button.
 */
ConveyorBeltCommon.prototype._showNextButton = function()
{
  var elem = this._getNextButtonDisplayElem();
  var style = elem.style;
  style.display = this._getCssDisplay();
};

/**
 * Show the prev button.
 */
ConveyorBeltCommon.prototype._showPrevButton = function()
{
  var elem = this._getPrevButtonDisplayElem();
  var style = elem.style;
  style.display = this._getCssDisplay();
};

/**
 * Hide the next button.
 */
ConveyorBeltCommon.prototype._hideNextButton = function()
{
  var elem = this._getNextButtonDisplayElem();
  var style = elem.style;
  style.display = "none";
};

/**
 * Hide the prev button.
 */
ConveyorBeltCommon.prototype._hidePrevButton = function()
{
  var elem = this._getPrevButtonDisplayElem();
  var style = elem.style;
  style.display = "none";
};

/**
 * Determine if the next button is shown.
 * @return {boolean} true if shown, false if hidden
 */
ConveyorBeltCommon.prototype._isNextButtonShown = function()
{
  var elem = this._getNextButtonDisplayElem();
  var style = elem.style;
  return style.display !== "none";
};

/**
 * Determine if the prev button is shown.
 * @return {boolean} True if shown, false if hidden
 */
ConveyorBeltCommon.prototype._isPrevButtonShown = function()
{
  var elem = this._getPrevButtonDisplayElem();
  var style = elem.style;
  return style.display !== "none";
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
  if (bNeedsScroll)
  {
    this._setOverflowMaxSize(ovSize);
  }
  else
  {
    this._clearOverflowMaxSize();
  }
};

/**
 * Set the max size of the overflow container.
 * @param {number} size Overflow max size
 */
ConveyorBeltCommon.prototype._setOverflowMaxSize = function(size)
{
  var overflowContainer = this._overflowContainer;
  var overflowContainerStyle = overflowContainer.style;
  var s = size + "px";
  if (this._isHorizontal())
  {
    overflowContainerStyle.maxWidth = s;
  }
  else
  {
    overflowContainerStyle.maxHeight = s;
  }
};

/**
 * Clear the max size of the overflow container.
 */
ConveyorBeltCommon.prototype._clearOverflowMaxSize = function()
{
  var overflowContainer = this._overflowContainer;
  var overflowContainerStyle = overflowContainer.style;
  if (this._isHorizontal())
  {
    overflowContainerStyle.maxWidth = "";
  }
  else
  {
    overflowContainerStyle.maxHeight = "";
  }
};

/**
 * Set the overflow scroll position.
 * @param {number} scroll Overflow logical scroll position
 */
ConveyorBeltCommon.prototype._setOverflowScroll = function(scroll)
{
  var overflowContainer = this._overflowContainer;
  if (this._isHorizontal())
  {
    overflowContainer.scrollLeft = this._convertScrollLogicalToBrowser(scroll);
  }
  else
  {
    overflowContainer.scrollTop = scroll;
  }
};

/**
 * Get the current overflow viewport size.
 * @return {number} Overflow viewport size
 */
ConveyorBeltCommon.prototype._getCurrViewportSize = function()
{
  var overflowContainer = this._overflowContainer;
  return this._isHorizontal() ? overflowContainer.offsetWidth : overflowContainer.offsetHeight;
};

/**
 * Set the scroll position.
 * @param {number} scroll Desired scroll position
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
  var overflowContainer = this._overflowContainer;
  return this._isHorizontal() ? this._convertScrollBrowserToLogical(overflowContainer.scrollLeft) : 
                                overflowContainer.scrollTop;
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
    var overflowContainer = this._overflowContainer;
    var threshold = cbcClass._SWIPE_THRESHOLD * 
                    (bHoriz ? overflowContainer.offsetWidth : overflowContainer.offsetHeight);
    
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
  //toggle the externalScroll flag in a timeout so that it happens after any current processing finishes
  this._setExternalScrollTimeout();
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
    
    //FIX : log warning message when "disabled" option set
    var options = this.options;
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
    
    //if RTL has changed, just destroy and recreate the ConveyorBeltCommon
    var bRTL = (this._GetReadingDirection() === "rtl");
    var bRecreate = (bRTL !== this._bRTL);
    if (bRecreate)
    {
      this._destroyCBCommon();
    }
    this._setup(bRecreate);
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
    var elem = this.element;  
    var options = this.options;
    if (isInit)
    {
      if (!this._cbCommon)
      {
        var orientation = options.orientation;
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
        var callbackInfo = {};
        callbackInfo.addResizeListener = oj.DomUtils.addResizeListener;
        callbackInfo.removeResizeListener = oj.DomUtils.removeResizeListener;
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
            callbackInfo);
      }
    }
    var cbCommon = this._cbCommon;
    cbCommon.setup(isInit);
    if (isInit)
    {
      var children = elem.find(".oj-conveyorbelt-overflow-indicator");
      this._setupButtonMouseStyles(children);
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
    elem.removeClass("oj-conveyorbelt oj-component");
    
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
    switch (key) 
    {
      //when changing containerParent or orientation, just destroy and recreate
      //the ConveyorBeltCommon
      case "containerParent":
      case "orientation":
        bRecreate = true;
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
    element
      .on("mousedown" + this.eventNamespace, function( event ) {
        var currTarget = event.currentTarget;
        $(currTarget).addClass("oj-active");
      })
      .on("mouseup" + this.eventNamespace, function( event ) {
        var currTarget = event.currentTarget;
        $(currTarget).removeClass("oj-active");
      })
      .on("mouseenter" + this.eventNamespace, function( event ) {
        var currTarget = event.currentTarget;
        $(currTarget).addClass("oj-hover");
        $(currTarget).removeClass("oj-default");
      })
      .on("mouseleave" + this.eventNamespace, function( event ) {
        var currTarget = event.currentTarget;
        $(currTarget).removeClass("oj-hover");
        $(currTarget).removeClass("oj-active");
        $(currTarget).addClass("oj-default");
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
});
