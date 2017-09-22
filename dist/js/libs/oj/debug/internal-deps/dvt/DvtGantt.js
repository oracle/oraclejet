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
 * @return {?boolean} <code>true</code> if the style class was added
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
 * @return {?boolean} <code>true</code> if the style class was removed
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
DvtGanttStyleUtils._DEPENDENCY_LINE_ARC_RADIUS = 5;

/**
 * The gap between the task label and the dependency line
 * @const
 * @private
 */
DvtGanttStyleUtils._DEPENDENCY_LINE_TASK_LABEL_GAP = 2;

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
 * Gets the gap between the dependency line and the task label.
 * @return {number} The gap between the dependency line and the task label.
 */
DvtGanttStyleUtils.getDependencyLineLabelGap = function()
{
  return DvtGanttStyleUtils._DEPENDENCY_LINE_TASK_LABEL_GAP;
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
  var row = taskNode.getRow();

  // Custom Tooltip via Function
  var customTooltip = gantt.getOptions()['tooltip'];
  var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;

  if (isTabular && tooltipFunc) {
    var tooltipManager = gantt.getCtx().getTooltipManager();
    var dataContext = {
      'data': taskNode.getProps(),
      'rowData': row.getProps(),
      'color': DvtGanttTooltipUtils.getDatatipColor(taskNode),
      'component': gantt.getOptions()['_widgetConstructor']
    };

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
  datatip = DvtGanttTooltipUtils._addRowDatatip(datatip, row, isTabular);
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
 * @param {DvtGanttRowNode} row The row.
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @return {string} The updated datatip.
 * @private
 */
DvtGanttTooltipUtils._addRowDatatip = function(datatip, row, isTabular) {
  var gantt = row.getGantt();
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
  var taskProps = taskNode.getProps();
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
  var dimensionsAnimator;

  if (this._animationMode === 'dataChange')
  {
    // Animation dimension change
    dimensionsAnimator = this.dimensionsPlayableDC.getAnimator();
    dimensionsAnimator.addProp(dvt.Animator.TYPE_NUMBER, background, background.getHeight, background.setHeight, finalStates['h']);
  }
  else // No animation; finalize render immediately
  {
    background.setHeight(finalStates['h']);
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
 * @param {DvtGanttRowLabelText} labelText
 * @param {object} finalStates Object defining the final animation state
 */
DvtGanttAnimationManager.prototype.preAnimateRowLabel = function(rowNode, labelText, finalStates)
{
  var rowRenderState = rowNode.getRenderState(),
      translationsAnimator;

  if (this._animationMode === 'dataChange')
  {
    if (rowRenderState === 'add')
    {
      // Finalize render, then fade in
      labelText.setY(finalStates['y']);
      labelText.setX(finalStates['x']);

      this.fadeInElemsDC.push(labelText);
    }
    else if (rowRenderState === 'exist')
    {
      // Translation animation
      translationsAnimator = this.translationsPlayableDC.getAnimator();
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getX, labelText.setX, finalStates['x']);
      translationsAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getY, labelText.setY, finalStates['y']);
    }
  }
  else // No animation; finalize render immediately
  {
    labelText.setY(finalStates['y']);
    labelText.setX(finalStates['x']);
  }
};

/**
 * Prepares row label removal animation.
 * @param {DvtGanttRowLabelText} labelOutputText
 * @param {function} onEnd callback that finalizes rendering
 */
DvtGanttAnimationManager.prototype.preAnimateRowLabelRemove = function(labelOutputText, onEnd)
{
  if (this._animationMode === 'dataChange')
  {
    // Fade out, then finalize render
    this.fadeOutElemsDC.push(labelOutputText);
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
 * @param {string} callback The function that should be called to dispatch component events.
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
 * @param {string} callback The function that should be called to dispatch component events.
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
 * @param {string} callback The function that should be called to dispatch component events.
 * @param {object} callbackObj The optional object instance on which the callback function is defined.
 * @protected
 */
dvt.Gantt.prototype.Init = function(context, callback, callbackObj) 
{
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
  dvt.Gantt.superclass.SetOptions.call(this, options);
  //initial setup
  this.setSelectionMode(this.Options['selectionMode']);
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
  this._rowAxisLabelsOverflowBehavior = props.rowAxisLabelsOverflowBehavior;

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

  if (this.isRowAxisEnabled())
    DvtGanttRenderer._prepareRowAxis(this);
  else // potentially rerender with rowAxis.rendered off when on before.
    this.getParent().removeChild(this.getRowAxis());

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

  if (this._minorAxis || this._majorAxis)
    this.prepareViewportLength();

  this._animationManager = new DvtGanttAnimationManager(this);
  this._animationManager.prepareForAnimations();

  DvtGanttRenderer.renderGantt(this);

  this._animationManager.triggerAnimations();

  this.UpdateAriaAttributes();

  if (!this.Animation)
    // If not animating, that means we're done rendering, so fire the ready event.
    this.RenderComplete();
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
  return !this._canvas;
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
  if (this.isRowAxisEnabled())
    DvtGanttRenderer._updateRowAxisSpace(this);

  this.prepareViewportLength();

  DvtGanttRenderer._renderBackground(this);
  DvtGanttRenderer._renderRowBackground(this);

  if (this.hasValidOptions())
  {
    this.renderTimeZoomCanvas(this._canvas);

    if (this.isRowAxisEnabled())
      DvtGanttRenderer._prerenderRowAxis(this);
    this.updateRows();

    DvtGanttRenderer._renderDependencies(this);

    var timeZoomCanvas = this.getTimeZoomCanvas();
    DvtGanttRenderer._renderAxes(this, timeZoomCanvas);
    DvtGanttRenderer._renderVerticalGridline(this, timeZoomCanvas);
    DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas);

    DvtGanttRenderer._renderZoomControls(this);

    DvtGanttRenderer._updateRowBackground(this);

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
  var labelContainer;
  var rows = this._rows;
  if (rows != null && rows.length > 0)
  {
    // Cache the base task label style dvt.CSSStyle object; it's expensive to instantiate one
    // each time we render a task label.
    this.getCache().putToCache('baseTaskLabelCSSStyle', DvtGanttStyleUtils.getTaskLabelStyle(this.Options));

    // update databody clip path
    DvtGanttRenderer._updateDatabody(this, this.getDatabody());

    if (this.isRowAxisEnabled())
      labelContainer = this.getRowAxis();

    // update the tasks on each row
    for (var i = 0; i < rows.length; i++)
    {
      // rows[i].reRender(width, height);
      rows[i].render(this.getDatabody(), labelContainer);
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
  DvtGanttRenderer._renderDependencies(this);
  DvtGanttRenderer._renderVerticalGridline(this, timeZoomCanvas);
  DvtGanttRenderer._renderReferenceObjects(this, timeZoomCanvas);


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
 * Gets whether the row labels should wrap.
 * @return {boolean} true if should wrap, false otherwise
 */
dvt.Gantt.prototype.isRowAxisLabelsWrap = function()
{
  return this._rowAxisLabelsOverflowBehavior == 'normal';
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
 * Scroll task into view
 * @param {DvtGanttTaskNode} taskNode
 */
dvt.Gantt.prototype.scrollTaskIntoView = function(taskNode)
{
  var isRTL = dvt.Agent.isRightToLeft(this.getCtx()),
      axesHeight = this.getAxesHeight(),
      timeZoomCanvas = this.getTimeZoomCanvas(),
      taskMainShape = taskNode.getTask().getShape('main'),
      taskMainShape = taskMainShape ? taskMainShape : taskNode.getTask().getShape('baseline'),
      taskRect = {
        x: taskMainShape.getFinalX() + taskNode.getFinalX() + (isRTL ? taskMainShape.getPhysicalEndOffset() : -taskMainShape.getPhysicalStartOffset()),
        y: taskMainShape.getFinalY() + taskNode.getFinalY(),
        w: taskMainShape.getFinalWidth(),
        h: taskMainShape.getFinalHeight()
      },
      viewportRect = {
        x: this.getStartXOffset() - timeZoomCanvas.getTranslateX(),
        y: this._databodyStart - this._databody.getTranslateY(),
        w: this._canvasLength,
        h: this._canvasSize - axesHeight
      },
      deltaX = 0, deltaY = 0;

  if (!isRTL)
  {
    if (taskRect.x < viewportRect.x)
      deltaX = taskRect.x - viewportRect.x - DvtGanttStyleUtils.getTaskPadding();
    else if (taskRect.x + taskRect.w > viewportRect.x + viewportRect.w)
      deltaX = (taskRect.x + taskRect.w) - (viewportRect.x + viewportRect.w) + DvtGanttStyleUtils.getTaskPadding();
  }
  else
  {
    if (taskRect.x > viewportRect.x + viewportRect.w)
      deltaX = taskRect.x - (viewportRect.x + viewportRect.w) + DvtGanttStyleUtils.getTaskPadding();
    else if (taskRect.x - taskRect.w < viewportRect.x)
      deltaX = (taskRect.x - taskRect.w) - viewportRect.x - DvtGanttStyleUtils.getTaskPadding();
  }

  if (taskRect.y < viewportRect.y)
    deltaY = taskRect.y - viewportRect.y - DvtGanttStyleUtils.getTaskPadding();
  else if (taskRect.y + taskRect.h > viewportRect.y + viewportRect.h)
    deltaY = (taskRect.y + taskRect.h) - (viewportRect.y + viewportRect.h) + DvtGanttStyleUtils.getTaskPadding();

  this.panBy(deltaX, deltaY, true);
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
    var maxTranslateY = this._databodyStart;
    var minTranslateY = maxTranslateY;
    var bottomOffset = 0;
    if ((this.getContentHeight() + this._databodyStart) >= this._canvasSize)
    {
      if (this.getAxisPosition() == 'bottom')
        bottomOffset = this.getAxesHeight();
      minTranslateY = -(this.getContentHeight() - this._canvasSize + bottomOffset);
    }
    // var minTranslateY = (this.getContentHeight() + this._databodyStart) >= this._canvasSize ? -(this.getContentHeight() - this._canvasSize) : maxTranslateY;
    var newTranslateY = this._databody.getTranslateY() - deltaY;

    if (newTranslateY < minTranslateY)
      newTranslateY = minTranslateY;
    else if (newTranslateY > maxTranslateY)
      newTranslateY = maxTranslateY;

    this._databody.setTranslateY(newTranslateY);
    if (this.isRowAxisEnabled())
      this.getRowAxis().setTranslateY(newTranslateY);

    if (this.isContentDirScrollbarOn())
      this.contentDirScrollbar.setViewportRange(newTranslateY - (this._canvasSize - this._databodyStart - bottomOffset), newTranslateY);

    if (this._deplines != null)
      this._deplines.setTranslateY(newTranslateY);
  }

  if (this.isTimeDirScrollbarOn() && this.timeDirScrollbar)
    this.timeDirScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);
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
    this._selectionHandler = new dvt.SelectionHandler(dvt.SelectionHandler.TYPE_SINGLE);
  else if (selectionMode == 'multiple')
    this._selectionHandler = new dvt.SelectionHandler(dvt.SelectionHandler.TYPE_MULTIPLE);
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
  else if (logicalObj && (logicalObj instanceof DvtGanttRowLabelText || logicalObj instanceof DvtGanttRowLabelMultilineText))
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
        var rowLabelText = rows[rowIndex].getRowLabelText();
        if (rowLabelText != null)
          return rowLabelText.getElem();
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
    }
  },
  'rowAxis': {
    'rendered': 'off',
    'width': 'auto', // not publicly supported as of 2.2.0
    'maxWidth': 'none',
    'whiteSpace': 'nowrap' // not publicly supported as of 2.2.0
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
  DvtGanttDependencyNode.superclass.Init.call(this, gantt.getCtx(), null, props['id']);

  this._gantt = gantt;
  this._props = props;
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
 * Retrieve the id of the task.
 * @return {object} the id of the task
 */
DvtGanttDependencyNode.prototype.getId = function()
{
  return this._props['id'];
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
  return DvtGanttDependencyNode._getTaskTop(taskNode) + Math.round(taskNode.getTask().getShape('main').getFinalHeight() / 2);
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
  return DvtGanttDependencyNode._getTaskTop(taskNode) + taskNode.getTask().getShape('main').getFinalHeight();
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

    elem = line.getElem();
    // sets the default arrow marker
    dvt.ToolkitUtils.setAttrNullNS(elem, 'marker-end', dvt.ToolkitUtils.getUrlById(gantt.getDefaultMarkerId()));

    this.addChild(line);

    if (!this._eventManagerAssociated)
    {
      this._gantt.getEventManager().associate(this, this);
      this._eventManagerAssociated = true;
    }

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

  // invoke the proper method to generate command for finish-* dependency or start-* dependency
  // note for RTL the rendering is flipped so for example for start-finish dependency the rendering
  // in RTL would be exactly like finish-start in LTR
  switch (type)
  {
    case DvtGanttDependencyNode.START_START:
      if (isRTL)
        return DvtGanttDependencyNode._calcDepLineForFinish(predecessorNode, successorNode, true);
      else
        return DvtGanttDependencyNode._calcDepLineForStart(predecessorNode, successorNode, false);
      break;
    case DvtGanttDependencyNode.START_FINISH:
      if (isRTL)
        return DvtGanttDependencyNode._calcDepLineForFinish(predecessorNode, successorNode, false);
      else
        return DvtGanttDependencyNode._calcDepLineForStart(predecessorNode, successorNode, true);
      break;
    case DvtGanttDependencyNode.FINISH_START:
      if (isRTL)
        return DvtGanttDependencyNode._calcDepLineForStart(predecessorNode, successorNode, true);
      else
        return DvtGanttDependencyNode._calcDepLineForFinish(predecessorNode, successorNode, false);
      break;
    case DvtGanttDependencyNode.FINISH_FINISH:
      if (isRTL)
        return DvtGanttDependencyNode._calcDepLineForStart(predecessorNode, successorNode, false);
      else
        return DvtGanttDependencyNode._calcDepLineForFinish(predecessorNode, successorNode, true);
      break;
    default:
      // invalid type, should not happen
      break;
  }

  return null;
};

/**
 * Calculate path command for start-start and start-finish types dependency lines
 * @param {DvtGanttTaskNode} predecessorNode the predecessor
 * @param {DvtGanttTaskNode} successorNode the successor
 * @param {boolean} finish true if it's start-finish type, false otherwise
 * @return {string} the command path
 * @private
 */
DvtGanttDependencyNode._calcDepLineForStart = function(predecessorNode, successorNode, finish)
{
  var r = DvtGanttStyleUtils.getDependencyLineArcRadius();
  var m = DvtGanttStyleUtils.getTaskPadding() + DvtGanttStyleUtils.getDependencyLineLabelGap();

  var x1 = DvtGanttDependencyNode._getTaskStart(predecessorNode);
  var x2 = finish ? DvtGanttDependencyNode._getTaskEnd(successorNode) : DvtGanttDependencyNode._getTaskStart(successorNode);

  var y1 = DvtGanttDependencyNode._getTaskMiddle(predecessorNode);
  var y2 = DvtGanttDependencyNode._getTaskMiddle(successorNode);

  var line = dvt.PathUtils.moveTo(x1, y1);
  // x2 with margin included
  var x2m = finish ? x2 + m : x2 - m;

  // predecessor is after successor
  if (x1 >= x2m)
  {
    // successor is below predecessor
    if (y2 > y1)
    {
      if (finish)
      {
        // line left
        line += dvt.PathUtils.lineTo(x2m + r + r, y1);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m + r, y1 + r);
        // line down
        line += dvt.PathUtils.lineTo(x2m + r, y2 - r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m, y2);
      }
      else
      {
        // line left
        line += dvt.PathUtils.lineTo(x2m, y1);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m - r, y1 + r);
        // line down
        line += dvt.PathUtils.lineTo(x2m - r, y2 - r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m, y2);
      }
    }
    // successor is in the same y position as predecessor
    else if (y2 == y1)
    {
      if (!finish)
      {
        var x1m = x1 - m;
        var y2m = DvtGanttDependencyNode._getTaskBottom(predecessorNode) + m;

        // line left
        line += dvt.PathUtils.lineTo(x1m, y1);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1m - r, y1 + r);
        // line down
        line += dvt.PathUtils.lineTo(x1m - r, y2m - r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1m - r - r, y2m);
        // line left
        line += dvt.PathUtils.lineTo(x2m, y2m);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m - r, y2m - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m - r, y2 + r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m, y2);
      }
    }
    // successor is above predecessor
    else
    {
      if (finish)
      {
        // line left
        line += dvt.PathUtils.lineTo(x2m + r + r, y1);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m + r, y1 - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m + r, y2 + r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m, y2);
      }
      else
      {
        // line left
        line += dvt.PathUtils.lineTo(x2m, y1);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m - r, y1 - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m - r, y2 + r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m, y2);
      }
    }
  }
  else
  {
    x1m = x1 - m;
    if (y2 > y1)
    {
      if (finish)
      {
        var y2m = DvtGanttDependencyNode._getTaskBottom(predecessorNode) + m;

        line += dvt.PathUtils.lineTo(x1m + r, y1);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1m, y1 + r);
        // line down
        line += dvt.PathUtils.lineTo(x1m, y2m - r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1m + r, y2m);
        // line right
        line += dvt.PathUtils.lineTo(x2m, y2m);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m + r, y2m + r);
        // line down
        line += dvt.PathUtils.lineTo(x2m + r, y2 - r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m, y2);
      }
      else
      {
        // line left
        line += dvt.PathUtils.lineTo(x1m, y1);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1m - r, y1 + r);
        // line down
        line += dvt.PathUtils.lineTo(x1m - r, y2 - r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1m, y2);
      }
    }
    else if (y2 == y1)
    {
      var y2m = DvtGanttDependencyNode._getTaskBottom(predecessorNode) + m;
      // line left
      line += dvt.PathUtils.lineTo(x1m, y1);
      // arc down
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1m - r, y1 + r);
      // line down
      line += dvt.PathUtils.lineTo(x1m - r, y2m - r);
      // arc right
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1m, y2m);

      if (finish)
      {
        // line right
        line += dvt.PathUtils.lineTo(x2m, y2m);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m + r, y2m - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m + r, y2 + r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m, y2);
      }
      else
      {
        // line right
        line += dvt.PathUtils.lineTo(x2m - r - r, y2m);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m - r, y2m - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m - r, y2 + r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m, y2);
      }
    }
    else
    {
      y2m = DvtGanttDependencyNode._getTaskTop(predecessorNode) - m;

      // line left
      line += dvt.PathUtils.lineTo(x1m, y1);
      // arc up
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1m - r, y1 - r);
      if (finish)
      {
        // line up
        line += dvt.PathUtils.lineTo(x1m - r, y2m + r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1m, y2m);
        // line right
        line += dvt.PathUtils.lineTo(x2m, y2m);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m + r, y2m - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m + r, y2 + r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m, y2);
      }
      else
      {
        // line up
        line += dvt.PathUtils.lineTo(x1m - r, y2 + r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1m, y2);
      }
    }
  }

  line += dvt.PathUtils.lineTo(x2, y2);

  return line;
};

