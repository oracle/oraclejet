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
(function (dvt) {
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

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
  dvt.TimeComponent = function (context, callback, callbackObj) {
    this.Init(context, callback, callbackObj);
  };

  dvt.Obj.createSubclass(dvt.TimeComponent, dvt.BaseComponent);
  dvt.TimeComponent.ZOOM_BY_VALUE = 1.5;
  dvt.TimeComponent.SCROLL_LINE_HEIGHT = 15;
  dvt.TimeComponent.WHEEL_UNITS_PER_LINE = 40;
  /**
   * Initializes the view.
   * @param {dvt.Context} context The rendering context.
   * @param {object} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The object context for the callback function
   * @protected
   */

  dvt.TimeComponent.prototype.Init = function (context, callback, callbackObj) {
    dvt.TimeComponent.superclass.Init.call(this, context, callback, callbackObj);
    this.SetPanningEnabled(true); // enable panning

    this._virtualize = false;
  };
  /**
   * Renders the component with the specified data.  If no data is supplied to a component
   * that has already been rendered, the component will be rerendered to the specified size.
   * @param {object} options list of options
   * @param {number} width the width of the component
   * @param {number} height the height of the component
   * @override
   */


  dvt.TimeComponent.prototype.render = function (options, width, height) {
    if (options) {
      this._resources = options['_resources'];
      if (this._resources == null) this._resources = [];
      this.SetOptions(options);
    } // Store the size


    this.Width = width;
    this.Height = height; // If new options are provided, parse it and apply the properties

    if (this.Options) {
      var props = this.Parse(this.Options);

      this._applyParsedProperties(props);
    }
  };
  /**
   * @override
   */


  dvt.TimeComponent.prototype.SetOptions = function (options) {
    // Combine the user options with the defaults and store
    this.Options = this.Defaults.calcOptions(options);

    if (dvt.Agent.isEnvironmentTest()) {
      this.Options['animationOnDisplay'] = 'none';
      this.Options['animationOnDataChange'] = 'none';
    }
  };
  /**
   * Removes all children from the component's canvas.
   */


  dvt.TimeComponent.prototype.clearComponent = function () {
    if (this._canvas) this._canvas.removeChildren();
  };

  dvt.TimeComponent.prototype._applyParsedProperties = function (props) {
    this._start = props.start;
    this._end = props.end;
    this._inlineStyle = props.inlineStyle; // not used yet but may be needed to control visibility in the future

    this._timeDirScrollbar = props.timeDirScrollbar;
    this._contentDirScrollbar = props.contentDirScrollbar;
    this.applyStyleValues();
  };
  /**
   * Returns an appropriate version of the data to be publicly exposed through contexts, event payloads, etc.
   * @param {object} data The raw data object
   * @param {string} type The raw data object type. Must be either 'series', 'item', 'row', or 'task'
   * @return {object} The sanitized data
   */


  dvt.TimeComponent.sanitizeData = function (data, type) {
    var seriesCopy;
    var itemCopy;
    var isSeriesData = type === 'series' || type === 'row';

    if (isSeriesData) {
      var itemProp = type === 'series' ? 'items' : 'tasks';

      if (data[itemProp].length > 0) {
        if (data[itemProp][0]._noTemplate) {
          seriesCopy = dvt.JsonUtils.clone(data, null, {
            itemProp: true
          });
          seriesCopy[itemProp] = seriesCopy[itemProp].map(function (item) {
            return item._itemData;
          });
          return seriesCopy;
        } else if (data[itemProp][0]._itemData) {
          seriesCopy = dvt.JsonUtils.clone(data, null, {
            itemProp: true
          });
          seriesCopy[itemProp] = seriesCopy[itemProp].map(function (item) {
            itemCopy = dvt.JsonUtils.clone(item);
            delete itemCopy._itemData;
            return itemCopy;
          });
          return seriesCopy;
        }

        return data;
      }
    } else {
      if (data._noTemplate) {
        return data._itemData;
      } else if (data._itemData) {
        itemCopy = dvt.JsonUtils.clone(data);
        delete itemCopy._itemData;
        return itemCopy;
      }
    }

    return data;
  };
  /**
   * Combines style defaults with the styles provided
   *
   */


  dvt.TimeComponent.prototype.applyStyleValues = function () {
    if (this._style) this._style.parseInlineStyle(this._inlineStyle);
  }; //////////// attribute methods ////////////////////////////


  dvt.TimeComponent.prototype.isAnimationEnabled = function () {
    return false;
  };

  dvt.TimeComponent.prototype.getAdjustedStartTime = function () {
    return this._start;
  };

  dvt.TimeComponent.prototype.getAdjustedEndTime = function () {
    return this._end;
  };
  /**
   * Returns the overall (virtualized) length of the content
   * @return {number} the content length
   */


  dvt.TimeComponent.prototype.getContentLength = function () {
    return this._contentLength;
  };

  dvt.TimeComponent.prototype.setContentLength = function (length) {
    if (this._canvasLength < length) this._contentLength = length;else this._contentLength = this._canvasLength;

    if (!this._virtualize) {
      this._fetchStartPos = 0;
      this._fetchEndPos = this._contentLength;
    }
  };
  /**
   * Gets the canvas size.
   * @return {number} the canvas size.
   */


  dvt.TimeComponent.prototype.getCanvasSize = function () {
    return this._canvasSize;
  };
  /**
   * Gets the canvas length.
   * @return {number} the canvas length.
   */


  dvt.TimeComponent.prototype.getCanvasLength = function () {
    return this._canvasLength;
  };

  dvt.TimeComponent.prototype.isRTL = function () {
    return dvt.Agent.isRightToLeft(this.getCtx());
  };
  /**
   * Returns whether the component has a vertical orientation.
   * @return {boolean} true if vertical, false otherwise.
   */


  dvt.TimeComponent.prototype.isVertical = function () {
    return this._isVertical;
  };
  /**
   * Retrieve the time axis.
   * @return {dvt.TimeAxis} the time axis
   */


  dvt.TimeComponent.prototype.getTimeAxis = function () {
    return null;
  };
  /**
   */


  dvt.TimeComponent.prototype.prepareViewportLength = function () {
    this.setRelativeStartPos(0);

    if (this._viewStartTime && this._viewEndTime) {
      var viewTime = this._viewEndTime - this._viewStartTime;

      if (viewTime > 0) {
        var widthFactor = this._canvasLength / viewTime;
        this.setContentLength(widthFactor * (this._end - this._start));
        this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
      }
    } else {
      var timeAxis = this.getTimeAxis();

      var zoomLevelLength = timeAxis.getZoomLevelLengths()[timeAxis._zoomLevelOrder];

      var startTime = this._start;
      var endTime = this._end;

      if (this._viewStartTime == null) {
        if (this._viewEndTime != null) {
          this._viewStartTime = this._viewEndTime - this._canvasLength / zoomLevelLength * (endTime - startTime);
          if (this._viewStartTime < this._start) this._viewStartTime = this._start;
          var viewTime = this._viewEndTime - this._viewStartTime;
          var widthFactor = this._canvasLength / viewTime;
          this.setContentLength(widthFactor * (this._end - this._start));
          this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
        } else {
          this._viewStartTime = this._start;
          this.setRelativeStartPos(0);
          this._viewEndTime = this._canvasLength / zoomLevelLength * (endTime - startTime) + this._viewStartTime;
          if (this._viewEndTime > this._end) this._viewEndTime = this._end;
        }
      } else {
        this._viewEndTime = this._canvasLength / zoomLevelLength * (endTime - startTime) + this._viewStartTime;
        if (this._viewEndTime > this._end) this._viewEndTime = this._end;
        viewTime = this._viewEndTime - this._viewStartTime;
        widthFactor = this._canvasLength / viewTime;
        this.setContentLength(widthFactor * (this._end - this._start));
        this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
      }
    }
  };
  /**
   * Renders the time zoom canvas of a this component.
   * @param {dvt.Container} container The container to render into.
   */


  dvt.TimeComponent.prototype.renderTimeZoomCanvas = function (container) {
    if (this._timeZoomCanvas) this._timeZoomCanvas.setClipPath(null);else this._timeZoomCanvas = new dvt.Container(this.getCtx(), 'iCanvas');
    var cp = new dvt.ClipPath();

    if (this.isVertical()) {
      cp.addRect(this._startX, this._startY, this._canvasSize, this._canvasLength);

      this._timeZoomCanvas.setTranslateX(this._startX);

      this._timeZoomCanvas.setTranslateY(this._startY + this.getAbsoluteStartPos());
    } else {
      cp.addRect(this._startX, this._startY, this._canvasLength, this._canvasSize);

      this._timeZoomCanvas.setTranslateX(this._startX + this.getAbsoluteStartPos());

      this._timeZoomCanvas.setTranslateY(this._startY);
    }

    container.setClipPath(cp);
    if (this._timeZoomCanvas.getParent() != container) container.addChild(this._timeZoomCanvas);
  };

  dvt.TimeComponent.prototype.getTimeZoomCanvas = function () {
    return this._timeZoomCanvas;
  };
  /**
   * Renders the zoom controls of this component.
   * @param {object} options The zoom controls properties
   */


  dvt.TimeComponent.prototype.renderZoomControls = function (options) {
    var context = this.getCtx();
    var timeAxis = this.getTimeAxis();
    var translations = this.Options.translations; // Zoom in states

    var zoomInOptions = options['zoomInProps'];
    var imageSize = zoomInOptions['imageSize'];
    var cssUrl = zoomInOptions['cssUrl'];
    var cssUrlHover = zoomInOptions['cssUrlHover'];
    var cssUrlActive = zoomInOptions['cssUrlActive'];
    var cssUrlDisabled = zoomInOptions['cssUrlDisabled'];
    var enabledBackgroundColor = zoomInOptions['enabledBackgroundColor'];
    var enabledBorderColor = zoomInOptions['enabledBorderColor'];
    var hoverBackgroundColor = zoomInOptions['hoverBackgroundColor'];
    var hoverBorderColor = zoomInOptions['hoverBorderColor'];
    var activeBackgroundColor = zoomInOptions['activeBackgroundColor'];
    var activeBorderColor = zoomInOptions['activeBorderColor'];
    var disabledBackgroundColor = zoomInOptions['disabledBackgroundColor'];
    var disabledBorderColor = zoomInOptions['disabledBorderColor'];
    var upState = dvt.TransientButton.getStateFromURL(context, cssUrl, imageSize, imageSize, enabledBackgroundColor, enabledBorderColor);
    var overState = dvt.TransientButton.getStateFromURL(context, cssUrlHover, imageSize, imageSize, hoverBackgroundColor, hoverBorderColor);
    var downState = dvt.TransientButton.getStateFromURL(context, cssUrlActive, imageSize, imageSize, activeBackgroundColor, activeBorderColor);
    var disabledState = dvt.TransientButton.getStateFromURL(context, cssUrlDisabled, imageSize, imageSize, disabledBackgroundColor, disabledBorderColor);
    var zoomInPosX = zoomInOptions['posX'];
    var zoomInPosY = zoomInOptions['posY'];

    if (this.zoomin == null) {
      this.zoomin = new dvt.TransientButton(context, upState, overState, downState, disabledState, this.EventManager, this.EventManager.HandleZoomInClick); // In order for tooltips to show up, we need to associate the buttons through the event manager

      this.EventManager.associate(this.zoomin, this.zoomin);
    } else {
      this.zoomin.setUpState(upState);
      this.zoomin.setOverState(overState);
      this.zoomin.setDownState(downState);
      this.zoomin.setDisabledState(disabledState);
    } // Zoom out states


    var zoomOutOptions = options['zoomOutProps'];
    imageSize = zoomOutOptions['imageSize'];
    cssUrl = zoomOutOptions['cssUrl'];
    cssUrlHover = zoomOutOptions['cssUrlHover'];
    cssUrlActive = zoomOutOptions['cssUrlActive'];
    cssUrlDisabled = zoomOutOptions['cssUrlDisabled'];
    enabledBackgroundColor = zoomOutOptions['enabledBackgroundColor'];
    enabledBorderColor = zoomOutOptions['enabledBorderColor'];
    hoverBackgroundColor = zoomOutOptions['hoverBackgroundColor'];
    hoverBorderColor = zoomOutOptions['hoverBorderColor'];
    activeBackgroundColor = zoomOutOptions['activeBackgroundColor'];
    activeBorderColor = zoomOutOptions['activeBorderColor'];
    disabledBackgroundColor = zoomOutOptions['disabledBackgroundColor'];
    disabledBorderColor = zoomOutOptions['disabledBorderColor'];
    upState = dvt.TransientButton.getStateFromURL(context, cssUrl, imageSize, imageSize, enabledBackgroundColor, enabledBorderColor);
    overState = dvt.TransientButton.getStateFromURL(context, cssUrlHover, imageSize, imageSize, hoverBackgroundColor, hoverBorderColor);
    downState = dvt.TransientButton.getStateFromURL(context, cssUrlActive, imageSize, imageSize, activeBackgroundColor, activeBorderColor);
    disabledState = dvt.TransientButton.getStateFromURL(context, cssUrlDisabled, imageSize, imageSize, disabledBackgroundColor, disabledBorderColor);
    var zoomOutPosX = zoomOutOptions['posX'];
    var zoomOutPosY = zoomOutOptions['posY'];

    if (this.zoomout == null) {
      this.zoomout = new dvt.TransientButton(context, upState, overState, downState, disabledState, this.EventManager, this.EventManager.HandleZoomOutClick); // In order for tooltips to show up, we need to associate the buttons through the event manager

      this.EventManager.associate(this.zoomout, this.zoomout);
    } else {
      this.zoomout.setUpState(upState);
      this.zoomout.setOverState(overState);
      this.zoomout.setDownState(downState);
      this.zoomout.setDisabledState(disabledState);
    }

    this.zoomin.setTooltip(translations.tooltipZoomIn);
    this.zoomout.setTooltip(translations.tooltipZoomOut);
    this.zoomin.hide();
    this.zoomout.hide();

    if (dvt.TimeAxis.supportsTouch()) {
      dvt.ToolkitUtils.setAttrNullNS(this.zoomin.getElem(), 'role', 'button');
      dvt.ToolkitUtils.setAttrNullNS(this.zoomin.getElem(), 'aria-label', translations.tooltipZoomIn);
      dvt.ToolkitUtils.setAttrNullNS(this.zoomout.getElem(), 'role', 'button');
      dvt.ToolkitUtils.setAttrNullNS(this.zoomout.getElem(), 'aria-label', translations.tooltipZoomOut);
    }

    this.zoomin.setTranslateX(zoomInPosX);
    this.zoomout.setTranslateX(zoomOutPosX);
    this.zoomin.setTranslateY(zoomInPosY);
    this.zoomout.setTranslateY(zoomOutPosY);
    if (this.zoomin.getParent() != this._canvas) this._canvas.addChild(this.zoomin);
    if (this.zoomout.getParent() != this._canvas) this._canvas.addChild(this.zoomout);
    var contentLength = this.getContentLength();
    if (contentLength >= timeAxis.getMaxContentLength()) this.disableZoomButton(true);
    if (this._canvasLength >= contentLength) this.disableZoomButton(false);
  };

  dvt.TimeComponent.prototype.HandleMouseWheel = function (event) {
    dvt.EventManager.consumeEvent(event);
    var wheelDelta = event.wheelDelta;
    var wheelEvent = event.getNativeEvent();

    if (this.hasValidOptions()) {
      // manually check the x delta because dvt.MouseEvent ignores x delta at the time of writing.
      // performs similar check on delta x as that of dvt.MouseEvent.Init()'s check on delta y.
      if (wheelEvent.wheelDeltaX != null) event.wheelDeltaX = wheelEvent.wheelDeltaX / dvt.TimeComponent.WHEEL_UNITS_PER_LINE; // number of lines scrolled per mouse wheel click
      else if (wheelEvent.deltaX != null) {
          if (wheelEvent.deltaMode == wheelEvent.DOM_DELTA_LINE) event.wheelDeltaX = -wheelEvent.deltaX;else if (wheelEvent.deltaMode == wheelEvent.DOM_DELTA_PIXEL) event.wheelDeltaX = -wheelEvent.deltaX / dvt.TimeComponent.SCROLL_LINE_HEIGHT; // number of lines scrolled per mouse wheel click
        }

      if (wheelDelta) // if vertical mouse wheel amount is defined, non null, non zero
        {
          var compPagePos = this.getCtx().getStageAbsolutePosition();
          if (this._isVertical) var compLoc = event.pageY - compPagePos.y - this.getStartYOffset();else compLoc = event.pageX - compPagePos.x - this.getStartXOffset();
          var widthFactor = (this._end - this._start) / this.getContentLength();
          if (this.isRTL() && !this._isVertical) var time = this._viewEndTime - widthFactor * compLoc;else time = widthFactor * compLoc + this._viewStartTime;
          event.zoomTime = time;
          event.zoomCompLoc = compLoc;
          event.zoomWheelDelta = wheelDelta * .02 + 1;
        }
    }
  };

  dvt.TimeComponent.prototype.handleZoomWheel = function (newLength, time, compLoc, triggerViewportChangeEvent) {
    var oldViewTime = this._viewEndTime - this._viewStartTime;
    var viewLength = oldViewTime / (this._end - this._start) * this.getContentLength();
    this.setContentLength(newLength);

    var viewTime = viewLength / this.getContentLength() * (this._end - this._start);

    if (time) {
      var widthFactor = (this._end - this._start) / this.getContentLength();

      if (this.isRTL() && !this._isVertical) {
        this._viewEndTime = time + compLoc * widthFactor;
        if (this._viewEndTime > this._end) this._viewEndTime = this._end;
        this._viewStartTime = this._viewEndTime - viewTime;

        if (this._viewStartTime < this._start) {
          this._viewStartTime = this._start;
          this._viewEndTime = this._viewStartTime + viewTime;
          if (this._viewEndTime > this._end) this._viewEndTime = this._end;
        }
      } else {
        this._viewStartTime = time - compLoc * widthFactor;
        if (this._viewStartTime < this._start) this._viewStartTime = this._start;
        this._viewEndTime = this._viewStartTime + viewTime;

        if (this._viewEndTime > this._end) {
          this._viewEndTime = this._end;
          this._viewStartTime = this._viewEndTime - viewTime;
          if (this._viewStartTime < this._start) this._viewStartTime = this._start;
        }
      }

      this.setRelativeStartPos(1 / widthFactor * (this._start - this._viewStartTime));
    } else {
      this._viewStartTime = this._start;
      this._viewEndTime = this._viewStartTime + viewTime;
      if (this._viewEndTime > this._end) this._viewEndTime = this._end;
      this.setRelativeStartPos(0);
    }

    this.applyTimeZoomCanvasPosition();
  };
  /**
   * Zooms by the specified amount.
   * @param {number} dz A number specifying the zoom ratio, e.g. dz = 2 means zoom in by 200%.
   */


  dvt.TimeComponent.prototype.zoomBy = function (dz) {
    var shiftRatio = (1 / dz - 1) / 2 + 1;
    if (this._isVertical) var compLoc = this.Height / 2;else compLoc = this.Width / 2;
    var widthFactor = (this._end - this._start) / this.getContentLength();
    var time = widthFactor * compLoc + this._viewStartTime;
    this.handleZoomWheel(this.getContentLength() * shiftRatio, time, compLoc, true);
  };

  dvt.TimeComponent.prototype.beginPinchZoom = function (x1, y1, x2, y2) {
    if (this._isVertical) this._initialPinchZoomLoc = Math.sqrt((y1 - y2) * (y1 - y2)) + (y1 < y2 ? y1 : y2);else this._initialPinchZoomLoc = Math.sqrt((x1 - x2) * (x1 - x2)) + (x1 < x2 ? x1 : x2);
    var widthFactor = (this._end - this._start) / this.getContentLength();
    if (this.isRTL() && !this._isVertical) this._initialPinchZoomTime = this._viewEndTime - widthFactor * this._initialPinchZoomLoc;else this._initialPinchZoomTime = widthFactor * this._initialPinchZoomLoc + this._viewStartTime;
    this._initialPinchZoomDist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    this._initialPinchZoomLength = this.getContentLength();
  };

  dvt.TimeComponent.prototype.contPinchZoom = function (x1, y1, x2, y2) {
    var currPinchZoomDist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    if (currPinchZoomDist != this._initialPinchZoomDist) this._triggerViewportChange = true;
    var newLength = currPinchZoomDist / this._initialPinchZoomDist * this._initialPinchZoomLength;
    this.handleZoomWheel(newLength, this._initialPinchZoomTime, this._initialPinchZoomLoc, false);
  };

  dvt.TimeComponent.prototype.endPinchZoom = function () {
    this._initialPinchZoomDist = null;
    this._initialPinchZoomLoc = null;
    this._initialPinchZoomLength = null;
    this._initialPinchZoomTime = null;

    if (this._triggerViewportChange) {
      this._triggerViewportChange = false;
      this.dispatchEvent(this.createViewportChangeEvent());
    }
  };
  /**
   * Sets whether panning is enabled.
   * @param {boolean} panningEnabled true if panning enabled
   * @protected
   */


  dvt.TimeComponent.prototype.SetPanningEnabled = function (panningEnabled) {
    this._panningEnabled = panningEnabled;
  };
  /**
   * Gets whether panning is enabled
   * @return {boolean} true if panning enabled
   * @protected
   */


  dvt.TimeComponent.prototype.IsPanningEnabled = function () {
    return this._panningEnabled;
  };
  /**
   * Pans the Timeline by the specified amount.
   * @param {number} delta The number of pixels to pan the canvas.
   */


  dvt.TimeComponent.prototype.panZoomCanvasBy = function (delta) {
    if (this._isVertical) {
      var newTranslateY = this._timeZoomCanvas.getTranslateY() - delta;
      var minTranslateY = -(this.getContentLength() - this._canvasLength - this._startY);
      var maxTranslateY = this._startY;
      if (newTranslateY < minTranslateY) newTranslateY = minTranslateY;else if (newTranslateY > maxTranslateY) newTranslateY = maxTranslateY;

      this._timeZoomCanvas.setTranslateY(newTranslateY);

      var startPos = newTranslateY - this._startY;
      this.setAbsoluteStartPos(startPos);

      var widthFactor = this.getContentLength() / (this._end - this._start);

      var viewTime = this._viewEndTime - this._viewStartTime;
      this._viewStartTime = this._start - startPos / widthFactor;
      this._viewEndTime = this._viewStartTime + viewTime;
      if (this._viewEndTime > this._end) this._viewEndTime = this._end;
    } else {
      var newTranslateX = this._timeZoomCanvas.getTranslateX() - delta;
      var minTranslateX = -(this.getContentLength() - this._canvasLength - this._startX);
      var maxTranslateX = this._startX;
      if (newTranslateX < minTranslateX) newTranslateX = minTranslateX;else if (newTranslateX > maxTranslateX) newTranslateX = maxTranslateX;

      this._timeZoomCanvas.setTranslateX(newTranslateX);

      this.setAbsoluteStartPos(newTranslateX - this._startX);
      startPos = this.getRelativeStartPos();
      widthFactor = this.getContentLength() / (this._end - this._start);
      viewTime = this._viewEndTime - this._viewStartTime;
      this._viewStartTime = this._start - startPos / widthFactor;
      this._viewEndTime = this._viewStartTime + viewTime;
      if (this._viewEndTime > this._end) this._viewEndTime = this._end;
    }
  };

  dvt.TimeComponent.prototype.handleZoom = function (zoomIn) {
    if (!zoomIn) this.zoomBy(dvt.TimeComponent.ZOOM_BY_VALUE);else this.zoomBy(1 / dvt.TimeComponent.ZOOM_BY_VALUE);
  };

  dvt.TimeComponent.prototype.enableZoomButton = function (isZoomIn) {
    if (isZoomIn) {
      this.zoomin.setEnabled(true);
      this.zoomin.drawUpState();
    } else {
      this.zoomout.setEnabled(true);
      this.zoomout.drawUpState();
    }
  };

  dvt.TimeComponent.prototype.disableZoomButton = function (isZoomIn) {
    if (isZoomIn) {
      this.zoomin.setEnabled(false);
      this.zoomin.drawDisabledState();
      this.zoomin.setCursor(null);
    } else {
      this.zoomout.setEnabled(false);
      this.zoomout.drawDisabledState();
      this.zoomout.setCursor(null);
    }
  };

  dvt.TimeComponent.prototype.applyTimeZoomCanvasPosition = function () {
    if (this._isVertical) this._timeZoomCanvas.setTranslateY(this._startY + this.getAbsoluteStartPos());else this._timeZoomCanvas.setTranslateX(this._startX + this.getAbsoluteStartPos());
  };
  /**
   * Returns the absolute start position of the timeline.
   * @return {number} The absolute start position of the timeline.
   */


  dvt.TimeComponent.prototype.getAbsoluteStartPos = function () {
    return this._startPos;
  };
  /**
   * Sets the absolute start position of the timeline.
   * @param {number} startPos The absolute start position of the timeline.
   */


  dvt.TimeComponent.prototype.setAbsoluteStartPos = function (startPos) {
    this._startPos = startPos;
  };
  /**
   * Returns the timeline's start position relative to the reading direction.
   * @return {number} The timeline's start position relative to the reading direction.
   */


  dvt.TimeComponent.prototype.getRelativeStartPos = function () {
    if (this.isRTL() && !this._isVertical) return this._canvasLength - this.getContentLength() - this._startPos;else return this._startPos;
  };
  /**
   * Sets the timeline's start position relative to the reading direction.
   * @param {number} startPos The timeline's start position relative to the reading direction.
   */


  dvt.TimeComponent.prototype.setRelativeStartPos = function (startPos) {
    if (this.isRTL() && !this._isVertical) this._startPos = this._canvasLength - this.getContentLength() - startPos;else this._startPos = startPos;
  };
  /**
   * Returns the start offset value of this component in the x direction.
   * @return {number} The start offset value of this component in the x direction.
   */


  dvt.TimeComponent.prototype.getStartXOffset = function () {
    return this._startX;
  };
  /**
   * Sets the start offset value of this component in the x direction.
   * @param {number} startX The start offset value of this component in the x direction.
   */


  dvt.TimeComponent.prototype.setStartXOffset = function (startX) {
    this._startX = startX;
  };
  /**
   * Returns the start offset value of this component in the y direction.
   * @return {number} The start offset value of this component in the y direction.
   */


  dvt.TimeComponent.prototype.getStartYOffset = function () {
    return this._startY;
  };
  /**
   * Sets the start offset value of this component in the y direction.
   * @param {number} startY The start offset value of this component in the y direction.
   */


  dvt.TimeComponent.prototype.setStartYOffset = function (startY) {
    this._startY = startY;
  };
  /**
   * Gets the chart/graphical area bounds (i.e. excluding scrollbars etc).
   * @return {dvt.Rectangle} The bounds
   */


  dvt.TimeComponent.prototype.getGraphicalAreaBounds = function () {
    if (this.isVertical()) return new dvt.Rectangle(this._startX, this._startY, this._canvasSize, this._canvasLength);
    return new dvt.Rectangle(this._startX, this._startY, this._canvasLength, this._canvasSize);
  };
  /**
   * Gets whether time direction scrollbar should be visible.
   * @return {boolean} true if time direction scrollbar is visible, false otherwise.
   */


  dvt.TimeComponent.prototype.isTimeDirScrollbarOn = function () {
    // return this._timeDirScrollbar == 'on';
    return true; // always on for now
  };
  /**
   * Gets whether content direction scrollbar should be visible.
   * @return {boolean} true if content direction scrollbar is visible, false otherwise.
   */


  dvt.TimeComponent.prototype.isContentDirScrollbarOn = function () {
    // return this._contentDirScrollbar == 'on';
    return true; // always on for now
  };
  /**
   * Gets the scrollbar in the time direction.
   * @return {dvt.SimpleScrollbar} The scrollbar in the time direction.
   */


  dvt.TimeComponent.prototype.getTimeDirScrollbar = function () {
    return this.timeDirScrollbar;
  };
  /**
   * Gets the scrollbar in the content direction.
   * @param {number=} index The content index.
   * @return {dvt.SimpleScrollbar} The scrollbar in the content direction.
   */


  dvt.TimeComponent.prototype.getContentDirScrollbar = function (index) {
    if (index) return this.contentDirScrollbar[index];else return this.contentDirScrollbar;
  };
  /**
   * Sets the scrollbar in the time direction.
   * @param {dvt.SimpleScrollbar} timeDirScrollbar The scrollbar in the time direction.
   */


  dvt.TimeComponent.prototype.setTimeDirScrollbar = function (timeDirScrollbar) {
    this.timeDirScrollbar = timeDirScrollbar;
  };
  /**
   * Sets the scrollbar in the content direction.
   * @param {dvt.SimpleScrollbar} contentDirScrollbar The scrollbar in the content direction.
   * @param {number=} index The content index.
   */


  dvt.TimeComponent.prototype.setContentDirScrollbar = function (contentDirScrollbar, index) {
    if (index != null) {
      if (this.contentDirScrollbar == null) this.contentDirScrollbar = [];
      this.contentDirScrollbar[index] = contentDirScrollbar;
    } else this.contentDirScrollbar = contentDirScrollbar;
  };
  /**
   * Gets the scrollbar padding size.
   * @return {number} The scrollbar padding size.
   */


  dvt.TimeComponent.prototype.getScrollbarPadding = function () {
    return DvtTimeComponentStyleUtils._SCROLLBAR_PADDING;
  };
  /**
   * Gets the time direction scrollbar style.
   * @return {dvt.CSSStyle} The scrollbar style.
   */


  dvt.TimeComponent.prototype.getTimeDirScrollbarStyle = function () {
    return DvtTimeComponentStyleUtils.getTimeDirScrollbarStyle();
  };
  /**
   * Gets the content direction scrollbar style.
   * @return {dvt.CSSStyle} The scrollbar style.
   */


  dvt.TimeComponent.prototype.getContentDirScrollbarStyle = function () {
    return DvtTimeComponentStyleUtils.getContentDirScrollbarStyle();
  };
  /**
   * Event callback method.
   * @param {object} event
   * @param {object} component The component that is the source of the event, if available.
   */


  dvt.TimeComponent.prototype.HandleEvent = function (event, component) {
    var type = event['type'];

    if (type == 'dvtSimpleScrollbar') {
      event = this.processScrollbarEvent(event, component);
    }

    if (event) this.dispatchEvent(event);
  };
  /**
   * Adjusts viewport based on scrollbar event.
   * @param {object} event
   * @param {object} component The component that is the source of the event, if available.
   */


  dvt.TimeComponent.prototype.processScrollbarEvent = function (event, component) {
    if (component == this.timeDirScrollbar) {
      var newMin = event.newMin;
      var newMax = event.newMax;
      this._viewStartTime = newMin;
      this._viewEndTime = newMax;

      var widthFactor = this.getContentLength() / (this._end - this._start);

      this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
      this.applyTimeZoomCanvasPosition();
      var evt = this.createViewportChangeEvent();
      this.dispatchEvent(evt);
    }
  };

  dvt.TimeComponent.prototype.processEvent = function (event) {
    if (event) this.dispatchEvent(event);
  };
  /**
   * Creates a viewportChange event object
   * @return {object} the viewportChange event object
   */


  dvt.TimeComponent.prototype.createViewportChangeEvent = function () {
    return null;
  };
  /**
   * Gets the current viewport start time
   * @return {number} the viewport start time
   */


  dvt.TimeComponent.prototype.getViewportStartTime = function () {
    return this._viewStartTime;
  };
  /**
   * Sets the current viewport start time
   * @param {number} viewportStartTime The viewport start time
   */


  dvt.TimeComponent.prototype.setViewportStartTime = function (viewportStartTime) {
    this._viewStartTime = viewportStartTime;
  };
  /**
   * Gets the current viewport end time
   * @return {number} the viewport end time
   */


  dvt.TimeComponent.prototype.getViewportEndTime = function () {
    return this._viewEndTime;
  };
  /**
   * Sets the current viewport end time
   * @param {number} viewportEndTime The viewport end time
   */


  dvt.TimeComponent.prototype.setViewportEndTime = function (viewportEndTime) {
    this._viewEndTime = viewportEndTime;
  }; //////////// event handlers, called by TimeComponentEventManager ////////////////////////////


  dvt.TimeComponent.prototype.HandleKeyDown = function (event) {};

  dvt.TimeComponent.prototype.HandleMouseDown = function (event) {};
  /**
   * Handles component focus events.
   * @param {object} event The focus event.
   */


  dvt.TimeComponent.prototype.HandleFocus = function (event) {
    if (this.zoomin != null) this.zoomin._onFocus(event);
    if (this.zoomout != null) this.zoomout._onFocus(event);
  };
  /**
   * Handles component blur events.
   * @param {object} event The blur event.
   */


  dvt.TimeComponent.prototype.HandleBlur = function (event) {
    if (this.zoomin != null) this.zoomin._onBlur(event);
    if (this.zoomout != null) this.zoomout._onBlur(event);
  };

  dvt.TimeComponent.prototype.beginDragPan = function (compX, compY) {
    this._currentX = compX;
    this._currentY = compY;
  };

  dvt.TimeComponent.prototype.endDragPan = function () {
    this.endPan();
  };
  /**
   * Sets the cursor to pan down
   */


  dvt.TimeComponent.prototype.setPanCursorDown = function () {
    this.setCursor(dvt.ToolkitUtils.getGrabbingCursor());
  };
  /**
   * Sets the cursor to pan up
   */


  dvt.TimeComponent.prototype.setPanCursorUp = function () {
    this.setCursor(dvt.ToolkitUtils.getGrabCursor());
  };
  /**
   * Setup and creates (but not add to the DOM yet) a glass pane over the component.
   * Calling this method also registers the operation to the usage stack, which keeps track of how many
   * operations currently depend on the glass pane being up.
   */


  dvt.TimeComponent.prototype.registerAndConstructGlassPane = function () {
    if (!this._glassPaneUsageStack) {
      this._glassPaneUsageStack = [];
    }

    if (!this._glassPane) {
      var glassPaneBounds = this.getGraphicalAreaBounds();
      this._glassPane = new dvt.Rect(this.getCtx(), glassPaneBounds.x, glassPaneBounds.y, glassPaneBounds.w, glassPaneBounds.h);

      this._glassPane.setInvisibleFill();
    }

    this._glassPaneUsageStack.push(1); // register the caller

  };
  /**
   * Adds the glass pane over the component
   * @return {boolean} Whether the glass pane is added, or not (i.e. because it's already there)
   */


  dvt.TimeComponent.prototype.installGlassPane = function () {
    if (!this._glassPaneDrawn) {
      this.addChild(this._glassPane);
      this._glassPaneDrawn = true;
      return true;
    }

    return false;
  };
  /**
   * Unregister, and removes the glass pane if nothing else is currently dependent on it.
   */


  dvt.TimeComponent.prototype.unregisterAndDestroyGlassPane = function () {
    // caller is done with the glass pane; unregister
    this._glassPaneUsageStack.pop(); // If stack is empty, then nothing is currently dependent on the glass pane, so it's safe to remove


    if (this._glassPaneDrawn && this._glassPaneUsageStack.length === 0) {
      this.removeChild(this._glassPane);
      this._glassPaneDrawn = false;
    }
  };

  dvt.TimeComponent.prototype.HandleTouchEnd = function (event) {
    if (this._selectionMode != 'none') this.handleShapeClick(event, this._selectionMode == 'multiple');
  };

  dvt.TimeComponent.prototype.handleShapeClick = function (event) {};

  dvt.TimeComponent.prototype.HandleMouseClick = function (event) {
    this.handleShapeClick(event, event.ctrlKey && this._selectionMode == 'multiple');
  };
  /**
   * @protected
   * Ends panning.
   */


  dvt.TimeComponent.prototype.endPan = function () {
    if (this._triggerViewportChange) {
      this._triggerViewportChange = false;
      this.dispatchEvent(this.createViewportChangeEvent());
    }
  };

  dvt.TimeComponent.prototype.contDragPan = function (compX, compY) {
    if (this._currentX && this._currentY) {
      var deltaX = this._currentX - compX;
      var deltaY = this._currentY - compY;
      if (deltaX == 0 && deltaY == 0) return false;
      this._triggerViewportChange = true;
      this._currentX = compX;
      this._currentY = compY;
      this.panBy(deltaX, deltaY);
      return true;
    }

    return false;
  };
  /**
   * Pans the component by the specified amount.
   * @param {number} deltaX The number of pixels to pan in the x direction.
   * @param {number} deltaY The number of pixels to pan in the y direction.
   * @protected
   */


  dvt.TimeComponent.prototype.panBy = function (deltaX, deltaY) {
    this.panZoomCanvasBy(deltaX);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Base event manager for Timeline and Gantt.
   * @param {dvt.TimeComponent} comp The owning dvt.Timeline or dvt.Gantt.
   * @extends {dvt.EventManager}
   * @constructor
   */


  dvt.TimeComponentEventManager = function (comp) {
    this.Init(comp.getCtx(), comp.processEvent, comp, comp);
    this._comp = comp;
    this._isDragPanning = false;
    this._isPinchZoom = false;
  };

  dvt.Obj.createSubclass(dvt.TimeComponentEventManager, dvt.EventManager); // TODO: shouldn't this be in the toolkit?

  /**
   * Mousewheel event type
   * @type {string}
   */

  dvt.TimeComponentEventManager.GECKO_MOUSEWHEEL = 'wheel';
  /**
   * @override
   */

  dvt.TimeComponentEventManager.prototype.addListeners = function (displayable) {
    dvt.TimeComponentEventManager.superclass.addListeners.call(this, displayable);
    dvt.SvgDocumentUtils.addDragListeners(this._comp, this._onDragStart, this._onDragMove, this._onDragEnd, this);

    if (!dvt.Agent.isTouchDevice()) {
      if (dvt.Agent.browser === 'firefox') displayable.addEvtListener(dvt.TimeComponentEventManager.GECKO_MOUSEWHEEL, this.OnMouseWheel, false, this);else displayable.addEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
    }
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.RemoveListeners = function (displayable) {
    dvt.TimeComponentEventManager.superclass.RemoveListeners.call(this, displayable);

    if (!dvt.Agent.isTouchDevice()) {
      if (dvt.Agent.browser === 'firefox') displayable.removeEvtListener(dvt.TimeComponentEventManager.GECKO_MOUSEWHEEL, this.OnMouseWheel, false, this);else displayable.removeEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
    }
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.OnFocus = function (event) {
    dvt.TimeComponentEventManager.superclass.OnFocus.call(this, event);

    this._comp.HandleFocus(event);
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.OnBlur = function (event) {
    dvt.TimeComponentEventManager.superclass.OnBlur.call(this, event);

    this._comp.HandleBlur(event);
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.OnKeyDown = function (event) {
    dvt.TimeComponentEventManager.superclass.OnKeyDown.call(this, event);

    this._comp.HandleKeyDown(event);
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.OnClick = function (event) {
    dvt.TimeComponentEventManager.superclass.OnClick.call(this, event);

    this._comp.HandleMouseClick(event);
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.PreOnMouseDown = function (event) {
    dvt.TimeComponentEventManager.superclass.PreOnMouseDown.call(this, event);

    this._comp.HandleMouseDown(event);
  };
  /**
   * Mouse wheel event handler.
   * @param {mousewheel} event The mousewheel event.
   * @protected
   */


  dvt.TimeComponentEventManager.prototype.OnMouseWheel = function (event) {
    this._comp.HandleMouseWheel(event);
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.OnTouchStartBubble = function (event) {
    dvt.TimeComponentEventManager.superclass.OnTouchStartBubble.call(this, event);

    this._comp.HandleTouchStart(event); // iOS does not set focus on touch, so need to force focus


    var stage = this._comp.getCtx().getStage();

    var wrappingDiv = stage.getSVGRoot().parentNode;
    wrappingDiv.focus();
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.OnTouchEndBubble = function (event) {
    dvt.TimeComponentEventManager.superclass.OnTouchEndBubble.call(this, event);

    this._comp.HandleTouchEnd(event);
  };
  /**
   * Drag start callback.
   * @param {dvt.BaseEvent} event
   * @return {boolean} Whether drag is initiated.
   * @private
   */


  dvt.TimeComponentEventManager.prototype._onDragStart = function (event) {
    if (this._comp.hasValidOptions() && this._comp.IsPanningEnabled()) {
      if (dvt.Agent.isTouchDevice()) return this._onTouchDragStart(event);else return this._onMouseDragStart(event);
    }

    return false;
  };
  /**
   * Drag move callback.
   * @param {dvt.BaseEvent} event
   * @return {boolean}
   * @private
   */


  dvt.TimeComponentEventManager.prototype._onDragMove = function (event) {
    if (this._comp.IsPanningEnabled()) {
      if (dvt.Agent.isTouchDevice()) return this._onTouchDragMove(event);else return this._onMouseDragMove(event);
    }

    return false;
  };
  /**
   * Drag end callback.
   * @param {dvt.BaseEvent} event
   * @return {boolean}
   * @private
   */


  dvt.TimeComponentEventManager.prototype._onDragEnd = function (event) {
    if (this._comp.IsPanningEnabled()) {
      if (dvt.Agent.isTouchDevice()) return this._onTouchDragEnd(event);else return this._onMouseDragEnd(event);
    }

    return false;
  };
  /**
   * Return the relative position relative to the stage, based on the cached stage absolute position.
   * @param {number} pageX
   * @param {number} pageY
   * @return {dvt.Point} The relative position.
   * @private
   */


  dvt.TimeComponentEventManager.prototype._getRelativePosition = function (pageX, pageY) {
    // TODO: Consider removing this method, and use context.pageToStageCoords(pageX, pageY) instead
    // Looks like this method is only necessary to cache the stage absolute position, but
    // at the time of writing, there is already a cache in the context for this purpose.
    // The base dvt.EventManager handles clearing this cache on mouseout, so I think
    // we only need to take care of calling context.clearStageAbsolutePosition() in _onTouchDragEnd.
    //
    // Summary: remove this method, replace all instance with context.pageToStageCoords(pageX, pageY),
    // remove all instances of this._stageAbsolutePosition, and just call
    // context.clearStageAbsolutePosition() in _onTouchDragEnd
    if (!this._stageAbsolutePosition) this._stageAbsolutePosition = this._context.getStageAbsolutePosition();
    return new dvt.Point(pageX - this._stageAbsolutePosition.x, pageY - this._stageAbsolutePosition.y);
  };
  /**
   * Mouse drag start callback.
   * @param {dvt.BaseEvent} event
   * @return {boolean} Whether drag is initiated.
   * @private
   */


  dvt.TimeComponentEventManager.prototype._onMouseDragStart = function (event) {
    if (event.button != dvt.MouseEvent.RIGHT_CLICK_BUTTON) {
      var relPos = this._getRelativePosition(event.pageX, event.pageY); // only drag pan if inside chart/graphical area


      if (this._comp.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y) && !this._isDragPanning) {
        // Hide any tooltip (from keyboard move) and put up a glass pane (for cursor change). Note that these are only relevant for mouse dragging.
        this.hideTooltip();

        this._comp.registerAndConstructGlassPane();

        this._comp.setPanCursorDown();

        this._comp.beginDragPan(relPos.x, relPos.y);

        this._isDragPanning = true;
        return true;
      }
    }

    return false;
  };
  /**
   * Mouse drag move callback.
   * @param {dvt.BaseEvent} event
   * @private
   */


  dvt.TimeComponentEventManager.prototype._onMouseDragMove = function (event) {
    var relPos = this._getRelativePosition(event.pageX, event.pageY);

    if (this._comp.contDragPan(relPos.x, relPos.y) && this._isDragPanning) {
      this._comp.installGlassPane();
    }
  };
  /**
   * Mouse drag end callback.
   * @param {dvt.BaseEvent} event
   * @private
   */


  dvt.TimeComponentEventManager.prototype._onMouseDragEnd = function (event) {
    if (this._isDragPanning) {
      this._isDragPanning = false;

      this._comp.endDragPan(); // Clear the stage absolute position cache


      this._stageAbsolutePosition = null; // No longer need the glass pane

      this._comp.unregisterAndDestroyGlassPane(); // Update cursor


      var relPos = this._getRelativePosition(event.pageX, event.pageY);

      if (this._comp.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y)) this._comp.setPanCursorUp();else this._comp.setCursor('inherit');
    }
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.OnMouseMove = function (event) {
    dvt.TimeComponentEventManager.superclass.OnMouseMove.call(this, event); // Update the cursor

    var relPos = this._getRelativePosition(event.pageX, event.pageY);

    if (this._comp.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y)) {
      if (this._isDragPanning) this._comp.setPanCursorDown();else this._comp.setPanCursorUp();
    } else this._comp.setCursor('inherit');
  };
  /**
   * Touch drag start callback.
   * @param {dvt.BaseEvent} event
   * @return {boolean} Whether drag is initiated.
   * @private
   */


  dvt.TimeComponentEventManager.prototype._onTouchDragStart = function (event) {
    var touches = event.touches;

    var bounds = this._comp.getGraphicalAreaBounds();

    if (touches.length == 1) {
      var relPos = this._getRelativePosition(touches[0].pageX, touches[0].pageY); // only pan if inside chart/graphical area


      if (bounds.containsPoint(relPos.x, relPos.y)) {
        this._comp.beginDragPan(relPos.x, relPos.y);

        dvt.EventManager.consumeEvent(event);
        return true;
      }
    } else if (touches.length == 2) {
      this._comp.endDragPan();

      this._isPinchZoom = true;

      var relPos1 = this._getRelativePosition(touches[0].pageX, touches[0].pageY);

      var relPos2 = this._getRelativePosition(touches[1].pageX, touches[1].pageY); // only pinch zoom if inside chart/graphical area


      if (bounds.containsPoint(relPos1.x, relPos1.y) && bounds.containsPoint(relPos2.x, relPos2.y)) {
        this._comp.beginPinchZoom(relPos1.x, relPos1.y, relPos2.x, relPos2.y);

        dvt.EventManager.consumeEvent(event);
        return true;
      }
    }

    return false;
  };
  /**
   * Touch drag move callback.
   * @param {dvt.BaseEvent} event
   * @private
   */


  dvt.TimeComponentEventManager.prototype._onTouchDragMove = function (event) {
    var touches = event.touches; // make sure this is a single touch and not a multi touch

    if (touches.length == 1) {
      var relPos = this._getRelativePosition(touches[0].pageX, touches[0].pageY);

      this._comp.contDragPan(relPos.x, relPos.y);

      event.preventDefault();
    } else if (touches.length == 2) {
      var relPos1 = this._getRelativePosition(touches[0].pageX, touches[0].pageY);

      var relPos2 = this._getRelativePosition(touches[1].pageX, touches[1].pageY);

      this._comp.contPinchZoom(relPos1.x, relPos1.y, relPos2.x, relPos2.y);

      event.preventDefault();
    }
  };
  /**
   * Touch drag end callback.
   * @param {dvt.BaseEvent} event
   * @private
   */


  dvt.TimeComponentEventManager.prototype._onTouchDragEnd = function (event) {
    if (!this._isPinchZoom) {
      this._comp.endDragPan();

      event.preventDefault();
    } else {
      this._isPinchZoom = false;

      this._comp.endPinchZoom();

      event.preventDefault();
    } // Clear the stage absolute position cache


    this._stageAbsolutePosition = null;
  };
  /**
   * Zooms by the specified amount.
   * @param {number} dz A number specifying the zoom ratio. dz = 1 means no zoom.
   */


  dvt.TimeComponentEventManager.prototype.zoomBy = function (dz) {
    this._comp.zoomBy(dz);
  };
  /**
   * Pans by the specified amount.
   * @param {number} dx A number from specifying the pan ratio in the x direction, e.g. dx = 0.5 means pan end by 50%..
   * @param {number} dy A number from specifying the pan ratio in the y direction, e.g. dy = 0.5 means pan down by 50%.
   */


  dvt.TimeComponentEventManager.prototype.panBy = function (dx, dy) {
    var deltaX = dx * this._comp._canvasLength * (dvt.Agent.isRightToLeft(this._context) ? -1 : 1);
    var deltaY = dy * this._comp._canvasSize;
    if (deltaX != 0) this._comp._triggerViewportChange = true;

    this._comp.panBy(deltaX, deltaY);

    this._comp.endPan();
  };
  /**
   * Zoom in button click handler.
   * @param {dvt.BaseEvent} event The dispatched event to be processed by the object.
   */


  dvt.TimeComponentEventManager.prototype.HandleZoomInClick = function (event) {
    this._comp.handleZoom(true);
  };
  /**
   * Zoom out button click handler.
   * @param {dvt.BaseEvent} event The dispatched event to be processed by the object.
   */


  dvt.TimeComponentEventManager.prototype.HandleZoomOutClick = function (event) {
    this._comp.handleZoom(false);
  };
  /**
   * @override
   */


  dvt.TimeComponentEventManager.prototype.GetTouchResponse = function () {
    return dvt.EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * TimeComponent keyboard handler.
   * @param {dvt.EventManager} manager The owning dvt.EventManager.
   * @class dvt.TimeComponentKeyboardHandler
   * @extends {dvt.KeyboardHandler}
   * @constructor
   */


  dvt.TimeComponentKeyboardHandler = function (manager) {
    this.Init(manager);
  };

  dvt.Obj.createSubclass(dvt.TimeComponentKeyboardHandler, dvt.KeyboardHandler);
  /**
   * @override
   */

  dvt.TimeComponentKeyboardHandler.prototype.isSelectionEvent = function (event) {
    return this.isNavigationEvent(event) && !event.ctrlKey;
  };
  /**
   * @override
   */


  dvt.TimeComponentKeyboardHandler.prototype.isMultiSelectEvent = function (event) {
    return event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey;
  };
  /**
   * @override
   */


  dvt.TimeComponentKeyboardHandler.prototype.processKeyDown = function (event) {
    if (dvt.KeyboardEvent.isPlus(event) || dvt.KeyboardEvent.isEquals(event)) {
      this._eventManager.HandleZoomInClick();
    } else if (dvt.KeyboardEvent.isMinus(event) || dvt.KeyboardEvent.isUnderscore(event)) {
      this._eventManager.HandleZoomOutClick();
    } else {
      var keyCode = event.keyCode;

      if (keyCode == dvt.KeyboardEvent.PAGE_UP) {
        if (event.shiftKey) this._eventManager.panBy(-0.25, 0);else this._eventManager.panBy(0, -0.25);
        dvt.EventManager.consumeEvent(event);
      } else if (keyCode == dvt.KeyboardEvent.PAGE_DOWN) {
        if (event.shiftKey) this._eventManager.panBy(0.25, 0);else this._eventManager.panBy(0, 0.25);
        dvt.EventManager.consumeEvent(event);
      }
    }

    return dvt.TimeComponentKeyboardHandler.superclass.processKeyDown.call(this, event);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Style related utility functions for dvt.TimeComponent.
   * @class
   */


  var DvtTimeComponentStyleUtils = new Object();
  dvt.Obj.createSubclass(DvtTimeComponentStyleUtils, dvt.Obj);
  /**
   * The default time direction scrollbar style.
   * @const
   * @private
   */

  DvtTimeComponentStyleUtils._DEFAULT_TIME_DIR_SCROLLBAR_STYLE = 'height: 3px; width: 3px; color: #9E9E9E; background-color: #F0F0F0';
  /**
   * The default content direction scrollbar style.
   * @const
   * @private
   */

  DvtTimeComponentStyleUtils._DEFAULT_CONTENT_DIR_SCROLLBAR_STYLE = 'height: 3px; width: 3px; color: #9E9E9E; background-color: #F0F0F0';
  /**
   * The scrollbar padding size.
   * @const
   * @private
   */

  DvtTimeComponentStyleUtils._SCROLLBAR_PADDING = 4;
  /**
   * Gets the horizontal scrollbar style.
   * @return {dvt.CSSStyle} The scrollbar style.
   */

  DvtTimeComponentStyleUtils.getTimeDirScrollbarStyle = function () {
    return new dvt.CSSStyle(DvtTimeComponentStyleUtils._DEFAULT_TIME_DIR_SCROLLBAR_STYLE);
  };
  /**
   * Gets the vertical scrollbar style.
   * @return {dvt.CSSStyle} The scrollbar style.
   */


  DvtTimeComponentStyleUtils.getContentDirScrollbarStyle = function () {
    return new dvt.CSSStyle(DvtTimeComponentStyleUtils._DEFAULT_CONTENT_DIR_SCROLLBAR_STYLE);
  };
  /**
   * Gets the default scrollbar padding size.
   * @return {number} The default scrollbar padding size.
   */


  DvtTimeComponentStyleUtils.getScrollbarPadding = function () {
    return DvtTimeComponentStyleUtils._SCROLLBAR_PADDING;
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
