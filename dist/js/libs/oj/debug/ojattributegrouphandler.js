/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'jquery'], function (exports, oj, $) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  /**
   * Creates an attribute group handler that will generate stylistic attribute values such as colors or shapes based on data set categories.
   * @param {Object.<string, *>=} [matchRules] A map of key value pairs for categories and the matching attribute value e.g. {"soda" : "square", "water" : "circle", "iced tea" : "triangleUp"}.
   *                            Attribute values listed in the matchRules object will be reserved only for the matching categories when getAttributeValue is called.
   * @ojsignature {target: "Type", value: "{[propName: string]: any}", for: "matchRules"}
   * @export
   * @constructor
   * @final
   * @since 1.0
   * @name oj.AttributeGroupHandler
   * @classdesc <p> Attribute group handlers generate stylistic attribute values such as colors or shapes based on data categories.
   * AttributeGroupHandler is an abstract superclass that applications should not use directly. Instead, see [ColorAttributeGroupHandler]{@link oj.ColorAttributeGroupHandler}
   * and [ShapeAttributeGroupHandler]{@link oj.ShapeAttributeGroupHandler}.</p>
   */
  const AttributeGroupHandler = function (matchRules) {
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
   * @expose
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
   * @expose
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
   * @expose
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
   * In most cases, use of this method should not be needed as match rules can be configured directly in the constructor.
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
   * @classdesc
   * <p> ColorAttributeGroupHandler is a class that can be used to associate color values
   * with data categories. Color mappings are often set by default from the theme, but
   * can also be configured by the application. ColorAttributeGroupHandlers are often used in
   * data visualizations to associate colors with particular data characteristics, making
   * it easier to visually discern trends and other relationships in the data.
   * See also [ShapeAttributeGroupHandler]{@link oj.ShapeAttributeGroupHandler}.</p>
   * <i>The HTML markup showing assignment of colors in an oj-chart:</i>
   * <pre class="prettyprint">
   * <code>
   *   &lt;oj-chart data="[[dataProvider]]">
   *      &lt;template slot='itemTemplate' data-oj-as='item'>
   *          &lt;oj-chart-item value='[[item.data.population]]'
   *              group-id='[[ [item.data.country] ]]'
   *              series-id='[[ item.data.year ]]'
   *              color='[[ colorHandler.getValue(item.data.continent) ]]'>
   *          &lt;/oj-chart-item>
   *      &lt;/template>
   *   &lt;/oj-chart>
   * </code>
   * </pre>
   * <i>JavaScript configuration of a ColorAttributeGroupHandler using default color mappings:</i>
   * <pre class="prettyprint">
   * <code>
   * this.colorHandler = new attributeGroupHandler.ColorAttributeGroupHandler();
   * </code>
   * </pre>
   * <i>JavaScript configuration of a ColorAttributeGroupHandler using custom color mappings:</i>
   * <pre class="prettyprint">
   * <code>
   * this.colorHandler = new attributeGroupHandler.ColorAttributeGroupHandler({
   *    'Africa':'red',
   *    'Antarctica': 'orange',
   *    'Asia': 'yellow',
   *    'Australia/Oceania': 'green',
   *    'Europe': 'blue',
   *    'North America': 'indigo',
   *    'South America': 'violet' });
   * </code>
   * </pre>
   */
  const ColorAttributeGroupHandler = function (matchRules) {
    // Create the array of colors for this instance.
    this._attributeValues = [];

    if ($(document.body).hasClass('oj-hicontrast')) {
      // High Contrast: CSS colors get overridden to all white or all black. Use the default colors instead.
      this._attributeValues = ColorAttributeGroupHandler._DEFAULT_COLORS.slice();
    } else {
      // Process the colors from the skin if not done already.
      // To improve performance, append the divs for each style class first then process the colors for each div.
      if (!ColorAttributeGroupHandler._colors) {
        var attrGpsDiv = ColorAttributeGroupHandler.__createAttrDiv();
        $(document.body).append(attrGpsDiv); // @HTMLUpdateOK
        ColorAttributeGroupHandler._colors = ColorAttributeGroupHandler.__processAttrDiv(attrGpsDiv);
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
  oj.Object.createSubclass(
    ColorAttributeGroupHandler,
    AttributeGroupHandler,
    'ColorAttributeGroupHandler'
  );

  /** @private */
  ColorAttributeGroupHandler._DEFAULT_COLORS = [
    '#237bb1',
    '#68c182',
    '#fad55c',
    '#ed6647',
    '#8561c8',
    '#6ddbdb',
    '#ffb54d',
    '#e371b2',
    '#47bdef',
    '#a2bf39',
    '#a75dba',
    '#f7f37b'
  ];

  /** @private */
  ColorAttributeGroupHandler._STYLE_CLASSES = [
    'oj-dvt-category1',
    'oj-dvt-category2',
    'oj-dvt-category3',
    'oj-dvt-category4',
    'oj-dvt-category5',
    'oj-dvt-category6',
    'oj-dvt-category7',
    'oj-dvt-category8',
    'oj-dvt-category9',
    'oj-dvt-category10',
    'oj-dvt-category11',
    'oj-dvt-category12'
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
    var attrGpsDiv = $(document.createElement('div'));
    attrGpsDiv.css('display', 'none;');
    attrGpsDiv.attr('id', 'attrGps');
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
    var colors = [];

    var childDivs = attrGpsDiv.children();
    for (var i = 0; i < childDivs.length; i++) {
      var childDiv = $(childDivs[i]);
      var color = childDiv.css('color');
      if (color) {
        colors.push(color);
      }
    }
    return colors;
  };

  /**
   * @license
   * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
   * Licensed under The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignoreg
   */

  /**
   * Creates a shape attribute group handler that will generate shape attribute values.
   * @param {Object.<string, string>=} [matchRules] A map of key value pairs for categories and the matching attribute value e.g. {"soda" : "square", "water" : "circle", "iced tea" : "triangleUp"}.
   * Attribute values listed in the matchRules object will be reserved only for the matching categories when getAttributeValue is called.
   * @ojsignature {target: "Type", value: "{[propName: string]: any}", for: "matchRules"}
   * @export
   * @constructor
   * @final
   * @since 1.0
   * @extends oj.AttributeGroupHandler
   * @name oj.ShapeAttributeGroupHandler
   * @classdesc
   * <p> ShapeAttributeGroupHandler is a class that can be used to associate shape values
   * with data categories. Shape mappings are often set by default from the theme, but
   * can also be configured by the application. ShapeAttributeGroupHandlers are often used in
   * data visualizations to associate shapes with particular data characteristics, making
   * it easier to visually discern trends and other relationships in the data.
   * See also [ColorAttributeGroupHandler]{@link oj.ColorAttributeGroupHandler}.</p>
   * <i>The HTML markup showing assignment of shapes in an oj-chart:</i>
   * <pre class="prettyprint">
   * <code>
   *   &lt;oj-chart data="[[dataProvider]]">
   *      &lt;template slot='itemTemplate' data-oj-as='item'>
   *          &lt;oj-chart-item value='[[item.data.population]]'
   *              group-id='[[ [item.data.country] ]]'
   *              series-id='[[ item.data.year ]]'
   *              marker-shape='[[ shapeHandler.getValue(item.data.continent) ]]'>
   *          &lt;/oj-chart-item>
   *      &lt;/template>
   *   &lt;/oj-chart>
   * </code>
   * </pre>
   * <i>JavaScript configuration of a ShapeAttributeGroupHandler using default shape mappings:</i>
   * <pre class="prettyprint">
   * <code>
   * this.shapeHandler = new attributeGroupHandler.ShapeAttributeGroupHandler();
   * </code>
   * </pre>
   * <i>JavaScript configuration of a ShapeAttributeGroupHandler using custom shape mappings:</i>
   * <pre class="prettyprint">
   * <code>
   * this.shapeHandler = new attributeGroupHandler.ShapeAttributeGroupHandler({
   *    'Africa':'square',
   *    'Antarctica': 'square',
   *    'Asia': 'square',
   *    'Australia/Oceania': 'square',
   *    'Europe': 'circle',
   *    'North America': 'circle',
   *    'South America': 'circle' });
   * </code>
   * </pre>
   */
  var ShapeAttributeGroupHandler = function (matchRules) {
    this.Init(matchRules);
  };

  // eslint-disable-next-line no-undef
  oj.Object.createSubclass(
    ShapeAttributeGroupHandler,
    AttributeGroupHandler,
    'ShapeAttributeGroupHandler'
  );

  ShapeAttributeGroupHandler._attributeValues = [
    'square',
    'circle',
    'diamond',
    'plus',
    'triangleDown',
    'triangleUp',
    'human'
  ];

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

  exports.AttributeGroupHandler = AttributeGroupHandler;
  exports.ColorAttributeGroupHandler = ColorAttributeGroupHandler;
  exports.ShapeAttributeGroupHandler = ShapeAttributeGroupHandler;

  Object.defineProperty(exports, '__esModule', { value: true });

});
