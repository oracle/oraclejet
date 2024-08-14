/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdvt-toolkit', 'ojs/ojdvt-timecomponent', 'ojs/ojtimeaxis-toolkit'], function (exports, dvt, ojdvtTimecomponent, ojtimeaxisToolkit) { 'use strict';

  /**
   * Style related utility functions for Gantt.
   * @class
   */
  var DvtGanttStyleUtils = {
    /**
     * The default time axes label style.
     * @const
     * @private
     */
    _DEFAULT_TIMEAXES_LABEL_STYLE: dvt.BaseComponentDefaults.FONT_FAMILY_ALTA_12 + 'color: #333333;',

    /**
     * The default zoom control diameter.
     * @const
     * @private
     */
    _DEFAULT_ZOOM_CONTROL_DIAMETER: 31,

    /**
     * The default zoom control padding.
     * @const
     * @private
     */
    _DEFAULT_ZOOM_CONTROL_PADDING: 10.5,

    /**
     * The default zoom control spacing.
     * @const
     * @private
     */
    _DEFAULT_ZOOM_CONTROL_SPACING: 9,

    /**
     * The default component padding.
     * @const
     * @private
     */
    _DEFAULT_COMPONENT_PADDING: 0,

    /**
     * The default task height (without baseline).
     * @const
     * @private
     */
    _DEFAULT_STANDALONE_TASK_HEIGHT: 22,

    /**
     * The default baseline margin top.
     * @const
     * @private
     */
    _DEFAULT_BASELINE_MARGIN_TOP: 0,

    /**
     * The default baseline task height.
     * @const
     * @private
     */
    _DEFAULT_BASELINE_TASK_HEIGHT: 6,

    /**
     * The default task downtime height.
     * @const
     * @private
     */
    _DEFAULT_TASK_DOWNTIME_HEIGHT: 4,

    /**
     * The default task attribute height.
     * @const
     * @private
     */
    _DEFAULT_TASK_ATTRIBUTE_HEIGHT: 5,

    /**
     * The default summary task shape thickiness in px.
     * @const
     * @private
     */
    _DEFAULT_SUMMARY_THICKNESS: 3,

    /**
     * The default task label padding.
     * @const
     * @private
     */
    _DEFAULT_TASK_LABEL_PADDING: 5,

    /**
     * The default task padding.
     * @const
     * @private
     */
    _DEFAULT_TASK_PADDING: 5,

    /**
     * The default task effect margin.
     * @const
     * @private
     */
    _DEFAULT_TASK_EFFECT_MARGIN: 2,

    /**
     * The task tint filter id
     * @const
     * @private
     */
    _DEFAULT_TASK_TINT_FILTER_ID: 'ojGanttTaskTintFilter',

    /**
     * The task shade filter id
     * @const
     * @private
     */
    _DEFAULT_TASK_SHADE_FILTER_ID: 'ojGanttTaskShadeFilter',

    /**
     * The default task tint alpha (e.g. on the normal bar shape)
     * @const
     * @private
     */
    _DEFAULT_TASK_TINT_ALPHA: 0.3,

    /**
     * The default task shade alpha (e.g. on the variance shape)
     * @const
     * @private
     */
    _DEFAULT_TASK_SHADE_ALPHA: 0.35,

    /**
     * The default height of the time axis.
     * @const
     * @private
     */
    _DEFAULT_AXIS_HEIGHT: 23,

    /**
     * The gap between the row labels axis (when outside) and the chart.
     * @const
     * @private
     */
    _ROW_LABELS_AXIS_GAP: 0,

    /**
     * The size of the row label expand/collapse button.
     * @const
     * @private
     */
    _ROW_LABEL_EXPAND_COLLAPSE_BUTTON_SIZE: 24,

    /**
     * The indent size for hierarchical row labels. Sync with _ROW_LABEL_EXPAND_COLLAPSE_BUTTON_SIZE
     * @const
     * @private
     */
    _ROW_LABEL_INDENT_SIZE: 24,

    /**
     * The gap size between the expand/collapse button and the label content.
     * @const
     * @private
     */
    _ROW_LABEL_BUTTON_CONTENT_GAP_SIZE: 8,

    /**
     * The row label (container) left/right padding.
     * @const
     * @private
     */
    _ROW_LABEL_CONTAINER_PADDING: 8,

    /**
     * The default stroke color for the inner path used to render focused dependency line.
     * @const
     * @private
     */
    _DEFAULT_DEPENDENCY_LINE_INNER_COLOR: '#ffffff',

    /**
     * The default stroke width for the inner path used to render focused dependency line.
     * @const
     * @private
     */
    _DEFAULT_DEPENDENCY_LINE_INNER_WIDTH: 2,

    /**
     * The default animation duration.
     * @const
     * @private
     */
    _DEFAULT_ANIMATION_DURATION: 0.5, // second,

    /**
     * The radius for the arc used in dependency line
     * @const
     * @private
     */
    _DEPENDENCY_LINE_ARC_RADIUS: 6,

    /**
     * The length of the horizontal dependency portion coming in/out of a task.
     * @const
     * @private
     */
    _DEPENDENCY_LINE_TASK_FLANK_LENGTH: 20,

    /**
     * The height of the dependency line triangle marker.
     * @const
     * @private
     */
    _DEPENDENCY_TRIANGLE_MARKER_HEIGHT: 8,

    /**
     * The width of the dependency line triangle marker.
     * @const
     * @private
     */
    _DEPENDENCY_TRIANGLE_MARKER_WIDTH: 6,

    /**
     * The height of the dependency line angle marker.
     * @const
     * @private
     */
    _DEPENDENCY_ANGLE_MARKER_HEIGHT: 12,

    /**
     * The width of the dependency line angle marker.
     * @const
     * @private
     */
    _DEPENDENCY_ANGLE_MARKER_WIDTH: 8,

    /**
     * The radius of the dependency line circle marker.
     * @const
     * @private
     */
    _DEPENDENCY_CIRCLE_MARKER_RADIUS: 3,

    /**
     * The triangle marker id.
     * @const
     * @private
     */
    _DEPENDENCY_TRIANGLE_MARKER_ID: 'ojGanttDependencyMarkerEndTriangle',

    /**
     * The angle marker id.
     * @const
     * @private
     */
    _DEPENDENCY_ANGLE_MARKER_ID: 'ojGanttDependencyMarkerEndAngle',

    /**
     * The open circle marker id.
     * @const
     * @private
     */
    _DEPENDENCY_OPEN_CIRCLE_MARKER_ID: 'ojGanttDependencyMarkerOpenCircle',

    /**
     * The closed circle marker id.
     * @const
     * @private
     */
    _DEPENDENCY_CLOSED_CIRCLE_MARKER_ID: 'ojGanttDependencyMarkerClosedCircle',

    /**
     * The maximum distance from an edge of the viewport such that auto
     * panning happens during drag (or equivalent).
     * @const
     * @private
     */
    _AUTOPAN_EDGE_THRESHOLD: 20,

    /**
     * The default DnD main task resize handle width.
     * @const
     * @private
     */
    _DEFAULT_TASK_RESIZE_HANDLE_WIDTH: 5,

    /**
     * The default DnD main task resize handle width for touch.
     * @const
     * @private
     */
    _DEFAULT_TASK_RESIZE_HANDLE_WIDTH_TOUCH: 20,

    /**
     * Gets the horizontal scrollbar style.
     * @return {dvt.CSSStyle} The scrollbar style.
     */
    getHorizontalScrollbarStyle: () => {
      return new dvt.CSSStyle(DvtGanttStyleUtils._DEFAULT_HORIZONTAL_SCROLLBAR_STYLE);
    },

    /**
     * Gets the vertical scrollbar style.
     * @return {dvt.CSSStyle} The scrollbar style.
     */
    getVerticalScrollbarStyle: () => {
      return new dvt.CSSStyle(DvtGanttStyleUtils._DEFAULT_VERTICAL_SCROLLBAR_STYLE);
    },

    /**
     * Gets the standalone task height (i.e. no baseline present)
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The standalone task height.
     */
    getStandaloneTaskHeight: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['taskDefaults'] && resources['taskDefaults']['height'] != null)
        return DvtGanttStyleUtils.getSizeInPixels(resources['taskDefaults']['height']);
      return DvtGanttStyleUtils._DEFAULT_STANDALONE_TASK_HEIGHT;
    },

    /**
     * Gets the actual task height (i.e. baseline present)
     * @param {object} options The object containing data and specifications for the component.
     * @param {dvt.Context} context The rendering context.
     * @return {number} The actual task height.
     */
    getActualTaskHeight: (options, context) => {
      if (context.getThemeBehavior() === 'alta') {
        return (
          DvtGanttStyleUtils.getStandaloneTaskHeight(options) -
          DvtGanttStyleUtils.getBaselineMarginTop(options) -
          DvtGanttStyleUtils.getBaselineTaskHeight(options)
        );
      }
      return DvtGanttStyleUtils.getStandaloneTaskHeight(options);
    },

    /**
     * Gets the baseline margin-top.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The baseline margin-top.
     */
    getBaselineMarginTop: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['baselineMarginTop']) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['baselineMarginTop']);
      }
      return DvtGanttStyleUtils._DEFAULT_BASELINE_MARGIN_TOP;
    },

    /**
     * Gets the baseline task height.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The baseline task height.
     */
    getBaselineTaskHeight: (options) => {
      var resources = options ? options['_resources'] : null;
      if (
        resources &&
        resources['taskDefaults'] &&
        resources['taskDefaults']['baseline'] &&
        resources['taskDefaults']['baseline']['height'] != null
      ) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['taskDefaults']['baseline']['height']);
      }
      return DvtGanttStyleUtils._DEFAULT_BASELINE_TASK_HEIGHT;
    },

    /**
     * Gets the task downtime height.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The task downtime height.
     */
    getTaskDowntimeHeight: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['taskDowntimeHeight']) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['taskDowntimeHeight']);
      }
      return DvtGanttStyleUtils._DEFAULT_TASK_DOWNTIME_HEIGHT;
    },

    /**
     * Gets the task attribute height.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The task attribute height.
     */
    getTaskAttributeHeight: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['taskAttributeHeight']) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['taskAttributeHeight']);
      }
      return DvtGanttStyleUtils._DEFAULT_TASK_ATTRIBUTE_HEIGHT;
    },

    /**
     * Gets the milestone baseline y offset from actual task top.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The milestone baseline y offset from actual task top.
     */
    getMilestoneBaselineYOffset: (options) => {
      return DvtGanttStyleUtils.getBaselineTaskHeight(options);
    },

    /**
     * Gets the summary task shape thickness.
     * @return {number} The summary task shape thickness in px.
     */
    getSummaryThickness: () => {
      return DvtGanttStyleUtils._DEFAULT_SUMMARY_THICKNESS;
    },

    /**
     * Gets the row padding-top.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The padding.
     */
    getRowPaddingTop: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['rowPaddingTop'] != null) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['rowPaddingTop']);
      }
      return DvtGanttStyleUtils._DEFAULT_TASK_PADDING;
    },

    /**
     * Gets the row padding-bottom.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The padding.
     */
    getRowPaddingBottom: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['rowPaddingBottom'] != null) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['rowPaddingBottom']);
      }
      return DvtGanttStyleUtils._DEFAULT_TASK_PADDING;
    },

    /**
     * Gets the task padding. Assumes left and right paddings are the same.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The task padding.
     */
    getTaskPadding: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['taskPaddingLeft'] != null) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['taskPaddingLeft']);
      }
      return DvtGanttStyleUtils._DEFAULT_TASK_LABEL_PADDING;
    },

    /**
     * Gets the task margin. Assumes the left and right margins are the same.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The task margin.
     */
    getTaskMargin: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['taskMarginLeft'] != null) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['taskMarginLeft']);
      }
      return DvtGanttStyleUtils._DEFAULT_TASK_LABEL_PADDING;
    },

    /**
     * Gets the task label margin. Assumes the left and right margins are the same.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The task label margin.
     */
    getTaskLabelMargin: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['taskLabelMarginLeft'] != null) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['taskLabelMarginLeft']);
      }
      return DvtGanttStyleUtils._DEFAULT_TASK_LABEL_PADDING;
    },

    /**
     * Gets the space around hover or selected task.
     * @return {number} The task effect margin.
     */
    getTaskEffectMargin: () => {
      return DvtGanttStyleUtils._DEFAULT_TASK_EFFECT_MARGIN;
    },

    /**
     * Gets the task tint filter id.
     * @return {string} The task tint filter id.
     */
    getTaskTintFilterId: () => {
      return DvtGanttStyleUtils._DEFAULT_TASK_TINT_FILTER_ID;
    },

    /**
     * Gets the task shade filter id.
     * @return {string} The task shade filter id.
     */
    getTaskShadeFilterId: () => {
      return DvtGanttStyleUtils._DEFAULT_TASK_SHADE_FILTER_ID;
    },

    /**
     * Gets the task tint alpha (e.g. on the normal bar shape)
     * @return {number} The task tint alpha
     */
    getTaskTintAlpha: () => {
      return DvtGanttStyleUtils._DEFAULT_TASK_TINT_ALPHA;
    },

    /**
     * Gets the task shade alpha (e.g. on the variance shape)
     * @return {number} The task shade alpha
     */
    getTaskShadeAlpha: () => {
      return DvtGanttStyleUtils._DEFAULT_TASK_SHADE_ALPHA;
    },

    /**
     * Gets the default height of the time axis.
     * @param {object} options The object containing data and specifications for the component.
     * @param {string} axisProp The axis property
     * @return {number} The default height of time axis.
     */
    getTimeAxisHeight: (options, axisProp) => {
      var axisOptions = options[axisProp];
      if (axisOptions && axisOptions['height']) return axisOptions['height'];

      var resources = options['_resources'];
      if (resources && resources[axisProp] && resources[axisProp]['height'] != null)
        return DvtGanttStyleUtils.getSizeInPixels(resources[axisProp]['height']);

      return DvtGanttStyleUtils._DEFAULT_AXIS_HEIGHT;
    },

    /**
     * Gets the major axis label style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {dvt.CSSStyle} The label style.
     */
    getMajorAxisLabelStyle: (options) => {
      var resources = options['_resources'];
      var labelStyleString = DvtGanttStyleUtils._DEFAULT_TIMEAXES_LABEL_STYLE;
      if (resources) labelStyleString = resources['majorAxisLabelFontProp'];
      return new dvt.CSSStyle(labelStyleString);
    },

    /**
     * Gets the minor axis label style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {dvt.CSSStyle} The label style.
     */
    getMinorAxisLabelStyle: (options) => {
      var resources = options['_resources'];
      var labelStyleString = DvtGanttStyleUtils._DEFAULT_TIMEAXES_LABEL_STYLE;
      if (resources) labelStyleString = resources['minorAxisLabelFontProp'];
      return new dvt.CSSStyle(labelStyleString);
    },

    /**
     * Gets the gap between the row axis (when outside the char) and the chart.
     * @return {number} The gap between the row axis and the chart.
     */
    getRowAxisGap: () => {
      return DvtGanttStyleUtils._ROW_LABELS_AXIS_GAP;
    },

    /**
     * Gets the length of the horizontal dependency portion coming in/out of a task.
     * @return {number} The length of the horizontal dependency portion coming in/out of a task.
     */
    getDependencyLineTaskFlankLength: () => {
      return DvtGanttStyleUtils._DEPENDENCY_LINE_TASK_FLANK_LENGTH;
    },

    /**
     * Gets the radius for the arc used in the dependency line.
     * @param {dvt.Context} context The rendering context.
     * @return {number} The radius for the arc used in the dependency line.
     */
    getDependencyLineArcRadius: (context) => {
      if (context.getThemeBehavior() === 'alta') {
        return 0;
      }
      return DvtGanttStyleUtils._DEPENDENCY_LINE_ARC_RADIUS;
    },

    /**
     * Gets the width of the dependency line triangle marker.
     * @return {number} The width of the dependency line triangle marker.
     */
    getDependencyLineTriangleMarkerWidth: () => {
      return DvtGanttStyleUtils._DEPENDENCY_TRIANGLE_MARKER_WIDTH;
    },

    /**
     * Gets the height of the dependency line triangle marker.
     * @return {number} The height of the dependency line triangle marker.
     */
    getDependencyLineTriangleMarkerHeight: () => {
      return DvtGanttStyleUtils._DEPENDENCY_TRIANGLE_MARKER_HEIGHT;
    },

    /**
     * Gets the width of the dependency line angle marker.
     * @return {number} The width of the dependency line triangle marker.
     */
    getDependencyLineAngleMarkerWidth: () => {
      return DvtGanttStyleUtils._DEPENDENCY_ANGLE_MARKER_WIDTH;
    },

    /**
     * Gets the height of the dependency line angle marker.
     * @return {number} The height of the dependency line triangle marker.
     */
    getDependencyLineAngleMarkerHeight: () => {
      return DvtGanttStyleUtils._DEPENDENCY_ANGLE_MARKER_HEIGHT;
    },

    /**
     * Gets the radius of the dependency line circle marker.
     * @return {number} The radius of the dependency line circle marker.
     */
    getDependencyLineCircleMarkerRadius: () => {
      return DvtGanttStyleUtils._DEPENDENCY_CIRCLE_MARKER_RADIUS;
    },

    /**
     * Gets the dependency line triangle marker id.
     * @return {string} The marker id.
     */
    getDependencyLineTriangleMarkerId: () => {
      return DvtGanttStyleUtils._DEPENDENCY_TRIANGLE_MARKER_ID;
    },

    /**
     * Gets the dependency line angle marker id.
     * @return {string} The marker id.
     */
    getDependencyLineAngleMarkerId: () => {
      return DvtGanttStyleUtils._DEPENDENCY_ANGLE_MARKER_ID;
    },

    /**
     * Gets the dependency line open circle marker id.
     * @return {string} The marker id.
     */
    getDependencyLineOpenCircleMarkerId: () => {
      return DvtGanttStyleUtils._DEPENDENCY_OPEN_CIRCLE_MARKER_ID;
    },

    /**
     * Gets the dependency line open circle marker id.
     * @return {string} The marker id.
     */
    getDependencyLineClosedCircleMarkerId: () => {
      return DvtGanttStyleUtils._DEPENDENCY_CLOSED_CIRCLE_MARKER_ID;
    },

    /**
     * Gets the vertical gap between the top or bottom of the task and the point at which its dependency line can bend.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The gap size in px.
     */
    getDependencyLineTaskGap: (options) => {
      return DvtGanttStyleUtils.getRowPaddingTop(options) - 1;
    },

    /**
     * Gets the maximum distance from an edge of the viewport such that auto
     * panning happens during drag (or equivalent).
     * @return {number} The maximum distance from an edge in px.
     */
    getAutoPanEdgeThreshold: () => {
      return DvtGanttStyleUtils._AUTOPAN_EDGE_THRESHOLD;
    },

    /**
     * Gets the task label style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {dvt.CSSStyle} The label style.
     */
    getTaskLabelStyle: (options) => {
      var resources = options['_resources'];
      var labelStyleString = '';
      if (resources) labelStyleString = resources['taskLabelFontProp'];
      return new dvt.CSSStyle(labelStyleString);
    },

    /**
     * Gets the row label style.
     * @param {object} options The object containing data and specifications for the component.
     * @return {dvt.CSSStyle} The label style.
     */
    getRowLabelStyle: (options) => {
      var resources = options['_resources'];
      var labelStyleString = '';
      if (resources) labelStyleString = resources['rowLabelFontProp'];
      return new dvt.CSSStyle(labelStyleString);
    },

    /**
     * Gets the row label (container) start padding.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The row label (container) start padding.
     */
    getRowLabelPaddingStart: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['rowLabelPaddingStart'] != null) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['rowLabelPaddingStart']);
      }
      return DvtGanttStyleUtils._ROW_LABEL_CONTAINER_PADDING;
    },

    /**
     * Gets the row label (container) end padding.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The row label (container) end padding.
     */
    getRowLabelPaddingEnd: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['rowLabelPaddingEnd'] != null) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['rowLabelPaddingEnd']);
      }
      return DvtGanttStyleUtils._ROW_LABEL_CONTAINER_PADDING;
    },

    /**
     * Gets the size of the row label expand/collapse button.
     * @return {number} The size of the row label expand/collapse button.
     */
    getRowLabelButtonSize: () => {
      return DvtGanttStyleUtils._ROW_LABEL_EXPAND_COLLAPSE_BUTTON_SIZE;
    },

    /**
     * Gets the indent size for hiearchical row labels.
     * @return {number} The indent size.
     */
    getRowLabelIndentSize: () => {
      return DvtGanttStyleUtils._ROW_LABEL_INDENT_SIZE;
    },

    /**
     * Gets the gap size between the expand/collapse button and the label content.
     * @return {number} The gap size.
     */
    getRowLabelButtonContentGapSize: () => {
      return DvtGanttStyleUtils._ROW_LABEL_BUTTON_CONTENT_GAP_SIZE;
    },

    /**
     * Gets the chart stroke width.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The chart stroke width in px.
     */
    getChartStrokeWidth: (options) => {
      var resources = options['_resources'];
      if (resources) {
        var chartStyle = resources['chartArea'];
        if (chartStyle) {
          var strokeWidth = chartStyle['strokeWidth'];
          if (strokeWidth) return dvt.CSSStyle.toNumber(strokeWidth);
        }
      }
      return 1; // default for browsers is 1px when not specified
    },

    /**
     * Gets the component padding start.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The component padding start.
     */
    getComponentPaddingStart: (options) => {
      var resources = options ? options['_resources'] : null;
      if (resources && resources['componentPaddingStart'] != null) {
        return DvtGanttStyleUtils.getSizeInPixels(resources['componentPaddingStart']);
      }
      return DvtGanttStyleUtils._DEFAULT_COMPONENT_PADDING;
    },

    /**
     * Gets the horizontal gridline width.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The horizontal gridline width in px.
     */
    getHorizontalGridlineWidth: (options) => {
      return options['_resources']
        ? dvt.CSSStyle.toNumber(options['_resources']['horizontalGridlineWidth'])
        : 1; // default for browsers is 1px when not specified
    },

    /**
     * Gets the animation duration.
     * @param {object} options The object containing data and specifications for the component.
     * @return {number} The animation duration in seconds.
     */
    getAnimationDuration: (options) => {
      var animationDuration = DvtGanttStyleUtils._DEFAULT_ANIMATION_DURATION,
        customAnimationDuration;

      // Override with animation duration from CSS if possible
      if (options['_resources']) {
        customAnimationDuration = options['_resources']['animationDuration'];
        if (customAnimationDuration) {
          animationDuration = dvt.CSSStyle.getTimeMilliseconds(customAnimationDuration) / 1000; // seconds
        }
      }

      return animationDuration;
    },

    /**
     * Returns the stroke color of the inner dependency line when it has focus.
     * @return {string} The stroke color of the inner dependency line when it has focus.
     */
    getFocusedDependencyLineInnerColor: () => {
      return DvtGanttStyleUtils._DEFAULT_DEPENDENCY_LINE_INNER_COLOR;
    },

    /**
     * Returns the stroke width of the inner dependency line when it has focus.
     * @return {number} The stroke width of the inner dependency line when it has focus.
     */
    getFocusedDependencyLineInnerWidth: () => {
      return DvtGanttStyleUtils._DEFAULT_DEPENDENCY_LINE_INNER_WIDTH;
    },

    /**
     * Returns the DnD main task resize handle width.
     * @return {number} The width.
     */
    getTaskResizeHandleWidth: () => {
      return !dvt.Agent.isTouchDevice()
        ? DvtGanttStyleUtils._DEFAULT_TASK_RESIZE_HANDLE_WIDTH
        : DvtGanttStyleUtils._DEFAULT_TASK_RESIZE_HANDLE_WIDTH_TOUCH;
    },

    /**
     * Computes the size of a subcomponent in pixels by parsing the user input. Same method as that of DvtChartStyleUtils.
     * @param {object} size The size input given by the user. It can be in percent, pixels, or number.
     * @param {number} totalSize The total size of the component in pixels.
     * @return {number} The size of the subcomponent in pixels.
     */
    getSizeInPixels: (size, totalSize) => {
      if (typeof size === 'string') {
        if (size.slice(-1) === '%') return (totalSize * Number(size.slice(0, -1))) / 100;
        else if (size.slice(-2) === 'px') return Number(size.slice(0, -2));
        else size = Number(size);
      }

      if (typeof size === 'number') {
        if (size <= 1 && totalSize != null)
          // assume to be ratio
          return totalSize * size;
        // assume to be absolute size in pixels
        else return size;
      } else return 0;
    },

    /**
     * Determines whether the given displayable contains the given className.
     * @param {Displayable} displayable
     * @param {string} className
     * @return {boolean} Whether the given displayable contains the given className.
     */
    hasClass: (displayable, className) => {
      return displayable.getElem().classList.contains(className);
    }
  };

  /**
   * Class representing a GanttDependency node.
   * @param {Gantt} gantt The gantt component
   * @class
   * @constructor
   * @implements {DvtKeyboardNavigable}
   */
  class DvtGanttDependencyNode extends dvt.Container {
    constructor(gantt) {
      super(gantt.getCtx(), null);

      this._gantt = gantt;
      this._gantt.getEventManager().associate(this, this);
      this.nodeType = 'dependency';
    }

    /**
     * Gets the gantt.
     * @return {Gantt} the gantt.
     */
    getGantt() {
      return this._gantt;
    }

    /**
     * Retrieve the data id of the dependency line.
     * @override
     */
    getId() {
      return this._dependencyObj['id'];
    }

    /**
     * Sets the layout object associated with this dependency node
     * @param {Object} dependencyObj Depenency layout object
     */
    setLayoutObject(dependencyObj) {
      this._dependencyObj = dependencyObj;
    }

    /**
     * Gets the layout object associated with this dependency node
     * @return {Object} The dependency layout object
     */
    getLayoutObject() {
      return this._dependencyObj;
    }

    /**
     * Gets the value of query property of the dependency.
     * @param {string} property The top level property name
     * @return {*} The value
     */
    getValue(property) {
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
    }

    /**
     * Retrieves the predecessor task object
     * @return {DvtGanttTaskNode} the predecessor task object
     */
    getPredecessorNode() {
      // By current design, the task node should already exists if this dependency node exists
      return this._dependencyObj['predecessorTaskObj']['node'];
    }

    /**
     * Retrieves the successor task object
     * @return {DvtGanttTaskNode} the successor task object
     */
    getSuccessorNode() {
      // By current design, the task node should already exists if this dependency node exists
      return this._dependencyObj['successorTaskObj']['node'];
    }

    /**
     * Determine the start position of the task node
     * @param {DvtGanttTaskNode} taskNode the task node
     * @param {boolean=} toEdge Whether returned position is from the task edge. If false, label spaces and margins are taken into account. Default false.
     * @return {number} the start position of the task node in pixels
     * @private
     */
    static _getTaskStart(taskNode, toEdge) {
      var isRTL = dvt.Agent.isRightToLeft(taskNode.getGantt().getCtx()),
        options = taskNode.getGantt().getOptions(),
        taskMainShape = taskNode.getTask().getShape('main'),
        taskLabel = taskNode.getTaskLabel(),
        taskLabelOutputText = taskLabel.getLabelOutputText(),
        labelPosition = taskLabel.getEffectiveLabelPosition(),
        labelMargin = DvtGanttStyleUtils.getTaskLabelMargin(options),
        taskMargin = toEdge ? 0 : DvtGanttStyleUtils.getTaskMargin(options);

      if (isRTL) {
        if (
          !toEdge &&
          taskLabelOutputText != null &&
          taskLabelOutputText.getParent() != null &&
          labelPosition === 'end'
        ) {
          return (
            taskNode.getFinalX() +
            taskMainShape.getFinalX() -
            taskMainShape.getFinalWidth() -
            taskMainShape.getPhysicalEndOffset() -
            taskLabelOutputText.getDimensions().w -
            labelMargin * 2
          ); // padding before + after
        } else {
          return (
            taskNode.getFinalX() +
            taskMainShape.getFinalX() -
            taskMainShape.getFinalWidth() -
            taskMainShape.getPhysicalEndOffset() -
            taskMargin
          );
        }
      } else {
        if (
          !toEdge &&
          taskLabelOutputText != null &&
          taskLabelOutputText.getParent() != null &&
          labelPosition === 'start'
        ) {
          return (
            taskNode.getFinalX() +
            taskMainShape.getFinalX() -
            taskMainShape.getPhysicalStartOffset() -
            taskLabelOutputText.getDimensions().w -
            labelMargin * 2
          );
        } else {
          return (
            taskNode.getFinalX() +
            taskMainShape.getFinalX() -
            taskMainShape.getPhysicalStartOffset() -
            taskMargin
          );
        }
      }
    }

    /**
     * Determine the middle position of the task node
     * @param {DvtGanttTaskNode} taskNode the task node to find the vertical middle point
     * @return {number} the middle position of the task node in pixels
     * @private
     */
    static _getTaskMiddle(taskNode) {
      var task = taskNode.getTask();
      var taskMainShape = task.getShape('main');
      var theme = taskNode.getGantt().getCtx().getThemeBehavior();
      var availableShapeHeight =
        task.isSummary('main') && theme === 'alta'
          ? taskNode.getLayoutObject()['height']
          : taskMainShape.getFinalHeight();
      return (
        DvtGanttDependencyNode._getTaskTop(taskNode) +
        taskMainShape.getFinalY() +
        Math.round(availableShapeHeight / 2)
      );
    }

    /**
     * Determine the end position of the task node
     * @param {DvtGanttTaskNode} taskNode the task node to find the end
     * @param {boolean=} toEdge Whether returned position is from the task edge. If false, label spaces and margins are taken into account. Default false.
     * @return {number} the end position of the task node in pixels
     * @private
     */
    static _getTaskEnd(taskNode, toEdge) {
      var isRTL = dvt.Agent.isRightToLeft(taskNode.getGantt().getCtx()),
        options = taskNode.getGantt().getOptions(),
        taskMainShape = taskNode.getTask().getShape('main'),
        taskLabel = taskNode.getTaskLabel(),
        taskLabelOutputText = taskLabel.getLabelOutputText(),
        labelPosition = taskLabel.getEffectiveLabelPosition(),
        labelMargin = DvtGanttStyleUtils.getTaskLabelMargin(options),
        taskMargin = toEdge ? 0 : DvtGanttStyleUtils.getTaskMargin(options);

      if (isRTL) {
        if (
          !toEdge &&
          taskLabelOutputText != null &&
          taskLabelOutputText.getParent() != null &&
          labelPosition === 'start'
        ) {
          return (
            taskNode.getFinalX() +
            taskMainShape.getFinalX() +
            taskMainShape.getPhysicalStartOffset() +
            taskLabelOutputText.getDimensions().w +
            labelMargin * 2
          );
        } else {
          return (
            taskNode.getFinalX() +
            taskMainShape.getFinalX() +
            taskMainShape.getPhysicalStartOffset() +
            taskMargin
          );
        }
      } else {
        if (
          !toEdge &&
          taskLabelOutputText != null &&
          taskLabelOutputText.getParent() != null &&
          labelPosition === 'end'
        ) {
          return (
            taskNode.getFinalX() +
            taskMainShape.getFinalX() +
            taskMainShape.getFinalWidth() +
            taskMainShape.getPhysicalEndOffset() +
            taskLabelOutputText.getDimensions().w +
            labelMargin * 2
          );
        } else {
          return (
            taskNode.getFinalX() +
            taskMainShape.getFinalX() +
            taskMainShape.getFinalWidth() +
            taskMainShape.getPhysicalEndOffset() +
            taskMargin
          );
        }
      }
    }

    /**
     * Calculate the top of the task
     * @param {DvtGanttTaskNode} taskNode the task node to find the top
     * @return {number} the position of the top of the task node in pixels
     * @private
     */
    static _getTaskTop(taskNode) {
      return taskNode.getFinalY();
    }

    /**
     * Calculate the bottom of the task node
     * @param {DvtGanttTaskNode} taskNode the task node to find the bottom
     * @param {boolean=} mainOnly Whether to consider the bottom of the main shape only (excluding things like baseline). Default false.
     * @return {number} the position of the bottom of the task node in pixels
     * @private
     */
    static _getTaskBottom(taskNode, mainOnly) {
      var height = mainOnly ? taskNode.getLayoutObject()['height'] : taskNode.getFinalHeight();
      return DvtGanttDependencyNode._getTaskTop(taskNode) + height;
    }

    /**
     * Checks if dependency type is valid
     * @param {string} type the dependency type
     * @return {boolean} true if dependency type is valid, false otherwise
     * @private
     */
    static _isValidType(type) {
      return (
        type === DvtGanttDependencyNode.START_START ||
        type === DvtGanttDependencyNode.START_FINISH ||
        type === DvtGanttDependencyNode.FINISH_START ||
        type === DvtGanttDependencyNode.FINISH_FINISH
      );
    }

    /**
     * Returns whether line is provided from custom renderer.
     * @return {boolean} true if content is from provided custom renderer, false otherwise.
     */
    isCustomContent() {
      var options = this._gantt.getOptions();
      return options.dependencyContent && options.dependencyContent.renderer;
    }

    /**
     * Gets the context to be passed into custom renderer callbacks
     * @param {object} state The state payload
     * @return {object} The renderer context
     */
    getRendererContext(state) {
      var options = this._gantt.getOptions();
      var context = this._gantt.getCtx();
      var type = this.getValue('type');
      var predecessorNode = this.getPredecessorNode();
      var successorNode = this.getSuccessorNode();
      var typeState = DvtGanttDependencyNode._getRenderingTypeState(context, type);
      var endPoints = DvtGanttDependencyNode._getEndPoints(
        predecessorNode,
        successorNode,
        typeState.isTypeBeginFinish,
        typeState.isTypeEndFinish,
        true,
        true
      );
      var dataContext = {
        data: this.getLayoutObject().data,
        itemData: options.dependencyData ? this.getLayoutObject()._itemData : null,
        content: {
          predecessorX: endPoints.predecessorX,
          predecessorY: endPoints.predecessorY,
          successorX: endPoints.successorX,
          successorY: endPoints.successorY
        },
        state: state
      };
      return context.fixRendererContext(dataContext);
    }

    /**
     * Renders custom content
     * @param {object} state The state payload
     * @private
     */
    _renderCustomContent(state) {
      var gantt = this.getGantt();
      var options = gantt.getOptions();
      if (this._content) {
        this.removeChild(this._content);
      }
      this._content = new dvt.Container(gantt.getCtx());
      this._content.setClassName(gantt.GetStyleClass('dependencyLineCustom'));
      this.addChild(this._content);
      var parentElem = this._content.getContainerElem();
      var renderer = options.dependencyContent.renderer; // must have been defined if reached here
      var dataContext = this.getRendererContext(state);
      var customContent = renderer(dataContext);
      if (customContent) {
        if (Array.isArray(customContent)) {
          customContent.forEach((node) => {
            dvt.ToolkitUtils.appendChildElem(parentElem, node);
          });
        } else {
          dvt.ToolkitUtils.appendChildElem(parentElem, customContent);
        }
      }
    }

    /**
     * Renders the dependency line
     * @param {dvt.Container} container the container to render the dependency line in.
     * @param {boolean=} bUpdateCustomContent Whether to do a full custom content re-render if it already exists. Default true.
     */
    render(container, bUpdateCustomContent) {
      var bUpdateCustomContent = bUpdateCustomContent !== false;

      if (this.getParent() != container) container.addChild(this);

      this.setAriaRole('img');

      var gantt = this.getGantt();
      var context = gantt.getCtx();
      var type = this.getValue('type');
      var predecessorNode = this.getPredecessorNode();
      var successorNode = this.getSuccessorNode();

      // set aria-label.
      // Note task aria-label already incorporated dependency aria-label
      // from the dependency layout object (task renders before dependency lines do, and
      // previously, we call refreshAriaLabel on both the predecessor and successor node after this)
      if (!dvt.Agent.deferAriaCreation()) {
        this.setAriaProperty('label', this.getAriaLabel());
      }

      if (this.isCustomContent()) {
        if (!this._content || bUpdateCustomContent) {
          this._renderCustomContent({ focused: false });
        }
      } else {
        // due to IE bug https://connect.microsoft.com/IE/feedback/details/781964/,
        // which happens only on older versions of Windows (<10), we'll need to re-render the path instead of just updating its command
        if (dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') {
          this._cleanup();
        }

        if (this._line != null) {
          // update dependency line
          this._line.setCmds(
            DvtGanttDependencyNode._calcDepLine(context, predecessorNode, successorNode, type)
          );
          var elem = this._line.getElem();
        } else {
          var line = new dvt.Path(
            context,
            DvtGanttDependencyNode._calcDepLine(context, predecessorNode, successorNode, type)
          );
          // If arc radius > 0, then leave pixel hinting--otherwise they look weird and pixelated.
          // Otherwise, the lines are rectilinear, and should be crisp.
          if (DvtGanttStyleUtils.getDependencyLineArcRadius(context) === 0) {
            line.setPixelHinting(true);
          }

          elem = line.getElem();

          this.addChild(line);

          // set keyboard focus stroke
          var his = new dvt.Stroke(
            DvtGanttStyleUtils.getFocusedDependencyLineInnerColor(),
            1,
            DvtGanttStyleUtils.getFocusedDependencyLineInnerWidth()
          );
          // the outer color won't matter since it will be override by style class
          var hos = new dvt.Stroke('#000', 1, 1);
          line.setHoverStroke(his, hos);

          this._line = line;
        }

        // apply inline style
        var style = this.getValue('svgStyle');
        if (style) {
          this._line.setStyle(style); // works if style is object
        }

        // apply style class
        var defaultStyleClass = gantt.GetStyleClass('dependencyLine');
        if (gantt.getOptions().dependencyLineShape === 'straight') {
          defaultStyleClass += ' ' + gantt.GetStyleClass('dependencyStraightLine');
          if (predecessorNode.isSelected()) {
            defaultStyleClass += ' ' + gantt.GetStyleClass('dependencyStartOpenStraightLine');
          } else {
            defaultStyleClass += ' ' + gantt.GetStyleClass('dependencyStartClosedStraightLine');
          }
          if (successorNode.isSelected()) {
            defaultStyleClass += ' ' + gantt.GetStyleClass('dependencyEndOpenStraightLine');
          } else {
            defaultStyleClass += ' ' + gantt.GetStyleClass('dependencyEndClosedStraightLine');
          }
        } else {
          defaultStyleClass += ' ' + gantt.GetStyleClass('dependencyRectilinearLine');
        }

        // TODO: right now, the hover inner stroke (see var his) is set to have white color.
        // However, if we use Using toolkit's setClassName method, i.e. this._line.setClassName(styleClass),
        // it saves the class in an internal variable. When one focuses on the dep line,
        // the saved class is applied on the inner stroke in UpdateSelectionEffect(), which
        // overrides the white stroke...
        // See filed  for more details.
        // For now, revert back to not using the Toolkit setClassName and just apply the class on the
        // line ourselves, to eliminate this regression from 2.3.0. Post 3.0.0, we should investigate a better way to do this.
        var styleClass = this.getValue('svgClassName');
        if (styleClass)
          dvt.ToolkitUtils.setAttrNullNS(elem, 'class', defaultStyleClass + ' ' + styleClass);
        else dvt.ToolkitUtils.setAttrNullNS(elem, 'class', defaultStyleClass);
      }
    }

    /**
     * Visibly hides the dependency line.
     */
    hide() {
      this.setAlpha(0);
    }

    /**
     * Visibly show the dependency line.
     */
    show() {
      this.setAlpha(1);
    }

    /**
     * Clean up any artifacts created by this dependency line
     * @private
     */
    _cleanup() {
      if (this._line != null) {
        this.removeChild(this._line);
        this._line = null;
      }
    }

    /**
     * Determine if there is potential conflict between dependency line going out from a task and dependency line
     * going into a task
     * @return {number} conflict value constant
     * @private
     */
    _calcConflict() {
      var predecessorConflict = false;
      var successorConflict = false;

      var type = this.getValue('type');

      // checks if there's any dependency line rendered already that have the predecessor as its successor
      var deps = this.getGantt().getNavigableDependencyLinesForTask(
        this.getPredecessorNode(),
        'predecessor'
      );
      if (deps != null) {
        for (var i = 0; i < deps.length; i++) {
          var depType = deps[i].getValue('type');
          if (
            ((type === DvtGanttDependencyNode.START_START ||
              type === DvtGanttDependencyNode.START_FINISH) &&
              (depType === DvtGanttDependencyNode.START_START ||
                depType === DvtGanttDependencyNode.FINISH_START)) ||
            ((type === DvtGanttDependencyNode.FINISH_FINISH ||
              type === DvtGanttDependencyNode.FINISH_START) &&
              (depType === DvtGanttDependencyNode.FINISH_FINISH ||
                depType === DvtGanttDependencyNode.START_FINISH))
          ) {
            predecessorConflict = true;
          }
        }
      }

      // checks if there's any dependency line rendered already that have the successor as its predecessor
      deps = this.getGantt().getNavigableDependencyLinesForTask(this.getSuccessorNode(), 'successor');
      if (deps != null) {
        for (var i = 0; i < deps.length; i++) {
          depType = deps[i].getValue('type');
          if (
            ((type === DvtGanttDependencyNode.START_START ||
              type === DvtGanttDependencyNode.FINISH_START) &&
              (depType === DvtGanttDependencyNode.START_START ||
                depType === DvtGanttDependencyNode.START_FINISH)) ||
            ((type === DvtGanttDependencyNode.FINISH_FINISH ||
              type === DvtGanttDependencyNode.START_FINISH) &&
              (depType === DvtGanttDependencyNode.FINISH_FINISH ||
                depType === DvtGanttDependencyNode.FINISH_START))
          ) {
            successorConflict = true;
          }
        }
      }

      if (predecessorConflict && successorConflict) return DvtGanttDependencyNode.CONFLICT_BOTH;
      else {
        if (predecessorConflict) return DvtGanttDependencyNode.CONFLICT_PREDECESSOR;
        else if (successorConflict) return DvtGanttDependencyNode.CONFLICT_SUCCESSOR;
      }

      return DvtGanttDependencyNode.CONFLICT_NONE;
    }

    /**
     * Returns the endpoints of the line given.
     * @param {DvtGanttTaskNode} predecessorNode The predecessor task node
     * @param {DvtGanttTaskNode} successorNode The successor task node
     * @param {boolean} isTypeBeginFinish true if typeBegin is finish, false otherwise
     * @param {boolean} isTypeEndFinish true if typeEnd is finish, false otherwise
     * @param {boolean} toEdge Whether returned position is from the task edge. If false, label spaces and margins are taken into account.
     * @param {boolean} toVerticalMiddle Whether returned position is from the vertical middle (if not milestone). If false, top/bottom of successor/predecessor tasks are returned.
     * @return {object} An object containing the predecessorX/Y and successorX/Y endpoints
     * @private
     */
    static _getEndPoints(
      predecessorNode,
      successorNode,
      isTypeBeginFinish,
      isTypeEndFinish,
      toEdge,
      toVerticalMiddle
    ) {
      return {
        predecessorX: isTypeBeginFinish
          ? DvtGanttDependencyNode._getTaskEnd(predecessorNode, toEdge)
          : DvtGanttDependencyNode._getTaskStart(predecessorNode, toEdge),
        predecessorY:
          toVerticalMiddle || predecessorNode.getTask().isMilestone('main')
            ? DvtGanttDependencyNode._getTaskMiddle(predecessorNode)
            : DvtGanttDependencyNode._getTaskBottom(predecessorNode, true),
        successorX: isTypeEndFinish
          ? DvtGanttDependencyNode._getTaskEnd(successorNode, toEdge)
          : DvtGanttDependencyNode._getTaskStart(successorNode, toEdge),
        successorY:
          toVerticalMiddle || successorNode.getTask().isMilestone('main')
            ? DvtGanttDependencyNode._getTaskMiddle(successorNode)
            : DvtGanttDependencyNode._getTaskTop(successorNode)
      };
    }

    /**
     * Returns the line type that should be rendered given the logical type. In LTR the rendered type is the logical type, in RTL it's flipped.
     * @param {dvt.Context} context The rendering context.
     * @param {string} logicalType the logical dependency type
     * @return {object} Object of shape { isTypeBeginFinish: boolean, isTypeEndFinish: boolean }
     * @private
     */
    static _getRenderingTypeState(context, logicalType) {
      var isRTL = dvt.Agent.isRightToLeft(context);

      // For RTL the rendering is flipped so for example for start-finish dependency the rendering
      // in RTL would be exactly like finish-start in LTR
      switch (logicalType) {
        case DvtGanttDependencyNode.START_START:
          if (isRTL) {
            return { isTypeBeginFinish: true, isTypeEndFinish: true };
          } else {
            return { isTypeBeginFinish: false, isTypeEndFinish: false };
          }
        case DvtGanttDependencyNode.START_FINISH:
          if (isRTL) {
            return { isTypeBeginFinish: true, isTypeEndFinish: false };
          } else {
            return { isTypeBeginFinish: false, isTypeEndFinish: true };
          }
        case DvtGanttDependencyNode.FINISH_START:
          if (isRTL) {
            return { isTypeBeginFinish: false, isTypeEndFinish: true };
          } else {
            return { isTypeBeginFinish: true, isTypeEndFinish: false };
          }
        case DvtGanttDependencyNode.FINISH_FINISH:
          if (isRTL) {
            return { isTypeBeginFinish: false, isTypeEndFinish: false };
          } else {
            return { isTypeBeginFinish: true, isTypeEndFinish: true };
          }
        default:
          // invalid type, should not happen
          break;
      }

      return null;
    }

    /**
     * Calculate path command for dependency lines
     * @param {dvt.Context} context The rendering context.
     * @param {DvtGanttTaskNode} predecessorNode the predecessor
     * @param {DvtGanttTaskNode} successorNode the successor
     * @param {string} type the dependency type
     * @return {string} the command path
     * @private
     */
    static _calcDepLine(context, predecessorNode, successorNode, type) {
      var typeState = this._getRenderingTypeState(context, type);
      var gantt = predecessorNode.getGantt();
      var options = gantt.getOptions();
      var shape = options.dependencyLineShape;
      if (shape === 'straight') {
        return DvtGanttDependencyNode._calcStraightLine(
          predecessorNode,
          successorNode,
          typeState.isTypeBeginFinish,
          typeState.isTypeEndFinish
        );
      }
      return DvtGanttDependencyNode._calcRectilinearLine(
        predecessorNode,
        successorNode,
        typeState.isTypeBeginFinish,
        typeState.isTypeEndFinish
      );
    }

    /**
     * Calculate path command for typeBegin-typeEnd type straight dependency lines
     * @param {DvtGanttTaskNode} predecessorNode the predecessor
     * @param {DvtGanttTaskNode} successorNode the successor
     * @param {boolean} isTypeBeginFinish true if typeBegin is finish, false otherwise
     * @param {boolean} isTypeEndFinish true if typeEnd is finish, false otherwise
     * @return {string} the command path
     * @private
     */
    static _calcStraightLine(predecessorNode, successorNode, isTypeBeginFinish, isTypeEndFinish) {
      var endPoints = DvtGanttDependencyNode._getEndPoints(
        predecessorNode,
        successorNode,
        isTypeBeginFinish,
        isTypeEndFinish,
        true,
        false
      );
      var x1 = endPoints.predecessorX;
      var x2 = endPoints.successorX;
      var y1 = endPoints.predecessorY;
      var y2 = endPoints.successorY;
      return dvt.PathUtils.moveTo(x1, y1) + dvt.PathUtils.lineTo(x2, y2);
    }

    /**
     * Calculate path command for typeBegin-typeEnd type rectinlinear dependency lines
     * @param {DvtGanttTaskNode} predecessorNode the predecessor
     * @param {DvtGanttTaskNode} successorNode the successor
     * @param {boolean} isTypeBeginFinish true if typeBegin is finish, false otherwise
     * @param {boolean} isTypeEndFinish true if typeEnd is finish, false otherwise
     * @return {string} the command path
     * @private
     */
    static _calcRectilinearLine(predecessorNode, successorNode, isTypeBeginFinish, isTypeEndFinish) {
      // TODO: Right now, arc radius by default is 0, so no issues. If we later change the default arc radius to > 0,
      // we'll need to make sure the radius <= the amount we want to translate before and after drawing the arc to prevent weird artifacts.
      var gantt = predecessorNode.getGantt();
      var r = DvtGanttStyleUtils.getDependencyLineArcRadius(gantt.getCtx());
      var taskFlankLength = DvtGanttStyleUtils.getDependencyLineTaskFlankLength();

      var endPoints = DvtGanttDependencyNode._getEndPoints(
        predecessorNode,
        successorNode,
        isTypeBeginFinish,
        isTypeEndFinish,
        false,
        true
      );
      var x1 = endPoints.predecessorX;
      var x2 = endPoints.successorX;
      var y1 = endPoints.predecessorY;
      var y2 = endPoints.successorY;

      var options = gantt.getOptions();
      var dependencyLineGap = DvtGanttStyleUtils.getDependencyLineTaskGap(options);
      var y_intermediate =
        y2 >= y1
          ? DvtGanttDependencyNode._getTaskBottom(predecessorNode) + dependencyLineGap
          : DvtGanttDependencyNode._getTaskTop(predecessorNode) - dependencyLineGap;

      // Lock values at .5 px grid to ensure consistent SVG rendering of crispedges across browsers
      x1 = Math.round(x1) + 0.5;
      x2 = Math.round(x2) + 0.5;
      y1 = Math.round(y1) + 0.5;
      y2 = Math.round(y2) + 0.5;
      y_intermediate = Math.round(y_intermediate) + 0.5;

      var x1_flank = x1 + (isTypeBeginFinish ? 1 : -1) * taskFlankLength;
      var x2_flank = isTypeEndFinish ? x2 + taskFlankLength : x2 - taskFlankLength;

      // Start at (x1, y1)
      var line = dvt.PathUtils.moveTo(x1, y1);

      if ((isTypeBeginFinish && x2_flank < x1_flank) || (!isTypeBeginFinish && x2_flank > x1_flank)) {
        // Horizontal line right (typeBegin == finish) or left (typeBegin == start) to x1_flank
        line += dvt.PathUtils.horizontalLineTo(x1_flank + (isTypeBeginFinish ? -1 : 1) * r);
        if (y2 > y1) {
          // Arc down
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank, y1 + r);
          if ((isTypeBeginFinish && isTypeEndFinish) || (!isTypeBeginFinish && !isTypeEndFinish)) {
            // Vertical line down
            line += dvt.PathUtils.verticalLineTo(y2 - r);
            // Arc left (typeBegin == finish) or right (typeBegin == start)
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 1 : 0,
              x1_flank + (isTypeBeginFinish ? -1 : 1) * r,
              y2
            );
          } else {
            // Vertical line down
            line += dvt.PathUtils.verticalLineTo(y_intermediate - r);
            // Arc left (typeBegin == finish) or right (typeBegin == start)
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 1 : 0,
              x1_flank + (isTypeBeginFinish ? -1 : 1) * r,
              y_intermediate
            );
            // Horizontal line left (typeBegin == finish) or right (typeBegin == start)
            line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? 1 : -1) * r);
            // Arc down
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 0 : 1,
              x2_flank,
              y_intermediate + r
            );
            // Vertical line down
            line += dvt.PathUtils.verticalLineTo(y2 - r);
            // Arc right (typeBegin == finish) or left (typeBegin == start)
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 0 : 1,
              x2_flank + (isTypeBeginFinish ? 1 : -1) * r,
              y2
            );
          }
        } else if (y2 < y1) {
          // Arc up
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x1_flank, y1 - r);
          if ((isTypeBeginFinish && isTypeEndFinish) || (!isTypeBeginFinish && !isTypeEndFinish)) {
            // Vertical line up
            line += dvt.PathUtils.verticalLineTo(y2 + r);
            // Arc left (typeBegin == finish) or right (typeBegin == start)
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 0 : 1,
              x1_flank + (isTypeBeginFinish ? -1 : 1) * r,
              y2
            );
          } else {
            // Vertical line up
            line += dvt.PathUtils.verticalLineTo(y_intermediate + r);
            // Arc left (typeBegin == finish) or right (typeBegin == start)
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 0 : 1,
              x1_flank + (isTypeBeginFinish ? -1 : 1) * r,
              y_intermediate
            );
            // Horizontal line left (typeBegin == finish) or right (typeBegin == start)
            line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? 1 : -1) * r);
            // Arc up
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 1 : 0,
              x2_flank,
              y_intermediate - r
            );
            // Vertical line up
            line += dvt.PathUtils.verticalLineTo(y2 + r);
            // Arc right (typeBegin == finish) or left (typeBegin == start)
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 1 : 0,
              x2_flank + (isTypeBeginFinish ? 1 : -1) * r,
              y2
            );
          }
        } else {
          // Arc down
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank, y1 + r);
          // Vertical line down
          line += dvt.PathUtils.verticalLineTo(y_intermediate - r);
          // Arc left (typeBegin == finish) or right (typeBegin == start)
          line += dvt.PathUtils.arcTo(
            r,
            r,
            Math.PI / 2,
            isTypeBeginFinish ? 1 : 0,
            x1_flank + (isTypeBeginFinish ? -1 : 1) * r,
            y_intermediate
          );
          // Horizontal line left (typeBegin == finish) or right (typeBegin == start)
          line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? 1 : -1) * r);
          // Arc up
          line += dvt.PathUtils.arcTo(
            r,
            r,
            Math.PI / 2,
            isTypeBeginFinish ? 1 : 0,
            x2_flank,
            y_intermediate - r
          );
          // Vertical line up
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
          line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? -1 : 1) * r);
          // Arc down
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x2_flank, y1 + r);
          // Vertical line down
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
          line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? -1 : 1) * r);
          // Arc up
          line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank, y1 - r);
          // Vertical line up
          line += dvt.PathUtils.verticalLineTo(y2 + r);
          if (isTypeEndFinish) {
            // Arc left
            line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2_flank - r, y2);
          } else {
            // Arc right
            line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2_flank + r, y2);
          }
        } else {
          if ((isTypeBeginFinish && isTypeEndFinish) || (!isTypeBeginFinish && !isTypeEndFinish)) {
            // Horizontal line right (typeBegin == finish) or left (typeBegin == start)
            line += dvt.PathUtils.horizontalLineTo(x1_flank + (isTypeBeginFinish ? -1 : 1) * r);
            // Arc down
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 1 : 0,
              x1_flank,
              y1 + r
            );
            // Vertical line down
            line += dvt.PathUtils.verticalLineTo(y_intermediate - r);
            // Arc right (typeBegin == finish) or left (typeBegin == start)
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 0 : 1,
              x1_flank + (isTypeBeginFinish ? 1 : -1) * r,
              y_intermediate
            );
            // Horizontal line  right (typeBegin == finish) or left (typeBegin == start)
            line += dvt.PathUtils.horizontalLineTo(x2_flank - r);
            // Arc up
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 0 : 1,
              x2_flank,
              y_intermediate - r
            );
            // Vertical line up
            line += dvt.PathUtils.verticalLineTo(y2 + r);
            // Arc left
            line += dvt.PathUtils.arcTo(
              r,
              r,
              Math.PI / 2,
              isTypeBeginFinish ? 0 : 1,
              x2_flank + (isTypeBeginFinish ? -1 : 1) * r,
              y2
            );
          }
        }
      }
      // End at (x2, y2)
      line += dvt.PathUtils.lineTo(x2, y2);

      return line;
    }

    /**
     * @override
     */
    getNextNavigable(event) {
      if (
        event.keyCode === dvt.KeyboardEvent.UP_ARROW ||
        event.keyCode === dvt.KeyboardEvent.DOWN_ARROW
      ) {
        // this logic is identical to Diagram and TMap
        // if the dependency line got focus via keyboard, get the task where the focus came from
        // we'll navigate around that task
        // if the focus was set through mouse click, set predecessor as a center of navigation
        var task = this.getKeyboardFocusTask();
        if (!task) task = this.getPredecessorNode();

        // go to the previous/next dependency line
        var nextDependencyLine = this;
        var keyboardHandler = this.getGantt().getEventManager().getKeyboardHandler();
        if (keyboardHandler && keyboardHandler.getNextNavigableDependencyLine) {
          var type = task === this.getPredecessorNode() ? 'successor' : 'predecessor';
          var dependencyLines = this.getGantt().getNavigableDependencyLinesForTask(task, type);
          nextDependencyLine = keyboardHandler.getNextNavigableDependencyLine(
            task,
            this,
            event,
            dependencyLines
          );
        }

        nextDependencyLine.setKeyboardFocusTask(task);
        return nextDependencyLine;
      } else if (
        event.keyCode === dvt.KeyboardEvent.RIGHT_ARROW ||
        event.keyCode === dvt.KeyboardEvent.LEFT_ARROW
      ) {
        if (dvt.Agent.isRightToLeft(this.getGantt().getCtx()))
          return event.keyCode === dvt.KeyboardEvent.LEFT_ARROW
            ? this.getSuccessorNode()
            : this.getPredecessorNode();
        else
          return event.keyCode === dvt.KeyboardEvent.RIGHT_ARROW
            ? this.getSuccessorNode()
            : this.getPredecessorNode();
      } else if (event.type === dvt.MouseEvent.CLICK) {
        return this;
      }
      return null;
    }

    /**
     * Sets a node that should be used for dependency line navigation
     * @param {DvtGanttTaskNode} node
     */
    setKeyboardFocusTask(node) {
      this._keyboardNavNode = node;
    }

    /**
     * Gets a node that should be used for dependency line navigation
     * @return {DvtGanttTaskNode} a node that should be used for dependency line navigation
     */
    getKeyboardFocusTask() {
      return this._keyboardNavNode;
    }

    /**
     * @override
     */
    getKeyboardBoundingBox(targetCoordinateSpace) {
      return this.getDimensions(targetCoordinateSpace);
    }

    /**
     * @override
     */
    getTargetElem() {
      return this._content ? this._content.getContainerElem() : this._line.getElem();
    }

    /**
     * @override
     */
    showKeyboardFocusEffect() {
      if (this.isCustomContent()) {
        this._renderCustomContent({ focused: true });
        this._isShowingKeyboardFocusEffect = true;
      } else if (this._line) {
        dvt.ToolkitUtils.addClassName(this._line.getElem(), this._gantt.GetStyleClass('focus'));
        this._line.showHoverEffect();

        this._isShowingKeyboardFocusEffect = true;
      }
    }

    /**
     * @override
     */
    hideKeyboardFocusEffect() {
      if (this.isShowingKeyboardFocusEffect()) {
        if (this.isCustomContent()) {
          this._renderCustomContent({ focused: false });
        } else {
          this._line.hideHoverEffect();
          dvt.ToolkitUtils.removeClassName(this._line.getElem(), this._gantt.GetStyleClass('focus'));
        }
        this._isShowingKeyboardFocusEffect = false;
      }
    }

    /**
     * @override
     */
    isShowingKeyboardFocusEffect() {
      return this._isShowingKeyboardFocusEffect;
    }

    /**
     * Retrieves the tooltip to display on the dependency line
     * @override
     */
    getDatatip(target, x, y) {
      return this.getAriaLabel();
    }

    /**
     * Gets the aria label
     * @return {string} the aria label string.
     */
    getAriaLabel() {
      return this._dependencyObj.ariaLabel;
    }
  }

  // supported dependency types
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
  DvtGanttDependencyNode.FINISH_FINISH = 'finishFinish';

  // used for value indicating conflict between lines
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
   * Class representing a Gantt row label content (plain text, or custom content from custom renderer)
   * @param {DvtGanttRowAxis} rowAxis The associated row axis container.
   * @param {string} contentType The content type, either 'custom', or 'text'
   * @implements {DvtKeyboardNavigable}
   * @class
   * @constructor
   */
  class DvtGanttRowLabelContent {
    constructor(rowAxis, contentType) {
      this._rowAxis = rowAxis;
      this._gantt = rowAxis._gantt;
      this._contentType = contentType;
      this.nodeType = 'rowLabel';
    }

    /**
     * Renders the row label content.
     * @param {object} rowObj The associated row data layout object
     */
    render(rowObj) {
      var rowData = rowObj['data'];
      this._labelString = rowData['label'] != null ? rowData['label'] : '';
      var shortDesc = rowData['shortDesc'] != null ? rowData['shortDesc'] : '';
      this._shortDesc =
        typeof shortDesc === 'function'
          ? shortDesc({ data: rowObj.data, itemData: rowObj.data._itemData })
          : shortDesc;
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var availableWidth = this._rowAxis.getAvailableWidth();

      // Render background before content for layering.
      // The dimensions are updated during row render.
      if (!this._contentBackground) {
        this._contentBackground = new dvt.Rect(this._gantt.getCtx(), 0, rowObj.y, 0, rowObj.height);
        this._contentBackground.setPixelHinting(true);
        this._contentBackground.setClassName(this._gantt.GetStyleClass('row'));
        this._gantt.getEventManager().associate(this._contentBackground, this, true);
      }
      if (!this._contentBackground.getParent()) {
        this._rowAxis.addLabelBackground(this._contentBackground);
      }

      if (!this._content) {
        this._content =
          this._contentType === 'custom'
            ? this._getCustomContent(rowObj, availableWidth)
            : this._getTextContent(rowObj);
        this._content.setAriaRole('rowheader', true);
      }
      if (!this._contentDisplayable) {
        this._contentDisplayable = this._gantt.isRowsHierarchical()
          ? this._addExpandCollapseButton(this._content, rowObj)
          : this._content;
        this._gantt.getEventManager().associate(this._contentDisplayable, this, true);

        this._contentDisplayableContainer = this._contentDisplayable;
        // Hierarchical labels are already wrapped with a container by _addExpandCollapseButton
        // Non hierarchical labels should also be wrapped with a container so that a role "row" can be set on it:
        if (!this._gantt.isRowsHierarchical()) {
          this._contentDisplayableContainer = new dvt.Container(this._gantt.getCtx());
          this._contentDisplayableContainer.addChild(this._contentDisplayable);
        }
        // Note the "true" flag; we don't want deferred aria creation for the role because the parent with role "rowheader"
        // and the ancestor role "grid" requires role "row" children to be present on initial render. Otherwise an axe-core violation is triggered.
        // Performance is not really a concern because there are typically far more tasks than rows.
        this._contentDisplayableContainer.setAriaRole('row', true);
      }
      if (!this._contentDisplayableContainer.getParent()) {
        this._rowAxis.addLabelContent(this._contentDisplayableContainer);
      }

      // TODO consider tweaking the logic to avoid this step when an explicit width is set on the row axis for potential performance improvements, especially for custom content
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
        }
        // Ensure width is positive
        this._width = Math.max(0, this._width);
        this._yTopOFfset = contentDimensions.y;
      } else {
        // For custom content, calling getDimensions() on the contentDisplayable <g> element gives x, y relative to the container coordinate space,
        // whereas calling getDimensions() on non custom dvt.OutputText gives x, y relative to the row axis container coordinate space, so there is no need to account for
        // translations for the width/height of non custom text content.
        this._width = Math.min(contentDimensions.w, availableWidth['calculatedWidth']); // Label would have been truncated to fit if the available width is smaller than the label width
        this._yTopOFfset = 0;
      }

      this._height = contentDimensions.h;

      this._contentDisplayable.setAriaProperty('label', this.getAriaLabel());

      // DvtOutputText by default sets aria-hidden to true. We need to ensure this is unset for accessibility.
      this._contentDisplayable.setAriaProperty('hidden', null);
    }

    /**
     * Gets the custom content element.
     * @param {Object} rowObj The row's layout object.
     * @param {Object} availableWidth An object containing the max width, width, and calculated width, in px. -1 width means 'max-content'
     * @private
     */
    _getCustomContent(rowObj, availableWidth) {
      var rowData = rowObj['data'];
      var content = new dvt.Container(this._gantt.getCtx());
      var labelStyle = rowData['labelStyle'];
      if (labelStyle != null) {
        content.setStyle(labelStyle);
      }

      var options = this._gantt.getOptions();
      var renderer = options['rowAxis']['label']['renderer']; // must have been defined if reached here
      var startPadding = DvtGanttStyleUtils.getRowLabelPaddingStart(options);
      var endPadding = DvtGanttStyleUtils.getRowLabelPaddingEnd(options);
      var totalPadding = startPadding + endPadding;

      // maxWidth in the renderer context should be -1 if width is unbounded AND max-width is unbounded. Otherwise, width is bounded in some way, so give them that value in px
      var maxWidthOption = this._gantt.getRowAxisMaxWidth();
      if (availableWidth['width'] === -1 && maxWidthOption != null && maxWidthOption === 'none') {
        var contextMaxWidth = -1;
      } else if (this._gantt.isRowsHierarchical()) {
        // some space reserved for hierarchical indentation and expand/collapse button and padding
        contextMaxWidth =
          Math.max(
            0,
            availableWidth['calculatedWidth'] - this._rowAxis.getLabelContentIndentSize(rowObj)
          ) - totalPadding;
      } else {
        // some space reserved for padding
        contextMaxWidth = Math.max(0, availableWidth['calculatedWidth'] - totalPadding);
      }

      var availableHeight = rowObj['height'];
      var parentElement = content.getContainerElem();
      var customContent = renderer(
        this.getRendererContext(rowObj, contextMaxWidth, availableHeight, parentElement)
      );

      if (customContent) {
        if (Array.isArray(customContent)) {
          customContent.forEach((node) => {
            dvt.ToolkitUtils.appendChildElem(parentElement, node);
          });
        } else {
          dvt.ToolkitUtils.appendChildElem(parentElement, customContent);
        }
      }
      return content;
    }

    /**
     * Gets the text content element.
     * @param {Object} rowObj The row's layout object.
     * @private
     */
    _getTextContent(rowObj) {
      var rowData = rowObj['data'];
      var content = new dvt.OutputText(this._gantt.getCtx(), this._labelString, 0, 0);

      // sets the style if specified in options
      var labelStyle = rowData['labelStyle'];
      if (labelStyle != null && labelStyle !== '' && Object.keys(labelStyle).length !== 0) {
        content.setStyle(labelStyle); // works if style is object
      }
      content.setCSSStyle(this._rowAxis._getCSSStyle(labelStyle)); // necessary for getDimension/fitText to obtain CSS style of the text

      return content;
    }

    /**
     * Adds expand/collapse icons to the given label content
     * @param {dvt.Displayable} content
     * @param {Object} rowObj The row's layout object
     * @return {dvt.Container} <g> element consisting of the icon and content
     * @private
     */
    _addExpandCollapseButton(content, rowObj) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var container = new dvt.Container(this._gantt.getCtx());
      var indentSize = this._rowAxis.getLabelContentIndentSize(rowObj);
      var contentTranslateX = isRTL ? -indentSize : indentSize;
      if (isRTL && this._contentType === 'text') {
        // dvt.OutputText always treats left side as start regardless of reading direction
        contentTranslateX -= content.getDimensions().w;
      }
      content.setTranslateX(contentTranslateX);

      // Content needs to be in DOM in order for subsequent getDimensions to work
      container.addChild(content);
      this._rowAxis.addLabelContent(container);

      if (rowObj['expanded'] != null) {
        // if not leaf
        var buttonSize = DvtGanttStyleUtils.getRowLabelButtonSize();
        var gapSize = DvtGanttStyleUtils.getRowLabelButtonContentGapSize();
        var buttonX = indentSize - (buttonSize + gapSize);
        buttonX = isRTL ? -(buttonX + buttonSize) : buttonX;
        var buttonY = (content.getDimensions().h - buttonSize) / 2;
        var em = this._gantt.getEventManager();
        var button = this._createExpandCollapseButton(
          this._gantt.getCtx(),
          this._gantt.getOptions()['_resources'],
          rowObj['expanded'] ? 'open' : 'closed',
          buttonX,
          buttonY,
          buttonSize,
          em.onExpandCollapseButtonClick,
          em
        );
        this._button = button;
        container.addChild(button);
      } else {
        this._button = null;
      }
      return container;
    }

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
     * @return {dvt.IconButton} The button.
     * @private
     */
    _createExpandCollapseButton(context, resources, prefix, x, y, size, callback, callbackObj) {
      var iconStyle = dvt.ToolkitUtils.getIconStyle(context, resources[prefix]);
      var button = new dvt.IconButton(
        context,
        'borderless',
        { style: iconStyle, size: size },
        null,
        null,
        callback,
        callbackObj
      );
      button.setTranslate(x, y);

      button.setAriaRole('button');
      button.setAriaProperty('label', this.getAriaLabel());
      this._gantt.getEventManager().associate(button, this);

      return button;
    }

    /**
     * Gets the context to be passed into custom renderer callbacks
     * @param {object} rowObj
     * @param {number} maxWidth
     * @param {number} maxHeight
     * @param {Element} parentElement
     * @return {object} The renderer context
     */
    getRendererContext(rowObj, maxWidth, maxHeight, parentElement) {
      var options = this._gantt.getOptions();
      var dataLayoutManager = this._gantt.getDataLayoutManager();
      var rowData = rowObj['data'];
      var taskObjs = rowData['tasks'];
      var itemData = [];
      var isUsingDataProvider = options['rowData'] || options['taskData'];
      if (isUsingDataProvider) {
        for (var i = 0; i < taskObjs.length; i++) {
          itemData.push(taskObjs[i]['_itemData']);
        }
      }

      var parentRowObj = dataLayoutManager.getParentRowObj(rowObj);
      var dataContext = {
        component: options['_widgetConstructor'],
        parentElement: parentElement,
        rowData: ojdvtTimecomponent.TimeComponent.sanitizeData(rowData, 'row'),
        itemData: isUsingDataProvider ? itemData : null,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        data: options['rowData'] ? rowData['_itemData'] : null,
        depth: rowObj['depth'],
        leaf: rowObj['expanded'] == null,
        parentKey: parentRowObj ? parentRowObj['id'] : null
      };
      return this._gantt.getCtx().fixRendererContext(dataContext);
    }

    /**
     * Gets the associated row node.
     * @return {DvtGanttRowNode} the associated row node.
     */
    getRow() {
      return this._rowNode;
    }

    /**
     * Sets the associated row node.
     * @param {DvtGanttRowNode} rowNode the associated row node.
     */
    setRow(rowNode) {
      this._rowNode = rowNode;
    }

    /**
     * Gets the row index
     * @return {number} the row index
     */
    getRowIndex() {
      return this._rowIndex;
    }

    /**
     * Sets the row index
     * @param {number} index The row index
     */
    setRowIndex(index) {
      this._rowIndex = index;
    }

    /**
     * Gets the associated row's layout object.
     * @return {Object} The row's layout object.
     */
    getRowLayoutObject() {
      return this._gantt.getRowLayoutObjs()[this.getRowIndex()];
    }

    /**
     * Gets the content displayable
     * @return {dvt.Displayable} The content displayable
     */
    getDisplayable() {
      // TODO should this be getDisplayble() or getDisplayables() that return an array of 1 thing?
      return this._contentDisplayable;
    }

    /**
     * Gets the content displayable container
     * @return {dvt.Container} The content displayable container
     */
    getDisplayableContainer() {
      return this._contentDisplayableContainer;
    }

    /**
     * Gets the content background
     * @return {dvt.Displayable} The content displayable
     */
    getBackground() {
      return this._contentBackground;
    }

    /**
     * Gets the expand collapse button
     * @return {dvt.IconButton}
     */
    getExpandCollapseButton() {
      return this._button;
    }

    /**
     * Gets the row label string
     * @return {string} The label string
     */
    getLabelString() {
      return this._labelString;
    }

    /**
     * Gets the displayable type
     * @return {string} 'g' or 'text
     */
    getDisplayableType() {
      return this._gantt.isRowsHierarchical() || this._contentType === 'custom' ? 'g' : 'text';
    }

    /**
     * Gets the content type
     * @return {string} The content type, either 'custom', or 'text'
     */
    getContentType() {
      return this._contentType;
    }

    /**
     * Gets the x position within the row axis
     * @return {number}
     */
    getX() {
      if (this.getDisplayableType() === 'text') return this._contentDisplayable.getX();
      else return this._contentDisplayable.getTranslateX();
    }

    /**
     * Sets the x position within the row axis
     * @param {number} x The desired x position
     */
    setX(x) {
      if (this.getDisplayableType() === 'text') this._contentDisplayable.setX(x);
      else this._contentDisplayable.setTranslateX(x);
    }

    /**
     * Gets the y position within the row axis
     * @return {number}
     */
    getY() {
      if (this.getDisplayableType() === 'text') return this._contentDisplayable.getY();
      else return this._contentDisplayable.getTranslateY();
    }

    /**
     * Sets the y position within the row axis
     * @param {number} y The desired y position
     */
    setY(y) {
      if (this.getDisplayableType() === 'text') this._contentDisplayable.setY(y);
      else this._contentDisplayable.setTranslateY(y);
    }

    /**
     * Gets the content width
     * @return {number}
     */
    getWidth() {
      return this._width;
    }

    /**
     * Gets the content height
     * @return {number}
     */
    getHeight() {
      return this._height;
    }

    /**
     * Gets the content y
     * @return {number}
     */
    getYTopOffset() {
      return this._yTopOFfset;
    }

    /**
     * Gets the aria label
     * @return {string} the aria label string.
     */
    getAriaLabel() {
      var translations = this._gantt.getOptions().translations;
      var states = [];
      var rowObj = this.getRowLayoutObject();
      if (rowObj['expanded'] != null) {
        states.push(translations[rowObj['expanded'] ? 'stateExpanded' : 'stateCollapsed']);
      }
      var desc = this._shortDesc || this.getLabelString();
      if (this._gantt.isRowsHierarchical()) {
        desc = translations.labelLevel + ' ' + rowObj['depth'] + ', ' + desc;
      }
      return dvt.Displayable.generateAriaLabel(desc, states);
    }

    /**
     * Ensures row label is in the DOM
     */
    ensureInDOM() {
      if (this._contentDisplayable.getParent() !== null) {
        return;
      }

      this._rowAxis.addLabelBackground(this._contentBackground);
      this._rowAxis.addLabelContent(this._contentDisplayable);
    }

    /**
     * Removes itself from DOM
     */
    remove() {
      this._rowAxis.removeLabelBackground(this._contentBackground);
      this._rowAxis.removeLabelContent(this._contentDisplayable);
    }

    // ---------------------------------------------------------------------//
    // Keyboard Support: DvtKeyboardNavigable impl                          //
    // ---------------------------------------------------------------------//

    /**
     * @override
     */
    getNextNavigable(event) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var eventManager = this._gantt.getEventManager();
      var dataLayoutManager = this._gantt.getDataLayoutManager();
      var rowObjs = this._gantt.getRowLayoutObjs();
      var rowObj = this.getRowLayoutObject();

      // Navigating to task
      if (
        event.altKey &&
        ((!isRTL && event.keyCode === dvt.KeyboardEvent.RIGHT_ARROW) ||
          (isRTL && event.keyCode === dvt.KeyboardEvent.LEFT_ARROW))
      ) {
        // If row is empty, do nothing and stay on this row label.
        if (rowObj.taskObjs.length === 0) {
          return this;
        }

        // If last focused task is on the same row as this label, navigate to it
        var lastFocusedTask = eventManager.getLastFocusedTask();
        if (
          lastFocusedTask &&
          dvt.Obj.compareValues(
            this._gantt.getCtx(),
            lastFocusedTask.getLayoutObject().rowObj.id,
            rowObj.id
          )
        ) {
          dataLayoutManager.ensureInDOM(lastFocusedTask.getLayoutObject(), 'task');
          return lastFocusedTask;
        }

        // Otherwise, navigate to the first task of this row.
        var firstTaskObj = rowObj.taskObjs[0];
        dataLayoutManager.ensureInDOM(firstTaskObj, 'task');
        var firstTaskNode = firstTaskObj.node;
        eventManager.setLastFocusedTask(firstTaskNode);
        return firstTaskNode;
      }

      // Navigating to row label above
      if (event.keyCode === dvt.KeyboardEvent.UP_ARROW) {
        var rowObjAbove = rowObjs[Math.max(0, rowObj.index - 1)];
        dataLayoutManager.ensureInDOM(rowObjAbove, 'row');
        var rowNodeAbove = rowObjAbove.node;
        return rowNodeAbove.getRowLabelContent();
      }

      // Navigating to row label below
      if (event.keyCode === dvt.KeyboardEvent.DOWN_ARROW) {
        var rowObjBelow = rowObjs[Math.min(rowObjs.length - 1, rowObj.index + 1)];
        dataLayoutManager.ensureInDOM(rowObjBelow, 'row');
        var rowNodeBelow = rowObjBelow.node;
        return rowNodeBelow.getRowLabelContent();
      }

      return this;
    }

    /**
     * @override
     */
    getTargetElem() {
      return this._contentDisplayable.getElem();
    }

    /**
     * @override
     */
    getKeyboardBoundingBox(targetCoordinateSpace) {
      return this._contentDisplayable.getDimensions(targetCoordinateSpace);
    }

    /**
     * @override
     */
    showKeyboardFocusEffect() {
      this._isShowingKeyboardFocusEffect = true;
      // Node should exist in DOM already due to ensureInDOM call in getNextNavigable()
      var rowObj = this.getRowLayoutObject();
      var rowNode = rowObj.node;
      rowNode.scrollIntoView();

      var backgroundElem = this._contentBackground.getElem();
      dvt.ToolkitUtils.addClassName(backgroundElem, this._gantt.GetStyleClass('focusHighlight'));
    }

    /**
     * @override
     */
    hideKeyboardFocusEffect() {
      var backgroundElem = this._contentBackground.getElem();
      dvt.ToolkitUtils.removeClassName(backgroundElem, this._gantt.GetStyleClass('focusHighlight'));
      this._isShowingKeyboardFocusEffect = false;
    }

    /**
     * @override
     */
    isShowingKeyboardFocusEffect() {
      return this._isShowingKeyboardFocusEffect;
    }

    // ---------------------------------------------------------------------//
    // Tooltip Support: DvtTooltipSource impl                               //
    // ---------------------------------------------------------------------//

    /**
     * @override
     */
    getDatatip() {
      return this._shortDesc;
    }
  }

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
   *        mainBackground - The background for the main shape
   *        mainSelect - The main selection shape
   *        mainHover - The main hover shape
   *        mainFocus - The main focus shape
   *        mainDragFeedback - The main drag feedback
   *        mainResizeHandleStart - The main start resize handle
   *        mainResizeHandleEnd - The main end resize handle
   *        mainResizeHandleDragFeedback - The main resize handle drag feedback
   *        baseline - The baseline shape, e.g. bar or milestone shape
   *        baselineSelect - The baseline selection shape
   *        baselineHover - The baseline hover shape
   *        overtime - The overtime shape
   *        downtime - The downtime shape
   *        attribute - The attribute shape
   *        progress - The progress element shape
   * @param {string=} id The optional id for the corresponding DOM element.
   * @extends {dvt.Path}
   * @class
   * @constructor
   */
  class DvtGanttTaskShape extends dvt.Path {
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
     *        mainBackground - The background for the main shape
     *        mainSelect - The main selection shape
     *        mainHover - The main hover shape
     *        mainFocus - The main focus shape
     *        mainDragFeedback - The main drag feedback
     *        mainResizeHandleStart - The main start resize handle
     *        mainResizeHandleEnd - The main end resize handle
     *        mainResizeHandleDragFeedback - The main resize handle drag feedback
     *        baseline - The baseline shape, e.g. bar or milestone shape
     *        baselineSelect - The baseline selection shape
     *        baselineHover - The baseline hover shape
     *        overtime - The overtime shape
     *        downtime - The downtime shape
     *        attribute - The attribute shape
     *        progress - The progress element shape
     * @param {string=} id The optional id for the corresponding DOM element.
     * @protected
     */
    constructor(context, x, y, w, h, r, task, type, id) {
      super(context, null, id);
      var cmds;
      this._context = context;
      this._x = x;
      this._y = y;
      this._w = w;
      this._h = h;
      this._r = r != null ? r : '0';
      this._task = task;
      this._type = type;
      this._isHighlighted = false;
      this._renderState = 'add';
      this._typeCmdGeneratorMap = {
        main: this._generateRepShapeCmd,
        mainBackground: this._generateRepShapeCmd,
        mainSelect: this._generateRepShapeCmd,
        mainHover: this._generateRepShapeCmd,
        mainFocus: this._generateRepShapeCmd,
        mainDragFeedback: this._generateRepShapeCmd,
        mainResizeHandleStart: this._generateRectCmd,
        mainResizeHandleEnd: this._generateRectCmd,
        mainResizeHandleDragFeedback: this._generateRectCmd,
        progress: this._generateRectCmd,
        progressZero: this._generateRectCmd,
        progressFull: this._generateRectCmd,
        baseline: this._generateRepShapeCmd,
        baselineSelect: this._generateRepShapeCmd,
        baselineHover: this._generateRepShapeCmd,
        overtime: this._generateRectCmd,
        downtime: this._generateRectCmd,
        attribute: this._generateRectCmd
      };

      cmds = this.generateCmd(this._x, this._y, this._w, this._h, this._r);
      this.setCmds(cmds);

      this.applyStyleClasses();

      switch (this._type) {
        case 'mainDragFeedback':
        case 'mainResizeHandleDragFeedback':
          this.setMouseEnabled(false); // Disable pointer-events for dnd feedbacks
        case 'mainResizeHandleStart':
        case 'mainResizeHandleEnd':
          task.getGantt().getEventManager().associate(this, task.getContainer());
        case 'main':
        case 'progress':
        case 'progressZero':
        case 'progressFull':
        case 'baseline':
        case 'overtime':
        case 'downtime':
        case 'attribute':
          this.setPixelHinting(context.getThemeBehavior() === 'alta');
          break;
      }
    }

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
    _generateRepShapeCmd(x, y, w, h, r) {
      var isRTL = dvt.Agent.isRightToLeft(this._context);
      var margin =
          (DvtGanttTaskShape.MAIN_EFFECT_TYPES.indexOf(this._type) > -1 ||
            DvtGanttTaskShape.BASELINE_EFFECT_TYPES.indexOf(this._type) > -1) *
          DvtGanttStyleUtils.getTaskEffectMargin(),
        diamondMargin;

      // In non-alta themes, hover effects don't have margin
      if (this._context.getThemeBehavior() !== 'alta' && this._type === 'mainHover') {
        margin = 0;
      }

      // Diamond shape for milestone
      if (this._task.isMilestone(this._type) && w === 0) {
        diamondMargin = margin * Math.sqrt(2);
        return this._generateDiamondCmd(x, y - diamondMargin, h + 2 * diamondMargin, r);
      } else if (this._task.isSummary(this._type) && this._type === 'main') {
        return this._generateSummaryCmd(x, y, w, h, r);
      } else {
        // bar shape otherwise
        return this._generateRectCmd(
          !isRTL ? x - margin : x + margin,
          y - margin,
          w + 2 * margin,
          h + 2 * margin,
          r
        );
      }
    }

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
    _generateRectCmd(x, y, w, h, r) {
      var isRTL = dvt.Agent.isRightToLeft(this._context);

      // dvt.PathUtils.rectangleWithBorderRadius is expensive (mostly due to parsing
      // border radius string). For our default 0px border radius case, skip the parsing and
      // generate the path.
      if (r === '0' || r === '0px') {
        // In LTR, reference point is at top left corner; top right in RTL
        return (
          dvt.PathUtils.moveTo(x, y) +
          dvt.PathUtils.horizontalLineTo(isRTL ? x - w : x + w) +
          dvt.PathUtils.verticalLineTo(y + h) +
          dvt.PathUtils.horizontalLineTo(x) +
          dvt.PathUtils.closePath()
        );
      }
      return dvt.PathUtils.rectangleWithBorderRadius(x - isRTL * w, y, w, h, r, Math.min(w, h), '0');
    }

    /**
     * Generates the path command that draws a summary shape.
     * In LTR, reference point is at the top left corner. Top right in RTL.
     * @param {number} x position
     * @param {number} y posiiton
     * @param {number} w width
     * @param {number} h height
     * @param {string=} r borderradius
     * @return {string} the command string
     * @private
     */
    _generateSummaryCmd(x, y, w, h, r) {
      if (this._context.getThemeBehavior() === 'alta') {
        var isRTL = dvt.Agent.isRightToLeft(this._context);

        // For our default 0px border radius case, skip the parsing and generate the path.
        var thickness = DvtGanttStyleUtils.getSummaryThickness();
        if (r === '0' || r === '0px') {
          if (w > 2 * thickness) {
            // In LTR, reference is at top left corner, top right in RTL
            return (
              dvt.PathUtils.moveTo(x, y + h) +
              dvt.PathUtils.verticalLineTo(y) +
              dvt.PathUtils.horizontalLineTo(isRTL ? x - w : x + w) +
              dvt.PathUtils.verticalLineTo(y + h) +
              dvt.PathUtils.horizontalLineTo(isRTL ? x - w + thickness : x + w - thickness) +
              dvt.PathUtils.verticalLineTo(y + thickness) +
              dvt.PathUtils.horizontalLineTo(isRTL ? x - thickness : x + thickness) +
              dvt.PathUtils.verticalLineTo(y + h) +
              dvt.PathUtils.closePath()
            );
          }
          return this._generateRectCmd(x, y, w, h, r);
        }

        // Only support same radius for the top left and top right corners for summary tasks
        var outerBr = Math.min(
          new dvt.CSSStyle({ 'border-radius': r }).getBorderRadius(),
          Math.min(w, h)
        );
        var innerBr = Math.max(outerBr - thickness, 0);
        if (w > 2 * thickness) {
          // In LTR, reference is at top left corner, top right in RTL
          return (
            dvt.PathUtils.moveTo(x, y + h) +
            dvt.PathUtils.verticalLineTo(y + outerBr) +
            dvt.PathUtils.arcTo(
              outerBr,
              outerBr,
              Math.PI / 2,
              isRTL ? 0 : 1,
              isRTL ? x - outerBr : x + outerBr,
              y
            ) +
            dvt.PathUtils.horizontalLineTo(isRTL ? x - w + outerBr : x + w - outerBr) +
            dvt.PathUtils.arcTo(
              outerBr,
              outerBr,
              Math.PI / 2,
              isRTL ? 0 : 1,
              isRTL ? x - w : x + w,
              y + outerBr
            ) +
            dvt.PathUtils.verticalLineTo(y + h) +
            dvt.PathUtils.horizontalLineTo(isRTL ? x - w + thickness : x + w - thickness) +
            dvt.PathUtils.verticalLineTo(y + thickness + innerBr) +
            dvt.PathUtils.arcTo(
              innerBr,
              innerBr,
              Math.PI / 2,
              isRTL ? 1 : 0,
              isRTL ? x - w + thickness + innerBr : x + w - thickness - innerBr,
              y + thickness
            ) +
            dvt.PathUtils.horizontalLineTo(
              isRTL ? x - thickness - innerBr : x + thickness + innerBr
            ) +
            dvt.PathUtils.arcTo(
              innerBr,
              innerBr,
              Math.PI / 2,
              isRTL ? 1 : 0,
              isRTL ? x - thickness : x + thickness,
              y + thickness + innerBr
            ) +
            dvt.PathUtils.verticalLineTo(y + h) +
            dvt.PathUtils.closePath()
          );
        }
        return dvt.PathUtils.rectangleWithBorderRadius(
          x - isRTL * w,
          y,
          w,
          h,
          outerBr + 'px ' + outerBr + 'px 0px 0px',
          Math.min(w, h),
          '0'
        );
      }
      // New design is to render summary bars just like normal task bars (but with different colors).
      return this._generateRectCmd(x, y, w, h, r);
    }

    /**
     * Generates the path command that draws a diamond with given dimensions and radius.
     * @param {number} x position
     * @param {number} y posiiton
     * @param {number} h height
     * @param {string=} r borderradius If not specified assume to be 0.
     * @return {string} the command string
     * @private
     */
    _generateDiamondCmd(x, y, h, r) {
      var half_h = h / 2;
      // For our default 0px border radius case, skip the parsing and generate the path.
      if (r === '0' || r === '0px') {
        return (
          dvt.PathUtils.moveTo(x, y) +
          dvt.PathUtils.lineTo(x + half_h, y + half_h) +
          dvt.PathUtils.lineTo(x, y + h) +
          dvt.PathUtils.lineTo(x - half_h, y + half_h) +
          dvt.PathUtils.closePath()
        );
      }
      // Only support 4 corner with the same radius for milestone diamond
      var br = Math.min(
          new dvt.CSSStyle({ 'border-radius': r }).getBorderRadius(),
          h / (2 * Math.sqrt(2))
        ),
        r_over_root2 = br / Math.sqrt(2),
        rx = br,
        ry = br;
      return (
        dvt.PathUtils.moveTo(x - r_over_root2, y + r_over_root2) +
        dvt.PathUtils.arcTo(rx, ry, 0, 1, x + r_over_root2, y + r_over_root2) +
        dvt.PathUtils.lineTo(x + half_h - r_over_root2, y + half_h - r_over_root2) +
        dvt.PathUtils.arcTo(rx, ry, 0, 1, x + half_h - r_over_root2, y + half_h + r_over_root2) +
        dvt.PathUtils.lineTo(x + r_over_root2, y + h - r_over_root2) +
        dvt.PathUtils.arcTo(rx, ry, 0, 1, x - r_over_root2, y + h - r_over_root2) +
        dvt.PathUtils.lineTo(x - half_h + r_over_root2, y + half_h + r_over_root2) +
        dvt.PathUtils.arcTo(rx, ry, 0, 1, x - half_h + r_over_root2, y + half_h - r_over_root2) +
        dvt.PathUtils.closePath()
      );
    }

    /**
     * Generates the path command for the shape.
     * @param {number} x position
     * @param {number} y posiiton
     * @param {number} h height
     * @param {string=} r borderradius If not specified assume to be 0.
     * @return {string} the command string
     */
    generateCmd(x, y, w, h, r) {
      var gantt = this._task.getGantt();
      var precision = gantt.getRenderingPrecision();
      if (precision === null) {
        return this._typeCmdGeneratorMap[this._type].call(this, x, y, w, h, r);
      }
      return this._typeCmdGeneratorMap[this._type].call(
        this,
        gantt.round(x, precision),
        gantt.round(y, precision),
        gantt.round(w, precision),
        gantt.round(h, precision),
        r
      );
    }

    /**
     * Gets base style classes for the shape based on the specified type.
     */
    getDefaultStyleClasses() {
      let styleClass;
      let milestoneDefaultClass;
      let barDefaultClass;
      let summaryDefaultClass;
      const gantt = this._task.getGantt();
      const taskDraggable = gantt.getEventManager().IsDragSupported('tasks');

      switch (this._type) {
        case 'main':
        case 'mainSelect':
        case 'mainHover':
        case 'mainFocus':
          styleClass = gantt.GetStyleClass('task');
          milestoneDefaultClass = gantt.GetStyleClass('taskMilestone');
          barDefaultClass = gantt.GetStyleClass('taskBar');
          summaryDefaultClass = gantt.GetStyleClass('taskSummary');
          if (this._task.isMilestone(this._type) && this._w === 0) {
            styleClass += ' ' + milestoneDefaultClass;
          } else {
            styleClass +=
              ' ' + (this._task.isSummary(this._type) ? summaryDefaultClass : barDefaultClass);

            if (this._type === 'main' && this._task.getProgressValue() != null) {
              styleClass += ' ' + gantt.GetStyleClass('taskUnprogress');
            }
          }

          if (this._type === 'main' && taskDraggable) {
            styleClass += ' ' + gantt.GetStyleClass('draggable');
          } else if (this._type === 'mainSelect') {
            styleClass += ' ' + gantt.GetStyleClass('selected');
          } else if (this._type === 'mainHover') {
            styleClass += ' ' + gantt.GetStyleClass('hover');
          } else if (this._type === 'mainFocus') {
            styleClass += ' ' + gantt.GetStyleClass('focus');
          }
          break;
        case 'mainBackground':
          // Task colors may have opacity/alpha. Make tasks opaque by rendering a (white) background.
          styleClass = gantt.GetStyleClass('taskBackdrop');
          break;
        case 'progress':
        case 'progressZero':
        case 'progressFull':
          styleClass = gantt.GetStyleClass('taskProgress');
          if (this._task.isSummary('main')) {
            styleClass += ' ' + gantt.GetStyleClass('taskSummaryProgress');
          }
          if (taskDraggable) {
            styleClass += ' ' + gantt.GetStyleClass('draggable');
          }
          break;
        case 'overtime':
        case 'downtime':
        case 'attribute':
          styleClass = gantt.GetStyleClass(
            `task${this._type[0].toUpperCase()}${this._type.slice(1)}`
          );
          if (taskDraggable) {
            styleClass += ' ' + gantt.GetStyleClass('draggable');
          }
          break;
        case 'mainDragFeedback':
        case 'mainResizeHandleDragFeedback':
          styleClass = gantt.GetStyleClass('taskDragImage');
          break;
        case 'mainResizeHandleStart':
        case 'mainResizeHandleEnd':
          styleClass =
            gantt.GetStyleClass('taskResizeHandle') + ' ' + gantt.GetStyleClass('draggable');
          break;
        case 'baseline':
        case 'baselineSelect':
        case 'baselineHover':
          styleClass = gantt.GetStyleClass('baseline');
          milestoneDefaultClass = gantt.GetStyleClass('baselineMilestone');
          barDefaultClass = gantt.GetStyleClass('baselineBar');
          if (this._task.isMilestone(this._type) && this._w === 0) {
            styleClass += ' ' + milestoneDefaultClass;
          } else {
            styleClass += ' ' + barDefaultClass;
          }
          break;
        default:
          styleClass = '';
      }

      return styleClass;
    }

    /**
     * Applies default classes and any addition styles and classes to the shape based on the specified type.
     * @param {string=} svgClassName Classes to apply in addition to the default styles classes. Default undefined.
     */
    applyStyleClasses(svgClassName) {
      // In alta only, effect stroke colors reflect task fill
      if (
        (this._type === 'mainHover' || this._type === 'mainFocus') &&
        this._context.getThemeBehavior() === 'alta'
      ) {
        const style = { fill: 'none' };
        const taskFillColor = this._task.getFillColor();
        if (taskFillColor != null) {
          this.setStroke(dvt.SelectionEffectUtils.createSelectingStroke(taskFillColor['fill']));
          style['stroke'] = taskFillColor['fill']; // make sure stroke color is not overridden by CSS if any
          if (taskFillColor['filter'] === 'none') {
            style['filter'] = 'none';
          }
        }
        this.setStyle(style);
      }

      this._svgClassName = svgClassName;
      const defaultStyleClasses = this.getDefaultStyleClasses();
      this.setClassName(
        svgClassName ? `${defaultStyleClasses} ${svgClassName}` : defaultStyleClasses
      );
    }

    /**
     * @override
     */
    setClassName(className) {
      if (this.getClassName() === className) {
        return;
      }

      super.setClassName(className);

      // Unset any previously calculated fill color so that getFillColor() will recalculate after style change.
      this._fillColor = undefined;

      // If the task is highlighted, it would have the associated highlight CSS class applied.
      // However, calls to setClassName blows away the highlight class.
      // Add the highlight class if that's the case:
      if (this._isHighlighted) {
        this.highlight();
      }
    }

    /**
     * @override
     */
    setStyle(style) {
      if (this.getStyle() === style) {
        return;
      }

      super.setStyle(style);

      // Unset any previously calculated fill color so that getFillColor() will recalculate after style change.
      this._fillColor = undefined;
    }

    /**
     * "Highights" the task, i.e. for when selection-behavior is "highlightDependencies".
     */
    highlight() {
      if (!this._isHighlighted) {
        // Note this._elem needs to be used instead of this.getElem()
        // to reference the Path shape element--in touch device, this.getElem() returns
        // a <g> child group element rather than the shape element.
        dvt.ToolkitUtils.addClassName(
          this._elem,
          this._task.getGantt().GetStyleClass('taskHighlight')
        );
      }
      this._isHighlighted = true;
    }

    /**
     * "Un-Highights" the task, i.e. for when selection-behavior is "highlightDependencies".
     */
    unhighlight() {
      if (this._isHighlighted) {
        // See note in hightlight() method regarding this._elem vs this.getElem()
        dvt.ToolkitUtils.removeClassName(
          this._elem,
          this._task.getGantt().GetStyleClass('taskHighlight')
        );
      }
      this._isHighlighted = false;
    }

    /**
     * Returns whether the shape is highlighted.
     * @returns {boolean} Whether the shape is highlighted.
     */
    isHighlighted() {
      return this._isHighlighted;
    }

    /**
     * Gets the fill color of the shape
     * @return {object} an object containing the following information:
     *                  'fill': the fill property of the shape
     *                  'filter': the filter property of the shape
     *                  'computedFill': the *actual* fill of the shape, after the default tint/shade filter is applied
     *                  'stroke': the stroke color of the shape
     *                  'fromShapeCache': whether this object is returned from this shape's cache (in which case, the fill color didn't change since the last time it was computed)
     */
    getFillColor() {
      // Immediate cache (useful for updating task labels with inner positions that need contrast color calculations during zooming)
      if (this._fillColor) {
        this._fillColor.fromShapeCache = true;
        return this._fillColor;
      }

      // Global cache of computed fill color for a given task's class and style.
      // In most use cases, there are only a few possible task class and style varieties.
      // Useful for improving initial render performance of task labels with inner positions that need contrast color calculations.
      const cache = this._task.getGantt().getCache();
      const key = `FILL_(${JSON.stringify(this.getClassName()) || ''})_${
      JSON.stringify(this.getStyle()) || ''
    }`;
      const cachedFillColor = cache.getFromCache(key);
      if (cachedFillColor) {
        this._fillColor = cachedFillColor;
        return cachedFillColor;
      }

      var elem, svgRoot, computedStyle, fill, computedFill, filter, isUrlFill, fillColor, fillOpacity;

      // we need to figure out the fill color, which could be set in style class
      // In touch devices, the shape may be wrapped with a g element for aria purposes, so make sure to grab the path element
      elem = this.getElem();
      elem = elem.firstChild != null ? elem.firstChild : elem;
      elem = elem.cloneNode(false);
      svgRoot = this._task.getGantt().getCtx().getSvgDocument();
      svgRoot.appendChild(elem); // @HTMLUpdateOK
      try {
        computedStyle = window.getComputedStyle(elem);
        fill = computedStyle.fill;
        fillOpacity = Number(computedStyle.fillOpacity);
        filter = computedStyle.filter;
        if (!String.prototype.startsWith)
          // internet explorer 11 doesn't support startsWith() yet...
          isUrlFill = fill.indexOf('url(') === 0;
        else isUrlFill = fill.startsWith('url(');

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
          if (fillOpacity !== 1 && !Number.isNaN(fillOpacity)) {
            computedFill = dvt.ColorUtils.getBrighter(computedFill, 1 - fillOpacity);
          }
          fillColor = {
            fill: fill,
            computedFill: computedFill,
            filter: filter,
            stroke: computedStyle.stroke,
            fromShapeCache: false
          };
        }
      } finally {
        svgRoot.removeChild(elem);
      }
      this._fillColor = fillColor;
      cache.putToCache(key, fillColor);
      return fillColor;
    }

    /**
     * Gets the shape type.
     * @return {string} The type.
     */
    getType() {
      return this._type;
    }

    /**
     * Sets the shape type.
     * @param {string} type The type.
     */
    setType(type) {
      this._type = type;
    }

    /**
     * Gets the associated task.
     * @return {DvtGanttTask} The associated task.
     */
    getTask() {
      return this._task;
    }

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
    getPhysicalStartOffset() {
      if (
        (DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 ||
          DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) &&
        this._task.isMilestone(this._type)
      ) {
        return this._finalHeight / 2;
      }
      return 0;
    }

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
    getPhysicalEndOffset() {
      if (
        (DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 ||
          DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) &&
        this._task.isMilestone(this._type)
      ) {
        return this._finalHeight / 2;
      }
      return 0;
    }

    /**
     * Gets the shape type.
     * @return {string} The shape type.
     */
    getType() {
      return this._type;
    }

    /**
     * Gets the render state of the shape.
     * @return {string} the render state.
     */
    getRenderState() {
      return this._renderState;
    }

    /**
     * Sets the render state of the shape.
     * @param {string} state The render state.
     */
    setRenderState(state) {
      this._renderState = state;
    }

    /**
     * Gets width. Note this width can change during animation.
     * Note that if you get width for diamond shape, the width returned will be 0.
     * See documentation of getPhysicalStart/EndOffset methods for visualization.
     * @return {number} The width.
     */
    getWidth() {
      return this._w;
    }

    /**
     * Gets final width (animation independent, calculated from data; e.g. final width after animation finishes)
     * In other words, if there's no animation, or at the end of animation, this method should return the same value as getWidth
     * Note that for diamond shapes, even though the occupied width is nonzero, the logical width is 0 as calculated from data
     * See documentation of getPhysicalStart/EndOffset methods for visualization.
     * @return {number} The logical width.
     */
    getFinalWidth() {
      return this._finalWidth;
    }

    /**
     * Sets width.
     * @param {number} width The new width.
     */
    setWidth(width) {
      var cmds;
      // For main/baseline case, the shape can change from bar to diamond and vice versa, e.g. during animation and interactivity
      // Need to update style classes during these width/shape transitions
      if (
        (DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 ||
          DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) &&
        (this._w === 0 || width === 0)
      ) {
        this._w = width;
        this.applyStyleClasses(this._svgClassName);
      }

      this._w = width;
      cmds = this.generateCmd(this._x, this._y, this._w, this._h, this._r);
      this.setCmds(cmds);
    }

    /**
     * Sets the final width (animation independent, calculated from data; e.g. final width after animation finishes)
     * Note that for diamond shapes, even though the occupied width is nonzero, the logical width is 0 as calculated from data
     * See documentation of getPhysicalStart/EndOffset methods for visualization.
     * @param {number} width The new final width.
     */
    setFinalWidth(width) {
      this._finalWidth = width;
    }

    /**
     * Gets height. Note this width can change during animation.
     * @return {number} The height.
     */
    getHeight() {
      return this._h;
    }

    /**
     * Gets final height (animation independent, calculated from data; e.g. final height after animation finishes)
     * In other words, if there's no animation, or at the end of animation, this method should return the same value as getHeight
     * @return {number} The final height.
     */
    getFinalHeight() {
      return this._finalHeight;
    }

    /**
     * Sets height.
     * @param {number} height The new height.
     */
    setHeight(height) {
      var cmds;
      this._h = height;
      cmds = this.generateCmd(this._x, this._y, this._w, this._h, this._r);
      this.setCmds(cmds);
    }

    /**
     * Sets the final height (animation independent, calculated from data; e.g. final height after animation finishes)
     * @param {number} height The new final height.
     */
    setFinalHeight(height) {
      this._finalHeight = height;
    }

    /**
     * Gets the x. Note this x can change during animation.
     * @return {number} x
     */
    getX() {
      return this._x;
    }

    /**
     * Gets the final x (animation independent, e.g. final x after animation finishes)
     * @return {number} x
     */
    getFinalX() {
      return this._finalX;
    }

    /**
     * Sets the x.
     * @param {number} x
     */
    setX(x) {
      var cmds;
      this._x = x;
      cmds = this.generateCmd(this._x, this._y, this._w, this._h, this._r);
      this.setCmds(cmds);
    }

    /**
     * Sets the final x (animation independent, e.g. final x after animation finishes)
     * @param {number} x
     */
    setFinalX(x) {
      this._finalX = x;
    }

    /**
     * Gets the y. Note this y can change during animation.
     * @return {number} y
     */
    getY() {
      return this._y;
    }

    /**
     * Gets the final y (animation independent, e.g. final y after animation finishes)
     * @return {number} y
     */
    getFinalY() {
      return this._finalY;
    }

    /**
     * Sets the y.
     * @param {number} y
     */
    setY(y) {
      var cmds;
      this._y = y;
      cmds = this.generateCmd(this._x, this._y, this._w, this._h, this._r);
      this.setCmds(cmds);
    }

    /**
     * Sets the final y (animation independent, e.g. final y after animation finishes)
     * @param {number} y
     */
    setFinalY(y) {
      this._finalY = y;
    }

    /**
     * Gets the border radius.
     * @return {number} the border radius
     */
    getBorderRadius() {
      return this._r;
    }

    /**
     * Sets the border radius.
     * @param {number} r the border radius
     */
    setBorderRadius(r) {
      var cmds;
      this._r = r != null ? r : '0';
      cmds = this.generateCmd(this._x, this._y, this._w, this._h, this._r);
      this.setCmds(cmds);
    }

    /**
     * Sets the dimensions all at once.
     * @param {number} x position
     * @param {number} y posiiton
     * @param {number} w width
     * @param {number} h height
     * @param {string=} r borderradius If not specified assume to be 0 radius.
     */
    setDimensions(x, y, w, h, r) {
      var cmds;
      // For task case, the shape can change from bar to diamond and vice versa, e.g. during animation and interactivity
      // Need to update style classes during these width/shape transitions
      if (
        (DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 ||
          DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) &&
        (this._w === 0 || w === 0)
      ) {
        this._w = w;
        this.applyStyleClasses(this._svgClassName);
      }

      this._x = x;
      this._y = y;
      this._w = w;
      this._h = h;
      this._r = r != null ? r : '0';

      cmds = this.generateCmd(this._x, this._y, this._w, this._h, this._r);
      this.setCmds(cmds);
    }
  }

  /**
   * The 'main' types, effect inclusive.
   * @type {array}
   */
  DvtGanttTaskShape.MAIN_TYPES = ['main', 'mainBackground', 'mainSelect', 'mainHover', 'mainFocus'];

  /**
   * The 'main' effect types.
   * @type {array}
   */
  DvtGanttTaskShape.MAIN_EFFECT_TYPES = ['mainSelect', 'mainHover', 'mainFocus'];

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
   * The 'progress' types.
   * @type {array}
   */
  DvtGanttTaskShape.PROGRESS_TYPES = ['progress', 'progressZero', 'progressFull'];

  /**
   * Utility functions for Gantt tooltips.
   * @class
   */
  var DvtGanttTooltipUtils = {
    /**
     * Returns the datatip color for the tooltip of the target task.
     * @param {DvtGanttTaskNode} taskNode
     * @return {string} The datatip color.
     */
    getDatatipColor: (taskNode) => {
      var context = taskNode.getCtx();
      var fillColor = taskNode.getTask().getFillColor();
      if (fillColor) {
        if (context.getThemeBehavior() === 'alta') {
          return fillColor['fill'];
        }
        return fillColor['stroke'];
      }
      return null;
    },

    /**
     * Returns the datatip string for the target task.
     * @param {DvtGanttTaskNode} taskNode
     * @param {boolean} isTabular Whether the datatip is in a table format.
     * @param {boolean=} isAria whether the datatip is used for accessibility.
     * @return {string} The datatip string.
     */
    getDatatip: (taskNode, isTabular, isAria) => {
      var gantt = taskNode.getGantt();

      // If performing DnD Move via keyboard and the navigation scale changed, show the scale change info instead of the normal tooltip
      if (gantt.getEventManager().isKeyboardDnDScaleChanged()) {
        // No valueFormats support for scale change info, so type is left as empty string for now
        var navigationScale = gantt.getEventManager().getKeyboardDnDNavigationScale();
        var defaultNavigationLabel =
          gantt.getEventManager().getKeyboardDnDMode() === 'move' ? 'MoveBy' : 'ResizeBy';
        var navigationScaleDesc = DvtGanttTooltipUtils._addDatatipRow(
          '',
          gantt,
          '',
          defaultNavigationLabel,
          navigationScale.charAt(0).toUpperCase() + navigationScale.slice(1),
          isTabular
        );
        return DvtGanttTooltipUtils._processDatatip(navigationScaleDesc, gantt, isTabular);
      }

      // Custom Tooltip via Function
      var customTooltip = gantt.getOptions()['tooltip'];
      var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;

      if (isTabular && tooltipFunc) {
        var tooltipManager = gantt.getCtx().getTooltipManager();
        var dataContext = gantt.getEventManager().isDnDDragging()
          ? taskNode.getSandboxDataContext()
          : taskNode.getDataContext();
        return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
      }

      // Custom Tooltip via Short Desc
      var shortDesc = taskNode.getValue('shortDesc');
      if (shortDesc != null) return shortDesc;

      // TODO: Remove this block and the isAria param when we can remove the translation strings that were supported
      // before the shortDesc/valueFormats/tooltip API (before 2.3.0). At the time of writing, we plan to deprecate
      // them, and remove in 5.0.0. Custom elements version starts with a clean slate and won't use these deprecated strings starting 4.0.0
      // Behavior: If someone upgrades from 2.2.0 to 2.3.0 with no code changes (ie, no shortDesc, valueFormat set),
      // old aria-label format with the translation options will work as before. If shortDesc or valueFormat is set,
      // then new behavior will override the old aria-label format and any translation settings.
      if (isAria && !gantt.getCtx().isCustomElement()) {
        var valueFormats = gantt.getOptions()['valueFormats'];
        if (!valueFormats || valueFormats.length === 0) {
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
              var time = gantt
                .getTimeAxis()
                .formatDate(new Date(start != null ? start : end), null, 'general');
              var taskDesc = dvt.ResourceUtils.format(translations.accessibleMilestoneInfo, [time]);
            } else {
              var startTime = gantt.getTimeAxis().formatDate(new Date(start), null, 'general');
              var endTime = gantt.getTimeAxis().formatDate(new Date(end), null, 'general');
              var duration = taskNode.getDuration(start, end);
              taskDesc = dvt.ResourceUtils.format(translations.accessibleTaskInfo, [
                startTime,
                endTime,
                duration
              ]);
            }
          }

          if (validBaselineTask) {
            if (isBaselineMilestone) {
              var baselineTime = gantt
                .getTimeAxis()
                .formatDate(
                  new Date(baselineStart != null ? baselineStart : baselineEnd),
                  null,
                  'general'
                );
              var baselineDesc = translations.labelBaselineDate + ': ' + baselineTime;
            } else {
              var baselineStartTime = gantt
                .getTimeAxis()
                .formatDate(new Date(baselineStart), null, 'general');
              var baselineEndTime = gantt
                .getTimeAxis()
                .formatDate(new Date(baselineEnd), null, 'general');
              baselineDesc = translations.labelBaselineStart + ': ' + baselineStartTime;
              baselineDesc =
                baselineDesc + '; ' + translations.labelBaselineEnd + ': ' + baselineEndTime;
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
                  if (formattedProgressValue != null)
                    var progressDesc = translations.labelProgress + ': ' + formattedProgressValue;
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
      }

      // Default Tooltip Support
      var datatip = '';
      datatip = DvtGanttTooltipUtils._addRowDatatip(datatip, taskNode, isTabular);
      datatip = DvtGanttTooltipUtils._addTaskDatatip(datatip, taskNode, isTabular);

      return DvtGanttTooltipUtils._processDatatip(datatip, gantt, isTabular);
    },

    /**
     * Final processing for the datatip.
     * @param {string} datatip The current datatip.
     * @param {Gantt} gantt The owning gantt instance.
     * @param {boolean} isTabular Whether the datatip is in a table format.
     * @return {string} The updated datatip.
     * @private
     */
    _processDatatip: (datatip, gantt, isTabular) => {
      // Don't render tooltip if empty
      if (datatip === '') return null;

      // Add outer table tags
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
      if (isTabular)
        return '<table class="' + gantt.GetStyleClass('tooltipTable') + '">' + datatip + '</table>';

      return datatip;
    },

    /**
     * Adds the row string to the datatip.
     * @param {string} datatip The current datatip.
     * @param {DvtGanttTaskNode} taskNode The task node.
     * @param {boolean} isTabular Whether the datatip is in a table format.
     * @return {string} The updated datatip.
     * @private
     */
    _addRowDatatip: (datatip, taskNode, isTabular) => {
      var gantt = taskNode.getGantt();
      if (gantt.getEventManager().isDnDDragging()) {
        var row = taskNode.getSandboxValue('_rowNode');
      } else {
        row = taskNode.getRowNode();
      }

      var rowLabel = row.getLabel();
      if (rowLabel == null) rowLabel = row.getIndex() + 1;
      return DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'row', 'Row', rowLabel, isTabular);
    },

    /**
     * Adds the task strings to the datatip.
     * @param {string} datatip The current datatip.
     * @param {DvtGanttTaskNode} taskNode The task node.
     * @param {boolean} isTabular Whether the datatip is in a table format.
     * @return {string} The updated datatip.
     * @private
     */
    _addTaskDatatip: (datatip, taskNode, isTabular) => {
      var gantt = taskNode.getGantt();
      var valueGetter = gantt.getEventManager().isDnDDragging()
        ? taskNode.getSandboxValue
        : taskNode.getValue;
      var task = taskNode.getTask();

      var start = valueGetter.call(taskNode, 'start');
      var end = valueGetter.call(taskNode, 'end');
      var overtimeStart = valueGetter.call(taskNode, 'overtime', 'start');
      var overtimeEnd = valueGetter.call(taskNode, 'overtime', 'end');
      var downtimeStart = valueGetter.call(taskNode, 'downtime', 'start');
      var downtimeEnd = valueGetter.call(taskNode, 'downtime', 'end');
      var attributeValue =
        valueGetter.call(taskNode, 'attribute', 'rendered') === 'on'
          ? valueGetter.call(taskNode, 'attribute', 'shortDesc')
          : null;
      var baselineStart = valueGetter.call(taskNode, 'baseline', 'start');
      var baselineEnd = valueGetter.call(taskNode, 'baseline', 'end');
      var label = valueGetter.call(taskNode, 'label');
      var progress = task.getProgressValue(); // main Milestone check happens here too

      var validActualTask = !(start == null && end == null);
      var validBaselineTask = !(baselineStart == null && baselineEnd == null);
      var validOvertime = !(overtimeStart == null && overtimeEnd == null);
      var validDowntime = !(downtimeStart == null && downtimeEnd == null);
      var validAttribute = attributeValue != null;
      var isMainMilestone = task.isMilestone('main');
      var isBaselineMilestone = task.isMilestone('baseline');

      if (validActualTask) {
        if (isMainMilestone) {
          datatip = DvtGanttTooltipUtils._addDatatipRow(
            datatip,
            gantt,
            'date',
            'Date',
            start != null ? start : end,
            isTabular
          );
          if (isBaselineMilestone) {
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'baselineDate',
              'BaselineDate',
              baselineStart != null ? baselineStart : baselineEnd,
              isTabular
            );
          } else if (validBaselineTask) {
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'baselineStart',
              'BaselineStart',
              baselineStart,
              isTabular
            );
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'baselineEnd',
              'BaselineEnd',
              baselineEnd,
              isTabular
            );
          }
        } else {
          if (isBaselineMilestone) {
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'start',
              'Start',
              start,
              isTabular
            );
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'end',
              'End',
              end,
              isTabular
            );
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'baselineDate',
              'BaselineDate',
              baselineStart != null ? baselineStart : baselineEnd,
              isTabular
            );
          } else if (validBaselineTask) {
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'start',
              'Start',
              start,
              isTabular
            );
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'baselineStart',
              'BaselineStart',
              baselineStart,
              isTabular
            );
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'end',
              'End',
              end,
              isTabular
            );
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'baselineEnd',
              'BaselineEnd',
              baselineEnd,
              isTabular
            );
          } else {
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'start',
              'Start',
              start,
              isTabular
            );
            datatip = DvtGanttTooltipUtils._addDatatipRow(
              datatip,
              gantt,
              'end',
              'End',
              end,
              isTabular
            );
          }
        }

        if (validOvertime) {
          datatip = DvtGanttTooltipUtils._addDatatipRow(
            datatip,
            gantt,
            'overtimeStart',
            'OvertimeStart',
            overtimeStart,
            isTabular
          );
          datatip = DvtGanttTooltipUtils._addDatatipRow(
            datatip,
            gantt,
            'overtimeEnd',
            'OvertimeEnd',
            overtimeEnd,
            isTabular
          );
        }
        if (validDowntime) {
          datatip = DvtGanttTooltipUtils._addDatatipRow(
            datatip,
            gantt,
            'downtimeStart',
            'DowntimeStart',
            downtimeStart,
            isTabular
          );
          datatip = DvtGanttTooltipUtils._addDatatipRow(
            datatip,
            gantt,
            'downtimeEnd',
            'DowntimeEnd',
            downtimeEnd,
            isTabular
          );
        }
        if (validAttribute) {
          datatip = DvtGanttTooltipUtils._addDatatipRow(
            datatip,
            gantt,
            'attribute',
            'Attribute',
            attributeValue,
            isTabular
          );
        }

        datatip = DvtGanttTooltipUtils._addDatatipRow(
          datatip,
          gantt,
          'label',
          'Label',
          label,
          isTabular
        );
        if (progress != null) {
          datatip = DvtGanttTooltipUtils._addDatatipRow(
            datatip,
            gantt,
            'progress',
            'Progress',
            progress,
            isTabular
          );
        }
      } else if (validBaselineTask) {
        datatip = DvtGanttTooltipUtils._addDatatipRow(
          datatip,
          gantt,
          'baselineStart',
          'BaselineStart',
          baselineStart,
          isTabular
        );
        datatip = DvtGanttTooltipUtils._addDatatipRow(
          datatip,
          gantt,
          'baselineEnd',
          'BaselineEnd',
          baselineEnd,
          isTabular
        );
      }

      return datatip;
    },

    /**
     * Adds a row of item to the datatip string.
     * @param {string} datatip The current datatip.
     * @param {Gantt} gantt The gantt instance.
     * @param {string} type The item type, e.g. row, start, end, label
     * @param {string} defaultLabel The bundle resource string for the default label.
     * @param {string|number} value The item value.
     * @param {boolean} isTabular Whether the datatip is in a table format.
     * @param {number} index (optional) The index of the tooltipLabel string to be used
     * @return {string} The updated datatip.
     * @private
     */
    _addDatatipRow: (datatip, gantt, type, defaultLabel, value, isTabular, index) => {
      if (value == null || value === '') return datatip;

      var valueFormat = DvtGanttTooltipUtils.getValueFormat(gantt, type);
      var tooltipDisplay = valueFormat['tooltipDisplay'];

      if (tooltipDisplay === 'off') return datatip;

      // Create tooltip label
      var tooltipLabel;
      if (typeof valueFormat['tooltipLabel'] === 'string') tooltipLabel = valueFormat['tooltipLabel'];

      if (tooltipLabel == null) {
        if (defaultLabel == null) tooltipLabel = '';
        else tooltipLabel = gantt.getOptions().translations['label' + defaultLabel];
      }

      // Create tooltip value
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
        return (
          datatip +
          '<tr>' +
          '<td class="' +
          tooltipLabelClass +
          '">' +
          tooltipLabel +
          '</td>' +
          '<td class="' +
          tooltipValueClass +
          '">' +
          value +
          '</td>' +
          '</tr>'
        );
      } else {
        if (datatip.length > 0) datatip += '<br>';

        return (
          datatip +
          dvt.ResourceUtils.format(gantt.getOptions().translations.labelAndValue, [
            tooltipLabel,
            value
          ])
        );
      }
    },

    /**
     * Returns the valueFormat of the specified type.
     * @param {Gantt} gantt
     * @param {string} type The valueFormat type, e.g. row, start, end, label.
     * @return {object} The valueFormat.
     */
    getValueFormat: (gantt, type) => {
      var valueFormats = gantt.getOptions()['valueFormats'];
      if (!valueFormats) return {};
      else if (valueFormats instanceof Array) {
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
    },

    /**
     * Formats value with the converter from the valueFormat.
     * @param {Gantt} gantt
     * @param {string} type The item type, e.g. row, start, end, label
     * @param {object} valueFormat
     * @param {number} value The value to format.
     * @return {string} The formatted value string.
     */
    formatValue: (gantt, type, valueFormat, value) => {
      var converter = valueFormat['converter'];

      if (
        type === 'start' ||
        type === 'end' ||
        type === 'date' ||
        type === 'baselineStart' ||
        type === 'baselineEnd' ||
        type === 'baselineDate' ||
        type === 'overtimeStart' ||
        type === 'overtimeEnd' ||
        type === 'downtimeStart' ||
        type === 'downtimeEnd'
      ) {
        return gantt.getTimeAxis().formatDate(new Date(value), converter, 'general');
      }

      if (converter && converter['format']) return converter['format'](value);

      if (type === 'progress') {
        var resources = gantt.getOptions()['_resources'];
        if (resources) {
          var percentConverter = resources['percentConverter'];
          if (percentConverter) {
            return percentConverter['format'](value);
          }
        }
      }

      return value;
    }
  };

  /**
   * Gantt event manager.
   * @param {Gantt} gantt The owning Gantt.
   * @extends {TimeComponentEventManager}
   * @constructor
   */
  class DvtGanttEventManager extends ojdvtTimecomponent.TimeComponentEventManager {
    constructor(gantt) {
      super(gantt);
      // Drag & Drop Support

      /**
       * Scale jump ramp for high level DnD navigation
       * @type {array}
       * @private
       */
      this._HIGH_LEVEL_DND_NAVIGATION_SCALES = [
        'milliseconds',
        'seconds',
        'minutes',
        'hours',
        'days',
        'weeks',
        'months',
        'quarters',
        'years'
      ];
      /**
       * The amount of mouse movement post mouse down necessary to be conisdered a high level DnD drag.
       * @type {number}
       * @private
       */
      this._HIGH_LEVEL_DND_DRAGSTART_DELTA_THRESHOLD = 2;
    }
    /**
     * Returns the DvtKeyboardNavigable item with the current keyboard focus
     * @override
     */
    getFocus() {
      var navigable = super.getFocus(this);
      var isTaskNavigable = navigable && navigable.nodeType === 'task';

      // Task is not in the DOM, e.g. due to a programmatic removal from the data
      // Related to JET-57646
      if (isTaskNavigable && navigable.getParent() == null) {
        return null;
      }

      // If tasks's parent row is collapsed such that the task is no longer visible, the first visible task of the closest ancestor row is focused and returned
      if (isTaskNavigable && navigable.getRowNode().getParent() == null) {
        var navigableObj = navigable.getLayoutObject();
        var rowObj = navigableObj['rowObj'];
        var dataLayoutManager = this._comp.getDataLayoutManager();
        while (
          navigableObj == null ||
          (!dataLayoutManager.isRoot(rowObj) && dataLayoutManager.isHiddenCollapsed(rowObj))
        ) {
          rowObj = dataLayoutManager.getParentRowObj(rowObj);
          // JET-62141: if all ancestor rows are empty, then let null navigableObj be returned, i.e.
          // signal that no tasks are logically focused. On next component focus the default first task of the data gets logically focused.
          if (navigableObj == null && rowObj == null) break;
          var taskObjs = rowObj['taskObjs'];
          navigableObj = taskObjs.length > 0 ? taskObjs[0] : null;
        }
        if (navigableObj) {
          // At this point, navigableObj is potentially from the previous render prior to the row collapse.
          // E.g. if a task is focused, its parent is collapsed, and then the parent is expanded again right after, then the reference here
          // is stale. Stale references should have renderState === 'delete'.
          // In that case, a new navigableObj for the same task is created for the current render post collapse, so
          // we need to find it and return its node as the navigable:
          if (navigableObj.renderState !== 'delete') {
            return navigableObj.node;
          }
          const rowObjs = dataLayoutManager.getRowObjs();
          for (let i = 0; i < rowObjs.length; i++) {
            if (dvt.Obj.compareValues(this._comp.getCtx(), rowObjs[i].id, rowObj.id)) {
              const activeRowObj = rowObjs[i];
              const activeTaskObjs = activeRowObj.taskObjs;
              for (let j = 0; j < activeTaskObjs.length; j++) {
                if (
                  dvt.Obj.compareValues(this._comp.getCtx(), activeTaskObjs[j].id, navigableObj.id)
                ) {
                  return activeTaskObjs[j].node;
                }
              }
              return null;
            }
          }
        }
        return null;
      }
      return navigable;
    }

    /**
     * Returns the DvtKeyboardNavigable item with the current keyboard focus
     * @override
     */
    setFocus(navigable) {
      super.setFocus(navigable);
      var currNavigable = this.getFocus();
      if (currNavigable && currNavigable.nodeType === 'task') {
        this._lastFocusedTask = currNavigable;
      }
    }

    /**
     * Returns the last focused task
     */
    getLastFocusedTask() {
      return this._lastFocusedTask;
    }

    /**
     * Returns the last focused task
     * @param {DvtGanttTaskNode} taskNode
     */
    setLastFocusedTask(taskNode) {
      this._lastFocusedTask = taskNode;
    }

    /**
     * @override
     */
    hideTooltip() {
      if (!this._preventHideTooltip) {
        super.hideTooltip();
      }

      // reset the flag
      this._preventHideTooltip = false;
    }

    /**
     * @override
     */
    ProcessMarqueeEvent(event) {
      // Handle Marquee selection
      if (this._comp.isMarqueeSelectEnabled()) {
        var selectionHandler = this.getSelectionHandler();
        if (event.subtype === 'start') {
          // If ctrl key is pressed at start of drag, the previous selection should be preserved.
          this._initSelection = event.ctrlKey ? selectionHandler.getSelectedIds() : [];
          this._initSelectionTargets = event.ctrlKey ? selectionHandler.getSelection() : [];
        } else if (event.subtype === 'move') {
          this._isMarqueeDragging = true;
          var localPos = this._comp.getMarqueeArtifactsContainer().stageToLocal(event._relPos);
          this._comp.autoPanOnEdgeDrag(
            localPos,
            DvtGanttStyleUtils.getAutoPanEdgeThreshold(),
            false,
            false
          );

          var layoutObjs = this._comp
            .getDataLayoutManager()
            .getLayoutObjectsInBBox(new dvt.Rectangle(event.x, event.y, event.w, event.h));
          var targets = layoutObjs.taskObjs.map((taskObj) => {
            return taskObj['node'];
          });

          selectionHandler.processInitialSelections(this._initSelection, this._initSelectionTargets);
          selectionHandler.processGroupSelection(targets, true);
          this._isMarqueeDragging = false;
        } else if (event.subtype === 'end') {
          this.fireSelectionEvent();
        }
      }
    }

    isMarqueeDragging() {
      return this._isMarqueeDragging;
    }

    /**
     * @override
     */
    isDndSupported() {
      return true;
    }

    /**
     * Whether DnD dragging is currently happening
     * @return {boolean} whether DnD dragging is happening
     */
    isDnDDragging() {
      return this._isDndDragging;
    }

    /**
     * Setup upon drag start
     * @private
     */
    _dragStartSetup() {
      // Store current viewport:
      // 1) in case drag canceled later and need to revert back to original state
      // 2) or drag finished, but need to compare with initial viewport to see if viewport change event needs to be fired
      this._dragInitialX = this._comp.getTimeZoomCanvas().getTranslateX();
      this._dragInitialY = this._comp.getDatabody().getTranslateY();
      this._dragInitialViewportStart = this._comp.getViewportStartTime();
      this._dragInitialViewportEnd = this._comp.getViewportEndTime();

      // Disable pointer-events on reference objects and dep lines (which lay on top of the row drop targets and interferes)
      // until no longer drag and dropping
      this._comp.getReferenceLinesContainer().setMouseEnabled(false);
      this._comp.getReferenceAreasContainer().setMouseEnabled(false);
      this._comp.getRowReferenceObjectsContainer().setMouseEnabled(false);
      if (this._comp.getDependenciesContainer()) {
        this._comp.getDependenciesContainer().setMouseEnabled(false);
      }

      // Un-dim the data area
      if (this._comp.getOptions()['selectionBehavior'] === 'highlightDependencies') {
        this._comp.undimDatabody();
      }
    }

    /**
     * Cleanup when drag is happening, but deliberately cancelled, e.g.
     * via Esc key during drag (NOT via event.preventDefault on dragStart event)
     * @private
     */
    _dragCancelCleanup() {
      // Revert viewport to original state
      if (this._dragInitialX) {
        var deltaX = this._comp.getTimeZoomCanvas().getTranslateX() - this._dragInitialX;
        var deltaY = this._comp.getDatabody().getTranslateY() - this._dragInitialY;
        if (deltaX !== 0 || deltaY !== 0) {
          this._comp.panBy(deltaX, deltaY, true);

          // in case of rounding errors, explictly reset viewport start/end times
          this._comp.setViewportStartTime(this._dragInitialViewportStart);
          this._comp.setViewportEndTime(this._dragInitialViewportEnd);
        }
      }

      this._dragInitialX = null;
      this._dragInitialY = null;
      this._dragInitialViewportStart = null;
      this._dragInitialViewportEnd = null;

      // Re-enable pointer-events on reference objects and deplines
      this._comp.getReferenceLinesContainer().setMouseEnabled(true);
      this._comp.getReferenceAreasContainer().setMouseEnabled(true);
      this._comp.getRowReferenceObjectsContainer().setMouseEnabled(true);
      if (this._comp.getDependenciesContainer()) {
        this._comp.getDependenciesContainer().setMouseEnabled(true);
      }

      var obj = this.DragSource.getDragObject();
      if (obj && obj.nodeType === 'task') {
        obj.dragCancelCleanup();
      }
    }

    /**
     * Cleanup on drop
     * @private
     */
    _dropCleanup() {
      // Fire viewport change event if viewport changed
      if (
        this._dragInitialViewportStart != null &&
        (this._dragInitialViewportStart !== this._comp.getViewportStartTime() ||
          this._dragInitialViewportEnd !== this._comp.getViewportEndTime())
      ) {
        this._comp.dispatchEvent(this._comp.createViewportChangeEvent());
      }

      this._dragInitialX = null;
      this._dragInitialY = null;
      this._dragInitialViewportStart = null;
      this._dragInitialViewportEnd = null;

      // Re-enable pointer-events on reference objects and dep lines
      this._comp.getReferenceLinesContainer().setMouseEnabled(true);
      this._comp.getReferenceAreasContainer().setMouseEnabled(true);
      this._comp.getRowReferenceObjectsContainer().setMouseEnabled(true);
      if (this._comp.getDependenciesContainer()) {
        this._comp.getDependenciesContainer().setMouseEnabled(true);
      }

      this._isDndDragging = false;
    }

    /**
     * The current keyboard DnD mode.
     * @return {string} The current mode, e.g. 'move'. null if not currently using keyboard for DnD.
     */
    getKeyboardDnDMode() {
      return this._keyboardDnDMode;
    }

    /**
     * Handles keyboard DnD initiation
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
     * @param {DvtGanttTaskNode} sourceObj The source object
     * @param {dvt.Displayable} draggedObj The specific object dragged
     * @param {string} feedbackPosReference The feedback's reference point, one of 'start' or 'end
     * @param {Object} translationProperties Translation properties to use for accessibility
     * @private
     */
    _handleKeyboardDnDInitiation(
      event,
      sourceObj,
      draggedObj,
      feedbackPosReference,
      translationProperties
    ) {
      var isRTL = dvt.Agent.isRightToLeft(this._comp.getCtx());
      var orientationFactor = isRTL ? -1 : 1;
      this._isDndDragging = true;
      this._dragStartSetup();
      var mainShape = sourceObj.getTask().getShape('main');

      // Put up a glass pane to block certain mouse events, in case mouse is over the component during keyboard DnD.
      // E.g. mouseout gets fired when the gantt scrolls during keyboard move such that the row rect underneath the mouse moved away
      // The mouseout event in turn hides the tooltip during keyboard move.
      this._comp.registerAndConstructGlassPane();
      var glassPaneAdded = this._comp.installGlassPane();

      // Set navigation scale to whatever the scale of the (minor) time axis is
      this._keyboardDnDScaleRampIndex = this._HIGH_LEVEL_DND_NAVIGATION_SCALES.indexOf(
        this._comp.getTimeAxis().getScale()
      );

      sourceObj.setDraggedObject(draggedObj);
      sourceObj.dragStartSetup();

      var stagePos = sourceObj.localToStage({
        x:
          mainShape.getFinalX() +
          (feedbackPosReference === 'end') * orientationFactor * mainShape.getFinalWidth(),
        y: mainShape.getFinalY()
      });
      this._keyboardDnDFeedbackLocalPos = this._comp
        .getDnDArtifactsContainer()
        .stageToLocal(stagePos);
      sourceObj.showDragFeedback(
        event,
        this._keyboardDnDFeedbackLocalPos,
        sourceObj.getRowNode(),
        { x: 0, y: 0 },
        true
      );
      // As a result of bringing up the glass pane, if the mouse happens to be over the Gantt, a mouseout event is fired, which
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
        start: startTime,
        end: endTime,
        baselineStart: baselineStartTime,
        baselineEnd: baselineEndTime
      };

      // Update the aria live region with text that the screenreader should read.
      var translations = this._comp.getOptions().translations;
      var initiationDesc = translations[translationProperties.initiated];
      if (this._comp.isSelectionSupported() && this._keyboardDnDSourceObj.isSelected()) {
        var totalSelected = this._comp.getSelectionHandler().getSelectedCount();
        if (totalSelected > 1) {
          initiationDesc +=
            '. ' +
            dvt.ResourceUtils.format(translations[translationProperties.selectionInfo], [
              totalSelected - 1
            ]);
        }
      }
      initiationDesc += '. ' + translations[translationProperties.instruction] + '.';
      this._comp.updateLiveRegionText(initiationDesc);
    }

    /**
     * Handles high level DnD Move initiation via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
     * @param {DvtGanttTaskNode} sourceObj The source object
     */
    handleKeyboardMoveInitiation(event, sourceObj) {
      this._keyboardDnDMode = DvtGanttEventManager.KEYBOARD_MOVE;
      var draggedObj = sourceObj.getTask().getShape('main');
      var translationProperties = {
        initiated: 'taskMoveInitiated',
        selectionInfo: 'taskMoveSelectionInfo',
        instruction: 'taskMoveInitiatedInstruction'
      };
      this._handleKeyboardDnDInitiation(event, sourceObj, draggedObj, 'start', translationProperties);
    }

    /**
     * Handles high level DnD Start Resize initiation via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
     * @param {DvtGanttTaskNode} sourceObj The source object
     */
    handleKeyboardResizeStartInitiation(event, sourceObj) {
      this._keyboardDnDMode = DvtGanttEventManager.KEYBOARD_RESIZE_START;
      var draggedObj = sourceObj.getTask().getShape('mainResizeHandleStart');
      var translationProperties = {
        initiated: 'taskResizeStartInitiated',
        selectionInfo: 'taskResizeSelectionInfo',
        instruction: 'taskResizeInitiatedInstruction'
      };
      this._handleKeyboardDnDInitiation(event, sourceObj, draggedObj, 'start', translationProperties);
    }

    /**
     * Handles high level DnD End Resize initiation via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered initiation
     * @param {DvtGanttTaskNode} sourceObj The source object
     */
    handleKeyboardResizeEndInitiation(event, sourceObj) {
      this._keyboardDnDMode = DvtGanttEventManager.KEYBOARD_RESIZE_END;
      var draggedObj = sourceObj.getTask().getShape('mainResizeHandleEnd');
      var translationProperties = {
        initiated: 'taskResizeEndInitiated',
        selectionInfo: 'taskResizeSelectionInfo',
        instruction: 'taskResizeInitiatedInstruction'
      };
      this._handleKeyboardDnDInitiation(event, sourceObj, draggedObj, 'end', translationProperties);
    }

    /**
     * Handles high level DnD along time via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered move forward/backward
     * @param {string} direction The direction, either 'forward' or 'backward'
     * @private
     */
    _handleKeyboardDnDChronologically(event, direction) {
      var isRTL = dvt.Agent.isRightToLeft(this._comp.getCtx());
      var navigationScale = this.getKeyboardDnDNavigationScale();
      var ganttMinTime = this._comp.getStartTime();
      var ganttMaxTime = this._comp.getEndTime();
      var ganttWidth = this._comp.getContentLength();

      var timeAxis = this._comp.getTimeAxis();
      var adjacencyDirection = direction === 'forward' ? 'next' : 'previous';
      var newStart = timeAxis
        .getAdjacentDate(this._keyboardDnDFeedbackTime['start'], navigationScale, adjacencyDirection)
        .getTime();
      var newEnd = timeAxis
        .getAdjacentDate(this._keyboardDnDFeedbackTime['end'], navigationScale, adjacencyDirection)
        .getTime();

      var currentPos,
        previousPos,
        scrollIntoViewXPriority = 'auto';
      switch (this._keyboardDnDMode) {
        case DvtGanttEventManager.KEYBOARD_MOVE:
          if (
            (direction === 'forward' && newStart <= ganttMaxTime) ||
            (direction === 'backward' && newEnd >= ganttMinTime)
          ) {
            previousPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
              ganttMinTime,
              ganttMaxTime,
              this._keyboardDnDFeedbackTime['start'],
              ganttWidth
            );
            this._keyboardDnDFeedbackTime['start'] = newStart;
            this._keyboardDnDFeedbackTime['end'] = newEnd;
            if (this._keyboardDnDFeedbackTime['baselineStart']) {
              this._keyboardDnDFeedbackTime['baselineStart'] = timeAxis
                .getAdjacentDate(
                  this._keyboardDnDFeedbackTime['baselineStart'],
                  navigationScale,
                  adjacencyDirection
                )
                .getTime();
              this._keyboardDnDFeedbackTime['baselineEnd'] = timeAxis
                .getAdjacentDate(
                  this._keyboardDnDFeedbackTime['baselineEnd'],
                  navigationScale,
                  adjacencyDirection
                )
                .getTime();
            }
            currentPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
              ganttMinTime,
              ganttMaxTime,
              this._keyboardDnDFeedbackTime['start'],
              ganttWidth
            );
          }
          break;
        case DvtGanttEventManager.KEYBOARD_RESIZE_START:
          var sourceEndTime = this._keyboardDnDSourceObj.getValue('end');
          if (
            (direction === 'forward' && newStart <= sourceEndTime) ||
            (direction === 'backward' && newStart >= ganttMinTime)
          ) {
            previousPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
              ganttMinTime,
              ganttMaxTime,
              this._keyboardDnDFeedbackTime['start'],
              ganttWidth
            );
            this._keyboardDnDFeedbackTime['start'] = newStart;
            currentPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
              ganttMinTime,
              ganttMaxTime,
              this._keyboardDnDFeedbackTime['start'],
              ganttWidth
            );
          }
          scrollIntoViewXPriority = 'start';
          break;
        case DvtGanttEventManager.KEYBOARD_RESIZE_END:
          var sourceStartTime = this._keyboardDnDSourceObj.getValue('start');
          if (
            (direction === 'forward' && newEnd <= ganttMaxTime) ||
            (direction === 'backward' && newEnd >= sourceStartTime)
          ) {
            previousPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
              ganttMinTime,
              ganttMaxTime,
              this._keyboardDnDFeedbackTime['end'],
              ganttWidth
            );
            this._keyboardDnDFeedbackTime['end'] = newEnd;
            currentPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
              ganttMinTime,
              ganttMaxTime,
              this._keyboardDnDFeedbackTime['end'],
              ganttWidth
            );
          }
          scrollIntoViewXPriority = 'end';
          break;
      }
      if (currentPos != null) {
        currentPos = isRTL ? ganttWidth - currentPos : currentPos;
        previousPos = isRTL ? ganttWidth - previousPos : previousPos;
        this._keyboardDnDFeedbackLocalPos.x += currentPos - previousPos;
      }

      // Update and show feedback
      this._keyboardDnDSourceObj.showDragFeedback(
        event,
        this._keyboardDnDFeedbackLocalPos,
        this._keyboardDnDTargetObj,
        { x: 0, y: 0 },
        true
      );
      // scroll to feedback
      this._keyboardDnDSourceObj.scrollIntoView(scrollIntoViewXPriority, 'auto');

      // Update the aria live region with text that the screenreader should read.
      this._comp.updateLiveRegionText(
        dvt.AriaUtils.processAriaLabel(
          DvtGanttTooltipUtils.getDatatip(this._keyboardDnDSourceObj, false)
        )
      );
    }

    /**
     * Handles high level DnD drag forward in time via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered drag forward
     */
    handleKeyboardDnDForward(event) {
      this._handleKeyboardDnDChronologically(event, 'forward');
    }

    /**
     * Handles high level DnD drag backward in time via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered drag backward
     */
    handleKeyboardDnDBackward(event) {
      this._handleKeyboardDnDChronologically(event, 'backward');
    }

    /**
     * Handles high level DnD scale change via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered move scale increase/decrease
     * @param {string} step The scale ramp index change
     * @private
     */
    _handleKeyboardDnDScaleChange(event, step) {
      this._isKeyboardDnDScaleChanged = true;
      this._keyboardDnDScaleRampIndex = Math.max(
        0,
        Math.min(
          this._keyboardDnDScaleRampIndex + step,
          this._HIGH_LEVEL_DND_NAVIGATION_SCALES.length - 1
        )
      );

      // Update and show feedback
      this._keyboardDnDSourceObj.showDragFeedback(
        event,
        this._keyboardDnDFeedbackLocalPos,
        this._keyboardDnDTargetObj,
        { x: 0, y: 0 },
        true
      );

      // Update the aria live region with text that the screenreader should read.
      // Tooltip should be showing the navigation scale at this point, so can just grab that text
      this._comp.updateLiveRegionText(
        dvt.AriaUtils.processAriaLabel(
          DvtGanttTooltipUtils.getDatatip(this._keyboardDnDSourceObj, false)
        )
      );
      this._isKeyboardDnDScaleChanged = false;
    }

    /**
     * Returns whether the DnD navigation scale just changed via keyboard.
     * @return {boolean} Whether the DnD navigation scale just changed via keyboard.
     */
    isKeyboardDnDScaleChanged() {
      return this._isKeyboardDnDScaleChanged;
    }

    /**
     * Returns the current keyboard DnD navigation scale.
     * @return {string} The current navigation scale.
     */
    getKeyboardDnDNavigationScale() {
      return this._HIGH_LEVEL_DND_NAVIGATION_SCALES[this._keyboardDnDScaleRampIndex];
    }

    /**
     * Handles high level DnD increase navigation scale via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered navigation scale increase
     */
    handleKeyboardDnDScaleUp(event) {
      this._handleKeyboardDnDScaleChange(event, 1);
    }

    /**
     * Handles high level DnD Move decrease navigation scale via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered navigation scale decrease
     */
    handleKeyboardDnDScaleDown(event) {
      this._handleKeyboardDnDScaleChange(event, -1);
    }

    /**
     * Handles high level DnD Move row above or below
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row above or below
     * @param {string} direction 'above' or 'below'
     * @private
     */
    _handleKeyboardMoveRowDirection(event, direction) {
      var rowObjs = this._comp.getRowLayoutObjs();
      var rowIndex = this._keyboardDnDTargetObj.getIndex();
      if (direction === 'above' && rowIndex > 0) {
        var newTargetRowObj = rowObjs[rowIndex - 1];
      } else if (direction === 'below' && rowIndex < rowObjs.length - 1) {
        newTargetRowObj = rowObjs[rowIndex + 1];
      }

      if (newTargetRowObj) {
        this._comp.getDataLayoutManager().ensureInDOM(newTargetRowObj, 'row');
        this._keyboardDnDTargetObj = newTargetRowObj['node'];
        // Only calculate and update new y position
        var options = this._comp.getOptions();
        var stagePos = this._keyboardDnDTargetObj.localToStage({
          x: 0,
          y: this._keyboardDnDTargetObj.getFinalY() + DvtGanttStyleUtils.getRowPaddingTop(options)
        });
        this._keyboardDnDFeedbackLocalPos.y = this._comp
          .getDnDArtifactsContainer()
          .stageToLocal(stagePos).y;
      }
      // Update and show feedback
      this._keyboardDnDSourceObj.showDragFeedback(
        event,
        this._keyboardDnDFeedbackLocalPos,
        this._keyboardDnDTargetObj,
        { x: 0, y: 0 },
        true
      );
      // scroll to feedback
      this._keyboardDnDSourceObj.scrollIntoView('auto', direction === 'below' ? 'bottom' : 'top');

      // Update the aria live region with text that the screenreader should read.
      this._comp.updateLiveRegionText(
        dvt.AriaUtils.processAriaLabel(
          DvtGanttTooltipUtils.getDatatip(this._keyboardDnDSourceObj, false)
        )
      );
    }

    /**
     * Handles high level DnD Move row above
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row above
     */
    handleKeyboardMoveRowAbove(event) {
      this._handleKeyboardMoveRowDirection(event, 'above');
    }

    /**
     * Handles high level DnD Move row below
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row below
     */
    handleKeyboardMoveRowBelow(event) {
      this._handleKeyboardMoveRowDirection(event, 'below');
    }

    /**
     * Handles high level DnD finalize via keyboard
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered this
     */
    handleKeyboardDnDFinalize(event) {
      // Viewport adjustments need to be done before handling move callback (rerender may happen after move callback)
      this._dropCleanup();

      var taskContexts, start, end, value, evt, ariaText;
      var translations = this._comp.getOptions().translations;
      if (this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_MOVE) {
        taskContexts = this._getDragDataContexts(this._keyboardDnDSourceObj);
        start = new Date(this._keyboardDnDFeedbackTime['start']).toISOString();
        end = new Date(this._keyboardDnDFeedbackTime['end']).toISOString();
        var baselineStart =
          this._keyboardDnDFeedbackTime['baselineStart'] == null
            ? null
            : new Date(this._keyboardDnDFeedbackTime['baselineStart']).toISOString();
        var baselineEnd =
          this._keyboardDnDFeedbackTime['baselineEnd'] == null
            ? null
            : new Date(this._keyboardDnDFeedbackTime['baselineEnd']).toISOString();
        value = start;
        var rowContexts = this._keyboardDnDTargetObj.getDataContext();

        evt = dvt.EventFactory.newGanttMoveEvent(
          taskContexts,
          value,
          start,
          end,
          baselineStart,
          baselineEnd,
          rowContexts
        );
        ariaText = translations.taskMoveFinalized;
      } else if (
        this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_END ||
        this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_START
      ) {
        taskContexts = this._getDragDataContexts(this._keyboardDnDSourceObj).map((data) => {
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
        this._comp.dispatchEvent(evt);
        // Update the aria live region with text that the screenreader should read.
        this._comp.updateLiveRegionText(ariaText);
      }
      this._keyboardDnDCleanup();
    }

    /**
     * Handles cancelling of DnD interaction via keyboard (e.g via Esc key during drag)
     */
    handleKeyboardDnDCancel() {
      var translations = this._comp.getOptions().translations;
      if (this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_MOVE) {
        // Update the aria live region with text that the screenreader should read.
        this._comp.updateLiveRegionText(translations.taskMoveCancelled);
      } else if (
        this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_END ||
        this._keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_START
      ) {
        this._comp.updateLiveRegionText(translations.taskResizeCancelled);
      }

      this._dragCancelCleanup();
      this._keyboardDnDCleanup();
    }

    /**
     * Handles cancelling a high level mouse DnD dragging operation (e.g. via Esc key during drag)
     * @param {dvt.KeyboardEvent} event The keyboard event that triggered this.
     */
    handleHighLevelMouseDnDCancel(event) {
      this._onDnDDragEnd(event);
      this._highLevelDnDEndExecuted = true;
    }

    /**
     * Cleans up high level keyboard DnD (e.g. called when keyboard DnD cancelled or finalized)
     * @private
     */
    _keyboardDnDCleanup() {
      if (this._keyboardDnDMode != null) {
        this._keyboardDnDSourceObj.dragEndCleanup();
        this._keyboardDnDMode = null;
        this._isDndDragging = false;
        this._keyboardDnDSourceObj = null;
        this._keyboardDnDTargetObj = null;
        this._keyboardDnDFeedbackTime = null;
        this._keyboardDnDScaleRampIndex = null;

        this._comp.unregisterAndDestroyGlassPane();
      }
    }

    /**
     * Gets the specific DnD task sub type (e.g. tasks, handles, ports, etc.) given the DvtGanttTaskShape|DvtGanttTaskLabel object of interest.
     * @param {DvtGanttTaskShape|DvtGanttTaskLabel} taskObject
     * @return {string} The specifc drag source type
     */
    getDnDTaskSubType(taskObject) {
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
    }

    /**
     * @override
     */
    GetDragSourceType(event) {
      switch (this._keyboardDnDMode) {
        case DvtGanttEventManager.KEYBOARD_MOVE:
          return this.IsDragSupported('tasks') ? 'tasks' : null;
        case DvtGanttEventManager.KEYBOARD_RESIZE_END:
        case DvtGanttEventManager.KEYBOARD_RESIZE_START:
          return this.IsDragSupported('taskResizeHandles') ? 'taskResizeHandles' : null;
      }

      var obj = this.DragSource.getDragObject(); // null or DvtDraggable
      if (obj && obj.nodeType === 'task') {
        // The drag source should have been set already on mousedown/touchstart.
        // However, if called from dragstart event, and the event is artifically dispatched (e.g. during automated testing),
        // then explicitly set an appropriate drag source.
        if (event && event.getNativeEvent().type === 'dragstart') {
          var nativeEvent = event.getNativeEvent();
          var clientX = nativeEvent.clientX;
          var clientY = nativeEvent.clientY;
          var offsetX = nativeEvent.offsetX;
          var offsetY = nativeEvent.offsetY;
          var isTest =
            (clientX == null && clientY == null) ||
            ((dvt.Agent.browser === 'ie' || dvt.Agent.browser === 'edge') &&
              isNaN(offsetX) &&
              isNaN(offsetY));
          if (isTest) {
            var taskSource = event.target ? event.target : obj.getTask().getShape('main');
            obj.setDraggedObject(taskSource);
          }
        }
        // Otherwise, (e.g. called from drag or dragend), the affordance may have moved or mouse left the affordance, so grab the stored object.
        var sourceType = this.getDnDTaskSubType(obj.getDraggedObject());
        return this.IsDragSupported(sourceType) ? sourceType : null;
      }
      return null;
    }

    /**
     * Gets the drag data contexts given the drag source object
     * @param {DvtDraggable} obj The drag source object
     * @param {boolean} bSanitize if true, the data contexts return should be sanitized so they can safely be stringified
     * @return {array} array of data contexts
     * @private
     */
    _getDragDataContexts(obj, bSanitize) {
      if (obj && obj.nodeType === 'task') {
        var taskSource = obj.getDraggedObject();
        var taskShapeType = taskSource.getType ? taskSource.getType() : null;
        var sourceType = this.getDnDTaskSubType(taskSource);
        if (sourceType != null) {
          var getDragContext = (obj) => {
            var dataContext = obj.getDataContext();
            if (bSanitize) dvt.ToolkitUtils.cleanDragDataContext(dataContext);
            switch (taskShapeType) {
              case 'mainResizeHandleStart':
                return { dataContext: dataContext, type: 'start' };
              case 'mainResizeHandleEnd':
                return { dataContext: dataContext, type: 'end' };
            }
            return dataContext;
          };

          var contexts = [getDragContext(obj)];
          if (
            this._comp.isSelectionSupported() &&
            obj.isSelected() &&
            this._comp.getSelectionHandler().getSelectedCount() > 1
          ) {
            var selection = this._comp.getSelectionHandler().getSelection();
            for (var i = 0; i < selection.length; i++) {
              var selectionObj = selection[i];
              if (selectionObj && selectionObj.nodeType === 'task' && selectionObj !== obj) {
                contexts.push(getDragContext(selectionObj));
              }
            }
          }
          return contexts;
        }
      }
      return null;
    }

    /**
     * @override
     */
    GetDragDataContexts(bSanitize) {
      var obj = this.DragSource.getDragObject();
      return this._getDragDataContexts(obj, bSanitize);
    }

    /**
     * @override
     */
    GetDropOffset(event) {
      var obj = this.DragSource.getDragObject();

      if (obj && obj.nodeType === 'task') {
        var sourceType = this.getDnDTaskSubType(obj.getDraggedObject());
        if (sourceType === 'tasks') {
          var startTime = obj.getValue('start');
          var endTime = obj.getValue('end');
          var posSpan = obj.getTask().getTimeSpanDimensions(startTime, endTime);

          var relPosStage = this._context.pageToStageCoords(event.pageX, event.pageY);
          var relPosLocal = this._comp.getDnDArtifactsContainer().stageToLocal(relPosStage);

          // first value is the start POSITIONAL (not time) difference from event position of the dragged task; second value is the y positional offset
          return new dvt.Point(posSpan['startPos'] - relPosLocal.x, obj.getFinalY() - relPosLocal.y);
        }
      }
      return new dvt.Point(0, 0); // if not dragging a task, then no offset--there's no notion of start/end positional offset from event position
    }

    /**
     * Returns the logical object that accepts DnD drops
     * @param {dvt.BaseEvent=} event The dnd dragOver/dragEnter/dragLeave/drop event. If not specified, then the last known drop object is returned
     * @return {object} The (last known) logical object of the target
     * @private
     */
    _getDropObject(event) {
      if (event) {
        var obj = this.GetLogicalObject(event.target);

        // If dropped on task, but high level interaction enabled and no additional low level configuration for task as drop target specified, then
        // consider the drop target the underlying row instead
        var options = this._comp.getOptions();
        var dnd = options.dnd;
        var highLevelInteractionEnabled = this._comp.isHighLevelDnDEnabled();
        var lowLevelTaskDropSpecified =
          dnd & dnd.drop && dnd.drop.tasks && (dnd.drop.tasks.dataTypes || dnd.drop.tasks.drop);
        if (
          obj &&
          obj.nodeType === 'task' &&
          highLevelInteractionEnabled &&
          !lowLevelTaskDropSpecified
        ) {
          this._dropObj = obj.getRowNode();
        } else {
          this._dropObj = obj;
        }
      }
      return this._dropObj;
    }

    /**
     * @override
     */
    GetDropTargetType(event) {
      var obj = this._getDropObject(event);

      if (obj == null) {
        return null;
      }

      if (obj.nodeType === 'row') {
        return 'rows';
      }
      if (obj.nodeType === 'task') {
        // For now, any part of the task node is a 'task', including handles.
        // May need to reconsider when we support ports in the future.
        return 'tasks';
      }
      return null;
    }

    /**
     * @override
     */
    GetDropEventPayload(event) {
      // Apply the drop offset if the drag source is a DVT component
      // NOTE: The drop offset is stored in dataTransfer, so it's only accessible from "drop" event. It can't be
      //       accessed from "dragEnter", "dragOver", and "dragLeave".
      var dataTransfer = event.getNativeEvent().dataTransfer;
      var offsetStart = dataTransfer
        ? Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_X_DATA_TYPE)) || 0
        : this._dropOffset.x;

      var isRTL = dvt.Agent.isRightToLeft(this._comp.getCtx());
      var dropObj = this._getDropObject(event);

      if (dropObj == null) {
        return null;
      }

      if (dropObj.nodeType === 'row' || dropObj.nodeType === 'task') {
        var relPosStage = this._context.pageToStageCoords(event.pageX, event.pageY);
        var relPosLocal = this._comp.getTimeZoomCanvas().stageToLocal(relPosStage);
        var ganttStartTime = this._comp.getStartTime();
        var ganttEndTime = this._comp.getEndTime();
        var ganttContentLength = this._comp.getContentLength();
        var payload = {
          value: new Date(
            ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
              ganttStartTime,
              ganttEndTime,
              isRTL ? ganttContentLength - relPosLocal.x : relPosLocal.x,
              ganttContentLength
            )
          ).toISOString(),
          start: null,
          end: null,
          baselineStart: null,
          baselineEnd: null,
          dataContext: dropObj.getDataContext()
        };

        var dragObj = this.DragSource.getDragObject();
        if (dragObj && dragObj.nodeType === 'task') {
          var startTime = dragObj.getValue('start');
          var endTime = dragObj.getValue('end');

          var baselineStartTime = dragObj.getValue('baseline', 'start') || null;
          var baselineEndTime = dragObj.getValue('baseline', 'end') || null;

          var taskSource = dragObj.getDraggedObject();
          var dragSourceType = this.getDnDTaskSubType(taskSource);

          if (dragSourceType === 'tasks') {
            payload['start'] = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
              ganttStartTime,
              ganttEndTime,
              isRTL
                ? ganttContentLength - (relPosLocal.x + offsetStart)
                : relPosLocal.x + offsetStart,
              ganttContentLength
            );
            payload['end'] = payload['start'] + (endTime - startTime);
            if (!(baselineStartTime == null && baselineEndTime == null)) {
              payload['baselineStart'] = new Date(
                baselineStartTime - startTime + payload['start']
              ).toISOString();
              payload['baselineEnd'] = new Date(
                baselineEndTime - endTime + payload['end']
              ).toISOString();
            }
            payload['start'] = new Date(payload['start']).toISOString();
            payload['end'] = new Date(payload['end']).toISOString();
          } else if (dragSourceType === 'taskResizeHandles') {
            var taskShapeType = taskSource.getType ? taskSource.getType() : null;
            if (taskShapeType === 'mainResizeHandleEnd') {
              payload['start'] = new Date(startTime).toISOString();
              payload['end'] =
                new Date(payload['value']).getTime() - startTime < 0 ? startTime : payload['value'];
            } else {
              payload['start'] =
                endTime - new Date(payload['value']).getTime() < 0 ? endTime : payload['value'];
              payload['end'] = new Date(endTime).toISOString();
            }
          }
        }
        return payload;
      }
      return null;
    }

    /**
     * @override
     */
    ShowDropEffect(event) {
      const prevActiveDropObj = this._activeDropObj;
      const dropObj = this._getDropObject(event);
      this._activeDropObj = dropObj;

      // According to spec, the move cursor should be shown during drag move,
      // and the resize cursor should be shown during drag resize.
      // Note this is only relevant on desktop because the cursor is irrelevant on mobile.
      // We achieve this by setting the appropriate cursor (by applying classes) on the
      // target element under the mouse.
      // More specifically, we ensure we only apply the cursor once when entering a new target
      // and we unset the cursor on the target we left:
      const sourceType = this._currDragSourceType;
      const prevDragCursorTarget = this._currDropEffectCursorTarget;
      this._currDropEffectCursorTarget = event.target;
      if (
        !dvt.Agent.isTouchDevice() &&
        this._comp.isHighLevelDnDEnabled() &&
        event.target !== prevDragCursorTarget
      ) {
        if (
          prevDragCursorTarget &&
          DvtGanttStyleUtils.hasClass(prevDragCursorTarget, this._currDropEffectCursorStyleClass)
        ) {
          // See comment below about ClearDropEffect not invoked sometimes on some platforms
          prevDragCursorTarget.removeClassName(this._currDropEffectCursorStyleClass);
        }
        if (!DvtGanttStyleUtils.hasClass(event.target, this._currDropEffectCursorStyleClass)) {
          event.target.addClassName(this._currDropEffectCursorStyleClass);
        }
      }

      const isTaskResizeEnabled = this._comp.isTaskResizeEnabled();
      if (isTaskResizeEnabled && sourceType === 'taskResizeHandles') {
        return; // Don't show any effects for task resize case
      }

      // If the previous active drop row is the same as the current one, skip updating the row highlight
      if (dropObj && dropObj.nodeType === 'row' && dropObj !== prevActiveDropObj) {
        if (prevActiveDropObj && prevActiveDropObj.nodeType === 'row') {
          // In firefox (and sometimes on mobile), when one drags a task
          // to the edge such that the gantt starts panning, the drop effect doesn't clear
          // from previous rows (normally the ClearDropEffect is invoked to clear them,
          // but that's not happening in Firefox, perhaps because it couldn't handle the the conflicting
          // speed at which mouse events are fired and the speed at which the viewport rerenders).
          // In any case, remove the effects here in case ClearDropEffect is not invoked.
          prevActiveDropObj.removeEffect('invalidDrop');
          prevActiveDropObj.removeEffect('activeDrop');
        }
        dropObj.showEffect('activeDrop');
      }
    }

    /**
     * @override
     */
    ShowRejectedDropEffect(event) {
      var prevActiveDropObj = this._activeDropObj;
      var dropObj = this._getDropObject(event);
      this._activeDropObj = dropObj;

      this._currDropEffectCursorTarget = event.target;

      if (this._comp.isTaskResizeEnabled() && this._currDragSourceType === 'taskResizeHandles') {
        return; // Don't show any effects for task resize case
      }

      // If the previous active drop row is the same as the current one, skip updating the row highlight
      if (dropObj && dropObj.nodeType === 'row' && dropObj !== prevActiveDropObj) {
        dropObj.showEffect('invalidDrop');
      }
    }

    /**
     * @override
     */
    ClearDropEffect() {
      // Unset any move/resize related cursors that were set during drag:
      if (
        !dvt.Agent.isTouchDevice() &&
        this._comp.isHighLevelDnDEnabled() &&
        this._currDropEffectCursorTarget &&
        DvtGanttStyleUtils.hasClass(
          this._currDropEffectCursorTarget,
          this._currDropEffectCursorStyleClass
        )
      ) {
        this._currDropEffectCursorTarget.removeClassName(this._currDropEffectCursorStyleClass);
      }
      this._currDropEffectCursorTarget = null;

      // Clear any previously applied drop effects:
      const dropObj = this._getDropObject();
      if (dropObj && dropObj.nodeType === 'row') {
        dropObj.removeEffect('invalidDrop');
        dropObj.removeEffect('activeDrop');
      }
      this._activeDropObj = null;
    }

    /**
     * Handles DnD drag start.
     * @param {dvt.BaseEvent|dvt.MouseEvent} event HTML5 DnD event, or mouse event
     * @private
     */
    _onDndDragStart(event) {
      // At this point, isDnDDragging should be false. If true, then something else initiated a drag, e.g. keyboard move,
      // There should only be one set of things dragging at any give time, so cancel this one.
      if (this._isDndDragging) {
        event.preventDefault();
      }

      var nativeEvent = event.getNativeEvent();
      if (!nativeEvent.defaultPrevented) {
        this._isDndDragging = true;
        this._dragStartSetup();
        var obj = this.DragSource.getDragObject();
        if (obj && obj.nodeType === 'task') {
          obj.dragStartSetup(event);
          var dataTransfer = nativeEvent.dataTransfer;
          this._dropOffset = dataTransfer
            ? new dvt.Point(
                Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_X_DATA_TYPE)) || 0,
                Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_Y_DATA_TYPE)) || 0
              )
            : this.GetDropOffset(
                this._highLevelDnDDragStartPagePoint
                  ? {
                      pageX: this._highLevelDnDDragStartPagePoint.x,
                      pageY: this._highLevelDnDDragStartPagePoint.y
                    }
                  : event
              );
        } else {
          this._dropOffset = new dvt.Point(0, 0);
        }
      } else {
        // Reenable panning/marquee
        this._comp.SetPanningEnabled(true);
        this._comp.SetMarqueeEnabled(true);
      }
    }

    /**
     * Handles DnD drag over.
     * @param {dvt.BaseEvent|dvt.MouseEvent} event HTML5 DnD event, or mouse event
     * @private
     */
    _onDnDDragOver(event) {
      // Redrawing the drag feedback image every time the dragover is fired (every 350ms or so, even when the mouse didn't move) or mousemove is fired
      // affects performance, especially when the viewport refreshes on edge auto panning. Throttle the feedback drawing using
      // requestAnimationFrame similar to the example outlined in https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example
      var self = this;
      this._lastKnownDragOverEvent = event;
      self._isDndDragging = true;
      // Only requestAnimationFrame if one is not requested already, and if the mouse moved (no need to update feedback if mouse didn't move).
      if (
        !this._isDragOverTicking &&
        (!this._lastProcessedDragOverEvent ||
          this._lastKnownDragOverEvent.pageX !== this._lastProcessedDragOverEvent.pageX ||
          this._lastKnownDragOverEvent.pageY !== this._lastProcessedDragOverEvent.pageY)
      ) {
        requestAnimationFrame(() => {
          self._isDragOverTicking = false;

          // Need to do this here instead of onDndDrag because the drag event doesn't have pageX/Y on FF for some reason.
          var obj = self.DragSource.getDragObject();
          if (obj && obj.nodeType === 'task' && self._isDndDragging) {
            var isValidDrop =
              self._lastKnownDragOverEvent.type !== 'dragover' ||
              self._lastKnownDragOverEvent.getNativeEvent().defaultPrevented;
            if (isValidDrop) {
              var stagePos = self._comp
                .getCtx()
                .pageToStageCoords(
                  self._lastKnownDragOverEvent.pageX,
                  self._lastKnownDragOverEvent.pageY
                );
              // Note, "local" here means in the reference of the affordance container coord system
              var localPos = self._comp.getDnDArtifactsContainer().stageToLocal(stagePos);
              obj.showDragFeedback(
                self._lastKnownDragOverEvent,
                localPos,
                self._getDropObject(),
                self._dropOffset
              );

              // For touch devices with screenreader, we're using passthru gesture (in iOS VoiceOVer, double tap and hold until tone, then drag) to perform real HTML5 drag and drop.
              // Update the aria live region with position information if the position changed due to drag.
              if (dvt.Agent.isTouchDevice()) {
                // Only update the aria live region if what we want to be read out changed,
                // e.g. the finger may have stopped, but moved 1px by accident and we don't want what's currently being read be interrupted.
                var screenReaderDragText = dvt.AriaUtils.processAriaLabel(
                  DvtGanttTooltipUtils.getDatatip(obj, false)
                );
                if (self._comp.isSelectionSupported() && obj.isSelected()) {
                  var totalSelected = self._comp.getSelectionHandler().getSelectedCount();
                  if (totalSelected > 1) {
                    screenReaderDragText +=
                      '. ' +
                      dvt.ResourceUtils.format(
                        self._comp.getOptions().translations.taskMoveSelectionInfo,
                        [totalSelected - 1]
                      );
                  }
                }

                if (
                  !self._prevScreenReaderDragText ||
                  self._prevScreenReaderDragText !== screenReaderDragText
                ) {
                  self._comp.updateLiveRegionText(screenReaderDragText);
                }
                self._prevScreenReaderDragText = screenReaderDragText;
              }
            } else obj.removeDragFeedbacks();
          }
          self._lastProcessedDragOverEvent = self._lastKnownDragOverEvent;
        });
        this._isDragOverTicking = true;
      }
    }

    /**
     * Handles DnD drag end.
     * @param {dvt.BaseEvent|dvt.MouseEvent} event HTML5 DnD event, or mouse event
     * @private
     */
    _onDnDDragEnd(event) {
      const obj = this.DragSource.getDragObject();
      if (obj && obj.nodeType === 'task') {
        obj.dragEndCleanup();
      }

      this._isDndDragging = false;
      this._highLevelDnDDragStartPagePoint = null;
      this._activeDropObj = null;
      this._currDragSourceType = null;
      this._currDropEffectCursorStyleClass = null;
      this._dropOffset = new dvt.Point(0, 0);

      // If keyboard event triggered this, then this is a high level DnD drag cancel.
      // If low level DnD dragging, but keyboard Esc pressed to cancel, then dropEffect is 'none'
      // This is the recommended way to detect drag cancelling according to MDN:
      // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragend
      // "If the dropEffect property has the value none during a dragend, then the drag was cancelled. Otherwise, the effect specifies which operation was performed."
      if (
        event.keyCode != null ||
        (event.type === 'dragend' && event.getNativeEvent().dataTransfer.dropEffect === 'none')
      ) {
        this.ClearDropEffect();
        this.handleKeyboardDnDCancel();
      }

      // reenabling panning/marquee on dragend and on mouseup
      // the panning/marquee is disabled on mousedown event to prevent panning/marqueeing before potential drag
      // if draggable source is not dragged, the component will not get dragend event and the panning is reenabled on mouseup
      // if draggable source was dragged, the component will get dragend event, but it might not get mouseup event
      this._comp.SetPanningEnabled(true);
      this._comp.SetMarqueeEnabled(true);

      // Re-dim the data area
      if (this._comp.getOptions()['selectionBehavior'] === 'highlightDependencies') {
        this._comp.dimDatabody();
      }
    }

    /**
     * Handles DnD drop.
     * @param {dvt.BaseEvent|dvt.MouseEvent} event HTML5 DnD event, or mouse event
     * @private
     */
    _onDnDDrop(event) {
      // Viewport adjustments need to be done before handling move callback (rerender may happen after move callback)
      this._dropCleanup();

      var nativeEvent = event.getNativeEvent();
      if (event.type !== 'drop' || nativeEvent.defaultPrevented) {
        var dragObj = this.DragSource.getDragObject();
        var sourceType = dragObj.getDraggedObject
          ? this.getDnDTaskSubType(dragObj.getDraggedObject())
          : 'tasks';
        if (this._comp.isTaskMoveEnabled() && sourceType === 'tasks') {
          // For touch devices with screenreader, we're using passthru gesture (in iOS VoiceOVer, double tap and hold until tone, then drag) to perform real HTML5 drag and drop.
          // Update the aria live region when drop happened (i.e. in VO, when the finger is lifted to end passthru gesture);
          if (dvt.Agent.isTouchDevice()) {
            this._comp.updateLiveRegionText(this._comp.getOptions().translations.taskMoveFinalized);
          }

          var dropPayload = this.GetDropEventPayload(event);
          var taskContexts =
            event.type !== 'drop'
              ? this.GetDragDataContexts()
              : JSON.parse(
                  nativeEvent.dataTransfer.getData(DvtGanttEventManager.MOVE_TASKS_DATA_TYPE)
                );
          var value = dropPayload['value'];
          var start = dropPayload['start'];
          var end = dropPayload['end'];
          var baselineStart = dropPayload['baselineStart'];
          var baselineEnd = dropPayload['baselineEnd'];
          var rowContexts = dropPayload['dataContext'];
          var evt = dvt.EventFactory.newGanttMoveEvent(
            taskContexts,
            value,
            start,
            end,
            baselineStart,
            baselineEnd,
            rowContexts
          );
          this._comp.dispatchEvent(evt);
        } else if (this._comp.isTaskResizeEnabled() && sourceType === 'taskResizeHandles') {
          // Update the aria live region when drop happened (i.e. in VO, when the finger is lifted to end passthru gesture);
          if (dvt.Agent.isTouchDevice()) {
            this._comp.updateLiveRegionText(this._comp.getOptions().translations.taskResizeFinalized);
          }
          var dropPayload = this.GetDropEventPayload(event);
          var dragData =
            event.type !== 'drop'
              ? this.GetDragDataContexts()
              : JSON.parse(
                  nativeEvent.dataTransfer.getData(DvtGanttEventManager.RESIZE_TASKS_DATA_TYPE)
                );
          var type = dragData[0]['type'];
          var taskContexts = dragData.map((data) => {
            return data.dataContext;
          });
          var value = dropPayload['value'];
          var start = dropPayload['start'];
          var end = dropPayload['end'];
          var evt = dvt.EventFactory.newGanttResizeEvent(taskContexts, value, start, end, type);
          this._comp.dispatchEvent(evt);
        }
      }
    }

    /**
     * @override
     */
    OnDndDragStart(event) {
      super.OnDndDragStart(event);
      this._onDndDragStart(event);
    }

    /**
     * @override
     */
    OnDndDragOver(event) {
      super.OnDndDragOver(event);
      this._onDnDDragOver(event);
    }

    /**
     * @override
     */
    OnDndDragEnd(event) {
      super.OnDndDragEnd(event);
      this._onDnDDragEnd(event);
    }

    /**
     * @override
     */
    OnDndDrop(event) {
      super.OnDndDrop(event);
      this._onDnDDrop(event);
    }

    /**
     * Helper function that checks if a given source type is draggable
     * @param {string} type
     * @return {boolean} true if the source type can be dragged
     * @protected
     */
    IsDragSupported(type) {
      // High level DnD
      if (type === 'tasks' && this._comp.isTaskMoveEnabled()) {
        return true;
      }
      if (type === 'taskResizeHandles' && this._comp.isTaskResizeEnabled()) {
        return true;
      }
      // Low level DnD
      if (this.isDndSupported()) {
        var options = this._comp.getOptions();
        var dragConfig = options['dnd'] && options['dnd']['drag'] ? options['dnd']['drag'] : null;
        return (
          dragConfig &&
          dragConfig[type] &&
          dragConfig[type]['dataTypes'] &&
          dragConfig[type]['dataTypes'].length > 0
        );
      }
      return false;
    }

    /**
     * Helper function that checks if a given target type can recieve drop
     * @param {string} type
     * @return {boolean} true if the source type can recieve drop
     * @protected
     */
    IsDropSupported(type) {
      // High level DnD
      if (type === 'rows' && this._comp.isHighLevelDnDEnabled()) {
        return true;
      }
      // Low level DnD
      if (this.isDndSupported()) {
        var options = this._comp.getOptions();
        var drogConfig = options['dnd'] && options['dnd']['drop'] ? options['dnd']['drop'] : null;
        return drogConfig && drogConfig[type] && drogConfig[type]['dataTypes'];
      }
      return false;
    }

    /**
     * Handles DnD pre pointer down.
     * @param {dvt.MouseEvent} event event from PreOnMouseDown.
     * @private
     */
    _onDnDPrePointerDown(event) {
      var objAndDisp = this.GetLogicalObjectAndDisplayable(event.target);
      if (objAndDisp.logicalObject && objAndDisp.logicalObject.nodeType === 'task') {
        var sourceType = this.getDnDTaskSubType(objAndDisp.displayable);
        if (this.IsDragSupported(sourceType)) {
          // If draggable, prevent drag panning
          this._comp.SetPanningEnabled(false);
          this._comp.SetMarqueeEnabled(false);

          // On Desktop high level DnD, we need the same cursor to persist during the drag
          // Determine and save the appropriate cursor style classes to apply at the start of the drag here.
          // The classes will be applied to (and removed from) the elements directly under the cursor
          // in the ShowDropEffect()/ClearDropEffect() methods.
          const isTaskMoveEnabled = this._comp.isTaskMoveEnabled();
          const isTaskResizeEnabled = this._comp.isTaskResizeEnabled();
          this._currDragSourceType = sourceType;
          if (isTaskMoveEnabled && sourceType === 'tasks') {
            this._currDropEffectCursorStyleClass = this._comp.GetStyleClass(
              'highLevelDnDMoveDroppable'
            );
          } else if (isTaskResizeEnabled && sourceType === 'taskResizeHandles') {
            this._currDropEffectCursorStyleClass = this._comp.GetStyleClass(
              'highLevelDnDResizeDroppable'
            );
          }

          // Normally this can be handled on dragstart event, but
          // IE11 is stupid. dragstart events fire after the mouse/touch drags
          // a certain px away from the initiation point, and in all browsers
          // except IE11, the dragstart event targets the element at the initiation point.
          // IE11's dragstart, however, targets the element at the point where dragstart
          // event fires, which can be different from that of the initiation point.
          objAndDisp.logicalObject.setDraggedObject(objAndDisp.displayable);
        }
      }
    }

    /**
     * Handles high level DnD pointer down.
     * @param {dvt.MouseEvent} event event from OnMouseDown.
     * @private
     */
    _onHighLevelDnDPointerDown(event) {
      const relPos = this._context.pageToStageCoords(event.pageX, event.pageY);
      const dragTransferable = this.DragSource.getDragTransferable(relPos.x, relPos.y);
      const dragSourceType = this.GetDragSourceType(event);
      if (dragTransferable == null || dragSourceType == null) {
        return;
      }
      this._highLevelDnDDragStartPagePoint = new dvt.Point(event.pageX, event.pageY);
      this._isDndDragging = false; // confirm drag after sufficient mousemove
    }

    /**
     * Handles high level DnD pointer over.
     * @param {dvt.MouseEvent} event event from OnMouseOver.
     * @private
     */
    _onHighLevelDnDPrePointerOver(event) {
      const dropTargetType = this.GetDropTargetType(event);
      const dropRejected = dropTargetType == null;
      if (dropRejected) {
        this.ShowRejectedDropEffect(event);
        return;
      }
      this.ShowDropEffect(event);
    }

    /**
     * Handles high level DnD pointer out.
     * @param {dvt.MouseEvent} event event from OnMouseOut.
     * @private
     */
    _onHighLevelDnDPrePointerOut(event) {
      this.ClearDropEffect();
    }

    /**
     * Handles high level DnD pointer move.
     * @param {dvt.MouseEvent} event event from OnMouseMove.
     * @private
     */
    _onHighLevelDnDPointerMove(event) {
      if (
        !this._isDndDragging &&
        this._highLevelDnDDragStartPagePoint &&
        (Math.abs(event.pageX - this._highLevelDnDDragStartPagePoint.x) >
          this._HIGH_LEVEL_DND_DRAGSTART_DELTA_THRESHOLD ||
          Math.abs(event.pageY - this._highLevelDnDDragStartPagePoint.y) >
            this._HIGH_LEVEL_DND_DRAGSTART_DELTA_THRESHOLD)
      ) {
        this._context.getTooltipManager().hideTooltip();

        const obj = this.DragSource.getDragObject();
        this.ProcessSelectionEventHelper(obj, event.ctrlKey);

        if (obj.hideHoverEffect) obj.hideHoverEffect();
        this._onDndDragStart(event);
      }

      if (this._isDndDragging) {
        const dropTargetType = this.GetDropTargetType(event);
        const dropRejected = dropTargetType == null;
        if (dropRejected) {
          this.ShowRejectedDropEffect(event);
          return;
        }
        this.ShowDropEffect(event);
        this._onDnDDragOver(event);
      }
    }

    /**
     * Handles high level DnD pointer up.
     * @param {dvt.MouseEvent} event event from OnMouseUp.
     * @private
     */
    _onHighLevelDnDPointerUp(event) {
      this._highLevelDnDDragStartPagePoint = null;
      if (this._isDndDragging) {
        this._highLevelDnDEndExecuted = true;
        // Handle Drop
        const dropTargetType = this.GetDropTargetType(event);
        this.ClearDropEffect();

        const dropRejected = dropTargetType == null;
        if (!dropRejected) {
          this._onDnDDrop(event);
        }

        // Handle Drag End
        this.DragSource.setDragCandidate(null);
        this._onDnDDragEnd(event);
        return;
      }
      // Reenable panning/marquee
      this._comp.SetPanningEnabled(true);
      this._comp.SetMarqueeEnabled(true);
    }

    /**
     * @override
     */
    PreOnMouseDown(event) {
      this._onDnDPrePointerDown(event);
      super.PreOnMouseDown(event);
    }

    /**
     * @override
     */
    OnMouseDown(event) {
      super.OnMouseDown(event);

      this._highLevelDnDEndExecuted = false;
      // Only allow plain left-click mouse to start the drag
      if (
        event.button === 0 &&
        !(event.ctrlKey || event.shiftKey) &&
        this._comp.isHighLevelDnDEnabled()
      ) {
        this._onHighLevelDnDPointerDown(event);
      }
    }

    /**
     * @override
     */
    PreOnMouseOver(event) {
      if (this._isDndDragging && this._comp.isHighLevelDnDEnabled()) {
        this._onHighLevelDnDPrePointerOver(event);
        return;
      }
      super.PreOnMouseOver(event);
    }

    /**
     * @override
     */
    PreOnMouseOut(event) {
      if (this._isDndDragging && this._comp.isHighLevelDnDEnabled()) {
        this._onHighLevelDnDPrePointerOut(event);
        return;
      }
      super.PreOnMouseOut(event);
    }

    /**
     * @override
     */
    OnMouseOut(event) {
      super.OnMouseOut(event);
      var timeCursor = this._comp.getTimeCursor();
      if (timeCursor) {
        timeCursor.hide();
      }
    }

    /**
     * @override
     */
    OnMouseMove(event) {
      if (this._comp.isHighLevelDnDEnabled()) {
        this._onHighLevelDnDPointerMove(event);
        if (this._isDndDragging) return;
      }

      super.OnMouseMove(event);

      if (this._comp.IsTimeCursorEnabled()) {
        var timeCursor = this._comp.getTimeCursor();
        if (timeCursor) {
          var isRTL = dvt.Agent.isRightToLeft(this._comp.getCtx());
          var timeCursorContainer = this._comp.getTimeCursorContainer();
          var ganttStartTime = this._comp.getStartTime();
          var ganttEndTime = this._comp.getEndTime();
          var ganttContentLength = this._comp.getContentLength();
          var stagePos = this._comp.getCtx().pageToStageCoords(event.pageX, event.pageY);
          var localPos = timeCursorContainer.stageToLocal(stagePos);
          var time = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
            ganttStartTime,
            ganttEndTime,
            isRTL ? ganttContentLength - localPos.x : localPos.x,
            ganttContentLength
          );
          timeCursor.updateRefObjs([
            {
              type: 'line',
              value: new Date(time).toISOString()
            }
          ]);
          timeCursor.show();
        }
      }
    }

    /**
     * @override
     */
    OnMouseUp(event) {
      if (this._comp.isHighLevelDnDEnabled()) {
        this._onHighLevelDnDPointerUp(event);
        if (this._highLevelDnDEndExecuted) return;
      }
      this._highLevelDnDEndExecuted = false;
      super.OnMouseUp(event);
    }

    /**
     * @override
     */
    OnClick(event) {
      if (this._highLevelDnDEndExecuted) {
        // If this click event was due to a mouseup at the end of high level DnD, then bail.
        this._highLevelDnDEndExecuted = false;
        return;
      }
      super.OnClick(event);
    }

    /**
     * Expands or collapses a row when expand/collapse button is clicked.
     * @param {dvt.BaseEvent} event
     * @param {dvt.IconButton} button The button that calls the method.
     */
    onExpandCollapseButtonClick(event, button) {
      var labelContent = this.GetLogicalObject(button);
      var rowObj = labelContent.getRowLayoutObject();
      this.toggleRowExpandCollapse(event, rowObj);
    }

    /**
     * Toggle expand or collapse of the row with given row layout object.
     * @param {dvt.BaseEvent} event
     * @param {Object} rowObj
     */
    toggleRowExpandCollapse(event, rowObj) {
      if (rowObj['expanded'] == null) {
        // leaf
        return;
      }

      var options = this._comp.getOptions();
      var expandedKeySet = options['expanded'];
      var rowKey = rowObj['id'];
      // Currently, expand/collapse events (and their payloads) are NOT exposed; make sure to sanitize the data before exposing in the payload if this changes in the future.
      var rowData = rowObj['data'];

      var key;
      var itemData;
      if (options['rowData']) {
        key = rowData['id'];
        itemData = rowData['_itemData'];
      } else {
        // taskData hierarchical tasks
        var taskData = rowObj['taskObjs'][0]['data'];
        key = taskData['id'];
        itemData = taskData['_itemData'];
      }

      var type;
      var newExpandedKeySet;
      if (expandedKeySet.has(rowKey)) {
        newExpandedKeySet = expandedKeySet.delete([rowKey]);
        type = 'collapse';
      } else {
        newExpandedKeySet = expandedKeySet.add([rowKey]);
        type = 'expand';
      }

      // Fire event to trigger a rerender. Save state so that the next render can be smart about it.
      this._comp.setRenderState({
        state: type,
        payload: rowObj
      });

      // Need to clear selection before render to clear selection effects--selection will be restored on next render
      if (this._comp.isSelectionSupported()) this._comp.getSelectionHandler().clearSelection();

      var evt = dvt.EventFactory.newGanttExpandCollapseEvent(
        type,
        key,
        rowData,
        itemData,
        newExpandedKeySet
      );
      this._comp.dispatchEvent(evt);
    }

    /**
     * @override
     */
    HandleImmediateTouchStartInternal(event) {
      if (event.targetTouches.length === 1) {
        this._onDnDPrePointerDown(event);
      }
    }

    /**
     * @override
     */
    OnTouchMoveBubble(event) {
      // Normally, on touch move, if touch is over an object that can show a tooltip, it's shown.
      // Otherwise, the tooltip is explicitly hidden.
      // During drag (for DnD), a tooltip is shown on the feedback, but the touch move handler tries to hide it.
      // This causes flickering as the tooltip is shown and hidden very quickly.
      // Make sure to prevent the tooltip from being hidden during drag and drop--the drag/drop events will handle
      // showing/hiding the tooltip.
      if (this._isDndDragging) {
        this._preventHideTooltip = true;
      }
      super.OnTouchMoveBubble(event);
    }
  }
  // Drag & Drop Support

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
   * Gantt keyboard handler.
   * @param {Gantt} gantt The Gantt component.
   * @param {dvt.EventManager} manager The owning dvt.EventManager.
   * @class DvtGanttKeyboardHandler
   * @extends {TimeComponentKeyboardHandler}
   * @constructor
   */
  class DvtGanttKeyboardHandler extends ojdvtTimecomponent.TimeComponentKeyboardHandler {
    constructor(gantt, manager) {
      super(manager);
      this._gantt = gantt;
    }

    /**
     * Retrieve previous task.
     * @param {Gantt} gantt
     * @param {Array} rowObjs
     * @param {Object} currentRowObj
     * @param {number} currentRowIndex
     * @param {DvtGanttTaskNode} currentNavigable
     * @return {DvtGanttTaskNode} the previous task node
     * @private
     */
    static _findPreviousTask(gantt, rowObjs, currentRowObj, currentRowIndex, currentNavigable) {
      var taskObjs = currentRowObj['taskObjs'];
      if (taskObjs.length === 0) {
        if (currentRowIndex === 0) return currentNavigable;
        return DvtGanttKeyboardHandler._findPreviousTask(
          gantt,
          rowObjs,
          rowObjs[currentRowIndex - 1],
          currentRowIndex - 1,
          currentNavigable
        );
      }

      var taskObj = taskObjs[taskObjs.length - 1];
      gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
      return taskObj['node'];
    }

    /**
     * Retrieve next task.
     * @param {Gantt} gantt
     * @param {Array} rowObjs
     * @param {Object} currentRowObj
     * @param {number} currentRowIndex
     * @param {DvtGanttTaskNode} currentNavigable
     * @return {DvtGanttTaskNode} the next task node
     * @private
     */
    static _findNextTask(gantt, rowObjs, currentRowObj, currentRowIndex, currentNavigable) {
      var taskObjs = currentRowObj['taskObjs'];
      if (taskObjs.length === 0) {
        if (currentRowIndex === rowObjs.length - 1) return currentNavigable;
        else
          return DvtGanttKeyboardHandler._findNextTask(
            gantt,
            rowObjs,
            rowObjs[currentRowIndex + 1],
            currentRowIndex + 1,
            currentNavigable
          );
      } else {
        var taskObj = taskObjs[0];
        gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
        return taskObj['node'];
      }
    }

    /**
     * Finds next navigable item based on direction.
     * @param {Gantt} gantt The component.
     * @param {DvtKeyboardNavigable} currentNavigable The navigable item with current focus.
     * @param {dvt.KeyboardEvent} event The keyboard event.
     * @param {DvtKeyboardNavigable=} originalNavigable The original item that initaited navigation.
     * @return {DvtKeyboardNavigable} The next navigable.
     */
    static getNextNavigable(gantt, currentNavigable, event, originalNavigable) {
      if (currentNavigable == null || currentNavigable.nodeType !== 'task') {
        return null;
      }

      var currentRow = currentNavigable.getRowNode();
      var rowObjs = gantt.getRowLayoutObjs();
      var taskObjs = currentRow.getTaskObjs();

      var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
      var rowIndex = currentRow.getIndex();
      switch (event.keyCode) {
        case !isRTL ? dvt.KeyboardEvent.LEFT_ARROW : dvt.KeyboardEvent.RIGHT_ARROW:
          var taskIndex = taskObjs
            .map((t) => {
              return t['node'];
            })
            .indexOf(currentNavigable);
          // check if it's the first task in the row
          if (taskIndex === 0) {
            // go to the last task of the previous row
            if (rowIndex > 0) {
              // find the previous row with task
              return DvtGanttKeyboardHandler._findPreviousTask(
                gantt,
                rowObjs,
                rowObjs[rowIndex - 1],
                rowIndex - 1,
                currentNavigable
              );
            }
          } else {
            var taskObj = taskObjs[taskIndex - 1];
            gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
            return taskObj['node'];
          }
          break;
        case !isRTL ? dvt.KeyboardEvent.RIGHT_ARROW : dvt.KeyboardEvent.LEFT_ARROW:
          taskIndex = taskObjs
            .map((t) => {
              return t['node'];
            })
            .indexOf(currentNavigable);
          if (taskIndex === taskObjs.length - 1) {
            // go to the first task of the next row
            if (rowIndex < rowObjs.length - 1) {
              // find the next row with task
              return DvtGanttKeyboardHandler._findNextTask(
                gantt,
                rowObjs,
                rowObjs[rowIndex + 1],
                rowIndex + 1,
                currentNavigable
              );
            }
          } else {
            var taskObj = taskObjs[taskIndex + 1];
            gantt.getDataLayoutManager().ensureInDOM(taskObj, 'task');
            return taskObj['node'];
          }
          break;
        case dvt.KeyboardEvent.UP_ARROW:
          if (rowIndex > 0) {
            currentNavigable = DvtGanttKeyboardHandler._findPreviousTask(
              gantt,
              rowObjs,
              rowObjs[rowIndex - 1],
              rowIndex - 1,
              currentNavigable
            );
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
            currentNavigable = DvtGanttKeyboardHandler._findNextTask(
              gantt,
              rowObjs,
              rowObjs[rowIndex + 1],
              rowIndex + 1,
              currentNavigable
            );
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

    /**
     * Whether this is a navigation event.  Override base class to include alt + > and <
     * @param {object} event
     * @return {boolean} whether it is a navigation event
     * @override
     */
    isNavigationEvent(event) {
      var retVal = false;
      switch (event.keyCode) {
        case dvt.KeyboardEvent.OPEN_ANGLED_BRACKET:
        case dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET:
          retVal = event.altKey ? true : false;
          break;
        default:
          // The super's arrow keys check would include task <-> row labels navigation
          retVal = super.isNavigationEvent(event);
      }
      return retVal;
    }

    /**
     * @override
     */
    isSelectionEvent(event) {
      var currentNavigable = this._eventManager.getFocus();
      // JET-62641: only tasks are selectable,
      // and rowlabel <-> task navigation should not be considered as selection events
      return (
        super.isSelectionEvent(event) &&
        currentNavigable?.nodeType === 'task' &&
        !(
          this._gantt.isRowAxisEnabled() &&
          event.altKey &&
          (event.keyCode === dvt.KeyboardEvent.LEFT_ARROW ||
            event.keyCode === dvt.KeyboardEvent.RIGHT_ARROW)
        )
      );
    }

    /**
     * Calculate the distance (basically time duration in millis) between predecessor and successor
     * @param {DvtGanttDependencyNode} dep
     * @return {number} distance between predecessor and successor
     * @private
     */
    _getDistance(dep) {
      var type = dep.getValue('type');
      var predecessor = dep.getPredecessorNode();
      var successor = dep.getSuccessorNode();

      var date1 =
        type === DvtGanttDependencyNode.START_START || type === DvtGanttDependencyNode.START_FINISH
          ? predecessor.getValue('start')
          : predecessor.getValue('end');

      if (type === DvtGanttDependencyNode.START_START || type === DvtGanttDependencyNode.FINISH_START)
        var date2 = successor.getValue('start');
      else date2 = successor.getValue('end');

      return Math.abs(date2 - date1);
    }

    /**
     * Get function that compares two link around a given node
     * The dependency lines are analyzed by distance from the node, which is derieved based on start and end time of the predeccessor and successor
     * @return {function} a function that compares to dependency lines around the node
     * @private
     */
    _getDependencyComparator() {
      var self = this;
      var comparator = (dep1, dep2) => {
        var distance1 = self._getDistance(dep1);
        var distance2 = self._getDistance(dep2);

        if (distance1 < distance2) return -1;
        else if (distance1 > distance2) return 1;
        else return 0;
      };
      return comparator;
    }

    /**
     * Get first navigable dependency line
     * @param {DvtGanttTaskNode} task task for which dependency lines are analyzed
     * @param {dvt.KeyboardEvent} event keyboard event
     * @param {array} listOfLines array of lines for the task
     * @return {DvtGanttDependencyNode} first navigable dependency line
     */
    getFirstNavigableDependencyLine(task, event, listOfLines) {
      var ctx = this._gantt.getCtx();
      var direction = event.keyCode;
      if (!listOfLines || listOfLines.length < 1 || !task) return null;

      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var first = null;
      var min = 0;
      for (var i = 0; i < listOfLines.length; i++) {
        var dependencyLine = listOfLines[i];

        if (direction === dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET)
          var taskToCompare = isRTL
            ? dependencyLine.getValue('predecessorTaskId')
            : dependencyLine.getValue('successorTaskId');
        else
          taskToCompare = isRTL
            ? dependencyLine.getValue('successorTaskId')
            : dependencyLine.getValue('predecessorTaskId');

        // sanity check...
        if (dvt.Obj.compareValues(ctx, task.getId(), taskToCompare)) continue;

        var dist = this._getDistance(dependencyLine);
        if (first == null || dist < min) {
          min = dist;
          first = dependencyLine;
        }
      }

      return first;
    }

    /**
     * Get next navigable dependency line.
     * The decision is made based on distance between end points of tasks (start or end based on dependency type).
     * @param {DvtGanttTaskNode} task the task for which dependency lines are analyzed
     * @param {DvtGanttDependencyNode} currentDependencyLine the dependency line in focus
     * @param {dvt.KeyboardEvent} event the keyboard event
     * @param {array} listOfLines the array of dependency lines for the node
     * @return {DvtGanttDependencyNode} next navigable dependency line
     */
    getNextNavigableDependencyLine(task, currentDependencyLine, event, listOfLines) {
      if (!listOfLines) return null;

      if (!currentDependencyLine) return listOfLines[0];

      if (!task) return currentDependencyLine;

      listOfLines.sort(this._getDependencyComparator());

      var bForward = event.keyCode === dvt.KeyboardEvent.DOWN_ARROW ? true : false;
      var index = 0;
      for (var i = 0; i < listOfLines.length; i++) {
        var dependencyLine = listOfLines[i];
        if (dependencyLine === currentDependencyLine) {
          if (bForward) index = i === listOfLines.length - 1 ? 0 : i + 1;
          else index = i === 0 ? listOfLines.length - 1 : i - 1;
          break;
        }
      }
      return listOfLines[index];
    }

    /**
     * Whether keyboard event equates to initializing High level DnD Move
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to move initiation
     */
    isMoveInitiationEvent(event) {
      return event.keyCode === dvt.KeyboardEvent.M && event.ctrlKey;
    }

    /**
     * Whether keyboard event equates to initializing High level Start Resize
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to start resize initiation
     */
    isResizeStartInitiationEvent(event) {
      return event.keyCode === 83 && event.altKey; // alt + s
    }

    /**
     * Whether keyboard event equates to initializing High level End Resize
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to end resize initiation
     */
    isResizeEndInitiationEvent(event) {
      return event.keyCode === 69 && event.altKey; // alt + e
    }

    /**
     * Whether keyboard event equates to increasing navigation time scale during High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to increasing navigation time scale
     */
    isDnDScaleUpEvent(event) {
      return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.PAGE_UP;
    }

    /**
     * Whether keyboard event equates to decreasing navigation time scale during High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to decreasing navigation time scale
     */
    isDnDScaleDownEvent(event) {
      return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.PAGE_DOWN;
    }

    /**
     * Whether keyboard event equates to moving forward a unit of time scale during High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to moving forward a unit of time scale
     */
    isDnDForwardEvent(event) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      return (
        this._eventManager.getKeyboardDnDMode() &&
        event.keyCode === (isRTL ? dvt.KeyboardEvent.LEFT_ARROW : dvt.KeyboardEvent.RIGHT_ARROW)
      );
    }

    /**
     * Whether keyboard event equates to moving backward a unit of time scale during High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to moving backward a unit of time scale
     */
    isDnDBackwardEvent(event) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      return (
        this._eventManager.getKeyboardDnDMode() &&
        event.keyCode === (isRTL ? dvt.KeyboardEvent.RIGHT_ARROW : dvt.KeyboardEvent.LEFT_ARROW)
      );
    }

    /**
     * Whether keyboard event equates to moving up a row during High level DnD Move
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to moving up a row during move
     */
    isMoveRowAboveEvent(event) {
      return (
        this._eventManager.getKeyboardDnDMode() === DvtGanttEventManager.KEYBOARD_MOVE &&
        event.keyCode === dvt.KeyboardEvent.UP_ARROW
      );
    }

    /**
     * Whether keyboard event equates to moving down a row during High level DnD Move
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to moving down a row during move
     */
    isMoveRowBelowEvent(event) {
      return (
        this._eventManager.getKeyboardDnDMode() === DvtGanttEventManager.KEYBOARD_MOVE &&
        event.keyCode === dvt.KeyboardEvent.DOWN_ARROW
      );
    }

    /**
     * Whether keyboard event equates to finalizing High level DnD interactivity
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to finalizing a drop
     */
    isDnDFinalizeEvent(event) {
      return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.ENTER;
    }

    /**
     * Whether keyboard event equates to cancelling a high level keyboard DnD dragging operation.
     * @param {dvt.KeyboardEvent} event keyboard event
     * @return {boolean} whether key strokes equate to cancelling a move
     */
    isDnDCancelEvent(event) {
      return this._eventManager.getKeyboardDnDMode() && event.keyCode === dvt.KeyboardEvent.ESCAPE;
    }

    /**
     * Whether keyboard event equates to cancelling a high level mouse DnD dragging operation.
     * Note that cancelling a low level HTML5 DnD drag via keyboard Esc is detected in dragEnd event instead of
     * through keyboard events, which are not fired.
     * @param {dvt.KeyboardEvent} event keyboard event
     * @returns {boolean} whether key strokes equate to cancelling a move during high level mouse DnD
     */
    isHighLevelMouseDnDCancelEvent(event) {
      return (
        this._eventManager.isDnDDragging() &&
        this._eventManager.getKeyboardDnDMode() == null &&
        event.keyCode === dvt.KeyboardEvent.ESCAPE
      );
    }

    /**
     * @override
     */
    processKeyDown(event) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var keyCode = event.keyCode;
      if (keyCode === dvt.KeyboardEvent.TAB) {
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
        var isSelectedTask =
          currentNavigable && currentNavigable.nodeType === 'task' && currentNavigable.isSelected();
        if (
          isSelectedTask &&
          this._gantt.isTaskMoveEnabled() &&
          !this._eventManager.isDnDDragging()
        ) {
          this._eventManager.handleKeyboardMoveInitiation(event, currentNavigable);
          dvt.EventManager.consumeEvent(event);
          return null;
        }
      }
      if (this.isResizeStartInitiationEvent(event)) {
        var currentNavigable = this._eventManager.getFocus();
        var isSelectedTask =
          currentNavigable && currentNavigable.nodeType === 'task' && currentNavigable.isSelected();
        if (
          isSelectedTask &&
          this._gantt.isTaskResizeEnabled() &&
          !this._eventManager.isDnDDragging()
        ) {
          this._eventManager.handleKeyboardResizeStartInitiation(event, currentNavigable);
          dvt.EventManager.consumeEvent(event);
          return null;
        }
      }
      if (this.isResizeEndInitiationEvent(event)) {
        var currentNavigable = this._eventManager.getFocus();
        var isSelectedTask =
          currentNavigable && currentNavigable.nodeType === 'task' && currentNavigable.isSelected();
        if (
          isSelectedTask &&
          this._gantt.isTaskResizeEnabled() &&
          !this._eventManager.isDnDDragging()
        ) {
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
      }
      if (this.isHighLevelMouseDnDCancelEvent(event)) {
        this._eventManager.handleHighLevelMouseDnDCancel(event);
        dvt.EventManager.consumeEvent(event);
        return null;
      }

      // Expand/collapse row from task
      // Note: Won't conflict with multiselect (ctrl + space) because that's normally handled in superclass method below.
      if (keyCode === dvt.KeyboardEvent.SPACE && event.ctrlKey && event.shiftKey) {
        var currentNavigable = this._eventManager.getFocus();
        if (currentNavigable && currentNavigable.nodeType === 'task') {
          dvt.EventManager.consumeEvent(event);
          this._eventManager.toggleRowExpandCollapse(
            event,
            currentNavigable.getLayoutObject()['rowObj']
          );
          return null;
        }
      }

      // Expand row from row label
      if (
        keyCode === (isRTL ? dvt.KeyboardEvent.LEFT_ARROW : dvt.KeyboardEvent.RIGHT_ARROW) &&
        event.ctrlKey
      ) {
        var currentNavigable = this._eventManager.getFocus();
        var dataLayoutManager = this._gantt.getDataLayoutManager();
        if (currentNavigable && currentNavigable.nodeType === 'rowLabel') {
          var rowObj = currentNavigable.getRowLayoutObject();
          var dataLayoutManager = this._gantt.getDataLayoutManager();
          if (dataLayoutManager.isRowExpandable(rowObj)) {
            dvt.EventManager.consumeEvent(event);
            this._eventManager.toggleRowExpandCollapse(event, currentNavigable.getRowLayoutObject());
            return null;
          }
        }
      }

      // Collapse row from row label
      if (
        keyCode === (isRTL ? dvt.KeyboardEvent.RIGHT_ARROW : dvt.KeyboardEvent.LEFT_ARROW) &&
        event.ctrlKey
      ) {
        var currentNavigable = this._eventManager.getFocus();
        if (currentNavigable && currentNavigable.nodeType === 'rowLabel') {
          var rowObj = currentNavigable.getRowLayoutObject();
          var dataLayoutManager = this._gantt.getDataLayoutManager();
          if (dataLayoutManager.isRowCollapsible(rowObj)) {
            dvt.EventManager.consumeEvent(event);
            this._eventManager.toggleRowExpandCollapse(event, rowObj);
            return null;
          }
        }
      }

      if (keyCode === dvt.KeyboardEvent.ESCAPE) {
        this._eventManager.cancelMarquee(event);
        return null;
      }

      return super.processKeyDown(event);
    }
  }

  /**
   * Class representing task content to be overlayed over the main task shape.
   * @param {Gantt} gantt The gantt component
   * @param {DvtGanttTask} task The task the content belongs to
   * @class
   * @constructor
   */
  class DvtGanttTaskContent extends dvt.Container {
    constructor(gantt, task) {
      super(gantt.getCtx(), null);

      this._gantt = gantt;
      this._task = task;
      this._isHighlighted = false;
    }

    /**
     * Renders the task content.
     * @param {boolean} hovered Whether task is hovered.
     */
    render(hovered) {
      const options = this._gantt.getOptions();
      if (this._content) {
        this.removeChild(this._content);
      }
      this._content = new dvt.Container(this._gantt.getCtx());
      this._content.setClassName(this._gantt.GetStyleClass('taskCustom'));

      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var clipPathCoordSystem = this._getClipPathCoordSystem();

      // for CSS clip-path to work as expected, this._content's bounding box need to match the mainShape's bounding box.
      // To ensure this for, render a hidden rect that matches the expected bounding box dimension
      if (clipPathCoordSystem === 'css') {
        var mainShape = this._task.getShape('main');
        var width =
          mainShape.getWidth() +
          mainShape.getPhysicalStartOffset() +
          mainShape.getPhysicalEndOffset();
        var height = mainShape.getHeight();
        var containerSupport = new dvt.Rect(
          this._gantt.getCtx(),
          isRTL ? -width : 0,
          0,
          width,
          height
        );
        containerSupport.setVisible(false);
        this._content.addChild(containerSupport);
      }

      this.addChild(this._content);
      const parentElem = this._content.getContainerElem();
      const renderer = options.taskContent.renderer; // must have been defined if reached here
      const dataContext = this.getRendererContext(hovered);
      const customContent = renderer(dataContext);
      if (customContent) {
        if (Array.isArray(customContent)) {
          customContent.forEach((node) => {
            dvt.ToolkitUtils.appendChildElem(parentElem, node);
          });
        } else {
          dvt.ToolkitUtils.appendChildElem(parentElem, customContent);
        }
      }

      const cpDim = this._getClipPathDim();
      this._applyClipPath(cpDim);

      // render is triggered again upon interactions e.g. on hover/focus
      // which clears highlighted classname, so ensure content shows up highlighted
      if (this._isHighlighted) {
        this.highlight();
      } else {
        this.unhighlight();
      }
    }

    /**
     * Destroys the task content.
     */
    destroy() {
      // unset clippath to prevent memory leaks
      this.setClipPath(null);

      this.removeFromParent();
    }

    /**
     * Gets the context to be passed into custom renderer callbacks
     * @param {object} hovered Whether state is hovered
     * @return {object} The renderer context
     */
    getRendererContext(hovered) {
      const context = this._gantt.getCtx();
      const mainShape = this._task.getShape('main');
      const taskNode = this._task.getContainer();
      const rowNode = taskNode.getRowNode();
      const rowObj = rowNode.getLayoutObject();

      const data = taskNode.getData();
      const itemData = data._itemData;

      const dataContext = {
        data: taskNode.getData(true),
        rowData: rowNode.getData(true),
        itemData: itemData || null,
        content: {
          height: mainShape.getHeight(),
          width:
            mainShape.getWidth() +
            mainShape.getPhysicalStartOffset() +
            mainShape.getPhysicalEndOffset()
        },
        state: {
          expanded: !!rowObj.expanded,
          focused: !!taskNode.isShowingKeyboardFocusEffect(),
          hovered: hovered,
          selected: !!taskNode.isSelected()
        }
      };
      return context.fixRendererContext(dataContext);
    }

    /**
     * "Highights" the task, i.e. for when selection-behavior is "highlightDependencies".
     */
    highlight() {
      this._isHighlighted = true;
      if (this._content) {
        dvt.ToolkitUtils.addClassName(
          this._content.getElem(),
          this._gantt.GetStyleClass('taskHighlight')
        );
      }
    }

    /**
     * "Un-Highights" the task, i.e. for when selection-behavior is "highlightDependencies".
     */
    unhighlight() {
      this._isHighlighted = false;
      if (this._content) {
        dvt.ToolkitUtils.removeClassName(
          this._content.getElem(),
          this._gantt.GetStyleClass('taskHighlight')
        );
      }
    }

    /**
     * Gets the clippath coordinate system. If clippath is to be applied via CSS, then
     * 'css' is returned. Otherwise 'svg' if SVG clippath is to be applied.
     * @returns {string} 'css' | 'svg'
     * @private
     */
    _getClipPathCoordSystem() {
      const isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      return !isRTL ? 'css' : 'svg';
    }

    /**
     * Returns the clippath rect dimension around the content
     * @param {object} refDim Any dimensions to be merged and processed
     * @return {object} The rect x,y,w,h,r dimensions
     * @private
     */
    _getClipPathDim(refDim) {
      const dim = refDim || {};
      const mainShape = this._task.getShape('main');
      const isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      const coordSystem = this._getClipPathCoordSystem();

      const refX = 0;
      const refW = dim.w != null ? dim.w : mainShape.getWidth();

      const result = {
        y: 0,
        translateY: 0,
        w: refW + mainShape.getPhysicalStartOffset() + mainShape.getPhysicalEndOffset(),
        h: dim.h != null ? dim.h : mainShape.getHeight(),
        r: dim.r != null ? dim.r : mainShape.getBorderRadius(),
        _coordSystem: coordSystem
      };
      if (coordSystem === 'svg') {
        result.x = isRTL
          ? refX - refW - mainShape.getPhysicalEndOffset()
          : refX - mainShape.getPhysicalStartOffset();
        result.translateX = isRTL
          ? refX + mainShape.getPhysicalStartOffset()
          : refX - mainShape.getPhysicalStartOffset();
      } else {
        result.x = 0;
        result.translateX = refX - mainShape.getPhysicalStartOffset();
      }
      return result;
    }

    /**
     * Applies the clippath rect around the content
     * @param {object} cpDim Of shape { x: number, y: number, w: number, h: number, r: string }
     * @private
     */
    _applyClipPath(cpDim) {
      const { x, y, w, h, r } = cpDim;
      const pathCmd = dvt.PathUtils.rectangleWithBorderRadius(x, y, w, h, r, Math.min(w, h), '0');

      if (cpDim._coordSystem === 'css') {
        // this.setStyle() triggers a CSP violation on Safari for some reason
        this.getElem().style.clipPath = `path('${pathCmd}')`;
      } else {
        const cp = new dvt.ClipPath();
        cp.addPath(pathCmd);
        this.setClipPath(cp);
      }
    }

    /**
     * Sets the width of the content, by setting the appropriate clippath.
     * @param {number} width The new width.
     */
    setWidth(width) {
      const cpDim = this._getClipPathDim({ w: width });
      this._applyClipPath(cpDim);
    }

    /**
     * Sets the height of the content, by setting the appropriate clippath.
     * @param {number} height The new height.
     */
    setHeight(height) {
      const cpDim = this._getClipPathDim({ h: height });
      this._applyClipPath(cpDim);
    }

    /**
     * Sets the x of the content, by setting the appropriate clippath and translateX.
     * @param {number} x The new x.
     */
    setX(x) {
      const cpDim = this._getClipPathDim({ x: x });
      this.setTranslateX(cpDim.translateX);
      this._applyClipPath(cpDim);
    }

    /**
     * Sets the y of the content, by setting the appropriate clippath and translateY.
     * @param {number} y The new y.
     */
    setY(y) {
      const cpDim = this._getClipPathDim({ y: y });
      this.setTranslateY(cpDim.translateY);
      this._applyClipPath(cpDim);
    }

    /**
     * Sets the border radius of the content, by setting the appropriate clippath.
     * @param {number} r The new border radius.
     */
    setBorderRadius(r) {
      const cpDim = this._getClipPathDim({ r: r });
      this._applyClipPath(cpDim);
    }

    /**
     * Sets the dimension of the content, by setting the appropriate clippath and translate.
     * @param {number} x The new x.
     * @param {number} y The new y.
     * @param {number} w The new width.
     * @param {number} h The new height.
     * @param {number} r The new border radius.
     */
    setDimensions(x, y, w, h, r) {
      const cpDim = this._getClipPathDim({ x: x, y: y, w: w, h: h, r: r });
      this.setTranslate(cpDim.translateX, cpDim.translateY);
      this._applyClipPath(cpDim);
    }
  }

  /**
   * Class representing a task, which manages a collection
   * of elements (the main shape, baseline, progress, etc).
   * @param {Gantt} gantt The gantt component
   * @param {DvtGanttTaskNode} container The containing task node
   * @class
   * @constructor
   */
  class DvtGanttTask {
    constructor(gantt, container) {
      this._gantt = gantt;
      this._container = container;
    }

    /**
     * Gets the gantt
     * @return {Gantt} The gantt
     */
    getGantt() {
      return this._gantt;
    }

    /**
     * Gets the parent task node.
     * @return {DvtGanttTaskNode} the parent task node.
     */
    getContainer() {
      return this._container;
    }

    /**
     * Gets a particular task shape
     * @param {string} shapeType The shape type
     * @return {DvtGanttTaskShape} the main shape
     */
    getShape(shapeType) {
      if (shapeType === 'main') {
        return this._mainShape;
      }
      if (shapeType === 'progress') {
        return this._progressShape;
      }
      if (shapeType === 'baseline') {
        return this._baselineShape;
      }
      if (shapeType === 'overtime') {
        return this._overtimeShape;
      }
      if (shapeType === 'downtime') {
        return this._downtimeShape;
      }
      if (shapeType === 'attribute') {
        return this._attributeShape;
      }
      if (shapeType === 'mainResizeHandleStart') {
        return this._mainHandleStart;
      }
      if (shapeType === 'mainResizeHandleEnd') {
        return this._mainHandleEnd;
      }
      return undefined;
    }

    /**
     * Retrieve the style of the task
     * @param {string=} property If not at the options root level, the property that would yield the options containing the svgStyle
     * @return {object} the style of the task
     */
    getSvgStyle(property) {
      if (property == null) {
        return this._container.getValue('svgStyle');
      }
      return this._container.getValue(property, 'svgStyle');
    }

    /**
     * Retrieve the class name of the task
     * @param {string=} property If not at the options root level, the property that would yield the options containing the svgClassName
     * @return {string} the class name of the task
     */
    getSvgClassName(property) {
      var svgClassName;
      // TODO: Once we finish deprecating 'className' just retrieve 'svgClassName'
      if (property == null) {
        svgClassName = this._container.getValue('svgClassName');
        return svgClassName ? svgClassName : this._container.getValue('className');
      }
      svgClassName = this._container.getValue(property, 'svgClassName');
      return svgClassName ? svgClassName : this._container.getValue(property, 'className');
    }

    /**
     * Applies svgStyle and svgClassname
     * @param {DvtGanttTaskShape} taskShape The target task shape
     * @param {string=} property If not at the options root level, the property that would yield the options containing the svgStyle/svgClassName
     * @private
     */
    _applyStyles(taskShape, property) {
      const svgClassName = this.getSvgClassName(property);
      const svgStyle = this.getSvgStyle(property);

      // JET-48762: We need to ensure updated default style classes are applied on every render.
      taskShape.applyStyleClasses(svgClassName);

      if (svgStyle) {
        taskShape.setStyle(svgStyle);
      }
    }

    /**
     * Applies a clippath shaped to the main shape on the task artifacts container.
     */
    _applyMainContainerClippath() {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      if (!isRTL || dvt.Agent.browser === 'firefox') {
        // In Firefox only, the CSS clip-path path's reference coordinate is the same
        // as that of SVG (in all other browsers, the reference coordinate is relative
        // to the rendered mainContainer bounding box).
        // So in both RTL and LTR, the mainShape's path command should be used.
        this._mainContainer.setStyle({ clipPath: `path('${this._mainShape.getCmds()}')` });
      } else {
        // In all browsers (except Firefox), negative path values as clip-paths don't work.
        // In RTL the mainShape's path contains negative values, so apply
        // a transformed equivalent path with all positive values instead.
        var width = this._mainShape.getWidth();
        this._mainContainer.setStyle({
          clipPath: `path('${this._mainShape.generateCmd(
          this._mainShape.getX() + width,
          this._mainShape.getY(),
          width,
          this._mainShape.getHeight(),
          this._mainShape.getBorderRadius()
        )}')`
        });
      }
    }

    /**
     * Whether the task element should be shown as a milestone
     * @param {string} elementType The task element in question
     * @return {boolean} whether the task element should be shown as a milestone
     */
    isMilestone(elementType) {
      var start,
        end,
        type = this._container.getValue('type');

      if (type === 'milestone') {
        return true;
      } else if (type === 'auto') {
        if (
          elementType === 'mainDragFeedback' ||
          DvtGanttTaskShape.MAIN_TYPES.indexOf(elementType) > -1
        ) {
          start = this._container.getValue('start');
          end = this._container.getValue('end');
        } else if (DvtGanttTaskShape.BASELINE_TYPES.indexOf(elementType) > -1) {
          start = this._container.getValue('baseline', 'start');
          end = this._container.getValue('baseline', 'end');
        }
        return start != null && start == end;
      }
      return false;
    }

    /**
     * Whether the task element should be shown as a summary
     * @param {string} elementType The task element in question
     * @return {boolean} whether the task element should be shown as a summary
     */
    isSummary(elementType) {
      // For now, whether a task is displayed as a summary is purely based on whether task type is 'summary'
      return elementType === 'main' && this._container.getValue('type') === 'summary';
    }

    /**
     * Gets positional information given start and end
     * @param {number} start
     * @param {number} end
     * @return {object} object containing positional information
     */
    getTimeSpanDimensions(start, end) {
      var ganttMinTime = this._gantt.getStartTime(),
        ganttMaxTime = this._gantt.getEndTime(),
        ganttWidth = this._gantt.getContentLength(),
        isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx()),
        startPos,
        endPos;

      if (!(start == null && end == null)) {
        startPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(ganttMinTime, ganttMaxTime, start, ganttWidth);
        endPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(ganttMinTime, ganttMaxTime, end, ganttWidth);

        if (isRTL) {
          startPos = ganttWidth - startPos;
          endPos = ganttWidth - endPos;
        }

        return { startPos: startPos, endPos: endPos, distance: endPos - startPos };
      }
      return null;
    }

    /**
     * Gets the fill color of the task main shape
     * @return {object} an object containing the following information:
     *                  'fill': the fill property of the task
     *                  'filter': the filter property of the task
     *                  'computedFill': the *actual* fill of the task, after the default tint/shade filter is applied
     */
    getFillColor() {
      // Current design: fill color refers to main shape's fill color
      // Note cached value is cleared every new render in renderMain()
      if (this._fillColor == null) {
        if (this._mainShape == null) {
          return null;
        }
        this._fillColor = this._mainShape.getFillColor();
      }
      return this._fillColor;
    }

    /**
     * Gets the final height of the task (animation independent value)
     * @param {boolean=} excludeProgress Whether to exclude the progress height in the calculation
     * @return {number} The final height of the task in pixels
     */
    getFinalHeight(excludeProgress) {
      var taskObj = this._container.getLayoutObject();
      return excludeProgress ? taskObj['overallHeightNoProgress'] : taskObj['overallHeight'];
    }

    /**
     * Shows the task effects
     * @param {string} effectType The effect type (selected, hover, or focus)
     */
    showEffect(effectType) {
      this.showMainEffect(effectType);
      if (effectType === 'selected') {
        var taskNode = this._container;
        var rowNode = taskNode.getRowNode();
        rowNode.showEffect('selected');
      }
    }

    /**
     * Removes the task effects
     * @param {string} effectType The effect type (selected, hover, or focus)
     * @param {boolean=} enforceDOMLayering Whether to re-layer the DOM, which can be expensive. Defaults to true.
     */
    removeEffect(effectType, enforceDOMLayering) {
      this.removeMainEffect(effectType, enforceDOMLayering);
      if (effectType === 'selected') {
        var taskNode = this._container;
        var rowNode = taskNode.getRowNode();
        rowNode.removeEffect('selected');
      }
    }

    /**
     * Renders the elements that make up the task
     * @param {boolean} bUpdateCustomContent Whether to do a full custom content re-render if it already exists.
     */
    render(bUpdateCustomContent) {
      // Task elements y positioning depends on progress bar height.
      var progressHeight = this._container.getValue('progress', 'height');

      // Rendering in this order to ensure desired stacking on initial render
      this.renderBaseline(progressHeight);
      this.renderMain(progressHeight, bUpdateCustomContent);
      this.renderProgress(progressHeight);
      this.renderOvertime();
      this.renderDowntime();
      this.renderAttribute();
      if (
        this._container.getValue('type') === 'summary' &&
        this._mainShape &&
        this._gantt.getCtx().getThemeBehavior() === 'alta'
      ) {
        // summary shapes should be on top of all non-custom content (in Alta only)
        this._container.addChild(this._mainShape);
      }
      if (this._mainCustomContent) {
        // custom content should be on top of everything
        this._container.addChild(this._mainCustomContent);
      }
    }

    /**
     * Returns whether custom content is provided on top of the main shape.
     * @return {boolean} true if content is from provided custom renderer, false otherwise.
     */
    isMainCustomContent() {
      var options = this._gantt.getOptions();
      return options.taskContent && options.taskContent.renderer;
    }

    /**
     * Gets the render state of a particular task element
     * @param {string} shapeType
     * @return {string} the render state
     */
    getRenderState(shapeType) {
      if (shapeType === 'main') {
        return this._mainShape.getRenderState();
      }
      if (shapeType === 'progress') {
        return this._progressShape.getRenderState();
      }
      if (shapeType === 'baseline') {
        return this._baselineShape.getRenderState();
      }
      if (shapeType === 'overtime') {
        return this._overtimeShape.getRenderState();
      }
      if (shapeType === 'downtime') {
        return this._downtimeShape.getRenderState();
      }
      if (shapeType === 'attribute') {
        return this._attributeShape.getRenderState();
      }
      return undefined;
    }

    /**
     * Renders the baseline shape of the task.
     * @param {number} progressHeight The height of the progress bar, necessary for relative y positioning.
     */
    renderBaseline(progressHeight) {
      var isMilestone,
        options = this._gantt.getOptions(),
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
        baselineDim = this.getTimeSpanDimensions(
          baselineStart,
          this._container.getValue('type') === 'milestone' && baselineStart != baselineEnd
            ? baselineStart
            : baselineEnd
        );
        if (baselineDim) {
          // Determine offset from main element
          offsetDim = this.getTimeSpanDimensions(this._container.getValue('start'), baselineStart);

          isMilestone = this.isMilestone('baseline');

          // Calculate final dimensions
          x = offsetDim ? offsetDim['distance'] : 0;
          width = Math.abs(baselineDim['distance']);
          height = this._container.getValue('baseline', 'height');
          yOffset = isMilestone
            ? Math.max(this._container.getValue('height'), height) +
              DvtGanttStyleUtils.getMilestoneBaselineYOffset(options) -
              height
            : this._container.getValue('height') + DvtGanttStyleUtils.getBaselineMarginTop(options);
          y = Math.max(0, (progressHeight - this._container.getValue('height')) / 2) + yOffset;
          borderRadius = !isMilestone
            ? baselineProps['borderRadius']
            : options._resources.milestoneBaselineBorderRadius;

          // element doesn't exist in DOM already
          if (this._baselineShape == null) {
            this._baselineShape = new DvtGanttTaskShape(
              this._gantt.getCtx(),
              x,
              y,
              width,
              height,
              borderRadius,
              this,
              'baseline'
            );
            if (isMilestone) {
              // Ensure baseline milestone is behind actual milestone. Slight performance hit to ensure this, so don't bother for bar case.
              this._container.addChildAt(this._baselineShape, 0);
            } else {
              this._container.addChild(this._baselineShape); // Layering doesn't matter for bar case because there's no overlap.
            }
            this._baselineShape.setRenderState('add');
          } else {
            this._baselineShape.setRenderState('exist');
            if (isMilestone) {
              // case where was bar baseline, but turned to milestone baseline on rerender, then make sure it's behind everything
              this._container.addChildAt(this._baselineShape, 0);
            }
          }

          // Since final dimensions are not applied until after animations (if any), store
          // them so that they can be retrieved for calculating final dimensions for other elements
          this._baselineShape.setFinalWidth(width);
          this._baselineShape.setFinalHeight(height);
          this._baselineShape.setFinalX(x);
          this._baselineShape.setFinalY(y);

          onRenderEnd = () => {
            // Apply styles (default classes handled by DvtGanttTaskShape instance)
            self._applyStyles(self._baselineShape, 'baseline');
          };

          finalStates = {
            x: x,
            y: y,
            w: width,
            h: height,
            r: borderRadius
          };
          this._gantt
            .getAnimationManager()
            .preAnimateTaskBaseline(this, this._baselineShape, finalStates, onRenderEnd);
        } else {
          this.removeBaseline();
        }
      } else {
        this.removeBaseline();
      }
    }

    /**
     * Removes the baseline shape.
     */
    removeBaseline() {
      var self = this,
        onRemoveEnd;
      if (this._baselineShape) {
        onRemoveEnd = () => {
          self._container.removeChild(self._baselineShape);
          self._baselineShape = null;
        };
        this._gantt
          .getAnimationManager()
          .preAnimateTaskBaselineRemove(this._baselineShape, onRemoveEnd);
      }
    }

    /**
     * Renders the main shape of the task
     * @param {number} progressHeight The height of the progress bar, necessary for relative y positioning.
     * @param {boolean} bUpdateCustomContent Whether to do a full custom content re-render if it already exists.
     */
    renderMain(progressHeight, bUpdateCustomContent) {
      var taskProps = this._container.getData(),
        taskHeight = this._container.getValue('height'),
        start = this._container.getValue('start'),
        end = this._container.getValue('end'),
        context = this._gantt.getCtx(),
        isRTL = dvt.Agent.isRightToLeft(context),
        theme = context.getThemeBehavior(),
        self = this,
        finalStates,
        options = this._gantt.getOptions(),
        onRenderEnd,
        mainDim,
        x,
        y,
        width,
        height,
        borderRadius,
        isMilestone,
        rawBorderRadius,
        aggregationState,
        isViewportDensityHigh;

      if (taskProps) {
        // If type is "milestone", and if 'start' and 'end' values are specified and unequal, the 'start' value is used to evaluate position.
        mainDim = this.getTimeSpanDimensions(
          start,
          this._container.getValue('type') === 'milestone' && start != end ? start : end
        );
        if (mainDim) {
          // Calculate final dimensions
          x = 0;
          y = Math.max(0, (progressHeight - taskHeight) / 2);
          width = Math.abs(mainDim['distance']);
          // (Alta only) Summary task case, want the summary task shape to take on the full height
          height =
            this.isSummary('main') && theme === 'alta'
              ? this._container.getFinalHeight(true)
              : taskHeight;
          isMilestone = this.isMilestone('main');
          isViewportDensityHigh = this._gantt.getViewportDensity() > 1;

          // Get border radius. If task aggregation is on, assume given border radius is a singular value rather than a multi value shorthand, and override accordingly:
          // If viewport density is high though, turn off border radius for better performance.
          rawBorderRadius = !isMilestone
            ? this._container.getValue('borderRadius')
            : options._resources.milestoneBorderRadius;
          if (rawBorderRadius === '0' || rawBorderRadius === '0px' || isViewportDensityHigh) {
            borderRadius = '0';
          } else {
            aggregationState = this._container.getLayoutObject().aggregation;
            switch (aggregationState) {
              case 'stackStart':
                borderRadius = !isRTL
                  ? `${rawBorderRadius} 0px 0px ${rawBorderRadius}`
                  : `0px ${rawBorderRadius} ${rawBorderRadius} 0px`;
                break;
              case 'stackMiddle':
                borderRadius = '0';
                break;
              case 'stackEnd':
                borderRadius = !isRTL
                  ? `0px ${rawBorderRadius} ${rawBorderRadius} 0px`
                  : `${rawBorderRadius} 0px 0px ${rawBorderRadius}`;
                break;
              case 'stackSolo':
              default: // no aggregation
                borderRadius = rawBorderRadius;
            }
          }

          if (this._mainShape == null) {
            // element doesn't exist in DOM already
            // If viewport density is high, don't render the white background for better performance.
            if (theme !== 'alta' && !isViewportDensityHigh) {
              this._mainBackgroundShape = new DvtGanttTaskShape(
                context,
                x,
                y,
                width,
                height,
                borderRadius,
                this,
                'mainBackground'
              );
              this._container.addChild(this._mainBackgroundShape);
            }
            this._mainShape = new DvtGanttTaskShape(
              context,
              x,
              y,
              width,
              height,
              borderRadius,
              this,
              'main'
            );
            this._container.addChild(this._mainShape);
            this._mainShape.setRenderState('add');
          } else {
            this._mainShape.setRenderState('exist');
            if (theme !== 'alta') {
              if (isViewportDensityHigh) {
                // If viewport density is high, but there's a white background, remove it for better performance
                if (this._mainBackgroundShape) {
                  this._container.removeChild(this._mainBackgroundShape);
                  this._mainBackgroundShape = null;
                }
              } else if (!this._mainBackgroundShape) {
                // If viewport density is low, but there's no white background, add it right behind the main shape
                this._mainBackgroundShape = new DvtGanttTaskShape(
                  context,
                  x,
                  y,
                  width,
                  height,
                  borderRadius,
                  this,
                  'mainBackground'
                );
                this._container.addChildAt(
                  this._mainBackgroundShape,
                  this._container.getChildIndex(this._mainShape)
                );
              }
            }
          }

          // Since final dimensions are not applied until after animations (if any), store
          // them so that they can be retrieved for calculating final dimensions for other elements
          this._mainShape.setFinalWidth(width);
          this._mainShape.setFinalHeight(height);
          this._mainShape.setFinalX(x);
          this._mainShape.setFinalY(y);

          // render any custom content
          if (this.isMainCustomContent() && this._mainShape.getRenderState() === 'add') {
            if (this._mainCustomContent) {
              this._mainCustomContent.destroy();
            }
            this._mainCustomContent = new DvtGanttTaskContent(this._gantt, this);
            this._mainCustomContent.render(false);
          }

          // Construct container for task elements such as progress, downtime, overtime, attribute bar, etc.
          // with a clippath of the main shape.
          // Only do this if applicable; otherwise the empty containers aggravate performance.
          var hasAttribute = this._container.getValue('attribute', 'rendered') === 'on';
          var hasProgress = this.getProgressValue() != null;
          var hasDowntime =
            this._container.getValue('downtime', 'start') != null ||
            this._container.getValue('downtime', 'end') != null;
          var hasOvertime =
            this._container.getValue('overtime', 'start') != null ||
            this._container.getValue('overtime', 'end') != null;
          if (
            theme !== 'alta' &&
            !isMilestone &&
            borderRadius !== '0' &&
            (hasAttribute || hasProgress || hasDowntime || hasOvertime)
          ) {
            if (this._mainContainer == null) {
              this._mainContainer = new dvt.Container(context);
              // for CSS clip-path to work as expected, the this._mainContainer's bounding box need to match the mainShape's bounding box.
              // To ensure this, render a hidden rect that matches the expected bounding box.
              this._mainContainerSupport = new dvt.Rect(
                this._gantt.getCtx(),
                isRTL ? -width : 0,
                0,
                width,
                height
              );
              this._mainContainerSupport.setVisible(false);
              this._mainContainer.addChild(this._mainContainerSupport);
              this._applyMainContainerClippath();
              this._container.addChild(this._mainContainer);
            }
          } else if (this._mainContainer != null) {
            this._container.removeChild(this._mainContainer);
            this._mainContainer = null;
            this._mainContainerSupport = null;
          }

          // Called at the end of animation (if any)
          onRenderEnd = () => {
            // Apply styles (default classes handled by DvtGanttTaskShape instance)
            self._fillColor = null; // clear cached fill color
            self._applyStyles(self._mainShape);

            // Render final custom content
            if (
              bUpdateCustomContent &&
              self._mainCustomContent &&
              self._mainShape.getRenderState() === 'exist'
            ) {
              self._mainCustomContent.render(false);
            }
          };

          finalStates = {
            x: x,
            y: y,
            w: width,
            h: height,
            r: borderRadius
          };
          this._gantt.getAnimationManager().preAnimateTaskMain(this, finalStates, onRenderEnd);
        } else {
          this.removeMain();
        }
      } else {
        this.removeMain();
      }
    }

    /**
     * Renders the main shape effect
     * @param {string} effectType The effect type (selected, hover, or focus)
     */
    showMainEffect(effectType) {
      // Get main shape dimensions
      var x = this._mainShape.getX(),
        y = this._mainShape.getY(),
        w = this._mainShape.getWidth(),
        h = this._mainShape.getHeight(),
        r = this._mainShape.getBorderRadius();

      // Layer given task node over all other tasks,
      // while keeping all tasks with overlap behavior 'overlay' at the very top
      var floatTaskToTop = (taskNode) => {
        var taskNodeParent = taskNode.getParent();
        // The task may be out of view and not in the DOM, in which case there's no need to float it to the top
        if (taskNodeParent == null) {
          return;
        }
        var rowNode = taskNode.getRowNode();
        var rowObj = rowNode.getLayoutObject();
        var taskObj = taskNode.getLayoutObject();
        var earliestOverlayTaskObj = rowObj['earliestOverlayTaskObj'];
        if (earliestOverlayTaskObj && taskObj['_overlayBehavior'] !== 'overlay') {
          var earliestOverlayTaskNode = earliestOverlayTaskObj['node'];
          if (earliestOverlayTaskNode && earliestOverlayTaskNode.getParent()) {
            var earliestOverlayTaskNodeInd = taskNodeParent.getChildIndex(earliestOverlayTaskNode);
            taskNodeParent.addChildAt(taskNode, earliestOverlayTaskNodeInd - 1);
          } else {
            // earliest overlay task not in DOM. Just append current task to the end.
            taskNodeParent.addChild(taskNode);
          }
        } else {
          taskNodeParent.addChild(taskNode);
        }
      };

      if (effectType === 'selected') {
        if (this._mainSelectShape == null) {
          this._mainSelectShape = new DvtGanttTaskShape(
            this._gantt.getCtx(),
            x,
            y,
            w,
            h,
            r,
            this,
            'mainSelect'
          );

          // must be inserted before the main shape
          this._container.addChildAt(this._mainSelectShape, 0);

          // Rerender custom content if any
          if (this._mainCustomContent) {
            this._mainCustomContent.render(false);
          }

          // Layer this taskNode in front of all other taskNodes in the row (see )
          floatTaskToTop(this._container);
        }
      } else if (effectType === 'hover' || effectType === 'focus') {
        if (this._mainHoverShape == null) {
          var shapeType = effectType === 'hover' ? 'mainHover' : 'mainFocus';
          this._mainHoverShape = new DvtGanttTaskShape(
            this._gantt.getCtx(),
            x,
            y,
            w,
            h,
            r,
            this,
            shapeType
          );

          // must be inserted before the shape and after selected effect (if any)
          // easiest way to gaurantee this would be to insert immediately before main shape
          this._container.addChildAt(
            this._mainHoverShape,
            this._container.getChildIndex(this._mainShape)
          );

          // Rerender custom content if any
          if (this._mainCustomContent) {
            this._mainCustomContent.render(effectType === 'hover');
          }

          // Layer this taskNode in front of all other taskNodes in the row (see )
          // but only if not in task aggregation mode--we don't want the hovered task going over
          // the adjacent selected task's selection border
          var options = this._gantt.getOptions();
          if (options.taskAggregation !== 'on') {
            floatTaskToTop(this._container);
          }
        }
      }

      // Ensure effect shapes are highlighted if the main shape is highlighted
      if (this._mainShape.isHighlighted()) {
        this._mainSelectShape && this._mainSelectShape.highlight();
        this._mainHoverShape && this._mainHoverShape.highlight();
      }
    }

    /**
     * Removes the main shape effect
     * @param {string} effectType The effect type (selected, hover, or focus)
     * @param {boolean=} enforceDOMLayering Whether to re-layer the DOM, which can be expensive. Defaults to true.
     *  This parameter is a no-op if task aggregation mode is on.
     */
    removeMainEffect(effectType, enforceDOMLayering) {
      var isTaskAggregationMode = this._gantt.getOptions().taskAggregation === 'on';
      enforceDOMLayering =
        (enforceDOMLayering === undefined ? true : enforceDOMLayering) && !isTaskAggregationMode;

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
      }

      // Rerender custom content if any
      if (this._mainCustomContent) {
        this._mainCustomContent.render(false);
      }

      // Attempt to insert task back into render order, while making sure selected tasks are above it.
      if (enforceDOMLayering) {
        var currentRowNode = this._container.getRowNode();
        var rowTasks = currentRowNode.getRenderOrderTaskObjs();
        if (rowTasks.length < 2) {
          return;
        }

        var containerParent = this._container.getParent();
        if (!containerParent) {
          // tasknode no longer in DOM, so no need to continue.
          // This can happen if the task node became out of view e.g. after user panning.
          return;
        }
        var taskObj = this._container.getLayoutObject();
        var taskNode = this._container;
        // renderIndex should never be -1
        var renderIndex = rowTasks.indexOf(taskObj);
        for (var i = renderIndex - 1; i >= 0; i--) {
          var beforeTaskNode = rowTasks[i].node;
          if (beforeTaskNode && !beforeTaskNode.isSelected() && beforeTaskNode.getParent()) {
            var beforeTaskNodeIndex = containerParent.getChildIndex(beforeTaskNode);
            // beforeTaskNodeIndex should not be -1 due to getParent() check
            containerParent.addChildAt(taskNode, beforeTaskNodeIndex);
            return;
          }
        }
        containerParent.addChildAt(taskNode, 0);
      }
    }

    /**
     * Gets the width of the main shape
     * @return {number} The width of the main shape
     */
    getMainWidth() {
      return this._mainShape.getWidth();
    }

    /**
     * Sets the width of the main container clippath support bar.
     * @param {number} width The new width.
     * @private
     */
    _setMainContainerSupportWidth(width) {
      const isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      if (isRTL) {
        this._mainContainerSupport.setX(-width);
      }
      this._mainContainerSupport.setWidth(width);
    }

    /**
     * Sets the width of the main shape
     * @param {number} width The width of the main shape
     */
    setMainWidth(width) {
      this._mainShape.setWidth(width);
      if (this._mainBackgroundShape) {
        this._mainBackgroundShape.setWidth(width);
      }
      if (this._mainSelectShape) {
        this._mainSelectShape.setWidth(width);
      }
      if (this._mainHoverShape) {
        this._mainHoverShape.setWidth(width);
      }
      if (this._mainCustomContent) {
        this._mainCustomContent.setWidth(width);
      }
      if (this._mainContainer) {
        this._applyMainContainerClippath();
      }
      if (this._mainContainerSupport) {
        this._setMainContainerSupportWidth(width);
      }
    }

    /**
     * Gets the height of the main shape
     * @return {number} The height of the main shape
     */
    getMainHeight() {
      return this._mainShape.getHeight();
    }

    /**
     * Sets the height of the main shape
     * @param {number} height The height of the main shape
     */
    setMainHeight(height) {
      this._mainShape.setHeight(height);
      if (this._mainBackgroundShape) {
        this._mainBackgroundShape.setHeight(height);
      }
      if (this._mainSelectShape) {
        this._mainSelectShape.setHeight(height);
      }
      if (this._mainHoverShape) {
        this._mainHoverShape.setHeight(height);
      }
      if (this._mainCustomContent) {
        this._mainCustomContent.setHeight(height);
      }
      if (this._mainContainer) {
        this._applyMainContainerClippath();
      }
      if (this._mainContainerSupport) {
        this._mainContainerSupport.setHeight(height);
      }
    }

    /**
     * Gets the x of the main shape
     * @return {number} The x of the main shape
     */
    getMainX() {
      return this._mainShape.getX();
    }

    /**
     * Sets the x of the main shape
     * @param {number} x The x of the main shape
     */
    setMainX(x) {
      this._mainShape.setX(x);
      if (this._mainBackgroundShape) {
        this._mainBackgroundShape.setX(x);
      }
      if (this._mainSelectShape) {
        this._mainSelectShape.setX(x);
      }
      if (this._mainHoverShape) {
        this._mainHoverShape.setX(x);
      }
      if (this._mainCustomContent) {
        this._mainCustomContent.setX(x);
      }
      if (this._mainContainer) {
        this._applyMainContainerClippath();
      }
    }

    /**
     * Gets the y of the main shape
     * @return {number} The y of the main shape
     */
    getMainY() {
      return this._mainShape.getY();
    }

    /**
     * Sets the y of the main shape
     * @param {number} y The y of the main shape
     */
    setMainY(y) {
      this._mainShape.setY(y);
      if (this._mainBackgroundShape) {
        this._mainBackgroundShape.setY(y);
      }
      if (this._mainSelectShape) {
        this._mainSelectShape.setY(y);
      }
      if (this._mainHoverShape) {
        this._mainHoverShape.setY(y);
      }
      if (this._mainCustomContent) {
        this._mainCustomContent.setY(y);
      }
      if (this._mainContainer) {
        this._applyMainContainerClippath();
      }
    }

    /**
     * Gets the border radius of the main shape
     * @return {string} The border radius of the main shape
     */
    getMainBorderRadius() {
      return this._mainShape.getBorderRadius();
    }

    /**
     * Sets the border radius of the main shape
     * @param {string} r The border radius of the main shape
     */
    setMainBorderRadius(r) {
      this._mainShape.setBorderRadius(r);
      if (this._mainBackgroundShape) {
        this._mainBackgroundShape.setBorderRadius(r);
      }
      if (this._mainSelectShape) {
        this._mainSelectShape.setBorderRadius(r);
      }
      if (this._mainHoverShape) {
        this._mainHoverShape.setBorderRadius(r);
      }
      if (this._mainCustomContent) {
        this._mainCustomContent.setBorderRadius(r);
      }
      if (this._mainContainer) {
        this._applyMainContainerClippath();
      }
    }

    /**
     * Sets the dimension of the main shape all at once
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {string} r
     */
    setMainDimensions(x, y, w, h, r) {
      this._mainShape.setDimensions(x, y, w, h, r);
      if (this._mainBackgroundShape) {
        this._mainBackgroundShape.setDimensions(x, y, w, h, r);
      }
      if (this._mainSelectShape) {
        this._mainSelectShape.setDimensions(x, y, w, h, r);
      }
      if (this._mainHoverShape) {
        this._mainHoverShape.setDimensions(x, y, w, h, r);
      }
      if (this._mainCustomContent) {
        this._mainCustomContent.setDimensions(x, y, w, h, r);
      }
      if (this._mainContainer) {
        this._applyMainContainerClippath();
      }
      if (this._mainContainerSupport) {
        this._setMainContainerSupportWidth(w);
        this._mainContainerSupport.setHeight(h);
      }
    }

    /**
     * Removes the main shape
     */
    removeMain() {
      var self = this,
        onRemoveEnd;
      if (this._mainShape) {
        onRemoveEnd = () => {
          // Remove any custom content
          if (self._mainCustomContent) {
            self._mainCustomContent.destroy();
            self._mainCustomContent = null;
          }

          // Remove main shapes
          self.removeMainEffect('selected', false);
          if (self._mainBackgroundShape) {
            self._container.removeChild(self._mainBackgroundShape);
            self._mainBackgroundShape = null;
          }
          self._container.removeChild(self._mainShape);
          self._mainShape = null;

          // remove task elements such as progress, downtime, overtime, attribute, etc.
          if (self._mainContainer) {
            self._container.removeChild(self._mainContainer);
            self._mainContainer = null;
          }
        };
        this._gantt
          .getAnimationManager()
          .preAnimateTaskMainRemove(
            this._mainShape,
            this._mainBackgroundShape,
            this._mainSelectShape,
            this._mainHoverShape,
            this._mainCustomContent,
            this._mainContainer,
            onRemoveEnd
          );
      }
    }

    /**
     * Gets the progress value.
     * @return {number} The progress value. Null if invalid.
     */
    getProgressValue() {
      var progressValue = this._container.getValue('progress', 'value');

      if (!this.isMilestone('main') && typeof progressValue === 'number') {
        return progressValue;
      }
      return null;
    }

    /**
     * Renders the progress shape of the task.
     * @param {number} progressHeight The height of the progress bar in pixels.
     */
    renderProgress(progressHeight) {
      var taskHeight = this._container.getValue('height'),
        progressValue = this.getProgressValue(),
        self = this,
        onRenderEnd,
        finalStates,
        x,
        y,
        width,
        borderRadius,
        type;

      if (progressValue !== null && this._mainShape && !this.isMilestone('main')) {
        // Calculate final dimensions
        x = 0;
        y = Math.max(0, (taskHeight - progressHeight) / 2);
        width = progressValue * this._mainShape.getFinalWidth();
        borderRadius = this._container.getValue('progress', 'borderRadius');

        type = 'progress';
        if (progressValue === 0) {
          type = 'progressZero';
        } else if (progressValue === 1) {
          type = 'progressFull';
        }

        if (this._progressShape == null) {
          // element doesn't exist in DOM already
          this._progressShape = new DvtGanttTaskShape(
            this._gantt.getCtx(),
            x,
            y,
            width,
            progressHeight,
            borderRadius,
            this,
            type
          );
          this._progressShape.setRenderState('add');
        } else {
          this._progressShape.setType(type);
          this._progressShape.setRenderState('exist');
        }
        var container = this._mainContainer || this._container;
        container.addChild(this._progressShape);

        this._progressShape.setFinalWidth(width);
        this._progressShape.setFinalHeight(progressHeight);
        this._progressShape.setFinalX(x);
        this._progressShape.setFinalY(y);

        onRenderEnd = () => {
          // Apply styles (default classes handled by DvtGanttTaskShape instance)
          self._applyStyles(self._progressShape, 'progress');
        };

        finalStates = {
          x: x,
          y: y,
          w: width,
          h: progressHeight,
          r: borderRadius
        };
        this._gantt
          .getAnimationManager()
          .preAnimateTaskProgress(this, this._progressShape, finalStates, onRenderEnd);
      } else {
        this.removeProgress();
      }
    }

    /**
     * Removes the progress shape.
     */
    removeProgress() {
      var self = this,
        onRemoveEnd;
      if (this._progressShape) {
        onRemoveEnd = () => {
          if (self._progressShape) {
            self._progressShape.removeFromParent();
            self._progressShape = null;
          }
        };
        this._gantt
          .getAnimationManager()
          .preAnimateTaskProgressRemove(this._progressShape, onRemoveEnd);
      }
    }

    /**
     * Renders the overtime shape of the task.
     */
    renderOvertime() {
      var self = this;
      if (this._mainShape && !this.isMilestone('main')) {
        var start = this._container.getValue('overtime', 'start');
        var end = this._container.getValue('overtime', 'end');
        var dim = this.getTimeSpanDimensions(start, end);
        if (dim) {
          // Calculate final dimensions
          var taskStart = this._container.getValue('start');
          var taskObj = this._container.getLayoutObject();
          var x = this.getTimeSpanDimensions(taskStart, start)['distance'];
          var y = 0;
          var height = taskObj['overtimeHeight'];
          var width = Math.abs(dim['distance']);
          var borderRadius = '0';

          if (this._overtimeShape == null) {
            // element doesn't exist in DOM already
            this._overtimeShape = new DvtGanttTaskShape(
              this._gantt.getCtx(),
              x,
              y,
              width,
              height,
              borderRadius,
              this,
              'overtime'
            );
            this._overtimeShape.setRenderState('add');
          } else {
            this._overtimeShape.setRenderState('exist');
          }
          var container = this._mainContainer || this._container;
          container.addChild(this._overtimeShape);

          this._overtimeShape.setFinalWidth(width);
          this._overtimeShape.setFinalHeight(height);
          this._overtimeShape.setFinalX(x);
          this._overtimeShape.setFinalY(y);

          var onRenderEnd = () => {
            // Apply styles (default classes handled by DvtGanttTaskShape instance)
            self._applyStyles(self._overtimeShape, 'overtime');
          };

          var finalStates = {
            x: x,
            y: y,
            w: width,
            h: height,
            r: borderRadius
          };
          this._gantt
            .getAnimationManager()
            .preAnimateTaskOvertime(this, this._overtimeShape, finalStates, onRenderEnd);
        } else {
          this.removeOvertime();
        }
      } else {
        this.removeOvertime();
      }
    }

    /**
     * Removes the overtime shape.
     */
    removeOvertime() {
      var self = this,
        onRemoveEnd;
      if (this._overtimeShape) {
        onRemoveEnd = () => {
          if (self._overtimeShape) {
            self._overtimeShape.removeFromParent();
            self._overtimeShape = null;
          }
        };
        this._gantt
          .getAnimationManager()
          .preAnimateTaskOvertimeRemove(this._overtimeShape, onRemoveEnd);
      }
    }

    /**
     * Renders the downtime shape of the task.
     */
    renderDowntime() {
      var self = this;
      if (this._mainShape && !this.isMilestone('main')) {
        var start = this._container.getValue('downtime', 'start');
        var end = this._container.getValue('downtime', 'end');
        var dim = this.getTimeSpanDimensions(start, end);
        if (dim) {
          // Calculate final dimensions
          var options = this._gantt.getOptions();
          var taskStart = this._container.getValue('start');
          var taskObj = this._container.getLayoutObject();
          var x = this.getTimeSpanDimensions(taskStart, start)['distance'];
          var height = taskObj['downtimeHeight'];
          var y = this._mainShape.getFinalHeight() - height;
          var width = Math.abs(dim['distance']);
          var r = options._resources.taskDowntimeBorderRadius;
          var borderRadius = `${r} ${r} 0px 0px`;

          if (this._downtimeShape == null) {
            // element doesn't exist in DOM already
            this._downtimeShape = new DvtGanttTaskShape(
              this._gantt.getCtx(),
              x,
              y,
              width,
              height,
              borderRadius,
              this,
              'downtime'
            );
            this._downtimeShape.setRenderState('add');
          } else {
            this._downtimeShape.setRenderState('exist');
          }
          var container = this._mainContainer || this._container;
          container.addChild(this._downtimeShape);

          this._downtimeShape.setFinalWidth(width);
          this._downtimeShape.setFinalHeight(height);
          this._downtimeShape.setFinalX(x);
          this._downtimeShape.setFinalY(y);

          var onRenderEnd = () => {
            // Apply styles (default classes handled by DvtGanttTaskShape instance)
            self._applyStyles(self._downtimeShape, 'downtime');
          };

          var finalStates = {
            x: x,
            y: y,
            w: width,
            h: height,
            r: borderRadius
          };
          this._gantt
            .getAnimationManager()
            .preAnimateTaskDowntime(this, this._downtimeShape, finalStates, onRenderEnd);
        } else {
          this.removeDowntime();
        }
      } else {
        this.removeDowntime();
      }
    }

    /**
     * Removes the downtime shape.
     */
    removeDowntime() {
      var self = this,
        onRemoveEnd;
      if (this._downtimeShape) {
        onRemoveEnd = () => {
          if (self._downtimeShape) {
            self._downtimeShape.removeFromParent();
            self._downtimeShape = null;
          }
        };
        this._gantt
          .getAnimationManager()
          .preAnimateTaskDowntimeRemove(this._downtimeShape, onRemoveEnd);
      }
    }

    /**
     * Renders the attribute shape of the task.
     */
    renderAttribute() {
      var self = this;
      var rendered = this._container.getValue('attribute', 'rendered') === 'on';
      if (rendered && this._mainShape && !this.isMilestone('main')) {
        // Calculate final dimensions
        var taskObj = this._container.getLayoutObject();
        var x = 0;
        var y = 0;
        var height = taskObj['attributeHeight'];
        var width = this._mainShape.getFinalWidth();
        var borderRadius = '0';

        if (this._attributeShape == null) {
          // element doesn't exist in DOM already
          this._attributeShape = new DvtGanttTaskShape(
            this._gantt.getCtx(),
            x,
            y,
            width,
            height,
            borderRadius,
            this,
            'attribute'
          );
          this._attributeShape.setRenderState('add');
        } else {
          this._attributeShape.setRenderState('exist');
        }
        var container = this._mainContainer || this._container;
        container.addChild(this._attributeShape);

        this._attributeShape.setFinalWidth(width);
        this._attributeShape.setFinalHeight(height);
        this._attributeShape.setFinalX(x);
        this._attributeShape.setFinalY(y);

        var onRenderEnd = () => {
          // Apply styles (default classes handled by DvtGanttTaskShape instance)
          self._applyStyles(self._attributeShape, 'attribute');
        };

        var finalStates = {
          x: x,
          y: y,
          w: width,
          h: height,
          r: borderRadius
        };
        this._gantt
          .getAnimationManager()
          .preAnimateTaskAttribute(this, this._attributeShape, finalStates, onRenderEnd);
      } else {
        this.removeAttribute();
      }
    }

    /**
     * Removes the attribute shape.
     */
    removeAttribute() {
      var self = this,
        onRemoveEnd;
      if (this._attributeShape) {
        onRemoveEnd = () => {
          if (self._attributeShape) {
            self._attributeShape.removeFromParent();
            self._attributeShape = null;
          }
        };
        this._gantt
          .getAnimationManager()
          .preAnimateTaskAttributeRemove(this._attributeShape, onRemoveEnd);
      }
    }

    /**
     * Renders resize handles
     * @param {dvt.Container} container The container to render into
     */
    renderMainResizeHandles(container) {
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
        w =
          this._mainShape.getWidth() +
          this._mainShape.getPhysicalStartOffset() +
          this._mainShape.getPhysicalEndOffset();
        h = this._mainShape.getHeight();

        var self = this;
        var setHandleAriaProperties = (handle, type) => {
          if (dvt.Agent.isTouchDevice() || dvt.Agent.isEnvironmentTest()) {
            var translations = self._gantt.getOptions().translations;
            var ariaLabel =
              type === 'start'
                ? translations.taskResizeStartHandle
                : translations.taskResizeEndHandle;
            handle.setAriaRole('img');
            handle.setAriaProperty('label', ariaLabel);
          }
        };

        if (!this._mainHandleStart) {
          this._mainHandleStart = new DvtGanttTaskShape(
            this._gantt.getCtx(),
            x,
            y,
            handleWidth,
            h,
            '0',
            this,
            'mainResizeHandleStart'
          );
          setHandleAriaProperties(this._mainHandleStart, 'start');
        } else {
          this._mainHandleStart.setDimensions(x, y, handleWidth, h, '0');
        }
        container.addChild(this._mainHandleStart);

        if (!this._mainHandleEnd) {
          this._mainHandleEnd = new DvtGanttTaskShape(
            this._gantt.getCtx(),
            x + orientationFactor * (w - handleWidth),
            y,
            handleWidth,
            h,
            '0',
            this,
            'mainResizeHandleEnd'
          );
          setHandleAriaProperties(this._mainHandleEnd, 'end');
        } else {
          this._mainHandleEnd.setDimensions(
            x + orientationFactor * (w - handleWidth),
            y,
            handleWidth,
            h,
            '0'
          );
        }
        container.addChild(this._mainHandleEnd);
      }
    }

    /**
     * Remove handles
     * @param {DvtGanttTaskShape=} exclude Optional handle to exclude from removal (e.g. useful during drag)
     */
    removeHandles(exclude) {
      if (this._mainHandleStart && exclude !== this._mainHandleStart) {
        this._mainHandleStart.getParent().removeChild(this._mainHandleStart);
        this._mainHandleStart = null;
      }
      if (this._mainHandleEnd && exclude !== this._mainHandleEnd) {
        this._mainHandleEnd.getParent().removeChild(this._mainHandleEnd);
        this._mainHandleEnd = null;
      }
    }

    /**
     * "Highights" the task, i.e. for when selection-behavior is "highlightDependencies".
     */
    highlight() {
      if (this._mainShape) {
        this._mainShape.highlight();
      }
      if (this._mainSelectShape) {
        this._mainSelectShape.highlight();
      }
      if (this._mainHoverShape) {
        this._mainHoverShape.highlight();
      }
      if (this._mainCustomContent) {
        this._mainCustomContent.highlight();
      }
      if (this._baselineShape) {
        this._baselineShape.highlight();
      }
      if (this._progressShape) {
        this._progressShape.highlight();
      }
      if (this._attributeShape) {
        this._attributeShape.highlight();
      }
      if (this._overtimeShape) {
        this._overtimeShape.highlight();
      }
      if (this._downtimeShape) {
        this._downtimeShape.highlight();
      }
    }

    /**
     * "Un-Highights" the task, i.e. for when selection-behavior is "highlightDependencies".
     */
    unhighlight() {
      if (this._mainShape) {
        this._mainShape.unhighlight();
      }
      if (this._mainSelectShape) {
        this._mainSelectShape.unhighlight();
      }
      if (this._mainHoverShape) {
        this._mainHoverShape.unhighlight();
      }
      if (this._mainCustomContent) {
        this._mainCustomContent.unhighlight();
      }
      if (this._baselineShape) {
        this._baselineShape.unhighlight();
      }
      if (this._progressShape) {
        this._progressShape.unhighlight();
      }
      if (this._attributeShape) {
        this._attributeShape.unhighlight();
      }
      if (this._overtimeShape) {
        this._overtimeShape.unhighlight();
      }
      if (this._downtimeShape) {
        this._downtimeShape.unhighlight();
      }
    }
  }

  /**
   * Class that manages a task label
   * @param {Gantt} gantt The gantt component
   * @param {DvtGanttTaskNode} container The containing task node
   * @param {DvtGanttTaskShape} associatedShape The associated shape the label is for
   * @class
   * @constructor
   */
  class DvtGanttTaskLabel {
    constructor(gantt, container, associatedShape) {
      this._gantt = gantt;
      this._container = container;
      this._associatedShape = associatedShape;
      this._renderState = 'add';
    }

    /**
     * Gets the gantt
     * @return {Gantt} The gantt
     */
    getGantt() {
      return this._gantt;
    }

    /**
     * Gets the associated shape
     * @return {DvtGanttTaskShape} the associated shape
     */
    getAssociatedShape() {
      return this._associatedShape;
    }

    /**
     * Sets the associated shape
     * @param {DvtGanttTaskShape} shape The associated shape
     */
    setAssociatedShape(shape) {
      this._associatedShape = shape;
    }

    /**
     * Gets the label output text object
     * @return {dvt.OutputText} the label output text
     */
    getLabelOutputText() {
      return this._labelOutputText;
    }

    /**
     * Gets the effective label position (e.g. labelPosition = 'auto', but actually placed at 'end').
     * @return {string} The effective label position.
     */
    getEffectiveLabelPosition() {
      return this._effectiveLabelPosition;
    }

    /**
     * Gets the render state of the label
     * @return {string} the render state
     */
    getRenderState() {
      return this._renderState;
    }

    _getLabelCSSStyle(labelStyle) {
      let labelCSSStyle;
      // If labelStyle is {}; don't process it.
      if (labelStyle != null && Object.keys(labelStyle).length > 0) {
        // Get the base label style dvt.CSSStyle object. Should not grab the one from cache
        // because we're going to be modifying it.
        labelCSSStyle = DvtGanttStyleUtils.getTaskLabelStyle(this._gantt.getOptions());
        labelCSSStyle.parseInlineStyle(labelStyle);
      } else {
        // Grab the base label style dvt.CSSStyle object from cache rather than instantiating
        // a new one for performance reasons
        labelCSSStyle = this._gantt.getCache().getFromCache('baseTaskLabelCSSStyle');
      }
      return labelCSSStyle;
    }

    /**
     * Applies styles on the label
     * @param {string|object} labelStyle
     * @param {dvt.CSSStyle} labelCSSStyle Computed labelCSSStyle from _getLabelCSSStyle(labelStyle)
     * @private
     */
    _applyStyles(labelStyle, labelCSSStyle) {
      // If labelStyle is {} or labelStyle same as current styles, don't bother processing it.
      if (
        labelStyle != null &&
        Object.keys(labelStyle).length > 0 &&
        this._labelOutputText.getStyle() !== labelStyle
      ) {
        this._labelOutputText.setStyle(labelStyle); // works if style is object
      }
      // necessary for getDimension/fitText to obtain CSS style of the text
      if (this._labelOutputText.getCSSStyle() !== labelCSSStyle) {
        this._labelOutputText.setCSSStyle(labelCSSStyle);
      }
    }

    /**
     * Positions the label accordingly.
     * @param {string} effectiveLabelPosition The effective label position.
     * @private
     */
    _placeLabel(effectiveLabelPosition) {
      var labelDimensions = this._labelOutputText.getDimensions(),
        isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx()),
        shapeLeftOffset,
        shapeRightOffset,
        shapeWidth,
        options = this._gantt.getOptions(),
        padding = DvtGanttStyleUtils.getTaskPadding(options),
        margin = DvtGanttStyleUtils.getTaskLabelMargin(options),
        innerPadding = padding + margin,
        x,
        y,
        associatedShapeHeight;

      if (effectiveLabelPosition === 'progress' || effectiveLabelPosition === 'progressStart') {
        this.setAssociatedShape(this._container.getTask().getShape('progress'));
      }

      // Determine y position
      associatedShapeHeight =
        this._associatedShape.getType() === 'main' &&
        this._container.getTask().isSummary('main') &&
        this._gantt.getCtx().getThemeBehavior() === 'alta'
          ? this._container.getLayoutObject()['height']
          : this._associatedShape.getFinalHeight();
      y = this._associatedShape.getFinalY() + (associatedShapeHeight - labelDimensions.h) / 2;
      this.setFinalY(y);

      // Determine x position (calculate LTR version, then flip for RTL)
      shapeWidth = this._associatedShape.getFinalWidth();
      shapeLeftOffset = !isRTL
        ? this._associatedShape.getPhysicalStartOffset()
        : this._associatedShape.getPhysicalEndOffset();
      shapeRightOffset = !isRTL
        ? this._associatedShape.getPhysicalEndOffset()
        : this._associatedShape.getPhysicalStartOffset();
      switch (effectiveLabelPosition) {
        case 'end':
          !isRTL ? this._labelOutputText.alignLeft() : this._labelOutputText.alignRight();
          x = shapeWidth + shapeRightOffset + margin;
          break;
        case 'progress':
          !isRTL ? this._labelOutputText.alignRight() : this._labelOutputText.alignLeft();
          x = shapeWidth - innerPadding;
          break;
        case 'oProgress':
          !isRTL ? this._labelOutputText.alignLeft() : this._labelOutputText.alignRight();
          x = this._container.getTask().getShape('progress').getFinalWidth() + innerPadding;
          break;
        case 'innerStart':
        case 'progressStart':
          !isRTL ? this._labelOutputText.alignLeft() : this._labelOutputText.alignRight();
          x = -shapeLeftOffset + innerPadding;
          break;
        case 'innerEnd':
          !isRTL ? this._labelOutputText.alignRight() : this._labelOutputText.alignLeft();
          x = shapeWidth + shapeRightOffset - innerPadding;
          break;
        case 'innerCenter':
          this._labelOutputText.alignCenter();
          x = shapeWidth / 2;
          break;
        case 'start':
          !isRTL ? this._labelOutputText.alignRight() : this._labelOutputText.alignLeft();
          x = -(shapeLeftOffset + margin);
          break;
      }
      if (isRTL) {
        x = -x;
      }

      this.setFinalX(x);

      this._effectiveLabelPosition = effectiveLabelPosition;
    }

    /**
     * Gets the available width for the label at query position relative to the task.
     * @param {string} position The query position.
     * @return {object} Object containing info on available width and effective position.
     * @private
     */
    _getAvailableWidth(position) {
      var startBarrier,
        endBarrier,
        taskObj = this._container.getLayoutObject(),
        previousAdjacentTaskObj,
        nextAdjacentTaskObj,
        task = this._container.getTask(),
        nextAdjacentMilestoneBaselineTaskObj,
        previousAdjacentMilestoneBaselineTaskObj,
        previousAdjacentTaskNode,
        nextAdjacentTaskNode,
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
        padding = DvtGanttStyleUtils.getTaskPadding(this._gantt.getOptions()),
        margin = DvtGanttStyleUtils.getTaskLabelMargin(this._gantt.getOptions()),
        innerPadding = padding + margin,
        shouldConsiderProgress,
        isMilestone,
        isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx()),
        ganttWidth = this._gantt.getContentLength(),
        ganttStartPos,
        ganttEndPos,
        isPositionBlocked = false;

      // Calculate Gantt bounds
      ganttStartPos = !isRTL ? 0 : ganttWidth;
      ganttEndPos = ganttWidth - ganttStartPos;

      switch (position) {
        case 'end':
        case 'end_ABSOLUTE':
          effectivePosition = 'end';
          endBarrier = ganttEndPos;
          nextAdjacentTaskObj = taskObj.nextAdjacentTaskObj;
          nextAdjacentMilestoneBaselineTaskObj = taskObj.nextAdjMilestoneBaselineTaskObj;

          // The case where row height is set and overlapping task staggering is disabled, and the position is blocked
          if (
            nextAdjacentTaskObj &&
            nextAdjacentTaskObj.startTime < taskObj.endTime &&
            nextAdjacentTaskObj.endTime > taskObj.endTime
          ) {
            availableWidth = 0;
            break;
          }
          while (
            nextAdjacentTaskObj &&
            nextAdjacentTaskObj.startTime < taskObj.endTime &&
            nextAdjacentTaskObj.endTime < taskObj.endTime
          ) {
            nextAdjacentTaskObj = nextAdjacentTaskObj.nextAdjacentTaskObj;
          }

          if (nextAdjacentTaskObj) {
            nextAdjacentTaskNode = nextAdjacentTaskObj.node;
            if (nextAdjacentTaskNode && nextAdjacentTaskNode.getParent()) {
              endBarrier = nextAdjacentTaskNode.getTaskShapePhysicalBounds('main')['startPos'];
            } else if (
              !(nextAdjacentTaskObj.startTime == null && nextAdjacentTaskObj.endTime == null)
            ) {
              // else next node not in DOM; estimate the end barrier.
              // Unless next node is a milestone, the estimation is basically the true endBarrier value.
              var nextAdjacentDim = task.getTimeSpanDimensions(
                nextAdjacentTaskObj.startTime,
                nextAdjacentTaskObj.endTime
              );
              endBarrier = nextAdjacentDim.startPos;
            }
          }
          if (nextAdjacentMilestoneBaselineTaskObj) {
            nextAdjacentMilestoneBaselineTaskNode = nextAdjacentMilestoneBaselineTaskObj.node;
            if (
              nextAdjacentMilestoneBaselineTaskNode &&
              nextAdjacentMilestoneBaselineTaskNode.getParent()
            ) {
              endBarrier = isRTL
                ? Math.max(
                    endBarrier,
                    nextAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')[
                      'startPos'
                    ]
                  )
                : Math.min(
                    endBarrier,
                    nextAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')[
                      'startPos'
                    ]
                  );
            } else if (
              !(
                nextAdjacentMilestoneBaselineTaskObj.startTime == null &&
                nextAdjacentMilestoneBaselineTaskObj.endTime == null
              )
            ) {
              // else next node not in DOM; estimate the end barrier.
              var adjacentMilestoneBaselineStartPos = task.getTimeSpanDimensions(
                nextAdjacentMilestoneBaselineTaskObj.baselineStartTime,
                nextAdjacentMilestoneBaselineTaskObj.baselineEndTime
              ).startPos;
              endBarrier = isRTL
                ? Math.max(endBarrier, adjacentMilestoneBaselineStartPos)
                : Math.min(endBarrier, adjacentMilestoneBaselineStartPos);
            }
          }
          availableWidth =
            Math.abs(this._container.getTaskShapePhysicalBounds('main')['endPos'] - endBarrier) -
            2 * margin;
          break;
        case 'innerCenter':
        case 'innerStart':
        case 'innerEnd':
          // The case where row height is set and overlapping task staggering is disabled, and the position is blocked
          // Only consider this case in the array label position cases. In the absolute cases, and all innerStart cases,
          // just show the labels anyway.
          nextAdjacentTaskObj = taskObj.nextAdjacentTaskObj;
          if (nextAdjacentTaskObj) {
            if (position === 'innerCenter')
              isPositionBlocked =
                nextAdjacentTaskObj.startTime <
                taskObj.startTime + (taskObj.endTime - taskObj.startTime) / 2;
            else if (position === 'innerEnd')
              isPositionBlocked = nextAdjacentTaskObj.startTime < taskObj.endTime;
          }
        case 'innerCenter_ABSOLUTE':
        case 'innerStart_ABSOLUTE':
        case 'innerEnd_ABSOLUTE':
          // normalize the _ABSOLUTE positions to the effective position name
          if (position.slice(-9) === '_ABSOLUTE') position = position.slice(0, -9);

          // Progress space evaluation requires this._labeOutputText to exist
          // If this._labelOutputText doesn't exist (yet), then this method is called for initial conservative estimation purposes (for performance)
          // in which case we don't need to evaluate the progress space anyway to be conservative.
          shouldConsiderProgress =
            this._labelOutputText &&
            typeof this._container.getValue('progress', 'value') === 'number';
          isMilestone = task.isMilestone('main');
          if (!isMilestone) {
            if (isPositionBlocked) {
              availableWidth = 0;
              effectivePosition = position;
              break;
            }

            taskMainBounds = this._container.getTaskShapePhysicalBounds('main');
            insideWidth = Math.abs(taskMainBounds['endPos'] - taskMainBounds['startPos']);
            if (shouldConsiderProgress) {
              labelDimensions = this._labelOutputText.getDimensions();
              progressShape = task.getShape('progress');
              if (progressShape) {
                progressWidth = progressShape.getFinalWidth();
                progressHeight = progressShape.getFinalHeight();
              } else {
                progressWidth = 0;
                progressHeight = 0;
              }
              oProgressWidth = insideWidth - progressWidth;

              // For 'innerStart', check if we can honor that even when there's a progress
              if (position === 'innerStart') {
                availableWidth = progressWidth - 2 * innerPadding;
                if (labelDimensions.w <= availableWidth && labelDimensions.h <= progressHeight) {
                  effectivePosition = 'progressStart';
                  break;
                }
              }
              // For 'innerEnd', check if we can honor that even when there's a progress
              else if (position === 'innerEnd') {
                availableWidth = oProgressWidth - 2 * innerPadding;
                if (labelDimensions.w < availableWidth) {
                  effectivePosition = 'innerEnd';
                  break;
                }
              }

              // If 'innerCenter', or 'innerStart'/'innerEnd' can't be honored due to lack of space, do smart behavior
              if (labelDimensions.h <= progressHeight && progressWidth > oProgressWidth) {
                // Label inside progress condition
                availableWidth = progressWidth - 2 * innerPadding;
                effectivePosition = 'progress';
              } // Label inside oProgress condition
              else {
                availableWidth = oProgressWidth - 2 * innerPadding;
                effectivePosition = 'oProgress';
              }
              break;
            }
            availableWidth = insideWidth - 2 * innerPadding;
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
          previousAdjacentTaskObj = taskObj.previousAdjacentTaskObj;
          previousAdjacentMilestoneBaselineTaskObj = taskObj.previousAdjacentMilestoneBaselineTaskObj;

          // The case where row height is set and overlapping task staggering is disabled, and the position is blocked
          if (
            previousAdjacentTaskObj &&
            previousAdjacentTaskObj.endTime > taskObj.startTime &&
            previousAdjacentTaskObj.startTime < taskObj.startTime
          ) {
            availableWidth = 0;
            break;
          }

          if (previousAdjacentTaskObj) {
            previousAdjacentTaskNode = previousAdjacentTaskObj.node;
            if (previousAdjacentTaskNode && previousAdjacentTaskNode.getParent()) {
              startBarrier = previousAdjacentTaskNode.getTaskShapePhysicalBounds('main', true)[
                'endPos'
              ];
            } else if (
              !(previousAdjacentTaskObj.startTime == null && previousAdjacentTaskObj.endTime == null)
            ) {
              // else previous node not in DOM; estimate the start barrier.
              var previousAdjacentDim = task.getTimeSpanDimensions(
                previousAdjacentTaskObj.startTime,
                previousAdjacentTaskObj.endTime
              );
              startBarrier = previousAdjacentDim.endPos;
            }
          }
          if (previousAdjacentMilestoneBaselineTaskObj) {
            previousAdjacentMilestoneBaselineTaskNode = previousAdjacentMilestoneBaselineTaskObj.node;
            if (
              previousAdjacentMilestoneBaselineTaskNode &&
              previousAdjacentMilestoneBaselineTaskNode.getParent()
            ) {
              startBarrier = isRTL
                ? Math.min(
                    startBarrier,
                    previousAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')[
                      'endPos'
                    ]
                  )
                : Math.max(
                    startBarrier,
                    previousAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')[
                      'endPos'
                    ]
                  );
            } else if (
              !(
                previousAdjacentMilestoneBaselineTaskObj.startTime == null &&
                previousAdjacentMilestoneBaselineTaskObj.endTime == null
              )
            ) {
              // else next node not in DOM; estimate the end barrier.
              var adjacentMilestoneBaselineEndPos = task.getTimeSpanDimensions(
                previousAdjacentMilestoneBaselineTaskObj.baselineStartTime,
                previousAdjacentMilestoneBaselineTaskObj.baselineEndTime
              ).endPos;
              startBarrier = isRTL
                ? Math.max(startBarrier, adjacentMilestoneBaselineEndPos)
                : Math.min(startBarrier, adjacentMilestoneBaselineEndPos);
            }
          }
          availableWidth =
            Math.abs(startBarrier - this._container.getTaskShapePhysicalBounds('main')['startPos']) -
            2 * margin;
          break;
        default:
          return null;
      }
      return [effectivePosition, availableWidth];
    }

    /**
     * Preprocesses the labelPosition from options.
     * @param {string|Array} labelPosition The labelPosition from options
     * @return {Array} The sanitized array of label positions
     * @private
     */
    _preprocessLabelPosition(labelPosition) {
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
          return labelPosition.map((position) => {
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
    }

    /**
     * Process and place label accordingly based on given labelPosition from options.
     * @param {string|Array} labelPosition The processed labelPosition.
     * @return {boolean} whether position evaluation is successful
     * @private
     */
    _evaluatePosition(labelPosition) {
      var traversalCache = {},
        effectivePosition,
        availableWidth,
        labelDimensions = this._labelOutputText.getDimensions(),
        labelWidth = labelDimensions.w;

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
      }

      if (availableWidth <= 1) {
        return false;
      }

      // Truncate label if necessary
      let labelShown = true;
      if (labelWidth > availableWidth) {
        labelShown = dvt.TextUtils.fitText(
          this._labelOutputText,
          availableWidth,
          Infinity,
          this._container,
          1
        );
      }

      if (!labelShown) {
        return false;
      }

      this._placeLabel(effectivePosition);
      return true;
    }

    /**
     * Renders the task label
     */
    render() {
      var context = this._gantt.getCtx(),
        label = this._container.getValue('label'),
        labelPosition = this._container.getValue('labelPosition'),
        labelStyle = this._container.getValue('labelStyle'),
        finalStates,
        isPositionFeasible,
        self = this,
        onRenderEnd,
        styleClass = this._gantt.GetStyleClass('taskLabel');

      this._renderState = 'exist';

      if (label != null && label.length > 0 && labelPosition !== 'none' && this._associatedShape) {
        const labelCSSStyle = this._getLabelCSSStyle(labelStyle);
        const processedLabelPosition = this._preprocessLabelPosition(labelPosition);
        // If labelPosition from options is not an array, conservatively guess-timate whether the text
        // definitely fits in the available space or not; early return if definitely not for performance reasons.
        if (
          processedLabelPosition.length === 1 &&
          processedLabelPosition[0].slice(-9) === '_ABSOLUTE'
        ) {
          const availableWidth = this._getAvailableWidth(processedLabelPosition[0])[1];
          if (availableWidth <= 0) {
            this.remove();
            return;
          }
          // '|' is one of the skinniest characters there is.
          // Thus (length of '|')*(label length) is a very conservative estimate of the label width.
          const conservativeCharWidth = dvt.TextUtils.getTextStringWidth(context, '|', labelCSSStyle);
          const lowerBoundTextWidth = conservativeCharWidth * label.length;
          if (lowerBoundTextWidth > availableWidth) {
            // If it's a single character and that doesn't fit, then it can't be truncated and definitely doesn't fit.
            if (label.length === 1) {
              this.remove();
              return;
            }
            // If even the smallest possible result of truncation ("|...") doesn't fit, then bail.
            const ellipsisWidth = dvt.TextUtils.getTextStringWidth(
              context,
              dvt.TextUtils.ELLIPSIS,
              labelCSSStyle
            );
            if (conservativeCharWidth + ellipsisWidth > availableWidth) {
              this.remove();
              return;
            }
          }
        }

        if (this._labelOutputText == null) {
          this._labelOutputText = new dvt.OutputText(this._gantt.getCtx(), label, 0, 0);
          if (this._gantt.getEventManager().IsDragSupported('tasks')) {
            styleClass += ' ' + this._gantt.GetStyleClass('draggable');
          }
          this._labelOutputText.setClassName(styleClass);
          this._renderState = 'add';
        }
        // Make sure label outputtext is in the DOM, e.g. may have been removed by fitText in the previous render
        if (this._labelOutputText.getParent() == null) {
          this._container.addChild(this._labelOutputText);
        }

        this._labelOutputText.setTextString(label);

        // Apply styles; necessary before positioning because position is font size dependent
        this._applyStyles(labelStyle, labelCSSStyle);
        isPositionFeasible = this._evaluatePosition(processedLabelPosition);

        if (isPositionFeasible) {
          // Called at the end of animation (if any)
          onRenderEnd = () => {
            // Apply contrast text color depending on background color
            switch (self._effectiveLabelPosition) {
              case 'innerCenter':
              case 'innerEnd':
              case 'innerStart':
              case 'progressStart':
              case 'progress':
              case 'oProgress':
                const fillColor = self._associatedShape.getFillColor();
                if (
                  fillColor &&
                  // task fill color changed from previous render, or no contrast text color set
                  (!fillColor.fromShapeCache || !self._labelOutputText.getFill()) &&
                  // no custom text color styling set
                  (!labelStyle || !labelStyle.color)
                ) {
                  const labelColor = dvt.ColorUtils.getContrastingTextColor(fillColor.computedFill);
                  self._labelOutputText.setFill(new dvt.SolidFill(labelColor));
                }
                break;
              default:
                // Label outside the task bar. If contrast color was set in a previous render, unset it.
                if (self._labelOutputText.getFill()) {
                  self._labelOutputText.setFill();
                  // setFill() with undefined fill sets element's fill attribute to "none".
                  // Need to manually unset the fill attribute.
                  dvt.ToolkitUtils.setAttrNullNS(self._labelOutputText.getElem(), 'fill', undefined);
                }
            }
          };

          finalStates = {
            x: this.getFinalX(),
            y: this.getFinalY()
          };
          this._gantt
            .getAnimationManager()
            .preAnimateTaskLabel(this._container, finalStates, onRenderEnd);
        } else {
          this.remove();
        }
      } // if label not specified/empty/invalid or labelPosition == 'none', don't render anything. If something there before, remove it.
      else {
        this.remove();
      }
    }

    /**
     * Removes the task label
     */
    remove() {
      var self = this,
        onRemoveEnd;
      if (this._labelOutputText) {
        onRemoveEnd = () => {
          self._container.removeChild(self._labelOutputText);
          self._labelOutputText = null;
          self._effectiveLabelPosition = null;
        };
        this._gantt
          .getAnimationManager()
          .preAnimateTaskLabelRemove(this._labelOutputText, onRemoveEnd);
      }
    }

    /**
     * "Highights" the task label, i.e. for when selection-behavior is "highlightDependencies".
     */
    highlight() {
      if (this._labelOutputText && !this._isHighlighted) {
        dvt.ToolkitUtils.addClassName(
          this._labelOutputText.getElem(),
          this._gantt.GetStyleClass('taskHighlight')
        );
      }
      this._isHighlighted = true;
    }

    /**
     * "Un-Highights" the task label, i.e. for when selection-behavior is "highlightDependencies".
     */
    unhighlight() {
      if (this._labelOutputText && this._isHighlighted) {
        dvt.ToolkitUtils.removeClassName(
          this._labelOutputText.getElem(),
          this._gantt.GetStyleClass('taskHighlight')
        );
      }
      this._isHighlighted = false;
    }

    /**
     * Gets the final x (animation independent, e.g. final x after animation finishes)
     * @return {number} the final x.
     */
    getFinalX() {
      return this._finalX;
    }

    /**
     * Sets the final x
     * @param {number} x
     */
    setFinalX(x) {
      this._finalX = x;
    }

    /**
     * Gets the final y (animation independent, e.g. final y after animation finishes)
     * @return {number} the final y
     */
    getFinalY() {
      return this._finalY;
    }

    /**
     * Sets the final y
     * @param {number} y The final y
     */
    setFinalY(y) {
      this._finalY = y;
    }
  }

  /**
   * Class representing a task container (i.e. container for shapes and labels that make up a task).
   * @param {Gantt} gantt The gantt component
   * @class
   * @constructor
   * @implements {DvtKeyboardNavigable}
   * @implements {DvtSelectable}
   * @implements {DvtDraggable}
   */
  class DvtGanttTaskNode extends dvt.Container {
    constructor(gantt) {
      super(gantt.getCtx(), null);

      this._gantt = gantt;

      this._task = new DvtGanttTask(gantt, this);
      this._taskLabel = new DvtGanttTaskLabel(gantt, this);

      this._gantt.getEventManager().associate(this, this);
      this.nodeType = 'task';
    }

    /**
     * Gets the task data id.
     * @override
     */
    getId() {
      return this._taskObj['id'];
    }

    /**
     * Sets the layout object associated with this task node
     * @param {Object} taskObj Task layout object
     */
    setLayoutObject(taskObj) {
      this._taskObj = taskObj;
    }

    /**
     * Gets the layout object associated with this task node
     * @return {Object} The task layout object
     */
    getLayoutObject() {
      return this._taskObj;
    }

    /**
     * Gets the data assocaited with this task node
     * @param {boolean} isPublic Whether to retrieve a cleaned version of the data that would be publicly exposed
     * @return {Object} the data object
     */
    getData(isPublic) {
      if (isPublic) {
        return ojdvtTimecomponent.TimeComponent.sanitizeData(this._taskObj['data'], 'task');
      }
      return this._taskObj['data'];
    }

    /**
     * Gets the value of query property/subproperty of the task.
     * @param {string} property The top level property name
     * @param {string=} subProperty The subproperty name (optional)
     * @return {*} The value
     */
    getValue(property, subProperty) {
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
                value =
                  value[subProperty] != null
                    ? value[subProperty]
                    : taskDefaults['baseline'][subProperty];
            }
          }
          break;
        case 'overtime':
          value = this._taskObj['data']['overtime'];
          if (value && subProperty != null) {
            switch (subProperty) {
              case 'start':
                value = this._taskObj['overtimeStartTime'];
                break;
              case 'end':
                value = this._taskObj['overtimeEndTime'];
                break;
              default:
                value =
                  value[subProperty] != null
                    ? value[subProperty]
                    : taskDefaults['overtime'][subProperty];
            }
          }
          break;
        case 'downtime':
          value = this._taskObj['data']['downtime'];
          if (value && subProperty != null) {
            switch (subProperty) {
              case 'start':
                value = this._taskObj['downtimeStartTime'];
                break;
              case 'end':
                value = this._taskObj['downtimeEndTime'];
                break;
              default:
                value =
                  value[subProperty] != null
                    ? value[subProperty]
                    : taskDefaults['downtime'][subProperty];
            }
          }
          break;
        case 'attribute':
          value = this._taskObj['data']['attribute'];
          if (value && subProperty != null) {
            value =
              value[subProperty] != null
                ? value[subProperty]
                : taskDefaults['attribute'][subProperty];
            if (subProperty === 'shortDesc' && typeof value === 'function') {
              return value(DvtGanttTaskNode.getShortDescContext(this));
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
            value =
              value[subProperty] != null ? value[subProperty] : taskDefaults['progress'][subProperty];
          }
          break;
        default: // assume top level property access
          value =
            this._taskObj['data'][property] != null
              ? this._taskObj['data'][property]
              : taskDefaults[property];
      }
      if (property === 'shortDesc' && typeof value === 'function') {
        return value(DvtGanttTaskNode.getShortDescContext(this));
      }
      return value;
    }

    /**
     * Gets the value from sandbox data (see also getSandboxData() function description)
     * @param {string} property The top level property name
     * @param {string} subProperty The subproperty name (optional)
     * @return {*} The value
     */
    getSandboxValue(property, subProperty) {
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
    }

    /**
     * Gets a copy of node properties/data that is meant to be updated/manipulated to reflect
     * any intermediate states of a task (e.g. the state of the task feedback during drag,
     * which is not final until dragend, and can potentially be cancelled before)
     * @return {object} Mutable object of properties/data for the node.
     */
    getSandboxData() {
      if (!this._sandboxData) {
        this._sandboxData = dvt.JsonUtils.clone(
          ojdvtTimecomponent.TimeComponent.sanitizeData(this._taskObj['data'], 'task')
        );
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
        var sandboxOvertime = this._sandboxData.overtime;
        if (sandboxOvertime) {
          sandboxOvertime.start = this._taskObj.overtimeStartTime;
          sandboxOvertime.end = this._taskObj.overtimeEndTime;
        }
        var sandboxDowntime = this._sandboxData.downtime;
        if (sandboxDowntime) {
          sandboxDowntime.start = this._taskObj.downtimeStartTime;
          sandboxDowntime.end = this._taskObj.downtimeEndTime;
        }
        var sandboxProgress = this._sandboxData['progress'];
        if (sandboxProgress) {
          sandboxProgress['height'] = this._taskObj['progressHeight'];
        }
      }
      return this._sandboxData;
    }

    /**
     * Gets the row node associated with the task
     * @return {DvtGanttRowNode} the row node
     */
    getRowNode() {
      return this._taskObj['rowObj']['node'];
    }

    /**
     * Gets the gantt.
     * @return {Gantt} the gantt.
     */
    getGantt() {
      return this._gantt;
    }

    /**
     * Gets the render state
     * @return {string} the render state
     */
    getRenderState() {
      return this._taskObj['renderState'];
    }

    /**
     * Gets the chronologically previous adjacent task obj on the same row level
     * @return {object} the previous adjacent task layout obj on the same row level
     */
    getPreviousAdjacentTaskObj() {
      return this._taskObj.previousAdjacentTaskObj;
    }

    /**
     * Gets the chronologically next adjacent task obj on the same row level
     * @return {object} the next adjacent task layout obj on the same row level
     */
    getNextAdjacentTaskObj() {
      return this._taskObj.nextAdjacentTaskObj;
    }

    /**
     * Gets the chronologically previous adjacent baseline task obj on the same row level
     * @return {object} the previous adjacent task layout obj on the same row level
     */
    getPrevAdjMilestoneBaselineTaskObj() {
      return this._taskObj.prevAdjMilestoneBaselineTaskObj;
    }

    /**
     * Gets the chronologically next adjacent task obj on the same row level
     * @return {object} the next adjacent task layout obj on the same row level
     */
    getNextAdjMilestoneBaselineTaskObj() {
      return this._taskObj.nextAdjMilestoneBaselineTaskObj;
    }

    /**
     * Gets the physical start and end pos of the query task shape. Excludes task and label margins.
     * @param {string} type The shape type
     * @param {boolean=} includeLabel Whether to include label dimensions (for main shape only)
     * @return {object} object containing 'startPos' and 'endPos'
     */
    getTaskShapePhysicalBounds(type, includeLabel) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var options = this._gantt.getOptions();
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
            endPos =
              endPos +
              orientationFactor *
                (DvtGanttStyleUtils.getTaskLabelMargin(options) + labelOutputText.getDimensions().w);
          } else if (labelPosition === 'start') {
            startPos =
              startPos -
              orientationFactor *
                (DvtGanttStyleUtils.getTaskLabelMargin(options) + labelOutputText.getDimensions().w);
          }
        }
      }

      return { startPos: startPos, endPos: endPos };
    }

    /**
     * Scrolls the relevant part of the task into view.
     * @param {string=} xPriority The side in the x direction to prioritize scroll into view, one of 'start', 'end', or 'auto'. Default 'auto'.
     * @param {string=} yPriority The side in the y direction to prioritize scroll into view, one of 'top', 'bottom', or 'auto'. Default 'auto'.
     */
    scrollIntoView(xPriority, yPriority) {
      var x, y, w, h;
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var dataBody = this._gantt.getDatabody();
      var options = this._gantt.getOptions();

      // Ensure task is in the DOM
      this._gantt.getDataLayoutManager().ensureInDOM(this.getLayoutObject(), 'task');

      var keyboardDnDMode = this._gantt.getEventManager().getKeyboardDnDMode();
      var targetShape, referenceFrame;
      if (
        keyboardDnDMode === DvtGanttEventManager.KEYBOARD_MOVE &&
        this._mainDragFeedbacks &&
        this._mainDragFeedbacks.length > 0
      ) {
        targetShape = this._mainDragFeedbacks[0].getTask().getShape('main');
        referenceFrame = this._mainDragFeedbacks[0];
      } else if (
        (keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_START ||
          keyboardDnDMode === DvtGanttEventManager.KEYBOARD_RESIZE_END) &&
        this._mainResizeHandleDragFeedbacks &&
        this._mainResizeHandleDragFeedbacks.length > 0
      ) {
        targetShape = this._mainResizeHandleDragFeedbacks[0].getTask().getShape('main');
        referenceFrame = this._mainResizeHandleDragFeedbacks[0];
      } else {
        targetShape = this.getTask().getShape('main');
        targetShape = targetShape ? targetShape : this.getTask().getShape('baseline');
        referenceFrame = this;
      }
      w =
        targetShape.getWidth() +
        targetShape.getPhysicalStartOffset() +
        targetShape.getPhysicalEndOffset();
      h = targetShape.getHeight();
      x = !isRTL
        ? targetShape.getX() - targetShape.getPhysicalStartOffset()
        : targetShape.getX() - w + targetShape.getPhysicalStartOffset();
      y = targetShape.getY();
      var posInDataBody = dataBody.stageToLocal(referenceFrame.localToStage({ x: x, y: y }));
      var region = new dvt.Rectangle(posInDataBody.x, posInDataBody.y, w, h);
      this._gantt.scrollIntoView(
        region,
        xPriority,
        yPriority,
        DvtGanttStyleUtils.getRowPaddingTop(options)
      );
    }

    /**
     * @override
     */
    setTranslateX(tx) {
      // Translate a rounded value based on precision
      var precision = this._gantt.getRenderingPrecision();
      var x = precision === null ? tx : this._gantt.round(tx, precision);
      return super.setTranslateX(x);
    }

    /**
     * @override
     */
    setTranslateY(ty) {
      // Translate a rounded value based on precision
      var precision = this._gantt.getRenderingPrecision(this._gantt);
      var y = precision === null ? ty : this._gantt.round(ty, precision);
      return super.setTranslateY(y);
    }

    /**
     * @override
     */
    setTranslate(tx, ty) {
      // Translate a rounded value based on precision
      var precision = this._gantt.getRenderingPrecision(this._gantt);
      var x = precision === null ? tx : this._gantt.round(tx, precision);
      var y = precision === null ? ty : this._gantt.round(ty, precision);
      return super.setTranslate(x, y);
    }

    /**
     * "Highights" the task, i.e. for when selection-behavior is "highlightDependencies".
     * gantt.dimDatabody() should be called before this method to ensure other tasks appear dimmed.
     */
    highlight() {
      this._task.highlight();
      this._taskLabel.highlight();
    }

    /**
     * "Un-Highights" the task, i.e. for when selection-behavior is "highlightDependencies".
     */
    unhighlight() {
      this._task.unhighlight();
      this._taskLabel.unhighlight();
    }

    /**
     * Gets the dragged object during DnD (e.g. a DvtGanttTaskShape or DvtGanttTaskLabel).
     * @return {DvtGanttTaskShape|DvtGanttTaskLabel} The dragged object.
     */
    getDraggedObject() {
      return this._draggedObj;
    }

    /**
     * Sets the object dragged during Dnd (e.g. a DvtGanttTaskShape or DvtGanttTaskLabel).
     * @param {DvtGanttTaskShape|DvtGanttTaskLabel} draggedObj The dragged object.
     */
    setDraggedObject(draggedObj) {
      this._draggedObj = draggedObj;
    }

    /**
     * Setup on drag start
     */
    dragStartSetup() {
      // Remove all DnD artifacts except for the currently dragged one (note if this._draggedObj is not an affordance or null then all artifacts are removed)
      this.hideDnDArtifacts(this._draggedObj);
    }

    /**
     * Cleanup on drag end
     */
    dragEndCleanup() {
      // Remove all DnD artifacts
      this.hideDnDArtifacts();

      // reset sandbox data
      this._sandboxData = null;

      // Ensure itself and any other selected tasks that were dragged with it are visible
      if (this._gantt.isSelectionSupported() && this.isSelected()) {
        var selection = this._gantt.getSelectionHandler().getSelection();
        for (var i = 0; i < selection.length; i++) {
          var selectionObj = selection[i];
          if (selectionObj && selectionObj.nodeType === 'task') {
            selectionObj.show();
            selectionObj.getPredecessorDependencies().forEach((dep) => dep.show());
            selectionObj.getSuccessorDependencies().forEach((dep) => dep.show());
          }
        }
      }
    }

    /**
     * Cleanup on drag cancel
     */
    dragCancelCleanup() {
      // Upon drag cancel, dragEndCleanup will get called.
      // Specifically for drag cancel, restore any row selection effects.
      if (this._gantt.isSelectionSupported() && this.isSelected()) {
        var selection = this._gantt.getSelectionHandler().getSelection();
        for (var i = 0; i < selection.length; i++) {
          var selectionObj = selection[i];
          if (selectionObj && selectionObj.nodeType === 'task') {
            var rowNode = selectionObj.getRowNode();
            if (rowNode) {
              rowNode.showEffect('selected');
            }
          }
        }
      }
    }

    /**
     * Renders and returns a non-interactive, cloned instance of itself.
     * Generally this should only be used to generate a drag feedback showing itself.
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderClone(container) {
      var taskNode = new DvtGanttTaskNode(this._gantt);
      // Shallow clone of task object
      var clonedTaskObj = Object.assign({}, this._taskObj);
      clonedTaskObj.node = taskNode;
      clonedTaskObj._overtimeOffset =
        clonedTaskObj.overtimeStartTime != null
          ? clonedTaskObj.overtimeStartTime - clonedTaskObj.startTime
          : 0;
      clonedTaskObj._downtimeOffset =
        clonedTaskObj.downtimeStartTime != null
          ? clonedTaskObj.downtimeStartTime - clonedTaskObj.startTime
          : 0;
      taskNode.setLayoutObject(clonedTaskObj);
      // Temporarily disable animation and render
      var animationManager = this._gantt.getAnimationManager();
      var animationMode = animationManager.getAnimationMode();
      animationManager.setAnimationMode('none');
      taskNode.render(container);
      var task = taskNode.getTask();
      var taskLabel = taskNode.getTaskLabel();
      taskLabel.setAssociatedShape(task.getShape('main'));
      taskLabel.render();
      // Dragged task is always selected (avoided calling setSelected directly to avoid potential side effects)
      taskNode._selected = true;
      task.showMainEffect('selected');
      taskNode.setMouseEnabled(false);
      animationManager.setAnimationMode(animationMode);
      return taskNode;
    }

    /**
     * Renders and returns a non-interactive, outline of itself.
     * Generally this should only be used to generate a drag source feedback or drop target feedback.
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderOutlineClone(container) {
      var task = this.getTask();
      var referenceMainShape = task.getShape('main');
      var outline = new DvtGanttTaskShape(
        this._gantt.getCtx(),
        this.getTranslateX() + referenceMainShape.getFinalX(),
        this.getTranslateY() + referenceMainShape.getFinalY(),
        referenceMainShape.getFinalWidth(),
        referenceMainShape.getFinalHeight(),
        referenceMainShape.getBorderRadius(),
        task,
        'mainDragFeedback'
      );
      // Should always be behind everything else
      container.addChildAt(outline, 0);
      return outline;
    }

    /**
     * Sets the width. This should only be used if this instance is used as a drag feedback.
     * @param {number} width
     * @private
     */
    _setWidth(width) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var orientationFactor = isRTL ? 1 : -1;
      var ganttStartTime = this._gantt.getStartTime();
      var ganttEndTime = this._gantt.getEndTime();
      var ganttContentLength = this._gantt.getContentLength();

      var startPos = isRTL ? ganttContentLength - this.getTranslateX() : this.getTranslateX();
      var startTime = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
        ganttStartTime,
        ganttEndTime,
        startPos,
        ganttContentLength
      );
      var endPos = this.getTranslateX() - orientationFactor * width;
      endPos = isRTL ? ganttContentLength - endPos : endPos;
      var endTime = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
        ganttStartTime,
        ganttEndTime,
        endPos,
        ganttContentLength
      );

      this._taskObj.startTime = startTime;
      this._taskObj.endTime = endTime;
      if (this._taskObj.overtimeStartTime) {
        var overtimeDiff = this._taskObj.overtimeEndTime - this._taskObj.overtimeStartTime;
        this._taskObj.overtimeStartTime = startTime + this._taskObj._overtimeOffset;
        this._taskObj.overtimeEndTime = this._taskObj.overtimeStartTime + overtimeDiff;
      }
      if (this._taskObj.downtimeStartTime) {
        var downtimeDiff = this._taskObj.downtimeEndTime - this._taskObj.downtimeStartTime;
        this._taskObj.downtimeStartTime = startTime + this._taskObj._downtimeOffset;
        this._taskObj.downtimeEndTime = this._taskObj.downtimeStartTime + downtimeDiff;
      }
      this._taskObj.x = this.getTranslateX();
      this._taskObj.y = this.getTranslateY();

      // Temporarily disable animation and re-render
      var animationManager = this._gantt.getAnimationManager();
      var animationMode = animationManager.getAnimationMode();
      animationManager.setAnimationMode('none');
      this.render(this.getParent(), true);
      var taskLabel = this.getTaskLabel();
      taskLabel.render();
      // Dragged task is always selected
      var task = this.getTask();
      task.showMainEffect('selected');
      animationManager.setAnimationMode(animationMode);
    }

    /**
     * Gets the width. This should only be used if this instance is used as a drag feedback.
     * @private
     */
    _getWidth() {
      var mainShape = this.getTask().getShape('main');
      return mainShape.getWidth();
    }

    /**
     * Visibly hides the task.
     * @param {boolean=} removeRowEffects Optionally also remove row selection effects. Default false.
     */
    hide(removeRowSelectionEffects) {
      this.setAlpha(0);
      var rowNode = this.getRowNode();
      if (removeRowSelectionEffects && rowNode) {
        rowNode.removeEffect('selected');
      }
    }

    /**
     * Visibly show the task.
     */
    show() {
      this.setAlpha(1);
    }

    /**
     * Show the drag feedbacks accordingly; called by DnD handlers.
     * @param {dvt.MouseEvent|dvt.KeyboardEvent|dvt.ComponentTouchEvent} event DnD dragOver event, keyboard, or touch event that triggered the feedback
     * @param {dvt.Point} localPos The position (e.g. the cursor point during drag) in reference to the affordance container coord system
     * @param {object} dropObj The current drop target logical object
     * @param {dvt.Point} dropOffset The difference between the position of the start and y of the task and the drag start event position (i.e. (start pos - event pos, y - event y pos)
     * @param {boolean=} autoPanOff Whether to turn edge auto pan off. Default false.
     */
    showDragFeedback(event, localPos, dropObj, dropOffset, autoPanOff) {
      var eventManager = this._gantt.getEventManager();
      // Don't do anything if the eventManager doesn't exist anymore, which is possible because this method is invoked
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
        var feedbackStartTimePos,
          feedbackStartTime,
          feedbackEndTimePos,
          feedbackEndTime,
          feedbackRowNode;

        switch (dragSourceType) {
          case 'tasks':
            // Pan to make room if dragging to edge
            panDelta = !autoPanOff
              ? this._gantt.autoPanOnEdgeDrag(
                  localPos,
                  DvtGanttStyleUtils.getAutoPanEdgeThreshold(),
                  false,
                  false
                )
              : { deltaX: 0, deltaY: 0 };
            referenceFinalLocalX = dropOffset.x + localPos.x + panDelta.deltaX;
            referenceFinalLocalY = dropOffset.y + localPos.y + panDelta.deltaY;

            if (dropObj) {
              if (dropObj && dropObj.nodeType === 'row') {
                feedbackRowNode = dropObj;
              } else if (dropObj && dropObj.nodeType === 'task') {
                feedbackRowNode = dropObj.getRowNode();
              } else {
                return;
              }
            } else {
              return;
            }

            // render feedback
            this._renderTaskMoveDragFeedback(
              referenceFinalLocalX,
              referenceFinalLocalY,
              artifactsContainer,
              feedbackRowNode
            );
            this._renderDependencyLinesDragFeedback(this._mainDragFeedbacks, artifactsContainer);

            // Show tooltip
            var referenceMainShape = this.getTask().getShape('main');
            feedbackStartTimePos = isRTL
              ? ganttContentLength - referenceFinalLocalX
              : referenceFinalLocalX;
            feedbackEndTimePos = isRTL
              ? ganttContentLength - (referenceFinalLocalX - referenceMainShape.getFinalWidth())
              : referenceFinalLocalX + referenceMainShape.getFinalWidth();
            feedbackStartTime = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
              ganttStartTime,
              ganttEndTime,
              feedbackStartTimePos,
              ganttContentLength
            );
            feedbackEndTime = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
              ganttStartTime,
              ganttEndTime,
              feedbackEndTimePos,
              ganttContentLength
            );
            this._showDragFeedbackTooltip(
              event,
              feedbackStartTime,
              feedbackEndTime,
              this._mainDragFeedbacks[0],
              'center',
              feedbackRowNode
            );
            break;
          case 'taskResizeHandles':
            // Pan (horizontally only) to make room if dragging to edge
            panDelta = !autoPanOff
              ? this._gantt.autoPanOnEdgeDrag(
                  localPos,
                  DvtGanttStyleUtils.getAutoPanEdgeThreshold(),
                  false,
                  true
                )
              : { deltaX: 0, deltaY: 0 };
            referenceFinalLocalX = localPos.x + panDelta.deltaX;

            // render feedback
            this._renderTaskResizeDragFeedback(referenceFinalLocalX, artifactsContainer);
            this._renderDependencyLinesDragFeedback(
              this._mainResizeHandleDragFeedbacks,
              artifactsContainer
            );

            // Show tooltip
            var isEndResize = this._draggedObj.getType() === 'mainResizeHandleEnd';
            if (isEndResize) {
              feedbackStartTime = this.getValue('start');
              feedbackEndTimePos =
                this._mainResizeHandleDragFeedbacks[0].getTranslateX() -
                orientationFactor * this._mainResizeHandleDragFeedbacks[0]._getWidth();
              feedbackEndTimePos = isRTL
                ? ganttContentLength - feedbackEndTimePos
                : feedbackEndTimePos;
              feedbackEndTime = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
                ganttStartTime,
                ganttEndTime,
                feedbackEndTimePos,
                ganttContentLength
              );
            } else {
              feedbackStartTimePos = this._mainResizeHandleDragFeedbacks[0].getTranslateX();
              feedbackStartTimePos = isRTL
                ? ganttContentLength - feedbackStartTimePos
                : feedbackStartTimePos;
              feedbackStartTime = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
                ganttStartTime,
                ganttEndTime,
                feedbackStartTimePos,
                ganttContentLength
              );
              feedbackEndTime = this.getValue('end');
            }
            this._showDragFeedbackTooltip(
              event,
              feedbackStartTime,
              feedbackEndTime,
              this._mainResizeHandleDragFeedbacks[0],
              isEndResize ? 'end' : 'start'
            );
            break;
        }
      }
    }

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
    _showDragFeedbackTooltip(
      event,
      feedbackStartTime,
      feedbackEndTime,
      feedbackObj,
      position,
      feedbackRowNode
    ) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var sandboxData = this.getSandboxData();
      if (feedbackRowNode) sandboxData['_rowNode'] = feedbackRowNode;

      var start = sandboxData.start;
      sandboxData['start'] = feedbackStartTime;
      sandboxData['end'] = feedbackEndTime;

      if (sandboxData.overtime && sandboxData.overtime.start) {
        var overtimeOffset = sandboxData.overtime.start - start;
        var overtimeDiff = sandboxData.overtime.end - sandboxData.overtime.start;
        sandboxData.overtime.start = sandboxData.start + overtimeOffset;
        sandboxData.overtime.end = sandboxData.overtime.start + overtimeDiff;
      }
      if (sandboxData.downtime && sandboxData.downtime.start) {
        var downtimeOffset = sandboxData.downtime.start - start;
        var downtimeDiff = sandboxData.downtime.end - sandboxData.downtime.start;
        sandboxData.downtime.start = sandboxData.start + downtimeOffset;
        sandboxData.downtime.end = sandboxData.downtime.start + downtimeDiff;
      }

      var feedbackDimensions = feedbackObj.getDimensions(this.getCtx().getStage());
      var coords;
      switch (position) {
        case 'start':
          coords = new dvt.Point(
            feedbackDimensions.x + isRTL * feedbackDimensions.w,
            feedbackDimensions.y
          );
          break;
        case 'end':
          coords = new dvt.Point(
            feedbackDimensions.x + !isRTL * feedbackDimensions.w,
            feedbackDimensions.y
          );
          break;
        default:
          coords = feedbackDimensions.getCenter();
      }

      var pageCoords = this.getCtx().stageToPageCoords(coords.x, coords.y);
      this._gantt
        .getEventManager()
        .ProcessObjectTooltip(event, pageCoords.x, pageCoords.y, this, feedbackObj.getElem());
    }

    /**
     * Renders task move drag feedback
     * @param {number} referenceFinalLocalX x position of the task's start
     * @param {number} referenceFinalLocalY y position of the tasks's top
     * @param {dvt.Container} container The container to render into
     * @param {DvtGanttRowNode} targetRowNode current row node that's dragged over
     * @private
     */
    _renderTaskMoveDragFeedback(
      referenceFinalLocalX,
      referenceFinalLocalY,
      container,
      targetRowNode
    ) {
      var options = this._gantt.getOptions();
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var ganttStartTime = this._gantt.getStartTime();
      var ganttEndTime = this._gantt.getEndTime();
      var ganttContentLength = this._gantt.getContentLength();

      var referenceMainShape = this.getTask().getShape('main');
      var dropOutlineFeedbackRowTopOffset =
        options.rowDefaults.height != null
          ? (options.rowDefaults.height - referenceMainShape.getFinalHeight()) / 2
          : DvtGanttStyleUtils.getRowPaddingTop(options);
      var dropStagePos = targetRowNode.localToStage({
        x: 0,
        y: targetRowNode.getFinalY() + dropOutlineFeedbackRowTopOffset
      });
      var dropFeedbackY = this._gantt.getDnDArtifactsContainer().stageToLocal(dropStagePos).y;

      var setTranslate = (feedback, x, y) => {
        feedback.setTranslate(x, y);
        feedback._taskObj.x = x;
        feedback._taskObj.y = y;
      };

      if (this._mainDragFeedbacks) {
        for (var i = 0; i < this._mainDragFeedbacks.length; i++) {
          var dragFeedback = this._mainDragFeedbacks[i];
          var dragFeedbackOffset = this._mainDragFeedbackOffsets[i];
          var newFeedbackX = referenceFinalLocalX + dragFeedbackOffset.x;
          setTranslate(dragFeedback, newFeedbackX, referenceFinalLocalY + dragFeedbackOffset.y);

          if (i === 0) {
            // Drop outline only shown for drag source task
            var dropOutlineFeedback = this._mainDropOutlineFeedbacks[i];
            dropOutlineFeedback.setX(newFeedbackX);
            dropOutlineFeedback.setY(dropFeedbackY);
          }

          this._mainDragFeedbackStartTimes[i] = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
            ganttStartTime,
            ganttEndTime,
            isRTL ? ganttContentLength - newFeedbackX : newFeedbackX,
            ganttContentLength
          );
        }
      } else {
        // First feedback corresponds to the task where drag was initiated. Other feedbacks are drawn for other selected tasks if applicable.
        this.hide(true);
        var referenceDragOutlineFeedback = this._renderOutlineClone(container);
        var referenceDropOutlineFeedback = this._renderOutlineClone(container);
        referenceDropOutlineFeedback.setX(referenceFinalLocalX);
        referenceDropOutlineFeedback.setY(referenceFinalLocalY);

        var referenceDragFeedback = this._renderClone(container);
        setTranslate(referenceDragFeedback, referenceFinalLocalX, referenceFinalLocalY);
        this._mainDragFeedbacks = [referenceDragFeedback];
        this._mainDragOutlineFeedbacks = [referenceDragOutlineFeedback];
        this._mainDropOutlineFeedbacks = [referenceDropOutlineFeedback];
        this._mainDragFeedbackOffsets = [new dvt.Point(0, 0)];
        // time information is necessary for updating the feedback, e.g. in case the Gantt resized during move the feedback needs to be placed correctly under the new time axis.
        this._mainDragFeedbackStartTimes = [this.getValue('start')];

        if (
          this._gantt.isSelectionSupported() &&
          this.isSelected() &&
          this._gantt.getSelectionHandler().getSelectedCount() > 1
        ) {
          var selection = this._gantt.getSelectionHandler().getSelection();
          for (i = 0; i < selection.length; i++) {
            var selectionObj = selection[i];
            if (selectionObj && selectionObj.nodeType === 'task' && selectionObj !== this) {
              var mainShape = selectionObj.getTask().getShape('main');
              var offsetFromReferenceX =
                mainShape.getX() +
                selectionObj.getTranslateX() -
                (referenceMainShape.getX() + this.getTranslateX());
              var offsetFromReferenceY =
                mainShape.getY() +
                selectionObj.getTranslateY() -
                (referenceMainShape.getY() + this.getTranslateY());
              var dragFeedbackLocalX = referenceFinalLocalX + offsetFromReferenceX;
              var dragFeedbackLocalY = referenceFinalLocalY + offsetFromReferenceY;
              selectionObj.hide(true);
              var dragOutlineFeedback = selectionObj._renderOutlineClone(container);
              dragFeedback = selectionObj._renderClone(container);
              setTranslate(dragFeedback, dragFeedbackLocalX, dragFeedbackLocalY);
              this._mainDragFeedbacks.push(dragFeedback);
              this._mainDragOutlineFeedbacks.push(dragOutlineFeedback);
              this._mainDragFeedbackOffsets.push(
                new dvt.Point(offsetFromReferenceX, offsetFromReferenceY)
              );
              this._mainDragFeedbackStartTimes.push(selectionObj.getValue('start'));
            }
          }
        }
      }
    }

    /**
     * Renders task resize drag feedback
     * @param {number} referenceFinalLocalX x position of the current drag position
     * @param {dvt.Container} container The container to render into
     * @private
     */
    _renderTaskResizeDragFeedback(referenceFinalLocalX, container) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var orientationFactor = isRTL ? 1 : -1;

      var referenceMainShape = this.getTask().getShape('main');
      var isEndResize = this._draggedObj.getType() === 'mainResizeHandleEnd';
      var anchorX, finalLocalX;
      if (isEndResize) {
        anchorX = referenceMainShape.getFinalX() + this.getTranslateX();
        // DvtGanttTaskShape rects takes care of RTL internally, so x is always the start position
        finalLocalX = isRTL
          ? Math.min(referenceFinalLocalX, anchorX)
          : Math.max(referenceFinalLocalX, anchorX);
      } else {
        anchorX =
          referenceMainShape.getFinalX() -
          orientationFactor * referenceMainShape.getFinalWidth() +
          this.getTranslateX();
        finalLocalX = isRTL
          ? Math.max(referenceFinalLocalX, anchorX)
          : Math.min(referenceFinalLocalX, anchorX);
      }
      var finalReferenceWidth = Math.abs(finalLocalX - anchorX);
      var deltaWidth = finalReferenceWidth - referenceMainShape.getFinalWidth();
      var setTranslate = (feedback, x, y) => {
        feedback.setTranslate(x, y);
        feedback._taskObj.x = x;
        feedback._taskObj.y = y;
      };

      if (this._mainResizeHandleDragFeedbacks) {
        for (var i = 0; i < this._mainResizeHandleDragFeedbacks.length; i++) {
          var dragFeedback = this._mainResizeHandleDragFeedbacks[i];
          var dragSourceNode = this._mainResizeHandleDragFeedbackSources[i];
          var dragSourceShape = dragSourceNode.getTask().getShape('main');
          var newFeedbackWidth = Math.max(0, dragSourceShape.getFinalWidth() + deltaWidth);
          if (!isEndResize) {
            var dragSourceAnchorX =
              dragSourceShape.getFinalX() -
              orientationFactor * dragSourceShape.getFinalWidth() +
              dragSourceNode.getTranslateX();
            dragFeedback.setTranslateX(dragSourceAnchorX + orientationFactor * newFeedbackWidth);
            dragFeedback._taskObj.x = dragFeedback.getTranslateX();
          }
          dragFeedback._setWidth(newFeedbackWidth);
        }
      } else {
        this.hide();
        var referenceDragFeedback = this._renderClone(container);
        setTranslate(
          referenceDragFeedback,
          isEndResize ? anchorX : finalLocalX,
          referenceMainShape.getFinalY() + this.getTranslateY()
        );
        this._mainResizeHandleDragFeedbacks = [referenceDragFeedback];
        this._mainResizeHandleDragFeedbackSources = [this];

        if (
          this._gantt.isSelectionSupported() &&
          this.isSelected() &&
          this._gantt.getSelectionHandler().getSelectedCount() > 1
        ) {
          var selection = this._gantt.getSelectionHandler().getSelection();
          for (i = 0; i < selection.length; i++) {
            var selectionObj = selection[i];
            if (selectionObj && selectionObj.nodeType === 'task' && selectionObj !== this) {
              var mainShape = selectionObj.getTask().getShape('main');
              var feedbackWidth = mainShape.getFinalWidth() + deltaWidth;
              var feedbackX;
              if (isEndResize) feedbackX = mainShape.getFinalX() + selectionObj.getTranslateX();
              else
                feedbackX =
                  mainShape.getFinalX() -
                  orientationFactor * mainShape.getFinalWidth() +
                  selectionObj.getTranslateX() +
                  orientationFactor * feedbackWidth;

              selectionObj.hide();
              dragFeedback = selectionObj._renderClone(container);
              setTranslate(
                dragFeedback,
                feedbackX,
                mainShape.getFinalY() + selectionObj.getTranslateY()
              );
              this._mainResizeHandleDragFeedbacks.push(dragFeedback);
              this._mainResizeHandleDragFeedbackSources.push(selectionObj);
            }
          }
        }
      }
    }

    /**
     * Renders task move dependency lines drag feedback.
     * Assumes _renderTaskMoveDragFeedback or _renderTaskResizeDragFeedback is called before this.
     * @param {Array} dragFeedbacks array of task drag feedbacks (that are instances of DvtGanttTaskNode)
     * @param {dvt.Container} container The container to render into
     * @private
     */
    _renderDependencyLinesDragFeedback(dragFeedbacks, container) {
      if (this._mainDependencyLineDragFeedbacks) {
        this._mainDependencyLineDragFeedbacks.forEach((clonedDepLine) =>
          clonedDepLine.render(container, true)
        );
      } else {
        this._mainDependencyLineDragFeedbacks = [];

        // Hide the real dependency lines and clone depObjs for rendering dep feedback. Selected tasks are the ones being dragged.
        const depObjsCloneMap = new Map();
        if (this._gantt.isSelectionSupported() && this.isSelected()) {
          const selection = this._gantt.getSelectionHandler().getSelection();
          selection.forEach((selectionObj) => {
            const predecessorDepNodes = selectionObj.getPredecessorDependencies();
            const successorDepNodes = selectionObj.getSuccessorDependencies();
            predecessorDepNodes.forEach((dep) => {
              dep.hide();
              depObjsCloneMap.set(dep.getLayoutObject(), Object.assign({}, dep.getLayoutObject()));
            });
            successorDepNodes.forEach((dep) => {
              dep.hide();
              depObjsCloneMap.set(dep.getLayoutObject(), Object.assign({}, dep.getLayoutObject()));
            });
          });
        }

        // Fix clone layout object references
        dragFeedbacks.forEach((clonedTaskNode) => {
          const clonedTaskObj = clonedTaskNode.getLayoutObject();
          clonedTaskObj.predecessorDepObjs = clonedTaskObj.predecessorDepObjs.map((depObj) => {
            const clonedDepObj = depObjsCloneMap.get(depObj);
            clonedDepObj.successorTaskObj = clonedTaskObj;
            return clonedDepObj;
          });
          clonedTaskObj.successorDepObjs = clonedTaskObj.successorDepObjs.map((depObj) => {
            const clonedDepObj = depObjsCloneMap.get(depObj);
            clonedDepObj.predecessorTaskObj = clonedTaskObj;
            return clonedDepObj;
          });
        });

        // Render dependency line clones as feedback
        depObjsCloneMap.forEach((clonedDepObj, _) => {
          const dependencyNode = new DvtGanttDependencyNode(this._gantt);
          dependencyNode.setLayoutObject(clonedDepObj);
          clonedDepObj.node = dependencyNode;
          dependencyNode.render(container);
          dependencyNode.setMouseEnabled(false);
          this._mainDependencyLineDragFeedbacks.push(dependencyNode);
        });
      }
    }

    /**
     * Updates drag feedback positions on rerender, e.g. the Gantt resized when the feedbacks
     * are still present during keyboard DnD, in which case the feedback positions need to be updated
     * under the new time axis.
     */
    _updateDragFeedbacks() {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var ganttStartTime = this._gantt.getStartTime();
      var ganttEndTime = this._gantt.getEndTime();
      var ganttContentLength = this._gantt.getContentLength();
      var dragFeedback, dragFeedbackX, dragOutlineFeedback, dropOutlineFeedback;

      if (this._mainDragFeedbacks) {
        var newReferenceX = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
          ganttStartTime,
          ganttEndTime,
          this._mainDragFeedbackStartTimes[0],
          ganttContentLength
        );
        newReferenceX = isRTL ? ganttContentLength - newReferenceX : newReferenceX;
        for (var i = 0; i < this._mainDragFeedbacks.length; i++) {
          dragFeedback = this._mainDragFeedbacks[i];
          dragOutlineFeedback = this._mainDragOutlineFeedbacks[i];
          dragFeedbackX = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
            ganttStartTime,
            ganttEndTime,
            this._mainDragFeedbackStartTimes[i],
            ganttContentLength
          );
          dragFeedbackX = isRTL ? ganttContentLength - dragFeedbackX : dragFeedbackX;

          this._mainDragFeedbackOffsets[i].x = dragFeedbackX - newReferenceX; // recalculate x positional offsets

          var mainShape = this.getTask().getShape('main');
          var mainShapeWidth = mainShape.getFinalWidth();
          dragFeedback.setTranslateX(dragFeedbackX);
          dragFeedback._taskObj.x = dragFeedback.getTranslateX();
          dragFeedback._setWidth(mainShapeWidth);
          dragOutlineFeedback.setX(mainShape.getFinalX() + this.getFinalX());
          dragOutlineFeedback.setWidth(mainShapeWidth);

          if (i === 0) {
            // Drop outline only shown for the drag source task
            dropOutlineFeedback = this._mainDropOutlineFeedbacks[i];
            dropOutlineFeedback.setX(dragFeedbackX);
            dropOutlineFeedback.setWidth(mainShapeWidth);
          }

          // update the source/reference feedback localpos (first maindragfeedback is that of the source)
          if (i === 0 && this._gantt.getEventManager()._keyboardDnDFeedbackLocalPos)
            this._gantt.getEventManager()._keyboardDnDFeedbackLocalPos.x = dragFeedbackX;
        }
      }
      if (this._mainResizeHandleDragFeedbacks) {
        for (var i = 0; i < this._mainResizeHandleDragFeedbacks; i++) {
          dragFeedback = this._mainResizeHandleDragFeedbacks[i];
          var dragFeedbackStartX = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
            ganttStartTime,
            ganttEndTime,
            this._mainResizeHandleDragFeedbackSources[i].getValue('start'),
            ganttContentLength
          );
          var dragFeedbackEndX = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
            ganttStartTime,
            ganttEndTime,
            this._mainResizeHandleDragFeedbackSources[i].getValue('end'),
            ganttContentLength
          );
          dragFeedbackX = isRTL ? ganttContentLength - dragFeedbackStartX : dragFeedbackStartX;

          dragFeedback.setTranslateX(dragFeedbackX);
          dragFeedback._taskObj.x = dragFeedback.getTranslateX();
          dragFeedback._setWidth(Math.abs(dragFeedbackEndX - dragFeedbackStartX));

          // update the source/reference feedback localpos (first maindragfeedback is that of the source)
          if (i === 0 && this._gantt.getEventManager()._keyboardDnDFeedbackLocalPos)
            this._gantt.getEventManager()._keyboardDnDFeedbackLocalPos.x = dragFeedbackX;
        }
      }
      if (this._mainDependencyLineDragFeedbacks) {
        this._mainDependencyLineDragFeedbacks.forEach((clonedDepLine) =>
          clonedDepLine.render(clonedDepLine.getParent(), true)
        );
      }
    }

    /**
     * Remove drag feedbacks.
     */
    removeDragFeedbacks() {
      if (this._mainDragFeedbacks) {
        for (var i = 0; i < this._mainDragFeedbacks.length; i++) {
          this._mainDragFeedbacks[i].getParent().removeChild(this._mainDragFeedbacks[i]);
          this._mainDragOutlineFeedbacks[i]
            .getParent()
            .removeChild(this._mainDragOutlineFeedbacks[i]);
        }
        // Only one drop outline for drag source task
        this._mainDropOutlineFeedbacks[0].getParent().removeChild(this._mainDropOutlineFeedbacks[0]);

        this._mainDragFeedbacks = null;
        this._mainDragOutlineFeedbacks = null;
        this._mainDropOutlineFeedbacks = null;
        this._mainDragFeedbackOffsets = null;
        this._mainDragFeedbackStartTimes = null;
      }
      if (this._mainDependencyLineDragFeedbacks) {
        for (var i = 0; i < this._mainDependencyLineDragFeedbacks.length; i++) {
          this._mainDependencyLineDragFeedbacks[i]
            .getParent()
            .removeChild(this._mainDependencyLineDragFeedbacks[i]);
        }
        this._mainDependencyLineDragFeedbacks = null;
      }
      if (this._mainResizeHandleDragFeedbacks) {
        for (var i = 0; i < this._mainResizeHandleDragFeedbacks.length; i++) {
          this._mainResizeHandleDragFeedbacks[i]
            .getParent()
            .removeChild(this._mainResizeHandleDragFeedbacks[i]);
        }
        this._mainResizeHandleDragFeedbacks = null;
        this._mainResizeHandleDragFeedbackSources = null;
      }
      // Hide tooltips if any
      this._gantt.getEventManager().hideTooltip();
    }

    /**
     * Hide the drag affordances/feedbacks.
     */
    hideDnDArtifacts() {
      this.removeDragFeedbacks();
    }

    /**
     * Gets the task
     * @return {DvtGanttTask} the task
     */
    getTask() {
      return this._task;
    }

    /**
     * Gets the task label
     * @return {DvtGanttTaskLabel} the task label
     */
    getTaskLabel() {
      return this._taskLabel;
    }

    /**
     * Renders the task node
     * @param {dvt.Container} container the container to render the task container into.
     * @param {boolean=} bUpdateCustomContent Whether to do a full custom content re-render if it already exists. Default true.
     */
    render(container, bUpdateCustomContent) {
      var bUpdateCustomContent = bUpdateCustomContent !== false;
      var finalStates;

      // Ensure visible, e.g. it's possible it's hidden as part of any previous drag feedback.
      if (!this._gantt.getEventManager().isDnDDragging()) {
        this.show();
      }

      var selectingCursor = dvt.SelectionEffectUtils.getSelectingCursor();
      if (this.isSelectable() && this.getCursor() !== selectingCursor)
        this.setCursor(selectingCursor);

      if (this.getParent() != container) container.addChild(this);

      // Render task elements (labels will be rendered later, see DvtGanttRowNode.render())
      // If resize enabled, handles will be rendered after labels are rendered (see DvtGanttRowNode.render())
      // to sure handles are on top of everything
      this._task.render(bUpdateCustomContent);

      this._getAriaTarget().setAriaRole('img');
      this.refreshAriaLabel();

      // Update drag feedback positions
      this._updateDragFeedbacks();

      finalStates = {
        x: this.getFinalX(),
        y: this.getFinalY()
      };
      this._gantt.getAnimationManager().preAnimateTaskNode(this, finalStates);
    }

    /**
     * Removes the task node
     */
    remove() {
      var onEnd,
        self = this;

      onEnd = () => {
        self.getRowNode().removeChild(self);
      };

      this._gantt.getAnimationManager().preAnimateTaskNodeRemove(this, onEnd);
    }

    /**
     * Gets a list of dependency line objects that connects to its predecessor
     * @return {DvtGanttDependencyNode[]} an array of dependency nodes
     */
    getPredecessorDependencies() {
      var dataLayoutManager = this._gantt.getDataLayoutManager();
      return this._taskObj.predecessorDepObjs.map((depObj) => {
        if (!depObj.node) {
          dataLayoutManager.ensureInDOM(depObj, 'dependency');
        }
        return depObj.node;
      });
    }

    /**
     * Gets a list of dependency line objects that connects to its successor
     * @return {DvtGanttDependencyNode[]} an array of dependency nodes
     */
    getSuccessorDependencies() {
      var dataLayoutManager = this._gantt.getDataLayoutManager();
      return this._taskObj.successorDepObjs.map((depObj) => {
        if (!depObj.node) {
          dataLayoutManager.ensureInDOM(depObj, 'dependency');
        }
        return depObj.node;
      });
    }

    /**
     * Gets final x (animation independent, e.g. final x after animation finishes)
     * @return {number} The final x.
     */
    getFinalX() {
      return this._taskObj['x'];
    }

    /**
     * Gets final y (animation independent, e.g. final y after animation finishes)
     * @return {number} The final y.
     */
    getFinalY() {
      return this._taskObj['y'];
    }

    /**
     * Gets final height (animation independent, e.g. final height after animation finishes)
     * @param {boolean=} excludeProgress Whether to exclude the progress height in the calculation
     * @return {number} The final height.
     */
    getFinalHeight(excludeProgress) {
      return this._task.getFinalHeight(excludeProgress);
    }

    /**
     * Gets the duration string
     * @param {number} startTime
     * @param {number} endTime
     * @return {string} The duration string.
     */
    getDuration(startTime, endTime) {
      var translations = this._gantt.getOptions().translations;
      var hours = 1000 * 60 * 60;
      var days = hours * 24;
      var duration = endTime - startTime;
      var scale = this._gantt.getMinorAxis().getScale();
      if (scale === 'hours' || scale === 'minutes' || scale === 'seconds') {
        duration = Math.round((duration / hours) * 100) / 100;
        return dvt.ResourceUtils.format(translations.accessibleDurationHours, [duration]);
      } else {
        duration = Math.round((duration / days) * 100) / 100;
        return dvt.ResourceUtils.format(translations.accessibleDurationDays, [duration]);
      }
    }

    /**
     * Gets the representative displayable.
     * @return {dvt.Displayable}
     */
    getDisplayable() {
      return this;
    }

    /**
     * Gets the aria label
     * @return {string} the aria label string.
     */
    getAriaLabel() {
      var states = [];
      var options = this._gantt.getOptions();
      var translations = options.translations;
      var rowObj = this.getLayoutObject()['rowObj'];

      var treeLevelDesc = '';
      if (this._gantt.isRowsHierarchical()) {
        treeLevelDesc = translations.labelLevel + ' ' + rowObj['depth'] + ', ';
      }

      // If aria-label update is due to expand/collapse rerender,
      // return a simplified label consisting of the row label and expanded/collapsed state.
      if (this._gantt.getRenderState() != null) {
        var rowLabel = rowObj['data']['label'];
        if (rowLabel == null) rowLabel = translations.labelRow + ' ' + rowObj['index'] + 1;
        rowLabel = treeLevelDesc + rowLabel;
        if (rowObj['expanded'] != null)
          states.push(translations[rowObj['expanded'] ? 'stateExpanded' : 'stateCollapsed']);
        return dvt.Displayable.generateAriaLabel(rowLabel, states);
      }

      if (this.isSelectable())
        states.push(translations[this.isSelected() ? 'stateSelected' : 'stateUnselected']);
      var rowObj = this.getLayoutObject()['rowObj'];
      if (rowObj['expanded'] != null)
        states.push(
          translations.labelRow +
            ' ' +
            translations[rowObj['expanded'] ? 'stateExpanded' : 'stateCollapsed']
        );

      var shortDesc = DvtGanttTooltipUtils.getDatatip(this, false, true);
      if (this._task.isMilestone('main')) {
        // note doesn't really make a difference if we query 'main' or 'baseline'
        shortDesc = translations.accessibleTaskTypeMilestone + ', ' + shortDesc;
      } else if (this._task.isSummary('main')) {
        // note doesn't really make a difference if we query 'main' or 'baseline'
        shortDesc = translations.accessibleTaskTypeSummary + ', ' + shortDesc;
      }
      shortDesc = treeLevelDesc + shortDesc;

      var predecessorDepObjs = this._taskObj.predecessorDepObjs;
      var successorDepObjs = this._taskObj.successorDepObjs;
      // include hint of whether there are predecessors or successors
      if (predecessorDepObjs.length > 0 || successorDepObjs.length > 0) {
        var depDesc = '';
        if (predecessorDepObjs.length > 0) {
          depDesc = dvt.ResourceUtils.format(translations.accessiblePredecessorInfo, [
            predecessorDepObjs.length
          ]);

          // for VoiceOver/Talkback we'll need to include the full detail of the dependency in the task since we can't
          // navigate to the dependency line directly
          if (ojtimeaxisToolkit.TimeAxisUtils.supportsTouch() || dvt.Agent.isEnvironmentTest()) {
            for (var i = 0; i < predecessorDepObjs.length; i++)
              depDesc = depDesc + ', ' + predecessorDepObjs[i].ariaLabel;
          }
        }

        if (successorDepObjs.length > 0) {
          if (depDesc.length > 0) depDesc = depDesc + ', ';
          depDesc =
            depDesc +
            dvt.ResourceUtils.format(translations.accessibleSuccessorInfo, [successorDepObjs.length]);

          if (ojtimeaxisToolkit.TimeAxisUtils.supportsTouch() || dvt.Agent.isEnvironmentTest()) {
            for (i = 0; i < successorDepObjs.length; i++)
              depDesc = depDesc + ', ' + successorDepObjs[i].ariaLabel;
          }
        }

        if (depDesc.length > 0) shortDesc = shortDesc + ', ' + depDesc;
      }

      var ariaLabel = dvt.Displayable.generateAriaLabel(shortDesc, states);
      var currentAriaLabel = this.getAriaProperty('label');
      // coming from setActiveElement() and nothing changed, must have been updated through selection, skipped
      if (currentAriaLabel != null && currentAriaLabel.indexOf(ariaLabel) > -1) return null;
      else return ariaLabel;
    }

    /**
     * Gets the target element object that should have aria properties set on it.
     * @return {dvt.Displayable} The target object
     * @private
     */
    _getAriaTarget() {
      // In touch devices, if resize is enabled, we want the resize handles to be navigable by screenreader, e.g. iOS VoiceOver
      // If aria label is set on the task node, the VoiceOver cursor skips over the children handles, so we want to instead
      // place the aria properties on the main shape element.
      // In all other cases, aria properties should be set on the task node itself
      var mainShape = this.getTask().getShape('main');
      if (dvt.Agent.isTouchDevice() && this._gantt.isTaskResizeEnabled() && mainShape) {
        return mainShape;
      }
      return this;
    }

    /**
     * Refresh the aria-label with the current row index info
     * Called by DvtGanttTaskDependencyNode
     */
    refreshAriaLabel() {
      this._updateAriaLabel();
    }

    /**
     * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
     * when the activeElement is set.
     * @private
     */
    _updateAriaLabel() {
      if (!dvt.Agent.deferAriaCreation()) {
        var ariaTarget = this._getAriaTarget();
        ariaTarget.setAriaProperty('label', this.getAriaLabel());
      }
    }

    /**
     * Returns the data context (e.g. for passing to tooltip renderer, for DnD, etc.)
     * @return {object}
     */
    getDataContext() {
      var data = this.getData();
      var itemData = data['_itemData'];
      var fillColor = this.getTask().getFillColor();
      return {
        data: this.getData(true),
        rowData: this.getRowNode().getData(true),
        itemData: itemData ? itemData : null,
        color: fillColor ? fillColor.fill : null,
        component: this._gantt.getOptions()['_widgetConstructor']
      };
    }

    /**
     * Returns the shortDesc Context of the node.
     * @param {DvtGanttTaskNode} node
     * @return {object}
     */
    static getShortDescContext(node) {
      var itemData = node.getData()['_itemData'];
      return {
        data: node.getData(true),
        rowData: node.getRowNode().getData(true),
        itemData: itemData ? itemData : null
      };
    }

    /**
     * Gets a dataContext object that is meant to be updated/manipulated to reflect
     * any intermediate states of a task (e.g. the state of the task feedback during drag,
     * which is not final until dragend, and can potentially be cancelled before)
     * @return {object} Mutable dataContext object
     */
    getSandboxDataContext() {
      var data = this.getSandboxData();
      // ensure dates are iso strings
      data['start'] = new Date(data['start']).toISOString();
      data['end'] = new Date(data['end']).toISOString();
      if (data['baseline']) {
        var baselineStart = data['baseline']['start'];
        var baselineEnd = data['baseline']['end'];
        data['baseline']['start'] =
          baselineStart != null ? new Date(baselineStart).toISOString() : null;
        data['baseline']['end'] = baselineEnd != null ? new Date(baselineEnd).toISOString() : null;
      }

      var itemData = this._taskObj['data']['_itemData'];
      var rowNode = data['_rowNode'];
      return {
        data: data,
        rowData: rowNode.getData(true),
        itemData: itemData ? itemData : null,
        color: DvtGanttTooltipUtils.getDatatipColor(this),
        component: this._gantt.getOptions()['_widgetConstructor']
      };
    }

    /**
     * Sets selection state
     * @param {boolean} selected
     * @param {boolean=} enforceDOMLayering Whether to re-layer the DOM, which can be expensive. Defaults to true.
     * @param {boolean=} isInitial (optional) True if it is an initial selection.
     * @private
     */
    _setSelected(selected, enforceDOMLayering, isInitial) {
      this._selected = selected;

      if (this._selected) {
        this._task.showEffect('selected');
      } else {
        this._task.removeEffect('selected', enforceDOMLayering);
      }

      this.refreshAriaLabel();

      this._gantt.setCurrentRow(this.getRowNode().getId());

      const options = this._gantt.getOptions();
      // Update linear dependency line rendering, because the marker styling depends on task selection state
      // If selectionBehavior is 'highlightDependencies', then skip updating the rendering here because it will be
      // done in the condition below via renderViewportDependencyLines() anyway.
      // Another reason to skip is Bug JET-50792. If animation is on, and a viewport change happen, then it's possible for
      // the predecessor or successor task to move out of view. Due to a combination of horizontal virtualization (where out of view stuff are removed)
      // and lazy line rendering optimization, and nuances with how animation works, it's possible to encounter the console errors reported in the bug.
      // In the animation case, we want to skip the logic below, rely on the condition below to perform renderViewportDependencyLines(),
      // which effectively clears the dependency lines, and allow the viewport to refresh properly on animation end
      // via DvtGanttAnimationManager._onAnimationEnd().
      // One exception is when we're in the middle of a marquee selection drag--in that case we need to perform this update
      // and do less work in the subsequent renderViewportDependencyLines for performance reasons (refer to the comments in that method).
      const isMarqueeDragging = this._gantt.getEventManager().isMarqueeDragging();
      if (
        options.dependencyLineShape === 'straight' &&
        (options.selectionBehavior !== 'highlightDependencies' || isMarqueeDragging)
      ) {
        var dependenciesContainer = this._gantt.getDependenciesContainer();
        var predecessorLines = this.getPredecessorDependencies();
        predecessorLines.forEach((line) => {
          line.render(dependenciesContainer, false);
        });
        var successorLines = this.getSuccessorDependencies();
        successorLines.forEach((line) => {
          line.render(dependenciesContainer, false);
        });
      }

      // When selection is triggered by user gesture, highlight the relevant dependencies
      // See also Bug JIRA JET-49382, and JET-59109
      if (
        (!isInitial || isMarqueeDragging) &&
        options.selectionBehavior === 'highlightDependencies'
      ) {
        var viewport = this._gantt.getViewPort();
        var dataLayoutManager = this._gantt.getDataLayoutManager();
        dataLayoutManager.renderViewportDependencyLines(viewport, 'vpc_translate', {
          taskObj: this.getLayoutObject(),
          isSelected: selected
        });
      }
    }

    /**
     * Clears selection state (without enforcing DOM layering)
     */
    clearSelectionState() {
      // Clear selection state only, and don't bother trying to enforce DOM layering
      this._setSelected(false, false);
    }

    //---------------------------------------------------------------------//
    // Tooltip Support: DvtTooltipSource impl                              //
    //---------------------------------------------------------------------//
    /**
     * @override
     */
    getDatatip() {
      return DvtGanttTooltipUtils.getDatatip(this, true);
    }

    /**
     * @override
     */
    getDatatipColor() {
      return DvtGanttTooltipUtils.getDatatipColor(this);
    }
    //---------------------------------------------------------------------//
    // Selection Support: DvtSelectable impl                               //
    //---------------------------------------------------------------------//

    /**
     * @override
     */
    isSelectable() {
      return this._gantt.getOptions()['selectionMode'] != 'none';
    }

    /**
     * @override
     */
    isSelected() {
      return this._selected;
    }

    /**
     * @override
     */
    setSelected(selected, isInitial) {
      // Set selection and ensure proper DOM layering
      this._setSelected(selected, true, isInitial);
    }

    /**
     * Show hover effect on task bar
     * @override
     */
    showHoverEffect() {
      this._task.showEffect('hover');
    }

    /**
     * Hide hover effect on task bar
     * @override
     */
    hideHoverEffect() {
      this._task.removeEffect('hover');
    }

    //---------------------------------------------------------------------//
    // Keyboard Support: DvtKeyboardNavigable impl                        //
    //---------------------------------------------------------------------//

    /**
     * @override
     */
    getNextNavigable(event) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var keyboardHandler = this._gantt.getEventManager().getKeyboardHandler();

      if (event.type === dvt.MouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event)) {
        return this;
      }

      // Navigating to dependency line
      if (
        event.altKey &&
        (event.keyCode === dvt.KeyboardEvent.OPEN_ANGLED_BRACKET ||
          event.keyCode === dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET) &&
        keyboardHandler &&
        keyboardHandler.getFirstNavigableDependencyLine
      ) {
        var type;
        if (dvt.Agent.isRightToLeft(this.getGantt().getCtx())) {
          type =
            event.keyCode === dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET ? 'predecessor' : 'successor';
        } else {
          type =
            event.keyCode === dvt.KeyboardEvent.OPEN_ANGLED_BRACKET ? 'predecessor' : 'successor';
        }
        var dependencyLines = this._gantt.getNavigableDependencyLinesForTask(this, type);
        var next = keyboardHandler.getFirstNavigableDependencyLine(this, event, dependencyLines);
        if (next) {
          next.setKeyboardFocusTask(this);
        }
        return next;
      }

      // Navigating to row label
      if (
        this._gantt.isRowAxisEnabled() &&
        event.altKey &&
        ((!isRTL && event.keyCode === dvt.KeyboardEvent.LEFT_ARROW) ||
          (isRTL && event.keyCode === dvt.KeyboardEvent.RIGHT_ARROW))
      ) {
        var rowNode = this.getRowNode();
        return rowNode.getRowLabelContent();
      }

      // The normal navigation keys (up/down/right/left arrows) have different meanings in keyboard DnD mode, and handled separately in keyboardHandler
      if (
        keyboardHandler.isNavigationEvent(event) &&
        this._gantt.getEventManager().getKeyboardDnDMode() == null
      ) {
        return DvtGanttKeyboardHandler.getNextNavigable(this._gantt, this, event);
      }

      return null;
    }

    /**
     * @override
     */
    getTargetElem() {
      return this._task.getShape('main').getElem();
    }

    /**
     * @override
     */
    getKeyboardBoundingBox(targetCoordinateSpace) {
      return this.getDimensions(targetCoordinateSpace);
    }

    /**
     * @override
     */
    showKeyboardFocusEffect() {
      this._isShowingKeyboardFocusEffect = true;
      this._task.showEffect('focus');

      // Scroll task into view
      var previousViewportStart = this._gantt.getViewportStartTime();
      var previousViewportEnd = this._gantt.getViewportEndTime();

      this.scrollIntoView();

      // fire viewport change event if attempting to scroll into view causes viewport change
      if (
        this._gantt.getViewportStartTime() !== previousViewportStart ||
        this._gantt.getViewportEndTime() !== previousViewportEnd
      ) {
        this._gantt.dispatchEvent(this._gantt.createViewportChangeEvent());
      }
    }

    /**
     * @override
     */
    hideKeyboardFocusEffect() {
      if (this.isShowingKeyboardFocusEffect()) {
        this._isShowingKeyboardFocusEffect = false;
        this.hideHoverEffect();
      }
    }

    /**
     * @override
     */
    isShowingKeyboardFocusEffect() {
      return this._isShowingKeyboardFocusEffect;
    }

    //---------------------------------------------------------------------//
    // DnD Support: DvtDraggable impl                                      //
    //---------------------------------------------------------------------//
    /**
     * @override
     */
    isDragAvailable(clientIds) {
      return true;
    }

    /**
     * @override
     */
    getDragTransferable(mouseX, mouseY) {
      return [this.getId()];
    }

    /**
     * @override
     */
    getDragFeedback(mouseX, mouseY) {
      // return null to not use the default ghost image--show something specific in showDragFeedback method instead.
      return null;
    }
  }

  /**
   * Class representing a Gantt Row node.
   * @param {Gantt} gantt the Gantt component
   * @class
   * @constructor
   */
  class DvtGanttRowNode extends dvt.Container {
    constructor(gantt) {
      super(gantt.getCtx(), null);

      this._gantt = gantt;
      this._referenceObjects = [];
      this._gantt.getEventManager().associate(this, this);
      this.nodeType = 'row';
    }

    /**
     * Retrieve the data id of the row
     * @override
     */
    getId() {
      return this._rowObj['id'];
    }

    /**
     * Gets the gantt.
     * @return {Gantt} the gantt.
     */
    getGantt() {
      return this._gantt;
    }

    /**
     * Sets the layout object associated with this row node
     * @param {Object} rowObj Row layout object
     */
    setLayoutObject(rowObj) {
      this._rowObj = rowObj;
    }

    /**
     * Gets the layout object associated with this row node
     * @return {Object} The row layout object
     */
    getLayoutObject() {
      return this._rowObj;
    }

    /**
     * Gets the data associated with this row node
     * @param {boolean} isPublic Whether to retrieve a cleaned version of the data that would be publicly exposed
     * @return {Object} the data object
     */
    getData(isPublic) {
      if (isPublic) {
        return ojdvtTimecomponent.TimeComponent.sanitizeData(this._rowObj['data'], 'row');
      }
      return this._rowObj['data'];
    }

    /**
     * Retrieve the index of the row.
     * @return {number} the index of the row.
     */
    getIndex() {
      return this._rowObj['index'];
    }

    /**
     * Gets final y (animation independent, e.g. final y after animation finishes)
     * @return {number} The final y.
     */
    getFinalY() {
      return this._rowObj['y'];
    }

    /**
     * Retrieve the label of the row
     * @return {string} the label of the row
     */
    getLabel() {
      return this._rowObj['data']['label'];
    }

    /**
     * Sets the row label content object
     * @param {DvtGanttRowLabelContent} rowLabelText The row label content object
     */
    setRowLabelContent(rowLabelContent) {
      // On every rerender, row labels are cleared and re-created.
      // If a row label is focused, and the Gantt re-renders, then the old
      // focused row label is no longer in the DOM, and a new one is in its place.
      // This can happen if one keyboard focuses on the row label, and trigger an expand/collapse re-render.
      // The current focus needs to be updated to the new instance of the row label in that case.
      var eventManager = this._gantt.getEventManager();
      var lastFocused = eventManager.getFocus();
      if (
        this._rowLabelContent !== lastFocused &&
        lastFocused instanceof DvtGanttRowLabelContent &&
        lastFocused.getRow() === this
      ) {
        eventManager.setFocus(rowLabelContent);
        rowLabelContent.showKeyboardFocusEffect();
      }

      this._rowLabelContent = rowLabelContent;
    }

    /**
     * Gets the row label content object
     * @return {DvtGanttRowLabelContent} The row label content object
     */
    getRowLabelContent() {
      return this._rowLabelContent;
    }

    /**
     * Gets the horizontal line for the label in the row axis.
     * @return {dvt.Line} The row axis horizontal line.
     */
    getRowAxisHorizontalLine() {
      return this._rowAxisHorizontalLine;
    }

    /**
     * Gets the render state.
     * @return {string} the render state.
     */
    getRenderState() {
      return this._rowObj['renderState'];
    }

    /**
     * Retrieve task layout objs of the row.
     * @return {Array} an array of task layout objs.
     */
    getTaskObjs() {
      return this._rowObj['taskObjs'];
    }

    /**
     * Returns an array of task layout objects ordered as they should be rendered
     * @param {Array=} subsetTaskObjs A subset of taskObjs to consider. If not specified, all tasks in the row are used.
     * @return {Array} An array of task layout objects
     */
    getRenderOrderTaskObjs(subsetTaskObjs) {
      var taskObjs = subsetTaskObjs
        ? subsetTaskObjs.sort((a, b) => {
            return a.startTime - b.startTime;
          })
        : this._rowObj['taskObjs']; // taskObjs should already be sorted in chronological order

      if (this._rowObj['earliestOverlayTaskObj']) {
        var overlayTasks = [];
        var nonOverlayTasks = [];
        taskObjs.forEach((taskObj) => {
          if (taskObj['overlapBehavior'] === 'overlay') {
            overlayTasks.push(taskObj);
          } else {
            nonOverlayTasks.push(taskObj);
          }
        });
        // Push overlay tasks to the back so that they're always rendered on top
        return nonOverlayTasks.concat(overlayTasks);
      }
      return taskObjs;
    }

    /**
     * Renders tasks belonging to this row.
     * @param {Object=} subsetRenderOperations Object specifying a subset of tasks to render (see DvtGanttDataLayoutManager._computeViewportRenderOperations). If not specified all tasks are rendered.
     * @private
     */
    _renderTasks(subsetRenderOperations) {
      // Remove Tasks
      if (subsetRenderOperations) {
        subsetRenderOperations.tasksDelete.forEach((taskObj) => {
          taskObj.node.remove();
        });
      }

      // Update and Add Tasks in proper layering order
      // In the Add case, just appendChild through render call; layering will be correct
      // In the Update case:
      //    both for updateRender true (e.g. zoom) and updateRender false (e.g. translate):
      //      only explicitly appendChild to put it on top if:
      //        1) it overlaps with previous task.
      //        2) the previous task is newly added. Otherwise it's already layered correctly so no need to touch it.
      var taskObjs = this.getRenderOrderTaskObjs(
        subsetRenderOperations
          ? [...subsetRenderOperations.tasksAdd, ...subsetRenderOperations.tasksUpdate]
          : null
      );
      var taskObjsAdd = subsetRenderOperations ? subsetRenderOperations.tasksAdd : new Set();
      var shouldUpdateRender = !subsetRenderOperations || subsetRenderOperations.updateRender;
      var prevTaskObj;
      for (let i = 0; i < taskObjs.length; i++) {
        var taskObj = taskObjs[i];
        var taskNode = taskObj.node;
        if (!taskNode) {
          taskNode = new DvtGanttTaskNode(this._gantt);
          taskNode.setLayoutObject(taskObj);
          // eslint-disable-next-line no-param-reassign
          taskObj.node = taskNode;
        }

        var isTaskAdd = taskObjsAdd.has(taskObj);
        if (shouldUpdateRender || isTaskAdd) {
          var task = taskNode.getTask();
          var taskRepBounds = task.getTimeSpanDimensions(
            taskNode.getValue('start'),
            taskNode.getValue('end')
          );
          if (!taskRepBounds) {
            taskRepBounds = task.getTimeSpanDimensions(
              taskNode.getValue('baseline', 'start'),
              taskNode.getValue('baseline', 'end')
            );
          }
          // eslint-disable-next-line no-param-reassign
          taskObj.x = taskRepBounds.startPos;
          taskNode.render(this, true);
        }
        if (!isTaskAdd && prevTaskObj && taskObjsAdd.has(prevTaskObj)) {
          // Ensure current task is layered on top of the previous task
          this.addChild(taskNode);
        }

        prevTaskObj = taskObj;
      }

      // Need to render task labels (and resize handles) AFTER all task shapes are rendered for auto label positioning
      var renderLabelAndHandles = (taskObj) => {
        var taskNode = taskObj.node;
        var taskLabel = taskNode.getTaskLabel();
        var task = taskNode.getTask();
        taskLabel.setAssociatedShape(task.getShape('main'));
        taskLabel.render();

        // If resize enabled, render resize handles
        if (this._gantt.isTaskResizeEnabled()) {
          task.renderMainResizeHandles(taskNode);
        } else {
          task.removeHandles();
        }
      };

      for (let i = 0; i < taskObjs.length; i++) {
        var taskObj = taskObjs[i];
        var isTaskAdd = taskObjsAdd.has(taskObj);
        // (Re)render labels if at least one is true:
        //    - task marked for update
        //    - task is newly added to DOM
        //    - (first inner if) task not marked for update, but next adjacent task is newly added to DOM -- it's possible the label needs to truncate or move.
        //    - (the else if) task is newly added, but next adjacent tasks not marked for update. The added task can cause a necessary cascade of label positioning updates.
        if (shouldUpdateRender || isTaskAdd) {
          // If current task is added, and previous adjacent task in DOM, then additionally update the previous task's label rendering in case it should truncate/move.
          if (
            isTaskAdd &&
            !shouldUpdateRender &&
            taskObj.previousAdjacentTaskObj &&
            !taskObjsAdd.has(taskObj.previousAdjacentTaskObj) &&
            taskObj.previousAdjacentTaskObj.node &&
            taskObj.previousAdjacentTaskObj.node.getParent()
          ) {
            renderLabelAndHandles(taskObj.previousAdjacentTaskObj);
          }
          renderLabelAndHandles(taskObj);
        } else if (taskObjsAdd.has(taskObj.previousAdjacentTaskObj)) {
          // cascade the label updates on tasks not marked for updates until no more position changes
          var currTaskObj = taskObj;
          while (currTaskObj && !taskObjsAdd.has(currTaskObj)) {
            var taskLabel = currTaskObj.node.getTaskLabel();
            var prevLabelPosition = taskLabel.getEffectiveLabelPosition();
            renderLabelAndHandles(currTaskObj);
            currTaskObj =
              prevLabelPosition === taskLabel.getEffectiveLabelPosition()
                ? null
                : currTaskObj.nextAdjacentTaskObj;
          }
        }
      }
    }

    /**
     * Renders the row to specified container.
     * @param {dvt.Container=} container the container. If not provided, update render is assumed.
     */
    render(container, subsetRenderOperations) {
      this._renderTasks(subsetRenderOperations);
      this._renderBackground(this._gantt, this._gantt.getDatabodyBackground());
      this._renderReferenceObjects(this._gantt, this._gantt.getRowReferenceObjectsContainer());
      this._renderHorizontalGridline(this._gantt, this);

      if (container) {
        if (this._gantt.isRowAxisEnabled() && this._gantt.getRowAxis()) {
          this._finalizeRowLabelRender(this._gantt);
        }
        container.addChild(this);
      }

      // If there are no selected tasks in the row, remove any row selection effects
      if (!this.getTaskObjs().some((taskObj) => taskObj.node && taskObj.node.isSelected())) {
        this.removeEffect('selected');
      }
    }

    /**
     * Finalizes row label content rendering, called during row rendering.
     * @param {Gantt} gantt
     */
    _finalizeRowLabelRender(gantt) {
      var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
      var labelContent = this.getRowLabelContent();
      var top = this.getFinalY();
      var height = this._rowObj['height'];
      var options = gantt.getOptions();
      var startPadding = DvtGanttStyleUtils.getRowLabelPaddingStart(options);
      var endPadding = DvtGanttStyleUtils.getRowLabelPaddingEnd(options);
      var totalPadding = startPadding + endPadding;
      var rowAxis = gantt.getRowAxis();
      if (labelContent.getDisplayableType() === 'g') {
        var x = !isRTL ? startPadding : rowAxis.getWidth() - startPadding;
      } else {
        var labelDisplayable = labelContent.getDisplayable();
        if (labelDisplayable.isTruncated())
          labelDisplayable.setTextString(labelDisplayable.getUntruncatedTextString());

        // Truncate label to fit
        var container = labelContent.getDisplayableContainer();
        var rendered = dvt.TextUtils.fitText(
          labelDisplayable,
          rowAxis.getWidth() - totalPadding,
          height,
          container,
          1
        );
        if (!rendered && container) {
          container.removeFromParent();
        }

        // Always start align labels
        if (isRTL) {
          labelDisplayable.alignRight();
          x = rowAxis.getWidth() - startPadding;
        } else {
          x = startPadding;
        }
      }

      var y = top - labelContent.getYTopOffset() + (height - labelContent.getHeight()) / 2;
      labelContent.setRow(this);

      var finalStates = {
        x: x,
        y: y,
        // Reduce the rect size by 0.5 on all sides to ensure consistent rendering in all browsers
        // Otherwise one or more sides of the rect may go "outside" the component by 1px (e.g. in Chrome)
        backgroundX: 0.5,
        backgroundY: this._rowObj.y + 0.5,
        backgroundWidth: rowAxis.getWidth() - 0.5,
        backgroundHeight: this._rowObj.height - 0.5
      };

      // set "previous states" (current implementation, labels are new and have no knowledge of previous positions)
      var previousLabelState = this.getLabelState();
      if (previousLabelState) {
        labelContent.setY(previousLabelState['y']);
        labelContent.setX(previousLabelState['x']);

        var labelBackground = labelContent.getBackground();
        labelBackground.setRect(
          previousLabelState.backgroundX,
          previousLabelState.backgroundY,
          rowAxis.getWidth(), // set final state to suppress with animation, because the row axis width is not animated currently
          previousLabelState.backgroundHeight
        );
      }

      // Record final states
      this.recordLabelState(finalStates);

      this._gantt.getAnimationManager().preAnimateRowLabel(this, labelContent, finalStates);
    }

    /**
     * Renders the row background.
     * @param {Gantt} gantt The gantt component
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderBackground(gantt, container) {
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
        renderState = 'add';

        // Explicitly associate the row background with the DvtGanttRowNode, since the background is not a direct child.
        this._gantt.getEventManager().associate(this._background, this);
      }
      container.addChild(this._background);

      finalStates = {
        y: y,
        w: w,
        h: h
      };
      this._gantt
        .getAnimationManager()
        .preAnimateRowBackground(this._background, finalStates, renderState);
    }

    /**
     * Renders the row reference objects.
     * @param {Gantt} gantt The gantt component
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderReferenceObjects(gantt, container) {
      var refObjsData = this._rowObj['data']['referenceObjects'] || [];
      var eventManager = gantt.getEventManager();
      var animationManager = gantt.getAnimationManager();
      var y1 = this._rowObj['y'];
      var y2 = y1 + this._rowObj['height'];
      var prevY1 = y1;
      var prevY2 = y2;

      if (this._referenceObjects.length > 0) {
        // Get old y values for animation initial state (only heights are animated)
        prevY1 = this._referenceObjects[0].getY1();
        prevY2 = this._referenceObjects[0].getY2();
      }

      // Remove previous reference objects
      this._referenceObjects.forEach((refObj) => container.removeChild(refObj));

      // Render reference objects
      this._referenceObjects = gantt.generateReferenceObjects(refObjsData, 'area');

      this._referenceObjects.forEach((refObj) => {
        eventManager.associate(refObj, this);
        refObj.render(container, prevY1, prevY2);
        animationManager.preAnimateRowReferenceObject(refObj, { y1, y2 });
      });
    }

    /**
     * Gets the row background.
     * @return {dvt.Rect} The row background.
     */
    getBackground() {
      return this._background;
    }

    /**
     * Renders horizontal grid lines
     * @param {Gantt} gantt The gantt component
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderHorizontalGridline(gantt, container) {
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
        yOffset = (horizontalLineWidth % 2) * 0.5;
      var rowAxis = this._gantt.getRowAxis();
      var bRowAxisEnabled = this._gantt.isRowAxisEnabled() && rowAxis;

      if (gantt.isHorizontalGridlinesVisible()) {
        y1 = this._rowObj['y'] + this._rowObj['height'] + yOffset;
        y2 = y1;
        x1 = 0;
        x2 = gantt.getContentLength();

        if (!this._horizontalLine) {
          this._horizontalLine = new dvt.Line(gantt.getCtx(), x1, y1, x2, y2);
          this._horizontalLine.setPixelHinting(true);
          this._horizontalLine.setMouseEnabled(false);
          this._horizontalLine.setClassName(gridlineStyleClass, true);
          container.addChild(this._horizontalLine);
          renderState = 'add';
        }

        finalStates = {
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2
        };
        this._gantt
          .getAnimationManager()
          .preAnimateHorizontalGridline(this._horizontalLine, finalStates, renderState);

        // horizontal grid line in row axis
        if (bRowAxisEnabled) {
          var rowAxisHorizontalLineFinalStates = {
            x1: x1,
            x2: rowAxis.getWidth(),
            y1: y1,
            y2: y2
          };

          if (!this._rowAxisHorizontalLine) {
            this._rowAxisHorizontalLine = new dvt.Line(
              this._gantt.getCtx(),
              this._horizontalLine.getX1(),
              this._horizontalLine.getY1(),
              rowAxisHorizontalLineFinalStates['x2'],
              this._horizontalLine.getY2()
            );
            this._rowAxisHorizontalLine.setPixelHinting(true);
            this._rowAxisHorizontalLine.setClassName(gridlineStyleClass, true);
          }
          // row axis is cleared on rerender, so line would not be in DOM
          rowAxis.addHorizontalLine(this._rowAxisHorizontalLine);

          this._gantt
            .getAnimationManager()
            .preAnimateHorizontalGridline(
              this._rowAxisHorizontalLine,
              rowAxisHorizontalLineFinalStates,
              renderState
            );
        }
      } else {
        // TODO: Animate this?
        if (this._horizontalLine) {
          container.removeChild(this._horizontalLine);
        }
        this._horizontalLine = null;

        if (this._rowAxisHorizontalLine) {
          rowAxis.removeHorizontalLine(this._rowAxisHorizontalLine);
        }
        this._rowAxisHorizontalLine = null;
      }
    }

    /**
     * Shows the row effects
     * @param {string} effectType The effect type (selected, activeDrop)
     */
    showEffect(effectType) {
      const effectStyleClass = this._gantt.GetStyleClass(effectType);
      if (this._background) {
        // Skip adding effect class if it's already there.
        if (DvtGanttStyleUtils.hasClass(this._background, effectStyleClass)) {
          return;
        }
        this._background.addClassName(effectStyleClass);
      }
      const rowLabelContent = this.getRowLabelContent();
      if (rowLabelContent) {
        const rowLabelBackground = rowLabelContent.getBackground();
        if (rowLabelBackground) {
          rowLabelBackground.addClassName(effectStyleClass);
        }
      }
    }

    /**
     * Removes the row effects
     * @param {string} effectType The effect type (selected, activeDrop)
     */
    removeEffect(effectType) {
      const effectStyleClass = this._gantt.GetStyleClass(effectType);
      if (this._background) {
        // Skip removing effect class if it's not already there.
        if (!DvtGanttStyleUtils.hasClass(this._background, effectStyleClass)) {
          return;
        }
        this._background.removeClassName(effectStyleClass);
      }
      const rowLabelContent = this.getRowLabelContent();
      if (rowLabelContent) {
        const rowLabelBackground = rowLabelContent.getBackground();
        if (rowLabelBackground) {
          rowLabelBackground.removeClassName(effectStyleClass);
        }
      }
    }

    /**
     * Records the row label state.
     * @param {object} stateObj The object containing label state information
     */
    recordLabelState(stateObj) {
      this._rowLabelState = stateObj;
    }

    /**
     * Gets the row label state.
     * @return {object} The object containing label state information
     */
    getLabelState() {
      return this._rowLabelState;
    }

    /**
     * Removes itself.
     */
    remove() {
      var onEnd,
        self = this;

      onEnd = () => {
        // Remove background, which belongs to databodyBackground container
        if (self._background) {
          var backgroundParent = self._background.getParent();
          if (backgroundParent) {
            backgroundParent.removeChild(self._background);
          }
        }
        // Remove the row container (and its contents) itself.
        var parent = self.getParent();
        if (parent) {
          parent.removeChild(self);
        }
      };

      this._gantt.getAnimationManager().preAnimateRowNodeRemove(this, onEnd);
      this._removeRowLabel();
    }

    /**
     * Removes the row label.
     * @private
     */
    _removeRowLabel() {
      var rowLabelContent = this.getRowLabelContent(),
        rowAxis = this._gantt.getRowAxis(),
        rowLabelDisplayable,
        onEnd,
        self = this;

      if (rowLabelContent && rowAxis) {
        rowLabelDisplayable = rowLabelContent.getDisplayable();
        if (rowLabelDisplayable) {
          // Ensure the label is in the DOM before animating (row axis was cleared on rerender)
          if (rowLabelDisplayable.getParent() == null) {
            rowLabelContent.ensureInDOM();

            if (this._gantt.isHorizontalGridlinesVisible()) {
              rowAxis.addHorizontalLine(this._rowAxisHorizontalLine);
            }
          }

          onEnd = () => {
            rowLabelContent.remove();
            rowAxis.removeHorizontalLine(self._rowAxisHorizontalLine);
          };

          this._gantt
            .getAnimationManager()
            .preAnimateRowLabelRemove(rowLabelContent, this._rowAxisHorizontalLine, onEnd);
        }
      }
    }

    /**
     * Returns the data context (e.g. for DnD, etc.)
     * @return {object}
     */
    getDataContext() {
      return {
        rowData: this.getData(true),
        component: this._gantt.getOptions()['_widgetConstructor']
      };
    }

    /**
     * Scrolls the row into view.
     */
    scrollIntoView() {
      var viewportRect = this._gantt.getViewportDimensions();
      var deltaYTopVisible = Math.min(this._rowObj.y - viewportRect.y, 0);
      var deltaYBottomVisible = Math.max(
        0,
        this._rowObj.y + this._rowObj.height - (viewportRect.y + viewportRect.h)
      );
      var deltaY = deltaYTopVisible < 0 ? deltaYTopVisible : deltaYBottomVisible;
      this._gantt.panBy(0, deltaY);
    }
  }

  /**
   * Data view layout manager for Gantt
   * @param {Gantt} gantt the Gantt component
   * @class
   * @constructor
   */
  class DvtGanttDataLayoutManager {
    constructor(gantt) {
      this._gantt = gantt;
      this._ctx = gantt.getCtx();
      this._rowObjs = [];
      this._dependencyObjs = [];
      this._contentHeight = 0;
      this._prevHighlightedTaskObjs = new Set();
      this._prevDependencyObjs = new Set();
    }

    /**
     * Clears the row layout objects array
     */
    clear() {
      this._rowObjs = [];
      this._dependencyObjs = [];
      this._contentHeight = 0;

      this._prevViewport = null;
    }

    /**
     * Gets the row layout objects
     * @return {Array} an array of row layout objects
     */
    getRowObjs() {
      return this._rowObjs;
    }

    /**
     * Gets the dependency layout objects
     * @return {Array} an array of dependency layout objects
     */
    getDependencyObjs() {
      return this._dependencyObjs;
    }

    /**
     * Gets the height of the entire Gantt content
     * @return {number} the height of the gantt content area, including rows, gridlines, etc.
     */
    getContentHeight() {
      return this._contentHeight;
    }

    /**
     * Gets the number of tasks in the current viewport.
     * @return {number}
     */
    getNumViewportTasks() {
      return this._numViewportTasks;
    }

    /**
     * Helper method to convert ISO date string to milliseconds.
     * @param {string} date The query ISO date string
     * @return {number} date in milliseconds
     * @private
     */
    _getTime(date) {
      if (date == null || date === '') return null;
      var time = new Date(date).getTime();
      return isNaN(time) ? null : time;
    }

    /**
     * Determines whether given two intervals overlap
     * @param {number} s1 interval 1 start
     * @param {number} e1 interval 2 end
     * @param {number} s2 interval 1 start
     * @param {number} e3 interval 2 end
     * @param {boolean=} isClosedComparison True if closed interval comparison, else open. Default True (closed comparison).
     * @return {boolean} Whether the two intervals overlap
     * @private
     */
    _isIntervalOverlap(s1, e1, s2, e2, isClosedComparison) {
      // eslint-disable-next-line no-param-reassign
      isClosedComparison = isClosedComparison !== false; // default true
      return isClosedComparison ? s1 <= e2 && s2 <= e1 : s1 < e2 && s2 < e1;
    }

    /**
     * Determines whether given two tasks overlap chronologically
     * @param {Object} taskObj1 task layout object
     * @param {Object} taskObj2 task layout object
     * @return {boolean} Whether the two tasks overlap chronologically
     * @private
     */
    _isOverlap(taskObj1, taskObj2) {
      // Open interval comparison: if interval 1 ends at the same time interval 2 starts, they are still NOT overlapping.
      return this._isIntervalOverlap(
        taskObj1['overallStartTime'],
        taskObj1['overallEndTime'],
        taskObj2['overallStartTime'],
        taskObj2['overallEndTime'],
        false
      );
    }

    /**
     * Calculates height values of the task and stores them in the given task layout object
     * @param {Object} taskObj task layout object
     * @private
     */
    _calcTaskHeight(taskObj) {
      var options = this._gantt.getOptions();
      var context = this._gantt.getCtx();
      var taskDefaults = options['taskDefaults'];
      var taskProps = taskObj['data'];
      var progressProps = taskProps['progress'];
      var baselineProps = taskProps['baseline'];

      var isBaselineMilestone = false;
      var taskType = taskProps['type'] ? taskProps['type'] : taskDefaults['type'];

      var taskHeight = taskProps['height'] != null ? taskProps['height'] : taskDefaults['height'];
      var baselineHeight = 0;
      var baselineMarginTop = DvtGanttStyleUtils.getBaselineMarginTop(options);
      if (
        baselineProps &&
        !(taskObj['baselineStartTime'] == null && taskObj['baselineEndTime'] == null)
      ) {
        baselineHeight =
          baselineProps['height'] != null
            ? baselineProps['height']
            : taskDefaults['baseline']['height'];
        isBaselineMilestone =
          taskType === 'milestone' ||
          (taskType === 'auto' && taskObj['baselineStartTime'] === taskObj['baselineEndTime']);
        // If app didn't set a height value on the baseline or on the task defaults, then use the default height
        if (
          baselineProps['height'] == null &&
          taskDefaults['baseline']['height'] === DvtGanttStyleUtils.getBaselineTaskHeight(options)
        ) {
          baselineHeight = isBaselineMilestone
            ? DvtGanttStyleUtils.getActualTaskHeight(options, context)
            : taskDefaults['baseline']['height'];
        }
        // If app didn't set a height value on the task or on the task defaults, then use the default height for when the baseline is present
        if (
          taskProps['height'] == null &&
          taskDefaults['height'] === DvtGanttStyleUtils.getStandaloneTaskHeight(options)
        ) {
          taskHeight = DvtGanttStyleUtils.getActualTaskHeight(options, context);
        }
      }

      taskObj['height'] = taskHeight;
      taskObj['baselineHeight'] = baselineHeight;
      taskObj['overtimeHeight'] = taskHeight;
      taskObj['downtimeHeight'] = DvtGanttStyleUtils.getTaskDowntimeHeight(options);
      taskObj['attributeHeight'] = DvtGanttStyleUtils.getTaskAttributeHeight(options);
      var baselineBarMarginTop = baselineHeight > 0 ? baselineMarginTop : 0;

      var heightTaskToptoBaselineBottom = isBaselineMilestone
        ? DvtGanttStyleUtils.getMilestoneBaselineYOffset(options) +
          Math.max(baselineHeight, taskHeight)
        : taskHeight + baselineBarMarginTop + baselineHeight;
      taskObj['overallHeightNoProgress'] = heightTaskToptoBaselineBottom;
      taskObj['overallHeight'] = heightTaskToptoBaselineBottom;
      taskObj['progressHeight'] = 0;

      var isTaskMilestone =
        taskType === 'milestone' ||
        (taskType === 'auto' &&
          taskObj['startTime'] === taskObj['endTime'] &&
          taskObj['startTime'] != null);
      if (!isTaskMilestone && progressProps && typeof progressProps['value'] === 'number') {
        var progressHeight =
          progressProps['height'] != null
            ? progressProps['height']
            : taskDefaults['progress']['height'];
        progressHeight =
          progressHeight === '100%'
            ? taskHeight
            : DvtGanttStyleUtils.getSizeInPixels(progressHeight, taskHeight);
        taskObj['progressHeight'] = progressHeight;
        if (taskHeight < progressHeight) {
          taskObj['overallHeight'] = Math.max(
            progressHeight,
            (progressHeight - taskHeight) / 2 + heightTaskToptoBaselineBottom
          );
        }
      }
    }

    /**
     * Clears adjacency information of the given task layout object
     * @param {Object} taskObj The task layout object
     * @private
     */
    _clearAdjacency(taskObj) {
      taskObj['previousAdjacentTaskObj'] = null;
      taskObj['nextAdjacentTaskObj'] = null;
      taskObj['prevAdjMilestoneBaselineTaskObj'] = null;
      taskObj['nextAdjMilestoneBaselineTaskObj'] = null;
    }

    /**
     * Track row level baseline milestones (used later for label auto positioning, since baseline milestones can collide with labels)
     * O(blgb + cn) algo to find baseline milestones between tasks. Most cases b is small (few baseline milestones) so essentially linear time
     * @param {Object} rowObj The row layout object
     * @param {number} numRowLevels The number of row levels the row has
     * @private
     */
    _trackRowLevelBaselineMilestones(rowObj, numRowLevels) {
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
        var isBaselineMilestone =
          taskType === 'milestone' ||
          (taskType === 'auto' && taskObj['baselineStartTime'] === taskObj['baselineEndTime']);
        if (isBaselineMilestone) {
          rowLevelBaselineMilestonesObjs[taskObj['_rowLevel']].push(taskObj);
        }
      }
      for (var j = 0; j < numRowLevels; j++) {
        rowLevelBaselineMilestonesObjs[j].sort((a, b) => {
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
          } else if (
            baselineTime > currentTaskObjEndTime &&
            taskObj['nextAdjMilestoneBaselineTaskObj'] == null
          ) {
            taskObj['nextAdjMilestoneBaselineTaskObj'] = taskObjWithBaseline;
          } else if (
            baselineTime === currentTaskObjStartTime ||
            baselineTime === currentTaskObjEndTime
          ) {
            baselineMilestoneObjs.pop();
          }
        }
      }
    }

    /**
     * Calculates the height of the row (and those of the tasks within it) and stores them in the given row layout object.
     * @param {Object} rowObj The row layout object
     * @param {number} horizontalLineHeightOffset The horizontal line height
     * @private
     */
    _calcRowTaskYHeight(rowObj, horizontalLineHeightOffset) {
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
        var overlapBehavior =
          taskOverlapBehavior != null ? taskOverlapBehavior : defaultOverlapBehavior;
        overlapBehavior =
          overlapBehavior === 'auto'
            ? rowDefaultsHeight == null
              ? 'stack'
              : 'stagger'
            : overlapBehavior;
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

              taskObj['_staggerDirection'] =
                previousTaskObj['_staggerDirection'] != null
                  ? -previousTaskObj['_staggerDirection']
                  : -1;
              taskObj['y'] =
                previousTaskObj['y'] - taskObj['_staggerDirection'] * effectiveOverlapOffset;
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

      rowObj['earliestOverlayTaskObj'] = earliestOverlayTaskObj;

      // Add padding to task y when row height is not fixed
      var rowPaddingTop = DvtGanttStyleUtils.getRowPaddingTop(options);
      var rowPaddingBottom = DvtGanttStyleUtils.getRowPaddingBottom(options);

      // In alta only, rowheight = row paddings + OVERALL task height (including baseline)
      // Otherwise, the baseline is not included in row height calculation
      // i.e. rowheight = row paddings + task height excluding baseline
      var taskHeightProp =
        this._gantt.getCtx().getThemeBehavior() === 'alta' ? 'overallHeight' : 'height';

      if (rowDefaultsHeight == null) {
        // Figure out offset based on row level height
        if (overlapOffset == null) {
          var rowLevelHeights = rowLevelRecentTaskObjs.map(() => {
            return 0;
          });
          taskObjs.forEach((taskObj) => {
            if (taskObj[taskHeightProp] > rowLevelHeights[taskObj['_rowLevel']]) {
              rowLevelHeights[taskObj['_rowLevel']] = taskObj[taskHeightProp];
            }
          });
          var rowLevelCumHeightsWithPadding = rowLevelHeights
            .map((rowLevelHeight) => {
              return rowLevelHeight + rowPaddingTop + rowPaddingBottom;
            })
            .reduce((acc, curr, i) => {
              acc.push((acc[i - 1] || 0) + curr);
              return acc;
            }, []);
          taskObjs.forEach((taskObj) => {
            taskObj['y'] +=
              (rowLevelCumHeightsWithPadding[taskObj['_rowLevel'] - 1] || 0) + rowPaddingTop;
          });

          // TODO: Consider moving this calculation call to when row rendering actually happens to alleviate layout calculation time
          this._trackRowLevelBaselineMilestones(rowObj, rowLevelRecentTaskObjs.length);
        } else {
          taskObjs.forEach((taskObj) => {
            taskObj['y'] += rowPaddingTop;
          });
        }
      }

      var overlapChainHeights = overlapChains.map((chain) => {
        var chainHeight = 0;
        chain.forEach((chainTaskObj) => {
          var distanceFromBottomToRowTop = chainTaskObj['y'] + chainTaskObj[taskHeightProp];
          if (distanceFromBottomToRowTop > chainHeight) {
            chainHeight = distanceFromBottomToRowTop;
          }
        });
        return chainHeight;
      });

      if (rowDefaultsHeight == null) {
        // If no tasks in the row, still show empty row with height as if a single task is there.
        if (taskObjs.length === 0) {
          rowObj['height'] =
            DvtGanttStyleUtils.getStandaloneTaskHeight(options) + rowPaddingTop + rowPaddingBottom;
          return;
        }
        // Grow the row height to accommodate everything
        rowObj['height'] =
          overlapChainHeights.reduce((a, b) => {
            return Math.max(a, b);
          }) + rowPaddingTop;
        // If no overlapping offset specified: Mid align task within its row level
        if (overlapOffset == null) {
          overlapChains.forEach((chain, i) => {
            chain.forEach((taskObj) => {
              var rowLevelHeight = rowLevelHeights[taskObj['_rowLevel']];
              taskObj['y'] += (rowLevelHeight - taskObj['overallHeight']) / 2 + rowObj['y'];
            });
          });
        } else {
          // Otherwise align all tasks to top (with offset)
          overlapChains.forEach((chain, i) => {
            chain.forEach((taskObj) => {
              taskObj['y'] += rowObj['y'];
            });
          });
        }
      } else {
        // Fix the row height and mid align everything
        rowObj['height'] = rowDefaultsHeight - horizontalLineHeightOffset;
        overlapChains.forEach((chain, i) => {
          var chainHeight = overlapChainHeights[i];
          var minTaskY = Number.MAX_VALUE;
          chain.forEach((taskObj) => {
            taskObj['y'] += Math.floor((rowObj['height'] - taskObj[taskHeightProp]) / 2);
            if (taskObj['y'] < minTaskY) {
              minTaskY = taskObj['y'];
            }
          });
          var offsetFromRowCenter = Math.floor((rowObj['height'] - chainHeight) / 2) - minTaskY;
          chain.forEach((taskObj) => {
            if (taskObj['overlapBehavior'] === 'overlay') {
              taskObj['y'] += rowObj['y'];
            } else {
              taskObj['y'] += rowObj['y'] + offsetFromRowCenter;
            }
          });
        });
      }
    }

    /**
     * Calculates and stores the task aggregation identity, i.e. "stackStart", "stackMiddle", "stackEnd", "stackSolo"
     * to achieve the adjacent task stack visual treatment.
     * @param {Object} rowObj The row layout object. Assumes the taskObjs are sorted by time.
     * @private
     */
    _calcTaskAggregation(rowObj) {
      // tasks are stacked if the next task starts exactly when the current task ends
      // and if they're both non-milestones and of the same height and border radius
      var isSameStack = (taskObj, nextTaskObj) => {
        return (
          taskObj['endTime'] === nextTaskObj['startTime'] &&
          taskObj['startTime'] !== taskObj['endTime'] &&
          nextTaskObj['startTime'] !== nextTaskObj['endTime'] &&
          taskObj['height'] == nextTaskObj['height'] && // '==' for mixed null and undefined equality
          taskObj['data']['borderRadius'] == nextTaskObj['data']['borderRadius']
        );
      };

      var taskObjs = rowObj['taskObjs'];
      if (taskObjs.length === 0) {
        return;
      }
      if (taskObjs.length === 1) {
        taskObjs[0]['aggregation'] = 'stackSolo';
        return;
      }
      if (taskObjs.length === 2) {
        if (isSameStack(taskObjs[0], taskObjs[1])) {
          taskObjs[0]['aggregation'] = 'stackStart';
          taskObjs[1]['aggregation'] = 'stackEnd';
        } else {
          taskObjs[0]['aggregation'] = 'stackSolo';
          taskObjs[1]['aggregation'] = 'stackSolo';
        }
        return;
      }

      // first and last task
      taskObjs[0]['aggregation'] = isSameStack(taskObjs[0], taskObjs[1]) ? 'stackStart' : 'stackSolo';
      taskObjs[taskObjs.length - 1]['aggregation'] = isSameStack(
        taskObjs[taskObjs.length - 2],
        taskObjs[taskObjs.length - 1]
      )
        ? 'stackEnd'
        : 'stackSolo';

      for (var i = 1; i < taskObjs.length - 1; i++) {
        var prevTaskObj = taskObjs[i - 1];
        var currTaskObj = taskObjs[i];
        var nextTaskObj = taskObjs[i + 1];

        if (isSameStack(prevTaskObj, currTaskObj) && isSameStack(currTaskObj, nextTaskObj)) {
          currTaskObj['aggregation'] = 'stackMiddle';
        } else if (isSameStack(prevTaskObj, currTaskObj)) {
          currTaskObj['aggregation'] = 'stackEnd';
        } else if (isSameStack(currTaskObj, nextTaskObj)) {
          currTaskObj['aggregation'] = 'stackStart';
        } else {
          currTaskObj['aggregation'] = 'stackSolo';
        }
      }
    }

    /**
     * Generate an array of row layout objects given the rows data array
     * @param {Array} rows The rows data array
     * @return {Array} The row layout objects array
     * @private
     */
    _generateRowObjs(rows) {
      var options = this._gantt.getOptions();
      var horizontalLineHeightOffset = 0;
      if (this._gantt.isHorizontalGridlinesVisible())
        horizontalLineHeightOffset = DvtGanttStyleUtils.getHorizontalGridlineWidth(options);

      var rowObjs = [];
      var top = 0;
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var tasks = row['tasks'];
        if (tasks != null) {
          var rowObj = {
            id: row['id'] != null ? row['id'] : tasks.length > 0 ? tasks[0]['id'] : null,
            data: row,
            index: i,
            y: top,
            renderState: 'add'
          };
          // Hierarchical data case
          if (row['_depth'] != null) {
            rowObj['depth'] = row['_depth'];
            rowObj['expanded'] = row['_expanded'];
            // child rows are always below its parent row, so at this point it must be that the parent row index < rowObjs.length
            rowObj['parent'] =
              row['_parentFlatIndex'] == null ? null : rowObjs[row['_parentFlatIndex']];
            row['_depth'] = undefined;
            row['_expanded'] = undefined;
            row['_parentFlatIndex'] = undefined;
            row['_flatIndex'] = undefined;
          }

          var taskObjs = [];
          for (var j = 0; j < tasks.length; j++) {
            var task = tasks[j];
            var taskObj = {
              id: task['id'],
              data: task,
              startTime:
                task['start'] && task['start'] !== ''
                  ? this._getTime(task['start'])
                  : this._getTime(task['end']),
              endTime:
                task['end'] && task['end'] !== ''
                  ? this._getTime(task['end'])
                  : this._getTime(task['start']),
              rowObj: rowObj,
              predecessorDepObjs: [],
              successorDepObjs: [],
              renderState: 'add'
            };

            var overallStartTime = taskObj['startTime'];
            var overallEndTime = taskObj['endTime'];
            var baseline = task['baseline'];
            if (baseline) {
              var baselineStartTime =
                baseline['start'] && baseline['start'] !== ''
                  ? this._getTime(baseline['start'])
                  : this._getTime(baseline['end']);
              var baselineEndTime =
                baseline['end'] && baseline['end'] !== ''
                  ? this._getTime(baseline['end'])
                  : this._getTime(baseline['start']);
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
            var overtime = task['overtime'];
            if (overtime) {
              // overtime must span within the containing task
              var overtimeStartTime =
                overtime['start'] && taskObj['startTime']
                  ? Math.max(this._getTime(overtime['start']), taskObj['startTime'])
                  : null;
              var overtimeEndTime =
                overtime['end'] && taskObj['endTime']
                  ? Math.min(this._getTime(overtime['end']), taskObj['endTime'])
                  : null;
              if (!(overtimeStartTime == null && overtimeEndTime == null)) {
                taskObj['overtimeStartTime'] = overtimeStartTime;
                taskObj['overtimeEndTime'] = overtimeEndTime;
              } else {
                taskObj['overtimeStartTime'] = overtimeStartTime;
                taskObj['overtimeEndTime'] = overtimeEndTime;
              }
            }
            var downtime = task['downtime'];
            if (downtime) {
              // downtime must span within the containing task
              var downtimeStartTime =
                downtime['start'] && taskObj['startTime']
                  ? Math.max(this._getTime(downtime['start']), taskObj['startTime'])
                  : null;
              var downtimeEndTime =
                downtime['end'] && taskObj['endTime']
                  ? Math.min(this._getTime(downtime['end']), taskObj['endTime'])
                  : null;
              if (!(downtimeStartTime == null && downtimeEndTime == null)) {
                taskObj['downtimeStartTime'] = downtimeStartTime;
                taskObj['downtimeEndTime'] = downtimeEndTime;
              } else {
                taskObj['downtimeStartTime'] = downtimeStartTime;
                taskObj['downtimeEndTime'] = downtimeEndTime;
              }
            }
            if (overallStartTime != null && overallEndTime != null) {
              taskObj['overallStartTime'] = overallStartTime;
              taskObj['overallEndTime'] = overallEndTime;
              taskObjs.push(taskObj);
            }
          }
          taskObjs.sort((a, b) => {
            return a['startTime'] - b['startTime'];
          });
          rowObj['taskObjs'] = taskObjs;
          rowObjs.push(rowObj);

          this._calcRowTaskYHeight(rowObj, horizontalLineHeightOffset);
          top += rowObj['height'] + horizontalLineHeightOffset;

          if (options['taskAggregation'] === 'on') {
            this._calcTaskAggregation(rowObj);
          }
        }
      }

      return rowObjs;
    }

    /**
     * Generate an array of dependency layout objects given the dependency data array
     * @param {Array} dependencies The dependency data array
     * @param {*=} idTaskObjMap ojMap keyed by task ids valued by task layout objects
     * @return {Array} The dependency layout objects array
     * @private
     */
    _generateDependencyObjs(dependencies, idTaskObjMap) {
      var idTaskObjMap = idTaskObjMap || this._createIdObjMap(this._rowObjs, 'taskObjs');
      idTaskObjMap.forEach((taskObj, id) => {
        taskObj.successorDepObjs = [];
        taskObj.predecessorDepObjs = [];
      });
      var dependencyObjs = [];

      for (var i = 0; i < dependencies.length; i++) {
        var dependency = dependencies[i];
        var predecessorId = dependency['predecessorTaskId'];
        var successorId = dependency['successorTaskId'];
        var type =
          dependency['type'] == null ? DvtGanttDependencyNode.FINISH_START : dependency['type'];

        var isPredecessorIdValid = predecessorId != null && idTaskObjMap.has(predecessorId);
        var isSuccessorIdValid = successorId != null && idTaskObjMap.has(successorId);

        // make sure all the mandatory fields are available and valid
        if (
          DvtGanttDependencyNode._isValidType(type) &&
          isPredecessorIdValid &&
          isSuccessorIdValid &&
          !dvt.Obj.compareValues(this._ctx, predecessorId, successorId)
        ) {
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

          // In mobile (and test), all aria-labels are computed upfront
          // Task aria-label are computed on render and includes dependency info.
          // Dependency lines are rendered after tasks are rendered,
          // so dependency info needs to be available beforehand.
          // For simplicity, we precompute all the dependency info upfront here.
          var desc = dependency.shortDesc;
          if (desc == null) {
            var translations = this._gantt.getOptions().translations;
            var key = translations[type + 'DependencyAriaDesc'];
            desc = dvt.ResourceUtils.format(translations.accessibleDependencyInfo, [
              key,
              predecessorId,
              successorId
            ]);
          }

          var dependencyObj = {
            id: dependency['id'],
            data: dependency,
            index: i,
            type: type,
            predecessorTaskObj: predecessorTaskObj,
            successorTaskObj: successorTaskObj,
            rowObjTop: rowObjTop,
            rowObjBottom: rowObjBottom,
            ariaLabel: desc
          };
          predecessorTaskObj.successorDepObjs.push(dependencyObj);
          successorTaskObj.predecessorDepObjs.push(dependencyObj);
          dependencyObjs.push(dependencyObj);
        }
      }
      // First sort dependency objs by row top indices, store that information,
      // then finally sort by row bottom indices. This allows us to efficiently
      // find out the set of dependencies crossing the current viewport later.
      dependencyObjs.sort((a, b) => {
        return a['rowObjTop']['index'] - b['rowObjTop']['index'];
      });
      for (var j = 0; j < dependencyObjs.length - 1; j++) {
        dependencyObjs[j]['nextTopDependencyObj'] = dependencyObjs[j + 1];
        dependencyObjs[j + 1]['prevTopDependencyObj'] = dependencyObjs[j];
      }
      dependencyObjs.sort((a, b) => {
        return a['rowObjBottom']['index'] - b['rowObjBottom']['index'];
      });

      return dependencyObjs;
    }

    /**
     * Creates a map keyed by ids and valued by layout objects
     * @param {Array} layoutObjects The array of layout objects
     * @param {string=} subObjsProp Optional string to specify the layout objects array is a sub property of the given layoutObjects
     * @return {*} An ojMap
     * @private
     */
    _createIdObjMap(layoutObjs, subObjsProp) {
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
    }

    /**
     * Takes the set difference of the provided layoutObjs ids and ids in the provided ojMap
     * and mark the resulting set of layout objects with the given renderState
     * @param {Array} layoutObjs The array of layout objects
     * @param {*} idObjMap The ojMap keyed by ids and valued by layout objects
     * @param {string} renderState The render state to mark the resulting set of layout objects as
     * @param {string=} subObjsProp Optional string to specify the layout objects array is a sub property of the given layoutObjects
     * @private
     */
    _setDifferenceRenderState(layoutObjs, idObjMap, renderState, subObjsProp) {
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
          layoutObj['renderState'] = renderState;
          // explicitly call remove() on 'deleted' rows that are in the DOM
          if (renderState === 'delete') {
            var node = layoutObj['node'];
            if (node && node.getParent()) {
              node.remove();
            }
          }
        }
      }
    }

    /**
     * Takes the set intersection of the ids in the provided old ojMap and ids of the new layout objects
     * and mark the resulting set of new layout objects with the appropriate render states ('exist' or 'migrate')
     * @param {*} oldIdObjsMap The ojMap keyed by ids and valued by old layout objects
     * @param {Array} newObjs The array of new layout objects
     * @param {string=} subObjsProp Optional string to specify the layout objects array is a sub property of the given layoutObjects
     * @private
     */
    _setIntersectionRenderState(oldIdObjsMap, newObjs, subObjsProp) {
      for (var i = 0; i < newObjs.length; i++) {
        var newObj = newObjs[i];
        if (subObjsProp) {
          var newSubObjs = newObj[subObjsProp];
          for (var j = 0; j < newSubObjs.length; j++) {
            var newSubObj = newSubObjs[j];
            var entangledOldSubObj = oldIdObjsMap.get(newSubObj['id']);
            if (entangledOldSubObj) {
              if (
                dvt.Obj.compareValues(this._ctx, entangledOldSubObj['rowObj']['id'], newObj['id'])
              ) {
                newSubObj['renderState'] = 'exist';
              } else {
                newSubObj['renderState'] = 'migrate';
                var subNode = entangledOldSubObj['node'];
                // If not animating and task node migrates, explicitly remove from the original row.
                // Normally if the final new row exists, adding the task node to the new row would automatically remove it
                // from the original row. However, the new row may not be in the DOM, so we should explicitly remove it.
                if (
                  subNode &&
                  subNode.getParent() &&
                  this._gantt.getAnimationManager().getAnimationMode() === 'none'
                ) {
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
    }

    /**
     * Add to the set of animation final state row objects. Resets at the end of renderViewport().
     * @param {Object} rowObj The row layout object.
     * @param {Object=} taskObj task layout object associated with the row known to participate in animation.
     * @private
     */
    _addAnimationFinalStateRowObjs(rowObj, taskObj) {
      // Keys: rowObjs, Values: Set( specific taskObjs participating in animation if known )
      this._animationFinalStateRowObjs = this._animationFinalStateRowObjs || new Map();
      if (!this._animationFinalStateRowObjs.has(rowObj)) {
        this._animationFinalStateRowObjs.set(rowObj, new Set());
      }
      if (taskObj) {
        this._animationFinalStateRowObjs.get(rowObj).add(taskObj);
      }
    }

    /**
     * In the animation case, we need to be able to show progression of initial to final states.
     * All initial state elements need to be present in the DOM, and all final state elements need to be rendered.
     * Due to complications of possible viewport shifts horizontally, entire old rows are rendered regardless of viewport.
     * TODO: Revisit this when we need to fully support animating horizontal viewport/timeaxis change animations.
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
    _prepareAnimationDOM(
      newRowObjs,
      oldRowIdObjsMap,
      newRowIdObjsMap,
      oldTaskIdObjsMap,
      newTaskIdObjsMap
    ) {
      var animationManager = this._gantt.getAnimationManager();
      var animationMode = animationManager.getAnimationMode();

      // temporarily turn off animation
      animationManager.setAnimationMode('none');

      this._animationInitialStateRowObjsDelete = [];

      // Find out what the final viewport is
      // Need to temporarily update the contentHeight to the final state contentHeight so that the bounded scrollPosition can be calculated for the final state
      var initialContentHeight = this._contentHeight;
      var newLastRowObj = newRowObjs[newRowObjs.length - 1];
      this._contentHeight = newLastRowObj['y'] + newLastRowObj['height'];
      var finalTranslateY = this._gantt.scrollPositionToTranslateY(
        this._gantt.getOptions()['scrollPosition']
      );
      var viewportYBounds = this._gantt.getViewportYBounds(finalTranslateY);
      var yMin = viewportYBounds['yMin'];
      var yMax = viewportYBounds['yMax'];
      this._contentHeight = initialContentHeight;

      var oldViewportRowIndRange = this.findRowIndRange(this._rowObjs, yMin, yMax);
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
            this._addAnimationFinalStateRowObjs(entangledNewRowObj);
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
                }

                // Final state layout object: NEW row (which includes the task from OLD viewport)
                this._addAnimationFinalStateRowObjs(entangledTaskNewRowObj, entangledNewTaskObj);
              }
            }
          }
        }
      }

      var newViewportRowIndRange = this.findRowIndRange(newRowObjs, yMin, yMax);
      var newMinRowInd = newViewportRowIndRange['minRowInd'];
      var newMaxRowInd = newViewportRowIndRange['maxRowInd'];
      for (var i = newMinRowInd; i <= newMaxRowInd; i++) {
        var newRowObj = newRowObjs[i];
        if (newRowObj) {
          // NEW row in the NEW viewport (final state row layout object)
          this._addAnimationFinalStateRowObjs(newRowObj);

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
                this.ensureInDOM(entangledOldTaskObj, 'task');

                // Final state row layout object: NEW version of the OLD row
                var newEntangledTaskOldRowObj = newRowIdObjsMap.get(entangledTaskOldRowObj['id']);
                if (newEntangledTaskOldRowObj) {
                  this._addAnimationFinalStateRowObjs(newEntangledTaskOldRowObj, newTaskObj);
                }
              }
            }
          }
        }
      }
      // reapply animation mode
      animationManager.setAnimationMode(animationMode);
    }

    /**
     * Given a set of new row layout objects, associate all the layout objects with their existing nodes and vice versa
     * @param {Array} newRowObjs Array of new row objects
     * @private
     */
    _associateOldNodesAndNewLayoutObjs(newRowObjs) {
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
    }

    /**
     * Calculates layout information from data supplied in component options.
     */
    calcLayout() {
      var options = this._gantt.getOptions();
      var ganttRenderState = this._gantt.getRenderState();
      if (ganttRenderState == null) {
        var newTaskIdObjsMap = this._calcRowsLayout(options);
      } else {
        // For now, renderState is only non-null for expand/collapse case
        this._expandCollapseRowObject(
          options,
          ganttRenderState['state'],
          ganttRenderState['payload']
        );
      }

      if (this._rowObjs.length > 0) {
        var lastRowObj = this._rowObjs[this._rowObjs.length - 1];
        this._contentHeight = lastRowObj['y'] + lastRowObj['height'];

        var dependencies = options['dependencies'];
        if (dependencies != null && dependencies.length > 0) {
          this._dependencyObjs = this._generateDependencyObjs(dependencies, newTaskIdObjsMap);
        }
      }
    }

    /**
     * Calculates row layout objects from options
     * @param {Object} options
     * @return {*} If one is generated, an ojMap keyed by task ids valued by task layout objects. undefined otherwise
     * @private
     */
    _calcRowsLayout(options) {
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
        var newTaskIdObjsMap = this._createIdObjMap(newRowObjs, 'taskObjs');

        // Row Difference Analysis:
        // Each old row object either continues to exist, or is removed
        // Each new row object either existed, or is added
        // In other words:
        //     set(old) - set(new) are removed
        //     set(new) - set(old) are added
        //     intersect(set(old), set(new)) are updated
        this._setDifferenceRenderState(this._rowObjs, newRowIdObjsMap, 'delete');
        this._setDifferenceRenderState(newRowObjs, oldRowIdObjsMap, 'add');
        this._setIntersectionRenderState(oldRowIdObjsMap, newRowObjs);

        // Task Difference Analysis:
        // Each old task object can be removed, updated in its row, or migrated to another row
        // Each new task object can be added, updated in its row, or migrated to another row
        // In other words:
        //     set(old) - set(new) are removed
        //     set(new) - set(old) are added
        //     intersect(set(old), set(new)) are updated, either in its old row or migrated to another row
        this._setDifferenceRenderState(this._rowObjs, newTaskIdObjsMap, 'delete', 'taskObjs');
        this._setDifferenceRenderState(newRowObjs, oldTaskIdObjsMap, 'add', 'taskObjs');
        this._setIntersectionRenderState(oldTaskIdObjsMap, newRowObjs, 'taskObjs');

        // Ensure DOM is complete enough to be able to show progression of initial to final states.
        if (this._gantt.getAnimationManager().getAnimationMode() !== 'none') {
          this._prepareAnimationDOM(
            newRowObjs,
            oldRowIdObjsMap,
            newRowIdObjsMap,
            oldTaskIdObjsMap,
            newTaskIdObjsMap
          );
        }

        // Associate nodes with the new layout objects. This is done after old nodes rendering in the animation case above
        // so that the old nodes can use the old layout objects for rendering.
        this._associateOldNodesAndNewLayoutObjs(newRowObjs);
      }

      this._rowObjs = newRowObjs;
      return newTaskIdObjsMap;
    }

    /**
     * Returns whether given row obj represents a row that can be expanded.
     * @param {Object} rowObj The layout object
     */
    isRowExpandable(rowObj) {
      // leaf
      if (rowObj['expanded'] == null) {
        return false;
      }

      var options = this._gantt.getOptions();
      var expandedKeySet = options['expanded'];
      var rowKey = rowObj['id'];

      return !expandedKeySet.has(rowKey);
    }

    /**
     * Returns whether given row obj represents a row that can be collapsed.
     * @param {Object} rowObj The layout object
     */
    isRowCollapsible(rowObj) {
      // leaf
      if (rowObj['expanded'] == null) {
        return false;
      }

      var options = this._gantt.getOptions();
      var expandedKeySet = options['expanded'];
      var rowKey = rowObj['id'];

      return expandedKeySet.has(rowKey);
    }

    /**
     * Modify the row layout objects in place by adding new rowObjs if expand and removing rowObjs if collapse,
     * and update all layout positions and animation states.
     * @param {Object} options
     * @param {string} type Either 'expand' or 'collapse'
     * @param {Object} rowObj The layout object of the row being expanded/collapsed
     * @private
     */
    _expandCollapseRowObject(options, type, rowObj) {
      var self = this;
      var index = rowObj['index'];
      var row = rowObj['data'];
      var rowChildren = row['rows'];
      var expandedKeySet = options['expanded'];
      var animationManager = this._gantt.getAnimationManager();
      var animationMode = animationManager.getAnimationMode();
      var isAnimationOn = animationMode !== 'none';
      if (isAnimationOn) {
        var oldViewportYBounds = this._gantt.getViewportYBounds(finalTranslateY);
        var oldYMin = oldViewportYBounds['yMin'];
        var oldYMax = oldViewportYBounds['yMax'];
        var oldViewportHeight = oldYMax - oldYMin;

        var addShiftedRowsToFinalState = (rowObjs, startInd, viewportHeight) => {
          // Rather than doing heavy diffing, note that at most a viewportHeight's worth
          // of rows are shifted due to expand/collapse, so let's just add all of them
          // to the final state even if some of them are not (going to be) visible
          animationManager.setAnimationMode('none');
          var runningHeight = 0;
          for (var i = startInd; i < rowObjs.length; i++) {
            var rowObj = rowObjs[i];
            // Entire row is rendered, but at the end of animation the viewport is refreshed
            // with only viewport elements.
            self.ensureInDOM(rowObj, 'row');
            self._addAnimationFinalStateRowObjs(rowObj);
            runningHeight += rowObj['height'];
            if (runningHeight > viewportHeight) {
              break;
            }
          }
          animationManager.setAnimationMode(animationMode);
        };
      }

      var applyRenderState = (rowObjs, state, begin, end) => {
        for (var i = begin; i < end; i++) {
          var rowObj = rowObjs[i];
          rowObj['renderState'] = state;
          // explicitly call remove() on 'deleted' rows that are in the DOM
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
      };

      // Add/remove rowObjs from the this._rowObjs depending on expand/collapse, and update
      // animation states.
      rowObj['expanded'] = type === 'expand';
      row['_expanded'] = rowObj['expanded'];
      applyRenderState(this._rowObjs, 'exist', 0, this._rowObjs.length);
      if (type === 'expand') {
        var flattenedChildrenRows = this._flattenRows(
          rowChildren,
          expandedKeySet,
          0,
          rowObj['depth'] + 1
        );
        var flattenedChildrenRowObjs = this._generateRowObjs(flattenedChildrenRows);
        // Any children rows with null parents should point to the current rowObj that triggered the collapse:
        flattenedChildrenRowObjs.forEach((r) => (r.parent = r.parent || rowObj));
        applyRenderState(flattenedChildrenRowObjs, 'add', 0, flattenedChildrenRowObjs.length);
        if (isAnimationOn) {
          addShiftedRowsToFinalState(this._rowObjs, index, oldViewportHeight);
        }
        this._rowObjs = this._rowObjs
          .slice(0, index + 1)
          .concat(flattenedChildrenRowObjs, this._rowObjs.slice(index + 1, this._rowObjs.length));
      } else {
        var flattenedChildrenRowsLength = this._calcFlattenedRowsLength(rowChildren, expandedKeySet);
        applyRenderState(this._rowObjs, 'delete', index + 1, index + 1 + flattenedChildrenRowsLength);
        if (isAnimationOn) {
          addShiftedRowsToFinalState(
            this._rowObjs,
            index + 1 + flattenedChildrenRowsLength,
            oldViewportHeight
          );
        }
        var removedChildren = this._rowObjs.splice(index + 1, flattenedChildrenRowsLength);
        if (isAnimationOn) {
          // For rows with labels in view getting deleted, we need to make sure their labels
          // are in the DOM initially--we'll do this in renderViewport after the row axis is cleared
          this._animationInitialStateRowObjsDelete = removedChildren;
        }
      }

      // Update layout positions of all rows under the row being expanded/collapsed
      var horizontalLineHeightOffset = 0;
      if (this._gantt.isHorizontalGridlinesVisible())
        horizontalLineHeightOffset = DvtGanttStyleUtils.getHorizontalGridlineWidth(options);

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
        var finalTranslateY = this._gantt.scrollPositionToTranslateY(
          this._gantt.getOptions()['scrollPosition']
        );
        var finalViewportYBounds = this._gantt.getViewportYBounds(finalTranslateY);
        var finalYMin = finalViewportYBounds['yMin'];
        var finalYMax = finalViewportYBounds['yMax'];
        var newViewportRowIndRange = this.findRowIndRange(this._rowObjs, finalYMin, finalYMax);
        var newMinRowInd = newViewportRowIndRange['minRowInd'];
        var newMaxRowInd = newViewportRowIndRange['maxRowInd'];

        for (var k = newMinRowInd; k <= newMaxRowInd; k++) {
          this._addAnimationFinalStateRowObjs(this._rowObjs[k]);
        }
      }
    }

    /**
     * Flattens hierarchical row structure
     * @param {Array} rows The hierarchical rows data array
     * @param {*} expandedKeySet The expanded key set
     * @param {number=} flatIndex The current flat index. Assumed to be 0 (root) if not specified
     * @param {number=} depth The current depth. Assumed to be 0 (root) if not specified
     * @return {Array} Flattened array
     * @private
     */
    _flattenRows(rows, expandedKeySet, flatIndex, depth) {
      flatIndex = flatIndex || 0;
      depth = depth || 0;

      var options = this._gantt.getOptions();
      var rootDataProvider = options['rowData'] || options['taskData'];
      var flattenRows = (rows, expandedKeySet, parentRow, depth) => {
        return rows.reduce((flattenedRows, row) => {
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
              return flattenedRows.concat(
                row,
                flattenRows(rowChildren, expandedKeySet, row, depth + 1)
              );
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
    }

    /**
     * Calculates the length of the flattened version of a hierarchical structure
     * @param {Array} rows The hierarchical rows data array
     * @param {*} expandedKeySet The expanded key set
     * @return {number} The length of the flattened array
     */
    _calcFlattenedRowsLength(rows, expandedKeySet) {
      var calcFlattenedRowsLength = (rows) => {
        return rows.reduce((len, row) => {
          var rowChildren = row['rows'];
          if (rowChildren && expandedKeySet.has(row['id']))
            return len + 1 + calcFlattenedRowsLength(rowChildren);
          return len + 1;
        }, 0);
      };
      return calcFlattenedRowsLength(rows);
    }

    /**
     * Returns whether the given rowObj corresponds to the root row in the hierarchical case.
     * @param {Object} rowObj
     * @return {boolean}
     */
    isRoot(rowObj) {
      return rowObj['parent'] == null;
    }

    /**
     * Returns whether the given rowObj is hidden due to its ancestor being collapsed.
     * @param {Object} rowObj
     * @return {boolean}
     */
    isHiddenCollapsed(rowObj) {
      for (var i = 0; i < this._rowObjs.length; i++) {
        if (dvt.Obj.compareValues(this._ctx, this._rowObjs[i].id, rowObj.id)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Returns the rowObj of the parent of the row of the given rowObj. Returns null if the given rowObj is already the root.
     * @param {Object} rowObj
     * @return {Object}
     */
    getParentRowObj(rowObj) {
      return rowObj['parent'];
    }

    /**
     * Renders the row represented by the given row layout object
     * @param {Object} rowObj The row layout object
     * @param {Object=} operations An object that specifies partial render (see this._computeViewportRenderOperations). If not specified, the entire row is rerendered.
     * @param {string=} mode The mode of operation (must be provided if operations provided). One of 'update'|'add'
     * @private
     */
    _renderRowObj(rowObj, operations, mode) {
      var databody = this._gantt.getDatabody();
      var rowNode = rowObj.node;
      if (mode === 'update') {
        rowNode.render(null, operations);
      } else {
        // mode === 'add' or no operations (full row rerender)
        if (!rowNode) {
          rowNode = new DvtGanttRowNode(this._gantt);
          rowNode.setLayoutObject(rowObj);
          rowObj.node = rowNode;
        }
        if (this._gantt.isRowAxisEnabled()) {
          var rowAxis = this._gantt.getRowAxis();
          if (rowAxis) {
            var rowLabelContents = rowAxis.getRowLabelContents();
            var rowIndex = rowObj.index;
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
        rowNode.render(databody, operations);
      }
    }

    /**
     * Renders the task represented by the given task layout object.
     * @param {Object} taskObj The task layout object
     * @param {boolean=} lazy Whether to render only if it doesn't exist in the DOM already. Default false.
     * @private
     */
    _renderTaskObj(taskObj, lazy) {
      var rowObj = taskObj.rowObj;
      var rowNode = rowObj.node;
      var taskNode = taskObj.node;

      if (lazy && taskNode && rowNode && taskNode.getParent() === rowNode) {
        return;
      }

      // Add the task to the row
      this._renderRowObj(
        rowObj,
        {
          rowObj: rowObj,
          tasksAdd: new Set([taskObj]),
          tasksUpdate: new Set(),
          tasksDelete: new Set(),
          updateRender: !lazy
        },
        rowNode && rowNode.getParent() ? 'update' : 'add'
      );
    }

    /**
     * Renders the dependency represented by the given dependency layout object
     * @param {Object} dependencyObj The dependency layout object
     * @param {boolean} bLazyTaskRender False means pred/suc task rendering is updated. True means only update if task not already in DOM. Default False.
     * @return {boolean} True if render is not skipped. False otherwise (e.g. if dependency is already in the DOM, then render is not called on it).
     * @private
     */
    _renderDependencyObj(dependencyObj, bLazyTaskRender) {
      var dependenciesContainer = this._gantt.getDependenciesContainer();
      var dependencyNode = dependencyObj['node'];
      if (dependencyNode && dependencyNode.getParent()) {
        return false;
      }

      // Render the associated rows if not already, then render the dependency
      // Temporarily disable animation, if on. ensureInDom for rows, adds row to the DOM
      // but we don't want to trigger any animation logic associated with adding rows to the DOM at this point.
      // Dependency lines don't do any fancy preanimation on render (they fade out before animation, fadein on animation end),
      // so it's okay to do this here.
      var animationManager = this._gantt.getAnimationManager();
      var animationMode = animationManager.getAnimationMode();
      animationManager.setAnimationMode('none');
      var predecessorObj = dependencyObj.predecessorTaskObj;
      var successorObj = dependencyObj.successorTaskObj;
      if (this._animationFinalStateRowObjs) {
        // Only render tasks that were not already processed/rendered for animation
        // because ensureInDOM doesn't skip rendering for animation case
        var predecessorRowObj = predecessorObj.rowObj;
        var successorRowObj = successorObj.rowObj;
        if (
          !this._animationFinalStateRowObjs.has(predecessorRowObj) ||
          !this._animationFinalStateRowObjs.get(predecessorRowObj).has(predecessorObj)
        ) {
          this.ensureInDOM(predecessorObj, 'task', bLazyTaskRender);
        }
        if (
          !this._animationFinalStateRowObjs.has(successorRowObj) ||
          !this._animationFinalStateRowObjs.get(successorRowObj).has(successorObj)
        ) {
          this.ensureInDOM(successorObj, 'task', bLazyTaskRender);
        }
      } else {
        this.ensureInDOM(predecessorObj, 'task', bLazyTaskRender);
        this.ensureInDOM(successorObj, 'task', bLazyTaskRender);
      }
      animationManager.setAnimationMode(animationMode);

      if (!dependencyNode) {
        dependencyNode = new DvtGanttDependencyNode(this._gantt);
        dependencyNode.setLayoutObject(dependencyObj);
        dependencyObj.node = dependencyNode;
      }
      dependencyNode.render(dependenciesContainer);
      return true;
    }

    /**
     * Given a layout object, render it to the DOM.
     * If 'lazy' is true (default false), then only render to DOM if it doesn't exist already.
     * Right now, 'lazy' is only supported for 'type' === 'task'.
     * Rows are always re-rendered, dependencies are only rerendered it it doesn't exist already.
     * @param {Object} obj Layout object
     * @param {string} type The type of the layout object
     */
    ensureInDOM(obj, type, lazy) {
      switch (type) {
        case 'row':
          this._renderRowObj(obj);
          return;
        case 'task':
          this._renderTaskObj(obj, lazy);
          return;
        case 'dependency':
          // Always lazy render connected tasks, which is sufficient for today's use cases.
          this._renderDependencyObj(obj, true);
          return;
        case 'rowLabel':
          // Render the row just enough to include the label
          this._renderRowObj(
            obj,
            {
              rowObj: obj,
              tasksAdd: new Set(),
              tasksUpdate: new Set(),
              tasksDelete: new Set(),
              updateRender: false
            },
            'add'
          );
          return;
      }
    }

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
    _binarySearchLeftMost(array, target, approximateMode, property, subProperty) {
      if (array.length === 0) return 0;

      var L = 0;
      var R = array.length;
      while (L < R) {
        var m = Math.floor((L + R) / 2);
        var value = property
          ? subProperty
            ? array[m][property][subProperty]
            : array[m][property]
          : array[m];
        if (value < target) L = m + 1;
        else R = m;
      }
      // If target is not in the array, then L at this point is the rank of the target in the array,
      // i.e. the number of elements in the array that are less than the target.
      if (L < array.length) {
        value = property
          ? subProperty
            ? array[L][property][subProperty]
            : array[L][property]
          : array[L];
        if (value === target || approximateMode === 'successor') return L;
      }
      // L - 1 would give the index of the rightmost element less than the target (predecessor)
      return L > 0 ? L - 1 : 0;
    }

    /**
     * Finds the minimum and maximum row indices relevant to the given viewport bounds
     * @param {Array} rowObjs Array of row layout objects
     * @param {number} yMin The minimum y bound
     * @param {number} yMax The maximum y bound
     * @return {Object} An object with the 'minRowInd' and 'maxRowInd' properties
     */
    findRowIndRange(rowObjs, yMin, yMax) {
      // O(lgN) binary search for first row (intersecting yMin)
      var minRowInd = this._binarySearchLeftMost(rowObjs, yMin, 'predecessor', 'y');
      var maxRowInd = minRowInd;

      // linear search from that row to search for last row (intersecting yMax)
      for (var i = minRowInd; i < rowObjs.length; i++) {
        var rowObj = rowObjs[i];
        if (rowObj['y'] <= yMax) {
          maxRowInd = i;
        } else {
          break;
        }
      }
      return { minRowInd: minRowInd, maxRowInd: maxRowInd };
    }

    /**
     * Finds all taskObjs relevant to the given viewport bounds for given row.
     * @param {Object} rowObj Row layout object
     * @param {number} startTime The range start time
     * @param {boolean} startInclusive Whether to include tasks intersecting the start bound
     * @param {number} endTime The range end time
     * @param {boolean} endInclusive Whether to include tasks intersecting the end bound
     * @return {Array} An array of taskObjs
     */
    findTaskObjsRange(rowObj, startTime, startInclusive, endTime, endInclusive) {
      var relevantTaskObjs = [];
      var taskObjs = rowObj.taskObjs;

      for (var i = 0; i < taskObjs.length; i++) {
        var taskObj = taskObjs[i];
        if (
          this._isIntervalOverlap(
            taskObj.overallStartTime,
            taskObj.overallEndTime,
            startTime,
            endTime
          )
        ) {
          if (startInclusive && endInclusive) {
            relevantTaskObjs.push(taskObj);
          } else if (!startInclusive && !endInclusive) {
            if (taskObj.overallStartTime > startTime && taskObj.overallEndTime < endTime) {
              relevantTaskObjs.push(taskObj);
            }
          } else if (!endInclusive) {
            if (taskObj.overallEndTime < endTime) {
              relevantTaskObjs.push(taskObj);
            }
          } else {
            if (taskObj.overallStartTime > startTime) {
              relevantTaskObjs.push(taskObj);
            }
          }
        }
      }
      return relevantTaskObjs;
    }

    /**
     * Finds all buffer taskObjs given viewport bounds for given row.
     * @param {Object} rowObj Row layout object
     * @param {number} startTime The range start time
     * @param {number} endTime The range end time
     * @return {Array} An array of taskObjs
     */
    findBufferTaskObjsRange(rowObj, startTime, endTime) {
      // Buffer tasks ("|" delineates the viewport boundaries, [] are tasks in the viewport, [B] are buffer tasks):
      // ... [ B ]   |   [  ]     [  ] ... [  ]   |    [ B ] ...
      // ... [ B ] [ |  ]  [  ]  [  ] ... [  ]    |   [ B ] ...
      // ... [ B ]   |  [  ]     [  ] ... [       |  ]    [ B ] ...
      // They're tasks that's adjacent to the boundary tasks in the viewport, and should be rendered.
      // Why are they needed? Consider the first task of the viewport, and you're panning right.
      // The task is going to disappear off the left side of the viewport. Let's say the task has an "end" label to its right.
      // If there's no concept of a buffer task, i.e. we remove any tasks that leaves the viewport, then the
      // label would abruptly disappear once the task rectangle is out of view. Ideally the label should stay in the DOM and
      // continue moving left as you pan right. To prevent this artifact, make the disappearing task a "buffer" task
      // and don't remove it until you continue panning right and the next task takes its place as a buffer task.
      // Buffer tasks also eliminates smart label positioning artifacts.
      var bufferTaskObjs = [];
      var taskObjs = rowObj.taskObjs;
      for (var i = 0; i < taskObjs.length; i++) {
        var taskObj = taskObjs[i];
        var previousAdjacentTaskObj = taskObj.previousAdjacentTaskObj;
        var nextAdjacentTaskObj = taskObj.nextAdjacentTaskObj;

        // Only task in row level, and out of viewport
        var isLoner =
          !previousAdjacentTaskObj &&
          !nextAdjacentTaskObj &&
          !this._isIntervalOverlap(
            taskObj.overallStartTime,
            taskObj.overallEndTime,
            startTime,
            endTime
          );

        // Start buffer: task ends before viewport start
        // AND (there's no next task
        // OR if the next task ends after viewport start (even if next task is not in viewport))
        var isStartBuffer =
          taskObj.overallEndTime < startTime &&
          (!nextAdjacentTaskObj ||
            (nextAdjacentTaskObj && nextAdjacentTaskObj.overallEndTime >= startTime));

        // End buffer: task starts after viewport end,
        // AND (there's no previous task
        // OR previous task starts before viewport end (even if previous task is not in viewport))
        var isEndBuffer =
          taskObj.overallStartTime > endTime &&
          (!previousAdjacentTaskObj ||
            (previousAdjacentTaskObj && previousAdjacentTaskObj.overallStartTime <= endTime));

        if (isLoner || isStartBuffer || isEndBuffer) {
          bufferTaskObjs.push(taskObj);
        }
      }
      return bufferTaskObjs;
    }

    /**
     * Returns all layout objects within given bounding box.
     * @param {dvt.Rectangle} bbox The bounding box relative to data region (top left is 0,0)
     * @return {Object} An object with 'rowObjs' and 'taskObjs' arrays
     */
    getLayoutObjectsInBBox(bbox) {
      var rowIndRange = this.findRowIndRange(this._rowObjs, bbox.y, bbox.y + bbox.h);
      var minRowInd = rowIndRange['minRowInd'];
      var maxRowInd = rowIndRange['maxRowInd'];

      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var ganttStartTime = this._gantt.getStartTime();
      var ganttEndTime = this._gantt.getEndTime();
      var ganttContentLength = this._gantt.getContentLength();
      // In RTL, the bbox right is the start; in LTR the bbox left is the start
      var bboxStartTime = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
        ganttStartTime,
        ganttEndTime,
        isRTL ? ganttContentLength - (bbox.x + bbox.w) : bbox.x,
        ganttContentLength
      );
      var bboxEndTime = ojtimeaxisToolkit.TimeAxisUtils.getPositionDate(
        ganttStartTime,
        ganttEndTime,
        isRTL ? ganttContentLength - bbox.x : bbox.x + bbox.w,
        ganttContentLength
      );

      var relevantRowObjs = [];
      var relevantTaskObjs = [];
      for (var i = minRowInd; i <= maxRowInd; i++) {
        var rowObj = this._rowObjs[i];
        relevantRowObjs.push(rowObj);

        var taskObjs = rowObj['taskObjs'];
        for (var j = 0; j < taskObjs.length; j++) {
          var taskObj = taskObjs[j];
          if (
            this._isIntervalOverlap(
              taskObj['overallStartTime'],
              taskObj['overallEndTime'],
              bboxStartTime,
              bboxEndTime
            ) &&
            this._isIntervalOverlap(
              taskObj['y'],
              taskObj['y'] + taskObj['height'],
              bbox.y,
              bbox.y + bbox.h
            )
          ) {
            relevantTaskObjs.push(taskObjs[j]);
          }
        }
      }

      return { rowObjs: relevantRowObjs, taskObjs: relevantTaskObjs };
    }

    /**
     * Based on current task selection, return a set of tasks connected to them
     * via dependencies. If targetTaskObj is specified, then that task is ensured to be included in the selection.
     * @param {string} action The action that triggered the viewport change. One of the DvtGanttDataLayoutManager.VPC_X strings.
     * @param {Object=} targetTask The target selected (or de-selected) task, of the shape { taskObj: taskObj, isSelected: boolean }.
     *    This should only be specified if the target task is not in the selectionHandler's current selection (yet),
     *    i.e. this rendering is triggered by a task selection/deselection gesture.
     * @returns {Object} { taskObjs: Set(taskObjs), dependencyObjs: Set(depObjs) }
     * @private
     */
    _getSelectionDependencies(action, targetTask) {
      var idTaskObjMap = this._createIdObjMap(this._rowObjs, 'taskObjs');
      var taskObjsSelected;
      if (action === DvtGanttDataLayoutManager.VPC_REFRESH) {
        // If due to (re)-render, selectionHandler.getSelection() is not up to date at this point
        var selection = this._gantt.getOptions()['selection'];
        taskObjsSelected = selection
          .map((id) => idTaskObjMap.get(id))
          .filter((taskObj) => taskObj !== undefined);
      } else {
        taskObjsSelected = this._gantt
          .getSelectionHandler()
          .getSelection()
          .map((taskNode) => taskNode.getLayoutObject());
      }

      if (targetTask) {
        // targetTask is specified if this rendering is triggered by a task selection (or de-selection) gesture
        // The selectionHandler's selection is not up to date at this point yet.
        if (targetTask.isSelected) {
          taskObjsSelected.push(targetTask.taskObj);
        } else {
          taskObjsSelected = taskObjsSelected.filter((t) => t !== targetTask.taskObj);
        }
      }

      var traverse = (taskObj, direction, visitedTaskObjs, visitedDependencyObjs) => {
        if (taskObj == null || visitedTaskObjs.has(taskObj) || !idTaskObjMap.has(taskObj['id'])) {
          return;
        }
        visitedTaskObjs.add(taskObj);
        var taskObjNeighbors;
        if (direction === 'up') {
          taskObjNeighbors = taskObj.predecessorDepObjs.map((d) => d.predecessorTaskObj);
          taskObj.predecessorDepObjs.forEach((d) => visitedDependencyObjs.add(d));
        } else {
          taskObjNeighbors = taskObj.successorDepObjs.map((d) => d.successorTaskObj);
          taskObj.successorDepObjs.forEach((d) => visitedDependencyObjs.add(d));
        }
        taskObjNeighbors.forEach((t) =>
          traverse(t, direction, visitedTaskObjs, visitedDependencyObjs)
        );
      };

      // Start with each selected task and traverse its dependencies upstream and downstream
      var visitedTaskObjs = new Set();
      var visitedDependencyObjs = new Set();
      taskObjsSelected.forEach((taskObj) =>
        traverse(taskObj, 'up', visitedTaskObjs, visitedDependencyObjs)
      );
      // New set for tracking visited downstream tasks
      var visitedDownstreamTaskObjs = new Set();
      taskObjsSelected.forEach((taskObj) =>
        traverse(taskObj, 'down', visitedDownstreamTaskObjs, visitedDependencyObjs)
      );
      // merge upstream and downstream tasks objs
      visitedDownstreamTaskObjs.forEach((t) => visitedTaskObjs.add(t));

      return { taskObjs: visitedTaskObjs, dependencyObjs: visitedDependencyObjs };
    }

    /**
     * Highlights given tasks and dim out all others
     * @param {Set} taskObjs The task layout objects associated with the tasks to be highlighted
     */
    highlightTasks(taskObjs) {
      if (this._gantt.getEventManager().isDnDDragging()) {
        return;
      }

      var databody = this._gantt.getDatabody();
      if (!databody) {
        return;
      }

      // Dim databody, or undim databody if there are not tasks to highlight
      if (taskObjs.size === 0) {
        this._gantt.undimDatabody();
      } else {
        this._gantt.dimDatabody();
      }

      // un-highlight anything not in current set that's in the previous set
      this._prevHighlightedTaskObjs.forEach((taskObj) => {
        if (taskObj.node && !taskObjs.has(taskObj)) {
          taskObj.node.unhighlight();
        }
      });

      // highlight anything in current set that's not in the previous set
      taskObjs.forEach((taskObj) => {
        if (taskObj.node && !this._prevHighlightedTaskObjs.has(taskObj)) {
          taskObj.node.highlight();
        }
      });

      this._prevHighlightedTaskObjs = taskObjs;
    }

    /**
     * Renders viewport related dependency lines
     * @param {Object} viewport Object describing the viewport, of shape {minRowInd: number, maxRowInd: number, viewStartTime: number, viewEndTime: number}
     * @param {string} action The action that triggered the viewport change. One of the DvtGanttDataLayoutManager.VPC_X strings.
     * @param {Object=} targetTask The task that got selected (or de-selected) by the user that triggered this call (optional).
     *     This should be of the shape { taskObj: taskObj, isSelected: boolean }
     */
    renderViewportDependencyLines(viewport, action, targetTask) {
      var dependencyObjs;
      var selectionBehavior = this._gantt.getOptions().selectionBehavior;
      if (selectionBehavior === 'highlightDependencies') {
        // "highlightDependencies" selection behavior: only dependencies related to the selected tasks are shown
        // and dim all other tasks
        var selectionDeps = this._getSelectionDependencies(action, targetTask);
        this.highlightTasks(selectionDeps.taskObjs);
        dependencyObjs = selectionDeps.dependencyObjs;
      } else {
        // normal selection behavior, just render all the dependencies
        dependencyObjs = new Set(this._dependencyObjs);
        // Clear any previously "highlightDependencies" artifacts
        this.highlightTasks(new Set());
      }

      var dependenciesContainer = this._gantt.getDependenciesContainer();
      if (dependenciesContainer) {
        // During marquee dragging with highlightDependencies selectionBehavior, only remove the dependency lines that are not relevant
        // to the selection, for improved performance (see JET-55859).
        // TODO: See if we can safely selectively remove dependency lines in all cases
        var isMarqueeDragging = this._gantt.getEventManager().isMarqueeDragging();
        if (!(isMarqueeDragging && selectionBehavior === 'highlightDependencies')) {
          dependenciesContainer.removeChildren();
        } else {
          // Remove dependency lines from DOM that are not part of the current set
          this._prevDependencyObjs.forEach((depObj) => {
            if (!dependencyObjs.has(depObj) && depObj.node) {
              dependenciesContainer.removeChild(depObj.node);
            }
          });
        }
      }
      this._prevDependencyObjs = dependencyObjs;

      // Render viewport related dependencies
      // O(N) search for dependencies overlapping the viewport (more precisely, O(lgN) search + O(2k) iterations),
      // N being the total number of dependencies, and k being the number of dependencies from the top of the chart to the end of the viewport
      // TODO: If need be in the future, implement (centered) interval tree data structure
      // to perform O(lgN + K) search for the K dependencies overlapping the viewport
      if (dependencyObjs.size > 0) {
        var isOverlapHorizontalViewport = (dependencyObj, viewport) => {
          var predecessorObj = dependencyObj.predecessorTaskObj;
          var successorObj = dependencyObj.successorTaskObj;
          var t1, t2;
          switch (dependencyObj.type) {
            case DvtGanttDependencyNode.START_FINISH:
              t1 = predecessorObj.startTime;
              t2 = successorObj.endTime;
              break;
            case DvtGanttDependencyNode.START_START:
              t1 = predecessorObj.startTime;
              t2 = successorObj.startTime;
              break;
            case DvtGanttDependencyNode.FINISH_FINISH:
              t1 = predecessorObj.endTime;
              t2 = successorObj.endTime;
              break;
            case DvtGanttDependencyNode.FINISH_START:
            default:
              t1 = predecessorObj.endTime;
              t2 = successorObj.startTime;
          }

          return this._isIntervalOverlap(
            Math.min(t1, t2),
            Math.max(t1, t2),
            viewport.viewStartTime,
            viewport.viewEndTime
          );
        };

        // Find first dependency from the top with bottom row below upper viewport bound
        var referenceDependencyInd = this._binarySearchLeftMost(
          this._dependencyObjs,
          viewport.minRowInd,
          'successor',
          'rowObjBottom',
          'index'
        );
        var referenceDependencyObj = this._dependencyObjs[referenceDependencyInd];
        var referencePrevTopDependencyObj = referenceDependencyObj['prevTopDependencyObj'];

        // Lazy render tasks for pan/scroll case.
        // In refresh case, also lazy render,
        // so that custom content is only regenerated if they're not there already.
        // update render for all other actions.
        var bLazyTaskRender =
          action === DvtGanttDataLayoutManager.VPC_TRANSLATE ||
          action === DvtGanttDataLayoutManager.VPC_REFRESH;

        // All subsequent dependencies with top row below the reference dep's top row but above the lower viewport bound must be visible.
        // Any dependencies with top row below the lower viewport bound are definitely not visible and so not considered.
        // Also skip rendering any lines that don't cross the viewport horizontally.
        while (
          referenceDependencyObj &&
          referenceDependencyObj['rowObjTop']['index'] <= viewport.maxRowInd
        ) {
          if (
            dependencyObjs.has(referenceDependencyObj) &&
            isOverlapHorizontalViewport(referenceDependencyObj, viewport)
          ) {
            this._renderDependencyObj(referenceDependencyObj, bLazyTaskRender);
          }
          referenceDependencyObj = referenceDependencyObj['nextTopDependencyObj'];
        }
        // The only lines we may have missed so far are ones with bottom row >= reference bottom row, but have top row < reference top row.
        // Iterate up from the reference dependency to find any lines we missed
        while (referencePrevTopDependencyObj) {
          var rowBottomInd = referencePrevTopDependencyObj['rowObjBottom']['index'];
          if (
            rowBottomInd >= viewport.minRowInd &&
            dependencyObjs.has(referencePrevTopDependencyObj) &&
            isOverlapHorizontalViewport(referencePrevTopDependencyObj, viewport)
          ) {
            this._renderDependencyObj(referencePrevTopDependencyObj, bLazyTaskRender);
          }
          referencePrevTopDependencyObj = referencePrevTopDependencyObj['prevTopDependencyObj'];
        }
      }
    }

    /**
     * Fully detaches the row node from DOM, by detaching the row itself and all tasks within it.
     * @param {Object} rowObj Row layout object.
     * @private
     */
    _detachRowObjNode(rowObj) {
      var rowNode = rowObj.node;
      if (rowNode) {
        rowObj.taskObjs.forEach((taskObj) => {
          var taskNode = taskObj.node;
          if (taskNode) {
            taskNode.remove();
          }
        });
        rowNode.remove();
      }
    }

    /**
     * Prepares viewport before rendering.
     * @param {Object} viewport Object describing the viewport, of shape {minRowInd: number, maxRowInd: number, viewStartTime: number, viewEndTime: number}
     * @param {string} action The action that triggered the viewport change. One of the DvtGanttDataLayoutManager.VPC_X strings.
     * @private
     */
    _prepareViewport(viewport, action) {
      var databody = this._gantt.getDatabody();
      if (action === DvtGanttDataLayoutManager.VPC_REFRESH) {
        // Clear previous viewport
        // Note that we have to perform diffing for all other actions because:
        // In the case of animation, we don't clear the viewport to keep old states around
        // In the case of panning/scrolling/zooming, also don't clear the entire viewport straight up, as usually there's a lot that should be kept
        //   - Also panning can be induced via DnD, and dragEnter/Leave events go haywire (especially on FF) if things keep disappearing and reappearing under the mouse

        // Also need to clear tasks within each row.
        this._rowObjs.forEach(this._detachRowObjNode, this);
        databody.removeChildren();
        this._gantt.getDatabodyBackground().removeChildren();
        this._gantt.getRowReferenceObjectsContainer().removeChildren();
      }
      var rowAxis = this._gantt.getRowAxis();
      if (
        this._gantt.isRowAxisEnabled() &&
        rowAxis &&
        !(
          action === DvtGanttDataLayoutManager.VPC_TRANSLATE ||
          action === DvtGanttDataLayoutManager.VPC_SCALE
        )
      ) {
        // Don't clear row axis when: Panning/scrolling/zooming cases; we rely on row diffing later.
        // Clear row axis when: Refresh/Animation. In animation case, labels are added back later with care.
        rowAxis.clear();
      }
    }

    /**
     * Computes a set of rendering operations (from viewport diffing) to render the viewport.
     * @param {Object} viewport Object describing the viewport, of shape {minRowInd: number, maxRowInd: number, viewStartTime: number, viewEndTime: number}
     * @param {string} action The action that triggered the viewport change. One of the DvtGanttDataLayoutManager.VPC_X strings.
     * @return {Object} A set of opertaions of shape { rowsDelete: [row objs], rowsAdd: [taskOps], rowsUpdate: [taskOps] }
     *    where taskOps is of shape { rowObj: rowObj, tasksAdd: Set(task objs), tasksUpdate: Set(task objs), tasksDelete: Set(task objs), updateRender: boolean }
     *    where updateRender signifies whether the tasks in tasksUpdate should be fully re-rendered or not.
     * @private
     */
    _computeViewportRenderOperations(viewport, action) {
      var rowsDelete = [];
      var rowsAdd = [];
      var rowsUpdate = [];
      if (action === DvtGanttDataLayoutManager.VPC_REFRESH) {
        // Viewport is empty; just add the rows and tasks for the current viewport
        for (var i = viewport.minRowInd; i <= viewport.maxRowInd; i++) {
          var rowObj = this._rowObjs[i];
          var viewportTaskObjs = this.findTaskObjsRange(
            rowObj,
            viewport.viewStartTime,
            true,
            viewport.viewEndTime,
            true
          );
          var bufferTaskObjs = this.findBufferTaskObjsRange(
            rowObj,
            viewport.viewStartTime,
            viewport.viewEndTime
          );
          bufferTaskObjs.forEach((taskObj) => {
            viewportTaskObjs.push(taskObj);
          });
          rowsAdd.push({
            rowObj: rowObj,
            tasksAdd: new Set(viewportTaskObjs),
            tasksUpdate: new Set(),
            tasksDelete: new Set(),
            updateRender: true
          });
        }
      } else if (action === DvtGanttDataLayoutManager.VPC_ANIMATE) {
        // Don't delete anything from the old viewport; those elements are initial states
        // Render the curated particpating rows (which may include more than what's in the viewport)
        this._animationFinalStateRowObjs.forEach((taskObjsSet, rowObj) => {
          var tasksAdd = new Set();
          var viewportTaskObjs = this.findTaskObjsRange(
            rowObj,
            viewport.viewStartTime,
            true,
            viewport.viewEndTime,
            true
          );
          var bufferTaskObjs = this.findBufferTaskObjsRange(
            rowObj,
            viewport.viewStartTime,
            viewport.viewEndTime
          );
          viewportTaskObjs.forEach((taskObj) => {
            if (!taskObjsSet.has(taskObj)) {
              tasksAdd.add(taskObj);
            }
          });
          bufferTaskObjs.forEach((taskObj) => {
            if (!taskObjsSet.has(taskObj)) {
              tasksAdd.add(taskObj);
            }
          });
          taskObjsSet.forEach((taskObj) => {
            tasksAdd.add(taskObj);
          });
          // update this._animationFinalStateRowObjs tasks set for proper dependency rendering in renderViewportDependencyLines -> _renderDependencyObj
          this._animationFinalStateRowObjs.set(rowObj, tasksAdd);

          rowsAdd.push({
            rowObj: rowObj,
            tasksAdd: tasksAdd,
            tasksUpdate: new Set(),
            tasksDelete: new Set(),
            updateRender: true
          });
        }, this);
        // Also, for old rows with row labels, restore them to DOM to show initial state (row axis DOM is cleared at this point)
        var rowAxis = this._gantt.getRowAxis();
        for (var i = 0; i < this._animationInitialStateRowObjsDelete.length; i++) {
          var oldRowNodeWithLabel = this._animationInitialStateRowObjsDelete[i].node;
          if (oldRowNodeWithLabel && rowAxis) {
            var oldLabelContent = oldRowNodeWithLabel.getRowLabelContent();
            oldLabelContent.ensureInDOM();
            if (this._gantt.isHorizontalGridlinesVisible()) {
              rowAxis.addHorizontalLine(oldRowNodeWithLabel.getRowAxisHorizontalLine());
            }
          }
        }
      } else {
        // For viewport changes such as panning/scrolling/zooming, we diff the previous and current viewports
        // ...except when the Gantt is panned during Drag and Drop on Mobile, we DON'T remove any elements going out of view.
        // For some mysterious reason, changing the DOM order underneath the touch point during Drag and Drop sometimes cause
        // the dragOver event to stop firing, including the downstream drop/dragEnd events...but this is not an issue on Desktop browsers.
        // The side effect is a possible perf hit during drag on mobile, because the DOM will accumulate elements not in view if
        // someone tries to drag something for large distances. Subsequent zoom and vertical scrolling will reset the DOM,
        // and as in the typical usecase when the drop triggers a data change rerender.
        var eventManager = this._gantt.getEventManager();
        var bMobileDnDDragging =
          ojtimeaxisToolkit.TimeAxisUtils.supportsTouch() && eventManager && eventManager.isDnDDragging();

        // Any previous rows above the current viewport should be removed
        for (
          var i = this._prevViewport.minRowInd;
          i < Math.min(viewport.minRowInd, this._prevViewport.maxRowInd);
          i++
        ) {
          rowsDelete.push(this._rowObjs[i]);
        }

        // Any previous rows below the current viewport should be removed
        for (
          var i = Math.max(viewport.maxRowInd + 1, this._prevViewport.minRowInd);
          i <= this._prevViewport.maxRowInd;
          i++
        ) {
          rowsDelete.push(this._rowObjs[i]);
        }

        // Any current rows above the previous viewport should be added
        for (
          var i = viewport.minRowInd;
          i < Math.min(this._prevViewport.minRowInd, viewport.maxRowInd);
          i++
        ) {
          var rowObj = this._rowObjs[i];
          var viewportTaskObjs = this.findTaskObjsRange(
            rowObj,
            viewport.viewStartTime,
            true,
            viewport.viewEndTime,
            true
          );
          var bufferTaskObjs = this.findBufferTaskObjsRange(
            rowObj,
            viewport.viewStartTime,
            viewport.viewEndTime
          );
          bufferTaskObjs.forEach((taskObj) => {
            viewportTaskObjs.push(taskObj);
          });
          rowsAdd.push({
            rowObj: rowObj,
            tasksAdd: new Set(viewportTaskObjs),
            tasksUpdate: new Set(),
            tasksDelete: new Set(),
            updateRender: true
          });
        }

        // Any current rows below the previous viewport should be added
        for (
          var i = Math.max(this._prevViewport.maxRowInd + 1, viewport.minRowInd);
          i <= viewport.maxRowInd;
          i++
        ) {
          var rowObj = this._rowObjs[i];
          var viewportTaskObjs = this.findTaskObjsRange(
            rowObj,
            viewport.viewStartTime,
            true,
            viewport.viewEndTime,
            true
          );
          var bufferTaskObjs = this.findBufferTaskObjsRange(
            rowObj,
            viewport.viewStartTime,
            viewport.viewEndTime
          );
          bufferTaskObjs.forEach((taskObj) => {
            viewportTaskObjs.push(taskObj);
          });
          rowsAdd.push({
            rowObj: rowObj,
            tasksAdd: new Set(viewportTaskObjs),
            tasksUpdate: new Set(),
            tasksDelete: new Set(),
            updateRender: true
          });
        }

        // Rows intersecting previous and current viewport should be updated
        // Only update task rendering in the zoom case. No need for pan/scroll.
        var updateRender = action === DvtGanttDataLayoutManager.VPC_SCALE;
        if (
          this._prevViewport.maxRowInd >= viewport.minRowInd &&
          this._prevViewport.minRowInd <= viewport.maxRowInd
        ) {
          var prevStart = this._prevViewport.viewStartTime;
          var prevEnd = this._prevViewport.viewEndTime;
          var currStart = viewport.viewStartTime;
          var currEnd = viewport.viewEndTime;
          for (
            var i = Math.max(viewport.minRowInd, this._prevViewport.minRowInd);
            i <= Math.min(viewport.maxRowInd, this._prevViewport.maxRowInd);
            i++
          ) {
            var rowObj = this._rowObjs[i];
            var tasksDelete = new Set();
            var tasksAdd = new Set();
            var tasksUpdate = new Set();

            // Any previous tasks outside the current viewport should be removed
            if (prevStart < currStart) {
              this.findTaskObjsRange(
                rowObj,
                prevStart,
                true,
                Math.min(currStart, prevEnd),
                prevEnd < currStart
              ).forEach((taskObj) => {
                tasksDelete.add(taskObj);
              });
            }
            if (prevEnd > currEnd) {
              this.findTaskObjsRange(
                rowObj,
                Math.max(currEnd, prevStart),
                prevStart > currEnd,
                prevEnd,
                true
              ).forEach((taskObj) => {
                tasksDelete.add(taskObj);
              });
            }

            // Any current tasks outside the previous viewport should be added
            if (currStart < prevStart) {
              this.findTaskObjsRange(
                rowObj,
                currStart,
                true,
                Math.min(currEnd, prevStart),
                currEnd < prevStart
              ).forEach((taskObj) => {
                tasksAdd.add(taskObj);
              });
            }
            if (currEnd > prevEnd) {
              this.findTaskObjsRange(
                rowObj,
                Math.max(prevEnd, currStart),
                currStart > prevEnd,
                currEnd,
                true
              ).forEach((taskObj) => {
                tasksAdd.add(taskObj);
              });
            }

            // Intersection should be updated
            if (prevEnd >= currStart && prevStart <= currEnd) {
              tasksUpdate = new Set(
                this.findTaskObjsRange(
                  rowObj,
                  Math.max(currStart, prevStart),
                  true,
                  Math.min(currEnd, prevEnd),
                  true
                )
              );
            }

            // Previous buffer tasks should be removed
            var prevBufferTaskObjs = this.findBufferTaskObjsRange(
              rowObj,
              this._prevViewport.viewStartTime,
              this._prevViewport.viewEndTime
            );
            prevBufferTaskObjs.forEach((taskObj) => {
              tasksDelete.add(taskObj);
            });

            // Current buffer tasks should be added
            var bufferTaskObjs = this.findBufferTaskObjsRange(
              rowObj,
              viewport.viewStartTime,
              viewport.viewEndTime
            );
            bufferTaskObjs.forEach((taskObj) => {
              tasksAdd.add(taskObj);
            });

            // Any tasks marked both for DELETE and ADD should just be UPDATE (e.g. buffer tasks)
            // At the time of writing, I find conflicting information regarding the safety (and performance)
            // of removing elements from a set while iterating it. It's safest to just store and delete after:
            var deleteAndAdd = [];
            tasksDelete.forEach((taskObj) => {
              if (tasksAdd.has(taskObj)) {
                deleteAndAdd.push(taskObj);
              }
            });
            deleteAndAdd.forEach((taskObj) => {
              tasksUpdate.add(taskObj);
              tasksDelete.delete(taskObj);
              tasksAdd.delete(taskObj);
            });

            // See comment above about not removing DOM when performing mobile dnd dragging
            if (bMobileDnDDragging) {
              tasksDelete = new Set();
            }

            rowsUpdate.push({
              rowObj: rowObj,
              tasksAdd: tasksAdd,
              tasksUpdate: tasksUpdate,
              tasksDelete: tasksDelete,
              updateRender: updateRender
            });
          }
        }
      }

      // See comment above about not removing DOM when performing mobile dnd dragging
      if (bMobileDnDDragging) {
        rowsDelete = [];
      }

      return { rowsDelete: rowsDelete, rowsAdd: rowsAdd, rowsUpdate: rowsUpdate };
    }

    /**
     * Executes the given rendering operations.
     * @param {Object} renderOperations See return shape of _computeViewportRenderOperations()
     * @private
     */
    _executeViewportRenderOperations(renderOperations) {
      renderOperations.rowsDelete.forEach(this._detachRowObjNode, this);
      renderOperations.rowsAdd.forEach((op) => {
        this._renderRowObj(op.rowObj, op, 'add');
      }, this);
      renderOperations.rowsUpdate.forEach((op) => {
        this._renderRowObj(op.rowObj, op, 'update');
      }, this);
    }

    /**
     * Renders any visible items in the viewport as defined by the given min and max y bounds
     * @param {Object} viewport Object describing the viewport, of shape {minRowInd: number, maxRowInd: number, viewStartTime: number, viewEndTime: number}
     * @param {string} action The action that triggered the viewport change. One of the DvtGanttDataLayoutManager.VPC_X strings.
     */
    renderViewport(viewport, action) {
      this._prepareViewport(viewport, action);
      var renderOperations = this._computeViewportRenderOperations(viewport, action);

      // Number of tasks in the viewport = number of task adds + number of task updates
      var accViewportTasks = (acc, rowOp) => acc + rowOp.tasksAdd.size + rowOp.tasksUpdate.size;
      this._numViewportTasks =
        renderOperations.rowsAdd.reduce(accViewportTasks, 0) +
        renderOperations.rowsUpdate.reduce(accViewportTasks, 0);

      // Apply any appropriate shape and text rendering performance optimizations to the databody
      // before updating the viewport
      var databodyElem = this._gantt.getDatabody().getElem();
      var shapeRendering = dvt.ToolkitUtils.getAttrNullNS(databodyElem, 'shape-rendering');
      if (this._gantt.getViewportDensity() > 1) {
        if (shapeRendering !== 'optimizeSpeed') {
          dvt.ToolkitUtils.setAttrNullNS(databodyElem, 'shape-rendering', 'optimizeSpeed');
          dvt.ToolkitUtils.setAttrNullNS(databodyElem, 'text-rendering', 'optimizeSpeed');
        }
      } else {
        if (shapeRendering === 'optimizeSpeed') {
          dvt.ToolkitUtils.removeAttrNullNS(databodyElem, 'shape-rendering');
          dvt.ToolkitUtils.removeAttrNullNS(databodyElem, 'text-rendering');
        }
      }

      this._executeViewportRenderOperations(renderOperations);

      this.renderViewportDependencyLines(viewport, action);

      this._prevViewport = viewport;

      // Clean up
      this._animationFinalStateRowObjs = null;
      this._animationInitialStateRowObjsDelete = [];
    }
  }

  /**
   * Viewport change due to translation action (e.g. panning)
   * @type {string}
   */
  DvtGanttDataLayoutManager.VPC_TRANSLATE = 'vpc_translate';

  /**
   * Viewport change due to scaling action (e.g. zooming)
   * @type {string}
   */
  DvtGanttDataLayoutManager.VPC_SCALE = 'vpc_scale';

  /**
   * Viewport change due to animation rerender
   * @type {string}
   */
  DvtGanttDataLayoutManager.VPC_ANIMATE = 'vpc_animate';

  /**
   * Viewport refresh action (i.e. clear everything and render viewport from scratch)
   * @type {string}
   */
  DvtGanttDataLayoutManager.VPC_REFRESH = 'vpc_refresh';

  /**
   * Animation manager for Gantt
   * @param {Gantt} gantt the Gantt component
   * @class
   * @constructor
   */
  class DvtGanttAnimationManager {
    constructor(gantt) {
      this._gantt = gantt;
    }

    /**
     * Initializes the necessary animators for animation.
     */
    prepareForAnimations() {
      var context = this._gantt.getCtx();

      // Ensure clean slate
      this._gantt.StopAnimation(true);

      this._animationMode = 'none';

      this._animationDuration = DvtGanttStyleUtils.getAnimationDuration(this._gantt.getOptions());

      // Figure out animation mode
      if (this._gantt.isInitialRender()) {
        // initial render/display
        if (this._gantt.isIRAnimationEnabled) this._animationMode = 'onDisplay';
      } else {
        // data change
        if (this._gantt.isDCAnimationEnabled) this._animationMode = 'dataChange';
      }

      // Initialize appropriate animators depending on animation mode
      if (this._animationMode === 'onDisplay') {
        // For animating fade in
        this.fadeInElemsIR = [];
        this.fadeInPlayableIR = new dvt.AnimFadeIn(
          context,
          this.fadeInElemsIR,
          this._animationDuration,
          0
        );

        // Playable for animating dimension changes
        this.dimensionsPlayableIR = this._createCustomPlayable(dvt.Easing.linear);

        // For animating translations
        this.translationsPlayableIR = this._createCustomPlayable(dvt.Easing.cubicInOut);
      } else if (this._animationMode === 'dataChange') {
        // For animating fade in and out
        this.fadeInElemsDC = [];
        this.fadeInPlayableDC = new dvt.AnimFadeIn(
          context,
          this.fadeInElemsDC,
          this._animationDuration,
          0
        );
        this.fadeOutElemsDC = [];
        this.fadeOutPlayableDC = new dvt.AnimFadeOut(
          context,
          this.fadeOutElemsDC,
          this._animationDuration,
          0
        );

        // For animating dimension changes
        this.dimensionsPlayableDC = this._createCustomPlayable(dvt.Easing.linear);

        // For animating translations
        this.translationsPlayableDC = this._createCustomPlayable(dvt.Easing.cubicInOut);
      }

      // Callbacks to be executed at the end of animation
      this._onEnds = [];
    }

    /**
     * Gets the current animation mode of the Gantt
     * @return {string} the animation mode ('dataChange', 'onDisplay', or 'none')
     */
    getAnimationMode() {
      return this._animationMode;
    }

    /**
     * Sets the animation mode of the Gantt
     * @param {string} animationMode The new animation mode
     */
    setAnimationMode(animationMode) {
      this._animationMode = animationMode;
    }

    /**
     * Generates a playable object with specified easing animation.
     * @param {function} easing The easing function to use when animating.
     * @return {dvt.CustomAnimation} The playable.
     * @private
     */
    _createCustomPlayable(easing) {
      var playable;
      playable = new dvt.CustomAnimation(this._gantt.getCtx(), this._gantt, this._animationDuration);
      playable.setEasing(easing);
      return playable;
    }

    /**
     * Starts all animations.
     */
    triggerAnimations() {
      var subPlayables, context;

      // Stop any unfinished animations
      this._gantt.StopAnimation(true);

      context = this._gantt.getCtx();

      // Plan the animation
      if (this._animationMode === 'onDisplay') {
        // Parallel: Fade in all elements, animate any dimension changes
        subPlayables = [
          this.fadeInPlayableIR,
          this.translationsPlayableIR,
          this.dimensionsPlayableIR
        ];
        this._gantt.Animation = new dvt.ParallelPlayable(
          context,
          subPlayables,
          this._animationDuration,
          0
        );
      } else if (this._animationMode === 'dataChange') {
        // Parallel: Fade in elements, translate elements, animate dimension changes, fade out elements
        subPlayables = [
          this.fadeInPlayableDC,
          this.translationsPlayableDC,
          this.dimensionsPlayableDC,
          this.fadeOutPlayableDC
        ];
        this._gantt.Animation = new dvt.ParallelPlayable(
          context,
          subPlayables,
          this._animationDuration,
          0
        );
      }

      // If an animation was created, play it
      if (this._gantt.Animation) {
        // Instead of animating dep lines, hide them, animate other things, then show them again.
        // TODO: remove this and refine dependency lines animation instead.
        this._hideDepLines();
        dvt.Playable.appendOnEnd(this._gantt.Animation, this._showDepLines, this);

        // Disable event listeners temporarily
        // Only do this if DnD is not enabled, because
        // 1) If animation is triggered by DnD, and listeners are removed, the dragEnd event will never fire.
        // 2) If we try to limit this to explicit dragging cases, there'll be a slew of side effects/conflicts with pan drag events and DnD events
        // 3) DnD with animation is not expected to be a common usecase, and it's only an "issue" if someone tries to scroll/zoom etc. in the half second animation is happening. Even so, nothing will break; animation will just look more chaotic.
        if (!this._gantt.isDndEnabled()) {
          this._gantt.EventManager.removeListeners(this._gantt);
          this._bListenersRemoved = true;
        }

        // Append callbacks to be executed at the end of animation
        for (var i = 0; i < this._onEnds.length; i++) {
          dvt.Playable.appendOnEnd(this._gantt.Animation, this._onEnds[i], this);
        }
        dvt.Playable.appendOnEnd(this._gantt.Animation, this._onAnimationEnd, this);

        // Play!
        this._gantt.Animation.play();
      }
    }

    /**
     * Hides dependency lines (called before animation)
     * @private
     */
    _hideDepLines() {
      var deplines = this._gantt.getDependenciesContainer();
      if (deplines != null) dvt.ToolkitUtils.setAttrNullNS(deplines.getElem(), 'display', 'none');
    }

    /**
     * Shows dependency lines (called after animation)
     * @private
     */
    _showDepLines() {
      var deplines = this._gantt.getDependenciesContainer();
      if (deplines != null) dvt.ToolkitUtils.removeAttrNullNS(deplines.getElem(), 'display');
    }

    /**
     * Hook for cleaning animation behavior at the end of the animation.
     * @private
     */
    _onAnimationEnd() {
      // Fire ready event saying animation is finished.
      if (!this._gantt.AnimationStopped) this._gantt.RenderComplete();

      // Restore event listeners if removed
      if (this._bListenersRemoved) this._gantt.EventManager.addListeners(this._gantt);

      // Reset animation flags
      this._gantt.Animation = null;
      this._gantt.AnimationStopped = false;

      this._animationMode = 'none';

      // Refresh the viewport to absolutely ensure the final state looks right
      // This also ensures a clean slate, and clears out any hidden things from the DOM that were there just for animation
      this._gantt.renderViewport(DvtGanttDataLayoutManager.VPC_REFRESH, false);
    }

    /*
    ----------------------------------------------------------------------
    Methods below configure/define animations for specific elements
    ----------------------------------------------------------------------
    */

    /**
     * Prepares overall Gantt initial render animation.
     * @param {Gantt} gantt
     */
    preAnimateGanttIR(gantt) {
      if (this._animationMode === 'onDisplay') {
        // Fade in gantt on initial render
        this.fadeInElemsIR.push(gantt._canvas);
      }
    }

    /**
     * Prepares task node animation.
     * @param {DvtGanttTaskNode} taskNode
     * @param {object} finalStates Object defining the final animation state
     */
    preAnimateTaskNode(taskNode, finalStates) {
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
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            taskNode,
            taskNode.getTranslateX,
            taskNode.setTranslateX,
            finalStates['x']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            taskNode,
            taskNode.getTranslateY,
            taskNode.setTranslateY,
            finalStates['y']
          );
        }
      } else {
        // No animation; finalize render immediately
        taskNode.setTranslate(finalStates['x'], finalStates['y']);
      }
    }

    /**
     * Prepares task node animation.
     * @param {DvtGanttTaskNode} taskNode
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskNodeRemove(taskNode, onEnd) {
      if (this._animationMode === 'dataChange') {
        // Fade out, then finalize render at the end of animation
        this.fadeOutElemsDC.push(taskNode);
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }

    /**
     * Prepares task baseline shape animation.
     * @param {DvtGanttTask} task
     * @param {DvtGanttTaskShape} baselineShape
     * @param {object} finalStates Object defining the final animation state
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskBaseline(task, baselineShape, finalStates, onEnd) {
      var dimensionsAnimator,
        translationsAnimator,
        renderState = task.getRenderState('baseline');

      if (this._animationMode === 'onDisplay') {
        // Finalize render, start off the width to be 0, and grow the width dimension to its final width
        baselineShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          0,
          finalStates['h'],
          finalStates['r']
        );
        onEnd();

        dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
        dimensionsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          baselineShape,
          baselineShape.getWidth,
          baselineShape.setWidth,
          finalStates['w']
        );
      } else if (this._animationMode === 'dataChange') {
        if (renderState === 'add') {
          // Finalize render, start off the width to be 0, and grow the width dimension to its final width
          baselineShape.setDimensions(
            finalStates['x'],
            finalStates['y'],
            0,
            finalStates['h'],
            finalStates['r']
          );
          onEnd();

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            baselineShape,
            baselineShape.getWidth,
            baselineShape.setWidth,
            finalStates['w']
          );
        } else if (renderState === 'exist') {
          // Animate translation and dimensional changes, finalize render at the end of animation
          translationsAnimator = this.translationsPlayableDC.getAnimator();
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            baselineShape,
            baselineShape.getX,
            baselineShape.setX,
            finalStates['x']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            baselineShape,
            baselineShape.getY,
            baselineShape.setY,
            finalStates['y']
          );

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            baselineShape,
            baselineShape.getWidth,
            baselineShape.setWidth,
            finalStates['w']
          );
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            baselineShape,
            baselineShape.getHeight,
            baselineShape.setHeight,
            finalStates['h']
          );

          baselineShape.setBorderRadius(finalStates['r']);

          this._onEnds.push(onEnd);
        }
      } else {
        // No animation; finalize render immediately
        baselineShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          finalStates['w'],
          finalStates['h'],
          finalStates['r']
        );
        onEnd();
      }
    }

    /**
     * Prepares task baseline shape removal animation.
     * @param {DvtGanttTaskShape} baselineShape
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskBaselineRemove(baselineShape, onEnd) {
      if (this._animationMode === 'dataChange') {
        // Fade out element, finalize render at the end of animation
        this.fadeOutElemsDC.push(baselineShape);
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }

    /**
     * Prepares task main shape animation.
     * @param {DvtGanttTask} task
     * @param {object} finalStates Object defining the final animation state
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskMain(task, finalStates, onEnd) {
      var dimensionsAnimator,
        translationsAnimator,
        renderState = task.getRenderState('main');

      if (this._animationMode === 'onDisplay') {
        // Finalize render, start off the width to be 0, and grow the width dimension to its final width
        task.setMainDimensions(
          finalStates['x'],
          finalStates['y'],
          0,
          finalStates['h'],
          finalStates['r']
        );
        onEnd();

        dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
        dimensionsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          task,
          task.getMainWidth,
          task.setMainWidth,
          finalStates['w']
        );
      } else if (this._animationMode === 'dataChange') {
        if (renderState === 'add') {
          // Finalize render, start off the width to be 0, and grow the width dimension to its final width
          task.setMainDimensions(
            finalStates['x'],
            finalStates['y'],
            0,
            finalStates['h'],
            finalStates['r']
          );
          onEnd();

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            task,
            task.getMainWidth,
            task.setMainWidth,
            finalStates['w']
          );
        } else if (renderState === 'exist') {
          // Animate translation and dimensional changes, finalize render at the end of animation
          translationsAnimator = this.translationsPlayableDC.getAnimator();
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            task,
            task.getMainX,
            task.setMainX,
            finalStates['x']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            task,
            task.getMainY,
            task.setMainY,
            finalStates['y']
          );

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            task,
            task.getMainWidth,
            task.setMainWidth,
            finalStates['w']
          );
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            task,
            task.getMainHeight,
            task.setMainHeight,
            finalStates['h']
          );

          task.setMainBorderRadius(finalStates['r']);

          this._onEnds.push(onEnd);
        }
      } else {
        // No animation; finalize render immediately
        task.setMainDimensions(
          finalStates['x'],
          finalStates['y'],
          finalStates['w'],
          finalStates['h'],
          finalStates['r']
        );
        onEnd();
      }
    }

    /**
     * Prepares task main shape removal animation.
     * @param {DvtGanttTaskShape} mainShape
     * @param {DvtGanttTaskShape} mainBackgroundShape
     * @param {DvtGanttTaskShape} selectShape
     * @param {DvtGanttTaskShape} hoverShape
     * @param {DvtGanttTaskContent} customContent
     * @param {dvt.Container} elementsContainer
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskMainRemove(
      mainShape,
      mainBackgroundShape,
      selectShape,
      hoverShape,
      customContent,
      elementsContainer,
      onEnd
    ) {
      if (this._animationMode === 'dataChange') {
        // Fade out elements related to the main shape, finalize render at the end of animation
        this.fadeOutElemsDC.push(mainShape);
        if (mainBackgroundShape) {
          this.fadeOutElemsDC.push(mainBackgroundShape);
        }
        if (selectShape) {
          this.fadeOutElemsDC.push(selectShape);
        }
        if (hoverShape) {
          this.fadeOutElemsDC.push(hoverShape);
        }
        if (customContent) {
          this.fadeOutElemsDC.push(customContent);
        }
        if (elementsContainer) {
          this.fadeOutElemsDC.push(elementsContainer);
        }
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }

    /**
     * Prepares task progress shape animation.
     * @param {DvtGanttTask} task
     * @param {DvtGanttTaskShape} progressShape
     * @param {object} finalStates Object defining the final animation state
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskProgress(task, progressShape, finalStates, onEnd) {
      var dimensionsAnimator,
        translationsAnimator,
        renderState = task.getRenderState('progress');

      if (this._animationMode === 'onDisplay') {
        // Finalize render, start off the width to be 0, and grow the width dimension to its final width
        progressShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          0,
          finalStates['h'],
          finalStates['r']
        );
        onEnd();

        dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
        dimensionsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          progressShape,
          progressShape.getWidth,
          progressShape.setWidth,
          finalStates['w']
        );
      } else if (this._animationMode === 'dataChange') {
        if (renderState === 'add') {
          // Finalize render, start off the width to be 0, and grow the width dimension to its final width
          progressShape.setDimensions(
            finalStates['x'],
            finalStates['y'],
            0,
            finalStates['h'],
            finalStates['r']
          );
          onEnd();

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            progressShape,
            progressShape.getWidth,
            progressShape.setWidth,
            finalStates['w']
          );
        } else if (renderState === 'exist') {
          // Animate translation and dimensional changes, finalize render at the end of animation
          translationsAnimator = this.translationsPlayableDC.getAnimator();
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            progressShape,
            progressShape.getX,
            progressShape.setX,
            finalStates['x']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            progressShape,
            progressShape.getY,
            progressShape.setY,
            finalStates['y']
          );

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            progressShape,
            progressShape.getWidth,
            progressShape.setWidth,
            finalStates['w']
          );
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            progressShape,
            progressShape.getHeight,
            progressShape.setHeight,
            finalStates['h']
          );

          progressShape.setBorderRadius(finalStates['r']);

          this._onEnds.push(onEnd);
        }
      } else {
        // No animation; finalize render immediately
        progressShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          finalStates['w'],
          finalStates['h'],
          finalStates['r']
        );
        onEnd();
      }
    }

    /**
     * Prepares task progress shape removal animation.
     * @param {DvtGanttTaskShape} progressShape
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskProgressRemove(progressShape, onEnd) {
      if (this._animationMode === 'dataChange') {
        // Fade out element, finalize render at the end of animation
        this.fadeOutElemsDC.push(progressShape);
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }

    /**
     * Prepares task overtime shape animation.
     * @param {DvtGanttTask} task
     * @param {DvtGanttTaskShape} overtimeShape
     * @param {object} finalStates Object defining the final animation state
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskOvertime(task, overtimeShape, finalStates, onEnd) {
      var dimensionsAnimator,
        translationsAnimator,
        renderState = task.getRenderState('overtime');

      if (this._animationMode === 'onDisplay') {
        // Finalize render, start off the width to be 0, and grow the width dimension to its final width
        overtimeShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          0,
          finalStates['h'],
          finalStates['r']
        );
        onEnd();

        dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
        dimensionsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          overtimeShape,
          overtimeShape.getWidth,
          overtimeShape.setWidth,
          finalStates['w']
        );
      } else if (this._animationMode === 'dataChange') {
        if (renderState === 'add') {
          // Finalize render, start off the width to be 0, and grow the width dimension to its final width
          overtimeShape.setDimensions(
            finalStates['x'],
            finalStates['y'],
            0,
            finalStates['h'],
            finalStates['r']
          );
          onEnd();

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            overtimeShape,
            overtimeShape.getWidth,
            overtimeShape.setWidth,
            finalStates['w']
          );
        } else if (renderState === 'exist') {
          // Animate translation and dimensional changes, finalize render at the end of animation
          translationsAnimator = this.translationsPlayableDC.getAnimator();
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            overtimeShape,
            overtimeShape.getX,
            overtimeShape.setX,
            finalStates['x']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            overtimeShape,
            overtimeShape.getY,
            overtimeShape.setY,
            finalStates['y']
          );

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            overtimeShape,
            overtimeShape.getWidth,
            overtimeShape.setWidth,
            finalStates['w']
          );
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            overtimeShape,
            overtimeShape.getHeight,
            overtimeShape.setHeight,
            finalStates['h']
          );

          overtimeShape.setBorderRadius(finalStates['r']);

          this._onEnds.push(onEnd);
        }
      } else {
        // No animation; finalize render immediately
        overtimeShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          finalStates['w'],
          finalStates['h'],
          finalStates['r']
        );
        onEnd();
      }
    }

    /**
     * Prepares task overtime shape removal animation.
     * @param {DvtGanttTaskShape} overtimeShape
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskOvertimeRemove(overtimeShape, onEnd) {
      if (this._animationMode === 'dataChange') {
        // Fade out element, finalize render at the end of animation
        this.fadeOutElemsDC.push(progressShape);
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }

    /**
     * Prepares task downtime shape animation.
     * @param {DvtGanttTask} task
     * @param {DvtGanttTaskShape} downtimeShape
     * @param {object} finalStates Object defining the final animation state
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskDowntime(task, downtimeShape, finalStates, onEnd) {
      var dimensionsAnimator,
        translationsAnimator,
        renderState = task.getRenderState('downtime');

      if (this._animationMode === 'onDisplay') {
        // Finalize render, start off the width to be 0, and grow the width dimension to its final width
        downtimeShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          0,
          finalStates['h'],
          finalStates['r']
        );
        onEnd();

        dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
        dimensionsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          downtimeShape,
          downtimeShape.getWidth,
          downtimeShape.setWidth,
          finalStates['w']
        );
      } else if (this._animationMode === 'dataChange') {
        if (renderState === 'add') {
          // Finalize render, start off the width to be 0, and grow the width dimension to its final width
          downtimeShape.setDimensions(
            finalStates['x'],
            finalStates['y'],
            0,
            finalStates['h'],
            finalStates['r']
          );
          onEnd();

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            downtimeShape,
            downtimeShape.getWidth,
            downtimeShape.setWidth,
            finalStates['w']
          );
        } else if (renderState === 'exist') {
          // Animate translation and dimensional changes, finalize render at the end of animation
          translationsAnimator = this.translationsPlayableDC.getAnimator();
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            downtimeShape,
            downtimeShape.getX,
            downtimeShape.setX,
            finalStates['x']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            downtimeShape,
            downtimeShape.getY,
            downtimeShape.setY,
            finalStates['y']
          );

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            downtimeShape,
            downtimeShape.getWidth,
            downtimeShape.setWidth,
            finalStates['w']
          );
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            downtimeShape,
            downtimeShape.getHeight,
            downtimeShape.setHeight,
            finalStates['h']
          );

          downtimeShape.setBorderRadius(finalStates['r']);

          this._onEnds.push(onEnd);
        }
      } else {
        // No animation; finalize render immediately
        downtimeShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          finalStates['w'],
          finalStates['h'],
          finalStates['r']
        );
        onEnd();
      }
    }

    /**
     * Prepares task overtime shape removal animation.
     * @param {DvtGanttTaskShape} downtimeShape
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskDowntimeRemove(downtimeShape, onEnd) {
      if (this._animationMode === 'dataChange') {
        // Fade out element, finalize render at the end of animation
        this.fadeOutElemsDC.push(downtimeShape);
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }

    /**
     * Prepares task attribute shape animation.
     * @param {DvtGanttTask} task
     * @param {DvtGanttTaskShape} attributeShape
     * @param {object} finalStates Object defining the final animation state
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskAttribute(task, attributeShape, finalStates, onEnd) {
      var dimensionsAnimator,
        translationsAnimator,
        renderState = task.getRenderState('attribute');

      if (this._animationMode === 'onDisplay') {
        // Finalize render, start off the height to be 0, and grow the height dimension to its final height
        attributeShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          finalStates['w'],
          0,
          finalStates['r']
        );
        onEnd();

        dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
        dimensionsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          attributeShape,
          attributeShape.getHeight,
          attributeShape.setHeight,
          finalStates['h']
        );
      } else if (this._animationMode === 'dataChange') {
        if (renderState === 'add') {
          // Finalize render, start off the height to be 0, and grow the height dimension to its final height
          attributeShape.setDimensions(
            finalStates['x'],
            finalStates['y'],
            finalStates['w'],
            0,
            finalStates['r']
          );
          onEnd();

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            attributeShape,
            attributeShape.getHeight,
            attributeShape.setHeight,
            finalStates['h']
          );
        } else if (renderState === 'exist') {
          // Animate translation and dimensional changes, finalize render at the end of animation
          translationsAnimator = this.translationsPlayableDC.getAnimator();
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            attributeShape,
            attributeShape.getX,
            attributeShape.setX,
            finalStates['x']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            attributeShape,
            attributeShape.getY,
            attributeShape.setY,
            finalStates['y']
          );

          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            attributeShape,
            attributeShape.getWidth,
            attributeShape.setWidth,
            finalStates['w']
          );
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            attributeShape,
            attributeShape.getHeight,
            attributeShape.setHeight,
            finalStates['h']
          );

          attributeShape.setBorderRadius(finalStates['r']);

          this._onEnds.push(onEnd);
        }
      } else {
        // No animation; finalize render immediately
        attributeShape.setDimensions(
          finalStates['x'],
          finalStates['y'],
          finalStates['w'],
          finalStates['h'],
          finalStates['r']
        );
        onEnd();
      }
    }

    /**
     * Prepares task attribute shape removal animation.
     * @param {DvtGanttTaskShape} attributeShape
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskAttributeRemove(attributeShape, onEnd) {
      if (this._animationMode === 'dataChange') {
        // Fade out element, finalize render at the end of animation
        this.fadeOutElemsDC.push(attributeShape);
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }

    /**
     * Prepares task label animation.
     * @param {DvtGanttTaskNode} taskNode
     * @param {object} finalStates Object defining the final animation state
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskLabel(taskNode, finalStates, onEnd) {
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
        translationsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          labelOutputText,
          labelOutputText.getX,
          labelOutputText.setX,
          finalStates['x']
        );
        translationsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          labelOutputText,
          labelOutputText.getY,
          labelOutputText.setY,
          finalStates['y']
        );
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
            translationsAnimator.addProp(
              dvt.Animator.TYPE_NUMBER,
              labelOutputText,
              labelOutputText.getX,
              labelOutputText.setX,
              finalStates['x']
            );
            translationsAnimator.addProp(
              dvt.Animator.TYPE_NUMBER,
              labelOutputText,
              labelOutputText.getY,
              labelOutputText.setY,
              finalStates['y']
            );
          } else if (taskMainRenderState === 'exist') {
            // Fade in
            this.fadeInElemsDC.push(labelOutputText);
          }
        } else if (renderState === 'exist') {
          // Translate animation
          translationsAnimator = this.translationsPlayableDC.getAnimator();
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            labelOutputText,
            labelOutputText.getX,
            labelOutputText.setX,
            finalStates['x']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            labelOutputText,
            labelOutputText.getY,
            labelOutputText.setY,
            finalStates['y']
          );
          this._onEnds.push(onEnd);
        }
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        labelOutputText.setX(finalStates['x']);
        labelOutputText.setY(finalStates['y']);
        onEnd();
      }
    }

    /**
     * Prepares task label animation.
     * @param {dvt.OutputText} labelOutputText
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateTaskLabelRemove(labelOutputText, onEnd) {
      if (this._animationMode === 'dataChange') {
        // Fade out, finalize render at the end of animation
        this.fadeOutElemsDC.push(labelOutputText);
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }

    /**
     * Prepares horizontal grid line animation.
     * @param {dvt.Line} line The horizontal grid line
     * @param {object} finalStates Object defining the final animation state
     * @param {string} renderState The render state of the line
     */
    preAnimateHorizontalGridline(line, finalStates, renderState) {
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
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            line,
            line.getX1,
            line.setX1,
            finalStates['x1']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            line,
            line.getX2,
            line.setX2,
            finalStates['x2']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            line,
            line.getY1,
            line.setY1,
            finalStates['y1']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            line,
            line.getY2,
            line.setY2,
            finalStates['y2']
          );
        }
      } else {
        // No animation; finalize render immediately
        line.setY1(finalStates['y1']);
        line.setY2(finalStates['y2']);
        line.setX1(finalStates['x1']);
        line.setX2(finalStates['x2']);
      }
    }

    /**
     * Prepares gantt background animation.
     * @param {dvt.Rect} background The row background
     * @param {object} finalStates Object defining the final animation state
     * @param {string} renderState The render state of the background
     */
    preAnimateRowBackground(background, finalStates, renderState) {
      var dimensionsAnimator, translationsAnimator;

      if (this._animationMode === 'dataChange') {
        if (renderState === 'add') {
          this.fadeInElemsDC.push(background);
        }

        // Animate dimension and translation changes
        dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
        dimensionsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          background,
          background.getHeight,
          background.setHeight,
          finalStates['h']
        );
        dimensionsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          background,
          background.getWidth,
          background.setWidth,
          finalStates['w']
        );

        translationsAnimator = this.translationsPlayableDC.getAnimator();
        translationsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          background,
          background.getY,
          background.setY,
          finalStates['y']
        );
      } else {
        // No animation; finalize render immediately
        background.setY(finalStates['y']);
        background.setHeight(finalStates['h']);
        background.setWidth(finalStates['w']);
      }
    }

    /**
     * Prepares gantt row reference objects animation.
     * @param {DvtGanttReferenceObjects} refObj The reference objects
     * @param {object} finalStates Object defining the final animation state
     */
    preAnimateRowReferenceObject(refObj, finalStates) {
      var dimensionsAnimator;

      if (this._animationMode === 'dataChange') {
        // Animate height changes
        dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
        dimensionsAnimator.addProp(
          dvt.Animator.TYPE_NUMBER,
          refObj,
          refObj.getY2,
          refObj.setY2,
          finalStates['y2']
        );
      } else {
        // No animation; finalize render immediately
        refObj.updateRefObjs(refObj._refObjs, finalStates['y1'], finalStates['y2']);
      }
    }

    /**
     * Prepares row node removal animation.
     * @param {DvtGanttRowNode} rowNode
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateRowNodeRemove(rowNode, onEnd) {
      if (this._animationMode === 'dataChange') {
        // Fade out, finalize rendering at the end
        this.fadeOutElemsDC.push(rowNode);
        this.fadeOutElemsDC.push(rowNode.getBackground());
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }

    /**
     * Prepares row label animation.
     * @param {DvtGanttRowNode} rowNode
     * @param {DvtGanttRowLabelContent} labelContent
     * @param {object} finalStates Object defining the final animation state
     */
    preAnimateRowLabel(rowNode, labelContent, finalStates) {
      var rowRenderState = rowNode.getRenderState(),
        labelBackground = labelContent.getBackground(),
        translationsAnimator,
        dimensionsAnimator;

      if (this._animationMode === 'dataChange') {
        if (rowRenderState === 'add') {
          // Finalize render, then fade in
          labelContent.setY(finalStates['y']);
          labelContent.setX(finalStates['x']);

          this.fadeInElemsDC.push(labelContent.getDisplayable());

          labelBackground.setRect(
            finalStates.backgroundX,
            finalStates.backgroundY,
            finalStates.backgroundWidth,
            finalStates.backgroundHeight
          );
          this.fadeInElemsDC.push(labelBackground);
        } else if (rowRenderState === 'exist') {
          // Label translation animation
          translationsAnimator = this.translationsPlayableDC.getAnimator();
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            labelContent,
            labelContent.getX,
            labelContent.setX,
            finalStates['x']
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            labelContent,
            labelContent.getY,
            labelContent.setY,
            finalStates['y']
          );

          // Background dimension and translation changes
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            labelBackground,
            labelBackground.getX,
            labelBackground.setX,
            finalStates.backgroundX
          );
          translationsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            labelBackground,
            labelBackground.getY,
            labelBackground.setY,
            finalStates.backgroundY
          );
          dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            labelBackground,
            labelBackground.getWidth,
            labelBackground.setWidth,
            finalStates.backgroundWidth
          );
          dimensionsAnimator.addProp(
            dvt.Animator.TYPE_NUMBER,
            labelBackground,
            labelBackground.getHeight,
            labelBackground.setHeight,
            finalStates.backgroundHeight
          );
        }
      } else {
        // No animation; finalize render immediately
        labelContent.setY(finalStates['y']);
        labelContent.setX(finalStates['x']);

        labelBackground.setRect(
          finalStates.backgroundX,
          finalStates.backgroundY,
          finalStates.backgroundWidth,
          finalStates.backgroundHeight
        );
      }
    }

    /**
     * Prepares row label removal animation.
     * @param {DvtGanttRowLabelContent} labelContent
     * @param {dvt.Line} horizontalLine
     * @param {function} onEnd callback that finalizes rendering
     */
    preAnimateRowLabelRemove(labelContent, horizontalLine, onEnd) {
      if (this._animationMode === 'dataChange') {
        // Fade out, then finalize render
        this.fadeOutElemsDC.push(labelContent.getBackground());
        this.fadeOutElemsDC.push(labelContent.getDisplayable());
        this.fadeOutElemsDC.push(horizontalLine);
        this._onEnds.push(onEnd);
      } else {
        // No animation; just execute onEnd callback immediately to finalize render
        onEnd();
      }
    }
  }

  /**
   * Gantt automation service.
   * @param {Gantt} gantt The owning Gantt.
   * @class  DvtGanttAutomation
   * @implements {dvt.Automation}
   * @constructor
   */

  class DvtGanttAutomation extends dvt.Automation {
    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>taskbar[rowIndex][index]</li>
     * <li>rowLabel[index]</li>
     * </ul>
     * @override
     */
    GetSubIdForDomElement(displayable) {
      var logicalObj = this._comp.getEventManager().GetLogicalObject(displayable);
      if (logicalObj && logicalObj instanceof DvtGanttTaskNode) {
        var taskObj = logicalObj.getLayoutObject();
        var rowObj = taskObj['rowObj'];
        var rowIndex = rowObj['index'];
        // Albeit not as efficient, simple one liner below should be sufficiently fast for most usecases.
        var taskIndex = rowObj['taskObjs']
          .map((t) => {
            return t['node'];
          })
          .indexOf(logicalObj);
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
    }

    /**
     * Valid subIds inlcude:
     * <ul>
     * <li>taskbar[rowIndex][index]</li>
     * <li>rowLabel[index]</li>
     * </ul>
     * @override
     */
    getDomElementForSubId(subId) {
      // TOOLTIP
      if (subId === dvt.Automation.TOOLTIP_SUBID) return this.GetTooltipElement(this._comp);

      var openParen1 = subId.indexOf('[');
      var closeParen1 = subId.indexOf(']');
      var component = subId.substring(0, openParen1);

      if (openParen1 > -1 && closeParen1 > -1) {
        if (component === 'taskbar') {
          var openParen2 = subId.indexOf('[', openParen1 + 1);
          var closeParen2 = subId.indexOf(']', openParen2 + 1);
          if (openParen2 > -1 && closeParen2 > -1) {
            var rowIndex = parseInt(subId.substring(openParen1 + 1, closeParen1));
            var taskIndex = parseInt(subId.substring(openParen2 + 1, closeParen2));
            if (isNaN(rowIndex) || isNaN(taskIndex)) return null;

            var rowObjs = this._comp.getRowLayoutObjs();
            if (rowObjs.length > rowIndex) {
              var taskObjs = rowObjs[rowIndex]['taskObjs'];
              if (taskObjs.length > taskIndex) {
                var taskObj = taskObjs[taskIndex];
                this._comp.getDataLayoutManager().ensureInDOM(taskObj, 'task', true);
                var taskNode = taskObj['node'];
                var repShape = taskNode.getTask().getShape('main');
                if (repShape != null) return repShape.getElem();
              }
            }
          }
        } else if (component === 'rowLabel') {
          rowIndex = parseInt(subId.substring(openParen1 + 1, closeParen1));
          var rowObjs = this._comp.getRowLayoutObjs();
          if (rowObjs.length > rowIndex) {
            var rowObj = rowObjs[rowIndex];
            this._comp.getDataLayoutManager().ensureInDOM(rowObj, 'rowLabel');
            var rowLabelContent = rowObj['node'].getRowLabelContent();
            if (rowLabelContent != null) return rowLabelContent.getDisplayable().getElem();
          }
        } else if (component === 'dependency') {
          var dependencyIndex = parseInt(subId.substring(openParen1 + 1, closeParen1));
          var dependencyObjs = this._comp.getDependencyLayoutObjs();
          if (dependencyObjs.length > dependencyIndex) {
            for (var i = 0; i < dependencyObjs.length; i++) {
              var dependencyObj = dependencyObjs[i];
              if (dependencyObj['index'] === dependencyIndex) {
                this._comp.getDataLayoutManager().ensureInDOM(dependencyObj, 'dependency');
                var dependencyNode = dependencyObj['node'];
                if (dependencyNode != null) return dependencyNode.getElem();
              }
            }
          }
        }
      }
      return null;
    }
  }

  /**
   * Default values and utility functions for component versioning.
   * @class
   * @constructor
   * @param {dvt.Context} context The rendering context.
   * @extends {dvt.BaseComponentDefaults}
   */
  class DvtGanttDefaults extends dvt.BaseComponentDefaults {
    constructor(context) {
      /**
       * Contains overrides for version 1.
       * @const
       */
      const VERSION_1 = {
        axisPosition: 'top',
        animationOnDataChange: 'none',
        animationOnDisplay: 'none',
        scrollbar: {
          horizontal: 'off',
          vertical: 'off'
        },
        gridlines: {
          horizontal: 'hidden',
          vertical: 'visible'
        },
        selectionMode: 'none',
        scrollPosition: { y: 0 },
        rowDefaults: {
          height: null
        },
        taskDefaults: {
          labelPosition: ['end', 'innerCenter', 'start', 'max'],
          borderRadius: '0',
          overlap: {
            behavior: 'auto',
            offset: null
          },
          progress: {
            height: '100%',
            borderRadius: '0'
          },
          baseline: {
            borderRadius: '0'
          },
          type: 'auto'
        },
        rowAxis: {
          rendered: 'off',
          width: 'max-content',
          maxWidth: 'none'
        }
      };
      super({ alta: VERSION_1 }, context);
    }

    /**
     * @override
     */
    getNoCloneObject() {
      // Date time options as of 3.0.0 only support number and string types
      // e.g. Date object type is not supported. However,
      // during the options merging in SetOptions method,
      // Date objects are automatically converted to number by default.
      // We want to specify that they are to remain Date objects so that
      // we can handle them in our code.
      return {
        start: true,
        end: true,
        viewportStart: true,
        viewportEnd: true,
        rows: true, // For performance reasons, don't clone data objects--we'll ensure data objects are not mutated downstream
        dependencies: true, // For performance reasons, don't clone data objects--we'll ensure data objects are not mutated downstream
        referenceObjects: { value: true },
        // Don't clone areas where app may pass in an instance of DvtTimeComponentScales/Converter
        // If the instance is a class, class methods may not be cloned for some reason.
        majorAxis: { converter: true, scale: true, zoomOrder: true },
        minorAxis: { converter: true, scale: true, zoomOrder: true },
        // Don't clone areas where app may pass in an instance of Converter
        // If the instance is a class, class methods may not be cloned for some reason.
        valueFormats: {
          baselineDate: { converter: true },
          baselineEnd: { converter: true },
          baselineStart: { converter: true },
          date: { converter: true },
          downtimeEnd: { converter: true },
          downtimeStart: { converter: true },
          end: { converter: true },
          overtimeEnd: { converter: true },
          overtimeStart: { converter: true },
          progress: { converter: true },
          start: { converter: true }
        },
        _resources: {
          converter: true,
          defaultDateConverter: true,
          defaultDateTimeConverter: true,
          percentConverter: true
        }
      };
    }

    /**
     * @override
     */
    getAnimationDuration(options) {
      return options['_resources'] ? options['_resources']['animationDuration'] : null;
    }
  }

  /**
   * Gantt JSON Parser
   * @class
   * @constructor
   * @extends {dvt.Obj}
   */
  const DvtGanttParser = {
    /**
     * Parses the specified XML String and returns the root node of the gantt
     * @param {string} options The String containing XML describing the component.
     * @return {object} An object containing the parsed properties
     */
    parse: (options) => {
      var ret = {};

      var parseDateOption = (key) => {
        var optionType = typeof options[key];
        // Ensures date option is of type number or string,
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
        if (options['gridlines']['horizontal'] != null)
          ret.horizontalGridline = options['gridlines']['horizontal'];

        if (options['gridlines']['vertical'] != null)
          ret.verticalGridline = options['gridlines']['vertical'];
      }

      ret.xScrollbar = 'off';
      ret.yScrollbar = 'off';
      if (options['scrollbars']) {
        if (options['scrollbars']['horizontal']) ret.xScrollbar = options['scrollbars']['horizontal'];

        if (options['scrollbars']['vertical']) ret.yScrollbar = options['scrollbars']['vertical'];
      }

      ret.isIRAnimationEnabled = options['animationOnDisplay'] === 'auto';
      ret.isDCAnimationEnabled = options['animationOnDataChange'] === 'auto';

      if (options['rowAxis'] != null) {
        ret.rowAxisRendered = options['rowAxis']['rendered'];
        ret.rowAxisWidth = options['rowAxis']['width'];
        ret.rowAxisMaxWidth = options['rowAxis']['maxWidth'];
      }

      ret.referenceObjects = options['referenceObjects'];

      ret.styleClass = options['className'];
      ret.inlineStyle = options['style'];

      return ret;
    }
  };

  /**
   * Class representing a Gantt row axis
   * @param {Gantt} gantt the Gantt component
   * @class
   * @constructor
   */
  class DvtGanttRowAxis extends dvt.Container {
    constructor(gantt) {
      super(gantt.getCtx());
      this._gantt = gantt;
      // the gantt (chart) itself have listeners; need to add mouse listeners on
      // the row axis to allow tooltips to show up for row labels
      // However, we cannot just do gantt.getEventManager().addListeners(this);
      // which adds all the events, because the keyboard event on first tab to the Gantt
      // will be handled both by the gantt and the row axis listeners, and they conflict.
      // We only need tooltips on hover, so adding mouse events only would suffice.
      var em = gantt.getEventManager();
      this.addEvtListener(dvt.MouseEvent.MOUSEMOVE, em.OnMouseMove.bind(em), false, this);
      this.addEvtListener(dvt.MouseEvent.MOUSEOVER, em.PreOnMouseOver.bind(em), false, this);
      this.addEvtListener(dvt.MouseEvent.MOUSEOUT, em.PreOnMouseOut.bind(em), false, this);

      // label background container
      this._labelBackgroundContainer = new dvt.Container(gantt.getCtx());
      this.addChild(this._labelBackgroundContainer);

      // label content container
      this._labelContentContainer = new dvt.Container(gantt.getCtx());
      this.addChild(this._labelContentContainer);
    }

    /**
     * Gets the default row label CSSStyle object
     * @param {boolean} useCache Whether to use a cached CSSStyle object or generate a new one
     * @return {dvt.CSSStyle} The default row label CSSStyle object
     */
    getDefaultRowLabelStyle(useCache) {
      var options = this._gantt.getOptions();
      if (!useCache) {
        return DvtGanttStyleUtils.getRowLabelStyle(options);
      }

      if (!this._defaultLabelCSSStyle) {
        this._defaultLabelCSSStyle = DvtGanttStyleUtils.getRowLabelStyle(options);
      }
      return this._defaultLabelCSSStyle;
    }

    /**
     * Gets the CSSStyle object of the label style
     * @param {string|Object} labelStyle The specified label style
     * @return {dvt.CSSStyle} The CSSStyle object
     * @private
     */
    _getCSSStyle(labelStyle) {
      if (labelStyle != null && labelStyle !== '' && Object.keys(labelStyle).length !== 0) {
        // need to instantiate a new dvt.CSSStyle object because we're going to modify it
        var customLabelCSSStyle = this.getDefaultRowLabelStyle(false);
        customLabelCSSStyle.parseInlineStyle(labelStyle);
        return customLabelCSSStyle;
      }
      return this.getDefaultRowLabelStyle(true);
    }

    /**
     * Gets the label content type.
     * @return {string} 'custom' if content is from provided custom renderer or 'text' otherwise, derived from the provided row label string.
     */
    getLabelContentType() {
      var options = this._gantt.getOptions()['rowAxis'];
      if (options['label'] && options['label']['renderer']) return 'custom';
      return 'text';
    }

    /**
     * Gets the available width.
     * @param {number} totalAvailWidth The total available width.
     * @return {object} An object containing the max width, width, and calculated width, in px. -1 width means 'max-content'
     * @private
     */
    _getAvailableWidth(totalAvailWidth) {
      var maxWidthOption = this._gantt.getRowAxisMaxWidth();
      var widthOption = this._gantt.getRowAxisWidth();
      var maxWidth, widthDemanded;

      if (maxWidthOption != null && maxWidthOption !== 'none')
        maxWidth = Math.min(
          DvtGanttStyleUtils.getSizeInPixels(maxWidthOption, totalAvailWidth),
          totalAvailWidth
        );
      maxWidth = maxWidth != null && !isNaN(maxWidth) ? maxWidth : totalAvailWidth;

      if (widthOption != null && widthOption !== 'max-content')
        widthDemanded = DvtGanttStyleUtils.getSizeInPixels(
          this._gantt.getRowAxisWidth(),
          totalAvailWidth
        );
      widthDemanded = widthDemanded != null && !isNaN(widthDemanded) ? widthDemanded : -1;

      return {
        maxWidth: maxWidth,
        width: widthDemanded,
        calculatedWidth: widthDemanded !== -1 ? Math.min(widthDemanded, maxWidth) : maxWidth
      };
    }

    /**
     * Gets the available width object, which contains the max width, width, and calculated width, in px. -1 width means 'max-content'
     * @return {Object} The availableWidth object
     */
    getAvailableWidth() {
      return this._availableWidth;
    }

    /**
     * Gets the width of the row axis.
     * @return {number} the width
     */
    getWidth() {
      return this._width;
    }

    /**
     * Gets the label content indent size
     * @param {Object} rowObj The row's layout object
     * @return {number}
     */
    getLabelContentIndentSize(rowObj) {
      var depth = rowObj['depth'];
      var indentSize = DvtGanttStyleUtils.getRowLabelIndentSize();
      var buttonSize = DvtGanttStyleUtils.getRowLabelButtonSize();
      var gapSize = DvtGanttStyleUtils.getRowLabelButtonContentGapSize();
      return depth * indentSize + buttonSize + gapSize;
    }

    /**
     * Returns the maximum width for text label contents in the specified arrays.
     * Takes into account indent/icon space for expand/collapse.
     * @param {dvt.Context} context
     * @param {array} textStringArray An array of text strings.
     * @param {array} cssStyle Array of styles to be used for the texts
     * @return {Number}
     */
    _getMaxTextContentWidth(context, textStringArray, cssStyle) {
      if (!this._gantt.isRowsHierarchical()) {
        return dvt.TextUtils.getMaxTextStringWidth(context, textStringArray, cssStyle);
      }

      // If hierarchical, take into account space for indents and icon
      var rowObjs = this._gantt.getRowLayoutObjs();
      var maxContentWidth = 0;
      for (var i = 0; i < textStringArray.length; i++) {
        var textString = textStringArray[i] ? textStringArray[i] : '';
        var style = cssStyle[i];
        var textWidth = dvt.TextUtils.getTextStringWidth(context, textString, style);
        // Leaf with empty string labels--don't account for indent. It looks better.
        var indentSize =
          rowObjs[i]['expanded'] == null && textString.length === 0
            ? 0
            : this.getLabelContentIndentSize(rowObjs[i]);
        var contentWidth = indentSize + textWidth;

        if (contentWidth > maxContentWidth) maxContentWidth = contentWidth;
      }
      return maxContentWidth;
    }

    /**
     * Renders the content of the row axis.
     * @param {number} totalAvailWidth The total available width.
     * @param {boolean} isResize Whether this render call is due to component resize.
     */
    render(totalAvailWidth, isResize) {
      if (!isResize) this.setAriaRole('grid', true);
      this._availableWidth = this._getAvailableWidth(totalAvailWidth);

      if (isResize) {
        if (this._availableWidth['width'] !== -1)
          this._width = this._availableWidth['calculatedWidth'];
        return;
      }

      // Note the row axis DOM will be cleared in gantt.renderViewport(), so just need to clear _rowLabelContents
      this._rowLabelContents = [];
      var contentType = this.getLabelContentType();
      var rowObjs = this._gantt.getRowLayoutObjs();

      if (this._availableWidth['width'] === -1) {
        // row axis width determined by content width
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
          this._width = this._getMaxTextContentWidth(
            this._gantt.getCtx(),
            textStringArray,
            cssStyleArray
          );
        }
        // If custom content, then we need to render all the contents to determine width to allocate
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
        var options = this._gantt.getOptions();
        var startPadding = DvtGanttStyleUtils.getRowLabelPaddingStart(options);
        var endPadding = DvtGanttStyleUtils.getRowLabelPaddingEnd(options);
        this._width += startPadding + endPadding;
      } else {
        // row axis width is not dependent on content width; defer actual content rendering to when rows are rendered
        this._width = this._availableWidth['calculatedWidth'];
        for (var i = 0; i < rowObjs.length; i++) {
          this._rowLabelContents.push(null);
        }
      }

      // Make sure allocated width is bounded by maxWidth, and is integer pixels to avoid svg rendering issues
      this._width = Math.ceil(Math.min(this._width, this._availableWidth['maxWidth']));
    }

    /**
     * Adds the label content to the row axis
     * @param {dvt.Displayable} labelContent
     */
    addLabelContent(labelContent) {
      this._labelContentContainer.addChild(labelContent);
    }

    /**
     * Removes the label content from the row axis
     * @param {dvt.Displayable} labelContent
     */
    removeLabelContent(labelContent) {
      this._labelContentContainer.removeChild(labelContent);
    }

    /**
     * Adds the label background to the row axis
     * @param {dvt.Rect} background
     */
    addLabelBackground(background) {
      this._labelBackgroundContainer.addChild(background);
    }

    /**
     * Removes the label background from the row axis
     * @param {dvt.Rect} background
     */
    removeLabelBackground(background) {
      this._labelBackgroundContainer.removeChild(background);
    }

    /**
     * Adds the horizontal gridline to the row axis
     * @param {dvt.Line} line
     */
    addHorizontalLine(line) {
      this._labelContentContainer.addChild(line);
    }

    /**
     * Removes the horizontal gridline from the row axis
     * @param {dvt.Line} line
     */
    removeHorizontalLine(line) {
      this._labelContentContainer.removeChild(line);
    }

    /**
     * Gets the array of row label contents
     * @return {array} An array of DvtGanttRowLabelContent objects
     */
    getRowLabelContents() {
      return this._rowLabelContents;
    }

    /**
     * Sets the background container.
     * @param {dvt.Container} backgroundContainer The background container.
     */
    setBackgroundContainer(backgroundContainer) {
      this._backgroundContainer = backgroundContainer;
    }

    /**
     * Gets the background container.
     * @return {dvt.Container} The background container.
     */
    getBackgroundContainer() {
      return this._backgroundContainer;
    }

    /**
     * Sets the background horizontal divider that lines up with the time axis.
     * @param {dvt.Line|undefined} backgroundDivider The background divider.
     */
    setBackgroundDivider(backgroundDivider) {
      this._backgroundDivider = backgroundDivider;
    }

    /**
     * Gets the background horizontal divider that lines up with the time axis.
     * @return {dvt.Line|undefined} The background divider.
     */
    getBackgroundDivider() {
      return this._backgroundDivider;
    }

    /**
     * Adjusts the row axis position. Called after databody position is calculated to be in sync.
     */
    adjustPosition() {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var width = this._width;
      var height = this._gantt.getDatabodyHeight();
      var componentStartPadding = DvtGanttStyleUtils.getComponentPaddingStart(
        this._gantt.getOptions()
      );

      var x = isRTL
        ? this._gantt.getStartXOffset() +
          this._gantt.getCanvasLength() +
          this._gantt.getBorderWidth() +
          DvtGanttStyleUtils.getRowAxisGap()
        : componentStartPadding;
      this.setTranslateX(x);

      var cp = new dvt.ClipPath();
      cp.addRect(
        isRTL ? x : x - componentStartPadding,
        this._gantt.getDatabodyStart() + this._gantt.getStartYOffset(),
        width + componentStartPadding,
        height
      );
      this.setClipPath(cp);

      this._backgroundContainer.setTranslateX(isRTL ? x - 1 : x); // offset by 1 in rtl to hide border touching gantt (see also DvtGanttRenderer.renderRowAxis).
      var backgroundCp = new dvt.ClipPath();
      backgroundCp.addRect(this.getTranslateX(), 0, width, this._gantt._backgroundHeight);
      this._backgroundContainer.setClipPath(backgroundCp);

      if (this._backgroundDivider) {
        var dividerY =
          this._gantt.getDatabodyStart() +
          this._gantt.getStartYOffset() +
          (this._gantt.getAxisPosition() !== 'top') * (this._gantt.getDatabodyHeight() + 1);
        this._backgroundDivider.setY1(dividerY);
        this._backgroundDivider.setY2(dividerY);
      }
    }

    /**
     * Clears the row axis.
     */
    clear() {
      this._labelContentContainer.removeChildren();
      this._labelBackgroundContainer.removeChildren();
    }
  }

  /**
   * Class representing a group of reference objects (of the same type).
   * A group of reference objects are rendered as 1 giant path element.
   * First reference object of the group is referenced for styling and shortDesc.
   * @param {Gantt} gantt The gantt component
   * @param {string} type 'line' or 'area' or 'timeCursor'
   * @param {Array} refObjs The reference objects (of the same type)
   * @class
   * @constructor
   * @implements {DvtTooltipSource}
   */
  class DvtGanttReferenceObjects extends dvt.Container {
    constructor(gantt, type, refObjs) {
      super(gantt.getCtx(), null);
      this._gantt = gantt;
      this._type = type;
      this._refObjs = refObjs;
      this._gantt.getEventManager().associate(this, this);
    }

    /**
     * Applies svgStyle and svgClassName on reference objects.
     * @private
     */
    _applyStyles() {
      var svgStyle = this._refObjs[0].svgStyle;
      var svgClassName = this._refObjs[0].svgClassName;

      if (svgStyle != null) {
        this._ref.setStyle(svgStyle);
      }

      var defaultStyleClass;
      switch (this._type) {
        case 'line':
          defaultStyleClass = this._gantt.GetStyleClass('referenceObjectLine');
          break;
        case 'timeCursor':
          defaultStyleClass = this._gantt.GetStyleClass('timeCursorLine');
          break;
        case 'area':
          defaultStyleClass = this._gantt.GetStyleClass('referenceObjectArea');
          break;
        default:
          defaultStyleClass = this._gantt.GetStyleClass('referenceObjectLine');
      }
      var styleClass =
        svgClassName != null ? defaultStyleClass + ' ' + svgClassName : defaultStyleClass;
      this._ref.setClassName(styleClass, true);
    }

    /**
     * Computes a single path command that would draw all the reference objects.
     * @param {number} y1 top position
     * @param {number} y2 bottom position
     * @param {number} offset px offset in x direction. Usually this should be 0.
     * @returns {string} the path command
     * @private
     */
    _calcCmds(y1, y2, offset) {
      var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
      var minTime = this._gantt.getStartTime();
      var maxTime = this._gantt.getEndTime();
      var width = this._gantt.getContentLength();

      var cmds = '';
      if (this._type === 'line' || this._type === 'timeCursor') {
        this._refObjs.forEach((refObj) => {
          var valueTime = new Date(refObj.value).getTime();
          var pos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(minTime, maxTime, valueTime, width) + (offset || 0);
          if (isRTL) {
            pos = width - pos;
          }

          cmds += dvt.PathUtils.moveTo(pos, y1) + dvt.PathUtils.verticalLineTo(y2);
        }, this);
      } else {
        this._refObjs.forEach((refObj) => {
          var startTime = new Date(refObj.start).getTime();
          var endTime = new Date(refObj.end).getTime();
          var startPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(minTime, maxTime, startTime, width);
          var endPos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(minTime, maxTime, endTime, width);
          var leftPos = isRTL ? width - endPos : startPos;
          var rightPos = isRTL ? width - startPos : endPos;

          cmds +=
            dvt.PathUtils.moveTo(leftPos, y1) +
            dvt.PathUtils.horizontalLineTo(rightPos) +
            dvt.PathUtils.verticalLineTo(y2) +
            dvt.PathUtils.horizontalLineTo(leftPos) +
            dvt.PathUtils.verticalLineTo(y1);
        }, this);
      }

      return cmds;
    }

    /**
     * Renders the reference objects.
     * @param {dvt.Container} container The container to render into.
     * @param {y1=} y1 top position. Defaults to databody start.
     * @param {y2=} y2 bottom position. Defaults to bottom of viewport.
     */
    render(container, y1, y2) {
      if (this._refObjs.length === 0) {
        return;
      }

      this._y1 = y1 == null ? this._gantt.getDatabodyStart() : y1;
      this._y2 = y2 == null ? this._gantt.getDatabodyStart() + this._gantt.getDatabodyHeight() : y2;

      this._ref = new dvt.Path(this._gantt.getCtx(), this._calcCmds(this._y1, this._y2, 0));
      if (this._type === 'line' || this._type === 'timeCursor') {
        // For reference lines, there's a light "border" counterpart for contrast
        this._partnerRef = new dvt.Path(this._gantt.getCtx(), this._calcCmds(this._y1, this._y2, 1));
        var innerLineClassName = this._gantt.GetStyleClass(
          this._type === 'timeCursor' ? 'timeCursorInnerLine' : 'referenceObjectInnerLine'
        );
        this._partnerRef.setClassName(innerLineClassName, true);
        this.addChild(this._partnerRef);
      }

      this._applyStyles();

      this.addChild(this._ref);
      container.addChild(this);
    }

    /**
     * Sets new reference objects, and update the rendering
     * @param {Array} refObjs The reference objects (of the same type)
     * @param {y1=} y1 top position. Defaults to the previous value.
     * @param {y2=} y2 bottom position. Defaults to the previous value.
     */
    updateRefObjs(refObjs, y1, y2) {
      this._refObjs = refObjs;
      this._y1 = y1 == null ? this._y1 : y1;
      this._y2 = y2 == null ? this._y2 : y2;
      this._ref.setCmds(this._calcCmds(this._y1, this._y2, 0));
      if (this._partnerRef) {
        this._partnerRef.setCmds(this._calcCmds(this._y1, this._y2, 1));
      }
    }

    /**
     * Gets top position.
     */
    getY1() {
      return this._y1;
    }

    /**
     * Gets bottom position.
     */
    getY2() {
      return this._y2;
    }

    /**
     * Sets the bottom position and update rendering.
     */
    setY2(y2) {
      this.updateRefObjs(this._refObjs, this._y1, y2);
    }

    /**
     * Hide
     */
    hide() {
      this.setAlpha(0);
    }

    /**
     * Show
     */
    show() {
      this.setAlpha(1);
    }

    /**
     * @override
     */
    getDatatip() {
      return this._refObjs[0].shortDesc;
    }
  }

  /**
   * Renderer for Gantt.
   * @class
   */
  const DvtGanttRenderer = {
    /**
     * Renders the Gantt.
     * @param {Gantt} gantt The Gantt chart being rendered.
     */
    renderGantt: (gantt) => {
      DvtGanttRenderer._renderBackground(gantt);
      DvtGanttRenderer._renderScrollableCanvas(gantt);

      // Prepare initial render animation
      gantt.getAnimationManager().preAnimateGanttIR(gantt);

      // remove any empty text first if present
      gantt.removeEmptyText();

      if (gantt.hasValidOptions()) {
        DvtGanttRenderer._prepareTaskFillFilters(gantt);

        gantt.renderTimeZoomCanvas(gantt._canvas);

        var timeZoomCanvas = gantt.getTimeZoomCanvas();
        DvtGanttRenderer._renderAxes(gantt, timeZoomCanvas);
        DvtGanttRenderer._renderDatabodyBackground(gantt, timeZoomCanvas);
        DvtGanttRenderer._renderRowReferenceObjectsContainer(gantt, timeZoomCanvas);
        DvtGanttRenderer._renderReferenceObjects(gantt, timeZoomCanvas, 'area');
        DvtGanttRenderer._renderVerticalGridline(gantt, timeZoomCanvas);
        if (gantt.isRowAxisEnabled()) gantt.getRowAxis().adjustPosition();

        DvtGanttRenderer._renderData(gantt, timeZoomCanvas, DvtGanttDataLayoutManager.VPC_REFRESH);

        DvtGanttRenderer._renderReferenceObjects(gantt, timeZoomCanvas, 'line');

        DvtGanttRenderer._renderTimeCursor(gantt, timeZoomCanvas);

        DvtGanttRenderer._renderZoomControls(gantt);

        // Render Marquee artifacts container
        if (gantt.isMarqueeSelectEnabled()) {
          DvtGanttRenderer._renderMarqueeArtifactsContainer(gantt, timeZoomCanvas);
        } else {
          var marqueeArtifactsContainer = gantt.getMarqueeArtifactsContainer();
          if (marqueeArtifactsContainer) {
            marqueeArtifactsContainer.getParent().removeChild(marqueeArtifactsContainer);
            gantt.setMarqueeArtifactsContainer(null);
          }
        }

        // Render DnD affordances container at the very top of the chart area.
        if (gantt.isDndEnabled())
          DvtGanttRenderer._renderDnDArtifactsContainer(gantt, timeZoomCanvas);

        // In the case where this render call happened to update view due to expand/collapse via keyboard shortcut on a task,
        // we need to refresh the task's aria-label so that screenreaders read the correct label out.
        // For now, renderState is only non-null for expand/collapse case.
        if (gantt.getRenderState() != null) {
          var currentNavigable = gantt.getEventManager().getFocus();
          if (currentNavigable && currentNavigable instanceof DvtGanttTaskNode) {
            currentNavigable.refreshAriaLabel();
          }
        }

        // Initial Selection
        gantt._processInitialSelections();

        if (gantt.isTimeDirScrollbarOn() || gantt.isContentDirScrollbarOn())
          DvtGanttRenderer._renderScrollbars(gantt, gantt);

        gantt.setIsLastRenderValid(true);
      } else {
        DvtGanttRenderer._renderEmptyText(gantt);
        gantt.setIsLastRenderValid(false);
      }

      DvtGanttRenderer.renderRowAxisVerticalDivider(gantt, gantt._canvas);
    },

    /**
     * Adds the feColorMatrix filters (used for task shape/progress/variance etc fill overlays)
     * to the page's shared defs if they don't exist already (so that multiple gantts on a page can share them).
     * @param {Gantt} gantt The gantt being rendered.
     * @private
     */
    _prepareTaskFillFilters: (gantt) => {
      if (!document.getElementById(DvtGanttStyleUtils.getTaskTintFilterId())) {
        // overlay fill with rgba(255, 255, 255, tintAlpha);
        var tintAlpha = DvtGanttStyleUtils.getTaskTintAlpha();
        var taskTintFilter = dvt.SvgShapeUtils.createElement(
          'filter',
          DvtGanttStyleUtils.getTaskTintFilterId()
        );
        var taskTintColorMatrix = dvt.SvgShapeUtils.createElement('feColorMatrix');
        taskTintColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
        taskTintColorMatrix.setAttribute('type', 'matrix');
        taskTintColorMatrix.setAttribute(
          'values',
          1 -
            tintAlpha +
            ' 0 0 0 ' +
            tintAlpha +
            ' 0 ' +
            (1 - tintAlpha) +
            ' 0 0 ' +
            tintAlpha +
            ' 0 0 ' +
            (1 - tintAlpha) +
            ' 0 ' +
            tintAlpha +
            ' 0 0 0 1 0'
        );
        taskTintFilter.appendChild(taskTintColorMatrix);

        // overlay fill with rgba(0, 0, 0, shadeAlpha);
        var shadeAlpha = DvtGanttStyleUtils.getTaskShadeAlpha();
        var taskShadeFilter = dvt.SvgShapeUtils.createElement(
          'filter',
          DvtGanttStyleUtils.getTaskShadeFilterId()
        );
        var taskShadeColorMatrix = dvt.SvgShapeUtils.createElement('feColorMatrix');
        taskShadeColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
        taskShadeColorMatrix.setAttribute('type', 'matrix');
        taskShadeColorMatrix.setAttribute(
          'values',
          1 -
            shadeAlpha +
            ' 0 0 0 0' +
            ' 0 ' +
            (1 - shadeAlpha) +
            ' 0 0 0' +
            ' 0 0 ' +
            (1 - shadeAlpha) +
            ' 0 0' +
            ' 0 0 0 1 0'
        );
        taskShadeFilter.appendChild(taskShadeColorMatrix);

        // Add the filters to the shared defs
        gantt.appendSharedDefs(taskTintFilter);
        gantt.appendSharedDefs(taskShadeFilter);
      }
    },

    /**
     * Prepares the time direction scrollbar for rendering.
     * @param {Gantt} gantt The gantt being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     * @return {dvt.Dimension} The dimension of the scrollbar.
     * @private
     */
    _prerenderTimeDirScrollbar: (gantt, container, availSpace) => {
      var width = availSpace.w;
      var height = dvt.CSSStyle.toNumber(gantt.timeDirScrollbarStyles.getHeight());
      gantt.setTimeDirScrollbar(new dvt.SimpleScrollbar(gantt.getCtx(), gantt.HandleEvent, gantt));
      container.addChild(gantt.timeDirScrollbar);
      dvt.LayoutUtils.position(availSpace, 'bottom', gantt.timeDirScrollbar, width, height, 0);
      return new dvt.Dimension(width, height);
    },

    /**
     * Prepares the content direction scrollbar for rendering.
     * @param {Gantt} gantt The gantt being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {dvt.Rectangle} availSpace The available space.
     * @return {dvt.Dimension} The dimension of the scrollbar.
     * @private
     */
    _prerenderContentDirScrollbar: (gantt, container, availSpace) => {
      var width = dvt.CSSStyle.toNumber(gantt.contentDirScrollbarStyles.getWidth());
      var height = availSpace.h;
      gantt.setContentDirScrollbar(new dvt.SimpleScrollbar(gantt.getCtx(), gantt.HandleEvent, gantt));
      container.addChild(gantt.contentDirScrollbar);
      dvt.LayoutUtils.position(
        availSpace,
        dvt.Agent.isRightToLeft(gantt.getCtx()) ? 'left' : 'right',
        gantt.contentDirScrollbar,
        width,
        height,
        0
      );
      return new dvt.Dimension(width, height);
    },

    /**
     * Renders the scrollbars.
     * @param {Gantt} gantt The gantt being rendered.
     * @param {dvt.Container} container The container to render into
     * @private
     */
    _renderScrollbars: (gantt, container) => {
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
        gantt._scrollbarsCanvas = new dvt.Container(context, 'g', 'sbCanvas');
        container.addChild(gantt._scrollbarsCanvas);
      } else gantt._scrollbarsCanvas.removeChildren();

      if (gantt.isTimeDirScrollbarOn()) {
        var availSpaceWidth = gantt.getCanvasLength();
        var availSpaceHeight = gantt.Height - scrollbarPadding;
        var timeDirScrollbarDim = DvtGanttRenderer._prerenderTimeDirScrollbar(
          gantt,
          gantt._scrollbarsCanvas,
          new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight)
        );
      }
      if (gantt.isContentDirScrollbarOn()) {
        availSpaceWidth = gantt.Width - scrollbarPadding;
        availSpaceHeight = gantt.getDatabodyHeight();
        var scrollbarXOffset = dvt.Agent.isRightToLeft(gantt.getCtx())
          ? gantt.getScrollbarPadding()
          : 0;
        var contentDirScrollbarDim = DvtGanttRenderer._prerenderContentDirScrollbar(
          gantt,
          gantt._scrollbarsCanvas,
          new dvt.Rectangle(scrollbarXOffset, 0, availSpaceWidth - scrollbarXOffset, availSpaceHeight)
        );
      }

      if (gantt.timeDirScrollbar && timeDirScrollbarDim) {
        var sbOptions = {};
        sbOptions['color'] = gantt.timeDirScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
        sbOptions['backgroundColor'] = gantt.timeDirScrollbarStyles.getStyle(
          dvt.CSSStyle.BACKGROUND_COLOR
        );
        sbOptions['min'] = gantt._start;
        sbOptions['max'] = gantt._end;
        sbOptions['isHorizontal'] = true;
        sbOptions['isReversed'] = dvt.Agent.isRightToLeft(gantt.getCtx());
        gantt.timeDirScrollbar.setTranslateX(gantt.getStartXOffset());
        gantt.timeDirScrollbar.render(sbOptions, timeDirScrollbarDim.w, timeDirScrollbarDim.h);
        gantt.timeDirScrollbar.setViewportRange(gantt._viewStartTime, gantt._viewEndTime);
      }

      if (gantt.contentDirScrollbar && contentDirScrollbarDim) {
        sbOptions = {};
        sbOptions['color'] = gantt.contentDirScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
        sbOptions['backgroundColor'] = gantt.contentDirScrollbarStyles.getStyle(
          dvt.CSSStyle.BACKGROUND_COLOR
        );
        sbOptions['min'] = -(
          Math.max(gantt.getContentHeight(), contentDirScrollbarDim.h) - databodyStart
        );
        sbOptions['max'] = databodyStart;
        sbOptions['isHorizontal'] = false;
        sbOptions['isReversed'] = true;
        gantt.contentDirScrollbar.setTranslateY(databodyStart + gantt.getStartYOffset());
        gantt.contentDirScrollbar.render(
          sbOptions,
          contentDirScrollbarDim.w,
          contentDirScrollbarDim.h
        );

        var bottomOffset = 0;
        if (gantt.getAxisPosition() === 'bottom') bottomOffset = gantt.getAxesHeight();
        gantt.contentDirScrollbar.setViewportRange(
          databody.getTranslateY() -
            (Math.max(0, gantt.getCanvasSize() - bottomOffset) - databodyStart),
          databody.getTranslateY()
        );
      }
    },

    /**
     * Renders the row axis vertical separator.
     * @param {Gantt} gantt The Gantt being rendered.
     * @param {dvt.Container=} container The container to render into.
     */
    renderRowAxisVerticalDivider: (gantt, container) => {
      var ctx = gantt.getCtx();
      if (ctx.getThemeBehavior() === 'alta' || !gantt.isRowAxisEnabled()) {
        return;
      }

      var isRTL = dvt.Agent.isRightToLeft(ctx);
      // Refer to comment block in DvtGanttRenderer._renderVerticalGridline on why there's the 0.5 rounding in LTR case
      var x = isRTL
        ? gantt.getStartXOffset() + gantt.getCanvasLength()
        : Math.round(gantt.getStartXOffset()) + 0.5;
      if (!gantt._rowAxisVerticalDivider) {
        gantt._rowAxisVerticalDivider = new dvt.Line(
          ctx,
          x,
          gantt.getStartYOffset(),
          x,
          gantt._canvasSize + 2 * gantt.getBorderWidth()
        );
        gantt._rowAxisVerticalDivider.setPixelHinting(true);
        gantt._rowAxisVerticalDivider.setClassName(gantt.GetStyleClass('majorvgridline'), true);
        container.addChild(gantt._rowAxisVerticalDivider);
      } else {
        gantt._rowAxisVerticalDivider.setX1(x).setX2(x);
      }
    },

    /**
     * Renders the row axis.
     * @param {Gantt} gantt The Gantt being rendered.
     * @param {dvt.Container=} container The container to render the row axis into. null on resize case.
     */
    renderRowAxis: (gantt, container) => {
      var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
      var rowAxis = gantt.getRowAxis();

      if (gantt.isRowAxisEnabled()) {
        if (!rowAxis) {
          rowAxis = new DvtGanttRowAxis(gantt);
          rowAxis.setPixelHinting(true);
          gantt.setRowAxis(rowAxis);
          rowAxis.setBackgroundContainer(new dvt.Container(gantt.getCtx()));
        }
        if (container) {
          // null on resize case
          container.addChild(rowAxis);
          gantt.getParent().addChildAt(rowAxis.getBackgroundContainer(), 0);
        }

        // render and figure out width
        rowAxis.render(gantt.Width - DvtGanttStyleUtils.getRowAxisGap(), container == null);

        var rowAxisWidth = rowAxis.getWidth();
        var rowAxisSpace = rowAxisWidth > 0 ? rowAxisWidth + DvtGanttStyleUtils.getRowAxisGap() : 0;
        gantt._backgroundWidth -= rowAxisSpace;
        if (!isRTL) {
          gantt._widthOffset += rowAxisSpace;
          gantt.setStartXOffset(gantt.getStartXOffset() + rowAxisSpace);
        }
        gantt._canvasLength -= rowAxisSpace;

        // Render row axis background. Position is adjusted in rowAxis.adjustPosition()
        var rowAxisBackgroundContainer = rowAxis.getBackgroundContainer();
        rowAxisBackgroundContainer.removeChildren();
        rowAxis.setBackgroundDivider();

        // row axis backgrond rect. extra 1px to hide border touching the gantt.
        var rowAxisBackground = new dvt.Rect(
          gantt.getCtx(),
          0,
          0,
          rowAxisWidth + 1,
          gantt._backgroundHeight
        );
        rowAxisBackground.setClassName(gantt.GetStyleClass('databody'));
        rowAxisBackground.setPixelHinting(true);
        rowAxisBackgroundContainer.addChild(rowAxisBackground);

        // row axis background horizontal divider that lines up with the time axis.
        // Always shown in Alta regardless of whether horizontal gridlines are visible
        // Only shown in Redwood if horizontal gridlines are visible
        if (gantt.getCtx().getThemeBehavior() === 'alta' || gantt.isHorizontalGridlinesVisible()) {
          var rowAxisHorizontalDivider = new dvt.Line(gantt.getCtx(), 0, 0, rowAxisWidth, 0);
          rowAxisHorizontalDivider.setPixelHinting(true);
          rowAxisHorizontalDivider.setClassName(gantt.GetStyleClass('hgridline'), true);
          rowAxisBackgroundContainer.addChild(rowAxisHorizontalDivider);
          rowAxis.setBackgroundDivider(rowAxisHorizontalDivider);
        }
      } else {
        // potentially rerender with rowAxis.rendered off when on before.
        if (container && rowAxis) {
          gantt.getParent().removeChild(rowAxis.getBackgroundContainer());
          container.removeChild(rowAxis);
        }
        gantt.setRowAxis(null);
      }
    },

    /**
     * Renders the background of Gantt.
     * @param {Gantt} gantt The Gantt being rendered.
     * @private
     */
    _renderBackground: (gantt) => {
      var width = gantt._backgroundWidth;
      var height = gantt._backgroundHeight;
      if (gantt._background) {
        gantt._background.setClipPath(null);
        gantt._background.setWidth(width);
        gantt._background.setHeight(height);
        gantt._background.setX(gantt._widthOffset);
      } else
        gantt._background = new dvt.Rect(gantt.getCtx(), gantt._widthOffset, 0, width, height, 'bg');

      // Override specified border with double border to fix stroke rendering:
      // If stroke-width is 1px, then there is 0.5px border on each side of the edge, and because svg is
      // not pixel aware, in cases where the edge is between two pixels (e.g. on resize), the 0.5px doesn't show up, and the
      // entire stroke disappear. Fix is to double up the pixel so there there is always > 0.5px on each side of the edge
      // and use a clippath to hide the inner half of the stroke to maintain stroke width.
      // Update: We can avoid CSP violation here by setting scss stroke-width on oj-gantt-container to 2px default;
      // gantt._background.SetSvgProperty('style', 'stroke-width:' + (gantt.getBorderWidth() * 2) + 'px');

      gantt._background.setClassName(gantt.GetStyleClass('databody'));
      gantt._background.setPixelHinting(true);

      var cp = new dvt.ClipPath();
      cp.addRect(gantt._widthOffset, 0, width, height);
      gantt._background.setClipPath(cp);

      if (gantt._background.getParent() != gantt) gantt.addChild(gantt._background);
    },

    /**
     * Renders the container for row backgrounds; this separate container is necessary to ensure correct layering.
     * This container would be placed behind vertical gridlines, and other row contents (e.g. tasks)
     * would be placed above the vertical gridlines.
     * @param {Gantt} gantt The gantt component.
     * @param {dvt.Container=} container The container to render the background container into.
     * @private
     */
    _renderDatabodyBackground: (gantt, container) => {
      var databodyBackground = gantt.getDatabodyBackground();
      if (databodyBackground == null) {
        databodyBackground = new dvt.Container(gantt.getCtx());
        container.addChild(databodyBackground);
        gantt.setDatabodyBackground(databodyBackground);
      }
      if (gantt.getDatabody() == null) {
        // Initial state: honor scroll position
        databodyBackground.setTranslateY(
          gantt.scrollPositionToTranslateY(gantt.getOptions()['scrollPosition'])
        );
      }

      var cp = new dvt.ClipPath();
      cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
      databodyBackground.setClipPath(cp);
    },

    /**
     * Renders the container for row reference areas.
     * @param {Gantt} gantt The gantt component.
     * @param {dvt.Container=} container The container to render into.
     * @private
     */
    _renderRowReferenceObjectsContainer: (gantt, container) => {
      var rowRefObjsContainer = gantt.getRowReferenceObjectsContainer();
      if (rowRefObjsContainer == null) {
        rowRefObjsContainer = new dvt.Container(gantt.getCtx());
        container.addChild(rowRefObjsContainer);
        gantt.setRowReferenceObjectsContainer(rowRefObjsContainer);
      }
      if (gantt.getDatabody() == null) {
        // Initial state: sync with data body background container
        rowRefObjsContainer.setTranslateY(gantt.getDatabodyBackground().getTranslateY());
      }

      var cp = new dvt.ClipPath();
      cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
      rowRefObjsContainer.setClipPath(cp);
    },

    /**
     * Renders the container DnD affordances. This container should be layered on top of all chart area elements.
     * @param {Gantt} gantt The gantt component.
     * @param {dvt.Container=} container The container to render into.
     * @private
     */
    _renderDnDArtifactsContainer: (gantt, container) => {
      var databody = gantt.getDatabody();
      if (databody) {
        // don't bother in the no data case -- there's nothing to drag and drop
        var artifactsContainer = gantt.getDnDArtifactsContainer();
        if (artifactsContainer == null) {
          artifactsContainer = new dvt.Container(gantt.getCtx());
          gantt.setDnDArtifactsContainer(artifactsContainer);

          // Initial state: sync with databody's initial state
          artifactsContainer.setTranslateY(databody.getTranslateY());
        }
        container.addChild(artifactsContainer); // ensure topmost layering even on rerender

        var cp = new dvt.ClipPath();
        cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
        artifactsContainer.setClipPath(cp);
      }
    },

    /**
     * Renders the container for marquee gesture artifacts. This container should be layered on top of all chart area elements.
     * @param {Gantt} gantt The gantt component.
     * @param {dvt.Container=} container The container to render into.
     * @private
     */
    _renderMarqueeArtifactsContainer: (gantt, container) => {
      var databody = gantt.getDatabody();
      // don't bother in the no data case
      if (!databody) {
        return;
      }

      var artifactsContainer = gantt.getMarqueeArtifactsContainer();
      if (artifactsContainer == null) {
        artifactsContainer = new dvt.Container(gantt.getCtx());
        gantt.setMarqueeArtifactsContainer(artifactsContainer);

        // Initial state: sync with databody's initial state
        artifactsContainer.setTranslateY(databody.getTranslateY());
      }
      container.addChild(artifactsContainer); // ensure topmost layering even on rerender

      var cp = new dvt.ClipPath();
      cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
      artifactsContainer.setClipPath(cp);

      // Set event handlers
      var eventManager = gantt.getEventManager();
      // Marquee Select
      if (gantt.getOptions()['selectionMode'] === 'multiple') {
        var bounds = new dvt.Rectangle(
          1,
          1,
          gantt.getContentLength() - 1,
          gantt.getContentHeight() - 1
        );
        // Placeholders, dvt.MarqueeHandler will set the appropriate css class
        var marqueeFill = new dvt.SolidFill('');
        var marqueeStroke = new dvt.Stroke('');
        var marqueeHandler = new dvt.MarqueeHandler(
          artifactsContainer,
          bounds,
          bounds,
          marqueeFill,
          marqueeStroke,
          true,
          true
        );
        eventManager.setMarqueeSelectHandler(marqueeHandler);
      }
    },

    /**
     * Renders the scrollable canvas of the Gantt chart.
     * @param {Gantt} gantt The gantt being rendered.
     * @private
     */
    _renderScrollableCanvas: (gantt) => {
      if (gantt._canvas) return;
      gantt._canvas = new dvt.Container(gantt.getCtx(), 'g', 'canvas');
      gantt.addChild(gantt._canvas);
    },

    /**
     * Renders the time axis of a Gantt chart.
     * @param {Gantt} gantt The Gantt chart being rendered.
     * @param {dvt.Container} container The container to render into.
     * @param {boolean=} throttle Whether to throttle the rendering with requestAnimationFrame.
     *  Improves performance especially during high fire rate events such as scroll. Default false.
     * @private
     */
    _renderAxes: (gantt, container, throttle) => {
      var majorAxis = gantt.getMajorAxis();
      var minorAxis = gantt.getMinorAxis();
      var axisPosition = gantt.getAxisPosition();
      var options = gantt.getOptions();
      var referenceObjects = gantt.getReferenceObjects();

      if (axisPosition === 'top') {
        var axisStart = 0;
        if (majorAxis) {
          DvtGanttRenderer._renderAxis(
            gantt,
            container,
            majorAxis,
            axisStart,
            gantt.getAxisHeight(options, 'majorAxis'),
            [],
            throttle
          );
          axisStart += majorAxis.getSize();
        }

        if (minorAxis) {
          DvtGanttRenderer._renderAxis(
            gantt,
            container,
            minorAxis,
            axisStart,
            gantt.getAxisHeight(options, 'minorAxis'),
            referenceObjects,
            throttle
          );
          axisStart += minorAxis.getSize();
        }

        gantt.setDatabodyStart(axisStart);
      } else {
        axisStart = gantt._canvasSize;

        if (majorAxis) {
          // _renderAxis needs to be called before calling timeAxis.getSize:
          DvtGanttRenderer._renderAxis(
            gantt,
            container,
            majorAxis,
            null,
            gantt.getAxisHeight(options, 'majorAxis'),
            [],
            throttle
          );
          axisStart -= majorAxis.getSize();
          DvtGanttRenderer._positionAxis(majorAxis, axisStart);
        }

        if (minorAxis) {
          // _renderAxis needs to be called before calling timeAxis.getSize:
          DvtGanttRenderer._renderAxis(
            gantt,
            container,
            minorAxis,
            axisStart,
            gantt.getAxisHeight(options, 'minorAxis'),
            referenceObjects,
            throttle
          );
          axisStart -= minorAxis.getSize();
          DvtGanttRenderer._positionAxis(minorAxis, axisStart);
        }

        gantt.setDatabodyStart(0);
      }
    },

    /**
     * Renders time axis.
     * @param {Gantt} gantt The gantt
     * @param {dvt.Container} container The container to render into
     * @param {TimeAxis} timeAxis The time axis
     * @param {number} axisStart The start y position to render.
     * @param {number} axisSize The size of the axis.
     * @param {Array} referenceObjects Array of referenceObjects to render in the axis. Only lines with labels are rendered.
     * @param {boolean=} throttle Whether to throttle the rendering with requestAnimationFrame.
     *  Improves performance especially during high fire rate events such as scroll. Default false.
     * @private
     */
    _renderAxis: (gantt, container, timeAxis, axisStart, axisSize, referenceObjects, throttle) => {
      if (timeAxis.getParent() !== container) container.addChild(timeAxis);

      timeAxis.render(
        {
          _viewStartTime: gantt._viewStartTime,
          _viewEndTime: gantt._viewEndTime,
          _referenceObjects: {
            referenceObjects,
            defaultStyleClass: gantt.GetStyleClass('referenceObjectLine'),
            defaultStroke: null
          },
          _throttle: throttle,
          _eventManager: gantt.getEventManager()
        },
        gantt.getContentLength(),
        axisSize
      );

      if (axisStart != null) DvtGanttRenderer._positionAxis(timeAxis, axisStart);
    },

    /**
     * Positions the given time axis
     * @param {TimeAxis} timeAxis The time axis
     * @param {number} axisStart The y position the axis should be positioned to.
     * @private
     */
    _positionAxis: (timeAxis, axisStart) => {
      var posMatrix = new dvt.Matrix(1, 0, 0, 1, 0, axisStart);
      timeAxis.setMatrix(posMatrix);
    },

    /**
     * Renders the zoom controls of a gantt.
     * @param {Gantt} gantt The gantt being rendered.
     * @private
     */
    _renderZoomControls: (gantt) => {
      var context = gantt.getCtx();
      var resources = gantt._resources;
      var isRTL = dvt.Agent.isRightToLeft(context);

      var zoomControlProperties = {
        zoomInProps: {
          imageSize: 16,
          class: resources['zoomIn']
        },
        zoomOutProps: {
          imageSize: 16,
          class: resources['zoomOut']
        }
      };

      if (isRTL)
        var transX = gantt.getStartXOffset() + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;
      else
        transX =
          gantt.getCanvasLength() +
          gantt.getStartXOffset() -
          (DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING +
            DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER);

      zoomControlProperties['zoomInProps']['posX'] = transX;
      zoomControlProperties['zoomOutProps']['posX'] = transX;

      var yOffset = gantt._startY + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;
      if (gantt.getAxisPosition() === 'top') var transY = yOffset;
      else transY = gantt._backgroundHeight - yOffset;

      if (gantt.getAxisPosition() === 'top') {
        var zoomInPosY = transY;
        var zoomOutPosY =
          transY +
          DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER +
          DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_SPACING;
      } else {
        zoomInPosY =
          transY -
          DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER * 2 -
          DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_SPACING;
        zoomOutPosY = transY - DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER;
      }

      zoomControlProperties['zoomInProps']['posY'] = zoomInPosY;
      zoomControlProperties['zoomOutProps']['posY'] = zoomOutPosY;

      gantt.renderZoomControls(zoomControlProperties);
    },

    /**
     * Renders the empty text of Gantt.
     * @param {Gantt} gantt the gantt component.
     * @param {boolean=} noData whether it's the 'no data' case (as opposed to 'invalid data' case). Default false.
     * @private
     */
    _renderEmptyText: (gantt, noData) => {
      // Get the empty text string
      if (noData) {
        // If there are rows shown (i.e. from previous render), clear them (see )
        var databody = gantt.getDatabody();
        var dependenciesContainer = gantt.getDependenciesContainer();
        if (databody && databody.getParent()) {
          databody.getParent().removeChild(databody);
          gantt.setDatabody(null);
        }
        // After removal of all the task from the Gantt, even dependency arrows should be cleared off.
        if (dependenciesContainer && dependenciesContainer.getParent()) {
          dependenciesContainer.getParent().removeChild(dependenciesContainer);
          gantt.setDependenciesContainer(null);
        }
        gantt.getDataLayoutManager().clear();

        var emptyTextStr = gantt.getOptions().translations.labelNoData;
        gantt.removeEmptyText();
      } else {
        emptyTextStr = gantt.getOptions().translations.labelInvalidData;
        gantt.clearComponent();
      }

      var axesHeight = gantt.getAxesHeight();
      var text = gantt.renderEmptyText(
        gantt._canvas,
        emptyTextStr,
        new dvt.Rectangle(
          gantt.getStartXOffset(),
          gantt.getStartYOffset() + axesHeight * (gantt.getAxisPosition() === 'top'),
          gantt.getCanvasLength(),
          gantt.getDatabodyHeight()
        ),
        gantt.EventManager,
        null
      );
      text.setClassName(gantt.GetStyleClass('nodata'));

      gantt.setEmptyText(text);
    },

    /**
     * Renders the databody
     * @param {Gantt} gantt the gantt component.
     * @param {dvt.Container=} container the container to add the databody to.
     * @private
     */
    _renderDatabody: (gantt, container) => {
      var databody = gantt.getDatabody();
      if (databody == null) {
        databody = new dvt.Container(gantt.getCtx(), 'g', 'db');
        container.addChild(databody);
        gantt.setDatabody(databody);

        // Initial state: sync with databody background's initial state
        databody.setTranslateY(gantt.getDatabodyBackground().getTranslateY());
      }

      var cp = new dvt.ClipPath();
      cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
      databody.setClipPath(cp);

      // Note row axis translateY is synced in renderData and continually synced
      // through setDataRegionTranslateY calls
    },

    /**
     * Renders vertical grid lines
     * @param {Gantt} gantt The Gantt component
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderVerticalGridline: (gantt, container) => {
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

        const ganttMinTime = gantt.getStartTime();
        const ganttMaxTime = gantt.getEndTime();
        const ganttWidth = gantt.getContentLength();

        // minor time axis required, major optional
        const computeLineDates = (minorTimeAxis, majorTimeAxis) => {
          const majorViewportDates = majorTimeAxis
            ? majorTimeAxis.getViewportDates(majorTimeAxis.getScale(), ganttMinTime, ganttMaxTime)
            : [];
          const minorViewportDates = minorTimeAxis.getViewportDates(
            minorTimeAxis.getScale(),
            ganttMinTime,
            ganttMaxTime
          );

          // Alta behavior is to only render major lines. If major not available, then render minor lines.
          if (gantt.getCtx().getThemeBehavior() === 'alta') {
            return {
              major: majorViewportDates,
              minor: !majorTimeAxis ? minorViewportDates : []
            };
          }

          // If major dates is a subset of minor dates, then the two grids line up. Don't render the minor dates at overlap (due to opacity, minor line would show through major line otherwise).
          // Otherwise the major and minor axis do not "line up" (e.g. months and weeks scale together). Render minor lines only.
          const majorViewportDatesSet = new Set(majorViewportDates.map((d) => d.getTime()));
          const minorViewportDatesSet = new Set(minorViewportDates.map((d) => d.getTime()));
          // only consider major dates that are in range (e.g. first and/or last ticks may be out of range)
          const showMajorLines =
            majorViewportDates.filter(
              (d) =>
                d.getTime() > ganttMinTime &&
                d.getTime() < ganttMaxTime &&
                !minorViewportDatesSet.has(d.getTime())
            ).length === 0;
          const finalMinorViewportDates = showMajorLines
            ? minorViewportDates.filter((d) => !majorViewportDatesSet.has(d.getTime()))
            : minorViewportDates;

          return {
            major: showMajorLines ? majorViewportDates : [],
            minor: finalMinorViewportDates
          };
        };

        const renderVLines = (linesContainer, dates, styleClass) => {
          var context = gantt.getCtx();
          var isRTL = dvt.Agent.isRightToLeft(context);

          dates.forEach((d, i) => {
            let pos = ojtimeaxisToolkit.TimeAxisUtils.getDatePosition(
              ganttMinTime,
              ganttMaxTime,
              d.getTime(),
              ganttWidth
            );
            if (isRTL) {
              pos = ganttWidth - pos;
            }
            // There is a ClipPath around the timezoom canvas (see TimeComponent.renderTimeZoomCanvas)
            // The ClipPath x position starts right where the Gantt start time pos is.
            // In some browsers (e.g. Chrome and Safari), if the first vertical gridline is right at the start time pos
            // it gets excluded by the ClipPath. In other browsers (e.g. Firefox), this is not the case
            // In themes like Redwood, where there is no border around the component, we need to be able to see the first
            // vertical gridline even if it lies right at the start time pos.
            // Workaround is to shift the first gridline only to the right by 1px.
            // Similar reasoning in RTL, where the last gridline needs to be shifted right by 1px.
            // Same reasoning holds for the last vertical gridline in RTL.
            if ((!isRTL && i === 0) || (isRTL && i === dates.length - 1)) {
              pos = Math.round(pos) + 0.5;
            }

            const gridLine = new dvt.Line(
              context,
              pos,
              gantt.getDatabodyStart(),
              pos,
              gantt.getDatabodyStart() + gantt.getDatabodyHeight()
            );
            gridLine.setPixelHinting(true);
            gridLine.setMouseEnabled(false);
            gridLine.setClassName(styleClass, true);

            linesContainer.addChild(gridLine);
          });
        };

        const dateLines = computeLineDates(gantt.getMinorAxis(), gantt.getMajorAxis());

        // Minor axis gridlines
        renderVLines(gridlines, dateLines.minor, gantt.GetStyleClass('minorvgridline'));

        // Major axis gridlines
        renderVLines(gridlines, dateLines.major, gantt.GetStyleClass('majorvgridline'));
      }
    },

    /**
     * Renders reference objects
     * @param {Gantt} gantt The Gantt component
     * @param {dvt.Container} container The container to render into.
     * @param {string} type 'area' or 'line'
     * @private
     */
    _renderReferenceObjects: (gantt, container, type) => {
      var referenceObjectsContainer =
        type === 'line' ? gantt.getReferenceLinesContainer() : gantt.getReferenceAreasContainer();
      if (referenceObjectsContainer == null) {
        referenceObjectsContainer = new dvt.Container(gantt.getCtx());
        container.addChild(referenceObjectsContainer);
        if (type === 'line') {
          gantt.setReferenceLinesContainer(referenceObjectsContainer);
        } else {
          gantt.setReferenceAreasContainer(referenceObjectsContainer);
        }
      }
      // Remove any previously rendered reference lines
      referenceObjectsContainer.removeChildren();

      var isValidDate = (value) => {
        return value != null && !isNaN(new Date(value).getTime());
      };

      var referenceObjects = gantt.getReferenceObjects().filter((refObj) => {
        if (type === 'line') {
          // Default reference object type is 'line'
          return (refObj.type === 'line' || refObj.type == null) && isValidDate(refObj.value);
        }
        return refObj.type === 'area' && isValidDate(refObj.start) && isValidDate(refObj.end);
      });

      var refObjs = gantt.generateReferenceObjects(referenceObjects, type);
      refObjs.forEach((refObj) => refObj.render(referenceObjectsContainer));
    },

    /**
     * Renders time cursor
     * @param {Gantt} gantt The Gantt component
     * @param {dvt.Container} container The container to render into.
     * @private
     */
    _renderTimeCursor: (gantt, container) => {
      var timeCursorContainer = gantt.getTimeCursorContainer();
      if (timeCursorContainer == null) {
        timeCursorContainer = new dvt.Container(gantt.getCtx());
        container.addChild(timeCursorContainer);
        gantt.setTimeCursorContainer(timeCursorContainer);
      }

      timeCursorContainer.removeChildren();

      var timeCursor = new DvtGanttReferenceObjects(gantt, 'timeCursor', [
        {
          type: 'line',
          value: new Date(gantt.getStartTime()).toISOString()
        }
      ]);
      timeCursor.render(timeCursorContainer);
      timeCursor.setMouseEnabled(false);
      timeCursor.hide();
      gantt.setTimeCursor(timeCursor);
    },

    /**
     * Render data (rows and dependencies)
     * @param {Gantt} gantt The gantt component
     * @param {dvt.Container} container The container to render into
     * @param {string=} action The action that triggered the render. One of the DvtGanttDataLayoutManager.VPC_X strings. Defaults to vpc_refresh.
     * @private
     */
    _renderData: (gantt, container, action) => {
      var options = gantt.getOptions();
      var rowObjs = gantt.getRowLayoutObjs();
      var dependencyObjs = gantt.getDependencyLayoutObjs();
      if (rowObjs.length === 0) {
        DvtGanttRenderer._renderEmptyText(gantt, true);
        return;
      }

      DvtGanttRenderer._renderDatabody(gantt, container);
      if (dependencyObjs.length > 0) DvtGanttRenderer._renderDependenciesContainer(gantt, container);

      // Cache the base task label style dvt.CSSStyle object; it's expensive to instantiate one
      // each time we render a task label.
      if (!gantt.getCache().getFromCache('baseTaskLabelCSSStyle'))
        gantt
          .getCache()
          .putToCache('baseTaskLabelCSSStyle', DvtGanttStyleUtils.getTaskLabelStyle(options));

      // Ensure the row dependent content containers' translateY is within bounds
      // and render the viewport
      gantt.setDataRegionTranslateY(
        gantt.getBoundedContentTranslateY(gantt.getDatabody().getTranslateY())
      );
      var isAnimating =
        !gantt.isInitialRender() &&
        gantt.isLastRenderValid() &&
        gantt.getAnimationManager().getAnimationMode() !== 'none';
      gantt.renderViewport(isAnimating ? DvtGanttDataLayoutManager.VPC_ANIMATE : action, true);
    },

    /**
     * Render dependency lines container
     * @param {Gantt} gantt The gantt component
     * @param {dvt.Container} container the parent container for the dependency lines container
     * @private
     */
    _renderDependenciesContainer: (gantt, container) => {
      var dependenciesContainer = gantt.getDependenciesContainer();
      if (dependenciesContainer == null) {
        dependenciesContainer = new dvt.Container(gantt.getCtx());
        // Initial state: sync with databody's initial state
        dependenciesContainer.setTranslateY(gantt.getDatabody().getTranslateY());
        container.addChild(dependenciesContainer);
        gantt.setDependenciesContainer(dependenciesContainer);
        DvtGanttRenderer._prepareDependencyMarkers(gantt);
      }

      var cp = new dvt.ClipPath();
      cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
      dependenciesContainer.setClipPath(cp);

      // Note that translateY is synced with databody in renderData,
      // and continually synced through setDataRegionTranslateY calls
    },

    /**
     * Creates dependency line marker definitions.
     * @param {dvt.Gantt} gantt The gantt component
     * @private
     */
    _prepareDependencyMarkers: (gantt) => {
      var angleMarkerId = document.getElementById(
        DvtGanttStyleUtils.getDependencyLineAngleMarkerId()
      );
      if (angleMarkerId) {
        return;
      }

      var triangleMarker = DvtGanttRenderer._createTriangleMarker(gantt);
      var angleMarker = DvtGanttRenderer._createAngleMarker(gantt);
      var openCircleMarker = DvtGanttRenderer._createOpenCircleMarker(gantt);
      var closedCircleMarker = DvtGanttRenderer._createClosedCircleMarker(gantt);
      gantt.appendSharedDefs(triangleMarker);
      gantt.appendSharedDefs(angleMarker);
      gantt.appendSharedDefs(openCircleMarker);
      gantt.appendSharedDefs(closedCircleMarker);
    },

    /**
     * Creates dependency line triangle marker.
     * @param {dvt.Gantt} gantt The gantt component
     * @return {Element} The marker element.
     * @private
     */
    _createTriangleMarker: (gantt) => {
      var id = DvtGanttStyleUtils.getDependencyLineTriangleMarkerId();
      var width = DvtGanttStyleUtils.getDependencyLineTriangleMarkerWidth();
      var height = DvtGanttStyleUtils.getDependencyLineTriangleMarkerHeight();
      var className = gantt.GetStyleClass('dependencyLineConnector');
      var pathCmd = 'M0,0L' + width + ',' + height / 2 + ',' + '0,' + height + 'V0Z';
      return DvtGanttRenderer._createMarker(gantt, id, width, height, pathCmd, className);
    },

    /**
     * Creates dependency line angle marker.
     * @param {dvt.Gantt} gantt The gantt component
     * @return {Element} The marker element.
     * @private
     */
    _createAngleMarker: (gantt) => {
      var id = DvtGanttStyleUtils.getDependencyLineAngleMarkerId();
      var width = DvtGanttStyleUtils.getDependencyLineAngleMarkerWidth();
      var height = DvtGanttStyleUtils.getDependencyLineAngleMarkerHeight();
      var className = gantt.GetStyleClass('dependencyRectilinearLineArrowConnector');
      var pathCmd = 'M0,0L' + width + ',' + height / 2 + ',' + '0,' + height;
      return DvtGanttRenderer._createMarker(gantt, id, width, height, pathCmd, className);
    },

    /**
     * Helper for creating dependency line marker.
     * @param {dvt.Gantt} gantt The gantt component
     * @param {string} id The marker id.
     * @param {number} width The marker width.
     * @param {number} height The marker height.
     * @param {string} pathCmd The marker path command.
     * @param {string} className The style class to apply
     * @return {Element} The marker element.
     * @private
     */
    _createMarker: (gantt, id, width, height, pathCmd, className) => {
      var defaultClassName = gantt.GetStyleClass('dependencyLineConnector') + ' ' + className;
      var elem = dvt.SvgShapeUtils.createElement('marker', id);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'class', defaultClassName);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'markerUnits', 'userSpaceOnUse');

      var path = dvt.SvgShapeUtils.createElement('path');

      dvt.ToolkitUtils.setAttrNullNS(elem, 'viewBox', '0 0 ' + width + ' ' + height);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'refX', width);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'refY', height / 2);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'markerWidth', width);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'markerHeight', height);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'orient', 'auto');
      dvt.ToolkitUtils.setAttrNullNS(path, 'd', pathCmd);

      elem.appendChild(path);
      return elem;
    },

    /**
     * Creates dependency line open circle marker.
     * @param {dvt.Gantt} gantt The gantt component
     * @return {Element} The marker element.
     * @private
     */
    _createOpenCircleMarker: (gantt) => {
      var id = DvtGanttStyleUtils.getDependencyLineOpenCircleMarkerId();
      var radius = DvtGanttStyleUtils.getDependencyLineCircleMarkerRadius();
      var className = gantt.GetStyleClass('dependencyStraightLineOpenCircleConnector');
      return DvtGanttRenderer._createCircleMarker(gantt, id, radius, className);
    },

    /**
     * Creates dependency line closed circle marker.
     * @param {dvt.Gantt} gantt The gantt component
     * @return {Element} The marker element.
     * @private
     */
    _createClosedCircleMarker: (gantt) => {
      var id = DvtGanttStyleUtils.getDependencyLineClosedCircleMarkerId();
      var radius = DvtGanttStyleUtils.getDependencyLineCircleMarkerRadius();
      var className = gantt.GetStyleClass('dependencyStraightLineClosedCircleConnector');
      return DvtGanttRenderer._createCircleMarker(gantt, id, radius, className);
    },

    /**
     * Helper for creating dependency line circle marker.
     * @param {dvt.Gantt} gantt The gantt component
     * @param {string} id The marker id.
     * @param {number} radius The marker radius.
     * @param {string} className The style class to apply.
     * @return {Element} The marker element.
     * @private
     */
    _createCircleMarker: (gantt, id, radius, className) => {
      var defaultClassName = gantt.GetStyleClass('dependencyLineConnector') + ' ' + className;
      var elem = dvt.SvgShapeUtils.createElement('marker', id);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'class', defaultClassName);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'markerUnits', 'userSpaceOnUse');

      var circle = dvt.SvgShapeUtils.createElement('circle');
      // bounding box needs to be slightly bigger (by an even number to center the circle at whole number values) to account for stroke
      var width = 2 * radius + 2;
      var height = 2 * radius + 2;

      dvt.ToolkitUtils.setAttrNullNS(elem, 'viewBox', '0 0 ' + width + ' ' + height);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'refX', width / 2);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'refY', height / 2);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'markerWidth', width);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'markerHeight', height);
      dvt.ToolkitUtils.setAttrNullNS(elem, 'orient', 'auto');
      dvt.ToolkitUtils.setAttrNullNS(circle, 'cx', width / 2);
      dvt.ToolkitUtils.setAttrNullNS(circle, 'cy', height / 2);
      dvt.ToolkitUtils.setAttrNullNS(circle, 'r', radius);

      elem.appendChild(circle);
      return elem;
    }
  };

  /**
   * Gantt component.  The component should never be instantiated directly.  Use the newInstance function instead
   * @param {dvt.Context} context The rendering context.
   * @param {function} callback The function that should be called to dispatch component events.
   * @param {object} callbackObj The optional object instance on which the callback function is defined.
   * @class
   * @constructor
   * @extends {TimeComponent}
   */
  class Gantt extends ojdvtTimecomponent.TimeComponent {
    constructor(context, callback, callbackObj) {
      super(context, callback, callbackObj);
      this._isInitialRender = true;

      // Create the defaults object
      this.Defaults = new DvtGanttDefaults(context);

      // Create the event handler and add event listeners
      this.EventManager = new DvtGanttEventManager(this, context, callback, callbackObj);
      this.EventManager.addListeners(this);
      this._keyboardHandler = new DvtGanttKeyboardHandler(this, this.EventManager);
      this.EventManager.setKeyboardHandler(this._keyboardHandler);
    }

    /**
     * @override
     */
    SetOptions(options) {
      // Set defaults to certain styling properties before merging with defaults
      if (options['taskDefaults'] == null) options['taskDefaults'] = { baseline: {} };
      if (options['taskDefaults']['baseline'] == null) options['taskDefaults']['baseline'] = {};

      if (options['taskDefaults']['height'] == null) {
        options['taskDefaults']['height'] = DvtGanttStyleUtils.getStandaloneTaskHeight(options);
      }
      if (options['taskDefaults']['baseline']['height'] == null) {
        options['taskDefaults']['baseline']['height'] =
          DvtGanttStyleUtils.getBaselineTaskHeight(options);
      }

      super.SetOptions(options);

      // initial setup
      this.setSelectionMode(this.Options['selectionMode']);

      // High level DnD:
      // On desktop, for performance reasons, use normal mouse events for DnD.
      // On mobile, HTML5 DnD is fast; set the equivalent low level DnD configuration to leverage it.
      var dndMoveEnabled = this.isTaskMoveEnabled();
      var taskResizeEnabled = this.isTaskResizeEnabled();
      if ((dndMoveEnabled || taskResizeEnabled) && dvt.Agent.getAgentInfo().isTouchSupported) {
        var lowLevelDnD = {
          drag: {
            tasks: { dataTypes: [] },
            taskResizeHandles: { dataTypes: [] }
          },
          drop: {
            rows: { dataTypes: [] }
          }
        };
        this.Options['dnd'] = dvt.JsonUtils.merge(this.Options['dnd'], lowLevelDnD);

        // High level dnd.move or resize enabled is equivalent to enabling tasks as drag sources and rows as drop targets
        // Current design, high level move drop target is always the underlying row, even if the actual target is e.g. a task (enforced by event manager methods)
        var self = this;
        var setupDragDataTypes = (dataType, dragType) => {
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

        if (taskResizeEnabled)
          setupDragDataTypes(DvtGanttEventManager.RESIZE_TASKS_DATA_TYPE, 'taskResizeHandles');
        if (dndMoveEnabled) setupDragDataTypes(DvtGanttEventManager.MOVE_TASKS_DATA_TYPE, 'tasks');
      }
    }

    /**
     * @return {DvtGanttAutomation} the automation object
     */
    getAutomation() {
      if (!this.Automation) this.Automation = new DvtGanttAutomation(this);
      return this.Automation;
    }

    /**
     * Retrieves style class based on key (ex: 'oj-gantt-horizontal-gridline')
     * @param {string} key
     * @return {string} the style class for the specified key
     * @protected
     */
    GetStyleClass(key) {
      var context = this.getCtx();
      var styleClasses = context['styleClasses'];
      // TODO: in PhantomJS tests this is not populated
      if (styleClasses != null) return styleClasses[key];
      return key;
    }

    /**
     * Creates component specific parser and parses the options.
     * @param {object} options The options object
     * @return {object} the parsed object
     * @protected
     */
    Parse(options) {
      return DvtGanttParser.parse(options);
    }

    /**
     * Parsed the options
     * @param {object} props property bag of options
     * @private
     */
    _applyParsedProperties(props) {
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

      super._applyParsedProperties(props);
    }

    /**
     * Creates TimeAxis compatible options object from component's options object.
     * @param {object} options The object containing specifications and data for this component.
     * @param {TimeAxis} axis The time axis.
     * @return {object} the options for time axis
     * @private
     */
    _bundleTimeAxisOptions(options, axis) {
      var _resources = this._resources;
      _resources['axisClass'] = this.GetStyleClass(axis);
      _resources['axisSeparatorClass'] = this.GetStyleClass(axis + 'Ticks');

      var retOptions = {
        start: options['start'],
        end: options['end'],
        _resources: _resources,
        shortDesc: options['shortDesc'],
        orientation: 'horizontal'
      };

      if (options[axis]) {
        var axisOptions = options[axis];
        if (axisOptions['scale']) retOptions['scale'] = axisOptions['scale'];
        if (axisOptions['converter']) retOptions['converter'] = axisOptions['converter'];

        retOptions.zoomOrder = axisOptions.zoomOrder || [axisOptions.scale];
        const isAlta = this.getCtx().getThemeBehavior() === 'alta';
        // Default scales label position and alignment
        if (isAlta) {
          // positioning along time direction
          retOptions._scaleLabelPosition = {
            seconds: 'center',
            minutes: 'center',
            hours: 'center',
            days: 'center',
            weeks: 'center',
            months: 'center',
            quarters: 'center',
            years: 'center'
          };
          // alignment along perpendicular axis (keys are time axis type/orientation)
          retOptions._labelAlignment = {
            horizontal: 'middle',
            vertical: 'middle' // no-op for Gantt because Gantt does not have vertically oriented axes
          };
        } else {
          // positioning along time direction
          retOptions._scaleLabelPosition = {
            seconds: 'start',
            minutes: 'start',
            hours: 'start',
            days: axis === 'minorAxis' ? 'center' : 'start',
            weeks: 'start',
            months: 'start',
            quarters: 'start',
            years: 'start'
          };
          // alignment along perpendicular axis (keys are time axis type/orientation)
          retOptions._labelAlignment = {
            horizontal: 'top',
            vertical: 'middle' // no-op for Gantt because Gantt does not have vertically oriented axes
          };
        }
        // Custom scales label position
        retOptions.zoomOrder.forEach((scale) => {
          if (scale && scale.name) {
            const labelPosition = scale.labelPosition || 'auto';
            const effectiveLabelPosition = labelPosition === 'auto' ? 'start' : labelPosition;
            retOptions._scaleLabelPosition[scale.name] = effectiveLabelPosition;
          }
        });
      }

      var labelStyle;
      if (axis === 'majorAxis') labelStyle = DvtGanttStyleUtils.getMajorAxisLabelStyle(options);
      else if (axis === 'minorAxis') labelStyle = DvtGanttStyleUtils.getMinorAxisLabelStyle(options);
      retOptions['labelStyle'] = labelStyle;

      return retOptions;
    }

    /**
     * Calculates the preferred dimensions for this Gantt.
     * @param {number=} width The component width, if defined.
     * @param {number=} height The component height, if defined.
     * @return {dvt.Dimension} The preferred dimensions.
     * @private
     */
    _getPreferredSize(width, height) {
      return new dvt.Dimension(width, height);
    }

    /**
     * Renders the component
     * @param {object} options options object
     * @param {number} width the width of the component
     * @param {number} height the height of the component
     * @override
     */
    render(options, width, height) {
      // Reset cache
      this.getCache().clearCache();

      if (!options) {
        this._handleResize(width, height);
        return;
      }
      super.render(options, width, height);

      // Render an aria live region for accessibility during DnD
      if (this.isDndEnabled()) {
        var context = this.getCtx();
        this.renderAriaLiveRegion('_dvtGanttAriaLiveRegion' + context.getStage().getId());
      } else {
        this.removeAriaLiveRegion();
      }

      this._animationManager = new DvtGanttAnimationManager(this);
      this._animationManager.prepareForAnimations();

      // Calculate certain layout information before any actual rendering
      if (!this._dataLayoutManager) this._dataLayoutManager = new DvtGanttDataLayoutManager(this);
      this._dataLayoutManager.calcLayout();

      DvtGanttRenderer.renderRowAxis(this, this.getParent());

      var axisPosition = this.getAxisPosition();
      var axisOptions;
      var preferredLength;

      var major = options['majorAxis'];
      if (major) {
        if (major['scale']) {
          axisOptions = this._bundleTimeAxisOptions(this.Options, 'majorAxis');

          if (this._majorAxis == null) {
            this._majorAxis = new ojtimeaxisToolkit.TimeAxis(this.getCtx(), null, null);
            var showAxesInterfaceBorder = this.getCtx().getThemeBehavior() === 'alta';
            if (axisPosition === 'top')
              this._majorAxis.setBorderVisibility(false, false, showAxesInterfaceBorder, false);
            else this._majorAxis.setBorderVisibility(showAxesInterfaceBorder, false, false, false);
            this._slaveAxis = this._majorAxis;
          }

          // TimeComponent's TimeAxis._canvasSize should always be null on initial render
          this._majorAxis.setCanvasSize(null);
          var majorPreferredLength = this._majorAxis.getPreferredLength(
            axisOptions,
            this._canvasLength
          );

          if (preferredLength && majorPreferredLength > preferredLength) {
            this._masterAxis = this._majorAxis;
            this._slaveAxis = this._minorAxis;
            preferredLength = majorPreferredLength;
          }
        } // if there WAS a major axis, but rerender WITHOUT major axis, make sure to set it to null
        else this._majorAxis = null;
      }

      var minor = options['minorAxis'];
      if (minor) {
        axisOptions = this._bundleTimeAxisOptions(this.Options, 'minorAxis');
        axisOptions._secondaryAxis = this._majorAxis;

        if (this._minorAxis == null) {
          var showAxisChartInterfaceBorder = this.getCtx().getThemeBehavior() === 'alta';
          this._minorAxis = new ojtimeaxisToolkit.TimeAxis(this.getCtx(), null, null);
          if (axisPosition === 'top')
            this._minorAxis.setBorderVisibility(false, false, showAxisChartInterfaceBorder, false);
          else this._minorAxis.setBorderVisibility(showAxisChartInterfaceBorder, false, false, false);
          this._masterAxis = this._minorAxis;
        }

        // TimeComponent's TimeAxis._canvasSize should always be null on initial render
        this._minorAxis.setCanvasSize(null);
        preferredLength = this._minorAxis.getPreferredLength(axisOptions, this._canvasLength);
      }

      if (preferredLength) this.setContentLength(preferredLength);

      // Minor axis is required, and preparing viewport length depends on it having valid options
      // Major axis options checking happens later in hasValidOptions()
      if (this._minorAxis && this._minorAxis.hasValidOptions()) this.prepareViewportLength();

      DvtGanttRenderer.renderGantt(this);

      this._animationManager.triggerAnimations();

      this.UpdateAriaAttributes();

      if (!this.Animation)
        // If not animating, that means we're done rendering, so fire the ready event.
        this.RenderComplete();

      this._renderState = null;
      this._isInitialRender = false;
    }

    /**
     * Gets the animation manager.
     * @return {DvtGanttAnimationManager} the animation manager
     */
    getAnimationManager() {
      return this._animationManager;
    }

    /**
     * Gets the data layout manager.
     * @return {DvtGanttDataLayoutManager} the data layout manager
     */
    getDataLayoutManager() {
      return this._dataLayoutManager;
    }

    /**
     * Detects whether we should treat row data as hierarchical.
     * @return {boolean}
     */
    isRowsHierarchical() {
      // We would only receive hierarchical data if a tree data provider
      // is supplied through rowData or taskData (deprecated)
      // Also for our static tests, we can't easily pass in data providers and templates,
      // so look for whether expanded is set with a JS Set in a test environment.
      var options = this.getOptions();
      var dp = options['rowData'] || options['taskData'];
      return (
        (dp && dp['getChildDataProvider']) ||
        (dvt.Agent.isEnvironmentTest() && this.getOptions()['expanded'] instanceof Set)
      );
    }

    /**
     * Gets the current viewport y bounds, or the y bounds associated with the given translateY
     * @param {number=} translateY Optional translateY to use to convert to y bounds. Otherwise the current translateY is used.
     * @return {Object} An object with yMin and yMax properties
     */
    getViewportYBounds(translateY) {
      var viewportHeight = Math.max(0, this._backgroundHeight - this.getAxesHeight());
      var yMin = 0;
      if (translateY != null) {
        yMin = this._translateYToScrollPositionY(translateY);
      } else if (this._databody) {
        yMin = this._translateYToScrollPositionY(this._databody.getTranslateY());
      }
      var yMax = yMin + viewportHeight;
      return { yMin: yMin, yMax: yMax };
    }

    /**
     * Gets the current viewport.
     * @return {Object} { minRowInd, maxRowInd, viewStartTime, viewEndTime }
     */
    getViewPort() {
      var viewportYBounds = this.getViewportYBounds();
      var viewportRowIndRange = this._dataLayoutManager.findRowIndRange(
        this.getRowLayoutObjs(),
        viewportYBounds.yMin,
        viewportYBounds.yMax
      );
      var viewport = {
        minRowInd: viewportRowIndRange.minRowInd,
        maxRowInd: viewportRowIndRange.maxRowInd,
        viewStartTime: this._viewStartTime,
        viewEndTime: this._viewEndTime
      };
      return viewport;
    }

    /**
     * Returns how dense the viewport is.
     * @return {number} 0 for low, 1 for medium, 2 for high
     */
    getViewportDensity() {
      if (this._viewportDensity !== undefined) {
        return this._viewportDensity;
      }
      var numViewportTasks = this._dataLayoutManager.getNumViewportTasks();
      if (numViewportTasks < 2000) {
        this._viewportDensity = 0;
      } else if (numViewportTasks < 5000) {
        this._viewportDensity = 1;
      } else {
        this._viewportDensity = 2;
      }
      return this._viewportDensity;
    }

    /**
     * Gets the rendering precision of the gantt, based on the viewport density.
     * Rendering precision is the number of decimal places numerical values (such as in transforms and paths)
     * should round to for rendering.
     * Generally the lower the rendering precision, the better the rendering performance at the expense of accuracy.
     * @return {number|null} number of decimal places to round to. null means values should not be rounded, and the full precision should be used.
     */
    getRenderingPrecision() {
      if (this._renderingPrecision !== undefined) {
        return this._renderingPrecision;
      }
      var density = this.getViewportDensity();
      if (density === 0) {
        this._renderingPrecision = null;
      } else if (density === 1) {
        this._renderingPrecision = 1;
      } else {
        this._renderingPrecision = 0;
      }
      return this._renderingPrecision;
    }

    /**
     * Round given number to a certain precision.
     * @param {number} n Original value
     * @param {number} precision Number of decimal places to keep
     * @return {number}
     */
    round(n, precision) {
      return Math.round(n * 10 ** precision) / 10 ** precision;
    }

    /**
     * Renders the current viewport.
     * @param {string} action The action that triggered the viewport change. One of the DvtGanttDataLayoutManager.VPC_X strings.
     * @param {boolean=} bScrollPositionChanged Whether to dispatch a scroll position change event
     */
    renderViewport(action, bScrollPositionChanged) {
      if (this._databody == null) {
        return;
      }

      // Clear previously cached values derived from viewport density
      this._viewportDensity = undefined;
      this._renderingPrecision = undefined;

      var viewport = this.getViewPort();
      this._dataLayoutManager.renderViewport(viewport, action);

      if (bScrollPositionChanged) {
        // Fire scroll position change event
        var y = this._translateYToScrollPositionY(this._databody.getTranslateY());
        var rowObj = this.getRowLayoutObjs()[viewport.minRowInd];
        var offsetY = y - rowObj.y;
        var evt = dvt.EventFactory.newGanttScrollPositionChangeEvent(y, viewport.minRowInd, offsetY);
        this.dispatchEvent(evt);
      }
    }

    /**
     * Whether this is initial render.
     * @return {boolean} whether this is initial render.
     */
    isInitialRender() {
      return this._isInitialRender;
    }

    /**
     * Whether the previous render (if initial render, then false) resulted in a valid render,
     * e.g. if the gantt didn't have valid options in the previous render and resulted in "Invalid Data" being rendered,
     * then the previous render is considered invalid.
     * @return {boolean} whether the previous render (false for initial render) resulted in a valid render
     */
    isLastRenderValid() {
      return this._isLastRenderValid;
    }

    /**
     * Sets the whether last render was valid.
     * @param {boolean} isLastRenderValid
     */
    setIsLastRenderValid(isLastRenderValid) {
      this._isLastRenderValid = isLastRenderValid;
    }

    /**
     * Gets the render state.
     * @return {Object|null} State object of the shape {'state': foo, 'payload': bar}, or null for normal rendering
     */
    getRenderState() {
      return this._renderState;
    }

    /**
     * Sets render state.
     * @param {Object|null} state State object of the shape {'state': foo, 'payload': bar}, or null for normal rendering
     */
    setRenderState(state) {
      this._renderState = state;
    }

    /**
     * @override
     */
    isDndEnabled() {
      const isHighLevelDnDEnabled = this.isHighLevelDnDEnabled();
      return this.getEventManager().isDndSupported() && isHighLevelDnDEnabled;
    }

    /**
     * Returns whether high level task move or task resize is enabled.
     * @returns Whether high level DnD is enabled.
     */
    isHighLevelDnDEnabled() {
      const dndMoveEnabled = this.isTaskMoveEnabled();
      const taskResizeEnabled = this.isTaskResizeEnabled();
      return dndMoveEnabled || taskResizeEnabled;
    }

    /**
     * Whether high level task move is enabled.
     * @return {boolean} whether high level task move is enabled.
     */
    isTaskMoveEnabled() {
      var dnd = this.Options['dnd'];
      return dnd && dnd['move'] && dnd['move']['tasks'] === 'enabled';
    }

    /**
     * Whether high level task resize is enabled.
     * @return {boolean} whether high level task resize is enabled.
     */
    isTaskResizeEnabled() {
      var taskDefaults = this.Options['taskDefaults'];
      return taskDefaults && taskDefaults['resizable'] === 'enabled';
    }

    /**
     * Scrolls the gantt according to the supplied scroll position object.
     * Mainly called by framework when writeback happens to the scroll position option.
     * @param {Object} scrollPosition The scroll position object
     */
    scroll(scrollPosition) {
      // Only scroll if the databody exists -- otherwise there's nothing to scroll
      if (this.getDatabody()) {
        var translateY = this.scrollPositionToTranslateY(scrollPosition);

        if (this.isContentDirScrollbarOn() && this.contentDirScrollbar)
          this.contentDirScrollbar.setViewportRange(
            translateY - this.getDatabodyHeight(),
            translateY
          );

        this.setDataRegionTranslateY(translateY);
        this.renderViewport(DvtGanttDataLayoutManager.VPC_TRANSLATE, true);
      }
    }

    /**
     * Converts scroll position object to data region translate y
     * @param {Object} scrollPosition The scroll position object
     * @return {number} The data region translate y
     */
    scrollPositionToTranslateY(scrollPosition) {
      var rowIndex = scrollPosition['rowIndex'];
      var rowObjs = this.getRowLayoutObjs();
      var scrollPositionY = 0;
      if (rowIndex != null) {
        rowIndex = Math.min(Math.max(0, rowIndex), rowObjs.length - 1);
        var rowY = rowObjs[rowIndex];
        // prevent undef rowY from causing an error: 
        if (rowY != null) {
          var offsetY = scrollPosition['offsetY'] != null ? scrollPosition['offsetY'] : 0;
          scrollPositionY = rowY['y'] + offsetY;
        }
      } else if (scrollPosition['y'] != null) {
        scrollPositionY = scrollPosition['y'];
      }
      return this._scrollPositionYToTranslateY(scrollPositionY);
    }

    /**
     * Converts scroll position y to data region translate y
     * @param {number} scrollPositionY The scroll position y
     * @return {number} The data region translate y
     * @private
     */
    _scrollPositionYToTranslateY(scrollPositionY) {
      return this.getBoundedContentTranslateY(this.getDatabodyStart() - scrollPositionY);
    }

    /**
     * Converts data region translate y to scroll position y
     * @param {number} translateY The data region translate y
     * @return {number} The scroll position y
     * @private
     */
    _translateYToScrollPositionY(translateY) {
      return this._databody ? -(translateY - this.getDatabodyStart()) : 0;
    }

    /**
     * Sets the the y translate of data related containers
     * @param {number} translateY The y translate to set
     */
    setDataRegionTranslateY(translateY) {
      // Translate relevant data regions
      if (this._databody) this._databody.setTranslateY(translateY);
      if (this._databodyBackground) this._databodyBackground.setTranslateY(translateY);
      if (this._rowReferenceObjectsContainer)
        this._rowReferenceObjectsContainer.setTranslateY(translateY);
      if (this.isMarqueeSelectEnabled() && this._marqueeArtifactsContainer)
        this._marqueeArtifactsContainer.setTranslateY(translateY);
      if (this.isDndEnabled() && this._dndArtifactsContainer)
        this._dndArtifactsContainer.setTranslateY(translateY);
      if (this.isRowAxisEnabled())
        this.getRowAxis().setTranslateY(translateY + this.getStartYOffset());
      if (this._dependenciesContainer) this._dependenciesContainer.setTranslateY(translateY);
    }

    /**
     * Adjusts viewport based on scrollbar event.
     * @param {object} event
     * @param {object} component The component that is the source of the event, if available.
     */
    processScrollbarEvent(event, component) {
      super.processScrollbarEvent(event, component);
      if (component === this.timeDirScrollbar) {
        // Update time axis due to horizontal viewport change
        DvtGanttRenderer._renderAxes(this, this.getTimeZoomCanvas(), true);
      }
      if (component === this.contentDirScrollbar) {
        var newMax = event.newMax;
        this.setDataRegionTranslateY(newMax, true);
      }
      this.renderViewport(
        DvtGanttDataLayoutManager.VPC_TRANSLATE,
        component === this.contentDirScrollbar
      );
    }

    /**
     * Creates a viewportChange event object
     * @return {object} the viewportChange event object
     * @override
     */
    createViewportChangeEvent() {
      var majorAxisScale = this._majorAxis ? this._majorAxis.getScale() : null;
      var minorAxisScale = this._minorAxis ? this._minorAxis.getScale() : null;
      return dvt.EventFactory.newGanttViewportChangeEvent(
        this._viewStartTime,
        this._viewEndTime,
        majorAxisScale,
        minorAxisScale
      );
    }

    /**
     * Handles rerender on resize.
     * @param {number} width The new width
     * @param {number} height The new height
     * @private
     */
    _handleResize(width, height) {
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
        DvtGanttRenderer._renderRowReferenceObjectsContainer(this);
        DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas, 'area');
        DvtGanttRenderer._renderVerticalGridline(this, timeZoomCanvas);
        DvtGanttRenderer._renderData(this, null, DvtGanttDataLayoutManager.VPC_SCALE);
        DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas, 'line');

        DvtGanttRenderer._renderTimeCursor(this, timeZoomCanvas);

        DvtGanttRenderer._renderZoomControls(this);

        if (this.isMarqueeSelectEnabled()) {
          DvtGanttRenderer._renderMarqueeArtifactsContainer(this, timeZoomCanvas);
        }

        if (this.isDndEnabled()) DvtGanttRenderer._renderDnDArtifactsContainer(this, timeZoomCanvas);

        if (this.isTimeDirScrollbarOn() || this.isContentDirScrollbarOn())
          DvtGanttRenderer._renderScrollbars(this, this);
      } else DvtGanttRenderer._renderEmptyText(this);

      DvtGanttRenderer.renderRowAxisVerticalDivider(this, this._canvas);

      if (!this.Animation)
        // If not animating, that means we're done rendering, so fire the ready event.
        this.RenderComplete();
    }

    /**
     * Combines style defaults with the styles provided
     */
    applyStyleValues() {
      var isRTL = dvt.Agent.isRightToLeft(this.getCtx());
      var scrollbarPadding = this.getScrollbarPadding();
      this._borderWidth = DvtGanttStyleUtils.getChartStrokeWidth(this.Options);

      var doubleBorderWidth = this._borderWidth * 2;
      this._widthOffset = 0;

      // we are going to hide the scrollbar
      this.timeDirScrollbarStyles = this.getTimeDirScrollbarStyle();
      this.contentDirScrollbarStyles = this.getContentDirScrollbarStyle();

      this._backgroundWidth = this.Width;
      this._backgroundHeight = this.Height;

      if (this.isTimeDirScrollbarOn())
        this._backgroundHeight = Math.max(
          0,
          this._backgroundHeight -
            dvt.CSSStyle.toNumber(this.timeDirScrollbarStyles.getHeight()) -
            3 * scrollbarPadding
        );
      if (this.isContentDirScrollbarOn()) {
        var widthOffset =
          3 * scrollbarPadding + dvt.CSSStyle.toNumber(this.contentDirScrollbarStyles.getWidth());
        this._backgroundWidth -= widthOffset;
        if (isRTL) this._widthOffset = widthOffset;
      }

      this.setStartXOffset(this._widthOffset + this._borderWidth);
      this.setStartYOffset(this._borderWidth);

      // Apply component start padding
      var startPadding = DvtGanttStyleUtils.getComponentPaddingStart(this.Options);
      this._backgroundWidth -= startPadding;
      if (!isRTL) {
        this._widthOffset += startPadding;
        this.setStartXOffset(this.getStartXOffset() + startPadding);
      }

      // The size of the canvas viewport
      this._canvasLength = this._backgroundWidth - doubleBorderWidth;
      this._canvasSize = Math.max(0, this._backgroundHeight - doubleBorderWidth);
    }

    /**
     * Gets the component stroke width
     */
    getBorderWidth() {
      return this._borderWidth;
    }

    /**
     * Handles mouse wheel event.
     * @param {event} event The mouse wheel event
     * @protected
     * @override
     */
    HandleMouseWheel(event) {
      super.HandleMouseWheel(event);
      if (this.hasValidOptions()) {
        // not ctrl key pressed and not touch device; check if should scroll
        if (event && !event.ctrlKey && !dvt.Agent.isTouchDevice()) {
          var wheelDeltaY = event.wheelDelta
            ? event.wheelDelta * ojdvtTimecomponent.TimeComponent.SCROLL_LINE_HEIGHT
            : 0;
          var wheelDeltaX = event.wheelDeltaX
            ? event.wheelDeltaX * ojdvtTimecomponent.TimeComponent.SCROLL_LINE_HEIGHT
            : 0;
          this.panBy(-wheelDeltaX, -wheelDeltaY);

          // panning horizontally changes the viewport, and panBy doesn't trigger anything
          // Follows timeline's behavior where viewportChange event is fired at every x delta of overview scrolling
          // TODO: consider changing Timeline and Gantt to follow Chart's convention of firing viewportChange events only at the end of the interaction
          if (event.wheelDeltaX) {
            var evt = this.createViewportChangeEvent();
            this.dispatchEvent(evt);
          }
        } else {
          // ctrl key pressed or touch device; check if should zoom
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
    }

    /**
     * Handles zoom.
     * @param {number} newLength The new content length
     * @param {number} time
     * @param {number} compLoc
     * @param {boolean} triggerViewportChangeEvent Whether to dispatch viewportChange event
     * @override
     */
    handleZoomWheel(newLength, time, compLoc, triggerViewportChangeEvent) {
      if (!this.isZoomingEnabled()) {
        return;
      }

      if (newLength > this._masterAxis.getMaxContentLength()) {
        newLength = this._masterAxis.getMaxContentLength();
        this.disableZoomButton(true);
      } else this.enableZoomButton(true);
      if (this._canvasLength > newLength) {
        newLength = this._canvasLength;
        this.disableZoomButton(false);
      } else this.enableZoomButton(false);
      var zoomIn = this.getContentLength() <= newLength;
      super.handleZoomWheel(newLength, time, compLoc, triggerViewportChangeEvent);

      var zoomLevelLengths = this._masterAxis.getZoomLevelLengths();
      if (zoomIn) {
        while (
          this._masterAxis.getZoomLevelOrder() > 0 &&
          (this._slaveAxis ? this._slaveAxis.getZoomLevelOrder() > 0 : true)
        ) {
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
        while (
          this._masterAxis.getZoomLevelOrder() < zoomLevelLengths.length - 1 &&
          (this._slaveAxis
            ? this._slaveAxis.getZoomLevelOrder() < this._slaveAxis.getZoomLevelLengths().length - 1
            : true)
        ) {
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

      if (this.isTimeDirScrollbarOn() && this.timeDirScrollbar)
        this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);

      var timeZoomCanvas = this.getTimeZoomCanvas();
      DvtGanttRenderer._renderAxes(this, timeZoomCanvas, true);
      DvtGanttRenderer._renderDatabodyBackground(this);
      DvtGanttRenderer._renderRowReferenceObjectsContainer(this);
      DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas, 'area');
      DvtGanttRenderer._renderVerticalGridline(this, timeZoomCanvas);
      DvtGanttRenderer._renderData(this, null, DvtGanttDataLayoutManager.VPC_SCALE);
      DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas, 'line');

      DvtGanttRenderer._renderTimeCursor(this, timeZoomCanvas);

      if (this.isMarqueeSelectEnabled()) {
        DvtGanttRenderer._renderMarqueeArtifactsContainer(this, timeZoomCanvas);
      }

      if (this.isDndEnabled()) DvtGanttRenderer._renderDnDArtifactsContainer(this, timeZoomCanvas);

      if (triggerViewportChangeEvent) {
        var evt = this.createViewportChangeEvent();
        this.dispatchEvent(evt);
      }
    }

    /**
     * Retrieve the major axis.
     * @return {TimeAxis} the minor axis
     */
    getMajorAxis() {
      return this._majorAxis;
    }

    /**
     * Retrieve the minor axis.
     * @return {TimeAxis} the minor axis
     */
    getMinorAxis() {
      return this._minorAxis;
    }

    /**
     * Retrieve the minor axis. If one is not specified, use the major axis.
     * @return {TimeAxis} the minor axis
     * @override
     */
    getTimeAxis() {
      if (this._minorAxis) return this._minorAxis;
      return this._majorAxis;
    }

    /**
     * Retrieve the databody
     * @return {dvt.Container} the databody
     */
    getDatabody() {
      return this._databody;
    }

    /**
     * Sets the databody
     * @param {dvt.Container} databody the databody
     */
    setDatabody(databody) {
      this._databody = databody;
    }

    /**
     * Dim databody, i.e. to dim tasks for "highlightDependencies" selection behavior
     */
    dimDatabody() {
      if (this._databody && !this._isDatabodyDimmed) {
        dvt.ToolkitUtils.addClassName(this._databody.getElem(), this.GetStyleClass('databodyDim'));
      }
      this._isDatabodyDimmed = true;
    }

    /**
     * Undim databody, i.e. to undim tasks for "highlightDependencies" selection behavior
     */
    undimDatabody() {
      if (this._databody && this._isDatabodyDimmed) {
        dvt.ToolkitUtils.removeClassName(this._databody.getElem(), this.GetStyleClass('databodyDim'));
      }
      this._isDatabodyDimmed = false;
    }

    /**
     * Retrieve the databody background (container for row backgrounds).
     * @return {dvt.Container} the databody background container.
     */
    getDatabodyBackground() {
      return this._databodyBackground;
    }

    /**
     * Sets the databody background (container for row backgrounds).
     * @param {dvt.Container} databodyBackground The databody background container.
     */
    setDatabodyBackground(databodyBackground) {
      this._databodyBackground = databodyBackground;
    }

    /**
     * Gets the pixel location where the databody starts
     * @return {number} the pixel location where the databody starts
     */
    getDatabodyStart() {
      return this._databodyStart;
    }

    /**
     * Sets the pixel location where the databody starts
     * @param {number} databodyStart the pixel location where the databody starts
     */
    setDatabodyStart(databodyStart) {
      this._databodyStart = databodyStart;
    }

    /**
     * Gets the databody height
     * @return {number} the databody height
     */
    getDatabodyHeight() {
      return Math.max(0, this.getCanvasSize() - this.getAxesHeight());
    }

    /**
     * Retrieve the container for vertical gridlines
     * @return {dvt.Container} the container for vertical gridlines
     */
    getVerticalGridlines() {
      return this._gridlines;
    }

    /**
     * Sets the container for vertical gridlines
     * @param {dvt.Container} gridlines the container for vertical gridlines
     */
    setVerticalGridlines(gridlines) {
      this._gridlines = gridlines;
    }

    /**
     * Retrieve the reference objects array
     * @return {Array.<object>} the reference objects array
     */
    getReferenceObjects() {
      return this._referenceObjects || [];
    }

    /**
     * Generates an array of DvtGanttReferenceObjects representing the input reference objects data.
     * @param {Array} referenceObjects Array of reference objects data (of the same type).
     * @param {string} type The type of the reference objects ('line' or 'area')
     * @return {DvtGanttReferenceObjects[]} Array of DvtGanttReferenceObjects representing the input data.
     * @private
     */
    generateReferenceObjects(referenceObjects, type) {
      const results = [];
      // Fun optimization:
      // Let's call reference objects without custom styling or shortDesc, 'plain'
      // Plain reference objects are static, non-interactive, and all look the same
      // In the order given by app, group contiguous plain reference objects and render them all together as 1 giant path element.
      // Render custom reference objects individually.
      // By grouping plain reference objects together, we can render them as 1 giant path element, rather than individual elements
      // which gives us a performance boost. For example, if the app just gives us plain weekend reference areas spanned over 1 year,
      // we can just render 1 giant path element rather than 52 separate elements.
      let i = 0;
      let j = 0;
      while (j < referenceObjects.length) {
        var refObj = referenceObjects[j];
        if (refObj.svgStyle || refObj.svgClassName || refObj.shortDesc) {
          if (j > i) {
            results.push(new DvtGanttReferenceObjects(this, type, referenceObjects.slice(i, j)));
          }
          results.push(new DvtGanttReferenceObjects(this, type, [referenceObjects[j]]));
          i = j + 1;
        }
        j += 1;
      }
      if (j > i) {
        results.push(new DvtGanttReferenceObjects(this, type, referenceObjects.slice(i, j)));
      }
      return results;
    }

    /**
     * Retrieve the container for reference lines
     * @return {dvt.Container} the container for reference objects
     */
    getReferenceLinesContainer() {
      return this._refLinesContainer;
    }

    /**
     * Sets the container for reference lines
     * @param {dvt.Container} container the container for reference objects
     */
    setReferenceLinesContainer(container) {
      this._refLinesContainer = container;
    }

    /**
     * Retrieve the container for reference areas
     * @return {dvt.Container} the container for reference objects
     */
    getReferenceAreasContainer() {
      return this._refAreasContainer;
    }

    /**
     * Sets the container for reference areas
     * @param {dvt.Container} container the container for reference objects
     */
    setReferenceAreasContainer(container) {
      this._refAreasContainer = container;
    }

    /**
     * Retrieve the container for time cursor
     * @return {dvt.Container} the container for time cursor
     */
    getTimeCursorContainer() {
      return this._timeCursorContainer;
    }

    /**
     * Sets the container for time cursor
     * @param {dvt.Container} container the container for time cursor
     */
    setTimeCursorContainer(container) {
      this._timeCursorContainer = container;
    }

    /**
     * Retrieve the time cursor
     * @return {DvtGanttReferenceObjects} the time cursor
     */
    getTimeCursor() {
      return this._timeCursor;
    }

    /**
     * Sets the time cursor
     * @param {DvtGanttReferenceObjects} timeCursor The time cursor
     */
    setTimeCursor(timeCursor) {
      this._timeCursor = timeCursor;
    }

    /**
     * Gets the container for Marquee artifacts.
     * @return {dvt.Container} container for Marquee artifacts.
     */
    getMarqueeArtifactsContainer() {
      return this._marqueeArtifactsContainer;
    }

    /**
     * Sets the container for Marquee artifacts.
     * @param {dvt.Container} container. The container for Marquee artifacts.
     */
    setMarqueeArtifactsContainer(container) {
      this._marqueeArtifactsContainer = container;
    }

    /**
     * Gets the container for DnD artifacts (affordances and drag feedback).
     * @return {dvt.Container} container for DnD artifacts.
     */
    getDnDArtifactsContainer() {
      return this._dndArtifactsContainer;
    }

    /**
     * Sets the container for DnD artifacts. This container should be layered on top of all chart area elements.
     * @param {dvt.Container} container. The container for DnD artifacts.
     */
    setDnDArtifactsContainer(container) {
      this._dndArtifactsContainer = container;
    }

    /**
     * Gets the container for row reference objects.
     * @return {dvt.Container} The container.
     */
    getRowReferenceObjectsContainer() {
      return this._rowReferenceObjectsContainer;
    }

    /**
     * Sets the container for row reference objects.
     * @param {dvt.Container} container
     */
    setRowReferenceObjectsContainer(container) {
      this._rowReferenceObjectsContainer = container;
    }

    /**
     * Sets the empty text.
     * @param {dvt.OutputText} text The new text.
     */
    setEmptyText(text) {
      this._emptyText = text;
    }

    /**
     * Removes empty text.
     */
    removeEmptyText() {
      if (this._emptyText && this._emptyText.getParent()) {
        this._emptyText.getParent().removeChild(this._emptyText);
        delete this._emptyText;
        this._emptyText = null;
        let eventManager = this.getEventManager();
        let focus = eventManager.getFocus();
        if (focus && focus.getId && focus.getId() === 'noDataPeer') {
          eventManager.setFocus(null);
        }
      }
    }

    /**
     * Gets the rows options object
     * @return {object} the rows options object
     */
    getRowsData() {
      return this._rowsData;
    }

    /**
     * Gets the row layout objects
     * @return {Array} an array of row layout objects
     */
    getRowLayoutObjs() {
      return this._dataLayoutManager.getRowObjs();
    }

    /**
     * Gets the dependency layout objects
     * @return {Array} an array of row layout objects
     */
    getDependencyLayoutObjs() {
      return this._dataLayoutManager.getDependencyObjs();
    }

    /**
     * Sets the rows node
     * @param {Array} rows an array of DvtGanttRowNode
     */
    setRows(rows) {
      this._rows = rows;
    }

    /**
     * Gets the current row id
     * @return {*} the id of the current row
     */
    getCurrentRow() {
      return this._currentRow;
    }

    /**
     * Sets the current row id
     * @param {*} currentRow the id of the current row
     */
    setCurrentRow(currentRow) {
      this._currentRow = currentRow;
    }

    /**
     * Gets the axis position
     * @return {string} the axis position
     */
    getAxisPosition() {
      return this._axisPosition;
    }

    /**
     * Gets the axis height
     * @param {object} options The object containing data and specifications for the component.
     * @param {string} axisProp The axis property
     * @return {number} the axis height
     */
    getAxisHeight(options, axisProp) {
      return DvtGanttStyleUtils.getTimeAxisHeight(options, axisProp);
    }

    /**
     * Gets the start time of the Gantt
     * @return {number} the start time in milliseconds
     */
    getStartTime() {
      return this._start;
    }

    /**
     * Gets the end time of the Gantt
     * @return {number} the end time in milliseconds
     */
    getEndTime() {
      return this._end;
    }

    /**
     * NOT expose for now (until we have dependency lines)
     * Gets the hover behavior
     * @return {string} the hover behavior, either 'dim' or 'none'
     */
    getHoverBehavior() {
      return 'none';
    }

    /**
     * Gets whether horizontal gridlines are visible
     * @return {boolean} true if horizontal gridlines are visible, false otherwise
     */
    isHorizontalGridlinesVisible() {
      return this._horizontalGridline === 'visible';
    }

    /**
     * Gets whether vertical gridlines are visible
     * @return {boolean} true if vertical gridlines are visible, false otherwise
     */
    isVerticalGridlinesVisible() {
      return this._verticalGridline === 'visible';
    }

    /**
     * Gets the height of the entire Gantt content
     * @return {number} height the height of the entire Gantt including all rows.
     */
    getContentHeight() {
      return this._dataLayoutManager.getContentHeight();
    }

    /**
     * Retrieves the total height of the time axes.
     * @return {number} the height of the time axes
     */
    getAxesHeight() {
      var axesHeight = 0;
      if (this._majorAxis) {
        axesHeight += this._majorAxis.getSize();
      }
      if (this._minorAxis) {
        axesHeight += this._minorAxis.getSize();
      }
      return axesHeight;
    }

    /**
     * Gets whether the row axis should be rendered/visible.
     * @return {boolean} true if should be rendered, false otherwise
     */
    isRowAxisEnabled() {
      var axisOn = this._rowAxisRendered === 'on';
      var hasRows = this.getRowLayoutObjs().length > 0;
      return axisOn && hasRows;
    }

    /**
     * Gets the row axis width.
     * @return {string} the width of the axis in pixels (e.g. '50px') or percent (e.g. '15%'')
     */
    getRowAxisWidth() {
      return this._rowAxisWidth;
    }

    /**
     * Gets the row axis max width.
     * @return {string} the maximum width of the axis in pixels (e.g. '50px') or percent (e.g. '15%'')
     */
    getRowAxisMaxWidth() {
      return this._rowAxisMaxWidth;
    }

    /**
     * Gets the row axis object.
     * @return {DvtGanttRowAxis} The row axis object.
     */
    getRowAxis() {
      return this._rowAxis;
    }

    /**
     * Sets the row axis object.
     * @param {DvtGanttRowAxis} rowAxis The row axis object.
     */
    setRowAxis(rowAxis) {
      this._rowAxis = rowAxis;
    }

    /**
     * Gets the current viewport bounding box in the reference coord system of the databody
     * @return {dvt.Rectangle} the current bounding box of the viewport
     */
    getViewportDimensions() {
      return new dvt.Rectangle(
        this.getStartXOffset() - this.getTimeZoomCanvas().getTranslateX(),
        this._databodyStart - this._databody.getTranslateY(),
        this._canvasLength,
        this.getDatabodyHeight()
      );
    }

    /**
     * Scroll a region into view
     * @param {dvt.Rectangle} region The bounding rectangle (assumed to be in the reference coord system of the databody) to scroll into view
     * @param {string=} xPriority The side in the x direction to prioritize scroll into view, one of 'start', 'end', or 'auto'. Default 'auto'.
     * @param {string=} yPriority The side in the y direction to prioritize scroll into view, one of 'top', 'bottom', or 'auto'. Default 'auto'.
     * @param {number=} overShoot The extra amount of space to pan by. Default 0.
     */
    scrollIntoView(region, xPriority, yPriority, overShoot) {
      var isRTL = dvt.Agent.isRightToLeft(this.getCtx()),
        viewportRect = this.getViewportDimensions(),
        deltaX = 0,
        deltaY = 0;

      xPriority = xPriority || 'auto';
      yPriority = yPriority || 'auto';
      overShoot = overShoot || 0;

      var deltaXLeftVisible = Math.min(region.x - viewportRect.x - overShoot, 0);
      var deltaXRightVisible = Math.max(
        0,
        region.x + region.w - (viewportRect.x + viewportRect.w) + overShoot
      );
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
          deltaX = (!isRTL ? deltaXEndVisible > 0 : deltaXEndVisible < 0)
            ? deltaXEndVisible
            : deltaXStartVisible; // 'end' wins if just 'end', or both sides, require panning. 'start' otherwise.
      }

      var deltaYTopVisible = Math.min(region.y - viewportRect.y - overShoot, 0);
      var deltaYBottomVisible = Math.max(
        0,
        region.y + region.h - (viewportRect.y + viewportRect.h) + overShoot
      );

      switch (yPriority) {
        case 'top':
          deltaY = deltaYTopVisible;
          break;
        case 'bottom':
          deltaY = deltaYBottomVisible;
          break;
        default:
          deltaY = deltaYTopVisible < 0 ? deltaYTopVisible : deltaYBottomVisible; // 'top' wins if just 'top', or both sides, require panning. 'bottom' otherwise.
      }

      this.panBy(deltaX, deltaY, true);
    }

    /**
     * Pan to make room upon drag or equivalent near the edge of the viewport
     * @param {dvt.Point} targetPos The target position
     * @param {number} edgeThreshold The distance from an edge at which auto pan should happen
     * @param {boolean=} excludeX Whether to exclude x direction from auto pan consideration
     * @param {boolean=} excludeY Whether to exclude y direction from auto pan consideration
     * @return {object} The actual deltaX and deltaY panned
     */
    autoPanOnEdgeDrag(targetPos, edgeThreshold, excludeX, excludeY) {
      var viewportRect = this.getViewportDimensions();
      var deltaX = 0;
      var deltaY = 0;

      // Pan amount varies inversely with distance from edge, i.e. the closer to edge, the larger (abs(distance - edgeThreshold)) the pan amount
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
            if (this.getAxisPosition() === 'bottom') {
              deltaY = Math.min(
                deltaY,
                this._databody.getTranslateY() + this.getContentHeight() - viewportRect.h
              );
            } else {
              deltaY = Math.min(
                deltaY,
                this._databody.getTranslateY() + this.getContentHeight() - this._canvasSize
              );
            }
          } else {
            deltaY = Math.min(deltaY, -viewportRect.y);
          }
        }
      }
      this.panBy(deltaX, deltaY, true);
      return { deltaX: deltaX, deltaY: deltaY };
    }

    /**
     * Pans the Gantt by the specified amount.
     * @param {number} deltaX The number of pixels to pan in the x direction.
     * @param {number} deltaY The number of pixels to pan in the y direction.
     * @param {boolean=} diagonal true if support diagonal pan, false or undefined otherwise. Default varies by theme.
     * @protected
     */
    panBy(deltaX, deltaY, diagonal) {
      if (deltaX === 0 && deltaY === 0) {
        return;
      }

      diagonal =
        typeof diagonal !== 'undefined' ? diagonal : this.getCtx().getThemeBehavior() !== 'alta';
      var bHorizontal = deltaX !== 0 && (diagonal || Math.abs(deltaX) > Math.abs(deltaY));
      var bVertical =
        this._databody && deltaY !== 0 && (diagonal || Math.abs(deltaY) > Math.abs(deltaX));

      // pan horizontally
      if (bHorizontal) {
        super.panBy(deltaX, 0);
      }

      // pan vertically
      if (bVertical) {
        var newTranslateY = this.getBoundedContentTranslateY(this._databody.getTranslateY() - deltaY);

        if (this.isContentDirScrollbarOn())
          this.contentDirScrollbar.setViewportRange(
            newTranslateY - this.getDatabodyHeight(),
            newTranslateY
          );

        this.setDataRegionTranslateY(newTranslateY, true);
      }

      if (this.isTimeDirScrollbarOn() && this.timeDirScrollbar)
        this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);

      // Update viewport
      this.renderViewport(DvtGanttDataLayoutManager.VPC_TRANSLATE, bVertical);

      if (bHorizontal) {
        // Update time axis due to horizontal viewport change
        DvtGanttRenderer._renderAxes(this, this.getTimeZoomCanvas(), true);
      }
    }

    /**
     * Utility method for getting the bounded translate y value of content containers
     * (i.e. databody, dependency lines containers, and any other same size overlayed containers)
     * @param {number} proposedTranslateY The proposed translate y, which is not necessarily bounded
     * @return {number} The bounded version of the translate y
     */
    getBoundedContentTranslateY(proposedTranslateY) {
      var contentHeight = this.getContentHeight();
      if (contentHeight == null)
        // Initial render; proposed translate Y is always within bounds
        return proposedTranslateY;

      var databodyHeight = this.getDatabodyHeight();
      var maxTranslateY = this.getDatabodyStart();
      var minTranslateY = maxTranslateY + Math.min(0, databodyHeight - contentHeight);
      return Math.min(maxTranslateY, Math.max(proposedTranslateY, minTranslateY));
    }

    /**
     * @protected
     * @override
     */
    beginDragPan(compX, compY) {
      super.beginDragPan(compX, compY);

      this._currentViewStartTime = this._viewStartTime;
      this._currentViewEndTime = this._viewEndTime;
    }

    /**
     * @protected
     * @override
     */
    endDragPan(compX, compY) {
      // check whether we should dispatch viewport change event
      if (
        this._currentViewStartTime === this._viewStartTime &&
        this._currentViewEndTime === this._viewEndTime
      )
        this._triggerViewportChange = false;

      super.endDragPan(compX, compY);
    }

    /**
     * Dim or un-Dim all tasks except the task specified
     * @param {DvtGanttTaskNode} task the task to exempt
     * @param {boolean} dim true if dim the task, brighten it otherwise
     * @protected
     */
    setTaskBrightness(task, dim) {
      task = this.findTaskNodeById(task.getId());
      if (task != null) dim ? task.darken() : task.brighten();
    }

    /**
     * Find the task node with the specified id
     * @param {*} id the id
     * @return {DvtGanttTaskNode} the task with the specified id or null if none is found
     */
    findTaskNodeById(id) {
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
    }

    /**
     * Helper method to decide whether or not the options are valid.
     * @return {boolean} Whether this Gantt chart has valid options.
     */
    hasValidOptions() {
      var hasValidMajorScale = this._majorAxis ? this._majorAxis.hasValidOptions() : true; // major axis optional
      var hasValidMinorScale = this._minorAxis && this._minorAxis.hasValidOptions();
      var hasValidStartAndEnd = this._start && this._end && this._end > this._start;
      var hasValidViewport =
        this._viewStartTime && this._viewEndTime ? this._viewEndTime > this._viewStartTime : true;
      var hasValidViewStart = this._viewStartTime
        ? this._viewStartTime >= this._start && this._viewStartTime < this._end
        : true;
      var hasValidViewEnd = this._viewEndTime
        ? this._viewEndTime > this._start && this._viewEndTime <= this._end
        : true;

      return (
        hasValidMajorScale &&
        hasValidMinorScale &&
        hasValidStartAndEnd &&
        hasValidViewport &&
        hasValidViewStart &&
        hasValidViewEnd
      );
    }

    /** ****************** Selection **********************/
    /**
     * Gets selection handler
     * @return {dvt.SelectionHandler} selection handler
     */
    getSelectionHandler() {
      return this._selectionHandler;
    }

    /**
     * Returns whether selecton is supported on the Gantt.
     * @return {boolean} True if selection is turned on and false otherwise.
     */
    isSelectionSupported() {
      return this._selectionHandler ? true : false;
    }

    /**
     * Sets the selection mode for the component
     * @param {string} selectionMode valid values dvt.SelectionHandler.TYPE_SINGLE, dvt.SelectionHandler.TYPE_MULTIPLE or null
     */
    setSelectionMode(selectionMode) {
      if (selectionMode === 'single')
        this._selectionHandler = new dvt.SelectionHandler(
          this.getCtx(),
          dvt.SelectionHandler.TYPE_SINGLE
        );
      else if (selectionMode === 'multiple')
        this._selectionHandler = new dvt.SelectionHandler(
          this.getCtx(),
          dvt.SelectionHandler.TYPE_MULTIPLE
        );
      else this._selectionHandler = null;

      // Event Handler delegates to other handlers
      this.getEventManager().setSelectionHandler(this._selectionHandler);
    }

    /**
     * @override
     */
    select(selection) {
      if (this.isLastRenderValid()) {
        // Update the options
        this.Options['selection'] = dvt.JsonUtils.clone(selection);

        // Perform the selection
        this._processInitialSelections();
      }
    }

    /**
     * Update the selection handler with the initial selections.
     * @private
     */
    _processInitialSelections() {
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
              var taskNode = taskObj['node'];
              targets.push(taskNode);
            }
          }
        }
        this.getSelectionHandler().processInitialSelections(selection, targets);
      }
    }

    /** ****************** Dependency line **********************/
    /**
     * Gets the container object for the dependency lines
     * @return {dvt.Container} the container for the dependency lines
     */
    getDependenciesContainer() {
      return this._dependenciesContainer;
    }

    /**
     * Sets the container object for the dependency lines
     * @param {dvt.Container} dependenciesContainer the container for the dependency lines
     */
    setDependenciesContainer(dependenciesContainer) {
      this._dependenciesContainer = dependenciesContainer;
    }

    /**
     * Sets the id of the default marker
     * @param {string} id the id of the default marker
     */
    setDefaultMarkerId(id) {
      this._markerId = id;
    }

    /**
     * Gets the id of the default marker
     * @return {string} the id of the default marker
     */
    getDefaultMarkerId() {
      return this._markerId;
    }

    /**
     * Gets the predecessors or successors for the specified task
     * @param {DvtGanttTaskNode} task the task
     * @param {string} type successor or predecessor
     * @return {DvtGanttDependencyNode[]} array of predecessors or successors for the specified task
     */
    getNavigableDependencyLinesForTask(task, type) {
      return type === 'successor'
        ? task.getSuccessorDependencies()
        : task.getPredecessorDependencies();
    }

    // should be in super
    /**
     * Handle touch start event
     * @param {object} event
     */
    HandleTouchStart(event) {}
  }

  exports.Gantt = Gantt;

  Object.defineProperty(exports, '__esModule', { value: true });

});
