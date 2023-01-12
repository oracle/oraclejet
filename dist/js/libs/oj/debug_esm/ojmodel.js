/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { warn, error } from 'ojs/ojlogger';
import $ from 'jquery';
import { getLocale } from 'ojs/ojconfig';

/**
 * @constructor
 * @final
 * @class Events
 * @classdesc Supports event system for the common model ([Collection]{@link Collection} and
 * [Model]{@link Model})
 * @since 1.0.0
 * @ojtsignore
 */
const Events =
  /** @lends Events */
  {
    /**
     * Add an event handler for an event type to the model or collection object.
     * @param {string|Object} eventType Types of event handlers to add (may be a single event type, a
     * space-delimited set of event types, or an object mapping events to callbacks).
     * @param {function(Object, any=, any=)} callback User's event handler callback function (called with the
     * model or collection object and event specific values as parameters--the context will be the model or collection unless specified by context, below).
     * @param {Object=} context A context for the event
     * @return {undefined}
     * @ojsignature {target: "Type", for: "callback", value: "(context: Object, data?: any, data2?: any)=> void"}
     * @since 1.0.0
     * @memberof Events
     */
    on: function (eventType, callback, context) {
      return this.OnInternal(eventType, callback, context, false, false);
    },

    /**
     * Remove an event handler for an event type from the model or collection object.
     * @param {(string|Object)=} eventType Types of event handlers to remove (may be a single event type, a
     * space-delimited set of event types, or a map of events to callbacks). If omitted, remove all event handlers.
     * @param {function(Object, any=, any=)=} callback If provided, remove handlers only for eventType events with the
     * given callback function.
     * @param {Object=} context If provided, remove handlers only for eventType events with the given callback
     * function and context object.
     * @return {undefined}
     * @ojsignature {target: "Type", for: "callback", value: "(context: object, data?: any, data2?: any)=> void"}
     * @since 1.0.0
     * @memberof Events
     */
    off: function (eventType, callback, context) {
      return this._offInternal(eventType, callback, context, false);
    },

    /**
     * Fire the given event type(s) for all registered handlers.
     * @param {string} eventType Types of event handlers to fire (may be a single event type or a space-delimited
     * set of event types).
     * @return {undefined}
     * @since 1.0.0
     * @memberof Events
     */
    // eslint-disable-next-line no-unused-vars
    trigger: function (eventType) {
      var args = Array.prototype.slice.call(arguments);
      // Inject a silent setting in there: if this is being called outside we want to fire all relevant
      // events
      args.unshift(false);
      return Events.TriggerInternal.apply(this, args);
    },

    /**
     * Add an event handler for an event type to the model or collection object, but only fire it once, then remove
     * it from the list of handlers.
     * @param {string} eventType Types of event handlers to add (may be a single event type or a space-delimited
     * set of event types).
     * @param {function(Object, Object=, Object=)} callback User's event handler callback function (called with the
     * model or collection object and event specific values as parameters--the context will be the model or collection unless
     * specified by context, below).
     * @param {Object=} context A context for the event
     * @return {undefined}
     * @ojsignature {target: "Type", for: "callback", value: "(context: Object, data?: any, data2?: any)=> void"}
     * @since 1.0.0
     * @memberof Events
     */
    once: function (eventType, callback, context) {
      return this._onceInternal(eventType, callback, context, false, null);
    },

    /**
     * Add an event handler for an event type to a second model or collection object ("otherObj"), but track it on
     * the called object.
     * @param {Model|Collection} otherObj Model or collection object on which to add this event handler.
     * @param {string} eventType Types of event handlers to add (may be a single event type or a space-delimited
     * set of event types).
     * @param {function(Object, any=, any=)} callback User's event handler callback function (called with the
     * model or collection object and event specific values as parameters--the context will be the model or collection
     * unless specified by context, below).
     * @return {undefined}
     * @ojsignature {target: "Type", for: "callback", value: "(context: Object, data?: any, data2?: any)=> void"}
     * @since 1.0.0
     * @memberof Events
     */
    listenTo: function (otherObj, eventType, callback) {
      var eventArray;
      var e;
      var event;
      var attr;
      var eventString;
      var listenerObj;
      var eventMap = {};
      var prop;

      if (eventType.constructor === String) {
        // Create a map out of it
        eventMap[eventType] = callback;
      } else {
        eventMap = eventType;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (prop in eventMap) {
        // eslint-disable-next-line no-prototype-builtins
        if (eventMap.hasOwnProperty(prop)) {
          eventArray = Events._getEvents(prop);
          for (e = 0; e < eventArray.length; e += 1) {
            event = eventArray[e].event;
            attr = eventArray[e].attribute;
            listenerObj = {
              event: event,
              attribute: attr,
              object: otherObj,
              callback: eventMap[prop]
            };
            eventString = attr ? event + ':' + attr : event;
            if (this._listeningTo === undefined) {
              this._listeningTo = [];
            }
            this._listeningTo.push(listenerObj);
            // fire
            otherObj.OnInternal(eventString, eventMap[prop], null, true, false);
          }
        }
      }
      return this;
    },

    /**
     * Add an event handler for an event type to a second model or collection object ("otherObj"), but track it on
     * the called object.  Only fire once.
     * @param {Model|Collection} otherObj Model or collection object on which to add this event handler.
     * @param {string} eventType Types of event handlers to add (may be a single event type or a space-delimited
     * set of event types).
     * @param {function(Object, any=, any=)} callback User's event handler callback function (called with the
     * model or collection object and event specific values as parameters--the context will be the model or collection unless
     * specified by context, below).
     * @ojsignature {target: "Type", for: "callback", value: "(context: Object, data?: any, data2?: any)=> void"}
     * @return {undefined}
     * @since 1.0.0
     * @memberof Events
     */
    listenToOnce: function (otherObj, eventType, callback) {
      var eventArray;
      var e;
      var event;
      var attr;
      var eventString;
      var listenerObj;
      var eventMap = {};
      var prop;

      if (eventType.constructor === String) {
        // Create a map out of it
        eventMap[eventType] = callback;
      } else {
        eventMap = eventType;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (prop in eventMap) {
        // eslint-disable-next-line no-prototype-builtins
        if (eventMap.hasOwnProperty(prop)) {
          eventArray = Events._getEvents(prop);
          for (e = 0; e < eventArray.length; e += 1) {
            event = eventArray[e].event;
            attr = eventArray[e].attribute;
            listenerObj = {
              event: event,
              attribute: attr,
              object: otherObj,
              callback: eventMap[prop]
            };
            eventString = attr ? event + ':' + attr : event;
            if (this._listeningTo === undefined) {
              this._listeningTo = [];
            }
            this._listeningTo.push(listenerObj);
            // fire
            otherObj._onceInternal(eventString, eventMap[prop], null, true, this);
          }
        }
      }
      return this;
    },

    /**
     * Remove event handlers from a model or collection object. If the arguments are omitted, removes all event
     * handlers from the model or collection.
     * @param {Model|Collection=} otherObj If specified, remove event handlers that target otherObj from this model or
     * collection.
     * @param {string=} eventType If specified, remove the event handlers for the given event types from this
     * model or collection
     * @param {function(Object, any=, any=)=} callback If specified, remove event handlers that call the given user
     * callback function from this model or collection
     * @return {undefined}
     * @ojsignature {target: "Type", for: "callback", value: "(context: Object, data?: any, data2?: any)=> void"}
     * @since 1.0.0
     * @memberof Events
     */
    stopListening: function (otherObj, eventType, callback) {
      var eventArray;
      var actualType;
      var eventMap = {};
      var e;
      var oneEvent;
      var oneAttr;
      var event;
      var objEqual;
      var eventEqual;
      var callbackEqual;
      var attrEqual;
      var i;
      var len;
      var cb;
      var prop;

      if (arguments == null || arguments.length <= 1) {
        len = this._listeningTo ? this._listeningTo.length : 0;
        // Remove everything
        for (i = 0; i < len; i++) {
          event = this._listeningTo[i];
          // If we have an "otherObj" argument, make sure that passes muster
          objEqual = otherObj ? otherObj === event.object : true;
          if (objEqual) {
            cb = event.object._offInternal;
            cb.apply(event.object, [event.event, event.callback, event.context, true]);
          }
        }
        this._listeningTo = [];
        return this;
      }

      actualType = eventType;
      // Account for missing otherObj
      if (otherObj && otherObj.constructor === String) {
        actualType = otherObj;
      }

      if (actualType.constructor === String) {
        // Create a map out of it
        eventMap[actualType] = callback;
      } else {
        eventMap = actualType;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (prop in eventMap) {
        // eslint-disable-next-line no-prototype-builtins
        if (eventMap.hasOwnProperty(prop)) {
          eventArray = Events._getEvents(prop);
          for (e = 0; e < eventArray.length; e += 1) {
            oneEvent = eventArray[e].event;
            oneAttr = eventArray[e].attribute;
            len = this._listeningTo ? this._listeningTo.length : 0;
            for (i = len - 1; i >= 0; i -= 1) {
              event = this._listeningTo[i];
              objEqual = otherObj ? otherObj === event.object : true;
              eventEqual = oneEvent ? oneEvent === event.event : true;
              callbackEqual = callback ? eventMap[prop] === event.callback : true;
              attrEqual = oneAttr ? oneAttr === event.attribute : true;
              if (objEqual && eventEqual && callbackEqual && attrEqual) {
                cb = this._listeningTo[i].object._offInternal;
                cb.apply(this._listeningTo[i].object, [
                  this._listeningTo[i].event,
                  this._listeningTo[i].callback,
                  this._listeningTo[i].context,
                  true
                ]);
                this._listeningTo.splice(i, 1);
              }
            }
          }
        }
      }
      return this;
    },

    /**
     * @export
     * Event types
     * @enum {string}
     * @memberof Events
     */
    EventType: {
      /** Triggered when a model is added to a collection<p>
       *  The event passes these arguments to the handler: <br>
       *  <ul>
       *  <b>model</b>: the model being added to the collection<br>
       *  <b>collection</b>: the collection to which the model has been added<br>
       *  <b>options</b>: any options passed in to the add call that triggered the event
       *  </ul>
       */
      ADD: 'add',
      /** Triggered by a collection during an add call once all models passed in have been added<p>
       * The event passes these arguments to the handler:<br>
       * <ul>
       * <b>collection</b>: the collection to which the models have been added<br>
       * <b>models</b>: the array of models that have been added <br>
       * <b>options</b>: any options passed in to the add call
       * </ul>
       */
      ALLADDED: 'alladded',
      /** Triggered when a model is removed from a collection<p>
       * The event passes these arguments to the handler: <br>
       * <ul>
       * <b>model</b>: the model being removed from the collection<br>
       * <b>collection</b>: the collection from which the model was removed<br>
       * <b>options</b>: <b>index</b>: the index of the model being removed
       * </ul>
       */
      REMOVE: 'remove',
      /** Triggered when a collection is reset (see Collection.reset)<p>
       *  The event passes these arguments to the handler:<br>
       *  <ul>
       *  <b>collection</b>: the collection being reset<br>
       *  <b>options</b>: any options passed in to the reset call
       *  </ul>
       */
      RESET: 'reset',
      /** Triggered when a collection is refreshed (see Collection.refresh)<p>
       *  The event passes these arguments to the handler: <br>
       *  <ul>
       *  <b>collection</b>: the collection being refreshed<br>
       *  <b>options</b>: any options passed in to the refresh call
       *  </ul>
       */
      REFRESH: 'refresh',
      /** Triggered when a collection is sorted.  If the second argument to the callback is set (options) and
       * 'add' is true, it means this sort event was triggered as a result of an add <p>
       *  The event passes these arguments to the handler:<br>
       *  <ul>
       *  <b>collection</b>: the collection being sorted<br>
       *  <b>options</b>: <b>add</b>: true if this sort event was triggered as the result of an add call,
       *  undefined or false if not
       *  </ul>
       */
      SORT: 'sort',
      /** Triggered when a model's attributes are changed.  This can be the result of a clear call on a model;
       * a property set call on a model; an unset call on a model; or the changing of properties due to the
       * merging of models (in an add, for example) <p>
       * The event passes these arguments to the handler:<br>
       * <ul>
       * <b>model</b>: the model on which the change occurred<br>
       * <b>value</b>: for property-specific change events, the new value of the property being changed<br>
       * <b>options</b>: any options passed in to the call that triggered the change event.  This is the second
       * argument passed for overall change events, and the third parameter (after value) for property-specific
       * change events.
       * </ul>
       */
      CHANGE: 'change',
      /** Triggered when a model is deleted from the data service (and thus from its Collection), due to a model
       * destroy call<p>
       * The event passes these arguments to the handler:<br>
       * <ul>
       * <b>model</b>: the model being deleted<br>
       * <b>collection</b>: the deleted model's collection, if any
       * </ul>
       */
      DESTROY: 'destroy',
      /** Triggered by a collection during a remove call once all models passed in have been removed and
       * destroyed<p>
       * The event passes these arguments to the handler:<br>
       * <ul>
       * <b>collection</b>: the collection from which the models have been removed<br>
       * <b>models</b>: the array of models that have been removed <br>
       * <b>options</b>: any options passed in to the remove call
       * </ul>
       */
      ALLREMOVED: 'allremoved',
      /** Triggered when a model or collection has sent a request to the data service <p>
       *  The event passes these arguments to the handler:<br>
       *  <ul>
       *  <b>collection or model</b>: the collection or model triggering the request<br>
       *  <b>xhr</b>: the xhr argument for the request<br>
       *  <b>options</b>: any options passed as part of the request
       *  </ul>
       */
      REQUEST: 'request',
      /** Triggered when a model or collection has been updated from the data service<p>
       *  The event passes these arguments to the handler:<br>
       *  <ul>
       *  <b>collection or model</b>: the collection or model that triggered the update<br>
       *  <b>response</b>: the response object from the data service<br>
       *  <b>options</b>: any options passed in to the call that triggered the update
       *  </ul>
       */
      SYNC: 'sync',
      /** Triggered when a model has failed to update on the data service<p>
       *  The event passes these arguments to the handler:<br>
       *  <b>collection or model</b>: the collection or model that made the call that resulted in the error<br>
       *  <b>xhr</b>: the xhr argument for the failing request, if any<br>
       *  <b>options</b>: any options passed in to the call that triggered the failing request, plus the status
       *  and error as textStatus and errorThrown
       *  </ul>
       */
      ERROR: 'error',
      /** Triggered on an error with data source interactions <p>
       * The event passes these arguments to the handler:<br>
       * <ul>
       * <b>model</b>: the model (or collection) on which the error operation happened <br>
       * <b>xhr</b>: the xhr involved, if relevant<br>
       * <b>options</b>: any options passed in to the call that triggered the invalid event
       * </ul>
       */
      INVALID: 'invalid',
      /** Triggered when all pending promises from Collection API calls have been resolved<p>
       * The event passes these arguments to the handler:<br>
       * <ul>
       * <b>collection</b>: the collection on which the promises have been resolved
       * </ul>
       */
      READY: 'ready',
      /** Triggered for any of the above events <p>
       * The event passes the name of the actual event and then any arguments normally passed to that event
       * following the name
       */
      ALL: 'all'
    }
  };

// Aliases for backward compatibility
Events.bind = Events.on;
Events.unbind = Events.off;

/**
 * @private
 * @param {Object} myClass
 * @param {Object=} source
 */
Events.Mixin = function (myClass, source) {
  var methodName;
  var obj = source || this;
  // eslint-disable-next-line no-restricted-syntax
  for (methodName in obj) {
    if (typeof obj[methodName] === 'function') {
      myClass[methodName] = obj[methodName]; // eslint-disable-line no-param-reassign
    }
  }
  // Make sure actual vars are own copies
  myClass.eventHandlers = {}; // eslint-disable-line no-param-reassign
  myClass._listeningTo = []; // eslint-disable-line no-param-reassign
};

/**
 * @private
 */
Events._onceInternal = function (eventType, callback, context, listenTo, otherObj) {
  var eventArray;
  var e;
  var event;
  var attr;
  var eventMap;
  var obj;
  var cxt = context;

  obj = this._getEventMap(eventType, callback, context);
  eventMap = obj.map;
  cxt = obj.context;

  var self = this;
  Object.keys(eventMap || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(eventMap, prop)) {
      eventArray = self._getEvents(prop);

      for (e = 0; e < eventArray.length; e += 1) {
        event = eventArray[e].event;
        attr = eventArray[e].attribute;
        if (self.eventHandlers === undefined) {
          self.eventHandlers = [];
        }
        if (self.eventHandlers[event] === undefined) {
          self.eventHandlers[event] = [];
        }

        self.eventHandlers[event].push({
          callback: eventMap[prop],
          context: cxt,
          attribute: attr,
          once: true,
          fired: false,
          listen: listenTo,
          otherObj: otherObj
        });
      }
    }
  });
  return this;
};

/**
 * @private
 */
Events._shouldFire = function (handler) {
  if (handler.once) {
    if (!handler.fired) {
      handler.fired = true; // eslint-disable-line no-param-reassign
      return true;
    }
    return false;
  }
  return true;
};

/**
 * @private
 */
Events._getContext = function (obj, handler) {
  return handler.context || handler.otherObj || obj;
};

/**
 * @protected
 */
Events.TriggerInternal = function (silent, eventType) {
  var eventArray = this._getEvents(eventType);
  var e;
  var event;
  var attr;
  var eventsToFire;
  var handlers;
  var i;
  var args;
  var allHandlers;
  var callback;

  eventsToFire = [];
  for (e = 0; e < eventArray.length; e += 1) {
    event = eventArray[e].event;
    attr = eventArray[e].attribute;
    // Do specific event...
    eventsToFire.push({ event: event, attribute: attr });
  }
  for (e = 0; e < eventsToFire.length; e += 1) {
    allHandlers = this._getHandlers(this.eventHandlers, Events.EventType.ALL);
    handlers = Events._getHandlers(this.eventHandlers, eventsToFire[e].event, false);
    for (i = 0; i < (handlers ? handlers.length : 0); i += 1) {
      if (handlers[i].attribute === eventsToFire[e].attribute && handlers[i].callback) {
        args = Array.prototype.slice.call(arguments);
        if (handlers && handlers[i] && handlers[i].once) {
          // Remove it: only want to fire once--make sure we remove it from the original
          this._removeHandler(
            Events._getHandlers(this.eventHandlers, eventsToFire[e].event, true),
            handlers[i]
          );
          // Now take it out of the other object's "listen to" list, if relevant
          if (handlers[i].otherObj) {
            // Clean up the "other object" if this was a triggered listenOnce
            handlers[i].otherObj.stopListening(this, eventType, handlers[i].callback);
          }
        }
        if (handlers && handlers[i] && this._shouldFire(handlers[i])) {
          callback = handlers[i].callback;
          // If this isn't a silent firing or this handler always wants to be called, make the call
          if (!silent || handlers[i].ignoreSilent) {
            callback.apply(Events._getContext(this, handlers[i]), args.slice(2));
          }
        }
      }
    }
    // Handle all
    for (i = 0; i < (allHandlers ? allHandlers.length : 0); i += 1) {
      args = Array.prototype.slice.call(arguments);
      if (args.length > 0) {
        if (eventsToFire[e].attribute) {
          args[1] = eventsToFire[e].event + ':' + eventsToFire[e].attribute;
        } else {
          args[1] = eventsToFire[e].event;
        }
      }
      // All case--make sure to pass event name
      if (
        allHandlers &&
        allHandlers[i] &&
        allHandlers[i].callback &&
        this._shouldFire(allHandlers[i])
      ) {
        callback = allHandlers[i].callback;
        // If this isn't a silent firing or this handler always wants to be called, make the call
        if (!silent || allHandlers[i].ignoreSilent) {
          callback.apply(Events._getContext(this, allHandlers[i]), args.slice(1));
        }
      }
      if (allHandlers && allHandlers[i] && allHandlers[i].once) {
        // Remove it: only want to fire once
        this._removeHandler(
          this._getHandlers(this.eventHandlers, Events.EventType.ALL, true),
          allHandlers[i]
        );
        // Now take it out of the other object's "listen to" list, if relevant
        if (allHandlers[i].otherObj) {
          // Clean up the "other object" if this was a triggered listenOnce
          allHandlers[i].otherObj.stopListening(
            this,
            Events.EventType.ALL,
            allHandlers[i].callback
          );
        }
      }
    }
  }
  return this;
};

/**
 * @protected
 */
Events.OnInternal = function (eventType, callback, context, listenTo, ignoreSilent) {
  var eventMap;
  var eventArray;
  var i;
  var event;
  var attr;
  var eventObj;
  var cxt;
  var prop;

  var obj = this._getEventMap(eventType, callback, context);
  eventMap = obj.map;
  cxt = obj.context;

  // eslint-disable-next-line no-restricted-syntax
  for (prop in eventMap) {
    // eslint-disable-next-line no-prototype-builtins
    if (eventMap.hasOwnProperty(prop)) {
      eventArray = this._getEvents(prop);

      for (i = 0; i < eventArray.length; i += 1) {
        event = eventArray[i].event;
        attr = eventArray[i].attribute;
        if (this.eventHandlers === undefined) {
          this.eventHandlers = [];
        }
        if (this.eventHandlers[event] === undefined) {
          this.eventHandlers[event] = [];
        }

        eventObj = {
          callback: eventMap[prop],
          context: cxt,
          attribute: attr,
          listen: listenTo,
          ignoreSilent: ignoreSilent
        };
        if (
          this._checkForHandler(this.eventHandlers[event], eventObj, Events._handlersIdentical) ===
          -1
        ) {
          this.eventHandlers[event].push(eventObj);
        }
      }
    }
  }
  return this;
};

/**
 * @private
 */
Events._offInternal = function (eventType, callback, context, listen) {
  var eventMap;
  var obj;
  var cxt;
  var prop;

  if (arguments == null || arguments.length === 0) {
    // Remove everything
    this.eventHandlers = {};
    return this;
  }

  if (eventType == null) {
    this._removeEvent(eventType, callback, context, listen);
    return this;
  }

  obj = this._getEventMap(eventType, callback, context);
  eventMap = obj.map;
  cxt = obj.context;

  // eslint-disable-next-line no-restricted-syntax
  for (prop in eventMap) {
    // eslint-disable-next-line no-prototype-builtins
    if (eventMap.hasOwnProperty(prop)) {
      this._removeEvent(prop, eventMap[prop], cxt, listen);
    }
  }
  return this;
};

/**
 * @private
 */
Events._getEventMap = function (eventType, callback, context) {
  var eventMap = {};

  if (eventType.constructor === String) {
    // Create a map out of it
    eventMap[eventType] = callback;
  } else {
    eventMap = eventType;
    // If eventType is a map of events->callbacks, then the callback argument is now context
    return { map: eventMap, context: callback };
  }
  return { map: eventMap, context: context };
};

/**
 * @private
 */
Events._removeEvent = function (eventType, callback, context, listen) {
  var eventArray = [];
  var e;
  var evt;
  var i;
  var attr;
  var handlers;
  var callbacks;
  var contexts;
  var attrs;
  var listenEq;

  if (eventType) {
    eventArray = Events._getEvents(eventType);
  } else if (this.eventHandlers !== undefined) {
    // Walk entire eventHandlers property list
    var self = this;
    Object.keys(this.eventHandlers || {}).forEach(function (event) {
      if (Object.prototype.hasOwnProperty.call(self.eventHandlers, event)) {
        eventArray.push({ event: event });
      }
    });
  }

  for (e = 0; e < eventArray.length; e += 1) {
    evt = eventArray[e].event;
    attr = eventArray[e].attribute;
    if (this.eventHandlers !== undefined && this.eventHandlers[evt] instanceof Array) {
      handlers = this.eventHandlers[evt];
      for (i = handlers.length - 1; i >= 0; i -= 1) {
        callbacks =
          callback === undefined || callback === null || handlers[i].callback === callback;

        contexts = context === undefined || context === null || handlers[i].context === context;
        attrs = attr === undefined || attr === null || handlers[i].attribute === attr;
        listenEq = listen === undefined || listen === null || handlers[i].listen === listen;
        if (callbacks && contexts && attrs && listenEq) {
          handlers.splice(i, 1);
        }
      }
      if (handlers.length === 0) {
        // Delete the entry
        delete this.eventHandlers[evt];
      }
    }
  }
};

/**
 * @private
 */
Events._removeHandler = function (handlers, handler) {
  var i;
  var callbacks;
  var contexts;
  var attrs;
  var listenEq;
  var onceEq;

  if (handlers) {
    for (i = handlers.length - 1; i >= 0; i -= 1) {
      callbacks =
        handler.callback === undefined ||
        handler.callback === null ||
        handlers[i].callback === handler.callback;

      contexts =
        handler.context === undefined ||
        handler.context === null ||
        handlers[i].context === handler.context;
      attrs =
        handler.attribute === undefined ||
        handler.attribute === null ||
        handlers[i].attribute === handler.attribute;
      listenEq =
        handler.listen === undefined ||
        handler.listen === null ||
        handlers[i].listen === handler.listen;
      onceEq =
        handler.once === undefined || handler.once === null || handlers[i].once === handler.once;
      if (callbacks && contexts && attrs && listenEq && onceEq) {
        handlers.splice(i, 1);
      }
    }
  }
};

/**
 * @private
 */
Events._getEvents = function (eventString) {
  var eventList = eventString ? eventString.split(' ') : [];
  var retList = [];
  var i;
  var eventWithAttr;
  var name;
  var attr;

  for (i = 0; i < eventList.length; i += 1) {
    eventWithAttr = eventList[i].split(':');
    name = eventWithAttr[0];
    attr = eventWithAttr.length > 1 ? eventWithAttr[1] : null;
    retList.push({ event: name, attribute: attr });
  }
  return retList;
};

/**
 * @private
 */
Events._handlersIdentical = function (handler1, handler2) {
  return (
    handler1.callback === handler2.callback &&
    handler1.attribute === handler2.attribute &&
    handler1.context === handler2.context &&
    handler1.listen === handler2.listen &&
    handler1.once === handler2.once
  );
};

/**
 * @private
 */
Events._listenersIdentical = function (listener1, listener2) {
  return (
    listener1.event === listener2.event &&
    listener1.attribute === listener2.attribute &&
    listener1.context === listener2.context &&
    listener1.object === listener2.object
  );
};

/**
 * @private
 */
Events._checkForHandler = function (handlerList, handler, handlerTest) {
  var i;
  if (handlerList === undefined) {
    return -1;
  }

  for (i = 0; i < handlerList.length; i += 1) {
    if (handlerTest(handlerList[i], handler)) {
      return i;
    }
  }
  return -1;
};

/**
 * @private
 */
Events._getHandlers = function (handlers, eventType, original) {
  if (handlers && handlers[eventType] instanceof Array) {
    if (original) {
      return handlers[eventType];
    }
    // Make a copy
    var handlerReturn = [];
    var i;
    for (i = 0; i < handlers[eventType].length; i++) {
      handlerReturn.push(handlers[eventType][i]);
    }
    return handlerReturn;
  }
  return null;
};
oj._registerLegacyNamespaceProp('Events', Events);

/**
 * @constructor
 * @final
 * @class oj.URLError
 * @classdesc Constructs a URLError, thrown when API calls are made that require a URL but no URL is
 * defined.
 * @since 1.0.0
 * @export
 */
const URLError = function () {
  this.name = 'URLError';
  this.message = 'No URL defined';
};
oj._registerLegacyNamespaceProp('URLError', URLError);

URLError.prototype = new Error();
URLError.constructor = URLError;

/**
 * @private
 * @constructor
 */
const RestImpl = function (rootURL, model) {
  this.rootURL = rootURL;
  this.model = model;
  this.customURL = model.customURL;
  $.support.cors = true;
};

oj._registerLegacyNamespaceProp('RestImpl', RestImpl);

RestImpl._HEADER_PROP = 'headers';

// Add the properties in options to starter, if not already there
RestImpl.addOptions = function (starter, options, customOptions) {
  var initial = $.extend(true, starter, customOptions);
  var tempOpt = options || {};
  Object.keys(tempOpt).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(tempOpt, prop) && prop !== 'oauthHeader') {
      if (!Object.prototype.hasOwnProperty.call(initial, prop)) {
        initial[prop] = tempOpt[prop];
      }
      if (prop === RestImpl._HEADER_PROP) {
        // Deep merge
        initial[prop] = $.extend(true, initial[prop], tempOpt[prop]);
      }
    }
  });

  if (options && options.oauthHeader) {
    // if there are no any headers then create a new one.
    if (!initial[RestImpl._HEADER_PROP]) initial[RestImpl._HEADER_PROP] = {};
    Object.keys(options.oauthHeader || {}).forEach(function (prop) {
      if (Object.prototype.hasOwnProperty.call(options.oauthHeader, prop)) {
        if (!Object.prototype.hasOwnProperty.call(initial[RestImpl._HEADER_PROP], prop)) {
          initial[RestImpl._HEADER_PROP][prop] = options.oauthHeader[prop];
        }
      }
    });
  }

  return initial;
};

RestImpl.prototype.getRecords = function (callback, errFunc, options, context) {
  var opt = options || {};
  var isJsonp = opt.dataType === 'jsonp';
  var urlInfo = this._getURL('read', this.rootURL, this.customURL, null, context, opt);
  var ajaxOptions = {
    crossDomain: opt.crossDomain || !isJsonp,
    dataType: this._getDataType(opt),
    jsonpCallback: opt.jsonpCallback,
    context: context !== null ? context : this,
    success: callback,
    error: errFunc
  };
  ajaxOptions = this._addHeaderProp(ajaxOptions);
  ajaxOptions = RestImpl.addOptions(ajaxOptions, opt, urlInfo);
  opt.xhr = this.ajax(ajaxOptions, context);
  return opt.xhr;
};

RestImpl.prototype._addHeaderProp = function (options) {
  var opt = options || {};
  if (!(this.model && this.model.omitLanguageHeader)) {
    opt[RestImpl._HEADER_PROP] = { 'Accept-Language': this.getLocale() };
  }
  return opt;
};

RestImpl.prototype.getRecord = function (success, error, recordID, options, context) {
  var opt = options || {};
  var isJsonp = opt.dataType === 'jsonp';
  var urlInfo = this._getURL('read', this.rootURL, this.customURL, recordID, context, opt);
  var ajaxOptions = {
    crossDomain: opt.crossDomain || !isJsonp,
    dataType: this._getDataType(opt),
    jsonpCallback: opt.jsonpCallback,
    context: context !== null ? context : this,
    success: success,
    error: error
  };
  ajaxOptions = this._addHeaderProp(ajaxOptions);
  ajaxOptions = RestImpl.addOptions(ajaxOptions, opt, urlInfo);
  opt.xhr = this.ajax(ajaxOptions, context);
  return opt.xhr;
};

