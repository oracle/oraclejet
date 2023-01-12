/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-toolkit', 'ojs/ojtimeaxis-toolkit'], function (exports, dvt, ojtimeaxisToolkit) { 'use strict';

  /**
   * Style related utility functions for TimeComponent.
   * @class
   */
  const DvtTimeComponentStyleUtils = {
    /**
     * The default time direction scrollbar style.
     * @const
     * @private
     */
    _DEFAULT_TIME_DIR_SCROLLBAR_STYLE:
      'height: 3px; width: 3px; color: #9E9E9E; background-color: #F0F0F0',

    /**
     * The default content direction scrollbar style.
     * @const
     * @private
     */
    _DEFAULT_CONTENT_DIR_SCROLLBAR_STYLE:
      'height: 3px; width: 3px; color: #9E9E9E; background-color: #F0F0F0',

    /**
     * The scrollbar padding size.
     * @const
     * @private
     */
    _SCROLLBAR_PADDING: 4,

    /**
     * Gets the horizontal scrollbar style.
     * @return {dvt.CSSStyle} The scrollbar style.
     */
    getTimeDirScrollbarStyle: () => {
      return new dvt.CSSStyle(DvtTimeComponentStyleUtils._DEFAULT_TIME_DIR_SCROLLBAR_STYLE);
    },

    /**
     * Gets the vertical scrollbar style.
     * @return {dvt.CSSStyle} The scrollbar style.
     */
    getContentDirScrollbarStyle: () => {
      return new dvt.CSSStyle(DvtTimeComponentStyleUtils._DEFAULT_CONTENT_DIR_SCROLLBAR_STYLE);
    },

    /**
     * Gets the default scrollbar padding size.
     * @return {number} The default scrollbar padding size.
     */
    getScrollbarPadding: () => {
      return DvtTimeComponentStyleUtils._SCROLLBAR_PADDING;
    }
  };

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
  class TimeComponent extends dvt.BaseComponent {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      this._virtualize = false;
      this.ZOOM_BY_VALUE = 1.5;
      this.WHEEL_UNITS_PER_LINE = 40;
    }

    // TODO: remove after gantt es6 conversion
    Init(context, callback, callbackObj) {
      super.Init(context, callback, callbackObj);
      this._virtualize = false;
      this.ZOOM_BY_VALUE = 1.5;
      this.WHEEL_UNITS_PER_LINE = 40;
    }

    /**
     * Renders the component with the specified data.  If no data is supplied to a component
     * that has already been rendered, the component will be rerendered to the specified size.
     * @param {object} options list of options
     * @param {number} width the width of the component
     * @param {number} height the height of the component
     * @override
     */
    render(options, width, height) {
      if (options) {
        this._resources = options['_resources'];
        if (this._resources == null) this._resources = [];

        this.SetOptions(options);

        var dragMode = this.Options['dragMode'];
        this.SetPanningEnabled(dragMode === 'pan' || dragMode == null, true);
        this.SetMarqueeEnabled(
          dragMode === 'select' && this.Options['selectionMode'] === 'multiple',
          true
        );
      }

      // Store the size
      this.Width = width;
      this.Height = height;

      if (this.Options) {
        // If new options are provided, parse it and apply the properties
        var props = this.Parse(this.Options);
        this._applyParsedProperties(props);
      }
    }

    /**
     * @override
     */
    SetOptions(options) {
      super.SetOptions(options);
      // Combine the user options with the defaults and store
      this.Options = this.Defaults.calcOptions(options);

      // If viewportStart/End is invalid within start and end,
      // unset them and let the component decide a default viewport
      var startTime = new Date(options['start']).getTime();
      var endTime = new Date(options['end']).getTime();
      var viewStartTime = new Date(options['viewportStart']).getTime();
      var viewEndTime = new Date(options['viewportEnd']).getTime();
      if (!(viewStartTime >= startTime && viewStartTime < endTime)) {
        this._viewStartTime = null;
        this.Options['viewportStart'] = '';
      }
      if (!(viewEndTime > startTime && viewEndTime <= endTime)) {
        this._viewEndTime = null;
        this.Options['viewportEnd'] = '';
      }

      if (dvt.Agent.isEnvironmentTest()) {
        this.Options['animationOnDisplay'] = 'none';
        this.Options['animationOnDataChange'] = 'none';
      }
    }

    /**
     * Removes all children from the component's canvas.
     */
    clearComponent() {
      if (this._canvas) this._canvas.removeChildren();
    }

    _applyParsedProperties(props) {
      this._start = props.start;
      this._end = props.end;
      this._inlineStyle = props.inlineStyle;

      // not used yet but may be needed to control visibility in the future
      this._timeDirScrollbar = props.timeDirScrollbar;
      this._contentDirScrollbar = props.contentDirScrollbar;

      this.applyStyleValues();
    }

    /**
     * Returns an appropriate version of the data to be publicly exposed through contexts, event payloads, etc.
     * @param {object} data The raw data object
     * @param {string} type The raw data object type. Must be either 'series', 'item', 'row', or 'task'
     * @return {object} The sanitized data
     */
    static sanitizeData(data, type) {
      const sanitizeNoTemplateItemData = (item) => {
        if (item._itemData.taskId) {
          // Specifically for Gantt with row data supplied and no task template,
          // _itemData does not have the task's id prop (it has the taskId prop)
          const itemCopy = Object.assign({}, item._itemData);
          itemCopy.id = itemCopy.taskId;
          delete itemCopy.taskId;
          return itemCopy;
        }
        return item._itemData;
      };
      const sanitizeItemData = (item) => {
        const itemCopy = Object.assign({}, item);
        delete itemCopy._itemData;
        return itemCopy;
      };
      const isSeriesData = type === 'series' || type === 'row';
      if (isSeriesData) {
        const itemProp = type === 'series' ? 'items' : 'tasks';
        const items = data[itemProp];
        if (items.length > 0) {
          const seriesCopy = Object.assign({}, data._noTemplate ? data._itemData : data);
          if (items[0]._noTemplate) {
            seriesCopy[itemProp] = data[itemProp].map(sanitizeNoTemplateItemData);
          } else if (items[0]._itemData) {
            seriesCopy[itemProp] = data[itemProp].map(sanitizeItemData);
          }
          return seriesCopy;
        }
      } else {
        if (data._noTemplate) {
          return sanitizeNoTemplateItemData(data);
        } else if (data._itemData) {
          return sanitizeItemData(data);
        }
      }
      return data;
    }

    /**
     * Combines style defaults with the styles provided
     *
     */
    applyStyleValues() {
      if (this._style) this._style.parseInlineStyle(this._inlineStyle);
    }

    //////////// attribute methods ////////////////////////////
    /**
     * Whether drag and drop is enabled on the component.
     * @return {boolean} whether drag and drop is enabled
     */
    isDndEnabled() {
      // subclasses can override
      return false;
    }

    isAnimationEnabled() {
      return false;
    }

    getAdjustedStartTime() {
      return this._start;
    }

    getAdjustedEndTime() {
      return this._end;
    }

    /**
     * Returns the overall (virtualized) length of the content
     * @return {number} the content length
     */
    getContentLength() {
      return this._contentLength;
    }

    setContentLength(length) {
      if (this._canvasLength < length) this._contentLength = length;
      else this._contentLength = this._canvasLength;

      if (!this._virtualize) {
        this._fetchStartPos = 0;
        this._fetchEndPos = this._contentLength;
      }
    }

    /**
     * Gets the canvas size.
     * @return {number} the canvas size.
     */
    getCanvasSize() {
      return this._canvasSize;
    }

    /**
     * Gets the canvas length.
     * @return {number} the canvas length.
     */
    getCanvasLength() {
      return this._canvasLength;
    }

    isRTL() {
      return dvt.Agent.isRightToLeft(this.getCtx());
    }

    /**
     * Returns whether the component has a vertical orientation.
     * @return {boolean} true if vertical, false otherwise.
     */
    isVertical() {
      return this._isVertical;
    }

    /**
     * Retrieve the time axis.
     * @return {TimeAxis} the time axis
     */
    getTimeAxis() {
      return null;
    }

    /**
     */
    prepareViewportLength() {
      this.setRelativeStartPos(0);

      // Check the initial viewportStart/End.
      // If they are '', then we should default them.
      var viewTime;
      var widthFactor;
      if (this._viewStartTime && this._viewEndTime) {
        viewTime = this._viewEndTime - this._viewStartTime;
        if (viewTime > 0) {
          widthFactor = this._canvasLength / viewTime;
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
            this._viewStartTime =
              this._viewEndTime - (this._canvasLength / zoomLevelLength) * (endTime - startTime);
            if (this._viewStartTime < this._start) this._viewStartTime = this._start;
            viewTime = this._viewEndTime - this._viewStartTime;
            widthFactor = this._canvasLength / viewTime;
            this.setContentLength(widthFactor * (this._end - this._start));
            this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
          } else {
            this._viewStartTime = this._start;
            this.setRelativeStartPos(0);
            this._viewEndTime =
              (this._canvasLength / zoomLevelLength) * (endTime - startTime) + this._viewStartTime;
            if (this._viewEndTime > this._end) this._viewEndTime = this._end;
          }
        } else {
          this._viewEndTime =
            (this._canvasLength / zoomLevelLength) * (endTime - startTime) + this._viewStartTime;
          if (this._viewEndTime > this._end) this._viewEndTime = this._end;
          viewTime = this._viewEndTime - this._viewStartTime;
          widthFactor = this._canvasLength / viewTime;
          this.setContentLength(widthFactor * (this._end - this._start));
          this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
        }
      }
    }

    /**
     * Renders the time zoom canvas of a this component.
     * @param {dvt.Container} container The container to render into.
     */
    renderTimeZoomCanvas(container) {
      if (this._timeZoomCanvas) this._timeZoomCanvas.setClipPath(null);
      else this._timeZoomCanvas = new dvt.Container(this.getCtx(), 'g', 'iCanvas');

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
    }

    getTimeZoomCanvas() {
      return this._timeZoomCanvas;
    }

    /**
     * Renders the zoom controls of this component.
     * @param {object} options The zoom controls properties
     */
    renderZoomControls(options) {
      if (!this.isZoomingEnabled()) {
        this._canvas.removeChild(this.zoomin);
        this._canvas.removeChild(this.zoomout);
        this.zoomin = null;
        this.zoomout = null;
        return;
      }

      var context = this.getCtx();
      var timeAxis = this.getTimeAxis();
      var translations = this.Options.translations;

      // Zoom in states
      var zoomInOptions = options['zoomInProps'];
      var imageSize = zoomInOptions['imageSize'];
      var iconClass = zoomInOptions['class'];

      var zoomInPosX = zoomInOptions['posX'];
      var zoomInPosY = zoomInOptions['posY'];

      var iconStyle;
      if (this.zoomin == null) {
        iconStyle = dvt.ToolkitUtils.getIconStyle(context, iconClass);
        this.zoomin = new dvt.TransientButton(
          context,
          iconStyle,
          imageSize,
          this.EventManager,
          this.EventManager.HandleZoomInClick
        );
        // In order for tooltips to show up, we need to associate the buttons through the event manager
        this.EventManager.associate(this.zoomin, this.zoomin);
      }

      // Zoom out states
      var zoomOutOptions = options['zoomOutProps'];
      imageSize = zoomOutOptions['imageSize'];
      iconClass = zoomOutOptions['class'];

      var zoomOutPosX = zoomOutOptions['posX'];
      var zoomOutPosY = zoomOutOptions['posY'];

      if (this.zoomout == null) {
        iconStyle = dvt.ToolkitUtils.getIconStyle(context, iconClass);
        this.zoomout = new dvt.TransientButton(
          context,
          iconStyle,
          imageSize,
          this.EventManager,
          this.EventManager.HandleZoomOutClick
        );
        // In order for tooltips to show up, we need to associate the buttons through the event manager
        this.EventManager.associate(this.zoomout, this.zoomout);
      }

      this.zoomin.setTooltip(translations.tooltipZoomIn);
      this.zoomout.setTooltip(translations.tooltipZoomOut);
      this.zoomin.hide();
      this.zoomout.hide();

      if (ojtimeaxisToolkit.TimeAxisUtils.supportsTouch()) {
        dvt.ToolkitUtils.setAttrNullNS(this.zoomin.getElem(), 'role', 'button');
        dvt.ToolkitUtils.setAttrNullNS(
          this.zoomin.getElem(),
          'aria-label',
          translations.tooltipZoomIn
        );
        dvt.ToolkitUtils.setAttrNullNS(this.zoomout.getElem(), 'role', 'button');
        dvt.ToolkitUtils.setAttrNullNS(
          this.zoomout.getElem(),
          'aria-label',
          translations.tooltipZoomOut
        );
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
    }

    HandleMouseWheel(event) {
      dvt.EventManager.consumeEvent(event);
      var wheelDelta = event.wheelDelta;
      var wheelEvent = event.getNativeEvent();

      if (this.hasValidOptions()) {
        // manually check the x delta because dvt.MouseEvent ignores x delta at the time of writing.
        // performs similar check on delta x as that of dvt.MouseEvent.Init()'s check on delta y.
        if (wheelEvent.wheelDeltaX != null)
          event.wheelDeltaX = wheelEvent.wheelDeltaX / this.WHEEL_UNITS_PER_LINE;
        // number of lines scrolled per mouse wheel click
        else if (wheelEvent.deltaX != null) {
          if (wheelEvent.deltaMode == wheelEvent.DOM_DELTA_LINE)
            event.wheelDeltaX = -wheelEvent.deltaX;
          else if (wheelEvent.deltaMode == wheelEvent.DOM_DELTA_PIXEL)
            event.wheelDeltaX = -wheelEvent.deltaX / TimeComponent.SCROLL_LINE_HEIGHT; // number of lines scrolled per mouse wheel click
        }

        if (wheelDelta) {
          // if vertical mouse wheel amount is defined, non null, non zero
          var compPagePos = this.getCtx().getStageAbsolutePosition();
          if (this._isVertical) var compLoc = event.pageY - compPagePos.y - this.getStartYOffset();
          else compLoc = event.pageX - compPagePos.x - this.getStartXOffset();
          var widthFactor = (this._end - this._start) / this.getContentLength();

          if (this.isRTL() && !this._isVertical) var time = this._viewEndTime - widthFactor * compLoc;
          else time = widthFactor * compLoc + this._viewStartTime;

          event.zoomTime = time;
          event.zoomCompLoc = compLoc;
          event.zoomWheelDelta = wheelDelta * 0.02 + 1;
        }
      }
    }

    handleZoomWheel(newLength, time, compLoc, triggerViewportChangeEvent) {
      var oldViewTime = this._viewEndTime - this._viewStartTime;
      var viewLength = (oldViewTime / (this._end - this._start)) * this.getContentLength();
      this.setContentLength(newLength);
      var viewTime = (viewLength / this.getContentLength()) * (this._end - this._start);
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
        this.setRelativeStartPos((1 / widthFactor) * (this._start - this._viewStartTime));
      } else {
        this._viewStartTime = this._start;
        this._viewEndTime = this._viewStartTime + viewTime;
        if (this._viewEndTime > this._end) this._viewEndTime = this._end;
        this.setRelativeStartPos(0);
      }

      this.applyTimeZoomCanvasPosition();
    }

    /**
     * Zooms by the specified amount.
     * @param {number} dz A number specifying the zoom ratio, e.g. dz = 2 means zoom in by 200%.
     */
    zoomBy(dz) {
      var shiftRatio = (1 / dz - 1) / 2 + 1;
      if (this._isVertical) var compLoc = this.Height / 2;
      else compLoc = this.Width / 2;
      var widthFactor = (this._end - this._start) / this.getContentLength();
      var time = widthFactor * compLoc + this._viewStartTime;
      this.handleZoomWheel(this.getContentLength() * shiftRatio, time, compLoc, true);
    }

    beginPinchZoom(x1, y1, x2, y2) {
      if (this._isVertical)
        this._initialPinchZoomLoc = Math.sqrt((y1 - y2) * (y1 - y2)) + (y1 < y2 ? y1 : y2);
      else this._initialPinchZoomLoc = Math.sqrt((x1 - x2) * (x1 - x2)) + (x1 < x2 ? x1 : x2);
      var widthFactor = (this._end - this._start) / this.getContentLength();

      if (this.isRTL() && !this._isVertical)
        this._initialPinchZoomTime = this._viewEndTime - widthFactor * this._initialPinchZoomLoc;
      else this._initialPinchZoomTime = widthFactor * this._initialPinchZoomLoc + this._viewStartTime;

      this._initialPinchZoomDist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      this._initialPinchZoomLength = this.getContentLength();
    }

    contPinchZoom(x1, y1, x2, y2) {
      var currPinchZoomDist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      if (currPinchZoomDist != this._initialPinchZoomDist) this._triggerViewportChange = true;
      var newLength = (currPinchZoomDist / this._initialPinchZoomDist) * this._initialPinchZoomLength;
      this.handleZoomWheel(newLength, this._initialPinchZoomTime, this._initialPinchZoomLoc, false);
    }

    endPinchZoom() {
      this._initialPinchZoomDist = null;
      this._initialPinchZoomLoc = null;
      this._initialPinchZoomLength = null;
      this._initialPinchZoomTime = null;
      if (this._triggerViewportChange) {
        this._triggerViewportChange = false;
        this.dispatchEvent(this.createViewportChangeEvent());
      }
    }

    /**
     * Sets whether panning is enabled, if possible.
     * E.g. if dragMode is not pan, then nothing happens, unless bForce is true.
     * @param {boolean} panningEnabled true if panning enabled
     * @param {boolean} bForce Whether to force the setting. Default false.
     * @protected
     */
    SetPanningEnabled(panningEnabled, bForce) {
      var dragMode = this.getOptions()['dragMode'];
      if (bForce || dragMode === 'pan' || dragMode == null) {
        this._panningEnabled = panningEnabled;
      } else {
        this._panningEnabled = false;
      }
    }

    /**
     * Gets whether panning is enabled
     * @return {boolean} true if panning enabled
     * @protected
     */
    IsPanningEnabled() {
      return this._panningEnabled;
    }

    /**
     * Sets whether marquee gesture is enabled, if possible.
     * E.g. if dragMode is not select, then nothing happens, unless bForce is true.
     * @param {boolean} marqueeEnabled true if marquee enabled
     * @param {boolean} bForce Whether to force the setting. Default false.
     * @protected
     */
    SetMarqueeEnabled(marqueeEnabled, bForce) {
      if (bForce || this.isMarqueeSelectEnabled()) {
        this._marqueeEnabled = marqueeEnabled;
      } else {
        this._marqueeEnabled = false;
      }
    }

    /**
     * Gets whether marquee gesture is enabled
     * @return {boolean} true if marquee enabled
     * @protected
     */
    IsMarqueeEnabled() {
      return this._marqueeEnabled;
    }

    /**
     * Whether marquee selection is enabled on the component.
     * @return {boolean} whether marquee selection is enabled
     */
    isMarqueeSelectEnabled() {
      return (
        this.getOptions()['dragMode'] === 'select' &&
        this.getOptions()['selectionMode'] === 'multiple'
      );
    }

    /**
     * Whether zooming is enabled on the component.
     * @return {boolean} whether zooming is enabled
     */
    isZoomingEnabled() {
      return this.getOptions()['zooming'] !== 'off';
    }

    /**
     * Gets whether time cursor is enabled
     * @return {boolean} true if time cursor enabled
     * @protected
     */
    IsTimeCursorEnabled() {
      return this.getOptions()['timeCursor'] === 'on';
    }

    /**
     * Pans the Timeline by the specified amount.
     * @param {number} delta The number of pixels to pan the canvas.
     */
    panZoomCanvasBy(delta) {
      if (this._isVertical) {
        var newTranslateY = this._timeZoomCanvas.getTranslateY() - delta;
        var minTranslateY = -(this.getContentLength() - this._canvasLength - this._startY);
        var maxTranslateY = this._startY;

        if (newTranslateY < minTranslateY) newTranslateY = minTranslateY;
        else if (newTranslateY > maxTranslateY) newTranslateY = maxTranslateY;
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

        if (newTranslateX < minTranslateX) newTranslateX = minTranslateX;
        else if (newTranslateX > maxTranslateX) newTranslateX = maxTranslateX;
        this._timeZoomCanvas.setTranslateX(newTranslateX);

        this.setAbsoluteStartPos(newTranslateX - this._startX);
        startPos = this.getRelativeStartPos();
        widthFactor = this.getContentLength() / (this._end - this._start);
        viewTime = this._viewEndTime - this._viewStartTime;
        this._viewStartTime = this._start - startPos / widthFactor;
        this._viewEndTime = this._viewStartTime + viewTime;
        if (this._viewEndTime > this._end) this._viewEndTime = this._end;
      }
    }

    handleZoom(zoomIn) {
      if (!zoomIn) this.zoomBy(this.ZOOM_BY_VALUE);
      else this.zoomBy(1 / this.ZOOM_BY_VALUE);
    }

    enableZoomButton(isZoomIn) {
      if (isZoomIn) {
        this.zoomin.setEnabled(true);
      } else {
        this.zoomout.setEnabled(true);
      }
    }

    disableZoomButton(isZoomIn) {
      if (isZoomIn) {
        this.zoomin.setEnabled(false);
        this.zoomin.setCursor(null);
      } else {
        this.zoomout.setEnabled(false);
        this.zoomout.setCursor(null);
      }
    }

    applyTimeZoomCanvasPosition() {
      if (this._isVertical)
        this._timeZoomCanvas.setTranslateY(this._startY + this.getAbsoluteStartPos());
      else this._timeZoomCanvas.setTranslateX(this._startX + this.getAbsoluteStartPos());
    }

    /**
     * Returns the absolute start position of the timeline.
     * @return {number} The absolute start position of the timeline.
     */
    getAbsoluteStartPos() {
      return this._startPos;
    }

    /**
     * Sets the absolute start position of the timeline.
     * @param {number} startPos The absolute start position of the timeline.
     */
    setAbsoluteStartPos(startPos) {
      this._startPos = startPos;
    }

    /**
     * Returns the timeline's start position relative to the reading direction.
     * @return {number} The timeline's start position relative to the reading direction.
     */
    getRelativeStartPos() {
      if (this.isRTL() && !this._isVertical)
        return this._canvasLength - this.getContentLength() - this._startPos;
      else return this._startPos;
    }

    /**
     * Sets the timeline's start position relative to the reading direction.
     * @param {number} startPos The timeline's start position relative to the reading direction.
     */
    setRelativeStartPos(startPos) {
      if (this.isRTL() && !this._isVertical)
        this._startPos = this._canvasLength - this.getContentLength() - startPos;
      else this._startPos = startPos;
    }

    /**
     * Returns the start offset value of this component in the x direction.
     * @return {number} The start offset value of this component in the x direction.
     */
    getStartXOffset() {
      return this._startX;
    }

    /**
     * Sets the start offset value of this component in the x direction.
     * @param {number} startX The start offset value of this component in the x direction.
     */
    setStartXOffset(startX) {
      this._startX = startX;
    }

    /**
     * Returns the start offset value of this component in the y direction.
     * @return {number} The start offset value of this component in the y direction.
     */
    getStartYOffset() {
      return this._startY;
    }

    /**
     * Sets the start offset value of this component in the y direction.
     * @param {number} startY The start offset value of this component in the y direction.
     */
    setStartYOffset(startY) {
      this._startY = startY;
    }

    /**
     * Gets the chart/graphical area bounds (i.e. excluding scrollbars etc).
     * @return {dvt.Rectangle} The bounds
     */
    getGraphicalAreaBounds() {
      if (this.isVertical())
        return new dvt.Rectangle(this._startX, this._startY, this._canvasSize, this._canvasLength);
      return new dvt.Rectangle(this._startX, this._startY, this._canvasLength, this._canvasSize);
    }

    /**
     * Gets whether time direction scrollbar should be visible.
     * @return {boolean} true if time direction scrollbar is visible, false otherwise.
     */
    isTimeDirScrollbarOn() {
      return true; // always on for now
    }

    /**
     * Gets whether content direction scrollbar should be visible.
     * @return {boolean} true if content direction scrollbar is visible, false otherwise.
     */
    isContentDirScrollbarOn() {
      return true; // always on for now
    }

    /**
     * Gets the scrollbar in the time direction.
     * @return {dvt.SimpleScrollbar} The scrollbar in the time direction.
     */
    getTimeDirScrollbar() {
      return this.timeDirScrollbar;
    }

    /**
     * Gets the scrollbar in the content direction.
     * @param {number=} index The content index.
     * @return {dvt.SimpleScrollbar} The scrollbar in the content direction.
     */
    getContentDirScrollbar(index) {
      if (index) return this.contentDirScrollbar[index];
      else return this.contentDirScrollbar;
    }

    /**
     * Sets the scrollbar in the time direction.
     * @param {dvt.SimpleScrollbar} timeDirScrollbar The scrollbar in the time direction.
     */
    setTimeDirScrollbar(timeDirScrollbar) {
      this.timeDirScrollbar = timeDirScrollbar;
    }

    /**
     * Sets the scrollbar in the content direction.
     * @param {dvt.SimpleScrollbar} contentDirScrollbar The scrollbar in the content direction.
     * @param {number=} index The content index.
     */
    setContentDirScrollbar(contentDirScrollbar, index) {
      if (index != null) {
        if (this.contentDirScrollbar == null) this.contentDirScrollbar = [];

        this.contentDirScrollbar[index] = contentDirScrollbar;
      } else this.contentDirScrollbar = contentDirScrollbar;
    }

    /**
     * Gets the scrollbar padding size.
     * @return {number} The scrollbar padding size.
     */
    getScrollbarPadding() {
      return DvtTimeComponentStyleUtils._SCROLLBAR_PADDING;
    }

    /**
     * Gets the time direction scrollbar style.
     * @return {dvt.CSSStyle} The scrollbar style.
     */
    getTimeDirScrollbarStyle() {
      return DvtTimeComponentStyleUtils.getTimeDirScrollbarStyle();
    }

    /**
     * Gets the content direction scrollbar style.
     * @return {dvt.CSSStyle} The scrollbar style.
     */
    getContentDirScrollbarStyle() {
      return DvtTimeComponentStyleUtils.getContentDirScrollbarStyle();
    }

    /**
     * Event callback method.
     * @param {object} event
     * @param {object} component The component that is the source of the event, if available.
     */
    HandleEvent(event, component) {
      var type = event['type'];
      if (type == 'dvtSimpleScrollbar') {
        event = this.processScrollbarEvent(event, component);
      }

      if (event) this.dispatchEvent(event);
    }

    /**
     * Adjusts viewport based on scrollbar event.
     * @param {object} event
     * @param {object} component The component that is the source of the event, if available.
     */
    processScrollbarEvent(event, component) {
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
    }

    processEvent(event) {
      if (event) this.dispatchEvent(event);
    }

    /**
     * Creates a viewportChange event object
     * @return {object} the viewportChange event object
     */
    createViewportChangeEvent() {
      return null;
    }

    /**
     * Gets the current viewport start time
     * @return {number} the viewport start time
     */
    getViewportStartTime() {
      return this._viewStartTime;
    }

    /**
     * Sets the current viewport start time
     * @param {number} viewportStartTime The viewport start time
     */
    setViewportStartTime(viewportStartTime) {
      this._viewStartTime = viewportStartTime;
    }

    /**
     * Gets the current viewport end time
     * @return {number} the viewport end time
     */
    getViewportEndTime() {
      return this._viewEndTime;
    }

    /**
     * Sets the current viewport end time
     * @param {number} viewportEndTime The viewport end time
     */
    setViewportEndTime(viewportEndTime) {
      this._viewEndTime = viewportEndTime;
    }

    //////////// event handlers, called by TimeComponentEventManager ////////////////////////////
    HandleKeyDown(event) {}

    HandleMouseDown(event) {}

    /**
     * Handles component focus events.
     * @param {object} event The focus event.
     */
    HandleFocus(event) {
      if (this.zoomin != null) this.zoomin._onFocus(event);
      if (this.zoomout != null) this.zoomout._onFocus(event);
    }

    /**
     * Handles component blur events.
     * @param {object} event The blur event.
     */
    HandleBlur(event) {
      if (this.zoomin != null) this.zoomin._onBlur(event);
      if (this.zoomout != null) this.zoomout._onBlur(event);
    }

    beginDragPan(compX, compY) {
      this._currentX = compX;
      this._currentY = compY;
    }

    endDragPan() {
      this.endPan();
    }

    /**
     * Sets the cursor to pan down
     */
    setPanCursorDown() {
      this.setCursor(dvt.ToolkitUtils.getGrabbingCursor());
    }

    /**
     * Sets the cursor to pan up
     */
    setPanCursorUp() {
      this.setCursor(dvt.ToolkitUtils.getGrabCursor());
    }

    /**
     * Setup and creates (but not add to the DOM yet) a glass pane over the component.
     * Calling this method also registers the operation to the usage stack, which keeps track of how many
     * operations currently depend on the glass pane being up.
     */
    registerAndConstructGlassPane() {
      if (!this._glassPaneUsageStack) {
        this._glassPaneUsageStack = [];
      }
      if (!this._glassPane) {
        var glassPaneBounds = this.getGraphicalAreaBounds();
        this._glassPane = new dvt.Rect(
          this.getCtx(),
          glassPaneBounds.x,
          glassPaneBounds.y,
          glassPaneBounds.w,
          glassPaneBounds.h
        );
        this._glassPane.setInvisibleFill();
      }

      this._glassPaneUsageStack.push(1); // register the caller
    }

    /**
     * Adds the glass pane over the component
     * @return {boolean} Whether the glass pane is added, or not (i.e. because it's already there)
     */
    installGlassPane() {
      if (!this._glassPaneDrawn) {
        this.addChild(this._glassPane);
        this._glassPaneDrawn = true;
        return true;
      }
      return false;
    }

    /**
     * Unregister, and removes the glass pane if nothing else is currently dependent on it.
     */
    unregisterAndDestroyGlassPane() {
      // caller is done with the glass pane; unregister
      this._glassPaneUsageStack.pop();

      // If stack is empty, then nothing is currently dependent on the glass pane, so it's safe to remove
      if (this._glassPaneDrawn && this._glassPaneUsageStack.length === 0) {
        this.removeChild(this._glassPane);
        this._glassPaneDrawn = false;
      }
    }

    /**
     * Renders an aria live region for the component, if one doesn't exist already
     * @param {string} idString id for the component
     */
    renderAriaLiveRegion(idString) {
      // Construct a visually hidden aria live region for accessibility
      // TODO consider moving to the dvt context level so that other DVTs can use
      if (!this._ariaLiveRegion) {
        var context = this.getCtx();
        this._ariaLiveRegion = document.createElement('div');
        this._ariaLiveRegion.id = idString;
        this._ariaLiveRegion.setAttribute('aria-live', 'assertive');
        // Visually hide the live region, but still make available for screen readers:
        // styling derived from https://developer.paciellogroup.com/blog/2012/05/html5-accessibility-chops-hidden-and-aria-hidden/
        this._ariaLiveRegion.style.clip = 'rect(1px, 1px, 1px, 1px)';
        this._ariaLiveRegion.style.height = '1px';
        this._ariaLiveRegion.style.overflow = 'hidden';
        this._ariaLiveRegion.style.position = 'absolute';
        this._ariaLiveRegion.style.whiteSpace = 'nowrap';
        this._ariaLiveRegion.style.width = '1px';
        context.getContainer().appendChild(this._ariaLiveRegion);
      }
    }

    /**
     * Gets the component's aria live region.
     * @return {Element} The aria live region element.
     */
    getAriaLiveRegion() {
      return this._ariaLiveRegion;
    }

    /**
     * Updates the aria live region's text. If the live region doesn't exist, nothing happens.
     * @param {string} text The text to update the aria live region with.
     */
    updateLiveRegionText(text) {
      if (this._ariaLiveRegion) {
        this._ariaLiveRegion.textContent = text;
      }
    }

    /**
     * Removes the component's aria live region, if one exists.
     */
    removeAriaLiveRegion() {
      if (this._ariaLiveRegion) {
        var context = this.getCtx();
        context.getContainer().removeChild(this._ariaLiveRegion);
        this._ariaLiveRegion = null;
      }
    }

    HandleTouchEnd(event) {
      if (this._selectionMode != 'none')
        this.handleShapeClick(event, this._selectionMode == 'multiple');
    }

    handleShapeClick(event) {}

    HandleMouseClick(event) {
      this.handleShapeClick(event, event.ctrlKey && this._selectionMode == 'multiple');
    }

    /**
     * @protected
     * Ends panning.
     */
    endPan() {
      if (this._triggerViewportChange) {
        this._triggerViewportChange = false;
        this.dispatchEvent(this.createViewportChangeEvent());
      }
    }

    contDragPan(compX, compY) {
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
    }

    /**
     * Pans the component by the specified amount.
     * @param {number} deltaX The number of pixels to pan in the x direction.
     * @param {number} deltaY The number of pixels to pan in the y direction.
     * @protected
     */
    panBy(deltaX, deltaY) {
      this.panZoomCanvasBy(deltaX);
    }
  }
  TimeComponent.SCROLL_LINE_HEIGHT = 15;

  /**
   * Base event manager for Timeline and Gantt.
   * @param {TimeComponent} comp The owning dvt.Timeline or dvt.Gantt.
   * @extends {dvt.EventManager}
   * @constructor
   */
  class TimeComponentEventManager extends dvt.EventManager {
    constructor(comp) {
      super(comp.getCtx(), comp.processEvent, comp, comp);
      this._comp = comp;
      this._isDragPanning = false;
      this._isPinchZoom = false;
    }

    // TODO: remove this after gantt es6 conversion
    Init(obj, callback, callbackObj, comp) {
      if (callback !== undefined) {
        super.Init(obj, callback, callbackObj, comp);
        this._comp = comp;
      } else {
        super.Init(obj.getCtx(), obj.processEvent, obj, obj);
        this._comp = obj;
      }
      this._isDragPanning = false;
      this._isPinchZoom = false;
    }

    // TODO: shouldn't this be in the toolkit?
    /**
     * @override
     */
    addListeners(displayable) {
      super.addListeners(displayable);
      dvt.SvgDocumentUtils.addDragListeners(
        this._comp,
        this._onDragStart,
        this._onDragMove,
        this._onDragEnd,
        this
      );
      if (!dvt.Agent.isTouchDevice()) {
        if (dvt.Agent.browser === 'firefox')
          displayable.addEvtListener('wheel', this.OnMouseWheel, false, this);
        else displayable.addEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
      }
    }

    /**
     * @override
     */
    RemoveListeners(displayable) {
      super.RemoveListeners(displayable);
      if (!dvt.Agent.isTouchDevice()) {
        if (dvt.Agent.browser === 'firefox')
          displayable.removeEvtListener('wheel', this.OnMouseWheel, false, this);
        else displayable.removeEvtListener(dvt.MouseEvent.MOUSEWHEEL, this.OnMouseWheel, false, this);
      }
    }

    /**
     * @override
     */
    OnFocus(event) {
      super.OnFocus(event);
      this._comp.HandleFocus(event);
    }

    /**
     * @override
     */
    OnBlur(event) {
      super.OnBlur(event);
      this._comp.HandleBlur(event);
    }

    /**
     * @override
     */
    OnKeyDown(event) {
      super.OnKeyDown(event);
      this._comp.HandleKeyDown(event);
    }

    /**
     * @override
     */
    OnClick(event) {
      super.OnClick(event);
      this._comp.HandleMouseClick(event);
    }

    /**
     * @override
     */
    PreOnMouseDown(event) {
      super.PreOnMouseDown(event);
      this._comp.HandleMouseDown(event);
    }

    /**
     * Mouse wheel event handler.
     * @param {mousewheel} event The mousewheel event.
     * @protected
     */
    OnMouseWheel(event) {
      this._comp.HandleMouseWheel(event);
    }

    /**
     * @override
     */
    OnTouchStartBubble(event) {
      super.OnTouchStartBubble(event);
      this._comp.HandleTouchStart(event);
      // iOS does not set focus on touch, so need to force focus
      var stage = this._comp.getCtx().getStage();
      var wrappingDiv = stage.getSVGRoot().parentNode;
      wrappingDiv.focus();
    }

    /**
     * @override
     */
    OnTouchEndBubble(event) {
      super.OnTouchEndBubble(event);
      this._comp.HandleTouchEnd(event);
    }

    /**
     * Drag start callback.
     * @param {dvt.BaseEvent} event
     * @return {boolean} Whether drag is initiated.
     * @private
     */
    _onDragStart(event) {
      if (this._comp.hasValidOptions()) {
        if (dvt.Agent.isTouchDevice()) return this._onTouchDragStart(event);
        else return this._onMouseDragStart(event);
      }
      return false;
    }

    /**
     * Drag move callback.
     * @param {dvt.BaseEvent} event
     * @return {boolean}
     * @private
     */
    _onDragMove(event) {
      if (dvt.Agent.isTouchDevice()) return this._onTouchDragMove(event);
      return this._onMouseDragMove(event);
    }

    /**
     * Drag end callback.
     * @param {dvt.BaseEvent} event
     * @return {boolean}
     * @private
     */
    _onDragEnd(event) {
      if (dvt.Agent.isTouchDevice()) return this._onTouchDragEnd(event);
      return this._onMouseDragEnd(event);
    }

    /**
     * Return the relative position relative to the stage, based on the cached stage absolute position.
     * @param {number} pageX
     * @param {number} pageY
     * @return {dvt.Point} The relative position.
     * @private
     */
    _getRelativePosition(pageX, pageY) {
      if (!this._stageAbsolutePosition)
        this._stageAbsolutePosition = this._context.getStageAbsolutePosition();

      return new dvt.Point(
        pageX - this._stageAbsolutePosition.x,
        pageY - this._stageAbsolutePosition.y
      );
    }

    /**
     * Mouse drag start callback.
     * @param {dvt.BaseEvent} event
     * @return {boolean} Whether drag is initiated.
     * @private
     */
    _onMouseDragStart(event) {
      if (event.button != dvt.MouseEvent.RIGHT_CLICK_BUTTON) {
        var relPos = this._getRelativePosition(event.pageX, event.pageY);
        var dragHandler = this._getDragHandler(relPos);

        // TODO: Consider encapsulate panning logic into a dragHandler, so that only the else block-like logic is needed.
        if (this._comp.IsPanningEnabled()) {
          // only drag pan if inside chart/graphical area
          if (
            this._comp.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y) &&
            !this._isDragPanning
          ) {
            // Hide any tooltip (from keyboard move) and put up a glass pane (for cursor change). Note that these are only relevant for mouse dragging.
            this.hideTooltip();
            this._comp.registerAndConstructGlassPane();
            this._comp.setPanCursorDown();
            this._comp.beginDragPan(relPos.x, relPos.y);
            this._isDragPanning = true;
            return true;
          }
        } else if (dragHandler) {
          if (this._comp.IsMarqueeEnabled()) {
            var dragHandlerEvent = dragHandler.processDragStart(relPos, event.ctrlKey);
            if (dragHandlerEvent) {
              dragHandlerEvent._relPos = relPos;
              this.ProcessMarqueeEvent(dragHandlerEvent);
            }
            this._comp.setCursor(dragHandler.getCursor(relPos));
            return true;
          }
        }
      }
      return false;
    }

    /**
     * Mouse drag move callback.
     * @param {dvt.BaseEvent} event
     * @private
     */
    _onMouseDragMove(event) {
      var relPos = this._getRelativePosition(event.pageX, event.pageY);
      var dragHandler = this._getDragHandler(); // don't pass the relPos so that the drag mode stays

      if (
        this._comp.IsPanningEnabled() &&
        this._comp.contDragPan(relPos.x, relPos.y) &&
        this._isDragPanning
      ) {
        this._comp.installGlassPane();
      } else if (dragHandler) {
        if (this._comp.IsMarqueeEnabled()) {
          var dragHandlerEvent = dragHandler.processDragMove(relPos, event.ctrlKey);
          if (dragHandlerEvent) {
            dragHandlerEvent._relPos = relPos;
            this.ProcessMarqueeEvent(dragHandlerEvent);
          }
        }
      }
    }

    /**
     * Mouse drag end callback.
     * @param {dvt.BaseEvent} event
     * @private
     */
    _onMouseDragEnd(event) {
      var relPos = this._getRelativePosition(event.pageX, event.pageY);
      var dragHandler = this._getDragHandler(); // don't pass the relPos so that the drag mode stays

      if (this._comp.IsPanningEnabled() && this._isDragPanning) {
        this._isDragPanning = false;

        this._comp.endDragPan();

        // No longer need the glass pane
        this._comp.unregisterAndDestroyGlassPane();

        // Update cursor
        if (this._comp.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y))
          this._comp.setPanCursorUp();
        else this._comp.setCursor('inherit');
      } else if (dragHandler) {
        if (this._comp.IsMarqueeEnabled()) {
          var dragHandlerEvent = dragHandler.processDragEnd(relPos, event.ctrlKey);
          if (dragHandlerEvent) {
            dragHandlerEvent._relPos = relPos;
            this.ProcessMarqueeEvent(dragHandlerEvent);
          }
          this._comp.setCursor(dragHandler.getCursor(relPos));
        }
      }
      // Clear the stage absolute position cache
      this._stageAbsolutePosition = null;
    }

    /**
     * @override
     */
    OnMouseMove(event) {
      super.OnMouseMove(event);

      // Update the cursor
      var relPos = this._getRelativePosition(event.pageX, event.pageY);
      var dragHandler = this._getDragHandler();
      if (this._comp.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y)) {
        if (this._comp.IsPanningEnabled()) {
          if (this._isDragPanning) this._comp.setPanCursorDown();
          else this._comp.setPanCursorUp();
          return;
        } else if (dragHandler) {
          if (this._comp.IsMarqueeEnabled()) this._comp.setCursor(dragHandler.getCursor(relPos));
          return;
        }
      }
      this._comp.setCursor('inherit');
    }

    /**
     * Touch drag start callback.
     * @param {dvt.BaseEvent} event
     * @return {boolean} Whether drag is initiated.
     * @private
     */
    _onTouchDragStart(event) {
      var touches = event.touches;
      var bounds = this._comp.getGraphicalAreaBounds();
      var consumeEvent = (_event) => {
        _event.preventDefault();
        if (!this._comp.isDndEnabled()) {
          _event.stopPropagation();
        }
      };

      if (touches.length == 1) {
        var relPos = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
        var dragHandler = this._getDragHandler();

        // only pan if inside chart/graphical area
        if (bounds.containsPoint(relPos.x, relPos.y)) {
          // TODO: Encapsulate panning logic into a dragHandler, so that only else block is needed.
          if (this._comp.IsPanningEnabled()) {
            this._comp.beginDragPan(relPos.x, relPos.y);
            consumeEvent(event);
            return true;
          } else if (dragHandler) {
            if (this._comp.IsMarqueeEnabled()) {
              var dragHandlerEvent = dragHandler.processDragStart(relPos, true);
              if (dragHandlerEvent) {
                dragHandlerEvent._relPos = relPos;
                this.ProcessMarqueeEvent(dragHandlerEvent);
              }
              this.getCtx().getTooltipManager().hideTooltip();
              consumeEvent(event);
              return true;
            }
          }
        }
      } else if (touches.length == 2) {
        if (this._comp.IsPanningEnabled()) {
          this._comp.endDragPan();
        }

        this._isPinchZoom = true;
        var relPos1 = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
        var relPos2 = this._getRelativePosition(touches[1].pageX, touches[1].pageY);

        // only pinch zoom if inside chart/graphical area
        if (
          bounds.containsPoint(relPos1.x, relPos1.y) &&
          bounds.containsPoint(relPos2.x, relPos2.y)
        ) {
          this._comp.beginPinchZoom(relPos1.x, relPos1.y, relPos2.x, relPos2.y);
          consumeEvent(event);
          return true;
        }
      }
      return false;
    }

    /**
     * Touch drag move callback.
     * @param {dvt.BaseEvent} event
     * @private
     */
    _onTouchDragMove(event) {
      var touches = event.touches;
      // make sure this is a single touch and not a multi touch
      if (touches.length == 1) {
        var relPos = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
        var dragHandler = this._getDragHandler();

        if (this._comp.IsPanningEnabled()) {
          this._comp.contDragPan(relPos.x, relPos.y);
          event.preventDefault();
        } else if (dragHandler) {
          if (this._comp.IsMarqueeEnabled()) {
            var dragHandlerEvent = dragHandler.processDragMove(relPos, true);
            if (dragHandlerEvent) {
              dragHandlerEvent._relPos = relPos;
              this.ProcessMarqueeEvent(dragHandlerEvent);
            }
            this.getCtx().getTooltipManager().hideTooltip();
            event.preventDefault();
          }
        }
      } else if (touches.length == 2) {
        var relPos1 = this._getRelativePosition(touches[0].pageX, touches[0].pageY);
        var relPos2 = this._getRelativePosition(touches[1].pageX, touches[1].pageY);
        this._comp.contPinchZoom(relPos1.x, relPos1.y, relPos2.x, relPos2.y);
        event.preventDefault();
      }
    }

    /**
     * Touch drag end callback.
     * @param {dvt.BaseEvent} event
     * @private
     */
    _onTouchDragEnd(event) {
      if (!this._isPinchZoom) {
        if (this._comp.IsPanningEnabled()) {
          this._comp.endDragPan();
          event.preventDefault();
        } else if (this._comp.IsMarqueeEnabled()) {
          var dragHandler = this._getDragHandler();
          if (dragHandler) {
            var dragHandlerEvent = dragHandler.processDragEnd(null, true);
          }
          if (dragHandlerEvent) {
            this.ProcessMarqueeEvent(dragHandlerEvent);
          }
          event.preventDefault();
        }
      } else {
        this._isPinchZoom = false;
        this._comp.endPinchZoom();
        event.preventDefault();
      }
      // Clear the stage absolute position cache
      this._stageAbsolutePosition = null;
    }

    /**
     * Returns an event handler for the current drag mode.
     * @param {dvt.Point} relPos (optional) The current cursor position relative to the stage. If provided, the relPos will
     *    be considered in choosing the drag handler.
     * @return {dvt.MarqueeHandler} Drag handler.
     * @private
     */
    _getDragHandler(relPos) {
      if (relPos && !this._comp.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y)) {
        return null;
      }
      if (this._comp.isMarqueeSelectEnabled()) {
        return this._marqueeSelectHandler;
      }
      return null;
    }

    /**
     * Sets the marquee select handler.
     * @param {dvt.MarqueeHandler} handler The marquee select handler.
     */
    setMarqueeSelectHandler(handler) {
      this._marqueeSelectHandler = handler;
    }

    /**
     * Processes marquee event.
     * @param {object} event Marquee event.
     * @protected
     */
    ProcessMarqueeEvent(event) {
      // Subclasses should implement
    }

    /**
     * Cancels marquee.
     * @param {dvt.BaseEvent} event The event
     */
    cancelMarquee(event) {
      if (this._comp.isMarqueeSelectEnabled() && this._marqueeSelectHandler) {
        this._marqueeSelectHandler.cancelMarquee();
      }
    }

    /**
     * Zooms by the specified amount.
     * @param {number} dz A number specifying the zoom ratio. dz = 1 means no zoom.
     */
    zoomBy(dz) {
      this._comp.zoomBy(dz);
    }

    /**
     * Pans by the specified amount.
     * @param {number} dx A number from specifying the pan ratio in the x direction, e.g. dx = 0.5 means pan end by 50%..
     * @param {number} dy A number from specifying the pan ratio in the y direction, e.g. dy = 0.5 means pan down by 50%.
     */
    panBy(dx, dy) {
      var deltaX = dx * this._comp._canvasLength * (dvt.Agent.isRightToLeft(this._context) ? -1 : 1);
      var deltaY = dy * this._comp._canvasSize;
      if (deltaX != 0) this._comp._triggerViewportChange = true;

      this._comp.panBy(deltaX, deltaY);
      this._comp.endPan();
    }

    /**
     * Zoom in button click handler.
     * @param {dvt.BaseEvent} event The dispatched event to be processed by the object.
     */
    HandleZoomInClick(event) {
      this._comp.handleZoom(true);
    }

    /**
     * Zoom out button click handler.
     * @param {dvt.BaseEvent} event The dispatched event to be processed by the object.
     */
    HandleZoomOutClick(event) {
      this._comp.handleZoom(false);
    }

    /**
     * @override
     */
    GetTouchResponse() {
      return dvt.EventManager.TOUCH_RESPONSE_TOUCH_HOLD;
    }
  }

  /**
   * TimeComponent keyboard handler.
   * @param {dvt.EventManager} manager The owning dvt.EventManager.
   * @class TimeComponentKeyboardHandler
   * @extends {dvt.KeyboardHandler}
   * @constructor
   */
  class TimeComponentKeyboardHandler extends dvt.KeyboardHandler {
    /**
     * @override
     */
    isSelectionEvent(event) {
      return this.isNavigationEvent(event) && !event.ctrlKey;
    }

    /**
     * @override
     */
    isMultiSelectEvent(event) {
      return event.keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey;
    }

    /**
     * @override
     */
    processKeyDown(event) {
      if (dvt.KeyboardEvent.isPlus(event) || dvt.KeyboardEvent.isEquals(event)) {
        this._eventManager.HandleZoomInClick();
      } else if (dvt.KeyboardEvent.isMinus(event) || dvt.KeyboardEvent.isUnderscore(event)) {
        this._eventManager.HandleZoomOutClick();
      } else {
        var keyCode = event.keyCode;
        if (keyCode == dvt.KeyboardEvent.PAGE_UP) {
          if (event.shiftKey) this._eventManager.panBy(-0.25, 0);
          else this._eventManager.panBy(0, -0.25);

          dvt.EventManager.consumeEvent(event);
        } else if (keyCode == dvt.KeyboardEvent.PAGE_DOWN) {
          if (event.shiftKey) this._eventManager.panBy(0.25, 0);
          else this._eventManager.panBy(0, 0.25);

          dvt.EventManager.consumeEvent(event);
        }
      }

      return super.processKeyDown(event);
    }
  }

  exports.TimeComponent = TimeComponent;
  exports.TimeComponentEventManager = TimeComponentEventManager;
  exports.TimeComponentKeyboardHandler = TimeComponentKeyboardHandler;

  Object.defineProperty(exports, '__esModule', { value: true });

});
