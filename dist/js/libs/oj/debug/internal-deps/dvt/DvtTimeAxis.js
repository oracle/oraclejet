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
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/**
 * TimeAxis component. Use the newInstance function to instantiate.
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @class
 * @constructor
 * @extends {dvt.BaseComponent}
 */
dvt.TimeAxis = function(context, callback, callbackObj)
{
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.TimeAxis, dvt.BaseComponent);

/**
 * The string representing vertical orientation.
 * @const
 */
dvt.TimeAxis.ORIENTATION_VERTICAL = 'vertical';

/**
 * Returns true if rendering on a touch device.
 * @return {boolean}
 */
dvt.TimeAxis.supportsTouch = function()
{
  return dvt.Agent.isTouchDevice();
};

/**
 * Converts time to position given time range and width of the range
 * @param {number} startTime The start time in millis
 * @param {number} endTime The end time in millis
 * @param {number} time The time in question
 * @param {number} width The width of the time range
 * @return {number} The position relative to the width of the element
 */
dvt.TimeAxis.getDatePosition = function(startTime, endTime, time, width)
{
  var number = (time - startTime) * width;
  var denominator = (endTime - startTime);
  if (number == 0 || denominator == 0)
    return 0;

  return number / denominator;
};

/**
 * Converts position to time given the time range and width of the range
 * @param {number} startTime The start time in millis
 * @param {number} endTime The end time in millis
 * @param {number} pos The position in question
 * @param {number} width The width of the time range
 * @return {number} time in millis
 */
dvt.TimeAxis.getPositionDate = function(startTime, endTime, pos, width)
{
  var number = pos * (endTime - startTime);
  if (number == 0 || width == 0)
    return startTime;

  return (number / width) + startTime;
};


/**
 * Returns a new instance of dvt.TimeAxis.
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @return {dvt.TimeAxis}
 */
dvt.TimeAxis.newInstance = function(context, callback, callbackObj)
{
  return new dvt.TimeAxis(context, callback, callbackObj);
};

/**
 * Attribute for valid scales.
 * @const
 * @private
 */
dvt.TimeAxis._VALID_SCALES = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years'];

/**
 * Initializes the component.
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @protected
 */
dvt.TimeAxis.prototype.Init = function(context, callback, callbackObj)
{
  dvt.TimeAxis.superclass.Init.call(this, context, callback, callbackObj);

  this._calendar = new DvtTimeAxisCalendar();
  this._borderWidth = DvtTimeAxisStyleUtils.DEFAULT_BORDER_WIDTH;
  this.setBorderVisibility(false, false, false, false);
  this._dateToIsoWithTimeZoneConverter = context.getLocaleHelpers()['dateToIsoWithTimeZoneConverter'];

  // Internationalization strings
  this._dateFormatStrings = {
    dayNames: context.LocaleData.getDayNames('abbreviated').concat(context.LocaleData.getDayNames('wide')),
    monthNames: context.LocaleData.getMonthNames('abbreviated').concat(context.LocaleData.getMonthNames('wide'))
  };

  // Create the defaults object
  this.Defaults = new DvtTimeAxisDefaults(context);
};

/**
 * @override
 */
dvt.TimeAxis.prototype.SetOptions = function(options)
{
  // Combine the user options with the defaults and store
  this.Options = this.Defaults.calcOptions(options);
};

/**
 * Parses options object.
 * @param {object} options The object containing specifications and data for this component.
 * @return {object} properties object.
 */
dvt.TimeAxis.prototype.Parse = function(options)
{
  this._parser = new DvtTimeAxisParser();
  return this._parser.parse(options);
};

/**
 * Applies the specified properties on the component.
 * @param {object} props The properties object
 * @private
 */
dvt.TimeAxis.prototype._applyParsedProperties = function(props)
{
  var orientation = props.orientation;
  if (orientation && orientation == dvt.TimeAxis.ORIENTATION_VERTICAL)
    this._isVertical = true;
  else
    this._isVertical = false;

  this.setIsVertical(this._isVertical);

  this._shortDesc = props.shortDesc;

  // TODO: update zoom implementation to handle longest value first
  // for now, just reverse order to ensure no regressions
  this._zoomOrder = props.zoomOrder ? props.zoomOrder.reverse() : [props.scale]; // else no zooming. set zoom order to only have 1 scale.

  this._timeZoneOffsets = props.timeZoneOffsets;
  this._customTimeScales = props.customTimeScales;
  this._customFormatScales = props.customFormatScales;

  this._start = props.start;
  this._end = props.end;

  this._inlineStyle = props.inlineStyle;

  this._scale = props.scale;
  this._converter = props.converter;

  this.applyStyleValues();
};

/**
 * Gets the date translation strings.
 * @return {object}
 */
dvt.TimeAxis.prototype.getDateFormatStrings = function()
{
  return this._dateFormatStrings;
};

/**
 * Returns the overall length of the content.
 * @return {number} The overall length of the content.
 */
dvt.TimeAxis.prototype.getContentLength = function()
{
  return this._contentLength;
};

/**
 * Sets the length of the content.
 * @param {number} length The new content length
 * @param {number=} minLength The minimum content length
 */
dvt.TimeAxis.prototype.setContentLength = function(length, minLength)
{
  if (typeof minLength === 'undefined' || minLength === null)
    minLength = this._canvasLength;
  if (minLength < length)
    this._contentLength = length;
  else
    this._contentLength = minLength;
};

/**
 * Gets axis length as used in renderer.
 * @return {number} The axis length.
 */
dvt.TimeAxis.prototype.getAxisLength = function()
{
  return this._axisLength;
};

/**
 * Returns whether in RTL mode
 * @return {boolean}
 */
dvt.TimeAxis.prototype.isRTL = function()
{
  return dvt.Agent.isRightToLeft(this.getCtx());
};

/**
 * Returns whether in vertical orientation
 * @return {boolean} true if vertical orientation, false if horizontal
 */
dvt.TimeAxis.prototype.isVertical = function()
{
  return this._isVertical;
};

/**
 * Renders the component with the specified data.  If no data is supplied to a component
 * that has already been rendered, the component will be rerendered to the specified size.
 * @param {object} options The object containing specifications and data for this component.
 * @param {number} width The width of the component.
 * @param {number} height The height of the component.
 */
dvt.TimeAxis.prototype.render = function(options, width, height)
{
  if (options) // if initial render or rerender with new options
  {
    this.Width = width;
    this.Height = height;
    this._prepareCanvasViewport();
    this.getPreferredLength(options, this._canvasLength);
  }
  this._handleResize(width, height); // else just resize already rendered axis

  // Done rendering...fire the ready event.
  this.RenderComplete();
};

/**
 * Returns the preferred content/axis length given the minimum viewport length (canvas width if
 * horizontal, canvas height if vertical).
 * @param {object} options The object containing specifications and data for this component.
 * @param {number} minViewPortLength The minimum viewport length.
 * @return {number} The suggested TimeAxis length.
 */
