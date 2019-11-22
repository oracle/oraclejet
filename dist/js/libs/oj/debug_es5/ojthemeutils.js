/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojlogger'], function(Logger)
{
  "use strict";


/* jslint browser: true*/

/* global Logger:false */

/**
 * @namespace oj.ThemeUtils
 * @classdesc Services for getting information from the theme
 * @since 1.2.0
 * @ojtsmodule
 * @export
 */
var ThemeUtils = function ThemeUtils() {};
/**
 * get the name of the current theme
 * @method getThemeName
 * @memberof oj.ThemeUtils
 * @export
 * @static
 * @memberof oj.ThemeUtils
 *
 * @return {string|null} the name of the theme
 */


ThemeUtils.getThemeName = function () {
  // get the map of theme info
  var themeMap = ThemeUtils.parseJSONFromFontFamily('oj-theme-json') || {};
  return themeMap.name;
};
/**
 * <p>Get the target platform of the current theme. </p>
 * <p>This API does not look at the user agent and therefore it
 *    tells you nothing about the current platform you are actually on.
 *    Instead it tells you the target platform the theme was written
 *    for so that programmatic behaviors that match the theme's UI can be written.
 *    This can be useful when writing a cross platform hybrid mobile app.  </p>
 *
 * <p>Example</p>
 * <pre class="prettyprint">
 * <code>
 * var themeTargetPlatform = oj.ThemeUtils.getThemeTargetPlatform();
 *
 * if (themeTargetPlatform == 'ios')
 *    // code for a behavior familiar in ios
 * else if (themeTargetPlatform == 'android')
 *    // code for a behavior familiar on android
 * else
 *    // code for the default behavior
 * </code></pre>
 * @export
 * @static
 * @method getThemeTargetPlatform
 * @memberof oj.ThemeUtils
 * @return {string|null} the target platform can be any string the theme
 * wants to send down, but common values are 'all', 'web', 'ios', 'android', 'windows'
 */


ThemeUtils.getThemeTargetPlatform = function () {
  // get the map of theme info
  var themeMap = ThemeUtils.parseJSONFromFontFamily('oj-theme-json') || {};
  return themeMap.targetPlatform;
};
/**
 * clear values cached in  [oj.ThemeUtils.parseJSONFromFontFamily]{@link oj.ThemeUtils.parseJSONFromFontFamily}
 * @export
 * @static
 * @method clearCache
 * @return {void}
 * @memberof oj.ThemeUtils
 */


ThemeUtils.clearCache = function () {
  this._cache = null;
};
/**
 *
 * <p>json can be sent down as the font family in classes
 * that look something like this
 * (on the sass side of things see the file
 * scss/utilities/_oj.utilities.json.scss
 * for information on jet mixins available to generate json):<p>
 *
 * <p>Example CSS</p>
 * <pre class="prettyprint">
 * <code>
 * .demo-map-json {
 *    font-family: '{"foo":"bar", "binky": 4}';
 * }
 *
 * .demo-list-json {
 *    font-family: '["foo","bar","binky"}';
 * }
 * </code></pre>
 * <p>Example Usage</p>
 * <pre class="prettyprint">
 * <code>
 * var mymap = oj.ThemeUtils.parseJSONFromFontFamily("demo-map-json");
 * var myarray = oj.ThemeUtils.parseJSONFromFontFamily("demo-list-json");
 * </code></pre>
 *
 * This function
 * <ul>
 *   <li>Gets the font family string by creating a dom element,
 *      applying the selector passed in, calling getcomputedstyle,
 *      and then reading the value for font-family.
 *   </li>
 *   <li>Parses the font family value by calling JSON.pars.</li>
 *   <li>Caches the parsed value because calling getComputedStyle is a perf hit.
 *       Subsequent requests for the same selector will return the cached value.
 *       Call [oj.ThemeUtils.clearCache]{@link oj.ThemeUtils.clearCache} if new css is loaded.</li>
 *   <li>Return the parsed value.</li>
 * </ul>
 *
 * <p>
 * If new css is loaded call oj.ThemeUtils.clearCache to clear the cache</p>
 *
 * @method parseJSONFromFontFamily
 * @memberof oj.ThemeUtils
 * @param {string} selector a class selector name, for example 'demo-map-json';
 * @return {any} the result of parsing the font family with JSON.parse.
 *      The returned value is cached, so if you modify the returned
 *      value it will be reflected in the cache.
 * @throws {SyntaxError} If JSON.parse throws a SyntaxError exception we will log an error and rethrow
 * @export
 * @static
 */


ThemeUtils.parseJSONFromFontFamily = function (selector) {
  // NOTE: I first tried code inspired by
  // https://css-tricks.com/making-sass-talk-to-javascript-with-json/
  // so I was using :before and content, for example
  //   .oj-button-option-defaults:before {
  //     content: '{"foo":"bar", "binky": 4}';
  //    }
  //
  //  however IE 11 has a bug where the computed style doesn't actually
  //  seem to be computed when it comes to :before,
  //  so if you set a class that affects :before after the page loads
  //  on IE getComputedStyle doesn't work.
  //  See the pen below, the yellow box has the class applied in js,
  //  computedstyle works on chrome, doesn't work on IE11 for
  //  class applied after page load.
  //     http://codepen.io/gabrielle/pen/OVOwev
  // if needed create the cache and initialize some things
  if (this._cache == null) {
    this._cache = {}; // magic value that means null in the cache

    this._null_cache_value = {}; // font family is inherited, so even if no selector/json
    // is sent down we will get a string like
    // 'HelveticaNeue',Helvetica,Arial,sans-serif' off of our generated element.
    // So save off the font family from the head
    // element to compare to what we read off our generated element.

    this._headfontstring = window.getComputedStyle(document.head).getPropertyValue('font-family');
  } // see if we already have a map for this component's option defaults


  var jsonval = this._cache[selector]; // if there's something already cached return it

  if (jsonval === this._null_cache_value) {
    return null;
  } else if (jsonval != null) {
    return jsonval;
  } // there's nothing cached, so we need to create a dom element to apply the class to.
  // We're creating a meta element,
  // the hope is that the browser is smart enough to realize the
  // meta element isn't visible and therefore we avoid perf issues of calling
  // getcomputedstyle


  var elem = document.createElement('meta');
  elem.className = selector;
  document.head.appendChild(elem); // @HTMLUpdateOK

  var rawfontstring = window.getComputedStyle(elem).getPropertyValue('font-family');

  if (rawfontstring != null) {
    // if the raw font string is the same value as the saved header
    // font value then log a warning that no value was sent down.
    if (rawfontstring === this._headfontstring) {
      Logger.warn('parseJSONFromFontFamily: When the selector ', selector, ' is applied the font-family read off the dom element is ', rawfontstring, '. The parent dom elment has the same font-family value.', ' This is interpreted to mean that no value was sent down for selector ', selector, '. Null will be returned.');
    } else {
      // remove inconsistent quotes
      var fontstring = rawfontstring.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, ''); // console.log("json fontstring for selector " + selector + ': ' + fontstring);

      if (fontstring) {
        try {
          jsonval = JSON.parse(fontstring);
        } catch (e) {
          // In Firefox you can turn off the page font
          // Options -> Content -> Fonts and Colors -> Advanced
          // Uncheck the "Allow pages to choose their own fonts, instead of my selections above"
          // In that case they stick something like 'serif,"'at the front of the font family,
          // so search for the first comma, add 2, and try parsing again.
          var commaindex = fontstring.indexOf(',');
          var reparseSuccess = false;

          if (commaindex > -1) {
            fontstring = fontstring.substring(commaindex + 2);

            try {
              jsonval = JSON.parse(fontstring);
              reparseSuccess = true;
            } catch (e2) {// Ignore Error
            }
          }

          if (reparseSuccess === false) {
            Logger.error('Error parsing json for selector ' + selector + '.\nString being parsed is ' + fontstring + '. Error is:\n', e); // remove the meta tag

            document.head.removeChild(elem); // @HTMLUpdateOK

            throw e;
          }
        }
      }
    }
  } // remove the meta tag


  document.head.removeChild(elem); // @HTMLUpdateOK
  // cache the result

  if (jsonval == null) {
    this._cache[selector] = this._null_cache_value;
  } else {
    this._cache[selector] = jsonval;
  } // console.log(this._cache);


  return jsonval;
};

;return ThemeUtils;
});