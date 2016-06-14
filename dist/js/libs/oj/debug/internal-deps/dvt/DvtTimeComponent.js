/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

/**
 * This is the base class for all time based components (Gantt, Timeline).  It handles the following:
 * - all common attributes (start time, end time etc.)
 * - association with the generic overview component
 * - scrolling, including autoscroll
 * - creation of scrollable canvas
 * - zoom
 * - time axis (multiple)
 * - current time and highlighted time period
 *
 * @param {dvt.Context} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function.
 * @class
 * @constructor
 * @extends {dvt.BaseComponent}
 */
dvt.TimeComponent = function(context, callback, callbackObj)
{
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.TimeComponent, dvt.BaseComponent);

/**
 * Initializes the view.
 * @param {dvt.Context} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @protected
 */
dvt.TimeComponent.prototype.Init = function(context, callback, callbackObj) 
{
  dvt.TimeComponent.superclass.Init.call(this, context, callback, callbackObj);
  this._virtualize = false;
};


/**
 * Renders the component using the specified xml.  If no xml is supplied to a component
 * that has already been rendered, this function will rerender the component with the
 * specified size.
 * @param {string} xml The component xml.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
dvt.TimeComponent.prototype.render = function(width, height, options) 
{
  if (options)
    this.SetOptions(options);

  // Store the size
  this.Width = width;
  this.Height = height;

  // If new xml is provided, parse it and apply the properties
  if (this.Options)
  {
    var props = this.Parse(this.Options);
    this._applyParsedProperties(props);
  }
};

/**
 * @override
 */
dvt.TimeComponent.prototype.SetOptions = function(options)
{
  this.Options = dvt.JsonUtils.clone(options);
};

dvt.TimeComponent.prototype._applyParsedProperties = function(props)
{
  this._origStart = props.origStart;
  this._origEnd = props.origEnd;
  this._start = props.start;
  this._end = props.end;
  this._inlineStyle = props.inlineStyle;

  this.applyStyleValues();
};

/**
 * Combines style defaults with the styles provided
 *
 */
dvt.TimeComponent.prototype.applyStyleValues = function()
{
  this._style.parseInlineStyle(this._inlineStyle);
};

//////////// attribute methods ////////////////////////////
dvt.TimeComponent.prototype.isAnimationEnabled = function()
{
  return false;
};

dvt.TimeComponent.prototype.getAdjustedStartTime = function() 
{
  return this._start;
};

dvt.TimeComponent.prototype.getAdjustedEndTime = function() 
{
  return this._end;
};


/**
 * Returns the overall (virtualized) length of the content
 */
dvt.TimeComponent.prototype.getContentLength = function() 
{
  return this._contentLength;
};

dvt.TimeComponent.prototype.setContentLength = function(length)
{
  if (this._canvasLength < length)
    this._contentLength = length;
  else
    this._contentLength = this._canvasLength;

  if (!this._virtualize)
  {
    this._fetchStartPos = 0;
    this._fetchEndPos = this._contentLength;
  }
};

dvt.TimeComponent.prototype.isRTL = function()
{
  return dvt.Agent.isRightToLeft(this.getCtx());
};

/**
 * Returns whether the component has a vertical orientation.
 */
dvt.TimeComponent.prototype.isVertical = function()
{
  return this._isVertical;
};

/**
 * Renders the time zoom canvas of a this component.
 * @param {dvt.Container} container The container to render into.
 */