dvt.TimeAxis.prototype.getPreferredLength = function(options, minViewPortLength)
{
  // ensure options is updated
  this.SetOptions(options);

  this._resources = this.Options['_resources'];
  if (this._resources == null)
    this._resources = [];

  this._locale = this.Options['_locale'] ? this.Options['_locale'] : 'en-US';

  var firstDayOfWeek = this._resources['firstDayOfWeek'];
  if (firstDayOfWeek == null)
    firstDayOfWeek = 0; // default to sunday
  this._calendar.setFirstDayOfWeek(firstDayOfWeek);

  if (!this._dateToIsoWithTimeZoneConverter)
    this._dateToIsoWithTimeZoneConverter = this.getCtx().getLocaleHelpers()['dateToIsoWithTimeZoneConverter'];

  var props = this.Parse(this.Options);
  this._applyParsedProperties(props);

  if (this.hasValidOptions())
  {
    this.prepareTimeAxisZoomLevelIntervals(this._start, this._end, minViewPortLength);
  }

  return this._contentLength;
};

/**
 * Helper method to decide whether or not the options are valid.
 * @return {boolean} Whether this timeAxis has valid options.
 */
dvt.TimeAxis.prototype.hasValidOptions = function()
{
  var hasValidScale = this._scale && dvt.TimeAxis._VALID_SCALES.indexOf(this._scale) != -1;
  var hasValidCustomScale = this._scale && this._customTimeScales && this._customTimeScales[this._scale];
  var hasValidStartAndEnd = this._start && this._end && (this._end > this._start);

  return (hasValidScale || hasValidCustomScale) && hasValidStartAndEnd;
};

/**
 * @override
 */
dvt.TimeAxis.prototype.GetComponentDescription = function()
{
  if (this._shortDesc)
    return this._shortDesc;
  else
    return this.Options.translations.componentName;
};

/**
 * Applies style on the axis.
 */
dvt.TimeAxis.prototype.applyStyleValues = function()
{
  this._axisStyle = new dvt.CSSStyle(DvtTimeAxisStyleUtils.getAxisStyle(this.Options));
  this._axisStyle.parseInlineStyle(this._inlineStyle);

  // double border width to account for stroke width rendering
  var axisBorderWidth = this._axisStyle.getBorderWidth();
  var borderStyle = 'border:' + axisBorderWidth * 2 + 'px;';
  this._axisStyle.parseInlineStyle(borderStyle);

  this.setBorderWidth(axisBorderWidth);
};

/**
 * Calculate orientation indepedent canvas dimensions.
 * @private
 */
dvt.TimeAxis.prototype._prepareCanvasViewport = function()
{
  if (this._isVertical)
  {
    // The size of the canvas viewport
    this._canvasLength = this.Height;
    this._canvasSize = this.Width;
  }
  else
  {
    // The size of the canvas viewport
    this._canvasLength = this.Width;
    this._canvasSize = this.Height;
  }
};

/**
 * Finalize axis dimensions with border/separator widths and any missing size dimensions.
 * @private
 */
dvt.TimeAxis.prototype._setAxisDimensions = function()
{
  if (this._canvasSize !== null)
    this.setContentSize(this._canvasSize - this.getSizeBorderWidth());
  this._axisLength = this._contentLength + this.getSizeBorderWidth() - DvtTimeAxisStyleUtils.DEFAULT_SEPARATOR_WIDTH;
};

/**
 * Update axis dimensions with new canvas width/height; for standalone TimeAxis.
 * @param {number} width The new width of the axis
 * @param {number} height The new height of the axis
 * @private
 */
dvt.TimeAxis.prototype._updateDimensions = function(width, height)
{
  this.Width = width;
  this.Height = height;

  this._prepareCanvasViewport();

  this.setContentLength(this._canvasLength);

  this._setAxisDimensions();
};

/**
 * Rerenders TimeAxis with new width and height values.
 * @param {number} width The new width of the axis
 * @param {number} height The new height of the axis
 * @private
 */
dvt.TimeAxis.prototype._handleResize = function(width, height)
{
  this._updateDimensions(width, height);
  DvtTimeAxisRenderer.renderTimeAxis(this);
};

/**
 * Calculates and stores the dates/labels/zoomlevellengths for each specified zoom order scale.
 * @param {number} startTime the start time of the axis in milliseconds
 * @param {number} endTime the end time of the axis in milliseconds
 * @param {number} minViewPortLength The minimum viewport length
 */
dvt.TimeAxis.prototype.prepareTimeAxisZoomLevelIntervals = function(startTime, endTime, minViewPortLength)
{
  this.setConverter(this._converter);
  this.setType('short', this._dateFormatStrings);

  this._dates = [];
  this._labels = [];
  this._zoomLevelLengths = [];

  if (this._isVertical)
    this.setDefaultConverter(this._resources['converterVert']);
  else
    this.setDefaultConverter(this._resources['converter']);
  if (this._timeZoneOffsets)
    this.setTimeZoneOffsets(this._timeZoneOffsets);

  var originalScale = this._scale;

  for (var i = 0; i < this._zoomOrder.length; i++)
  {
    var scale = this._zoomOrder[i];
    var minLength = this._prepareScaleDatesLabels(scale, originalScale, startTime, endTime);
    this._prepareZoomLevelLengths(i, scale, startTime, endTime, minLength, minViewPortLength);
  }
  this.setScale(originalScale);
};

/**
 * Calculates and stores the dates/labels for given scale.
 * @param {string} scale The current scale.
 * @param {string} originalScale The initial scale.
 * @param {number} startTime The start time of the axis in milliseconds
 * @param {number} endTime The end time of the axis in milliseconds
 * @return {number} The minimum ratio between time in one interval and label length of the interval
 * @private
 */
dvt.TimeAxis.prototype._prepareScaleDatesLabels = function(scale, originalScale, startTime, endTime)
{
  this.setScale(scale);
  var minLength = Infinity;
  var maxSize = 0;

  var dates;
  var labelTexts;
  if (this._customTimeScales && this._customTimeScales[scale])
  {
    var customScale = this._customTimeScales[scale];
    dates = customScale['times'];
    labelTexts = customScale['labels'];
  }
  else if (this._customFormatScales && this._customFormatScales[scale])
  {
    var customFormatScale = this._customFormatScales[scale];
    dates = customFormatScale['times'];
    labelTexts = customFormatScale['labels'];
  }
  else
  {
    dates = [];
    labelTexts = [];
    var currentTime = this.adjustDate(startTime).getTime();
    dates.push(currentTime);
    while (currentTime < endTime)
    {
      labelTexts.push(this.formatDate(new Date(currentTime)));
      currentTime = this.getNextDate(currentTime).getTime();
      // the last currentTime added in this loop is outside of the time range, but is needed
      // for the last 'next' date when actually creating the time axis in renderTimeAxis
      dates.push(currentTime);
    }
  }

  var labels = [];
  for (var j = 0; j < labelTexts.length; j++)
  {
    currentTime = dates[j];
    var label = new dvt.OutputText(this.getCtx(), labelTexts[j], 0, 0, 's_label' + currentTime);
    label.setCSSStyle(DvtTimeAxisStyleUtils.getAxisLabelStyle(this.Options));
    // save the time associated with the element for dynamic resize
    label.time = currentTime;
    var nextTime = dates[j + 1];

    // update maximum label width and height
    var dim = label.getDimensions();
    if (this._isVertical)
    {
      var lengthDim = dim.h;
      var sizeDim = dim.w;
      var defaultLength = DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_HEIGHT;
    }
    else
    {
      lengthDim = dim.w;
      sizeDim = dim.h;
      defaultLength = DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_WIDTH;
    }
    var labelLength = Math.max(defaultLength, lengthDim + (DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING * 2));
    var lengthFactor = (nextTime - currentTime) / labelLength;
    if (lengthFactor < minLength)
      minLength = lengthFactor;
    if (sizeDim > maxSize)
      maxSize = sizeDim;

    labels.push(label);
  }

  this.setContentSize(maxSize + DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING * 2);

  this._dates.push(dates);
  this._labels.push(labels);

  this.setScale(originalScale);

  return minLength;
};

