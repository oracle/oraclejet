/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore'], function(oj)
{
  "use strict";
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/*
 * Portions of this component are based on
 * TinyColor v1.3.0
 * https://github.com/bgrins/TinyColor
 * Brian Grinstead, MIT License
 */
(function () {
  var trimLeft = /^\s+/;
  var trimRight = /\s+$/;
  var mathRound = Math.round;
  var mathMin = Math.min;
  var mathMax = Math.max;
  /**
   * @typedef {Object} oj.Color.RGBA
   * @property {number} r the red value
   * @property {number} g the green value
   * @property {number} b the blue value
   * @property {number} [a] the optional alpha value
   */

  /**
   * @typedef {Object} oj.Color.HSLA
   * @property {number} h the hue value
   * @property {number} s the saturation value
   * @property {number} l the luminosity or lightness value
   * @property {number} [a] the optional alpha value
   */

  /**
   * @typedef {Object} oj.Color.HSVA
   * @property {number} h the hue value
   * @property {number} s the saturation value
   * @property {number} v the value
   * @property {number} [a] the optional alpha value
   */

  /**
   * @class oj.Color
   * @since 3.0.0
   * @classdesc Immutable object representing a color.
   * @ojshortdesc Object representing a color definition.
   * @ojtsmodule
   * @desc Creates an object representing a color. The color may be defined using
   * the RGB, HSL, and HSV model values as an object, or as a CSS3 color specification string (refer to
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value}, and also
   * {@link https://www.w3.org/TR/css3-color/#svg-color} for color visualization.  The
   * CSS3 named colors are available as oj.Color constants (e.g. oj.Color.ALICEBLUE)
   *
   * @example <caption>Typical color definitions</caption>
   *  oj.Color.RED;
   *  oj.Color.ALICEBLUE;
   *  new oj.Color({r:30, g:128, b:201});
   *  new oj.Color({r:30, g:128, b:201, a:0.8});
   *  new oj.Color({h:310, s:50, l:80});
   *  new oj.Color({h:310, s:50, l:80, a:0.8});
   *  new oj.Color({h:310, s:50, v:80});
   *  new oj.Color({h:310, s:50, v:80, a:0.8});
   *  new oj.Color('#4bc');
   *  new oj.Color('#44ccbb');
   *  new oj.Color('rgb(27,128,254)');
   *  new oj.Color('rgba(27,128,254,0.8)');
   *  new oj.Color('hsl(87, 100%,50%)');
   *  new oj.Color('hsla(87, 100%,50%, 0.5)');
   *  new oj.Color('hsv(0, 100%, 100%)') ;
   *  oj.Color.TRANSPARENT;
   *
   * @example <caption>Using a converter to obtain a different color format</caption>
   * var convHsl  = new ColorConverter({"format": "hsl"}) ;
   *
   * var c        = new oj.Color('rgb(0, 191, 255)');
   * var s        = convHsl.format(c) ;            // returns "hsl(197, 71%, 73%)"
     * </p></br>
   * @param {string | Object} color
   * <ul><li> A valid CSS3 color specification string (refer to
   *  {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value} for syntax)</li>
   * <li>An object containing one of the following groups of fields:
   * <ul>
   *  <li>r: &nbsp; the red value</li>
   *  <li>g: &nbsp; the green value</li>
   *  <li>b: &nbsp; the blue value</li>
   *  <li>a: &nbsp; the alpha value (optional)</li>
   * </ul>
   * <br>
   * <ul>
   *  <li>h: &nbsp; the hue value</li>
   *  <li>s: &nbsp; the saturation value</li>
   *  <li>l: &nbsp; the luminosity or lightness value</li>
   *  <li>a: &nbsp; the alpha value (optional)</li>
   * </ul>
   * <br>
   * <ul>
   *  <li>h: &nbsp; the hue value</li>
   *  <li>s: &nbsp; the saturation value</li>
   *  <li>v: &nbsp; the value</li>
   *  <li>a: &nbsp; the alpha value (optional)</li>
   * </ul>
   * </li></ul>
   * @ojsignature {target: "Type",
   *               value: "string|oj.Color.RGBA|oj.Color.HSLA|oj.Color.HSVA",
   *               for: "color",
   *               jsdocOverride: true}
   * @constructor
   * @final
   * @throws {Error} if the color specification cannot be parsed correctly.
   * @export
   */

  oj.Color = function (color) {
    var rgb; // eslint-disable-next-line no-param-reassign

    color = color || '';
    rgb = inputToRGB(color);
    this._r = rgb.r;
    this._g = rgb.g;
    this._b = rgb.b;
    this._a = Math.round(100 * rgb.a) / 100;
  };
  /**
   * Returns the red channel value of the color.
   * @param {boolean=} doNotRound  Omit or set to false to return an integer value.
   *                               Set to true to return the possible fractional value.
   *                               (Fractional values for the red, green, or blue channels can
   *                               arise when a color is defined using the "hsl" format.)
   * @return {number} The red channel value in the range [0,255].
   * @memberof oj.Color
   * @instance
   * @export
   */


  oj.Color.prototype.getRed = function (doNotRound) {
    return doNotRound ? this._r : mathRound(this._r);
  };
  /**
   * Returns the green channel value of the color.
   * @param {boolean=} doNotRound  Omit or set to false to return an integer value.
   *                               Set to true to return the possible fractional value.
   *                               (Fractional values for the red, green, or blue channels can
   *                               arise when a color is defined using the "hsl" format.)
   * @return {number} The green channel value contained in [0,255].
   * @memberof oj.Color
   * @instance
   * @export
   */


  oj.Color.prototype.getGreen = function (doNotRound) {
    return doNotRound ? this._g : mathRound(this._g);
  };
  /**
   * Returns the blue channel value of the color.
   * @param {boolean=} doNotRound  Omit or set to false to return an integer value.
   *                               Set to true to return the possible fractional value.
   *                               (Fractional values for the red, green, or blue channels can
   *                               arise when a color is defined using the "hsl" format.)
   * @return {number} The blue channel value contained in [0,255].
   * @memberof oj.Color
   * @instance
   * @export
   */


  oj.Color.prototype.getBlue = function (doNotRound) {
    return doNotRound ? this._b : mathRound(this._b);
  };
  /**
   * Returns the alpha channel of the color.
   * @return {number} The alpha channel value contained in [0,1].
   * @memberof oj.Color
   * @instance
   * @export
   */


  oj.Color.prototype.getAlpha = function () {
    return this._a;
  };
  /**
   * Returns the color as an "rgb" or rgba" (if the alpha value is less than 1) CSS3 color
   * specification string.
   * @return {string} The color as an "rgb" or "rgba" CSS3 color specification string.
   * @memberof oj.Color
   * @instance
   * @export
   */


  oj.Color.prototype.toString = function () {
    return toRgbString(this);
  };
  /**
   * Compares this color object with the supplied color specification, and returns true
   * if they represent the same color, else false.
   * @param {oj.Color} color   The color to be compared.
   * @return {boolean} Returns true if the comperand represents the same color.
   * @memberof oj.Color
   * @instance
   * @export
   */


  oj.Color.prototype.isEqual = function (color) {
    var ret = false;

    if (color instanceof oj.Color) {
      ret = this._r === color._r && this._g === color._g && this._b === color._b && this._a === color._a;
    }

    return ret;
  };
  /** CSS3 color <code class="prettyprint">aliceblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:aliceblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */


  oj.Color.ALICEBLUE = null;
  /** CSS3 color <code class="prettyprint">antiquewhite</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:antiquewhite;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.ANTIQUEWHITE = null;
  /** CSS3 color <code class="prettyprint">aqua</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:aqua;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.AQUA = null;
  /** CSS3 color <code class="prettyprint">aquamarine</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:aquamarine;"></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.AQUAMARINE = null;
  /** CSS3 color <code class="prettyprint">azure</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:azure;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.AZURE = null;
  /** CSS3 color <code class="prettyprint">beige</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:beige;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.BEIGE = null;
  /** CSS3 color <code class="prettyprint">bisque</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:bisque;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.BISQUE = null;
  /** CSS3 color <code class="prettyprint">black</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:black;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.BLACK = null;
  /** CSS3 color <code class="prettyprint">blanchedalmond</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:blanchedalmond;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.BLANCHEDALMOND = null;
  /** CSS3 color <code class="prettyprint">blue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:blue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.BLUE = null;
  /** CSS3 color <code class="prettyprint">blueviolet</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:blueviolet;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.BLUEVIOLET = null;
  /** CSS3 color <code class="prettyprint">brown</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:brown;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.BROWN = null;
  /** CSS3 color <code class="prettyprint">burlywood</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:burlywood;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.BURLYWOOD = null;
  /** CSS3 color <code class="prettyprint">cadetblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:cadetblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.CADETBLUE = null;
  /** CSS3 color <code class="prettyprint">chartreuse</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:chartreuse;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.CHARTREUSE = null;
  /** CSS3 color <code class="prettyprint">chocolate</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:chocolate;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.CHOCOLATE = null;
  /** CSS3 color <code class="prettyprint">coral</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:coral;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.CORAL = null;
  /** CSS3 color <code class="prettyprint">cornflowerblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:cornflowerblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.CORNFLOWERBLUE = null;
  /** CSS3 color <code class="prettyprint">cornsilk</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:cornsilk;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.CORNSILK = null;
  /** CSS3 color <code class="prettyprint">crimson</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:crimson;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.CRIMSON = null;
  /** CSS3 color <code class="prettyprint">cyan</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:cyan;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.CYAN = null;
  /** CSS3 color <code class="prettyprint">darkblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKBLUE = null;
  /** CSS3 color <code class="prettyprint">darkcyan</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkcyan;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKCYAN = null;
  /** CSS3 color <code class="prettyprint">darkgoldenrod</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkgoldenrod;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKGOLDENROD = null;
  /** CSS3 color <code class="prettyprint">darkgray</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkgray;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKGRAY = null;
  /** CSS3 color <code class="prettyprint">darkgrey</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkgrey;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKGREY = null;
  /** CSS3 color <code class="prettyprint">darkgreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkgreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKGREEN = null;
  /** CSS3 color <code class="prettyprint">darkkhaki</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkkhaki;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKKHAKI = null;
  /** CSS3 color <code class="prettyprint">darkmagenta</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkmagenta;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKMAGENTA = null;
  /** CSS3 color <code class="prettyprint">darkolivegreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkolivegreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKOLIVEGREEN = null;
  /** CSS3 color <code class="prettyprint">darkorange</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkorange;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKORANGE = null;
  /** CSS3 color <code class="prettyprint">darkorchid</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkorchid;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKORCHID = null;
  /** CSS3 color <code class="prettyprint">darkred</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkred;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKRED = null;
  /** CSS3 color <code class="prettyprint">darksalmon</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darksalmon;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKSALMON = null;
  /** CSS3 color <code class="prettyprint">darkseagreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkseagreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKSEAGREEN = null;
  /** CSS3 color <code class="prettyprint">darkslateblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkslateblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKSLATEBLUE = null;
  /** CSS3 color <code class="prettyprint">darkslategray</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkslategray;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKSLATEGRAY = null;
  /** CSS3 color <code class="prettyprint">darkslategrey</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkslategrey;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKSLATEGREY = null;
  /** CSS3 color <code class="prettyprint">darkturquoise</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkturquoise;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKTURQUOISE = null;
  /** CSS3 color <code class="prettyprint">darkviolet</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:darkviolet;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DARKVIOLET = null;
  /** CSS3 color <code class="prettyprint">deeppink</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:deeppink;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DEEPPINK = null;
  /** CSS3 color <code class="prettyprint">deepskyblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:deepskyblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DEEPSKYBLUE = null;
  /** CSS3 color <code class="prettyprint">dimgray</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:dimgray;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DIMGRAY = null;
  /** CSS3 color <code class="prettyprint">dimgrey</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:dimgrey;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DIMGREY = null;
  /** CSS3 color <code class="prettyprint">dodgerblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:dodgerblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.DODGERBLUE = null;
  /** CSS3 color <code class="prettyprint">firebrick</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:firebrick;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.FIREBRICK = null;
  /** CSS3 color <code class="prettyprint">floralwhite</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:floralwhite;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.FLORALWHITE = null;
  /** CSS3 color <code class="prettyprint">forestgreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:forestgreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.FORESTGREEN = null;
  /** CSS3 color <code class="prettyprint">fuchsia</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:fuchsia;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.FUCHSIA = null;
  /** CSS3 color <code class="prettyprint">gainsboro</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:gainsboro;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.GAINSBORO = null;
  /** CSS3 color <code class="prettyprint">ghostwhite</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:ghostwhite;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.GHOSTWHITE = null;
  /** CSS3 color <code class="prettyprint">gold</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:gold;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.GOLD = null;
  /** CSS3 color <code class="prettyprint">goldenrod</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:goldenrod;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.GOLDENROD = null;
  /** CSS3 color <code class="prettyprint">gray</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:gray;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.GRAY = null;
  /** CSS3 color <code class="prettyprint">green</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:green;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.GREEN = null;
  /** CSS3 color <code class="prettyprint">greenyellow</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:greenyellow;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.GREENYELLOW = null;
  /** CSS3 color <code class="prettyprint">grey</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:grey;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.GREY = null;
  /** CSS3 color <code class="prettyprint">honeydew</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:honeydew;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.HONEYDEW = null;
  /** CSS3 color <code class="prettyprint">hotpink</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:hotpink;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.HOTPINK = null;
  /** CSS3 color <code class="prettyprint">indianred</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:indianred;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.INDIANRED = null;
  /** CSS3 color <code class="prettyprint">indigo</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:indigo;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.INDIGO = null;
  /** CSS3 color <code class="prettyprint">ivory</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:ivory;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.IVORY = null;
  /** CSS3 color <code class="prettyprint">khaki</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:khaki;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.KHAKI = null;
  /** CSS3 color <code class="prettyprint">lavender</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lavender;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LAVENDER = null;
  /** CSS3 color <code class="prettyprint">lavenderblush</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lavenderblush;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LAVENDERBLUSH = null;
  /** CSS3 color <code class="prettyprint">lawngreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lawngreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LAWNGREEN = null;
  /** CSS3 color <code class="prettyprint">lemonchiffon</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lemonchiffon;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LEMONCHIFFON = null;
  /** CSS3 color <code class="prettyprint">lightblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTBLUE = null;
  /** CSS3 color <code class="prettyprint">lightcoral</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightcoral;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTCORAL = null;
  /** CSS3 color <code class="prettyprint">lightcyan</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightcyan;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTCYAN = null;
  /** CSS3 color <code class="prettyprint">lightgoldenrodyellow</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightgoldenrodyellow;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTGOLDENRODYELLOW = null;
  /** CSS3 color <code class="prettyprint">lightgray</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightgray;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTGRAY = null;
  /** CSS3 color <code class="prettyprint">lightgreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightgreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTGREEN = null;
  /** CSS3 color <code class="prettyprint">lightgrey</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightgrey;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTGREY = null;
  /** CSS3 color <code class="prettyprint">lightpink</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightpink;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTPINK = null;
  /** CSS3 color <code class="prettyprint">lightsalmon</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightsalmon;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTSALMON = null;
  /** CSS3 color <code class="prettyprint">lightseagreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightseagreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTSEAGREEN = null;
  /** CSS3 color <code class="prettyprint">lightskyblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightskyblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTSKYBLUE = null;
  /** CSS3 color <code class="prettyprint">lightslategray</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightslategray;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTSLATEGRAY = null;
  /** CSS3 color <code class="prettyprint">lightslategrey</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightslategrey;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTSLATEGREY = null;
  /** CSS3 color <code class="prettyprint">lightsteelblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightsteelblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTSTEELBLUE = null;
  /** CSS3 color <code class="prettyprint">lightyellow</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lightyellow;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIGHTYELLOW = null;
  /** CSS3 color <code class="prettyprint">lime</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:lime;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIME = null;
  /** CSS3 color <code class="prettyprint">limegreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:limegreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LIMEGREEN = null;
  /** CSS3 color <code class="prettyprint">linen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:linen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.LINEN = null;
  /** CSS3 color <code class="prettyprint">magenta</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:magenta;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MAGENTA = null;
  /** CSS3 color <code class="prettyprint">maroon</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:maroon;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MAROON = null;
  /** CSS3 color <code class="prettyprint">mediumaquamarine</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mediumaquamarine;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MEDIUMAQUAMARINE = null;
  /** CSS3 color <code class="prettyprint">mediumblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mediumblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MEDIUMBLUE = null;
  /** CSS3 color <code class="prettyprint">mediumorchid</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mediumorchid;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MEDIUMORCHID = null;
  /** CSS3 color <code class="prettyprint">mediumpurple</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mediumpurple;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MEDIUMPURPLE = null;
  /** CSS3 color <code class="prettyprint">mediumseagreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mediumseagreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MEDIUMSEAGREEN = null;
  /** CSS3 color <code class="prettyprint">mediumslateblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mediumslateblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MEDIUMSLATEBLUE = null;
  /** CSS3 color <code class="prettyprint">mediumspringgreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mediumspringgreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MEDIUMSPRINGGREEN = null;
  /** CSS3 color <code class="prettyprint">mediumturquoise</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mediumturquoise;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MEDIUMTURQUOISE = null;
  /** CSS3 color <code class="prettyprint">mediumvioletred</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mediumvioletred;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MEDIUMVIOLETRED = null;
  /** CSS3 color <code class="prettyprint">midnightblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:midnightblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MIDNIGHTBLUE = null;
  /** CSS3 color <code class="prettyprint">mintcream</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mintcream;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MINTCREAM = null;
  /** CSS3 color <code class="prettyprint">mistyrose</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:mistyrose;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MISTYROSE = null;
  /** CSS3 color <code class="prettyprint">moccasin</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:moccasin;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.MOCCASIN = null;
  /** CSS3 color <code class="prettyprint">navajowhite</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:navajowhite;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.NAVAJOWHITE = null;
  /** CSS3 color <code class="prettyprint">navy</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:navy;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.NAVY = null;
  /** CSS3 color <code class="prettyprint">oldlace</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:oldlace;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.OLDLACE = null;
  /** CSS3 color <code class="prettyprint">olive</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:olive;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.OLIVE = null;
  /** CSS3 color <code class="prettyprint">olivedrab</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:olivedrab;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.OLIVEDRAB = null;
  /** CSS3 color <code class="prettyprint">orange</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:orange;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.ORANGE = null;
  /** CSS3 color <code class="prettyprint">orangered</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:orangered;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.ORANGERED = null;
  /** CSS3 color <code class="prettyprint">orchid</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:orchid;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.ORCHID = null;
  /** CSS3 color <code class="prettyprint">palegoldenrod</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:palegoldenrod;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PALEGOLDENROD = null;
  /** CSS3 color <code class="prettyprint">palegreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:palegreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PALEGREEN = null;
  /** CSS3 color <code class="prettyprint">paleturquoise</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:paleturquoise;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PALETURQUOISE = null;
  /** CSS3 color <code class="prettyprint">palevioletred</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:palevioletred;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PALEVIOLETRED = null;
  /** CSS3 color <code class="prettyprint">papayawhip</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:papayawhip;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PAPAYAWHIP = null;
  /** CSS3 color <code class="prettyprint">peachpuff</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:peachpuff;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PEACHPUFF = null;
  /** CSS3 color <code class="prettyprint">peru</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:peru;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PERU = null;
  /** CSS3 color <code class="prettyprint">pink</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:pink;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PINK = null;
  /** CSS3 color <code class="prettyprint">plum</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:plum;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PLUM = null;
  /** CSS3 color <code class="prettyprint">powderblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:powderblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.POWDERBLUE = null;
  /** CSS3 color <code class="prettyprint">purple</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:purple;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.PURPLE = null;
  /** CSS3 color <code class="prettyprint">rebeccapurple</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:rebeccapurple;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.REBECCAPURPLE = null;
  /** CSS3 color <code class="prettyprint">red</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:red;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.RED = null;
  /** CSS3 color <code class="prettyprint">rosybrown</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:rosybrown;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.ROSYBROWN = null;
  /** CSS3 color <code class="prettyprint">royalblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:royalblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.ROYALBLUE = null;
  /** CSS3 color <code class="prettyprint">saddlebrown</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:saddlebrown;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SADDLEBROWN = null;
  /** CSS3 color <code class="prettyprint">salmon</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:salmon;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SALMON = null;
  /** CSS3 color <code class="prettyprint">sandybrown</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:sandybrown;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SANDYBROWN = null;
  /** CSS3 color <code class="prettyprint">seagreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:seagreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SEAGREEN = null;
  /** CSS3 color <code class="prettyprint">seashell</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:seashell;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SEASHELL = null;
  /** CSS3 color <code class="prettyprint">sienna</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:sienna;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SIENNA = null;
  /** CSS3 color <code class="prettyprint">silver</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:silver;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SILVER = null;
  /** CSS3 color <code class="prettyprint">skyblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:skyblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SKYBLUE = null;
  /** CSS3 color <code class="prettyprint">slateblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:slateblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SLATEBLUE = null;
  /** CSS3 color <code class="prettyprint">slategray</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:slategray;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SLATEGRAY = null;
  /** CSS3 color <code class="prettyprint">slategrey</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:slategrey;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SLATEGREY = null;
  /** CSS3 color <code class="prettyprint">snow</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:snow;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SNOW = null;
  /** CSS3 color <code class="prettyprint">springgreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:springgreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.SPRINGGREEN = null;
  /** CSS3 color <code class="prettyprint">steelblue</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:steelblue;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.STEELBLUE = null;
  /** CSS3 color <code class="prettyprint">tan</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:tan;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.TAN = null;
  /** CSS3 color <code class="prettyprint">teal</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:teal;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.TEAL = null;
  /** CSS3 color <code class="prettyprint">thistle</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:thistle;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.THISTLE = null;
  /** CSS3 color <code class="prettyprint">tomato</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:tomato;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.TOMATO = null;
  /** CSS3 color <code class="prettyprint">turquoise</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:turquoise;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.TURQUOISE = null;
  /** CSS3 color <code class="prettyprint">violet</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:violet;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.VIOLET = null;
  /** CSS3 color <code class="prettyprint">wheat</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:wheat;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.WHEAT = null;
  /** CSS3 color <code class="prettyprint">white</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:white;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.WHITE = null;
  /** CSS3 color <code class="prettyprint">whitesmoke</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:whitesmoke;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.WHITESMOKE = null;
  /** CSS3 color <code class="prettyprint">yellow</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:yellow;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.YELLOW = null;
  /** CSS3 color <code class="prettyprint">yellowgreen</code><div style="display:inline;padding-left:40px;margin-left:50px;height:15px;width:40px;background:yellowgreen;"/></div>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.YELLOWGREEN = null;
  /** CSS3 color <code class="prettyprint">transparent</code>
   * @type {oj.Color}
   * @expose
   * @public
   * @static
   * @memberof oj.Color
   */

  oj.Color.TRANSPARENT = null;
  /*-----------------------------------------------------------------------*/

  /*     Internal supporting functions below this point                    */

  /*-----------------------------------------------------------------------*/

  /**
   * Converts a valid CSS3 color specification string (exc. named colors), or
   * an object of the forms {r:, g:, b:}, {h:, s:, l:}, or {h", s:, v:} with
   * optional "a" property, to an object with validated r,g,b properties.
   * Invalid syntax causes an error to be thrown.
   *
   * Example input:
   *  "#f00" or "f00"
   *  "#ff0000" or "ff0000"
   *  "rgb 255 0 0" or "rgb (255, 0, 0)"
   *  "rgb 1.0 0 0" or "rgb (1, 0, 0)"
   *  "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
   *  "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
   *  "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
   *  "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
   *  "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
   *
   *  Note: when converting from hsl or hsv, the resulting r,g,b components may be fractional
   *       e.g.  hsla(0, 97%,37%,0.851) will return the following
   *             r = 185.8695, g = 2.8305, b = 2.8305, a = 0.851
   * @memberof oj.Color
   * @returns {Object} color object
   * @private
   */

  function inputToRGB(color) {
    var rgb = {
      r: 0,
      g: 0,
      b: 0
    };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;

    if (typeof color === 'string') {
      // eslint-disable-next-line no-param-reassign
      color = stringInputToObject(color); // convert to {"r":, "g":, "b":} or {"h":, "s":, l}, or {"h":, "s":, "v":}
    }

    if (_typeof(color) === 'object') {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l);
        ok = true;
      }

      if (typeof color.a !== 'undefined') {
        a = color.a;
      }
    }

    if (!ok) {
      throw new Error('Invalid Color format');
    }

    a = boundAlpha(a);
    return {
      r: mathMin(255, mathMax(rgb.r, 0)),
      g: mathMin(255, mathMax(rgb.g, 0)),
      b: mathMin(255, mathMax(rgb.b, 0)),
      a: a
    };
  }
  /**
   * @param {oj.Color} co The color object
   * @returns {string} rgb string
   * @memberof oj.Color
   * @private
   */


  function toRgbString(co) {
    var b = co._a < 1;
    return 'rgb' + (b ? 'a(' : '(') + mathRound(co._r) + ', ' + mathRound(co._g) + ', ' + mathRound(co._b) + (b ? ', ' + co._a : '') + ')';
  }
  /*---------------------------------------------------------------------------*/

  /*               Color conversion supporting functions                       */

  /*---------------------------------------------------------------------------*/

  /*  <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-                */

  /*                          color-model-conversion-algorithms-in-javascript> */

  /*---------------------------------------------------------------------------*/

  /**
   * Converts an RGB color value to RGB.
   * Handle bounds/percentage checking to conform to CSS color spec, and returns
   * an object containg the r,g,b values.
   * <http://www.w3.org/TR/css3-color/>
   * Assumes:  r, g, b in [0, 255] or [0, 1]
   * @param {number} r the red value
   * @param {number} g the green value
   * @param {number} b the blue value
   * @returns {Object} Object with properties r, g, and b, in [0, 255].
   * @memberof oj.Color
   * @private
   */


  function rgbToRgb(r, g, b) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    };
  }
  /**
   * Converts an RGB color value to HSL.
   * Handle bounds/percentage checking to conform to CSS color spec, and returns
   * an object containg the h,s,l values.
   * <http://www.w3.org/TR/css3-color/>
   * Assumes:  r, g, b in [0, 255] or [0, 1]
   * @param {number} r the red value
   * @param {number} g the green value
   * @param {number} b the blue value
   * @returns {Object} Object with properties h, s, l, in [0, 1].
   * @memberof oj.Color
   * @private
   */

  /* Unused
  function rgbToHsl(r, g, b) {
    // eslint-disable-next-line no-param-reassign
    r = bound01(r, 255);
    // eslint-disable-next-line no-param-reassign
    g = bound01(g, 255);
    // eslint-disable-next-line no-param-reassign
    b = bound01(b, 255);
      var max = mathMax(r, g, b);
    var min = mathMin(r, g, b);
    var h;
    var s;
    var l = (max + min) / 2;
      if (max === min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
        h /= 6;
    }
      return { h: h, s: s, l: l };
  }
  */

  /**
   * Converts an HSL color value to RGB.
   * Handle bounds/percentage checking to conform to CSS color spec, and returns
   * an object containg the r,g,b values.
   * <http://www.w3.org/TR/css3-color/>
   * Assumes:  h is contained in [0,1] or [0,360, and s an l are contained in [0, 1] or [0, 100]
   * @param {number} h the hue value
   * @param {number} s the saturation value
   * @param {number} l the lightness value
   * @returns {Object} Object with properties r, g, b, in [0, 255].
   * @memberof oj.Color
   * @private
   */


  function hslToRgb(h, s, l) {
    var r;
    var g;
    var b; // eslint-disable-next-line no-param-reassign

    h = bound01(h, 360); // eslint-disable-next-line no-param-reassign

    s = bound01(s, 100); // eslint-disable-next-line no-param-reassign

    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
      // eslint-disable-next-line no-param-reassign
      if (t < 0) t += 1; // eslint-disable-next-line no-param-reassign

      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    if (s === 0) {
      // achromatic
      r = l;
      g = l;
      b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: r * 255,
      g: g * 255,
      b: b * 255
    };
  }
  /**
   * Converts an HSV color value to RGB.
   * Assumes: h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
   * @returns {Object} An object with properties  r, g, b  in the set [0,255]
   * @memberof oj.Color
   * @private
   */


  function hsvToRgb(h, s, v) {
    // eslint-disable-next-line no-param-reassign
    h = bound01(h, 360) * 6; // eslint-disable-next-line no-param-reassign

    s = bound01(s, 100); // eslint-disable-next-line no-param-reassign

    v = bound01(v, 100);
    var i = Math.floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return {
      r: r * 255,
      g: g * 255,
      b: b * 255
    };
  }
  /**
   * @memberof oj.Color
   * @private
   * @return {void}
   */


  function _initColorConstants() {
    Object.defineProperty(oj.Color, 'ALICEBLUE', {
      writable: false,
      value: new oj.Color('f0f8ff')
    });
    Object.defineProperty(oj.Color, 'ANTIQUEWHITE', {
      writable: false,
      value: new oj.Color('faebd7')
    });
    Object.defineProperty(oj.Color, 'AQUA', {
      writable: false,
      value: new oj.Color('0ff')
    });
    Object.defineProperty(oj.Color, 'AQUAMARINE', {
      writable: false,
      value: new oj.Color('7fffd4')
    });
    Object.defineProperty(oj.Color, 'AZURE', {
      writable: false,
      value: new oj.Color('f0ffff')
    });
    Object.defineProperty(oj.Color, 'BEIGE', {
      writable: false,
      value: new oj.Color('f5f5dc')
    });
    Object.defineProperty(oj.Color, 'BISQUE', {
      writable: false,
      value: new oj.Color('ffe4c4')
    });
    Object.defineProperty(oj.Color, 'BLACK', {
      writable: false,
      value: new oj.Color('000')
    });
    Object.defineProperty(oj.Color, 'BLANCHEDALMOND', {
      writable: false,
      value: new oj.Color('ffebcd')
    });
    Object.defineProperty(oj.Color, 'BLUE', {
      writable: false,
      value: new oj.Color('00f')
    });
    Object.defineProperty(oj.Color, 'BLUEVIOLET', {
      writable: false,
      value: new oj.Color('8a2be2')
    });
    Object.defineProperty(oj.Color, 'BROWN', {
      writable: false,
      value: new oj.Color('a52a2a')
    });
    Object.defineProperty(oj.Color, 'BURLYWOOD', {
      writable: false,
      value: new oj.Color('deb887')
    });
    Object.defineProperty(oj.Color, 'CADETBLUE', {
      writable: false,
      value: new oj.Color('5f9ea0')
    });
    Object.defineProperty(oj.Color, 'CHARTREUSE', {
      writable: false,
      value: new oj.Color('7fff00')
    });
    Object.defineProperty(oj.Color, 'CHOCOLATE', {
      writable: false,
      value: new oj.Color('d2691e')
    });
    Object.defineProperty(oj.Color, 'CORAL', {
      writable: false,
      value: new oj.Color('ff7f50')
    });
    Object.defineProperty(oj.Color, 'CORNFLOWERBLUE', {
      writable: false,
      value: new oj.Color('6495ed')
    });
    Object.defineProperty(oj.Color, 'CORNSILK', {
      writable: false,
      value: new oj.Color('fff8dc')
    });
    Object.defineProperty(oj.Color, 'CRIMSON', {
      writable: false,
      value: new oj.Color('dc143c')
    });
    Object.defineProperty(oj.Color, 'CYAN', {
      writable: false,
      value: new oj.Color('0ff')
    });
    Object.defineProperty(oj.Color, 'DARKBLUE', {
      writable: false,
      value: new oj.Color('00008b')
    });
    Object.defineProperty(oj.Color, 'DARKCYAN', {
      writable: false,
      value: new oj.Color('008b8b')
    });
    Object.defineProperty(oj.Color, 'DARKGOLDENROD', {
      writable: false,
      value: new oj.Color('b8860b')
    });
    Object.defineProperty(oj.Color, 'DARKGRAY', {
      writable: false,
      value: new oj.Color('a9a9a9')
    });
    Object.defineProperty(oj.Color, 'DARKGREY', {
      writable: false,
      value: new oj.Color('a9a9a9')
    });
    Object.defineProperty(oj.Color, 'DARKGREEN', {
      writable: false,
      value: new oj.Color('006400')
    });
    Object.defineProperty(oj.Color, 'DARKKHAKI', {
      writable: false,
      value: new oj.Color('bdb76b')
    });
    Object.defineProperty(oj.Color, 'DARKMAGENTA', {
      writable: false,
      value: new oj.Color('8b008b')
    });
    Object.defineProperty(oj.Color, 'DARKOLIVEGREEN', {
      writable: false,
      value: new oj.Color('556b2f')
    });
    Object.defineProperty(oj.Color, 'DARKORANGE', {
      writable: false,
      value: new oj.Color('ff8c00')
    });
    Object.defineProperty(oj.Color, 'DARKORCHID', {
      writable: false,
      value: new oj.Color('9932cc')
    });
    Object.defineProperty(oj.Color, 'DARKRED', {
      writable: false,
      value: new oj.Color('8b0000')
    });
    Object.defineProperty(oj.Color, 'DARKSALMON', {
      writable: false,
      value: new oj.Color('e9967a')
    });
    Object.defineProperty(oj.Color, 'DARKSEAGREEN', {
      writable: false,
      value: new oj.Color('8fbc8f')
    });
    Object.defineProperty(oj.Color, 'DARKSLATEBLUE', {
      writable: false,
      value: new oj.Color('483d8b')
    });
    Object.defineProperty(oj.Color, 'DARKSLATEGRAY', {
      writable: false,
      value: new oj.Color('2f4f4f')
    });
    Object.defineProperty(oj.Color, 'DARKSLATEGREY', {
      writable: false,
      value: new oj.Color('2f4f4f')
    });
    Object.defineProperty(oj.Color, 'DARKTURQUOISE', {
      writable: false,
      value: new oj.Color('00ced1')
    });
    Object.defineProperty(oj.Color, 'DARKVIOLET', {
      writable: false,
      value: new oj.Color('9400d3')
    });
    Object.defineProperty(oj.Color, 'DEEPPINK', {
      writable: false,
      value: new oj.Color('ff1493')
    });
    Object.defineProperty(oj.Color, 'DEEPSKYBLUE', {
      writable: false,
      value: new oj.Color('00bfff')
    });
    Object.defineProperty(oj.Color, 'DIMGRAY', {
      writable: false,
      value: new oj.Color('696969')
    });
    Object.defineProperty(oj.Color, 'DIMGREY', {
      writable: false,
      value: new oj.Color('696969')
    });
    Object.defineProperty(oj.Color, 'DODGERBLUE', {
      writable: false,
      value: new oj.Color('1e90ff')
    });
    Object.defineProperty(oj.Color, 'FIREBRICK', {
      writable: false,
      value: new oj.Color('b22222')
    });
    Object.defineProperty(oj.Color, 'FLORALWHITE', {
      writable: false,
      value: new oj.Color('fffaf0')
    });
    Object.defineProperty(oj.Color, 'FORESTGREEN', {
      writable: false,
      value: new oj.Color('228b22')
    });
    Object.defineProperty(oj.Color, 'FUCHSIA', {
      writable: false,
      value: new oj.Color('f0f')
    });
    Object.defineProperty(oj.Color, 'GAINSBORO', {
      writable: false,
      value: new oj.Color('dcdcdc')
    });
    Object.defineProperty(oj.Color, 'GHOSTWHITE', {
      writable: false,
      value: new oj.Color('f8f8ff')
    });
    Object.defineProperty(oj.Color, 'GOLD', {
      writable: false,
      value: new oj.Color('ffd700')
    });
    Object.defineProperty(oj.Color, 'GOLDENROD', {
      writable: false,
      value: new oj.Color('daa520')
    });
    Object.defineProperty(oj.Color, 'GRAY', {
      writable: false,
      value: new oj.Color('808080')
    });
    Object.defineProperty(oj.Color, 'GREY', {
      writable: false,
      value: new oj.Color('808080')
    });
    Object.defineProperty(oj.Color, 'GREEN', {
      writable: false,
      value: new oj.Color('008000')
    });
    Object.defineProperty(oj.Color, 'GREENYELLOW', {
      writable: false,
      value: new oj.Color('adff2f')
    });
    Object.defineProperty(oj.Color, 'HONEYDEW', {
      writable: false,
      value: new oj.Color('f0fff0')
    });
    Object.defineProperty(oj.Color, 'HOTPINK', {
      writable: false,
      value: new oj.Color('ff69b4')
    });
    Object.defineProperty(oj.Color, 'INDIANRED', {
      writable: false,
      value: new oj.Color('cd5c5c')
    });
    Object.defineProperty(oj.Color, 'INDIGO', {
      writable: false,
      value: new oj.Color('4b0082')
    });
    Object.defineProperty(oj.Color, 'IVORY', {
      writable: false,
      value: new oj.Color('fffff0')
    });
    Object.defineProperty(oj.Color, 'KHAKI', {
      writable: false,
      value: new oj.Color('f0e68c')
    });
    Object.defineProperty(oj.Color, 'LAVENDER', {
      writable: false,
      value: new oj.Color('e6e6fa')
    });
    Object.defineProperty(oj.Color, 'LAVENDERBLUSH', {
      writable: false,
      value: new oj.Color('fff0f5')
    });
    Object.defineProperty(oj.Color, 'LAWNGREEN', {
      writable: false,
      value: new oj.Color('7cfc00')
    });
    Object.defineProperty(oj.Color, 'LEMONCHIFFON', {
      writable: false,
      value: new oj.Color('fffacd')
    });
    Object.defineProperty(oj.Color, 'LIGHTBLUE', {
      writable: false,
      value: new oj.Color('add8e6')
    });
    Object.defineProperty(oj.Color, 'LIGHTCORAL', {
      writable: false,
      value: new oj.Color('f08080')
    });
    Object.defineProperty(oj.Color, 'LIGHTCYAN', {
      writable: false,
      value: new oj.Color('e0ffff')
    });
    Object.defineProperty(oj.Color, 'LIGHTGOLDENRODYELLOW', {
      writable: false,
      value: new oj.Color('fafad2')
    });
    Object.defineProperty(oj.Color, 'LIGHTGRAY', {
      writable: false,
      value: new oj.Color('d3d3d3')
    });
    Object.defineProperty(oj.Color, 'LIGHTGREY', {
      writable: false,
      value: new oj.Color('d3d3d3')
    });
    Object.defineProperty(oj.Color, 'LIGHTGREEN', {
      writable: false,
      value: new oj.Color('90ee90')
    });
    Object.defineProperty(oj.Color, 'LIGHTPINK', {
      writable: false,
      value: new oj.Color('ffb6c1')
    });
    Object.defineProperty(oj.Color, 'LIGHTSALMON', {
      writable: false,
      value: new oj.Color('ffa07a')
    });
    Object.defineProperty(oj.Color, 'LIGHTSEAGREEN', {
      writable: false,
      value: new oj.Color('20b2aa')
    });
    Object.defineProperty(oj.Color, 'LIGHTSKYBLUE', {
      writable: false,
      value: new oj.Color('87cefa')
    });
    Object.defineProperty(oj.Color, 'LIGHTSLATEGRAY', {
      writable: false,
      value: new oj.Color('789')
    });
    Object.defineProperty(oj.Color, 'LIGHTSLATEGREY', {
      writable: false,
      value: new oj.Color('789')
    });
    Object.defineProperty(oj.Color, 'LIGHTSTEELBLUE', {
      writable: false,
      value: new oj.Color('b0c4de')
    });
    Object.defineProperty(oj.Color, 'LIGHTYELLOW', {
      writable: false,
      value: new oj.Color('ffffe0')
    });
    Object.defineProperty(oj.Color, 'LIME', {
      writable: false,
      value: new oj.Color('0f0')
    });
    Object.defineProperty(oj.Color, 'LIMEGREEN', {
      writable: false,
      value: new oj.Color('32cd32')
    });
    Object.defineProperty(oj.Color, 'LINEN', {
      writable: false,
      value: new oj.Color('faf0e6')
    });
    Object.defineProperty(oj.Color, 'MAGENTA', {
      writable: false,
      value: new oj.Color('f0f')
    });
    Object.defineProperty(oj.Color, 'MAROON', {
      writable: false,
      value: new oj.Color('800000')
    });
    Object.defineProperty(oj.Color, 'MEDIUMAQUAMARINE', {
      writable: false,
      value: new oj.Color('66cdaa')
    });
    Object.defineProperty(oj.Color, 'MEDIUMBLUE', {
      writable: false,
      value: new oj.Color('0000cd')
    });
    Object.defineProperty(oj.Color, 'MEDIUMORCHID', {
      writable: false,
      value: new oj.Color('ba55d3')
    });
    Object.defineProperty(oj.Color, 'MEDIUMPURPLE', {
      writable: false,
      value: new oj.Color('9370db')
    });
    Object.defineProperty(oj.Color, 'MEDIUMSEAGREEN', {
      writable: false,
      value: new oj.Color('3cb371')
    });
    Object.defineProperty(oj.Color, 'MEDIUMSLATEBLUE', {
      writable: false,
      value: new oj.Color('7b68ee')
    });
    Object.defineProperty(oj.Color, 'MEDIUMSPRINGGREEN', {
      writable: false,
      value: new oj.Color('00fa9a')
    });
    Object.defineProperty(oj.Color, 'MEDIUMTURQUOISE', {
      writable: false,
      value: new oj.Color('48d1cc')
    });
    Object.defineProperty(oj.Color, 'MEDIUMVIOLETRED', {
      writable: false,
      value: new oj.Color('c71585')
    });
    Object.defineProperty(oj.Color, 'MIDNIGHTBLUE', {
      writable: false,
      value: new oj.Color('191970')
    });
    Object.defineProperty(oj.Color, 'MINTCREAM', {
      writable: false,
      value: new oj.Color('f5fffa')
    });
    Object.defineProperty(oj.Color, 'MISTYROSE', {
      writable: false,
      value: new oj.Color('ffe4e1')
    });
    Object.defineProperty(oj.Color, 'MOCCASIN', {
      writable: false,
      value: new oj.Color('ffe4b5')
    });
    Object.defineProperty(oj.Color, 'NAVAJOWHITE', {
      writable: false,
      value: new oj.Color('ffdead')
    });
    Object.defineProperty(oj.Color, 'NAVY', {
      writable: false,
      value: new oj.Color('000080')
    });
    Object.defineProperty(oj.Color, 'OLDLACE', {
      writable: false,
      value: new oj.Color('fdf5e6')
    });
    Object.defineProperty(oj.Color, 'OLIVE', {
      writable: false,
      value: new oj.Color('808000')
    });
    Object.defineProperty(oj.Color, 'OLIVEDRAB', {
      writable: false,
      value: new oj.Color('6b8e23')
    });
    Object.defineProperty(oj.Color, 'ORANGE', {
      writable: false,
      value: new oj.Color('ffa500')
    });
    Object.defineProperty(oj.Color, 'ORANGERED', {
      writable: false,
      value: new oj.Color('ff4500')
    });
    Object.defineProperty(oj.Color, 'ORCHID', {
      writable: false,
      value: new oj.Color('da70d6')
    });
    Object.defineProperty(oj.Color, 'PALEGOLDENROD', {
      writable: false,
      value: new oj.Color('eee8aa')
    });
    Object.defineProperty(oj.Color, 'PALEGREEN', {
      writable: false,
      value: new oj.Color('98fb98')
    });
    Object.defineProperty(oj.Color, 'PALETURQUOISE', {
      writable: false,
      value: new oj.Color('afeeee')
    });
    Object.defineProperty(oj.Color, 'PALEVIOLETRED', {
      writable: false,
      value: new oj.Color('db7093')
    });
    Object.defineProperty(oj.Color, 'PAPAYAWHIP', {
      writable: false,
      value: new oj.Color('ffefd5')
    });
    Object.defineProperty(oj.Color, 'PEACHPUFF', {
      writable: false,
      value: new oj.Color('ffdab9')
    });
    Object.defineProperty(oj.Color, 'PERU', {
      writable: false,
      value: new oj.Color('cd853f')
    });
    Object.defineProperty(oj.Color, 'PINK', {
      writable: false,
      value: new oj.Color('ffc0cb')
    });
    Object.defineProperty(oj.Color, 'PLUM', {
      writable: false,
      value: new oj.Color('dda0dd')
    });
    Object.defineProperty(oj.Color, 'POWDERBLUE', {
      writable: false,
      value: new oj.Color('b0e0e6')
    });
    Object.defineProperty(oj.Color, 'PURPLE', {
      writable: false,
      value: new oj.Color('800080')
    });
    Object.defineProperty(oj.Color, 'REBECCAPURPLE', {
      writable: false,
      value: new oj.Color('663399')
    });
    Object.defineProperty(oj.Color, 'RED', {
      writable: false,
      value: new oj.Color('f00')
    });
    Object.defineProperty(oj.Color, 'ROSYBROWN', {
      writable: false,
      value: new oj.Color('bc8f8f')
    });
    Object.defineProperty(oj.Color, 'ROYALBLUE', {
      writable: false,
      value: new oj.Color('4169e1')
    });
    Object.defineProperty(oj.Color, 'SADDLEBROWN', {
      writable: false,
      value: new oj.Color('8b4513')
    });
    Object.defineProperty(oj.Color, 'SALMON', {
      writable: false,
      value: new oj.Color('fa8072')
    });
    Object.defineProperty(oj.Color, 'SANDYBROWN', {
      writable: false,
      value: new oj.Color('f4a460')
    });
    Object.defineProperty(oj.Color, 'SEAGREEN', {
      writable: false,
      value: new oj.Color('2e8b57')
    });
    Object.defineProperty(oj.Color, 'SEASHELL', {
      writable: false,
      value: new oj.Color('fff5ee')
    });
    Object.defineProperty(oj.Color, 'SIENNA', {
      writable: false,
      value: new oj.Color('a0522d')
    });
    Object.defineProperty(oj.Color, 'SILVER', {
      writable: false,
      value: new oj.Color('c0c0c0')
    });
    Object.defineProperty(oj.Color, 'SKYBLUE', {
      writable: false,
      value: new oj.Color('87ceeb')
    });
    Object.defineProperty(oj.Color, 'SLATEBLUE', {
      writable: false,
      value: new oj.Color('6a5acd')
    });
    Object.defineProperty(oj.Color, 'SLATEGRAY', {
      writable: false,
      value: new oj.Color('708090')
    });
    Object.defineProperty(oj.Color, 'SLATEGREY', {
      writable: false,
      value: new oj.Color('708090')
    });
    Object.defineProperty(oj.Color, 'SNOW', {
      writable: false,
      value: new oj.Color('fffafa')
    });
    Object.defineProperty(oj.Color, 'SPRINGGREEN', {
      writable: false,
      value: new oj.Color('00ff7f')
    });
    Object.defineProperty(oj.Color, 'STEELBLUE', {
      writable: false,
      value: new oj.Color('4682b4')
    });
    Object.defineProperty(oj.Color, 'TAN', {
      writable: false,
      value: new oj.Color('d2b48c')
    });
    Object.defineProperty(oj.Color, 'TEAL', {
      writable: false,
      value: new oj.Color('008080')
    });
    Object.defineProperty(oj.Color, 'THISTLE', {
      writable: false,
      value: new oj.Color('d8bfd8')
    });
    Object.defineProperty(oj.Color, 'TOMATO', {
      writable: false,
      value: new oj.Color('ff6347')
    });
    Object.defineProperty(oj.Color, 'TURQUOISE', {
      writable: false,
      value: new oj.Color('40e0d0')
    });
    Object.defineProperty(oj.Color, 'VIOLET', {
      writable: false,
      value: new oj.Color('ee82ee')
    });
    Object.defineProperty(oj.Color, 'WHEAT', {
      writable: false,
      value: new oj.Color('f5deb3')
    });
    Object.defineProperty(oj.Color, 'WHITE', {
      writable: false,
      value: new oj.Color('fff')
    });
    Object.defineProperty(oj.Color, 'WHITESMOKE', {
      writable: false,
      value: new oj.Color('f5f5f5')
    });
    Object.defineProperty(oj.Color, 'YELLOW', {
      writable: false,
      value: new oj.Color('ff0')
    });
    Object.defineProperty(oj.Color, 'YELLOWGREEN', {
      writable: false,
      value: new oj.Color('9acd32')
    });
    Object.defineProperty(oj.Color, 'TRANSPARENT', {
      writable: false,
      value: new oj.Color('rgba(0,0,0,0)')
    });
  }
  /**
   * Returns a valid alpha value [0);1] with all invalid values being set to 1
   * @param {number} a alpha value
   * @returns {number} alpha value
   * @memberof oj.Color
   * @private
   */


  function boundAlpha(a) {
    var _a = parseFloat(a);

    if (isNaN(_a) || _a < 0 || _a > 1) {
      _a = 1;
    }

    return _a;
  }
  /**
   * Take input from [0, n] and return it as [0, 1]
   * @param {string|number} n The input value
   * @param {number} max The max value
   * @returns {number}
   * @memberof oj.Color
   * @private
   */


  function bound01(n, max) {
    var _n = n;

    if (isOnePointZero(_n)) {
      _n = '100%';
    }

    var processPercent = isPercentage(_n);
    _n = mathMin(max, mathMax(0, parseFloat(_n))); // Automatically convert percentage into number

    if (processPercent) {
      _n = parseInt(_n * max, 10) / 100;
    } // Handle floating point rounding errors


    if (Math.abs(_n - max) < 0.000001) {
      return 1;
    } // Convert into [0, 1] range if it isn't already


    return _n % max / parseFloat(max);
  }
  /**
   * Parse a base-16 hex value into a base-10 integer
   * @param {number} val The input value
   * @returns {number}
   * @memberof oj.Color
   * @private
   */


  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  /**
   * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
   * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
   * @param {string|number} n The input value
   * @returns {boolean}
   * @memberof oj.Color
   * @private
   */


  function isOnePointZero(n) {
    return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
  }
  /**
   * Returns true if supplied string is a percentage
   * @param {string|number} n The input value
   * @returns {boolean} true if supplied string is a percentage
   * @memberof oj.Color
   * @private
   */


  function isPercentage(n) {
    return typeof n === 'string' && n.indexOf('%') !== -1;
  }
  /**
   * Replace a decimal with it's percentage value
   * @memberof oj.Color
   * @private
   */


  function convertToPercentage(n) {
    var _n = n;

    if (_n <= 1) {
      _n = _n * 100 + '%';
    }

    return _n;
  }
  /**
   * Converts a hex value to a decimal
   * @param {number} h The hex value
   * @memberof oj.Color
   * @private
   */

  /*    Wait for CSS4
  function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
  }
  */


  var matchers = function () {
    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = '[-\\+]?\\d+%?'; // <http://www.w3.org/TR/css3-values/#number-value>

    var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?'; // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.

    var CSS_UNIT = '(?:' + CSS_NUMBER + ')|(?:' + CSS_INTEGER + ')'; // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren

    var PERMISSIVE_MATCH3 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
    var PERMISSIVE_MATCH4 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
    return {
      CSS_UNIT: new RegExp(CSS_UNIT),
      rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
      rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
      hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
      hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
      hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
      hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
      hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
      hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
  }();
  /**
   * Accepts a single string/number and checks to see if it looks like a CSS unit
   * (see `matchers` above for definition).
   * @param {string|number} color  The value to check.
   * @returns {boolean} true if valid CSS
   * @memberof oj.Color
   * @private
   */


  function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
  }
  /**
   * Permissive color string parsing.  Takes in a number of formats, and outputs an object
   * based on detected format.
   * @param {string}  color  A CSS color specification string.
   * @return {Object | boolean}  Returns an object with properties r, g, b  or  h, s, l  or  h, s, v,
   *                             or false if parsing failed.
   * @memberof oj.Color
   * @private
   */


  function stringInputToObject(color) {
    // eslint-disable-next-line no-param-reassign
    color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();

    if (color === 'transparent') {
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 0
      };
    } // Strategy:
    // 1) Try to match string input using regular expressions.
    // 2) Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // 3) Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the oj.Color is initialized with string or object.


    var match = matchers.rgb.exec(color);

    if (match) {
      return {
        r: match[1],
        g: match[2],
        b: match[3]
      };
    }

    match = matchers.rgba.exec(color);

    if (match) {
      return {
        r: match[1],
        g: match[2],
        b: match[3],
        a: match[4]
      };
    }

    match = matchers.hsl.exec(color);

    if (match) {
      return {
        h: match[1],
        s: match[2],
        l: match[3]
      };
    }

    match = matchers.hsla.exec(color);

    if (match) {
      return {
        h: match[1],
        s: match[2],
        l: match[3],
        a: match[4]
      };
    }

    match = matchers.hsv.exec(color);

    if (match) {
      return {
        h: match[1],
        s: match[2],
        v: match[3]
      };
    }

    match = matchers.hsva.exec(color);

    if (match) {
      return {
        h: match[1],
        s: match[2],
        v: match[3],
        a: match[4]
      };
    }

    match = matchers.hex6.exec(color);

    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3])
      };
    }

    match = matchers.hex3.exec(color);

    if (match) {
      return {
        r: parseIntFromHex(match[1] + '' + match[1]),
        g: parseIntFromHex(match[2] + '' + match[2]),
        b: parseIntFromHex(match[3] + '' + match[3])
      };
    }
    /*    Wait for CSS4
      if ((match = matchers.hex8.exec(color)))
      {
        return {
                 "a": convertHexToDecimal(match[1]),
                 "r": parseIntFromHex(match[2]),
                 "g": parseIntFromHex(match[3]),
                 "b": parseIntFromHex(match[4])
               };
      }
    */
    // console.log("matchers false") ;


    return false;
  }

  _initColorConstants();
})(); // mapping a variable to the name used in the require callback function for this module
// it is used in a no-require environment (oj.js)
// eslint-disable-next-line no-unused-vars


var Color = oj.Color;

  return oj.Color;
});