/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['./DvtToolkit', './DvtTimeComponent', './DvtTimeAxis'], function(dvt) {
  // Internal use only.  All APIs and functionality are subject to change at any time.

(function(dvt) {
/**
 *   Static Dom Utility Functions
 *   @class dvt.DomUtils
 *   @constructor
 */
dvt.DomUtils = function()
{};

dvt.Obj.createSubclass(dvt.DomUtils, dvt.Obj);

/**
 * Copied from AdfDhtmlCommonUtils used in Faces
 * Adds a CSS className to the dom node if it doesn't already exist in the classNames list and
 * returns <code>true</code> if the class name was added.
 * @param {Element|Node|null|undefined} domElement DOM Element to add style class name to
 * @param {?string} className Name of style class to add
 * @return {boolean} <code>true</code> if the style class was added
 */
dvt.DomUtils.addCSSClassName = function(domElement, className)
{
  var added, currentClassName, classNameIndex, newClassName;
  added = false;

  if (className != null && domElement != null)
  {
    currentClassName = dvt.ToolkitUtils.getAttrNullNS(domElement, 'class');

    // get the current location of the className to add in the classNames list
    classNameIndex = dvt.DomUtils._getCSSClassNameIndex(currentClassName, className);

    // the className doesn't exist so add it
    if (classNameIndex == -1)
    {
      newClassName = currentClassName
                    ? className + ' ' + currentClassName
                    : className;

      dvt.ToolkitUtils.setAttrNullNS(domElement, 'class', newClassName);
      added = true;
    }
  }

  return added;
};

/**
 * Copied from AdfDhtmlCommonUtils used in Faces
 * Removes a CSS className to the dom node if it existd in the classNames list and
 * returns <code>true</code> if the class name was removed.
 * @param {Element|Node|null|undefined} domElement DOM Element to remove style class name from
 * @param {?string} className Name of style class to remove
 * @return {boolean} <code>true</code> if the style class was removed
 */
dvt.DomUtils.removeCSSClassName = function(domElement, className)
{
  var removed, currentClassName, classNameIndex, classNameEndIndex, beforestring, afterstring, newClassName;
  removed = false;

  if (className != null && domElement != null)
  {
    currentClassName = dvt.ToolkitUtils.getAttrNullNS(domElement, 'class');

    classNameIndex = dvt.DomUtils._getCSSClassNameIndex(currentClassName, className);

    // only need to do work if CSS class name is present
    if (classNameIndex != -1)
    {
      classNameEndIndex = classNameIndex + className.length;

      // the new classNames string is the string before our className and leading whitespace plus
      // the string after our className and trailing whitespace
      beforestring = (classNameIndex == 0)
                    ? null
                    : currentClassName.substring(0, classNameIndex);
      afterstring = (classNameEndIndex == currentClassName.length)
                    ? null
                    : currentClassName.substring(classNameEndIndex + 1); // skip space

      if (beforestring == null)
      {
        if (afterstring == null)
        {
          newClassName = '';
        }
        else
        {
          newClassName = afterstring;
        }
      }
      else
      {
        if (afterstring == null)
        {
          newClassName = beforestring;
        }
        else
        {
          newClassName = beforestring + afterstring;
        }
      }

      dvt.ToolkitUtils.setAttrNullNS(domElement, 'class', newClassName);
      removed = true;
    }
  }

  return removed;
};

/**
 * @param {Element|Node|null|undefined} domElement DOM Element to check for the style <code>className</code>
 * @param {string} className the CSS className to check for
 * @return {boolean} <code>true</code> if the className is in the element's list of classes
 */
dvt.DomUtils.containsCSSClassName = function(domElement, className)
{
  if (className != null && domElement != null)
  {
    return dvt.DomUtils._getCSSClassNameIndex(domElement.className, className) != -1;
  }
  return false;
};

/**
 * Copied from AdfDhtmlCommonUtils used in Faces
 * Returns the index at which <code>className</code> appears within <code>currentClassName</code>
 * with either a space or the beginning or end of <code>currentClassName</code> on either side.
 * This function optimizes the runtime speed by not creating objects in most cases and assuming
 * 1) It is OK to only check for spaces as whitespace characters
 * 2) It is rare for the searched className to be a substring of another className, therefore
 *    if we get a hit on indexOf, we have almost certainly found our className
 * 3) It is even rarer for the searched className to be a substring of more than one className,
 *    therefore, repeating the search from the end of the string should almost always either return
 *    our className or the original search hit from indexOf
 * @param {string} currentClassName Space-separated class name string to search
 * @param {string} className string to search for within currentClassName
 * @return {number} index of className in currentClassName, or -1 if it doesn't exist
 * @private
 */
dvt.DomUtils._getCSSClassNameIndex = function(currentClassName, className)
{
  var classNameLength, currentClassNameLength, nameIndex, hasStart, endIndex, hasEnd, lastNameIndex;
  // if no current class
  // SVG element className property is not of type string
  if (!currentClassName || !currentClassName.indexOf)
  {
    return -1;
  }

  // if the strings are equivalent, then the start index is the beginning of the string
  if (className === currentClassName)
  {
    return 0;
  }

  classNameLength = className.length;
  currentClassNameLength = currentClassName.length;

  // check if our substring exists in the string at all
  nameIndex = currentClassName.indexOf(className);

  // if our substring exists then our class exists if either:
  // 1) It is at the beginning of the classNames string and has a following space
  // 2) It is at the end of the classNames string and has a leading space
  // 3) It has a space on either side
  if (nameIndex >= 0)
  {
    hasStart = (nameIndex == 0) || (currentClassName.charAt(nameIndex - 1) == ' ');
    endIndex = nameIndex + classNameLength;
    hasEnd = (endIndex == currentClassNameLength) || (currentClassName.charAt(endIndex) == ' ');

    //one of the three condition above has been met so our string is in the parent string
    if (hasStart && hasEnd)
    {
      return nameIndex;
    }

    // our substring exists in the parent string but didn't meet the above conditions,  Were
    // going to be lazy and retest, searchig for our substring from the back of the classNames
    // string
    lastNameIndex = currentClassName.lastIndexOf(className);

    // if we got the same index as the search from the beginning then we aren't in here
    if (lastNameIndex != nameIndex)
    {
      // recheck the three match cases
      hasStart = currentClassName.charAt(lastNameIndex - 1);
      endIndex = lastNameIndex + classNameLength;
      hasEnd = (endIndex == currentClassNameLength) || (currentClassName.charAt(endIndex) == ' ');

      if (hasStart && hasEnd)
      {
        return lastNameIndex;
      }

      // this should only happen if the searched for className is a substring of more
      // than one className in the classNames list, so it is OK for this to be slow.  We
      // also know at this point that we definitely didn't get a match at either the very
      // beginning or very end of the classNames string, so we can safely append spaces
      // at either end
      return currentClassName.indexOf(' ' + className + ' ');

    }
  }

  // no match
  return -1;
};

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
 * Gets the horizontal scrollbar style.
 * @return {dvt.CSSStyle} The scrollbar style.
 */
DvtGanttStyleUtils.getHorizontalScrollbarStyle = function()
{
  return new dvt.CSSStyle(DvtGanttStyleUtils._DEFAULT_HORIZONTAL_SCROLLBAR_STYLE);
};

/**
 * Gets the vertical scrollbar style.
 * @return {dvt.CSSStyle} The scrollbar style.
 */
DvtGanttStyleUtils.getVerticalScrollbarStyle = function()
{
  return new dvt.CSSStyle(DvtGanttStyleUtils._DEFAULT_VERTICAL_SCROLLBAR_STYLE);
};

/**
 * Gets the standalone task height (i.e. no baseline present)
 * @return {number} The standalone task height.
 */
DvtGanttStyleUtils.getStandaloneTaskHeight = function()
{
  return DvtGanttStyleUtils._DEFAULT_STANDALONE_TASK_HEIGHT;
};

/**
 * Gets the actual task height (i.e. baseline present)
 * @return {number} The actual task height.
 */
DvtGanttStyleUtils.getActualTaskHeight = function()
{
  return DvtGanttStyleUtils._DEFAULT_ACTUALTASK_HEIGHT;
};

/**
 * Gets the baseline task height.
 * @return {number} The baseline task height.
 */
DvtGanttStyleUtils.getBaselineTaskHeight = function()
{
  return DvtGanttStyleUtils._DEFAULT_BASELINE_TASK_HEIGHT;
};

/**
 * Gets the milestone baseline y offset from actual task top.
 * @return {number} The milestone baseline y offset from actual task top.
 */
DvtGanttStyleUtils.getMilestoneBaselineYOffset = function()
{
  return DvtGanttStyleUtils._DEFAULT_MILESTONE_BASELINE_Y_OFFSET;
};

/**
 * Gets the summary task shape thickness.
 * @return {number} The summary task shape thickness in px.
 */
DvtGanttStyleUtils.getSummaryThickness = function()
{
  return DvtGanttStyleUtils._DEFAULT_SUMMARY_THICKNESS;
};

/**
 * Gets the padding around task.
 * @return {number} The task padding.
 */
DvtGanttStyleUtils.getTaskPadding = function()
{
  return DvtGanttStyleUtils._DEFAULT_TASK_PADDING;
};

/**
 * Gets the padding around task label.
 * @return {number} The task label padding.
 */
DvtGanttStyleUtils.getTaskLabelPadding = function()
{
  return DvtGanttStyleUtils._DEFAULT_TASK_LABEL_PADDING;
};

/**
 * Gets the space around hover or selected task.
 * @return {number} The task effect margin.
 */
DvtGanttStyleUtils.getTaskEffectMargin = function()
{
  return DvtGanttStyleUtils._DEFAULT_TASK_EFFECT_MARGIN;
};

/**
 * Gets the task tint filter id.
 * @return {string} The task tint filter id.
 */
DvtGanttStyleUtils.getTaskTintFilterId = function()
{
  return DvtGanttStyleUtils._DEFAULT_TASK_TINT_FILTER_ID;
};

/**
 * Gets the task shade filter id.
 * @return {string} The task shade filter id.
 */
DvtGanttStyleUtils.getTaskShadeFilterId = function()
{
  return DvtGanttStyleUtils._DEFAULT_TASK_SHADE_FILTER_ID;
};

/**
 * Gets the task tint alpha (e.g. on the normal bar shape)
 * @return {number} The task tint alpha
 */
DvtGanttStyleUtils.getTaskTintAlpha = function()
{
  return DvtGanttStyleUtils._DEFAULT_TASK_TINT_ALPHA;
};

/**
 * Gets the task shade alpha (e.g. on the variance shape)
 * @return {number} The task shade alpha
 */
DvtGanttStyleUtils.getTaskShadeAlpha = function()
{
  return DvtGanttStyleUtils._DEFAULT_TASK_SHADE_ALPHA;
};

/**
 * Gets the default height of the time axis.
 * @return {number} The default height of time axis.
 */
DvtGanttStyleUtils.getTimeAxisHeight = function()
{
  return DvtGanttStyleUtils._DEFAULT_AXIS_HEIGHT;
};

/**
 * Gets the major axis label style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {dvt.CSSStyle} The label style.
 */
DvtGanttStyleUtils.getMajorAxisLabelStyle = function(options)
{
  var resources = options['_resources'];
  var labelStyleString = DvtGanttStyleUtils._DEFAULT_TIMEAXES_LABEL_STYLE;
  if (resources)
    labelStyleString = resources['majorAxisLabelFontProp'];
  return new dvt.CSSStyle(labelStyleString);
};

/**
 * Gets the minor axis label style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {dvt.CSSStyle} The label style.
 */
DvtGanttStyleUtils.getMinorAxisLabelStyle = function(options)
{
  var resources = options['_resources'];
  var labelStyleString = DvtGanttStyleUtils._DEFAULT_TIMEAXES_LABEL_STYLE;
  if (resources)
    labelStyleString = resources['minorAxisLabelFontProp'];
  return new dvt.CSSStyle(labelStyleString);
};

/**
 * Gets the gap between the row axis (when outside the char) and the chart.
 * @return {number} The gap between the row axis and the chart.
 */
DvtGanttStyleUtils.getRowAxisGap = function()
{
  return DvtGanttStyleUtils._ROW_LABELS_AXIS_GAP;
};

/**
 * Gets the length of the horizontal dependency portion coming in/out of a task.
 * @return {number} The length of the horizontal dependency portion coming in/out of a task.
 */
DvtGanttStyleUtils.getDependencyLineTaskFlankLength = function()
{
  return DvtGanttStyleUtils._DEPENDENCY_LINE_TASK_FLANK_LENGTH;
};

/**
 * Gets the radius for the arc used in the dependency line.
 * @return {number} The radius for the arc used in the dependency line.
 */
DvtGanttStyleUtils.getDependencyLineArcRadius = function()
{
  return DvtGanttStyleUtils._DEPENDENCY_LINE_ARC_RADIUS;
};

/**
 * Gets the width of the dependency line marker.
 * @return {number} The width of the dependency line marker.
 */
DvtGanttStyleUtils.getDependencyLineMarkerWidth = function()
{
  return DvtGanttStyleUtils._DEPENDENCY_MARKER_WIDTH;
};

/**
 * Gets the height of the dependency line marker.
 * @return {number} The height of the dependency line marker.
 */
DvtGanttStyleUtils.getDependencyLineMarkerHeight = function()
{
  return DvtGanttStyleUtils._DEPENDENCY_MARKER_HEIGHT;
};

/**
 * Gets the vertical gap between the top or bottom of the task and the point at which its dependency line can bend.
 * @return {number} The gap size in px.
 */
DvtGanttStyleUtils.getDependencyLineTaskGap = function()
{
  return DvtGanttStyleUtils.getTaskPadding() - 1;
};

/**
 * Gets the maximum distance from an edge of the viewport such that auto 
 * panning happens during drag (or equivalent).
 * @return {number} The maximum distance from an edge in px.
 */
DvtGanttStyleUtils.getAutoPanEdgeThreshold = function()
{
  return DvtGanttStyleUtils._AUTOPAN_EDGE_THRESHOLD;
};

/**
 * Gets the task label style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {dvt.CSSStyle} The label style.
 */
DvtGanttStyleUtils.getTaskLabelStyle = function(options)
{
  var resources = options['_resources'];
  var labelStyleString = '';
  if (resources)
    labelStyleString = resources['taskLabelFontProp'];
  return new dvt.CSSStyle(labelStyleString);
};

/**
 * Gets the row label style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {dvt.CSSStyle} The label style.
 */
DvtGanttStyleUtils.getRowLabelStyle = function(options)
{
  var resources = options['_resources'];
  var labelStyleString = '';
  if (resources)
    labelStyleString = resources['rowLabelFontProp'];
  return new dvt.CSSStyle(labelStyleString);
};

/**
 * Gets the chart stroke width.
 * @param {object} options The object containing data and specifications for the component.
 * @return {number} The chart stroke width in px.
 */
DvtGanttStyleUtils.getChartStrokeWidth = function(options)
{
  var resources = options['_resources'];
  if (resources)
  {
    var chartStyle = resources['chartArea'];
    if (chartStyle)
    {
      var strokeWidth = chartStyle['strokeWidth'];
      if (strokeWidth)
        return dvt.CSSStyle.toNumber(strokeWidth);
    }
  }
  return 1; // default for browsers is 1px when not specified
};

/**
 * Gets the horizontal gridline width.
 * @param {object} options The object containing data and specifications for the component.
 * @return {number} The horizontal gridline width in px.
 */
DvtGanttStyleUtils.getHorizontalGridlineWidth = function(options)
{
  return options['_resources'] ? dvt.CSSStyle.toNumber(options['_resources']['horizontalGridlineWidth']) : 1; // default for browsers is 1px when not specified
};

/**
 * Gets the animation duration.
 * @param {object} options The object containing data and specifications for the component.
 * @return {number} The animation duration in seconds.
 */
DvtGanttStyleUtils.getAnimationDuration = function(options)
{
  var animationDuration = DvtGanttStyleUtils._DEFAULT_ANIMATION_DURATION,
      customAnimationDuration;

  // Override with animation duration from CSS if possible
  if (options['_resources'])
  {
    customAnimationDuration = options['_resources']['animationDuration'];
    if (customAnimationDuration)
    {
      animationDuration = dvt.StyleUtils.getTimeMilliseconds(customAnimationDuration) / 1000; // seconds
    }
  }

  return animationDuration;
};

/**
 * Returns the zoom control background color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control background color.
 */
DvtGanttStyleUtils.getZoomInButtonBackgroundColor = function(options)
{
  if (options['zoomIn_bgc'])
    return options['zoomIn_bgc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
};

/**
 * Returns the zoom control active background color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control active background color.
 */
DvtGanttStyleUtils.getZoomInButtonActiveBackgroundColor = function(options)
{
  if (options['zoomIn_a_bgc'])
    return options['zoomIn_a_bgc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
};

/**
 * Returns the zoom control hover background color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control hover background color.
 */
DvtGanttStyleUtils.getZoomInButtonHoverBackgroundColor = function(options)
{
  if (options['zoomIn_h_bgc'])
    return options['zoomIn_h_bgc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
};

/**
 * Returns the zoom control disabled background color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control disabled background color.
 */
DvtGanttStyleUtils.getZoomInButtonDisabledBackgroundColor = function(options)
{
  if (options['zoomIn_d_bgc'])
    return options['zoomIn_d_bgc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
};

/**
 * Returns the zoom control border color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control border color.
 */
DvtGanttStyleUtils.getZoomInButtonBorderColor = function(options)
{
  if (options['zoomIn_bc'])
    return options['zoomIn_bc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
};

/**
 * Returns the zoom control active border color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control active border color.
 */
DvtGanttStyleUtils.getZoomInButtonActiveBorderColor = function(options)
{
  if (options['zoomIn_a_bc'])
    return options['zoomIn_a_bc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
};

/**
 * Returns the zoom control hover border color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control hover border color.
 */
DvtGanttStyleUtils.getZoomInButtonHoverBorderColor = function(options)
{
  if (options['zoomIn_h_bc'])
    return options['zoomIn_h_bc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
};

/**
 * Returns the zoom control disabled border color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control disabled border color.
 */
DvtGanttStyleUtils.getZoomInButtonDisabledBorderColor = function(options)
{
  if (options['zoomIn_d_bc'])
    return options['zoomIn_d_bc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
};

/**
 * Returns the zoom control background color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control background color.
 */
DvtGanttStyleUtils.getZoomOutButtonBackgroundColor = function(options)
{
  if (options['zoomOut_bgc'])
    return options['zoomOut_bgc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
};

/**
 * Returns the zoom control active background color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control active background color.
 */
DvtGanttStyleUtils.getZoomOutButtonActiveBackgroundColor = function(options)
{
  if (options['zoomOut_a_bgc'])
    return options['zoomOut_a_bgc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
};

/**
 * Returns the zoom control hover background color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control hover background color.
 */
DvtGanttStyleUtils.getZoomOutButtonHoverBackgroundColor = function(options)
{
  if (options['zoomOut_h_bgc'])
    return options['zoomOut_h_bgc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
};

/**
 * Returns the zoom control disabled background color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control disabled background color.
 */
DvtGanttStyleUtils.getZoomOutButtonDisabledBackgroundColor = function(options)
{
  if (options['zoomOut_d_bgc'])
    return options['zoomOut_d_bgc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BACKGROUND_COLOR;
};

/**
 * Returns the zoom control border color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control border color.
 */
DvtGanttStyleUtils.getZoomOutButtonBorderColor = function(options)
{
  if (options['zoomOut_bc'])
    return options['zoomOut_bc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
};

/**
 * Returns the zoom control active border color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control active border color.
 */
DvtGanttStyleUtils.getZoomOutButtonActiveBorderColor = function(options)
{
  if (options['zoomOut_a_bc'])
    return options['zoomOut_a_bc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
};

/**
 * Returns the zoom control hover border color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control hover border color.
 */
DvtGanttStyleUtils.getZoomOutButtonHoverBorderColor = function(options)
{
  if (options['zoomOut_h_bc'])
    return options['zoomOut_h_bc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
};

/**
 * Returns the zoom control disabled border color.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The zoom control disabled border color.
 */
DvtGanttStyleUtils.getZoomOutButtonDisabledBorderColor = function(options)
{
  if (options['zoomOut_d_bc'])
    return options['zoomOut_d_bc'];
  else
    return DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_BORDER_COLOR;
};

/**
 * Returns the stroke color of the inner dependency line when it has focus.
 * @param {object} options The object containing data and specification for the component.
 * @return {string} The stroke color of the inner dependency line when it has focus.
 */
DvtGanttStyleUtils.getFocusedDependencyLineInnerColor = function(options)
{
  return DvtGanttStyleUtils._DEFAULT_DEPENDENCY_LINE_INNER_COLOR;
};

/**
 * Returns the stroke width of the inner dependency line when it has focus.
 * @param {object} options The object containing data and specification for the component.
 * @return {number} The stroke width of the inner dependency line when it has focus.
 */
DvtGanttStyleUtils.getFocusedDependencyLineInnerWidth = function(options)
{
  return DvtGanttStyleUtils._DEFAULT_DEPENDENCY_LINE_INNER_WIDTH;
};

/**
 * Computes the size of a subcomponent in pixels by parsing the user input. Same method as that of DvtChartStyleUtils.
 * @param {object} size The size input given by the user. It can be in percent, pixels, or number.
 * @param {number} totalSize The total size of the component in pixels.
 * @return {number} The size of the subcomponent in pixels.
 */
DvtGanttStyleUtils.getSizeInPixels = function(size, totalSize) {
  if (typeof(size) == 'string') {
    if (size.slice(-1) == '%')
      return totalSize * Number(size.slice(0, -1)) / 100;
    else if (size.slice(-2) == 'px')
      return Number(size.slice(0, -2));
    else
      size = Number(size);
  }

  if (typeof(size) == 'number') {
    if (size <= 1) // assume to be ratio
      return totalSize * size;
    else // assume to be absolute size in pixels
      return size;
  }
  else
    return 0;
};

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
DvtGanttTooltipUtils.getDatatipColor = function(taskNode) {
  var fillColor = taskNode.getTask().getFillColor();
  if (fillColor)
  {
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
DvtGanttTooltipUtils.getDatatip = function(taskNode, isTabular, isAria) {
  var gantt = taskNode.getGantt();

  // If performing DnD Move via keyboard and the navigation scale changed, show the scale change info instead of the normal tooltip
  if (gantt.getEventManager().isMoveScaleChanged())
  {
    // No valueFormats support for scale change info, so type is left as empty string for now
    var navigationScale = gantt.getEventManager().getMoveNavigationScale();
    var navigationScaleDesc = DvtGanttTooltipUtils._addDatatipRow('', gantt, '', 'MoveBy', navigationScale.charAt(0).toUpperCase() + navigationScale.slice(1), isTabular);
    return DvtGanttTooltipUtils._processDatatip(navigationScaleDesc, gantt, isTabular);
  }

  // Custom Tooltip via Function
  var customTooltip = gantt.getOptions()['tooltip'];
  var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;

  if (isTabular && tooltipFunc) {
    var tooltipManager = gantt.getCtx().getTooltipManager();
    var dataContext = gantt.getEventManager().isDnDDragging() ? taskNode.getSandboxDataContext() : taskNode.getDataContext();
    return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
  }

  // Custom Tooltip via Short Desc
  var shortDesc = taskNode.getProps()['shortDesc'];
  if (shortDesc != null)
    return shortDesc;

  // TODO: Remove this block and the isAria param when we can remove the translation strings that were supported
  // before the shortDesc/valueFormats/tooltip API (before 2.3.0). At the time of writing, we plan to deprecate
  // them, and remove in 5.0.0. Custom elements version starts with a clean slate and won't use these deprecated strings starting 4.0.0
  // Behavior: If someone upgrades from 2.2.0 to 2.3.0 with no code changes (ie, no shortDesc, valueFormat set),
  // old aria-label format with the translation options will work as before. If shortDesc or valueFormat is set,
  // then new behavior will override the old aria-label format and any translation settings.
  if (isAria && !gantt.getCtx().isCustomElement()) {
    var valueFormats = gantt.getOptions()['valueFormats'];
    if (!valueFormats || valueFormats.length == 0) {
      var taskProps = taskNode.getProps();
      var task = taskNode.getTask();
      var start = taskProps['start'];
      var end = taskProps['end'];
      var baselineStart = taskProps['baseline']['start'];
      var baselineEnd = taskProps['baseline']['end'];
      var progressValue = task.getProgressValue();
      var options = gantt.getOptions();
      var isMainMilestone = task.isMilestone('main');
      var isBaselineMilestone = task.isMilestone('baseline');
      var validActualTask = !(start == null && end == null);
      var validBaselineTask = !(baselineStart == null && baselineEnd == null);

      if (validActualTask)
      {
        if (isMainMilestone) {
          var time = gantt.getTimeAxis().formatDate(new Date(((start != null) ? start : end)), null, 'general');
          var taskDesc = dvt.Bundle.getTranslation(options, 'accessibleMilestoneInfo', dvt.Bundle.UTIL_PREFIX, 'MILESTONE_INFO', [time]);
        }
        else {
          var startTime = gantt.getTimeAxis().formatDate(new Date(start), null, 'general');
          var endTime = gantt.getTimeAxis().formatDate(new Date(end), null, 'general');
          var duration = taskNode.getDuration(start, end);
          taskDesc = dvt.Bundle.getTranslation(options, 'accessibleTaskInfo', dvt.Bundle.UTIL_PREFIX, 'TASK_INFO', [startTime, endTime, duration]);
        }
      }

      if (validBaselineTask)
      {
        if (isBaselineMilestone) {
          var baselineTime = gantt.getTimeAxis().formatDate(new Date(((baselineStart != null) ? baselineStart : baselineEnd)), null, 'general');
          var baselineDesc = dvt.Bundle.getTranslation(gantt.getOptions(), 'baselineDate') + ': ' + baselineTime;
        }
        else {
          var baselineStartTime = gantt.getTimeAxis().formatDate(new Date(baselineStart), null, 'general');
          var baselineEndTime = gantt.getTimeAxis().formatDate(new Date(baselineEnd), null, 'general');
          baselineDesc = dvt.Bundle.getTranslation(gantt.getOptions(), 'baselineStart') + ': ' + baselineStartTime;
          baselineDesc = baselineDesc + '; ' + dvt.Bundle.getTranslation(gantt.getOptions(), 'baselineEnd') + ': ' + baselineEndTime;
        }
      }

      if (validActualTask)
      {
        var label = taskProps['label'];
        if (label != null)
          var labelDesc = dvt.Bundle.getTranslation(gantt.getOptions(), 'labelLabel') + ': ' + label;

        if (progressValue != null)
        {
          var resources = options['_resources'];
          if (resources)
          {
            var percentConverter = resources['percentConverter'];
            if (percentConverter)
            {
              var formattedProgressValue = percentConverter['format'](progressValue);
              if (formattedProgressValue != null)
                var progressDesc = dvt.Bundle.getTranslation(gantt.getOptions(), 'labelProgress') + ': ' + formattedProgressValue;
            }
          }
        }
      }

      var row = taskNode.getRow();
      var rowLabel = row.getLabel();
      if (rowLabel == null)
        rowLabel = row.getIndex() + 1;
      var rowDesc = dvt.Bundle.getTranslation(options, 'accessibleRowInfo', dvt.Bundle.UTIL_PREFIX, 'ROW_INFO', [rowLabel]);

      var desc = rowDesc;
      if (taskDesc)
        desc = desc + '; ' + taskDesc;
      if (baselineDesc)
        desc = desc + '; ' + baselineDesc;
      if (labelDesc)
        desc = desc + '; ' + labelDesc;
      if (progressDesc)
        desc = desc + '; ' + progressDesc;
      return desc;
    }
  }

  // Default Tooltip Support
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
DvtGanttTooltipUtils._processDatatip = function(datatip, gantt, isTabular) {
  // Don't render tooltip if empty
  if (datatip == '')
    return null;

  // Add outer table tags
  // Note: Unlike Charts, we're not going to create a table start tag with
  // dvt.HtmlTooltipManager.createStartTag(). That method applies parsed styles
  // to the element, but for gantt we want to directly apply the class to the element:
  //
  // Security note: gantt.GetStyleClass('tooltipTable') returns an internally generated class string
  // defined in ojgantt.js (in this case, returns the string 'oj-gantt-tooltip-table')
  //
  // datatip contains externally provided strings, but this entire value is eventually passed to
  // dvt.HtmlTooltipManager._showTextAtPosition(),
  // and that method makes sure all parsable HTML tags are disabled/handled
  if (isTabular)
    return '<table class=\"' + gantt.GetStyleClass('tooltipTable') + '\">' + datatip + '<\/table>';// @HTMLUpdateOK

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
DvtGanttTooltipUtils._addRowDatatip = function(datatip, taskNode, isTabular) {
  var gantt = taskNode.getGantt();
  if (gantt.getEventManager().isDnDDragging())
  {
    var row = taskNode.getSandboxProps()['row'];
  }
  else
  {
    row = taskNode.getRow();
  }

  var rowLabel = row.getLabel();
  if (rowLabel == null)
    rowLabel = row.getIndex() + 1;
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
DvtGanttTooltipUtils._addTaskDatatip = function(datatip, taskNode, isTabular) {
  var gantt = taskNode.getGantt();
  var taskProps = gantt.getEventManager().isDnDDragging() ? taskNode.getSandboxProps() : taskNode.getProps();
  var task = taskNode.getTask();

  var start = taskProps['start'];
  var end = taskProps['end'];
  var baselineStart = taskProps['baseline']['start'];
  var baselineEnd = taskProps['baseline']['end'];
  var label = taskProps['label'];
  var progress = task.getProgressValue(); // main Milestone check happens here too

  var validActualTask = !(start == null && end == null);
  var validBaselineTask = !(baselineStart == null && baselineEnd == null);
  var isMainMilestone = task.isMilestone('main');
  var isBaselineMilestone = task.isMilestone('baseline');

  if (validActualTask)
  {
    if (isMainMilestone)
    {
      datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'date', 'Date', start != null ? start : end, isTabular);
      if (isBaselineMilestone)
      {
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineDate', 'BaselineDate', baselineStart != null ? baselineStart : baselineEnd, isTabular);
      }
      else if (validBaselineTask)
      {
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineStart', 'BaselineStart', baselineStart, isTabular);
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineEnd', 'BaselineEnd', baselineEnd, isTabular);
      }
    }
    else
    {
      if (isBaselineMilestone)
      {
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'start', 'Start', start, isTabular);
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'end', 'End', end, isTabular);
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineDate', 'BaselineDate', baselineStart != null ? baselineStart : baselineEnd, isTabular);
      }
      else if (validBaselineTask)
      {
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'start', 'Start', start, isTabular);
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineStart', 'BaselineStart', baselineStart, isTabular);
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'end', 'End', end, isTabular);
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'baselineEnd', 'BaselineEnd', baselineEnd, isTabular);
      }
      else
      {
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'start', 'Start', start, isTabular);
        datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'end', 'End', end, isTabular);
      }
    }

    datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'label', 'Label', label, isTabular);
    if (progress != null)
    {
      datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'progress', 'Progress', progress, isTabular);
    }
  }
  else if (validBaselineTask)
  {
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
DvtGanttTooltipUtils._addDatatipRow = function(datatip, gantt, type, defaultLabel, value, isTabular, index) {
  if (value == null || value === '')
    return datatip;

  var valueFormat = DvtGanttTooltipUtils.getValueFormat(gantt, type);
  var tooltipDisplay = valueFormat['tooltipDisplay'];

  if (tooltipDisplay == 'off')
    return datatip;

  // Create tooltip label
  var tooltipLabel;
  if (typeof valueFormat['tooltipLabel'] === 'string')
    tooltipLabel = valueFormat['tooltipLabel'];

  if (tooltipLabel == null)
  {
    if (defaultLabel == null)
      tooltipLabel = '';
    else
      tooltipLabel = dvt.Bundle.getTranslation(gantt.getOptions(), 'label' + defaultLabel);
  }

  // Create tooltip value
  value = DvtGanttTooltipUtils.formatValue(gantt, type, valueFormat, value);

  if (isTabular)
  {
    // Note: Unlike Charts, we're not going to create a td start tag with
    // dvt.HtmlTooltipManager.createStartTag(). That method applies parsed styles
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
    return datatip +
        '<tr>' +
        '<td class=\"' + tooltipLabelClass + '\">' + tooltipLabel + '<\/td>' +
        '<td class=\"' + tooltipValueClass + '\">' + value + '<\/td>' +
        '<\/tr>';// @HTMLUpdateOK
  }
  else
  {
    if (datatip.length > 0)
      datatip += '<br>';

    return datatip + dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'COLON_SEP_LIST', [tooltipLabel, value]);
  }
};

/**
 * Returns the valueFormat of the specified type.
 * @param {dvt.Gantt} gantt
 * @param {string} type The valueFormat type, e.g. row, start, end, label.
 * @return {object} The valueFormat.
 */
DvtGanttTooltipUtils.getValueFormat = function(gantt, type) {
  var valueFormats = gantt.getOptions()['valueFormats'];
  if (!valueFormats)
    return {};
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

  if (valueFormats[type])
    return valueFormats[type];

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
DvtGanttTooltipUtils.formatValue = function(gantt, type, valueFormat, value) {
  var converter = valueFormat['converter'];

  if (type == 'start' || type == 'end' || type == 'date' || type == 'baselineStart' || type == 'baselineEnd' || type == 'baselineDate')
    return gantt.getTimeAxis().formatDate(new Date(value), converter, 'general');

  if (converter && converter['format'])
    return converter['format'](value);

  if (type == 'progress')
  {
    var resources = gantt.getOptions()['_resources'];
    if (resources)
    {
      var percentConverter = resources['percentConverter'];
      if (percentConverter)
      {
        return percentConverter['format'](value);
      }
    }
  }

  return value;
};

/**
 * Animation manager for dvt.Gantt
 * @param {dvt.Gantt} gantt the Gantt component
 * @class
 * @constructor
 */
var DvtGanttAnimationManager = function(gantt)
{
  this.Init(gantt);
};

dvt.Obj.createSubclass(DvtGanttAnimationManager, dvt.Obj);

/**
 * Initialize the animation manager
 * @param {dvt.Gantt} gantt the Gantt component
 * @protected
 */
DvtGanttAnimationManager.prototype.Init = function(gantt)
{
  // DvtGanttAnimationManager.superclass.Init.call(this, gantt.getCtx());
  this._gantt = gantt;
};

/**
 * Initializes the necessary animators for animation.
 */
DvtGanttAnimationManager.prototype.prepareForAnimations = function()
{
  var context = this._gantt.getCtx();

  // Ensure clean slate
  this._gantt.StopAnimation();

  this._animationMode = 'none';

  this._animationDuration = DvtGanttStyleUtils.getAnimationDuration(this._gantt.getOptions());

  // Figure out animation mode
  if (this._gantt.isInitialRender()) // initial render/display
  {
    if (this._gantt.isIRAnimationEnabled)
      this._animationMode = 'onDisplay';
  }
  else // data change
  {
    if (this._gantt.isDCAnimationEnabled)
      this._animationMode = 'dataChange';
  }

  // Initialize appropriate animators depending on animation mode
  if (this._animationMode === 'onDisplay')
  {
    // For animating fade in
    this.fadeInElemsIR = [];
    this.fadeInPlayableIR = new dvt.AnimFadeIn(context, this.fadeInElemsIR, this._animationDuration, 0);

    // Playable for animating dimension changes
    this.dimensionsPlayableIR = this._createCustomPlayable(dvt.Easing.linear);

    // For animating translations
    this.translationsPlayableIR = this._createCustomPlayable(dvt.Easing.cubicInOut);
  }
  else if (this._animationMode === 'dataChange')
  {
    // For animating fade in and out
    this.fadeInElemsDC = [];
    this.fadeInPlayableDC = new dvt.AnimFadeIn(context, this.fadeInElemsDC, this._animationDuration, 0);
    this.fadeOutElemsDC = [];
    this.fadeOutPlayableDC = new dvt.AnimFadeOut(context, this.fadeOutElemsDC, this._animationDuration, 0);

    // For animating dimension changes
    this.dimensionsPlayableDC = this._createCustomPlayable(dvt.Easing.linear);

    // For animating translations
    this.translationsPlayableDC = this._createCustomPlayable(dvt.Easing.cubicInOut);
  }

  // Callbacks to be executed at the end of animation
  this._onEnds = [];
};

/**
 * Generates a playable object with specified easing animation.
 * @param {function} easing The easing function to use when animating.
 * @return {dvt.CustomAnimation} The playable.
 * @private
 */
DvtGanttAnimationManager.prototype._createCustomPlayable = function(easing)
{
  var playable;
  playable = new dvt.CustomAnimation(this._gantt.getCtx(), this._gantt, this._animationDuration);
  playable.setEasing(easing);
  return playable;
};

/**
 * Starts all animations.
 */
DvtGanttAnimationManager.prototype.triggerAnimations = function()
{
  var subPlayables, context, i;

  // Stop any unfinished animations
  this._gantt.StopAnimation();

  context = this._gantt.getCtx();

  // Plan the animation
  if (this._animationMode === 'onDisplay')
  {
    // Parallel: Fade in all elements, animate any dimension changes
    subPlayables = [this.fadeInPlayableIR, this.translationsPlayableIR, this.dimensionsPlayableIR];
    this._gantt.Animation = new dvt.ParallelPlayable(context, subPlayables, this._animationDuration, 0);
  }
  else if (this._animationMode === 'dataChange')
  {
    // Parallel: Fade in elements, translate elements, animate dimension changes, fade out elements
    subPlayables = [this.fadeInPlayableDC, this.translationsPlayableDC, this.dimensionsPlayableDC, this.fadeOutPlayableDC];
    this._gantt.Animation = new dvt.ParallelPlayable(context, subPlayables, this._animationDuration, 0);
  }

  // If an animation was created, play it
  if (this._gantt.Animation)
  {
    // Instead of animating dep lines, hide them, animate other things, then show them again.
    // TODO: remove this and refine dependency lines animation instead.
    this._hideDepLines();
    dvt.Playable.appendOnEnd(this._gantt.Animation, this._showDepLines, this);

    // Disable event listeners temporarily
    this._gantt.EventManager.removeListeners(this._gantt);

    // Append callbacks to be executed at the end of animation
    for (var i = 0; i < this._onEnds.length; i++)
    {
      dvt.Playable.appendOnEnd(this._gantt.Animation, this._onEnds[i], this);
    }
    dvt.Playable.appendOnEnd(this._gantt.Animation, this._onAnimationEnd, this);

    // Play!
    this._gantt.Animation.play();
  }
};

/**
 * Hides dependency lines (called before animation)
 * @private
 */
DvtGanttAnimationManager.prototype._hideDepLines = function()
{
  var deplines = this._gantt.getDependencyLines();
  if (deplines != null)
    dvt.ToolkitUtils.setAttrNullNS(deplines.getElem(), 'display', 'none');
};

/**
 * Shows dependency lines (called after animation)
 * @private
 */
DvtGanttAnimationManager.prototype._showDepLines = function()
{
  var deplines = this._gantt.getDependencyLines();
  if (deplines != null)
    dvt.ToolkitUtils.removeAttrNullNS(deplines.getElem(), 'display');
};

/**
 * Hook for cleaning animation behavior at the end of the animation.
 * @private
 */
DvtGanttAnimationManager.prototype._onAnimationEnd = function()
{
  // Fire ready event saying animation is finished.
  if (!this._gantt.AnimationStopped)
    this._gantt.RenderComplete();

  // Restore event listeners
  this._gantt.EventManager.addListeners(this._gantt);

  // Reset animation flags
  this._gantt.Animation = null;
  this._gantt.AnimationStopped = false;

  this._animationMode = 'none';
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
DvtGanttAnimationManager.prototype.preAnimateGanttIR = function(gantt)
{
  if (this._animationMode === 'onDisplay')
  {
    // Fade in gantt on initial render
    this.fadeInElemsIR.push(gantt._canvas);
  }
};

/**
 * Prepares task node animation.
 * @param {DvtGanttTaskNode} taskNode
 * @param {object} finalStates Object defining the final animation state
 */
DvtGanttAnimationManager.prototype.preAnimateTaskNode = function(taskNode, finalStates)
{
  var translationsAnimator,
      renderState = taskNode.getRenderState();

  if (this._animationMode === 'dataChange')
  {
    if (renderState === 'add')
    {
      // Finalize render, then fade it in
      taskNode.setTranslate(finalStates['x'], finalStates['y']);
      this.fadeInElemsDC.push(taskNode);
    }
    else if (renderState === 'exist' || renderState === 'migrate')
    {
      // Translate, then finalize render at the end of animation
      translationsAnimator = this.translationsPlayableDC.getAnimator();
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, taskNode, taskNode.getTranslateX, taskNode.setTranslateX, finalStates['x']);
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, taskNode, taskNode.getTranslateY, taskNode.setTranslateY, finalStates['y']);
    }
  }
  else // No animation; finalize render immediately
  {
    taskNode.setTranslate(finalStates['x'], finalStates['y']);
  }
};

/**
 * Prepares task node animation.
 * @param {DvtGanttTaskNode} taskNode
 * @param {function} onEnd callback that finalizes rendering
 */
DvtGanttAnimationManager.prototype.preAnimateTaskNodeRemove = function(taskNode, onEnd)
{
  if (this._animationMode === 'dataChange')
  {
    // Fade out, then finalize render at the end of animation
    this.fadeOutElemsDC.push(taskNode);
    this._onEnds.push(onEnd);
  }
  else // No animation; just execute onEnd callback immediately to finalize render
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
DvtGanttAnimationManager.prototype.preAnimateTaskBaseline = function(task, baselineShape, finalStates, onEnd)
{
  var dimensionsAnimator, translationsAnimator,
      renderState = task.getRenderState('baseline');

  if (this._animationMode === 'onDisplay')
  {
    // Finalize render, start off the width to be 0, and grow the width dimension to its final width
    baselineShape.setDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
    onEnd();

    dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
    dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, baselineShape, baselineShape.getWidth, baselineShape.setWidth, finalStates['w']);
  }
  else if (this._animationMode === 'dataChange')
  {
    if (renderState === 'add')
    {
      // Finalize render, start off the width to be 0, and grow the width dimension to its final width
      baselineShape.setDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
      onEnd();

      dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
      dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, baselineShape, baselineShape.getWidth, baselineShape.setWidth, finalStates['w']);
    }
    else if (renderState === 'exist')
    {
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
  }
  else // No animation; finalize render immediately
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
DvtGanttAnimationManager.prototype.preAnimateTaskBaselineRemove = function(baselineShape, onEnd)
{
  if (this._animationMode === 'dataChange')
  {
    // Fade out element, finalize render at the end of animation
    this.fadeOutElemsDC.push(baselineShape);
    this._onEnds.push(onEnd);
  }
  else // No animation; just execute onEnd callback immediately to finalize render
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
DvtGanttAnimationManager.prototype.preAnimateTaskMain = function(task, finalStates, onEnd)
{
  var dimensionsAnimator, translationsAnimator,
      renderState = task.getRenderState('main');

  if (this._animationMode === 'onDisplay')
  {
    // Finalize render, start off the width to be 0, and grow the width dimension to its final width
    task.setMainDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
    onEnd();

    dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
    dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getMainWidth, task.setMainWidth, finalStates['w']);
  }
  else if (this._animationMode === 'dataChange')
  {
    if (renderState === 'add')
    {
      // Finalize render, start off the width to be 0, and grow the width dimension to its final width
      task.setMainDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
      onEnd();

      dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
      dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getMainWidth, task.setMainWidth, finalStates['w']);
    }
    else if (renderState === 'exist')
    {
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
  }
  else // No animation; finalize render immediately
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
DvtGanttAnimationManager.prototype.preAnimateTaskMainRemove = function(mainShape, selectShape, hoverShape, onEnd)
{
  if (this._animationMode === 'dataChange')
  {
    // Fade out elements related to the main shape, finalize render at the end of animation
    this.fadeOutElemsDC.push(mainShape);
    if (selectShape)
    {
      this.fadeOutElemsDC.push(selectShape);
    }
    if (hoverShape)
    {
      this.fadeOutElemsDC.push(hoverShape);
    }
    this._onEnds.push(onEnd);
  }
  else // No animation; just execute onEnd callback immediately to finalize render
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
DvtGanttAnimationManager.prototype.preAnimateTaskProgress = function(task, progressShape, finalStates, onEnd)
{
  var dimensionsAnimator, translationsAnimator,
      renderState = task.getRenderState('progress');

  if (this._animationMode === 'onDisplay')
  {
    // Finalize render, start off the width to be 0, and grow the width dimension to its final width
    progressShape.setDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
    onEnd();

    dimensionsAnimator = this.dimensionsPlayableIR.getAnimator();
    dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, progressShape, progressShape.getWidth, progressShape.setWidth, finalStates['w']);
  }
  else if (this._animationMode === 'dataChange')
  {
    if (renderState === 'add')
    {
      // Finalize render, start off the width to be 0, and grow the width dimension to its final width
      progressShape.setDimensions(finalStates['x'], finalStates['y'], 0, finalStates['h'], finalStates['r']);
      onEnd();

      dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
      dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, progressShape, progressShape.getWidth, progressShape.setWidth, finalStates['w']);
    }
    else if (renderState === 'exist')
    {
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
  }
  else // No animation; finalize render immediately
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
DvtGanttAnimationManager.prototype.preAnimateTaskProgressRemove = function(progressShape, onEnd)
{
  if (this._animationMode === 'dataChange')
  {
    // Fade out element, finalize render at the end of animation
    this.fadeOutElemsDC.push(progressShape);
    this._onEnds.push(onEnd);
  }
  else // No animation; just execute onEnd callback immediately to finalize render
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
DvtGanttAnimationManager.prototype.preAnimateTaskLabel = function(taskNode, finalStates, onEnd)
{
  var translationsAnimator,
      task = taskNode.getTask(),
      taskLabel = taskNode.getTaskLabel(),
      labelOutputText = taskLabel.getLabelOutputText(),
      renderState = taskLabel.getRenderState(),
      taskMainRenderState = task.getRenderState('main');

  if (this._animationMode === 'onDisplay')
  {
    // Finalize render, start off the label x to match main task shape's x (should be at 0 width at this point), animate translation
    onEnd();
    labelOutputText.setY(finalStates['y']);
    labelOutputText.setX(task.getShape('main').getX());
    translationsAnimator = this.translationsPlayableIR.getAnimator();
    translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getX, labelOutputText.setX, finalStates['x']);
    translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getY, labelOutputText.setY, finalStates['y']);
  }
  else if (this._animationMode === 'dataChange')
  {
    if (renderState === 'add')
    {
      // Finalize render
      labelOutputText.setX(finalStates['x']);
      labelOutputText.setY(finalStates['y']);
      onEnd();

      if (taskMainRenderState === 'add')
      {
        // Start off the label x to match main task shape's x (should be at 0 width at this point), animate translation
        labelOutputText.setX(task.getShape('main').getX());
        translationsAnimator = this.translationsPlayableDC.getAnimator();
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getX, labelOutputText.setX, finalStates['x']);
        translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getY, labelOutputText.setY, finalStates['y']);
      }
      else if (taskMainRenderState === 'exist')
      {
        // Fade in
        this.fadeInElemsDC.push(labelOutputText);
      }
    }
    else if (renderState === 'exist')
    {
      // Translate animation
      translationsAnimator = this.translationsPlayableDC.getAnimator();
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getX, labelOutputText.setX, finalStates['x']);
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelOutputText, labelOutputText.getY, labelOutputText.setY, finalStates['y']);
      this._onEnds.push(onEnd);
    }
  }
  else // No animation; just execute onEnd callback immediately to finalize render
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
DvtGanttAnimationManager.prototype.preAnimateTaskLabelRemove = function(labelOutputText, onEnd)
{
  if (this._animationMode === 'dataChange')
  {
    // Fade out, finalize render at the end of animation
    this.fadeOutElemsDC.push(labelOutputText);
    this._onEnds.push(onEnd);
  }
  else // No animation; just execute onEnd callback immediately to finalize render
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
DvtGanttAnimationManager.prototype.preAnimateHorizontalGridline = function(line, finalStates, renderState)
{
  var translationsAnimator;

  if (this._animationMode === 'dataChange')
  {
    if (renderState === 'add')
    {
      // Finalize render, then fade it in
      line.setY1(finalStates['y1']);
      line.setY2(finalStates['y2']);
      line.setX1(finalStates['x1']);
      line.setX2(finalStates['x2']);

      this.fadeInElemsDC.push(line);
    }
    else if (renderState === 'exist')
    {
      // Translation animation
      translationsAnimator = this.translationsPlayableDC.getAnimator();
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, line, line.getX1, line.setX1, finalStates['x1']);
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, line, line.getX2, line.setX2, finalStates['x2']);
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, line, line.getY1, line.setY1, finalStates['y1']);
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, line, line.getY2, line.setY2, finalStates['y2']);
    }
  }
  else // No animation; finalize render immediately
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
 */
DvtGanttAnimationManager.prototype.preAnimateRowBackground = function(background, finalStates)
{
  var dimensionsAnimator, translationsAnimator;

  if (this._animationMode === 'dataChange')
  {
    // Animate dimension and translation changes
    dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
    dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, background, background.getHeight, background.setHeight, finalStates['h']);
    dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, background, background.getWidth, background.setWidth, finalStates['w']);

    translationsAnimator = this.translationsPlayableDC.getAnimator();
    translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, background, background.getY, background.setY, finalStates['y']);
  }
  else // No animation; finalize render immediately
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
DvtGanttAnimationManager.prototype.preAnimateRowNodeRemove = function(rowNode, onEnd)
{
  if (this._animationMode === 'dataChange')
  {
    // Fade out, finalize rendering at the end
    this.fadeOutElemsDC.push(rowNode);
    this._onEnds.push(onEnd);
  }
  else // No animation; just execute onEnd callback immediately to finalize render
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
DvtGanttAnimationManager.prototype.preAnimateRowLabel = function(rowNode, labelContent, finalStates)
{
  var rowRenderState = rowNode.getRenderState(),
      translationsAnimator;

  if (this._animationMode === 'dataChange')
  {
    if (rowRenderState === 'add')
    {
      // Finalize render, then fade in
      labelContent.setY(finalStates['y']);
      labelContent.setX(finalStates['x']);

      this.fadeInElemsDC.push(labelContent.getDisplayable());
    }
    else if (rowRenderState === 'exist')
    {
      // Translation animation
      translationsAnimator = this.translationsPlayableDC.getAnimator();
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelContent, labelContent.getX, labelContent.setX, finalStates['x']);
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelContent, labelContent.getY, labelContent.setY, finalStates['y']);
    }
  }
  else // No animation; finalize render immediately
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
DvtGanttAnimationManager.prototype.preAnimateRowLabelRemove = function(labelContent, onEnd)
{
  if (this._animationMode === 'dataChange')
  {
    // Fade out, then finalize render
    this.fadeOutElemsDC.push(labelContent.getDisplayable());
    this._onEnds.push(onEnd);
  }
  else // No animation; just execute onEnd callback immediately to finalize render
  {
    onEnd();
  }
};

/**
 * Gantt component.  The component should never be instantiated directly.  Use the newInstance function instead
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @class
 * @constructor
 * @extends {dvt.TimeComponent}
 */
dvt.Gantt = function(context, callback, callbackObj) 
{
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
dvt.Gantt.newInstance = function(context, callback, callbackObj) 
{
  return new dvt.Gantt(context, callback, callbackObj);
};

/**
 * Initializes the component.
 * @param {dvt.Context} context The rendering context.
 * @param {function} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @protected
 */
dvt.Gantt.prototype.Init = function(context, callback, callbackObj) 
{
  this._isInitialRender = true;
  dvt.Gantt.superclass.Init.call(this, context, callback, callbackObj);

  // Create the defaults object
  this.Defaults = new DvtGanttDefaults();

  // Create the event handler and add event listeners
  this.EventManager = new DvtGanttEventManager(this, context, callback, callbackObj);
  this.EventManager.addListeners(this);
  if (!dvt.Agent.isTouchDevice())
  {
    this._keyboardHandler = new DvtGanttKeyboardHandler(this, this.EventManager);
    this.EventManager.setKeyboardHandler(this._keyboardHandler);
  }
  else
    this._keyboardHandler = null;
};

/**
 * @override
 */
dvt.Gantt.prototype.SetOptions = function(options) 
{
  // As of 5.0.0 default values are introduced. Some defaults are null, but dvt.JsonUtils.merge() assumes null values are intentional.
  // Explicitly set null values to undefined so that merging with our internal defaults work properly:
  if (options['taskDefaults'] == null)
    options['taskDefaults'] = {'baseline': {}};
  if (options['taskDefaults']['baseline'] == null)
    options['taskDefaults']['baseline'] = {};
  options['taskDefaults']['height'] = options['taskDefaults']['height'] == null ? undefined : options['taskDefaults']['height'];
  options['taskDefaults']['baseline']['height'] = options['taskDefaults']['baseline']['height'] == null ? undefined : options['taskDefaults']['baseline']['height'];
  
  dvt.Gantt.superclass.SetOptions.call(this, options);

  //initial setup
  this.setSelectionMode(this.Options['selectionMode']);

  // If high level DnD api specified, set the equivalent low level DnD configuration.
  var dnd = this.Options['dnd'];
  if (dnd)
  {
    var lowLevelDnD = {'drag': {}, 'drop': {}};
    var dndMoveEnabled = dnd['move'] && dnd['move']['tasks'] === 'enabled';
    if (dndMoveEnabled)
    {
      lowLevelDnD['drag']['tasks'] = {'dataTypes': []};
      lowLevelDnD['drop']['rows'] = {'dataTypes': []};
    }

    this.Options['dnd'] = dvt.JsonUtils.merge(dnd, lowLevelDnD);

    // High level dnd.move enabled is equivalent to enabling tasks as drag sources and rows as drop targets
    // Current design, high level move drop target is always the underlying row, even if the actual target is e.g. a task (enforced by event manager methods)
    if (dndMoveEnabled)
    {
      var dragTasksDataTypes = this.Options['dnd']['drag']['tasks']['dataTypes'];
      if (!dvt.ArrayUtils.isArray(dragTasksDataTypes))
      {
        this.Options['dnd']['drag']['tasks']['dataTypes'] = [dragTasksDataTypes];
        dragTasksDataTypes = this.Options['dnd']['drag']['tasks']['dataTypes'];
      }
      dragTasksDataTypes.push(DvtGanttEventManager.MOVE_TASKS_DATA_TYPE);

      var dropRowsDataTypes = this.Options['dnd']['drop']['rows']['dataTypes'];
      if (!dvt.ArrayUtils.isArray(dropRowsDataTypes))
      {
        this.Options['dnd']['drop']['rows']['dataTypes'] = [dropRowsDataTypes];
        dropRowsDataTypes = this.Options['dnd']['drop']['rows']['dataTypes'];
      }
      dropRowsDataTypes.push(DvtGanttEventManager.MOVE_TASKS_DATA_TYPE);
    }
  }
};

/**
 * @return {DvtGanttAutomation} the automation object
 */
dvt.Gantt.prototype.getAutomation = function() 
{
  if (!this.Automation)
    this.Automation = new DvtGanttAutomation(this);
  return this.Automation;
};

/**
 * Retrieves style class based on key (ex: 'oj-gantt-horizontal-gridline')
 * @param {string} key
 * @return {string} the style class for the specified key
 * @protected
 */
dvt.Gantt.prototype.GetStyleClass = function(key)
{
  var context = this.getCtx();
  var styleClasses = context['styleClasses'];
  // TODO: in PhantomJS tests this is not populated
  if (styleClasses != null)
    return styleClasses[key];
  else
    return key;
};

/**
 * Creates component specific parser and parses the options.
 * @param {object} options The options object
 * @return {object} the parsed object
 * @protected
 */
dvt.Gantt.prototype.Parse = function(options)
{
  this._parser = new DvtGanttParser();
  return this._parser.parse(options);
};

/**
 * Parsed the options
 * @param {object} props property bag of options
 * @private
 */
dvt.Gantt.prototype._applyParsedProperties = function(props)
{
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
dvt.Gantt.prototype._bundleTimeAxisOptions = function(options, axis)
{
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

  if (options[axis])
  {
    var axisOptions = options[axis];
    if (axisOptions['scale'])
      retOptions['scale'] = axisOptions['scale'];
    if (axisOptions['converter'])
      retOptions['converter'] = axisOptions['converter'];
    if (axisOptions['zoomOrder'])
      retOptions['zoomOrder'] = axisOptions['zoomOrder'];
  }

  var labelStyle;
  if (axis == 'majorAxis')
    labelStyle = DvtGanttStyleUtils.getMajorAxisLabelStyle(options);
  else if (axis == 'minorAxis')
    labelStyle = DvtGanttStyleUtils.getMinorAxisLabelStyle(options);
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
dvt.Gantt.prototype._getPreferredSize = function(width, height) 
{
  return new dvt.Dimension(width, height);
};

/**
 * Render the component
 * @param {object} list of options
 * @param {number} width the width of the component
 * @param {number} height the height of the component
 * @override
 */
dvt.Gantt.prototype.render = function(options, width, height) 
{
  // Reset cache
  this.getCache().clearCache();

  // ensure options is updated
  if (options)
    this.SetOptions(options);
  else
  {
    this._handleResize(width, height);
    return;
  }
  dvt.Gantt.superclass.render.call(this, options, width, height);

  // Render an aria live region for accessibility during DnD
  if (this.isDndEnabled())
  {
    this.renderAriaLiveRegion();
  }
  else
  {
    this.removeAriaLiveRegion();
  }

  DvtGanttRenderer.renderRowAxis(this, this.getParent());

  var axisPosition = this.getAxisPosition();

  var minor = options['minorAxis'];
  if (minor)
  {
    var axisOptions = this._bundleTimeAxisOptions(this.Options, 'minorAxis');

    if (this._minorAxis == null)
    {
      this._minorAxis = new dvt.TimeAxis(this.getCtx(), null, null);
      if (axisPosition == 'top')
        this._minorAxis.setBorderVisibility(false, false, true, false);
      else
        this._minorAxis.setBorderVisibility(true, false, false, false);
      this._masterAxis = this._minorAxis;
    }

    // TimeComponent's TimeAxis._canvasSize should always be null on initial render
    this._minorAxis.setCanvasSize(null);
    var preferredLength = this._minorAxis.getPreferredLength(axisOptions, this._canvasLength);
  }

  var major = options['majorAxis'];
  if (major)
  {
    if (major['scale'])
    {
      axisOptions = this._bundleTimeAxisOptions(this.Options, 'majorAxis');

      if (this._majorAxis == null)
      {
        this._majorAxis = new dvt.TimeAxis(this.getCtx(), null, null);
        if (axisPosition == 'top')
          this._majorAxis.setBorderVisibility(false, false, true, false);
        else
          this._majorAxis.setBorderVisibility(true, false, false, false);
        this._slaveAxis = this._majorAxis;
      }

      // TimeComponent's TimeAxis._canvasSize should always be null on initial render
      this._majorAxis.setCanvasSize(null);
      var majorPreferredLength = this._majorAxis.getPreferredLength(axisOptions, this._canvasLength);

      if (preferredLength && majorPreferredLength > preferredLength)
      {
        this._masterAxis = this._majorAxis;
        this._slaveAxis = this._minorAxis;
        preferredLength = majorPreferredLength;
      }
    }
    else // if there WAS a major axis, but rerender WITHOUT major axis, make sure to set it to null
      this._majorAxis = null;
  }

  if (preferredLength)
    this.setContentLength(preferredLength);

  // Minor axis is required, and preparing viewport length depends on it having valid options
  // Major axis options checking happens later in hasValidOptions()
  if (this._minorAxis && this._minorAxis.hasValidOptions())
    this.prepareViewportLength();

  this._animationManager = new DvtGanttAnimationManager(this);
  this._animationManager.prepareForAnimations();

  DvtGanttRenderer.renderGantt(this);

  this._animationManager.triggerAnimations();

  this.UpdateAriaAttributes();

  if (!this.Animation)
    // If not animating, that means we're done rendering, so fire the ready event.
    this.RenderComplete();

  this._isInitialRender = false;
};

/**
 * Gets the animation manager.
 * @return {DvtGanttAnimationManager} the animation manager
 */
dvt.Gantt.prototype.getAnimationManager = function()
{
  return this._animationManager;
};

/**
 * Whether this is initial render.
 * @return {boolean} whether this is initial render.
 */
dvt.Gantt.prototype.isInitialRender = function()
{
  return this._isInitialRender;
};

/**
 * Whether drag and drop is enabled on the component.
 * @return {boolean} whether drag and drop is enabled
 */
dvt.Gantt.prototype.isDndEnabled = function()
{
  return this.getEventManager().isDndSupported() && this.getOptions()['dnd'];
};

/**
 * Renders an aria live region for the component, if one doesn't exist already
 */
dvt.Gantt.prototype.renderAriaLiveRegion = function()
{
  // Construct a visually hidden aria live region for accessibility
  // TODO consider moving to the dvt context level so that other DVTs can use
  if (!this._ariaLiveRegion)
  {
    var context = this.getCtx();
    this._ariaLiveRegion = document.createElement('div');
    this._ariaLiveRegion.id = '_dvtGanttAriaLiveRegion' + context.getStage().getId();
    this._ariaLiveRegion.setAttribute('aria-live', 'assertive');
    // Visually hide the live region, but still make available for screen readers:
    // styling derived from https://developer.paciellogroup.com/blog/2012/05/html5-accessibility-chops-hidden-and-aria-hidden/
    this._ariaLiveRegion.setAttribute('style', 'clip: rect(1px, 1px, 1px, 1px); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px;');
    context.getContainer().appendChild(this._ariaLiveRegion);
  }
};

/**
 * Gets the component's aria live region.
 * @return {Element} The aria live region element.
 */
dvt.Gantt.prototype.getAriaLiveRegion = function()
{
  return this._ariaLiveRegion;
};

/**
 * Updates the aria live region's text. If the live region doesn't exist, nothing happens.
 * @param {string} text The text to update the aria live region with.
 */
dvt.Gantt.prototype.updateLiveRegionText = function(text)
{
  if (this._ariaLiveRegion)
  {
    this._ariaLiveRegion.textContent = text;
  }
};

/**
 * Removes the component's aria live region, if one exists.
 */
dvt.Gantt.prototype.removeAriaLiveRegion = function()
{
  if (this._ariaLiveRegion)
  {
    context.getContainer().removeChild(this._ariaLiveRegion);
    this._ariaLiveRegion = null;
  }
};

/**
 * Adjusts viewport based on scrollbar event.
 * @param {object} event
 * @param {object} component The component that is the source of the event, if available.
 */
dvt.Gantt.prototype.processScrollbarEvent = function(event, component)
{
  dvt.Gantt.superclass.processScrollbarEvent.call(this, event, component);
  if (component == this.contentDirScrollbar)
  {
    var newMax = event.getNewMax();
    this._databody.setTranslateY(newMax);
    if (this.isRowAxisEnabled())
      this.getRowAxis().setTranslateY(newMax);
    if (this._deplines != null)
      this._deplines.setTranslateY(newMax);
  }
};

/**
 * Creates a viewportChange event object
 * @return {object} the viewportChange event object
 * @override
 */
dvt.Gantt.prototype.createViewportChangeEvent = function()
{
  return dvt.EventFactory.newGanttViewportChangeEvent(this._viewStartTime, this._viewEndTime, this._slaveAxis ? this._slaveAxis.getScale() : null, this.getTimeAxis().getScale());
};

/**
 * Handles rerender on resize.
 * @param {number} width The new width
 * @param {number} height The new height
 * @private
 */
dvt.Gantt.prototype._handleResize = function(width, height)
{
  this.Width = width;
  this.Height = height;

  this.applyStyleValues();

  var hasValidOptions = this.hasValidOptions();
  if (hasValidOptions)
  {
    DvtGanttRenderer.renderRowAxis(this);
  }

  this.prepareViewportLength();

  DvtGanttRenderer._renderBackground(this);

  if (hasValidOptions)
  {
    this.renderTimeZoomCanvas(this._canvas);

    if (this.isRowAxisEnabled())
      this.getRowAxis().adjustPosition();

    this.updateRows();

    DvtGanttRenderer._renderDependencies(this);

    var timeZoomCanvas = this.getTimeZoomCanvas();
    DvtGanttRenderer._renderAxes(this, timeZoomCanvas);
    DvtGanttRenderer._renderDatabodyBackground(this);
    DvtGanttRenderer._renderVerticalGridline(this, timeZoomCanvas);
    DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas);

    DvtGanttRenderer._renderZoomControls(this);

    if (this.isDndEnabled())
      DvtGanttRenderer._renderDnDArtifactsContainer(this, timeZoomCanvas);

    if (this.isTimeDirScrollbarOn() || this.isContentDirScrollbarOn())
      DvtGanttRenderer._renderScrollbars(this, this);
  }
  else
    DvtGanttRenderer._renderEmptyText(this);

  if (!this.Animation)
    // If not animating, that means we're done rendering, so fire the ready event.
    this.RenderComplete();
};

/**
 * Combines style defaults with the styles provided
 */
dvt.Gantt.prototype.applyStyleValues = function()
{
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
    this._backgroundHeight = this._backgroundHeight - dvt.CSSStyle.toNumber(this.timeDirScrollbarStyles.getHeight()) - 3 * scrollbarPadding;
  if (this.isContentDirScrollbarOn())
  {
    var widthOffset = 3 * scrollbarPadding;
    this._backgroundWidth = this._backgroundWidth - dvt.CSSStyle.toNumber(this.contentDirScrollbarStyles.getWidth()) - widthOffset;
    if (isRTL)
      this._widthOffset = widthOffset - this._borderWidth;
  }

  this.setStartXOffset(this._widthOffset + this._borderWidth);
  this.setStartYOffset(this._borderWidth);

  // The size of the canvas viewport
  this._canvasLength = this._backgroundWidth - doubleBorderWidth;
  this._canvasSize = this._backgroundHeight - doubleBorderWidth;
};

/**
 * Updates each row due to component resize
 */
dvt.Gantt.prototype.updateRows = function()
{
  var rows = this._rows;
  if (rows != null && rows.length > 0)
  {
    // Cache the base task label style dvt.CSSStyle object; it's expensive to instantiate one
    // each time we render a task label.
    this.getCache().putToCache('baseTaskLabelCSSStyle', DvtGanttStyleUtils.getTaskLabelStyle(this.Options));

    // update databody
    DvtGanttRenderer._renderDatabody(this);

    // update the tasks on each row
    for (var i = 0; i < rows.length; i++)
    {
      rows[i].render(this.getDatabody());
    }
  }
  else
  {
    DvtGanttRenderer._renderEmptyText(this, true);
  }
};

/**
 * Handles mouse wheel event.
 * @param {event} event The mouse wheel event
 * @protected
 * @override
 */
dvt.Gantt.prototype.HandleMouseWheel = function(event)
{
  dvt.Gantt.superclass.HandleMouseWheel.call(this, event);
  if (this.hasValidOptions())
  {
    // ctrl key pressed and not touch device; check if should scroll
    if (event && !event.ctrlKey && !dvt.Agent.isTouchDevice())
    {
      var wheelDeltaY = event.wheelDelta ? event.wheelDelta * dvt.TimeComponent.SCROLL_LINE_HEIGHT : 0;
      var wheelDeltaX = event.wheelDeltaX ? event.wheelDeltaX * dvt.TimeComponent.SCROLL_LINE_HEIGHT : 0;
      this.panBy(-wheelDeltaX, -wheelDeltaY);

      // panning horizontally changes the viewport, and panBy doesn't trigger anything
      // Follows timeline's behavior where viewportChange event is fired at every x delta of overview scrolling
      // TODO: consider changing Timeline and Gantt to follow Chart's convention of firing viewportChange events only at the end of the interaction
      if (event.wheelDeltaX)
      {
        var evt = this.createViewportChangeEvent();
        this.dispatchEvent(evt);
      }
    }
    else // ctrl key pressed or touch device; check if should zoom
    {
      if (event.zoomWheelDelta)
      {
        // only zoom if mouse inside chart/graphical area
        var relPos = this.getCtx().pageToStageCoords(event.pageX, event.pageY);
        if (this.getGraphicalAreaBounds().containsPoint(relPos.x, relPos.y))
        {
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
dvt.Gantt.prototype.handleZoomWheel = function(newLength, time, compLoc, triggerViewportChangeEvent)
{
  if (newLength > this._masterAxis.getMaxContentLength())
  {
    newLength = this._masterAxis.getMaxContentLength();
    this.disableZoomButton(true);
  }
  else
    this.enableZoomButton(true);
  if (this._canvasLength > newLength)
  {
    newLength = this._canvasLength;
    this.disableZoomButton(false);
  }
  else
    this.enableZoomButton(false);
  var zoomIn = this.getContentLength() <= newLength;
  dvt.Gantt.superclass.handleZoomWheel.call(this, newLength, time, compLoc, triggerViewportChangeEvent);

  var zoomLevelLengths = this._masterAxis.getZoomLevelLengths();
  if (zoomIn)
  {
    while (this._masterAxis.getZoomLevelOrder() > 0 && (this._slaveAxis ? this._slaveAxis.getZoomLevelOrder() > 0 : true))
    {
      var minLength = zoomLevelLengths[this._masterAxis.getZoomLevelOrder() - 1];
      if (this.getContentLength() >= minLength)
      {
        this._masterAxis.setZoomLevelOrder(this._masterAxis.getZoomLevelOrder() - 1);
        this._masterAxis.decreaseScale();

        if (this._slaveAxis)
        {
          this._slaveAxis.setZoomLevelOrder(this._slaveAxis.getZoomLevelOrder() - 1);
          this._slaveAxis.decreaseScale();
        }
      }
      else
        break;
    }
  }
  else
  {
    while (this._masterAxis.getZoomLevelOrder() < zoomLevelLengths.length - 1 && (this._slaveAxis ? this._slaveAxis.getZoomLevelOrder() < this._slaveAxis.getZoomLevelLengths().length - 1 : true))
    {
      minLength = zoomLevelLengths[this._masterAxis.getZoomLevelOrder()];
      if (this.getContentLength() < minLength)
      {
        this._masterAxis.setZoomLevelOrder(this._masterAxis.getZoomLevelOrder() + 1);
        this._masterAxis.increaseScale();

        if (this._slaveAxis)
        {
          this._slaveAxis.setZoomLevelOrder(this._slaveAxis.getZoomLevelOrder() + 1);
          this._slaveAxis.increaseScale();
        }
      }
      else
        break;
    }
  }

  if (this.isTimeDirScrollbarOn() && this.timeDirScrollbar)
    this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);

  var timeZoomCanvas = this.getTimeZoomCanvas();
  DvtGanttRenderer._renderAxes(this, timeZoomCanvas);
  this.updateRows();
  DvtGanttRenderer._renderDatabodyBackground(this);
  DvtGanttRenderer._renderDependencies(this);
  DvtGanttRenderer._renderVerticalGridline(this, timeZoomCanvas);
  DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas);
  if (this.isDndEnabled())
      DvtGanttRenderer._renderDnDArtifactsContainer(this, timeZoomCanvas);

  if (triggerViewportChangeEvent)
  {
    var evt = this.createViewportChangeEvent();
    this.dispatchEvent(evt);
  }
};

/**
 * Retrieve the minor axis. If one is not specified, use the major axis.
 * @return {dvt.TimeAxis} the minor axis
 */
dvt.Gantt.prototype.getMajorAxis = function()
{
  return this._majorAxis;
};

/**
 * Retrieve the minor axis. If one is not specified, use the major axis.
 * @return {dvt.TimeAxis} the minor axis
 */
dvt.Gantt.prototype.getMinorAxis = function()
{
  return this._minorAxis;
};

/**
 * Retrieve the minor axis. If one is not specified, use the major axis.
 * @return {dvt.TimeAxis} the minor axis
 * @override
 */
dvt.Gantt.prototype.getTimeAxis = function()
{
  if (this._minorAxis)
    return this._minorAxis;
  else
    return this._majorAxis;
};

/**
 * Retrieve the databody
 * @return {dvt.Container} the databody
 */
dvt.Gantt.prototype.getDatabody = function()
{
  return this._databody;
};

/**
 * Sets the databody
 * @param {dvt.Container} databody the databody
 */
dvt.Gantt.prototype.setDatabody = function(databody)
{
  this._databody = databody;
};

/**
 * Retrieve the databody background (container for row backgrounds).
 * @return {dvt.Container} the databody background container.
 */
dvt.Gantt.prototype.getDatabodyBackground = function()
{
  return this._databodyBackground;
};

/**
 * Sets the databody background (container for row backgrounds).
 * @param {dvt.Container} databodyBackground The databody background container.
 */
dvt.Gantt.prototype.setDatabodyBackground = function(databodyBackground)
{
  this._databodyBackground = databodyBackground;
};

/**
 * Gets the pixel location where the databody starts
 * @return {number} the pixel location where the databody starts
 */
dvt.Gantt.prototype.getDatabodyStart = function()
{
  return this._databodyStart;
};

/**
 * Sets the pixel location where the databody starts
 * @param {number} databodyStart the pixel location where the databody starts
 */
dvt.Gantt.prototype.setDatabodyStart = function(databodyStart)
{
  this._databodyStart = databodyStart;
};

/**
 * Gets the databody height
 * @return {number} the databody height
 */
dvt.Gantt.prototype.getDatabodyHeight = function()
{
  return this.getCanvasSize() - this.getAxesHeight();
};

/**
 * Retrieve the container for vertical gridlines
 * @return {dvt.Container} the container for vertical gridlines
 */
dvt.Gantt.prototype.getVerticalGridlines = function()
{
  return this._gridlines;
};

/**
 * Sets the container for vertical gridlines
 * @param {dvt.Container} gridlines the container for vertical gridlines
 */
dvt.Gantt.prototype.setVerticalGridlines = function(gridlines)
{
  this._gridlines = gridlines;
};

/**
 * Retrieve the reference objects array
 * @return {Array.<object>} the reference objects array
 */
dvt.Gantt.prototype.getReferenceObjects = function()
{
  return this._referenceObjects;
};

/**
 * Retrieve the container for reference objects
 * @return {dvt.Container} the container for reference objects
 */
dvt.Gantt.prototype.getReferenceObjectsContainer = function()
{
  return this._refObjectsContainer;
};

/**
 * Sets the container for reference objects
 * @param {dvt.Container} container the container for reference objects
 */
dvt.Gantt.prototype.setReferenceObjectsContainer = function(container)
{
  this._refObjectsContainer = container;
};

/**
 * Retrieve the array of rendered reference objects
 * @return {Array.<dvt.Line>} the array of rendered reference objects
 */
dvt.Gantt.prototype.getRenderedReferenceObjects = function()
{
  return this._renderedReferenceObjects;
};

/**
 * Sets the array of rendered reference objects
 * @param {Array.<dvt.Line>} renderedReferenceObjects the array of rendered reference objects
 */
dvt.Gantt.prototype.setRenderedReferenceObjects = function(renderedReferenceObjects)
{
  this._renderedReferenceObjects = renderedReferenceObjects;
};

/**
 * Gets the container for DnD artifacts (affordances and drag feedback).
 * @return {dvt.Container} container for DnD artifacts.
 */
dvt.Gantt.prototype.getDnDArtifactsContainer = function()
{
  return this._dndArtifactsContainer;
};

/** 
 * Sets the container for DnD artifacts. This container should be layered on top of all chart area elements.
 * @param {dvt.Container} container. The container for DnD artifacts.
 */
dvt.Gantt.prototype.setDnDArtifactsContainer = function(container)
{
  this._dndArtifactsContainer = container;
};

/**
 * Sets the empty text.
 * @param {dvt.OutputText} text The new text.
 */
dvt.Gantt.prototype.setEmptyText = function(text)
{
  this._emptyText = text;
};

/**
 * Removes empty text.
 */
dvt.Gantt.prototype.removeEmptyText = function()
{
  if (this._emptyText && this._emptyText.getParent())
  {
    this._emptyText.getParent().removeChild(this._emptyText);
    delete this._emptyText;
    this._emptyText = null;
  }
};

/**
 * Gets the rows options object
 * @return {object} the rows options object
 */
dvt.Gantt.prototype.getRowsData = function()
{
  return this._rowsData;
};

/**
 * Gets the rows node
 * @return {Array} an array of DvtGanttRowNode
 */
dvt.Gantt.prototype.getRows = function()
{
  return this._rows;
};

/**
 * Sets the rows node
 * @param {Array} rows an array of DvtGanttRowNode
 */
dvt.Gantt.prototype.setRows = function(rows)
{
  this._rows = rows;
};

/**
 * Gets the current row id
 * @return {string} the id of the current row
 */
dvt.Gantt.prototype.getCurrentRow = function()
{
  return this._currentRow;
};

/**
 * Sets the current row id
 * @param {string} currentRow the id of the current row
 */
dvt.Gantt.prototype.setCurrentRow = function(currentRow)
{
  this._currentRow = currentRow;
};

/**
 * Gets the axis position
 * @return {string} the axis position
 */
dvt.Gantt.prototype.getAxisPosition = function()
{
  return this._axisPosition;
};

/**
 * Gets the axis height
 * @return {number} the axis height
 */
dvt.Gantt.prototype.getAxisHeight = function()
{
  return DvtGanttStyleUtils.getTimeAxisHeight();
};

/**
 * Gets the start time of the Gantt
 * @return {number} the start time in milliseconds
 */
dvt.Gantt.prototype.getStartTime = function()
{
  return this._start;
};

/**
 * Gets the end time of the Gantt
 * @return {number} the end time in milliseconds
 */
dvt.Gantt.prototype.getEndTime = function()
{
  return this._end;
};

/**
 * NOT expose for now (until we have dependency lines)
 * Gets the hover behavior
 * @return {string} the hover behavior, either 'dim' or 'none'
 */
dvt.Gantt.prototype.getHoverBehavior = function()
{
  return 'none';
};

/**
 * Gets whether horizontal gridlines are visible
 * @return {boolean} true if horizontal gridlines are visible, false otherwise
 */
dvt.Gantt.prototype.isHorizontalGridlinesVisible = function()
{
  return (this._horizontalGridline == 'visible');
};

/**
 * Gets whether vertical gridlines are visible
 * @return {boolean} true if vertical gridlines are visible, false otherwise
 */
dvt.Gantt.prototype.isVerticalGridlinesVisible = function()
{
  return (this._verticalGridline == 'visible');
};

/**
 * Gets the height of the entire Gantt content
 * @return {number} height the height of the entire Gantt including all rows.
 */
dvt.Gantt.prototype.getContentHeight = function()
{
  return this._contentHeight;
};

/**
 * Sets the height of the entire Gantt content
 * @param {number} height the height of the entire Gantt including all rows.
 */
dvt.Gantt.prototype.setContentHeight = function(height)
{
  this._contentHeight = height;
};

/**
 * Retrieves the total height of the time axes.
 * @return {number} the height of the time axes
 */
dvt.Gantt.prototype.getAxesHeight = function()
{
  if (this._axesHeight == null)
  {
    var axesHeight = 0;
    if (this._majorAxis)
      axesHeight = axesHeight + this._majorAxis.getSize();
    if (this._minorAxis)
      axesHeight = axesHeight + this._minorAxis.getSize();

    this._axesHeight = axesHeight;
  }

  return this._axesHeight;
};

/**
 * Gets whether the row axis should be rendered/visible.
 * @return {boolean} true if should be rendered, false otherwise
 */
dvt.Gantt.prototype.isRowAxisEnabled = function()
{
  return this._rowAxisRendered == 'on';
};

/**
 * Gets the row axis width.
 * @return {string} the width of the axis in pixels (e.g. '50px') or percent (e.g. '15%'')
 */
dvt.Gantt.prototype.getRowAxisWidth = function()
{
  return this._rowAxisWidth;
};

/**
 * Gets the row axis max width.
 * @return {string} the maximum width of the axis in pixels (e.g. '50px') or percent (e.g. '15%'')
 */
dvt.Gantt.prototype.getRowAxisMaxWidth = function()
{
  return this._rowAxisMaxWidth;
};

/**
 * Gets the row axis object.
 * @return {DvtGanttRowAxis} The row axis object.
 */
dvt.Gantt.prototype.getRowAxis = function()
{
  return this._rowAxis;
};

/**
 * Sets the row axis object.
 * @param {DvtGanttRowAxis} rowAxis The row axis object.
 */
dvt.Gantt.prototype.setRowAxis = function(rowAxis)
{
  this._rowAxis = rowAxis;
};

/**
 * Gets the current viewport bounding box in the reference coord system of the databody
 * @return {dvt.Rectangle} the current bounding box of the viewport
 */
dvt.Gantt.prototype.getViewportDimensions = function()
{
  return new dvt.Rectangle(this.getStartXOffset() - this.getTimeZoomCanvas().getTranslateX(), this._databodyStart - this._databody.getTranslateY(), this._canvasLength, this._canvasSize - this.getAxesHeight());
};

/**
 * Scroll a region into view
 * @param {dvt.Rectangle} region The bounding rectangle (assumed to be in the reference coord system of the databody) to scroll into view
 * @param {string=} xPriority The side in the x direction to prioritize scroll into view, one of 'start', 'end', or 'auto'. Default 'auto'.
 * @param {string=} yPriority The side in the y direction to prioritize scroll into view, one of 'top', 'bottom', or 'auto'. Default 'auto'.
 * @param {number=} overShoot The extra amount of space to pan by. Default 0.
 */
dvt.Gantt.prototype.scrollIntoView = function(region, xPriority, yPriority, overShoot)
{
  var isRTL = dvt.Agent.isRightToLeft(this.getCtx()),
      viewportRect = this.getViewportDimensions(),
      deltaX = 0, deltaY = 0;

  xPriority = xPriority || 'auto';
  yPriority = yPriority || 'auto';
  overShoot = overShoot || 0;

  var deltaXLeftVisible = Math.min(region.x - viewportRect.x - overShoot, 0);
  var deltaXRightVisible = Math.max(0, (region.x + region.w) - (viewportRect.x + viewportRect.w) + overShoot);
  var deltaXStartVisible = isRTL ? deltaXRightVisible : deltaXLeftVisible;
  var deltaXEndVisible = isRTL ? deltaXLeftVisible : deltaXRightVisible;

  switch (xPriority)
  {
    case 'start':
      deltaX = deltaXStartVisible;
      break;
    case 'end':
      deltaX = deltaXEndVisible;
      break;
    default:
      deltaX = (!isRTL ? deltaXEndVisible > 0 : deltaXEndVisible < 0) ? deltaXEndVisible : deltaXStartVisible; // 'end' wins if just 'end', or both sides, require panning. 'start' otherwise.
  }

  var deltaYTopVisible = Math.min(region.y - viewportRect.y - overShoot, 0);
  var deltaYBottomVisible = Math.max(0, (region.y + region.h) - (viewportRect.y + viewportRect.h) + overShoot);

  switch (yPriority)
  {
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
};

/**
 * Pan to make room upon drag or equivalent near the edge of the viewport
 * @param {dvt.Point} targetPos The target position
 * @param {number} edgeThreshold The distance from an edge at which auto pan should happen
 * @param {boolean=} excludeX Whether to exclude x direction from auto pan consideration
 * @param {boolean=} excludeY Whether to exclude y direction from auto pan consideration
 * @return {object} The actual deltaX and deltaY panned
 */
dvt.Gantt.prototype.autoPanOnEdgeDrag = function(targetPos, edgeThreshold, excludeX, excludeY)
{
  var viewportRect = this.getViewportDimensions();
  var deltaX = 0;
  var deltaY = 0;

  // Pan amount varies inversely with distance from edge, i.e. the closer to edge, the larger (abs(distance - edgeThreshold)) the pan amount
  if (!excludeX)
  {
    var distanceFromRightEdge = Math.max(targetPos.x - viewportRect.x, 0);
    var distanceFromLeftEdge = Math.max(viewportRect.x + viewportRect.w - targetPos.x, 0);
    if (distanceFromRightEdge < edgeThreshold)
    {
      deltaX = distanceFromRightEdge - edgeThreshold; // < 0
      deltaX = Math.max(deltaX, -viewportRect.x);
    }
    else if (distanceFromLeftEdge < edgeThreshold)
    {
      deltaX = edgeThreshold - distanceFromLeftEdge;
      deltaX = Math.min(deltaX, this.getContentLength() - (viewportRect.x + viewportRect.w));
    }
  }
  if (!excludeY)
  {
    var distanceFromTopEdge = Math.max(targetPos.y - viewportRect.y, 0);
    var distanceFromBottomEdge = Math.max(viewportRect.y + viewportRect.h - targetPos.y, 0);
    if (distanceFromTopEdge < edgeThreshold)
    {
      deltaY = distanceFromTopEdge - edgeThreshold; // < 0
      deltaY = Math.max(deltaY, -viewportRect.y);
    }
    else if (distanceFromBottomEdge < edgeThreshold)
    {
      deltaY = edgeThreshold - distanceFromBottomEdge;
      if ((this.getContentHeight() + this._databodyStart) >= this._canvasSize)
      {
        if (this.getAxisPosition() == 'bottom')
        {
          deltaY = Math.min(deltaY, this._databody.getTranslateY() + this.getContentHeight() - viewportRect.h);
        }
        else
        {
          deltaY = Math.min(deltaY, this._databody.getTranslateY() + this.getContentHeight() - this._canvasSize);
        }
      }
      else
      {
        deltaY = Math.min(deltaY, -viewportRect.y);
      }
    }
  }
  this.panBy(deltaX, deltaY, true);
  return {deltaX: deltaX, deltaY: deltaY};
};

/**
 * Pans the Gantt by the specified amount.
 * @param {number} deltaX The number of pixels to pan in the x direction.
 * @param {number} deltaY The number of pixels to pan in the y direction.
 * @param {boolean=} diagonal true (default) if support diagonal pan, false or undefined otherwise.
 * @protected
 */
dvt.Gantt.prototype.panBy = function(deltaX, deltaY, diagonal)
{
  diagonal = typeof diagonal !== 'undefined' ? diagonal : false;

  // scroll horizontally and make sure it's scrolling in one direction only
  if (deltaX != 0 && (diagonal || (Math.abs(deltaX) > Math.abs(deltaY))))
  {
    dvt.Gantt.superclass.panBy.call(this, deltaX, 0);
  }

  // scroll vertically and make sure it's scrolling in one direction only
  if (this._databody && deltaY != 0 && (diagonal || (Math.abs(deltaY) > Math.abs(deltaX))))
  {
    var newTranslateY = this.getBoundedContentTranslateY(this._databody.getTranslateY() - deltaY);

    this._databody.setTranslateY(newTranslateY);
    this._databodyBackground.setTranslateY(newTranslateY);

    if (this.isDndEnabled())
      this._dndArtifactsContainer.setTranslateY(newTranslateY);

    if (this.isRowAxisEnabled())
      this.getRowAxis().setTranslateY(newTranslateY);

    if (this.isContentDirScrollbarOn())
      this.contentDirScrollbar.setViewportRange(newTranslateY - this.getDatabodyHeight(), newTranslateY);

    if (this._deplines != null)
      this._deplines.setTranslateY(newTranslateY);
  }

  if (this.isTimeDirScrollbarOn() && this.timeDirScrollbar)
    this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);
};

/**
 * Utility method for getting the bounded translate y value of content containers
 * (i.e. databody, dependency lines containers, and any other same size overlayed containers)
 * @param {number} proposedTranslateY The proposed translate y, which is not necessarily bounded
 * @return {number} The bounded version of the translate y
 */
dvt.Gantt.prototype.getBoundedContentTranslateY = function(proposedTranslateY)
{
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
dvt.Gantt.prototype.beginDragPan = function(compX, compY)
{
  dvt.Gantt.superclass.beginDragPan.call(this, compX, compY);

  this._currentViewStartTime = this._viewStartTime;
  this._currentViewEndTime = this._viewEndTime;
};

/**
 * @protected
 * @override
 */
dvt.Gantt.prototype.endDragPan = function(compX, compY)
{
  // check whether we should dispatch viewport change event
  if (this._currentViewStartTime == this._viewStartTime && this._currentViewEndTime == this._viewEndTime)
    this._triggerViewportChange = false;

  dvt.Gantt.superclass.endDragPan.call(this, compX, compY);
};

/**
 * Dim or un-Dim all tasks except the task specified
 * @param {DvtGanttTaskNode} task the task to exempt
 * @param {boolean} dim true if dim the task, brighten it otherwise
 * @protected
 */
dvt.Gantt.prototype.setTaskBrightness = function(task, dim)
{
  var task = this.findTaskNodeById(task.getId());
  if (task != null)
    dim ? task.darken() : task.brighten();
};

/**
 * Find the task node with the specified id
 * @param {string} id the id
 * @return {DvtGanttTaskNode} the task with the specified id or null if none is found
 */
dvt.Gantt.prototype.findTaskNodeById = function(id)
{
  var rows = this._rows;
  if (rows)
  {
    for (var i = 0; i < rows.length; i++)
    {
      var tasks = rows[i].getTasks();
      for (var j = 0; j < tasks.length; j++)
      {
        if (id === tasks[j].getId())
          return tasks[j];
      }
    }
  }

  return null;
};

/**
 * Helper method to decide whether or not the options are valid.
 * @return {boolean} Whether this Gantt chart has valid options.
 */
dvt.Gantt.prototype.hasValidOptions = function()
{
  var hasValidMajorScale = this._majorAxis ? this._majorAxis.hasValidOptions() : true; // major axis optional
  var hasValidMinorScale = this._minorAxis && this._minorAxis.hasValidOptions();
  var hasValidStartAndEnd = this._start && this._end && (this._end > this._start);
  var hasValidViewport = (this._viewStartTime && this._viewEndTime) ? this._viewEndTime > this._viewStartTime : true;
  var hasValidViewStart = this._viewStartTime ? (this._viewStartTime >= this._start && this._viewStartTime < this._end) : true;
  var hasValidViewEnd = this._viewEndTime ? (this._viewEndTime > this._start && this._viewEndTime <= this._end) : true;

  return (hasValidMajorScale && hasValidMinorScale && hasValidStartAndEnd && hasValidViewport && hasValidViewStart && hasValidViewEnd);
};

/**
 * @override
 */
dvt.Gantt.prototype.GetComponentDescription = function() 
{
  return dvt.Bundle.getTranslation(this.getOptions(), 'componentName', dvt.Bundle.UTIL_PREFIX, 'GANTT');
};

/******************** Selection **********************/
/**
 * Gets selection handler
 * @return {dvt.SelectionHandler} selection handler
 */
dvt.Gantt.prototype.getSelectionHandler = function() 
{
  return this._selectionHandler;
};

/**
 * Returns whether selecton is supported on the Gantt.
 * @return {boolean} True if selection is turned on and false otherwise.
 */
dvt.Gantt.prototype.isSelectionSupported = function() 
{
  return (this._selectionHandler ? true : false);
};

/**
 * Sets the selection mode for the component
 * @param {string} selectionMode valid values dvt.SelectionHandler.TYPE_SINGLE, dvt.SelectionHandler.TYPE_MULTIPLE or null
 */
dvt.Gantt.prototype.setSelectionMode = function(selectionMode) 
{
  if (selectionMode == 'single')
    this._selectionHandler = new dvt.SelectionHandler(this.getCtx(), dvt.SelectionHandler.TYPE_SINGLE);
  else if (selectionMode == 'multiple')
    this._selectionHandler = new dvt.SelectionHandler(this.getCtx(), dvt.SelectionHandler.TYPE_MULTIPLE);
  else
    this._selectionHandler = null;

  // Event Handler delegates to other handlers
  this.getEventManager().setSelectionHandler(this._selectionHandler);
};

/**
 * Update the selection handler with the initial selections.
 * @private
 */
dvt.Gantt.prototype._processInitialSelections = function() 
{
  if (this._rows == null || this._rows.length == 0)
    return;

  var selection = this.Options['selection'];
  if (!selection)
    return;

  if (this.isSelectionSupported())
  {
    var targets = [];
    for (var i = 0; i < this._rows.length; i++)
    {
      var tasks = this._rows[i].getTasks();
      if (tasks != null && tasks.length > 0)
      {
        for (var j = 0; j < tasks.length; j++)
          targets.push(tasks[j]);
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
dvt.Gantt.prototype.getDependencyLines = function()
{
  return this._deplines;
};

/**
 * Sets the container object for the dependency lines
 * @param {dvt.Container} deplines the container for the dependency lines
 */
dvt.Gantt.prototype.setDependencyLines = function(deplines)
{
  this._deplines = deplines;
};

/**
 * Sets the id of the default marker
 * @param {string} id the id of the default marker
 */
dvt.Gantt.prototype.setDefaultMarkerId = function(id)
{
  this._markerId = id;
};

/**
 * Gets the id of the default marker
 * @return {string} the id of the default marker
 */
dvt.Gantt.prototype.getDefaultMarkerId = function()
{
  return this._markerId;
};

/**
 * Gets the predecessors or successors for the specified task
 * @param {DvtGanttTaskNode} task the task
 * @param {string} type successor or predecessor
 * @return {DvtGanttDependencyNode[]} array of predecessors or successors for the specified task
 */
dvt.Gantt.prototype.getNavigableDependencyLinesForTask = function(task, type)
{
  return type == 'successor' ? task.getSuccessorDependencies() : task.getPredecessorDependencies();
};

// should be in super
/**
 * Handle touch start event
 * @param {object} event
 */
dvt.Gantt.prototype.HandleTouchStart = function(event)
{
};

/**
 * Gantt automation service.
 * @param {dvt.Gantt} gantt The owning dvt.Gantt.
 * @class  DvtGanttAutomation
 * @implements {dvt.Automation}
 * @constructor
 */
var DvtGanttAutomation = function(gantt)
{
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
DvtGanttAutomation.prototype.GetSubIdForDomElement = function(displayable)
{
  var logicalObj = this._gantt.getEventManager().GetLogicalObject(displayable);
  if (logicalObj && (logicalObj instanceof DvtGanttTaskNode))
  {
    var row = logicalObj.getRow();
    var rowIndex = this._gantt.getRows().indexOf(row);
    var taskIndex = row.getTasks().indexOf(logicalObj);
    return 'taskbar[' + rowIndex + '][' + taskIndex + ']';
  }
  else if (logicalObj && (logicalObj instanceof DvtGanttRowLabelContent))
  {
    var rowIndex = logicalObj.getRowIndex();
    return 'rowLabel[' + rowIndex + ']';
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
DvtGanttAutomation.prototype.getDomElementForSubId = function(subId)
{
  // TOOLTIP
  if (subId == dvt.Automation.TOOLTIP_SUBID)
    return this.GetTooltipElement(this._gantt);

  var openParen1 = subId.indexOf('[');
  var closeParen1 = subId.indexOf(']');
  var component = subId.substring(0, openParen1);

  if (openParen1 > -1 && closeParen1 > -1)
  {
    if (component == 'taskbar')
    {
      var openParen2 = subId.indexOf('[', openParen1 + 1);
      var closeParen2 = subId.indexOf(']', openParen2 + 1);
      if (openParen2 > -1 && closeParen2 > -1)
      {
        var rowIndex = parseInt(subId.substring(openParen1 + 1, closeParen1));
        var taskIndex = parseInt(subId.substring(openParen2 + 1, closeParen2));
        if (isNaN(rowIndex) || isNaN(taskIndex))
          return null;

        var rows = this._gantt.getRows();
        if (rows != null && rows.length > rowIndex)
        {
          var tasks = rows[rowIndex].getTasks();
          if (tasks != null && tasks.length > taskIndex)
          {
            var repShape = tasks[taskIndex].getTask().getShape('main');
            if (repShape != null)
              return repShape.getElem();
          }
        }
      }
    }
    else if (component == 'rowLabel')
    {
      rowIndex = parseInt(subId.substring(openParen1 + 1, closeParen1));
      var rows = this._gantt.getRows();
      if (rows != null && rows.length > rowIndex)
      {
        var rowLabelContent = rows[rowIndex].getRowLabelContent();
        if (rowLabelContent != null)
          return rowLabelContent.getDisplayable().getElem();
      }
    }
  }
  return null;
};

/**
 * Default values and utility functions for component versioning.
 * @class
 * @constructor
 * @extends {dvt.BaseComponentDefaults}
 */
var DvtGanttDefaults = function()
{
  this.Init({'alta': DvtGanttDefaults.VERSION_1});
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
  'scrollbar' : {
    'horizontal': 'off',
    'vertical': 'off'
  },
  'gridlines': {
    'horizontal': 'hidden',
    'vertical': 'visible'
  },
  'selectionMode': 'none',
  'taskDefaults': {
    'labelPosition': ['end', 'innerCenter', 'start', 'max'],
    'borderRadius': '0',
    'height': DvtGanttStyleUtils.getStandaloneTaskHeight(),
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
DvtGanttDefaults.prototype.getNoCloneObject = function()
{
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
    'rows': {
      'tasks': {'start': true, 'end': true}
    },
    'referenceObjects': {'value': true}
  };
};

/**
 * @override
 */
DvtGanttDefaults.prototype.getAnimationDuration = function(options)
{ 
  return options['_resources'] ? options['_resources']['animationDuration'] : null;
};

/**
 * Class representing a GanttDependency node.
 * @param {dvt.Gantt} gantt The gantt component
 * @param {object} props The properties for the dependency.
 * @class
 * @constructor
 * @implements {DvtKeyboardNavigable}
 */
var DvtGanttDependencyNode = function(gantt, props)
{
  this.Init(gantt, props);
};

dvt.Obj.createSubclass(DvtGanttDependencyNode, dvt.Container);

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
 * @param {dvt.Gantt} gantt The gantt component
 * @param {object} props The properties for the node.
 * @protected
 */
DvtGanttDependencyNode.prototype.Init = function(gantt, props)
{
  DvtGanttDependencyNode.superclass.Init.call(this, gantt.getCtx(), null);

  this._gantt = gantt;
  this._props = props;

  this._gantt.getEventManager().associate(this, this);
};

/**
 * Sets the properties for the node.
 * @param {object} props The properties.
 */
DvtGanttDependencyNode.prototype.setProps = function(props)
{
  this._props = props;
};

/**
 * Gets the gantt.
 * @return {dvt.Gantt} the gantt.
 */
DvtGanttDependencyNode.prototype.getGantt = function()
{
  return this._gantt;
};

/**
 * Retrieve the data id of the dependency line.
 * @override
 */
DvtGanttDependencyNode.prototype.getId = function()
{
  return this._props['id'];
};

/**
 * @override
 */
DvtGanttDependencyNode.prototype.getActiveElementId = function()
{
  return null; // Let a temporary id be generated if active element
};

/**
 * Retrieve the id of the predecessor task
 * @return {string} the id of the predecessor task
 */
DvtGanttDependencyNode.prototype.getPredecessor = function()
{
  return this._props['predecessorTaskId'];
};

/**
 * Retrieve the id of the successor task
 * @return {string} the id of the successor task
 */
DvtGanttDependencyNode.prototype.getSuccessor = function()
{
  return this._props['successorTaskId'];
};

/**
 * Retrieve the dependency type
 * @return {string} the dependency type
 */
DvtGanttDependencyNode.prototype.getType = function()
{
  return this._props['type'] == null ? DvtGanttDependencyNode.FINISH_START : this._props['type'];
};

/**
 * Retrieve the svg inline style to set on the dependency line
 * @return {string|object} the svg inline style to set on the dependency line
 */
DvtGanttDependencyNode.prototype.getSvgStyle = function()
{
  return this._props['svgStyle'];
};

/**
 * Retrieve the svg style class to set on the dependency line
 * @return {string} the style class to set on the dependency line
 */
DvtGanttDependencyNode.prototype.getSvgClassName = function()
{
  return this._props['svgClassName'];
};

/**
 * Retrieve the short description for the dependency line
 * @return {string} the short description for the dependency line
 */
DvtGanttDependencyNode.prototype.getShortDesc = function()
{
  return this._props['shortDesc'];
};

/**
 * Retrieves the predecessor task object
 * @return {DvtGanttTaskNode} the predecessor task object
 */
DvtGanttDependencyNode.prototype.getPredecessorNode = function()
{
  return this._predecessorNode;
};

/**
 * Retrieves the successor task object
 * @return {DvtGanttTaskNode} the successor task object
 */
DvtGanttDependencyNode.prototype.getSuccessorNode = function()
{
  return this._successorNode;
};

/**
 * Determine the start position of the task node, taking label into account
 * @param {DvtGanttTaskNode} taskNode the task node
 * @return {number} the start position of the task node in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskStart = function(taskNode)
{
  var isRTL = dvt.Agent.isRightToLeft(taskNode.getGantt().getCtx()),
      taskMainShape = taskNode.getTask().getShape('main'),
      taskLabel = taskNode.getTaskLabel(),
      taskLabelOutputText = taskLabel.getLabelOutputText(),
      labelPosition = taskLabel.getEffectiveLabelPosition();

  if (isRTL)
  {
    if (taskLabelOutputText != null && taskLabelOutputText.getParent() != null && labelPosition == 'end')
    {
      return (taskNode.getFinalX() + taskMainShape.getFinalX()) - taskMainShape.getFinalWidth() - taskMainShape.getPhysicalEndOffset() - taskLabelOutputText.getDimensions().w - DvtGanttStyleUtils.getTaskLabelPadding() * 2; // padding before + after
    }
    else
    {
      return (taskNode.getFinalX() + taskMainShape.getFinalX()) - taskMainShape.getFinalWidth() - taskMainShape.getPhysicalEndOffset();
    }
  }
  else
  {
    if (taskLabelOutputText != null && taskLabelOutputText.getParent() != null && labelPosition == 'start')
    {
      return (taskNode.getFinalX() + taskMainShape.getFinalX()) - taskMainShape.getPhysicalStartOffset() - taskLabelOutputText.getDimensions().w - DvtGanttStyleUtils.getTaskLabelPadding() * 2;
    }
    else
    {
      return (taskNode.getFinalX() + taskMainShape.getFinalX()) - taskMainShape.getPhysicalStartOffset();
    }
  }
};

/**
 * Determine the middle position of the task node
 * @param {DvtGanttTaskNode} taskNode the task node to find the vertical middle point
 * @return {number} the middle position of the task node in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskMiddle = function(taskNode)
{
  var task = taskNode.getTask();
  var taskMainShape = task.getShape('main');
  var availableShapeHeight = (task.isSummary('main')) ? taskNode.getProps()['height'] : taskMainShape.getFinalHeight();
  return DvtGanttDependencyNode._getTaskTop(taskNode) + taskMainShape.getFinalY() + Math.round(availableShapeHeight / 2);
};

/**
 * Determine the end position of the task node, taking label into account
 * @param {DvtGanttTaskNode} taskNode the task node to find the end
 * @return {number} the end position of the task node in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskEnd = function(taskNode)
{
  var isRTL = dvt.Agent.isRightToLeft(taskNode.getGantt().getCtx()),
      taskMainShape = taskNode.getTask().getShape('main'),
      taskLabel = taskNode.getTaskLabel(),
      taskLabelOutputText = taskLabel.getLabelOutputText(),
      labelPosition = taskLabel.getEffectiveLabelPosition();

  if (isRTL)
  {
    if (taskLabelOutputText != null && taskLabelOutputText.getParent() != null && labelPosition == 'start')
    {
      return (taskNode.getFinalX() + taskMainShape.getFinalX()) + taskMainShape.getPhysicalStartOffset() + taskLabelOutputText.getDimensions().w + DvtGanttStyleUtils.getTaskLabelPadding() * 2;
    }
    else
    {
      return (taskNode.getFinalX() + taskMainShape.getFinalX()) + taskMainShape.getPhysicalStartOffset();
    }
  }
  else
  {
    if (taskLabelOutputText != null && taskLabelOutputText.getParent() != null && labelPosition == 'end')
    {
      return (taskNode.getFinalX() + taskMainShape.getFinalX()) + taskMainShape.getFinalWidth() + taskMainShape.getPhysicalEndOffset() + taskLabelOutputText.getDimensions().w + DvtGanttStyleUtils.getTaskLabelPadding() * 2;
    }
    else
    {
      return (taskNode.getFinalX() + taskMainShape.getFinalX()) + taskMainShape.getFinalWidth() + taskMainShape.getPhysicalEndOffset();
    }
  }
};

/**
 * Calculate the top of the task
 * @param {DvtGanttTaskNode} taskNode the task node to find the top
 * @return {number} the position of the top of the task node in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskTop = function(taskNode)
{
  return taskNode.getFinalY();
};

/**
 * Calculate the bottom of the task node
 * @param {DvtGanttTaskNode} taskNode the task node to find the bottom
 * @return {number} the position of the bottom of the task node in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskBottom = function(taskNode)
{
  return DvtGanttDependencyNode._getTaskTop(taskNode) + taskNode.getFinalHeight();
};

/**
 * Checks if dependency type is valid
 * @param {string} type the dependency type
 * @return {boolean} true if dependency type is valid, false otherwise
 * @private
 */
DvtGanttDependencyNode._isValidType = function(type)
{
  return (type === DvtGanttDependencyNode.START_START || type === DvtGanttDependencyNode.START_FINISH ||
          type === DvtGanttDependencyNode.FINISH_START || type === DvtGanttDependencyNode.FINISH_FINISH);
};

/**
 * Renders the dependency line
 * @param {dvt.Container} container the container to render the dependency line in.
 */
DvtGanttDependencyNode.prototype.render = function(container)
{
  if (this.getParent() != container)
    container.addChild(this);

  this.setAriaRole('img');

  var predecessor = this.getPredecessor();
  var successor = this.getSuccessor();
  var type = this.getType();

  // make sure all the mandatory fields are available and valid
  if (predecessor == null || successor == null || predecessor == successor || !DvtGanttDependencyNode._isValidType(type))
  {
    // remove existing line if it's invalid
    this._cleanup();
    return;
  }

  var gantt = this.getGantt();
  var predecessorNode = gantt.findTaskNodeById(predecessor);
  var successorNode = gantt.findTaskNodeById(successor);
  if (predecessorNode == null || successorNode == null)
  {
    // remove existing line if it's invalid
    this._cleanup();
    return;
  }

  // keep these around for highlighting and navigation
  this._predecessorNode = predecessorNode;
  this._successorNode = successorNode;

  // update task about predecessors and successors
  this._predecessorNode.addSuccessorDependency(this);
  this._successorNode.addPredecessorDependency(this);

  // for touch the aria-label needs to be available and aria-label on task needs to be updated
  if (dvt.TimeAxis.supportsTouch())
  {
    this.setAriaProperty('label', this.getAriaLabel());
    this._predecessorNode.refreshAriaLabel();
    this._successorNode.refreshAriaLabel();
  }

  // due to IE bug https://connect.microsoft.com/IE/feedback/details/781964/,
  // which happens only on older versions of Windows (<10), we'll need to re-render the path instead of just updating its command
  if (dvt.Agent.isPlatformIE())
    this._cleanup();

  if (this._line != null)
  {
    // update dependency line
    this._line.setCmds(DvtGanttDependencyNode._calcDepLine(gantt.getCtx(), this._predecessorNode, this._successorNode, type));
    var elem = this._line.getElem();
  }
  else
  {
    var line = new dvt.Path(gantt.getCtx(), DvtGanttDependencyNode._calcDepLine(gantt.getCtx(), predecessorNode, successorNode, type));
    // If arc radius > 0, then leave pixel hinting--otherwise they look weird and pixelated.
    // Otherwise, the lines are rectilinear, and should be crisp.
    if (DvtGanttStyleUtils.getDependencyLineArcRadius() === 0)
    {
      line.setPixelHinting(true);
    }

    elem = line.getElem();
    // sets the default arrow marker
    dvt.ToolkitUtils.setAttrNullNS(elem, 'marker-end', dvt.ToolkitUtils.getUrlById(gantt.getDefaultMarkerId()));

    this.addChild(line);

    // set keyboard focus stroke
    var his = new dvt.SolidStroke(DvtGanttStyleUtils.getFocusedDependencyLineInnerColor(), 1, DvtGanttStyleUtils.getFocusedDependencyLineInnerWidth());
    // the outer color won't matter since it will be override by style class
    var hos = new dvt.SolidStroke('#000', 1, 1);
    line.setHoverStroke(his, hos);

    this._line = line;
  }

  // apply inline style
  var style = this.getSvgStyle();
  if (style)
  {
    // TODO: once we fully deprecate string type in 4.0.0, remove the string logic below
    if (typeof style === 'string' || style instanceof String)
      dvt.ToolkitUtils.setAttrNullNS(elem, 'style', style);
    else
      this._line.setStyle(style); // works if style is object
  }

  // apply style class
  // TODO: right now, the hover inner stroke (see var his) is set to have white color.
  // However, if we use Using toolkit's setClassName method, i.e. this._line.setClassName(styleClass),
  // it saves the class in an internal variable. When one focuses on the dep line,
  // the saved class is applied on the inner stroke in UpdateSelectionEffect(), which
  // overrides the white stroke...
  // See filed  for more details.
  // For now, revert back to not using the Toolkit setClassName and just apply the class on the
  // line ourselves, to eliminate this regression from 2.3.0. Post 3.0.0, we should investigate a better way to do this.
  var defaultStyleClass = gantt.GetStyleClass('dependencyLine');
  var styleClass = this.getSvgClassName();
  if (styleClass)
    dvt.ToolkitUtils.setAttrNullNS(elem, 'class', defaultStyleClass + ' ' + styleClass);
  else
    dvt.ToolkitUtils.setAttrNullNS(elem, 'class', defaultStyleClass);
};

/**
 * Clean up any artifacts created by this dependency line
 * @private
 */
DvtGanttDependencyNode.prototype._cleanup = function()
{
  if (this._line != null)
  {
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
DvtGanttDependencyNode.prototype._calcConflict = function()
{
  var predecessorConflict = false;
  var successorConflict = false;

  var type = this.getType();

  // checks if there's any dependency line rendered already that have the predecessor as its successor
  var deps = this.getGantt().getNavigableDependencyLinesForTask(this._predecessorNode, 'predecessor');
  if (deps != null)
  {
    for (var i = 0; i < deps.length; i++)
    {
      var depType = deps[i].getType();
      if (((type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.START_FINISH) &&
          (depType == DvtGanttDependencyNode.START_START || depType == DvtGanttDependencyNode.FINISH_START)) ||
          ((type == DvtGanttDependencyNode.FINISH_FINISH || type == DvtGanttDependencyNode.FINISH_START) &&
          (depType == DvtGanttDependencyNode.FINISH_FINISH || depType == DvtGanttDependencyNode.START_FINISH)))
      {
        predecessorConflict = true;
      }
    }
  }

  // checks if there's any dependency line rendered already that have the successor as its predecessor
  deps = this.getGantt().getNavigableDependencyLinesForTask(this._successorNode, 'successor');
  if (deps != null)
  {
    for (i = 0; i < deps.length; i++)
    {
      depType = deps[i].getType();
      if (((type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.FINISH_START) &&
          (depType == DvtGanttDependencyNode.START_START || depType == DvtGanttDependencyNode.START_FINISH)) ||
          ((type == DvtGanttDependencyNode.FINISH_FINISH || type == DvtGanttDependencyNode.START_FINISH) &&
          (depType == DvtGanttDependencyNode.FINISH_FINISH || depType == DvtGanttDependencyNode.FINISH_START)))
      {
        successorConflict = true;
      }
    }
  }

  if (predecessorConflict && successorConflict)
    return DvtGanttDependencyNode.CONFLICT_BOTH;
  else
  {
    if (predecessorConflict)
      return DvtGanttDependencyNode.CONFLICT_PREDECESSOR;
    else if (successorConflict)
      return DvtGanttDependencyNode.CONFLICT_SUCCESSOR;
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
DvtGanttDependencyNode._calcDepLine = function(context, predecessorNode, successorNode, type)
{
  var isRTL = dvt.Agent.isRightToLeft(context);

  // For RTL the rendering is flipped so for example for start-finish dependency the rendering
  // in RTL would be exactly like finish-start in LTR
  switch (type)
  {
    case DvtGanttDependencyNode.START_START:
      if (isRTL)
        return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, true, true);
      else
        return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, false, false);
      break;
    case DvtGanttDependencyNode.START_FINISH:
      if (isRTL)
        return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, true, false);
      else
        return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, false, true);
      break;
    case DvtGanttDependencyNode.FINISH_START:
      if (isRTL)
        return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, false, true);
      else
        return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, true, false);
      break;
    case DvtGanttDependencyNode.FINISH_FINISH:
      if (isRTL)
        return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, false, false);
      else
        return DvtGanttDependencyNode._calcDepLineHelper(predecessorNode, successorNode, true, true);
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
DvtGanttDependencyNode._calcDepLineHelper = function(predecessorNode, successorNode, isTypeBeginFinish, isTypeEndFinish)
{
  // TODO: Right now, arc radius by default is 0, so no issues. If we later change the default arc radius to > 0,
  // we'll need to make sure the radius <= the amount we want to translate before and after drawing the arc to prevent weird artifacts.
  var r = DvtGanttStyleUtils.getDependencyLineArcRadius();
  var taskFlankLength = DvtGanttStyleUtils.getDependencyLineTaskFlankLength();
  var markerWidth = DvtGanttStyleUtils.getDependencyLineMarkerWidth();

  var x1 = isTypeBeginFinish ? DvtGanttDependencyNode._getTaskEnd(predecessorNode) : DvtGanttDependencyNode._getTaskStart(predecessorNode);
  var x2 = isTypeEndFinish ? DvtGanttDependencyNode._getTaskEnd(successorNode) : DvtGanttDependencyNode._getTaskStart(successorNode);
  var y1 = DvtGanttDependencyNode._getTaskMiddle(predecessorNode);
  var y2 = DvtGanttDependencyNode._getTaskMiddle(successorNode);
  var y_intermediate = y2 >= y1 ? DvtGanttDependencyNode._getTaskBottom(predecessorNode) + DvtGanttStyleUtils.getDependencyLineTaskGap() : DvtGanttDependencyNode._getTaskTop(predecessorNode) - DvtGanttStyleUtils.getDependencyLineTaskGap();

  // Lock values at .5 px grid to ensure consistent SVG rendering of crispedges across browsers
  x1 = Math.round(x1) + 0.5;
  x2 = Math.round(x2) + 0.5;
  y1 = Math.round(y1) + 0.5;
  y2 = Math.round(y2) + 0.5;
  y_intermediate = Math.round(y_intermediate) + 0.5;

  var x1_flank = x1 + (isTypeBeginFinish ? 1 : -1) * taskFlankLength;
  var x2_flank = isTypeEndFinish ? x2 + taskFlankLength + markerWidth : x2 - taskFlankLength - markerWidth;

  // Start at (x1, y1)
  var line = dvt.PathUtils.moveTo(x1, y1);

  if ((isTypeBeginFinish && x2_flank < x1_flank) || (!isTypeBeginFinish && x2_flank > x1_flank))
  {
    // Horizontal line right (typeBegin == finish) or left (typeBegin == start) to x1_flank
    line += dvt.PathUtils.horizontalLineTo(x1_flank + (isTypeBeginFinish ? -1 : 1) * r);
    if (y2 > y1)
    {
      // Arc down
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank, y1 + r);
      if ((isTypeBeginFinish && isTypeEndFinish) || (!isTypeBeginFinish && !isTypeEndFinish))
      {
        // Vertical line down
        line += dvt.PathUtils.verticalLineTo(y2 - r);
        // Arc left (typeBegin == finish) or right (typeBegin == start)
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y2);
      }
      else
      {
        // Vertical line down
        line += dvt.PathUtils.verticalLineTo(y_intermediate - r);
        // Arc left (typeBegin == finish) or right (typeBegin == start)
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y_intermediate);
        // Horizontal line left (typeBegin == finish) or right (typeBegin == start)
        line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? 1 : -1) * r);
        // Arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank, y_intermediate + r);
        // Vertical line down
        line += dvt.PathUtils.verticalLineTo(y2 - r);
        // Arc right (typeBegin == finish) or left (typeBegin == start)
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank + (isTypeBeginFinish ? 1 : -1) * r, y2);
      }
    }
    else if (y2 < y1)
    {
      // Arc up
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x1_flank, y1 - r);
      if ((isTypeBeginFinish && isTypeEndFinish) || (!isTypeBeginFinish && !isTypeEndFinish))
      {
        // Vertical line up
        line += dvt.PathUtils.verticalLineTo(y2 + r);
        // Arc left (typeBegin == finish) or right (typeBegin == start)
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y2);
      }
      else
      {
        // Vertical line up
        line += dvt.PathUtils.verticalLineTo(y_intermediate + r);
        // Arc left (typeBegin == finish) or right (typeBegin == start)
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y_intermediate);
        // Horizontal line left (typeBegin == finish) or right (typeBegin == start)
        line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? 1 : -1) * r);
        // Arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x2_flank, y_intermediate - r);
        // Vertical line up
        line += dvt.PathUtils.verticalLineTo(y2 + r);
        // Arc right (typeBegin == finish) or left (typeBegin == start)
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x2_flank + (isTypeBeginFinish ? 1 : -1) * r, y2);
      }
    }
    else
    {
      // Arc down
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank, y1 + r);
      // Vertical line down
      line += dvt.PathUtils.verticalLineTo(y_intermediate - r);
      // Arc left (typeBegin == finish) or right (typeBegin == start)
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank + (isTypeBeginFinish ? -1 : 1) * r, y_intermediate);
      // Horizontal line left (typeBegin == finish) or right (typeBegin == start)
      line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? 1 : -1) * r);
      // Arc up
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x2_flank, y_intermediate - r);
      // Vertical line up
      line += dvt.PathUtils.verticalLineTo(y2 + r);
      if (isTypeEndFinish)
      {
        // Arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2_flank - r, y2);
      }
      else
      {
        // Arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2_flank + r, y2);
      }
    }
  }
  else
  {
    if (y2 > y1)
    {
      // Horizontal line right (typeBegin == finish) or left (typeBegin == start)
      line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? -1 : 1) * r);
      // Arc down
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x2_flank, y1 + r);
      // Vertical line down
      line += dvt.PathUtils.verticalLineTo(y2 - r);
      if (isTypeEndFinish)
      {
        // Arc left (typeBegin == finish) or right (typeBegin == start)
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2_flank - r, y2);
      }
      else
      {
        // Arc right (typeBegin == finish) or left (typeBegin == start)
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2_flank + r, y2);
      }
    }
    else if (y2 < y1)
    {
      // Horizontal line right (typeBegin == finish) or left (typeBegin == start)
      line += dvt.PathUtils.horizontalLineTo(x2_flank + (isTypeBeginFinish ? -1 : 1) * r);
      // Arc up
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank, y1 - r);
      // Vertical line up
      line += dvt.PathUtils.verticalLineTo(y2 + r);
      if (isTypeEndFinish)
      {
        // Arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2_flank - r, y2);
      }
      else
      {
        // Arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2_flank + r, y2);
      }
    }
    else
    {
      if ((isTypeBeginFinish && isTypeEndFinish) || (!isTypeBeginFinish && !isTypeEndFinish))
      {
        // Horizontal line right (typeBegin == finish) or left (typeBegin == start)
        line += dvt.PathUtils.horizontalLineTo(x1_flank + (isTypeBeginFinish ? -1 : 1) * r);
        // Arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 1 : 0, x1_flank, y1 + r);
        // Vertical line down
        line += dvt.PathUtils.verticalLineTo(y_intermediate - r);
        // Arc right (typeBegin == finish) or left (typeBegin == start)
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x1_flank + (isTypeBeginFinish ? 1 : -1) * r, y_intermediate);
        // Horizontal line  right (typeBegin == finish) or left (typeBegin == start)
        line += dvt.PathUtils.horizontalLineTo(x2_flank - r);
        // Arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank, y_intermediate - r);
        // Vertical line up
        line += dvt.PathUtils.verticalLineTo(y2 + r);
        // Arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, isTypeBeginFinish ? 0 : 1, x2_flank + (isTypeBeginFinish ? -1 : 1) * r, y2);
      }
    }
  }
  // End at (x2, y2)
  line += dvt.PathUtils.lineTo(x2, y2);

  return line;
};

/**
 * @override
 */
DvtGanttDependencyNode.prototype.getNextNavigable = function(event) 
{
  if (event.keyCode == dvt.KeyboardEvent.UP_ARROW || event.keyCode == dvt.KeyboardEvent.DOWN_ARROW)
  {
    // this logic is identical to Diagram and TMap
    //if the dependency line got focus via keyboard, get the task where the focus came from
    //we'll navigate around that task
    //if the focus was set through mouse click, set predecessor as a center of navigation
    var task = this.getKeyboardFocusTask();
    if (!task)
      task = this.getPredecessorNode();

    // go to the previous/next dependency line
    var nextDependencyLine = this;
    var keyboardHandler = this.getGantt().getEventManager().getKeyboardHandler();
    if (keyboardHandler && keyboardHandler.getNextNavigableDependencyLine)
    {
      var type = task == this.getPredecessorNode() ? 'successor' : 'predecessor';
      var dependencyLines = this.getGantt().getNavigableDependencyLinesForTask(task, type);
      nextDependencyLine = keyboardHandler.getNextNavigableDependencyLine(task, this, event, dependencyLines);
    }

    nextDependencyLine.setKeyboardFocusTask(task);
    return nextDependencyLine;
  }
  else if (event.keyCode == dvt.KeyboardEvent.RIGHT_ARROW || event.keyCode == dvt.KeyboardEvent.LEFT_ARROW)
  {
    if (dvt.Agent.isRightToLeft(this.getGantt().getCtx()))
      return event.keyCode == dvt.KeyboardEvent.LEFT_ARROW ? this.getSuccessorNode() : this.getPredecessorNode();
    else
      return event.keyCode == dvt.KeyboardEvent.RIGHT_ARROW ? this.getSuccessorNode() : this.getPredecessorNode();
  }
  else if (event.type == dvt.MouseEvent.CLICK)
  {
    return this;
  }
  return null;
};

/**
 * Sets a node that should be used for dependency line navigation
 * @param {DvtGanttTaskNode} node
 */
DvtGanttDependencyNode.prototype.setKeyboardFocusTask = function(node) 
{
  this._keyboardNavNode = node;
};

/**
 * Gets a node that should be used for dependency line navigation
 * @return {DvtGanttTaskNode} a node that should be used for dependency line navigation
 */
DvtGanttDependencyNode.prototype.getKeyboardFocusTask = function() 
{
  return this._keyboardNavNode;
};

/**
 * @override
 */
DvtGanttDependencyNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  return this.getDimensions(targetCoordinateSpace);
};

/**
 * @override
 */
DvtGanttDependencyNode.prototype.getTargetElem = function() 
{
  return this._line.getElem();
};

/**
 * @override
 */
DvtGanttDependencyNode.prototype.showKeyboardFocusEffect = function() 
{
  if (this._line)
  {
    var marker = dvt.ToolkitUtils.getAttrNullNS(this._line.getElem(), 'marker-end');

    dvt.DomUtils.addCSSClassName(this._line.getElem(), this._gantt.GetStyleClass('focus'));
    this._line.showHoverEffect();

    // default marker-end is not copied to inner shape
    if (marker != null)
      dvt.ToolkitUtils.setAttrNullNS(this._line.getElem(), 'marker-end', marker);
    this._isShowingKeyboardFocusEffect = true;
  }
};

/**
 * @override
 */
DvtGanttDependencyNode.prototype.hideKeyboardFocusEffect = function()
{
  if (this.isShowingKeyboardFocusEffect())
  {
    this._line.hideHoverEffect();
    dvt.DomUtils.removeCSSClassName(this._line.getElem(), this._gantt.GetStyleClass('focus'));
    this._isShowingKeyboardFocusEffect = false;
  }
};

/**
 * @override
 */
DvtGanttDependencyNode.prototype.isShowingKeyboardFocusEffect = function()
{
  return this._isShowingKeyboardFocusEffect;
};

/**
 * Retrieves the tooltip to display on the dependency line
 * @override
 */
DvtGanttDependencyNode.prototype.getDatatip = function(target, x, y) 
{
  return this.getAriaLabel();
};

/**
 * Gets the aria label
 * @return {string} the aria label string.
 */
DvtGanttDependencyNode.prototype.getAriaLabel = function() 
{
  var desc = this.getShortDesc();
  if (desc != null)
    return desc;

  var options = this._gantt.getOptions();

  var predecessor = this.getPredecessor();
  var successor = this.getSuccessor();
  var type = this.getType();

  if (predecessor == null || successor == null || !DvtGanttDependencyNode._isValidType(type))
    return '';

  var key = dvt.Bundle.getTranslation(options, type + 'DependencyAriaDesc');

  // bundlePrefix and key param are not neccessary
  desc = dvt.Bundle.getTranslation(options, 'accessibleDependencyInfo', '', '', [key, predecessor, successor]);
  return desc;
};

/**
 * Gantt event manager.
 * @param {dvt.Gantt} gantt The owning dvt.Gantt.
 * @extends {dvt.TimeComponentEventManager}
 * @constructor
 */
var DvtGanttEventManager = function(gantt)
{
  DvtGanttEventManager.superclass.constructor.call(this, gantt);
  this._gantt = this._comp;
};

dvt.Obj.createSubclass(DvtGanttEventManager, dvt.TimeComponentEventManager);

/**
 * Sets the event manager's keyboard focus on the given DvtKeyboardNavigable
 * @param {DvtKeyboardNavigable} navigable The DvtKeyboardNavigable to receive keyboard focus
 * @override
 */
DvtGanttEventManager.prototype.setFocus = function(navigable)
{
  DvtGanttEventManager.superclass.setFocus.call(this, navigable);

  // make sure focus task is in viewport
  if (navigable instanceof DvtGanttTaskNode)
  {
    // fire viewport change event if attempting to scroll into view causes viewport change
    var previousViewportStart = this._gantt.getViewportStartTime();
    var previousViewportEnd = this._gantt.getViewportEndTime();

    navigable.scrollIntoView();

    if (this._gantt.getViewportStartTime() !== previousViewportStart || this._gantt.getViewportEndTime() !== previousViewportEnd)
    {
      this._gantt.dispatchEvent(this._gantt.createViewportChangeEvent());
    }
  }
};

/**
 * @override
 */
DvtGanttEventManager.prototype.hideTooltip = function()
{
  if (!this._preventHideTooltip)
  {
    DvtGanttEventManager.superclass.hideTooltip.call(this);
  }

  // reset the flag
  this._preventHideTooltip = false;
};

// Drag & Drop Support

/** 
 * DataType for high level dnd.move tasks source
 * @type {string}
 */
DvtGanttEventManager.MOVE_TASKS_DATA_TYPE = 'text/_dvtdndmovetasks';

/**
 * Scale jump ramp for high level DnD navigation
 * @type {array}
 * @private
 */
DvtGanttEventManager._HIGH_LEVEL_DND_NAVIGATION_SCALES = ['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years'];

/**
 * @override
 */
DvtGanttEventManager.prototype.isDndSupported = function()
{
  return true;
};

/**
 * Whether DnD dragging is currently happening
 * @return {boolean} whether DnD dragging is happening
 */
DvtGanttEventManager.prototype.isDnDDragging = function()
{
  return this._isDndDragging;
};

/**
 * Setup upon drag start
 * @private
 */
DvtGanttEventManager.prototype._dragStartSetup = function()
{
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
DvtGanttEventManager.prototype._dragCancelCleanup = function()
{
  // Revert viewport to original state
  if (this._dragInitialX)
  {
    var deltaX = this._gantt.getTimeZoomCanvas().getTranslateX() - this._dragInitialX;
    var deltaY = this._gantt.getDatabody().getTranslateY() - this._dragInitialY;
    if (deltaX !== 0 || deltaY !== 0)
    {
      this._gantt.panBy(deltaX, deltaY, true);

      // in case of rounding errors, explictly reset viewport start/end times
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
 * Cleanup on drag end
 * @private
 */
DvtGanttEventManager.prototype._dragEndCleanup = function()
{
  // Fire viewport change event if viewport changed
  if (this._dragInitialViewportStart != null && 
      (this._dragInitialViewportStart !== this._gantt.getViewportStartTime() || 
        this._dragInitialViewportEnd !== this._gantt.getViewportEndTime()))
  {
    this._gantt.dispatchEvent(this._gantt.createViewportChangeEvent());
  }

  this._dragInitialX = null;
  this._dragInitialY = null;
  this._dragInitialViewportStart = null;
  this._dragInitialViewportEnd = null;
};

/** 
 * Whether high level DnD Move is initiated
 * @return {boolean} whether high level DnD Move is initiated
 */
DvtGanttEventManager.prototype.isMoveInitiated = function()
{
  return this._isMoveInitiated;
};

/**
 * Handles high level DnD Move initiation
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move initiation
 * @param {DvtGanttTaskNode} sourceObj The move source object
 */
DvtGanttEventManager.prototype.handleMoveInitiation = function(event, sourceObj)
{
  var options = this._gantt.getOptions();
  if (options['dnd']['move'] && options['dnd']['move']['tasks'] === 'enabled')
  {
    this._isMoveInitiated = true;
    this._isDndDragging = true;
    this._dragStartSetup();

    // Put up a glass pane to block certain mouse events, in case mouse is over the component during keyboard move.
    // E.g. mouseout gets fired when the gantt scrolls during keyboard move such that the row rect underneath the mouse moved away
    // The mouseout event in turn hides the tooltip during keyboard move.
    this._gantt.registerAndConstructGlassPane();
    var glassPaneAdded = this._gantt.installGlassPane();

    // For the first move initiation, set navigation scale to whatever the scale of the (minor) time axis is
    this._moveScaleRampIndex = DvtGanttEventManager._HIGH_LEVEL_DND_NAVIGATION_SCALES.indexOf(this._gantt.getTimeAxis().getScale());

    var mainShape = sourceObj.getTask().getShape('main');
    sourceObj.setDraggedObject(mainShape);
    sourceObj.dragStartSetup();

    var stagePos = sourceObj.localToStage({x: mainShape.getFinalX(), y: mainShape.getFinalY()});
    this._moveFeedbackLocalPos = this._gantt.getDnDArtifactsContainer().stageToLocal(stagePos);
    sourceObj.showDragFeedback(event, this._moveFeedbackLocalPos, sourceObj.getRow(), {x: 0, y: 0}, true);
    // As a result of bringing up the glass pane, if the mouse happens to be over the Gantt, a mouseout event is fired, which
    // tries to hide tooltips. Result--the drag tooltip is not shown, which is not desirable. 
    // Flag that the feedback tooltip shouldn't be hidden no matter what stray mouse events fired in this scenario.
    if (glassPaneAdded)
    {
      this._preventHideTooltip = true;
    }

    this._moveSourceObj = sourceObj;
    this._moveTargetObj = sourceObj.getRow();

    var taskProps = sourceObj.getProps();
    var startTime = taskProps['start'];
    var endTime = taskProps['end'];
    startTime = startTime ? startTime : endTime;
    endTime = endTime ? endTime : startTime;

    var baselineStartTime = taskProps['baseline'] ? taskProps['baseline']['start'] : null;
    var baselineEndTime = taskProps['baseline'] ? taskProps['baseline']['end'] : null;
    baselineStartTime = baselineStartTime ? baselineStartTime : baselineEndTime;
    baselineEndTime = baselineEndTime ? baselineEndTime : baselineStartTime;

    this._moveFeedbackTime = {
      'start': startTime,
      'end': endTime,
      'baselineStart': baselineStartTime,
      'baselineEnd': baselineEndTime
    };

    // Update the aria live region with text that the screenreader should read.
    var moveInitiationDesc = dvt.Bundle.getTranslation(options, 'taskMoveInitiated');
    if (this._gantt.isSelectionSupported() && this._moveSourceObj.isSelected())
    {
      var totalSelected = this._gantt.getSelectionHandler().getSelectedCount();
      if (totalSelected > 1)
      {
        moveInitiationDesc += '. ' + dvt.Bundle.getTranslation(options, 'taskMoveSelectionInfo', '', '', [totalSelected - 1]);
      }
    }
    moveInitiationDesc += '. ' + dvt.Bundle.getTranslation(options, 'taskMoveInitiatedInstruction') + '.';
    this._gantt.updateLiveRegionText(moveInitiationDesc);
  }
};

/**
 * Handles high level DnD Move along time
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move forward/backward
 * @param {string} direction The direction, either 'forward' or 'backward'
 * @private
 */
DvtGanttEventManager.prototype._handleMoveChronologically = function(event, direction)
{
  if (this._isMoveInitiated)
  {
    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var navigationScale = this.getMoveNavigationScale();;
    var ganttMinTime = this._gantt.getStartTime();
    var ganttMaxTime = this._gantt.getEndTime();
    var ganttWidth = this._gantt.getContentLength();

    var previousPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, this._moveFeedbackTime['start'], ganttWidth);
    previousPos = isRTL ? ganttWidth - previousPos : previousPos;
    
    var timeAxis = this._gantt.getTimeAxis();
    var adjacencyDirection = direction === 'forward' ? 'next' : 'previous';
    var newStart = timeAxis.getAdjacentDate(this._moveFeedbackTime['start'], navigationScale, adjacencyDirection).getTime();
    var newEnd = timeAxis.getAdjacentDate(this._moveFeedbackTime['end'], navigationScale, adjacencyDirection).getTime();

    if ((direction === 'forward' && newStart <= ganttMaxTime) || (direction === 'backward' && newEnd >= ganttMinTime))
    {
      this._moveFeedbackTime['start'] = newStart;
      this._moveFeedbackTime['end'] = newEnd;
      if (this._moveFeedbackTime['baselineStart'])
      {
        this._moveFeedbackTime['baselineStart'] = timeAxis.getAdjacentDate(this._moveFeedbackTime['baselineStart'], navigationScale, adjacencyDirection).getTime();
        this._moveFeedbackTime['baselineEnd'] = timeAxis.getAdjacentDate(this._moveFeedbackTime['baselineEnd'], navigationScale, adjacencyDirection).getTime();
      }

      var currentPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, this._moveFeedbackTime['start'], ganttWidth);
      currentPos = isRTL ? ganttWidth - currentPos : currentPos;

      // Only calculate and update new x position
      this._moveFeedbackLocalPos.x += currentPos - previousPos;
    }
    // Update and show feedback
    this._moveSourceObj.showDragFeedback(event, this._moveFeedbackLocalPos, this._moveTargetObj, {x: 0, y: 0}, true);
    // scroll to feedback
    this._moveSourceObj.scrollIntoView('auto', 'auto');

    // Update the aria live region with text that the screenreader should read.
    this._gantt.updateLiveRegionText(dvt.StringUtils.processAriaLabel(DvtGanttTooltipUtils.getDatatip(this._moveSourceObj, false)));
  }
};

/**
 * Handles high level DnD Move forward in time
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move forward
 */
DvtGanttEventManager.prototype.handleMoveForward = function(event)
{
  this._handleMoveChronologically(event, 'forward');
};

/**
 * Handles high level DnD Move backward in time
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move backward
 */
DvtGanttEventManager.prototype.handleMoveBackward = function(event)
{
  this._handleMoveChronologically(event, 'backward');
};

/**
 * Handles high level DnD Move scale change
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move scale increase/decrease
 * @param {string} step The scale ramp index change
 * @private
 */
DvtGanttEventManager.prototype._handleMoveScaleChange = function(event, step)
{
  if (this._isMoveInitiated)
  {
    this._isMoveScaleChanged = true;
    this._moveScaleRampIndex = Math.max(0, Math.min(this._moveScaleRampIndex + step, DvtGanttEventManager._HIGH_LEVEL_DND_NAVIGATION_SCALES.length - 1));

    // Update and show feedback
    this._moveSourceObj.showDragFeedback(event, this._moveFeedbackLocalPos, this._moveTargetObj, {x: 0, y: 0}, true);

    // Update the aria live region with text that the screenreader should read.
    // Tooltip should be showing the navigation scale at this point, so can just grab that text
    this._gantt.updateLiveRegionText(dvt.StringUtils.processAriaLabel(DvtGanttTooltipUtils.getDatatip(this._moveSourceObj, false)));
    this._isMoveScaleChanged = false;
  }
};

/**
 * Returns whether the DnD move navigation scale just changed via keyboard.
 * @return {boolean} Whether the DnD move navigation scale just changed via keyboard.
 */
DvtGanttEventManager.prototype.isMoveScaleChanged = function()
{
  return this._isMoveScaleChanged;
};

/**
 * Returns the current keyboard DnD Move navigation scale.
 * @return {string} The current navigation scale.
 */
DvtGanttEventManager.prototype.getMoveNavigationScale = function()
{
  return DvtGanttEventManager._HIGH_LEVEL_DND_NAVIGATION_SCALES[this._moveScaleRampIndex];
};

/**
 * Handles high level DnD Move increase navigation scale
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move navigation scale increase
 */
DvtGanttEventManager.prototype.handleMoveScaleUp = function(event)
{
  this._handleMoveScaleChange(event, 1);
};

/**
 * Handles high level DnD Move decrease navigation scale
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move navigation scale decrease
 */
DvtGanttEventManager.prototype.handleMoveScaleDown = function(event)
{
  this._handleMoveScaleChange(event, -1);
};

/**
 * Handles high level DnD Move row above or below
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row above or below
 * @param {string} direction 'above' or 'below'
 * @private
 */
DvtGanttEventManager.prototype._handleMoveRowDirection = function(event, direction)
{
  if (this._isMoveInitiated)
  {
    var rows = this._gantt.getRows();
    var rowIndex = rows.indexOf(this._moveTargetObj); // should always be found
    if (direction === 'above' && rowIndex > 0)
    {
      var newTargetObj = rows[rowIndex - 1];
    }
    else if (direction === 'below' && rowIndex < rows.length - 1)
    {
      newTargetObj = this._moveTargetObj = rows[rowIndex + 1];
    }

    if (newTargetObj)
    {
      this._moveTargetObj = newTargetObj;
      var mainShape = this._moveSourceObj.getTask().getShape('main');
      // Only calculate and update new y position
      var stagePos = this._moveTargetObj.localToStage({x: 0, y: this._moveTargetObj.getTop() + DvtGanttStyleUtils.getTaskPadding()})
      this._moveFeedbackLocalPos.y = this._gantt.getDnDArtifactsContainer().stageToLocal(stagePos).y;
    }
    // Update and show feedback
    this._moveSourceObj.showDragFeedback(event, this._moveFeedbackLocalPos, this._moveTargetObj, {x: 0, y: 0}, true);
    // scroll to feedback
    this._moveSourceObj.scrollIntoView('auto', direction === 'below' ? 'bottom' : 'top');

    // Update the aria live region with text that the screenreader should read.
    this._gantt.updateLiveRegionText(dvt.StringUtils.processAriaLabel(DvtGanttTooltipUtils.getDatatip(this._moveSourceObj, false)));
  }
};

/**
 * Handles high level DnD Move row above
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row above
 */
DvtGanttEventManager.prototype.handleMoveRowAbove = function(event)
{
  this._handleMoveRowDirection(event, 'above');
};

/**
 * Handles high level DnD Move row below
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row below
 */
DvtGanttEventManager.prototype.handleMoveRowBelow = function(event)
{
  this._handleMoveRowDirection(event, 'below');
};

/**
 * Handles high level DnD Move finalize
 * @param {dvt.KeyboardEvent} event The keyboard event that triggered move row below
 */
DvtGanttEventManager.prototype.handleMoveFinalize = function(event)
{
  // Viewport adjustments need to be done before handling move callback (rerender may happen after move callback)
  this._dragEndCleanup();

  var taskContexts = this._getDragDataContexts(this._moveSourceObj);
  var start = new Date(this._moveFeedbackTime['start']).toISOString();
  var end = new Date(this._moveFeedbackTime['end']).toISOString();
  var baselineStart = this._moveFeedbackTime['baselineStart'] == null ? null : new Date(this._moveFeedbackTime['baselineStart']).toISOString();
  var baselineEnd = this._moveFeedbackTime['baselineEnd'] == null ? null : new Date(this._moveFeedbackTime['baselineEnd']).toISOString();
  var value = start;
  var rowContexts = this._moveTargetObj.getDataContext();

  var evt = dvt.EventFactory.newGanttMoveEvent(taskContexts, value, start, end, baselineStart, baselineEnd, rowContexts);
  this._gantt.dispatchEvent(evt);

  this._moveCleanup();

  // Update the aria live region with text that the screenreader should read.
  this._gantt.updateLiveRegionText(dvt.Bundle.getTranslation(this._gantt.getOptions(), 'taskMoveFinalized'));
};

/**
 * Handles cancelling of DnD interaction (e.g via Esc key during drag)
 */
DvtGanttEventManager.prototype.handleDnDCancel = function()
{
  if (this._isMoveInitiated)
  {
    // Update the aria live region with text that the screenreader should read.
    this._gantt.updateLiveRegionText(dvt.Bundle.getTranslation(this._gantt.getOptions(), 'taskMoveCancelled'));
  }

  this._dragCancelCleanup();
  this._moveCleanup();
};

/**
 * Cleans up high level DnD Move (e.g. called when move cancelled or finalized)
 * @private
 */
DvtGanttEventManager.prototype._moveCleanup = function()
{
  if (this._isMoveInitiated)
  {
    this._isMoveInitiated = false;
    this._isDndDragging = false;
    this._moveSourceObj.dragEndCleanup();
    this._moveSourceObj = null;
    this._moveTargetObj = null;
    this._moveFeedbackTime = null;
    this._moveScaleRampIndex = null;

    this._gantt.unregisterAndDestroyGlassPane();
  }
};

/**
 * Gets the specific DnD task sub type (e.g. tasks, handles, ports, etc.) given the DvtGanttTaskShape|DvtGanttTaskLabel object of interest.
 * @param {DvtGanttTaskShape|DvtGanttTaskLabel} taskObject
 * @return {string} The specifc drag source type
 */
DvtGanttEventManager.prototype.getDnDTaskSubType = function(taskObject)
{
  if (taskObject instanceof DvtGanttTaskShape)
  {
    var taskObjectType = taskObject.getType();
    // TODO: Perform check for handles/ports when we support them in the future
    if (taskObjectType === 'main' || taskObjectType === 'progress')
    {
      return 'tasks';
    }
    if (taskObjectType === 'baseline')
    {
      return null; // Baselines not draggable
    }
  }
  return 'tasks'; // DvtGanttTaskLabel or the hover/selection rings
};

/**
 * @override
 */
DvtGanttEventManager.prototype.GetDragSourceType = function(event) {
  if (this.isMoveInitiated())
  {
    return this.IsDragSupported('tasks') ? 'tasks' : null;
  }

  var obj = this.DragSource.getDragObject();
  if (obj instanceof DvtGanttTaskNode)
  {
    // If called from dragstart event, check for element under the mouse
    // Otherwise, (e.g. called from drag or dragend), the affordance may have moved or mouse left the affordance, so grab the stored object.
    if (event && event.getNativeEvent().type === 'dragstart')
    {
      var clientX = event.getNativeEvent().clientX;
      var clientY = event.getNativeEvent().clientY;
      if (clientX != null && clientY != null)
      {
        var taskSource = dvt.SvgDocumentUtils.elementFromPoint(event.getNativeEvent().clientX, event.getNativeEvent().clientY);
      }
      else
      {
        // Should never go here in real life because clientX and clientY should be available.
        // However, if the event is artifically dispatched (e.g. during automated testing), then the clientX/Y may not be there,
        // in which case just target the main shape. There's no need to check whether the main shape exists because it must exist
        // to reach this line.
        taskSource = obj.getTask().getShape('main');
      }
      obj.setDraggedObject(taskSource);
    }

    var sourceType = this.getDnDTaskSubType(obj.getDraggedObject());
    return this.IsDragSupported(sourceType) ? sourceType : null;
  }
  return null;
};

/**
 * Gets the drag data contexts given the drag source object
 * @param {object} obj The drag source object
 * @return {array} array of data contexts
 * @private
 */
DvtGanttEventManager.prototype._getDragDataContexts = function(obj)
{
  if (obj instanceof DvtGanttTaskNode)
  {
    var taskSource = obj.getDraggedObject();
    if (taskSource instanceof DvtGanttTaskShape)
    {
      var sourceType = taskSource.getType();
      if (sourceType === 'baseline')
      {
        return null; // Baselines are not draggable
      }
      // TODO: Handle cases where a task affordance (e.g. handle or port) is dragged when we add support for them in the future
    }

    // tasks dragged
    if (this._gantt.isSelectionSupported() && obj.isSelected() && this._gantt.getSelectionHandler().getSelectedCount() > 1)
    {
      // Make the first dataContext be that of the dragged task
      var selection = this._gantt.getSelectionHandler().getSelection();
      var contexts = [obj.getDataContext()];
      for (var i = 0; i < selection.length; i++)
      {
        var selectionObj = selection[i];
        if (selectionObj instanceof DvtGanttTaskNode && selectionObj !== obj)
        {
          contexts.push(selectionObj.getDataContext());
        }
      }
      return contexts;
    }
    return [obj.getDataContext()];
  }
  return null;
};

/**
 * @override
 */
DvtGanttEventManager.prototype.GetDragDataContexts = function() {
  var obj = this.DragSource.getDragObject();
  return this._getDragDataContexts(obj);
};

/**
 * @override
 */
DvtGanttEventManager.prototype.GetDropOffset = function(event) {
  var obj = this.DragSource.getDragObject();

  if (obj instanceof DvtGanttTaskNode)
  {
    var sourceType = this.getDnDTaskSubType(obj.getDraggedObject());
    if (sourceType === 'tasks')
    {
      var startTime = obj.getProps()['start'];
      var endTime = obj.getProps()['end'];
      var posSpan = obj.getTask().getTimeSpanDimensions(startTime, endTime);

      var relPosStage = this._context.pageToStageCoords(event.pageX, event.pageY);
      var relPosLocal = this._gantt.getDnDArtifactsContainer().stageToLocal(relPosStage);

      // first value is the start POSITIONAL (not time) difference from event position of the dragged task; second value is the y positional offset
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
DvtGanttEventManager.prototype._getDropObject = function(event) {
  if (event)
  {
    var currentTarget = this.GetCurrentTargetForEvent(event);
    var obj = this.GetLogicalObject(currentTarget);

    // If dropped on task, but high level moved enabled and no additional low level configuration for task as drop target specified, then
    // consider the drop target the underlying row instead
    var options = this._gantt.getOptions();
    var highLevelMoveEnabled = options['dnd']['move'] && options['dnd']['move']['tasks'] === 'enabled';
    var lowLevelTaskDropSpecified = options['dnd']['tasks'] && (options['dnd']['tasks']['dataTypes'] || options['dnd']['tasks']['dragStart']);
    if (obj instanceof DvtGanttTaskNode && highLevelMoveEnabled && !lowLevelTaskDropSpecified)
    {
      this._dropObj = obj.getRow();
    }
    else
    {
      this._dropObj = obj;
    }
  }
  return this._dropObj;
};

/**
 * @override
 */
DvtGanttEventManager.prototype.GetDropTargetType = function(event) {
  var currentTarget = this.GetCurrentTargetForEvent(event);
  var obj = this._getDropObject(event);

  if (obj instanceof DvtGanttRowNode)
  {
    return 'rows';
  }
  if (obj instanceof DvtGanttTaskNode)
  {
    var targetType = this.getDnDTaskSubType(currentTarget);
    if (targetType === 'tasks' || currentTarget.getType() === 'baseline')
    {
      return 'tasks';
    }
  }
  return null;
};

/**
 * @override
 */
DvtGanttEventManager.prototype.GetDropEventPayload = function(event) {
  // Apply the drop offset if the drag source is a DVT component
  // NOTE: The drop offset is stored in dataTransfer, so it's only accessible from "drop" event. It can't be
  //       accessed from "dragEnter", "dragOver", and "dragLeave".
  var dataTransfer = event.getNativeEvent().dataTransfer;
  var offsetStart = Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_X_DATA_TYPE)) || 0;

  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
  var dropObj = this._getDropObject(event);

  if (dropObj instanceof DvtGanttRowNode || dropObj instanceof DvtGanttTaskNode)
  {
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
    if (dragObj instanceof DvtGanttTaskNode)
    {
      var taskProps = dragObj.getProps();

      var startTime = taskProps['start'];
      var endTime = taskProps['end'];
      startTime = startTime ? startTime : endTime;
      endTime = endTime ? endTime : startTime;

      var baselineStartTime = taskProps['baseline'] ? taskProps['baseline']['start'] : null;
      var baselineEndTime = taskProps['baseline'] ? taskProps['baseline']['end'] : null;
      baselineStartTime = baselineStartTime ? baselineStartTime : baselineEndTime;
      baselineEndTime = baselineEndTime ? baselineEndTime : baselineStartTime;

      var taskSource = dragObj.getDraggedObject();
      var dragSourceType = this.getDnDTaskSubType(taskSource);

      if (dragSourceType === 'tasks')
      {
        payload['start'] = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, isRTL ? ganttContentLength - (relPosLocal.x + offsetStart) : (relPosLocal.x + offsetStart), ganttContentLength);
        payload['end'] = payload['start'] + (endTime - startTime);
        if (!(baselineStartTime == null && baselineEndTime == null))
        {
          payload['baselineStart'] = new Date(baselineStartTime - startTime + payload['start']).toISOString();
          payload['baselineEnd'] = new Date(baselineEndTime - endTime + payload['end']).toISOString();
        }
        payload['start'] = new Date(payload['start']).toISOString();
        payload['end'] = new Date(payload['end']).toISOString();
      }
    }
    return payload;
  }
  return null;
};

/**
 * @override
 */
DvtGanttEventManager.prototype.ShowDropEffect = function(event) {
  var dropObj = this._getDropObject(event);
  if (dropObj && dropObj instanceof DvtGanttRowNode)
  {
    var targetElem = dropObj.getBackground().getElem();
    dvt.ToolkitUtils.addClassName(targetElem, this._gantt.GetStyleClass('activeDrop'));
  };
};

/**
 * @override
 */
DvtGanttEventManager.prototype.ShowRejectedDropEffect = function(event) {
  var dropObj = this._getDropObject(event);
  if (dropObj && dropObj instanceof DvtGanttRowNode)
  {
    var targetElem = dropObj.getBackground().getElem();
    dvt.ToolkitUtils.addClassName(targetElem, this._gantt.GetStyleClass('invalidDrop'));
  };
};

/**
 * @override
 */
DvtGanttEventManager.prototype.ClearDropEffect = function() {
  var prevDropObj = this._getDropObject();
  if (prevDropObj && prevDropObj instanceof DvtGanttRowNode)
  {
    var prevTargetElem = prevDropObj.getBackground().getElem();
    dvt.ToolkitUtils.removeClassName(prevTargetElem, this._gantt.GetStyleClass('invalidDrop'));
    dvt.ToolkitUtils.removeClassName(prevTargetElem, this._gantt.GetStyleClass('activeDrop'));
  }
};

/**
 * @override
 */
DvtGanttEventManager.prototype.OnDndDragStart = function(event) {
  DvtGanttEventManager.superclass.OnDndDragStart.call(this, event);

  // At this point, isDnDDragging should be false. If true, then something else initiated a drag, e.g. keyboard move,
  // There should only be one set of things dragging at any give time, so cancel this one.
  if (this._isDndDragging)
  {
    event.preventDefault();
  }

  var nativeEvent = event.getNativeEvent();
  if (!nativeEvent.defaultPrevented)
  {
    this._isDndDragging = true;
    this._dragStartSetup();
    var obj = this.DragSource.getDragObject();
    if (obj instanceof DvtGanttTaskNode)
    {
      obj.dragStartSetup(event);
      var dataTransfer = nativeEvent.dataTransfer;
      this._dropOffset = new dvt.Point(Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_X_DATA_TYPE)) || 0, Number(dataTransfer.getData(dvt.EventManager.DROP_OFFSET_Y_DATA_TYPE)) || 0);
    }
    else
    {
      this._dropOffset = new dvt.Point(0, 0);
    }
  }
  else
  {
    // Reenable panning
    this._gantt.SetPanningEnabled(true);
  }
};

/**
 * @override
 */
DvtGanttEventManager.prototype.OnDndDragOver = function(event) {
  DvtGanttEventManager.superclass.OnDndDragOver.call(this, event);

  // dragover event is fired every 350ms or so, even when the mouse didn't move.
  // For performance reasons, only update feedback if the mouse moved
  if (!this._prevDragOverEvent || this._prevDragOverEvent.pageX !== event.pageX || this._prevDragOverEvent.pageY !== event.pageY)
  {
    this._isDndDragging = true;

    // Need to do this here instead of onDndDrag because the drag event doesn't have pageX/Y on FF for some reason.
    var obj = this.DragSource.getDragObject();
    if (obj instanceof DvtGanttTaskNode)
    {
      if (event.getNativeEvent().defaultPrevented)
      {
        var stagePos = this._gantt.getCtx().pageToStageCoords(event.pageX, event.pageY);
        // Note, "local" here means in the reference of the affordance container coord system
        var localPos = this._gantt.getDnDArtifactsContainer().stageToLocal(stagePos);
        obj.showDragFeedback(event, localPos, this._getDropObject(), this._dropOffset);

        // For touch devices with screenreader, we're using passthru gesture (in iOS VoiceOVer, double tap and hold until tone, then drag) to perform real HTML5 drag and drop.
        // Update the aria live region with position information if the position changed due to drag.
        if (dvt.Agent.isTouchDevice())
        {
          // Only update the aria live region if what we want to be read out changed,
          // e.g. the finger may have stopped, but moved 1px by accident and we don't want what's currently being read be interrupted.
          var screenReaderDragText = dvt.StringUtils.processAriaLabel(DvtGanttTooltipUtils.getDatatip(obj, false))
          if (this._gantt.isSelectionSupported() && obj.isSelected())
          {
            var totalSelected = this._gantt.getSelectionHandler().getSelectedCount();
            if (totalSelected > 1)
            {
              screenReaderDragText += '. ' + dvt.Bundle.getTranslation(this._gantt.getOptions(), 'taskMoveSelectionInfo', '', '', [totalSelected - 1]);
            }
          }

          if (!this._prevScreenReaderDragText || this._prevScreenReaderDragText !== screenReaderDragText)
          {
            this._gantt.updateLiveRegionText(screenReaderDragText);
          }
          this._prevScreenReaderDragText = screenReaderDragText;
        }
      }
      else
        obj.removeDragFeedbacks();
    }
    this._prevDragOverEvent = event;
  }
};

/**
 * @override
 */
DvtGanttEventManager.prototype.OnDndDragEnd = function(event) {
  DvtGanttEventManager.superclass.OnDndDragEnd.call(this, event);

  var obj = this.DragSource.getDragObject();
  if (obj instanceof DvtGanttTaskNode)
  {
    obj.dragEndCleanup();
  }

  this._isDndDragging = false;
  this._dropOffset = new dvt.Point(0, 0);

  // If mouse dragging, but keyboard Esc pressed to cancel, then dropEffect is 'none'
  // This is the recommended way to detect drag cancelling according to MDN:
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragend
  // "If the dropEffect property has the value none during a dragend, then the drag was cancelled. Otherwise, the effect specifies which operation was performed."
  if (event.getNativeEvent().dataTransfer.dropEffect === 'none')
  {
    this.handleDnDCancel();
  }

  // reenabling panning on dragend and on mouseup
  // the panning is disabled on mousedown event to prevent panning for potential drag
  // if draggable source is not dragged, the component will not get dragend event and the panning is reenabled on mouseup
  // if draggable source was dragged, the component will get dragend event, but it might not get mouseup event
  this._gantt.SetPanningEnabled(true);
};

/**
 * @override
 */
DvtGanttEventManager.prototype.OnDndDrop = function(event) {
  DvtGanttEventManager.superclass.OnDndDrop.call(this, event);

  // Viewport adjustments need to be done before handling move callback (rerender may happen after move callback)
  this._dragEndCleanup();

  // If high level dnd.move enabled, fire ojMove event upon valid drop
  var nativeEvent = event.getNativeEvent();
  var options = this._gantt.getOptions();
  if (nativeEvent.defaultPrevented && options['dnd']['move'] && options['dnd']['move']['tasks'] === 'enabled')
  {
    // For touch devices with screenreader, we're using passthru gesture (in iOS VoiceOVer, double tap and hold until tone, then drag) to perform real HTML5 drag and drop.
    // Update the aria live region when drop happened (i.e. in VO, when the finger is lifted to end passthru gesture);
    if (dvt.Agent.isTouchDevice())
    {
      this._gantt.updateLiveRegionText(dvt.Bundle.getTranslation(this._gantt.getOptions(), 'taskMoveFinalized'));
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
  }
};

/**
 * Helper function that checks if a given source type is draggable
 * @param {string} type
 * @return {boolean} true if the source type can be dragged
 * @protected
 */
DvtGanttEventManager.prototype.IsDragSupported = function(type) {
  if (this.isDndSupported())
  {
    var options = this._gantt.getOptions();
    var dragConfig = options['dnd'] && options['dnd']['drag'] ? options['dnd']['drag'] : null;
    return dragConfig && dragConfig[type] && dragConfig[type]['dataTypes'];
  }
  return false;
};

/**
 * Helper function that checks if a given target type can recieve drop
 * @param {string} type
 * @return {boolean} true if the source type can recieve drop
 * @protected
 */
DvtGanttEventManager.prototype.IsDropSupported = function(type) {
  if (this.isDndSupported())
  {
    var options = this._gantt.getOptions();
    var drogConfig = options['dnd'] && options['dnd']['drop'] ? options['dnd']['drop'] : null;
    return drogConfig && drogConfig[type] && drogConfig[type]['dataTypes'];
  }
  return false;
};

/**
 * @override
 */
DvtGanttEventManager.prototype.OnMouseDown = function(event) {
  var currentTarget = this.GetCurrentTargetForEvent(event);
  var obj = this.GetLogicalObject(currentTarget);
  // If draggable, prevent drag panning
  if (obj instanceof DvtGanttTaskNode)
  {
    var sourceType = this.getDnDTaskSubType(currentTarget);
    if (this.IsDragSupported(sourceType))
    {
      this._gantt.SetPanningEnabled(false);
    }
  }
  DvtGanttEventManager.superclass.OnMouseDown.call(this, event);
};

/**
 * @override
 */
DvtGanttEventManager.prototype.HandleImmediateTouchStartInternal = function(event) {
  // If draggable, prevent drag panning
  if (event.targetTouches.length == 1)
  {
    var currentTarget = this.GetCurrentTargetForEvent(event);
    var obj = this.GetLogicalObject(currentTarget);
    if (obj instanceof DvtGanttTaskNode)
    {
      var sourceType = this.getDnDTaskSubType(currentTarget);
      if (this.IsDragSupported(sourceType))
      {
        this._gantt.SetPanningEnabled(false);
      }
    }
  }
};

/**
 * Gantt keyboard handler.
 * @param {dvt.Gantt} gantt The Gantt component.
 * @param {dvt.EventManager} manager The owning dvt.EventManager.
 * @class DvtGanttKeyboardHandler
 * @extends {dvt.TimeComponentKeyboardHandler}
 * @constructor
 */
var DvtGanttKeyboardHandler = function(gantt, manager)
{
  this.Init(gantt, manager);
};

dvt.Obj.createSubclass(DvtGanttKeyboardHandler, dvt.TimeComponentKeyboardHandler);

/**
 * @override
 */
DvtGanttKeyboardHandler.prototype.Init = function(gantt, manager)
{
  DvtGanttKeyboardHandler.superclass.Init.call(this, manager);
  this._gantt = gantt;
};

/**
 * Retrieve previous task.
 * @param {DvtGanttRowNode[]} rows
 * @param {DvtGanttRowNode} currentRow
 * @param {number} currentRowIndex
 * @return {DvtGanttTaskNode} the previous task node
 * @private
 */
DvtGanttKeyboardHandler._findPreviousTask = function(rows, currentRow, currentRowIndex)
{
  var tasks = currentRow.getTasks();
  if (tasks == null || tasks.length == 0)
  {
    if (currentRowIndex == 0)
      return null;
    else
      return DvtGanttKeyboardHandler._findPreviousTask(rows, rows[currentRowIndex - 1], currentRowIndex - 1);
  }
  else
  {
    return tasks[tasks.length - 1];
  }
};

/**
 * Retrieve next task.
 * @param {DvtGanttRowNode[]} rows
 * @param {DvtGanttRowNode} currentRow
 * @param {number} currentRowIndex
 * @return {DvtGanttTaskNode} the next task node
 * @private
 */
DvtGanttKeyboardHandler._findNextTask = function(rows, currentRow, currentRowIndex)
{
  var tasks = currentRow.getTasks();
  if (tasks == null || tasks.length == 0)
  {
    if (currentRowIndex == rows.length - 1)
      return null;
    else
      return DvtGanttKeyboardHandler._findNextTask(rows, rows[currentRowIndex + 1], currentRowIndex + 1);
  }
  else
  {
    return tasks[0];
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
DvtGanttKeyboardHandler.getNextNavigable = function(gantt, currentNavigable, event, originalNavigable) 
{
  if (currentNavigable instanceof DvtGanttTaskNode)
  {
    var currentRow = currentNavigable.getRow();
    var rows = gantt.getRows();
    var tasks = currentRow.getTasks();

    // should not happen
    if (tasks == null || tasks.length == 0)
      return;

    var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
    var rowIndex = rows.indexOf(currentRow);
    switch (event.keyCode)
    {
      case (!isRTL ? dvt.KeyboardEvent.LEFT_ARROW : dvt.KeyboardEvent.RIGHT_ARROW):
        var taskIndex = tasks.indexOf(currentNavigable);
        // check if it's the first task in the row
        if (taskIndex == 0)
        {
          // go to the last task of the previous row
          if (rowIndex > 0)
          {
            // find the previous row with task
            return DvtGanttKeyboardHandler._findPreviousTask(rows, rows[rowIndex - 1], rowIndex - 1);
          }
        }
        else
        {
          return tasks[taskIndex - 1];
        }
        break;
      case (!isRTL ? dvt.KeyboardEvent.RIGHT_ARROW : dvt.KeyboardEvent.LEFT_ARROW):
        taskIndex = tasks.indexOf(currentNavigable);
        if (taskIndex == tasks.length - 1)
        {
          // go to the first task of the next row
          if (rowIndex < rows.length - 1)
          {
            // find the next row with task
            return DvtGanttKeyboardHandler._findNextTask(rows, rows[rowIndex + 1], rowIndex + 1);
          }
        }
        else
        {
          return tasks[taskIndex + 1];
        }
        break;
      case dvt.KeyboardEvent.UP_ARROW:
        if (rowIndex > 0)
        {
          currentNavigable = DvtGanttKeyboardHandler._findPreviousTask(rows, rows[rowIndex - 1], rowIndex - 1);
          if (currentNavigable != null)
          {
            // returns the first task of the previous row
            return currentNavigable.getRow().getTasks()[0];
          }
        }
        break;
      case dvt.KeyboardEvent.DOWN_ARROW:
        if (rowIndex < rows.length - 1)
        {
          currentNavigable = DvtGanttKeyboardHandler._findNextTask(rows, rows[rowIndex + 1], rowIndex + 1);
          if (currentNavigable != null)
          {
            // returns the first task of the previous row
            return currentNavigable.getRow().getTasks()[0];
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
DvtGanttKeyboardHandler.prototype.isNavigationEvent = function(event)
{
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
DvtGanttKeyboardHandler.prototype._getDistance = function(dep)
{
  var type = dep.getType();
  var predecessor = dep.getPredecessorNode();
  var successor = dep.getSuccessorNode();

  var date1 = (type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.START_FINISH) ? predecessor.getProps()['start'] : predecessor.getProps()['end'];

  if (type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.FINISH_START)
    var date2 = successor.getProps()['start'];
  else
    date2 = successor.getProps()['end'];

  return Math.abs(date2 - date1);
};

/**
 * Get function that compares two link around a given node
 * The dependency lines are analyzed by distance from the node, which is derieved based on start and end time of the predeccessor and successor
 * @return {function} a function that compares to dependency lines around the node
 * @private
 */
DvtGanttKeyboardHandler.prototype._getDependencyComparator = function() 
{
  var self = this;
  var comparator = function(dep1, dep2) {
    var distance1 = self._getDistance(dep1);
    var distance2 = self._getDistance(dep2);

    if (distance1 < distance2)
      return -1;
    else if (distance1 > distance2)
      return 1;
    else
      return 0;
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
DvtGanttKeyboardHandler.prototype.getFirstNavigableDependencyLine = function(task, event, listOfLines)
{
  var direction = event.keyCode;
  if (!listOfLines || listOfLines.length < 1 || !task)
    return null;

  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
  var first = null;
  var min = 0;
  for (var i = 0; i < listOfLines.length; i++)
  {
    var dependencyLine = listOfLines[i];

    if (direction == dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET)
      var taskToCompare = isRTL ? dependencyLine.getPredecessor() : dependencyLine.getSuccessor();
    else
      taskToCompare = isRTL ? dependencyLine.getSuccessor() : dependencyLine.getPredecessor();

    // sanity check...
    if (task.getId() == taskToCompare)
      continue;

    var dist = this._getDistance(dependencyLine);
    if (first == null || dist < min)
    {
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
DvtGanttKeyboardHandler.prototype.getNextNavigableDependencyLine = function(task, currentDependencyLine, event, listOfLines) 
{
  if (!listOfLines)
    return null;

  if (!currentDependencyLine)
    return listOfLines[0];

  if (!task)
    return currentDependencyLine;

  listOfLines.sort(this._getDependencyComparator());

  var bForward = (event.keyCode == dvt.KeyboardEvent.DOWN_ARROW) ? true : false;
  var index = 0;
  for (var i = 0; i < listOfLines.length; i++)
  {
    var dependencyLine = listOfLines[i];
    if (dependencyLine === currentDependencyLine)
    {
      if (bForward)
        index = (i == listOfLines.length - 1) ? 0 : i + 1;
      else
        index = (i == 0) ? listOfLines.length - 1 : i - 1;
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
DvtGanttKeyboardHandler.prototype.isMoveInitiationEvent = function(event)
{
  return event.keyCode == dvt.KeyboardEvent.M && event.ctrlKey;
};

/**
 * Whether keyboard event equates to increasing navigation time scale during High level DnD Move
 * @param {dvt.KeyboardEvent} event keyboard event
 * @return {boolean} whether key strokes equate to increasing navigation time scale during move
 */
DvtGanttKeyboardHandler.prototype.isMoveScaleUpEvent = function(event)
{
  return this._eventManager.isMoveInitiated() && event.keyCode == dvt.KeyboardEvent.PAGE_UP;
};

/**
 * Whether keyboard event equates to decreasing navigation time scale during High level DnD Move
 * @param {dvt.KeyboardEvent} event keyboard event
 * @return {boolean} whether key strokes equate to decreasing navigation time scale during move
 */
DvtGanttKeyboardHandler.prototype.isMoveScaleDownEvent = function(event)
{
  return this._eventManager.isMoveInitiated() && event.keyCode == dvt.KeyboardEvent.PAGE_DOWN;
};

/**
 * Whether keyboard event equates to moving forward a unit of time scale during High level DnD Move
 * @param {dvt.KeyboardEvent} event keyboard event
 * @return {boolean} whether key strokes equate to moving forward a unit of time scale during move
 */
DvtGanttKeyboardHandler.prototype.isMoveForwardEvent = function(event)
{
  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
  return this._eventManager.isMoveInitiated() && event.keyCode == (isRTL ? dvt.KeyboardEvent.LEFT_ARROW : dvt.KeyboardEvent.RIGHT_ARROW);
};

/**
 * Whether keyboard event equates to moving backward a unit of time scale during High level DnD Move
 * @param {dvt.KeyboardEvent} event keyboard event
 * @return {boolean} whether key strokes equate to moving backward a unit of time scale during move
 */
DvtGanttKeyboardHandler.prototype.isMoveBackwardEvent = function(event)
{
  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
  return this._eventManager.isMoveInitiated() && event.keyCode == (isRTL ? dvt.KeyboardEvent.RIGHT_ARROW : dvt.KeyboardEvent.LEFT_ARROW);
};

/**
 * Whether keyboard event equates to moving up a row during High level DnD Move
 * @param {dvt.KeyboardEvent} event keyboard event
 * @return {boolean} whether key strokes equate to moving up a row during move
 */
DvtGanttKeyboardHandler.prototype.isMoveRowAboveEvent = function(event)
{
  return this._eventManager.isMoveInitiated() && event.keyCode == dvt.KeyboardEvent.UP_ARROW;
};

/**
 * Whether keyboard event equates to moving down a row during High level DnD Move
 * @param {dvt.KeyboardEvent} event keyboard event
 * @return {boolean} whether key strokes equate to moving down a row during move
 */
DvtGanttKeyboardHandler.prototype.isMoveRowBelowEvent = function(event)
{
  return this._eventManager.isMoveInitiated() && event.keyCode == dvt.KeyboardEvent.DOWN_ARROW;
};

/**
 * Whether keyboard event equates to finalizing a High level DnD Move
 * @param {dvt.KeyboardEvent} event keyboard event
 * @return {boolean} whether key strokes equate to finalizing a move
 */
DvtGanttKeyboardHandler.prototype.isMoveFinalizeEvent = function(event)
{
  return this._eventManager.isMoveInitiated() && event.keyCode == dvt.KeyboardEvent.ENTER;
};

/**
 * Whether keyboard event equates to cancelling a (high level) DnD dragging operation (dragging via keyboard)
 * Note that the cancelling a DnD drag (dragging via mouse) via keyboard Esc is detected in dragEnd event instead of 
 * through keyboard events, which are not fired.
 * @param {dvt.KeyboardEvent} event keyboard event
 * @return {boolean} whether key strokes equate to cancelling a move
 */
DvtGanttKeyboardHandler.prototype.isDnDCancelEvent = function(event)
{
  return this._eventManager.isDnDDragging() && event.keyCode == dvt.KeyboardEvent.ESCAPE;
};

/**
 * @override
 */
DvtGanttKeyboardHandler.prototype.processKeyDown = function(event) 
{
  var keyCode = event.keyCode;
  if (keyCode == dvt.KeyboardEvent.TAB)
  {
    var currentNavigable = this._eventManager.getFocus();
    if (currentNavigable)
    {
      dvt.EventManager.consumeEvent(event);
      return currentNavigable;
    }
    else
    {
      // navigate to the default
      var rows = this._gantt.getRows();
      if (rows != null && rows.length > 0)
      {
        var tasks = rows[0].getTasks();
        if (tasks != null && tasks.length > 0)
        {
          dvt.EventManager.consumeEvent(event);
          // Was 'this.getDefaultNavigable(tasks);', but that method looks at the
          // svg bounding box, which includes labels and baseline elements, and looks at
          // the left/right-most element in LTR/RTL based on these bounding boxes. The labels
          // and variance tasks can mess up this logic though, so just return first task,
          // which is gauranteed to the chronologically first since we sorted them.
          // This is obviously also more performant.
          return tasks[0];
        }
      }
    }
  }
  if (this.isMoveInitiationEvent(event))
  {
    var currentNavigable = this._eventManager.getFocus();
    if (currentNavigable)
    {
      this._eventManager.handleMoveInitiation(event, currentNavigable);
      dvt.EventManager.consumeEvent(event);
      return null;
    }
  }
  if (this.isDnDCancelEvent(event))
  {
    this._eventManager.handleDnDCancel();
    dvt.EventManager.consumeEvent(event);
    return null;
  }
  if (this.isMoveScaleUpEvent(event))
  {
    this._eventManager.handleMoveScaleUp(event);
    dvt.EventManager.consumeEvent(event);
    return null;
  }
  if (this.isMoveScaleDownEvent(event))
  {
    this._eventManager.handleMoveScaleDown(event);
    dvt.EventManager.consumeEvent(event);
    return null;
  }
  if (this.isMoveForwardEvent(event))
  {
    this._eventManager.handleMoveForward(event);
    dvt.EventManager.consumeEvent(event);
    return null;
  }
  if (this.isMoveBackwardEvent(event))
  {
    this._eventManager.handleMoveBackward(event);
    dvt.EventManager.consumeEvent(event);
    return null;
  }
  if (this.isMoveRowAboveEvent(event))
  {
    this._eventManager.handleMoveRowAbove(event);
    dvt.EventManager.consumeEvent(event);
    return null;
  }
  if (this.isMoveRowBelowEvent(event))
  {
    this._eventManager.handleMoveRowBelow(event);
    dvt.EventManager.consumeEvent(event);
    return null;
  }
  if (this.isMoveFinalizeEvent(event))
  {
    this._eventManager.handleMoveFinalize(event);
    dvt.EventManager.consumeEvent(event);
    return null;
  }

  return DvtGanttKeyboardHandler.superclass.processKeyDown.call(this, event);
};

/**
 * Gantt JSON Parser
 * @class
 * @constructor
 * @extends {dvt.Obj}
 */
var DvtGanttParser = function() {
};

dvt.Obj.createSubclass(DvtGanttParser, dvt.Obj);

/**
 * Parses the specified XML String and returns the root node of the gantt
 * @param {string} options The String containing XML describing the component.
 * @return {object} An object containing the parsed properties
 */
DvtGanttParser.prototype.parse = function(options)
{
  var ret = new Object();

  var parseDateOption = function(key) {
    var optionType = typeof options[key];
    // Ensures date option is of type number or string,
    // e.g. excludes Date object type
    // TODO: Remove number type support after complete
    // deprecation in future release
    if (optionType === 'number' || optionType === 'string')
    {
      var time = (new Date(options[key]).getTime());
      if (!isNaN(time))
        return time;
    }
    return null;
  };

  ret.start = parseDateOption('start');
  ret.end = parseDateOption('end');

  if (options['viewportStart'])
    ret.viewStart = parseDateOption('viewportStart');
  if (options['viewportEnd'])
    ret.viewEnd = parseDateOption('viewportEnd');

  ret.rows = options['rows'];
  ret.dependencies = options['dependencies'];

  ret.axisPosition = 'top';
  if (options['axisPosition'] != null)
    ret.axisPosition = options['axisPosition'];

  ret.selectionMode = 'none';
  if (options['selectionMode'] != null)
    ret.selectionMode = options['selectionMode'];

  ret.horizontalGridline = 'hidden';
  ret.verticalGridline = 'hidden';
  if (options['gridlines'] != null)
  {
    if (options['gridlines']['horizontal'] != null)
      ret.horizontalGridline = options['gridlines']['horizontal'];

    if (options['gridlines']['vertical'] != null)
      ret.verticalGridline = options['gridlines']['vertical'];
  }

  ret.xScrollbar = 'off';
  ret.yScrollbar = 'off';
  if (options['scrollbars'])
  {
    if (options['scrollbars']['horizontal'])
      ret.xScrollbar = options['scrollbars']['horizontal'];

    if (options['scrollbars']['vertical'])
      ret.yScrollbar = options['scrollbars']['vertical'];
  }

  ret.isIRAnimationEnabled = options['animationOnDisplay'] == 'auto';
  ret.isDCAnimationEnabled = options['animationOnDataChange'] == 'auto';

  if (options['rowAxis'] != null)
  {
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
 * Renderer for dvt.Gantt.
 * @class
 */
var DvtGanttRenderer = {};

dvt.Obj.createSubclass(DvtGanttRenderer, dvt.Obj);

/**
 * Renders the Gantt.
 * @param {dvt.Gantt} gantt The Gantt chart being rendered.
 */
DvtGanttRenderer.renderGantt = function(gantt)
{
  DvtGanttRenderer._renderBackground(gantt);
  DvtGanttRenderer._renderScrollableCanvas(gantt);

  // Prepare initial render animation
  gantt.getAnimationManager().preAnimateGanttIR(gantt);

  // remove any empty text first if present
  gantt.removeEmptyText();

  if (gantt.hasValidOptions())
  {
    DvtGanttRenderer._prepareTaskFillFilters(gantt);

    gantt.renderTimeZoomCanvas(gantt._canvas);

    var timeZoomCanvas = gantt.getTimeZoomCanvas();
    DvtGanttRenderer._renderAxes(gantt, timeZoomCanvas);
    DvtGanttRenderer._renderDatabodyBackground(gantt, timeZoomCanvas);
    DvtGanttRenderer._renderVerticalGridline(gantt, timeZoomCanvas);
    if (gantt.isRowAxisEnabled())
      gantt.getRowAxis().adjustPosition();

    DvtGanttRenderer._renderRows(gantt, timeZoomCanvas);
    DvtGanttRenderer._renderDependencies(gantt, timeZoomCanvas);

    DvtGanttRenderer._renderReferenceObjects(gantt, timeZoomCanvas);

    DvtGanttRenderer._renderZoomControls(gantt);

    // Render DnD affordances container on the very top of the chart area.
    if (gantt.isDndEnabled())
      DvtGanttRenderer._renderDnDArtifactsContainer(gantt, timeZoomCanvas);

    // Initial Selection
    gantt._processInitialSelections();

    if (gantt.isTimeDirScrollbarOn() || gantt.isContentDirScrollbarOn())
      DvtGanttRenderer._renderScrollbars(gantt, gantt);
  }
  else
  {
    DvtGanttRenderer._renderEmptyText(gantt);
  }
};

/**
 * Adds the feColorMatrix filters (used for task shape/progress/variance etc fill overlays)
 * to the page's shared defs if they don't exist already (so that multiple gantts on a page can share them).
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @private
 */
DvtGanttRenderer._prepareTaskFillFilters = function(gantt)
{
  if (!document.getElementById(DvtGanttStyleUtils.getTaskTintFilterId()))
  {
    // overlay fill with rgba(255, 255, 255, tintAlpha);
    var tintAlpha = DvtGanttStyleUtils.getTaskTintAlpha();
    var taskTintFilter = dvt.SvgShapeUtils.createElement('filter', DvtGanttStyleUtils.getTaskTintFilterId());
    var taskTintColorMatrix = dvt.SvgShapeUtils.createElement('feColorMatrix');
    taskTintColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
    taskTintColorMatrix.setAttribute('type', 'matrix');
    taskTintColorMatrix.setAttribute('values',
        (1 - tintAlpha) + ' 0 0 0 ' + tintAlpha +
        ' 0 ' + (1 - tintAlpha) + ' 0 0 ' + tintAlpha +
        ' 0 0 ' + (1 - tintAlpha) + ' 0 ' + tintAlpha +
        ' 0 0 0 1 0');
    taskTintFilter.appendChild(taskTintColorMatrix);

    // overlay fill with rgba(0, 0, 0, shadeAlpha);
    var shadeAlpha = DvtGanttStyleUtils.getTaskShadeAlpha();
    var taskShadeFilter = dvt.SvgShapeUtils.createElement('filter', DvtGanttStyleUtils.getTaskShadeFilterId());
    var taskShadeColorMatrix = dvt.SvgShapeUtils.createElement('feColorMatrix');
    taskShadeColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
    taskShadeColorMatrix.setAttribute('type', 'matrix');
    taskShadeColorMatrix.setAttribute('values',
        (1 - shadeAlpha) + ' 0 0 0 0' +
        ' 0 ' + (1 - shadeAlpha) + ' 0 0 0' +
        ' 0 0 ' + (1 - shadeAlpha) + ' 0 0' +
        ' 0 0 0 1 0');
    taskShadeFilter.appendChild(taskShadeColorMatrix);

    // Add the filters to the shared defs
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
DvtGanttRenderer._prerenderTimeDirScrollbar = function(gantt, container, availSpace)
{
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
DvtGanttRenderer._prerenderContentDirScrollbar = function(gantt, container, availSpace)
{
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
DvtGanttRenderer._renderScrollbars = function(gantt, container)
{
  var databody = gantt.getDatabody();
  if (databody == null)
  {
    // Remove any previously rendered scrollbars
    if (gantt._scrollbarsCanvas != null)
      gantt._scrollbarsCanvas.removeChildren();
    return;
  }

  var databodyStart = gantt.getDatabodyStart();
  var context = gantt.getCtx();
  var scrollbarPadding = gantt.getScrollbarPadding();
  if (gantt._scrollbarsCanvas == null)
  {
    gantt._scrollbarsCanvas = new dvt.Container(context, 'sbCanvas');
    container.addChild(gantt._scrollbarsCanvas);
  }
  else
    gantt._scrollbarsCanvas.removeChildren();

  if (gantt.isTimeDirScrollbarOn())
  {
    var availSpaceWidth = gantt.getCanvasLength();
    var availSpaceHeight = gantt.Height - scrollbarPadding;
    var timeDirScrollbarDim = DvtGanttRenderer._prerenderTimeDirScrollbar(gantt, gantt._scrollbarsCanvas, new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight));
  }
  if (gantt.isContentDirScrollbarOn())
  {
    availSpaceWidth = gantt.Width - scrollbarPadding;
    availSpaceHeight = gantt.getCanvasSize() - gantt.getAxesHeight();
    var contentDirScrollbarDim = DvtGanttRenderer._prerenderContentDirScrollbar(gantt, gantt._scrollbarsCanvas, new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight));
  }

  if (gantt.timeDirScrollbar)
  {
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

  if (gantt.contentDirScrollbar)
  {
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
    if (gantt.getAxisPosition() == 'bottom')
      bottomOffset = gantt.getAxesHeight();
    gantt.contentDirScrollbar.setViewportRange(databody.getTranslateY() - (gantt.getCanvasSize() - databodyStart - bottomOffset), databody.getTranslateY());
  }
};

/**
 * Renders the row axis.
 * @param {dvt.Gantt} gantt The Gantt being rendered.
 * @param {dvt.Container} container The container to render the row axis into.
 */
DvtGanttRenderer.renderRowAxis = function(gantt, container)
{
  var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
  var rowAxis = gantt.getRowAxis();

  if (gantt.isRowAxisEnabled())
  {
    if (!rowAxis)
    {
      rowAxis = new DvtGanttRowAxis(gantt);
      rowAxis.setPixelHinting(true);
      container.addChild(rowAxis);
      gantt.setRowAxis(rowAxis);
    }

    // render and figure out width
    rowAxis.render(gantt.Width - DvtGanttStyleUtils.getRowAxisGap(), container == null);

    var rowAxisWidth = rowAxis.getWidth();
    var rowAxisSpace = rowAxisWidth + DvtGanttStyleUtils.getRowAxisGap();
    gantt._backgroundWidth = gantt._backgroundWidth - rowAxisSpace;
    if (!isRTL)
    {
      gantt._widthOffset = gantt._widthOffset + rowAxisSpace;
      gantt.setStartXOffset(gantt.getStartXOffset() + rowAxisSpace);
    }
    gantt._canvasLength = gantt._canvasLength - rowAxisSpace;
  }
  else
  {
    // potentially rerender with rowAxis.rendered off when on before.
    if (container)
      container.removeChild(rowAxis);
  }
};

/**
 * Renders the background of Gantt.
 * @param {dvt.Gantt} gantt The Gantt being rendered.
 * @private
 */
DvtGanttRenderer._renderBackground = function(gantt)
{
  var width = gantt._backgroundWidth;
  var height = gantt._backgroundHeight;
  if (gantt._background)
  {
    gantt._background.setClipPath(null);
    gantt._background.setWidth(width);
    gantt._background.setHeight(height);
    gantt._background.setX(gantt._widthOffset);
  }
  else
    gantt._background = new dvt.Rect(gantt.getCtx(), gantt._widthOffset, 0, width, height, 'bg');

  // Override specified border with double border to fix stroke rendering:
  // If stroke-width is 1px, then there is 0.5px border on each side of the edge, and because svg is
  // not pixel aware, in cases where the edge is between two pixels (e.g. on resize), the 0.5px doesn't show up, and the
  // entire stroke disappear. Fix is to double up the pixel so there there is always > 0.5px on each side of the edge
  // and use a clippath to hide the inner half of the stroke to maintain stroke width.
  gantt._background.SetSvgProperty('style', 'stroke-width:' + (gantt._borderWidth * 2) + 'px');

  gantt._background.setClassName(gantt.GetStyleClass('databody'));
  gantt._background.setPixelHinting(true);

  var cp = new dvt.ClipPath();
  cp.addRect(gantt._widthOffset, 0, width, height);
  gantt._background.setClipPath(cp);

  if (gantt._background.getParent() != gantt)
    gantt.addChild(gantt._background);
};

/**
 * Renders the container for row backgrounds; this separate container is necessary to ensure correct layering.
 * This container would be placed behind vertical gridlines, and other row contents (e.g. tasks) 
 * would be placed above the vertical gridlines.
 * @param {dvt.Gantt} gantt The gantt component.
 * @param {dvt.Container=} container The container to render the background container into.
 * @private
 */
DvtGanttRenderer._renderDatabodyBackground = function(gantt, container)
{
  var databodyBackground = gantt.getDatabodyBackground();
  if (databodyBackground == null)
  {
    databodyBackground = new dvt.Container(gantt.getCtx());
    container.addChild(databodyBackground);
    gantt.setDatabodyBackground(databodyBackground);

    // Initial state: show from the top
    databodyBackground.setTranslateY(gantt.getDatabodyStart());
  }

  var cp = new dvt.ClipPath();
  cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
  databodyBackground.setClipPath(cp);

  // Ensure databodyBackground translateY is within bounds
  databodyBackground.setTranslateY(gantt.getBoundedContentTranslateY(databodyBackground.getTranslateY()));
};

/**
 * Renders the container DnD affordances. This container should be layered on top of all chart area elements.
 * @param {dvt.Gantt} gantt The gantt component.
 * @param {dvt.Container=} container The container to render into.
 * @private
 */
DvtGanttRenderer._renderDnDArtifactsContainer = function(gantt, container)
{
  var artifactsContainer = gantt.getDnDArtifactsContainer();
  if (artifactsContainer == null)
  {
    artifactsContainer = new dvt.Container(gantt.getCtx());
    gantt.setDnDArtifactsContainer(artifactsContainer);

    // Initial state: show from the top
    artifactsContainer.setTranslateY(gantt.getDatabodyStart());
  }
  container.addChild(artifactsContainer); // ensure topmost layering even on rerender

  var cp = new dvt.ClipPath();
  cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
  artifactsContainer.setClipPath(cp);

  // Ensure artifactsContainer translateY is within bounds
  artifactsContainer.setTranslateY(gantt.getBoundedContentTranslateY(artifactsContainer.getTranslateY()));
};

/**
 * Renders the scrollable canvas of the Gantt chart.
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @private
 */
DvtGanttRenderer._renderScrollableCanvas = function(gantt)
{
  if (gantt._canvas)
    return;
  gantt._canvas = new dvt.Container(gantt.getCtx(), 'canvas');
  gantt.addChild(gantt._canvas);
};

/**
 * Renders the time axis of a Gantt chart.
 * @param {dvt.Gantt} gantt The Gantt chart being rendered.
 * @param {dvt.Container} container The container to render into.
 * @private
 */
DvtGanttRenderer._renderAxes = function(gantt, container)
{
  var majorAxis = gantt.getMajorAxis();
  var minorAxis = gantt.getMinorAxis();
  var axisPosition = gantt.getAxisPosition();

  if (axisPosition == 'top')
  {
    var axisStart = 0;
    if (majorAxis)
    {
      DvtGanttRenderer._renderAxis(gantt, container, majorAxis, axisStart, gantt.getAxisHeight());
      axisStart = axisStart + majorAxis.getSize();
    }

    if (minorAxis)
    {
      DvtGanttRenderer._renderAxis(gantt, container, minorAxis, axisStart, gantt.getAxisHeight());
      axisStart = axisStart + minorAxis.getSize();
    }

    gantt.setDatabodyStart(axisStart);
  }
  else
  {
    axisStart = gantt._canvasSize;

    if (majorAxis)
    {
      // _renderAxis needs to be called before calling timeAxis.getSize:
      DvtGanttRenderer._renderAxis(gantt, container, majorAxis, null, gantt.getAxisHeight());
      axisStart = axisStart - majorAxis.getSize();
      DvtGanttRenderer._positionAxis(majorAxis, axisStart);
    }

    if (minorAxis)
    {
      // _renderAxis needs to be called before calling timeAxis.getSize:
      DvtGanttRenderer._renderAxis(gantt, container, minorAxis, axisStart, gantt.getAxisHeight());
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
DvtGanttRenderer._renderAxis = function(gantt, container, timeAxis, axisStart, axisSize)
{
  if (timeAxis.getParent() !== container)
    container.addChild(timeAxis);

  timeAxis.render(null, gantt.getContentLength(), axisSize);

  if (axisStart != null)
    DvtGanttRenderer._positionAxis(timeAxis, axisStart);
};

/**
 * Positions the given time axis
 * @param {dvt.TimeAxis} timeAxis The time axis
 * @param {number} axisStart The y position the axis should be positioned to.
 * @private
 */
DvtGanttRenderer._positionAxis = function(timeAxis, axisStart)
{
  var posMatrix = new dvt.Matrix(1, 0, 0, 1, 0, axisStart);
  timeAxis.setMatrix(posMatrix);
};

/**
 * Renders the zoom controls of a gantt.
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @private
 */
DvtGanttRenderer._renderZoomControls = function(gantt)
{
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
      'disabledBorderColor': DvtGanttStyleUtils.getZoomInButtonDisabledBorderColor(resources),
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

  if (isRTL)
    var transX = gantt.getStartXOffset() + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;
  else
    transX = (gantt.getCanvasLength() + gantt.getStartXOffset()) - (DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER);

  zoomControlProperties['zoomInProps']['posX'] = transX;
  zoomControlProperties['zoomOutProps']['posX'] = transX;

  var yOffset = gantt._startY + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;
  if (gantt.getAxisPosition() == 'top')
    var transY = yOffset;
  else
    transY = gantt._backgroundHeight - yOffset;

  if (gantt.getAxisPosition() == 'top')
  {
    var zoomInPosY = transY;
    var zoomOutPosY = transY + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_SPACING;
  }
  else
  {
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
DvtGanttRenderer._renderEmptyText = function(gantt, noData)
{
  // Get the empty text string
  if (noData)
  {
    // If there are rows shown (i.e. from previous render), clear them (see )
    var databody = gantt.getDatabody();
    if (databody && databody.getParent())
    {
      databody.getParent().removeChild(databody);
      gantt.setDatabody(null);
    }
    gantt.setRows(null);

    var emptyTextStr = dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'NO_DATA', null);
    gantt.removeEmptyText();
  }
  else
  {
    emptyTextStr = dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'INVALID_DATA', null);
    gantt.clearComponent();
  }

  var text = dvt.TextUtils.renderEmptyText(gantt._canvas, emptyTextStr,
      new dvt.Rectangle(0, 0, gantt._backgroundWidth, gantt._backgroundHeight),
      gantt.EventManager, null);
  text.setClassName(gantt.GetStyleClass('nodata'));

  gantt.setEmptyText(text);
};

/**
 * Renders the databody
 * @param {dvt.Gantt} gantt the gantt component.
 * @param {dvt.Container=} container the container to add the databody to.
 * @private
 */
DvtGanttRenderer._renderDatabody = function(gantt, container)
{
  var databody = gantt.getDatabody();
  if (databody == null)
  {
    databody = new dvt.Container(gantt.getCtx(), 'db');
    container.addChild(databody);
    gantt.setDatabody(databody);

    // Initial state: show from the top
    databody.setTranslateY(gantt.getDatabodyStart());
    if (gantt.isRowAxisEnabled())
      gantt.getRowAxis().setTranslateY(gantt.getDatabodyStart() + gantt.getStartYOffset());
  }

  var cp = new dvt.ClipPath();
  cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
  databody.setClipPath(cp);

  // Ensure databody translateY is within bounds
  databody.setTranslateY(gantt.getBoundedContentTranslateY(databody.getTranslateY()));
};

/**
 * Renders vertical grid lines
 * @param {dvt.Gantt} gantt The Gantt component
 * @param {dvt.Container} container The container to render into.
 * @private
 */
DvtGanttRenderer._renderVerticalGridline = function(gantt, container)
{
  // remove all existing gridlines regardless whether it was visible/hidden
  var gridlines = gantt.getVerticalGridlines();
  if (gridlines != null)
  {
    gridlines.removeChildren();
  }

  if (gantt.isVerticalGridlinesVisible())
  {
    if (gridlines == null)
    {
      gridlines = new dvt.Container(gantt.getCtx());
      container.addChild(gridlines);
      gantt.setVerticalGridlines(gridlines);
    }

    var gridlineStyleClass = gantt.GetStyleClass('vgridline');

    var timeAxis = gantt.getMajorAxis();
    if (timeAxis == null || gantt.getOptions()['minorGridline'])
      timeAxis = gantt.getMinorAxis();

    var lines = timeAxis.getElem().getElementsByTagName('line');
    for (var i = 0; i < lines.length; i++)
    {
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
DvtGanttRenderer._renderReferenceObjects = function(gantt, container)
{
  var context = gantt.getCtx();
  var isRTL = dvt.Agent.isRightToLeft(context);

  var minTime = gantt.getStartTime();
  var maxTime = gantt.getEndTime();
  var width = gantt.getContentLength();

  var referenceObjects = gantt.getReferenceObjects();
  var referenceObjectsContainer = gantt.getReferenceObjectsContainer();
  var renderedReferenceObjects = gantt.getRenderedReferenceObjects();
  if (referenceObjects)
  {
    var newReferenceObjects = [];
    var maxRefObjects = Math.min(1, referenceObjects.length); // For now, only render first referenceObject
    if (referenceObjectsContainer == null)
    {
      referenceObjectsContainer = new dvt.Container(context);
      gantt.setReferenceObjectsContainer(referenceObjectsContainer);

      renderedReferenceObjects = [];
    }
    // Note on rerender, this is called as well, to make sure ref objects are always on top of everything else
    container.addChild(referenceObjectsContainer);

    for (var i = 0; i < maxRefObjects; i++)
    {
      var referenceObject = referenceObjects[i];
      if (referenceObject)
      {
        var value = referenceObject['value'];
        var valueTime = new Date(value).getTime();
        // value only supports number or string type, e.g. excludes Date object type
        // TODO: Remove number type support after complete deprecation in future release
        if (value != null && !isNaN(valueTime) && (typeof value === 'number' || typeof value === 'string'))
        {
          var pos = dvt.TimeAxis.getDatePosition(minTime, maxTime, valueTime, width);
          if (isRTL)
            pos = width - pos;

          // If old reference objects present in the DOM, reuse them:
          var ref = renderedReferenceObjects.pop();
          if (ref != null)
          {
            ref.setX1(pos);
            ref.setY1(gantt.getDatabodyStart());
            ref.setX2(pos);
            ref.setY2(gantt.getDatabodyStart() + gantt._canvasSize - gantt.getAxesHeight());
          }
          else
          {
            ref = new dvt.Line(gantt.getCtx(), pos, gantt.getDatabodyStart(), pos, gantt.getDatabodyStart() + gantt._canvasSize - gantt.getAxesHeight());
            ref.setPixelHinting(true);
          }

          if (ref.getParent() != referenceObjectsContainer)
            referenceObjectsContainer.addChild(ref);
          newReferenceObjects.push(ref);

          var inlineStyle = referenceObject['svgStyle'];
          if (inlineStyle)
          {
            // TODO: once we fully deprecate string type in 4.0.0, remove the string logic
            if (typeof inlineStyle === 'string' || inlineStyle instanceof String)
              dvt.ToolkitUtils.setAttrNullNS(ref.getElem(), 'style', inlineStyle);
            else
              ref.setStyle(inlineStyle); // works if style is object
          }

          var defaultStyleClass = gantt.GetStyleClass('referenceObject');
          var styleClass = referenceObject['svgClassName'];
          if (styleClass)
            styleClass = defaultStyleClass + ' ' + styleClass;
          else
            styleClass = defaultStyleClass;
          ref.setClassName(styleClass, true);
        }
      }
    }

    // Any remaining old reference objects are removed
    for (var j = 0; j < renderedReferenceObjects.length; j++)
    {
      var uselessRef = renderedReferenceObjects[j];
      uselessRef.getParent().removeChild(uselessRef);
    }

    gantt.setRenderedReferenceObjects(newReferenceObjects);
  }
  else
  {
    // clear any existing reference objects
    if (referenceObjectsContainer)
      referenceObjectsContainer.removeChildren();
    gantt.setRenderedReferenceObjects([]);
  }
};

/**
 * Render rows
 * @param {dvt.Gantt} gantt The gantt component
 * @param {dvt.Container} container The container to render into
 * @private
 */
DvtGanttRenderer._renderRows = function(gantt, container)
{
  var options = gantt.getOptions();
  var rows = options['rows'];
  var isRowsCleanable = rows != null ? DvtGanttRenderer._prerenderRows(rows) : false;
  if (gantt.isRowAxisEnabled())
    var rowLabelContents = gantt.getRowAxis().getRowLabelContents();

  if (!isRowsCleanable || rows.length == 0)
  {
    DvtGanttRenderer._renderEmptyText(gantt, true);
    return;
  }

  DvtGanttRenderer._renderDatabody(gantt, container);

  var top = 0;
  var databody = gantt.getDatabody();

  var horizontalLineHeightOffset = 0;
  if (gantt.isHorizontalGridlinesVisible())
    horizontalLineHeightOffset = DvtGanttStyleUtils.getHorizontalGridlineWidth(options);

  // Cache the base task label style dvt.CSSStyle object; it's expensive to instantiate one
  // each time we render a task label.
  gantt.getCache().putToCache('baseTaskLabelCSSStyle', DvtGanttStyleUtils.getTaskLabelStyle(options));

  if (!gantt.getRows())
  {
    var rowNodes = [];
    for (var i = 0; i < rows.length; i++)
    {
      var rowNode = new DvtGanttRowNode(gantt, rows[i], i, top);
      if (rowLabelContents)
      {
        var rowLabelContent = rowLabelContents[i];
        rowNode.setRowLabelContent(rowLabelContent);
      }

      rowNode.render(databody);
      rowNodes.push(rowNode);

      top = top + rowNode.getRowHeight() + horizontalLineHeightOffset;
    }
    top = top - horizontalLineHeightOffset; // last row
  }
  else
  {
    rowNodes = DvtGanttRenderer._generateRowNodes(gantt, container);
    for (i = 0; i < rowNodes.length; i++)
    {
      rowNode = rowNodes[i];
      rowNode.setTop(top);
      if (rowLabelContents)
      {
        var rowLabelContent = rowLabelContents[i];
        rowNode.setRowLabelContent(rowLabelContent);
      }

      // for data change animations, row elements need to be in the correct order
      // in the DOM tree to get desired layering. E.g. if row A is above row B, and if
      // row B shifts up, we want to see elements of row B be layered on top of elements
      // of row A when they cross path. There is a slight performance hit by ensuring this layering
      // so we avoid this in the non-animation case.
      if (gantt.isDCAnimationEnabled) // data change animation
        rowNode.render(databody, i);
      else
        rowNode.render(databody);

      top = top + rowNode.getRowHeight() + horizontalLineHeightOffset;
    }
    top = top - horizontalLineHeightOffset; // last row
  }

  gantt.setRows(rowNodes);
  gantt.setContentHeight(top);

  // Ensure the row dependent content containers' translateY is within bounds
  // Note that dependency lines container and scrollbars are treated separately in their render calls
  var dndArtifactsContainer = gantt.getDnDArtifactsContainer();
  var databodyBackground = gantt.getDatabodyBackground();
  var labelContainer = gantt.getRowAxis();
  databody.setTranslateY(gantt.getBoundedContentTranslateY(databody.getTranslateY()));
  databodyBackground.setTranslateY(gantt.getBoundedContentTranslateY(databodyBackground.getTranslateY()));
  if (gantt.isDndEnabled() && dndArtifactsContainer)
    dndArtifactsContainer.setTranslateY(gantt.getBoundedContentTranslateY(dndArtifactsContainer.getTranslateY()));
  if (gantt.isRowAxisEnabled() && labelContainer)
    labelContainer.setTranslateY(gantt.getBoundedContentTranslateY(labelContainer.getTranslateY()));
};

/**
 * Pre render rows setup: check to see that row ids are present. If not,
 * and there's a single task in the row, use the task id. Otherwise return false.
 * If all the rows are cleaned up/checked successfully, return true.
 * @param {object} rows The rows data object.
 * @return {boolean} whether the rows are cleaned/checked successfully.
 * @private
 */
DvtGanttRenderer._prerenderRows = function(rows)
{
  for (var i = 0; i < rows.length; i++)
  {
    var row = rows[i];
    var rowId = row['id'];
    if (rowId == null)
    {
      var tasks = row['tasks'];
      if (tasks.length == 1)
        row['id'] = tasks[0]['id'];
      else
        return false;
    }
  }
  return true;
};

/**
 * Intelligently generate a new set of row nodes according to new data.
 * Compares new data with current data, track differences, assign animation states, and decide what stays
 * on the screen and what doesn't.
 * Runs in O(cn) time, but the constant c is not very good. Still better than brute force O(n^2) comparison.
 * @param {dvt.Gantt} gantt The gantt component
 * @return {DvtGanttRowNodes[]} An array of DvtGanttRowNodes according to new data and current data comparisons.
 * @private
 */
DvtGanttRenderer._generateRowNodes = function(gantt)
{
  var oldRowNodes = gantt.getRows();
  var newRows = gantt.getRowsData();
  var newRowNodes = [];

  var oldRowIdRowNodeMap = {};
  var oldTaskIdRowIdMap = {};

  // Initially mark everything old as 'delete'
  for (var i = 0; i < oldRowNodes.length; i++)
  {
    var oldRowNode = oldRowNodes[i];
    oldRowNode.setRenderState('delete');
    oldRowIdRowNodeMap[oldRowNode.getId()] = oldRowNode;

    var oldRowNodeTaskNodes = oldRowNode.getTasks();
    for (var j = 0; j < oldRowNodeTaskNodes.length; j++)
    {
      var oldRowNodeTaskNode = oldRowNodeTaskNodes[j];
      oldRowNodeTaskNode.setRenderState('delete');
      if (oldRowNodeTaskNode.isSelected())
      {
        oldRowNodeTaskNode.setSelected(false);
      }
      oldTaskIdRowIdMap[oldRowNodeTaskNode.getProps()['id']] = [oldRowNode.getId(), oldRowNodeTaskNode];
    }
  }

  var taskDefaults = gantt.getOptions()['taskDefaults'];
  var deferredNewTaskNodeProps = {};

  // Determine states of new stuff
  for (var i = 0; i < newRows.length; i++)
  {
    var newRow = newRows[i];
    var rowId = newRow['id'];
    var tasks = newRow['tasks'];

    var rowNode = oldRowIdRowNodeMap[rowId];
    if (rowNode) // row exist
    {
      rowNode.setRenderState('exist');

      for (var j = 0; j < tasks.length; j++)
      {
        var task = tasks[j];
        var taskId = task['id'];

        if (rowNode.isTaskVisible(task))
        {
          var taskProps = rowNode.mergeTaskDefaults(task, taskDefaults);
          var rowIdtaskNode = oldTaskIdRowIdMap[taskId];
          if (rowIdtaskNode)
          {
            var taskRowId = rowIdtaskNode[0];
            var taskNode = rowIdtaskNode[1];
            if (taskRowId === rowId) // task exist, same row
            {
              taskNode.setRenderState('exist');
            }
            else // task exist, different row
            {
              taskNode.setRenderState('migrate');
              oldRowIdRowNodeMap[taskRowId].removeTask(taskNode);
              rowNode.addTask(taskNode);
            }
            taskNode.setProps(taskProps);
            taskNode.setRow(rowNode);
          }
          else // new task
          {
            // Defer creating new task; see if we can use a refurbished one later for better performance
            var deferredTaskPropsArray = deferredNewTaskNodeProps[rowId];
            if (deferredTaskPropsArray)
            {
              deferredTaskPropsArray.push(taskProps);
            }
            else
            {
              deferredNewTaskNodeProps[rowId] = [taskProps];
            }
          }
        }
      }
    }
    else // new row
    {
      rowNode = new DvtGanttRowNode(gantt, newRow, i);
      rowNode.setRenderState('add');

      for (var j = 0; j < tasks.length; j++)
      {
        var task = tasks[j];
        var taskId = task['id'];

        if (rowNode.isTaskVisible(task))
        {
          var taskProps = rowNode.mergeTaskDefaults(task, taskDefaults);
          var rowIdtaskNode = oldTaskIdRowIdMap[taskId];
          if (rowIdtaskNode)
          {
            var taskRowId = rowIdtaskNode[0];
            var taskNode = rowIdtaskNode[1];
            if (taskNode) // task migrated from a different row
            {
              taskNode.setRenderState('migrate');
              oldRowIdRowNodeMap[taskRowId].removeTask(taskNode);
            }
          }
          else // new task
          {
            taskNode = new DvtGanttTaskNode(gantt, rowNode, taskProps);
            taskNode.setRenderState('add');
          }
          rowNode.addTask(taskNode);
          taskNode.setProps(taskProps);
          taskNode.setRow(rowNode);
        }
      }
    }
    rowNode.setIndex(i);
    rowNode.setProps(newRow);
    newRowNodes.push(rowNode);
  }

  // Clear whatever came out of the sieve, and create any remaining new task nodes (from refurbished ones if any)
  // Iterate backwards to preserve indices of loop as we remove
  for (var i = oldRowNodes.length - 1; i >= 0; i--)
  {
    var oldRowNode = oldRowNodes[i];
    if (oldRowNode.getRenderState() === 'delete')
    {
      oldRowNode.remove();
    }
    else
    {
      var deferredTaskPropsArray = deferredNewTaskNodeProps[oldRowNode.getId()];
      var oldRowNodeTaskNodes = oldRowNode.getTasks();
      for (var j = oldRowNodeTaskNodes.length - 1; j >= 0; j--)
      {
        var oldRowNodeTaskNode = oldRowNodeTaskNodes[j];
        if (oldRowNodeTaskNode.getRenderState() === 'delete')
        {
          // Refurbish the 'delete' task node if necessary
          if (deferredTaskPropsArray && deferredTaskPropsArray.length > 0)
          {
            var deferredTaskNodeProps = deferredTaskPropsArray.pop();
            oldRowNodeTaskNode.setRenderState('refurbish');
            oldRowNodeTaskNode.setProps(deferredTaskNodeProps);
          }
          else
          {
            oldRowNode.removeTask(oldRowNodeTaskNode);
          }
          oldRowNodeTaskNode.remove(); // will take into account whether it's refurbish or actual delete
        }
      }
      // Create remaining deferred new task nodes
      if (deferredTaskPropsArray && deferredTaskPropsArray.length > 0)
      {
        for (var k = 0; k < deferredTaskPropsArray.length; k++)
        {
          deferredTaskNodeProps = deferredTaskPropsArray[k];
          taskNode = new DvtGanttTaskNode(gantt, oldRowNode, deferredTaskNodeProps);
          taskNode.setRenderState('add');
          oldRowNode.addTask(taskNode);
        }
      }
    }
  }

  return newRowNodes;
};

/**
 * Render dependency lines
 * @param {dvt.Gantt} gantt The gantt component
 * @param {dvt.Container=} container the parent container for the dependency lines
 * @private
 */
DvtGanttRenderer._renderDependencies = function(gantt, container)
{
  // remove all existing dependency lines regardless whether it was visible/hidden
  var deplines = gantt.getDependencyLines();
  // container set to null for resize/zoom level cases in which we don't need to remove the lines
  if (deplines != null && container != null)
  {
    deplines.removeChildren();
  }

  var options = gantt.getOptions();
  var dependencies = options['dependencies'];

  if (dependencies == null || dependencies.length == 0)
    return;

  if (deplines == null)
  {
    deplines = new dvt.Container(gantt.getCtx());
    deplines.setTranslateY(gantt.getDatabodyStart());

    gantt.setDependencyLines(deplines);
    gantt.setDefaultMarkerId(DvtGanttRenderer._createDefaultMarker(gantt));
  }

  if (container) // For initial render as well as rerender; on resize/zoom level cases, container is null
  {
    // Make sure dep lines are always on top of everything else, whether it's initial render or rerender
    container.addChild(deplines);
  }

  // need to update clippath if canvas size updated
  var cp = new dvt.ClipPath();
  cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt.getDatabodyHeight());
  deplines.setClipPath(cp);

  // ensure container translateY is within bounds
  deplines.setTranslateY(gantt.getBoundedContentTranslateY(deplines.getTranslateY()));

  // check if it's just updating dependency lines vs re-rendering
  var numChildren = deplines.getNumChildren();
  if (numChildren > 0)
  {
    for (var i = 0; i < numChildren; i++)
    {
      var dependencyNode = deplines.getChildAt(i);
      dependencyNode.render(deplines);
    }
  }
  else
  {
    for (i = 0; i < dependencies.length; i++)
    {
      dependencyNode = new DvtGanttDependencyNode(gantt, dependencies[i]);
      dependencyNode.render(deplines);
    }
  }
};

/**
 * Create marker element under def
 * @param {DvtGantt} gantt
 * @return {string} the id of the marker element
 * @private
 */
DvtGanttRenderer._createDefaultMarker = function(gantt)
{
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
  dvt.ToolkitUtils.setAttrNullNS(path, 'd', 'M0,0L' + width + ',' + (height / 2) + ',' + '0,' + height + 'V0Z');

  elem.appendChild(path);

  context.appendDefs(elem);

  return id;
};

/**
 * Class representing a Gantt row axis
 * @param {dvt.Gantt} gantt the Gantt component
 * @class
 * @constructor
 */
var DvtGanttRowAxis = function(gantt)
{
  this.Init(gantt);
};

dvt.Obj.createSubclass(DvtGanttRowAxis, dvt.Container);

/**
 * Initialize the row axis
 * @param {dvt.Gantt} gantt the Gantt component
 * @protected
 */
DvtGanttRowAxis.prototype.Init = function(gantt)
{
  DvtGanttRowAxis.superclass.Init.call(this, gantt.getCtx());
  this._gantt = gantt;
};

/**
 * Gets the label content type. 
 * @return {string} 'custom' if content is from provided custom renderer or 'text' otherwise, derived from the provided row label string.
 * @private
 */
DvtGanttRowAxis.prototype._getLabelContentType = function()
{
  var options = this._gantt.getOptions()['rowAxis'];
  if (options['label'] && options['label']['renderer'])
    return 'custom';
  return 'text';
};

/**
 * Gets the available width.
 * @param {number} totalAvailWidth The total available width.
 * @return {object} An object containing the max width, width, and calculated width, in px. -1 width means 'max-content'
 * @private
 */
DvtGanttRowAxis.prototype._getAvailableWidth = function(totalAvailWidth)
{
  var maxWidthOption = this._gantt.getRowAxisMaxWidth();
  var widthOption = this._gantt.getRowAxisWidth();
  var maxWidth, widthDemanded;

  if (maxWidthOption != null && maxWidthOption !== 'none')
    maxWidth = Math.min(DvtGanttStyleUtils.getSizeInPixels(maxWidthOption, totalAvailWidth), totalAvailWidth);
  maxWidth = maxWidth != null && !isNaN(maxWidth) ? maxWidth : totalAvailWidth;

  if (widthOption != null && widthOption !== 'max-content')
    widthDemanded = DvtGanttStyleUtils.getSizeInPixels(this._gantt.getRowAxisWidth(), totalAvailWidth);
  widthDemanded = widthDemanded != null && !isNaN(widthDemanded) ? widthDemanded : -1;

  return {'maxWidth': maxWidth, 'width': widthDemanded, 'calculatedWidth': widthDemanded !== -1 ? Math.min(widthDemanded, maxWidth) : maxWidth}
};

/**
 * Gets the width of the row axis.
 * @return {number} the width
 */
DvtGanttRowAxis.prototype.getWidth = function()
{
  return this._width;
};

/**
 * Renders the content of the row axis.
 * @param {number} totalAvailWidth The total available width.
 * @param {boolean} isResize Whether this render call is due to component resize.
 */
DvtGanttRowAxis.prototype.render = function(totalAvailWidth, isResize)
{
  // Clear all previous content (unless resizing, them keep them there and update as necessary)
  if (!isResize)
  {
    this.removeChildren();
    this._rowLabelContents = [];
  }

  var rowsData = this._gantt.getRowsData();
  var availableWidth = this._getAvailableWidth(totalAvailWidth);
  var contentType = this._getLabelContentType();
  var options = this._gantt.getOptions();
  var labelCSSStyle = DvtGanttStyleUtils.getRowLabelStyle(options);
  this._width = availableWidth['width'] !== -1 ? availableWidth['calculatedWidth'] : 0;

  for (var i = 0; i < rowsData.length; i++)
  {
    var rowData = rowsData[i];

    var labelContent = !isResize ? new DvtGanttRowLabelContent(this, contentType) : this._rowLabelContents[i];
    labelContent.setRowIndex(i);
    labelContent.render(rowData, labelCSSStyle, availableWidth);

    if (availableWidth['width'] == -1)
    {
      this._width = Math.min(Math.max(this._width, labelContent.getWidth()), availableWidth['maxWidth']);
    }
  
    this._rowLabelContents.push(labelContent);    
  }

  // Make sure allocated width is integer pixels to avoid svg rendering issues
  this._width = Math.ceil(this._width);
};

/**
 * Gets the array of row label contents
 * @return {array} An array of DvtGanttRowLabelContent objects
 */
DvtGanttRowAxis.prototype.getRowLabelContents = function()
{
  return this._rowLabelContents;
};

/**
 * Adjusts the row axis position. Called after databody position is calculated to be in sync.
 */
DvtGanttRowAxis.prototype.adjustPosition = function()
{
  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
  var width = this._width;
  var height = this._gantt.getCanvasSize() - this._gantt.getAxesHeight();
  if (isRTL)
    this.setTranslateX(this._gantt.getStartXOffset() + this._gantt.getCanvasLength() + this._gantt._borderWidth + DvtGanttStyleUtils.getRowAxisGap());
  else
    this.setTranslateX(0);

  var cp = new dvt.ClipPath();
  cp.addRect(this.getTranslateX(), this._gantt.getDatabodyStart() + this._gantt.getStartYOffset(), width, height);
  this.setClipPath(cp);
};

/**
 * Class representing a Gantt row label content (plain text, or custom content from custom renderer)
 * @param {DvtGanttRowAxis} rowAxis The associated row axis container.
 * @param {string} contentType The content type, either 'custom', or 'text'
 * @class
 * @constructor
 */
var DvtGanttRowLabelContent = function(rowAxis, contentType)
{
  this.Init(rowAxis, contentType);
};

dvt.Obj.createSubclass(DvtGanttRowLabelContent, dvt.Obj);

/**
 * Initialize the row label content.
 * @param {DvtGanttRowAxis} rowAxis The associated row axis container.
 * @param {string} contentType The content type, either 'custom', or 'text'
 * @protected
 */
DvtGanttRowLabelContent.prototype.Init = function(rowAxis, contentType)
{
  this._rowAxis = rowAxis;
  this._gantt = rowAxis._gantt;
  this._contentType = contentType;
};

/**
 * Renders the row label content.
 * @param {object} rowData The associated row data object
 * @param {dvt.CSSStyle} labelCSSStyle The label css style object
 * @param {object} availabeWidth An object containing the max width, width, and calculated width, in px. -1 width means 'max-content'.
 */
DvtGanttRowLabelContent.prototype.render = function(rowData, labelCSSStyle, availableWidth)
{
  this._labelString = rowData['label'] != null ? rowData['label'] : '';
  var availableHeight = this._getAvailableHeight(rowData);
  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());

  if (this._contentType === 'custom')
  {
    if (!this._contentDisplayable)
    {
      this._contentDisplayable = new dvt.Container(this._gantt.getCtx());
      this._contentDisplayable.setClassName(this._gantt.GetStyleClass('rowLabel'));
      var labelStyle = rowData['labelStyle'];
      if (labelStyle != null)
      {
        this._contentDisplayable.setStyle(labelStyle);
      }

      this._rowAxis.addChild(this._contentDisplayable);
      this._customContent = null;
      this._gantt.getEventManager().associate(this._contentDisplayable, this);
    }
    
    var renderer = this._gantt.getOptions()['rowAxis']['label']['renderer']; // must have been defined if reached here
    
    // maxWidth in the renderer context should be -1 if width is unbounded AND max-width is unbounded. Otherwise, width is bounded in some way, so give them that value in px
    var maxWidthOption = this._gantt.getRowAxisMaxWidth();
    var contextMaxWidth = (availableWidth['width'] === -1 && (maxWidthOption != null && maxWidthOption === 'none')) ? -1 : availableWidth['calculatedWidth'];
    
    var customContent = renderer(this.getRendererContext(rowData, contextMaxWidth, availableHeight));
    customContent = customContent != null ? customContent['insert'] : null;

    // Loosely based on Diagram's code. Could technically achieve same behavior by always removing this._customContent
    // before getting here and then always adding customContent if it's not null here on, but the following structure
    // would be helpful when we support rootElement in the renderer context (plus hover/focus renderers) in the future.
    if (this._customContent && customContent != this._customContent)
    {
      this._contentDisplayable.getContainerElem().removeChild(this._customContent);
      this._customContent = null;
    }
    if (customContent && !this._customContent)
    {
      dvt.ToolkitUtils.appendChildElem(this._contentDisplayable.getContainerElem(), customContent);
      this._customContent = customContent;
    }
  }
  else
  {
    if (!this._contentDisplayable)
    {
      this._contentDisplayable = new dvt.OutputText(this._gantt.getCtx(), this._labelString, 0, 0);
      this._contentDisplayable.setClassName(this._gantt.GetStyleClass('rowLabel'));

      // sets the style if specified in options
      labelStyle = rowData['labelStyle'];

      if (labelStyle != null)
      {
        // need to instantiate a new dvt.CSSStyle object because we're going to modify it
        var customLabelCSSStyle = DvtGanttStyleUtils.getRowLabelStyle(this._gantt.getOptions());
        customLabelCSSStyle.parseInlineStyle(labelStyle);
        // TODO: once we fully deprecate string type in 4.0.0, remove the string logic
        if (typeof labelStyle === 'string' || labelStyle instanceof String)
          dvt.ToolkitUtils.setAttrNullNS(this._contentDisplayable.getElem(), 'style', labelStyle);
        else
          this._contentDisplayable.setStyle(labelStyle); // works if style is object

        this._contentDisplayable.setCSSStyle(customLabelCSSStyle); // necessary for getDimension/fitText to obtain CSS style of the text
      }
      else
      {
        this._contentDisplayable.setCSSStyle(labelCSSStyle); // necessary for getDimension/fitText to obtain CSS style of the text
      }

      this._gantt.getEventManager().associate(this._contentDisplayable, this);
    }

    if (this._contentDisplayable.isTruncated())
      this._contentDisplayable.setTextString(this._contentDisplayable.getUntruncatedTextString());

    // Truncate label to fit
    dvt.TextUtils.fitText(this._contentDisplayable, availableWidth['calculatedWidth'], availableHeight, this._rowAxis, 1);
  }

  // TODO consider tweaking the logic to avoid this step when an explicit width is set on the row axis for potential performance improvements, especially for custom content
  var contentDimensions = this._contentDisplayable.getDimensions();

  if (this._contentType === 'custom')
  {
    // We want to know the visible width of the content, which means we also need to take into account the translate x
    // e.g. the content may be clipped out of view, and we only care about the unclipped width.
    if (isRTL)
    {
      // in RTL, the custom content g container's x=0 is aligned to the right edge of the row axis container.
      // contentDimensions's x is left anchored, so only the magnitude of the negative x value matters.
      this._width = -Math.min(0, contentDimensions.x);
    }
    else
    {
      this._width = contentDimensions.x + contentDimensions.w;
    }
    // Ensure width is positive
    this._width = Math.max(0, this._width);
    this._height = contentDimensions.y + contentDimensions.h;
  }
  else
  {
    // For custom content, calling getDimensions() on the contentDisplayable <g> element gives x, y relative to the container coordinate space,
    // whereas calling getDimensions() on non custom dvt.OutputText gives x, y relative to the row axis container coordinate space, so there is no need to account for 
    // translations for the width/height of non custom text content.
    this._width = contentDimensions.w;
    this._height = contentDimensions.h;
  }
};

/**
 * Calculates the available height for row label content based on the row data.
 * @param {object} rowData
 * @return {number} The available height
 */
DvtGanttRowLabelContent.prototype._getAvailableHeight = function(rowData)
{
  // Note: only takes into account the largest task in the row (excluding progress height), and not things like row height extensions due to overlapping tasks.
  // Don't think it's necessary to take them into account, because most use cases probably want all the labels to be uniform
  // Also the code is a bit redundant due to the catch 22 situation: we want to render all the row labels before actually rendering the rows, which is where the preprocessing and dimensional calculations are done.
  // TODO: see if we can refactor and use the methods currently in DvtGanttTask to preprocess and calculate task heights
  
  var availableHeight = 0;
  var tasksData = rowData['tasks'];

  if (tasksData)
  {
    for (var i = 0; i < tasksData.length; i++)
    {
      var taskProps = tasksData[i];
      var taskStart = taskProps['start'];
      var taskEnd = taskProps['end'];
      if (taskStart == null && taskEnd == null)
        continue;
      if (taskStart == null)
        taskEnd = taskStart;
      if (taskEnd == null)
        taskEnd = taskStart;
      taskStart = new Date(taskStart).getTime();
      taskEnd = new Date(taskEnd).getTime();
      if (taskStart <= taskEnd && taskStart >= this._gantt.getStartTime() && taskEnd <= this._gantt.getEndTime())
      {
        var baselineProps = taskProps['baseline'];
        var isBaselineMilestone = false;
        var isBaselinePresent = !((baselineProps == null) || (baselineProps['start'] == null && baselineProps['end'] == null));
        var taskHeight = taskProps['height'] == null ? (isBaselinePresent ? DvtGanttStyleUtils.getActualTaskHeight() : DvtGanttStyleUtils.getStandaloneTaskHeight()) : taskProps['height'];
        if (isBaselinePresent)
        {
          isBaselineMilestone = taskProps['type'] === 'milestone' || (baselineProps['start'] == null || baselineProps['end'] == null || baselineProps['start'] == baselineProps['end']);
          if (isBaselineMilestone)
          {
            var baselineHeight = baselineProps['height'] == null ? DvtGanttStyleUtils.getActualTaskHeight() : baselineProps['height'];
          }
          else
          {
            baselineHeight = baselineProps['height'] == null ? DvtGanttStyleUtils.getBaselineTaskHeight() : baselineProps['height'];
          }
        }
        else
        {
          baselineHeight = 0;
        }

        var heightTaskToptoBaselineBottom = isBaselineMilestone ? DvtGanttStyleUtils.getMilestoneBaselineYOffset() + Math.max(baselineHeight, taskHeight) : taskHeight + baselineHeight;
        availableHeight = Math.max(availableHeight, heightTaskToptoBaselineBottom);
      }
    }
  }

  if (availableHeight == 0) // in case of empty row
    availableHeight = DvtGanttStyleUtils.getStandaloneTaskHeight();

  return availableHeight + 2 * DvtGanttStyleUtils.getTaskPadding();
};

/**
 * Gets the context to be passed into custom renderer callbacks
 * @return {object} The renderer context
 */
DvtGanttRowLabelContent.prototype.getRendererContext = function(rowData, maxWidth, maxHeight)
{
  var dataContext = {
    'component': this._gantt.getOptions()['_widgetConstructor'],
    'parentElement': this._contentDisplayable.getContainerElem(),
    'rowData': rowData,
    'maxWidth': maxWidth,
    'maxHeight': maxHeight
  };
  return this._gantt.getCtx().fixRendererContext(dataContext);
};

/**
 * Gets the associated row node.
 * @return {DvtGanttRowNode} the associated row node.
 */
DvtGanttRowLabelContent.prototype.getRow = function()
{
  return this._rowNode;
};

/**
 * Sets the associated row node.
 * @param {DvtGanttRowNode} rowNode the associated row node.
 */
DvtGanttRowLabelContent.prototype.setRow = function(rowNode)
{
  this._rowNode = rowNode;
};

/**
 * Gets the row index
 * @return {number} the row index
 */
DvtGanttRowLabelContent.prototype.getRowIndex = function()
{
  return this._rowIndex;
};

/**
 * Sets the row index
 * @param {number} index The row index
 */
DvtGanttRowLabelContent.prototype.setRowIndex = function(index)
{
  this._rowIndex = index;
};

/**
 * Gets the content displayable
 * @return {dvt.Displayable} The content displayable
 */
DvtGanttRowLabelContent.prototype.getDisplayable = function()
{
  // TODO should this be getDisplayble() or getDisplayables() that return an array of 1 thing?
  return this._contentDisplayable;
};

/**
 * Gets the row label string
 * @return {string} The label string
 */
DvtGanttRowLabelContent.prototype.getLabelString = function()
{
  return this._labelString;
};

/**
 * Gets the content type
 * @return {string} The content type, either 'custom', or 'text'
 */
DvtGanttRowLabelContent.prototype.getContentType = function()
{
  return this._contentType;
};

/**
 * Gets the x position within the row axis
 * @return {number}
 */
DvtGanttRowLabelContent.prototype.getX = function()
{
  if (this._contentType === 'text')
    return this._contentDisplayable.getX();
  else
    return this._contentDisplayable.getTranslateX();
};

/**
 * Sets the x position within the row axis
 * @param {number} x The desired x position
 */
DvtGanttRowLabelContent.prototype.setX = function(x)
{
  if (this._contentType === 'text')
    this._contentDisplayable.setX(x);
  else
    this._contentDisplayable.setTranslateX(x);
};

/**
 * Gets the y position within the row axis
 * @return {number}
 */
DvtGanttRowLabelContent.prototype.getY = function()
{
  if (this._contentType === 'text')
    return this._contentDisplayable.getY();
  else
    return this._contentDisplayable.getTranslateY();
};

/**
 * Sets the y position within the row axis
 * @param {number} y The desired y position
 */
DvtGanttRowLabelContent.prototype.setY = function(y)
{
  if (this._contentType === 'text')
    this._contentDisplayable.setY(y);
  else
    this._contentDisplayable.setTranslateY(y);
};

/**
 * Gets the content width
 * @return {number}
 */
DvtGanttRowLabelContent.prototype.getWidth = function()
{
  return this._width;
};

/**
 * Gets the content height
 * @return {number}
 */
DvtGanttRowLabelContent.prototype.getHeight = function()
{
  return this._height;
};

/**
 * Class representing a GanttRow node.
 * @param {dvt.Gantt} gantt the Gantt component
 * @param {object} props the properties for the node.
 * @param {number} index the initial index of the row
 * @param {number} top the top position of the row
 * @class
 * @constructor
 */
var DvtGanttRowNode = function(gantt, props, index, top)
{
  this.Init(gantt, props, index, top);
};

dvt.Obj.createSubclass(DvtGanttRowNode, dvt.Container);

/**
 * Initialize the row
 * @param {dvt.Gantt} gantt the Gantt component
 * @param {object} props the properties for the node.
 * @param {number} index the initial index of the row
 * @param {number} top the top position of the row
 * @protected
 */
DvtGanttRowNode.prototype.Init = function(gantt, props, index, top)
{
  DvtGanttRowNode.superclass.Init.call(this, gantt.getCtx(), null);

  this._gantt = gantt;
  this._props = props;
  this._index = index;
  this._top = top;
  this._rowHeight = 0;
  this._renderState = 'add';

  this._gantt.getEventManager().associate(this, this);
};

/**
 * Gets the gantt.
 * @return {dvt.Gantt} the gantt.
 */
DvtGanttRowNode.prototype.getGantt = function()
{
  return this._gantt;
};

/**
 * Gets the node properties/data.
 * @return {object} The properties/data for the node.
 */
DvtGanttRowNode.prototype.getProps = function()
{
  return this._props;
};

/**
 * Sets the node properties.
 * @param {object} props The new properties for the node.
 */
DvtGanttRowNode.prototype.setProps = function(props)
{
  this._props = props;
};

/**
 * Retrieve the index of the row.
 * @return {number} the index of the row.
 */
DvtGanttRowNode.prototype.getIndex = function()
{
  return this._index;
};

/**
 * Sets the index of the row.
 * @param {number} i the index of the row.
 */
DvtGanttRowNode.prototype.setIndex = function(i)
{
  this._index = i;
};

/**
 * Retrieve the top position of the row in pixels.
 * @return {number} the top position of the row in pixels relative to the databody
 */
DvtGanttRowNode.prototype.getTop = function()
{
  return this._top;
};

/**
 * Sets the top position of the row in pixels.
 * @param {number} top The top position of the row in pixels relative to the databody
 */
DvtGanttRowNode.prototype.setTop = function(top)
{
  this._top = top;
};

/**
 * Retrieve the data id of the row
 * @override
 */
DvtGanttRowNode.prototype.getId = function()
{
  return this._props['id'];
};

/**
 * Gets the render state.
 * @return {string} the render state.
 */
DvtGanttRowNode.prototype.getRenderState = function()
{
  return this._renderState;
};

/**
 * Sets the render state.
 * @param {string} state The render state.
 */
DvtGanttRowNode.prototype.setRenderState = function(state)
{
  this._renderState = state;
};

/**
 * Retrieve the label of the row
 * @return {string} the label of the row
 */
DvtGanttRowNode.prototype.getLabel = function()
{
  return this._props['label'];
};

/**
 * Sets the row label content object
 * @param {DvtGanttRowLabelContent} rowLabelText The row label content object
 */
DvtGanttRowNode.prototype.setRowLabelContent = function(rowLabelContent)
{
  this._rowLabelContent = rowLabelContent;
};

/**
 * Gets the row label content object
 * @return {DvtGanttRowLabelContent} The row label content object
 */
DvtGanttRowNode.prototype.getRowLabelContent = function()
{
  return this._rowLabelContent;
};

/**
 * Determine whether task is visible.
 * @param {object} taskProps task properties
 * @return {boolean} whether the task bounds are within the viewport of interest
 */
DvtGanttRowNode.prototype.isTaskVisible = function(taskProps)
{
  var isTaskRepVisible = this._isElementVisible(taskProps);
  var isBaselineVisible = this._isElementVisible(taskProps['baseline']);
  return isTaskRepVisible || isBaselineVisible;
};

/**
 * Determine whether time bounds are within visible range. Also converts time bounds to milliseconds.
 * @param {object} props Object containing 'start' and 'end'
 * @return {boolean} whether the time bounds are within the gantt overall time bounds
 * @private
 */
DvtGanttRowNode.prototype._isElementVisible = function(props)
{
  if (props)
  {
    // start/end only supports number or string type, e.g. excludes Date object type
    // TODO: Remove number type support after complete deprecation in future release
    var startType = typeof props['start'];
    var endType = typeof props['end'];
    if ((props['start'] == null || startType === 'string' || startType === 'number') &&
        (props['end'] == null || endType === 'string' || endType === 'number'))
    {
      props['start'] = this._getDate(props['start']);
      props['end'] = this._getDate(props['end']);

      if (!(props['start'] == null && props['end'] == null))
      {
        var start = this._gantt.getStartTime();
        var end = this._gantt.getEndTime();
        var endTime = props['end'] ? props['end'] : props['start'];
        var startTime = props['start'];
        return !(endTime < start || startTime > end || end < start);
      }
    }
  }
  return false;
};

/**
 * Merge task properties with default properties.
 * @param {object} taskProps task properties
 * @param {object} taskDefaults task default properties
 * @return {object} The task properties merged with task defaults
 */
DvtGanttRowNode.prototype.mergeTaskDefaults = function(taskProps, taskDefaults)
{
  var baselineProps = taskProps['baseline'];
  var progressProps = taskProps['progress'];

  // If app set to null, merge won't assume it's not specified. Need to be explicitly undefined for it to merge with the defaults.
  if (baselineProps == null)
  {
    taskProps['baseline'] = undefined;
  }
  if (progressProps == null)
  {
    taskProps['progress'] = undefined;
  }

  if (baselineProps && !(baselineProps['start'] == null && baselineProps['end'] == null))
  {
    // If app didn't set a height value on the task or on the task defaults, then use the default height for when the baseline is present
    if (taskProps['height'] == null && taskDefaults['height'] === DvtGanttStyleUtils.getStandaloneTaskHeight())
    {
      taskProps['height'] = DvtGanttStyleUtils.getActualTaskHeight();
    }

    var taskType = taskProps['type'] ? taskProps['type'] : taskDefaults['type'];
    var isBaselineMilestone = (taskType === 'milestone') || (taskType === 'auto' && (baselineProps['start'] == baselineProps['end'] || baselineProps['start'] == null || baselineProps['end'] == null));
    // If app didn't set a height value on the baseline or on the task defaults, and the baseline is a milestone, then use the default height
    if (isBaselineMilestone && baselineProps['height'] == null && taskDefaults['baseline']['height'] === DvtGanttStyleUtils.getBaselineTaskHeight())
    {
      baselineProps['height'] = DvtGanttStyleUtils.getActualTaskHeight();
    }
  }
  return dvt.JsonUtils.merge(taskProps, taskDefaults);
};

/**
 * Retrieve tasks of the row. Returns empty array if given tasks is null or undefined.
 * @return {Array} an array of DvtGanttTaskNode each representing a task.
 */
DvtGanttRowNode.prototype.getTasks = function()
{
  var tasks = this._props['tasks'];
  if (tasks == null)
  {
    this._tasks = [];
  }
  if (tasks && this._tasks == null)
  {
    this._tasks = [];
    for (var i = 0; i < tasks.length; i++)
    {
      var task = tasks[i];
      if (this.isTaskVisible(task))
      {
        task = this.mergeTaskDefaults(task, this._gantt.getOptions()['taskDefaults']);
        this._tasks.push(new DvtGanttTaskNode(this._gantt, this, task));
      }
    }
    this.sortTasks();
  }

  return this._tasks;
};

/**
 * Adds task node to task list.
 * @param {DvtGanttTaskNode} taskNode The task node to add.
 */
DvtGanttRowNode.prototype.addTask = function(taskNode)
{
  if (this._tasks == null)
    this._tasks = [taskNode];
  else
    this._tasks.push(taskNode);
};

/**
 * Removes task node from task list.
 * @param {DvtGanttTaskNode} taskNode The task node to remove.
 */
DvtGanttRowNode.prototype.removeTask = function(taskNode)
{
  if (this._tasks != null)
  {
    var taskNodeIndex = this._tasks.indexOf(taskNode);
    if (taskNodeIndex > -1)
      this._tasks.splice(taskNodeIndex, 1);
  }
};

/**
 * Sorts the task list by ascending start dates.
 */
DvtGanttRowNode.prototype.sortTasks = function()
{
  if (this._tasks != null)
  {
    this._tasks.sort(function(a, b) {
      var aProps = a.getProps();
      var bProps = b.getProps();
      var dateA = aProps['start'] ? aProps['start'] : aProps['end'];
      var dateB = bProps['start'] ? bProps['start'] : bProps['end'];
      return dateA - dateB;
    });
  }
};

/**
 * Assign each task its overlap level in the row.
 * @param {array} tasks The array of task nodes (sorted)
 * @return {array} The cumulative height sum array
 */
DvtGanttRowNode.prototype.assignRowLevel = function(tasks)
{
  var task, taskHeightWithPadding, i, j, rowLevel, promote, previousAdjacentTaskNode,
      oldPreviousAdjacentTaskNode, oldNextAdjacentTaskNode,
      rowLevelBaselineMilestones = [],
      rowLevelRecentTasks = [], rowLevelHeights = [];

  // If no tasks in the row, still show empty row with height as if a single task is there.
  if (tasks.length == 0)
  {
    return [DvtGanttStyleUtils.getStandaloneTaskHeight() + 2 * DvtGanttStyleUtils.getTaskPadding()];
  }

  // determine task top before rendering based on whether it overlaps with other tasks
  // if n tasks:
  //    best case: no tasks in the row overlap --> O(n)
  //    worst case: all tasks in the row overlap --> O(n^2)
  //    General: O(cn) where c is maximum # of tasks taking up the row height vertically. In most cases, c is constant, or essentially constant for c << n.
  for (i = 0; i < tasks.length; i++)
  {
    task = tasks[i];
    taskHeightWithPadding = task.getFinalHeight() + 2 * DvtGanttStyleUtils.getTaskPadding();
    rowLevel = 0;
    previousAdjacentTaskNode = null;

    if (rowLevelRecentTasks.length === 0)
    {
      rowLevelRecentTasks.push(task);
      rowLevelHeights.push(taskHeightWithPadding);
    }
    else
    {
      promote = true;
      for (j = 0; j < rowLevelRecentTasks.length; j++)
      {
        if (task.overlaps(rowLevelRecentTasks[j]))
        {
          rowLevel += 1;
        }
        else
        {
          previousAdjacentTaskNode = rowLevelRecentTasks[j];
          rowLevelRecentTasks[j] = task;
          if (taskHeightWithPadding > rowLevelHeights[j])
          {
            rowLevelHeights[j] = taskHeightWithPadding;
          }
          promote = false;
          break;
        }
      }
      if (promote)
      {
        rowLevelRecentTasks.push(task);
        rowLevelHeights.push(taskHeightWithPadding);
      }
    }
    task.setRowLevel(rowLevel);

    // Clear any old adjacency relationships
    oldPreviousAdjacentTaskNode = task.getPreviousAdjacentTaskNode();
    oldNextAdjacentTaskNode = task.getNextAdjacentTaskNode();
    if (oldPreviousAdjacentTaskNode)
    {
      oldPreviousAdjacentTaskNode.setNextAdjacentTaskNode(null);
    }
    if (oldNextAdjacentTaskNode)
    {
      oldNextAdjacentTaskNode.setPreviousAdjacentTaskNode(null);
    }
    task.setPreviousAdjacentTaskNode(null);
    task.setNextAdjacentTaskNode(null);

    // Set new relationships
    if (previousAdjacentTaskNode)
    {
      task.setPreviousAdjacentTaskNode(previousAdjacentTaskNode);
      previousAdjacentTaskNode.setNextAdjacentTaskNode(task);
    }
  }

  // Track row level baseline milestones (used later for label auto positioning, since baseline milestones can collide with labels)
  // O(blgb + cn) algo to find baseline milestones between tasks. Most cases b is small (few baseline milestones) so essentially linear time
  task.setPrevAdjMilestoneBaselineTaskNode(null);
  task.setNextAdjMilestoneBaselineTaskNode(null);
  for (j = 0; j < rowLevelRecentTasks.length; j++)
  {
    rowLevelBaselineMilestones.push([]);
  }
  for (i = 0; i < tasks.length; i++)
  {
    task = tasks[i];
    if (task.getTask().isMilestone('baseline'))
    {
      rowLevelBaselineMilestones[task.getRowLevel()].push(task);
    }
  }
  for (j = 0; j < rowLevelRecentTasks.length; j++)
  {
    rowLevelBaselineMilestones[j].sort(function(a, b) {
      var aBaselineProps = a.getProps()['baseline'];
      var bBaselineProps = b.getProps()['baseline'];
      var dateA = aBaselineProps['start'] ? aBaselineProps['start'] : aBaselineProps['end'];
      var dateB = bBaselineProps['start'] ? bBaselineProps['start'] : bBaselineProps['end'];
      return dateB - dateA; // descending order by time
    });
  }
  for (i = 0; i < tasks.length; i++)
  {
    task = tasks[i];
    var baselineMilestones = rowLevelBaselineMilestones[task.getRowLevel()];
    var numMilestones = baselineMilestones.length;
    if (numMilestones > 0)
    {
      var taskNodeWithBaseline = baselineMilestones[numMilestones - 1];
      var baselineProps = taskNodeWithBaseline.getProps()['baseline'];
      var baselineTime = baselineProps['start'] ? baselineProps['start'] : baselineProps['end'];
      var currentTaskProps = task.getProps();
      var currentTaskStart = currentTaskProps['start'] ? currentTaskProps['start'] : currentTaskProps['end'];
      var currentTaskEnd = currentTaskProps['end'] ? currentTaskProps['end'] : currentTaskProps['start'];
      if (baselineTime < currentTaskStart)
      {
        task.setPrevAdjMilestoneBaselineTaskNode(taskNodeWithBaseline);
        baselineMilestones.pop();
      }
      else if (baselineTime > currentTaskEnd && task.getNextAdjMilestoneBaselineTaskNode() == null)
      {
        task.setNextAdjMilestoneBaselineTaskNode(taskNodeWithBaseline);
      }
      else if (baselineTime == currentTaskStart || baselineTime == currentTaskEnd)
      {
        baselineMilestones.pop();
      }
    }
  }

  // return cumulative height sum array
  return rowLevelHeights.reduce(function(r, v, i) {
    r.push((r[i - 1] || 0) + v);
    return r;
  }, []);
};

/**
 * Renders the row to specified container. The row node is added to the container child list
 * at the specified index. If not specified, row node is simply appened to the end of the child list.
 * @param {dvt.Container} container the container to host artifacts of the row including tasks.
 * @param {number=} index The index of the container child list to add to.
 */
DvtGanttRowNode.prototype.render = function(container, index)
{
  this.sortTasks();
  var taskNodes = this.getTasks(); // always an array, albeit may be empty
  var rowLevelHeights = this.assignRowLevel(taskNodes);
  for (var i = 0; i < taskNodes.length; i++)
  {
    var taskNode = taskNodes[i];
    var taskProps = taskNode.getProps();
    var task = taskNode.getTask();
    var taskRepBounds = task.getTimeSpanDimensions(taskProps['start'], taskProps['end']);
    if (!taskRepBounds)
    {
      taskRepBounds = task.getTimeSpanDimensions(taskProps['baseline']['start'], taskProps['baseline']['end']);
    }
    var x = taskRepBounds['startPos'];
    var rowLevel = 0;
    if (taskNode.getRowLevel() > 0)
    {
      rowLevel = rowLevelHeights[taskNode.getRowLevel() - 1];
    }
    taskNode.setFinalY(rowLevel + this.getTop() + DvtGanttStyleUtils.getTaskPadding());
    taskNode.setFinalX(x);
    taskNode.render(this);
  }
  // Need to render task labels AFTER all task shapes are rendered for auto label positioning
  for (var j = 0; j < taskNodes.length; j++)
  {
    taskNode = taskNodes[j];
    var taskLabel = taskNode.getTaskLabel();
    var task = taskNode.getTask();
    taskLabel.setAssociatedShape(task.getShape('main'));
    taskLabel.render();
  }

  this.setRowHeight(rowLevelHeights[rowLevelHeights.length - 1]);

  if (this._gantt.isRowAxisEnabled())
    this._finalizeRowLabelRender(this._gantt);

  if (this.getParent() != container)
  {
    if (index != null)
      container.addChildAt(this, index);
    else
      container.addChild(this);
  }

  this._renderBackground(this._gantt, this._gantt.getDatabodyBackground(), this);
  this._renderHorizontalGridline(this._gantt, this, this);
};

/**
 * Finalizes row label content rendering, called during row rendering.
 * @param {dvt.Gantt} gantt
 */
DvtGanttRowNode.prototype._finalizeRowLabelRender = function(gantt)
{
  var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
  var labelContent = this.getRowLabelContent();

  var rowAxis = gantt.getRowAxis();
  if (labelContent.getContentType() === 'custom')
  {
    var x = !isRTL ? 0 : rowAxis.getWidth();
  }
  else
  {
    if (!isRTL)
    {
      labelContent.getDisplayable().alignRight();
      x = rowAxis.getWidth();
    }
    else
    {
      x = 0;
    }
  }

  var y = ((this.getTop() + (this.getTop() + this.getRowHeight())) - labelContent.getHeight()) / 2;
  labelContent.setRow(this);

  var finalStates = {
    'x': x,
    'y': y
  };

  // set "previous states" (current implementation, labels are new and have no knowledge of previous positions)
  var previousLabelState = this.getLabelState();
  if (previousLabelState)
  {
    labelContent.setY(previousLabelState['y']);
    labelContent.setX(previousLabelState['x']);
  }

  // Record final states
  this.recordLabelState(finalStates);

  this._gantt.getAnimationManager().preAnimateRowLabel(this, labelContent, finalStates);
};

/**
 * Renders the row background.
 * @param {dvt.Gantt} gantt The gantt component
 * @param {dvt.Container} container The container to render into.
 * @param {DvtGanttRowNode} row The row
 * @private
 */
DvtGanttRowNode.prototype._renderBackground = function(gantt, container, row)
{
  var x = 0,
      y = row.getTop(),
      w = gantt.getContentLength(),
      h = row.getRowHeight(),
      renderState = 'exist', finalStates;

  if (!this._background)
  {
    this._background = new dvt.Rect(gantt.getCtx(), x, y, w, h);
    this._background.setPixelHinting(true);
    this._background.setClassName(gantt.GetStyleClass('row'));
    container.addChild(this._background);
    renderState = 'add';

    // Explicitly associate the row background with the DvtGanttRowNode, since the background is not a direct child.
    this._gantt.getEventManager().associate(this._background, this);
  }

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
DvtGanttRowNode.prototype.getBackground = function()
{
  return this._background;
};

/**
 * Renders horizontal grid lines
 * @param {dvt.Gantt} gantt The gantt component
 * @param {dvt.Container} container The container to render into.
 * @param {DvtGanttRowNode} row The row
 * @private
 */
DvtGanttRowNode.prototype._renderHorizontalGridline = function(gantt, container, row)
{
  var x1, x2, y1, y2, renderState = 'exist', finalStates,
      gridlineStyleClass = gantt.GetStyleClass('hgridline'),
      horizontalLineWidth = DvtGanttStyleUtils.getHorizontalGridlineWidth(gantt.getOptions()),
      // due to pixel hinting, odd value stroke width needs it's position to be offset by 0.5 to ensure consistent behavior across browsers
      // e.g. stroke-width of 1px means 0.5px above and below the reference coordinate. With pixel hinting, some browsers
      // renders 1px above the reference, some renders 1px below the reference. If we offset the reference by 0.5px, the stroke location
      // becomes unambiguous (it'll lock onto whole pixel grid) so all browsers will render this consistently.
      yOffset = (horizontalLineWidth % 2) * 0.5;

  if (gantt.isHorizontalGridlinesVisible())
  {
    y1 = row.getTop() + row.getRowHeight() + yOffset;
    y2 = y1;
    x1 = 0;
    x2 = gantt.getContentLength();

    if (!this._horizontalLine)
    {
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
  }
  else
  {
    // TODO: Animate this?
    if (this._horizontalLine)
    {
      container.removeChild(this._horizontalLine);
    }
    this._horizontalLine = null;
  }
};

/**
 * Records the row label state.
 * @param {object} stateObj The object containing label state information
 */
DvtGanttRowNode.prototype.recordLabelState = function(stateObj)
{
  this._rowLabelState = stateObj;
};

/**
 * Gets the row label state.
 * @return {object} The object containing label state information
 */
DvtGanttRowNode.prototype.getLabelState = function()
{
  return this._rowLabelState;
};

/**
 * Removes itself.
 */
DvtGanttRowNode.prototype.remove = function()
{
  var onEnd, self = this;

  onEnd = function() {
    // Remove background, which belongs to databodyBackground container
    if (self._background)
    {
      var backgroundParent = self._background.getParent();
      if (backgroundParent)
      {
        backgroundParent.removeChild(self._background);
      }
    }
    // Remove the row container (and its contents) itself.
    var parent = self.getParent();
    if (parent)
    {
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
DvtGanttRowNode.prototype._removeRowLabel = function()
{
  var rowLabelContent = this.getRowLabelContent(),
      rowLabelDisplayable,
      onEnd, self = this;

  if (rowLabelContent)
  {
    rowLabelDisplayable = rowLabelContent.getDisplayable();
    if (rowLabelDisplayable)
    {
      // Ensure the label is in the DOM before animating (row axis was cleared on rerender)
      if (rowLabelDisplayable.getParent() == null)
      {
        this._gantt.getRowAxis().addChild(rowLabelDisplayable);
      }

      onEnd = function() {
        if (rowLabelDisplayable.getParent())
          rowLabelDisplayable.getParent().removeChild(rowLabelDisplayable);
      };

      this._gantt.getAnimationManager().preAnimateRowLabelRemove(rowLabelContent, onEnd);
    }
  }
};


/**
 * Retrieves the height of the row
 * @return {number} the height of the row
 */
DvtGanttRowNode.prototype.getRowHeight = function()
{
  return this._rowHeight;
};

/**
 * Sets the row height if the new height is greater than current.
 * @param {number} rowHeight The row height.
 */
DvtGanttRowNode.prototype.setRowHeight = function(rowHeight)
{
  this._rowHeight = rowHeight;
};

/**
 * Helper method to get date in milliseconds.
 * @param {Date|string|number} date
 * @return {number} date is milliseconds
 * @private
 */
DvtGanttRowNode.prototype._getDate = function(date)
{
  if (date == null)
    return null;
  else if (date.getTime) // check function reference
    return date.getTime();
  else if (!isNaN(date))
    return date;
  else
    return (new Date(date)).getTime();
};

/**
 * Returns the data context (e.g. for DnD, etc.)
 * @return {object}
 */
DvtGanttRowNode.prototype.getDataContext = function()
{
  return {
    'rowData': this.getProps(),
    'component': this._gantt.getOptions()['_widgetConstructor']
  };
};

/**
 * Class representing a task container (i.e. container for shapes and labels that make up a task).
 * @param {dvt.Gantt} gantt The gantt component
 * @param {DvtGanttRowNode} row The row node.
 * @param {object} props The properties for the task.
 * @class
 * @constructor
 * @implements {DvtKeyboardNavigable}
 * @implements {DvtSelectable}
 * @implements {DvtDraggable}
 */
var DvtGanttTaskNode = function(gantt, row, props)
{
  this.Init(gantt, row, props);
};

dvt.Obj.createSubclass(DvtGanttTaskNode, dvt.Container);

/**
 * @param {dvt.Gantt} gantt The gantt component
 * @param {DvtGanttRowNode} row The row node.
 * @param {object} props The properties for the task.
 * @protected
 */
DvtGanttTaskNode.prototype.Init = function(gantt, row, props)
{
  DvtGanttTaskNode.superclass.Init.call(this, gantt.getCtx(), null);

  this._gantt = gantt;
  this._row = row;
  this._props = props;
  this._renderState = 'add';

  this._task = new DvtGanttTask(gantt, this);
  this._taskLabel = new DvtGanttTaskLabel(gantt, this);

  this._gantt.getEventManager().associate(this, this);
};

/**
 * Gets the node properties/data.
 * @return {object} The properties/data for the node.
 */
DvtGanttTaskNode.prototype.getProps = function()
{
  return this._props;
};

/**
 * Gets a copy of node properties/data that is meant to be updated/manipulated to reflect
 * any intermediate states of a task (e.g. the state of the task feedback during drag, 
 * which is not final until dragend, and can potentially be cancelled before)
 * @return {object} Mutable object of properties/data for the node.
 */
DvtGanttTaskNode.prototype.getSandboxProps = function()
{
  if (!this._sandboxProps)
  {
    this._sandboxProps = dvt.JsonUtils.merge(this._props, {});
    this._sandboxProps['row'] = this.getRow();
  }
  return this._sandboxProps;
};

/**
 * Sets the properties for the node.
 * @param {object} props The properties.
 */
DvtGanttTaskNode.prototype.setProps = function(props)
{
  this._props = props;
};

/**
 * Gets the task data id.
 * @override
 */
DvtGanttTaskNode.prototype.getId = function()
{
  return this._props['id'];
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.getActiveElementId = function()
{
  return null; // Let a temporary id be generated if active element
};

/**
 * Gets the row associated with the task
 * @return {DvtGanttRowNode} the row
 */
DvtGanttTaskNode.prototype.getRow = function()
{
  return this._row;
};

/**
 * Sets the row associated with the task
 * @param {DvtGanttRowNode} row The row node
 */
DvtGanttTaskNode.prototype.setRow = function(row)
{
  this._row = row;
};

/**
 * Gets the gantt.
 * @return {dvt.Gantt} the gantt.
 */
DvtGanttTaskNode.prototype.getGantt = function()
{
  return this._gantt;
};

/**
 * Gets the render state
 * @return {string} the render state
 */
DvtGanttTaskNode.prototype.getRenderState = function()
{
  return this._renderState;
};

/**
 * Sets the render state
 * @param {string} state The render state
 */
DvtGanttTaskNode.prototype.setRenderState = function(state)
{
  this._renderState = state;
};

/**
 * Gets the row level (overlap promotion level within a row)
 * @return {string} the row level
 */
DvtGanttTaskNode.prototype.getRowLevel = function()
{
  return this._rowLevel;
};

/**
 * Sets the row level (overlap promotion level within a row)
 * @param {string} rowLevel The row level
 */
DvtGanttTaskNode.prototype.setRowLevel = function(rowLevel)
{
  this._rowLevel = rowLevel;
};

/**
 * Gets the chronologically previous adjacent task node on the same row level
 * @return {DvtGanttTaskNode} the previous adjacent task node on the same row level
 */
DvtGanttTaskNode.prototype.getPreviousAdjacentTaskNode = function()
{
  return this._previousAdjacentTaskNode;
};

/**
 * Sets the previous adjacent task node
 * @param {DvtGanttTaskNode} previousAdjacentTaskNode
 */
DvtGanttTaskNode.prototype.setPreviousAdjacentTaskNode = function(previousAdjacentTaskNode)
{
  this._previousAdjacentTaskNode = previousAdjacentTaskNode;
};

/**
 * Gets the chronologically next adjacent task node on the same row level
 * @return {DvtGanttTaskNode} the next adjacent task node on the same row level
 */
DvtGanttTaskNode.prototype.getNextAdjacentTaskNode = function()
{
  return this._nextAdjacentTaskNode;
};

/**
 * Sets the next adjacent task node
 * @param {DvtGanttTaskNode} nextAdjacentTaskNode
 */
DvtGanttTaskNode.prototype.setNextAdjacentTaskNode = function(nextAdjacentTaskNode)
{
  this._nextAdjacentTaskNode = nextAdjacentTaskNode;
};

/**
 * Gets the chronologically previous adjacent baseline task node on the same row level
 * @return {DvtGanttTaskNode} the previous adjacent task node on the same row level
 */
DvtGanttTaskNode.prototype.getPrevAdjMilestoneBaselineTaskNode = function()
{
  return this._previousAdjacentMilestoneBaselineTaskNode;
};

/**
 * Sets the previous adjacent baseline task node
 * @param {DvtGanttTaskNode} previousAdjacentMilestoneBaselineTaskNode
 */
DvtGanttTaskNode.prototype.setPrevAdjMilestoneBaselineTaskNode = function(previousAdjacentMilestoneBaselineTaskNode)
{
  this._previousAdjacentMilestoneBaselineTaskNode = previousAdjacentMilestoneBaselineTaskNode;
};

/**
 * Gets the chronologically next adjacent task node on the same row level
 * @return {DvtGanttTaskNode} the next adjacent task node on the same row level
 */
DvtGanttTaskNode.prototype.getNextAdjMilestoneBaselineTaskNode = function()
{
  return this._nextAdjacentMilestoneBaselineTaskNode;
};

/**
 * Sets the next adjacent task node
 * @param {DvtGanttTaskNode} nextAdjacentMilestoneBaselineTaskNode
 */
DvtGanttTaskNode.prototype.setNextAdjMilestoneBaselineTaskNode = function(nextAdjacentMilestoneBaselineTaskNode)
{
  this._nextAdjacentMilestoneBaselineTaskNode = nextAdjacentMilestoneBaselineTaskNode;
};

/**
 * Whether a given task node overlaps this task node
 * @param {DvtGanttTaskNode} taskNode The task node in question
 * @return {boolean} whether the given task node overlaps this task node
 */
DvtGanttTaskNode.prototype.overlaps = function(taskNode)
{
  var thisOverallStart = this.getOverallStartTime(),
      thisOverallEnd = this.getOverallEndTime(),
      thatOverallStart = taskNode.getOverallStartTime(),
      thatOverallEnd = taskNode.getOverallEndTime();

  // Decision now is if task1 ends at the same time task2 starts, they are still not overlapping.
  // If we decide that they should be considered overlapping, change the < to <=
  return thisOverallStart < thatOverallEnd && thatOverallStart < thisOverallEnd;
};

/**
 * Gets the overall start time of the task node,
 * i.e. the earliest time of all the elements of the task,
 * e.g. if a task node contains only a main shape and a baseline shape,
 * and the main shape starts at t_j, and baseline starts at t_i
 * such that t_j > t_i, then the overall start time is t_i
 *
 * @return {number} the overall start time
 */
DvtGanttTaskNode.prototype.getOverallStartTime = function()
{
  var mainStart = this._props['start'] ? this._props['start'] : this._props['end'],
      baselineProps = this._props['baseline'],
      baselineStart = null;

  if (baselineProps)
  {
    baselineStart = this._props['baseline']['start'] ? this._props['baseline']['start'] : this._props['baseline']['end'];
  }

  if (mainStart == null)
  {
    return baselineStart;
  }
  else if (baselineStart == null)
  {
    return mainStart;
  }
  return Math.min(mainStart, baselineStart);
};

/**
 * Gets the overall end time of the task node,
 * i.e. the latest time of all the elements of the task,
 * e.g. if a task node contains only a main shape and a baseline shape,
 * and the main shape ends at t_j, and baseline ends at t_i
 * such that t_j > t_i, then the overall end time is t_j
 *
 * @return {number} the overall end time
 */
DvtGanttTaskNode.prototype.getOverallEndTime = function()
{
  var mainEnd = this._props['end'] ? this._props['end'] : this._props['start'],
      baselineProps = this._props['baseline'],
      baselineEnd = null;

  if (baselineProps)
  {
    baselineEnd = this._props['baseline']['end'] ? this._props['baseline']['end'] : this._props['baseline']['start'];
  }

  if (mainEnd == null)
  {
    return baselineEnd;
  }
  else if (baselineEnd == null)
  {
    return mainEnd;
  }
  return Math.max(mainEnd, baselineEnd);
};

/**
 * Gets the physical start and end pos of the query task shape
 * @param {string} type The shape type
 * @param {boolean=} includeLabel Whether to include label dimensions (for main shape only)
 * @return {object} object containing 'startPos' and 'endPos'
 */
DvtGanttTaskNode.prototype.getTaskShapePhysicalBounds = function(type, includeLabel)
{
  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
  var orientationFactor = isRTL ? -1 : 1;
  var shape = this._task.getShape(type);
  var shapeX = shape.getFinalX() + this.getFinalX();
  var shapeWidth = shape.getFinalWidth() + shape.getPhysicalEndOffset();
  var startPos = shapeX - orientationFactor * shape.getPhysicalStartOffset();
  var endPos = shapeX + orientationFactor * shapeWidth;

  if (includeLabel)
  {
    var labelOutputText = this._taskLabel.getLabelOutputText();
    if (labelOutputText && labelOutputText.getParent() != null)
    {
      var labelPosition = this._taskLabel.getEffectiveLabelPosition();
      if (labelPosition === 'end')
      {
        endPos = endPos + orientationFactor * (DvtGanttStyleUtils.getTaskLabelPadding() + labelOutputText.getDimensions().w);
      }
      else if (labelPosition === 'start')
      {
        startPos = startPos - orientationFactor * (DvtGanttStyleUtils.getTaskLabelPadding() + labelOutputText.getDimensions().w);
      }
    }
  }

  return {'startPos': startPos, 'endPos': endPos};
};

/**
 * Scrolls the relevant part of the task into view.
 * @param {string=} xPriority The side in the x direction to prioritize scroll into view, one of 'start', 'end', or 'auto'. Default 'auto'.
 * @param {string=} yPriority The side in the y direction to prioritize scroll into view, one of 'top', 'bottom', or 'auto'. Default 'auto'.
 */
DvtGanttTaskNode.prototype.scrollIntoView = function(xPriority, yPriority)
{
  var x, y, w, h;
  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
  var dataBody = this._gantt.getDatabody();
  if (this._gantt.getEventManager().isMoveInitiated() && this._mainDragFeedbacks && this._mainDragFeedbacks.length > 0)
  {
    var targetShape = this._mainDragFeedbacks[0];
    var referenceFrame = this._gantt.getDnDArtifactsContainer();
  }
  else
  {
    targetShape = this.getTask().getShape('main');
    targetShape = targetShape ? targetShape : this.getTask().getShape('baseline');
    referenceFrame = this;
  }
  w = targetShape.getWidth() + targetShape.getPhysicalStartOffset() + targetShape.getPhysicalEndOffset();
  h = targetShape.getHeight();
  x = !isRTL ? targetShape.getX() - targetShape.getPhysicalStartOffset() : targetShape.getX() - w + targetShape.getPhysicalStartOffset();
  y = targetShape.getY();
  var posInDataBody = dataBody.stageToLocal(referenceFrame.localToStage({x: x, y: y}));
  var region = new dvt.Rectangle(posInDataBody.x, posInDataBody.y, w, h);
  this._gantt.scrollIntoView(region, xPriority, yPriority, DvtGanttStyleUtils.getTaskPadding());
};

/**
 * Gets the dragged object during DnD (e.g. a DvtGanttTaskShape or DvtGanttTaskLabel).
 * @return {DvtGanttTaskShape|DvtGanttTaskLabel} The dragged object.
 */
DvtGanttTaskNode.prototype.getDraggedObject = function()
{
  return this._draggedObj;
};

/**
 * Sets the object dragged during Dnd (e.g. a DvtGanttTaskShape or DvtGanttTaskLabel).
 * @param {DvtGanttTaskShape|DvtGanttTaskLabel} draggedObj The dragged object.
 */
DvtGanttTaskNode.prototype.setDraggedObject = function(draggedObj)
{
  this._draggedObj = draggedObj;
};

/**
 * Setup on drag start
 */
DvtGanttTaskNode.prototype.dragStartSetup = function()
{
  // Remove all DnD artifacts except for the currently dragged one (note if this._draggedObj is not an affordance or null then all artifacts are removed)
  this.hideDnDArtifacts(this._draggedObj);
};

/**
 * Cleanup on drag end
 */
DvtGanttTaskNode.prototype.dragEndCleanup = function()
{
  // Remove all DnD artifacts
  this.hideDnDArtifacts();
};

/**
 * Show the drag feedbacks accordingly; called by DnD handlers.
 * @param {dvt.MouseEvent|dvt.KeyboardEvent|dvt.ComponentTouchEvent} event DnD dragOver event, keyboard, or touch event that triggered the feedback
 * @param {dvt.Point} localPos The position (e.g. the cursor point during drag) in reference to the affordance container coord system
 * @param {object} dropObj The current drop target logical object
 * @param {dvt.Point} dropOffset The difference between the position of the start and y of the task and the drag start event position (i.e. (start pos - event pos, y - event y pos)
 * @param {boolean=} Whether to turn edge auto pan off. Default false.
 */
DvtGanttTaskNode.prototype.showDragFeedback = function(event, localPos, dropObj, dropOffset, autoPanOff)
{
  if (this._draggedObj)
  {
    var dragSourceType = this._gantt.getEventManager().getDnDTaskSubType(this._draggedObj);

    var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
    var orientationFactor = isRTL ? 1 : -1;
    var artifactsContainer = this._gantt.getDnDArtifactsContainer();

    var ganttStartTime = this._gantt.getStartTime();
    var ganttEndTime = this._gantt.getEndTime();
    var ganttContentLength = this._gantt.getContentLength();

    switch (dragSourceType)
    {
      // TODO: Add cases for other drag source types, e.g. ports, handles, etc. when we add support for them in the future
      case 'tasks':
        // Pan to make room if dragging to edge
        var panDelta = !autoPanOff ? this._gantt.autoPanOnEdgeDrag(localPos, DvtGanttStyleUtils.getAutoPanEdgeThreshold(), false, false) : {deltaX: 0, deltaY: 0};
        var referenceFinalLocalX = dropOffset.x + localPos.x + panDelta.deltaX;
        var referenceFinalLocalY = dropOffset.y + localPos.y + panDelta.deltaY;

        // Update feedbacks.
        var referenceMainShape = this.getTask().getShape('main');
        if (this._mainDragFeedbacks)
        {
          for (var i = 0; i < this._mainDragFeedbacks.length; i++)
          {
            var dragFeedback = this._mainDragFeedbacks[i];
            var dragFeedbackOffset = this._mainDragFeedbackOffsets[i];
            var newFeedbackX = referenceFinalLocalX + dragFeedbackOffset.x;
            dragFeedback.setX(newFeedbackX);
            dragFeedback.setY(referenceFinalLocalY + dragFeedbackOffset.y);
            this._mainDragFeedbacksStartTime[i] = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, isRTL ? ganttContentLength - newFeedbackX : newFeedbackX, ganttContentLength)
          }
        }
        else
        {
          // First feedback corresponds to the task where drag was initiated. Other feedbacks are drawn for other selected tasks if applicable.
          var referenceDragFeedback = new DvtGanttTaskShape(this._gantt.getCtx(), referenceFinalLocalX, referenceFinalLocalY, referenceMainShape.getFinalWidth(), referenceMainShape.getFinalHeight(), referenceMainShape.getBorderRadius(), this.getTask(), 'mainDragFeedback');
          this._mainDragFeedbacks = [referenceDragFeedback];
          // TODO: consider moving the offsets and time properties to within DvtGanttTaskShape (or a subclass of it)
          this._mainDragFeedbackOffsets = [new dvt.Point(0, 0)];
          // time information is necessary for updating the feedback, e.g. in case the Gantt resized during move the feedback needs to be placed correctly under the new time axis.
          this._mainDragFeedbacksStartTime = [(this.getProps()['start'] != null) ? this.getProps()['start'] : this.getProps()['end']];
          artifactsContainer.addChild(referenceDragFeedback);

          if (this._gantt.isSelectionSupported() && this.isSelected() && this._gantt.getSelectionHandler().getSelectedCount() > 1)
          {
            var selection = this._gantt.getSelectionHandler().getSelection();
            for (i = 0; i < selection.length; i++)
            {
              var selectionObj = selection[i];
              if (selectionObj instanceof DvtGanttTaskNode && selectionObj !== this)
              {
                var mainShape = selectionObj.getTask().getShape('main');
                var offsetFromReferenceX = mainShape.getX() + selectionObj.getTranslateX() - (referenceMainShape.getX() + this.getTranslateX());
                var offsetFromReferenceY = mainShape.getY() + selectionObj.getTranslateY() - (referenceMainShape.getY() + this.getTranslateY());
                var dragFeedbackLocalX = referenceFinalLocalX + offsetFromReferenceX;
                var dragFeedbackLocalY = referenceFinalLocalY + offsetFromReferenceY;
                dragFeedback = new DvtGanttTaskShape(this._gantt.getCtx(), dragFeedbackLocalX, dragFeedbackLocalY, mainShape.getFinalWidth(), mainShape.getFinalHeight(), mainShape.getBorderRadius(), selectionObj.getTask(), 'mainDragFeedback');
                this._mainDragFeedbacks.push(dragFeedback);
                this._mainDragFeedbackOffsets.push(new dvt.Point(offsetFromReferenceX, offsetFromReferenceY));
                this._mainDragFeedbacksStartTime.push((selectionObj.getProps()['start'] != null) ? selectionObj.getProps()['start'] : selectionObj.getProps()['end']);
                artifactsContainer.addChild(dragFeedback);
              }
            }
          }
        }

        // Show tooltip
        var sandboxProps = this.getSandboxProps();
        if (dropObj)
        {
          if (dropObj instanceof DvtGanttRowNode)
          {
            sandboxProps['row'] = dropObj;
          }
          else if (dropObj instanceof DvtGanttTaskNode)
          {
            sandboxProps['row'] = dropObj.getRow();
          }
        }
        
        var sandboxStartTimePos = isRTL ? ganttContentLength - referenceFinalLocalX : referenceFinalLocalX;
        var sandboxEndTimePos = isRTL ? ganttContentLength - (referenceFinalLocalX - referenceMainShape.getFinalWidth()) : referenceFinalLocalX + referenceMainShape.getFinalWidth();
        sandboxProps['start'] = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, sandboxStartTimePos, ganttContentLength);
        sandboxProps['end'] = dvt.TimeAxis.getPositionDate(ganttStartTime, ganttEndTime, sandboxEndTimePos, ganttContentLength);

        var coords = this._mainDragFeedbacks[0].getDimensions(this.getCtx().getStage()).getCenter();
        var pageCoords = this.getCtx().stageToPageCoords(coords.x, coords.y);
        this._gantt.getEventManager().ProcessObjectTooltip(event, pageCoords.x, pageCoords.y, this, this._mainDragFeedbacks[0].getElem());
        break;
    }
  }
};

/**
 * Updates drag feedback positions on rerender, e.g. the Gantt resized when the feedbacks
 * are still present during keyboard move, in which case the feedback positions need to be updated
 * under the new time axis.
 */
DvtGanttTaskNode.prototype._updateDragFeedbacks = function()
{
  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
  if (this._mainDragFeedbacks)
  {
    var ganttStartTime = this._gantt.getStartTime();
    var ganttEndTime = this._gantt.getEndTime();
    var ganttContentLength = this._gantt.getContentLength();

    var newReferenceX = dvt.TimeAxis.getDatePosition(ganttStartTime, ganttEndTime, this._mainDragFeedbacksStartTime[0], ganttContentLength);
    newReferenceX = isRTL ? ganttContentLength - newReferenceX : newReferenceX;
    for (var i = 0; i < this._mainDragFeedbacks.length; i++)
    {
      var dragFeedback = this._mainDragFeedbacks[i];
      var dragFeedbackX = dvt.TimeAxis.getDatePosition(ganttStartTime, ganttEndTime, this._mainDragFeedbacksStartTime[i], ganttContentLength)
      dragFeedbackX = isRTL ? ganttContentLength - dragFeedbackX : dragFeedbackX;

      this._mainDragFeedbackOffsets[i].x = dragFeedbackX - newReferenceX; // recalculate x positional offsets

      dragFeedback.setX(dragFeedbackX);
      dragFeedback.setWidth(this.getTask().getShape('main').getFinalWidth());

      // update the source/reference feedback localpos (first maindragfeedback is that of the source)
      if (i == 0 && this._gantt.getEventManager()._moveFeedbackLocalPos)
        this._gantt.getEventManager()._moveFeedbackLocalPos.x = dragFeedbackX;
    }
  }
};

/**
 * Remove drag feedbacks.
 */
DvtGanttTaskNode.prototype.removeDragFeedbacks = function()
{
  if (this._mainDragFeedbacks)
  {
    for (var i = 0; i < this._mainDragFeedbacks.length; i++)
    {
      this._mainDragFeedbacks[i].getParent().removeChild(this._mainDragFeedbacks[i]);
    }
    this._mainDragFeedbacks = null;
    this._mainDragFeedbackOffsets = null;
    this._mainDragFeedbacksStartTime = null;
  }
  // Hide tooltips if any
  this._gantt.getEventManager().hideTooltip();
};

/**
 * Hide the drag affordances/feedbacks.
 * @param {DvtGanttTaskShape=} exclude Optional shape to exclude from removal (e.g. useful during drag)
 */
DvtGanttTaskNode.prototype.hideDnDArtifacts = function(exclude)
{
  var task = this.getTask();
  this.removeDragFeedbacks();  
};

/**
 * Gets the task
 * @return {DvtGanttTask} the task
 */
DvtGanttTaskNode.prototype.getTask = function()
{
  return this._task;
};

/**
 * Gets the task label
 * @return {DvtGanttTaskLabel} the task label
 */
DvtGanttTaskNode.prototype.getTaskLabel = function()
{
  return this._taskLabel;
};

/**
 * Renders the task node
 * @param {dvt.Container} container the container to render the task container into.
 */
DvtGanttTaskNode.prototype.render = function(container)
{
  var finalStates;

  // Clear any dependencies from previous renders
  this._successors = null;
  this._predecessors = null;

  if (this.isSelectable())
    this.setCursor(dvt.SelectionEffectUtils.getSelectingCursor());

  if (this.getParent() != container)
    container.addChild(this);

  this.setAriaRole('img');
  if (dvt.TimeAxis.supportsTouch())
  {
    this.refreshAriaLabel();
  }

  // Render task elements (labels will be rendered later, see DvtGanttRowNode.render())
  this._task.render();

  // Update drag feedback positions
  this._updateDragFeedbacks();

  finalStates = {
    'x': this._finalX,
    'y': this._finalY
  };
  this._gantt.getAnimationManager().preAnimateTaskNode(this, finalStates);
};

/**
 * Removes the task node
 */
DvtGanttTaskNode.prototype.remove = function()
{
  var onEnd, self = this;

  onEnd = function() {
    if (self.getRenderState() === 'delete')
    {
      self._row.removeChild(self);
    }
  };

  this._gantt.getAnimationManager().preAnimateTaskNodeRemove(this, onEnd);
};

/**
 * Adds a dependency line object that connects to its predecessor
 * @param {DvtGanttDependencyNode} predecessor
 */
DvtGanttTaskNode.prototype.addPredecessorDependency = function(predecessor)
{
  if (this._predecessors == null)
    this._predecessors = [];
  this._predecessors.push(predecessor);
};

/**
 * Gets a list of dependency line objects that connects to its predecessor
 * @return {DvtGanttDependencyNode[]} an array of dependency nodes
 */
DvtGanttTaskNode.prototype.getPredecessorDependencies = function()
{
  return this._predecessors;
};

/**
 * Adds a dependency line object that connects to its successor
 * @param {DvtGanttDependencyNode} successor
 */
DvtGanttTaskNode.prototype.addSuccessorDependency = function(successor)
{
  if (this._successors == null)
    this._successors = [];
  this._successors.push(successor);
};

/**
 * Gets a list of dependency line objects that connects to its successor
 * @return {DvtGanttDependencyNode[]} an array of dependency nodes
 */
DvtGanttTaskNode.prototype.getSuccessorDependencies = function()
{
  return this._successors;
};

/**
 * Gets final x (animation independent, e.g. final x after animation finishes)
 * @return {number} The final x.
 */
DvtGanttTaskNode.prototype.getFinalX = function()
{
  return this._finalX;
};

/**
 * Sets final x
 * @param {number} finalX The final x
 */
DvtGanttTaskNode.prototype.setFinalX = function(finalX)
{
  this._finalX = finalX;
};

/**
 * Gets final y (animation independent, e.g. final y after animation finishes)
 * @return {number} The final y.
 */
DvtGanttTaskNode.prototype.getFinalY = function()
{
  return this._finalY;
};

/**
 * Sets final y
 * @param {number} finalY The final y
 */
DvtGanttTaskNode.prototype.setFinalY = function(finalY)
{
  this._finalY = finalY;
};

/**
 * Gets final height (animation independent, e.g. final height after animation finishes)
 * @param {boolean=} excludeProgress Whether to exclude the progress height in the calculation
 * @return {number} The final height.
 */
DvtGanttTaskNode.prototype.getFinalHeight = function(excludeProgress)
{
  return this._task.getFinalHeight(excludeProgress);
};

/**
 * Gets the duration string
 * @param {number} startTime
 * @param {number} endTime
 * @return {string} The duration string.
 */
DvtGanttTaskNode.prototype.getDuration = function(startTime, endTime)
{
  var options = this._gantt.getOptions();
  var hours = 1000 * 60 * 60;
  var days = hours * 24;
  var duration = endTime - startTime;
  var scale = this._gantt.getMinorAxis().getScale();
  if (scale == 'hours' || scale == 'minutes' || scale == 'seconds')
  {
    duration = Math.round((duration / hours) * 100) / 100;
    return dvt.Bundle.getTranslation(options, 'accessibleDurationHours', dvt.Bundle.UTIL_PREFIX, 'DURATION_HOURS', [duration]);
  }
  else
  {
    duration = Math.round((duration / days) * 100) / 100;
    return dvt.Bundle.getTranslation(options, 'accessibleDurationDays', dvt.Bundle.UTIL_PREFIX, 'DURATION_DAYS', [duration]);
  }
};

/**
 * Gets the aria label
 * @return {string} the aria label string.
 */
DvtGanttTaskNode.prototype.getAriaLabel = function() 
{
  var states = [];
  var options = this._gantt.getOptions();
  if (this.isSelectable())
    states.push(dvt.Bundle.getTranslation(options, this.isSelected() ? 'stateSelected' : 'stateUnselected', dvt.Bundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));

  var shortDesc = DvtGanttTooltipUtils.getDatatip(this, false, true);
  if (this._task.isMilestone('main')) // note doesn't really make a difference if we query 'main' or 'baseline'
  {
    shortDesc = dvt.Bundle.getTranslation(options, 'accessibleTaskTypeMilestone') + ', ' + shortDesc;
  }
  else if (this._task.isSummary('main')) // note doesn't really make a difference if we query 'main' or 'baseline'
  {
    shortDesc = dvt.Bundle.getTranslation(options, 'accessibleTaskTypeSummary') + ', ' + shortDesc;
  }

  // include hint of whether there are predecessors or successors
  if (this._predecessors != null || this._successors != null)
  {
    var depDesc = '';
    if (this._predecessors != null && this._predecessors.length > 0)
    {
      depDesc = dvt.Bundle.getTranslation(options, 'accessiblePredecessorInfo', dvt.Bundle.UTIL_PREFIX, 'PREDECESSOR_INFO', [this._predecessors.length]);

      // for VoiceOver/Talkback we'll need to include the full detail of the dependency in the task since we can't
      // navigate to the dependency line directly
      if (dvt.TimeAxis.supportsTouch())
      {
        for (var i = 0; i < this._predecessors.length; i++)
          depDesc = depDesc + ', ' + this._predecessors[i].getAriaLabel();
      }
    }

    if (this._successors != null && this._successors.length > 0)
    {
      if (depDesc.length > 0)
        depDesc = depDesc + ', ';
      depDesc = depDesc + dvt.Bundle.getTranslation(options, 'accessibleSuccessorInfo', dvt.Bundle.UTIL_PREFIX, 'SUCCESSOR_INFO', [this._successors.length]);

      if (dvt.TimeAxis.supportsTouch())
      {
        for (i = 0; i < this._successors.length; i++)
          depDesc = depDesc + ', ' + this._successors[i].getAriaLabel();
      }
    }

    if (depDesc.length > 0)
      shortDesc = shortDesc + ', ' + depDesc;
  }

  var ariaLabel = dvt.Displayable.generateAriaLabel(shortDesc, states);
  var currentAriaLabel = this.getAriaProperty('label');
  // coming from setActiveElement() and nothing changed, must have been updated through selection, skipped
  if (currentAriaLabel != null && currentAriaLabel.indexOf(ariaLabel) > -1)
    return null;
  else
    return ariaLabel;
};

/**
 * Refresh the aria-label with the current row index info
 * Called by DvtGanttTaskDependencyNode
 */
DvtGanttTaskNode.prototype.refreshAriaLabel = function()
{
  this._updateAriaLabel();
};

/**
 * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
 * when the activeElement is set.
 * @private
 */
DvtGanttTaskNode.prototype._updateAriaLabel = function() 
{
  this.setAriaProperty('label', this.getAriaLabel());
  this.applyAriaProperties();
};

/**
 * Returns the data context (e.g. for passing to tooltip renderer, for DnD, etc.)
 * @return {object}
 */
DvtGanttTaskNode.prototype.getDataContext = function()
{
  return {
    'data': this.getProps(),
    'rowData': this._row.getProps(),
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
DvtGanttTaskNode.prototype.getSandboxDataContext = function()
{
  return {
    'data': this.getSandboxProps(),
    'rowData': this.getSandboxProps()['row'].getProps(),
    'color': DvtGanttTooltipUtils.getDatatipColor(this),
    'component': this._gantt.getOptions()['_widgetConstructor']
  };
};

//---------------------------------------------------------------------//
// Tooltip Support: DvtTooltipSource impl                              //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtGanttTaskNode.prototype.getDatatip = function() {
  return DvtGanttTooltipUtils.getDatatip(this, true);
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.getDatatipColor = function() {
  return DvtGanttTooltipUtils.getDatatipColor(this);
};
//---------------------------------------------------------------------//
// Selection Support: DvtSelectable impl                               //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtGanttTaskNode.prototype.isSelectable = function() 
{
  return this._gantt.getOptions()['selectionMode'] != 'none';
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.isSelected = function() 
{
  return this._selected;
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.setSelected = function(selected)
{
  this._selected = selected;

  if (this._selected)
  {
    this._task.showEffect('selected');
  }
  else
  {
    this._task.removeEffect('selected');
  }

  this._updateAriaLabel();

  this._gantt.setCurrentRow(this.getRow().getId());
};

/**
 * Show hover effect on task bar
 * @override
 */
DvtGanttTaskNode.prototype.showHoverEffect = function() 
{
  this._task.showEffect('hover');
};

/**
 * Hide hover effect on task bar
 * @override
 */
DvtGanttTaskNode.prototype.hideHoverEffect = function() 
{
  this._task.removeEffect('hover');
};

//---------------------------------------------------------------------//
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtGanttTaskNode.prototype.getNextNavigable = function(event) 
{
  var next = null;
  var keyboardHandler = this._gantt.getEventManager().getKeyboardHandler();
  if (event.type == dvt.MouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event))
    next = this;
  else if ((event.keyCode == dvt.KeyboardEvent.OPEN_ANGLED_BRACKET || dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET) && event.altKey)
  {
    // get first navigable dependency line if exists
    var keyboardHandler = this._gantt.getEventManager().getKeyboardHandler();
    if (keyboardHandler && keyboardHandler.getFirstNavigableDependencyLine)
    {
      if (dvt.Agent.isRightToLeft(this.getGantt().getCtx()))
        var type = event.keyCode == dvt.KeyboardEvent.CLOSE_ANGLED_BRACKET ? 'predecessor' : 'successor';
      else
        type = event.keyCode == dvt.KeyboardEvent.OPEN_ANGLED_BRACKET ? 'predecessor' : 'successor';
      var dependencyLines = this._gantt.getNavigableDependencyLinesForTask(this, type);
      next = keyboardHandler.getFirstNavigableDependencyLine(this, event, dependencyLines);
    }
    if (next)
      next.setKeyboardFocusTask(this);
    else
      next = this;
  }
  // The normal navigation keys (up/down/right/left arrows) have different meanings in DnD Move mode, and handled separately in keyboardHandler
  else if (keyboardHandler.isNavigationEvent(event) && !this._gantt.getEventManager().isMoveInitiated())
    next = DvtGanttKeyboardHandler.getNextNavigable(this._gantt, this, event);

  return next;
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.getTargetElem = function() 
{
  return this._task.getShape('main').getElem();
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  return this.getDimensions(targetCoordinateSpace);
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.showKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = true;
  this._task.showEffect('focus');
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.hideKeyboardFocusEffect = function()
{
  if (this.isShowingKeyboardFocusEffect())
  {
    this._isShowingKeyboardFocusEffect = false;
    this.hideHoverEffect();
  }
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.isShowingKeyboardFocusEffect = function()
{
  return this._isShowingKeyboardFocusEffect;
};

//---------------------------------------------------------------------//
// DnD Support: DvtDraggable impl                                      //
//---------------------------------------------------------------------//
/**
 * @override
 */
DvtGanttTaskNode.prototype.isDragAvailable = function(clientIds) {
  return true;
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.getDragTransferable = function(mouseX, mouseY) {
  return [this.getProps()['id']];
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.getDragFeedback = function(mouseX, mouseY) {
  // return null to not use the default ghost image--show something specific in showDragFeedback method instead.
  return null;
};

/**
 * Class representing a task, which manages a collection
 * of elements (the main shape, baseline, progress, etc).
 * @param {dvt.Gantt} gantt The gantt component
 * @param {DvtGanttTaskNode} container The containing task node
 * @class
 * @constructor
 */
var DvtGanttTask = function(gantt, container)
{
  this.Init(gantt, container);
};

dvt.Obj.createSubclass(DvtGanttTask, dvt.Obj);

/**
 * @param {dvt.Gantt} gantt The gantt component
 * @param {DvtGanttTaskNode} container The containing task node
 * @protected
 */
DvtGanttTask.prototype.Init = function(gantt, container)
{
  this._gantt = gantt;
  this._container = container;
};

/**
 * Gets the gantt
 * @return {dvt.Gantt} The gantt
 */
DvtGanttTask.prototype.getGantt = function()
{
  return this._gantt;
};

/**
 * Gets the parent task node.
 * @return {DvtGanttTaskNode} the parent task node.
 */
DvtGanttTask.prototype.getContainer = function()
{
  return this._container;
};

/**
 * Gets a particular task shape
 * @param {string} shapeType The shape type
 * @return {DvtGanttTaskShape} the main shape
 */
DvtGanttTask.prototype.getShape = function(shapeType)
{
  if (shapeType === 'main')
  {
    return this._mainShape;
  }
  if (shapeType === 'progress')
  {
    return this._progressShape;
  }
  if (shapeType === 'baseline')
  {
    return this._baselineShape;
  }
};

/**
 * Retrieve the style of the task
 * @param {object} parentProp The level of option that directly contains the svgStyle and svgClassName
 * @return {string|object} the style of the task
 */
DvtGanttTask.prototype.getSvgStyle = function(parentProp)
{
  // TODO: Once we finish deprecating 'style' just retrieve 'svgStyle'
  return parentProp['svgStyle'] ? parentProp['svgStyle'] : parentProp['style'];
};

/**
 * Retrieve the class name of the task
 * @param {object} parentProp
 * @return {string} the class name of the task
 */
DvtGanttTask.prototype.getSvgClassName = function(parentProp)
{
  // TODO: Once we finish deprecating 'className' just retrieve 'svgClassName'
  return parentProp['svgClassName'] ? parentProp['svgClassName'] : parentProp['className'];
};

/**
 * Applies svgStyle and svgClassname
 * @param {DvtGanttTaskShape} taskShape The target task shape
 * @param {object} parentProp The level of option that directly contains the svgStyle and svgClassName
 * @private
 */
DvtGanttTask.prototype._applyStyles = function(taskShape, parentProp)
{
  var svgClassName = this.getSvgClassName(parentProp),
      svgStyle = this.getSvgStyle(parentProp);

  if (svgClassName)
  {
    taskShape.setClassName(taskShape.getClassName() + ' ' + svgClassName);
  }

  // TODO: once we fully deprecate string type, remove the string check logic
  if (typeof svgStyle === 'string')
  {
    dvt.ToolkitUtils.setAttrNullNS(taskShape.getElem(), 'style', svgStyle);
  }
  else
  {
    taskShape.setStyle(svgStyle);
  }
};

/**
 * Whether the task element should be shown as a milestone
 * @param {string} elementType The task element in question
 * @return {boolean} whether the task element should be shown as a milestone
 */
DvtGanttTask.prototype.isMilestone = function(elementType)
{
  var taskProps = this._container.getProps(),
      baselineProps = taskProps['baseline'],
      start, end;

  if (taskProps['type'] === 'milestone')
  {
    return true;
  }
  else if (taskProps['type'] === 'auto')
  {
    if (elementType === 'mainDragFeedback' || DvtGanttTaskShape.MAIN_TYPES.indexOf(elementType) > -1)
    {
      start = taskProps['start'];
      end = taskProps['end'];
    }
    else if (DvtGanttTaskShape.BASELINE_TYPES.indexOf(elementType) > -1)
    {
      start = baselineProps['start'];
      end = baselineProps['end'];
    }
    return (start != null && start == end) || (start != null && end == null) || (start == null && end != null);
  }
  return false;
};

/**
 * Whether the task element should be shown as a summary
 * @param {string} elementType The task element in question
 * @return {boolean} whether the task element should be shown as a summary
 */
DvtGanttTask.prototype.isSummary = function(elementType)
{
  // For now, whether a task is displayed as a summary is purely based on whether task type is 'summary'
  var taskProps = this._container.getProps();
  return elementType === 'main' && taskProps['type'] === 'summary';
};

/**
 * Gets positional information given start and end
 * @param {number} start
 * @param {number} end
 * @return {object} object containing positional information
 */
DvtGanttTask.prototype.getTimeSpanDimensions = function(start, end)
{
  var ganttMinTime = this._gantt.getStartTime(),
      ganttMaxTime = this._gantt.getEndTime(),
      ganttWidth = this._gantt.getContentLength(),
      isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx()),
      startPos, endPos;

  if (!(start == null && end == null))
  {
    if (start == null)
    {
      start = end;
    }
    else if (end == null)
    {
      end = start;
    }

    startPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, start, ganttWidth);
    endPos = dvt.TimeAxis.getDatePosition(ganttMinTime, ganttMaxTime, end, ganttWidth);

    if (isRTL)
    {
      startPos = ganttWidth - startPos;
      endPos = ganttWidth - endPos;
    }

    return {'startPos': startPos, 'endPos': endPos, 'distance': endPos - startPos};
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
DvtGanttTask.prototype.getFillColor = function()
{
  // Current design: fill color refers to main shape's fill color
  // Note cached value is cleared every new render in renderMain()
  if (this._fillColor == null)
  {
    if (this._mainShape == null)
    {
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
DvtGanttTask.prototype.getFinalHeight = function(excludeProgress)
{
  // Calculate based on options so that one can call this method
  // before task is fully rendered
  var taskProps = this._container.getProps();
  var baselineProps = taskProps['baseline'];

  var taskHeight = taskProps['height'];
  var baselineHeight = 0;
  if (baselineProps && !(baselineProps['start'] == null && baselineProps['end'] == null))
  {
    baselineHeight = baselineProps['height'];
  }

  var heightTaskToptoBaselineBottom = this.isMilestone('baseline') ? DvtGanttStyleUtils.getMilestoneBaselineYOffset() + Math.max(baselineHeight, taskHeight) : taskHeight + baselineHeight;

  if (!excludeProgress)
  {
    var progressHeight = this.getProgressValue() !== null ? this.getProgressHeight() : 0;
    if (taskHeight < progressHeight)
    {
      return Math.max(progressHeight, (progressHeight - taskHeight) / 2 + heightTaskToptoBaselineBottom);
    }
  }
  return heightTaskToptoBaselineBottom;
};

/**
 * Shows the task effects
 * @param {string} effectType The effect type (selected, hover, or focus)
 */
DvtGanttTask.prototype.showEffect = function(effectType)
{
  this.showMainEffect(effectType);
};

/**
 * Removes the task effects
 * @param {string} effectType The effect type (selected, hover, or focus)
 */
DvtGanttTask.prototype.removeEffect = function(effectType)
{
  this.removeMainEffect(effectType);
};

/**
 * Renders the elements that make up the task
 */
DvtGanttTask.prototype.render = function()
{
  // Task elements y positioning depends on progress bar height. Precalculate this value:
  var progressHeight = this.getProgressValue() !== null ? this.getProgressHeight() : 0;

  // Rendering in this order to ensure desired stacking on initial render
  this.renderBaseline(progressHeight);
  this.renderMain(progressHeight);
  this.renderProgress(progressHeight);
  if (this._container.getProps()['type'] === 'summary' && this._mainShape)
  {
    this._container.addChild(this._mainShape); // summary shapes should be on top of everything
  }
};

/**
 * Gets the render state of a particular task element
 * @param {string} shapeType
 * @return {string} the render state
 */
DvtGanttTask.prototype.getRenderState = function(shapeType)
{
  if (shapeType === 'main')
  {
    return this._mainShape.getRenderState();
  }
  if (shapeType === 'progress')
  {
    return this._progressShape.getRenderState();
  }
  if (shapeType === 'baseline')
  {
    return this._baselineShape.getRenderState();
  }
};

/**
 * Renders the baseline shape of the task.
 * @param {number} progressHeight The height of the progress bar, necessary for relative y positioning.
 */
DvtGanttTask.prototype.renderBaseline = function(progressHeight)
{
  var taskProps = this._container.getProps(), isMilestone,
      baselineProps = taskProps['baseline'], yOffset,
      self = this, finalStates, offsetDim,
      onRenderEnd, baselineDim, x, y, width, height, borderRadius;

  if (baselineProps)
  {
    // If type is "milestone", and if 'start' and 'end' values are specified and unequal, the 'start' value is used to evaluate position.
    baselineDim = this.getTimeSpanDimensions(baselineProps['start'], (taskProps['type'] === 'milestone' && baselineProps['start'] != null && baselineProps['start'] != baselineProps['end']) ? baselineProps['start'] : baselineProps['end']);
    if (baselineDim)
    {
      // Determine offset from main element
      offsetDim = this.getTimeSpanDimensions(taskProps['start'] ? taskProps['start'] : taskProps['end'], baselineProps['start']);

      isMilestone = this.isMilestone('baseline');

      // Calculate final dimensions
      x = offsetDim ? offsetDim['distance'] : 0;
      width = Math.abs(baselineDim['distance']);
      height = baselineProps['height'];
      yOffset = isMilestone ? Math.max(taskProps['height'], height) + DvtGanttStyleUtils.getMilestoneBaselineYOffset() - height : taskProps['height'];
      y = Math.max(0, (progressHeight - taskProps['height']) / 2) + yOffset;
      borderRadius = baselineProps['borderRadius'];

      // element doesn't exist in DOM already
      if (this._baselineShape == null)
      {
        this._baselineShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, width, height, borderRadius, this, 'baseline');
        if (isMilestone)
        {
          // Ensure baseline milestone is behind actual milestone. Slight performance hit to ensure this, so don't bother for bar case.
          this._container.addChildAt(this._baselineShape, 0);
        }
        else
        {
          this._container.addChild(this._baselineShape); // Layering doesn't matter for bar case because there's no overlap.
        }
        this._baselineShape.setRenderState('add');
      }
      else
      {
        this._baselineShape.setRenderState(this._container.getRenderState() === 'refurbish' ? 'add' : 'exist');
        if (isMilestone) // case where was bar baseline, but turned to milestone baseline on rerender, then make sure it's behind everything
        {
          this._container.addChildAt(this._baselineShape, 0);
        }
      }

      // Since final dimensions are not applied until after animations (if any), store
      // them so that they can be retrieved for calculating final dimensions for other elements
      this._baselineShape.setFinalWidth(width);
      this._baselineShape.setFinalHeight(height);
      this._baselineShape.setFinalX(x);
      this._baselineShape.setFinalY(y);

      onRenderEnd = function() {
        // Apply styles (default classes handled by DvtGanttTaskShape instance)
        self._applyStyles(self._baselineShape, baselineProps);
      };

      finalStates = {
        'x': x,
        'y': y,
        'w': width,
        'h': height,
        'r': borderRadius
      };
      this._gantt.getAnimationManager().preAnimateTaskBaseline(this, this._baselineShape, finalStates, onRenderEnd);
    }
    else
    {
      this.removeBaseline();
    }
  }
  else
  {
    this.removeBaseline();
  }
};

/**
 * Removes the baseline shape.
 */
DvtGanttTask.prototype.removeBaseline = function()
{
  var self = this, onRemoveEnd;
  if (this._baselineShape)
  {
    onRemoveEnd = function() {
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
DvtGanttTask.prototype.renderMain = function(progressHeight)
{
  var taskProps = this._container.getProps(),
      taskHeight = taskProps['height'],
      self = this, finalStates,
      onRenderEnd, mainDim, x, y, width, height, borderRadius;

  if (taskProps)
  {
    // If type is "milestone", and if 'start' and 'end' values are specified and unequal, the 'start' value is used to evaluate position.
    mainDim = this.getTimeSpanDimensions(taskProps['start'], (taskProps['type'] === 'milestone' && taskProps['start'] != null && taskProps['start'] != taskProps['end']) ? taskProps['start'] : taskProps['end']);
    if (mainDim)
    {
      // Calculate final dimensions
      x = 0;
      y = Math.max(0, (progressHeight - taskHeight) / 2);
      width = Math.abs(mainDim['distance']);
      // Summary task case, want the summary task shape to take on the full height
      height = this.isSummary('main') ? this._container.getFinalHeight(true) : taskHeight;
      borderRadius = taskProps['borderRadius'];

      if (this._mainShape == null) // element doesn't exist in DOM already
      {
        this._mainShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, width, height, borderRadius, this, 'main');
        this._container.addChild(this._mainShape);
        this._mainShape.setRenderState('add');
      }
      else
      {
        this._mainShape.setRenderState(this._container.getRenderState() === 'refurbish' ? 'add' : 'exist');
      }

      // Since final dimensions are not applied until after animations (if any), store
      // them so that they can be retrieved for calculating final dimensions for other elements
      this._mainShape.setFinalWidth(width);
      this._mainShape.setFinalHeight(height);
      this._mainShape.setFinalX(x);
      this._mainShape.setFinalY(y);

      // Called at the end of animation (if any)
      onRenderEnd = function() {
        // Apply styles (default classes handled by DvtGanttTaskShape instance)
        self._fillColor = null; // clear cached fill color
        self._applyStyles(self._mainShape, taskProps);
      };

      finalStates = {
        'x': x,
        'y': y,
        'w': width,
        'h': height,
        'r': borderRadius
      };
      this._gantt.getAnimationManager().preAnimateTaskMain(this, finalStates, onRenderEnd);
    }
    else
    {
      this.removeMain();
    }
  }
  else
  {
    this.removeMain();
  }
};

/**
 * Renders the main shape effect
 * @param {string} effectType The effect type (selected, hover, or focus)
 */
DvtGanttTask.prototype.showMainEffect = function(effectType)
{
  // Get main shape dimensions
  var x = this._mainShape.getX(),
      y = this._mainShape.getY(),
      w = this._mainShape.getWidth(),
      h = this._mainShape.getHeight(),
      r = this._mainShape.getBorderRadius();
  if (effectType === 'selected')
  {
    if (this._mainSelectShape == null)
    {
      this._mainSelectShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, w, h, r, this, 'mainSelect');

      // must be inserted before the main shape
      this._container.addChildAt(this._mainSelectShape, 0);

      // Layer this taskNode in front of all other taskNodes in the row (see )
      this._container.getParent().addChild(this._container);
    }
  }
  else if (effectType === 'hover' || effectType === 'focus')
  {
    if (this._mainHoverShape == null)
    {
      this._mainHoverShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, w, h, r, this, 'mainHover');

      // must be inserted before the shape and after selected effect (if any)
      // easiest way to gaurantee this would be to insert immediately before main shape
      this._container.addChildAt(this._mainHoverShape, this._container.getChildIndex(this._mainShape));

      // Layer this taskNode in front of all other taskNodes in the row (see )
      this._container.getParent().addChild(this._container);
    }
  }
};

/**
 * Removes the main shape effect
 * @param {string} effectType The effect type (selected, hover, or focus)
 */
DvtGanttTask.prototype.removeMainEffect = function(effectType)
{
  if (effectType === 'selected')
  {
    if (this._mainSelectShape != null)
    {
      this._container.removeChild(this._mainSelectShape);
    }
    this._mainSelectShape = null;
  }
  else if (effectType === 'hover' || effectType === 'focus')
  {
    if (this._mainHoverShape != null)
    {
      this._container.removeChild(this._mainHoverShape);

      // Layer this task behind all other tasks in the row
      // to ensure selected tasks are in front (see )
      if (!this._container.isSelected())
      {
        this._container.getParent().addChildAt(this._container, 0);
      }
    }
    this._mainHoverShape = null;
  }
};

/**
 * Gets the width of the main shape
 * @return {number} The width of the main shape
 */
DvtGanttTask.prototype.getMainWidth = function()
{
  return this._mainShape.getWidth();
};

/**
 * Sets the width of the main shape
 * @param {number} width The width of the main shape
 */
DvtGanttTask.prototype.setMainWidth = function(width)
{
  this._mainShape.setWidth(width);
  if (this._mainSelectShape)
  {
    this._mainSelectShape.setWidth(width);
  }
  if (this._mainHoverShape)
  {
    this._mainHoverShape.setWidth(width);
  }
};

/**
 * Gets the height of the main shape
 * @return {number} The height of the main shape
 */
DvtGanttTask.prototype.getMainHeight = function()
{
  return this._mainShape.getHeight();
};

/**
 * Sets the height of the main shape
 * @param {number} height The height of the main shape
 */
DvtGanttTask.prototype.setMainHeight = function(height)
{
  this._mainShape.setHeight(height);
  if (this._mainSelectShape)
  {
    this._mainSelectShape.setHeight(height);
  }
  if (this._mainHoverShape)
  {
    this._mainHoverShape.setHeight(height);
  }
};

/**
 * Gets the x of the main shape
 * @return {number} The x of the main shape
 */
DvtGanttTask.prototype.getMainX = function()
{
  return this._mainShape.getX();
};

/**
 * Sets the x of the main shape
 * @param {number} x The x of the main shape
 */
DvtGanttTask.prototype.setMainX = function(x)
{
  this._mainShape.setX(x);
  if (this._mainSelectShape)
  {
    this._mainSelectShape.setX(x);
  }
  if (this._mainHoverShape)
  {
    this._mainHoverShape.setX(x);
  }
};

/**
 * Gets the y of the main shape
 * @return {number} The y of the main shape
 */
DvtGanttTask.prototype.getMainY = function()
{
  return this._mainShape.getY();
};

/**
 * Sets the y of the main shape
 * @param {number} y The y of the main shape
 */
DvtGanttTask.prototype.setMainY = function(y)
{
  this._mainShape.setY(y);
  if (this._mainSelectShape)
  {
    this._mainSelectShape.setY(y);
  }
  if (this._mainHoverShape)
  {
    this._mainHoverShape.setY(y);
  }
};

/**
 * Gets the border radius of the main shape
 * @return {string} The border radius of the main shape
 */
DvtGanttTask.prototype.getMainBorderRadius = function()
{
  return this._mainShape.getY();
};

/**
 * Sets the border radius of the main shape
 * @param {string} r The border radius of the main shape
 */
DvtGanttTask.prototype.setMainBorderRadius = function(r)
{
  this._mainShape.setBorderRadius(r);
  if (this._mainSelectShape)
  {
    this._mainSelectShape.setBorderRadius(r);
  }
  if (this._mainHoverShape)
  {
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
DvtGanttTask.prototype.setMainDimensions = function(x, y, w, h, r)
{
  this._mainShape.setDimensions(x, y, w, h, r);
  if (this._mainSelectShape)
  {
    this._mainSelectShape.setDimensions(x, y, w, h, r);
  }
  if (this._mainHoverShape)
  {
    this._mainHoverShape.setDimensions(x, y, w, h, r);
  }
};

/**
 * Removes the main shape
 */
DvtGanttTask.prototype.removeMain = function()
{
  var self = this, onRemoveEnd;
  if (this._mainShape)
  {
    onRemoveEnd = function() {
      self.removeMainEffect('selected');
      self._container.removeChild(self._mainShape);
      self._mainShape = null;

      // remove progress as well
      self.removeProgress();
    };
    this._gantt.getAnimationManager().preAnimateTaskMainRemove(this._mainShape, this._mainSelectShape, this._mainHoverShape, onRemoveEnd);
  }
};

/**
 * Gets the progress value.
 * @return {number} The progress value. Null if invalid.
 */
DvtGanttTask.prototype.getProgressValue = function()
{
  var taskProps = this._container.getProps(),
      progressProps = taskProps['progress'];

  if (!this.isMilestone('main') && progressProps && typeof progressProps['value'] === 'number')
  {
    return progressProps['value'];
  }
  return null;
};

/**
 * Gets the progress height in pixels.
 * @return {number} The progress height in pixels.
 */
DvtGanttTask.prototype.getProgressHeight = function()
{
  var taskProps = this._container.getProps(),
      progressProps = taskProps['progress'],
      progressHeightValue, taskHeight;

  if (progressProps && !this.isMilestone('main'))
  {
    progressHeightValue = progressProps['height'];
    taskHeight = taskProps['height'];
    return progressHeightValue === '100%' ? taskHeight : DvtGanttStyleUtils.getSizeInPixels(progressHeightValue, taskHeight);
  }
  return 0;
};

/**
 * Renders the progress shape of the task.
 * @param {number} progressHeight The height of the progress bar in pixels.
 */
DvtGanttTask.prototype.renderProgress = function(progressHeight)
{
  var taskProps = this._container.getProps(),
      progressProps = taskProps['progress'],
      taskHeight = taskProps['height'],
      progressValue = this.getProgressValue(),
      self = this, onRenderEnd, finalStates,
      progressDim, x, y, width, height, borderRadius;

  if (progressValue !== null && this._mainShape && !this.isMilestone('main'))
  {
    // Calculate final dimensions
    x = 0;
    y = Math.max(0, (taskHeight - progressHeight) / 2);
    width = progressValue * this._mainShape.getFinalWidth();
    borderRadius = progressProps['borderRadius'];

    if (this._progressShape == null) // element doesn't exist in DOM already
    {
      this._progressShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, width, progressHeight, borderRadius, this, 'progress');
      this._container.addChild(this._progressShape);
      this._progressShape.setRenderState('add');
    }
    else
    {
      this._progressShape.setRenderState(this._container.getRenderState() === 'refurbish' ? 'add' : 'exist');
    }

    this._progressShape.setFinalWidth(width);
    this._progressShape.setFinalHeight(progressHeight);
    this._progressShape.setFinalX(x);
    this._progressShape.setFinalY(y);

    onRenderEnd = function() {
      // Apply styles (default classes handled by DvtGanttTaskShape instance)
      self._applyStyles(self._progressShape, progressProps);
    };

    finalStates = {
      'x': x,
      'y': y,
      'w': width,
      'h': progressHeight,
      'r': borderRadius
    };
    this._gantt.getAnimationManager().preAnimateTaskProgress(this, this._progressShape, finalStates, onRenderEnd);
  }
  else
  {
    this.removeProgress();
  }
};

/**
 * Removes the progress shape.
 */
DvtGanttTask.prototype.removeProgress = function()
{
  var self = this, onRemoveEnd;
  if (this._progressShape)
  {
    onRemoveEnd = function() {
      self._container.removeChild(self._progressShape);
      self._progressShape = null;
    };
    this._gantt.getAnimationManager().preAnimateTaskProgressRemove(this._progressShape, onRemoveEnd);
  }
};

/**
 * Class that manages a task label
 * @param {dvt.Gantt} gantt The gantt component
 * @param {DvtGanttTaskNode} container The containing task node
 * @param {DvtGanttTaskShape} associatedShape The associated shape the label is for
 * @class
 * @constructor
 */
var DvtGanttTaskLabel = function(gantt, container, associatedShape)
{
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
DvtGanttTaskLabel.prototype.Init = function(gantt, container, associatedShape)
{
  this._gantt = gantt;
  this._container = container;
  this._associatedShape = associatedShape;
  this._renderState = 'add';
};

/**
 * Gets the gantt
 * @return {dvt.Gantt} The gantt
 */
DvtGanttTaskLabel.prototype.getGantt = function()
{
  return this._gantt;
};

/**
 * Gets the associated shape
 * @return {DvtGanttTaskShape} the associated shape
 */
DvtGanttTaskLabel.prototype.getAssociatedShape = function()
{
  return this._associatedShape;
};

/**
 * Sets the associated shape
 * @param {DvtGanttTaskShape} shape The associated shape
 */
DvtGanttTaskLabel.prototype.setAssociatedShape = function(shape)
{
  this._associatedShape = shape;
};

/**
 * Gets the label output text object
 * @return {dvt.OutputText} the label output text
 */
DvtGanttTaskLabel.prototype.getLabelOutputText = function()
{
  return this._labelOutputText;
};

/**
 * Gets the effective label position (e.g. labelPosition = 'auto', but actually placed at 'end').
 * @return {string} The effective label position.
 */
DvtGanttTaskLabel.prototype.getEffectiveLabelPosition = function()
{
  return this._effectiveLabelPosition;
};

/**
 * Gets the render state of the label
 * @return {string} the render state
 */
DvtGanttTaskLabel.prototype.getRenderState = function()
{
  return this._renderState;
};

/**
 * Applies styles on the label
 * @param {string|object} labelStyle
 * @private
 */
DvtGanttTaskLabel.prototype._applyStyles = function(labelStyle)
{
  var labelCSSStyle;

  if (labelStyle != null)
  {
    // Get the base label style dvt.CSSStyle object. Should not grab the one from cache
    // because we're going to be modifying it.
    labelCSSStyle = DvtGanttStyleUtils.getTaskLabelStyle(this._gantt.getOptions());

    labelCSSStyle.parseInlineStyle(labelStyle);
    // TODO: once we fully deprecate string type, remove the string logic
    if (typeof labelStyle === 'string')
    {
      dvt.ToolkitUtils.setAttrNullNS(this._labelOutputText.getElem(), 'style', labelStyle);
    }
    else
    {
      this._labelOutputText.setStyle(labelStyle); // works if style is object
    }
  }
  else
  {
    // Grab the base label style dvt.CSSStyle object from cache rather than instantiating
    // a new one for performance reasons
    labelCSSStyle = this._gantt.getCache().getFromCache('baseTaskLabelCSSStyle');
  }

  // necessary for getDimension/fitText to obtain CSS style of the text
  this._labelOutputText.setCSSStyle(labelCSSStyle);
};

/**
 * Positions the label accordingly.
 * @param {string} effectiveLabelPosition The effective label position.
 * @private
 */
DvtGanttTaskLabel.prototype._placeLabel = function(effectiveLabelPosition)
{
  var labelDimensions = this._labelOutputText.getDimensions(),
      isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx()),
      shapeLeftOffset, shapeRightOffset, shapeWidth,
      padding = DvtGanttStyleUtils.getTaskLabelPadding(),
      x, y, associatedShapeHeight;

  if (effectiveLabelPosition === 'progress' || effectiveLabelPosition === 'progressStart')
  {
    this.setAssociatedShape(this._container.getTask().getShape('progress'));
  }

  // Determine y position
  associatedShapeHeight = (this._associatedShape.getType() === 'main' && this._container.getTask().isSummary('main')) ? this._container.getProps()['height'] : this._associatedShape.getFinalHeight();
  y = this._associatedShape.getFinalY() + ((associatedShapeHeight - labelDimensions.h) / 2);
  this.setFinalY(y);

  // Determine x position (calculate LTR version, then flip for RTL)
  shapeWidth = this._associatedShape.getFinalWidth();
  shapeLeftOffset = (!isRTL) ? this._associatedShape.getPhysicalStartOffset() : this._associatedShape.getPhysicalEndOffset();
  shapeRightOffset = (!isRTL) ? this._associatedShape.getPhysicalEndOffset() : this._associatedShape.getPhysicalStartOffset();
  switch (effectiveLabelPosition)
  {
    case 'end':
      (!isRTL) ? this._labelOutputText.alignLeft() : this._labelOutputText.alignRight();
      x = shapeWidth + shapeRightOffset + padding;
      break;
    case 'progress':
      (!isRTL) ? this._labelOutputText.alignRight() : this._labelOutputText.alignLeft();
      x = shapeWidth - padding;
      break;
    case 'oProgress':
      (!isRTL) ? this._labelOutputText.alignLeft() : this._labelOutputText.alignRight();
      x = this._container.getTask().getShape('progress').getFinalWidth() + padding;
      break;
    case 'innerStart':
    case 'progressStart':
      (!isRTL) ? this._labelOutputText.alignLeft() : this._labelOutputText.alignRight();
      x = -shapeLeftOffset + padding;
      break;
    case 'innerEnd':
      (!isRTL) ? this._labelOutputText.alignRight() : this._labelOutputText.alignLeft();
      x = shapeWidth + shapeRightOffset - padding;
      break;
    case 'innerCenter':
      this._labelOutputText.alignCenter();
      x = shapeWidth / 2;
      break;
    case 'start':
      (!isRTL) ? this._labelOutputText.alignRight() : this._labelOutputText.alignLeft();
      x = -(shapeLeftOffset + padding);
      break;
  }
  if (isRTL)
  {
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
DvtGanttTaskLabel.prototype._getAvailableWidth = function(position)
{
  var startBarrier, endBarrier,
      previousAdjacentTaskNode, nextAdjacentTaskNode, task,
      nextAdjacentMilestoneBaselineTaskNode, previousAdjacentMilestoneBaselineTaskNode,
      taskMainBounds, progressShape, progressWidth, progressHeight, insideWidth, oProgressWidth,
      availableWidth, effectivePosition, labelDimensions,
      padding = DvtGanttStyleUtils.getTaskLabelPadding(),

      taskProps, progressValue, hasProgress, isMilestone,

      isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx()),
      ganttWidth = this._gantt.getContentLength(),
      ganttStartPos, ganttEndPos;

  // Calculate Gantt bounds
  ganttStartPos = !isRTL ? 0 : ganttWidth;
  ganttEndPos = ganttWidth - ganttStartPos;

  switch (position)
  {
    case 'end':
      endBarrier = ganttEndPos;
      nextAdjacentTaskNode = this._container.getNextAdjacentTaskNode();
      nextAdjacentMilestoneBaselineTaskNode = this._container.getNextAdjMilestoneBaselineTaskNode();
      if (nextAdjacentTaskNode)
      {
        endBarrier = nextAdjacentTaskNode.getTaskShapePhysicalBounds('main')['startPos'];
      }
      if (nextAdjacentMilestoneBaselineTaskNode)
      {
        endBarrier = isRTL ?
                     Math.max(endBarrier, nextAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')['startPos']) :
                     Math.min(endBarrier, nextAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')['startPos']);
      }
      availableWidth = Math.abs(this._container.getTaskShapePhysicalBounds('main')['endPos'] - endBarrier) - 2 * padding;
      effectivePosition = 'end';
      break;
    case 'innerCenter':
    case 'innerStart':
    case 'innerEnd':
      taskProps = this._container.getProps();
      progressValue = taskProps['progress'] ? taskProps['progress']['value'] : null;
      hasProgress = typeof progressValue === 'number';
      task = this._container.getTask();
      isMilestone = task.isMilestone('main');
      if (!isMilestone)
      {
        taskMainBounds = this._container.getTaskShapePhysicalBounds('main');
        insideWidth = Math.abs(taskMainBounds['endPos'] - taskMainBounds['startPos']);
        if (hasProgress)
        {
          labelDimensions = this._labelOutputText.getDimensions();
          progressShape = task.getShape('progress');
          if (progressShape)
          {
            progressWidth = progressShape.getFinalWidth();
            progressHeight = progressShape.getFinalHeight();
          }
          else
          {
            progressWidth = 0;
            progressHeight = 0;
          }
          oProgressWidth = insideWidth - progressWidth;

          // For 'innerStart', check if we can honor that even when there's a progress
          if (position === 'innerStart')
          {
            availableWidth = progressWidth - 2 * padding;
            if (labelDimensions.w <= availableWidth && labelDimensions.h <= progressHeight)
            {
              effectivePosition = 'progressStart';
              break;
            }
          }
          // For 'innerEnd', check if we can honor that even when there's a progress
          else if (position === 'innerEnd')
          {
            availableWidth = oProgressWidth - 2 * padding;
            if (labelDimensions.w < availableWidth)
            {
              effectivePosition = 'innerEnd';
              break;
            }
          }

          // If 'innerCenter', or 'innerStart'/'innerEnd' can't be honored due to lack of space, do smart behavior
          if (labelDimensions.h <= progressHeight && progressWidth > oProgressWidth) // Label inside progress condition
          {
            availableWidth = progressWidth - 2 * padding;
            effectivePosition = 'progress';
          }
          else // Label inside oProgress condition
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
      startBarrier = ganttStartPos;
      previousAdjacentTaskNode = this._container.getPreviousAdjacentTaskNode();
      previousAdjacentMilestoneBaselineTaskNode = this._container.getPrevAdjMilestoneBaselineTaskNode();
      if (previousAdjacentTaskNode)
      {
        startBarrier = previousAdjacentTaskNode.getTaskShapePhysicalBounds('main', true)['endPos'];
      }
      if (previousAdjacentMilestoneBaselineTaskNode)
      {
        startBarrier = isRTL ?
                       Math.min(startBarrier, previousAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')['endPos']) :
                       Math.max(startBarrier, previousAdjacentMilestoneBaselineTaskNode.getTaskShapePhysicalBounds('baseline')['endPos']);
      }
      availableWidth = Math.abs(startBarrier - this._container.getTaskShapePhysicalBounds('main')['startPos']) - 2 * padding;
      effectivePosition = 'start';
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
DvtGanttTaskLabel.prototype._preprocessLabelPosition = function(labelPosition)
{
  var isMilestone = this._container.getTask().isMilestone('main');
  if (typeof labelPosition === 'string')
  {
    // For milestone case, map inner label positions outside
    if (isMilestone)
    {
      switch (labelPosition)
      {
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
    return [labelPosition];
  }
  else if (Array.isArray(labelPosition))
  {
    if (isMilestone)
    {
      // For milestone case, map inner label positions outside
      return labelPosition.map(function(position) {
        switch (position)
        {
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
DvtGanttTaskLabel.prototype._evaluatePosition = function(labelPosition)
{
  var traversalCache = {}, effectivePosition,
      availableWidth,
      labelDimensions = this._labelOutputText.getDimensions(),
      labelWidth = labelDimensions.w, labelHeight = labelDimensions.h,
      labelPosition = this._preprocessLabelPosition(labelPosition);

  var largestPosition;
  var largestAvailableWidth = 0;
  for (var i = 0; i < labelPosition.length; i++)
  {
    var queryPosition = labelPosition[i];
    if (queryPosition === 'max')
    {
      if (largestPosition != null)
      {
        var result = traversalCache[largestPosition];
        effectivePosition = result[0];
        availableWidth = result[1];
        break;
      }
      else
      {
        continue; // 'max' is first valid position evaluated in the array, thus meaningless.
      }
    }

    if (traversalCache[queryPosition])
    {
      result = traversalCache[queryPosition];
    }
    else
    {
      result = this._getAvailableWidth(queryPosition);
      traversalCache[queryPosition] = result;
    }

    if (result)
    {
      effectivePosition = result[0];
      availableWidth = result[1];

      if (labelWidth <= availableWidth)
      {
        break; // Found a position that can display the label fully
      }

      if (availableWidth > largestAvailableWidth)
      {
        largestAvailableWidth = availableWidth;
        largestPosition = queryPosition;
      }
    }
  }

  if (effectivePosition == null)
  {
    return false;
  }

  // Truncate label if necessary
  if (labelWidth > availableWidth)
  {
    dvt.TextUtils.fitText(this._labelOutputText, availableWidth, Infinity, this._container, 1);
  }

  this._placeLabel(effectivePosition);
  return true;
};

/**
 * Renders the task label
 */
DvtGanttTaskLabel.prototype.render = function()
{
  var taskProps = this._container.getProps(),
      label, labelPosition, labelStyle, finalStates,
      isPositionFeasible,
      self = this, onRenderEnd,
      styleClass = this._gantt.GetStyleClass('taskLabel');

  this._renderState = this._container.getRenderState() === 'refurbish' ? 'add' : 'exist';
  if (taskProps)
  {
    label = taskProps['label'];
    labelPosition = taskProps['labelPosition'];
    labelStyle = taskProps['labelStyle'];
  }

  if (label != null && label.length > 0 && labelPosition !== 'none' && this._associatedShape)
  {
    if (this._labelOutputText == null)
    {
      this._labelOutputText = new dvt.OutputText(this._gantt.getCtx(), label, 0, 0);
      if (this._gantt.getEventManager().IsDragSupported('tasks'))
      {
        styleClass += ' ' + this._gantt.GetStyleClass('draggable');
      }
      this._labelOutputText.setClassName(styleClass);
      this._renderState = 'add';
    }
    // Make sure label outputtext is in the DOM, e.g. may have been removed by fitText in the previous render
    if (this._labelOutputText.getParent() == null)
    {
      this._container.addChild(this._labelOutputText);
    }

    this._labelOutputText.setTextString(label);

    // Apply styles; necessary before positioning because position is font size dependent
    this._applyStyles(labelStyle);
    isPositionFeasible = this._evaluatePosition(labelPosition);

    if (isPositionFeasible)
    {
      // Called at the end of animation (if any)
      onRenderEnd = function() {
        var labelColor, fillColor;

        // Apply contrast text color depending on background color
        switch (self._effectiveLabelPosition)
        {
          case 'innerCenter':
          case 'innerEnd':
          case 'innerStart':
          case 'progressStart':
          case 'progress':
          case 'oProgress':
            fillColor = self._associatedShape.getFillColor();
            labelColor = dvt.ColorUtils.getContrastingTextColor(fillColor ? fillColor['computedFill'] : null);
            if (labelColor != null)
            {
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
    }
    else
    {
      this.remove();
    }
  }
  else // if label not specified/empty/invalid or labelPosition == 'none', don't render anything. If something there before, remove it.
  {
    this.remove();
  }
};

/**
 * Removes the task label
 */
DvtGanttTaskLabel.prototype.remove = function()
{
  var self = this, onRemoveEnd;
  if (this._labelOutputText)
  {
    onRemoveEnd = function() {
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
DvtGanttTaskLabel.prototype.getFinalX = function()
{
  return this._finalX;
};

/**
 * Sets the final x
 * @param {number} x
 */
DvtGanttTaskLabel.prototype.setFinalX = function(x)
{
  this._finalX = x;
};

/**
 * Gets the final y (animation independent, e.g. final y after animation finishes)
 * @return {number} the final y
 */
DvtGanttTaskLabel.prototype.getFinalY = function()
{
  return this._finalY;
};

/**
 * Sets the final y
 * @param {number} y The final y
 */
DvtGanttTaskLabel.prototype.setFinalY = function(y)
{
  this._finalY = y;
};

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
 *        baseline - The baseline shape, e.g. bar or milestone shape
 *        baselineSelect - The baseline selection shape
 *        baselineHover - The baseline hover shape
 *        progress - The progress element shape
 * @param {string=} id The optional id for the corresponding DOM element.
 * @extends {dvt.Path}
 * @class
 * @constructor
 */
var DvtGanttTaskShape = function(context, x, y, w, h, r, task, type, id)
{
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
 *        baseline - The baseline shape, e.g. bar or milestone shape
 *        baselineSelect - The baseline selection shape
 *        baselineHover - The baseline hover shape
 *        progress - The progress element shape
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
DvtGanttTaskShape.prototype.Init = function(context, x, y, w, h, r, task, type, id)
{
  var cmds;

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
    'progress': this._generateRectCmd,
    'baseline': this._generateRepShapeCmd,
    'baselineSelect': this._generateRepShapeCmd,
    'baselineHover': this._generateRepShapeCmd
  };
  this._isRTL = dvt.Agent.isRightToLeft(context);

  cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
  DvtGanttTaskShape.superclass.Init.call(this, context, cmds, id);

  this._applyDefaultStyleClasses();

  switch (this._type)
  {
    case 'mainDragFeedback':
      task.getGantt().getEventManager().associate(this, task.getContainer()); // Artifacts are not rendered inside the task node container
      this.setMouseEnabled(false); // Disable pointer-events for dnd feedbacks
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
DvtGanttTaskShape.prototype._generateRepShapeCmd = function(x, y, w, h, r)
{
  var margin = (DvtGanttTaskShape.MAIN_EFFECT_TYPES.indexOf(this._type) > -1 ||
                DvtGanttTaskShape.BASELINE_EFFECT_TYPES.indexOf(this._type) > -1) * DvtGanttStyleUtils.getTaskEffectMargin(),
      diamondMargin;

  // Diamond shape for milestone
  if (this._task.isMilestone(this._type) && (w == 0))
  {
    diamondMargin = margin * Math.sqrt(2);
    return this._generateDiamondCmd(x, y - diamondMargin, h + 2 * diamondMargin, r);
  }
  else if (this._task.isSummary(this._type) && this._type === 'main') // current UX design, only main shape has a special summary shape; baseline shape and effects are always bars
  {
    return this._generateSummaryCmd(x, y, w, h, r);
  }
  else // bar shape otherwise
  {
    return this._generateRectCmd(!this._isRTL ? x - margin : x + margin, y - margin, w + 2 * margin, h + 2 * margin, r);
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
DvtGanttTaskShape.prototype._generateRectCmd = function(x, y, w, h, r)
{
  // dvt.PathUtils.rectangleWithBorderRadius is expensive (mostly due to parsing
  // border radius string). For our default 0px border radius case, skip the parsing and
  // generate the path.
  if (r === '0' || r === '0px')
  {
    // In LTR, reference point is at top left corner; top right in RTL
    return dvt.PathUtils.moveTo(x, y) +
           dvt.PathUtils.horizontalLineTo(this._isRTL ? x - w : x + w) +
           dvt.PathUtils.verticalLineTo(y + h) +
           dvt.PathUtils.horizontalLineTo(x) +
           dvt.PathUtils.closePath();
  }
  return dvt.PathUtils.rectangleWithBorderRadius(x - this._isRTL * w, y, w, h, r, Math.min(w, h), '0');
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
DvtGanttTaskShape.prototype._generateSummaryCmd = function(x, y, w, h, r)
{
  // For our default 0px border radius case, skip the parsing and generate the path.
  var thickness = DvtGanttStyleUtils.getSummaryThickness();
  if (r === '0' || r === '0px')
  {
    if (w > 2 * thickness)
    {
      // In LTR, reference is at top left corner, top right in RTL
      return dvt.PathUtils.moveTo(x, y + h) +
             dvt.PathUtils.verticalLineTo(y) +
             dvt.PathUtils.horizontalLineTo(this._isRTL ? x - w : x + w) +
             dvt.PathUtils.verticalLineTo(y + h) +
             dvt.PathUtils.horizontalLineTo(this._isRTL ? x - w + thickness : x + w - thickness) +
             dvt.PathUtils.verticalLineTo(y + thickness) +
             dvt.PathUtils.horizontalLineTo(this._isRTL ? x - thickness : x + thickness) +
             dvt.PathUtils.verticalLineTo(y + h) +
             dvt.PathUtils.closePath();
    }
    return this._generateRectCmd(x, y, w, h, r);
  }

  // Only support same radius for the top left and top right corners for summary tasks
  var outerBr = Math.min(new dvt.CSSStyle({'border-radius': r}).getBorderRadius(), Math.min(w, h));
  var innerBr = Math.max(outerBr - thickness, 0);
  if (w > 2 * thickness)
  {
    // In LTR, reference is at top left corner, top right in RTL
    return dvt.PathUtils.moveTo(x, y + h) +
           dvt.PathUtils.verticalLineTo(y + outerBr) +
           dvt.PathUtils.arcTo(outerBr, outerBr, Math.PI / 2, this._isRTL ? 0 : 1, this._isRTL ? x - outerBr : x + outerBr, y) +
           dvt.PathUtils.horizontalLineTo(this._isRTL ? x - w + outerBr : x + w - outerBr) +
           dvt.PathUtils.arcTo(outerBr, outerBr, Math.PI / 2, this._isRTL ? 0 : 1, this._isRTL ? x - w : x + w, y + outerBr) +
           dvt.PathUtils.verticalLineTo(y + h) +
           dvt.PathUtils.horizontalLineTo(this._isRTL ? x - w + thickness : x + w - thickness) +
           dvt.PathUtils.verticalLineTo(y + thickness + innerBr) +
           dvt.PathUtils.arcTo(innerBr, innerBr, Math.PI / 2, this._isRTL ? 1 : 0, this._isRTL ? x - w + thickness + innerBr : x + w - thickness - innerBr, y + thickness) +
           dvt.PathUtils.horizontalLineTo(this._isRTL ? x - thickness - innerBr : x + thickness + innerBr) +
           dvt.PathUtils.arcTo(innerBr, innerBr, Math.PI / 2, this._isRTL ? 1 : 0, this._isRTL ? x - thickness : x + thickness, y + thickness + innerBr) +
           dvt.PathUtils.verticalLineTo(y + h) +
           dvt.PathUtils.closePath();
  }
  return dvt.PathUtils.rectangleWithBorderRadius(x - this._isRTL * w, y, w, h, outerBr + 'px ' + outerBr + 'px 0px 0px', Math.min(w, h), '0');
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
DvtGanttTaskShape.prototype._generateDiamondCmd = function(x, y, h, r)
{
  var half_h = h / 2;
  // For our default 0px border radius case, skip the parsing and generate the path.
  if (r === '0' || r === '0px')
  {
    return dvt.PathUtils.moveTo(x, y) +
           dvt.PathUtils.lineTo(x + half_h, y + half_h) +
           dvt.PathUtils.lineTo(x, y + h) +
           dvt.PathUtils.lineTo(x - half_h, y + half_h) +
           dvt.PathUtils.closePath();
  }
  // Only support 4 corner with the same radius for milestone diamond
  var br = Math.min((new dvt.CSSStyle({'border-radius': r})).getBorderRadius(), h / (2 * Math.sqrt(2))),
      r_over_root2 = br / Math.sqrt(2),
      rx = br, ry = br;
  return dvt.PathUtils.moveTo(x - r_over_root2, y + r_over_root2) +
         dvt.PathUtils.arcTo(rx, ry, 0, 1, x + r_over_root2, y + r_over_root2) +
         dvt.PathUtils.lineTo(x + half_h - r_over_root2, y + half_h - r_over_root2) +
         dvt.PathUtils.arcTo(rx, ry, 0, 1, x + half_h - r_over_root2, y + half_h + r_over_root2) +
         dvt.PathUtils.lineTo(x + r_over_root2, y + h - r_over_root2) +
         dvt.PathUtils.arcTo(rx, ry, 0, 1, x - r_over_root2, y + h - r_over_root2) +
         dvt.PathUtils.lineTo(x - half_h + r_over_root2, y + half_h + r_over_root2) +
         dvt.PathUtils.arcTo(rx, ry, 0, 1, x - half_h + r_over_root2, y + half_h - r_over_root2) +
         dvt.PathUtils.closePath();
};

/**
 * Applies any default classes and styles to the shape based on the specified type.
 * @private
 */
DvtGanttTaskShape.prototype._applyDefaultStyleClasses = function()
{
  var styleClass, milestoneDefaultClass, barDefaultClass, summaryDefaultClass, taskFillColor, style,
      gantt = this._task.getGantt(), taskDraggable = gantt.getEventManager().IsDragSupported('tasks');
  if (this._type === 'progress')
  {
    styleClass = gantt.GetStyleClass('taskProgress');
    if (taskDraggable)
    {
      styleClass += ' ' + gantt.GetStyleClass('draggable');
    }
    this.setClassName(styleClass);
  }
  else if (DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1)
  {
    styleClass = gantt.GetStyleClass('task');
    milestoneDefaultClass = gantt.GetStyleClass('taskMilestone');
    barDefaultClass = gantt.GetStyleClass('taskBar');
    summaryDefaultClass = gantt.GetStyleClass('taskSummary');
    if (this._task.isMilestone(this._type) && this._w == 0)
    {
      styleClass += ' ' + milestoneDefaultClass;
    }
    else if (this._task.isSummary(this._type))
    {
      styleClass += ' ' + summaryDefaultClass;
    }
    else
    {
      styleClass += ' ' + barDefaultClass;
    }

    if (this._type === 'mainSelect')
    {
      this.setStyle({'fill': 'none', 'filter': 'none'});
      styleClass += ' ' + gantt.GetStyleClass('selected');
    }
    else if (this._type === 'mainHover')
    {
      styleClass += ' ' + gantt.GetStyleClass('hover');
      style = {'fill': 'none'};
      taskFillColor = this._task.getFillColor();
      if (taskFillColor != null)
      {
        this.setStroke(dvt.SelectionEffectUtils.createSelectingStroke(taskFillColor['fill']));
        if (taskFillColor['filter'] === 'none')
        {
          style['filter'] = 'none';
        }
      }
      this.setStyle(style);
    }
    else if (this._type === 'main' && taskDraggable)
    {
      styleClass += ' ' + gantt.GetStyleClass('draggable');
    }

    this.setClassName(styleClass);
  }
  else if (DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1)
  {
    styleClass = gantt.GetStyleClass('baseline');
    milestoneDefaultClass = gantt.GetStyleClass('baselineMilestone');
    barDefaultClass = gantt.GetStyleClass('baselineBar');
    if (this._task.isMilestone(this._type) && this._w == 0)
    {
      styleClass += ' ' + milestoneDefaultClass;
    }
    else
    {
      styleClass += ' ' + barDefaultClass;
    }
    this.setClassName(styleClass);
  }
  else if (this._type === 'mainDragFeedback')
  {
    styleClass = gantt.GetStyleClass('taskDragImage');
    this.setClassName(styleClass)
  }
};

/**
 * Gets the fill color of the shape
 * @return {object} an object containing the following information:
 *                  'fill': the fill property of the shape
 *                  'filter': the filter property of the shape
 *                  'computedFill': the *actual* fill of the shape, after the default tint/shade filter is applied
 */
DvtGanttTaskShape.prototype.getFillColor = function()
{
  var elem, svgRoot, computedStyle, fill, computedFill, filter, isUrlFill, fillColor;

  // we need to figure out the fill color, which could be set in style class
  elem = this.getElem().cloneNode(false);
  svgRoot = this._task.getGantt().getCtx().getSvgDocument();
  svgRoot.appendChild(elem); // @HTMLUpdateOK
  try
  {
    computedStyle = window.getComputedStyle(elem);
    fill = computedStyle['fill'];
    filter = computedStyle['filter'];
    if (!String.prototype.startsWith) // internet explorer 11 doesn't support startsWith() yet...
      isUrlFill = fill.indexOf('url(') == 0;
    else
      isUrlFill = fill.startsWith('url(');

    if (!isUrlFill)
    {
      // Artificially calculate actual color after filter is applied, since that is not available through computedStyle
      switch (filter)
      {
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
      fillColor = {'fill': fill, 'computedFill': computedFill, 'filter': filter};
    }
  }
  finally
  {
    svgRoot.removeChild(elem);
  }
  return fillColor;
};

/**
 * Gets the shape type.
 * @return {string} The type.
 */
DvtGanttTaskShape.prototype.getType = function()
{
  return this._type;
};

/**
 * Gets the associated task.
 * @return {DvtGanttTask} The associated task.
 */
DvtGanttTaskShape.prototype.getTask = function()
{
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
DvtGanttTaskShape.prototype.getPhysicalStartOffset = function()
{
  if ((DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 ||
      DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) &&
      this._task.isMilestone(this._type))
  {
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
DvtGanttTaskShape.prototype.getPhysicalEndOffset = function()
{
  if ((DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 ||
      DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) &&
      this._task.isMilestone(this._type))
  {
    return this._finalHeight / 2;
  }
  return 0;
};

/**
 * Gets the shape type.
 * @return {string} The shape type.
 */
DvtGanttTaskShape.prototype.getType = function()
{
  return this._type;
};

/**
 * Gets the render state of the shape.
 * @return {string} the render state.
 */
DvtGanttTaskShape.prototype.getRenderState = function()
{
  return this._renderState;
};

/**
 * Sets the render state of the shape.
 * @param {string} state The render state.
 */
DvtGanttTaskShape.prototype.setRenderState = function(state)
{
  this._renderState = state;
};

/**
 * Gets width. Note this width can change during animation.
 * Note that if you get width for diamond shape, the width returned will be 0.
 * See documentation of getPhysicalStart/EndOffset methods for visualization.
 * @return {number} The width.
 */
DvtGanttTaskShape.prototype.getWidth = function()
{
  return this._w;
};

/**
 * Gets final width (animation independent, calculated from data; e.g. final width after animation finishes)
 * In other words, if there's no animation, or at the end of animation, this method should return the same value as getWidth
 * Note that for diamond shapes, even though the occupied width is nonzero, the logical width is 0 as calculated from data
 * See documentation of getPhysicalStart/EndOffset methods for visualization.
 * @return {number} The logical width.
 */
DvtGanttTaskShape.prototype.getFinalWidth = function()
{
  return this._finalWidth;
};

/**
 * Sets width.
 * @param {number} width The new width.
 */
DvtGanttTaskShape.prototype.setWidth = function(width)
{
  var cmds;
  // For main/baseline case, the shape can change from bar to diamond and vice versa, e.g. during animation and interactivity
  // Need to update style classes during these width/shape transitions
  if ((DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 ||
      DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) &&
      (this._w === 0 || width === 0))
  {
    this._w = width;
    this._applyDefaultStyleClasses();
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
DvtGanttTaskShape.prototype.setFinalWidth = function(width)
{
  this._finalWidth = width;
};

/**
 * Gets height. Note this width can change during animation.
 * @return {number} The height.
 */
DvtGanttTaskShape.prototype.getHeight = function()
{
  return this._h;
};

/**
 * Gets final height (animation independent, calculated from data; e.g. final height after animation finishes)
 * In other words, if there's no animation, or at the end of animation, this method should return the same value as getHeight
 * @return {number} The final height.
 */
DvtGanttTaskShape.prototype.getFinalHeight = function()
{
  return this._finalHeight;
};

/**
 * Sets height.
 * @param {number} height The new height.
 */
DvtGanttTaskShape.prototype.setHeight = function(height)
{
  var cmds;
  this._h = height;
  cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
  this.setCmds(cmds);
};

/**
 * Sets the final height (animation independent, calculated from data; e.g. final height after animation finishes)
 * @param {number} height The new final height.
 */
DvtGanttTaskShape.prototype.setFinalHeight = function(height)
{
  this._finalHeight = height;
};

/**
 * Gets the x. Note this x can change during animation.
 * @return {number} x
 */
DvtGanttTaskShape.prototype.getX = function()
{
  return this._x;
};

/**
 * Gets the final x (animation independent, e.g. final x after animation finishes)
 * @return {number} x
 */
DvtGanttTaskShape.prototype.getFinalX = function()
{
  return this._finalX;
};

/**
 * Sets the x.
 * @param {number} x
 */
DvtGanttTaskShape.prototype.setX = function(x)
{
  var cmds;
  this._x = x;
  cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
  this.setCmds(cmds);
};

/**
 * Sets the final x (animation independent, e.g. final x after animation finishes)
 * @param {number} x
 */
DvtGanttTaskShape.prototype.setFinalX = function(x)
{
  this._finalX = x;
};

/**
 * Gets the y. Note this y can change during animation.
 * @return {number} y
 */
DvtGanttTaskShape.prototype.getY = function()
{
  return this._y;
};

/**
 * Gets the final y (animation independent, e.g. final y after animation finishes)
 * @return {number} y
 */
DvtGanttTaskShape.prototype.getFinalY = function()
{
  return this._finalY;
};

/**
 * Sets the y.
 * @param {number} y
 */
DvtGanttTaskShape.prototype.setY = function(y)
{
  var cmds;
  this._y = y;
  cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
  this.setCmds(cmds);
};

/**
 * Sets the final y (animation independent, e.g. final y after animation finishes)
 * @param {number} y
 */
DvtGanttTaskShape.prototype.setFinalY = function(y)
{
  this._finalY = y;
};

/**
 * Gets the border radius.
 * @return {number} the border radius
 */
DvtGanttTaskShape.prototype.getBorderRadius = function()
{
  return this._r;
};

/**
 * Sets the border radius.
 * @param {number} r the border radius
 */
DvtGanttTaskShape.prototype.setBorderRadius = function(r)
{
  var cmds;
  this._r = r != null ? r : 0;
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
DvtGanttTaskShape.prototype.setDimensions = function(x, y, w, h, r)
{
  var cmds;
  // For task case, the shape can change from bar to diamond and vice versa, e.g. during animation and interactivity
  // Need to update style classes during these width/shape transitions
  if ((DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1 ||
      DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1) &&
      (this._w === 0 || w === 0))
  {
    this._w = w;
    this._applyDefaultStyleClasses();
  }

  this._x = x;
  this._y = y;
  this._w = w;
  this._h = h;
  this._r = r != null ? r : '0';

  cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
  this.setCmds(cmds);
};

dvt.exportProperty(dvt, 'Gantt', dvt.Gantt);
dvt.exportProperty(dvt.Gantt, 'newInstance', dvt.Gantt.newInstance);
dvt.exportProperty(dvt.Gantt.prototype, 'destroy', dvt.Gantt.prototype.destroy);
dvt.exportProperty(dvt.Gantt.prototype, 'getAutomation', dvt.Gantt.prototype.getAutomation);
dvt.exportProperty(dvt.Gantt.prototype, 'render', dvt.Gantt.prototype.render);

dvt.exportProperty(DvtGanttAutomation.prototype, 'getDomElementForSubId', DvtGanttAutomation.prototype.getDomElementForSubId);
dvt.exportProperty(DvtGanttAutomation.prototype, 'GetSubIdForDomElement', DvtGanttAutomation.prototype.GetSubIdForDomElement);

})(dvt);
  return dvt;
});
