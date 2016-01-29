/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit', './DvtOverview'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

  // Map the D namespace to dvt, which is used to provide access across partitions.
  var D = dvt;
  
/**
 * TimelineOverview component.
 * @param {DvtContext} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @class TimelineOverview component.
 * @constructor
 * @extends {DvtContainer}
 * @export
 */
var DvtTimelineOverview = function(context, callback, callbackObj) {
  this.Init(context, callback, callbackObj);
};

DvtObj.createSubclass(DvtTimelineOverview, DvtOverview, 'DvtTimelineOverview');

// state
DvtTimelineOverview.ENABLED_STATE = '_';
DvtTimelineOverview.HOVER_STATE = '_h';
DvtTimelineOverview.SELECTED_STATE = '_s';
DvtTimelineOverview.ACTIVE_SELECTED_STATE = '_as';

// property
DvtTimelineOverview.BORDER_STYLE = 'bs';
DvtTimelineOverview.BORDER_COLOR = 'bc';
DvtTimelineOverview.BORDER_WIDTH = 'bw';
DvtTimelineOverview.DURATION_BORDER_STYLE = 'dbs';
DvtTimelineOverview.DURATION_BORDER_COLOR = 'dbc';
DvtTimelineOverview.DURATION_BORDER_WIDTH = 'dbw';
DvtTimelineOverview.BORDER_OFFSET = 'bof';
DvtTimelineOverview.BORDER_OPACITY = 'bo';
DvtTimelineOverview.GLOW_COLOR = 'gc';
DvtTimelineOverview.GLOW_OPACITY = 'go';

DvtTimelineOverview.FILL_COLOR = 'fc';


/**
 * Initializes the view.
 * @param {DvtContext} context The rendering context.
 * @param {object} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The object context for the callback function
 * @protected
 * @override
 */
DvtTimelineOverview.prototype.Init = function(context, callback, callbackObj) 
{
  DvtTimelineOverview.superclass.Init.call(this, context, callback, callbackObj);

  // default fills
  var colors = [DvtColorUtils.getPound(DvtColorUtils.getPastel('#aadd77', 0.35)), '#aadd77', DvtColorUtils.getPound(DvtColorUtils.getDarker('#aadd77', 0.5))];
  // get pastel doesn't work too well on ipad
  if (DvtTimeUtils.supportsTouch())
    colors = ['#aadd77'];

  this._defColors = colors;
  this._markerBorderFill = DvtSolidFill.invisibleFill();

  // default marker size
  this._markerSize = 12;
};


/**
 * @protected
 * @override
 */
DvtTimelineOverview.prototype.getParser = function(obj)
{
  return new DvtTimelineOverviewParser(this);
};


/**
 * Applies the parsed properties to this component.
 * @param {object} props An object containing the parsed properties for this component.
 * @protected
 * @override
 */
DvtTimelineOverview.prototype._applyParsedProperties = function(props) 
{
  DvtTimelineOverview.superclass._applyParsedProperties.call(this, props);

  this._selectionMode = props.selectionMode;
  this._markers = props.markers;
  this._seriesIds = props.seriesIds;

  this._defaultMarkerStyles = props.defaultMarkerStyles;
  this._durationColors = ['#267DB3', '#68C182', '#FAD55C', '#ED6647',
                          '#8561C8', '#6DDBDB', '#FFB54D', '#E371B2',
                          '#47BDEF', '#A2BF39', '#A75DBA', '#F7F37B'];

  if (props.labelStyle)
    this._labelStyle = new DvtCSSStyle(props.labelStyle);

  // calculate marker spacing offset value
  var minMarkerSpacing = 1;
  var markerSpacingError = 1;

  if (this.getStyle(DvtTimelineOverview.ENABLED_STATE, DvtTimelineOverview.BORDER_STYLE) == 'solid')
    var _eOffset = parseInt(this.getStyle(DvtTimelineOverview.ENABLED_STATE, DvtTimelineOverview.BORDER_OFFSET), 10);
  else
    _eOffset = minMarkerSpacing;
  if (this.getStyle(DvtTimelineOverview.ACTIVE_SELECTED_STATE, DvtTimelineOverview.BORDER_STYLE) == 'solid')
    var _asOffset = parseInt(this.getStyle(DvtTimelineOverview.ACTIVE_SELECTED_STATE, DvtTimelineOverview.BORDER_OFFSET), 10);
  else
    _asOffset = minMarkerSpacing;
  if (this.getStyle(DvtTimelineOverview.SELECTED_STATE, DvtTimelineOverview.BORDER_STYLE) == 'solid')
    var _sOffset = parseInt(this.getStyle(DvtTimelineOverview.SELECTED_STATE, DvtTimelineOverview.BORDER_OFFSET), 10);
  else
    _sOffset = minMarkerSpacing;

  if (this.isItemSelectionEnabled())
    this._markerSpacingOffset = Math.max(_asOffset, _sOffset, _eOffset, minMarkerSpacing) / 2 + markerSpacingError;
  else
    this._markerSpacingOffset = minMarkerSpacing;

  // some of the defaults depends on orientation
  this._defOpacity = this.isVertical() ? 0 : 0.75;
  this._defAlphas = [this._defOpacity, this._defOpacity, this._defOpacity];
  this._radialFill = new DvtLinearGradientFill(250, this._defColors, this._defAlphas);
  this._linearFill = new DvtLinearGradientFill(180, this._defColors, this._defAlphas);
  var borderOpacity = this.isVertical() ? 0 : 1;
  this._border = new DvtSolidStroke('#aadd77', borderOpacity);
};

/**
 * Retrieves the id of the timeline series associated with the timeline
 * @return {Array} an array of timeline series id
 */
DvtTimelineOverview.prototype.getSeriesIds = function()
{
  if (this._seriesIds == null)
    return null;

  return this._seriesIds.split(' ');
};

/**
 * Adds a label in time axis.
 * @param {number} pos The time position.
 * @param {string} text The label text.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 * @param {number} maxWidth The maximum label width.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 * @override
 */
DvtTimelineOverview.prototype.addLabel = function(pos, text, width, height, maxWidth, id)
{
  DvtTimelineOverview.superclass.addLabel.call(this, pos, text, width, height, maxWidth, id, this._labelStyle);
};

/***************************** common helper methods *********************************************/
DvtTimelineOverview.prototype.isItemSelectionEnabled = function()
{
  return (this._selectionMode != 'none');
};

DvtTimelineOverview.prototype.getDrawableById = function(id)
{
  // our list is flat
  var drawableId = '_mrk_' + id;
  var durationId = '_drn_' + id;

  var numChildren = this.getNumChildren();
  for (var childIndex = 0; childIndex < numChildren; childIndex++) {
    var drawable = this.getChildAt(childIndex);
    if (drawable != null && (drawableId == drawable.getId() || durationId == drawable.getId()))
      return drawable;
  }

  return null;
};

DvtTimelineOverview.prototype.getItemId = function(drawable)
{
  return drawable.getId().substr(5);
};

DvtTimelineOverview.prototype.getStyle = function(state, style)
{
  return this._borderStyles[state + style];
};

DvtTimelineOverview.prototype.getX = function(drawable)
{
  if (drawable._node != null)
    return drawable._node.getX();
  else
    return drawable.getMatrix().getTx();
};

DvtTimelineOverview.prototype.getY = function(drawable)
{
  if (drawable._node != null)
    return drawable._node.getY();
  else
    return drawable.getMatrix().getTy();
};

DvtTimelineOverview.prototype.getScaleX = function(node)
{
  var scaleX = node.getScaleX();
  if (scaleX == null)
  {
    // for vertical the scale factor is calculated by the available space take away border/padding, then divided that by the width of marker
    scaleX = this.isVertical() ? ((this.Width - this.getTimeAxisWidth() - 4) / 2) : 1;
  }
  return scaleX;
};

DvtTimelineOverview.prototype.getScaleY = function(node)
{
  var scaleY = node.getScaleY();
  if (scaleY == null)
    scaleY = 1;

  return scaleY;
};
/***************************** end common helper methods *********************************************/

/***************************** marker creation and event handling *********************************************/

