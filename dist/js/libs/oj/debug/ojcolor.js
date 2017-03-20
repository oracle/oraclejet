/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore'], function(oj)
{

/**
  * Copyright (c) 2016, Oracle and/or its affiliates.
  * All rights reserved.
  */

 /*
  * Portions of this component are based on  
  * TinyColor v1.3.0
  * https://github.com/bgrins/TinyColor
  * Brian Grinstead, MIT License
  */

(function()
{
  var trimLeft    = /^\s+/,
      trimRight   = /\s+$/,
      tinyCounter = 0,
      mathRound   = Math.round,
      mathMin     = Math.min,
      mathMax     = Math.max;

/**
  * @class oj.Color
  * @classdesc Immutable object representing a color.
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
  * var cf       = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_COLOR);
  * var convHsl  = cf.createConverter({"format": "hsl"}) ;
  *
  * var c        = new oj.Color('rgb(0, 191, 255)');
  * var s        = convHsl.format(c) ;            // returns "hsl(197, 71%, 73%)"

  *</p></br>
  * @param {string | Object} color 
  *<ul><li> A valid CSS3 color specification string (refer to 
  * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value} for syntax)</li>
  *<li>An object containing one of the following groups of fields:
  * <ul>
  *  <li>r: &nbsp; the red value</li>
  *  <li>g: &nbsp; the green value</li>
  *  <li>b: &nbsp; the blue value</li>
  *  <li>a: &nbsp; the alpha value (optional)</li>
  * </ul>
  *<br>
  * <ul>
  *  <li>h: &nbsp; the hue value</li>
  *  <li>s: &nbsp; the saturation value</li>
  *  <li>l: &nbsp; the luminosity or lightness value</li>
  *  <li>a: &nbsp; the alpha value (optional)</li>
  * </ul>
  *<br>
  * <ul>
  *  <li>h: &nbsp; the hue value</li>
  *  <li>s: &nbsp; the saturation value</li>
  *  <li>v: &nbsp; the value</li>
  *  <li>a: &nbsp; the alpha value (optional)</li>
  * </ul>
  *</li></ul>
  * @constructor
  * @throws {Error} if the color specification cannot be parsed correctly.
  * @export
  */
oj.Color = function (color) {

    var rgb, t ;

    color = (color) ? color : '';
    rgb = inputToRGB(color);

    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = Math.round(100*rgb.a)/100;
};

/**
  * Returns the red channel value of the color.
  * @param {boolean=} doNotRound  Omit or set to false to return an integer value.
  *                               Set to true to return the possible fractional value.
  *                               (Fractional values for the red, green, or blue channels can
  *                               arise when a color is defined using the "hsl" format.)
  * @return {number} The red channel value in the range [0,255].
  * @export
  */
oj.Color.prototype.getRed = function(doNotRound)
{
   doNotRound = doNotRound || false ;
   return doNotRound? this._r : mathRound(this._r) ;
};


/**
  * Returns the green channel value of the color.
  * @param {boolean=} doNotRound  Omit or set to false to return an integer value.
  *                               Set to true to return the possible fractional value.
  *                               (Fractional values for the red, green, or blue channels can
  *                               arise when a color is defined using the "hsl" format.)
  * @return {number} The green channel value contained in [0,255].
  * @export
  */
oj.Color.prototype.getGreen = function(doNotRound)
{
   doNotRound = doNotRound || false ;
   return doNotRound? this._g : mathRound(this._g) ;
};


/**
  * Returns the blue channel value of the color.
  * @param {boolean=} doNotRound  Omit or set to false to return an integer value.
  *                               Set to true to return the possible fractional value.
  *                               (Fractional values for the red, green, or blue channels can
  *                               arise when a color is defined using the "hsl" format.)
  * @return {number} The blue channel value contained in [0,255].
  * @export
  */
oj.Color.prototype.getBlue = function(doNotRound)
{
   doNotRound = doNotRound || false ;
   return doNotRound? this._b : mathRound(this._b) ;
};


/**
  *  Returns the alpha channel of the color.
  *  @return {number} The alpha channel value contained in [0,1].
  *  @export
  */
oj.Color.prototype.getAlpha = function()
{
   return this._a ;
};


/**
  *  Returns the color as an "rgb" or rgba" (if the alpha value is less than 1) CSS3 color
  *  specification string.
  *  @return {string} The color as an "rgb" or "rgba" CSS3 color specification string.
  *  @export
  */
oj.Color.prototype.toString = function()
{
   return toRgbString(this) ;
}

/**
  * Compares this color object with the supplied color specification, and returns true
  * if they represent the same color, else false.
  * @param {oj.Color} color   The color to be compared.
  * @return {boolean} Returns true if the comperand represents the same color.
  * @export
  */
oj.Color.prototype.isEqual =  function(color)
{
   var ret = false ;

   if (color instanceof oj.Color)
   {
      ret = ((this._r === color._r) && (this._g === color._g) &&
             (this._b === color._b) && (this._a === color._a)) ;
   }

   return ret ;
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
oj.Color.DARKTURQUOISE  = null;
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
/*
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
 */
function inputToRGB(color)
{
   var rgb = { r: 0, g: 0, b: 0 },
       a   = 1,
       s   = null,
       v   = null,
       l   = null,
       ok  = false;

   if (typeof color == "string")
   {
     color = stringInputToObject(color);  // convert to {"r":, "g":, "b":} or {"h":, "s":, l}, or {"h":, "s":, "v":}
   }

   if (typeof color == "object")
   {
       if (isValidCSSUnit(color["r"]) && isValidCSSUnit(color["g"]) && isValidCSSUnit(color["b"]))
       {
         rgb = rgbToRgb(color["r"], color["g"], color["b"]);
         ok = true;
       }
       else if (isValidCSSUnit(color["h"]) && isValidCSSUnit(color["s"]) && isValidCSSUnit(color["v"]))
       {
         s = convertToPercentage(color["s"]);
         v = convertToPercentage(color["v"]);
         rgb = hsvToRgb(color["h"], s, v);
         ok = true;
       }
       else if (isValidCSSUnit(color["h"]) && isValidCSSUnit(color["s"]) && isValidCSSUnit(color["l"]))
       {
         s = convertToPercentage(color["s"]);
         l = convertToPercentage(color["l"]);
         rgb = hslToRgb(color["h"], s, l);
         ok = true;
       }

       if (typeof color["a"] !== "undefined")
       {
         a = color["a"];
       }
   }

   if (!ok)
   {
     throw new Error("Invalid Color format");
   }

   a = boundAlpha(a);
   return {
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
          };
};


function  toRgbString(co)
{
   var b = (co._a < 1);
   return "rgb" + (b? "a(" : "(") +
           mathRound(co._r) + ", " + mathRound(co._g) + ", " + mathRound(co._b) + 
           (b? (", " + co._a) : "") + ")" ;
};


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
  */
function rgbToRgb(r, g, b)
{
   return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
          };
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
  */
function rgbToHsl(r, g, b)
{
   r = bound01(r, 255);
   g = bound01(g, 255);
   b = bound01(b, 255);

   var max = mathMax(r, g, b), min = mathMin(r, g, b);
   var h, s, l = (max + min) / 2;

   if (max == min)
   {
     h = s = 0; // achromatic
   }
   else
   {
     var d = max - min;
     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
     switch(max)
     {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
     }

     h /= 6;
   }

   return { h: h, s: s, l: l };
};

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
  */
function hslToRgb(h, s, l)
{
   var r, g, b;

   h = bound01(h, 360);
   s = bound01(s, 100);
   l = bound01(l, 100);

   function hue2rgb(p, q, t)
   {
     if(t < 0) t += 1;
     if(t > 1) t -= 1;
     if(t < 1/6) return p + (q - p) * 6 * t;
     if(t < 1/2) return q;
     if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
     return p;
   }

   if(s === 0)
   {
      r = g = b = l; // achromatic
   }
   else
   {
     var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
     var p = 2 * l - q;
     r = hue2rgb(p, q, h + 1/3);
     g = hue2rgb(p, q, h);
     b = hue2rgb(p, q, h - 1/3);
   }

   return { r: r * 255, g: g * 255, b: b * 255 };
};

/**
  * Converts an HSV color value to RGB.
  * Assumes: h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
  * @returns {Object} An object with properties  r, g, b  in the set [0,255]
  */
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}


function _initColorConstants()
{
  oj.Color["ALICEBLUE"]      = new oj.Color("f0f8ff");
  oj.Color["ANTIQUEWHITE"]   = new oj.Color("faebd7");
  oj.Color["AQUA"]           = new oj.Color("0ff");
  oj.Color["AQUAMARINE"]     = new oj.Color("7fffd4");
  oj.Color["AZURE"]          = new oj.Color("f0ffff");
  oj.Color["BEIGE"]          = new oj.Color("f5f5dc");
  oj.Color["BISQUE"]         = new oj.Color("ffe4c4");
  oj.Color["BLACK"]          = new oj.Color("000");
  oj.Color["BLANCHEDALMOND"] = new oj.Color("ffebcd");
  oj.Color["BLUE"]           = new oj.Color("00f");
  oj.Color["BLUEVIOLET"]     = new oj.Color("8a2be2");
  oj.Color["BROWN"]          = new oj.Color("a52a2a");
  oj.Color["BURLYWOOD"]      = new oj.Color("deb887");
  oj.Color["CADETBLUE"]      = new oj.Color("5f9ea0");
  oj.Color["CHARTREUSE"]     = new oj.Color("7fff00");
  oj.Color["CHOCOLATE"]      = new oj.Color("d2691e");
  oj.Color["CORAL"]          = new oj.Color("ff7f50");
  oj.Color["CORNFLOWERBLUE"] = new oj.Color("6495ed");
  oj.Color["CORNSILK"]       = new oj.Color("fff8dc");
  oj.Color["CRIMSON"]        = new oj.Color("dc143c");
  oj.Color["CYAN"]           = new oj.Color("0ff");
  oj.Color["DARKBLUE"]       = new oj.Color("00008b");
  oj.Color["DARKCYAN"]       = new oj.Color("008b8b");
  oj.Color["DARKGOLDENROD"]  = new oj.Color("b8860b");
  oj.Color["DARKGRAY"]       = oj.Color["DARKGREY"] =  new oj.Color("a9a9a9");
  oj.Color["DARKGREEN"]      = new oj.Color("006400");
  oj.Color["DARKKHAKI"]      = new oj.Color("bdb76b");
  oj.Color["DARKMAGENTA"]    = new oj.Color("8b008b");
  oj.Color["DARKOLIVEGREEN"] = new oj.Color("556b2f");
  oj.Color["DARKORANGE"]     = new oj.Color("ff8c00");
  oj.Color["DARKORCHID"]     = new oj.Color("9932cc");
  oj.Color["DARKRED"]        = new oj.Color("8b0000");
  oj.Color["DARKSALMON"]     = new oj.Color("e9967a");
  oj.Color["DARKSEAGREEN"]   = new oj.Color("8fbc8f");
  oj.Color["DARKSLATEBLUE"]  = new oj.Color("483d8b");
  oj.Color["DARKSLATEGRAY"]  = oj.Color["DARKSLATEGREY"]  = new oj.Color("2f4f4f");
  oj.Color["DARKTURQUOISE"]  = new oj.Color("00ced1");
  oj.Color["DARKVIOLET"]     = new oj.Color("9400d3");
  oj.Color["DEEPPINK"]       = new oj.Color("ff1493");
  oj.Color["DEEPSKYBLUE"]    = new oj.Color("00bfff");
  oj.Color["DIMGRAY"]        = oj.Color["DIMGREY"] = new oj.Color("696969");
  oj.Color["DODGERBLUE"]     = new oj.Color("1e90ff");
  oj.Color["FIREBRICK"]      = new oj.Color("b22222");
  oj.Color["FLORALWHITE"]    = new oj.Color("fffaf0");
  oj.Color["FORESTGREEN"]    = new oj.Color("228b22");
  oj.Color["FUCHSIA"]        = new oj.Color("f0f");
  oj.Color["GAINSBORO"]      = new oj.Color("dcdcdc");
  oj.Color["GHOSTWHITE"]     = new oj.Color("f8f8ff");
  oj.Color["GOLD"]           = new oj.Color("ffd700");
  oj.Color["GOLDENROD"]      = new oj.Color("daa520");
  oj.Color["GRAY"]           = oj.Color["GREY"] = new oj.Color("808080");
  oj.Color["GREEN"]          = new oj.Color("008000");
  oj.Color["GREENYELLOW"]    = new oj.Color("adff2f");
  oj.Color["HONEYDEW"]       = new oj.Color("f0fff0");
  oj.Color["HOTPINK"]        = new oj.Color("ff69b4");
  oj.Color["INDIANRED"]      = new oj.Color("cd5c5c");
  oj.Color["INDIGO"]         = new oj.Color("4b0082");
  oj.Color["IVORY"]          = new oj.Color("fffff0");
  oj.Color["KHAKI"]          = new oj.Color("f0e68c");
  oj.Color["LAVENDER"]       = new oj.Color("e6e6fa");
  oj.Color["LAVENDERBLUSH"]  = new oj.Color("fff0f5");
  oj.Color["LAWNGREEN"]      = new oj.Color("7cfc00");
  oj.Color["LEMONCHIFFON"]   = new oj.Color("fffacd");
  oj.Color["LIGHTBLUE"]      = new oj.Color("add8e6");
  oj.Color["LIGHTCORAL"]     = new oj.Color("f08080");
  oj.Color["LIGHTCYAN"]      = new oj.Color("e0ffff");
  oj.Color["LIGHTGOLDENRODYELLOW"]  = new oj.Color("fafad2");
  oj.Color["LIGHTGRAY"]      = oj.Color["LIGHTGREY"] = new oj.Color("d3d3d3");
  oj.Color["LIGHTGREEN"]     = new oj.Color("90ee90");
  oj.Color["LIGHTPINK"]      = new oj.Color("ffb6c1");
  oj.Color["LIGHTSALMON"]    = new oj.Color("ffa07a");
  oj.Color["LIGHTSEAGREEN"]  = new oj.Color("20b2aa");
  oj.Color["LIGHTSKYBLUE"]   = new oj.Color("87cefa");
  oj.Color["LIGHTSLATEGRAY"] = oj.Color["LIGHTSLATEGREY"] = new oj.Color("789");
  oj.Color["LIGHTSTEELBLUE"] = new oj.Color("b0c4de");
  oj.Color["LIGHTYELLOW"]    = new oj.Color("ffffe0");
  oj.Color["LIME"]           = new oj.Color("0f0");
  oj.Color["LIMEGREEN"]      = new oj.Color("32cd32");
  oj.Color["LINEN"]          = new oj.Color("faf0e6");
  oj.Color["MAGENTA"]        = new oj.Color("f0f");
  oj.Color["MAROON"]         = new oj.Color("800000");
  oj.Color["MEDIUMAQUAMARINE"] = new oj.Color("66cdaa");
  oj.Color["MEDIUMBLUE"]      = new oj.Color("0000cd");
  oj.Color["MEDIUMORCHID"]    = new oj.Color("ba55d3");
  oj.Color["MEDIUMPURPLE"]    = new oj.Color("9370db");
  oj.Color["MEDIUMSEAGREEN"]  = new oj.Color("3cb371");
  oj.Color["MEDIUMSLATEBLUE"] = new oj.Color("7b68ee");
  oj.Color["MEDIUMSPRINGGREEN"] = new oj.Color("00fa9a");
  oj.Color["MEDIUMTURQUOISE"]  = new oj.Color("48d1cc");
  oj.Color["MEDIUMVIOLETRED"]  = new oj.Color("c71585");
  oj.Color["MIDNIGHTBLUE"]   = new oj.Color("191970");
  oj.Color["MINTCREAM"]      = new oj.Color("f5fffa");
  oj.Color["MISTYROSE"]      = new oj.Color("ffe4e1");
  oj.Color["MOCCASIN"]       = new oj.Color("ffe4b5");
  oj.Color["NAVAJOWHITE"]    = new oj.Color("ffdead");
  oj.Color["NAVY"]           = new oj.Color("000080");
  oj.Color["OLDLACE"]        = new oj.Color("fdf5e6");
  oj.Color["OLIVE"]          = new oj.Color("808000");
  oj.Color["OLIVEDRAB"]      = new oj.Color("6b8e23");
  oj.Color["ORANGE"]         = new oj.Color("ffa500");
  oj.Color["ORANGERED"]      = new oj.Color("ff4500");
  oj.Color["ORCHID"]         = new oj.Color("da70d6");
  oj.Color["PALEGOLDENROD"]  = new oj.Color("eee8aa");
  oj.Color["PALEGREEN"]      = new oj.Color("98fb98");
  oj.Color["PALETURQUOISE"]  = new oj.Color("afeeee");
  oj.Color["PALEVIOLETRED"]  = new oj.Color("db7093");
  oj.Color["PAPAYAWHIP"]     = new oj.Color("ffefd5");
  oj.Color["PEACHPUFF"]      = new oj.Color("ffdab9");
  oj.Color["PERU"]           = new oj.Color("cd853f");
  oj.Color["PINK"]           = new oj.Color("ffc0cb");
  oj.Color["PLUM"]           = new oj.Color("dda0dd");
  oj.Color["POWDERBLUE"]     = new oj.Color("b0e0e6");
  oj.Color["PURPLE"]         = new oj.Color("800080");
  oj.Color["REBECCAPURPLE"]  = new oj.Color("663399");
  oj.Color["RED"]            = new oj.Color("f00");
  oj.Color["ROSYBROWN"]      = new oj.Color("bc8f8f");
  oj.Color["ROYALBLUE"]      = new oj.Color("4169e1");
  oj.Color["SADDLEBROWN"]    = new oj.Color("8b4513");
  oj.Color["SALMON"]         = new oj.Color("fa8072");
  oj.Color["SANDYBROWN"]     = new oj.Color("f4a460");
  oj.Color["SEAGREEN"]       = new oj.Color("2e8b57");
  oj.Color["SEASHELL"]       = new oj.Color("fff5ee");
  oj.Color["SIENNA"]         = new oj.Color("a0522d");
  oj.Color["SILVER"]         = new oj.Color("c0c0c0");
  oj.Color["SKYBLUE"]        = new oj.Color("87ceeb");
  oj.Color["SLATEBLUE"]      = new oj.Color("6a5acd");
  oj.Color["SLATEGRAY"]      = oj.Color["SLATEGREY"] = new oj.Color("708090");
  oj.Color["SNOW"]           = new oj.Color("fffafa");
  oj.Color["SPRINGGREEN"]    = new oj.Color("00ff7f");
  oj.Color["STEELBLUE"]      = new oj.Color("4682b4");
  oj.Color["TAN"]            = new oj.Color("d2b48c");
  oj.Color["TEAL"]           = new oj.Color("008080");
  oj.Color["THISTLE"]        = new oj.Color("d8bfd8");
  oj.Color["TOMATO"]         = new oj.Color("ff6347");
  oj.Color["TURQUOISE"]      = new oj.Color("40e0d0");
  oj.Color["VIOLET"]         = new oj.Color("ee82ee");
  oj.Color["WHEAT"]          = new oj.Color("f5deb3");
  oj.Color["WHITE"]          = new oj.Color("fff");
  oj.Color["WHITESMOKE"]     = new oj.Color("f5f5f5");
  oj.Color["YELLOW"]         = new oj.Color("ff0");
  oj.Color["YELLOWGREEN"]    = new oj.Color("9acd32");

  oj.Color["TRANSPARENT"]    = new oj.Color("rgba(0,0,0,0)") ;

};

/**
  * Returns a valid alpha value [0);1] with all invalid values being set to 1
  */
function boundAlpha(a)
{
  a = parseFloat(a);

  if (isNaN(a) || a < 0 || a > 1)
  {
     a = 1;
  }

  return a;
}


/**
  * Take input from [0, n] and return it as [0, 1]
  */

function bound01(n, max)
{
   if (isOnePointZero(n)) { n = "100%"; }

   var processPercent = isPercentage(n);
   n = mathMin(max, mathMax(0, parseFloat(n)));

   // Automatically convert percentage into number
   if (processPercent)
   {
     n = parseInt(n * max, 10) / 100;
   }

   // Handle floating point rounding errors
   if ((Math.abs(n - max) < 0.000001))
   {
     return 1;
   }

   // Convert into [0, 1] range if it isn't already
   return (n % max) / parseFloat(max);
}

/**
  *  Force a number between 0 and 1
  */
function clamp01(val)
{
    return mathMin(1, mathMax(0, val));
};

/**
  *  Parse a base-16 hex value into a base-10 integer
  */
function parseIntFromHex(val)
{
   return parseInt(val, 16);
}

/**
  *  Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
  *  <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
  */
function isOnePointZero(n)
{
   return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

/**
  *  Returns true if supplied string is a percentage
  */
function isPercentage(n)
{
   return typeof n === "string" && n.indexOf('%') != -1;
}

/*
 *  Force a hex value to have 2 characters
 */
function pad2(c)
{
   return c.length == 1 ? '0' + c : '' + c;
}

/*
 *  Replace a decimal with it's percentage value
 */
function convertToPercentage(n)
{
   if (n <= 1)
   {
     n = (n * 100) + "%";
   }

   return n;
}

/**
  *  Converts a decimal to a hex value
  */
function convertDecimalToHex(d)
{
   return Math.round(parseFloat(d) * 255).toString(16);
};

/**
  *  Converts a hex value to a decimal
  */
function convertHexToDecimal(h)
{
   return (parseIntFromHex(h) / 255);
}

var matchers = (function()
 {
    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb:      new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba:     new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl:      new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla:     new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv:      new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva:     new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3:     /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6:     /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex8:     /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
 })();


/**
  *  Accepts a single string/number and checks to see if it looks like a CSS unit
  *  (see `matchers` above for definition).
  */
function isValidCSSUnit(color)
{
   return !!matchers.CSS_UNIT.exec(color);
}

/**
  *  Permissive color string parsing.  Takes in a number of formats, and outputs an object
  *  based on detected format.
  *  @param {string}  color  A CSS color specification string.
  *  @return {Object | boolean}  Returns an object with properties r, g, b  or  h, s, l  or  h, s, v,
  *                              or false if parsing failed.
  */
function stringInputToObject(color)
{
  color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();

  if (color == 'transparent')
  {
     return { "r": 0, "g": 0, "b": 0, "a": 0};
  }


  // Strategy:
  // 1) Try to match string input using regular expressions.
  // 2) Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
  // 3) Just return an object and let the conversion functions handle that.
  // This way the result will be the same whether the oj.Color is initialized with string or object.
  var match;
  if ((match = matchers.rgb.exec(color)))
  {
    return { "r": match[1], "g": match[2], "b": match[3] };
  }
  if ((match = matchers.rgba.exec(color)))
  {
    return { "r": match[1], "g": match[2], "b": match[3], "a": match[4] };
  }
  if ((match = matchers.hsl.exec(color)))
  {
    return { "h": match[1], "s": match[2], "l": match[3] };
  }
  if ((match = matchers.hsla.exec(color)))
  {
    return { "h": match[1], "s": match[2], "l": match[3], "a": match[4] };
  }
  if ((match = matchers.hsv.exec(color)))
  {
    return { "h": match[1], "s": match[2], "v": match[3] };
  }
  if ((match = matchers.hsva.exec(color)))
  {
    return { "h": match[1], "s": match[2], "v": match[3], "a": match[4] };
  }
  if ((match = matchers.hex6.exec(color)))
  {
     return {
              "r": parseIntFromHex(match[1]),
              "g": parseIntFromHex(match[2]),
              "b": parseIntFromHex(match[3])
            };
  }
  if ((match = matchers.hex3.exec(color)))
  {
    return {
             "r": parseIntFromHex(match[1] + '' + match[1]),
             "g": parseIntFromHex(match[2] + '' + match[2]),
             "b": parseIntFromHex(match[3] + '' + match[3])
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

//console.log("matchers false") ;
  return false;
};

_initColorConstants() ;


})();

});
