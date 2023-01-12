/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { option, LEVEL_LOG, log, info, error } from 'ojs/ojlogger';

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
const BusyState = function (description) {
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
  this._addedWaitTs = BusyState._getTs();

  /**
   * @ignore
   * @private
   * @type {string}
   */
  this._id = this._addedWaitTs.toString(36) + '_' + Math.random().toString(36); // @RandomNumberOK -
  // random number concatinated to the current timestamp is used for a unique id for a local Map
  // key. This random number is not used use as a cryptography key.
};

oj._registerLegacyNamespaceProp('BusyState', BusyState);

Object.defineProperties(BusyState.prototype, {
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
  description: {
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
BusyState.prototype.toString = function () {
  var buff = 'Busy state: [description=';

  var description = this.description;

  if (description !== null) {
    buff += description;
  }

  var elapsed = BusyState._getTs() - this._addedWaitTs;
  buff += ', elapsed=' + elapsed + ']';

  return buff;
};

/**
 * @private
 * @returns {number} current date represented by a number
 */
BusyState._getTs = function () {
  // Safari V9.1.1 doesn't yet support performance.now
  return window.performance ? window.performance.now() : new Date().getTime();
};

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
 * The BusyContext API utilizes {@link oj.Logger.LEVEL_LOG} to log detail busy state activity.
 * <pre class="prettyprint">
 * <code>
 *  Logger.option("level", Logger.LEVEL_LOG);
 * </code></pre>
 *
 * <b>This constructor should never be invoked by the application code directly.</b>
 * @hideconstructor
 * @param {Element=} hostNode DOM element associated with this busy context
 * @param {Context} context The oj.Context instance
 * @export
 * @constructor oj.BusyContext
 * @ojtsmodule
 * @ojtsnoexport
 * @ojtsexportastype Context
 * @since 2.1.0
 * @classdesc Framework service for querying the busy state of components on the page.
 */
const BusyContext = function (hostNode, context) {
  this.Init(hostNode, context);
};

oj.Object.createSubclass(BusyContext, oj.Object, 'oj.BusyContext');
oj._registerLegacyNamespaceProp('BusyContext', BusyContext);

/**
 * see oj.BusyContext#setDefaultTimeout
 * @type {number}
 * @ignore
 * @private
 */
BusyContext._defaultTimeout = Number.NaN;

/**
 * Used for debounce and requestAnimationFrame promises for Preact
 * @ignore
 * @private
 */
BusyContext.__preactPromisesMap = new Map();

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
BusyContext.setDefaultTimeout = function (timeout) {
  if (!isNaN(timeout)) {
    BusyContext._defaultTimeout = timeout;
  }
};

let _nextTickPromise;
/**
 * @private
 * @ignore
 * @return {Promise} resolves on the next-tick using setImmediate.
 */
function getNextTickPromise() {
  if (!_nextTickPromise) {
    _nextTickPromise = new Promise(function (resolve) {
      window.setImmediate(function () {
        _nextTickPromise = null;
        resolve(true);
      });
    });
  }

  return _nextTickPromise;
}

/**
 * @param {Element=} hostNode DOM element associated with this busy context
 * @param {Context=} context The oj.Context object
 * @instance
 * @protected
 */
BusyContext.prototype.Init = function (hostNode, context) {
  BusyContext.superclass.Init.call(this);

  this._hostNode = hostNode;
  this._context = context;

  /**
   * Busy states cache.
   *
   * @type {?}
   * @ignore
   * @private
   */
  this._statesMap = new Map();

  /**
   * @ignore
   * @private
   * The set of pending Preact Promises - debounce or requestAnimationFrame - that already have a busy state associated with them.
   */
  this._preactSet = new Set();

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
        this._masterWhenReadyPromise = new Promise(
          this._captureWhenReadyPromiseResolver.bind(this)
        );
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
      return Promise.race([master, slaveTimeoutPromise]).finally(
        this._clearAllSlaveTimeouts.bind(this)
      );
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
BusyContext._log = function (statesMap) {
  if (option('level') !== LEVEL_LOG) {
    return;
  }

  log('>> Busy states: %d', statesMap.size);

  var busyStates = BusyContext._values(statesMap);
  if (busyStates.length > 0) {
    log(busyStates.join('\n'));
  }
};

/**
 * @param {?} statesMap busy states
 * @return {Array.<oj.BusyState>} Returns an array of busy states entries from the states map
 * @private
 */
BusyContext._values = function (statesMap) {
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
BusyContext.prototype.addBusyState = function (options) {
  log("BusyContext.addBusyState: start scope='%s'", this._getDebugScope());

  /** @type {oj.BusyState} */
  var busyState = new BusyState(options[BusyContext._DESCRIPTION]);

  log('>> ' + busyState);

  this._statesMap.set(busyState.id, busyState);

  this._addBusyStateToParent();

  log("BusyContext.addBusyState: end scope='%s'", this._getDebugScope());

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
BusyContext.prototype.dump = function (message) {
  info("BusyContext.dump: start scope='%s' %s", this._getDebugScope(), message || '');

  var statesMap = this._statesMap;
  info('>> Busy states: %d', statesMap.size);

  var busyStates = BusyContext._values(statesMap);
  if (busyStates.length > 0) {
    info(busyStates.join('\n'));
  }

  info("BusyContext.dump: start scope='%s' %s", this._getDebugScope(), message || '');
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
BusyContext.prototype.getBusyStates = function () {
  /** @type {?} */
  return BusyContext._values(this._statesMap);
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
BusyContext.prototype.clear = function () {
  log("BusyContext.clear: start scope='%s'", this._getDebugScope());

  var busyStates = BusyContext._values(this._statesMap);
  for (var i = 0; i < busyStates.length; i++) {
    /** @type {?} **/
    var busyState = busyStates[i];
    try {
      this._removeBusyState(busyState);
    } catch (e) {
      log('BusyContext.clear: %o', e);
    }

    Object.defineProperty(busyState, BusyContext._OJ_RIP, { value: true, enumerable: false });
  }

  log("BusyContext.clear: end scope='%s'", this._getDebugScope());
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
BusyContext.prototype.whenReady = function (timeout) {
  var debugScope = this._getDebugScope();

  log("BusyContext.whenReady: start, scope='%s', timeout=%d", debugScope, timeout);
  /** @type {?} */
  var statesMap = this._statesMap;

  var mediator = this._mediator;
  var bootstrapPromise = BusyContext._BOOTSTRAP_MEDIATOR.whenReady();
  const master = mediator.getMasterWhenReadyPromise();
  var promise = bootstrapPromise.then(
    function () {
      log('BusyContext.whenReady: bootstrap mediator ready scope=%s', debugScope);

      this._evalBusyness();

      log('BusyContext.whenReady: busy states returning master scope=%s', debugScope);
      return master;
    }.bind(this)
  );

  // if a timeout argument is not provided, check the default timeout
  if (isNaN(timeout) && !isNaN(BusyContext._defaultTimeout)) {
    // eslint-disable-next-line no-param-reassign
    timeout = BusyContext._defaultTimeout;
  }

  if (!isNaN(timeout)) {
    var handleTimeout = function () {
      var error;
      var expiredText = 'whenReady timeout of ' + timeout + 'ms expired ';

      BusyContext._log(statesMap);
      var busyStates = BusyContext._values(statesMap);

      if (!BusyContext._BOOTSTRAP_MEDIATOR.isReady()) {
        error = new Error(
          expiredText +
            'while the application is loading.' +
            ' Busy state enabled by setting the "window.oj_whenReady = true;" global variable.' +
            ' Application bootstrap busy state is released by calling' +
            ' "oj.Context.getPageContext().getBusyContext().applicationBootstrapComplete();".'
        );
      } else {
        error = new Error(expiredText + 'with the following busy states: ' + busyStates.join(', '));
      }

      error.busyStates = busyStates;

      log("BusyContext.whenReady: rejected scope='%s'\n%s", debugScope, error.message);
      return error;
    };
    promise = mediator.getSlaveTimeoutPromise(promise, handleTimeout, timeout);
  }

  log("BusyContext.whenReady: end scope='%s'", this._getDebugScope());
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
BusyContext.prototype.isReady = function () {
  log("BusyContext.isReady: start scope='%s'", this._getDebugScope());
  var rtn = false;

  if (BusyContext._BOOTSTRAP_MEDIATOR.isReady() && !this._doubleCheckPend) {
    rtn = this._hasNoBusyStates();
    BusyContext._log(this._statesMap);
  }

  log("BusyContext.isReady: end scope='%s'", this._getDebugScope());
  return rtn;
};

/**
 * @private
 * @param {oj.BusyState} busyState added busy state
 * @returns {void}
 * @throws {Error} Busy state has already been resolved
 */
BusyContext.prototype._removeBusyState = function (busyState) {
  var debugScope = this._getDebugScope();

  log("BusyContext._removeBusyState: start scope='%s'", debugScope);

  // The BusyState object is passed here instead of just the generated id to provide a more
  // descriptive message when the busy state is removed twice. The description (if provided) of
  // the busy state will be captured in the error message.

  if (busyState[BusyContext._OJ_RIP]) {
    log('Busy state has been forcefully resolved via clear:\n' + busyState);
    return;
  } else if (!this._statesMap.delete(busyState.id)) {
    throw new Error('Busy state has already been resolved:\n' + busyState);
  }

  log('BusyContext._removeBusyState: resolving busy state:\n' + busyState);

  this._evalBusyness();

  log("BusyContext._removeBusyState: end scope='%s'", debugScope);
};

/**
 * Checks busyness
 * @ignore
 * @private
 */

BusyContext.prototype._evalBusyness = function () {
  var debugScope = this._getDebugScope();
  log("BusyContext._evalBusyness: begin scope='%s'", debugScope);

  if (this._hasNoBusyStates() && !this._doubleCheckPend) {
    log(
      "BusyContext._evalBusyness: macrotask to double-check busyness, scope='%s'",
      debugScope
    );
    this._doubleCheckPend = true;
    getNextTickPromise().then(this._doubleCheckBusyness.bind(this));
  }

  log("BusyContext._evalBusyness: end scope='%s'", debugScope);
};

/**
 * @ignore
 * @private
 */
BusyContext.prototype._hasNoBusyStates = function () {
  this._syncDebounceBusyness();
  return this._statesMap.size === 0;
};

/**
 * @ignore
 * @private
 */
BusyContext.prototype._syncDebounceBusyness = function () {
  const preactPromises = BusyContext.__preactPromisesMap;
  preactPromises.forEach((promiseDesc, preactPromise) => {
    // Add a busy state for Preact Promise (debounce or RAF). Note that we are using a Set
    // to add just one busy state for a particuar Promise instance
    if (preactPromise && !this._preactSet.has(preactPromise)) {
      this._preactSet.add(preactPromise);
      const resolver = this.addBusyState({ description: promiseDesc });
      preactPromise.then(() => {
        this._preactSet.delete(preactPromise);
        resolver();
      });
    }
  });
};

/**
 * Deouble-checks that there is stil no busyness after a macrotask.
 * @private
 */
BusyContext.prototype._doubleCheckBusyness = function () {
  var debugScope = this._getDebugScope();

  log("BusyContext._doubleCheckBusyness: begin scope='%s'", debugScope);

  try {
    // Since we are executing this code on 'next tick', it is safe to flush any JET throttled updates.
    // Doing so will allow us to take into account any busy states added in response to the pending updates
    BusyContext._deliverThrottledUpdates();
  } catch (e) {
    error('Fatal exception delivering binding updates: %o', e);
    this._doubleCheckPend = false;
    this._rejectWhenReadyPromises(e);
    return;
  }

  // "appears" the Edge promise invokes the resolve callback immediately after
  // resolving versus waiting next micro tick.  Toggle the flag here so if
  // isReady() is called from the promise resolve callback, it returns true.
  this._doubleCheckPend = false;

  if (this._hasNoBusyStates()) {
    log('BusyContext._doubleCheckBusyness: resolving whenReady promises');

    this._mediator.resolveMasterWhenReadyPromise();
    this._resolveBusyStateForParent();
  } else {
    BusyContext._log(this._statesMap);
  }

  log("BusyContext._doubleCheckBusyness: end scope='%s'", debugScope);
};

/**
 * <p>This function should be invoke by application domain logic to indicate all application
 * libraries are loaded and bootstrap processes complete.  The assumed strategy is that the
 * application will set a single global variable "oj_whenReady" from its "main.js"
 * script, indicating that the {@link oj.BusyContext#whenReady}
 * should {@link oj.BusyContext#addBusyState} until the application determines its bootstrap
 * sequence has completed.</p>
 *
 * main.js Script Example:
 * <pre class="prettyprint">
 * main.js:
 * <code>
 *     // The "oj_whenReady" global variable enables a strategy that the busy context whenReady,
 *     // will implicitly add a busy state, until the application calls applicationBootstrapComplete
 *     // on the busy state context.
 *     window["oj_whenReady"] = true;
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
BusyContext.prototype.applicationBootstrapComplete = function () {
  var debugScope = this._getDebugScope();
  log("BusyContext.applicationBootstrapComplete: begin scope='%s'", debugScope);

  BusyContext._BOOTSTRAP_MEDIATOR.notifyComplete();

  log("BusyContext.applicationBootstrapComplete: end scope='%s'", debugScope);
};

/**
 * @ignore
 * @private
 * @return {oj.BusyContext} returns the nearest parent context
 */
BusyContext.prototype._getParentBusyContext = function () {
  var parentContext = this._context.getParentContext();
  if (parentContext) {
    return parentContext.getBusyContext();
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
BusyContext.prototype._addBusyStateToParent = function () {
  if (!this._parentNotified) {
    this._parentNotified = true;

    var parentContext = this._getParentBusyContext();
    if (parentContext) {
      var opts = {};
      opts[BusyContext._DESCRIPTION] = this.toString.bind(this);
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
BusyContext.prototype._resolveBusyStateForParent = function () {
  this._parentNotified = false;
  if (this._parentResolveCallback) {
    this._parentResolveCallback();
    this._parentResolveCallback = null;
  }
};

/**
 * Rejects the whenReady Promises from this child context and its parent
 *
 * @ignore
 * @private
 */
BusyContext.prototype._rejectWhenReadyPromises = function (error) {
  this._mediator.rejectMasterWhenReadyPromise(error);
  const parentContext = this._getParentBusyContext();
  if (parentContext) {
    parentContext._rejectWhenReadyPromises(error);
    this._resolveBusyStateForParent();
  }
};

/**
 * @private
 * @ignore
 * @return {string} description of all active busy states held by the context.
 */
BusyContext.prototype._getCompoundDescription = function () {
  var busyStates = BusyContext._values(this._statesMap);
  return '[' + busyStates.join(', ') + ']';
};

/**
 * @private
 * @ignore
 * @return {string} context debug scope
 */
BusyContext.prototype._getDebugScope = function () {
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
      this._debugScope =
        toSelector(this._hostNode.parentElement) + ' > ' + toSelector(this._hostNode);
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
BusyContext.prototype.toString = function () {
  var msg = 'Busy Context: [scope=';
  msg += this._getDebugScope();
  msg += ' states=' + this._getCompoundDescription() + ']';
  return msg;
};

/**
 * @ignore
 * @private
 */
BusyContext._deliverThrottledUpdates = function () {
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
BusyContext._DESCRIPTION = 'description';

/**
 * @ignore
 * @private
 * @constant
 * {@link oj.BusyState} property name indicating the instance is dead
 * @type {string}
 */
BusyContext._OJ_RIP = '__ojRip';

/**
 * @ojtsignore
 * @private
 * @ignore
 */
BusyContext._BOOTSTRAP_MEDIATOR = new /** @constructor */ (function () {
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
      getNextTickPromise().then(function () {
        _tracking = false;
        // Check that function hasn't been nullified after next-tick
        // Can happen if multiple calls to applicationBootstrapComplete() on
        // page load (esp during WebDriver testing)
        if (typeof _resolveCallback === 'function') {
          _resolveCallback(true);
        }
        _resolveCallback = null;
      });
    } else {
      _tracking = false;
    }
  };
})();

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
const Context = function (node) {
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
 * Get the parent context given the element
 * @ignore
 * @private
 * @param {Element} element
 * @return Context The parent context
 */
Context.prototype.getParentContext = function () {
  if (this._node) {
    return Context.getContext(Context.getParentElement(this._node));
  }
  return null;
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
      Object.defineProperty(node, Context._OJ_CONTEXT_INSTANCE, { value: context });
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
  if (!Context._pageContext) {
    Context._pageContext = new Context();
  }

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
  if (!this._busyContext) {
    this._busyContext = new BusyContext(this._node, this);
  }

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
  BusyContext.setDefaultTimeout(timeout);
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
 * @private
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
    if (surrogate) {
      return surrogate.parentElement;
    }
  }

  // _ojReportBusy expando will be set by the TemplateEngine if busy states need to bubble
  // up to an alternate parent
  return element._ojReportBusy || element.parentElement;
};

/**
 * @ignore
 * @private
 */
Context.__addPreactPromise = function (promise, description) {
  BusyContext.__preactPromisesMap.set(promise, description);
};

/**
 * @ignore
 * @private
 */
Context.__removePreactPromise = function (promise) {
  BusyContext.__preactPromisesMap.delete(promise);
};

export default Context;