DvtTimelineOverview.prototype.parseDataXML = function(width, height)
{
  DvtTimelineOverview.superclass.parseDataXML.call(this, width, height);

  if (this._markers == null)
    return;

  var start = this._start;
  var end = this._end;

  // find the optimal size of the marker
  var opt = this.calculateOptimalSize(start, end, width, height, this._markerSize);
  var durationMarkers = [];
  for (var j = 0; j < this._markers.length; j++)
  {
    var marker = this._markers[j];
    if (marker._endTime == null)
      this.addMarker(marker, opt);
    else
      durationMarkers[durationMarkers.length] = marker;
  }
  this.prepareDurations(durationMarkers);
  this.addDurations(durationMarkers);

  this._markerSize = opt;
};

DvtTimelineOverview.prototype.prepareDurations = function(durationMarkers)
{
  this._maxDurationY = 0;
  var markerSeries = null;
  if (this._durationColorMap == null)
    this._durationColorMap = new Object();

  for (var i = 0; i < durationMarkers.length; i++)
  {
    var marker = durationMarkers[i];
    var id = marker.getId();
    var sId = id.substring(id.indexOf(':') + 1, id.length);
    sId = sId.substring(0, sId.indexOf(':'));
    if (sId != markerSeries)
    {
      this._colorCount = 0;
      markerSeries = sId;
    }
    marker._durationLevel = this.calculateDurationY(marker, durationMarkers);
    if (marker._durationFillColor == null)
    {
      if (this._durationColorMap[id] == null)
      {
        this._durationColorMap[id] = this._colorCount;
        marker._durationFillColor = this._durationColors[this._colorCount];
        this._colorCount++;
        if (this._colorCount == this._durationColors.length)
          this._colorCount = 0;
      }
      else
        marker._durationFillColor = this._durationColors[this._durationColorMap[id]];
    }
  }
};

/**
 * @export
 */
DvtTimelineOverview.prototype.getDurationColorMap = function() {
  if (this._durationColorMap)
    return this._durationColorMap;
  else
    return null;
};

DvtTimelineOverview.prototype.calculateOptimalSize = function(start, end, width, height, size)
{
  var result = new Object();
  result.max = 1;
  result.arr = [];

  var canvasSize = this.isVertical() ? height : width;
  for (var i = 0; i < this._markers.length; i++)
  {
    var marker = this._markers[i];
    if (marker._endTime != null)
    {
      var x = DvtTimeUtils.getDatePosition(start, end, marker.getTime(), canvasSize);
      if (this.isHorizontalRTL())
        x = canvasSize - x;
      marker.setX(x);
      continue;
    }
    this.calculateSize(marker, start, end, canvasSize, size / 2, result, height);
    // if max > height, then we'll need to reduce the size of marker and recalculate, so just bail out
    if (result.max > height)
      break;
  }

  // minimum size is 1 (also to prevent infinite recursion)
  if (result.max > height && size > 1)
  {
    // adjusted the size and try again.  This could potentially be optimized if
    // the scaleX and scaleY of each marker are identical, then we could calculate
    // the size by determining the size of the stack and use that to calculate the
    // size
    return this.calculateOptimalSize(start, end, width, height, size - 1);
  }
  else
    return size;
};

DvtTimelineOverview.prototype.addMarker = function(node, sz)
{
  var itemId = '_mrk_' + node.getId();
  var color = node.getColor();
  var isGradient = node.isGradient();
  var opacity = node.getOpacity();
  if (opacity == null)
  {
    opacity = this._defOpacity;
    // if default opacity is zero but a custom color is specified, override the opacity to 1
    if (opacity == 0 && color != null)
      opacity = 1;
  }
  var scaleX = this.getScaleX(node);
  var scaleY = this.getScaleY(node);

  // draw the shapes
  var marker = node.getShape();

  if (this.isVertical())
  {
    marker = DvtSimpleMarker.RECTANGLE;
    var width = 2 * scaleX;
    var height = 2 * scaleY;
    var cx = node.getY() + (width / 2);
    var cy = node.getX() + (height / 2);
  }
  else
  {
    width = sz * scaleX;
    height = sz * scaleY;
    cx = node.getX() + (width / 2);
    cy = node.getY() + (height / 2);
  }
  var displayable = new DvtSimpleMarker(this.getCtx(), marker, null, cx, cy, width, height, null, itemId);

  // associate the node with the marker
  displayable._node = node;

  if (color == null && opacity == this._defOpacity && isGradient == null)
  {
    // use default fills
    if (marker == DvtSimpleMarker.CIRCLE)
      fill = this._radialFill;
    else
      fill = this._linearFill;

    stroke = this._border;
  }
  else
  {
    var colors = this._defColors;
    if (color != null)
    {
      if (DvtTimeUtils.supportsTouch())
        colors = [color];
      else
      {
        var lighter = DvtColorUtils.getPastel(color, 0.50);
        var darker = DvtColorUtils.getDarker(color, 0.50);
        colors = [lighter, color, darker];
      }
    }

    var alphas = [opacity, opacity, opacity];

    if (isGradient == null)
    {
      if (marker == DvtSimpleMarker.CIRCLE)
        var fill = new DvtLinearGradientFill(250, colors, alphas);
      else
        fill = new DvtLinearGradientFill(180, colors, alphas);
    }
    else
      fill = new DvtSolidFill(color, alphas[0]);

    var stroke = new DvtSolidStroke(color, opacity);
  }

  displayable.setFill(fill);
  displayable.setStroke(stroke);
  if (this.isItemSelectionEnabled())
    displayable.setSelectable(true);

  var count = this.getNumChildren();
  var lastChild = this.getChildAt(count - 1);
  if (count > this._lastChildIndex && (lastChild.getId() == 'tb' || lastChild.getId() == 'arr'))
    this.addChildAt(displayable, count - this._lastChildIndex); // insert right before the left handle
  else
    this.addChild(displayable);

  // associate the displayable with the node
  node.setDisplayable(displayable);
  this.applyState(displayable, DvtTimelineOverview.ENABLED_STATE);

  // Do not antialias markers if specified or vertical
  if ((this.isVertical() || marker == DvtSimpleMarker.RECTANGLE || marker == DvtSimpleMarker.DIAMOND || marker == DvtSimpleMarker.TRIANGLE_UP ||
      marker == DvtSimpleMarker.TRIANGLE_DOWN || marker == DvtSimpleMarker.PLUS) && this._defaultMarkerStyles.pixelHinting != 'false')
  {
    displayable.setPixelHinting(true);
  }

  return displayable;
};

DvtTimelineOverview.prototype.addDurations = function(durationMarkers)
{
  var context = this.getCtx();
  for (var i = this._maxDurationY; i > 0; i--)
  {
    for (var j = 0; j < durationMarkers.length; j++)
    {
      var node = durationMarkers[j];
      if (i == node._durationLevel)
      {
        var x = DvtTimeUtils.getDatePosition(this._start, this._end, node.getTime(), this.isVertical() ? this.Height : this.Width);
        var durationId = '_drn_' + node.getId();
        var durationY = 9 + 5 * node._durationLevel;
        var x2 = DvtTimeUtils.getDatePosition(this._start, this._end, node.getEndTime(), this.isVertical() ? this.Height : this.Width);
        if (this.isVertical())
        {
          if (this.isRTL())
            var duration = new DvtRect(context, 0, x, durationY, x2 - x, durationId);
          else
            duration = new DvtRect(context, this.Width - durationY, x, durationY, x2 - x, durationId);
        }
        else
        {
          if (this.isRTL())
            duration = new DvtRect(context, this.Width - x2, this.Height - durationY - 20, x2 - x, durationY, durationId);
          else
            duration = new DvtRect(context, x, this.Height - durationY - 20, x2 - x, durationY, durationId);
        }
        duration.setFill(new DvtSolidFill(node._durationFillColor));

        var feelerStroke = new DvtSolidStroke(this.getStyle(DvtTimelineOverview.ENABLED_STATE, DvtTimelineOverview.DURATION_BORDER_COLOR), 1, 1);
        duration.setStroke(feelerStroke);
        duration.setPixelHinting(true);

        duration._node = node;
        this.addChild(duration);

        node._durationBar = duration;
        node._durationY = durationY - 2;
      }
    }
  }
  // timeAxisTopBar needs to be rendered after the duration markers to cover the bottom border
  this.removeChild(this._timeAxisTopBar);
  this.addChild(this._timeAxisTopBar);
};