dvt.TimeComponent.prototype.renderTimeZoomCanvas = function(container)
{
  if (this._timeZoomCanvas)
    this._timeZoomCanvas.setClipPath(null);
  else
    this._timeZoomCanvas = new dvt.Container(this.getCtx(), 'iCanvas');

  var cp = new dvt.ClipPath();
  if (this.isVertical())
  {
    cp.addRect(this._startX, this._startY, this._canvasSize, this._canvasLength);
    this._timeZoomCanvas.setTranslateX(this._startX);
    this._timeZoomCanvas.setTranslateY(this._startY + this.getAbsoluteStartPos());
  }
  else
  {
    cp.addRect(this._startX, this._startY, this._canvasLength, this._canvasSize);
    this._timeZoomCanvas.setTranslateX(this._startX + this.getAbsoluteStartPos());
    this._timeZoomCanvas.setTranslateY(this._startY);
  }
  container.setClipPath(cp);

  if (this._timeZoomCanvas.getParent() != container)
    container.addChild(this._timeZoomCanvas);
};

dvt.TimeComponent.prototype.getTimeZoomCanvas = function()
{
  return this._timeZoomCanvas;
};

dvt.TimeComponent.prototype.HandleMouseWheel = function(event)
{
  dvt.EventManager.consumeEvent(event);
  var wheelDelta = event.wheelDelta;
  if (this.hasValidOptions() && wheelDelta)
  {
    var compPagePos = this.getCtx().getStageAbsolutePosition();
    if (this._isVertical)
      var compLoc = event.pageY - compPagePos.y;
    else
      compLoc = event.pageX - compPagePos.x;
    var widthFactor = (this._end - this._start) / this._contentLength;
    var time = widthFactor * compLoc + this._viewStartTime;

    wheelDelta = (wheelDelta * .02) + 1;
    this.handleZoomWheel(this.getContentLength() * wheelDelta, time, compLoc, true);
  }
};

dvt.TimeComponent.prototype.handleZoomWheel = function(newLength, time, compLoc, triggerViewportChangeEvent)
{
  if (newLength > this._maxContentLength)
  {
    newLength = this._maxContentLength;
    this.disableZoomButton(true);
  }
  else
    this.enableZoomButton(true);
  if (this._canvasLength > newLength)
  {
    newLength = this._canvasLength;
    this.disableZoomButton(false);
  }
  else
    this.enableZoomButton(false);
  var zoomIn = this._contentLength <= newLength;
  var oldViewTime = this._viewEndTime - this._viewStartTime;
  var viewLength = (oldViewTime / (this._end - this._start)) * this._contentLength;
  this.setContentLength(newLength);
  var viewTime = (viewLength / this._contentLength) * (this._end - this._start);
  if (time)
  {
    var widthFactor = (this._end - this._start) / this._contentLength;
    this._viewStartTime = time - (compLoc * widthFactor);
    if (this._viewStartTime < this._start)
      this._viewStartTime = this._start;
    this._viewEndTime = this._viewStartTime + viewTime;
    if (this._viewEndTime > this._end)
    {
      this._viewEndTime = this._end;
      this._viewStartTime = this._viewEndTime - viewTime;
      if (this._viewStartTime < this._start)
        this._viewStartTime = this._start;
    }
    this.setRelativeStartPos((1 / widthFactor) * (this._start - this._viewStartTime));
  }
  else
  {
    this._viewStartTime = this._start;
    this._viewEndTime = this._viewStartTime + viewTime;
    if (this._viewStartTime < this._start)
      this._viewStartTime = this._start;
    this.setRelativeStartPos(0);
  }
  if (zoomIn)
  {
    while (this._zoomLevelOrder > 0)
    {
      var minLength = this._zoomLevelLengths[this._zoomLevelOrder - 1];
      if (this._contentLength >= minLength)
      {
        this._zoomLevelOrder--;
        this._timeAxis.decreaseScale();
        this._scale = this._timeAxis._scale;
      }
      else
        break;
    }
  }
  else
  {
    while (this._zoomLevelOrder < this._zoomLevelLengths.length - 1)
    {
      var minLength = this._zoomLevelLengths[this._zoomLevelOrder];
      if (this._contentLength < minLength)
      {
        this._zoomLevelOrder++;
        this._timeAxis.increaseScale();
        this._scale = this._timeAxis._scale;
      }
      else
        break;
    }
  }
  this.applyTimeZoomCanvasPosition();
};

