/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojresponsiveutils', 'knockout'], function(oj, $, ResponsiveUtils, ko)
{
  "use strict";

/* global ko:false, ResponsiveUtils:false */
/* jslint browser: true*/

/**
 * @namespace oj.ResponsiveKnockoutUtils
 * @classdesc Utilities for creating knockout observables to implement responsive pages.
 * For example you could use oj.ResponsiveKnockoutUtils.createMediaQueryObservable to
 * create an observable based on the screen width and then bind the tab bar's
 * orientation attribute to it. See the method doc below for specific examples.
 * @since 1.1.0
 * @export
 * @hideconstructor
 * @ojtsmodule
 * @ojtsimport knockout
 *
 */
var ResponsiveKnockoutUtils = {};

/**
 * <p>creates an observable that
 * returns true or false based on a media query string.
 * Can be used in conjuntion with {@link oj.ResponsiveUtils.getFrameworkQuery}
 * to create an observable based on a framework media query.</p>
 *
 * <p>Example:</p>
 * <pre class="prettyprint">
 * <code>
 *    var customQuery = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
 *                                         '(min-width: 400px)');
 *
 *    var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(
 *                             oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);
 *
 *    self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);
 * </code></pre>
 *
 * @param {string} queryString media query string, for example '(min-width: 400px)'
 * @return a knockout observable  that
 *              returns true or false based on a media query string.
 * @ojsignature {target: "Type", for: "returns", value: "ko.Observable<boolean>"}
 * @export
 * @static
 * @method createMediaQueryObservable
 * @memberof oj.ResponsiveKnockoutUtils
 */
ResponsiveKnockoutUtils.createMediaQueryObservable = function (queryString) {
  if (queryString == null) {
    throw new Error('ResponsiveKnockoutUtils.createMediaQueryObservable: aborting, queryString is null');
  }

  var query = window.matchMedia(queryString);

  var observable = ko.observable(query.matches);

  // add a listener for future changes
  query.addListener(function (_query) {
    observable(_query.matches);
    // console.log("query listener called! query.matches = " + query.matches + ", size = " + (document.outerWidth || document.body.clientWidth));
  });


  // There is a major bug in webkit, tested on ios 7 going from
  // landscape to portrait.
  //    https://bugs.webkit.org/show_bug.cgi?id=123293
  //
  // Basically if you use a media query in css
  // then the js matchmedia call won't work!
  //
  // According to the bug this is known to be on webkit 538.4,
  // but I see it on 537.51 as well which is earlier, so
  // assume the problem exists generally on safari.
  // Chrome now uses blink instead of webkit, but chrome
  // still has webkit in their user agent string, however they
  // now only change the number after "Chrome".

  if (navigator.userAgent.indexOf('WebKit') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1) {
    $(window).resize(function () {
      // console.log("Resize called! Size = " + (document.outerWidth || document.body.clientWidth));

      // Somehow if I change some text in the dom on resize
      // the query listener is called
      var selector = 'oj-webkit-bug-123293';

      if ($('body').has('.' + selector).length === 0) {
        // setting display: none doesn't work, so using
        // oj-helper-hidden-accessible because this visually
        // hides the content without using display:none.
        // However we don't want screen readers to read
        // this so setting aria-hidden to true.
        $('body').append('<div aria-hidden="true" class="oj-helper-hidden-accessible ' +
                         selector + '">'); // @HTMLUpdateOK
      }

      $('.' + selector).text((new Date().getMilliseconds()).toString()); // @HTMLUpdateOK
    });
  }

  return observable;
};


/**
 * This function creates a computed observable, the
 * value of which is one of the {@link oj.ResponsiveUtils.SCREEN_RANGE} constants.
 * For example when the width is in the
 * range defined by the sass variable $mediumScreenRange then
 * the observable returns <code>oj.ResponsiveUtils.SCREEN_RANGE.MD</code>,
 * but if it's in the range defined by $largeScreenRange then
 * it returns <code>oj.ResponsiveUtils.SCREEN_RANGE.LG</code>, etc.
 *
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
 * @return a knockout observable the value of which is one of the
 *  screen range constants, for example oj.ResponsiveUtils.SCREEN_RANGE.MD
 * @ojsignature {target: "Type", for: "returns", value: "ko.Observable<string>"}
 * @export
 * @static
 * @memberof oj.ResponsiveKnockoutUtils
 * @method createScreenRangeObservable
 */
ResponsiveKnockoutUtils.createScreenRangeObservable = function () {
  // queryies
  var xxlQuery = ResponsiveUtils.getFrameworkQuery(
                                ResponsiveUtils.FRAMEWORK_QUERY_KEY.XXL_UP);

  var xlQuery = ResponsiveUtils.getFrameworkQuery(
                                ResponsiveUtils.FRAMEWORK_QUERY_KEY.XL_UP);

  var lgQuery = ResponsiveUtils.getFrameworkQuery(
                                ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);

  var mdQuery = ResponsiveUtils.getFrameworkQuery(
                                ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);

  var smQuery = ResponsiveUtils.getFrameworkQuery(
                                ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_UP);


  // observables
  var xxlObservable = xxlQuery == null ?
                      null :
                      ResponsiveKnockoutUtils.createMediaQueryObservable(xxlQuery);

  var xlObservable = xlQuery == null ?
                     null :
                     ResponsiveKnockoutUtils.createMediaQueryObservable(xlQuery);

  var lgObservable = lgQuery == null ?
                     null :
                     ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);

  var mdObservable = mdQuery == null ?
                     null :
                     ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

  var smObservable = smQuery == null ?
                     null :
                     ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);


  return ko.computed(function () {
    if (xxlObservable && xxlObservable()) {
      return ResponsiveUtils.SCREEN_RANGE.XXL;
    }

    if (xlObservable && xlObservable()) {
      return ResponsiveUtils.SCREEN_RANGE.XL;
    }

    if (lgObservable && lgObservable()) {
      return ResponsiveUtils.SCREEN_RANGE.LG;
    }

    if (mdObservable && mdObservable()) {
      return ResponsiveUtils.SCREEN_RANGE.MD;
    }

    if (smObservable && smObservable()) {
      return ResponsiveUtils.SCREEN_RANGE.SM;
    }

    throw new Error(' NO MATCH in ResponsiveKnockoutUtils.createScreenRangeObservable');
  });
};

  ;return ResponsiveKnockoutUtils;
});