RestImpl.prototype.updateRecord = function (
  callback,
  recordID,
  record,
  error,
  options,
  context,
  patch
) {
  var opt = options || {};
  var isJsonp = opt.dataType === 'jsonp';
  var urlInfo = this._getURL(
    patch ? 'patch' : 'update',
    this.rootURL,
    this.customURL,
    recordID,
    context,
    opt
  );
  var emulateHTTP = RestImpl._emulateHTTP(opt);
  var ajaxOptions = {
    crossDomain: opt.crossDomain || !isJsonp,
    contentType: this._getContentType(opt),
    dataType: this._getDataType(opt),
    jsonpCallback: opt.jsonpCallback,
    data: this._getData(JSON.stringify(record), opt, urlInfo),
    emulateHTTP: emulateHTTP,
    emulateJSON: RestImpl._emulateJSON(opt),
    success: callback,
    error: error,
    context: context !== null ? context : this
  };
  ajaxOptions = this._addHeaderProp(ajaxOptions);
  ajaxOptions = RestImpl.addOptions(ajaxOptions, opt, urlInfo);
  ajaxOptions = RestImpl._beforeSendMod(emulateHTTP, ajaxOptions);
  opt.xhr = this.ajax(ajaxOptions, context);
  return opt.xhr;
};

RestImpl._beforeSendMod = function (emulateHTTP, options) {
  var opt = options || {};
  if (emulateHTTP) {
    // Do a before send xhr mod for this case
    var beforeSend = opt.beforeSend;
    opt.beforeSend = function (xhr) {
      xhr.setRequestHeader('X-HTTP-Method-Override', opt._method);
      if (beforeSend) {
        return beforeSend.apply(this, arguments);
      }
      return null;
    };
  }
  return opt;
};

RestImpl.prototype._getData = function (data, options, urlInfo) {
  if (RestImpl._emulateJSON(options)) {
    // Push record and _method into an object
    var retObj = { _method: urlInfo._method ? urlInfo._method : urlInfo.type };
    if (data) {
      retObj.model = data;
    }
    return retObj;
  }
  return data;
};

RestImpl.prototype._getHTTPMethod = function (operation, options) {
  if (options.type) {
    return { method: options.type };
  }
  var method = null;
  if (operation === 'create') {
    method = 'POST';
  }
  if (operation === 'delete') {
    method = 'DELETE';
  }
  if (operation === 'patch') {
    method = 'PATCH';
  }
  if (operation === 'update') {
    method = 'PUT';
  }
  if (RestImpl._emulateHTTP(options)) {
    // Convert method to POST, put original method under data._method
    return { method: 'POST', _method: method };
  }
  if (method === null) {
    method = 'GET';
  }
  return { method: method };
};

RestImpl._emulateHTTP = function (options) {
  return options.emulateHTTP || oj.emulateHTTP;
};

RestImpl._emulateJSON = function (options) {
  return options.emulateJSON || oj.emulateJSON;
};

RestImpl.prototype._getURL = function (operation, rootURL, customURL, recordID, context, options) {
  var httpMethod = this._getHTTPMethod(operation, options);
  if ($.isFunction(customURL)) {
    var result = customURL.call(
      this,
      operation,
      context,
      RestImpl.SetCustomURLOptions(recordID, context, options)
    );
    if (oj.StringUtils.isString(result)) {
      var ret = { url: result, type: httpMethod.method };
      if (httpMethod._method) {
        ret._method = httpMethod._method;
      }
      return ret;
    } else if (result) {
      result.url = Object.prototype.hasOwnProperty.call(result, 'url') ? result.url : rootURL;
      if (!Object.prototype.hasOwnProperty.call(result, 'type')) {
        result.type = httpMethod.method;
      }
      if (!Object.prototype.hasOwnProperty.call(result, 'data')) {
        if (httpMethod._method) {
          result._method = httpMethod._method;
        }
      }
      return result;
    }
  }
  var retObj = { url: RestImpl.GetPropValue(null, rootURL), type: httpMethod.method };
  if (httpMethod._method) {
    retObj._method = httpMethod._method;
  }
  return retObj;
};

RestImpl.prototype.deleteRecord = function (recordID, error, options, context) {
  var opt = options || {};
  var isJsonp = opt.dataType === 'jsonp';
  var urlInfo = this._getURL('delete', this.rootURL, this.customURL, recordID, context, opt);

  var emulateHTTP = RestImpl._emulateHTTP(opt);
  var emulateJSON = RestImpl._emulateJSON(opt);
  var ajaxOptions = {
    crossDomain: opt.crossDomain || !isJsonp,
    success: opt.success,
    error: error,
    context: context !== null ? context : this,
    emulateHTTP: emulateHTTP,
    emulateJSON: emulateJSON
  };
  var data = this._getData(null, opt, urlInfo);
  if (data) {
    ajaxOptions.data = data;
  }
  ajaxOptions = RestImpl.addOptions(ajaxOptions, opt, urlInfo);
  ajaxOptions = RestImpl._beforeSendMod(emulateHTTP, ajaxOptions);
  opt.xhr = this.ajax(ajaxOptions, context);
  return opt.xhr;
};

RestImpl.prototype.addRecord = function (record, error, options, context) {
  var opt = options || {};
  var recordStr = JSON.stringify(record);
  var isJsonp = opt.dataType === 'jsonp';
  var urlInfo = this._getURL('create', this.rootURL, this.customURL, null, context, opt);

  var emulateHTTP = RestImpl._emulateHTTP(opt);
  var ajaxOptions = {
    crossDomain: opt.crossDomain || !isJsonp,
    contentType: opt.contentType || 'application/json',
    dataType: this._getDataType(opt),
    jsonpCallback: opt.jsonpCallback,
    data: this._getData(recordStr, opt, urlInfo),
    success: opt.success,
    error: error,
    emulateHTTP: emulateHTTP,
    emulateJSON: RestImpl._emulateJSON(opt),
    context: context !== null ? context : this
  };
  ajaxOptions = this._addHeaderProp(ajaxOptions);
  ajaxOptions = RestImpl.addOptions(ajaxOptions, opt, urlInfo);
  opt.xhr = this.ajax(ajaxOptions, context);

  return opt.xhr;
};

RestImpl.prototype._getDataType = function (options) {
  if (RestImpl._emulateJSON(options) && !RestImpl._emulateHTTP(options)) {
    return 'application/x-www-form-urlencoded';
  }
  return options.dataType || 'json';
};

RestImpl.prototype._getContentType = function (options) {
  if (RestImpl._emulateJSON(options) && !RestImpl._emulateHTTP(options)) {
    return 'application/x-www-form-urlencoded';
  }

  return options.contentType || 'application/json';
};

RestImpl.prototype.getLocale = function () {
  return getLocale();
};

RestImpl.prototype.ajax = function (settings, collection) {
  if (settings.url === null || settings.url === undefined) {
    throw new URLError();
  }

  var xhr = oj.ajax(settings);
  if (collection._addxhr) {
    collection._addxhr(xhr);
  }
  return xhr;
};

/**
 * Get all custom URL options
 * @protected
 */
RestImpl.SetCustomURLOptions = function (recordID, context, opt) {
  var options = context instanceof oj.Collection ? context.ModifyOptionsForCustomURL(opt) : {};
  if (recordID) {
    options.recordID = recordID;
  }
  return options;
};

/**
 * @protected
 */
RestImpl.GetPropValue = function (obj, property) {
  if (obj) {
    if ($.isFunction(obj[property])) {
      return obj[property]();
    }

    return obj[property];
  }
  return $.isFunction(property) ? property() : property;
};

/**
 * @export
 * @class Model
 * @classdesc Object representing name/value pairs for a data service record
 *
 * @param {Object=} attributes Initial set of attribute/value pairs with which to seed this Model object
 * @param {Object=} options
 *                  collection: collection for this model
 * @constructor
 * @final
 * @since 1.0
 * @mixes Events
 * @ojsignature {target: "Type", value: "class Model"}
 */
const Model = function (attributes, options) {
  Model._init(this, attributes, options, null);
};

oj._registerLegacyNamespaceProp('Model', Model);

/**
 * Subclass from oj.Object
 * @private
 */
oj.Object.createSubclass(Model, oj.Object, 'oj.Model');

/**
 * @private
 */
Model.prototype.Init = function () {
  Model.superclass.Init.call(this);
};

/**
 *
 * @export
 * @desc Attribute/value pairs in the model.
 * @memberof Model
 *
 * @type Object
 * @since 1.0.0
 */
Model.prototype.attributes = {};

/**
 * @export
 * @desc The set of attribute/value pairs that serve as default values when new Model objects are created.
 * @memberof Model
 *
 * @type Object
 * @since 1.0.0
 */
Model.prototype.defaults = {};

/**
 * @export
 * @desc The model's unique ID.  This can be set by the application or retrieved from the data service. This ID
 * will be appended to the URL for single-record data operations (update, delete).
 * @memberof Model
 *
 * @type {string|null}
 * @since 1.0.0
 */
Model.prototype.id = null;

/**
 * @desc The name of the model property to be used as the unique ID. See [id]{@link Model#id}. This defaults to
 * a value of "id".
 * @memberof Model
 *
 * @type {string|null}
 * @since 1.0.0
 * @export
 */
Model.prototype.idAttribute = 'id';

/**
 * @export
 * @desc The base url on the data service used to perform CRUD operations on models.  If not defined, the model
 * will look to its collection.  One or the other must be defined before CRUD operations can succeed.
 * @memberof Model
 *
 * @type {string|null}
 * @since 1.0.0
 */
Model.prototype.urlRoot = null;

/**
 * @export
 * @desc A callback to allow users to completely customize the data service URLs
 * The callback should accept these parameters:<p>
 * <b>operation (string)</b>: one of "create", "read", "update", "patch", or "delete", indicating the type of
 * operation for which to return the URL<br>
 * <b>model (Object)</b>: the Model object requesting the URL<br>
 * <b>options (Object)</b>: one or more of the following properties:<br>
 * <ul>
 * <b>recordID</b>: id of the record involved, if relevant<br>
 * </ul>
 *
 * customURL callbacks should return either: null, in which case the default will be used; a url string, which
 * will be used with the standard HTTP method for the type of operation, or an Object with with any other
 * attributes that should be passed to the ajax call.<br>
 * This object must at minimum include the URL, and other attributes as follows:<br>
 * <ul>
 * <b>url</b>: giving the custom URL string<br>
 * <b>type</b>: (optional) a string indicating the type of HTTP method to use (GET, POST, DELETE, etc.)<br>
 * <b>(other)</b>: (optional) any other ajax attributes to pass in the ajax call
 * </ul>
 * <p>
 *
 * @memberof Model
 * @type {function(string,Model,Object):(string|Object|null)|null}
 * @ojsignature  {target: "Type", value: "function(string,Model,Model.CustomURLCallbackOptions):(string|Object|null)|null", for: "returns"}
 * @since 1.0.0
 */
Model.prototype.customURL = null;

/**
 * @typedef {Object} Model.CustomURLCallbackOptions
 * @property {string=} recordID id of the record involved, if relevant
 */

/**
 * @export
 * @desc A callback to allow optional custom validation of model attributes during save, set, etc.
 * The callback should accept these parameters:<p>
 * <b>attributes (Object)</b>: the attributes to validation<br>
 * <b>options (Object)</b>: the options passed in to the model call making the validation check<br>
 *
 * The validate callback should return nothing if the attributes are valid, or an error string or object if the validation fails<br>
 * <p>
 *
 * @memberof Model
 * @type {function(Object,Object):(string|Object|null)|null}
 * @since 2.3.0
 */
Model.prototype.validate = null;

/**
 * @export
 * @memberof Model
 * @type {string|Object|null}
 * @desc The last value returned from a validate callback
 * @since 2.3.0
 */
Model.prototype.validationError = null;

/**
 * @export
 * @memberof Model
 *
 * @type {boolean}
 * @desc If true, do not insert the JET locale-based Accept-Language header.  If false, let the Ajax system set the header.
 * @since 5.0.0
 */
Model.prototype.omitLanguageHeader = false;

/**
 * @private
 */
Model._idCount = 0;

/**
 * @private
 */
Model._init = function (model, attributes, opt, properties) {
  var parse;
  var attrCopy;
  var prop;

  if (Model._justExtending) {
    return;
  }

  model.Init(); // eslint-disable-line no-param-reassign

  // Augment with Event
  Events.Mixin(model);

  model._clearChanged(); // eslint-disable-line no-param-reassign
  model.previousAttrs = {}; // eslint-disable-line no-param-reassign
  model.nestedSet = false; // eslint-disable-line no-param-reassign
  model.index = -1; // eslint-disable-line no-param-reassign

  var options = opt || {};

  // Deep copy actual data if found
  model.attributes = {}; // eslint-disable-line no-param-reassign
  if (model.defaults && !options.ignoreDefaults) {
    // eslint-disable-next-line no-param-reassign
    model.attributes = Model._cloneAttributes(
      $.isFunction(model.defaults) ? model.defaults() : model.defaults,
      null
    );
  }

  // First, copy all properties passed in
  // eslint-disable-next-line no-restricted-syntax
  for (prop in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, prop)) {
      model[prop] = properties[prop]; // eslint-disable-line no-param-reassign
    }
  }

  if (attributes) {
    parse = options.parse;
    if ($.isFunction(parse)) {
      model.parse = parse; // eslint-disable-line no-param-reassign
    }

    attrCopy = Model._cloneAttributes(attributes, model.attributes);
    model.attributes = attrCopy; // eslint-disable-line no-param-reassign

    attrCopy = parse ? model.parse(attrCopy) : attrCopy;
    if (attrCopy == null || attrCopy === undefined) {
      // Reset it
      model.attributes = {}; // eslint-disable-line no-param-reassign
    } else {
      // Move them in
      // eslint-disable-next-line no-restricted-syntax
      for (prop in attrCopy) {
        if (Object.prototype.hasOwnProperty.call(attrCopy, prop)) {
          model._setProp(prop, attrCopy[prop], false, false, options, true);
        }
      }
    }
  }

  model.SetCid();

  // Grab collection option, if there
  model.SetCollection(options.collection);

  if (options.customURL) {
    model.customURL = options.customURL; // eslint-disable-line no-param-reassign
  }

  // If URL is set, use that
  if (options.url) {
    model.url = options.url; // eslint-disable-line no-param-reassign
  }

  if (options.urlRoot) {
    model.urlRoot = options.urlRoot; // eslint-disable-line no-param-reassign
  }

  if (model.initialize) {
    model.initialize(attributes, options);
  }

  model.SetupId();
};

/**
 * Create a new, specific type of model object to represent single records from a JSON data set.
 * @param {Object=} properties Properties for the new Model class.<br>
 *                  <b>defaults</b>: an Object containing starting attribute/value pairs for some or all of the
 *                  model's potential attributes<br>
 *                  <b>parse</b>: a user callback function to allow parsing of JSON record objects as they are
 *                  returned from the data service<br>
 *                  <b>parseSave</b>: a user callback function to allow conversion of models back into a format
 *                  appropriate for the data service on save calls<br>
 *                  <b>urlRoot</b>: the URL to use to get records from the data service in the abscence of a
 *                  collection (when an id is appended)<br>
 *                  <b>initialize</b>: a user callback function to be called when this model is created<br>
 *                  <b>validate</b>: a user callback function that will be called before a save to the data
 *                  service occurs. The callback is passed the current set of attributes and save options.
 *                  <br>
 * @param {Object=} classProperties properties that attach to the whole class
 * @return {Model} new Model object
 * @export
 * @ojsignature [{target: "Type",
 *                value: "any",
 *                for: "returns"},
 *               {target: "Type", value:"{parse?: (data: any)=> any, parseSave?: (data: any)=> any, urlRoot?: string,
 *                                        initialize?: (models: Array<Model>, options: object)=> void,
 *                                        validate?: null|object|string|((attributes: object, options?: Model)=> number), [propName: string]: any}", for: "properties"}]
 * @memberof Model
 * @this {Model}
 * @since 1.0.0
 */
Model.extend = function (properties, classProperties) {
  Model._justExtending = true;
  var obj;

  obj = new Model();
  Model._justExtending = false;

  // Add regular properties from this "parent"
  // Events.Mixin(obj, this.prototype);
  $.extend(obj, this.prototype);

  // Grab properties
  var props = properties || {};
  Object.keys(props).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(props, prop)) {
      obj[prop] = props[prop];
    }
  });

  var model;

  if (props && props.constructor && Object.prototype.hasOwnProperty.call(props, 'constructor')) {
    model = props.constructor;
  } else {
    model = function (attributes, options) {
      Model._init(this, attributes, options, props);
    };
  }

  $.extend(model, this);
  model.prototype = obj;

  // Allow extending resulting obj
  model.extend = Model.extend;

  model.prototype.constructor = model;

  // Add class properties from this
  Events.Mixin(model, this);

  if (classProperties) {
    Object.keys(classProperties).forEach(function (prop) {
      if (Object.prototype.hasOwnProperty.call(classProperties, prop)) {
        model[prop] = classProperties[prop];
      }
    });
  }

  return model;
};

/**
 * Placeholder for event mixins
 * @private
 */
Model.prototype.TriggerInternal = function (silent, event, arg1, arg2, options) {}; // eslint-disable-line no-unused-vars

/**
 * @protected
 */
Model.prototype.SetCid = function () {
  // Create cid property if necessary
  if (!this.GetCid()) {
    this.cid = 'id' + Model._idCount;
    Model._idCount += 1;
  }
};

/**
 * @protected
 */
Model.prototype.GetCid = function () {
  return this.cid;
};

/**
 * Index within collection
 * @protected
 */
Model.prototype.SetIndex = function (index) {
  this.index = index;
};

/**
 * @protected
 */
Model.prototype.GetIndex = function () {
  return this.index;
};

/**
 * LRU functions
 * @protected
 */
Model.prototype.SetNext = function (model) {
  var retVal = this.nextModel;
  this.nextModel = model;
  return retVal;
};

/**
 * @protected
 */
Model.prototype.GetNext = function () {
  return this.nextModel;
};

/**
 * @protected
 */
Model.prototype.SetPrevious = function (model) {
  var retVal = this.previousModel;
  this.previousModel = model;
  return retVal;
};

/**
 * @protected
 */
Model.prototype.GetPrevious = function () {
  return this.previousModel;
};

/**
 * Merge the given model's attributes with this model's attributes
 * @protected
 */
Model.prototype.Merge = function (model, comparator, silent) {
  var needSort = false;
  var isStringComparator = oj.StringUtils.isString(comparator);
  var valueChange;
  var changes = false;

  var self = this;
  Object.keys(model.attributes || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(model.attributes, prop)) {
      valueChange = self.attributes[prop] !== model.attributes[prop];
      if (isStringComparator) {
        // We have a string comparator--does it match this property?  If we hit a property that doesn't
        // match, we need sort
        if (prop === comparator) {
          // The property matches the comparator property: are we changing the value?
          if (valueChange) {
            needSort = true;
          }
        }
      } else if (valueChange) {
        needSort = true;
      }
      if (valueChange) {
        changes = true;
        self.attributes[prop] = model.attributes[prop];
        self._addChange(prop, model.attributes[prop]);
        self._fireAttrChange(prop, self.attributes[prop], null, silent);
      }
    }
  });
  this.SetupId();
  // Only fire master change if there were any changes
  if (changes) {
    this._fireChange(null, silent);
  }
  return needSort;
};

/**
 * @private
 */