DvtTimelineOverview.prototype.calculateSize = function(node, start, end, size, hsz, result, maxHeight)
{
  var hszx = hsz * this.getScaleX(node) + this._markerSpacingOffset;
  var hszy = hsz * this.getScaleY(node) + this._markerSpacingOffset;

  var time = node.getTime();
  var isGradient = node.isGradient();
  var cx = DvtTimeUtils.getDatePosition(start, end, time, size);
  if (this.isHorizontalRTL())
    cx = size - cx - hszx * 2;

  // we only need to calculate y for the non-vertical case
  if (!this.isVertical())
  {
    var cy = 3;
    var maxy = 0;
    var counter = 0;
    // this used to set to 10, where if the cy gets updated we do the loop again until the threshold
    // is met or cy has not changed.
    // calculateY method has updated since and we have yet encountered a case where we need
    // to iterate again when cy has changed.
    var threshold = 1; // circuit breaker
    while (counter < threshold)
    {
      var obj = this.calculateY(result, node.getShape(), cx, cy, hszx, hszy, maxy, hsz, maxHeight);
      if (obj.cy == cy)
        counter = threshold;    // break

      // cy changed, we have to go over the array again with the new value
      // to see if there's new collision
      maxy = obj.maxy;
      cy = obj.cy;
      counter++;
    }
  }
  else
  {
    // for vertical timeline, marker is 4 px from the right edge of the overview
    var borderOffset = 0;
    var borderStyle = this.getStyle(DvtTimelineOverview.ENABLED_STATE, DvtTimelineOverview.BORDER_STYLE);
    if (borderStyle == 'solid')
      borderOffset = parseInt(this.getStyle(DvtTimelineOverview.ENABLED_STATE, DvtTimelineOverview.BORDER_WIDTH), 10);
    if (this.isRTL())
      cy = borderOffset + 4;
    else
      cy = this.Width - (this.getScaleX(node) * 2) - borderOffset - 4;
  }

  node.setX(cx);
  node.setY(cy);
  result.arr.push(node);

  if (maxy > result.max)
    result.max = maxy;
};

// result - info about current set of markers
// cx - x coord of the marker to be add
// cy - y coord of the marker to be add
// hszx - scale adjusted width of marker
// hszy - scale adjusted height of marker
// maxy - maximum y of all markers
DvtTimelineOverview.prototype.calculateY = function(result, shape, cx, cy, hszx, hszy, maxy, hsz, maxHeight)
{
  if (this.isOverviewAbove())
    cy = cy + this.getTimeAxisHeight();

  for (var i = 0; i < result.arr.length; i++)
  {
    var prevMarker = result.arr[i];
    var prevX = prevMarker.getX();
    var prevY = prevMarker.getY();

    var prevShape = prevMarker.getShape();
    var prevScaleX = this.getScaleX(prevMarker);
    var prevScaleY = this.getScaleY(prevMarker);

    // see if x intersects AND y intersects
    var xDist = Math.abs(cx - prevX);
    var minDist = hsz * prevScaleX + this._markerSpacingOffset + hszx;

    // if x does not intersect, skip to next marker
    if (xDist >= minDist)
      continue;

    var yDist = Math.abs(cy - prevY);
    // if the markers are both circles with consistent scaleX and scaleY values, use optimized spacing below
    if (shape == DvtSimpleMarker.CIRCLE && prevShape == DvtSimpleMarker.CIRCLE && hszx == hszy && prevScaleX == prevScaleY)
      var height = Math.sqrt((minDist * minDist) - (xDist * xDist));
    else
      height = hsz * prevScaleY + this._markerSpacingOffset + hszy;

    // if required height is greater than current value, update height
    if (height > yDist)
    {
      cy = prevY + height;
      maxy = Math.max(maxy, cy + height);

      // if maxy > maxHeight and not minimal size, then we'll need to reduce the size of marker and recalculate, so bail out
      if (hsz >= 1 && maxHeight != undefined && maxy > maxHeight)
        break;
    }
  }

  return {'cy': cy, 'maxy': maxy};
};

DvtTimelineOverview.prototype.calculateDurationY = function(item, durationMarkers)
{
  var index = durationMarkers.length;
  var initialY = 1;

  var startTime = item.getTime();
  var y = item._durationLevel;
  if (y == null)
    y = initialY;

  for (var i = 0; i < index; i++)
  {
    var currItem = durationMarkers[i];
    if (currItem != item)
    {
      var currEndTime = currItem.getEndTime();
      if (currEndTime == null)
        continue;

      var currStartTime = currItem.getTime();

      var curry = currItem._durationLevel;
      if (curry == null)
        curry = initialY;

      if (startTime >= currStartTime && startTime <= currEndTime && y == curry)
      {
        y = curry + 1;
        // y changed, do the loop again
        item._durationLevel = y;

        // calculate again from start since y changed and we might have a conflict again
        y = this.calculateDurationY(item, durationMarkers);
      }
    }
  }
  if (y > this._maxDurationY)
    this._maxDurationY = y;
  return y;
};


/************************** event handling *********************************************/
DvtTimelineOverview.prototype.HandleShapeMouseOver = function(event)
{
  // drawable will be null if it is handled by super
  var drawable = DvtTimelineOverview.superclass.HandleShapeMouseOver.call(this, event);
  if (drawable == null)
    return;

  if (drawable._node != null)
  {
    var tooltip = drawable._node.getDescription();
    if (tooltip != null)
    {
      // Show the tooltip
      this.getCtx().getTooltipManager().showDatatip(event.pageX, event.pageY, tooltip, '#000000');
    }

    if (this.isFlashEnvironment())
      this.setCursor('pointer');
  }

  // if selection is disabled in Timeline then return
  if (!this.isItemSelectionEnabled())
    return;

  var isSelected = false;

  // only remove stroke if it is not selected
  if (this._selectedMarkers != null)
  {
    for (var i = 0; i < this._selectedMarkers.length; i++)
    {
      // found it
      if (drawable == this._selectedMarkers[i])
      {
        isSelected = true;
        break;
      }
    }
  }

  // highlight the item also, make sure it's not selected
  if (!isSelected)
  {
    var itemId = this.getItemId(drawable);

    var evt = new DvtTimelineOverviewEvent(DvtTimelineOverviewEvent.SUBTYPE_HIGHLIGHT);
    evt.setItemId(itemId);

    // highlight the item in timeline series
    this.dispatchEvent(evt);

    // highlight the marker
    this.highlightMarker(drawable);
  }
};

DvtTimelineOverview.prototype.HandleShapeMouseOut = function(event)
{
  // drawable will be null if it is handled by super
  var drawable = DvtTimelineOverview.superclass.HandleShapeMouseOut.call(this, event);
  if (drawable == null)
    return;

  if (!this.isMovable(drawable))
  {
    // hide the tooltip
    this.getCtx().getTooltipManager().hideTooltip();

    var isSelected = false;

    // only remove stroke if it is not selected
    if (this._selectedMarkers != null)
    {
      for (var i = 0; i < this._selectedMarkers.length; i++)
      {
        // found it
        if (drawable == this._selectedMarkers[i])
        {
          isSelected = true;
          break;
        }
      }
    }

    if (!isSelected)
    {
      // unhighlight item also
      var itemId = this.getItemId(drawable);

      var evt = new DvtTimelineOverviewEvent(DvtTimelineOverviewEvent.SUBTYPE_UNHIGHLIGHT);
      evt.setItemId(itemId);

      // highlight the item in timeline series
      this.dispatchEvent(evt);

      // highlight the marker
      this.unhighlightMarker(drawable);
    }
  }
};

DvtTimelineOverview.prototype.HandleShapeClick = function(event, pageX, pageY)
{
  // drawable will be null if it is handled by super
  var drawable = DvtTimelineOverview.superclass.HandleShapeClick.call(this, event, pageX, pageY);
  if (drawable == null)
    return;

  // handle click on marker
  this.HandleMarkerClick(drawable, (event.ctrlKey || event.shiftKey || DvtAgent.isTouchDevice()));
};

