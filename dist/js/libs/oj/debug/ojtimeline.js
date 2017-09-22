/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojtime-base', 'ojs/internal-deps/dvt/DvtTimeline'], function (oj, $, comp, base, dvt)
{
/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Timeline Item</td>
 *       <td>Tap</td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Timeline Panel</td>
 *       <td>Drag</td>
 *       <td>Paning: navigate forward and backward in time in horizontal/vertical orientation.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan>Pinch-Close/Spread-Open</td>
 *       <td>Zoom In/Out.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Zoom Control</td>
 *       <td>Tap on "+" element</td>
 *       <td>Zoom In.</td>
 *     </tr>
 *     <tr>
 *       <td>Tap on "-" element</td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Overview</td>
 *       <td>Press on right/left side of window & Hold & Drag in right of left direction</td>
 *       <td>Zoom In/Out (resize overview window).</td>
 *     </tr>
 *     <tr>
 *       <td>Press & Hold on the body of window & Drag in right of left direction</td>
 *       <td>Pan (move overview window).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojTimeline
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td rowspan="2">Moves focus between series in a Dual Timeline and does nothing in a Single Timeline.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection to previous data item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection to next data item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>Move focus and multi-select next data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and multi-select next data item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>Move focus to previous data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>Move focus to next data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus to previous data item (on left), without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus to next data item (on right), without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select data item with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>= or +</kbd></td>
 *       <td>Zoom in one level if zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>- or _</kbd></td>
 *       <td>Zoom out one level if zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Pan up if scrolling is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Pan down if scrolling is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageUp</kbd></td>
 *       <td>Pan left in left-to-right locales. Pan right in right-to-left locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageDown</kbd></td>
 *       <td>Pan right in left-to-right locales. Pan left in right-to-left locales.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTimeline
 */

/**
 *<p>The date/time data in the Timeline plays a key role, not only in the representation of events in the order in which they occurred, but also in many other places, such as the time axis, event durations, time markers, size and position calculations for the overview locator window, etc.</p>
 *<p>The Timeline supports a simplified version of the ISO 8601 extended date/time format. The format is as follows: <font color="#4B8A08">YYYY-MM-DDTHH:mm:ss.sssZ</font></p>
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
 * @ojfragment formatsDoc
 * @memberof oj.ojTimeline
 */

/**
 *<p>The application is responsible for populating the shortDesc value in the component options object with meaningful descriptors when the component does not provide a default descriptor. Since component terminology for keyboard and touch shortcuts can conflict with those of the application, it is the application's responsibility to provide these shortcuts, possibly via a help popup.</p>
 *
 * @ojfragment a11yDoc
 * @memberof oj.ojTimeline
 */
/**
 * Defines the animation that is applied on data changes.
 * @expose
 * @name animationOnDataChange
 * @memberof oj.ojTimeline
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * Defines the animation that is shown on initial display.
 * @expose
 * @name animationOnDisplay
 * @memberof oj.ojTimeline
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * The end time of the timeline. This is required in order for the timeline to properly render.
 * @expose
 * @name end
 * @memberof oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define a timeline axis. This is required in order for the timeline to properly render.
 * @expose
 * @name minorAxis
 * @memberof oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the labels of the minor axis. If not specified, the default converter is used. If a single converter is specified, it will be used for all 'scale' values. Otherwise, an object whose keys are 'scale' values that map to the converter instances is expected. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) to use for all 'scale' values that do not otherwise have a converter object provided. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.default
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'seconds' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.seconds
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'minutes' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.minutes
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'hours' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.hours
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'days' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.days
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'weeks' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.weeks
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'months' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.months
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'quarters' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.quarters
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'years' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.years
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The time scale used for the minor axis. This is required in order for the timeline to properly render.
 * @expose
 * @name minorAxis.scale
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @ojvalue {string} "seconds"
 * @ojvalue {string} "minutes"
 * @ojvalue {string} "hours"
 * @ojvalue {string} "days"
 * @ojvalue {string} "weeks"
 * @ojvalue {string} "months"
 * @ojvalue {string} "quarters"
 * @ojvalue {string} "years"
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining any additional styling of the axis. If not specified, no additional styling will be applied.
 * @expose
 * @name minorAxis.svgStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of strings containing the names of scales used for zooming from longest to shortest. If not specified, the 'scale' specified on the minor axis will be used at all zoom levels.
 * @expose
 * @name minorAxis.zoomOrder
 * @memberof! oj.ojTimeline
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define a timeline axis. If not specified, no axis labels will be shown above the minor axis or in the overview.
 * @expose
 * @name majorAxis
 * @memberof oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the labels of the major axis. If not specified, the default converter is used. If a single converter is specified, it will be used for all 'scale' values. Otherwise, an object whose keys are 'scale' values that map to the converter instances is expected. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) to use for all 'scale' values that do not otherwise have a converter object provided. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.default
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'seconds' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.seconds
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'minutes' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.minutes
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'hours' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.hours
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'days' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.days
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'weeks' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.weeks
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'months' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.months
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'quarters' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.quarters
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'years' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.years
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The time scale used for the major axis. If not specified, no axis labels will be shown above the minor axis or in the overview.
 * @expose
 * @name majorAxis.scale
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @ojvalue {string} "seconds"
 * @ojvalue {string} "minutes"
 * @ojvalue {string} "hours"
 * @ojvalue {string} "days"
 * @ojvalue {string} "weeks"
 * @ojvalue {string} "months"
 * @ojvalue {string} "quarters"
 * @ojvalue {string} "years"
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining any additional styling of the axis. If not specified, no additional styling will be applied.
 * @expose
 * @name majorAxis.svgStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The orientation of the element.
 * @expose
 * @name orientation
 * @memberof oj.ojTimeline
 * @instance
 * @type {string}
 * @ojvalue {string} "vertical"
 * @ojvalue {string} "horizontal"
 * @default <code class="prettyprint">"horizontal"</code>
 */
/**
 * An object with the following properties, used to define a timeline overview. If not specified, no overview will be shown.
 * @expose
 * @name overview
 * @memberof oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies whether the overview scrollbar is rendered.
 * @expose
 * @name overview.rendered
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default <code class="prettyprint">"off"</code>
 */
/**
 * The CSS style defining any additional styling of the overview. If not specified, no additional styling will be applied.
 * @expose
 * @name overview.svgStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The array of reference objects associated with the timeline. For each reference object, a line is rendered at the specified value. Currently only the first reference object in the array is supported. Any additional objects supplied in the array will be ignored.
 * @expose
 * @name referenceObjects
 * @memberof oj.ojTimeline
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The value of this reference object. If not specified, no reference object will be shown.
 * @expose
 * @name referenceObjects[].value
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of strings containing the ids of the initially selected items.
 * @expose
 * @name selection
 * @memberof oj.ojTimeline
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The type of selection behavior that is enabled on the timeline. If 'single' is specified, only a single item across all series can be selected at once. If 'multiple', any number of items across all series can be selected at once. Otherwise, selection is disabled.
 * @expose
 * @name selectionMode
 * @memberof oj.ojTimeline
 * @instance
 * @type {string}
 * @ojvalue {string} "single"
 * @ojvalue {string} "multiple"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * An array of objects with the following properties, used to define a timeline series. Also accepts a Promise or callback function for deferred data rendering. The function should return one of the following:    <ul> <li>Promise: A Promise that will resolve with an array of data items. No data will be rendered if the Promise is rejected.</li> <li>Array: An array of data items.</li> </ul>
 * @expose
 * @name series
 * @memberof oj.ojTimeline
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text of an empty timeline series.
 * @expose
 * @name series[].emptyText
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The identifier for the timeline series.
 * @expose
 * @name series[].id
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The direction in which items are laid out when in a horizontal orientation. This attribute is ignored when in a vertical orientation.
 * @expose
 * @name series[].itemLayout
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @ojvalue {string} "bottomToTop"
 * @ojvalue {string} "topToBottom"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * An array of objects with the following properties, used to define a timeline item. If not specified, no data will be shown in this series.
 * @expose
 * @name series[].items
 * @memberof! oj.ojTimeline
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The description text displayed on the timeline item. If not specified, no description will be shown.
 * @expose
 * @name series[].items[].description
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The end time of this timeline item. If not specified, no duration bar will be shown.
 * @expose
 * @name series[].items[].end
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color applied to the duration bar of the timeline item. If not specified, this will be determined by the color ramp of the series.
 * @expose
 * @name series[].items[].durationFillColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The identifier for the timeline item. This must be unique across all items in the timeline, and is required in order for the timeline to properly render.
 * @expose
 * @name series[].items[].id
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The start time of this timeline item. This is required in order for the timeline item to properly render.
 * @expose
 * @name series[].items[].start
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining any additional styling of the item. If not specified, no additional styling will be applied.
 * @expose
 * @name series[].items[].svgStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An optional URI specifying the location of an image resource to be displayed on the item. The image will be rendered at 32px x 32px in size. If not specified, no thumbnail will be shown.
 * @expose
 * @name series[].items[].thumbnail
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The title text displayed on the timeline item. If not specified, no title will be shown.
 * @expose
 * @name series[].items[].title
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The label displayed on the timeline series. In not specified, no label will be shown.
 * @expose
 * @name series[].label
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining any additional styling of the series. If not specified, no additional styling will be applied.
 * @expose
 * @name series[].svgStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The start time of the timeline. This is required in order for the timeline to properly render.
 * @expose
 * @name start
 * @memberof oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define default styling for the timeline.
 * @expose
 * @name styleDefaults
 * @memberof oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The duration of the animations, in milliseconds. Also accepts CSS strings such as 1s and 1000ms. For data change animations with multiple stages, this attribute defines the duration of each stage. For example, if an animation contains two stages, the total duration will be two times this attribute's value.
 * @expose
 * @name styleDefaults.animationDuration
 * @memberof! oj.ojTimeline
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the timeline.
 * @expose
 * @name styleDefaults.borderColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define the default styling for the timeline item.
 * @expose
 * @name styleDefaults.item
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The background color of the timeline items.
 * @expose
 * @name styleDefaults.item.backgroundColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the timeline items.
 * @expose
 * @name styleDefaults.item.borderColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the timeline item description text.
 * @expose
 * @name styleDefaults.item.descriptionStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The background color of the highlighted timeline items.
 * @expose
 * @name styleDefaults.item.hoverBackgroundColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the highlighted timeline items.
 * @expose
 * @name styleDefaults.item.hoverBorderColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The background color of the selected timeline items.
 * @expose
 * @name styleDefaults.item.selectedBackgroundColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the selected timeline items.
 * @expose
 * @name styleDefaults.item.selectedBorderColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the timeline item title text.
 * @expose
 * @name styleDefaults.item.titleStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define the default styling for the time axis.
 * @expose
 * @name styleDefaults.minorAxis
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The background color of the time axis.
 * @expose
 * @name styleDefaults.minorAxis.backgroundColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the time axis.
 * @expose
 * @name styleDefaults.minorAxis.borderColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the time axis label text.
 * @expose
 * @name styleDefaults.minorAxis.labelStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the time axis separators.
 * @expose
 * @name styleDefaults.minorAxis.separatorColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define the default styling for the major time axis.
 * @expose
 * @name styleDefaults.majorAxis
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the major time axis label text.
 * @expose
 * @name styleDefaults.majorAxis.labelStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the major time axis separators.
 * @expose
 * @name styleDefaults.majorAxis.separatorColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define the default styling for the timeline overview.
 * @expose
 * @name styleDefaults.overview
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The background color of the timeline overview.
 * @expose
 * @name styleDefaults.overview.backgroundColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the timeline overview label text.
 * @expose
 * @name styleDefaults.overview.labelStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define the default styling for the timeline overview window.
 * @expose
 * @name styleDefaults.overview.window
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The background color of the timeline overview window.
 * @expose
 * @name styleDefaults.overview.window.backgroundColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the timeline overview window.
 * @expose
 * @name styleDefaults.overview.window.borderColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define the default styling for the reference objects.
 * @expose
 * @name styleDefaults.referenceObject
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the reference objects.
 * @expose
 * @name styleDefaults.referenceObject.color
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define the default styling for the timeline series.
 * @expose
 * @name styleDefaults.series
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The background color of the series.
 * @expose
 * @name styleDefaults.series.backgroundColor
 * @memberof! oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The array defining the default color ramp for the series items.
 * @expose
 * @name styleDefaults.series.colors
 * @memberof! oj.ojTimeline
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the series empty text.
 * @expose
 * @name styleDefaults.series.emptyTextStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the series label text.
 * @expose
 * @name styleDefaults.series.labelStyle
 * @memberof! oj.ojTimeline
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The end time of the timeline's viewport. If not specified, this will default to a value determined by the initial 'scale' of the minor axis and the width of the timeline.
 * @expose
 * @name viewportEnd
 * @memberof oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The start time of the timeline's viewport. If not specified, this will default to a value determined by the initial 'scale' of the minor axis and the width of the timeline.
 * @expose
 * @name viewportStart
 * @memberof oj.ojTimeline
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for timeline series items indexed by series and item indices.</p>
 *
 * @property {number} seriesIndex
 * @property {number} itemIndex
 *
 * @ojsubid oj-timeline-item
 * @memberof oj.ojTimeline
 *
 * @example <caption>Gets the second item from the first series:</caption>
 * var node = myComponent.getNodeBySubId({'subId': 'oj-timeline-item', 'seriesIndex': 0, 'itemIndex': 1});
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for timeline series items indexed by series and item indices.</p>
 *
 * @property {number} seriesIndex
 * @property {number} itemIndex
 *
 * @ojnodecontext oj-timeline-item
 * @memberof oj.ojTimeline
 */
/**
 * @ojcomponent oj.ojTimeline
 * @augments oj.dvtTimeComponent
 * @since 1.1.0
 *
 * @classdesc
 * <h3 id="timelineOverview-section">
 * JET Timeline
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#timelineOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Timeline is a themable, WAI-ARIA compliant element that displays a set of events in chronological order.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-timeline
 *   start='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Jan 1, 2016"))}}'
 *   end='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Dec 31, 2016"))}}'
 *   major-axis='{"scale": "months"}'
 *   minor-axis='{"scale": "weeks"}'
 *   series='{{seriesData}}'>
 * &lt;/oj-timeline>
 * </code>
 * </pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"a11yDoc"}
 *
 * <h3 id="formats-section">
 *   Date and Time Formats
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#formats-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"formatsDoc"}
 * 
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Animation</h4>
 * <p>Animation should only be enabled for visualizations of small to medium data sets.</p>
 *
 * <h4>Data Set Size</h4>
 * <p>As a rule of thumb, it's recommended that applications only set usable data
 *    densities on the timeline. For example, applications should limit the number of
 *    overlapping items rendered beyond the height of the timeline. This can be
 *    achieved by increasing the size of the timeline, decreasing the axis scale, or
 *    providing external filters to reduce the amount of data rendered at any given
 *    time. While there are several optimizations within the timeline to deal with
 *    large data sets, it's always more efficient to reduce the data set size as early
 *    as possible. Future optimizations will focus on improving end user experience as
 *    well as developer productivity for common use cases.</p>
 *
 * <h4>Timeline Span</h4>
 *
 * <p>It's recommended that applications limit the number of time intervals that are
 *    rendered by the timeline. For example, a timeline spanning one year with a scale
 *    of hours will display (365 * 24) 8,760 intervals. Rendering this many intervals
 *    can cause severe performance degradation when interacting with the timeline
 *    (scrolling and zooming) regardless of the number of items present.
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojTimeline', $['oj']['dvtTimeComponent'],
{
  widgetEventPrefix: "oj",
  options:
  {
    /**
     * Triggered after the viewport is changed due to a zoom or scroll operation.
     *
     * @property {string} viewportStart the start of the new viewport on a timeline
     * @property {string} viewportEnd the end of the new viewport on a timeline
     * @property {string} minorAxisScale the time scale of the minor axis
     *
     * @expose
     * @event
     * @memberof oj.ojTimeline
     * @instance
     */
    viewportChange: null
  },

  //** @inheritdoc */
  _CreateDvtComponent: function(context, callback, callbackObj)
  {
    return dvt.Timeline.newInstance(context, callback, callbackObj);
  },

  /**
   * @override
   * @instance
   * @memberof oj.ojTimeline
   * @protected
   */
  _ConvertLocatorToSubId : function(locator) {
    var subId = locator['subId'];

    // Convert the supported locators
    if(subId == 'oj-timeline-item') {
      // timelineItem[seriesIndex][itemIndex]
      subId = 'timelineItem[' + locator['seriesIndex'] + '][' + locator['itemIndex'] + ']';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  /**
   * @override
   * @instance
   * @memberof oj.ojTimeline
   * @protected
   */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId.indexOf('timelineItem') == 0) {
      // timelineItem[seriesIndex][itemIndex]
      var indexPath = this._GetIndexPath(subId);

      locator['subId'] = 'oj-timeline-item';
      locator['seriesIndex'] = indexPath[0];
      locator['itemIndex'] = indexPath[1];
    }

    return locator;
  },

  //** @inheritdoc */
  _ProcessStyles: function()
  {
    this._super();
    if (!this.options['styleDefaults'])
      this.options['styleDefaults'] = {};

    if (!this.options['styleDefaults']['series'])
      this.options['styleDefaults']['series'] = {};

    if (!this.options['styleDefaults']['series']['colors'])
    {
      var handler = new oj.ColorAttributeGroupHandler();

      // override default colors with css attribute group colors
      this.options['styleDefaults']['series']['colors'] = handler.getValueRamp();
    }
  },

  //** @inheritdoc */
  _GetComponentStyleClasses: function()
  {
    var styleClasses = this._super();
    styleClasses.push('oj-timeline');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetComponentRendererOptions: function() {
    //the function should be removed if the timeline will support 'tooltip.renderer' attr
    return [];
  },

  //** @inheritdoc */
  _GetChildStyleClasses: function()
  {
    var styleClasses = this._super();

    styleClasses['oj-timeline'] = {'path': 'styleDefaults/borderColor', 'property': 'border-color'};
    styleClasses['oj-timeline-item'] = [
      {'path': 'styleDefaults/item/borderColor', 'property': 'border-color'},
      {'path': 'styleDefaults/item/backgroundColor', 'property': 'background-color'}
    ];
    styleClasses['oj-timeline-item oj-hover'] = [
      {'path': 'styleDefaults/item/hoverBorderColor', 'property': 'border-color'},
      {'path': 'styleDefaults/item/hoverBackgroundColor', 'property': 'background-color'}
    ];
    styleClasses['oj-timeline-item oj-selected'] = [
      {'path': 'styleDefaults/item/selectedBorderColor', 'property': 'border-color'},
      {'path': 'styleDefaults/item/selectedBackgroundColor', 'property': 'background-color'}
    ];
    styleClasses['oj-timeline-item-description'] = {'path': 'styleDefaults/item/descriptionStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-item-title'] = {'path': 'styleDefaults/item/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-major-axis-label'] = {'path': 'styleDefaults/majorAxis/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-major-axis-separator'] = {'path': 'styleDefaults/majorAxis/separatorColor', 'property': 'color'};
    styleClasses['oj-timeline-minor-axis'] = [
      {'path': 'styleDefaults/minorAxis/backgroundColor', 'property': 'background-color'},
      {'path': 'styleDefaults/minorAxis/borderColor', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-minor-axis-label'] = {'path': 'styleDefaults/minorAxis/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-minor-axis-separator'] = {'path': 'styleDefaults/minorAxis/separatorColor', 'property': 'color'};
    styleClasses['oj-timeline-overview'] = {'path': 'styleDefaults/overview/backgroundColor', 'property': 'background-color'};
    styleClasses['oj-timeline-overview-label'] = {'path': 'styleDefaults/overview/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-overview-window'] = [
      {'path': 'styleDefaults/overview/window/backgroundColor', 'property': 'background-color'},
      {'path': 'styleDefaults/overview/window/borderColor', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-reference-object'] = {'path': 'styleDefaults/referenceObject/color', 'property': 'color'};
    styleClasses['oj-timeline-series'] = {'path': 'styleDefaults/series/backgroundColor', 'property': 'background-color'};
    styleClasses['oj-timeline-series-empty-text'] = {'path': 'styleDefaults/series/emptyTextStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-series-label'] = {'path': 'styleDefaults/series/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};

    // Zoom Control Icons
    styleClasses['oj-timeline-zoomin-icon'] = [
      {'path': '_resources/zoomIn_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomin-icon oj-hover'] = [
      {'path': '_resources/zoomIn_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomin-icon oj-active'] = [
      {'path': '_resources/zoomIn_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomin-icon oj-disabled'] = [
      {'path': '_resources/zoomIn_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_d_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon'] = [
      {'path': '_resources/zoomOut_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon oj-hover'] = [
      {'path': '_resources/zoomOut_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon oj-active'] = [
      {'path': '_resources/zoomOut_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon oj-disabled'] = [
      {'path': '_resources/zoomOut_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_d_bc', 'property': 'border-color'}
    ];

    return styleClasses;
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.TIMELINE'] = translations['componentName'];
    ret['DvtUtilBundle.TIMELINE_SERIES'] = translations['labelSeries'];
    ret['DvtUtilBundle.ZOOM_IN'] = translations['tooltipZoomIn'];
    ret['DvtUtilBundle.ZOOM_OUT'] = translations['tooltipZoomOut'];

    return ret;
  },

  //** @inheritdoc */
  _LoadResources: function() {
    this._super();

    var resources = this.options['_resources'];
    var converter = resources['converter'];
    var converterFactory = resources['converterFactory'];

    // Create default converters for vertical timeline
    var monthsConverterVert = converterFactory.createConverter({'month': 'short'});
    var yearsConverterVert = converterFactory.createConverter({'year': '2-digit'});

    var converterVert = {
      'seconds': converter['seconds'],
      'minutes': converter['minutes'],
      'hours': converter['hours'],
      'days': converter['days'],
      'weeks': converter['weeks'],
      'months': monthsConverterVert,
      'quarters': monthsConverterVert,
      'years': yearsConverterVert
    };

    resources['converterVert'] = converterVert;

    // Zoom control icons
    resources['zoomIn'] = 'oj-timeline-zoomin-icon';
    resources['zoomIn_h'] = 'oj-timeline-zoomin-icon oj-hover';
    resources['zoomIn_a'] = 'oj-timeline-zoomin-icon oj-active';
    resources['zoomIn_d'] = 'oj-timeline-zoomin-icon oj-disabled';
    resources['zoomOut'] = 'oj-timeline-zoomout-icon';
    resources['zoomOut_h'] = 'oj-timeline-zoomout-icon oj-hover';
    resources['zoomOut_a'] = 'oj-timeline-zoomout-icon oj-active';
    resources['zoomOut_d'] = 'oj-timeline-zoomout-icon oj-disabled';

    // Overview icons
    resources['overviewHandleHor'] = 'oj-timeline-overview-window-handle-horizontal';
    resources['overviewHandleVert'] = 'oj-timeline-overview-window-handle-vertical';
  },

  //** @inheritdoc */
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['series']};
  }
});
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojTimelineMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "end": {
      "type": "string"
    },
    "majorAxis": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object",
          "properties": {
            "days": {},
            "default": {},
            "hours": {},
            "minutes": {},
            "months": {},
            "quarters": {},
            "seconds": {},
            "weeks": {},
            "years": {}
          }
        },
        "scale": {
          "type": "string",
          "enumValues": ["seconds", "minutes", "hours", "days", "weeks", "months", "quarters", "years"]
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "minorAxis": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object",
          "properties": {
            "days": {},
            "default": {},
            "hours": {},
            "minutes": {},
            "months": {},
            "quarters": {},
            "seconds": {},
            "weeks": {},
            "years": {}
          }
        },
        "scale": {
          "type": "string",
          "enumValues": ["seconds", "minutes", "hours", "days", "weeks", "months", "quarters", "years"]
        },
        "svgStyle": {
          "type": "object"
        },
        "zoomOrder": {
          "type": "Array<string>"
        }
      }
    },
    "orientation": {
      "type": "string"
    },
    "overview": {
      "type": "object",
      "properties": {
        "rendered": {
          "type": "string",
          "enumValues": ["on", "off"]
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "referenceObjects": {
      "type": "Array<object>"
    },
    "selection": {
      "type": "Array<string>",
      "writeback": true
    },
    "selectionMode": {
      "type": "string",
      "enumValues": ["single", "multiple", "none"]
    },
    "series": {
      "type": "Array<object>|Promise"
    },
    "start": {
      "type": "string"
    },
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDuration": {
          "type": "number"
        },
        "borderColor": {
          "type": "string"
        },
        "item": {
          "type": "object",
          "properties": {
            "item": {
              "backgroundColor": {
                "type": "string"
              },
              "borderColor": {
                "type": "string"
              },
              "descriptionStyle": {
                "type": "object"
              },
              "hoverBackgroundColor": {
                "type": "string"
              },
              "hoverBorderColor": {
                "type": "string"
              },
              "selectedBackgroundColor": {
                "type": "string"
              },
              "selectedBorderColor": {
                "type": "string"
              },
              "titleStyle": {
                "type": "object"
              }
            }
          }
        },
        "majorAxis": {
          "type": "object",
          "properties": {
            "majorAxis": {
              "labelStyle": {
                "type": "object"
              },
              "separatorColor": {
                "type": "string"
              }
            }
          }
        },
        "minorAxis": {
          "type": "object",
          "properties": {
            "minorAxis": {
              "backgroundColor": {
                "type": "string"
              },
              "borderColor": {
                "type": "string"
              },
              "labelStyle": {
                "type": "object"
              },
              "separatorColor": {
                "type": "string"
              }
            }
          }
        },
        "overview": {
          "type": "object",
          "properties": {
            "overview": {
              "backgroundColor": {
                "type": "string"
              },
              "labelStyle": {
                "type": "object"
              },
              "window": {
                "type": "object",
                "properties": {
                  "window": {
                    "backgroundColor": {
                      "type": "string"
                    },
                    "borderColor": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "referenceObject": {
          "type": "object",
          "properties": {
            "referenceObject": {
              "color": {
                "type": "string"
              }
            }
          }
        },
        "series": {
          "type": "object",
          "properties": {
            "series": {
              "backgroundColor": {
                "type": "string"
              },
              "colors": {
                "type": "Array<string>"
              },
              "emptyTextStyle": {
                "type": "object"
              },
              "labelStyle": {
                "type": "object"
              }
            }
          }
        }
      }
    },
    "translations": {
      "type": "object",
      "properties": {
        "componentName": {
          "type": "string"
        },
        "labelSeries": {
          "type": "string"
        },
        "tooltipZoomIn": {
          "type": "string"
        },
        "tooltipZoomOut": {
          "type": "string"
        }
      }
    },
    "viewportEnd": {
      "type": "string"
    },
    "viewportStart": {
      "type": "string"
    }
  },
  "methods": {
    "getContextByNode": {}
  },
  "events": {
    "viewportChange": {}
  },
  "extension": {
    _WIDGET_NAME: "ojTimeline"
  }
};
oj.CustomElementBridge.registerMetadata('oj-timeline', 'dvtTimeComponent', ojTimelineMeta);
oj.CustomElementBridge.register('oj-timeline', {'metadata': oj.CustomElementBridge.getMetadata('oj-timeline')});
})();
});