Model._hasProperties = function (object) {
  if (object && object instanceof Object) {
    var prop;
    // eslint-disable-next-line no-restricted-syntax
    for (prop in object) {
      if (Object.prototype.hasOwnProperty.call(object, prop)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * @protected
 */
Model.prototype.SetCollection = function (coll) {
  if (coll == null) {
    delete this.collection;
    return;
  }
  this.collection = coll;
  // This can depend on the collection
  this.SetupId();
};

/**
 * @protected
 */
Model.prototype.GetCollection = function () {
  return this.collection;
};

/**
 * @private
 */
Model.prototype._fireAttrChange = function (prop, value, options, silent) {
  if (prop != null) {
    this.TriggerInternal(silent, Events.EventType.CHANGE + ':' + prop, this, value, options);
  }
};

/**
 * @private
 */
Model.prototype._fireChange = function (options, silent) {
  this.TriggerInternal(silent, Events.EventType.CHANGE, this, options, null);
};

/**
 * @protected
 */
Model.prototype.SetupId = function () {
  // Replicate id attribute at top level
  var id = null;
  // Ask for collection's function if available
  if (this.collection && this.collection.modelId) {
    var modFunc = this.collection.modelId;
    id = $.isFunction(modFunc) ? modFunc.call(this.collection, this.attributes) : modFunc;
  }
  if (!id) {
    var idAttr = this._getIdAttr();
    id = this.attributes != null ? this.attributes[idAttr] : null;
  }
  // Supposedly this should always be model.id...who knew?
  this.id = id;
};

/**
 * @private
 */
Model.prototype._setPropInternal = function (prop, value, copyRegardless) {
  var equality = oj.Object.__innerEquals(this.attributes[prop], value);
  if (copyRegardless || !equality) {
    this.attributes[prop] = value;
    this.SetupId();
    // Return value management here seems bizarre due to backbone tests: do the direct set if copyRegardless,
    // but only return if the inner equals was different
    return !equality;
  }
  return false;
};

/**
 * @private
 */
Model.prototype._clearChanged = function () {
  this.changed = {};
};

/**
 * @private
 */
Model.prototype._addChange = function (property, value) {
  this.changed[property] = value;
};

/**
 * @ignore
 * @private
 * @param {Object|string} prop
 * @param {Object|null|undefined} value
 * @param {boolean} copyRegardless
 * @param {boolean} propertyBag
 * @param {Object} options
 * @param {boolean} init
 * @returns {boolean}
 */
Model.prototype._setProp = function (prop, value, copyRegardless, propertyBag, options, init) {
  if (prop == null) {
    return true;
  }

  var attrs = {};
  var isNested = this.nestedSet;
  var opts;

  if (!propertyBag) {
    attrs[prop] = value;
  } else {
    // We've passed in a whole property bag at once: validate all together
    Object.keys(prop).forEach(function (p) {
      if (Object.prototype.hasOwnProperty.call(prop, p)) {
        attrs[p] = prop[p];
      }
    });
  }
  opts = options || {};

  if (!this._checkValid(attrs, { validate: opts.validate }, false)) {
    return false;
  }

  if (!isNested) {
    this._clearChanged();
    this.changes = [];
  }

  // Store old value
  if (!this.nestedSet && !init) {
    this.previousAttrs = Model._cloneAttributes(this.attributes, null);
  }

  this.nestedSet = true;
  var self = this;
  Object.keys(attrs).forEach(function (p) {
    if (Object.prototype.hasOwnProperty.call(attrs, p)) {
      if (self._setPropInternal(p, attrs[p], copyRegardless)) {
        // Trigger changes
        self._addChange(p, attrs[p]);
        self.changes.push(p);
      } else {
        delete attrs[p];
      }
    }
  });
  // Fire events: don't fire if silent
  var silent = opts.silent;
  Object.keys(attrs).forEach(function (p) {
    if (Object.prototype.hasOwnProperty.call(attrs, p)) {
      if (!silent && (self.changes.length > 0 || (isNested && self.changes.indexOf(p) === -1))) {
        self.pendingChanges = true;
        self.pendingOpts = opts;
      }
      self._fireAttrChange(p, attrs[p], opts, silent);
    }
  });

  if (isNested) {
    return true;
  }
  if (!silent && !isNested) {
    while (this.pendingChanges) {
      this.pendingChanges = false;
      this._fireChange(this.pendingOpts, silent);
    }
  }

  this.nestedSet = false;
  return true;
};

/**
 * Clears all attributes from the model<br>
 * Events:<p>
 * <ul>
 * <b>change:attr</b>: fired for each attribute cleared, passing the model, name of the changed property, and
 * options<br>
 * <b>change:all</b>: fired after all attributes have been cleaered, passing the model and options<br>
 * </ul>
 * <p>
 *
 * @param {Object=} options
 * @property {boolean=} silent if true, do not fire events
 * @property {boolean=} validate if true, validate the unsetting of all properties
 * @return {Model|boolean} the model, or false if validation on clear fails
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.clear = function (options) {
  // Use unset to silently clear, to track changes to attributes
  var unsetOpt = { silent: true };
  var silent;
  var p;
  var opt = options || {};
  silent = opt.silent;
  unsetOpt.validate = opt.validate;
  this._clearChanged();

  var self = this;
  // eslint-disable-next-line no-restricted-syntax
  for (p in self.attributes) {
    if (Object.prototype.hasOwnProperty.call(self.attributes, p)) {
      if (!this._unsetInternal(p, unsetOpt, true)) {
        return false;
      }
      this.TriggerInternal(silent, Events.EventType.CHANGE + ':' + p, this, undefined, null);
    }
  }
  this.attributes = {};
  this.SetupId();

  this._fireAttrChange(null, null, null, silent);
  this._fireChange(null, silent);
  return this;
};

/**
 * @private
 */
Model._cloneAttributes = function (oldData, nd) {
  var newData = nd || {};

  // Handle not overwriting defaults with undefined
  // IE11 issue with Object.keys
  var newDataKeys = typeof newData === 'object' ? Object.keys(newData) : [];

  var canUseJson = true;

  var prop;
  if (newDataKeys.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (prop in newData) {
      if (
        Object.prototype.hasOwnProperty.call(newData, prop) &&
        Object.prototype.hasOwnProperty.call(oldData, prop)
      ) {
        // They both have this: now is oldData undefined?
        if (oldData[prop] === undefined) {
          // Remove it so it doesn't get copied/overwritten
          delete oldData[prop]; // eslint-disable-line no-param-reassign
        }
      }
    }
    oj.CollectionUtils.copyInto(newData, oldData, undefined, true, 10000);
    return newData;
  }
  var type;
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (prop in oldData) {
    type = $.type(oldData[prop]);
    if (
      type === 'function' ||
      type === 'undefined' ||
      type === 'date' ||
      type === 'array' ||
      type === 'object'
    ) {
      canUseJson = false;
      break;
    }
  }

  if (canUseJson) {
    newData = JSON.parse(JSON.stringify(oldData));
  } else if (typeof oldData === 'object') {
    // IE11 issue with Object.keys
    oj.CollectionUtils.copyInto(newData, oldData, undefined, true, 10000);
  }
  return newData;
};

/**
 * Return a copy of the model with identical attributes and settings
 * @return {Model} copy of the model
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.clone = function () {
  var c = new this.constructor();
  var prop;

  // eslint-disable-next-line no-restricted-syntax
  for (prop in this) {
    // Shallow copy all but data
    if (Object.prototype.hasOwnProperty.call(this, prop) && this[prop] !== this.attributes) {
      c[prop] = this[prop];
    }
  }
  // Deep copy data
  c.attributes = Model._cloneAttributes(this.attributes, null);

  // Remove the cid--this should be unique
  delete c.cid;
  // Set a new cid
  c.SetCid();

  c.SetupId();

  return c;
};

/**
 * Does this model match the given id or cid?
 * @protected
 */
Model.prototype.Match = function (id, cid) {
  var modId = this.GetId();
  var modCid;
  // eslint-disable-next-line eqeqeq
  if (modId !== undefined && modId == id) {
    return true;
  }
  modCid = this.cid;
  // eslint-disable-next-line eqeqeq
  if (modCid !== undefined && modCid == cid) {
    return true;
  }
  return false;
};

/**
 * Set the value(s) of one or more attributes of the model, and fire events.
 * Events:<p>
 * <ul>
 * <b>change:attr</b>: fired for each attribute set, passing the model, name of the changed property, and options<br>
 * <b>change:all</b>: fired after all attributes have been set, passing the model and options<br>
 * </ul>
 * <p>
 * @param {string|Object} property Property attribute name to set, or an Object containing attribute/value pairs
 * @param {Object=} value Value for property if property is not an Object containing attribute/value pairs
 * @param {Object=} options
 * @property {boolean=} silent prevent events from firing
 * @property {boolean=} unset delete all the properties passed in rather than setting them<br>
 * @returns {Model|boolean} the model itself, false if validation failed on set
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.set = function (property, value, options) {
  var opts = options || {};
  var prop;
  var valid = true;

  if (arguments && arguments.length > 0) {
    // Check if first arg is not a string (property name)
    if (!oj.StringUtils.isString(property)) {
      // Options, if present, must be second argument...value, because a string/value
      // pair wasn't what was passed in
      opts = value || {};
      // For set, pass entire thing to setProp
      if (opts.unset) {
        // eslint-disable-next-line no-restricted-syntax
        for (prop in property) {
          if (Object.prototype.hasOwnProperty.call(property, prop)) {
            this._unsetInternal(prop, null, false);
          }
        }
      } else if (!this._setProp(property, null, true, true, opts, false)) {
        valid = false;
      }
    } else if (opts.unset) {
      // Not a property bag?  We assume it's a property/value argument
      this._unsetInternal(property, null, false);
    } else if (!this._setProp(property, value, false, false, opts, false)) {
      valid = false;
    }
  }
  if (valid) {
    return this;
  }
  return false;
};

/**
 * Deletes the given property from the model.<br>
 * Events:<p>
 * <ul>
 * <b>change:attr</b>: fired for each attribute unset: passing the model, name of the changed property, and
 * options<br>
 * <b>change:all</b>: fired after all attributes have been unset: passing the model and options<br>
 * @param {string} property Property to remove from model
 * @param {Object=} options
 * @property {boolean=} silent do not fire change events if true
 * @returns {boolean} false if validation of the unset fails
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.unset = function (property, options) {
  return this._unsetInternal(property, options, false);
};

/**
 * @private
 */
Model.prototype._unsetInternal = function (property, opts, clear) {
  var options = opts || {};
  var silent = options.silent;
  var attrs = {};

  if (this.has(property)) {
    if (!this._checkValid(attrs, options, false)) {
      return false;
    }
    if (!clear) {
      this._clearChanged();
    }

    delete this.attributes[property];
    this._addChange(property, undefined);
    this._fireAttrChange(property, null, null, silent);
    this._fireChange(null, silent);
  }
  this.SetupId();
  return true;
};

/**
 * Returns the value of a property from the model.
 * @param {string} property Property to get from model
 * @return {any} value of property
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.get = function (property) {
  return this.attributes[property];
};

/**
 * Determines if the Model has a certain property set, vs. undefined.
 * @param {string} property Property to check for
 * @return {boolean} true if the model contains the given property, false if undefined.
 * @memberof Model
 * @export
 */
Model.prototype.has = function (property) {
  return oj.Collection._defined(this.attributes[property]);
};

/**
 * Loads the Model object from the data service URL. Performs a data "read."<br>
 * Events:<p>
 * <ul>
 * <b>request</b>: fired when the request to fetch is going to the server, passing the model, xhr object, and
 * options<br>
 * <b>sync</b>: fired when the model is fetched from the data service, passing the model and the raw response<br>
 * <b>error</b>: fired if there is an error during the fetch, passing the model, xhr ajax object, and options<br>
 * </ul>
 * <p>
 * @param {Object=} options Options to control fetch<p>
 * <b>success</b>: a user callback called when the fetch has completed successfully. This makes the fetch an
 * asynchronous process. The callback is called passing the Model object, raw response, and the fetch options
 * argument.<p>
 * <b>error</b>: a user callback function called if the fetch fails. The callback is called passing the model
 * object, error, options, xhr, and status.<p>
 * @return {Object} xhr ajax object, by default.  If [sync]{@link Model#sync} has been replaced, this would be
 * the value returned by the custom implementation.
 * @memberof Model
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{success?: (model: Model, response: any, options: object)=> void,
 *                                                  error?: (model: Model, error: any, options: object, xhr: any, status: any)=> void,
 *                                                  [propName: string]: any}", for: "options"}
 * @export
 */
Model.prototype.fetch = function (options) {
  var tempOpts = options || {};
  var success = tempOpts.success;
  var userErr = tempOpts.error;
  var self = this;
  var opts;

  opts = Model._copyOptions(tempOpts);
  opts.error = function (xhr, status, err) {
    // Trigger an error event
    Model._triggerError(self, false, tempOpts, status, err, xhr);

    if (userErr) {
      userErr.apply(self, [self, err, options, xhr, status]);
    }
  };

  opts.success = function (response) {
    // Make sure we pass xhr
    if (opts.xhr) {
      tempOpts.xhr = opts.xhr;
    }
    Model._fireSyncEvent(self, response, opts, false);

    if ($.isFunction(self.parse)) {
      self.set(self.parse(response), opts);
    }
    if (success) {
      success.call(Model.GetContext(opts, self), self, response, tempOpts);
    }
  };
  return Model._internalSync('read', this, opts);
};

/**
 * @private
 */
Model.prototype._parseImpl = function (rawData) {
  return rawData;
};

/**
 * Optional callback to parse responses from the server.  It is called with the server's response with a model's data and should return a response (possibly modified) for processing
 * @type {function(Object):Object}
 *
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.parse = Model.prototype._parseImpl;

/**
 * Return the URL used to access this model in the data source
 *
 * @returns {string|null} url to access this model in the data source
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.url = function () {
  var urlRoot = this._getUrlRoot();
  var id = this.GetId();
  var coll;
  var collUrl;
  var slash;

  if (urlRoot) {
    return id ? urlRoot + '/' + encodeURIComponent(id) : urlRoot;
  }

  coll = this.collection;
  if (coll) {
    collUrl = RestImpl.GetPropValue(coll, 'url');
    if (id && collUrl) {
      slash = Model._getLastChar(collUrl) === '/' ? '' : '/';
      return collUrl + slash + encodeURIComponent(this.GetId());
    }
    return collUrl;
  }

  throw new URLError();
};

/**
 * Return all of the model's attributes as an array
 *
 * @returns {Array.<Object>} array of all the model's attributes
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.keys = function () {
  var retArray = [];
  var self = this;

  Object.keys(self.attributes || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(self.attributes, prop)) {
      retArray.push(prop);
    }
  });
  return retArray;
};

/**
 * Return all of the model's attributes values as an array
 *
 * @returns {Array.<Object>} array of all the model's attributes values
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.values = function () {
  var retArray = [];
  var self = this;

  Object.keys(self.attributes || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(self.attributes, prop)) {
      retArray.push(self.get(prop));
    }
  });
  return retArray;
};

/**
 * Return an array of attributes/value pairs found in the model
 *
 * @returns {Array.<Object>} returns the model's attribute/value pairs as an array
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.pairs = function () {
  var retObj = [];
  var item;
  var self = this;

  Object.keys(self.attributes || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(self.attributes, prop)) {
      item = [];
      item.push(prop);
      item.push(self.get(prop));
      retObj.push(item);
    }
  });
  return retObj;
};

/**
 * Return attribute/value pairs for the model minus those attributes listed in keys
 *
 * @param {Array.<Object>|Object} keys keys to exclude from the returned attribute/value pairs
 *
 * @returns {Object} array of the model's attribute/value pairs except those listed in keys
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.omit = function (keys) {
  var keyArr = [];
  var i;
  var retObj = {};

  if (keys instanceof Array) {
    keyArr = keys;
  } else {
    for (i = 0; i < arguments.length; i++) {
      keyArr.push(arguments[i]);
    }
  }
  var self = this;

  Object.keys(self.attributes || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(self.attributes, prop)) {
      if (keyArr.indexOf(prop) === -1) {
        retObj[prop] = self.get(prop);
      }
    }
  });
  return retObj;
};

/**
 * Return attribute/value pairs for the model for the keys
 *
 * @param {Array.<Object>|Object} keys keys for which to return attribute/value pairs
 *
 * @returns {Array.<Object>} array of the model's attribute/value pairs filtered by keys
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.pick = function (keys) {
  var keyArr = [];
  var i;
  var retObj = {};

  if (keys instanceof Array) {
    keyArr = keys;
  } else {
    for (i = 0; i < arguments.length; i++) {
      keyArr.push(arguments[i]);
    }
  }
  for (i = 0; i < keyArr.length; i++) {
    if (Object.prototype.hasOwnProperty.call(this.attributes, keyArr[i])) {
      retObj[keyArr[i]] = this.get(keyArr[i]);
    }
  }
  return retObj;
};

/**
 * Return an array of value/attribute pairs found in the model
 *
 * @returns {Object} returns the model's value/attribute pairs as an array
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.invert = function () {
  var retObj = {};
  var val;
  var self = this;

  Object.keys(self.attributes || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(self.attributes, prop)) {
      val = self.get(prop);
      retObj[val] = prop;
    }
  });
  return retObj;
};

/**
 * @private
 */
Model._getLastChar = function (str) {
  return str.charAt(str.length - 1);
};

/**
 * @private
 */
Model.prototype._saveUrl = function () {
  var urlRoot = this._getUrlRoot();
  if (urlRoot) {
    return urlRoot;
  }

  if (this.GetCollection()) {
    return this.GetCollection().url;
  }

  return null;
};

/**
 * @private
 */
Model.prototype._getUrlRoot = function () {
  return RestImpl.GetPropValue(this, 'urlRoot');
};

/**
 * @private
 */
Model.prototype._parseSaveImpl = function (modelData) {
  return modelData;
};

/**
 * Callback function when writing a model to the server
 * @type {function(Object):Object}
 * @since 1.0.0
 * @memberof Model
 *
 * @export
 */
Model.prototype.parseSave = Model.prototype._parseSaveImpl;

/**
 * Check to see if the model is valid by running the validate callback, if it is set
 *
 * @returns {boolean} true if validate passes or if no validate callback
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.isValid = function () {
  var options = { validate: this.validate };
  return this._checkValid(this.attributes, options, false);
};

/**
 * @private
 */
Model._isValidateSet = function (opt, save) {
  var options = opt || {};
  if (options.validate !== undefined && options.validate !== null) {
    return options.validate;
  }
  // The "default" is different for save vs. set
  return save;
};

/**
 * @private
 */
Model.prototype._checkValid = function (attributes, opt, save) {
  var options = opt || {};
  var validate = this.validate;
  if (validate && Model._isValidateSet(options, save)) {
    // If we have a validate override and it returns something, don't save
    this.validationError = validate.call(this, attributes, options);
    if (this.validationError) {
      this.TriggerInternal(false, Events.EventType.INVALID, this, this.validationError, options);
      return false;
    }
  }
  return true;
};

/**
 * @private
 */
Model._processArgs = function (args) {
  var ignoreLastArg = false;
  var options = {};
  var attributes = {};
  var i;

  if (args) {
    if (args.length > 0) {
      // Check if the last argument is not the first argument
      if (args.length > 1) {
        if (args[args.length - 1] && Model._hasProperties(args[args.length - 1])) {
          // Last arg is options: ignore later
          ignoreLastArg = true;
          options = args[args.length - 1] || {};
        }
      }
      if (args[0] == null) {
        return { attributes: null, options: options };
      }

      // Check if first arg is property bag
      if (Model._hasProperties(args[0]) || oj.Object.isEmpty(args[0])) {
        Object.keys(args[0]).forEach(function (prop) {
          if (Object.prototype.hasOwnProperty.call(args[0], prop)) {
            attributes[prop] = args[0][prop];
          }
        });
      } else {
        // Not a property bag?  We assume arguments are a series of attr/values
        for (i = 0; i < args.length; i += 2) {
          // Process the arg as long as its: defined, and isn't the last argument where we're supposed to
          // ignore the last argument due to it being 'options'
          if (
            args[i] !== undefined ||
            i < args.length - 1 ||
            (!ignoreLastArg && i === args.length - 1)
          ) {
            attributes[args[i]] = args[i + 1];
          }
        }
      }
    }
  }
  return { attributes: attributes, options: options };
};

/**
 * @private
 */
Model._copyOptions = function (opt) {
  var optReturn = {};
  var options = opt || {};

  Object.keys(options).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      optReturn[prop] = options[prop];
    }
  });
  return optReturn;
};

/**
 * @private
 */
Model._triggerError = function (self, silent, opt, status, err, xhr) {
  var options = opt || {};
  options.textStatus = status;
  options.errorThrown = err;
  self.TriggerInternal(silent, Events.EventType.ERROR, self, xhr, options);
};

/**
 * Saves the current Model object to the data service. Performs a data "update."<br>
 * Events:<p>
 * <ul>
 * <b>change:attr</b>: fired for each attribute changed, if passed in as part of the save: passing the model, name
 * of the changed property, and options<br>
 * <b>change:all</b>: fired after all attributes have been set, if passed in as part of the save: passing the
 * model and options<br>
 * <b>request</b>: fired when the request to save is going to the server, passing the model, xhr object, and
 * options<br>
 * <b>sync</b>: fired when the model is saved to the data service, passing the model and the raw response<br>
 * <b>error</b>: fired if there is an error during the save, passing the model, xhr ajax object, and options<br>
 * </ul>
 * <p>
 * @param {Object=} attributes One or more attribute name/value pairs to set on the model before the save.
 * @param {Object=} options Options to control save<br>
 * <b>success</b>: a user callback called when the save has completed successfully. This makes the save an
 * asynchronous process. The callback is called passing the Model object, response from the AJAX call, and the
 * fetch options argument.<p>
 * <b>error</b>: a user callback function called if the save fails. <p>
 * <b>contentType</b>: in case the user's REST service requires a different POST content type than the default,
 * 'application/json'<p>
 * <b>validate</b>: should the validation routine be called if available<p>
 * <b>wait</b>: if true, wait for the server call before setting the attributes on the model<p>
 * <b>patch</b>: should only changed attributes be sent via a PATCH?<p>
 * <b>attrs</b>: pass a set of attributes to completely control the set of attributes that are saved to the
 * server (generally used with patch)
 * @return {Object|boolean} returns false if validation failed, or the xhr object
 * @memberof Model
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{success?: (model: Model, response: any, options: object)=> void,
 *                                                  error?: (model: Model, error: any, options: object, xhr: any, status: any)=> void,
 *                                                  contentType?: string, valdiate?: boolean, wait?: boolean, patch?: boolean, attrs?: object,
 *                                                  [propName: string]: any}", for: "options"}
 * @export
 */
Model.prototype.save = function (attributes, options) {
  var forceNew;
  var success;
  var callback;
  var self;
  var userErr;
  var patch;
  var argResults = Model._processArgs(arguments);
  var opts;
  var oldAttrs;
  var attrArgs;
  attrArgs = attributes === undefined ? undefined : argResults.attributes;

  var tempOpts = options || {};
  opts = Model._copyOptions(argResults.options);

  var validAttrs = $.extend(true, {}, this.attributes, attrArgs);
  if (!this._checkValid(validAttrs, opts, true)) {
    return false;
  }

  if (!opts.wait) {
    this.set(attrArgs);
  }

  forceNew = opts.forceNew === undefined ? false : opts.forceNew;
  self = this;
  userErr = opts.error;
  patch = opts.patch;

  opts.error = function (xhr, status, err) {
    // Trigger an error event
    Model._triggerError(self, false, tempOpts, status, err, xhr);

    if (userErr) {
      userErr.apply(self, [self, err, options, xhr, status]);
    }
  };

  opts.saveAttrs = opts.wait ? this._attrUnion(attrArgs) : this.attributes;

  // Must temporarily at least set attrs for toJSON()
  oldAttrs = this.attributes;
  // Swap in what's to be saved and call toJSON()
  this.attributes = opts.saveAttrs;
  opts.saveAttrs = this.toJSON();
  this.attributes = oldAttrs;

  if (!forceNew && !this.isNew()) {
    success = opts.success;
    opts.success = function (resp) {
      var attrs;

      // Make sure we pass xhr
      if (opts.xhr) {
        tempOpts.xhr = opts.xhr;
      }

      if (resp && !oj.Object.isEmpty(resp)) {
        if ($.isFunction(self.parse)) {
          attrs = self.parse(resp);
        } else {
          attrs = resp;
        }

        self.attributes = $.extend(true, self.attributes, attrs);

        // Merge attrs from response/parse into arg attrs if different--server takes priority in case
        // of 'wait'
        if (opts.wait) {
          Object.keys(attrArgs || {}).forEach(function (prop) {
            if (Object.prototype.hasOwnProperty.call(attrs, prop)) {
              // Prioritize the one in attrs
              attrArgs[prop] = attrs[prop];
            }
          });
        }
        self.SetupId();
      }
      Model._fireSyncEvent(self, resp, opts, false);

      if (opts.wait) {
        self.set(attrArgs);
      }

      if (success) {
        success.call(Model.GetContext(opts, self), self, resp, tempOpts);
      }
      self._clearChanged();
    };
    // If caller passes in attrs themselves, just use those
    if (!opts.attrs) {
      if (attrArgs === undefined) {
        opts.attrs = undefined;
      } else {
        opts.attrs = patch ? attrArgs : opts.saveAttrs;
      }
    }
    return Model._internalSync(patch ? 'patch' : 'update', this, opts);
  }

  callback = Model._getSuccess(opts);
  opts.success = function (resp) {
    var attrs;
    // Make sure we pass xhr
    if (opts.xhr) {
      tempOpts.xhr = opts.xhr;
    }
    if (resp && !oj.Object.isEmpty(resp)) {
      if ($.isFunction(self.parse)) {
        attrs = self.parse(resp);
      } else {
        attrs = resp;
      }
      if (!self._checkValid(attrs, opts, true)) {
        return;
      }

      self.attributes = $.extend(true, self.attributes, attrs);

      // Merge attrs from response/parse into arg attrs if different--server takes priority in case of 'wait'
      if (opts.wait) {
        Object.keys(attrArgs || {}).forEach(function (prop) {
          if (Object.prototype.hasOwnProperty.call(attrs, prop)) {
            // Prioritize the one in attrs
            attrArgs[prop] = attrs[prop];
          }
        });
      }
      self.SetupId();
    }
    Model._fireSyncEvent(self, resp, opts, false);
    if (opts.wait) {
      self.set(attrArgs);
    }

    if (callback) {
      callback.call(Model.GetContext(opts, self), self, resp, tempOpts);
    }
    self._clearChanged();
  };

  // If caller passed in attrs, just use those
  if (!opts.attrs) {
    opts.attrs = opts.saveAttrs;
  }

  // Turn on parse flag
  opts.parse = true;

  // Bizarre case tested by backboneJS--if this is a new model, but we're patching, make sure we only save the
  // explicit attrs if passed in by user
  if (patch) {
    opts.saveAttrs = opts.attrs;
  }
  return Model._internalSync('create', this, opts);
};

/**
 * @private
 */
Model.prototype._attrUnion = function (attrs) {
  var attrReturn = {};
  var self = this;

  Object.keys(self.attributes || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(self.attributes, prop)) {
      attrReturn[prop] = self.attributes[prop];
    }
  });
  Object.keys(attrs || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(attrs, prop)) {
      attrReturn[prop] = attrs[prop];
    }
  });
  return attrReturn;
};

/**
 * @protected
 */
Model.IsComplexValue = function (val) {
  return (
    val &&
    Object.prototype.hasOwnProperty.call(val, 'value') &&
    Object.prototype.hasOwnProperty.call(val, 'comparator')
  );
};

/**
 * Does this model contain all of the given attribute/value pairs?
 * @private
 */
Model.prototype._hasAttrs = function (attrs) {
  var prop;

  // eslint-disable-next-line no-restricted-syntax
  for (prop in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, prop)) {
      if (!Object.prototype.hasOwnProperty.call(this.attributes, prop)) {
        return false;
      }

      var val = Array.isArray(attrs[prop]) ? attrs[prop] : [attrs[prop]];
      for (var i = 0; i < val.length; i++) {
        if (Model.IsComplexValue(val[i])) {
          var comparator = val[i].comparator;
          var value = val[i].value;
          if (oj.StringUtils.isString(comparator)) {
            throw new Error('String comparator invalid for local where/findWhere');
          }
          if (!comparator(this, prop, value)) {
            return false;
          }
        } else if (attrs[prop] !== this.attributes[prop]) {
          // Array case meaningless here.  Model can't be == value1 and value2
          return false;
        }
      }
    }
  }
  return true;
};

/**
 * Return a function that determines if this model contains all of the property/values in attrs
 *
 * @param {Object} attrs property/value pairs
 * @returns {function(Model):boolean} function taking an Model that returns true if all of attrs are contained within it
 * @memberof Model
 * @since 1.1.0
 * @export
 */
Model.prototype.matches = function (attrs) {
  return (function (model) {
    // eslint-disable-next-line no-restricted-syntax
    for (var prop in attrs) {
      if (model.get(prop) !== attrs[prop]) {
        return false;
      }
    }
    return true;
  })(this);
};

/**
 * See if this model contains any of the given attribute/value pairs
 * @protected
 */
Model.prototype.Contains = function (attrs) {
  var attrList = attrs.constructor === Array ? attrs : [attrs];
  var i;

  for (i = 0; i < attrList.length; i++) {
    if (this._hasAttrs(attrList[i])) {
      return true;
    }
  }
  return false;
};

/**
 * @private
 */
Model._getSuccess = function (options) {
  return options != null && options.success ? options.success : null;
};

/**
 * @protected
 */
Model.GetContext = function (options, model) {
  if (options !== undefined && options.context !== undefined) {
    return options.context;
  }
  return model;
};

/**
 * Determines if this model object has been assigned an id value yet. This indicates whether or not the model's
 * data has been saved to or fetched from the data service at any point.
 * @returns {boolean} true if the Model object has not had its id set yet, false if not.
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.isNew = function () {
  return this.GetId() === undefined;
};

/**
 * @private
 */
Model.prototype._getIdAttr = function () {
  return this.idAttribute || 'id';
};

/**
 * @protected
 */
Model.prototype.GetId = function () {
  return this.id;
};

/**
 * Return the set of attributes and values that have changed since the last set.  Note that a Model.fetch() uses
 * set to store the returned attribute data. If attribute/value pairs are passed in, check those to see if they're
 * different than the model.
 * Return false if there were no changes
 * @param {Object=} attributes One or more attribute/value pairs to check against the model for changes
 * @return {Object|boolean} the set of all attribute value pairs that have changed since last set, if no
 * attributes passed in; the set of all attribute value pairs that are different than those listed in the
 * attributes parameter, if present.  False if no changes
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.changedAttributes = function (attributes) {
  if (attributes) {
    var internalChanges = {};
    var self = this;
    Object.keys(attributes).forEach(function (prop) {
      if (Object.prototype.hasOwnProperty.call(attributes, prop)) {
        if (!oj.Object.__innerEquals(attributes[prop], self.attributes[prop])) {
          internalChanges[prop] = attributes[prop];
        }
      }
    });
    return oj.Object.isEmpty(internalChanges) ? false : internalChanges;
  }
  return oj.Object.isEmpty(this.changed) ? false : this.changed;
};

/**
 * Return true if the Model object has had any changes made to its values, or if any changes have been made to
 * the optional attribute passed in.
 * @param {string=} attribute attribute to check for changes
 * @returns {boolean} true if the Model object has had any changes since retrieval or last update at all (if no
 * attributes parameter); true if the Model object has had changes to the passed-in attribute
 * since retrieval or last update (if attribute parameter present).
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.hasChanged = function (attribute) {
  if (attribute !== undefined) {
    return (
      Model._hasProperties(this.changed) &&
      Object.prototype.hasOwnProperty.call(this.changed, attribute)
    );
  }
  return Model._hasProperties(this.changed);
};

/**
 * Delete the record represented by this model object from the data service.  If the server responds with virtual
 * mode response properties (such as totalResults), these will be picked up at the end of the delete by the
 * model's collection.  Note that by default, the delete isn't sent with an HTTP data type so the object
 * returning these properties needs to be a string version of the JSON object.<br>
 * Events:<p>
 * <ul>
 * <b>destroy</b>: fired when the model is destroyed, either before or after the server call, depending on the
 * setting of wait.  The model and model's collection are passed in<br>
 * <b>request</b>: fired right as the call is made to request the server delete the model.  Passes the model,
 * xhr ajax object, and options.<br>
 * <b>sync</b>: fired after the server succeeds in destroying the model.  Passes the model, the raw response data,
 * and options.
 * </ul>
 * @param {Object=} options Options for the destroy operation:<br>
 * <b>wait</b>: if true, wait until the server is done to fire the destroy event.  Otherewise, fire immediately
 * and regardless of success or failure<br>
 * <b>success</b>: callback function called if the server call succeeds, passing the model, response data, and
 * options<br>
 * <b>error</b>: callback function on failure of the server call, firing an error event and passing the model,
 * xhr, status, and error values.<br>
 * @return {boolean}
 * @memberof Model
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{success?: (model: Model, response: any, options: object)=> void,
 *                                                  error?: (model: Model, xhr: any, options: object)=> void,
 *                                                  wait?: boolean, [propName: string]: any}", for: "options"}
 * @export
 */
Model.prototype.destroy = function (options) {
  var tempOpt = options || {};
  var isWait = tempOpt.wait;
  var callback;
  var userErr = tempOpt.error;
  var self = this;
  var xhr;
  var opts;

  opts = Model._copyOptions(tempOpt);
  callback = Model._getSuccess(opts);
  // Grab the collection off the model in case we need to update
  var collection = this.GetCollection();

  opts.success = function (data) {
    // Make sure we pass xhr
    if (opts.xhr) {
      tempOpt.xhr = opts.xhr;
    }

    // Give an opportunity to update any collection paging properties, like totalResults due to this destroy
    if (collection) {
      // Make sure to parse the data if necessary
      var props =
        oj.StringUtils.isString(data) && !oj.StringUtils.isEmpty(data) ? JSON.parse(data) : data;

      collection._setPagingReturnValues(props, null, data, true);
    }
    if (isWait) {
      self._fireDestroy(false);
    }
    Model._fireSyncEvent(self, data, opts, false);

    if (callback) {
      callback.call(Model.GetContext(opts, self), self, data, tempOpt);
    }
  };
  opts.error = function (xhrParam, status, err) {
    // Trigger an error event
    self.TriggerInternal(false, Events.EventType.ERROR, self, xhrParam, tempOpt);

    if (userErr) {
      userErr.apply(self, [self, err, options, xhrParam, status]);
    }
  };

  if (!this.isNew()) {
    xhr = Model._internalSync('delete', this, opts);
    if (!isWait) {
      this._fireDestroy(false);
    }
    return xhr;
  }
  if (!isWait) {
    this._fireDestroy(false);
  }
  if (callback) {
    callback.call(Model.GetContext(opts, self), self, null, tempOpt);
  }
  return false;
};

/**
 * Fire request event
 * @private
 */
Model.prototype._fireRequest = function (model, xhr, options, silent) {
  this.TriggerInternal(silent, Events.EventType.REQUEST, model, xhr, options);
};

/**
 * Fire destroy event to all listeners
 * @private
 */
Model.prototype._fireDestroy = function (silent) {
  this.TriggerInternal(silent, Events.EventType.DESTROY, this, this.collection, null);
};

/**
 * Fire sync event to all listeners
 * @private
 */
Model._fireSyncEvent = function (model, resp, options, silent) {
  model.TriggerInternal(silent, Events.EventType.SYNC, model, resp, options);
};

/**
 * Return a copy of Model's current attribute/value pairs
 * @return {Object} a copy of the Model's current set of attribute/value pairs.
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.toJSON = function () {
  var retObj = {};
  var self = this;

  Object.keys(self.attributes || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(self.attributes, prop)) {
      if (Array.isArray(self.attributes[prop])) {
        retObj[prop] = self.attributes[prop].slice(0);
      } else {
        retObj[prop] = self.attributes[prop];
      }
    }
  });
  return retObj;
};

/**
 * Return the previous value of the given attribute, if any.
 *
 * @param {string} attr
 * @returns {Object} previous value of attr, if any.  If the attribute has not changed, returns undefined
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.previous = function (attr) {
  return this.previousAttrs[attr];
};

/**
 * Return a copy of the model's previously set attributes
 *
 * @returns {Object} a copy of the model's previous attributes
 * @memberof Model
 * @since 1.0.0
 * @export
 */
Model.prototype.previousAttributes = function () {
  return this.previousAttrs;
};

/**
 * @export
 * Performs communications with the server.  Can be overridden/replaced by clients
 *
 * @param {string} method "create", "read", "update", or "delete"
 * @param {Model} model Model to be read/saved/deleted/created
 * @param {Object=} options to control sync:<br>
 * <b>success</b>: called if sync succeeds:<br>
 * <ul>
 * For create, called with the response (attribute/value pairs); status (Ajax by default, but user-defined);
 * xhr object (Ajax--if available)<br>
 * For read, called with the response (attribute/value pairs being fetched)<br>
 * For update, same as create<br>
 * For delete, called with the Model deleted, the data response (ignored), and the options passed to the
 * destroy call<br>
 * </ul>
 * <b>error</b>: called if sync fails.  Called with xhr, status, and error info, per jQuery Ajax (all if
 * available)<p>
 *
 * @return {Object} xhr object
 * @memberof Model
 * @instance
 * @since 1.0.0
 * @alias sync
 */
Model.prototype.sync = function (method, model, options) {
  return oj.sync(method, model, options);
};

/**
 * Internal processing before sync-- we want this stuff to happen even if user replaces sync
 * @private
 */
Model._internalSync = function (method, model, opt) {
  var options = opt || {};
  // If Model/Collection has OAuth object, then create Authorization header (see RestImpl.addOptions)
  if (model.oauth) {
    options.oauthHeader = model.oauth.getHeader();
  }

  // Make sure to transfer the data type if it's set on the calling object
  if (!options.dataType && model.dataType) {
    options.dataType = model.dataType;
  }
  if (!options.jsonpCallback && model.jsonpCallback) {
    options.jsonpCallback = model.jsonpCallback;
  }

  // Do parsing if necessary and tuck it on options
  if (method === 'create' || method === 'patch' || method === 'update') {
    options.parsedData = model.parseSave.call(
      model,
      method === 'patch' ? options.attrs : options.saveAttrs
    );
  }
  var recordId = null;
  if (model instanceof Model) {
    recordId = model.GetId();
  }
  var newOpt = {};
  Object.keys(options).forEach(function (prop) {
    newOpt[prop] = options[prop];
  });
  var urlOpt = RestImpl.SetCustomURLOptions(recordId, model, options);
  Object.keys(urlOpt || {}).forEach(function (prop) {
    newOpt[prop] = urlOpt[prop];
  });
  // Make sure we send back xhr in options-- can come from return value or passed back through options
  options.xhr = model.sync(method, model, newOpt);
  if (newOpt.xhr) {
    options.xhr = newOpt.xhr;
  }
  return options.xhr;
};

/**
 * @export
 * @class sync
 * @desc Master server access method for all models and collections.  Replace oj.sync with a new implementation
 * to customize all Model and Collection server interactions
 *
 * @param {string} method "create", "read", "update", "patch", or "delete"
 * @param {Model|Collection} model Model (or Collection to be read) to be read/saved/deleted/created
 * @param {Object=} options to control sync<br>
 * success: called if sync succeeds<br>
 * error: called if sync fails<br>
 * others are passed to jQuery<br>
 * Options that would normally be passed to a customURL callback are also included<br>
 *
 *
 * @return {Object} xhr object
 * @memberof oj
 * @global
 * @since 1.0.0
 */
const sync = function (method, model, options) {
  var tempOpt = options || {};
  function _fireAndReturn(xhr) {
    model._fireRequest(model, xhr, tempOpt, tempOpt.silent);
    return xhr;
  }

  var restService;
  var success = tempOpt.success;
  var error = tempOpt.error;
  var url;

  if (method.valueOf() === 'create') {
    url = model._saveUrl();
    url = url || RestImpl.GetPropValue(model, 'url');
    restService = new RestImpl(url, model);
    return _fireAndReturn(restService.addRecord(tempOpt.parsedData, error, tempOpt, model));
  }

  if (method.valueOf() === 'read') {
    if (model instanceof Model) {
      url = tempOpt.url ? tempOpt.url : RestImpl.GetPropValue(model, 'url');
      restService = new RestImpl(url, model);
      return _fireAndReturn(
        restService.getRecord(
          success,
          error,
          model.GetId(),
          tempOpt,
          Model.GetContext(tempOpt, model)
        )
      );
    }
    // Collection fetch
    url = model.GetCollectionFetchUrl(tempOpt);
    restService = new RestImpl(url, model);
    return _fireAndReturn(restService.getRecords(success, error, tempOpt, model));
  }

  restService = new RestImpl(RestImpl.GetPropValue(model, 'url'), model);
  var recordId = null;
  if (model instanceof Model) {
    recordId = model.GetId();
  }
  if (method.valueOf() === 'update') {
    return _fireAndReturn(
      restService.updateRecord(success, recordId, tempOpt.parsedData, error, tempOpt, model, false)
    );
  }
  if (method.valueOf() === 'patch') {
    return _fireAndReturn(
      restService.updateRecord(success, recordId, tempOpt.parsedData, error, tempOpt, model, true)
    );
  }
  if (method.valueOf() === 'delete') {
    return _fireAndReturn(restService.deleteRecord(recordId, error, tempOpt, model));
  }
  return null;
};
oj._registerLegacyNamespaceProp('sync', sync);

