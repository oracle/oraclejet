/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['./DvtToolkit'], function(dvt) {
  "use strict";
  // Internal use only.  All APIs and functionality are subject to change at any time.

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
(function(dvt) {

/**
 * @license
 * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
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
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
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
 * Initializes the view.
 * @param {dvt.Context} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @protected
 */
dvt.Overview.prototype.Init = function(context, callback, callbackObj)
{
  dvt.Overview.superclass.Init.call(this, context);

  // Create the defaults object
  this.initDefaults();

  this._callback = callback;
  this._callbackObj = callbackObj;

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
    }
  }
};

/**
 * Initializes the component defaults.
 */
dvt.Overview.prototype.initDefaults = function()
{
  this.Defaults = new DvtOverviewDefaults();
};

/**
 * To support Chart zoom and scroll feature
 * Ability to set the overview window start and end pos
 * @param x1 - the viewport x1 value
 * @param x2 - the viewport x2 value
 * @param y1 - the viewport y1 value
 * @param y2 - the viewport y2 value
 */
dvt.Overview.prototype.setViewportRange = function(x1, x2, y1, y2)
{
  if (x1 != null && x2 != null)
  {
    var x1Pos = this.getDateXPosition(x1);
    var x2Pos = this.getDateXPosition(x2);

    // make sure it's in bounds
    if (x2Pos > x1Pos)
    {
      if (x1Pos < this.getMinimumPositionX())
        x1Pos = this.getMinimumPositionX();
      if (x2Pos > this.getMaximumPositionX())
        x2Pos = this.getMaximumPositionX();

      var width = Math.max(x2Pos - x1Pos, this.getMinimumWindowWidth());
      var slidingWindow = this.getSlidingWindow();
      if (this.isRTL())
        this.setSlidingWindowPosX(slidingWindow, this.Width - (x1Pos + width));
      else
        this.setSlidingWindowPosX(slidingWindow, x1Pos);

      DvtOverviewRenderer._setSlidingWindowWidth(this, slidingWindow, width);
    }
  }
  if (y1 != null && y2 != null)
  {
    var y1Pos = this.getDateYPosition(y1);
    var y2Pos = this.getDateYPosition(y2);

    // make sure it's in bounds
    if (y2Pos > y1Pos)
    {
      if (y1Pos < this.getMinimumPositionY())
        y1Pos = this.getMinimumPositionY();
      if (y2Pos > this.getMaximumPositionY())
        y2Pos = this.getMaximumPositionY();

      var height = Math.max(y2Pos - y1Pos, this.getMinimumWindowHeight());
      slidingWindow = this.getSlidingWindow();
      this.setSlidingWindowPosY(slidingWindow, y1Pos);

      DvtOverviewRenderer._setSlidingWindowHeight(this, slidingWindow, height);
    }
  }
  DvtOverviewRenderer._updateBorderAroundSlidingWindow(this);
};

/**
 * Checks whether a particular feature is turned off
 */
dvt.Overview.prototype.isFeatureOff = function(feature)
{
  if (this._featuresOff == null)
    return false;

  return (this._featuresOff.indexOf(feature) != -1);
};


/**
 * Checks whether sliding window should animate when move
 */
dvt.Overview.prototype.isAnimationOnClick = function()
{
  return !(this._animationOnClick === 'off');
};


/**
 * Renders the component with the specified data.  If no data is supplied to a component
 * that has already been rendered, the component will be rerendered to the specified size.
 * @param {obj} obj The json object describing the component.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
dvt.Overview.prototype.render = function(obj, width, height)
{
  // Store the size
  if (width != null && height != null)
  {
    this.Width = width;
    this.Height = height;
  }

  // TODO: update this resize code for standalone overview when implemented
  if (obj == null)
  {
    var slidingWindow = this.getSlidingWindow();

    // sets the correct time where the sliding window starts
    if (this._xMin && this._xMax)
    {
      var slidingWindowPos = this.getSlidingWindowPosX(slidingWindow);
      if (slidingWindow != null && slidingWindowPos != 0)
      {
        // note this.Width references the old width
        this._x1 = dvt.OverviewUtils.getPositionDate(this._xMin, this._xMax, slidingWindowPos, this.Width);
      }
    }
    if (this._yMin && this._yMax)
    {
      slidingWindowPos = this.getSlidingWindowPosY(slidingWindow);
      if (slidingWindow != null && slidingWindowPos != 0)
      {
        // note this.Height references the old height
        this._y1 = dvt.OverviewUtils.getPositionDate(this._yMin, this._yMax, slidingWindowPos, this.Height);
      }
    }

    // clean out existing elements since they will be regenerate
    this.removeChildren();
  }
  else
  {
    this.SetOptions(obj);

    // If new data options are provided, parse it and apply the properties
    var props = this.Parse(this.Options);
    this._applyParsedProperties(props);
  }

  DvtOverviewRenderer.renderOverview(this);
};

/**
 * @override
 */
dvt.Overview.prototype.SetOptions = function(options)
{
  // Combine the user options with the defaults and store
  this.Options = this.Defaults.calcOptions(options);
};

dvt.Overview.prototype.getParser = function(obj)
{
  return new dvt.OverviewParser(this);
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
  this._xMin = props.xMin;
  this._xMax = props.xMax;
  this._x1 = props.x1;
  this._x2 = props.x2;
  this._yMin = props.yMin;
  this._yMax = props.yMax;
  this._y1 = props.y1;
  this._y2 = props.y2;
  this._currentTime = props.currentTime;
  this._animationOnClick = props.animationOnClick;

  // chart specific options: left and right margin
  this._leftMargin = Math.max(0, props.leftMargin);
  this._rightMargin = Math.max(0, props.rightMargin);
  if (isNaN(this._leftMargin))
    this._leftMargin = 0;
  if (isNaN(this._rightMargin))
    this._rightMargin = 0;

  this._orientation = props.orientation;
  this._isRtl = props.isRtl;
  if (props.featuresOff != null)
    this._featuresOff = props.featuresOff.split(' ');
  if (props.minimumWindowSize != null && props.minimumWindowSize > 0)
    this._minimumWindowSize = props.minimumWindowSize;

  this._timeAxisInfo = props.timeAxisInfo;
  if (props.timeAxisInfo != null)
    this._ticks = this._timeAxisInfo.ticks;
  this._formattedTimeRanges = props.formattedTimeRanges;

  this._borderTopStyle = DvtOverviewStyleUtils.getBorderTopStyle(this.Options);
  this._borderTopColor = DvtOverviewStyleUtils.getBorderTopColor(this.Options);

  this._windowBackgroundColor = DvtOverviewStyleUtils.getWindowBackgroundColor(this.Options);
  this._windowBackgroundAlpha = DvtOverviewStyleUtils.getWindowBackgroundAlpha(this.Options);
  this._windowBorderTopStyle = DvtOverviewStyleUtils.getWindowBorderTopStyle(this.Options);
  this._windowBorderRightStyle = DvtOverviewStyleUtils.getWindowBorderRightStyle(this.Options);
  this._windowBorderBottomStyle = DvtOverviewStyleUtils.getWindowBorderBottomStyle(this.Options);
  this._windowBorderLeftStyle = DvtOverviewStyleUtils.getWindowBorderLeftStyle(this.Options);
  this._windowBorderTopColor = DvtOverviewStyleUtils.getWindowBorderTopColor(this.Options);
  this._windowBorderRightColor = DvtOverviewStyleUtils.getWindowBorderRightColor(this.Options);
  this._windowBorderBottomColor = DvtOverviewStyleUtils.getWindowBorderBottomColor(this.Options);
  this._windowBorderLeftColor = DvtOverviewStyleUtils.getWindowBorderLeftColor(this.Options);

  this._handleTextureColor = DvtOverviewStyleUtils.getHandleTextureColor(this.Options);
  this._handleFillColor = DvtOverviewStyleUtils.getHandleFillColor(this.Options);
  this._horHandleBackgroundImage = DvtOverviewStyleUtils.getHandleBackgroundImage(this.Options, false);
  this._horHandleWidth = DvtOverviewStyleUtils.getHandleWidth(this.Options, false);
  this._horHandleHeight = DvtOverviewStyleUtils.getHandleHeight(this.Options, false);
  this._vertHandleBackgroundImage = DvtOverviewStyleUtils.getHandleBackgroundImage(this.Options, true);
  this._vertHandleWidth = DvtOverviewStyleUtils.getHandleWidth(this.Options, true);
  this._vertHandleHeight = DvtOverviewStyleUtils.getHandleHeight(this.Options, true);

  this._overviewBackgroundColor = DvtOverviewStyleUtils.getOverviewBackgroundColor(this.Options);
  this._currentTimeIndicatorColor = DvtOverviewStyleUtils.getCurrentTimeIndicatorColor(this.Options);
  this._timeIndicatorColor = DvtOverviewStyleUtils.getTimeIndicatorColor(this.Options);
  this._timeAxisBarColor = DvtOverviewStyleUtils.getTimeAxisBarColor(this.Options);
  this._timeAxisBarOpacity = DvtOverviewStyleUtils.getTimeAxisBarAlpha(this.Options);

  // chart specific options: left and right filter panels
  this._leftFilterPanelColor = DvtOverviewStyleUtils.getLeftFilterPanelColor(this.Options);
  this._leftFilterPanelAlpha = DvtOverviewStyleUtils.getLeftFilterPanelAlpha(this.Options);
  this._rightFilterPanelColor = DvtOverviewStyleUtils.getRightFilterPanelColor(this.Options);
  this._rightFilterPanelAlpha = DvtOverviewStyleUtils.getRightFilterPanelAlpha(this.Options);

  this._labelStyle = new dvt.CSSStyle('font-weight:bold');
};


/***************************** common helper methods *********************************************/

/**
 * Returns the horizontal pixel position corresponding to the given date.
 * @param {number} date The given date.
 */
dvt.Overview.prototype.getDateXPosition = function(date)
{
  return Math.max(this.getMinimumPositionX(), dvt.OverviewUtils.getDatePosition(this._xMin, this._xMax, date, this.getOverviewWidth()) + this._leftMargin);
};

/**
 * Returns the vertical pixel position corresponding to the given date.
 * @param {number} date The given date.
 */
dvt.Overview.prototype.getDateYPosition = function(date)
{
  return Math.max(this.getMinimumPositionY(), dvt.OverviewUtils.getDatePosition(this._yMin, this._yMax, date, this.getOverviewHeight()));
};

/**
 * Returns the date corresponding to the given horizontal pixel position.
 * @param {number} pos The given horizontal pixel position.
 */
dvt.Overview.prototype.getXPositionDate = function(pos)
{
  return dvt.OverviewUtils.getPositionDate(this._xMin, this._xMax, Math.max(this.getMinimumPositionX() - this._leftMargin, pos - this._leftMargin), this.getOverviewWidth());
};

/**
 * Returns the date corresponding to the given vertical pixel position.
 * @param {number} pos The given vertical pixel position.
 */
dvt.Overview.prototype.getYPositionDate = function(pos)
{
  return dvt.OverviewUtils.getPositionDate(this._yMin, this._yMax, Math.max(this.getMinimumPositionY(), pos), this.getOverviewHeight());
};

/**
 * Whether or not this is rendered in an RTL layout.
 */
dvt.Overview.prototype.isRTL = function()
{
  return this._isRtl == 'true';
};

/**
 * Whether or not this is a horizontal overview that is also rendered in an RTL layout..
 */
dvt.Overview.prototype.isHorizontalRTL = function()
{
  return (this.isRTL() && !this.isVertical());
};

/**
 * Whether or not this is a vertical overview.
 */
dvt.Overview.prototype.isVertical = function()
{
  return (this._orientation == 'vertical');
};

/**
 * Whether or not this overview is rendered 'above'.
 */
dvt.Overview.prototype.isOverviewAbove = function()
{
  return (this.Options['overviewPosition'] == 'above');
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

// returns the width of the overview, taking margins into account
dvt.Overview.prototype.getOverviewWidth = function()
{
  return this.Width - this._leftMargin - this._rightMargin;
};

// returns the width of the overview, taking margins into account
dvt.Overview.prototype.getOverviewHeight = function()
{
  return this.Height;
};

// return the minmum X position where the sliding window can reach
dvt.Overview.prototype.getMinimumPositionX = function()
{
  return this._leftMargin;
};

// return the minmum Y position where the sliding window can reach
dvt.Overview.prototype.getMinimumPositionY = function()
{
  return 0;
};

// return the maximum X position where the sliding window can reach
dvt.Overview.prototype.getMaximumPositionX = function()
{
  return this.Width - this._rightMargin;
};

// return the maximum Y position where the sliding window can reach
dvt.Overview.prototype.getMaximumPositionY = function()
{
  return this.Height;
};

// returns the minimum width of the sliding window
dvt.Overview.prototype.getMinimumWindowWidth = function()
{
  if (this._minWinSize != null)
    return this._minWinSize;
  else if (this._minimumWindowSize != null)
  {
    this._minWinSize = dvt.OverviewUtils.getDatePosition(this._xMin, this._xMax, this._xMin + this._minimumWindowSize, this.getOverviewWidth());
    return this._minWinSize;
  }
  else
    return dvt.Overview.MIN_WINDOW_SIZE;
};

// returns the minimum height of the sliding window
dvt.Overview.prototype.getMinimumWindowHeight = function()
{
  if (this._minWinSize != null)
    return this._minWinSize;
  else if (this._minimumWindowSize != null)
  {
    this._minWinSize = dvt.OverviewUtils.getDatePosition(this._yMin, this._yMax, this._yMin + this._minimumWindowSize, this.getOverviewHeight());
    return this._minWinSize;
  }
  else
    return dvt.Overview.MIN_WINDOW_SIZE;
};

dvt.Overview.prototype.getMaximumWindowWidth = function()
{
  return this.Width;
};

dvt.Overview.prototype.getMaximumWindowHeight = function()
{
  return this.Height;
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
  return (id == 'lh' || id == 'rh' || id == 'lhb' || id == 'rhb' || id == 'th' || id == 'bh' ||
          id == 'thb' || id == 'bhb' || id == 'hgrpy' || id == 'vgrpy' || id == 'lbgrh' || id == 'rbgrh' ||
          (drawable.getParent() != null && (drawable.getParent().getId() == 'hgrpy' || drawable.getParent().getId() == 'vgrpy')));
};

dvt.Overview.prototype.isLeftOrRightHandle = function(drawable)
{
  var id = drawable.getId();
  return (id == 'lh' || id == 'rh' || id == 'lhb' || id == 'rhb' ||
          id == 'hgrpy' || id == 'lbgrh' || id == 'rbgrh' ||
          (drawable.getParent() != null && drawable.getParent().getId() == 'hgrpy'));
};

dvt.Overview.prototype.isTopOrBottomHandle = function(drawable)
{
  var id = drawable.getId();
  return (id == 'th' || id == 'bh' || id == 'thb' || id == 'bhb' || id == 'vgrpy' ||
          (drawable.getParent() != null && drawable.getParent().getId() == 'vgrpy'));
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
 * Returns true if the background should be rendered.
 * By default it is rendered.
 * @protected
 */
dvt.Overview.prototype.isBackgroundRendered = function()
{
  return true;
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

dvt.Overview.prototype.getSlidingWindowWidth = function()
{
  if (this.isHorizontalScrollingEnabled())
  {
    var x1Pos = Math.max(this.getMinimumPositionX(), dvt.OverviewUtils.getDatePosition(this._xMin, this._xMax, this._x1, this.Width));
    var x2Pos = Math.min(this.getMaximumPositionX(), Math.max(this.getMinimumPositionX(), dvt.OverviewUtils.getDatePosition(this._xMin, this._xMax, this._x2, this.Width)));

    return (x2Pos - x1Pos);
  }
  else
    return this.Width;
};

dvt.Overview.prototype.getSlidingWindowHeight = function()
{
  if (this.isVerticalScrollingEnabled())
  {
    var y1Pos = Math.max(this.getMinimumPositionY(), dvt.OverviewUtils.getDatePosition(this._yMin, this._yMax, this._y1, this.Height));
    var y2Pos = Math.min(this.getMaximumPositionY(), Math.max(this.getMinimumPositionY(), dvt.OverviewUtils.getDatePosition(this._yMin, this._yMax, this._y2, this.Height)));

    return (y2Pos - y1Pos);
  }
  else
    return this.Height;
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
  return this._leftHandle;
};

dvt.Overview.prototype.getRightHandle = function()
{
  return this._rightHandle;
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

dvt.Overview.prototype.setLinePosX = function(line, x1, x2)
{
  if (x1 != -1)
    line.setX1(x1);
  if (x2 != -1)
    line.setX2(x2);
};

dvt.Overview.prototype.setLinePosY = function(line, y1, y2)
{
  if (y1 != -1)
    line.setY1(y1);
  if (y2 != -1)
    line.setY2(y2);
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

/***************************** end common helper methods *********************************************/


/***************************** marker creation and event handling *********************************************/

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

dvt.Overview.prototype.getSlidingWindowPosX = function(slidingWindow)
{
  return slidingWindow.getTranslateX();
};

dvt.Overview.prototype.getSlidingWindowPosY = function(slidingWindow)
{
  return slidingWindow.getTranslateY();
};

dvt.Overview.prototype.setSlidingWindowPosX = function(slidingWindow, xPos)
{
  xPos = Math.max(this.getMinimumPositionX(), xPos);
  slidingWindow.setTranslateX(xPos);

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    leftBackground.setWidth(xPos);
    var rightStart = xPos + this.getSlidingWindowSize(slidingWindow);
    var rightBackground = this.getRightBackground();
    rightBackground.setX(rightStart);
    rightBackground.setWidth(Math.max(0, this.Width - rightStart));

    // updates the background resize handle for touch
    if (dvt.OverviewUtils.supportsTouch() && !this.isFeatureOff('zoom'))
    {
      var handleStart = this.getHandleStart();
      var leftBackgroundHandle = this.getLeftBackgroundHandle();
      leftBackgroundHandle.setX(xPos - handleStart);
      var rightBackgroundHandle = this.getRightBackgroundHandle();
      rightBackgroundHandle.setX(rightStart);
    }
  }
};

dvt.Overview.prototype.setSlidingWindowPosY = function(slidingWindow, yPos)
{
  yPos = Math.max(this.getMinimumPositionY(), yPos);
  slidingWindow.setTranslateY(yPos);
};

dvt.Overview.prototype.getSlidingWindowSize = function(slidingWindow)
{
  return this.getRectSize(slidingWindow);
};

dvt.Overview.prototype.renderData = function(width, height)
{
};


/************************** sliding window animation *********************************************/
dvt.Overview.prototype.animateSlidingWindow = function(newX, newY)
{
  var slidingWindow = this.getSlidingWindow();

  // first check if sliding window moved or resized at all
  if ((newX == undefined || newX == this.getSlidingWindowPosX(slidingWindow)) &&
      (newY == undefined || newY == this.getSlidingWindowPosY(slidingWindow)))
    return;

  var leftHandle = this.getLeftHandle();
  var rightHandle = this.getRightHandle();
  var leftTopBar = this.getLeftTopBar();
  var rightTopBar = this.getRightTopBar();
  var bottomBar = this.getBottomBar();
  var topBar = this.getTopBar();

  var playAnimator = false;
  var animator = this.isAnimationOnClick() ? new dvt.Animator(this.getCtx(), 0.5, 0, dvt.Easing.linear) : null;

  if (this.isVerticalScrollingEnabled() && newY != null)
  {
    var posYGetter = slidingWindow.getTranslateY;
    var posYSetter = slidingWindow.setTranslateY;
    var leftHandleY1Getter = leftHandle.getY1;
    var leftHandleY1Setter = leftHandle.setY1;
    var leftHandleY2Getter = leftHandle.getY2;
    var leftHandleY2Setter = leftHandle.setY2;
    var rightHandleY1Getter = rightHandle.getY1;
    var rightHandleY1Setter = rightHandle.setY1;
    var rightHandleY2Getter = rightHandle.getY2;
    var rightHandleY2Setter = rightHandle.setY2;
    var bottomBarY1Getter = bottomBar.getY1;
    var bottomBarY1Setter = bottomBar.setY1;
    var bottomBarY2Getter = bottomBar.getY2;
    var bottomBarY2Setter = bottomBar.setY2;
    var topBarY1Getter = topBar.getY1;
    var topBarY1Setter = topBar.setY1;
    var topBarY2Getter = topBar.getY2;
    var topBarY2Setter = topBar.setY2;

    // make sure it doesn't go over
    var minPosY = this.getMinimumPositionY();
    var maxPosY = this.getMaximumPositionY();
    var slidingWindowHeight = slidingWindow.getHeight();
    newY = Math.max(minPosY, Math.min(maxPosY - slidingWindowHeight, newY));

    this.animateProperty(animator, slidingWindow, posYGetter, posYSetter, newY);

    if (!this.isVertical())
    {
      // left and right handles
      this.animateProperty(animator, leftHandle, leftHandleY1Getter, leftHandleY1Setter, newY);
      this.animateProperty(animator, leftHandle, leftHandleY2Getter, leftHandleY2Setter, newY + slidingWindowHeight);
      this.animateProperty(animator, rightHandle, rightHandleY1Getter, rightHandleY1Setter, newY);
      this.animateProperty(animator, rightHandle, rightHandleY2Getter, rightHandleY2Setter, newY + slidingWindowHeight);

      // top and bottom borders
      this.animateProperty(animator, bottomBar, bottomBarY1Getter, bottomBarY1Setter, newY + slidingWindowHeight);
      this.animateProperty(animator, topBar, topBarY1Getter, topBarY1Setter, newY);
      this.animateProperty(animator, bottomBar, bottomBarY2Getter, bottomBarY2Setter, newY + slidingWindowHeight);
      this.animateProperty(animator, topBar, topBarY2Getter, topBarY2Setter, newY);
    }
    else
    {
      // left and right handles
      this.animateProperty(animator, leftHandle, leftHandleY1Getter, leftHandleY1Setter, newY);
      this.animateProperty(animator, leftHandle, leftHandleY2Getter, leftHandleY2Setter, newY);
      this.animateProperty(animator, rightHandle, rightHandleY1Getter, rightHandleY1Setter, newY + slidingWindowHeight);
      this.animateProperty(animator, rightHandle, rightHandleY2Getter, rightHandleY2Setter, newY + slidingWindowHeight);

      // top and bottom borders
      this.animateProperty(animator, bottomBar, bottomBarY1Getter, bottomBarY1Setter, newY);
      this.animateProperty(animator, topBar, topBarY1Getter, topBarY1Setter, newY);
      this.animateProperty(animator, bottomBar, bottomBarY2Getter, bottomBarY2Setter, newY + slidingWindowHeight);
      this.animateProperty(animator, topBar, topBarY2Getter, topBarY2Setter, newY + slidingWindowHeight);

      // left and right top bar
      this.animateProperty(animator, leftTopBar, leftTopBar.getY2, leftTopBar.setY2, newY + 1);
      this.animateProperty(animator, rightTopBar, rightTopBar.getY1, rightTopBar.setY1, newY + slidingWindowHeight - 1);
    }

    playAnimator = true;
  }
  if (this.isHorizontalScrollingEnabled() && newX != null)
  {
    var posXGetter = slidingWindow.getTranslateX;
    var posXSetter = slidingWindow.setTranslateX;
    var leftHandleX1Getter = leftHandle.getX1;
    var leftHandleX1Setter = leftHandle.setX1;
    var leftHandleX2Getter = leftHandle.getX2;
    var leftHandleX2Setter = leftHandle.setX2;
    var rightHandleX1Getter = rightHandle.getX1;
    var rightHandleX1Setter = rightHandle.setX1;
    var rightHandleX2Getter = rightHandle.getX2;
    var rightHandleX2Setter = rightHandle.setX2;
    var bottomBarX1Getter = bottomBar.getX1;
    var bottomBarX1Setter = bottomBar.setX1;
    var bottomBarX2Getter = bottomBar.getX2;
    var bottomBarX2Setter = bottomBar.setX2;
    var topBarX1Getter = topBar.getX1;
    var topBarX1Setter = topBar.setX1;
    var topBarX2Getter = topBar.getX2;
    var topBarX2Setter = topBar.setX2;

    // make sure it doesn't go over
    var minPosX = this.getMinimumPositionX();
    var maxPosX = this.getMaximumPositionX();
    var slidingWindowWidth = slidingWindow.getWidth();
    newX = Math.max(minPosX, Math.min(maxPosX - slidingWindowWidth, newX));

    this.animateProperty(animator, slidingWindow, posXGetter, posXSetter, newX);

    // left and right handles
    this.animateProperty(animator, leftHandle, leftHandleX1Getter, leftHandleX1Setter, newX);
    this.animateProperty(animator, leftHandle, leftHandleX2Getter, leftHandleX2Setter, newX);
    this.animateProperty(animator, rightHandle, rightHandleX1Getter, rightHandleX1Setter, newX + slidingWindowWidth);
    this.animateProperty(animator, rightHandle, rightHandleX2Getter, rightHandleX2Setter, newX + slidingWindowWidth);

    // left and right top bar
    if (!this.isVertical())
    {
      this.animateProperty(animator, leftTopBar, leftTopBar.getX2, leftTopBar.setX2, newX + 1);
      this.animateProperty(animator, rightTopBar, rightTopBar.getX1, rightTopBar.setX1, newX + slidingWindowWidth - 1);
    }

    // top and bottom borders
    this.animateProperty(animator, bottomBar, bottomBarX1Getter, bottomBarX1Setter, newX);
    this.animateProperty(animator, topBar, topBarX1Getter, topBarX1Setter, newX);
    this.animateProperty(animator, bottomBar, bottomBarX2Getter, bottomBarX2Setter, newX + slidingWindowWidth);
    this.animateProperty(animator, topBar, topBarX2Getter, topBarX2Setter, newX + slidingWindowWidth);

    playAnimator = true;
  }

  if (this.isLeftAndRightFilterRendered())
  {
    var leftBackground = this.getLeftBackground();
    var leftBackgroundGetter = leftBackground.getWidth;
    var leftBackgroundSetter = leftBackground.setWidth;
    this.animateProperty(animator, leftBackground, leftBackgroundGetter, leftBackgroundSetter, newX);

    var rightStart = newX + slidingWindowWidth;
    var rightBackground = this.getRightBackground();
    var rightBackgroundGetter = rightBackground.getWidth;
    var rightBackgroundSetter = rightBackground.setWidth;
    var rightBackgroundPosGetter = rightBackground.getX;
    var rightBackgroundPosSetter = rightBackground.setX;

    this.animateProperty(animator, rightBackground, rightBackgroundGetter, rightBackgroundSetter, this.Width - rightStart);
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

      this.animateProperty(animator, leftBackgroundHandle, leftBackgroundHandleGetter, leftBackgroundHandleSetter, newX - handleStart);
      this.animateProperty(animator, rightBackgroundHandle, rightBackgroundHandleGetter, rightBackgroundHandleSetter, rightStart);
    }
    playAnimator = true;
  }

  if (animator != null && playAnimator)
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

  if (drawable.getId() == 'window' || drawable.getId() == 'ftr' || drawable.getId() == 'arr' || this.isHandle(drawable))
    return;

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

    // scroll sliding window
    var slidingWindow = this.getSlidingWindow();
    if (this.isVerticalScrollingEnabled())
    {
      var posY = relPos.y;
      var height = this.Height;
      var newPosY = posY - slidingWindow.getHeight() / 2;
    }
    if (this.isHorizontalScrollingEnabled())
    {
      var posX = relPos.x;
      var width = this.Width;
      var newPosX = posX - slidingWindow.getWidth() / 2;

      if (this.isRTL())
        posX = width - posX;
    }

    this.animateSlidingWindow(newPosX, newPosY);

    // scroll timeline
    var newX1, newX2, newY1, newY2;
    if (newPosX != null)
    {
      var slidingWindowWidth = slidingWindow.getWidth();
      // make sure position is in bound
      newPosX = Math.max(this.getMinimumPositionX(), Math.min(newPosX, width - slidingWindowWidth));

      if (this.isRTL())
      {
        newX1 = this.getXPositionDate(width - (newPosX + slidingWindowWidth));
        newX2 = this.getXPositionDate(width - newPosX);
      }
      else
      {
        newX1 = this.getXPositionDate(newPosX);
        newX2 = this.getXPositionDate(newPosX + slidingWindowWidth);
      }
    }
    if (newPosY != null)
    {
      var slidingWindowHeight = slidingWindow.getHeight();
      // make sure position is in bound
      newPosY = Math.max(this.getMinimumPositionY(), Math.min(newPosY, height - slidingWindowHeight));

      newY1 = this.getYPositionDate(newPosY);
      newY2 = this.getYPositionDate(newPosY + slidingWindowHeight);
    }
    var evt = dvt.EventFactory.newOverviewEvent('scrollTime', newX1, newX2,  newY1, newY2);
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

      if (drawable.getParent().getId() == 'hgrpy' || drawable.getParent().getId() == 'vgrpy')
        drawable = drawable.getParent();

      var drawableId = drawable.getId();

      if (drawableId == 'hgrpy' || drawableId == 'vgrpy')
      {
        drawable = slidingWindow.getChildBefore(drawable);
        drawableId = drawable.getId();
      }

      if (drawableId == 'lh' || drawableId == 'rh' || drawableId == 'th' || drawableId == 'bh')
      {
        drawable = slidingWindow.getChildBefore(drawable);
        drawableId = drawable.getId();
      }

      if (drawableId == 'lbgrh')
        drawable = slidingWindow.getChildAt(0);

      if (drawableId == 'rbgrh')
        drawable = slidingWindow.getChildAt(slidingWindow.getNumChildren() - 3);

      if (this.isLeftOrRightHandle(drawable))
      {
        this._isHorizontalResize = true;
        if (this.isRTL())
        {
          this._oldEndPosX = this.Width - slidingWindow.getX();
          this._oldStartPosX = this._oldEndPosX - slidingWindow.getWidth();
        }
        else
        {
          this._oldStartPosX = slidingWindow.getX();
          this._oldEndPosX = this._oldStartPosX + slidingWindow.getWidth();
        }
        // drawable should be lhb or rhb
        // temporarily increase size of handle to capture wider area and prevent cursor from changing
        // only do this for non touch since we won't run into cursor issue
        if (!dvt.OverviewUtils.supportsTouch())
        {
          drawable.setX(0 - dvt.Overview.HANDLE_PADDING_SIZE);
          drawable.setWidth((drawable.getWidth() + dvt.Overview.HANDLE_PADDING_SIZE) * 2);
        }
      }
      else
      {
        this._isHorizontalResize = false;
        this._oldStartPosY = slidingWindow.getY();
        this._oldEndPosY = this._oldStartPosY + slidingWindow.getHeight();

        // drawable should be lhb or rhb
        // temporarily increase size of handle to capture wider area and prevent cursor from changing
        // only do this for non touch since we won't run into cursor issue
        if (!dvt.OverviewUtils.supportsTouch())
        {
          drawable.setY(0 - dvt.Overview.HANDLE_PADDING_SIZE);
          drawable.setHeight((drawable.getHeight() + dvt.Overview.HANDLE_PADDING_SIZE) * 2);
        }
      }

      // temporily change the cursor of other areas of overview so that
      // the cursor won't change when it is moved outside of the handle
      this.overrideCursors(drawable.getCursor());
    }
    this._moveDrawable = drawable;

    // ask the overview peer to notify us if the release happened outside of the overview
    // see stopDragAction method
    var evt = dvt.EventFactory.newOverviewEvent('dropCallback');
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
  if (this._moveDrawable != null && this._isDragPanning == true)
  {
    if (this._moveDrawable.getId() == 'window')
      this.handleWindowDrag('scrollEnd');
    else if (this.isHandle(this._moveDrawable))
    {
      this.finishHandleDrag(0, 0);

      // reset the temporarily resized handle
      if (!dvt.OverviewUtils.supportsTouch())
      {
        if (this.isTopOrBottomHandle(this._moveDrawable))
        {
          this._moveDrawable.setY(0);
          this._moveDrawable.setHeight(this.getHandleSize());
        }
        else if (this.isLeftOrRightHandle(this._moveDrawable))
        {
          this._moveDrawable.setX(0);
          this._moveDrawable.setWidth(this.getHandleSize());
        }
      }

      // reset cursors that were temporily changed
      this.resetCursors();
    }

    this._isDragPanning = false;
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
    this._isDragPanning = true;
    var diffX = compX - this._initX;
    var diffY = compY - this._initY;
    this._initX = compX;
    this._initY = compY;

    if (this._moveDrawable.getId() == 'window')
      this.handleWindowDrag('scrollPos', diffX, diffY);
    else if (this._moveDrawable.getId() == 'lh' || this._moveDrawable.getId() == 'lhb')
      this.handleLeftOrRightHandleDragPositioning(event, diffX, true);
    else if (this._moveDrawable.getId() == 'rh' || this._moveDrawable.getId() == 'rhb')
      this.handleLeftOrRightHandleDragPositioning(event, diffX, false);
    else if (this._moveDrawable.getId() == 'th' || this._moveDrawable.getId() == 'thb')
      this.handleTopOrBottomHandleDragPositioning(event, diffY, true);
    else if (this._moveDrawable.getId() == 'bh' || this._moveDrawable.getId() == 'bhb')
      this.handleTopOrBottomHandleDragPositioning(event, diffY, false);
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

/************************** end event handling *********************************************/


/***************************** window scrolling and resizing *********************************************/
dvt.Overview.prototype.handleWindowDrag = function(type, deltaX, deltaY)
{
  var slidingWindow = this.getSlidingWindow();

  var triggerEvent = false;
  var posX = this.getSlidingWindowPosX(slidingWindow);
  var posY = this.getSlidingWindowPosY(slidingWindow);
  var width = slidingWindow.getWidth();
  var height = slidingWindow.getHeight();

  if (type === 'scrollPos')
  {
    if (this.isHorizontalScrollingEnabled() && deltaX !== 0)
    {
      var minPosX = this.getMinimumPositionX();
      var maxPosX = this.getMaximumPositionX();
      if ((posX + deltaX) <= minPosX)
      {
        // hit the left side
        this.setSlidingWindowPosX(slidingWindow, minPosX);
      }
      else if (posX + width + deltaX >= maxPosX)
      {
        // hit the bottom
        this.setSlidingWindowPosX(slidingWindow, maxPosX - width);
      }
      else
      {
        this.setSlidingWindowPosX(slidingWindow, posX + deltaX);
      }
      var newPosX = this.getSlidingWindowPosX(slidingWindow);
      if (newPosX !== posX)
      {
        posX = newPosX;
        triggerEvent = true;
      }
    }
    if (this.isVerticalScrollingEnabled() && deltaY !== 0)
    {
      var minPosY = this.getMinimumPositionY();
      var maxPosY = this.getMaximumPositionY();
      if ((posY + deltaY) <= minPosY)
      {
        // hit the left side
        this.setSlidingWindowPosY(slidingWindow, minPosY);
      }
      else if (posY + height + deltaY >= maxPosY)
      {
        // hit the bottom
        this.setSlidingWindowPosY(slidingWindow, maxPosY - height);
      }
      else
      {
        this.setSlidingWindowPosY(slidingWindow, posY + deltaY);
      }
      var newPosY = this.getSlidingWindowPosY(slidingWindow);
      if (newPosY !== posY)
      {
        posY = newPosY;
        triggerEvent = true;
      }
    }
    if (triggerEvent)
    {
      // update sliding window borders if there was a position update
      DvtOverviewRenderer._updateBorderAroundSlidingWindow(this);
    }
  }
  // fire a scroll event if the window drag deltas caused a position update, or if the drag is ending
  if (triggerEvent || 'scrollEnd')
  {
    var newX1;
    var newX2;
    var newY1;
    var newY2;
    if (this.isHorizontalScrollingEnabled())
    {
      if (this.isRTL())
      {
        newX1 = this.getXPositionDate(this.Width - (posX + width));
        newX2 = this.getXPositionDate(this.Width - posX);
      }
      else
      {
        newX1 = this.getXPositionDate(posX);
        newX2 = this.getXPositionDate(posX + width);
      }
    }
    if (this.isVerticalScrollingEnabled())
    {
      newY1 = this.getYPositionDate(posY);
      newY2 = this.getYPositionDate(posY + height);
    }
    this.fireScrollEvent(type, newX1, newX2, newY1, newY2);
  }
};

dvt.Overview.prototype.fireScrollEvent = function(type, newX1, newX2, newY1, newY2)
{
  // scroll timeline
  var nx1, nx2, ny1, ny2;
  if (this.isHorizontalScrollingEnabled())
  {
    nx1 = newX1;
    nx2 = newX2;
  }
  if (this.isVerticalScrollingEnabled())
  {
    ny1 = newY1;
    ny2 = newY2;
  }
  var evt = dvt.EventFactory.newOverviewEvent(type, nx1, nx2, ny1, ny2);
  this.dispatchEvent(evt);
};

dvt.Overview.prototype.handleLeftOrRightHandleDragPositioning = function(event, delta, isLeft)
{
  if (delta == 0)
    return;

  var slidingWindow = this.getSlidingWindow();
  var windowPos = this.getSlidingWindowPosX(slidingWindow);
  var windowWidth = slidingWindow.getWidth();

  if (isLeft)
  {
    // make sure width of sliding window is larger than minimum
    if (windowWidth - delta <= this.getMinimumWindowWidth())
      return;

    // make sure position of left handle is not less than minimum (delta is negative when moving handle to the left)
    if (windowPos + delta <= this.getMinimumPositionX())
      return;

    // window should only resize when the cursor is back to where the handle is
    var relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).x;
    relPos = this.stageToLocal(relPos);

    if (delta > 0 && relPos <= windowPos)
      return;
    else if (delta < 0 && relPos >= windowPos)
      return;

    this.setSlidingWindowPosX(slidingWindow, windowPos + delta);
    DvtOverviewRenderer._setSlidingWindowWidth(this, slidingWindow, windowWidth - delta);
  }
  else
  {
    // make sure width of sliding window is larger than minimum
    if (windowWidth + delta <= this.getMinimumWindowWidth())
      return;

    // make sure position of right handle is not less than minimum
    if (windowPos + windowWidth + delta >= this.getMaximumPositionX())
      return;

    // window should only resize when the cursor is back to where the handle is
    relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).x;
    relPos = this.stageToLocal(relPos);

    if (delta > 0 && relPos <= windowPos + windowWidth)
      return;
    else if (delta < 0 && relPos >= windowPos + windowWidth)
      return;

    DvtOverviewRenderer._setSlidingWindowWidth(this, slidingWindow, windowWidth + delta);
  }

  // sync with time axis
  DvtOverviewRenderer._updateBorderAroundSlidingWindow(this);

  // tell event handler that time range is changing
  if (this.isRangeChangingSupported())
  {
    var newX1, newX2;
    if (this.isRTL())
    {
      newX1 = this.getXPositionDate(this.Width - (this.getSlidingWindowPosX(slidingWindow) + slidingWindow.getWidth()));
      newX2 = this.getXPositionDate(this.Width - this.getSlidingWindowPosX(slidingWindow));
    }
    else
    {
      newX1 = this.getXPositionDate(this.getSlidingWindowPosX(slidingWindow));
      newX2 = this.getXPositionDate(this.getSlidingWindowPosX(slidingWindow) + slidingWindow.getWidth());
    }
    var evt = dvt.EventFactory.newOverviewEvent('rangeChanging', newX1, newX2);

    this.dispatchEvent(evt);
  }
};

dvt.Overview.prototype.handleTopOrBottomHandleDragPositioning = function(event, delta, isTop)
{
  if (delta == 0)
    return;

  var slidingWindow = this.getSlidingWindow();
  var windowPos = this.getSlidingWindowPosY(slidingWindow);
  var windowHeight = slidingWindow.getHeight();

  if (isTop)
  {
    // make sure width of sliding window is larger than minimum
    if (windowHeight - delta <= this.getMinimumWindowHeight())
      return;

    // make sure position of top handle is not less than minimum (delta is negative when moving handle to the top)
    if (windowPos + delta <= this.getMinimumPositionY())
      return;

    // window should only resize when the cursor is back to where the handle is
    var relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).y;
    relPos = this.stageToLocal(relPos);

    if (delta > 0 && relPos <= windowPos)
      return;
    else if (delta < 0 && relPos >= windowPos)
      return;

    this.setSlidingWindowPosY(slidingWindow, windowPos + delta);
    DvtOverviewRenderer._setSlidingWindowHeight(this, slidingWindow, windowHeight - delta);
  }
  else
  {
    // make sure width of sliding window is larger than minimum
    if (windowHeight + delta <= this.getMinimumWindowHeight())
      return;

    // make sure position of bottom handle is not less than minimum
    if (windowPos + windowHeight + delta >= this.getMaximumPositionY())
      return;

    // window should only resize when the cursor is back to where the handle is
    relPos = this.getCtx().pageToStageCoords(this.getPageX(event), this.getPageY(event)).y;
    relPos = this.stageToLocal(relPos);

    if (delta > 0 && relPos <= windowPos + windowHeight)
      return;
    else if (delta < 0 && relPos >= windowPos + windowHeight)
      return;

    DvtOverviewRenderer._setSlidingWindowHeight(this, slidingWindow, windowHeight + delta);
  }

  // sync with time axis
  DvtOverviewRenderer._updateBorderAroundSlidingWindow(this);

  // tell event handler that time range is changing
  if (this.isRangeChangingSupported())
  {
    var newY1 = this.getYPositionDate(this.getSlidingWindowPosY(slidingWindow));
    var newY2 = this.getYPositionDate(this.getSlidingWindowPosY(slidingWindow) + slidingWindow.getHeight());

    var evt = dvt.EventFactory.newOverviewEvent('rangeChanging', undefined, undefined, newY1, newY2);

    this.dispatchEvent(evt);
  }
};

/**
 * Whether or not horizontal scrolling is enabled.
 */
dvt.Overview.prototype.isHorizontalScrollingEnabled = function()
{
  return (this._xMin != null && this._xMax != null);
};

/**
 * Whether or not vertical scrolling is enabled.
 */
dvt.Overview.prototype.isVerticalScrollingEnabled = function()
{
  return (this._yMin != null && this._yMax != null);
};

// whether to fire a range changing event, which will be fired continuously when the sliding window is resize
dvt.Overview.prototype.isRangeChangingSupported = function()
{
  return true;
};

dvt.Overview.prototype.finishHandleDrag = function(deltaX, deltaY)
{
  var slidingWindow = this.getSlidingWindow();
  var evt;

  if (this._isHorizontalResize)
  {
    var oldX1 = this.getXPositionDate(this._oldStartPosX);
    var oldX2 = this.getXPositionDate(this._oldEndPosX);
    if (this.isRTL())
    {
      var newX1 = this.getXPositionDate(this.Width - (this.getSlidingWindowPosX(slidingWindow) + slidingWindow.getWidth()));
      var newX2 = this.getXPositionDate(this.Width - this.getSlidingWindowPosX(slidingWindow));
    }
    else
    {
      newX1 = this.getXPositionDate(this.getSlidingWindowPosX(slidingWindow));
      newX2 = this.getXPositionDate(this.getSlidingWindowPosX(slidingWindow) + slidingWindow.getWidth());
    }
    evt = dvt.EventFactory.newOverviewEvent('rangeChange', newX1, newX2, undefined, undefined, oldX1, oldX2);
  }
  else
  {
    var oldY1 = this.getYPositionDate(this._oldStartPosY);
    var oldY2 = this.getYPositionDate(this._oldEndPosY);
    var newY1 = this.getYPositionDate(this.getSlidingWindowPosY(slidingWindow));
    var newY2 = this.getYPositionDate(this.getSlidingWindowPosY(slidingWindow) + slidingWindow.getHeight());
    evt = dvt.EventFactory.newOverviewEvent('rangeChange', undefined, undefined, newY1, newY2, undefined, undefined, oldY1, oldY2);
  }

  // alert peer of time range change
  this.dispatchEvent(evt);
};

/**************************end window scrolling and resizing *********************************************/


/**
 * Dispatches the event to the callback function.  This enables callback function on the peer.
 * @param {object} event The event to be dispatched.
 */
dvt.Overview.prototype.dispatchEvent = function(event)
{
  this._callback.call(this._callbackObj, event, this);
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
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtOverviewDefaults = function()
{
  this.Init({'alta': DvtOverviewDefaults.VERSION_1});
};

dvt.Obj.createSubclass(DvtOverviewDefaults, dvt.BaseComponentDefaults);

/**
 * Contains overrides for version 1.
 * @const
 */
DvtOverviewDefaults.VERSION_1 = {
  'overviewPosition': 'below',
  'style': {
    'currentTimeIndicatorColor': '#c000d1',
    'handleFillColor': '#ffffff',
    'handleTextureColor': '#b3c6db',
    'leftFilterPanelAlpha': 0.7,
    'leftFilterPanelColor': '#ffffff',
    'overviewBackgroundColor': '#e6ecf3',
    'rightFilterPanelAlpha': 0.7,
    'rightFilterPanelColor': '#ffffff',
    'timeAxisBarColor': '#e5e5e5',
    'timeAxisBarAlpha': 1,
    'timeIndicatorColor': '#bcc7d2',
    'windowBackgroundAlpha': 1,
    'windowBackgroundColor': '#ffffff',
    'windowBorderBottomColor': '#4f4f4f',
    'windowBorderBottomStyle': 'solid',
    'windowBorderLeftColor': '#4f4f4f',
    'windowBorderLeftStyle': 'solid',
    'windowBorderRightColor': '#4f4f4f',
    'windowBorderRightStyle': 'solid',
    'windowBorderTopColor': '#4f4f4f',
    'windowBorderTopStyle': 'solid'
  }
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/**
 * Overview JSON Parser
 * @param {dvt.Overview} view The owning Overview component.
 * @class
 * @constructor
 * @extends {dvt.Obj}
 */
dvt.OverviewParser = function(view)
{
  this.Init(view);
};

dvt.Obj.createSubclass(dvt.OverviewParser, dvt.Obj);

/**
 * Initializes the component parser.
 * @param {dvt.Overview} view The dvt.Overview instance.
 */
dvt.OverviewParser.prototype.Init = function(view)
{
  this._view = view;
};


/**
 * Parses the JSON object and returns the root node of the overview.
 * @param {object} data The object describing the component.
 * @return {object} An object containing the parsed properties.
 */
dvt.OverviewParser.prototype.parse = function(data)
{
  // for now all the JSON contains should be options and no data, that could change in the future.
  var options = data;

  var ret = this.ParseRootAttributes(options);
  return ret;
};


/**
 * Parses the attributes on the root node.
 * @param {object} options The options object defining the root.
 * @return {object} An object containing the parsed properties.
 * @protected
 */
dvt.OverviewParser.prototype.ParseRootAttributes = function(options)
{
  // The object that will be populated with parsed values and returned
  var ret = new Object();

  // animation related options
  ret.animationOnClick = options['animationOnClick'];

  if (options['xMin'] != null)
    ret.xMin = options['xMin'];
  if (options['xMax'] != null)
    ret.xMax = options['xMax'];

  if (options['x1'] != null)
    ret.x1 = options['x1'];
  if (options['x2'] != null)
    ret.x2 = options['x2'];

  if (options['yMin'] != null)
    ret.yMin = options['yMin'];
  if (options['yMax'] != null)
    ret.yMax = options['yMax'];

  if (options['y1'] != null)
    ret.y1 = options['y1'];
  if (options['y2'] != null)
    ret.y2 = options['y2'];

  if (options['currentTime'] != null)
    ret.currentTime = options['currentTime'];

  ret.orientation = 'horizontal';
  if (options['orientation'] != null)
    ret.orientation = options['orientation'];

  ret.featuresOff = options['featuresOff'];
  ret.minimumWindowSize = options['minimumWindowSize'];
  ret.leftMargin = options['leftMargin'];
  ret.rightMargin = options['rightMargin'];

  ret.overviewPosition = 'below';
  ret.selectionMode = 'none';
  ret.isRtl = dvt.Agent.isRightToLeft(this._view.getCtx()).toString();
  if (options['rtl'] != null)
    ret.isRtl = options['rtl'].toString();

  return ret;
};

/**
 * Convenient method to calculate the width based on start time/end time and viewport end time
 * @param {number} startTime The start time of the component.
 * @param {number} endTime The end time of the component.
 * @param {number} viewportStartTime The viewport start time of the component.
 * @param {number} viewportEndTime The viewport end time of the component.
 * @param {number} viewportEndPos The position of the end of the viewport.
 * @return {number} The calculated width.
 */
dvt.OverviewParser.prototype.calculateWidth = function(startTime, endTime, viewportStartTime, viewportEndTime, viewportEndPos)
{
  var number = viewportEndPos * (endTime - startTime);
  var denominator = (viewportEndTime - viewportStartTime);
  if (number == 0 || denominator == 0)
    return 0;

  return number / denominator;
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
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

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/**
 * Renderer for dvt.Overview.
 * @class
 */
var DvtOverviewRenderer = new Object();

dvt.Obj.createSubclass(DvtOverviewRenderer, dvt.Obj);

/**
 * Renders an overview.
 * @param {dvt.Overview} overview The overview being rendered.
 */
DvtOverviewRenderer.renderOverview = function(overview)
{
  if (overview.isBackgroundRendered())
    DvtOverviewRenderer._renderBackground(overview);

  var interactive = (overview._callback != null || overview._callbackObj != null);

  if (interactive)
    DvtOverviewRenderer._renderSlidingWindow(overview);

  DvtOverviewRenderer._renderTimeAxis(overview);
  DvtOverviewRenderer._parseFilledTimeRanges(overview);
  DvtOverviewRenderer._updateCurrentTime(overview);

  // render data
  overview.renderData(overview.Width, overview.Height);

  if (interactive)
  {
    DvtOverviewRenderer._createBorderAroundSlidingWindow(overview);

    // updates the position and width of sliding window and borders around window
    DvtOverviewRenderer._updateSlidingWindow(overview);
  }
};

/**
 * Renders the background of an overview.
 * @param {dvt.Overview} overveiw The overview being rendered.
 * @private
 */
DvtOverviewRenderer._renderBackground = function(overview)
{
  // draw a background shape covering all area to capture all mouse events
  var background = new dvt.Rect(overview.getCtx(), 0, 0, overview.Width, overview.Height, 'bg');
  background.setSolidFill(overview._overviewBackgroundColor);

  // Do not antialias the background
  background.setPixelHinting(true);

  overview.addChild(background);
};

/**
 * Renders the sliding window of an overveiw.
 * @param {dvt.Overview} overview The overview being rendered.
 * @private
 */
DvtOverviewRenderer._renderSlidingWindow = function(overview)
{
  var width = overview.Width;
  var height = overview.Height;

  // draw sliding window first so that it is under the markers
  var slidingWindow = new dvt.Rect(overview.getCtx(), 0, 0, width, height, 'window');
  slidingWindow.setSolidFill(overview._windowBackgroundColor, overview._windowBackgroundAlpha);

  // Do not antialias the Timeline Overview
  slidingWindow.setPixelHinting(true);

  if (!overview.isFeatureOff('zoom'))
  {
    var handleSize = overview.getHandleSize();
    var handleStart = overview.getHandleStart();
    var grippySize = overview.getGrippySize();

    if (overview.isVerticalScrollingEnabled())
    {
      var slidingWindowWidth = overview.getSlidingWindowWidth();

      var topHandleCmds = dvt.PathUtils.moveTo(0, 0) +
          dvt.PathUtils.quadTo(3, 6, 8, 8) +
                  dvt.PathUtils.lineTo(28, 8) +
                  dvt.PathUtils.quadTo(33, 6, 36, 0);
      dvt.PathUtils.closePath();
      var bottomHandleCmds = dvt.PathUtils.moveTo(0, 0) +
          dvt.PathUtils.quadTo(3, -6, 8, -8) +
                  dvt.PathUtils.lineTo(28, -8) +
                  dvt.PathUtils.quadTo(33, -6, 36, 0);
      dvt.PathUtils.closePath();
      var topHandleBackground = new dvt.Rect(overview.getCtx(), 0, 0, slidingWindowWidth, handleSize, 'thb');
      var bottomHandleBackground = new dvt.Rect(overview.getCtx(), 0, 0, slidingWindowWidth, handleSize, 'bhb');
      cursor = 'row-resize';

      if (overview._vertHandleBackgroundImage)
      {
        var topGrippy = DvtOverviewRenderer._createGrippyImage(overview, slidingWindowWidth, grippySize, true);
        var bottomGrippy = DvtOverviewRenderer._createGrippyImage(overview, slidingWindowWidth, grippySize, true);
      }
      else
      {
        topGrippy = DvtOverviewRenderer._createGrippy(overview, true);
        bottomGrippy = DvtOverviewRenderer._createGrippy(overview, true);
      }

      topHandleBackground.setSolidFill(overview._windowBackgroundColor, 0);
      bottomHandleBackground.setSolidFill(overview._windowBackgroundColor, 0);

      // Do not antialias the handle backgrounds
      topHandleBackground.setPixelHinting(true);
      bottomHandleBackground.setPixelHinting(true);

      var topHandle = new dvt.Path(overview.getCtx(), topHandleCmds, 'th');
      var bottomHandle = new dvt.Path(overview.getCtx(), bottomHandleCmds, 'bh');
      topHandle.setSolidFill(overview._handleFillColor);
      topHandle.setSolidStroke(overview._handleFillColor);
      bottomHandle.setSolidFill(overview._handleFillColor);
      bottomHandle.setSolidStroke(overview._handleFillColor);

      // if the handle color is the same as the background color, it should not have antialiasing so it does not appear visible
      if (overview._windowBackgroundColor == overview._handleFillColor)
      {
        topHandle.setPixelHinting(true);
        bottomHandle.setPixelHinting(true);
      }

      // sets the resize cursor
      topHandleBackground.setCursor(cursor);
      bottomHandleBackground.setCursor(cursor);
      topHandle.setCursor(cursor);
      bottomHandle.setCursor(cursor);
      topGrippy.setCursor(cursor);
      bottomGrippy.setCursor(cursor);

      slidingWindow.addChild(topHandleBackground);
      overview._windowTopHandleBackground = topHandleBackground;
      slidingWindow.addChild(topHandle);
      overview._windowTopHandle = topHandle;
      slidingWindow.addChild(topGrippy);
      overview._windowTopGrippy = topGrippy;
      slidingWindow.addChild(bottomHandleBackground);
      overview._windowBottomHandleBackground = bottomHandleBackground;
      slidingWindow.addChild(bottomHandle);
      overview._windowBottomHandle = bottomHandle;
      slidingWindow.addChild(bottomGrippy);
      overview._windowBottomGrippy = bottomGrippy;
    }
    if (overview.isHorizontalScrollingEnabled())
    {
      var slidingWindowHeight = overview.getSlidingWindowHeight();

      var leftHandleCmds = dvt.PathUtils.moveTo(0, 0) +
          dvt.PathUtils.quadTo(6, 3, 8, 8) +
                  dvt.PathUtils.lineTo(8, 28) +
                  dvt.PathUtils.quadTo(6, 33, 0, 36);
      dvt.PathUtils.closePath();
      var rightHandleCmds = dvt.PathUtils.moveTo(0, 0) +
          dvt.PathUtils.quadTo(-6, 3, -8, 8) +
                  dvt.PathUtils.lineTo(-8, 28) +
                  dvt.PathUtils.quadTo(-6, 33, 0, 36);
      dvt.PathUtils.closePath();
      var leftHandleBackground = new dvt.Rect(overview.getCtx(), 0 - handleStart, 0, handleSize, slidingWindowHeight, 'lhb');
      var rightHandleBackground = new dvt.Rect(overview.getCtx(), handleStart, 0, handleSize, slidingWindowHeight, 'rhb');
      var cursor = 'col-resize';

      if (overview._horHandleBackgroundImage)
      {
        var leftGrippy = DvtOverviewRenderer._createGrippyImage(overview, grippySize, slidingWindowHeight, false);
        var rightGrippy = DvtOverviewRenderer._createGrippyImage(overview, grippySize, slidingWindowHeight, false);
      }
      else
      {
        leftGrippy = DvtOverviewRenderer._createGrippy(overview, false);
        rightGrippy = DvtOverviewRenderer._createGrippy(overview, false);
      }

      leftHandleBackground.setSolidFill(overview._windowBackgroundColor, 0);
      rightHandleBackground.setSolidFill(overview._windowBackgroundColor, 0);

      // Do not antialias the handle backgrounds
      leftHandleBackground.setPixelHinting(true);
      rightHandleBackground.setPixelHinting(true);

      var leftHandle = new dvt.Path(overview.getCtx(), leftHandleCmds, 'lh');
      var rightHandle = new dvt.Path(overview.getCtx(), rightHandleCmds, 'rh');
      leftHandle.setSolidFill(overview._handleFillColor);
      leftHandle.setSolidStroke(overview._handleFillColor);
      rightHandle.setSolidFill(overview._handleFillColor);
      rightHandle.setSolidStroke(overview._handleFillColor);

      // if the handle color is the same as the background color, it should not have antialiasing so it does not appear visible
      if (overview._windowBackgroundColor == overview._handleFillColor)
      {
        leftHandle.setPixelHinting(true);
        rightHandle.setPixelHinting(true);
      }

      // sets the resize cursor
      leftHandleBackground.setCursor(cursor);
      rightHandleBackground.setCursor(cursor);
      leftHandle.setCursor(cursor);
      rightHandle.setCursor(cursor);
      leftGrippy.setCursor(cursor);
      rightGrippy.setCursor(cursor);

      slidingWindow.addChild(leftHandleBackground);
      overview._windowLeftHandleBackground = leftHandleBackground;
      slidingWindow.addChild(leftHandle);
      overview._windowLeftHandle = leftHandle;
      slidingWindow.addChild(leftGrippy);
      overview._windowLeftGrippy = leftGrippy;
      slidingWindow.addChild(rightHandleBackground);
      overview._windowRightHandleBackground = rightHandleBackground;
      slidingWindow.addChild(rightHandle);
      overview._windowRightHandle = rightHandle;
      slidingWindow.addChild(rightGrippy);
      overview._windowRightGrippy = rightGrippy;
    }
  }

  // sets cursor AFTER adding child since toolkit adds a group and the cursor would be set on group instead
  slidingWindow.setCursor('move');
  overview.addChild(slidingWindow);

  DvtOverviewRenderer._renderTimeAxisTopBar(overview);
  DvtOverviewRenderer._renderLeftAndRightFilters(overview, handleStart);
};

/**
 * Renders the grippy from an image.
 * @param {dvt.Overview} overview The overview being rendered.
 * @param {number} width The window width.
 * @param {number} height The window height.
 * @param {boolean} isVertical Whether or not this is a vertical grippy.
 * @private
 */
DvtOverviewRenderer._createGrippyImage = function(overview, width, height, isVertical)
{
  if (!isVertical)
  {
    var posX = (width - overview._horHandleWidth) / 2;
    var grippy = new dvt.Image(overview.getCtx(), overview._horHandleBackgroundImage, posX, 0, overview._horHandleWidth, overview._horHandleHeight, 'hgrpy');
  }
  else
  {
    var posY = (height - overview._vertHandleHeight) / 2;
    grippy = new dvt.Image(overview.getCtx(), overview._vertHandleBackgroundImage, 0, posY, overview._vertHandleWidth, overview._vertHandleHeight, 'vgrpy');
  }
  grippy.setMouseEnabled(false);
  return grippy;
};

/**
 * Renders the dots in the grippy.
 * @param {dvt.Overview} overview The overview being rendered.
 * @param {boolean} isVertical Whether or not this is a vertical grippy.
 * @private
 */
DvtOverviewRenderer._createGrippy = function(overview, isVertical)
{
  var gap = 2; // gap between dots
  var count = 9;  // how many dots to draw
  var color = overview._handleTextureColor; // color of the dots

  if (isVertical)
  {
    var grippy = new dvt.Container(overview.getCtx(), 'vgrpy');
    var startx = 8;
    var starty = 3;  // start y location of dots relative to container
    for (var i = 0; i < count; i++)
    {
      var dot = new dvt.Line(overview.getCtx(), startx + i * gap, starty, startx + i * gap + 1, starty, 'dot1' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      starty = starty + gap;
      dot = new dvt.Line(overview.getCtx(), (startx + 1) + i * gap, starty, (startx + 1) + i * gap + 1, starty, 'dot2' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      starty = starty + gap;
      dot = new dvt.Line(overview.getCtx(), startx + i * gap, starty, startx + i * gap + 1, starty, 'dot3' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      starty = 3;
    }

    dot = new dvt.Line(overview.getCtx(), startx + count * gap, starty, startx + count * gap + 1, starty, 'dot4');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
    starty = starty + gap * 2;
    dot = new dvt.Line(overview.getCtx(), startx + count * gap, starty, startx + count * gap + 1, starty, 'dot5');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
  }
  else
  {
    grippy = new dvt.Container(overview.getCtx(), 'hgrpy');
    startx = 3;  // start x location of dots relative to container
    starty = 8;
    for (i = 0; i < count; i++)
    {
      dot = new dvt.Line(overview.getCtx(), startx, starty + i * gap, startx, starty + i * gap + 1, 'dot1' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      startx = startx + gap;
      dot = new dvt.Line(overview.getCtx(), startx, (starty + 1) + i * gap, startx, (starty + 1) + i * gap + 1, 'dot2' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      startx = startx + gap;
      dot = new dvt.Line(overview.getCtx(), startx, starty + i * gap, startx, starty + i * gap + 1, 'dot3' + i);
      dot.setSolidStroke(color);
      grippy.addChild(dot);

      startx = 3;
    }

    dot = new dvt.Line(overview.getCtx(), startx, starty + count * gap, startx, starty + count * gap + 1, 'dot4');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
    startx = startx + gap * 2;
    dot = new dvt.Line(overview.getCtx(), startx, starty + count * gap, startx, starty + count * gap + 1, 'dot5');
    dot.setSolidStroke(color);
    grippy.addChild(dot);
  }

  // Do not antialias the grippy
  grippy.setPixelHinting(true);

  return grippy;
};

/**
 * Renders the border of the sliding window of an overveiw.
 * @param {dvt.Overview} overview The overview being rendered.
 * @private
 */
DvtOverviewRenderer._createBorderAroundSlidingWindow = function(overview)
{
  var width = overview.Width;
  var height = overview.Height;

  // add the left and right grip last since we want them over the markers
  var slidingWindow = overview.getSlidingWindow();
  var halfBorderWidth = DvtOverviewStyleUtils._DEFAULT_WINDOW_BORDER_WIDTH / 2;
  if (overview.isVertical())
  {
    var top = slidingWindow.getY();
    var topCenter = top + halfBorderWidth;
    var bottom = top + slidingWindow.getHeight();
    var bottomCenter = bottom - halfBorderWidth;
    var left = 0;
    var leftCenter = halfBorderWidth;
    var right = width;
    var rightCenter = right - halfBorderWidth;

    var leftHandle = new dvt.Line(overview.getCtx(), left, topCenter, width, topCenter, 'lh');
    var rightHandle = new dvt.Line(overview.getCtx(), left, bottomCenter, width, bottomCenter, 'rh');

    // leftTopBar and rightTopBar are only visible in fusion skins
    var leftTopBar = new dvt.Line(overview.getCtx(), leftCenter, 0, leftCenter, top, 'ltb');
    var rightTopBar = new dvt.Line(overview.getCtx(), leftCenter, bottom, leftCenter, height, 'rtb');

    var bottomBar = new dvt.Line(overview.getCtx(), rightCenter, top, rightCenter, bottom, 'bb');
    var topBar = new dvt.Line(overview.getCtx(), leftCenter, top, leftCenter, bottom, 'tb');
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

    leftHandle = new dvt.Line(overview.getCtx(), leftCenter, top, leftCenter, bottom, 'lh');
    rightHandle = new dvt.Line(overview.getCtx(), rightCenter, top, rightCenter, bottom, 'rh');

    // leftTopBar and rightTopBar are only visible in fusion skins
    leftTopBar = new dvt.Line(overview.getCtx(), 0, topCenter, left + 1, topCenter, 'ltb');
    rightTopBar = new dvt.Line(overview.getCtx(), right - 1, topCenter, width, topCenter, 'rtb');

    bottomBar = new dvt.Line(overview.getCtx(), left, bottomCenter, right, bottomCenter, 'bb');
    topBar = new dvt.Line(overview.getCtx(), left, topCenter, right, topCenter, 'tb');
  }

  // Do not antialias the sliding window borders
  leftHandle.setPixelHinting(true);
  rightHandle.setPixelHinting(true);
  leftTopBar.setPixelHinting(true);
  rightTopBar.setPixelHinting(true);
  bottomBar.setPixelHinting(true);
  topBar.setPixelHinting(true);

  if (overview._windowBorderLeftStyle != 'none')
    leftHandle.setSolidStroke(overview._windowBorderLeftColor);
  overview.addChild(leftHandle);
  overview._leftHandle = leftHandle;

  if (overview._windowBorderRightStyle != 'none')
    rightHandle.setSolidStroke(overview._windowBorderRightColor);
  overview.addChild(rightHandle);
  overview._rightHandle = rightHandle;

  if (overview._borderTopStyle != 'none' && overview._borderTopColor)
  {
    leftTopBar.setSolidStroke(overview._borderTopColor);
    rightTopBar.setSolidStroke(overview._borderTopColor);
  }
  overview.addChild(leftTopBar);
  overview.addChild(rightTopBar);

  if (overview._windowBorderBottomStyle != 'none')
    bottomBar.setSolidStroke(overview._windowBorderBottomColor);
  overview.addChild(bottomBar);

  if (overview._windowBorderTopStyle != 'none')
    topBar.setSolidStroke(overview._windowBorderTopColor);
  overview.addChild(topBar);
};

/**
 * Updates the border positioning of the sliding window of an overveiw.
 * @param {dvt.Overview} overview The overview being rendered.
 * @private
 */
DvtOverviewRenderer._updateBorderAroundSlidingWindow = function(overview)
{
  var slidingWindow = overview.getSlidingWindow();
  var halfBorderWidth = DvtOverviewStyleUtils._DEFAULT_WINDOW_BORDER_WIDTH / 2;

  var leftHandle = overview.getLeftHandle();
  var rightHandle = overview.getRightHandle();
  var leftTopBar = overview.getLeftTopBar();
  var rightTopBar = overview.getRightTopBar();
  var bottomBar = overview.getBottomBar();
  var topBar = overview.getTopBar();

  if (overview.isVertical())
  {
    if (overview.isHorizontalScrollingEnabled())
    {
      var slidingWindowWidth = slidingWindow.getWidth();
      var slidingWindowPosX = overview.getSlidingWindowPosX(slidingWindow);
      var leftCenter = slidingWindowPosX + halfBorderWidth;
      var rightCenter = slidingWindowPosX + slidingWindowWidth - halfBorderWidth;

      overview.setLinePosX(leftHandle, leftCenter, rightCenter);
      overview.setLinePosX(rightHandle, leftCenter, rightCenter);
      overview.setLinePosX(topBar, leftCenter, leftCenter);
      overview.setLinePosX(bottomBar, rightCenter, rightCenter);
    }
    if (overview.isVerticalScrollingEnabled())
    {
      var slidingWindowHeight = slidingWindow.getHeight();
      var slidingWindowPosY = overview.getSlidingWindowPosY(slidingWindow);
      var topCenter = slidingWindowPosY + halfBorderWidth;
      var bottomCenter = slidingWindowPosY + slidingWindowHeight - halfBorderWidth;

      overview.setLinePosY(leftHandle, topCenter, topCenter);
      overview.setLinePosY(rightHandle, bottomCenter, bottomCenter);
      overview.setLinePosY(topBar, topCenter, bottomCenter);
      overview.setLinePosY(bottomBar, topCenter, bottomCenter);
    }
  }
  else
  {
    if (overview.isHorizontalScrollingEnabled())
    {
      slidingWindowWidth = slidingWindow.getWidth();
      slidingWindowPosX = overview.getSlidingWindowPosX(slidingWindow);
      leftCenter = slidingWindowPosX + halfBorderWidth;
      rightCenter = slidingWindowPosX + slidingWindowWidth - halfBorderWidth;

      overview.setLinePosX(leftHandle, leftCenter, leftCenter);
      overview.setLinePosX(rightHandle, rightCenter, rightCenter);
      overview.setLinePosX(topBar, leftCenter, rightCenter);
      overview.setLinePosX(bottomBar, leftCenter, rightCenter);
    }

    if (overview.isVerticalScrollingEnabled())
    {
      slidingWindowHeight = slidingWindow.getHeight();
      slidingWindowPosY = overview.getSlidingWindowPosY(slidingWindow);
      topCenter = slidingWindowPosY + halfBorderWidth;
      bottomCenter = slidingWindowPosY + slidingWindowHeight - halfBorderWidth;

      overview.setLinePosY(leftHandle, topCenter, bottomCenter);
      overview.setLinePosY(rightHandle, topCenter, bottomCenter);
      overview.setLinePosY(topBar, topCenter, topCenter);
      overview.setLinePosY(bottomBar, bottomCenter, bottomCenter);
    }
  }

  overview.setLinePos(leftTopBar, -1, overview.getSlidingWindowPos(slidingWindow));
  overview.setLinePos(rightTopBar, overview.getLinePos1(rightHandle), -1);
};

/**
 * Updates the positioning of the sliding window of an overveiw.
 * @param {dvt.Overview} overview The overview being rendered.
 * @private
 */
DvtOverviewRenderer._updateSlidingWindow = function(overview)
{
  var window = overview.getSlidingWindow();
  var width = overview.Width;
  var height = overview.Height;

  // find the position relative to the width of timeline overview
  if (overview.isHorizontalScrollingEnabled())
  {
    var x1Pos = Math.max(overview.getMinimumPositionX(), dvt.OverviewUtils.getDatePosition(overview._xMin, overview._xMax, overview._x1, width));
    var x2Pos = Math.min(overview.getMaximumPositionX(), Math.max(overview.getMinimumPositionX(), dvt.OverviewUtils.getDatePosition(overview._xMin, overview._xMax, overview._x2, width)));

    if (overview.isRTL())
      overview.setSlidingWindowPosX(window, width - x2Pos);
    else
      overview.setSlidingWindowPosX(window, x1Pos);
    DvtOverviewRenderer._setSlidingWindowWidth(overview, window, x2Pos - x1Pos);
  }
  else
    DvtOverviewRenderer._setSlidingWindowWidth(overview, window, width);
  if (overview.isVerticalScrollingEnabled())
  {
    var y1Pos = Math.max(overview.getMinimumPositionY(), dvt.OverviewUtils.getDatePosition(overview._yMin, overview._yMax, overview._y1, height));
    var y2Pos = Math.min(overview.getMaximumPositionY(), Math.max(overview.getMinimumPositionY(), dvt.OverviewUtils.getDatePosition(overview._yMin, overview._yMax, overview._y2, height)));

    overview.setSlidingWindowPosY(window, y1Pos);
    DvtOverviewRenderer._setSlidingWindowHeight(overview, window, y2Pos - y1Pos);
  }
  else
    DvtOverviewRenderer._setSlidingWindowHeight(overview, window, height);

  DvtOverviewRenderer._updateBorderAroundSlidingWindow(overview);
};

/**
 * Updates the width of the sliding window of an overveiw.
 * @param {dvt.Overview} overview The overview being rendered.
 * @param {dvt.Rectangle} slidingWindow The sliding window of the overview.
 * @param {number} width The new width of the sliding window.
 * @private
 */
DvtOverviewRenderer._setSlidingWindowWidth = function(overview, slidingWindow, width)
{
  // make sure the width is within the maximum and minimum sizes specified
  width = Math.min(overview.getMaximumWindowWidth(), Math.max(overview.getMinimumWindowWidth(), width));
  slidingWindow.setWidth(width);

  // update left and right filter if one is specified
  if (overview.isLeftAndRightFilterRendered())
  {
    var rightStart = overview.getSlidingWindowPosX(slidingWindow) + width;
    var rightBackground = overview.getRightBackground();
    rightBackground.setX(rightStart);
    rightBackground.setWidth(Math.max(0, overview.Width - rightStart));

    // updates the background resize handle for touch
    if (dvt.OverviewUtils.supportsTouch() && !overview.isFeatureOff('zoom'))
    {
      var rightBackgroundHandle = overview.getRightBackgroundHandle();
      rightBackgroundHandle.setX(rightStart);
    }
  }

  // if resize feature is off then there's nothing else to do
  if (overview.isFeatureOff('zoom'))
    return;

  // update the resize handles
  if (overview.isHorizontalScrollingEnabled())
  {
    var rightHandleBackground = overview._windowRightHandleBackground;
    var rightHandle = overview._windowRightHandle;
    var rightGrippy = overview._windowRightGrippy;

    rightHandle.setTranslateX(width);
    rightHandleBackground.setTranslateX(width - overview.getHandleSize());
    rightGrippy.setTranslateX(width - overview.getGrippySize());
  }
  if (overview.isVerticalScrollingEnabled())
  {
    var handleX = (slidingWindow.getWidth() - 36) / 2;
    if (overview._vertHandleBackgroundImage)
      var grippyX = (width - overview._vertHandleWidth) / 2;
    else
      grippyX = handleX;

    var topHandleBackground = overview._windowTopHandleBackground;
    var topHandle = overview._windowTopHandle;
    var topGrippy = overview._windowTopGrippy;

    topHandle.setTranslateX(handleX);
    topHandleBackground.setWidth(width);
    topGrippy.setTranslateX(grippyX);

    var bottomHandleBackground = overview._windowBottomHandleBackground;
    var bottomHandle = overview._windowBottomHandle;
    var bottomGrippy = overview._windowBottomGrippy;

    bottomHandle.setTranslateX(handleX);
    bottomHandleBackground.setWidth(width);
    bottomGrippy.setTranslateX(grippyX);
  }
};

/**
 * Updates the height of the sliding window of an overveiw.
 * @param {dvt.Overview} overview The overview being rendered.
 * @param {dvt.Rectangle} slidingWindow The sliding window of the overview.
 * @param {number} height The new height of the sliding window.
 * @private
 */
DvtOverviewRenderer._setSlidingWindowHeight = function(overview, slidingWindow, height)
{
  // make sure the height is within the maximum and minimum sizes specified
  height = Math.min(overview.getMaximumWindowHeight(), Math.max(overview.getMinimumWindowHeight(), height));
  slidingWindow.setHeight(height);

  // if resize feature is off then there's nothing else to do
  if (overview.isFeatureOff('zoom'))
    return;

  // update the resize handles
  if (overview.isHorizontalScrollingEnabled())
  {
    var handleY = (height - 36) / 2;
    if (overview._horHandleBackgroundImage)
      var grippyY = (height - overview._horHandleHeight) / 2;
    else
      grippyY = handleY;

    var leftHandleBackground = overview._windowLeftHandleBackground;
    var leftHandle = overview._windowLeftHandle;
    var leftGrippy = overview._windowLeftGrippy;

    leftHandle.setTranslateY(handleY);
    leftHandleBackground.setHeight(height);
    leftGrippy.setTranslateY(grippyY);

    var rightHandleBackground = overview._windowRightHandleBackground;
    var rightHandle = overview._windowRightHandle;
    var rightGrippy = overview._windowRightGrippy;

    rightHandle.setTranslateY(handleY);
    rightHandleBackground.setHeight(height);
    rightGrippy.setTranslateY(grippyY);
  }
  if (overview.isVerticalScrollingEnabled())
  {
    var bottomHandleBackground = overview._windowBottomHandleBackground;
    var bottomHandle = overview._windowBottomHandle;
    var bottomGrippy = overview._windowBottomGrippy;

    bottomHandle.setTranslateY(height);
    bottomHandleBackground.setTranslateY(height - overview.getHandleSize());
    bottomGrippy.setTranslateY(height - overview.getGrippySize());
  }
};

/**
 * Renders the top bar of the time axis of an overveiw.
 * @param {dvt.Overview} overview The overview being rendered.
 * @private
 */
DvtOverviewRenderer._renderTimeAxisTopBar = function(overview)
{
  var width = overview.Width;
  var height = overview.Height;

  // border above time axis
  if (overview.isVertical())
  {
    if (overview.isRTL())
      var timeAxisTopBar = new dvt.Line(overview.getCtx(), overview.getTimeAxisWidth(), 0, overview.getTimeAxisWidth(), height, 'tab');
    else
      timeAxisTopBar = new dvt.Line(overview.getCtx(), width - overview.getTimeAxisWidth(), 0, width - overview.getTimeAxisWidth(), height, 'tab');
  }
  else
  {
    if (overview.isOverviewAbove())
      timeAxisTopBar = new dvt.Line(overview.getCtx(), 0, overview.getTimeAxisHeight(), width, overview.getTimeAxisHeight(), 'tab');
    else
      timeAxisTopBar = new dvt.Line(overview.getCtx(), 0, height - overview.getTimeAxisHeight(), width, height - overview.getTimeAxisHeight(), 'tab');
  }
  timeAxisTopBar.setSolidStroke(overview._timeAxisBarColor, overview._timeAxisBarOpacity);

  // Do not antialias the time axis top bar
  timeAxisTopBar.setPixelHinting(true);
  overview._timeAxisTopBar = timeAxisTopBar;

  overview.addChild(timeAxisTopBar);
};

/**
 * Renders the left and right filters of an overveiw.
 * @param {dvt.Overview} overview The overview being rendered.
 * @param {nubmer} handleStart The start position of the window handle.
 * @private
 */
DvtOverviewRenderer._renderLeftAndRightFilters = function(overview, handleStart)
{
  var width = overview.Width;
  var height = overview.Height;

  if (overview.isLeftAndRightFilterRendered())
  {
    if (overview.isVertical())
    {
      var leftBackground = new dvt.Rect(overview.getCtx(), 0, 0, width, 0, 'lbg');
      var rightBackground = new dvt.Rect(overview.getCtx(), 0, 0, width, 0, 'rbg');
    }
    else
    {
      leftBackground = new dvt.Rect(overview.getCtx(), 0, 0, 0, height, 'lbg');
      rightBackground = new dvt.Rect(overview.getCtx(), 0, 0, 0, height, 'rbg');
    }

    leftBackground.setSolidFill(overview._leftFilterPanelColor, overview._leftFilterPanelAlpha);
    overview.addChild(leftBackground);
    rightBackground.setSolidFill(overview._rightFilterPanelColor, overview._rightFilterPanelAlpha);
    overview.addChild(rightBackground);

    // the left and right background resize handle are needed for touch because the touch area for resize handle goes
    // beyond the handle and into the left and right background area, so we'll need something on top of the background
    if (dvt.OverviewUtils.supportsTouch() && handleStart != undefined)
    {
      if (overview.isVertical())
      {
        var leftBackgroundResizeHandle = new dvt.Rect(overview.getCtx(), 0, 0, width, handleStart, 'lbgrh');
        var rightBackgroundResizeHandle = new dvt.Rect(overview.getCtx(), 0, 0, width, handleStart, 'rbgrh');
      }
      else
      {
        leftBackgroundResizeHandle = new dvt.Rect(overview.getCtx(), 0, 0, handleStart, height, 'lbgrh');
        rightBackgroundResizeHandle = new dvt.Rect(overview.getCtx(), 0, 0, handleStart, height, 'rbgrh');
      }

      leftBackgroundResizeHandle.setSolidFill(overview._leftFilterPanelColor, 0);
      overview.addChild(leftBackgroundResizeHandle);
      rightBackgroundResizeHandle.setSolidFill(overview._rightFilterPanelColor, 0);
      overview.addChild(rightBackgroundResizeHandle);
    }
  }
};

/**
 * Renders the time axis of the overview.
 * @param {dvt.Overview} overview The overview being rendered.
 * @private
 */
DvtOverviewRenderer._renderTimeAxis = function(overview)
{
  if (overview._ticks == null)
    return;

  var width = overview.Width;
  var height = overview.Height;
  var vertical = overview.isVertical();
  var size = overview.getOverviewSize();

  for (var i = 0; i < overview._ticks.length; i++)
  {
    var child = overview._ticks[i];

    var time = parseInt(child['time'], 10);
    if (vertical)
      var time_pos = overview.getDateYPosition(time);
    else
      time_pos = overview.getDateXPosition(time);
    var label = child['label'];

    var maxWidth = 0;
    if (i + 1 < overview._ticks.length)
    {
      var next_time = parseInt(overview._ticks[i + 1]['time'], 10);
      if (vertical)
        var next_time_pos = overview.getDateYPosition(next_time);
      else
        next_time_pos = overview.getDateXPosition(next_time);
      maxWidth = next_time_pos - time_pos;
    }
    else
    {
      // last label
      maxWidth = size - time_pos;
    }

    if (overview.isHorizontalRTL())
      time_pos = size - time_pos;

    if (vertical)
      maxWidth = width;

    maxWidth -= (DvtOverviewStyleUtils._DEFAULT_AXIS_LABEL_PADDING * 2);
    DvtOverviewRenderer._addTick(overview, time_pos, width, height, 'tick' + i);
    DvtOverviewRenderer._addLabel(overview, time_pos, label, height, maxWidth, 'label' + i, overview._labelStyle);
  }
};

/**
 * Creates a tick mark of the time axis.
 * @param {dvt.Overview} overview The overview being rendered.
 * @param {number} pos The position of the tick mark.
 * @param {number} width The width of the tick mark.
 * @param {number} height The height of the tick mark.
 * @param {String} id The id of the tick mark.
 * @private
 */
DvtOverviewRenderer._addTick = function(overview, pos, width, height, id)
{
  if (overview.isVertical())
    var line = new dvt.Line(overview.getCtx(), 0, pos, width, pos, id);
  else
    line = new dvt.Line(overview.getCtx(), pos, 0, pos, height, id);
  var stroke = new dvt.Stroke(overview._timeIndicatorColor, 1, 1, false, {dashArray: '3'});
  line.setStroke(stroke);

  // Do not antialias tick marks
  line.setPixelHinting(true);

  overview.addChild(line);
};

/**
 * Creates a label of the time axis.
 * @param {dvt.Overview} overview The overview being rendered.
 * @param {number} pos The position of the label.
 * @param {String} text The text of the label.
 * @param {number} height The height of the label.
 * @param {number} maxWidth The maximum width of the label.
 * @param {String} id The id of the label.
 * @param {dvt.CSSStyle} labelStyle The styling of the label.
 * @private
 */
DvtOverviewRenderer._addLabel = function(overview, pos, text, height, maxWidth, id, labelStyle)
{
  if (overview.isVertical())
  {
    var label = new dvt.OutputText(overview.getCtx(), text, 4, pos, id);
    label.setCSSStyle(labelStyle);
    if (overview.isRTL())
    {
      var dim = label.getDimensions();
      label.setX(Math.max(4, overview.Width - dim.w - 4));
    }
  }
  else
  {
    if (overview.isOverviewAbove())
      var y = 2;
    else
      y = height - overview.getTimeAxisHeight() + 2;

    var padding = DvtOverviewStyleUtils._DEFAULT_AXIS_LABEL_PADDING;
    label = new dvt.OutputText(overview.getCtx(), text, pos + padding, y, id);
    label.setCSSStyle(labelStyle);
    if (overview.isHorizontalRTL())
    {
      dim = label.getDimensions();
      label.setX(pos - Math.min(dim.w, maxWidth) - padding);
    }
  }

  dvt.TextUtils.fitText(label, maxWidth, Infinity, overview);

  // save the raw text for tooltip
  label._rawText = label.getUntruncatedTextString();
};

/**
 * Parses through formatted time ranges.
 * @param {dvt.Overview} overview The overview being rendered.
 * @private
 */
DvtOverviewRenderer._parseFilledTimeRanges = function(overview)
{
  if (overview._formattedTimeRanges == null)
    return;

  // draw filled time ranges so that it is over the sliding window but under the markers
  for (var i = 0; i < overview._formattedTimeRanges.length; i++)
  {
    var ftr = overview._formattedTimeRanges[i];
    DvtOverviewRenderer._addFilledTimeRange(overview, ftr, overview.Width, overview.Height);
  }
};

/**
 * Creates a formatted time range.
 * @param {dvt.Overview} overview The overview being rendered.
 * @param {object} elem The formatted time range.
 * @param {number} width The width of the overview.
 * @param {number} height The height of the overview.
 * @private
 */
DvtOverviewRenderer._addFilledTimeRange = function(overview, elem, width, height)
{
  var rangeStart = parseInt(elem['rs'], 10);
  var rangeEnd = parseInt(elem['re'], 10);

  if (rangeStart != null && rangeEnd != null)
  {
    var color = elem['c'];
    var size = overview.getOverviewSize();

    if (!overview.isVertical())
    {
      var rangeStart_pos = overview.getDateXPosition(rangeStart);
      var rangeEnd_pos = overview.getDateXPosition(rangeEnd);
    }
    else
    {
      rangeStart_pos = overview.getDateYPosition(rangeStart);
      rangeEnd_pos = overview.getDateYPosition(rangeEnd);
    }
    var rangeWidth = rangeEnd_pos - rangeStart_pos;
    if (overview.isHorizontalRTL())
    {
      rangeStart_pos = size - rangeStart_pos - rangeWidth;
      rangeEnd_pos = size - rangeEnd_pos - rangeWidth;
    }

    if (overview.isVertical())
      var displayable = new dvt.Rect(overview.getCtx(), 0, rangeStart_pos, width - overview.getTimeAxisWidth(), rangeWidth, 'ftr');
    else
      displayable = new dvt.Rect(overview.getCtx(), rangeStart_pos, overview.isOverviewAbove() ? overview.getTimeAxisHeight() : 0, rangeWidth, height - overview.getTimeAxisHeight(), 'ftr');

    if (color != null)
      displayable.setSolidFill(color, 0.4);
    displayable.setCursor('move');

    // Do not antialias filled time range
    displayable.setPixelHinting(true);

    overview.addChild(displayable);
  }
};

/**
 * Updates the current time of the overview.
 * @param {dvt.Overview} overview The overview being rendered.
 * @private
 */
DvtOverviewRenderer._updateCurrentTime = function(overview)
{
  var width = overview.Width;
  var height = overview.Height;

  // return if current time is invalid or outside of the time range
  if (overview._currentTime == null || isNaN(overview._currentTime) || overview._currentTime < overview._xMin || overview._currentTime > overview._xMax)
    return;

  if (overview.isVertical())
  {
    var time_pos = overview.getDateYPosition(overview._currentTime);
    var line = new dvt.Line(overview.getCtx(), 0, time_pos, width, time_pos, 'ocd');
  }
  else
  {
    time_pos = overview.getDateXPosition(overview._currentTime);
    if (overview.isRTL())
      time_pos = width - time_pos;
    line = new dvt.Line(overview.getCtx(), time_pos, 0, time_pos, height, 'ocd');
  }
  line.setSolidStroke(overview._currentTimeIndicatorColor);

  // Do not antialias current time line
  line.setPixelHinting(true);

  overview.addChild(line);
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/**
 * Style related utility functions for dvt.Overview.
 * @class
 */
var DvtOverviewStyleUtils = new Object();

dvt.Obj.createSubclass(DvtOverviewStyleUtils, dvt.Obj);

/**
 * Attribute for axis label padding.
 * @const
 * @private
 */
DvtOverviewStyleUtils._DEFAULT_AXIS_LABEL_PADDING = 5;

/**
 * Attribute for default window border width.
 * @const
 * @private
 */
DvtOverviewStyleUtils._DEFAULT_WINDOW_BORDER_WIDTH = 1;

/**
 * Gets the handle fill color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The handle fill color.
 */
DvtOverviewStyleUtils.getHandleFillColor = function(options)
{
  if (options['_hfc'] != null)
    return options['_hfc'];
  else
    return options['style']['handleFillColor'];
};

/**
 * Gets the handle texture color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The handle texture color.
 */
DvtOverviewStyleUtils.getHandleTextureColor = function(options)
{
  if (options['_htc'] != null)
    return options['_htc'];
  else
    return options['style']['handleTextureColor'];
};

/**
 * Gets the handle background image.
 * @param {object} options The object containing data and specifications for the component.
 * @param {boolean} isVertical Whether or not this is the vertical handle.
 * @return {string} The handle background image.
 */
DvtOverviewStyleUtils.getHandleBackgroundImage = function(options, isVertical)
{
  if (!isVertical)
  {
    if (options['_hbi'] != null)
      return options['_hbi'];
    else
      return options['style']['handleBackgroundImage'];
  }
  else
  {
    if (options['_vhbi'] != null)
      return options['_vhbi'];
    else
      return options['style']['vertHandleBackgroundImage'];
  }
};

/**
 * Gets the handle width.
 * @param {object} options The object containing data and specifications for the component.
 * @param {boolean} isVertical Whether or not this is the vertical handle.
 * @return {number} The handle width.
 */
DvtOverviewStyleUtils.getHandleWidth = function(options, isVertical)
{
  if (!isVertical)
  {
    if (options['_hw'] != null)
      return options['_hw'];
    else
      return options['style']['handleWidth'];
  }
  else
  {
    if (options['_vhw'] != null)
      return options['_vhw'];
    else
      return options['style']['vertHandleWidth'];
  }
};

/**
 * Gets the handle height.
 * @param {object} options The object containing data and specifications for the component.
 * @param {boolean} isVertical Whether or not this is the vertical handle.
 * @return {number} The handle height.
 */
DvtOverviewStyleUtils.getHandleHeight = function(options, isVertical)
{
  if (!isVertical)
  {
    if (options['_hh'] != null)
      return options['_hh'];
    else
      return options['style']['handleHeight'];
  }
  else
  {
    if (options['_vhh'] != null)
      return options['_vhh'];
    else
      return options['style']['vertHandleHeight'];
  }
};

/**
 * Gets the top border color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The top border color.
 */
DvtOverviewStyleUtils.getBorderTopColor = function(options)
{
  if (options['_btc'] != null)
    return options['_btc'];
  else
    return options['style']['borderTopColor'];
};

/**
 * Gets the top border style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The top border style.
 */
DvtOverviewStyleUtils.getBorderTopStyle = function(options)
{
  if (options['_bts'] != null)
    return options['_bts'];
  else
    return options['style']['borderTopStyle'];
};

/**
 * Gets the window background color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The window background color.
 */
DvtOverviewStyleUtils.getWindowBackgroundColor = function(options)
{
  if (options['_wbc'] != null)
    return options['_wbc'];
  else
    return options['style']['windowBackgroundColor'];
};

/**
 * Gets the window background opacity.
 * @param {object} options The object containing data and specifications for the component.
 * @return {number} The window background opacity.
 */
DvtOverviewStyleUtils.getWindowBackgroundAlpha = function(options)
{
  return options['style']['windowBackgroundAlpha'];
};

/**
 * Gets the top window border style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The top window border style.
 */
DvtOverviewStyleUtils.getWindowBorderTopStyle = function(options)
{
  if (options['_wbts'] != null)
    return options['_wbts'];
  else
    return options['style']['windowBorderTopStyle'];
};

/**
 * Gets the right window border style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The right window border style.
 */
DvtOverviewStyleUtils.getWindowBorderRightStyle = function(options)
{
  if (options['_wbrs'] != null)
    return options['_wbrs'];
  else
    return options['style']['windowBorderRightStyle'];
};

/**
 * Gets the bottom window border style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The bottom window border style.
 */
DvtOverviewStyleUtils.getWindowBorderBottomStyle = function(options)
{
  if (options['_wbbs'] != null)
    return options['_wbbs'];
  else
    return options['style']['windowBorderBottomStyle'];
};

/**
 * Gets the left window border style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The left window border style.
 */
DvtOverviewStyleUtils.getWindowBorderLeftStyle = function(options)
{
  if (options['_wbls'] != null)
    return options['_wbls'];
  else
    return options['style']['windowBorderLeftStyle'];
};

/**
 * Gets the top window border color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The top window border color.
 */
DvtOverviewStyleUtils.getWindowBorderTopColor = function(options)
{
  if (options['_wbtc'] != null)
    return options['_wbtc'];
  else
    return options['style']['windowBorderTopColor'];
};

/**
 * Gets the right window border color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The right window border color.
 */
DvtOverviewStyleUtils.getWindowBorderRightColor = function(options)
{
  if (options['_wbrc'] != null)
    return options['_wbrc'];
  else
    return options['style']['windowBorderRightColor'];
};

/**
 * Gets the bottom window border color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The bottom window border color.
 */
DvtOverviewStyleUtils.getWindowBorderBottomColor = function(options)
{
  if (options['_wbbc'] != null)
    return options['_wbbc'];
  else
    return options['style']['windowBorderBottomColor'];
};

/**
 * Gets the left window border color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The left window border color.
 */
DvtOverviewStyleUtils.getWindowBorderLeftColor = function(options)
{
  if (options['_wblc'] != null)
    return options['_wblc'];
  else
    return options['style']['windowBorderLeftColor'];
};

/**
 * Gets the overview background color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The overview background color.
 */
DvtOverviewStyleUtils.getOverviewBackgroundColor = function(options)
{
  if (options['_obc'] != null)
    return options['_obc'];
  else
    return options['style']['overviewBackgroundColor'];
};

/**
 * Gets the current time indicator color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The current time indicator color.
 */
DvtOverviewStyleUtils.getCurrentTimeIndicatorColor = function(options)
{
  if (options['_ctic'] != null)
    return options['_ctic'];
  else
    return options['style']['currentTimeIndicatorColor'];
};

/**
 * Gets the time axis bar color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The time axis bar color.
 */
DvtOverviewStyleUtils.getTimeAxisBarColor = function(options)
{
  if (options['_tabc'] != null)
    return options['_tabc'];
  else
    return options['style']['timeAxisBarColor'];
};

/**
 * Gets the time axis bar opacity.
 * @param {object} options The object containing data and specifications for the component.
 * @return {number} The time axis bar opacity.
 */
DvtOverviewStyleUtils.getTimeAxisBarAlpha = function(options)
{
  if (options['_tabo'] != null)
    return options['_tabo'];
  else
    return options['style']['timeAxisBarAlpha'];
};

/**
 * Gets the time indicator color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The time indicator color.
 */
DvtOverviewStyleUtils.getTimeIndicatorColor = function(options)
{
  if (options['_tic'] != null)
    return options['_tic'];
  else
    return options['style']['timeIndicatorColor'];
};

/**
 * Gets the left filter panel color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The left filter panel color.
 */
DvtOverviewStyleUtils.getLeftFilterPanelColor = function(options)
{
  return options['style']['leftFilterPanelColor'];
};

/**
 * Gets the left filter panel opacity.
 * @param {object} options The object containing data and specifications for the component.
 * @return {number} The left filter panel opacity.
 */
DvtOverviewStyleUtils.getLeftFilterPanelAlpha = function(options)
{
  return options['style']['leftFilterPanelAlpha'];
};

/**
 * Gets the right filter panel color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The right filter panel color.
 */
DvtOverviewStyleUtils.getRightFilterPanelColor = function(options)
{
  return options['style']['rightFilterPanelColor'];
};

/**
 * Gets the right filter panel opacity.
 * @param {object} options The object containing data and specifications for the component.
 * @return {number} The right filter panel opacity.
 */
DvtOverviewStyleUtils.getRightFilterPanelAlpha = function(options)
{
  return options['style']['rightFilterPanelAlpha'];
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
})(dvt);

  return dvt;
});
