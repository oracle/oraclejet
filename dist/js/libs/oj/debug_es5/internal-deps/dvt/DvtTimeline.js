/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['./DvtToolkit', './DvtTimeAxis', './DvtOverview', './DvtTimeComponent'], function(dvt) {
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
   * TimelineOverview component.
   * @param {dvt.Context} context The rendering context.
   * @param {object} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The object context for the callback function
   * @class TimelineOverview component.
   * @constructor
   * @extends {dvt.Container}
   */
  dvt.TimelineOverview = function (context, callback, callbackObj) {
    this.Init(context, callback, callbackObj);
  };

  dvt.Obj.createSubclass(dvt.TimelineOverview, dvt.Overview); // state

  dvt.TimelineOverview.ENABLED_STATE = '_';
  dvt.TimelineOverview.HOVER_STATE = '_h';
  dvt.TimelineOverview.SELECTED_STATE = '_s';
  dvt.TimelineOverview.ACTIVE_SELECTED_STATE = '_as'; // property

  dvt.TimelineOverview.BORDER_STYLE = 'bs';
  dvt.TimelineOverview.BORDER_COLOR = 'bc';
  dvt.TimelineOverview.BORDER_WIDTH = 'bw';
  dvt.TimelineOverview.DURATION_BORDER_STYLE = 'dbs';
  dvt.TimelineOverview.DURATION_BORDER_COLOR = 'dbc';
  dvt.TimelineOverview.DURATION_BORDER_WIDTH = 'dbw';
  dvt.TimelineOverview.BORDER_OFFSET = 'bof';
  dvt.TimelineOverview.BORDER_OPACITY = 'bo';
  dvt.TimelineOverview.GLOW_COLOR = 'gc';
  dvt.TimelineOverview.GLOW_OPACITY = 'go';
  dvt.TimelineOverview.FILL_COLOR = 'fc';
  /**
   * Returns a new instance of dvt.TimelineOverview.
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @return {dvt.TimelineComponent}
   */

  dvt.TimelineOverview.newInstance = function (context, callback, callbackObj) {
    return new dvt.TimelineOverview(context, callback, callbackObj);
  };
  /**
   * Initializes the view.
   * @param {dvt.Context} context The rendering context.
   * @param {object} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The object context for the callback function
   * @protected
   * @override
   */


  dvt.TimelineOverview.prototype.Init = function (context, callback, callbackObj) {
    dvt.TimelineOverview.superclass.Init.call(this, context, callback, callbackObj); // default fills

    var colors = [dvt.ColorUtils.getPound(dvt.ColorUtils.getBrighter('#aadd77', 0.35)), '#aadd77', dvt.ColorUtils.getPound(dvt.ColorUtils.getDarker('#aadd77', 0.5))]; // get pastel doesn't work too well on ipad

    if (dvt.OverviewUtils.supportsTouch()) colors = ['#aadd77'];
    this._defColors = colors;
    this._markerBorderFill = dvt.SolidFill.invisibleFill(); // default marker size

    this._markerSize = 12;
  };
  /**
   * @override
   */


  dvt.Overview.prototype.initDefaults = function () {
    this.Defaults = new DvtTimelineOverviewDefaults();
  };
  /**
   * @protected
   * @override
   */


  dvt.TimelineOverview.prototype.getParser = function (obj) {
    return new DvtTimelineOverviewParser(this);
  };
  /**
   * Applies the parsed properties to this component.
   * @param {object} props An object containing the parsed properties for this component.
   * @protected
   * @override
   */


  dvt.TimelineOverview.prototype._applyParsedProperties = function (props) {
    dvt.TimelineOverview.superclass._applyParsedProperties.call(this, props);

    this._selectionMode = props.selectionMode;
    this._markers = props.markers;
    this._seriesIds = props.seriesIds;
    this._defaultMarkerStyles = props.defaultMarkerStyles;
    this._borderStyles = DvtTimelineOverviewStyleUtils.getDefaultMarkerBorderStyles(this.Options);
    this._durationColors = dvt.CSSStyle.COLORS_ALTA;
    if (props.labelStyle) this._labelStyle = new dvt.CSSStyle(props.labelStyle); // calculate marker spacing offset value

    var minMarkerSpacing = 1;
    var markerSpacingError = 1;
    if (this.getStyle(dvt.TimelineOverview.ENABLED_STATE, dvt.TimelineOverview.BORDER_STYLE) == 'solid') var _eOffset = parseInt(this.getStyle(dvt.TimelineOverview.ENABLED_STATE, dvt.TimelineOverview.BORDER_OFFSET), 10);else _eOffset = minMarkerSpacing;
    if (this.getStyle(dvt.TimelineOverview.ACTIVE_SELECTED_STATE, dvt.TimelineOverview.BORDER_STYLE) == 'solid') var _asOffset = parseInt(this.getStyle(dvt.TimelineOverview.ACTIVE_SELECTED_STATE, dvt.TimelineOverview.BORDER_OFFSET), 10);else _asOffset = minMarkerSpacing;
    if (this.getStyle(dvt.TimelineOverview.SELECTED_STATE, dvt.TimelineOverview.BORDER_STYLE) == 'solid') var _sOffset = parseInt(this.getStyle(dvt.TimelineOverview.SELECTED_STATE, dvt.TimelineOverview.BORDER_OFFSET), 10);else _sOffset = minMarkerSpacing;
    if (this.isItemSelectionEnabled()) this._markerSpacingOffset = Math.max(_asOffset, _sOffset, _eOffset, minMarkerSpacing) / 2 + markerSpacingError;else this._markerSpacingOffset = minMarkerSpacing; // some of the defaults depends on orientation

    this._defOpacity = this.isVertical() ? 0 : 0.75;
    this._defAlphas = [this._defOpacity, this._defOpacity, this._defOpacity];
    this._radialFill = new dvt.LinearGradientFill(250, this._defColors, this._defAlphas);
    this._linearFill = new dvt.LinearGradientFill(180, this._defColors, this._defAlphas);
    var borderOpacity = this.isVertical() ? 0 : 1;
    this._border = new dvt.Stroke('#aadd77', borderOpacity);
  };
  /**
   * Retrieves the id of the timeline series associated with the timeline
   * @return {Array} an array of timeline series id
   */


  dvt.TimelineOverview.prototype.getSeriesIds = function () {
    if (this._seriesIds == null) return null;
    return this._seriesIds.split(' ');
  };
  /***************************** common helper methods *********************************************/


  dvt.TimelineOverview.prototype.isItemSelectionEnabled = function () {
    return this._selectionMode != 'none';
  };

  dvt.TimelineOverview.prototype.getDrawableById = function (id) {
    var numChildren = this.getNumChildren();

    for (var childIndex = 0; childIndex < numChildren; childIndex++) {
      var drawable = this.getChildAt(childIndex);
      if (drawable && drawable._node && dvt.Obj.compareValues(this.getCtx(), id, drawable._node.getId())) return drawable;
    }

    return null;
  };

  dvt.TimelineOverview.prototype.getItemId = function (drawable) {
    if (drawable._node) return drawable._node.getId();else return drawable.getId().substr(5);
  };

  dvt.TimelineOverview.prototype.getStyle = function (state, style) {
    return this._borderStyles[state + style];
  };

  dvt.TimelineOverview.prototype.getX = function (drawable) {
    if (drawable._node != null) return drawable._node.getX();else return drawable.getMatrix().getTx();
  };

  dvt.TimelineOverview.prototype.getY = function (drawable) {
    if (drawable._node != null) return drawable._node.getY();else return drawable.getMatrix().getTy();
  };

  dvt.TimelineOverview.prototype.getScaleX = function (node) {
    var scaleX = node.getScaleX();

    if (scaleX == null) {
      // for vertical the scale factor is calculated by the available space take away border/padding, then divided that by the width of marker
      scaleX = this.isVertical() ? (this.Width - this.getTimeAxisWidth() - 4) / 2 : 1;
    }

    return scaleX;
  };

  dvt.TimelineOverview.prototype.getScaleY = function (node) {
    var scaleY = node.getScaleY();
    if (scaleY == null) scaleY = 1;
    return scaleY;
  };
  /***************************** end common helper methods *********************************************/

  /***************************** marker creation and event handling *********************************************/


  dvt.TimelineOverview.prototype.renderData = function (width, height) {
    dvt.TimelineOverview.superclass.renderData.call(this, width, height);
    if (this._markers == null) return;

    if (this.isVertical()) {
      var start = this._yMin;
      var end = this._yMax;
    } else {
      start = this._xMin;
      end = this._xMax;
    } // find the optimal size of the marker


    var opt = this.calculateOptimalSize(start, end, width, height, this._markerSize);
    var durationMarkers = [];

    for (var j = 0; j < this._markers.length; j++) {
      var marker = this._markers[j];
      if (marker._endTime == null) this.addMarker(marker, opt);else durationMarkers[durationMarkers.length] = marker;
    }

    this.prepareDurations(durationMarkers);
    this.addDurations(durationMarkers, start, end);
    this._markerSize = opt;
  };

  dvt.TimelineOverview.prototype.prepareDurations = function (durationMarkers) {
    this._maxDurationY = 0;
    var markerSeries = null;
    if (this._durationColorMap == null) this._durationColorMap = new Object();

    for (var i = 0; i < durationMarkers.length; i++) {
      var marker = durationMarkers[i];
      var id = marker.getId();
      var sId = marker.getSeriesId();

      if (sId != markerSeries) {
        this._colorCount = 0;
        markerSeries = sId;
      }

      marker._durationLevel = this.calculateDurationY(marker, durationMarkers);

      if (marker._durationFillColor == null) {
        if (this._durationColorMap[id] == null) {
          this._durationColorMap[id] = this._colorCount;
          marker._durationFillColor = this._durationColors[this._colorCount];
          this._colorCount++;
          if (this._colorCount == this._durationColors.length) this._colorCount = 0;
        } else marker._durationFillColor = this._durationColors[this._durationColorMap[id]];
      }
    }
  };
  /**
   * Gets the current color mapping of duration bars.
   * @return {Array} the current color mapping of duration bars.
   */


  dvt.TimelineOverview.prototype.getDurationColorMap = function () {
    if (this._durationColorMap) return this._durationColorMap;else return null;
  };

  dvt.TimelineOverview.prototype.calculateOptimalSize = function (start, end, width, height, size) {
    var result = new Object();
    result.max = 1;
    result.arr = [];
    var canvasSize = this.isVertical() ? height : width;

    for (var i = 0; i < this._markers.length; i++) {
      var marker = this._markers[i];

      if (marker._endTime != null) {
        var x = dvt.OverviewUtils.getDatePosition(start, end, marker.getTime(), canvasSize);
        if (this.isHorizontalRTL()) x = canvasSize - x;
        marker.setX(x);
        continue;
      }

      this.calculateSize(marker, start, end, canvasSize, size / 2, result, height); // if max > height, then we'll need to reduce the size of marker and recalculate, so just bail out

      if (result.max > height) break;
    } // minimum size is 1 (also to prevent infinite recursion)


    if (result.max > height && size > 1) {
      // adjusted the size and try again.  This could potentially be optimized if
      // the scaleX and scaleY of each marker are identical, then we could calculate
      // the size by determining the size of the stack and use that to calculate the
      // size
      return this.calculateOptimalSize(start, end, width, height, size - 1);
    } else return size;
  };

  dvt.TimelineOverview.prototype.addMarker = function (node, sz) {
    var itemId = '_mrk_' + node.getId();
    var color = node.getColor();
    var isGradient = node.isGradient();
    var opacity = node.getOpacity();

    if (opacity == null) {
      opacity = this._defOpacity; // if default opacity is zero but a custom color is specified, override the opacity to 1

      if (opacity == 0 && color != null) opacity = 1;
    }

    var scaleX = this.getScaleX(node);
    var scaleY = this.getScaleY(node); // draw the shapes

    var marker = node.getShape();

    if (this.isVertical()) {
      marker = dvt.SimpleMarker.RECTANGLE;
      var width = 2 * scaleX;
      var height = 2 * scaleY;
      var cx = node.getY() + width / 2;
      var cy = node.getX() + height / 2;
    } else {
      width = sz * scaleX;
      height = sz * scaleY;
      cx = node.getX() + width / 2;
      cy = node.getY() + height / 2;
    }

    var displayable = new dvt.SimpleMarker(this.getCtx(), marker, cx, cy, width, height, null, null, null, itemId); // associate the node with the marker

    displayable._node = node;

    if (color == null && opacity == this._defOpacity && isGradient == null) {
      // use default fills
      if (marker == dvt.SimpleMarker.CIRCLE) fill = this._radialFill;else fill = this._linearFill;
      stroke = this._border;
    } else {
      var colors = this._defColors;

      if (color != null) {
        if (dvt.OverviewUtils.supportsTouch()) colors = [color];else {
          var lighter = dvt.ColorUtils.getBrighter(color, 0.50);
          var darker = dvt.ColorUtils.getDarker(color, 0.50);
          colors = [lighter, color, darker];
        }
      }

      var alphas = [opacity, opacity, opacity];

      if (isGradient == null) {
        if (marker == dvt.SimpleMarker.CIRCLE) var fill = new dvt.LinearGradientFill(250, colors, alphas);else fill = new dvt.LinearGradientFill(180, colors, alphas);
      } else fill = new dvt.SolidFill(color, alphas[0]);

      var stroke = new dvt.Stroke(color, opacity);
    }

    displayable.setFill(fill);
    displayable.setStroke(stroke);
    if (this.isItemSelectionEnabled()) displayable.setSelectable(true);
    var count = this.getNumChildren();
    var lastChild = this.getChildAt(count - 1);
    if (count > this._lastChildIndex && (lastChild.getId() == 'tb' || lastChild.getId() == 'arr')) this.addChildAt(displayable, count - this._lastChildIndex); // insert right before the left handle
    else this.addChild(displayable); // associate the displayable with the node

    node.setDisplayable(displayable);
    this.applyState(displayable, dvt.TimelineOverview.ENABLED_STATE); // Do not antialias markers if specified or vertical

    if ((this.isVertical() || marker == dvt.SimpleMarker.RECTANGLE || marker == dvt.SimpleMarker.DIAMOND || marker == dvt.SimpleMarker.TRIANGLE_UP || marker == dvt.SimpleMarker.TRIANGLE_DOWN || marker == dvt.SimpleMarker.PLUS) && this._defaultMarkerStyles.pixelHinting != 'false') {
      displayable.setPixelHinting(true);
    }

    return displayable;
  };

  dvt.TimelineOverview.prototype.addDurations = function (durationMarkers, start, end) {
    var context = this.getCtx();

    for (var i = this._maxDurationY; i > 0; i--) {
      for (var j = 0; j < durationMarkers.length; j++) {
        var node = durationMarkers[j];

        if (i == node._durationLevel) {
          var x = dvt.OverviewUtils.getDatePosition(start, end, node.getTime(), this.isVertical() ? this.Height : this.Width);
          var durationId = '_drn_' + node.getId();
          var durationY = 9 + 5 * node._durationLevel;
          var x2 = dvt.OverviewUtils.getDatePosition(start, end, node.getEndTime(), this.isVertical() ? this.Height : this.Width);

          if (this.isVertical()) {
            if (this.isRTL()) var duration = new dvt.Rect(context, 0, x, durationY, x2 - x, durationId);else duration = new dvt.Rect(context, this.Width - durationY, x, durationY, x2 - x, durationId);
          } else {
            if (this.isRTL()) duration = new dvt.Rect(context, this.Width - x2, this.Height - durationY - 20, x2 - x, durationY, durationId);else duration = new dvt.Rect(context, x, this.Height - durationY - 20, x2 - x, durationY, durationId);
          }

          duration.setFill(new dvt.SolidFill(node._durationFillColor));
          var feelerStroke = new dvt.Stroke(this.getStyle(dvt.TimelineOverview.ENABLED_STATE, dvt.TimelineOverview.DURATION_BORDER_COLOR), 1, 1);
          duration.setStroke(feelerStroke);
          duration.setPixelHinting(true);
          duration._node = node;
          this.addChild(duration);
          node._durationBar = duration;
          node._durationY = durationY - 2;
        }
      }
    } // timeAxisTopBar needs to be rendered after the duration markers to cover the bottom border


    this.removeChild(this._timeAxisTopBar);
    this.addChild(this._timeAxisTopBar);
  };

  dvt.TimelineOverview.prototype.calculateSize = function (node, start, end, size, hsz, result, maxHeight) {
    var hszx = hsz * this.getScaleX(node) + this._markerSpacingOffset;

    var hszy = hsz * this.getScaleY(node) + this._markerSpacingOffset;

    var time = node.getTime();
    var cx = dvt.OverviewUtils.getDatePosition(start, end, time, size);
    if (this.isHorizontalRTL()) cx = size - cx - hszx * 2; // we only need to calculate y for the non-vertical case

    if (!this.isVertical()) {
      var cy = 3;
      if (this.isOverviewAbove()) cy = cy + this.getTimeAxisHeight();
      var maxy = 0;
      var overlappingMarkers = [];

      for (var i = 0; i < result.arr.length; i++) {
        var prevMarker = result.arr[i];
        var prevX = prevMarker.getX();
        var prevScaleX = this.getScaleX(prevMarker); // see if x intersects

        var xDist = Math.abs(cx - prevX);
        var minDist = hsz * prevScaleX + this._markerSpacingOffset + hszx; // if x does intersect, add it to the set of overlapping markers

        if (xDist < minDist) overlappingMarkers.push(prevMarker);
      }

      for (i = 0; i < overlappingMarkers.length; i++) {
        var obj = this.calculateY(overlappingMarkers, node.getShape(), cx, cy, hszx, hszy, maxy, hsz, maxHeight);
        maxy = obj['maxy'];

        if (obj['cy'] == cy) {
          // cy is the same, so we are done with this marker
          cy = obj['cy'];
          break;
        } else {
          // cy changed, we have to go over the array again with the new value
          // to see if there's new collision
          cy = obj['cy'];
        }
      }
    } else {
      // for vertical timeline, marker is 4 px from the right edge of the overview
      var borderOffset = 0;
      var borderStyle = this.getStyle(dvt.TimelineOverview.ENABLED_STATE, dvt.TimelineOverview.BORDER_STYLE);
      if (borderStyle == 'solid') borderOffset = parseInt(this.getStyle(dvt.TimelineOverview.ENABLED_STATE, dvt.TimelineOverview.BORDER_WIDTH), 10);
      if (this.isRTL()) cy = borderOffset + 4;else cy = this.Width - this.getScaleX(node) * 2 - borderOffset - 4;
    }

    node.setX(cx);
    node.setY(cy);
    result.arr.push(node);
    if (maxy > result.max) result.max = maxy;
  }; // overlappingMarkers - set of previous markers that may overlap
  // cx - x coord of the marker to be add
  // cy - y coord of the marker to be add
  // hszx - scale adjusted width of marker
  // hszy - scale adjusted height of marker
  // maxy - maximum y of all markers


  dvt.TimelineOverview.prototype.calculateY = function (overlappingMarkers, shape, cx, cy, hszx, hszy, maxy, hsz, maxHeight) {
    // see if y intersects
    for (var i = 0; i < overlappingMarkers.length; i++) {
      var prevMarker = overlappingMarkers[i];
      var prevX = prevMarker.getX();
      var prevY = prevMarker.getY();
      var prevShape = prevMarker.getShape();
      var prevScaleX = this.getScaleX(prevMarker);
      var prevScaleY = this.getScaleY(prevMarker); // if the markers are both circles with consistent scaleX and scaleY values, use optimized spacing below

      if (shape == dvt.SimpleMarker.CIRCLE && prevShape == dvt.SimpleMarker.CIRCLE && hszx == hszy && prevScaleX == prevScaleY) {
        var xDist = Math.abs(cx - prevX);
        var minDist = hsz * prevScaleX + this._markerSpacingOffset + hszx;
        var height = Math.sqrt(minDist * minDist - xDist * xDist);
      } else height = hsz * prevScaleY + this._markerSpacingOffset + hszy; // if required height is greater than current value, update height


      if (height > Math.abs(cy - prevY)) {
        cy = prevY + height;
        maxy = Math.max(maxy, cy + height); // if maxy > maxHeight and not minimal size, then we'll need to reduce the size of marker and recalculate, so bail out

        if (hsz >= 1 && maxHeight != undefined && maxy > maxHeight) break;
      }
    }

    return {
      'cy': cy,
      'maxy': maxy
    };
  };

  dvt.TimelineOverview.prototype.calculateDurationY = function (item, durationMarkers) {
    var index = durationMarkers.length;
    var initialY = 1;
    var startTime = item.getTime();
    var y = item._durationLevel;
    if (y == null) y = initialY;

    for (var i = 0; i < index; i++) {
      var currItem = durationMarkers[i];

      if (currItem != item) {
        var currEndTime = currItem.getEndTime();
        if (currEndTime == null) continue;
        var currStartTime = currItem.getTime();
        var curry = currItem._durationLevel;
        if (curry == null) curry = initialY;

        if (startTime >= currStartTime && startTime <= currEndTime && y == curry) {
          y = curry + 1; // y changed, do the loop again

          item._durationLevel = y; // calculate again from start since y changed and we might have a conflict again

          y = this.calculateDurationY(item, durationMarkers);
        }
      }
    }

    if (y > this._maxDurationY) this._maxDurationY = y;
    return y;
  };
  /************************** event handling *********************************************/


  dvt.TimelineOverview.prototype.HandleShapeMouseOver = function (event) {
    // drawable will be null if it is handled by super
    var drawable = dvt.TimelineOverview.superclass.HandleShapeMouseOver.call(this, event);
    if (drawable == null) return;

    if (drawable._node != null) {
      var tooltip = drawable._node.getDescription();

      if (tooltip != null) {
        // Show the tooltip
        this.getCtx().getTooltipManager().showDatatip(event.pageX, event.pageY, tooltip, '#000000');
      }
    } // if selection is disabled in Timeline then return


    if (!this.isItemSelectionEnabled()) return;
    var isSelected = false; // only remove stroke if it is not selected

    if (this._selectedMarkers != null) {
      for (var i = 0; i < this._selectedMarkers.length; i++) {
        // found it
        if (drawable == this._selectedMarkers[i]) {
          isSelected = true;
          break;
        }
      }
    } // highlight the item also, make sure it's not selected


    if (!isSelected) {
      var itemId = this.getItemId(drawable);
      var evt = dvt.EventFactory.newTimelineOverviewEvent('highlight', itemId); // highlight the item in timeline series

      this.dispatchEvent(evt); // highlight the marker

      this.highlightMarker(drawable);
    }
  };

  dvt.TimelineOverview.prototype.HandleShapeMouseOut = function (event) {
    // drawable will be null if it is handled by super
    var drawable = dvt.TimelineOverview.superclass.HandleShapeMouseOut.call(this, event);
    if (drawable == null) return;

    if (!this.isMovable(drawable)) {
      // hide the tooltip
      this.getCtx().getTooltipManager().hideTooltip();
      var isSelected = false; // only remove stroke if it is not selected

      if (this._selectedMarkers != null) {
        for (var i = 0; i < this._selectedMarkers.length; i++) {
          // found it
          if (drawable == this._selectedMarkers[i]) {
            isSelected = true;
            break;
          }
        }
      }

      if (!isSelected) {
        // unhighlight item also
        var itemId = this.getItemId(drawable);
        var evt = dvt.EventFactory.newTimelineOverviewEvent('unhighlight', itemId); // highlight the item in timeline series

        this.dispatchEvent(evt); // highlight the marker

        this.unhighlightMarker(drawable);
      }
    }
  };

  dvt.TimelineOverview.prototype.HandleShapeClick = function (event, pageX, pageY) {
    // drawable will be null if it is handled by super
    var drawable = dvt.TimelineOverview.superclass.HandleShapeClick.call(this, event, pageX, pageY);
    if (drawable == null) return; // handle click on marker

    this.HandleMarkerClick(drawable, event.ctrlKey || event.shiftKey || dvt.Agent.isTouchDevice());
  };

  dvt.TimelineOverview.prototype.HandleMarkerClick = function (drawable, isMultiSelect) {
    // if selection is disabled in Timeline then return
    if (!this.isItemSelectionEnabled()) return; // selects the corresponding item

    this.selectItem(drawable, isMultiSelect);

    var time = drawable._node.getTime();

    if (time != null) {
      // scroll overview
      var slidingWindow = this.getSlidingWindow();
      var newPos;

      if (this.isVertical()) {
        newPos = this.getX(drawable) - slidingWindow.getHeight() / 2;
        this.animateSlidingWindow(null, newPos);
      } else {
        newPos = this.getX(drawable) - slidingWindow.getWidth() / 2;
        this.animateSlidingWindow(newPos);
      }
    }
  };
  /************************** end event handling *********************************************/

  /************************** marker highlight *********************************************/


  dvt.TimelineOverview.prototype.highlightItem = function (itemId) {
    var drawable = this.getDrawableById(itemId);
    if (drawable != null) this.highlightMarker(drawable);
  };

  dvt.TimelineOverview.prototype.unhighlightItem = function (itemId) {
    var drawable = this.getDrawableById(itemId);
    if (drawable != null) this.unhighlightMarker(drawable);
  };

  dvt.TimelineOverview.prototype.highlightMarker = function (drawable) {
    if (this._selectedMarkers != null) {
      for (var i = 0; i < this._selectedMarkers.length; i++) {
        var marker = this._selectedMarkers[i];

        if (drawable == marker) {
          // selected, do nothing
          return;
        }
      }
    } // draw border


    this.applyState(drawable, dvt.TimelineOverview.HOVER_STATE);
  };

  dvt.TimelineOverview.prototype.unhighlightMarker = function (drawable) {
    if (this._selectedMarkers != null) {
      for (var i = 0; i < this._selectedMarkers.length; i++) {
        var marker = this._selectedMarkers[i];

        if (drawable == marker) {
          // selected, do nothing
          return;
        }
      }
    }

    this.applyState(drawable, dvt.TimelineOverview.ENABLED_STATE);
  };
  /************************** end marker highlight *****************************************/

  /************************** marker selection *********************************************/


  dvt.TimelineOverview.prototype.selSelectItem = function (itemId) {
    var drawable = this.getDrawableById(itemId);
    if (drawable != null) this.addSelectedMarker(drawable);
  };

  dvt.TimelineOverview.prototype.selUnselectItem = function (itemId) {
    var drawable = this.getDrawableById(itemId);
    if (drawable != null) this.removeSelectedMarker(drawable);
  };

  dvt.TimelineOverview.prototype.selectItem = function (drawable, isMultiSelect) {
    var itemId = this.getItemId(drawable); // scroll timeline

    var evt = dvt.EventFactory.newTimelineOverviewEvent('selection', itemId, isMultiSelect);
    this.dispatchEvent(evt);
  };

  dvt.TimelineOverview.prototype.addSelectedMarker = function (drawable) {
    if (this._selectedMarkers == null) this._selectedMarkers = [];
    var lastSelectedMarker = null;
    if (this._selectedMarkers.length > 0) lastSelectedMarker = this._selectedMarkers[this._selectedMarkers.length - 1];

    this._selectedMarkers.push(drawable);

    if (lastSelectedMarker != null) this.applyState(lastSelectedMarker, dvt.TimelineOverview.SELECTED_STATE);
    this.applyState(drawable, dvt.TimelineOverview.ACTIVE_SELECTED_STATE);
  };

  dvt.TimelineOverview.prototype.removeSelectedMarker = function (drawable) {
    if (this._selectedMarkers != null) {
      var index = -1;

      for (var i = 0; i < this._selectedMarkers.length; i++) {
        var marker = this._selectedMarkers[i];

        if (drawable == marker) {
          index = i;
          break;
        }
      }

      if (index != -1) {
        // remove effect from drawable
        this.applyState(drawable, dvt.TimelineOverview.ENABLED_STATE); // fix the array

        this._selectedMarkers.splice(index, 1);
      }
    }
  };

  dvt.TimelineOverview.prototype.removeAllSelectedMarkers = function () {
    if (this._selectedMarkers != null) {
      for (var i = 0; i < this._selectedMarkers.length; i++) {
        var drawable = this._selectedMarkers[i];
        this.applyState(drawable, dvt.TimelineOverview.ENABLED_STATE);
      }

      delete this._selectedMarkers;
      this._selectedMarkers = null;
    }
  };

  dvt.TimelineOverview.prototype.applyState = function (drawable, state) {
    if (!(drawable instanceof dvt.SimpleMarker)) {
      var id = drawable.getId();
      if (id && id.substring(0, 5) == '_drn_') this.applyDurationState(drawable, state);
      return;
    }

    var requiresBorderMarker = false;
    var requiresGlowMarker = false;
    var borderStyle = this.getStyle(state, dvt.TimelineOverview.BORDER_STYLE);

    if (borderStyle == 'solid') {
      requiresBorderMarker = true;
      var borderColor = this.getStyle(state, dvt.TimelineOverview.BORDER_COLOR);
      if (borderColor == null) borderColor = '#000000';
      var glowColor = this.getStyle(state, dvt.TimelineOverview.GLOW_COLOR);
      if (glowColor != null && glowColor != 'none') requiresGlowMarker = true;
    }

    var borderMarker = drawable._borderMarker;
    var glowMarker = drawable._glowMarker; // Remove current border marker if necessary

    if (!requiresBorderMarker && borderMarker != null) {
      this.removeChild(borderMarker);
      drawable._borderMarker = null;

      if (glowMarker != null) {
        this.removeChild(glowMarker);
        drawable._glowMarker = null;
      }
    } else if (!requiresGlowMarker && glowMarker != null) {
      this.removeChild(glowMarker);
      drawable._glowMarker = null;
    }

    var markerType = drawable.getType(); // Create or update border marker

    if (requiresBorderMarker) {
      var borderWidth = parseInt(this.getStyle(state, dvt.TimelineOverview.BORDER_WIDTH), 10);
      var borderOffset = parseInt(this.getStyle(state, dvt.TimelineOverview.BORDER_OFFSET), 10);

      if (borderMarker == null) {
        if (markerType == dvt.SimpleMarker.CIRCLE) {
          var width = (drawable.getDimensions().w + borderOffset * 2) * drawable.getScaleX();
          var height = (drawable.getDimensions().h + borderOffset * 2) * drawable.getScaleY();
          var cx = this.getX(drawable) - borderOffset + width / 2;
          var cy = this.getY(drawable) - borderOffset + height / 2;
        } else {
          if (this.isVertical()) {
            width = (drawable.getDimensions().w + (borderWidth + 1)) * drawable.getScaleX();
            height = (drawable.getDimensions().h + (borderWidth + 1)) * drawable.getScaleY();
            cx = this.getY(drawable) - (borderWidth + 1) / 2 + width / 2;
            cy = this.getX(drawable) - (borderWidth + 1) / 2 + height / 2;
          } else {
            width = (drawable.getDimensions().w + borderOffset * 2) * drawable.getScaleX();
            height = (drawable.getDimensions().h + borderOffset * 2) * drawable.getScaleY();
            cx = this.getX(drawable) - borderOffset + width / 2;
            cy = this.getY(drawable) - borderOffset + height / 2;
          }
        }

        borderMarker = new dvt.SimpleMarker(this.getCtx(), markerType, cx, cy, width, height, null, null, null, drawable.getId() + '_border');
        this.addChildAt(borderMarker, this.getChildIndex(drawable));
        drawable._borderMarker = borderMarker;
        borderMarker.setFill(this._markerBorderFill);
      }

      var stroke = new dvt.Stroke(borderColor, this.getStyle(state, dvt.TimelineOverview.BORDER_OPACITY), borderWidth);
      borderMarker.setStroke(stroke); // Do not antialias marker borders if specified or vertical

      if ((this.isVertical() || markerType == dvt.SimpleMarker.RECTANGLE || markerType == dvt.SimpleMarker.DIAMOND || markerType == dvt.SimpleMarker.TRIANGLE_UP || markerType == dvt.SimpleMarker.TRIANGLE_DOWN || markerType == dvt.SimpleMarker.PLUS) && this._defaultMarkerStyles.pixelHinting != 'false') {
        borderMarker.setPixelHinting(true);
      }

      if (requiresGlowMarker) {
        if (glowMarker == null) {
          var glowOffset = borderOffset - borderWidth;

          if (markerType == dvt.SimpleMarker.CIRCLE) {
            width = (drawable.getDimensions().w + glowOffset * 2) * drawable.getScaleX();
            height = (drawable.getDimensions().h + glowOffset * 2) * drawable.getScaleY();
            cx = this.getX(drawable) - glowOffset + width / 2;
            cy = this.getY(drawable) - glowOffset + height / 2;
          } else {
            if (this.isVertical()) {
              width = (drawable.getDimensions().w + 3) * drawable.getScaleX();
              height = (drawable.getDimensions().h + 3) * drawable.getScaleY();
              cx = this.getY(drawable) + width / 2;
              cy = this.getX(drawable) - 1 + height / 2;
            } else {
              width = (drawable.getDimensions().w + glowOffset * 2) * drawable.getScaleX();
              height = (drawable.getDimensions().h + glowOffset * 2) * drawable.getScaleY();
              cx = this.getX(drawable) - glowOffset + width / 2;
              cy = this.getY(drawable) - glowOffset + height / 2;
            }
          }

          glowMarker = new dvt.SimpleMarker(this.getCtx(), markerType, cx, cy, width, height, null, null, null, drawable.getId() + '_glow');
          this.addChildAt(glowMarker, this.getChildIndex(borderMarker));
          drawable._glowMarker = glowMarker;
          glowMarker.setFill(this._markerBorderFill);
        }

        var glowStroke = new dvt.Stroke(glowColor, this.getStyle(state, dvt.TimelineOverview.GLOW_OPACITY), 4);
        glowMarker.setStroke(glowStroke); // Do not antialias markers if specified or vertical

        if ((this.isVertical() || markerType == dvt.SimpleMarker.RECTANGLE || markerType == dvt.SimpleMarker.DIAMOND || markerType == dvt.SimpleMarker.TRIANGLE_UP || markerType == dvt.SimpleMarker.TRIANGLE_DOWN || markerType == dvt.SimpleMarker.PLUS) && this._defaultMarkerStyles.pixelHinting != 'false') {
          glowMarker.setPixelHinting(true);
        }
      }
    }
  };

  dvt.TimelineOverview.prototype.applyDurationState = function (drawable, state) {
    var borderColor = this.getStyle(state, dvt.TimelineOverview.DURATION_BORDER_COLOR);
    if (borderColor == null) borderColor = '#000000';
    var width = parseInt(this.getStyle(state, dvt.TimelineOverview.DURATION_BORDER_WIDTH), 10);
    drawable.setStroke(new dvt.Stroke(borderColor, 1, width));
  };
  /************************** end marker selection *********************************************/

  /************************** automation ***********************/

  /**
   * @return {DvtTimelineOverviewAutomation} the automation object
   */


  dvt.TimelineOverview.prototype.getAutomation = function () {
    if (!this._Automation) this._Automation = new DvtTimelineOverviewAutomation(this);
    return this._Automation;
  };

  dvt.TimelineOverview.prototype.getMarkers = function () {
    return this._markers;
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


  var DvtTimelineOverviewDefaults = function DvtTimelineOverviewDefaults() {
    this.Init({
      'alta': DvtTimelineOverviewDefaults.VERSION_1
    });
  };

  dvt.Obj.createSubclass(DvtTimelineOverviewDefaults, dvt.BaseComponentDefaults);
  /**
   * Contains overrides for version 1.
   * @const
   */

  DvtTimelineOverviewDefaults.VERSION_1 = {
    'overviewPosition': 'below',
    'style': {
      'borderTopStyle': 'none',
      'currentTimeIndicatorColor': '#c000d1',
      'handleFillColor': '#ffffff',
      'handleTextureColor': '#b3c6db',
      'leftFilterPanelAlpha': 0.7,
      'leftFilterPanelColor': '#ffffff',
      'overviewBackgroundColor': '#e6ecf3',
      'rightFilterPanelAlpha': 0.7,
      'rightFilterPanelColor': '#ffffff',
      'timeAxisBarColor': '#d9dfe3',
      'timeAxisBarAlpha': 0,
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
    },
    '_fc': '#aadd77',
    '_do': 0,
    '_bc': '#648baf',
    '_bof': '0px',
    '_bs': 'solid',
    '_bw': '1px',
    '_dbc': '#648baf',
    '_dbs': 'solid',
    '_dbw': '1px',
    '_hbc': '#85bbe7',
    '_hbs': 'solid',
    '_hbw': '2px',
    '_hbof': '0px',
    '_hgc': '#ebeced',
    '_hgo': 1,
    '_hdbs': 'solid',
    '_hdbc': '#85bbe7',
    '_hdbw': '2px',
    '_sbs': 'solid',
    '_sbc': '#000000',
    '_sbw': '2px',
    '_sbof': '0px',
    '_sbo': 1,
    '_sdbs': 'solid',
    '_sdbc': '#000000',
    '_sdbw': '2px',
    '_asbs': 'solid',
    '_asbc': '#000000',
    '_asbw': '2px',
    '_asbof': '0px',
    '_asbo': 1,
    '_asgc': '#e4f0fa',
    '_asgo': 1,
    '_asdbs': 'solid',
    '_asdbc': '#000000',
    '_asdbw': '2px',
    '_aoc': 'off'
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * TimelineOverview Parser
   * @param {dvt.TimelineOverview} timelineOverview The owning timelineOverview component.
   * @class
   * @constructor
   * @extends {dvt.Obj}
   */

  var DvtTimelineOverviewParser = function DvtTimelineOverviewParser(timelineOverview) {
    this.Init(timelineOverview);
  };

  dvt.Obj.createSubclass(DvtTimelineOverviewParser, dvt.OverviewParser);
  /**
   * @param {dvt.TimelineOverview} timelineOverview
   * @protected
   */

  DvtTimelineOverviewParser.prototype.Init = function (overview) {
    this._view = overview;
  };
  /**
   * Parses the specified options object and returns the root node of the timelineOverview
   * @param {object} options The options object describing the component.
   * @return {object} An object containing the parsed properties
   */


  DvtTimelineOverviewParser.prototype.parse = function (options) {
    var ret = this.ParseRootAttributes(options);
    ret.timeAxisInfo = this._parseTimeAxis(options['axisTicks']);
    ret.markers = this._parseDataNode(options['markers'], ret.defaultMarkerStyles);
    ret.formattedTimeRanges = options['formattedTimeRanges'];
    return ret;
  };
  /**
   * Parses the attributes on the root node.
   * @param {object} options The options defining the root
   * @return {object} An object containing the parsed properties
   * @protected
   */


  DvtTimelineOverviewParser.prototype.ParseRootAttributes = function (options) {
    // The object that will be populated with parsed values and returned
    var ret = DvtTimelineOverviewParser.superclass.ParseRootAttributes.call(this, options);
    ret.currentTime = parseInt(options['ocd']);
    ret.orientation = options['orn'];
    ret.selectionMode = options['selmode'];
    ret.isRtl = options['rtl'].toString();
    ret.seriesIds = options['sid'];
    ret.animationOnClick = options['_aoc'];
    var defaultMarkerStyles = new Object();
    defaultMarkerStyles.shape = DvtTimelineOverviewStyleUtils.getDefaultMarkerShape(options);
    defaultMarkerStyles.scaleX = DvtTimelineOverviewStyleUtils.getDefaultMarkerScaleX(options);
    defaultMarkerStyles.scaleY = DvtTimelineOverviewStyleUtils.getDefaultMarkerScaleY(options);
    defaultMarkerStyles.opacity = DvtTimelineOverviewStyleUtils.getDefaultMarkerOpacity(options);
    defaultMarkerStyles.color = DvtTimelineOverviewStyleUtils.getDefaultMarkerFillColor(options);
    defaultMarkerStyles.pixelHinting = DvtTimelineOverviewStyleUtils.getDefaultMarkerPixelHinting(options);
    ret.defaultMarkerStyles = defaultMarkerStyles;
    ret.labelStyle = options['_ls'];
    return ret;
  };
  /**
   * Recursively parses the data options, creating tree component nodes.
   * @param {object} markers The markers array to parse.
   * @return {DvtBaseTreeNode} The resulting tree component node.
   * @private
   */


  DvtTimelineOverviewParser.prototype._parseDataNode = function (markers, defaultMarkerStyles) {
    if (markers) {
      var treeNodes = new Array();

      for (var i = 0; i < markers.length; i++) {
        // Parse the attributes and create the node
        var props = this.ParseNodeAttributes(markers[i], defaultMarkerStyles);
        var treeNode = new DvtTimelineOverviewNode(this._view, props);
        treeNodes.push(treeNode);
      }

      return treeNodes;
    } else return null;
  };
  /**
   * Parses the attributes on a tree node.
   * @param {object} options The options defining the tree node
   * @return {object} An object containing the parsed properties
   * @protected
   */


  DvtTimelineOverviewParser.prototype.ParseNodeAttributes = function (options, defaultMarkerStyles) {
    // The object that will be populated with parsed values and returned
    var ret = new Object();
    var useSkinningDefaults = options['_sd'] == 'true'; // Parse this node's properties

    ret.id = options['tid'];
    ret.seriesId = options['sid'];
    ret.rowKey = options['rk'];
    ret.time = options['t'];
    ret.endTime = options['et'];
    ret.shape = options['s'];
    if (useSkinningDefaults && ret.shape == null) ret.shape = defaultMarkerStyles.shape;
    ret.desc = options['d'];
    ret.color = options['c'];
    ret.durationFillColor = options['dfc'];
    if (useSkinningDefaults && ret.color == null) ret.color = defaultMarkerStyles.color;
    ret.scaleX = options['sx'];
    if (useSkinningDefaults && ret.scaleX == null) ret.scaleX = defaultMarkerStyles.scaleX;
    ret.scaleY = options['sy'];
    if (useSkinningDefaults && ret.scaleY == null) ret.scaleY = defaultMarkerStyles.scaleY;
    ret.gradient = options['g'];
    ret.opacity = options['o'];
    if (useSkinningDefaults && ret.opacity == null) ret.opacity = defaultMarkerStyles.opacity;
    return ret;
  };

  DvtTimelineOverviewParser.prototype._parseTimeAxis = function (options) {
    if (options) {
      var ret = new Object();
      ret.width = null;
      ret.height = null;
      ret.ticks = options;
      return ret;
    } else return null;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class representing a timelineOverview node.
   * @param {dvt.TimelineOverview} timelineOverview The owning timelineOverview component.
   * @param {object} props The properties for the node.
   * @class
   * @constructor
   */


  var DvtTimelineOverviewNode = function DvtTimelineOverviewNode(overview, props) {
    this.Init(overview, props);
  };

  dvt.Obj.createSubclass(DvtTimelineOverviewNode, dvt.Obj);
  /**
   * @param {dvt.TimelineOverview} overview The dvt.TimelineOverview that owns this node.
   * @param {object} props The properties for the node.
   * @protected
   */

  DvtTimelineOverviewNode.prototype.Init = function (overview, props) {
    this._view = overview;
    this._rowKey = props.rowKey;
    this._id = props.id;
    this._seriesId = props.seriesId;
    this._time = parseInt(props.time);
    this._endTime = props.endTime == null ? null : parseInt(props.endTime);
    this._shape = dvt.SimpleMarker.CIRCLE;
    if (props.shape == 'square') this._shape = dvt.SimpleMarker.RECTANGLE;else if (props.shape == 'plus') this._shape = dvt.SimpleMarker.PLUS;else if (props.shape == 'diamond') this._shape = dvt.SimpleMarker.DIAMOND;else if (props.shape == 'triangleUp') this._shape = dvt.SimpleMarker.TRIANGLE_UP;else if (props.shape == 'triangleDown') this._shape = dvt.SimpleMarker.TRIANGLE_DOWN;
    this._desc = props.desc;
    this._color = props.color;
    this._gradient = props.gradient;
    if (props.opacity != null) this._opacity = parseFloat(props.opacity);
    if (props.scaleX != null) this._scaleX = parseFloat(props.scaleX);
    if (props.scaleY != null) this._scaleY = parseFloat(props.scaleY);
    if (props.durationFillColor != null) this._durationFillColor = props.durationFillColor;
  };

  DvtTimelineOverviewNode.prototype.getId = function () {
    return this._id;
  };

  DvtTimelineOverviewNode.prototype.getSeriesId = function () {
    return this._seriesId;
  };

  DvtTimelineOverviewNode.prototype.getRowKey = function () {
    return this._rowKey;
  };

  DvtTimelineOverviewNode.prototype.getTime = function () {
    return this._time;
  };

  DvtTimelineOverviewNode.prototype.getEndTime = function () {
    return this._endTime;
  };

  DvtTimelineOverviewNode.prototype.getScaleX = function () {
    return this._scaleX;
  };

  DvtTimelineOverviewNode.prototype.getScaleY = function () {
    return this._scaleY;
  };

  DvtTimelineOverviewNode.prototype.getDescription = function () {
    return this._desc;
  };

  DvtTimelineOverviewNode.prototype.getColor = function () {
    return this._color;
  };

  DvtTimelineOverviewNode.prototype.isGradient = function () {
    return this._gradient;
  };

  DvtTimelineOverviewNode.prototype.getShape = function () {
    return this._shape;
  };

  DvtTimelineOverviewNode.prototype.getOpacity = function () {
    return this._opacity;
  };

  DvtTimelineOverviewNode.prototype.getDisplayable = function () {
    return this._displayable;
  };

  DvtTimelineOverviewNode.prototype.setDisplayable = function (displayable) {
    this._displayable = displayable;
  };

  DvtTimelineOverviewNode.prototype.getX = function () {
    return this._x;
  };

  DvtTimelineOverviewNode.prototype.setX = function (x) {
    this._x = x;
  };

  DvtTimelineOverviewNode.prototype.getY = function () {
    return this._y;
  };

  DvtTimelineOverviewNode.prototype.setY = function (y) {
    this._y = y;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Style related utility functions for dvt.TimelineOverview.
   * @class
   */


  var DvtTimelineOverviewStyleUtils = new Object();
  dvt.Obj.createSubclass(DvtTimelineOverviewStyleUtils, dvt.Obj);
  /**
   * Gets the default marker shape.
   * @param {object} options The object containing data and specifications for the component.
   * @return {string} The default marker shape.
   */

  DvtTimelineOverviewStyleUtils.getDefaultMarkerShape = function (options) {
    return options['_ds'];
  };
  /**
   * Gets the default marker scale X value.
   * @param {object} options The object containing data and specifications for the component.
   * @return {number} The default marker scale X value.
   */


  DvtTimelineOverviewStyleUtils.getDefaultMarkerScaleX = function (options) {
    return options['_dsx'];
  };
  /**
   * Gets the default marker scale Y value.
   * @param {object} options The object containing data and specifications for the component.
   * @return {number} The default marker scale Y value.
   */


  DvtTimelineOverviewStyleUtils.getDefaultMarkerScaleY = function (options) {
    return options['_dsy'];
  };
  /**
   * Gets the default marker opacity.
   * @param {object} options The object containing data and specifications for the component.
   * @return {number} The default marker opacity.
   */


  DvtTimelineOverviewStyleUtils.getDefaultMarkerOpacity = function (options) {
    return options['_do'];
  };
  /**
   * Gets the default marker fill color.
   * @param {object} options The object containing data and specifications for the component.
   * @return {string} The default marker fill color.
   */


  DvtTimelineOverviewStyleUtils.getDefaultMarkerFillColor = function (options) {
    return options['_fc'];
  };
  /**
   * Gets the default marker pixel hinting value.
   * @param {object} options The object containing data and specifications for the component.
   * @return {number} The default marker pixel hinting value.
   */


  DvtTimelineOverviewStyleUtils.getDefaultMarkerPixelHinting = function (options) {
    return options['_ph'];
  };
  /**
   * Gets the default marker border styles.
   * @param {object} options The object containing data and specifications for the component.
   * @return {object} The default marker border styles.
   */


  DvtTimelineOverviewStyleUtils.getDefaultMarkerBorderStyles = function (options) {
    var borderStyles = new Object();
    borderStyles['_bs'] = options['_bs'];
    borderStyles['_bc'] = options['_bc'];
    borderStyles['_bw'] = options['_bw'];
    borderStyles['_bof'] = options['_bof'];
    borderStyles['_bo'] = options['_bo'];
    borderStyles['_gc'] = options['_gc'];
    borderStyles['_go'] = options['_go'];
    borderStyles['_dbs'] = options['_dbs'];
    borderStyles['_dbc'] = options['_dbc'];
    borderStyles['_dbw'] = options['_dbw'];
    borderStyles['_hbs'] = options['_hbs'];
    borderStyles['_hbc'] = options['_hbc'];
    borderStyles['_hbw'] = options['_hbw'];
    borderStyles['_hbof'] = options['_hbof'];
    borderStyles['_hbo'] = options['_hbo'];
    borderStyles['_hgc'] = options['_hgc'];
    borderStyles['_hgo'] = options['_hgo'];
    borderStyles['_hdbs'] = options['_hdbs'];
    borderStyles['_hdbc'] = options['_hdbc'];
    borderStyles['_hdbw'] = options['_hdbw'];
    borderStyles['_sbs'] = options['_sbs'];
    borderStyles['_sbc'] = options['_sbc'];
    borderStyles['_sbw'] = options['_sbw'];
    borderStyles['_sbof'] = options['_sbof'];
    borderStyles['_sbo'] = options['_sbo'];
    borderStyles['_sgc'] = options['_sgc'];
    borderStyles['_sgo'] = options['_sgo'];
    borderStyles['_sdbs'] = options['_sdbs'];
    borderStyles['_sdbc'] = options['_sdbc'];
    borderStyles['_sdbw'] = options['_sdbw'];
    borderStyles['_asbs'] = options['_asbs'];
    borderStyles['_asbc'] = options['_asbc'];
    borderStyles['_asbw'] = options['_asbw'];
    borderStyles['_asbof'] = options['_asbof'];
    borderStyles['_asbo'] = options['_asbo'];
    borderStyles['_asgc'] = options['_asgc'];
    borderStyles['_asgo'] = options['_asgo'];
    borderStyles['_asdbs'] = options['_asdbs'];
    borderStyles['_asdbc'] = options['_asdbc'];
    borderStyles['_asdbw'] = options['_asdbw'];
    return borderStyles;
  };
  /**
   * @license
   * Copyright (c) 2012 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /*---------------------------------------------------------------------*/

  /*  DvtTimelineOverviewAutomation                                      */

  /*---------------------------------------------------------------------*/

  /**
    *  Provides automation services for timeline.
    *  @class  DvtTimelineOverviewAutomation
    *  @extends {dvt.Obj}
    *  @param {dvt.TimelineOverview} overview
    *  @constructor
    *
    */


  var DvtTimelineOverviewAutomation = function DvtTimelineOverviewAutomation(overview) {
    this._overview = overview;
  };

  dvt.Obj.createSubclass(DvtTimelineOverviewAutomation, dvt.Automation);
  DvtTimelineOverviewAutomation.NODE_ID_PREFIX = 'marker';
  DvtTimelineOverviewAutomation.WINDOW_ID = 'range_window';
  DvtTimelineOverviewAutomation.START_HANDLE_ID = 'range_start_handle';
  DvtTimelineOverviewAutomation.END_HANDLE_ID = 'range_end_handle';
  DvtTimelineOverviewAutomation.AUTOMATION_NO_EVENT = -1;
  DvtTimelineOverviewAutomation.AUTOMATION_MOUSE_CLICK = 0;
  /**
   * Valid subIds include:
   * <ul>
   * <li>marker[seriesIndex][index]</li>
   * </ul>
   * @override
   */

  DvtTimelineOverviewAutomation.prototype.GetSubIdForDomElement = function (displayable) {
    var id = displayable.getId();

    if (displayable instanceof dvt.SimpleMarker) {
      var arr = id.split(':');
      if (arr.length != 4) return null;

      var seriesIds = this._overview.getSeriesIds();

      if (seriesIds != null) {
        var seriesIndex = seriesIds.indexOf(arr[1]);
        if (seriesIndex > -1) return 'marker[' + seriesIndex + '][' + arr[2] + ']';
      }
    } else if (id == 'window') {
      return DvtTimelineOverviewAutomation.WINDOW_ID;
    } else if (id == 'lh' || id == 'lhb' || id == 'lbgrh') {
      return DvtTimelineOverviewAutomation.START_HANDLE_ID;
    } else if (id == 'rh' || id == 'rhb' || id == 'rbgrh') {
      return DvtTimelineOverviewAutomation.END_HANDLE_ID;
    } else if (id == 'grpy') {
      var prev = displayable.getParent().getChildBefore(displayable);
      return this.GetSubIdForDomElement(prev);
    }

    return null;
  };
  /**
   * Valid subIds include:
   * <ul>
   * <li>marker[seriesIndex][index]</li>
   * </ul>
   * @override
   */


  DvtTimelineOverviewAutomation.prototype.getDomElementForSubId = function (subId) {
    var subIdArray = DvtTimelineOverviewAutomation._convertSubIdToArray(subId);

    if (subIdArray && subIdArray.length == 3 && subIdArray[0] == DvtTimelineOverviewAutomation.NODE_ID_PREFIX) {
      var seriesIds = this._overview.getSeriesIds();

      if (seriesIds != null) {
        var index = parseInt(subIdArray[1], 10);

        if (index > -1 && index < seriesIds.length) {
          var marker = DvtTimelineOverviewAutomation._findMarker(this._overview.getMarkers(), seriesIds[index], subIdArray[2]);

          return marker ? marker.getDisplayable().getElem() : null;
        }
      }
    } else if (subId == DvtTimelineOverviewAutomation.WINDOW_ID) {
      return this._overview.getSlidingWindow().getElem();
    } else if (subId == DvtTimelineOverviewAutomation.START_HANDLE_ID) {
      return this._overview.getLeftHandle().getElem();
    } else if (subId == DvtTimelineOverviewAutomation.END_HANDLE_ID) {
      return this._overview.getRightHandle().getElem();
    }

    return null;
  };

  DvtTimelineOverviewAutomation.prototype.click = function (subId) {
    this.processSubId(subId, DvtTimelineOverviewAutomation.AUTOMATION_MOUSE_CLICK);
  };

  DvtTimelineOverviewAutomation.prototype.processSubId = function (subId, event) {
    if (event === undefined) event = DvtTimelineOverviewAutomation.AUTOMATION_NO_EVENT;
    if (subId == null) return;
    var bIsEvent = event != DvtTimelineOverviewAutomation.AUTOMATION_NO_EVENT;

    if (bIsEvent) {
      if (event == DvtTimelineOverviewAutomation.AUTOMATION_MOUSE_CLICK) {
        var subIdArray = DvtTimelineOverviewAutomation._convertSubIdToArray(subId);

        if (subIdArray && subIdArray.length == 3 && subIdArray[0] == DvtTimelineOverviewAutomation.NODE_ID_PREFIX) {
          var foundMarker = DvtTimelineOverviewAutomation._findMarker(this._overview.getMarkers(), subIdArray[1], subIdArray[2]);

          if (foundMarker) this._overview.HandleMarkerClick(foundMarker.getDisplayable(), false);
        }
      }
    }
  };

  DvtTimelineOverviewAutomation._convertSubIdToArray = function (subId) {
    var array = subId.split('\[');
    var len = array.length;

    for (var i = 1; i < len; i++) {
      var elem = array[i];
      var tempId = elem.substr(0, elem.length - 1); // remove trailing "]"

      var tempIdAsNumber = parseFloat(tempId);
      tempId = isNaN(tempIdAsNumber) ? tempId : tempIdAsNumber;
      array[i] = tempId;
    }

    return array;
  };
  /**
   * Find a marker based on series id and index.
   * @param {Array} markers
   * @param {String} seriesId
   * @param {number} index
   * @return {dvt.SimpleMarker} the marker matching the criteria.
   * @private
   */


  DvtTimelineOverviewAutomation._findMarker = function (markers, seriesId, index) {
    var timelineId = 'tl1';
    var markerId = timelineId + ':' + seriesId + ':' + index + ':';

    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i];
      var id = marker.getId();
      if (id != null && id.indexOf(markerId) == 0) return marker;
    }

    return null;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

})(dvt);

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
(function (dvt) {
  /**
   * @license
   * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */
  var DvtTimeUtils = new Object();

  DvtTimeUtils.supportsTouch = function () {
    return dvt.Agent.isTouchDevice();
  };

  dvt.Obj.createSubclass(DvtTimeUtils, dvt.Obj);
  /**
   * startTime - the start time of timeline in millis
   * endTime - the end of the timeline in millis
   * time - the time in question
   * width - the width of the element
   *
   * @return the position relative to the width of the element
   */

  DvtTimeUtils.getDatePosition = function (startTime, endTime, time, width) {
    var number = (time - startTime) * width;
    var denominator = endTime - startTime;
    if (number == 0 || denominator == 0) return 0;
    return number / denominator;
  };
  /**
   * @return time in millis
   */


  DvtTimeUtils.getPositionDate = function (startTime, endTime, pos, width) {
    var number = pos * (endTime - startTime);
    if (number == 0 || width == 0) return startTime;
    return number / width + startTime;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Timeline keyboard handler.
   * @param {dvt.EventManager} manager The owning dvt.EventManager.
   * @class DvtTimelineKeyboardHandler
   * @extends {dvt.TimeComponentKeyboardHandler}
   * @constructor
   */


  var DvtTimelineKeyboardHandler = function DvtTimelineKeyboardHandler(manager) {
    this.Init(manager);
  };

  dvt.Obj.createSubclass(DvtTimelineKeyboardHandler, dvt.TimeComponentKeyboardHandler);
  /**
   * Finds the next navigable item based on direction.
   * @param {DvtTimelineSeriesNode} currentNavigable The item with current focus.
   * @param {dvt.KeyboardEvent} event The keyboard event.
   * @param {Array} navigableItems An array of items that could receive focus next.
   * @return {DvtTimelineSeriesNode} The next navigable item.
   */

  DvtTimelineKeyboardHandler.getNextNavigable = function (currentNavigable, event, navigableItems) {
    var series = currentNavigable.getSeries();
    var seriesIndex = currentNavigable.getSeriesIndex();
    var isRTL = dvt.Agent.isRightToLeft(series.getCtx());
    var isVertical = series.isVertical();
    var isDualSeries = navigableItems.length > 1;

    if (!isRTL && dvt.KeyboardEvent.RIGHT_ARROW == event.keyCode || isRTL && dvt.KeyboardEvent.LEFT_ARROW == event.keyCode) {
      if (!isVertical) return DvtTimelineKeyboardHandler.getNextItem(currentNavigable, navigableItems[seriesIndex], true);else if (isDualSeries && seriesIndex != 1) return DvtTimelineKeyboardHandler.getClosestItem(currentNavigable, navigableItems[1]);
    } else if (!isRTL && dvt.KeyboardEvent.LEFT_ARROW == event.keyCode || isRTL && dvt.KeyboardEvent.RIGHT_ARROW == event.keyCode) {
      if (!isVertical) return DvtTimelineKeyboardHandler.getNextItem(currentNavigable, navigableItems[seriesIndex], false);else if (isDualSeries && seriesIndex != 0) return DvtTimelineKeyboardHandler.getClosestItem(currentNavigable, navigableItems[0]);
    } else if (dvt.KeyboardEvent.DOWN_ARROW == event.keyCode) {
      if (isVertical) return DvtTimelineKeyboardHandler.getNextItem(currentNavigable, navigableItems[seriesIndex], true);else if (isDualSeries && seriesIndex != 1) return DvtTimelineKeyboardHandler.getClosestItem(currentNavigable, navigableItems[1]);
    } else if (dvt.KeyboardEvent.UP_ARROW == event.keyCode) {
      if (isVertical) return DvtTimelineKeyboardHandler.getNextItem(currentNavigable, navigableItems[seriesIndex], false);else if (isDualSeries && seriesIndex != 0) return DvtTimelineKeyboardHandler.getClosestItem(currentNavigable, navigableItems[0]);
    }

    return null;
  };
  /**
   * Gets the next item in the given direction.
   * @param {DvtTimelineSeriesNode} item The current item.
   * @param {Array} navigableItems An array of items to traverse.
   * @param {Boolean} isNext - True iff going forward in time, false otherwise.
   * @return {DvtTimelineSeriesNode} The next item in the given direction.
   */


  DvtTimelineKeyboardHandler.getNextItem = function (item, navigableItems, isNext) {
    var nextIndex = navigableItems.indexOf(item) + (isNext ? 1 : -1);
    if (nextIndex >= 0 && nextIndex < navigableItems.length) return navigableItems[nextIndex];else return null;
  };
  /**
   * Finds the item with the closest start time to the start time of the given item.
   * @param {DvtTimelineSeriesNode} item The given item.
   * @param {Array} navigableItems An array of items to search through.
   * @return {DvtTimelineSeriesNode} The item with the closest start time.
   */


  DvtTimelineKeyboardHandler.getClosestItem = function (item, navigableItems) {
    if (navigableItems.length > 0) {
      var closest = navigableItems[0];
      var itemLoc = item.getLoc();
      var dist = Math.abs(itemLoc - closest.getLoc());

      for (var i = 1; i < navigableItems.length; i++) {
        var testDist = Math.abs(itemLoc - navigableItems[i].getLoc());

        if (testDist < dist) {
          dist = testDist;
          closest = navigableItems[i];
        }
      }

      return closest;
    }

    return null;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Timeline event manager.
   * @param {dvt.Timeline} timeline The owning dvt.Timeline.
   * @extends {dvt.TimeComponentEventManager}
   * @constructor
   */


  var DvtTimelineEventManager = function DvtTimelineEventManager(timeline) {
    DvtTimelineEventManager.superclass.constructor.call(this, timeline);
  };

  dvt.Obj.createSubclass(DvtTimelineEventManager, dvt.TimeComponentEventManager);
  /**
   * @override
   */

  DvtTimelineEventManager.prototype.addListeners = function (displayable) {
    DvtTimelineEventManager.superclass.addListeners.call(this, displayable);

    if (!dvt.Agent.isTouchDevice()) {
      // IE does not always fire the appropriate mouseover and mouseout events, so use mouseenter instead
      if (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') {
        var stage = this.getCtx().getStage();
        stage.addEvtListener('mouseenter', this.OnMouseEnter, false, this);
        stage.addEvtListener('mouseleave', this.OnMouseLeave, false, this);
      }
    }
  };
  /**
   * @override
   */


  DvtTimelineEventManager.prototype.RemoveListeners = function (displayable) {
    DvtTimelineEventManager.superclass.RemoveListeners.call(this, displayable);

    if (!dvt.Agent.isTouchDevice()) {
      // IE does not always fire the appropriate mouseover and mouseout events, so use mouseenter instead
      if (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') {
        var stage = this.getCtx().getStage();
        stage.removeEvtListener('mouseenter', this.OnMouseEnter, false, this);
        stage.removeEvtListener('mouseleave', this.OnMouseLeave, false, this);
      }
    }
  };
  /**
   * @override
   */


  DvtTimelineEventManager.prototype.PreOnMouseOver = function (event) {
    if (this._mouseOutTimer && this._mouseOutTimer.isRunning()) this._mouseOutTimer.stop();
    DvtTimelineEventManager.superclass.PreOnMouseOver.call(this, event);
    if (dvt.Agent.browser !== 'ie' && dvt.Agent.browser !== 'edge' && !this.isMouseOver) this.isMouseOver = true;
  };
  /**
   * Handler for the mouseenter event.
   * @param {dvt.MouseEvent} event The mouseenter event.
   */


  DvtTimelineEventManager.prototype.OnMouseEnter = function (event) {
    if (this._mouseOutTimer && this._mouseOutTimer.isRunning()) this._mouseOutTimer.stop();
    if (!this.isMouseOver) this.isMouseOver = true;
  };
  /**
   * Handler for the mouseleave event.
   * @param {dvt.MouseEvent} event The mouseleave event.
   */


  DvtTimelineEventManager.prototype.OnMouseLeave = function (event) {
    if (!this._mouseOutTimer) this._mouseOutTimer = new dvt.Timer(this.getCtx(), 10, this._onMouseOutTimerEnd, this, 1);

    this._mouseOutTimer.reset();

    this._mouseOutTimer.start();
  };
  /**
   * @override
   */


  DvtTimelineEventManager.prototype.PreOnMouseOut = function (event) {
    DvtTimelineEventManager.superclass.PreOnMouseOut.call(this, event);

    if (dvt.Agent.browser !== 'ie' && dvt.Agent.browser !== 'edge') {
      if (!this._mouseOutTimer) this._mouseOutTimer = new dvt.Timer(this.getCtx(), 10, this._onMouseOutTimerEnd, this, 1);

      this._mouseOutTimer.reset();

      this._mouseOutTimer.start();
    }
  };
  /**
   * Mouse out timer callback function.
   * @private
   */


  DvtTimelineEventManager.prototype._onMouseOutTimerEnd = function () {
    this.isMouseOver = false;
  };
  /**
   * Pans by the specified amount.
   * @param {number} dx A number from specifying the pan ratio in the x direction, e.g. dx = 0.5 means pan end by 50%..
   * @param {number} dy A number from specifying the pan ratio in the y direction, e.g. dy = 0.5 means pan down by 50%.
   */


  DvtTimelineEventManager.prototype.panBy = function (dx, dy) {
    var focusObj = this.getFocus();
    if (focusObj) this._comp._dragPanSeries = focusObj._series;
    DvtTimelineEventManager.superclass.panBy.call(this, dx, dy);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Timeline component. The component should never be instantiated directly. Use the newInstance function instead.
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @class
   * @constructor
   * @extends {dvt.TimeComponent}
   */


  dvt.Timeline = function (context, callback, callbackObj) {
    this.Init(context, callback, callbackObj);
  };

  dvt.Obj.createSubclass(dvt.Timeline, dvt.TimeComponent);
  dvt.Timeline.ORIENTATION_VERTICAL = 'vertical';
  /**
   * Returns a new instance of dvt.Timeline.
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @return {dvt.Timeline}
   */

  dvt.Timeline.newInstance = function (context, callback, callbackObj) {
    return new dvt.Timeline(context, callback, callbackObj);
  };
  /**
   * Initializes the component.
   * @param {dvt.Context} context The rendering context.
   * @param {string} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @protected
   */


  dvt.Timeline.prototype.Init = function (context, callback, callbackObj) {
    dvt.Timeline.superclass.Init.call(this, context, callback, callbackObj); // Create the defaults object

    this.Defaults = new DvtTimelineDefaults(context); // Create the event handler and add event listeners

    this.EventManager = new DvtTimelineEventManager(this, context, callback, callbackObj);
    this.EventManager.addListeners(this);

    if (!dvt.Agent.isTouchDevice()) {
      this._keyboardHandler = new DvtTimelineKeyboardHandler(this.EventManager);
      this.EventManager.setKeyboardHandler(this._keyboardHandler);
    } else this._keyboardHandler = null;
  };

  dvt.Timeline.prototype.Parse = function (options) {
    this._parser = new DvtTimelineParser();
    return this._parser.parse(options);
  };

  dvt.Timeline.prototype._applyParsedProperties = function (props) {
    var orientation = this.Options['orientation'];
    if (orientation && orientation == dvt.Timeline.ORIENTATION_VERTICAL) this._isVertical = true;else this._isVertical = false;
    this._hasOverview = props.hasOverview;
    this._viewStartTime = props.viewStart;
    this._viewEndTime = props.viewEnd;
    this._selectionMode = props.selectionMode;
    if (this._selectionMode == 'single') this.SelectionHandler = new dvt.SelectionHandler(this.getCtx(), dvt.SelectionHandler.TYPE_SINGLE);else if (this._selectionMode == 'multiple') this.SelectionHandler = new dvt.SelectionHandler(this.getCtx(), dvt.SelectionHandler.TYPE_MULTIPLE);else this.SelectionHandler = null; // Pass to event handler

    this.EventManager.setSelectionHandler(this.SelectionHandler);
    this._shortDesc = props.shortDesc;
    this._referenceObjects = props.referenceObjects;
    this._seriesScale = props.seriesScale;
    this._timeZoneOffsets = props.timeZoneOffsets;

    if (this._seriesScale) {
      this._seriesConverter = props.seriesConverter;
      this._seriesTimeAxis = new dvt.TimeAxis(this.getCtx(), null, null);

      this._seriesTimeAxis.setIsVertical(this._isVertical);

      this._seriesTimeAxis.setScale(this._seriesScale);

      this._seriesTimeAxis.setConverter(this._seriesConverter);

      this._seriesCustomFormatScales = props.seriesCustomFormatScales; // Internationalization strings

      this._dateFormatStrings = this._seriesTimeAxis.getDateFormatStrings();

      if (this._isVertical) {
        this._seriesTimeAxis.setType('short', this._dateFormatStrings);

        this._seriesTimeAxis.setDefaultConverter(this._resources['converterVert']);
      } else {
        this._seriesTimeAxis.setType('long', this._dateFormatStrings);

        this._seriesTimeAxis.setDefaultConverter(this._resources['converter']);
      }

      if (this._timeZoneOffsets) this._seriesTimeAxis.setTimeZoneOffsets(this._timeZoneOffsets);
    } else this._seriesTimeAxis = null;

    this._defaultInversions = [false, true];
    this._itemPosition = props.itemPosition;
    this._customTimeScales = props.customTimeScales;
    this._customFormatScales = props.customFormatScales;
    this._scale = props.scale;

    dvt.Timeline.superclass._applyParsedProperties.call(this, props);
  };
  /**
   * Returns the minor time axis object.
   * @return {dvt.TimeAxis} The time axis object
   */


  dvt.Timeline.prototype.getTimeAxis = function () {
    return this._timeAxis;
  };

  dvt.Timeline.prototype.getTimeAxisSize = function () {
    return this._timeAxis.getSize();
  };

  dvt.Timeline.prototype.getTimeAxisVisibleSize = function (seriesCount) {
    if (!this._hasOverview && seriesCount == 1) return this.getTimeAxisSize() - this._timeAxis.getBorderWidth();else return this.getTimeAxisSize();
  };
  /**
   * @override
   */


  dvt.Timeline.prototype.select = function (selection) {
    // Update the options
    // TODO: update this for stuff...
    this.Options['selection'] = dvt.JsonUtils.clone(selection); // Perform the selection

    if (this.SelectionHandler) this.applyInitialSelections();
  };
  /**
   * Creates TimeAxis compatible options object from component's options object.
   * @param {object} options The object containing specifications and data for this component.
   * @private
   */


  dvt.Timeline.prototype._bundleTimeAxisOptions = function (options) {
    this._timeAxisOptions = {
      'start': options['start'],
      'end': options['end'],
      '_resources': options['_resources'],
      'shortDesc': options['shortDesc'],
      '_tzo': options['_tzo'],
      '_ip': options['_ip'],
      '_cts': this._customTimeScales,
      '_cfs': this._customFormatScales,
      'orientation': options['orientation']
    };
    var _resources = this._timeAxisOptions['_resources'];

    if (_resources) {
      _resources['borderTopVisible'] = true;
      _resources['borderRightVisible'] = true;
      _resources['borderBottomVisible'] = true;
      _resources['borderLeftVisible'] = true;
    }

    if (options['styleDefaults'] && options['styleDefaults']['minorAxis']) {
      var minorAxisStyleDefaults = options['styleDefaults']['minorAxis'];
      this._timeAxisOptions['backgroundColor'] = minorAxisStyleDefaults['backgroundColor'];
      this._timeAxisOptions['borderColor'] = minorAxisStyleDefaults['borderColor'];
      this._timeAxisOptions['separatorColor'] = minorAxisStyleDefaults['separatorColor'];
      this._timeAxisOptions['labelStyle'] = minorAxisStyleDefaults['labelStyle'];
    }

    if (options['minorAxis']) {
      var minorAxisOptions = options['minorAxis'];
      this._timeAxisOptions['scale'] = minorAxisOptions['scale'];
      this._timeAxisOptions['converter'] = minorAxisOptions['converter'];
      this._timeAxisOptions['zoomOrder'] = minorAxisOptions['zoomOrder'];
      this._timeAxisOptions['style'] = minorAxisOptions['style'];
      if (minorAxisOptions['svgStyle']) this._timeAxisOptions['style'] = minorAxisOptions['svgStyle'];
    }
  };
  /**
   * Renders the component with the specified data.  If no data is supplied to a component
   * that has already been rendered, the component will be rerendered to the specified size.
   * @param {object} options The object containing specifications and data for this component.
   * @param {number} width The width of the component.
   * @param {number} height The height of the component.
   */


  dvt.Timeline.prototype.render = function (options, width, height) {
    // ensure options is updated
    if (options) this.SetOptions(options);else {
      this._handleResize(width, height);

      return;
    } // Animation Support
    // Stop any animation in progress

    this.StopAnimation();

    if (this.Options) {
      this._resources = this.Options['_resources'];
      if (this._resources == null) this._resources = [];
    } // The overall size of this component


    this.Width = width;
    this.Height = height;
    var props = this.Parse(this.Options);

    this._applyParsedProperties(props);

    this._fetchStartPos = 0;
    if (this._isVertical) this._fetchEndPos = height;else this._fetchEndPos = width;

    if (this.Options['styleDefaults']) {
      this._majorAxisStyleDefaults = this.Options['styleDefaults']['majorAxis'];
      this._seriesStyleDefaults = this.Options['styleDefaults']['series'];
    }

    if (this._scale) {
      this._bundleTimeAxisOptions(this.Options);

      this.applyAxisStyleValues();
      if (!this._timeAxis) this._timeAxis = new dvt.TimeAxis(this.getCtx(), null, null); // Axis border visibility needs to be reset in case of orientation changes.

      if (this._isVertical) this._timeAxis.setBorderVisibility(false, true, false, true);else this._timeAxis.setBorderVisibility(true, false, true, false); // TimeComponent's TimeAxis._canvasSize should always be null on initial render,

      this._timeAxis.setCanvasSize(null);

      var preferredLength = this._timeAxis.getPreferredLength(this._timeAxisOptions, this._canvasLength);

      if (preferredLength) this.setContentLength(preferredLength);
      if (this._timeAxis.hasValidOptions()) this.prepareViewportLength();
    }

    this._populateSeries();

    DvtTimelineRenderer.renderTimeline(this);
    this.UpdateAriaAttributes(); // Set the timeline as the only keyboard listener
    // Prevents overview from receiving keyboard events

    if (!dvt.TimeAxis.supportsTouch()) this.getCtx().setKeyboardFocusArray([this]);
    if (!this.Animation) // If not animating, that means we're done rendering, so fire the ready event.
      this.RenderComplete();
  };
  /**
   * Helper method to decide whether or not the series.items options are valid.
   * @return {boolean} Whether the series.items options are valid.
   */


  dvt.Timeline.prototype.hasValidSeriesItems = function () {
    for (var i = 0; i < this._seriesOptions.length; i++) {
      var seriesOptions = this._seriesOptions[i];

      if (seriesOptions.items) {
        for (var j = 0; j < seriesOptions.items.length; j++) {
          var item = seriesOptions.items[j];
          var start = new Date(item.start).getTime();
          if (!start) return false;

          if (item.hasOwnProperty('end')) {
            var end = new Date(item.end).getTime();
            if (!isNaN(end) && end < start) return false;
          }
        }
      }
    }

    return true;
  };
  /**
   * Helper method to decide whether or not the options are valid.
   * @return {boolean} Whether this timeline has valid options.
   */


  dvt.Timeline.prototype.hasValidOptions = function () {
    // TODO: warn user why certain options are invalid
    var hasValidScale = this._scale && dvt.TimeAxis._VALID_SCALES.indexOf(this._scale) != -1;
    var hasValidCustomScale = this._scale && this._customTimeScales && this._customTimeScales[this._scale];
    var hasValidStartAndEnd = this._start && this._end && this._end > this._start;
    var hasValidSeries = this._series && this._series.length > 0;
    var hasValidSeriesItems = hasValidSeries ? this.hasValidSeriesItems() : false;
    var hasValidSeriesScale = this._seriesScale ? dvt.TimeAxis._VALID_SCALES.indexOf(this._seriesScale) != -1 : true;
    var hasValidCustomSeriesScale = this._seriesScale ? this._customTimeScales && this._customTimeScales[this._seriesScale] : true;
    var hasValidViewport = this._viewStartTime && this._viewEndTime ? this._viewEndTime > this._viewStartTime : true;
    var hasValidViewStart = this._viewStartTime ? this._viewStartTime >= this._start && this._viewStartTime < this._end : true;
    var hasValidViewEnd = this._viewEndTime ? this._viewEndTime > this._start && this._viewEndTime <= this._end : true;
    return (hasValidScale || hasValidCustomScale) && (hasValidSeriesScale || hasValidCustomSeriesScale) && hasValidStartAndEnd && hasValidSeries && hasValidSeriesItems && hasValidViewport && hasValidViewStart && hasValidViewEnd;
  };
  /**
   * @override
   */


  dvt.Timeline.prototype.GetComponentDescription = function () {
    if (this._shortDesc) return this._shortDesc;else return this.Options.translations.componentName;
  };
  /**
   * Combines style defaults with the styles provided
   *
   */


  dvt.Timeline.prototype.applyStyleValues = function () {
    this._style = new dvt.CSSStyle(DvtTimelineStyleUtils.getTimelineStyle());

    if (this.Options['styleDefaults']) {
      var style = this.Options['styleDefaults']['borderColor'];
      if (style) this._style.parseInlineStyle('border-color:' + style + ';');
    }

    if (this._hasOverview) {
      this._overviewSize = this._isVertical ? DvtTimelineStyleUtils.getOverviewWidth() : DvtTimelineStyleUtils.getOverviewHeight();
      var overviewOptions = this.Options['overview'];
      var overviewStyle = overviewOptions['svgStyle'] ? overviewOptions['svgStyle'] : overviewOptions['style'];

      if (overviewStyle) {
        var overviewCSSStyle = new dvt.CSSStyle(overviewStyle);
        var overviewSize = this._isVertical ? overviewCSSStyle.getWidth() : overviewCSSStyle.getHeight();
        if (overviewSize != null) this._overviewSize = dvt.CSSStyle.toNumber(overviewSize);
      }
    }

    dvt.Timeline.superclass.applyStyleValues.call(this); // double border width to account for stroke width rendering

    var borderWidth = this._style.getBorderWidth();

    var doubleBorderWidth = borderWidth * 2;
    var borderStyle = 'border:' + doubleBorderWidth + 'px;';

    this._style.parseInlineStyle(borderStyle);

    this.setStartXOffset(borderWidth);
    this.setStartYOffset(borderWidth);
    this.setBackgroundXOffset(0);
    var scrollbarPadding = 3 * this.getScrollbarPadding(); // we are going to hide the scrollbar

    this.timeDirScrollbarStyles = this.getTimeDirScrollbarStyle();
    this.contentDirScrollbarStyles = this.getContentDirScrollbarStyle();
    this._backgroundWidth = this.Width;
    this._backgroundHeight = this.Height;

    if (this._isVertical) {
      // The size of the canvas viewport
      if (this.isContentDirScrollbarOn()) this._backgroundHeight = this._backgroundHeight - dvt.CSSStyle.toNumber(this.contentDirScrollbarStyles.getHeight()) - scrollbarPadding;
      this._canvasLength = this._backgroundHeight - doubleBorderWidth;

      if (this._hasOverview) {
        this._canvasSize = this._backgroundWidth - this._overviewSize - doubleBorderWidth;
        if (this.isRTL()) this.setStartXOffset(borderWidth + this._overviewSize);
      } else {
        if (this.isTimeDirScrollbarOn()) this._backgroundWidth = this._backgroundWidth - dvt.CSSStyle.toNumber(this.timeDirScrollbarStyles.getWidth()) - scrollbarPadding;
        this._canvasSize = this._backgroundWidth - doubleBorderWidth;

        if (this.isRTL()) {
          this.setBackgroundXOffset(this.Width - this._backgroundWidth);
          this.setStartXOffset(this.getStartXOffset() + this.getBackgroundXOffset());
        }
      }
    } else {
      // The size of the canvas viewport
      if (this.isContentDirScrollbarOn()) this._backgroundWidth = this._backgroundWidth - dvt.CSSStyle.toNumber(this.contentDirScrollbarStyles.getWidth()) - scrollbarPadding;
      this._canvasLength = this._backgroundWidth - doubleBorderWidth;

      if (this.isRTL()) {
        this.setBackgroundXOffset(this.Width - this._backgroundWidth);
        this.setStartXOffset(this.getStartXOffset() + this.getBackgroundXOffset());
      }

      if (this._hasOverview) this._canvasSize = this._backgroundHeight - this._overviewSize - doubleBorderWidth;else {
        if (this.isTimeDirScrollbarOn()) this._backgroundHeight = this._backgroundHeight - dvt.CSSStyle.toNumber(this.timeDirScrollbarStyles.getHeight()) - scrollbarPadding;
        this._canvasSize = this._backgroundHeight - doubleBorderWidth;
      }
    }
  };
  /**
   * Combines style defaults with the styles provided
   *
   */


  dvt.Timeline.prototype.applyAxisStyleValues = function () {
    if (this._seriesStyleDefaults && this._seriesStyleDefaults['backgroundColor']) {
      var bgColor = this._seriesStyleDefaults['backgroundColor'];
      var r = dvt.ColorUtils.getRed(bgColor);
      var g = dvt.ColorUtils.getGreen(bgColor);
      var b = dvt.ColorUtils.getBlue(bgColor);
      this._seriesBackgroundOverlayStyle = 'background-color:rgba(' + r + ',' + g + ',' + b + ',0.8);';
    }
  };

  dvt.Timeline.prototype._populateSeries = function () {
    var series = this.Options['series'];

    if (series) {
      var seriesCount = Math.min(series.length, 2);
      this._seriesOptions = [];

      if (this._series) {
        if (seriesCount != this._series.length) {
          for (var i = 0; i < this._series.length; i++) {
            this._timeZoomCanvas.removeChild(this._series[i]);
          }

          this._series = [];
        }
      } else this._series = [];

      for (var i = 0; i < seriesCount; i++) {
        var seriesOptions = series[i];
        seriesOptions['start'] = this._start;
        seriesOptions['end'] = this._end;
        seriesOptions['inverted'] = this._defaultInversions[i];
        seriesOptions['orientation'] = this.Options['orientation'];
        seriesOptions['referenceObjects'] = this._referenceObjects;
        seriesOptions['timeline'] = this;
        seriesOptions['index'] = i;
        seriesOptions['animationOnDisplay'] = this.Options['animationOnDisplay'];
        seriesOptions['animationOnDataChange'] = this.Options['animationOnDataChange'];

        if (this.Options['majorAxis']) {
          seriesOptions['scale'] = this.Options['majorAxis']['scale'];
          seriesOptions['timeAxis'] = this._seriesTimeAxis;
          seriesOptions['_cfs'] = this._seriesCustomFormatScales;
        }

        seriesOptions['styleDefaults'] = this.Options['styleDefaults'];

        if (this.Options['styleDefaults']) {
          seriesOptions['seriesStyleDefaults'] = this._seriesStyleDefaults;
          seriesOptions['axisStyleDefaults'] = this._majorAxisStyleDefaults;
        }

        seriesOptions['_isRandomItemLayout'] = this._itemPosition == 'random';
        seriesOptions['_cts'] = this.Options['_cts'];
        seriesOptions['_data'] = series[i];
        seriesOptions.translations = this.Options.translations;

        this._seriesOptions.push(seriesOptions);

        if (this._series[i] == null) {
          var s = new DvtTimelineSeries(this.getCtx(), this.HandleEvent, this);

          this._series.push(s);
        }
      }
    } else this._series = [];
  };
  /**
   * Handler for initial animation ending.
   */


  dvt.Timeline.prototype.onAnimationEnd = function () {
    // Fire ready event saying animation is finished.
    if (!this.AnimationStopped) this.RenderComplete(); // Restore event listeners

    this.EventManager.addListeners(this); // Reset animation flags

    this.Animation = null;
    this.AnimationStopped = false;
  };

  dvt.Timeline.prototype._getOverviewObject = function () {
    var overviewOptions = new Object();
    overviewOptions['width'] = this._contentLength;
    overviewOptions['selmode'] = this._selectionMode;
    overviewOptions['rtl'] = this.isRTL();
    overviewOptions['sid'] = 'ts1';
    var windowBackgroundColor = DvtTimelineStyleUtils.getOverviewWindowBackgroundColor(this.Options);
    overviewOptions['_wbc'] = windowBackgroundColor;
    overviewOptions['_hfc'] = windowBackgroundColor;
    var windowBorderColor = DvtTimelineStyleUtils.getOverviewWindowBorderColor(this.Options);
    overviewOptions['_wbtc'] = windowBorderColor;
    overviewOptions['_wbrc'] = windowBorderColor;
    overviewOptions['_wbbc'] = windowBorderColor;
    overviewOptions['_wblc'] = windowBorderColor;
    overviewOptions['_ls'] = DvtTimelineStyleUtils.getOverviewLabelStyle(this.Options).toString();
    overviewOptions['_obc'] = DvtTimelineStyleUtils.getOverviewBackgroundColor(this.Options);
    overviewOptions['_ctic'] = DvtTimelineStyleUtils.getReferenceObjectColor(this.Options);
    if (this._referenceObjects && this._referenceObjects.length > 0 && this._referenceObjects[0]) overviewOptions['ocd'] = this._referenceObjects[0].getTime();

    if (this._isVertical) {
      overviewOptions['orn'] = 'vertical';
      overviewOptions['yMin'] = this._start;
      overviewOptions['yMax'] = this._end;
      overviewOptions['y1'] = this._viewStartTime;
      overviewOptions['y2'] = this._viewEndTime;
    } else {
      overviewOptions['orn'] = 'horizontal';
      overviewOptions['xMin'] = this._start;
      overviewOptions['xMax'] = this._end;
      overviewOptions['x1'] = this._viewStartTime;
      overviewOptions['x2'] = this._viewEndTime;
      overviewOptions['_ds'] = 'square';
      overviewOptions['_dsx'] = '1.3d';
      overviewOptions['_dsy'] = '0.9d';
    }

    if (this._resources['overviewHandleVert']) {
      overviewOptions['_vhbi'] = this._resources['overviewHandleVert'];
      overviewOptions['_vhw'] = 15;
      overviewOptions['_vhh'] = 3;
    }

    if (this._resources['overviewHandleHor']) {
      overviewOptions['_hbi'] = this._resources['overviewHandleHor'];
      overviewOptions['_hw'] = 3;
      overviewOptions['_hh'] = 15;
    }

    overviewOptions['axisTicks'] = this._getOverviewAxisOptions();
    overviewOptions['markers'] = this._getOverviewMarkerOptions();
    return overviewOptions;
  };

  dvt.Timeline.prototype._getOverviewAxisOptions = function () {
    var axisTicks = [];

    if (this._seriesTimeAxis) {
      var dates;
      var labels;

      if (this._customTimeScales && this._customTimeScales[this._seriesScale]) {
        var customScale = this._customTimeScales[this._seriesScale];
        dates = customScale['times'];
        labels = customScale['labels'];
      } else if (this._seriesCustomFormatScales && this._seriesCustomFormatScales[this._seriesScale]) {
        var customFormatScale = this._seriesCustomFormatScales[this._seriesScale];
        dates = customFormatScale['times'];
        labels = customFormatScale['labels'];
      } else {
        dates = [];
        labels = [];
        var start = this._start;
        var end = this._end;
        var length = this._isVertical ? this.Height : this.Width;
        var startDate = dvt.TimeAxis.getPositionDate(start, end, this._fetchStartPos, length);

        var currentDate = this._seriesTimeAxis.adjustDate(startDate);

        var currentPos = dvt.TimeAxis.getDatePosition(start, end, currentDate, length);

        while (currentPos < this._fetchEndPos) {
          labels.push(this._seriesTimeAxis.formatDate(currentDate));
          dates.push(currentDate.getTime());
          currentDate = this._seriesTimeAxis.getNextDate(currentDate.getTime());
          currentPos = dvt.TimeAxis.getDatePosition(start, end, currentDate, length);
        }
      }

      for (var i = 0; i < labels.length; i++) {
        var tickOption = new Object();
        tickOption['time'] = dates[i];
        tickOption['label'] = labels[i];
        axisTicks.push(tickOption);
      }
    }

    return axisTicks;
  };

  dvt.Timeline.prototype._getOverviewMarkerOptions = function () {
    if (this._series) {
      var overviewMarkers = [];
      var seriesCount = this._series.length;

      for (var i = 0; i < seriesCount; i++) {
        var items = this._series[i]._items;

        for (var j = 0; j < items.length; j++) {
          var item = items[j];
          var itemOption = new Object();
          itemOption['rk'] = j;
          itemOption['sid'] = i;
          itemOption['tid'] = item.getId();
          itemOption['t'] = item.getStartTime();
          itemOption['_sd'] = item.getMarkerSD(); //begin custom marker handling (for ADF)

          if (!this._isVertical) {
            if (item.getMarkerShape()) itemOption['s'] = item.getMarkerShape();
            if (item.getMarkerScaleX()) itemOption['sx'] = item.getMarkerScaleX();
            if (item.getMarkerScaleY()) itemOption['sy'] = item.getMarkerScaleY();
          }

          if (item.getMarkerShortDesc()) itemOption['d'] = item.getMarkerShortDesc();
          if (item.getMarkerFillColor()) itemOption['c'] = item.getMarkerFillColor();
          if (item.getMarkerGradientFill()) itemOption['g'] = item.getMarkerGradientFill();
          if (item.getMarkerOpacity()) itemOption['o'] = item.getMarkerOpacity(); // end custom marker handling (for ADF)

          var endTime = item.getEndTime();

          if (endTime) {
            itemOption['et'] = endTime;
            var durationFillColor = item.getDurationFillColor();
            if (durationFillColor) itemOption['dfc'] = durationFillColor;
          }

          overviewMarkers.push(itemOption);
        }
      }

      return overviewMarkers;
    }
  };
  /**
   * Creates a viewportChange event object
   * @return {object} the viewportChange event object
   */


  dvt.Timeline.prototype.createViewportChangeEvent = function () {
    return dvt.EventFactory.newTimelineViewportChangeEvent(this._viewStartTime, this._viewEndTime, this._timeAxis.getScale());
  };

  dvt.Timeline.prototype.HandleTouchStart = function (event) {
    var touches = event.touches;
    if (touches.length == 1) this._dragPanSeries = this._findSeries(event.target);
  };
  /**
   * Handles mouse wheel event.
   * @param {event} event The mouse wheel event
   * @protected
   * @override
   */


  dvt.Timeline.prototype.HandleMouseWheel = function (event) {
    dvt.Timeline.superclass.HandleMouseWheel.call(this, event);

    if (this.hasValidOptions()) {
      if (event.zoomWheelDelta) {
        // only zoom if mouse inside chart/graphical area
        var relPos = this.getCtx().pageToStageCoords(event.pageX, event.pageY);

        if (this.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y)) {
          var newLength = this.getContentLength() * event.zoomWheelDelta;
          var time = event.zoomTime;
          var compLoc = event.zoomCompLoc;
          this.handleZoomWheel(newLength, time, compLoc, true);
        }
      }
    }
  };

  dvt.Timeline.prototype.handleZoomWheel = function (newLength, time, compLoc, triggerViewportChangeEvent) {
    if (newLength > this._timeAxis.getMaxContentLength()) {
      newLength = this._timeAxis.getMaxContentLength();
      this.disableZoomButton(true);
    } else this.enableZoomButton(true);

    if (this._canvasLength > newLength) {
      newLength = this._canvasLength;
      this.disableZoomButton(false);
    } else this.enableZoomButton(false);

    var zoomIn = this.getContentLength() <= newLength;
    dvt.Timeline.superclass.handleZoomWheel.call(this, newLength, time, compLoc, triggerViewportChangeEvent);

    var zoomLevelLengths = this._timeAxis.getZoomLevelLengths();

    if (zoomIn) {
      while (this._timeAxis.getZoomLevelOrder() > 0) {
        var minLength = zoomLevelLengths[this._timeAxis.getZoomLevelOrder() - 1];

        if (this.getContentLength() >= minLength) {
          this._timeAxis.setZoomLevelOrder(this._timeAxis.getZoomLevelOrder() - 1);

          this._timeAxis.decreaseScale();
        } else break;
      }
    } else {
      while (this._timeAxis.getZoomLevelOrder() < zoomLevelLengths.length - 1) {
        var minLength = zoomLevelLengths[this._timeAxis.getZoomLevelOrder()];

        if (this.getContentLength() < minLength) {
          this._timeAxis.setZoomLevelOrder(this._timeAxis.getZoomLevelOrder() + 1);

          this._timeAxis.increaseScale();
        } else break;
      }
    }

    if (this._hasOverview) {
      if (this._isVertical) this._overview.setViewportRange(null, null, this._viewStartTime, this._viewEndTime);else this._overview.setViewportRange(this._viewStartTime, this._viewEndTime, null, null);
    }

    if (this.isTimeDirScrollbarOn()) this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);
    this.applyAxisStyleValues();

    DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas);

    this.updateSeries();

    if (this.isContentDirScrollbarOn()) {
      for (var i = 0; i < this._series.length; i++) {
        this.contentDirScrollbar[i].setViewportRange(0, this._seriesSize, 0, Math.max(this._series[i]._maxOverflowValue, this._seriesSize));
      }
    }

    if (triggerViewportChangeEvent) this.dispatchEvent(this.createViewportChangeEvent());
  };

  dvt.Timeline.prototype.updateSeries = function () {
    if (this._series) {
      var seriesCount = this._series.length;
      var axisSize = this.getTimeAxisVisibleSize(seriesCount);
      this._seriesSize = (this._canvasSize - axisSize) / seriesCount;

      for (var i = 0; i < seriesCount; i++) {
        var series = this._series[i]; // setup overflow controls

        series.setClipPath(null);
        var cp = new dvt.ClipPath();

        if (this._isVertical) {
          if (this.isRTL()) var key = Math.abs(i - 1);else key = i;

          if (this.isRTL() && this._series.length == 1) {
            cp.addRect(axisSize, 0, this._seriesSize, this.getContentLength());
            var posMatrix = new dvt.Matrix(1, 0, 0, 1, axisSize, 0);
          } else {
            cp.addRect(key * (this._seriesSize + axisSize), 0, this._seriesSize, this.getContentLength());
            posMatrix = new dvt.Matrix(1, 0, 0, 1, key * (this._seriesSize + axisSize), 0);
          }

          var width = this._seriesSize;
          var height = this.getContentLength();
        } else {
          cp.addRect(0, i * (this._seriesSize + axisSize), this.getContentLength(), this._seriesSize);
          posMatrix = new dvt.Matrix(1, 0, 0, 1, 0, i * (this._seriesSize + axisSize));
          width = this.getContentLength();
          height = this._seriesSize;
        }

        series.setClipPath(cp);
        series.setMatrix(posMatrix);
        series.render(null, width, height);
      }
    }
  };

  dvt.Timeline.prototype._handleResize = function (width, height) {
    this.Width = width;
    this.Height = height;
    this.applyStyleValues();
    this._fetchStartPos = 0;
    if (this._isVertical) this._fetchEndPos = height;else this._fetchEndPos = width;
    this.prepareViewportLength();

    DvtTimelineRenderer._renderBackground(this);

    if (this.hasValidOptions()) {
      this.renderTimeZoomCanvas(this._canvas);
      this.applyAxisStyleValues();
      this.updateSeries();

      DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas);

      DvtTimelineRenderer._renderSeriesLabels(this);

      DvtTimelineRenderer._renderZoomControls(this);

      if (this._hasOverview) {
        DvtTimelineRenderer._renderOverview(this); // Reapply selections to overview region


        if (this.SelectionHandler) {
          var selection = this.SelectionHandler.getSelectedIds();

          if (selection && selection.length != 0) {
            for (var i = 0; i < selection.length; i++) {
              this._overview.selSelectItem(selection[i]);
            }
          }
        }
      }

      if (this.isTimeDirScrollbarOn() || this.isContentDirScrollbarOn()) DvtTimelineRenderer._renderScrollbars(this);
    } else DvtTimelineRenderer._renderEmptyText(this); // if not animating, we are done rendering


    if (!this.Animation) this.RenderComplete();
  };

  dvt.Timeline.prototype.HandleKeyDown = function (event) {
    if (dvt.KeyboardEvent.RIGHT_ARROW == event.keyCode || dvt.KeyboardEvent.LEFT_ARROW == event.keyCode || dvt.KeyboardEvent.DOWN_ARROW == event.keyCode || dvt.KeyboardEvent.UP_ARROW == event.keyCode) this.updateScrollForItemNavigation(this.EventManager.getFocus());
  };

  dvt.Timeline.prototype.HandleMouseDown = function (event) {
    this._dragPanSeries = this._findSeries(event.target);
  };

  dvt.Timeline.prototype.endDragPan = function () {
    this._dragPanSeries = null;
    this.endPan();
  };
  /**
   * Ends panning.
   */


  dvt.Timeline.prototype.endPan = function () {
    if (this._triggerViewportChange) {
      this._triggerViewportChange = false;
      this.dispatchEvent(this.createViewportChangeEvent());
    }
  };
  /**
   * Pans the Timeline by the specified amount.
   * @param {number} deltaX The number of pixels to pan in the x direction.
   * @param {number} deltaY The number of pixels to pan in the y direction.
   */


  dvt.Timeline.prototype.panBy = function (deltaX, deltaY) {
    var seriesCount = this._series.length;
    var axisSize = this.getTimeAxisVisibleSize(seriesCount);

    if (this._isVertical) {
      if (this._dragPanSeries) {
        var newTranslateX = this._dragPanSeries.getTranslateX() - deltaX;

        if (this._series.length > 1 && (!this.isRTL() && this._dragPanSeries._isInverted || this.isRTL() && !this._dragPanSeries._isInverted)) {
          var minTranslateX = axisSize + 2 * this._dragPanSeries.Width - this._dragPanSeries._maxOverflowValue;
          var maxTranslateX = this._dragPanSeries.Width + axisSize;
        } else if (this.isRTL() && !this._dragPanSeries._isInverted) {
          minTranslateX = this._dragPanSeries.Width - this._dragPanSeries._maxOverflowValue + axisSize;
          maxTranslateX = axisSize;
        } else {
          minTranslateX = 0;
          maxTranslateX = this._dragPanSeries._maxOverflowValue - this._dragPanSeries.Width;
        }

        if (newTranslateX < minTranslateX) newTranslateX = minTranslateX;else if (newTranslateX > maxTranslateX) newTranslateX = maxTranslateX;

        this._dragPanSeries.setTranslateX(newTranslateX);

        if (this.isContentDirScrollbarOn()) {
          if (this._series[0] == this._dragPanSeries) {
            if (this.isRTL()) {
              if (seriesCount == 2) var newMin = this.getTimeAxisVisibleSize() + this._seriesSize - newTranslateX;else newMin = this.getTimeAxisVisibleSize() - newTranslateX;
              this.contentDirScrollbar[0].setViewportRange(newMin, newMin + this._seriesSize);
            } else this.contentDirScrollbar[0].setViewportRange(newTranslateX, newTranslateX + this._seriesSize);
          } else {
            if (this.isRTL()) this.contentDirScrollbar[1].setViewportRange(newTranslateX, newTranslateX + this._seriesSize);else {
              newMin = this.getTimeAxisVisibleSize() + this._seriesSize - newTranslateX;
              this.contentDirScrollbar[1].setViewportRange(newMin, newMin + this._seriesSize);
            }
          }
        }
      }

      this.panZoomCanvasBy(deltaY);
      if (this._hasOverview) this._overview.setViewportRange(null, null, this._viewStartTime, this._viewEndTime);
      if (this.isTimeDirScrollbarOn()) this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);
    } else {
      this.panZoomCanvasBy(deltaX);
      if (this._hasOverview) this._overview.setViewportRange(this._viewStartTime, this._viewEndTime, null, null);
      if (this.isTimeDirScrollbarOn()) this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);

      if (this._dragPanSeries) {
        var newTranslateY = this._dragPanSeries.getTranslateY() - deltaY;

        if (this._dragPanSeries._isInverted) {
          var minTranslateY = axisSize + 2 * this._dragPanSeries.Height - this._dragPanSeries._maxOverflowValue;
          var maxTranslateY = this._dragPanSeries.Height + axisSize;
        } else {
          minTranslateY = 0;
          maxTranslateY = this._dragPanSeries._maxOverflowValue - this._dragPanSeries.Height;
        }

        if (newTranslateY < minTranslateY) newTranslateY = minTranslateY;else if (newTranslateY > maxTranslateY) newTranslateY = maxTranslateY;

        this._dragPanSeries.setTranslateY(newTranslateY);

        if (this.isContentDirScrollbarOn()) {
          if (this._series[0] == this._dragPanSeries) this.contentDirScrollbar[0].setViewportRange(newTranslateY, newTranslateY + this._seriesSize);else {
            var newMin = this.getTimeAxisVisibleSize() + this._seriesSize - newTranslateY;
            this.contentDirScrollbar[1].setViewportRange(newMin, newMin + this._seriesSize);
          }
        }
      }
    } //this.dispatchEvent(dvt.EventFactory.newTimelineViewportChangeEvent(this._viewStartTime, this._viewEndTime, this._timeAxis.getScale()));

  }; // event callback method


  dvt.Timeline.prototype.HandleEvent = function (event, component) {
    var type = event['type'];
    var type = event['type'];

    if (type == 'dvtSimpleScrollbar') {
      event = this.processScrollbarEvent(event, component);
    } else if (type == 'selection') {
      // check for selection event, and handle accordingly
      this.dispatchEvent(event);
    } else if (type == 'overview') {
      var subtype = event.subtype;

      if (subtype == 'rangeChanging' || subtype == 'rangeChange') {
        var oldViewTime = this._viewEndTime - this._viewStartTime;

        if (this._isVertical) {
          this._viewStartTime = event.newY1;
          this._viewEndTime = event.newY2;
        } else {
          this._viewStartTime = event.newX1;
          this._viewEndTime = event.newX2;
        }

        var viewTime = this._viewEndTime - this._viewStartTime;

        if (viewTime > 0) {
          var widthFactor = this._canvasLength / viewTime;
          this.setContentLength(widthFactor * (this._end - this._start));
          this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));

          var zoomLevelLengths = this._timeAxis.getZoomLevelLengths();

          if (oldViewTime > viewTime) {
            var zoomLevelOrder = zoomLevelLengths.length;
            var minLength = zoomLevelLengths[zoomLevelOrder - 1];

            while (this.getContentLength() >= minLength && zoomLevelOrder > 0) {
              zoomLevelOrder--;
              minLength = zoomLevelLengths[zoomLevelOrder - 1];
            }

            if (zoomLevelOrder == zoomLevelLengths.length) zoomLevelOrder--;

            this._timeAxis.setZoomLevelOrder(zoomLevelOrder);

            this._timeAxis.setScale(this._timeAxis.getZoomOrder()[zoomLevelOrder]);
          } else {
            var zoomLevelOrder = 0;
            var minLength = zoomLevelLengths[zoomLevelOrder];

            while (this.getContentLength() < minLength && zoomLevelOrder < zoomLevelLengths.length - 1) {
              zoomLevelOrder++;
              minLength = zoomLevelLengths[zoomLevelOrder];
            }

            this._timeAxis.setZoomLevelOrder(zoomLevelOrder);

            this._timeAxis.setScale(this._timeAxis.getZoomOrder()[zoomLevelOrder]);
          }

          this.applyAxisStyleValues();

          DvtTimelineRenderer._renderAxis(this, this._timeZoomCanvas);

          this.updateSeries();
          this.applyTimeZoomCanvasPosition();
        }

        if (subtype == 'rangeChange') this.dispatchEvent(this.createViewportChangeEvent());
      }

      if (subtype == 'scrollPos' || subtype == 'scrollTime') {
        if (this._isVertical) {
          this._viewStartTime = event.newY1;
          this._viewEndTime = event.newY2;
        } else {
          this._viewStartTime = event.newX1;
          this._viewEndTime = event.newX2;
        }

        var widthFactor = this.getContentLength() / (this._end - this._start);

        this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
        this.applyTimeZoomCanvasPosition();
        this.dispatchEvent(this.createViewportChangeEvent());
      }
    } else if (type = 'timeline') {
      var subtype = event.subtype;

      if (subtype == 'selection') {
        var selectedItemId = event.itemId;
        var isMultiSelect = event.isMultiSelect && this._selectionMode == 'multiple';

        for (var i = 0; i < this._series.length; i++) {
          var s = this._series[i];

          for (var j = 0; j < s._items.length; j++) {
            var item = s._items[j];

            if (dvt.Obj.compareValues(this.getCtx(), item.getId(), selectedItemId)) {
              this.EventManager.setFocusObj(item);
              this.updateScrollForItemSelection(item); // fire selection event if selection changed

              if (this.SelectionHandler._addToSelection(item, isMultiSelect)) this.EventManager.fireSelectionEvent(item);
              break;
            }
          }
        }
      } else if (subtype == 'highlight') {
        var itemId = event.itemId;

        for (var i = 0; i < this._series.length; i++) {
          var s = this._series[i];

          for (var j = 0; j < s._items.length; j++) {
            var item = s._items[j];

            if (dvt.Obj.compareValues(this.getCtx(), item.getId(), itemId)) {
              item.showHoverEffect(true);
              break;
            }
          }
        }
      } else if (subtype == 'unhighlight') {
        var itemId = event.itemId;

        for (var i = 0; i < this._series.length; i++) {
          var s = this._series[i];

          for (var j = 0; j < s._items.length; j++) {
            var item = s._items[j];

            if (dvt.Obj.compareValues(this.getCtx(), item.getId(), itemId)) {
              item.hideHoverEffect(true);
              break;
            }
          }
        }
      }
    }
  };
  /**
   * Adjusts viewport based on scrollbar event.
   * @param {object} event
   * @param {object} component The component that is the source of the event, if available.
   */


  dvt.Timeline.prototype.processScrollbarEvent = function (event, component) {
    dvt.Timeline.superclass.processScrollbarEvent.call(this, event, component);
    var newMin = event.newMin;

    if (component == this.contentDirScrollbar[0]) {
      if (this.isVertical()) {
        if (this._series.length == 2) this._series[0].setTranslateX(this.isRTL() ? this.getTimeAxisVisibleSize() + this._seriesSize - newMin : newMin);else this._series[0].setTranslateX(this.isRTL() ? this.getTimeAxisVisibleSize() - newMin : newMin);
      } else this._series[0].setTranslateY(newMin);
    } else if (component == this.contentDirScrollbar[1]) {
      if (this.isVertical()) this._series[1].setTranslateX(this.isRTL() ? newMin : this.getTimeAxisVisibleSize() + this._seriesSize - newMin);else this._series[1].setTranslateY(this.getTimeAxisVisibleSize() + this._seriesSize - newMin);
    }
  };

  dvt.Timeline.prototype.updateScrollForItemSelection = function (item) {
    var viewSize = this._viewEndTime - this._viewStartTime;
    this._viewStartTime = item.getStartTime() - viewSize / 2;
    if (this._viewStartTime < this._start) this._viewStartTime = this._start;else if (this._viewStartTime + viewSize > this._end) this._viewStartTime = this._end - viewSize;
    this._viewEndTime = this._viewStartTime + viewSize;

    var widthFactor = this.getContentLength() / (this._end - this._start);

    this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
    this.applyTimeZoomCanvasPosition();
    this.dispatchEvent(this.createViewportChangeEvent());
  };

  dvt.Timeline.prototype.updateScrollForItemNavigation = function (item) {
    var itemSize = this._isVertical ? item.getHeight() : item.getWidth();
    var itemHoverStrokeWidth = DvtTimelineStyleUtils.getItemHoverStrokeWidth();
    var itemStart = item.getLoc() - (this._isVertical ? itemSize / 2 + itemHoverStrokeWidth : DvtTimelineStyleUtils.getBubbleOffset() + itemHoverStrokeWidth);
    var startPos = this.getRelativeStartPos();

    if (this.isRTL() && !this._isVertical) {
      itemStart = itemStart - itemHoverStrokeWidth;
    }

    var itemEnd = itemStart + itemSize + 2 * itemHoverStrokeWidth;
    var endPos = startPos - this._canvasLength;
    if (-itemStart > startPos) startPos = -itemStart;else if (-itemEnd < endPos) startPos = -itemEnd + this._canvasLength;

    var widthFactor = this.getContentLength() / (this._end - this._start);

    var viewTime = this._viewEndTime - this._viewStartTime;
    this._viewStartTime = this._start - startPos / widthFactor;

    if (this._viewStartTime < this._start) {
      this._viewStartTime = this._start;
      startPos = (this._start - this._viewStartTime) * widthFactor;
    }

    this._viewEndTime = this._viewStartTime + viewTime;

    if (this._viewEndTime > this._end) {
      this._viewEndTime = this._end;
      this._viewStartTime = this._viewEndTime - viewTime;
      startPos = (this._start - this._viewStartTime) * widthFactor;
    }

    this.setRelativeStartPos(startPos);
    this.applyTimeZoomCanvasPosition();

    if (this._hasOverview) {
      if (this._isVertical) this._overview.setViewportRange(null, null, this._viewStartTime, this._viewEndTime);else this._overview.setViewportRange(this._viewStartTime, this._viewEndTime, null, null);
    }

    if (this.isTimeDirScrollbarOn()) this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);
    this.dispatchEvent(this.createViewportChangeEvent());
  };

  dvt.Timeline.prototype.applyInitialSelections = function () {
    if (this.Options['selection']) {
      var items = [];

      for (var i = 0; i < this._series.length; i++) {
        var s = this._series[i];

        for (var j = 0; j < s._items.length; j++) {
          items.push(s._items[j]);
        }
      }
    }

    this.SelectionHandler.processInitialSelections(this.Options['selection'], items);
  };

  dvt.Timeline.prototype._findSeries = function (target) {
    if (this.hasValidOptions() && target && target != this) {
      var id = target.getId();
      if (target == this._series[0] || this._series.length > 1 && target == this._series[1]) return target;
      if (id && id.substring(id.length - 3, id.length) == '_s0') return this._series[0];else if (id && id.substring(id.length - 3, id.length) == '_s1') return this._series[1];else return this._findSeries(target.getParent());
    }

    return null;
  };

  dvt.Timeline.prototype._findDrawable = function (target) {
    if (target) {
      var id = target.getId();
      if (id && id.substring(0, 10) == '_duration_' && target._node) return target;
      var parent = target.getParent();

      if (parent) {
        if (id && id.substring(0, 4) == 'zoom') return target;
        if (id && id.substring(0, 8) == '_bubble_' && parent._node) return parent;
        var grandParent = parent.getParent();

        if (grandParent) {
          if (id && id.substring(0, 8) == '_bubble_' && grandParent._node) return grandParent;
          id = grandParent.getId();
          if (id && id.substring(0, 8) == '_bubble_' && grandParent.getParent()) return grandParent.getParent();
        }
      }
    }

    return null;
  };
  /**
   * Returns the automation object for this timeline
   * @return {dvt.Automation} The automation object
   */


  dvt.Timeline.prototype.getAutomation = function () {
    if (!this.Automation) this.Automation = new DvtTimelineAutomation(this);
    return this.Automation;
  };
  /**
   * @override
   */


  dvt.Timeline.prototype.clearComponent = function () {
    dvt.Timeline.superclass.clearComponent.call(this);
    this.clearOverview();
  };
  /**
   * Removes the overview canvas from the timeline.
   */


  dvt.Timeline.prototype.clearOverview = function () {
    if (this._overviewCanvas) {
      this.removeChild(this._overviewCanvas);
      this._overviewCanvas = null;
    }
  };
  /**
   * @override
   */


  dvt.Timeline.prototype.isTimeDirScrollbarOn = function () {
    return !this._hasOverview;
  };
  /**
   * @override
   */


  dvt.Timeline.prototype.isContentDirScrollbarOn = function () {
    return true;
  };
  /**
   * Returns the background offset value of this component in the x direction.
   * @return {number} The background offset value of this component in the x direction.
   */


  dvt.Timeline.prototype.getBackgroundXOffset = function () {
    return this._backgroundX;
  };
  /**
   * Sets the background offset value of this component in the x direction.
   * @param {number} backgroundX The background offset value of this component in the x direction.
   */


  dvt.Timeline.prototype.setBackgroundXOffset = function (backgroundX) {
    this._backgroundX = backgroundX;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Timeline automation service.
   * @param {dvt.Timeline} timeline The owning dvt.Timeline.
   * @class  DvtTimelineAutomation
   * @implements {dvt.Automation}
   * @constructor
   */


  var DvtTimelineAutomation = function DvtTimelineAutomation(timeline) {
    this._timeline = timeline;
  };

  dvt.Obj.createSubclass(DvtTimelineAutomation, dvt.Automation);
  DvtTimelineAutomation.TIMELINE_ITEM_STRING = 'timelineItem';
  /**
   * Valid subIds inlcude:
   * <ul>
   * <li>timelineItem[seriesIndex][itemIndex]</li>
   * </ul>
   * @override
   */

  DvtTimelineAutomation.prototype.GetSubIdForDomElement = function (displayable) {
    var logicalObj = this._timeline.EventManager.GetLogicalObject(displayable);

    if (logicalObj && logicalObj instanceof DvtTimelineSeriesNode) {
      for (var i = 0; i < this._timeline._series.length; i++) {
        var series = this._timeline._series[i];

        var itemIndex = series._items.indexOf(logicalObj);

        if (itemIndex != -1) return DvtTimelineAutomation.TIMELINE_ITEM_STRING + '[' + i + '][' + itemIndex + ']';
      }
    }

    return null;
  };
  /**
   * Valid subIds inlcude:
   * <ul>
   * <li>timelineItem[seriesIndex][itemIndex]</li>
   * </ul>
   * @override
   */


  DvtTimelineAutomation.prototype.getDomElementForSubId = function (subId) {
    // TOOLTIP
    if (subId == dvt.Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._timeline);

    if (subId && this._timeline.hasValidOptions()) {
      var parenIndex = subId.indexOf('[');

      if (parenIndex > 0 && subId.substring(0, parenIndex) === DvtTimelineAutomation.TIMELINE_ITEM_STRING) {
        var endParenIndex = subId.indexOf(']');

        if (endParenIndex > 0) {
          var seriesIndex = parseInt(subId.substring(parenIndex + 1, endParenIndex));
          var itemIndex = parseInt(subId.substring(endParenIndex + 2, subId.length - 1));
          var series = this._timeline._series[seriesIndex];

          if (series) {
            var node = series._items[itemIndex];
            if (node) return node.getDisplayables()[0].getElem();
          }
        }
      }
    }

    return null;
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
   * @param {dvt.Context} context The rendering context.
   * @extends {dvt.BaseComponentDefaults}
   */


  var DvtTimelineDefaults = function DvtTimelineDefaults(context) {
    this.Init({
      'alta': DvtTimelineDefaults.VERSION_1
    }, context);
  };

  dvt.Obj.createSubclass(DvtTimelineDefaults, dvt.BaseComponentDefaults);
  /**
   * Contains overrides for version 1.
   * @const
   */

  DvtTimelineDefaults.VERSION_1 = {
    'animationOnDataChange': 'none',
    'animationOnDisplay': 'none',
    'orientation': 'horizontal',
    'overview': {
      'rendered': 'off'
    },
    'selectionMode': 'none',
    'styleDefaults': {
      'animationDuration': 500,
      'borderColor': '#d9dfe3',
      'item': {
        'backgroundColor': '#ffffff',
        'borderColor': '#648baf',
        'descriptionStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color: #084B8A; white-space: nowrap;'),
        'hoverBorderColor': '#85bbe7',
        'selectedBorderColor': '#000000',
        'titleStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'font-weight: bold; color: #000000; white-space: nowrap;')
      },
      'majorAxis': {
        'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_14 + 'font-weight: bold; color: #4f4f4f; white-space: nowrap;'),
        'separatorColor': '#bcc7d2'
      },
      'minorAxis': {
        'backgroundColor': '#f9f9f9',
        'borderColor': '#d9dfe3',
        'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color: #333333;'),
        'separatorColor': '#bcc7d2'
      },
      'overview': {
        'backgroundColor': '#e6ecf3',
        'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'font-weight: bold; color: #4f4f4f;'),
        'window': {
          'backgroundColor': '#ffffff',
          'borderColor': '#4f4f4f'
        }
      },
      'referenceObject': {
        'color': '#ff591f'
      },
      'series': {
        'backgroundColor': '#f9f9f9',
        'colors': dvt.CSSStyle.COLORS_ALTA,
        'emptyTextStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'font-weight: normal; color: #333333; white-space: nowrap;'),
        'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_13 + 'font-weight: bold; color: #252525; white-space: nowrap;')
      },
      '_tooltipStyle': new dvt.CSSStyle('border-collapse: separate; border-spacing: 2px; overflow: hidden; display: block;'),
      'tooltipLabelStyle': new dvt.CSSStyle('color: #666666; padding: 0px 2px; white-space: nowrap;'),
      'tooltipValueStyle': new dvt.CSSStyle('color: #333333; padding: 0px 2px;')
    }
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Timeline JSON Parser
   * @class
   * @constructor
   * @extends {dvt.Obj}
   */

  var DvtTimelineParser = function DvtTimelineParser() {};

  dvt.Obj.createSubclass(DvtTimelineParser, dvt.Obj);
  /**
   * Parses the specified data options and returns the root node of the timeline
   * @param {object} options The data options describing the component.
   * @return {object} An object containing the parsed properties
   */

  DvtTimelineParser.prototype.parse = function (options) {
    var ret = new Object();
    ret.start = new Date(options['start']).getTime();
    ret.end = new Date(options['end']).getTime();
    if (options['viewportStart']) ret.viewStart = new Date(options['viewportStart']).getTime();
    if (options['viewportEnd']) ret.viewEnd = new Date(options['viewportEnd']).getTime();
    if (options['selectionMode']) ret.selectionMode = options['selectionMode'];else ret.selectionMode = 'none';
    ret.inlineStyle = options['style'];
    if (options['svgStyle']) ret.inlineStyle = options['svgStyle'];
    var minorAxis = options['minorAxis'];

    if (minorAxis) {
      var scale = minorAxis['scale'];
      ret.scale = scale;
      ret.customFormatScales = minorAxis['_cfs'];
    }

    var majorAxis = options['majorAxis'];

    if (majorAxis) {
      ret.seriesScale = majorAxis['scale'];
      ret.seriesConverter = majorAxis['converter'];
      ret.seriesCustomFormatScales = majorAxis['_cfs'];
    }

    ret.shortDesc = options['shortDesc'];
    ret.orientation = options['orientation'];
    var referenceObjects = options['referenceObjects'];

    if (referenceObjects && referenceObjects.length > 0) {
      var referenceObjectsValueArray = [];

      for (var i = 0; i < referenceObjects.length; i++) {
        referenceObjectsValueArray.push(new Date(referenceObjects[i]['value']));
      }

      ret.referenceObjects = referenceObjectsValueArray;
    }

    var overview = options['overview'];
    if (overview != null && overview['rendered'] == 'on') ret.hasOverview = true;else ret.hasOverview = false;
    ret.timeZoneOffsets = options['_tzo'];
    ret.itemPosition = options['_ip'];
    ret.customTimeScales = options['_cts'];
    return ret;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Renderer for dvt.Timeline.
   * @class
   */


  var DvtTimelineRenderer = new Object();
  dvt.Obj.createSubclass(DvtTimelineRenderer, dvt.Obj);
  /**
   * Renders a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   */

  DvtTimelineRenderer.renderTimeline = function (timeline) {
    DvtTimelineRenderer._renderBackground(timeline);

    DvtTimelineRenderer._renderScrollableCanvas(timeline);

    if (timeline.hasValidOptions()) {
      timeline.renderTimeZoomCanvas(timeline._canvas);
      var timeZoomCanvas = timeline.getTimeZoomCanvas();

      DvtTimelineRenderer._renderSeries(timeline, timeZoomCanvas);

      DvtTimelineRenderer._renderSeriesLabels(timeline);

      DvtTimelineRenderer._renderAxis(timeline, timeZoomCanvas);

      if (timeline._hasOverview) DvtTimelineRenderer._renderOverview(timeline);else timeline.clearOverview(); // just use the first object as the focus

      if (timeline._keyboardHandler) {
        for (var i = 0; i < timeline._series.length; i++) {
          var series = timeline._series[i];

          if (series._items && series._items.length > 0) {
            timeline.EventManager.setFocusObj(series._items[0]);
            break;
          }
        }
      }

      if (timeline.isTimeDirScrollbarOn() || timeline.isContentDirScrollbarOn()) DvtTimelineRenderer._renderScrollbars(timeline);

      DvtTimelineRenderer._renderZoomControls(timeline); // Initial Selection


      if (timeline.SelectionHandler) timeline.applyInitialSelections();
      if (dvt.TimeAxis.supportsTouch()) timeline._setAriaProperty('flowto', timeline._series[0].getId());

      for (var i = 0; i < timeline._series.length; i++) {
        var series = timeline._series[i];
        series.triggerAnimations();
      }
    } else DvtTimelineRenderer._renderEmptyText(timeline);
  };
  /**
   * Renders the background of a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @private
   */


  DvtTimelineRenderer._renderBackground = function (timeline) {
    if (timeline._background) {
      timeline._background.setClipPath(null);

      timeline._background.setWidth(timeline._backgroundWidth);

      timeline._background.setHeight(timeline._backgroundHeight);
    } else timeline._background = new dvt.Rect(timeline.getCtx(), 0, 0, timeline._backgroundWidth, timeline._backgroundHeight, 'bg');

    var transX = timeline.getBackgroundXOffset();

    timeline._background.setTranslateX(transX);

    timeline._background.setCSSStyle(timeline._style);

    timeline._background.setPixelHinting(true);

    var cp = new dvt.ClipPath();
    cp.addRect(transX, 0, timeline._backgroundWidth, timeline._backgroundHeight);

    timeline._background.setClipPath(cp);

    if (timeline._background.getParent() != timeline) timeline.addChild(timeline._background);
  };
  /**
   * Renders the scrollable canvas of a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @private
   */


  DvtTimelineRenderer._renderScrollableCanvas = function (timeline) {
    if (timeline._canvas) return;
    timeline._canvas = new dvt.Container(timeline.getCtx(), 'canvas');
    timeline.addChild(timeline._canvas);
  };
  /**
   * Renders the series of a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @param {dvt.Container} container The container to render into.
   * @private
   */


  DvtTimelineRenderer._renderSeries = function (timeline, container) {
    var timeAxis = timeline.getTimeAxis();

    if (timeline._series) {
      var context = timeline.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);
      var seriesCount = timeline._series.length;
      var axisSize = timeline.getTimeAxisVisibleSize(seriesCount);

      if (!timeline.isVertical()) {
        if (seriesCount > 1 && timeline._canvasSize % 2 != axisSize % 2) {
          timeAxis.setContentSize(timeAxis.getContentSize() + 1);
          axisSize = timeline.getTimeAxisVisibleSize(seriesCount);
        }
      }

      timeline._seriesSize = (timeline._canvasSize - axisSize) / seriesCount;

      for (var i = 0; i < seriesCount; i++) {
        var series = timeline._series[i]; // setup overflow controls

        series.setClipPath(null);
        var cp = new dvt.ClipPath();

        if (timeline.isVertical()) {
          if (isRTL) var key = Math.abs(i - 1);else key = i;

          if (isRTL && timeline._series.length == 1) {
            cp.addRect(axisSize, 0, timeline._seriesSize, timeline.getContentLength());
            var posMatrix = new dvt.Matrix(1, 0, 0, 1, axisSize, 0);
          } else {
            cp.addRect(key * (timeline._seriesSize + axisSize), 0, timeline._seriesSize, timeline.getContentLength());
            posMatrix = new dvt.Matrix(1, 0, 0, 1, key * (timeline._seriesSize + axisSize), 0);
          }

          var width = timeline._seriesSize;
          var height = timeline.getContentLength();
        } else {
          cp.addRect(0, i * (timeline._seriesSize + axisSize), timeline.getContentLength(), timeline._seriesSize);
          posMatrix = new dvt.Matrix(1, 0, 0, 1, 0, i * (timeline._seriesSize + axisSize));
          width = timeline.getContentLength();
          height = timeline._seriesSize;
        }

        series.setClipPath(cp);
        series.setMatrix(posMatrix);
        if (series.getParent() != container) container.addChild(series);
        series.render(timeline._seriesOptions[i], width, height);
      }
    }
  };
  /**
   * Renders the series labels of a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @private
   */


  DvtTimelineRenderer._renderSeriesLabels = function (timeline) {
    if (timeline._series) {
      var context = timeline.getCtx();
      var isRTL = dvt.Agent.isRightToLeft(context);

      if (timeline._seriesLabels) {
        for (var i = 0; i < timeline._seriesLabels.length; i++) {
          timeline.removeChild(timeline._seriesLabels[i]);
        }
      }

      timeline._seriesLabels = [];
      var seriesCount = timeline._series.length;
      var labelSpacing = DvtTimelineStyleUtils.getSeriesLabelSpacing(); //TODO: Update to use zoom control spacing constant rather than '6'

      var zoomControlSpacing = dvt.TransientButton._DEFAULT_RADIUS * 2 + 6;
      var doubleLabelSpacing = labelSpacing * 2;

      for (var i = 0; i < seriesCount; i++) {
        var series = timeline._series[i];
        var seriesLabel = series.getLabel();

        if (seriesLabel != null) {
          var seriesLabelStyle = DvtTimelineStyleUtils.getSeriesLabelStyle(timeline.Options);
          var seriesLabelBackgroundStyle = new dvt.CSSStyle(DvtTimelineStyleUtils.getSeriesLabelBackgroundStyle());

          if (series._style) {
            var backgroundColor = series._style.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);

            if (backgroundColor) seriesLabelBackgroundStyle.setStyle(dvt.CSSStyle.BACKGROUND_COLOR, backgroundColor);
          }

          var seriesLabelElem = new dvt.OutputText(context, seriesLabel, 0, 0, 'sl_s' + i);
          seriesLabelElem.setCSSStyle(seriesLabelStyle);
          var dim = seriesLabelElem.getDimensions();
          if (timeline.isVertical()) var totalSpace = timeline._seriesSize;else totalSpace = timeline._canvasLength;
          var width = Math.min(dim.w, totalSpace - (i - 1) * -zoomControlSpacing - doubleLabelSpacing);
          var seriesLabelPadding = DvtTimelineStyleUtils.getSeriesLabelPadding();
          var backgroundRect = new dvt.Rect(context, 0, 0, width + seriesLabelPadding * 2, dim.h + seriesLabelPadding * 2, 'slb_s' + i);
          backgroundRect.setCSSStyle(seriesLabelBackgroundStyle);
          backgroundRect.setAlpha(DvtTimelineStyleUtils.getSeriesLabelBackgroundOpacity());
          backgroundRect.setCornerRadius(3);

          if (!timeline.isVertical()) {
            if (isRTL) var posX = timeline._canvasLength - width - labelSpacing - (i - 1) * -zoomControlSpacing;else posX = timeline._startX + labelSpacing + (i - 1) * -zoomControlSpacing;
            var posY = i * (timeline._canvasSize - dim.h - doubleLabelSpacing) + labelSpacing + timeline._startY;
          } else {
            if (isRTL) posX = Math.abs(i - 1) * (timeline._canvasSize - width - doubleLabelSpacing) + labelSpacing + timeline._startX + (i - 1) * zoomControlSpacing;else posX = i * (timeline._canvasSize - width - doubleLabelSpacing) + labelSpacing + timeline._startX + (i - 1) * -zoomControlSpacing;
            posY = timeline._startY + labelSpacing;
          }

          var posMatrix = new dvt.Matrix(1, 0, 0, 1, posX, posY);
          seriesLabelElem.setMatrix(posMatrix);
          posMatrix = new dvt.Matrix(1, 0, 0, 1, posX - seriesLabelPadding, posY - seriesLabelPadding);
          backgroundRect.setMatrix(posMatrix);
          timeline.addChild(backgroundRect);
          dvt.TextUtils.fitText(seriesLabelElem, width, Infinity, timeline);

          timeline._seriesLabels.push(backgroundRect);

          timeline._seriesLabels.push(seriesLabelElem);
        }

        if (series._isEmpty) {
          var seriesEmptyText = series.getEmptyText();

          if (seriesEmptyText != null) {
            var seriesEmptyTextElem = new dvt.OutputText(context, seriesEmptyText, 0, 0, 'et_s' + i);
            seriesEmptyTextElem.setCSSStyle(DvtTimelineStyleUtils.getEmptyTextStyle(timeline.Options));
            var dim = seriesEmptyTextElem.getDimensions();

            if (!timeline.isVertical()) {
              var matPosX = (timeline._canvasLength - dim.w) / 2 + timeline._startX;

              var matPosY = i * (timeline._seriesSize + timeline.getTimeAxisVisibleSize(seriesCount)) + (timeline._seriesSize - dim.h) / 2 + timeline._startY;
            } else {
              matPosY = (timeline._canvasLength - dim.h) / 2 + timeline._startY;
              if (isRTL) matPosX = Math.abs(i - 1) * ((seriesCount - 1) * timeline._seriesSize + timeline.getTimeAxisVisibleSize(seriesCount)) + (timeline._seriesSize - dim.w) / 2 + timeline._startX;else matPosX = i * (timeline._seriesSize + timeline.getTimeAxisVisibleSize(seriesCount)) + (timeline._seriesSize - dim.w) / 2 + timeline._startX;
            }

            var posMatrix = new dvt.Matrix(1, 0, 0, 1, matPosX, matPosY);
            seriesEmptyTextElem.setMatrix(posMatrix);
            timeline.addChild(seriesEmptyTextElem);

            timeline._seriesLabels.push(seriesEmptyTextElem);
          }
        }
      }
    }
  };
  /**
   * Renders the minor time axis of a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @param {dvt.Container} container The container to render into.
   * @private
   */


  DvtTimelineRenderer._renderAxis = function (timeline, container) {
    var context = timeline.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var timeAxis = timeline.getTimeAxis();
    var seriesCount = timeline._series.length;
    var axisSize = timeline.getTimeAxisSize();
    var axisVisibleSize = timeline.getTimeAxisVisibleSize(seriesCount);
    var axisStart = seriesCount == 1 ? timeline._canvasSize - axisVisibleSize : timeline._canvasSize / seriesCount - axisVisibleSize / 2;
    if (isRTL && timeline.isVertical() && timeline._series.length == 1) axisStart = 0; // timeAxis.renderTimeAxis(container, axisStart, axisVisibleSize);

    if (timeAxis.getParent() !== container) container.addChild(timeAxis);

    if (timeline.isVertical()) {
      var posMatrix = new dvt.Matrix(1, 0, 0, 1, axisStart, 0);
      timeAxis.render(null, axisSize, timeline.getContentLength());
    } else {
      posMatrix = new dvt.Matrix(1, 0, 0, 1, 0, axisStart);
      timeAxis.render(null, timeline.getContentLength(), axisSize);
    }

    timeAxis.setMatrix(posMatrix);

    DvtTimelineRenderer._renderSeriesTimeAxis(timeline, timeline._fetchStartPos, timeline._fetchEndPos, timeline.getTimeZoomCanvas(), timeline.getContentLength());
  };
  /**
   * Renders the major time axis labels of a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @param {number} startPos The start position of the rendering.
   * @param {number} endPos The end position of the rendering.
   * @param {dvt.Container} container The container to render into.
   * @param {number} length The length of the axis.
   * @private
   */


  DvtTimelineRenderer._renderSeriesTimeAxis = function (timeline, startPos, endPos, container, length) {
    var context = timeline.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);

    if (timeline._majorAxisLabels) {
      for (var i = 0; i < timeline._majorAxisLabels.length; i++) {
        container.removeChild(timeline._majorAxisLabels[i]);
      }
    }

    timeline._majorAxisLabels = [];

    if (timeline._seriesScale) {
      var dates;
      var labels;
      var start = timeline._start;
      var end = timeline._end;

      if (timeline._customTimeScales && timeline._customTimeScales[timeline._seriesScale]) {
        var customScale = timeline._customTimeScales[timeline._seriesScale];
        dates = customScale['times'];
        labels = customScale['labels'];
      } else if (timeline._seriesCustomFormatScales && timeline._seriesCustomFormatScales[timeline._seriesScale]) {
        var customFormatScale = timeline._seriesCustomFormatScales[timeline._seriesScale];
        dates = customFormatScale['times'];
        labels = customFormatScale['labels'];
      } else {
        dates = [];
        labels = [];
        var startDate = dvt.TimeAxis.getPositionDate(start, end, startPos, length);

        var currentDate = timeline._seriesTimeAxis.adjustDate(startDate);

        var currentPos = dvt.TimeAxis.getDatePosition(start, end, currentDate, length);
        dates.push(currentDate.getTime());

        while (currentPos < endPos) {
          labels.push(timeline._seriesTimeAxis.formatDate(currentDate));
          currentDate = timeline._seriesTimeAxis.getNextDate(currentDate.getTime());
          currentPos = dvt.TimeAxis.getDatePosition(start, end, currentDate, length); // the last currentTime added in this loop is outside of the time range, but is needed
          // for the last 'next' date when actually creating the time axis in renderTimeAxis

          dates.push(currentDate.getTime());
        }
      }

      var seriesAxisLabelStyle = DvtTimelineStyleUtils.getSeriesAxisLabelStyle(timeline.Options);
      var seriesAxisLabelPadding = DvtTimelineStyleUtils.getSeriesAxisLabelPadding();
      var seriesAxisLabelBackgroundStyle = new dvt.CSSStyle(DvtTimelineStyleUtils.getSeriesAxisLabelBackgroundStyle());

      if (timeline._series[0] && timeline._series[0]._style) {
        var backgroundColor = timeline._series[0]._style.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);

        if (backgroundColor) seriesAxisLabelBackgroundStyle.setStyle(dvt.CSSStyle.BACKGROUND_COLOR, backgroundColor);
      }

      var seriesAxisLabelBackgroundOpacity = DvtTimelineStyleUtils.getSeriesAxisLabelBackgroundOpacity();

      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        var currentTime = dates[i];
        currentPos = dvt.TimeAxis.getDatePosition(start, end, currentTime, length);
        var next_time_pos = dvt.TimeAxis.getDatePosition(start, end, dates[i + 1], length);
        var maxLength = next_time_pos - currentPos;

        if (!isRTL) {
          if (timeline.isVertical()) var labelElem = DvtTimelineRenderer._addLabel(context, container, 5, label, maxLength, currentPos + 18, seriesAxisLabelStyle, 'o_label' + currentPos + '_s0', true, seriesAxisLabelBackgroundStyle, seriesAxisLabelBackgroundOpacity, seriesAxisLabelPadding, timeline._majorAxisLabels, isRTL);else labelElem = DvtTimelineRenderer._addLabel(context, container, currentPos + 5, label, maxLength, timeline._seriesSize - 2, seriesAxisLabelStyle, 'o_label' + currentPos + '_s0', true, seriesAxisLabelBackgroundStyle, seriesAxisLabelBackgroundOpacity, seriesAxisLabelPadding, timeline._majorAxisLabels, isRTL);
        } else {
          if (timeline.isVertical()) labelElem = DvtTimelineRenderer._addLabel(context, container, timeline._canvasSize - 5, label, maxLength, currentPos + 18, seriesAxisLabelStyle, 'o_label' + currentPos + '_s0', true, seriesAxisLabelBackgroundStyle, seriesAxisLabelBackgroundOpacity, seriesAxisLabelPadding, timeline._majorAxisLabels, isRTL);else labelElem = DvtTimelineRenderer._addLabel(context, container, length - (currentPos + 5), label, maxLength, timeline._seriesSize - 2, seriesAxisLabelStyle, 'o_label' + currentPos + '_s0', true, seriesAxisLabelBackgroundStyle, seriesAxisLabelBackgroundOpacity, seriesAxisLabelPadding, timeline._majorAxisLabels, isRTL);
        }

        labelElem.time = dates[i];
      }
    }
  };
  /**
   * Renders the overvie of a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @private
   */


  DvtTimelineRenderer._renderOverview = function (timeline) {
    var context = timeline.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);

    if (timeline._overviewCanvas == null) {
      var addOverviewCanvas = true;
      timeline._overviewCanvas = new dvt.Container(context, 'oCanvas');
    } else {
      timeline._overviewCanvas.removeChildren();

      timeline._overviewCanvas.setClipPath(null);
    }

    var borderWidth = timeline._style.getBorderWidth();

    var halfBorderWidth = borderWidth / 2;
    var width, height, x, y;

    if (timeline.isVertical()) {
      width = timeline._overviewSize;
      height = timeline._backgroundHeight - borderWidth;
      y = halfBorderWidth;
      if (!isRTL) x = timeline._backgroundWidth - timeline._overviewSize - halfBorderWidth;else x = halfBorderWidth;
    } else {
      width = timeline._backgroundWidth - borderWidth;
      height = timeline._overviewSize;
      y = timeline._backgroundHeight - timeline._overviewSize - halfBorderWidth;
      x = halfBorderWidth + timeline.getBackgroundXOffset();
    }

    timeline._overviewCanvas.setTranslateX(x);

    timeline._overviewCanvas.setTranslateY(y);

    var cp = new dvt.ClipPath();
    cp.addRect(x, y, width, height);

    timeline._overviewCanvas.setClipPath(cp);

    if (addOverviewCanvas) timeline.addChild(timeline._overviewCanvas);
    timeline._overview = new dvt.TimelineOverview(context, timeline.HandleEvent, timeline);

    timeline._overviewCanvas.addChild(timeline._overview);

    var overviewObject = timeline._getOverviewObject();

    timeline._overview.render(overviewObject, width, height);
  };
  /**
   * Renders the scrollbars.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @private
   */


  DvtTimelineRenderer._renderScrollbars = function (timeline) {
    var context = timeline.getCtx();
    var scrollbarPadding = timeline.getScrollbarPadding();

    if (timeline._scrollbarsCanvas == null) {
      timeline._scrollbarsCanvas = new dvt.Container(context, 'sbCanvas');
      timeline.addChild(timeline._scrollbarsCanvas);
    } else {
      timeline._scrollbarsCanvas.removeChildren();

      timeline.setTimeDirScrollbar(null);
      timeline.setContentDirScrollbar(null);
    }

    if (timeline.isTimeDirScrollbarOn()) {
      if (timeline.isVertical()) {
        if (dvt.Agent.isRightToLeft(timeline.getCtx())) var availSpaceWidth = scrollbarPadding * 2 + 1;else availSpaceWidth = timeline.Width - scrollbarPadding * 1.5;
        var availSpaceHeight = timeline.getCanvasLength();
      } else {
        availSpaceWidth = timeline.getCanvasLength();
        availSpaceHeight = timeline.Height - scrollbarPadding * 1.5;
      }

      var timeDirScrollbarDim = DvtTimelineRenderer._prerenderTimeDirScrollbar(timeline, timeline._scrollbarsCanvas, new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight));
    }

    if (timeline.isContentDirScrollbarOn()) {
      if (timeline.isVertical()) {
        availSpaceWidth = timeline._seriesSize;
        availSpaceHeight = timeline.Height - scrollbarPadding * 1.5;
      } else {
        if (dvt.Agent.isRightToLeft(timeline.getCtx())) availSpaceWidth = scrollbarPadding * 2 + 1;else availSpaceWidth = timeline.Width - scrollbarPadding * 1.5;
        availSpaceHeight = timeline._seriesSize;
      }

      var seriesCount = timeline._series.length;
      var contentDirScrollbarDim = [];

      for (var i = 0; i < seriesCount; i++) {
        contentDirScrollbarDim[i] = DvtTimelineRenderer._prerenderContentDirScrollbar(timeline, timeline._scrollbarsCanvas, new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight), i);
      }
    }

    if (timeline.timeDirScrollbar) {
      var sbOptions = {};
      sbOptions['color'] = timeline.timeDirScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
      sbOptions['backgroundColor'] = timeline.timeDirScrollbarStyles.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
      sbOptions['min'] = timeline._start;
      sbOptions['max'] = timeline._end;

      if (timeline.isVertical()) {
        sbOptions['isReversed'] = false;
        sbOptions['isHorizontal'] = false;
        timeline.timeDirScrollbar.setTranslateY(timeline.getStartYOffset());
      } else {
        sbOptions['isReversed'] = dvt.Agent.isRightToLeft(context);
        sbOptions['isHorizontal'] = true;
        timeline.timeDirScrollbar.setTranslateX(timeline.getStartXOffset());
      }

      timeline.timeDirScrollbar.render(sbOptions, timeDirScrollbarDim.w, timeDirScrollbarDim.h);
      timeline.timeDirScrollbar.setViewportRange(timeline._viewStartTime, timeline._viewEndTime);
    }

    if (timeline.contentDirScrollbar) {
      for (i = 0; i < seriesCount; i++) {
        sbOptions = {};
        sbOptions['color'] = timeline.contentDirScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
        sbOptions['backgroundColor'] = timeline.contentDirScrollbarStyles.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
        sbOptions['isHorizontal'] = timeline.isVertical();

        if (i == 0) {
          sbOptions['min'] = 0;
          sbOptions['max'] = Math.max(timeline._series[i]._maxOverflowValue, contentDirScrollbarDim[i].h);

          if (!timeline.isVertical()) {
            sbOptions['isReversed'] = true;
            timeline.contentDirScrollbar[i].setTranslateY(timeline.getStartYOffset());
          } else {
            if (dvt.Agent.isRightToLeft(context)) {
              sbOptions['isReversed'] = false;
              if (seriesCount == 2) timeline.contentDirScrollbar[i].setTranslateX(timeline.getStartXOffset() + timeline._seriesSize + timeline.getTimeAxisVisibleSize(seriesCount));else timeline.contentDirScrollbar[i].setTranslateX(timeline.getStartXOffset() + timeline.getTimeAxisVisibleSize(seriesCount));
            } else {
              sbOptions['isReversed'] = true;
              timeline.contentDirScrollbar[i].setTranslateX(timeline.getStartXOffset());
            }
          }
        } else {
          sbOptions['min'] = 0;
          sbOptions['max'] = Math.max(timeline._series[i]._maxOverflowValue, contentDirScrollbarDim[i].h);

          if (!timeline.isVertical()) {
            sbOptions['isReversed'] = false;
            timeline.contentDirScrollbar[i].setTranslateY(timeline.getStartYOffset() + timeline._seriesSize + timeline.getTimeAxisVisibleSize(seriesCount));
          } else {
            if (dvt.Agent.isRightToLeft(context)) {
              sbOptions['isReversed'] = true;
              timeline.contentDirScrollbar[i].setTranslateX(timeline.getStartXOffset());
            } else {
              sbOptions['isReversed'] = false;
              timeline.contentDirScrollbar[i].setTranslateX(timeline.getStartXOffset() + timeline._seriesSize + timeline.getTimeAxisVisibleSize(seriesCount));
            }
          }
        }

        timeline.contentDirScrollbar[i].render(sbOptions, contentDirScrollbarDim[i].w, contentDirScrollbarDim[i].h);
        timeline.contentDirScrollbar[i].setViewportRange(0, timeline._seriesSize);
      }
    }
  };
  /**
   * Prepares the time direction scrollbar for rendering.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @param {dvt.Container} container The container to render into.
   * @param {dvt.Rectangle} availSpace The available space.
   * @return {dvt.Dimension} The dimension of the scrollbar.
   * @private
   */


  DvtTimelineRenderer._prerenderTimeDirScrollbar = function (timeline, container, availSpace) {
    timeline.setTimeDirScrollbar(new dvt.SimpleScrollbar(timeline.getCtx(), timeline.HandleEvent, timeline));
    container.addChild(timeline.timeDirScrollbar);

    if (timeline.isVertical()) {
      var location = 'right';
      var width = dvt.CSSStyle.toNumber(timeline.timeDirScrollbarStyles.getWidth());
      var height = availSpace.h;
    } else {
      location = 'bottom';
      width = availSpace.w;
      height = dvt.CSSStyle.toNumber(timeline.timeDirScrollbarStyles.getHeight());
    }

    dvt.LayoutUtils.position(availSpace, location, timeline.timeDirScrollbar, width, height, 0);
    return new dvt.Dimension(width, height);
  };
  /**
   * Prepares the content direction scrollbar for rendering.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @param {dvt.Container} container The container to render into.
   * @param {dvt.Rectangle} availSpace The available space.
   * @param {number} index The series index.
   * @return {dvt.Dimension} The dimension of the scrollbar.
   * @private
   */


  DvtTimelineRenderer._prerenderContentDirScrollbar = function (timeline, container, availSpace, index) {
    timeline.setContentDirScrollbar(new dvt.SimpleScrollbar(timeline.getCtx(), timeline.HandleEvent, timeline), index);
    container.addChild(timeline.contentDirScrollbar[index]);

    if (timeline.isVertical()) {
      var location = 'bottom';
      var width = availSpace.w;
      var height = dvt.CSSStyle.toNumber(timeline.contentDirScrollbarStyles.getHeight());
    } else {
      location = 'right';
      width = dvt.CSSStyle.toNumber(timeline.contentDirScrollbarStyles.getWidth());
      height = availSpace.h;
    }

    dvt.LayoutUtils.position(availSpace, location, timeline.contentDirScrollbar[index], width, height, 0);
    return new dvt.Dimension(width, height);
  };
  /**
   * Renders the zoom controls of a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @private
   */


  DvtTimelineRenderer._renderZoomControls = function (timeline) {
    var context = timeline.getCtx();
    var resources = timeline._resources;
    var isRTL = dvt.Agent.isRightToLeft(context);
    var zoomControlProperties = {
      'zoomInProps': {
        'imageSize': 16,
        'cssUrl': resources['zoomIn'],
        'cssUrlHover': resources['zoomIn_h'],
        'cssUrlActive': resources['zoomIn_a'],
        'cssUrlDisabled': resources['zoomIn_d'],
        'enabledBackgroundColor': DvtTimelineStyleUtils.getZoomInButtonBackgroundColor(resources),
        'enabledBorderColor': DvtTimelineStyleUtils.getZoomInButtonBorderColor(resources),
        'hoverBackgroundColor': DvtTimelineStyleUtils.getZoomInButtonHoverBackgroundColor(resources),
        'hoverBorderColor': DvtTimelineStyleUtils.getZoomInButtonHoverBorderColor(resources),
        'activeBackgroundColor': DvtTimelineStyleUtils.getZoomInButtonActiveBackgroundColor(resources),
        'activeBorderColor': DvtTimelineStyleUtils.getZoomInButtonActiveBorderColor(resources),
        'disabledBackgroundColor': DvtTimelineStyleUtils.getZoomInButtonDisabledBackgroundColor(resources),
        'disabledBorderColor': DvtTimelineStyleUtils.getZoomInButtonDisabledBorderColor(resources)
      },
      'zoomOutProps': {
        'imageSize': 16,
        'cssUrl': resources['zoomOut'],
        'cssUrlHover': resources['zoomOut_h'],
        'cssUrlActive': resources['zoomOut_a'],
        'cssUrlDisabled': resources['zoomOut_d'],
        'enabledBackgroundColor': DvtTimelineStyleUtils.getZoomOutButtonBackgroundColor(resources),
        'enabledBorderColor': DvtTimelineStyleUtils.getZoomOutButtonBorderColor(resources),
        'hoverBackgroundColor': DvtTimelineStyleUtils.getZoomOutButtonHoverBackgroundColor(resources),
        'hoverBorderColor': DvtTimelineStyleUtils.getZoomOutButtonHoverBorderColor(resources),
        'activeBackgroundColor': DvtTimelineStyleUtils.getZoomOutButtonActiveBackgroundColor(resources),
        'activeBorderColor': DvtTimelineStyleUtils.getZoomOutButtonActiveBorderColor(resources),
        'disabledBackgroundColor': DvtTimelineStyleUtils.getZoomOutButtonDisabledBackgroundColor(resources),
        'disabledBorderColor': DvtTimelineStyleUtils.getZoomOutButtonDisabledBorderColor(resources)
      }
    };

    var xOffset = timeline.getStartXOffset() + DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;

    if (isRTL) {
      // startXOffset includes the overview size when vertical, and the scrollbar region when not
      if (timeline._isVertical && timeline._hasOverview) xOffset = xOffset - timeline._overviewSize;else xOffset = xOffset - timeline.getBackgroundXOffset();
      xOffset = timeline._backgroundWidth - xOffset - DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER;
    }

    zoomControlProperties['zoomInProps']['posX'] = xOffset;
    zoomControlProperties['zoomOutProps']['posX'] = xOffset;
    var yOffset = timeline._startY + DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;
    zoomControlProperties['zoomInProps']['posY'] = yOffset;
    zoomControlProperties['zoomOutProps']['posY'] = yOffset + DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER + DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_SPACING;
    timeline.renderZoomControls(zoomControlProperties);
  };
  /**
   * Renders the empty text of a timeline.
   * @param {dvt.Timeline} timeline The timeline being rendered.
   * @private
   */


  DvtTimelineRenderer._renderEmptyText = function (timeline) {
    // Get the empty text string
    if (timeline.Options['series']) var emptyTextStr = timeline.Options.translations.labelInvalidData;else emptyTextStr = timeline.Options.translations.labelNoData;
    timeline.clearComponent();
    dvt.TextUtils.renderEmptyText(timeline._canvas, emptyTextStr, new dvt.Rectangle(0, 0, timeline._backgroundWidth, timeline._backgroundHeight), timeline.EventManager, DvtTimelineStyleUtils.getEmptyTextStyle(timeline.Options));
  };
  /**
   * Adds a time inverval label.
   * @param {type} context
   * @param {type} container
   * @param {type} pos
   * @param {type} text
   * @param {type} maxLength
   * @param {type} y
   * @param {type} labelStyle
   * @param {type} id
   * @param {type} renderBackground
   * @param {type} backgroundLabelStyle
   * @param {type} backgroundLabelOpacity
   * @param {type} labelPadding
   * @param {type} labelList
   * @param {type} isRTL
   * @private
   * @return {dvt.OutputText}
   */


  DvtTimelineRenderer._addLabel = function (context, container, pos, text, maxLength, y, labelStyle, id, renderBackground, backgroundLabelStyle, backgroundLabelOpacity, labelPadding, labelList, isRTL) {
    var label = new dvt.OutputText(context, text, pos, 0, id);
    if (labelStyle != null) label.setCSSStyle(labelStyle);
    var dim = label.getDimensions();
    y = y - dim.h;
    label.setY(y);
    if (isRTL) label.setX(pos - dim.w);

    if (renderBackground) {
      var width = Math.min(dim.w + labelPadding * 2, maxLength);
      if (!isRTL) var x = pos;else x = pos - width + 2 * labelPadding;
      var backgroundRect = new dvt.Rect(context, x - labelPadding, y - labelPadding, width, dim.h + labelPadding * 2, 'ob_' + id);
      backgroundRect.setCSSStyle(backgroundLabelStyle);
      backgroundRect.setCornerRadius(3);
      backgroundRect.setAlpha(backgroundLabelOpacity);
      container.addChild(backgroundRect);
      if (labelList) labelList.push(backgroundRect);
    }

    dvt.TextUtils.fitText(label, maxLength, Infinity, container);
    if (labelList) labelList.push(label);
    return label;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Style related utility functions for dvt.Timeline.
   * @class
   */


  var DvtTimelineStyleUtils = new Object();
  dvt.Obj.createSubclass(DvtTimelineStyleUtils, dvt.Obj);
  /**
   * The default Timeline style.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_TIMELINE_STYLE = 'border:1px #d9dfe3;background-color:#f9f9f9;';
  /**
   * The default Axis style.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_AXIS_STYLE = 'background-color:#f9f9f9;border:1px #d9dfe3;';
  /**
   * The default Axis separator style.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_AXIS_SEPARATOR_STYLE = 'color:#bcc7d2;';
  /**
   * The default Series style.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_SERIES_STYLE = 'background-color:#f9f9f9;';
  /**
   * The default Series label background style.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_SERIES_LABEL_BACKGROUND_STYLE = 'background-color:#f9f9f9';
  /**
   * The default Series label background opacity.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_SERIES_LABEL_BACKGROUND_OPACITY = 0.8;
  /**
   * The default Series label spacing.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_SERIES_LABEL_SPACING = 20;
  /**
   * The default Series label padding.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_SERIES_LABEL_PADDING = 2;
  /**
   * The default Series Axis separator style.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_SERIES_AXIS_SEPARATOR_STYLE = 'color:#bcc7d2';
  /**
   * The default Series Axis label background style.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_SERIES_AXIS_LABEL_BACKGROUND_STYLE = 'background-color:#f9f9f9';
  /**
   * The default Series Axis label background opacity.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_SERIES_AXIS_LABEL_BACKGROUND_OPACITY = 0.8;
  /**
   * The default Series Axis label padding.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_SERIES_AXIS_LABEL_PADDING = 1;
  /**
   * The default Overview width.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_OVERVIEW_WIDTH = 60;
  /**
   * The default Overview height.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_OVERVIEW_HEIGHT = 100;
  /**
   * The default Item enabled stroke width.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ITEM_ENABLED_STROKE_WIDTH = 1;
  /**
   * The default Item hover stroke width.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ITEM_HOVER_STROKE_WIDTH = 2;
  /**
   * The default Item selected stroke width.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ITEM_SELECTED_STROKE_WIDTH = 2;
  /**
   * The default Item inner fill color.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ITEM_INNER_FILL_COLOR = 'rgba(249,249,249,0)';
  /**
   * The default Item active selected inner stroke color.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ITEM_ACTIVE_INNER_STROKE_COLOR = '#e4f0fa';
  /**
   * The default Item enabled inner stroke color.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ITEM_ENABLED_INNER_STROKE_COLOR = 'rgba(249,249,249,0)';
  /**
   * The default Item enabled inner stroke width.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ITEM_INNER_STROKE_WIDTH = 2;
  /**
   * The default Item bubble offset value.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_BUBBLE_OFFSET = 20;
  /**
   * The default Item bubble spacing.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_BUBBLE_SPACING = 15;
  /**
   * The default item content spacing.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ITEM_CONTENT_SPACING = 2;
  /**
   * The default Item duration feeler offset value.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_DURATION_FEELER_OFFSET = 10;
  /**
   * The default Item thumbnail width.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_THUMBNAIL_WIDTH = 32;
  /**
   * The default Item thumbnail height.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_THUMBNAIL_HEIGHT = 32;
  /**
   * The default zoom control background color.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR = '#ffffff';
  /**
   * The default zoom control border color.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR = '#d6d7d8';
  /**
   * The default zoom control diameter.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER = 31;
  /**
   * The default zoom control padding.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING = 10.5;
  /**
   * The default zoom control spacing.
   * @const
   * @private
   */

  DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_SPACING = 9;
  /**
   * Gets the item description style.
   * @param {DvtTimelineSeriesNode} item The item to be styled.
   * @return {dvt.CSSStyle} The item description style.
   */

  DvtTimelineStyleUtils.getItemDescriptionStyle = function (item) {
    var options = item._series.getOptions();

    var descriptionStyle = options['styleDefaults']['item']['descriptionStyle'];
    var style = item.getStyle();

    if (style) {
      var cssStyle = new dvt.CSSStyle(style);
      descriptionStyle.parseInlineStyle(cssStyle);
    }

    return descriptionStyle;
  };
  /**
   * Gets the item title style.
   * @param {DvtTimelineSeriesNode} item The item to be styled.
   * @return {dvt.CSSStyle} The item title style.
   */


  DvtTimelineStyleUtils.getItemTitleStyle = function (item) {
    var options = item._series.getOptions();

    var titleStyle = options['styleDefaults']['item']['titleStyle'];
    var style = item.getStyle();

    if (style) {
      var cssStyle = new dvt.CSSStyle(style);
      titleStyle.parseInlineStyle(cssStyle);
    }

    return titleStyle;
  };
  /**
   * Gets the reference object color.
   * @param {object} options The object containing data and specifications for the component.
   * @return {string} The reference object color.
   */


  DvtTimelineStyleUtils.getReferenceObjectColor = function (options) {
    return options['styleDefaults']['referenceObject']['color'];
  };
  /**
   * Gets the series label style.
   * @param {object} options The object containing data and specifications for the component.
   * @return {dvt.CSSStyle} The series label style.
   */


  DvtTimelineStyleUtils.getSeriesLabelStyle = function (options) {
    //Style Defaults
    return options['styleDefaults']['series']['labelStyle'];
  };
  /**
   * Gets the series label background style.
   * @return {string} The series label background style.
   */


  DvtTimelineStyleUtils.getSeriesLabelBackgroundStyle = function () {
    return DvtTimelineStyleUtils._DEFAULT_SERIES_LABEL_BACKGROUND_STYLE;
  };
  /**
   * Gets the series label background opacity.
   * @return {number} The series label background opacity.
   */


  DvtTimelineStyleUtils.getSeriesLabelBackgroundOpacity = function () {
    return DvtTimelineStyleUtils._DEFAULT_SERIES_LABEL_BACKGROUND_OPACITY;
  };
  /**
   * Gets the series label padding.
   * @return {number} The series label padding.
   */


  DvtTimelineStyleUtils.getSeriesLabelPadding = function () {
    return DvtTimelineStyleUtils._DEFAULT_SERIES_LABEL_PADDING;
  };
  /**
   * Gets the series label spacing.
   * @return {number} The series label spacing.
   */


  DvtTimelineStyleUtils.getSeriesLabelSpacing = function () {
    return DvtTimelineStyleUtils._DEFAULT_SERIES_LABEL_SPACING;
  };
  /**
   * Gets the empty text style.
   * @param {object} options The object containing data and specifications for the component.
   * @return {dvt.CSSStyle} The empty text style.
   */


  DvtTimelineStyleUtils.getEmptyTextStyle = function (options) {
    //Style Defaults
    return options['styleDefaults']['series']['emptyTextStyle'];
  };
  /**
   * Gets the item bubble offset.
   * @return {number} The item bubble offset.
   */


  DvtTimelineStyleUtils.getBubbleOffset = function () {
    return DvtTimelineStyleUtils._DEFAULT_BUBBLE_OFFSET;
  };
  /**
   * Gets the item bubble spacing.
   * @return {number} The item bubble spacing.
   */


  DvtTimelineStyleUtils.getBubbleSpacing = function () {
    return DvtTimelineStyleUtils._DEFAULT_BUBBLE_SPACING;
  };
  /**
   * Gets the item content spacing.
   * @return {number} The item content spacing.
   */


  DvtTimelineStyleUtils.getItemContentSpacing = function () {
    return DvtTimelineStyleUtils._DEFAULT_ITEM_CONTENT_SPACING;
  };
  /**
   * Gets the item fill color.
   * @param {DvtTimelineSeriesNode} item The item to be styled.
   * @return {string} The item fill color.
   */


  DvtTimelineStyleUtils.getItemFillColor = function (item) {
    var style = item.getStyle();

    if (style) {
      var cssStyle = new dvt.CSSStyle(style);
      var fillColor = cssStyle.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
      if (fillColor) return fillColor;
    }

    var options = item._series.getOptions();

    return options['styleDefaults']['item']['backgroundColor'];
  };
  /**
   * Gets the item stroke color.
   * @param {DvtTimelineSeriesNode} item The item to be styled.
   * @return {string} The item stroke color.
   */


  DvtTimelineStyleUtils.getItemStrokeColor = function (item) {
    var style = item.getStyle();

    if (style) {
      var cssStyle = new dvt.CSSStyle(style);
      var strokeColor = cssStyle.getStyle(dvt.CSSStyle.BORDER_COLOR);
      if (strokeColor) return strokeColor;
    }

    var options = item._series.getOptions();

    return options['styleDefaults']['item']['borderColor'];
  };
  /**
   * Gets the item stroke width.
   * @return {number} The item stroke width.
   */


  DvtTimelineStyleUtils.getItemStrokeWidth = function () {
    return DvtTimelineStyleUtils._DEFAULT_ITEM_ENABLED_STROKE_WIDTH;
  };
  /**
   * Gets the item hover fill color.
   * @param {DvtTimelineSeriesNode} item The item to be styled.
   * @return {string} The item hover fill color.
   */


  DvtTimelineStyleUtils.getItemHoverFillColor = function (item) {
    var options = item._series.getOptions();

    var hoverDefault = options['styleDefaults']['item']['hoverBackgroundColor'];
    if (hoverDefault) return hoverDefault;else return DvtTimelineStyleUtils.getItemFillColor(item);
  };
  /**
   * Gets the item hover stroke color.
   * @param {DvtTimelineSeriesNode} item The item to be styled.
   * @return {string} The item hover stroke color.
   */


  DvtTimelineStyleUtils.getItemHoverStrokeColor = function (item) {
    var options = item._series.getOptions();

    var hoverDefault = options['styleDefaults']['item']['hoverBorderColor'];
    if (hoverDefault) return hoverDefault;else return DvtTimelineStyleUtils.getItemStrokeColor(item);
  };
  /**
   * Gets the item hover stroke width.
   * @return {number} The item hover stroke width.
   */


  DvtTimelineStyleUtils.getItemHoverStrokeWidth = function () {
    return DvtTimelineStyleUtils._DEFAULT_ITEM_HOVER_STROKE_WIDTH;
  };
  /**
   * Gets the item selected fill color.
   * @param {DvtTimelineSeriesNode} item The item to be styled.
   * @return {string} The item selected fill color.
   */


  DvtTimelineStyleUtils.getItemSelectedFillColor = function (item) {
    var options = item._series.getOptions();

    var selectedDefault = options['styleDefaults']['item']['selectedBackgroundColor'];
    if (selectedDefault) return selectedDefault;else return DvtTimelineStyleUtils.getItemFillColor(item);
  };
  /**
   * Gets the item selected stroke color.
   * @param {DvtTimelineSeriesNode} item The item to be styled.
   * @return {string} The item selected stroke color.
   */


  DvtTimelineStyleUtils.getItemSelectedStrokeColor = function (item) {
    var options = item._series.getOptions();

    var selectedDefault = options['styleDefaults']['item']['selectedBorderColor'];
    if (selectedDefault) return selectedDefault;else return DvtTimelineStyleUtils.getItemStrokeColor(item);
  };
  /**
   * Gets the item selected stroke width.
   * @return {number} The item selected stroke width.
   */


  DvtTimelineStyleUtils.getItemSelectedStrokeWidth = function () {
    return DvtTimelineStyleUtils._DEFAULT_ITEM_SELECTED_STROKE_WIDTH;
  };
  /**
   * Gets the series style.
   * @return {string} The series style.
   */


  DvtTimelineStyleUtils.getSeriesStyle = function () {
    return DvtTimelineStyleUtils._DEFAULT_SERIES_STYLE;
  };
  /**
   * Gets the series color array.
   * @param {object} options The object containing data and specifications for the component.
   * @return {array} The series color array.
   */


  DvtTimelineStyleUtils.getColorsArray = function (options) {
    //Style Defaults
    return options['styleDefaults']['series']['colors'];
  };
  /**
   * Gets the duration feeler offset.
   * @return {number} The duration feeler offset.
   */


  DvtTimelineStyleUtils.getDurationFeelerOffset = function () {
    return DvtTimelineStyleUtils._DEFAULT_DURATION_FEELER_OFFSET;
  };
  /**
   * Gets the item thumbnail width.
   * @return {number} The item thumbnail width.
   */


  DvtTimelineStyleUtils.getThumbnailWidth = function () {
    return DvtTimelineStyleUtils._DEFAULT_THUMBNAIL_WIDTH;
  };
  /**
   * Gets the item thumbnail height.
   * @return {number} The item thumbnail height.
   */


  DvtTimelineStyleUtils.getThumbnailHeight = function () {
    return DvtTimelineStyleUtils._DEFAULT_THUMBNAIL_HEIGHT;
  };
  /**
   * Gets the series axis separator style.
   * @return {string} The series axis separator style.
   */


  DvtTimelineStyleUtils.getSeriesAxisSeparatorStyle = function () {
    return DvtTimelineStyleUtils._DEFAULT_SERIES_AXIS_SEPARATOR_STYLE;
  };
  /**
   * Gets the item inner active stroke color.
   * @return {string} The item inner active stroke color.
   */


  DvtTimelineStyleUtils.getItemInnerActiveStrokeColor = function () {
    return DvtTimelineStyleUtils._DEFAULT_ITEM_ACTIVE_INNER_STROKE_COLOR;
  };
  /**
   * Gets the item inner fill color.
   * @return {string} The item inner fill color.
   */


  DvtTimelineStyleUtils.getItemInnerFillColor = function () {
    return DvtTimelineStyleUtils._DEFAULT_ITEM_INNER_FILL_COLOR;
  };
  /**
   * Gets the item inner stroke color.
   * @return {string} The item inner stroke color.
   */


  DvtTimelineStyleUtils.getItemInnerStrokeColor = function () {
    return DvtTimelineStyleUtils._DEFAULT_ITEM_ENABLED_INNER_STROKE_COLOR;
  };
  /**
   * Gets the item inner stroke width.
   * @return {number} The item inner stroke width.
   */


  DvtTimelineStyleUtils.getItemInnerStrokeWidth = function () {
    return DvtTimelineStyleUtils._DEFAULT_ITEM_INNER_STROKE_WIDTH;
  };
  /**
   * Gets the timeline style.
   * @return {string} The timeline style.
   */


  DvtTimelineStyleUtils.getTimelineStyle = function () {
    return DvtTimelineStyleUtils._DEFAULT_TIMELINE_STYLE;
  };
  /**
   * Gets the overview width.
   * @return {number} The overview width.
   */


  DvtTimelineStyleUtils.getOverviewWidth = function () {
    return DvtTimelineStyleUtils._DEFAULT_OVERVIEW_WIDTH;
  };
  /**
   * Gets the overview height.
   * @return {number} The overview height.
   */


  DvtTimelineStyleUtils.getOverviewHeight = function () {
    return DvtTimelineStyleUtils._DEFAULT_OVERVIEW_HEIGHT;
  };
  /**
   * Gets the overview window background color.
   * @param {object} options The object containing data and specifications for the component.
   * @return {string} The overview window background color.
   */


  DvtTimelineStyleUtils.getOverviewWindowBackgroundColor = function (options) {
    return options['styleDefaults']['overview']['window']['backgroundColor'];
  };
  /**
   * Gets the overview window border color.
   * @param {object} options The object containing data and specifications for the component.
   * @return {string} The overview window border color.
   */


  DvtTimelineStyleUtils.getOverviewWindowBorderColor = function (options) {
    return options['styleDefaults']['overview']['window']['borderColor'];
  };
  /**
   * Gets the overview background color.
   * @param {object} options The object containing data and specifications for the component.
   * @return {string} The overview background color.
   */


  DvtTimelineStyleUtils.getOverviewBackgroundColor = function (options) {
    return options['styleDefaults']['overview']['backgroundColor'];
  };
  /**
   * Gets the overview label style.
   * @param {object} options The object containing data and specifications for the component.
   * @return {dvt.CSSStyle} The overview label style.
   */


  DvtTimelineStyleUtils.getOverviewLabelStyle = function (options) {
    return options['styleDefaults']['overview']['labelStyle'];
  };
  /**
   * Gets the series axis label style.
   * @param {object} options The object containing data and specifications for the component.
   * @return {dvt.CSSStyle} The series axis label style.
   */


  DvtTimelineStyleUtils.getSeriesAxisLabelStyle = function (options) {
    return options['styleDefaults']['majorAxis']['labelStyle'];
  };
  /**
   * Gets the series axis label background style.
   * @return {string} The series axis label background style.
   */


  DvtTimelineStyleUtils.getSeriesAxisLabelBackgroundStyle = function () {
    return DvtTimelineStyleUtils._DEFAULT_SERIES_AXIS_LABEL_BACKGROUND_STYLE;
  };
  /**
   * Gets the series axis label background opacity.
   * @return {number} The series axis label background opacity.
   */


  DvtTimelineStyleUtils.getSeriesAxisLabelBackgroundOpacity = function () {
    return DvtTimelineStyleUtils._DEFAULT_SERIES_AXIS_LABEL_BACKGROUND_OPACITY;
  };
  /**
   * Gets the axis separator style.
   * @return {string} The axis separator style.
   */


  DvtTimelineStyleUtils.getAxisSeparatorStyle = function () {
    return DvtTimelineStyleUtils._DEFAULT_AXIS_SEPARATOR_STYLE;
  };
  /**
   * Gets the series axis label padding.
   * @return {number} The series axis label padding.
   */


  DvtTimelineStyleUtils.getSeriesAxisLabelPadding = function () {
    return DvtTimelineStyleUtils._DEFAULT_SERIES_AXIS_LABEL_PADDING;
  };
  /**
   * Returns the animation duration in seconds for the component. This duration is
   * intended to be passed to the animation handler, and is not in the same units
   * as the API.
   * @param {object} options The object containing data and specifications for the component.
   * @return {number} The animation duration in seconds.
   */


  DvtTimelineStyleUtils.getAnimationDuration = function (options) {
    return dvt.CSSStyle.getTimeMilliseconds(options['styleDefaults']['animationDuration']) / 1000;
  };
  /**
   * Returns the zoom control background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control background color.
   */


  DvtTimelineStyleUtils.getZoomInButtonBackgroundColor = function (options) {
    if (options['zoomIn_bgc']) return options['zoomIn_bgc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control active background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control active background color.
   */


  DvtTimelineStyleUtils.getZoomInButtonActiveBackgroundColor = function (options) {
    if (options['zoomIn_a_bgc']) return options['zoomIn_a_bgc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control hover background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control hover background color.
   */


  DvtTimelineStyleUtils.getZoomInButtonHoverBackgroundColor = function (options) {
    if (options['zoomIn_h_bgc']) return options['zoomIn_h_bgc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control disabled background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control disabled background color.
   */


  DvtTimelineStyleUtils.getZoomInButtonDisabledBackgroundColor = function (options) {
    if (options['zoomIn_d_bgc']) return options['zoomIn_d_bgc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control border color.
   */


  DvtTimelineStyleUtils.getZoomInButtonBorderColor = function (options) {
    if (options['zoomIn_bc']) return options['zoomIn_bc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control active border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control active border color.
   */


  DvtTimelineStyleUtils.getZoomInButtonActiveBorderColor = function (options) {
    if (options['zoomIn_a_bc']) return options['zoomIn_a_bc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control hover border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control hover border color.
   */


  DvtTimelineStyleUtils.getZoomInButtonHoverBorderColor = function (options) {
    if (options['zoomIn_h_bc']) return options['zoomIn_h_bc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control disabled border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control disabled border color.
   */


  DvtTimelineStyleUtils.getZoomInButtonDisabledBorderColor = function (options) {
    if (options['zoomIn_d_bc']) return options['zoomIn_d_bc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control background color.
   */


  DvtTimelineStyleUtils.getZoomOutButtonBackgroundColor = function (options) {
    if (options['zoomOut_bgc']) return options['zoomOut_bgc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control active background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control active background color.
   */


  DvtTimelineStyleUtils.getZoomOutButtonActiveBackgroundColor = function (options) {
    if (options['zoomOut_a_bgc']) return options['zoomOut_a_bgc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control hover background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control hover background color.
   */


  DvtTimelineStyleUtils.getZoomOutButtonHoverBackgroundColor = function (options) {
    if (options['zoomOut_h_bgc']) return options['zoomOut_h_bgc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control disabled background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control disabled background color.
   */


  DvtTimelineStyleUtils.getZoomOutButtonDisabledBackgroundColor = function (options) {
    if (options['zoomOut_d_bgc']) return options['zoomOut_d_bgc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control border color.
   */


  DvtTimelineStyleUtils.getZoomOutButtonBorderColor = function (options) {
    if (options['zoomOut_bc']) return options['zoomOut_bc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control active border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control active border color.
   */


  DvtTimelineStyleUtils.getZoomOutButtonActiveBorderColor = function (options) {
    if (options['zoomOut_a_bc']) return options['zoomOut_a_bc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control hover border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control hover border color.
   */


  DvtTimelineStyleUtils.getZoomOutButtonHoverBorderColor = function (options) {
    if (options['zoomOut_h_bc']) return options['zoomOut_h_bc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control disabled border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control disabled border color.
   */


  DvtTimelineStyleUtils.getZoomOutButtonDisabledBorderColor = function (options) {
    if (options['zoomOut_d_bc']) return options['zoomOut_d_bc'];else return DvtTimelineStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * TimelineSeries component.
   * @param {dvt.Context} context The rendering context.
   * @param {object} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The object context for the callback function
   * @class TimelineSeries component.
   * @constructor
   * @extends {dvt.Container}
   */


  var DvtTimelineSeries = function DvtTimelineSeries(context, callback, callbackObj) {
    this.Init(context, callback, callbackObj);
  };

  dvt.Obj.createSubclass(DvtTimelineSeries, dvt.BaseComponent);
  /**
   * Initializes the view.
   * @param {dvt.Context} context The rendering context.
   * @param {object} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The object context for the callback function
   * @protected
   */

  DvtTimelineSeries.prototype.Init = function (context, callback, callbackObj) {
    DvtTimelineSeries.superclass.Init.call(this, context);
    this._callback = callback;
    this._callbackObj = callbackObj;
    this._blocks = [];
    this._renderedReferenceObjects = [];
    this._seriesTicksArray = [];
  };
  /**
   * Starts the animations.
   */


  DvtTimelineSeries.prototype.triggerAnimations = function () {
    var context = this.getCtx();

    if (this._rmAnimationElems && this._rmAnimationElems.length != 0) {
      // Disable event listeners temporarily
      this._callbackObj.EventManager.removeListeners(this._callbackObj);

      var fadeOutAnimator = new dvt.ParallelPlayable(context, new dvt.AnimFadeOut(context, this._rmAnimationElems, DvtTimelineStyleUtils.getAnimationDuration(this.Options)));
      dvt.Playable.appendOnEnd(fadeOutAnimator, this._onRmAnimationEnd, this);
      this._callbackObj.Animation = fadeOutAnimator;
      fadeOutAnimator.play();
    } else if (this._mvAnimator && this._hasMvAnimations) {
      // Disable event listeners temporarily
      this._callbackObj.EventManager.removeListeners(this._callbackObj);

      dvt.Playable.appendOnEnd(this._mvAnimator, this._onMvAnimationEnd, this);
      this._callbackObj.Animation = this._mvAnimator;

      this._mvAnimator.play();
    } else if (this._frAnimationElems && this._frAnimationElems.length != 0) {
      // Disable event listeners temporarily
      this._callbackObj.EventManager.removeListeners(this._callbackObj);

      var fadeInAnimator = new dvt.ParallelPlayable(context, new dvt.AnimFadeIn(context, this._frAnimationElems, DvtTimelineStyleUtils.getAnimationDuration(this.Options), this._isInitialRender ? 0 : 0)); //0.8 : 0));

      dvt.Playable.appendOnEnd(fadeInAnimator, this._onAnimationEnd, this);
      this._callbackObj.Animation = fadeInAnimator;
      fadeInAnimator.play();
    }
  };
  /**
   * Handler for the end of removal animations.
   * @private
   */


  DvtTimelineSeries.prototype._onRmAnimationEnd = function () {
    for (var i = 0; i < this._rmAnimationElems.length; i++) {
      var elem = this._rmAnimationElems[i];
      var parent = elem.getParent();
      if (parent) parent.removeChild(elem);
    }

    if (this._mvAnimator && this._hasMvAnimations) {
      this._callbackObj.Animation = this._mvAnimator;
      dvt.Playable.appendOnEnd(this._mvAnimator, this._onMvAnimationEnd, this);

      this._mvAnimator.play();
    } else this._onMvAnimationEnd();
  };
  /**
   * Handler for the end of moving animations.
   * @private
   */


  DvtTimelineSeries.prototype._onMvAnimationEnd = function () {
    if (this._frAnimationElems && this._frAnimationElems.length != 0) {
      var fadeInAnimator = new dvt.ParallelPlayable(this.getCtx(), new dvt.AnimFadeIn(this.getCtx(), this._frAnimationElems, DvtTimelineStyleUtils.getAnimationDuration(this.Options), this._isInitialRender ? 0 : 0)); //0.8 : 0));

      dvt.Playable.appendOnEnd(fadeInAnimator, this._onAnimationEnd, this);
      this._callbackObj.Animation = fadeInAnimator;
      fadeInAnimator.play();
    } else this._onAnimationEnd();
  };
  /**
   * Handler for the end of new item animations.
   * @private
   */


  DvtTimelineSeries.prototype._onAnimationEnd = function () {
    this._callbackObj.onAnimationEnd();
  };
  /**
   * Renders the component with the specified data.  If no data is supplied to a component
   * that has already been rendered, the component will be rerendered to the specified size.
   * @param {object} options The json object.
   * @param {number} width The width of the component.
   * @param {number} height The height of the component.
   */


  DvtTimelineSeries.prototype.render = function (options, width, height) {
    if (options) this.SetOptions(options);else {
      this._handleResize(width, height);

      return;
    }
    if (this.Width) this._isInitialRender = false;else this._isInitialRender = true; // Store the size

    this.Width = width;
    this.Height = height;
    var orientation = this.Options['orientation'];

    if (orientation && orientation == dvt.Timeline.ORIENTATION_VERTICAL) {
      if (this._isVertical == false) this._allowUpdates = false;else this._allowUpdates = true;
      this._isVertical = true;
    } else {
      if (this._isVertical) this._allowUpdates = false;else this._allowUpdates = true;
      this._isVertical = false;
    }

    if (this.Options) {
      var props = this.Parse(this.Options);

      this._applyParsedProperties(props);
    }

    this._fetchStartPos = 0;

    if (this._isVertical) {
      this._fetchEndPos = height;
      this._maxOverflowValue = width;
      this._length = height;
      this._size = width;
    } else {
      this._fetchEndPos = width;
      this._maxOverflowValue = height;
      this._length = width;
      this._size = height;
    }

    this._isInverted = this.Options['inverted'];
    this._colorCount = 0;
    this._maxDurationSize = 0;
    DvtTimelineSeriesRenderer.renderSeries(this, width, height);

    if (dvt.TimeAxis.supportsTouch()) {
      if (this._items.length > 0) this._setAriaProperty('flowto', '_bt_' + this._items[0].getId());
    } // Apply 'Series' label for accessibility


    var desc = this.GetComponentDescription();

    if (desc) {
      dvt.ToolkitUtils.setAttrNullNS(this.getElem(), 'role', 'group');
      dvt.ToolkitUtils.setAttrNullNS(this.getElem(), 'aria-label', dvt.TextUtils.processAriaLabel(desc));
    }
  };
  /**
   * @override
   */


  DvtTimelineSeries.prototype.GetComponentDescription = function () {
    var translations = this.Options.translations;
    var seriesDescArray = [translations.labelSeries]; // Use series label if set, otherwise use series index value

    if (this._label) seriesDescArray.push(this._label);else seriesDescArray.push(this.Options['index'] + 1);
    return dvt.ResourceUtils.format(translations.labelAndValue, seriesDescArray);
  };
  /**
   * Resizes the series to match the specified height and width.
   * @param {number} width The new width of the series.
   * @param {number} height The new Height of the series.
   * @private
   */


  DvtTimelineSeries.prototype._handleResize = function (width, height) {
    this._canvas.setTranslateY(0);

    this._canvas.setTranslateX(0);

    this.Width = width;
    this.Height = height;
    this._fetchStartPos = 0;

    if (this._isVertical) {
      this._fetchEndPos = height;
      this._maxOverflowValue = width;
      this._length = height;
      this._size = width;
    } else {
      this._fetchEndPos = width;
      this._maxOverflowValue = height;
      this._length = width;
      this._size = height;
    }

    this._background.setWidth(width);

    this._background.setHeight(height);

    DvtTimelineSeriesRenderer.updateSeriesForZoom(this);
  };
  /**
   * Combines style defaults with the styles provided
   */


  DvtTimelineSeries.prototype.applyStyleValues = function () {
    this._style = new dvt.CSSStyle(DvtTimelineStyleUtils.getSeriesStyle());
    this._seriesStyleDefaults = this.Options['seriesStyleDefaults'];
    this._axisStyleDefaults = this.Options['axisStyleDefaults'];
    this._colors = DvtTimelineStyleUtils.getColorsArray(this.Options);
    this._referenceObjects = this.Options['referenceObjects'];

    if (this._seriesStyleDefaults) {
      var style = this._seriesStyleDefaults['backgroundColor'];
      if (style) this._style.parseInlineStyle('background-color:' + style + ';');
    }

    this._style.parseInlineStyle(this._inlineStyle);
  };
  /**
   * @override
   */


  DvtTimelineSeries.prototype.SetOptions = function (options) {
    this.Options = options;
  };
  /**
   * Parses the data options describing the component.
   * @param {object} options The data options object.
   * @protected
   */


  DvtTimelineSeries.prototype.Parse = function (options) {
    this._parser = new DvtTimelineSeriesParser(this.getCtx());
    return this._parser.parse(options, this._items);
  };
  /**
   * Applies the parsed properties to this component.
   * @param {object} props An object containing the parsed properties for this component.
   * @private
   */


  DvtTimelineSeries.prototype._applyParsedProperties = function (props) {
    if (this._items) this._oldItems = this._items;
    this._items = props.items;
    if (this._items && this._items.length > 0) this._isEmpty = false;else this._isEmpty = true;
    this._isIRAnimationEnabled = props.isIRAnimationEnabled;
    this._isDCAnimationEnabled = props.isDCAnimationEnabled;
    this._label = props.label;
    this._timeAxis = props.timeAxis;
    this._emptyText = props.emptyText;
    if (this._emptyText == null) this._emptyText = this.Options.translations.labelNoData;
    this._isTopToBottom = props.isTopToBottom;
    this._isRandomItemLayout = props.isRandomItemLayout;
    this._customTimeScales = props.customTimeScales;
    this._customFormatScales = props.customFormatScales;
    this._start = props.start;
    this._end = props.end;
    this._inlineStyle = props.inlineStyle;
    this._scale = props.scale;
    this._converter = props.converter;
    this._data = props.data;
    this.applyStyleValues();
  };
  /**
   * Calculates the height value for the item given.
   * @protected
   */


  DvtTimelineSeries.prototype.calculateSpacing = function (item, index) {
    if (this._items == null || this._items.length == 0) return;
    var maxOverflowValue = this._maxOverflowValue;
    var y = item.getSpacing();

    if (this._isRandomItemLayout) {
      if (y == null) {
        var itemHeight = item.getHeight();
        var bottom = this._initialSpacing;
        var top = this._maxOverflowValue - itemHeight - bottom; // If not enough room, default to return bottom value

        if (top < 0) top = 0;
        y = Math.round(Math.random() * top) + bottom; //@RandomNumberOK

        if (this._maxOverflowValue < y + itemHeight) this._maxOverflowValue = y + itemHeight + DvtTimelineStyleUtils.getBubbleSpacing();
      }

      return y;
    }

    if (y == null) y = this._initialSpacing;

    if (!this._isVertical) {
      var x = item.getLoc();
      var width = item.getWidth() + 10;
      var hOffset = DvtTimelineStyleUtils.getBubbleSpacing();
      var overlappingItems = [];

      for (var i = 0; i < index; i++) {
        var currItem = this._items[i];
        var currWidth = currItem.getWidth() + 10;
        var currX = currItem.getLoc();
        if (x >= currX && x <= currX + currWidth || currX >= x && currX <= x + width) overlappingItems.push(currItem);
      }

      for (var i = 0; i < overlappingItems.length; i++) {
        var yChanged = false;

        for (var j = 0; j < overlappingItems.length; j++) {
          var currItem = overlappingItems[j];
          var currHeight = currItem.getHeight();
          var currY = currItem.getSpacing();

          if (y >= currY && y <= currY + currHeight) {
            y = currY + currHeight + hOffset; // y changed, do the loop again

            item.setSpacing(y);
            yChanged = true;
            break;
          }
        }

        if (!yChanged) break;
      }

      if (maxOverflowValue < y + currHeight) maxOverflowValue = y + currHeight;
    } else {
      for (var i = 0; i < index; i++) {
        var currItem = this._items[i];
        var currWidth = currItem.getWidth() + 10;
        if (maxOverflowValue < y + currWidth) maxOverflowValue = y + currWidth;
      }
    }

    if (maxOverflowValue > this._maxOverflowValue) this._maxOverflowValue = maxOverflowValue + DvtTimelineStyleUtils.getBubbleSpacing();
    return y;
  };
  /**
   * Calculates the duration height value for the item given.
   * @protected
   */


  DvtTimelineSeries.prototype.calculateDurationSize = function (item, index) {
    if (this._items == null || this._items.length == 0) return;
    var initialY = 1;
    var startTime = item.getStartTime();
    var endTime = item.getEndTime();
    if (!endTime || endTime == startTime) return;
    var y = item.getDurationLevel();
    if (y == null) y = initialY;
    var overlappingItems = [];

    for (var i = 0; i < index; i++) {
      var currItem = this._items[i];
      var currStartTime = currItem.getStartTime();
      var currEndTime = currItem.getEndTime();
      if (!currEndTime || currEndTime == currStartTime) continue;
      if (startTime >= currStartTime && startTime <= currEndTime) overlappingItems.push(currItem);
    }

    for (var i = 0; i < overlappingItems.length; i++) {
      var yChanged = false;

      for (var j = 0; j < overlappingItems.length; j++) {
        var currItem = overlappingItems[j];
        var currY = currItem.getDurationLevel();

        if (y == currY) {
          y = currY + 1; // y changed, do the loop again

          item.setDurationLevel(y);
          yChanged = true;
          break;
        }
      }

      if (!yChanged) break;
    }

    if (y > this._maxDurationSize) this._maxDurationSize = y;
    return y;
  };
  /**
   * Prepares the duration bars for rendering.
   * @protected
   */


  DvtTimelineSeries.prototype.prepareDurations = function (nodes) {
    for (var i = 0; i < this._items.length; i++) {
      var node = this._items[i];
      var startTime = node.getStartTime();
      var endTime = node.getEndTime();

      if (endTime && endTime != startTime) {
        node.setDurationLevel(this.calculateDurationSize(node, i));
        node.setDurationSize(22 + 10 * node.getDurationLevel() - 5);

        if (node.getDurationFillColor() == null) {
          node.setDurationFillColor(this._colors[this._colorCount]);
          this._colorCount++;
          if (this._colorCount == this._colors.length) this._colorCount = 0;
        }
      }
    }
  };
  /**
   * Prepares the items for rendering.
   * @param {Array<DvtTimelineSeriesItem>} items The items to be prepared.
   */


  DvtTimelineSeries.prototype.prepareItems = function (items) {
    if (this.isVertical()) this._initialSpacing = 20 * (this._maxDurationSize > 0 ? 1 : 0) + DvtTimelineStyleUtils.getBubbleSpacing() + 10 * this._maxDurationSize;else this._initialSpacing = 20 + DvtTimelineStyleUtils.getBubbleSpacing() + 10 * this._maxDurationSize;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var loc = dvt.TimeAxis.getDatePosition(this._start, this._end, item.getStartTime(), this._length); // offset position if a duration bar is rendered as well

      var endTime = item.getEndTime();

      if (endTime && endTime != item.getStartTime()) {
        var span = dvt.TimeAxis.getDatePosition(this._start, this._end, endTime, this._length) - loc;
        loc = loc + Math.min(DvtTimelineStyleUtils.getDurationFeelerOffset(), span / 2);
      }

      item.setLoc(loc);
    }

    for (var i = 0; i < this._items.length; i++) {
      var item = this._items[i];
      var loc = dvt.TimeAxis.getDatePosition(this._start, this._end, item.getStartTime(), this._length);
      if (loc < this._fetchStartPos || loc > this._fetchEndPos) continue;
      DvtTimelineSeriesItemRenderer.initializeItem(item, this, i);
    }
  };
  /**
   * Gets the data associated with this series
   * @param {boolean} isPublic Whether to retrieve a cleaned version of the data that would be publicly exposed
   * @return {Object} the data object
   */


  DvtTimelineSeries.prototype.getData = function (isPublic) {
    if (isPublic) {
      var publicData = {
        'emptyText': this._data.emptyText,
        'id': this._data.id,
        'itemLayout': this._data.itemLayout,
        'label': this._data.label,
        'svgStyle': this._data.svgStyle,
        'items': this._data.items
      };
      return dvt.TimeComponent.sanitizeData(publicData, 'series');
    }

    return this._data;
  };

  DvtTimelineSeries.prototype.getLabel = function () {
    return this._label;
  };

  DvtTimelineSeries.prototype.getEmptyText = function () {
    return this._emptyText;
  };

  DvtTimelineSeries.prototype.findItem = function (itemId) {
    if (this._items != null) {
      for (var i = 0; i < this._items.length; i++) {
        var item = this._items[i];
        if (dvt.Obj.compareValues(this.getCtx(), item.getId(), itemId)) return item;
      }
    }

    return null;
  };

  DvtTimelineSeries.prototype.isInverted = function () {
    return this._isInverted;
  };

  DvtTimelineSeries.prototype.isTopToBottom = function () {
    return this._isTopToBottom;
  };

  DvtTimelineSeries.prototype.isVertical = function () {
    return this._isVertical;
  };

  DvtTimelineSeries.prototype.addTick = function (container, x1, x2, y1, y2, stroke, id) {
    var line = new dvt.Line(this.getCtx(), x1, y1, x2, y2, id);
    line.setStroke(stroke);
    line.setPixelHinting(true);
    container.addChild(line);
    return line;
  }; /////////////////// scrolling ////////////////////////////


  DvtTimelineSeries.prototype.setVScrollPos = function (pos) {
    if (this._canvas != null) this._canvas.setTranslateY(0 - pos);
  };

  DvtTimelineSeries.prototype.setHScrollPos = function (pos) {
    if (this._canvas != null) this._canvas.setTranslateX(0 - pos);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Creates an instance of DvtTimelineSeriesItem which extends dvt.Container with hover and selection feedback.
   * @extends {dvt.Container}
   * @param {dvt.Context} context The rendering context
   * @param {string=} id The optional id for the corresponding DOM element.
   * @class
   * @constructor
   */


  var DvtTimelineSeriesItem = function DvtTimelineSeriesItem(context, id) {
    this.Init(context, id);
  };

  dvt.Obj.createSubclass(DvtTimelineSeriesItem, dvt.Container); // state

  DvtTimelineSeriesItem.ENABLED_STATE_KEY = 'en';
  DvtTimelineSeriesItem.SELECTED_STATE_KEY = 'sel';
  DvtTimelineSeriesItem.ACTIVE_SELECTED_STATE_KEY = 'asel';
  DvtTimelineSeriesItem.HOVER_STATE_KEY = 'hl';
  /**
   * @param {dvt.Context} context The rendering context
   * @param {string=} id The optional id for the corresponding DOM element
   * @protected
   */

  DvtTimelineSeriesItem.prototype.Init = function (context, id) {
    DvtTimelineSeriesItem.superclass.Init.call(this, context, 'g', id);
  };
  /**
   * Sets whether the timeline series item is currently selected and shows the seleciton effect
   * @param {boolean} bSelected True if the currently selected
   */


  DvtTimelineSeriesItem.prototype.setSelected = function (isSelected) {
    if (this._isSelected == isSelected) return;
    this._isSelected = isSelected;

    if (isSelected) {
      if (this._isShowingHoverEffect) this.applyState(DvtTimelineSeriesItem.ACTIVE_SELECTED_STATE_KEY);else this.applyState(DvtTimelineSeriesItem.SELECTED_STATE_KEY);
    } else this.applyState(DvtTimelineSeriesItem.ENABLED_STATE_KEY);
  };
  /**
   * Shows the hover effect for the timeline series item
   */


  DvtTimelineSeriesItem.prototype.showHoverEffect = function (isFocused) {
    if (!this._isShowingHoverEffect) {
      this._isShowingHoverEffect = true;
      if (this._isSelected && isFocused) this.applyState(DvtTimelineSeriesItem.ACTIVE_SELECTED_STATE_KEY);else if (this._isSelected) this.applyState(DvtTimelineSeriesItem.SELECTED_STATE_KEY);else this.applyState(DvtTimelineSeriesItem.HOVER_STATE_KEY);
    }
  };
  /**
   * Hides the hover effect for the timeline series item
   */


  DvtTimelineSeriesItem.prototype.hideHoverEffect = function (isFocused) {
    if (this._isSelected && isFocused) this.applyState(DvtTimelineSeriesItem.ACTIVE_SELECTED_STATE_KEY);else if (this._isSelected) this.applyState(DvtTimelineSeriesItem.SELECTED_STATE_KEY);else this.applyState(DvtTimelineSeriesItem.ENABLED_STATE_KEY);
    this._isShowingHoverEffect = false;
  };

  DvtTimelineSeriesItem.prototype.applyState = function (state) {
    var item = this._node;
    var itemElem = item.getBubble(); // if it is null the item has not been render yet, this could happen when user
    // hovers over a marker that is not in the viewport

    if (itemElem == null) return;
    var bubble = itemElem.getChildAt(0);
    var bubbleInner = bubble.getChildAt(0);
    var duration = item.getDurationBar();

    if (state == DvtTimelineSeriesItem.ACTIVE_SELECTED_STATE_KEY) {
      var bubbleFillColor = DvtTimelineStyleUtils.getItemSelectedFillColor(item);
      var bubbleStrokeColor = DvtTimelineStyleUtils.getItemSelectedStrokeColor(item);
      var bubbleStrokeWidth = DvtTimelineStyleUtils.getItemSelectedStrokeWidth();
      var bubbleInnerStrokeColor = DvtTimelineStyleUtils.getItemInnerActiveStrokeColor();
    } else if (state == DvtTimelineSeriesItem.SELECTED_STATE_KEY) {
      bubbleFillColor = DvtTimelineStyleUtils.getItemSelectedFillColor(item);
      bubbleStrokeColor = DvtTimelineStyleUtils.getItemSelectedStrokeColor(item);
      bubbleStrokeWidth = DvtTimelineStyleUtils.getItemSelectedStrokeWidth();
      bubbleInnerStrokeColor = DvtTimelineStyleUtils.getItemInnerStrokeColor();
    } else if (state == DvtTimelineSeriesItem.HOVER_STATE_KEY) {
      bubbleFillColor = DvtTimelineStyleUtils.getItemHoverFillColor(item);
      bubbleStrokeColor = DvtTimelineStyleUtils.getItemHoverStrokeColor(item);
      bubbleStrokeWidth = DvtTimelineStyleUtils.getItemHoverStrokeWidth();
      bubbleInnerStrokeColor = DvtTimelineStyleUtils.getItemInnerActiveStrokeColor();
    } else {
      bubbleFillColor = DvtTimelineStyleUtils.getItemFillColor(item);
      bubbleStrokeColor = DvtTimelineStyleUtils.getItemStrokeColor(item);
      bubbleStrokeWidth = DvtTimelineStyleUtils.getItemStrokeWidth();
      bubbleInnerStrokeColor = DvtTimelineStyleUtils.getItemInnerStrokeColor();
    }

    var bubbleInnerStrokeWidth = DvtTimelineStyleUtils.getItemInnerStrokeWidth();
    var bubbleStroke = new dvt.Stroke(bubbleStrokeColor, 1, bubbleStrokeWidth);
    var bubbleInnerStroke = new dvt.Stroke(bubbleInnerStrokeColor, 1, bubbleInnerStrokeWidth);
    bubble.setSolidFill(bubbleFillColor);
    bubble.setStroke(bubbleStroke);
    bubbleInner.setStroke(bubbleInnerStroke);
    var feeler = item.getFeeler();
    if (feeler) feeler.setStroke(bubbleStroke);
    if (duration) duration.setStroke(bubbleStroke);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Renderer for DvtTimelineSeriesItem.
   * @class
   */


  var DvtTimelineSeriesItemRenderer = new Object();
  dvt.Obj.createSubclass(DvtTimelineSeriesItemRenderer, dvt.Obj);
  /**
   * Renders a timeline series item.
   * @param {DvtTimelineSeriesItem} item The item being rendered.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {dvt.Container} container The container to render into.
   * @param {number} overflowOffset The amount of overflow.
   * @param {type} frAnimationElems The animator.
   * @param {type} mvAnimator The animator.
   */

  DvtTimelineSeriesItemRenderer.renderItem = function (item, series, container, overflowOffset, frAnimationElems, mvAnimator) {
    if (item._content) {
      DvtTimelineSeriesItemRenderer._renderBubble(item, series, container, frAnimationElems);

      DvtTimelineSeriesItemRenderer._displayBubble(item, series, overflowOffset, null, false);
    } else {
      series._hasMvAnimations = true;

      DvtTimelineSeriesItemRenderer._displayBubble(item, series, overflowOffset, mvAnimator, true);
    } // only render a feeler in horizontal orientation


    if (!series.isVertical()) {
      if (item.getFeeler() && series._allowUpdates) DvtTimelineSeriesItemRenderer._updateFeeler(item, series, overflowOffset, mvAnimator);else DvtTimelineSeriesItemRenderer._renderFeeler(item, series, container.feelers, overflowOffset, frAnimationElems);
    }
  };
  /**
   * Initializes a timeline series item.
   * @param {DvtTimelineSeriesItem} item The item being initialized.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {number} index The index of the item.
   */


  DvtTimelineSeriesItemRenderer.initializeItem = function (item, series, index) {
    if (item.getBubble() && series._allowUpdates) DvtTimelineSeriesItemRenderer._updateBubble(item, series, index);else DvtTimelineSeriesItemRenderer._createBubble(item, series, index);
  };
  /**
   * Creates the item bubble.
   * @param {DvtTimelineSeriesItem} item The item being initialized.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {number} index The index of the item.
   * @private
   */


  DvtTimelineSeriesItemRenderer._createBubble = function (item, series, index) {
    var marginTop = 5;
    var marginStart = 5;

    var content = DvtTimelineSeriesItemRenderer._getBubbleContent(item, series); // TODO: Review this later...


    item.setWidth(content._w + marginStart * 2);
    item.setHeight(content._h + marginTop * 2);
    item._content = content;
    var spacing = series.calculateSpacing(item, index);
    item.setSpacing(spacing);
  };
  /**
   * Renders a timeline series item bubble.
   * @param {DvtTimelineSeriesItem} item The item being rendered.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {dvt.Container} container The container to render into.
   * @param {type} animationElems The animator.
   * @private
   */


  DvtTimelineSeriesItemRenderer._renderBubble = function (item, series, container, animationElems) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var id = item.getId();
    var marginTop = 5;
    var marginStart = 5;
    var content = item._content;
    item._content = null;
    var nodeWidth = item.getWidth();
    var nodeHeight = item.getHeight(); // draw the bubble

    var bubbleId = '_bubble_' + id;

    if (series.isVertical()) {
      var offset = nodeHeight / 2;
      var startOffset = offset - 6;
      var endOffset = offset + 6;

      if (!isRTL && series.isInverted() || isRTL && !series.isInverted()) {
        var bubbleArray = [0, 0, 0, startOffset, -6, offset, 0, endOffset, 0, nodeHeight, nodeWidth, nodeHeight, nodeWidth, 0, 0, 0];
        var innerBubbleArray = [2, 2, 2, startOffset, -4, offset, 2, endOffset, 2, nodeHeight - 2, nodeWidth - 2, nodeHeight - 2, nodeWidth - 2, 2, 2, 2];
      } else {
        bubbleArray = [0, 0, 0, nodeHeight, nodeWidth, nodeHeight, nodeWidth, endOffset, nodeWidth + 6, offset, nodeWidth, startOffset, nodeWidth, 0, 0, 0];
        innerBubbleArray = [2, 2, 2, nodeHeight - 2, nodeWidth - 2, nodeHeight - 2, nodeWidth - 2, endOffset, nodeWidth + 4, offset, nodeWidth - 2, startOffset, nodeWidth - 2, 2, 2, 2];
      }
    } else {
      if (!isRTL) offset = DvtTimelineStyleUtils.getBubbleOffset();else offset = nodeWidth - DvtTimelineStyleUtils.getBubbleOffset();
      startOffset = offset - 6;
      endOffset = offset + 6;

      if (series.isInverted()) {
        bubbleArray = [0, 0, startOffset, 0, offset, -6, endOffset, 0, nodeWidth, 0, nodeWidth, nodeHeight, 0, nodeHeight, 0, 0];
        innerBubbleArray = [2, 2, startOffset, 2, offset, -4, endOffset, 2, nodeWidth - 2, 2, nodeWidth - 2, nodeHeight - 2, 2, nodeHeight - 2, 2, 2];
      } else {
        bubbleArray = [0, 0, 0, nodeHeight, startOffset, nodeHeight, offset, nodeHeight + 6, endOffset, nodeHeight, nodeWidth, nodeHeight, nodeWidth, 0, 0, 0];
        innerBubbleArray = [2, 2, 2, nodeHeight - 2, startOffset, nodeHeight - 2, offset, nodeHeight + 4, endOffset, nodeHeight - 2, nodeWidth - 2, nodeHeight - 2, nodeWidth - 2, 2, 2, 2];
      }
    }

    var bubble = new dvt.Polygon(context, bubbleArray, bubbleId);
    var innerBubble = new dvt.Polygon(context, innerBubbleArray, bubbleId + '_i');
    innerBubble.setSolidFill(DvtTimelineStyleUtils.getItemInnerFillColor()); //bubble.setPixelHinting(true);
    // margin around content

    content.setTranslate(marginStart, marginTop);
    bubble.addChild(innerBubble);
    bubble.addChild(content);
    var bubbleContainerId = '_bt_' + id;
    var bubbleContainer = new DvtTimelineSeriesItem(context, bubbleContainerId);

    if (animationElems) {
      bubbleContainer.setAlpha(0);
      animationElems.push(bubbleContainer);
    }

    bubbleContainer.addChild(bubble);
    if (dvt.TimeAxis.supportsTouch()) dvt.ToolkitUtils.setAttrNullNS(bubbleContainer._elem, 'id', bubbleContainer._id); // associate the node with the marker

    bubbleContainer._node = item; // associate the displayable with the node

    item.setBubble(bubbleContainer);
    bubbleContainer.applyState(DvtTimelineSeriesItem.ENABLED_STATE_KEY);
    if (item.getLoc() >= 0) container.addChild(bubbleContainer);
    bubbleContainer.setAriaRole('group');

    series._callbackObj.EventManager.associate(bubbleContainer, item);
  };
  /**
   * Displays a timeline series item bubble.
   * @param {DvtTimelineSeriesItem} item The item being rendered.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {number} overflowOffset The amount of overflow.
   * @param {type} animator The animator.
   * @param {boolean} resetState Whether the item state should be reset.
   * @private
   */


  DvtTimelineSeriesItemRenderer._displayBubble = function (item, series, overflowOffset, animator, resetState) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var loc = item.getLoc();
    var nodeWidth = item.getWidth();
    var nodeHeight = item.getHeight();
    var spacing = item.getSpacing();
    var bubbleContainer = item.getBubble();
    if (resetState) bubbleContainer.applyState(DvtTimelineSeriesItem.ENABLED_STATE_KEY);
    var transX;
    var transY;

    if (series.isVertical()) {
      transY = loc - nodeHeight / 2;
      if (isRTL && series.isInverted() || !isRTL && !series.isInverted()) transX = series._size - (nodeWidth + series._initialSpacing) + overflowOffset;else {
        transX = series._initialSpacing;
        overflowOffset = 0;
      }
    } else {
      if (!isRTL) transX = loc - DvtTimelineStyleUtils.getBubbleOffset();else transX = series._length - loc - nodeWidth + DvtTimelineStyleUtils.getBubbleOffset();

      if (!series.isInverted()) {
        if (!series.isTopToBottom()) transY = series.Height - spacing - nodeHeight + overflowOffset;else transY = spacing - series._initialSpacing + DvtTimelineStyleUtils.getBubbleSpacing();
      } else {
        if (series.isTopToBottom()) transY = spacing;else transY = series.Height - spacing - nodeHeight + overflowOffset + series._initialSpacing - DvtTimelineStyleUtils.getBubbleSpacing();
        overflowOffset = 0;
      }
    }

    if (animator) {
      if (!series.isVertical()) bubbleContainer.setTranslateY(bubbleContainer.getTranslateY() + series._canvasOffsetY + overflowOffset);else bubbleContainer.setTranslateX(bubbleContainer.getTranslateX() + series._canvasOffsetX + overflowOffset);
      animator.addProp(dvt.Animator.TYPE_NUMBER, bubbleContainer, bubbleContainer.getTranslateX, bubbleContainer.setTranslateX, transX);
      animator.addProp(dvt.Animator.TYPE_NUMBER, bubbleContainer, bubbleContainer.getTranslateY, bubbleContainer.setTranslateY, transY);
    } else bubbleContainer.setTranslate(transX, transY); // apply the aria label that corresponds to the current zoom level


    item._updateAriaLabel();
  };
  /**
   * Returns the content of a timeline series item bubble.
   * @param {DvtTimelineSeriesItem} item The item being rendered.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @return {dvt.Container} The bubble content for this item.
   * @private
   */


  DvtTimelineSeriesItemRenderer._getBubbleContent = function (item, series) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var title = item.getTitle();
    var desc = item.getDescription();
    var thumbnail = item.getThumbnail();
    var container = new dvt.Container(context);
    var offsetX = 0;
    var offsetY = 0;
    var maxWidth = 0;
    var maxHeight = 0;
    var textHeight = 0;

    if (!isRTL) {
      // left to right rendering
      if (thumbnail) {
        var thumbWidth = DvtTimelineStyleUtils.getThumbnailWidth();
        var thumbHeight = DvtTimelineStyleUtils.getThumbnailHeight();
        var thumbImage = new dvt.Image(context, thumbnail, 0, 0, thumbWidth, thumbHeight, '_tn');
        thumbImage.setMouseEnabled(false);
        container.addChild(thumbImage);
        offsetX = thumbWidth + DvtTimelineStyleUtils.getItemContentSpacing();
        maxHeight = thumbHeight;
      }

      if (title) {
        var titleText = new dvt.OutputText(context, title, offsetX, 0);
        titleText.setCSSStyle(DvtTimelineStyleUtils.getItemTitleStyle(item));
        var dim = titleText.getDimensions();
        maxWidth = dim.w;
        textHeight = dim.h;
        offsetY = textHeight;
        container.addChild(titleText);
      }

      if (desc) {
        var descText = new dvt.OutputText(context, desc, offsetX, offsetY);
        descText.setCSSStyle(DvtTimelineStyleUtils.getItemDescriptionStyle(item));
        dim = descText.getDimensions();
        maxWidth = Math.max(maxWidth, dim.w);
        textHeight = offsetY + dim.h;
        container.addChild(descText);
      }

      container._w = maxWidth == 0 ? Math.max(offsetX - DvtTimelineStyleUtils.getItemContentSpacing(), 0) : offsetX + maxWidth;
    } else {
      // right to left rendering
      if (title) {
        titleText = new dvt.OutputText(context, title, 0, 0);
        titleText.setCSSStyle(DvtTimelineStyleUtils.getItemTitleStyle(item));
        dim = titleText.getDimensions();
        offsetX = dim.w;
        textHeight = dim.h;
        offsetY = textHeight;
        container.addChild(titleText);
      }

      if (desc) {
        descText = new dvt.OutputText(context, desc, 0, offsetY);
        descText.setCSSStyle(DvtTimelineStyleUtils.getItemDescriptionStyle(item));
        dim = descText.getDimensions();
        var width = dim.w;

        if (offsetX != 0 && width != offsetX) {
          if (width > offsetX) {
            titleText.setX(width - offsetX);
            offsetX = width;
          } else descText.setX(offsetX - width);
        } else offsetX = width;

        textHeight = offsetY + dim.h;
        container.addChild(descText);
      }

      if (thumbnail) {
        thumbWidth = DvtTimelineStyleUtils.getThumbnailWidth();
        thumbHeight = DvtTimelineStyleUtils.getThumbnailHeight();
        offsetX = offsetX == 0 ? 0 : offsetX + DvtTimelineStyleUtils.getItemContentSpacing();
        thumbImage = new dvt.Image(context, thumbnail, offsetX, 0, thumbWidth, thumbHeight, '_tn');
        thumbImage.setMouseEnabled(false);
        container.addChild(thumbImage);
        maxWidth = thumbWidth;
        maxHeight = thumbHeight;
      }

      container._w = offsetX + maxWidth;
    }

    container._h = Math.max(maxHeight, textHeight);
    return container;
  };
  /**
   * Updates the rendering of a timeline series item bubble.
   * @param {DvtTimelineSeriesItem} item The item being updated.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {number} index The index of the item.
   * @private
   */


  DvtTimelineSeriesItemRenderer._updateBubble = function (item, series, index) {
    var spacing = series.calculateSpacing(item, index);
    item.setSpacing(spacing);
  };
  /**
   * Renders a timeline series item feeler.
   * @param {DvtTimelineSeriesItem} item The item being rendered.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {dvt.Container} container The container to render into.
   * @param {number} overflowOffset The amount of overflow.
   * @param {type} animationElems The animator.
   * @private
   */


  DvtTimelineSeriesItemRenderer._renderFeeler = function (item, series, container, overflowOffset, animationElems) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var id = item.getId();
    var loc = item.getLoc();
    var spacing = item.getSpacing(); // draw the feeler

    var feelerId = '_feeler_' + id;

    if (!series.isInverted()) {
      var feelerY = series.Height + overflowOffset - item.getDurationSize();
      if (!series.isTopToBottom()) var feelerHeight = series.Height - spacing + overflowOffset;else feelerHeight = spacing - series._initialSpacing + DvtTimelineStyleUtils.getBubbleSpacing() + item.getHeight();
    } else {
      feelerY = item.getDurationSize();
      if (series.isTopToBottom()) feelerHeight = spacing;else feelerHeight = series.Height - spacing - item.getHeight() + overflowOffset + series._initialSpacing - DvtTimelineStyleUtils.getBubbleSpacing();
    }

    var feelerX;
    if (isRTL) feelerX = series._length - loc;else feelerX = loc;
    var feeler = new dvt.Line(context, feelerX, feelerY, feelerX, feelerHeight, feelerId);

    if (animationElems) {
      feeler.setAlpha(0);
      animationElems.push(feeler);
    }

    container.addChild(feeler);
    var feelerWidth = DvtTimelineStyleUtils.getItemStrokeWidth();
    var feelerColor = DvtTimelineStyleUtils.getItemStrokeColor(item);
    var stroke = new dvt.Stroke(feelerColor, 1, feelerWidth);
    feeler.setStroke(stroke);
    feeler._node = item;
    item.setFeeler(feeler);
  };
  /**
   * Updates the rendering of a timeline series item feeler.
   * @param {DvtTimelineSeriesItem} item The item being updated.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {number} overflowOffset The amount of overflow.
   * @param {type} animator The animator.
   * @private
   */


  DvtTimelineSeriesItemRenderer._updateFeeler = function (item, series, overflowOffset, animator) {
    if (series.isVertical()) {
      item.setFeeler(null);
      return;
    }

    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var feeler = item.getFeeler();

    if (!series.isInverted()) {
      var feelerY = series.Height + overflowOffset - item.getDurationSize();
      if (!series.isTopToBottom()) var feelerHeight = series.Height - item.getSpacing() + overflowOffset;else feelerHeight = item.getSpacing() - series._initialSpacing + DvtTimelineStyleUtils.getBubbleSpacing() + item.getHeight();
    } else {
      feelerY = item.getDurationSize();
      if (series.isTopToBottom()) feelerHeight = item.getSpacing();else feelerHeight = series.Height - item.getSpacing() - item.getHeight() + overflowOffset + series._initialSpacing - DvtTimelineStyleUtils.getBubbleSpacing();
      overflowOffset = 0;
    }

    var feelerX;
    if (isRTL) feelerX = series._length - item.getLoc();else feelerX = item.getLoc();

    if (animator) {
      feeler.setY1(feeler.getY1() + series._canvasOffsetY + overflowOffset);
      feeler.setY2(feeler.getY2() + series._canvasOffsetY + overflowOffset);
      animator.addProp(dvt.Animator.TYPE_NUMBER, feeler, feeler.getX1, feeler.setX1, feelerX);
      animator.addProp(dvt.Animator.TYPE_NUMBER, feeler, feeler.getY1, feeler.setY1, feelerY);
      animator.addProp(dvt.Animator.TYPE_NUMBER, feeler, feeler.getX2, feeler.setX2, feelerX);
      animator.addProp(dvt.Animator.TYPE_NUMBER, feeler, feeler.getY2, feeler.setY2, feelerHeight);
    } else {
      feeler.setX1(feelerX);
      feeler.setY1(feelerY);
      feeler.setX2(feelerX);
      feeler.setY2(feelerHeight);
    }
  };
  /**
   * Renders a timeline series item duration.
   * @param {DvtTimelineSeriesItem} item The item being rendered.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {dvt.Container} container The container to render into.
   * @param {number} overflowOffset The amount of overflow.
   * @param {type} frAnimationElems The animator.
   * @param {type} mvAnimator The animator.
   */


  DvtTimelineSeriesItemRenderer.renderDuration = function (item, series, container, overflowOffset, frAnimationElems, mvAnimator) {
    if (item.getDurationBar()) DvtTimelineSeriesItemRenderer._updateDuration(item, series, overflowOffset, mvAnimator);else DvtTimelineSeriesItemRenderer._renderDuration(item, series, container, overflowOffset, frAnimationElems);
  };
  /**
   * Renders a timeline series item duration.
   * @param {DvtTimelineSeriesItem} item The item being rendered.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {dvt.Container} container The container to render into.
   * @param {number} overflowOffset The amount of overflow.
   * @param {type} animationElems The animator.
   * @private
   */


  DvtTimelineSeriesItemRenderer._renderDuration = function (item, series, container, overflowOffset, animationElems) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var startTime = item.getStartTime();
    var endTime = item.getEndTime();
    var loc = dvt.TimeAxis.getDatePosition(series._start, series._end, startTime, series._length);
    var durationId = '_duration_' + item.getId();
    var durationSize = 22 + 10 * item.getDurationLevel();
    var endLoc = dvt.TimeAxis.getDatePosition(series._start, series._end, endTime, series._length);

    if (series.isVertical()) {
      if (!isRTL && !series.isInverted() || isRTL && series.isInverted()) var duration = new dvt.Rect(context, series._size - durationSize + 5, loc, durationSize, endLoc - loc, durationId);else {
        duration = new dvt.Rect(context, -5, loc, durationSize, endLoc - loc, durationId);
        overflowOffset = 0;
      }
      duration.setTranslateX(overflowOffset);
      duration.setY(loc);
      duration.setWidth(durationSize);
      duration.setHeight(endLoc - loc);
    } else {
      var width = endLoc - loc;
      if (!isRTL) var transX = loc;else transX = series._length - loc - width;

      if (!series.isInverted()) {
        duration = new dvt.Rect(context, transX, series._size - durationSize + 5, width, durationSize, durationId);
        duration.setTranslateY(overflowOffset);
      } else {
        duration = new dvt.Rect(context, transX, -5, width, durationSize, durationId);
        duration.setTranslateY(0);
      }
    }

    if (animationElems) {
      duration.setAlpha(0);
      animationElems.push(duration);
    }

    duration.setCornerRadius(5);
    duration.setSolidFill(item.getDurationFillColor());
    var feelerWidth = DvtTimelineStyleUtils.getItemStrokeWidth();
    var feelerColor = DvtTimelineStyleUtils.getItemStrokeColor(item);
    var feelerStroke = new dvt.Stroke(feelerColor, 1, feelerWidth);
    duration.setStroke(feelerStroke);
    duration._node = item;

    series._callbackObj.EventManager.associate(duration, item);

    container.addChild(duration);
    item.setDurationBar(duration);
  };
  /**
   * Updates the rendering of a timeline series item duration.
   * @param {DvtTimelineSeriesItem} item The item being updated.
   * @param {DvtTimelineSeries} series The series containing this item.
   * @param {number} overflowOffset The amount of overflow.
   * @param {type} animator The animator.
   * @private
   */


  DvtTimelineSeriesItemRenderer._updateDuration = function (item, series, overflowOffset, animator) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var duration = item.getDurationBar();

    if (duration != null) {
      var loc = dvt.TimeAxis.getDatePosition(series._start, series._end, item.getStartTime(), series._length);
      var durationSize = 22 + 10 * item.getDurationLevel();
      var endLoc = dvt.TimeAxis.getDatePosition(series._start, series._end, item.getEndTime(), series._length);

      if (series.isVertical()) {
        var durationTransY = 0;
        if (!isRTL && !series.isInverted() || isRTL && series.isInverted()) var durationX = series._size - durationSize + 5;else {
          durationX = -5;
          overflowOffset = 0;
        }
        var durationTransX = overflowOffset;
        var durationY = loc;
        var durationWidth = durationSize;
        var durationHeight = endLoc - loc;
      } else {
        durationTransX = 0;
        var width = endLoc - loc;
        if (!isRTL) durationX = loc;else durationX = series._length - loc - width;

        if (!series.isInverted()) {
          durationTransY = overflowOffset;
          durationY = series._size - durationSize + 5;
          durationWidth = width;
          durationHeight = durationSize;
        } else {
          overflowOffset = 0;
          durationTransY = 0;
          durationY = -5;
          durationWidth = width;
          durationHeight = durationSize;
        }
      }

      if (animator) {
        if (!series.isVertical()) duration.setTranslateY(duration.getTranslateY() + series._canvasOffsetY + overflowOffset);else duration.setTranslateX(duration.getTranslateX() + series._canvasOffsetX + overflowOffset);
        animator.addProp(dvt.Animator.TYPE_NUMBER, duration, duration.getTranslateX, duration.setTranslateX, durationTransX);
        animator.addProp(dvt.Animator.TYPE_NUMBER, duration, duration.getTranslateY, duration.setTranslateY, durationTransY);
        animator.addProp(dvt.Animator.TYPE_NUMBER, duration, duration.getX, duration.setX, durationX);
        animator.addProp(dvt.Animator.TYPE_NUMBER, duration, duration.getY, duration.setY, durationY);
        animator.addProp(dvt.Animator.TYPE_NUMBER, duration, duration.getWidth, duration.setWidth, durationWidth);
        animator.addProp(dvt.Animator.TYPE_NUMBER, duration, duration.getHeight, duration.setHeight, durationHeight);
      } else {
        duration.setTranslateX(durationTransX);
        duration.setTranslateY(durationTransY);
        duration.setX(durationX);
        duration.setY(durationY);
        duration.setWidth(durationWidth);
        duration.setHeight(durationHeight);
      }
    }
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class representing a TimelineSeries node.
   * @param {object} props The properties for the node.
   * @class
   * @constructor
   *
   * @implements {DvtKeyboardNavigable}
   */


  var DvtTimelineSeriesNode = function DvtTimelineSeriesNode(timeline, series, props) {
    this.Init(timeline, series, props);
  };

  dvt.Obj.createSubclass(DvtTimelineSeriesNode, dvt.Obj);
  /**
   * @param {object} props The properties for the node.
   * @protected
   */

  DvtTimelineSeriesNode.prototype.Init = function (timeline, seriesIndex, props) {
    this._timeline = timeline;
    this._seriesIndex = seriesIndex;
    this._series = timeline._series[seriesIndex];
    this._id = props.id;
    this._rowKey = props.rowKey;
    this._startTime = parseInt(props.startTime); // TODO: warn user if endTime is invalid

    if (props.endTime) this._endTime = parseInt(props.endTime);
    this._title = props.title;
    this._desc = props.desc;
    this._thumbnail = props.thumbnail;
    this._shortDesc = props.shortDesc;
    this._style = props.style;
    this._data = props.data;
    this._durationFillColor = props.durationFillColor;
    this._durationSize = 0; //custom marker handling (for ADF)

    this._markerShape = props.markerShape;
    this._markerScaleX = props.markerScaleX;
    this._markerScaleY = props.markerScaleY;
    this._markerShortDesc = props.markerShortDesc;
    this._markerFillColor = props.markerFillColor;
    this._markerGradientFill = props.markerGradientFill;
    this._markerOpacity = props.markerOpacity;
    this._markerSD = props.markerSD;
    this._data = props.data;
  };

  DvtTimelineSeriesNode.prototype.getId = function () {
    return this._id;
  };

  DvtTimelineSeriesNode.prototype.getSeries = function () {
    return this._series;
  };

  DvtTimelineSeriesNode.prototype.getSeriesIndex = function () {
    return this._seriesIndex;
  };

  DvtTimelineSeriesNode.prototype.getRowKey = function () {
    return this._rowKey;
  };

  DvtTimelineSeriesNode.prototype.getStartTime = function () {
    return this._startTime;
  };

  DvtTimelineSeriesNode.prototype.setStartTime = function (startTime) {
    this._startTime = startTime;
  };

  DvtTimelineSeriesNode.prototype.getEndTime = function () {
    return this._endTime;
  };

  DvtTimelineSeriesNode.prototype.setEndTime = function (endTime) {
    this._endTime = endTime;
  };

  DvtTimelineSeriesNode.prototype.getTitle = function () {
    return this._title;
  };

  DvtTimelineSeriesNode.prototype.getDescription = function () {
    return this._desc;
  };

  DvtTimelineSeriesNode.prototype.getThumbnail = function () {
    return this._thumbnail;
  };

  DvtTimelineSeriesNode.prototype.getShortDesc = function () {
    return this._shortDesc;
  };

  DvtTimelineSeriesNode.prototype.getStyle = function () {
    return this._style;
  };
  /**
   * Sets the style of the node.
   * @param {string} style The style of the node.
   */


  DvtTimelineSeriesNode.prototype.setStyle = function (style) {
    this._style = style;
  }; ///////////////////// association of visual parts with node /////////////////////////


  DvtTimelineSeriesNode.prototype.getBubble = function () {
    return this._displayable;
  };

  DvtTimelineSeriesNode.prototype.setBubble = function (displayable) {
    this._displayable = displayable;
  };

  DvtTimelineSeriesNode.prototype.getFeeler = function () {
    return this._feeler;
  };

  DvtTimelineSeriesNode.prototype.setFeeler = function (feeler) {
    this._feeler = feeler;
  };

  DvtTimelineSeriesNode.prototype.getDurationBar = function () {
    return this._durationBar;
  };

  DvtTimelineSeriesNode.prototype.setDurationBar = function (durationBar) {
    this._durationBar = durationBar;
  };

  DvtTimelineSeriesNode.prototype.getLoc = function () {
    return this._loc;
  };

  DvtTimelineSeriesNode.prototype.setLoc = function (loc) {
    this._loc = loc;
  };

  DvtTimelineSeriesNode.prototype.getSpacing = function () {
    return this._spacing;
  };

  DvtTimelineSeriesNode.prototype.setSpacing = function (spacing) {
    this._spacing = spacing;
  };

  DvtTimelineSeriesNode.prototype.getDurationLevel = function () {
    return this._durationLevel;
  };

  DvtTimelineSeriesNode.prototype.setDurationLevel = function (durationLevel) {
    this._durationLevel = durationLevel;
  };

  DvtTimelineSeriesNode.prototype.getDurationSize = function () {
    return this._durationSize;
  };

  DvtTimelineSeriesNode.prototype.setDurationSize = function (durationSize) {
    this._durationSize = durationSize;
  };

  DvtTimelineSeriesNode.prototype.getDurationFillColor = function () {
    return this._durationFillColor;
  };

  DvtTimelineSeriesNode.prototype.setDurationFillColor = function (durationFillColor) {
    this._durationFillColor = durationFillColor;
  };

  DvtTimelineSeriesNode.prototype.getLabel = function () {
    var translations = this._timeline.getOptions().translations;

    var start = this.getStartTime();

    var formattedStart = this._timeline.getTimeAxis().formatDate(new Date(start), null, 'general');

    var itemDesc = dvt.ResourceUtils.format(translations.accessibleItemStart, [formattedStart]);
    var end = this.getEndTime();

    if (end && end != start) {
      var formattedEnd = this._timeline.getTimeAxis().formatDate(new Date(end), null, 'general');

      itemDesc = itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemEnd, [formattedEnd]);
    }

    var title = this.getTitle();
    if (title && title != '') itemDesc = itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemTitle, [title]);
    var description = this.getDescription();
    if (description && description != '') itemDesc = itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemDesc, [description]);
    return itemDesc;
  };

  DvtTimelineSeriesNode.prototype.getWidth = function () {
    return this._w;
  };

  DvtTimelineSeriesNode.prototype.setWidth = function (w) {
    this._w = w;
  };

  DvtTimelineSeriesNode.prototype.getHeight = function () {
    return this._h;
  };

  DvtTimelineSeriesNode.prototype.setHeight = function (h) {
    this._h = h;
  };
  /**
   * Gets the marker shape for this item.
   * @return {string} The marker shape for this item.
   */


  DvtTimelineSeriesNode.prototype.getMarkerShape = function () {
    return this._markerShape;
  };
  /**
   * Gets the marker scaleX value for this item.
   * @return {number} The marker scaleX value for this item.
   */


  DvtTimelineSeriesNode.prototype.getMarkerScaleX = function () {
    return this._markerScaleX;
  };
  /**
   * Gets the marker scaleY value for this item.
   * @return {number} The marker scaleY value for this item.
   */


  DvtTimelineSeriesNode.prototype.getMarkerScaleY = function () {
    return this._markerScaleY;
  };
  /**
   * Gets the marker short description for this item.
   * @return {string} The marker short description for this item.
   */


  DvtTimelineSeriesNode.prototype.getMarkerShortDesc = function () {
    return this._markerShortDesc;
  };
  /**
   * Gets the marker fill color for this item.
   * @return {string} The marker fill color for this item.
   */


  DvtTimelineSeriesNode.prototype.getMarkerFillColor = function () {
    return this._markerFillColor;
  };
  /**
   * Gets the marker gradient fill for this item.
   * @return {string} The marker gradient fill for this item.
   */


  DvtTimelineSeriesNode.prototype.getMarkerGradientFill = function () {
    return this._markerGradientFill;
  };
  /**
   * Gets the marker opacity for this item.
   * @return {number} The marker opacity for this item.
   */


  DvtTimelineSeriesNode.prototype.getMarkerOpacity = function () {
    return this._markerOpacity;
  };
  /**
   * Gets the marker default value for this item.
   * @return {number} The marker default value for this item.
   */


  DvtTimelineSeriesNode.prototype.getMarkerSD = function () {
    return this._markerSD;
  };
  /**
   * Implemented for DvtKeyboardNavigable
   * @override
   */


  DvtTimelineSeriesNode.prototype.getNextNavigable = function (event) {
    var keyboardHandler = this._timeline.EventManager.getKeyboardHandler();

    if (event.type == dvt.MouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event)) {
      return this;
    } else if (keyboardHandler.isNavigationEvent(event)) {
      var navigableItems = [];

      for (var i = 0; i < this._timeline._series.length; i++) {
        navigableItems.push(this._timeline._series[i]._items);
      }

      return DvtTimelineKeyboardHandler.getNextNavigable(this, event, navigableItems);
    } else {
      return null;
    }
  };
  /**
   * Implemented for DvtKeyboardNavigable
   * @override
   */


  DvtTimelineSeriesNode.prototype.getTargetElem = function () {
    return this._displayable.getElem();
  };
  /**
   * Implemented for DvtKeyboardNavigable
   * @override
   */


  DvtTimelineSeriesNode.prototype.getKeyboardBoundingBox = function (targetCoordinateSpace) {
    return this._displayable.getDimensions(targetCoordinateSpace);
  };
  /**
   * Implemented for DvtKeyboardNavigable
   * @override
   */


  DvtTimelineSeriesNode.prototype.showKeyboardFocusEffect = function () {
    this._isShowingKeyboardFocusEffect = true;
    this.showHoverEffect();

    this._timeline.updateScrollForItemNavigation(this);
  };
  /**
   * Implemented for DvtKeyboardNavigable
   * @override
   */


  DvtTimelineSeriesNode.prototype.hideKeyboardFocusEffect = function () {
    this._isShowingKeyboardFocusEffect = false;
    this.hideHoverEffect();
  };
  /**
   * Implemented for DvtKeyboardNavigable
   * @override
   */


  DvtTimelineSeriesNode.prototype.isShowingKeyboardFocusEffect = function () {
    return this._isShowingKeyboardFocusEffect;
  };
  /**
   * Implemented for DvtLogicalObject
   * @override
   */


  DvtTimelineSeriesNode.prototype.getDisplayables = function () {
    return [this._displayable];
  };
  /**
   * Implemented for DvtLogicalObject
   * @override
   */


  DvtTimelineSeriesNode.prototype.getAriaLabel = function () {
    var states = [];
    if (this.isSelectable()) states.push(this._timeline.getOptions().translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
    var shortDesc = DvtTimelineTooltipUtils.getDatatip(this, false);
    return dvt.Displayable.generateAriaLabel(shortDesc, states);
  };
  /**
   * Gets the data associated with this series node
   * @param {boolean} isPublic Whether to retrieve a cleaned version of the data that would be publicly exposed
   * @return {Object} the data object
   */


  DvtTimelineSeriesNode.prototype.getData = function (isPublic) {
    if (isPublic) {
      return dvt.TimeComponent.sanitizeData(this._data, 'item');
    }

    return this._data;
  };
  /**
   * Returns the data context (e.g. for passing to tooltip renderer, etc.)
   * @return {object}
   */


  DvtTimelineSeriesNode.prototype.getDataContext = function () {
    var data = this.getData();
    var itemData = data['_itemData'];
    return {
      'data': this.getData(true),
      'seriesData': this._series.getData(true),
      'itemData': itemData ? itemData : null,
      'color': DvtTimelineTooltipUtils.getDatatipColor(this),
      'component': this._timeline.getOptions()['_widgetConstructor']
    };
  };
  /**
   * Implemented for DvtTooltipSource
   * @override
   */


  DvtTimelineSeriesNode.prototype.getDatatip = function () {
    return DvtTimelineTooltipUtils.getDatatip(this, true);
  };
  /**
   * Implemented for DvtTooltipSource
   * @override
   */


  DvtTimelineSeriesNode.prototype.getDatatipColor = function () {
    return DvtTimelineTooltipUtils.getDatatipColor(this);
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  DvtTimelineSeriesNode.prototype.setSelectable = function (isSelectable) {
    this._isSelectable = isSelectable;
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  DvtTimelineSeriesNode.prototype.isSelectable = function () {
    return this._isSelectable;
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  DvtTimelineSeriesNode.prototype.isSelected = function () {
    return this._isSelected;
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  DvtTimelineSeriesNode.prototype.setSelected = function (isSelected) {
    this._isSelected = isSelected;

    this._displayable.setSelected(isSelected);

    this._updateAriaLabel();

    if (this._timeline._hasOverview && this._timeline._overview) {
      if (isSelected) this._timeline._overview.selSelectItem(this.getId());else this._timeline._overview.selUnselectItem(this.getId());
    }
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  DvtTimelineSeriesNode.prototype.showHoverEffect = function (ignoreOverview) {
    var isFocused = this._timeline.EventManager.getFocus() == this;

    this._displayable.showHoverEffect(isFocused);

    if (!ignoreOverview && this._timeline._hasOverview) this._timeline._overview.highlightItem(this.getId());

    if (this._timeline._isVertical || this._series._isRandomItemLayout) {
      if (!this._index) this._index = this._series._blocks[0].getChildIndex(this.getBubble());

      this._series._blocks[0].addChild(this.getBubble());
    }
  };
  /**
   * Implemented for DvtSelectable
   * @override
   */


  DvtTimelineSeriesNode.prototype.hideHoverEffect = function (ignoreOverview) {
    var isFocused = this._timeline.EventManager.getFocus() == this;

    this._displayable.hideHoverEffect(isFocused);

    if (!ignoreOverview && this._timeline._hasOverview) this._timeline._overview.unhighlightItem(this.getId());
    if ((this._timeline._isVertical || this._series._isRandomItemLayout) && this._index && !this._isSelected) this._series._blocks[0].addChildAt(this.getBubble(), this._index);
  };
  /**
   * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
   * when the activeElement is set.
   * @private
   */


  DvtTimelineSeriesNode.prototype._updateAriaLabel = function () {
    if (!dvt.Agent.deferAriaCreation()) {
      this._displayable.setAriaProperty('label', this.getAriaLabel());
    }
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * TimelineSeries JSON Parser
   * @param {DvtTimelineSeries} timelineSeries The owning timelineSeries component.
   * @class
   * @constructor
   * @extends {dvt.Obj}
   */


  var DvtTimelineSeriesParser = function DvtTimelineSeriesParser(context) {
    this._context = context;
  };

  dvt.Obj.createSubclass(DvtTimelineSeriesParser, dvt.Obj);
  /**
   * Parses the specified data options and returns the root node of the timelineSeries
   * @param {object} options The data options describing the component.
   * @return {object} An object containing the parsed properties
   */

  DvtTimelineSeriesParser.prototype.parse = function (options, oldItems) {
    // Parse the data options and get the root node
    var _data = this.buildData(options);

    var ret = new Object();
    ret.start = new Date(options['start']).getTime();
    ret.end = new Date(options['end']).getTime();
    ret.inlineStyle = options['style'];
    if (options['svgStyle']) ret.inlineStyle = options['svgStyle']; // end of stuff from superclass parser...

    ret.scale = options['scale'];
    ret.timeAxis = options['timeAxis'];
    ret.label = options['label'];
    ret.emptyText = options['emptyText'];
    ret.isIRAnimationEnabled = options['animationOnDisplay'] == 'auto';
    ret.isDCAnimationEnabled = options['animationOnDataChange'] == 'auto';
    ret.items = this._parseDataNode(options['timeline'], options['index'], _data.data, oldItems, ret.start, ret.end);
    ret.rtl = 'false';
    ret.isRandomItemLayout = options['_isRandomItemLayout'];
    ret.customTimeScales = options['_cts'];
    ret.customFormatScales = options['_cfs'];
    if (options['itemLayout'] == null || options['itemLayout'] == 'auto') ret.isTopToBottom = options['inverted'];else ret.isTopToBottom = options['itemLayout'] == 'topToBottom';
    ret.data = options['_data'];
    return ret;
  };
  /**
   * Constructs and returns the data array object.
   * @param {object} options The options object.
   * @protected
   */


  DvtTimelineSeriesParser.prototype.buildData = function (options) {
    var data = {};
    var itemArray = [];
    var seriesItems = options['items'];

    if (seriesItems) {
      for (var j = 0; j < seriesItems.length; j++) {
        var item = seriesItems[j];
        itemArray.push(item);
      }
    }

    data.data = itemArray;
    return data;
  };
  /**
   * Recursively parses the data option nodes, creating tree component nodes.
   * @param {DvtTimeline} timeline The parent Timeline component.
   * @param {number} seriesIndex The index of the series.
   * @param {object} data The data object representing this node.
   * @param {array} oldItems The array of previously created items.
   * @param {number} compStartTime The start time (in ms) of this component.
   * @param {number} compEndTime The end time (in ms) of this component.
   * @return {DvtBaseTreeNode} The resulting tree component node.
   * @private
   */


  DvtTimelineSeriesParser.prototype._parseDataNode = function (timeline, seriesIndex, data, oldItems, compStartTime, compEndTime) {
    var treeNodes = new Array();
    var series = timeline._series[seriesIndex];

    if (data) {
      for (var i = 0; i < data.length; i++) {
        // parse the attributes and create the node
        var props = this.ParseNodeAttributes(data[i], compStartTime, compEndTime);

        if (props) {
          if (series._allowUpdates) {
            var item = this._findExistingItem(props, oldItems);

            if (item) {
              var index = oldItems.indexOf(item);
              oldItems.splice(index, 1);
              item.setSpacing(null);
              item.setDurationLevel(null);
              item.setLoc(null);
              item.setSelected(false);
              item.setStartTime(props.startTime);
              item.setEndTime(props.endTime);
              item.setStyle(props.style);
            } else {
              item = new DvtTimelineSeriesNode(timeline, seriesIndex, props);
              item.setSelectable(true);
            }
          } else {
            item = new DvtTimelineSeriesNode(timeline, seriesIndex, props);
            item.setSelectable(true);
          }

          var startTime = item.getStartTime();
          var add = true;

          for (var j = 0; j < treeNodes.length; j++) {
            // ensure items are sorted in ascending order
            if (startTime < treeNodes[j].getStartTime()) {
              treeNodes.splice(j, 0, item);
              add = false;
              break;
            }
          }

          if (add) treeNodes.push(item);
        } // TODO: warn user of invalid data if prop is null

      }
    }

    return treeNodes;
  };

  DvtTimelineSeriesParser.prototype._findExistingItem = function (props, items) {
    if (items) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (dvt.Obj.compareValues(this._context, props.id, item.getId()) && props.title == item.getTitle() && props.desc == item.getDescription() && props.thumbnail == item.getThumbnail()) return item;
      }
    }
  };

  DvtTimelineSeriesParser.prototype.getDate = function (date) {
    if (date == null) return null;else if (date.getTime) // check function reference
      return date.getTime();else if (!isNaN(date)) return date;else return new Date(date).getTime() + 0 * 60 * 60 * 1000; // for twitter, replace 0 with 5
  };
  /**
   * Parses the attributes on a tree node.
   * @param {object} data The data object defining the tree node
   * @param {number} compStartTime The start time (in ms) of this component.
   * @param {number} compEndTime The end time (in ms) of this component.
   * @return {object} An object containing the parsed properties
   * @protected
   */


  DvtTimelineSeriesParser.prototype.ParseNodeAttributes = function (data, compStartTime, compEndTime) {
    // The object that will be populated with parsed values and returned
    var ret = new Object();
    ret.id = data['id'];
    ret.rowKey = ret.id;
    ret.startTime = this.getDate(data['start']);
    ret.endTime = this.getDate(data['end']); // only return an object if at least part of the event is visible

    var checkTime = ret.endTime ? ret.endTime : ret.startTime;
    if (checkTime < compStartTime || ret.startTime > compEndTime) return null;
    ret.title = data['title'];
    ret.desc = data['description'];
    ret.thumbnail = data['thumbnail'];
    ret.shortDesc = data['shortDesc'];
    ret.data = data;
    ret.style = data['style'];
    if (data['svgStyle']) ret.style = data['svgStyle'];
    ret.durationFillColor = data['durationFillColor']; //custom marker handling (for ADF)

    ret.markerShape = data['_markerShape'];
    ret.markerScaleX = data['_markerScaleX'];
    ret.markerScaleY = data['_markerScaleY'];
    ret.markerShortDesc = data['_markerShortDesc'];
    ret.markerFillColor = data['_markerFillColor'];
    ret.markerGradientFill = data['_markerGradientFill'];
    ret.markerOpacity = data['_markerOpacity'];
    if (data['_markerSD'] == false) ret.markerSD = 'false';else ret.markerSD = 'true';
    ret.data = data;
    return ret;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Renderer for DvtTimelineSeries.
   * @class
   */


  var DvtTimelineSeriesRenderer = new Object();
  dvt.Obj.createSubclass(DvtTimelineSeriesRenderer, dvt.Obj);
  /**
   * Renders a timeline series.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @param {number} width The width of the series.
   * @param {number} height The height of the series.
   */

  DvtTimelineSeriesRenderer.renderSeries = function (series, width, height) {
    DvtTimelineSeriesRenderer._renderBackground(series, width, height);

    DvtTimelineSeriesRenderer._renderScrollableCanvas(series);

    DvtTimelineSeriesRenderer._renderReferenceObjects(series, series._canvas);

    DvtTimelineSeriesRenderer._renderSeriesTicks(series);

    if (series._items == null) return;

    if (series._blocks.length == 0) {
      var context = series.getCtx();
      var block = new dvt.Container(context, 'itemBlock_' + series._fetchStartPos + '_' + series._fetchEndPos);
      block.startPos = series._fetchStartPos;
      block.endPos = series._fetchEndPos;
      var feelerBlock = new dvt.Container(context, 'feelers');
      block.addChild(feelerBlock);
      block.feelers = feelerBlock;
      var durationBlock = new dvt.Container(context, 'durations');
      block.addChild(durationBlock);
      block.durations = durationBlock;

      series._canvas.addChild(block);

      series._blocks.push(block);
    } else block = series._blocks[0];

    series.prepareDurations(series._items);
    series.prepareItems(series._items);

    if (series._isInitialRender) {
      if (series._isIRAnimationEnabled) series._frAnimationElems = [];else series._frAnimationElems = null;
      series._mvAnimator = null;
      series._rmAnimationElems = null;
    } else {
      if (series._allowUpdates && series._isDCAnimationEnabled) {
        series._frAnimationElems = [];
        series._mvAnimator = new dvt.Animator(series.getCtx(), DvtTimelineStyleUtils.getAnimationDuration(series.Options), 0, dvt.Easing.cubicInOut);
        series._rmAnimationElems = [];
      } else {
        series._frAnimationElems = null;
        series._mvAnimator = null;
        series._rmAnimationElems = null;
      }
    }

    series._hasMvAnimations = false; //make sure to take overflow into consideration

    var overflowOffset = Math.max(0, series._maxOverflowValue - series._size);
    series._overflowOffset = overflowOffset;

    DvtTimelineSeriesRenderer._adjustBackground(series, overflowOffset);

    if (series._oldItems) DvtTimelineSeriesRenderer._removeItems(series._oldItems, series, block, series._rmAnimationElems);
    series._oldItems = null;
    if (series.isVertical()) block.feelers.removeChildren();

    DvtTimelineSeriesRenderer._renderItems(series._items, series, block, series._fetchStartPos, series._fetchEndPos, overflowOffset, series._frAnimationElems, series._mvAnimator);

    if (series._callbackObj.SelectionHandler) block.setCursor(dvt.SelectionEffectUtils.getSelectingCursor()); //todo: make these update call unnecessary.... although not sure how to put them behind items...

    DvtTimelineSeriesRenderer._updateReferenceObjects(series);

    DvtTimelineSeriesRenderer._updateSeriesTicks(series);
  };
  /**
   * Updates the size and positioning of a timeline series for zooming.
   * @param {DvtTimelineSeries} series The series being updated.
   */


  DvtTimelineSeriesRenderer.updateSeriesForZoom = function (series) {
    DvtTimelineSeriesRenderer._updateItemsForZoom(series._items, series);

    DvtTimelineSeriesRenderer._updateReferenceObjects(series);

    DvtTimelineSeriesRenderer._updateSeriesTicks(series);
  };
  /**
   * Renders the background of a timeline series.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @param {number} width The width of the series.
   * @param {number} height The height of the series.
   * @private
   */


  DvtTimelineSeriesRenderer._renderBackground = function (series, width, height) {
    if (series._background) {
      var addBackground = false;

      series._background.setWidth(width);

      series._background.setHeight(height);
    } else {
      addBackground = true;
      series._background = new dvt.Rect(series.getCtx(), 0, 0, width, height, 'bg');
    }

    series._background.setCSSStyle(series._style);

    series._background.setPixelHinting(true);

    if (addBackground) series.addChild(series._background);
  };
  /**
   * Adjusts the size and positioning of the background of a timeline series.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @param {number} overflowOffset The amount of overflow.
   * @private
   */


  DvtTimelineSeriesRenderer._adjustBackground = function (series, overflowOffset) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);

    if (overflowOffset > 0) {
      if (series.isVertical()) series._background.setWidth(series._maxOverflowValue);else series._background.setHeight(series._maxOverflowValue);
    }

    if (series.isVertical()) {
      if (!series.isInverted() && !isRTL || series.isInverted() && isRTL) {
        series._background.setTranslateX(-overflowOffset);

        series.setHScrollPos(overflowOffset);
      }
    } else if (!series.isInverted()) {
      series._background.setTranslateY(-overflowOffset);

      series.setVScrollPos(overflowOffset);
    }
  };
  /**
   * Renders the scrollable canvas of a timeline series.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @private
   */


  DvtTimelineSeriesRenderer._renderScrollableCanvas = function (series) {
    if (series._canvas) {
      series._canvasOffsetX = series._canvas.getTranslateX();
      series._canvasOffsetY = series._canvas.getTranslateY();

      series._canvas.setTranslateX(0);

      series._canvas.setTranslateY(0);

      return;
    }

    series._canvas = new dvt.Container(series.getCtx(), 'canvas');
    series.addChild(series._canvas);
  };
  /**
   * Renders the items of a timeline series.
   * @param {Array<DvtTimelineSeriesItem>} items The items to be rendered.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @param {dvt.Container} container The container to render into.
   * @param {number} startPos The start position for rendering.
   * @param {number} endPos The end position for rendering.
   * @param {number} overflowOffset The amount of overflow.
   * @param {type} frAnimationElems The animator.
   * @param {type} mvAnimator The animator.
   * @private
   */


  DvtTimelineSeriesRenderer._renderItems = function (items, series, container, startPos, endPos, overflowOffset, frAnimationElems, mvAnimator) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var loc = dvt.TimeAxis.getDatePosition(series._start, series._end, item.getStartTime(), series._length);
      if (loc < startPos || loc > endPos) continue;
      DvtTimelineSeriesItemRenderer.renderItem(item, series, container, overflowOffset, frAnimationElems, mvAnimator);
    }

    if (dvt.TimeAxis.supportsTouch()) {
      for (var i = 0; i < items.length - 1; i++) {
        var item = items[i];
        var itemBubble = item.getBubble();

        if (itemBubble) {
          var next = items[i + 1];
          var nextBubble = next.getBubble();
          if (nextBubble) itemBubble._setAriaProperty('flowto', '_bt_' + next.getId());else break;
        }
      }
    }

    DvtTimelineSeriesRenderer._renderDurations(items, series, container, overflowOffset, frAnimationElems, mvAnimator);
  };
  /**
   * Updates the size and positioning of the items of a timeline series for zooming.
   * @param {Array<DvtTimelineSeriesItem>} items The items to be updated.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @private
   */


  DvtTimelineSeriesRenderer._updateItemsForZoom = function (items, series) {
    if (items == null || items.length == 0) return;
    var startPos = series._fetchStartPos;
    var endPos = series._fetchEndPos; // only one block for now

    var block = series._blocks[0];
    block.startPos = startPos;
    block.endPos = endPos;
    if (series.isVertical()) series._initialSpacing = 20 * (series._maxDurationSize > 0 ? 1 : 0) + DvtTimelineStyleUtils.getBubbleSpacing() + 10 * series._maxDurationSize;else series._initialSpacing = 20 + DvtTimelineStyleUtils.getBubbleSpacing() + 10 * series._maxDurationSize;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var startTime = item.getStartTime();
      var loc = dvt.TimeAxis.getDatePosition(series._start, series._end, startTime, series._length); // offset position if a duration bar is rendered as well

      var endTime = item.getEndTime();

      if (endTime && endTime != startTime) {
        var span = dvt.TimeAxis.getDatePosition(series._start, series._end, endTime, series._length) - loc;
        loc = loc + Math.min(DvtTimelineStyleUtils.getDurationFeelerOffset(), span / 2);
      }

      item.setLoc(loc);
      if (!series._isRandomItemLayout) item.setSpacing(null);
    }

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemTime = item.getStartTime();
      if (itemTime < series._start || itemTime > series._end) continue;

      DvtTimelineSeriesItemRenderer._updateBubble(item, series, i);
    }

    var overflowOffset = Math.max(0, series._maxOverflowValue - series._size);

    DvtTimelineSeriesRenderer._adjustBackground(series, overflowOffset);

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      DvtTimelineSeriesItemRenderer._displayBubble(item, series, overflowOffset, null, false);

      DvtTimelineSeriesItemRenderer._updateFeeler(item, series, overflowOffset, null);

      DvtTimelineSeriesItemRenderer._updateDuration(item, series, overflowOffset, null);
    }
  };
  /**
   * Renders the item durations of a timeline series.
   * @param {Array<DvtTimelineSeriesItem>} items The items to be rendered.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @param {dvt.Container} container The container to render into.
   * @param {number} overflowOffset The amount of overflow.
   * @param {type} frAnimationElems The animator.
   * @param {type} mvAnimator The animator.
   * @private
   */


  DvtTimelineSeriesRenderer._renderDurations = function (items, series, container, overflowOffset, frAnimationElems, mvAnimator) {
    var durationBlock = container.durations;

    for (var i = series._maxDurationSize; i > 0; i--) {
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        var startTime = item.getStartTime();
        var endTime = item.getEndTime();
        if (endTime && endTime != startTime && i == item.getDurationLevel()) DvtTimelineSeriesItemRenderer.renderDuration(item, series, durationBlock, overflowOffset, frAnimationElems, mvAnimator);
      }
    }
  };
  /**
   * Renders the major time axis intervals of a timeline series.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @private
   */


  DvtTimelineSeriesRenderer._renderSeriesTicks = function (series) {
    if (series._seriesTicks == null) {
      series._seriesTicks = new dvt.Container(series.getCtx());

      series._canvas.addChild(series._seriesTicks);
    } else {
      // remove all existing ticks and labels
      series._seriesTicks.removeChildren();

      series._seriesTicksArray = [];
    }

    if (series._scale && series._timeAxis) {
      var separatorStyle = new dvt.CSSStyle(DvtTimelineStyleUtils.getSeriesAxisSeparatorStyle());

      if (series._axisStyleDefaults) {
        var separatorColor = series._axisStyleDefaults['separatorColor'];
        if (separatorColor) separatorStyle.parseInlineStyle('color:' + separatorColor + ';');
      }

      series._separatorStroke = new dvt.Stroke(separatorStyle.getStyle(dvt.CSSStyle.COLOR), 1, 1, false, {
        dashArray: '3'
      });

      DvtTimelineSeriesRenderer._renderSeriesTimeAxis(series, series._fetchStartPos, series._fetchEndPos, series._seriesTicks);
    }
  };
  /**
   * Updates the size and positioning of the major axis intervals of a timeline series.
   * @param {DvtTimelineSeries} series The series being updated.
   * @private
   */


  DvtTimelineSeriesRenderer._updateSeriesTicks = function (series) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);

    for (var i = 0; i < series._seriesTicksArray.length; i++) {
      var tick = series._seriesTicksArray[i];
      if (!series.isVertical() && isRTL) var pos = series._length - dvt.TimeAxis.getDatePosition(series._start, series._end, tick.time, series._length);else pos = dvt.TimeAxis.getDatePosition(series._start, series._end, tick.time, series._length);

      if (series.isVertical()) {
        tick.setX1(0);
        tick.setY1(pos);
        tick.setX2(series._maxOverflowValue);
        tick.setY2(pos);
      } else {
        tick.setX1(pos);
        tick.setY1(0);
        tick.setX2(pos);
        tick.setY2(series._maxOverflowValue);
      }
    }
  };
  /**
   * Renders the major axis of a timeline series.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @param {number} startPos The start position for rendering.
   * @param {number} endPos The end position for rendering.
   * @param {dvt.Container} container The container to render into.
   * @private
   */


  DvtTimelineSeriesRenderer._renderSeriesTimeAxis = function (series, startPos, endPos, container) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var dates;
    var start = series._start;
    var end = series._end;

    if (series._customTimeScales && series._customTimeScales[series._scale]) {
      var customScale = series._customTimeScales[series._scale];
      dates = customScale['times'];
    } else if (series._customFormatScales && series._customFormatScales[series._scale]) {
      var customFormatScale = series._customFormatScales[series._scale];
      dates = customFormatScale['times'];
    } else {
      dates = [];
      var startDate = dvt.TimeAxis.getPositionDate(start, end, startPos, series._length);

      var currentDate = series._timeAxis.adjustDate(startDate);

      var currentPos = dvt.TimeAxis.getDatePosition(start, end, currentDate, series._length);
      dates.push(currentDate.getTime());

      while (currentPos < endPos) {
        currentDate = series._timeAxis.getNextDate(currentDate.getTime());
        currentPos = dvt.TimeAxis.getDatePosition(start, end, currentDate, series._length);
        dates.push(currentDate.getTime());
      }
    }

    for (var i = 0; i < dates.length - 1; i++) {
      var currentTime = dates[i];
      currentPos = dvt.TimeAxis.getDatePosition(start, end, currentTime, series._length);
      if (!series.isVertical() && isRTL) var pos = series._length - currentPos;else pos = currentPos;

      if (series.isVertical()) {
        var x1 = 0;
        var y1 = pos;
        var x2 = series._maxOverflowValue;
        var y2 = pos;
      } else {
        x1 = pos;
        y1 = 0;
        x2 = pos;
        y2 = series._maxOverflowValue;
      }

      var tickElem = series.addTick(container, x1, x2, y1, y2, series._separatorStroke, 'o_tick' + currentPos); // save the time associated with the element for dynamic resize

      tickElem.time = currentTime;

      series._seriesTicksArray.push(tickElem);
    }
  };
  /**
   * Renders the reference objects of a timeline series.
   * @param {DvtTimelineSeries} series The series being rendered.
   * @param {dvt.Container} container The container to render into.
   * @private
   */


  DvtTimelineSeriesRenderer._renderReferenceObjects = function (series, container) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);

    if (series._refObjectsContainer == null) {
      series._refObjectsContainer = new dvt.Container(context);
      container.addChild(series._refObjectsContainer);
    }

    var referenceObjects = series._referenceObjects;

    if (referenceObjects) {
      var maxRefObjects = Math.min(1, referenceObjects.length);

      for (var i = 0; i < maxRefObjects; i++) {
        var refObject = referenceObjects[i];

        if (refObject) {
          var pos = dvt.TimeAxis.getDatePosition(series._start, series._end, refObject, series._length);

          if (series._renderedReferenceObjects.length == 0) {
            if (series.isVertical()) var ref = new dvt.Line(context, 0, pos, series._maxOverflowValue, pos, 'zoomOrder[i]');else {
              if (isRTL) pos = series._length - pos;
              ref = new dvt.Line(context, pos, 0, pos, series._maxOverflowValue, 'zoomOrder[i]');
            }
            var referenceObjectStroke = new dvt.Stroke(DvtTimelineStyleUtils.getReferenceObjectColor(series.Options));
            ref.setStroke(referenceObjectStroke);
            ref.setPixelHinting(true);
            ref.date = refObject;

            series._refObjectsContainer.addChild(ref);

            series._renderedReferenceObjects[i] = ref;
          } else {
            ref = series._renderedReferenceObjects[i];
            ref.date = refObject;
            pos = dvt.TimeAxis.getDatePosition(series._start, series._end, ref.date, series._length);

            if (series.isVertical()) {
              ref.setX1(0);
              ref.setY1(pos);
              ref.setX2(series._maxOverflowValue);
              ref.setY2(pos);
            } else {
              if (isRTL) pos = series._length - pos;
              ref.setX1(pos);
              ref.setY1(0);
              ref.setX2(pos);
              ref.setY2(series._maxOverflowValue);
            }
          }
        }
      }
    } else {
      // clear any existing reference objects
      series._refObjectsContainer.removeChildren();

      series._renderedReferenceObjects = [];
    }
  };
  /**
   * Updates the size and positioning of the reference objects of a timeline series.
   * @param {DvtTimelineSeries} series The series being udpated.
   * @private
   */


  DvtTimelineSeriesRenderer._updateReferenceObjects = function (series) {
    var context = series.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);

    for (var i = 0; i < series._renderedReferenceObjects.length; i++) {
      var ref = series._renderedReferenceObjects[i];
      var pos = dvt.TimeAxis.getDatePosition(series._start, series._end, ref.date, series._length);

      if (series.isVertical()) {
        ref.setX1(0);
        ref.setY1(pos);
        ref.setX2(series._maxOverflowValue);
        ref.setY2(pos);
      } else {
        if (isRTL) pos = series._length - pos;
        ref.setX1(pos);
        ref.setY1(0);
        ref.setX2(pos);
        ref.setY2(series._maxOverflowValue);
      }
    }
  };
  /**
   * Removes the specified items from a timeline series.
   * @param {type} items The items to be removed.
   * @param {DvtTimelineSeries} series The series being updated.
   * @param {dvt.Container} container The container to remove the items from.
   * @param {type} animationElems An array of elements corresponding to items.
   * @private
   */


  DvtTimelineSeriesRenderer._removeItems = function (items, series, container, animationElems) {
    if (animationElems) {
      DvtTimelineSeriesRenderer._animateItemRemoval(items, series, animationElems);

      return;
    }

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var bubble = item.getBubble();
      container.removeChild(bubble); //item.setBubble(null);

      if (!series.isVertical()) {
        var feelerBlock = container.feelers;
        var feeler = item.getFeeler();
        feelerBlock.removeChild(feeler); //item.setFeeler(null);
      }

      var startTime = item.getStartTime();
      var endTime = item.getEndTime();

      if (endTime && endTime != startTime) {
        var durationBlock = container.durations;
        var durationBar = item.getDurationBar();
        durationBlock.removeChild(durationBar); //item.setDurationBar(null);
      }
    }
  };
  /**
   * Animates item removal.
   * @param {type} items
   * @param {type} series
   * @param {type} animationElems
   * @private
   */


  DvtTimelineSeriesRenderer._animateItemRemoval = function (items, series, animationElems) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var bubble = item.getBubble();
      if (!series.isVertical()) bubble.setTranslateY(bubble.getTranslateY() + series._canvasOffsetY + series._overflowOffset);else bubble.setTranslateX(bubble.getTranslateX() + series._canvasOffsetX + series._overflowOffset);
      animationElems.push(bubble);

      if (!series.isVertical()) {
        var feeler = item.getFeeler();
        feeler.setTranslateY(feeler.getTranslateY() + series._canvasOffsetY + series._overflowOffset);
        animationElems.push(feeler);
      }

      var startTime = item.getStartTime();
      var endTime = item.getEndTime();

      if (endTime && endTime != startTime) {
        var durationBar = item.getDurationBar();
        if (!series.isVertical()) durationBar.setTranslateY(durationBar.getTranslateY() + series._canvasOffsetY + series._overflowOffset);else durationBar.setTranslateX(durationBar.getTranslateX() + series._canvasOffsetX + series._overflowOffset);
        animationElems.push(durationBar);
      }
    }
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Utility functions for dvt.Timeline tooltips.
   * @class
   */


  var DvtTimelineTooltipUtils = new Object();
  dvt.Obj.createSubclass(DvtTimelineTooltipUtils, dvt.Obj);
  /**
   * Returns the datatip color for the tooltip of the target item.
   * @param {DvtTimelineSeriesNode} seriesNode
   * @return {string} The datatip color.
   */

  DvtTimelineTooltipUtils.getDatatipColor = function (seriesNode) {
    var fillColor = seriesNode.getDurationFillColor();
    if (fillColor) return fillColor;else return null;
  };
  /**
   * Returns the datatip string for the target item.
   * @param {DvtTimelineSeriesNode} seriesNode
   * @param {boolean} isTabular Whether the datatip is in a table format.
   * @param {boolean=} isAria whether the datatip is used for accessibility.
   * @return {string|Node|Array<Node>} The datatip string.
   */


  DvtTimelineTooltipUtils.getDatatip = function (seriesNode, isTabular, isAria) {
    var timeline = seriesNode._timeline; // Custom Tooltip via Function

    var customTooltip = timeline.getOptions()['tooltip'];
    var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;

    if (isTabular && tooltipFunc) {
      var tooltipManager = timeline.getCtx().getTooltipManager();
      var dataContext = seriesNode.getDataContext();
      return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
    } // Custom Tooltip via Short Desc


    var shortDesc = seriesNode.getShortDesc();
    if (shortDesc != null) return shortDesc; // Behavior: If someone upgrades from 5.0.0 to 6.0.0 with no code changes (ie, no shortDesc, valueFormat set),
    // old aria-label format with the translation options will work as before. If shortDesc or valueFormat is set,
    // then new behavior will override the old aria-label format and any translation settings.

    if (isAria && !timeline.getCtx().isCustomElement()) {
      var translations = timeline.getOptions().translations;
      var start = seriesNode.getStartTime();
      var formattedStart = timeline.getTimeAxis().formatDate(new Date(start), null, 'general');
      var itemDesc = dvt.ResourceUtils.format(translations.accessibleItemStart, [formattedStart]);
      var end = seriesNode.getEndTime();

      if (end && end != start) {
        var formattedEnd = timeline.getTimeAxis().formatDate(new Date(end), null, 'general');
        itemDesc = itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemEnd, [formattedEnd]);
      }

      var title = seriesNode.getTitle();
      if (title && title != '') itemDesc = itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemTitle, [title]);
      var description = seriesNode.getDescription();
      if (description && description != '') itemDesc = itemDesc + ' ' + dvt.ResourceUtils.format(translations.accessibleItemDesc, [description]);
      return itemDesc;
    } // Default Tooltip Support


    var datatipRows = [];

    DvtTimelineTooltipUtils._addItemDatatip(datatipRows, seriesNode, isTabular);

    return DvtTimelineTooltipUtils._processDatatip(datatipRows, timeline, isTabular);
  };
  /**
   * Final processing for the datatip.
   * @param {Array<string|Node>} datatipRows The current datatip.
   * @param {dvt.Timeline} timeline The owning timeline instance.
   * @param {boolean} isTabular Whether the datatip is in a table format.
   * @return {string|Node} The processed datatip.
   * @private
   */


  DvtTimelineTooltipUtils._processDatatip = function (datatipRows, timeline, isTabular) {
    // Don't render tooltip if empty
    if (datatipRows.length === 0) return null; // Add outer table tags

    if (isTabular) return dvt.HtmlTooltipManager.createElement('table', timeline.getOptions()['styleDefaults']['_tooltipStyle'], datatipRows);else return datatipRows.join('');
  };
  /**
   * Adds the item strings to the datatip.
   * @param {Array<string|Node>} datatipRows The current datatip. This array will be mutated.
   * @param {DvtTimelineSeriesNode} seriesNode The item node.
   * @param {boolean} isTabular Whether the datatip is in a table format.
   * @private
   */


  DvtTimelineTooltipUtils._addItemDatatip = function (datatipRows, seriesNode, isTabular) {
    var timeline = seriesNode._timeline;
    var title = seriesNode.getTitle();
    if (title) DvtTimelineTooltipUtils._addDatatipRow(datatipRows, timeline, 'title', 'Title', title, isTabular);
    var description = seriesNode.getDescription();
    if (description) DvtTimelineTooltipUtils._addDatatipRow(datatipRows, timeline, 'description', 'Description', description, isTabular);
    var start = seriesNode.getStartTime();
    var end = seriesNode.getEndTime();

    if (start && end && end != start) {
      DvtTimelineTooltipUtils._addDatatipRow(datatipRows, timeline, 'start', 'Start', start, isTabular);

      DvtTimelineTooltipUtils._addDatatipRow(datatipRows, timeline, 'end', 'End', end, isTabular);
    } else DvtTimelineTooltipUtils._addDatatipRow(datatipRows, timeline, 'date', 'Date', start, isTabular);

    var series = seriesNode._series.getLabel();

    if (series == null) series = seriesNode._series.getId();

    DvtTimelineTooltipUtils._addDatatipRow(datatipRows, timeline, 'series', 'Series', series, isTabular);
  };
  /**
   * Adds a row of item to the datatip string.
   * @param {Array<string|Node>} datatipRows The current datatip. This array will be mutated.
   * @param {dvt.Timeline} timeline The timeline instance.
   * @param {string} type The item type, e.g. series, start, end, title
   * @param {string} defaultLabel The bundle resource string for the default label.
   * @param {string|number} value The item value.
   * @param {boolean} isTabular Whether the datatip is in a table format.
   * @param {number} index (optional) The index of the tooltipLabel string to be used
   * @private
   */


  DvtTimelineTooltipUtils._addDatatipRow = function (datatipRows, timeline, type, defaultLabel, value, isTabular, index) {
    if (value == null || value === '') return;
    var options = timeline.getOptions()['styleDefaults'];
    var valueFormat = DvtTimelineTooltipUtils.getValueFormat(timeline, type);
    var tooltipDisplay = valueFormat['tooltipDisplay'];
    var translations = timeline.getOptions().translations;
    if (tooltipDisplay == 'off') return; // Create tooltip label

    var tooltipLabel;
    if (typeof valueFormat['tooltipLabel'] === 'string') tooltipLabel = valueFormat['tooltipLabel'];

    if (tooltipLabel == null) {
      if (defaultLabel == null) tooltipLabel = '';else tooltipLabel = translations['label' + defaultLabel];
    } // Create tooltip value


    value = DvtTimelineTooltipUtils.formatValue(timeline, type, valueFormat, value);

    if (isTabular) {
      var isRTL = dvt.Agent.isRightToLeft(timeline.getCtx());
      options['tooltipLabelStyle'].setStyle(dvt.CSSStyle.TEXT_ALIGN, isRTL ? 'left' : 'right');
      options['tooltipValueStyle'].setStyle(dvt.CSSStyle.TEXT_ALIGN, isRTL ? 'right' : 'left');
      var tds = [dvt.HtmlTooltipManager.createElement('td', options['tooltipLabelStyle'], tooltipLabel), dvt.HtmlTooltipManager.createElement('td', options['tooltipValueStyle'], value)];
      datatipRows.push(dvt.HtmlTooltipManager.createElement('tr', null, tds));
    } else {
      datatipRows.push((datatipRows.length > 0 ? '<br>' : '') + dvt.ResourceUtils.format(translations.labelAndValue, [tooltipLabel, value]));
    }
  };
  /**
   * Returns the valueFormat of the specified type.
   * @param {dvt.Timeline} timeline
   * @param {string} type The valueFormat type, e.g. row, start, end, label.
   * @return {object} The valueFormat.
   */


  DvtTimelineTooltipUtils.getValueFormat = function (timeline, type) {
    var valueFormats = timeline.getOptions()['valueFormats'];
    if (!valueFormats) return {};else if (valueFormats instanceof Array) {
      // TODO remove deprecated array support
      // Convert the deprecated array syntax to object syntax
      var obj = {};

      for (var i = 0; i < valueFormats.length; i++) {
        var valueFormat = valueFormats[i];
        obj[valueFormat['type']] = valueFormat;
      }

      timeline.getOptions()['valueFormats'] = obj;
      valueFormats = obj;
    }
    if (valueFormats[type]) return valueFormats[type];
    return {};
  };
  /**
   * Formats value with the converter from the valueFormat.
   * @param {dvt.Timeline} timeline
   * @param {string} type The item type, e.g. series, start, end, title
   * @param {object} valueFormat
   * @param {number} value The value to format.
   * @return {string} The formatted value string.
   */


  DvtTimelineTooltipUtils.formatValue = function (timeline, type, valueFormat, value) {
    var converter = valueFormat['converter'];
    if (type == 'start' || type == 'end' || type == 'date') return timeline.getTimeAxis().formatDate(new Date(value), converter, 'general');
    if (converter && converter['format']) return converter['format'](value);
    return value;
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
