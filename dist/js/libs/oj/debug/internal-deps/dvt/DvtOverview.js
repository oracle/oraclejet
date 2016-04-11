/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

(function(dvt) {
/** Copyright (c) 2011, Oracle and/or its affiliates. All rights reserved. */
dvt.OverviewUtils = new Object();

dvt.OverviewUtils.supportsTouch = function()
{
  return dvt.Agent.isTouchDevice();
};

dvt.Obj.createSubclass(dvt.OverviewUtils, dvt.Obj);


/**
 * startTime - the start time of timeline in millis
 * endTime - the end of the timeline in millis
 * time - the time in question
 * width - the width of the element
 *
 * @return the position relative to the width of the element
 */
dvt.OverviewUtils.getDatePosition = function(startTime, endTime, time, width)
{
  var number = (time - startTime) * width;
  var denominator = (endTime - startTime);
  if (number == 0 || denominator == 0)
    return 0;

  return number / denominator;
};


/**
 * @return time in millis
 */
dvt.OverviewUtils.getPositionDate = function(startTime, endTime, pos, width)
{
  var number = pos * (endTime - startTime);
  if (number == 0 || width == 0)
    return startTime;

  return (number / width) + startTime;
};
/**
 * Overview component.
 * @param {dvt.Context} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @class Overview component.
 * @constructor
 * @extends {dvt.Container}
 */
dvt.Overview = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.Overview, dvt.Container);

dvt.Overview.MIN_WINDOW_SIZE = 10;
dvt.Overview.DEFAULT_VERTICAL_TIMEAXIS_SIZE = 40;
dvt.Overview.DEFAULT_HORIZONTAL_TIMEAXIS_SIZE = 20;
dvt.Overview.HANDLE_PADDING_SIZE = 20;

/**
 * Attribute for axis label padding.
 * @const
 * @private
 */
dvt.Overview._DEFAULT_AXIS_LABEL_PADDING = 5;

/**
 * Attribute for default window border width.
 * @const
 * @private
 */
dvt.Overview._DEFAULT_WINDOW_BORDER_WIDTH = 1;

/**
 * Initializes the view.
 * @param {dvt.Context} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @protected
 */
dvt.Overview.prototype.Init = function(context, callback, callbackObj) 
{
  dvt.Overview.superclass.Init.call(this, context);
  this._callback = callback;
  this._callbackObj = callbackObj;

  if (this.isFlashEnvironment())
    this._lastChildIndex = 7;
  else
    this._lastChildIndex = 6;

  var interactive = (this._callback != null || this._callbackObj != null);
  if (interactive)
  {
    this.EventManager = new DvtOverviewEventManager(this, context, callback, callbackObj);
    this.EventManager.addListeners(this);
    // register listeners
    if (dvt.OverviewUtils.supportsTouch())
    {
      this.addEvtListener(dvt.TouchEvent.TOUCHSTART, this.HandleTouchStart, false, this);
      this.addEvtListener(dvt.TouchEvent.TOUCHMOVE, this.HandleTouchMove, false, this);
      this.addEvtListener(dvt.TouchEvent.TOUCHEND, this.HandleTouchEnd, false, this);
      this.addEvtListener(dvt.MouseEvent.CLICK, this.HandleShapeClick, false, this);
    }
    else
    {
      this.addEvtListener(dvt.MouseEvent.MOUSEOVER, this.HandleShapeMouseOver, false, this);
      this.addEvtListener(dvt.MouseEvent.MOUSEOUT, this.HandleShapeMouseOut, false, this);
      this.addEvtListener(dvt.MouseEvent.CLICK, this.HandleShapeClick, false, this);
      this.addEvtListener(dvt.KeyboardEvent.KEYDOWN, this.HandleKeyDown, false, this);
      this.addEvtListener(dvt.KeyboardEvent.KEYUP, this.HandleKeyUp, false, this);
    }
  }

  this._initPos = 0;
};


/**
 * To support Chart zoom and scroll feature
 * Ability to set the overview window start and end pos
 * @param start - the viewport start time
 * @param end - the viewport end time
 * @param overviewLength - the size of the overview along the axis direction
 */
dvt.Overview.prototype.setViewportRange = function(start, end, overviewLength)
{
  if (overviewLength == null)
    overviewLength = this.Width;

  var viewportStart = this.getDatePosition(start);
  var viewportEnd = this.getDatePosition(end);

  // make sure it's in bound
  if (viewportStart < this.getMinimumPosition() || viewportEnd > this.getMaximumPosition())
    return;

  // make sure the viewport range is not smaller than the minimum window size
  var size = Math.max(viewportEnd - viewportStart, this.getMinimumWindowSize());

  // make sure values are valid
  if (size > 0 && viewportStart >= 0 && viewportEnd <= overviewLength)
  {
    var slidingWindow = this.getSlidingWindow();
    if (this.isHorizontalRTL())
      this.setSlidingWindowPos(slidingWindow, overviewLength - (viewportStart + size));
    else
      this.setSlidingWindowPos(slidingWindow, viewportStart);
    this.setSlidingWindowSize(slidingWindow, size);

    this.ScrollTimeAxis();
  }
};


/**
 * Sets the initial position of the overview window
 */
dvt.Overview.prototype.setInitialPosition = function(pos)
{
  // make sure initial position is within bound
  if (pos >= this.getMinimumPosition() && pos <= this.getMaximumPosition())
    this._initPos = pos;
};


/**
 * Checks whether a particular feature is turned off
 */
dvt.Overview.prototype.isFeatureOff = function(feature)
{
  if (this._featuresOff == null)
    return false;

  return (dvt.ArrayUtils.getIndex(this._featuresOff, feature) != -1);
};


/**
 * Checks whether sliding window should animate when move
 */
dvt.Overview.prototype.isAnimationOnClick = function()
{
  return !(this._animationOnClick === 'off');
};


/**
 * Renders the component using the specified xml.  If no xml is supplied to a component
 * that has already been rendered, this function will rerender the component with the
 * specified size.
 * @param {obj} obj Either the component xml or json object
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
dvt.Overview.prototype.render = function(obj, width, height) 
{
  if (obj == null)
  {
    // sets the correct time where the sliding window starts
    var start = this._start;
    var end = this._end;

    var slidingWindow = this.getSlidingWindow();
    var slidingWindowPos = this.getSlidingWindowPos(slidingWindow);
    if (slidingWindow != null && slidingWindowPos != 0)
    {
      // note this.Width references the old width
      this._renderStart = dvt.OverviewUtils.getPositionDate(start, end, slidingWindowPos, this.Width);
    }

    // clean out existing elements since they will be regenerate
    this.removeChildren();
  }

  // Store the size
  if (width != null && height != null)
  {
    this.Width = width;
    this.Height = height;
  }

  // If new xml is provided, parse it and apply the properties
  if (obj)
  {
    var props = this.Parse(obj);
    this._applyParsedProperties(props);
  }

  var interactive = (this._callback != null || this._callbackObj != null);

  this.createBackground(width, height);

  if (interactive)
    this.createSlidingWindow(width, height);

  this.updateTimeAxis(width, height);

  this.parseFilledTimeRangesXML(width, height);

  // update current time
  this.updateCurrentTime(width, height);

  // render data
  this.parseDataXML(width, height);

  if (interactive)
  {
    this.createBorderAroundSlidingWindow(width, height);

    if (this.isFlashEnvironment())
    {
      // flash does not supply the resize cursor, and since none of the available cursors
      // works for resize, we'll render our own hint
      this._resizeArrow = this.createResizeArrow();
    }

    // updates the position and width of sliding window and borders around window
    this.updateSlidingWindow(width, height);
  }

  if (this._initialFocusTime != null)
    this._initPos = Math.max(0, dvt.OverviewUtils.getDatePosition(this._start, this._end, this._initialFocusTime, this._width));

  if (this._initPos > 0)
    this.longScrollToPos(this._initPos);
};

dvt.Overview.prototype.getParser = function(obj)
{
  return new DvtOverviewParser(this);
};

dvt.Overview.prototype.Parse = function(obj) 
{
  var parser = this.getParser(obj);
  return parser.parse(obj);
};


/**
 * Applies the parsed properties to this component.
 * @param {object} props An object containing the parsed properties for this component.
 * @private
 */
dvt.Overview.prototype._applyParsedProperties = function(props) 
{
  this._start = props.start;
  this._end = props.end;
  this._width = props.width;
  this._renderStart = props.renderStart;
  this._currentTime = props.currentTime;
  this._initialFocusTime = props.initialFocusTime;
  this._animationOnClick = props.animationOnClick;

  // chart specific options: left and right margin
  this._leftMargin = Math.max(0, props.leftMargin);
  this._rightMargin = Math.max(0, props.rightMargin);
  if (isNaN(this._leftMargin))
    this._leftMargin = 0;
  if (isNaN(this._rightMargin))
    this._rightMargin = 0;

  this._orientation = props.orientation;
  this._overviewPosition = props.overviewPosition;
  this._isRtl = props.isRtl;
  if (props.featuresOff != null)
    this._featuresOff = props.featuresOff.split(' ');
  if (props.minimumWindowSize != null && props.minimumWindowSize > 0)
    this._minimumWindowSize = props.minimumWindowSize;

  this._borderStyles = props.borderStyles;
  this._timeAxisInfo = props.timeAxisInfo;
  if (props.timeAxisInfo != null)
    this._ticks = this._timeAxisInfo.ticks;
  this._formattedTimeRanges = props.formattedTimeRanges;

  this._borderTopStyle = props.borderTopStyle;
  this._borderTopColor = props.borderTopColor;

  this._windowBackgroundColor = props.windowBackgroundColor;
  this._windowBackgroundAlpha = props.windowBackgroundAlpha;
  this._windowBorderTopStyle = props.windowBorderTopStyle;
  this._windowBorderRightStyle = props.windowBorderRightStyle;
  this._windowBorderBottomStyle = props.windowBorderBottomStyle;
  this._windowBorderLeftStyle = props.windowBorderLeftStyle;
  this._windowBorderTopColor = props.windowBorderTopColor;
  this._windowBorderRightColor = props.windowBorderRightColor;
  this._windowBorderBottomColor = props.windowBorderBottomColor;
  this._windowBorderLeftColor = props.windowBorderLeftColor;

  this._handleTextureColor = props.handleTextureColor;
  this._handleFillColor = props.handleFillColor;
  this._handleBackgroundImage = props.handleBackgroundImage;
  this._handleWidth = props.handleWidth;
  this._handleHeight = props.handleHeight;

  this._overviewBackgroundColor = props.overviewBackgroundColor;
  this._currentTimeIndicatorColor = props.currentTimeIndicatorColor;
  this._timeIndicatorColor = props.timeIndicatorColor;
  this._timeAxisBarColor = props.timeAxisBarColor;
  this._timeAxisBarOpacity = props.timeAxisBarOpacity;

  // chart specific options: left and right filter panels
  this._leftFilterPanelColor = props.leftFilterPanelColor;
  this._leftFilterPanelAlpha = props.leftFilterPanelAlpha;
  this._rightFilterPanelColor = props.rightFilterPanelColor;
  this._rightFilterPanelAlpha = props.rightFilterPanelAlpha;
};


/***************************** common helper methods *********************************************/
dvt.Overview.prototype.getDatePosition = function(date)
{
  return Math.max(0, dvt.OverviewUtils.getDatePosition(this._start, this._end, date, this.getOverviewSize())) + this._leftMargin;
};

dvt.Overview.prototype.getPositionDate = function(pos)
{
  return dvt.OverviewUtils.getPositionDate(this._start, this._end, Math.max(0, pos - this._leftMargin), this.getOverviewSize());
};

dvt.Overview.prototype.isRTL = function()
{
  return this._isRtl == 'true';
};

dvt.Overview.prototype.isHorizontalRTL = function()
{
  return (this.isRTL() && !this.isVertical());
};

dvt.Overview.prototype.isVertical = function()
{
  return (this._orientation == 'vertical');
};

dvt.Overview.prototype.isOverviewAbove = function()
{
  return (this._overviewPosition == 'above');
};

// Sets the left and right margins, used by chart
dvt.Overview.prototype.setMargins = function(leftMargin, rightMargin)
{
  if (!isNaN(leftMargin) && leftMargin != null && leftMargin > 0)
    this._leftMargin = leftMargin;

  if (!isNaN(rightMargin) && rightMargin != null && rightMargin > 0)
    this._rightMargin = rightMargin;
};

// returns the width of the overview, taking margins into account
dvt.Overview.prototype.getOverviewSize = function()
{
  if (this.isVertical())
    return this.Height - this._leftMargin - this._rightMargin;
  else
    return this.Width - this._leftMargin - this._rightMargin;
};

// return the minmum position where the sliding window can reach
dvt.Overview.prototype.getMinimumPosition = function()
{
  return this._leftMargin;
};

// return the maximum position where the sliding window can reach
dvt.Overview.prototype.getMaximumPosition = function()
{
  if (this.isVertical())
    return this.Height - this._rightMargin;
  else
    return this.Width - this._rightMargin;
};

// returns the minimum size of the sliding window
dvt.Overview.prototype.getMinimumWindowSize = function()
{
  if (this._minWinSize != null)
    return this._minWinSize;
  else if (this._minimumWindowSize != null)
  {
    this._minWinSize = dvt.OverviewUtils.getDatePosition(this._start, this._end, this._start + this._minimumWindowSize, this.getOverviewSize());
    return this._minWinSize;
  }
  else
    return dvt.Overview.MIN_WINDOW_SIZE;
};

dvt.Overview.prototype.getGrippySize = function()
{
  return 10;
};

// return the start of the resize handle
dvt.Overview.prototype.getHandleStart = function()
{
  if (dvt.OverviewUtils.supportsTouch())
    return this.getHandleSize() / 2;
  else
    return 0;
};

// return the size of the resize handle, which is wider on touch devices
dvt.Overview.prototype.getHandleSize = function() 
{
  if (dvt.OverviewUtils.supportsTouch())
    return 30;
  else
    return 10;
};

dvt.Overview.prototype.isHandle = function(drawable) 
{
  var id = drawable.getId();
  return (id == 'lh' || id == 'rh' || id == 'lhb' || id == 'rhb' || id == 'grpy' || id == 'lbgrh' || id == 'rbgrh' || (drawable.getParent() != null && drawable.getParent().getId() == 'grpy'));
};

// for vertical
dvt.Overview.prototype.getTimeAxisWidth = function()
{
  // checks if there is a time axis
  if (this._timeAxisInfo == null)
    return 0;

  // read from skin?
  if (this._timeAxisWidth == null)
  {
    var width = parseInt(this._timeAxisInfo.width, 10);
    if (!isNaN(width) && width < this.Width)
      this._timeAxisWidth = width;
    else
      this._timeAxisWidth = dvt.Overview.DEFAULT_VERTICAL_TIMEAXIS_SIZE;
  }

  return this._timeAxisWidth;
};

dvt.Overview.prototype.getTimeAxisHeight = function()
{
  // checks if there is a time axis
  if (this._timeAxisInfo == null)
    return 0;

  // read from skin?
  if (this._timeAxisHeight == null)
  {
    var height = parseInt(this._timeAxisInfo.height, 10);
    if (!isNaN(height) && height < this.Height)
      this._timeAxisHeight = height;
    else
      this._timeAxisHeight = dvt.Overview.DEFAULT_HORIZONTAL_TIMEAXIS_SIZE;
  }

  return this._timeAxisHeight;
};

dvt.Overview.prototype.getPageX = function(event)
{
  if (dvt.OverviewUtils.supportsTouch() && event.targetTouches != null)
  {
    if (event.targetTouches.length > 0)
      return event.targetTouches[0].pageX;
    else
      return null;
  }
  else
    return event.pageX;
};

dvt.Overview.prototype.getPageY = function(event)
{
  if (dvt.OverviewUtils.supportsTouch() && event.targetTouches != null)
  {
    if (event.targetTouches.length > 0)
      return event.targetTouches[0].pageY;
    else
      return null;
  }
  else
    return event.pageY;
};


/**
 * Returns true if a panel should be rendered on the left and right side of the overview window.
 * By default they are not rendered.
 * @protected
 */
dvt.Overview.prototype.isLeftAndRightFilterRendered = function()
{
  return false;
};

dvt.Overview.prototype.getSlidingWindow = function()
{
  return this.getChildAt(1);
};

dvt.Overview.prototype.getLeftBackground = function()
{
  if (this.isLeftAndRightFilterRendered())
    return this.getChildAt(3);
  else
    return null;
};

dvt.Overview.prototype.getRightBackground = function()
{
  if (this.isLeftAndRightFilterRendered())
    return this.getChildAt(4);
  else
    return null;
};

dvt.Overview.prototype.getLeftBackgroundHandle = function()
{
  if (this.isLeftAndRightFilterRendered() && !this.isFeatureOff('zoom'))
    return this.getChildAt(5);
  else
    return null;
};

dvt.Overview.prototype.getRightBackgroundHandle = function()
{
  if (this.isLeftAndRightFilterRendered() && !this.isFeatureOff('zoom'))
    return this.getChildAt(6);
  else
    return null;
};

dvt.Overview.prototype.getLeftHandle = function()
{
  var offset = this._lastChildIndex;
  return this.getChildAt(this.getNumChildren() - offset);
};

dvt.Overview.prototype.getRightHandle = function()
{
  var offset = this._lastChildIndex - 1;
  return this.getChildAt(this.getNumChildren() - offset);
};

dvt.Overview.prototype.getLeftTopBar = function()
{
  var offset = this._lastChildIndex - 2;
  return this.getChildAt(this.getNumChildren() - offset);
};

dvt.Overview.prototype.getRightTopBar = function()
{
  var offset = this._lastChildIndex - 3;
  return this.getChildAt(this.getNumChildren() - offset);
};

dvt.Overview.prototype.getBottomBar = function()
{
  var offset = this._lastChildIndex - 4;
  return this.getChildAt(this.getNumChildren() - offset);
};

dvt.Overview.prototype.getTopBar = function()
{
  var offset = this._lastChildIndex - 5;
  return this.getChildAt(this.getNumChildren() - offset);
};

dvt.Overview.prototype.setLinePos = function(line, pos1, pos2)
{
  if (this.isVertical())
  {
    if (pos1 != -1)
      line.setY1(pos1);
    if (pos2 != -1)
      line.setY2(pos2);
  }
  else
  {
    if (pos1 != -1)
      line.setX1(pos1);
    if (pos2 != -1)
      line.setX2(pos2);
  }
};

dvt.Overview.prototype.getLinePos1 = function(line)
{
  if (this.isVertical())
    return line.getY1();
  else
    return line.getX1();
};


/**
 * Returns the drawable that is the target of the event.
 * @return {DvtBaseTreeNode} the target of the event
 */
dvt.Overview.prototype._findDrawable = function(event) 
{
  var target = event.target;
  if (target != null)
  {
    var id = target.getId();
    if (id == null)
      return null;

    if (id.substr(id.length - 7) == '_border')
    {
      // if it's the border shape, returns the actual drawable
      return this.getChildAfter(target);
    }
    else if (id.substr(0, 4) != 'tick' && id != 'ltb' && id != 'rtb' && id != 'bb' && id != 'tab')
      return target;
  }

  return null;
};

dvt.Overview.prototype.isMovable = function(drawable)
{
  if (drawable.getId() == 'window' ||
      drawable.getId() == 'ftr' ||
      drawable.getId() == 'sta' ||
      this.isHandle(drawable))
    return true;

  return false;
};

dvt.Overview.prototype.isFlashEnvironment = function()
{
  return (window && window.isFlashEnvironment);
};

/***************************** end common helper methods *********************************************/


/***************************** marker creation and event handling *********************************************/
dvt.Overview.prototype.createBackground = function(width, height)
{
  // draw a background shape covering all area to capture all mouse events
  var background = new dvt.Rect(this.getCtx(), 0, 0, width, height, 'bg');
  background.setSolidFill(this._overviewBackgroundColor);

  // Do not antialias the background
  background.setPixelHinting(true);

  this.addChild(background);
  return background;
};

dvt.Overview.prototype.createSlidingWindow = function(width, height)
{
  var vertical = this.isVertical();

  // draw sliding window first so that it is under the markers
  if (vertical)
    var slidingWindow = new dvt.Rect(this.getCtx(), 0, 0, width, 0, 'window');
  else
    slidingWindow = new dvt.Rect(this.getCtx(), 0, 0, 0, height, 'window');
  slidingWindow.setSolidFill(this._windowBackgroundColor, this._windowBackgroundAlpha);

  // Do not antialias the Timeline Overview
  slidingWindow.setPixelHinting(true);

  if (!this.isFeatureOff('zoom'))
  {
    var handleSize = this.getHandleSize();
    var handleStart = this.getHandleStart();
    var grippySize = this.getGrippySize();
    if (vertical)
    {
      var handleX = (width - 36) / 2;
      var leftHandleCmds = dvt.PathUtils.moveTo(handleX, 0) +
          dvt.PathUtils.quadTo(handleX + 3, 6, handleX + 8, 8) +
                  dvt.PathUtils.lineTo(handleX + 28, 8) +
                  dvt.PathUtils.quadTo(handleX + 33, 6, handleX + 36, 0);
      dvt.PathUtils.closePath();
      var rightHandleCmds = dvt.PathUtils.moveTo(handleX, 0) +
          dvt.PathUtils.quadTo(handleX + 3, -6, handleX + 8, -8) +
                  dvt.PathUtils.lineTo(handleX + 28, -8) +
                  dvt.PathUtils.quadTo(handleX + 33, -6, handleX + 36, 0);
      dvt.PathUtils.closePath();
      var leftHandleBackground = new dvt.Rect(this.getCtx(), 0, 0, width, handleSize, 'lhb');
      var rightHandleBackground = new dvt.Rect(this.getCtx(), 0, 0, width, handleSize, 'rhb');
      var cursor = 'row-resize';

      if (this._handleBackgroundImage)
      {
        var leftGrippy = this.createGrippyImage(width, grippySize);
        var rightGrippy = this.createGrippyImage(width, grippySize);
      }
      else
      {
        leftGrippy = this.createGrippy(handleX);
        rightGrippy = this.createGrippy(handleX);
      }
    }
    else
    {
      var handleY = (height - 36) / 2;
      leftHandleCmds = dvt.PathUtils.moveTo(0, handleY) +
          dvt.PathUtils.quadTo(6, handleY + 3, 8, handleY + 8) +
                  dvt.PathUtils.lineTo(8, handleY + 28) +
                  dvt.PathUtils.quadTo(6, handleY + 33, 0, handleY + 36);
      dvt.PathUtils.closePath();
      rightHandleCmds = dvt.PathUtils.moveTo(0, handleY) +
          dvt.PathUtils.quadTo(-6, handleY + 3, -8, handleY + 8) +
                  dvt.PathUtils.lineTo(-8, handleY + 28) +
                  dvt.PathUtils.quadTo(-6, handleY + 33, 0, handleY + 36);
      dvt.PathUtils.closePath();
      leftHandleBackground = new dvt.Rect(this.getCtx(), 0 - handleStart, 0, handleSize, height, 'lhb');
      rightHandleBackground = new dvt.Rect(this.getCtx(), handleStart, 0, handleSize, height, 'rhb');
      cursor = 'col-resize';

      if (this._handleBackgroundImage)
      {
        leftGrippy = this.createGrippyImage(grippySize, height);
        rightGrippy = this.createGrippyImage(grippySize, height);
      }
      else
      {
        leftGrippy = this.createGrippy(handleY);
        rightGrippy = this.createGrippy(handleY);
      }
    }

    leftHandleBackground.setSolidFill(this._windowBackgroundColor, 0);
    rightHandleBackground.setSolidFill(this._windowBackgroundColor, 0);

    // Do not antialias the handle backgrounds
    leftHandleBackground.setPixelHinting(true);
    rightHandleBackground.setPixelHinting(true);

    var leftHandle = new dvt.Path(this.getCtx(), leftHandleCmds, 'lh');
    var rightHandle = new dvt.Path(this.getCtx(), rightHandleCmds, 'rh');
    leftHandle.setSolidFill(this._handleFillColor);
    leftHandle.setSolidStroke(this._handleFillColor);
    rightHandle.setSolidFill(this._handleFillColor);
    rightHandle.setSolidStroke(this._handleFillColor);

    // if the handle color is the same as the background color, it should not have antialiasing so it does not appear visible
    if (this._windowBackgroundColor == this._handleFillColor)
    {
      leftHandle.setPixelHinting(true);
      rightHandle.setPixelHinting(true);
    }

    // sets the resize cursor, for Flash this will hide the cursor and we will render our own cursor instead
    leftHandleBackground.setCursor(cursor);
    rightHandleBackground.setCursor(cursor);
    leftHandle.setCursor(cursor);
    rightHandle.setCursor(cursor);
    leftGrippy.setCursor(cursor);
    rightGrippy.setCursor(cursor);

    slidingWindow.addChild(leftHandleBackground);
    slidingWindow.addChild(leftHandle);
    slidingWindow.addChild(leftGrippy);
    slidingWindow.addChild(rightHandleBackground);
    slidingWindow.addChild(rightHandle);
    slidingWindow.addChild(rightGrippy);
  }

  // sets cursor AFTER adding child since toolkit adds a group and the cursor would be set on group instead
  slidingWindow.setCursor('move');
  this.addChild(slidingWindow);

  // border above time axis
  if (vertical)
  {
    if (this.isRTL())
      var timeAxisTopBar = new dvt.Line(this.getCtx(), this.getTimeAxisWidth(), 0, this.getTimeAxisWidth(), height, 'tab');
    else
      timeAxisTopBar = new dvt.Line(this.getCtx(), width - this.getTimeAxisWidth(), 0, width - this.getTimeAxisWidth(), height, 'tab');
  }
  else
  {
    if (this.isOverviewAbove())
      timeAxisTopBar = new dvt.Line(this.getCtx(), 0, this.getTimeAxisHeight(), width, this.getTimeAxisHeight(), 'tab');
    else
      timeAxisTopBar = new dvt.Line(this.getCtx(), 0, height - this.getTimeAxisHeight(), width, height - this.getTimeAxisHeight(), 'tab');
  }
  timeAxisTopBar.setSolidStroke(this._timeAxisBarColor, this._timeAxisBarOpacity);

  // Do not antialias the time axis top bar
  timeAxisTopBar.setPixelHinting(true);
  this._timeAxisTopBar = timeAxisTopBar;

  this.addChild(timeAxisTopBar);

  if (this.isLeftAndRightFilterRendered())
  {
    if (vertical)
    {
      var leftBackground = new dvt.Rect(this.getCtx(), 0, 0, width, 0, 'lbg');
      var rightBackground = new dvt.Rect(this.getCtx(), 0, 0, width, 0, 'rbg');
    }
    else
    {
      leftBackground = new dvt.Rect(this.getCtx(), 0, 0, 0, height, 'lbg');
      rightBackground = new dvt.Rect(this.getCtx(), 0, 0, 0, height, 'rbg');
    }

    leftBackground.setSolidFill(this._leftFilterPanelColor, this._leftFilterPanelAlpha);
    this.addChild(leftBackground);
    rightBackground.setSolidFill(this._rightFilterPanelColor, this._rightFilterPanelAlpha);
    this.addChild(rightBackground);

    // the left and right background resize handle are needed for touch because the touch area for resize handle goes
    // beyond the handle and into the left and right background area, so we'll need something on top of the background
    if (dvt.OverviewUtils.supportsTouch() && handleStart != undefined)
    {
      var handleSize = this.getHandleStart();
      if (vertical)
      {
        var leftBackgroundResizeHandle = new dvt.Rect(this.getCtx(), 0, 0, width, handleStart, 'lbgrh');
        var rightBackgroundResizeHandle = new dvt.Rect(this.getCtx(), 0, 0, width, handleStart, 'rbgrh');
      }
      else
      {
        leftBackgroundResizeHandle = new dvt.Rect(this.getCtx(), 0, 0, handleStart, height, 'lbgrh');
        rightBackgroundResizeHandle = new dvt.Rect(this.getCtx(), 0, 0, handleStart, height, 'rbgrh');
      }

      leftBackgroundResizeHandle.setSolidFill(this._leftFilterPanelColor, 0);
      this.addChild(leftBackgroundResizeHandle);
      rightBackgroundResizeHandle.setSolidFill(this._rightFilterPanelColor, 0);
      this.addChild(rightBackgroundResizeHandle);
    }
  }
};

// renders the grippy from an image
dvt.Overview.prototype.createGrippyImage = function(width, height)
{
  var posX = (width - this._handleWidth) / 2;
  var posY = (height - this._handleHeight) / 2;
  var grippy = new dvt.Image(this.getCtx(), this._handleBackgroundImage, posX, posY, this._handleWidth, this._handleHeight, 'grpy');
  grippy.setMouseEnabled(false);
  return grippy;
};

// renders the dots in the grippy
dvt.Overview.prototype.createGrippy = function(handlePos)
{
  var grippy = new dvt.Container(this.getCtx(), 'grpy');
  var gap = 2; // gap between dots
  var count = 9;  // how many dots to draw
  var color = this._handleTextureColor; // color of the dots

  if (this.isVertical())
  {
    var startx = 8 + handlePos;  // start x location of dots relative to container
    var starty = 3;  // start y location of dots relative to container
    for (var i = 0; i < count; i++)
    {
      var dot = new dvt.Line(this.getCtx(), startx + i * gap, starty, startx + i * gap + 1, starty, 'dot1' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      starty = starty + gap;
      dot = new dvt.Line(this.getCtx(), (startx + 1) + i * gap, starty, (startx + 1) + i * gap + 1, starty, 'dot2' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      starty = starty + gap;
      dot = new dvt.Line(this.getCtx(), startx + i * gap, starty, startx + i * gap + 1, starty, 'dot3' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      starty = 3;
    }

    dot = new dvt.Line(this.getCtx(), startx + count * gap, starty, startx + count * gap + 1, starty, 'dot4');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
    starty = starty + gap * 2;
    dot = new dvt.Line(this.getCtx(), startx + count * gap, starty, startx + count * gap + 1, starty, 'dot5');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
  }
  else
  {
    startx = 3;  // start x location of dots relative to container
    starty = 8 + handlePos;  // start y location of dots relative to container
    for (i = 0; i < count; i++)
    {
      dot = new dvt.Line(this.getCtx(), startx, starty + i * gap, startx, starty + i * gap + 1, 'dot1' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      startx = startx + gap;
      dot = new dvt.Line(this.getCtx(), startx, (starty + 1) + i * gap, startx, (starty + 1) + i * gap + 1, 'dot2' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      startx = startx + gap;
      dot = new dvt.Line(this.getCtx(), startx, starty + i * gap, startx, starty + i * gap + 1, 'dot3' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      startx = 3;
    }

    dot = new dvt.Line(this.getCtx(), startx, starty + count * gap, startx, starty + count * gap + 1, 'dot4');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
    startx = startx + gap * 2;
    dot = new dvt.Line(this.getCtx(), startx, starty + count * gap, startx, starty + count * gap + 1, 'dot5');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
  }

  // Do not antialias the grippy
  grippy.setPixelHinting(true);

  return grippy;
};

dvt.Overview.prototype.updateSlidingWindow = function(width, height)
{
  var vertical = this.isVertical();

  var window = this.getSlidingWindow();
  var size = this.getOverviewSize();
  var actualSize = vertical ? this.Height : this.Width;

  var timelineWidth = this._width;
  var start = this._start;
  var end = this._end;
  var renderStart = this._renderStart;

  // first get the date using the width of timeline overview as position relative to the overall timeline
  var rangeStartTime = dvt.OverviewUtils.getPositionDate(start, end, 0, timelineWidth);
  var rangeEndTime = dvt.OverviewUtils.getPositionDate(start, end, actualSize, timelineWidth);

  // now find the position relative to the width of timeline overview
  var rangeStartPos = this.getDatePosition(rangeStartTime);
  var rangeEndPos = Math.min(actualSize, this.getDatePosition(rangeEndTime));
  var renderStartPos = this.getDatePosition(renderStart);

  var newLeft = renderStartPos;
  var newWidth = rangeEndPos - rangeStartPos;

  if (this.isHorizontalRTL())
    this.setSlidingWindowPos(window, size - renderStartPos - newWidth);
  else
    this.setSlidingWindowPos(window, newLeft);
  this.setSlidingWindowSize(window, newWidth);

  this.ScrollTimeAxis();

  // update increment as well
  this._increment = this.calculateIncrement(size);
};

dvt.Overview.prototype.createBorderAroundSlidingWindow = function(width, height)
{
  // add the left and right grip last since we want them over the markers
  var slidingWindow = this.getSlidingWindow();
  var halfBorderWidth = dvt.Overview._DEFAULT_WINDOW_BORDER_WIDTH / 2;
  if (this.isVertical())
  {
    var top = slidingWindow.getY();
    var topCenter = top + halfBorderWidth;
    var bottom = top + slidingWindow.getHeight();
    var bottomCenter = bottom - halfBorderWidth;
    var left = 0;
    var leftCenter = halfBorderWidth;
    var right = width;
    var rightCenter = right - halfBorderWidth;

    var leftHandle = new dvt.Line(this.getCtx(), left, topCenter, width, topCenter, 'lh');
    var rightHandle = new dvt.Line(this.getCtx(), left, bottomCenter, width, bottomCenter, 'rh');

    // leftTopBar and rightTopBar are only visible in fusion skins
    var leftTopBar = new dvt.Line(this.getCtx(), leftCenter, 0, leftCenter, top, 'ltb');
    var rightTopBar = new dvt.Line(this.getCtx(), leftCenter, bottom, leftCenter, height, 'rtb');

    var bottomBar = new dvt.Line(this.getCtx(), rightCenter, top, rightCenter, bottom, 'bb');
    var topBar = new dvt.Line(this.getCtx(), leftCenter, top, leftCenter, bottom, 'tb');
  }
  else
  {
    top = 0;
    topCenter = top + halfBorderWidth;
    bottom = height;
    bottomCenter = bottom - halfBorderWidth;
    left = slidingWindow.getX();
    leftCenter = left + halfBorderWidth;
    right = left + slidingWindow.getWidth();
    rightCenter = right - halfBorderWidth;

    leftHandle = new dvt.Line(this.getCtx(), leftCenter, top, leftCenter, bottom, 'lh');
    rightHandle = new dvt.Line(this.getCtx(), rightCenter, top, rightCenter, bottom, 'rh');

    /* This mode is not currently implemented ...
    if (this.isOverviewAbove())
    {
        leftTopBar = new dvt.Line(this.getCtx(), 0, height-1, left, height-1, "ltb");
        rightTopBar = new dvt.Line(this.getCtx(), right, height-1, width, height-1, "rtb");
        bottomBar = new dvt.Line(this.getCtx(), left, 1, right, 1, "bb");
        topBar = new dvt.Line(this.getCtx(), left, height-1, right, height-1, "tb");
    }
    else ... */

    // leftTopBar and rightTopBar are only visible in fusion skins
    leftTopBar = new dvt.Line(this.getCtx(), 0, topCenter, left + 1, topCenter, 'ltb');
    rightTopBar = new dvt.Line(this.getCtx(), right - 1, topCenter, width, topCenter, 'rtb');

    bottomBar = new dvt.Line(this.getCtx(), left, bottomCenter, right, bottomCenter, 'bb');
    topBar = new dvt.Line(this.getCtx(), left, topCenter, right, topCenter, 'tb');
  }

  // Do not antialias the sliding window borders
  leftHandle.setPixelHinting(true);
  rightHandle.setPixelHinting(true);
  leftTopBar.setPixelHinting(true);
  rightTopBar.setPixelHinting(true);
  bottomBar.setPixelHinting(true);
  topBar.setPixelHinting(true);

  if (this._windowBorderLeftStyle != 'none')
    leftHandle.setSolidStroke(this._windowBorderLeftColor);
  this.addChild(leftHandle);

  if (this._windowBorderRightStyle != 'none')
    rightHandle.setSolidStroke(this._windowBorderRightColor);
  this.addChild(rightHandle);

  if (this._borderTopStyle != 'none' && this._borderTopColor)
  {
    leftTopBar.setSolidStroke(this._borderTopColor);
    rightTopBar.setSolidStroke(this._borderTopColor);
  }
  this.addChild(leftTopBar);
  this.addChild(rightTopBar);

  if (this._windowBorderBottomStyle != 'none')
    bottomBar.setSolidStroke(this._windowBorderBottomColor);
  this.addChild(bottomBar);

  if (this._windowBorderTopStyle != 'none')
    topBar.setSolidStroke(this._windowBorderTopColor);
  this.addChild(topBar);
};

dvt.Overview.prototype.createResizeArrow = function()
{
  if (this.isVertical())
  {
    var arrowCmds = dvt.PathUtils.moveTo(6, 0) +
        dvt.PathUtils.lineTo(0, 5) +
        dvt.PathUtils.lineTo(5, 5) +
        dvt.PathUtils.lineTo(5, 17) +
        dvt.PathUtils.lineTo(0, 17) +
        dvt.PathUtils.lineTo(6, 22) +
        dvt.PathUtils.lineTo(12, 17) +
        dvt.PathUtils.lineTo(7, 17) +
        dvt.PathUtils.lineTo(7, 5) +
        dvt.PathUtils.lineTo(12, 5) +
        dvt.PathUtils.closePath();
  }
  else
  {
    arrowCmds = dvt.PathUtils.moveTo(5, 0) +
        dvt.PathUtils.lineTo(0, 6) +
        dvt.PathUtils.lineTo(5, 12) +
        dvt.PathUtils.lineTo(5, 7) +
        dvt.PathUtils.lineTo(17, 7) +
        dvt.PathUtils.lineTo(17, 12) +
        dvt.PathUtils.lineTo(22, 6) +
        dvt.PathUtils.lineTo(17, 0) +
        dvt.PathUtils.lineTo(17, 4) +
        dvt.PathUtils.lineTo(5, 4) +
        dvt.PathUtils.lineTo(5, 0) +
        dvt.PathUtils.closePath();
  }

  var arrow = new dvt.Path(this.getCtx(), arrowCmds, 'arr');
  arrow.setSolidFill('#ffffff');
  arrow.setSolidStroke('#000000');
  arrow.setVisible(false);
  this.addChild(arrow);

  return arrow;
};

// orientation independent method
dvt.Overview.prototype.setRectPos = function(rect, pos)
{
  if (this.isVertical())
    rect.setY(pos);
  else
    rect.setX(pos);
};

dvt.Overview.prototype.getRectPos = function(rect)
{
  if (this.isVertical())
    return rect.getY();
  else
    return rect.getX();
};

dvt.Overview.prototype.getRectSize = function(rect)
{
  if (this.isVertical())
    return rect.getHeight();
  else
    return rect.getWidth();
};

dvt.Overview.prototype.setRectSize = function(rect, size)
{
  if (this.isVertical())
    rect.setHeight(size);
  else
    rect.setWidth(size);
};

dvt.Overview.prototype.getSlidingWindowPos = function(slidingWindow)
{
  if (this.isVertical())
    return slidingWindow.getTranslateY();
  else
    return slidingWindow.getTranslateX();
};

dvt.Overview.prototype.setSlidingWindowPos = function(slidingWindow, pos)
{
  // make sure it cannot be negative
  pos = Math.max(0, pos);

  if (this.isVertical())
    slidingWindow.setTranslateY(pos);
  else
    slidingWindow.setTranslateX(pos);

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    leftBackground.setWidth(pos);
    var rightStart = pos + this.getSlidingWindowSize(slidingWindow);
    var rightBackground = this.getRightBackground();
    rightBackground.setX(rightStart);
    rightBackground.setWidth(Math.max(0, this.Width - rightStart));

    // updates the background resize handle for touch
    if (dvt.OverviewUtils.supportsTouch() && !this.isFeatureOff('zoom'))
    {
      var handleStart = this.getHandleStart();
      var leftBackgroundHandle = this.getLeftBackgroundHandle();
      leftBackgroundHandle.setX(pos - handleStart);
      var rightBackgroundHandle = this.getRightBackgroundHandle();
      rightBackgroundHandle.setX(rightStart);
    }
  }
};

dvt.Overview.prototype.getSlidingWindowSize = function(slidingWindow)
{
  return this.getRectSize(slidingWindow);
};

dvt.Overview.prototype.setSlidingWindowSize = function(slidingWindow, size)
{
  // make sure it's greater than the minimum window size
  size = Math.max(this.getMinimumWindowSize(), size);

  // make sure it does not exceed overview
  size = Math.min(this.isVertical() ? this.Height : this.Width, size);

  this.setRectSize(slidingWindow, size);

  // update left and right filter if one is specified
  if (this.isLeftAndRightFilterRendered())
  {
    var rightStart = this.getSlidingWindowPos(slidingWindow) + size;
    var rightBackground = this.getRightBackground();
    rightBackground.setX(rightStart);
    rightBackground.setWidth(Math.max(0, this.Width - rightStart));

    // updates the background resize handle for touch
    if (dvt.OverviewUtils.supportsTouch() && !this.isFeatureOff('zoom'))
    {
      var rightBackgroundHandle = this.getRightBackgroundHandle();
      rightBackgroundHandle.setX(rightStart);
    }
  }

  // if resize feature is off then there's nothing else to do
  if (this.isFeatureOff('zoom'))
    return;

  // update the resize handles
  var rightHandleBackground = slidingWindow.getChildAt(3);
  var rightHandle = slidingWindow.getChildAt(4);
  var rightGrippy = slidingWindow.getChildAt(5);
  if (this.isVertical())
  {
    rightHandle.setTranslateY(size);
    rightHandleBackground.setTranslateY(size - this.getHandleSize());
    rightGrippy.setTranslateY(size - this.getGrippySize());
  }
  else
  {
    rightHandle.setTranslateX(size);
    rightHandleBackground.setTranslateX(size - this.getHandleSize());
    rightGrippy.setTranslateX(size - this.getGrippySize());
  }
};

dvt.Overview.prototype.calculateIncrement = function(overviewWidth)
{
  var timelineWidth = this._width;
  var start = this._start;
  var end = this._end;

  // get the date diff for 1 pixel
  var day1 = dvt.OverviewUtils.getPositionDate(start, end, 1, overviewWidth);
  var day2 = dvt.OverviewUtils.getPositionDate(start, end, 2, overviewWidth);

  // now map it back to whole timeline for position
  var pos1 = dvt.OverviewUtils.getDatePosition(start, end, day1, timelineWidth);
  var pos2 = dvt.OverviewUtils.getDatePosition(start, end, day2, timelineWidth);

  var inc = pos2 - pos1;
  return inc;
};

dvt.Overview.prototype.updateTimeAxis = function(width, height)
{
  if (this._ticks == null)
    return;

  var vertical = this.isVertical();
  var size = this.getOverviewSize();

  var start = this._start;
  var end = this._end;

  for (var i = 0; i < this._ticks.length; i++)
  {
    var child = this._ticks[i];

    var time = parseInt(child.getAttr('time'), 10);
    var time_pos = this.getDatePosition(time);
    var label = child.getAttr('label');

    var maxWidth = 0;
    if (i + 1 < this._ticks.length)
    {
      var next_time = parseInt(this._ticks[i + 1].getAttr('time'), 10);
      var next_time_pos = this.getDatePosition(next_time);
      maxWidth = next_time_pos - time_pos;
    }
    else
    {
      // last label
      maxWidth = size - time_pos;
    }

    if (this.isHorizontalRTL())
      time_pos = size - time_pos;

    if (vertical)
      maxWidth = this.Width;

    maxWidth -= (dvt.Overview._DEFAULT_AXIS_LABEL_PADDING * 2);
    this.addTick(time_pos, width, height, 'tick' + i);
    this.addLabel(time_pos, label, width, height, maxWidth, 'label' + i);
  }
};

// adds a tick mark
dvt.Overview.prototype.addTick = function(pos, width, height, id)
{
  if (this.isVertical())
    var line = new dvt.Line(this.getCtx(), 0, pos, width, pos, id);
  else
    line = new dvt.Line(this.getCtx(), pos, 0, pos, height, id);
  var stroke = new dvt.SolidStroke(this._timeIndicatorColor);
  stroke.setStyle(dvt.Stroke.DASHED, 3);
  line.setStroke(stroke);

  // Do not antialias tick marks
  line.setPixelHinting(true);

  this.addChild(line);
};

// add a label in time axis
dvt.Overview.prototype.addLabel = function(pos, text, width, height, maxWidth, id, labelStyle)
{
  labelStyle = labelStyle || new dvt.CSSStyle('font-weight:bold');

  if (this.isVertical())
  {
    var label = new dvt.OutputText(this.getCtx(), text, 4, pos, id);
    label.setCSSStyle(labelStyle);
    if (this.isRTL())
    {
      this.addChild(label);
      var dim = label.getDimensions();
      this.removeChild(label);
      label.setX(Math.max(4, this.Width - dim.w - 4));
    }
  }
  else
  {
    if (this.isOverviewAbove())
      var y = 2;
    else
      y = height - this.getTimeAxisHeight() + 2;

    var padding = dvt.Overview._DEFAULT_AXIS_LABEL_PADDING;
    label = new dvt.OutputText(this.getCtx(), text, pos + padding, y, id);
    label.setCSSStyle(labelStyle);
    if (this.isHorizontalRTL())
    {
      this.addChild(label);
      dim = label.getDimensions();
      this.removeChild(label);
      label.setX(pos - Math.min(dim.w, maxWidth) - padding);
    }
  }

  dvt.TextUtils.fitText(label, maxWidth, Infinity, this);

  // save the raw text for tooltip
  label._rawText = label.getUntruncatedTextString();
};

dvt.Overview.prototype.updateCurrentTime = function(width, height)
{
  if (this._currentTime == null || isNaN(this._currentTime))
    return;

  var time_pos = this.getDatePosition(this._currentTime);

  if (this.isVertical())
    var line = new dvt.Line(this.getCtx(), 0, time_pos, width, time_pos, 'ocd');
  else
  {
    if (this.isRTL())
      time_pos = width - time_pos;
    line = new dvt.Line(this.getCtx(), time_pos, 0, time_pos, height, 'ocd');
  }
  line.setSolidStroke(this._currentTimeIndicatorColor);

  // Do not antialias current time line
  line.setPixelHinting(true);

  this.addChild(line);
};

dvt.Overview.prototype.parseFilledTimeRangesXML = function(width, height)
{
  if (this._formattedTimeRanges == null)
    return;

  // draw filled time ranges so that it is over the sliding window but under the markers
  var start = this._start;
  var end = this._end;

  for (var i = 0; i < this._formattedTimeRanges.length; i++)
  {
    var ftr = this._formattedTimeRanges[i];
    this.addFilledTimeRange(ftr, start, end, width, height);
  }
};

dvt.Overview.prototype.addFilledTimeRange = function(elem, start, end, width, height)
{
  var rangeStart = parseInt(elem.getAttr('rs'), 10);
  var rangeEnd = parseInt(elem.getAttr('re'), 10);
  var color = elem.getAttr('c');

  if (rangeStart != null && rangeEnd != null)
  {
    var size = this.getOverviewSize();

    var rangeStart_pos = this.getDatePosition(rangeStart);
    var rangeEnd_pos = this.getDatePosition(rangeEnd);
    var rangeWidth = rangeEnd_pos - rangeStart_pos;
    if (this.isHorizontalRTL())
    {
      rangeStart_pos = size - rangeStart_pos - rangeWidth;
      rangeEnd_pos = size - rangeEnd_pos - rangeWidth;
    }

    if (this.isVertical())
      var displayable = new dvt.Rect(this.getCtx(), 0, rangeStart_pos, width - this.getTimeAxisWidth(), rangeWidth, 'ftr');
    else
      displayable = new dvt.Rect(this.getCtx(), rangeStart_pos, this.isOverviewAbove() ? this.getTimeAxisHeight() : 0, rangeWidth, height - this.getTimeAxisHeight(), 'ftr');

    if (color != null)
      displayable.setSolidFill(color, 0.4);
    displayable.setCursor('move');

    // Do not antialias filled time range
    displayable.setPixelHinting(true);

    this.addChild(displayable);
  }
};

dvt.Overview.prototype.parseDataXML = function(width, height)
{
};


/************************** sliding window animation *********************************************/
dvt.Overview.prototype.animateSlidingWindow = function(newLeft, newWidth)
{
  var slidingWindow = this.getSlidingWindow();
  var handleBackground = slidingWindow.getChildAt(3);
  var handle = slidingWindow.getChildAt(4);
  var grippy = slidingWindow.getChildAt(5);

  // first check if sliding window move or resize at all
  if (newWidth == undefined && newLeft == this.getSlidingWindowPos(slidingWindow))
    return;

  var leftHandle = this.getLeftHandle();
  var rightHandle = this.getRightHandle();
  var leftTopBar = this.getLeftTopBar();
  var rightTopBar = this.getRightTopBar();
  var bottomBar = this.getBottomBar();
  var topBar = this.getTopBar();

  if (this.isVertical())
  {
    var posGetter = slidingWindow.getTranslateY;
    var posSetter = slidingWindow.setTranslateY;
    var sizeGetter = slidingWindow.getHeight;
    var sizeSetter = slidingWindow.setHeight;
    var leftHandlePos1Getter = leftHandle.getY1;
    var leftHandlePos1Setter = leftHandle.setY1;
    var leftHandlePos2Getter = leftHandle.getY2;
    var leftHandlePos2Setter = leftHandle.setY2;
    var rightHandlePos1Getter = rightHandle.getY1;
    var rightHandlePos1Setter = rightHandle.setY1;
    var rightHandlePos2Getter = rightHandle.getY2;
    var rightHandlePos2Setter = rightHandle.setY2;
    var leftTopBarPosGetter = leftTopBar.getY2;
    var leftTopBarPosSetter = leftTopBar.setY2;
    var rightTopBarPosGetter = rightTopBar.getY1;
    var rightTopBarPosSetter = rightTopBar.setY1;
    var bottomBarPos1Getter = bottomBar.getY1;
    var bottomBarPos1Setter = bottomBar.setY1;
    var bottomBarPos2Getter = bottomBar.getY2;
    var bottomBarPos2Setter = bottomBar.setY2;
    var topBarPos1Getter = topBar.getY1;
    var topBarPos1Setter = topBar.setY1;
    var topBarPos2Getter = topBar.getY2;
    var topBarPos2Setter = topBar.setY2;

    if (handle != null && grippy != null)
    {
      var handleGetter = handle.getTranslateY;
      var handleSetter = handle.setTranslateY;
      var grippyGetter = grippy.getTranslateY;
      var grippySetter = grippy.setTranslateY;
    }
  }
  else
  {
    posGetter = slidingWindow.getTranslateX;
    posSetter = slidingWindow.setTranslateX;
    sizeGetter = slidingWindow.getWidth;
    sizeSetter = slidingWindow.setWidth;
    leftHandlePos1Getter = leftHandle.getX1;
    leftHandlePos1Setter = leftHandle.setX1;
    leftHandlePos2Getter = leftHandle.getX2;
    leftHandlePos2Setter = leftHandle.setX2;
    rightHandlePos1Getter = rightHandle.getX1;
    rightHandlePos1Setter = rightHandle.setX1;
    rightHandlePos2Getter = rightHandle.getX2;
    rightHandlePos2Setter = rightHandle.setX2;
    leftTopBarPosGetter = leftTopBar.getX2;
    leftTopBarPosSetter = leftTopBar.setX2;
    rightTopBarPosGetter = rightTopBar.getX1;
    rightTopBarPosSetter = rightTopBar.setX1;
    bottomBarPos1Getter = bottomBar.getX1;
    bottomBarPos1Setter = bottomBar.setX1;
    bottomBarPos2Getter = bottomBar.getX2;
    bottomBarPos2Setter = bottomBar.setX2;
    topBarPos1Getter = topBar.getX1;
    topBarPos1Setter = topBar.setX1;
    topBarPos2Getter = topBar.getX2;
    topBarPos2Setter = topBar.setX2;

    if (handle != null && grippy != null)
    {
      handleGetter = handle.getTranslateX;
      handleSetter = handle.setTranslateX;
      grippyGetter = grippy.getTranslateX;
      grippySetter = grippy.setTranslateX;
    }
  }

  // make sure it doesn't go over
  var minPos = this.getMinimumPosition();
  var maxPos = this.getMaximumPosition();
  var slidingWindowSize = this.getSlidingWindowSize(slidingWindow);
  if (newWidth != undefined)
    newLeft = Math.max(minPos, Math.min(maxPos - newWidth, newLeft));
  else
    newLeft = Math.max(minPos, Math.min(maxPos - slidingWindowSize, newLeft));

  // sliding window
  var animator = this.isAnimationOnClick() ? new dvt.Animator(this.getCtx(), 0.5, 0, dvt.Easing.linear) : null;
  this.animateProperty(animator, slidingWindow, posGetter, posSetter, newLeft);
  if (newWidth != undefined)
  {
    this.animateProperty(animator, slidingWindow, sizeGetter, sizeSetter, newWidth);
    if (handle != null)
      this.animateProperty(animator, handle, handleGetter, handleSetter, newWidth);
    if (handleBackground != null)
      this.animateProperty(animator, handleBackground, handleGetter, handleSetter, newWidth - this.getHandleSize());
    if (grippy != null)
      this.animateProperty(animator, grippy, grippyGetter, grippySetter, newWidth - this.getGrippySize());
  }

  // left and right handles
  this.animateProperty(animator, leftHandle, leftHandlePos1Getter, leftHandlePos1Setter, newLeft);
  this.animateProperty(animator, leftHandle, leftHandlePos2Getter, leftHandlePos2Setter, newLeft);

  if (newWidth != undefined)
  {
    this.animateProperty(animator, rightHandle, rightHandlePos1Getter, rightHandlePos1Setter, newLeft + newWidth);
    this.animateProperty(animator, rightHandle, rightHandlePos2Getter, rightHandlePos2Setter, newLeft + newWidth);
  }
  else
  {
    this.animateProperty(animator, rightHandle, rightHandlePos1Getter, rightHandlePos1Setter, newLeft + slidingWindowSize);
    this.animateProperty(animator, rightHandle, rightHandlePos2Getter, rightHandlePos2Setter, newLeft + slidingWindowSize);
  }

  // left and right top bar
  this.animateProperty(animator, leftTopBar, leftTopBarPosGetter, leftTopBarPosSetter, newLeft + 1);

  if (newWidth != undefined)
    this.animateProperty(animator, rightTopBar, rightTopBarPosGetter, rightTopBarPosSetter, newLeft + newWidth - 1);
  else
    this.animateProperty(animator, rightTopBar, rightTopBarPosGetter, rightTopBarPosSetter, newLeft + slidingWindowSize - 1);

  this.animateProperty(animator, bottomBar, bottomBarPos1Getter, bottomBarPos1Setter, newLeft);
  this.animateProperty(animator, topBar, topBarPos1Getter, topBarPos1Setter, newLeft);

  if (newWidth != undefined)
  {
    this.animateProperty(animator, bottomBar, bottomBarPos2Getter, bottomBarPos2Setter, newLeft + newWidth);
    this.animateProperty(animator, topBar, topBarPos2Getter, topBarPos2Setter, newLeft + newWidth);
  }
  else
  {
    this.animateProperty(animator, bottomBar, bottomBarPos2Getter, bottomBarPos2Setter, newLeft + slidingWindowSize);
    this.animateProperty(animator, topBar, topBarPos2Getter, topBarPos2Setter, newLeft + slidingWindowSize);
  }

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    var leftBackgroundGetter = leftBackground.getWidth;
    var leftBackgroundSetter = leftBackground.setWidth;
    this.animateProperty(animator, leftBackground, leftBackgroundGetter, leftBackgroundSetter, newLeft);

    var rightStart = newLeft + slidingWindowSize;
    var rightBackground = this.getRightBackground();
    var rightBackgroundGetter = rightBackground.getWidth;
    var rightBackgroundSetter = rightBackground.setWidth;
    var rightBackgroundPosGetter = rightBackground.getX;
    var rightBackgroundPosSetter = rightBackground.setX;

    if (this.isVertical())
      var timelineSize = this.Height;
    else
      timelineSize = this.Width;
    this.animateProperty(animator, rightBackground, rightBackgroundGetter, rightBackgroundSetter, timelineSize - rightStart);
    this.animateProperty(animator, rightBackground, rightBackgroundPosGetter, rightBackgroundPosSetter, rightStart);

    if (dvt.OverviewUtils.supportsTouch() && !this.isFeatureOff('zoom'))
    {
      var handleStart = this.getHandleStart();
      var leftBackgroundHandle = this.getLeftBackgroundHandle();
      var leftBackgroundHandleGetter = leftBackgroundHandle.getX;
      var leftBackgroundHandleSetter = leftBackgroundHandle.setX;
      var rightBackgroundHandle = this.getRightBackgroundHandle();
      var rightBackgroundHandleGetter = rightBackgroundHandle.getX;
      var rightBackgroundHandleSetter = rightBackgroundHandle.setX;

      this.animateProperty(animator, leftBackgroundHandle, leftBackgroundHandleGetter, leftBackgroundHandleSetter, newLeft - handleStart);
      this.animateProperty(animator, rightBackgroundHandle, rightBackgroundHandleGetter, rightBackgroundHandleSetter, rightStart);
    }
  }

  if (animator != null)
    animator.play();
};

dvt.Overview.prototype.animateProperty = function(animator, obj, getter, setter, value)
{
  if (animator != null)
    animator.addProp(dvt.Animator.TYPE_NUMBER, obj, getter, setter, value);
  else
    setter.call(obj, value);
};
/************************** end sliding window animation *********************************************/


/************************** event handling *********************************************/
dvt.Overview.prototype.HandleShapeMouseOver = function(event)
{
  var drawable = this._findDrawable(event);
  // Return if no drawable is found
  if (!drawable || drawable.getId() == 'bg' || drawable.getId() == 'ocd')
    return;

  // if it is a label, show a tooltip of the label if it is truncated
  if (drawable.getId().substr(0, 5) == 'label' && (drawable instanceof dvt.OutputText || drawable instanceof dvt.BackgroundOutputText))
  {
    if (drawable.isTruncated())
      this.getCtx().getTooltipManager().showDatatip(event.pageX, event.pageY, drawable._rawText, '#000000');
    return;
  }

  if (this._resizeArrow != null && this.isHandle(drawable))
  {
    var relPos = this.getCtx().pageToStageCoords(event.pageX, event.pageY);
    relPos = this.stageToLocal(relPos);
    if (this.isVertical())
    {
      this._resizeArrow.setTranslate(relPos.x + 6, relPos.y - 10);
    }
    else
    {
      this._resizeArrow.setTranslate(relPos.x - 6, relPos.y - 20);
    }
    this._resizeArrow.setVisible(true);
  }

  if (drawable.getId() == 'window' || drawable.getId() == 'ftr' || drawable.getId() == 'arr' || this.isHandle(drawable))
  {
    if (this.isFlashEnvironment())
      this.setCursor('move');

    return;
  }

  return drawable;
};

dvt.Overview.prototype.HandleShapeMouseOut = function(event)
{
  // don't change cursor yet if we are in a moving state
  if (this._moveDrawable == null)
    this.setCursor('default');

  var drawable = this._findDrawable(event);
  if (drawable == null)
    return;

  // dismiss resize arrow
  if (this.isHandle(drawable) && this._resizeArrow != null)
    this._resizeArrow.setVisible(false);

  return drawable;
};

dvt.Overview.prototype.HandleShapeClick = function(event, pageX, pageY)
{
  // so that graph will not get a click event and clear selection
  event.stopPropagation();

  var drawable = this._findDrawable(event);

  // Return if no drawable is found
  if (!drawable || drawable.getId() == 'window' || this.isHandle(drawable))
    return;

  // if clicking anywhere on the overview scroll to the location
  if (drawable.getId() == 'bg' || drawable.getId().substr(0, 5) == 'label' || drawable.getId() == 'ocd' || drawable.getId() == 'lbg' || drawable.getId() == 'rbg')
  {
    if (pageX == undefined)
      pageX = event.pageX;
    if (pageY == undefined)
      pageY = event.pageY;

    var relPos = this.getCtx().pageToStageCoords(pageX, pageY);
    relPos = this.stageToLocal(relPos);
    if (this.isVertical())
    {
      var pos = relPos.y;
      var size = this.Height;
    }
    else
    {
      pos = relPos.x;
      size = this.Width;
    }

    // scroll sliding window
    var slidingWindow = this.getSlidingWindow();
    var newPos = pos - this.getRectSize(slidingWindow) / 2;
    this.animateSlidingWindow(newPos);

    if (this.isHorizontalRTL())
      pos = this.Width - pos;

    var time = this.getPositionDate(pos);

    // scroll timeline
    var evt = new dvt.OverviewEvent(dvt.OverviewEvent.SUBTYPE_SCROLL_TIME);
    evt.setTime(time);

    // make sure position is in bound
    newPos = Math.max(0, Math.min(newPos, size - this.getRectSize(slidingWindow)));

    if (this.isHorizontalRTL())
    {
      var newStartTime = this.getPositionDate(this.Width - (newPos + this.getRectSize(slidingWindow)));
      var newEndTime = this.getPositionDate(this.Width - newPos);
    }
    else
    {
      newStartTime = this.getPositionDate(newPos);
      newEndTime = this.getPositionDate(newPos + this.getRectSize(slidingWindow));
    }
    evt.setNewStartTime(newStartTime);
    evt.setNewEndTime(newEndTime);

    this.dispatchEvent(evt);

    return;
  }

  return drawable;
};

/**
 * Begins a drag pan of the overview window if applicable.
 * @param {dvt.BaseEvent} event The dispatched event to be processed by the object.
 * @param {number} compX The x coordinate of the event with relative to the stage.
 * @param {number} compY The y coordinate of the event with relative to the stage.
 * @return {boolean} true iff a drag pan operation is started, false otherwise.
 */
dvt.Overview.prototype.beginDragPan = function(event, compX, compY)
{
  var drawable = this._findDrawable(event);
  if (drawable != null && this.isMovable(drawable))
  {
    // if the drawable is the formatted time ranges, move the sliding window
    if (drawable.getId() == 'ftr' || drawable.getId() == 'sta')
      drawable = this.getSlidingWindow();

    this._initX = compX;
    this._initY = compY;

    if (this.isHandle(drawable))
    {
      var slidingWindow = this.getSlidingWindow();
      if (this.isHorizontalRTL())
      {
        this._oldEndPos = this.Width - slidingWindow.getX();
        this._oldStartPos = this._oldEndPos - slidingWindow.getWidth();
      }
      else
      {
        this._oldStartPos = slidingWindow.getX();
        this._oldEndPos = this._oldStartPos + slidingWindow.getWidth();
      }

      if (drawable.getParent().getId() == 'grpy')
        drawable = drawable.getParent();

      var drawableId = drawable.getId();

      if (drawableId == 'grpy')
      {
        drawable = slidingWindow.getChildBefore(drawable);
        drawableId = drawable.getId();
      }

      if (drawableId == 'lh' || drawableId == 'rh')
      {
        drawable = slidingWindow.getChildBefore(drawable);
        drawableId = drawable.getId();
      }

      if (drawableId == 'lbgrh')
        drawable = slidingWindow.getChildAt(0);

      if (drawableId == 'rbgrh')
        drawable = slidingWindow.getChildAt(slidingWindow.getNumChildren() - 3);

      // drawable should be lhb or rhb
      // temporarily increase size of handle to capture wider area and prevent cursor from changing
      // only do this for non touch since we won't run into cursor issue
      if (!dvt.OverviewUtils.supportsTouch())
      {
        if (this.isVertical())
        {
          drawable.setY(0 - dvt.Overview.HANDLE_PADDING_SIZE);
          drawable.setHeight((drawable.getHeight() + dvt.Overview.HANDLE_PADDING_SIZE) * 2);
        }
        else
        {
          drawable.setX(0 - dvt.Overview.HANDLE_PADDING_SIZE);
          drawable.setWidth((drawable.getWidth() + dvt.Overview.HANDLE_PADDING_SIZE) * 2);
        }
      }

      // temporily change the cursor of other areas of overview so that
      // the cursor won't change when it is moved outside of the handle
      this.overrideCursors(drawable.getCursor());
    }
    this._moveDrawable = drawable;

    // ask the overview peer to notify us if the release happened outside of the overview
    // see stopDragAction method
    var evt = new dvt.OverviewEvent(dvt.OverviewEvent.SUBTYPE_PRE_RANGECHANGE);
    this.dispatchEvent(evt);
    return true;
  }
  else
    return false;
};

// Change the cursor of the sliding window and the left and right backgrounds
dvt.Overview.prototype.overrideCursors = function(cursor)
{
  var slidingWindow = this.getSlidingWindow();
  if (slidingWindow != null)
    slidingWindow.setCursor(cursor);

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    var rightBackground = this.getRightBackground();
    if (leftBackground != null && rightBackground != null)
    {
      leftBackground.setCursor(cursor);
      rightBackground.setCursor(cursor);
    }
  }
};

// reset the cursor to what it was original state
dvt.Overview.prototype.resetCursors = function()
{
  var slidingWindow = this.getSlidingWindow();
  if (slidingWindow != null)
    slidingWindow.setCursor('move');

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    var rightBackground = this.getRightBackground();
    if (leftBackground != null && rightBackground != null)
    {
      leftBackground.setCursor('default');
      rightBackground.setCursor('default');
    }
  }
};

/**
 * Ends a drag pan of the overview window if applicable.
 */
dvt.Overview.prototype.endDragPan = function()
{
  if (this._moveDrawable != null)
  {
    if (this._moveDrawable.getId() == 'window')
      this.finishWindowDrag(0, 0);
    else if (this.isHandle(this._moveDrawable))
    {
      this.finishHandleDrag(0, 0);

      // reset the temporarily resized handle
      if (!dvt.OverviewUtils.supportsTouch())
      {
        if (this.isVertical())
        {
          this._moveDrawable.setY(0);
          this._moveDrawable.setHeight(this.getHandleSize());
        }
        else
        {
          this._moveDrawable.setX(0);
          this._moveDrawable.setWidth(this.getHandleSize());
        }
      }

      // reset cursors that were temporily changed
      this.resetCursors();
    }

    this._moveDrawable = null;
    this._initX = -1;
  }
};

/**
 * Continues a drag pan of the overview window if applicable.
 * @param {dvt.BaseEvent} event The dispatched event to be processed by the object.
 * @param {number} compX The x coordinate of the event with relative to the stage.
 * @param {number} compY The y coordinate of the event with relative to the stage.
 */
dvt.Overview.prototype.contDragPan = function(event, compX, compY)
{
  if (this._moveDrawable != null && this._initX != -1)
  {
    var diffX = compX - this._initX;
    var diffY = compY - this._initY;
    this._initX = compX;
    this._initY = compY;

    if (this._moveDrawable.getId() == 'window')
    {
      this.handleWindowDragPositioning(event, diffX, diffY);
    }
    else if (this._moveDrawable.getId() == 'lh' || this._moveDrawable.getId() == 'lhb')
    {
      this.handleLeftHandleDragPositioning(event, diffX, diffY);
    }
    else if (this._moveDrawable.getId() == 'rh' || this._moveDrawable.getId() == 'rhb')
    {
      this.handleRightHandleDragPositioning(event, diffX, diffY);
    }
  }
};

dvt.Overview.prototype.HandleTouchStart = function(event)
{
  var touches = event.touches;
  this._touchStartX = touches[0].pageX;
  this._touchStartY = touches[0].pageY;

  // see if this is a width change gesture
  if (touches.length == 2)
  {
    // only prevent default if it is a multi-touch gesture otherwise we don't get click callback
    event.preventDefault();

    this._touchStartX2 = touches[1].pageX;
    this._touchStartY2 = touches[1].pageY;

    if (Math.abs(this._touchStartY - this._touchStartY2) < 20)
      this._counter = 0;
    else
    {
      this._touchStartX = null;
      this._touchStartY = null;
      this._touchStartX2 = null;
      this._touchStartY2 = null;
    }
  }
};

dvt.Overview.prototype.HandleTouchMove = function(event)
{
  event.preventDefault();
  var touches = event.touches;

  // width change gesture
  if (this._touchStartX2 != null && this._touchStartY2 != null)
  {
    if (this._counter < 50)
    {
      // we can't do the dynamic update very often as it is very CPU intensive...
      this._counter++;
      return;
    }

    var deltaX = touches[1].pageX - this._touchStartX2;
    this.handleRightHandleDragPositioning(null, deltaX, 0);

    this._touchStartX2 = touches[1].pageX;

    // reset
    this._counter = 0;
  }
  else
  {
    var pageDx = Math.abs(this._touchStartX - touches[0].pageX);
    var pageDy = Math.abs(this._touchStartY - touches[0].pageY);
    // null out the var to signal that this is not a click event
    // need to check actual coord since Android delivers touch move event regardless
    if (pageDx > 3 || pageDy > 3)
    {
      this._touchStartX = null;
      this._touchStartY = null;
    }
  }
};

dvt.Overview.prototype.HandleTouchEnd = function(event)
{
  if (this._touchStartX2 != null && this._touchStartY2 != null)
  {
    // width change gesture
    this.finishHandleDrag(0, 0);
  }
  else
  {
    if (this._touchStartX != null && this._touchStartY != null)
      this.HandleShapeClick(event, this._touchStartX, this._touchStartY);
  }

  this._touchStartX = null;
  this._touchStartY = null;
  this._touchStartX2 = null;
  this._touchStartY2 = null;
};

// called externally from overview peer to stop all dragging if the drop action happened outside of the overview
dvt.Overview.prototype.stopDragAction = function()
{
  this.endDragPan();
};


/**
 * Handles keyboard event on the overview.
 * @param {Event} event the keyboard event
 */
dvt.Overview.prototype.HandleKeyDown = function(event) 
{
  var keyCode = event.keyCode;
  if (keyCode === dvt.KeyboardEvent.LEFT_ARROW || keyCode === dvt.KeyboardEvent.RIGHT_ARROW)
  {
    var func = event.shiftKey ? this.handleRightHandleDragPositioning : this.handleWindowDragPositioning;
    var delta = keyCode === dvt.KeyboardEvent.LEFT_ARROW ? -1 : 1;
    func.call(this, event, delta, delta);
  }
};


/**
 * Handles keyboard event on the overview.
 * @param {Event} event the keyboard event
 */
dvt.Overview.prototype.HandleKeyUp = function(event) 
{
  var keyCode = event.keyCode;
  if (keyCode === dvt.KeyboardEvent.LEFT_ARROW || keyCode === dvt.KeyboardEvent.RIGHT_ARROW)
  {
    var func = event.shiftKey ? this.finishHandleDrag : this.finishWindowDrag;
    var delta = keyCode === dvt.KeyboardEvent.LEFT_ARROW ? -1 : 1;
    func.call(this, delta, delta);
  }
};
/************************** end event handling *********************************************/

/***************************** window scrolling triggered by timeline *********************************************/
// called by peer
dvt.Overview.prototype.ScrollToStart = function()
{
  var slidingWindow = this.getSlidingWindow();
  var totalWidth = this.Width;
  if (this.isHorizontalRTL())
    this.setSlidingWindowPos(slidingWindow, totalWidth - this.getSlidingWindowSize(slidingWindow));
  else
    this.setSlidingWindowPos(slidingWindow, 0);

  this.ScrollTimeAxis();
};

dvt.Overview.prototype.ScrollToEnd = function()
{
  var slidingWindow = this.getSlidingWindow();
  var totalWidth = this.Width;
  if (this.isHorizontalRTL())
    this.setSlidingWindowPos(slidingWindow, 0);
  else
    this.setSlidingWindowPos(slidingWindow, totalWidth - this.getSlidingWindowSize(slidingWindow));

  this.ScrollTimeAxis();
};

dvt.Overview.prototype.ScrollByAmount = function(amount)
{
  var slidingWindow = this.getSlidingWindow();
  // todo: rounding makes this inaccurate at some point, perhaps a way to sync up the scroll pos with actual data points?
  var actualAmount = amount / this._increment;

  if (this.isVertical())
    var maxAmount = this.Height - slidingWindow.getHeight();
  else
  {
    maxAmount = this.Width - slidingWindow.getWidth();
    if (this.isRTL())
      actualAmount = 0 - actualAmount;
  }

  this.setSlidingWindowPos(slidingWindow, Math.min(maxAmount, this.getSlidingWindowPos(slidingWindow) + actualAmount));

  this.ScrollTimeAxis();
};

// called by timeline peer keyboard navigation methods
dvt.Overview.prototype.longScrollToPos = function(pos)
{
  var actualAmount = pos / this._increment;
  if (this.isHorizontalRTL())
    actualAmount = 0 - actualAmount;

  this.animateSlidingWindow(actualAmount);
};

// called by timeline peer on restore position after zoom
dvt.Overview.prototype.ScrollToPos = function(pos)
{
  var slidingWindow = this.getSlidingWindow();
  var actualAmount = pos / this._increment;
  if (this.isHorizontalRTL())
    actualAmount = 0 - actualAmount;

  this.setSlidingWindowPos(slidingWindow, actualAmount);
  this.ScrollTimeAxis();
};


/**
 * Called by apps to scroll the overview window to a particular time
 * @public
 */
dvt.Overview.prototype.scrollToTime = function(time)
{
  var pos = Math.max(0, dvt.OverviewUtils.getDatePosition(this._start, this._end, time, this._width));
  this.longScrollToPos(pos);
};
/************************** end window scrolling triggered by timeline *********************************************/


/***************************** window scrolling and resizing *********************************************/
dvt.Overview.prototype.handleWindowDragPositioning = function(event, deltaX, deltaY)
{
  this.fireScrollEvent(dvt.OverviewEvent.SUBTYPE_SCROLL_POS, deltaX, deltaY);
};

dvt.Overview.prototype.finishWindowDrag = function(deltaX, deltaY)
{
  this.fireScrollEvent(dvt.OverviewEvent.SUBTYPE_SCROLL_END, deltaX, deltaY);
};

dvt.Overview.prototype.fireScrollEvent = function(type, deltaX, deltaY)
{
  var slidingWindow = this.getSlidingWindow();
  var pos = this.getSlidingWindowPos(slidingWindow);
  var size = this.getRectSize(slidingWindow);
  var minPos = this.getMinimumPosition();
  var maxPos = this.getMaximumPosition();

  if (this.isVertical())
    var delta = deltaY;
  else
    delta = deltaX;

  if ((pos + delta) <= minPos)
  {
    // hit the top
    this.setSlidingWindowPos(slidingWindow, minPos);
    if (this.isHorizontalRTL())
      var scrollTo = dvt.OverviewEvent.END_POS;
    else
      scrollTo = dvt.OverviewEvent.START_POS;
  }
  else if (pos + size + delta >= maxPos)
  {
    // hit the bottom
    this.setSlidingWindowPos(slidingWindow, maxPos - size);
    if (this.isHorizontalRTL())
      scrollTo = dvt.OverviewEvent.START_POS;
    else
      scrollTo = dvt.OverviewEvent.END_POS;
  }
  else
  {
    this.setSlidingWindowPos(slidingWindow, pos + delta);
    if (this.isHorizontalRTL())
      scrollTo = (maxPos - size - pos - this._leftMargin) * this._increment;
    else
      scrollTo = (pos - this._leftMargin) * this._increment;
  }

  // sync window tima axis
  this.ScrollTimeAxis();

  // scroll timeline
  var evt = new dvt.OverviewEvent(type);
  evt.setPosition(scrollTo);

  if (this.isHorizontalRTL())
  {
    var newStartTime = this.getPositionDate(this.Width - (pos + this.getRectSize(slidingWindow)));
    var newEndTime = this.getPositionDate(this.Width - pos);
  }
  else
  {
    newStartTime = this.getPositionDate(pos);
    newEndTime = this.getPositionDate(pos + this.getRectSize(slidingWindow));
  }
  evt.setNewStartTime(newStartTime);
  evt.setNewEndTime(newEndTime);

  this.dispatchEvent(evt);
};

dvt.Overview.prototype.handleLeftHandleDragPositioning = function(event, deltaX, deltaY)
{
  this.handleLeftOrRightHandleDragPositioning(event, deltaX, deltaY, true);
};

dvt.Overview.prototype.handleRightHandleDragPositioning = function(event, deltaX, deltaY)
{
  this.handleLeftOrRightHandleDragPositioning(event, deltaX, deltaY, false);
};

dvt.Overview.prototype.handleLeftOrRightHandleDragPositioning = function(event, deltaX, deltaY, isLeft)
{
  var size = this.getOverviewSize();
  if (this.isVertical())
    var delta = deltaY;
  else
    delta = deltaX;

  if (delta == 0)
    return;

  var slidingWindow = this.getSlidingWindow();
  var windowPos = this.getSlidingWindowPos(slidingWindow);
  var windowSize = this.getSlidingWindowSize(slidingWindow);
  if (isLeft)
  {
    // make sure width of sliding window is larger than minimum
    if (windowSize - delta <= this.getMinimumWindowSize())
      return;

    // make sure position of left handle is not less than minimum (delta is negative when moving handle to the left)
    if (windowPos + delta <= this.getMinimumPosition())
      return;

    // window should only resize when the cursor is back to where the handle is
    if (this.isVertical())
      var relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).y;
    else
      relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).x;
    relPos = this.stageToLocal(relPos);

    if (delta > 0 && relPos <= windowPos)
      return;
    else if (delta < 0 && relPos >= windowPos)
      return;

    this.setSlidingWindowPos(slidingWindow, windowPos + delta);
    this.setSlidingWindowSize(slidingWindow, windowSize - delta);
  }
  else
  {
    // make sure width of sliding window is larger than minimum
    if (windowSize + delta <= this.getMinimumWindowSize())
      return;

    // make sure position of right handle is not less than minimum
    if (windowPos + windowSize + delta >= this.getMaximumPosition())
      return;

    // window should only resize when the cursor is back to where the handle is
    if (this.isVertical())
      relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).y;
    else
      relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).x;
    relPos = this.stageToLocal(relPos);

    if (delta > 0 && relPos <= windowPos + windowSize)
      return;
    else if (delta < 0 && relPos >= windowPos + windowSize)
      return;

    this.setSlidingWindowSize(slidingWindow, windowSize + delta);
  }

  // sync with time axis
  this.ScrollTimeAxis();

  // dynamically update contents of timeline (time axis, position of items etc.)
  var time = this.getPositionDate(this.getSlidingWindowSize(slidingWindow));

  // if we know the position and date we can calculate the new width
  var newSize = (size * (this._end - this._start)) / (time - this._start);

  // tell event handler that time range is changing
  if (this.isRangeChangingSupported())
  {
    var evt = new dvt.OverviewEvent(dvt.OverviewEvent.SUBTYPE_RANGECHANGING);
    evt.setNewSize(newSize);
    evt.setEndHandle(this.isHorizontalRTL() ? isLeft : !isLeft);
    if (isLeft)
      evt.setExpand((delta < 0));
    else
      evt.setExpand((delta > 0));

    if (this.isHorizontalRTL())
    {
      var newStartTime = this.getPositionDate(this.Width - (this.getSlidingWindowPos(slidingWindow) + this.getRectSize(slidingWindow)));
      var newEndTime = this.getPositionDate(this.Width - this.getSlidingWindowPos(slidingWindow));
    }
    else
    {
      newStartTime = this.getPositionDate(this.getSlidingWindowPos(slidingWindow));
      newEndTime = this.getPositionDate(this.getSlidingWindowPos(slidingWindow) + this.getRectSize(slidingWindow));
    }
    evt.setNewStartTime(newStartTime);
    evt.setNewEndTime(newEndTime);

    this.dispatchEvent(evt);
  }
};