/**
 * @private
 */
Model._urlError = function (ajaxOptions) {
  if (!ajaxOptions.url) {
    throw new Error('The url property or function must be specified');
  }
};

/**
 * @export
 * @class ajax
 * @desc Master Ajax entry point for all Model and Collection server interactions, when they are using the
 * default sync implementations.  oj.ajax passes through to jQuery ajax by default.
 * See {@link http://api.jquery.com/jquery.ajax/} for expected parameters and return value.
 * @param {Object=} settings optional ajax settings
 *
 * @return {Object} xhr object
 * @memberof oj
 * @global
 * @since 1.0.0
 */
// eslint-disable-next-line no-unused-vars
const ajax = function (settings) {
  if (arguments && arguments.length > 0) {
    Model._urlError(arguments[0]);
  }
  return $.ajax.apply(oj, arguments);
};

oj._registerLegacyNamespaceProp('ajax', ajax);

/**
 * @export
 * @class Collection
 * @classdesc Collection of Model objects
 *
 * @param {Array.<Model>=} models Set of model objects to put into collection at construction
 *                 time.  If models contain actual
 *                 Model objects, then any custom parse callback set on the collection must
 *                 be able to handle Model objects as a possible argument
 * @param {Object=} options Passed through to the user's initialize routine, if any, upon
 *                  construction
 * @constructor
 * @final
 * @since 1.0
 * @mixes Events
 * @ojsignature {target: "Type", value: "class Collection"}
 */
const Collection = function (models, options) {
  if (Collection._justExtending) {
    return;
  }

  // Initialize
  Collection._init(this, models, options, null);
};

oj._registerLegacyNamespaceProp('Collection', Collection);

/**
 * Subclass from oj.Object
 * @private
 */
oj.Object.createSubclass(Collection, oj.Object, 'oj.Collection');

/**
 * @desc Property specifying the [model]{@link Model} class object used by the collection
 * @memberof Collection
 * @type Model
 * @export
 */
Collection.prototype.model = null;

/**
 * @desc Function specifying how to construct the id for models in this collection.  Override to
 * change the construction of the id.
 * @memberof Collection
 * @param {Object} attrs attributes of a model
 * @returns {null|string}
 * @since 1.0.0
 * @export
 */
Collection.prototype.modelId = function (attrs) {
  var model = this.model;
  if (model && attrs) {
    return attrs[model.idAttribute || model.prototype.idAttribute || 'id'];
  }
  return null;
};

/**
 * @export
 * @desc Total number of models in the collection.  When the collection is virtual, not all of the
 * models may be locally available.
 * @memberof Collection
 *
 * @type number
 * @since 1.0.0
 */
Collection.prototype.length = null;

/**
 * @export
 * @desc Direct access to the collection's list of models objects<br/>
 * Note that this property should not be used directly when a collection is virtual, as
 * automatic fetches will not be triggered for undefined elements in the model.  Use at()
 * instead.
 * @memberof Collection
 *
 * @type {Array.<Model>}
 * @since 1.0.0
 */
Collection.prototype.models = null;

/**
 * Tracking indices used
 * @private
 */
Collection.prototype._modelIndices = [];

/**
 * @export
 * @desc The data service's server URL.
 * @memberof Collection
 *
 * @type {null|string|function():string}
 * @since 1.0.0
 */
Collection.prototype.url = null;

/**
 * @export
 * @desc Changes that have occured due to adds/removes since the last fetch.  This is a list of
 * indicies that have changed (location at which a model was added, deleted, or set).  They do
 * not shift with subsequent operations
 * @memberof Collection
 * @type {Array.<number>}
 * @since 1.0.0
 */
Collection.prototype.changes = [];

/**
 * A callback to allow users to customize the data service URLs.  The callback should accept
 * these parameters:<p>
 * <b>operation</b>: one of "create", "read", "update", "patch", or "delete", indicating the
 * type of operation for which to return the URL<p>
 * <b>collection</b>: the Collection object requesting the URL<p>
 * <b>options</b>: any of the following properties:<br>
 * <ul>
 * <b>recordID</b>: id of the record involved, if relevant<br>
 * <b>fetchSize</b>: how many records to return.  If not set, return all.<br>
 * <b>startIndex</b>: Starting record number of the set to return.<br>
 * <b>startID</b>: Retrieve records starting with the record with the given unique ID.<br>
 * <b>since</b>: Retrieve records with timestamps after the given timestamp.<br>
 * <b>until</b>: Retrieve records with timestamps up to the given timestamp. Default is "until"<br>
 * <b>sort</b>:  field(s) by which to sort, if set<br>
 * <b>sortDir</b>: sort ascending or descending (asc/dsc)<br>
 * <b>query</b>: a set of attributes indicating filtering that should be done on the server.  See
 * [where]{@link Collection#where} for complete documentation of query values<br>
 * <b>all</b>: true (along with 'query', above) indicates that this is a findWhere or where type
 * call that is expecting all models meeting the query condition to be returned<br>
 * </ul>
 * <p>
 * customURL callbacks should return either: null, in which case the default will be used; a
 * url string, which will be used with the standard HTTP method for the type of operation, or
 * an Object with any other attributes that should be passed to the ajax call.<br>
 * This object must at minimum include the URL, and other attributes as follows:<br>
 * <ul>
 * <b>url</b>: the custom URL string<br>
 * <b>type</b>: (optional) a string indicating the type of HTTP method to use (GET, POST,
 *              DELETE, etc.)<br>
 * <b>(other)</b>: (optional) any other attributes to pass in the ajax call<br>
 * </ul>
 * <p>
 * @type {function(string,Collection,Object):(string|Object|null)|null}
 * @memberof Collection
 * @ojsignature  {target: "Type", value: "function(string,Collection,Collection.CustomURLCallbackOptions):(string|Object|null)|null", for: "returns"}
 *
 * @export
 * @since 1.0.0
 */
Collection.prototype.customURL = null;

/**
 * @typedef {Object} Collection.CustomURLCallbackOptions
 * @property {string=} recordID id of the record involved, if relevant
 * @property {number=} fetchSize how many records to return.  If not set, return all
 * @property {number=} startIndex Starting record number of the set to return
 * @property {string=} startID Retrieve records starting with the record with the given unique ID
 * @property {string=} since Retrieve records with timestamps after the given timestamp
 * @property {string=} until Retrieve records with timestamps up to the given timestamp. Default is "until"
 * @property {string=} sort field(s) by which to sort, if set
 * @property {string=} sortDir sort ascending or descending (asc/dsc)
 * @property {Object=} query a set of attributes indicating filtering that should be done on the server.  See
 * [where]{@link Collection#where} for complete documentation of query values
 * @property {boolean=} all true (along with 'query', above) indicates that this is a findWhere or where type
 * call that is expecting all models meeting the query condition to be returned
 *
 * @example <caption>Sample information that is commonly passed to customURL to give information about the collection's request.  The customURL implementer should use this information to return a custom URL for their REST service./caption>
 * <pre class="prettyprint"><code>
 * {
 *   fetchSize: 20,       // Number of records the collection is requesting
 *   startIndex: 40,      // Absolute index of the starting record requested
 *   sort: 'name',        // Field by which the collection would like the results sorted, if any
 *   sortDir: 'asc'       // Desired sort direction, if any
 * }
 * </code></pre>
 */

/**
 * A callback function allowing users to extract their own paging/virtualization
 * return values from the server's response.<p>
 * It should accept these parameters:<p>
 * <b>response</b>: the Object data response coming back from the fetch call<p>
 * <p>
 * The callback should return either null, in which case the collection will look for the
 * default properties, or an object containing one or more of the following attribute/value
 * pairs (note that the Collection will look back to the response for default paging return
 * properties if not found in the returned object):<br>
 * <ul>
 * <b>totalResults</b>: the total number of records available on the server side, not just
 * in the current result.  By default the collection looks in the response for "totalResults"<br>
 * <b>limit</b>: the actual fetchSize from the server.  This may not be the client's fetchSize
 * or the number of records in the current result.  By default the collection looks in the
 * response for "limit".  This becomes the collection's "lastFetchSize" property<br>
 * <b>count</b>: the actual number of records returned by the server in the last result.  This
 * becomes the collection's "lastFetchCount".  By default the collection looks in the response
 * for "count".<br>
 * <b>offset</b>: the actual starting record number of the current result.  By default the
 * collection looks in the response for "offset"<br>
 * <b>hasMore</b>: boolean indicating whether or not there are more records available beyond
 * the current result.  By default the collection looks in the response for "hasMore"<br>
 * </ul>
 * <p>
 *
 * @type {(function(Object):(Object|null)|null)}
 * @memberof Collection
 * @ojsignature {target: "Type",
 * value: "((response: object)=> Collection.CustomPagingOptionsReturn|null)|null"}
 * @export
 * @since 1.0.0
 */
Collection.prototype.customPagingOptions = null;

/**
 * @typedef {Object} Collection.CustomPagingOptionsReturn
 * @property {number=} totalResults
 * @property {number=} limit
 * @property {number=} count
 * @property {number=} offset
 * @property {boolean=} hasMore
 *
 * @example <caption>Map paging return properties from a sample REST service to the properties expected by the Collection.  Here is an example customPagingOptions callback function implementation:</caption>
 * <pre class="prettyprint"><code>
 * collection.customPagingOptions = function(response) {
 *   return {
 *     totalResults: response.allRecordCount,     // REST service returns total possible record count as 'allRecordCount'
 *     limit: repsonse.fetchBlockSize,    // REST service returns its fetch size block as 'fetchBlockSize'
 *     count: response.recordsFetched,    // REST service returns the number of records actually fetched as 'recordsFetched'
 *     offset: response.startRecord,    // REST service returns the starting index of the block fetched here as 'startRecord'
 *     hasMore: (response.startRecord + response.recordsFetched < response.allRecordCount-1)  // Calculate whether this fetch got the last records available to return a boolean to indicate whether more records are available
 *   };
 * }
 * </code></pre>
 */

/**
 * @export
 * @desc The server's fetch size.  This may not match [fetchSize]{@link Collection#fetchSize}.
 * @memberof Collection
 *
 * @type number
 * @since 1.0.0
 */
Collection.prototype.lastFetchSize = null;

/**
 * @export
 * @desc Indicates whether or not there are more records available on the server, at indices
 * beyond the last fetch.
 * @memberof Collection
 *
 * @type boolean
 * @since 1.0.0
 */
Collection.prototype.hasMore = false;

/**
 * @export
 * @desc The total number of records available for this collection regardless of whether they
 * have been fetched or not.  For non-virtual collections this will equal the length.
 * @memberof Collection
 *
 * @type number
 */
Collection.prototype.totalResults = null;

/**
 *
 * @export
 * @desc The number of records actually fetched the last time the collection fetched from the
 * server.  This may or may not match [fetchSize]{@link Collection#fetchSize} or
 * [lastFetchSize]{@link Collection#lastFetchSize}
 * @memberof Collection
 *
 * @type number
 */
Collection.prototype.lastFetchCount = null;

/**
 * @export
 * @desc For virtual collections, the number of records to be kept in memory at any one
 * time.  The default of -1 indicates that no records are thrown out
 * @memberof Collection
 *
 * @type number
 */
Collection.prototype.modelLimit = -1;

/**
 * @export
 * @desc The actual starting index number at which models from the last server fetch
 * were inserted into the collection.
 * @memberof Collection
 *
 * @type number
 */
Collection.prototype.offset = null;

/**
 * @export
 * @desc The number of records to be fetched from the server in any one round trip.
 * The server's fetch size comes back as the "limit" property.  The default value
 * of -1 indicates that virtualization is not being used or is not available,
 * and all records will be fetched.<br>
 * @memberof Collection
 *
 * @type number
 */
Collection.prototype.fetchSize = -1;

/**
 * @export
 * @desc Sort direction for string-based sort comparators (model attribute names).  A value
 * of 1 indicates ascending sorts, -1 indicates descending.  The default is 1 (ascending).<br>
 * Users should call sort() after changing sort direction to ensure that models in the
 * collection are sorted correctly, or, for virtual collections, that there are no left
 * over models in an incorrect order.
 * @memberof Collection
 *
 * @type number
 */
Collection.prototype.sortDirection = 1;

/**
 * @export
 * @desc If set to a string, sort the collection using the given attribute of a model.<p>
 * If set to a function(Model), the function should return a string giving the model
 * attribute by which the sort should take place.<p>
 * If set to a function(Model1, Model2), then this function is called comparing Model1
 * and Model2 (see the JavaScript array.sort() for details)<p>
 * In the virtual case, comparator must be a string-based field comparator, which will
 * be passed to the server.<p>
 * Users should call sort() after making any changes to the comparator to ensure that
 * the models are correctly sorted, or that there are no leftover models sorted incorrectly
 * in the virtual case.
 * @memberof Collection
 *
 * @type {null|string|function(Model,Model=):number}
 * @since 1.0.0
 */
Collection.prototype.comparator = null;

/**
 * @export
 *
 * @memberof Collection
 * @type {boolean}
 * @desc If true, do not insert the JET locale-based Accept-Language header.  If false,
 * let the Ajax system set the header.
 * @since 5.0.0
 */
Collection.prototype.omitLanguageHeader = false;

/**
 * @private
 */
Collection.prototype.Init = function () {
  Collection.superclass.Init.call(this);
};

/**
 * Create a new, specific type of Collection object to represent a collection of records
 * from a JSON data set.
 * @param {Object=} properties Properties for the new Collection class.<p>
 * <b>parse</b>: a user callback function to allow parsing of the JSON collection after it's
 * returned from the data service.  If a collection is initialized with actual Models or
 * collection.set is used with actual Models, the parse callback must expect that the argument
 * passed to it may contain raw JSON data *or* Model objects<br>
 * <b>model</b>: the specific type of [model]{@link Model} object to use for each member of
 * the collection<br>
 * <b>url</b>: the URL string to use to get records from the data service<br>
 * <b>initialize</b>: a user callback function to be called when this collection is created.
 * Called in the context of the collection and passed: models, options.<br>
 * <b>comparator</b>: a user callback used on sort calls. May also be set to false to prevent
 * sorting.  See [comparator]{@link Collection#comparator}<br>
 * <b>fetchSize</b>: the number of records to be fetched on each round trip to the server.
 * Overrides [fetchSize]{Collection#fetchSize}. If not set, the collection will not consider
 * itself virtual<br>
 * <b>modelLimit</b>: the number of records to be held in memory at any one time, if
 * virtualization is in force.  The default is all records.  This uses an LRU algorithm to
 * determine which to roll off as more records are added.<br>
 * @param {Object=} classProperties optional properties that get attached to the constructor
 * of the extended Collection
 * @return {Collection} new Collection object
 * @ojsignature [{target: "Type",
 *                value: "any",
 *                for: "returns"},
 * {target: "Type", value:"{parse?: (data: any)=> any, model?: Model, url?: string,
 * initialize?: (models: Array<Model>, options: object)=> void,
 * comparator?: null|string|((model1: Model, model2?: Model)=> number),
 * fetchSize?: number, modelLimit?: number, [propName: string]: any}", for: "properties"}]
 * @memberof Collection
 * @this {Collection}
 * @since 1.0.0
 * @export
 */
Collection.extend = function (properties, classProperties) {
  var obj = null;
  Collection._justExtending = true;
  obj = new Collection();
  Collection._justExtending = false;

  // Add regular properties from this "parent"
  // Events.Mixin(obj, this.prototype);
  $.extend(obj, this.prototype);

  var coll;
  if (
    properties &&
    properties.constructor &&
    Object.prototype.hasOwnProperty.call(properties, 'constructor')
  ) {
    coll = properties.constructor;
  } else {
    coll = function (models, options) {
      Collection._init(this, models, options, properties);
    };
  }

  if (classProperties) {
    Object.keys(classProperties).forEach(function (prop) {
      if (Object.prototype.hasOwnProperty.call(classProperties, prop)) {
        coll[prop] = classProperties[prop];
      }
    });
  }

  if (properties) {
    Object.keys(properties).forEach(function (prop) {
      if (Object.prototype.hasOwnProperty.call(properties, prop)) {
        obj[prop] = properties[prop];
      }
    });
  }

  $.extend(coll, this);
  coll.prototype = obj;

  // Allow extending resulting obj
  coll.extend = Collection.extend;

  coll.prototype.constructor = coll;

  return coll;
};

/**
 * @private
 */
Collection._init = function (collection, models, options, properties) {
  var i;
  var optionlist;
  var modelList;
  var prop;

  collection.Init();

  // Augment with Event
  Events.Mixin(collection);

  // First, copy all properties passed in
  if (properties) {
    // eslint-disable-next-line no-restricted-syntax
    for (prop in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, prop)) {
        collection[prop] = properties[prop]; // eslint-disable-line no-param-reassign
      }
    }
  }

  // Check options
  var opt = options || {};
  optionlist = [
    'comparator',
    'customPagingOptions',
    'customURL',
    Collection._FETCH_SIZE_PROP,
    'model',
    'modelLimit',
    'sortDirection',
    'url'
  ];
  for (i = 0; i < optionlist.length; i++) {
    if (
      Object.prototype.hasOwnProperty.call(opt, optionlist[i]) &&
      opt[optionlist[i]] !== undefined
    ) {
      collection[optionlist[i]] = opt[optionlist[i]]; // eslint-disable-line no-param-reassign
    }
  }
  if (collection._getFetchSize(null) === undefined) {
    collection.setFetchSize(-1);
  }
  if (collection.modelLimit === undefined) {
    collection.setModelLimit(-1);
  }
  collection.hasMore = false; // eslint-disable-line no-param-reassign
  collection.lruCount = 0; // eslint-disable-line no-param-reassign

  collection._setModels([], true);
  var localModels = models;
  if (opt.parse) {
    localModels = collection.parse(models);
  }
  if (localModels != null) {
    opt.noparse = true;
    modelList = localModels instanceof Array ? localModels : [localModels];
    collection._addInternal(modelList, opt, true, false);
  }
  collection._setLength();
  if (!localModels) {
    // Make sure totalResults is uninitialized at first, though, for non virtual case--0 could be the length of the first fetch
    collection.totalResults = undefined; // eslint-disable-line no-param-reassign
  }

  if (properties && properties.initialize) {
    properties.initialize.call(collection, localModels, opt);
  }
};

// Placeholder for event mixins
Collection.prototype.on = function (event, callback) {}; // eslint-disable-line no-unused-vars
Collection.prototype.OnInternal = function (event, callback, context, listenTo, ignoreSilent) {}; // eslint-disable-line no-unused-vars
Collection.prototype.TriggerInternal = function (silent, event, arg1, arg2, options) {}; // eslint-disable-line no-unused-vars

/**
 * Fire request event
 * @private
 */
Collection.prototype._fireRequest = function (collection, xhr, options, silent) {
  this.TriggerInternal(silent, Events.EventType.REQUEST, collection, xhr, options);
};

/**
 * @private
 */
Collection.prototype._resetChanges = function () {
  this.changes = [];
};

/**
 * @private
 */
Collection.prototype._setChangeAt = function (start, count) {
  for (var at = start; at < start + count; at++) {
    if (this.changes.indexOf(at) === -1) {
      this.changes.push(at);
    }
  }
};

/**
 * @private
 */
Collection.prototype._setModels = function (models, clearing) {
  this.models = models;
  if (clearing) {
    this._modelIndices = [];
    this._resetChanges();
  } else {
    for (var i = 0; i < models.length; i++) {
      if (models[i]) {
        this._modelIndices.push(i);
      }
    }
  }
};

/**
 * @private
 */
Collection.prototype._getModels = function () {
  return this.models;
};

/**
 * @private
 */
Collection.prototype._getModelsLength = function () {
  return this._getModels().length;
};

/**
 * Designed to check if index exceeds the length of the models.  If we're in a virtual and "no totalResults" case,
 * we're never over the upper limit
 * @private
 */
Collection.prototype._overUpperLimit = function (index) {
  if (index < this._getModelsLength()) {
    return false;
  }
  if (this.IsVirtual()) {
    if (!this._hasTotalResults() || this._getModelsLength() === 0) {
      return false;
    }
  }
  return true;
};

/**
 * @private
 */
Collection.prototype._hasTotalResults = function () {
  return Collection._defined(this.totalResults);
};

/**
 * @private
 */
Collection._defined = function (value) {
  return value != null;
};

/**
 * @private
 */
Collection.prototype._pushModel = function (model) {
  this._getModels().push(model);
  this._modelIndices.push(this._getModelsLength() - 1);
  this._setChangeAt(this._getModelsLength() - 1, 1);
};

/**
 * @private
 */
Collection.prototype._pushModels = function (model) {
  // Model is being added to the end, it should be made the head
  this._makeModelHead(model);
  this._pushModel(model);
  this.lruCount += 1;
  model.SetIndex(this._getModelsLength() - 1);
};

/**
 * @private
 */
Collection.prototype._reduceLRU = function (removed) {
  if (removed) {
    for (var i = 0; i < removed.length; i++) {
      if (removed[i]) {
        this.lruCount -= 1;
      }
    }
  }
};

/**
 * @param {number} start
 * @param {number} count
 * @param {Object=} model
 * @private
 */
Collection.prototype._spliceModels = function (start, count, model) {
  // Clean up prev/next links for models being removed
  for (var i = start; i < start + count; i++) {
    this._removePrevNext(this._getModel(i));
  }
  if (model === undefined) {
    this._reduceLRU(this._getModels().splice(start, count));
    this._spliceModelIndices(start, start + count - 1);
  } else {
    this._reduceLRU(this._getModels().splice(start, count, model));
    this._spliceModelIndices(start, start + count - 1);
    this._insertModelIndex(start);
    this._makeModelHead(model);
  }
  this._setChangeAt(start, count);
  if (this.lruCount < 0) {
    this.lruCount = 0;
  }
  this._realignModelIndices(start);
};

/**
 * @private
 */
Collection.prototype._getModel = function (index) {
  return this._getModels()[index];
};

/**
 * Realign all the indices of the models (after sort for example)
 * @private
 */
Collection.prototype._realignModelIndices = function (start) {
  var index;
  for (var i = 0; i < this._modelIndices.length; i++) {
    index = this._modelIndices[i];
    if (index >= start && this._getModel(index)) {
      this._getModel(index).SetIndex(index);
    }
  }
};

/**
 * Update next/prev pointers as though the given model were being removed
 * @private
 */
Collection.prototype._removePrevNext = function (model) {
  if (!model) {
    return;
  }

  var oldPrev = model.GetPrevious();
  var oldNext = model.GetNext();
  // Link the two surrounding previous/next elements to each other, because this one is being replaced and moved
  // to the head
  if (oldPrev) {
    oldPrev.SetNext(oldNext);
  } else {
    // This element used to be the head
    this.head = oldNext;
  }
  if (oldNext) {
    oldNext.SetPrevious(oldPrev);
  } else {
    // This element used to be the tail
    this.tail = oldPrev;
  }
};

/**
 * @private
 */
Collection.prototype._makeModelHead = function (model) {
  // Make this new model the most recently used: the head
  model.SetNext(this.head);
  if (this.head) {
    this.head.SetPrevious(model);
  } else {
    // No head: list is empty-->make tail the same element
    this.tail = model;
  }
  model.SetPrevious(null);
  this.head = model;
};

/**
 * Mark the model index tracker as having a used slot
 * @private
 */
Collection.prototype._setModelIndex = function (index) {
  if (this._modelIndices.indexOf(index) === -1) {
    this._modelIndices.push(index);
  }
};

/**
 * Insert the given model at the given index
 * @private
 */
Collection.prototype._insertModelIndex = function (start) {
  // Up all the indices of models with index greater than start
  for (var i = 0; i < this._modelIndices.length; i++) {
    if (this._modelIndices[i] >= start) {
      this._modelIndices[i] += 1;
    }
  }
  // Now add the new one
  this._modelIndices.push(start);
};

/**
 * Splice out the given model index
 * @private
 */
Collection.prototype._spliceModelIndices = function (start, end) {
  var localEnd = end === undefined ? start : end;
  this._clearModelIndices(start, localEnd);

  var count = localEnd - start + 1;
  // Reduce the indexes of any models above the endpoint by the number of models removed
  for (var i = 0; i < this._modelIndices.length; i++) {
    if (this._modelIndices[i] > localEnd) {
      this._modelIndices[i] -= count;
    }
  }
};

/**
 * Clear the given model index
 * @private
 */
Collection.prototype._clearModelIndices = function (start, end) {
  var localEnd = end === undefined ? start : end;
  // Knock out any of the deleted model's indexes from the list
  for (var i = start; i <= localEnd; i++) {
    var idx = this._modelIndices.indexOf(start);
    if (idx > -1) {
      this._modelIndices.splice(idx, 1);
    }
  }
};

/**
 * @private
 */
Collection.prototype._setModel = function (index, model) {
  var oldModel = this._getModel(index);
  this._removePrevNext(oldModel);
  if (!oldModel) {
    // Newly "inserted" model
    this.lruCount += 1;
  }
  this._setChangeAt(index, 1);
  this._getModels()[index] = model;
  if (model) {
    this._setModelIndex(index);
    model.SetIndex(index);
    this._makeModelHead(model);
  }
};

/**
 * Clean off n models from tail (oldest) of prev/next list
 * @private
 */
Collection.prototype._clearOutModels = function (n) {
  var current = this.tail;
  var index;
  var model;
  var i = 0;

  this.tail = null;
  while (current && i < n) {
    // Erase this model from collection, iff it hasn't changed
    index = current.GetIndex();
    model = this._getModel(index);
    if (!(model && model.hasChanged())) {
      this.lruCount -= 1;
      if (index > -1) {
        this._setModel(index, undefined);
        this._clearModelIndices(index, index);
      }

      // Clear its pointers
      current.SetNext(null);
      current = current.SetPrevious(null);
      i += 1;
    } else {
      // Lock down the tail to this one we're not deleting
      if (!this.tail) {
        this.tail = current;
      }
      current = current.GetPrevious();
    }
  }
  // Make sure we set tail if not already set
  if (!this.tail) {
    this.tail = current;
  }
  if (this.lruCount < 0) {
    this.lruCount = 0;
  }
  if (this.lruCount === 0) {
    this.head = null;
    this.tail = null;
  }
};

/**
 * Reset the LRU list
 * @private
 */
Collection.prototype._resetLRU = function () {
  this.lruCount = 0;
  this.head = null;
  this.tail = null;
};

/**
 * Make sure we have room in the LRU
 * @private
 */
Collection.prototype._manageLRU = function (incoming) {
  if (this.IsVirtual()) {
    var limit = this._getModelLimit();
    if (limit > -1) {
      if (this.lruCount + incoming > limit) {
        // Must flush the amount over the limit
        this._clearOutModels(this.lruCount + incoming - limit);
      }
    }
  }
};

/**
 * @export
 * @desc Return a copy of the Collection
 * @memberof Collection
 *
 * @return {Collection} copy of the Collection
 */
Collection.prototype.clone = function () {
  return this._cloneInternal(true);
};

/**
 * @private
 */
Collection.prototype._cloneInternal = function (withProperties) {
  var c = new this.constructor();
  var i;

  // Only copy locally if virtual
  var model;
  if (this.IsVirtual()) {
    c = this._copyFetchProperties(c);
    c._resetModelsToFullLength(this.totalResults);
  }

  c = this._copyProperties(c);
  if (withProperties) {
    // Try to copy models only if told to--we may only need the shell of the collection with properties
    // Make a copy of the model indices (it will be modified by this process)
    var indices = [];
    for (i = 0; i < this._modelIndices.length; i++) {
      indices.push(this._modelIndices[i]);
    }
    // Sort them in reverse order so we eliminate the higher indexes first so as not to disrupt the position of
    // the earlier ones
    indices.sort(function (a, b) {
      return a - b;
    });

    var index;
    for (i = 0; i < indices.length; i++) {
      index = indices[i];
      model = this._atInternal(index, null, true, false);
      if (model) {
        c._addInternal(model.clone(), { at: index }, true, false);
      }
    }
  }
  return c;
};

/**
 * Copy critical properties in clone
 * @private
 */
Collection.prototype._copyProperties = function (collection) {
  var props = ['comparator', 'model', 'modelId'];
  var prop;
  var i;

  for (i = 0; i < props.length; i++) {
    prop = props[i];
    collection[prop] = this[prop]; // eslint-disable-line no-param-reassign
  }
  return collection;
};

/**
 * Copy critical fetch properties in clone
 * @private
 */
Collection.prototype._copyFetchProperties = function (collection) {
  var props = ['totalResults', 'hasMore', Collection._FETCH_SIZE_PROP];
  var prop;
  var i;

  for (i = 0; i < props.length; i++) {
    prop = props[i];
    collection[prop] = this[prop]; // eslint-disable-line no-param-reassign
  }
  return collection;
};

/**
 * @private
 */
Collection.prototype._getLength = function () {
  return this.length;
};

/**
 * @private
 */
Collection.prototype._setLength = function () {
  var modelsLen = this._getModelsLength();
  this.length = modelsLen;
  if (!this.IsVirtual()) {
    this.totalResults = modelsLen;
  }
};

/**
 * Create a model instance using the model property if set
 * @param {Object} collection
 * @param {Object=} attrs
 * @param {Object=} options
 * @returns {null|Object}
 * @private
 */
Collection._createModel = function (collection, attrs, options) {
  if (collection.model) {
    return $.isFunction(collection.model)
      ? new collection.model(attrs, options) // eslint-disable-line new-cap
      : new collection.model.constructor(attrs, options); // eslint-disable-line new-cap
  }
  return null;
};

/**
 * @private
 */
Collection.prototype._newModel = function (m, parse, options, ignoreDefaults) {
  var newModel = null;
  var validationValue;
  var opt = options || {};

  opt.ignoreDefaults = ignoreDefaults;

  if (m instanceof Model) {
    newModel = m;
  } else if (this.model) {
    // model is defined
    newModel = Collection._createModel(this, m, opt);
  } else {
    // Set this collection on the model
    opt.collection = this;
    newModel = new Model(m, opt);
  }
  // Validate
  if (opt.validate && newModel.validate) {
    validationValue = newModel.validate(newModel.attributes);
    if (validationValue) {
      opt.validationError = validationValue;
      this.TriggerInternal(false, Events.EventType.INVALID, newModel, validationValue, opt);
      return null;
    }
  }
  return newModel;
};