/**
 * Calculates and stores the zoom order lengths for given scale.
 * @param {number} i The zoom order index
 * @param {string} scale The current scale.
 * @param {number} startTime The start time of the axis in milliseconds
 * @param {number} endTime The end time of the axis in milliseconds
 * @param {number} minLength The minimum ratio between time in one interval and label length of the interval
 * @param {number} minViewPortLength The minimum viewport length
 * @private
 */
dvt.TimeAxis.prototype._prepareZoomLevelLengths = function(i, scale, startTime, endTime, minLength, minViewPortLength)
{
  if (this._canvasSize !== null) //standalone timeaxis case
  {
    var zoomLevelLength = minViewPortLength;
  }
  else
    zoomLevelLength = ((endTime - startTime) / minLength);

  this._zoomLevelLengths.push(zoomLevelLength);
  if (scale == this._scale)
  {
    this._zoomLevelOrder = i;
    this.setContentLength(zoomLevelLength, minViewPortLength);
  }
  if (i == 0)
    this._maxContentLength = this._labels[this._labels.length - 1].length * minViewPortLength;
};

/**
 * Sets the current scale.
 * @param {string} scale The new scale.
 */
dvt.TimeAxis.prototype.setScale = function(scale)
{
  this._scale = scale;
};

/**
 * Gets current scale.
 * @return {string} The current scale.
 */
dvt.TimeAxis.prototype.getScale = function()
{
  return this._scale;
};

/**
 * Sets the timezone offsets.
 * @param {string} timeZoneOffsets The new timezone offsets.
 */
dvt.TimeAxis.prototype.setTimeZoneOffsets = function(timeZoneOffsets)
{
  this._timeZoneOffsets = timeZoneOffsets;
};

/**
 * Increases current scale by an order.
 * @return {boolean} whether successful
 */
dvt.TimeAxis.prototype.increaseScale = function()
{
  for (var s = 0; s < this._zoomOrder.length - 1; s++)
  {
    if (this._zoomOrder[s] == this._scale)
    {
      this._scale = this._zoomOrder[s + 1];
      return true;
    }
  }
  return false;
};

/**
 * Decreases current scale by an order.
 * @return {boolean} whether successful
 */
dvt.TimeAxis.prototype.decreaseScale = function()
{
  for (var s = 1; s < this._zoomOrder.length; s++)
  {
    if (this._zoomOrder[s] == this._scale)
    {
      this._scale = this._zoomOrder[s - 1];
      return true;
    }
  }
  return false;
};

/**
 * Sets the converter.
 * @param {object} converter The new converter.
 */
dvt.TimeAxis.prototype.setConverter = function(converter)
{
  this._converter = converter;
};

/**
 * Sets the default converter.
 * @param {object} defaultConverter The default converter.
 */
dvt.TimeAxis.prototype.setDefaultConverter = function(defaultConverter)
{
  this._defaultConverter = defaultConverter;
};

/**
 * Gets the TimeAxis content size.
 * @return {number}
 */
dvt.TimeAxis.prototype.getContentSize = function()
{
  return this._contentSize;
};

/**
 * Sets the TimeAxis content size.
 * @param {number} contentSize The TimeAxis content size
 */
dvt.TimeAxis.prototype.setContentSize = function(contentSize)
{
  if (contentSize > this._contentSize)
    this._contentSize = contentSize;
};

/**
 * Gets the TimeAxis width.
 * @return {number}
 */
dvt.TimeAxis.prototype.getTimeAxisWidth = function()
{
  // read from skin?
  if (this._timeAxisWidth == null)
    this._timeAxisWidth = 30;

  return this._timeAxisWidth;
};

/**
 * Sets the border width
 * @param {number} borderWidth The new border width
 */
dvt.TimeAxis.prototype.setBorderWidth = function(borderWidth)
{
  this._borderWidth = borderWidth;
};

/**
 * Turns border sections on or off.
 * @param {boolean} top whether border top should be on/visible
 * @param {boolean} right whether border right should be on/visible
 * @param {boolean} bottom whether border bottom should be on/visible
 * @param {boolean} left whether border left should be on/visible
 */
dvt.TimeAxis.prototype.setBorderVisibility = function(top, right, bottom, left)
{
  this._borderTopWidth = (top | 0) * this._borderWidth;
  this._borderRightWidth = (right | 0) * this._borderWidth;
  this._borderBottomWidth = (bottom | 0) * this._borderWidth;
  this._borderLeftWidth = (left | 0) * this._borderWidth;
};

/**
 * Calculates the appropriate stroke dasharray that reflects the border visibility.
 * @return {string} The stroke dasharray.
 */
dvt.TimeAxis.prototype.calcStrokeDashArray = function()
{
  if (this._isVertical)
  {
    var borderLengths = {
      'top': this.getSize(),
      'right': this.getAxisLength(),
      'bottom': this.getSize(),
      'left': this.getAxisLength()
    };
  }
  else
  {
    borderLengths = {
      'top': this.getAxisLength(),
      'right': this.getSize(),
      'bottom': this.getAxisLength(),
      'left': this.getSize()
    };
  }

  var dashArray = [];
  var currentDashLength = 0;
  var currentDashState = 1;
  var sideEvalOrder = ['top', 'right', 'bottom', 'left'];
  for (var i = 0; i < sideEvalOrder.length; i++)
  {
    var sideVisibility = this.getBorderWidth(sideEvalOrder[i]) > 0;
    if (sideVisibility == currentDashState)
    {
      currentDashLength += borderLengths[sideEvalOrder[i]];
    }
    else
    {
      dashArray.push(currentDashLength);
      currentDashLength = borderLengths[sideEvalOrder[i]];
      currentDashState = Math.abs(currentDashState - 1);
    }
  }
  dashArray.push(currentDashLength);
  return dashArray.toString();
};

/**
 * Gets the size dimension taken up by border width.
 * @return {number}
 */
dvt.TimeAxis.prototype.getSizeBorderWidth = function()
{
  return this._borderTopWidth + this._borderBottomWidth;
};

/**
 * Gets the length dimension taken up by border width.
 * @return {number}
 */
dvt.TimeAxis.prototype.getLengthBorderWidth = function()
{
  return this._borderRightWidth + this._borderLeftWidth;
};

/**
 * Gets the border width.
 * @param {string=} side The border side of interest.
 * @return {number}
 */
dvt.TimeAxis.prototype.getBorderWidth = function(side)
{
  switch (side)
  {
    case 'top': return this._borderTopWidth;
    case 'right': return this._borderRightWidth;
    case 'bottom': return this._borderBottomWidth;
    case 'left': return this._borderLeftWidth;
    default: return this._borderWidth;
  }
};

/**
 * Gets the total TimeAxis size (content size with border).
 * @return {number}
 */
dvt.TimeAxis.prototype.getSize = function()
{
  return this._contentSize + this.getSizeBorderWidth();
};