/**
 * Calculate path command for finish-start and finish-finish types dependency lines
 * @param {DvtGanttTaskNode} predecessorNode the predecessor
 * @param {DvtGanttTaskNode} successorNode the successor
 * @param {boolean} finish true if it's finish-finish type, false otherwise
 * @return {string} the command path
 * @private
 */
DvtGanttDependencyNode._calcDepLineForFinish = function(predecessorNode, successorNode, finish)
{
  var r = DvtGanttStyleUtils.getDependencyLineArcRadius();
  var m = DvtGanttStyleUtils.getTaskPadding() + DvtGanttStyleUtils.getDependencyLineLabelGap();

  var x1 = DvtGanttDependencyNode._getTaskEnd(predecessorNode);
  var x2 = finish ? DvtGanttDependencyNode._getTaskEnd(successorNode) : DvtGanttDependencyNode._getTaskStart(successorNode);

  var y1 = DvtGanttDependencyNode._getTaskMiddle(predecessorNode);
  var y2 = DvtGanttDependencyNode._getTaskMiddle(successorNode);

  var line = dvt.PathUtils.moveTo(x1, y1);
  // x2 with margin included
  var x2m = finish ? x2 + m : x2 - m;

  if (x1 >= x2m)
  {
    // a little bit to the right
    line += dvt.PathUtils.lineTo(x1 + m - r, y1);

    if (y2 > y1)
    {
      // arc down
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1 + m, y1 + r);

      if (finish)
      {
        // line down
        line += dvt.PathUtils.lineTo(x1 + m, y2 - r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1 + m - r, y2);
      }
      else
      {
        var y2m = DvtGanttDependencyNode._getTaskBottom(predecessorNode) + m;

        // line down
        line += dvt.PathUtils.lineTo(x1 + m, y2m - r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1 + m - r, y2m);
        // line left
        line += dvt.PathUtils.lineTo(x2m, y2m);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m - r, y2m + r);
        // line down
        line += dvt.PathUtils.lineTo(x2m - r, y2 - r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m, y2);
      }
    }
    else if (y2 == y1)
    {
      var y2m = DvtGanttDependencyNode._getTaskBottom(predecessorNode) + m;
      // line right
      line += dvt.PathUtils.lineTo(x1 + m, y1);
      // arc down
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1 + m + r, y1 + r);
      // line down
      line += dvt.PathUtils.lineTo(x1 + m + r, y2m - r);
      // arc left
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1 + m, y2m);
      if (finish)
      {
        // line left
        line += dvt.PathUtils.lineTo(x2m + r + r, y2m);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m + r, y2m - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m + r, y2 + r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m, y2);
      }
      else
      {
        // line right
        line += dvt.PathUtils.lineTo(x2m, y2m);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m - r, y2m - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m - r, y2 + r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m, y2);
      }
    }
    else
    {
      // arc up
      line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1 + m, y1 - r);

      if (finish)
      {
        // line up
        line += dvt.PathUtils.lineTo(x1 + m, y2 + r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1 + m - r, y2);
      }
      else
      {
        y2m = DvtGanttDependencyNode._getTaskTop(predecessorNode) - m;
        // line up
        line += dvt.PathUtils.lineTo(x1 + m, y2m + r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1 + m - r, y2m);
        // line left
        line += dvt.PathUtils.lineTo(x2m, y2m);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m - r, y2m - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m - r, y2 + r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m, y2);
      }
    }
  }
  else
  {
    if (y2 > y1)
    {
      if (finish)
      {
        // line right
        line += dvt.PathUtils.lineTo(x2m, y1);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m + r, y1 + r);
        // line down
        line += dvt.PathUtils.lineTo(x2m + r, y2 - r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m, y2);
      }
      else
      {
        // line right
        line += dvt.PathUtils.lineTo(x2m - r - r, y1);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m - r, y1 + r);
        // line down
        line += dvt.PathUtils.lineTo(x2m - r, y2 - r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m, y2);
      }
    }
    else if (y2 == y1)
    {
      if (finish)
      {
        var y2m = DvtGanttDependencyNode._getTaskBottom(predecessorNode) + m;
        // line right
        line += dvt.PathUtils.lineTo(x1 + m, y1);
        // arc down
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x1 + m + r, y1 + r);
        // line down
        line += dvt.PathUtils.lineTo(x1 + m + r, y2m - r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x1 + m + r + r, y2m);
        // line right
        line += dvt.PathUtils.lineTo(x2m, y2m);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m + r, y2m - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m + r, y2 + r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m, y2);
      }
    }
    else
    {
      if (finish)
      {
        // line right
        line += dvt.PathUtils.lineTo(x2m, y1);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m + r, y1 - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m + r, y2 + r);
        // arc left
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m, y2);
      }
      else
      {
        // line right
        line += dvt.PathUtils.lineTo(x2m - r - r, y1);
        // arc up
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 0, x2m - r, y1 - r);
        // line up
        line += dvt.PathUtils.lineTo(x2m - r, y2 + r);
        // arc right
        line += dvt.PathUtils.arcTo(r, r, Math.PI / 2, 1, x2m, y2);
      }
    }
  }

  // line right
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
    this._comp.scrollTaskIntoView(navigable);
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
    ret.rowAxisLabelsOverflowBehavior = options['rowAxis']['whiteSpace'];
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
  DvtGanttRenderer._renderRowBackground(gantt);
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
    DvtGanttRenderer._renderVerticalGridline(gantt, timeZoomCanvas);
    if (gantt.isRowAxisEnabled())
      DvtGanttRenderer._prerenderRowAxis(gantt);
    DvtGanttRenderer._renderRows(gantt, timeZoomCanvas, gantt.getRowAxis());
    DvtGanttRenderer._renderDependencies(gantt, timeZoomCanvas);

    DvtGanttRenderer._renderReferenceObjects(gantt, timeZoomCanvas);

    DvtGanttRenderer._renderZoomControls(gantt);

    // update row background
    DvtGanttRenderer._updateRowBackground(gantt);

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
 * Adds the feColorMatrix filters (used for task shape/progress/variance etc fill overlays) to def.
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @private
 */