// whether to fire a range changing event, which will be fired continuously when the sliding window is resize
dvt.Overview.prototype.isRangeChangingSupported = function()
{
  return true;
};

dvt.Overview.prototype.finishHandleDrag = function(deltaX, deltaY)
{
  var start = this._start;
  var end = this._end;
  var oldSize = this._width;
  var size = this.getOverviewSize();

  var slidingWindow = this.getSlidingWindow();
  var time = this.getPositionDate(this.getRectSize(slidingWindow));

  // if we know the position and date we can calculate the new width
  var newSize = (size * (end - start)) / (time - start);

  var oldStartTime = this.getPositionDate(this._oldStartPos);
  var oldEndTime = this.getPositionDate(this._oldEndPos);
  if (this.isHorizontalRTL())
  {
    var newStartTime = this.getPositionDate(this.Width - (this.getSlidingWindowPos(slidingWindow) + this.getRectSize(slidingWindow)));
    var newEndTime = this.getPositionDate(this.Width - this.getSlidingWindowPos(slidingWindow));
  }
  else
  {
    newStartTime = this.getPositionDate(this.getSlidingWindowPos(slidingWindow));
    newEndTime = this.getPositionDate(this.getSlidingWindowPos(slidingWindow) + this.getRectSize(slidingWindow));
  }

  // alert peer of time range change
  var evt = new dvt.OverviewEvent(dvt.OverviewEvent.SUBTYPE_RANGECHANGE);
  evt.setOldSize(oldSize);
  evt.setNewSize(newSize);
  evt.setOldStartTime(oldStartTime);
  evt.setOldEndTime(oldEndTime);
  evt.setNewStartTime(newStartTime);
  evt.setNewEndTime(newEndTime);
  this.dispatchEvent(evt);
};