/**
 * Zooms by the specified amount.
 * @param {number} dz A number specifying the zoom ratio, e.g. dz = 2 means zoom in by 200%.
 */
dvt.TimeComponent.prototype.zoomBy = function(dz)
{
  var shiftRatio = (1 / dz - 1) / 2 + 1;
  if (this._isVertical)
    var compLoc = this.Height / 2;
  else
    compLoc = this.Width / 2;
  var widthFactor = (this._end - this._start) / this._contentLength;
  var time = widthFactor * compLoc + this._viewStartTime;
  this.handleZoomWheel(this.getContentLength() * shiftRatio, time, compLoc, true);
};

dvt.TimeComponent.prototype.beginPinchZoom = function(x1, y1, x2, y2)
{
  if (this._isVertical)
    this._initialPinchZoomLoc = Math.sqrt((y1 - y2) * (y1 - y2)) + (y1 < y2 ? y1 : y2);
  else
    this._initialPinchZoomLoc = Math.sqrt((x1 - x2) * (x1 - x2)) + (x1 < x2 ? x1 : x2);
  var widthFactor = (this._end - this._start) / this._contentLength;
  this._initialPinchZoomTime = widthFactor * this._initialPinchZoomLoc + this._viewStartTime;
  this._initialPinchZoomDist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  this._initialPinchZoomLength = this._contentLength;
};

dvt.TimeComponent.prototype.contPinchZoom = function(x1, y1, x2, y2)
{
  var currPinchZoomDist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  if (currPinchZoomDist != this._initialPinchZoomDist)
    this._triggerViewportChange = true;
  var newLength = ((currPinchZoomDist / this._initialPinchZoomDist) * this._initialPinchZoomLength);
  this.handleZoomWheel(newLength, this._initialPinchZoomTime, this._initialPinchZoomLoc, false);
};

dvt.TimeComponent.prototype.endPinchZoom = function()
{
  this._initialPinchZoomDist = null;
  this._initialPinchZoomLoc = null;
  this._initialPinchZoomLength = null;
  this._initialPinchZoomTime = null;
  if (this._triggerViewportChange)
  {
    this._triggerViewportChange = false;
    this.dispatchEvent(dvt.EventFactory.newTimelineViewportChangeEvent(this._viewStartTime, this._viewEndTime, this._scale));
  }
};

/**
 * Pans the Timeline by the specified amount.
 * @param {number} delta The number of pixels to pan the canvas.
 */
dvt.TimeComponent.prototype.panZoomCanvasBy = function(delta)
{
  if (this._isVertical)
  {
    var newTranslateY = this._timeZoomCanvas.getTranslateY() - delta;
    var minTranslateY = -(this._contentLength - this._canvasLength - this._startY);
    var maxTranslateY = this._startY;

    if (newTranslateY < minTranslateY)
      newTranslateY = minTranslateY;
    else if (newTranslateY > maxTranslateY)
      newTranslateY = maxTranslateY;
    this._timeZoomCanvas.setTranslateY(newTranslateY);

    var startPos = newTranslateY - this._startY;
    this.setAbsoluteStartPos(startPos);
    var widthFactor = this.getContentLength() / (this._end - this._start);
    var viewTime = this._viewEndTime - this._viewStartTime;
    this._viewStartTime = this._start - (startPos / widthFactor);
    this._viewEndTime = this._viewStartTime + viewTime;
  }
  else
  {
    var newTranslateX = this._timeZoomCanvas.getTranslateX() - delta;
    var minTranslateX = -(this._contentLength - this._canvasLength - this._startX);
    var maxTranslateX = this._startX;

    if (newTranslateX < minTranslateX)
      newTranslateX = minTranslateX;
    else if (newTranslateX > maxTranslateX)
      newTranslateX = maxTranslateX;
    this._timeZoomCanvas.setTranslateX(newTranslateX);

    this.setAbsoluteStartPos(newTranslateX - this._startX);
    startPos = this.getRelativeStartPos();
    widthFactor = this.getContentLength() / (this._end - this._start);
    viewTime = this._viewEndTime - this._viewStartTime;
    this._viewStartTime = this._start - (startPos / widthFactor);
    this._viewEndTime = this._viewStartTime + viewTime;
  }
};