DvtGanttRenderer._prepareTaskFillFilters = function(gantt)
{
  var context = gantt.getCtx();
  if (gantt.taskTintFilter == null)
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

    gantt.taskTintFilter = taskTintFilter;
    context.appendDefs(taskTintFilter);
  }
  if (gantt.taskShadeFilter == null)
  {
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

    gantt.taskShadeFilter = taskShadeFilter;
    context.appendDefs(taskShadeFilter);
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
 * Prepares row axis by creating the object and asking it for its preferred width.
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @private
 */
DvtGanttRenderer._prepareRowAxis = function(gantt)
{
  var rowAxis = gantt.getRowAxis();
  if (!rowAxis)
  {
    rowAxis = new DvtGanttRowAxis(gantt);
    gantt.setRowAxis(rowAxis);
  }

  DvtGanttRenderer._updateRowAxisSpace(gantt);
};

/**
 * Updates the space allocated for the row axis.
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @private
 */
DvtGanttRenderer._updateRowAxisSpace = function(gantt)
{
  var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
  var rowAxis = gantt.getRowAxis();

  // Make sure allocated width is integer pixels to avoid svg rendering issues
  gantt._rowAxisPreferredWidth = Math.ceil(rowAxis.getPreferredWidth(gantt.Width - DvtGanttStyleUtils.getRowAxisGap()));

  // readjust gantt dimensions and offset to make room for row labels
  var rowAxisSpace = gantt._rowAxisPreferredWidth + DvtGanttStyleUtils.getRowAxisGap();
  gantt._backgroundWidth = gantt._backgroundWidth - rowAxisSpace;
  if (!isRTL)
  {
    gantt._widthOffset = gantt._widthOffset + rowAxisSpace;
    gantt.setStartXOffset(gantt.getStartXOffset() + rowAxisSpace);
  }
  gantt._canvasLength = gantt._canvasLength - rowAxisSpace;
};

/**
 * Renders the row axis container.
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @private
 */
DvtGanttRenderer._prerenderRowAxis = function(gantt)
{
  var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
  var rowAxis = gantt.getRowAxis();
  if (rowAxis != null)
  {
    rowAxis.setPixelHinting(true);
    var width = gantt._rowAxisPreferredWidth;
    var height = gantt.getCanvasSize() - gantt.getAxesHeight();
    if (isRTL)
      rowAxis.setTranslateX(gantt.getStartXOffset() + gantt.getCanvasLength() + gantt._borderWidth + DvtGanttStyleUtils.getRowAxisGap());
    else
      rowAxis.setTranslateX(0);

    var databodyStart = gantt.getDatabodyStart();

    var cp = new dvt.ClipPath();
    cp.addRect(rowAxis.getTranslateX(), databodyStart + gantt.getStartYOffset(), width, height);
    rowAxis.setClipPath(cp);

    if (rowAxis.getParent() != gantt.getParent())
      gantt.getParent().addChild(rowAxis);
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
  gantt._background.setCursor('move');

  var cp = new dvt.ClipPath();
  cp.addRect(gantt._widthOffset, 0, width, height);
  gantt._background.setClipPath(cp);

  if (gantt._background.getParent() != gantt)
    gantt.addChild(gantt._background);
};

/**
 * Renders the background for the rows
 * For the first release, since there's no requirements for banded rows, we'll just
 * render a rectangle covering the entire databody
 * @param {dvt.Gantt} gantt The gantt component.
 * @private
 */
DvtGanttRenderer._renderRowBackground = function(gantt)
{
  var width = gantt._canvasLength;
  if (!gantt._rowBackground)
  {
    gantt._rowBackground = new dvt.Rect(gantt.getCtx(), gantt.getStartXOffset(), gantt.getStartYOffset(), width, 0);
  }
  else
  {
    gantt._rowBackground.setWidth(width);
    gantt._rowBackground.setX(gantt.getStartXOffset());
    gantt._rowBackground.setY(gantt.getStartYOffset());
  }

  gantt._rowBackground.setClassName(gantt.GetStyleClass('row'));
  gantt._rowBackground.setPixelHinting(true);
  gantt._rowBackground.setCursor('move');

  var cp = new dvt.ClipPath();
  cp.addRect(gantt.getStartXOffset(), gantt.getStartYOffset(), width, gantt._canvasSize);
  gantt._rowBackground.setClipPath(cp);

  if (gantt._rowBackground.getParent() != gantt)
    gantt.addChild(gantt._rowBackground);
};

/**
 * Updates the row background based on information from databody
 * @param {dvt.Gantt} gantt The gantt component.
 * @private
 */
DvtGanttRenderer._updateRowBackground = function(gantt)
{
  var rows = gantt.getRows(),
      horizontalLineHeightOffset,
      background, height, finalStates;

  if (rows != null && rows.length > 0)
  {
    horizontalLineHeightOffset = 0;
    if (gantt.isHorizontalGridlinesVisible())
      horizontalLineHeightOffset = DvtGanttStyleUtils.getHorizontalGridlineWidth(gantt.getOptions());

    background = gantt._rowBackground;
    background.setY(gantt.getDatabodyStart());
    height = rows[rows.length - 1].getTop() + rows[rows.length - 1].getRowHeight() + horizontalLineHeightOffset;

    finalStates = {
      'h': height
    };
    gantt.getAnimationManager().preAnimateRowBackground(background, finalStates);
  }
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
    if (gantt._rowBackground)
    {
      // Instead of removing, set height to 0 so that layering is consistent if next render comes with valid data
      gantt._rowBackground.setHeight(0);
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
 * @param {dvt.Container} container the container to add the databody to.
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
  }

  // Initial state: show from the top
  databody.setTranslateY(gantt.getDatabodyStart());
  if (gantt.isRowAxisEnabled())
    gantt.getRowAxis().setTranslateY(gantt.getDatabodyStart() + gantt.getStartYOffset());

  DvtGanttRenderer._updateDatabody(gantt, databody);
};

/**
 * Updates the databody based on new width of height of the canvas
 * @param {dvt.Gantt} gantt the Gantt component
 * @param {dvt.Container} databody the databody
 * @private
 */
DvtGanttRenderer._updateDatabody = function(gantt, databody)
{
  var databodyHeight = gantt._canvasSize;
  var majorAxis = gantt.getMajorAxis();
  var minorAxis = gantt.getMinorAxis();
  if (majorAxis)
    databodyHeight = databodyHeight - majorAxis.getSize();
  if (minorAxis)
    databodyHeight = databodyHeight - minorAxis.getSize();

  var cp = new dvt.ClipPath();
  cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), databodyHeight);

  databody.setClipPath(cp);
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
 * @param {dvt.Container=} labelContainer The container to render row labels into.
 * @private
 */
DvtGanttRenderer._renderRows = function(gantt, container, labelContainer)
{
  var options = gantt.getOptions();
  var rows = options['rows'];
  var isRowsCleanable = rows != null ? DvtGanttRenderer._prerenderRows(rows) : false;
  if (gantt.isRowAxisEnabled())
    var rowLabelTexts = gantt.getRowAxis().getRowLabelTexts();

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
      if (rowLabelTexts)
      {
        var rowLabelText = rowLabelTexts[i];
        if (labelContainer && rowNode.getRowLabelText() != null)
          labelContainer.removeChild(rowNode.getRowLabelText());
        rowNode.setRowLabelText(rowLabelText);
      }

      rowNode.render(databody, labelContainer);
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
      if (rowLabelTexts)
      {
        var rowLabelText = rowLabelTexts[i];
        if (labelContainer && rowNode.getRowLabelText() != null)
          labelContainer.removeChild(rowNode.getRowLabelText());
        rowNode.setRowLabelText(rowLabelText);
      }

      // for data change animations, row elements need to be in the correct order
      // in the DOM tree to get desired layering. E.g. if row A is above row B, and if
      // row B shifts up, we want to see elements of row B be layered on top of elements
      // of row A when they cross path. There is a slight performance hit by ensuring this layering
      // so we avoid this in the non-animation case.
      if (gantt.isDCAnimationEnabled) // data change animation
        rowNode.render(databody, labelContainer, i);
      else
        rowNode.render(databody, labelContainer);

      top = top + rowNode.getRowHeight() + horizontalLineHeightOffset;
    }
    top = top - horizontalLineHeightOffset; // last row
  }

  gantt.setRows(rowNodes);
  gantt.setContentHeight(top);
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
            oldRowNodeTaskNode.setId(deferredTaskNodeProps['id'], true);
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
  cp.addRect(0, gantt.getDatabodyStart(), gantt.getContentLength(), gantt._canvasSize);
  deplines.setClipPath(cp);

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

  dvt.ToolkitUtils.setAttrNullNS(elem, 'viewBox', '0 0 6 8');
  dvt.ToolkitUtils.setAttrNullNS(elem, 'refX', '6');
  dvt.ToolkitUtils.setAttrNullNS(elem, 'refY', '4');
  dvt.ToolkitUtils.setAttrNullNS(elem, 'markerWidth', '6');
  dvt.ToolkitUtils.setAttrNullNS(elem, 'markerHeight', '8');
  dvt.ToolkitUtils.setAttrNullNS(elem, 'orient', 'auto');
  dvt.ToolkitUtils.setAttrNullNS(path, 'd', 'M0,0L6,4,0,8V0Z');

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
 * Gets the preferred width.
 * @param {number} totalAvailWidth The total available width.
 * @return {number} The preferred width of the axis in px
 */