// scroll time axis to match sliding window
// sync all parts of overview
dvt.Overview.prototype.ScrollTimeAxis = function()
{
  var slidingWindow = this.getSlidingWindow();
  var halfBorderWidth = dvt.Overview._DEFAULT_WINDOW_BORDER_WIDTH / 2;
  var left = this.getSlidingWindowPos(slidingWindow);
  var leftCenter = left + halfBorderWidth;
  var right = left + this.getSlidingWindowSize(slidingWindow);
  var rightCenter = right - halfBorderWidth;

  var leftHandle = this.getLeftHandle();
  var rightHandle = this.getRightHandle();
  var leftTopBar = this.getLeftTopBar();
  var rightTopBar = this.getRightTopBar();
  var bottomBar = this.getBottomBar();
  var topBar = this.getTopBar();

  this.setLinePos(leftHandle, leftCenter, leftCenter);
  this.setLinePos(rightHandle, rightCenter, rightCenter);
  this.setLinePos(leftTopBar, -1, left);
  this.setLinePos(rightTopBar, this.getLinePos1(rightHandle), -1);
  this.setLinePos(bottomBar, this.getLinePos1(leftHandle), this.getLinePos1(rightHandle));
  this.setLinePos(topBar, this.getLinePos1(leftHandle), this.getLinePos1(rightHandle));
};
/**************************end window scrolling and resizing *********************************************/


