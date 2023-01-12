/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojtranslation', 'ojs/ojconverter', 'ojs/ojvalidation-error'], function (oj, Translations, Converter, ojvalidationError) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  Converter = Converter && Object.prototype.hasOwnProperty.call(Converter, 'default') ? Converter['default'] : Converter;

  /**
   * ColorConverter Contract.
   * @ignore
   */

  /**
     * @export
     * @constructor
     * @final
     * @augments oj.Converter
     * @name oj.ColorConverter
     * @ojtsimport {module: "ojcolor", type: "AMD", importName: "Color"}
     * @ojtsimport {module: "ojconverter", type:"AMD", importName: "Converter"}
     * @ojtsmodule
     * @ojsignature [{target: "Type",
     *                value: "class ColorConverter implements Converter<oj.Color>"},
     *               {target: "Type",
     *                value: "oj.ColorConverter.ConverterOptions",
     *                for: "options",
     *                jsdocOverride: true}
     *              ]

     * @classdesc An {@link Color} object format converter.
     * @desc Creates a Converter that allows any color format to be obtained from an {@link Color} object.
     * @since 0.6.0
     * @param {Object=} options - an object literal used to provide optional information to
     * initialize the converter.
     * @example <caption>Create a color converter to convert an rgb specification to hsl format</caption>
     * var cv        = new ColorConverter({format: "hsl");
     * var color     = new oj.Color("rgb(30, 87, 236)") ;
     * var hsl       = cv.format(color);   -->  "hsl(223, 84%, 52%)"
     */
  const ColorConverter = function (options) {
    this.Init(options);
  };

  /**
   * @typedef {object} oj.ColorConverter.ConverterOptions
   * @property {('rgb'|'hsl'|'hsv'|'hex'|'hex3')=} format - sets the format of the converted color specification.
   * Allowed values are "rgb" (the default, if omitted), "hsl", "hsv" "hex", and "hex3". "hex" returns six
   * hex digits ('#rrggbb'), and "hex3" returns three hex digits if possible ('#rgb') or six hex
   * digits if the value cannot be converted to three.
   */

  // Subclass from Converter
  oj.Object.createSubclass(ColorConverter, Converter, 'oj.ColorConverter');

  /**
   * Initializes the color converter instance with the set options.
   * @param {Object=} options an object literal used to provide an optional information to
   * initialize the converter.<p>
   * @export
   * @ignore
   */
  ColorConverter.prototype.Init = function (options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    // eslint-disable-next-line no-param-reassign
    options.format = options.format || 'rgb';
    ColorConverter.superclass.Init.call(this, options);
  };

  /**
   * Formats the color using the options provided into a string.
   *
   * @param {oj.Color} color the {@link Color} instance to be formatted to a color specification string
   * @return {(string | null)} the color value formatted to the color specification defined in the options.
   * @throws {Error} a ConverterError if formatting fails, or the color option is invalid.
   * @export
   * @memberof oj.ColorConverter
   * @instance
   * @method format
   */
  ColorConverter.prototype.format = function (color) {
    var fmt = this._getFormat();
    var ret = null;

    if (fmt === 'rgb') {
      ret = color.toString();
    } else if (fmt === 'hsl') {
      ret = ColorConverter._toHslString(color);
    } else if (fmt === 'hex') {
      ret = ColorConverter._toHexString(color);
    } else if (fmt === 'hex3') {
      ret = ColorConverter._toHexString(color, true);
    } else if (fmt === 'hsv') {
      ret = ColorConverter._toHsvString(color);
    } else {
      ColorConverter._throwInvalidColorFormatOption();
    }

    return ret || ColorConverter.superclass.format.call(this, color);
  };

  /**
   * Parses a CSS3 color specification string and returns an oj.Color object.</br>
   * (Note that the "format" option used to create the Converter is not used
   * by this method, since the oj.Color object created is color agnostic.)
   * @param {string} value The color specification string to parse.
   * @return {oj.Color} the parsed value as an {@link Color} object.
   * @throws {Error} a ConverterError if parsing fails
   * @export
   * @memberof oj.ColorConverter
   * @instance
   * @method parse
   */
  ColorConverter.prototype.parse = function (value) {
    try {
      return new oj.Color(value); // throws error if invalid
    } catch (e) {
      throw ColorConverter._throwInvalidColorSyntax(); // This throw is not reachable.  THe function does it. Done for ESLint
    }
  };

  /**
   * Returns a hint that describes the color converter format.
   * @return {string} The expected format of a converted color.
   * @export
   * @memberof oj.ColorConverter
   * @instance
   * @method getHint
   */
  ColorConverter.prototype.getHint = function () {
    return this._getFormat();
  };

  /**
   * Returns an object literal with properties reflecting the color formatting options computed based
   * on the options parameter.
   *
   * @ojsignature {target: "Type", for: "returns", value: "oj.ColorConverter.ConverterOptions"}
   * @return {Object} An object literal containing the resolved values for the following options.
   * <ul>
   * <li><b>format</b>: A string value with the format of the color specification.
   * for formatting.</li>
   * </ul>
   * @export
   * @memberof oj.ColorConverter
   * @instance
   * @method resolvedOptions
   */
  ColorConverter.prototype.resolvedOptions = function () {
    return {
      format: this._getFormat()
    };
  };

  /**
   * Returns the options called with converter initialization.
   * @return {Object} an object of options.
   * @ojsignature {target: "Type", for: "returns",
   *                value: "oj.ColorConverter.ConverterOptions"}
   * @export
   * @memberof oj.ColorConverter
   * @instance
   * @method getOptions
   */
  ColorConverter.prototype.getOptions = function () {
    return ColorConverter.superclass.getOptions.call(this);
  };

  /**
   * @private
   * @memberof oj.ColorConverter
   */
  ColorConverter.prototype._getFormat = function () {
    return ColorConverter.superclass.getOptions.call(this).format;
  };

  /**-------------------------------------------------------------*/
  /*   Helpers                                                    */
  /**-------------------------------------------------------------*/

  /**
   *  Converts an oj.Color object to a 3 or 6 hex character string
   *  @param {Object} color  The oj.Color object to be converted to a hex string.
   *  @param {boolean=} allow3Char  If true the representation is 3 hex characters
   *  (if possible). If false, or omitted, 6 hex characters are used.
   *  @return {string} The hex string representation of the color object.
   *  @private
   */
  ColorConverter._toHexString = function (color, allow3Char) {
    return '#' + ColorConverter._toHex(color, allow3Char);
  };

  /**
   *  Converts an oj.Color object to an hsl/hsla string
   *  @param {Object} color  The oj.Color object to be converted to an hsl/hsla string.
   *  @return {string} The hsl/hsla representation of the color object.
   *  @private
   */
  ColorConverter._toHslString = function (color) {
    var hsl = ColorConverter._rgbToHsl(color._r, color._g, color._b);
    var h = Math.round(hsl.h * 360);
    var s = Math.round(hsl.s * 100);
    var l = Math.round(hsl.l * 100);

    return color._a === 1
      ? 'hsl(' + h + ', ' + s + '%, ' + l + '%)'
      : 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + color._a + ')';
  };

  /**
   *  Converts an oj.Color object to a 3 or 6 hex character string
   *  @param {Object} color  The oj.Color object to be converted to a hex string.
   *  @param {boolean=} allow3Char  If true the representation is 3 hex characters
   *                   (if possible). If false, or omitted, 6 hex characters are used.
   *  @return {string} The hex string representation of the color object.
   *  @private
   */
  ColorConverter._toHex = function (color, allow3Char) {
    return ColorConverter._rgbToHex(color._r, color._g, color._b, allow3Char);
  };

  /**
   *  Converts an oj.Color object to an hsv/hsva string
   *  @param {Object} color  The oj.Color object to be converted to an hsv/hsva string.
   *  @return {string} The hsv/hsva representation of the color object.
   *  @private
   */
  ColorConverter._toHsvString = function (color) {
    var hsv = ColorConverter._rgbToHsv(color._r, color._g, color._b);

    var h = Math.round(hsv.h * 360);
    var s = Math.round(hsv.s * 100);
    var v = Math.round(hsv.v * 100);

    return color._a === 1
      ? 'hsv(' + h + ', ' + s + '%, ' + v + '%)'
      : // "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
        'hsva(' + h + ', ' + s + '%, ' + v + '%, ' + color._a + ')';
  };

  /**
   * Converts RGB color values to hex
   * @param {number} r the red value in the set [0,255]
   * @param {number} g the green value in the set [0,255]
   * @param {number} b the blue value in the set [0,255]
   * @param {boolean=} allow3Char  If true the representation is 3 hex characters
   *                   (if possible). If false, or omitted, 6 hex characters are used.
   * @returns {string} a 3 or 6 hex character string.
   * @private
   */
  ColorConverter._rgbToHex = function (r, g, b, allow3Char) {
    var hex = [
      ColorConverter._pad2(Math.round(r).toString(16)),
      ColorConverter._pad2(Math.round(g).toString(16)),
      ColorConverter._pad2(Math.round(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (
      allow3Char &&
      hex[0].charAt(0) === hex[0].charAt(1) &&
      hex[1].charAt(0) === hex[1].charAt(1) &&
      hex[2].charAt(0) === hex[2].charAt(1)
    ) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join('');
  };

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
   * @private
   */
  ColorConverter._rgbToHsl = function (r, g, b) {
    // eslint-disable-next-line no-param-reassign
    r = ColorConverter._bound01(r, 255);
    // eslint-disable-next-line no-param-reassign
    g = ColorConverter._bound01(g, 255);
    // eslint-disable-next-line no-param-reassign
    b = ColorConverter._bound01(b, 255);

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var s;
    var l = (max + min) / 2;

    if (max === min) {
      h = 0; // achromatic
      s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }

      h /= 6;
    }

    return { h: h, s: s, l: l };
  };

  /**
   * Converts an RGB color value to HSV.
   * Handle bounds/percentage checking to conform to CSS color spec, and returns
   * an object containg the h,s,v values.
   * <http://www.w3.org/TR/css3-color/>
   * Assumes:  r, g, and b are contained in the set [0,255] or [0,1]
   * @param {number} r the red value
   * @param {number} g the green value
   * @param {number} b the blue value
   * @returns {Object} Object with properties h, s, v, in [0,1].
   * @private
   */
  ColorConverter._rgbToHsv = function (r, g, b) {
    // eslint-disable-next-line no-param-reassign
    r = ColorConverter._bound01(r, 255);
    // eslint-disable-next-line no-param-reassign
    g = ColorConverter._bound01(g, 255);
    // eslint-disable-next-line no-param-reassign
    b = ColorConverter._bound01(b, 255);

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var v = max;

    var d = max - min;
    var s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;
    }
    return { h: h, s: s, v: v };
  };

  /**
   * Converts an RGBA color plus alpha transparency to hex
   * Assumes r, g, b and a are contained in the set [0, 255]
   * @param {number} r the red value in the set [0, 255]
   * @param {number} g the green value in the set [0, 255]
   * @param {number} b the blue value in the set [0, 255]
   * @param {number} a the alpha value in the set [0,1]
   * Returns an 8 character hex string
   */
  /*    NOT USED currently
     function rgbaToHex(r, g, b, a)
     {
     var hex = [
     pad2(convertDecimalToHex(a)),
     pad2(mathRound(r).toString(16)),
     pad2(mathRound(g).toString(16)),
     pad2(mathRound(b).toString(16))
     ];

     return hex.join("");
     }
     */

  /**
   * Take input from [0, n] and return it as [0, 1]
   * @private
   */
  ColorConverter._bound01 = function (n, max) {
    if (ColorConverter._isOnePointZero(n)) {
      // eslint-disable-next-line no-param-reassign
      n = '100%';
    }

    var processPercent = ColorConverter._isPercentage(n);
    // eslint-disable-next-line no-param-reassign
    n = Math.min(max, Math.max(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
      // eslint-disable-next-line no-param-reassign
      n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if (Math.abs(n - max) < 0.000001) {
      return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
  };

  /**
   *   Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
   *   <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
   *   @private
   */
  ColorConverter._isOnePointZero = function (n) {
    return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
  };

  /**
   *  Check to see if string passed in is a percentage
   *  @param {string}  n  The number string
   *  @return {boolean}  True if the string contains a '%' character.
   *  @private
   */
  ColorConverter._isPercentage = function (n) {
    return typeof n === 'string' && n.indexOf('%') !== -1;
  };

  /**
   *  Force a hex value string to have 2 characters by inserting a preceding zero
   *  if neccessary.  e.g. 'a' -> '0a'
   *  @param {string} c  The hex character(s) to be tested.
   *  @return {string} A two character hex string.
   *  @private
   */
  ColorConverter._pad2 = function (c) {
    return c.length === 1 ? '0' + c : '' + c;
  };

  /*
   *   Throw an invalid color specfication error.
   */
  ColorConverter._throwInvalidColorSyntax = function () {
    var summary = Translations.getTranslatedString('oj-converter.color.invalidSyntax.summary');
    var detail = Translations.getTranslatedString('oj-converter.color.invalidSyntax.detail');

    var ce = new ojvalidationError.ConverterError(summary, detail);

    throw ce;
  };

  /*
   *   Throw an invalid converter specfication error.
   */
  ColorConverter._throwInvalidColorFormatOption = function () {
    var summary = Translations.getTranslatedString('oj-converter.color.invalidFormat.summary');
    var detail = Translations.getTranslatedString('oj-converter.color.invalidFormat.detail');

    var ce = new ojvalidationError.ConverterError(summary, detail);

    throw ce;
  };

  return ColorConverter;

});