DvtGanttRowAxis.prototype.getPreferredWidth = function(totalAvailWidth)
{
  this._generateRowLabels();
  var maxWidthOption = this._gantt.getRowAxisMaxWidth();
  var widthOption = this._gantt.getRowAxisWidth();
  var maxWidth, widthDemanded;

  if (maxWidthOption != null && maxWidthOption !== 'none')
    maxWidth = Math.min(DvtGanttStyleUtils.getSizeInPixels(maxWidthOption, totalAvailWidth), totalAvailWidth);
  maxWidth = maxWidth != null && !isNaN(maxWidth) ? maxWidth : totalAvailWidth;

  if (widthOption != null && widthOption !== 'auto')
    widthDemanded = DvtGanttStyleUtils.getSizeInPixels(this._gantt.getRowAxisWidth(), totalAvailWidth);
  widthDemanded = widthDemanded != null && !isNaN(widthDemanded) ? widthDemanded : dvt.TextUtils.getMaxTextDimensions(this._rowLabelTexts).w;

  return Math.min(widthDemanded, maxWidth);
};

/**
 * Generates an array of row labels text objects.
 * @private
 */
DvtGanttRowAxis.prototype._generateRowLabels = function()
{
  var rowData = this._gantt.getRowsData();
  this._rowLabelTexts = [];

  // create dvt.CSSStyle from from style sheet
  var options = this._gantt.getOptions();
  var labelCSSStyle = DvtGanttStyleUtils.getRowLabelStyle(options);
  for (var i = 0; i < rowData.length; i++)
  {
    var row = rowData[i];
    var rowLabel = row['label'] != null ? row['label'] : '';

    // UNCOMMENT BELOW IF WANT ROWLABELS TO AUTOMATICALLY GRAB
    // THE TASK LABEL WHEN ROWLABEL IS NOT SPECIFIED AND THERE'S
    // ONLY ONE TASK IN THE ROW
    // var tasks = row['tasks'];
    // var rowLabel = row['label'];
    // if (rowLabel == null)
    // {
    //   if (tasks.length == 1 && tasks[0]['label'] != null)
    //     rowLabel = tasks[0]['label'];
    //   else
    //     rowLabel = '';
    // }

    if (this._gantt.isRowAxisLabelsWrap())
      var labelText = new DvtGanttRowLabelMultilineText(this._gantt.getCtx(), rowLabel, 0, 0);
    else
      labelText = new DvtGanttRowLabelText(this._gantt.getCtx(), rowLabel, 0, 0);
    labelText.setRowIndex(i);
    labelText.setClassName(this._gantt.GetStyleClass('rowLabel'));

    // sets the style if specified in options
    var labelStyle = row['labelStyle'];
    if (labelStyle != null)
    {
      // need to instantiate a new dvt.CSSStyle object because we're going to modify it
      var customLabelCSSStyle = DvtGanttStyleUtils.getRowLabelStyle(options);
      customLabelCSSStyle.parseInlineStyle(labelStyle);
      // TODO: once we fully deprecate string type in 4.0.0, remove the string logic
      if (typeof labelStyle === 'string' || labelStyle instanceof String)
        dvt.ToolkitUtils.setAttrNullNS(labelText.getElem(), 'style', labelStyle);
      else
        labelText.setStyle(labelStyle); // works if style is object

      labelText.setCSSStyle(customLabelCSSStyle); // necessary for getDimension/fitText to obtain CSS style of the text
    }
    else
    {
      labelText.setCSSStyle(labelCSSStyle); // necessary for getDimension/fitText to obtain CSS style of the text
    }

    this._rowLabelTexts.push(labelText);
  }
};