/**
 * Dispatches the event to the callback function.  This enables callback function on the peer.
 * @param {object} event The event to be dispatched.
 */
dvt.Overview.prototype.dispatchEvent = function(event) 
{
  dvt.EventDispatcher.dispatchEvent(this._callback, this._callbackObj, this, event);
};

/**
 * @override
 */
dvt.Overview.prototype.destroy = function() {
  // Remove listeners
  if (this.EventManager)
  {
    this.EventManager.removeListeners(this);
    this.EventManager.destroy();
    this.EventManager = null;
  }

  if (dvt.OverviewUtils.supportsTouch())
  {
    this.removeEvtListener(dvt.TouchEvent.TOUCHSTART, this.HandleTouchStart, false, this);
    this.removeEvtListener(dvt.TouchEvent.TOUCHMOVE, this.HandleTouchMove, false, this);
    this.removeEvtListener(dvt.TouchEvent.TOUCHEND, this.HandleTouchEnd, false, this);
    this.removeEvtListener(dvt.MouseEvent.CLICK, this.HandleShapeClick, false, this);
  }
  else
  {
    this.removeEvtListener(dvt.MouseEvent.MOUSEOVER, this.HandleShapeMouseOver, false, this);
    this.removeEvtListener(dvt.MouseEvent.MOUSEOUT, this.HandleShapeMouseOut, false, this);
    this.removeEvtListener(dvt.MouseEvent.CLICK, this.HandleShapeClick, false, this);
    this.removeEvtListener(dvt.KeyboardEvent.KEYDOWN, this.HandleKeyDown, false, this);
    this.removeEvtListener(dvt.KeyboardEvent.KEYUP, this.HandleKeyUp, false, this);
  }

  // Call super last during destroy
  dvt.Overview.superclass.destroy.call(this);
};
/**
 * Overview JSON Parser
 * @param {dvt.Overview} overview The owning Overview component.
 * @class
 * @constructor
 * @extends {dvt.Obj}
 */
