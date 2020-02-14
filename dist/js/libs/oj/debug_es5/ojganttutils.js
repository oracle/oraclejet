/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore'], function (oj)
{
  "use strict";


/**
 * @namespace GanttUtils
 * @since 6.0.0
 * @export
 * @ojtsmodule
 * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
 * @ojtsimport {module: "ojtimeaxis", type: "AMD", imported:["ojTimeAxis"]}
 * @hideconstructor
 *
 *
 * @classdesc
 * This class provides functions needed for aligning an ojTable with an ojGantt.
 */
var GanttUtils = function GanttUtils() {};
/**
 * Calculate the height required to set on the oj-table column header to match the height of the time axis in oj-gantt.
 * @param {Element} table the oj-table element
 * @param {Element} gantt the oj-gantt element
 * @param {Object} axisInfo information about the axis in oj-gantt
 * @param {Object=} axisInfo.majorAxis information about the major axis in oj-gantt.  See <a href="oj.ojGantt.html#majorAxis">majorAxis</a> in oj-gantt.
 * @param {Object=} axisInfo.majorAxis.converter A converter used to format the labels of the axis.
 * @param {number=} axisInfo.majorAxis.height The height of the minor axis in pixels. If not specified or invalid, the gantt's default value is assumed.
 * @param {string=} axisInfo.majorAxis.scale The time scale used for the axis.
 * @param {(Array<string>)=} axisInfo.majorAxis.zoomOrder An array of strings containing the names of scales used for zooming from longest to shortest.
 * @param {Object} axisInfo.minorAxis information about the minor axis in oj-gantt.  See <a href="oj.ojGantt.html#minorAxis">minorAxis</a> in oj-gantt.
 * @param {Object=} axisInfo.minorAxis.converter A converter used to format the labels of the axis.
 * @param {number=} axisInfo.minorAxis.height The height of the minor axis in pixels. If not specified or invalid, the gantt's default value is assumed.
 * @param {string=} axisInfo.minorAxis.scale The time scale used for the axis.
 * @param {(Array<string>)=} axisInfo.minorAxis.zoomOrder An array of strings containing the names of scales used for zooming from longest to shortest.
 * @return {number} the height required to set on the oj-table column header to match the height of the time axis in oj-gantt
 * @export
 * @static
 * @memberof! GanttUtils
 * @ojsignature [{target: "Type", value: "oj.ojTimeAxis.Converters|oj.Converter<string>", for: "axisInfo.majorAxis.converter"},
 *               {target: "Type", value: "oj.ojTimeAxis.Converters|oj.Converter<string>", for: "axisInfo.minorAxis.converter"}]
 */


GanttUtils.computeTableColumnHeaderHeight = function (table, gantt, axisInfo) {
  var totalHeight = 0;
  var majorAxis = axisInfo.majorAxis;
  var minorAxis = axisInfo.minorAxis;

  function getAxisHeight(axis, type) {
    if (axis == null) {
      return 0;
    }

    var axisHeight = axis.height;

    var defaultTimeAxisHeight = GanttUtils._getDefaultTimeAxisHeight(gantt, type);

    return isNaN(axisHeight) ? defaultTimeAxisHeight : Math.max(defaultTimeAxisHeight, axisHeight);
  }

  totalHeight += getAxisHeight(majorAxis, 'major');
  totalHeight += getAxisHeight(minorAxis, 'minor');

  var tableHeaderHeight = GanttUtils._getTableHeaderHeight(table);

  totalHeight -= tableHeaderHeight; // todo: investigate offset required for IE/Edge

  if (oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.EDGE || oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.IE) {
    totalHeight -= 1;
  }

  return totalHeight;
};
/**
 * Calculate the default column header height in Table, with no customizations.
 * @private
 */


GanttUtils._getTableHeaderHeight = function (table) {
  var TABLE_CLASS = 'oj-table';
  var dummyParent = document.createElement('div');

  if (table != null) {
    dummyParent.className = table.className + ' ';
  }

  dummyParent.className = dummyParent.className + TABLE_CLASS + ' ' + TABLE_CLASS + '-grid-display';
  var dummyHeader = document.createElement('div');
  dummyHeader.className = TABLE_CLASS + '-header';
  var dummyHeaderRow = document.createElement('div');
  dummyHeaderRow.className = TABLE_CLASS + '-header-row';
  var dummyHeaderCell = document.createElement('div');
  dummyHeaderCell.className = TABLE_CLASS + '-column-header-cell';
  dummyHeaderRow.appendChild(dummyHeaderCell);
  dummyHeader.appendChild(dummyHeaderRow);
  dummyParent.appendChild(dummyHeader);
  var root = table != null ? table : document.body;
  root.appendChild(dummyParent);
  var cssStyle = window.getComputedStyle(dummyHeaderCell);
  var paddingTop = parseInt(cssStyle.paddingTop, 10);
  var paddingBottom = parseInt(cssStyle.paddingBottom, 10);
  var borderTopWidth = parseInt(cssStyle.borderTopWidth, 10);
  var borderBottomWidth = parseInt(cssStyle.borderBottomWidth, 10);
  cssStyle = window.getComputedStyle(dummyHeader);
  var headerBorderBottomWidth = parseInt(cssStyle.borderBottomWidth, 10);
  var totalHeight = 0; // cell padding

  totalHeight += isNaN(paddingTop) ? 0 : paddingTop;
  totalHeight += isNaN(paddingBottom) ? 0 : paddingBottom;
  totalHeight += isNaN(borderTopWidth) ? 0 : borderTopWidth;
  totalHeight += isNaN(borderBottomWidth) ? 0 : borderBottomWidth; // header bottom border

  totalHeight += isNaN(headerBorderBottomWidth) ? 0 : headerBorderBottomWidth;
  root.removeChild(dummyParent);
  return totalHeight;
};
/**
 * Calculate the default time axis height in Gantt, with no customizations.
 * @private
 */


GanttUtils._getDefaultTimeAxisHeight = function (gantt, type) {
  var GANTT_CLASS = 'oj-gantt';
  var DVT_BASE_CLASS = 'oj-dvtbase';
  var GANTT_DEFAULT_AXIS_HEIGHT = 23; // from DvtGanttStyleUtils._DEFAULT_AXIS_HEIGHT

  var TIMEAXIS_DEFAULT_INTERVAL_HEIGHT = 21; // from DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_HEIGHT

  var TIMEAXIS_DEFAULT_INTERVAL_PADDING = 2; // from DvtTimeAxisStyleUtils.DEFAULT_INTERVAL_PADDING

  var BORDER_WIDTH = 1;
  var axisLabelClassName = GANTT_CLASS + '-' + type + '-axis-label'; // Determine axis label height

  var dummyParent = document.createElement('div');

  if (gantt != null) {
    dummyParent.className = gantt.className + ' ';
  }

  dummyParent.className = dummyParent.className + GANTT_CLASS + ' ' + DVT_BASE_CLASS;
  var dummyLabel = document.createElement('div');
  dummyLabel.className = axisLabelClassName;
  dummyLabel.innerHTML = 'FooBar'; // @HTMLUpdateOK

  dummyParent.appendChild(dummyLabel);
  var root = gantt != null ? gantt : document.body;
  root.appendChild(dummyParent);
  var labelHeight = parseInt(window.getComputedStyle(dummyLabel).height, 10);
  root.removeChild(dummyParent);
  var timeAxisPreferredHeight = Math.max(labelHeight + 2 * TIMEAXIS_DEFAULT_INTERVAL_PADDING, TIMEAXIS_DEFAULT_INTERVAL_HEIGHT);
  var finalGanttAxisHeight = Math.max(timeAxisPreferredHeight, GANTT_DEFAULT_AXIS_HEIGHT - BORDER_WIDTH);
  return finalGanttAxisHeight + BORDER_WIDTH;
};

  ;return GanttUtils;
});