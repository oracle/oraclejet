/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { warn } from 'ojs/ojlogger';

/**
 * @namespace
 * @classdesc Utilities for working with the framework's responsive screen widths
 * and ranges. Often used in conjunction with {@link oj.ResponsiveKnockoutUtils}
 * to create knockout observables that can be used to drive responsive page behavior.
 * See the method doc below for specific examples.
 * @ojtsmodule
 * @since 1.1.0
 * @hideconstructor
 * @export
 */
const ResponsiveUtils = {};
oj._registerLegacyNamespaceProp('ResponsiveUtils', ResponsiveUtils);
/**
 * Enum type that defines the framework query key.
 * @typedef {Object} ResponsiveUtils.FrameworkQueryKey
 * @ojvalue {string} 'sm-up'
 * @ojvalue {string} 'md-up'
 * @ojvalue {string} 'lg-up'
 * @ojvalue {string} 'xl-up'
 * @ojvalue {string} 'xxl-up'
 * @ojvalue {string} 'sm-only'
 * @ojvalue {string} 'md-only'
 * @ojvalue {string} 'lg-only'
 * @ojvalue {string} 'xl-only'
 * @ojvalue {string} 'md-down'
 * @ojvalue {string} 'lg-down'
 * @ojvalue {string} 'xl-down'
 * @ojvalue {string} 'high-resolution'
 */

/**
 * Enum type that defines the screen range.
 * @typedef {Object} ResponsiveUtils.ScreenRange
 * @ojvalue {string} "sm"
 * @ojvalue {string} "md"
 * @ojvalue {string} "lg"
 * @ojvalue {string} "xl"
 * @ojvalue {string} "xxl"
 */

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
 * @memberof ResponsiveUtils
 * @alias SCREEN_RANGE
 * @type {Object}
 * @constant
 * @property {ResponsiveUtils.ScreenRange} SM
 * @property {ResponsiveUtils.ScreenRange} MD
 * @property {ResponsiveUtils.ScreenRange} LG
 * @property {ResponsiveUtils.ScreenRange} XL
 * @property {ResponsiveUtils.ScreenRange} XXL
 * @export
 */
ResponsiveUtils.SCREEN_RANGE = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl'
};

/**
 * <p>In the jet sass files there are variables for
 * responsive screen widths,
 * see {@link ResponsiveUtils.SCREEN_RANGE} for details.
 * The jet sass files also has variables for
 * responsive queries like $responsiveQuerySmallUp,
 * $responsiveQuerySmallOnly, $responsiveQueryMediumUp, etc.</p>
 *
 * <p>These constants are used to identify these queries.</p>
 * @memberof ResponsiveUtils
 * @alias FRAMEWORK_QUERY_KEY
 * @type {Object}
 * @constant
 * @property {ResponsiveUtils.FrameworkQueryKey} SM_UP Matches screen width small and wider
 * @property {ResponsiveUtils.FrameworkQueryKey} MD_UP Matches screen width medium and wider
 * @property {ResponsiveUtils.FrameworkQueryKey} LG_UP Matches screen width large and wider
 * @property {ResponsiveUtils.FrameworkQueryKey} XL_UP Matches screen width extra-large and wider
 * @property {ResponsiveUtils.FrameworkQueryKey} XXL_UP Matches screen width extra-extra-large and wider
 * @property {ResponsiveUtils.FrameworkQueryKey} SM_ONLY Matches screen width small only
 * @property {ResponsiveUtils.FrameworkQueryKey} MD_ONLY Matches screen width medium only
 * @property {ResponsiveUtils.FrameworkQueryKey} LG_ONLY Matches screen width smalargell only
 * @property {ResponsiveUtils.FrameworkQueryKey} XL_ONLY Matches screen width extra-large only
 * @property {ResponsiveUtils.FrameworkQueryKey} MD_DOWN Matches screen width medium and narrower
 * @property {ResponsiveUtils.FrameworkQueryKey} LG_DOWN Matches screen width large and narrower
 * @property {ResponsiveUtils.FrameworkQueryKey} XL_DOWN Matches screen width extra-large and narrower
 * @property {ResponsiveUtils.FrameworkQueryKey} HIGH_RESOLUTION matches high resolution screens
 * @export
 */
ResponsiveUtils.FRAMEWORK_QUERY_KEY = {
  SM_UP: 'sm-up',
  MD_UP: 'md-up',
  LG_UP: 'lg-up',
  XL_UP: 'xl-up',
  XXL_UP: 'xxl-up',
  SM_ONLY: 'sm-only',
  MD_ONLY: 'md-only',
  LG_ONLY: 'lg-only',
  XL_ONLY: 'xl-only',
  MD_DOWN: 'md-down',
  LG_DOWN: 'lg-down',
  XL_DOWN: 'xl-down',
  HIGH_RESOLUTION: 'high-resolution'
};

// used by the compare function
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
  var elem = /** @type {(Element | null)} */ (document.getElementsByClassName(selector).item(0));

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
 * see {@link ResponsiveUtils.FRAMEWORK_QUERY_KEY} for details on framework queries.
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
 * @memberof ResponsiveUtils
 * @param {ResponsiveUtils.FrameworkQueryKey} frameworkQueryKey one of the FRAMEWORK_QUERY_KEY constants,
 *                       for example oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP
 * @return {string | null} the media query to use for the framework query key passed in
 * @export
 * @static
 */
ResponsiveUtils.getFrameworkQuery = function (frameworkQueryKey) {
  var selector = 'oj-mq-' + frameworkQueryKey;
  var query = ResponsiveUtils._getMediaQueryFromClass(selector);

  if (query === 'null') {
    warn(
      'Framework query not found. Please check that the value of the theming variable' +
        '$includeResponsiveMediaQueryClasses is set to true, if it' +
        'is set to false the media queries are not sent down to the browser.'
    );
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
 * @memberof ResponsiveUtils
 * @param {ResponsiveUtils.ScreenRange} size1 one of the screen size constants,
 * for example oj.ResponsiveUtils.SCREEN_RANGE.MD
 * @param {ResponsiveUtils.ScreenRange} size2 one of the screen size constants,
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
    throw new Error(
      'size1 param ' +
        size1 +
        ' illegal, please use one of the screen size constants like oj.ResponsiveUtils.SCREEN_RANGE.MD'
    );
  }
  if (range2 == null) {
    throw new Error(
      'size2 param ' +
        size2 +
        ' illegal, please use one of the screen size constants like oj.ResponsiveUtils.SCREEN_RANGE.MD'
    );
  }

  return range1 - range2;
};

const compare = ResponsiveUtils.compare;
const getFrameworkQuery = ResponsiveUtils.getFrameworkQuery;
const SCREEN_RANGE = ResponsiveUtils.SCREEN_RANGE;
const FRAMEWORK_QUERY_KEY = ResponsiveUtils.FRAMEWORK_QUERY_KEY;

export { FRAMEWORK_QUERY_KEY, SCREEN_RANGE, compare, getFrameworkQuery };
