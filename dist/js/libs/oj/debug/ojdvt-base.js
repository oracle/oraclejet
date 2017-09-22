/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojvalidation-number', 'ojs/internal-deps/dvt/DvtToolkit', 'ojdnd', 'promise'], function(oj, $, comp, val, dvt)
{
/**
 * Creates an attribute group handler that will generate stylistic attribute values such as colors or shapes based on data set categories.
 * 
 * @param {Object} [matchRules] A map of key value pairs for categories and the matching attribute value e.g. {"soda" : "square", "water" : "circle", "iced tea" : "triangleUp"}.
 *                            Attribute values listed in the matchRules object will be reserved only for the matching categories when getAttributeValue is called.
 * @export
 * @constructor
 */
oj.AttributeGroupHandler = function(matchRules) {
  this.Init(matchRules);
};

oj.Object.createSubclass(oj.AttributeGroupHandler, oj.Object, "oj.AttributeGroupHandler");

oj.AttributeGroupHandler.prototype.Init = function(matchRules) {
  this._assignments = {};
  this._valueIndex = 0;
  this._matchRules = {};
  for (var category in matchRules) {
    this.addMatchRule(category, matchRules[category]);
  }
  // Delay initializing value ramp by calling subclass getValueRamp impl until needed either for adding match rule or assigning values
};

/**
 * Returns the array of possible attribute values for this attribute group handler.
 * @returns {Array} The array of attribute values
 * @export
 */
oj.AttributeGroupHandler.prototype.getValueRamp = function() {
  return [];
};

/**
 * Assigns the given category an attribute value.  Will consistently return the same attribute value for equal categories.
 * @param {Object} category The category to assign
 * @returns {Object} The attribute value for the category
 * @export
 */
oj.AttributeGroupHandler.prototype.getValue = function(category) {
  // When assigning value, first check match rules, then assign to next attribute group value.
  if (this._matchRules[category]) {
    return this._matchRules[category];
  }
  else if (!this._assignments[category]) {
    if (!this._values)
      this._values = this.getValueRamp().slice();

    this._assignments[category] = this._values[this._valueIndex];
    
    this._valueIndex++;
    if (this._valueIndex == this._values.length)
      this._valueIndex = 0;
  }
  return this._assignments[category];
};

/**
 * Returns the current map of key value pairs for categories and the assigned attribute values. Note that match rules are not
 * reflected in category assignments.
 * @return {Array} The current list of category and value pairing
 * @export
 */
oj.AttributeGroupHandler.prototype.getCategoryAssignments  = function() {
  var assignments = [];
  for (var i in this._assignments)
    assignments.push({"category": i, "value": this._assignments[i]});
  return assignments;
};

/**
 * Reserves an attribute value for the given category.  All match rules should be added before any category
 * assignments are done with the <a href="#getValue">getValue</a> API.
 * @param {string} category Used for checking inputs to getAttributeValue against when assigning an attribute value
 * @param {string} attributeValue The attribute value to assign for inputs matching the given category e.g. "square" or "circle"
 * @export
 */
oj.AttributeGroupHandler.prototype.addMatchRule = function(category, attributeValue) {
  this._matchRules[category] = attributeValue;
};

/**
 * Creates a shape attribute group handler that will generate shape attribute values.
 * 
 * @param {Object} [matchRules] A map of key value pairs for categories and the matching attribute value e.g. {"soda" : "square", "water" : "circle", "iced tea" : "triangleUp"}.
 *                            Attribute values listed in the matchRules object will be reserved only for the matching categories when getAttributeValue is called.
 * @export
 * @constructor
 * @extends {oj.AttributeGroupHandler}
 */
oj.ShapeAttributeGroupHandler = function(matchRules) {
  this.Init(matchRules);
};

oj.Object.createSubclass(oj.ShapeAttributeGroupHandler, oj.AttributeGroupHandler, "oj.ShapeAttributeGroupHandler");

oj.ShapeAttributeGroupHandler._attributeValues = ['square', 'circle', 'diamond', 'plus', 'triangleDown', 'triangleUp', 'human'];

/**
 * Returns the array of possible shape values for this attribute group handler.
 * @returns {Array} The array of shape values
 * @export
 */
oj.ShapeAttributeGroupHandler.prototype.getValueRamp = function() {
  return oj.ShapeAttributeGroupHandler._attributeValues;
};
/**
 * Defines whether the element will automatically render in response to
 * changes in size. If set to <code class="prettyprint">off</code>, then the
 * application is responsible for calling <code class="prettyprint">refresh</code>
 * to render the element at the new size.
 * @expose
 * @name trackResize
 * @memberof oj.dvtBaseComponent
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default <code class="prettyprint">"on"</code>
 * 
 * @example <caption>Initialize the data visualization element with the 
 * <code class="prettyprint">track-resize</code> attribute specified:</caption>
 * &lt;oj-some-dvt track-resize='off'>&lt;/oj-some-dvt>
 * 
 * @example <caption>Get or set the <code class="prettyprint">trackResize</code> 
 * property after initialization:</caption>
 * // getter
 * var value = myComponent.trackResize;
 * 
 * // setter
 * myComponent.trackResize="off";
 */

/**
 * <p>The SVG DOM that this component generates should be treated as a black box, as it is subject to change.</p>
 *
 * @ojfragment warning
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The application is responsible for populating the shortDesc value in the
 * component properties object with meaningful descriptors when the component does
 * not provide a default descriptor.</p>
 *
 * @ojfragment a11y
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The application is responsible for populating the shortDesc value in the
 * component properties object with meaningful descriptors when the component does
 * not provide a default descriptor.  Since component terminology for keyboard
 * and touch shortcuts can conflict with those of the application, it is the
 * application's responsibility to provide these shortcuts, possibly via a help
 * popup.</p>
 *
 * @ojfragment a11yKeyboard
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>
 *   As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the
 *   component must be <code class="prettyprint">refresh()</code>ed.
 * </p>
 *
 * @ojfragment rtl
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h4>Tracking Resize</h4>
 * <p>By default, the element will track resizes and render at the new size. This functionality adds a small
 * overhead to the initial render for simple elements like gauges or spark charts, which become noticable when
 * using large numbers of these simple elements. To disable resize tracking, set <code class="prettyprint">trackResize</code>
 * to <code class="prettyprint">off</code>. The application can manually request a re-render at any time by calling
 * the <code class="prettyprint">refresh</code> function.
 * </p>
 *
 * @ojfragment trackResize
 * @memberof oj.dvtBaseComponent
 */

/**
 * Class to help set css properties on the component root options object
 * @param {Object} object The root options object from which this path should be resolved
 * @param {string} path The string path within the options object to resolve
 * @protected
 * @constructor
 * @ignore
 */
var DvtJsonPath = function(object, path)
{
  this._path = path;
  this._root = object;
  this._delimiter = '/';
};

/**
 * Resolves the parameter of the leaf object and the leaf object itself
 * @param {Object} root The root object to update
 * @param {string} path The string path within the root object to resolve
 * @param {string} delimiter The string delimiter for the path string
 * @param {boolean} createIfMissing Flag to create the hierarchy of the namespaces if they do not exist
 * @return {Object} The resolved parameter
 * @private
 */
DvtJsonPath.prototype._resolveLeafObjectAndProperty = function(root, path, delimiter, createIfMissing)
{
  var result = {};
  while (root && path.indexOf(delimiter) > -1)
  {
    var subProperty = path.substring(0, path.indexOf(delimiter));
    if (createIfMissing && root[subProperty] === undefined)
    {
      root[subProperty] = {};
    }
    root = root[subProperty];
    path = path.substring(path.indexOf(delimiter) + 1, path.length);
  }

  if (root)
  {
    result['object'] = root;
    result['parameter'] = path;
  }

  return result;
};

/**
 * Resolves path to the leaf object and parameter of this object
 * @param {boolean} createIfMissing Flag to create the hierarchy of the namespaces if they do not exist
 * @private
 */
DvtJsonPath.prototype._resolvePath = function(createIfMissing)
{
  if (this._leaf === undefined)
  {
    var result = this._resolveLeafObjectAndProperty(this._root, this._path, this._delimiter, createIfMissing);

    this._leaf = result['object'];
    this._param = result['parameter'];
  }
};

/**
 * Returns value of the leaf element of the path.
 * @return {Object} value The value of the leaf element or undefined if path structure is not yet created
 */
DvtJsonPath.prototype.getValue = function()
{
  this._resolvePath(false);
  return this._leaf === undefined ? undefined : this._leaf[this._param];
};

/**
 * Sets value of the leaf element of the path.
 * @param {Object} value The value of the leaf element
 * @param {boolean} bOverride Whether to override the original value
 */
DvtJsonPath.prototype.setValue = function(value, bOverride)
{
  this._resolvePath(true);

  if (bOverride || !this._leaf[this._param])
  {
    this._leaf[this._param] = value;
  }
};

/**
 * Creates a color attribute group handler that will generate color attribute values.
 * 
 * @param {Object} [matchRules] A map of key value pairs for categories and the
 * matching attribute value e.g. {"soda" : "#336699", "water" : "#CC3300", "iced tea" : "#F7C808"}.
 * Attribute values listed in the matchRules object will be reserved only for the
 * matching categories when getAttributeValue is called.  Note that not all colors
 * in the default color ramp will meet minimum contrast requirements for text.
 * @export
 * @constructor
 * @extends {oj.AttributeGroupHandler}
 */
oj.ColorAttributeGroupHandler = function(matchRules) {
  // Create the array of colors for this instance.
  this._attributeValues = [];

  if ($(document.body).hasClass('oj-hicontrast'))  {
    // High Contrast: CSS colors get overridden to all white or all black. Use the default colors instead.
    this._attributeValues = oj.ColorAttributeGroupHandler._DEFAULT_COLORS.slice();
  }
  else {
    // Process the colors from the skin if not done already.
    if(!oj.ColorAttributeGroupHandler._colors) {
      // Process the colors from the CSS.
      // To improve performance, append the divs for each style class first then process the colors for each div.
      var attrGpsDiv = oj.ColorAttributeGroupHandler.createAttrDiv(); 
      if (attrGpsDiv) {
        oj.ColorAttributeGroupHandler.processAttrDiv(attrGpsDiv);
        attrGpsDiv.remove();
      }
    }

    // Clone and use the processed colors.
    if (oj.ColorAttributeGroupHandler._colors.length > 0)
      this._attributeValues = oj.ColorAttributeGroupHandler._colors.slice();
    else
      this._attributeValues = oj.ColorAttributeGroupHandler._DEFAULT_COLORS.slice();
  }

  this.Init(matchRules);
};

oj.Object.createSubclass(oj.ColorAttributeGroupHandler, oj.AttributeGroupHandler, "oj.ColorAttributeGroupHandler");

/** @private */
oj.ColorAttributeGroupHandler._DEFAULT_COLORS = ['#237bb1', '#68c182', '#fad55c', '#ed6647', 
  '#8561c8', '#6ddbdb', '#ffb54d', '#e371b2', '#47bdef', '#a2bf39', '#a75dba', '#f7f37b'];

/** @private */
oj.ColorAttributeGroupHandler._STYLE_CLASSES = ['oj-dvt-category1', 'oj-dvt-category2', 'oj-dvt-category3', 
  'oj-dvt-category4', 'oj-dvt-category5', 'oj-dvt-category6', 'oj-dvt-category7', 'oj-dvt-category8', 
  'oj-dvt-category9', 'oj-dvt-category10', 'oj-dvt-category11', 'oj-dvt-category12'];

/** @private */
oj.ColorAttributeGroupHandler._colors = null;

/**
 * Returns the array of possible color values for this attribute group handler.
 * @returns {Array} The array of color values
 * @export
 */
oj.ColorAttributeGroupHandler.prototype.getValueRamp = function() {
  return this._attributeValues;
};

/**
 * Creates an element and appends a div for each style class
 * @returns {Object} The element containing divs for each style class
 * @static
 * @export
 */
oj.ColorAttributeGroupHandler.createAttrDiv = function() {
  if (oj.ColorAttributeGroupHandler._colors)
    return null;
    
  var attrGpsDiv = $(document.createElement("div"));
  attrGpsDiv.attr("style", "display:none;");
  attrGpsDiv.attr("id", "attrGps");
  $(document.body).append(attrGpsDiv); // @HTMLUpdateOK
  for (var i = 0; i < oj.ColorAttributeGroupHandler._STYLE_CLASSES.length; i++) {
    var childDiv = $(document.createElement("div"));
    childDiv.addClass(oj.ColorAttributeGroupHandler._STYLE_CLASSES[i]);
    attrGpsDiv.append(childDiv); // @HTMLUpdateOK
  } 
  return attrGpsDiv;
};

/**
 * Processes the colors for each div on the given element
 * @param {Object} attrGpsDiv The element containing divs for each style class
 * @static
 * @export
 */
oj.ColorAttributeGroupHandler.processAttrDiv = function(attrGpsDiv) {
  oj.ColorAttributeGroupHandler._colors = [];
  
  var childDivs = attrGpsDiv.children();
  for (var i = 0; i < childDivs.length; i++) {
    var childDiv = $(childDivs[i]);
    var color = childDiv.css('color');
    if (color)
      oj.ColorAttributeGroupHandler._colors.push(color);
  }
};
var DvtStyleProcessor = {
  'CSS_TEXT_PROPERTIES':
    function(cssDiv) {
      var ignoreProperties = {};
      if (cssDiv) {
        if (cssDiv.hasClass("oj-gauge-metric-label")) {
          // Ignored because the size and color are fit to shape and based on background color.
          ignoreProperties['font-size'] = true;
          ignoreProperties['color'] = true;
        }
        else if (cssDiv.hasClass(cssDiv, "oj-chart-slice-label")) {
          // Ignored because the color is automatically determined based on slice color.
          ignoreProperties['color'] = true;
        }
        else if (cssDiv.hasClass("oj-treemap-node-header")) {
          // Ignored because the weight is automatically determined based on the layer of the header.
          ignoreProperties['font-weight'] = true;
        }
      }
      return DvtStyleProcessor._buildTextCssPropertiesObject(cssDiv, ignoreProperties);
    },
  'CSS_BACKGROUND_PROPERTIES':
    function(cssDiv, styleClass, property, path) {
      return DvtStyleProcessor._buildCssBackgroundPropertiesObject(cssDiv);
    }
};

DvtStyleProcessor._INHERITED_FONT_COLOR = "rgb(254, 0, 254)";
DvtStyleProcessor._INHERITED_FONT_FAMILY = "Times";
DvtStyleProcessor._INHERITED_FONT_SIZE = "1px";
DvtStyleProcessor._INHERITED_FONT_WEIGHT = "1";
DvtStyleProcessor._INHERITED_FONT_STYLE = "normal";

// Chrome adjusts px font size when zooming, so only set the font size if the inherited size is less than 4px.
DvtStyleProcessor._FONT_SIZE_BUFFER = 4.0;

/**
 * A map of resolved style properties, where each key is a style class and each value is an object with property to
 * value mappings.
 * @private
 */
DvtStyleProcessor._styleCache = {};

DvtStyleProcessor.defaultStyleProcessor = function(cssDiv, property) {
  return cssDiv.css(property);
};

/**
 * Returns the css background properties object.
 * @param {Object} cssDiv The element with style class or with some default style
 * @return {Object} The object of CSS background properties including
 *                  border-color, border-width, and background-color
 * @private
 */
DvtStyleProcessor._buildCssBackgroundPropertiesObject = function(cssDiv) {
  var cssObj = {};
  if (cssDiv.css('border-top-color')) {
    cssObj["border-color"] = cssDiv.css('border-top-color');
  }
  if (cssDiv.css('border-width') && cssDiv.css('border-style') &&
      cssDiv.css('border-style') != 'none') {
    cssObj["border-width"] = cssDiv.css('border-width');
  }
  if (cssDiv.css('background-color')) {
    cssObj["background-color"] = cssDiv.css('background-color');
  }
  return cssObj;
};

/**
 * Returns the css text properties object.
 * @param {Object} cssDiv The div to use for processing CSS style.
 * @param {Object} ignoreProperties The css properties to ignore
 * @return {Object} The CSS text properties object including font-family,
 *                  font-size, font-weight, color, and font-style
 */
DvtStyleProcessor._buildTextCssPropertiesObject = function(cssDiv, ignoreProperties)
{
  var cssObj = {};
  var value = cssDiv.css('font-family');
  if (value && value !== DvtStyleProcessor._INHERITED_FONT_FAMILY) {
    cssObj["font-family"] = value.replace(/"/g,"'");
  }
  value = cssDiv.css('font-size');
  if (value && !(value.indexOf("px") > -1 &&
      parseFloat(value) < DvtStyleProcessor._FONT_SIZE_BUFFER) &&
      !ignoreProperties ['font-size']) {
    cssObj["font-size"] = value;
  }
  value = cssDiv.css('font-weight');
  if (value && value !== DvtStyleProcessor._INHERITED_FONT_WEIGHT &&
      !ignoreProperties['font-weight']) {
    cssObj["font-weight"] = value;
  }
  value = cssDiv.css('color');
  if (value && value !== DvtStyleProcessor._INHERITED_FONT_COLOR &&
      !ignoreProperties ['color']) {
    cssObj["color"] = value;
  }
  value = cssDiv.css('font-style');
  if (value && value !== DvtStyleProcessor._INHERITED_FONT_STYLE) {
    cssObj["font-style"] = value;
  }
  return cssObj;
};

/**
 * Creates dummy divs for each component style class and merges their values with the component options object.
 * @param {Object} element DOM node to add CSS styles to for processing
 * @param {Object} options The options object to merge CSS properties with
 * @param {Array} componentClasses The style classes associated with the component
 * @param {Object} childClasses Style classes associated with a component's children
 */
DvtStyleProcessor.processStyles = function(element, options, componentClasses, childClasses)
{
  var outerDummyDiv = null;
  var innerDummyDiv = null;
  
  var styleClasses = '';
  for (var i=0; i<componentClasses.length; i++)
    styleClasses = styleClasses + componentClasses[i] + " ";
  
  var styleDefinitions = {};
  var styleDivs = {}
  
  for (var styleClass in childClasses) {
    // Retrieve the definitions for the styleClass. Convert to an array if not already.
    var definitions = childClasses[styleClass];
    if(!(definitions instanceof Array))
      definitions = [definitions];
    
    // Performance: Only create these divs if we need to process uncached definitions
    var hasUncachedProperty = DvtStyleProcessor._hasUncachedProperty(styleClass, definitions);
    if (!innerDummyDiv && !outerDummyDiv && hasUncachedProperty) {
      // Add the component style classes to a hidden dummy div
      outerDummyDiv = $(document.createElement("div"));
      outerDummyDiv.attr("style", "display:none;");
      element.append(outerDummyDiv); // @HTMLUpdateOK
      outerDummyDiv.attr("class", styleClasses);
      $(document.body).append(outerDummyDiv); // @HTMLUpdateOK
      
      // Add an inner dummy div to overwrite inherited values and prevent populating options object with them
      innerDummyDiv = $(document.createElement("div"));
      innerDummyDiv.css("font-size", DvtStyleProcessor._INHERITED_FONT_SIZE);
      innerDummyDiv.css("color", DvtStyleProcessor._INHERITED_FONT_COLOR);
      innerDummyDiv.css("font-weight", DvtStyleProcessor._INHERITED_FONT_WEIGHT);
      innerDummyDiv.css("font-style", DvtStyleProcessor._INHERITED_FONT_STYLE);
      outerDummyDiv.append(innerDummyDiv); // @HTMLUpdateOK    
    }
    
    // store style definitions to avoid recalculation in the next loop
    styleDefinitions[styleClass] = definitions;
    
    // create cssDivs for styles to be resolved during processing where necessary 
    if (hasUncachedProperty) 
      styleDivs[styleClass] = DvtStyleProcessor._createStyleDivs(innerDummyDiv, styleClass, definitions);
  }
  
  // Performance: Process color attribute groups for components along with the component styles
  var attrGpsDiv = oj.ColorAttributeGroupHandler.createAttrDiv(); 
  
  for (var styleClass in childClasses) {
    DvtStyleProcessor._processStyle(styleDivs[styleClass], options, styleClass, styleDefinitions[styleClass]);
  }
  
  // Performance: Process color attribute groups for components along with the component styles
  if (attrGpsDiv) {
    oj.ColorAttributeGroupHandler.processAttrDiv(attrGpsDiv);
    attrGpsDiv.remove();
  }
  
  // Remove the dummy div when complete
  if (outerDummyDiv)
    outerDummyDiv.remove();
};

/**
 * Creates and returns a cssDiv for the specified style class if there are definitions that need to be evaluated
 * @param {Object} parentElement The parent DOM node of the element that will be created to add CSS styles to for processing.
 * @param {string} styleClass The style class.
 * @param {Array} definitions Array of maps of CSS style attribute and values to process.
 * @return {Object} The created cssDiv
 * @private
 */
DvtStyleProcessor._createStyleDivs= function(parentElement, styleClass, definitions)
{
  // Ensure an entry for the styleClass exists in the cache.
  if(!DvtStyleProcessor._styleCache[styleClass])
    DvtStyleProcessor._styleCache[styleClass] = {};

  // Create a cssDiv for each definition.
  var cssDiv = null;
  for (var i=0;i<definitions.length; i++) {
    var definition = definitions[i];
    var property = definition['property'];
    if(property) {
      // Check if the style cache already has a resolved copy of the value
      var value = DvtStyleProcessor._styleCache[styleClass][property];
      if(typeof value == 'undefined') {
        // Property not found in the cache. Ensure creation of the cssDiv to resolve the property.
        if(!cssDiv) {
          cssDiv = $(document.createElement("div"));
          cssDiv.addClass(styleClass);
          parentElement.append(cssDiv); // @HTMLUpdateOK
        }
      }
    }
  }
  return cssDiv;  
};

/**
 * Resolves the css properties for a specified style class.
 * @param {Object} cssDiv The DOM node with addeed CSS styles to process.
 * @param {Object} options The options object to merge CSS properties with.
 * @param {string} styleClass The style class.
 * @param {Array} definitions Array of maps of CSS style attribute and values to process.
 * @private
 */
DvtStyleProcessor._processStyle = function(cssDiv, options, styleClass, definitions)
{
  for (var i=0;i<definitions.length; i++) {
    var definition = definitions[i];
    var property = definition['property'];
    if(property) {
      // Check if the style cache already has a resolved copy of the value
      var value = DvtStyleProcessor._styleCache[styleClass][property];
      
      if(typeof value == 'undefined' && cssDiv) {
        // Resolve and store in the cache.
        value = DvtStyleProcessor._resolveStyle(cssDiv, property);
        DvtStyleProcessor._styleCache[styleClass][property] = value;
      }

      // If a value exists, apply to the JSON.
      if(value != null) {
        var path = new DvtJsonPath(options, definition['path']);
        // If a handler was used, combine the value from the options with the value from the skin.
        var handler = DvtStyleProcessor[property];
        if(handler != null) {
          var optionsValue = path.getValue();
          var strValue = '';
          if (optionsValue != null) {
            var strOptionsValue = DvtStyleProcessor._getStyleString(optionsValue);
            for (var attr in value) {
              if (strOptionsValue.indexOf(attr) === -1)
                strValue += attr + ':' + value[attr] + ';';
            }
            strValue += strOptionsValue;
          } else { // still need to convert cached value which is an object to a string
            for (var attr in value)
              strValue += attr + ':' + value[attr] + ';';
          }
          value = strValue;
        }

        // Override original value only if we have already merged the original value with the new value, such as for
        // text or background styles.
        path.setValue(value, handler != null);
      }
    }
  }
};

/**
 * Helper function to get the style string for the given style options
 * @param {Object | string} styleOptions The style options value
 * @return {string} The style string
 * @private
 */
DvtStyleProcessor._getStyleString = function(styleOptions) {
  if (styleOptions instanceof Object) {
    var styleString = '';
    //The camel case version of object attributes will be converted to hyphenated(-) string attributes
    for (var attr in styleOptions) {
      var stringAttr = attr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      styleString += stringAttr + ':' + styleOptions[attr] + ';';
    }
    return styleString;
  } 
  //Ensure the returned style is a string and not null
  return (styleOptions != null && typeof styleOptions == 'string') ? styleOptions : '';
};

/**
 * Helper function to resolve the css properties within a dummy div and handle caching.
 * @param {Object} cssDiv The div to use for processing CSS style.
 * @param {string} property The css property to be resolved.
 * @return {string | null} The resolved value.
 * @private
 */
DvtStyleProcessor._resolveStyle = function(cssDiv, property)
{
  var handler = DvtStyleProcessor[property];
  var value = handler ? handler(cssDiv) : DvtStyleProcessor.defaultStyleProcessor(cssDiv, property);

  // Ensure the returned value is not null or empty string.
  return (value != null && !(typeof value == 'string' && value.replace(/^\s+/g, '') == '')) ? value : null;
};

/**
 * Helper function to verify if any style properties are not in the cache.
 * @param {string} styleClass The style class.
 * @param {Array} definitions The array of definitions for the style class.
 * @return {boolean}
 * @private
 */
DvtStyleProcessor._hasUncachedProperty = function(styleClass, definitions)
{
  var styleCache = DvtStyleProcessor._styleCache[styleClass];
  if (!styleCache)
    return true;
    
  for (var i = 0;i < definitions.length; i++) {
    var property = definitions[i]['property'];
    if(property) {
      var value = styleCache[property];    
      if(typeof value == 'undefined')
        return true;
    }
  }
  return false;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.dvtBaseComponent
 * @augments oj.baseComponent
 * @since 0.7
 * @abstract
 */
oj.__registerWidget('oj.dvtBaseComponent', $['oj']['baseComponent'], {
  //** @inheritdoc */
  _ComponentCreate : function() {
    this._super();
    this._renderCount = 0;
    this._numDeferredObjs = 0;
    this._optionsCopy = null;
    this._templateMap = {};

    // Append the component style classes to the element
    var componentStyles = this._GetComponentStyleClasses();
    for(var i=0; i<componentStyles.length; i++) {
      this.element.addClass(componentStyles[i]);
    }

    // Create a reference div within the element to be used for computing relative event coords.
    this._referenceDiv = $(document.createElement("div"));
    this._referenceDiv.attr("style", "visibility:hidden;");
    this.element.append(this._referenceDiv); // @HTMLUpdateOK

    // Create the dvt.Context, which creates the svg element and adds it to the DOM.
    var parentElement = this.element[0].parentElement;
    if (parentElement && parentElement._dvtcontext)
      this._context = parentElement._dvtcontext;
    else
      this._context = new dvt.Context(this.element[0], null, this._referenceDiv[0]);

    // Store JET reference on context so toolkit can access things like loggers
    this._context['oj'] = oj;

    // Set the reading direction on the context
    this._context.setReadingDirection(this._GetReadingDirection());

    // Set the tooltip and datatip callbacks and div style classes
    this._context.setTooltipAttachedCallback(oj.Components.subtreeAttached);
    this._context.setOverlayAttachedCallback(oj.Components.subtreeAttached);
    this._context.setTooltipStyleClass('oj-dvt-tooltip');
    this._context.setDatatipStyleClass('oj-dvt-datatip');

    // Pass back method for cleaning up renderer context
    this._context.setFixContextCallback(this._FixRendererContext.bind(this));

    this._context.setCustomElement(this._IsCustomElement());

    // Set high contrast mode if needed
    if ($(document.body).hasClass('oj-hicontrast'))
      dvt.Agent.setHighContrast(true);

    // Create and cache the component instance
    this._component = this._CreateDvtComponent(this._context, this._HandleEvent, this);

    // Add the component to the display tree of the rendering context.
    this._context.getStage().addChild(this._component);

    // If requireJS is not used, can't rely on internationalization modules.
    if(dvt['requireJS'] !== false) {
      // Set the helpers for locale support
      this._setLocaleHelpers();

      // Retrieve and apply the translated strings onto the component bundle
      this._processTranslations();
    }

    // Load component resources
    this._LoadResources();

    // Pass the environment and widget constructor through the options for JET specific behavior
    this.options['_environment'] = 'jet';
    this.options['_widgetConstructor'] = oj.Components.__GetWidgetConstructor(this.element);
  },

  //** @inheritdoc */
  _AfterCreate : function ()
  {
    // Allow superclass to process root attributes and context menus
    this._super();

    // Resize Listener Support
    if(this.options['trackResize'] != 'off') {
      this._addResizeListener();
    }

    this._ProcessOptions();

    // Render the component
    this._Render();
  },

  //** @inheritdoc */
  refresh : function() {
    this._super();

    // Update the reading direction on the context
    this._context.setReadingDirection(this._GetReadingDirection());

    // Retrieve and apply the translated strings onto the component bundle
    this._processTranslations();

    // Render the component with any changes
    this._Render();
  },

  //** @inheritdoc */
  getNodeBySubId : function(locator) {
    var automation = (this._component && this._component.getAutomation) ? this._component.getAutomation() : null;
    if (automation) {
      // Convert the locator to the subid string, since the shared JS layer only accepts the subid string syntax.
      var subId = this._ConvertLocatorToSubId(locator);
      return automation.getDomElementForSubId(subId);
    }
    return null;
  },

  //** @inheritdoc */
  getSubIdByNode : function(node) {
    var automation = (this._component && this._component.getAutomation) ? this._component.getAutomation() : null;
    if (automation) {
      // Retrieve the subid string from the shared JS layer, and convert it to the locator object.
      var subId = automation.getSubIdForDomElement(node);
      return subId ? this._ConvertSubIdToLocator(subId) : null;
    }
    return null;
  },

  /**
   * Converts the specified locator object into a subId string.
   * @param {Object} locator
   * @return {string|null}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _ConvertLocatorToSubId : function(locator) {
    // subclasses must override to support getNodeBySubId
    return null;
  },

  /**
   * Converts the specified subId string into a locator object.
   * @param {string} subId
   * @return {Object|null}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _ConvertSubIdToLocator : function(subId) {
    // subclasses must override to support getSubIdByNode
    return null;
  },

  /**
   * Create dummy divs for style classes and merge style class values with json .
   * options object
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _ProcessStyles : function() {
    // Process selectors for this component
    DvtStyleProcessor.processStyles(this.element, this.options,
                                    this._GetComponentStyleClasses(),
                                    this._GetChildStyleClasses());
  },

  /**
   * Returns the style classes associated with the component.
   * @return {Array}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetComponentStyleClasses : function() {
    return ['oj-dvtbase'];
  },

  /**
   * Returns a map of the style classes associated with a component's children.
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetChildStyleClasses : function() {
    var styleClasses = {};
    styleClasses['oj-dvt-no-data-message'] = {'path': '_statusMessageStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    return styleClasses;
  },

  /**
   * Returns an array of supported event types.  Used in conjunction with _setOptions to skip unnecessary rendering when
   * event listeners are bound. Subclasses must override to return supported event types.
   * @return {Array}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetEventTypes : function() {
    return [];
  },

  /**
   * Returns a map containing keys corresponding to the string ids in ojtranslations.js and values corresponding to the
   * toolkit constants for the DvtBundle objects.  This map must be guaranteed to be a new instance so that subclasses can
   * add their translations to it.
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Create the mapping to return.
    var ret = {
      'DvtUtilBundle.CLEAR_SELECTION': translations['labelClearSelection'],
      'DvtUtilBundle.COLON_SEP_LIST' : translations['labelAndValue'],
      'DvtUtilBundle.INVALID_DATA': translations['labelInvalidData'],
      'DvtUtilBundle.NO_DATA': translations['labelNoData'],

      // Accessibility
      'DvtUtilBundle.DATA_VISUALIZATION': translations['labelDataVisualization'],
      'DvtUtilBundle.STATE_SELECTED': translations['stateSelected'],
      'DvtUtilBundle.STATE_UNSELECTED': translations['stateUnselected'],
      'DvtUtilBundle.STATE_MAXIMIZED': translations['stateMaximized'],
      'DvtUtilBundle.STATE_MINIMIZED': translations['stateMinimized'],
      'DvtUtilBundle.STATE_EXPANDED': translations['stateExpanded'],
      'DvtUtilBundle.STATE_COLLAPSED': translations['stateCollapsed'],
      'DvtUtilBundle.STATE_ISOLATED': translations['stateIsolated'],
      'DvtUtilBundle.STATE_HIDDEN': translations['stateHidden'],
      'DvtUtilBundle.STATE_VISIBLE': translations['stateVisible'],

      'DvtUtilBundle.SCALING_SUFFIX_THOUSAND': translations['labelScalingSuffixThousand'],
      'DvtUtilBundle.SCALING_SUFFIX_MILLION': translations['labelScalingSuffixMillion'],
      'DvtUtilBundle.SCALING_SUFFIX_BILLION': translations['labelScalingSuffixBillion'],
      'DvtUtilBundle.SCALING_SUFFIX_TRILLION': translations['labelScalingSuffixTrillion'],
      'DvtUtilBundle.SCALING_SUFFIX_QUADRILLION': translations['labelScalingSuffixQuadrillion']
    };

    // Add abbreviated month strings
    var monthNames = oj.LocaleData.getMonthNames("abbreviated");
    ret['DvtUtilBundle.MONTH_SHORT_JANUARY'] = monthNames[0];
    ret['DvtUtilBundle.MONTH_SHORT_FEBRUARY'] = monthNames[1];
    ret['DvtUtilBundle.MONTH_SHORT_MARCH'] = monthNames[2];
    ret['DvtUtilBundle.MONTH_SHORT_APRIL'] = monthNames[3];
    ret['DvtUtilBundle.MONTH_SHORT_MAY'] = monthNames[4];
    ret['DvtUtilBundle.MONTH_SHORT_JUNE'] = monthNames[5];
    ret['DvtUtilBundle.MONTH_SHORT_JULY'] = monthNames[6];
    ret['DvtUtilBundle.MONTH_SHORT_AUGUST'] = monthNames[7];
    ret['DvtUtilBundle.MONTH_SHORT_SEPTEMBER'] = monthNames[8];
    ret['DvtUtilBundle.MONTH_SHORT_OCTOBER'] = monthNames[9];
    ret['DvtUtilBundle.MONTH_SHORT_NOVEMBER'] = monthNames[10];
    ret['DvtUtilBundle.MONTH_SHORT_DECEMBER'] = monthNames[11];

    return ret;
  },

  /**
   * Called to process the translated strings for this widget.
   * @private
   */
  _processTranslations: function() {
    // Retrieve the map of translation keys + DvtBundle identifiers
    var translationMap = this._GetTranslationMap();

    // Register with the DvtBundle
    dvt.Bundle.addLocalizedStrings(translationMap);
  },

  /**
   * @private
   * @instance
   * @memberof! oj.dvtBaseComponent
   */
  _setLocaleHelpers : function () {
    var helpers = {};

    // Number converter factory for use in formatting default strings
    helpers['numberConverterFactory'] = oj.Validation.getDefaultConverterFactory('number');

    // Date to iso converter to be called before passing to the date time converter
    helpers['dateToIsoConverter'] = function(input) {
      return (input instanceof Date) ? oj.IntlConverterUtils.dateToLocalIso(input) : input;
    }

    // Iso to date converter to be called for JS that requires Dates
    helpers['isoToDateConverter'] = function(input) {
      if (typeof(input) == 'string') {
        var dateWithTimeZone = oj.IntlConverterUtils.isoToDate(input);
        var localIsoTime = dateWithTimeZone.toJSON() ? oj.IntlConverterUtils.dateToLocalIso(dateWithTimeZone) : input;
        return oj.IntlConverterUtils.isoToLocalDate(localIsoTime);
      }
      else
        return input;
    }

    // Date to iso converter to be called before passing to the date time converter
    helpers['dateToIsoWithTimeZoneConverter'] = function(input) {
      if (input instanceof Date) {
        var timeZoneOffest = -1*input.getTimezoneOffset();
        var offsetSign = (timeZoneOffest >= 0 ? "+" : "-");
        var offsetHour = Math.floor(Math.abs(timeZoneOffest)/60);
        var offsetMinutes = Math.abs(timeZoneOffest)%60;
        var isoTimeZone =  offsetSign+(offsetHour.toString().length !== 2 ? "0"+offsetHour : offsetHour)+":"+ (offsetMinutes.toString().length !== 2 ? offsetMinutes+"0" : offsetMinutes);
        return oj.IntlConverterUtils.dateToLocalIso(input) + isoTimeZone;
      }
      else
        return input;
    }

    this._context.setLocaleHelpers(helpers);
  },

  //** @inheritdoc */
  _destroy : function() {
    // Hide all component tooltips and remove references to the DvtContext
    this._context.hideTooltips();
    this._context = null;

    var parentElement = this.element[0].parentElement;
    if (parentElement && parentElement._dvtcontext)
      parentElement._dvtcontext = null;

    // Call destroy on the JS component
    if (this._component.destroy)
      this._component.destroy();
    this._component = null;

    // Remove DOM resize listener
    this._removeResizeListener();

    this._CleanAllTemplates();
    
    // Remove children and clean up DOM changes
    this.element.children().remove();
    this.element.removeAttr('role').removeAttr('tabIndex').removeAttr('aria-activedescendant');

    // Remove style classes that were added
    var componentStyles = this._GetComponentStyleClasses();
    for(var i=0; i<componentStyles.length; i++) {
      this.element.removeClass(componentStyles[i]);
    }
    
    // Remove any pending busy states
    this._MakeReady();

    // Call super last for destroy
    this._super();
  },

  //** @inheritdoc */
  _setOptions : function(options, flags) {
    // Call the super to update the property values
    this._superApply(arguments);

    // Add or remove the resize tracking if changed.
    var trackResize = this.options['trackResize'];
    if(trackResize == 'off' && this._resizeListener)
      this._removeResizeListener();
    else if(trackResize != 'off' && !this._resizeListener)
      this._addResizeListener();

    this._ProcessOptions();

    // Render the component with the updated options.
    if(this._bUserDrivenChange) {
      // Option change fired in response to user gesture. Already reflected in UI, so no render needed.
      return;
    }
    else {
      // Event listeners don't require rendering.  Iterate through options to check for non-event options.
      // Also no render is needed if the component has exposed a method to update the option without rerendering.
      var bRenderNeeded = false;
      var eventTypes = this._GetEventTypes();
      var optimizedOptions = ['highlightedCategories', 'selection', 'dataCursorPosition'];
      $.each(options, function(key, value) {
        if(eventTypes.indexOf(key) < 0 && optimizedOptions.indexOf(key) < 0) {
          bRenderNeeded = true;
          return false;
        }
      });

      if(bRenderNeeded)
        this._Render();
      else {
        // Update options without rerendering. Check for undefined to allow nulls.
        if (options['highlightedCategories'] !== undefined)
          this._component.highlight(options['highlightedCategories']);
        if (options['selection'] !== undefined)
          this._component.select(options['selection']);
        if (options['dataCursorPosition'] !== undefined && this._component.positionDataCursor)
          this._component.positionDataCursor(options['dataCursorPosition']);
      }
    }
  },


  /**
   * Called by _create to instantiate the specific DVT component instance.  Subclasses must override.
   * @param {dvt.Context} context
   * @param {Function} callback
   * @param {Object} callbackObj
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    return null; // subclasses must override
  },

  /**
   * Called by the component to process events.  Subclasses should override to delegate DVT component events to their
   * JQuery listeners.
   * @param {Object} event
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _HandleEvent : function(event) {
    // TODO: hiddenCategories and highlightedCategories should use the option change event

    var type = event['type'];
    if(type === 'selection') {
      this._UserOptionChange('selection', event['selection']);
    }
    else if (type === 'categoryHide' || type === 'categoryShow') {
      this._UserOptionChange('hiddenCategories', event['hiddenCategories']);
    }
    else if (type === 'categoryHighlight') {
      this._UserOptionChange('highlightedCategories', event['categories']);
    }
    else if (type === 'optionChange') {
      this._UserOptionChange(event['key'], event['value'], event['optionMetadata']);
    }
    else if (type === 'touchHoldRelease' && this._GetContextMenu()) {
      this._OpenContextMenu($.Event(event['nativeEvent']), 'touch');
    }
    else if (type === 'ready') {
      // Handles case where two option sets occur and the second set
      // containing deferred data. We don't want to prematurely resolve
      // any when ready promises until the deferred data has finished.
      if (this._numDeferredObjs === 0)
        this._MakeReady();
    }
  },

  /**
   * Adds a resize listener for this component.
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _addResizeListener : function() {
    if(!this._resizeListener) {
      this._resizeListener = this._handleResize.bind(this);
      oj.DomUtils.addResizeListener(this.element[0], this._resizeListener, 250);
    }
  },

  /**
   * Removes the resize listener for this component.
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _removeResizeListener : function() {
    if(this._resizeListener) {
      oj.DomUtils.removeResizeListener(this.element[0], this._resizeListener);
      this._resizeListener = null;
    }
  },

  /**
   * Called when the component is resized.
   * @param {number} width
   * @param {number} height
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _handleResize : function(width, height) {
    // Render the component at the new size if it changed enough
    var newWidth = this.element.width();
    var newHeight = this.element.height();
    if(this._width == null || this._height == null || (Math.abs(newWidth - this._width) + Math.abs(newHeight - this._height) >= 5))
      this._Render(true);
  },

  /**
   * Called once during component creation to load resources.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _LoadResources : function() {
    // subcomponents should override
  },

  /**
   * Called to render the component at the current size.
   * @param {boolean} isResize (optional) Whether it is a resize rerender.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _Render : function(isResize) {
    // Hide all component tooltips on rerender cases to avoid abandoned tooltips
    this._context.hideTooltips();

    // Starting a new render - no longer ready
    this._NotReady();

    // Fix 18498656: If the component is not attached to a visible subtree of the DOM, rendering will fail because
    // getBBox calls will not return the correct values.
    // Note: Checking offsetParent() does not work here since it returns false for position: fixed.
    if(!this._context.isReadyToRender()) {
      this._renderNeeded = true;
      this._MakeReady();
    }
    else {
      // If flowing layout is supported, don't pass width and height to the component render method
      this._width = this._IsFlowingLayoutSupported() ? null : this.element.width();
      this._height = this._IsFlowingLayoutSupported() ? null : this.element.height();
      
      // Set the root font-family
      this._context.setDefaultFontFamily(this._referenceDiv.css('font-family'));

      // Add the width, height, and locale as private fields in the options for debugging purposes
      this.options['_width'] = this._width;
      this.options['_height'] = this._height;
      this.options['_locale'] = oj.Config.getLocale();

      // Add draggable attribute if DnD is supported
      if (this.options['dnd'])
        this.element.attr('draggable', true);

      // Merge css styles with with json options object
      this._ProcessStyles();

      // Render the component.
      this._renderCount++;
      // Skip the options on resize to suppress animation.
      if (isResize) {
        // Skip the resize render if Promises are not fully resolved because
        // the component will be rerendered with the new width/height when all
        // Promises are fully resolved
        if (this._numDeferredObjs === 0) {
          this._RenderComponent(this._optionsCopy, isResize);
        }
      } else {
        // Component rendering will be done when all Promises are fully resolved
        if (this._resolveDeferredDataItems()) {
          this._RenderComponent(this._optionsCopy);
        }
      }

      this._renderNeeded = false;
    }
  },

  //** @inheritdoc */
  _NotifyShown: function()
  {
    this._super();
    this._notifyShownAttached();
  },

  //** @inheritdoc */
  _NotifyAttached: function()
  {
    this._super();
    this._notifyShownAttached();
  },

  //** @inheritdoc */
  _NotifyDetached : function() 
  {
    this._super();
    this._notifyHiddenDetached();
  },

  //** @inheritdoc */
  _NotifyHidden : function() 
  {
    this._super();
    this._notifyHiddenDetached();
  },

  /**
   * Helper method to perform common logic for when 
   * a DVT is hidden or detached from the DOM.
   * @memberof oj.dvtBaseComponent
   * @instance
   * @private
   */
  _notifyShownAttached: function()
  {
    if(this._renderNeeded)
      this._Render();
  },

  /**
   * Helper method to perform common logic for when 
   * a DVT is shown or detached from the DOM.
   * @memberof oj.dvtBaseComponent
   * @instance
   * @private
   */
  _notifyHiddenDetached: function() 
  {
    this._context.hideTooltips();

    // Remove any pending busy states
    this._MakeReady();
  },

  /**
   * Sets an option change that was driven by user gesture.  Used in conjunction with _setOption to ensure that the
   * correct optionMetadata flag for writeback is set.
   * @param {string} key The name of the option to set.
   * @param {Object} value The value to set for the option.
   * @param {Object} optionMetadata The optionMetadata for the optionChange event
   * @memberof oj.dvtBaseComponent
   * @instance
   * @protected
   */
  _UserOptionChange : function(key, value, optionMetadata) {
    this._bUserDrivenChange = true;

    this.option(key, value, {'_context': {writeback:true, optionMetadata: optionMetadata, internalSet: true}});

    this._bUserDrivenChange = false;
  },

  //** @inheritdoc */
  _NotifyContextMenuGesture: function(menu, event, eventType) {
    // DVTs support context menus on touch hold release which is detected by the
    // toolkit and handled in _HandleEvent after receiving touch hold release event.
    if (eventType === "touch")
      return;
    // Position context menus relative to the current keyboard focus when keyboard triggered
    else if (eventType === "keyboard") {
      var compElementRect = this.element[0].getBoundingClientRect(),
        focusElementRect = this._component.getKeyboardFocus() ? this._component.getKeyboardFocus().getBoundingClientRect() : null;
      var position = focusElementRect ? 
        "left+" + (focusElementRect.left + focusElementRect.width*.5 - compElementRect.left) + " top+" + (focusElementRect.top + focusElementRect.height*.5 - compElementRect.top) : "center";
      this._OpenContextMenu(event, eventType, {"position": {"at": position}});
    }
    else
      this._super(menu, event, eventType);
  },

  /**
   * Returns a DVT component associated with a DOMElement
   * @param {Element} element The DOMElement to get the DVT component from.
   * @return {Object} The DVT component associated with the DOMElement or null
   * @memberof oj.dvtBaseComponent
   * @instance
   * @protected
   */
  _GetDvtComponent: function(element) {
    var widget = oj.Components.__GetWidgetConstructor(element)("instance");
    if (widget) {
      return widget._component;
    }
    return null;
  },

  /**
   * Converts an indexPath array to a string of the form '[index0][index1]...[indexN]'.
   * @param {Array} indexPath
   * @return {string} The resulting string.
   * @instance
   * @memberof oj.dvtBaseComponent
   * @protected
   */
  _GetStringFromIndexPath : function(indexPath) {
    var ret = '';
    for(var i=0; i<indexPath.length; i++) {
      ret += '[' + indexPath[i] + ']';
    }
    return ret;
  },

  /**
   * Converts a string containing indices in the form '[index0][index1]...[indexN]' to an array of indices.
   * @param {string} subId
   * @return {Array} The resulting array to be used for locator indexPath.
   * @instance
   * @memberof oj.dvtBaseComponent
   * @protected
   */
  _GetIndexPath : function(subId) {
    var indexPath = [];
    var currentIndex = 0;
    while(subId.indexOf('[', currentIndex) > 0) {
      var start = subId.indexOf('[', currentIndex) + 1;
      var end = subId.indexOf(']', currentIndex)
      indexPath.push(Number(subId.substring(start, end)));
      currentIndex = end + 1;
    }
    return indexPath;
  },

  /**
   * Converts a string containing a single index in the form '[index]' into the numerical index.
   * @param {string} subId
   * @return {number}
   * @instance
   * @memberof oj.dvtBaseComponent
   * @protected
   */
  _GetFirstIndex : function(subId) {
    return Number(this._GetFirstBracketedString(subId));
  },

  /**
   * Returns the first bracketed substring in the specified string.
   * @param {string} subId
   * @return {string}
   * @instance
   * @memberof oj.dvtBaseComponent
   * @protected
   */
  _GetFirstBracketedString : function(subId) {
    var start = subId.indexOf('[') + 1;
    var end = subId.indexOf(']');
    return subId.substring(start, end);
  },

  /**
   * Returns an object containing the top level options key and subkeys for
   * deferred data options.  'root' is used for top level keys. For example,
   * {'areaLayers': ['areaDataLayer/areas', 'areaDataLayer/markers'] indicates
   * that we should check this.options['areaLayers'][i]['areaDataLayer']['areas']
   * and this.options['areaLayers'][i]['areaDataLayer']['markers']. To indicate
   * a top level option, use the options key 'root', i.e. {'root': ['items']}.
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetComponentDeferredDataPaths : function() {
    return {};
  },

  /**
   * Returns an object containing the no clone paths for a component. For example,
   * {'areaLayers': {'areaDataLayer': {'areas': true, 'markers': true}}} indicates
   * that we should check this.options['areaLayers'][i]['areaDataLayer']['areas']
   * and this.options['areaLayers'][i]['areaDataLayer']['markers']. The base implementation
   * will handle the basic case where the deferred data path contains only top level data options.
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetComponentNoClonePaths : function() {
    if (!this._noClonePaths) {
      this._noClonePaths = {};
      var self = this;
      var rootPaths = this._GetComponentDeferredDataPaths()['root'];
      if (rootPaths) {
        rootPaths.forEach(function(path) {
          self._noClonePaths[path] = true;
        });
      }
    }
    return this._noClonePaths;
  },

  /**
   * Resolves the deferred data for a component and returns whether there is any deferred data to wait on.
   * @return {boolean} True if all data has been resolved
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _resolveDeferredDataItems : function() {
    // Reset stored options copy so we get the updated copy
    // Make a copy of options except for data options with the noClone parameter on DvtJsonUtils.
    // Cloning shouldn't be expensive if we're skipping data.
    this._optionsCopy =  dvt.JsonUtils.clone(this.options, null, this._GetComponentNoClonePaths());
    this._FixCustomRenderers(this._optionsCopy);
    this._numDeferredObjs = 0;

    var self = this;
    var paths = this._GetComponentDeferredDataPaths();
    // Do an initial loop to determine if we need to copy the options object
    for (var path in paths) {
      var subpaths = paths[path];
      subpaths.forEach(function(subpath) {
        if (path === 'root') {
          self._resolveDeferredDataItem.bind(self)(self.options, self._optionsCopy, subpath);
        } else {
          // Deal with arrays suboptions that are arrays like legend's options['sections']
          var suboptions = self.options[path];
          if (suboptions) {
            for (var i = 0; i < suboptions.length; i++)
              self._resolveDeferredDataItem.bind(self)(suboptions[i], self._optionsCopy[path][i], subpath);
          }
        }
      });
    }
    return this._numDeferredObjs === 0;
  },

  /**
   * Resolves a deferred data item for a given options object and option path.
   * @param {Object} optionsFrom The option object to copy from
   * @param {Object} optionsTo The option object to copy to
   * @param {string} path  The option path to use
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _resolveDeferredDataItem : function(optionsFrom, optionsTo, path) {
    var optionPath = new DvtJsonPath(optionsFrom, path);
    var optionValue = optionPath.getValue();
    if (optionValue instanceof Function) {
      // Call functions and update the option value, creating a Promise from the result
      optionValue = Promise.resolve(optionValue(this._GetDataContext(optionsFrom)));
    }
    else if (this._IsCustomElement() && Array.isArray(optionValue)) {
      // For custom elements, the getter always should return a Promise for 
      // data options so we just always convert arrays to Promises in the setter
      optionValue = Promise.resolve(optionValue);
      optionPath.setValue(optionValue, true);
    }
    
    if (optionValue instanceof Promise) {
      var renderCount = this._renderCount;
      var self = this;
      optionValue.then(
        function(value) {
          self._renderDeferredData(renderCount, optionsTo, path, value);
        },
        function(reason) {
          self._renderDeferredData(renderCount, optionsTo, path, []);
        }
      );
      this._numDeferredObjs++;
    }
  },

  /**
   * Checks to see if all deferred data promises have been resolved or rejected,
   * updates the options copy with the resolved value and renders the component when ready.
   * @param {number} renderCount The render count when this Promise was evaluated
   * @param {Object} optionsTo The option object to copy to
   * @param {string} path  The option path to use
   * @param {Object} value The value to update the option path with
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _renderDeferredData : function(renderCount, optionsTo, path, value) {
    if (renderCount === this._renderCount) {
      this._numDeferredObjs--;
      (new DvtJsonPath(optionsTo, path)).setValue(value, true);
      if (this._numDeferredObjs === 0) {
        this._RenderComponent(this._optionsCopy);
        this._optionsCopy = null;
      }
    }
  },

  /**
   * Renders the component.
   * @param {Object} options The options to render the component with
   * @param {boolean} isResize True if we are rendering due to a resize event.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _RenderComponent : function(options, isResize) {
    // Cleanup
    this._CleanAllTemplates();

    // If flowing layout is supported, resize may happen during render, but we
    // don't want the resize listener to be triggered as it causes double render.
    // Thus we should remove the resize listener temporarily.
    var bRemoveResizeListener = this._IsFlowingLayoutSupported() && this._resizeListener;
    if (bRemoveResizeListener)
      this._removeResizeListener();

    this._component.render(isResize ? null : options, this._width, this._height);

    if (bRemoveResizeListener)
      this._addResizeListener();

    // Remove the tabindex from the element to disable keyboard handling if the component
    // does not have a role on the parent element like for non-interactive legends
    if (!this.element.attr("role"))
      this.element.attr("tabindex", null);
    else
      this.element.attr("tabindex", 0);
  },

  /**
   * Returns the data context passed to data function callbacks.
   * @param {Object} options The options to retrieve the data context for
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetDataContext : function(options) {
    return {};
  },

  /**
   * Returns whether flowing layout is supported for the component.
   * If this returns true, the component will render at the preferred size of
   * the component if the user doesn't specify the width and height in the div.
   * If this returns false, the component will always render at the browser-
   * computed width and height.
   * @return {boolean}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _IsFlowingLayoutSupported : function() {
    return false;
  },

  /**
   * Returns a promise that is resolved when the component is finished rendering.
   * This can be used to determine when it is okay to call automation and other APIs on the component.
   * @returns {Promise}
   * @ignore
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  whenReady : function() {
    if (this._ready)
      return Promise.resolve(true);
    if (!this._promise) {
      var self = this;
      this._promise = new Promise(function(resolve) {
        self._promiseResolve = resolve;
      });
    }
    return this._promise;
  },

  /**
   * Called by component to declare rendering is not finished. This method currently handles the ready state
   * for the component whenReady API, the page level BusyContext, and the static whenReady API for the custom element
   * version of this component.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _NotReady : function() {
    // For component whenReady API
    this._ready = false;

    // For page level BusyContext
    // Only decrement ready state when there's no deferred data. Otherwise rendering will be blocked 
    // until all deferred data are resolved and we will only get one ready state increment.
    if (this._numDeferredObjs === 0) {
      // If we've already registered a busy state with the page's busy context, don't need to do anything further
      if (!this._readyResolveFunc) {
        var busyContext = oj.Context.getContext(this.element[0]).getBusyContext();
        var options = {'description' : "The component identified by '" + this.element.attr('id') + "' is being loaded."};
        this._readyResolveFunc = busyContext.addBusyState(options);
      }
    }
  },

  /**
   * Called by component to declare rendering is finished. This method currently handles the ready state
   * for the component whenReady API, the page level BusyContext, and the static whenReady API for the custom element
   * version of this component.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _MakeReady : function() {
    // For component whenReady API
    if (this._promiseResolve) {
      this._promiseResolve(true);
      this._promiseResolve = null;
    }
    this._ready = true;
    this._promise = null;

    // For page level BusyContext
    if (this._readyResolveFunc) {
      this._readyResolveFunc();
      this._readyResolveFunc = null;
    }
  },

  /**
   * Sanitize options variables
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _ProcessOptions: function() {
    // Convert the tooltip to an object if the deprecated API structure is passed in
    var tooltip = this.options['tooltip'];
    if (typeof tooltip === 'function') {
      this.options['tooltip'] = {'renderer' : tooltip};
    }
    else if (tooltip && tooltip['_renderer']) {
      this.options['tooltip'] = {'renderer' : this._GetTemplateRenderer(tooltip['_renderer'], 'tooltip')};
    }
  },

  /**
   * Returns a wrapper function for custom elements that converts an object
   * returned by a custom renderer into an old format supported by widgets 
   * and toolkit code.
   * @param {Function} origRenderer Renderer function called to create custom content
   * @return {Function} A wrapper function that will used to convert result into toolkit format
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _WrapCustomElementRenderer: function (origRenderer) {
    var self = this;
    var customRenderer = function (context) {
      //add dvt context for the knockout template rendering
      context['_dvtcontext'] = self._context; 
      var obj = origRenderer(context);
      
      // template cleanup section - template name and cleanup function are passed through context
      if (context['_templateName'] && context['_templateCleanup']) {
        self._AddTemplate(context['_templateName'], context['_templateCleanup']);
      }
      
      //tooltip case: don't check 'insert' property, if 'preventDefault' is set to true
      if (obj && obj['preventDefault'] !== true && obj['insert'] ) {
        var insertObj = obj['insert'];
        // handle returns for knockout template renderer
        if (insertObj.classList && insertObj.classList.contains("oj-dvtbase")) {
          return self._GetDvtComponent(insertObj);
        }
        return insertObj;
      }
      else {
        return null;
      }
    }
    return customRenderer;
  },

  /**
   * Iterates through custom renderer options and replaces them with wrapper  
   * functions that supports format accepted by DVT Toolkit components
   * @param {Object} options Options for rendering the component
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _FixCustomRenderers: function (options) {
    if (this._IsCustomElement()) {
      var renderers = this._GetComponentRendererOptions();
      for(var i = 0; i < renderers.length; i++) {
        var optionPath = renderers[i];
        var path = new DvtJsonPath(options, optionPath);
        var value = path.getValue();
        if (value) {
          path.setValue(this._WrapCustomElementRenderer(value), true);
        }
      }
    }
  },

  /**
   * Returns an array of options that contain custom renderer paths 
   * for the given component.
   * @return {Array}
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _GetComponentRendererOptions: function() {
    return ['tooltip/renderer'];
  },

  /**
   * Creates a callback function that will be used as a custom renderer for a template that will be used directly.
   * @param {Function} templateFunction Template function used to render a knockout template
   * @param {string} templateName The name of the template
   * @return {Function} A function that will be used as a custom renderer
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _GetTemplateRenderer: function(templateFunction, templateName) {
    var self = this;
    var templateRenderer = function (context) {
      // Create a dummy div
      var dummyDiv = document.createElement("div");
      dummyDiv.style.display = "none";

      // Call the ko template renderer with the dummy div and context
      templateFunction({'parentElement': dummyDiv, 'context': context});

      var elem = dummyDiv.children[0];
      if (elem) {
        // Save a reference to cleanup function for the dummyDiv 
        // for ko cleanup to prevent memory leaks
        self._AddTemplate(templateName, function(){$(dummyDiv).remove();});

        dummyDiv.removeChild(elem);
        $(dummyDiv).remove();
        return elem;
      }
      return null;
    };
    return templateRenderer;
  },

  /**
   * Creates a callback function that will be used as a custom renderer for data items.
   * For components like ojDiagram and ojThematicMap that supports ko templates for stamping
   * data items, the component will reparent the svg element so we have special dummyDiv handling
   * for these cases.
   * @param {Function} templateFunction Template function used to render a knockout template
   * @param {string} templateName The name of the template
   * @return {Function} A function that will be used as a custom renderer
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _GetTemplateDataRenderer: function(templateFunction, templateName) {
    var self = this;
    var templateRenderer = function (context) {
      // Create a dummy div
      var dummyDiv = document.createElement("div");
      dummyDiv.style.display = "none";
      dummyDiv._dvtcontext = self._context;
      self.element.append(dummyDiv); // @HTMLUpdateOK

      // Call the ko template renderer with the dummy div and context
      templateFunction({'parentElement': dummyDiv, 'data': context['data']});

      var elem = dummyDiv.children[0];
      if (elem) {
        // Save a reference to cleanup function for the dummyDiv 
        // for ko cleanup to prevent memory leaks
        self._AddTemplate(templateName, function(){$(dummyDiv).remove();});

        // The dummy div can be removed for custom svg elements, but need to be
        // kept around for stamped DVTs so the oj components aren't removed.
        if (elem.namespaceURI === 'http://www.w3.org/2000/svg') {
          dummyDiv.removeChild(elem);
          $(dummyDiv).remove();
          return elem;
        } else {
          return self._GetDvtComponent(elem);
        }
      }
      return null;
    };
    return templateRenderer;
  },

  /**
   * Cleans all templates stored by the component
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _CleanAllTemplates: function() {
    for (var templateName in this._templateMap) {
      this._CleanTemplate(templateName);
    }    
    this._templateMap = {};
  },

  /**
   * Cleans a specific template stored by the component
   * @param {string} templateName The name of the template to clean
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _CleanTemplate: function(templateName) {
    if (this._templateMap[templateName]) {
      var length = this._templateMap[templateName].length;
      for (var i = 0; i < length; i++) {
        this._templateMap[templateName][i]();
      }
      this._templateMap[templateName] = [];
    }
  },

  /**
   * Adds a cleanup function that should be used to cleanup a specific template. 
   * @param {string} templateName The name of the template to clean
   * @param {Function} cleanupCallback A callback function to cleanup the template
   * @protected
   * @memberof oj.dvtBaseComponent
   */
  _AddTemplate: function(templateName, cleanupCallback) {
    if (!this._templateMap[templateName]) {
      this._templateMap[templateName] = [];
    }
    this._templateMap[templateName].push(cleanupCallback);    
  },

  //** @inheritdoc */
  _CompareOptionValues: function(option, value1, value2)
  {
    switch(option)
    {
      case 'hiddenCategories':
      case 'highlightedCategories':
      case 'selection':
        return oj.Object.compareValues(value1, value2);
      default:
        return this._super(option, value1, value2);
    }
  }

}, true);

(function() {

// Consider a string with at least one digit a valid SVG path
var _SHAPE_REGEXP = /\d/;
// Default shape types supported by DvtSimpleMarker
var _SHAPE_ENUMS = {
  "circle": true,
  "ellipse": true,
  "square": true,
  "rectangle": true,
  "diamond": true,
  "triangleUp": true,
  "triangleDown": true,
  "plus": true,
  "human": true,
  "star": true
};

function shapeParseFunction(shapeAttrs, shapeEnums) {
  var shapes = shapeEnums || _SHAPE_ENUMS;
  return function(value, name, meta, defaultParseFunction) {
    if (shapeAttrs[name]) {
      if (_SHAPE_REGEXP.test(value))
        return value;
      else if (!shapes[value])
        throw new Error("Found: '" + value + "'. Expected one of the following: " + Object.keys(shapeEnums).toString());
      else
        return value;
    }
    return defaultParseFunction(value);
  };
};

var dvtBaseComponentMeta = {
  "properties": {
    "trackResize": {
      "type": "string"
    },
    "translations": {
      "properties": {
        "labelAndValue": {
          "type": "string"
        },
        "labelClearSelection": {
          "type": "string"
        },
        "labelCountWithTotal": {
          "type": "string"
        },
        "labelDataVisualization": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "stateCollapsed": {
          "type": "string"
        },
        "stateDrillable": {
          "type": "string"
        },
        "stateExpanded": {
          "type": "string"
        },
        "stateHidden": {
          "type": "string"
        },
        "stateIsolated": {
          "type": "string"
        },
        "stateMaximized": {
          "type": "string"
        },
        "stateMinimized": {
          "type": "string"
        },
        "stateSelected": {
          "type": "string"
        },
        "stateUnselected": {
          "type": "string"
        },
        "stateVisible": {
          "type": "string"
        }
      }
    }
  },
  "methods": {},
  "extension": {
    _WIDGET_NAME: "dvtBaseComponent",
    _DVT_PARSE_FUNC: shapeParseFunction
  }
};
oj.CustomElementBridge.registerMetadata('dvtBaseComponent', 'baseComponent', dvtBaseComponentMeta);
})();
});
