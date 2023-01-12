/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['knockout', 'ojs/ojlogger'], function (ko, Logger) { 'use strict';

  /**
   * A Knockout adapter, to be used in conjunction with {@link CoreRouter}, to allow
   * components to two-way bind their values to the router's current state.
   * <p>
   * <h5>Creating the adapter in view model</h5>
   * Instantiate the adapter with the router in your view model, and assign it
   * as an instance variable.
   * <pre class="prettyprint">
   * <code>
   * var router = new CoreRouter([
   *   { path: 'home' }
   * ]);
   * this.koAdapter = new KnockoutRouterAdapter(router);
   * </code>
   * </pre>
   *
   * Use the "koAdapter" adapter instance in your view bindings with standard
   * binding syntax. Here, an &lt;oj-navigation-list>'s <code>selection</code>
   * property is two-way bound to the adapter's <code>path</code> observable.
   * When a navigation list item is selected, the binding notifies the adapter
   * of the selection change, and the adapter, in turn, instructs the router to
   * navigate to the path matching the selection.
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-navigation-list selection="{{koAdapter.path}}">
   * &lt;/oj-navigation-list>
   * </code>
   * </pre>
   * </p>
   *
   * <p>
   * <h5>Binding to router state fields</h5>
   * CoreRouterState exposes the {@link CoreRouterState#detail} and
   * {@link CoreRouterState#params} objects (if defined), and these can also be
   * used in view bindings to provide additional information. Here, a label is
   * set in the route's detail object.
   * <pre class="prettyprint">
   * <code>
   * var router = new CoreRouter([
   *   { path: 'home', detail: { label: 'Home Page' } }
   * ]);
   * this.koAdapter = new KnockoutRouterAdapter(router);
   * </code>
   * </pre>
   *
   * The additional "detail" object can be retrieved from the state
   * observable to display.
   * Notes:
   * <ul>
   *   <li>"state" is an observable an must be unwrapped before its
   *       sub-properties can be accessed.</li>
   *   <li>One-way binding should be used because the values under detail aren't
   *       observable (they're whatever was set during router configuration)</li>
   *   <li>Because the state may initially be undefined (before navigation has begun),
   *       we must guard against it with &lt;oj-bind-if>.</li>
   * </ul>
   * <pre class="prettyprint">
   * <code>
   * &lt;h2>
   *   &lt;oj-bind-if test="[[koAdapter.state]]">
   *     &lt;oj-bind-text value="[[koAdapter.state().detail.label]]">&lt;oj-bind-text>
   *   &lt;/oj-bind-if>
   * &lt;/h2>
   * </code>
   * </pre>
   * </p>
   *
   * @param {CoreRouter} router The CoreRouter instance on which this adapter will listen for state changes.
   * @class
   * @export
   * @ojtsmodule
   * @ojtsimport {module: "ojcorerouter", type: "AMD", importName: "CoreRouter"}
   * @ojtsimport knockout
   * @ojsignature [
   *    {target: "Type", value: "class KnockoutRouterAdapter<D extends {[key: string]: any} = {[key: string]: any}, P extends {[key: string]: any} = {[key: string]: any}>",
   *     genericParameters: [{"name": "D", "description": "Detail object for the router state"},
   *                         {"name": "P", "description": "Parameters object for the router state"},
   *     ]},
   *     {target:"Type", for: "router", value: "CoreRouter<D, P>"}
   *  ]
   */
  class KnockoutRouterAdapter {
    /**
     * Constructor
     */
    constructor(router) {
      var state = ko.observable();
      // Knockout observable to expose currentState as read-only observable
      this._observableState = ko.pureComputed({
        read: () => {
          return state();
        },
        write: () => {
          throw Error('"state" observable cannot be written to');
        }
      });

      // Writeable knockout computed to allow two-way binding of router path
      this._observablePath = ko.pureComputed({
        read: () => {
          return state() && state().path;
        },
        write: (path) => {
          router.go({ path: path || '' }).catch(function (msg) {
            Logger.info('KnockoutRouterAdapter router.go() failed with: ' + msg);
            // Force notification of subscribers that their value needs to be
            // reset. Note that this observable's 'equalityComparer' needs to be
            // nullified in order for this to work (below).
            state.valueHasMutated();
          });
        }
      });
      // Nullify equalityComparer so that if _observablePath's call to router.go()
      // is rejected, valueHasMutate() will be told that the value has changed and
      // notify this adapter's subscribers
      this._observablePath.equalityComparer = null;

      // Subscribe to router currentState
      this._stateSubscription = router.currentState.subscribe((args) => {
        state(args.state);
      });
    }

    /**
     * Cleans up this adapter by removing its subscription to the router state
     * changes. This should only be called if the CoreRouter and this adapter are
     * NOT expected to be garbage-collected together.
     * @name destroy
     * @memberof KnockoutRouterAdapter
     * @method
     * @instance
     * @export
     */
    destroy() {
      this._stateSubscription.unsubscribe();
    }

    /**
     * An observable containing the current {@link CoreRouterState} from the
     * router, if defined. Note that this CoreRouterState's <code class="prettyprint">path</code>
     * is the original string value from the class, and can only be used read-only.
     * In order to navigate the router from a component value using two-way binding,
     * use the observable {@link KnockoutRouterAdapter#path} instead.
     * This observable is read-only, and may not be written to.
     * @name state
     * @memberof KnockoutRouterAdapter
     * @instance
     * @readonly
     * @type {ko.Observable<CoreRouter.CoreRouterState>}
     * @ojsignature { target: 'Type', value: 'ko.Observable<CoreRouter.CoreRouterState<D, P>>'}
     */
    get state() {
      return this._observableState;
    }

    /**
     * An observable containing the current value of {@link CoreRouterState#path}.
     * This observable can be used in two-way bindings to read the value of the
     * current state, as well as navigate the router to a new path. When this
     * observable's value changes, the underlying {@link CoreRouter#go} method
     * is called with the new value as the path.
     * @name path
     * @memberof KnockoutRouterAdapter
     * @instance
     * @readonly
     * @type {ko.Observable<string>}
     */
    get path() {
      return this._observablePath;
    }
  }

  return KnockoutRouterAdapter;

});