DvtTimelineOverview.prototype.HandleMarkerClick = function(drawable, isMultiSelect)
{
  // if selection is disabled in Timeline then return
  if (!this.isItemSelectionEnabled())
    return;

  // selects the corresponding item
  this.selectItem(drawable, isMultiSelect);

  var time = drawable._node.getTime();
  if (time != null)
  {
    // scroll timeline
    var evt = new DvtTimelineOverviewEvent(DvtTimelineOverviewEvent.SUBTYPE_SCROLL_TIME);
    evt.setTime(time);
    this.dispatchEvent(evt);

    // scroll overview
    var slidingWindow = this.getSlidingWindow();
    var newPos;

    if (this.isVertical())
      newPos = this.getX(drawable) - slidingWindow.getHeight() / 2;
    else
      newPos = this.getX(drawable) - slidingWindow.getWidth() / 2;

    this.animateSlidingWindow(newPos);
  }
};

/************************** end event handling *********************************************/


/***************************** zoom (overview operation only) *********************************************/
DvtTimelineOverview.prototype.updateSlidingWindowForZoom = function(renderStart, start, end, width)
{
  // update time info from timeline peer
  this._start = start;
  this._end = end;
  this._width = width;
  this._renderStart = renderStart;

  var timelineSize = width;

  if (this.isVertical())
    var size = this.Height;
  else
    size = this.Width;

  // calcualte new left and width
  // first get the date using the width of timeline overview as position relative to the overall timeline
  var rangeStartTime = DvtTimeUtils.getPositionDate(start, end, 0, timelineSize);
  var rangeEndTime = DvtTimeUtils.getPositionDate(start, end, size, timelineSize);

  var rangeStartPos = DvtTimeUtils.getDatePosition(start, end, rangeStartTime, size);
  var rangeEndPos = DvtTimeUtils.getDatePosition(start, end, rangeEndTime, size);

  var renderStartPos = DvtTimeUtils.getDatePosition(start, end, renderStart, size);

  var newPos = renderStartPos;
  var newSize = Math.max(DvtOverview.MIN_WINDOW_SIZE, Math.min(size, rangeEndPos - rangeStartPos));
  if (newPos + newSize > size)
    newPos = Math.max(0, size - newSize);

  if (this.isHorizontalRTL())
    newPos = size - newSize - newPos;

  this.animateSlidingWindow(newPos, newSize);

  // update increment as well
  this._increment = this.calculateIncrement(size);
};
/************************** end zoom *********************************************/


/************************** marker highlight *********************************************/
DvtTimelineOverview.prototype.highlightItem = function(itemId)
{
  var drawable = this.getDrawableById(itemId);
  if (drawable != null)
    this.highlightMarker(drawable);
};

DvtTimelineOverview.prototype.unhighlightItem = function(itemId)
{
  var drawable = this.getDrawableById(itemId);
  if (drawable != null)
    this.unhighlightMarker(drawable);
};

DvtTimelineOverview.prototype.highlightMarker = function(drawable)
{
  if (this._selectedMarkers != null)
  {
    for (var i = 0; i < this._selectedMarkers.length; i++)
    {
      var marker = this._selectedMarkers[i];
      if (drawable == marker)
      {
        // selected, do nothing
        return;
      }
    }
  }
  // draw border
  this.applyState(drawable, DvtTimelineOverview.HOVER_STATE);
};

DvtTimelineOverview.prototype.unhighlightMarker = function(drawable)
{
  if (this._selectedMarkers != null)
  {
    for (var i = 0; i < this._selectedMarkers.length; i++)
    {
      var marker = this._selectedMarkers[i];
      if (drawable == marker)
      {
        // selected, do nothing
        return;
      }
    }
  }
  this.applyState(drawable, DvtTimelineOverview.ENABLED_STATE);
};
/************************** end marker highlight *****************************************/


/************************** marker selection *********************************************/
DvtTimelineOverview.prototype.selSelectItem = function(itemId)
{
  var drawable = this.getDrawableById(itemId);
  if (drawable != null)
    this.addSelectedMarker(drawable);
};

DvtTimelineOverview.prototype.selUnselectItem = function(itemId)
{
  var drawable = this.getDrawableById(itemId);
  if (drawable != null)
    this.removeSelectedMarker(drawable);
};

DvtTimelineOverview.prototype.selectItem = function(drawable, isMultiSelect)
{
  var itemId = this.getItemId(drawable);

  // scroll timeline
  var evt = new DvtTimelineOverviewEvent(DvtTimelineOverviewEvent.SUBTYPE_SELECTION);
  evt.setItemId(itemId);
  evt.setMultiSelect(isMultiSelect);
  this.dispatchEvent(evt);
};

DvtTimelineOverview.prototype.addSelectedMarker = function(drawable)
{
  if (this._selectedMarkers == null)
    this._selectedMarkers = [];

  var lastSelectedMarker = null;
  if (this._selectedMarkers.length > 0)
    lastSelectedMarker = this._selectedMarkers[this._selectedMarkers.length - 1];

  this._selectedMarkers.push(drawable);

  if (lastSelectedMarker != null)
    this.applyState(lastSelectedMarker, DvtTimelineOverview.SELECTED_STATE);

  this.applyState(drawable, DvtTimelineOverview.ACTIVE_SELECTED_STATE);
};

DvtTimelineOverview.prototype.removeSelectedMarker = function(drawable)
{
  if (this._selectedMarkers != null)
  {
    var index = -1;
    for (var i = 0; i < this._selectedMarkers.length; i++)
    {
      var marker = this._selectedMarkers[i];
      if (drawable == marker)
      {
        index = i;
        break;
      }
    }

    if (index != -1)
    {
      // remove effect from drawable
      this.applyState(drawable, DvtTimelineOverview.ENABLED_STATE);

      // fix the array
      this._selectedMarkers.splice(index, 1);
    }
  }
};

DvtTimelineOverview.prototype.removeAllSelectedMarkers = function()
{
  if (this._selectedMarkers != null)
  {
    for (var i = 0; i < this._selectedMarkers.length; i++)
    {
      var drawable = this._selectedMarkers[i];
      this.applyState(drawable, DvtTimelineOverview.ENABLED_STATE);
    }

    delete this._selectedMarkers;
    this._selectedMarkers = null;
  }
};