dvt.TimeComponent.prototype.handleZoom = function(zoomIn)
{
  if (!zoomIn)
    this.zoomBy(dvt.Timeline.ZOOM_BY_VALUE);
  else
    this.zoomBy(1 / dvt.Timeline.ZOOM_BY_VALUE);
};

dvt.TimeComponent.prototype.enableZoomButton = function(isZoomIn)
{
  if (isZoomIn)
  {
    this.zoomin.setEnabled(true);
    this.zoomin.drawUpState();
  }
  else
  {
    this.zoomout.setEnabled(true);
    this.zoomout.drawUpState();
  }
};

dvt.TimeComponent.prototype.disableZoomButton = function(isZoomIn)
{
  if (isZoomIn)
  {
    this.zoomin.setEnabled(false);
    this.zoomin.drawDisabledState();
    this.zoomin.setCursor(null);
  }
  else
  {
    this.zoomout.setEnabled(false);
    this.zoomout.drawDisabledState();
    this.zoomout.setCursor(null);
  }
};

dvt.TimeComponent.prototype.applyTimeZoomCanvasPosition = function()
{
  if (this._isVertical)
    this._timeZoomCanvas.setTranslateY(this._startY + this.getAbsoluteStartPos());
  else
    this._timeZoomCanvas.setTranslateX(this._startX + this.getAbsoluteStartPos());
};

/**
 * Returns the absolute start position of the timeline.
 * @return {number} The absolute start position of the timeline.
 */
dvt.TimeComponent.prototype.getAbsoluteStartPos = function()
{
  return this._startPos;
};

/**
 * Sets the absolute start position of the timeline.
 * @param {number} startPos The absolute start position of the timeline.
 */
dvt.TimeComponent.prototype.setAbsoluteStartPos = function(startPos)
{
  this._startPos = startPos;
};

/**
 * Returns the timeline's start position relative to the reading direction.
 * @return {number} The timeline's start position relative to the reading direction.
 */
dvt.TimeComponent.prototype.getRelativeStartPos = function()
{
  if (this.isRTL() && !this._isVertical)
    return this._canvasLength - this._contentLength - this._startPos;
  else
    return this._startPos;
};

/**
 * Sets the timeline's start position relative to the reading direction.
 * @param {number} startPos The timeline's start position relative to the reading direction.
 */
dvt.TimeComponent.prototype.setRelativeStartPos = function(startPos)
{
  if (this.isRTL() && !this._isVertical)
    this._startPos = this._canvasLength - this._contentLength - startPos;
  else
    this._startPos = startPos;
};

/**
 * Returns the start offset value of this component in the x direction.
 * @return {number} The start offset value of this component in the x direction.
 */
dvt.TimeComponent.prototype.getStartXOffset = function()
{
  return this._startX;
};

/**
 * Sets the start offset value of this component in the x direction.
 * @param {number} startX The start offset value of this component in the x direction.
 */
dvt.TimeComponent.prototype.setStartXOffset = function(startX)
{
  this._startX = startX;
};

/**
 * Returns the start offset value of this component in the y direction.
 * @return {number} The start offset value of this component in the y direction.
 */
dvt.TimeComponent.prototype.getStartYOffset = function()
{
  return this._startY;
};

/**
 * Sets the start offset value of this component in the y direction.
 * @param {number} startY The start offset value of this component in the y direction.
 */
dvt.TimeComponent.prototype.setStartYOffset = function(startY)
{
  this._startY = startY;
};

  return dvt;
});
