/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['./DvtToolkit', './DvtTimeComponent', './DvtTimeAxis'], function(dvt) {
  "use strict";
  // Internal use only.  All APIs and functionality are subject to change at any time.

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
   * Style related utility functions for dvt.Gantt.
   * @class
   */
  var DvtGanttStyleUtils = new Object();
  dvt.Obj.createSubclass(DvtGanttStyleUtils, dvt.Obj);
  /**
   * The default time axes label style.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TIMEAXES_LABEL_STYLE = dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color: #333333;';
  /**
   * The default zoom control background color.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR = '#ffffff';
  /**
   * The default zoom control border color.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR = '#d6d7d8';
  /**
   * The default zoom control diameter.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER = 31;
  /**
   * The default zoom control padding.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING = 10.5;
  /**
   * The default zoom control spacing.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_SPACING = 9;
  /**
   * The default task height (without baseline).
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_STANDALONE_TASK_HEIGHT = 22;
  /**
   * The default baseline task height.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_BASELINE_TASK_HEIGHT = 6;
  /**
   * The default milestone baseline y offset.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_MILESTONE_BASELINE_Y_OFFSET = 6;
  /**
   * The default summary task shape thickiness in px.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_SUMMARY_THICKNESS = 3;
  /**
   * The default actual task height (i.e. baseline present).
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_ACTUALTASK_HEIGHT = 16;
  /**
   * The default task label padding.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TASK_LABEL_PADDING = 5;
  /**
   * The default task padding.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TASK_PADDING = 5;
  /**
   * The default task effect margin.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TASK_EFFECT_MARGIN = 2;
  /**
   * The task tint filter id
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TASK_TINT_FILTER_ID = 'ojGanttTaskTintFilter';
  /**
   * The task shade filter id
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TASK_SHADE_FILTER_ID = 'ojGanttTaskShadeFilter';
  /**
   * The default task tint alpha (e.g. on the normal bar shape)
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TASK_TINT_ALPHA = 0.3;
  /**
   * The default task shade alpha (e.g. on the variance shape)
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TASK_SHADE_ALPHA = 0.35;
  /**
   * The default height of the time axis.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_AXIS_HEIGHT = 23;
  /**
   * The gap between the row labels axis (when outside) and the chart.
   * @const
   * @private
   */

  DvtGanttStyleUtils._ROW_LABELS_AXIS_GAP = 10;
  /**
   * The size of the row label expand/collapse button.
   * @const
   * @private
   */

  DvtGanttStyleUtils._ROW_LABEL_EXPAND_COLLAPSE_BUTTON_SIZE = 12;
  /**
   * The indent size for hiearchical row labels. (Basically using the same values as that of hierarchical ojLegend)
   * @const
   * @private
   */

  DvtGanttStyleUtils._ROW_LABEL_INDENT_SIZE = DvtGanttStyleUtils._ROW_LABEL_EXPAND_COLLAPSE_BUTTON_SIZE + 9;
  /**
   * The gap size between the expand/collapse button and the label content.
   * @const
   * @private
   */

  DvtGanttStyleUtils._ROW_LABEL_BUTTON_CONTENT_GAP_SIZE = 7;
  /**
   * The default stroke color for the inner path used to render focused dependency line.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_DEPENDENCY_LINE_INNER_COLOR = '#ffffff';
  /**
   * The default stroke width for the inner path used to render focused dependency line.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_DEPENDENCY_LINE_INNER_WIDTH = 2;
  /**
   * The default animation duration.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_ANIMATION_DURATION = 0.5; // seconds

  /**
   * The radius for the arc used in dependency line
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEPENDENCY_LINE_ARC_RADIUS = 0;
  /**
   * The length of the horizontal dependency portion coming in/out of a task.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEPENDENCY_LINE_TASK_FLANK_LENGTH = 7;
  /**
   * The height of the dependency line marker.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEPENDENCY_MARKER_HEIGHT = 8;
  /**
   * The width of the dependency line marker.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEPENDENCY_MARKER_WIDTH = 6;
  /**
   * The maximum distance from an edge of the viewport such that auto
   * panning happens during drag (or equivalent).
   * @const
   * @private
   */

  DvtGanttStyleUtils._AUTOPAN_EDGE_THRESHOLD = 40;
  /**
   * The default DnD main task resize handle width.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TASK_RESIZE_HANDLE_WIDTH = 5;
  /**
   * The default DnD main task resize handle width for touch.
   * @const
   * @private
   */

  DvtGanttStyleUtils._DEFAULT_TASK_RESIZE_HANDLE_WIDTH_TOUCH = 20;
  /**
   * Gets the horizontal scrollbar style.
   * @return {dvt.CSSStyle} The scrollbar style.
   */

  DvtGanttStyleUtils.getHorizontalScrollbarStyle = function () {
    return new dvt.CSSStyle(DvtGanttStyleUtils._DEFAULT_HORIZONTAL_SCROLLBAR_STYLE);
  };
  /**
   * Gets the vertical scrollbar style.
   * @return {dvt.CSSStyle} The scrollbar style.
   */


  DvtGanttStyleUtils.getVerticalScrollbarStyle = function () {
    return new dvt.CSSStyle(DvtGanttStyleUtils._DEFAULT_VERTICAL_SCROLLBAR_STYLE);
  };
  /**
   * Gets the standalone task height (i.e. no baseline present)
   * @return {number} The standalone task height.
   */


  DvtGanttStyleUtils.getStandaloneTaskHeight = function () {
    return DvtGanttStyleUtils._DEFAULT_STANDALONE_TASK_HEIGHT;
  };
  /**
   * Gets the actual task height (i.e. baseline present)
   * @return {number} The actual task height.
   */


  DvtGanttStyleUtils.getActualTaskHeight = function () {
    return DvtGanttStyleUtils._DEFAULT_ACTUALTASK_HEIGHT;
  };
  /**
   * Gets the baseline task height.
   * @return {number} The baseline task height.
   */


  DvtGanttStyleUtils.getBaselineTaskHeight = function () {
    return DvtGanttStyleUtils._DEFAULT_BASELINE_TASK_HEIGHT;
  };
  /**
   * Gets the milestone baseline y offset from actual task top.
   * @return {number} The milestone baseline y offset from actual task top.
   */


  DvtGanttStyleUtils.getMilestoneBaselineYOffset = function () {
    return DvtGanttStyleUtils._DEFAULT_MILESTONE_BASELINE_Y_OFFSET;
  };
  /**
   * Gets the summary task shape thickness.
   * @return {number} The summary task shape thickness in px.
   */


  DvtGanttStyleUtils.getSummaryThickness = function () {
    return DvtGanttStyleUtils._DEFAULT_SUMMARY_THICKNESS;
  };
  /**
   * Gets the padding around task.
   * @return {number} The task padding.
   */


  DvtGanttStyleUtils.getTaskPadding = function () {
    return DvtGanttStyleUtils._DEFAULT_TASK_PADDING;
  };
  /**
   * Gets the padding around task label.
   * @return {number} The task label padding.
   */


  DvtGanttStyleUtils.getTaskLabelPadding = function () {
    return DvtGanttStyleUtils._DEFAULT_TASK_LABEL_PADDING;
  };
  /**
   * Gets the space around hover or selected task.
   * @return {number} The task effect margin.
   */


  DvtGanttStyleUtils.getTaskEffectMargin = function () {
    return DvtGanttStyleUtils._DEFAULT_TASK_EFFECT_MARGIN;
  };
  /**
   * Gets the task tint filter id.
   * @return {string} The task tint filter id.
   */


  DvtGanttStyleUtils.getTaskTintFilterId = function () {
    return DvtGanttStyleUtils._DEFAULT_TASK_TINT_FILTER_ID;
  };
  /**
   * Gets the task shade filter id.
   * @return {string} The task shade filter id.
   */


  DvtGanttStyleUtils.getTaskShadeFilterId = function () {
    return DvtGanttStyleUtils._DEFAULT_TASK_SHADE_FILTER_ID;
  };
  /**
   * Gets the task tint alpha (e.g. on the normal bar shape)
   * @return {number} The task tint alpha
   */


  DvtGanttStyleUtils.getTaskTintAlpha = function () {
    return DvtGanttStyleUtils._DEFAULT_TASK_TINT_ALPHA;
  };
  /**
   * Gets the task shade alpha (e.g. on the variance shape)
   * @return {number} The task shade alpha
   */


  DvtGanttStyleUtils.getTaskShadeAlpha = function () {
    return DvtGanttStyleUtils._DEFAULT_TASK_SHADE_ALPHA;
  };
  /**
   * Gets the default height of the time axis.
   * @param {object} axisOptions The axis options
   * @return {number} The default height of time axis.
   */


  DvtGanttStyleUtils.getTimeAxisHeight = function (axisOptions) {
    if (axisOptions && axisOptions['height']) return axisOptions['height'];
    return DvtGanttStyleUtils._DEFAULT_AXIS_HEIGHT;
  };
  /**
   * Gets the major axis label style.
   * @param {object} options The object containing data and specifications for the component.
   * @return {dvt.CSSStyle} The label style.
   */


  DvtGanttStyleUtils.getMajorAxisLabelStyle = function (options) {
    var resources = options['_resources'];
    var labelStyleString = DvtGanttStyleUtils._DEFAULT_TIMEAXES_LABEL_STYLE;
    if (resources) labelStyleString = resources['majorAxisLabelFontProp'];
    return new dvt.CSSStyle(labelStyleString);
  };
  /**
   * Gets the minor axis label style.
   * @param {object} options The object containing data and specifications for the component.
   * @return {dvt.CSSStyle} The label style.
   */


  DvtGanttStyleUtils.getMinorAxisLabelStyle = function (options) {
    var resources = options['_resources'];
    var labelStyleString = DvtGanttStyleUtils._DEFAULT_TIMEAXES_LABEL_STYLE;
    if (resources) labelStyleString = resources['minorAxisLabelFontProp'];
    return new dvt.CSSStyle(labelStyleString);
  };
  /**
   * Gets the gap between the row axis (when outside the char) and the chart.
   * @return {number} The gap between the row axis and the chart.
   */


  DvtGanttStyleUtils.getRowAxisGap = function () {
    return DvtGanttStyleUtils._ROW_LABELS_AXIS_GAP;
  };
  /**
   * Gets the length of the horizontal dependency portion coming in/out of a task.
   * @return {number} The length of the horizontal dependency portion coming in/out of a task.
   */


  DvtGanttStyleUtils.getDependencyLineTaskFlankLength = function () {
    return DvtGanttStyleUtils._DEPENDENCY_LINE_TASK_FLANK_LENGTH;
  };
  /**
   * Gets the radius for the arc used in the dependency line.
   * @return {number} The radius for the arc used in the dependency line.
   */


  DvtGanttStyleUtils.getDependencyLineArcRadius = function () {
    return DvtGanttStyleUtils._DEPENDENCY_LINE_ARC_RADIUS;
  };
  /**
   * Gets the width of the dependency line marker.
   * @return {number} The width of the dependency line marker.
   */


  DvtGanttStyleUtils.getDependencyLineMarkerWidth = function () {
    return DvtGanttStyleUtils._DEPENDENCY_MARKER_WIDTH;
  };
  /**
   * Gets the height of the dependency line marker.
   * @return {number} The height of the dependency line marker.
   */


  DvtGanttStyleUtils.getDependencyLineMarkerHeight = function () {
    return DvtGanttStyleUtils._DEPENDENCY_MARKER_HEIGHT;
  };
  /**
   * Gets the vertical gap between the top or bottom of the task and the point at which its dependency line can bend.
   * @return {number} The gap size in px.
   */


  DvtGanttStyleUtils.getDependencyLineTaskGap = function () {
    return DvtGanttStyleUtils.getTaskPadding() - 1;
  };
  /**
   * Gets the maximum distance from an edge of the viewport such that auto
   * panning happens during drag (or equivalent).
   * @return {number} The maximum distance from an edge in px.
   */


  DvtGanttStyleUtils.getAutoPanEdgeThreshold = function () {
    return DvtGanttStyleUtils._AUTOPAN_EDGE_THRESHOLD;
  };
  /**
   * Gets the task label style.
   * @param {object} options The object containing data and specifications for the component.
   * @return {dvt.CSSStyle} The label style.
   */


  DvtGanttStyleUtils.getTaskLabelStyle = function (options) {
    var resources = options['_resources'];
    var labelStyleString = '';
    if (resources) labelStyleString = resources['taskLabelFontProp'];
    return new dvt.CSSStyle(labelStyleString);
  };
  /**
   * Gets the row label style.
   * @param {object} options The object containing data and specifications for the component.
   * @return {dvt.CSSStyle} The label style.
   */


  DvtGanttStyleUtils.getRowLabelStyle = function (options) {
    var resources = options['_resources'];
    var labelStyleString = '';
    if (resources) labelStyleString = resources['rowLabelFontProp'];
    return new dvt.CSSStyle(labelStyleString);
  };
  /**
   * Gets the size of the row label expand/collapse button.
   * @return {number} The size of the row label expand/collapse button.
   */


  DvtGanttStyleUtils.getRowLabelButtonSize = function () {
    return DvtGanttStyleUtils._ROW_LABEL_EXPAND_COLLAPSE_BUTTON_SIZE;
  };
  /**
   * Gets the indent size for hiearchical row labels.
   * @return {number} The indent size.
   */


  DvtGanttStyleUtils.getRowLabelIndentSize = function () {
    return DvtGanttStyleUtils._ROW_LABEL_INDENT_SIZE;
  };
  /**
   * Gets the gap size between the expand/collapse button and the label content.
   * @return {number} The gap size.
   */


  DvtGanttStyleUtils.getRowLabelButtonContentGapSize = function () {
    return DvtGanttStyleUtils._ROW_LABEL_BUTTON_CONTENT_GAP_SIZE;
  };
  /**
   * Gets the chart stroke width.
   * @param {object} options The object containing data and specifications for the component.
   * @return {number} The chart stroke width in px.
   */


  DvtGanttStyleUtils.getChartStrokeWidth = function (options) {
    var resources = options['_resources'];

    if (resources) {
      var chartStyle = resources['chartArea'];

      if (chartStyle) {
        var strokeWidth = chartStyle['strokeWidth'];
        if (strokeWidth) return dvt.CSSStyle.toNumber(strokeWidth);
      }
    }

    return 1; // default for browsers is 1px when not specified
  };
  /**
   * Gets the horizontal gridline width.
   * @param {object} options The object containing data and specifications for the component.
   * @return {number} The horizontal gridline width in px.
   */


  DvtGanttStyleUtils.getHorizontalGridlineWidth = function (options) {
    return options['_resources'] ? dvt.CSSStyle.toNumber(options['_resources']['horizontalGridlineWidth']) : 1; // default for browsers is 1px when not specified
  };
  /**
   * Gets the animation duration.
   * @param {object} options The object containing data and specifications for the component.
   * @return {number} The animation duration in seconds.
   */


  DvtGanttStyleUtils.getAnimationDuration = function (options) {
    var animationDuration = DvtGanttStyleUtils._DEFAULT_ANIMATION_DURATION,
        customAnimationDuration; // Override with animation duration from CSS if possible

    if (options['_resources']) {
      customAnimationDuration = options['_resources']['animationDuration'];

      if (customAnimationDuration) {
        animationDuration = dvt.CSSStyle.getTimeMilliseconds(customAnimationDuration) / 1000; // seconds
      }
    }

    return animationDuration;
  };
  /**
   * Returns the zoom control background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control background color.
   */


  DvtGanttStyleUtils.getZoomInButtonBackgroundColor = function (options) {
    if (options['zoomIn_bgc']) return options['zoomIn_bgc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control active background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control active background color.
   */


  DvtGanttStyleUtils.getZoomInButtonActiveBackgroundColor = function (options) {
    if (options['zoomIn_a_bgc']) return options['zoomIn_a_bgc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control hover background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control hover background color.
   */


  DvtGanttStyleUtils.getZoomInButtonHoverBackgroundColor = function (options) {
    if (options['zoomIn_h_bgc']) return options['zoomIn_h_bgc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control disabled background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control disabled background color.
   */


  DvtGanttStyleUtils.getZoomInButtonDisabledBackgroundColor = function (options) {
    if (options['zoomIn_d_bgc']) return options['zoomIn_d_bgc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control border color.
   */


  DvtGanttStyleUtils.getZoomInButtonBorderColor = function (options) {
    if (options['zoomIn_bc']) return options['zoomIn_bc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control active border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control active border color.
   */


  DvtGanttStyleUtils.getZoomInButtonActiveBorderColor = function (options) {
    if (options['zoomIn_a_bc']) return options['zoomIn_a_bc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control hover border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control hover border color.
   */


  DvtGanttStyleUtils.getZoomInButtonHoverBorderColor = function (options) {
    if (options['zoomIn_h_bc']) return options['zoomIn_h_bc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control disabled border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control disabled border color.
   */


  DvtGanttStyleUtils.getZoomInButtonDisabledBorderColor = function (options) {
    if (options['zoomIn_d_bc']) return options['zoomIn_d_bc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control background color.
   */


  DvtGanttStyleUtils.getZoomOutButtonBackgroundColor = function (options) {
    if (options['zoomOut_bgc']) return options['zoomOut_bgc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control active background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control active background color.
   */


  DvtGanttStyleUtils.getZoomOutButtonActiveBackgroundColor = function (options) {
    if (options['zoomOut_a_bgc']) return options['zoomOut_a_bgc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control hover background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control hover background color.
   */


  DvtGanttStyleUtils.getZoomOutButtonHoverBackgroundColor = function (options) {
    if (options['zoomOut_h_bgc']) return options['zoomOut_h_bgc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control disabled background color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control disabled background color.
   */


  DvtGanttStyleUtils.getZoomOutButtonDisabledBackgroundColor = function (options) {
    if (options['zoomOut_d_bgc']) return options['zoomOut_d_bgc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
  };
  /**
   * Returns the zoom control border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control border color.
   */


  DvtGanttStyleUtils.getZoomOutButtonBorderColor = function (options) {
    if (options['zoomOut_bc']) return options['zoomOut_bc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control active border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control active border color.
   */


  DvtGanttStyleUtils.getZoomOutButtonActiveBorderColor = function (options) {
    if (options['zoomOut_a_bc']) return options['zoomOut_a_bc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control hover border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control hover border color.
   */


  DvtGanttStyleUtils.getZoomOutButtonHoverBorderColor = function (options) {
    if (options['zoomOut_h_bc']) return options['zoomOut_h_bc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the zoom control disabled border color.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The zoom control disabled border color.
   */


  DvtGanttStyleUtils.getZoomOutButtonDisabledBorderColor = function (options) {
    if (options['zoomOut_d_bc']) return options['zoomOut_d_bc'];else return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
  };
  /**
   * Returns the stroke color of the inner dependency line when it has focus.
   * @param {object} options The object containing data and specification for the component.
   * @return {string} The stroke color of the inner dependency line when it has focus.
   */


  DvtGanttStyleUtils.getFocusedDependencyLineInnerColor = function (options) {
    return DvtGanttStyleUtils._DEFAULT_DEPENDENCY_LINE_INNER_COLOR;
  };
  /**
   * Returns the stroke width of the inner dependency line when it has focus.
   * @param {object} options The object containing data and specification for the component.
   * @return {number} The stroke width of the inner dependency line when it has focus.
   */


  DvtGanttStyleUtils.getFocusedDependencyLineInnerWidth = function (options) {
    return DvtGanttStyleUtils._DEFAULT_DEPENDENCY_LINE_INNER_WIDTH;
  };
  /**
   * Returns the DnD main task resize handle width.
   * @return {number} The width.
   */


  DvtGanttStyleUtils.getTaskResizeHandleWidth = function () {
    return !dvt.Agent.isTouchDevice() ? DvtGanttStyleUtils._DEFAULT_TASK_RESIZE_HANDLE_WIDTH : DvtGanttStyleUtils._DEFAULT_TASK_RESIZE_HANDLE_WIDTH_TOUCH;
  };
  /**
   * Computes the size of a subcomponent in pixels by parsing the user input. Same method as that of DvtChartStyleUtils.
   * @param {object} size The size input given by the user. It can be in percent, pixels, or number.
   * @param {number} totalSize The total size of the component in pixels.
   * @return {number} The size of the subcomponent in pixels.
   */


  DvtGanttStyleUtils.getSizeInPixels = function (size, totalSize) {
    if (typeof size == 'string') {
      if (size.slice(-1) == '%') return totalSize * Number(size.slice(0, -1)) / 100;else if (size.slice(-2) == 'px') return Number(size.slice(0, -2));else size = Number(size);
    }

    if (typeof size == 'number') {
      if (size <= 1) // assume to be ratio
        return totalSize * size;else // assume to be absolute size in pixels
        return size;
    } else return 0;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Utility functions for dvt.Gantt tooltips.
   * @class
   */


  var DvtGanttTooltipUtils = new Object();
  dvt.Obj.createSubclass(DvtGanttTooltipUtils, dvt.Obj);
  /**
   * Returns the datatip color for the tooltip of the target task.
   * @param {DvtGanttTaskNode} taskNode
   * @return {string} The datatip color.
   */

  DvtGanttTooltipUtils.getDatatipColor = function (taskNode) {
    var fillColor = taskNode.getTask().getFillColor();

    if (fillColor) {
      return fillColor['fill'];
    }

    return null;
  };
  /**
   * Returns the datatip string for the target task.
   * @param {DvtGanttTaskNode} taskNode
   * @param {boolean} isTabular Whether the datatip is in a table format.
   * @param {boolean=} isAria whether the datatip is used for accessibility.
   * @return {string} The datatip string.
   */


  DvtGanttTooltipUtils.getDatatip = function (taskNode, isTabular, isAria) {
    var gantt = taskNode.getGantt(); // If performing DnD Move via keyboard and the navigation scale changed, show the scale change info instead of the normal tooltip

    if (gantt.getEventManager().isKeyboardDnDScaleChanged()) {
      // No valueFormats support for scale change info, so type is left as empty string for now
      var navigationScale = gantt.getEventManager().getKeyboardDnDNavigationScale();
      var defaultNavigationLabel = gantt.getEventManager().getKeyboardDnDMode() === DvtGanttEventManager.KEYBOARD_MOVE ? 'MoveBy' : 'ResizeBy';

      var navigationScaleDesc = DvtGanttTooltipUtils._addDatatipRow('', gantt, '', defaultNavigationLabel, navigationScale.charAt(0).toUpperCase() + navigationScale.slice(1), isTabular);

      return DvtGanttTooltipUtils._processDatatip(navigationScaleDesc, gantt, isTabular);
    } // Custom Tooltip via Function


    var customTooltip = gantt.getOptions()['tooltip'];
    var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;

    if (isTabular && tooltipFunc) {
      var tooltipManager = gantt.getCtx().getTooltipManager();
      var dataContext = gantt.getEventManager().isDnDDragging() ? taskNode.getSandboxDataContext() : taskNode.getDataContext();
      return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
    } // Custom Tooltip via Short Desc


    var shortDesc = taskNode.getValue('shortDesc');
    if (shortDesc != null) return shortDesc; // TODO: Remove this block and the isAria param when we can remove the translation strings that were supported
    // before the shortDesc/valueFormats/tooltip API (before 2.3.0). At the time of writing, we plan to deprecate
    // them, and remove in 5.0.0. Custom elements version starts with a clean slate and won't use these deprecated strings starting 4.0.0
    // Behavior: If someone upgrades from 2.2.0 to 2.3.0 with no code changes (ie, no shortDesc, valueFormat set),
    // old aria-label format with the translation options will work as before. If shortDesc or valueFormat is set,
    // then new behavior will override the old aria-label format and any translation settings.

    if (isAria && !gantt.getCtx().isCustomElement()) {
      var valueFormats = gantt.getOptions()['valueFormats'];

      if (!valueFormats || valueFormats.length == 0) {
        var task = taskNode.getTask();
        var start = taskNode.getValue('start');
        var end = taskNode.getValue('end');
        var baselineStart = taskNode.getValue('baseline', 'start');
        var baselineEnd = taskNode.getValue('baseline', 'end');
        var progressValue = task.getProgressValue();
        var options = gantt.getOptions();
        var translations = options.translations;
        var isMainMilestone = task.isMilestone('main');
        var isBaselineMilestone = task.isMilestone('baseline');
        var validActualTask = !(start == null && end == null);
        var validBaselineTask = !(baselineStart == null && baselineEnd == null);

        if (validActualTask) {
          if (isMainMilestone) {
            var time = gantt.getTimeAxis().formatDate(new Date(start != null ? start : end), null, 'general');
            var taskDesc = dvt.ResourceUtils.format(translations.accessibleMilestoneInfo, [time]);
          } else {
            var startTime = gantt.getTimeAxis().formatDate(new Date(start), null, 'general');
            var endTime = gantt.getTimeAxis().formatDate(new Date(end), null, 'general');
            var duration = taskNode.getDuration(start, end);
            taskDesc = dvt.ResourceUtils.format(translations.accessibleTaskInfo, [startTime, endTime, duration]);
          }
        }

        if (validBaselineTask) {
          if (isBaselineMilestone) {
            var baselineTime = gantt.getTimeAxis().formatDate(new Date(baselineStart != null ? baselineStart : baselineEnd), null, 'general');
            var baselineDesc = translations.labelBaselineDate + ': ' + baselineTime;
          } else {
            var baselineStartTime = gantt.getTimeAxis().formatDate(new Date(baselineStart), null, 'general');
            var baselineEndTime = gantt.getTimeAxis().formatDate(new Date(baselineEnd), null, 'general');
            baselineDesc = translations.labelBaselineStart + ': ' + baselineStartTime;
            baselineDesc = baselineDesc + '; ' + translations.labelBaselineEnd + ': ' + baselineEndTime;
          }
        }

        if (validActualTask) {
          var label = taskNode.getValue('label');
          if (label != null) var labelDesc = translations.labelLabel + ': ' + label;

          if (progressValue != null) {
            var resources = options['_resources'];

            if (resources) {
              var percentConverter = resources['percentConverter'];

              if (percentConverter) {
                var formattedProgressValue = percentConverter['format'](progressValue);
                if (formattedProgressValue != null) var progressDesc = translations.labelProgress + ': ' + formattedProgressValue;
              }
            }
          }
        }

        var row = taskNode.getRowNode();
        var rowLabel = row.getLabel();
        if (rowLabel == null) rowLabel = row.getIndex() + 1;
        var rowDesc = dvt.ResourceUtils.format(translations.accessibleRowInfo, [rowLabel]);
        var desc = rowDesc;
        if (taskDesc) desc = desc + '; ' + taskDesc;
        if (baselineDesc) desc = desc + '; ' + baselineDesc;
        if (labelDesc) desc = desc + '; ' + labelDesc;
        if (progressDesc) desc = desc + '; ' + progressDesc;
        return desc;
      }
    } // Default Tooltip Support


    var datatip = '';
    datatip = DvtGanttTooltipUtils._addRowDatatip(datatip, taskNode, isTabular);
    datatip = DvtGanttTooltipUtils._addTaskDatatip(datatip, taskNode, isTabular);
    return DvtGanttTooltipUtils._processDatatip(datatip, gantt, isTabular);
  };
  /**
   * Final processing for the datatip.
   * @param {string} datatip The current datatip.
   * @param {dvt.Gantt} gantt The owning gantt instance.
   * @param {boolean} isTabular Whether the datatip is in a table format.
   * @return {string} The updated datatip.
   * @private
   */


  DvtGanttTooltipUtils._processDatatip = function (datatip, gantt, isTabular) {
    // Don't render tooltip if empty
    if (datatip == '') return null; // Add outer table tags
    // Note: Unlike Charts, we're not going to create a table start tag with
    // dvt.HtmlTooltipManager.createElement(). That method applies parsed styles
    // to the element, but for gantt we want to directly apply the class to the element:
    //
    // Security note: gantt.GetStyleClass('tooltipTable') returns an internally generated class string
    // defined in ojgantt.js (in this case, returns the string 'oj-gantt-tooltip-table')
    //
    // datatip contains externally provided strings, but this entire value is eventually passed to
    // dvt.HtmlTooltipManager._showTextAtPosition(),
    // and that method makes sure all parsable HTML tags are disabled/handled

    if (isTabular) return '<table class=\"' + gantt.GetStyleClass('tooltipTable') + '\">' + datatip + '<\/table>'; // @HTMLUpdateOK

    return datatip;
  };
  /**
   * Adds the row string to the datatip.
   * @param {string} datatip The current datatip.
   * @param {DvtGanttTaskNode} taskNode The task node.
   * @param {boolean} isTabular Whether the datatip is in a table format.
   * @return {string} The updated datatip.
   * @private
   */


  DvtGanttTooltipUtils._addRowDatatip = function (datatip, taskNode, isTabular) {
    var gantt = taskNode.getGantt();

    if (gantt.getEventManager().isDnDDragging()) {
      var row = taskNode.getSandboxValue('_rowNode');
    } else {
      row = taskNode.getRowNode();
    }

    var rowLabel = row.getLabel();
    if (rowLabel == null) rowLabel = row.getIndex() + 1;
    return DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'row', 'Row', rowLabel, isTabular);
  };
  /**
   * Adds the task strings to the datatip.
   * @param {string} datatip The current datatip.
   * @param {DvtGanttTaskNode} taskNode The task node.
   * @param {boolean} isTabular Whether the datatip is in a table format.
   * @return {string} The updated datatip.
   * @private
   */


  DvtGanttTooltipUtils._addTaskDatatip = function (datatip, taskNode, isTabular) {
    var gantt = taskNode.getGantt();
    var valueGetter = gantt.getEventManager().isDnDDragging() ? taskNode.getSandboxValue : taskNode.getValue;
    var task = taskNode.getTask();
    var start = valueGetter.call(taskNode, 'start');
    var end = valueGetter.call(taskNode, 'end');
    var baselineStart = valueGetter.call(taskNode, 'baseline', 'start');
    var baselineEnd = valueGetter.call(taskNode, 'baseline', 'end');
    var label = valueGetter.call(taskNode, 'label');
    var progress = task.getProgressValue(); // main Milestone check happens here too

    var validActualTask = !(start == null && end == null);
    var validBaselineTask = !(baselineStart == null && baselineEnd == null);
    var isMainMilestone = task.isMilestone('main');
    var isBaselineMilestone = task.isMilestone('baseline');

    if (validActualTask) {
      if (isMainMilestone) {
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'date', 'Date', start != null ? start : end, isTabular);

        if (isBaselineMilestone) {
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineDate', 'BaselineDate', baselineStart != null ? baselineStart : baselineEnd, isTabular);
        } else if (validBaselineTask) {
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineStart', 'BaselineStart', baselineStart, isTabular);
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineEnd', 'BaselineEnd', baselineEnd, isTabular);
        }
      } else {
        if (isBaselineMilestone) {
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'start', 'Start', start, isTabular);
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'end', 'End', end, isTabular);
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineDate', 'BaselineDate', baselineStart != null ? baselineStart : baselineEnd, isTabular);
        } else if (validBaselineTask) {
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'start', 'Start', start, isTabular);
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineStart', 'BaselineStart', baselineStart, isTabular);
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'end', 'End', end, isTabular);
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineEnd', 'BaselineEnd', baselineEnd, isTabular);
        } else {
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'start', 'Start', start, isTabular);
          datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'end', 'End', end, isTabular);
        }
      }

      datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'label', 'Label', label, isTabular);

      if (progress != null) {
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'progress', 'Progress', progress, isTabular);
      }
    } else if (validBaselineTask) {
      datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineStart', 'BaselineStart', baselineStart, isTabular);
      datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineEnd', 'BaselineEnd', baselineEnd, isTabular);
    }

    return datatip;
  };
  /**
   * Adds a row of item to the datatip string.
   * @param {string} datatip The current datatip.
   * @param {dvt.Gantt} gantt The gantt instance.
   * @param {string} type The item type, e.g. row, start, end, label
   * @param {string} defaultLabel The bundle resource string for the default label.
   * @param {string|number} value The item value.
   * @param {boolean} isTabular Whether the datatip is in a table format.
   * @param {number} index (optional) The index of the tooltipLabel string to be used
   * @return {string} The updated datatip.
   * @private
   */


  DvtGanttTooltipUtils._addDatatipRow = function (datatip, gantt, type, defaultLabel, value, isTabular, index) {
    if (value == null || value === '') return datatip;
    var valueFormat = DvtGanttTooltipUtils.getValueFormat(gantt, type);
    var tooltipDisplay = valueFormat['tooltipDisplay'];
    if (tooltipDisplay == 'off') return datatip; // Create tooltip label

    var tooltipLabel;
    if (typeof valueFormat['tooltipLabel'] === 'string') tooltipLabel = valueFormat['tooltipLabel'];

    if (tooltipLabel == null) {
      if (defaultLabel == null) tooltipLabel = '';else tooltipLabel = gantt.getOptions().translations['label' + defaultLabel];
    } // Create tooltip value


    value = DvtGanttTooltipUtils.formatValue(gantt, type, valueFormat, value);

    if (isTabular) {
      // Note: Unlike Charts, we're not going to create a td start tag with
      // dvt.HtmlTooltipManager.createElement(). That method applies parsed styles
      // to the element, but for gantt we want to directly apply the class to the element:
      //
      // Security note: gantt.GetStyleClass returns an internally generated class string
      // defined in ojgantt.js (in this case, returns the strings 'oj-gantt-tooltip-label'
      // and 'oj-gantt-tooltip-value' respectively in the two calls below).
      //
      // tooltipLabel and value contains externally provided strings, but these values are eventually passed to
      // DvtGanttTooltipUtils._processDatatip(), which concatenates more strings to it, and the entire value is passed to
      // dvt.HtmlTooltipManager._showTextAtPosition(),
      // and that last method makes sure all parsable HTML tags are disabled/handled
      var tooltipLabelClass = gantt.GetStyleClass('tooltipLabel');
      var tooltipValueClass = gantt.GetStyleClass('tooltipValue');
      return datatip + '<tr>' + '<td class=\"' + tooltipLabelClass + '\">' + tooltipLabel + '<\/td>' + '<td class=\"' + tooltipValueClass + '\">' + value + '<\/td>' + '<\/tr>'; // @HTMLUpdateOK
    } else {
      if (datatip.length > 0) datatip += '<br>';
      return datatip + dvt.ResourceUtils.format(gantt.getOptions().translations.labelAndValue, [tooltipLabel, value]);
    }
  };
  /**
   * Returns the valueFormat of the specified type.
   * @param {dvt.Gantt} gantt
   * @param {string} type The valueFormat type, e.g. row, start, end, label.
   * @return {object} The valueFormat.
   */


  DvtGanttTooltipUtils.getValueFormat = function (gantt, type) {
    var valueFormats = gantt.getOptions()['valueFormats'];
    if (!valueFormats) return {};else if (valueFormats instanceof Array) {
      // TODO remove deprecated array support
      // Convert the deprecated array syntax to object syntax
      var obj = {};

      for (var i = 0; i < valueFormats.length; i++) {
        var valueFormat = valueFormats[i];
        obj[valueFormat['type']] = valueFormat;
      }

      gantt.getOptions()['valueFormats'] = obj;
      valueFormats = obj;
    }
    if (valueFormats[type]) return valueFormats[type];
    return {};
  };
  /**
   * Formats value with the converter from the valueFormat.
   * @param {dvt.Gantt} gantt
   * @param {string} type The item type, e.g. row, start, end, label
   * @param {object} valueFormat
   * @param {number} value The value to format.
   * @return {string} The formatted value string.
   */


  DvtGanttTooltipUtils.formatValue = function (gantt, type, valueFormat, value) {
    var converter = valueFormat['converter'];
    if (type == 'start' || type == 'end' || type == 'date' || type == 'baselineStart' || type == 'baselineEnd' || type == 'baselineDate') return gantt.getTimeAxis().formatDate(new Date(value), converter, 'general');
    if (converter && converter['format']) return converter['format'](value);

    if (type == 'progress') {
      var resources = gantt.getOptions()['_resources'];

      if (resources) {
        var percentConverter = resources['percentConverter'];

        if (percentConverter) {
          return percentConverter['format'](value);
        }
      }
    }

    return value;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Animation manager for dvt.Gantt
   * @param {dvt.Gantt} gantt the Gantt component
   * @class
   * @constructor
   */


  var DvtGanttAnimationManager = function DvtGanttAnimationManager(gantt) {
    this.Init(gantt);
  };

  dvt.Obj.createSubclass(DvtGanttAnimationManager, dvt.Obj);
  /**
   * Initialize the animation manager
   * @param {dvt.Gantt} gantt the Gantt component
   * @protected
   */

  DvtGanttAnimationManager.prototype.Init = function (gantt) {
    this._gantt = gantt;
  };
  /**
   * Initializes the necessary animators for animation.
   */


  DvtGanttAnimationManager.prototype.prepareForAnimations = function () {
    var context = this._gantt.getCtx(); // Ensure clean slate


    this._gantt.StopAnimation();

    this._animationMode = 'none';
    this._animationDuration = DvtGanttStyleUtils.getAnimationDuration(this._gantt.getOptions()); // Figure out animation mode

    if (this._gantt.isInitialRender()) // initial render/display
      {
        if (this._gantt.isIRAnimationEnabled) this._animationMode = 'onDisplay';
      } else // data change
      {
        if (this._gantt.isDCAnimationEnabled) this._animationMode = 'dataChange';
      } // Initialize appropriate animators depending on animation mode


    if (this._animationMode === 'onDisplay') {
      // For animating fade in
      this.fadeInElemsIR = [];
      this.fadeInPlayableIR = new dvt.AnimFadeIn(context, this.fadeInElemsIR, this._animationDuration, 0); // Playable for animating dimension changes

      this.dimensionsPlayableIR = this._createCustomPlayable(dvt.Easing.linear); // For animating translations

      this.translationsPlayableIR = this._createCustomPlayable(dvt.Easing.cubicInOut);
    } else if (this._animationMode === 'dataChange') {
      // For animating fade in and out
      this.fadeInElemsDC = [];
      this.fadeInPlayableDC = new dvt.AnimFadeIn(context, this.fadeInElemsDC, this._animationDuration, 0);
      this.fadeOutElemsDC = [];
      this.fadeOutPlayableDC = new dvt.AnimFadeOut(context, this.fadeOutElemsDC, this._animationDuration, 0); // For animating dimension changes

      this.dimensionsPlayableDC = this._createCustomPlayable(dvt.Easing.linear); // For animating translations

      this.translationsPlayableDC = this._createCustomPlayable(dvt.Easing.cubicInOut);
    } // Callbacks to be executed at the end of animation


    this._onEnds = [];
  };
  /**
   * Gets the current animation mode of the Gantt
   * @return {string} the animation mode ('dataChange', 'onDisplay', or 'none')
   */


  DvtGanttAnimationManager.prototype.getAnimationMode = function () {
    return this._animationMode;
  };
  /**
   * Sets the animation mode of the Gantt
   * @param {string} animationMode The new animation mode
   */


  DvtGanttAnimationManager.prototype.setAnimationMode = function (animationMode) {
    this._animationMode = animationMode;
  };
  /**
   * Generates a playable object with specified easing animation.
   * @param {function} easing The easing function to use when animating.
   * @return {dvt.CustomAnimation} The playable.
   * @private
   */


  DvtGanttAnimationManager.prototype._createCustomPlayable = function (easing) {
    var playable;
    playable = new dvt.CustomAnimation(this._gantt.getCtx(), this._gantt, this._animationDuration);
    playable.setEasing(easing);
    return playable;
  };
  /**
   * Starts all animations.
   */


  DvtGanttAnimationManager.prototype.triggerAnimations = function () {
    var subPlayables, context, i; // Stop any unfinished animations

    this._gantt.StopAnimation();

    context = this._gantt.getCtx(); // Plan the animation

    if (this._animationMode === 'onDisplay') {
      // Parallel: Fade in all elements, animate any dimension changes
      subPlayables = [this.fadeInPlayableIR, this.translationsPlayableIR, this.dimensionsPlayableIR];
      this._gantt.Animation = new dvt.ParallelPlayable(context, subPlayables, this._animationDuration, 0);
    } else if (this._animationMode === 'dataChange') {
      // Parallel: Fade in elements, translate elements, animate dimension changes, fade out elements
      subPlayables = [this.fadeInPlayableDC, this.translationsPlayableDC, this.dimensionsPlayableDC, this.fadeOutPlayableDC];
      this._gantt.Animation = new dvt.ParallelPlayable(context, subPlayables, this._animationDuration, 0);
    } // If an animation was created, play it


    if (this._gantt.Animation) {
      // Instead of animating dep lines, hide them, animate other things, then show them again.
      // TODO: remove this and refine dependency lines animation instead.
      this._hideDepLines();

      dvt.Playable.appendOnEnd(this._gantt.Animation, this._showDepLines, this); // Disable event listeners temporarily
      // Only do this if DnD is not enabled, because
      // 1) If animation is triggered by DnD, and listeners are removed, the dragEnd event will never fire.
      // 2) If we try to limit this to explicit dragging cases, there'll be a slew of side effects/conflicts with pan drag events and DnD events
      // 3) DnD with animation is not expected to be a common usecase, and it's only an "issue" if someone tries to scroll/zoom etc. in the half second animation is happening. Even so, nothing will break; animation will just look more chaotic.

      if (!this._gantt.isDndEnabled()) {
        this._gantt.EventManager.removeListeners(this._gantt);

        this._bListenersRemoved = true;
      } // Append callbacks to be executed at the end of animation


      for (var i = 0; i < this._onEnds.length; i++) {
        dvt.Playable.appendOnEnd(this._gantt.Animation, this._onEnds[i], this);
      }

      dvt.Playable.appendOnEnd(this._gantt.Animation, this._onAnimationEnd, this); // Play!

      this._gantt.Animation.play();
    }
  };
  /**
   * Hides dependency lines (called before animation)
   * @private
   */


  DvtGanttAnimationManager.prototype._hideDepLines = function () {
    var deplines = this._gantt.getDependenciesContainer();

    if (deplines != null) dvt.ToolkitUtils.setAttrNullNS(deplines.getElem(), 'display', 'none');
  };
  /**
   * Shows dependency lines (called after animation)
   * @private
   */


  DvtGanttAnimationManager.prototype._showDepLines = function () {
    var deplines = this._gantt.getDependenciesContainer();

    if (deplines != null) dvt.ToolkitUtils.removeAttrNullNS(deplines.getElem(), 'display');
  };
  /**
   * Hook for cleaning animation behavior at the end of the animation.
   * @private
   */


  DvtGanttAnimationManager.prototype._onAnimationEnd = function () {
    // Fire ready event saying animation is finished.
    if (!this._gantt.AnimationStopped) this._gantt.RenderComplete(); // Restore event listeners if removed

    if (this._bListenersRemoved) this._gantt.EventManager.addListeners(this._gantt); // Reset animation flags

    this._gantt.Animation = null;
    this._gantt.AnimationStopped = false;
    this._animationMode = 'none'; // Refresh the viewport to absolutely ensure the final state looks right
    // This also ensures a clean slate, and clears out any hidden things from the DOM that were there just for animation

    this._gantt.renderViewport();
  };
  /*
  ----------------------------------------------------------------------
  Methods below configure/define animations for specific elements
  ----------------------------------------------------------------------
  */

  /**
   * Prepares overall Gantt initial render animation.
   * @param {dvt.Gantt} gantt
   */


  DvtGanttAnimationManager.prototype.preAnimateGanttIR = function (gantt) {
    if (this._animationMode === 'onDisplay') {
      // Fade in gantt on initial render
      this.fadeInElemsIR.push(gantt._canvas);
    }
  };
  /**
   * Prepares task node animation.
   * @param {DvtGanttTaskNode} taskNode
   * @param {object} finalStates Object defining the final animation state
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskNode = function (taskNode, finalStates) {
    var translationsAnimator,
        renderState = taskNode.getRenderState();

    if (this._animationMode === 'dataChange') {
      if (renderState === 'add') {
        // Finalize render, then fade it in
        taskNode.setTranslate(finalStates['x'], finalStates['y']);
        this.fadeInElemsDC.push(taskNode);
      } else if (renderState === 'exist' || renderState === 'migrate') {
        // Translate, then finalize render at the end of animation
        translationsAnimator = this.translationsPlayableDC.getAnimator();
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, taskNode, taskNode.getTranslateX, taskNode.setTranslateX, finalStates['x']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, taskNode, taskNode.getTranslateY, taskNode.setTranslateY, finalStates['y']);
      }
    } else // No animation; finalize render immediately
      {
        taskNode.setTranslate(finalStates['x'], finalStates['y']);
      }
  };
  /**
   * Prepares task node animation.
   * @param {DvtGanttTaskNode} taskNode
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskNodeRemove = function (taskNode, onEnd) {
    if (this._animationMode === 'dataChange') {
      // Fade out, then finalize render at the end of animation
      this.fadeOutElemsDC.push(taskNode);

      this._onEnds.push(onEnd);
    } else // No animation; just execute onEnd callback immediately to finalize render
      {
        onEnd();
      }
  };
  /**
   * Prepares task baseline shape animation.
   * @param {DvtGanttTask} task
   * @param {DvtGanttTaskShape} baselineShape
   * @param {object} finalStates Object defining the final animation state
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskBaseline = function (task, baselineShape, finalStates, onEnd) {
    var dimensionsAnimator,
        translationsAnimator,
        renderState = task.getRenderState('baseline');

    if (this._animationMode === 'onDisplay') {
      // Finalize render, start off the width to be 0, and grow the width dimension to its final width
      baselineShape.setDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
      onEnd();
      dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
      dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, baselineShape, baselineShape.getWidth, baselineShape.setWidth, finalStates['w']);
    } else if (this._animationMode === 'dataChange') {
      if (renderState === 'add') {
        // Finalize render, start off the width to be 0, and grow the width dimension to its final width
        baselineShape.setDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
        onEnd();
        dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
        dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, baselineShape, baselineShape.getWidth, baselineShape.setWidth, finalStates['w']);
      } else if (renderState === 'exist') {
        // Animate translation and dimensional changes, finalize render at the end of animation
        translationsAnimator = this.translationsPlayableDC.getAnimator();
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, baselineShape, baselineShape.getX, baselineShape.setX, finalStates['x']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, baselineShape, baselineShape.getY, baselineShape.setY, finalStates['y']);
        dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
        dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, baselineShape, baselineShape.getWidth, baselineShape.setWidth, finalStates['w']);
        dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, baselineShape, baselineShape.getHeight, baselineShape.setHeight, finalStates['h']);
        baselineShape.setBorderRadius(finalStates['r']);

        this._onEnds.push(onEnd);
      }
    } else // No animation; finalize render immediately
      {
        baselineShape.setDimensions(finalStates['x'], finalStates['y'], finalStates['w'], finalStates['h'], finalStates['r']);
        onEnd();
      }
  };
  /**
   * Prepares task baseline shape removal animation.
   * @param {DvtGanttTaskShape} baselineShape
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskBaselineRemove = function (baselineShape, onEnd) {
    if (this._animationMode === 'dataChange') {
      // Fade out element, finalize render at the end of animation
      this.fadeOutElemsDC.push(baselineShape);

      this._onEnds.push(onEnd);
    } else // No animation; just execute onEnd callback immediately to finalize render
      {
        onEnd();
      }
  };
  /**
   * Prepares task main shape animation.
   * @param {DvtGanttTask} task
   * @param {object} finalStates Object defining the final animation state
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskMain = function (task, finalStates, onEnd) {
    var dimensionsAnimator,
        translationsAnimator,
        renderState = task.getRenderState('main');

    if (this._animationMode === 'onDisplay') {
      // Finalize render, start off the width to be 0, and grow the width dimension to its final width
      task.setMainDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
      onEnd();
      dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
      dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getMainWidth, task.setMainWidth, finalStates['w']);
    } else if (this._animationMode === 'dataChange') {
      if (renderState === 'add') {
        // Finalize render, start off the width to be 0, and grow the width dimension to its final width
        task.setMainDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
        onEnd();
        dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
        dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getMainWidth, task.setMainWidth, finalStates['w']);
      } else if (renderState === 'exist') {
        // Animate translation and dimensional changes, finalize render at the end of animation
        translationsAnimator = this.translationsPlayableDC.getAnimator();
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getMainX, task.setMainX, finalStates['x']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getMainY, task.setMainY, finalStates['y']);
        dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
        dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getMainWidth, task.setMainWidth, finalStates['w']);
        dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getMainHeight, task.setMainHeight, finalStates['h']);
        task.setMainBorderRadius(finalStates['r']);

        this._onEnds.push(onEnd);
      }
    } else // No animation; finalize render immediately
      {
        task.setMainDimensions(finalStates['x'], finalStates['y'], finalStates['w'], finalStates['h'], finalStates['r']);
        onEnd();
      }
  };
  /**
   * Prepares task main shape removal animation.
   * @param {DvtGanttTaskShape} mainShape
   * @param {DvtGanttTaskShape} selectShape
   * @param {DvtGanttTaskShape} hoverShape
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskMainRemove = function (mainShape, selectShape, hoverShape, onEnd) {
    if (this._animationMode === 'dataChange') {
      // Fade out elements related to the main shape, finalize render at the end of animation
      this.fadeOutElemsDC.push(mainShape);

      if (selectShape) {
        this.fadeOutElemsDC.push(selectShape);
      }

      if (hoverShape) {
        this.fadeOutElemsDC.push(hoverShape);
      }

      this._onEnds.push(onEnd);
    } else // No animation; just execute onEnd callback immediately to finalize render
      {
        onEnd();
      }
  };
  /**
   * Prepares task progress shape animation.
   * @param {DvtGanttTask} task
   * @param {DvtGanttTaskShape} progressShape
   * @param {object} finalStates Object defining the final animation state
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskProgress = function (task, progressShape, finalStates, onEnd) {
    var dimensionsAnimator,
        translationsAnimator,
        renderState = task.getRenderState('progress');

    if (this._animationMode === 'onDisplay') {
      // Finalize render, start off the width to be 0, and grow the width dimension to its final width
      progressShape.setDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
      onEnd();
      dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
      dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, progressShape, progressShape.getWidth, progressShape.setWidth, finalStates['w']);
    } else if (this._animationMode === 'dataChange') {
      if (renderState === 'add') {
        // Finalize render, start off the width to be 0, and grow the width dimension to its final width
        progressShape.setDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
        onEnd();
        dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
        dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, progressShape, progressShape.getWidth, progressShape.setWidth, finalStates['w']);
      } else if (renderState === 'exist') {
        // Animate translation and dimensional changes, finalize render at the end of animation
        translationsAnimator = this.translationsPlayableDC.getAnimator();
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, progressShape, progressShape.getX, progressShape.setX, finalStates['x']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, progressShape, progressShape.getY, progressShape.setY, finalStates['y']);
        dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
        dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, progressShape, progressShape.getWidth, progressShape.setWidth, finalStates['w']);
        dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, progressShape, progressShape.getHeight, progressShape.setHeight, finalStates['h']);
        progressShape.setBorderRadius(finalStates['r']);

        this._onEnds.push(onEnd);
      }
    } else // No animation; finalize render immediately
      {
        progressShape.setDimensions(finalStates['x'], finalStates['y'], finalStates['w'], finalStates['h'], finalStates['r']);
        onEnd();
      }
  };
  /**
   * Prepares task progress shape removal animation.
   * @param {DvtGanttTaskShape} progressShape
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskProgressRemove = function (progressShape, onEnd) {
    if (this._animationMode === 'dataChange') {
      // Fade out element, finalize render at the end of animation
      this.fadeOutElemsDC.push(progressShape);

      this._onEnds.push(onEnd);
    } else // No animation; just execute onEnd callback immediately to finalize render
      {
        onEnd();
      }
  };
  /**
   * Prepares task label animation.
   * @param {DvtGanttTaskNode} taskNode
   * @param {object} finalStates Object defining the final animation state
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskLabel = function (taskNode, finalStates, onEnd) {
    var translationsAnimator,
        task = taskNode.getTask(),
        taskLabel = taskNode.getTaskLabel(),
        labelOutputText = taskLabel.getLabelOutputText(),
        renderState = taskLabel.getRenderState(),
        taskMainRenderState = task.getRenderState('main');

    if (this._animationMode === 'onDisplay') {
      // Finalize render, start off the label x to match main task shape's x (should be at 0 width at this point), animate translation
      onEnd();
      labelOutputText.setY(finalStates['y']);
      labelOutputText.setX(task.getShape('main').getX());
      translationsAnimator = this.translationsPlayableIR.getAnimator();
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getX, labelOutputText.setX, finalStates['x']);
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getY, labelOutputText.setY, finalStates['y']);
    } else if (this._animationMode === 'dataChange') {
      if (renderState === 'add') {
        // Finalize render
        labelOutputText.setX(finalStates['x']);
        labelOutputText.setY(finalStates['y']);
        onEnd();

        if (taskMainRenderState === 'add') {
          // Start off the label x to match main task shape's x (should be at 0 width at this point), animate translation
          labelOutputText.setX(task.getShape('main').getX());
          translationsAnimator = this.translationsPlayableDC.getAnimator();
          translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getX, labelOutputText.setX, finalStates['x']);
          translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getY, labelOutputText.setY, finalStates['y']);
        } else if (taskMainRenderState === 'exist') {
          // Fade in
          this.fadeInElemsDC.push(labelOutputText);
        }
      } else if (renderState === 'exist') {
        // Translate animation
        translationsAnimator = this.translationsPlayableDC.getAnimator();
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getX, labelOutputText.setX, finalStates['x']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getY, labelOutputText.setY, finalStates['y']);

        this._onEnds.push(onEnd);
      }
    } else // No animation; just execute onEnd callback immediately to finalize render
      {
        labelOutputText.setX(finalStates['x']);
        labelOutputText.setY(finalStates['y']);
        onEnd();
      }
  };
  /**
   * Prepares task label animation.
   * @param {dvt.OutputText} labelOutputText
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateTaskLabelRemove = function (labelOutputText, onEnd) {
    if (this._animationMode === 'dataChange') {
      // Fade out, finalize render at the end of animation
      this.fadeOutElemsDC.push(labelOutputText);

      this._onEnds.push(onEnd);
    } else // No animation; just execute onEnd callback immediately to finalize render
      {
        onEnd();
      }
  };
  /**
   * Prepares horizontal grid line animation.
   * @param {dvt.Line} line The horizontal grid line
   * @param {object} finalStates Object defining the final animation state
   * @param {string} renderState The render state of the line
   */


  DvtGanttAnimationManager.prototype.preAnimateHorizontalGridline = function (line, finalStates, renderState) {
    var translationsAnimator;

    if (this._animationMode === 'dataChange') {
      if (renderState === 'add') {
        // Finalize render, then fade it in
        line.setY1(finalStates['y1']);
        line.setY2(finalStates['y2']);
        line.setX1(finalStates['x1']);
        line.setX2(finalStates['x2']);
        this.fadeInElemsDC.push(line);
      } else if (renderState === 'exist') {
        // Translation animation
        translationsAnimator = this.translationsPlayableDC.getAnimator();
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, line, line.getX1, line.setX1, finalStates['x1']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, line, line.getX2, line.setX2, finalStates['x2']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, line, line.getY1, line.setY1, finalStates['y1']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, line, line.getY2, line.setY2, finalStates['y2']);
      }
    } else // No animation; finalize render immediately
      {
        line.setY1(finalStates['y1']);
        line.setY2(finalStates['y2']);
        line.setX1(finalStates['x1']);
        line.setX2(finalStates['x2']);
      }
  };
  /**
   * Prepares gantt background animation.
   * @param {dvt.Rect} background
   * @param {object} finalStates Object defining the final animation state
   * @param {string} renderState The render state of the background
   */


  DvtGanttAnimationManager.prototype.preAnimateRowBackground = function (background, finalStates, renderState) {
    var dimensionsAnimator, translationsAnimator;

    if (this._animationMode === 'dataChange') {
      if (renderState === 'add') {
        this.fadeInElemsDC.push(background);
      } // Animate dimension and translation changes


      dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
      dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, background, background.getHeight, background.setHeight, finalStates['h']);
      dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, background, background.getWidth, background.setWidth, finalStates['w']);
      translationsAnimator = this.translationsPlayableDC.getAnimator();
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, background, background.getY, background.setY, finalStates['y']);
    } else // No animation; finalize render immediately
      {
        background.setY(finalStates['y']);
        background.setHeight(finalStates['h']);
        background.setWidth(finalStates['w']);
      }
  };
  /**
   * Prepares row node removal animation.
   * @param {DvtGanttRowNode} rowNode
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateRowNodeRemove = function (rowNode, onEnd) {
    if (this._animationMode === 'dataChange') {
      // Fade out, finalize rendering at the end
      this.fadeOutElemsDC.push(rowNode);
      this.fadeOutElemsDC.push(rowNode.getBackground());

      this._onEnds.push(onEnd);
    } else // No animation; just execute onEnd callback immediately to finalize render
      {
        onEnd();
      }
  };
  /**
   * Prepares row label animation.
   * @param {DvtGanttRowNode} rowNode
   * @param {DvtGanttRowLabelContent} labelContent
   * @param {object} finalStates Object defining the final animation state
   */


  DvtGanttAnimationManager.prototype.preAnimateRowLabel = function (rowNode, labelContent, finalStates) {
    var rowRenderState = rowNode.getRenderState(),
        translationsAnimator;

    if (this._animationMode === 'dataChange') {
      if (rowRenderState === 'add') {
        // Finalize render, then fade in
        labelContent.setY(finalStates['y']);
        labelContent.setX(finalStates['x']);
        this.fadeInElemsDC.push(labelContent.getDisplayable());
      } else if (rowRenderState === 'exist') {
        // Translation animation
        translationsAnimator = this.translationsPlayableDC.getAnimator();
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelContent, labelContent.getX, labelContent.setX, finalStates['x']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelContent, labelContent.getY, labelContent.setY, finalStates['y']);
      }
    } else // No animation; finalize render immediately
      {
        labelContent.setY(finalStates['y']);
        labelContent.setX(finalStates['x']);
      }
  };
  /**
   * Prepares row label removal animation.
   * @param {DvtGanttRowLabelContent} labelContent
   * @param {function} onEnd callback that finalizes rendering
   */


  DvtGanttAnimationManager.prototype.preAnimateRowLabelRemove = function (labelContent, onEnd) {
    if (this._animationMode === 'dataChange') {
      // Fade out, then finalize render
      this.fadeOutElemsDC.push(labelContent.getDisplayable());

      this._onEnds.push(onEnd);
    } else // No animation; just execute onEnd callback immediately to finalize render
      {
        onEnd();
      }
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Data view layout manager for dvt.Gantt
   * @param {dvt.Gantt} gantt the Gantt component
   * @class
   * @constructor
   */


  var DvtGanttDataLayoutManager = function DvtGanttDataLayoutManager(gantt) {
    this.Init(gantt);
  };

  dvt.Obj.createSubclass(DvtGanttDataLayoutManager, dvt.Obj);
  /**
   * Initialize the layout manager
   * @param {dvt.Gantt} gantt the Gantt component
   * @protected
   */

  DvtGanttDataLayoutManager.prototype.Init = function (gantt) {
    this._gantt = gantt;
    this._ctx = gantt.getCtx();
    this._rowObjs = [];
    this._dependencyObjs = [];
    this._contentHeight = 0;
  };
  /**
   * Clears the row layout objects array
   */


  DvtGanttDataLayoutManager.prototype.clear = function () {
    this._rowObjs = [];
    this._dependencyObjs = [];
    this._contentHeight = 0;
    this._prevScrollMinRowInd = null;
    this._prevScrollMaxRowInd = null;
  };
  /**
   * Gets the row layout objects
   * @return {Array} an array of row layout objects
   */


  DvtGanttDataLayoutManager.prototype.getRowObjs = function () {
    return this._rowObjs;
  };
  /**
   * Gets the dependency layout objects
   * @return {Array} an array of dependency layout objects
   */


  DvtGanttDataLayoutManager.prototype.getDependencyObjs = function () {
    return this._dependencyObjs;
  };
  /**
   * Gets the height of the entire Gantt content
   * @return {number} the height of the gantt content area, including rows, gridlines, etc.
   */


  DvtGanttDataLayoutManager.prototype.getContentHeight = function () {
    return this._contentHeight;
  };
  /**
   * Helper method to convert ISO date string to milliseconds.
   * @param {string} date The query ISO date string
   * @return {number} date in milliseconds
   * @private
   */


  DvtGanttDataLayoutManager.prototype._getTime = function (date) {
    if (date == null || date === '') return null;
    var time = new Date(date).getTime();
    return isNaN(time) ? null : time;
  };
  /**
   * Determines whether given two tasks overlap chronologically
   * @param {Object} taskObj1 task layout object
   * @param {Object} taskObj2 task layout object
   * @return {boolean} Whether the two tasks overlap chronologically
   * @private
   */


  DvtGanttDataLayoutManager.prototype._isOverlap = function (taskObj1, taskObj2) {
    // Decision now is if task1 ends at the same time task2 starts, they are still not overlapping.
    // If we decide that they should be considered overlapping, change the < to <=
    return taskObj1['overallStartTime'] < taskObj2['overallEndTime'] && taskObj2['overallStartTime'] < taskObj1['overallEndTime'];
  };
  /**
   * Calculates height values of the task and stores them in the given task layout object
   * @param {Object} taskObj task layout object
   * @private
   */


  DvtGanttDataLayoutManager.prototype._calcTaskHeight = function (taskObj) {
    var taskDefaults = this._gantt.getOptions()['taskDefaults'];

    var taskProps = taskObj['data'];
    var progressProps = taskProps['progress'];
    var baselineProps = taskProps['baseline'];
    var isBaselineMilestone = false;
    var taskType = taskProps['type'] ? taskProps['type'] : taskDefaults['type'];
    var taskHeight = taskProps['height'] != null ? taskProps['height'] : taskDefaults['height'];
    var baselineHeight = 0;

    if (baselineProps && !(taskObj['baselineStartTime'] == null && taskObj['baselineEndTime'] == null)) {
      baselineHeight = baselineProps['height'] != null ? baselineProps['height'] : taskDefaults['baseline']['height'];
      isBaselineMilestone = taskType === 'milestone' || taskType === 'auto' && taskObj['baselineStartTime'] === taskObj['baselineEndTime']; // If app didn't set a height value on the baseline or on the task defaults, then use the default height

      if (baselineProps['height'] == null && taskDefaults['baseline']['height'] === DvtGanttStyleUtils.getBaselineTaskHeight()) {
        baselineHeight = isBaselineMilestone ? DvtGanttStyleUtils.getActualTaskHeight() : taskDefaults['baseline']['height'];
      } // If app didn't set a height value on the task or on the task defaults, then use the default height for when the baseline is present


      if (taskProps['height'] == null && taskDefaults['height'] === DvtGanttStyleUtils.getStandaloneTaskHeight()) {
        taskHeight = DvtGanttStyleUtils.getActualTaskHeight();
      }
    }

    taskObj['height'] = taskHeight;
    taskObj['baselineHeight'] = baselineHeight;
    var heightTaskToptoBaselineBottom = isBaselineMilestone ? DvtGanttStyleUtils.getMilestoneBaselineYOffset() + Math.max(baselineHeight, taskHeight) : taskHeight + baselineHeight;
    taskObj['overallHeightNoProgress'] = heightTaskToptoBaselineBottom;
    taskObj['overallHeight'] = heightTaskToptoBaselineBottom;
    taskObj['progressHeight'] = 0;
    var isTaskMilestone = taskType === 'milestone' || taskType === 'auto' && taskObj['startTime'] === taskObj['endTime'] && taskObj['startTime'] != null;

    if (!isTaskMilestone && progressProps && typeof progressProps['value'] === 'number') {
      var progressHeight = progressProps['height'] != null ? progressProps['height'] : taskDefaults['progress']['height'];
      progressHeight = progressHeight === '100%' ? taskHeight : DvtGanttStyleUtils.getSizeInPixels(progressHeight, taskHeight);
      taskObj['progressHeight'] = progressHeight;

      if (taskHeight < progressHeight) {
        taskObj['overallHeight'] = Math.max(progressHeight, (progressHeight - taskHeight) / 2 + heightTaskToptoBaselineBottom);
      }
    }
  };
  /**
   * Clears adjacency information of the given task layout object
   * @param {Object} taskObj The task layout object
   * @private
   */


  DvtGanttDataLayoutManager.prototype._clearAdjacency = function (taskObj) {
    taskObj['previousAdjacentTaskObj'] = null;
    taskObj['nextAdjacentTaskObj'] = null;
    taskObj['prevAdjMilestoneBaselineTaskObj'] = null;
    taskObj['nextAdjMilestoneBaselineTaskObj'] = null;
  };
  /**
   * Track row level baseline milestones (used later for label auto positioning, since baseline milestones can collide with labels)
   * O(blgb + cn) algo to find baseline milestones between tasks. Most cases b is small (few baseline milestones) so essentially linear time
   * @param {Object} rowObj The row layout object
   * @param {number} numRowLevels The number of row levels the row has
   * @private
   */


  DvtGanttDataLayoutManager.prototype._trackRowLevelBaselineMilestones = function (rowObj, numRowLevels) {
    var taskObjs = rowObj['taskObjs'];
    var rowLevelBaselineMilestonesObjs = [];

    for (var j = 0; j < numRowLevels; j++) {
      rowLevelBaselineMilestonesObjs.push([]);
    }

    for (var i = 0; i < taskObjs.length; i++) {
      var taskObj = taskObjs[i];

      var taskDefaults = this._gantt.getOptions()['taskDefaults'];

      var taskProps = taskObj['data'];
      var taskType = taskProps['type'] ? taskProps['type'] : taskDefaults['type'];
      var isBaselineMilestone = taskType === 'milestone' || taskType === 'auto' && taskObj['baselineStartTime'] === taskObj['baselineEndTime'];

      if (isBaselineMilestone) {
        rowLevelBaselineMilestonesObjs[taskObj['_rowLevel']].push(taskObj);
      }
    }

    for (var j = 0; j < numRowLevels; j++) {
      rowLevelBaselineMilestonesObjs[j].sort(function (a, b) {
        return b['baselineStartTime'] - a['baselineStartTime']; // descending order by time
      });
    }

    for (var i = 0; i < taskObjs.length; i++) {
      taskObj = taskObjs[i];
      var baselineMilestoneObjs = rowLevelBaselineMilestonesObjs[taskObj['_rowLevel']];
      var numMilestoneObjs = baselineMilestoneObjs.length;

      if (numMilestoneObjs > 0) {
        var taskObjWithBaseline = baselineMilestoneObjs[numMilestoneObjs - 1];
        var baselineTime = taskObjWithBaseline['baselineStartTime'];
        var currentTaskObjStartTime = taskObj['startTime'];
        var currentTaskObjEndTime = taskObj['endTime'];

        if (baselineTime < currentTaskObjStartTime) {
          taskObj['prevAdjMilestoneBaselineTaskObj'] = taskObjWithBaseline;
          baselineMilestoneObjs.pop();
        } else if (baselineTime > currentTaskObjEndTime && taskObj['nextAdjMilestoneBaselineTaskObj'] == null) {
          taskObj['nextAdjMilestoneBaselineTaskObj'] = taskObjWithBaseline;
        } else if (baselineTime === currentTaskObjStartTime || baselineTime === currentTaskObjEndTime) {
          baselineMilestoneObjs.pop();
        }
      }
    }
  };
  /**
   * Calculates the height of the row (and those of the tasks within it) and stores them in the given row layout object.
   * @param {Object} rowObj The row layout object
   * @param {number} horizontalLineHeightOffset The horizontal line height
   * @private
   */


  DvtGanttDataLayoutManager.prototype._calcRowTaskYHeight = function (rowObj, horizontalLineHeightOffset) {
    var taskObjs = rowObj['taskObjs'];

    var options = this._gantt.getOptions();

    var rowDefaultsHeight = options['rowDefaults']['height'];
    var defaultOverlapBehavior = options['taskDefaults']['overlap']['behavior'];
    var defaultOverlapOffset = options['taskDefaults']['overlap']['offset'];
    var earliestOverlayTaskObj;
    var overlapChains = [];
    var rowLevelRecentTaskObjs = [];

    for (var i = 0; i < taskObjs.length; i++) {
      var taskObj = taskObjs[i];

      this._calcTaskHeight(taskObj);

      this._clearAdjacency(taskObj);

      var taskData = taskObj['data'];
      var taskOverlapBehavior = taskData['overlap'] ? taskData['overlap']['behavior'] : null;
      var overlapBehavior = taskOverlapBehavior != null ? taskOverlapBehavior : defaultOverlapBehavior;
      overlapBehavior = overlapBehavior === 'auto' ? rowDefaultsHeight == null ? 'stack' : 'stagger' : overlapBehavior;
      taskObj['overlapBehavior'] = overlapBehavior;
      var overlapOffset = defaultOverlapOffset; // right now, task cannot override default overlap offset

      if (overlapBehavior === 'overlay' && earliestOverlayTaskObj == null) {
        earliestOverlayTaskObj = taskObj;
      }

      if (i === 0) {
        rowLevelRecentTaskObjs.push(taskObj);
        taskObj['_rowLevel'] = 0;
        var overlapChain = [taskObj];
        overlapChains.push(overlapChain);

        if (overlapBehavior === 'stagger') {
          taskObj['_staggerDirection'] = 1;
        }

        taskObj['y'] = 0;
        continue;
      }

      var previousTaskObj = taskObjs[i - 1];

      var thisOverlapsPrevious = this._isOverlap(taskObj, previousTaskObj);

      if (thisOverlapsPrevious) {
        overlapChain.push(taskObj);
      } else {
        overlapChain = [taskObj];
        overlapChains.push(overlapChain);
      }

      var effectiveOverlapOffset = overlapOffset || 0;
      var rowLevel = 0;

      switch (overlapBehavior) {
        case 'stack':
          var promote = true;

          for (var j = 0; j < rowLevelRecentTaskObjs.length; j++) {
            var previousAdjacentTaskObj = null;

            if (this._isOverlap(taskObj, rowLevelRecentTaskObjs[j])) {
              rowLevel += 1;
            } else {
              previousAdjacentTaskObj = rowLevelRecentTaskObjs[j];
              rowLevelRecentTaskObjs[j] = taskObj;
              promote = false;
              break;
            }
          }

          if (promote) {
            rowLevelRecentTaskObjs.push(taskObj);
          }

          taskObj['y'] = overlapOffset != null ? rowLevel * overlapOffset : 0;

          if (previousAdjacentTaskObj) {
            taskObj['previousAdjacentTaskObj'] = previousAdjacentTaskObj;
            previousAdjacentTaskObj['nextAdjacentTaskObj'] = taskObj;
          }

          break;

        case 'stagger':
          if (thisOverlapsPrevious) {
            taskObj['_rowLevel'] = previousTaskObj['_rowLevel'];
            rowLevelRecentTaskObjs[previousTaskObj['_rowLevel']] = taskObj;
            taskObj['_staggerDirection'] = previousTaskObj['_staggerDirection'] != null ? -previousTaskObj['_staggerDirection'] : -1;
            taskObj['y'] = previousTaskObj['y'] - taskObj['_staggerDirection'] * effectiveOverlapOffset;
          } else {
            rowLevelRecentTaskObjs[rowLevel] = taskObj;
            taskObj['_staggerDirection'] = 1;
            taskObj['y'] = 0;
          }

          taskObj['previousAdjacentTaskObj'] = previousTaskObj;
          previousTaskObj['nextAdjacentTaskObj'] = taskObj;
          break;

        case 'overlay':
          rowLevelRecentTaskObjs[rowLevel] = taskObj;
          taskObj['y'] = 0;
          break;
      }

      taskObj['_rowLevel'] = rowLevel;
    }

    rowObj['earliestOverlayTaskObj'] = earliestOverlayTaskObj; // Add padding to task y when row height is not fixed

    if (rowDefaultsHeight == null) {
      // Figure out offset based on row level height
      if (overlapOffset == null) {
        var rowLevelHeights = rowLevelRecentTaskObjs.map(function () {
          return 0;
        });
        taskObjs.forEach(function (taskObj) {
          if (taskObj['overallHeight'] > rowLevelHeights[taskObj['_rowLevel']]) {
            rowLevelHeights[taskObj['_rowLevel']] = taskObj['overallHeight'];
          }
        });
        var rowLevelCumHeightsWithPadding = rowLevelHeights.map(function (rowLevelHeight) {
          return rowLevelHeight + 2 * DvtGanttStyleUtils.getTaskPadding();
        }).reduce(function (acc, curr, i) {
          acc.push((acc[i - 1] || 0) + curr);
          return acc;
        }, []);
        taskObjs.forEach(function (taskObj) {
          taskObj['y'] += (rowLevelCumHeightsWithPadding[taskObj['_rowLevel'] - 1] || 0) + DvtGanttStyleUtils.getTaskPadding();
        }); // TODO: Consider moving this calculation call to when row rendering actually happens to alleviate layout calculation time

        this._trackRowLevelBaselineMilestones(rowObj, rowLevelRecentTaskObjs.length);
      } else {
        taskObjs.forEach(function (taskObj) {
          if (taskObj['_rowLevel'] === 0) {
            taskObj['y'] += DvtGanttStyleUtils.getTaskPadding();
          }
        });
      }
    }

    var overlapChainHeights = overlapChains.map(function (chain) {
      var chainHeight = 0;
      chain.forEach(function (chainTaskObj) {
        var distanceFromBottomToRowTop = chainTaskObj['y'] + chainTaskObj['overallHeight'];

        if (distanceFromBottomToRowTop > chainHeight) {
          chainHeight = distanceFromBottomToRowTop;
        }
      });
      return chainHeight;
    });

    if (rowDefaultsHeight == null) {
      // If no tasks in the row, still show empty row with height as if a single task is there.
      if (taskObjs.length === 0) {
        rowObj['height'] = DvtGanttStyleUtils.getStandaloneTaskHeight() + 2 * DvtGanttStyleUtils.getTaskPadding();
        return;
      } // Align everything to the top and grow the row height to accommodate everything


      rowObj['height'] = overlapChainHeights.reduce(function (a, b) {
        return Math.max(a, b);
      }) + DvtGanttStyleUtils.getTaskPadding();
      overlapChains.forEach(function (chain, i) {
        chain.forEach(function (taskObj) {
          taskObj['y'] += rowObj['y'];
        });
      });
    } else {
      // Fix the row height and mid align everything
      rowObj['height'] = rowDefaultsHeight - horizontalLineHeightOffset;
      overlapChains.forEach(function (chain, i) {
        var chainHeight = overlapChainHeights[i];
        var minTaskY = Number.MAX_VALUE;
        chain.forEach(function (taskObj) {
          taskObj['y'] += Math.floor((rowObj['height'] - taskObj['overallHeight']) / 2);

          if (taskObj['y'] < minTaskY) {
            minTaskY = taskObj['y'];
          }
        });
        var offsetFromRowCenter = Math.floor((rowObj['height'] - chainHeight) / 2) - minTaskY;
        chain.forEach(function (taskObj) {
          if (taskObj['overlapBehavior'] === 'overlay') {
            taskObj['y'] += rowObj['y'];
          } else {
            taskObj['y'] += rowObj['y'] + offsetFromRowCenter;
          }
        });
      });
    }
  };
  /**
   * Generate an array of row layout objects given the rows data array
   * @param {Array} rows The rows data array
   * @return {Array} The row layout objects array
   * @private
   */


  DvtGanttDataLayoutManager.prototype._generateRowObjs = function (rows) {
    var options = this._gantt.getOptions();

    var horizontalLineHeightOffset = 0;
    if (this._gantt.isHorizontalGridlinesVisible()) horizontalLineHeightOffset = DvtGanttStyleUtils.getHorizontalGridlineWidth(options);
    var rowObjs = [];
    var top = 0;

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var tasks = row['tasks'];

      if (tasks != null) {
        var rowObj = {
          'id': row['id'] != null ? row['id'] : tasks.length > 0 ? tasks[0]['id'] : null,
          'data': row,
          'index': i,
          'y': top,
          'renderState': 'add'
        }; // Hierarchical data case

        if (row['_depth'] != null) {
          rowObj['depth'] = row['_depth'];
          rowObj['expanded'] = row['_expanded'];
          rowObj['parentRowIndex'] = row['_parentFlatIndex'];
          row['_depth'] = undefined;
          row['_expanded'] = undefined;
          row['_parentFlatIndex'] = undefined;
          row['_flatIndex'] = undefined;
        }

        var taskObjs = [];

        for (var j = 0; j < tasks.length; j++) {
          var task = tasks[j];
          var taskObj = {
            'id': task['id'],
            'data': task,
            'startTime': task['start'] && task['start'] !== '' ? this._getTime(task['start']) : this._getTime(task['end']),
            'endTime': task['end'] && task['end'] !== '' ? this._getTime(task['end']) : this._getTime(task['start']),
            'rowObj': rowObj,
            'renderState': 'add'
          };
          var overallStartTime = taskObj['startTime'];
          var overallEndTime = taskObj['endTime'];
          var baseline = task['baseline'];

          if (baseline) {
            var baselineStartTime = baseline['start'] && baseline['start'] !== '' ? this._getTime(baseline['start']) : this._getTime(baseline['end']);
            var baselineEndTime = baseline['end'] && baseline['end'] !== '' ? this._getTime(baseline['end']) : this._getTime(baseline['start']);

            if (!(baselineStartTime == null && baselineEndTime == null)) {
              taskObj['baselineStartTime'] = baselineStartTime;
              taskObj['baselineEndTime'] = baselineEndTime;

              if (baselineStartTime < overallStartTime || overallStartTime == null) {
                overallStartTime = baselineStartTime;
              }

              if (baselineEndTime > overallEndTime || overallEndTime == null) {
                overallEndTime = baselineEndTime;
              }
            }
          }

          if (overallStartTime != null && overallEndTime != null) {
            taskObj['overallStartTime'] = overallStartTime;
            taskObj['overallEndTime'] = overallEndTime;
            taskObjs.push(taskObj);
          }
        }

        taskObjs.sort(function (a, b) {
          return a['startTime'] - b['startTime'];
        });
        rowObj['taskObjs'] = taskObjs;
        rowObjs.push(rowObj);

        this._calcRowTaskYHeight(rowObj, horizontalLineHeightOffset);

        top += rowObj['height'] + horizontalLineHeightOffset;
      }
    }

    return rowObjs;
  };
  /**
   * Generate an array of dependency layout objects given the dependency data array
   * @param {Array} dependencies The dependency data array
   * @param {*=} idTaskObjMap ojMap keyed by task ids valued by task layout objects
   * @return {Array} The dependency layout objects array
   * @private
   */


  DvtGanttDataLayoutManager.prototype._generateDependencyObjs = function (dependencies, idTaskObjMap) {
    var idTaskObjMap = idTaskObjMap || this._createIdObjMap(this._rowObjs, 'taskObjs');

    var dependencyObjs = [];

    for (var i = 0; i < dependencies.length; i++) {
      var dependency = dependencies[i];
      var predecessorId = dependency['predecessorTaskId'];
      var successorId = dependency['successorTaskId'];
      var type = dependency['type'] == null ? DvtGanttDependencyNode.FINISH_START : dependency['type'];
      var isPredecessorIdValid = predecessorId != null && idTaskObjMap.has(predecessorId);
      var isSuccessorIdValid = successorId != null && idTaskObjMap.has(successorId); // make sure all the mandatory fields are available and valid

      if (DvtGanttDependencyNode._isValidType(type) && isPredecessorIdValid && isSuccessorIdValid && !dvt.Obj.compareValues(this._ctx, predecessorId, successorId)) {
        var predecessorTaskObj = idTaskObjMap.get(predecessorId);
        var successorTaskObj = idTaskObjMap.get(successorId);
        var rowObj1 = predecessorTaskObj['rowObj'];
        var rowObj2 = successorTaskObj['rowObj'];
        var rowObjTop, rowObjBottom;

        if (rowObj1['index'] <= rowObj2['index']) {
          rowObjTop = rowObj1;
          rowObjBottom = rowObj2;
        } else {
          rowObjTop = rowObj2;
          rowObjBottom = rowObj1;
        }

        var dependencyObj = {
          'id': dependency['id'],
          'data': dependency,
          'index': i,
          'type': type,
          'predecessorTaskObj': predecessorTaskObj,
          'successorTaskObj': successorTaskObj,
          'rowObjTop': rowObjTop,
          'rowObjBottom': rowObjBottom
        };
        dependencyObjs.push(dependencyObj);
      }
    } // First sort dependency objs by row top indices, store that information,
    // then finally sort by row bottom indices. This allows us to efficiently
    // find out the set of dependencies crossing the current viewport later.


    dependencyObjs.sort(function (a, b) {
      return a['rowObjTop']['index'] - b['rowObjTop']['index'];
    });

    for (var j = 0; j < dependencyObjs.length - 1; j++) {
      dependencyObjs[j]['nextTopDependencyObj'] = dependencyObjs[j + 1];
      dependencyObjs[j + 1]['prevTopDependencyObj'] = dependencyObjs[j];
    }

    dependencyObjs.sort(function (a, b) {
      return a['rowObjBottom']['index'] - b['rowObjBottom']['index'];
    });
    return dependencyObjs;
  };
  /**
   * Creates a map keyed by ids and valued by layout objects
   * @param {Array} layoutObjects The array of layout objects
   * @param {string=} subObjsProp Optional string to specify the layout objects array is a sub property of the given layoutObjects
   * @return {*} An ojMap
   * @private
   */


  DvtGanttDataLayoutManager.prototype._createIdObjMap = function (layoutObjs, subObjsProp) {
    var idObjMap = new this._ctx.ojMap();

    for (var i = 0; i < layoutObjs.length; i++) {
      var layoutObj = layoutObjs[i];

      if (subObjsProp) {
        var subLayoutObjs = layoutObj[subObjsProp];

        for (var j = 0; j < subLayoutObjs.length; j++) {
          var subLayoutObj = subLayoutObjs[j];
          idObjMap.set(subLayoutObj['id'], subLayoutObj);
        }
      } else {
        idObjMap.set(layoutObj['id'], layoutObj);
      }
    }

    return idObjMap;
  };
  /**
   * Takes the set difference of the provided layoutObjs ids and ids in the provided ojMap
   * and mark the resulting set of layout objects with the given renderState
   * @param {Array} layoutObjs The array of layout objects
   * @param {*} idObjMap The ojMap keyed by ids and valued by layout objects
   * @param {string} renderState The render state to mark the resulting set of layout objects as
   * @param {string=} subObjsProp Optional string to specify the layout objects array is a sub property of the given layoutObjects
   * @private
   */


  DvtGanttDataLayoutManager.prototype._setDifferenceRenderState = function (layoutObjs, idObjMap, renderState, subObjsProp) {
    for (var i = 0; i < layoutObjs.length; i++) {
      var layoutObj = layoutObjs[i];

      if (subObjsProp) {
        var subLayoutObjs = layoutObj[subObjsProp];

        for (var j = 0; j < subLayoutObjs.length; j++) {
          var subLayoutObj = subLayoutObjs[j];

          if (!idObjMap.has(subLayoutObj['id'])) {
            subLayoutObj['renderState'] = renderState;

            if (renderState === 'delete') {
              var subNode = subLayoutObj['node'];

              if (subNode && subNode.getParent()) {
                var parentRenderState = layoutObj['renderState'];

                if (parentRenderState !== 'delete') {
                  // explicitly call remove() on 'deleted' tasks that are in the DOM, and not in a 'deleted' row
                  subNode.remove();
                }
              }
            }
          }
        }
      } else if (!idObjMap.has(layoutObj['id'])) {
        layoutObj['renderState'] = renderState; // explicitly call remove() on 'deleted' rows that are in the DOM

        if (renderState === 'delete') {
          var node = layoutObj['node'];

          if (node && node.getParent()) {
            node.remove();
          }
        }
      }
    }
  };
  /**
   * Takes the set intersection of the ids in the provided old ojMap and ids of the new layout objects
   * and mark the resulting set of new layout objects with the appropriate render states ('exist' or 'migrate')
   * @param {*} oldIdObjsMap The ojMap keyed by ids and valued by old layout objects
   * @param {Array} newObjs The array of new layout objects
   * @param {string=} subObjsProp Optional string to specify the layout objects array is a sub property of the given layoutObjects
   * @private
   */


  DvtGanttDataLayoutManager.prototype._setIntersectionRenderState = function (oldIdObjsMap, newObjs, subObjsProp) {
    for (var i = 0; i < newObjs.length; i++) {
      var newObj = newObjs[i];

      if (subObjsProp) {
        var newSubObjs = newObj[subObjsProp];

        for (var j = 0; j < newSubObjs.length; j++) {
          var newSubObj = newSubObjs[j];
          var entangledOldSubObj = oldIdObjsMap.get(newSubObj['id']);

          if (entangledOldSubObj) {
            if (dvt.Obj.compareValues(this._ctx, entangledOldSubObj['rowObj']['id'], newObj['id'])) {
              newSubObj['renderState'] = 'exist';
            } else {
              newSubObj['renderState'] = 'migrate';
              var subNode = entangledOldSubObj['node']; // If not animating and task node migrates, explicitly remove from the original row.
              // Normally if the final new row exists, adding the task node to the new row would automatically remove it
              // from the original row. However, the new row may not be in the DOM, so we should explicitly remove it.

              if (subNode && subNode.getParent() && this._gantt.getAnimationManager().getAnimationMode() === 'none') {
                subNode.getRowNode().removeChild(subNode);
              }
            }

            newSubObj['_oldObj'] = entangledOldSubObj;
          }
        }
      } else {
        var entangledOldObj = oldIdObjsMap.get(newObj['id']);

        if (entangledOldObj) {
          newObj['renderState'] = 'exist';
          newObj['_oldObj'] = entangledOldObj;
        }
      }
    }
  };
  /**
   * In the animation case, we need to be able to show progression of initial to final states.
   * All initial state elements need to be present in the DOM, and all final state elements need to be rendered.
   * Current rendering strategy is virtual row rendering only, so we'll only consider row layout objects:
   * Relevant visible Initial --> Final state transitions involving rows:
   *     - OLD rows in OLD viewport --> NEW rows (visible or not)
   *     - OLD rows (visible or not) --> NEW rows in NEW viewport
   *     - Task migration:
   *         - Task in OLD viewport from OLD row --> NEW row (visible or not)
   *             - Initial state elements: OLD row, OLD version of the NEW row
   *             - Final state elements: NEW row
   *         - Task from OLD row (visible or not) --> NEW row in NEW viewport
   *             - Initial state elements: OLD row
   *             - Final state elements: NEW row, NEW version of the OLD row
   * NOTE: A side effect of this strategy is that although all initial and final states are shown
   * and followed (which is arguably the most important), any elements that would normally
   * pass through the active viewport during the animation transition are not shown because they won't be in the DOM.
   * This generally shouldn't be noticeable unless there are really drastic data differences
   * causing complex animations (at which point, application should probably just turn off animation because it gets confusing)
   * A full analysis of what would pass through the viewport may also be expensive, so unless someone complains
   * about this being a big deal, this strategy should be sufficient especially since all initial --> final states can be followed.
   * @param {Array} newRowObjs
   * @param {*} oldRowIdObjsMap
   * @param {*} newRowIdObjsMap
   * @param {*} oldTaskIdObjsMap
   * @param {*} newTaskIdObjsMap
   * @private
   */


  DvtGanttDataLayoutManager.prototype._prepareAnimationDOM = function (newRowObjs, oldRowIdObjsMap, newRowIdObjsMap, oldTaskIdObjsMap, newTaskIdObjsMap) {
    var animationManager = this._gantt.getAnimationManager();

    var animationMode = animationManager.getAnimationMode(); // temporarily turn off animation

    animationManager.setAnimationMode('none');
    this._animationFinalStateRowObjs = new Set();
    this._animationInitialStateRowObjsDelete = []; // Find out what the final viewport is
    // Need to temporarily update the contentHeight to the final state contentHeight so that the bounded scrollPosition can be calculated for the final state

    var initialContentHeight = this._contentHeight;
    var newLastRowObj = newRowObjs[newRowObjs.length - 1];
    this._contentHeight = newLastRowObj['y'] + newLastRowObj['height'];

    var finalTranslateY = this._gantt.scrollPositionToTranslateY(this._gantt.getOptions()['scrollPosition']);

    var viewportYBounds = this._gantt.getViewportYBounds(finalTranslateY);

    var yMin = viewportYBounds['yMin'];
    var yMax = viewportYBounds['yMax'];
    this._contentHeight = initialContentHeight;

    var oldViewportRowIndRange = this._findRowIndRange(this._rowObjs, yMin, yMax);

    var oldMinRowInd = oldViewportRowIndRange['minRowInd'];
    var oldMaxRowInd = oldViewportRowIndRange['maxRowInd'];

    for (var i = oldMinRowInd; i <= oldMaxRowInd; i++) {
      var oldRowObj = this._rowObjs[i];

      if (oldRowObj) {
        // OLD row in the OLD viewport (initial state row layout object)
        this.ensureInDOM(oldRowObj, 'row');

        if (oldRowObj['renderState'] === 'delete' && oldRowObj['node'].getRowLabelContent()) {
          // For old rows with labels in view getting deleted, we need to make sure their labels
          // are in the DOM initially--we'll do this in renderViewport after the row axis is cleared
          this._animationInitialStateRowObjsDelete.push(oldRowObj);
        }

        var entangledNewRowObj = newRowIdObjsMap.get(oldRowObj['id']);

        if (entangledNewRowObj) {
          // NEW row corresponding to the OLD row in the OLD viewport (final state row layout object)
          this._animationFinalStateRowObjs.add(entangledNewRowObj);
        }

        var oldTaskObjs = oldRowObj['taskObjs'];

        for (var j = 0; j < oldTaskObjs.length; j++) {
          var oldTaskObj = oldTaskObjs[j];
          var entangledNewTaskObj = newTaskIdObjsMap.get(oldTaskObj['id']);

          if (entangledNewTaskObj) {
            var entangledTaskNewRowObj = entangledNewTaskObj['rowObj'];

            if (!dvt.Obj.compareValues(this._ctx, entangledTaskNewRowObj['id'], oldRowObj['id'])) {
              // Task in OLD viewport from OLD row --> NEW row (visible or not)
              // Initial state row layout object: OLD version of the NEW row
              var oldEntangledTaskNewRowObj = oldRowIdObjsMap.get(entangledTaskNewRowObj['id']);

              if (oldEntangledTaskNewRowObj) {
                this.ensureInDOM(oldEntangledTaskNewRowObj, 'row');
              } // Final state layout object: NEW row


              this._animationFinalStateRowObjs.add(entangledTaskNewRowObj);
            }
          }
        }
      }
    }

    var newViewportRowIndRange = this._findRowIndRange(newRowObjs, yMin, yMax);

    var newMinRowInd = newViewportRowIndRange['minRowInd'];
    var newMaxRowInd = newViewportRowIndRange['maxRowInd'];

    for (var i = newMinRowInd; i <= newMaxRowInd; i++) {
      var newRowObj = newRowObjs[i];

      if (newRowObj) {
        // NEW row in the NEW viewport (final state row layout object)
        this._animationFinalStateRowObjs.add(newRowObj);

        var entangledOldRowObj = oldRowIdObjsMap.get(newRowObj['id']);

        if (entangledOldRowObj) {
          // OLD row corresponding to the NEW row in the NEW viewport (initial state layout object)
          this.ensureInDOM(entangledOldRowObj, 'row');
        }

        var newTaskObjs = newRowObj['taskObjs'];

        for (var j = 0; j < newTaskObjs.length; j++) {
          var newTaskObj = newTaskObjs[j];
          var entangledOldTaskObj = oldTaskIdObjsMap.get(newTaskObj['id']);

          if (entangledOldTaskObj) {
            var entangledTaskOldRowObj = entangledOldTaskObj['rowObj'];

            if (!dvt.Obj.compareValues(this._ctx, entangledTaskOldRowObj['id'], newRowObj['id'])) {
              // Task from OLD row (visible or not) --> NEW row in NEW viewport
              // Initial state row layout object: OLD row
              this.ensureInDOM(entangledTaskOldRowObj, 'row'); // Final state row layout object: NEW version of the OLD row

              var newEntangledTaskOldRowObj = newRowIdObjsMap.get(entangledTaskOldRowObj['id']);

              if (newEntangledTaskOldRowObj) {
                this._animationFinalStateRowObjs.add(newEntangledTaskOldRowObj);
              }
            }
          }
        }
      }
    } // reapply animation mode


    animationManager.setAnimationMode(animationMode); // Set flag to not clear the DOM in renderViewport() because we need the old state present

    this._keepOldViewport = true;
  };
  /**
   * Given a set of new row layout objects, associate all the layout objects with their existing nodes and vice versa
   * @param {Array} newRowObjs Array of new row objects
   * @private
   */


  DvtGanttDataLayoutManager.prototype._associateOldNodesAndNewLayoutObjs = function (newRowObjs) {
    for (var i = 0; i < newRowObjs.length; i++) {
      var rowObj = newRowObjs[i];
      var oldRowObj = rowObj['_oldObj'];

      if (oldRowObj) {
        var rowNode = oldRowObj['node'];

        if (rowNode) {
          rowObj['node'] = rowNode;
          rowNode.setLayoutObject(rowObj);
        }

        rowObj['_oldObj'] = null;
      }

      var taskObjs = rowObj['taskObjs'];

      for (var j = 0; j < taskObjs.length; j++) {
        var taskObj = taskObjs[j];
        var oldTaskObj = taskObj['_oldObj'];

        if (oldTaskObj) {
          var taskNode = oldTaskObj['node'];

          if (taskNode) {
            taskObj['node'] = taskNode;
            taskNode.setLayoutObject(taskObj);

            if (taskNode.isSelected()) {
              // remove selection effects/states before render
              // selection will be reapplied if necessary in the next render call
              taskNode.clearSelectionState();
            }
          }

          taskObj['_oldObj'] = null;
        }
      }
    }
  };
  /**
   * Calculates layout information from data supplied in component options.
   */


  DvtGanttDataLayoutManager.prototype.calcLayout = function () {
    var options = this._gantt.getOptions();

    var ganttRenderState = this._gantt.getRenderState();

    if (ganttRenderState == null) {
      var newTaskIdObjsMap = this._calcRowsLayout(options);
    } else // For now, renderState is only non-null for expand/collapse case
      {
        this._expandCollapseRowObject(options, ganttRenderState['state'], ganttRenderState['payload']);
      }

    if (this._rowObjs.length > 0) {
      var lastRowObj = this._rowObjs[this._rowObjs.length - 1];
      this._contentHeight = lastRowObj['y'] + lastRowObj['height'];
      var dependencies = options['dependencies'];

      if (dependencies != null && dependencies.length > 0) {
        this._dependencyObjs = this._generateDependencyObjs(dependencies, newTaskIdObjsMap);
      }
    }
  };
  /**
   * Calculates row layout objects from options
   * @param {Object} options
   * @return {*} If one is generated, an ojMap keyed by task ids valued by task layout objects. undefined otherwise
   * @private
   */


  DvtGanttDataLayoutManager.prototype._calcRowsLayout = function (options) {
    var rows = options['rows'];

    if (rows == null || rows.length === 0) {
      this._rowObjs = [];
      return;
    }

    var flatRows = rows;

    if (this._gantt.isRowsHierarchical()) {
      flatRows = this._flattenRows(rows, options['expanded']);
    }

    var newRowObjs = this._generateRowObjs(flatRows);

    if (this._rowObjs && !this._gantt.isInitialRender() && this._gantt.isLastRenderValid()) {
      var oldRowIdObjsMap = this._createIdObjMap(this._rowObjs);

      var newRowIdObjsMap = this._createIdObjMap(newRowObjs);

      var oldTaskIdObjsMap = this._createIdObjMap(this._rowObjs, 'taskObjs');

      var newTaskIdObjsMap = this._createIdObjMap(newRowObjs, 'taskObjs'); // Row Difference Analysis:
      // Each old row object either continues to exist, or is removed
      // Each new row object either existed, or is added
      // In other words:
      //     set(old) - set(new) are removed
      //     set(new) - set(old) are added
      //     intersect(set(old), set(new)) are updated


      this._setDifferenceRenderState(this._rowObjs, newRowIdObjsMap, 'delete');

      this._setDifferenceRenderState(newRowObjs, oldRowIdObjsMap, 'add');

      this._setIntersectionRenderState(oldRowIdObjsMap, newRowObjs); // Task Difference Analysis:
      // Each old task object can be removed, updated in its row, or migrated to another row
      // Each new task object can be added, updated in its row, or migrated to another row
      // In other words:
      //     set(old) - set(new) are removed
      //     set(new) - set(old) are added
      //     intersect(set(old), set(new)) are updated, either in its old row or migrated to another row


      this._setDifferenceRenderState(this._rowObjs, newTaskIdObjsMap, 'delete', 'taskObjs');

      this._setDifferenceRenderState(newRowObjs, oldTaskIdObjsMap, 'add', 'taskObjs');

      this._setIntersectionRenderState(oldTaskIdObjsMap, newRowObjs, 'taskObjs'); // Ensure DOM is complete enough to be able to show progression of initial to final states.


      if (this._gantt.getAnimationManager().getAnimationMode() !== 'none') {
        this._prepareAnimationDOM(newRowObjs, oldRowIdObjsMap, newRowIdObjsMap, oldTaskIdObjsMap, newTaskIdObjsMap);
      } // Associate nodes with the new layout objects. This is done after old nodes rendering in the animation case above
      // so that the old nodes can use the old layout objects for rendering.


      this._associateOldNodesAndNewLayoutObjs(newRowObjs);
    }

    this._rowObjs = newRowObjs;
    return newTaskIdObjsMap;
  };
  /**
   * Modify the row layout objects in place by adding new rowObjs if expand and removing rowObjs if collapse,
   * and update all layout positions and animation states.
   * @param {Object} options
   * @param {string} type Either 'expand' or 'collapse'
   * @param {Object} rowObj The layout object of the row being expanded/collapsed
   * @private
   */


  DvtGanttDataLayoutManager.prototype._expandCollapseRowObject = function (options, type, rowObj) {
    var self = this;
    var index = rowObj['index'];
    var row = rowObj['data'];
    var rowChildren = row['rows'];
    var expandedKeySet = options['expanded'];

    var animationManager = this._gantt.getAnimationManager();

    var animationMode = animationManager.getAnimationMode();
    var isAnimationOn = animationMode !== 'none';

    if (isAnimationOn) {
      // Set flag to not clear the DOM in renderViewport() because we need the old state present
      this._keepOldViewport = true;
      this._animationFinalStateRowObjs = new Set();

      var oldViewportYBounds = this._gantt.getViewportYBounds(finalTranslateY);

      var oldYMin = oldViewportYBounds['yMin'];
      var oldYMax = oldViewportYBounds['yMax'];
      var oldViewportHeight = oldYMax - oldYMin;

      var addShiftedRowsToFinalState = function addShiftedRowsToFinalState(rowObjs, startInd, viewportHeight) {
        // Rather than doing heavy diffing, note that at most a viewportHeight's worth
        // of rows are shifted due to expand/collapse, so let's just add all of them
        // to the final state even if some of them are not (going to be) visible
        animationManager.setAnimationMode('none');
        var runningHeight = 0;

        for (var i = startInd; i < rowObjs.length; i++) {
          var rowObj = rowObjs[i];
          self.ensureInDOM(rowObj, 'row');

          self._animationFinalStateRowObjs.add(rowObj);

          runningHeight += rowObj['height'];

          if (runningHeight > viewportHeight) {
            break;
          }
        }

        animationManager.setAnimationMode(animationMode);
      };
    }

    var applyRenderState = function applyRenderState(rowObjs, state, begin, end) {
      for (var i = begin; i < end; i++) {
        var rowObj = rowObjs[i];
        rowObj['renderState'] = state; // explicitly call remove() on 'deleted' rows that are in the DOM

        if (state === 'delete') {
          var node = rowObj['node'];

          if (node && node.getParent()) {
            node.remove();
          }
        }

        var taskObjs = rowObj['taskObjs'];

        for (var j = 0; j < taskObjs.length; j++) {
          var taskObj = taskObjs[j];
          taskObj['renderState'] = state;
        }
      }
    }; // Add/remove rowObjs from the this._rowObjs depending on expand/collapse, and update
    // animation states.


    rowObj['expanded'] = type === 'expand';
    row['_expanded'] = rowObj['expanded'];
    applyRenderState(this._rowObjs, 'exist', 0, this._rowObjs.length);

    if (type === 'expand') {
      var flattenedChildrenRows = this._flattenRows(rowChildren, expandedKeySet, rowObj['index'] + 1, rowObj['depth'] + 1);

      var flattenedChildrenRowObjs = this._generateRowObjs(flattenedChildrenRows);

      applyRenderState(flattenedChildrenRowObjs, 'add', 0, flattenedChildrenRowObjs.length);

      if (isAnimationOn) {
        addShiftedRowsToFinalState(this._rowObjs, index, oldViewportHeight);
      }

      this._rowObjs = this._rowObjs.slice(0, index + 1).concat(flattenedChildrenRowObjs, this._rowObjs.slice(index + 1, this._rowObjs.length));
    } else {
      var flattenedChildrenRowsLength = this._calcFlattenedRowsLength(rowChildren, expandedKeySet);

      applyRenderState(this._rowObjs, 'delete', index + 1, index + 1 + flattenedChildrenRowsLength);

      if (isAnimationOn) {
        addShiftedRowsToFinalState(this._rowObjs, index + 1 + flattenedChildrenRowsLength, oldViewportHeight);
      }

      var removedChildren = this._rowObjs.splice(index + 1, flattenedChildrenRowsLength);

      if (isAnimationOn) {
        // For rows with labels in view getting deleted, we need to make sure their labels
        // are in the DOM initially--we'll do this in renderViewport after the row axis is cleared
        this._animationInitialStateRowObjsDelete = removedChildren;
      }
    } // Update layout positions of all rows under the row being expanded/collapsed


    var horizontalLineHeightOffset = 0;
    if (this._gantt.isHorizontalGridlinesVisible()) horizontalLineHeightOffset = DvtGanttStyleUtils.getHorizontalGridlineWidth(options);
    var top = rowObj['y'] + rowObj['height'] + horizontalLineHeightOffset;

    for (var i = index + 1; i < this._rowObjs.length; i++) {
      var _rowObj = this._rowObjs[i];
      _rowObj['index'] = i;
      var taskObjs = _rowObj['taskObjs'];

      for (var j = 0; j < taskObjs.length; j++) {
        var taskObj = taskObjs[j];
        taskObj['y'] = taskObj['y'] - _rowObj['y'] + top;
      }

      _rowObj['y'] = top;
      top += _rowObj['height'] + horizontalLineHeightOffset;
    }

    if (isAnimationOn) {
      // rows in final viewport should also be added to final state
      var lastRowObj = this._rowObjs[this._rowObjs.length - 1];
      this._contentHeight = lastRowObj['y'] + lastRowObj['height'];

      var finalTranslateY = this._gantt.scrollPositionToTranslateY(this._gantt.getOptions()['scrollPosition']);

      var finalViewportYBounds = this._gantt.getViewportYBounds(finalTranslateY);

      var finalYMin = finalViewportYBounds['yMin'];
      var finalYMax = finalViewportYBounds['yMax'];

      var newViewportRowIndRange = this._findRowIndRange(this._rowObjs, finalYMin, finalYMax);

      var newMinRowInd = newViewportRowIndRange['minRowInd'];
      var newMaxRowInd = newViewportRowIndRange['maxRowInd'];

      for (var k = newMinRowInd; k <= newMaxRowInd; k++) {
        this._animationFinalStateRowObjs.add(this._rowObjs[k]);
      }
    }
  };
  /**
   * Flattens hierarchical row structure
   * @param {Array} rows The hierarchical rows data array
   * @param {*} expandedKeySet The expanded key set
   * @param {number=} flatIndex The current flat index. Assumed to be 0 (root) if not specified
   * @param {number=} depth The current depth. Assumed to be 0 (root) if not specified
   * @return {Array} Flattened array
   * @private
   */


  DvtGanttDataLayoutManager.prototype._flattenRows = function (rows, expandedKeySet, flatIndex, depth) {
    flatIndex = flatIndex || 0;
    depth = depth || 0;

    var rootDataProvider = this._gantt.getOptions()['taskData'];

    var flattenRows = function flattenRows(rows, expandedKeySet, parentRow, depth) {
      return rows.reduce(function (flattenedRows, row) {
        // Since we don't support hierarchical rows, this data must have been generated
        // from a tree data provider, which means we own the rows, and so we are allowed to modify it
        // and add properties. We'll remove then later in generateRowObjs().
        row['_depth'] = depth;
        row['_parentFlatIndex'] = parentRow ? parentRow['_flatIndex'] : null;
        row['_flatIndex'] = flatIndex;
        flatIndex += 1;
        var rowChildren = row['rows'];

        if (rowChildren) {
          if (expandedKeySet.has(row['id'])) {
            row['_expanded'] = true;
            return flattenedRows.concat(row, flattenRows(rowChildren, expandedKeySet, row, depth + 1));
          }

          row['_expanded'] = false;
        } else {
          // It's possible no children detected due to tree data provider lazy loading
          // Make sure there are actually no children before marking it as a leaf.
          if (rootDataProvider) {
            var childDataProvider = rootDataProvider.getChildDataProvider(row['id']);
            var isEmpty = childDataProvider ? childDataProvider.isEmpty() === 'yes' : true;
            row['_expanded'] = !isEmpty ? false : null; // null means leaf
          } else {
            row['_expanded'] = null; // leaf
          }
        }

        return flattenedRows.concat(row);
      }, []);
    };

    return flattenRows(rows, expandedKeySet, null, depth);
  };
  /**
   * Calculates the length of the flattened version of a hierarchical structure
   * @param {Array} rows The hierarchical rows data array
   * @param {*} expandedKeySet The expanded key set
   * @return {number} The length of the flattened array
   */


  DvtGanttDataLayoutManager.prototype._calcFlattenedRowsLength = function (rows, expandedKeySet) {
    var calcFlattenedRowsLength = function calcFlattenedRowsLength(rows) {
      return rows.reduce(function (len, row) {
        var rowChildren = row['rows'];
        if (rowChildren && expandedKeySet.has(row['id'])) return len + 1 + calcFlattenedRowsLength(rowChildren);
        return len + 1;
      }, 0);
    };

    return calcFlattenedRowsLength(rows);
  };
  /**
   * Returns whether the given rowObj corresponds to the root row in the hierarchical case.
   * @param {Object} rowObj
   * @return {boolean}
   */


  DvtGanttDataLayoutManager.prototype.isRoot = function (rowObj) {
    return rowObj['parentRowIndex'] == null;
  };
  /**
   * Returns whether the given rowObj is hidden due to its ancestor being collapsed.
   * @param {Object} rowObj
   * @return {boolean}
   */


  DvtGanttDataLayoutManager.prototype.isHiddenCollapsed = function (rowObj) {
    for (var i = 0; i < this._rowObjs; i++) {
      if (this._rowObjs[i] === rowObj) {
        return false;
      }
    }

    return true;
  };
  /**
   * Returns the rowObj of the parent of the row of the given rowObj. Returns null if the given rowObj is already the root.
   * @param {Object} rowObj
   * @return {Object}
   */


  DvtGanttDataLayoutManager.prototype.getParentRowObj = function (rowObj) {
    var parentRowIndex = rowObj['parentRowIndex'];

    if (parentRowIndex != null) {
      return this._rowObjs[parentRowIndex];
    }

    return null;
  };
  /**
   * Renders the row represented by the given row layout object
   * @param {Object} rowObj The row layout object
   * @return {boolean} True if render is not skipped. False otherwise (e.g. if row is already in the DOM, then render is not called on it).
   * @private
   */


  DvtGanttDataLayoutManager.prototype._renderRowObj = function (rowObj) {
    var databody = this._gantt.getDatabody();

    var rowNode = rowObj['node'];

    if (!this._keepOldViewport && rowNode && rowNode.getParent()) {
      return false;
    }

    if (!rowNode) {
      rowNode = new DvtGanttRowNode(this._gantt);
      rowNode.setLayoutObject(rowObj);
      rowObj['node'] = rowNode;
    }

    if (this._gantt.isRowAxisEnabled()) {
      var rowAxis = this._gantt.getRowAxis();

      if (rowAxis) {
        var rowLabelContents = rowAxis.getRowLabelContents();
        var rowIndex = rowObj['index'];
        var rowLabelContent = rowLabelContents[rowIndex];

        if (!rowLabelContent) {
          rowLabelContent = new DvtGanttRowLabelContent(rowAxis, rowAxis.getLabelContentType());
          rowLabelContent.setRowIndex(rowIndex);
          rowLabelContents[rowIndex] = rowLabelContent;
        }

        rowLabelContent.render(rowObj);
        rowNode.setRowLabelContent(rowLabelContent);
      }
    }

    rowNode.render(databody);
    return true;
  };
  /**
   * Renders the dependency represented by the given dependency layout object
   * @param {Object} dependencyObj The dependency layout object
   * @return {boolean} True if render is not skipped. False otherwise (e.g. if dependency is already in the DOM, then render is not called on it).
   * @private
   */


  DvtGanttDataLayoutManager.prototype._renderDependencyObj = function (dependencyObj) {
    var dependenciesContainer = this._gantt.getDependenciesContainer();

    var dependencyNode = dependencyObj['node'];

    if (dependencyNode && dependencyNode.getParent()) {
      return false;
    } // Render the associated rows if not already, then render the dependency
    // Temporarily disable animation, if on. ensureInDom for rows, adds row to the DOM
    // but we don't want to trigger any animation logic associated with adding rows to the DOM at this point.
    // Dependency lines don't do any fancy preanimation on render (they fade out before animation, fadein on animation end),
    // so it's okay to do this here.


    var animationManager = this._gantt.getAnimationManager();

    var animationMode = animationManager.getAnimationMode();
    animationManager.setAnimationMode('none');

    if (this._animationFinalStateRowObjs) {
      // Only render rows that was not already processed/rendered for animation
      // because ensureInDOM --> _renderRowObj never skips rendering for animation case
      if (!this._animationFinalStateRowObjs.has(dependencyObj['rowObjTop'])) {
        this.ensureInDOM(dependencyObj['rowObjTop'], 'row');
      }

      if (!this._animationFinalStateRowObjs.has(dependencyObj['rowObjBottom'])) {
        this.ensureInDOM(dependencyObj['rowObjBottom'], 'row');
      }
    } else {
      this.ensureInDOM(dependencyObj['rowObjTop'], 'row');
      this.ensureInDOM(dependencyObj['rowObjBottom'], 'row');
    }

    animationManager.setAnimationMode(animationMode);

    if (!dependencyNode) {
      dependencyNode = new DvtGanttDependencyNode(this._gantt);
      dependencyNode.setLayoutObject(dependencyObj);
      dependencyObj['node'] = dependencyNode;
    }

    dependencyNode.render(dependenciesContainer);
    return true;
  };
  /**
   * Given a layout object, render it to the DOM if it doesn't exist already.
   * @param {Object} obj Layout object
   * @param {string} type The type of the layout object
   */


  DvtGanttDataLayoutManager.prototype.ensureInDOM = function (obj, type) {
    if (type === 'dependency') {
      this._renderDependencyObj(obj);

      return;
    }

    var rowObj;

    switch (type) {
      case 'task':
        rowObj = obj['rowObj'];
        break;

      case 'row':
        rowObj = obj;
        break;

      case 'rowLabel':
        rowObj = obj;
        break;
    }

    this._renderRowObj(rowObj);
  };
  /**
   * Binary search for the index of the leftmost element that equals the target.
   * If the target is not in the array, then the returned value is:
   *     - the index of rightmost element less than the target if approximateMode is 'predecessor'
   *     - the index of the leftmost element greater than the target if approximateMode is 'successor'
   * Search is O(lgN), N being the length of the array.
   * @param {Array} array The array
   * @param {number} target The target
   * @param {string} approximateMode The behavior if target is not in the array. 'predecessor' or 'successor'
   * @param {string=} property The optinal property to access the element object from
   * @param {string=} subProperty The optional subproperty to access the element object from
   * @return {number} The leftmost index at which the target is found, or the index of the predecessor/successor element as per approximateMode param
   * @private
   */


  DvtGanttDataLayoutManager.prototype._binarySearchLeftMost = function (array, target, approximateMode, property, subProperty) {
    if (array.length === 0) return 0;
    var L = 0;
    var R = array.length;

    while (L < R) {
      var m = Math.floor((L + R) / 2);
      var value = property ? subProperty ? array[m][property][subProperty] : array[m][property] : array[m];
      if (value < target) L = m + 1;else R = m;
    } // If target is not in the array, then L at this point is the rank of the target in the array,
    // i.e. the number of elements in the array that are less than the target.


    if (L < array.length) {
      value = property ? subProperty ? array[L][property][subProperty] : array[L][property] : array[L];
      if (value === target || approximateMode === 'successor') return L;
    } // L - 1 would give the index of the rightmost element less than the target (predecessor)


    return L > 0 ? L - 1 : 0;
  };
  /**
   * Finds the minimum and maximum row indices relevant to the given viewport bounds
   * @param {Array} rowObjs Array of row layout objects
   * @param {number} yMin The minimum y bound
   * @param {number} yMax The maximum y bound
   * @return {Object} An object with the 'minRowInd' and 'maxRowInd' properties
   * @private
   */


  DvtGanttDataLayoutManager.prototype._findRowIndRange = function (rowObjs, yMin, yMax) {
    // O(lgN) binary search for first row (intersecting yMin)
    var minRowInd = this._binarySearchLeftMost(rowObjs, yMin, 'predecessor', 'y');

    var maxRowInd = minRowInd; // linear search from that row to search for last row (intersecting yMax)

    for (var i = minRowInd; i < rowObjs.length; i++) {
      var rowObj = rowObjs[i];

      if (rowObj['y'] <= yMax) {
        maxRowInd = i;
      } else {
        break;
      }
    }

    return {
      'minRowInd': minRowInd,
      'maxRowInd': maxRowInd
    };
  };
  /**
   * Renders any visible items in the viewport as defined by the given min and max y bounds
   * @param {number} yMin The minimum y bound
   * @param {number} yMax The maximum y bound
   * @param {boolean=} bFromScrolling Whether the viewport refresh is to due scrolling/panning
   * @return {Object} Object of the shape {"minRowInd": index of first row in the viewport, "maxRowInd": index of last row in the viewport}. If there's no data, the values are -1.
   */


  DvtGanttDataLayoutManager.prototype.renderViewport = function (yMin, yMax, bFromScrolling) {
    var minRowInd = -1;
    var maxRowInd = -1;

    var databody = this._gantt.getDatabody();

    if (databody) {
      // Clear previous viewport
      // In the case of animation, we don't clear the viewport to keep old states around
      // In the case of panning/scrolling, also don't clear the entire viewport straight up, as usually there's a lot that should be kept
      //   - Also panning can be induced via DnD, and dragEnter/Leave events go haywire (especially on FF) if things keep disappearing and reappearing under the mouse
      if (!this._keepOldViewport && !bFromScrolling) {
        databody.removeChildren();

        this._gantt.getDatabodyBackground().removeChildren();
      }

      var rowAxis = this._gantt.getRowAxis();

      if (this._gantt.isRowAxisEnabled() && rowAxis && !bFromScrolling) rowAxis.removeChildren();

      var dependenciesContainer = this._gantt.getDependenciesContainer();

      if (dependenciesContainer) dependenciesContainer.removeChildren();
      var bRenderDependencies = this._dependencyObjs.length > 0;

      var viewportRowIndRange = this._findRowIndRange(this._rowObjs, yMin, yMax);

      minRowInd = viewportRowIndRange['minRowInd'];
      maxRowInd = viewportRowIndRange['maxRowInd']; // Panning/Scrolling case, viewport is not cleared.
      // Remove just the rows that became out of view. New rows will be rendered in downstream logic.
      // DO NOT do this for the case where the Gantt is panned during Drag and Drop on Mobile--for some
      // mysterious reason, changing the DOM order underneath the touch point during Drag and Drop sometimes cause
      // the dragOver event to stop firing, including the downstream drop/dragEnd events...but this is not an issue on Desktop browsers.
      // The only side effect is a possible slight perf hit during drag on mobile, because the DOM may accumulate rows if
      // someone tries to drag something for large distances, but subsequent interactions will cause a fresh viewport render
      // that restores performance.

      var eventManager = this._gantt.getEventManager();

      if (!(dvt.TimeAxis.supportsTouch() && eventManager && eventManager.isDnDDragging())) {
        if (bFromScrolling && this._prevScrollMinRowInd != null) {
          var rowNode;

          if (this._prevScrollMinRowInd < minRowInd) // Scrolled down, remove now hidden rows from the top
            {
              for (var k = this._prevScrollMinRowInd; k < minRowInd; k++) {
                rowNode = this._rowObjs[k]['node'];

                if (rowNode) {
                  rowNode.remove();
                }
              }
            } else if (maxRowInd < this._prevScrollMaxRowInd) // Scrolled up, remove now hidden rows from the bottom
            {
              for (var k = maxRowInd + 1; k <= this._prevScrollMaxRowInd; k++) {
                rowNode = this._rowObjs[k]['node'];

                if (rowNode) {
                  rowNode.remove();
                }
              }
            }
        }
      } // Animation case, render the curated particpating rows (which may include more than what's in the viewport)
      // Also, for old rows with row labels, restore them to DOM to show initial state (row axis DOM is cleared at this point)


      if (this._keepOldViewport && this._animationFinalStateRowObjs) {
        this._animationFinalStateRowObjs.forEach(this._renderRowObj, this); // Note that this._animationInitialStateRowObjsDelete is empty if there are no labels, so no need to null check rowAxis


        for (var j = 0; j < this._animationInitialStateRowObjsDelete.length; j++) {
          var oldRowObjWithLabel = this._animationInitialStateRowObjsDelete[j];

          if (oldRowObjWithLabel['node']) {
            var oldLabelContent = oldRowObjWithLabel['node'].getRowLabelContent();
            rowAxis.addChild(oldLabelContent.getDisplayable());
          }
        }
      } else // Render viewport related rows
        {
          for (var i = minRowInd; i <= maxRowInd; i++) {
            var rowObj = this._rowObjs[i];

            var isRenderNotSkipped = this._renderRowObj(rowObj); // In the panning/scrolling case, most of the rows are kept in the viewport, and so tasks in those rows won't receive new render calls.
            // However, normally dependencies are cleared from the task each new render, so we'll do that here before dependencies are rendered.


            if (!isRenderNotSkipped && bFromScrolling && bRenderDependencies) {
              var taskObjs = rowObj['taskObjs'];

              for (var _i = 0; _i < taskObjs.length; _i++) {
                taskObjs[_i]['node'].clearDependencies();
              }
            }
          }
        } // Render viewport related dependencies
      // O(N) search for dependencies overlapping the viewport (more precisely, O(lgN) search + O(2k) iterations),
      // N being the total number of dependencies, and k being the number of dependencies from the top of the chart to the end of the viewport
      // TODO: If need be in the future, implement (centered) interval tree data structure
      // to perform O(lgN + K) search for the K dependencies overlapping the viewport


      if (this._dependencyObjs.length > 0) {
        // Find first dependency from the top with bottom row below upper viewport bound
        var referenceDependencyInd = this._binarySearchLeftMost(this._dependencyObjs, minRowInd, 'successor', 'rowObjBottom', 'index');

        var referenceDependencyObj = this._dependencyObjs[referenceDependencyInd];
        var referencePrevTopDependencyObj = referenceDependencyObj['prevTopDependencyObj']; // All subsequent dependencies with top row below the reference dep's top row but above the lower viewport bound must be visible.
        // Any dependencies with top row below the lower viewport bound are definitely not visible and so not considered.

        while (referenceDependencyObj && referenceDependencyObj['rowObjTop']['index'] <= maxRowInd) {
          this._renderDependencyObj(referenceDependencyObj);

          referenceDependencyObj = referenceDependencyObj['nextTopDependencyObj'];
        } // The only lines we may have missed so far are ones with bottom row >= reference bottom row, but have top row < reference top row.
        // Iterate up from the reference dependency to find any lines we missed


        while (referencePrevTopDependencyObj) {
          var rowBottomInd = referencePrevTopDependencyObj['rowObjBottom']['index'];

          if (rowBottomInd >= minRowInd) {
            this._renderDependencyObj(referencePrevTopDependencyObj);
          }

          referencePrevTopDependencyObj = referencePrevTopDependencyObj['prevTopDependencyObj'];
        }
      }

      if (bFromScrolling) {
        // If scrolling, save viewport for subsequent scrolling viewport comparisons
        this._prevScrollMinRowInd = minRowInd;
        this._prevScrollMaxRowInd = maxRowInd;
      } else {
        // If not scrolling, clear out the cached viewport to ensure full subsequent viewport rerenders
        this._prevScrollMinRowInd = null;
        this._prevScrollMaxRowInd = null;
      }
    } else {
      this._prevScrollMinRowInd = null;
      this._prevScrollMaxRowInd = null;
    } // Subsequent viewport renders don't induce animation


    this._keepOldViewport = false;
    this._animationFinalStateRowObjs = null;
    this._animationInitialStateRowObjsDelete = [];
    return {
      "minRowInd": minRowInd,
      "maxRowInd": maxRowInd
    };
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Gantt component.  The component should never be instantiated directly.  Use the newInstance function instead
   * @param {dvt.Context} context The rendering context.
   * @param {function} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @class
   * @constructor
   * @extends {dvt.TimeComponent}
   */


  dvt.Gantt = function (context, callback, callbackObj) {
    this.Init(context, callback, callbackObj);
  };

  dvt.Obj.createSubclass(dvt.Gantt, dvt.TimeComponent);
  /**
   * Returns a new instance of dvt.Gantt.
   * @param {dvt.Context} context The rendering context.
   * @param {function} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @return {dvt.Gantt}
   */

  dvt.Gantt.newInstance = function (context, callback, callbackObj) {
    return new dvt.Gantt(context, callback, callbackObj);
  };
  /**
   * Initializes the component.
   * @param {dvt.Context} context The rendering context.
   * @param {function} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @protected
   */


  dvt.Gantt.prototype.Init = function (context, callback, callbackObj) {
    this._isInitialRender = true;
    dvt.Gantt.superclass.Init.call(this, context, callback, callbackObj); // Create the defaults object

    this.Defaults = new DvtGanttDefaults(context); // Create the event handler and add event listeners

    this.EventManager = new DvtGanttEventManager(this, context, callback, callbackObj);
    this.EventManager.addListeners(this);

    if (!dvt.Agent.isTouchDevice()) {
      this._keyboardHandler = new DvtGanttKeyboardHandler(this, this.EventManager);
      this.EventManager.setKeyboardHandler(this._keyboardHandler);
    } else this._keyboardHandler = null;
  };
  /**
   * @override
   */


  dvt.Gantt.prototype.SetOptions = function (options) {
    // As of 5.0.0 default values are introduced. Some defaults are null, but dvt.JsonUtils.merge() assumes null values are intentional.
    // Explicitly set null values to undefined so that merging with our internal defaults work properly:
    if (options['taskDefaults'] == null) options['taskDefaults'] = {
      'baseline': {}
    };
    if (options['taskDefaults']['baseline'] == null) options['taskDefaults']['baseline'] = {};
    options['taskDefaults']['height'] = options['taskDefaults']['height'] == null ? undefined : options['taskDefaults']['height'];
    options['taskDefaults']['baseline']['height'] = options['taskDefaults']['baseline']['height'] == null ? undefined : options['taskDefaults']['baseline']['height'];
    dvt.Gantt.superclass.SetOptions.call(this, options); //initial setup

    this.setSelectionMode(this.Options['selectionMode']); // If high level DnD api specified, set the equivalent low level DnD configuration.

    var dndMoveEnabled = this.isTaskMoveEnabled();
    var taskResizeEnabled = this.isTaskResizeEnabled();

    if (dndMoveEnabled || taskResizeEnabled) {
      var lowLevelDnD = {
        'drag': {
          'tasks': {
            'dataTypes': []
          },
          'taskResizeHandles': {
            'dataTypes': []
          }
        },
        'drop': {
          'rows': {
            'dataTypes': []
          }
        }
      };
      this.Options['dnd'] = dvt.JsonUtils.merge(this.Options['dnd'], lowLevelDnD); // High level dnd.move or resize enabled is equivalent to enabling tasks as drag sources and rows as drop targets
      // Current design, high level move drop target is always the underlying row, even if the actual target is e.g. a task (enforced by event manager methods)

      var self = this;

      var setupDragDataTypes = function setupDragDataTypes(dataType, dragType) {
        var dragTasksDataTypes = self.Options['dnd']['drag'][dragType]['dataTypes'];

        if (!Array.isArray(dragTasksDataTypes)) {
          self.Options['dnd']['drag'][dragType]['dataTypes'] = [dragTasksDataTypes];
          dragTasksDataTypes = self.Options['dnd']['drag'][dragType]['dataTypes'];
        }

        dragTasksDataTypes.push(dataType);
        var dropRowsDataTypes = self.Options['dnd']['drop']['rows']['dataTypes'];

        if (!Array.isArray(dropRowsDataTypes)) {
          self.Options['dnd']['drop']['rows']['dataTypes'] = [dropRowsDataTypes];
          dropRowsDataTypes = self.Options['dnd']['drop']['rows']['dataTypes'];
        }

        dropRowsDataTypes.push(dataType);
      };

      if (taskResizeEnabled) setupDragDataTypes(DvtGanttEventManager.RESIZE_TASKS_DATA_TYPE, 'taskResizeHandles');
      if (dndMoveEnabled) setupDragDataTypes(DvtGanttEventManager.MOVE_TASKS_DATA_TYPE, 'tasks');
    }
  };
  /**
   * @return {DvtGanttAutomation} the automation object
   */


  dvt.Gantt.prototype.getAutomation = function () {
    if (!this.Automation) this.Automation = new DvtGanttAutomation(this);
    return this.Automation;
  };
  /**
   * Retrieves style class based on key (ex: 'oj-gantt-horizontal-gridline')
   * @param {string} key
   * @return {string} the style class for the specified key
   * @protected
   */


  dvt.Gantt.prototype.GetStyleClass = function (key) {
    var context = this.getCtx();
    var styleClasses = context['styleClasses']; // TODO: in PhantomJS tests this is not populated

    if (styleClasses != null) return styleClasses[key];else return key;
  };
  /**
   * Creates component specific parser and parses the options.
   * @param {object} options The options object
   * @return {object} the parsed object
   * @protected
   */


  dvt.Gantt.prototype.Parse = function (options) {
    this._parser = new DvtGanttParser();
    return this._parser.parse(options);
  };
  /**
   * Parsed the options
   * @param {object} props property bag of options
   * @private
   */


  dvt.Gantt.prototype._applyParsedProperties = function (props) {
    this._axisPosition = props.axisPosition;
    this._selectionMode = props.selectionMode;
    this._horizontalGridline = props.horizontalGridline;
    this._verticalGridline = props.verticalGridline;
    this._viewStartTime = props.viewStart;
    this._viewEndTime = props.viewEnd;
    this._rowsData = props.rows;
    this.isIRAnimationEnabled = props.isIRAnimationEnabled;
    this.isDCAnimationEnabled = props.isDCAnimationEnabled;
    this._rowAxisRendered = props.rowAxisRendered;
    this._rowAxisWidth = props.rowAxisWidth;
    this._rowAxisMaxWidth = props.rowAxisMaxWidth;
    this._referenceObjects = props.referenceObjects;

    dvt.Gantt.superclass._applyParsedProperties.call(this, props);
  };
  /**
   * Creates TimeAxis compatible options object from component's options object.
   * @param {object} options The object containing specifications and data for this component.
   * @param {dvt.TimeAxis} axis The time axis.
   * @return {object} the options for time axis
   * @private
   */


  dvt.Gantt.prototype._bundleTimeAxisOptions = function (options, axis) {
    var _resources = this._resources;
    _resources['axisClass'] = this.GetStyleClass(axis);
    _resources['axisSeparatorClass'] = this.GetStyleClass(axis + 'Ticks');
    _resources['axisLabelClass'] = this.GetStyleClass(axis + 'Labels');
    var retOptions = {
      'start': options['start'],
      'end': options['end'],
      '_resources': _resources,
      'shortDesc': options['shortDesc'],
      'orientation': 'horizontal'
    };

    if (options[axis]) {
      var axisOptions = options[axis];
      if (axisOptions['scale']) retOptions['scale'] = axisOptions['scale'];
      if (axisOptions['converter']) retOptions['converter'] = axisOptions['converter'];
      if (axisOptions['zoomOrder']) retOptions['zoomOrder'] = axisOptions['zoomOrder'];
    }

    var labelStyle;
    if (axis == 'majorAxis') labelStyle = DvtGanttStyleUtils.getMajorAxisLabelStyle(options);else if (axis == 'minorAxis') labelStyle = DvtGanttStyleUtils.getMinorAxisLabelStyle(options);
    retOptions['labelStyle'] = labelStyle;
    return retOptions;
  };
  /**
   * Calculates the preferred dimensions for this Gantt.
   * @param {number=} width The component width, if defined.
   * @param {number=} height The component height, if defined.
   * @return {dvt.Dimension} The preferred dimensions.
   * @private
   */


  dvt.Gantt.prototype._getPreferredSize = function (width, height) {
    return new dvt.Dimension(width, height);
  };
  /**
   * Renders the component
   * @param {object} options options object
   * @param {number} width the width of the component
   * @param {number} height the height of the component
   * @override
   */


  dvt.Gantt.prototype.render = function (options, width, height) {
    // Reset cache
    this.getCache().clearCache(); // ensure options is updated

    if (options) this.SetOptions(options);else {
      this._handleResize(width, height);

      return;
    }
    dvt.Gantt.superclass.render.call(this, options, width, height); // Render an aria live region for accessibility during DnD

    if (this.isDndEnabled()) {
      this.renderAriaLiveRegion();
    } else {
      this.removeAriaLiveRegion();
    }

    this._animationManager = new DvtGanttAnimationManager(this);

    this._animationManager.prepareForAnimations(); // Calculate certain layout information before any actual rendering


    if (!this._dataLayoutManager) this._dataLayoutManager = new DvtGanttDataLayoutManager(this);

    this._dataLayoutManager.calcLayout();

    DvtGanttRenderer.renderRowAxis(this, this.getParent());
    var axisPosition = this.getAxisPosition();
    var minor = options['minorAxis'];

    if (minor) {
      var axisOptions = this._bundleTimeAxisOptions(this.Options, 'minorAxis');

      if (this._minorAxis == null) {
        this._minorAxis = new dvt.TimeAxis(this.getCtx(), null, null);
        if (axisPosition == 'top') this._minorAxis.setBorderVisibility(false, false, true, false);else this._minorAxis.setBorderVisibility(true, false, false, false);
        this._masterAxis = this._minorAxis;
      } // TimeComponent's TimeAxis._canvasSize should always be null on initial render


      this._minorAxis.setCanvasSize(null);

      var preferredLength = this._minorAxis.getPreferredLength(axisOptions, this._canvasLength);
    }

    var major = options['majorAxis'];

    if (major) {
      if (major['scale']) {
        axisOptions = this._bundleTimeAxisOptions(this.Options, 'majorAxis');

        if (this._majorAxis == null) {
          this._majorAxis = new dvt.TimeAxis(this.getCtx(), null, null);
          if (axisPosition == 'top') this._majorAxis.setBorderVisibility(false, false, true, false);else this._majorAxis.setBorderVisibility(true, false, false, false);
          this._slaveAxis = this._majorAxis;
        } // TimeComponent's TimeAxis._canvasSize should always be null on initial render


        this._majorAxis.setCanvasSize(null);

        var majorPreferredLength = this._majorAxis.getPreferredLength(axisOptions, this._canvasLength);

        if (preferredLength && majorPreferredLength > preferredLength) {
          this._masterAxis = this._majorAxis;
          this._slaveAxis = this._minorAxis;
          preferredLength = majorPreferredLength;
        }
      } else // if there WAS a major axis, but rerender WITHOUT major axis, make sure to set it to null
        this._majorAxis = null;
    }

    if (preferredLength) this.setContentLength(preferredLength); // Minor axis is required, and preparing viewport length depends on it having valid options
    // Major axis options checking happens later in hasValidOptions()

    if (this._minorAxis && this._minorAxis.hasValidOptions()) this.prepareViewportLength();
    DvtGanttRenderer.renderGantt(this);

    this._animationManager.triggerAnimations();

    this.UpdateAriaAttributes();
    if (!this.Animation) // If not animating, that means we're done rendering, so fire the ready event.
      this.RenderComplete();
    this._renderState = null;
    this._isInitialRender = false;
  };
  /**
   * Gets the animation manager.
   * @return {DvtGanttAnimationManager} the animation manager
   */


  dvt.Gantt.prototype.getAnimationManager = function () {
    return this._animationManager;
  };
  /**
   * Gets the data layout manager.
   * @return {DvtGanttDataLayoutManager} the data layout manager
   */


  dvt.Gantt.prototype.getDataLayoutManager = function () {
    return this._dataLayoutManager;
  };
  /**
   * Detects whether we should treat row data as hierarchical.
   * @return {boolean}
   */


  dvt.Gantt.prototype.isRowsHierarchical = function () {
    // For now, we would only receive hierarchical data if a tree data provider
    // is supplied through taskData for project gantt use case.
    // Also for our static tests, we can't easily pass in data providers and templates,
    // so look for the _isHierarchical flag.
    var taskDP = this.getOptions()['taskData'];
    return taskDP && taskDP['getChildDataProvider'] || dvt.Agent.isEnvironmentTest() && this.getOptions()['_isHierarchical'];
  };
  /**
   * Gets the current viewport y bounds, or the y bounds associated with the given translateY
   * @param {number=} translateY Optional translateY to use to convert to y bounds. Otherwise the current translateY is used.
   * @return {Object} An object with yMin and yMax properties
   */


  dvt.Gantt.prototype.getViewportYBounds = function (translateY) {
    var viewportHeight = this._backgroundHeight - this.getAxesHeight();
    var yMin = 0;

    if (translateY != null) {
      yMin = this._translateYToScrollPositionY(translateY);
    } else if (this._databody) {
      yMin = this._translateYToScrollPositionY(this._databody.getTranslateY());
    }

    var yMax = yMin + viewportHeight;
    return {
      'yMin': yMin,
      'yMax': yMax
    };
  };
  /**
   * Renders the current viewport.
   * @param {boolean=} bFromScrolling Whether this viewport refresh is to due scrolling/panning
   * @return {Object} Object of the shape {"mixRowInd": index of first row in the viewport, "maxRowInd": index of last row in the viewport}
   */


  dvt.Gantt.prototype.renderViewport = function (bFromScrolling) {
    var viewportYBounds = this.getViewportYBounds();
    var yMin = viewportYBounds['yMin'];
    var yMax = viewportYBounds['yMax'];
    return this._dataLayoutManager.renderViewport(yMin, yMax, bFromScrolling);
  };
  /**
   * Whether this is initial render.
   * @return {boolean} whether this is initial render.
   */


  dvt.Gantt.prototype.isInitialRender = function () {
    return this._isInitialRender;
  };
  /**
   * Whether the previous render (if initial render, then false) resulted in a valid render,
   * e.g. if the gantt didn't have valid options in the previous render and resulted in "Invalid Data" being rendered,
   * then the previous render is considered invalid.
   * @return {boolean} whether the previous render (false for initial render) resulted in a valid render
   */


  dvt.Gantt.prototype.isLastRenderValid = function () {
    return this._isLastRenderValid;
  };
  /**
   * Sets the whether last render was valid.
   * @param {boolean} isLastRenderValid
   */


  dvt.Gantt.prototype.setIsLastRenderValid = function (isLastRenderValid) {
    this._isLastRenderValid = isLastRenderValid;
  };
  /**
   * Gets the render state.
   * @return {Object|null} State object of the shape {'state': foo, 'payload': bar}, or null for normal rendering
   */


  dvt.Gantt.prototype.getRenderState = function () {
    return this._renderState;
  };
  /**
   * Sets render state.
   * @param {Object|null} state State object of the shape {'state': foo, 'payload': bar}, or null for normal rendering
   */


  dvt.Gantt.prototype.setRenderState = function (state) {
    this._renderState = state;
  };
  /**
   * Whether drag and drop is enabled on the component.
   * @return {boolean} whether drag and drop is enabled
   */


  dvt.Gantt.prototype.isDndEnabled = function () {
    var dndMoveEnabled = this.isTaskMoveEnabled();
    var taskResizeEnabled = this.isTaskResizeEnabled();
    return this.getEventManager().isDndSupported() && (dndMoveEnabled || taskResizeEnabled);
  };
  /**
   * Whether high level task move is enabled.
   * @return {boolean} whether high level task move is enabled.
   */


  dvt.Gantt.prototype.isTaskMoveEnabled = function () {
    var dnd = this.Options['dnd'];
    return dnd && dnd['move'] && dnd['move']['tasks'] === 'enabled';
  };
  /**
   * Whether high level task resize is enabled.
   * @return {boolean} whether high level task resize is enabled.
   */


  dvt.Gantt.prototype.isTaskResizeEnabled = function () {
    var taskDefaults = this.Options['taskDefaults'];
    return taskDefaults && taskDefaults['resizable'] === 'enabled';
  };
  /**
   * Renders an aria live region for the component, if one doesn't exist already
   */


  dvt.Gantt.prototype.renderAriaLiveRegion = function () {
    // Construct a visually hidden aria live region for accessibility
    // TODO consider moving to the dvt context level so that other DVTs can use
    if (!this._ariaLiveRegion) {
      var context = this.getCtx();
      this._ariaLiveRegion = document.createElement('div');
      this._ariaLiveRegion.id = '_dvtGanttAriaLiveRegion' + context.getStage().getId();

      this._ariaLiveRegion.setAttribute('aria-live', 'assertive'); // Visually hide the live region, but still make available for screen readers:
      // styling derived from https://developer.paciellogroup.com/blog/2012/05/html5-accessibility-chops-hidden-and-aria-hidden/


      this._ariaLiveRegion.style.clip = 'rect(1px, 1px, 1px, 1px)';
      this._ariaLiveRegion.style.height = '1px';
      this._ariaLiveRegion.style.overflow = 'hidden';
      this._ariaLiveRegion.style.position = 'absolute';
      this._ariaLiveRegion.style.whiteSpace = 'nowrap';
      this._ariaLiveRegion.style.width = '1px';
      context.getContainer().appendChild(this._ariaLiveRegion);
    }
  };
  /**
   * Gets the component's aria live region.
   * @return {Element} The aria live region element.
   */


  dvt.Gantt.prototype.getAriaLiveRegion = function () {
    return this._ariaLiveRegion;
  };
  /**
   * Updates the aria live region's text. If the live region doesn't exist, nothing happens.
   * @param {string} text The text to update the aria live region with.
   */


  dvt.Gantt.prototype.updateLiveRegionText = function (text) {
    if (this._ariaLiveRegion) {
      this._ariaLiveRegion.textContent = text;
    }
  };
  /**
   * Removes the component's aria live region, if one exists.
   */


  dvt.Gantt.prototype.removeAriaLiveRegion = function () {
    if (this._ariaLiveRegion) {
      context.getContainer().removeChild(this._ariaLiveRegion);
      this._ariaLiveRegion = null;
    }
  };
  /**
   * Scrolls the gantt according to the supplied scroll position object.
   * Mainly called by framework when writeback happens to the scroll position option.
   * @param {Object} scrollPosition The scroll position object
   */


  dvt.Gantt.prototype.scroll = function (scrollPosition) {
    // Only scroll if the databody exists -- otherwise there's nothing to scroll
    if (this.getDatabody()) {
      var translateY = this.scrollPositionToTranslateY(scrollPosition);
      if (this.isContentDirScrollbarOn() && this.contentDirScrollbar) this.contentDirScrollbar.setViewportRange(translateY - this.getDatabodyHeight(), translateY);
      this.setDataRegionTranslateY(translateY);
    }
  };
  /**
   * Converts scroll position object to data region translate y
   * @param {Object} scrollPosition The scroll position object
   * @return {number} The data region translate y
   */


  dvt.Gantt.prototype.scrollPositionToTranslateY = function (scrollPosition) {
    var rowIndex = scrollPosition['rowIndex'];
    var rowObjs = this.getRowLayoutObjs();
    var scrollPositionY = 0;

    if (rowIndex != null) {
      rowIndex = Math.min(Math.max(0, rowIndex), rowObjs.length - 1);
      var rowY = rowObjs[rowIndex];
      var offsetY = scrollPosition['offsetY'] != null ? scrollPosition['offsetY'] : 0;
      scrollPositionY = rowY['y'] + offsetY;
    } else if (scrollPosition['y'] != null) {
      scrollPositionY = scrollPosition['y'];
    }

    return this._scrollPositionYToTranslateY(scrollPositionY);
  };
  /**
   * Converts scroll position y to data region translate y
   * @param {number} scrollPositionY The scroll position y
   * @return {number} The data region translate y
   * @private
   */


  dvt.Gantt.prototype._scrollPositionYToTranslateY = function (scrollPositionY) {
    return this.getBoundedContentTranslateY(this.getDatabodyStart() - scrollPositionY);
  };
  /**
   * Converts data region translate y to scroll position y
   * @param {number} translateY The data region translate y
   * @return {number} The scroll position y
   * @private
   */


  dvt.Gantt.prototype._translateYToScrollPositionY = function (translateY) {
    return this._databody ? -(translateY - this.getDatabodyStart()) : 0;
  };
  /**
   * Sets the the y translate of data related containers
   * @param {number} translateY The y translate to set
   * @param {boolean=} bFromScrolling Whether this method is called due to scrolling/panning
   */


  dvt.Gantt.prototype.setDataRegionTranslateY = function (translateY, bFromScrolling) {
    // Translate relevant data regions
    if (this._databody) this._databody.setTranslateY(translateY);
    if (this._databodyBackground) this._databodyBackground.setTranslateY(translateY);
    if (this.isDndEnabled() && this._dndArtifactsContainer) this._dndArtifactsContainer.setTranslateY(translateY);
    if (this.isRowAxisEnabled()) this.getRowAxis().setTranslateY(translateY + this.getStartYOffset());
    if (this._dependenciesContainer) this._dependenciesContainer.setTranslateY(translateY); // render viewport

    var viewportRowIndBounds = this.renderViewport(bFromScrolling); // Fire scroll position change event

    var y = this._translateYToScrollPositionY(translateY);

    var rowIndex = viewportRowIndBounds['minRowInd'];

    if (rowIndex !== -1) {
      var rowObj = this.getRowLayoutObjs()[rowIndex];
      var offsetY = y - rowObj['y'];
      var evt = dvt.EventFactory.newGanttScrollPositionChangeEvent(y, rowIndex, offsetY);
      this.dispatchEvent(evt);
    }
  };
  /**
   * Adjusts viewport based on scrollbar event.
   * @param {object} event
   * @param {object} component The component that is the source of the event, if available.
   */


  dvt.Gantt.prototype.processScrollbarEvent = function (event, component) {
    dvt.Gantt.superclass.processScrollbarEvent.call(this, event, component);

    if (component == this.contentDirScrollbar) {
      var newMax = event.newMax;
      this.setDataRegionTranslateY(newMax, true);
    }
  };
  /**
   * Creates a viewportChange event object
   * @return {object} the viewportChange event object
   * @override
   */


  dvt.Gantt.prototype.createViewportChangeEvent = function () {
    var majorAxisScale = this._majorAxis ? this._majorAxis.getScale() : null;
    var minorAxisScale = this._minorAxis ? this._minorAxis.getScale() : null;
    return dvt.EventFactory.newGanttViewportChangeEvent(this._viewStartTime, this._viewEndTime, majorAxisScale, minorAxisScale);
  };
  /**
   * Handles rerender on resize.
   * @param {number} width The new width
   * @param {number} height The new height
   * @private
   */


  dvt.Gantt.prototype._handleResize = function (width, height) {
    this.Width = width;
    this.Height = height;
    this.applyStyleValues();
    var hasValidOptions = this.hasValidOptions();

    if (hasValidOptions) {
      DvtGanttRenderer.renderRowAxis(this);
    }

    this.prepareViewportLength();

    DvtGanttRenderer._renderBackground(this);

    if (hasValidOptions) {
      this.renderTimeZoomCanvas(this._canvas);
      if (this.isRowAxisEnabled()) this.getRowAxis().adjustPosition();
      var timeZoomCanvas = this.getTimeZoomCanvas();

      DvtGanttRenderer._renderAxes(this, timeZoomCanvas);

      DvtGanttRenderer._renderDatabodyBackground(this);

      DvtGanttRenderer._renderVerticalGridline(this, timeZoomCanvas);

      DvtGanttRenderer._renderData(this);

      DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas);

      DvtGanttRenderer._renderZoomControls(this);

      if (this.isDndEnabled()) DvtGanttRenderer._renderDnDArtifactsContainer(this, timeZoomCanvas);
      if (this.isTimeDirScrollbarOn() || this.isContentDirScrollbarOn()) DvtGanttRenderer._renderScrollbars(this, this);
    } else DvtGanttRenderer._renderEmptyText(this);

    if (!this.Animation) // If not animating, that means we're done rendering, so fire the ready event.
      this.RenderComplete();
  };
  /**
   * Combines style defaults with the styles provided
   */


  dvt.Gantt.prototype.applyStyleValues = function () {
    var isRTL = dvt.Agent.isRightToLeft(this.getCtx());
    var scrollbarPadding = this.getScrollbarPadding();
    this._borderWidth = DvtGanttStyleUtils.getChartStrokeWidth(this.Options);
    var doubleBorderWidth = this._borderWidth * 2;
    this._widthOffset = 0; // we are going to hide the scrollbar

    this.timeDirScrollbarStyles = this.getTimeDirScrollbarStyle();
    this.contentDirScrollbarStyles = this.getContentDirScrollbarStyle();
    this._backgroundWidth = this.Width;
    this._backgroundHeight = this.Height;
    if (this.isTimeDirScrollbarOn()) this._backgroundHeight = this._backgroundHeight - dvt.CSSStyle.toNumber(this.timeDirScrollbarStyles.getHeight()) - 3 * scrollbarPadding;

    if (this.isContentDirScrollbarOn()) {
      var widthOffset = 3 * scrollbarPadding + dvt.CSSStyle.toNumber(this.contentDirScrollbarStyles.getWidth());
      this._backgroundWidth = this._backgroundWidth - widthOffset;
      if (isRTL) this._widthOffset = widthOffset;
    }

    this.setStartXOffset(this._widthOffset + this._borderWidth);
    this.setStartYOffset(this._borderWidth); // The size of the canvas viewport

    this._canvasLength = this._backgroundWidth - doubleBorderWidth;
    this._canvasSize = this._backgroundHeight - doubleBorderWidth;
  };
  /**
   * Gets the component stroke width
   */


  dvt.Gantt.prototype.getBorderWidth = function () {
    return this._borderWidth;
  };
  /**
   * Handles mouse wheel event.
   * @param {event} event The mouse wheel event
   * @protected
   * @override
   */


  dvt.Gantt.prototype.HandleMouseWheel = function (event) {
    dvt.Gantt.superclass.HandleMouseWheel.call(this, event);

    if (this.hasValidOptions()) {
      // ctrl key pressed and not touch device; check if should scroll
      if (event && !event.ctrlKey && !dvt.Agent.isTouchDevice()) {
        var wheelDeltaY = event.wheelDelta ? event.wheelDelta * dvt.TimeComponent.SCROLL_LINE_HEIGHT : 0;
        var wheelDeltaX = event.wheelDeltaX ? event.wheelDeltaX * dvt.TimeComponent.SCROLL_LINE_HEIGHT : 0;
        this.panBy(-wheelDeltaX, -wheelDeltaY); // panning horizontally changes the viewport, and panBy doesn't trigger anything
        // Follows timeline's behavior where viewportChange event is fired at every x delta of overview scrolling
        // TODO: consider changing Timeline and Gantt to follow Chart's convention of firing viewportChange events only at the end of the interaction

        if (event.wheelDeltaX) {
          var evt = this.createViewportChangeEvent();
          this.dispatchEvent(evt);
        }
      } else // ctrl key pressed or touch device; check if should zoom
        {
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
    }
  };
  /**
   * Handles zoom.
   * @param {number} newLength The new content length
   * @param {number} time
   * @param {number} compLoc
   * @param {boolean} triggerViewportChangeEvent Whether to dispatch viewportChange event
   * @override
   */


  dvt.Gantt.prototype.handleZoomWheel = function (newLength, time, compLoc, triggerViewportChangeEvent) {
    if (newLength > this._masterAxis.getMaxContentLength()) {
      newLength = this._masterAxis.getMaxContentLength();
      this.disableZoomButton(true);
    } else this.enableZoomButton(true);

    if (this._canvasLength > newLength) {
      newLength = this._canvasLength;
      this.disableZoomButton(false);
    } else this.enableZoomButton(false);

    var zoomIn = this.getContentLength() <= newLength;
    dvt.Gantt.superclass.handleZoomWheel.call(this, newLength, time, compLoc, triggerViewportChangeEvent);

    var zoomLevelLengths = this._masterAxis.getZoomLevelLengths();

    if (zoomIn) {
      while (this._masterAxis.getZoomLevelOrder() > 0 && (this._slaveAxis ? this._slaveAxis.getZoomLevelOrder() > 0 : true)) {
        var minLength = zoomLevelLengths[this._masterAxis.getZoomLevelOrder() - 1];

        if (this.getContentLength() >= minLength) {
          this._masterAxis.setZoomLevelOrder(this._masterAxis.getZoomLevelOrder() - 1);

          this._masterAxis.decreaseScale();

          if (this._slaveAxis) {
            this._slaveAxis.setZoomLevelOrder(this._slaveAxis.getZoomLevelOrder() - 1);

            this._slaveAxis.decreaseScale();
          }
        } else break;
      }
    } else {
      while (this._masterAxis.getZoomLevelOrder() < zoomLevelLengths.length - 1 && (this._slaveAxis ? this._slaveAxis.getZoomLevelOrder() < this._slaveAxis.getZoomLevelLengths().length - 1 : true)) {
        minLength = zoomLevelLengths[this._masterAxis.getZoomLevelOrder()];

        if (this.getContentLength() < minLength) {
          this._masterAxis.setZoomLevelOrder(this._masterAxis.getZoomLevelOrder() + 1);

          this._masterAxis.increaseScale();

          if (this._slaveAxis) {
            this._slaveAxis.setZoomLevelOrder(this._slaveAxis.getZoomLevelOrder() + 1);

            this._slaveAxis.increaseScale();
          }
        } else break;
      }
    }

    if (this.isTimeDirScrollbarOn() && this.timeDirScrollbar) this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);
    var timeZoomCanvas = this.getTimeZoomCanvas();

    DvtGanttRenderer._renderAxes(this, timeZoomCanvas);

    DvtGanttRenderer._renderDatabodyBackground(this);

    DvtGanttRenderer._renderVerticalGridline(this, timeZoomCanvas);

    DvtGanttRenderer._renderData(this);

    DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas);

    if (this.isDndEnabled()) DvtGanttRenderer._renderDnDArtifactsContainer(this, timeZoomCanvas);

    if (triggerViewportChangeEvent) {
      var evt = this.createViewportChangeEvent();
      this.dispatchEvent(evt);
    }
  };
  /**
   * Retrieve the major axis.
   * @return {dvt.TimeAxis} the minor axis
   */


  dvt.Gantt.prototype.getMajorAxis = function () {
    return this._majorAxis;
  };
  /**
   * Retrieve the minor axis.
   * @return {dvt.TimeAxis} the minor axis
   */


  dvt.Gantt.prototype.getMinorAxis = function () {
    return this._minorAxis;
  };
  /**
   * Retrieve the minor axis. If one is not specified, use the major axis.
   * @return {dvt.TimeAxis} the minor axis
   * @override
   */


  dvt.Gantt.prototype.getTimeAxis = function () {
    if (this._minorAxis) return this._minorAxis;else return this._majorAxis;
  };
  /**
   * Retrieve the databody
   * @return {dvt.Container} the databody
   */


  dvt.Gantt.prototype.getDatabody = function () {
    return this._databody;
  };
  /**
   * Sets the databody
   * @param {dvt.Container} databody the databody
   */


  dvt.Gantt.prototype.setDatabody = function (databody) {
    this._databody = databody;
  };
  /**
   * Retrieve the databody background (container for row backgrounds).
   * @return {dvt.Container} the databody background container.
   */


  dvt.Gantt.prototype.getDatabodyBackground = function () {
    return this._databodyBackground;
  };
  /**
   * Sets the databody background (container for row backgrounds).
   * @param {dvt.Container} databodyBackground The databody background container.
   */


  dvt.Gantt.prototype.setDatabodyBackground = function (databodyBackground) {
    this._databodyBackground = databodyBackground;
  };
  /**
   * Gets the pixel location where the databody starts
   * @return {number} the pixel location where the databody starts
   */


  dvt.Gantt.prototype.getDatabodyStart = function () {
    return this._databodyStart;
  };
  /**
   * Sets the pixel location where the databody starts
   * @param {number} databodyStart the pixel location where the databody starts
   */


  dvt.Gantt.prototype.setDatabodyStart = function (databodyStart) {
    this._databodyStart = databodyStart;
  };
  /**
   * Gets the databody height
   * @return {number} the databody height
   */


  dvt.Gantt.prototype.getDatabodyHeight = function () {
    return this.getCanvasSize() - this.getAxesHeight();
  };
  /**
   * Retrieve the container for vertical gridlines
   * @return {dvt.Container} the container for vertical gridlines
   */


  dvt.Gantt.prototype.getVerticalGridlines = function () {
    return this._gridlines;
  };
  /**
   * Sets the container for vertical gridlines
   * @param {dvt.Container} gridlines the container for vertical gridlines
   */


  dvt.Gantt.prototype.setVerticalGridlines = function (gridlines) {
    this._gridlines = gridlines;
  };
  /**
   * Retrieve the reference objects array
   * @return {Array.<object>} the reference objects array
   */


  dvt.Gantt.prototype.getReferenceObjects = function () {
    return this._referenceObjects;
  };
  /**
   * Retrieve the container for reference objects
   * @return {dvt.Container} the container for reference objects
   */


  dvt.Gantt.prototype.getReferenceObjectsContainer = function () {
    return this._refObjectsContainer;
  };
  /**
   * Sets the container for reference objects
   * @param {dvt.Container} container the container for reference objects
   */


  dvt.Gantt.prototype.setReferenceObjectsContainer = function (container) {
    this._refObjectsContainer = container;
  };
  /**
   * Retrieve the array of rendered reference objects
   * @return {Array.<dvt.Line>} the array of rendered reference objects
   */


  dvt.Gantt.prototype.getRenderedReferenceObjects = function () {
    return this._renderedReferenceObjects;
  };
  /**
   * Sets the array of rendered reference objects
   * @param {Array.<dvt.Line>} renderedReferenceObjects the array of rendered reference objects
   */


  dvt.Gantt.prototype.setRenderedReferenceObjects = function (renderedReferenceObjects) {
    this._renderedReferenceObjects = renderedReferenceObjects;
  };
  /**
   * Gets the container for DnD artifacts (affordances and drag feedback).
   * @return {dvt.Container} container for DnD artifacts.
   */


  dvt.Gantt.prototype.getDnDArtifactsContainer = function () {
    return this._dndArtifactsContainer;
  };
  /**
   * Sets the container for DnD artifacts. This container should be layered on top of all chart area elements.
   * @param {dvt.Container} container. The container for DnD artifacts.
   */


  dvt.Gantt.prototype.setDnDArtifactsContainer = function (container) {
    this._dndArtifactsContainer = container;
  };
  /**
   * Sets the empty text.
   * @param {dvt.OutputText} text The new text.
   */


  dvt.Gantt.prototype.setEmptyText = function (text) {
    this._emptyText = text;
  };
  /**
   * Removes empty text.
   */


  dvt.Gantt.prototype.removeEmptyText = function () {
    if (this._emptyText && this._emptyText.getParent()) {
      this._emptyText.getParent().removeChild(this._emptyText);

      delete this._emptyText;
      this._emptyText = null;
    }
  };
  /**
   * Gets the rows options object
   * @return {object} the rows options object
   */


  dvt.Gantt.prototype.getRowsData = function () {
    return this._rowsData;
  };
  /**
   * Gets the row layout objects
   * @return {Array} an array of row layout objects
   */


  dvt.Gantt.prototype.getRowLayoutObjs = function () {
    return this._dataLayoutManager.getRowObjs();
  };
  /**
   * Gets the dependency layout objects
   * @return {Array} an array of row layout objects
   */


  dvt.Gantt.prototype.getDependencyLayoutObjs = function () {
    return this._dataLayoutManager.getDependencyObjs();
  };
  /**
   * Sets the rows node
   * @param {Array} rows an array of DvtGanttRowNode
   */


  dvt.Gantt.prototype.setRows = function (rows) {
    this._rows = rows;
  };
  /**
   * Gets the current row id
   * @return {*} the id of the current row
   */


  dvt.Gantt.prototype.getCurrentRow = function () {
    return this._currentRow;
  };
  /**
   * Sets the current row id
   * @param {*} currentRow the id of the current row
   */


  dvt.Gantt.prototype.setCurrentRow = function (currentRow) {
    this._currentRow = currentRow;
  };
  /**
   * Gets the axis position
   * @return {string} the axis position
   */


  dvt.Gantt.prototype.getAxisPosition = function () {
    return this._axisPosition;
  };
  /**
   * Gets the axis height
   * @param {object} axisOptions The axis options
   * @return {number} the axis height
   */


  dvt.Gantt.prototype.getAxisHeight = function (axisOptions) {
    return DvtGanttStyleUtils.getTimeAxisHeight(axisOptions);
  };
  /**
   * Gets the start time of the Gantt
   * @return {number} the start time in milliseconds
   */


  dvt.Gantt.prototype.getStartTime = function () {
    return this._start;
  };
  /**
   * Gets the end time of the Gantt
   * @return {number} the end time in milliseconds
   */


  dvt.Gantt.prototype.getEndTime = function () {
    return this._end;
  };
  /**
   * NOT expose for now (until we have dependency lines)
   * Gets the hover behavior
   * @return {string} the hover behavior, either 'dim' or 'none'
   */


  dvt.Gantt.prototype.getHoverBehavior = function () {
    return 'none';
  };
  /**
   * Gets whether horizontal gridlines are visible
   * @return {boolean} true if horizontal gridlines are visible, false otherwise
   */


  dvt.Gantt.prototype.isHorizontalGridlinesVisible = function () {
    return this._horizontalGridline == 'visible';
  };
  /**
   * Gets whether vertical gridlines are visible
   * @return {boolean} true if vertical gridlines are visible, false otherwise
   */


  dvt.Gantt.prototype.isVerticalGridlinesVisible = function () {
    return this._verticalGridline == 'visible';
  };
  /**
   * Gets the height of the entire Gantt content
   * @return {number} height the height of the entire Gantt including all rows.
   */


  dvt.Gantt.prototype.getContentHeight = function () {
    return this._dataLayoutManager.getContentHeight();
  };
  /**
   * Retrieves the total height of the time axes.
   * @return {number} the height of the time axes
   */


  dvt.Gantt.prototype.getAxesHeight = function () {
    if (this._axesHeight == null) {
      var axesHeight = 0;
      if (this._majorAxis) axesHeight = axesHeight + this._majorAxis.getSize();
      if (this._minorAxis) axesHeight = axesHeight + this._minorAxis.getSize();
      this._axesHeight = axesHeight;
    }

    return this._axesHeight;
  };
  /**
   * Gets whether the row axis should be rendered/visible.
   * @return {boolean} true if should be rendered, false otherwise
   */


  dvt.Gantt.prototype.isRowAxisEnabled = function () {
    return this._rowAxisRendered == 'on';
  };
  /**
   * Gets the row axis width.
   * @return {string} the width of the axis in pixels (e.g. '50px') or percent (e.g. '15%'')
   */


  dvt.Gantt.prototype.getRowAxisWidth = function () {
    return this._rowAxisWidth;
  };
  /**
   * Gets the row axis max width.
   * @return {string} the maximum width of the axis in pixels (e.g. '50px') or percent (e.g. '15%'')
   */


  dvt.Gantt.prototype.getRowAxisMaxWidth = function () {
    return this._rowAxisMaxWidth;
  };
  /**
   * Gets the row axis object.
   * @return {DvtGanttRowAxis} The row axis object.
   */


  dvt.Gantt.prototype.getRowAxis = function () {
    return this._rowAxis;
  };
  /**
   * Sets the row axis object.
   * @param {DvtGanttRowAxis} rowAxis The row axis object.
   */


  dvt.Gantt.prototype.setRowAxis = function (rowAxis) {
    this._rowAxis = rowAxis;
  };
  /**
   * Gets the current viewport bounding box in the reference coord system of the databody
   * @return {dvt.Rectangle} the current bounding box of the viewport
   */


  dvt.Gantt.prototype.getViewportDimensions = function () {
    return new dvt.Rectangle(this.getStartXOffset() - this.getTimeZoomCanvas().getTranslateX(), this._databodyStart - this._databody.getTranslateY(), this._canvasLength, this._canvasSize - this.getAxesHeight());
  };
  /**
   * Scroll a region into view
   * @param {dvt.Rectangle} region The bounding rectangle (assumed to be in the reference coord system of the databody) to scroll into view
   * @param {string=} xPriority The side in the x direction to prioritize scroll into view, one of 'start', 'end', or 'auto'. Default 'auto'.
   * @param {string=} yPriority The side in the y direction to prioritize scroll into view, one of 'top', 'bottom', or 'auto'. Default 'auto'.
   * @param {number=} overShoot The extra amount of space to pan by. Default 0.
   */


  dvt.Gantt.prototype.scrollIntoView = function (region, xPriority, yPriority, overShoot) {
    var isRTL = dvt.Agent.isRightToLeft(this.getCtx()),
        viewportRect = this.getViewportDimensions(),
        deltaX = 0,
        deltaY = 0;
    xPriority = xPriority || 'auto';
    yPriority = yPriority || 'auto';
    overShoot = overShoot || 0;
    var deltaXLeftVisible = Math.min(region.x - viewportRect.x - overShoot, 0);
    var deltaXRightVisible = Math.max(0, region.x + region.w - (viewportRect.x + viewportRect.w) + overShoot);
    var deltaXStartVisible = isRTL ? deltaXRightVisible : deltaXLeftVisible;
    var deltaXEndVisible = isRTL ? deltaXLeftVisible : deltaXRightVisible;

    switch (xPriority) {
      case 'start':
        deltaX = deltaXStartVisible;
        break;

      case 'end':
        deltaX = deltaXEndVisible;
        break;

      default:
        deltaX = (!isRTL ? deltaXEndVisible > 0 : deltaXEndVisible < 0) ? deltaXEndVisible : deltaXStartVisible;
      // 'end' wins if just 'end', or both sides, require panning. 'start' otherwise.
    }

    var deltaYTopVisible = Math.min(region.y - viewportRect.y - overShoot, 0);
    var deltaYBottomVisible = Math.max(0, region.y + region.h - (viewportRect.y + viewportRect.h) + overShoot);

    switch (yPriority) {
      case 'top':
        deltaY = deltaYTopVisible;
        break;

      case 'bottom':
        deltaY = deltaYBottomVisible;
        break;

      default:
        deltaY = deltaYTopVisible < 0 ? deltaYTopVisible : deltaYBottomVisible;
      // 'top' wins if just 'top', or both sides, require panning. 'bottom' otherwise.
    }

    this.panBy(deltaX, deltaY, true);
  };
  /**
   * Pan to make room upon drag or equivalent near the edge of the viewport
   * @param {dvt.Point} targetPos The target position
   * @param {number} edgeThreshold The distance from an edge at which auto pan should happen
   * @param {boolean=} excludeX Whether to exclude x direction from auto pan consideration
   * @param {boolean=} excludeY Whether to exclude y direction from auto pan consideration
   * @return {object} The actual deltaX and deltaY panned
   */


  dvt.Gantt.prototype.autoPanOnEdgeDrag = function (targetPos, edgeThreshold, excludeX, excludeY) {
    var viewportRect = this.getViewportDimensions();
    var deltaX = 0;
    var deltaY = 0; // Pan amount varies inversely with distance from edge, i.e. the closer to edge, the larger (abs(distance - edgeThreshold)) the pan amount

    if (!excludeX) {
      var distanceFromRightEdge = Math.max(targetPos.x - viewportRect.x, 0);
      var distanceFromLeftEdge = Math.max(viewportRect.x + viewportRect.w - targetPos.x, 0);

      if (distanceFromRightEdge < edgeThreshold) {
        deltaX = distanceFromRightEdge - edgeThreshold; // < 0

        deltaX = Math.max(deltaX, -viewportRect.x);
      } else if (distanceFromLeftEdge < edgeThreshold) {
        deltaX = edgeThreshold - distanceFromLeftEdge;
        deltaX = Math.min(deltaX, this.getContentLength() - (viewportRect.x + viewportRect.w));
      }
    }

    if (!excludeY) {
      var distanceFromTopEdge = Math.max(targetPos.y - viewportRect.y, 0);
      var distanceFromBottomEdge = Math.max(viewportRect.y + viewportRect.h - targetPos.y, 0);

      if (distanceFromTopEdge < edgeThreshold) {
        deltaY = distanceFromTopEdge - edgeThreshold; // < 0

        deltaY = Math.max(deltaY, -viewportRect.y);
      } else if (distanceFromBottomEdge < edgeThreshold) {
        deltaY = edgeThreshold - distanceFromBottomEdge;

        if (this.getContentHeight() + this._databodyStart >= this._canvasSize) {
          if (this.getAxisPosition() == 'bottom') {
            deltaY = Math.min(deltaY, this._databody.getTranslateY() + this.getContentHeight() - viewportRect.h);
          } else {
            deltaY = Math.min(deltaY, this._databody.getTranslateY() + this.getContentHeight() - this._canvasSize);
          }
        } else {
          deltaY = Math.min(deltaY, -viewportRect.y);
        }
      }
    }

    this.panBy(deltaX, deltaY, true);
    return {
      deltaX: deltaX,
      deltaY: deltaY
    };
  };
  /**
   * Pans the Gantt by the specified amount.
   * @param {number} deltaX The number of pixels to pan in the x direction.
   * @param {number} deltaY The number of pixels to pan in the y direction.
   * @param {boolean=} diagonal true (default) if support diagonal pan, false or undefined otherwise.
   * @protected
   */


  dvt.Gantt.prototype.panBy = function (deltaX, deltaY, diagonal) {
    diagonal = typeof diagonal !== 'undefined' ? diagonal : false; // scroll horizontally and make sure it's scrolling in one direction only

    if (deltaX != 0 && (diagonal || Math.abs(deltaX) > Math.abs(deltaY))) {
      dvt.Gantt.superclass.panBy.call(this, deltaX, 0);
    } // scroll vertically and make sure it's scrolling in one direction only


    if (this._databody && deltaY != 0 && (diagonal || Math.abs(deltaY) > Math.abs(deltaX))) {
      var newTranslateY = this.getBoundedContentTranslateY(this._databody.getTranslateY() - deltaY);
      if (this.isContentDirScrollbarOn()) this.contentDirScrollbar.setViewportRange(newTranslateY - this.getDatabodyHeight(), newTranslateY);
      this.setDataRegionTranslateY(newTranslateY, true);
    }

    if (this.isTimeDirScrollbarOn() && this.timeDirScrollbar) this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);
  };
  /**
   * Utility method for getting the bounded translate y value of content containers
   * (i.e. databody, dependency lines containers, and any other same size overlayed containers)
   * @param {number} proposedTranslateY The proposed translate y, which is not necessarily bounded
   * @return {number} The bounded version of the translate y
   */


  dvt.Gantt.prototype.getBoundedContentTranslateY = function (proposedTranslateY) {
    var contentHeight = this.getContentHeight();
    if (contentHeight == null) // Initial render; proposed translate Y is always within bounds
      return proposedTranslateY;
    var databodyHeight = this.getDatabodyHeight();
    var maxTranslateY = this.getDatabodyStart();
    var minTranslateY = maxTranslateY + Math.min(0, databodyHeight - contentHeight);
    return Math.min(maxTranslateY, Math.max(proposedTranslateY, minTranslateY));
  };
  /**
   * @protected
   * @override
   */


  dvt.Gantt.prototype.beginDragPan = function (compX, compY) {
    dvt.Gantt.superclass.beginDragPan.call(this, compX, compY);
    this._currentViewStartTime = this._viewStartTime;
    this._currentViewEndTime = this._viewEndTime;
  };
  /**
   * @protected
   * @override
   */


  dvt.Gantt.prototype.endDragPan = function (compX, compY) {
    // check whether we should dispatch viewport change event
    if (this._currentViewStartTime == this._viewStartTime && this._currentViewEndTime == this._viewEndTime) this._triggerViewportChange = false;
    dvt.Gantt.superclass.endDragPan.call(this, compX, compY);
  };
  /**
   * Dim or un-Dim all tasks except the task specified
   * @param {DvtGanttTaskNode} task the task to exempt
   * @param {boolean} dim true if dim the task, brighten it otherwise
   * @protected
   */


  dvt.Gantt.prototype.setTaskBrightness = function (task, dim) {
    var task = this.findTaskNodeById(task.getId());
    if (task != null) dim ? task.darken() : task.brighten();
  };
  /**
   * Find the task node with the specified id
   * @param {*} id the id
   * @return {DvtGanttTaskNode} the task with the specified id or null if none is found
   */


  dvt.Gantt.prototype.findTaskNodeById = function (id) {
    var ctx = this.getCtx();
    var rows = this.getRows();

    if (rows) {
      for (var i = 0; i < rows.length; i++) {
        var tasks = rows[i].getTasks();

        for (var j = 0; j < tasks.length; j++) {
          if (dvt.Obj.compareValues(ctx, id, tasks[j].getId())) return tasks[j];
        }
      }
    }

    return null;
  };
  /**
   * Helper method to decide whether or not the options are valid.
   * @return {boolean} Whether this Gantt chart has valid options.
   */


  dvt.Gantt.prototype.hasValidOptions = function () {
    var hasValidMajorScale = this._majorAxis ? this._majorAxis.hasValidOptions() : true; // major axis optional

    var hasValidMinorScale = this._minorAxis && this._minorAxis.hasValidOptions();

    var hasValidStartAndEnd = this._start && this._end && this._end > this._start;
    var hasValidViewport = this._viewStartTime && this._viewEndTime ? this._viewEndTime > this._viewStartTime : true;
    var hasValidViewStart = this._viewStartTime ? this._viewStartTime >= this._start && this._viewStartTime < this._end : true;
    var hasValidViewEnd = this._viewEndTime ? this._viewEndTime > this._start && this._viewEndTime <= this._end : true;
    return hasValidMajorScale && hasValidMinorScale && hasValidStartAndEnd && hasValidViewport && hasValidViewStart && hasValidViewEnd;
  };
  /******************** Selection **********************/

  /**
   * Gets selection handler
   * @return {dvt.SelectionHandler} selection handler
   */


  dvt.Gantt.prototype.getSelectionHandler = function () {
    return this._selectionHandler;
  };
  /**
   * Returns whether selecton is supported on the Gantt.
   * @return {boolean} True if selection is turned on and false otherwise.
   */


  dvt.Gantt.prototype.isSelectionSupported = function () {
    return this._selectionHandler ? true : false;
  };
  /**
   * Sets the selection mode for the component
   * @param {string} selectionMode valid values dvt.SelectionHandler.TYPE_SINGLE, dvt.SelectionHandler.TYPE_MULTIPLE or null
   */


  dvt.Gantt.prototype.setSelectionMode = function (selectionMode) {
    if (selectionMode == 'single') this._selectionHandler = new dvt.SelectionHandler(this.getCtx(), dvt.SelectionHandler.TYPE_SINGLE);else if (selectionMode == 'multiple') this._selectionHandler = new dvt.SelectionHandler(this.getCtx(), dvt.SelectionHandler.TYPE_MULTIPLE);else this._selectionHandler = null; // Event Handler delegates to other handlers

    this.getEventManager().setSelectionHandler(this._selectionHandler);
  };
  /**
   * @override
   */


  dvt.Gantt.prototype.select = function (selection) {
    if (this.isLastRenderValid()) {
      // Update the options
      this.Options['selection'] = dvt.JsonUtils.clone(selection); // Perform the selection

      this._processInitialSelections();
    }
  };
  /**
   * Update the selection handler with the initial selections.
   * @private
   */


  dvt.Gantt.prototype._processInitialSelections = function () {
    var selection = this.Options['selection'];
    if (selection == null || selection.length === 0) return;

    if (this.isSelectionSupported()) {
      var keySet = new this._context.KeySetImpl(selection);
      var rowObjs = this.getRowLayoutObjs();
      var targets = [];

      for (var i = 0; i < rowObjs.length; i++) {
        var rowObj = rowObjs[i];
        var taskObjs = rowObj['taskObjs'];

        for (var j = 0; j < taskObjs.length; j++) {
          var taskObj = taskObjs[j];

          if (keySet.has(taskObj['id'])) {
            // Ensure taskNode exists by explicitly rendering the task into DOM, even if it's not visible yet.
            // TODO: See if we can avoid this for performance reasons, and set selection as we bring things into view.
            // In many use cases, only a small proportion of all tasks are selected, so performance shouldn't be an issue.
            this._dataLayoutManager.ensureInDOM(taskObj, 'task');

            var taskNode = taskObjs[j]['node'];
            targets.push(taskNode);
          }
        }
      }

      this.getSelectionHandler().processInitialSelections(selection, targets);
    }
  };
  /******************** Dependency line **********************/

  /**
   * Gets the container object for the dependency lines
   * @return {dvt.Container} the container for the dependency lines
   */


  dvt.Gantt.prototype.getDependenciesContainer = function () {
    return this._dependenciesContainer;
  };
  /**
   * Sets the container object for the dependency lines
   * @param {dvt.Container} dependenciesContainer the container for the dependency lines
   */


  dvt.Gantt.prototype.setDependenciesContainer = function (dependenciesContainer) {
    this._dependenciesContainer = dependenciesContainer;
  };
  /**
   * Sets the id of the default marker
   * @param {string} id the id of the default marker
   */


  dvt.Gantt.prototype.setDefaultMarkerId = function (id) {
    this._markerId = id;
  };
  /**
   * Gets the id of the default marker
   * @return {string} the id of the default marker
   */


  dvt.Gantt.prototype.getDefaultMarkerId = function () {
    return this._markerId;
  };
  /**
   * Gets the predecessors or successors for the specified task
   * @param {DvtGanttTaskNode} task the task
   * @param {string} type successor or predecessor
   * @return {DvtGanttDependencyNode[]} array of predecessors or successors for the specified task
   */


  dvt.Gantt.prototype.getNavigableDependencyLinesForTask = function (task, type) {
    return type == 'successor' ? task.getSuccessorDependencies() : task.getPredecessorDependencies();
  }; // should be in super

  /**
   * Handle touch start event
   * @param {object} event
   */


  dvt.Gantt.prototype.HandleTouchStart = function (event) {};
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Gantt automation service.
   * @param {dvt.Gantt} gantt The owning dvt.Gantt.
   * @class  DvtGanttAutomation
   * @implements {dvt.Automation}
   * @constructor
   */


  var DvtGanttAutomation = function DvtGanttAutomation(gantt) {
    this._gantt = gantt;
  };

  dvt.Obj.createSubclass(DvtGanttAutomation, dvt.Automation);
  /**
   * Valid subIds inlcude:
   * <ul>
   * <li>taskbar[rowIndex][index]</li>
   * <li>rowLabel[index]</li>
   * </ul>
   * @override
   */

  DvtGanttAutomation.prototype.GetSubIdForDomElement = function (displayable) {
    var logicalObj = this._gantt.getEventManager().GetLogicalObject(displayable);

    if (logicalObj && logicalObj instanceof DvtGanttTaskNode) {
      var taskObj = logicalObj.getLayoutObject();
      var rowObj = taskObj['rowObj'];
      var rowIndex = rowObj['index']; // Albeit not as efficient, simple one liner below should be sufficiently fast for most usecases.

      var taskIndex = rowObj['taskObjs'].map(function (t) {
        return t['node'];
      }).indexOf(logicalObj);
      return 'taskbar[' + rowIndex + '][' + taskIndex + ']';
    } else if (logicalObj && logicalObj instanceof DvtGanttRowLabelContent) {
      var rowIndex = logicalObj.getRowIndex();
      return 'rowLabel[' + rowIndex + ']';
    } else if (logicalObj && logicalObj instanceof DvtGanttDependencyNode) {
      var dependencyObj = logicalObj.getLayoutObject();
      var dependencyIndex = dependencyObj['index'];
      return dependencyIndex;
    }

    return null;
  };
  /**
   * Valid subIds inlcude:
   * <ul>
   * <li>taskbar[rowIndex][index]</li>
   * <li>rowLabel[index]</li>
   * </ul>
   * @override
   */


  DvtGanttAutomation.prototype.getDomElementForSubId = function (subId) {
    // TOOLTIP
    if (subId == dvt.Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._gantt);
    var openParen1 = subId.indexOf('[');
    var closeParen1 = subId.indexOf(']');
    var component = subId.substring(0, openParen1);

    if (openParen1 > -1 && closeParen1 > -1) {
      if (component == 'taskbar') {
        var openParen2 = subId.indexOf('[', openParen1 + 1);
        var closeParen2 = subId.indexOf(']', openParen2 + 1);

        if (openParen2 > -1 && closeParen2 > -1) {
          var rowIndex = parseInt(subId.substring(openParen1 + 1, closeParen1));
          var taskIndex = parseInt(subId.substring(openParen2 + 1, closeParen2));
          if (isNaN(rowIndex) || isNaN(taskIndex)) return null;

          var rowObjs = this._gantt.getRowLayoutObjs();

          if (rowObjs.length > rowIndex) {
            var taskObjs = rowObjs[rowIndex]['taskObjs'];

            if (taskObjs.length > taskIndex) {
              var taskObj = taskObjs[taskIndex];

              this._gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');

              var taskNode = taskObj['node'];
              var repShape = taskNode.getTask().getShape('main');
              if (repShape != null) return repShape.getElem();
            }
          }
        }
      } else if (component == 'rowLabel') {
        rowIndex = parseInt(subId.substring(openParen1 + 1, closeParen1));

        var rowObjs = this._gantt.getRowLayoutObjs();

        if (rowObjs.length > rowIndex) {
          var rowObj = rowObjs[rowIndex];

          this._gantt.getDataLayoutManager().ensureInDOM(rowObj, 'rowLabel');

          var rowLabelContent = rowObj['node'].getRowLabelContent();
          if (rowLabelContent != null) return rowLabelContent.getDisplayable().getElem();
        }
      } else if (component == 'dependency') {
        var dependencyIndex = parseInt(subId.substring(openParen1 + 1, closeParen1));

        var dependencyObjs = this._gantt.getDependencyLayoutObjs();

        if (dependencyObjs.length > dependencyIndex) {
          for (var i = 0; i < dependencyObjs.length; i++) {
            var dependencyObj = dependencyObjs[i];

            if (dependencyObj['index'] === dependencyIndex) {
              this._gantt.getDataLayoutManager().ensureInDOM(dependencyObj, 'dependency');

              var dependencyNode = dependencyObj['node'];
              if (dependencyNode != null) return dependencyNode.getElem();
            }
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


  var DvtGanttDefaults = function DvtGanttDefaults(context) {
    this.Init({
      'alta': DvtGanttDefaults.VERSION_1
    }, context);
  };

  dvt.Obj.createSubclass(DvtGanttDefaults, dvt.BaseComponentDefaults);
  /**
   * Contains overrides for version 1.
   * @const
   */

  DvtGanttDefaults.VERSION_1 = {
    'axisPosition': 'top',
    'animationOnDataChange': 'none',
    'animationOnDisplay': 'none',
    'scrollbar': {
      'horizontal': 'off',
      'vertical': 'off'
    },
    'gridlines': {
      'horizontal': 'hidden',
      'vertical': 'visible'
    },
    'selectionMode': 'none',
    'scrollPosition': {
      "y": 0
    },
    'rowDefaults': {
      'height': null
    },
    'taskDefaults': {
      'labelPosition': ['end', 'innerCenter', 'start', 'max'],
      'borderRadius': '0',
      'height': DvtGanttStyleUtils.getStandaloneTaskHeight(),
      'overlap': {
        'behavior': 'auto',
        'offset': null
      },
      'progress': {
        'height': '100%',
        'borderRadius': '0'
      },
      'baseline': {
        'height': DvtGanttStyleUtils.getBaselineTaskHeight(),
        'borderRadius': '0'
      },
      'type': 'auto'
    },
    'rowAxis': {
      'rendered': 'off',
      'width': 'max-content',
      'maxWidth': 'none'
    }
  };
  /**
   * @override
   */

  DvtGanttDefaults.prototype.getNoCloneObject = function () {
    // Date time options as of 3.0.0 only support number and string types
    // e.g. Date object type is not supported. However,
    // during the options merging in SetOptions method,
    // Date objects are automatically converted to number by default.
    // We want to specify that they are to remain Date objects so that
    // we can handle them in our code.
    return {
      'start': true,
      'end': true,
      'viewportStart': true,
      'viewportEnd': true,
      'rows': true,
      // For performance reasons, don't clone data objects--we'll ensure data objects are not mutated downstream
      'dependencies': true,
      // For performance reasons, don't clone data objects--we'll ensure data objects are not mutated downstream
      'referenceObjects': {
        'value': true
      }
    };
  };
  /**
   * @override
   */


  DvtGanttDefaults.prototype.getAnimationDuration = function (options) {
    return options['_resources'] ? options['_resources']['animationDuration'] : null;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class representing a GanttDependency node.
   * @param {dvt.Gantt} gantt The gantt component
   * @class
   * @constructor
   * @implements {DvtKeyboardNavigable}
   */


  var DvtGanttDependencyNode = function DvtGanttDependencyNode(gantt) {
    this.Init(gantt);
  };

  dvt.Obj.createSubclass(DvtGanttDependencyNode, dvt.Container); // supported dependency types

  /**
   * Start-to-start dependency type
   * @type {string}
   */

  DvtGanttDependencyNode.START_START = 'startStart';
  /**
   * Start-to-finish dependency type
   * @type {string}
   */

  DvtGanttDependencyNode.START_FINISH = 'startFinish';
  /**
   * Finish-to-start dependency type
   * @type {string}
   */

  DvtGanttDependencyNode.FINISH_START = 'finishStart';
  /**
   * Finish-to-finish dependency type
   * @type {string}
   */

  DvtGanttDependencyNode.FINISH_FINISH = 'finishFinish'; // used for value indicating conflict between lines

  /**
   * No conflicts between depdendency lines
   * @type {number}
   */

  DvtGanttDependencyNode.CONFLICT_NONE = 0;
  /**
   * Conflicts between predecessor dependency lines
   * @type {number}
   */

  DvtGanttDependencyNode.CONFLICT_PREDECESSOR = 1;
  /**
   * Conflicts between successor dependency lines
   * @type {number}
   */

  DvtGanttDependencyNode.CONFLICT_SUCCESSOR = 2;
  /**
   * Conflicts between both predecessor and successor dependency lines
   * @type {number}
   */

  DvtGanttDependencyNode.CONFLICT_BOTH = 3;
  /**
   * @param {dvt.Gantt} gantt The gantt component
   * @protected
   */

  DvtGanttDependencyNode.prototype.Init = function (gantt) {
    DvtGanttDependencyNode.superclass.Init.call(this, gantt.getCtx(), null);
    this._gantt = gantt;

    this._gantt.getEventManager().associate(this, this);
  };
  /**
   * Gets the gantt.
   * @return {dvt.Gantt} the gantt.
   */


  DvtGanttDependencyNode.prototype.getGantt = function () {
    return this._gantt;
  };
  /**
   * Retrieve the data id of the dependency line.
   * @override
   */


  DvtGanttDependencyNode.prototype.getId = function () {
    return this._dependencyObj['id'];
  };
  /**
   * Sets the layout object associated with this dependency node
   * @param {Object} dependencyObj Depenency layout object
   */


  DvtGanttDependencyNode.prototype.setLayoutObject = function (dependencyObj) {
    this._dependencyObj = dependencyObj;
  };
  /**
   * Gets the layout object associated with this dependency node
   * @return {Object} The dependency layout object
   */


  DvtGanttDependencyNode.prototype.getLayoutObject = function () {
    return this._dependencyObj;
  };
  /**
   * Gets the value of query property of the dependency.
   * @param {string} property The top level property name
   * @return {*} The value
   */


  DvtGanttDependencyNode.prototype.getValue = function (property) {
    var value;

    switch (property) {
      case 'type':
        value = this._dependencyObj['type'];
        break;
      // In case task id is complex object, get the reference to actual task id for
      // more performant key comparisons downstream

      case 'predecessorTaskId':
        value = this._dependencyObj['predecessorTaskObj']['id'];
        break;

      case 'successorTaskId':
        value = this._dependencyObj['successorTaskObj']['id'];
        break;

      default:
        value = this._dependencyObj['data'][property];
    }

    return value;
  };
  /**
   * Retrieves the predecessor task object
   * @return {DvtGanttTaskNode} the predecessor task object
   */


  DvtGanttDependencyNode.prototype.getPredecessorNode = function () {
    // By current design, the task node should already exists if this dependency node exists
    return this._dependencyObj['predecessorTaskObj']['node'];
  };
  /**
   * Retrieves the successor task object
   * @return {DvtGanttTaskNode} the successor task object
   */


  DvtGanttDependencyNode.prototype.getSuccessorNode = function () {
    // By current design, the task node should already exists if this dependency node exists
    return this._dependencyObj['successorTaskObj']['node'];
  };
  /**
   * Determine the start position of the task node, taking label into account
   * @param {DvtGanttTaskNode} taskNode the task node
   * @return {number} the start position of the task node in pixels
   * @private
   */


  DvtGanttDependencyNode._getTaskStart = function (taskNode) {
    var isRTL = dvt.Agent.isRightToLeft(taskNode.getGantt().getCtx()),
        taskMainShape = taskNode.getTask().getShape('main'),
        taskLabel = taskNode.getTaskLabel(),
        taskLabelOutputText = taskLabel.getLabelOutputText(),
        labelPosition = taskLabel.getEffectiveLabelPosition();

    if (isRTL) {
      if (taskLabelOutputText != null && taskLabelOutputText.getParent() != null && labelPosition == 'end') {
        return taskNode.getFinalX() + taskMainShape.getFinalX() - taskMainShape.getFinalWidth() - taskMainShape.getPhysicalEndOffset() - taskLabelOutputText.getDimensions().w - DvtGanttStyleUtils.getTaskLabelPadding() * 2; // padding before + after
      } else {
        return taskNode.getFinalX() + taskMainShape.getFinalX() - taskMainShape.getFinalWidth() - taskMainShape.getPhysicalEndOffset();
      }
    } else {
      if (taskLabelOutputText != null && taskLabelOutputText.getParent() != null && labelPosition == 'start') {
        return taskNode.getFinalX() + taskMainShape.getFinalX() - taskMainShape.getPhysicalStartOffset() - taskLabelOutputText.getDimensions().w - DvtGanttStyleUtils.getTaskLabelPadding() * 2;
      } else {
        return taskNode.getFinalX() + taskMainShape.getFinalX() - taskMainShape.getPhysicalStartOffset();
      }
    }
  };
  /**
   * Determine the middle position of the task node
   * @param {DvtGanttTaskNode} taskNode the task node to find the vertical middle point
   * @return {number} the middle position of the task node in pixels
   * @private
   */


  DvtGanttDependencyNode._getTaskMiddle = function (taskNode) {
    var task = taskNode.getTask();
    var taskMainShape = task.getShape('main');
    var availableShapeHeight = task.isSummary('main') ? taskNode.getLayoutObject()['height'] : taskMainShape.getFinalHeight();
    return DvtGanttDependencyNode._getTaskTop(taskNode) + taskMainShape.getFinalY() + Math.round(availableShapeHeight / 2);
  };
  /**
   * Determine the end position of the task node, taking label into account
   * @param {DvtGanttTaskNode} taskNode the task node to find the end
   * @return {number} the end position of the task node in pixels
   * @private
   */


  DvtGanttDependencyNode._getTaskEnd = function (taskNode) {
    var isRTL = dvt.Agent.isRightToLeft(taskNode.getGantt().getCtx()),
        taskMainShape = taskNode.getTask().getShape('main'),
        taskLabel = taskNode.getTaskLabel(),
        taskLabelOutputText = taskLabel.getLabelOutputText(),
        labelPosition = taskLabel.getEffectiveLabelPosition();

    if (isRTL) {
      if (taskLabelOutputText != null && taskLabelOutputText.getParent() != null && labelPosition == 'start') {
        return taskNode.getFinalX() + taskMainShape.getFinalX() + taskMainShape.getPhysicalStartOffset() + taskLabelOutputText.getDimensions().w + DvtGanttStyleUtils.getTaskLabelPadding() * 2;
      } else {
        return taskNode.getFinalX() + taskMainShape.getFinalX() + taskMainShape.getPhysicalStartOffset();
      }
    } else {
      if (taskLabelOutputText != null && taskLabelOutputText.getParent() != null && labelPosition == 'end') {
        return taskNode.getFinalX() + taskMainShape.getFinalX() + taskMainShape.getFinalWidth() + taskMainShape.getPhysicalEndOffset() + taskLabelOutputText.getDimensions().w + DvtGanttStyleUtils.getTaskLabelPadding() * 2;
      } else {
        return taskNode.getFinalX() + taskMainShape.getFinalX() + taskMainShape.getFinalWidth() + taskMainShape.getPhysicalEndOffset();
      }
    }
  };
  /**
   * Calculate the top of the task
   * @param {DvtGanttTaskNode} taskNode the task node to find the top
   * @return {number} the position of the top of the task node in pixels
   * @private
   */


  DvtGanttDependencyNode._getTaskTop = function (taskNode) {
    return taskNode.getFinalY();
  };
  /**
   * Calculate the bottom of the task node
   * @param {DvtGanttTaskNode} taskNode the task node to find the bottom
   * @return {number} the position of the bottom of the task node in pixels
   * @private
   */


  DvtGanttDependencyNode._getTaskBottom = function (taskNode) {
    return DvtGanttDependencyNode._getTaskTop(taskNode) + taskNode.getFinalHeight();
  };
  /**
   * Checks if dependency type is valid
   * @param {string} type the dependency type
   * @return {boolean} true if dependency type is valid, false otherwise
   * @private
   */


  DvtGanttDependencyNode._isValidType = function (type) {
    return type === DvtGanttDependencyNode.START_START || type === DvtGanttDependencyNode.START_FINISH || type === DvtGanttDependencyNode.FINISH_START || type === DvtGanttDependencyNode.FINISH_FINISH;
  };
  /**
   * Renders the dependency line
   * @param {dvt.Container} container the container to render the dependency line in.
   */


  DvtGanttDependencyNode.prototype.render = function (container) {
    if (this.getParent() != container) container.addChild(this);
    this.setAriaRole('img');
    var gantt = this.getGantt();
    var type = this.getValue('type');
    var predecessorNode = this.getPredecessorNode();
    var successorNode = this.getSuccessorNode(); // update task about predecessors and successors

    predecessorNode.addSuccessorDependency(this);
    successorNode.addPredecessorDependency(this); // for touch the aria-label needs to be available and aria-label on task needs to be updated

    if (dvt.TimeAxis.supportsTouch()) {
      this.setAriaProperty('label', this.getAriaLabel());
      predecessorNode.refreshAriaLabel();
      successorNode.refreshAriaLabel();
    } // due to IE bug https://connect.microsoft.com/IE/feedback/details/781964/,
    // which happens only on older versions of Windows (<10), we'll need to re-render the path instead of just updating its command


    if (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') this._cleanup();

    if (this._line != null) {
      // update dependency line
      this._line.setCmds(DvtGanttDependencyNode._calcDepLine(gantt.getCtx(), predecessorNode, successorNode, type));

      var elem = this._line.getElem();
    } else {
      var line = new dvt.Path(gantt.getCtx(), DvtGanttDependencyNode._calcDepLine(gantt.getCtx(), predecessorNode, successorNode, type)); // If arc radius > 0, then leave pixel hinting--otherwise they look weird and pixelated.
      // Otherwise, the lines are rectilinear, and should be crisp.

      if (DvtGanttStyleUtils.getDependencyLineArcRadius() === 0) {
        line.setPixelHinting(true);
      }

      elem = line.getElem(); // sets the default arrow marker

      dvt.ToolkitUtils.setAttrNullNS(elem, 'marker-end', dvt.ToolkitUtils.getUrlById(gantt.getDefaultMarkerId()));
      this.addChild(line); // set keyboard focus stroke

      var his = new dvt.Stroke(DvtGanttStyleUtils.getFocusedDependencyLineInnerColor(), 1, DvtGanttStyleUtils.getFocusedDependencyLineInnerWidth()); // the outer color won't matter since it will be override by style class

      var hos = new dvt.Stroke('#000', 1, 1);
      line.setHoverStroke(his, hos);
      this._line = line;
    } // apply inline style


    var style = this.getValue('svgStyle');

    if (style) {
      this._line.setStyle(style); // works if style is object

    } // apply style class
    // TODO: right now, the hover inner stroke (see var his) is set to have white color.
    // However, if we use Using toolkit's setClassName method, i.e. this._line.setClassName(styleClass),
    // it saves the class in an internal variable. When one focuses on the dep line,
    // the saved class is applied on the inner stroke in UpdateSelectionEffect(), which
    // overrides the white stroke...
    // See filed  for more details.
    // For now, revert back to not using the Toolkit setClassName and just apply the class on the
    // line ourselves, to eliminate this regression from 2.3.0. Post 3.0.0, we should investigate a better way to do this.


    var defaultStyleClass = gantt.GetStyleClass('dependencyLine');
    var styleClass = this.getValue('svgClassName');
    if (styleClass) dvt.ToolkitUtils.setAttrNullNS(elem, 'class', defaultStyleClass + ' ' + styleClass);else dvt.ToolkitUtils.setAttrNullNS(elem, 'class', defaultStyleClass);
  };
  /**
   * Clean up any artifacts created by this dependency line
   * @private
   */


  DvtGanttDependencyNode.prototype._cleanup = function () {
    if (this._line != null) {
      this.removeChild(this._line);
      this._line = null;
    }
  };
  /**
   * Determine if there is potential conflict between dependency line going out from a task and dependency line
   * going into a task
   * @return {number} conflict value constant
   * @private
   */


  DvtGanttDependencyNode.prototype._calcConflict = function () {
    var predecessorConflict = false;
    var successorConflict = false;
    var type = this.getValue('type'); // checks if there's any dependency line rendered already that have the predecessor as its successor

    var deps = this.getGantt().getNavigableDependencyLinesForTask(this.getPredecessorNode(), 'predecessor');

    if (deps != null) {
      for (var i = 0; i < deps.length; i++) {
        var depType = deps[i].getValue('type');

        if ((type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.START_FINISH) && (depType == DvtGanttDependencyNode.START_START || depType == DvtGanttDependencyNode.FINISH_START) || (type == DvtGanttDependencyNode.FINISH_FINISH || type == DvtGanttDependencyNode.FINISH_START) && (depType == DvtGanttDependencyNode.FINISH_FINISH || depType == DvtGanttDependencyNode.START_FINISH)) {
          predecessorConflict = true;
        }
      }
    } // checks if there's any dependency line rendered already that have the successor as its predecessor


    deps = this.getGantt().getNavigableDependencyLinesForTask(this.getSuccessorNode(), 'successor');

    if (deps != null) {
      for (i = 0; i < deps.length; i++) {
        depType = deps[i].getValue('type');

        if ((type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.FINISH_START) && (depType == DvtGanttDependencyNode.START_START || depType == DvtGanttDependencyNode.START_FINISH) || (type == DvtGanttDependencyNode.FINISH_FINISH || type == DvtGanttDependencyNode.START_FINISH) && (depType == DvtGanttDependencyNode.FINISH_FINISH || depType == DvtGanttDependencyNode.FINISH_START)) {
          successorConflict = true;
        }
      }
    }

    if (predecessorConflict && successorConflict) return DvtGanttDependencyNode.CONFLICT_BOTH;else {
      if (predecessorConflict) return DvtGanttDependencyNode.CONFLICT_PREDECESSOR;else if (successorConflict) return DvtGanttDependencyNode.CONFLICT_SUCCESSOR;
    }
    return DvtGanttDependencyNode.CONFLICT_NONE;
  };
  /**
   * Calculate path command for dependency lines
   * @param {dvt.Context} context The rendering context.
   * @param {DvtGanttTaskNode} predecessorNode the predecessor
   * @param {DvtGanttTaskNode} successorNode the successor
   * @param {string} type the dependency type
   * @return {string} the command path
   * @private
   */


  DvtGanttDependencyNode._calcDepLine = function (context, predecessorNode, successorNode, type) {
    var isRTL = dvt.Agent.isRightToLeft(context); // For RTL the rendering is flipped so for example for start-finish dependency the rendering
    // in RTL would be exactly like finish-start in LTR

    switch (type) {
      case DvtGanttDependencyNode.START_START:
        if (isRTL) return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, true, true);else return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, false, false);
        break;

      case DvtGanttDependencyNode.START_FINISH:
        if (isRTL) return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, true, false);else return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, false, true);
        break;

      case DvtGanttDependencyNode.FINISH_START:
        if (isRTL) return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, false, true);else return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, true, false);
        break;

      case DvtGanttDependencyNode.FINISH_FINISH:
        if (isRTL) return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, false, false);else return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, true, true);
        break;

      default:
        // invalid type, should not happen
        break;
    }

    return null;
  };
  /**
   * Calculate path command for typeBegin-typeEnd type dependency lines
   * @param {DvtGanttTaskNode} predecessorNode the predecessor
   * @param {DvtGanttTaskNode} successorNode the successor
   * @param {boolean} isTypeBeginFinish true if typeBegin is finish, false otherwise
   * @param {boolean} isTypeEndFinish true if typeEnd is finish, false otherwise
   * @return {string} the command path
   * @private
   */


  DvtGanttDependencyNode._calcDepLineHelper = function (predecessorNode, successorNode, isTypeBeginFinish, isTypeEndFinish) {
    // TODO: Right now, arc radius by default is 0, so no issues. If we later change the default arc radius to > 0,
    // we'll need to make sure the radius <= the amount we want to translate before and after drawing the arc to prevent weird artifacts.
    var r = DvtGanttStyleUtils.getDependencyLineArcRadius();
    var taskFlankLength = DvtGanttStyleUtils.getDependencyLineTaskFlankLength();
    var markerWidth = DvtGanttStyleUtils.getDependencyLineMarkerWidth();
    var x1 = isTypeBeginFinish ? DvtGanttDependencyNode._getTaskEnd(predecessorNode) : DvtGanttDependencyNode._getTaskStart(predecessorNode);
    var x2 = isTypeEndFinish ? DvtGanttDependencyNode._getTaskEnd(successorNode) : DvtGanttDependencyNode._getTaskStart(successorNode);

    var y1 = DvtGanttDependencyNode._getTaskMiddle(predecessorNode);

    var y2 = DvtGanttDependencyNode._getTaskMiddle(successorNode);

    var y_intermediate = y2 >= y1 ? DvtGanttDependencyNode._getTaskBottom(predecessorNode) + DvtGanttStyleUtils.getDependencyLineTaskGap() : DvtGanttDependencyNode._getTaskTop(predecessorNode) - DvtGanttStyleUtils.getDependencyLineTaskGap(); // Lock values at .5 px grid to ensure consistent SVG rendering of crispedges across browsers

    x1 = Math.round(x1) + 0.5;
    x2 = Math.round(x2) + 0.5;
    y1 = Math.round(y1) + 0.5;
    y2 = Math.round(y2) + 0.5;
    y_intermediate = Math.round(y_intermediate) + 0.5;
    var x1_flank = x1 + (isTypeBeginFinish ? 1 : -1) * taskFlankLength;
    var x2_flank = isTypeEndFinish ? x2 + taskFlankLength + markerWidth : x2 - taskFlankLength - markerWidth; // Start at (x1, y1)

    var line = dvt.PathUtils.moveTo(x1, y1);

    if (isTypeBeginFinish && x2_flank < x1_flank || !isTypeBeginFinish && x2_flank > x1_flank) {
      // Horizontal line right (typeBegin == finish) or left (typeBegin == start) to x1_flank
      line += dvt.PathUtils.horizontalLineTo(x1_flank + (isTypeBeginFinish ? -1 : 1) * r);

      if (y2 > y1) {
        // Arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank, y1 + r);

        if (isTypeBeginFinish && isTypeEndFinish || !isTypeBeginFinish && !isTypeEndFinish) {
          // Vertical line down
          line += dvt.PathUtils.verticalLineTo(y2 - r); // Arc left (typeBegin == finish) or right (typeBegin == start)

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y2);
        } else {
          // Vertical line down
          line += dvt.PathUtils.verticalLineTo(y_intermediate - r); // Arc left (typeBegin == finish) or right (typeBegin == start)

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y_intermediate); // Horizontal line left (typeBegin == finish) or right (typeBegin == start)

          line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? 1 : -1) * r); // Arc down

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank, y_intermediate + r); // Vertical line down

          line += dvt.PathUtils.verticalLineTo(y2 - r); // Arc right (typeBegin == finish) or left (typeBegin == start)

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank + (isTypeBeginFinish ? 1 : -1) * r, y2);
        }
      } else if (y2 < y1) {
        // Arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x1_flank, y1 - r);

        if (isTypeBeginFinish && isTypeEndFinish || !isTypeBeginFinish && !isTypeEndFinish) {
          // Vertical line up
          line += dvt.PathUtils.verticalLineTo(y2 + r); // Arc left (typeBegin == finish) or right (typeBegin == start)

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y2);
        } else {
          // Vertical line up
          line += dvt.PathUtils.verticalLineTo(y_intermediate + r); // Arc left (typeBegin == finish) or right (typeBegin == start)

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y_intermediate); // Horizontal line left (typeBegin == finish) or right (typeBegin == start)

          line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? 1 : -1) * r); // Arc up

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x2_flank, y_intermediate - r); // Vertical line up

          line += dvt.PathUtils.verticalLineTo(y2 + r); // Arc right (typeBegin == finish) or left (typeBegin == start)

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x2_flank + (isTypeBeginFinish ? 1 : -1) * r, y2);
        }
      } else {
        // Arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank, y1 + r); // Vertical line down

        line += dvt.PathUtils.verticalLineTo(y_intermediate - r); // Arc left (typeBegin == finish) or right (typeBegin == start)

        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y_intermediate); // Horizontal line left (typeBegin == finish) or right (typeBegin == start)

        line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? 1 : -1) * r); // Arc up

        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x2_flank, y_intermediate - r); // Vertical line up

        line += dvt.PathUtils.verticalLineTo(y2 + r);

        if (isTypeEndFinish) {
          // Arc left
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2_flank - r, y2);
        } else {
          // Arc right
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2_flank + r, y2);
        }
      }
    } else {
      if (y2 > y1) {
        // Horizontal line right (typeBegin == finish) or left (typeBegin == start)
        line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? -1 : 1) * r); // Arc down

        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x2_flank, y1 + r); // Vertical line down

        line += dvt.PathUtils.verticalLineTo(y2 - r);

        if (isTypeEndFinish) {
          // Arc left (typeBegin == finish) or right (typeBegin == start)
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2_flank - r, y2);
        } else {
          // Arc right (typeBegin == finish) or left (typeBegin == start)
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2_flank + r, y2);
        }
      } else if (y2 < y1) {
        // Horizontal line right (typeBegin == finish) or left (typeBegin == start)
        line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? -1 : 1) * r); // Arc up

        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank, y1 - r); // Vertical line up

        line += dvt.PathUtils.verticalLineTo(y2 + r);

        if (isTypeEndFinish) {
          // Arc left
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2_flank - r, y2);
        } else {
          // Arc right
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2_flank + r, y2);
        }
      } else {
        if (isTypeBeginFinish && isTypeEndFinish || !isTypeBeginFinish && !isTypeEndFinish) {
          // Horizontal line right (typeBegin == finish) or left (typeBegin == start)
          line += dvt.PathUtils.horizontalLineTo(x1_flank + (isTypeBeginFinish ? -1 : 1) * r); // Arc down

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank, y1 + r); // Vertical line down

          line += dvt.PathUtils.verticalLineTo(y_intermediate - r); // Arc right (typeBegin == finish) or left (typeBegin == start)

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x1_flank + (isTypeBeginFinish ? 1 : -1) * r, y_intermediate); // Horizontal line  right (typeBegin == finish) or left (typeBegin == start)

          line += dvt.PathUtils.horizontalLineTo(x2_flank - r); // Arc up

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank, y_intermediate - r); // Vertical line up

          line += dvt.PathUtils.verticalLineTo(y2 + r); // Arc left

          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank + (isTypeBeginFinish ? -1 : 1) * r, y2);
        }
      }
    } // End at (x2, y2)


    line += dvt.PathUtils.lineTo(x2, y2);
    return line;
  };
  /**
   * @override
   */


  DvtGanttDependencyNode.prototype.getNextNavigable = function (event) {
    if (event.keyCode == dvt.KeyboardEvent.UP_ARROW || event.keyCode == dvt.KeyboardEvent.DOWN_ARROW) {
      // this logic is identical to Diagram and TMap
      //if the dependency line got focus via keyboard, get the task where the focus came from
      //we'll navigate around that task
      //if the focus was set through mouse click, set predecessor as a center of navigation
      var task = this.getKeyboardFocusTask();
      if (!task) task = this.getPredecessorNode(); // go to the previous/next dependency line

      var nextDependencyLine = this;
      var keyboardHandler = this.getGantt().getEventManager().getKeyboardHandler();

      if (keyboardHandler && keyboardHandler.getNextNavigableDependencyLine) {
        var type = task == this.getPredecessorNode() ? 'successor' : 'predecessor';
        var dependencyLines = this.getGantt().getNavigableDependencyLinesForTask(task, type);
        nextDependencyLine = keyboardHandler.getNextNavigableDependencyLine(task, this, event, dependencyLines);
      }

      nextDependencyLine.setKeyboardFocusTask(task);
      return nextDependencyLine;
    } else if (event.keyCode == dvt.KeyboardEvent.RIGHT_ARROW || event.keyCode == dvt.KeyboardEvent.LEFT_ARROW) {
      if (dvt.Agent.isRightToLeft(this.getGantt().getCtx())) return event.keyCode == dvt.KeyboardEvent.LEFT_ARROW ? this.getSuccessorNode() : this.getPredecessorNode();else return event.keyCode == dvt.KeyboardEvent.RIGHT_ARROW ? this.getSuccessorNode() : this.getPredecessorNode();
    } else if (event.type == dvt.MouseEvent.CLICK) {
      return this;
    }

    return null;
  };
  /**
   * Sets a node that should be used for dependency line navigation
   * @param {DvtGanttTaskNode} node
   */


  DvtGanttDependencyNode.prototype.setKeyboardFocusTask = function (node) {
    this._keyboardNavNode = node;
  };
  /**
   * Gets a node that should be used for dependency line navigation
   * @return {DvtGanttTaskNode} a node that should be used for dependency line navigation
   */


  DvtGanttDependencyNode.prototype.getKeyboardFocusTask = function () {
    return this._keyboardNavNode;
  };
  /**
   * @override
   */


  DvtGanttDependencyNode.prototype.getKeyboardBoundingBox = function (targetCoordinateSpace) {
    return this.getDimensions(targetCoordinateSpace);
  };
  /**
   * @override
   */


  DvtGanttDependencyNode.prototype.getTargetElem = function () {
    return this._line.getElem();
  };
  /**
   * @override
   */


  DvtGanttDependencyNode.prototype.showKeyboardFocusEffect = function () {
    if (this._line) {
      var marker = dvt.ToolkitUtils.getAttrNullNS(this._line.getElem(), 'marker-end');
      dvt.ToolkitUtils.addClassName(this._line.getElem(), this._gantt.GetStyleClass('focus'));

      this._line.showHoverEffect(); // default marker-end is not copied to inner shape


      if (marker != null) dvt.ToolkitUtils.setAttrNullNS(this._line.getElem(), 'marker-end', marker);
      this._isShowingKeyboardFocusEffect = true;
    }
  };
  /**
   * @override
   */


  DvtGanttDependencyNode.prototype.hideKeyboardFocusEffect = function () {
    if (this.isShowingKeyboardFocusEffect()) {
      this._line.hideHoverEffect();

      dvt.ToolkitUtils.removeClassName(this._line.getElem(), this._gantt.GetStyleClass('focus'));
      this._isShowingKeyboardFocusEffect = false;
    }
  };
  /**
   * @override
   */


  DvtGanttDependencyNode.prototype.isShowingKeyboardFocusEffect = function () {
    return this._isShowingKeyboardFocusEffect;
  };
  /**
   * Retrieves the tooltip to display on the dependency line
   * @override
   */


  DvtGanttDependencyNode.prototype.getDatatip = function (target, x, y) {
    return this.getAriaLabel();
  };
  /**
   * Gets the aria label
   * @return {string} the aria label string.
   */


  DvtGanttDependencyNode.prototype.getAriaLabel = function () {
    var desc = this.getValue('shortDesc');
    if (desc != null) return desc;

    var translations = this._gantt.getOptions().translations;

    var predecessorId = this.getValue('predecessorTaskId');
    var successorId = this.getValue('successorTaskId');
    var type = this.getValue('type');
    var key = translations[type + 'DependencyAriaDesc'];
    desc = dvt.ResourceUtils.format(translations.accessibleDependencyInfo, [key, predecessorId, successorId]);
    return desc;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Gantt event manager.
   * @param {dvt.Gantt} gantt The owning dvt.Gantt.
   * @extends {dvt.TimeComponentEventManager}
   * @constructor
   */


  var DvtGanttEventManager = function DvtGanttEventManager(gantt) {
    DvtGanttEventManager.superclass.constructor.call(this, gantt);
    this._gantt = this._comp;
  };

  dvt.Obj.createSubclass(DvtGanttEventManager, dvt.TimeComponentEventManager);
  /**
   * Returns the DvtKeyboardNavigable item with the current keyboard focus
   * @override
   */

  DvtGanttEventManager.prototype.getFocus = function () {
    var navigable = DvtGanttEventManager.superclass.getFocus.call(this); // If tasks's parent row is collapsed such that the task is no longer visible, the first visible task of the closest ancestor row is focused and returned

    if (navigable && navigable instanceof DvtGanttTaskNode && navigable.getRowNode().getParent() == null) {
      var navigableObj = navigable.getLayoutObject();
      var rowObj = navigableObj['rowObj'];

      var dataLayoutManager = this._gantt.getDataLayoutManager();

      while (navigableObj == null || !dataLayoutManager.isRoot(rowObj) && dataLayoutManager.isHiddenCollapsed(rowObj)) {
        rowObj = dataLayoutManager.getParentRowObj(rowObj);
        var taskObjs = rowObj['taskObjs'];
        navigableObj = taskObjs.length > 0 ? taskObjs[0] : null;
      }

      if (navigableObj) {
        return navigableObj['node'];
      }

      return null;
    }

    return navigable;
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.hideTooltip = function () {
    if (!this._preventHideTooltip) {
      DvtGanttEventManager.superclass.hideTooltip.call(this);
    } // reset the flag


    this._preventHideTooltip = false;
  }; // Drag & Drop Support

  /**
   * DataType for high level dnd.move tasks source
   * @type {string}
   */


  DvtGanttEventManager.MOVE_TASKS_DATA_TYPE = 'text/_dvtdndmovetasks';
  /**
   * DataType for high level dnd resize tasks source
   * @type {string}
   */

  DvtGanttEventManager.RESIZE_TASKS_DATA_TYPE = 'text/_dvtdndresizetasks';
  /**
   * Scale jump ramp for high level DnD navigation
   * @type {array}
   * @private
   */

  DvtGanttEventManager._HIGH_LEVEL_DND_NAVIGATION_SCALES = ['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years'];
  /**
   * Keyboard DnD type/mode for task move.
   * @type {string}
   */

  DvtGanttEventManager.KEYBOARD_MOVE = 'move';
  /**
   * Keyboard DnD type/mode for task start resize.
   * @type {string}
   */

  DvtGanttEventManager.KEYBOARD_RESIZE_START = 'resizeStart';
  /**
   * Keyboard DnD type/mode for task end resize.
   * @type {string}
   */

  DvtGanttEventManager.KEYBOARD_RESIZE_END = 'resizeEnd';
  /**
   * @override
   */

  DvtGanttEventManager.prototype.isDndSupported = function () {
    return true;
  };
  /**
   * Whether DnD dragging is currently happening
   * @return {boolean} whether DnD dragging is happening
   */


  DvtGanttEventManager.prototype.isDnDDragging = function () {
    return this._isDndDragging;
  };
  /**
   * Setup upon drag start
   * @private
   */


  DvtGanttEventManager.prototype._dragStartSetup = function () {
    // Store current viewport:
    // 1) in case drag canceled later and need to revert back to original state
    // 2) or drag finished, but need to compare with initial viewport to see if viewport change event needs to be fired
    this._dragInitialX = this._gantt.getTimeZoomCanvas().getTranslateX();
    this._dragInitialY = this._gantt.getDatabody().getTranslateY();
    this._dragInitialViewportStart = this._gantt.getViewportStartTime();
    this._dragInitialViewportEnd = this._gantt.getViewportEndTime();
  };
  /**
   * Cleanup when drag is happening, but deliberately cancelled, e.g.
   * via Esc key during drag (NOT via event.preventDefault on dragStart event)
   * @private
   */


  DvtGanttEventManager.prototype._dragCancelCleanup = function () {
    // Revert viewport to original state
    if (this._dragInitialX) {
      var deltaX = this._gantt.getTimeZoomCanvas().getTranslateX() - this._dragInitialX;

      var deltaY = this._gantt.getDatabody().getTranslateY() - this._dragInitialY;

      if (deltaX !== 0 || deltaY !== 0) {
        this._gantt.panBy(deltaX, deltaY, true); // in case of rounding errors, explictly reset viewport start/end times


        this._gantt.setViewportStartTime(this._dragInitialViewportStart);

        this._gantt.setViewportEndTime(this._dragInitialViewportEnd);
      }
    }

    this._dragInitialX = null;
    this._dragInitialY = null;
    this._dragInitialViewportStart = null;
    this._dragInitialViewportEnd = null;
  };
  /**
   * Cleanup on drop
   * @private
   */


  DvtGanttEventManager.prototype._dropCleanup = function () {
    // Fire viewport change event if viewport changed
    if (this._dragInitialViewportStart != null && (this._dragInitialViewportStart !== this._gantt.getViewportStartTime() || this._dragInitialViewportEnd !== this._gantt.getViewportEndTime())) {
      this._gantt.dispatchEvent(this._gantt.createViewportChangeEvent());
    }

    this._dragInitialX = null;
    this._dragInitialY = null;
    this._dragInitialViewportStart = null;
    this._dragInitialViewportEnd = null;
    this._isDndDragging = false;
  };
  /**
   * The current keyboard DnD mode.
   * @return {string} The current mode, e.g. 'move'. null if not currently using keyboard for DnD.
   */


  DvtGanttEventManager.prototype.getKeyboardDnDMode = function () {
    return this._keyboardDnDMode;
  };
  /**
   * Handles keyboard DnD initiation
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
   * @param {DvtGanttTaskNode} sourceObj The source object
   * @param {dvt.Displayable} draggedObj The specific object dragged
   * @param {string} feedbackPosReference The feedback's reference point, one of 'start' or 'end
   * @param {Object} translationProperties Translation properties to use for accessibility
   * @private
   */


  DvtGanttEventManager.prototype._handleKeyboardDnDInitiation = function (event, sourceObj, draggedObj, feedbackPosReference, translationProperties) {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var orientationFactor = isRTL ? -1 : 1;
    this._isDndDragging = true;

    this._dragStartSetup();

    var mainShape = sourceObj.getTask().getShape('main'); // Put up a glass pane to block certain mouse events, in case mouse is over the component during keyboard DnD.
    // E.g. mouseout gets fired when the gantt scrolls during keyboard move such that the row rect underneath the mouse moved away
    // The mouseout event in turn hides the tooltip during keyboard move.

    this._gantt.registerAndConstructGlassPane();

    var glassPaneAdded = this._gantt.installGlassPane(); // Set navigation scale to whatever the scale of the (minor) time axis is


    this._keyboardDnDScaleRampIndex = DvtGanttEventManager._HIGH_LEVEL_DND_NAVIGATION_SCALES.indexOf(this._gantt.getTimeAxis().getScale());
    sourceObj.setDraggedObject(draggedObj);
    sourceObj.dragStartSetup();
    var stagePos = sourceObj.localToStage({
      x: mainShape.getFinalX() + (feedbackPosReference === 'end') * orientationFactor * mainShape.getFinalWidth(),
      y: mainShape.getFinalY()
    });
    this._keyboardDnDFeedbackLocalPos = this._gantt.getDnDArtifactsContainer().stageToLocal(stagePos);
    sourceObj.showDragFeedback(event, this._keyboardDnDFeedbackLocalPos, sourceObj.getRowNode(), {
      x: 0,
      y: 0
    }, true); // As a result of bringing up the glass pane, if the mouse happens to be over the Gantt, a mouseout event is fired, which
    // tries to hide tooltips. Result--the drag tooltip is not shown, which is not desirable.
    // Flag that the feedback tooltip shouldn't be hidden no matter what stray mouse events fired in this scenario.

    if (glassPaneAdded) {
      this._preventHideTooltip = true;
    }

    this._keyboardDnDSourceObj = sourceObj;
    this._keyboardDnDTargetObj = sourceObj.getRowNode();
    var startTime = sourceObj.getValue('start');
    var endTime = sourceObj.getValue('end');
    var baselineStartTime = sourceObj.getValue('baseline', 'start') || null;
    var baselineEndTime = sourceObj.getValue('baseline', 'end') || null;
    this._keyboardDnDFeedbackTime = {
      'start': startTime,
      'end': endTime,
      'baselineStart': baselineStartTime,
      'baselineEnd': baselineEndTime
    }; // Update the aria live region with text that the screenreader should read.

    var translations = this._gantt.getOptions().translations;

    var initiationDesc = translations[translationProperties.initiated];

    if (this._gantt.isSelectionSupported() && this._keyboardDnDSourceObj.isSelected()) {
      var totalSelected = this._gantt.getSelectionHandler().getSelectedCount();

      if (totalSelected > 1) {
        initiationDesc += '. ' + dvt.ResourceUtils.format(translations[translationProperties.selectionInfo], [totalSelected - 1]);
      }
    }

    initiationDesc += '. ' + translations[translationProperties.instruction] + '.';

    this._gantt.updateLiveRegionText(initiationDesc);
  };
  /**
   * Handles high level DnD Move initiation via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
   * @param {DvtGanttTaskNode} sourceObj The source object
   */


  DvtGanttEventManager.prototype.handleKeyboardMoveInitiation = function (event, sourceObj) {
    this._keyboardDnDMode = DvtGanttEventManager.KEYBOARD_MOVE;
    var draggedObj = sourceObj.getTask().getShape('main');
    var translationProperties = {
      'initiated': 'taskMoveInitiated',
      'selectionInfo': 'taskMoveSelectionInfo',
      'instruction': 'taskMoveInitiatedInstruction'
    };

    this._handleKeyboardDnDInitiation(event, sourceObj, draggedObj, 'start', translationProperties);
  };
  /**
   * Handles high level DnD Start Resize initiation via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
   * @param {DvtGanttTaskNode} sourceObj The source object
   */


  DvtGanttEventManager.prototype.handleKeyboardResizeStartInitiation = function (event, sourceObj) {
    this._keyboardDnDMode = DvtGanttEventManager.KEYBOARD_RESIZE_START;
    var draggedObj = sourceObj.getTask().getShape('mainResizeHandleStart');
    var translationProperties = {
      'initiated': 'taskResizeStartInitiated',
      'selectionInfo': 'taskResizeSelectionInfo',
      'instruction': 'taskResizeInitiatedInstruction'
    };

    this._handleKeyboardDnDInitiation(event, sourceObj, draggedObj, 'start', translationProperties);
  };
  /**
   * Handles high level DnD End Resize initiation via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
   * @param {DvtGanttTaskNode} sourceObj The source object
   */


  DvtGanttEventManager.prototype.handleKeyboardResizeEndInitiation = function (event, sourceObj) {
    this._keyboardDnDMode = DvtGanttEventManager.KEYBOARD_RESIZE_END;
    var draggedObj = sourceObj.getTask().getShape('mainResizeHandleEnd');
    var translationProperties = {
      'initiated': 'taskResizeEndInitiated',
      'selectionInfo': 'taskResizeSelectionInfo',
      'instruction': 'taskResizeInitiatedInstruction'
    };

    this._handleKeyboardDnDInitiation(event, sourceObj, draggedObj, 'end', translationProperties);
  };
  /**
   * Handles high level DnD along time via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered move forward/backward
   * @param {string} direction The direction, either 'forward' or 'backward'
   * @private
   */


  DvtGanttEventManager.prototype._handleKeyboardDnDChronologically = function (event, direction) {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var navigationScale = this.getKeyboardDnDNavigationScale();
    ;

    var ganttMinTime = this._gantt.getStartTime();

    var ganttMaxTime = this._gantt.getEndTime();

    var ganttWidth = this._gantt.getContentLength();

    var timeAxis = this._gantt.getTimeAxis();

    var adjacencyDirection = direction === 'forward' ? 'next' : 'previous';
    var newStart = timeAxis.getAdjacentDate(this._keyboardDnDFeedbackTime['start'], navigationScale, adjacencyDirection).getTime();
    var newEnd = timeAxis.getAdjacentDate(this._keyboardDnDFeedbackTime['end'], navigationScale, adjacencyDirection).getTime();
    var currentPos,
        previousPos,
        scrollIntoViewXPriority = 'auto';

    switch (this._keyboardDnDMode) {
      case DvtGanttEventManager.KEYBOARD_MOVE:
        if (direction === 'forward' && newStart <= ganttMaxTime || direction === 'backward' && newEnd >= ganttMinTime) {
          previousPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, this._keyboardDnDFeedbackTime['start'], ganttWidth);
          this._keyboardDnDFeedbackTime['start'] = newStart;
          this._keyboardDnDFeedbackTime['end'] = newEnd;

          if (this._keyboardDnDFeedbackTime['baselineStart']) {
            this._keyboardDnDFeedbackTime['baselineStart'] = timeAxis.getAdjacentDate(this._keyboardDnDFeedbackTime['baselineStart'], navigationScale, adjacencyDirection).getTime();
            this._keyboardDnDFeedbackTime['baselineEnd'] = timeAxis.getAdjacentDate(this._keyboardDnDFeedbackTime['baselineEnd'], navigationScale, adjacencyDirection).getTime();
          }

          currentPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, this._keyboardDnDFeedbackTime['start'], ganttWidth);
        }

        break;

      case DvtGanttEventManager.KEYBOARD_RESIZE_START:
        var sourceEndTime = this._keyboardDnDSourceObj.getValue('end');

        if (direction === 'forward' && newStart <= sourceEndTime || direction === 'backward' && newStart >= ganttMinTime) {
          previousPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, this._keyboardDnDFeedbackTime['start'], ganttWidth);
          this._keyboardDnDFeedbackTime['start'] = newStart;
          currentPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, this._keyboardDnDFeedbackTime['start'], ganttWidth);
        }

        scrollIntoViewXPriority = 'start';
        break;

      case DvtGanttEventManager.KEYBOARD_RESIZE_END:
        var sourceStartTime = this._keyboardDnDSourceObj.getValue('start');

        if (direction === 'forward' && newEnd <= ganttMaxTime || direction === 'backward' && newEnd >= sourceStartTime) {
          previousPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, this._keyboardDnDFeedbackTime['end'], ganttWidth);
          this._keyboardDnDFeedbackTime['end'] = newEnd;
          currentPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, this._keyboardDnDFeedbackTime['end'], ganttWidth);
        }

        scrollIntoViewXPriority = 'end';
        break;
    }

    if (currentPos != null) {
      currentPos = isRTL ? ganttWidth - currentPos : currentPos;
      previousPos = isRTL ? ganttWidth - previousPos : previousPos;
      this._keyboardDnDFeedbackLocalPos.x += currentPos - previousPos;
    } // Update and show feedback


    this._keyboardDnDSourceObj.showDragFeedback(event, this._keyboardDnDFeedbackLocalPos, this._keyboardDnDTargetObj, {
      x: 0,
      y: 0
    }, true); // scroll to feedback


    this._keyboardDnDSourceObj.scrollIntoView(scrollIntoViewXPriority, 'auto'); // Update the aria live region with text that the screenreader should read.


    this._gantt.updateLiveRegionText(dvt.TextUtils.processAriaLabel(DvtGanttTooltipUtils.getDatatip(this._keyboardDnDSourceObj, false)));
  };
  /**
   * Handles high level DnD drag forward in time via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered drag forward
   */


  DvtGanttEventManager.prototype.handleKeyboardDnDForward = function (event) {
    this._handleKeyboardDnDChronologically(event, 'forward');
  };
  /**
   * Handles high level DnD drag backward in time via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered drag backward
   */


  DvtGanttEventManager.prototype.handleKeyboardDnDBackward = function (event) {
    this._handleKeyboardDnDChronologically(event, 'backward');
  };
  /**
   * Handles high level DnD scale change via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered move scale increase/decrease
   * @param {string} step The scale ramp index change
   * @private
   */


  DvtGanttEventManager.prototype._handleKeyboardDnDScaleChange = function (event, step) {
    this._isKeyboardDnDScaleChanged = true;
    this._keyboardDnDScaleRampIndex = Math.max(0, Math.min(this._keyboardDnDScaleRampIndex + step, DvtGanttEventManager._HIGH_LEVEL_DND_NAVIGATION_SCALES.length - 1)); // Update and show feedback

    this._keyboardDnDSourceObj.showDragFeedback(event, this._keyboardDnDFeedbackLocalPos, this._keyboardDnDTargetObj, {
      x: 0,
      y: 0
    }, true); // Update the aria live region with text that the screenreader should read.
    // Tooltip should be showing the navigation scale at this point, so can just grab that text


    this._gantt.updateLiveRegionText(dvt.TextUtils.processAriaLabel(DvtGanttTooltipUtils.getDatatip(this._keyboardDnDSourceObj, false)));

    this._isKeyboardDnDScaleChanged = false;
  };
  /**
   * Returns whether the DnD navigation scale just changed via keyboard.
   * @return {boolean} Whether the DnD navigation scale just changed via keyboard.
   */


  DvtGanttEventManager.prototype.isKeyboardDnDScaleChanged = function () {
    return this._isKeyboardDnDScaleChanged;
  };
  /**
   * Returns the current keyboard DnD navigation scale.
   * @return {string} The current navigation scale.
   */


  DvtGanttEventManager.prototype.getKeyboardDnDNavigationScale = function () {
    return DvtGanttEventManager._HIGH_LEVEL_DND_NAVIGATION_SCALES[this._keyboardDnDScaleRampIndex];
  };
  /**
   * Handles high level DnD increase navigation scale via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered navigation scale increase
   */


  DvtGanttEventManager.prototype.handleKeyboardDnDScaleUp = function (event) {
    this._handleKeyboardDnDScaleChange(event, 1);
  };
  /**
   * Handles high level DnD Move decrease navigation scale via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered navigation scale decrease
   */


  DvtGanttEventManager.prototype.handleKeyboardDnDScaleDown = function (event) {
    this._handleKeyboardDnDScaleChange(event, -1);
  };
  /**
   * Handles high level DnD Move row above or below
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row above or below
   * @param {string} direction 'above' or 'below'
   * @private
   */


  DvtGanttEventManager.prototype._handleKeyboardMoveRowDirection = function (event, direction) {
    var rowObjs = this._gantt.getRowLayoutObjs();

    var rowIndex = this._keyboardDnDTargetObj.getIndex();

    if (direction === 'above' && rowIndex > 0) {
      var newTargetRowObj = rowObjs[rowIndex - 1];
    } else if (direction === 'below' && rowIndex < rowObjs.length - 1) {
      newTargetRowObj = rowObjs[rowIndex + 1];
    }

    if (newTargetRowObj) {
      this._gantt.getDataLayoutManager().ensureInDOM(newTargetRowObj, 'row');

      this._keyboardDnDTargetObj = newTargetRowObj['node']; // Only calculate and update new y position

      var stagePos = this._keyboardDnDTargetObj.localToStage({
        x: 0,
        y: this._keyboardDnDTargetObj.getFinalY() + DvtGanttStyleUtils.getTaskPadding()
      });

      this._keyboardDnDFeedbackLocalPos.y = this._gantt.getDnDArtifactsContainer().stageToLocal(stagePos).y;
    } // Update and show feedback


    this._keyboardDnDSourceObj.showDragFeedback(event, this._keyboardDnDFeedbackLocalPos, this._keyboardDnDTargetObj, {
      x: 0,
      y: 0
    }, true); // scroll to feedback


    this._keyboardDnDSourceObj.scrollIntoView('auto', direction === 'below' ? 'bottom' : 'top'); // Update the aria live region with text that the screenreader should read.


    this._gantt.updateLiveRegionText(dvt.TextUtils.processAriaLabel(DvtGanttTooltipUtils.getDatatip(this._keyboardDnDSourceObj, false)));
  };
  /**
   * Handles high level DnD Move row above
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row above
   */


  DvtGanttEventManager.prototype.handleKeyboardMoveRowAbove = function (event) {
    this._handleKeyboardMoveRowDirection(event, 'above');
  };
  /**
   * Handles high level DnD Move row below
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row below
   */


  DvtGanttEventManager.prototype.handleKeyboardMoveRowBelow = function (event) {
    this._handleKeyboardMoveRowDirection(event, 'below');
  };
  /**
   * Handles high level DnD finalize via keyboard
   * @param {dvt.KeyboardEvent} event The keyboard event that triggered this
   */


  DvtGanttEventManager.prototype.handleKeyboardDnDFinalize = function (event) {
    // Viewport adjustments need to be done before handling move callback (rerender may happen after move callback)
    this._dropCleanup();

    var taskContexts, start, end, value, evt, ariaText;

    var translations = this._gantt.getOptions().translations;

    if (this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_MOVE) {
      taskContexts = this._getDragDataContexts(this._keyboardDnDSourceObj);
      start = new Date(this._keyboardDnDFeedbackTime['start']).toISOString();
      end = new Date(this._keyboardDnDFeedbackTime['end']).toISOString();
      var baselineStart = this._keyboardDnDFeedbackTime['baselineStart'] == null ? null : new Date(this._keyboardDnDFeedbackTime['baselineStart']).toISOString();
      var baselineEnd = this._keyboardDnDFeedbackTime['baselineEnd'] == null ? null : new Date(this._keyboardDnDFeedbackTime['baselineEnd']).toISOString();
      value = start;

      var rowContexts = this._keyboardDnDTargetObj.getDataContext();

      evt = dvt.EventFactory.newGanttMoveEvent(taskContexts, value, start, end, baselineStart, baselineEnd, rowContexts);
      ariaText = translations.taskMoveFinalized;
    } else if (this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_END || this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_START) {
      taskContexts = this._getDragDataContexts(this._keyboardDnDSourceObj).map(function (data) {
        return data.dataContext;
      });
      start = new Date(this._keyboardDnDFeedbackTime['start']).toISOString();
      end = new Date(this._keyboardDnDFeedbackTime['end']).toISOString();
      var type;

      if (this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_END) {
        value = end;
        type = 'end';
      } else if (this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_START) {
        value = start;
        type = 'start';
      }

      evt = dvt.EventFactory.newGanttResizeEvent(taskContexts, value, start, end, type);
      ariaText = translations.taskResizeFinalized;
    }

    if (evt) {
      this._gantt.dispatchEvent(evt); // Update the aria live region with text that the screenreader should read.


      this._gantt.updateLiveRegionText(ariaText);
    }

    this._keyboardDnDCleanup();
  };
  /**
   * Handles cancelling of DnD interaction via keyboard (e.g via Esc key during drag)
   */


  DvtGanttEventManager.prototype.handleKeyboardDnDCancel = function () {
    var translations = this._gantt.getOptions().translations;

    if (this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_MOVE) {
      // Update the aria live region with text that the screenreader should read.
      this._gantt.updateLiveRegionText(translations.taskMoveCancelled);
    } else if (this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_END || this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_START) {
      this._gantt.updateLiveRegionText(translations.taskResizeCancelled);
    }

    this._dragCancelCleanup();

    this._keyboardDnDCleanup();
  };
  /**
   * Cleans up high level keyboard DnD (e.g. called when keyboard DnD cancelled or finalized)
   * @private
   */


  DvtGanttEventManager.prototype._keyboardDnDCleanup = function () {
    if (this._keyboardDnDMode != null) {
      this._keyboardDnDSourceObj.dragEndCleanup();

      this._keyboardDnDMode = null;
      this._isDndDragging = false;
      this._keyboardDnDSourceObj = null;
      this._keyboardDnDTargetObj = null;
      this._keyboardDnDFeedbackTime = null;
      this._keyboardDnDScaleRampIndex = null;

      this._gantt.unregisterAndDestroyGlassPane();
    }
  };
  /**
   * Gets the specific DnD task sub type (e.g. tasks, handles, ports, etc.) given the DvtGanttTaskShape|DvtGanttTaskLabel object of interest.
   * @param {DvtGanttTaskShape|DvtGanttTaskLabel} taskObject
   * @return {string} The specifc drag source type
   */


  DvtGanttEventManager.prototype.getDnDTaskSubType = function (taskObject) {
    if (taskObject instanceof DvtGanttTaskShape) {
      var taskObjectType = taskObject.getType();

      if (taskObjectType === 'main' || taskObjectType === 'progress') {
        return 'tasks';
      }

      if (taskObjectType === 'mainResizeHandleStart' || taskObjectType === 'mainResizeHandleEnd') {
        return 'taskResizeHandles';
      }

      if (taskObjectType === 'baseline') {
        return null; // Baselines not draggable
      }
    }

    return 'tasks'; // DvtGanttTaskLabel or the hover/selection rings
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.GetDragSourceType = function (event) {
    switch (this._keyboardDnDMode) {
      case DvtGanttEventManager.KEYBOARD_MOVE:
        return this.IsDragSupported('tasks') ? 'tasks' : null;

      case DvtGanttEventManager.KEYBOARD_RESIZE_END:
      case DvtGanttEventManager.KEYBOARD_RESIZE_START:
        return this.IsDragSupported('taskResizeHandles') ? 'taskResizeHandles' : null;
    }

    var obj = this.DragSource.getDragObject();

    if (obj instanceof DvtGanttTaskNode) {
      // The drag source should have been set already on mousedown/touchstart.
      // However, if called from dragstart event, and the event is artifically dispatched (e.g. during automated testing),
      // then explicitly set an appropriate drag source.
      if (event && event.getNativeEvent().type === 'dragstart') {
        var nativeEvent = event.getNativeEvent();
        var clientX = nativeEvent.clientX;
        var clientY = nativeEvent.clientY;
        var offsetX = nativeEvent.offsetX;
        var offsetY = nativeEvent.offsetY;
        var isTest = clientX == null && clientY == null || (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') && isNaN(offsetX) && isNaN(offsetY);

        if (isTest) {
          var taskSource = event.target ? event.target : obj.getTask().getShape('main');
          obj.setDraggedObject(taskSource);
        }
      } // Otherwise, (e.g. called from drag or dragend), the affordance may have moved or mouse left the affordance, so grab the stored object.


      var sourceType = this.getDnDTaskSubType(obj.getDraggedObject());
      return this.IsDragSupported(sourceType) ? sourceType : null;
    }

    return null;
  };
  /**
   * Gets the drag data contexts given the drag source object
   * @param {object} obj The drag source object
   * @param {boolean} bSanitize if true, the data contexts return should be sanitized so they can safely be stringified
   * @return {array} array of data contexts
   * @private
   */


  DvtGanttEventManager.prototype._getDragDataContexts = function (obj, bSanitize) {
    if (obj instanceof DvtGanttTaskNode) {
      var taskSource = obj.getDraggedObject();
      var taskShapeType = taskSource.getType ? taskSource.getType() : null;
      var sourceType = this.getDnDTaskSubType(taskSource);

      if (sourceType != null) {
        var getDragContext = function getDragContext(obj) {
          var dataContext = obj.getDataContext();
          if (bSanitize) dvt.ToolkitUtils.cleanDragDataContext(dataContext);

          switch (taskShapeType) {
            case 'mainResizeHandleStart':
              return {
                'dataContext': dataContext,
                'type': 'start'
              };

            case 'mainResizeHandleEnd':
              return {
                'dataContext': dataContext,
                'type': 'end'
              };
          }

          return dataContext;
        };

        var contexts = [getDragContext(obj)];

        if (this._gantt.isSelectionSupported() && obj.isSelected() && this._gantt.getSelectionHandler().getSelectedCount() > 1) {
          var selection = this._gantt.getSelectionHandler().getSelection();

          for (var i = 0; i < selection.length; i++) {
            var selectionObj = selection[i];

            if (selectionObj instanceof DvtGanttTaskNode && selectionObj !== obj) {
              contexts.push(getDragContext(selectionObj));
            }
          }
        }

        return contexts;
      }
    }

    return null;
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.GetDragDataContexts = function (bSanitize) {
    var obj = this.DragSource.getDragObject();
    return this._getDragDataContexts(obj, bSanitize);
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.GetDropOffset = function (event) {
    var obj = this.DragSource.getDragObject();

    if (obj instanceof DvtGanttTaskNode) {
      var sourceType = this.getDnDTaskSubType(obj.getDraggedObject());

      if (sourceType === 'tasks') {
        var startTime = obj.getValue('start');
        var endTime = obj.getValue('end');
        var posSpan = obj.getTask().getTimeSpanDimensions(startTime, endTime);

        var relPosStage = this._context.pageToStageCoords(event.pageX, event.pageY);

        var relPosLocal = this._gantt.getDnDArtifactsContainer().stageToLocal(relPosStage); // first value is the start POSITIONAL (not time) difference from event position of the dragged task; second value is the y positional offset


        return new dvt.Point(posSpan['startPos'] - relPosLocal.x, obj.getFinalY() - relPosLocal.y);
      }
    }

    return new dvt.Point(0, 0); // if not dragging a task, then no offset--there's no notion of start/end positional offset from event position
  };
  /**
   * Returns the logical object that accepts DnD drops
   * @param {dvt.BaseEvent=} event The dnd dragOver/dragEnter/dragLeave/drop event. If not specified, then the last known drop object is returned
   * @return {object} The (last known) logical object of the target
   * @private
   */


  DvtGanttEventManager.prototype._getDropObject = function (event) {
    if (event) {
      var obj = this.GetLogicalObject(event.target); // If dropped on task, but high level interaction enabled and no additional low level configuration for task as drop target specified, then
      // consider the drop target the underlying row instead

      var options = this._gantt.getOptions();

      var dnd = options['dnd'];

      var highLevelInteractionEnabled = this._gantt.isTaskMoveEnabled() || this._gantt.isTaskResizeEnabled();

      var lowLevelTaskDropSpecified = dnd['drop']['tasks'] && (dnd['drop']['tasks']['dataTypes'] || dnd['drop']['tasks']['drop']);

      if (obj instanceof DvtGanttTaskNode && highLevelInteractionEnabled && !lowLevelTaskDropSpecified) {
        this._dropObj = obj.getRowNode();
      } else {
        this._dropObj = obj;
      }
    }

    return this._dropObj;
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.GetDropTargetType = function (event) {
    var obj = this._getDropObject(event);

    if (obj instanceof DvtGanttRowNode) {
      return 'rows';
    }

    if (obj instanceof DvtGanttTaskNode) {
      // For now, any part of the task node is a 'task', including handles.
      // May need to reconsider when we support ports in the future.
      return 'tasks';
    }

    return null;
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.GetDropEventPayload = function (event) {
    // Apply the drop offset if the drag source is a DVT component
    // NOTE: The drop offset is stored in dataTransfer, so it's only accessible from "drop" event. It can't be
    //       accessed from "dragEnter", "dragOver", and "dragLeave".
    var dataTransfer = event.getNativeEvent().dataTransfer;
    var offsetStart = Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_X_DATA_TYPE)) || 0;
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());

    var dropObj = this._getDropObject(event);

    if (dropObj instanceof DvtGanttRowNode || dropObj instanceof DvtGanttTaskNode) {
      var relPosStage = this._context.pageToStageCoords(event.pageX, event.pageY);

      var relPosLocal = this._gantt.getTimeZoomCanvas().stageToLocal(relPosStage);

      var ganttStartTime = this._gantt.getStartTime();

      var ganttEndTime = this._gantt.getEndTime();

      var ganttContentLength = this._gantt.getContentLength();

      var payload = {
        'value': new Date(dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, isRTL ? ganttContentLength - relPosLocal.x : relPosLocal.x, ganttContentLength)).toISOString(),
        'start': null,
        'end': null,
        'baselineStart': null,
        'baselineEnd': null,
        'dataContext': dropObj.getDataContext()
      };
      var dragObj = this.DragSource.getDragObject();

      if (dragObj instanceof DvtGanttTaskNode) {
        var startTime = dragObj.getValue('start');
        var endTime = dragObj.getValue('end');
        var baselineStartTime = dragObj.getValue('baseline', 'start') || null;
        var baselineEndTime = dragObj.getValue('baseline', 'end') || null;
        var taskSource = dragObj.getDraggedObject();
        var dragSourceType = this.getDnDTaskSubType(taskSource);

        if (dragSourceType === 'tasks') {
          payload['start'] = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, isRTL ? ganttContentLength - (relPosLocal.x + offsetStart) : relPosLocal.x + offsetStart, ganttContentLength);
          payload['end'] = payload['start'] + (endTime - startTime);

          if (!(baselineStartTime == null && baselineEndTime == null)) {
            payload['baselineStart'] = new Date(baselineStartTime - startTime + payload['start']).toISOString();
            payload['baselineEnd'] = new Date(baselineEndTime - endTime + payload['end']).toISOString();
          }

          payload['start'] = new Date(payload['start']).toISOString();
          payload['end'] = new Date(payload['end']).toISOString();
        } else if (dragSourceType === 'taskResizeHandles') {
          var taskShapeType = taskSource.getType ? taskSource.getType() : null;

          if (taskShapeType === 'mainResizeHandleEnd') {
            payload['start'] = new Date(startTime).toISOString();
            payload['end'] = new Date(payload['value']).getTime() - startTime < 0 ? startTime : payload['value'];
          } else {
            payload['start'] = endTime - new Date(payload['value']).getTime() < 0 ? endTime : payload['value'];
            payload['end'] = new Date(endTime).toISOString();
          }
        }
      }

      return payload;
    }

    return null;
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.ShowDropEffect = function (event) {
    var dropObj = this._getDropObject(event);

    if (this._gantt.isTaskResizeEnabled()) {
      var obj = this.DragSource.getDragObject();

      if (obj instanceof DvtGanttTaskNode) {
        var taskSource = obj.getDraggedObject();
        var sourceType = this.getDnDTaskSubType(taskSource);

        if (sourceType === 'taskResizeHandles') {
          return; // Don't show any effects for task resize case
        }
      }
    }

    if (dropObj && dropObj instanceof DvtGanttRowNode) {
      var targetElem = dropObj.getBackground().getElem();
      dvt.ToolkitUtils.addClassName(targetElem, this._gantt.GetStyleClass('activeDrop'));
    }

    ;
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.ShowRejectedDropEffect = function (event) {
    var dropObj = this._getDropObject(event);

    if (this._gantt.isTaskResizeEnabled()) {
      var obj = this.DragSource.getDragObject();

      if (obj instanceof DvtGanttTaskNode) {
        var taskSource = obj.getDraggedObject();
        var sourceType = this.getDnDTaskSubType(taskSource);

        if (sourceType === 'taskResizeHandles') {
          return; // Don't show any effects for task resize case
        }
      }
    }

    if (dropObj && dropObj instanceof DvtGanttRowNode) {
      var targetElem = dropObj.getBackground().getElem();
      dvt.ToolkitUtils.addClassName(targetElem, this._gantt.GetStyleClass('invalidDrop'));
    }

    ;
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.ClearDropEffect = function () {
    var prevDropObj = this._getDropObject();

    if (prevDropObj && prevDropObj instanceof DvtGanttRowNode) {
      var prevTargetElem = prevDropObj.getBackground().getElem();
      dvt.ToolkitUtils.removeClassName(prevTargetElem, this._gantt.GetStyleClass('invalidDrop'));
      dvt.ToolkitUtils.removeClassName(prevTargetElem, this._gantt.GetStyleClass('activeDrop'));
    }
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.OnDndDragStart = function (event) {
    DvtGanttEventManager.superclass.OnDndDragStart.call(this, event); // At this point, isDnDDragging should be false. If true, then something else initiated a drag, e.g. keyboard move,
    // There should only be one set of things dragging at any give time, so cancel this one.

    if (this._isDndDragging) {
      event.preventDefault();
    }

    var nativeEvent = event.getNativeEvent();

    if (!nativeEvent.defaultPrevented) {
      this._isDndDragging = true;

      this._dragStartSetup();

      var obj = this.DragSource.getDragObject();

      if (obj instanceof DvtGanttTaskNode) {
        obj.dragStartSetup(event);
        var dataTransfer = nativeEvent.dataTransfer;
        this._dropOffset = new dvt.Point(Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_X_DATA_TYPE)) || 0, Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_Y_DATA_TYPE)) || 0);
      } else {
        this._dropOffset = new dvt.Point(0, 0);
      }
    } else {
      // Reenable panning
      this._gantt.SetPanningEnabled(true);
    }
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.OnDndDragOver = function (event) {
    DvtGanttEventManager.superclass.OnDndDragOver.call(this, event); // Redrawing the drag feedback image every time the dragover event is fired (every 350ms or so, even when the mouse didn't move)
    // affects performance, especially when the viewport refreshes on edge auto panning. Throttle the feedback drawing using
    // requestAnimationFrame similar to the example outlined in https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example

    var self = this;
    this._lastKnownDragOverEvent = event;
    self._isDndDragging = true; // Only requestAnimationFrame if one is not requested already, and if the mouse moved (no need to update feedback if mouse didn't move).

    if (!this._isDragOverTicking && (!this._lastProcessedDragOverEvent || this._lastKnownDragOverEvent.pageX !== this._lastProcessedDragOverEvent.pageX || this._lastKnownDragOverEvent.pageY !== this._lastProcessedDragOverEvent.pageY)) {
      requestAnimationFrame(function () {
        // Need to do this here instead of onDndDrag because the drag event doesn't have pageX/Y on FF for some reason.
        var obj = self.DragSource.getDragObject();

        if (obj instanceof DvtGanttTaskNode && self._isDndDragging) {
          if (self._lastKnownDragOverEvent.getNativeEvent().defaultPrevented) {
            var stagePos = self._gantt.getCtx().pageToStageCoords(self._lastKnownDragOverEvent.pageX, self._lastKnownDragOverEvent.pageY); // Note, "local" here means in the reference of the affordance container coord system


            var localPos = self._gantt.getDnDArtifactsContainer().stageToLocal(stagePos);

            obj.showDragFeedback(self._lastKnownDragOverEvent, localPos, self._getDropObject(), self._dropOffset); // For touch devices with screenreader, we're using passthru gesture (in iOS VoiceOVer, double tap and hold until tone, then drag) to perform real HTML5 drag and drop.
            // Update the aria live region with position information if the position changed due to drag.

            if (dvt.Agent.isTouchDevice()) {
              // Only update the aria live region if what we want to be read out changed,
              // e.g. the finger may have stopped, but moved 1px by accident and we don't want what's currently being read be interrupted.
              var screenReaderDragText = dvt.TextUtils.processAriaLabel(DvtGanttTooltipUtils.getDatatip(obj, false));

              if (self._gantt.isSelectionSupported() && obj.isSelected()) {
                var totalSelected = self._gantt.getSelectionHandler().getSelectedCount();

                if (totalSelected > 1) {
                  screenReaderDragText += '. ' + dvt.ResourceUtils.format(self._gantt.getOptions().translations.taskMoveSelectionInfo, [totalSelected - 1]);
                }
              }

              if (!self._prevScreenReaderDragText || self._prevScreenReaderDragText !== screenReaderDragText) {
                self._gantt.updateLiveRegionText(screenReaderDragText);
              }

              self._prevScreenReaderDragText = screenReaderDragText;
            }
          } else obj.removeDragFeedbacks();
        }

        self._lastProcessedDragOverEvent = self._lastKnownDragOverEvent;
        self._isDragOverTicking = false;
      });
      this._isDragOverTicking = true;
    }
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.OnDndDragEnd = function (event) {
    DvtGanttEventManager.superclass.OnDndDragEnd.call(this, event);
    var obj = this.DragSource.getDragObject();

    if (obj instanceof DvtGanttTaskNode) {
      obj.dragEndCleanup();
    }

    this._isDndDragging = false;
    this._dropOffset = new dvt.Point(0, 0); // If mouse dragging, but keyboard Esc pressed to cancel, then dropEffect is 'none'
    // This is the recommended way to detect drag cancelling according to MDN:
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragend
    // "If the dropEffect property has the value none during a dragend, then the drag was cancelled. Otherwise, the effect specifies which operation was performed."

    if (event.getNativeEvent().dataTransfer.dropEffect === 'none') {
      this.handleKeyboardDnDCancel();
    } // reenabling panning on dragend and on mouseup
    // the panning is disabled on mousedown event to prevent panning for potential drag
    // if draggable source is not dragged, the component will not get dragend event and the panning is reenabled on mouseup
    // if draggable source was dragged, the component will get dragend event, but it might not get mouseup event


    this._gantt.SetPanningEnabled(true);
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.OnDndDrop = function (event) {
    DvtGanttEventManager.superclass.OnDndDrop.call(this, event); // Viewport adjustments need to be done before handling move callback (rerender may happen after move callback)

    this._dropCleanup();

    var nativeEvent = event.getNativeEvent();

    if (nativeEvent.defaultPrevented) {
      var dragObj = this.DragSource.getDragObject();
      var sourceType = dragObj.getDraggedObject ? this.getDnDTaskSubType(dragObj.getDraggedObject()) : 'tasks';

      if (this._gantt.isTaskMoveEnabled() && sourceType === 'tasks') {
        // For touch devices with screenreader, we're using passthru gesture (in iOS VoiceOVer, double tap and hold until tone, then drag) to perform real HTML5 drag and drop.
        // Update the aria live region when drop happened (i.e. in VO, when the finger is lifted to end passthru gesture);
        if (dvt.Agent.isTouchDevice()) {
          this._gantt.updateLiveRegionText(this._gantt.getOptions().translations.taskMoveFinalized);
        }

        var dropPayload = this.GetDropEventPayload(event);
        var taskContexts = JSON.parse(nativeEvent.dataTransfer.getData(DvtGanttEventManager.MOVE_TASKS_DATA_TYPE));
        var value = dropPayload['value'];
        var start = dropPayload['start'];
        var end = dropPayload['end'];
        var baselineStart = dropPayload['baselineStart'];
        var baselineEnd = dropPayload['baselineEnd'];
        var rowContexts = dropPayload['dataContext'];
        var evt = dvt.EventFactory.newGanttMoveEvent(taskContexts, value, start, end, baselineStart, baselineEnd, rowContexts);

        this._gantt.dispatchEvent(evt);
      } else if (this._gantt.isTaskResizeEnabled() && sourceType === 'taskResizeHandles') {
        // Update the aria live region when drop happened (i.e. in VO, when the finger is lifted to end passthru gesture);
        if (dvt.Agent.isTouchDevice()) {
          this._gantt.updateLiveRegionText(this._gantt.getOptions().translations.taskResizeFinalized);
        }

        var dropPayload = this.GetDropEventPayload(event);
        var dragData = JSON.parse(nativeEvent.dataTransfer.getData(DvtGanttEventManager.RESIZE_TASKS_DATA_TYPE));
        var type = dragData[0]['type'];
        var taskContexts = dragData.map(function (data) {
          return data.dataContext;
        });
        var value = dropPayload['value'];
        var start = dropPayload['start'];
        var end = dropPayload['end'];
        var evt = dvt.EventFactory.newGanttResizeEvent(taskContexts, value, start, end, type);

        this._gantt.dispatchEvent(evt);
      }
    }
  };
  /**
   * Helper function that checks if a given source type is draggable
   * @param {string} type
   * @return {boolean} true if the source type can be dragged
   * @protected
   */


  DvtGanttEventManager.prototype.IsDragSupported = function (type) {
    if (this.isDndSupported()) {
      var options = this._gantt.getOptions();

      var dragConfig = options['dnd'] && options['dnd']['drag'] ? options['dnd']['drag'] : null;
      return dragConfig && dragConfig[type] && dragConfig[type]['dataTypes'] && dragConfig[type]['dataTypes'].length > 0;
    }

    return false;
  };
  /**
   * Helper function that checks if a given target type can recieve drop
   * @param {string} type
   * @return {boolean} true if the source type can recieve drop
   * @protected
   */


  DvtGanttEventManager.prototype.IsDropSupported = function (type) {
    if (this.isDndSupported()) {
      var options = this._gantt.getOptions();

      var drogConfig = options['dnd'] && options['dnd']['drop'] ? options['dnd']['drop'] : null;
      return drogConfig && drogConfig[type] && drogConfig[type]['dataTypes'];
    }

    return false;
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.OnMouseDown = function (event) {
    var objAndDisp = this.GetLogicalObjectAndDisplayable(event.target); // If draggable, prevent drag panning

    if (objAndDisp.logicalObject instanceof DvtGanttTaskNode) {
      var sourceType = this.getDnDTaskSubType(objAndDisp.displayable);

      if (this.IsDragSupported(sourceType)) {
        this._gantt.SetPanningEnabled(false); // Normally this can be handled on dragstart event, but
        // IE11 is stupid. dragstart events fire after the mouse/touch drags
        // a certain px away from the initiation point, and in all browsers
        // except IE11, the dragstart event targets the element at the initiation point.
        // IE11's dragstart, however, targets the element at the point where dragstart
        // event fires, which can be different from that of the initiation point.


        objAndDisp.logicalObject.setDraggedObject(objAndDisp.displayable);
      }
    }

    DvtGanttEventManager.superclass.OnMouseDown.call(this, event);
  };
  /**
   * Expands or collapses a row when expand/collapse button is clicked.
   * @param {dvt.BaseEvent} event
   * @param {dvt.Button} button The button that calls the method.
   */


  DvtGanttEventManager.prototype.onExpandCollapseButtonClick = function (event, button) {
    var labelContent = this.GetLogicalObject(button);
    var rowObj = labelContent.getRowLayoutObject();
    this.toggleRowExpandCollapse(event, rowObj);
  };
  /**
   * Toggle expand or collapse of the row with given row layout object.
   * @param {dvt.BaseEvent} event
   * @param {Object} rowObj
   */


  DvtGanttEventManager.prototype.toggleRowExpandCollapse = function (event, rowObj) {
    if (rowObj['expanded'] == null) // leaf
      {
        return;
      }

    var options = this._gantt.getOptions();

    var expandedKeySet = options['expanded'];
    var rowKey = rowObj['id']; // Currently, expand/collapse events (and their payloads) are NOT exposed; make sure to sanitize the data before exposing in the payload if this changes in the future.

    var rowData = rowObj['data']; // Today, only hierarchical task is supported, so itemData is the row data of task-data data provider

    var taskData = rowObj['taskObjs'][0]['data'];
    var taskId = taskData['id'];
    var itemData = taskData['_itemData'];
    var type;
    var newExpandedKeySet;

    if (expandedKeySet.has(rowKey)) {
      newExpandedKeySet = expandedKeySet.delete([rowKey]);
      type = 'collapse';
    } else {
      newExpandedKeySet = expandedKeySet.add([rowKey]);
      type = 'expand';
    } // Fire event to trigger a rerender. Save state so that the next render can be smart about it.


    this._gantt.setRenderState({
      'state': type,
      'payload': rowObj
    }); // Need to clear selection before render to clear selection effects--selection will be restored on next render


    if (this._gantt.isSelectionSupported()) this._gantt.getSelectionHandler().clearSelection();
    var evt = dvt.EventFactory.newGanttExpandCollapseEvent(type, taskId, rowData, itemData, newExpandedKeySet);

    this._gantt.dispatchEvent(evt);
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.HandleImmediateTouchStartInternal = function (event) {
    // If draggable, prevent drag panning
    if (event.targetTouches.length == 1) {
      var objAndDisp = this.GetLogicalObjectAndDisplayable(event.target);

      if (objAndDisp.logicalObject instanceof DvtGanttTaskNode) {
        var sourceType = this.getDnDTaskSubType(objAndDisp.displayable);

        if (this.IsDragSupported(sourceType)) {
          this._gantt.SetPanningEnabled(false); // Normally this can be handled on dragstart event, but
          // IE11 is stupid. dragstart events fire after the mouse/touch drags
          // a certain px away from the initiation point, and in all browsers
          // except IE11, the dragstart event targets the element at the initiation point.
          // IE11's dragstart, however, targets the element at the point where dragstart
          // event fires, which can be different from that of the initiation point.


          objAndDisp.logicalObject.setDraggedObject(objAndDisp.displayable);
        }
      }
    }
  };
  /**
   * @override
   */


  DvtGanttEventManager.prototype.OnTouchMoveBubble = function (event) {
    // Normally, on touch move, if touch is over an object that can show a tooltip, it's shown.
    // Otherwise, the tooltip is explicitly hidden.
    // During drag (for DnD), a tooltip is shown on the feedback, but the touch move handler tries to hide it.
    // This causes flickering as the tooltip is shown and hidden very quickly.
    // Make sure to prevent the tooltip from being hidden during drag and drop--the drag/drop events will handle
    // showing/hiding the tooltip.
    if (this._isDndDragging) {
      this._preventHideTooltip = true;
    }

    DvtGanttEventManager.superclass.OnTouchMoveBubble.call(this, event);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Gantt keyboard handler.
   * @param {dvt.Gantt} gantt The Gantt component.
   * @param {dvt.EventManager} manager The owning dvt.EventManager.
   * @class DvtGanttKeyboardHandler
   * @extends {dvt.TimeComponentKeyboardHandler}
   * @constructor
   */


  var DvtGanttKeyboardHandler = function DvtGanttKeyboardHandler(gantt, manager) {
    this.Init(gantt, manager);
  };

  dvt.Obj.createSubclass(DvtGanttKeyboardHandler, dvt.TimeComponentKeyboardHandler);
  /**
   * @override
   */

  DvtGanttKeyboardHandler.prototype.Init = function (gantt, manager) {
    DvtGanttKeyboardHandler.superclass.Init.call(this, manager);
    this._gantt = gantt;
  };
  /**
   * Retrieve previous task.
   * @param {dvt.Gantt} gantt
   * @param {Array} rowObjs
   * @param {Object} currentRowObj
   * @param {number} currentRowIndex
   * @param {DvtGanttTaskNode} currentNavigable
   * @return {DvtGanttTaskNode} the previous task node
   * @private
   */


  DvtGanttKeyboardHandler._findPreviousTask = function (gantt, rowObjs, currentRowObj, currentRowIndex, currentNavigable) {
    var taskObjs = currentRowObj['taskObjs'];

    if (taskObjs.length === 0) {
      if (currentRowIndex === 0) return currentNavigable;else return DvtGanttKeyboardHandler._findPreviousTask(gantt, rowObjs, rowObjs[currentRowIndex - 1], currentRowIndex - 1, currentNavigable);
    } else {
      var taskObj = taskObjs[taskObjs.length - 1];
      gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
      return taskObj['node'];
    }
  };
  /**
   * Retrieve next task.
   * @param {dvt.Gantt} gantt
   * @param {Array} rowObjs
   * @param {Object} currentRowObj
   * @param {number} currentRowIndex
   * @param {DvtGanttTaskNode} currentNavigable
   * @return {DvtGanttTaskNode} the next task node
   * @private
   */


  DvtGanttKeyboardHandler._findNextTask = function (gantt, rowObjs, currentRowObj, currentRowIndex, currentNavigable) {
    var taskObjs = currentRowObj['taskObjs'];

    if (taskObjs.length === 0) {
      if (currentRowIndex == rowObjs.length - 1) return currentNavigable;else return DvtGanttKeyboardHandler._findNextTask(gantt, rowObjs, rowObjs[currentRowIndex + 1], currentRowIndex + 1, currentNavigable);
    } else {
      var taskObj = taskObjs[0];
      gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
      return taskObj['node'];
    }
  };
  /**
   * Finds next navigable item based on direction.
   * @param {dvt.Gantt} gantt The component.
   * @param {DvtKeyboardNavigable} currentNavigable The navigable item with current focus.
   * @param {dvt.KeyboardEvent} event The keyboard event.
   * @param {DvtKeyboardNavigable=} originalNavigable The original item that initaited navigation.
   * @return {DvtKeyboardNavigable} The next navigable.
   */


  DvtGanttKeyboardHandler.getNextNavigable = function (gantt, currentNavigable, event, originalNavigable) {
    if (currentNavigable instanceof DvtGanttTaskNode) {
      var currentRow = currentNavigable.getRowNode();
      var rowObjs = gantt.getRowLayoutObjs();
      var taskObjs = currentRow.getTaskObjs();
      var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
      var rowIndex = currentRow.getIndex();

      switch (event.keyCode) {
        case !isRTL ? dvt.KeyboardEvent.LEFT_ARROW : dvt.KeyboardEvent.RIGHT_ARROW:
          var taskIndex = taskObjs.map(function (t) {
            return t['node'];
          }).indexOf(currentNavigable); // check if it's the first task in the row

          if (taskIndex == 0) {
            // go to the last task of the previous row
            if (rowIndex > 0) {
              // find the previous row with task
              return DvtGanttKeyboardHandler._findPreviousTask(gantt, rowObjs, rowObjs[rowIndex - 1], rowIndex - 1, currentNavigable);
            }
          } else {
            var taskObj = taskObjs[taskIndex - 1];
            gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
            return taskObj['node'];
          }

          break;

        case !isRTL ? dvt.KeyboardEvent.RIGHT_ARROW : dvt.KeyboardEvent.LEFT_ARROW:
          taskIndex = taskObjs.map(function (t) {
            return t['node'];
          }).indexOf(currentNavigable);

          if (taskIndex == taskObjs.length - 1) {
            // go to the first task of the next row
            if (rowIndex < rowObjs.length - 1) {
              // find the next row with task
              return DvtGanttKeyboardHandler._findNextTask(gantt, rowObjs, rowObjs[rowIndex + 1], rowIndex + 1, currentNavigable);
            }
          } else {
            var taskObj = taskObjs[taskIndex + 1];
            gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
            return taskObj['node'];
          }

          break;

        case dvt.KeyboardEvent.UP_ARROW:
          if (rowIndex > 0) {
            currentNavigable = DvtGanttKeyboardHandler._findPreviousTask(gantt, rowObjs, rowObjs[rowIndex - 1], rowIndex - 1, currentNavigable);

            if (currentNavigable != null) {
              // returns the first task of the previous row
              var taskObj = currentNavigable.getRowNode().getTaskObjs()[0];
              gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
              return taskObj['node'];
            }
          }

          break;

        case dvt.KeyboardEvent.DOWN_ARROW:
          if (rowIndex < rowObjs.length - 1) {
            currentNavigable = DvtGanttKeyboardHandler._findNextTask(gantt, rowObjs, rowObjs[rowIndex + 1], rowIndex + 1, currentNavigable);

            if (currentNavigable != null) {
              // returns the first task of the next row
              var taskObj = currentNavigable.getRowNode().getTaskObjs()[0];
              gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
              return taskObj['node'];
            }
          }

          break;
      }

      return currentNavigable;
    }

    return null;
  };
  /**
   * Whether this is a navigation event.  Override base class to include alt + > and <
   * @param {object} event
   * @return {boolean} whether it is a navigation event
   * @override
   */


  DvtGanttKeyboardHandler.prototype.isNavigationEvent = function (event) {
    var retVal = false;

    switch (event.keyCode) {
      case dvt.KeyboardEvent.OPEN_ANGLED_BRACKET:
      case dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET:
        retVal = event.altKey ? true : false;
        break;

      default:
        retVal = DvtGanttKeyboardHandler.superclass.isNavigationEvent.call(this, event);
    }

    return retVal;
  };
  /**
   * Calculate the distance (basically time duration in millis) between predecessor and successor
   * @param {DvtGanttDependencyNode} dep
   * @return {number} distance between predecessor and successor
   * @private
   */


  DvtGanttKeyboardHandler.prototype._getDistance = function (dep) {
    var type = dep.getValue('type');
    var predecessor = dep.getPredecessorNode();
    var successor = dep.getSuccessorNode();
    var date1 = type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.START_FINISH ? predecessor.getValue('start') : predecessor.getValue('end');
    if (type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.FINISH_START) var date2 = successor.getValue('start');else date2 = successor.getValue('end');
    return Math.abs(date2 - date1);
  };
  /**
   * Get function that compares two link around a given node
   * The dependency lines are analyzed by distance from the node, which is derieved based on start and end time of the predeccessor and successor
   * @return {function} a function that compares to dependency lines around the node
   * @private
   */


  DvtGanttKeyboardHandler.prototype._getDependencyComparator = function () {
    var self = this;

    var comparator = function comparator(dep1, dep2) {
      var distance1 = self._getDistance(dep1);

      var distance2 = self._getDistance(dep2);

      if (distance1 < distance2) return -1;else if (distance1 > distance2) return 1;else return 0;
    };

    return comparator;
  };
  /**
   * Get first navigable dependency line
   * @param {DvtGanttTaskNode} task task for which dependency lines are analyzed
   * @param {dvt.KeyboardEvent} event keyboard event
   * @param {array} listOfLines array of lines for the task
   * @return {DvtGanttDependencyNode} first navigable dependency line
   */


  DvtGanttKeyboardHandler.prototype.getFirstNavigableDependencyLine = function (task, event, listOfLines) {
    var ctx = this._gantt.getCtx();

    var direction = event.keyCode;
    if (!listOfLines || listOfLines.length < 1 || !task) return null;
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var first = null;
    var min = 0;

    for (var i = 0; i < listOfLines.length; i++) {
      var dependencyLine = listOfLines[i];
      if (direction == dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET) var taskToCompare = isRTL ? dependencyLine.getValue('predecessorTaskId') : dependencyLine.getValue('successorTaskId');else taskToCompare = isRTL ? dependencyLine.getValue('successorTaskId') : dependencyLine.getValue('predecessorTaskId'); // sanity check...

      if (dvt.Obj.compareValues(ctx, task.getId(), taskToCompare)) continue;

      var dist = this._getDistance(dependencyLine);

      if (first == null || dist < min) {
        min = dist;
        first = dependencyLine;
      }
    }

    return first;
  };
  /**
   * Get next navigable dependency line.
   * The decision is made based on distance between end points of tasks (start or end based on dependency type).
   * @param {DvtGanttTaskNode} task the task for which dependency lines are analyzed
   * @param {DvtGanttDependencyNode} currentDependencyLine the dependency line in focus
   * @param {dvt.KeyboardEvent} event the keyboard event
   * @param {array} listOfLines the array of dependency lines for the node
   * @return {DvtGanttDependencyNode} next navigable dependency line
   */


  DvtGanttKeyboardHandler.prototype.getNextNavigableDependencyLine = function (task, currentDependencyLine, event, listOfLines) {
    if (!listOfLines) return null;
    if (!currentDependencyLine) return listOfLines[0];
    if (!task) return currentDependencyLine;
    listOfLines.sort(this._getDependencyComparator());
    var bForward = event.keyCode == dvt.KeyboardEvent.DOWN_ARROW ? true : false;
    var index = 0;

    for (var i = 0; i < listOfLines.length; i++) {
      var dependencyLine = listOfLines[i];

      if (dependencyLine === currentDependencyLine) {
        if (bForward) index = i == listOfLines.length - 1 ? 0 : i + 1;else index = i == 0 ? listOfLines.length - 1 : i - 1;
        break;
      }
    }

    return listOfLines[index];
  };
  /**
   * Whether keyboard event equates to initializing High level DnD Move
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to move initiation
   */


  DvtGanttKeyboardHandler.prototype.isMoveInitiationEvent = function (event) {
    return event.keyCode === dvt.KeyboardEvent.M && event.ctrlKey;
  };
  /**
   * Whether keyboard event equates to initializing High level Start Resize
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to start resize initiation
   */


  DvtGanttKeyboardHandler.prototype.isResizeStartInitiationEvent = function (event) {
    return event.keyCode === 83 && event.altKey; // alt + s
  };
  /**
   * Whether keyboard event equates to initializing High level End Resize
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to end resize initiation
   */


  DvtGanttKeyboardHandler.prototype.isResizeEndInitiationEvent = function (event) {
    return event.keyCode === 69 && event.altKey; // alt + e
  };
  /**
   * Whether keyboard event equates to increasing navigation time scale during High level DnD interactivity
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to increasing navigation time scale
   */


  DvtGanttKeyboardHandler.prototype.isDnDScaleUpEvent = function (event) {
    return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.PAGE_UP;
  };
  /**
   * Whether keyboard event equates to decreasing navigation time scale during High level DnD interactivity
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to decreasing navigation time scale
   */


  DvtGanttKeyboardHandler.prototype.isDnDScaleDownEvent = function (event) {
    return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.PAGE_DOWN;
  };
  /**
   * Whether keyboard event equates to moving forward a unit of time scale during High level DnD interactivity
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to moving forward a unit of time scale
   */


  DvtGanttKeyboardHandler.prototype.isDnDForwardEvent = function (event) {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    return this._eventManager.getKeyboardDnDMode() && event.keyCode === (isRTL ? dvt.KeyboardEvent.LEFT_ARROW : dvt.KeyboardEvent.RIGHT_ARROW);
  };
  /**
   * Whether keyboard event equates to moving backward a unit of time scale during High level DnD interactivity
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to moving backward a unit of time scale
   */


  DvtGanttKeyboardHandler.prototype.isDnDBackwardEvent = function (event) {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    return this._eventManager.getKeyboardDnDMode() && event.keyCode === (isRTL ? dvt.KeyboardEvent.RIGHT_ARROW : dvt.KeyboardEvent.LEFT_ARROW);
  };
  /**
   * Whether keyboard event equates to moving up a row during High level DnD Move
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to moving up a row during move
   */


  DvtGanttKeyboardHandler.prototype.isMoveRowAboveEvent = function (event) {
    return this._eventManager.getKeyboardDnDMode() === DvtGanttEventManager.KEYBOARD_MOVE && event.keyCode === dvt.KeyboardEvent.UP_ARROW;
  };
  /**
   * Whether keyboard event equates to moving down a row during High level DnD Move
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to moving down a row during move
   */


  DvtGanttKeyboardHandler.prototype.isMoveRowBelowEvent = function (event) {
    return this._eventManager.getKeyboardDnDMode() === DvtGanttEventManager.KEYBOARD_MOVE && event.keyCode === dvt.KeyboardEvent.DOWN_ARROW;
  };
  /**
   * Whether keyboard event equates to finalizing High level DnD interactivity
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to finalizing a drop
   */


  DvtGanttKeyboardHandler.prototype.isDnDFinalizeEvent = function (event) {
    return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.ENTER;
  };
  /**
   * Whether keyboard event equates to cancelling a (high level) DnD dragging operation (dragging via keyboard)
   * Note that the cancelling a DnD drag (dragging via mouse) via keyboard Esc is detected in dragEnd event instead of
   * through keyboard events, which are not fired.
   * @param {dvt.KeyboardEvent} event keyboard event
   * @return {boolean} whether key strokes equate to cancelling a move
   */


  DvtGanttKeyboardHandler.prototype.isDnDCancelEvent = function (event) {
    return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.ESCAPE;
  };
  /**
   * @override
   */


  DvtGanttKeyboardHandler.prototype.processKeyDown = function (event) {
    var keyCode = event.keyCode;

    if (keyCode == dvt.KeyboardEvent.TAB) {
      var currentNavigable = this._eventManager.getFocus();

      if (currentNavigable) {
        dvt.EventManager.consumeEvent(event);
        return currentNavigable;
      } else {
        // navigate to the default: the first task of the first nonempty row
        var rowObjs = this._gantt.getRowLayoutObjs();

        for (var i = 0; i < rowObjs.length; i++) {
          var rowObj = rowObjs[i];
          var taskObjs = rowObj['taskObjs'];

          if (taskObjs.length > 0) {
            dvt.EventManager.consumeEvent(event);
            var firstTaskObj = taskObjs[0];

            this._gantt.getDataLayoutManager().ensureInDOM(firstTaskObj, 'task');

            return firstTaskObj['node'];
          }
        }
      }
    }

    if (this.isMoveInitiationEvent(event)) {
      var currentNavigable = this._eventManager.getFocus();

      if (currentNavigable && this._gantt.isTaskMoveEnabled() && !this._eventManager.isDnDDragging()) {
        this._eventManager.handleKeyboardMoveInitiation(event, currentNavigable);

        dvt.EventManager.consumeEvent(event);
        return null;
      }
    }

    if (this.isResizeStartInitiationEvent(event)) {
      var currentNavigable = this._eventManager.getFocus();

      if (currentNavigable && this._gantt.isTaskResizeEnabled() && !this._eventManager.isDnDDragging()) {
        this._eventManager.handleKeyboardResizeStartInitiation(event, currentNavigable);

        dvt.EventManager.consumeEvent(event);
        return null;
      }
    }

    if (this.isResizeEndInitiationEvent(event)) {
      var currentNavigable = this._eventManager.getFocus();

      if (currentNavigable && this._gantt.isTaskResizeEnabled() && !this._eventManager.isDnDDragging()) {
        this._eventManager.handleKeyboardResizeEndInitiation(event, currentNavigable);

        dvt.EventManager.consumeEvent(event);
        return null;
      }
    }

    if (this.isDnDCancelEvent(event)) {
      this._eventManager.handleKeyboardDnDCancel();

      dvt.EventManager.consumeEvent(event);
      return null;
    }

    if (this.isDnDScaleUpEvent(event)) {
      this._eventManager.handleKeyboardDnDScaleUp(event);

      dvt.EventManager.consumeEvent(event);
      return null;
    }

    if (this.isDnDScaleDownEvent(event)) {
      this._eventManager.handleKeyboardDnDScaleDown(event);

      dvt.EventManager.consumeEvent(event);
      return null;
    }

    if (this.isDnDForwardEvent(event)) {
      this._eventManager.handleKeyboardDnDForward(event);

      dvt.EventManager.consumeEvent(event);
      return null;
    }

    if (this.isDnDBackwardEvent(event)) {
      this._eventManager.handleKeyboardDnDBackward(event);

      dvt.EventManager.consumeEvent(event);
      return null;
    }

    if (this.isMoveRowAboveEvent(event)) {
      this._eventManager.handleKeyboardMoveRowAbove(event);

      dvt.EventManager.consumeEvent(event);
      return null;
    }

    if (this.isMoveRowBelowEvent(event)) {
      this._eventManager.handleKeyboardMoveRowBelow(event);

      dvt.EventManager.consumeEvent(event);
      return null;
    }

    if (this.isDnDFinalizeEvent(event)) {
      this._eventManager.handleKeyboardDnDFinalize(event);

      dvt.EventManager.consumeEvent(event);
      return null;
    } // Expand/collapse row
    // Note: Won't conflict with multiselect (ctrl + space) because that's normally handled in superclass method below.


    if (keyCode == dvt.KeyboardEvent.SPACE && event.ctrlKey && event.shiftKey) {
      var currentNavigable = this._eventManager.getFocus();

      if (currentNavigable && currentNavigable instanceof DvtGanttTaskNode) {
        dvt.EventManager.consumeEvent(event);

        this._eventManager.toggleRowExpandCollapse(event, currentNavigable.getLayoutObject()['rowObj']);

        return null;
      }
    }

    return DvtGanttKeyboardHandler.superclass.processKeyDown.call(this, event);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Gantt JSON Parser
   * @class
   * @constructor
   * @extends {dvt.Obj}
   */


  var DvtGanttParser = function DvtGanttParser() {};

  dvt.Obj.createSubclass(DvtGanttParser, dvt.Obj);
  /**
   * Parses the specified XML String and returns the root node of the gantt
   * @param {string} options The String containing XML describing the component.
   * @return {object} An object containing the parsed properties
   */

  DvtGanttParser.prototype.parse = function (options) {
    var ret = new Object();

    var parseDateOption = function parseDateOption(key) {
      var optionType = _typeof(options[key]); // Ensures date option is of type number or string,
      // e.g. excludes Date object type
      // TODO: Remove number type support after complete
      // deprecation in future release


      if (optionType === 'number' || optionType === 'string') {
        var time = new Date(options[key]).getTime();
        if (!isNaN(time)) return time;
      }

      return null;
    };

    ret.start = parseDateOption('start');
    ret.end = parseDateOption('end');
    if (options['viewportStart']) ret.viewStart = parseDateOption('viewportStart');
    if (options['viewportEnd']) ret.viewEnd = parseDateOption('viewportEnd');
    ret.rows = options['rows'];
    ret.dependencies = options['dependencies'];
    ret.axisPosition = 'top';
    if (options['axisPosition'] != null) ret.axisPosition = options['axisPosition'];
    ret.selectionMode = 'none';
    if (options['selectionMode'] != null) ret.selectionMode = options['selectionMode'];
    ret.horizontalGridline = 'hidden';
    ret.verticalGridline = 'hidden';

    if (options['gridlines'] != null) {
      if (options['gridlines']['horizontal'] != null) ret.horizontalGridline = options['gridlines']['horizontal'];
      if (options['gridlines']['vertical'] != null) ret.verticalGridline = options['gridlines']['vertical'];
    }

    ret.xScrollbar = 'off';
    ret.yScrollbar = 'off';

    if (options['scrollbars']) {
      if (options['scrollbars']['horizontal']) ret.xScrollbar = options['scrollbars']['horizontal'];
      if (options['scrollbars']['vertical']) ret.yScrollbar = options['scrollbars']['vertical'];
    }

    ret.isIRAnimationEnabled = options['animationOnDisplay'] == 'auto';
    ret.isDCAnimationEnabled = options['animationOnDataChange'] == 'auto';

    if (options['rowAxis'] != null) {
      ret.rowAxisRendered = options['rowAxis']['rendered'];
      ret.rowAxisWidth = options['rowAxis']['width'];
      ret.rowAxisMaxWidth = options['rowAxis']['maxWidth'];
    }

    ret.referenceObjects = options['referenceObjects'];
    ret.styleClass = options['className'];
    ret.inlineStyle = options['style'];
    return ret;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Renderer for dvt.Gantt.
   * @class
   */


  var DvtGanttRenderer = {};
  dvt.Obj.createSubclass(DvtGanttRenderer, dvt.Obj);
  /**
   * Renders the Gantt.
   * @param {dvt.Gantt} gantt The Gantt chart being rendered.
   */

  DvtGanttRenderer.renderGantt = function (gantt) {
    DvtGanttRenderer._renderBackground(gantt);

    DvtGanttRenderer._renderScrollableCanvas(gantt); // Prepare initial render animation


    gantt.getAnimationManager().preAnimateGanttIR(gantt); // remove any empty text first if present

    gantt.removeEmptyText();

    if (gantt.hasValidOptions()) {
      DvtGanttRenderer._prepareTaskFillFilters(gantt);

      gantt.renderTimeZoomCanvas(gantt._canvas);
      var timeZoomCanvas = gantt.getTimeZoomCanvas();

      DvtGanttRenderer._renderAxes(gantt, timeZoomCanvas);

      DvtGanttRenderer._renderDatabodyBackground(gantt, timeZoomCanvas);

      DvtGanttRenderer._renderVerticalGridline(gantt, timeZoomCanvas);

      if (gantt.isRowAxisEnabled()) gantt.getRowAxis().adjustPosition();

      DvtGanttRenderer._renderData(gantt, timeZoomCanvas);

      DvtGanttRenderer._renderReferenceObjects(gantt, timeZoomCanvas);

      DvtGanttRenderer._renderZoomControls(gantt); // Render DnD affordances container on the very top of the chart area.


      if (gantt.isDndEnabled()) DvtGanttRenderer._renderDnDArtifactsContainer(gantt, timeZoomCanvas); // In the case where this render call happened to update view due to expand/collapse via keyboard shortcut on a task,
      // we need to refresh the task's aria-label so that screenreaders read the correct label out.
      // For now, renderState is only non-null for expand/collapse case.

      if (gantt.getRenderState() != null) {
        var currentNavigable = gantt.getEventManager().getFocus();

        if (currentNavigable && currentNavigable instanceof DvtGanttTaskNode) {
          currentNavigable.refreshAriaLabel();
        }
      } // Initial Selection


      gantt._processInitialSelections();

      if (gantt.isTimeDirScrollbarOn() || gantt.isContentDirScrollbarOn()) DvtGanttRenderer._renderScrollbars(gantt, gantt);
      gantt.setIsLastRenderValid(true);
    } else {
      DvtGanttRenderer._renderEmptyText(gantt);

      gantt.setIsLastRenderValid(false);
    }
  };
  /**
   * Adds the feColorMatrix filters (used for task shape/progress/variance etc fill overlays)
   * to the page's shared defs if they don't exist already (so that multiple gantts on a page can share them).
   * @param {dvt.Gantt} gantt The gantt being rendered.
   * @private
   */


  DvtGanttRenderer._prepareTaskFillFilters = function (gantt) {
    if (!document.getElementById(DvtGanttStyleUtils.getTaskTintFilterId())) {
      // overlay fill with rgba(255, 255, 255, tintAlpha);
      var tintAlpha = DvtGanttStyleUtils.getTaskTintAlpha();
      var taskTintFilter = dvt.SvgShapeUtils.createElement('filter', DvtGanttStyleUtils.getTaskTintFilterId());
      var taskTintColorMatrix = dvt.SvgShapeUtils.createElement('feColorMatrix');
      taskTintColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
      taskTintColorMatrix.setAttribute('type', 'matrix');
      taskTintColorMatrix.setAttribute('values', 1 - tintAlpha + ' 0 0 0 ' + tintAlpha + ' 0 ' + (1 - tintAlpha) + ' 0 0 ' + tintAlpha + ' 0 0 ' + (1 - tintAlpha) + ' 0 ' + tintAlpha + ' 0 0 0 1 0');
      taskTintFilter.appendChild(taskTintColorMatrix); // overlay fill with rgba(0, 0, 0, shadeAlpha);

      var shadeAlpha = DvtGanttStyleUtils.getTaskShadeAlpha();
      var taskShadeFilter = dvt.SvgShapeUtils.createElement('filter', DvtGanttStyleUtils.getTaskShadeFilterId());
      var taskShadeColorMatrix = dvt.SvgShapeUtils.createElement('feColorMatrix');
      taskShadeColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
      taskShadeColorMatrix.setAttribute('type', 'matrix');
      taskShadeColorMatrix.setAttribute('values', 1 - shadeAlpha + ' 0 0 0 0' + ' 0 ' + (1 - shadeAlpha) + ' 0 0 0' + ' 0 0 ' + (1 - shadeAlpha) + ' 0 0' + ' 0 0 0 1 0');
      taskShadeFilter.appendChild(taskShadeColorMatrix); // Add the filters to the shared defs

      gantt.appendSharedDefs(taskTintFilter);
      gantt.appendSharedDefs(taskShadeFilter);
    }
  };
  /**
   * Prepares the time direction scrollbar for rendering.
   * @param {dvt.Gantt} gantt The gantt being rendered.
   * @param {dvt.Container} container The container to render into.
   * @param {dvt.Rectangle} availSpace The available space.
   * @return {dvt.Dimension} The dimension of the scrollbar.
   * @private
   */


  DvtGanttRenderer._prerenderTimeDirScrollbar = function (gantt, container, availSpace) {
    var width = availSpace.w;
    var height = dvt.CSSStyle.toNumber(gantt.timeDirScrollbarStyles.getHeight());
    gantt.setTimeDirScrollbar(new dvt.SimpleScrollbar(gantt.getCtx(), gantt.HandleEvent, gantt));
    container.addChild(gantt.timeDirScrollbar);
    dvt.LayoutUtils.position(availSpace, 'bottom', gantt.timeDirScrollbar, width, height, 0);
    return new dvt.Dimension(width, height);
  };
  /**
   * Prepares the content direction scrollbar for rendering.
   * @param {dvt.Gantt} gantt The gantt being rendered.
   * @param {dvt.Container} container The container to render into.
   * @param {dvt.Rectangle} availSpace The available space.
   * @return {dvt.Dimension} The dimension of the scrollbar.
   * @private
   */


  DvtGanttRenderer._prerenderContentDirScrollbar = function (gantt, container, availSpace) {
    var width = dvt.CSSStyle.toNumber(gantt.contentDirScrollbarStyles.getWidth());
    var height = availSpace.h;
    gantt.setContentDirScrollbar(new dvt.SimpleScrollbar(gantt.getCtx(), gantt.HandleEvent, gantt));
    container.addChild(gantt.contentDirScrollbar);
    dvt.LayoutUtils.position(availSpace, dvt.Agent.isRightToLeft(gantt.getCtx()) ? 'left' : 'right', gantt.contentDirScrollbar, width, height, 0);
    return new dvt.Dimension(width, height);
  };
  /**
   * Renders the scrollbars.
   * @param {dvt.Gantt} gantt The gantt being rendered.
   * @param {dvt.Container} container The container to render into
   * @private
   */


  DvtGanttRenderer._renderScrollbars = function (gantt, container) {
    var databody = gantt.getDatabody();

    if (databody == null) {
      // Remove any previously rendered scrollbars
      if (gantt._scrollbarsCanvas != null) gantt._scrollbarsCanvas.removeChildren();
      return;
    }

    var databodyStart = gantt.getDatabodyStart();
    var context = gantt.getCtx();
    var scrollbarPadding = gantt.getScrollbarPadding();

    if (gantt._scrollbarsCanvas == null) {
      gantt._scrollbarsCanvas = new dvt.Container(context, 'sbCanvas');
      container.addChild(gantt._scrollbarsCanvas);
    } else gantt._scrollbarsCanvas.removeChildren();

    if (gantt.isTimeDirScrollbarOn()) {
      var availSpaceWidth = gantt.getCanvasLength();
      var availSpaceHeight = gantt.Height - scrollbarPadding;

      var timeDirScrollbarDim = DvtGanttRenderer._prerenderTimeDirScrollbar(gantt, gantt._scrollbarsCanvas, new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight));
    }

    if (gantt.isContentDirScrollbarOn()) {
      availSpaceWidth = gantt.Width - scrollbarPadding;
      availSpaceHeight = gantt.getCanvasSize() - gantt.getAxesHeight();
      var scrollbarXOffset = dvt.Agent.isRightToLeft(gantt.getCtx()) ? gantt.getScrollbarPadding() : 0;

      var contentDirScrollbarDim = DvtGanttRenderer._prerenderContentDirScrollbar(gantt, gantt._scrollbarsCanvas, new dvt.Rectangle(scrollbarXOffset, 0, availSpaceWidth - scrollbarXOffset, availSpaceHeight));
    }

    if (gantt.timeDirScrollbar) {
      var sbOptions = {};
      sbOptions['color'] = gantt.timeDirScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
      sbOptions['backgroundColor'] = gantt.timeDirScrollbarStyles.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
      sbOptions['min'] = gantt._start;
      sbOptions['max'] = gantt._end;
      sbOptions['isHorizontal'] = true;
      sbOptions['isReversed'] = dvt.Agent.isRightToLeft(gantt.getCtx());
      gantt.timeDirScrollbar.setTranslateX(gantt.getStartXOffset());
      gantt.timeDirScrollbar.render(sbOptions, timeDirScrollbarDim.w, timeDirScrollbarDim.h);
      gantt.timeDirScrollbar.setViewportRange(gantt._viewStartTime, gantt._viewEndTime);
    }

    if (gantt.contentDirScrollbar) {
      sbOptions = {};
      sbOptions['color'] = gantt.contentDirScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
      sbOptions['backgroundColor'] = gantt.contentDirScrollbarStyles.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
      sbOptions['min'] = -(Math.max(gantt.getContentHeight(), contentDirScrollbarDim.h) - databodyStart);
      sbOptions['max'] = databodyStart;
      sbOptions['isHorizontal'] = false;
      sbOptions['isReversed'] = true;
      gantt.contentDirScrollbar.setTranslateY(databodyStart + gantt.getStartYOffset());
      gantt.contentDirScrollbar.render(sbOptions, contentDirScrollbarDim.w, contentDirScrollbarDim.h);
      var bottomOffset = 0;
      if (gantt.getAxisPosition() == 'bottom') bottomOffset = gantt.getAxesHeight();
      gantt.contentDirScrollbar.setViewportRange(databody.getTranslateY() - (gantt.getCanvasSize() - databodyStart - bottomOffset), databody.getTranslateY());
    }
  };
  /**
   * Renders the row axis.
   * @param {dvt.Gantt} gantt The Gantt being rendered.
   * @param {dvt.Container=} container The container to render the row axis into. null on resize case.
   */


  DvtGanttRenderer.renderRowAxis = function (gantt, container) {
    var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
    var rowAxis = gantt.getRowAxis();

    if (gantt.isRowAxisEnabled()) {
      if (!rowAxis) {
        rowAxis = new DvtGanttRowAxis(gantt);
        rowAxis.setPixelHinting(true);
        gantt.setRowAxis(rowAxis);
      }

      if (container) // null on resize case
        container.addChild(rowAxis); // render and figure out width

      rowAxis.render(gantt.Width - DvtGanttStyleUtils.getRowAxisGap(), container == null);
      var rowAxisWidth = rowAxis.getWidth();
      var rowAxisSpace = rowAxisWidth > 0 ? rowAxisWidth + DvtGanttStyleUtils.getRowAxisGap() : 0;
      gantt._backgroundWidth = gantt._backgroundWidth - rowAxisSpace;

      if (!isRTL) {
        gantt._widthOffset = gantt._widthOffset + rowAxisSpace;
        gantt.setStartXOffset(gantt.getStartXOffset() + rowAxisSpace);
      }

      gantt._canvasLength = gantt._canvasLength - rowAxisSpace;
    } else {
      // potentially rerender with rowAxis.rendered off when on before.
      if (container) container.removeChild(rowAxis);
      gantt.setRowAxis(null);
    }
  };
  /**
   * Renders the background of Gantt.
   * @param {dvt.Gantt} gantt The Gantt being rendered.
   * @private
   */


  DvtGanttRenderer._renderBackground = function (gantt) {
    var width = gantt._backgroundWidth;
    var height = gantt._backgroundHeight;

    if (gantt._background) {
      gantt._background.setClipPath(null);

      gantt._background.setWidth(width);

      gantt._background.setHeight(height);

      gantt._background.setX(gantt._widthOffset);
    } else gantt._background = new dvt.Rect(gantt.getCtx(), gantt._widthOffset, 0, width, height, 'bg'); // Override specified border with double border to fix stroke rendering:
    // If stroke-width is 1px, then there is 0.5px border on each side of the edge, and because svg is
    // not pixel aware, in cases where the edge is between two pixels (e.g. on resize), the 0.5px doesn't show up, and the
    // entire stroke disappear. Fix is to double up the pixel so there there is always > 0.5px on each side of the edge
    // and use a clippath to hide the inner half of the stroke to maintain stroke width.


    gantt._background.SetSvgProperty('style', 'stroke-width:' + gantt.getBorderWidth() * 2 + 'px');

    gantt._background.setClassName(gantt.GetStyleClass('databody'));

    gantt._background.setPixelHinting(true);

    var cp = new dvt.ClipPath();
    cp.addRect(gantt._widthOffset, 0, width, height);

    gantt._background.setClipPath(cp);

    if (gantt._background.getParent() != gantt) gantt.addChild(gantt._background);
  };
  /**
   * Renders the container for row backgrounds; this separate container is necessary to ensure correct layering.
   * This container would be placed behind vertical gridlines, and other row contents (e.g. tasks)
   * would be placed above the vertical gridlines.
   * @param {dvt.Gantt} gantt The gantt component.
   * @param {dvt.Container=} container The container to render the background container into.
   * @private
   */


  DvtGanttRenderer._renderDatabodyBackground = function (gantt, container) {
    var databodyBackground = gantt.getDatabodyBackground();

    if (databodyBackground == null) {
      databodyBackground = new dvt.Container(gantt.getCtx());
      container.addChild(databodyBackground);
      gantt.setDatabodyBackground(databodyBackground);
    }

    if (gantt.getDatabody() == null) {
      // Initial state: honor scroll position
      databodyBackground.setTranslateY(gantt.scrollPositionToTranslateY(gantt.getOptions()['scrollPosition']));
    }

    var cp = new dvt.ClipPath();
    cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
    databodyBackground.setClipPath(cp);
  };
  /**
   * Renders the container DnD affordances. This container should be layered on top of all chart area elements.
   * @param {dvt.Gantt} gantt The gantt component.
   * @param {dvt.Container=} container The container to render into.
   * @private
   */


  DvtGanttRenderer._renderDnDArtifactsContainer = function (gantt, container) {
    var databody = gantt.getDatabody();

    if (databody) // don't bother in the no data case -- there's nothing to drag and drop
      {
        var artifactsContainer = gantt.getDnDArtifactsContainer();

        if (artifactsContainer == null) {
          artifactsContainer = new dvt.Container(gantt.getCtx());
          gantt.setDnDArtifactsContainer(artifactsContainer); // Initial state: sync with databody's initial state

          artifactsContainer.setTranslateY(databody.getTranslateY());
        }

        container.addChild(artifactsContainer); // ensure topmost layering even on rerender

        var cp = new dvt.ClipPath();
        cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
        artifactsContainer.setClipPath(cp);
      }
  };
  /**
   * Renders the scrollable canvas of the Gantt chart.
   * @param {dvt.Gantt} gantt The gantt being rendered.
   * @private
   */


  DvtGanttRenderer._renderScrollableCanvas = function (gantt) {
    if (gantt._canvas) return;
    gantt._canvas = new dvt.Container(gantt.getCtx(), 'canvas');
    gantt.addChild(gantt._canvas);
  };
  /**
   * Renders the time axis of a Gantt chart.
   * @param {dvt.Gantt} gantt The Gantt chart being rendered.
   * @param {dvt.Container} container The container to render into.
   * @private
   */


  DvtGanttRenderer._renderAxes = function (gantt, container) {
    var majorAxis = gantt.getMajorAxis();
    var minorAxis = gantt.getMinorAxis();
    var axisPosition = gantt.getAxisPosition();
    var majorAxisOptions = gantt.getOptions()['majorAxis'];
    var minorAxisOptions = gantt.getOptions()['minorAxis'];

    if (axisPosition == 'top') {
      var axisStart = 0;

      if (majorAxis) {
        DvtGanttRenderer._renderAxis(gantt, container, majorAxis, axisStart, gantt.getAxisHeight(majorAxisOptions));

        axisStart = axisStart + majorAxis.getSize();
      }

      if (minorAxis) {
        DvtGanttRenderer._renderAxis(gantt, container, minorAxis, axisStart, gantt.getAxisHeight(minorAxisOptions));

        axisStart = axisStart + minorAxis.getSize();
      }

      gantt.setDatabodyStart(axisStart);
    } else {
      axisStart = gantt._canvasSize;

      if (majorAxis) {
        // _renderAxis needs to be called before calling timeAxis.getSize:
        DvtGanttRenderer._renderAxis(gantt, container, majorAxis, null, gantt.getAxisHeight(majorAxisOptions));

        axisStart = axisStart - majorAxis.getSize();

        DvtGanttRenderer._positionAxis(majorAxis, axisStart);
      }

      if (minorAxis) {
        // _renderAxis needs to be called before calling timeAxis.getSize:
        DvtGanttRenderer._renderAxis(gantt, container, minorAxis, axisStart, gantt.getAxisHeight(minorAxisOptions));

        axisStart = axisStart - minorAxis.getSize();

        DvtGanttRenderer._positionAxis(minorAxis, axisStart);
      }

      gantt.setDatabodyStart(0);
    }
  };
  /**
   * Renders time axis.
   * @param {dvt.Gantt} gantt The gantt
   * @param {dvt.Container} container The container to render into
   * @param {dvt.TimeAxis} timeAxis The time axis
   * @param {number} axisStart The start y position to render.
   * @param {number} axisSize The size of the axis.
   * @private
   */


  DvtGanttRenderer._renderAxis = function (gantt, container, timeAxis, axisStart, axisSize) {
    if (timeAxis.getParent() !== container) container.addChild(timeAxis);
    timeAxis.render(null, gantt.getContentLength(), axisSize);
    if (axisStart != null) DvtGanttRenderer._positionAxis(timeAxis, axisStart);
  };
  /**
   * Positions the given time axis
   * @param {dvt.TimeAxis} timeAxis The time axis
   * @param {number} axisStart The y position the axis should be positioned to.
   * @private
   */


  DvtGanttRenderer._positionAxis = function (timeAxis, axisStart) {
    var posMatrix = new dvt.Matrix(1, 0, 0, 1, 0, axisStart);
    timeAxis.setMatrix(posMatrix);
  };
  /**
   * Renders the zoom controls of a gantt.
   * @param {dvt.Gantt} gantt The gantt being rendered.
   * @private
   */


  DvtGanttRenderer._renderZoomControls = function (gantt) {
    var context = gantt.getCtx();
    var resources = gantt._resources;
    var isRTL = dvt.Agent.isRightToLeft(context);
    var zoomControlProperties = {
      'zoomInProps': {
        'imageSize': 16,
        'cssUrl': resources['zoomIn'],
        'cssUrlHover': resources['zoomIn_h'],
        'cssUrlActive': resources['zoomIn_a'],
        'cssUrlDisabled': resources['zoomIn_d'],
        'enabledBackgroundColor': DvtGanttStyleUtils.getZoomInButtonBackgroundColor(resources),
        'enabledBorderColor': DvtGanttStyleUtils.getZoomInButtonBorderColor(resources),
        'hoverBackgroundColor': DvtGanttStyleUtils.getZoomInButtonHoverBackgroundColor(resources),
        'hoverBorderColor': DvtGanttStyleUtils.getZoomInButtonHoverBorderColor(resources),
        'activeBackgroundColor': DvtGanttStyleUtils.getZoomInButtonActiveBackgroundColor(resources),
        'activeBorderColor': DvtGanttStyleUtils.getZoomInButtonActiveBorderColor(resources),
        'disabledBackgroundColor': DvtGanttStyleUtils.getZoomInButtonDisabledBackgroundColor(resources),
        'disabledBorderColor': DvtGanttStyleUtils.getZoomInButtonDisabledBorderColor(resources)
      },
      'zoomOutProps': {
        'imageSize': 16,
        'cssUrl': resources['zoomOut'],
        'cssUrlHover': resources['zoomOut_h'],
        'cssUrlActive': resources['zoomOut_a'],
        'cssUrlDisabled': resources['zoomOut_d'],
        'enabledBackgroundColor': DvtGanttStyleUtils.getZoomOutButtonBackgroundColor(resources),
        'enabledBorderColor': DvtGanttStyleUtils.getZoomOutButtonBorderColor(resources),
        'hoverBackgroundColor': DvtGanttStyleUtils.getZoomOutButtonHoverBackgroundColor(resources),
        'hoverBorderColor': DvtGanttStyleUtils.getZoomOutButtonHoverBorderColor(resources),
        'activeBackgroundColor': DvtGanttStyleUtils.getZoomOutButtonActiveBackgroundColor(resources),
        'activeBorderColor': DvtGanttStyleUtils.getZoomOutButtonActiveBorderColor(resources),
        'disabledBackgroundColor': DvtGanttStyleUtils.getZoomOutButtonDisabledBackgroundColor(resources),
        'disabledBorderColor': DvtGanttStyleUtils.getZoomOutButtonDisabledBorderColor(resources)
      }
    };
    if (isRTL) var transX = gantt.getStartXOffset() + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;else transX = gantt.getCanvasLength() + gantt.getStartXOffset() - (DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER);
    zoomControlProperties['zoomInProps']['posX'] = transX;
    zoomControlProperties['zoomOutProps']['posX'] = transX;
    var yOffset = gantt._startY + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;
    if (gantt.getAxisPosition() == 'top') var transY = yOffset;else transY = gantt._backgroundHeight - yOffset;

    if (gantt.getAxisPosition() == 'top') {
      var zoomInPosY = transY;
      var zoomOutPosY = transY + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_SPACING;
    } else {
      zoomInPosY = transY - DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER * 2 - DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_SPACING;
      zoomOutPosY = transY - DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER;
    }

    zoomControlProperties['zoomInProps']['posY'] = zoomInPosY;
    zoomControlProperties['zoomOutProps']['posY'] = zoomOutPosY;
    gantt.renderZoomControls(zoomControlProperties);
  };
  /**
   * Renders the empty text of Gantt.
   * @param {dvt.Gantt} gantt the gantt component.
   * @param {boolean=} noData whether it's the 'no data' case (as opposed to 'invalid data' case). Default false.
   * @private
   */


  DvtGanttRenderer._renderEmptyText = function (gantt, noData) {
    // Get the empty text string
    if (noData) {
      // If there are rows shown (i.e. from previous render), clear them (see )
      var databody = gantt.getDatabody();

      if (databody && databody.getParent()) {
        databody.getParent().removeChild(databody);
        gantt.setDatabody(null);
      }

      gantt.getDataLayoutManager().clear();
      var emptyTextStr = gantt.getOptions().translations.labelNoData;
      gantt.removeEmptyText();
    } else {
      emptyTextStr = gantt.getOptions().translations.labelInvalidData;
      gantt.clearComponent();
    }

    var text = dvt.TextUtils.renderEmptyText(gantt._canvas, emptyTextStr, new dvt.Rectangle(0, 0, gantt._backgroundWidth, gantt._backgroundHeight), gantt.EventManager, null);
    text.setClassName(gantt.GetStyleClass('nodata'));
    gantt.setEmptyText(text);
  };
  /**
   * Renders the databody
   * @param {dvt.Gantt} gantt the gantt component.
   * @param {dvt.Container=} container the container to add the databody to.
   * @private
   */


  DvtGanttRenderer._renderDatabody = function (gantt, container) {
    var databody = gantt.getDatabody();

    if (databody == null) {
      databody = new dvt.Container(gantt.getCtx(), 'db');
      container.addChild(databody);
      gantt.setDatabody(databody); // Initial state: sync with databody background's initial state

      databody.setTranslateY(gantt.getDatabodyBackground().getTranslateY());
    }

    var cp = new dvt.ClipPath();
    cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
    databody.setClipPath(cp); // Note row axis translateY is synced in renderData and continually synced
    // through setDataRegionTranslateY calls
  };
  /**
   * Renders vertical grid lines
   * @param {dvt.Gantt} gantt The Gantt component
   * @param {dvt.Container} container The container to render into.
   * @private
   */


  DvtGanttRenderer._renderVerticalGridline = function (gantt, container) {
    // remove all existing gridlines regardless whether it was visible/hidden
    var gridlines = gantt.getVerticalGridlines();

    if (gridlines != null) {
      gridlines.removeChildren();
    }

    if (gantt.isVerticalGridlinesVisible()) {
      if (gridlines == null) {
        gridlines = new dvt.Container(gantt.getCtx());
        container.addChild(gridlines);
        gantt.setVerticalGridlines(gridlines);
      }

      var gridlineStyleClass = gantt.GetStyleClass('vgridline');
      var timeAxis = gantt.getMajorAxis();
      if (timeAxis == null || gantt.getOptions()['minorGridline']) timeAxis = gantt.getMinorAxis();
      var lines = timeAxis.getElem().getElementsByTagName('line');

      for (var i = 0; i < lines.length; i++) {
        var pos = dvt.ToolkitUtils.getAttrNullNS(lines[i], 'x1');
        var gridLine = new dvt.Line(gantt.getCtx(), pos, gantt.getDatabodyStart(), pos, gantt.getDatabodyStart() + gantt._canvasSize - gantt.getAxesHeight());
        gridLine.setPixelHinting(true);
        gridLine.setClassName(gridlineStyleClass, true);
        gridlines.addChild(gridLine);
      }
    }
  };
  /**
   * Renders referenceObjects
   * @param {dvt.Gantt} gantt The Gantt component
   * @param {dvt.Container} container The container to render into.
   * @private
   */


  DvtGanttRenderer._renderReferenceObjects = function (gantt, container) {
    var context = gantt.getCtx();
    var isRTL = dvt.Agent.isRightToLeft(context);
    var minTime = gantt.getStartTime();
    var maxTime = gantt.getEndTime();
    var width = gantt.getContentLength();
    var referenceObjects = gantt.getReferenceObjects();
    var referenceObjectsContainer = gantt.getReferenceObjectsContainer();
    var renderedReferenceObjects = gantt.getRenderedReferenceObjects();

    if (referenceObjects) {
      var newReferenceObjects = [];
      var maxRefObjects = Math.min(1, referenceObjects.length); // For now, only render first referenceObject

      if (referenceObjectsContainer == null) {
        referenceObjectsContainer = new dvt.Container(context);
        gantt.setReferenceObjectsContainer(referenceObjectsContainer);
        renderedReferenceObjects = [];
      } // Note on rerender, this is called as well, to make sure ref objects are always on top of everything else


      container.addChild(referenceObjectsContainer);

      for (var i = 0; i < maxRefObjects; i++) {
        var referenceObject = referenceObjects[i];

        if (referenceObject) {
          var value = referenceObject['value'];
          var valueTime = new Date(value).getTime(); // value only supports number or string type, e.g. excludes Date object type
          // TODO: Remove number type support after complete deprecation in future release

          if (value != null && !isNaN(valueTime) && (typeof value === 'number' || typeof value === 'string')) {
            var pos = dvt.TimeAxis.getDatePosition(minTime, maxTime, valueTime, width);
            if (isRTL) pos = width - pos; // If old reference objects present in the DOM, reuse them:

            var ref = renderedReferenceObjects.pop();

            if (ref != null) {
              ref.setX1(pos);
              ref.setY1(gantt.getDatabodyStart());
              ref.setX2(pos);
              ref.setY2(gantt.getDatabodyStart() + gantt._canvasSize - gantt.getAxesHeight());
            } else {
              ref = new dvt.Line(gantt.getCtx(), pos, gantt.getDatabodyStart(), pos, gantt.getDatabodyStart() + gantt._canvasSize - gantt.getAxesHeight());
              ref.setPixelHinting(true);
            }

            if (ref.getParent() != referenceObjectsContainer) referenceObjectsContainer.addChild(ref);
            newReferenceObjects.push(ref);
            var inlineStyle = referenceObject['svgStyle'];

            if (inlineStyle) {
              ref.setStyle(inlineStyle); // works if style is object
            }

            var defaultStyleClass = gantt.GetStyleClass('referenceObject');
            var styleClass = referenceObject['svgClassName'];
            if (styleClass) styleClass = defaultStyleClass + ' ' + styleClass;else styleClass = defaultStyleClass;
            ref.setClassName(styleClass, true);
          }
        }
      } // Any remaining old reference objects are removed


      for (var j = 0; j < renderedReferenceObjects.length; j++) {
        var uselessRef = renderedReferenceObjects[j];
        uselessRef.getParent().removeChild(uselessRef);
      }

      gantt.setRenderedReferenceObjects(newReferenceObjects);
    } else {
      // clear any existing reference objects
      if (referenceObjectsContainer) referenceObjectsContainer.removeChildren();
      gantt.setRenderedReferenceObjects([]);
    }
  };
  /**
   * Render data (rows and dependencies)
   * @param {dvt.Gantt} gantt The gantt component
   * @param {dvt.Container} container The container to render into
   * @private
   */


  DvtGanttRenderer._renderData = function (gantt, container) {
    var options = gantt.getOptions();
    var rowObjs = gantt.getRowLayoutObjs();
    var dependencyObjs = gantt.getDependencyLayoutObjs();

    if (rowObjs.length === 0) {
      DvtGanttRenderer._renderEmptyText(gantt, true);

      return;
    }

    DvtGanttRenderer._renderDatabody(gantt, container);

    if (dependencyObjs.length > 0) DvtGanttRenderer._renderDependenciesContainer(gantt, container); // Cache the base task label style dvt.CSSStyle object; it's expensive to instantiate one
    // each time we render a task label.

    if (!gantt.getCache().getFromCache('baseTaskLabelCSSStyle')) gantt.getCache().putToCache('baseTaskLabelCSSStyle', DvtGanttStyleUtils.getTaskLabelStyle(options)); // Ensure the row dependent content containers' translateY is within bounds
    // and render the viewport

    gantt.setDataRegionTranslateY(gantt.getBoundedContentTranslateY(gantt.getDatabody().getTranslateY()));
  };
  /**
   * Render dependency lines container
   * @param {dvt.Gantt} gantt The gantt component
   * @param {dvt.Container} container the parent container for the dependency lines container
   * @private
   */


  DvtGanttRenderer._renderDependenciesContainer = function (gantt, container) {
    var dependenciesContainer = gantt.getDependenciesContainer();

    if (dependenciesContainer == null) {
      dependenciesContainer = new dvt.Container(gantt.getCtx()); // Initial state: sync with databody's initial state

      dependenciesContainer.setTranslateY(gantt.getDatabody().getTranslateY());
      container.addChild(dependenciesContainer);
      gantt.setDependenciesContainer(dependenciesContainer);
      gantt.setDefaultMarkerId(DvtGanttRenderer._createDefaultMarker(gantt));
    }

    var cp = new dvt.ClipPath();
    cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
    dependenciesContainer.setClipPath(cp); // Note that translateY is synced with databody in renderData,
    // and continually synced through setDataRegionTranslateY calls
  };
  /**
   * Create marker element under def
   * @param {DvtGantt} gantt
   * @return {string} the id of the marker element
   * @private
   */


  DvtGanttRenderer._createDefaultMarker = function (gantt) {
    var context = gantt.getCtx();
    var id = dvt.SvgShapeUtils.getUniqueId('mrk');
    var elem = dvt.SvgShapeUtils.createElement('marker', id);
    dvt.ToolkitUtils.setAttrNullNS(elem, 'class', gantt.GetStyleClass('dependencyLineConnector'));
    dvt.ToolkitUtils.setAttrNullNS(elem, 'markerUnits', 'userSpaceOnUse');
    var path = dvt.SvgShapeUtils.createElement('path');
    var width = DvtGanttStyleUtils.getDependencyLineMarkerWidth();
    var height = DvtGanttStyleUtils.getDependencyLineMarkerHeight();
    dvt.ToolkitUtils.setAttrNullNS(elem, 'viewBox', '0 0 ' + width + ' ' + height);
    dvt.ToolkitUtils.setAttrNullNS(elem, 'refX', width);
    dvt.ToolkitUtils.setAttrNullNS(elem, 'refY', height / 2);
    dvt.ToolkitUtils.setAttrNullNS(elem, 'markerWidth', width);
    dvt.ToolkitUtils.setAttrNullNS(elem, 'markerHeight', height);
    dvt.ToolkitUtils.setAttrNullNS(elem, 'orient', 'auto');
    dvt.ToolkitUtils.setAttrNullNS(path, 'd', 'M0,0L' + width + ',' + height / 2 + ',' + '0,' + height + 'V0Z');
    elem.appendChild(path);
    context.appendDefs(elem);
    return id;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class representing a Gantt row axis
   * @param {dvt.Gantt} gantt the Gantt component
   * @class
   * @constructor
   */


  var DvtGanttRowAxis = function DvtGanttRowAxis(gantt) {
    this.Init(gantt);
  };

  dvt.Obj.createSubclass(DvtGanttRowAxis, dvt.Container);
  /**
   * Initialize the row axis
   * @param {dvt.Gantt} gantt the Gantt component
   * @protected
   */

  DvtGanttRowAxis.prototype.Init = function (gantt) {
    DvtGanttRowAxis.superclass.Init.call(this, gantt.getCtx());
    this._gantt = gantt;
  };
  /**
   * Gets the default row label CSSStyle object
   * @param {boolean} useCache Whether to use a cached CSSStyle object or generate a new one
   * @return {dvt.CSSStyle} The default row label CSSStyle object
   */


  DvtGanttRowAxis.prototype.getDefaultRowLabelStyle = function (useCache) {
    var options = this._gantt.getOptions();

    if (!useCache) {
      return DvtGanttStyleUtils.getRowLabelStyle(options);
    }

    if (!this._defaultLabelCSSStyle) {
      this._defaultLabelCSSStyle = DvtGanttStyleUtils.getRowLabelStyle(options);
    }

    return this._defaultLabelCSSStyle;
  };
  /**
   * Gets the CSSStyle object of the label style
   * @param {string|Object} labelStyle The specified label style
   * @return {dvt.CSSStyle} The CSSStyle object
   * @private
   */


  DvtGanttRowAxis.prototype._getCSSStyle = function (labelStyle) {
    if (labelStyle != null && labelStyle !== '' && Object.keys(labelStyle).length !== 0) {
      // need to instantiate a new dvt.CSSStyle object because we're going to modify it
      var customLabelCSSStyle = this.getDefaultRowLabelStyle(false);
      customLabelCSSStyle.parseInlineStyle(labelStyle);
      return customLabelCSSStyle;
    }

    return this.getDefaultRowLabelStyle(true);
  };
  /**
   * Gets the label content type.
   * @return {string} 'custom' if content is from provided custom renderer or 'text' otherwise, derived from the provided row label string.
   */


  DvtGanttRowAxis.prototype.getLabelContentType = function () {
    var options = this._gantt.getOptions()['rowAxis'];

    if (options['label'] && options['label']['renderer']) return 'custom';
    return 'text';
  };
  /**
   * Gets the available width.
   * @param {number} totalAvailWidth The total available width.
   * @return {object} An object containing the max width, width, and calculated width, in px. -1 width means 'max-content'
   * @private
   */


  DvtGanttRowAxis.prototype._getAvailableWidth = function (totalAvailWidth) {
    var maxWidthOption = this._gantt.getRowAxisMaxWidth();

    var widthOption = this._gantt.getRowAxisWidth();

    var maxWidth, widthDemanded;
    if (maxWidthOption != null && maxWidthOption !== 'none') maxWidth = Math.min(DvtGanttStyleUtils.getSizeInPixels(maxWidthOption, totalAvailWidth), totalAvailWidth);
    maxWidth = maxWidth != null && !isNaN(maxWidth) ? maxWidth : totalAvailWidth;
    if (widthOption != null && widthOption !== 'max-content') widthDemanded = DvtGanttStyleUtils.getSizeInPixels(this._gantt.getRowAxisWidth(), totalAvailWidth);
    widthDemanded = widthDemanded != null && !isNaN(widthDemanded) ? widthDemanded : -1;
    return {
      'maxWidth': maxWidth,
      'width': widthDemanded,
      'calculatedWidth': widthDemanded !== -1 ? Math.min(widthDemanded, maxWidth) : maxWidth
    };
  };
  /**
   * Gets the available width object, which contains the max width, width, and calculated width, in px. -1 width means 'max-content'
   * @return {Object} The availableWidth object
   */


  DvtGanttRowAxis.prototype.getAvailableWidth = function () {
    return this._availableWidth;
  };
  /**
   * Gets the width of the row axis.
   * @return {number} the width
   */


  DvtGanttRowAxis.prototype.getWidth = function () {
    return this._width;
  };
  /**
   * Gets the label content indent size
   * @param {Object} rowObj The row's layout object
   * @return {number}
   */


  DvtGanttRowAxis.prototype.getLabelContentIndentSize = function (rowObj) {
    var depth = rowObj['depth'];
    var indentSize = DvtGanttStyleUtils.getRowLabelIndentSize();
    var buttonSize = DvtGanttStyleUtils.getRowLabelButtonSize();
    var gapSize = DvtGanttStyleUtils.getRowLabelButtonContentGapSize();
    return depth * indentSize + buttonSize + gapSize;
  };
  /**
   * Returns the maximum width for text label contents in the specified arrays.
   * Takes into account indent/icon space for expand/collapse.
   * @param {dvt.Context} context
   * @param {array} textStringArray An array of text strings.
   * @param {array} cssStyle Array of styles to be used for the texts
   * @return {Number}
   */


  DvtGanttRowAxis.prototype._getMaxTextContentWidth = function (context, textStringArray, cssStyle) {
    if (!this._gantt.isRowsHierarchical()) {
      return dvt.TextUtils.getMaxTextStringWidth(context, textStringArray, cssStyle);
    } // If hierarchical, take into account space for indents and icon


    var rowObjs = this._gantt.getRowLayoutObjs();

    var maxContentWidth = 0;

    for (var i = 0; i < textStringArray.length; i++) {
      var textString = textStringArray[i] ? textStringArray[i] : '';
      var style = cssStyle[i];
      var textWidth = dvt.TextUtils.getTextStringWidth(context, textString, style); // Leaf with empty string labels--don't account for indent. It looks better.

      var indentSize = rowObjs[i]['expanded'] == null && textString.length == 0 ? 0 : this.getLabelContentIndentSize(rowObjs[i]);
      var contentWidth = indentSize + textWidth;
      if (contentWidth > maxContentWidth) maxContentWidth = contentWidth;
    }

    return maxContentWidth;
  };
  /**
   * Renders the content of the row axis.
   * @param {number} totalAvailWidth The total available width.
   * @param {boolean} isResize Whether this render call is due to component resize.
   */


  DvtGanttRowAxis.prototype.render = function (totalAvailWidth, isResize) {
    this._availableWidth = this._getAvailableWidth(totalAvailWidth);

    if (isResize) {
      if (this._availableWidth['width'] !== -1) this._width = this._availableWidth['calculatedWidth'];
      return;
    } // Note the row axis DOM will be cleared in gantt.renderViewport(), so just need to clear _rowLabelContents


    this._rowLabelContents = [];
    var contentType = this.getLabelContentType();

    var rowObjs = this._gantt.getRowLayoutObjs();

    if (this._availableWidth['width'] === -1) // row axis width determined by content width
      {
        // If text content, cheaply calculate just the width of the biggest text, and defer actual rendering to when rows are rendered
        if (contentType === 'text') {
          var textStringArray = [];
          var cssStyleArray = [];

          for (var i = 0; i < rowObjs.length; i++) {
            var rowData = rowObjs[i]['data'];
            var textString = rowData['label'] != null ? rowData['label'] : '';

            var cssStyle = this._getCSSStyle(rowData['labelStyle']);

            textStringArray.push(textString);
            cssStyleArray.push(cssStyle);

            this._rowLabelContents.push(null);
          }

          this._width = this._getMaxTextContentWidth(this._gantt.getCtx(), textStringArray, cssStyleArray);
        } // If custom content, then we need to render all the contents to determine width to allocate
        else if (contentType === 'custom') {
            this._width = 0;

            for (var i = 0; i < rowObjs.length; i++) {
              var rowObj = rowObjs[i];
              var labelContent = new DvtGanttRowLabelContent(this, contentType);
              labelContent.setRowIndex(i);
              labelContent.render(rowObj);
              this._width = Math.max(this._width, labelContent.getWidth());

              this._rowLabelContents.push(labelContent);
            }
          }
      } else // row axis width is not dependent on content width; defer actual content rendering to when rows are rendered
      {
        this._width = this._availableWidth['calculatedWidth'];

        for (var i = 0; i < rowObjs.length; i++) {
          this._rowLabelContents.push(null);
        }
      } // Make sure allocated width is bounded by maxWidth, and is integer pixels to avoid svg rendering issues


    this._width = Math.ceil(Math.min(this._width, this._availableWidth['maxWidth']));
  };
  /**
   * Gets the array of row label contents
   * @return {array} An array of DvtGanttRowLabelContent objects
   */


  DvtGanttRowAxis.prototype.getRowLabelContents = function () {
    return this._rowLabelContents;
  };
  /**
   * Adjusts the row axis position. Called after databody position is calculated to be in sync.
   */


  DvtGanttRowAxis.prototype.adjustPosition = function () {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var width = this._width;

    var height = this._gantt.getCanvasSize() - this._gantt.getAxesHeight();

    if (isRTL) this.setTranslateX(this._gantt.getStartXOffset() + this._gantt.getCanvasLength() + this._gantt.getBorderWidth() + DvtGanttStyleUtils.getRowAxisGap());else this.setTranslateX(0);
    var cp = new dvt.ClipPath();
    cp.addRect(this.getTranslateX(), this._gantt.getDatabodyStart() + this._gantt.getStartYOffset(), width, height);
    this.setClipPath(cp);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class representing a Gantt row label content (plain text, or custom content from custom renderer)
   * @param {DvtGanttRowAxis} rowAxis The associated row axis container.
   * @param {string} contentType The content type, either 'custom', or 'text'
   * @class
   * @constructor
   */


  var DvtGanttRowLabelContent = function DvtGanttRowLabelContent(rowAxis, contentType) {
    this.Init(rowAxis, contentType);
  };

  dvt.Obj.createSubclass(DvtGanttRowLabelContent, dvt.Obj);
  /**
   * Initialize the row label content.
   * @param {DvtGanttRowAxis} rowAxis The associated row axis container.
   * @param {string} contentType The content type, either 'custom', or 'text'
   * @protected
   */

  DvtGanttRowLabelContent.prototype.Init = function (rowAxis, contentType) {
    this._rowAxis = rowAxis;
    this._gantt = rowAxis._gantt;
    this._contentType = contentType;
  };
  /**
   * Renders the row label content.
   * @param {object} rowObj The associated row data layout object
   */


  DvtGanttRowLabelContent.prototype.render = function (rowObj) {
    var rowData = rowObj['data'];
    this._labelString = rowData['label'] != null ? rowData['label'] : '';
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());

    var availableWidth = this._rowAxis.getAvailableWidth();

    if (!this._content) {
      this._content = this._contentType === 'custom' ? this._getCustomContent(rowObj, availableWidth) : this._getTextContent(rowObj);
    }

    this._contentDisplayable = this._gantt.isRowsHierarchical() ? this._addExpandCollapseButton(this._content, rowObj) : this._content;

    this._gantt.getEventManager().associate(this._contentDisplayable, this, true);

    this._rowAxis.addChild(this._contentDisplayable); // TODO consider tweaking the logic to avoid this step when an explicit width is set on the row axis for potential performance improvements, especially for custom content


    var contentDimensions = this._contentDisplayable.getDimensions();

    if (this.getDisplayableType() === 'g') {
      // We want to know the visible width of the content, which means we also need to take into account the translate x
      // e.g. the content may be clipped out of view, and we only care about the unclipped width.
      if (isRTL) {
        // in RTL, the custom content g container's x=0 is aligned to the right edge of the row axis container.
        // contentDimensions's x is left anchored, so only the magnitude of the negative x value matters.
        this._width = -Math.min(0, contentDimensions.x);
      } else {
        this._width = contentDimensions.x + contentDimensions.w;
      } // Ensure width is positive


      this._width = Math.max(0, this._width);
      this._height = contentDimensions.y + contentDimensions.h;
    } else {
      // For custom content, calling getDimensions() on the contentDisplayable <g> element gives x, y relative to the container coordinate space,
      // whereas calling getDimensions() on non custom dvt.OutputText gives x, y relative to the row axis container coordinate space, so there is no need to account for
      // translations for the width/height of non custom text content.
      this._width = Math.min(contentDimensions.w, availableWidth['calculatedWidth']); // Label would have been truncated to fit if the available width is smaller than the label width

      this._height = contentDimensions.h;
    }
  };
  /**
   * Gets the custom content element.
   * @param {Object} rowObj The row's layout object.
   * @param {Object} availableWidth An object containing the max width, width, and calculated width, in px. -1 width means 'max-content'
   * @private
   */


  DvtGanttRowLabelContent.prototype._getCustomContent = function (rowObj, availableWidth) {
    var rowData = rowObj['data'];
    var content = new dvt.Container(this._gantt.getCtx());
    content.setClassName(this._gantt.GetStyleClass('rowLabel'));
    var labelStyle = rowData['labelStyle'];

    if (labelStyle != null) {
      content.setStyle(labelStyle);
    }

    var renderer = this._gantt.getOptions()['rowAxis']['label']['renderer']; // must have been defined if reached here
    // maxWidth in the renderer context should be -1 if width is unbounded AND max-width is unbounded. Otherwise, width is bounded in some way, so give them that value in px


    var maxWidthOption = this._gantt.getRowAxisMaxWidth();

    if (availableWidth['width'] === -1 && maxWidthOption != null && maxWidthOption === 'none') {
      var contextMaxWidth = -1;
    } else if (this._gantt.isRowsHierarchical()) {
      // some space reserved for hierarchical indentation and expand/collapse button
      contextMaxWidth = Math.max(0, availableWidth['calculatedWidth'] - this._rowAxis.getLabelContentIndentSize(rowObj));
    } else {
      contextMaxWidth = availableWidth['calculatedWidth'];
    }

    var availableHeight = rowObj['height'];
    var parentElement = content.getContainerElem();
    var customContent = renderer(this.getRendererContext(rowData, contextMaxWidth, availableHeight, parentElement));

    if (customContent) {
      if (Array.isArray(customContent)) {
        customContent.forEach(function (node) {
          dvt.ToolkitUtils.appendChildElem(parentElement, node);
        });
      } else {
        dvt.ToolkitUtils.appendChildElem(parentElement, customContent);
      }
    }

    return content;
  };
  /**
   * Gets the text content element.
   * @param {Object} rowObj The row's layout object.
   * @private
   */


  DvtGanttRowLabelContent.prototype._getTextContent = function (rowObj) {
    var rowData = rowObj['data'];
    var content = new dvt.OutputText(this._gantt.getCtx(), this._labelString, 0, 0);
    content.setClassName(this._gantt.GetStyleClass('rowLabel')); // sets the style if specified in options

    var labelStyle = rowData['labelStyle'];

    if (labelStyle != null && labelStyle !== '' && Object.keys(labelStyle).length !== 0) {
      content.setStyle(labelStyle); // works if style is object
    }

    content.setCSSStyle(this._rowAxis._getCSSStyle(labelStyle)); // necessary for getDimension/fitText to obtain CSS style of the text

    return content;
  };
  /**
   * Adds expand/collapse icons to the given label content
   * @param {dvt.Displayable} content
   * @param {Object} rowObj The row's layout object
   * @return {dvt.Container} <g> element consisting of the icon and content
   * @private
   */


  DvtGanttRowLabelContent.prototype._addExpandCollapseButton = function (content, rowObj) {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var container = new dvt.Container(this._gantt.getCtx());

    var indentSize = this._rowAxis.getLabelContentIndentSize(rowObj);

    var contentTranslateX = isRTL ? -indentSize : indentSize;

    if (isRTL && this._contentType === 'text') {
      // dvt.OutputText always treats left side as start regardless of reading direction
      contentTranslateX -= content.getDimensions().w;
    }

    content.setTranslateX(contentTranslateX);

    if (rowObj['expanded'] != null) // if not leaf
      {
        var buttonSize = DvtGanttStyleUtils.getRowLabelButtonSize();
        var gapSize = DvtGanttStyleUtils.getRowLabelButtonContentGapSize();
        var buttonX = indentSize - (buttonSize + gapSize);
        buttonX = isRTL ? -(buttonX + buttonSize) : buttonX;
        var buttonY = (content.getDimensions().h - buttonSize) / 2;

        var em = this._gantt.getEventManager();

        var button = this._createExpandCollapseButton(this._gantt.getCtx(), this._gantt.getOptions()['_resources'], rowObj['expanded'] ? 'open' : 'closed', buttonX, buttonY, buttonSize, em.onExpandCollapseButtonClick, em);

        this._button = button;
        container.addChild(button);
      } else {
      this._button = null;
    }

    container.addChild(content);
    return container;
  };
  /**
   * Creates the label button.
   * @param {dvt.Context} context
   * @param {object} resources The object containing the button image resources.
   * @param {string} prefix The prefix of the image resource name.
   * @param {number} x The button x position.
   * @param {number} y The button y position.
   * @param {number} size The button size.
   * @param {string} tooltip The button tooltip.
   * @param {function} callback The button callback function.
   * @param {object} callbackObj The button callback object.
   * @return {dvt.Button} The button.
   * @private
   */


  DvtGanttRowLabelContent.prototype._createExpandCollapseButton = function (context, resources, prefix, x, y, size, callback, callbackObj) {
    var upState = this._createButtonImage(context, resources[prefix + 'Enabled'], x, y, size);

    var overState = this._createButtonImage(context, resources[prefix + 'Over'], x, y, size);

    var downState = this._createButtonImage(context, resources[prefix + 'Down'], x, y, size);

    var button = new dvt.Button(context, upState, overState, downState, null, null, callback, callbackObj);
    button.setAriaRole('button');
    button.setAriaProperty('label', this.getAriaLabel());

    this._gantt.getEventManager().associate(button, this);

    return button;
  };
  /**
   * Creates a button image.
   * @param {dvt.Context} context
   * @param {object} src The image src.
   * @param {number} x The button x position.
   * @param {number} y The button y position.
   * @return {dvt.Image} The image.
   * @private
   */


  DvtGanttRowLabelContent.prototype._createButtonImage = function (context, src, x, y, size) {
    var image = new dvt.Image(context, src, x, y, size, size);
    image.setInvisibleFill();
    return image;
  };
  /**
   * Gets the context to be passed into custom renderer callbacks
   * @param {object} rowData
   * @param {number} maxWidth
   * @param {number} maxHeight
   * @param {Element} parentElement
   * @return {object} The renderer context
   */


  DvtGanttRowLabelContent.prototype.getRendererContext = function (rowData, maxWidth, maxHeight, parentElement) {
    var options = this._gantt.getOptions();

    var taskObjs = rowData['tasks'];
    var itemData = [];

    if (options['taskData']) {
      for (var i = 0; i < taskObjs.length; i++) {
        itemData.push(taskObjs[i]['_itemData']);
      }
    }

    var dataContext = {
      'component': options['_widgetConstructor'],
      'parentElement': parentElement,
      'rowData': dvt.TimeComponent.sanitizeData(rowData, 'row'),
      'itemData': options['taskData'] ? itemData : null,
      'maxWidth': maxWidth,
      'maxHeight': maxHeight
    };
    return this._gantt.getCtx().fixRendererContext(dataContext);
  };
  /**
   * Gets the associated row node.
   * @return {DvtGanttRowNode} the associated row node.
   */


  DvtGanttRowLabelContent.prototype.getRow = function () {
    return this._rowNode;
  };
  /**
   * Sets the associated row node.
   * @param {DvtGanttRowNode} rowNode the associated row node.
   */


  DvtGanttRowLabelContent.prototype.setRow = function (rowNode) {
    this._rowNode = rowNode;
  };
  /**
   * Gets the row index
   * @return {number} the row index
   */


  DvtGanttRowLabelContent.prototype.getRowIndex = function () {
    return this._rowIndex;
  };
  /**
   * Sets the row index
   * @param {number} index The row index
   */


  DvtGanttRowLabelContent.prototype.setRowIndex = function (index) {
    this._rowIndex = index;
  };
  /**
   * Gets the associated row's layout object.
   * @return {Object} The row's layout object.
   */


  DvtGanttRowLabelContent.prototype.getRowLayoutObject = function () {
    return this._gantt.getRowLayoutObjs()[this.getRowIndex()];
  };
  /**
   * Gets the content displayable
   * @return {dvt.Displayable} The content displayable
   */


  DvtGanttRowLabelContent.prototype.getDisplayable = function () {
    // TODO should this be getDisplayble() or getDisplayables() that return an array of 1 thing?
    return this._contentDisplayable;
  };
  /**
   * Gets the expand collapse button
   * @return {dvt.Button}
   */


  DvtGanttRowLabelContent.prototype.getExpandCollapseButton = function () {
    return this._button;
  };
  /**
   * Gets the row label string
   * @return {string} The label string
   */


  DvtGanttRowLabelContent.prototype.getLabelString = function () {
    return this._labelString;
  };
  /**
   * Gets the displayable type
   * @return {string} 'g' or 'text
   */


  DvtGanttRowLabelContent.prototype.getDisplayableType = function () {
    return this._gantt.isRowsHierarchical() || this._contentType === 'custom' ? 'g' : 'text';
  };
  /**
   * Gets the content type
   * @return {string} The content type, either 'custom', or 'text'
   */


  DvtGanttRowLabelContent.prototype.getContentType = function () {
    return this._contentType;
  };
  /**
   * Gets the x position within the row axis
   * @return {number}
   */


  DvtGanttRowLabelContent.prototype.getX = function () {
    if (this.getDisplayableType() === 'text') return this._contentDisplayable.getX();else return this._contentDisplayable.getTranslateX();
  };
  /**
   * Sets the x position within the row axis
   * @param {number} x The desired x position
   */


  DvtGanttRowLabelContent.prototype.setX = function (x) {
    if (this.getDisplayableType() === 'text') this._contentDisplayable.setX(x);else this._contentDisplayable.setTranslateX(x);
  };
  /**
   * Gets the y position within the row axis
   * @return {number}
   */


  DvtGanttRowLabelContent.prototype.getY = function () {
    if (this.getDisplayableType() === 'text') return this._contentDisplayable.getY();else return this._contentDisplayable.getTranslateY();
  };
  /**
   * Sets the y position within the row axis
   * @param {number} y The desired y position
   */


  DvtGanttRowLabelContent.prototype.setY = function (y) {
    if (this.getDisplayableType() === 'text') this._contentDisplayable.setY(y);else this._contentDisplayable.setTranslateY(y);
  };
  /**
   * Gets the content width
   * @return {number}
   */


  DvtGanttRowLabelContent.prototype.getWidth = function () {
    return this._width;
  };
  /**
   * Gets the content height
   * @return {number}
   */


  DvtGanttRowLabelContent.prototype.getHeight = function () {
    return this._height;
  };
  /**
   * Gets the aria label
   * @return {string} the aria label string.
   */


  DvtGanttRowLabelContent.prototype.getAriaLabel = function () {
    var translations = this._gantt.getOptions().translations;

    var states = [];
    var rowObj = this.getRowLayoutObject();
    if (rowObj['expanded'] != null) states.push(translations[rowObj['expanded'] ? 'stateExpanded' : 'stateCollapsed']);
    return dvt.Displayable.generateAriaLabel(translations.labelLevel + ' ' + rowObj['depth'] + ', ' + this.getLabelString(), states);
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class representing a Gantt Row node.
   * @param {dvt.Gantt} gantt the Gantt component
   * @class
   * @constructor
   */


  var DvtGanttRowNode = function DvtGanttRowNode(gantt) {
    this.Init(gantt);
  };

  dvt.Obj.createSubclass(DvtGanttRowNode, dvt.Container);
  /**
   * Initialize the row
   * @param {dvt.Gantt} gantt the Gantt component
   * @protected
   */

  DvtGanttRowNode.prototype.Init = function (gantt) {
    DvtGanttRowNode.superclass.Init.call(this, gantt.getCtx(), null);
    this._gantt = gantt;

    this._gantt.getEventManager().associate(this, this);
  };
  /**
   * Retrieve the data id of the row
   * @override
   */


  DvtGanttRowNode.prototype.getId = function () {
    return this._rowObj['id'];
  };
  /**
   * Gets the gantt.
   * @return {dvt.Gantt} the gantt.
   */


  DvtGanttRowNode.prototype.getGantt = function () {
    return this._gantt;
  };
  /**
   * Sets the layout object associated with this row node
   * @param {Object} rowObj Row layout object
   */


  DvtGanttRowNode.prototype.setLayoutObject = function (rowObj) {
    this._rowObj = rowObj;
  };
  /**
   * Gets the layout object associated with this row node
   * @return {Object} The row layout object
   */


  DvtGanttRowNode.prototype.getLayoutObject = function () {
    return this._rowObj;
  };
  /**
   * Gets the data associated with this row node
   * @param {boolean} isPublic Whether to retrieve a cleaned version of the data that would be publicly exposed
   * @return {Object} the data object
   */


  DvtGanttRowNode.prototype.getData = function (isPublic) {
    if (isPublic) {
      return dvt.TimeComponent.sanitizeData(this._rowObj['data'], 'row');
    }

    return this._rowObj['data'];
  };
  /**
   * Retrieve the index of the row.
   * @return {number} the index of the row.
   */


  DvtGanttRowNode.prototype.getIndex = function () {
    return this._rowObj['index'];
  };
  /**
   * Gets final y (animation independent, e.g. final y after animation finishes)
   * @return {number} The final y.
   */


  DvtGanttRowNode.prototype.getFinalY = function () {
    return this._rowObj['y'];
  };
  /**
   * Retrieve the label of the row
   * @return {string} the label of the row
   */


  DvtGanttRowNode.prototype.getLabel = function () {
    return this._rowObj['data']['label'];
  };
  /**
   * Gets final y (animation independent, e.g. final y after animation finishes)
   * @return {number} The final y.
   */


  DvtGanttRowNode.prototype.getFinalY = function () {
    return this._rowObj['y'];
  };
  /**
   * Sets the row label content object
   * @param {DvtGanttRowLabelContent} rowLabelText The row label content object
   */


  DvtGanttRowNode.prototype.setRowLabelContent = function (rowLabelContent) {
    this._rowLabelContent = rowLabelContent;
  };
  /**
   * Gets the row label content object
   * @return {DvtGanttRowLabelContent} The row label content object
   */


  DvtGanttRowNode.prototype.getRowLabelContent = function () {
    return this._rowLabelContent;
  };
  /**
   * Gets the render state.
   * @return {string} the render state.
   */


  DvtGanttRowNode.prototype.getRenderState = function () {
    return this._rowObj['renderState'];
  };
  /**
   * Retrieve task layout objs of the row.
   * @return {Array} an array of task layout objs.
   */


  DvtGanttRowNode.prototype.getTaskObjs = function () {
    return this._rowObj['taskObjs'];
  };
  /**
   * Returns an array of task layout objects ordered as they should be rendered
   * @return {Array} An array of task layout objects
   */


  DvtGanttRowNode.prototype.getRenderOrderTaskObjs = function () {
    // taskObjs should already be sorted in chronological order
    var taskObjs = this._rowObj['taskObjs'];

    if (this._rowObj['earliestOverlayTaskObj']) {
      var overlayTasks = [];
      var nonOverlayTasks = [];
      taskObjs.forEach(function (taskObj) {
        if (taskObj['overlapBehavior'] === 'overlay') {
          overlayTasks.push(taskObj);
        } else {
          nonOverlayTasks.push(taskObj);
        }
      }); // Push overlay tasks to the back so that they're always rendered on top

      return nonOverlayTasks.concat(overlayTasks);
    }

    return taskObjs;
  };
  /**
   * Renders the row to specified container.
   * @param {dvt.Container} container the container
   */


  DvtGanttRowNode.prototype.render = function (container) {
    var taskObjs = this.getRenderOrderTaskObjs();

    for (var i = 0; i < taskObjs.length; i++) {
      var taskObj = taskObjs[i];
      var taskNode = taskObj['node'];

      if (!taskNode) {
        var taskNode = new DvtGanttTaskNode(this._gantt);
        taskNode.setLayoutObject(taskObj);
        taskObj['node'] = taskNode;
      }

      var task = taskNode.getTask();
      var taskRepBounds = task.getTimeSpanDimensions(taskNode.getValue('start'), taskNode.getValue('end'));

      if (!taskRepBounds) {
        taskRepBounds = task.getTimeSpanDimensions(taskNode.getValue('baseline', 'start'), taskNode.getValue('baseline', 'end'));
      }

      taskObj['x'] = taskRepBounds['startPos'];
      taskNode.render(this);
    } // Need to render task labels AFTER all task shapes are rendered for auto label positioning


    for (var j = 0; j < taskObjs.length; j++) {
      taskObj = taskObjs[j];
      taskNode = taskObj['node'];
      var taskLabel = taskNode.getTaskLabel();
      var task = taskNode.getTask();
      taskLabel.setAssociatedShape(task.getShape('main'));
      taskLabel.render(); // If resize enabled, render resize handles

      if (this._gantt.isTaskResizeEnabled()) {
        task.renderMainResizeHandles(taskNode);
      } else {
        task.removeHandles();
      }
    }

    if (this._gantt.isRowAxisEnabled() && this._gantt.getRowAxis()) this._finalizeRowLabelRender(this._gantt);

    this._renderBackground(this._gantt, this._gantt.getDatabodyBackground());

    this._renderHorizontalGridline(this._gantt, this);

    container.addChild(this);
  };
  /**
   * Finalizes row label content rendering, called during row rendering.
   * @param {dvt.Gantt} gantt
   */


  DvtGanttRowNode.prototype._finalizeRowLabelRender = function (gantt) {
    var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
    var labelContent = this.getRowLabelContent();
    var top = this.getFinalY();
    var height = this._rowObj['height'];
    var rowAxis = gantt.getRowAxis();

    if (labelContent.getDisplayableType() === 'g') {
      var x = !isRTL ? 0 : rowAxis.getWidth();
    } else {
      var labelDisplayable = labelContent.getDisplayable();
      if (labelDisplayable.isTruncated()) labelDisplayable.setTextString(labelDisplayable.getUntruncatedTextString()); // Truncate label to fit

      dvt.TextUtils.fitText(labelDisplayable, rowAxis.getWidth(), height, rowAxis, 1);

      if (!isRTL) {
        labelDisplayable.alignRight();
        x = rowAxis.getWidth();
      } else {
        x = 0;
      }
    }

    var y = (top + (top + height) - labelContent.getHeight()) / 2;
    labelContent.setRow(this);
    var finalStates = {
      'x': x,
      'y': y
    }; // set "previous states" (current implementation, labels are new and have no knowledge of previous positions)

    var previousLabelState = this.getLabelState();

    if (previousLabelState) {
      labelContent.setY(previousLabelState['y']);
      labelContent.setX(previousLabelState['x']);
    } // Record final states


    this.recordLabelState(finalStates);

    this._gantt.getAnimationManager().preAnimateRowLabel(this, labelContent, finalStates);
  };
  /**
   * Renders the row background.
   * @param {dvt.Gantt} gantt The gantt component
   * @param {dvt.Container} container The container to render into.
   * @private
   */


  DvtGanttRowNode.prototype._renderBackground = function (gantt, container) {
    var x = 0,
        y = this._rowObj['y'],
        w = gantt.getContentLength(),
        h = this._rowObj['height'],
        renderState = 'exist',
        finalStates;

    if (!this._background) {
      this._background = new dvt.Rect(gantt.getCtx(), x, y, w, h);

      this._background.setPixelHinting(true);

      this._background.setClassName(gantt.GetStyleClass('row'));

      renderState = 'add'; // Explicitly associate the row background with the DvtGanttRowNode, since the background is not a direct child.

      this._gantt.getEventManager().associate(this._background, this);
    }

    container.addChild(this._background);
    finalStates = {
      'y': y,
      'w': w,
      'h': h
    };

    this._gantt.getAnimationManager().preAnimateRowBackground(this._background, finalStates, renderState);
  };
  /**
   * Gets the row background.
   * @return {dvt.Rect} The row background.
   */


  DvtGanttRowNode.prototype.getBackground = function () {
    return this._background;
  };
  /**
   * Renders horizontal grid lines
   * @param {dvt.Gantt} gantt The gantt component
   * @param {dvt.Container} container The container to render into.
   * @private
   */


  DvtGanttRowNode.prototype._renderHorizontalGridline = function (gantt, container) {
    var x1,
        x2,
        y1,
        y2,
        renderState = 'exist',
        finalStates,
        gridlineStyleClass = gantt.GetStyleClass('hgridline'),
        horizontalLineWidth = DvtGanttStyleUtils.getHorizontalGridlineWidth(gantt.getOptions()),
        // due to pixel hinting, odd value stroke width needs it's position to be offset by 0.5 to ensure consistent behavior across browsers
    // e.g. stroke-width of 1px means 0.5px above and below the reference coordinate. With pixel hinting, some browsers
    // renders 1px above the reference, some renders 1px below the reference. If we offset the reference by 0.5px, the stroke location
    // becomes unambiguous (it'll lock onto whole pixel grid) so all browsers will render this consistently.
    yOffset = horizontalLineWidth % 2 * 0.5;

    if (gantt.isHorizontalGridlinesVisible()) {
      y1 = this._rowObj['y'] + this._rowObj['height'] + yOffset;
      y2 = y1;
      x1 = 0;
      x2 = gantt.getContentLength();

      if (!this._horizontalLine) {
        this._horizontalLine = new dvt.Line(gantt.getCtx(), x1, y1, x2, y2);

        this._horizontalLine.setPixelHinting(true);

        this._horizontalLine.setClassName(gridlineStyleClass, true);

        container.addChild(this._horizontalLine);
        renderState = 'add';
      }

      finalStates = {
        'x1': x1,
        'x2': x2,
        'y1': y1,
        'y2': y2
      };

      this._gantt.getAnimationManager().preAnimateHorizontalGridline(this._horizontalLine, finalStates, renderState);
    } else {
      // TODO: Animate this?
      if (this._horizontalLine) {
        container.removeChild(this._horizontalLine);
      }

      this._horizontalLine = null;
    }
  };
  /**
   * Records the row label state.
   * @param {object} stateObj The object containing label state information
   */


  DvtGanttRowNode.prototype.recordLabelState = function (stateObj) {
    this._rowLabelState = stateObj;
  };
  /**
   * Gets the row label state.
   * @return {object} The object containing label state information
   */


  DvtGanttRowNode.prototype.getLabelState = function () {
    return this._rowLabelState;
  };
  /**
   * Removes itself.
   */


  DvtGanttRowNode.prototype.remove = function () {
    var onEnd,
        self = this;

    onEnd = function onEnd() {
      // Remove background, which belongs to databodyBackground container
      if (self._background) {
        var backgroundParent = self._background.getParent();

        if (backgroundParent) {
          backgroundParent.removeChild(self._background);
        }
      } // Remove the row container (and its contents) itself.


      var parent = self.getParent();

      if (parent) {
        parent.removeChild(self);
      }
    };

    this._gantt.getAnimationManager().preAnimateRowNodeRemove(this, onEnd);

    this._removeRowLabel();
  };
  /**
   * Removes the row label.
   * @private
   */


  DvtGanttRowNode.prototype._removeRowLabel = function () {
    var rowLabelContent = this.getRowLabelContent(),
        rowAxis = this._gantt.getRowAxis(),
        rowLabelDisplayable,
        onEnd;

    if (rowLabelContent && rowAxis) {
      rowLabelDisplayable = rowLabelContent.getDisplayable();

      if (rowLabelDisplayable) {
        // Ensure the label is in the DOM before animating (row axis was cleared on rerender)
        if (rowLabelDisplayable.getParent() == null) {
          rowAxis.addChild(rowLabelDisplayable);
        }

        onEnd = function onEnd() {
          if (rowLabelDisplayable.getParent()) rowLabelDisplayable.getParent().removeChild(rowLabelDisplayable);
        };

        this._gantt.getAnimationManager().preAnimateRowLabelRemove(rowLabelContent, onEnd);
      }
    }
  };
  /**
   * Returns the data context (e.g. for DnD, etc.)
   * @return {object}
   */


  DvtGanttRowNode.prototype.getDataContext = function () {
    return {
      'rowData': this.getData(true),
      'component': this._gantt.getOptions()['_widgetConstructor']
    };
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class representing a task container (i.e. container for shapes and labels that make up a task).
   * @param {dvt.Gantt} gantt The gantt component
   * @class
   * @constructor
   * @implements {DvtKeyboardNavigable}
   * @implements {DvtSelectable}
   * @implements {DvtDraggable}
   */


  var DvtGanttTaskNode = function DvtGanttTaskNode(gantt) {
    this.Init(gantt);
  };

  dvt.Obj.createSubclass(DvtGanttTaskNode, dvt.Container);
  /**
   * @param {dvt.Gantt} gantt The gantt component
   * @protected
   */

  DvtGanttTaskNode.prototype.Init = function (gantt) {
    DvtGanttTaskNode.superclass.Init.call(this, gantt.getCtx(), null);
    this._gantt = gantt;
    this._task = new DvtGanttTask(gantt, this);
    this._taskLabel = new DvtGanttTaskLabel(gantt, this);

    this._gantt.getEventManager().associate(this, this);
  };
  /**
   * Gets the task data id.
   * @override
   */


  DvtGanttTaskNode.prototype.getId = function () {
    return this._taskObj['id'];
  };
  /**
   * Sets the layout object associated with this task node
   * @param {Object} taskObj Task layout object
   */


  DvtGanttTaskNode.prototype.setLayoutObject = function (taskObj) {
    this._taskObj = taskObj;
  };
  /**
   * Gets the layout object associated with this task node
   * @return {Object} The task layout object
   */


  DvtGanttTaskNode.prototype.getLayoutObject = function () {
    return this._taskObj;
  };
  /**
   * Gets the data assocaited with this task node
   * @param {boolean} isPublic Whether to retrieve a cleaned version of the data that would be publicly exposed
   * @return {Object} the data object
   */


  DvtGanttTaskNode.prototype.getData = function (isPublic) {
    if (isPublic) {
      return dvt.TimeComponent.sanitizeData(this._taskObj['data'], 'task');
    }

    return this._taskObj['data'];
  };
  /**
   * Gets the value of query property/subproperty of the task.
   * @param {string} property The top level property name
   * @param {string=} subProperty The subproperty name (optional)
   * @return {*} The value
   */


  DvtGanttTaskNode.prototype.getValue = function (property, subProperty) {
    // Old strategy was to merge data properties with taskDefaults properties before downstream accesses.
    // However, merging the objects for every single task we render, especially if only a small subset of the
    // properties are accessed downstream, is expensive. Having this method for on demand value access is more efficient.
    var taskDefaults = this._gantt.getOptions()['taskDefaults'];

    var value;

    switch (property) {
      case 'start':
        value = this._taskObj['startTime'];
        break;

      case 'end':
        value = this._taskObj['endTime'];
        break;

      case 'height':
        value = this._taskObj['height'];
        break;

      case 'baseline':
        if (subProperty === 'height') {
          value = this._taskObj['baselineHeight'];
          break;
        }

        value = this._taskObj['data']['baseline'];

        if (value && subProperty != null) {
          switch (subProperty) {
            case 'start':
              value = this._taskObj['baselineStartTime'];
              break;

            case 'end':
              value = this._taskObj['baselineEndTime'];
              break;

            default:
              value = value[subProperty] != null ? value[subProperty] : taskDefaults['baseline'][subProperty];
          }
        }

        break;

      case 'progress':
        if (subProperty === 'height') {
          value = this._taskObj['progressHeight'];
          break;
        }

        value = this._taskObj['data']['progress'];

        if (value && subProperty != null) {
          value = value[subProperty] != null ? value[subProperty] : taskDefaults['progress'][subProperty];
        }

        break;

      default:
        // assume top level property access
        value = this._taskObj['data'][property] != null ? this._taskObj['data'][property] : taskDefaults[property];
    }

    return value;
  };
  /**
   * Gets the value from sandbox data (see also getSandboxData() function description)
   * @param {string} property The top level property name
   * @param {string} subProperty The subproperty name (optional)
   * @return {*} The value
   */


  DvtGanttTaskNode.prototype.getSandboxValue = function (property, subProperty) {
    var sandboxData = this.getSandboxData();

    var taskDefaults = this._gantt.getOptions()['taskDefaults'];

    var value = sandboxData[property];
    var defaultValue = taskDefaults[property];

    if (value && subProperty != null) {
      value = value[subProperty];
    }

    if (defaultValue && subProperty != null) {
      defaultValue = defaultValue[subProperty];
    }

    return value != null ? value : defaultValue;
  };
  /**
   * Gets a copy of node properties/data that is meant to be updated/manipulated to reflect
   * any intermediate states of a task (e.g. the state of the task feedback during drag,
   * which is not final until dragend, and can potentially be cancelled before)
   * @return {object} Mutable object of properties/data for the node.
   */


  DvtGanttTaskNode.prototype.getSandboxData = function () {
    if (!this._sandboxData) {
      this._sandboxData = dvt.JsonUtils.clone(dvt.TimeComponent.sanitizeData(this._taskObj['data'], 'task'));
      this._sandboxData['_rowNode'] = this.getRowNode();
      this._sandboxData['start'] = this._taskObj['startTime'];
      this._sandboxData['end'] = this._taskObj['endTime'];
      this._sandboxData['height'] = this._taskObj['height'];
      var sandboxBaseline = this._sandboxData['baseline'];

      if (sandboxBaseline) {
        sandboxBaseline['start'] = this._taskObj['baselineStartTime'];
        sandboxBaseline['end'] = this._taskObj['baselineEndTime'];
        sandboxBaseline['height'] = this._taskObj['baselineHeight'];
      }

      var sandboxProgress = this._sandboxData['progress'];

      if (sandboxProgress) {
        sandboxProgress['height'] = this._taskObj['progressHeight'];
      }
    }

    return this._sandboxData;
  };
  /**
   * Gets the row node associated with the task
   * @return {DvtGanttRowNode} the row node
   */


  DvtGanttTaskNode.prototype.getRowNode = function () {
    return this._taskObj['rowObj']['node'];
  };
  /**
   * Gets the gantt.
   * @return {dvt.Gantt} the gantt.
   */


  DvtGanttTaskNode.prototype.getGantt = function () {
    return this._gantt;
  };
  /**
   * Gets the render state
   * @return {string} the render state
   */


  DvtGanttTaskNode.prototype.getRenderState = function () {
    return this._taskObj['renderState'];
  };
  /**
   * Gets the chronologically previous adjacent task node on the same row level
   * @return {DvtGanttTaskNode} the previous adjacent task node on the same row level
   */


  DvtGanttTaskNode.prototype.getPreviousAdjacentTaskNode = function () {
    return this._taskObj['previousAdjacentTaskObj'] ? this._taskObj['previousAdjacentTaskObj']['node'] : null;
  };
  /**
   * Gets the chronologically next adjacent task node on the same row level
   * @return {DvtGanttTaskNode} the next adjacent task node on the same row level
   */


  DvtGanttTaskNode.prototype.getNextAdjacentTaskNode = function () {
    return this._taskObj['nextAdjacentTaskObj'] ? this._taskObj['nextAdjacentTaskObj']['node'] : null;
  };
  /**
   * Gets the chronologically previous adjacent baseline task node on the same row level
   * @return {DvtGanttTaskNode} the previous adjacent task node on the same row level
   */


  DvtGanttTaskNode.prototype.getPrevAdjMilestoneBaselineTaskNode = function () {
    return this._taskObj['prevAdjMilestoneBaselineTaskObj'] ? this._taskObj['prevAdjMilestoneBaselineTaskObj']['node'] : null;
  };
  /**
   * Gets the chronologically next adjacent task node on the same row level
   * @return {DvtGanttTaskNode} the next adjacent task node on the same row level
   */


  DvtGanttTaskNode.prototype.getNextAdjMilestoneBaselineTaskNode = function () {
    return this._taskObj['nextAdjMilestoneBaselineTaskObj'] ? this._taskObj['nextAdjMilestoneBaselineTaskObj']['node'] : null;
  };
  /**
   * Gets the physical start and end pos of the query task shape
   * @param {string} type The shape type
   * @param {boolean=} includeLabel Whether to include label dimensions (for main shape only)
   * @return {object} object containing 'startPos' and 'endPos'
   */


  DvtGanttTaskNode.prototype.getTaskShapePhysicalBounds = function (type, includeLabel) {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var orientationFactor = isRTL ? -1 : 1;

    var shape = this._task.getShape(type);

    var shapeX = shape.getFinalX() + this.getFinalX();
    var shapeWidth = shape.getFinalWidth() + shape.getPhysicalEndOffset();
    var startPos = shapeX - orientationFactor * shape.getPhysicalStartOffset();
    var endPos = shapeX + orientationFactor * shapeWidth;

    if (includeLabel) {
      var labelOutputText = this._taskLabel.getLabelOutputText();

      if (labelOutputText && labelOutputText.getParent() != null) {
        var labelPosition = this._taskLabel.getEffectiveLabelPosition();

        if (labelPosition === 'end') {
          endPos = endPos + orientationFactor * (DvtGanttStyleUtils.getTaskLabelPadding() + labelOutputText.getDimensions().w);
        } else if (labelPosition === 'start') {
          startPos = startPos - orientationFactor * (DvtGanttStyleUtils.getTaskLabelPadding() + labelOutputText.getDimensions().w);
        }
      }
    }

    return {
      'startPos': startPos,
      'endPos': endPos
    };
  };
  /**
   * Scrolls the relevant part of the task into view.
   * @param {string=} xPriority The side in the x direction to prioritize scroll into view, one of 'start', 'end', or 'auto'. Default 'auto'.
   * @param {string=} yPriority The side in the y direction to prioritize scroll into view, one of 'top', 'bottom', or 'auto'. Default 'auto'.
   */


  DvtGanttTaskNode.prototype.scrollIntoView = function (xPriority, yPriority) {
    var x, y, w, h;
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());

    var dataBody = this._gantt.getDatabody(); // Ensure task is in the DOM


    this._gantt.getDataLayoutManager().ensureInDOM(this.getLayoutObject(), 'task');

    var keyboardDnDMode = this._gantt.getEventManager().getKeyboardDnDMode();

    var targetShape, referenceFrame;

    if (keyboardDnDMode === DvtGanttEventManager.KEYBOARD_MOVE && this._mainDragFeedbacks && this._mainDragFeedbacks.length > 0) {
      targetShape = this._mainDragFeedbacks[0];
      referenceFrame = this._gantt.getDnDArtifactsContainer();
    } else if ((keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_START || keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_END) && this._mainResizeHandleDragFeedbacks && this._mainResizeHandleDragFeedbacks.length > 0) {
      targetShape = this._mainResizeHandleDragFeedbacks[0];
      referenceFrame = this._gantt.getDnDArtifactsContainer();
    } else {
      targetShape = this.getTask().getShape('main');
      targetShape = targetShape ? targetShape : this.getTask().getShape('baseline');
      referenceFrame = this;
    }

    w = targetShape.getWidth() + targetShape.getPhysicalStartOffset() + targetShape.getPhysicalEndOffset();
    h = targetShape.getHeight();
    x = !isRTL ? targetShape.getX() - targetShape.getPhysicalStartOffset() : targetShape.getX() - w + targetShape.getPhysicalStartOffset();
    y = targetShape.getY();
    var posInDataBody = dataBody.stageToLocal(referenceFrame.localToStage({
      x: x,
      y: y
    }));
    var region = new dvt.Rectangle(posInDataBody.x, posInDataBody.y, w, h);

    this._gantt.scrollIntoView(region, xPriority, yPriority, DvtGanttStyleUtils.getTaskPadding());
  };
  /**
   * Gets the dragged object during DnD (e.g. a DvtGanttTaskShape or DvtGanttTaskLabel).
   * @return {DvtGanttTaskShape|DvtGanttTaskLabel} The dragged object.
   */


  DvtGanttTaskNode.prototype.getDraggedObject = function () {
    return this._draggedObj;
  };
  /**
   * Sets the object dragged during Dnd (e.g. a DvtGanttTaskShape or DvtGanttTaskLabel).
   * @param {DvtGanttTaskShape|DvtGanttTaskLabel} draggedObj The dragged object.
   */


  DvtGanttTaskNode.prototype.setDraggedObject = function (draggedObj) {
    this._draggedObj = draggedObj;
  };
  /**
   * Setup on drag start
   */


  DvtGanttTaskNode.prototype.dragStartSetup = function () {
    // Remove all DnD artifacts except for the currently dragged one (note if this._draggedObj is not an affordance or null then all artifacts are removed)
    this.hideDnDArtifacts(this._draggedObj);
  };
  /**
   * Cleanup on drag end
   */


  DvtGanttTaskNode.prototype.dragEndCleanup = function () {
    // Remove all DnD artifacts
    this.hideDnDArtifacts(); // reset sandbox data

    this._sandboxData = null;
  };
  /**
   * Show the drag feedbacks accordingly; called by DnD handlers.
   * @param {dvt.MouseEvent|dvt.KeyboardEvent|dvt.ComponentTouchEvent} event DnD dragOver event, keyboard, or touch event that triggered the feedback
   * @param {dvt.Point} localPos The position (e.g. the cursor point during drag) in reference to the affordance container coord system
   * @param {object} dropObj The current drop target logical object
   * @param {dvt.Point} dropOffset The difference between the position of the start and y of the task and the drag start event position (i.e. (start pos - event pos, y - event y pos)
   * @param {boolean=} autoPanOff Whether to turn edge auto pan off. Default false.
   */


  DvtGanttTaskNode.prototype.showDragFeedback = function (event, localPos, dropObj, dropOffset, autoPanOff) {
    var eventManager = this._gantt.getEventManager(); // Don't do anything if the eventManager doesn't exist anymore, which is possible because this method is invoked
    // in requestAnimationFrame, and it's possible a requestAnimationFrame callback is invoked after the gantt is destroyed.


    if (this._draggedObj && eventManager) {
      var dragSourceType = eventManager.getDnDTaskSubType(this._draggedObj);
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var orientationFactor = isRTL ? 1 : -1;

      var artifactsContainer = this._gantt.getDnDArtifactsContainer();

      var ganttStartTime = this._gantt.getStartTime();

      var ganttEndTime = this._gantt.getEndTime();

      var ganttContentLength = this._gantt.getContentLength();

      var panDelta, referenceFinalLocalX, referenceFinalLocalY;
      var feedbackStartTimePos, feedbackStartTime, feedbackEndTimePos, feedbackEndTime, feedbackRowNode;

      switch (dragSourceType) {
        case 'tasks':
          // Pan to make room if dragging to edge
          panDelta = !autoPanOff ? this._gantt.autoPanOnEdgeDrag(localPos, DvtGanttStyleUtils.getAutoPanEdgeThreshold(), false, false) : {
            deltaX: 0,
            deltaY: 0
          };
          referenceFinalLocalX = dropOffset.x + localPos.x + panDelta.deltaX;
          referenceFinalLocalY = dropOffset.y + localPos.y + panDelta.deltaY; // render feedback

          this._renderTaskMoveDragFeedback(referenceFinalLocalX, referenceFinalLocalY, artifactsContainer); // Show tooltip


          var referenceMainShape = this.getTask().getShape('main');
          feedbackStartTimePos = isRTL ? ganttContentLength - referenceFinalLocalX : referenceFinalLocalX;
          feedbackEndTimePos = isRTL ? ganttContentLength - (referenceFinalLocalX - referenceMainShape.getFinalWidth()) : referenceFinalLocalX + referenceMainShape.getFinalWidth();
          feedbackStartTime = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, feedbackStartTimePos, ganttContentLength);
          feedbackEndTime = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, feedbackEndTimePos, ganttContentLength);

          if (dropObj) {
            if (dropObj instanceof DvtGanttRowNode) {
              feedbackRowNode = dropObj;
            } else if (dropObj instanceof DvtGanttTaskNode) {
              feedbackRowNode = dropObj.getRowNode();
            }
          }

          this._showDragFeedbackTooltip(event, feedbackStartTime, feedbackEndTime, this._mainDragFeedbacks[0], 'center', feedbackRowNode);

          break;

        case 'taskResizeHandles':
          // Pan (horizontally only) to make room if dragging to edge
          panDelta = !autoPanOff ? this._gantt.autoPanOnEdgeDrag(localPos, DvtGanttStyleUtils.getAutoPanEdgeThreshold(), false, true) : {
            deltaX: 0,
            deltaY: 0
          };
          referenceFinalLocalX = localPos.x + panDelta.deltaX; // render feedback

          this._renderTaskResizeDragFeedback(referenceFinalLocalX, artifactsContainer); // Show tooltip


          var isEndResize = this._draggedObj.getType() === 'mainResizeHandleEnd';

          if (isEndResize) {
            feedbackStartTime = this.getValue('start');
            feedbackEndTimePos = this._mainResizeHandleDragFeedbacks[0].getX() - orientationFactor * this._mainResizeHandleDragFeedbacks[0].getWidth();
            feedbackEndTimePos = isRTL ? ganttContentLength - feedbackEndTimePos : feedbackEndTimePos;
            feedbackEndTime = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, feedbackEndTimePos, ganttContentLength);
          } else {
            feedbackStartTimePos = this._mainResizeHandleDragFeedbacks[0].getX();
            feedbackStartTimePos = isRTL ? ganttContentLength - feedbackStartTimePos : feedbackStartTimePos;
            feedbackStartTime = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, feedbackStartTimePos, ganttContentLength);
            feedbackEndTime = this.getValue('end');
          }

          this._showDragFeedbackTooltip(event, feedbackStartTime, feedbackEndTime, this._mainResizeHandleDragFeedbacks[0], isEndResize ? 'end' : 'start');

          break;
      }
    }
  };
  /**
   * Shows drag feedback tooltip
   * @param {dvt.MouseEvent|dvt.KeyboardEvent|dvt.ComponentTouchEvent} event DnD dragOver event, keyboard, or touch event that triggered the feedback
   * @param {number} feedbackStartTime
   * @param {number} feedbackEndTime
   * @param {dvt.Displayable} feedbackObj The feedback displayable associated with the tooltip
   * @param {string} position The position of the tooltip relative to the feedback. One of 'center', 'start', 'end'
   * @param {DvtGanttRowNode=} feedbackRowNode Optional row node if row is different from that of the one the task currently belongs to.
   * @private
   */


  DvtGanttTaskNode.prototype._showDragFeedbackTooltip = function (event, feedbackStartTime, feedbackEndTime, feedbackObj, position, feedbackRowNode) {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var sandboxData = this.getSandboxData();
    if (feedbackRowNode) sandboxData['_rowNode'] = feedbackRowNode;
    sandboxData['start'] = feedbackStartTime;
    sandboxData['end'] = feedbackEndTime;
    var feedbackDimensions = feedbackObj.getDimensions(this.getCtx().getStage());
    var coords;

    switch (position) {
      case 'start':
        coords = new dvt.Point(feedbackDimensions.x + isRTL * feedbackDimensions.w, feedbackDimensions.y);
        break;

      case 'end':
        coords = new dvt.Point(feedbackDimensions.x + !isRTL * feedbackDimensions.w, feedbackDimensions.y);
        break;

      default:
        coords = feedbackDimensions.getCenter();
    }

    var pageCoords = this.getCtx().stageToPageCoords(coords.x, coords.y);

    this._gantt.getEventManager().ProcessObjectTooltip(event, pageCoords.x, pageCoords.y, this, feedbackObj.getElem());
  };
  /**
   * Renders task move drag feedback
   * @param {number} referenceFinalLocalX x position of the task's start
   * @param {number} referenceFinalLocalY y position of the tasks's top
   * @param {dvt.Container} container The container to render into
   * @private
   */


  DvtGanttTaskNode.prototype._renderTaskMoveDragFeedback = function (referenceFinalLocalX, referenceFinalLocalY, container) {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());

    var ganttStartTime = this._gantt.getStartTime();

    var ganttEndTime = this._gantt.getEndTime();

    var ganttContentLength = this._gantt.getContentLength();

    var referenceMainShape = this.getTask().getShape('main');

    if (this._mainDragFeedbacks) {
      for (var i = 0; i < this._mainDragFeedbacks.length; i++) {
        var dragFeedback = this._mainDragFeedbacks[i];
        var dragFeedbackOffset = this._mainDragFeedbackOffsets[i];
        var newFeedbackX = referenceFinalLocalX + dragFeedbackOffset.x;
        dragFeedback.setX(newFeedbackX);
        dragFeedback.setY(referenceFinalLocalY + dragFeedbackOffset.y);
        this._mainDragFeedbackStartTimes[i] = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, isRTL ? ganttContentLength - newFeedbackX : newFeedbackX, ganttContentLength);
      }
    } else {
      // First feedback corresponds to the task where drag was initiated. Other feedbacks are drawn for other selected tasks if applicable.
      var referenceDragFeedback = new DvtGanttTaskShape(this._gantt.getCtx(), referenceFinalLocalX, referenceFinalLocalY, referenceMainShape.getFinalWidth(), referenceMainShape.getFinalHeight(), referenceMainShape.getBorderRadius(), this.getTask(), 'mainDragFeedback');
      this._mainDragFeedbacks = [referenceDragFeedback]; // TODO: consider moving the offsets and time properties to within DvtGanttTaskShape (or a subclass of it)

      this._mainDragFeedbackOffsets = [new dvt.Point(0, 0)]; // time information is necessary for updating the feedback, e.g. in case the Gantt resized during move the feedback needs to be placed correctly under the new time axis.

      this._mainDragFeedbackStartTimes = [this.getValue('start')];
      container.addChild(referenceDragFeedback);

      if (this._gantt.isSelectionSupported() && this.isSelected() && this._gantt.getSelectionHandler().getSelectedCount() > 1) {
        var selection = this._gantt.getSelectionHandler().getSelection();

        for (i = 0; i < selection.length; i++) {
          var selectionObj = selection[i];

          if (selectionObj instanceof DvtGanttTaskNode && selectionObj !== this) {
            var mainShape = selectionObj.getTask().getShape('main');
            var offsetFromReferenceX = mainShape.getX() + selectionObj.getTranslateX() - (referenceMainShape.getX() + this.getTranslateX());
            var offsetFromReferenceY = mainShape.getY() + selectionObj.getTranslateY() - (referenceMainShape.getY() + this.getTranslateY());
            var dragFeedbackLocalX = referenceFinalLocalX + offsetFromReferenceX;
            var dragFeedbackLocalY = referenceFinalLocalY + offsetFromReferenceY;
            dragFeedback = new DvtGanttTaskShape(this._gantt.getCtx(), dragFeedbackLocalX, dragFeedbackLocalY, mainShape.getFinalWidth(), mainShape.getFinalHeight(), mainShape.getBorderRadius(), selectionObj.getTask(), 'mainDragFeedback');

            this._mainDragFeedbacks.push(dragFeedback);

            this._mainDragFeedbackOffsets.push(new dvt.Point(offsetFromReferenceX, offsetFromReferenceY));

            this._mainDragFeedbackStartTimes.push(selectionObj.getValue('start'));

            container.addChild(dragFeedback);
          }
        }
      }
    }
  };
  /**
   * Renders task resize drag feedback
   * @param {number} referenceFinalLocalX x position of the current drag position
   * @param {dvt.Container} container The container to render into
   * @private
   */


  DvtGanttTaskNode.prototype._renderTaskResizeDragFeedback = function (referenceFinalLocalX, container) {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var orientationFactor = isRTL ? 1 : -1;
    var referenceMainShape = this.getTask().getShape('main');
    var isEndResize = this._draggedObj.getType() === 'mainResizeHandleEnd';
    var anchorX, finalLocalX;

    if (isEndResize) {
      anchorX = referenceMainShape.getFinalX() + this.getTranslateX(); // DvtGanttTaskShape rects takes care of RTL internally, so x is always the start position

      finalLocalX = isRTL ? Math.min(referenceFinalLocalX, anchorX) : Math.max(referenceFinalLocalX, anchorX);
    } else {
      anchorX = referenceMainShape.getFinalX() - orientationFactor * referenceMainShape.getFinalWidth() + this.getTranslateX();
      finalLocalX = isRTL ? Math.max(referenceFinalLocalX, anchorX) : Math.min(referenceFinalLocalX, anchorX);
    }

    var finalReferenceWidth = Math.abs(finalLocalX - anchorX);
    var deltaWidth = finalReferenceWidth - referenceMainShape.getFinalWidth();

    if (this._mainResizeHandleDragFeedbacks) {
      for (var i = 0; i < this._mainResizeHandleDragFeedbacks.length; i++) {
        var dragFeedback = this._mainResizeHandleDragFeedbacks[i];
        var dragSourceNode = this._mainResizeHandleDragFeedbackSources[i];
        var dragSourceShape = dragSourceNode.getTask().getShape('main');
        var newFeedbackWidth = Math.max(0, dragSourceShape.getFinalWidth() + deltaWidth);

        if (!isEndResize) {
          var dragSourceAnchorX = dragSourceShape.getFinalX() - orientationFactor * dragSourceShape.getFinalWidth() + dragSourceNode.getTranslateX();
          dragFeedback.setX(dragSourceAnchorX + orientationFactor * newFeedbackWidth);
        }

        dragFeedback.setWidth(newFeedbackWidth);
      }
    } else {
      var referenceDragFeedback = new DvtGanttTaskShape(this._gantt.getCtx(), isEndResize ? anchorX : finalLocalX, referenceMainShape.getFinalY() + this.getTranslateY(), finalReferenceWidth, referenceMainShape.getFinalHeight(), referenceMainShape.getBorderRadius(), this.getTask(), 'mainResizeHandleDragFeedback');
      this._mainResizeHandleDragFeedbacks = [referenceDragFeedback];
      this._mainResizeHandleDragFeedbackSources = [this];
      container.addChild(referenceDragFeedback);

      if (this._gantt.isSelectionSupported() && this.isSelected() && this._gantt.getSelectionHandler().getSelectedCount() > 1) {
        var selection = this._gantt.getSelectionHandler().getSelection();

        for (i = 0; i < selection.length; i++) {
          var selectionObj = selection[i];

          if (selectionObj instanceof DvtGanttTaskNode && selectionObj !== this) {
            var mainShape = selectionObj.getTask().getShape('main');
            var feedbackWidth = mainShape.getFinalWidth() + deltaWidth;
            var feedbackX;
            if (isEndResize) feedbackX = mainShape.getFinalX() + selectionObj.getTranslateX();else feedbackX = mainShape.getFinalX() - orientationFactor * mainShape.getFinalWidth() + selectionObj.getTranslateX() + orientationFactor * feedbackWidth;
            dragFeedback = new DvtGanttTaskShape(this._gantt.getCtx(), feedbackX, mainShape.getFinalY() + selectionObj.getTranslateY(), feedbackWidth, mainShape.getFinalHeight(), mainShape.getBorderRadius(), selectionObj.getTask(), 'mainResizeHandleDragFeedback');

            this._mainResizeHandleDragFeedbacks.push(dragFeedback);

            this._mainResizeHandleDragFeedbackSources.push(selectionObj);

            container.addChild(dragFeedback);
          }
        }
      }
    }
  };
  /**
   * Updates drag feedback positions on rerender, e.g. the Gantt resized when the feedbacks
   * are still present during keyboard DnD, in which case the feedback positions need to be updated
   * under the new time axis.
   */


  DvtGanttTaskNode.prototype._updateDragFeedbacks = function () {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());

    var ganttStartTime = this._gantt.getStartTime();

    var ganttEndTime = this._gantt.getEndTime();

    var ganttContentLength = this._gantt.getContentLength();

    var dragFeedback, dragFeedbackX;

    if (this._mainDragFeedbacks) {
      var newReferenceX = dvt.TimeAxis.getDatePosition(ganttStartTime, ganttEndTime, this._mainDragFeedbackStartTimes[0], ganttContentLength);
      newReferenceX = isRTL ? ganttContentLength - newReferenceX : newReferenceX;

      for (var i = 0; i < this._mainDragFeedbacks.length; i++) {
        dragFeedback = this._mainDragFeedbacks[i];
        dragFeedbackX = dvt.TimeAxis.getDatePosition(ganttStartTime, ganttEndTime, this._mainDragFeedbackStartTimes[i], ganttContentLength);
        dragFeedbackX = isRTL ? ganttContentLength - dragFeedbackX : dragFeedbackX;
        this._mainDragFeedbackOffsets[i].x = dragFeedbackX - newReferenceX; // recalculate x positional offsets

        dragFeedback.setX(dragFeedbackX);
        dragFeedback.setWidth(this.getTask().getShape('main').getFinalWidth()); // update the source/reference feedback localpos (first maindragfeedback is that of the source)

        if (i == 0 && this._gantt.getEventManager()._keyboardDnDFeedbackLocalPos) this._gantt.getEventManager()._keyboardDnDFeedbackLocalPos.x = dragFeedbackX;
      }
    }

    if (this._mainResizeHandleDragFeedbacks) {
      for (var i = 0; i < this._mainResizeHandleDragFeedbacks; i++) {
        dragFeedback = this._mainResizeHandleDragFeedbacks[i];
        var dragFeedbackStartX = dvt.TimeAxis.getDatePosition(ganttStartTime, ganttEndTime, this._mainResizeHandleDragFeedbackSources[i].getValue('start'), ganttContentLength);
        var dragFeedbackEndX = dvt.TimeAxis.getDatePosition(ganttStartTime, ganttEndTime, this._mainResizeHandleDragFeedbackSources[i].getValue('end'), ganttContentLength);
        dragFeedbackX = isRTL ? ganttContentLength - dragFeedbackStartX : dragFeedbackStartX;
        dragFeedback.setX(dragFeedbackX);
        dragFeedback.setWidth(Math.abs(dragFeedbackEndX - dragFeedbackStartX)); // update the source/reference feedback localpos (first maindragfeedback is that of the source)

        if (i == 0 && this._gantt.getEventManager()._keyboardDnDFeedbackLocalPos) this._gantt.getEventManager()._keyboardDnDFeedbackLocalPos.x = dragFeedbackX;
      }
    }
  };
  /**
   * Remove drag feedbacks.
   */


  DvtGanttTaskNode.prototype.removeDragFeedbacks = function () {
    if (this._mainDragFeedbacks) {
      for (var i = 0; i < this._mainDragFeedbacks.length; i++) {
        this._mainDragFeedbacks[i].getParent().removeChild(this._mainDragFeedbacks[i]);
      }

      this._mainDragFeedbacks = null;
      this._mainDragFeedbackOffsets = null;
      this._mainDragFeedbackStartTimes = null;
    }

    if (this._mainResizeHandleDragFeedbacks) {
      for (var i = 0; i < this._mainResizeHandleDragFeedbacks.length; i++) {
        this._mainResizeHandleDragFeedbacks[i].getParent().removeChild(this._mainResizeHandleDragFeedbacks[i]);
      }

      this._mainResizeHandleDragFeedbacks = null;
      this._mainResizeHandleDragFeedbackSources = null;
    } // Hide tooltips if any


    this._gantt.getEventManager().hideTooltip();
  };
  /**
   * Hide the drag affordances/feedbacks.
   * @param {DvtGanttTaskShape=} exclude Optional shape to exclude from removal (e.g. useful during drag)
   */


  DvtGanttTaskNode.prototype.hideDnDArtifacts = function (exclude) {
    this.removeDragFeedbacks();
  };
  /**
   * Gets the task
   * @return {DvtGanttTask} the task
   */


  DvtGanttTaskNode.prototype.getTask = function () {
    return this._task;
  };
  /**
   * Gets the task label
   * @return {DvtGanttTaskLabel} the task label
   */


  DvtGanttTaskNode.prototype.getTaskLabel = function () {
    return this._taskLabel;
  };
  /**
   * Renders the task node
   * @param {dvt.Container} container the container to render the task container into.
   */


  DvtGanttTaskNode.prototype.render = function (container) {
    var finalStates; // Clear any dependencies from previous renders

    this.clearDependencies();
    if (this.isSelectable()) this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());
    if (this.getParent() != container) container.addChild(this); // Render task elements (labels will be rendered later, see DvtGanttRowNode.render())
    // If resize enabled, handles will be rendered after labels are rendered (see DvtGanttRowNode.render())
    // to sure handles are on top of everything

    this._task.render();

    this._getAriaTarget().setAriaRole('img');

    if (dvt.TimeAxis.supportsTouch()) {
      this.refreshAriaLabel();
    } // Update drag feedback positions


    this._updateDragFeedbacks();

    finalStates = {
      'x': this.getFinalX(),
      'y': this.getFinalY()
    };

    this._gantt.getAnimationManager().preAnimateTaskNode(this, finalStates);
  };
  /**
   * Removes the task node
   */


  DvtGanttTaskNode.prototype.remove = function () {
    var onEnd,
        self = this;

    onEnd = function onEnd() {
      self.getRowNode().removeChild(self);
    };

    this._gantt.getAnimationManager().preAnimateTaskNodeRemove(this, onEnd);
  };
  /**
   * Clears any stored predecessors and successors of the task
   */


  DvtGanttTaskNode.prototype.clearDependencies = function () {
    this._successors = null;
    this._predecessors = null;
  };
  /**
   * Adds a dependency line object that connects to its predecessor
   * @param {DvtGanttDependencyNode} predecessor
   */


  DvtGanttTaskNode.prototype.addPredecessorDependency = function (predecessor) {
    if (this._predecessors == null) this._predecessors = [];

    this._predecessors.push(predecessor);
  };
  /**
   * Gets a list of dependency line objects that connects to its predecessor
   * @return {DvtGanttDependencyNode[]} an array of dependency nodes
   */


  DvtGanttTaskNode.prototype.getPredecessorDependencies = function () {
    return this._predecessors;
  };
  /**
   * Adds a dependency line object that connects to its successor
   * @param {DvtGanttDependencyNode} successor
   */


  DvtGanttTaskNode.prototype.addSuccessorDependency = function (successor) {
    if (this._successors == null) this._successors = [];

    this._successors.push(successor);
  };
  /**
   * Gets a list of dependency line objects that connects to its successor
   * @return {DvtGanttDependencyNode[]} an array of dependency nodes
   */


  DvtGanttTaskNode.prototype.getSuccessorDependencies = function () {
    return this._successors;
  };
  /**
   * Gets final x (animation independent, e.g. final x after animation finishes)
   * @return {number} The final x.
   */


  DvtGanttTaskNode.prototype.getFinalX = function () {
    return this._taskObj['x'];
  };
  /**
   * Gets final y (animation independent, e.g. final y after animation finishes)
   * @return {number} The final y.
   */


  DvtGanttTaskNode.prototype.getFinalY = function () {
    return this._taskObj['y'];
  };
  /**
   * Gets final height (animation independent, e.g. final height after animation finishes)
   * @param {boolean=} excludeProgress Whether to exclude the progress height in the calculation
   * @return {number} The final height.
   */


  DvtGanttTaskNode.prototype.getFinalHeight = function (excludeProgress) {
    return this._task.getFinalHeight(excludeProgress);
  };
  /**
   * Gets the duration string
   * @param {number} startTime
   * @param {number} endTime
   * @return {string} The duration string.
   */


  DvtGanttTaskNode.prototype.getDuration = function (startTime, endTime) {
    var translations = this._gantt.getOptions().translations;

    var hours = 1000 * 60 * 60;
    var days = hours * 24;
    var duration = endTime - startTime;

    var scale = this._gantt.getMinorAxis().getScale();

    if (scale == 'hours' || scale == 'minutes' || scale == 'seconds') {
      duration = Math.round(duration / hours * 100) / 100;
      return dvt.ResourceUtils.format(translations.accessibleDurationHours, [duration]);
    } else {
      duration = Math.round(duration / days * 100) / 100;
      return dvt.ResourceUtils.format(translations.accessibleDurationDays, [duration]);
    }
  };
  /**
   * Gets the aria label
   * @return {string} the aria label string.
   */


  DvtGanttTaskNode.prototype.getAriaLabel = function () {
    var states = [];

    var options = this._gantt.getOptions();

    var translations = options.translations;
    var rowObj = this.getLayoutObject()['rowObj'];
    var treeLevelDesc = '';

    if (this._gantt.isRowsHierarchical()) {
      treeLevelDesc = translations.labelLevel + ' ' + rowObj['depth'] + ', ';
    } // If aria-label update is due to expand/collapse rerender,
    // return a simplified label consisting of the row label and expanded/collapsed state.


    if (this._gantt.getRenderState() != null) {
      var rowLabel = rowObj['data']['label'];
      if (rowLabel == null) rowLabel = translations.labelRow + ' ' + rowObj['index'] + 1;
      rowLabel = treeLevelDesc + rowLabel;
      if (rowObj['expanded'] != null) states.push(translations[rowObj['expanded'] ? 'stateExpanded' : 'stateCollapsed']);
      return dvt.Displayable.generateAriaLabel(rowLabel, states);
    }

    if (this.isSelectable()) states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
    var rowObj = this.getLayoutObject()['rowObj'];
    if (rowObj['expanded'] != null) states.push(translations.labelRow + ' ' + translations[rowObj['expanded'] ? 'stateExpanded' : 'stateCollapsed']);
    var shortDesc = DvtGanttTooltipUtils.getDatatip(this, false, true);

    if (this._task.isMilestone('main')) // note doesn't really make a difference if we query 'main' or 'baseline'
      {
        shortDesc = translations.accessibleTaskTypeMilestone + ', ' + shortDesc;
      } else if (this._task.isSummary('main')) // note doesn't really make a difference if we query 'main' or 'baseline'
      {
        shortDesc = translations.accessibleTaskTypeSummary + ', ' + shortDesc;
      }

    shortDesc = treeLevelDesc + shortDesc; // include hint of whether there are predecessors or successors

    if (this._predecessors != null || this._successors != null) {
      var depDesc = '';

      if (this._predecessors != null && this._predecessors.length > 0) {
        depDesc = dvt.ResourceUtils.format(translations.accessiblePredecessorInfo, [this._predecessors.length]); // for VoiceOver/Talkback we'll need to include the full detail of the dependency in the task since we can't
        // navigate to the dependency line directly

        if (dvt.TimeAxis.supportsTouch()) {
          for (var i = 0; i < this._predecessors.length; i++) {
            depDesc = depDesc + ', ' + this._predecessors[i].getAriaLabel();
          }
        }
      }

      if (this._successors != null && this._successors.length > 0) {
        if (depDesc.length > 0) depDesc = depDesc + ', ';
        depDesc = depDesc + dvt.ResourceUtils.format(translations.accessibleSuccessorInfo, [this._successors.length]);

        if (dvt.TimeAxis.supportsTouch()) {
          for (i = 0; i < this._successors.length; i++) {
            depDesc = depDesc + ', ' + this._successors[i].getAriaLabel();
          }
        }
      }

      if (depDesc.length > 0) shortDesc = shortDesc + ', ' + depDesc;
    }

    var ariaLabel = dvt.Displayable.generateAriaLabel(shortDesc, states);
    var currentAriaLabel = this.getAriaProperty('label'); // coming from setActiveElement() and nothing changed, must have been updated through selection, skipped

    if (currentAriaLabel != null && currentAriaLabel.indexOf(ariaLabel) > -1) return null;else return ariaLabel;
  };
  /**
   * Gets the target element object that should have aria properties set on it.
   * @return {dvt.Displayable} The target object
   * @private
   */


  DvtGanttTaskNode.prototype._getAriaTarget = function () {
    // In touch devices, if resize is enabled, we want the resize handles to be navigable by screenreader, e.g. iOS VoiceOver
    // If aria label is set on the task node, the VoiceOver cursor skips over the children handles, so we want to instead
    // place the aria properties on the main shape element.
    // In all other cases, aria properties should be set on the task node itself
    var mainShape = this.getTask().getShape('main');

    if (dvt.Agent.isTouchDevice() && this._gantt.isTaskResizeEnabled() && mainShape) {
      return mainShape;
    }

    return this;
  };
  /**
   * Refresh the aria-label with the current row index info
   * Called by DvtGanttTaskDependencyNode
   */


  DvtGanttTaskNode.prototype.refreshAriaLabel = function () {
    this._updateAriaLabel();
  };
  /**
   * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
   * when the activeElement is set.
   * @private
   */


  DvtGanttTaskNode.prototype._updateAriaLabel = function () {
    var ariaTarget = this._getAriaTarget();

    ariaTarget.setAriaProperty('label', this.getAriaLabel());
    ariaTarget.applyAriaProperties();
  };
  /**
   * Returns the data context (e.g. for passing to tooltip renderer, for DnD, etc.)
   * @return {object}
   */


  DvtGanttTaskNode.prototype.getDataContext = function () {
    var data = this.getData();
    var itemData = data['_itemData'];
    return {
      'data': this.getData(true),
      'rowData': this.getRowNode().getData(true),
      'itemData': itemData ? itemData : null,
      'color': DvtGanttTooltipUtils.getDatatipColor(this),
      'component': this._gantt.getOptions()['_widgetConstructor']
    };
  };
  /**
   * Gets a dataContext object that is meant to be updated/manipulated to reflect
   * any intermediate states of a task (e.g. the state of the task feedback during drag,
   * which is not final until dragend, and can potentially be cancelled before)
   * @return {object} Mutable dataContext object
   */


  DvtGanttTaskNode.prototype.getSandboxDataContext = function () {
    var data = this.getSandboxData(); // ensure dates are iso strings

    data['start'] = new Date(data['start']).toISOString();
    data['end'] = new Date(data['end']).toISOString();

    if (data['baseline']) {
      var baselineStart = data['baseline']['start'];
      var baselineEnd = data['baseline']['end'];
      data['baseline']['start'] = baselineStart != null ? new Date(baselineStart).toISOString() : null;
      data['baseline']['end'] = baselineEnd != null ? new Date(baselineEnd).toISOString() : null;
    }

    var itemData = this._taskObj['data']['_itemData'];
    var rowNode = data['_rowNode'];
    return {
      'data': data,
      'rowData': rowNode.getData(true),
      'itemData': itemData ? itemData : null,
      'color': DvtGanttTooltipUtils.getDatatipColor(this),
      'component': this._gantt.getOptions()['_widgetConstructor']
    };
  };
  /**
   * Sets selection state
   * @param {boolean} selected
   * @param {boolean=} enforceDOMLayering Whether to re-layer the DOM, which can be expensive. Defaults to true.
   * @private
   */


  DvtGanttTaskNode.prototype._setSelected = function (selected, enforceDOMLayering) {
    this._selected = selected;

    if (this._selected) {
      this._task.showEffect('selected');
    } else {
      this._task.removeEffect('selected', enforceDOMLayering);
    }

    this.refreshAriaLabel();

    this._gantt.setCurrentRow(this.getRowNode().getId());
  };
  /**
   * Clears selection state (without enforcing DOM layering)
   */


  DvtGanttTaskNode.prototype.clearSelectionState = function () {
    // Clear selection state only, and don't bother trying to enforce DOM layering
    this._setSelected(false, false);
  }; //---------------------------------------------------------------------//
  // Tooltip Support: DvtTooltipSource impl                              //
  //---------------------------------------------------------------------//

  /**
   * @override
   */


  DvtGanttTaskNode.prototype.getDatatip = function () {
    return DvtGanttTooltipUtils.getDatatip(this, true);
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.getDatatipColor = function () {
    return DvtGanttTooltipUtils.getDatatipColor(this);
  }; //---------------------------------------------------------------------//
  // Selection Support: DvtSelectable impl                               //
  //---------------------------------------------------------------------//

  /**
   * @override
   */


  DvtGanttTaskNode.prototype.isSelectable = function () {
    return this._gantt.getOptions()['selectionMode'] != 'none';
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.isSelected = function () {
    return this._selected;
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.setSelected = function (selected) {
    // Set selection and ensure proper DOM layering
    this._setSelected(selected, true);
  };
  /**
   * Show hover effect on task bar
   * @override
   */


  DvtGanttTaskNode.prototype.showHoverEffect = function () {
    this._task.showEffect('hover');
  };
  /**
   * Hide hover effect on task bar
   * @override
   */


  DvtGanttTaskNode.prototype.hideHoverEffect = function () {
    this._task.removeEffect('hover');
  }; //---------------------------------------------------------------------//
  // Keyboard Support: DvtKeyboardNavigable impl                        //
  //---------------------------------------------------------------------//

  /**
   * @override
   */


  DvtGanttTaskNode.prototype.getNextNavigable = function (event) {
    var next = null;

    var keyboardHandler = this._gantt.getEventManager().getKeyboardHandler();

    if (event.type == dvt.MouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event)) next = this;else if ((event.keyCode == dvt.KeyboardEvent.OPEN_ANGLED_BRACKET || dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET) && event.altKey) {
      // get first navigable dependency line if exists
      var keyboardHandler = this._gantt.getEventManager().getKeyboardHandler();

      if (keyboardHandler && keyboardHandler.getFirstNavigableDependencyLine) {
        if (dvt.Agent.isRightToLeft(this.getGantt().getCtx())) var type = event.keyCode == dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET ? 'predecessor' : 'successor';else type = event.keyCode == dvt.KeyboardEvent.OPEN_ANGLED_BRACKET ? 'predecessor' : 'successor';

        var dependencyLines = this._gantt.getNavigableDependencyLinesForTask(this, type);

        next = keyboardHandler.getFirstNavigableDependencyLine(this, event, dependencyLines);
      }

      if (next) next.setKeyboardFocusTask(this);else next = this;
    } // The normal navigation keys (up/down/right/left arrows) have different meanings in keyboard DnD mode, and handled separately in keyboardHandler
    else if (keyboardHandler.isNavigationEvent(event) && this._gantt.getEventManager().getKeyboardDnDMode() == null) next = DvtGanttKeyboardHandler.getNextNavigable(this._gantt, this, event);
    return next;
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.getTargetElem = function () {
    return this._task.getShape('main').getElem();
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.getKeyboardBoundingBox = function (targetCoordinateSpace) {
    return this.getDimensions(targetCoordinateSpace);
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.showKeyboardFocusEffect = function () {
    this._isShowingKeyboardFocusEffect = true;

    this._task.showEffect('focus'); // Scroll task into view


    var previousViewportStart = this._gantt.getViewportStartTime();

    var previousViewportEnd = this._gantt.getViewportEndTime();

    this.scrollIntoView(); // fire viewport change event if attempting to scroll into view causes viewport change

    if (this._gantt.getViewportStartTime() !== previousViewportStart || this._gantt.getViewportEndTime() !== previousViewportEnd) {
      this._gantt.dispatchEvent(this._gantt.createViewportChangeEvent());
    }
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.hideKeyboardFocusEffect = function () {
    if (this.isShowingKeyboardFocusEffect()) {
      this._isShowingKeyboardFocusEffect = false;
      this.hideHoverEffect();
    }
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.isShowingKeyboardFocusEffect = function () {
    return this._isShowingKeyboardFocusEffect;
  }; //---------------------------------------------------------------------//
  // DnD Support: DvtDraggable impl                                      //
  //---------------------------------------------------------------------//

  /**
   * @override
   */


  DvtGanttTaskNode.prototype.isDragAvailable = function (clientIds) {
    return true;
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.getDragTransferable = function (mouseX, mouseY) {
    return [this.getId()];
  };
  /**
   * @override
   */


  DvtGanttTaskNode.prototype.getDragFeedback = function (mouseX, mouseY) {
    // return null to not use the default ghost image--show something specific in showDragFeedback method instead.
    return null;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class representing a task, which manages a collection
   * of elements (the main shape, baseline, progress, etc).
   * @param {dvt.Gantt} gantt The gantt component
   * @param {DvtGanttTaskNode} container The containing task node
   * @class
   * @constructor
   */


  var DvtGanttTask = function DvtGanttTask(gantt, container) {
    this.Init(gantt, container);
  };

  dvt.Obj.createSubclass(DvtGanttTask, dvt.Obj);
  /**
   * @param {dvt.Gantt} gantt The gantt component
   * @param {DvtGanttTaskNode} container The containing task node
   * @protected
   */

  DvtGanttTask.prototype.Init = function (gantt, container) {
    this._gantt = gantt;
    this._container = container;
  };
  /**
   * Gets the gantt
   * @return {dvt.Gantt} The gantt
   */


  DvtGanttTask.prototype.getGantt = function () {
    return this._gantt;
  };
  /**
   * Gets the parent task node.
   * @return {DvtGanttTaskNode} the parent task node.
   */


  DvtGanttTask.prototype.getContainer = function () {
    return this._container;
  };
  /**
   * Gets a particular task shape
   * @param {string} shapeType The shape type
   * @return {DvtGanttTaskShape} the main shape
   */


  DvtGanttTask.prototype.getShape = function (shapeType) {
    if (shapeType === 'main') {
      return this._mainShape;
    }

    if (shapeType === 'progress') {
      return this._progressShape;
    }

    if (shapeType === 'baseline') {
      return this._baselineShape;
    }

    if (shapeType === 'mainResizeHandleStart') {
      return this._mainHandleStart;
    }

    if (shapeType === 'mainResizeHandleEnd') {
      return this._mainHandleEnd;
    }
  };
  /**
   * Retrieve the style of the task
   * @param {string=} property If not at the options root level, the property that would yield the options containing the svgStyle
   * @return {object} the style of the task
   */


  DvtGanttTask.prototype.getSvgStyle = function (property) {
    if (property == null) {
      return this._container.getValue('svgStyle');
    }

    return this._container.getValue(property, 'svgStyle');
  };
  /**
   * Retrieve the class name of the task
   * @param {string=} property If not at the options root level, the property that would yield the options containing the svgClassName
   * @return {string} the class name of the task
   */


  DvtGanttTask.prototype.getSvgClassName = function (property) {
    var svgClassName; // TODO: Once we finish deprecating 'className' just retrieve 'svgClassName'

    if (property == null) {
      svgClassName = this._container.getValue('svgClassName');
      return svgClassName ? svgClassName : this._container.getValue('className');
    }

    svgClassName = this._container.getValue(property, 'svgClassName');
    return svgClassName ? svgClassName : this._container.getValue(property, 'className');
  };
  /**
   * Applies svgStyle and svgClassname
   * @param {DvtGanttTaskShape} taskShape The target task shape
   * @param {string=} property If not at the options root level, the property that would yield the options containing the svgStyle/svgClassName
   * @private
   */


  DvtGanttTask.prototype._applyStyles = function (taskShape, property) {
    var svgClassName = this.getSvgClassName(property),
        svgStyle = this.getSvgStyle(property);

    if (svgClassName) {
      // Apply default class names, which also removes any previous svgClassNames
      taskShape.applyDefaultStyleClasses(); // Concatenate the default class names with the provided svgClassName

      taskShape.setClassName(taskShape.getClassName() + ' ' + svgClassName);
    }

    if (svgStyle) {
      taskShape.setStyle(svgStyle);
    }
  };
  /**
   * Whether the task element should be shown as a milestone
   * @param {string} elementType The task element in question
   * @return {boolean} whether the task element should be shown as a milestone
   */


  DvtGanttTask.prototype.isMilestone = function (elementType) {
    var start,
        end,
        type = this._container.getValue('type');

    if (type === 'milestone') {
      return true;
    } else if (type === 'auto') {
      if (elementType === 'mainDragFeedback' || DvtGanttTaskShape.MAIN_TYPES.indexOf(elementType) > -1) {
        start = this._container.getValue('start');
        end = this._container.getValue('end');
      } else if (DvtGanttTaskShape.BASELINE_TYPES.indexOf(elementType) > -1) {
        start = this._container.getValue('baseline', 'start');
        end = this._container.getValue('baseline', 'end');
      }

      return start != null && start == end;
    }

    return false;
  };
  /**
   * Whether the task element should be shown as a summary
   * @param {string} elementType The task element in question
   * @return {boolean} whether the task element should be shown as a summary
   */


  DvtGanttTask.prototype.isSummary = function (elementType) {
    // For now, whether a task is displayed as a summary is purely based on whether task type is 'summary'
    return elementType === 'main' && this._container.getValue('type') === 'summary';
  };
  /**
   * Gets positional information given start and end
   * @param {number} start
   * @param {number} end
   * @return {object} object containing positional information
   */


  DvtGanttTask.prototype.getTimeSpanDimensions = function (start, end) {
    var ganttMinTime = this._gantt.getStartTime(),
        ganttMaxTime = this._gantt.getEndTime(),
        ganttWidth = this._gantt.getContentLength(),
        isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx()),
        startPos,
        endPos;

    if (!(start == null && end == null)) {
      startPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, start, ganttWidth);
      endPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, end, ganttWidth);

      if (isRTL) {
        startPos = ganttWidth - startPos;
        endPos = ganttWidth - endPos;
      }

      return {
        'startPos': startPos,
        'endPos': endPos,
        'distance': endPos - startPos
      };
    }

    return null;
  };
  /**
   * Gets the fill color of the task main shape
   * @return {object} an object containing the following information:
   *                  'fill': the fill property of the task
   *                  'filter': the filter property of the task
   *                  'computedFill': the *actual* fill of the task, after the default tint/shade filter is applied
   */


  DvtGanttTask.prototype.getFillColor = function () {
    // Current design: fill color refers to main shape's fill color
    // Note cached value is cleared every new render in renderMain()
    if (this._fillColor == null) {
      if (this._mainShape == null) {
        return null;
      }

      this._fillColor = this._mainShape.getFillColor();
    }

    return this._fillColor;
  };
  /**
   * Gets the final height of the task (animation independent value)
   * @param {boolean=} excludeProgress Whether to exclude the progress height in the calculation
   * @return {number} The final height of the task in pixels
   */


  DvtGanttTask.prototype.getFinalHeight = function (excludeProgress) {
    var taskObj = this._container.getLayoutObject();

    return excludeProgress ? taskObj['overallHeightNoProgress'] : taskObj['overallHeight'];
  };
  /**
   * Shows the task effects
   * @param {string} effectType The effect type (selected, hover, or focus)
   */


  DvtGanttTask.prototype.showEffect = function (effectType) {
    this.showMainEffect(effectType);
  };
  /**
   * Removes the task effects
   * @param {string} effectType The effect type (selected, hover, or focus)
   * @param {boolean=} enforceDOMLayering Whether to re-layer the DOM, which can be expensive. Defaults to true.
   */


  DvtGanttTask.prototype.removeEffect = function (effectType, enforceDOMLayering) {
    this.removeMainEffect(effectType, enforceDOMLayering);
  };
  /**
   * Renders the elements that make up the task
   */


  DvtGanttTask.prototype.render = function () {
    // Task elements y positioning depends on progress bar height.
    var progressHeight = this._container.getValue('progress', 'height'); // Rendering in this order to ensure desired stacking on initial render


    this.renderBaseline(progressHeight);
    this.renderMain(progressHeight);
    this.renderProgress(progressHeight);

    if (this._container.getValue('type') === 'summary' && this._mainShape) {
      this._container.addChild(this._mainShape); // summary shapes should be on top of everything

    }
  };
  /**
   * Gets the render state of a particular task element
   * @param {string} shapeType
   * @return {string} the render state
   */


  DvtGanttTask.prototype.getRenderState = function (shapeType) {
    if (shapeType === 'main') {
      return this._mainShape.getRenderState();
    }

    if (shapeType === 'progress') {
      return this._progressShape.getRenderState();
    }

    if (shapeType === 'baseline') {
      return this._baselineShape.getRenderState();
    }
  };
  /**
   * Renders the baseline shape of the task.
   * @param {number} progressHeight The height of the progress bar, necessary for relative y positioning.
   */


  DvtGanttTask.prototype.renderBaseline = function (progressHeight) {
    var isMilestone,
        baselineProps = this._container.getValue('baseline'),
        baselineStart,
        baselineEnd,
        yOffset,
        self = this,
        finalStates,
        offsetDim,
        onRenderEnd,
        baselineDim,
        x,
        y,
        width,
        height,
        borderRadius;

    if (baselineProps) {
      // If type is "milestone", and if 'start' and 'end' values are specified and unequal, the 'start' value is used to evaluate position.
      baselineStart = this._container.getValue('baseline', 'start');
      baselineEnd = this._container.getValue('baseline', 'end');
      baselineDim = this.getTimeSpanDimensions(baselineStart, this._container.getValue('type') === 'milestone' && baselineStart != baselineEnd ? baselineStart : baselineEnd);

      if (baselineDim) {
        // Determine offset from main element
        offsetDim = this.getTimeSpanDimensions(this._container.getValue('start'), baselineStart);
        isMilestone = this.isMilestone('baseline'); // Calculate final dimensions

        x = offsetDim ? offsetDim['distance'] : 0;
        width = Math.abs(baselineDim['distance']);
        height = this._container.getValue('baseline', 'height');
        yOffset = isMilestone ? Math.max(this._container.getValue('height'), height) + DvtGanttStyleUtils.getMilestoneBaselineYOffset() - height : this._container.getValue('height');
        y = Math.max(0, (progressHeight - this._container.getValue('height')) / 2) + yOffset;
        borderRadius = baselineProps['borderRadius']; // element doesn't exist in DOM already

        if (this._baselineShape == null) {
          this._baselineShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, width, height, borderRadius, this, 'baseline');

          if (isMilestone) {
            // Ensure baseline milestone is behind actual milestone. Slight performance hit to ensure this, so don't bother for bar case.
            this._container.addChildAt(this._baselineShape, 0);
          } else {
            this._container.addChild(this._baselineShape); // Layering doesn't matter for bar case because there's no overlap.

          }

          this._baselineShape.setRenderState('add');
        } else {
          this._baselineShape.setRenderState('exist');

          if (isMilestone) // case where was bar baseline, but turned to milestone baseline on rerender, then make sure it's behind everything
            {
              this._container.addChildAt(this._baselineShape, 0);
            }
        } // Since final dimensions are not applied until after animations (if any), store
        // them so that they can be retrieved for calculating final dimensions for other elements


        this._baselineShape.setFinalWidth(width);

        this._baselineShape.setFinalHeight(height);

        this._baselineShape.setFinalX(x);

        this._baselineShape.setFinalY(y);

        onRenderEnd = function onRenderEnd() {
          // Apply styles (default classes handled by DvtGanttTaskShape instance)
          self._applyStyles(self._baselineShape, 'baseline');
        };

        finalStates = {
          'x': x,
          'y': y,
          'w': width,
          'h': height,
          'r': borderRadius
        };

        this._gantt.getAnimationManager().preAnimateTaskBaseline(this, this._baselineShape, finalStates, onRenderEnd);
      } else {
        this.removeBaseline();
      }
    } else {
      this.removeBaseline();
    }
  };
  /**
   * Removes the baseline shape.
   */


  DvtGanttTask.prototype.removeBaseline = function () {
    var self = this,
        onRemoveEnd;

    if (this._baselineShape) {
      onRemoveEnd = function onRemoveEnd() {
        self._container.removeChild(self._baselineShape);

        self._baselineShape = null;
      };

      this._gantt.getAnimationManager().preAnimateTaskBaselineRemove(this._baselineShape, onRemoveEnd);
    }
  };
  /**
   * Renders the main shape of the task
   * @param {number} progressHeight The height of the progress bar, necessary for relative y positioning.
   */


  DvtGanttTask.prototype.renderMain = function (progressHeight) {
    var taskProps = this._container.getData(),
        taskHeight = this._container.getValue('height'),
        start = this._container.getValue('start'),
        end = this._container.getValue('end'),
        self = this,
        finalStates,
        onRenderEnd,
        mainDim,
        x,
        y,
        width,
        height,
        borderRadius;

    if (taskProps) {
      // If type is "milestone", and if 'start' and 'end' values are specified and unequal, the 'start' value is used to evaluate position.
      mainDim = this.getTimeSpanDimensions(start, this._container.getValue('type') === 'milestone' && start != end ? start : end);

      if (mainDim) {
        // Calculate final dimensions
        x = 0;
        y = Math.max(0, (progressHeight - taskHeight) / 2);
        width = Math.abs(mainDim['distance']); // Summary task case, want the summary task shape to take on the full height

        height = this.isSummary('main') ? this._container.getFinalHeight(true) : taskHeight;
        borderRadius = this._container.getValue('borderRadius');

        if (this._mainShape == null) // element doesn't exist in DOM already
          {
            this._mainShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, width, height, borderRadius, this, 'main');

            this._container.addChild(this._mainShape);

            this._mainShape.setRenderState('add');
          } else {
          this._mainShape.setRenderState('exist');
        } // Since final dimensions are not applied until after animations (if any), store
        // them so that they can be retrieved for calculating final dimensions for other elements


        this._mainShape.setFinalWidth(width);

        this._mainShape.setFinalHeight(height);

        this._mainShape.setFinalX(x);

        this._mainShape.setFinalY(y); // Called at the end of animation (if any)


        onRenderEnd = function onRenderEnd() {
          // Apply styles (default classes handled by DvtGanttTaskShape instance)
          self._fillColor = null; // clear cached fill color

          self._applyStyles(self._mainShape);
        };

        finalStates = {
          'x': x,
          'y': y,
          'w': width,
          'h': height,
          'r': borderRadius
        };

        this._gantt.getAnimationManager().preAnimateTaskMain(this, finalStates, onRenderEnd);
      } else {
        this.removeMain();
      }
    } else {
      this.removeMain();
    }
  };
  /**
   * Renders the main shape effect
   * @param {string} effectType The effect type (selected, hover, or focus)
   */


  DvtGanttTask.prototype.showMainEffect = function (effectType) {
    // Get main shape dimensions
    var x = this._mainShape.getX(),
        y = this._mainShape.getY(),
        w = this._mainShape.getWidth(),
        h = this._mainShape.getHeight(),
        r = this._mainShape.getBorderRadius(); // Layer given task node over all other tasks,
    // while keeping all tasks with overlap behavior 'overlay' at the very top


    var floatTaskToTop = function floatTaskToTop(taskNode) {
      var rowNode = taskNode.getRowNode();
      var rowObj = rowNode.getLayoutObject();
      var taskObj = taskNode.getLayoutObject();
      var earliestOverlayTaskObj = rowObj['earliestOverlayTaskObj'];
      var taskNodeParent = taskNode.getParent();

      if (earliestOverlayTaskObj && taskObj['_overlayBehavior'] !== 'overlay') {
        var earliestOverlayTaskNode = earliestOverlayTaskObj['node'];
        var earliestOverlayTaskNodeInd = taskNodeParent.getChildIndex(earliestOverlayTaskNode);
        taskNodeParent.addChildAt(taskNode, earliestOverlayTaskNodeInd - 1);
      } else {
        taskNodeParent.addChild(taskNode);
      }
    };

    if (effectType === 'selected') {
      if (this._mainSelectShape == null) {
        this._mainSelectShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, w, h, r, this, 'mainSelect'); // must be inserted before the main shape

        this._container.addChildAt(this._mainSelectShape, 0); // Layer this taskNode in front of all other taskNodes in the row (see )


        floatTaskToTop(this._container);
      }
    } else if (effectType === 'hover' || effectType === 'focus') {
      if (this._mainHoverShape == null) {
        this._mainHoverShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, w, h, r, this, 'mainHover'); // must be inserted before the shape and after selected effect (if any)
        // easiest way to gaurantee this would be to insert immediately before main shape

        this._container.addChildAt(this._mainHoverShape, this._container.getChildIndex(this._mainShape)); // Layer this taskNode in front of all other taskNodes in the row (see )


        floatTaskToTop(this._container);
      }
    }
  };
  /**
   * Removes the main shape effect
   * @param {string} effectType The effect type (selected, hover, or focus)
   * @param {boolean=} enforceDOMLayering Whether to re-layer the DOM, which can be expensive. Defaults to true.
   */


  DvtGanttTask.prototype.removeMainEffect = function (effectType, enforceDOMLayering) {
    enforceDOMLayering = enforceDOMLayering === undefined ? true : enforceDOMLayering;

    if (effectType === 'selected') {
      if (this._mainSelectShape != null) {
        this._container.removeChild(this._mainSelectShape);
      }

      this._mainSelectShape = null;
    } else if (effectType === 'hover' || effectType === 'focus') {
      if (this._mainHoverShape != null) {
        this._container.removeChild(this._mainHoverShape);
      }

      this._mainHoverShape = null;
    } // Reparent the tasks such that selected tasks are on top in selection order,
    // and all the other tasks are layered in render order (chronological order).
    // Overlay tasks are placed at the very top.


    if (enforceDOMLayering) {
      var selectedNonOverlayNodes = [];
      var selectedOverlayNodes = [];

      var currentRowNode = this._container.getRowNode();

      if (this._gantt.isSelectionSupported()) {
        var selection = this._gantt.getSelectionHandler().getSelection();

        for (var j = 0; j < selection.length; j++) {
          if (selection[j] instanceof DvtGanttTaskNode && selection[j].getRowNode() === currentRowNode) {
            var selectionTaskObj = selection[j].getLayoutObject();

            if (selectionTaskObj['overlapBehavior'] === 'overlay') {
              selectedOverlayNodes.push(selection[j]);
            } else {
              selectedNonOverlayNodes.push(selection[j]);
            }
          }
        }
      }

      var containerParent = this._container.getParent();

      var rowTaskObjs = currentRowNode.getRenderOrderTaskObjs();
      var earliestOverlayTaskNode = currentRowNode.getLayoutObject()['earliestOverlayTaskObj'];

      for (var i = 0; i < rowTaskObjs.length; i++) {
        var taskObj = rowTaskObjs[i];
        var taskNode = taskObj['node'];

        if (taskNode === earliestOverlayTaskNode) {
          selectedNonOverlayNodes.forEach(containerParent.addChild, containerParent);
        }

        if (!taskNode.isSelected()) {
          containerParent.addChild(taskNode);
        }
      }

      if (earliestOverlayTaskNode == null) {
        selectedNonOverlayNodes.forEach(containerParent.addChild, containerParent);
      }

      selectedOverlayNodes.forEach(containerParent.addChild, containerParent);
    }
  };
  /**
   * Gets the width of the main shape
   * @return {number} The width of the main shape
   */


  DvtGanttTask.prototype.getMainWidth = function () {
    return this._mainShape.getWidth();
  };
  /**
   * Sets the width of the main shape
   * @param {number} width The width of the main shape
   */


  DvtGanttTask.prototype.setMainWidth = function (width) {
    this._mainShape.setWidth(width);

    if (this._mainSelectShape) {
      this._mainSelectShape.setWidth(width);
    }

    if (this._mainHoverShape) {
      this._mainHoverShape.setWidth(width);
    }
  };
  /**
   * Gets the height of the main shape
   * @return {number} The height of the main shape
   */


  DvtGanttTask.prototype.getMainHeight = function () {
    return this._mainShape.getHeight();
  };
  /**
   * Sets the height of the main shape
   * @param {number} height The height of the main shape
   */


  DvtGanttTask.prototype.setMainHeight = function (height) {
    this._mainShape.setHeight(height);

    if (this._mainSelectShape) {
      this._mainSelectShape.setHeight(height);
    }

    if (this._mainHoverShape) {
      this._mainHoverShape.setHeight(height);
    }
  };
  /**
   * Gets the x of the main shape
   * @return {number} The x of the main shape
   */


  DvtGanttTask.prototype.getMainX = function () {
    return this._mainShape.getX();
  };
  /**
   * Sets the x of the main shape
   * @param {number} x The x of the main shape
   */


  DvtGanttTask.prototype.setMainX = function (x) {
    this._mainShape.setX(x);

    if (this._mainSelectShape) {
      this._mainSelectShape.setX(x);
    }

    if (this._mainHoverShape) {
      this._mainHoverShape.setX(x);
    }
  };
  /**
   * Gets the y of the main shape
   * @return {number} The y of the main shape
   */


  DvtGanttTask.prototype.getMainY = function () {
    return this._mainShape.getY();
  };
  /**
   * Sets the y of the main shape
   * @param {number} y The y of the main shape
   */


  DvtGanttTask.prototype.setMainY = function (y) {
    this._mainShape.setY(y);

    if (this._mainSelectShape) {
      this._mainSelectShape.setY(y);
    }

    if (this._mainHoverShape) {
      this._mainHoverShape.setY(y);
    }
  };
  /**
   * Gets the border radius of the main shape
   * @return {string} The border radius of the main shape
   */


  DvtGanttTask.prototype.getMainBorderRadius = function () {
    return this._mainShape.getY();
  };
  /**
   * Sets the border radius of the main shape
   * @param {string} r The border radius of the main shape
   */


  DvtGanttTask.prototype.setMainBorderRadius = function (r) {
    this._mainShape.setBorderRadius(r);

    if (this._mainSelectShape) {
      this._mainSelectShape.setBorderRadius(r);
    }

    if (this._mainHoverShape) {
      this._mainHoverShape.setBorderRadius(r);
    }
  };
  /**
   * Sets the dimension of the main shape all at once
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {string} r
   */


  DvtGanttTask.prototype.setMainDimensions = function (x, y, w, h, r) {
    this._mainShape.setDimensions(x, y, w, h, r);

    if (this._mainSelectShape) {
      this._mainSelectShape.setDimensions(x, y, w, h, r);
    }

    if (this._mainHoverShape) {
      this._mainHoverShape.setDimensions(x, y, w, h, r);
    }
  };
  /**
   * Removes the main shape
   */


  DvtGanttTask.prototype.removeMain = function () {
    var self = this,
        onRemoveEnd;

    if (this._mainShape) {
      onRemoveEnd = function onRemoveEnd() {
        self.removeMainEffect('selected', false);

        self._container.removeChild(self._mainShape);

        self._mainShape = null; // remove progress as well

        self.removeProgress();
      };

      this._gantt.getAnimationManager().preAnimateTaskMainRemove(this._mainShape, this._mainSelectShape, this._mainHoverShape, onRemoveEnd);
    }
  };
  /**
   * Gets the progress value.
   * @return {number} The progress value. Null if invalid.
   */


  DvtGanttTask.prototype.getProgressValue = function () {
    var progressValue = this._container.getValue('progress', 'value');

    if (!this.isMilestone('main') && typeof progressValue === 'number') {
      return progressValue;
    }

    return null;
  };
  /**
   * Renders the progress shape of the task.
   * @param {number} progressHeight The height of the progress bar in pixels.
   */


  DvtGanttTask.prototype.renderProgress = function (progressHeight) {
    var progressProps = this._container.getValue('progress'),
        taskHeight = this._container.getValue('height'),
        progressValue = this.getProgressValue(),
        self = this,
        onRenderEnd,
        finalStates,
        progressDim,
        x,
        y,
        width,
        height,
        borderRadius;

    if (progressValue !== null && this._mainShape && !this.isMilestone('main')) {
      // Calculate final dimensions
      x = 0;
      y = Math.max(0, (taskHeight - progressHeight) / 2);
      width = progressValue * this._mainShape.getFinalWidth();
      borderRadius = this._container.getValue('progress', 'borderRadius');

      if (this._progressShape == null) // element doesn't exist in DOM already
        {
          this._progressShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, width, progressHeight, borderRadius, this, 'progress');

          this._container.addChild(this._progressShape);

          this._progressShape.setRenderState('add');
        } else {
        this._progressShape.setRenderState('exist');
      }

      this._progressShape.setFinalWidth(width);

      this._progressShape.setFinalHeight(progressHeight);

      this._progressShape.setFinalX(x);

      this._progressShape.setFinalY(y);

      onRenderEnd = function onRenderEnd() {
        // Apply styles (default classes handled by DvtGanttTaskShape instance)
        self._applyStyles(self._progressShape, 'progress');
      };

      finalStates = {
        'x': x,
        'y': y,
        'w': width,
        'h': progressHeight,
        'r': borderRadius
      };

      this._gantt.getAnimationManager().preAnimateTaskProgress(this, this._progressShape, finalStates, onRenderEnd);
    } else {
      this.removeProgress();
    }
  };
  /**
   * Removes the progress shape.
   */


  DvtGanttTask.prototype.removeProgress = function () {
    var self = this,
        onRemoveEnd;

    if (this._progressShape) {
      onRemoveEnd = function onRemoveEnd() {
        self._container.removeChild(self._progressShape);

        self._progressShape = null;
      };

      this._gantt.getAnimationManager().preAnimateTaskProgressRemove(this._progressShape, onRemoveEnd);
    }
  };
  /**
   * Renders resize handles
   * @param {dvt.Container} container The container to render into
   */


  DvtGanttTask.prototype.renderMainResizeHandles = function (container) {
    var orientationFactor = dvt.Agent.isRightToLeft(this._gantt.getCtx()) ? -1 : 1,
        handleWidth,
        x,
        y,
        w,
        h;

    if (this._mainShape) {
      handleWidth = DvtGanttStyleUtils.getTaskResizeHandleWidth();
      x = this._mainShape.getX() - orientationFactor * this._mainShape.getPhysicalStartOffset();
      y = this._mainShape.getY();
      w = this._mainShape.getWidth() + this._mainShape.getPhysicalStartOffset() + this._mainShape.getPhysicalEndOffset();
      h = this._mainShape.getHeight();
      var self = this;

      var setHandleAriaProperties = function setHandleAriaProperties(handle, type) {
        if (dvt.Agent.isTouchDevice()) {
          var translations = self._gantt.getOptions().translations;

          var ariaLabel = type === 'start' ? translations.taskResizeStartHandle : translations.taskResizeEndHandle;
          handle.setAriaRole('img');
          handle.setAriaProperty('label', ariaLabel);
          handle.applyAriaProperties();
        }
      };

      if (!this._mainHandleStart) {
        this._mainHandleStart = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, handleWidth, h, '0', this, 'mainResizeHandleStart');
        setHandleAriaProperties(this._mainHandleStart, 'start');
      } else {
        this._mainHandleStart.setDimensions(x, y, handleWidth, h, '0');
      }

      container.addChild(this._mainHandleStart);

      if (!this._mainHandleEnd) {
        this._mainHandleEnd = new DvtGanttTaskShape(this._gantt.getCtx(), x + orientationFactor * (w - handleWidth), y, handleWidth, h, '0', this, 'mainResizeHandleEnd');
        setHandleAriaProperties(this._mainHandleEnd, 'end');
      } else {
        this._mainHandleEnd.setDimensions(x + orientationFactor * (w - handleWidth), y, handleWidth, h, '0');
      }

      container.addChild(this._mainHandleEnd);
    }
  };
  /**
   * Remove handles
   * @param {DvtGanttTaskShape=} exclude Optional handle to exclude from removal (e.g. useful during drag)
   */


  DvtGanttTask.prototype.removeHandles = function (exclude) {
    if (this._mainHandleStart && exclude !== this._mainHandleStart) {
      this._mainHandleStart.getParent().removeChild(this._mainHandleStart);

      this._mainHandleStart = null;
    }

    if (this._mainHandleEnd && exclude !== this._mainHandleEnd) {
      this._mainHandleEnd.getParent().removeChild(this._mainHandleEnd);

      this._mainHandleEnd = null;
    }
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class that manages a task label
   * @param {dvt.Gantt} gantt The gantt component
   * @param {DvtGanttTaskNode} container The containing task node
   * @param {DvtGanttTaskShape} associatedShape The associated shape the label is for
   * @class
   * @constructor
   */


  var DvtGanttTaskLabel = function DvtGanttTaskLabel(gantt, container, associatedShape) {
    this.Init(gantt, container, associatedShape);
  };

  dvt.Obj.createSubclass(DvtGanttTaskLabel, dvt.Obj);
  /**
   * @param {dvt.Gantt} gantt The gantt component
   * @param {DvtGanttTaskNode} container The containing task node
   * @param {DvtGanttTaskShape} associatedShape The associated shape the label is for
   * @class
   * @constructor
   */

  DvtGanttTaskLabel.prototype.Init = function (gantt, container, associatedShape) {
    this._gantt = gantt;
    this._container = container;
    this._associatedShape = associatedShape;
    this._renderState = 'add';
  };
  /**
   * Gets the gantt
   * @return {dvt.Gantt} The gantt
   */


  DvtGanttTaskLabel.prototype.getGantt = function () {
    return this._gantt;
  };
  /**
   * Gets the associated shape
   * @return {DvtGanttTaskShape} the associated shape
   */


  DvtGanttTaskLabel.prototype.getAssociatedShape = function () {
    return this._associatedShape;
  };
  /**
   * Sets the associated shape
   * @param {DvtGanttTaskShape} shape The associated shape
   */


  DvtGanttTaskLabel.prototype.setAssociatedShape = function (shape) {
    this._associatedShape = shape;
  };
  /**
   * Gets the label output text object
   * @return {dvt.OutputText} the label output text
   */


  DvtGanttTaskLabel.prototype.getLabelOutputText = function () {
    return this._labelOutputText;
  };
  /**
   * Gets the effective label position (e.g. labelPosition = 'auto', but actually placed at 'end').
   * @return {string} The effective label position.
   */


  DvtGanttTaskLabel.prototype.getEffectiveLabelPosition = function () {
    return this._effectiveLabelPosition;
  };
  /**
   * Gets the render state of the label
   * @return {string} the render state
   */


  DvtGanttTaskLabel.prototype.getRenderState = function () {
    return this._renderState;
  };
  /**
   * Applies styles on the label
   * @param {string|object} labelStyle
   * @private
   */


  DvtGanttTaskLabel.prototype._applyStyles = function (labelStyle) {
    var labelCSSStyle;

    if (labelStyle != null) {
      // Get the base label style dvt.CSSStyle object. Should not grab the one from cache
      // because we're going to be modifying it.
      labelCSSStyle = DvtGanttStyleUtils.getTaskLabelStyle(this._gantt.getOptions());
      labelCSSStyle.parseInlineStyle(labelStyle);

      this._labelOutputText.setStyle(labelStyle); // works if style is object

    } else {
      // Grab the base label style dvt.CSSStyle object from cache rather than instantiating
      // a new one for performance reasons
      labelCSSStyle = this._gantt.getCache().getFromCache('baseTaskLabelCSSStyle');
    } // necessary for getDimension/fitText to obtain CSS style of the text


    this._labelOutputText.setCSSStyle(labelCSSStyle);
  };
  /**
   * Positions the label accordingly.
   * @param {string} effectiveLabelPosition The effective label position.
   * @private
   */


  DvtGanttTaskLabel.prototype._placeLabel = function (effectiveLabelPosition) {
    var labelDimensions = this._labelOutputText.getDimensions(),
        isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx()),
        shapeLeftOffset,
        shapeRightOffset,
        shapeWidth,
        padding = DvtGanttStyleUtils.getTaskLabelPadding(),
        x,
        y,
        associatedShapeHeight;

    if (effectiveLabelPosition === 'progress' || effectiveLabelPosition === 'progressStart') {
      this.setAssociatedShape(this._container.getTask().getShape('progress'));
    } // Determine y position


    associatedShapeHeight = this._associatedShape.getType() === 'main' && this._container.getTask().isSummary('main') ? this._container.getLayoutObject()['height'] : this._associatedShape.getFinalHeight();
    y = this._associatedShape.getFinalY() + (associatedShapeHeight - labelDimensions.h) / 2;
    this.setFinalY(y); // Determine x position (calculate LTR version, then flip for RTL)

    shapeWidth = this._associatedShape.getFinalWidth();
    shapeLeftOffset = !isRTL ? this._associatedShape.getPhysicalStartOffset() : this._associatedShape.getPhysicalEndOffset();
    shapeRightOffset = !isRTL ? this._associatedShape.getPhysicalEndOffset() : this._associatedShape.getPhysicalStartOffset();

    switch (effectiveLabelPosition) {
      case 'end':
        !isRTL ? this._labelOutputText.alignLeft() : this._labelOutputText.alignRight();
        x = shapeWidth + shapeRightOffset + padding;
        break;

      case 'progress':
        !isRTL ? this._labelOutputText.alignRight() : this._labelOutputText.alignLeft();
        x = shapeWidth - padding;
        break;

      case 'oProgress':
        !isRTL ? this._labelOutputText.alignLeft() : this._labelOutputText.alignRight();
        x = this._container.getTask().getShape('progress').getFinalWidth() + padding;
        break;

      case 'innerStart':
      case 'progressStart':
        !isRTL ? this._labelOutputText.alignLeft() : this._labelOutputText.alignRight();
        x = -shapeLeftOffset + padding;
        break;

      case 'innerEnd':
        !isRTL ? this._labelOutputText.alignRight() : this._labelOutputText.alignLeft();
        x = shapeWidth + shapeRightOffset - padding;
        break;

      case 'innerCenter':
        this._labelOutputText.alignCenter();

        x = shapeWidth / 2;
        break;

      case 'start':
        !isRTL ? this._labelOutputText.alignRight() : this._labelOutputText.alignLeft();
        x = -(shapeLeftOffset + padding);
        break;
    }

    if (isRTL) {
      x = -x;
    }

    this.setFinalX(x);
    this._effectiveLabelPosition = effectiveLabelPosition;
  };
  /**
   * Gets the available width for the label at query position relative to the task.
   * @param {string} position The query position.
   * @return {object} Object containing info on available width and effective position.
   * @private
   */


  DvtGanttTaskLabel.prototype._getAvailableWidth = function (position) {
    var startBarrier,
        endBarrier,
        previousAdjacentTaskNode,
        nextAdjacentTaskNode,
        task,
        nextAdjacentMilestoneBaselineTaskNode,
        previousAdjacentMilestoneBaselineTaskNode,
        taskMainBounds,
        progressShape,
        progressWidth,
        progressHeight,
        insideWidth,
        oProgressWidth,
        availableWidth,
        effectivePosition,
        labelDimensions,
        padding = DvtGanttStyleUtils.getTaskLabelPadding(),
        hasProgress,
        isMilestone,
        isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx()),
        ganttWidth = this._gantt.getContentLength(),
        ganttStartPos,
        ganttEndPos,
        isPositionBlocked = false; // Calculate Gantt bounds


    ganttStartPos = !isRTL ? 0 : ganttWidth;
    ganttEndPos = ganttWidth - ganttStartPos;

    switch (position) {
      case 'end':
      case 'end_ABSOLUTE':
        effectivePosition = 'end';
        endBarrier = ganttEndPos;
        nextAdjacentTaskNode = this._container.getNextAdjacentTaskNode();
        nextAdjacentMilestoneBaselineTaskNode = this._container.getNextAdjMilestoneBaselineTaskNode(); // The case where row height is set and overlapping task staggering is disabled, and the position is blocked

        if (nextAdjacentTaskNode && nextAdjacentTaskNode.getValue('start') < this._container.getValue('end') && nextAdjacentTaskNode.getValue('end') > this._container.getValue('end')) {
          availableWidth = 0;
          break;
        }

        while (nextAdjacentTaskNode && nextAdjacentTaskNode.getValue('start') < this._container.getValue('end') && nextAdjacentTaskNode.getValue('end') < this._container.getValue('end')) {
          nextAdjacentTaskNode = nextAdjacentTaskNode.getNextAdjacentTaskNode();
        }

        if (nextAdjacentTaskNode) {
          endBarrier = nextAdjacentTaskNode.getTaskShapePhysicalBounds('main')['startPos'];
        }

        if (nextAdjacentMilestoneBaselineTaskNode) {
          endBarrier = isRTL ? Math.max(endBarrier, nextAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')['startPos']) : Math.min(endBarrier, nextAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')['startPos']);
        }

        availableWidth = Math.abs(this._container.getTaskShapePhysicalBounds('main')['endPos'] - endBarrier) - 2 * padding;
        break;

      case 'innerCenter':
      case 'innerStart':
      case 'innerEnd':
        // The case where row height is set and overlapping task staggering is disabled, and the position is blocked
        // Only consider this case in the array label position cases. In the absolute cases, and all innerStart cases,
        // just show the labels anyway.
        nextAdjacentTaskNode = this._container.getNextAdjacentTaskNode();

        if (nextAdjacentTaskNode) {
          if (position === 'innerCenter') isPositionBlocked = nextAdjacentTaskNode.getValue('start') < this._container.getValue('start') + (this._container.getValue('end') - this._container.getValue('start')) / 2;else if (position === 'innerEnd') isPositionBlocked = nextAdjacentTaskNode.getValue('start') < this._container.getValue('end');
        }

      case 'innerCenter_ABSOLUTE':
      case 'innerStart_ABSOLUTE':
      case 'innerEnd_ABSOLUTE':
        // normalize the _ABSOLUTE positions to the effective position name
        if (position.slice(-'_ABSOLUTE'.length) === '_ABSOLUTE') position = position.slice(0, -'_ABSOLUTE'.length);
        hasProgress = typeof this._container.getValue('progress', 'value') === 'number';
        task = this._container.getTask();
        isMilestone = task.isMilestone('main');

        if (!isMilestone) {
          if (isPositionBlocked) {
            availableWidth = 0;
            effectivePosition = position;
            break;
          }

          taskMainBounds = this._container.getTaskShapePhysicalBounds('main');
          insideWidth = Math.abs(taskMainBounds['endPos'] - taskMainBounds['startPos']);

          if (hasProgress) {
            labelDimensions = this._labelOutputText.getDimensions();
            progressShape = task.getShape('progress');

            if (progressShape) {
              progressWidth = progressShape.getFinalWidth();
              progressHeight = progressShape.getFinalHeight();
            } else {
              progressWidth = 0;
              progressHeight = 0;
            }

            oProgressWidth = insideWidth - progressWidth; // For 'innerStart', check if we can honor that even when there's a progress

            if (position === 'innerStart') {
              availableWidth = progressWidth - 2 * padding;

              if (labelDimensions.w <= availableWidth && labelDimensions.h <= progressHeight) {
                effectivePosition = 'progressStart';
                break;
              }
            } // For 'innerEnd', check if we can honor that even when there's a progress
            else if (position === 'innerEnd') {
                availableWidth = oProgressWidth - 2 * padding;

                if (labelDimensions.w < availableWidth) {
                  effectivePosition = 'innerEnd';
                  break;
                }
              } // If 'innerCenter', or 'innerStart'/'innerEnd' can't be honored due to lack of space, do smart behavior


            if (labelDimensions.h <= progressHeight && progressWidth > oProgressWidth) // Label inside progress condition
              {
                availableWidth = progressWidth - 2 * padding;
                effectivePosition = 'progress';
              } else // Label inside oProgress condition
              {
                availableWidth = oProgressWidth - 2 * padding;
                effectivePosition = 'oProgress';
              }

            break;
          }

          availableWidth = insideWidth - 2 * padding;
          effectivePosition = position;
          break;
        }

        availableWidth = 0;
        effectivePosition = position;
        break;

      case 'start':
      case 'start_ABSOLUTE':
        effectivePosition = 'start';
        startBarrier = ganttStartPos;
        previousAdjacentTaskNode = this._container.getPreviousAdjacentTaskNode();
        previousAdjacentMilestoneBaselineTaskNode = this._container.getPrevAdjMilestoneBaselineTaskNode(); // The case where row height is set and overlapping task staggering is disabled, and the position is blocked

        if (previousAdjacentTaskNode && previousAdjacentTaskNode.getValue('end') > this._container.getValue('start')) {
          availableWidth = 0;
          break;
        }

        if (previousAdjacentTaskNode) {
          startBarrier = previousAdjacentTaskNode.getTaskShapePhysicalBounds('main', true)['endPos'];
        }

        if (previousAdjacentMilestoneBaselineTaskNode) {
          startBarrier = isRTL ? Math.min(startBarrier, previousAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')['endPos']) : Math.max(startBarrier, previousAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')['endPos']);
        }

        availableWidth = Math.abs(startBarrier - this._container.getTaskShapePhysicalBounds('main')['startPos']) - 2 * padding;
        break;

      default:
        return null;
    }

    return [effectivePosition, availableWidth];
  };
  /**
   * Preprocesses the labelPosition from options.
   * @param {string|Array} labelPosition The labelPosition from options
   * @return {Array} The sanitized array of label positions
   * @private
   */


  DvtGanttTaskLabel.prototype._preprocessLabelPosition = function (labelPosition) {
    var isMilestone = this._container.getTask().isMilestone('main');

    if (typeof labelPosition === 'string') {
      // For milestone case, map inner label positions outside
      if (isMilestone) {
        switch (labelPosition) {
          case 'innerCenter':
            labelPosition = 'end';
            break;

          case 'innerEnd':
            labelPosition = 'end';
            break;

          case 'innerStart':
            labelPosition = 'start';
            break;
        }
      }

      return [labelPosition + '_ABSOLUTE']; // '_ABSOLUTE' flag to signify absolute positioning
    } else if (Array.isArray(labelPosition)) {
      if (isMilestone) {
        // For milestone case, map inner label positions outside
        return labelPosition.map(function (position) {
          switch (position) {
            case 'innerCenter':
              return 'end';

            case 'innerEnd':
              return 'end';

            case 'innerStart':
              return 'start';

            default:
              return position;
          }
        });
      }

      return labelPosition;
    }

    return [];
  };
  /**
   * Process and place label accordingly based on given labelPosition from options.
   * @param {string|Array} labelPosition The labelPosition from options.
   * @return {boolean} whether position evaluation is successful
   * @private
   */


  DvtGanttTaskLabel.prototype._evaluatePosition = function (labelPosition) {
    var traversalCache = {},
        effectivePosition,
        availableWidth,
        labelDimensions = this._labelOutputText.getDimensions(),
        labelWidth = labelDimensions.w,
        labelHeight = labelDimensions.h,
        labelPosition = this._preprocessLabelPosition(labelPosition);

    var largestPosition;
    var largestAvailableWidth = 0;

    for (var i = 0; i < labelPosition.length; i++) {
      var queryPosition = labelPosition[i];

      if (queryPosition === 'max') {
        if (largestPosition != null) {
          var result = traversalCache[largestPosition];
          effectivePosition = result[0];
          availableWidth = result[1];
          break;
        } else {
          continue; // 'max' is first valid position evaluated in the array, thus meaningless.
        }
      }

      if (traversalCache[queryPosition]) {
        result = traversalCache[queryPosition];
      } else {
        result = this._getAvailableWidth(queryPosition);
        traversalCache[queryPosition] = result;
      }

      if (result) {
        effectivePosition = result[0];
        availableWidth = result[1];

        if (labelWidth <= availableWidth) {
          break; // Found a position that can display the label fully
        }

        if (availableWidth > largestAvailableWidth) {
          largestAvailableWidth = availableWidth;
          largestPosition = queryPosition;
        }
      }
    }

    if (effectivePosition == null) {
      return false;
    } // Truncate label if necessary


    if (labelWidth > availableWidth) {
      dvt.TextUtils.fitText(this._labelOutputText, availableWidth, Infinity, this._container, 1);
    }

    this._placeLabel(effectivePosition);

    return true;
  };
  /**
   * Renders the task label
   */


  DvtGanttTaskLabel.prototype.render = function () {
    var label = this._container.getValue('label'),
        labelPosition = this._container.getValue('labelPosition'),
        labelStyle = this._container.getValue('labelStyle'),
        finalStates,
        isPositionFeasible,
        self = this,
        onRenderEnd,
        styleClass = this._gantt.GetStyleClass('taskLabel');

    this._renderState = 'exist';

    if (label != null && label.length > 0 && labelPosition !== 'none' && this._associatedShape) {
      if (this._labelOutputText == null) {
        this._labelOutputText = new dvt.OutputText(this._gantt.getCtx(), label, 0, 0);

        if (this._gantt.getEventManager().IsDragSupported('tasks')) {
          styleClass += ' ' + this._gantt.GetStyleClass('draggable');
        }

        this._labelOutputText.setClassName(styleClass);

        this._renderState = 'add';
      } // Make sure label outputtext is in the DOM, e.g. may have been removed by fitText in the previous render


      if (this._labelOutputText.getParent() == null) {
        this._container.addChild(this._labelOutputText);
      }

      this._labelOutputText.setTextString(label); // Apply styles; necessary before positioning because position is font size dependent


      this._applyStyles(labelStyle);

      isPositionFeasible = this._evaluatePosition(labelPosition);

      if (isPositionFeasible) {
        // Called at the end of animation (if any)
        onRenderEnd = function onRenderEnd() {
          var labelColor, fillColor; // Apply contrast text color depending on background color

          switch (self._effectiveLabelPosition) {
            case 'innerCenter':
            case 'innerEnd':
            case 'innerStart':
            case 'progressStart':
            case 'progress':
            case 'oProgress':
              fillColor = self._associatedShape.getFillColor();
              labelColor = dvt.ColorUtils.getContrastingTextColor(fillColor ? fillColor['computedFill'] : null);

              if (labelColor != null) {
                self._labelOutputText.setFill(new dvt.SolidFill(labelColor));
              }

              break;
          }
        };

        finalStates = {
          'x': this.getFinalX(),
          'y': this.getFinalY()
        };

        this._gantt.getAnimationManager().preAnimateTaskLabel(this._container, finalStates, onRenderEnd);
      } else {
        this.remove();
      }
    } else // if label not specified/empty/invalid or labelPosition == 'none', don't render anything. If something there before, remove it.
      {
        this.remove();
      }
  };
  /**
   * Removes the task label
   */


  DvtGanttTaskLabel.prototype.remove = function () {
    var self = this,
        onRemoveEnd;

    if (this._labelOutputText) {
      onRemoveEnd = function onRemoveEnd() {
        self._container.removeChild(self._labelOutputText);

        self._labelOutputText = null;
        self._effectiveLabelPosition = null;
      };

      this._gantt.getAnimationManager().preAnimateTaskLabelRemove(this._labelOutputText, onRemoveEnd);
    }
  };
  /**
   * Gets the final x (animation independent, e.g. final x after animation finishes)
   * @return {number} the final x.
   */


  DvtGanttTaskLabel.prototype.getFinalX = function () {
    return this._finalX;
  };
  /**
   * Sets the final x
   * @param {number} x
   */


  DvtGanttTaskLabel.prototype.setFinalX = function (x) {
    this._finalX = x;
  };
  /**
   * Gets the final y (animation independent, e.g. final y after animation finishes)
   * @return {number} the final y
   */


  DvtGanttTaskLabel.prototype.getFinalY = function () {
    return this._finalY;
  };
  /**
   * Sets the final y
   * @param {number} y The final y
   */


  DvtGanttTaskLabel.prototype.setFinalY = function (y) {
    this._finalY = y;
  };
  /**
   * @license
   * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * Class representing a task element path shape.
   * @param {dvt.Context} context
   * @param {number} x position
   * @param {number} y posiiton
   * @param {number} w width
   * @param {number} h height
   * @param {string} r borderradius
   * @param {DvtGanttTask} task The corresponding task
   * @param {string} type The shape type. Can be one of:
   *        main - The main shape, e.g. bar or milestone shape
   *        mainSelect - The main selection shape
   *        mainHover - The main hover shape
   *        mainDragFeedback - The main drag feedback
   *        mainResizeHandleStart - The main start resize handle
   *        mainResizeHandleEnd - The main end resize handle
   *        mainResizeHandleDragFeedback - The main resize handle drag feedback
   *        baseline - The baseline shape, e.g. bar or milestone shape
   *        baselineSelect - The baseline selection shape
   *        baselineHover - The baseline hover shape
   *        progress - The progress element shape
   * @param {string=} id The optional id for the corresponding DOM element.
   * @extends {dvt.Path}
   * @class
   * @constructor
   */


  var DvtGanttTaskShape = function DvtGanttTaskShape(context, x, y, w, h, r, task, type, id) {
    this.Init(context, x, y, w, h, r, task, type, id);
  };

  dvt.Obj.createSubclass(DvtGanttTaskShape, dvt.Path);
  /**
   * The 'main' types, effect inclusive.
   * @type {array}
   */

  DvtGanttTaskShape.MAIN_TYPES = ['main', 'mainSelect', 'mainHover'];
  /**
   * The 'main' effect types.
   * @type {array}
   */

  DvtGanttTaskShape.MAIN_EFFECT_TYPES = ['mainSelect', 'mainHover'];
  /**
   * The 'baseline' types, effect inclusive.
   * @type {array}
   */

  DvtGanttTaskShape.BASELINE_TYPES = ['baseline', 'baselineSelect', 'baselineHover'];
  /**
   * The 'baseline' effect types.
   * @type {array}
   */

  DvtGanttTaskShape.BASELINE_EFFECT_TYPES = ['baselineSelect', 'baselineHover'];
  /**
   * @param {dvt.Context} context
   * @param {number} x position
   * @param {number} y posiiton
   * @param {number} w width
   * @param {number} h height
   * @param {string} r borderradius
   * @param {DvtGanttTask} task The corresponding task
   * @param {string} type The shape type. Can be one of:
   *        main - The main shape, e.g. bar or milestone shape
   *        mainSelect - The main selection shape
   *        mainHover - The main hover shape
   *        mainDragFeedback - The main drag feedback
   *        mainResizeHandleStart - The main start resize handle
   *        mainResizeHandleEnd - The main end resize handle
   *        mainResizeHandleDragFeedback - The main resize handle drag feedback
   *        baseline - The baseline shape, e.g. bar or milestone shape
   *        baselineSelect - The baseline selection shape
   *        baselineHover - The baseline hover shape
   *        progress - The progress element shape
   * @param {string=} id The optional id for the corresponding DOM element.
   * @protected
   */

  DvtGanttTaskShape.prototype.Init = function (context, x, y, w, h, r, task, type, id) {
    var cmds;
    this._context = context;
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this._r = r != null ? r : '0';
    this._task = task;
    this._type = type;
    this._renderState = 'add';
    this._typeCmdGeneratorMap = {
      'main': this._generateRepShapeCmd,
      'mainSelect': this._generateRepShapeCmd,
      'mainHover': this._generateRepShapeCmd,
      'mainDragFeedback': this._generateRepShapeCmd,
      'mainResizeHandleStart': this._generateRectCmd,
      'mainResizeHandleEnd': this._generateRectCmd,
      'mainResizeHandleDragFeedback': this._generateRectCmd,
      'progress': this._generateRectCmd,
      'baseline': this._generateRepShapeCmd,
      'baselineSelect': this._generateRepShapeCmd,
      'baselineHover': this._generateRepShapeCmd
    };
    cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
    DvtGanttTaskShape.superclass.Init.call(this, context, cmds, id);
    this.applyDefaultStyleClasses();

    switch (this._type) {
      case 'mainDragFeedback':
      case 'mainResizeHandleDragFeedback':
        this.setMouseEnabled(false);
      // Disable pointer-events for dnd feedbacks

      case 'mainResizeHandleStart':
      case 'mainResizeHandleEnd':
        task.getGantt().getEventManager().associate(this, task.getContainer());

      case 'main':
      case 'progress':
      case 'baseline':
        this.setPixelHinting(true); // Render the with crispedge so that their outlines don't look blurry.

        break;
    }
  };
  /**
   * Generates the path command that draws the representative task shape.
   * @param {number} x position
   * @param {number} y posiiton
   * @param {number} w width
   * @param {number} h height
   * @param {string=} r borderradius If not specified assume to be 0 radius.
   * @return {string} the command string
   * @private
   */


  DvtGanttTaskShape.prototype._generateRepShapeCmd = function (x, y, w, h, r) {
    var isRTL = dvt.Agent.isRightToLeft(this._context);
    var margin = (DvtGanttTaskShape.MAIN_EFFECT_TYPES.indexOf(this._type) > -1 || DvtGanttTaskShape.BASELINE_EFFECT_TYPES.indexOf(this._type) > -1) * DvtGanttStyleUtils.getTaskEffectMargin(),
        diamondMargin; // Diamond shape for milestone

    if (this._task.isMilestone(this._type) && w == 0) {
      diamondMargin = margin * Math.sqrt(2);
      return this._generateDiamondCmd(x, y - diamondMargin, h + 2 * diamondMargin, r);
    } else if (this._task.isSummary(this._type) && this._type === 'main') // current UX design, only main shape has a special summary shape; baseline shape and effects are always bars
      {
        return this._generateSummaryCmd(x, y, w, h, r);
      } else // bar shape otherwise
      {
        return this._generateRectCmd(!isRTL ? x - margin : x + margin, y - margin, w + 2 * margin, h + 2 * margin, r);
      }
  };
  /**
   * Generates the path command that draws a rectangle with given dimensions and radius.
   * In LTR, rect reference point is at the top left corner. Top right in RTL.
   * @param {number} x position
   * @param {number} y posiiton
   * @param {number} w width
   * @param {number} h height
   * @param {string=} r borderradius
   * @return {string} the command string
   * @private
   */


  DvtGanttTaskShape.prototype._generateRectCmd = function (x, y, w, h, r) {
    var isRTL = dvt.Agent.isRightToLeft(this._context); // dvt.PathUtils.rectangleWithBorderRadius is expensive (mostly due to parsing
    // border radius string). For our default 0px border radius case, skip the parsing and
    // generate the path.

    if (r === '0' || r === '0px') {
      // In LTR, reference point is at top left corner; top right in RTL
      return dvt.PathUtils.moveTo(x, y) + dvt.PathUtils.horizontalLineTo(isRTL ? x - w : x + w) + dvt.PathUtils.verticalLineTo(y + h) + dvt.PathUtils.horizontalLineTo(x) + dvt.PathUtils.closePath();
    }

    return dvt.PathUtils.rectangleWithBorderRadius(x - isRTL * w, y, w, h, r, Math.min(w, h), '0');
  };
  /**
   * Generates the path command that draws a summary shape (bordered rect missing bottom side) with given dimensions and radius.
   * In LTR, reference point is at the top left corner. Top right in RTL.
   * @param {number} x position
   * @param {number} y posiiton
   * @param {number} w width
   * @param {number} h height
   * @param {string=} r borderradius
   * @return {string} the command string
   * @private
   */


  DvtGanttTaskShape.prototype._generateSummaryCmd = function (x, y, w, h, r) {
    var isRTL = dvt.Agent.isRightToLeft(this._context); // For our default 0px border radius case, skip the parsing and generate the path.

    var thickness = DvtGanttStyleUtils.getSummaryThickness();

    if (r === '0' || r === '0px') {
      if (w > 2 * thickness) {
        // In LTR, reference is at top left corner, top right in RTL
        return dvt.PathUtils.moveTo(x, y + h) + dvt.PathUtils.verticalLineTo(y) + dvt.PathUtils.horizontalLineTo(isRTL ? x - w : x + w) + dvt.PathUtils.verticalLineTo(y + h) + dvt.PathUtils.horizontalLineTo(isRTL ? x - w + thickness : x + w - thickness) + dvt.PathUtils.verticalLineTo(y + thickness) + dvt.PathUtils.horizontalLineTo(isRTL ? x - thickness : x + thickness) + dvt.PathUtils.verticalLineTo(y + h) + dvt.PathUtils.closePath();
      }

      return this._generateRectCmd(x, y, w, h, r);
    } // Only support same radius for the top left and top right corners for summary tasks


    var outerBr = Math.min(new dvt.CSSStyle({
      'border-radius': r
    }).getBorderRadius(), Math.min(w, h));
    var innerBr = Math.max(outerBr - thickness, 0);

    if (w > 2 * thickness) {
      // In LTR, reference is at top left corner, top right in RTL
      return dvt.PathUtils.moveTo(x, y + h) + dvt.PathUtils.verticalLineTo(y + outerBr) + dvt.PathUtils.arcTo(outerBr, outerBr, Math.PI / 2, isRTL ? 0 : 1, isRTL ? x - outerBr : x + outerBr, y) + dvt.PathUtils.horizontalLineTo(isRTL ? x - w + outerBr : x + w - outerBr) + dvt.PathUtils.arcTo(outerBr, outerBr, Math.PI / 2, isRTL ? 0 : 1, isRTL ? x - w : x + w, y + outerBr) + dvt.PathUtils.verticalLineTo(y + h) + dvt.PathUtils.horizontalLineTo(isRTL ? x - w + thickness : x + w - thickness) + dvt.PathUtils.verticalLineTo(y + thickness + innerBr) + dvt.PathUtils.arcTo(innerBr, innerBr, Math.PI / 2, isRTL ? 1 : 0, isRTL ? x - w + thickness + innerBr : x + w - thickness - innerBr, y + thickness) + dvt.PathUtils.horizontalLineTo(isRTL ? x - thickness - innerBr : x + thickness + innerBr) + dvt.PathUtils.arcTo(innerBr, innerBr, Math.PI / 2, isRTL ? 1 : 0, isRTL ? x - thickness : x + thickness, y + thickness + innerBr) + dvt.PathUtils.verticalLineTo(y + h) + dvt.PathUtils.closePath();
    }

    return dvt.PathUtils.rectangleWithBorderRadius(x - isRTL * w, y, w, h, outerBr + 'px ' + outerBr + 'px 0px 0px', Math.min(w, h), '0');
  };
  /**
   * Generates the path command that draws a diamond with given dimensions and radius.
   * @param {number} x position
   * @param {number} y posiiton
   * @param {number} h height
   * @param {string=} r borderradius If not specified assume to be 0.
   * @return {string} the command string
   * @private
   */


  DvtGanttTaskShape.prototype._generateDiamondCmd = function (x, y, h, r) {
    var half_h = h / 2; // For our default 0px border radius case, skip the parsing and generate the path.

    if (r === '0' || r === '0px') {
      return dvt.PathUtils.moveTo(x, y) + dvt.PathUtils.lineTo(x + half_h, y + half_h) + dvt.PathUtils.lineTo(x, y + h) + dvt.PathUtils.lineTo(x - half_h, y + half_h) + dvt.PathUtils.closePath();
    } // Only support 4 corner with the same radius for milestone diamond


    var br = Math.min(new dvt.CSSStyle({
      'border-radius': r
    }).getBorderRadius(), h / (2 * Math.sqrt(2))),
        r_over_root2 = br / Math.sqrt(2),
        rx = br,
        ry = br;
    return dvt.PathUtils.moveTo(x - r_over_root2, y + r_over_root2) + dvt.PathUtils.arcTo(rx, ry, 0, 1, x + r_over_root2, y + r_over_root2) + dvt.PathUtils.lineTo(x + half_h - r_over_root2, y + half_h - r_over_root2) + dvt.PathUtils.arcTo(rx, ry, 0, 1, x + half_h - r_over_root2, y + half_h + r_over_root2) + dvt.PathUtils.lineTo(x + r_over_root2, y + h - r_over_root2) + dvt.PathUtils.arcTo(rx, ry, 0, 1, x - r_over_root2, y + h - r_over_root2) + dvt.PathUtils.lineTo(x - half_h + r_over_root2, y + half_h + r_over_root2) + dvt.PathUtils.arcTo(rx, ry, 0, 1, x - half_h + r_over_root2, y + half_h - r_over_root2) + dvt.PathUtils.closePath();
  };
  /**
   * Applies any default classes and styles to the shape based on the specified type.
   */


  DvtGanttTaskShape.prototype.applyDefaultStyleClasses = function () {
    var styleClass,
        milestoneDefaultClass,
        barDefaultClass,
        summaryDefaultClass,
        taskFillColor,
        style,
        gantt = this._task.getGantt(),
        taskDraggable = gantt.getEventManager().IsDragSupported('tasks');

    if (this._type === 'progress') {
      styleClass = gantt.GetStyleClass('taskProgress');

      if (taskDraggable) {
        styleClass += ' ' + gantt.GetStyleClass('draggable');
      }

      this.setClassName(styleClass);
    } else if (DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1) {
      styleClass = gantt.GetStyleClass('task');
      milestoneDefaultClass = gantt.GetStyleClass('taskMilestone');
      barDefaultClass = gantt.GetStyleClass('taskBar');
      summaryDefaultClass = gantt.GetStyleClass('taskSummary');

      if (this._task.isMilestone(this._type) && this._w == 0) {
        styleClass += ' ' + milestoneDefaultClass;
      } else if (this._task.isSummary(this._type)) {
        styleClass += ' ' + summaryDefaultClass;
      } else {
        styleClass += ' ' + barDefaultClass;
      }

      if (this._type === 'mainSelect') {
        this.setStyle({
          'fill': 'none',
          'filter': 'none'
        });
        styleClass += ' ' + gantt.GetStyleClass('selected');
      } else if (this._type === 'mainHover') {
        styleClass += ' ' + gantt.GetStyleClass('hover');
        style = {
          'fill': 'none'
        };
        taskFillColor = this._task.getFillColor();

        if (taskFillColor != null) {
          this.setStroke(dvt.SelectionEffectUtils.createSelectingStroke(taskFillColor['fill']));

          if (taskFillColor['filter'] === 'none') {
            style['filter'] = 'none';
          }
        }

        this.setStyle(style);
      } else if (this._type === 'main' && taskDraggable) {
        styleClass += ' ' + gantt.GetStyleClass('draggable');
      }

      this.setClassName(styleClass);
    } else if (DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) {
      styleClass = gantt.GetStyleClass('baseline');
      milestoneDefaultClass = gantt.GetStyleClass('baselineMilestone');
      barDefaultClass = gantt.GetStyleClass('baselineBar');

      if (this._task.isMilestone(this._type) && this._w == 0) {
        styleClass += ' ' + milestoneDefaultClass;
      } else {
        styleClass += ' ' + barDefaultClass;
      }

      this.setClassName(styleClass);
    } else if (this._type === 'mainDragFeedback' || this._type === 'mainResizeHandleDragFeedback') {
      styleClass = gantt.GetStyleClass('taskDragImage');
      this.setClassName(styleClass);
    } else if (this._type === 'mainResizeHandleStart' || this._type === 'mainResizeHandleEnd') {
      styleClass = gantt.GetStyleClass('taskResizeHandle');
      this.setClassName(styleClass + ' ' + this._task.getGantt().GetStyleClass('draggable'));
    }
  };
  /**
   * Gets the fill color of the shape
   * @return {object} an object containing the following information:
   *                  'fill': the fill property of the shape
   *                  'filter': the filter property of the shape
   *                  'computedFill': the *actual* fill of the shape, after the default tint/shade filter is applied
   */


  DvtGanttTaskShape.prototype.getFillColor = function () {
    var elem, svgRoot, computedStyle, fill, computedFill, filter, isUrlFill, fillColor; // we need to figure out the fill color, which could be set in style class
    // In touch devices, the shape may be wrapped with a g element for aria purposes, so make sure to grab the path element

    elem = this.getElem();
    elem = elem.firstChild != null ? elem.firstChild : elem;
    elem = elem.cloneNode(false);
    svgRoot = this._task.getGantt().getCtx().getSvgDocument();
    svgRoot.appendChild(elem); // @HTMLUpdateOK

    try {
      computedStyle = window.getComputedStyle(elem);
      fill = computedStyle['fill'];
      filter = computedStyle['filter'];
      if (!String.prototype.startsWith) // internet explorer 11 doesn't support startsWith() yet...
        isUrlFill = fill.indexOf('url(') == 0;else isUrlFill = fill.startsWith('url(');

      if (!isUrlFill) {
        // Artificially calculate actual color after filter is applied, since that is not available through computedStyle
        switch (filter) {
          case 'url(' + JSON.stringify('#' + DvtGanttStyleUtils.getTaskTintFilterId()) + ')':
          case 'url(' + '#' + DvtGanttStyleUtils.getTaskTintFilterId() + ')':
            computedFill = dvt.ColorUtils.getBrighter(fill, DvtGanttStyleUtils.getTaskTintAlpha());
            break;

          case 'url(' + JSON.stringify('#' + DvtGanttStyleUtils.getTaskShadeFilterId()) + ')':
          case 'url(' + '#' + DvtGanttStyleUtils.getTaskShadeFilterId() + ')':
            computedFill = dvt.ColorUtils.getDarker(fill, DvtGanttStyleUtils.getTaskShadeAlpha());
            break;

          default:
            computedFill = fill;
            break;
        }

        fillColor = {
          'fill': fill,
          'computedFill': computedFill,
          'filter': filter
        };
      }
    } finally {
      svgRoot.removeChild(elem);
    }

    return fillColor;
  };
  /**
   * Gets the shape type.
   * @return {string} The type.
   */


  DvtGanttTaskShape.prototype.getType = function () {
    return this._type;
  };
  /**
   * Gets the associated task.
   * @return {DvtGanttTask} The associated task.
   */


  DvtGanttTaskShape.prototype.getTask = function () {
    return this._task;
  };
  /**
   * Gets the physically occupied space beyond the logical start point.
   * For example, if the shape is a diamond:
   *    x
   *  /   \
   * a     b
   *  \   /
   *    x
   * The logical start point is at point x (and logical end point is also x, giving it logical width of 0).
   * However, physically, it takes up the space (x - a) to the left of the start point (to right of start point if RTL),
   * and that's the offset returned by this function.
   *
   * Note that for bar shapes, this offset is 0.
   *
   * @return {number} the offset
   */


  DvtGanttTaskShape.prototype.getPhysicalStartOffset = function () {
    if ((DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 || DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) && this._task.isMilestone(this._type)) {
      return this._finalHeight / 2;
    }

    return 0;
  };
  /**
   * Gets the physically occupied space beyond the logical end point.
   * For example, if the shape is a diamond:
   *    x
   *  /   \
   * a     b
   *  \   /
   *    x
   * The logical end point is at point x (and logical start point is also x, giving it logical width of 0).
   * However, physically, it takes up the space (b - x) to the right of the end point (to left of end point if RTL),
   * and that's the offset returned by this function.
   *
   * Note that for bar shapes, this offset is 0.
   *
   * @return {number} the offset
   */


  DvtGanttTaskShape.prototype.getPhysicalEndOffset = function () {
    if ((DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 || DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) && this._task.isMilestone(this._type)) {
      return this._finalHeight / 2;
    }

    return 0;
  };
  /**
   * Gets the shape type.
   * @return {string} The shape type.
   */


  DvtGanttTaskShape.prototype.getType = function () {
    return this._type;
  };
  /**
   * Gets the render state of the shape.
   * @return {string} the render state.
   */


  DvtGanttTaskShape.prototype.getRenderState = function () {
    return this._renderState;
  };
  /**
   * Sets the render state of the shape.
   * @param {string} state The render state.
   */


  DvtGanttTaskShape.prototype.setRenderState = function (state) {
    this._renderState = state;
  };
  /**
   * Gets width. Note this width can change during animation.
   * Note that if you get width for diamond shape, the width returned will be 0.
   * See documentation of getPhysicalStart/EndOffset methods for visualization.
   * @return {number} The width.
   */


  DvtGanttTaskShape.prototype.getWidth = function () {
    return this._w;
  };
  /**
   * Gets final width (animation independent, calculated from data; e.g. final width after animation finishes)
   * In other words, if there's no animation, or at the end of animation, this method should return the same value as getWidth
   * Note that for diamond shapes, even though the occupied width is nonzero, the logical width is 0 as calculated from data
   * See documentation of getPhysicalStart/EndOffset methods for visualization.
   * @return {number} The logical width.
   */


  DvtGanttTaskShape.prototype.getFinalWidth = function () {
    return this._finalWidth;
  };
  /**
   * Sets width.
   * @param {number} width The new width.
   */


  DvtGanttTaskShape.prototype.setWidth = function (width) {
    var cmds; // For main/baseline case, the shape can change from bar to diamond and vice versa, e.g. during animation and interactivity
    // Need to update style classes during these width/shape transitions

    if ((DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 || DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) && (this._w === 0 || width === 0)) {
      this._w = width;
      this.applyDefaultStyleClasses();
    }

    this._w = width;
    cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
    this.setCmds(cmds);
  };
  /**
   * Sets the final width (animation independent, calculated from data; e.g. final width after animation finishes)
   * Note that for diamond shapes, even though the occupied width is nonzero, the logical width is 0 as calculated from data
   * See documentation of getPhysicalStart/EndOffset methods for visualization.
   * @param {number} width The new final width.
   */


  DvtGanttTaskShape.prototype.setFinalWidth = function (width) {
    this._finalWidth = width;
  };
  /**
   * Gets height. Note this width can change during animation.
   * @return {number} The height.
   */


  DvtGanttTaskShape.prototype.getHeight = function () {
    return this._h;
  };
  /**
   * Gets final height (animation independent, calculated from data; e.g. final height after animation finishes)
   * In other words, if there's no animation, or at the end of animation, this method should return the same value as getHeight
   * @return {number} The final height.
   */


  DvtGanttTaskShape.prototype.getFinalHeight = function () {
    return this._finalHeight;
  };
  /**
   * Sets height.
   * @param {number} height The new height.
   */


  DvtGanttTaskShape.prototype.setHeight = function (height) {
    var cmds;
    this._h = height;
    cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
    this.setCmds(cmds);
  };
  /**
   * Sets the final height (animation independent, calculated from data; e.g. final height after animation finishes)
   * @param {number} height The new final height.
   */


  DvtGanttTaskShape.prototype.setFinalHeight = function (height) {
    this._finalHeight = height;
  };
  /**
   * Gets the x. Note this x can change during animation.
   * @return {number} x
   */


  DvtGanttTaskShape.prototype.getX = function () {
    return this._x;
  };
  /**
   * Gets the final x (animation independent, e.g. final x after animation finishes)
   * @return {number} x
   */


  DvtGanttTaskShape.prototype.getFinalX = function () {
    return this._finalX;
  };
  /**
   * Sets the x.
   * @param {number} x
   */


  DvtGanttTaskShape.prototype.setX = function (x) {
    var cmds;
    this._x = x;
    cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
    this.setCmds(cmds);
  };
  /**
   * Sets the final x (animation independent, e.g. final x after animation finishes)
   * @param {number} x
   */


  DvtGanttTaskShape.prototype.setFinalX = function (x) {
    this._finalX = x;
  };
  /**
   * Gets the y. Note this y can change during animation.
   * @return {number} y
   */


  DvtGanttTaskShape.prototype.getY = function () {
    return this._y;
  };
  /**
   * Gets the final y (animation independent, e.g. final y after animation finishes)
   * @return {number} y
   */


  DvtGanttTaskShape.prototype.getFinalY = function () {
    return this._finalY;
  };
  /**
   * Sets the y.
   * @param {number} y
   */


  DvtGanttTaskShape.prototype.setY = function (y) {
    var cmds;
    this._y = y;
    cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
    this.setCmds(cmds);
  };
  /**
   * Sets the final y (animation independent, e.g. final y after animation finishes)
   * @param {number} y
   */


  DvtGanttTaskShape.prototype.setFinalY = function (y) {
    this._finalY = y;
  };
  /**
   * Gets the border radius.
   * @return {number} the border radius
   */


  DvtGanttTaskShape.prototype.getBorderRadius = function () {
    return this._r;
  };
  /**
   * Sets the border radius.
   * @param {number} r the border radius
   */


  DvtGanttTaskShape.prototype.setBorderRadius = function (r) {
    var cmds;
    this._r = r != null ? r : "0";
    cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
    this.setCmds(cmds);
  };
  /**
   * Sets the dimensions all at once.
   * @param {number} x position
   * @param {number} y posiiton
   * @param {number} w width
   * @param {number} h height
   * @param {string=} r borderradius If not specified assume to be 0 radius.
   */


  DvtGanttTaskShape.prototype.setDimensions = function (x, y, w, h, r) {
    var cmds; // For task case, the shape can change from bar to diamond and vice versa, e.g. during animation and interactivity
    // Need to update style classes during these width/shape transitions

    if ((DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 || DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) && (this._w === 0 || w === 0)) {
      this._w = w;
      this.applyDefaultStyleClasses();
    }

    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this._r = r != null ? r : '0';
    cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
    this.setCmds(cmds);
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