/**
 * Gets the row labels text objects array.
 * @return {Array} the array of dvt.OutputText objects
 */
DvtGanttRowAxis.prototype.getRowLabelTexts = function()
{
  return this._rowLabelTexts;
};
/**
 * Class representing a Gantt row label single line text.
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {string=} id
 * @extends {dvt.OutputText}
 * @class
 * @constructor
 */
var DvtGanttRowLabelText = function(context, textStr, x, y, id)
{
  this.Init(context, textStr, x, y, id);
};

dvt.Obj.createSubclass(DvtGanttRowLabelText, dvt.OutputText);

/**
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {string=} id
 * @protected
 */
DvtGanttRowLabelText.prototype.Init = function(context, textStr, x, y, id)
{
  DvtGanttRowLabelText.superclass.Init.call(this, context, textStr, x, y, id);
};

/**
 * Gets the associated row node.
 * @return {DvtGanttRowNode} the associated row node.
 */
DvtGanttRowLabelText.prototype.getRow = function()
{
  return this._rowNode;
};

/**
 * Sets the associated row node.
 * @param {DvtGanttRowNode} rowNode the associated row node.
 */
DvtGanttRowLabelText.prototype.setRow = function(rowNode)
{
  this._rowNode = rowNode;
};

/**
 * Gets the row index
 * @return {number} the row index
 */