/**
 * Add a model or models to the end of the collection.<br>
 * Events:<p>
 * <ul>
 * <b>add</b>: fired for each model added, passing the collection, model added, and options<br>
 * <b>alladded</b>: fired after all models have been added, passing the collection, array of models added, and
 * options<br>
 * </ul>
 * <p>
 * Note that for virtual collections, if a new model is added after being saved up to the server, no add event
 * will be fired as the
 * collection will already "see" the model as existing.  Note that a warning will be logged if this add is not
 * a force, not merging, and duplicate IDs are found.
 * @param {Model|Object|Array.<Object>|Array.<Model>} m Model object (or array of models) to add. These can be already-created instance of
 * the Model object, or sets of attribute/values, which will be wrapped by add() using the collection's model.
 * @param {Object=} options <b>silent</b>: if set, do not fire events<br>
 *                          <b>at</b>: splice the new model into the collection at the value given (at:index)<br>
 *                          <b>merge</b>: if set, and if the given model already exists in the collection (matched
 *                          by [id]{@link Model#id}), then merge the attribute/value sets, firing change
 *                          events<br>
 *                          <b>sort</b>: if set, do not re-sort the collection even if the comparator is set.<br>
 *                          <b>force</b>: if set to true, do an add to the collection no matter whether the item is
 *                          found or not<br>
 *                          <b>deferred</b>: if true, return a promise as though this collection were virtual
 *                          whether it is or not<br>
 *
 * @returns {Promise.<Array>|Array.<Model>} The model or models added to the collection (or found/merged if appropriate).  If
 * deferred or virtual, return the model or models added in a promise when the set has completed
 * @memberof Collection
 * @ojsignature [{target: "Type", value:"{silent?: boolean, at?: number, merge?: boolean, sort?: boolean, force?: boolean, deferred?: boolean,
 *               [propName: string]: any}", for: "options"},
 *               {target: "Type", value: "Promise<Array<Model>>|Array<Model>", for: "returns"}]
 * @since 1.0.0
 * @export
 */
Collection.prototype.add = function (m, options) {
  this._manageLRU(1);
  var opt = options || {};
  return this._handlePromise(this._addInternal(m, options, false, opt.deferred));
};

/**
 * fillIn: true indicates that we're just trying to use add() after a fetch to
 * insert into a preallocated list of models, not truly do an add/merge from the API
 * @private
 */
Collection.prototype._addInternal = function (m, options, fillIn, deferred) {
  // Get options
  var opt = options || {};
  var modelArray = [];
  var at = opt.at;
  var silent = opt.silent;
  var force = opt.force;
  var i;
  var index;
  var cid;
  var merge = opt.merge || false;
  var sort = opt.sort;
  var needSort = true;
  var added = false;
  var addedModels = [];
  var modelReturnList = [];

  if (at !== undefined && at < 0) {
    // Normalize it using the length-- another BackboneJS test case
    at += this._getLength() + 1;
  }

  if (m instanceof Array) {
    modelArray = m;
  } else {
    modelArray.push(m);
  }

  function addToCollection(collection, newModel) {
    if (at === undefined) {
      collection._pushModels(newModel);
      index = collection._getModelsLength() - 1;
      collection._getModel(index).SetCid();
    } else {
      index = at;
      if (collection.IsVirtual() && fillIn) {
        // Array has been preallocated in this case
        collection._setModel(index, newModel);
      } else {
        collection._spliceModels(index, 0, newModel);
      }
      collection._getModel(index).SetCid();
      // Increment at so that later models will be added right after their predecessors, if an array is
      // passed in
      at += 1;
    }
    if (newModel.GetCollection() === undefined) {
      newModel.SetCollection(collection);
    }
    collection._setLength();
    collection._listenToModel(newModel);
    added = true;
  }

  function resortAndFireEvents(
    collection,
    existingModel,
    modelFoundInCollection,
    newModel,
    resortDeferred
  ) {
    // Now resort if required (don't resort if either told not to, or if 'at' option is set)
    // and if there's more than one model
    var resortOpt = opt || {};
    if (fillIn) {
      resortOpt.fillIn = true;
    }
    var comparator = resortOpt.comparator || collection._hasComparator();
    // If we're filling in to a blank, also check that there's no comparator
    var fillInSort = !fillIn || (fillIn && comparator);
    if (
      fillInSort &&
      needSort &&
      existingModel === undefined &&
      !sort &&
      at === undefined &&
      collection._getLength() > 1
    ) {
      if (index > -1) {
        cid = collection._getModel(index).cid;
      }
      var sortOpt = {};
      oj.CollectionUtils.copyInto(sortOpt, resortOpt);
      sortOpt.add = true;
      collection.sort(sortOpt);
      // Reset index--can't get it back if virtual--set to -1
      if (index > -1) {
        if (collection.IsVirtual()) {
          index = -1;
        } else {
          index = collection.indexOf(collection.getByCid(cid), resortDeferred);
        }
      }
    }

    if (added) {
      // Pass index property in resortOpt, if at is specified
      if (resortOpt.at) {
        resortOpt.index = index;
      }
      if (newModel) {
        newModel.TriggerInternal(silent, Events.EventType.ADD, newModel, collection, resortOpt);
        addedModels.push(newModel);
      } else {
        modelFoundInCollection.TriggerInternal(
          silent,
          Events.EventType.ADD,
          modelFoundInCollection,
          collection,
          resortOpt
        );
        addedModels.push(modelFoundInCollection);
      }
    }
  }

  function mergeAttrs(
    collection,
    modelToTryAndMerge,
    modelFoundInCollection,
    newModel,
    mergeDeferred
  ) {
    var existingModel;
    var modelAdded = null;

    if (!force && merge && modelFoundInCollection) {
      // Try to merge the attributes--we're merging and the model (by id) was already in the collection
      needSort = modelFoundInCollection.Merge(modelToTryAndMerge, collection.comparator, silent);
      modelAdded = modelFoundInCollection;
    } else {
      // Make sure model is not already in there
      if (!force) {
        if (fillIn) {
          // Only bother if we have a real id set--comparing cids on a fill in is useless
          existingModel = !newModel.isNew() ? collection._getLocal(newModel) : undefined;
        } else {
          existingModel = collection._getLocal(newModel);
        }
        if (existingModel && fillIn && at !== existingModel.index) {
          // We're filling in a virtual collection: we should *not* be finding the new model already in
          // the collection if we're not merging and not forcing: this indicates duplicate ids
          // throw new Error("Duplicate IDs fetched or added without merging");
          warn(
            'Duplicate ID fetched or added without merging, the id = ' + existingModel.GetId()
          );
        }
      }

      if (existingModel === undefined) {
        addToCollection(collection, newModel);
        modelAdded = newModel;
      } else {
        modelAdded = existingModel;
      }
    }

    resortAndFireEvents(collection, existingModel, modelFoundInCollection, newModel, mergeDeferred);

    return modelAdded;
  }

  function doAdd(collection, model, addDeferred) {
    added = false;
    var newModel = collection._newModel(model, true, opt, false);
    var modelToTryAndMerge = null;
    var modelFoundInCollection = null;
    if (newModel != null) {
      index = -1;
      // Make sure ID is up to date
      newModel.SetupId();

      // Use original model array not cloned model if merging--otherwise we won't find the model in the
      // collection
      modelToTryAndMerge = model instanceof Model ? model : newModel;
      if (addDeferred) {
        if (force) {
          return new Promise(function (resolve) {
            var mergedModel = mergeAttrs(
              collection,
              modelToTryAndMerge,
              undefined,
              newModel,
              addDeferred
            );
            modelReturnList.push(mergedModel);
            resolve(mergedModel);
          });
        }
        return collection
          ._getInternal(modelToTryAndMerge, { silent: true }, addDeferred, true)
          .then(function (modInfo) {
            modelFoundInCollection = modInfo.m;
            var mod = mergeAttrs(
              collection,
              modelToTryAndMerge,
              modelFoundInCollection,
              newModel,
              addDeferred
            );
            modelReturnList.push(mod);
          });
      }
      if (!force && merge) {
        // Grab the actual model we want to merge from the collection, if the caller has indicated that
        // we aren't forcing an add and we want to merge
        modelFoundInCollection = fillIn
          ? collection._getLocal(modelToTryAndMerge)
          : collection.get(modelToTryAndMerge);
      }
      var modelAdded = mergeAttrs(
        collection,
        modelToTryAndMerge,
        modelFoundInCollection,
        newModel,
        addDeferred
      );
      if (modelAdded) {
        modelReturnList.push(modelAdded);
      }
    } else {
      // Add boolean falses for invalid models
      modelReturnList.push(false);
    }
    return Promise.resolve();
  }

  function _parse(collection, array) {
    // Must stop parsing if coming in from reset or constructor
    if (collection.parse && opt.parse && !opt.noparse) {
      return collection.parse(array);
    }
    return array;
  }

  if (!fillIn && (this.IsVirtual() || deferred)) {
    var self = this;
    return new Promise(function (allResolve, allReject) {
      var doTask = function (loc) {
        return new Promise(function (resolve, reject) {
          doAdd(self, modelArray[loc], true).then(function () {
            resolve(loc + 1);
          }, reject);
        });
      };

      var currentStep = Promise.resolve(0);

      modelArray = _parse(self, modelArray);
      for (i = 0; i < modelArray.length; i++) {
        currentStep = currentStep.then(doTask);
      }
      currentStep.then(function () {
        if (addedModels.length > 0) {
          self.TriggerInternal(opt.silent, Events.EventType.ALLADDED, self, addedModels, opt);
        }
        allResolve(Collection._returnModels(modelReturnList));
      }, allReject);
    });
  }

  modelArray = _parse(this, modelArray);
  for (i = 0; i < modelArray.length; i++) {
    doAdd(this, modelArray[i], false);
  }
  if (addedModels.length > 0) {
    this.TriggerInternal(opt.silent, Events.EventType.ALLADDED, this, addedModels, opt);
  }
  return Collection._returnModels(modelReturnList);
};

/**
 * @private
 */
Collection._returnModels = function (modelReturnList) {
  if (modelReturnList.length === 1) {
    return modelReturnList[0];
  }
  return modelReturnList;
};

/**
 * @private
 */
Collection.prototype._hasComparator = function () {
  return Collection._defined(this.comparator);
};

/**
 * Sort the models in the collection.  For virtual collections, any locally stored models are cleaned out in
 * preparation for new fetches sending server-sorted models down to the client.  No fetch is automatically
 * performed.<p>
 * For non-virtual collections, the models are sorted based on the comparator property.<p>
 * See [comparator}{@link Collection#comparator}<p>
 * For virtual collections, all sorting must be handled by the server.  If the string (attribute) comparator and
 * sortDirection are set, then this information
 * will be passed back via URL parameters, or passed to the customURL callback for application-construction of the
 * appropriate URL.  Function-based custom comparators are ignored in virtual collections.
 * Events:<p>
 * Fires a sort event, passing the collection and options<p>
 * @param {Object=} options <b>silent</b>: if true, do not fire the sort event<br>
 * <b>startIndex</b>: if provided, and if collection is virtual, do a fetch of startIndex+fetchSize immediately
 * after the sort and return a promise.  See [comparator}{@link Collection#setRangeLocal}<p>
 * @return {Promise|null} if virtual and if startIndex is provided in options, a promise Object that resolves upon
 * completion.  The promise will be passed an Object containing start and count properties that represent
 * the *actual* starting position (start), count (count), and array (models) of the Models fetched, which may be
 * fewer than what was requested.  The promise will be rejected on an error and will pass the ajax status,
 * xhr object, error, and collection, if relevant.
 *
 * @memberof Collection
 * @ojsignature  [{target: "Type", value:"{silent?: boolean, startIndex?: number, [propName: string]: any}", for: "options"},
 *                {target: "Type", value: "Promise<Collection.SetRangeLocalPromise>|null", for: "returns"}]
 * @since 1.0.0
 * @export
 */
Collection.prototype.sort = function (options) {
  var opt = options || {};
  var silent = opt.silent;
  var comparator = this.comparator;
  var self;
  var eventOpts;

  // Check for comparator
  if (!this._hasComparator()) {
    return null;
  }

  // This is a no-op in case of virtualization: we should just clear things out so that
  // any elements will be refetched
  if (this.IsVirtual()) {
    var totalResults = this.totalResults;
    if (this._hasTotalResults()) {
      // Make sure to set up the array if the length changes (i.e., from 0 to totalResults--need to
      // preallocate)
      this._setModels(new Array(totalResults), true);
    } else {
      // No totalresults
      this._setModels([], true);
      this._resetLRU();
      this._setLength();
    }
    eventOpts = opt.add ? { add: true } : null;
    this.TriggerInternal(silent, Events.EventType.SORT, this, eventOpts, null);
    var startIndex = opt.startIndex;
    if (startIndex !== undefined && startIndex !== null) {
      return this.setRangeLocal(startIndex, this._getFetchSize(opt));
    }
    return null;
  }

  self = this;
  this._getModels().sort(function (a, b) {
    return Collection.SortFunc(a, b, comparator, self, self);
  });
  this._realignModelIndices(0);
  // Indicate this sort is due to an add
  eventOpts = opt.add ? { add: true } : null;
  this.TriggerInternal(silent, Events.EventType.SORT, this, eventOpts, null);
  return null;
};

/**
 * @private
 */
Collection._getKey = function (val, attr) {
  if (val instanceof Model) {
    return val.get(attr);
  }
  return RestImpl.GetPropValue(val, attr);
};

/**
 * @private
 */
Collection.SortFunc = function (a, b, comparator, collection, self) {
  var keyA;
  var keyB;
  var i;
  var retVal;

  if ($.isFunction(comparator)) {
    // How many args?
    if (comparator.length === 1) {
      // "sortBy" comparator option
      keyA = comparator.call(self, a);
      keyB = comparator.call(self, b);
      var attrs1 = oj.StringUtils.isString(keyA) ? keyA.split(',') : [keyA];
      var attrs2 = oj.StringUtils.isString(keyB) ? keyB.split(',') : [keyB];
      for (i = 0; i < attrs1.length; i++) {
        retVal = Collection._compareKeys(attrs1[i], attrs2[i], collection.sortDirection);
        if (retVal !== 0) {
          return retVal;
        }
      }
    }
    // "sort" comparator option
    return comparator.call(self, a, b);
  }
  // String option
  if (oj.StringUtils.isString(comparator)) {
    var attrs = comparator.split(',');

    for (i = 0; i < attrs.length; i++) {
      keyA = Collection._getKey(a, attrs[i]);
      keyB = Collection._getKey(b, attrs[i]);
      retVal = Collection._compareKeys(keyA, keyB, collection.sortDirection);
      if (retVal !== 0) {
        return retVal;
      }
    }
  }
  return 0;
};

/**
 * Return the index at which the given model would be inserted, using the collection comparator See
 * [sort}{@link Collection#sort}.  Not supported for virtual collections.
 *
 * @param {string|function(Model,Model=):Object=} comparator optional comparator to override the default
 * @returns {number} index at which model would be inserted.  -1 if no comparator
 * @throws {Error} when called on a virtual collection
 * @memberof Collection
 * @export
 * @since 1.0.0
 */
Collection.prototype.sortedIndex = function (model, comparator) {
  var comp = comparator || this.comparator;
  var self;
  var test;

  // Check for comparator
  if (!comp) {
    return -1;
  }

  this._throwErrIfVirtual('sortedIndex');

  self = this;
  test = function (a, b) {
    var keyA;
    var keyB;

    if ($.isFunction(comp)) {
      // How many args?
      if (comp.length === 1) {
        // "sortBy" comparator option
        keyA = comp.call(self, a);
        keyB = comp.call(self, b);
        var attrs1 = oj.StringUtils.isString(keyA) ? keyA.split(',') : [keyA];
        var attrs2 = oj.StringUtils.isString(keyB) ? keyB.split(',') : [keyB];
        var retVal;
        var i;
        for (i = 0; i < attrs1.length; i++) {
          retVal = Collection._compareKeys(attrs1[i], attrs2[i], self.sortDirection);
          if (retVal !== 0) {
            return retVal;
          }
        }
      }
      // "sort" comparator option
      return comp.call(self, a, b);
    }
    // String option
    if (oj.StringUtils.isString(comp)) {
      keyA = a.get(comp);
      keyB = b.get(comp);
      return Collection._compareKeys(keyA, keyB, self.sortDirection);
    }
    return 0;
  };
  return Collection._find(this._getModels(), model, test);
};

/**
 * Binary search and return the index at which model would be inserted into sorted modelArray
 * @private
 */
Collection._find = function (modelArray, model, comparator) {
  function search(min, max) {
    var cid;
    var id;
    var mid;

    if (min > max) {
      return -1;
    }

    cid = model.GetCid();
    id = model.GetId();
    if (modelArray[min].Match(id, cid)) {
      return min;
    }
    if (modelArray[max].Match(id, cid)) {
      return max;
    }

    mid = Math.floor((max + min) / 2);
    if (comparator(modelArray[mid], model) === -1) {
      return search(min + 1, mid);
    }
    if (comparator(modelArray[mid], model) === 1) {
      return search(mid, max - 1);
    }
    return mid;
  }

  return search(0, modelArray.length - 1);
};

/**
 * @private
 */
Collection._compareKeys = function (keyA, keyB, sortDirection) {
  if (sortDirection === -1) {
    if (keyA < keyB) {
      return 1;
    }
    if (keyB < keyA) {
      return -1;
    }
  } else {
    if (keyA > keyB) {
      return 1;
    }
    if (keyB > keyA) {
      return -1;
    }
  }
  return 0;
};

/**
 * Add the given model to the front of the collection<br>
 * For events that may be fired, see [add]{@link Collection#add}.<br>
 * @param {Model|Object} m model (or set of attribute/value pairs) to add to the beginning of the collection
 * @param {Object=} options See [add]{@link Collection#add}
 * @returns {Promise.<Array>|Array.<Model>} The model or models added to the collection.  If
 * deferred or virtual, return the model or models added in a promise when the set has completed
 * @memberof Collection
 * @ojsignature [{target: "Type", value:"{silent?: boolean, at?: number, merge?: boolean, sort?: boolean, force?: boolean, deferred?: boolean,
 *               [propName: string]: any}", for: "options"},
 *               {target: "Type", value: "Promise<Array<Model>>|Array<Model>", for: "returns"}]
 * @export
 * @since 1.0.0
 */
Collection.prototype.unshift = function (m, options) {
  // Like an add but set 'at' to zero if not specified
  var opt = {};
  oj.CollectionUtils.copyInto(opt, options || {});
  if (!opt.at) {
    opt.at = 0;
  }
  this._manageLRU(1);
  return this._handlePromise(this._addInternal(m, opt, false, opt.deferred));
};

/**
 * @private
 */
Collection.prototype._handlePromise = function (result) {
  if ($.isFunction(result.then)) {
    return this._addPromise(function () {
      return result;
    });
  }
  return result;
};

/**
 * Remove the first model from the collection and return it.<br>
 * For events that may be fired, see [remove]{@link Collection#remove}.<br>
 * @param {Object=} options same as remove
 * @property {boolean=} silent if set, do not fire events
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual whether it is or not
 * @return {Model|Promise.<Model>|null} model that was removed.  If this is a virtual collection, this will return a promise
 *                  which will resolve passing the model value that was removed
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.shift = function (options) {
  var opt = options || {};
  var deferred = this._getDeferred(opt);
  var retVal;
  if (this.IsVirtual() || deferred) {
    var self = this;
    return this._atInternal(0, opt, false, true).then(function (model) {
      retVal = self._removeInternal(model, 0, opt);
      self.TriggerInternal(opt.silent, Events.EventType.ALLREMOVED, self, [retVal], opt);

      return retVal;
    });
  }
  retVal = this._removeInternal(this.at(0), 0, opt);
  this.TriggerInternal(opt.silent, Events.EventType.ALLREMOVED, this, [retVal], opt);
  return retVal;
};

/**
 * @export
 * @desc Return an array of models found in the Collection, excepting the last n.
 * @memberof Collection
 * @param {number=} n number of models to leave off the returned array; defaults to 1
 * @return {Array.<Model>} array of models from 0 to the length of the collection - n - 1
 * @throws {Error} when called on a virtual collection
 * @since 1.0.0
 */
Collection.prototype.initial = function (n) {
  var index = n === undefined ? 1 : n;

  this._throwErrIfVirtual('initial');

  var array = [];
  var i;
  for (i = 0; i < this._getLength() - index; i += 1) {
    array.push(this.at(i));
  }
  return array;
};

/**
 * @private
 */
Collection.prototype._getDeferred = function (options) {
  var opt = options || {};
  return opt.deferred;
};

/**
 * Return the last model in the collection.  If n is passed in, then the last n models are returned as an array
 * Note that if the collection is virtual, and totalResults is not returned by the server, the results returned
 * by last can be difficult to predict.  They depend on the fetch sizes, last known offset of a fetch, etc.
 * If code is using a server that does not return totalResults the use of last is not recommended.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 * @param {number=} n number of models to return.  Defaults to 1
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual whether it is or not
 * @return {Promise.<Model>|Array.<Model>|null} array of n models from the end of the Collection.  If this is a virtual collection,
 *                             this will return a promise which will resolve passing the array or single model
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.last = function (n, options) {
  var deferred = this._getDeferred(options);
  var index = n === undefined ? 1 : n;
  var len;

  if (index === 1) {
    len = this._getModelsLength();
    if (len === 0) {
      len = index;
    }
    if (len > 0) {
      return this._atInternal(len - 1, options, false, deferred);
    }
    return null;
  }

  var array = [];
  var i;
  len = this._getLength();
  if (deferred || this.IsVirtual()) {
    // Loop using deferred
    var start = len - n;

    // Handle edge or no totalResults cases
    if (start < 0) {
      start = 0;
    }
    if (len === 0) {
      // No totalresults, probably
      len = n;
    }

    var self = this;
    return this._addPromise(function () {
      return self.IterativeAt(start, len);
    });
  }

  for (i = len - n; i < len; i += 1) {
    array.push(this.at(i));
  }
  return array;
};

/**
 * Loop calling at() in a deferred way and return a promise to be resolved when all the elements are sequentially
 * fetched
 * @protected
 */
Collection.prototype.IterativeAt = function (start, end) {
  var array = [];
  var i;
  var self = this;
  return new Promise(function (allResolve, allReject) {
    var doTask = function (index) {
      // Make sure we're not asking beyond what we know the server can deliver, if virtual
      if (self.IsVirtual() && self._hasTotalResults() && index >= self.totalResults) {
        return Promise.resolve(index + 1);
      }
      return new Promise(function (resolve, reject) {
        self._deferredAt(index, null).then(function (model) {
          array.push(model);
          resolve(index + 1);
        }, reject);
      });
    };

    var currentStep = Promise.resolve(start);
    for (i = start; i < end; i++) {
      currentStep = currentStep.then(doTask);
    }
    currentStep.then(function () {
      allResolve(array);
    }, allReject);
  });
};

/**
 * @private
 */
Collection.prototype._getDefaultFetchSize = function (n) {
  if (n === undefined || n === null) {
    return this[Collection._FETCH_SIZE_PROP];
  }

  return n;
};

/**
 * @private
 */
Collection.prototype._calculateNextStart = function () {
  var lastFetch = this.lastFetchCount;
  if (lastFetch === undefined || lastFetch === null) {
    lastFetch = this[Collection._FETCH_SIZE_PROP];
  }
  if (this.offset === undefined || this.offset === null) {
    // Assume zero offset (0+lastFetch)
    return lastFetch;
  }
  return this.offset + lastFetch;
};

/**
 * Fetch the next set of models from the server.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 *
 * @param {number} n number of models to fetch.  If undefined or null, the collection will attempt to use the
 * overall [fetchSize]{@link Collection#fetchSize} property value
 * @param {Object=} options Options to control next<p>
 *                  <b>success</b>: a user callback called when the fetch has completed successfully. This makes
 *                  the fetch an asynchronous process. The callback is called passing the Collection object, raw
 *                  response, and the options argument.<br>
 *                  <b>error</b>: a user callback function called if the fetch fails. The callback is called
 *                  passing the collection object, xhr, and options arguments.<br>
 * @return {Object|null} xhr ajax object, by default.  null if nothing to fetch (the success callback will still be
 * called).  Note if [sync]{@link Collection#sync} has been replaced, this would be the value returned by the
 * custom implementation.
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{success?: (collection: Collection, response: any, options: object)=> void,
 *                                                  error?: (collection: Collection, xhr: any, options: object)=> void, [propName: string]: any}", for: "options"}
 * @export
 */
Collection.prototype.next = function (n, options) {
  var opt = options || {};
  opt[Collection._FETCH_SIZE_PROP] = this._getDefaultFetchSize(n);

  var start = this._calculateNextStart();
  var length = this._getLength();
  if (length === 0 && opt[Collection._FETCH_SIZE_PROP] > 0) {
    // If we have a fetch size and we have no length let next() do a fetchSize fetch starting at zero to
    // kick things off
    start = 0;
  } else if (start >= length) {
    // No op -- still call success because the items are already fetched.
    var self = this;
    if (opt.success) {
      opt.success.call(Model.GetContext(opt, self), self, null, opt);
    }

    return null;
  }
  opt.startIndex = start;
  return this.fetch(opt);
};

/**
 * @private
 */
Collection.prototype._calculatePrevStart = function (n) {
  if (this.offset === undefined || this.offset === null) {
    // Assume zero: we can't back up beyond that so if the offset wasn't set there's nothing to do
    return 0;
  }
  return this.offset - n;
};

/**
 * Fetch the previous set of models from the server.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 * @param {number} n number of models to fetch.  If undefined or null, the collection will attempt to use the
 * overall fetchSize property value
 * @param {Object=} options Options to control previous<p>
 *                  <b>success</b>: a user callback called when the fetch has completed successfully. This makes
 *                  the fetch an asynchronous process. The callback is called passing the Collection object, raw
 *                  response, and the options argument.<p>
 *                  <b>error</b>: a user callback function called if the fetch fails. The callback is called
 *                  passing the collection object, xhr, and options arguments.<p>
 * @return {Object} xhr ajax object, by default. null if there is nothing earlier to fetch (no fetch has happened
 * or the last fetch started at 0).  The success callback will still be called.  Note if
 * [sync]{@link Collection#sync} has been replaced, this would be the value returned by the custom
 * implementation.
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{success?: (collection: Collection, response: any, options: object)=> void,
 *                                                  error?: (collection: Collection, xhr: any, options: object)=> void, [propName: string]: any}", for: "options"}
 * @export
 */
Collection.prototype.previous = function (n, options) {
  var opt = options || {};
  if (this.offset === 0) {
    // No op -- still call success (if we've fetched before--lastFetchCount is other than zero) because the
    // items are already fetched.
    var self = this;
    if (opt.success && this.lastFetchCount) {
      opt.success.call(Model.GetContext(opt, self), self, null, opt);
    }

    return null;
  }
  opt[Collection._FETCH_SIZE_PROP] = this._getDefaultFetchSize(n);
  var start = this._calculatePrevStart(opt[Collection._FETCH_SIZE_PROP]);
  if (start < 0) {
    // Only fetch from 0 to the last fetch's starting point...
    opt[Collection._FETCH_SIZE_PROP] = this.offset;
    start = 0;
  }
  opt.startIndex = start;
  return this.fetch(opt);
};

/**
 * Set or change the number of models held at any one time
 *
 * @param {number} n maximum number of models to keep at a time
 * @return {undefined}
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.setModelLimit = function (n) {
  this.modelLimit = n;
  // Clean out down to the new limit, if necessary
  this._manageLRU(0);
};

/**
 * @private
 */
Collection.prototype._getModelLimit = function () {
  return this.modelLimit;
};

/**
 * Set or change the number of models to fetch with each server request
 *
 * @param {number} n number of models to fetch with each request
 * @return {undefined}
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.setFetchSize = function (n) {
  this[Collection._FETCH_SIZE_PROP] = n;
};

/**
 * Return the array of models found in the Collection starting with index n.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 * @param {number=} n index at which to start the returned array of models.  Defaults to 1.
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual whether it is or not
 * @return {Array.<Model>|Promise} array of models from the collection.  If this is a virtual collection, or
 *                  if deferred is passed as true, return a promise which resolves passing the array of models.
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.rest = function (n, options) {
  var deferred = this._getDeferred(options);
  var index = n === undefined ? 1 : n;

  var array = [];
  var i;
  // TODO
  if (this.IsVirtual() || deferred) {
    var self = this;
    return this._addPromise(function () {
      return self.IterativeAt(index, self._getLength());
    });
  }

  for (i = index; i < this._getLength(); i += 1) {
    array.push(this.at(i));
  }
  return array;
};

/**
 * Remove a model from the collection, if found.<br>
 * Events:<p>
 * <ul>
 * <b>remove</b>: fired for each model removed, passing the model removed, collection, and options<br>
 * <b>allremoved</b>: fired after all models have been removed, passing the collection, array of models removed,
 * and options<br>
 * </ul>
 * <p>
 * @param {Model|Array.<Model>} m model object or array of models to remove.
 * @param {Object=} options
 * @property {boolean=} silent if set, do not fire events
 * @return {Array.<Model>|Model} an array of models or single model removed
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.remove = function (m, options) {
  var opt = options || {};
  var modArray = [];
  var mod;

  if (m instanceof Array) {
    modArray = m;
  } else {
    modArray.push(m);
  }

  var modsRemoved = [];
  for (mod = modArray.length - 1; mod >= 0; mod -= 1) {
    // Done to keep array in order matching one passed in--we do removal in reverse
    modsRemoved.unshift(this._removeInternal(modArray[mod], -1, opt));
  }
  this.TriggerInternal(opt.silent, Events.EventType.ALLREMOVED, this, modArray, opt);
  return Collection._returnModels(modsRemoved);
};

/**
 * @private
 */
Collection.prototype._removeInternal = function (model, index, options) {
  var optCopy = options || {};
  var modInfo = index === -1 ? this._getInternal(model) : Collection._getModinfo(index, model);
  var silent = optCopy.silent;

  var n = modInfo.index;
  if (n > -1) {
    var mod = modInfo.m;
    // only unset the collection setting if it's mine
    if (mod !== undefined && mod.GetCollection() === this) {
      mod.SetCollection(null);
    }
    this._spliceModels(n, 1);
    this._setLength();
    var opt = {};
    oj.CollectionUtils.copyInto(opt, optCopy);
    opt.index = n;
    if (mod !== undefined) {
      mod.TriggerInternal(silent, Events.EventType.REMOVE, mod, this, opt);
    }
    // Unlisten after event fired
    this._unlistenToModel(mod);
  }
  return modInfo.m;
};

/**
 * @private
 */
