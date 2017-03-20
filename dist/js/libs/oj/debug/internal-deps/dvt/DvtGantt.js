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
 * Class representing a rectangle drawn using DvtPath.
 * @param {dvt.Context} context
 * @param {number} x position
 * @param {number} y posiiton
 * @param {number} w width
 * @param {number} h height
 * @param {number} r borderraidus
 * @param {string=} id The optional id for the corresponding DOM element.
 * @extends {dvt.Path}
 * @class
 * @constructor
 */
var DvtPathRect = function(context, x, y, w, h, r, id)
{
  this.Init(context, x, y, w, h, r, id);
};

dvt.Obj.createSubclass(DvtPathRect, dvt.Path);

/**
 * @param {dvt.Context} context
 * @param {number} x position
 * @param {number} y posiiton
 * @param {number} w width
 * @param {number} h height
 * @param {number=} r borderradius If not specified assume to be 0.
 * @param {string=} id The optional id for the corresponding DOM element.
 * @protected
 */
DvtPathRect.prototype.Init = function(context, x, y, w, h, r, id)
{
  this._x = x;
  this._y = y;
  this._w = w;
  this._h = h;
  this._r = r != null ? r : 0;
  this._isRTL = dvt.Agent.isRightToLeft(context);
  var cmds = this.generateRectCommands(this._x, this._y, this._w, this._h, this._r);
  DvtPathRect.superclass.Init.call(this, context, cmds, id);
};

/**
 * Generates the path command that draws a rectangle with given dimensions and radius.
 * In LTR, rect reference point is at the top left corner. Top right in RTL.
 * @param {number} x position
 * @param {number} y posiiton
 * @param {number} w width
 * @param {number} h height
 * @param {number=} r borderradius If not specified assume to be 0.
 * @return {string} the command string
 */
DvtPathRect.prototype.generateRectCommands = function(x, y, w, h, r)
{
  var rx = r, ry = r;
  if (!this._isRTL) // reference point at top left corner
    return 'M' + (x + rx) + ' ' + y +
        ' H' + (x + w - rx) +
        ' A' + rx + ' ' + ry + ' 0 0 1 ' + (x + w) + ' ' + (y + ry) +
        ' V' + (y + h - ry) +
        ' A' + rx + ' ' + ry + ' 0 0 1 ' + (x + w - rx) + ' ' + (y + h) +
        ' H' + (x + rx) +
        ' A' + rx + ' ' + ry + ' 0 0 1 ' + x + ' ' + (y + h - ry) +
        ' V' + (y + ry) +
        ' A' + rx + ' ' + ry + ' 0 0 1 ' + (x + rx) + ' ' + y;

  // If RTL refrence point at top right corner
  return 'M' + (x - rx) + ' ' + y +
      ' H' + (x - w + rx) +
      ' A' + rx + ' ' + ry + ' 0 0 0 ' + (x - w) + ' ' + (y + ry) +
      ' V' + (y + h - ry) +
      ' A' + rx + ' ' + ry + ' 0 0 0 ' + (x - w + rx) + ' ' + (y + h) +
      ' H' + (x - rx) +
      ' A' + rx + ' ' + ry + ' 0 0 0 ' + x + ' ' + (y + h - ry) +
      ' V' + (y + ry) +
      ' A' + rx + ' ' + ry + ' 0 0 0 ' + (x - rx) + ' ' + y;
};

/**
 * Gets width.
 * @return {number} The width.
 */
DvtPathRect.prototype.getWidth = function()
{
  return this._w;
};

/**
 * Sets width.
 * @param {number} width The new width.
 */
DvtPathRect.prototype.setWidth = function(width)
{
  this._w = width;
  var cmds = this.generateRectCommands(this._x, this._y, this._w, this._h, this._r);
  this.setCmds(cmds);
};

/**
 * Gets height.
 * @return {number} The height.
 */
DvtPathRect.prototype.getHeight = function()
{
  return this._h;
};

/**
 * Sets height.
 * @param {number} height The new height.
 */
DvtPathRect.prototype.setHeight = function(height)
{
  this._h = height;
  var cmds = this.generateRectCommands(this._x, this._y, this._w, this._h, this._r);
  this.setCmds(cmds);
};

/**
 * Gets the x position of reference point.
 * @return {number} The x position.
 */
DvtPathRect.prototype.getX = function()
{
  return this.getTranslateX();
};

/**
 * Sets the x position of reference point.
 * @param {number} x The new x position.
 */
DvtPathRect.prototype.setX = function(x)
{
  this.setTranslateX(x);
};

/**
 * Gets the y position of reference point.
 * @return {number} The y position.
 */
DvtPathRect.prototype.getY = function()
{
  return this.getTranslateY();
};

/**
 * Sets the y position of reference point.
 * @param {number} y The new y position.
 */
DvtPathRect.prototype.setY = function(y)
{
  this.setTranslateY(y);
};
/**
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {Element} canvas The HTML canvas to measure text dimensions from
 * @param {string} id
 * @extends {dvt.OutputText}
 * @class
 * @constructor
 */
var DvtGanttOutputText = function(context, textStr, x, y, canvas, id)
{
  this.Init(context, textStr, x, y, canvas, id);
};

dvt.Obj.createSubclass(DvtGanttOutputText, dvt.OutputText);

/**
 * @param {dvt.Context} context
 * @param {string} textStr
 * @param {number} x
 * @param {number} y
 * @param {Element} canvas The HTML canvas to measure text dimensions from
 * @param {string} id
 * @protected
 */
DvtGanttOutputText.prototype.Init = function(context, textStr, x, y, canvas, id)
{
  DvtGanttOutputText.superclass.Init.call(this, context, textStr, x, y, id);
  this._htmlCanvas = canvas;

  // To ameliorate IE 11 vertical alignment issues:
  var vAlign = this.getVertAlignment();
  this.alignAuto();
  this.setVertAlignment(vAlign);
};

/**
 * Similar to the parent class version except text dimensions are measured using HTML canvas
 * @param {dvt.Displayable=} targetCoordinateSpace The displayable defining the target coordinate space.
 * @return {dvt.Rectangle} The bounds of the text
 * @override
 */