DvtGanttRowLabelText.prototype.getRowIndex = function()
{
  return this._rowIndex;
};

/**
 * Sets the row index
 * @param {number} index The row index
 */
DvtGanttRowLabelText.prototype.setRowIndex = function(index)
{
  this._rowIndex = index;
};
/**
 * Class representing a Gantt row label multiline text.
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {string=} id
 * @extends {dvt.MultilineText}
 * @class
 * @constructor
 */
var DvtGanttRowLabelMultilineText = function(context, textStr, x, y, id)
{
  this.Init(context, textStr, x, y, id);
};

dvt.Obj.createSubclass(DvtGanttRowLabelMultilineText, dvt.MultilineText);

/**
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {string=} id
 * @protected
 */
DvtGanttRowLabelMultilineText.prototype.Init = function(context, textStr, x, y, id)
{
  DvtGanttRowLabelMultilineText.superclass.Init.call(this, context, textStr, x, y, id);
};

/**
 * Gets the associated row node.
 * @return {DvtGanttRowNode} the associated row node.
 */
DvtGanttRowLabelMultilineText.prototype.getRow = function()
{
  return this._rowNode;
};

/**
 * Sets the associated row node.
 * @param {DvtGanttRowNode} rowNode the associated row node.
 */
DvtGanttRowLabelMultilineText.prototype.setRow = function(rowNode)
{
  this._rowNode = rowNode;
};

/**
 * Gets the row index
 * @return {number} the row index
 */
DvtGanttRowLabelMultilineText.prototype.getRowIndex = function()
{
  return this._rowIndex;
};

/**
 * Sets the row index
 * @param {number} index The row index
 */
DvtGanttRowLabelMultilineText.prototype.setRowIndex = function(index)
{
  this._rowIndex = index;
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
  DvtGanttRowNode.superclass.Init.call(this, gantt.getCtx(), null, props['id']);

  this._gantt = gantt;
  this._props = props;
  this._index = index;
  this._top = top;
  this._rowHeight = 0;
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
 * Retrieve the id of the row
 * @return {object} the id of the row
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
 * Sets the row label text
 * @param {dvt.OutputText} rowLabelText The row label text object
 */
DvtGanttRowNode.prototype.setRowLabelText = function(rowLabelText)
{
  this._rowLabelText = rowLabelText;
};

/**
 * Gets the row label text
 * @return {dvt.OutputText} The row label text object
 */
DvtGanttRowNode.prototype.getRowLabelText = function()
{
  return this._rowLabelText;
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
    if (taskProps['height'] == null)
    {
      taskProps['height'] = DvtGanttStyleUtils.getActualTaskHeight();
    }

    var isBaselineMilestone = baselineProps['start'] == baselineProps['end'] || baselineProps['start'] == null || baselineProps['end'] == null;
    if (isBaselineMilestone && baselineProps['height'] == null)
    {
      baselineProps['height'] = DvtGanttStyleUtils.getActualTaskHeight();
    }
  }
  return dvt.JsonUtils.merge(taskProps, taskDefaults);
};

/**
 * Retrieve tasks of the row
 * @return {Array} an array of DvtGanttTaskNode each representing a task.
 */