var DvtOverviewParser = function(view) 
{
  this.Init(view);
};

dvt.Obj.createSubclass(DvtOverviewParser, dvt.Obj);

DvtOverviewParser.prototype.Init = function(view) 
{
  this._view = view;
};


/**
 * Parses the JSON object and returns the root node of the timeRangeSelector
 * @param {data} JSON object describing the component.
 * @return {object} An object containing the parsed properties
 */
DvtOverviewParser.prototype.parse = function(data) 
{
  // for now all the JSON contains should be options and no data, that could change in the future.
  var options = data;

  var ret = this.ParseRootAttributes(options);
  return ret;
};


/**
 * Parses the attributes on the root node.
 * @param {dvt.XmlNode} xmlNode The xml node defining the root
 * @return {object} An object containing the parsed properties
 * @protected
 */
DvtOverviewParser.prototype.ParseRootAttributes = function(options) 
{
  // The object that will be populated with parsed values and returned
  var ret = new Object();

  // animation related options
  ret.animationOnClick = options['animationOnClick'];

  if (options['startTime'] != null)
    ret.start = options['startTime'];
  if (options['endTime'] != null)
    ret.end = options['endTime'];

  // start and end time are MANDATORY and start time must be before end time
  if (ret.start == null)
    ret.start = (new Date()).getTime();
  if (ret.end == null || ret.end <= ret.start)
    ret.end = ret.start + 1000 * 60 * 60 * 24;

  if (options['currentTime'] != null)
    ret.currentTime = options['currentTime'];
  if (options['initialFocusTime'] != null)
    ret.initialFocusTime = options['initialFocusTime'];

  ret.orientation = 'horizontal';
  if (options['orientation'] != null)
    ret.orientation = options['orientation'];

  ret.featuresOff = options['featuresOff'];
  ret.minimumWindowSize = options['minimumWindowSize'];
  ret.leftMargin = options['leftMargin'];
  ret.rightMargin = options['rightMargin'];

  // the time where the viewport of the associated view ends and the width is also MANDATORY
  if (options['viewportEndTime'] != null)
  {
    var viewportEndTime = options['viewportEndTime'];
    var viewportStartTime = ret.start;

    // if viewport start time is specified
    if (options['viewportStartTime'] != null && options['viewportStartTime'] < viewportEndTime)
      viewportStartTime = options['viewportStartTime'];

    // calculate the overall width of the container (i.e. timeline/chart)
    // if viewportEndPos wasn't specified, use width of overview, this basically assumes the width of the overview is
    // the same as the width of the view that the overview is associated with (timeline or chart)
    if (options['viewportEndPos'] != null)
      ret.width = this.calculateWidth(ret.start, ret.end, viewportStartTime, viewportEndTime, options['viewportEndPos']);
    else
      ret.width = this.calculateWidth(ret.start, ret.end, viewportStartTime, viewportEndTime, this._view.Width);

    ret.renderStart = viewportStartTime;
  }
  else
    ret.renderStart = ret.start;

  if (ret.width == 0)
    ret.width = 1000; // just some arbitrary default...

  ret.overviewPosition = 'below';
  ret.selectionMode = 'none';
  ret.isRtl = dvt.Agent.isRightToLeft(this._view.getCtx()).toString();
  if (options['rtl'] != null)
    ret.isRtl = options['rtl'].toString();

  // should come from skin
  ret.handleFillColor = '#FFFFFF';
  ret.handleTextureColor = '#B3C6DB';
  ret.windowBackgroundColor = '#FFFFFF';
  ret.windowBackgroundAlpha = 1;
  ret.windowBorderTopStyle = 'solid';
  ret.windowBorderRightStyle = 'solid';
  ret.windowBorderBottomStyle = 'solid';
  ret.windowBorderLeftStyle = 'solid';
  ret.windowBorderTopColor = '#4F4F4F';
  ret.windowBorderRightColor = '#4F4F4F';
  ret.windowBorderBottomColor = '#4F4F4F';
  ret.windowBorderLeftColor = '#4F4F4F';
  ret.overviewBackgroundColor = '#E6ECF3';
  ret.currentTimeIndicatorColor = '#C000D1';
  ret.timeIndicatorColor = '#BCC7D2';
  ret.timeAxisBarColor = '#e5e5e5';
  ret.timeAxisBarOpacity = 1;
  ret.leftFilterPanelColor = '#FFFFFF';
  ret.leftFilterPanelAlpha = 0.7;
  ret.rightFilterPanelColor = '#FFFFFF';
  ret.rightFilterPanelAlpha = 0.7;

  // apply any styles overrides
  if (options['style'] != null)
  {
    if (options['style']['handleFillColor'] != null)
      ret.handleFillColor = options['style']['handleFillColor'];

    if (options['style']['handleTextureColor'] != null)
      ret.handleTextureColor = options['style']['handleTextureColor'];

    if (options['style']['handleBackgroundImage'] != null)
      ret.handleBackgroundImage = options['style']['handleBackgroundImage'];

    if (options['style']['handleWidth'] != null)
      ret.handleWidth = options['style']['handleWidth'];

    if (options['style']['handleHeight'] != null)
      ret.handleHeight = options['style']['handleHeight'];

    if (options['style']['windowBackgroundColor'] != null)
      ret.windowBackgroundColor = options['style']['windowBackgroundColor'];

    if (options['style']['windowBackgroundAlpha'] != null)
      ret.windowBackgroundAlpha = options['style']['windowBackgroundAlpha'];

    if (options['style']['windowBorderTopStyle'] != null)
      ret.windowBorderTopStyle = options['style']['windowBorderTopStyle'];

    if (options['style']['windowBorderRightStyle'] != null)
      ret.windowBorderRightStyle = options['style']['windowBorderRightStyle'];

    if (options['style']['windowBorderBottomStyle'] != null)
      ret.windowBorderBottomStyle = options['style']['windowBorderBottomStyle'];

    if (options['style']['windowBorderLeftStyle'] != null)
      ret.windowBorderLeftStyle = options['style']['windowBorderLeftStyle'];

    if (options['style']['windowBorderTopColor'] != null)
      ret.windowBorderTopColor = options['style']['windowBorderTopColor'];

    if (options['style']['windowBorderRightColor'] != null)
      ret.windowBorderRightColor = options['style']['windowBorderRightColor'];

    if (options['style']['windowBorderBottomColor'] != null)
      ret.windowBorderBottomColor = options['style']['windowBorderBottomColor'];

    if (options['style']['windowBorderLeftColor'] != null)
      ret.windowBorderLeftColor = options['style']['windowBorderLeftColor'];

    if (options['style']['overviewBackgroundColor'] != null)
      ret.overviewBackgroundColor = options['style']['overviewBackgroundColor'];

    if (options['style']['currentTimeIndicatorColor'] != null)
      ret.currentTimeIndicatorColor = options['style']['currentTimeIndicatorColor'];

    if (options['style']['timeIndicatorColor'] != null)
      ret.timeIndicatorColor = options['style']['timeIndicatorColor'];

    if (options['style']['leftFilterPanelColor'] != null)
      ret.leftFilterPanelColor = options['style']['leftFilterPanelColor'];

    if (options['style']['leftFilterPanelAlpha'] != null)
      ret.leftFilterPanelAlpha = options['style']['leftFilterPanelAlpha'];

    if (options['style']['rightFilterPanelColor'] != null)
      ret.rightFilterPanelColor = options['style']['rightFilterPanelColor'];

    if (options['style']['rightFilterPanelAlpha'] != null)
      ret.rightFilterPanelAlpha = options['style']['rightFilterPanelAlpha'];
  }

  return ret;
};