DvtGanttOutputText.prototype.measureDimensions = function(targetCoordinateSpace)
{
  //  - Gantt doesn't render in RTL in IE11 and Edge. The underlying issue is
  // that the superclass's (dvt.OutputText) Init method calls measureDimensions() only
  // in IE RTL mode to fix alignment issues. The _htmlCanvas is not defined at that point
  // (see Init method of this class; _htmlCanvas is defined only after the superclass's Init
  // finishes) so an error is thrown. Most robust fix would be to default to the superclass's
  // measureDimensions for that case.
  // Note that this method override is present only for performance reasons. The plan is to
  // eliminate this method and use the original measureDimensions anyway once we optimize Gantt rendering.
  if (this._htmlCanvas == null)
    return DvtGanttOutputText.superclass.measureDimensions.call(this, targetCoordinateSpace);

  var textString = this.getTextString() != null ? this.getTextString() : '';
  var hAlign = this.getHorizAlignment();
  var vAlign = this.getVertAlignment();

  if (!DvtGanttOutputText._cache)
    DvtGanttOutputText._cache = new dvt.Cache();

  var cssStyle = this.getCSSStyle();
  var cssStyleKey = (cssStyle != null) ? cssStyle.hashCodeForTextMeasurement() : '';
  var cacheKey = (textString.length > 0) ? textString + cssStyleKey : '';

  var dims = DvtGanttOutputText._cache.get(cacheKey);
  if (dims == null)
  {
    if (!dvt.Agent.isPlatformIE()) { // avoid infinite recursion in IE
      this.alignLeft();
    }

    this.alignAuto();
    var fontStyle = 'normal';
    var fontVariant = 'normal';
    var fontWeight = 'normal';
    var fontSize = this.getCtx().getDefaultFontSize();
    var lineHeight = 'normal';
    var fontFamily = this.getCtx().getDefaultFontFamily();
    if (cssStyle != null)
    {
      var customFontFamily = cssStyle.getStyle(dvt.CSSStyle.FONT_FAMILY);
      if (customFontFamily)
        fontFamily = customFontFamily;
      var customFontSize = cssStyle.getStyle(dvt.CSSStyle.FONT_SIZE);
      if (customFontSize)
      {
        fontSize = customFontSize;
      }
      var customFontStyle = cssStyle.getStyle(dvt.CSSStyle.FONT_STYLE);
      if (customFontStyle)
        fontStyle = customFontStyle;
      var customFontWeight = cssStyle.getStyle(dvt.CSSStyle.FONT_WEIGHT);
      if (customFontWeight)
        fontWeight = customFontWeight;
    }

    // IE11 and Edge's html CanvasRenderingContext2D (context variable below) seems to be having issues
    // accepting -apple-system fonts. At the time of writing, -apple-system font is part of the default
    // font-family list, and it's causing IE/Edge only bugs 24717768 and 24717845. Since -apple-system is
    // iOS and OSX specific, it'll never be the computed font in IE/Edge, so a straightforward fix is to
    // not pass them as options to CanvasRenderingContext2D; the lines below use regular expression to
    // remove any prefixed -apple-system font families from the list before passing the font to the canvas context.
    if (dvt.Agent.isPlatformIE())
      fontFamily = fontFamily.replace(/-apple-system(-\w+)*,?/g, '');

    var font = fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + ' / ' + lineHeight + ' ' + fontFamily;
    var context = this._htmlCanvas.getContext('2d');
    context.font = font;
    var metrics = context.measureText(textString);

    if (!dvt.Agent.isPlatformIE())
      this.setHorizAlignment(hAlign);
    this.setVertAlignment(vAlign);
    dims = new dvt.Rectangle(this.getX(), this.getY(), metrics.width, dvt.TextUtils.guessTextDimensions(this).h);
    DvtGanttOutputText._cache.put(cacheKey, dims);
  }

  // Adjust dimensions for text alignment.  We do this because we don't take alignment into account in the cache.
  if (hAlign === dvt.OutputText.H_ALIGN_RIGHT)
    dims.x -= dims.w;
  else if (hAlign === dvt.OutputText.H_ALIGN_CENTER)
    dims.x -= dims.w / 2;

  if (vAlign === dvt.OutputText.V_ALIGN_TOP)
    dims.y -= 0;
  else if (vAlign === dvt.OutputText.V_ALIGN_BOTTOM)
    dims.y -= dims.h;
  else if (vAlign === dvt.OutputText.V_ALIGN_MIDDLE)
    dims.y -= (dims.h / 2);

  // Transform to the target coord space and return
  return (!targetCoordinateSpace || targetCoordinateSpace === this) ? dims : this.ConvertCoordSpaceRect(dims, targetCoordinateSpace);
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
 * The default task label padding.
 * @const
 * @private
 */
DvtGanttStyleUtils._DEFAULT_TASK_LABEL_PADDING = 5;

/**
 * The default task bar padding.
 * @const
 * @private
 */
DvtGanttStyleUtils._DEFAULT_TASK_PADDING = 5;

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
 * Gets the padding around taskbar.
 * @return {number} The taskbar padding.
 */
DvtGanttStyleUtils.getTaskbarPadding = function()
{
  return DvtGanttStyleUtils._DEFAULT_TASK_PADDING;
};

/**
 * Gets the padding around taskbar label.
 * @return {number} The taskbar label padding.
 */
DvtGanttStyleUtils.getTaskbarLabelPadding = function()
{
  return DvtGanttStyleUtils._DEFAULT_TASK_LABEL_PADDING;
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
 * @param {DvtGanttTaskNode} task
 * @return {string} The datatip color.
 */
DvtGanttTooltipUtils.getDatatipColor = function(task) {
  return task.getFillColor();
};

/**
 * Returns the datatip string for the target task.
 * @param {DvtGanttTaskNode} task
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @param {boolean=} isAria whether the datatip is used for accessibility.
 * @return {string} The datatip string.
 */
DvtGanttTooltipUtils.getDatatip = function(task, isTabular, isAria) {
  var gantt = task.getGantt();
  var row = task.getRow();

  // Custom Tooltip via Function
  var customTooltip = gantt.getOptions()['tooltip'];
  var tooltipFunc = customTooltip ? customTooltip['renderer'] : null;

  if (isTabular && tooltipFunc) {
    var tooltipManager = gantt.getCtx().getTooltipManager();
    var dataContext = {
      'data': task.getProps(),
      'rowData': row.getProps(),
      'color': task.getFillColor(),
      'component': gantt.getOptions()['_widgetConstructor']
    };

    return tooltipManager.getCustomTooltip(tooltipFunc, dataContext);
  }

  // Custom Tooltip via Short Desc
  var shortDesc = task.getShortDesc();
  if (shortDesc != null)
    return shortDesc;

  // TODO: Remove this block and the isAria param when we can remove the translation strings that were supported
  // before the shortDesc/valueFormats/tooltip API (before 2.3.0). At the time of writing, we plan to deprecate
  // them, and remove in 4.0.0.
  // Behavior: If someone upgrades from 2.2.0 to 2.3.0 with no code changes (ie, no shortDesc, valueFormat set),
  // old aria-label format with the translation options will work as before. If shortDesc or valueFormat is set,
  // then new behavior will override the old aria-label format and any translation settings.
  if (isAria) {
    var valueFormats = gantt.getOptions()['valueFormats'];
    if (!valueFormats || valueFormats.length == 0) {
      var start = task.getStartTime();
      var end = task.getEndTime();
      var options = gantt.getOptions();
      if (start == null || end == null || start == end) {
        var time = gantt.getTimeAxis().formatDate(new Date(((start != null) ? start : end)), null, 'general');
        var taskDesc = dvt.Bundle.getTranslation(options, 'accessibleMilestoneInfo', dvt.Bundle.UTIL_PREFIX, 'MILESTONE_INFO', [time]);
      }
      else {
        var startTime = gantt.getTimeAxis().formatDate(new Date(start), null, 'general');
        var endTime = gantt.getTimeAxis().formatDate(new Date(end), null, 'general');
        var duration = task.getDuration(start, end);
        taskDesc = dvt.Bundle.getTranslation(options, 'accessibleTaskInfo', dvt.Bundle.UTIL_PREFIX, 'TASK_INFO', [startTime, endTime, duration]);
      }
      var label = task.getLabel();
      if (label != null)
        taskDesc = label + ', ' + taskDesc;

      var row = task.getRow();
      var rowDesc = dvt.Bundle.getTranslation(options, 'accessibleRowInfo', dvt.Bundle.UTIL_PREFIX, 'ROW_INFO', [row.getIndex() + 1]);
      if (gantt.isRowAxisEnabled()) {
        var rowLabel = row.getLabel();
        if (rowLabel != null)
          rowDesc = rowDesc + ', ' + rowLabel;
      }
      taskDesc = rowDesc + ', ' + taskDesc;

      return taskDesc;
    }
  }

  // Default Tooltip Support
  var datatip = '';
  datatip = DvtGanttTooltipUtils._addRowDatatip(datatip, row, isTabular);
  datatip = DvtGanttTooltipUtils._addTaskDatatip(datatip, task, isTabular);

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
 * @param {DvtGanttTaskNode} task The task.
 * @param {boolean} isTabular Whether the datatip is in a table format.
 * @return {string} The updated datatip.
 * @private
 */
DvtGanttTooltipUtils._addTaskDatatip = function(datatip, task, isTabular) {
  var gantt = task.getGantt();
  var start = task.getStartTime();
  var end = task.getEndTime();
  var label = task.getLabel();

  // TODO: Consider whether to automatically show only one Time label when start == end e.g. milestone case
  datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'start', 'Start', start, isTabular);
  datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'end', 'End', end, isTabular);
  datatip = DvtGanttTooltipUtils._addDatatipRow(datatip, gantt, 'label', 'Label', label, isTabular);

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

  if (type == 'start' || type == 'end')
    return gantt.getTimeAxis().formatDate(new Date(value), converter, 'general');

  var converter = valueFormat['converter'];
  if (converter && converter['format'])
    return converter['format'](value);

  return value;
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

  this._isIRAnimationEnabled = props.isIRAnimationEnabled;
  this._isDCAnimationEnabled = props.isDCAnimationEnabled;

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

  this._prepareForAnimations();

  DvtGanttRenderer.renderGantt(this);

  this.triggerAnimations();

  this.UpdateAriaAttributes();

  this._animationMode = 'none';

  if (!this.Animation)
    // If not animating, that means we're done rendering, so fire the ready event.
    this.RenderComplete();
};

/**
 * Initializes the necessary animators for animation.
 * @private
 */
dvt.Gantt.prototype._prepareForAnimations = function()
{
  this.StopAnimation();

  this._animationMode = 'none';

  this._animationDuration = 0.5; // seconds. Default value.

  // Override with animation duration from CSS if possible
  if (this.Options['_resources'])
  {
    var animationDuration = this.Options['_resources']['animationDuration'];
    if (animationDuration)
      this._animationDuration = dvt.StyleUtils.getTimeMilliseconds(animationDuration) / 1000; // seconds
  }

  if (!this._canvas) // initial render/display
  {
    if (this._isIRAnimationEnabled)
      this._animationMode = 'onDisplay';
  }
  else // data change
  {
    if (this._isDCAnimationEnabled)
      this._animationMode = 'dataChange';
  }

  if (this._animationMode === 'onDisplay')
  {
    this.IRAnimElems = [];
    this.IRPlayable = this._createCustomPlayable(dvt.Easing.linear);
  }
  else if (this._animationMode === 'dataChange')
  {
    // remove rows phase:
    this.removeRowsFakeRmAnimElems = []; // elements that fade out, but don't actually get removed from canvas
    this.removeRowsRmAnimElems = []; // elements that fade out, and get removed from canvas

    // add rows phase:
    this.addRowsMvRowsPlayable = this._createCustomPlayable(dvt.Easing.linear);
    this.addRowsFrAnimElems = []; // elements that fade in

    // remove elements phase:
    // 1. fade out tasks to be removed
    this.rmAnimElems = [];

    // move elements phase:
    // 1. translate intra row tasks X and Y and animate duration
    // 2. translate inter row tasks X and Y and animate duration
    // at the same time translate tasks and horizontal lines as necessary to make room
    this.moveTaskDurationPlayable = this._createCustomPlayable(dvt.Easing.linear);
    this.interRowMvPlayable = this._createCustomPlayable(dvt.Easing.cubicInOut);

    this.intraRowMvPlayable = this._createCustomPlayable(dvt.Easing.cubicInOut);
    this.sameTaskDurationPlayable = this._createCustomPlayable(dvt.Easing.linear);

    this.mvGeneralMvPlayable = this._createCustomPlayable(dvt.Easing.linear);

    // add elements phase:
    // 1. translate elements (overlapping tasks + horizontal lines) to make room for added elements
    // 2. fade in added elements + animate duration
    this.frAnimElems = [];
    this.newTaskDurationPlayable = this._createCustomPlayable(dvt.Easing.linear);
  }
};

/**
 * Gets the animation mode (onDisplay or dataChange).
 * @return {string} the animation mode.
 */
dvt.Gantt.prototype.getAnimationMode = function()
{
  return this._animationMode;
};

/**
 * Generates a playable object with specified easing animation.
 * @param {function} easing The easing function to use when animating.
 * @return {dvt.CustomAnimation} The playable.
 * @private
 */
dvt.Gantt.prototype._createCustomPlayable = function(easing)
{
  var playable = new dvt.CustomAnimation(this.getCtx(), this, this._animationDuration);
  playable.setEasing(easing);
  return playable;
};

/**
 * Starts all animations.
 */
dvt.Gantt.prototype.triggerAnimations = function()
{
  // Initial Render animation:
  // Parallel: Fade in gantt, animate task bar durations.

  // Data Change animation:
  // Parallel(Remove elements, Move elements, Add elements)

  this.StopAnimation(); // just in case

  var context = this.getCtx();
  if (this._animationMode === 'onDisplay')
  {
    var subPlayables = [this.IRPlayable, new dvt.AnimFadeIn(context, this.IRAnimElems, this._animationDuration, 0)];
    var overallPlayable = new dvt.ParallelPlayable(context, subPlayables, this._animationDuration, 0);
    this.Animation = overallPlayable;
  }
  else if (this._animationMode === 'dataChange')
  {
    var removeRowsFakeRmAnimPlayable = new dvt.AnimFadeOut(context, this.removeRowsFakeRmAnimElems, this._animationDuration, 0);
    var removeRowsRmAnimPlayable = new dvt.AnimFadeOut(context, this.removeRowsRmAnimElems, this._animationDuration, 0);
    var rmAnimPlayable = new dvt.AnimFadeOut(context, this.rmAnimElems, this._animationDuration, 0);
    this._prepRmAnimation();
    dvt.Playable.appendOnEnd(rmAnimPlayable, this._onRmAnimationEnd, this);
    var removeContentPlayables = [rmAnimPlayable, removeRowsFakeRmAnimPlayable, removeRowsRmAnimPlayable];
    var removeContentPlayable = new dvt.ParallelPlayable(context, removeContentPlayables, this._animationDuration, 0);


    var addRowsFrAnimPlayable = new dvt.AnimFadeIn(context, this.addRowsFrAnimElems, this._animationDuration, 0);
    this._prepFrAnimation(this.addRowsFrAnimElems, addRowsFrAnimPlayable);
    var addFrAnimPlayable = new dvt.AnimFadeIn(context, this.frAnimElems, this._animationDuration, 0);
    this._prepFrAnimation(this.frAnimElems, addFrAnimPlayable);
    var addContentPlayables = [this.newTaskDurationPlayable, addFrAnimPlayable, this.addRowsMvRowsPlayable, addRowsFrAnimPlayable];
    var addContentPlayable = new dvt.ParallelPlayable(context, addContentPlayables, this._animationDuration, 0);


    var mvPlayables = [this.intraRowMvPlayable, this.interRowMvPlayable, this.sameTaskDurationPlayable, this.moveTaskDurationPlayable, this.mvGeneralMvPlayable];
    var mvPlayable = new dvt.ParallelPlayable(context, mvPlayables, this._animationDuration, 0);

    var overallPlayable = new dvt.ParallelPlayable(context, [removeContentPlayable, mvPlayable, addContentPlayable], this._animationDuration, 0);

    // IN CASE WE WANT SEQUENTIAL(REMOVE, MOVE, ADD) ANIMATION:
    // var sequentialPlayables = [];
    // if (removeContentPlayables.length > 0)
    //   sequentialPlayables.push(removeContentPlayable);
    // sequentialPlayables.push(mvPlayable);
    // if (addContentPlayables.length > 0)
    //   sequentialPlayables.push(addContentPlayable);
    // var overallPlayable = new dvt.SequentialPlayable(context, sequentialPlayables, this._animationDuration, 0)

    dvt.Playable.appendOnEnd(overallPlayable, this._onRmRowsAnimationEnd, this);

    this.Animation = overallPlayable;
  }

  // If an animation was created, play it
  if (this.Animation)
  {
    // Instead of animating dep lines, hide them, animate, then show them again.
    // TODO: remove this in 3.0.0 and refine dependency lines animation instead.
    this._hideDepLines();
    dvt.Playable.appendOnEnd(this.Animation, this._showDepLines, this);

    // Disable event listeners temporarily
    this.EventManager.removeListeners(this);

    dvt.Playable.appendOnEnd(this.Animation, this._onAnimationEnd, this);
    this.Animation.play();
  }
};

/**
 * pre remove animation setup
 * @private
 */
dvt.Gantt.prototype._prepRmAnimation = function()
{
  for (var i = 0; i < this.rmAnimElems.length; i++)
  {
    var elem = this.rmAnimElems[i];
    if (elem.getAnimationState() === 'refurbished')
    {
      elem.applyPreviousState();
    }
  }
};

/**
 * Executed after remove animation ends.
 * @private
 */
dvt.Gantt.prototype._onRmAnimationEnd = function()
{
  for (var i = 0; i < this.rmAnimElems.length; i++)
  {
    var elem = this.rmAnimElems[i];
    if (elem.getAnimationState() === 'delete' && elem.getParent())
    {
      elem.getParent().removeChild(elem);
    }
    else if (elem.getAnimationState() === 'refurbished')
    {
      elem.applyCurrentState();
    }
  }
};

/**
 * Executed after remove rows animation ends
 * @private
 */
dvt.Gantt.prototype._onRmRowsAnimationEnd = function()
{
  for (var i = 0; i < this.removeRowsRmAnimElems.length; i++)
  {
    var elem = this.removeRowsRmAnimElems[i];
    if (elem.getParent())
      elem.getParent().removeChild(elem);
  }
};

/**
 * pre fade in animation setup
 * @param {array} animElems
 * @param {dvt.Playable} playable
 * @private
 */
dvt.Gantt.prototype._prepFrAnimation = function(animElems, playable)
{
  for (var i = 0; i < animElems.length; i++)
  {
    var elem = animElems[i];
    if (!elem.getAnimationState || elem.getAnimationState() === 'new')
      playable.InitStartState(elem);
  }
};

/**
 * Hides dependency lines (called before animation)
 * @private
 */
dvt.Gantt.prototype._hideDepLines = function()
{
  var deplines = this.getDependencyLines();
  if (deplines != null)
    dvt.ToolkitUtils.setAttrNullNS(deplines.getElem(), 'display', 'none');
};

/**
 * Shows dependency lines (called after animation)
 * @private
 */
dvt.Gantt.prototype._showDepLines = function()
{
  var deplines = this.getDependencyLines();
  if (deplines != null)
    dvt.ToolkitUtils.removeAttrNullNS(deplines.getElem(), 'display');
};

/**
 * Hook for cleaning animation behavior at the end of the animation.
 * @private
 */
dvt.Gantt.prototype._onAnimationEnd = function()
{
  // Fire ready event saying animation is finished.
  if (!this.AnimationStopped)
    this.RenderComplete();

  // Restore event listeners
  this.EventManager.addListeners(this);

  // Reset animation flags
  this.Animation = null;
  this.AnimationStopped = false;
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
 * Updates the taskbars of each row due to component resize
 */
dvt.Gantt.prototype.updateRows = function()
{
  var labelContainer;
  var rows = this._rows;
  if (rows != null && rows.length > 0)
  {
    // update databody clip path
    DvtGanttRenderer._updateDatabody(this, this.getDatabody());

    if (this.isRowAxisEnabled())
      labelContainer = this.getRowAxis();

    // update the taskbars on each row
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
 * Gets the object that maps row ids with the DvtGanttRowNode
 * @return {object} The object with keys row ids and values DvtGantRowNode
 */
dvt.Gantt.prototype.getOldRowIdRowNodeMap = function()
{
  return this._oldRowIdRowNodeMap;
};

/**
 * Sets the object that maps row ids with the DvtGanttRowNode
 * @param {object} oldRowIdRowNodeMap The new object with keys row ids and values DvtGantRowNode
 */
dvt.Gantt.prototype.setOldRowIdRowNodeMap = function(oldRowIdRowNodeMap)
{
  this._oldRowIdRowNodeMap = oldRowIdRowNodeMap;
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
 * @param {DvtGanttTaskNode} task
 */
dvt.Gantt.prototype.scrollTaskIntoView = function(task)
{
  var isRTL = dvt.Agent.isRightToLeft(this.getCtx());
  var axesHeight = this.getAxesHeight();
  var timeZoomCanvas = this.getTimeZoomCanvas();
  var taskRect = {x: task.getTranslateX(), y: task.getTranslateY() + DvtGanttStyleUtils.getTaskbarPadding(), w: task.getWidth(), h: task.getHeight()};
  var viewportRect = {x: this.getStartXOffset() - timeZoomCanvas.getTranslateX(), y: this._databodyStart - this._databody.getTranslateY(), w: this._canvasLength, h: this._canvasSize - axesHeight};

  var deltaX = 0;
  var deltaY = 0;

  if (!isRTL)
  {
    if (taskRect.x < viewportRect.x)
      deltaX = taskRect.x - viewportRect.x - DvtGanttStyleUtils.getTaskbarPadding();
    else if (taskRect.x + taskRect.w > viewportRect.x + viewportRect.w)
      deltaX = (taskRect.x + taskRect.w) - (viewportRect.x + viewportRect.w) + DvtGanttStyleUtils.getTaskbarPadding();
  }
  else
  {
    if (taskRect.x > viewportRect.x + viewportRect.w)
      deltaX = taskRect.x - (viewportRect.x + viewportRect.w) + DvtGanttStyleUtils.getTaskbarPadding();
    else if (taskRect.x - taskRect.w < viewportRect.x)
      deltaX = (taskRect.x - taskRect.w) - viewportRect.x - DvtGanttStyleUtils.getTaskbarPadding();
  }

  if (taskRect.y < viewportRect.y)
    deltaY = taskRect.y - viewportRect.y - DvtGanttStyleUtils.getTaskbarPadding();
  else if (taskRect.y + taskRect.h > viewportRect.y + viewportRect.h)
    deltaY = (taskRect.y + taskRect.h) - (viewportRect.y + viewportRect.h) + DvtGanttStyleUtils.getTaskbarPadding();

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
 * Dim or un-Dim all task bars except the task specified
 * @param {DvtGanttTaskNode} task the task to exempt
 * @param {boolean} dim true if dim the task bar, brighten it otherwise
 * @protected
 */
dvt.Gantt.prototype.setTaskbarBrightness = function(task, dim)
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
  for (var i = 0; i < rows.length; i++)
  {
    var tasks = rows[i].getTasks();
    for (var j = 0; j < tasks.length; j++)
    {
      if (id === tasks[j].getId())
        return tasks[j];
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
            var bar = tasks[taskIndex].getBar();
            if (bar != null)
              return bar.getElem();
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
    'labelPosition': 'end',
    'borderRadius': 2,
    'height': 22
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
 * Determine the start position of the task bar, taking label into account
 * @param {DvtGanttTaskNode} task the task bar
 * @return {number} the start position of the task bar in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskStart = function(task)
{
  var ctx = task.getGantt().getCtx();

  if (dvt.Agent.isRightToLeft(ctx))
  {
    if (task.getLabelText() != null && task.getLabelText().getParent() != null && task.getLabelPosition() == 'end')
      return task.getCalculatedTranslateX() - task.getWidth() - task.getLabelText().getDimensions().w - DvtGanttStyleUtils.getTaskbarLabelPadding() * 2; // padding before + after
    else
      return task.getCalculatedTranslateX() - task.getWidth();
  }
  else
  {
    if (task.getLabelText() != null && task.getLabelText().getParent() != null && task.getLabelPosition() == 'start')
      return task.getCalculatedTranslateX() - task.getLabelText().getDimensions().w - DvtGanttStyleUtils.getTaskbarLabelPadding() * 2;
    else
      return task.getCalculatedTranslateX();
  }
};

/**
 * Determine the middle position of the task bar
 * @param {DvtGanttTaskNode} task the task to find the vertical middle point
 * @return {number} the middle position of the task bar in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskMiddle = function(task)
{
  return DvtGanttDependencyNode._getTaskTop(task) + Math.round(task.getHeight() / 2);
};

/**
 * Determine the end position of the task bar, taking label into account
 * @param {DvtGanttTaskNode} task the task to find the end
 * @return {number} the end position of the task bar in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskEnd = function(task)
{
  var ctx = task.getGantt().getCtx();
  if (dvt.Agent.isRightToLeft(ctx))
  {
    if (task.getLabelText() != null && task.getLabelText().getParent() != null && task.getLabelPosition() == 'start')
      return task.getCalculatedTranslateX() + task.getLabelText().getDimensions().w + DvtGanttStyleUtils.getTaskbarLabelPadding() * 2;
    else
      return task.getCalculatedTranslateX();
  }
  else
  {
    if (task.getLabelText() != null && task.getLabelText().getParent() != null && task.getLabelPosition() == 'end')
      return task.getCalculatedTranslateX() + task.getWidth() + task.getLabelText().getDimensions().w + DvtGanttStyleUtils.getTaskbarLabelPadding() * 2;
    else
      return task.getCalculatedTranslateX() + task.getWidth();
  }
};

/**
 * Calculate the top of the task bar
 * @param {DvtGanttTaskNode} task the task to find the top
 * @return {number} the position of the top of the task bar in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskTop = function(task)
{
  var dims = task.getDimensions();
  return task.getCalculatedTranslateY() + dims.y;
};

/**
 * Calculate the bottom of the task bar
 * @param {DvtGanttTaskNode} task the task to find the bottom
 * @return {number} the position of the bottom of the task bar in pixels
 * @private
 */
DvtGanttDependencyNode._getTaskBottom = function(task)
{
  return DvtGanttDependencyNode._getTaskTop(task) + task.getHeight();
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
  var m = DvtGanttStyleUtils.getTaskbarPadding() + DvtGanttStyleUtils.getDependencyLineLabelGap();

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
  var m = DvtGanttStyleUtils.getTaskbarPadding() + DvtGanttStyleUtils.getDependencyLineLabelGap();

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

  var date1 = (type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.START_FINISH) ? predecessor.getStartTime() : predecessor.getEndTime();

  if (type == DvtGanttDependencyNode.START_START || type == DvtGanttDependencyNode.FINISH_START)
    var date2 = successor.getStartTime();
  else
    date2 = successor.getEndTime();

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
          return this.getDefaultNavigable(tasks);
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
  var context = gantt.getCtx();

  if (!gantt.htmlCanvasContainer)
  {
    // prepare html canvas
    gantt.htmlCanvas = document.createElement('canvas');
    gantt.htmlCanvas.width = 0;
    gantt.htmlCanvas.height = 0;
    gantt.htmlCanvas.style.width = 0;
    gantt.htmlCanvas.style.height = 0;

    // prepare html canvas container and add the canvas as child
    gantt.htmlCanvasContainer = document.createElement('div');
    gantt.htmlCanvasContainer.style.fontFamily = context.getDefaultFontFamily();
    gantt.htmlCanvasContainer.style.fontSize = context.getDefaultFontSize();
    gantt.htmlCanvasContainer.style.width = 0;
    gantt.htmlCanvasContainer.style.height = 0;
    gantt.htmlCanvasContainer.style.visibility = 'hidden';
    gantt.htmlCanvasContainer.setAttribute('aria-hidden', 'true');
    gantt.htmlCanvasContainer.appendChild(gantt.htmlCanvas);
  }

  // Add html canvas and its contaier for text dimension measurements to DOM
  if (!context.getContainer().contains(gantt.htmlCanvasContainer))
    context.getContainer().appendChild(gantt.htmlCanvasContainer);

  DvtGanttRenderer._renderBackground(gantt);
  DvtGanttRenderer._renderRowBackground(gantt);
  DvtGanttRenderer._renderScrollableCanvas(gantt);

  // initial render animation: fadeIn the gantt
  if (gantt.getAnimationMode() === 'onDisplay')
    gantt.IRAnimElems.push(gantt._canvas);

  // remove any empty text first if present
  gantt.removeEmptyText();

  if (gantt.hasValidOptions())
  {
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
    return;

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
  var rows = gantt.getRows();
  if (rows != null && rows.length > 0)
  {
    var horizontalLineHeightOffset = 0;
    if (gantt.isHorizontalGridlinesVisible())
      horizontalLineHeightOffset = DvtGanttStyleUtils.getHorizontalGridlineWidth(gantt.getOptions());

    var background = gantt._rowBackground;
    background.setY(gantt.getDatabodyStart());
    var height = rows[rows.length - 1].getTop() + rows[rows.length - 1].getRowHeight() + horizontalLineHeightOffset;
    if (gantt.getAnimationMode() === 'dataChange')
    {
      var animator = gantt.mvGeneralMvPlayable.getAnimator();
      animator.addProp(dvt.Animator.TYPE_NUMBER, background, background.getHeight, background.setHeight, height);
    }
    else
      background.setHeight(height);
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
 * @param {boolean=} dontClear whether to not clear the canvas. Default false.
 * @private
 */
DvtGanttRenderer._renderEmptyText = function(gantt, dontClear)
{
  // Get the empty text string
  if (dontClear)
  {
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
      container.addChild(referenceObjectsContainer);
      gantt.setReferenceObjectsContainer(referenceObjectsContainer);

      renderedReferenceObjects = [];
    }

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

  var oldRowIdRowNodeMap = {};
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

      oldRowIdRowNodeMap[rowNode.getId()] = rowNode;
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
      if (gantt._isDCAnimationEnabled) // data change animation
        rowNode.render(databody, labelContainer, i);
      else
        rowNode.render(databody, labelContainer);

      oldRowIdRowNodeMap[rowNode.getId()] = rowNode;
      top = top + rowNode.getRowHeight() + horizontalLineHeightOffset;
    }
    top = top - horizontalLineHeightOffset; // last row
  }

  gantt.setOldRowIdRowNodeMap(oldRowIdRowNodeMap);
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
  var oldRowIdRowNodeMap = gantt.getOldRowIdRowNodeMap();
  var animatingDataChange = gantt.getAnimationMode() === 'dataChange';
  var newRowIdRowNodeMap = {};
  var newTaskIdInfoMap = {};
  var newRowNodes = [];
  var newRowIndices = {};
  var newRows = gantt.getRowsData();

  var taskDefaults = gantt.getOptions()['taskDefaults'];

  for (var i = 0; i < newRows.length; i++)
  {
    var newRow = newRows[i];
    var rowId = newRow['id'];
    var tasks = newRow['tasks'];

    for (var j = 0; j < tasks.length; j++)
    {
      var task = tasks[j];
      // start/end only supports number or string type, e.g. excludes Date object type
      // TODO: Remove number type support after complete deprecation in future release
      var startType = typeof task['start'];
      var endType = typeof task['end'];
      if ((task['start'] == null || startType === 'string' || startType === 'number') &&
          (task['end'] == null || endType === 'string' || endType === 'number'))
      {
        newTaskIdInfoMap[task['id']] = {'rowId': rowId, 'taskProps': dvt.JsonUtils.merge(task, taskDefaults)}; //state: same, moved, new
      }
    }

    var oldRowNodeWithId = oldRowIdRowNodeMap[rowId];
    if (oldRowNodeWithId)
    {
      oldRowNodeWithId.setProps(newRow);
      oldRowNodeWithId.hardSetRowHeight(0);
      oldRowNodeWithId.setAnimationState('same');
      newRowNodes.push(oldRowNodeWithId);
      newRowIdRowNodeMap[rowId] = oldRowNodeWithId;
      delete oldRowIdRowNodeMap[oldRowNodeWithId.getId()];
    }
    else
    {
      newRowNodes.push(0);
      newRowIndices[i] = newRow;
      newRowIdRowNodeMap[rowId] = true;
    }
  }

  var leftoverOldRowIds = Object.keys(oldRowIdRowNodeMap);
  for (var newRowIndex in newRowIndices)
  {
    if (newRowIndices.hasOwnProperty(newRowIndex))
    {
      var newRow = newRowIndices[newRowIndex];
      if (leftoverOldRowIds.length > 0)
      {
        var reusedOldRowId = leftoverOldRowIds.pop();
        var reusedOldRowNode = oldRowIdRowNodeMap[reusedOldRowId];
        reusedOldRowNode.setProps(newRow);
        reusedOldRowNode.hardSetRowHeight(0);
        reusedOldRowNode.setAnimationState('refurbished');
        reusedOldRowNode.remove();
      }
      else
      {
        reusedOldRowNode = new DvtGanttRowNode(gantt, newRow, 0);
      }
      newRowIdRowNodeMap[newRow['id']] = reusedOldRowNode;
      newRowNodes[newRowIndex] = reusedOldRowNode;
    }
  }

  for (var i = 0; i < leftoverOldRowIds.length; i++)
  {
    var rowToRemove = oldRowIdRowNodeMap[leftoverOldRowIds[i]];
    rowToRemove.setAnimationState('delete');
    rowToRemove.remove();
  }

  var movedTasks = {};
  for (var i = 0; i < oldRowNodes.length; i++)
  {
    var oldRowNode = oldRowNodes[i];
    var oldRowNodeTaskNodes = oldRowNode.getTasks();
    for (var j = 0; j < oldRowNodeTaskNodes.length; j++)
    {
      var oldTaskNode = oldRowNodeTaskNodes[j];
      oldTaskNode.resetState();
      var newTaskInfo = newTaskIdInfoMap[oldTaskNode.getId()];
      if (newTaskInfo)
      {
        if (oldRowNode.getId() == newTaskInfo['rowId'] && oldRowNode.isTaskVisible(newTaskInfo['taskProps']))
        {
          oldTaskNode.setProps(newTaskInfo['taskProps']);
          oldTaskNode.setAnimationState('same');
          delete newTaskIdInfoMap[oldTaskNode.getId()];
        }
        else
        {
          oldTaskNode.setAnimationState('moved');
          if (animatingDataChange)
            movedTasks[oldTaskNode.getId()] = oldTaskNode.getVisualState();
          if (!oldRowIdRowNodeMap[oldRowNode.getId()])
            oldRowNode.addAssignableTaskNode(oldTaskNode);
        }
      }
      else
      {
        if (!oldRowIdRowNodeMap[oldRowNode.getId()])
        {
          oldTaskNode.setAnimationState('refurbished');
          oldTaskNode.recordStateAsPrevious();
          oldRowNode.addAssignableTaskNode(oldTaskNode);
        }
      }
    }
  }

  for (var newTaskId in newTaskIdInfoMap)
  {
    if (newTaskIdInfoMap.hasOwnProperty(newTaskId))
    {
      var newTaskNodeInfo = newTaskIdInfoMap[newTaskId];
      var newTaskNodeRowId = newTaskNodeInfo['rowId'];
      var newTaskNodeProps = newTaskNodeInfo['taskProps'];
      var newTaskRowNode = newRowIdRowNodeMap[newTaskNodeRowId];

      var assignableTaskNodes = newTaskRowNode.getAssignableTaskNodes();
      if (assignableTaskNodes.length > 0)
      {
        if (newTaskRowNode.isTaskVisible(newTaskNodeProps))
        {
          var newTaskNode = assignableTaskNodes.pop();
          newTaskNode.setProps(newTaskNodeProps);
        }
      }
      else
      {
        newTaskNode = newTaskRowNode.createTaskNode(newTaskNodeProps);
        if (newTaskNode)
          newTaskRowNode.addTask(newTaskNode);
      }

      if (animatingDataChange && newTaskNode && movedTasks[newTaskId]) // task node becomes final moved task
      {
        newTaskNode.recordStateAsPrevious(movedTasks[newTaskId]);
        newTaskNode.setAnimationState('migrate');
      }
    }
  }

  for (var i = 0; i < newRows.length; i++)
  {
    var newRow = newRows[i];
    var rowId = newRow['id'];
    var rowNode = newRowIdRowNodeMap[rowId];
    var assignableTaskNodes = rowNode.getAssignableTaskNodes();
    while (assignableTaskNodes.length > 0)
    {
      var uselessTaskNode = assignableTaskNodes.pop();
      rowNode.removeTask(uselessTaskNode);
      uselessTaskNode.remove();
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

    container.addChild(deplines);
    gantt.setDependencyLines(deplines);
    gantt.setDefaultMarkerId(DvtGanttRenderer._createDefaultMarker(gantt));
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

    // create dvt.CSSStyle from from style sheet
    var labelCSSStyle = DvtGanttStyleUtils.getRowLabelStyle(this._gantt.getOptions());

    // sets the style if specified in options
    var labelStyle = row['labelStyle'];
    if (labelStyle != null)
    {
      labelCSSStyle.parseInlineStyle(labelStyle);
      // TODO: once we fully deprecate string type in 4.0.0, remove the string logic
      if (typeof labelStyle === 'string' || labelStyle instanceof String)
        dvt.ToolkitUtils.setAttrNullNS(labelText.getElem(), 'style', labelStyle);
      else
        labelText.setStyle(labelStyle); // works if style is object
    }

    labelText.setCSSStyle(labelCSSStyle); // necessary for getDimension/fitText to obtain CSS style of the text

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
  this._assignableTaskNode = [];
  this._animationState = 'new';
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
 * Retrieve the initial index of the row.
 * @return {number} the initial index of the row.
 */
DvtGanttRowNode.prototype.getIndex = function()
{
  return this._index;
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
 * Retrieve the label of the row
 * @return {string} the label of the row
 */
DvtGanttRowNode.prototype.getLabel = function()
{
  return this._props['label'];
};

/**
 * Retrieve the label position of the row
 * @return {string} the label position of the row.  Valid values are 'start' and 'end'.
 */
DvtGanttRowNode.prototype.getLabelPosition = function()
{
  return this._props['labelPosition'];
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
 * Adds task to reusable task node list
 * @param {DvtGanttTaskNode} taskNode
 */
DvtGanttRowNode.prototype.addAssignableTaskNode = function(taskNode)
{
  this._assignableTaskNode.push(taskNode);
};

/**
 * Gets reusable task nodes list
 * @return {DvtGanttTaskNode[]}
 */
DvtGanttRowNode.prototype.getAssignableTaskNodes = function()
{
  return this._assignableTaskNode;
};

/**
 * Determine whether task is visible, and also merge task properties with default properties.
 * @param {object} taskProps task properties
 * @return {boolean} whether the task start and end times are within the viewport of interest
 */
DvtGanttRowNode.prototype.isTaskVisible = function(taskProps)
{
  var start = this._gantt.getStartTime();
  var end = this._gantt.getEndTime();
  taskProps['start'] = this._getDate(taskProps['start']);
  taskProps['end'] = this._getDate(taskProps['end']);

  if (taskProps['start'] == null && taskProps['end'] == null)
    return false;

  // only return an object if at least part of the event is visible
  if (taskProps['start'] && taskProps['end'])
  {
    var checkTime = taskProps['end'] ? taskProps['end'] : taskProps['start'];
    if (checkTime < start || taskProps['start'] > end)
      return false;
  }
  return true;
};

/**
 * Creates DvtGanttTaskNode from given task properties.
 * @param {object} taskProps The task properties.
 * @return {DvtGanttTaskNode} return node if at least part of the event is visible, null otherwise
 */
DvtGanttRowNode.prototype.createTaskNode = function(taskProps)
{
  if (this.isTaskVisible(taskProps))
    return new DvtGanttTaskNode(this._gantt, this, taskProps);
  return null;
};

/**
 * Retrieve tasks of the row
 * @return {Array} an array of DvtGanttTaskNode each representing a task bar.
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
      // start/end only supports number or string type, e.g. excludes Date object type
      // TODO: Remove number type support after complete deprecation in future release
      var startType = typeof task['start'];
      var endType = typeof task['end'];
      if ((task['start'] == null || startType === 'string' || startType === 'number') &&
          (task['end'] == null || endType === 'string' || endType === 'number'))
      {
        task = dvt.JsonUtils.merge(task, this._gantt.getOptions()['taskDefaults']);
        var node = this.createTaskNode(task);
        if (node)
          this._tasks.push(node);
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
    // delete this._tasks[this._tasks[taskNodeIndex]];
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
      var dateA = a.getStartTime() ? a.getStartTime() : a.getEndTime();
      var dateB = b.getStartTime() ? b.getStartTime() : b.getEndTime();
      return dateA - dateB;
    });
  }
};

/**
 * Renders the row to specified container. The row node is added to the container child list
 * at the specified index. If not specified, row node is simply appened to the end of the child list.
 * @param {dvt.Container} container the container to host artifacts of the row including task bars.
 * @param {dvt.Container=} labelContainer The container to render row labels into.
 * @param {number=} index The index of the container child list to add to.
 */
DvtGanttRowNode.prototype.render = function(container, labelContainer, index)
{
  this.sortTasks();
  var tasks = this.getTasks();
  if (tasks != null)
  {
    var rowHeightLevelRecentTasks = [];

    // determine task top before rendering based on whether it overlaps with other tasks
    // if n tasks:
    //    best case: no tasks in the row overlap --> O(n)
    //    worst case: all tasks in the row overlap --> O(n^2)
    //    General: O(cn) where c is maximum # of tasks taking up the row height vertically. In most cases, c is constant, or essentially constant for c << n.
    for (var i = 0; i < tasks.length; i++)
    {
      var y = 0, task = tasks[i], numRowHeightLevels = rowHeightLevelRecentTasks.length, previousAdjacentTask = null;
      if (numRowHeightLevels === 0)
        rowHeightLevelRecentTasks.push(task);
      else
      {
        var promote = true;
        for (var j = 0; j < numRowHeightLevels; j++)
        {
          var mostRecentHeightLevelTask = rowHeightLevelRecentTasks[j];
          if (DvtGanttTaskNode.isOverlapping(mostRecentHeightLevelTask, task))
            y += mostRecentHeightLevelTask.getHeightWithPadding();
          else
          {
            previousAdjacentTask = rowHeightLevelRecentTasks[j];
            rowHeightLevelRecentTasks[j] = task;
            promote = false;
            break;
          }
        }
        if (promote)
          rowHeightLevelRecentTasks.push(task);
      }
      task.setTop(y);
      task.render(this, previousAdjacentTask);
    }
  }

  this._renderRowLabel(this._gantt, this.getRowLabelText(), labelContainer);

  if (this.getParent() != container)
  {
    if (index != null)
      container.addChildAt(this, index);
    else
      container.addChild(this);
  }

  this._renderHorizontalGridline(this._gantt, this, this);
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
  if (gantt.isRowAxisEnabled() && labelContainer)
  {
    var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
    // right aligned in LTR. left aligned in RTL:
    if (!isRTL)
      labelText.alignRight();

    if (labelText.isTruncated())
      labelText.setTextString(labelText.getUntruncatedTextString());
    var isTextVisible = dvt.TextUtils.fitText(labelText, gantt._rowAxisPreferredWidth, this.getRowHeight(), labelContainer, 1);

    var labelGuessedDimensions = dvt.TextUtils.guessTextDimensions(labelText);
    var y = ((this.getTop() + (this.getTop() + this.getRowHeight())) - labelGuessedDimensions.h) / 2;
    if (!isRTL)
      var x = gantt._rowAxisPreferredWidth;
    else
      x = 0;

    var labelStateObj = {
      'textString': labelText.getTextString(),
      'x': x,
      'y': y
    };

    if (labelText.getTextString().length > 0 && isTextVisible) // don't bother with empty string labels or labels that can't fit in the axis space
    {
      gantt.getEventManager().associate(labelText, labelText);
      labelText.setRow(this);
      labelContainer.addChild(labelText);

      if (gantt.getAnimationMode() === 'dataChange')
      {
        if (this.getAnimationState() === 'new' || this.getAnimationState() === 'refurbished')
        {
          // fade in labels
          gantt.addRowsFrAnimElems.push(labelText);
          labelText.setY(y);
          labelText.setX(x);
        }
        else if (this.getAnimationState() === 'same')
        {
          // set labels according to row position (current implementation, labels are new and have no knowledge of previous positions)
          var previousLabelState = this.getLabelState();
          labelText.setY(previousLabelState['y']);
          labelText.setX(previousLabelState['x']);

          // translate labels to new positions
          var shiftAnimator = gantt.mvGeneralMvPlayable.getAnimator();
          shiftAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getX, labelText.setX, x);
          shiftAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getY, labelText.setY, y);
        }
        else
        {
          labelText.setY(y);
          labelText.setX(x);
        }
      }
      else
      {
        labelText.setY(y);
        labelText.setX(x);
      }
    }

    this.recordLabelState(labelStateObj);
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
  if (gantt.isHorizontalGridlinesVisible())
  {
    if (!this._horizontalLine)
    {
      var gridlineStyleClass = gantt.GetStyleClass('hgridline');
      var horizontalLineWidth = DvtGanttStyleUtils.getHorizontalGridlineWidth(gantt.getOptions());
      // due to pixel hinting, odd value stroke width needs it's position to be offset by 0.5 to ensure consistent behavior across browsers
      // e.g. stroke-width of 1px means 0.5px above and below the reference coordinate. With pixel hinting, some browsers
      // renders 1px above the reference, some renders 1px below the reference. If we offset the reference by 0.5px, the stroke location
      // becomes unambiguous (it'll lock onto whole pixel grid) so all browsers will render this consistently.
      var posOffset = (horizontalLineWidth % 2) * 0.5;
      var pos = row.getTop() + row.getRowHeight() + posOffset;
      var line = new dvt.Line(gantt.getCtx(), 0, pos, gantt.getContentLength(), pos);
      line.setPixelHinting(true);
      line.setClassName(gridlineStyleClass, true);

      container.addChild(line);
      this._horizontalLine = line;

      if (gantt.getAnimationMode() === 'dataChange' && this.getAnimationState() === 'new')
        gantt.addRowsFrAnimElems.push(this._horizontalLine); // fade in lines
    }
    else // update existing horizontal gridlines
    {
      var newY = this.getTop() + this.getRowHeight();
      this._horizontalLine.setX2(gantt.getContentLength());

      var rowAnimationState = this.getAnimationState();
      if (gantt.getAnimationMode() === 'dataChange')
      {
        if (rowAnimationState === 'refurbished')
        {
          // fade in lines
          gantt.addRowsFrAnimElems.push(this._horizontalLine);
          this._horizontalLine.setY1(newY);
          this._horizontalLine.setY2(newY);
        }
        else if (rowAnimationState === 'same')
        {
          // translate lines
          var shiftAnimator = gantt.mvGeneralMvPlayable.getAnimator();
          shiftAnimator.addProp(dvt.Animator.TYPE_NUMBER, this._horizontalLine, this._horizontalLine.getY1, this._horizontalLine.setY1, newY);
          shiftAnimator.addProp(dvt.Animator.TYPE_NUMBER, this._horizontalLine, this._horizontalLine.getY2, this._horizontalLine.setY2, newY);
        }
        else
        {
          this._horizontalLine.setY1(newY);
          this._horizontalLine.setY2(newY);
        }
      }
      else
      {
        this._horizontalLine.setY1(newY);
        this._horizontalLine.setY2(newY);
      }
    }
  }
};

/**
 * Sets the animation state of the row
 * @param {string} animationState The new animationState
 */
DvtGanttRowNode.prototype.setAnimationState = function(animationState)
{
  this._animationState = animationState;
};

/**
 * Gets the animation state
 * @return {string} the animation state
 */
DvtGanttRowNode.prototype.getAnimationState = function()
{
  return this._animationState;
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
  if (this._gantt.getAnimationMode() === 'dataChange')
  {
    if (this._animationState === 'refurbished')
      this._gantt.removeRowsFakeRmAnimElems.push(this); // fade out (DONT REMOVE ON ANIMATION END)
    else if (this._animationState === 'delete')
      this._gantt.removeRowsRmAnimElems.push(this); // fade out (remove on animation end)
    else
    {
      if (this.getParent())
        this.getParent().removeChild(this);
    }
  }
  else
    this.getParent().removeChild(this);

  this._removeRowLabel();
};

/**
 * Removes the row label.
 * @private
 */
DvtGanttRowNode.prototype._removeRowLabel = function()
{
  var rowLabelText = this.getRowLabelText();
  if (rowLabelText)
  {
    if (this._gantt.getAnimationMode() === 'dataChange')
    {
      if (this._animationState === 'refurbished')
        this._gantt.removeRowsFakeRmAnimElems.push(rowLabelText); // fade out (DONT REMOVE ON ANIMATION END)
      else if (this._animationState === 'delete')
        this._gantt.removeRowsRmAnimElems.push(rowLabelText); // fade out (remove on animation end)
      else
      {
        if (rowLabelText.getParent())
          rowLabelText.getParent().removeChild(rowLabelText);
      }
    }
    else
    {
      if (rowLabelText.getParent())
        rowLabelText.getParent().removeChild(rowLabelText);
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
  if (rowHeight > this._rowHeight)
    this._rowHeight = rowHeight;
};

/**
 * Hard sets the row height regardless of current row height.
 * @param {number} rowHeight The row height.
 */
DvtGanttRowNode.prototype.hardSetRowHeight = function(rowHeight)
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
    return (new Date(date)).getTime() + 0 * 60 * 60 * 1000;
};
/**
 * Class representing a GanttTask node.
 * @param {dvt.Gantt} gantt The gantt component
 * @param {DvtGanttRow} row The row.
 * @param {object} props The properties for the node.
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
 * Space around hover or selected task
 * @type {number}
 */
DvtGanttTaskNode.EFFECT_MARGIN = 2;
/**
 * opacity for dimmed task bar
 * @type {number}
 */
DvtGanttTaskNode.DIM_OPACITY = 0.35;

/**
 * @param {dvt.Gantt} gantt The gantt component
 * @param {DvtGanttRow} row The row.
 * @param {object} props The properties for the node.
 * @protected
 */
DvtGanttTaskNode.prototype.Init = function(gantt, row, props)
{
  DvtGanttTaskNode.superclass.Init.call(this, gantt.getCtx(), null, props['id']);

  this._gantt = gantt;
  this._row = row;
  this._props = props;
  this._eventManagerAssociated = false;
  this._animationState = 'new';
};

/**
 * Resets state to pristine.
 */
DvtGanttTaskNode.prototype.resetState = function()
{
  if (this.isSelected())
    this.setSelected(false);
  this.setAnimationState('new');
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
 * Retrieve the id of the task.
 * @return {object} the id of the task
 */
DvtGanttTaskNode.prototype.getId = function()
{
  return this._props['id'];
};

/**
 * Retrieve the start time of the task
 * @return {number} the start time of the task in milliseconds
 */
DvtGanttTaskNode.prototype.getStartTime = function()
{
  return this._props['start'];
};

/**
 * Retrieve the end time of the task
 * @return {number} the end time of the task in milliseconds
 */
DvtGanttTaskNode.prototype.getEndTime = function()
{
  return this._props['end'];
};

/**
 * Retrieve the shortDesc of the task
 * @return {string} the shortDesc of the task
 */
DvtGanttTaskNode.prototype.getShortDesc = function()
{
  return this._props['shortDesc'];
};

/**
 * Retrieve the label of the task
 * @return {string} the label of the task
 */
DvtGanttTaskNode.prototype.getLabel = function()
{
  return this._props['label'];
};

/**
 * Retrieve the label position of the task
 * @return {string} the label position of the task
 */
DvtGanttTaskNode.prototype.getLabelPosition = function()
{
  return this._get('labelPosition');
};

/**
 * Gets the label style.
 * @return {string|object} The CSS style
 */
DvtGanttTaskNode.prototype.getLabelStyle = function()
{
  return this._get('labelStyle');
};

/**
 * Retrieve the border radius of the task
 * @return {string} the border radius the task
 */
DvtGanttTaskNode.prototype.getBorderRadius = function()
{
  return this._get('borderRadius');
};

/**
 * Retrieve the height of the task
 * @return {number} the height of the task
 */
DvtGanttTaskNode.prototype.getHeight = function()
{
  return this._get('height');
};

/**
 * Retrieve the minimum width of the task
 * @return {number} the minimum width of the task
 */
DvtGanttTaskNode.prototype.getMinimumWidth = function()
{
  return this._get('minWidth');
};

/**
 * Retrieve the height of the task with padding included
 * @return {number} the height of the task with padding included
 */
DvtGanttTaskNode.prototype.getHeightWithPadding = function()
{
  return this.getHeight() + DvtGanttStyleUtils.getTaskbarPadding() * 2;
};

/**
 * Retrieve the style of the task
 * @return {string|object} the style of the task
 */
DvtGanttTaskNode.prototype.getSvgStyle = function()
{
  // TODO: Once we finish deprecating 'style' in 4.0.0 just retrieve 'svgStyle'
  return this._get('svgStyle') ? this._get('svgStyle') : this._get('style');
};

/**
 * Retrieve the class name of the task
 * @return {string} the class name of the task
 */
DvtGanttTaskNode.prototype.getSvgClassName = function()
{
  // TODO: Once we finish deprecating 'className' in 4.0.0 just retrieve 'svgClassName'
  return this._get('svgClassName') ? this._get('svgClassName') : this._get('className');
};

/**
 * Sets the width of the task
 * @param {number} width the width of the task
 */
DvtGanttTaskNode.prototype.setWidth = function(width)
{
  this._width = width;
};

/**
 * Gets the width of the task
 * @return {number} the width of the task
 */
DvtGanttTaskNode.prototype.getWidth = function()
{
  return this._width;
};

/**
 * Gets the calculated translateX of the task
 * This value is derived from data, and is animation independent
 * @return {number} the calculated translateX of the task
 */
DvtGanttTaskNode.prototype.getCalculatedTranslateX = function()
{
  return this._translateX;
};

/**
 * Sets the calculated translateX of the task
 * The value should be derived from data, and is animation independent
 * @param {number} x the calculated translateX of the task
 */
DvtGanttTaskNode.prototype.setCalculatedTranslateX = function(x)
{
  this._translateX = x;
};

/**
 * Gets the calculated translateY of the task
 * This value is derived from data, and is animation independent
 * @return {number} the calculated translateY of the task
 */
DvtGanttTaskNode.prototype.getCalculatedTranslateY = function()
{
  return this._translateY;
};

/**
 * Sets the calculated translateY of the task
 * The value should be derived from data, and is animation independent
 * @param {number} y the calculated translateY of the task
 */
DvtGanttTaskNode.prototype.setCalculatedTranslateY = function(y)
{
  this._translateY = y;
};

/**
 * Gets the top of the task
 * @return {number} the top of the task
 */
DvtGanttTaskNode.prototype.getTop = function()
{
  return this._top;
};

/**
 * Sets the top of the task
 * @param {number} top the top of the task
 */
DvtGanttTaskNode.prototype.setTop = function(top)
{
  this._top = top;
};

/**
 * Sets the task bar element
 * @param {dvt.Rect} bar the task bar element
 */
DvtGanttTaskNode.prototype.setBar = function(bar)
{
  this._bar = bar;
};

/**
 * Gets the task bar element
 * @return {dvt.Rect} the task bar element
 */
DvtGanttTaskNode.prototype.getBar = function()
{
  return this._bar;
};

/**
 * Gets the bar width.
 * @return {number} the bar width.
 */
DvtGanttTaskNode.prototype.getBarWidth = function()
{
  return this._bar.getWidth();
};

/**
 * Gets the bar height.
 * @return {number} the bar height.
 */
DvtGanttTaskNode.prototype.getBarHeight = function()
{
  return this._bar.getHeight();
};

/**
 * Sets the bar width.
 * @param {number} width The new width.
 */
DvtGanttTaskNode.prototype.setBarWidth = function(width)
{
  this._bar.setWidth(width);
  if (this._select)
    this._select.setWidth(width + DvtGanttTaskNode.EFFECT_MARGIN * 2);
  if (this._ring)
    this._ring.setWidth(width + DvtGanttTaskNode.EFFECT_MARGIN * 2);
};

/**
 * Sets the bar height.
 * @param {number} height The new height.
 */
DvtGanttTaskNode.prototype.setBarHeight = function(height)
{
  this._bar.setHeight(height);
  if (this._select)
    this._select.setHeight(height + DvtGanttTaskNode.EFFECT_MARGIN * 2);
  if (this._ring)
    this._ring.setHeight(height + DvtGanttTaskNode.EFFECT_MARGIN * 2);
};

/**
 * Gets the fill color of the task bar.
 * @return {string} the fill color css string.
 */
DvtGanttTaskNode.prototype.getFillColor = function()
{
  if (this._fillColor == null)
    this._fillColor = DvtGanttTaskNode._getFillColor(this._gantt, this._bar);

  return this._fillColor;
};

/**
 * Sets the label text element
 * @param {dvt.OutputText} labelText the label text element
 */
DvtGanttTaskNode.prototype.setLabelText = function(labelText)
{
  this._labelText = labelText;
};

/**
 * Gets the label text element
 * @return {dvt.OutputText} the label text element
 */
DvtGanttTaskNode.prototype.getLabelText = function()
{
  return this._labelText;
};

/**
 * Sets the animation state.
 * @param {string} animationState The new animation state.
 */
DvtGanttTaskNode.prototype.setAnimationState = function(animationState)
{
  this._animationState = animationState;
};

/**
 * Gets the animation state.
 * @return {string} the animation state.
 */
DvtGanttTaskNode.prototype.getAnimationState = function()
{
  return this._animationState;
};

/**
 * Retrieves property value from task properties.
 * @param {string} key The property key.
 * @return {object} The property value.
 * @private
 */
DvtGanttTaskNode.prototype._get = function(key)
{
  return this._props[key];
};

/**
 * Removes itself
 */
DvtGanttTaskNode.prototype.remove = function()
{
  if (this._gantt.getAnimationMode() === 'dataChange' && this._animationState !== 'moved') // perform remove animation then remove
  {
    this.setAnimationState('delete'); // mark as delete forever (as opposed to refurbished)
    this._gantt.rmAnimElems.push(this);
  }
  else // remove immediately (if 'moved', or not animating)
  {
    if (this._row)
      this._row.removeChild(this);
  }
};

/**
 * Renders the task bar and associated label
 * @param {dvt.Container} container the container to render the task in.
 * @param {dvt.GanttTaskNode=} previousAdjacentTask The adjacent task chronologically before and on the same row height level.
 */
DvtGanttTaskNode.prototype.render = function(container, previousAdjacentTask)
{
  if (this.getParent() != container)
    container.addChild(this);

  // clear predecessors and successors info
  this._predecessors = null;
  this._successors = null;

  this.setAriaRole('img');
  if (dvt.TimeAxis.supportsTouch())
    this.refreshAriaLabel();

  if (this._gantt.getAnimationMode() === 'dataChange')
  {
    if (this._animationState === 'refurbished')
      this._gantt.rmAnimElems.push(this);
    if (this._animationState === 'new' || this._animationState === 'refurbished')
    {
      this._gantt.frAnimElems.push(this);
    }
  }

  DvtGanttTaskNode._renderBar(this._gantt, this);
  DvtGanttTaskNode._renderLabel(this._gantt, this, previousAdjacentTask);

  if (!this._eventManagerAssociated)
  {
    this._gantt.getEventManager().associate(this, this);
    this._eventManagerAssociated = true;
  }

  if (this._gantt.getAnimationMode() === 'dataChange')
  {
    if (this._animationState === 'refurbished')
      this.recordStateAsCurrent();
    else if (this._animationState === 'migrate')
    {
      this.recordStateAsCurrent();
      this.applyPreviousState();
      // var bar = this.getBar();

      var moveTaskDurationAnimator = this._gantt.moveTaskDurationPlayable.getAnimator();
      var interRowMvAnimator = this._gantt.interRowMvPlayable.getAnimator();

      moveTaskDurationAnimator.addProp(dvt.Animator.TYPE_NUMBER, this, this.getBarWidth, this.setBarWidth, this._currentVisualState['bar']['width']);
      moveTaskDurationAnimator.addProp(dvt.Animator.TYPE_NUMBER, this, this.getBarHeight, this.setBarHeight, this._currentVisualState['bar']['height']);
      interRowMvAnimator.addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateX, this.setTranslateX, this._currentVisualState['task']['translateX']);
      interRowMvAnimator.addProp(dvt.Animator.TYPE_NUMBER, this, this.getTranslateY, this.setTranslateY, this._currentVisualState['task']['translateY']);

      var labelText = this.getLabelText();
      if (labelText != null)
      {
        moveTaskDurationAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getX, labelText.setX, this._currentVisualState['label']['x']);
        moveTaskDurationAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getY, labelText.setY, this._currentVisualState['label']['y']);
      }

      dvt.Playable.appendOnEnd(moveTaskDurationAnimator, function() {
        this.applyCurrentState();
      }, this);
    }
  }
};

/**
 * Gets the visual state of the task
 * @return {object} The object containing visual state information of the task
 */
DvtGanttTaskNode.prototype.getVisualState = function()
{
  var bar = this.getBar();
  var labelText = this.getLabelText();
  var stateObj = {
    'task': {
      'width': this.getWidth(),
      'top': this.getTop(),
      'translateX': this.getTranslateX(),
      'translateY': this.getTranslateY()
    },
    'bar': {
      'width': bar.getWidth(),
      'height': bar.getHeight()
    }
  };
  if (labelText != null)
  {
    stateObj['label'] = {
      'textString': labelText.getTextString(),
      'x': labelText.getX(),
      'y': labelText.getY()
    };
  }
  return stateObj;
};

/**
 * Applies visual state on the task
 * @param {object} stateObj The object containing visual information.
 */
DvtGanttTaskNode.prototype.applyVisualState = function(stateObj)
{
  var bar = this.getBar();
  var labelText = this.getLabelText();

  // task
  var taskState = stateObj['task'];
  this.setWidth(taskState['width']);
  this.setTop(taskState['top']);
  this.setTranslateX(taskState['translateX']);
  this.setTranslateY(taskState['translateY']);

  // bar
  var barState = stateObj['bar'];
  bar.setWidth(barState['width']);
  bar.setHeight(barState['height']);

  // label
  if (labelText != null)
  {
    var labelState = stateObj['label'];
    labelText.setTextString(labelState['textString']);
    labelText.setX(labelState['x']);
    labelText.setY(labelState['y']);
  }
};

/**
 * Records visual state as previous.
 * @param {object=} stateObj Optional object to record. Otherwise current state used.
 */
DvtGanttTaskNode.prototype.recordStateAsPrevious = function(stateObj)
{
  if (stateObj)
    this._previousVisualState = stateObj;
  else
    this._previousVisualState = this.getVisualState();
};

/**
 * Applies previous visual state.
 */
DvtGanttTaskNode.prototype.applyPreviousState = function()
{
  this.applyVisualState(this._previousVisualState);
};

/**
 * Gets previous visual state object.
 * @return {object} visual state object.
 */
DvtGanttTaskNode.prototype.getPreviousVisualState = function()
{
  return this._previousVisualState;
};

/**
 * Records visual state as current.
 * @param {object=} stateObj Optional object to record. Otherwise current state used.
 */
DvtGanttTaskNode.prototype.recordStateAsCurrent = function(stateObj)
{
  if (stateObj)
    this._currentVisualState = stateObj;
  else
    this._currentVisualState = this.getVisualState();
};

/**
 * Applies current visual state.
 */
DvtGanttTaskNode.prototype.applyCurrentState = function()
{
  this.applyVisualState(this._currentVisualState);
};

/**
 * Gets current visual state object.
 * @return {object} current visual state object.
 */
DvtGanttTaskNode.prototype.getCurrentVisualState = function()
{
  return this._currentVisualState;
};

/**
 * Determine whether two tasks are overlapping.
 * @param {DvtGanttTaskNode} task1
 * @param {DvtGanttTaskNode} task2
 * @return {boolean} whether the two tasks overlap
 */
DvtGanttTaskNode.isOverlapping = function(task1, task2)
{
  var task1StartTime = task1.getStartTime();
  var task1EndTime = task1.getEndTime();

  if (task1StartTime == null)
    task1StartTime = task1EndTime;
  else if (task1EndTime == null)
    task1EndTime = task1StartTime;

  var task2StartTime = task2.getStartTime();
  var task2EndTime = task2.getEndTime();

  if (task2StartTime == null)
    task2StartTime = task2EndTime;
  else if (task2EndTime == null)
    task2EndTime = task2StartTime;

  // Decision now is if task1 ends at the same time task2 starts, they are still not overlapping.
  // If we decide that they should be considered overlapping, change the < to <=
  return task1StartTime < task2EndTime && task2StartTime < task1EndTime;
};

/**
 * Calculate the start and end position in pixels of a task
 * @param {dvt.Gantt} gantt The gantt.
 * @param {DvtGanttTaskNode} task
 * @param {boolean} isRTL whether reading direction is RTL.
 * @return {object} the positions
 * @private
 */
DvtGanttTaskNode._getTaskPosition = function(gantt, task, isRTL)
{
  var minTime = gantt.getStartTime();
  var maxTime = gantt.getEndTime();
  var width = gantt.getContentLength();

  var startTime = task.getStartTime();
  var endTime = task.getEndTime();

  // in getTasks method we've already ensure at least one of them is non-null
  if (startTime == null)
    startTime = endTime;
  else if (endTime == null)
    endTime = startTime;

  var startPos = dvt.TimeAxis.getDatePosition(minTime, maxTime, startTime, width);
  var endPos = dvt.TimeAxis.getDatePosition(minTime, maxTime, endTime, width);

  if (isRTL)
  {
    startPos = width - startPos;
    endPos = width - endPos;
  }

  return {startPos: startPos, endPos: endPos};
};

/**
 * Renders the task bar
 * @param {dvt.Gantt} gantt The gantt.
 * @param {DvtGanttTaskNode} task The task.
 * @private
 */
DvtGanttTaskNode._renderBar = function(gantt, task)
{
  var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
  var position = DvtGanttTaskNode._getTaskPosition(gantt, task, isRTL);
  var startPos = position.startPos;
  var endPos = position.endPos;
  var y = task.getTop();
  var w = Math.max(0, Math.abs(endPos - startPos)); // abs takes care of RTL case too

  var bar = task.getBar();
  if (bar) // update the existing bar rather than rerender from scratch
  {
    if (gantt.getAnimationMode() === 'dataChange')
    {
      if (task._animationState !== 'same')
        task.setBarWidth(w);
    }
    else
      task.setBarWidth(w);
  }
  else // render bar from scratch
  {
    var context = gantt.getCtx();
    var borderRadius = task.getBorderRadius();

    if (gantt.getAnimationMode() === 'onDisplay')
    {
      bar = new DvtPathRect(context, 0, DvtGanttStyleUtils.getTaskbarPadding(), 0, task.getHeight(), borderRadius);
      gantt.IRPlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, task, task.getBarWidth, task.setBarWidth, w);
    }
    else
      bar = new DvtPathRect(context, 0, DvtGanttStyleUtils.getTaskbarPadding(), w, task.getHeight(), borderRadius);

    var inlineStyle = task.getSvgStyle();
    if (inlineStyle)
    {
      // TODO: once we fully deprecate string type in 4.0.0, remove the string logic
      if (typeof inlineStyle === 'string' || inlineStyle instanceof String)
        dvt.ToolkitUtils.setAttrNullNS(bar.getElem(), 'style', inlineStyle);
      else
        bar.setStyle(inlineStyle); // works if style is object
    }

    var defaultStyleClass = gantt.GetStyleClass('task');
    var styleClass = task.getSvgClassName();
    if (styleClass)
      styleClass = defaultStyleClass + ' ' + styleClass;
    else
      styleClass = defaultStyleClass;

    bar.setClassName(styleClass);


    task.addChild(bar);
    task._bar = bar;
  }

  var row = task.getRow();
  row.setRowHeight(y + task.getHeightWithPadding());

  task.setWidth(w);

  if (gantt.getAnimationMode() === 'dataChange')
  {
    if (task._animationState === 'same')
    {
      var intraRowMvAnimator = gantt.intraRowMvPlayable.getAnimator();
      intraRowMvAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getTranslateX, task.setTranslateX, startPos);
      intraRowMvAnimator.addProp(dvt.Animator.TYPE_NUMBER, task, task.getTranslateY, task.setTranslateY, row.getTop() + y);
      gantt.sameTaskDurationPlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, task, task.getBarWidth, task.setBarWidth, w);
    }
    else if (task._animationState === 'new' || task._animationState === 'refurbished')
    {
      task.setTranslateX(startPos);
      task.setTranslateY(row.getTop() + y);
      task.setBarWidth(0);
      gantt.newTaskDurationPlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, task, task.getBarWidth, task.setBarWidth, w);
    }
    else
    {
      task.setTranslateX(startPos);
      task.setTranslateY(row.getTop() + y);
    }
  }
  else
  {
    task.setTranslateX(startPos);
    task.setTranslateY(row.getTop() + y);
  }

  task.setCalculatedTranslateX(startPos);
  task.setCalculatedTranslateY(row.getTop() + y);
};

/**
 * Renders the label
 * @param {dvt.Gantt} gantt The gantt
 * @param {DvtGanttTaskNode} task The task node
 * @param {DvtGanttTaskNode=} previousAdjacentTask The chronologically previous task that's adjacent to current task in space.
 * @private
 */
DvtGanttTaskNode._renderLabel = function(gantt, task, previousAdjacentTask)
{
  var label = task.getLabel();
  var labelText = task.getLabelText();
  var pos = task.getLabelPosition();
  var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
  if (label != null && pos !== 'none')
  {
    if (labelText == null)
    {
      // labelText = new dvt.OutputText(gantt.getCtx(), label, 0, 0);
      labelText = new DvtGanttOutputText(gantt.getCtx(), label, 0, 0, gantt.htmlCanvas);
      labelText.setClassName(gantt.GetStyleClass('taskLabel'));

      task.addChild(labelText);
    }
    else
      labelText.setTextString(label);

    // Make reference point top right instead of top left in RTL mode:
    if (isRTL)
      labelText.alignRight();

    task.setLabelText(labelText);

    // create dvt.CSSStyle from from style sheet
    var labelCSSStyle = DvtGanttStyleUtils.getTaskLabelStyle(gantt.getOptions());

    // sets the style if specified in options
    var labelStyle = task.getLabelStyle();
    if (labelStyle != null)
    {
      labelCSSStyle.parseInlineStyle(labelStyle);
      // TODO: once we fully deprecate string type in 4.0.0, remove the string logic
      if (typeof labelStyle === 'string' || labelStyle instanceof String)
        dvt.ToolkitUtils.setAttrNullNS(labelText.getElem(), 'style', labelStyle);
      else
        labelText.setStyle(labelStyle); // works if style is object
    }

    labelText.setCSSStyle(labelCSSStyle); // necessary for getDimension/fitText to obtain CSS style of the text

    // truncate labels if necessary
    DvtGanttTaskNode._truncateLabel(task, previousAdjacentTask);

    var labelGuessedDimensions = dvt.TextUtils.guessTextDimensions(labelText);
    labelText.setY((task.getHeightWithPadding() - labelGuessedDimensions.h) / 2);

    // now figure out the x position. Minimize getDimension calls for better performance
    // by anchoring the text element right or left based on label position option value and reading direction
    var padding = DvtGanttStyleUtils.getTaskbarLabelPadding();
    var x;
    switch (pos)
    {
      case 'start':
        (!isRTL) ? labelText.alignRight() : labelText.alignLeft();
        x = -padding;
        break;
      case 'end':
        (!isRTL) ? labelText.alignLeft() : labelText.alignRight();
        x = task.getWidth() + padding;
        break;
      case 'innerStart':
        (!isRTL) ? labelText.alignLeft() : labelText.alignRight();
        x = padding;
        break;
      case 'innerEnd':
        var taskWidth = task.getWidth();
        if (labelGuessedDimensions.w < taskWidth)
        {
          (!isRTL) ? labelText.alignRight() : labelText.alignLeft();
          x = task.getWidth() - padding;
        }
        else
        {
          (!isRTL) ? labelText.alignLeft() : labelText.alignRight();
          var labelDim = labelText.getDimensions();
          x = Math.max(padding, taskWidth - labelDim.w - padding);
        }
        break;
      case 'innerCenter':
        var taskWidth = task.getWidth();
        if (labelGuessedDimensions.w < taskWidth)
        {
          labelText.alignCenter();
          x = task.getWidth() / 2;
        }
        else
        {
          (!isRTL) ? labelText.alignLeft() : labelText.alignRight();
          labelDim = labelText.getDimensions();
          x = Math.max(padding, (taskWidth - labelDim.w) / 2);
        }
        break;
      default:
        (!isRTL) ? labelText.alignRight() : labelText.alignLeft();
        x = -padding;
        break;
    }

    if (isRTL)
      x = -x;

    if (gantt.getAnimationMode() === 'onDisplay')
    {
      labelText.setX(0);
      gantt.IRPlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getX, labelText.setX, x);
    }
    else if (gantt.getAnimationMode() === 'dataChange')
    {
      if (task._animationState === 'same')
        gantt.sameTaskDurationPlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getX, labelText.setX, x);
      else if (task._animationState === 'new' || task._animationState === 'refurbished')
      {
        labelText.setX(0);
        gantt.newTaskDurationPlayable.getAnimator().addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getX, labelText.setX, x);
      }
      else
        labelText.setX(x);
    }
    else
    {
      labelText.setX(x);
    }
  }
  else // if label not specified or labelPosition == 'none', don't render anything. If something there before, remove it.
  {
    if (labelText != null)
      task.removeChild(labelText);
    task.setLabelText(null);
  }
};

/**
 * Truncates labels if blocked.
 * @param {DvtGanttTaskNode} currentTask The current task node being rendered
 * @param {DvtGanttTaskNode=} previousAdjacentTask The chronologically previous task that's adjacent to current task in space.
 * @private
 */
DvtGanttTaskNode._truncateLabel = function(currentTask, previousAdjacentTask)
{
  // Note that steps in calculating distanceFromBarrier are calculated with LTR coordinates; the result should be the same in RTL anyway

  var currentLabelPos = currentTask.getLabelPosition();
  var currentLabelText = currentTask.getLabelText();

  if (currentLabelText.isTruncated())
    currentLabelText.setTextString(currentLabelText.getUntruncatedTextString());

  var padding = DvtGanttStyleUtils.getTaskbarLabelPadding();

  // truncate text if neccessary when inside task bar:
  if (currentLabelPos == 'innerStart' || currentLabelPos == 'innerEnd' || currentLabelPos == 'innerCenter')
  {
    dvt.TextUtils.fitText(currentLabelText, currentTask.getWidth() - padding, currentTask.getHeight(), currentTask, 1);

    var labelColor = dvt.ColorUtils.getContrastingTextColor(currentTask.getFillColor());
    if (labelColor != null)
      currentLabelText.setFill(new dvt.SolidFill(labelColor));
  }
  else // truncate text if necessary when outside task bar:
  {
    var gantt = currentTask.getGantt();
    var minTime = gantt.getStartTime();
    var maxTime = gantt.getEndTime();
    var width = gantt.getContentLength();

    var currentPosition = DvtGanttTaskNode._getTaskPosition(gantt, currentTask, false);

    if (previousAdjacentTask)
    {
      var previousLabelPos = previousAdjacentTask.getLabelPosition();
      var previousLabelText = previousAdjacentTask.getLabelText();
      var previousPosition = DvtGanttTaskNode._getTaskPosition(gantt, previousAdjacentTask, false);

      if (previousLabelPos == 'end' && previousLabelText.isTruncated())
        previousLabelText.setTextString(previousLabelText.getUntruncatedTextString());
    }

    if (currentLabelPos == 'start')
    {
      var barrierPosition = dvt.TimeAxis.getDatePosition(minTime, maxTime, minTime, width) + padding;
      if (previousAdjacentTask)
      {
        if (previousLabelPos == 'end')
          barrierPosition = ((currentPosition.startPos - padding) - (previousPosition.endPos + padding)) / 2 + padding;
        else
          barrierPosition = previousPosition.endPos + padding;
      }
      var distanceFromBarrier = (currentPosition.startPos - padding) - barrierPosition;
    }
    else if (currentLabelPos == 'end')
    {
      barrierPosition = dvt.TimeAxis.getDatePosition(minTime, maxTime, maxTime, width) - padding;
      distanceFromBarrier = barrierPosition - (currentPosition.endPos + padding);
    }

    var isTextVisible = dvt.TextUtils.fitText(currentLabelText, distanceFromBarrier, currentTask.getHeight(), currentTask, 1);

    // truncate previous adjacent task's label if the newly added current task blocks it somehow:
    if (previousAdjacentTask && previousLabelPos == 'end')
    {
      if (currentLabelPos == 'start')
        barrierPosition = ((currentPosition.startPos - padding) - (previousPosition.endPos + padding)) / 2 - padding;
      else
        barrierPosition = currentPosition.startPos - padding;
      distanceFromBarrier = barrierPosition - (previousPosition.endPos + padding);

      isTextVisible = dvt.TextUtils.fitText(previousLabelText, distanceFromBarrier, previousAdjacentTask.getHeight(), previousAdjacentTask, 1);
      if (isTextVisible && previousAdjacentTask.getAnimationState() === 'migrate') // update animation related states
      {
        var stateObj = previousAdjacentTask.getCurrentVisualState();
        stateObj['label']['textString'] = previousLabelText.getTextString();
        previousAdjacentTask.recordStateAsCurrent(stateObj);
      }
    }
  }
};

/**
 * Helper to find out the background color of the task bar.
 * @param {dvt.Gantt} gantt The gantt.
 * @param {DvtPathRect} bar The bar.
 * @return {string} the fill color
 * @private
 */
DvtGanttTaskNode._getFillColor = function(gantt, bar)
{
  if (bar == null)
    return null;

  // we need to figure out the fill color, which could be set in style class
  var elem = bar.getElem().cloneNode(false);
  var svgRoot = gantt.getCtx().getSvgDocument();
  svgRoot.appendChild(elem); // @HTMLUpdateOK
  try
  {
    var fill = window.getComputedStyle(elem).fill;
    if (!String.prototype.startsWith) // internet explorer 11 doesn't support startsWith() yet...
      var isUrlFill = fill.indexOf('url(') == 0;
    else
      isUrlFill = fill.startsWith('url(');

    if (!isUrlFill)
      return fill;
  }
  finally
  {
    svgRoot.removeChild(elem);
  }

  return null;
};

//---------------------------------------------------------------------//
// Selection Support: DvtSelectable impl                               //
//---------------------------------------------------------------------//
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

  this._processDefaultSelectionEffect(selected);
  this._updateAriaLabel();

  this._gantt.setCurrentRow(this.getRow().getId());
};

/**
 * Hide or show selection effect on the node
 * @param {boolean} selected true to show selected effect
 * @private
 */
DvtGanttTaskNode.prototype._processDefaultSelectionEffect = function(selected) 
{
  if (selected)
  {
    if (this._select == null)
    {
      // must be inserted before the bar
      var bar = this._createEffectArtifact('selected');
      this.addChildAt(bar, 0);
      // save it to remove later
      this._select = bar;

      // Layer this task in front of all other tasks in the row (see )
      this.getParent().addChild(this);
    }
  }
  else
  {
    if (this._select != null)
      this.removeChild(this._select);
    this._select = null;
  }
};

/**
 * Creates an outline around the bar based on the specified effect
 * @param {string} effect the effect to apply to the outline rect
 * @return {DvtPathRect} the outline rect
 * @private
 */
DvtGanttTaskNode.prototype._createEffectArtifact = function(effect)
{
  var isRTL = dvt.Agent.isRightToLeft(this._gantt.getCtx());
  var x = !isRTL ? -DvtGanttTaskNode.EFFECT_MARGIN : DvtGanttTaskNode.EFFECT_MARGIN;
  var y = DvtGanttStyleUtils.getTaskbarPadding() - DvtGanttTaskNode.EFFECT_MARGIN;
  var w = this._bar.getWidth() + DvtGanttTaskNode.EFFECT_MARGIN * 2;
  var h = this._bar.getHeight() + DvtGanttTaskNode.EFFECT_MARGIN * 2;
  var r = this.getBorderRadius();
  var bar = new DvtPathRect(this._gantt.getCtx(), x, y, w, h, r);
  bar.setClassName(this._gantt.GetStyleClass('task'));
  bar.setStyle({'fill': 'none'});
  dvt.DomUtils.addCSSClassName(bar.getElem(), this._gantt.GetStyleClass(effect));

  return bar;
};


/**
 * Show hover ring effect on task bar
 * @param {string} effectType the type of ring effect ('hover' for mouse hover, 'focus' for keyboard focus)
 * @private
 */
DvtGanttTaskNode.prototype._showHoverEffect = function(effectType)
{
  // checks if hover/focus effect is already applied
  if (this._ring != null)
    return;

  // must be inserted before the bar and after selected effect (if any)
  // easiest way to gaurantee this would be to insert immediately before bar
  var ring = this._createEffectArtifact(effectType);
  this.addChildAt(ring, this.getChildIndex(this._bar));
  // save it to remove later
  this._ring = ring;

  var color = this.getFillColor();
  if (color != null)
    ring.setStroke(dvt.SelectionEffectUtils.createSelectingStroke(color));

  // Layer this task in front of all other tasks in the row (see )
  this.getParent().addChild(this);

  // dim all other task bars
  if (this._gantt.getHoverBehavior() == 'dim')
    this._gantt.setTaskbarBrightness(this, true);
};

/**
 * Show hover effect on task bar
 * @override
 */
DvtGanttTaskNode.prototype.showHoverEffect = function() 
{
  this._showHoverEffect('hover');
};

/**
 * Hide hover effect on task bar
 * @override
 */
DvtGanttTaskNode.prototype.hideHoverEffect = function() 
{
  if (this._ring != null)
  {
    this.removeChild(this._ring);
    this._ring = null;

    // Layer this task behind all other tasks in the row
    // to ensure selected tasks are in front (see )
    if (!this.isSelected())
      this.getParent().addChildAt(this, 0);
  }

  // undo dim behavior
  if (this._gantt.getHoverBehavior() == 'dim')
    this._gantt.setTaskbarBrightness(null, false);
};

/**
 * Dim the task bar and related objects
 */
DvtGanttTaskNode.prototype.darken = function()
{
  if (this._bar != null)
    this._bar.setAlpha(DvtGanttTaskNode.DIM_OPACITY);

  if (this._select != null)
    this._select.setAlpha(DvtGanttTaskNode.DIM_OPACITY);
};

/**
 * Un-dim the task bar and related objects
 */
DvtGanttTaskNode.prototype.brighten = function()
{
  if (this._bar != null)
    this._bar.setAlpha(1);

  if (this._select != null)
    this._select.setAlpha(1);
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
DvtGanttTaskNode.prototype.getKeyboardBoundingBox = function(targetCoordinateSpace) 
{
  return this.getDimensions(targetCoordinateSpace);
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.getTargetElem = function() 
{
  return this._bar.getElem();
};

/**
 * @override
 */
DvtGanttTaskNode.prototype.showKeyboardFocusEffect = function() 
{
  this._isShowingKeyboardFocusEffect = true;
  this._showHoverEffect('focus');
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