Collection.prototype._unlistenToModel = function (m) {
  if (m !== undefined) {
    m.off(null, null, this);
  }
};

/**
 * @private
 */
Collection.prototype._listenToModel = function (m) {
  m.OnInternal(Events.EventType.ALL, this._modelEvent, this, false, true);
};

/**
 * Handle model destroyed events via the all listener
 * @private
 */
Collection.prototype._modelEvent = function (event, model, collection, options) {
  if (event === Events.EventType.DESTROY) {
    this.remove(model);
  }

  // Don't process general events if we're not the target
  if (collection !== undefined && collection instanceof Collection && collection !== this) {
    return;
  }

  // Throw up to the collection
  var silent = options && options.silent;
  this.TriggerInternal(silent, event, model, collection, options);
};

/**
 * Clear all data from the collection and refetch (if non-virtual).  If virtual, clear all data.
 * If fetch() cannot be called (e.g., there is no URL) then the caller must reload the collection wtih data.
 * The existing data is still cleared.
 * Events (if silent is not set):<p>
 * <ul>
 * <b>refresh</b>: fired passing the collection and options<br>
 * For more events that may be fired if the collection is not virtual, see [fetch]{@link Collection#fetch}.
 * </ul>
 * <p>
 * @param {Object=} options user options<p>
 *                          <b>silent</b>: if set, do not fire a refresh event<p>
 * <b>startIndex</b>: if provided, and if collection is virtual, do a fetch of startIndex+fetchSize immediately
 * after the refresh and return a promise.  See [comparator}{@link Collection#setRangeLocal}<p>
 * @return {Promise.<undefined|Object>} promise object resolved when complete (in case there is a fetch for non-virtual mode).  If
 * startIndex is provided as an option, the returned promise resolution is the same as setRangeLocal.
 * @ojsignature  {target: "Type", value: "Promise<Collection.SetRangeLocalPromise|undefined>", for: "returns"}
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{silent?: boolean, startIndex?: number, [propName: string]: any}", for: "options"}
 * @export
 */
Collection.prototype.refresh = function (options) {
  var optCopy = options || {};

  var self = this;
  var silent;
  return this._addPromise(function () {
    return new Promise(function (resolve, reject) {
      if (!self.IsVirtual()) {
        silent = optCopy.silent !== undefined && optCopy.silent;
        try {
          // Do a reset, with silent
          self.reset(null, { silent: true });
          // Local: do a fetch to fill back up
          // In case options are passed to refresh-->fetch
          var opt = {};
          Object.keys(optCopy).forEach(function (prop) {
            if (Object.prototype.hasOwnProperty.call(optCopy, prop)) {
              opt[prop] = optCopy[prop];
            }
          });
          opt.success = function (collection, response, successOpts) {
            self.TriggerInternal(silent, Events.EventType.REFRESH, self, successOpts, null);
            resolve({ collection: collection, response: response, options: successOpts });
          };
          opt.error = function (collection, error, xhr, optarg, status) {
            reject(Collection._createRejectionError(xhr, status, error, self, optCopy, false));
          };
          self._fetchInternal(opt, -1, false);
          return;
        } catch (e) {
          // This is OK if it's a URLError: just fire the event: local collection without custom sync
          if (e instanceof URLError) {
            // if it's a completely local collection, it's a no-op other than the event
            self.TriggerInternal(silent, Events.EventType.REFRESH, self, optCopy, null);
            resolve({ collection: self, options: optCopy });
            return;
          }
          throw e;
        }
      }
      // Virtual
      var startIndex = optCopy.startIndex;

      self._setModels([], true);
      self._resetLRU();

      // Clear totalresults.
      self.totalResults = undefined;
      self._setLength();

      silent = optCopy.silent !== undefined && optCopy.silent;
      self.TriggerInternal(silent, Events.EventType.REFRESH, self, optCopy, null);
      if (startIndex === undefined || startIndex === null) {
        startIndex = 0;
      }
      if (startIndex !== undefined && startIndex !== null) {
        // Do a set range local
        self._setRangeLocalInternal(startIndex, self._getFetchSize(optCopy)).then(
          function (actual) {
            resolve(actual);
          },
          function (err) {
            reject(err);
          }
        );
      } else {
        resolve(undefined);
      }
    });
  });
};

/**
 * Remove and replace the collection's entire list of models with a new set of models, if provided. Otherwise,
 * empty the collection.  totalResults is reset when no new data is passed in, set to the new length in the
 * non-virtual case if data is passed in, and left as was in the virtual case if data is passed in.<br>
 * Events (if silent is not set):<p>
 * <ul>
 * <b>reset</b>: fired passing the collection and options.  The new length of the collection should be in effect
 * when the event is fired<br>
 * For events that may be fired if data is passed in, see [add]{@link Collection#add}.
 * </ul>
 * <p>
 * @param {Object=} data Array of model objects or attribute/value pair objects with which to replace the
 * collection's data.
 * @param {Object=} options user options, passed to event, unless silent<br>
 *                          <b>silent</b>: if set, do not fire events<p>
 * @returns {Model|Array.<Model>} The model or models added to the collection, if passed in
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{silent?: boolean, [propName: string]: any}", for: "options"}
 * @export
 */
Collection.prototype.reset = function (data, options) {
  var opts = {};
  oj.CollectionUtils.copyInto(opts, options || {});

  opts.previousModels = this._getModels();

  var index;
  var model;
  for (var i = 0; i < this._modelIndices.length; i++) {
    index = this._modelIndices[i];
    model = this._getModel(index);
    if (model) {
      this._unlistenToModel(model);
      model.SetCollection(null);
    }
  }
  this._setModels([], true);
  this._resetLRU();

  var silent = opts.silent !== undefined && opts.silent;
  if (!data) {
    this._setLength();
    // Clear totalresults
    this.totalResults = undefined;
    this.TriggerInternal(silent, Events.EventType.RESET, this, opts, null);
    return null;
  }

  var retObj = null;
  // Parse collection
  var newData = data;
  if (opts.parse) {
    newData = this.parse(data);
  }

  this._manageLRU(newData instanceof Array ? newData.length : 1);
  opts.noparse = true;
  retObj = this._addInternal(newData, opts, true, false);
  this._setLength();
  this.TriggerInternal(silent, Events.EventType.RESET, this, opts, null);

  return this._handlePromise(retObj);
};

/**
 * Return the model object found at the given index of the collection, or a promise object that will pass the model
 * as an argument when it resolves.<p>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.
 * @param {number} index Index for which to return the model object.
 * @param {Object=} options <b>fetchSize</b>: fetch size to use if the call needs to fetch more records from the
 * server, if virtualized.  Overrides the overall fetchSize setting <br>
 *                  <b>deferred</b>: if true, return a deferred/promise object as described below.  If not
 *                  specified, the type of return value will be determined by whether or not the collection is
 *                  virtual<br>
 *
 * @return {Model|Promise.<Model>|null} Model [model]{@link Model} located at index. If index is out of range, returns null.
 * If this is a virtual collection, or if deferred is specified and true, at will return a Promise object which
 * will resolve passing the model at the given index (or null if out of range)
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{fetchSize?: number, deferred?: boolean, [propName: string]: any}", for: "options"}
 * @export
 */
Collection.prototype.at = function (index, options) {
  var deferred = this._getDeferred(options);
  return this._atInternal(index, options, false, deferred);
};

/**
 * Local indicates that only what's stored locally should be returned (if true)--no fetching
 * @private
 */
Collection.prototype._atInternal = function (index, options, local, deferred) {
  var n = index;
  if (n < 0) {
    // Normalize it using the length-- another BackboneJS test case
    n += this._getLength();
  }

  if (n < 0 || this._overUpperLimit(n)) {
    if (!local && (this.IsVirtual() || deferred)) {
      return this._addPromise(function () {
        return Promise.resolve(null);
      });
    }
    return null;
  }
  var self = this;
  if (!local && (this.IsVirtual() || deferred)) {
    return this._addPromise(function () {
      return self._deferredAt(n, options);
    });
  }
  return this._getModel(n);
};

/**
 * Return a promise, the resolution of which indicates that all promise-returning API in process have completed.
 *
 * @returns {Promise} a promise that when resolved, indicates that all unresolved promise-returning API calls
 * made at the moment of the whenReady have completed
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.whenReady = function () {
  if (this._promises) {
    // If we have an active chain, return it
    return this._promises;
  }
  // Otherwise return an immediately resolved promise that means nothing...
  return Promise.resolve();
};

/**
 * Add a task to a chained list of Promises
 * @private
 */
Collection.prototype._addPromise = function (promiseTask) {
  var self = this;
  // Undefined, so set it up initially
  if (this._promises === undefined) {
    this._promiseCount = 0;
    this._promises = Promise.resolve();
  }
  // Track the number we have left to resolve
  this._promiseCount += 1;
  // Chain this new promise callback task to the end of the list
  this._promises = this._promises.then(promiseTask.bind(self)).then(
    function (arg) {
      // Resolved successfully--decrement our count and clean up if we have none left to resolve
      self._promiseCount -= 1;
      if (self._promiseCount === 0) {
        self._promises = undefined;
        // Fire the ready event
        self.TriggerInternal(false, Events.EventType.READY, self, null, null);
      }
      // Resolve the true promise with the value we're given
      return arg;
    },
    function (error) {
      // Rejected--decrement our count and clean up if we have none left to resolve
      self._promiseCount -= 1;
      if (self._promiseCount === 0) {
        self._promises = undefined;
      }
      // Reject the promise
      return Promise.reject(error);
    }
  );

  // Return the chain with the new promise at the end
  return this._promises;
};

/**
 * Add an xhr to a list of active xhrs
 * @private
 */
Collection.prototype._addxhr = function (xhr) {
  if (xhr && xhr.abort) {
    if (this._xhrs === undefined) {
      this._xhrs = [];
    }
    // Listen to this xhr to know when to remove it
    var self = this;
    this._xhrs.push(xhr);
    xhr.done(function () {
      // Find the xhr
      var loc = self._xhrs ? self._xhrs.indexOf(xhr) : -1;
      if (loc > -1) {
        // Remove it from the list
        self._xhrs.splice(loc, 1);
      }
    });
  }
};

/**
 * Cancel all xhr requests known to this collection as still pending.  Return a promise that is resolved when all of the requests abort, and all
 * the promises tied to those requests resolve with an error
 *
 * @returns {Promise.<null>} a promise that when resolved, indicates that all the open xhr objects generated by this collection have aborted
 * @memberof Collection
 * @since 2.1.0
 * @export
 */
Collection.prototype.abort = function () {
  // Abort all pending XHR requests
  var self = this;
  function createPromise(index, resolve) {
    self._xhrs[index].then(
      function (data, status) {
        if (status === 'abort') {
          // Remove from list
          self._xhrs.splice(index, 1);
          // If this is the last one, resolve the promise we returned
          if (self._xhrs.length === 0) {
            self.whenReady().then(
              function () {
                resolve(null);
              },
              function () {
                resolve(null);
              }
            );
          }
        }
      },
      function () {
        // Remove from list
        self._xhrs.splice(index, 1);
        // If this is the last one, resolve the promise we returned
        if (self._xhrs.length === 0) {
          self.whenReady().then(
            function () {
              resolve(null);
            },
            function () {
              resolve(null);
            }
          );
        }
      }
    );
  }

  if (this._xhrs && this._xhrs.length > 0) {
    return new Promise(function (resolve) {
      // Count down so we can remove them
      for (var i = self._xhrs.length - 1; i >= 0; i--) {
        createPromise(i, resolve);
        self._xhrs[i].abort();
      }
    });
  }
  return Promise.resolve();
};

/**
 * @private
 */
Collection.prototype._deferredAt = function (index, options) {
  var self = this;
  // If it's virtual, we need to see if this item has been fetched or not: if not, we need to fetch it + fetchSize
  var model = self._getModel(index);
  if (model === undefined) {
    return new Promise(function (resolve, reject) {
      // Go fetch
      var opts = {};
      oj.CollectionUtils.copyInto(opts, options || {});
      opts.context = self;
      opts.startIndex = index;
      opts.error = function (collection, error, optarg, xhr, status) {
        // Handle potential errors
        reject(Collection._createRejectionError(xhr, status, error, self, options, false));
      };

      opts.success = function () {
        resolve(self._getModel(index));
      };

      self._fetchInternal(opts, -1, false);
    });
  }
  return new Promise(function (resolve) {
    resolve(model);
  });
};

/**
 * Return the first model object from the collection whose client ID is the given model cid
 * @param {string} clientId Client ID (see Model cid) for which to return the model object, if found.
 * @return {Model|null} First model object in the collection where model.cid = clientId. If none are found,
 * returns null.
 *
 * @throws {Error} when called on a virtual Collection if the item isn't found in memory
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.getByCid = function (clientId) {
  var models = this._getModels();
  var index;
  var foundModel = null;
  for (var i = 0; i < this._modelIndices.length; i++) {
    index = this._modelIndices[i];
    if (models[index] && clientId === models[index].cid) {
      foundModel = models[index];
      break;
    }
  }
  if (foundModel) {
    return foundModel;
  }
  if (this.IsVirtual()) {
    throw new Error('Not found locally and not supported by server for virtual collections');
  }
  return null;
};

/**
 * Return the first model object from the collection whose model id value is the given id or cid, or the id or
 * cid from a passed in model
 * Note this method will not function as expected if the id or cid is not set<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 *
 * @param {Object|string} id ID, cid, or Model (see Model id or cid) for which to return the model object, if found.
 * @param {Object=} options
 * @property {number=} fetchSize fetch size to use if the call needs to fetch more records from the server,
 *                  if virtualized.  Overrides the overall fetchSize setting<p>
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual whether it
 *                  is or not
 * @return {Model|null|Promise.<Model>} First model object in the collection where model.id = id or model.cid = id. If
 *                  none are found, returns null.  If deferred or virtual, return a promise passing the model
 *                  when done
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.get = function (id, options) {
  var deferred = this._getDeferred(options);
  var internalGet = this._getInternal(id, options, deferred);
  if (internalGet) {
    // Is this a deferred object?
    if ($.isFunction(internalGet.then)) {
      return this._addPromise(function () {
        return new Promise(function (resolve, reject) {
          internalGet.then(
            function (modInfo) {
              resolve(modInfo.m);
            },
            function (err) {
              reject(err);
            }
          );
        });
      });
    }
    if (this.IsVirtual()) {
      return this._addPromise(function () {
        return new Promise(function (resolve) {
          resolve(internalGet.m);
        });
      });
    }
    if (Object.prototype.hasOwnProperty.call(internalGet, 'm')) {
      return internalGet.m;
    }
  }
  return null;
};

/**
 * @private
 */
Collection.prototype._getLocal = function (id) {
  var internalGet = this._getLocalInternal(id);
  if (internalGet) {
    return internalGet.m;
  }
  return null;
};

/**
 * @private
 */
Collection.prototype._getLocalInternal = function (id) {
  var cid = id;
  var localId = id;
  if (id instanceof Model) {
    // Get the cid
    cid = id.GetCid();
    // Get the id
    localId = id.GetId();
  } else if (Collection._defined(id) && id.id !== undefined) {
    localId = id.id;
  }
  var foundObj = null;
  var len = this._modelIndices.length;
  var model;
  var models = this._getModels();
  var index;
  for (var i = 0; i < len; i++) {
    index = this._modelIndices[i];
    model = models[index];
    if (model !== undefined && model.Match(localId, cid)) {
      foundObj = Collection._getModinfo(index, model);
      break;
    }
  }
  if (foundObj) {
    return foundObj;
  }
  return Collection._getModinfo(-1, undefined);
};

/**
 * @private
 * @param {Object|null|string} id
 * @param {Object=} options
 * @param {boolean=} deferred
 * @param {boolean=} fillIn
 * @returns {Object}
 */
Collection.prototype._getInternal = function (id, options, deferred, fillIn) {
  var cid = id;
  var localId = id;
  var fill = fillIn === undefined ? false : fillIn;
  if (id instanceof Model) {
    // Get the cid
    cid = id.GetCid();
    // Get the id
    localId = id.GetId();
  } else if (Collection._defined(id) && id.id !== undefined) {
    localId = id.id;
  }

  var foundObj = null;
  var models = this._getModels();
  var index;
  for (var i = 0; i < this._modelIndices.length; i++) {
    index = this._modelIndices[i];
    if (models[index] && models[index].Match(localId, cid)) {
      var retObj = Collection._getModinfo(index, models[index]);
      foundObj = retObj;
      break;
    }
  }

  if (foundObj) {
    if (deferred) {
      return new Promise(function (resolve) {
        resolve(foundObj);
      });
    }
    return foundObj;
  }
  // If virtual, might be undefined because it needs to be fetched
  if (this.IsVirtual()) {
    // Try to fetch using start ID.  cid not supported
    if (localId === undefined && cid !== undefined) {
      return new Promise(function (resolve) {
        resolve(Collection._getModinfo(-1, undefined));
      });
    }
    var self = this;
    return new Promise(function (resolve, reject) {
      var resp = function (response) {
        if (response != null) {
          var ind = self._getOffset();
          // Check that the model at index is the right one
          var model = self._getModel(ind);
          if (model !== undefined && model.Match(localId, cid)) {
            resolve(Collection._getModinfo(ind, model));
          } else {
            resolve(Collection._getModinfo(-1, undefined));
          }
        } else {
          resolve(Collection._getModinfo(-1, undefined));
        }
      };

      // Go fetch
      var opts = {};
      oj.CollectionUtils.copyInto(opts, options || {});
      opts.context = self;
      opts.startID = localId;
      opts.error = function (collection, error, optarg, xhr, status) {
        // Handle potential errors
        reject(Collection._createRejectionError(xhr, status, error, self, options, false));
      };
      opts.success = function (collection, response) {
        resp(response);
      };

      self._fetchInternal(opts, -1, fill);
    });
  }

  var undefinedModInfo = Collection._getModinfo(-1, undefined);
  if (deferred) {
    return new Promise(function (resolve) {
      resolve(undefinedModInfo);
    });
  }
  return undefinedModInfo;
};

/**
 * @private
 */
Collection._getModinfo = function (index, model) {
  return { index: index, m: model };
};

/**
 * @private
 */
Collection.prototype._parseImpl = function (response) {
  // Try to interpret ADFbc like controls where a collection is hanging off a property
  if (response instanceof Array) {
    return response;
  }

  if (!response) {
    return response;
  }

  // See if any of the properties contain arrays
  var prop;
  // eslint-disable-next-line no-restricted-syntax
  for (prop in response) {
    if (Object.prototype.hasOwnProperty.call(response, prop)) {
      if (response[prop] instanceof Array) {
        return response[prop];
      }
    }
  }
  return response;
};

/**
 * Optional callback to parse responses from the server.  It is called with the server's response and should return a response (possibly modified) for processing
 *
 * @type {function(Object):Object}
 * @since 1.0.0
 * @memberof Collection
 * @export
 */
Collection.prototype.parse = Collection.prototype._parseImpl;

/**
 * Determine if actual means we are complete
 * @private
 */
Collection.prototype._checkActual = function (start, count, actual) {
  // Are we at the end with what actually came back?  Then this request should satisfy the setLocalRange
  if (this._hasTotalResults() && actual.start + actual.count >= this.totalResults) {
    return true;
  }
  return actual.start === start && actual.count === count;
};

/**
 *
 * Tell the collection to try and ensure that the given range is available locally.  Note that if the collection
 * is virtual, setRangeLocal may make repeated fetch calls to the server to satisfy the request, stopping only
 * when the range has been made local or the end of the records on the server is reached.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 *
 * @param {number} start starting index to make local
 * @param {number} count number of elements to make local
 * @param {Object=} options Options to control whether events are fired by this call (silent: true)
 * @return {Promise} a promise Object that resolves upon completion.  The promise will be passed an Object
 * containing start and count properties that represent the *actual* starting position (start), count (count),
 * and array (models) of the Models fetched, which may be fewer than what was requested.  The promise will be
 * rejected on an error and will pass the ajax status, xhr object, error, and collection, if relevant.
 * @memberof Collection
 * @ojsignature  [{target: "Type", value:"{silent?: boolean}", for: "options"}, {target: "Type", value: "Promise<Collection.SetRangeLocalPromise>", for: "returns"}]
 * @since 1.0.0
 * @export
 */
Collection.prototype.setRangeLocal = function (start, count, options) {
  var self = this;
  return this._addPromise(function () {
    return self._setRangeLocalInternal(start, count, options);
  });
};

/**
 * @typedef {Object} Collection.SetRangeLocalPromise
 * @property {number} start starting index of fetched models
 * @property {number} count number of models fetched
 * @property {Array.<Model>} models array of models fetched
 * @ojsignature  [{target: "Type", value: "Model[]", for: "models"}]
 *
 * @example <caption>Information about a fetch made from a REST service.  If the return fulfilled a request to get records 20 through 39, for example:</caption>
 * <pre class="prettyprint"><code>
 * {
 *   start: 20,
 *   count: 20,
 *   models: [modelObjects]
 * }
 * </code></pre>
 */

/**
 * @private
 */
Collection.prototype._setRangeLocalInternal = function (start, count, options) {
  if (this.IsVirtual()) {
    // make sure we reconcile the length to what we think the totalresults are--if there have been any non
    // fetched changes in length we don't want to be placing things wrong
    this._resetModelsToFullLength(this.totalResults);
  }
  var actual = this._getLocalRange(start, count);
  var self = this;
  if (this._checkActual(start, count, actual)) {
    return new Promise(function (resolve) {
      resolve(actual);
    });
  }

  // Manage the LRU - set model limit at least as high as the count we're trying to fetch
  var modelLimit = this._getModelLimit();
  if (modelLimit > -1 && modelLimit < count) {
    this.modelLimit = count;
  }
  return new Promise(function (resolve, reject) {
    self._setRangeLocalFetch(
      start,
      count,
      -1,
      { start: start, count: count },
      resolve,
      reject,
      true,
      options
    );
  });
};

/**
 * @private
 */
Collection.prototype._setRangeLocalFetch = function (
  start,
  count,
  placement,
  original,
  resolve,
  reject,
  fill,
  options
) {
  var self = this;
  var localStart = start;
  var resp = function () {
    var actual = self._getLocalRange(original.start, original.count);
    if (fill && self._hasTotalResults() && actual.count < original.count) {
      // The range wasn't fulfilled: try again
      var newPlacement = actual.start + actual.count;
      // Try the next block...don't repeat the request
      var newStart = localStart + (self.lastFetchCount ? self.lastFetchCount : count);
      if (newStart < self.totalResults) {
        self._setRangeLocalFetch(
          newStart,
          count,
          newPlacement,
          original,
          resolve,
          reject,
          fill,
          options
        );
      } else {
        // Can't go any further
        resolve(actual);
      }
    } else {
      resolve(actual);
    }
  };

  // Go fetch
  var limit = localStart + count;
  // Get the greater of the limit-localStart or fetchSize
  if (this[Collection._FETCH_SIZE_PROP] && this[Collection._FETCH_SIZE_PROP] > count) {
    limit = this[Collection._FETCH_SIZE_PROP] + localStart;
  }

  // Now, to optimize, move localStart up to the first undefined model in the sequence
  var opts = null;
  if (this.IsVirtual()) {
    var newStart = this._getFirstMissingModel(localStart, limit);
    if (newStart > localStart) {
      localStart = newStart;
      // Recheck the limit
      limit = localStart + count;
      // Get the greater of the limit-localStart or fetchSize
      if (this[Collection._FETCH_SIZE_PROP] && this[Collection._FETCH_SIZE_PROP] > count) {
        limit = this[Collection._FETCH_SIZE_PROP] + localStart;
      }
    }
    opts = { context: this, startIndex: localStart, fetchSize: limit - localStart };
  } else {
    opts = { context: this };
  }
  opts.error = function (collection, error, optarg, xhr, status) {
    // Handle potential errors
    reject(Collection._createRejectionError(xhr, status, error, self, null, false));
  };
  opts.success = function () {
    resp();
  };
  if (options && options.silent) {
    opts.silent = options.silent;
  }

  try {
    this._fetchInternal(opts, placement, placement > -1);
  } catch (e) {
    // This is OK if it's a URLError: local collection with no means of fetching: just resolve
    if (e instanceof URLError) {
      var actual = self._getLocalRange(localStart, count);
      resolve(actual);
    }
  }
};

/**
 * @private
 */
Collection._createRejectionError = function (xhr, status, error, collection, options, fireError) {
  var silent = false;
  if (options && options.silent) {
    silent = options.silent;
  }
  // To avoid duplication in many cases...
  if (fireError) {
    Model._triggerError(collection, silent, options, status, error, xhr);
  }
  var err = new Error(status);
  err.xhr = xhr;
  err.error = error;
  err.collection = collection;
  err.status = status;
  return err;
};

/**
 * @private
 */
Collection.prototype._getMaxLength = function (start, count) {
  var len = this._getModelsLength();
  if (len === 0) {
    // This is an exception: could be uninitialized
    return start + count;
  }
  return start + count > len ? len : start + count;
};

/**
 * Determine if every element of the given range is filled in locally
 *
 * @param {number} start starting index to check
 * @param {number} count number of elements to check
 * @return {boolean} true if all elements are local, false otherwise
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.isRangeLocal = function (start, count) {
  var localRange = this._getLocalRange(start, count);
  if (this._getModelsLength() === 0) {
    // If we have no models length, then range cannot be thought of as local unless the count
    // is zero--edge case
    return count === 0;
  }
  return (
    start === localRange.start &&
    (count === localRange.count || start + count > this._getModelsLength())
  );
};

/**
 * @private
 */
Collection.prototype._getModelArray = function (start, count) {
  var retArr = [];
  var models = this._getModels();
  var end = start + count;
  for (var i = start; i < end; i++) {
    retArr.push(models[i]);
  }
  return retArr;
};

/**
 * For a given range of models, return the actual range which are local within that set.
 * @private
 */
Collection.prototype._getLocalRange = function (start, count) {
  // Not virtual, local if there are any models
  if (!this.IsVirtual()) {
    if (this._getModelsLength() > 0) {
      if (start + count > this._getModelsLength()) {
        // Over the boundary
        var c = this._getModelsLength() - start;
        return { start: start, count: c, models: this._getModelArray(start, c) };
      }

      return { start: start, count: count, models: this._getModelArray(start, count) };
    }
    return { start: start, count: 0, models: [] };
  }
  var limit = this._getMaxLength(start, count);
  // Adjust for no totalResults
  if (!this._hasTotalResults() && limit < start + count) {
    // We don't know if it's local or not
    return {
      start: start,
      count: limit - start,
      models: this._getModelArray(start, limit - start)
    };
  }
  if (limit === 0) {
    // There nothing here
    return { start: start, count: 0, models: [] };
  }
  var firstMissingModel = this._getFirstMissingModel(start, limit);
  if (firstMissingModel > -1) {
    return {
      start: start,
      count: firstMissingModel - start,
      models: this._getModelArray(start, firstMissingModel - start)
    };
  }
  // Make sure start doesn't overrun the end!
  var localCount = count;
  if (start > limit) {
    localCount = 0;
  } else if (start + localCount > limit) {
    // Make sure that start+count doesn't overrun the end
    localCount = limit - start;
  }
  return { start: start, count: localCount, models: this._getModelArray(start, localCount) };
};

/**
 * Return the first model between start and limit that's undefined
 * @private
 */
Collection.prototype._getFirstMissingModel = function (start, limit) {
  for (var i = start; i < limit; i++) {
    if (this._getModel(i) === undefined) {
      return i;
    }
  }
  return -1;
};

/**
 * Loads the Collection object from the data service URL. Performs a data "read."<p>
 * Events:<p>
 * <ul>
 * <b>request</b>: fired when the request to fetch is going to the server, passing the collection, xhr object, and
 * options<br>
 * <b>sync</b>: fired when the collection is fetched from the data service, passing the collection and the raw
 * response<br>
 * <b>error</b>: fired if there is an error during the fetch, passing the collection, xhr object, options<br>
 * </ul>
 * <p>
 * @param {Object=} options Options to control fetch<p>
 *                  <b>success</b>: a user callback called when the fetch has completed successfully. This makes
 *                  the fetch an asynchronous process. The callback is called passing the Collection object, raw
 *                  response, and the fetch options argument.<br>
 *                  <b>error</b>: a user callback function called if the fetch fails. The callback is called
 *                  passing the Collection, error, fetch options, xhr (if any) and status arguments (if any).<br>
 *                  <b>add</b>: if set, new records retrieved from the data service will be added to those models
 *                  already in the collection. If not set, the records retrieved will be passed to the reset()
 *                  method, effectively replacing the previous contents of the collection with the new data.
 *                  Not supported for virtual/paging cases.<br>
 *                  <b>set</b>: if true, fetch will try to use the set function to try and merge the fetched models
 *                  with those already in the collection, on the client.  The default behavior is to reset the
 *                  collection before adding back in the fetched models.  This default is the reverse of
 *                  Backbone's current default.<br>
 *                  <b>startIndex</b>: numeric index with which to start fetching Models from the server.  The
 *                  page setting controls the number of Models to be fetched.  startID takes precedence over
 *                  startIndex if both are specified.  If both are specified and startID isn't supported then
 *                  startIndex will be used instead.<br>
 *                  <b>startID</b>: unique ID of the Model to start fetching from the server.  The page setting
 *                  controls the number of Models to be fetched.  Note if this is not supported by the server
 *                  then startID will be ignored.<br>
 *                  <b>since</b>: fetch records having a timestamp since the given UTC time<br>
 *                  <b>until</b>: fetch records having a timestamp up to the given UTC time<br>
 *                  <b>fetchSize</b>: use specified page size instead of collection's setting<br>
 * @return {Object} xhr ajax object, by default.  If [sync]{@link Collection#sync} has been replaced, this
 * would be the value returned by the custom implementation.
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{success?: (collection: Collection, response: any, options: object)=> void,
 *                                                  error?: (collection: Collection, error:any, options: object, xhr?: any, status?: any)=> void,
 *                                                  add?: boolean, set?: boolean, startIndex?: number, startID?: any, since?: any,
 *                                                  until?: any, fetchSize?: number, [propName: string]: any}", for: "options"}
 * @export
 */
Collection.prototype.fetch = function (options) {
  var xhr = this._fetchInternal(options, -1, false);
  this._addPromise(function () {
    return Promise.resolve(xhr);
  });
  return xhr;
};

/**
 * fillIn is used to indicate that this fetch is just the result of a get() or part of an add(), etc., when virtual
 * @private
 */