// convinient method to calculate the width based on start time/end time and viewport end time
DvtOverviewParser.prototype.calculateWidth = function(startTime, endTime, viewportStartTime, viewportEndTime, viewportEndPos)
{
  var number = viewportEndPos * (endTime - startTime);
  var denominator = (viewportEndTime - viewportStartTime);
  if (number == 0 || denominator == 0)
    return 0;

  return number / denominator;
};
/**
 * Encapsulates an event fired by Overview
 * @param {string} type The type of event fired by Overview
 * @class
 * @constructor
 */
dvt.OverviewEvent = function(type) {
  this.Init(dvt.OverviewEvent.TYPE);
  this._subtype = type;
};

dvt.Obj.createSubclass(dvt.OverviewEvent, dvt.BaseComponentEvent);

dvt.OverviewEvent.TYPE = 'overview';

// fired when user initiate range change
dvt.OverviewEvent.SUBTYPE_PRE_RANGECHANGE = 'dropCallback';

// fired when user clicks on an empty area which cause overview to scroll to where user clicks
dvt.OverviewEvent.SUBTYPE_SCROLL_TIME = 'scrollTime';
// fired when user scrolls the overview window
dvt.OverviewEvent.SUBTYPE_SCROLL_POS = 'scrollPos';
// fired when user finish scrolling the overview window
dvt.OverviewEvent.SUBTYPE_SCROLL_END = 'scrollEnd';
// fired when user finish resizing the overview window
dvt.OverviewEvent.SUBTYPE_RANGECHANGE = 'rangeChange';
// fired when user resizes the overview window
dvt.OverviewEvent.SUBTYPE_RANGECHANGING = 'rangeChanging';