DvtTimelineOverview.prototype.applyState = function(drawable, state)
{
  if (!(drawable instanceof DvtSimpleMarker))
  {
    var id = drawable.getId();
    if (id && id.substring(0, 5) == '_drn_')
      this.applyDurationState(drawable, state);
    return;
  }

  var requiresBorderMarker = false;
  var requiresGlowMarker = false;

  var borderStyle = this.getStyle(state, DvtTimelineOverview.BORDER_STYLE);
  if (borderStyle == 'solid')
  {
    requiresBorderMarker = true;
    var borderColor = this.getStyle(state, DvtTimelineOverview.BORDER_COLOR);
    if (borderColor == null)
      borderColor = '#000000';
    var glowColor = this.getStyle(state, DvtTimelineOverview.GLOW_COLOR);
    if (glowColor != null && glowColor != 'none')
      requiresGlowMarker = true;
  }

  var borderMarker = drawable._borderMarker;
  var glowMarker = drawable._glowMarker;

  // Remove current border marker if necessary
  if (!requiresBorderMarker && borderMarker != null)
  {
    this.removeChild(borderMarker);
    drawable._borderMarker = null;
    if (glowMarker != null)
    {
      this.removeChild(glowMarker);
      drawable._glowMarker = null;
    }
  }
  else if (!requiresGlowMarker && glowMarker != null)
  {
    this.removeChild(glowMarker);
    drawable._glowMarker = null;
  }

  var markerType = drawable.getType();

  // Create or update border marker
  if (requiresBorderMarker)
  {
    var borderWidth = parseInt(this.getStyle(state, DvtTimelineOverview.BORDER_WIDTH), 10);
    var borderOffset = parseInt(this.getStyle(state, DvtTimelineOverview.BORDER_OFFSET), 10);

    if (borderMarker == null)
    {
      if (markerType == DvtSimpleMarker.CIRCLE)
      {
        if (this.isFlashEnvironment())
          borderOffset = 0;
        var width = (drawable.getDimensions().w + (borderOffset * 2)) * drawable.getScaleX();
        var height = (drawable.getDimensions().h + (borderOffset * 2)) * drawable.getScaleY();
        var cx = this.getX(drawable) - borderOffset + (width / 2);
        var cy = this.getY(drawable) - borderOffset + (height / 2);
      }
      else
      {
        if (this.isVertical())
        {
          width = (drawable.getDimensions().w + (borderWidth + 1)) * drawable.getScaleX();
          height = (drawable.getDimensions().h + (borderWidth + 1)) * drawable.getScaleY();
          cx = this.getY(drawable) - ((borderWidth + 1) / 2) + (width / 2);
          cy = this.getX(drawable) - ((borderWidth + 1) / 2) + (height / 2);
        }
        else
        {
          width = (drawable.getDimensions().w + (borderOffset * 2)) * drawable.getScaleX();
          height = (drawable.getDimensions().h + (borderOffset * 2)) * drawable.getScaleY();
          cx = this.getX(drawable) - borderOffset + (width / 2);
          cy = this.getY(drawable) - borderOffset + (height / 2);
        }
      }
      borderMarker = new DvtSimpleMarker(this.getCtx(), markerType, null, cx, cy, width, height, null, drawable.getId() + '_border');
      this.addChildAt(borderMarker, this.getChildIndex(drawable));
      drawable._borderMarker = borderMarker;
      borderMarker.setFill(this._markerBorderFill);
    }
    var stroke = new DvtSolidStroke(borderColor, this.getStyle(state, DvtTimelineOverview.BORDER_OPACITY), borderWidth);
    borderMarker.setStroke(stroke);

    // Do not antialias marker borders if specified or vertical
    if ((this.isVertical() || markerType == DvtSimpleMarker.RECTANGLE || markerType == DvtSimpleMarker.DIAMOND || markerType == DvtSimpleMarker.TRIANGLE_UP ||
             markerType == DvtSimpleMarker.TRIANGLE_DOWN || markerType == DvtSimpleMarker.PLUS) && this._defaultMarkerStyles.pixelHinting != 'false')
    {
      borderMarker.setPixelHinting(true);
    }

    if (requiresGlowMarker)
    {
      if (glowMarker == null)
      {
        var glowOffset = borderOffset - borderWidth;
        if (markerType == DvtSimpleMarker.CIRCLE)
        {
          if (this.isFlashEnvironment())
            glowOffset = 0;
          width = (drawable.getDimensions().w + (glowOffset * 2)) * drawable.getScaleX();
          height = (drawable.getDimensions().h + (glowOffset * 2)) * drawable.getScaleY();
          cx = this.getX(drawable) - glowOffset + (width / 2);
          cy = this.getY(drawable) - glowOffset + (height / 2);
        }
        else
        {
          if (this.isVertical())
          {
            width = (drawable.getDimensions().w + 3) * drawable.getScaleX();
            height = (drawable.getDimensions().h + 3) * drawable.getScaleY();
            cx = this.getY(drawable) + (width / 2);
            cy = this.getX(drawable) - 1 + (height / 2);
          }
          else
          {
            width = (drawable.getDimensions().w + (glowOffset * 2)) * drawable.getScaleX();
            height = (drawable.getDimensions().h + (glowOffset * 2)) * drawable.getScaleY();
            cx = this.getX(drawable) - glowOffset + (width / 2);
            cy = this.getY(drawable) - glowOffset + (height / 2);
          }
        }
        glowMarker = new DvtSimpleMarker(this.getCtx(), markerType, null, cx, cy, width, height, null, drawable.getId() + '_glow');
        this.addChildAt(glowMarker, this.getChildIndex(borderMarker));
        drawable._glowMarker = glowMarker;
        glowMarker.setFill(this._markerBorderFill);
      }
      var glowStroke = new DvtSolidStroke(glowColor, this.getStyle(state, DvtTimelineOverview.GLOW_OPACITY), 4);
      glowMarker.setStroke(glowStroke);

      // Do not antialias markers if specified or vertical
      if ((this.isVertical() || markerType == DvtSimpleMarker.RECTANGLE || markerType == DvtSimpleMarker.DIAMOND || markerType == DvtSimpleMarker.TRIANGLE_UP ||
          markerType == DvtSimpleMarker.TRIANGLE_DOWN || markerType == DvtSimpleMarker.PLUS) && this._defaultMarkerStyles.pixelHinting != 'false')
      {
        glowMarker.setPixelHinting(true);
      }
    }
  }
};

DvtTimelineOverview.prototype.applyDurationState = function(drawable, state)
{
  var borderColor = this.getStyle(state, DvtTimelineOverview.DURATION_BORDER_COLOR);
  if (borderColor == null)
    borderColor = '#000000';
  var width = parseInt(this.getStyle(state, DvtTimelineOverview.DURATION_BORDER_WIDTH), 10);
  drawable.setStroke(new DvtSolidStroke(borderColor, 1, width));
};


/************************** end marker selection *********************************************/
/************************** auto ppr events ****************************************************/
DvtTimelineOverview.prototype.orderInsert = function(newMarker)
{
  if (this._markers.length == 0)
    this._markers.push(newMarker);
  else
  {
    for (var i = this._markers.length - 1; i >= 0; i--)
    {
      var marker = this._markers[i];
      if (newMarker.getTime() > marker.getTime())
      {
        this._markers.splice(i + 1, 0, newMarker);
        break;
      }

      if (i == 0)
      {
        // if we ended up here it must be inserted to the front
        this._markers.splice(0, 0, newMarker);
      }
    }
  }
};

DvtTimelineOverview.prototype.handleAutoPPRInsert = function(xmlString)
{
  var parser = new DvtTimelineOverviewParser(this);
  var marker = parser.parseMarker(xmlString);

  // add new marker to list, insert in proper order
  this.orderInsert(marker);

  // draw the marker
  var start = this._start;
  var end = this._end;
  var width = this.Width;
  var height = this.Height;

  var opt = this.calculateOptimalSize(start, end, width, height, this._markerSize);
  if (marker._endTime == null)
    this.addMarker(marker, opt);
  else
  {
    var durationMarkers = [];
    durationMarkers[0] = marker;
    this.prepareDurations(durationMarkers);
    this.addDurations(durationMarkers);
  }
};

DvtTimelineOverview.prototype.handleAutoPPRDelete = function(rowKey)
{
  this.removeMarker(rowKey);
};

DvtTimelineOverview.prototype.handleAutoPPRUpdate = function(rowKey, xmlString)
{
  var markerInfo = this.findMarkerByRowKey(rowKey);
  if (markerInfo != null)
  {
    var marker = markerInfo.marker;
    var itemId = marker.getId();
    var drawable = this.getDrawableById(itemId);
    var selected = this.isMarkerSelected(drawable);

    this.removeMarker(rowKey);

    var parser = new DvtTimelineOverviewParser(this);
    var updatedMarker = parser.parseMarker(xmlString);

    // add new marker to list
    this.orderInsert(updatedMarker);

    // draw the marker
    var start = this._start;
    var end = this._end;
    var width = this.Width;
    var height = this.Height;

    var opt = this.calculateOptimalSize(start, end, width, height, this._markerSize);
    if (updatedMarker._endTime == null)
    {
      var newMarker = this.addMarker(updatedMarker, opt);
      // if it was selected before, select it after update
      if (selected)
        this.addSelectedMarker(newMarker);
    }
    else
    {
      var durationMarkers = [];
      durationMarkers[0] = marker;
      this.prepareDurations(durationMarkers);
      this.addDurations(durationMarkers);
    }
  }
};

DvtTimelineOverview.prototype.findMarkerByRowKey = function(rowKey)
{
  for (var i = 0; i < this._markers.length; i++)
  {
    var marker = this._markers[i];
    var currRowKey = marker.getRowKey();
    if (currRowKey == rowKey)
      return {index: i, marker: marker};
  }
  return null;
};