/**
 * Sets the date formatter based on new type and date (translation) strings.
 * @param {string} type The type
 * @param {object} dateFormatStrings Object defining the date translation strings
 */
dvt.TimeAxis.prototype.setType = function(type, dateFormatStrings)
{
  // create a new formatter based on the new type
  this._formatter = new DvtTimeAxisFormatter(type == 'short' ? DvtTimeAxisFormatter.SHORT : DvtTimeAxisFormatter.LONG, dateFormatStrings, this._locale);
};

/**
 * Finds the closest date to the time scale of the specified date.
 * @param {Date | string | number} date The date in question.
 * @return {Date} date The date closest to the time scale of the date in question.
 */
dvt.TimeAxis.prototype.adjustDate = function(date)
{
  return this._calendar.adjustDate(new Date(date), this._scale);
};

/**
 * Gets the next date an interval away from the specified time based on current scale.
 * @param {number} time The time in question in milliseconds
 * @return {Date} The next date
 */
dvt.TimeAxis.prototype.getNextDate = function(time)
{
  return this.getAdjacentDate(time, this._scale, 'next');
};

/**
 * Gets the next or previous date an interval away from the specified time based on a given scale.
 * @param {number} time The time in question in milliseconds
 * @param {string} scale
 * @param {string} direction Either 'next' or 'previous'
 * @return {Date} The adjacent date
 */
dvt.TimeAxis.prototype.getAdjacentDate = function(time, scale, direction)
{
  return this._calendar.getAdjacentDate(time, scale, direction);
};

/**
 * Formats specified date. Two modes are supported: axis date formatting, and general purpose date formatting (controlled using converterType param).
 * An optional converter can be passed in. Otherwise, a default converter is used.
 * @param {Date} date The query date
 * @param {object=} converter Optional custom converter.
 * @param {string=} converterType Optional; 'axis' if for formatting axis labels, 'general' if for general date formatting. Defaults to 'axis'.
 * @return {string} The formatted date string
 */
dvt.TimeAxis.prototype.formatDate = function(date, converter, converterType)
{
  var factoryOptions, scale = this.getScale();
  converterType = converterType || 'axis'; // default converterType 'axis'

  if (converterType == 'axis')
  {
    converter = converter || this._converter; // if no converter passed in, try to use axis converter from options
    if (converter)
    {
      if (converter[scale])
        converter = converter[scale];
      else if (converter['default'])
        converter = converter['default'];
    }
    // Use default scale converter (if available), if no converter available, or if the converter not usable for this scale.
    if ((!converter || (!converter['format'] && !converter['getAsString'])) && this._defaultConverter && this._defaultConverter[scale])
      converter = this._defaultConverter[scale];
  }
  else // general formatting
  {
    if (!converter)
    {
      // Note: The native javascript Date.toLocaleString() or Date.toLocaleDateString() methods
      // uses the system locale by default, which may be different from the app specified locale.
      // Those methods accepts a locale (and option) argument in all major browsers except Safari [OS X/iOS] 9,
      // which are supported by JET at the time of writing. In lieu of using the native JS methods, below
      // retrieves converters passed in from the JET side. The converters are automatically app locale aware and works on all supported browsers.
      var defaultDateTimeConverter = this._resources['defaultDateTimeConverter'];
      var defaultDateConverter = this._resources['defaultDateConverter'];
      if (defaultDateTimeConverter && defaultDateConverter)
      {
        if (scale == 'hours' || scale == 'minutes' || scale == 'seconds')
        {
          converter = defaultDateTimeConverter;
        }
        else
        {
          converter = defaultDateConverter;
        }
      }
      else
      {
        // If no converters found for some reason (should never get here in JET), use native JS Date toLocaleDateSTring/toLocaleString() methods
        // See above Note for caveats:
        var localeStringMethod = 'toLocaleDateString';
        var options = {'year': 'numeric', 'month': 'short', 'day': 'numeric'}; // e.g. Jan 1, 2016
        if (scale == 'hours' || scale == 'minutes' || scale == 'seconds')
        {
          localeStringMethod = 'toLocaleString';
          options = {'year': 'numeric', 'month': 'short', 'day': 'numeric', 'hour': 'numeric', 'minute': 'numeric', 'second': 'numeric'}; // e.g. Jan 1, 2016, 5:53:39 PM
        }

        try {
          return date[localeStringMethod](this._locale, options); // should work on all supported browsers except iOS 9 Safari
        } catch (e) {
          if (e.name === 'RangeError')
            return date[localeStringMethod](); // fallback to using system locale rather than using app's locale
        }
        return date[localeStringMethod]();
      }
    }
  }

  if (converter)
  {
    if (converter['format'])
      return converter['format'](this._dateToIsoWithTimeZoneConverter ? this._dateToIsoWithTimeZoneConverter(date) : date);
    else if (converter['getAsString'])
      return converter['getAsString'](date);
  }
  return this._formatter.format(date, scale, this._timeZoneOffsets);
};

/**
 * Gets zoom order.
 * @return {string[]} current zoom order
 */
dvt.TimeAxis.prototype.getZoomOrder = function()
{
  return this._zoomOrder;
};

/**
 * Sets zoom order.
 * @param {string[]} zoomOrder The new zoom order.
 */
dvt.TimeAxis.prototype.setZoomOrder = function(zoomOrder)
{
  this._zoomOrder = zoomOrder;
};

/**
 * Sets content size based on orientation.
 * @param {boolean} isVertical Whether orientation is vertical.
 */
dvt.TimeAxis.prototype.setIsVertical = function(isVertical)
{
  if (isVertical)
    this._contentSize = DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_WIDTH;
  else
    this._contentSize = DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_HEIGHT;
};

/**
 * Sets canvas size.
 * @param {number} canvasSize The new canvas size
 */
dvt.TimeAxis.prototype.setCanvasSize = function(canvasSize)
{
  this._canvasSize = canvasSize;
};

/**
 * Gets zoom level lengths.
 * @return {number[]} zoom level lengths
 */
dvt.TimeAxis.prototype.getZoomLevelLengths = function()
{
  return this._zoomLevelLengths;
};

/**
 * Gets max content length.
 * @return {number} The max content length
 */
dvt.TimeAxis.prototype.getMaxContentLength = function()
{
  return this._maxContentLength;
};

/**
 * Gets current zoom order index.
 * @return {number} The current zoom order index
 */
dvt.TimeAxis.prototype.getZoomLevelOrder = function()
{
  return this._zoomLevelOrder;
};

/**
 * Sets zoom order index.
 * @param {number} zoomLevelOrder The new zoom order index
 */
