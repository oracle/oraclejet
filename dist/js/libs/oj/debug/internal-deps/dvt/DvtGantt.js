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
 * The default horizontal scrollbar style.
 * @const
 * @private
 */
DvtGanttStyleUtils._DEFAULT_HORIZONTAL_SCROLLBAR_STYLE = 'height: 3px; color: #9E9E9E; background-color: #F0F0F0';

/**
 * The default vertical scrollbar style.
 * @const
 * @private
 */
DvtGanttStyleUtils._DEFAULT_VERTICAL_SCROLLBAR_STYLE = 'width: 3px; color: #9E9E9E; background-color: #F0F0F0';

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
 * The scrollbar hitarea size.
 * @const
 * @private
 */
DvtGanttStyleUtils._SCROLLBAR_HITAREA_SIZE = dvt.Agent.isTouchDevice() ? 8 : 4;

/**
 * Gets the horizontal scrollbar style string.
 * @return {string} The scrollbar style string.
 */
DvtGanttStyleUtils.getHorizontalScrollbarStyle = function()
{
  return DvtGanttStyleUtils._DEFAULT_HORIZONTAL_SCROLLBAR_STYLE;
};

/**
 * Gets the vertical scrollbar style string.
 * @return {string} The scrollbar style string.
 */
DvtGanttStyleUtils.getVerticalScrollbarStyle = function()
{
  return DvtGanttStyleUtils._DEFAULT_VERTICAL_SCROLLBAR_STYLE;
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
 * Gets the default scrollbar hitarea size.
 * @return {number} The default scrollbar hitarea size.
 */
DvtGanttStyleUtils.getScrollbarHitAreaSize = function()
{
  return DvtGanttStyleUtils._SCROLLBAR_HITAREA_SIZE;
};

/**
 * Gets the task label style.
 * @param {object} options The object containing data and specifications for the component.
 * @return {string} The CSS label style string.
 */
DvtGanttStyleUtils.getTaskLabelStyle = function(options)
{
  var resources = options['_resources'];
  if (resources)
    return resources['taskLabelFontProp'];
  return '';
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

  this._xScrollbar = props.xScrollbar;
  this._yScrollbar = props.yScrollbar;

  this._isIRAnimationEnabled = props.isIRAnimationEnabled;
  this._isDCAnimationEnabled = props.isDCAnimationEnabled;

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
 * Event callback method.
 * @param {object} event
 * @param {object} component The component that is the source of the event, if available.
 */
dvt.Gantt.prototype.HandleEvent = function(event, component)
{
  var type = event['type'];
  if (type == dvt.SimpleScrollbarEvent.TYPE)
  {
    event = this._processScrollbarEvent(event, component);
  }

  if (event)
    this.dispatchEvent(event);
};

/**
 * Adjusts viewport based on scrollbar event.
 * @param {object} event
 * @param {object} component The component that is the source of the event, if available.
 * @private
 */
dvt.Gantt.prototype._processScrollbarEvent = function(event, component)
{
  var newMin = event.getNewMin();
  var newMax = event.getNewMax();

  if (component == this.xScrollbar)
  {
    this._viewStartTime = newMin;
    this._viewEndTime = newMax;
    var widthFactor = this.getContentLength() / (this._end - this._start);
    this.setRelativeStartPos(widthFactor * (this._start - this._viewStartTime));
    this.applyTimeZoomCanvasPosition();

    var evt = this.createViewportChangeEvent();
    this.dispatchEvent(evt);
  }

  if (component == this.yScrollbar)
  {
    this._databody.setTranslateY(newMax);
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

  this.prepareViewportLength();

  DvtGanttRenderer._renderBackground(this);
  DvtGanttRenderer._renderRowBackground(this);

  if (this.hasValidOptions())
  {
    this.renderTimeZoomCanvas(this._canvas);

    this.updateRows();

    var timeZoomCanvas = this.getTimeZoomCanvas();
    DvtGanttRenderer._renderAxes(this, timeZoomCanvas);
    DvtGanttRenderer._renderVerticalGridline(this, timeZoomCanvas);

    DvtGanttRenderer._renderZoomControls(this);

    DvtGanttRenderer._updateRowBackground(this);

    if (this.isHorizontalScrollbarOn() || this.isVerticalScrollbarOn())
      DvtGanttRenderer._renderScrollbars(this);
  }
  else
    DvtGanttRenderer._renderEmptyText(this);
};

/**
 * Combines style defaults with the styles provided
 */
dvt.Gantt.prototype.applyStyleValues = function()
{
  var isRTL = dvt.Agent.isRightToLeft(this.getCtx());
  var scrollbarHitAreaSize = DvtGanttStyleUtils.getScrollbarHitAreaSize();
  this._borderWidth = DvtGanttStyleUtils.getChartStrokeWidth(this.Options);

  var doubleBorderWidth = this._borderWidth * 2;
  this._widthOffset = 0;

  this.setStartXOffset(this._borderWidth);
  this.setStartYOffset(this._borderWidth);

  // we are going to hide the scrollbar
  this.xScrollbarStyles = new dvt.CSSStyle(DvtGanttStyleUtils.getHorizontalScrollbarStyle());
  this.yScrollbarStyles = new dvt.CSSStyle(DvtGanttStyleUtils.getVerticalScrollbarStyle());

  this._backgroundWidth = this.Width;
  this._backgroundHeight = this.Height;

  if (this.isHorizontalScrollbarOn())
    this._backgroundHeight = this._backgroundHeight - dvt.CSSStyle.toNumber(this.xScrollbarStyles.getHeight()) - 3 * scrollbarHitAreaSize;
  if (this.isVerticalScrollbarOn())
  {
    var widthOffset = 3 * scrollbarHitAreaSize;
    this._backgroundWidth = this._backgroundWidth - dvt.CSSStyle.toNumber(this.yScrollbarStyles.getWidth()) - widthOffset;
    if (isRTL)
    {
      this._widthOffset = widthOffset - this._borderWidth;
      this.setStartXOffset(this._widthOffset + this._borderWidth);
    }
  }

  // The size of the canvas viewport
  this._canvasLength = this._backgroundWidth - doubleBorderWidth;
  this._canvasSize = this._backgroundHeight - doubleBorderWidth;
};

/**
 * Updates the taskbars of each row due to component resize
 */
dvt.Gantt.prototype.updateRows = function()
{
  var rows = this._rows;
  if (rows != null)
  {
    // update databody clip path
    DvtGanttRenderer._updateDatabody(this, this.getDatabody());

    // update the taskbars on each row
    for (var i = 0; i < rows.length; i++)
    {
      // rows[i].reRender(width, height);
      rows[i].render(this.getDatabody());
    }
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
        var newLength = this.getContentLength() * event.zoomWheelDelta;
        var time = event.zoomTime;
        var compLoc = event.zoomCompLoc;
        this.handleZoomWheel(newLength, time, compLoc, true);
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

  if (this.isHorizontalScrollbarOn())
    this.xScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);

  DvtGanttRenderer._renderAxes(this, this.getTimeZoomCanvas());
  this.updateRows();
  DvtGanttRenderer._renderVerticalGridline(this, this.getTimeZoomCanvas());

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
 * Gets whether horizontal scrollbar should be visible
 * @return {boolean} true if horizontal scrollbar is visible, false otherwise
 */
dvt.Gantt.prototype.isHorizontalScrollbarOn = function()
{
  // return this._xScrollbar == 'on';
  return true; // always on for now
};

/**
 * Gets whether vertical scrollbar should be visible
 * @return {boolean} true if vertical scrollbar is visible, false otherwise
 */
dvt.Gantt.prototype.isVerticalScrollbarOn = function()
{
  // return this._yScrollbar == 'on';
  return true; // always on for now
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
 * Gets the canvas size.
 * @return {number} the canvas size.
 */
dvt.Gantt.prototype.getCanvasSize = function()
{
  return this._canvasSize;
};

/**
 * Gets the canvas length.
 * @return {number} the canvas length.
 */
dvt.Gantt.prototype.getCanvasLength = function()
{
  return this._canvasLength;
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
 * Scroll task into view
 * @param {DvtGanttTaskNode} task
 */
dvt.Gantt.prototype.scrollTaskIntoView = function(task)
{
  var axesHeight = this.getAxesHeight();
  var timeZoomCanvas = this.getTimeZoomCanvas();
  var taskRect = {x: task.getTranslateX(), y: task.getTranslateY(), w: task.getWidth(), h: task.getHeight()};
  var viewportRect = {x: 0 - timeZoomCanvas.getTranslateX(), y: 0 - (this._databody.getTranslateY() - this._databodyStart), w: this._canvasLength, h: this._canvasSize - axesHeight};

  var deltaX = 0;
  var deltaY = 0;

  if (taskRect.x < viewportRect.x)
    deltaX = taskRect.x - viewportRect.x;
  else if (taskRect.x + taskRect.w > viewportRect.x + viewportRect.w)
    deltaX = (taskRect.x + taskRect.w) - (viewportRect.x + viewportRect.w);

  if (taskRect.y < viewportRect.y)
    deltaY = taskRect.y - viewportRect.y;
  else if (taskRect.y + taskRect.h > viewportRect.y + viewportRect.h)
    deltaY = (taskRect.y + taskRect.h) - (viewportRect.y + viewportRect.h);

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
  if (deltaY != 0 && (diagonal || (Math.abs(deltaY) > Math.abs(deltaX))))
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

    if (this.isVerticalScrollbarOn())
      this.yScrollbar.setViewportRange(newTranslateY - (this._canvasSize - this._databodyStart - bottomOffset), newTranslateY);
  }

  if (this.isHorizontalScrollbarOn())
    this.xScrollbar.setViewportRange(this._viewStartTime, this._viewEndTime);
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
  var rows = this._rows;
  if (rows != null)
  {
    for (var i = 0; i < rows.length; i++)
    {
      var tasks = rows[i].getTasks();
      if (tasks != null)
      {
        for (var j = 0; j < tasks.length; j++)
        {
          // skips the specified task bar
          if (task == tasks[j])
            continue;

          dim ? tasks[j].darken() : tasks[j].brighten();
        }
      }
    }
  }
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

  return null;
};

/**
 * Valid subIds inlcude:
 * <ul>
 * <li>taskbar[rowIndex][index]</li>
 * </ul>
 * @override
 */
DvtGanttAutomation.prototype.getDomElementForSubId = function(subId)
{
  var index = subId.indexOf('[');
  if (index > -1)
  {
    var component = subId.substring(0, index);
    if (component != 'taskbar')
      return null;

    var rowIndex = parseInt(subId.substring(index + 1, subId.indexOf(']')));
    if (isNaN(rowIndex))
      return null;

    index = subId.indexOf('[', index + 1);
    if (index > -1)
    {
      var taskIndex = parseInt(subId.substring(index + 1, subId.indexOf(']', index + 1)));
      if (isNaN(taskIndex))
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
  }
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

  ret.start = (new Date(options['start'])).getTime();
  ret.end = (new Date(options['end'])).getTime();

  ret.rows = options['rows'];

  if (options['viewportStart'])
    ret.viewStart = (new Date(options['viewportStart'])).getTime();
  if (options['viewportEnd'])
    ret.viewEnd = (new Date(options['viewportEnd'])).getTime();

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
    DvtGanttRenderer._renderRows(gantt, timeZoomCanvas);

    DvtGanttRenderer._renderZoomControls(gantt);

    // update row background
    DvtGanttRenderer._updateRowBackground(gantt);

    // Initial Selection
    gantt._processInitialSelections();

    if (gantt.isHorizontalScrollbarOn() || gantt.isVerticalScrollbarOn())
      DvtGanttRenderer._renderScrollbars(gantt);
  }
  else
  {
    DvtGanttRenderer._renderEmptyText(gantt);
  }
};

/**
 * Prepares the horizontal scrollbar for rendering.
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {dvt.Dimension} The dimension of the scrollbar.
 * @private
 */
DvtGanttRenderer._prerenderHorizScrollbar = function(gantt, container, availSpace)
{
  var width = availSpace.w;
  var height = dvt.CSSStyle.toNumber(gantt.xScrollbarStyles.getHeight());
  gantt.xScrollbar = new dvt.SimpleScrollbar(gantt.getCtx(), gantt.HandleEvent, gantt);
  container.addChild(gantt.xScrollbar);
  dvt.LayoutUtils.position(availSpace, 'bottom', gantt.xScrollbar, width, height, 0);
  return new dvt.Dimension(width, height);
};

/**
 * Prepares the vertical scrollbar for rendering.
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @param {dvt.Container} container The container to render into.
 * @param {dvt.Rectangle} availSpace The available space.
 * @return {dvt.Dimension} The dimension of the scrollbar.
 * @private
 */
DvtGanttRenderer._prerenderVertScrollbar = function(gantt, container, availSpace)
{
  var width = dvt.CSSStyle.toNumber(gantt.yScrollbarStyles.getWidth());
  var height = availSpace.h;
  gantt.yScrollbar = new dvt.SimpleScrollbar(gantt.getCtx(), gantt.HandleEvent, gantt);
  container.addChild(gantt.yScrollbar);
  dvt.LayoutUtils.position(availSpace, dvt.Agent.isRightToLeft(gantt.getCtx()) ? 'left' : 'right', gantt.yScrollbar, width, height, 0);
  return new dvt.Dimension(width, height);
};

/**
 * Renders the scrollbars.
 * @param {dvt.Gantt} gantt The gantt being rendered.
 * @private
 */
DvtGanttRenderer._renderScrollbars = function(gantt)
{
  var databody = gantt.getDatabody();
  if (databody == null)
    return;

  var databodyStart = gantt.getDatabodyStart();
  var context = gantt.getCtx();
  var ganttParent = gantt.getParent();
  var scrollbarHitAreaSize = DvtGanttStyleUtils.getScrollbarHitAreaSize();
  if (ganttParent._scrollbarsCanvas == null)
  {
    ganttParent._scrollbarsCanvas = new dvt.Container(context, 'sbCanvas');
    ganttParent.addChild(ganttParent._scrollbarsCanvas);
  }
  else
    ganttParent._scrollbarsCanvas.removeChildren();

  if (gantt.isHorizontalScrollbarOn())
  {
    var availSpaceWidth = gantt.getCanvasLength();
    var availSpaceHeight = gantt.Height - scrollbarHitAreaSize;
    var horizScrollbarDim = DvtGanttRenderer._prerenderHorizScrollbar(gantt, ganttParent._scrollbarsCanvas, new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight));
  }
  if (gantt.isVerticalScrollbarOn())
  {
    availSpaceWidth = gantt.Width - scrollbarHitAreaSize;
    availSpaceHeight = gantt.getCanvasSize() - gantt.getAxesHeight();
    var vertScrollbarDim = DvtGanttRenderer._prerenderVertScrollbar(gantt, ganttParent._scrollbarsCanvas, new dvt.Rectangle(0, 0, availSpaceWidth, availSpaceHeight));
  }

  if (gantt.xScrollbar)
  {
    var sbOptions = {};
    sbOptions['color'] = gantt.xScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
    sbOptions['backgroundColor'] = gantt.xScrollbarStyles.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
    sbOptions['min'] = gantt._start;
    sbOptions['max'] = gantt._end;
    sbOptions['isHorizontal'] = true;
    sbOptions['isReversed'] = dvt.Agent.isRightToLeft(gantt.getCtx());
    gantt.xScrollbar.setTranslateX(gantt.getStartXOffset());
    gantt.xScrollbar.render(sbOptions, horizScrollbarDim.w, horizScrollbarDim.h);
    gantt.xScrollbar.setViewportRange(gantt._viewStartTime, gantt._viewEndTime);
  }

  if (gantt.yScrollbar)
  {
    sbOptions = {};
    sbOptions['color'] = gantt.yScrollbarStyles.getStyle(dvt.CSSStyle.COLOR);
    sbOptions['backgroundColor'] = gantt.yScrollbarStyles.getStyle(dvt.CSSStyle.BACKGROUND_COLOR);
    sbOptions['min'] = -(Math.max(gantt.getContentHeight(), vertScrollbarDim.h) - databodyStart);
    sbOptions['max'] = databodyStart;
    sbOptions['isHorizontal'] = false;
    sbOptions['isReversed'] = true;
    gantt.yScrollbar.setTranslateY(databodyStart + gantt.getStartYOffset());
    gantt.yScrollbar.render(sbOptions, vertScrollbarDim.w, vertScrollbarDim.h);

    var bottomOffset = 0;
    if (gantt.getAxisPosition() == 'bottom')
      bottomOffset = gantt.getAxesHeight();
    gantt.yScrollbar.setViewportRange(databody.getTranslateY() - (gantt.getCanvasSize() - databodyStart - bottomOffset), databody.getTranslateY());
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
  }
  else
    gantt._background = new dvt.Rect(gantt.getCtx(), gantt._widthOffset, 0, width, height, 'bg');

  // Override specified border with double border to fix stroke rendering:
  // If stroke-width is 1px, then there is 0.5px border on each side of the edge, and because svg is
  // not pixel aware, in cases where the edge is between two pixels (e.g. on resize), the 0.5px doesn't show up, and the
  // entire stroke disappear. Fix is to double up the pixel so there there is always > 0.5px on each side of the edge
  // and use a clippath to hide the inner half of the stroke to maintain stroke width.
  gantt._background.SetSvgProperty('style', 'stroke-width:' + (gantt._borderWidth * 2) + 'px');

  dvt.ToolkitUtils.setAttrNullNS(gantt._background.getElem(), 'class', gantt.GetStyleClass('databody'));
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
  }

  dvt.ToolkitUtils.setAttrNullNS(gantt._rowBackground.getElem(), 'class', gantt.GetStyleClass('row'));
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

  var xOffset = gantt._startX + DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_PADDING;
  if (isRTL)
    var transX = xOffset;
  else
    transX = gantt._backgroundWidth - xOffset - DvtGanttStyleUtils._DEFAULT_ZOOM_CONTROL_DIAMETER;

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
 * @private
 */
DvtGanttRenderer._renderEmptyText = function(gantt)
{
  var emptyTextStr = dvt.Bundle.getTranslatedString(dvt.Bundle.UTIL_PREFIX, 'NO_DATA', null);
  var text = dvt.TextUtils.renderEmptyText(gantt._canvas, emptyTextStr,
      new dvt.Rectangle(0, 0, gantt._backgroundWidth, gantt._backgroundHeight),
      gantt.EventManager, null);
  dvt.ToolkitUtils.setAttrNullNS(text.getElem(), 'class', gantt.GetStyleClass('nodata'));

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
      dvt.ToolkitUtils.setAttrNullNS(gridLine.getElem(), 'class', gridlineStyleClass);

      gridlines.addChild(gridLine);
    }
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
  var isRowsCleanable = DvtGanttRenderer._prerenderRows(rows);

  if (rows.length == 0 || !isRowsCleanable)
  {
    DvtGanttRenderer._renderEmptyText(gantt);
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
      rowNode.render(databody);
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

      // for data change animations, row elements need to be in the correct order
      // in the DOM tree to get desired layering. E.g. if row A is above row B, and if
      // row B shifts up, we want to see elements of row B be layered on top of elements
      // of row A when they cross path. There is a slight performance hit by ensuring this layering
      // so we avoid this in the non-animation case.
      if (gantt._isDCAnimationEnabled) // data change animation
        rowNode.render(databody, i);
      else
        rowNode.render(databody);

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
      newTaskIdInfoMap[task['id']] = {'rowId': rowId, 'taskProps': dvt.JsonUtils.merge(task, taskDefaults)}; //state: same, moved, new
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
      task = dvt.JsonUtils.merge(task, this._gantt.getOptions()['taskDefaults']);
      var node = this.createTaskNode(task);
      if (node)
        this._tasks.push(node);
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
 * @param {dvt.Container} container the container to host artifacts of the row including task bars
 * @param {number=} index The index of the container child list to add to.
 */
DvtGanttRowNode.prototype.render = function(container, index)
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
      dvt.ToolkitUtils.setAttrNullNS(line.getElem(), 'class', gridlineStyleClass);

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
 * @return {object} the style of the task
 */
DvtGanttTaskNode.prototype.getStyle = function()
{
  return this._get('style');
};

/**
 * Retrieve the class name of the task
 * @return {string} the class name of the task
 */
DvtGanttTaskNode.prototype.getClassName = function()
{
  return this._get('className');
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
  if (this._hover)
    this._hover.setWidth(width + DvtGanttTaskNode.EFFECT_MARGIN * 2);
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
  if (this._hover)
    this._hover.setHeight(height + DvtGanttTaskNode.EFFECT_MARGIN * 2);
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

  this.setAriaRole('img');
  if (dvt.TimeAxis.supportsTouch())
    this._updateAriaLabel(this.getRow().getIndex());

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
      moveTaskDurationAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getX, labelText.setX, this._currentVisualState['label']['x']);
      moveTaskDurationAnimator.addProp(dvt.Animator.TYPE_NUMBER, labelText, labelText.getY, labelText.setY, this._currentVisualState['label']['y']);

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
  return {
    'task': {
      'width': this.getWidth(),
      'top': this.getTop(),
      'translateX': this.getTranslateX(),
      'translateY': this.getTranslateY()
    },
    'bar': {
      'width': bar.getWidth(),
      'height': bar.getHeight()
    },
    'label': {
      'textString': labelText.getTextString(),
      'x': labelText.getX(),
      'y': labelText.getY()
    }
  };
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
  var labelState = stateObj['label'];
  labelText.setTextString(labelState['textString']);
  labelText.setX(labelState['x']);
  labelText.setY(labelState['y']);
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

    var inlineStyle = task.getStyle();
    if (inlineStyle)
      dvt.ToolkitUtils.setAttrNullNS(bar.getElem(), 'style', inlineStyle);

    var defaultStyleClass = gantt.GetStyleClass('task');
    var styleClass = task.getClassName();
    if (styleClass)
      dvt.ToolkitUtils.setAttrNullNS(bar.getElem(), 'class', defaultStyleClass + ' ' + styleClass);
    else
      dvt.ToolkitUtils.setAttrNullNS(bar.getElem(), 'class', defaultStyleClass);

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
  var labelText = task.getLabelText();
  var pos = task.getLabelPosition();
  var isRTL = dvt.Agent.isRightToLeft(gantt.getCtx());
  if (labelText == null)
  {
    var label = task.getLabel();
    if (label != null)
    {
      // labelText = new dvt.OutputText(gantt.getCtx(), label, 0, 0);
      labelText = new DvtGanttOutputText(gantt.getCtx(), label, 0, 0, gantt.htmlCanvas);
      dvt.ToolkitUtils.setAttrNullNS(labelText.getElem(), 'class', gantt.GetStyleClass('taskLabel'));

      // Make reference point top right instead of top left in RTL mode:
      if (isRTL)
        labelText.alignRight();

      task.setLabelText(labelText);
      task.addChild(labelText);
    }
  }

  // create dvt.CSSStyle from from style sheet
  var labelCSSStyle = new dvt.CSSStyle(DvtGanttStyleUtils.getTaskLabelStyle(gantt.getOptions()));

  // sets the style if specified in options
  var labelStyle = task.getLabelStyle();
  if (labelStyle != null)
  {
    labelCSSStyle.parseInlineStyle(labelStyle);
    if (typeof labelStyle === 'string')
      labelText.getElem().style.cssText = labelStyle;
    else
      dvt.ToolkitUtils.setAttrNullNS(labelText, 'style', labelStyle);
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
 * Gets the date string
 * @param {Date|string|number} time
 * @return {string} the date string
 */
DvtGanttTaskNode.prototype.getDateString = function(time)
{
  if (time == null)
    return '';

  var date = new Date(time);
  var scale = this._gantt.getMinorAxis().getScale();
  // we only wants to include hours/minutes/second info if minor scale is less than days
  if (scale == 'hours' || scale == 'minutes' || scale == 'seconds')
    return date.toLocaleString();
  else
    return date.toLocaleDateString();
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
 * @param {number} rowIndex
 * @return {string} the aria label string.
 */
DvtGanttTaskNode.prototype.getAriaLabel = function(rowIndex) 
{
  var states = [];
  var options = this._gantt.getOptions();
  if (this.isSelectable())
    states.push(dvt.Bundle.getTranslation(options, this.isSelected() ? 'stateSelected' : 'stateUnselected', dvt.Bundle.UTIL_PREFIX, this.isSelected() ? 'STATE_SELECTED' : 'STATE_UNSELECTED'));

  var start = this.getStartTime();
  var end = this.getEndTime();
  if (start == null || end == null || start == end)
  {
    var time = this.getDateString((start != null) ? start : end);
    var taskDesc = dvt.Bundle.getTranslation(options, 'accessibleMilestoneInfo', dvt.Bundle.UTIL_PREFIX, 'MILESTONE_INFO', [time]);
  }
  else
  {
    var startTime = this.getDateString(start);
    var endTime = this.getDateString(end);
    var duration = this.getDuration(start, end);
    taskDesc = dvt.Bundle.getTranslation(options, 'accessibleTaskInfo', dvt.Bundle.UTIL_PREFIX, 'TASK_INFO', [startTime, endTime, duration]);
  }

  var label = this.getLabel();
  if (label != null)
    taskDesc = label + ', ' + taskDesc;

  // include row index if current row has changed
  var rowId = this.getRow().getId();
  var currentRowId = this._gantt.getCurrentRow();
  if (currentRowId != rowId)
  {
    if (rowIndex == null)
    {
      var rowElem = this.getRow().getElem();
      var childNodes = rowElem.parentNode.childNodes;
      for (var i = 0; i < childNodes.length; i++)
      {
        if (childNodes[i] == rowElem)
        {
          rowIndex = i;
          break;
        }
      }
    }
    var rowDesc = dvt.Bundle.getTranslation(options, 'accessibleRowInfo', dvt.Bundle.UTIL_PREFIX, 'ROW_INFO', [rowIndex + 1]);
    taskDesc = rowDesc + ', ' + taskDesc;
  }

  var ariaLabel = dvt.Displayable.generateAriaLabel(taskDesc, states);
  var currentAriaLabel = this.getAriaProperty('label');
  // coming from setActiveElement() and nothing changed, must have been updated through selection, skipped
  if (currentAriaLabel != null && currentAriaLabel.indexOf(ariaLabel) > -1)
    return null;
  else
    return ariaLabel;
};

/**
 * Updates the aria-label as needed. On desktop, we can defer the aria creation, and the aria-label will be updated
 * when the activeElement is set.
 * @param {number} rowIndex
 * @private
 */
DvtGanttTaskNode.prototype._updateAriaLabel = function(rowIndex) 
{
  this.setAriaProperty('label', this.getAriaLabel(rowIndex));
  this.applyAriaProperties();
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
  dvt.ToolkitUtils.setAttrNullNS(bar.getElem(), 'class', this._gantt.GetStyleClass('task'));
  dvt.ToolkitUtils.setAttrNullNS(bar.getElem(), 'style', 'fill:none');
  dvt.DomUtils.addCSSClassName(bar.getElem(), this._gantt.GetStyleClass(effect));

  return bar;
};

/**
 * Show hover effect on task bar
 * @override
 */
DvtGanttTaskNode.prototype.showHoverEffect = function() 
{
  // checks if hover effect is already applied
  if (this._hover != null)
    return;

  // must be inserted before the bar
  var bar = this._createEffectArtifact('hover');
  this.addChildAt(bar, 0);
  // save it to remove later
  this._hover = bar;

  var color = this.getFillColor();
  if (color != null)
    bar.setStroke(dvt.SelectionEffectUtils.createSelectingStroke(color));

  // dim all other task bars
  if (this._gantt.getHoverBehavior() == 'dim')
    this._gantt.setTaskbarBrightness(this, true);
};

/**
 * Hide hover effect on task bar
 * @override
 */
DvtGanttTaskNode.prototype.hideHoverEffect = function() 
{
  if (this._hover != null)
  {
    this.removeChild(this._hover);
    this._hover = null;
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
// Keyboard Support: DvtKeyboardNavigable impl                        //
//---------------------------------------------------------------------//

/**
 * @override
 */
DvtGanttTaskNode.prototype.getNextNavigable = function(event) 
{
  var keyboardHandler = this._gantt.getEventManager().getKeyboardHandler();
  if (event.type == dvt.MouseEvent.CLICK || keyboardHandler.isMultiSelectEvent(event))
    return this;
  else if (keyboardHandler.isNavigationEvent(event))
    return DvtGanttKeyboardHandler.getNextNavigable(this._gantt, this, event);
  else
    return null;
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
  this.showHoverEffect();
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