DvtTimelineOverview.prototype.removeMarker = function(rowKey)
{
  var markerInfo = this.findMarkerByRowKey(rowKey);
  if (markerInfo != null)
  {
    var marker = markerInfo.marker;
    // see if it's cached in the node
    if (marker.getDisplayable() != null)
      var drawable = marker.getDisplayable();
    else
    {
      var itemId = marker.getId();
      drawable = this.getDrawableById(itemId);
    }

    if (drawable != null)
    {
      // remove if selected
      this.removeSelectedMarker(drawable);
      // remove from children
      this.removeChild(drawable);
      // remove from array
      this._markers.splice(markerInfo.index, 1);

      // remove any associated border or glow markers
      var borderMarker = drawable._borderMarker;
      if (borderMarker != null)
        this.removeChild(borderMarker);
      var glowMarker = drawable._glowMarker;
      if (glowMarker != null)
        this.removeChild(glowMarker);
    }
  }

  return null;
};

DvtTimelineOverview.prototype.isMarkerSelected = function(drawable)
{
  if (this._selectedMarkers != null)
  {
    for (var i = 0; i < this._selectedMarkers.length; i++)
    {
      var marker = this._selectedMarkers[i];
      if (drawable == marker)
        return true;
    }
  }
  return false;
};
/************************** end auto ppr events *************************************************/


/************************** automation ***********************/
/**
 * @return {DvtTimelineOverviewAutomation} the automation object
 * @export
 */
DvtTimelineOverview.prototype.getAutomation = function()
{
  if (!this._Automation)
    this._Automation = new DvtTimelineOverviewAutomation(this);

  return this._Automation;
};

DvtTimelineOverview.prototype.getMarkers = function()
{
  return this._markers;
};
/**
 * TimelineOverview XML Parser
 * @param {DvtTimelineOverview} timelineOverview The owning timelineOverview component.
 * @class
 * @constructor
 * @extends {DvtObj}
 */
var DvtTimelineOverviewParser = function(timelineOverview) 
{
  this.Init(timelineOverview);
};

DvtObj.createSubclass(DvtTimelineOverviewParser, DvtObj, 'DvtTimelineOverviewParser');


/**
 * @param {DvtTimelineOverview} timelineOverview
 * @protected
 */
DvtTimelineOverviewParser.prototype.Init = function(overview) 
{
  this._view = overview;
  this._parser = new DvtXmlParser(overview.getCtx());
};


/**
 * Parses the specified XML String and returns the root node of the timelineOverview
 * @param {string} xmlString The String containing XML describing the component.
 * @return {object} An object containing the parsed properties
 */
DvtTimelineOverviewParser.prototype.parse = function(xmlString) 
{
  // Parse the XML string and get the root node
  var rootNode = this._parser.parse(xmlString);

  // Parse attributes on the top level node
  var ret = this.ParseRootAttributes(rootNode);

  var childNodes = rootNode.getChildNodes();

  var timeAxisNode = childNodes[0];
  ret.timeAxisInfo = this._parseTimeAxis(timeAxisNode);

  var markerNode = childNodes[1];
  ret.markers = this._parseDataNode(markerNode, ret.defaultMarkerStyles);

  // Parse formatted time ranges if exist
  if (childNodes.length > 2)
    ret.formattedTimeRanges = this._parseFormattedTimeRanges(childNodes[2]);

  return ret;
};

// parse a single marker xml (autoppr insert/update)
DvtTimelineOverviewParser.prototype.parseMarker = function(xmlString)
{
  var markerNode = this._parser.parse(xmlString);
  var props = this.ParseNodeAttributes(markerNode, this._view._defaultMarkerStyles);

  var treeNode = new DvtTimelineOverviewNode(this._view, props);
  return treeNode;
};


/**
 * Parses the attributes on the root node.
 * @param {DvtXmlNode} xmlNode The xml node defining the root
 * @return {object} An object containing the parsed properties
 * @protected
 */
DvtTimelineOverviewParser.prototype.ParseRootAttributes = function(xmlNode) 
{
  // The object that will be populated with parsed values and returned
  var ret = new Object();

  ret.start = parseInt(xmlNode.getAttr('start'));
  ret.end = parseInt(xmlNode.getAttr('end'));
  ret.width = parseInt(xmlNode.getAttr('width'));
  ret.renderStart = parseInt(xmlNode.getAttr('renstart'));
  ret.currentTime = parseInt(xmlNode.getAttr('ocd'));

  ret.orientation = xmlNode.getAttr('orn');
  ret.overviewPosition = xmlNode.getAttr('ovp');
  ret.selectionMode = xmlNode.getAttr('selmode');
  ret.isRtl = xmlNode.getAttr('rtl');

  ret.borderTopStyle = xmlNode.getAttr('_bts');
  ret.borderTopColor = xmlNode.getAttr('_btc');

  ret.seriesIds = xmlNode.getAttr('sid');
  ret.animationOnClick = xmlNode.getAttr('_aoc');

  var defaultMarkerStyles = new Object();
  defaultMarkerStyles.shape = xmlNode.getAttr('_ds');
  defaultMarkerStyles.scaleX = xmlNode.getAttr('_dsx');
  defaultMarkerStyles.scaleY = xmlNode.getAttr('_dsy');
  defaultMarkerStyles.opacity = xmlNode.getAttr('_do');
  defaultMarkerStyles.color = xmlNode.getAttr('_fc');
  defaultMarkerStyles.pixelHinting = xmlNode.getAttr('_ph');
  ret.defaultMarkerStyles = defaultMarkerStyles;

  ret.handleFillColor = xmlNode.getAttr('_hfc');
  ret.handleTextureColor = xmlNode.getAttr('_htc');
  ret.handleBackgroundImage = xmlNode.getAttr('_hbi');
  ret.handleWidth = xmlNode.getAttr('_hw');
  ret.handleHeight = xmlNode.getAttr('_hh');
  ret.windowBackgroundColor = xmlNode.getAttr('_wbc');
  ret.windowBorderTopStyle = xmlNode.getAttr('_wbts');
  ret.windowBorderRightStyle = xmlNode.getAttr('_wbrs');
  ret.windowBorderBottomStyle = xmlNode.getAttr('_wbbs');
  ret.windowBorderLeftStyle = xmlNode.getAttr('_wbls');
  ret.windowBorderTopColor = xmlNode.getAttr('_wbtc');
  ret.windowBorderRightColor = xmlNode.getAttr('_wbrc');
  ret.windowBorderBottomColor = xmlNode.getAttr('_wbbc');
  ret.windowBorderLeftColor = xmlNode.getAttr('_wblc');

  ret.overviewBackgroundColor = xmlNode.getAttr('_obc');
  ret.currentTimeIndicatorColor = xmlNode.getAttr('_ctic');
  ret.timeIndicatorColor = xmlNode.getAttr('_tic');
  ret.timeAxisBarColor = xmlNode.getAttr('_tabc');
  ret.timeAxisBarOpacity = xmlNode.getAttr('_tabo');

  ret.labelStyle = xmlNode.getAttr('_ls');

  // parse border styles
  var borderStyles = new Object();
  borderStyles['_bs'] = xmlNode.getAttr('_bs');
  borderStyles['_bc'] = xmlNode.getAttr('_bc');
  borderStyles['_bw'] = xmlNode.getAttr('_bw');
  borderStyles['_bof'] = xmlNode.getAttr('_bof');
  borderStyles['_bo'] = xmlNode.getAttr('_bo');
  borderStyles['_gc'] = xmlNode.getAttr('_gc');
  borderStyles['_go'] = xmlNode.getAttr('_go');
  borderStyles['_dbs'] = xmlNode.getAttr('_dbs');
  borderStyles['_dbc'] = xmlNode.getAttr('_dbc');
  borderStyles['_dbw'] = xmlNode.getAttr('_dbw');

  borderStyles['_hbs'] = xmlNode.getAttr('_hbs');
  borderStyles['_hbc'] = xmlNode.getAttr('_hbc');
  borderStyles['_hbw'] = xmlNode.getAttr('_hbw');
  borderStyles['_hbof'] = xmlNode.getAttr('_hbof');
  borderStyles['_hbo'] = xmlNode.getAttr('_hbo');
  borderStyles['_hgc'] = xmlNode.getAttr('_hgc');
  borderStyles['_hgo'] = xmlNode.getAttr('_hgo');
  borderStyles['_hdbs'] = xmlNode.getAttr('_hdbs');
  borderStyles['_hdbc'] = xmlNode.getAttr('_hdbc');
  borderStyles['_hdbw'] = xmlNode.getAttr('_hdbw');

  borderStyles['_sbs'] = xmlNode.getAttr('_sbs');
  borderStyles['_sbc'] = xmlNode.getAttr('_sbc');
  borderStyles['_sbw'] = xmlNode.getAttr('_sbw');
  borderStyles['_sbof'] = xmlNode.getAttr('_sbof');
  borderStyles['_sbo'] = xmlNode.getAttr('_sbo');
  borderStyles['_sgc'] = xmlNode.getAttr('_sgc');
  borderStyles['_sgo'] = xmlNode.getAttr('_sgo');
  borderStyles['_sdbs'] = xmlNode.getAttr('_sdbs');
  borderStyles['_sdbc'] = xmlNode.getAttr('_sdbc');
  borderStyles['_sdbw'] = xmlNode.getAttr('_sdbw');

  borderStyles['_asbs'] = xmlNode.getAttr('_asbs');
  borderStyles['_asbc'] = xmlNode.getAttr('_asbc');
  borderStyles['_asbw'] = xmlNode.getAttr('_asbw');
  borderStyles['_asbof'] = xmlNode.getAttr('_asbof');
  borderStyles['_asbo'] = xmlNode.getAttr('_asbo');
  borderStyles['_asgc'] = xmlNode.getAttr('_asgc');
  borderStyles['_asgo'] = xmlNode.getAttr('_asgo');
  borderStyles['_asdbs'] = xmlNode.getAttr('_asdbs');
  borderStyles['_asdbc'] = xmlNode.getAttr('_asdbc');
  borderStyles['_asdbw'] = xmlNode.getAttr('_asdbw');

  ret.borderStyles = borderStyles;

  return ret;
};