dvt.TimeAxis.prototype.setZoomLevelOrder = function(zoomLevelOrder)
{
  this._zoomLevelOrder = zoomLevelOrder;
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
// todo: this should be used by Timeline also
var DvtTimeAxisCalendar = function(options)
{
  this.Init(options);
};

dvt.Obj.createSubclass(DvtTimeAxisCalendar, dvt.Obj);

DvtTimeAxisCalendar.prototype.Init = function()
{
  this._dayInMillis = 1000 * 60 * 60 * 24;
  this._firstDayOfWeek = 0; // sunday; locale based
};

/**
 * Sets the first day of the week, which is locale based.
 * @param {number} firstDayOfWeek Numeric day of the week: 0 for Sunday, 1 for Monday, etc.
 */
DvtTimeAxisCalendar.prototype.setFirstDayOfWeek = function(firstDayOfWeek)
{
  this._firstDayOfWeek = firstDayOfWeek;
};

DvtTimeAxisCalendar.prototype.getFirstDayOfWeek = function()
{
  return this._firstDayOfWeek;
};

DvtTimeAxisCalendar.prototype.adjustDate = function(date, scale)
{
  var _adjustedDate = new Date(date.getTime());
  if (scale == 'weeks')
  {
    _adjustedDate.setHours(0, 0, 0);
    var roll_amt = (date.getDay() - this.getFirstDayOfWeek() + 7) % 7;
    if (roll_amt > 0)
      _adjustedDate.setTime(_adjustedDate.getTime() - roll_amt * this._dayInMillis);
  }
  else if (scale == 'months')
  {
    _adjustedDate.setDate(1);
  }
  else if (scale == 'days')
  {
    _adjustedDate.setHours(0, 0, 0);
  }
  else if (scale == 'hours')
  {
    _adjustedDate.setMinutes(0, 0, 0);
  }
  else if (scale == 'minutes')
  {
    _adjustedDate.setSeconds(0, 0);
  }
  else if (scale == 'seconds')
  {
    _adjustedDate.setMilliseconds(0);
  }
  else if (scale == 'quarters')
  {
    _adjustedDate.setDate(1);
    roll_amt = 2 - (date.getMonth() + 11) % 3;
    if (roll_amt > 0)
      _adjustedDate.setMonth(_adjustedDate.getMonth() + roll_amt);
  }
  else if (scale == 'halfyears')
  {
    _adjustedDate.setDate(1);
    roll_amt = 5 - (date.getMonth() + 11) % 6;
    if (roll_amt > 0)
      _adjustedDate.setMonth(_adjustedDate.getMonth() + roll_amt);
  }
  else if (scale == 'years')
  {
    _adjustedDate.setMonth(0);
    _adjustedDate.setDate(1);
  }
  else if (scale == 'twoyears')
  {
    _adjustedDate.setMonth(0);
    _adjustedDate.setDate(1);
  }

  return _adjustedDate;
};

DvtTimeAxisCalendar.prototype.getNextDate = function(time, scale)
{
  return this.getAdjacentDate(time, scale, 'next');
};

/**
 * Gets the next or previous date an interval away from the specified time based on a given scale.
 * @param {number} time The time in question in milliseconds
 * @param {string} scale
 * @param {string} direction Either 'next' or 'previous'
 * @return {Date} The adjacent date
 */
DvtTimeAxisCalendar.prototype.getAdjacentDate = function(time, scale, direction)
{
  var directionSign = direction == 'next' ? 1 : -1;

  if (scale == 'milliseconds')
    return new Date(time + directionSign * 1);
  else if (scale == 'seconds')
    return new Date(time + directionSign * 1000);
  else if (scale == 'minutes')
    return new Date(time + directionSign * 60000);
  else if (scale == 'hours')
    return new Date(time + directionSign * 3600000);
  // for larger scales, no set amount of time can be added
  var _adjacentDate = new Date(time);
  if (scale == 'days')
    _adjacentDate.setDate(_adjacentDate.getDate() + directionSign * 1);
  else if (scale == 'weeks')
    _adjacentDate.setDate(_adjacentDate.getDate() + directionSign * 7);
  else if (scale == 'months')
    _adjacentDate.setMonth(_adjacentDate.getMonth() + directionSign * 1);
  else if (scale == 'quarters')
    _adjacentDate.setMonth(_adjacentDate.getMonth() + directionSign * 3);
  else if (scale == 'halfyears')
    _adjacentDate.setMonth(_adjacentDate.getMonth() + directionSign * 6);
  else if (scale == 'years')
    _adjacentDate.setFullYear(_adjacentDate.getFullYear() + directionSign * 1);
  else if (scale == 'twoyears')
    _adjacentDate.setFullYear(_adjacentDate.getFullYear() + directionSign * 2);
  else
  {
    // circuit breaker
    _adjacentDate.setYear(_adjacentDate.getYear() + directionSign * 1);
  }
  return _adjacentDate;
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
var DvtTimeAxisDefaults = function(context)
{
  this.Init({'alta': DvtTimeAxisDefaults.VERSION_1}, context);
};

dvt.Obj.createSubclass(DvtTimeAxisDefaults, dvt.BaseComponentDefaults);

/**
 * Contains overrides for version 1.
 * @const
 */
DvtTimeAxisDefaults.VERSION_1 = {
  'backgroundColor': 'rgba(255,255,255,0)',
  'borderColor': '#d9dfe3',
  'separatorColor': '#bcc7d2',
  'labelStyle': new dvt.CSSStyle(dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color: #333333;')
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
var DvtTimeAxisFormatter = function(type, dateFormatStrings, locale)
{
  this.Init(type, dateFormatStrings, locale);
};

dvt.Obj.createSubclass(DvtTimeAxisFormatter, dvt.Obj);

DvtTimeAxisFormatter.LONG = 0;
DvtTimeAxisFormatter.SHORT = 1;

DvtTimeAxisFormatter.prototype.Init = function(type, dateFormatStrings, locale)
{
  this._type = type;
  this._dateFormatStrings = dateFormatStrings;
  this._locale = locale;

  this._formats = [];
  this._formats[0] = new Object();
  this._formats[0]['seconds'] = 'HH:MM:ss';
  this._formats[0]['minutes'] = 'HH:MM';
  this._formats[0]['hours'] = 'HH:MM';
  this._formats[0]['days'] = 'dddd';
  this._formats[0]['weeks'] = 'm/dd';
  this._formats[0]['months'] = 'mmmm';
  this._formats[0]['quarters'] = 'mmmm';
  this._formats[0]['halfyears'] = 'yyyy';
  this._formats[0]['years'] = 'yyyy';
  this._formats[0]['twoyears'] = 'yyyy';

  this._formats[1] = new Object();
  this._formats[1]['seconds'] = 'HH:MM:ss';
  this._formats[1]['minutes'] = 'HH:MM';
  this._formats[1]['hours'] = 'HH:MM';
  this._formats[1]['days'] = 'm/dd';
  this._formats[1]['weeks'] = 'm/dd';
  this._formats[1]['months'] = 'mmm';
  this._formats[1]['quarters'] = 'mmm';
  this._formats[1]['halfyears'] = 'yy';
  this._formats[1]['years'] = 'yy';
  this._formats[1]['twoyears'] = 'yy';
};

/**
 * Change the format string for a particular time scale.
 *
 * @param scale
 * @param pattern - the format string
 */
DvtTimeAxisFormatter.prototype.setPattern = function(scale, pattern)
{
  this._formats[this._type][scale] = pattern;
};

DvtTimeAxisFormatter.prototype.format = function(date, scale, timeZoneOffsets)
{
  var mask = this._formats[this._type][scale];
  if (mask != null)
  {
    var isUTC = false;
    if (timeZoneOffsets)
    {
      var timeInMS = date.getTime();
      var dates = Object.keys(timeZoneOffsets);
      var offset = 0;
      for (var i = 0; i < dates.length; i++)
      {
        if (timeInMS >= parseInt(dates[i], 10))
          offset = timeZoneOffsets[dates[i]];
      }
      date = new Date(timeInMS + offset);
      isUTC = true;
    }
    if (mask.indexOf(':') != -1)
      var separator = ':';
    else if (mask.indexOf('/') != -1)
      separator = '/';
    if (separator)
    {
      mask = mask.split(separator);
      var newString = this.getDateFormatValue(date, mask[0], isUTC);
      for (var i = 1; i < mask.length; i++)
      {
        newString += separator + this.getDateFormatValue(date, mask[i], isUTC);
      }
      return newString;
    }
    else
      return this.getDateFormatValue(date, mask, isUTC);
  }
  else
  {
    // Locales argument supported in all major browsers except iOS 9 safari
    // at the time of writing:
    try {
      return date.toLocaleString(this._locale);
    } catch (e) {
      if (e.name === 'RangeError')
        return date.toLocaleString();
    }
    return date.toLocaleString();
  }
};

/**
 * Gets the formatted date value corresponding to the desired mask.
 * Valid mask values are: 'ss', 'MM', 'HH', 'dd', 'dddd', 'm',
 * 'mmm', 'mmmm', 'yy', and 'yyyy'.
 * @param {Date} date The date object to be formatted.
 * @param {string} mask The format mask to be used.
 * @param {boolean} isUTC Whether UTC values should be used.
 * @return {string} The formatted date value.
 */
DvtTimeAxisFormatter.prototype.getDateFormatValue = function(date, mask, isUTC)
{
  if (isUTC)
  {
    switch (mask)
    {
      case 'ss':
        var value = date.getUTCSeconds();
        if (value < 10)
          return '0' + value;
        else
          return value;
        break;

      case 'HH':
        value = date.getUTCHours();
        if (value < 10)
          return '0' + value;
        else
          return value;
        break;

      case 'MM':
        value = date.getUTCMinutes();
        if (value < 10)
          return '0' + value;
        else
          return value;
        break;

      case 'dd':
        value = date.getUTCDate();
        if (value < 10)
          return '0' + value;
        else
          return value;
        break;

      case 'dddd':
        return this._dateFormatStrings.dayNames[date.getUTCDay() + 7];
        break;

      case 'm':
        return date.getUTCMonth() + 1;
        break;

      case 'mmm':
        return this._dateFormatStrings.monthNames[date.getUTCMonth()];
        break;

      case 'mmmm':
        return this._dateFormatStrings.monthNames[date.getUTCMonth() + 12];
        break;

      case 'yy':
        return date.getUTCFullYear().toString().substring(2, 4);
        break;

      default:
        // 'yyyy' case
        return date.getUTCFullYear();
    }
  }
  else
  {
    switch (mask)
    {
      case 'ss':
        value = date.getSeconds();
        if (value < 10)
          return '0' + value;
        else
          return value;
        break;

      case 'HH':
        value = date.getHours();
        if (value < 10)
          return '0' + value;
        else
          return value;
        break;

      case 'MM':
        value = date.getMinutes();
        if (value < 10)
          return '0' + value;
        else
          return value;
        break;

      case 'dd':
        value = date.getDate();
        if (value < 10)
          return '0' + value;
        else
          return value;
        break;

      case 'dddd':
        return this._dateFormatStrings.dayNames[date.getDay() + 7];
        break;

      case 'm':
        return date.getMonth() + 1;
        break;

      case 'mmm':
        return this._dateFormatStrings.monthNames[date.getMonth()];
        break;

      case 'mmmm':
        return this._dateFormatStrings.monthNames[date.getMonth() + 12];
        break;

      case 'yy':
        return date.getFullYear().toString().substring(2, 4);
        break;

      default:
        // 'yyyy' case
        return date.getFullYear();
    }
  }
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
var DvtTimeAxisParser = function() {};

dvt.Obj.createSubclass(DvtTimeAxisParser, dvt.Obj);

/**
 * Parses the specified data options and returns the root node of the time axis
 * @param {object} options The data options describing the component.
 * @return {object} An object containing the parsed properties
 */
DvtTimeAxisParser.prototype.parse = function(options)
{
  this._startTime = new Date(options['start']);
  this._endTime = new Date(options['end']);

  var ret = this.ParseRootAttributes();
  ret.inlineStyle = options['style'];
  ret.id = options['id'];
  ret.shortDesc = options['shortDesc'];
  ret.timeZoneOffsets = options['_tzo'];
  ret.itemPosition = options['_ip'];
  ret.customTimeScales = options['_cts'];
  ret.customFormatScales = options['_cfs'];

  ret.scale = options['scale'];
  ret.converter = options['converter'];
  ret.zoomOrder = options['zoomOrder'] ? options['zoomOrder'] : null;

  ret.orientation = options['orientation'] ? options['orientation'] : 'horizontal';

  return ret;
};

/**
 * Parses the attributes on the root node.
 * @return {object} An object containing the parsed properties
 * @protected
 */
DvtTimeAxisParser.prototype.ParseRootAttributes = function()
{
  var ret = new Object();

  ret.start = this._startTime.getTime();
  ret.end = this._endTime.getTime();

  return ret;
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/**
 * Renderer for dvt.TimeAxis.
 * @class
 */
var DvtTimeAxisRenderer = new Object();

dvt.Obj.createSubclass(DvtTimeAxisRenderer, dvt.Obj);

/**
 * Renders the time axis (top left corner at (0,0)).
 * @param {dvt.TimeAxis} timeAxis The timeAxis being rendered.
 */
DvtTimeAxisRenderer.renderTimeAxis = function(timeAxis)
{
  if (timeAxis.hasValidOptions())
  {
    var axisSize = timeAxis.getSize();
    var axisStart = 0;
    DvtTimeAxisRenderer._renderAxisBlock(timeAxis, axisStart, axisSize, DvtTimeAxisStyleUtils.getAxisSeparatorStyle(timeAxis.Options));
  }
  // else?!
};

/**
 * Renders the time axis block, draws a border around it, and initiates ticks and labels rendering.
 * @param {dvt.timeAxis} timeAxis The timeAxis being rendered.
 * @param {number} axisStart The start position of the axis.
 * @param {number} axisSize The axis size.
 * @param {string} separatorStyle The axis separator style.
 * @private
 */
DvtTimeAxisRenderer._renderAxisBlock = function(timeAxis, axisStart, axisSize, separatorStyle)
{
  var context = timeAxis.getCtx();
  if (timeAxis._axis == null)
  {
    var cp = new dvt.ClipPath();
    if (timeAxis.isVertical())
    {
      timeAxis._axis = new dvt.Rect(context, axisStart, -timeAxis.getBorderWidth('top'), axisSize, timeAxis.getAxisLength(), 'axis');
      cp.addRect(axisStart, 0, axisSize, timeAxis._contentLength);
    }
    else
    {
      timeAxis._axis = new dvt.Rect(context, -timeAxis.getBorderWidth('left'), axisStart, timeAxis.getAxisLength(), axisSize, 'axis');
      cp.addRect(0, axisStart, timeAxis._contentLength, axisSize);
    }
    timeAxis._axis.setCSSStyle(timeAxis._axisStyle);
    timeAxis._axis.setPixelHinting(true);
    timeAxis._axis.setClipPath(cp);

    timeAxis.addChild(timeAxis._axis);

    var axisClass = DvtTimeAxisStyleUtils.getAxisClass(timeAxis.Options);
    if (axisClass)
      timeAxis._axis.getElem().setAttribute('class', axisClass);
  }
  else
  {
    timeAxis._axis.setClipPath(null);
    cp = new dvt.ClipPath();
    if (timeAxis.isVertical())
    {
      timeAxis._axis.setX(axisStart);
      timeAxis._axis.setY(-timeAxis.getBorderWidth('top'));
      timeAxis._axis.setWidth(axisSize);
      timeAxis._axis.setHeight(timeAxis.getAxisLength());
      cp.addRect(axisStart, 0, axisSize, timeAxis._contentLength);
    }
    else
    {
      timeAxis._axis.setX(-timeAxis.getBorderWidth('left'));
      timeAxis._axis.setY(axisStart);
      timeAxis._axis.setWidth(timeAxis.getAxisLength());
      timeAxis._axis.setHeight(axisSize);
      cp.addRect(0, axisStart, timeAxis._contentLength, axisSize);
    }
    timeAxis._axis.setClipPath(cp);
  }

  // remove all existing ticks and labels
  timeAxis._axis.removeChildren();

  // apply stroke dash array to turn on/off border sides accordingly
  timeAxis._axis.getElem().setAttribute('stroke-dasharray', timeAxis.calcStrokeDashArray());

  var separatorStyle = new dvt.CSSStyle(separatorStyle);
  timeAxis._separatorStroke = new dvt.Stroke(separatorStyle.getStyle(dvt.CSSStyle.COLOR));

  var axisSize = timeAxis.getContentSize();
  var axisStart = axisStart + timeAxis.isVertical() ? timeAxis.getBorderWidth('left') : timeAxis.getBorderWidth('top');
  var axisEnd = (axisStart + axisSize);

  DvtTimeAxisRenderer._renderAxisTicksLabels(timeAxis, 0, timeAxis._canvasSize, timeAxis._axis, timeAxis._contentLength, axisEnd, axisStart, axisStart);
};

/**
 * Renders the ticks and labels of the time axis.
 * @param {dvt.timeAxis} timeAxis The timeAxis being rendered.
 * @param {number} startPos The start position for rendering.
 * @param {number} endPos The end position for rendering.
 * @param {dvt.Container} container The container to render into.
 * @param {number} length The length of the axis.
 * @param {number} axisEnd The end position of the axis.
 * @param {number} tickStart The start position of the first interval.
 * @param {number} labelStart The start position of the first label.
 * @private
 */
DvtTimeAxisRenderer._renderAxisTicksLabels = function(timeAxis, startPos, endPos, container, length, axisEnd, tickStart, labelStart)
{
  var context = timeAxis.getCtx();
  var isRTL = dvt.Agent.isRightToLeft(context);

  var block = new dvt.Container(context, 'block_' + startPos + '_' + endPos);
  block.startPos = startPos;
  block.endPos = endPos;
  container.addChild(block);

  var labelClass = DvtTimeAxisStyleUtils.getAxisLabelClass(timeAxis.Options);
  var separatorClass = DvtTimeAxisStyleUtils.getAxisSeparatorClass(timeAxis.Options);
  var maxLabelHeight = timeAxis.getContentSize();

  // the last date in dates is past the end time, and only used as the last 'next' date
  var dates = timeAxis._dates[timeAxis._zoomLevelOrder];
  var labels = timeAxis._labels[timeAxis._zoomLevelOrder];
  for (var i = 0; i < dates.length - 1; i++)
  {
    var date = dates[i];
    var next = dates[i + 1];
    var label = labels[i];

    var currentPos = dvt.TimeAxis.getDatePosition(timeAxis._start, timeAxis._end, date, length);
    var nextPos = dvt.TimeAxis.getDatePosition(timeAxis._start, timeAxis._end, next, length);

    if (currentPos != 0)
    {
      if (timeAxis.isVertical())
        var tickElem = DvtTimeAxisRenderer._addTick(context, block, axisEnd, tickStart, currentPos, currentPos, timeAxis._separatorStroke, 's_tick' + date, separatorClass);
      else if (!isRTL)
        tickElem = DvtTimeAxisRenderer._addTick(context, block, currentPos, currentPos, axisEnd, tickStart, timeAxis._separatorStroke, 's_tick' + date, separatorClass);
      else
        tickElem = DvtTimeAxisRenderer._addTick(context, block, length - currentPos, length - currentPos, axisEnd, tickStart, timeAxis._separatorStroke, 's_tick' + date, separatorClass);
      // save the time associated with the element for dynamic resize
      tickElem.time = date;
    }

    // Label may have been truncated in the previous render. Start fresh for this render:
    if (label.isTruncated())
      label.setTextString(label.getUntruncatedTextString());
    var truncateStart = false;

    if (timeAxis.isVertical())
    {
      label.alignCenter(); // set horizontal bounding box reference point to be horizontally center
      DvtTimeAxisRenderer._addAxisLabel(block, label, labelStart + ((axisEnd - labelStart) / 2), currentPos + ((nextPos - currentPos) / 2), axisEnd - labelStart, nextPos - currentPos, labelClass);
    }
    else
    {
      // First and Last label can get cut off because first currentPos/last next date can be before/past the overall start/end time ( - date in major axis is getting cut off in some cases)
      // Have the first and last label be truncated with ellipses if necessary, whilst maintaining the same position as if inter-tick region is not cut off.
      if (i === 0 && currentPos < 0) // first label currentPos is before the overall start time pos (at pos 0)
      {
        var labelWidth = label.getDimensions().w;
        var maxLength = nextPos - Math.max(0, ((nextPos - currentPos - labelWidth) / 2));
        // Can't simply take center of inter-tick region and alignCenter() for first label treatment if the label is going to be truncated
        // Instead, align right and manually calculate label placement
        if (!isRTL)
          label.alignRight();
        var horizPos = Math.max(0, maxLength);
        truncateStart = true;
      }
      else if (i === dates.length - 2 && nextPos > length) // last label nextPos is after the overall end time pos (at pos length)
      {
        labelWidth = label.getDimensions().w;
        maxLength = length - currentPos - Math.max(0, ((nextPos - currentPos - labelWidth) / 2));
        // Can't simply take center of inter-tick region and alignCenter() for last label treatment if the label is going to be truncated
        // Instead, align right and manually calculate label placement
        if (isRTL)
          label.alignRight();
        horizPos = Math.max(currentPos, (currentPos + ((nextPos - currentPos) / 2)) - (labelWidth / 2));
      }
      else
      {
        maxLength = nextPos - currentPos;
        // take center of inter-tick region and alignCenter()
        horizPos = currentPos + ((nextPos - currentPos) / 2);
        label.alignCenter(); // set horizontal bounding box reference point to be horizontally center
      }
      var labelY = labelStart + ((axisEnd - labelStart) / 2);
      var labelX = !isRTL ? horizPos : length - horizPos;
      DvtTimeAxisRenderer._addAxisLabel(block, label, labelX, labelY, maxLength, maxLabelHeight, labelClass, truncateStart);
    }
  }
};


/**
 * Adds an axis label.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.OutputText} label The label text object
 * @param {number} x The x coordinate of the label bounding box's reference point
 * @param {number} y The y coordinate of the label (assuming bounding box's reference point at vertical center of the label)
 * @param {number} maxLength The maximum length of the label area
 * @param {number} maxHeight The maximum height of the label area
 * @param {string=} labelClass The class to be applied on the text element
 * @param {boolean=} truncateStart Whether to truncate beginning characters and add ellipses to the front (as opposed to normal truncation and ellipsis from the back)
 * @private
 */
DvtTimeAxisRenderer._addAxisLabel = function(container, label, x, y, maxLength, maxHeight, labelClass, truncateStart)
{
  var fit = dvt.TextUtils.fitText(label, maxLength, maxHeight, container);

  if (truncateStart && label.isTruncated() && fit)
  {
    // label truncated from the back at this point. Since truncation from the start is desired,
    // manually move the ellipsis to the front and add/remove characters accordingly
    var textString = label.getTextString();
    var untruncatedTextString = label.getUntruncatedTextString();
    if (textString !== untruncatedTextString)
    {
      var numTruncatedChars = label.getTextString().length - 1;
      var indexEnd = untruncatedTextString.length;
      var indexStart = Math.max(0, indexEnd - numTruncatedChars);
      var truncatedStartString = dvt.OutputText.ELLIPSIS + untruncatedTextString.substring(indexStart, indexEnd);
      label.setTextString(truncatedStartString);
    }
  }

  label.setX(x);
  dvt.TextUtils.centerTextVertically(label, y); // align text vertically

  if (labelClass)
    label.getElem().setAttribute('class', labelClass);
};

/**
 * Adds a tick mark.
 * @param {dvt.Context} context The rendering context.
 * @param {dvt.Container} container The container to render into.
 * @param {number} x1 The x coordinate of an endpoint of the tick line
 * @param {number} x2 The x coordinate of the other  endpoint of the tick line
 * @param {number} y1 The y coordinate of an endpoint of the tick line
 * @param {number} y2 The y coordinate of the other endpoint of the tick line
 * @param {dvt.Stroke} stroke The stroke of the tick mark.
 * @param {string} id The id of the tick mark
 * @param {string=} tickClass The class to be applied on the line element
 * @return {dvt.Line}
 * @private
 */
DvtTimeAxisRenderer._addTick = function(context, container, x1, x2, y1, y2, stroke, id, tickClass)
{
  var line = new dvt.Line(context, x1, y1, x2, y2, id);
  line.setStroke(stroke);
  line.setPixelHinting(true);

  container.addChild(line);
  if (tickClass)
    line.getElem().setAttribute('class', tickClass);

  return line;
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/**
 * Style related utility functions for dvt.TimeAxis.
 * @class
 */
var DvtTimeAxisStyleUtils = new Object();

dvt.Obj.createSubclass(DvtTimeAxisStyleUtils, dvt.Obj);

/**
 * The default Axis border-width.
 * @const
 */
DvtTimeAxisStyleUtils.DEFAULT_BORDER_WIDTH = 1;

/**
 * The default Axis separator width.
 * @const
 */
DvtTimeAxisStyleUtils.DEFAULT_SEPARATOR_WIDTH = 1;

/**
 * The default Axis interval width.
 * @const
 */
DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_WIDTH = 50;

/**
 * The default Axis interval height.
 * @const
 */
DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_HEIGHT = 21;

/**
 * The default Axis interval padding.
 * @const
 */
DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING = 2;

/**
 * Gets the axis style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The axis style.
 */
DvtTimeAxisStyleUtils.getAxisStyle = function(options)
{
  var axisStyles = '';
  var style = DvtTimeAxisStyleUtils.getBackgroudColor(options);
  if (style)
    axisStyles = axisStyles + 'background-color:' + style + ';';
  style = DvtTimeAxisStyleUtils.getBorderColor(options);
  if (style)
    axisStyles = axisStyles + 'border-color:' + style + ';';
  style = DvtTimeAxisStyleUtils.getBorderWidth();
  if (style)
    axisStyles = axisStyles + 'border-width:' + style + ';';
  return axisStyles;
};

/**
 * Gets the axis background-color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The axis background-color.
 */
DvtTimeAxisStyleUtils.getBackgroudColor = function(options)
{
  return options['backgroundColor'];
};

/**
 * Gets the axis border-color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The axis border-color.
 */
DvtTimeAxisStyleUtils.getBorderColor = function(options)
{
  return options['borderColor'];
};

/**
 * Gets the axis border-width.
 * @return {string} The axis border-width.
 */
DvtTimeAxisStyleUtils.getBorderWidth = function()
{
  return DvtTimeAxisStyleUtils.DEFAULT_BORDER_WIDTH;
};

/**
 * Gets the axis label style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {dvt.CSSStyle} The axis label style.
 */
DvtTimeAxisStyleUtils.getAxisLabelStyle = function(options)
{
  return options['labelStyle'];
};

/**
 * Gets the axis separator color.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The axis separator color.
 */
DvtTimeAxisStyleUtils.getSeparatorColor = function(options)
{
  return options['separatorColor'];
};

/**
 * Gets the axis separator style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The axis separator style.
 */
DvtTimeAxisStyleUtils.getAxisSeparatorStyle = function(options)
{
  var separatorStyles = '';
  var style = DvtTimeAxisStyleUtils.getSeparatorColor(options);
  if (style)
    separatorStyles = separatorStyles + 'color:' + style + ';';
  return separatorStyles;
};

/**
 * Gets the axis class.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string|undefined} The axis class.
 */
DvtTimeAxisStyleUtils.getAxisClass = function(options)
{
  return options['_resources'] ? options['_resources']['axisClass'] : undefined;
};

/**
 * Gets the axis border class.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string|undefined} The axis class.
 */
DvtTimeAxisStyleUtils.getAxisBorderClass = function(options)
{
  return options['_resources'] ? options['_resources']['axisBorderClass'] : undefined;
};

/**
 * Gets the axis label class.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string|undefined} The axis label class.
 */
DvtTimeAxisStyleUtils.getAxisLabelClass = function(options)
{
  return options['_resources'] ? options['_resources']['axisLabelClass'] : undefined;
};

/**
 * Gets the axis separator class.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string|undefined} The axis separator class.
 */
DvtTimeAxisStyleUtils.getAxisSeparatorClass = function(options)
{
  return options['_resources'] ? options['_resources']['axisSeparatorClass'] : undefined;
};

/**
 * Gets whether border top is visible.
 * @param {object} options The object containing data and specifications for the component.
 * @return {boolean} whether the border top is visible.
 */
DvtTimeAxisStyleUtils.isBorderTopVisible = function(options)
{
  return options['_resources'] ? options['_resources']['borderTopVisible'] : false;
};

/**
 * Gets whether border right is visible.
 * @param {object} options The object containing data and specifications for the component.
 * @return {boolean} whether the border right is visible.
 */
DvtTimeAxisStyleUtils.isBorderRightVisible = function(options)
{
  return options['_resources'] ? options['_resources']['borderRightVisible'] : false;
};

/**
 * Gets whether border bottom is visible.
 * @param {object} options The object containing data and specifications for the component.
 * @return {boolean} whether the border bottom is visible.
 */
DvtTimeAxisStyleUtils.isBorderBottomVisible = function(options)
{
  return options['_resources'] ? options['_resources']['borderBottomVisible'] : false;
};

/**
 * Gets whether border left is visible.
 * @param {object} options The object containing data and specifications for the component.
 * @return {boolean} whether the border left is visible.
 */
DvtTimeAxisStyleUtils.isBorderLeftVisible = function(options)
{
  return options['_resources'] ? options['_resources']['borderLeftVisible'] : false;
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
