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
 * @namespace oj.ResponsiveUtils
 * @classdesc Utilities for working with the framework's responsive screen widths
 * and ranges. Often used in conjunction with {@link oj.ResponsiveKnockoutUtils}
 * to create knockout observables that can be used to drive responsive page behavior.
 * See the method doc below for specific examples.
 * @ojtsmodule
 * @since 1.1.0
 * @hideconstructor
 * @export
 */
var ResponsiveUtils = function ResponsiveUtils() {};
/**
 * <p>In the jet sass files there are variables for
 * responsive screen widths, these look something like</p>
 *  <ul>
 *    <li>$screenSmallRange:  0, 767px;</li>
 *    <li>$screenMediumRange: 768px, 1023px;</li>
 *    <li>$screenLargeRange:  1024px, 1280px;</li>
 *    <li>$screenXlargeRange: 1281px, null;</li>
 *  </ul>
 *
 * <p>These constants are used to identify these ranges.</p>
 * @enum {string}
 * @memberof oj.ResponsiveUtils
 * @alias SCREEN_RANGE
 * @constant
 * @export
 */


ResponsiveUtils.SCREEN_RANGE = {
  /**
   * @expose
   * @constant
   */
  SM: 'sm',

  /**
   * @expose
   * @constant
   */
  MD: 'md',

  /**
   * @expose
   * @constant
   */
  LG: 'lg',

  /**
   * @expose
   * @constant
   */
  XL: 'xl',

  /**
   * @expose
   * @constant
   */
  XXL: 'xxl'
};
/**
 * <p>In the jet sass files there are variables for
 * responsive screen widths,
 * see {@link oj.ResponsiveUtils.SCREEN_RANGE} for details.
 * The jet sass files also has variables for
 * responsive queries like $responsiveQuerySmallUp,
 * $responsiveQuerySmallOnly, $responsiveQueryMediumUp, etc.</p>
 *
 * <p>These constants are used to identify these queries.</p>
 * @enum {string}
 * @memberof oj.ResponsiveUtils
 * @alias FRAMEWORK_QUERY_KEY
 * @constant
 * @export
 */

ResponsiveUtils.FRAMEWORK_QUERY_KEY = {
  /**
   * Matches screen width small and wider
   * @expose
   * @constant
   */
  SM_UP: 'sm-up',

  /**
   * matches screen width medium and wider
   * @expose
   * @constant
   */
  MD_UP: 'md-up',

  /**
   * matches screen width large and wider
   * @expose
   * @constant
   */
  LG_UP: 'lg-up',

  /**
   * matches screen width extra-large and wider
   * @expose
   * @constant
   */
  XL_UP: 'xl-up',

  /**
   * matches screen width extra-extra-large and wider
   * @expose
   * @constant
   */
  XXL_UP: 'xxl-up',

  /**
   * matches screen width small only
   * @expose
   * @constant
   */
  SM_ONLY: 'sm-only',

  /**
   * matches screen width medium only
   * @expose
   * @constant
   */
  MD_ONLY: 'md-only',

  /**
   * matches screen width large only
   * @expose
   * @constant
   */
  LG_ONLY: 'lg-only',

  /**
   * matches screen width extra-large only
   * @expose
   * @constant
   */
  XL_ONLY: 'xl-only',

  /**
   * matches screen width medium and narrower
   * @expose
   * @constant
   */
  MD_DOWN: 'md-down',

  /**
   * matches screen width large and narrower
   * @expose
   * @constant
   */
  LG_DOWN: 'lg-down',

  /**
   * matches screen width extra-large and narrower
   * @expose
   * @constant
   */
  XL_DOWN: 'xl-down',

  /**
   * matches high resolution screens
   * @expose
   * @constant
   */
  HIGH_RESOLUTION: 'high-resolution'
}; // used by the compare function

ResponsiveUtils._RANGE = {};
ResponsiveUtils._RANGE[ResponsiveUtils.SCREEN_RANGE.SM] = 0;
ResponsiveUtils._RANGE[ResponsiveUtils.SCREEN_RANGE.MD] = 1;
ResponsiveUtils._RANGE[ResponsiveUtils.SCREEN_RANGE.LG] = 2;
ResponsiveUtils._RANGE[ResponsiveUtils.SCREEN_RANGE.XL] = 3;
ResponsiveUtils._RANGE[ResponsiveUtils.SCREEN_RANGE.XXL] = 4;
/**
 * This idea/code is from zurb foundation, thanks zurb!
 *
 * In the jet sass files there are variables for
 * responsive screen sizes, these look something like

 *  <ul>
 *    <li>$screenSmallRange:  0, 767px;</li>
 *    <li>$screenMediumRange: 768px, 1023px;</li>
 *    <li>$screenLargeRange:  1024px, 1280px;</li>
 *    <li>$screenXlargeRange: 1281px, null;</li>
 *  </ul>
 *
 * <p>These variables in turn are used to generate responsive media queries in variables like
 * $responsiveQuerySmallUp, $responsiveQueryMediumUp, etc.</p>
 *
 * <p>we send down these media queries as the font family in classes
 * that look something like this:<p>
 *
 * <pre class="prettyprint">
 * <code>
 * .oj-mq-md {
 *    font-family: "/screen and (min-width: 768px)/";
 * }
 * </code></pre>
 *
 * <p>This function applies the class and then reads the font family off a dom
 * element to get the media query string</p>
 *
 * @param {string} selector a class selector name, for example 'oj-mq-md';
 * @return {string} the media query sent down for that class
 * @private
 */