/**
 * Recursively parses the XML nodes, creating tree component nodes.
 * @param {DvtXmlNode} xmlNode The XML node to parse.
 * @return {DvtBaseTreeNode} The resulting tree component node.
 * @private
 */
DvtTimelineOverviewParser.prototype._parseDataNode = function(xmlNode, defaultMarkerStyles)
{
  if (!xmlNode)
    return null;

  var treeNodes = new Array();

  var markers = xmlNode.getChildNodes();
  for (var i = 0; i < markers.length; i++)
  {
    // Parse the attributes and create the node
    var props = this.ParseNodeAttributes(markers[i], defaultMarkerStyles);
    var treeNode = new DvtTimelineOverviewNode(this._view, props);

    treeNodes.push(treeNode);
  }

  return treeNodes;
};


/**
 * Parses the attributes on a tree node.
 * @param {DvtXmlNode} xmlNode The xml node defining the tree node
 * @return {object} An object containing the parsed properties
 * @protected
 */
DvtTimelineOverviewParser.prototype.ParseNodeAttributes = function(xmlNode, defaultMarkerStyles)
{
  // The object that will be populated with parsed values and returned
  var ret = new Object();

  var useSkinningDefaults = (xmlNode.getAttr('_sd') == 'true');

  // Parse this node's properties
  ret.id = xmlNode.getAttr('tid');
  ret.rowKey = xmlNode.getAttr('rk');
  ret.time = xmlNode.getAttr('t');
  ret.endTime = xmlNode.getAttr('et');
  ret.shape = xmlNode.getAttr('s');
  if (useSkinningDefaults && ret.shape == null)
    ret.shape = defaultMarkerStyles.shape;
  ret.desc = xmlNode.getAttr('d');
  ret.color = xmlNode.getAttr('c');
  ret.durationFillColor = xmlNode.getAttr('dfc');
  if (useSkinningDefaults && ret.color == null)
    ret.color = defaultMarkerStyles.color;
  ret.scaleX = xmlNode.getAttr('sx');
  if (useSkinningDefaults && ret.scaleX == null)
    ret.scaleX = defaultMarkerStyles.scaleX;
  ret.scaleY = xmlNode.getAttr('sy');
  if (useSkinningDefaults && ret.scaleY == null)
    ret.scaleY = defaultMarkerStyles.scaleY;
  ret.gradient = xmlNode.getAttr('g');
  ret.opacity = xmlNode.getAttr('o');
  if (useSkinningDefaults && ret.opacity == null)
    ret.opacity = defaultMarkerStyles.opacity;

  return ret;
};

DvtTimelineOverviewParser.prototype._parseTimeAxis = function(xmlNode) 
{
  if (!xmlNode)
    return null;

  var ret = new Object();
  ret.width = xmlNode.getAttr('width');
  ret.height = xmlNode.getAttr('height');
  ret.ticks = xmlNode.getChildNodes();

  return ret;
};

DvtTimelineOverviewParser.prototype._parseFormattedTimeRanges = function(xmlNode) 
{
  if (!xmlNode)
    return null;

  return xmlNode.getChildNodes();
};
/**
 * Class representing a timelineOverview node.
 * @param {DvtTimelineOverview} timelineOverview The owning timelineOverview component.
 * @param {object} props The properties for the node.
 * @class
 * @constructor
 */
var DvtTimelineOverviewNode = function(overview, props) 
{
  this.Init(overview, props);
};

DvtObj.createSubclass(DvtTimelineOverviewNode, DvtObj, 'DvtTimelineOverviewNode');


/**
 * @param {DvtTimelineOverview} overview The DvtTimelineOverview that owns this node.
 * @param {object} props The properties for the node.
 * @protected
 */
DvtTimelineOverviewNode.prototype.Init = function(overview, props) 
{
  this._view = overview;

  this._rowKey = props.rowKey;
  this._id = props.id;
  this._time = parseInt(props.time);
  this._endTime = props.endTime == null ? null : parseInt(props.endTime);

  this._shape = DvtSimpleMarker.CIRCLE;
  if (props.shape == 'square')
    this._shape = DvtSimpleMarker.RECTANGLE;
  else if (props.shape == 'plus')
    this._shape = DvtSimpleMarker.PLUS;
  else if (props.shape == 'diamond')
    this._shape = DvtSimpleMarker.DIAMOND;
  else if (props.shape == 'triangleUp')
    this._shape = DvtSimpleMarker.TRIANGLE_UP;
  else if (props.shape == 'triangleDown')
    this._shape = DvtSimpleMarker.TRIANGLE_DOWN;

  this._desc = props.desc;
  this._color = props.color;
  this._gradient = props.gradient;
  if (props.opacity != null)
    this._opacity = parseFloat(props.opacity);
  if (props.scaleX != null)
    this._scaleX = parseFloat(props.scaleX);
  if (props.scaleY != null)
    this._scaleY = parseFloat(props.scaleY);
  if (props.durationFillColor != null)
    this._durationFillColor = props.durationFillColor;
};

DvtTimelineOverviewNode.prototype.getId = function()
{
  return this._id;
};

DvtTimelineOverviewNode.prototype.getRowKey = function()
{
  return this._rowKey;
};

DvtTimelineOverviewNode.prototype.getTime = function()
{
  return this._time;
};

DvtTimelineOverviewNode.prototype.getEndTime = function()
{
  return this._endTime;
};

DvtTimelineOverviewNode.prototype.getScaleX = function()
{
  return this._scaleX;
};

DvtTimelineOverviewNode.prototype.getScaleY = function()
{
  return this._scaleY;
};

DvtTimelineOverviewNode.prototype.getDescription = function()
{
  return this._desc;
};

DvtTimelineOverviewNode.prototype.getColor = function()
{
  return this._color;
};

DvtTimelineOverviewNode.prototype.isGradient = function()
{
  return this._gradient;
};

DvtTimelineOverviewNode.prototype.getShape = function()
{
  return this._shape;
};

DvtTimelineOverviewNode.prototype.getOpacity = function()
{
  return this._opacity;
};

DvtTimelineOverviewNode.prototype.getDisplayable = function()
{
  return this._displayable;
};

DvtTimelineOverviewNode.prototype.setDisplayable = function(displayable)
{
  this._displayable = displayable;
};

DvtTimelineOverviewNode.prototype.getX = function()
{
  return this._x;
};

