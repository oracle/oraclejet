/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery'], function(oj, $)
{
  "use strict";

/**
 * Creates an attribute group handler that will generate stylistic attribute values such as colors or shapes based on data set categories.
 *
 * @param {Object.<string, *>=} [matchRules] A map of key value pairs for categories and the matching attribute value e.g. {"soda" : "square", "water" : "circle", "iced tea" : "triangleUp"}.
 *                            Attribute values listed in the matchRules object will be reserved only for the matching categories when getAttributeValue is called.
 * @ojsignature {target: "Type", value: "{[propName: string]: any}", for: "matchRules"}
 * @export
 * @constructor
 * @final
 * @since 1.0
 * @name oj.AttributeGroupHandler
 */
var AttributeGroupHandler = function (matchRules) {
  this.Init(matchRules);
};

oj.Object.createSubclass(AttributeGroupHandler, oj.Object, 'AttributeGroupHandler');

AttributeGroupHandler.prototype.Init = function (matchRules) {
  this._assignments = {};
  this._valueIndex = 0;
  this._matchRules = {};
  if (matchRules != null) {
    var categories = Object.keys(matchRules);
    for (var i = 0; i < categories.length; i++) {
      var category = categories[i];
      this.addMatchRule(category, matchRules[category]);
    }
  }
  // Delay initializing value ramp by calling subclass getValueRamp impl until needed either for adding match rule or assigning values
};

/**
 * Returns the array of possible attribute values for this attribute group handler.
 * @returns {Array.<any>} The array of attribute values
 * @memberof oj.AttributeGroupHandler
 * @method getValueRamp
 * @instance
 * @export
 */
AttributeGroupHandler.prototype.getValueRamp = function () {
  return [];
};

/**
 * Assigns the given category an attribute value.  Will consistently return the same attribute value for equal categories.
 * @param {string} category The category to assign
 * @returns {any} The attribute value for the category
 * @memberof oj.AttributeGroupHandler
 * @method getValue
 * @instance
 * @export
 */
AttributeGroupHandler.prototype.getValue = function (category) {
  // When assigning value, first check match rules, then assign to next attribute group value.
  if (this._matchRules[category]) {
    return this._matchRules[category];
  } else if (!this._assignments[category]) {
    if (!this._values) {
      this._values = this.getValueRamp().slice();
    }

    this._assignments[category] = this._values[this._valueIndex];

    this._valueIndex += 1;
    if (this._valueIndex === this._values.length) {
      this._valueIndex = 0;
    }
  }
  return this._assignments[category];
};

/**
 * Returns the current list of assigned categories as an array of objects with "category" and "value" keys. Note that match rules are not
 * reflected in category assignments.
 * @return {Array.<Object.<string, *>>} The current list of category and value pairings
 * @ojsignature {target: "Type", value: "Array<{[propName: string]: any}>", for: "returns"}
 * @export
 * @memberof oj.AttributeGroupHandler
 * @method getCategoryAssignments
 * @instance
 */
AttributeGroupHandler.prototype.getCategoryAssignments = function () {
  var assignments = [];
  var categories = Object.keys(this._assignments);
  for (var i = 0; i < categories.length; i++) {
    var category = categories[i];
    assignments.push({ category: category, value: this._assignments[category] });
  }
  return assignments;
};

/**
 * Reserves an attribute value for the given category.  All match rules should be added before any category
 * assignments are done with the <a href="#getValue">getValue</a> API.
 * @param {string} category Used for checking inputs to getAttributeValue against when assigning an attribute value
 * @param {any} attributeValue The attribute value to assign for inputs matching the given category e.g. "square" or "circle"
 * @return {void}
 * @export
 * @memberof oj.AttributeGroupHandler
 * @method addMatchRule
 * @instance
 */
AttributeGroupHandler.prototype.addMatchRule = function (category, attributeValue) {
  this._matchRules[category] = attributeValue;
};


/**
 * Creates a color attribute group handler that will generate color attribute values.
 *
 * @param {Object.<string, string>=} [matchRules] A map of key value pairs for categories and the
 * matching attribute value e.g. {"soda" : "#336699", "water" : "#CC3300", "iced tea" : "#F7C808"}.
 * Attribute values listed in the matchRules object will be reserved only for the
 * matching categories when getAttributeValue is called.  Note that not all colors
 * in the default color ramp will meet minimum contrast requirements for text.
 * @ojsignature {target: "Type", value: "{[propName: string]: any}", for: "matchRules"}
 * @export
 * @constructor
 * @final
 * @since 1.2
 * @extends oj.AttributeGroupHandler
 * @name oj.ColorAttributeGroupHandler
 */
var ColorAttributeGroupHandler = function (matchRules) {
  // Create the array of colors for this instance.
  this._attributeValues = [];

  if ($(document.body).hasClass('oj-hicontrast')) {
    // High Contrast: CSS colors get overridden to all white or all black. Use the default colors instead.
    this._attributeValues = ColorAttributeGroupHandler._DEFAULT_COLORS.slice();
  } else {
    // Process the colors from the skin if not done already.
    // To improve performance, append the divs for each style class first then process the colors for each div.
    var attrGpsDiv = ColorAttributeGroupHandler.__createAttrDiv();
    if (attrGpsDiv) {
      ColorAttributeGroupHandler.__processAttrDiv(attrGpsDiv);
      attrGpsDiv.remove();
    }

    // Clone and use the processed colors.
    if (ColorAttributeGroupHandler._colors.length > 0) {
      this._attributeValues = ColorAttributeGroupHandler._colors.slice();
    } else {
      this._attributeValues = ColorAttributeGroupHandler._DEFAULT_COLORS.slice();
    }
  }

  this.Init(matchRules);
};
// eslint-disable-next-line no-undef
oj.Object.createSubclass(ColorAttributeGroupHandler, AttributeGroupHandler,
                         'ColorAttributeGroupHandler');

/** @private */
ColorAttributeGroupHandler._DEFAULT_COLORS = [
  '#237bb1', '#68c182', '#fad55c', '#ed6647',
  '#8561c8', '#6ddbdb', '#ffb54d', '#e371b2',
  '#47bdef', '#a2bf39', '#a75dba', '#f7f37b'
];

/** @private */
ColorAttributeGroupHandler._STYLE_CLASSES = [
  'oj-dvt-category1', 'oj-dvt-category2', 'oj-dvt-category3',
  'oj-dvt-category4', 'oj-dvt-category5', 'oj-dvt-category6',
  'oj-dvt-category7', 'oj-dvt-category8',
  'oj-dvt-category9', 'oj-dvt-category10', 'oj-dvt-category11', 'oj-dvt-category12'
];

/** @private */
ColorAttributeGroupHandler._colors = null;

/**
 * Returns the array of possible color values for this attribute group handler.
 * @returns {Array.<string>} The array of color values
 * @export
 * @method getValueRamp
 * @memberof oj.ColorAttributeGroupHandler
 * @instance
 */
ColorAttributeGroupHandler.prototype.getValueRamp = function () {
  return this._attributeValues;
};

/**
 * Creates an element and appends a div for each style class
 * @returns {jQuery} The jQuery element containing divs for each style class
 * @ignore
 */
ColorAttributeGroupHandler.__createAttrDiv = function () {
  if (ColorAttributeGroupHandler._colors) {
    return null;
  }

  var attrGpsDiv = $(document.createElement('div'));
  attrGpsDiv.css('display', 'none;');
  attrGpsDiv.attr('id', 'attrGps');
  $(document.body).append(attrGpsDiv); // @HTMLUpdateOK
  for (var i = 0; i < ColorAttributeGroupHandler._STYLE_CLASSES.length; i++) {
    var childDiv = $(document.createElement('div'));
    childDiv.addClass(ColorAttributeGroupHandler._STYLE_CLASSES[i]);
    attrGpsDiv.append(childDiv); // @HTMLUpdateOK
  }
  return attrGpsDiv;
};

/**
 * Processes the colors for each div on the given element
 * @param {jQuery} attrGpsDiv The jQuery element containing divs for each style class
 * @return {void}
 * @ignore
 */
ColorAttributeGroupHandler.__processAttrDiv = function (attrGpsDiv) {
  ColorAttributeGroupHandler._colors = [];

  var childDivs = attrGpsDiv.children();
  for (var i = 0; i < childDivs.length; i++) {
    var childDiv = $(childDivs[i]);
    var color = childDiv.css('color');
    if (color) {
      ColorAttributeGroupHandler._colors.push(color);
    }
  }
};


/**
 * Creates a shape attribute group handler that will generate shape attribute values.
 *
 * @param {Object.<string, string>=} [matchRules] A map of key value pairs for categories and the matching attribute value e.g. {"soda" : "square", "water" : "circle", "iced tea" : "triangleUp"}.
 *                            Attribute values listed in the matchRules object will be reserved only for the matching categories when getAttributeValue is called.
 * @ojsignature {target: "Type", value: "{[propName: string]: any}", for: "matchRules"}
 * @export
 * @constructor
 * @final
 * @since 1.0
 * @extends oj.AttributeGroupHandler
 * @name oj.ShapeAttributeGroupHandler
 */
var ShapeAttributeGroupHandler = function (matchRules) {
  this.Init(matchRules);
};

// eslint-disable-next-line no-undef
oj.Object.createSubclass(ShapeAttributeGroupHandler, AttributeGroupHandler, 'ShapeAttributeGroupHandler');

ShapeAttributeGroupHandler._attributeValues = ['square', 'circle', 'diamond', 'plus', 'triangleDown', 'triangleUp', 'human'];

/**
 * Returns the array of possible shape values for this attribute group handler.
 * @returns {Array.<string>} The array of shape values
 * @export
 * @memberof oj.ShapeAttributeGroupHandler
 * @method getValueRamp
 * @instance
 */
ShapeAttributeGroupHandler.prototype.getValueRamp = function () {
  return ShapeAttributeGroupHandler._attributeValues;
};


/* global AttributeGroupHandler:false, ColorAttributeGroupHandler:false, ShapeAttributeGroupHandler:false */
// Define a mapping variable that maps the return value of the module to the name used in the callback function of a require call.

var attributeGroupHandler = {};
attributeGroupHandler.AttributeGroupHandler = AttributeGroupHandler;
attributeGroupHandler.ColorAttributeGroupHandler = ColorAttributeGroupHandler;
attributeGroupHandler.ShapeAttributeGroupHandler = ShapeAttributeGroupHandler;

  ;return attributeGroupHandler;
});