ResponsiveUtils._getMediaQueryFromClass = function (selector) {
  var elem =
  /** @type {(Element | null)} */
  document.getElementsByClassName(selector).item(0);

  if (elem === null) {
    elem = document.createElement('meta');
    elem.className = selector;
    document.head.appendChild(elem); // @HTMLUpdateOK
  }

  var fontFamily = window.getComputedStyle(elem).getPropertyValue('font-family');
  return fontFamily.replace(/^[/\\'"]+|(;\s?})+|[/\\'"]+$/g, '');
};
/**
 * Get a framework (built in) media query string,
 * see {@link oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY} for details on framework queries.
 * The media query string returned can be passed to
 * {@link oj.ResponsiveKnockoutUtils.createMediaQueryObservable} to create a knockout
 * observable, which in turn can be used to drive responsive page behavior.
 *
 * <p>Example:</p>
 * <pre class="prettyprint">
 * <code>
 *
 *     var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(
 *                             oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);
 *
 *     self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);
 * </code></pre>
 *
 *
 * @method getFrameworkQuery
 * @memberof oj.ResponsiveUtils
 * @param {oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY} frameworkQueryKey one of the FRAMEWORK_QUERY_KEY constants,
 *                       for example oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP
 * @return {string | null} the media query to use for the framework query key passed in
 * @export
 * @static
 */


ResponsiveUtils.getFrameworkQuery = function (frameworkQueryKey) {
  var selector = 'oj-mq-' + frameworkQueryKey;

  var query = ResponsiveUtils._getMediaQueryFromClass(selector);

  if (query === 'null') {
    Logger.warn('Framework query not found. Please check that the value of the theming variable' + '$includeResponsiveMediaQueryClasses is set to true, if it' + 'is set to false the media queries are not sent down to the browser.');
    return null;
  }

  return query;
};
/**
 * <p> Compare can be used in conjunction with
 * {@link oj.ResponsiveKnockoutUtils.createScreenRangeObservable}</p>
 *
 *
 * <p>Example:</p>
 * <pre class="prettyprint">
 * <code>
 *        // create an observable which returns the current screen range
 *        self.screenRange = oj.ResponsiveKnockoutUtils.createScreenRangeObservable();
 *
 *        self.label2 = ko.computed(function() {
 *          var range = self.screenRange();
 *
 *          if ( oj.ResponsiveUtils.compare(
 *                       range, oj.ResponsiveUtils.SCREEN_RANGE.MD) <= 0)
 *          {
 *            // code for when screen is in small or medium range
 *          }
 *          else if (range == oj.ResponsiveUtils.SCREEN_RANGE.XL)
 *          {
 *            // code for when screen is in XL range
 *          }
 *        });
 * </code></pre>
 *
 * @method compare
 * @memberof oj.ResponsiveUtils
 * @param {oj.ResponsiveUtils.SCREEN_RANGE} size1 one of the screen size constants,
 * for example oj.ResponsiveUtils.SCREEN_RANGE.MD
 * @param {oj.ResponsiveUtils.SCREEN_RANGE} size2 one of the screen size constants,
 * for example oj.ResponsiveUtils.SCREEN_RANGE.LG
 * @return {number} a negative integer if the first
 * argument is less than the second. Zero if the two are equal.
 * 1 or greater if the first argument is more than the second.
 *
 * @export
 * @static
 */


ResponsiveUtils.compare = function (size1, size2) {
  var range1 = ResponsiveUtils._RANGE[size1];
  var range2 = ResponsiveUtils._RANGE[size2];

  if (range1 == null) {
    throw new Error('size1 param ' + size1 + ' illegal, please use one of the screen size constants like oj.ResponsiveUtils.SCREEN_RANGE.MD');
  }

  if (range2 == null) {
    throw new Error('size2 param ' + size2 + ' illegal, please use one of the screen size constants like oj.ResponsiveUtils.SCREEN_RANGE.MD');
  }

  return range1 - range2;
};

;return ResponsiveUtils;
});