DvtTimelineOverviewNode.prototype.setX = function(x)
{
  this._x = x;
};

DvtTimelineOverviewNode.prototype.getY = function()
{
  return this._y;
};

DvtTimelineOverviewNode.prototype.setY = function(y)
{
  this._y = y;
};
/**
 * Encapsulates an event fired by TimlineOverview
 * @param {string} type The type of event fired by TimelineOverview
 * @class
 * @constructor
 */
var DvtTimelineOverviewEvent = function(type) {
  this.Init(DvtTimelineOverviewEvent.TYPE);
  this._subtype = type;
};

DvtObj.createSubclass(DvtTimelineOverviewEvent, DvtOverviewEvent, 'DvtTimelineOverviewEvent');

DvtTimelineOverviewEvent.TYPE = 'timeline';

DvtTimelineOverviewEvent.SUBTYPE_HIGHLIGHT = 'highlight';
DvtTimelineOverviewEvent.SUBTYPE_UNHIGHLIGHT = 'unhighlight';
DvtTimelineOverviewEvent.SUBTYPE_SELECTION = 'selection';

DvtTimelineOverviewEvent.SUBTYPE_SCROLL_TIME = DvtOverviewEvent.SUBTYPE_SCROLL_TIME;
DvtTimelineOverviewEvent.SUBTYPE_SCROLL_POS = DvtOverviewEvent.SUBTYPE_SCROLL_POS;
DvtTimelineOverviewEvent.SUBTYPE_RANGECHANGE = DvtOverviewEvent.SUBTYPE_RANGECHANGE;
DvtTimelineOverviewEvent.SUBTYPE_RANGECHANGING = 'rangeChanging';
DvtTimelineOverviewEvent.SUBTYPE_DROPCALLBACK = DvtOverviewEvent.SUBTYPE_PRE_RANGECHANGE;

// keys to look up value
DvtTimelineOverviewEvent.ITEM_ID_KEY = 'itemId';
DvtTimelineOverviewEvent.MULTI_SELECT_KEY = 'multiSelect';

DvtTimelineOverviewEvent.START_POS = DvtOverviewEvent.START_POS;
DvtTimelineOverviewEvent.END_POS = DvtOverviewEvent.END_POS;


/***** highlight and unhighlight *********/
DvtTimelineOverviewEvent.prototype.setItemId = function(itemId) 
{
  this.addParam(DvtTimelineOverviewEvent.ITEM_ID_KEY, itemId);
};

DvtTimelineOverviewEvent.prototype.getItemId = function() 
{
  return this.getParamValue(DvtTimelineOverviewEvent.ITEM_ID_KEY);
};


/****** selection **************/
DvtTimelineOverviewEvent.prototype.setMultiSelect = function(isMultiSelect) 
{
  this.addParam(DvtTimelineOverviewEvent.MULTI_SELECT_KEY, isMultiSelect);
};

DvtTimelineOverviewEvent.prototype.isMultiSelect = function() 
{
  var isMultiSelect = this.getParamValue(DvtTimelineOverviewEvent.MULTI_SELECT_KEY);
  if (isMultiSelect != null)
    return isMultiSelect;

  return false;
};
// Copyright (c) 2012, 2016, Oracle and/or its affiliates. All rights reserved.
/*---------------------------------------------------------------------*/
/*  DvtTimelineOverviewAutomation                                      */
/*---------------------------------------------------------------------*/
/**
  *  Provides automation services for timeline.
  *  @class  DvtTimelineOverviewAutomation
  *  @extends {DvtObj}
  *  @param {DvtTimelineOverview} overview
  *  @constructor
  *
  */
var DvtTimelineOverviewAutomation = function(overview)
{
  this._Init(overview);
};

DvtObj.createSubclass(DvtTimelineOverviewAutomation, DvtAutomation, 'DvtTimelineOverviewAutomation');

DvtTimelineOverviewAutomation.prototype._Init = function(overview)
{
  this._overview = overview;
};

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
DvtTimelineOverviewAutomation.prototype.GetSubIdForDomElement = function(displayable)
{
  var id = displayable.getId();
  if (displayable instanceof DvtSimpleMarker)
  {
    var arr = id.split(':');
    if (arr.length != 4)
      return null;

    var seriesIds = this._overview.getSeriesIds();
    if (seriesIds != null)
    {
      var seriesIndex = DvtArrayUtils.getIndex(seriesIds, arr[1]);
      if (seriesIndex > -1)
        return 'marker[' + seriesIndex + '][' + arr[2] + ']';
    }
  }
  else if (id == 'window')
  {
    return DvtTimelineOverviewAutomation.WINDOW_ID;
  }
  else if (id == 'lh' || id == 'lhb' || id == 'lbgrh')
  {
    return DvtTimelineOverviewAutomation.START_HANDLE_ID;
  }
  else if (id == 'rh' || id == 'rhb' || id == 'rbgrh')
  {
    return DvtTimelineOverviewAutomation.END_HANDLE_ID;
  }
  else if (id == 'grpy')
  {
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
 * @export
 */
DvtTimelineOverviewAutomation.prototype.getDomElementForSubId = function(subId)
{
  var subIdArray = DvtTimelineOverviewAutomation._convertSubIdToArray(subId);
  if (subIdArray && subIdArray.length == 3 && subIdArray[0] == DvtTimelineOverviewAutomation.NODE_ID_PREFIX)
  {
    var seriesIds = this._overview.getSeriesIds();
    if (seriesIds != null)
    {
      var index = parseInt(subIdArray[1], 10);
      if (index > -1 && index < seriesIds.length)
      {
        var marker = DvtTimelineOverviewAutomation._findMarker(this._overview.getMarkers(), seriesIds[index], subIdArray[2]);
        return marker ? marker.getDisplayable().getElem() : null;
      }
    }
  }
  else if (subId == DvtTimelineOverviewAutomation.WINDOW_ID)
  {
    return this._overview.getSlidingWindow().getElem();
  }
  else if (subId == DvtTimelineOverviewAutomation.START_HANDLE_ID)
  {
    return this._overview.getLeftHandle().getElem();
  }
  else if (subId == DvtTimelineOverviewAutomation.END_HANDLE_ID)
  {
    return this._overview.getRightHandle().getElem();
  }

  return null;
};

DvtTimelineOverviewAutomation.prototype.click = function(subId)
{
  this.processSubId(subId, DvtTimelineOverviewAutomation.AUTOMATION_MOUSE_CLICK);
};

DvtTimelineOverviewAutomation.prototype.processSubId = function(subId, event)
{
  if (event === undefined)
    event = DvtTimelineOverviewAutomation.AUTOMATION_NO_EVENT;

  if (subId == null)
    return;

  var bIsEvent = (event != DvtTimelineOverviewAutomation.AUTOMATION_NO_EVENT);

  if (bIsEvent) {
    if (event == DvtTimelineOverviewAutomation.AUTOMATION_MOUSE_CLICK) {
      var subIdArray = DvtTimelineOverviewAutomation._convertSubIdToArray(subId);
      if (subIdArray && subIdArray.length == 3 && subIdArray[0] == DvtTimelineOverviewAutomation.NODE_ID_PREFIX) {
        var foundMarker = DvtTimelineOverviewAutomation._findMarker(this._overview.getMarkers(), subIdArray[1], subIdArray[2]);
        if (foundMarker)
          this._overview.HandleMarkerClick(foundMarker.getDisplayable(), false);
      }
    }
  }
};

DvtTimelineOverviewAutomation._convertSubIdToArray = function(subId)
{
  var array = subId.split('\[');

  var len = array.length;

  for (var i = 1; i < len; i++)
  {
    var elem = array[i];
    var tempId = elem.substr(0, elem.length - 1);   // remove trailing "]"
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
 * @return {DvtSimpleMarker} the marker matching the criteria.
 * @private
 */
DvtTimelineOverviewAutomation._findMarker = function(markers, seriesId, index) {
  var timelineId = 'tl1';
  var markerId = timelineId + ':' + seriesId + ':' + index + ':';
  for (var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    var id = marker.getId();
    if (id != null && id.indexOf(markerId) == 0)
      return marker;
  }

  return null;
};

  return D;
});