Collection.prototype._fetchInternal = function (options, placement, fillIn) {
  function doReset(collection, opt, fill, totalResults) {
    if (!collection.IsVirtual()) {
      // If we're not doing a "fetch add", delete all the current models
      if (!opt.add && !opt.useset) {
        // Reset with internal model
        collection.reset(null, { silent: true });
      }
    } else if (!fill) {
      // If we're not infilling based on an at, get, etc., delete all the current local models
      collection._resetModelsToFullLength(totalResults);
    }
  }

  var opt = options || {};
  var success = opt.success;
  var self;
  var errFunc = opt.error;

  if (opt.set) {
    opt.useset = !!opt.set;
  }

  // Set up the parsing option
  if (opt.parse === undefined) {
    opt.parse = true;
  }
  self = this;

  opt.error = function (xhr, status, error) {
    Model._triggerError(self, false, options, status, error, xhr);
    if (errFunc) {
      errFunc.call(Model.GetContext(options, self), self, error, options, xhr, status);
    }
  };

  opt.success = function (response) {
    // Run the entire returned dataset through the collection's parser (either default no-op or user specified)
    var data;
    try {
      data = self.parse(response, options);
    } catch (e) {
      Collection._reportError(self, e, opt.error, options);
      return;
    }

    // Pull any virtualization properties out of the response
    var resetTotalResults;
    if (!self._setPagingReturnValues(response, options, data, fillIn)) {
      // totalResults was not calculated: tell the reset
      resetTotalResults = self.totalResults;
    }

    var dataList = null;

    var manageLRU = false;
    var locPlace = placement;
    if (!opt.add && !self.model) {
      // We're not doing a "fetch add" and we don't have a model set on the collection
      if (!fillIn) {
        if (self.IsVirtual()) {
          // Virtual case only
          // Clean out the collection
          doReset(self, opt, fillIn, resetTotalResults);

          // Check for passed in offset
          if (placement === -1) {
            manageLRU = true;
            locPlace = self._getOffset();
          }
          // Put the new data in
          dataList = self._putDataIntoCollection(data, locPlace, manageLRU);
        } else if (opt.useset) {
          // New backbone option to not reset
          self._setInternal(data, false, opt, false);
        } else {
          // Replace the data in the collection with a new set (non virtual)
          self.reset(data, { silent: true });
        }
      }
    } else {
      // We have a model and/or we're doing a "fetch add"
      // Clean out the old models if we're not "adding" or infilling for virtual
      doReset(self, opt, fillIn, resetTotalResults);

      // Parse each returned model (if appropriate), and put it into the collection, either from the
      // zeroth offset if non-virtual or using the appropriate offset if virtual
      try {
        // Check for passed in offset
        if (placement === -1) {
          manageLRU = true;
          locPlace = self._getOffset();
        }
        dataList = self._fillInCollectionWithParsedData(data, locPlace, manageLRU, opt);
      } catch (e) {
        Collection._reportError(self, e, opt.error, options);
        return;
      }
    }
    if (self.IsVirtual()) {
      // Take in the number of records actually fetched
      if (dataList) {
        self.lastFetchCount = dataList.length;
      }
    }

    // Fire the sync event
    var silent = !!opt.silent;
    self.TriggerInternal(silent, Events.EventType.SYNC, self, response, opt);
    // Call the caller's success callback, if specified
    if (success) {
      success.call(Model.GetContext(options, self), self, response, opt);
    }
  };
  // Make the actual fetch call using ajax, etc.
  return this._fetchCall(opt);
};

/**
 * Puts server data into an empty virtual collection using a "silent add"
 * @private
 */
Collection.prototype._putDataIntoCollection = function (data, placement, manageLRU) {
  var dataList;

  if (data) {
    dataList = data instanceof Array ? data : [data];

    var addOpt = {};
    // Only manage the LRU if we're not trying to achieve a range
    if (manageLRU) {
      this._manageLRU(dataList.length);
    }
    var insertPos = placement;
    var virtual = this.IsVirtual();
    var prevItem = null;
    for (var i = 0; i < dataList.length; i += 1) {
      if (virtual) {
        addOpt = { at: insertPos };
        prevItem = this._atInternal(insertPos, null, true, false);
      }
      // Don't fire add events
      addOpt.silent = true;
      this._addInternal(dataList[i], addOpt, true, false);
      // If virtual, make sure the item was really added where we thought--in other words, what's there now
      // shouldn't match what was there otherwise could be duplicate id and don't increment counter
      if (this._atInternal(insertPos, null, true, false) !== prevItem) {
        insertPos += 1;
      }
    }
  }
  return dataList;
};

/**
 * Parse each model returned, if appropriate, and push them into the (empty) collection with appropriate offsets
 * if virtual
 * @private
 */
Collection.prototype._fillInCollectionWithParsedData = function (
  data,
  placement,
  manageLRU,
  options
) {
  var opt = options || {};
  var parse = opt.parse;
  var modelInstance = Collection._createModel(this);
  var dataList = null;

  if (data) {
    dataList = data instanceof Array ? data : [data];

    var addOpt = {};
    var parsedModel;

    // Only manage the LRU if we're not trying to achieve a range
    if (manageLRU) {
      this._manageLRU(dataList.length);
    }
    var virtual = this.IsVirtual();
    var i;
    if (opt.useset && !virtual) {
      // New backbone option
      for (i = 0; i < dataList.length; i += 1) {
        if (modelInstance && parse) {
          parsedModel = modelInstance.parse(dataList[i]);
        } else {
          parsedModel = dataList[i];
        }

        dataList[i] = parsedModel;
      }
      this._setInternal(dataList, false, opt, false);
    } else {
      var prevItem = null;
      var insertPos = placement;
      for (i = 0; i < dataList.length; i += 1) {
        if (modelInstance && parse) {
          parsedModel = modelInstance.parse(dataList[i]);
        } else {
          parsedModel = dataList[i];
        }

        if (virtual) {
          addOpt = { at: insertPos };
          prevItem = this._atInternal(insertPos, addOpt, true, false);
        }
        // Don't fire add events
        addOpt.silent = true;
        this._addInternal(parsedModel, addOpt, true, false);
        // If virtual, make sure the item was really added where we thought--in other words, what's there
        // now shouldn't match what was there otherwise could be duplicate id and don't increment counter
        if (this._atInternal(insertPos, null, true, false) !== prevItem) {
          insertPos += 1;
        }
      }
    }
  }
  return dataList;
};

/**
 * @private
 */
Collection._reportError = function (collection, e, errorFunc, options) {
  error(e.toString());
  if (errorFunc) {
    errorFunc.call(Model.GetContext(options, collection), collection, e, options);
  }
};

/**
 * Used in virtualization to conduct server-based searches: returns list of fetched models via a promise but does
 * not add them to the collection model list
 * @private
 */
Collection.prototype._fetchOnly = function (options) {
  var opt = options || {};
  var success = opt.success;
  var parsedModel;
  var self;

  if (opt.parse === undefined) {
    opt.parse = true;
  }
  self = this;

  opt.success = function (response) {
    var i;
    var modelInstance;
    var dataList = null;
    var fetchedModels = [];

    var data;
    try {
      data = self.parse(response, options);
    } catch (e) {
      Collection._reportError(self, e, opt.error, options);
      return;
    }

    if (!opt.add && !self.model) {
      dataList = data instanceof Array ? data : [data];
    } else {
      modelInstance = Collection._createModel(self);

      if (data) {
        dataList = data instanceof Array ? data : [data];

        for (i = 0; i < dataList.length; i += 1) {
          if (modelInstance && opt.parse) {
            try {
              parsedModel = modelInstance.parse(dataList[i]);
            } catch (e) {
              Collection._reportError(self, e, opt.error, options);
              return;
            }
          } else {
            parsedModel = dataList[i];
          }
          fetchedModels.push(self._newModel(parsedModel));
        }
      }
    }

    self.TriggerInternal(false, Events.EventType.SYNC, self, response, opt);
    if (success) {
      success.call(Model.GetContext(options, self), self, fetchedModels, opt);
    }
  };
  return this._fetchCall(opt);
};

/**
 * @private
 */
Collection.prototype._fetchCall = function (opt) {
  try {
    return Model._internalSync('read', this, opt);
  } catch (e) {
    // Some kind of error: trigger an error event
    Model._triggerError(this, false, opt, null, e, null);
    throw e;
  }
};

/**
 * @private
 */
Collection.prototype._resetModelsToFullLength = function (totalResults) {
  if (totalResults !== undefined && this._getModelsLength() !== totalResults) {
    // Make sure to set up the array if the length changes (i.e., from 0 to totalResults--need to preallocate)
    this._setModels(new Array(totalResults), true);
    this._resetLRU();
    this._setLength();
    return true;
  }
  return false;
};

/**
 * @private
 */
Collection.prototype._getFetchSize = function (options) {
  var opt = options || {};
  return opt[Collection._FETCH_SIZE_PROP] || this[Collection._FETCH_SIZE_PROP];
};

/**
 * Are we doing virtualization/paging?
 * @protected
 */
Collection.prototype.IsVirtual = function () {
  return this._getFetchSize(null) > -1;
};

/**
 * @private
 */
Collection.prototype._getReturnProperty = function (
  customObj,
  response,
  property,
  optionValue,
  defaultValue
) {
  var value = parseInt(Collection._getProp(customObj, response, property), 10);
  if (value === undefined || value === null || isNaN(value)) {
    // use fetchsize
    return optionValue || defaultValue;
  }
  return value;
};

/**
 * @private
 */
Collection.prototype._cleanTotalResults = function (totalResults) {
  // In case server (incorrectly) passes back a -1, treat it as undefined
  if (totalResults === -1) {
    return undefined;
  }
  return totalResults;
};

/**
 * Parse out some of the paging return values we might expect in a virtual response
 * Return true if totalResults was calculated on a rest call that has none
 * @private
 */
Collection.prototype._setPagingReturnValues = function (response, options, data, fillIn) {
  var customObj = {};
  // See if there's a custom call out
  if (this.customPagingOptions) {
    customObj = this.customPagingOptions.call(this, response);
    if (!customObj) {
      customObj = {};
    }
  }
  // What limit was actually used to generate this response?
  var opt = options || {};
  this.lastFetchSize = this._getReturnProperty(
    customObj,
    response,
    'limit',
    opt.fetchSize,
    this.fetchSize
  );

  // What offset was actually used to generate this response?
  this.offset = this._getReturnProperty(customObj, response, 'offset', opt.startIndex, 0);

  // How many records actually came back?
  this.lastFetchCount = this._getReturnProperty(
    customObj,
    response,
    'count',
    this.lastFetchCount,
    this.lastFetchCount
  );

  // What is the total number of records possible for this collection?
  this.totalResults = this._cleanTotalResults(
    this._getReturnProperty(
      customObj,
      response,
      'totalResults',
      this.totalResults,
      this.totalResults
    )
  );

  // Is there more?
  this.hasMore = this._getHasMore(
    Collection._getProp(customObj, response, 'hasMore'),
    this.offset,
    this.lastFetchSize,
    this.totalResults
  );

  // Adjust total results to account for the case where the server tells us there's no more data, and
  // totalResults wasn't set by the server...but don't do it for simple gets/adds
  var retVal = false;
  if (!fillIn) {
    // We want to know if the server *actually* returned values for these things, not if they defaulted above
    var totalResultsReturned = this._cleanTotalResults(
      parseInt(Collection._getProp(customObj, response, 'totalResults'), 10)
    );
    var lastFetchCountReturned = parseInt(Collection._getProp(customObj, response, 'count'), 10);
    this.totalResults = this._adjustTotalResults(
      totalResultsReturned,
      this.hasMore,
      this.offset,
      lastFetchCountReturned,
      data && Array.isArray(data) ? data.length : 0
    );
    retVal =
      totalResultsReturned === undefined ||
      isNaN(totalResultsReturned) ||
      totalResultsReturned === null;
  }

  // Was fetchSize set?  If not, set it to limit
  if (
    !this.IsVirtual() &&
    this.totalResults &&
    this.totalResults !== this.lastFetchCount &&
    this.lastFetchSize
  ) {
    this.setFetchSize(this.lastFetchSize);
  }
  return retVal;
};

/**
 * @private
 */
Collection.prototype._adjustTotalResults = function (
  totalResultsReturned,
  hasMore,
  offset,
  lastFetchCount,
  dataLength
) {
  // Fix for : if hasMore is false, and totalResults wasn't set by the server, we should set it to
  // the last thing fetched here.  There is no more.
  if (!hasMore) {
    // No more data, per server
    if (isNaN(totalResultsReturned)) {
      // TotalResults was not returned by the server here
      // If lastFetchCount was set, use that as the final total.  Otherwise, use the length of data passed
      // in...all + offset
      var count = !isNaN(lastFetchCount) ? lastFetchCount : dataLength;
      return count + offset;
    }
  }
  return this.totalResults;
};

/**
 * @private
 */
Collection.prototype._getHasMore = function (hasMore, offset, lastFetchSize, totalResults) {
  if (Collection._defined(hasMore)) {
    return hasMore;
  }
  // Special case: return true if totalResults not defined
  if (totalResults === undefined || totalResults === null) {
    return true;
  }
  // Not there: figure it out.  It's true unless we're walking off the end
  return !(offset + lastFetchSize > totalResults);
};

/**
 * @private
 */
Collection._getProp = function (custom, response, prop) {
  if (Object.prototype.hasOwnProperty.call(custom, prop)) {
    return custom[prop];
  }
  return response ? response[prop] : undefined;
};

/**
 * @private
 */
Collection.prototype._getOffset = function () {
  return Collection._defined(this.offset) ? this.offset : 0;
};

/**
 * Creates a new model, saves it to the data service, and adds it on to the collection.<p>
 * Events:<p>
 * <ul>
 * <b>add</b>: fired when the model is added, passing the collection, model added, and options, if not silent<br>
 * <b>alladded</b>: fired after all models have been added, passing the collection, array of models added, and
 * options<br>
 * <b>request:</b>: fired when the request to save is going to the server<br>
 * <b>sync:</b>: fired when the model is saved to the data service, passing the model and the raw response<br>
 * </ul>
 * @param {Object=} attributes Set of attribute/value pairs with which to initialize the new model object, or a new
 * Model object
 * @param {Object=} options Options to control save (see [save]{@link Model#save}), or add (see
 * [add]{@link Collection#add}).  Plus:<p>
 *                          <b>deferred</b>: if true, return a promise as though this collection were virtual
 *                          whether it is or not<br>
 * @return {Model|boolean|Promise.<Model>} new model or false if validation failed.  If virtual, returns a promise that
 * resolves with the new model
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{silent?: boolean, at?: number, merge?: boolean, sort?: boolean, force?: boolean, deferred?: boolean,
 *               [propName: string]: any}", for: "options"}
 * @export
 */
Collection.prototype.create = function (attributes, options) {
  var self = this;
  var opt = options || {};
  var deferred = this._getDeferred(opt);

  function doSave(collection, newModel, validate, localOpt) {
    newModel.save(attributes instanceof Model ? null : attributes, localOpt);

    return newModel;
  }

  function doAdd(newModel, addOpts) {
    if (opt.wait) {
      // Don't do adding now
      if (self.IsVirtual() || deferred) {
        return self._addPromise(function () {
          return Promise.resolve(undefined);
        });
      }
      return null;
    }
    return self.add(newModel, addOpts);
  }

  // Save the user's context and callback, if any
  var newModel = this._newModel(attributes, true, opt, false);
  var callback = opt.success;
  var context = opt.context;
  var validate = opt.validate;
  opt.context = this;
  opt.success = function (model, resp, successOpts) {
    // Make sure we pass xhr
    if (successOpts.xhr) {
      opt.xhr = successOpts.xhr;
    }
    if (opt.wait) {
      // Trigger delayed add events
      self.add(newModel, opt);
    }
    if (callback) {
      callback.call(context != null ? context : self, model, resp, opt);
    }
  };

  // Did validation pass?
  if (newModel == null) {
    return false;
  }

  // Force a save in case user has set value of idAttribute on the new Model
  opt.forceNew = newModel.GetId() != null;

  var addOpts = Model._copyOptions(opt);

  newModel.SetCollection(this);
  if (deferred || this.IsVirtual()) {
    return new Promise(function (resolve) {
      addOpts.merge = true;
      addOpts.deferred = true;
      doAdd(newModel, addOpts).then(function () {
        opt.success = function (model, resp, successOpts) {
          // Make sure we pass xhr
          if (successOpts.xhr) {
            opt.xhr = successOpts.xhr;
          }
          if (opt.wait) {
            // Trigger delayed add event
            // Force the add if virtual because we know it was successfully saved: we
            // don't want to go back to the server to check
            if (self.IsVirtual()) {
              addOpts.force = true;
            }
            self.add(newModel, addOpts).then(function () {
              if (callback) {
                callback.call(context != null ? context : self, model, resp, opt);
              }
              resolve(model);
            });
          } else {
            if (callback) {
              callback.call(context != null ? context : self, model, resp, opt);
            }
            resolve(model);
          }
        };
        var model = doSave(self, newModel, validate, opt);
        // make sure that success is called first if successful...promise resolved
        // second
        if (!model) {
          // Failed: make sure we resolve the promise.  Otherwise promise will
          // be resolved by success call, above
          resolve(model);
        }
      });
    });
  }

  addOpts.merge = true;
  doAdd(newModel, addOpts);
  return doSave(this, newModel, validate, opt);
};

/**
 * Return a list of all the values of attr found in the collection
 *
 * @param {string} attr attribute to return
 * @return {Array.<Object>} array of values of attr
 *
 * @throws {Error} when called on a virtual collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.pluck = function (attr) {
  var arr = [];
  var i;

  this._throwErrIfVirtual('pluck');

  for (i = 0; i < this._getLength(); i += 1) {
    arr.push(this.at(i).get(attr));
  }
  return arr;
};

/**
 * Return an array of models that contain the given attribute/value pairs.  Note that this function, along with
 * findWhere, expects server-resolved filtering to return *all* models that meet the criteria, even in virtual
 * cases.  The fetchSize will be set to the value of totalResults for this call to indicate that all should
 * be returned.<br>
 * Events: for events, if virtual, see [fetch]{@link Collection#fetch}
 *
 * @param {Object|Array.<Object>} attrs attribute/value pairs to find.  The attribute/value pairs are ANDed together.  If
 *                             attrs is an array of attribute/value pairs, then these are ORed together
 *                             If the value is an object (or an array of objects, in which case the single
 *                             attribute must meet all of the value/comparator conditions), then if it has both
 *                             'value' and 'comparator' parameters these will be interpreted as
 *                             expressions needing custom commparisons.  The comparator value may either be a
 *                             string or a comparator callback function.  Strings are only valid where the
 *                             filtering is sent back to the data service (virtual collections).  In the case of
 *                             a comparator function, the function always takes the signature function(model,
 *                             attr, value), and for non-virtual collections, is called for each
 *                             Model in the collection with the associated attribute and value.  The function
 *                             should return true if the model meets the attribute/value condition, and false if
 *                             not.  For cases where the filtering is to be done on the server, the function will
 *                             be called once per attr/value pair with a null model, and the function should
 *                             return the string to pass as the comparison in the expression for the filtering
 *                             parameter in the URL sent back to the server.  Note that the array of value object
 *                             case is really only meaningful for server-evaluated filters where a complex
 *                             construction on a single attribute might be needed (e.g., x>v1 && x <=v2)
 *                             For example:<p>
 *                             {Dept:53,Name:'Smith'}<br>
 *                             will return an array of models that have a Dept=53 and a Name=Smith, or, for
 *                             server-filtered collections, a ?q=Dept=53+Name=Smith parameter will be sent with
 *                             the URL.<p>
 *                             [{Dept:53},{Dept:90}]<br>
 *                             will return all models that have a Dept of 53 or 90.  Or, ?q=Dept=53,Dept=90 will
 *                             be sent to the server.<p>
 *                             {Dept:{value:53,comparator:function(model, attr, value) { return model.get(attr) !==
 *                             value;}}}<br>
 *                             will return all models that do not have a Dept of 53.<p>
 *                             {Dept:{value:53,comparator:'<>'}}<br>
 *                             For server-evaluated filters, a parameter ?q=Dept<>53 will be sent with the URL.
 *                             This form is an error on locally-evaluated colleection filters<p>
 *                             {Dept:{value:53,comparator:function(model, attr, value) { return "<>";}}}<br>
 *                             expresses the same thing for server-evaluated filters<p>
 *                             {Dept:[{value:53,comparator:'<'},{value:90,comparator:'<'}]}<br>
 *                             For server-evaluated filters, a parameter ?q=Dept>53+Dept<93 will be sent to the
 *                             server<p>
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual
 * whether it is or not<p>
 *
 * @return {Array.<Model>|Promise.<Array>} array of models.  If virtual or deferred, a promise that resolves with the returned
 * array from the server
 * @ojsignature  {target: "Type", value: "Promise<Array<Model>>|Array<Model>", for: "returns"}
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.where = function (attrs, options) {
  return this._handlePromise(this._whereInternal(attrs, options));
};

/**
 * @private
 */
Collection.prototype._whereInternal = function (attrs, options) {
  var opt = options || {};
  var deferred = this._getDeferred(opt);
  var self = this;
  if (this.IsVirtual()) {
    return new Promise(function (resolve, reject) {
      var success = function (collection, fetchedModels) {
        resolve(fetchedModels);
      };
      // Send the attributes for a server-based filter; also indicate that we need *all* the attributes.
      // In the standard REST URL construction this is accomplished by leaving off fetchSize/start indices,
      // etc.
      var opts = {
        query: attrs,
        all: true,
        success: success,
        error: function (xhr, status, error) {
          reject(Collection._createRejectionError(xhr, status, error, self, opt, true));
        }
      };
      self._fetchOnly(opts);
    });
  }

  var arr = [];
  var i;
  var m;
  for (i = 0; i < this._getLength(); i += 1) {
    m = this.at(i);
    if (m.Contains(attrs)) {
      arr.push(m);
    }
  }
  if (deferred) {
    return new Promise(function (resolve) {
      resolve(arr);
    });
  }
  return arr;
};

/**
 * Return a collection of models that contain the given attribute/value pairs.
 * Note that this returns a non-virtual collection with all the models returned by the server,
 * even if the original collection is virtual.  Virtual collections doing filtering on the server should return
 * all models that meet
 * the critera.  See [where]{@link Collection#where}
 * See [where]{@link Collection#where} for complete documentation of events and parameters
 * @param {Object|Array.<Object>} attrs attribute/value pairs to find.  The attribute/value pairs are ANDed together.  If
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual
 * whether it is or not<p>
 *
 * @return {Collection|Promise.<Collection>} A collection containing models with given attribute/value pairs.  If virtual or
 * deferred, a promise that resolves with the collection returned by the server
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.whereToCollection = function (attrs, options) {
  var opt = options || {};
  var deferred = this._getDeferred(opt);
  var self = this;
  if (this.IsVirtual() || deferred) {
    return self._addPromise(function () {
      return new Promise(function (resolve, reject) {
        return self._whereInternal(attrs, opt).then(
          function (models) {
            var collection = self._makeNewCollection(models);
            resolve(collection);
          },
          function (err) {
            reject(err);
          }
        );
      });
    });
  }

  var models = this._whereInternal(attrs, opt);
  var newCollection = this._makeNewCollection(models);
  newCollection[Collection._FETCH_SIZE_PROP] = -1;
  newCollection._setLength();
  return newCollection;
};

/**
 * @private
 */
Collection.prototype._makeNewCollection = function (models) {
  var collection = this._cloneInternal(false);
  collection._setModels(models, false);
  collection._resetLRU();
  collection._setLength();
  return collection;
};

/**
 * @private
 */
Collection.prototype._throwErrIfVirtual = function (func) {
  if (this.IsVirtual()) {
    throw new Error(func + ' not valid on a virtual Collection');
  }
};

/**
 * Return an array whose entries are determined by the results of calling the passed iterator function.  The
 * iterator will be called for each model in the collection
 *
 * @param {function(Model):Object} iterator function to determine the mapped value for each model
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Array.<Object>} array of values determined by the return value of calls made to iterator for each model
 *
 * @throws {Error} when called on a virtual Collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.map = function (iterator, context) {
  var retArr = [];
  var value;

  this._throwErrIfVirtual('map');

  this._getModels().forEach(function (model) {
    value = iterator.call(context || this, model);
    retArr.push(value);
  });
  return retArr;
};

/**
 * @desc Iterates over the models in the collection and calls the given iterator function
 *
 * @param {function(Model)} iterator function to call for each model
 * @param {Object=} context context with which to make the calls on iterator
 * @return {undefined}
 *
 * @throws {Error} when called on a virtual collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.each = function (iterator, context) {
  this._throwErrIfVirtual('each');

  this._getModels().forEach(iterator, context);
};

/**
 * Return the length of the collection
 * @returns {number} length of the collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.size = function () {
  return this._getLength();
};

/**
 * Return the models sorted determined by the iterator function (or property, if a string value).  If a function,
 * the function should return the attribute by which to sort.
 *
 * @param {string|function(Model):string} iterator method called or property used to get the attribute to sort by.
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Array.<Model>} models sorted using iterator
 * @throws {Error} when called on a virtual collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.sortBy = function (iterator, context) {
  var retArr = [];
  var self;

  this._throwErrIfVirtual('sortBy');

  this._getModels().forEach(function (model) {
    retArr.push(model);
  });
  self = this;

  retArr.sort(function (a, b) {
    var keyA;
    var keyB;

    if ($.isFunction(iterator)) {
      // "sortBy" comparator option
      keyA = iterator.call(context || self, a);
      keyB = iterator.call(context || self, b);
      return Collection._compareKeys(keyA, keyB, self.sortDirection);
    }
    // String option
    keyA = a.get(iterator);
    keyB = b.get(iterator);
    return Collection._compareKeys(keyA, keyB, self.sortDirection);
  });

  return retArr;
};

/**
 * @desc Return the collection with models grouped into sets determined by the iterator function (or property, if
 * a string value)
 *
 * @param {string|function(Model):Object} iterator method called or property (if a string) used to get the group key
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Object} models grouped into sets
 *
 * @throws {Error} when called on a virtual collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.groupBy = function (iterator, context) {
  var retObj = {};
  var groupVal;

  this._throwErrIfVirtual('groupBy');

  this._getModels().forEach(function (model) {
    if ($.isFunction(iterator)) {
      groupVal = iterator.call(context || this, model);
    } else {
      groupVal = model.get(iterator);
    }
    if (retObj[groupVal] === undefined) {
      retObj[groupVal] = [];
    }
    retObj[groupVal].push(model);
  }, this);
  return retObj;
};

/**
 * @desc Return an object with models as values for their properties determined by the iterator function or
 * property string
 *
 * @param {string|function(Model)} iterator method called or property (if a string) used to get the index attribute
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Object} models listed as property values where the properties are the values returned by iterator or
 * the attribute value given by the iterator string
 *
 * @throws {Error} when called on a virtual collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.indexBy = function (iterator, context) {
  var retObj = {};
  var index;

  this._throwErrIfVirtual('indexBy');

  this._getModels().forEach(function (model) {
    if ($.isFunction(iterator)) {
      index = iterator.call(context || this, model);
    } else {
      index = model.get(iterator);
    }
    retObj[index] = model;
  }, this);
  return retObj;
};

/**
 * Return the "minimum" model in the collection, as determined by calls to iterator.  The return value of
 * iterator (called with a model passed in) will be compared against the current minimum
 *
 * @param {function(Model):Object} iterator function to determine a model's value for checking for the minimum
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Model} "Minimum" model in the collection
 *
 * @throws {Error} when called on a virtual Collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.min = function (iterator, context) {
  var minModel = {};
  var minModelValue;
  var currValue;

  this._throwErrIfVirtual('min');

  if (this._getModelsLength() === 0) {
    return null;
  }
  // Get vals started
  minModel = this._getModel(0);
  minModelValue = iterator.call(context || this, this._getModel(0));

  this._getModels().forEach(function (model, i) {
    if (i >= 1) {
      currValue = iterator.call(context || this, model);
      if (currValue < minModelValue) {
        minModel = model;
        minModelValue = currValue;
      }
    }
  }, this);
  return minModel;
};

/**
 * Return the "maximum" model in the collection, as determined by calls to iterator.  The return value of
 * iterator (called with a model passed in) will be compared against the current maximum
 *
 * @param {function(Model):Object} iterator function to determine a model's value for checking for the maximum
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Model} "Maximum" model in the collection
 *
 * @throws {Error} when called on a virtual collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.max = function (iterator, context) {
  var maxModel = {};
  var maxModelValue;
  var currValue;

  this._throwErrIfVirtual('max');
  if (this._getModelsLength() === 0) {
    return null;
  }
  // Get vals started
  maxModel = this._getModel(0);
  maxModelValue = iterator.call(context, this._getModel(0));

  this._getModels().forEach(function (model, i) {
    if (i >= 1) {
      currValue = iterator.call(context || this, model);
      if (currValue > maxModelValue) {
        maxModel = model;
        maxModelValue = currValue;
      }
    }
  }, this);
  return maxModel;
};

/**
 * @export
 * @desc Return an array of models that cause passed-in iterator to return true
 * @memberof Collection
 *
 * @param {function(Model)} iterator function to determine if a model should be included or not.  Should return
 * true or false
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Array.<Model>} array of models that caused iterator to return true
 *
 * @throws {Error} when called on a virtual Collection
 * @since 1.0.0
 */
Collection.prototype.filter = function (iterator, context) {
  var retArr = [];

  this._throwErrIfVirtual('filter');

  this._getModels().forEach(function (model) {
    if (iterator.call(context || this, model)) {
      retArr.push(model);
    }
  });
  return retArr;
};

