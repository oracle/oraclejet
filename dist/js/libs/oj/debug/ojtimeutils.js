/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base'], function (oj, $, comp, base)
{
/**
  * Copyright (c) 2015, Oracle and/or its affiliates.
  * All rights reserved.
  */

/**
 * @class Utility methods for time position calculations
 * @since 2.1.0
 * @public
 * @export 
 *
 * @classdesc
 * This class provides functions related to time to position conversions and vice versa.
 *
 */
oj.TimeUtils = function() {};

/**
 * Calculates the position of a given time point relative to the width of a given time range, e.g.
 * useful for calculating the start position of a task bar based on its start time and the given time axis range and width.
 * @param {Date | string | number} time the time point of interest, where rangeStartTime <= time <= rangeEndTime
 * @param {Date | string | number} rangeStartTime the lower bound of the time range of interest
 * @param {Date | string | number} rangeEndTime the upper bound of the time range of interest
 * @param {number} rangeWidth the width of the time range of interest
 * @return {number} the position of the time relative to the width of the time range.
 * @export
 */
oj.TimeUtils.getPosition = function(time, rangeStartTime, rangeEndTime, rangeWidth)
{
	time = (new Date(time)).getTime();
	rangeStartTime = (new Date(rangeStartTime)).getTime();
	rangeEndTime = (new Date(rangeEndTime)).getTime();

	var numerator = (time - rangeStartTime) * rangeWidth;
	var denominator = (rangeEndTime - rangeStartTime);
	if (numerator == 0 || denominator == 0)
		return 0;
	return numerator / denominator;
};

/**
 * Calculates the distance between two time points relative to the width of a given time range, e.g.
 * useful for calculating the length of a task bar given the start and end time, and the time axis range and width.
 * Expects rangeStartTime <= startTime <= endTime <= rangeEndTime.
 * @param {Date | string | number} startTime the start time of interest
 * @param {Date | string | number} endTime the end time of interest
 * @param {Date | string | number} rangeStartTime the lower bound of the time range of interest
 * @param {Date | string | number} rangeEndTime the upper bound of the time range of interest
 * @param {number} rangeWidth the width of the time range of interest
 * @return {number} the distance between the startTime and endTime positions relative to the width of the time range.
 * @export
 */
oj.TimeUtils.getLength = function(startTime, endTime, rangeStartTime, rangeEndTime, rangeWidth)
{
	var startPos, endPos;
	startTime = (new Date(startTime)).getTime();
	endTime = (new Date(endTime)).getTime();
	rangeStartTime = (new Date(rangeStartTime)).getTime();
	rangeEndTime = (new Date(rangeEndTime)).getTime();
	
	startPos = oj.TimeUtils.getPosition(startTime, rangeStartTime, rangeEndTime, rangeWidth);
	endPos = oj.TimeUtils.getPosition(endTime, rangeStartTime, rangeEndTime, rangeWidth);
	return endPos - startPos;
};

/**
 * Calculates the date/time of a given position point relative to the width of a given time range.
 * @param {number} pos the position of interest
 * @param {Date | string | number} rangeStartTime the lower bound of the time range of interest
 * @param {Date | string | number} rangeEndTime the upper bound of the time range of interest
 * @param {number} rangeWidth the width of the time range of interest
 * @return {number} the date in milliseconds since midnight Jan 1 1970 corresponding to the provided position and time range width.
 * @export
 */
oj.TimeUtils.getDate = function(pos, rangeStartTime, rangeEndTime, rangeWidth)
{
	rangeStartTime = (new Date(rangeStartTime)).getTime();
	rangeEndTime = (new Date(rangeEndTime)).getTime();

	var number = pos * (rangeEndTime - rangeStartTime);
	if (number == 0 || rangeWidth == 0)
		return rangeStartTime;
	return (number / rangeWidth) + rangeStartTime;
};
});