DvtGanttRowNode.prototype.getTasks = function()
{
  var tasks = this._props['tasks'];
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
 * @param {dvt.Container=} labelContainer The container to render row labels into.
 * @param {number=} index The index of the container child list to add to.
 */
DvtGanttRowNode.prototype.render = function(container, labelContainer, index)
{
  this.sortTasks();
  var taskNodes = this.getTasks();
  if (taskNodes != null && taskNodes.length > 0)
  {
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

    this._renderRowLabel(this._gantt, this.getRowLabelText(), labelContainer);

    if (this.getParent() != container)
    {
      if (index != null)
        container.addChildAt(this, index);
      else
        container.addChild(this);
    }

    this._renderHorizontalGridline(this._gantt, this, this);
  }
};

/**
 * Renders the row label.
 * @param {dvt.Gantt} gantt The gantt component
 * @param {dvt.OutputText} labelText The label text object
 * @param {dvt.Container} labelContainer The container to render into.
 * @private
 */
DvtGanttRowNode.prototype._renderRowLabel = function(gantt, labelText, labelContainer)
{
  var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx()), finalStates,
      isTextVisible, x, y, labelStateObj, previousLabelState;

  if (gantt.isRowAxisEnabled() && labelContainer)
  {
    // right aligned in LTR. left aligned in RTL:
    if (!isRTL)
    {
      labelText.alignRight();
    }

    // Reset text string if truncated
    if (labelText.isTruncated())
    {
      labelText.setTextString(labelText.getUntruncatedTextString());
    }
    isTextVisible = dvt.TextUtils.fitText(labelText, gantt._rowAxisPreferredWidth, this.getRowHeight(), labelContainer, 1);

    // Calculate final position
    y = ((this.getTop() + (this.getTop() + this.getRowHeight())) - labelText.getDimensions().h) / 2;
    if (!isRTL)
    {
      x = gantt._rowAxisPreferredWidth;
    }
    else
    {
      x = 0;
    }

    finalStates = {
      'textString': labelText.getTextString(),
      'x': x,
      'y': y
    };

    // don't bother with empty string labels or labels that can't fit in the axis space
    if (labelText.getTextString().length > 0 && isTextVisible)
    {
      gantt.getEventManager().associate(labelText, labelText);
      labelText.setRow(this);

      // set "previous states" (current implementation, labels are new and have no knowledge of previous positions)
      previousLabelState = this.getLabelState();
      if (previousLabelState)
      {
        labelText.setY(previousLabelState['y']);
        labelText.setX(previousLabelState['x']);
      }

      // Record final states
      this.recordLabelState(finalStates);

      this._gantt.getAnimationManager().preAnimateRowLabel(this, labelText, finalStates);
      labelContainer.addChild(labelText);
    }
  }
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
  var rowLabelText = this.getRowLabelText(),
      onEnd, self = this;

  if (rowLabelText)
  {
    onEnd = function() {
      if (rowLabelText.getParent())
      {
        rowLabelText.getParent().removeChild(rowLabelText);
      }
    };

    this._gantt.getAnimationManager().preAnimateRowLabelRemove(rowLabelText, onEnd);
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
 * Class representing a task container (i.e. container for shapes and labels that make up a task).
 * @param {dvt.Gantt} gantt The gantt component
 * @param {DvtGanttRowNode} row The row node.
 * @param {object} props The properties for the task.
 * @class
 * @constructor
 * @implements {DvtKeyboardNavigable}
 * @implements {DvtSelectable}
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
  DvtGanttTaskNode.superclass.Init.call(this, gantt.getCtx(), null, props['id']);

  this._gantt = gantt;
  this._row = row;
  this._props = props;

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
 * Sets the properties for the node.
 * @param {object} props The properties.
 */
DvtGanttTaskNode.prototype.setProps = function(props)
{
  this._props = props;
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

  if (this.getParent() != container)
    container.addChild(this);

  this.setAriaRole('img');
  if (dvt.TimeAxis.supportsTouch())
  {
    this.refreshAriaLabel();
  }

  // Render task elements (labels will be rendered later, see DvtGanttRowNode.render())
  this._task.render();

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
 * @return {number} The final height.
 */
DvtGanttTaskNode.prototype.getFinalHeight = function()
{
  return this._task.getFinalHeight();
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
  else if (keyboardHandler.isNavigationEvent(event))
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
 * Whether the task element is a milestone
 * @param {string} elementType The task element in question
 * @return {boolean} whether the task element is a milestone
 */
DvtGanttTask.prototype.isMilestone = function(elementType)
{
  var taskProps = this._container.getProps(),
      baselineProps = taskProps['baseline'],
      start, end;

  if (DvtGanttTaskShape.MAIN_TYPES.indexOf(elementType) > -1)
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
 * @return {number} The final height of the task in pixels
 */
DvtGanttTask.prototype.getFinalHeight = function()
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

  var progressHeight = this.getProgressValue() !== null ? this.getProgressHeight() : 0;

  var heightTaskToptoBaselineBottom = this.isMilestone('baseline') ? DvtGanttStyleUtils.getMilestoneBaselineYOffset() + baselineHeight : taskHeight + baselineHeight;
  if (taskHeight < progressHeight)
  {
    return Math.max(progressHeight, (progressHeight - taskHeight) / 2 + heightTaskToptoBaselineBottom);
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
  var progressHeight = this.getProgressValue !== null ? this.getProgressHeight() : 0;

  // Rendering in this order to ensure desired stacking on initial render
  this.renderBaseline(progressHeight);
  this.renderMain(progressHeight);
  this.renderProgress(progressHeight);
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
    return this._mainRenderState;
  }
  if (shapeType === 'progress')
  {
    return this._progressRenderState;
  }
  if (shapeType === 'baseline')
  {
    return this._baselineRenderState;
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
    baselineDim = this.getTimeSpanDimensions(baselineProps['start'], baselineProps['end']);
    if (baselineDim)
    {
      this._baselineRenderState = this._container.getRenderState() === 'refurbish' ? 'add' : 'exist';

      // Determine offset from main element
      offsetDim = this.getTimeSpanDimensions(taskProps['start'] ? taskProps['start'] : taskProps['end'], baselineProps['start']);

      isMilestone = this.isMilestone('baseline');

      // Calculate final dimensions
      x = offsetDim ? offsetDim['distance'] : 0;
      yOffset = isMilestone ? DvtGanttStyleUtils.getMilestoneBaselineYOffset() : taskProps['height'];
      y = Math.max(0, (progressHeight - taskProps['height']) / 2) + yOffset;
      width = Math.abs(baselineDim['distance']);
      height = baselineProps['height'];
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
        this._baselineRenderState = 'add';
      }
      else if (isMilestone) // case where was bar baseline, but turned to milestone baseline on rerender, then make sure it's behind everything
      {
        this._container.addChildAt(this._baselineShape, 0);
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
    mainDim = this.getTimeSpanDimensions(taskProps['start'], taskProps['end']);
    if (mainDim)
    {
      this._mainRenderState = this._container.getRenderState() === 'refurbish' ? 'add' : 'exist';

      // Calculate final dimensions
      x = 0;
      y = Math.max(0, (progressHeight - taskHeight) / 2);
      width = Math.abs(mainDim['distance']);
      height = taskHeight;
      borderRadius = taskProps['borderRadius'];

      if (this._mainShape == null) // element doesn't exist in DOM already
      {
        this._mainShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, width, height, borderRadius, this, 'main');
        this._container.addChild(this._mainShape);
        this._mainRenderState = 'add';
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
    this._progressRenderState = this._container.getRenderState() === 'refurbish' ? 'add' : 'exist';

    // Calculate final dimensions
    x = 0;
    y = Math.max(0, (taskHeight - progressHeight) / 2);
    width = progressValue * this._mainShape.getFinalWidth();
    borderRadius = progressProps['borderRadius'];

    if (this._progressShape == null) // element doesn't exist in DOM already
    {
      this._progressShape = new DvtGanttTaskShape(this._gantt.getCtx(), x, y, width, progressHeight, borderRadius, this, 'progress');
      this._container.addChild(this._progressShape);
      this._progressRenderState = 'add';
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
      x, y;

  if (effectiveLabelPosition === 'progress' || effectiveLabelPosition === 'progressStart')
  {
    this.setAssociatedShape(this._container.getTask().getShape('progress'));
  }

  // Determine y position
  y = this._associatedShape.getFinalY() + ((this._associatedShape.getFinalHeight() - labelDimensions.h) / 2);
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
      availableWidth, availableHeight = this._associatedShape.getFinalHeight(),
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
  if (labelWidth > availableWidth || labelHeight > availableHeight)
  {
    dvt.TextUtils.fitText(this._labelOutputText, availableWidth, availableHeight, this._container, 1);
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
      self = this, onRenderEnd;

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
      this._labelOutputText.setClassName(this._gantt.GetStyleClass('taskLabel'));
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
  this._typeCmdGeneratorMap = {
    'main': this._generateRepShapeCmd,
    'mainSelect': this._generateRepShapeCmd,
    'mainHover': this._generateRepShapeCmd,
    'progress': this._generateRectCmd,
    'baseline': this._generateRepShapeCmd,
    'baselineSelect': this._generateRepShapeCmd,
    'baselineHover': this._generateRepShapeCmd
  };
  this._isRTL = dvt.Agent.isRightToLeft(context);

  cmds = this._typeCmdGeneratorMap[this._type].call(this, this._x, this._y, this._w, this._h, this._r);
  DvtGanttTaskShape.superclass.Init.call(this, context, cmds, id);

  this._applyDefaultStyleClasses();

  // Render the main/progress/baseline shapes with crispedge so that their outlines
  // don't look blurry.
  switch (this._type)
  {
    case 'main':
    case 'progress':
    case 'baseline':
      this.setPixelHinting(true);
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
  // TODO GET EEFFECT_MARGIN FROM STYLEUTILS
  var margin = (DvtGanttTaskShape.MAIN_EFFECT_TYPES.indexOf(this._type) > -1 ||
                DvtGanttTaskShape.BASELINE_EFFECT_TYPES.indexOf(this._type) > -1) * DvtGanttStyleUtils.getTaskEffectMargin(),
      diamondMargin;

  // Diamond shape for milestone
  if (this._task.isMilestone(this._type) && (w == 0))
  {
    diamondMargin = margin * Math.sqrt(2);
    return this._generateDiamondCmd(x, y - diamondMargin, h + 2 * diamondMargin, r);
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
    if (!this._isRTL) // reference point at top left corner
      return 'M' + x + ' ' + y +
          ' H' + (x + w) +
          ' V' + (y + h) +
          ' H' + x +
          ' Z';

    // If RTL refrence point at top right corner
    return 'M' + x + ' ' + y +
        ' H' + (x - w) +
        ' V' + (y + h) +
        ' H' + x +
        ' Z';
  }
  return dvt.PathUtils.rectangleWithBorderRadius(x - this._isRTL * w, y, w, h, r, Math.min(w, h), '0');
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
  // For our default 0px border radius case, skip the parsing and
  // generate the path.
  if (r === '0' || r === '0px')
  {
    return 'M' + x + ' ' + y +
        ' L' + (x + half_h) + ' ' + (y + half_h) +
        ' L' + x + ' ' + (y + h) +
        ' L' + (x - half_h) + ' ' + (y + half_h) +
        ' Z';
  }
  // Only support 4 corner with the same radius for milestone diamond
  var br = Math.min((new dvt.CSSStyle({'border-radius': r})).getBorderRadius(), h / (2 * Math.sqrt(2))),
      r_over_root2 = br / Math.sqrt(2),
      rx = br, ry = br;
  return 'M' + (x - r_over_root2) + ' ' + (y + r_over_root2) +
      ' A' + rx + ' ' + ry + ' 0 0 1 ' + (x + r_over_root2) + ' ' + (y + r_over_root2) +
      ' L' + (x + half_h - r_over_root2) + ' ' + (y + half_h - r_over_root2) +
      ' A' + rx + ' ' + ry + ' 0 0 1 ' + (x + half_h - r_over_root2) + ' ' + (y + half_h + r_over_root2) +
      ' L' + (x + r_over_root2) + ' ' + (y + h - r_over_root2) +
      ' A' + rx + ' ' + ry + ' 0 0 1 ' + (x - r_over_root2) + ' ' + (y + h - r_over_root2) +
      ' L' + (x - half_h + r_over_root2) + ' ' + (y + half_h + r_over_root2) +
      ' A' + rx + ' ' + ry + ' 0 0 1 ' + (x - half_h + r_over_root2) + ' ' + (y + half_h - r_over_root2) +
      ' Z';
};

/**
 * Applies any default classes and styles to the shape based on the specified type.
 * @private
 */
DvtGanttTaskShape.prototype._applyDefaultStyleClasses = function()
{
  var styleClass, milestoneDefaultClass, barDefaultClass, taskFillColor, style;
  if (this._type === 'progress')
  {
    styleClass = this._task.getGantt().GetStyleClass('taskProgress');
    this.setClassName(styleClass);
  }
  else if (DvtGanttTaskShape.MAIN_TYPES.indexOf(this._type) > -1)
  {
    styleClass = this._task.getGantt().GetStyleClass('task');
    milestoneDefaultClass = this._task.getGantt().GetStyleClass('taskMilestone');
    barDefaultClass = this._task.getGantt().GetStyleClass('taskBar');
    if (this._task.isMilestone(this._type) && this._w == 0)
    {
      styleClass += ' ' + milestoneDefaultClass;
    }
    else
    {
      styleClass += ' ' + barDefaultClass;
    }

    if (this._type === 'mainSelect')
    {
      this.setStyle({'fill': 'none', 'filter': 'none'});
      styleClass += ' ' + this._task.getGantt().GetStyleClass('selected');
    }
    else if (this._type === 'mainHover')
    {
      styleClass += ' ' + this._task.getGantt().GetStyleClass('hover');
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

    this.setClassName(styleClass);
  }
  else if (DvtGanttTaskShape.BASELINE_TYPES.indexOf(this._type) > -1)
  {
    styleClass = this._task.getGantt().GetStyleClass('baseline');
    milestoneDefaultClass = this._task.getGantt().GetStyleClass('baselineMilestone');
    barDefaultClass = this._task.getGantt().GetStyleClass('baselineBar');
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
    return this._h / 2;
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
    return this._h / 2;
  }
  return 0;
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
