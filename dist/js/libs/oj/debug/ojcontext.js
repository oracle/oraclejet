/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore-base', 'ojs/ojlogger' ], function(oj, Logger)
{
  "use strict";

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* global Promise:false, Map:false, Logger:false */

/**
 * <p>The purpose of the BusyContext API is to accommodate sequential dependencies of asynchronous
 * operations. A common use cases defining the API is for automation testing (qunit and webdriver).
 * Automation test developers can use this API to wait until components finish animation effects
 * or data fetch before trying to interact with components. The BusyContext is not limited to
 * test automation developers usages. It is also needed by page developers for waiting on run-time
 * operation readiness.</p>
 *
 * The Busy Context API will wait until busy states have resolved or a timeout period has elapsed.
 * There are several primary wait scenarios:
 * <ol>
 *   <li>Component creation and page bindings applied.</li>
 *   <li>Components that implement animation effects.</li>
 *   <li>Components that must fetch data from a REST endpoint.</li>
 *   <li>General wait conditions that are not specific to the Jet framework. The customer might
 *       choose to register some busy condition associated with application domain logic such
 *       as REST endpoints.</li>
 *   <li>Wait until the bootstrap of the page has completed - jet libraries loaded via requireJS.</li>
 * </ol>
 *
 * <p>The first step for waiting on a busy context is to determine what conditions are of interest
 *   to wait on. The granularity of a busy context can be scoped for the entirety of the page or
 *   for a specific DOM element. Busy contexts have hierarchical dependencies mirroring the
 *   document's DOM structure with the root being the page context. Depending on the particular
 *   scenario, developers might need to target one of the following busy context scopes:</p>
 * <ul>
 *   <li>Scoped for the Page - Automation test developers will more commonly choose the page busy
 *     context. This context represents the page as a whole. Automation developers commonly need
 *     to wait until the page is fully loaded before starting automation. More commonly, automation
 *     developers are interesting in testing the functionality of an application having multiple
 *     JET components versus just a single component.
 *
 *     <pre class="prettyprint">
 *     <code>
 *     var busyContext = oj.Context.getPageContext().getBusyContext();
 *     </code></pre>
 *
 *   </li>
 *   <li>Scoped for the nearest DOM Element - Application developers sometime need a mechanism to
 *     wait until a specific component operation has complete. For example, it might be desirable
 *     to wait until a component has been created and bindings applied before setting a property or
 *     calling a method on the component. Another scenario, waiting for a popup to finish
 *     open or close animation before initiating the next action in their application flow.
 *     For this problem space developers would need to obtain a busy context scoped for a DOM node.
 *     The "data-oj-context" marker attribute is used to define a busy context for a dom subtree.
 *
 *     <pre class="prettyprint">
 *     <code>
 *     <!-- subtree assigned a marker 'data-oj-context' attribute -->
 *     &lt;div id="mycontext" data-oj-context&gt;
 *        ...
 *        &lt;!-- JET content --&gt;
 *        ...
 *     &lt;/div&gt;
 *
 *     var node = document.querySelector("#mycontext");
 *     var busyContext = oj.Context.getContext(node).getBusyContext();
 *     busyContext.whenReady().then(function ()
 *     {
 *       var component = document.querySelector("#myInput");
 *       component.value = "foo";
 *       component.validate().then(function (isValid)
 *       {
 *         if (!isValid)
 *           component.value = "foobar";
 *       });
 *     });
 *     </code></pre>
 *
 *   </li>
 * </ul>
 *
 * The BusyContext API utilizes {@link Logger.LEVEL_LOG} to log detail busy state activity.
 * <pre class="prettyprint">
 * <code>
 *  Logger.option("level", Logger.LEVEL_LOG);
 * </code></pre>
 *
 * <b>This constructor should never be invoked by the application code directly.</b>
 * @hideconstructor
 * @param {Element=} hostNode DOM element associated with this busy context
 * @export
 * @constructor oj.BusyContext
 * @ojtsmodule
 * @ojtsnoexport
 * @ojtsexportastype Context
 * @since 2.1.0
 * @classdesc Framework service for querying the busy state of components on the page.
 */
oj.BusyContext = function (hostNode) {
  this.Init(hostNode);
};

oj.Object.createSubclass(oj.BusyContext, oj.Object, 'oj.BusyContext');


/**
 * see oj.BusyContext#setDefaultTimeout
 * @type {number}
 * @ignore
 * @private
 */
oj.BusyContext._defaultTimeout = Number.NaN;

/**
 * Sets a default for the optional <code>timeout</code> argument of the {@link oj.BusyContext#whenReady}
 * for all BusyContext instances. The default value will be implicitly used if a timeout argument is not
 * provided.
 *
 * @export
 * @see oj.BusyContext#whenReady
 * @since 3.1.0
 * @memberof oj.BusyContext
 * @method setDefaultTimeout
 * @param {number} timeout in milliseconds
 * @ojdeprecated {since: '6.0.0', description: 'Use oj.Context.setBusyContextDefaultTimeout instead.'}
 * @return {undefined}
 */
oj.BusyContext.setDefaultTimeout = function (timeout) {
  if (!isNaN(timeout)) {
    oj.BusyContext._defaultTimeout = timeout;
  }
};

/**
 * @param {Element=} hostNode DOM element associated with this busy context
 * @instance
 * @protected
 */
oj.BusyContext.prototype.Init = function (hostNode) {
  oj.BusyContext.superclass.Init.call(this);

  this._hostNode = hostNode;

  /**
   * Busy states cache.
   *
   * @type {?}
   * @ignore
   * @private
   */
  this._statesMap = new Map();

  /**
   * Coordinates resolution of the master when ready promise with one or more slave
   * when ready promises having a timeout period.
   *
   * @type {Object}
   * @ignore
   * @private
   */
  this._mediator = {
    /**
     * Returns a master primise that will resolve when all busy states have been resolved.
     *
     * @returns {Promise}
     * @ignore
     * @private
     */
    getMasterWhenReadyPromise: function () {
      if (!this._masterWhenReadyPromise) {
        this._masterWhenReadyPromise =
          new Promise(this._captureWhenReadyPromiseResolver.bind(this));
      }
      return this._masterWhenReadyPromise;
    },
    /**
     * Triggers resolution of the master promise and clears all timeouts associated with slave
     * when ready promises.
     *
     * @returns {void}
     * @ignore
     * @private
     */
    resolveMasterWhenReadyPromise: function () {
      if (this._masterWhenReadyPromiseResolver) {
        this._masterWhenReadyPromiseResolver(true);
      }
      this._masterWhenReadyPromise = null;
      this._masterWhenReadyPromiseResolver = null;
      this._masterWhenReadyPromiseRejecter = null;
    },
    /**
     * Triggers rejections of the master promise.
     * @param {Object=} error
     * @returns {void}
     * @ignore
     * @private
     */
    rejectMasterWhenReadyPromise: function (error) {
      if (this._masterWhenReadyPromiseRejecter) {
        this._masterWhenReadyPromiseRejecter(error);
      }
      this._masterWhenReadyPromise = null;
      this._masterWhenReadyPromiseRejecter = null;
      this._masterWhenReadyPromiseResolver = null;
    },
    /**
     * Returns a promise that will resolve when the master promise resolves or reject when
     * the slave timeout promise rejects.
     *
     * @param {Promise} master
     * @param {Function} generateErrorCallback
     * @param {number} timeout
     * @returns {Promise}
     * @ignore
     * @private
     */
    getSlaveTimeoutPromise: function (master, generateErrorCallback, timeout) {
      var timer;
      var slaveTimeoutPromise = new Promise(function (resolve, reject) {
        timer = window.setTimeout(function () {
          reject(generateErrorCallback());
        }, timeout);
      });
      this._slaveTimeoutPromiseTimers.push(timer);

      // When the master promise is resolved, all timers may be cleared
      return Promise.race([master, slaveTimeoutPromise])
                                  .then(this._clearAllSlaveTimeouts.bind(this));
    },

    /**
     * @private
     * @ignore
     * @return {Promise} resolves on the next-tick using setImmediate.
     */
    getNextTickPromise: function () {
      if (!this._nextTickPromise) {
        this._nextTickPromise = new Promise(function (resolve) {
          window.setImmediate(function () {
            this._nextTickPromise = null;
            resolve(true);
          }.bind(this));
        }.bind(this));
      }

      return this._nextTickPromise;
    },

    /**
     * Clears all window timeout timeers that are slave when ready promises.
     *
     * @returns {boolean}
     * @ignore
     * @private
     */
    _clearAllSlaveTimeouts: function () {
      var slaveTimeoutPromiseTimers = this._slaveTimeoutPromiseTimers;
      this._slaveTimeoutPromiseTimers = [];
      for (var i = 0; i < slaveTimeoutPromiseTimers.length; i++) {
        window.clearTimeout(slaveTimeoutPromiseTimers[i]);
      }

      return true;
    },
    /**
     * Promise executor function passed as the single master promise constructor.  Captures the
     * promise resolve callback function.  The resolve promise function will be called when all the
     * busy states have been removed.
     *
     * @param {Function} resolve
     * @param {Function} reject
     * @returns {void}
     * @ignore
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _captureWhenReadyPromiseResolver: function (resolve, reject) {
      this._masterWhenReadyPromiseResolver = resolve;
      this._masterWhenReadyPromiseRejecter = reject;
    },
    /**
     * Array of setTimeout timers that should be cancled when the busy state resolves.
     *
     * @type {Array.<number>}
     * @ignore
     * @private
     */
    _slaveTimeoutPromiseTimers: []
    /**
     * The master when ready promise that will resovle when all busy states resolve.
     *
     * @type {Promise|undefined}
     * @ignore
     * @private
     */
    // _masterWhenReadyPromise : undefined,
    /**
     * The resolve function of the masterWhenReadyPromise.
     *
     * @type {Function|undefined}
     * @ignore
     * @private
     */
    // _masterWhenReadyPromiseResolver : undefined,
        /**
     * The reject function of the masterWhenReadyPromise.
     *
     * @type {Function|undefined}
     * @ignore
     * @private
     */
    // _masterWhenReadyPromiseRejecter : undefined,
    /**
     * Promise evaluated next-tick.
     *
     * @type {Promise|undefined}
     * @ignore
     * @private
     */
    // _nextTickPromise : undefined
  };
};

/**
 * Logs the current registered busy states ordered acceding by the order they were added.
 * The cost of compiling the list is only made if the logger level is Logger.LEVEL_LOG.
 * @param {?} statesMap busy states
 * @returns {void}
 * @private
 */
oj.BusyContext._log = function (statesMap) {
  if (Logger.option('level') !== Logger.LEVEL_LOG) {
    return;
  }

  Logger.log('>> Busy states: %d', statesMap.size);

  var busyStates = oj.BusyContext._values(statesMap);
  if (busyStates.length > 0) {
    Logger.log(busyStates.join('\n'));
  }
};

/**
 * @param {?} statesMap busy states
 * @return {Array.<oj.BusyState>} Returns an array of busy states entries from the states map
 * @private
 */
oj.BusyContext._values = function (statesMap) {
  var busyStates = [];
  statesMap.forEach(function (value) {
    busyStates.push(value);
  });

  return busyStates;
};

/**
 * <p>Called by components or services performing a task that should be considered
 * in the overall busy state of the page. An example would be animation or fetching data.</p>
 *
 * Caveats:
 * <ul>
 *   <li>Busy context dependency relationships are determined at the point the first busy state
 *       is added.  If the DOM node is re-parented after a busy context was added, the context will
 *       maintain dependencies with any parent DOM contexts.</li>
 *   <li>The application logic creating busy states is responsible for ensuring these busy states
 *       are resolved. Busy states added internally by JET are automatically accounted for.
 *       The busy states added by the application logic must manage a reference to the resolve
 *       function associated with a busy state and it must be called to release the busy state.</li>
 * </ul>
 *
 * <pre class="prettyprint">
 * <code>// apply the marker attribute to the element
 * &lt;div id="context1" data-oj-context ... &gt;&lt;/&gt;
 * ...
 * ...
 * var context1 = document.querySelector("#context1");
 *
 * // obtain a busy context scoped for the target node
 * var busyContext1 = oj.Context.getContext(context1).getBusyContext();
 * // add a busy state to the target context
 * var options = {"description": "#context1 fetching data"};
 * var resolve = busyContext1.addBusyState(options);
 * ...
 * ...  // perform asynchronous operation that needs guarded by a busy state
 * ...
 * // resolve the busy state after the operation completes
 * resolve();
 * </code></pre>
 *
 * @since 2.1.0
 * @export
 * @memberof oj.BusyContext
 * @instance
 * @method addBusyState
 * @param {Object} options object that describes the busy state being registered.<br/>
 * @param {Object|function():string} options.description
 *         description: Option additional information of what is registering a busy state. Added to
 *                      logging and handling rejected status. Can be supplied as a Object or a
 *                      function.  If the type is an object the toString function needs to be
 *                      implemented.
 * @ojsignature [{target: "Type",
 *                value: "{
 *                         toString: ()=>string;
 *                         [propName: string]: any;
 *                       } | (() => string) | string",
 *                for: "options.description"}]
 * @returns {function():void} resolve function called by the registrant when the busy state completes.
 *                     The resultant function will throw an error if the busy state is no longer
 *                     registered.
 */
oj.BusyContext.prototype.addBusyState = function (options) {
  Logger.log("BusyContext.addBusyState: start scope='%s'", this._getDebugScope());

  var statesMap = this._statesMap;

  /** @type {oj.BusyState} */
  var busyState = new oj.BusyState(options[oj.BusyContext._DESCRIPTION]);

  Logger.log('>> ' + busyState);

  statesMap.set(busyState.id, busyState);

  this._addBusyStateToParent();

  Logger.log("BusyContext.addBusyState: end scope='%s'", this._getDebugScope());

  return this._removeBusyState.bind(this, busyState);
};

/**
 * Logs all active busy states to the {@link oj.Logger} at {Logger.LEVEL_INFO}.
 * <pre class="prettyprint">
 * <code>
 *  Logger.option("level", Logger.LEVEL_INFO);
 *  oj.Context.getPageContext().getBusyContext().dump("before popup open");
 * </code></pre>
 *
 * @export
 * @since 3.1.0
 * @memberof oj.BusyContext
 * @instance
 * @method dump
 * @param {string=} message optional text used to further denote a debugging point
 * @return {undefined}
 */
oj.BusyContext.prototype.dump = function (message) {
  Logger.info("BusyContext.dump: start scope='%s' %s", this._getDebugScope(),
                 message || '');

  var statesMap = this._statesMap;
  Logger.info('>> Busy states: %d', statesMap.size);

  var busyStates = oj.BusyContext._values(statesMap);
  if (busyStates.length > 0) {
    Logger.info(busyStates.join('\n'));
  }

  Logger.info("BusyContext.dump: start scope='%s' %s", this._getDebugScope(),
                 message || '');
};

/**
 * Returns an array of states representing the active busy states managed by the instance.
 *
 * @export
 * @since 3.1.0
 * @method getBusyStates
 * @memberof oj.BusyContext
 * @instance
 * @return {Array.<{id:string, description:string}>} active busy states managed by the context
 *         instance
 */
oj.BusyContext.prototype.getBusyStates = function () {
  var statesMap = this._statesMap;

   /** @type {?} */
  var busyStates = oj.BusyContext._values(statesMap);
  return busyStates;
};

/**
 * Forces all busy states per context instance to release.
 * Use with discretion - last course of action.
 *
 * @since 3.1.0
 * @method clear
 * @memberof oj.BusyContext
 * @instance
 * @export
 * @return {undefined}
 */
oj.BusyContext.prototype.clear = function () {
  Logger.log("BusyContext.clear: start scope='%s'", this._getDebugScope());

  var statesMap = this._statesMap;
  var busyStates = oj.BusyContext._values(statesMap);
  for (var i = 0; i < busyStates.length; i++) {
    /** @type {?} **/
    var busyState = busyStates[i];
    try {
      this._removeBusyState(busyState);
    } catch (e) {
      Logger.log('BusyContext.clear: %o', e);
    }

    Object.defineProperty(busyState, oj.BusyContext._OJ_RIP, { value: true, enumerable: false });
  }

  Logger.log("BusyContext.clear: end scope='%s'", this._getDebugScope());
};

/**
 * <p>Returns a Promise that will resolve when all registered busy states have completed or a maximum
 * timeout period has elapsed. The promise will be rejected if all the busy states are not resolved
 * within the timeout period. The busyness of the whenReady promsie is evaluated in the next-tick
 * of resolving a busy state.</p>
 *
 * "next-tick" is at the macrotask level. "whenReady" is waiting for the microtask queue to be exhausted,
 * yielding control flow to the user agent, before resolving busyness.
 *
 * @see oj.BusyContext#applicationBootstrapComplete
 * @since 2.1.0
 * @export
 * @memberof oj.BusyContext
 * @instance
 * @method whenReady
 * @param {number=} timeout "optional" maximum period in milliseconds the resultant promise
 *        will wait. Also see {@link oj.BusyContext.setDefaultTimeout}.
 * @returns {Promise.<boolean|Error>}
 */
oj.BusyContext.prototype.whenReady = function (timeout) {
  var debugScope = this._getDebugScope();

  Logger.log("BusyContext.whenReady: start, scope='%s', timeout=%d", debugScope, timeout);
  /** @type {?} */
  var statesMap = this._statesMap;

  var mediator = this._mediator;
  var nextTickPromise = mediator.getNextTickPromise();
  var bootstrapPromise = oj.BusyContext._BOOTSTRAP_MEDIATOR.whenReady();
  var promise = Promise.all([nextTickPromise, bootstrapPromise]).then(
    function () {
      Logger.log('BusyContext.whenReady: bootstrap mediator ready scope=%s', debugScope);

      try {
        // Since we are executing this code on 'next tick', it is safe to flush any JET throttled updates.
        // Doing so will allow us to take into account any busy states added in response to the pending updates
        oj.BusyContext._deliverThrottledUpdates();
      } catch (e) {
        Logger.error('Fatal exception delivering binding updates: %o', e);
        throw e;
      }

      if (statesMap.size === 0 && !this._waitingOnNextTickBusynessEval) {
        // no busy states, promise resolves immediately
        Logger.log('BusyContext.whenReady: resolved no busy states scope=%s', debugScope);
        return true;
      }

      Logger.log('BusyContext.whenReady: busy states returning master scope=%s', debugScope);
      return mediator.getMasterWhenReadyPromise();
    }.bind(this)
  );

  // if a timeout argument is not provided, check the default timeout
  if (isNaN(timeout) && !isNaN(oj.BusyContext._defaultTimeout)) {
    // eslint-disable-next-line no-param-reassign
    timeout = oj.BusyContext._defaultTimeout;
  }


  if (!isNaN(timeout)) {
    var handleTimeout = function () {
      var error;
      var expiredText = 'whenReady timeout of ' + timeout + 'ms expired ';

      oj.BusyContext._log(statesMap);
      var busyStates = oj.BusyContext._values(statesMap);

      if (!oj.BusyContext._BOOTSTRAP_MEDIATOR.isReady()) {
        error = new Error(expiredText + 'while the application is loading.' +
          ' Busy state enabled by setting the "window.oj_whenReady = true;" global variable.' +
          ' Application bootstrap busy state is released by calling' +
          ' "oj.Context.getPageContext().getBusyContext().applicationBootstrapComplete();".');
      } else {
        error = new Error(expiredText + 'with the following busy states: ' +
                            busyStates.join(', '));
      }

      error.busyStates = busyStates;

      Logger.log("BusyContext.whenReady: rejected scope='%s'\n%s", debugScope, error.message);
      return error;
    };
    promise = mediator.getSlaveTimeoutPromise(promise, handleTimeout, timeout);
  }


  Logger.log("BusyContext.whenReady: end scope='%s'", this._getDebugScope());
  return promise;
};

/**
 * <p>Describes the busyness of the context. The busyness is evaluated in the "next-tick" of a busy
 * state being resolved, meaning the number of busy states doesn't necessarily equate to readiness.
 * The readiness is in sync with the {@link oj.BusyContext#whenReady} resultant promise resolution.</p>
 *
 * @see oj.BusyContext#getBusyStates
 * @since 2.1.0
 * @export
 * @memberof oj.BusyContext
 * @instance
 * @method isReady
 * @returns {boolean} <code>true</code> if the context is not busy
 */
oj.BusyContext.prototype.isReady = function () {
  Logger.log("BusyContext.isReady: start scope='%s'", this._getDebugScope());
  var rtn = false;

  if (oj.BusyContext._BOOTSTRAP_MEDIATOR.isReady() && !this._waitingOnNextTickBusynessEval) {
    var statesMap = this._statesMap;

    rtn = statesMap.size === 0;
    oj.BusyContext._log(statesMap);
  }

  Logger.log("BusyContext.isReady: end scope='%s'", this._getDebugScope());
  return rtn;
};

/**
 * @private
 * @param {oj.BusyState} busyState added busy state
 * @returns {void}
 * @throws {Error} Busy state has already been resolved
 */
oj.BusyContext.prototype._removeBusyState = function (busyState) {
  var debugScope = this._getDebugScope();

  Logger.log("BusyContext._removeBusyState: start scope='%s'", debugScope);

  // The BusyState object is passed here instead of just the generated id to provide a more
  // descriptive message when the busy state is removed twice. The description (if provided) of
  // the busy state will be captured in the error message.

  var statesMap = this._statesMap;

  if (busyState[oj.BusyContext._OJ_RIP]) {
    Logger.log('Busy state has been forcefully resolved via clear:\n' + busyState);
    return;
  } else if (!statesMap.delete(busyState.id)) { // quoted to make the closure compiler happy
    throw new Error('Busy state has already been resolved:\n' + busyState);
  }

  Logger.log('BusyContext._removeBusyState: resolving busy state:\n' + busyState);
  if (statesMap.size === 0 && !this._waitingOnNextTickBusynessEval) {
    // no more busy states; evaluate busyness in the next tick
    this._waitingOnNextTickBusynessEval = true;
    window.setImmediate(this._evalBusyness.bind(this));
  }

  Logger.log("BusyContext._removeBusyState: end scope='%s'", debugScope);
};

/**
 * Evaluates the busyness of the context.
 * @private
 */
oj.BusyContext.prototype._evalBusyness = function () {
  var debugScope = this._getDebugScope();

  Logger.log("BusyContext._evalBusyness: begin scope='%s'", debugScope);

  try {
    // Since we are executing this code on 'next tick', it is safe to flush any JET throttled updates.
    // Doing so will allow us to take into account any busy states added in response to the pending updates
    oj.BusyContext._deliverThrottledUpdates();
  } catch (e) {
    Logger.error('Fatal exception delivering binding updates: %o', e);
    this._mediator.rejectMasterWhenReadyPromise(e);
    this._waitingOnNextTickBusynessEval = false;
    return;
  }

  var statesMap = this._statesMap;
  var mediator = this._mediator;

  // "appears" the Edge promise invokes the resolve callback immediately after
  // resolving versus waiting next micro tick.  Toggle the flag here so if
  // isReady() is called from the promise resolve callback, it returns true.
  this._waitingOnNextTickBusynessEval = false;
  if (statesMap.size === 0) {
    Logger.log('BusyContext._evalBusyness: resolving whenReady promises');

    mediator.resolveMasterWhenReadyPromise();
    this._resolveBusyStateForParent();
  } else {
    oj.BusyContext._log(statesMap);
  }

  Logger.log("BusyContext._evalBusyness: end scope='%s'", debugScope);
};

/**
 * <p>This function should be invoke by application domain logic to indicate all application
 * libraries are loaded and bootstrap processes complete.  The assumed strategy is that the
 * application will set a single global variable "oj_whenReady" from a inline script from the
 * document header section indicating the {@link oj.BusyContext#whenReady}
 * should {@link oj.BusyContext#addBusyState} until the application determines its bootstrap
 * sequence has completed.</p>
 *
 * Inline Script Example:
 * <pre class="prettyprint">
 * <code>
 * &lt;head&gt;
 *   &lt;script type=&quot;text/javascript&quot;&gt;
 *     // The "oj_whenReady" global variable enables a strategy that the busy context whenReady,
 *     // will implicitly add a busy state, until the application calls applicationBootstrapComplete
 *     // on the busy state context.
 *     window["oj_whenReady"] = true;
 *   &lt;/script&gt;
 * ...
 * ...
 * </code></pre>
 *
 * Requirejs callback Example:
 * <pre class="prettyprint">
 * <code>
 * require(['knockout', 'jquery', 'app', 'ojs/ojknockout', 'ojs/ojselectcombobox' ...],
 *   function(ko, $, app)
 *   {
 *     // release the application bootstrap busy state
 *     oj.Context.getPageContext().getBusyContext().applicationBootstrapComplete();
 *     ...
 *     ...
 *   });
 * </code></pre>
 *
 * @since 3.2.0
 * @export
 * @memberof oj.BusyContext
 * @instance
 * @method applicationBootstrapComplete
 * @returns {undefined}
 */
oj.BusyContext.prototype.applicationBootstrapComplete = function () {
  var debugScope = this._getDebugScope();
  Logger.log("BusyContext.applicationBootstrapComplete: begin scope='%s'", debugScope);

  oj.BusyContext._BOOTSTRAP_MEDIATOR.notifyComplete();

  Logger.log("BusyContext.applicationBootstrapComplete: end scope='%s'", debugScope);
};

/**
 * @ignore
 * @private
 * @return {oj.BusyContext} returns the nearest parent context
 */
oj.BusyContext.prototype._getParentBusyContext = function () {
  if (this._hostNode) {
    var parentContext = oj.Context.getContext(oj.Context.getParentElement(this._hostNode));
    if (parentContext) {
      return parentContext.getBusyContext();
    }
  }

  return null;
};

/**
 * Links a child context to its parent by registering a busy state with the parent
 * that will recursively register with its parent.
 *
 * @ignore
 * @private
 */
oj.BusyContext.prototype._addBusyStateToParent = function () {
  if (!this._parentNotified) {
    this._parentNotified = true;

    var parentContext = this._getParentBusyContext();
    if (parentContext) {
      var opts = {};
      opts[oj.BusyContext._DESCRIPTION] = this._getCompoundDescription.bind(this);
      this._parentResolveCallback = parentContext.addBusyState(opts);
    }
  }
};

/**
 * Resolves the busy state linking a child context with its parent.
 *
 * @ignore
 * @private
 */
oj.BusyContext.prototype._resolveBusyStateForParent = function () {
  this._parentNotified = false;
  if (this._parentResolveCallback) {
    this._parentResolveCallback();
    this._parentResolveCallback = null;
  }
};

/**
 * @private
 * @ignore
 * @return {string} description of all active busy states held by the context.
 */
oj.BusyContext.prototype._getCompoundDescription = function () {
  var busyStates = oj.BusyContext._values(this._statesMap);
  return ('[' + busyStates.join(', ') + ']');
};

/**
 * @private
 * @ignore
 * @return {string} context debug scope
 */
oj.BusyContext.prototype._getDebugScope = function () {
  function toSelector(node) {
    var selector = 'undefined';
    if (node) {
      if (node.id && node.id.length > 0) {
        selector = '#' + node.id;
      } else {
        selector = node.nodeName;
        if (node.hasAttribute('data-oj-context')) {
          selector += '[data-oj-context]';
        }

        var clazz = node.getAttribute('class');
        if (clazz) {
          selector += '.' + clazz.split(' ').join('.');
        }
      }
    }

    return selector;
  }

  if (!this._debugScope) {
    if (this._hostNode) {
      this._debugScope = toSelector(this._hostNode.parentElement) + ' > ' +
                         toSelector(this._hostNode);
    } else {
      this._debugScope = 'page';
    }
  }

  return this._debugScope;
};

/**
 * @since 3.1.0
 * @override
 * @memberof oj.BusyContext
 * @instance
 * @method toString
 * @returns {string} returns the value of the object as a string
 */
oj.BusyContext.prototype.toString = function () {
  var msg = 'Busy Context: [scope=';
  msg += this._getDebugScope();
  msg += ' states=' + this._getCompoundDescription() + ']';
  return msg;
};

/**
 * @ignore
 * @private
 */
oj.BusyContext._deliverThrottledUpdates = function () {
  // Dynamically check for the presence of ojs/ojknockout
  if (oj.ComponentBinding) {
    oj.ComponentBinding.deliverChanges();
  }
};

/**
 * @private
 * @ignore
 * @const
 * attribute name describing a busystate
 * @type {string}
 */
oj.BusyContext._DESCRIPTION = 'description';

/**
 * @ignore
 * @private
 * @constant
 * {@link oj.BusyState} property name indicating the instance is dead
 * @type {string}
 */
oj.BusyContext._OJ_RIP = '__ojRip';

/**
 * @ojtsignore
 * @private
 * @ignore
 */
oj.BusyContext._BOOTSTRAP_MEDIATOR = new /** @constructor */(function () {
  var _tracking;
  var _readyPromise;
  var _resolveCallback;

  if (typeof window !== 'undefined') {
    _tracking = window.oj_whenReady;
  }

  this.whenReady = function () {
    if (_readyPromise) {
      return _readyPromise;
    }

    if (!_tracking) {
      _readyPromise = Promise.resolve(true);
    } else {
      _readyPromise = new Promise(function (resolve) {
        _resolveCallback = resolve;
      });
    }
    return _readyPromise;
  };

  this.isReady = function () {
    return !_tracking;
  };

  this.notifyComplete = function () {
    if (_resolveCallback) {
      // resovle the promise in the next-tick.
      window.setImmediate(function () {
        _tracking = false;
        _resolveCallback(true);
        _resolveCallback = null;
      });
    } else {
      _tracking = false;
    }
  };
})();



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/**
 * Internally used by the {@link oj.BusyContext} to track a components state
 * while it is performing a task such as animation or fetching data.
 *
 * @hideconstructor
 * @ignore
 * @protected
 * @constructor
 * @param {Function|Object|undefined} description of the component and cause
 *        of the busy state
 */
oj.BusyState = function (description) {
  /**
   * @ignore
   * @private
   * @type {?}
   */
  this._description = description;

  /**
   * @ignore
   * @private
   * @type {number}
   */
  this._addedWaitTs = oj.BusyState._getTs();

  /**
   * @ignore
   * @private
   * @type {string}
   */
  this._id = this._addedWaitTs.toString(36) + '_' + Math.random().toString(36); // @RandomNumberOK -
  // random number concatinated to the current timestamp is used for a unique id for a local Map
  // key. This random number is not used use as a cryptography key.
};

Object.defineProperties(oj.BusyState.prototype, {
  /**
   * Identifies the usage instance of a busy state.
   * @memberof oj.BusyState
   * @instance
   * @property {!string} id
   */
  id: {
    get: function () {
      return this._id;
    },
    enumerable: true
  },
  /**
   * Further definition of the busy state instance.
   * @memberof oj.BusyState
   * @instance
   * @property {?string} description
   */
  description:
  {
    get: function () {
      if (this._description) {
        if (this._description instanceof Function) {
          return this._description();
        }
        return this._description.toString();
      }
      return undefined;
    },
    enumerable: true
  }
});

/**
 * @override
 * @returns {string} returns the value of the object as a string
 */
oj.BusyState.prototype.toString = function () {
  var buff = 'Busy state: [description=';

  var description = this.description;

  if (description !== null) {
    buff += description;
  }

  var elapsed = oj.BusyState._getTs() - this._addedWaitTs;
  buff += ', elapsed=' + elapsed + ']';

  return buff;
};


/**
 * @private
 * @returns {number} current date represented by a number
 */
oj.BusyState._getTs = function () {
  // Safari V9.1.1 doesn't yet support performance.now
  return window.performance ? window.performance.now() : new Date().getTime();
};



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/**
 * <b>The constructor should never be invoked by an application directly</b>. Use
 * {@link oj.Context.getPageContext} and {@link oj.Context.getContext} APIs to
 * retrieve an instance of the context.
 * @param {Element=} node DOM node where the context should be created
 * @export
 * @hideconstructor
 * @ojtsmodule
 * @constructor oj.Context
 * @since 2.1.0
 * @classdesc This is a general purpose context. Initially it only exposes the BusyContext
 * that keeps track of components that are currently animating or fetching data.
 * In the future this context might be expanded for other purposes.
 */
var Context = function (node) {
  this.Init(node);
};

oj.Object.createSubclass(Context, oj.Object, 'oj.Context');

/**
 * @method Init
 * @param {Element=} node DOM node where the context should be created
 * @instance
 * @memberof oj.Context
 * @instance
 * @protected
 */
Context.prototype.Init = function (node) {
  Context.superclass.Init.call(this);
  this._node = node;
};

/**
 * Returns the closest enclosing JET context for a node.
 * Any DOM element may be designated by the page author as a host of JET context.
 * The designation must be expressed in HTML markup by specifying the "data-oj-context"
 * attribute on the host element:

 * <pre class="prettyprint">
 * &lt;div data-oj-context>&lt;div>
 * </pre>
 *
 * <p>This method will walk up the element hierarchy starting with the source node to
 * find an element that has the data-oj-context attribute. If no such element is found,
 * the page context will be returned.</p>
 *
 * If the JET context is established on a particular element, the {@link oj.BusyContext}
 * associated with that context will be tracking busy states for that element and
 * its subtree
 *
 * @see oj.BusyContext for code examples
 * @method getContext
 * @memberof oj.Context
 * @param {Element} node DOM element whose enclosing context will be provided
 * @return {oj.Context} context object scoped per the target node
 * @since 2.2.0
 * @export
 */
Context.getContext = function (node) {
  while (node) {
    var context = node[Context._OJ_CONTEXT_INSTANCE];
    if (context) {
      return context;
    }
    if (node.hasAttribute(Context._OJ_CONTEXT_ATTRIBUTE)) {
      context = new Context(node);
      Object.defineProperty(node, Context._OJ_CONTEXT_INSTANCE,
                                                        { value: context });
      return context;
    }

    // eslint-disable-next-line no-param-reassign
    node = Context.getParentElement(node);
  }

  return Context.getPageContext();
};

/**
 * Static factory method that returns the page context.
 * @see oj.BusyContext for code examples
 * @export
 * @since 2.1.0
 * @method getPageContext
 * @return {oj.Context} context scoped for the page
 * @memberof oj.Context
 */
Context.getPageContext = function () {
  if (!Context._pageContext) { Context._pageContext = new Context(); }

  return Context._pageContext;
};

/**
 * @see oj.BusyContext for code examples
 * @since 2.1.0
 * @export
 * @method getBusyContext
 * @memberof oj.Context
 * @instance
 * @returns {oj.BusyContext} busy state context
 */
Context.prototype.getBusyContext = function () {
  if (!this._busyContext) { this._busyContext = new oj.BusyContext(this._node); }

  return this._busyContext;
};

/**
 * Sets a default for the optional <code>timeout</code> argument of the {@link oj.BusyContext#whenReady}
 * for all BusyContext instances. The default value will be implicitly used if a timeout argument is not
 * provided.
 *
 * @see oj.BusyContext#whenReady
 * @since 6.0.0
 * @memberof oj.Context
 * @method setBusyContextDefaultTimeout
 * @param {number} timeout in milliseconds
 */
Context.setBusyContextDefaultTimeout = function (timeout) {
  oj.BusyContext.setDefaultTimeout(timeout);
};

/**
 * @ignore
 * @private
 * @constant
 * Element marker attribute defining a context
 * @type {string}
 */
Context._OJ_CONTEXT_ATTRIBUTE = 'data-oj-context';

/**
 * @ignore
 * @private
 * @constant
 * Element property name for a context
 * @type {string}
 */
Context._OJ_CONTEXT_INSTANCE = '__ojContextInstance';

/**
 * @ignore
 * @private
 * @constant
 * attribute identifying an open popup
 * @type {string}
 */
Context._OJ_SURROGATE_ATTR = 'data-oj-surrogate-id';

/**
 * @ignore
 * @public
 * @param {Element} element target
 * @return {Element} the logical parent of an element accounting for open popups
 * @memberof oj.Context
 */
Context.getParentElement = function (element) {
  // @see oj.ZOrderUtils._SURROGATE_ATTR in "ojpopupcore/PopupService.js" for the details on how
  // this attribute is used by the popup service. The constant was re-declared to simplify module
  // dependencies.

  if (element && element.hasAttribute(Context._OJ_SURROGATE_ATTR)) {
    var surrogate = document.getElementById(element.getAttribute(Context._OJ_SURROGATE_ATTR));
    if (surrogate) { return surrogate.parentElement; }
  }

  return element.parentElement;
};

;return Context;
});