(function() {
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojlocaledata'], function (exports, oj, LocaleData) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  /**
   * @license
   * Copyright (c) 2015 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @namespace TimeUtils
   * @since 2.1.0
   * @public
   * @export
   * @hideconstructor
   * @ojtsmodule
   * @ojtsimport {module: "ojgantt", type: "AMD", imported:["ojGantt"]}
   * @classdesc
   * This class provides time utility functions useful for working with ojTimeAxis and ojGantt.
   */

  var TimeUtils = {};

  oj._registerLegacyNamespaceProp('TimeUtils', TimeUtils);
  /**
   * Calculates the position of a given time point relative to the width of a given time range, e.g.
   * useful for calculating the start position of a task bar based on its start time and the given time axis range and width.
   * @param {(Date|string|number)} time the time point of interest, where rangeStartTime <= time <= rangeEndTime
   * @param {(Date|string|number)} rangeStartTime the lower bound of the time range of interest
   * @param {(Date|string|number)} rangeEndTime the upper bound of the time range of interest
   * @param {number} rangeWidth the width of the time range of interest
   * @return {number} the position of the time relative to the width of the time range.
   * @export
   * @static
   * @memberof! TimeUtils
   */


  TimeUtils.getPosition = function (time, rangeStartTime, rangeEndTime, rangeWidth) {
    var _time = new Date(time).getTime();

    var _rangeStartTime = new Date(rangeStartTime).getTime();

    var _rangeEndTime = new Date(rangeEndTime).getTime();

    var numerator = (_time - _rangeStartTime) * rangeWidth;
    var denominator = _rangeEndTime - _rangeStartTime;

    if (numerator === 0 || denominator === 0) {
      return 0;
    }

    return numerator / denominator;
  };
  /**
   * Calculates the distance between two time points relative to the width of a given time range, e.g.
   * useful for calculating the length of a task bar given the start and end time, and the time axis range and width.
   * Expects rangeStartTime <= startTime <= endTime <= rangeEndTime.
   * @param {(Date|string|number)} startTime the start time of interest
   * @param {(Date|string|number)} endTime the end time of interest
   * @param {(Date|string|number)} rangeStartTime the lower bound of the time range of interest
   * @param {(Date|string|number)} rangeEndTime the upper bound of the time range of interest
   * @param {number} rangeWidth the width of the time range of interest
   * @return {number} the distance between the startTime and endTime positions relative to the width of the time range.
   * @export
   * @static
   * @memberof! TimeUtils
   */


  TimeUtils.getLength = function (startTime, endTime, rangeStartTime, rangeEndTime, rangeWidth) {
    var _startTime = new Date(startTime).getTime();

    var _endTime = new Date(endTime).getTime();

    var _rangeStartTime = new Date(rangeStartTime).getTime();

    var _rangeEndTime = new Date(rangeEndTime).getTime();

    var startPos = TimeUtils.getPosition(_startTime, _rangeStartTime, _rangeEndTime, rangeWidth);
    var endPos = TimeUtils.getPosition(_endTime, _rangeStartTime, _rangeEndTime, rangeWidth);
    return endPos - startPos;
  };
  /**
   * Calculates the date/time of a given position point relative to the width of a given time range.
   * @param {number} pos the position of interest
   * @param {(Date|string|number)} rangeStartTime the lower bound of the time range of interest
   * @param {(Date|string|number)} rangeEndTime the upper bound of the time range of interest
   * @param {number} rangeWidth the width of the time range of interest
   * @return {number} the date in milliseconds since midnight Jan 1 1970 corresponding to the provided position and time range width.
   * @export
   * @static
   * @memberof! TimeUtils
   */


  TimeUtils.getDate = function (pos, rangeStartTime, rangeEndTime, rangeWidth) {
    var _rangeStartTime = new Date(rangeStartTime).getTime();

    var _rangeEndTime = new Date(rangeEndTime).getTime();

    var number = pos * (_rangeEndTime - _rangeStartTime);

    if (number === 0 || rangeWidth === 0) {
      return _rangeStartTime;
    }

    return number / rangeWidth + _rangeStartTime;
  };
  /**
   * Calculates reference objects representing all weekends between the given start and end dates.
   * @param {string} start The start date in ISO string format.
   * @param {string} end The end date in ISO string format.
   * @return {Array.<Object>} Reference objects representing all weekends between the given start and end dates.
   * @export
   * @static
   * @memberof! TimeUtils
   * @ojsignature {target: "Type", for: "returns", jsdocOverride: true, value: "Array<oj.ojGantt.ReferenceObject>"}
   */


  TimeUtils.getWeekendReferenceObjects = function (start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var startTime = startDate.getTime();
    var endTime = endDate.getTime();

    if (endTime <= startTime) {
      return [];
    }

    var dayDuration = 1000 * 60 * 60 * 24;
    var weekDuration = dayDuration * 7;
    var weekendStart = LocaleData.getWeekendStart();
    var weekeendEnd = LocaleData.getWeekendEnd(); // Number of days in weekend

    var weekendLength = weekeendEnd >= weekendStart ? weekeendEnd - weekendStart + 1 : weekeendEnd + 7 - weekendStart + 1; // Weekend duration in ms

    var weekendDuration = weekendLength * dayDuration;
    var startDay = startDate.getDay();
    var weekendStartOffset = weekendStart >= startDay ? weekendStart - startDay : weekendStart + 7 - startDay;
    var firstWeekendTime = startDate.setHours(0, 0, 0, 0) + weekendStartOffset * dayDuration;
    var referenceObjects = [];

    for (var refStartTime = firstWeekendTime; refStartTime <= endTime; refStartTime += weekDuration) {
      var refEndTime = refStartTime + weekendDuration - 1;
      referenceObjects.push({
        type: 'area',
        start: new Date(refStartTime).toISOString(),
        end: new Date(refEndTime).toISOString()
      });
    }

    return referenceObjects;
  };

  var getPosition = TimeUtils.getPosition;
  var getLength = TimeUtils.getLength;
  var getDate = TimeUtils.getDate;
  var getWeekendReferenceObjects = TimeUtils.getWeekendReferenceObjects;
  exports.getDate = getDate;
  exports.getLength = getLength;
  exports.getPosition = getPosition;
  exports.getWeekendReferenceObjects = getWeekendReferenceObjects;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())