/**
 * Return an array of models minus those passed in as arguments
 * @param {...Model} var_args models models to remove from the returned array
 * @returns {Array.<Model>} array of models from the collection minus those passed in to models
 *
 * @throws {Error} when called on a virtual Collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
// eslint-disable-next-line
Collection.prototype.without = function (var_args) {
  var retArr = [];
  var j;
  var id;
  var cid;
  var add;

  this._throwErrIfVirtual('without');

  var model;
  // Test each model in the collection
  for (var i = 0; i < this._getModels().length; i++) {
    add = true;
    model = this._getModel(i);
    for (j = 0; j < arguments.length; j += 1) {
      // Get the cid
      cid = arguments[j].GetCid();
      // Get the id
      id = arguments[j].GetId();
      if (model.Match(id, cid)) {
        // If it's found, don't return it--we're "subtracting" those from the return value, which starts
        // as all models in the collection
        add = false;
        break;
      }
    }
    if (add) {
      retArr.push(model);
    }
  }
  return retArr;
};

/**
 * Return an array of models in the collection but not passed in the array arguments
 * @param {...Array.<Model>} var_args models arrays of models to check against the collection
 * @returns {Array.<Model>} array of models from the collection not passed in as arguments
 * @ojsignature {target: "Type", for: "var_args", value: "Model[][]"}
 *
 * @throws {Error} when called on a virtual Collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
// eslint-disable-next-line
Collection.prototype.difference = function (var_args) {
  var retArr = [];
  var j;
  var k;
  var id;
  var cid;
  var add;

  this._throwErrIfVirtual('difference');

  var model;
  for (var i = 0; i < this._getModels().length; i++) {
    add = true;
    model = this._getModel(i);
    for (j = 0; j < arguments.length; j += 1) {
      // Each argument is assumed to be an array of Models
      for (k = 0; k < arguments[j].length; k++) {
        // Get the cid
        cid = arguments[j][k].GetCid();
        // Get the id
        id = arguments[j][k].GetId();
        if (model.Match(id, cid)) {
          add = false;
          break;
        }
      }
      if (!add) {
        // We found this model somewhere in the arguments--we're not going to add it so get out
        break;
      }
    }
    if (add) {
      retArr.push(model);
    }
  }
  return retArr;
};

/**
 * Determine if the collection has any models
 *
 * @returns {boolean} true if collection is empty
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.isEmpty = function () {
  return this._getLength() === 0;
};

/**
 * @export
 * @desc Return true if any of the models in the collection pass the test made by calling the iterator function
 * parameter
 * @memberof Collection
 *
 * @param {function(Object)} iterator function called with each model to determine if it "passes".  The function
 * should return true or false.
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {boolean} true if any of the models cause the iterator function to return true
 *
 * @throws {Error} when called on a virtual collection
 * @since 1.0.0
 */
Collection.prototype.any = function (iterator, context) {
  this._throwErrIfVirtual('any');

  var model;
  for (var i = 0; i < this._getModelsLength(); i += 1) {
    model = this._getModel(i);
    if (iterator.call(context || this, model)) {
      return true;
    }
  }
  return false;
};

/**
 * @export
 * @desc A version of where that only returns the first element found<br>
 * Events: for events, if virtual, see [fetch]{@link Collection#fetch}<br>
 * @memberof Collection
 * @param {Object|Array.<Object>} attrs attribute/value pairs to find.
 * See [where]{@link Collection#where} for more details and examples.
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual
 * whether it is or not<p>
 *
 * @returns {Model|Promise.<Model>} first model found with the attribute/value pairs.  If virtual or deferred, a promise
 * that resolves with the returned model from the server
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{deferred?: boolean, [propName: string]: any}", for: "options"}
 */
Collection.prototype.findWhere = function (attrs, options) {
  var deferred = this._getDeferred(options);
  var self = this;
  if (this.IsVirtual() || deferred) {
    return this._addPromise(function () {
      return new Promise(function (resolve) {
        self._whereInternal(attrs, options).then(function (modelList) {
          if (modelList && modelList.length > 0) {
            resolve(modelList[0]);
          }
          resolve(null);
        });
      });
    });
  }

  var arr = this._whereInternal(attrs, options);
  if (arr.length > 0) {
    return arr[0];
  }
  return null;
};

/**
 * Return a shallow copy of the models from start to end (if specified), in an array<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 *
 * @param {number} start model to start the return array with
 * @param {number=} end model to end the return array with, if specified (not inclusive).  If not, returns to the
 * end of the collection
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual
 * whether it is or not
 * @return {Array.<Model>|Promise} array of model objects from start to end, or a promise that resolves specifying the
 * returned array when done
 * @memberof Collection
 * @ojsignature  {target: "Type", value: "Promise<Array<Model>>|Array<Model>", for: "returns"}
 * @since 1.0.0
 * @export
 */
Collection.prototype.slice = function (start, end, options) {
  var deferred = this._getDeferred(options);
  var ret = [];
  var i;
  var localEnd = end;
  if (localEnd === undefined) {
    if (this.IsVirtual() && !this._hasTotalResults()) {
      // We can't set the end: throw an error
      throw new Error('End must be set for virtual collections with no totalResults');
    }
    localEnd = this._getModelsLength();
  }

  if (deferred || this.IsVirtual()) {
    var self = this;
    return this._addPromise(function () {
      // Loop using deferred
      return self.IterativeAt(start, localEnd);
    });
  }

  for (i = start; i < localEnd; i += 1) {
    ret.push(this._getModel(i));
  }
  return ret;
};

/**
 * Update the collection with a model or models.  Depending on the options, new models will be added, existing
 * models will be merged, and unspecified models will be removed.
 * The model cid is used to determine whether a given model exists or not.<br>
 * May fire events as specified by [add]{@link Collection#add} or [remove]{@link Collection#remove},
 * depending on the options.
 *
 * @param {Object} models an array of or single model with which to update the collection.  If models contains
 * actual Model objects, then any custom 'parse' function set on the collection needs to take that into
 * account and be prepared to handle an array of Model.
 * @param {Object=} options <b>add</b>:false stops the addition of new models<br>
 *                          <b>remove</b>: false stops the removal of missing models<br>
 *                          <b>merge</b>: false prevents the merging of existing models<br>
 *                          <b>silent</b>: true prevents notifications on adds, removes, etc.<br>
 *                          <b>deferred</b>: if true, return a promise as though this collection were virtual
 *                          whether it is or not
 *
 * @returns {Promise|null} if deferred or virtual, return a promise that resolves when the set has completed
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{add?: boolean, remove?: boolean, merge?: boolean, silent?: boolean, deferred?: boolean,
 *               [propName: string]: any}", for: "options"}
 * @export
 */
Collection.prototype.set = function (models, options) {
  var deferred = this._getDeferred(options);
  return this._setInternal(models, true, options, deferred || this.IsVirtual());
};

Collection._removeAfterSet = function (collection, models, remove, foundModels, options) {
  // Now remove models that weren't found
  // get an array of all models

  // Can't avoid looping over everything because we *have* to clean up even unfetched models, in order to fire
  // events, etc.
  if (remove) {
    for (var i = models.length - 1; i >= 0; i -= 1) {
      if (foundModels.indexOf(i) === -1) {
        collection._removeInternal(models[i], i, options);
      }
    }
  }
};

/**
 * Swap two models, and indicate if anything was actually swapped
 * @private
 */
Collection.prototype._swapModels = function (oldIndex, newIndex, remove, add) {
  if (this._hasComparator() || !remove || !add) {
    return { index: oldIndex, swapped: false };
  }
  // Make sure in range
  var len = this._getModelsLength();
  if (oldIndex >= len || newIndex >= len) {
    return { index: oldIndex, swapped: false };
  }
  // Swap
  var oldModel = this._getModel(oldIndex);
  var newModel = this._getModel(newIndex);
  this._setModel(oldIndex, newModel);
  newModel.SetIndex(oldIndex);
  this._setModel(newIndex, oldModel);
  oldModel.SetIndex(newIndex);

  return { index: newIndex, swapped: newIndex !== oldIndex };
};

/**
 * @private
 */
Collection.prototype._setInternal = function (models, parse, opt, deferred) {
  // Determine if any of the options are set
  var options = opt || {};
  var add = options.add === undefined ? true : options.add;
  var remove = options.remove === undefined ? true : options.remove;
  var merge = options.merge === undefined ? true : options.merge;
  var foundModels = [];
  var currModel = null;
  var i;
  var modelList;

  var mods = parse ? this.parse(models) : models;

  modelList = Array.isArray(mods) ? mods : [mods];

  if (deferred) {
    var self = this;
    return this._addPromise(function () {
      return self._deferredSet(modelList, self._getModels(), options, remove, add, merge, parse);
    });
  }

  // Go through the passed in models and determine what to do
  var swapped = false;
  for (i = 0; i < modelList.length; i += 1) {
    currModel = this._updateModel(
      this._newModel(modelList[i], parse, options, true),
      add,
      merge,
      deferred
    );
    if (currModel !== -1) {
      // And swap it into the position as passed in, if no comparator and we're removing, so that the slots
      // are exact
      var obj = this._swapModels(currModel, i, remove, add);
      var newLoc = obj.index;
      if (obj.swapped) {
        swapped = true;
      }
      // Save its new location as found
      if (foundModels.indexOf(newLoc) === -1) {
        foundModels.push(newLoc);
      }
    }
  }
  if (swapped) {
    var eventOpts = options.add ? { add: true } : null;
    this.TriggerInternal(options.silent, Events.EventType.SORT, this, eventOpts, null);
  }

  Collection._removeAfterSet(this, this._getModels(), remove, foundModels, options);
  return null;
};

/**
 * Handle the updates/removes on virtual collections
 * @private
 */
Collection.prototype._deferredSet = function (
  modelList,
  modelsCopy,
  options,
  remove,
  add,
  merge,
  parse
) {
  var foundModels = [];
  var i;

  // Go through the passed in models and determine what to do
  var self = this;
  return new Promise(function (allResolve, allReject) {
    var doTask = function (index) {
      return new Promise(function (resolve, reject) {
        self
          ._updateModel(self._newModel(modelList[index], parse, options, true), add, merge, true)
          .then(function (currModel) {
            if (currModel !== -1) {
              foundModels.push(currModel);
            }
            resolve(index + 1);
          }, reject);
      });
    };

    var currentStep = Promise.resolve(0);

    for (i = 0; i < modelList.length; i += 1) {
      currentStep = currentStep.then(doTask);
    }
    currentStep.then(function () {
      Collection._removeAfterSet(self, modelsCopy, remove, foundModels, options);
      allResolve(undefined);
    }, allReject);
  });
};

/**
 * Return the index of the given model after updating it, if it was found.  Otherwise it is added and a -1 is
 * returned
 * @private
 */
Collection.prototype._updateModel = function (model, add, merge, deferred) {
  function update(collection, found, def) {
    var index = found ? found.index : -1;
    var foundModel = found ? found.m : null;

    var opt = {};
    if (foundModel) {
      if (merge) {
        // Do merge if not overridden
        opt = { merge: merge };
        if (def) {
          return new Promise(function (resolve) {
            collection._addInternal(model, opt, false, true).then(function () {
              resolve(index);
            });
          });
        }
        collection.add(model, opt);
      }
    } else if (add) {
      if (def) {
        return new Promise(function (resolve) {
          collection._addInternal(model, opt, false, true).then(function () {
            resolve(collection._getLength() - 1);
          });
        });
      }
      collection.add(model);
      index = collection._getLength() - 1;
    }
    return index;
  }

  // Check to see if this model is in the collection
  if (deferred || this.IsVirtual()) {
    var self = this;

    return new Promise(function (resolve) {
      self._getInternal(model, { silent: true }, deferred).then(function (found) {
        update(self, found, true).then(function (index) {
          resolve(index);
        });
      });
    });
  }

  var found = this._getInternal(model);
  return update(this, found, false);
};

/**
 * Return a copy of the Collection's list of current attribute/value pairs.
 *
 * @return {Array.<Object>} an array containing all the Collection's current sets of attribute/value pairs.
 * @throws {Error} when called on a virtual collection
 *
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.toJSON = function () {
  var retArr = [];

  this._throwErrIfVirtual('toJSON');

  this._getModels().forEach(function (model) {
    retArr.push(model.toJSON());
  });
  return retArr;
};

/**
 * Return the first model object in the collection, or an array of the first n model objects from the collection.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 * @param {number=} n Number of model objects to include in the array, starting with the first.
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual whether it is or not
 * @return {Array.<Model>|null|Promise} An array of n model objects found in the collection, starting with the first. If n
 * is not included, returns all of the collection's models as an array.  If deferred or virtual, returns a promise
 * that resolves with the array or model
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.first = function (n, options) {
  var deferred = this._getDeferred(options);
  var elementCount = this._getLength();
  var retArray = [];
  var i;
  var self = this;

  var num = n;
  if (num) {
    elementCount = num;
  } else {
    num = 1;
  }

  var virtual = this.IsVirtual() || deferred;

  if (num === 1) {
    if (virtual) {
      return this._addPromise(function () {
        return self._deferredAt(0, null);
      });
    }

    if (this._getModelsLength() > 0) {
      return this._getModel(0);
    }
    return null;
  }

  if (elementCount > this._getModelsLength()) {
    if (this.IsVirtual() && !this._hasTotalResults()) {
      // Virtual, no total results: don't restrict elementCount
    } else {
      elementCount = this._getModelsLength();
    }
  }

  if (virtual) {
    return this._addPromise(function () {
      return self.IterativeAt(0, elementCount);
    });
  }

  for (i = 0; i < elementCount; i += 1) {
    retArray.push(this._getModel(i));
  }
  return retArray;
};

/**
 * Return the array index location of the given model object.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 * @param {Model|string} model Model object (or Model id) to locate
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual
 * whether it is or not
 * @return {number|Promise.<number>} The index of the given model object, or a promise that will resolve with the index
 * when complete.  If the object is not found, returns -1.
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.indexOf = function (model, options) {
  var location;
  var deferred = this._getDeferred(options);

  if (this.IsVirtual() || deferred) {
    var self = this;
    return this._addPromise(function () {
      return self._getInternal(model, null, true).then(function (loc) {
        return loc.index;
      });
    });
  }
  location = this._getInternal(model);

  return location.index;
};

/**
 * Determine if the given model object is present in the collection.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link Collection#fetch}.<br>
 * @param {Object} model Model object (or Model id) to locate
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual
 * whether it is or not
 * @return {boolean|Promise.<boolean>} true if the model is contained in the collection, false if not. If deferred, a
 * promise that will resolve with true or false when complete.
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.contains = function (model, options) {
  var location;
  var deferred = this._getDeferred(options);

  if (this.IsVirtual() || deferred) {
    var self = this;
    return this._addPromise(function () {
      return self._getInternal(model, null, true).then(function (loc) {
        return loc.index > -1;
      });
    });
  }
  location = this._getInternal(model);

  return location.index > -1;
};

/**
 * An alias for [contains]{@link Collection#contains}
 * @param {Object} model Model object (or Model id) to locate
 * @param {Object=} options
 * @property {boolean=} deferred if true, return a promise as though this collection were virtual
 * whether it is or not
 * @return {boolean|Promise.<boolean>} true if the model is contained in the collection, false if not. If deferred, a
 * promise that will resolve with true or false when complete.
 * @kind function
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.include = Collection.prototype.contains;

// Only look on models already fetched
Collection.prototype._localIndexOf = function (model) {
  var location = this._getLocalInternal(model);

  return location !== undefined ? location.index : -1;
};

/**
 * Remove the last model from the collection and return it<br>
 * For events that may be fired if the collection is virtual, see [remove]{@link Collection#remove}.<br>
 * @param {Object=} options Options for the method:<p>
 * <b>silent</b>: if set, do not fire a remove event <br>
 * <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not<br>
 * @return {Model|Promise.<Model>} the model that was removed, or a promise that will resolve with the model that was
 * removed when complete
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{silent?: boolean, deferred?: boolean, [propName: string]: any}", for: "options"}
 * @export
 */
Collection.prototype.pop = function (options) {
  var deferred = this._getDeferred(options);
  if (this.IsVirtual() || deferred) {
    var self = this;
    return this._atInternal(this._getLength() - 1, options, false, true).then(function (model) {
      self.remove(model, options);
      return model;
    });
  }

  var m = /** @type {Model} */ (this.at(this._getLength() - 1));
  this.remove(m, options);
  return m;
};

/**
 * Add the given model to the end of the Collection<br>
 * For events that may be fired if the collection is virtual, see [add]{@link Collection#add}.<br>
 * @param {Model|Object} m model to add to the end of the Collection (or a set of attribute value pairs)
 * @param {Object=} options same options as [add]{@link Collection#add}
 * @return {Promise.<Array>|undefined} if deferred or virtual, a promise that will be resolved when the function is done.  Otherwise
 * undefined
 * @memberof Collection
 * @ojsignature [{target: "Type", value:"{silent?: boolean, at?: number, merge?: boolean, sort?: boolean,
 *                                        force?: boolean, deferred?: boolean, [propName: string]: any}", for: "options"},
 *               {target: "Type", value: "Promise<Array<Model>>|undefined", for: "returns"}]
 * @since 1.0.0
 * @export
 */
Collection.prototype.push = function (m, options) {
  var deferred = this._getDeferred(options);
  this._manageLRU(1);
  return this._handlePromise(this._addInternal(m, options, false, deferred));
};

/**
 * Returns the index of the last location of the given model.  Not supported in virtual cases.
 * @param {Model} model Model object to locate
 * @param {number=} fromIndex optionally start search at the given index
 * @return {number} The last index of the given model object.  If the object is not found, returns -1.
 * @throws {Error} when called on a virtual collection
 * @memberof Collection
 * @since 1.0.0
 * @export
 */
Collection.prototype.lastIndexOf = function (model, fromIndex) {
  var i;
  var locIndex = fromIndex;

  this._throwErrIfVirtual('lastIndexOf');

  if (locIndex === undefined) {
    locIndex = 0;
  }

  for (i = this._getLength() - 1; i >= locIndex; i -= 1) {
    if (oj.Object.__innerEquals(model, this.at(i))) {
      return i;
    }
  }
  return -1;
};

/**
 * @private
 */
Collection.prototype._getSortAttrs = function (sortStr) {
  if (sortStr === undefined) {
    return [];
  }
  return sortStr.split(',');
};

/**
 * Return a URL query string based on an array of or a single attr/value pair set
 * @private
 */
Collection._getQueryString = function (q) {
  function expression(left, right, compare) {
    return left + compare + right;
  }

  function processQuery(query, input) {
    var exp;
    var str = input;
    Object.keys(query || {}).forEach(function (prop) {
      if (Object.prototype.hasOwnProperty.call(query, prop)) {
        var val = Array.isArray(query[prop]) ? query[prop] : [query[prop]];
        for (var j = 0; j < val.length; j++) {
          if (Model.IsComplexValue(val[j])) {
            var value = val[j].value;
            var compare = null;
            var comparator = val[j].comparator;
            if ($.isFunction(comparator)) {
              compare = comparator(null, prop, value);
            } else {
              compare = comparator;
            }
            exp = expression(prop, value, compare);
          } else {
            exp = expression(prop, query[prop], '=');
          }
          str += exp + '+';
        }
      }
    });
    // Remove trailing '+'
    str = str.substring(0, str.length - 1) + ',';
    return str;
  }

  var queries = Array.isArray(q) ? q : [q];
  var str = '';
  var i;
  for (i = 0; i < queries.length; i++) {
    str = processQuery(queries[i], str);
  }
  // Remove trailing ','
  if (str.substring(str.length - 1) === ',') {
    return str.substring(0, str.length - 1);
  }
  return str;
};

/**
 * @protected
 */
Collection.prototype.ModifyOptionsForCustomURL = function (options) {
  var opt = {};
  Object.keys(options || {}).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      opt[prop] = options[prop];
    }
  });
  var comparator = this.comparator;
  if (comparator && oj.StringUtils.isString(comparator)) {
    var attrs = this._getSortAttrs(comparator);
    for (var i = 0; i < attrs.length; i++) {
      if (i === 0) {
        opt.sort = attrs[i];
      } else {
        opt.sort += ',' + attrs[i];
      }
    }
    opt.sortDir = this._getSortDirStr();
  }
  // Put fetchSize on if appropriate, and not already set
  if (this.IsVirtual()) {
    opt[Collection._FETCH_SIZE_PROP] = this._getFetchSize(opt);
  }
  return opt;
};

/**
 * Determine if this collection is URL-based
 * @private
 */
Collection.prototype.IsUrlBased = function (options) {
  var customURL = this.customURL;
  if ($.isFunction(customURL)) {
    return true;
  }
  var url = this.GetCollectionFetchUrl(options);
  return Collection._defined(url);
};

/**
 * Build a URL with parameters for the collection fetch
 * @protected
 */
Collection.prototype.GetCollectionFetchUrl = function (opt) {
  var url = RestImpl.GetPropValue(this, 'url');

  // Adorn it with options, if any
  if (this.IsVirtual()) {
    var options = opt || {};
    var all = options.all;

    // Put in page size
    var limit = null;
    if (all) {
      var totalResults = this.totalResults;
      limit = totalResults || this._getFetchSize(options);
    } else {
      limit = this._getFetchSize(options);
    }
    if (url && url.indexOf('?') > -1) {
      // Already have a param coming in
      url += '&';
    } else {
      url += '?';
    }
    url += 'limit=' + limit;

    if (!all) {
      if (Collection._defined(options.startIndex)) {
        url += '&offset=' + options.startIndex;
      }
      if (options.startID) {
        url += '&fromID=' + options.startID;
      }
      if (options.since) {
        url += '&since=' + options.since;
      }
      if (options.until) {
        url += '&until=' + options.until;
      }
    }
    // Query
    if (options.query) {
      var queryString = Collection._getQueryString(options.query);
      if (queryString && queryString.length > 0) {
        url += '&q=' + queryString;
      }
    }

    // Add sorting
    var comparator = this.comparator;
    if (comparator && oj.StringUtils.isString(comparator)) {
      var attrs = this._getSortAttrs(comparator);
      var sortDirStr = this._getSortDirStr();
      var i;
      for (i = 0; i < attrs.length; i++) {
        if (i === 0) {
          url += '&orderBy=' + attrs[i] + ':' + sortDirStr;
        } else {
          url += ',' + attrs[i] + ':' + sortDirStr;
        }
      }
    }
    // Always ask for totalresults
    url += '&totalResults=true';
  }
  return url;
};

/**
 * @private
 */
Collection.prototype._getSortDirStr = function () {
  if (this.sortDirection === -1) {
    return 'desc';
  }
  return 'asc';
};

/**
 * Called to perfrom server interactions, such as reading the collection.  Designed to be overridden by users.
 *
 * @param {string} method "read"
 * @param {Collection} collection the collection to be read (fetched)
 * @param {Object=} options to control sync<br>
 * <b>success</b>: called if sync succeeds.  Called with the data being fetched<br>
 * <b>error</b>: called if sync fails.  Called with xhr, status, and error info, per jQuery Ajax (all if
 * available)<br>
 * @return {Object} xhr response from ajax by default
 * @memberof Collection
 * @since 1.0.0
 * @ojsignature {target: "Type", value:"{success?: (response?: any)=> void,
 *                                                  error?: (xhr: any, status: any, error: any)=> void, [propName: string]: any}", for: "options"}
 */
Collection.prototype.sync = function (method, collection, options) {
  return oj.sync(method, collection, options);
};

/**
 * Constants
 * @private
 */
Collection._FETCH_SIZE_PROP = 'fetchSize';

/**
 * @export
 * @class OAuth
 * @classdesc Member of Model objects. Object representing name/value pairs for a data service record
 *
 * @param {Object} attributes Initial set of attribute/value pairs with which to seed this OAuth object
 * @param {string} header Actual name for the Authorization header (default 'Authorization')
 * @example <caption>Initialize OAuth with client credentials</caption>
 * var myOAuth = new OAuth('X-Authorization', {...Client Credentials ...});
 *
 * @example <caption>Initialize OAuth with access_token</caption>
 * var myOAuth = new OAuth('X-Authorization', {...Access Token...});
 *
 * @example <caption>Initialize empty OAuth and set access_token</caption>
 * var myOAuth = new OAuth();
 * myOAuth.setAccessTokenResponse({...Access Token...});
 *
 * @constructor
 * @final
 * @since 1.0.0
 */
const OAuth = function (header, attributes) {
  OAuth._init(this, attributes || {}, header || 'Authorization');
};

oj._registerLegacyNamespaceProp('OAuth', OAuth);

// Subclass from oj.Object
oj.Object.createSubclass(OAuth, oj.Object, 'oj.OAuth');

OAuth.prototype.Init = function () {
  OAuth.superclass.Init.call(this);
};

/**
 * Calculates Authorization header based on client credentials or access_token
 * @return {Object} OAuth 2.0 Authorization header
 * @example <caption>Get Authorization header</caption>
 * myOAuth.getHeader();
 *
 * @memberof OAuth
 * @export
 */
OAuth.prototype.getHeader = function () {
  var headers = {};
  if (!this.accessTokenResponse.access_token) {
    this.clientCredentialGrant();
  }
  headers[this.accessTokenRequest.auth_header] = 'Bearer ' + this.accessTokenResponse.access_token;
  return headers;
};

/**
 * Check is OAuth initialized (not null access_token).
 * @return {boolean} true/false
 * @example <caption>Check if OAuth initialized</caption>
 * if(myOAuth.isInitialized()) console.log('Initialized');
 *
 * @memberof OAuth
 * @export
 */
OAuth.prototype.isInitialized = function () {
  if (this.accessTokenResponse && this.accessTokenResponse.access_token) {
    return true;
  }
  return false;
};

/**
 * Request for access_token(bearer token) using Client Credential Authorization Grant.
 * Initialize response part of the OAuth object (access_token, e.t.c.)
 * @return {undefined}
 * @example <caption>Set/Re-set response part of the OAuth object using Client Credentials</caption>
 * myOAuth.clientCredentialGrant();
 *
 * @memberof OAuth
 * @export
 */
OAuth.prototype.clientCredentialGrant = function () {
  var headers = {};
  var self = this;
  headers[self.accessTokenRequest.auth_header] =
    'Basic ' +
    OAuth._base64_encode(
      self.accessTokenRequest.client_id + ':' + self.accessTokenRequest.client_secret
    );

  $.ajax({
    type: 'POST',
    async: false,
    url: this.accessTokenRequest.bearer_url,
    data: 'grant_type=client_credentials',
    headers: headers,
    success: function (data) {
      self.accessTokenResponse = OAuth._initAccessToken(self.accessTokenResponse, data);
    },
    error: function (jqXHR) {
      throw new Error(jqXHR.responseText);
    }
  });
};

/**
 * Set response part of the OAuth object (access_token, e.t.c.)
 * @param {Object} data current response
 * @return {undefined}
 * @example <caption>'Initialize' response part of the OAuth object with access_token</caption>
 * myOAuth.setAccessTokenResponse({...Access Token...});
 *
 * @memberof OAuth
 * @export
 */
OAuth.prototype.setAccessTokenResponse = function (data) {
  this.accessTokenResopnse = OAuth._initAccessToken(this.accessTokenResponse, data);
};

/**
 * Get response part of the OAuth object (access_token, e.t.c.)
 * @return {Object} cached response
 * @memberof OAuth
 * @export
 */
OAuth.prototype.getAccessTokenResponse = function () {
  return this.accessTokenResponse;
};

/**
 * Clean response part of the OAuth object (access_token, e.t.c.)
 * Null and remove all data from response part of the OAuth object
 * @return {undefined}
 * @memberof OAuth
 * @export
 */
OAuth.prototype.cleanAccessTokenResponse = function () {
  OAuth._cleanAccessToken(this.accessTokenResponse);
};

/**
 * Set request part of the OAuth object (client credentials, uri endpoint)
 * @param {Object} data current client credentials and uri
 * @return {undefined}
 * @example <caption>'Initialize' request part of the OAuth object with client credentials and calculate
 * access_token</caption>
 * myOAuth.setAccessTokenRequest({...Client Credentials ...});
 * myOAuth.clientCredentialGrant();
 *
 * @memberof OAuth
 * @export
 */
OAuth.prototype.setAccessTokenRequest = function (data) {
  this.accessTokenRequest = OAuth._initAccessToken(this.accessTokenRequest, data);
};

/**
 * Get request part of the OAuth object (client credentials, uri endpoint)
 * @return {Object} cached request
 * @memberof OAuth
 * @export
 */
OAuth.prototype.getAccessTokenRequest = function () {
  return this.accessTokenRequest;
};

/**
 * Clean request part of the OAuth object (client credentials, uri endpoint)
 * Null and remove all data from request part of the OAuth object
 * @return {undefined}
 * @memberof OAuth
 * @export
 */
OAuth.prototype.cleanAccessTokenRequest = function () {
  OAuth._cleanAccessToken(this.accessTokenRequest);
};

/**
 * @private
 * @param {Object} oauth
 * @param {Object} attributes
 * @param {string|null} header
 */
OAuth._init = function (oauth, attributes, header) {
  var oa = oauth;
  oa.Init();
  oa.accessTokenRequest = {};
  oa.accessTokenResponse = {};

  if (attributes.access_token) {
    // access_token has higher preference
    oa.accessTokenResponse = OAuth._initAccessToken(oa.accessTokenResponse, attributes);
  } else if (attributes.client_id && attributes.client_secret && attributes.bearer_url) {
    // Client Credential Grant
    oa.accessTokenResponse = OAuth._initAccessToken(oa.accessTokenRequest, attributes);
  }
  oa.accessTokenRequest.auth_header = header;
};

/**
 * @private
 * @param {Object} oauthObj - Request/Response object to deal with
 * @param {Object} data - object to populate
 */
OAuth._initAccessToken = function (oauthObj, data) {
  var dat = data || {};
  var obj = oauthObj || {};
  Object.keys(dat).forEach(function (prop) {
    if (Object.prototype.hasOwnProperty.call(dat, prop)) {
      obj[prop] = dat[prop];
    }
  });
  return obj;
};

/**
 * @private
 * @param {Object} oauthObj - Request/Response object to deal with
 */
OAuth._cleanAccessToken = function (oauthObj) {
  var obj = oauthObj || {};

  Object.keys(obj).forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key !== 'auth_header') {
        obj[key] = null;
        delete obj[key];
      }
    }
  });
};

/**
 * @private
 * @param {string} a The data to calculate the base64 representation from
 * @return {string} The base64 representation
 */
OAuth._base64_encode = function (a) {
  var d;
  var e;
  var f;
  var b;
  var g = 0;
  var h = 0;
  var i = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var c = [];

  do {
    d = a.charCodeAt(g);
    g += 1;
    e = a.charCodeAt(g);
    g += 1;
    f = a.charCodeAt(g);
    g += 1;
    b = (d << 16) | (e << 8) | f; // eslint-disable-line no-bitwise
    d = (b >> 18) & 63; // eslint-disable-line no-bitwise
    e = (b >> 12) & 63; // eslint-disable-line no-bitwise
    f = (b >> 6) & 63; // eslint-disable-line no-bitwise
    b &= 63; // eslint-disable-line no-bitwise
    c[h] = i.charAt(d) + i.charAt(e) + i.charAt(f) + i.charAt(b);
    h += 1;
  } while (g < a.length);
  c = c.join('');
  d = a.length % 3;
  return (d ? c.slice(0, d - 3) : c) + '==='.slice(d || 3);
};

export { Collection, Events, Model, OAuth, URLError, ajax, sync };