// keys to look up value
dvt.OverviewEvent.TIME_KEY = 'time';
dvt.OverviewEvent.POS_KEY = 'pos';

dvt.OverviewEvent.OLD_SIZE_KEY = 'oldSize';
dvt.OverviewEvent.NEW_SIZE_KEY = 'newSize';
dvt.OverviewEvent.OLD_START_TIME_KEY = 'oldStartTime';
dvt.OverviewEvent.NEW_START_TIME_KEY = 'newStartTime';
dvt.OverviewEvent.OLD_END_TIME_KEY = 'oldEndTime';
dvt.OverviewEvent.NEW_END_TIME_KEY = 'newEndTime';

dvt.OverviewEvent.EXPAND_KEY = 'expand';
dvt.OverviewEvent.END_HANDLE_KEY = 'endHandle';

dvt.OverviewEvent.START_POS = -1;
dvt.OverviewEvent.END_POS = -2;

dvt.OverviewEvent.prototype.getSubType = function() 
{
  return this._subtype;
};


/****** scroll to time **************/
dvt.OverviewEvent.prototype.setTime = function(time) 
{
  this.addParam(dvt.OverviewEvent.TIME_KEY, time);
};

dvt.OverviewEvent.prototype.getTime = function() 
{
  return this.getParamValue(dvt.OverviewEvent.TIME_KEY);
};


