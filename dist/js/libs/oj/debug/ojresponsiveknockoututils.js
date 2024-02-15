/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojcustomelement-registry', 'knockout', 'jquery', 'ojs/ojresponsiveutils', 'ojs/ojcustomelement-utils'], function (exports, oj, ojcustomelementRegistry, ko, $, ResponsiveUtils, ojcustomelementUtils) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  const _createMediaQueryObservableInternal = function (queryString, componentElement) {
    if (queryString == null) {
      throw new Error(
        'ResponsiveKnockoutUtils.createMediaQueryObservable: aborting, queryString is null'
      );
    }

    var query = window.matchMedia(queryString);

    var observable = ko.observable(query.matches);

    const listener = function listener(_query) {
      observable(_query.matches);
    };

    let resumeCallback;
    let suspendCallback;
    if (componentElement) {
      resumeCallback = () => {
        query.addListener(listener);
      };
      suspendCallback = () => {
        query.removeListener(listener);
      };

      const state = ojcustomelementUtils.CustomElementUtils.getElementState(componentElement);
      state.addLifecycleCallbacks(resumeCallback, suspendCallback);
    }

    // add a listener for future changes
    query.addListener(listener);

    observable.dispose = function () {
      query.removeListener(listener);
      if (suspendCallback && resumeCallback) {
        const state = ojcustomelementUtils.CustomElementUtils.getElementState(componentElement);
        state.removeLifecycleCallbacks(resumeCallback, suspendCallback);
      }
    };

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

    if (
      navigator.userAgent.indexOf('WebKit') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1
    ) {
      $(window).resize(function () {
        // Somehow if I change some text in the dom on resize
        // the query listener is called
        var selector = 'oj-webkit-bug-123293';

        if ($('body').has('.' + selector).length === 0) {
          // setting display: none doesn't work, so using
          // oj-helper-hidden-accessible because this visually
          // hides the content without using display:none.
          // However we don't want screen readers to read
          // this so setting aria-hidden to true.
          // prettier-ignore
          $('body').append( // @HTMLUpdateOK
            '<div aria-hidden="true" class="oj-helper-hidden-accessible ' + selector + '">'
          );
        }

        $('.' + selector).text(new Date().getMilliseconds().toString());
      });
    }

    return observable;
  };

  const _createScreenRangeObservableInternal = function (componentElement) {
    // queryies
    var xxlQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.XXL_UP);

    var xlQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.XL_UP);

    var lgQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);

    var mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);

    var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_UP);

    // observables
    var xxlObservable =
      xxlQuery == null ? null : _createMediaQueryObservableInternal(xxlQuery, componentElement);

    var xlObservable =
      xlQuery == null ? null : _createMediaQueryObservableInternal(xlQuery, componentElement);

    var lgObservable =
      lgQuery == null ? null : _createMediaQueryObservableInternal(lgQuery, componentElement);

    var mdObservable =
      mdQuery == null ? null : _createMediaQueryObservableInternal(mdQuery, componentElement);

    var smObservable =
      smQuery == null ? null : _createMediaQueryObservableInternal(smQuery, componentElement);

    var screenRange = ko.pureComputed(function () {
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

    screenRange.subscribe(
      () => {
        if (smObservable) smObservable.dispose();
        if (mdObservable) mdObservable.dispose();
        if (lgObservable) lgObservable.dispose();
        if (xlObservable) xlObservable.dispose();
        if (xxlObservable) xxlObservable.dispose();
      },
      null,
      'asleep'
    );

    return screenRange;
  };

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
   * @ojtsimport {module: "ojresponsiveutils", type:"AMD", importName: "ResponsiveUtils"}
   *
   */

  const ResponsiveKnockoutUtils = {};
  oj._registerLegacyNamespaceProp('ResponsiveKnockoutUtils', ResponsiveKnockoutUtils);
  /**
   * <p>Creates an observable that
   * returns true or false based on a media query string.
   * Can be used in conjunction with {@link ResponsiveUtils.getFrameworkQuery}
   * to create an observable based on a framework media query.</p>
   *
   * <p>In order to avoid leaking memory, any explicit subscribe() calls on this observable
   * should be paired with corresponding dispose() calls when the observable is no longer needed.
   * The observable returned by this method should not be used (directly or indirectly) in an expression
   * within the view of a custom composite element. See {@link oj.ResponsiveKnockoutUtils.createCompositeMediaQueryObservable} instead.</p>
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
    return _createMediaQueryObservableInternal(queryString);
  };

  /**
   * <p>
   * This method creates an observable that returns true or false based on a media query string.
   * It is specifically designed to be used within composite elements.
   * The componentElement argument is used to clean up media query listeners when the composite element
   * is disconnected from DOM.
   * Can be used in conjunction with {@link ResponsiveUtils.getFrameworkQuery}
   * to create an observable based on a framework media query.
   * </p>
   *
   * <p>
   * This method can be safely used within composite elements to create an observable that can be used within view expressions
   * or explicitly subscribed to within the view model. Do not call dispose() on the observable.
   * The internal media query listeners will automatically be cleaned up when the element is disconnected from the DOM,
   * and garbage collection will take care of the rest.
   * </p>
   *
   * <p>Example:</p>
   * <pre class="prettyprint">
   * <code>
   *    var customQuery = oj.ResponsiveKnockoutUtils.createCompositeMediaQueryObservable(
   *                                         '(min-width: 400px)', modelContext.element);
   *
   *    var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(
   *                             oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);
   *
   *    self.large = oj.ResponsiveKnockoutUtils.createCompositeMediaQueryObservable(lgQuery, modelContext.element);
   * </code></pre>
   * @param {string} queryString media query string, for example '(min-width: 400px)'
   * @param { Element } componentElement composite element that calls the utility in its view or view model
   * @returns a knockout observable  that
   *              returns true or false based on a media query string.
   * @ojsignature {target: "Type", for: "returns", value: "ko.Observable<boolean>"}
   * @export
   * @static
   * @method createCompositeMediaQueryObservable
   * @memberof oj.ResponsiveKnockoutUtils
   */
  ResponsiveKnockoutUtils.createCompositeMediaQueryObservable = function (
    queryString,
    componentElement
  ) {
    const name = componentElement?.nodeName;
    if (!(componentElement && ojcustomelementRegistry.isComposite(name))) {
      throw new Error(
        `Incorrect usage of createCompositeMediaQueryObservable for ${name} - the method should be used on the composite components and componentElement should be given as a method argument.`
      );
    }
    return _createMediaQueryObservableInternal(queryString, componentElement);
  };

  /**
   * <p>
   * This method creates a computed observable, the
   * value of which is one of the {@link ResponsiveUtils.SCREEN_RANGE} constants.
   * For example when the width is in the
   * range defined by the sass variable $mediumScreenRange then
   * the observable returns <code>oj.ResponsiveUtils.SCREEN_RANGE.MD</code>,
   * but if it's in the range defined by $largeScreenRange then
   * it returns <code>oj.ResponsiveUtils.SCREEN_RANGE.LG</code>, etc.
   * </p>
   * <p>
   * In order to avoid leaking memory, any explicit subscribe() calls on this observable should be paired
   * with corresponding dispose() calls when the observable is no longer needed. The observable
   * returned by this method should not be used (directly or indirectly) in
   * an expression within the view of a custom composite element. See {@link oj.ResponsiveKnockoutUtils.createCompositeScreenRangeObservable} instead.
   * </p>
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
   * @return A knockout observable the value of which is one of the
   *  screen range constants, for example oj.ResponsiveUtils.SCREEN_RANGE.MD.
   * @ojsignature {target: "Type", for: "returns", value: "ko.Observable<ResponsiveUtils.ScreenRange>"}
   * @export
   * @static
   * @memberof oj.ResponsiveKnockoutUtils
   * @method createScreenRangeObservable
   */
  ResponsiveKnockoutUtils.createScreenRangeObservable = function () {
    return _createScreenRangeObservableInternal();
  };

  /**
   * <p>
   * The method creates a computed observable, the value of which is one of the {@link ResponsiveUtils.SCREEN_RANGE} constants.
   * For example when the width is in the range defined by the sass variable $mediumScreenRange then
   * the observable returns <code>oj.ResponsiveUtils.SCREEN_RANGE.MD</code>,
   * but if it's in the range defined by $largeScreenRange then
   * it returns <code>oj.ResponsiveUtils.SCREEN_RANGE.LG</code>, etc.
   * This method is designed to be used within composite element view expressions.
   * The componentElement argument is used to clean up media query listeners when the composite element
   * is disconnected from DOM.
   * </p>
   *
   * <p>
   * This method can be safely used within composite elements to create an observable that can be used within view expressions
   * or explicitly subscribed to within the view model. Do not call dispose() on the observable.
   * The internal media query listeners will automatically be cleaned up when the element is disconnected from the DOM,
   * and garbage collection will take care of the rest.
   * </p>
   *
   * <p>Example:</p>
   * <pre class="prettyprint">
   * <code>
   *        // create an observable which returns the current screen range
   *        self.screenRange = oj.ResponsiveKnockoutUtils.createCompositeScreenRangeObservable();
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
   * @param { Element } componentElement composite element that calls the utility in its view or view model
   * @returns A knockout observable the value of which is one of the
   *  screen range constants, for example oj.ResponsiveUtils.SCREEN_RANGE.MD.
   * @ojsignature {target: "Type", for: "returns", value: "ko.Observable<ResponsiveUtils.ScreenRange>"}
   * @export
   * @static
   * @memberof oj.ResponsiveKnockoutUtils
   * @method createCompositeScreenRangeObservable
   */
  ResponsiveKnockoutUtils.createCompositeScreenRangeObservable = function (componentElement) {
    const name = componentElement?.nodeName;
    if (!(componentElement && ojcustomelementRegistry.isComposite(name))) {
      throw new Error(
        `Incorrect usage of createCompositeScreenRangeObservable for ${name} - the method should be used on the composite components and componentElement should be given as a method argument.`
      );
    }
    return _createScreenRangeObservableInternal(componentElement);
  };

  const { createScreenRangeObservable, createMediaQueryObservable, createCompositeScreenRangeObservable, createCompositeMediaQueryObservable } = ResponsiveKnockoutUtils;

  exports.createCompositeMediaQueryObservable = createCompositeMediaQueryObservable;
  exports.createCompositeScreenRangeObservable = createCompositeScreenRangeObservable;
  exports.createMediaQueryObservable = createMediaQueryObservable;
  exports.createScreenRangeObservable = createScreenRangeObservable;

  Object.defineProperty(exports, '__esModule', { value: true });

});
