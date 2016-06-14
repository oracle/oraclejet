/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

/**
 *
 * @param {type} context
 * @param {type} callback
 * @param {type} callbackObj
 * @class
 * @constructor
 * @extends {dvt.BaseComponent}
 * @return {undefined}
 */
dvt.TimeAxis = function(context, callback, callbackObj)
{
  this.Init(context, callback, callbackObj);
};

dvt.Obj.createSubclass(dvt.TimeAxis, dvt.BaseComponent);

dvt.TimeAxis.DEFAULT_INTERVAL_WIDTH = 50;
dvt.TimeAxis.DEFAULT_INTERVAL_HEIGHT = 21;
dvt.TimeAxis.DEFAULT_INTERVAL_PADDING = 2;
dvt.TimeAxis.DEFAULT_BORDER_WIDTH = 1;
dvt.TimeAxis.DEFAULT_SEPARATOR_WIDTH = 1;

/**
 * Returns a new instance of dvt.TimeAxis.
 * @param {dvt.Context} context The rendering context.
 * @param {string} callback The function that should be called to dispatch component events.
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

dvt.TimeAxis.prototype.Init = function(context, callback, callbackObj)
{
  dvt.TimeAxis.superclass.Init.call(this, context);

  this._calendar = new DvtTimeAxisCalendar();
  this._borderWidth = dvt.TimeAxis.DEFAULT_BORDER_WIDTH;
  this._dateToIsoConverter = context.getLocaleHelpers()['dateToIsoConverter'];
};

dvt.TimeAxis.prototype.setScale = function(scale)
{
  this._scale = scale;
};

dvt.TimeAxis.prototype.setTimeZoneOffsets = function(timeZoneOffsets)
{
  this._timeZoneOffsets = timeZoneOffsets;
};

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

dvt.TimeAxis.prototype.setConverter = function(converter)
{
  this._converter = converter;
};

dvt.TimeAxis.prototype.setDefaultConverter = function(defaultConverter)
{
  this._defaultConverter = defaultConverter;
};

dvt.TimeAxis.prototype.getContentSize = function()
{
  return this._contentSize;
};

dvt.TimeAxis.prototype.setContentSize = function(contentSize)
{
  if (contentSize > this._contentSize)
    this._contentSize = contentSize;
};

dvt.TimeAxis.prototype.getTimeAxisWidth = function()
{
  // read from skin?
  if (this._timeAxisWidth == null)
    this._timeAxisWidth = 30;

  return this._timeAxisWidth;
};

dvt.TimeAxis.prototype.setBorderWidth = function(borderWidth)
{
  this._borderWidth = borderWidth;
};

dvt.TimeAxis.prototype.getBorderWidth = function()
{
  return this._borderWidth;
};

dvt.TimeAxis.prototype.getSize = function()
{
  return this._contentSize + (this._borderWidth * 2);
};

dvt.TimeAxis.prototype.setType = function(type, dateFormatStrings)
{
  // create a new formatter based on the new type
  this._formatter = new DvtTimeAxisFormatter(type == 'short' ? DvtTimeAxisFormatter.SHORT : DvtTimeAxisFormatter.LONG, dateFormatStrings);
};

// utility method: find the closiest date to the time scale of the specified date
dvt.TimeAxis.prototype.adjustDate = function(date)
{
  return this._calendar.adjustDate(new Date(date), this._scale);
};

dvt.TimeAxis.prototype.getNextDate = function(time)
{
  return this._calendar.getNextDate(time, this._scale);
};

dvt.TimeAxis.prototype.formatDate = function(date)
{
  if (this._converter)
  {
    var converter;
    if (this._converter[this._scale])
      converter = this._converter[this._scale];
    else if (this._converter['default'])
      converter = this._converter['default'];
    else
      converter = this._converter;

    if (converter['format'])
      return converter['format'](this._dateToIsoConverter ? this._dateToIsoConverter(date) : date);
    else if (converter['getAsString'])
      return converter['getAsString'](date);
  }
  if (this._defaultConverter)
  {
    if (this._defaultConverter[this._scale])
    {
      converter = this._defaultConverter[this._scale];
      if (converter['format'])
        return converter['format'](this._dateToIsoConverter ? this._dateToIsoConverter(date) : date);
      else if (converter['getAsString'])
        return converter['getAsString'](date);
    }
  }
  return this._formatter.format(date, this._scale, this._timeZoneOffsets);
};

dvt.TimeAxis.prototype.getZoomOrder = function()
{
  return this._zoomOrder;
};

dvt.TimeAxis.prototype.setZoomOrder = function(zoomOrder)
{
  this._zoomOrder = zoomOrder;
};

dvt.TimeAxis.prototype.setIsVertical = function(isVertical)
{
  if (isVertical)
    this._contentSize = dvt.TimeAxis.DEFAULT_INTERVAL_WIDTH;
  else
    this._contentSize = dvt.TimeAxis.DEFAULT_INTERVAL_HEIGHT;
};
// todo: this should be used by Timeline also
var DvtTimeAxisCalendar = function(options) 
{
  this.Init(options);
};

dvt.Obj.createSubclass(DvtTimeAxisCalendar, dvt.Obj);

DvtTimeAxisCalendar.prototype.Init = function() 
{
  this._dayInMillis = 1000 * 60 * 60 * 24;
};

DvtTimeAxisCalendar.prototype.getFirstDayOfWeek = function()
{
  // sunday; locale based
  return 0;
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
  if (scale == 'seconds')
    return new Date(time + 1000);
  else if (scale == 'minutes')
    return new Date(time + 60000);
  else if (scale == 'hours')
    return new Date(time + 3600000);
  // for larger scales, no set amount of time can be added
  var _nextDate = new Date(time);
  if (scale == 'days')
    _nextDate.setDate(_nextDate.getDate() + 1);
  else if (scale == 'weeks')
    _nextDate.setDate(_nextDate.getDate() + 7);
  else if (scale == 'months')
    _nextDate.setMonth(_nextDate.getMonth() + 1);
  else if (scale == 'quarters')
    _nextDate.setMonth(_nextDate.getMonth() + 3);
  else if (scale == 'halfyears')
    _nextDate.setMonth(_nextDate.getMonth() + 6);
  else if (scale == 'years')
    _nextDate.setFullYear(_nextDate.getFullYear() + 1);
  else if (scale == 'twoyears')
    _nextDate.setFullYear(_nextDate.getFullYear() + 2);
  else
  {
    // circuit breaker
    _nextDate.setYear(_nextDate.getYear() + 1);
  }
  return _nextDate;
};
var DvtTimeAxisFormatter = function(type, locale) 
{
  this.Init(type, locale);
};

dvt.Obj.createSubclass(DvtTimeAxisFormatter, dvt.Obj);

DvtTimeAxisFormatter.LONG = 0;
DvtTimeAxisFormatter.SHORT = 1;

DvtTimeAxisFormatter.prototype.Init = function(type, dateFormatStrings) 
{
  this._type = type;
  this._dateFormatStrings = dateFormatStrings;

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
    return date.toLocaleString();
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

  return dvt;
});