/*********** range change ************/
dvt.OverviewEvent.prototype.setOldSize = function(oldSize) 
{
  this.addParam(dvt.OverviewEvent.OLD_SIZE_KEY, oldSize);
};

dvt.OverviewEvent.prototype.getOldSize = function() 
{
  return this.getParamValue(dvt.OverviewEvent.OLD_SIZE_KEY);
};

dvt.OverviewEvent.prototype.setNewSize = function(newSize) 
{
  this.addParam(dvt.OverviewEvent.NEW_SIZE_KEY, newSize);
};

dvt.OverviewEvent.prototype.getNewSize = function() 
{
  return this.getParamValue(dvt.OverviewEvent.NEW_SIZE_KEY);
};

dvt.OverviewEvent.prototype.setOldStartTime = function(oldStartTime) 
{
  this.addParam(dvt.OverviewEvent.OLD_START_TIME_KEY, oldStartTime);
};

dvt.OverviewEvent.prototype.getOldStartTime = function() 
{
  return this.getParamValue(dvt.OverviewEvent.OLD_START_TIME_KEY);
};

dvt.OverviewEvent.prototype.setNewStartTime = function(newStartTime) 
{
  this.addParam(dvt.OverviewEvent.NEW_START_TIME_KEY, newStartTime);
};

dvt.OverviewEvent.prototype.getNewStartTime = function() 
{
  return this.getParamValue(dvt.OverviewEvent.NEW_START_TIME_KEY);
};

dvt.OverviewEvent.prototype.setOldEndTime = function(oldEndTime) 
{
  this.addParam(dvt.OverviewEvent.OLD_END_TIME_KEY, oldEndTime);
};

dvt.OverviewEvent.prototype.getOldEndTime = function() 
{
  return this.getParamValue(dvt.OverviewEvent.OLD_END_TIME_KEY);
};

dvt.OverviewEvent.prototype.setNewEndTime = function(newEndTime) 
{
  this.addParam(dvt.OverviewEvent.NEW_END_TIME_KEY, newEndTime);
};

dvt.OverviewEvent.prototype.getNewEndTime = function() 
{
  return this.getParamValue(dvt.OverviewEvent.NEW_END_TIME_KEY);
};


/*********** range changing ************/
dvt.OverviewEvent.prototype.setExpand = function(expand) 
{
  this.addParam(dvt.OverviewEvent.EXPAND_KEY, expand);
};

dvt.OverviewEvent.prototype.isExpand = function() 
{
  return this.getParamValue(dvt.OverviewEvent.EXPAND_KEY);
};

dvt.OverviewEvent.prototype.setEndHandle = function(endHandle) 
{
  this.addParam(dvt.OverviewEvent.END_HANDLE_KEY, endHandle);
};

dvt.OverviewEvent.prototype.isEndHandle = function() 
{
  return this.getParamValue(dvt.OverviewEvent.END_HANDLE_KEY);
};


/************* scroll to pos ***************/
dvt.OverviewEvent.prototype.setPosition = function(pos) 
{
  this.addParam(dvt.OverviewEvent.POS_KEY, pos);
};

dvt.OverviewEvent.prototype.getPosition = function() 
{
  return this.getParamValue(dvt.OverviewEvent.POS_KEY);
};
/**
 * Overview event manager.
 * @param {dvt.Overview} overview The owning dvt.Overview.
 * @extends {dvt.EventManager}
 * @constructor
 */
var DvtOverviewEventManager = function(overview)
{
  this.Init(overview.getCtx(), overview.processEvent, overview);
  this._overview = overview;
};

dvt.Obj.createSubclass(DvtOverviewEventManager, dvt.EventManager);

/**
 * @override
 */
DvtOverviewEventManager.prototype.addListeners = function(displayable)
{
  DvtOverviewEventManager.superclass.addListeners.call(this, displayable);
  dvt.SvgDocumentUtils.addDragListeners(this._overview, this._onDragStart, this._onDragMove, this._onDragEnd, this);
};

/**
 * Drag start callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean} Whether drag is initiated.
 * @private
 */
DvtOverviewEventManager.prototype._onDragStart = function(event)
{
  if (dvt.Agent.isTouchDevice())
    return this._onTouchDragStart(event);
  else
    return this._onMouseDragStart(event);
};

/**
 * Drag move callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean}
 * @private
 */
DvtOverviewEventManager.prototype._onDragMove = function(event)
{
  if (dvt.Agent.isTouchDevice())
    return this._onTouchDragMove(event);
  else
    return this._onMouseDragMove(event);
};

/**
 * Drag end callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean}
 * @private
 */
DvtOverviewEventManager.prototype._onDragEnd = function(event)
{
  if (dvt.Agent.isTouchDevice())
    return this._onTouchDragEnd(event);
  else
    return this._onMouseDragEnd(event);
};

/**
 * Return the relative position relative to the stage, based on the cached stage absolute position.
 * @param {number} pageX
 * @param {number} pageY
 * @return {dvt.Point} The relative position.
 * @private
 */
DvtOverviewEventManager.prototype._getRelativePosition = function(pageX, pageY) {
  if (!this._stageAbsolutePosition)
    this._stageAbsolutePosition = this._context.getStageAbsolutePosition();

  return new dvt.Point(pageX - this._stageAbsolutePosition.x, pageY - this._stageAbsolutePosition.y);
};

/**
 * Mouse drag start callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean} Whether drag is initiated.
 * @private
 */
DvtOverviewEventManager.prototype._onMouseDragStart = function(event)
{
  if (event.button != dvt.MouseEvent.RIGHT_CLICK_BUTTON)
  {
    var relPos = this._getRelativePosition(event.pageX, event.pageY);
    dvt.EventManager.consumeEvent(event);
    // since event propagation is stopped, need to manually set focus
    var stage = this.getCtx().getStage();
    var wrappingDiv = stage.getSVGRoot().parentNode;
    wrappingDiv.focus();
    return this._overview.beginDragPan(event, relPos.x, relPos.y);
  }
  return false;
};

/**
 * Mouse drag move callback.
 * @param {dvt.BaseEvent} event
 * @private
 */
DvtOverviewEventManager.prototype._onMouseDragMove = function(event)
{
  var relPos = this._getRelativePosition(event.pageX, event.pageY);
  event.stopPropagation();
  this._overview.contDragPan(event, relPos.x, relPos.y);
  return true;
};

/**
 * Mouse drag end callback.
 * @param {dvt.BaseEvent} event
 * @private
 */
DvtOverviewEventManager.prototype._onMouseDragEnd = function(event)
{
  event.stopPropagation();
  this._overview.endDragPan();
  // Clear the stage absolute position cache
  this._stageAbsolutePosition = null;
};

/**
 * Touch drag start callback.
 * @param {dvt.BaseEvent} event
 * @return {boolean} Whether drag is initiated.
 * @private
 */
DvtOverviewEventManager.prototype._onTouchDragStart = function(event)
{
  var touches = event.touches;
  event.stopPropagation();
  if (touches.length == 1)
  {
    var relPos = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
    event.preventDefault();
    return this._overview.beginDragPan(event, relPos.x, relPos.y);
  }
  return false;
};

/**
 * Touch drag move callback.
 * @param {dvt.BaseEvent} event
 * @private
 */
DvtOverviewEventManager.prototype._onTouchDragMove = function(event)
{
  var touches = event.touches;
  // make sure this is a single touch and not a multi touch
  if (touches.length == 1)
  {
    var relPos = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
    this._overview.contDragPan(event, relPos.x, relPos.y);
    event.preventDefault();
  }
  event.stopPropagation();
};

/**
 * Touch drag end callback.
 * @param {dvt.BaseEvent} event
 * @private
 */
DvtOverviewEventManager.prototype._onTouchDragEnd = function(event)
{
  this._overview.endDragPan();
  dvt.EventManager.consumeEvent(event);

  // Clear the stage absolute position cache
  this._stageAbsolutePosition = null;
};
dvt.exportProperty(dvt, 'Overview', dvt.Overview);
dvt.exportProperty(dvt.Overview.prototype, 'render', dvt.Overview.prototype.render);
})(dvt);

  return dvt;
});
