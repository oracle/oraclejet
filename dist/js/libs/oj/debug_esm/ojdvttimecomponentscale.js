/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @since 11.0.0
 * @interface
 * @export
 * @ojsignature {target: "Type",
 *               value: "interface DvtTimeComponentScale"}
 *
 * @classdesc
 *
 * <h3 id="overview-section">
 * JET DvtTimeComponentScale
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview-section"></a>
 * </h3>
 * <p>The interface for DvtTimeComponentScale. An instance of this interface defines a timescale,
 *    which can be used in the scale and/or zoom-order attributes of {@link oj.ojTimeline}, {@link oj.ojGantt},
 *    or {@link oj.ojTimeAxis}. When using a custom timescale instance, the scale value in viewportChange
 *    event's payload will be the instance's "name" field value instead of the instance itself.</p>
 *
 * <h3 id="formats-section">
 *   Date and Time Formats
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#formats-section"></a>
 * </h3>
 *
 *<p>The date/time data in the DvtTimeComponentScale plays a key role, not only in the representation of events in the order in which they occurred, but also in many other places, such as the time axis, event durations, time markers, size and position calculations for the overview locator window, etc.</p>
 *<p>The DvtTimeComponentScale supports a simplified version of the ISO 8601 extended date/time format. The format is as follows: <font color="#4B8A08">YYYY-MM-DDTHH:mm:ss.sssZ</font></p>
 *<table  class="keyboard-table">
 *<thead>
 *<tr>
 *<th>Symbol</th>
 *<th>Description</th>
 *<th>Values</th>
 *<th>Examples</th>
 *</tr>
 </thead>
 <tbody>
 *<tr>
 *<td><font color="#4B8A08">-, :, .,T</font></td><td>Characters actually in the string. T specifies the start of a time.</td><td></td><td></td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">YYYY</font></td><td>Year</td><td></td><td rowspan="3">2013-03-22<br>2014-02</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">MM</font></td><td>Month</td><td>01 to 12</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">DD</font></td><td>Day of the month</td><td>01 to 31</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">HH</font></td><td>Hours</td><td>00 to 24</td><td rowspan="3">2013-02-04T15:20Z<br>2013-02-10T15:20:45.300Z</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">mm</font></td><td>Minutes</td><td>00 to 59</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">ss</font></td><td>Seconds. The seconds and milliseconds are optional if a time is specified.</td><td>00 to 59</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">sss</font></td><td>Milliseconds</td><td>00 to 999</td><td></td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">Z</font></td><td>The value in this position can be one of the following. If the value is omitted, character 'Z' should be used to specify UTC time.<br><ul><li><b>Z</b> indicates UTC time.</li><li><b>+hh:mm</b> indicates that the input time is the specified offset after UTC time.</li><li><b>-hh:mm</b> indicates that the input time is the absolute value of the specified offset before UTC time.</li></ul></td><td></td><td>2013-02-04T15:20:00-07:00<br>2013-02-04T15:20:00+05:00<br>2013-02-04T15:20:00Z</td>
 *</tr>
 *</tbody>
 *</table>
 *<p>The ISO format support short notations where the string must only include the date and not time, as in the following formats: YYYY, YYYY-MM, YYYY-MM-DD.</p>
 *<p>The ISO format does not support time zone names. You can use the Z position to specify an offset from UTC time. If you do not include a value in the Z position, UTC time is used. The correct format for UTC should always include character 'Z' if the offset time value is omitted. The date-parsing algorithms are browser-implementation-dependent and, for example, the date string '2013-02-27T17:00:00' will be parsed differently in Chrome vs Firefox vs IE.</p>
 *<p>You can specify midnight by using 00:00, or by using 24:00 on the previous day. The following two strings specify the same time: 2010-05-25T00:00Z and 2010-05-24T24:00Z.</p>
 *
 *
 */

const DvtTimeComponentScale = function () {};

/**
 * Name of this scale. This value is provided in the viewportChange event payload of the consuming
 * time component to identify this timescale.
 * See [Timeline viewportChange]{@link oj.ojTimeline#event:viewportChange} and [Gantt viewportChange]{@link oj.ojGantt#event:viewportChange} for more information.
 *
 * @since 11.0.0
 * @export
 * @expose
 * @memberof DvtTimeComponentScale
 * @instance
 * @name name
 * @type {string}
 */

/**
 * The position of the label relative to its time interval. This only takes effect on horizontal time axes. The behavior of "auto" varies based on consuming component and theme.
 * @since 11.1.0
 * @export
 * @expose
 * @memberof DvtTimeComponentScale
 * @instance
 * @name labelPosition
 * @type {?string}
 * @ojvalue {string} "start"
 * @ojvalue {string} "center"
 * @ojvalue {string} "auto"
 * @ojsignature {target: "Type", value: '?("start"|"center"|"auto")'}
 * @default "auto"
 */

/**
 * Formats the given date into a label used for display.
 * @param {string} date The date to be formatted.
 *                  See <a href="#formats-section">datetime formatting</a> for more details on the required string format.
 * @return {string} The formatted label.
 * @export
 * @expose
 * @method
 * @name formatter
 * @memberof DvtTimeComponentScale
 * @instance
 */

/**
 * Takes in a date representing the start of an interval in this scale, and returns the date representing
 * the end of the interval. For example, if the scale is weeks and begins on Sundays, and the input date
 * represents Sunday January 3, 2021, then the returned date should represent Sunday, January 10, 2021.
 * @param {string} date A date representing the start of an interval in this scale.
 *                  See <a href="#formats-section">datetime formatting</a> for more details on the required string format.
 * @return {string} The date representing the end of the interval. See <a href="#formats-section">datetime formatting</a>
 *                  for more details on the required string format.
 * @export
 * @expose
 * @method
 * @name getNextDate
 * @memberof DvtTimeComponentScale
 * @instance
 */

/**
 * Takes in an arbitrary date, and returns the date representing the start of the interval in this scale
 * that the specified date belongs to. For example, if the scale is weeks and begins on Sunday, and the
 * input date represents Thursday, January 7, 2021, then the returned date should represent Sunday, January 3, 2021.
 * @param {string} date The query date.
 *                  See <a href="#formats-section">datetime formatting</a> for more details on the required string format.
 * @return {string} The date representing the start of the interval in this scale that the specified date
 *                  belongs to. See <a href="#formats-section">datetime formatting</a> for more details on the
 *                  required string format.
 * @export
 * @expose
 * @method
 * @name getPreviousDate
 * @memberof DvtTimeComponentScale
 * @instance
 */
