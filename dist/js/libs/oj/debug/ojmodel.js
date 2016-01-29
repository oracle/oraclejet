/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2014, 2015 Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'promise'], function(oj, $)
{
/**
 * Copyright (c) 2014, 2015 Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/
/**
 * @constructor
 * @class oj.Events
 * @classdesc Supports event system for the common model ([oj.Collection]{@link oj.Collection} and [oj.Model]{@link oj.Model})
 */
oj.Events = window['oj']['Events'] =
/** @lends oj.Events */
{       
    /**
     * Add an event handler for an event type to the model or collection object.
     * @param {String|Object} eventType Types of event handlers to add (may be a single event type, a space-delimited set of event types, or an object mapping events to callbacks). 
     * @param {function(String, Object)} callback User's event handler callback function (called with the eventType and model or collection object as parameters--the context will be the model or collection unless specified by context, below). 
     * @param {Object=} context A context for the event 
     */
    'on': function (eventType, callback, context) {
            return this.OnInternal(eventType, callback, context, false, false);
        },

    /**
     * Remove an event handler for an event type from the model or collection object.
     * @param {String|Object=} eventType Types of event handlers to remove (may be a single event type, a space-delimited set of event types, or a map of events to callbacks). If omitted, remove all event handlers. 
     * @param {function(String, Object)=} callback If provided, remove handlers only for eventType events with the given callback function. 
     * @param {Object=} context If provided, remove handlers only for eventType events with the given callback function and context object. 
     */
    'off': function(eventType, callback, context) {
             return this._offInternal(eventType, callback, context, false);
        },
    
    /**
     * Fire the given event type(s) for all registered handlers.
     * @param {String} eventType Types of event handlers to fire (may be a single event type or a space-delimited set of event types). 
     */        
    'trigger': function(eventType) {
                 var args = Array.prototype.slice.call(arguments);
                 // Inject a silent setting in there: if this is being called outside we want to fire all relevant events
                 args.unshift(false);
                 return oj.Events.TriggerInternal.apply(this, args);
             },
            
    /**
     * Add an event handler for an event type to the model or collection object, but only fire it once, then remove it from the list of handlers.
     * @param {String} eventType Types of event handlers to add (may be a single event type or a space-delimited set of event types). 
     * @param {function(String, Object)} callback User's event handler callback function (called with the eventType and model or collection object as parameters--the context will be the model or collection unless specified by context, below). 
     * @param {Object=} context A context for the event
     */
    'once': function(eventType, callback, context) {
                return this._onceInternal(eventType, callback, context, false, null);
            },
               
    /**
     * Add an event handler for an event type to a second model or collection object ("otherObj"), but track it on the called object.
     * @param {Object} otherObj Model or collection object on which to add this event handler. 
     * @param {String} eventType Types of event handlers to add (may be a single event type or a space-delimited set of event types). 
     * @param {function(String, Object)} callback User's event handler callback function (called with the eventType and model or collection object as parameters--the context will be the model or collection unless specified by context, below). 
     */
    'listenTo': function(otherObj, eventType, callback) {
                var eventArray, e, event, attr, eventString, listenerObj, index, prop, eventMap = {};

                if (eventType.constructor === String) {
                    // Create a map out of it
                    eventMap[eventType] = callback;
                }
                else {
                    eventMap = eventType;
                }
        
                for (prop in eventMap) {
                    if (eventMap.hasOwnProperty(prop)) {
                        eventArray = oj.Events._getEvents(prop);
                        for (e = 0; e < eventArray.length; e=e+1) {
                            event = eventArray[e].event;
                            attr = eventArray[e].attribute;
                            listenerObj = {event: event, attribute: attr, object: otherObj, callback: eventMap[prop]};
                            index = this._checkForHandler(this['_listeningTo'], listenerObj, oj.Events._listenersIdentical);
                            eventString = attr ? event + ":" + attr : event;    
                            if (this['_listeningTo'] === undefined) {
                                this['_listeningTo'] = [];
                            }
//                            if (index === -1) {
                                this['_listeningTo'].push(listenerObj);    
/*                           }
                            else {
                                // Replace it
                                this['_listeningTo'][index] = listenerObj;
                                otherObj.off(eventString);
                            }*/
                            // fire
                            otherObj.OnInternal(eventString, eventMap[prop], null, true, false);
                        }
                    }
                }
                return this;
            },

    /**
     * Add an event handler for an event type to a second model or collection object ("otherObj"), but track it on the called object.  Only fire once.
     * @param {Object} otherObj Model or collection object on which to add this event handler. 
     * @param {String} eventType Types of event handlers to add (may be a single event type or a space-delimited set of event types). 
     * @param {function(String, Object)} callback User's event handler callback function (called with the eventType and model or collection object as parameters--the context will be the model or collection unless specified by context, below). 
     */
    'listenToOnce': function(otherObj, eventType, callback) {
                var eventArray, e, event, attr, eventString, listenerObj, index, prop, eventMap = {};

                if (eventType.constructor === String) {
                    // Create a map out of it
                    eventMap[eventType] = callback;
                }
                else {
                    eventMap = eventType;
                }
        
                for (prop in eventMap) {
                    if (eventMap.hasOwnProperty(prop)) {
                        eventArray = oj.Events._getEvents(prop);
                        for (e = 0; e < eventArray.length; e=e+1) {
                            event = eventArray[e].event;
                            attr = eventArray[e].attribute;
                            listenerObj = {event: event, attribute: attr, object: otherObj, callback: eventMap[prop]};
                            index = this._checkForHandler(this['_listeningTo'], listenerObj, oj.Events._listenersIdentical);
                            eventString = attr ? event + ":" + attr : event;    
                            if (this['_listeningTo'] === undefined) {
                                this['_listeningTo'] = [];
                            }
                            this['_listeningTo'].push(listenerObj);    
                            // fire
                            otherObj._onceInternal(eventString, eventMap[prop], null, true, this);
                        }
                    }
                }
                return this;
            },
            
    /**
     * Remove event handlers from a model or collection object. If the arguments are omitted, removes all event handlers from the model or collection.
     * @param {Object=} otherObj If specified, remove event handlers that target otherObj from this model or collection. 
     * @param {String=} eventType If specified, remove the event handlers for the given event types from this model or collection 
     * @param {function(String, Object)=} callback If specified, remove event handlers that call the given user callback function from this model or collection 
     */
    'stopListening': function(otherObj, eventType, callback) {
                        var eventArray, actualType, eventMap = {}, e, oneEvent, oneAttr, event, objEqual,
                                eventEqual, callbackEqual, attrEqual, i, prop, len, cb;
                        
                        if (arguments == null || arguments.length <= 1) {
                            len = this['_listeningTo'] ? this['_listeningTo'].length : 0;
                            // Remove everything
                            for (i = 0; i < len; i++) {
                                event = this['_listeningTo'][i];
                                // If we have an "otherObj" argument, make sure that passes muster
                                objEqual = otherObj ? otherObj === event.object : true;
                                if (objEqual) {
                                    cb = event.object._offInternal;
                                    cb.apply(event.object, [event.event, event.callback, event.context, true]);
                                }
                            }
                            this['_listeningTo'] = [];
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
                        }
                        else {
                            eventMap = actualType;
                        }
        
                        for (prop in eventMap) {
                            if (eventMap.hasOwnProperty(prop)) {
                                eventArray = oj.Events._getEvents(prop);
                                for (e = 0; e < eventArray.length; e=e+1) {
                                    oneEvent = eventArray[e].event;
                                    oneAttr = eventArray[e].attribute;
                                    len = this['_listeningTo'] ? this['_listeningTo'].length : 0;
                                    for (i = len-1; i >= 0; i=i-1) {
                                        event = this['_listeningTo'][i];
                                        objEqual = otherObj ? otherObj === event.object : true;
                                        eventEqual = oneEvent ? oneEvent === event.event : true;
                                        callbackEqual = callback ? eventMap[prop] === event.callback : true;
                                        attrEqual = oneAttr ? oneAttr === event.attribute : true;
                                        if (objEqual && eventEqual && callbackEqual && attrEqual) {
                                            cb = this['_listeningTo'][i].object._offInternal;
                                            cb.apply(this['_listeningTo'][i].object, [this['_listeningTo'][i].event, this['_listeningTo'][i].callback, this['_listeningTo'][i].context, true]);
                                            this['_listeningTo'].splice(i, 1);
                                        }
                                    }                        
                                }
                            }        
                        }
                    return this;
                }
};

// Aliases for backward compatibility
oj.Events['bind'] =  oj.Events['on'];
oj.Events['unbind'] = oj.Events['off'];

/**
 * @export
 * Event types
 * @enum {string}
 */
  oj.Events.EventType = {
        /** Triggered when a model is added to a collection<p> 
         *  The event passes these arguments to the handler: <br>
         *  <ul>
         *  <b>model</b>: the model being added to the collection<br>
         *  <b>collection</b>: the collection to which the model has been added<br>
         *  <b>options</b>: any options passed in to the add call that triggered the event
         *  </ul>
         */
        'ADD' : "add",
        /** Triggered by a collection during an add call once all models passed in have been added<p>
         * The event passes these arguments to the handler:<br>
         * <ul>
         * <b>collection</b>: the collection to which the models have been added<br>
         * <b>models</b>: the array of models that have been added <br>
         * <b>options</b>: any options passed in to the add call
         * </ul>
         */
        'ALLADDED': "alladded",
        /** Triggered when a model is removed from a collection<p>
         * The event passes these arguments to the handler: <br>
         * <ul>
         * <b>model</b>: the model being removed from the collection<br>
         * <b>collection</b>: the collection from which the model was removed<br>
         * <b>options</b>: <b>index</b>: the index of the model being removed
         * </ul>
         */
        'REMOVE' : "remove",
        /** Triggered when a collection is reset (see oj.Collection.reset)<p>
         *  The event passes these arguments to the handler:<br>
         *  <ul>
         *  <b>collection</b>: the collection being reset<br>
         *  <b>options</b>: any options passed in to the reset call
         *  </ul>
         */
        'RESET' : "reset",
        /** Triggered when a collection is refreshed (see oj.Collection.refresh)<p>
         *  The event passes these arguments to the handler: <br>
         *  <ul>
         *  <b>collection</b>: the collection being refreshed<br>
         *  <b>options</b>: any options passed in to the refresh call
         *  </ul>
         */
        'REFRESH' : "refresh",
        /** Triggered when a collection is sorted.  If the second argument to the callback is set (options) and 'add' is true, it means this sort event was triggered as a result of an add <p>
         *  The event passes these arguments to the handler:<br>
         *  <ul>
         *  <b>collection</b>: the collection being sorted<br>
         *  <b>options</b>: <b>add</b>: true if this sort event was triggered as the result of an add call, undefined or false if not
         *  </ul>
         */
        'SORT' : "sort",
        /** Triggered when a model's attributes are changed.  This can be the result of a clear call on a model; a property set call on a model; an unset call on a model; or the changing of properties due to the merging of models (in an add, for example) <p>
         * The event passes these arguments to the handler:<br>
         * <ul>
         * <b>model</b>: the model on which the change occurred<br>
         * <b>value</b>: for property-specific change events, the new value of the property being changed<br>
         * <b>options</b>: any options passed in to the call that triggered the change event.  This is the second argument passed for overall change events, and the third parameter (after value) for property-specific change events.
         * </ul>
         */
        'CHANGE' : "change",
        /** Triggered when a model is deleted from the data service (and thus from its Collection), due to a model destroy call<p>
         * The event passes these arguments to the handler:<br>
         * <ul>
         * <b>model</b>: the model being deleted<br>
         * <b>collection</b>: the deleted model's collection, if any 
         * </ul>
         */
        'DESTROY' : "destroy",
        /** Triggered by a collection during a remove call once all models passed in have been removed and destroyed<p>
         * The event passes these arguments to the handler:<br>
         * <ul>
         * <b>collection</b>: the collection from which the models have been removed<br>
         * <b>models</b>: the array of models that have been removed <br>
         * <b>options</b>: any options passed in to the remove call
         * </ul>
         */
        'ALLREMOVED': "allremoved",
        /** Triggered when a model or collection has sent a request to the data service <p>
         *  The event passes these arguments to the handler:<br>
         *  <ul>
         *  <b>collection or model</b>: the collection or model triggering the request<br>
         *  <b>xhr</b>: the xhr argument for the request<br>
         *  <b>options</b>: any options passed as part of the request
         *  </ul>
         */
        'REQUEST' : "request",
        /** Triggered when a model or collection has been updated from the data service<p>
         *  The event passes these arguments to the handler:<br>
         *  <ul>
         *  <b>collection or model</b>: the collection or model that triggered the update<br>
         *  <b>response</b>: the response object from the data service<br>
         *  <b>options</b>: any options passed in to the call that triggered the update
         *  </ul>
         */
        'SYNC' : "sync",
        /** Triggered when a model has failed to update on the data service<p>
         *  The event passes these arguments to the handler:<br>
         *  <b>collection or model</b>: the collection or model that made the call that resulted in the error<br>
         *  <b>xhr</b>: the xhr argument for the failing request, if any<br>
         *  <b>options</b>: any options passed in to the call that triggered the failing request, plus the status and error as textStatus and errorThrown
         *  </ul>
         */
        'ERROR' : "error",
        /** Triggered on an error with data source interactions <p>
         * The event passes these arguments to the handler:<br>
         * <ul>
         * <b>model</b>: the model (or collection) on which the error operation happened <br>
         * <b>xhr</b>: the xhr involved, if relevant<br>
         * <b>options</b>: any options passed in to the call that triggered the invalid event
         * </ul>
         */
        'INVALID' : "invalid",
        /** Triggered when all pending promises from Collection API calls have been resolved<p>
         * The event passes these arguments to the handler:<br>
         * <ul>
         * <b>collection</b>: the collection on which the promises have been resolved
         * </ul>
         */
        'READY' : "ready",
        /** Triggered for any of the above events <p>
         * The event passes the name of the actual event and then any arguments normally passed to that event following the name
         */
        'ALL' : "all"
    };
            

/**
 * @private
 * @param {Object} myClass
 * @param {Object=} source
 */
oj.Events.Mixin = function(myClass, source) {
    var methodName, obj = source || this;
    for (methodName in obj ) {
        if (typeof obj[methodName] === 'function' /*&& !Object.hasOwnProperty(myClass.prototype, methodName)*/ ) {
            myClass[methodName] = obj[methodName];
        }
    }
    // Make sure actual vars are own copies
    myClass.eventHandlers = {};
    myClass['_listeningTo'] = [];
};

oj.Events._onceInternal = function(eventType, callback, context, listenTo, otherObj) {
    var eventArray, e, event, attr, eventMap, prop;
    
    eventMap = this._getEventMap(eventType, callback, context);

    for (prop in eventMap) {
        if (eventMap.hasOwnProperty(prop)) {
            eventArray = this._getEvents(prop);
    
            for (e = 0; e < eventArray.length; e=e+1) {
               event = eventArray[e].event;
               attr = eventArray[e].attribute;
               if (this.eventHandlers === undefined) {
                   this.eventHandlers = [];
               }
               if (this.eventHandlers[event] === undefined) {
                   this.eventHandlers[event] = [];
               }

               this.eventHandlers[event].push({callback: eventMap[prop], context: context, attribute: attr, once: true, fired: false, listen:listenTo, otherObj:otherObj});    
            }
        }
   }
   return this;
};

oj.Events._shouldFire = function(handler) {
    if (handler.once) {
        if (!handler.fired) {
            handler.fired = true;
            return true;
        }
        return false;
    }
    return true;
};

oj.Events._getContext = function(obj, handler) {
    return handler.context || handler.otherObj || obj;
};

oj.Events.TriggerInternal = function(silent, eventType) {
    var eventArray = this._getEvents(eventType), e, event, attr, eventsToFire, handlers, i, args, allHandlers, callback;
                  
    eventsToFire = [];                  
    for (e = 0; e < eventArray.length; e=e+1) {  
        event = eventArray[e].event;
        attr = eventArray[e].attribute;
        // Do specific event...
        eventsToFire.push({event:event, attribute:attr});
    }
    for (e = 0; e < eventsToFire.length; e=e+1) {
      allHandlers = this._getHandlers(this.eventHandlers, oj.Events.EventType['ALL']);
      handlers = oj.Events._getHandlers(this.eventHandlers, eventsToFire[e].event, false);
      for (i=0; i < (handlers ? handlers.length : 0); i=i+1) {
            if (handlers[i].attribute === eventsToFire[e].attribute && handlers[i].callback) {
                args = Array.prototype.slice.call(arguments);                
                if (handlers && handlers[i] && handlers[i].once) {
                      // Remove it: only want to fire once--make sure we remove it from the original
                      this._removeHandler(oj.Events._getHandlers(this.eventHandlers, eventsToFire[e].event, true), handlers[i]);
                      // Now take it out of the other object's "listen to" list, if relevant
                      if (handlers[i].otherObj) {
                          // Clean up the "other object" if this was a triggered listenOnce
                          handlers[i].otherObj['stopListening'](this, eventType, handlers[i].callback);
                      }
                }
                if (handlers && handlers[i] && this._shouldFire(handlers[i])) {
                  callback = handlers[i].callback;
                  // If this isn't a silent firing or this handler always wants to be called, make the call
                  if (!silent || handlers[i].ignoreSilent) {
                    callback.apply(oj.Events._getContext(this, handlers[i]), args.slice(2));
                  }
                }
            }
      }
            // Handle all
         for (i=0; i < (allHandlers ? allHandlers.length : 0); i=i+1) {
               args = Array.prototype.slice.call(arguments);
               if (args.length > 0) {
                   if (eventsToFire[e].attribute) {
                       args[1] = eventsToFire[e].event + ":" + eventsToFire[e].attribute;
                   }
                   else {
                      args[1] =  eventsToFire[e].event;
                   }
               }
               // All case--make sure to pass event name
               if (allHandlers && allHandlers[i] && allHandlers[i].callback && this._shouldFire(allHandlers[i])) {
                   callback = allHandlers[i].callback;
                   // If this isn't a silent firing or this handler always wants to be called, make the call
                   if (!silent || allHandlers[i].ignoreSilent) {
                      callback.apply(oj.Events._getContext(this, allHandlers[i]), args.slice(1));
                   }
               }
               if (allHandlers && allHandlers[i] && allHandlers[i].once) {
                   // Remove it: only want to fire once
                   this._removeHandler(this._getHandlers(this.eventHandlers, oj.Events.EventType['ALL'], true), allHandlers[i]);
                    // Now take it out of the other object's "listen to" list, if relevant
                    if (allHandlers[i].otherObj) {
                        // Clean up the "other object" if this was a triggered listenOnce
                        allHandlers[i].otherObj['stopListening'](this, oj.Events.EventType['ALL'], allHandlers[i].callback);
                    }
               }
           }

    }
    return this;    
};

oj.Events.OnInternal = function(eventType, callback, context, listenTo, ignoreSilent) {
    var eventMap, prop, eventArray, i, event, attr, eventObj;

    eventMap = this._getEventMap(eventType, callback, context);

    for (prop in eventMap) {
        if (eventMap.hasOwnProperty(prop)) {
            eventArray = this._getEvents(prop);

            for (i = 0; i < eventArray.length; i=i+1)
            {
                event = eventArray[i].event;
                attr = eventArray[i].attribute;
                if (this.eventHandlers === undefined) {
                    this.eventHandlers = [];
                }
                if (this.eventHandlers[event] === undefined) {
                    this.eventHandlers[event] = [];
                }

                eventObj = {callback: eventMap[prop], context: context, attribute:attr, listen: listenTo, ignoreSilent:ignoreSilent};
                if (this._checkForHandler(this.eventHandlers[event], eventObj, oj.Events._handlersIdentical) === -1) {
                    this.eventHandlers[event].push(eventObj);    
                }
            }
        }
    }
    return this;
};

oj.Events._offInternal = function(eventType, callback, context, listen) {
    var eventMap, prop;
     if (arguments == null || arguments.length == 0) {
         // Remove everything
         this.eventHandlers = {};
         return this;
     }

     if (eventType == null) {
         this._removeEvent(eventType, callback, context, listen);
         return this;
     }

     eventMap = this._getEventMap(eventType, callback, context);

     for (prop in eventMap) {
         if (eventMap.hasOwnProperty(prop)) {
             this._removeEvent(prop, eventMap[prop], context, listen);
         }
     }
     return this;
};
 


oj.Events._getEventMap = function(eventType, callback, context) {
    var eventMap = {};
    
    if (eventType.constructor === String) {
        // Create a map out of it
        eventMap[eventType] = callback;
    }
    else {
        eventMap = eventType;
        // If eventType is a map of events->callbacks, then the callback argument is now context
        context = callback;
    }
    return eventMap;
};

oj.Events._removeEvent = function(eventType, callback, context, listen) {
    var eventArray = [], e, i, event, attr, handlers, callbacks, contexts, attrs, listenEq;
    
    if (eventType) {
        eventArray = oj.Events._getEvents(eventType);
    }
    else {
        // Walk entire eventHandlers property list
        if (this.eventHandlers !== undefined) {
            for (event in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(event)) {
                    eventArray.push({event:event});
                }
            }
        }
    }
    
    for (e = 0; e < eventArray.length; e=e+1) {
        event = eventArray[e].event;
        attr = eventArray[e].attribute;
        if (this.eventHandlers !== undefined && this.eventHandlers[event] instanceof Array) {
            handlers = this.eventHandlers[event];
            for (i=handlers.length-1; i >= 0; i=i-1){
                callbacks = (callback === undefined || callback === null || handlers[i].callback == callback);

                contexts = (context === undefined || context === null || handlers[i].context == context);
                attrs = (attr === undefined || attr === null || handlers[i].attribute == attr);
                listenEq = (listen === undefined || listen === null || handlers[i].listen == listen);
                if (callbacks && contexts && attrs && listenEq){
                    handlers.splice(i, 1);
                    //break;
                }
            }
            if (handlers.length === 0) {
                // Delete the entry
                delete this.eventHandlers[event];
            }
        }
    }   
};

oj.Events._removeHandler = function(handlers, handler) {
    var i, callbacks, contexts, attrs, listenEq, onceEq;
    
    if (handlers) {
        for (i=handlers.length-1; i >= 0; i=i-1){
            callbacks = (handler.callback === undefined || handler.callback === null || handlers[i].callback == handler.callback);

            contexts = (handler.context === undefined || handler.context === null || handlers[i].context == handler.context);
            attrs = (handler.attribute === undefined || handler.attribute === null || handlers[i].attribute == handler.attribute);
            listenEq = (handler.listen === undefined || handler.listen === null || handlers[i].listen == handler.listen);
            onceEq = (handler.once === undefined || handler.once === null || handlers[i].once == handler.once);
            if (callbacks && contexts && attrs && listenEq && onceEq){
                handlers.splice(i, 1);
            }
        }    
    }
};

oj.Events._getEvents = function(eventString) {    
    var eventList = eventString ? eventString.split(" ") : [], retList = [], i, eventWithAttr, name, attr;
    for (i = 0; i < eventList.length; i=i+1) {
        eventWithAttr = eventList[i].split(":");
        name = eventWithAttr[0];
        attr = eventWithAttr.length > 1 ? eventWithAttr[1] : null;
        retList.push({event:name, attribute:attr});
    }
    return retList;
};

oj.Events._handlersIdentical = function(handler1, handler2) {
   return (handler1.callback === handler2.callback) && (handler1.attribute === handler2.attribute) && (handler1.context === handler2.context) && (handler1.listen === handler2.listen) && (handler1.once === handler2.once);
};

oj.Events._listenersIdentical = function(listener1, listener2) {
   return (listener1.event === listener2.event) && (listener1.attribute === listener2.attribute) && (listener1.context === listener2.context) && (listener1.object === listener2.object);    
};

oj.Events._checkForHandler = function(handlerList, handler, handlerTest) {
    var i;
    if (handlerList === undefined) {
        return -1;        
    }
    
    for (i = 0; i < handlerList.length; i=i+1) {
        if (handlerTest(handlerList[i], handler)) {
            return i;
        }
    }
    return -1;
};

oj.Events._getHandlers = function(handlers, eventType, original) {
    if (handlers && handlers[eventType] instanceof Array) {
        if (original) {
            return handlers[eventType];
        }
        // Make a copy
        var handlerReturn = [], i;
        for (i = 0; i < handlers[eventType].length; i++) {
            handlerReturn.push(handlers[eventType][i]);
        }
        return handlerReturn;
    }
    return null;
};

/**
 * Copyright (c) 2014, 2015 Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/

/**
 * @export
 * @class oj.Model
 * @classdesc Object representing name/value pairs for a data service record
 *
 * @param {Object=} attributes Initial set of attribute/value pairs with which to seed this Model object 
 * @param {Object=} options 
 *                  collection: collection for this model
 * @constructor
 * @mixes oj.Events
 */
oj.Model = function (attributes, options) {
    oj.Model._init(this, attributes, options, null);
};


// Subclass from oj.Object 
oj.Object.createSubclass(oj.Model, oj.Object, "oj.Model");
  
oj.Model.prototype.Init = function()
{
    oj.Model.superclass.Init.call(this);
};

/**
 * 
 * @export
 * @desc Attribute/value pairs in the model.
 * 
 * @type Object
 */
oj.Model.prototype.attributes = {};

/**
 * @export
 * @desc The set of attribute/value pairs that serve as default values when new Model objects are created.
 * 
 * @type Object
 */
oj.Model.prototype.defaults = {};

/**
 * @export
 * @desc The model's unique ID.  This can be set by the application or retrieved from the data service. This ID will be appended to the URL for single-record data operations (update, delete). 
 * 
 * @type String
 */
oj.Model.prototype.id = null;

/**
 * @desc The name of the model property to be used as the unique ID. See [id]{@link oj.Model#id}. This defaults to a value of "id".
 *  
 * @type {string||null}
 * @export
 */
oj.Model.prototype.idAttribute = "id";

/**
 * @export
 * @desc The base url on the data service used to perform CRUD operations on models.  If not defined, the model will look to its collection.  One or the other must be defined before CRUD operations can succeed.
 * 
 * @type String
 */
oj.Model.prototype.urlRoot = null;

/**
 * @export
 * @desc A callback to allow users to completely customize the data service URLs
 * The callback should accept these parameters:<p>
 * <b>operation (String)</b>: one of "create", "read", "update", "patch", or "delete", indicating the type of operation for which to return the URL<br>
 * <b>model (Object)</b>: the oj.Model object requesting the URL<br>
 * <b>options (Object)</b>: one or more of the following properties:<br>
 * <ul>
 * <b>recordID</b>: id of the record involved, if relevant<br>
 * </ul>
 * 
 * customURL callbacks should return either: null, in which case the default will be used; a url string, which will be used with the standard
 * HTTP method for the type of operation, or an Object with with any other attributes that should be passed to the ajax call.<br>
 * This object must at minimum include the URL, and other attributes as follows:<br>
 * <ul>
 * <b>url</b>: giving the custom URL string<br>
 * <b>type</b>: (optional) a string indicating the type of HTTP method to use (GET, POST, DELETE, etc.)<br>
 * <b>(other)</b>: (optional) any other ajax attributes to pass in the ajax call
 * </ul>
 * <p>
 *  
 * @type (function(string,Object):(string|null)|null)
 */
oj.Model.prototype.customURL = null;

oj.Model._idCount = 0;

oj.Model._init = function(model, attributes, options, properties) {
    var prop = null, parse, attrCopy;

    if (oj.Model._justExtending) {
        return;
    }

    model.Init();
    
    // Augment with Event
    oj.Events.Mixin(model);

    model._clearChanged();
    model.previousAttrs = {};
    model.nestedSet = false;
    model.index = -1;

    options = options || {};

    // Deep copy actual data if found

    model.attributes = {};
    if (model['defaults'] && !options.ignoreDefaults) {
        model.attributes = oj.Model._cloneAttributes($.isFunction(model['defaults']) ? model['defaults']() : model['defaults'], null);
    }

    // First, copy all properties passed in
    for (prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            model[prop] = properties[prop]; 
        }
    }

    if (attributes) {
        parse = options['parse'];
        if ($.isFunction(parse)) {
            model['parse'] = parse;
        }
 
        attrCopy = oj.Model._cloneAttributes(attributes, model.attributes);
        
        attrCopy = parse ? model['parse'](attrCopy) : attrCopy;
        if (attrCopy == null || attrCopy === undefined) {
            // Reset it
            model.attributes = {};
        }
        else {
            // Move them in
            for (prop in attrCopy) {
                if (attrCopy.hasOwnProperty(prop)) {
                    model._setProp(prop, attrCopy[prop], false, false, options);
                }
            }
        }
    }

    model.SetCid();

    // Grab collection option, if there
    model.SetCollection(options['collection']);

    if (options['customURL']) {
        model['customURL'] = options['customURL'];
    }
    
    // If URL is set, use that
    if (options['url']) {
        model['url'] = options['url'];
    }

    if (options['urlRoot']) {
        model['urlRoot'] = options['urlRoot'];
    }

    if (model['initialize']) {
        model['initialize'](attributes, options);
    }
    
    model.SetupId();
};


/**
 * Create a new, specific type of model object to represent single records from a JSON data set.
 * @param {Object=} properties Properties for the new Model class.<br>
 *                  <b>defaults</b>: an Object containing starting attribute/value pairs for some or all of the model's potential attributes<br>
 *                  <b>parse</b>: a user callback function to allow parsing of JSON record objects as they are returned from the data service<br>
 *                  <b>parseSave</b>: a user callback function to allow conversion of models back into a format appropriate for the data service on save calls<br>
 *                  <b>urlRoot</b>: the URL to use to get records from the data service in the abscence of a collection (when an id is appended)<br>
 *                  <b>initialize</b>: a user callback function to be called when this model is created<br>
 *                  <b>validate</b>: a user callback function that will be called before a save to the data service occurs. The callback is passed the current set of attributes and save options. 
 *                  <br>
 * @param {Object=} classProperties properties that attach to the whole class
 * @return {function(new:Object, ...)} new Model object
 * @export
 * @this {oj.Model}
 */
oj.Model.extend = function (properties, classProperties) {
    oj.Model._justExtending = true;
    var obj, prop;

    obj = new oj.Model();
    oj.Model._justExtending = false;

    // Add regular properties from this "parent"
    //oj.Events.Mixin(obj, this.prototype);
    $.extend(obj, this.prototype);

    // Grab properties
    properties = properties || {};
    for (prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            obj[prop] = properties[prop];
        }
    }

    var Model;
    
    if (properties && properties['constructor'] && properties.hasOwnProperty('constructor')) {
        Model =  properties['constructor'];
    }
    else {
        Model = function(attributes, options) {
            oj.Model._init(this, attributes, options, properties);
        }
    }

    $.extend(Model, this);
    Model.prototype = obj;
    
    // Allow extending resulting obj
    Model.extend = oj.Model.extend;

    Model.prototype.constructor = Model;
    

    // Add class properties from this
    oj.Events.Mixin(Model, this);
    
    if (classProperties) {
        for (prop in classProperties) {
            if (classProperties.hasOwnProperty(prop)) {
                Model[prop] = classProperties[prop];
            }
        }
    }

        
    return Model;
};

// Placeholder for event mixins
oj.Model.prototype.TriggerInternal = function (silent, event, arg1, arg2, options) {};

oj.Model.prototype.SetCid = function () {
    // Create cid property if necessary
    if (!this.GetCid()) {
        this['cid'] = 'id' + oj.Model._idCount;
        oj.Model._idCount = oj.Model._idCount+1;
    }
};

oj.Model.prototype.GetCid = function () { 
    return this['cid'];
};

// Index within collection
oj.Model.prototype.SetIndex = function(index) {
    this.index = index;
};

oj.Model.prototype.GetIndex = function() {
    return this.index;
};

// LRU functions
oj.Model.prototype.SetNext = function(model) {
    var retVal = this.nextModel;
    this.nextModel = model;
    return retVal;
};

oj.Model.prototype.GetNext = function() {
    return this.nextModel;
};

oj.Model.prototype.SetPrevious = function(model) {
    var retVal = this.previousModel;
    this.previousModel = model;
    return retVal;
};

oj.Model.prototype.GetPrevious = function() {
    return this.previousModel;
};

// Merge the given model's attributes with this model's attributes
oj.Model.prototype.Merge = function(model, comparator, silent) {
    var prop, needSort = false, isStringComparator = oj.StringUtils.isString(comparator),
        valueChange, changes = false;
    
    for (prop in model.attributes) {
        if (model.attributes.hasOwnProperty(prop)) {
            valueChange = (this.attributes[prop] != model.attributes[prop]);
            if (isStringComparator) {
                // We have a string comparator--does it match this property?  If we hit a property that doesn't match, we need sort
                if (prop === comparator) {
                    // The property matches the comparator property: are we changing the value?
                    if (valueChange) {
                        needSort = true;
                    }
                }
            }
            else {
                if (valueChange) {
                    needSort = true;
                }
            }
            if (valueChange) {
                changes = true;
                this.attributes[prop] = model.attributes[prop];
                this._addChange(prop, model.attributes[prop]);
                this._fireAttrChange(prop, this.attributes[prop], null, silent);
            }                
        }
    }
    this.SetupId();
    // Only fire master change if there were any changes
    if (changes) {
        this._fireChange(null, silent);
    }
    return needSort;
};

oj.Model._hasProperties = function(object) {
    var prop;
    if (object && object instanceof Object) {
        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                return true;
            }
        }
    }
    return false;
};

oj.Model.prototype.SetCollection = function(coll) {
    if (coll == null) {
        delete this['collection'];
        return;
    }
    this['collection'] = coll;
    // This can depend on the collection
    this.SetupId();
};

oj.Model.prototype.GetCollection = function() {
    return this['collection'];
};

oj.Model.prototype._fireAttrChange = function(prop, value, options, silent) {
    if (prop != null) {
        this.TriggerInternal(silent, oj.Events.EventType['CHANGE'] + ":" + prop, this, value, options);    
    }    
};

oj.Model.prototype._fireChange = function(options, silent) {
    var coll;
    
    this.TriggerInternal(silent, oj.Events.EventType['CHANGE'], this, options, null);        
};
    
oj.Model.prototype.SetupId = function() {
    // Replicate id attribute at top level
    var id = null;
    // Ask for collection's function if available
    if (this['collection'] && this['collection']['modelId']) {
        var modFunc = this['collection']['modelId'];
        id = $.isFunction(modFunc) ? modFunc.call(this['collection'], this.attributes) : modFunc;
    }
    if (!id) {        
        var idAttr = this._getIdAttr();
        id = this.attributes != null ? this.attributes[idAttr] : null;
    }
    // Supposedly this should always be model.id...who knew?
    this['id'] = id;
};

oj.Model.prototype._setPropInternal = function(prop, value, copyRegardless) {
    var equality = oj.Object.__innerEquals(this.attributes[prop], value);
    if (copyRegardless || !equality) {
        this.attributes[prop] = value;
        this.SetupId();
        // Return value management here seems bizarre due to backbone tests: do the direct set if copyRegardless, but only return if the
        // inner equals was different
        return !equality;
    }
    return false;
};

oj.Model.prototype._clearChanged = function() {
    this['changed'] = {};
};

oj.Model.prototype._addChange = function(property, value) {
    this['changed'][property] = value;
};

/**
 * @ignore
 * @param {Object||string} prop
 * @param {Object||null||undefined} value
 * @param {boolean} copyRegardless
 * @param {boolean} propertyBag
 * @param {Object=} options
 * @returns {boolean}
 */
oj.Model.prototype._setProp = function(prop, value, copyRegardless, propertyBag, options) {
    if (prop == null) {
        return true;
    }
    
    var attrs = {}, p, isNested = this.nestedSet, opts;
    //opts = oj.Model._copyOptions(options);

    if (!propertyBag) {
        attrs[prop] = value;
    }
    else {
        // We've passed in a whole property bag at once: validate all together
        for (p in prop) {
            if (prop.hasOwnProperty(p)) {
                attrs[p] = prop[p];
            }
        }
    }
    opts = options || {};    
    
    if (!this._checkValid(attrs, {'validate':opts['validate']}, false)) {
        return false;
    }
    
    if (!isNested) {
        this._clearChanged();
        this.changes = [];
    }
    
    // Store old value
    if (!this.nestedSet) {
        this.previousAttrs = oj.Model._cloneAttributes(this.attributes, null);
    }
    
    this.nestedSet = true;
    for (p in attrs) {
        if (attrs.hasOwnProperty(p)) {
            if (this._setPropInternal(p, attrs[p], copyRegardless)) {    
                // Trigger changes
                this._addChange(p, attrs[p]);
                this.changes.push(p);
            }
            else {
                delete attrs[p];
            }
        }
    }
    // Fire events: don't fire if silent 
    var silent = opts['silent'];
    for (p in attrs) {
        if (attrs.hasOwnProperty(p)) {
            if (!silent && (this.changes.length > 0 || (isNested && this.changes.indexOf(p) === -1))) {
                this.pendingChanges = true;
                this.pendingOpts = opts;
            }
            this._fireAttrChange(p, attrs[p], opts, silent);
        }
    }
    
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
 * <b>change:attr</b>: fired for each attribute cleared, passing the model, name of the changed property, and options<br>
 * <b>change:all</b>: fired after all attributes have been cleaered, passing the model and options<br>
 * </ul>
 * <p>
 * 
 * @param {Object=} options <b>silent</b>: if true, do not fire events<br>
 *                          <b>validate</b>: if true, validate the unsetting of all properties
 * @return {Object||boolean} the model, or false if validation on clear fails
 * @export
 */
oj.Model.prototype.clear = function(options) {
    // Use unset to silently clear, to track changes to attributes
    var prop, unsetOpt = {'silent':true}, silent;
    options = options || {};
    silent = options['silent'];
    unsetOpt['validate'] = options['validate'];
    this._clearChanged();
    
    for (prop in this.attributes) {
        if (this.attributes.hasOwnProperty(prop)) {
            if (!this._unsetInternal(prop, unsetOpt, true)) {
                return false;
            }
            this.TriggerInternal(silent, oj.Events.EventType['CHANGE'] + ":" + prop, this, undefined, null);    
        }
    }
    this.attributes = {};
    this.SetupId();
    
    this._fireAttrChange(null, null, null, silent);
    this._fireChange(null, silent);
    return this;
};

oj.Model._cloneAttributes = function(oldData, newData) {    
    newData = newData || {};
    // Handle not overwriting defaults with undefined
    var prop;
    for (prop in oldData) {
        if (newData.hasOwnProperty(prop) && oldData.hasOwnProperty(prop)) {
            // They both have this: now is oldData undefined?
            if (oldData[prop] === undefined) {
                // Remove it so it doesn't get copied/overwritten
                delete oldData[prop];
            }
        }
    }
    oj.CollectionUtils.copyInto(newData, oldData, undefined, true, 10000);
    return newData;
};

/**
 * Return a copy of the model with identical attributes and settings
 * @return {Object} copy of the model
 * @export
 */
oj.Model.prototype.clone = function() {
    var c = new this.constructor(), prop;
    
    for (prop in this) {
        // Shallow copy all but data
        if (this.hasOwnProperty(prop) && this[prop] !== this.attributes) {
            c[prop] = this[prop];
        }
    }
    // Deep copy data
    c.attributes = oj.Model._cloneAttributes(this.attributes, null);

    // Remove the cid--this should be unique
    delete c['cid'];    
    // Set a new cid
    c.SetCid();
    
    c.SetupId();
    
    return c;
};

// Does this model match the given id or cid?
oj.Model.prototype.Match = function(id, cid) {
    var modId = this.GetId(), modCid;
    if (modId !== undefined && modId == id) {
        return true;          
    }
    modCid = this['cid'];
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
 * @param {string||Object} property Property attribute name to set, or an Object containing attribute/value pairs
 * @param {Object=} value Value for property if property is not an Object containing attribute/value pairs
 * @param {Object=} options Options: <br>
 * <b>silent</b>: prevent events from firing<br>
 * <b>unset</b>: delete all the properties passed in rather than setting them<br>
 * @returns {Object||boolean} the model itself, false if validation failed on set
 * @export
 */
oj.Model.prototype.set = function (property, value, options) {
    var opts = options || {}, prop, valid = true;
    
    if (arguments && arguments.length > 0) {
        // Check if first arg is not a string (property name)
        if (!oj.StringUtils.isString(property)) {
            // Options, if present, must be second argument...value, because a string/value pair wasn't what was passed in
            opts = value || {};
            // For set, pass entire thing to setProp
            if (opts['unset']) {
                for (prop in property) {
                    if (property.hasOwnProperty(prop)) {
                        this._unsetInternal(prop, null, false);
                    }
                }
            }
            else {
                if (!this._setProp(property, null, true, true, opts)) {
                    valid = false;
                }
            }
        }
        else {
            // Not a property bag?  We assume it's a property/value argument
            if (opts['unset']) {
                this._unsetInternal(property, null, false);
            }
            else {
                if (!this._setProp(property, value, false, false, opts)) {
                    valid = false;
                }
            }
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
 * <b>change:attr</b>: fired for each attribute unset: passing the model, name of the changed property, and options<br>
 * <b>change:all</b>: fired after all attributes have been unset: passing the model and options<br>
 * @param {string} property Property to remove from model 
 * @param {Object=} options <br>
 * <b>silent</b>: do not fire change events if true
 * @returns {boolean} false if validation of the unset fails
 * @export
 */
oj.Model.prototype.unset = function (property, options) {
    return this._unsetInternal(property, options, false);
};


oj.Model.prototype._unsetInternal = function (property, options, clear) {
    options = options || {};
    var silent = options['silent'], attrs = {};
    
    if (this.has(property)) {
        if (!this._checkValid(attrs, options, false)) {
            return false;
        }
        if (!clear) {
            this._clearChanged();
        }
        
        //attrs[property] = undefined;
        delete this.attributes[property];
        this._addChange(property, undefined);
        //if (!silent) {
            this._fireAttrChange(property, null, null, silent);
            this._fireChange(null, silent);
        //}
    }
    this.SetupId();
    return true;    
};

/**
 * Returns the value of a property from the model.
 * @param {string} property Property to get from model 
 * @return {Object} value of property
 * @export
 */
oj.Model.prototype.get = function (property) {
    return this.attributes[property];
};

/**
 * Determines if the Model has a certain property set, vs. undefined.
 * @param {string} property Property to check for
 * @return {boolean} true if the model contains the given property, false if undefined.
 * @export
 */
oj.Model.prototype.has = function (property) {
    return oj.Collection._defined(this.attributes[property]);
};

/**
 * Loads the Model object from the data service URL. Performs a data "read."<br>
 * Events:<p>
 * <ul>
 * <b>request</b>: fired when the request to fetch is going to the server, passing the model, xhr object, and options<br>
 * <b>sync</b>: fired when the model is fetched from the data service, passing the model and the raw response<br>
 * <b>error</b>: fired if there is an error during the fetch, passing the model, xhr ajax object, and options<br>
 * </ul>
 * <p>
 * @param {Object=} options Options to control fetch<p>
 * <b>success</b>: a user callback called when the fetch has completed successfully. This makes the fetch an asynchronous process. The callback is called passing the Model object, raw response, and the fetch options argument.<p>
 * <b>error</b>: a user callback function called if the fetch fails. The callback is called passing the model object, xhr, and options arguments.<p>
 * @export
 */
oj.Model.prototype.fetch = function (options) { 
    options = options || {};
    var success = options['success'], userErr = options['error'], self = this, opts;

    opts = oj.Model._copyOptions(options);
    opts['error'] = function(xhr, status, err) {
                        // Trigger an error event
                        oj.Model._triggerError(self, false, options, status, err, xhr);

                        if (userErr) {
                            userErr.apply(self, arguments);
                        }
                    };

    opts['success'] = function (response) {
            // Make sure we pass xhr
            if (opts['xhr']) {
                options['xhr'] = opts['xhr'];
            };
            oj.Model._fireSyncEvent(self, response, opts, false);
            
            if ($.isFunction(self['parse'])) {
                self.set(self['parse'](response), opts);
            }
             if (success) {
                 success.call(self, this, response, options);
             }};
    oj.Model._internalSync("read", this, opts);
};

oj.Model.prototype['parse'] = function (rawData) {
    return rawData;
};

/**
 * Return the URL used to access this model in the data source
 * 
 * @returns {string|null} url to access this model in the data source
 * @export
 */
oj.Model.prototype.url = function() {
    var urlRoot = this._getUrlRoot(), id = this.GetId(), coll, collUrl, slash;
    if (urlRoot) {
        return id ? urlRoot + '/' + encodeURIComponent(id) : urlRoot;
    }
    
    coll = this['collection'];
    if (coll) {
        collUrl = oj.Model.GetPropValue(coll, 'url');
        if (id && collUrl) {
            slash = oj.Model._getLastChar(collUrl) == '/' ? '' : '/';
            return collUrl + slash + encodeURIComponent(this.GetId());
        }
        return collUrl;
    }
    
    throw new oj.URLError();
    //return null;
};



/**
 * Return all of the model's attributes as an array
 * 
 * @returns {Array} array of all the model's attributes
 * @export
 */
oj.Model.prototype.keys = function() {
    var prop, retArray = [];
    
    for (prop in this.attributes) {
        if (this.attributes.hasOwnProperty(prop)) {
            retArray.push(prop);
        }
    }
    return retArray;
};


/**
 * Return all of the model's attributes values as an array
 * 
 * @returns {Array} array of all the model's attributes values
 * @export
 */
oj.Model.prototype.values = function() {
    var prop, retArray = [];
    
    for (prop in this.attributes) {
        if (this.attributes.hasOwnProperty(prop)) {
            retArray.push(this.get(prop));
        }
    }
    return retArray;
};

/**
 * Return an array of attributes/value pairs found in the model 
 * 
 * @returns {Object} returns the model's attribute/value pairs as an array
 * @export
 */
oj.Model.prototype.pairs = function() {
    var prop, retObj = [], item;
    for (prop in this.attributes) {
        if (this.attributes.hasOwnProperty(prop)) {
            item = [];
            item.push(prop);
            item.push(this.get(prop));
            retObj.push(item);;
        }
    }
    return retObj;
};

/**
 * Return attribute/value pairs for the model minus those attributes listed in keys
 * 
 * @param {Array||Object} keys keys to exclude from the returned attribute/value pairs
 * 
 * @returns {Object} array of the model's attribute/value pairs except those listed in keys
 * @export
 */
oj.Model.prototype.omit = function(keys) {
    var keyArr = [], i, prop, retObj = {};
    
    if (keys instanceof Array) {
        keyArr = keys;
    }
    else {
        for (i = 0; i < arguments.length; i++) {
            keyArr.push(arguments[i]);
        }
    }
    for (prop in this.attributes) {
        if (this.attributes.hasOwnProperty(prop)) {
            if (keyArr.indexOf(prop) == -1) {
                retObj[prop] = this.get(prop);
            }
        }
    }
    return retObj;
};

/**
 * Return attribute/value pairs for the model for the keys
 * 
 * @param {Array||Object} keys keys for which to return attribute/value pairs
 * 
 * @returns {Object} array of the model's attribute/value pairs filtered by keys
 * @export
 */
oj.Model.prototype.pick = function(keys) {
    var keyArr = [], i, retObj = {};
    
    if (keys instanceof Array) {
        keyArr = keys;
    }
    else {
        for (i = 0; i < arguments.length; i++) {
            keyArr.push(arguments[i]);
        }
    }
    for (i = 0; i < keyArr.length; i++) {
        if (this.attributes.hasOwnProperty(keyArr[i])) {
            retObj[keyArr[i]] = this.get(keyArr[i]);
        }
    }
    return retObj;
};

/**
 * Return an array of value/attribute pairs found in the model 
 * 
 * @returns {Object} returns the model's value/attribute pairs as an array
 * @export
 */
oj.Model.prototype.invert = function() {
    var prop, retObj = {}, val;
    for (prop in this.attributes) {
        if (this.attributes.hasOwnProperty(prop)) {
            val = this.get(prop);
            retObj[val] = prop;
        }
    }
    return retObj;
};

oj.Model._getLastChar = function(str) {
    return str.charAt(str.length-1);
};

oj.Model.prototype._saveUrl = function() {
    var urlRoot = this._getUrlRoot();
    if (urlRoot) {
        return urlRoot;
    }
    
    if (this.GetCollection()) {
        return this.GetCollection()['url'];
    }
    
    return null;
    
};

oj.Model.prototype._getUrlRoot = function() {
    return oj.Model.GetPropValue(this, 'urlRoot');
};

oj.Model.prototype['parseSave'] = function (modelData) {
    return modelData;
};

/**
 * Check to see if the model is valid by running the validate callback, if it is set
 * 
 * @returns {boolean} true if validate passes or if no validate callback
 * @export
 */
oj.Model.prototype.isValid = function() {
    var options = {};
    options['validate'] = this['validate'];
    return this._checkValid(this.attributes, options, false);
};

oj.Model._isValidateSet = function(options, save) {
    options = options || {};
    if (options['validate'] !== undefined && options['validate'] !== null) {
        return options['validate'];
    }
    // The "default" is different for save vs. set
    return save;
};

oj.Model.prototype._checkValid = function(attributes, options, save) {  
    options = options || {};    
    var validate = this['validate'];
    if (validate && oj.Model._isValidateSet(options, save)) {
        // If we have a validate override and it returns something, don't save
        this['validationError'] = validate.call(this, attributes, options);
        if (this['validationError']) {
            this.TriggerInternal(false, oj.Events.EventType['INVALID'], this, this['validationError'], options);
            return false;
        }
    }        
    return true;
};

oj.Model._processArgs = function(args) {
    var ignoreLastArg = false, options = {}, prop, attributes = {}, i;
    
    if (args) {
        if (args.length > 0) {
            // Check if the last argument is not the first argument
            if (args.length > 1) {
                if (args[args.length-1] && oj.Model._hasProperties(args[args.length-1])) {
                    // Last arg is options: ignore later
                    ignoreLastArg = true;
                    options = args[args.length-1] || {};
                }
            }
            if (args[0] == null) {
                return {attributes:null,options:options};
            }
            
            // Check if first arg is property bag
            if (oj.Model._hasProperties(args[0]) || oj.Object.isEmpty(args[0])) {
                for (prop in args[0]) {
                    if (args[0].hasOwnProperty(prop)) {
                        attributes[prop] = args[0][prop];
                    }
                }
            }
            else {
                // Not a property bag?  We assume arguments are a series of attr/values
                for (i = 0; i < args.length; i+=2) {
                    // Process the arg as long as its: defined, and isn't the last argument where we're supposed to ignore the last argument
                    // due to it being 'options'
                    if (args[i] !== undefined || i < args.length-1 || (!ignoreLastArg && i === args.length-1)) {
                        attributes[args[i]] = args[i+1];
                    }
                }
            }
        }
    }    
    return {attributes:attributes, options:options};
};

oj.Model._copyOptions = function(options) {
    var optReturn = {}, prop;
    options = options || {};
    
    for (prop in options) {
        if (options.hasOwnProperty(prop)) {
            optReturn[prop] = options[prop];
        }
    }
    return optReturn;
};

oj.Model._triggerError = function(self, silent, options, status, err, xhr) {
    options = options || {};
    options['textStatus'] = status;
    options['errorThrown'] = err;
    self.TriggerInternal(silent, oj.Events.EventType['ERROR'], self, xhr, options);
};


/**
 * Saves the current Model object to the data service. Performs a data "update."<br>
 * Events:<p>
 * <ul>
 * <b>change:attr</b>: fired for each attribute changed, if passed in as part of the save: passing the model, name of the changed property, and options<br>
 * <b>change:all</b>: fired after all attributes have been set, if passed in as part of the save: passing the model and options<br>
 * <b>request</b>: fired when the request to save is going to the server, passing the model, xhr object, and options<br>
 * <b>sync</b>: fired when the model is saved to the data service, passing the model and the raw response<br>
 * <b>error</b>: fired if there is an error during the save, passing the model, xhr ajax object, and options<br>
 * </ul>
 * <p>
 * @param {Object=} attributes One or more attribute name/value pairs to set on the model before the save. 
 * @param {Object=} options Options to control save<br>
 * <b>success</b>: a user callback called when the save has completed successfully. This makes the save an asynchronous process. The callback is called passing the Model object, response from the AJAX call, and the fetch options argument.<p>
 * <b>error</b>: a user callback function called if the save fails. <p>
 * <b>contextType</b>: in case the user's REST service requires a different POST content type than the default, 'application/json'<p>
 * <b>validate</b>: should the validation routine be called if available<p>
 * <b>wait</b>: if true, wait for the server call before setting the attributes on the model<p>
 * <b>patch</b>: should only changed attributes be sent via a PATCH?<p>
 * <b>attrs</b>: pass a set of attributes to completely control the set of attributes that are saved to the server (generally used with patch)
 * @return {Object|boolean} returns false if validation failed
 * @export
 */
oj.Model.prototype.save = function (attributes, options) {    
    var forceNew, success, callback, self, userErr, patch, argResults = oj.Model._processArgs(arguments), opts, oldAttrs, attrArgs;
    attrArgs = attributes === undefined ? undefined : argResults.attributes;
    
    options = options || {};
    opts = oj.Model._copyOptions(argResults.options);

    if (!this._checkValid(this.attributes, opts, true)) {
        return false;
    }

    if (!opts['wait']) {
        this.set(attrArgs);
    }
        
    forceNew  = opts['forceNew'] === undefined ? false : opts['forceNew'];
    self = this;
    userErr = opts['error'];
    patch = opts['patch'];

    opts['error'] = function(xhr, status, err) {
                            // Trigger an error event
                            oj.Model._triggerError(self, false, options, status, err, xhr);

                            if (userErr) {
                                userErr.apply(self, arguments);
                            }
                        };
                        
    opts['saveAttrs'] = opts['wait'] ? this._attrUnion(attrArgs) : this.attributes;
    
    // Must temporarily at least set attrs for toJSON()
    oldAttrs = this.attributes;
    // Swap in what's to be saved and call toJSON()
    this.attributes = opts['saveAttrs'];
    opts['saveAttrs'] = this.toJSON();    
    this.attributes = oldAttrs;
    
    if (!forceNew && !this.isNew()) {
        success = opts['success'];
        opts['success'] = 
            function (resp, textStatus, jqXHR) {
                var attrs;
                
                // Make sure we pass xhr
                if (opts['xhr']) {
                    options['xhr'] = opts['xhr'];
                }
                
                if (resp) {
                    if ($.isFunction(self['parse'])) {
                        attrs = self['parse'](resp);
                    }
                    else {
                        attrs = resp;
                    }
                    
                    self.attributes = $.extend(true, self.attributes, attrs);
                    self.SetupId();
                }
                
                oj.Model._fireSyncEvent(self, resp, opts, false);
                
                if (opts['wait']) {
                    self.set(attrArgs);
                }
                
                if (success) {
                     success.call(oj.Model.GetContext(opts, self), self, resp, options);
                }
                self._clearChanged();
            };        
        // If caller passes in attrs themselves, just use those
        if (!opts['attrs']) {
            if (attrArgs === undefined) {
                opts['attrs'] = undefined;
            }
            else {
                opts['attrs'] = patch ? attrArgs : opts['saveAttrs'];
            }
        }
        return oj.Model._internalSync(patch ? "patch" : "update", this, opts);
    }
    
    callback = oj.Model._getSuccess(opts);
    opts['success'] = function(resp, status, xhr) {
       var attrs;
       // Make sure we pass xhr
       if (opts['xhr']) {
          options['xhr'] = opts['xhr'];
      }
       if (resp) {
            if ($.isFunction(self['parse'])) {
                attrs = self['parse'](resp);
            }
            else {
                attrs = resp;
            }
            if (!self._checkValid(attrs, opts, true)) {
                return;
            }
            self.attributes = $.extend(true, self.attributes, attrs);
            self.SetupId();
       }
       if (opts['wait']) {
           self.set(attrArgs);
       }
       oj.Model._fireSyncEvent(self, resp, opts, false);
       
        if (callback) {
            callback.call(oj.Model.GetContext(opts, self), self, resp, options);
        }
        self._clearChanged();        
    };

    // If caller passed in attrs, just use those
    if (!opts['attrs']) {
        opts['attrs'] = opts['saveAttrs'];
    }
    
    // Turn on parse flag
    opts['parse'] = true;

    // Bizarre case tested by backboneJS--if this is a new model, but we're patching, make sure we only save the explicit attrs
    // if passed in by user
    if (patch) {
        opts['saveAttrs'] = opts['attrs'];
    }
    return oj.Model._internalSync("create", this, opts);
};

oj.Model.prototype._attrUnion = function(attrs) {
    var attrReturn = {}, prop;
    
    for (prop in this.attributes) {
        if (this.attributes.hasOwnProperty(prop)) {
            attrReturn[prop] = this.attributes[prop];
        }
    }
    for (prop in attrs) {
        if (attrs.hasOwnProperty(prop)) {
            attrReturn[prop] = attrs[prop];
        }
    }
    return attrReturn;
};


oj.Model.GetPropValue = function(obj, property) {
    if (obj) {
        if ($.isFunction(obj[property])) {
            return obj[property]();
        }
        else {
            return obj[property];
        }    
    }
    return $.isFunction(property) ? property() : property;
};

oj.Model.IsComplexValue = function(val) {
    return val && val.hasOwnProperty("value") && val.hasOwnProperty("comparator");
};
    
// Does this model contain all of the given attribute/value pairs?
oj.Model.prototype._hasAttrs = function(attrs) {
    var prop;
    for (prop in attrs) {
        if (attrs.hasOwnProperty(prop)) {
            if (!this.attributes.hasOwnProperty(prop)) {
                return false;
            }

            var val = Array.isArray(attrs[prop]) ? attrs[prop] : [attrs[prop]];
            for (var i = 0; i < val.length; i++) {
                if (oj.Model.IsComplexValue(val[i])) {
                    var comparator = val[i]['comparator'];
                    var value = val[i]['value'];
                    if (oj.StringUtils.isString(comparator)) {
                        throw new Error("String comparator invalid for local where/findWhere");
                    }
                    if (!comparator(this, prop, value)) {
                        return false;
                    }
                } else {
                    // Array case meaningless here.  Model can't be == value1 and value2
                    if (attrs[prop] !== this.attributes[prop]) {
                        return false;
                    }
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
 * @returns {function(Object)} function taking an oj.Model that returns true if all of attrs are contained within it
 * @export
 */
oj.Model.prototype.matches = function(attrs) {
    return function(model) {
        for (var prop in attrs) {
            if (model.get(prop) !== attrs[prop]) {
                return false;
            }
        }
        return true;
    }(this);
};

// See if this model contains any of the given attribute/value pairs 
oj.Model.prototype.Contains = function(attrs) {
    var attrList = (attrs.constructor === Array) ? attrs : [attrs], i;
    
    for (i = 0; i < attrList.length; i++) {
        if (this._hasAttrs(attrList[i])) {
            return true;
        }
    }
    return false;
};

oj.Model._getSuccess = function(options) {
    return options != null && options['success'] ? options['success'] : null;
};

oj.Model.GetContext = function(options, model) { 
    if (options !== undefined && options['context'] !== undefined) {
        return options['context'];
    }
    return model;
};

/**
 * Determines if this model object has been assigned an id value yet. This indicates whether or not the model's data has been saved to or fetched from the data service at any point.
 * @returns {boolean} true if the Model object has not had its id set yet, false if not.
 * @export
 */
oj.Model.prototype.isNew = function() {
    return this.GetId() == undefined;
};

oj.Model.prototype._getIdAttr = function () {
    return this['idAttribute'] || 'id';
};

oj.Model.prototype.GetId = function () {
    return this['id'];
};

/**
 * Return the set of attributes and values that have changed since the last set.  Note that a Model.fetch() uses set to store the returned attribute data. If attribute/value pairs are passed in, check those to see if they're different than the model.
 * Return false if there were no changes
 * @param {Object=} attributes One or more attribute/value pairs to check against the model for changes 
 * @return {Object||boolean} the set of all attribute value pairs that have changed since last set, if no attributes passed in; the set of all attribute value pairs that are different than those listed in the attributes parameter, if present.  False if no changes
 * @export
 */
oj.Model.prototype.changedAttributes = function(attributes) {
    if (attributes) {
        var internalChanges = {}, prop;
        for (prop in attributes) {
            if (attributes.hasOwnProperty(prop)) {
                if (!oj.Object.__innerEquals(attributes[prop], this.attributes[prop])) {
                    internalChanges[prop] = attributes[prop];
                }
            }
        }
        return oj.Object.isEmpty(internalChanges) ? false : internalChanges;
    }
    return oj.Object.isEmpty(this['changed']) ? false : this['changed'];
};

/**
 * Return true if the Model object has had any changes made to its values, or if any changes have been made to the optional set of attributes passed in.
 * @param {Array=} attribute One or more attributes to check for changes 
 * @returns {boolean} true if the Model object has had any changes since retrieval or last update at all (if no attributes parameter); true if the Model object has had changes to one or more of the passed-in attributes since retrieval or last update (if attributes parameter present).
 * @export
 */
oj.Model.prototype.hasChanged = function(attribute) {
    if (attribute !== undefined) {
        return oj.Model._hasProperties(this['changed']) && this['changed'].hasOwnProperty(attribute);
    }
    return oj.Model._hasProperties(this['changed']);
};


/**
 * Delete the record represented by this model object from the data service.  If the server responds with virtual mode response properties (such as totalResults), these will be picked up at the end of the delete by the model's collection.  Note that by default, the delete isn't sent with an HTTP data type so the object returning these properties needs to be a string version of the JSON object.<br>
 * Events:<p>
 * <ul>
 * <b>destroy</b>: fired when the model is destroyed, either before or after the server call, depending on the setting of wait.  The model and model's collection are passed in<br>
 * <b>request</b>: fired right as the call is made to request the server delete the model.  Passes the model, xhr ajax object, and options.<br>
 * <b>sync</b>: fired after the server succeeds in destroying the model.  Passes the model, the raw response data, and options.
 * </ul>
 * @param {Object=} options Options for the destroy operation:<br>
 * <b>wait</b>: if true, wait until the server is done to fire the destroy event.  Otherewise, fire immediately and regardless of success or failure<br>
 * <b>success</b>: callback function called if the server call succeeds, passing the model, response data, and options<br>
 * <b>error</b>: callback function on failure of the server call, firing an error event and passing the model, xhr, status, and error values.<br>
 * @export
 */
oj.Model.prototype.destroy = function (options) {
    options = options || {};
    var isWait = options['wait'], callback, context, userErr = options['error'], self = this, xhr, opts;
    
    opts = oj.Model._copyOptions(options);
    callback = oj.Model._getSuccess(opts);
    context = oj.Model.GetContext(opts, this);
    // Grab the collection off the model in case we need to update
    var collection = this.GetCollection();
    
    opts['success'] = function(data, status, xhr) {
        // Make sure we pass xhr
        if (opts['xhr']) {
            options['xhr'] = opts['xhr'];
        }
        
        // Give an opportunity to update any collection paging properties, like totalResults due to this destroy
        if (collection) {
            // Make sure to parse the data if necessary
            var props = oj.StringUtils.isString(data) && !oj.StringUtils.isEmpty(data) ? JSON.parse(data) : data;
                
            collection._setPagingReturnValues(props, null, data, true);
        }
        if (isWait) {
            self._fireDestroy(false);
        }
        oj.Model._fireSyncEvent(self, data, opts, false);
    
        if (callback) {
            callback.call(oj.Model.GetContext(opts, self), self, data, options);
        }
    };
    opts['error'] = function(xhr, status, err) {
                            // Trigger an error event
                            self.TriggerInternal(false, oj.Events.EventType['ERROR'], self, xhr, options);

                            if (userErr) {
                                userErr.apply(self, arguments);
                            }
                        };

    if (!this.isNew()) {
        xhr = oj.Model._internalSync("delete", this, opts);
        if (!isWait) {
            this._fireDestroy(false);
        }
        return xhr;
    }
    if (!isWait) {
        this._fireDestroy(false);
    }
    if (callback) {
        callback.call(oj.Model.GetContext(opts, self), self, null, options);
    }
    return false;
};

// Fire request event
oj.Model.prototype._fireRequest = function(model, xhr, options, silent) {
    this.TriggerInternal(silent, oj.Events.EventType['REQUEST'], model, xhr, options);
};
    
// Fire destroy event to all listeners
oj.Model.prototype._fireDestroy = function (silent) {
    this.TriggerInternal(silent, oj.Events.EventType['DESTROY'], this, this['collection'], null);
};

// Fire sync event to all listeners
oj.Model._fireSyncEvent = function(model, resp, options, silent) {
    model.TriggerInternal(silent, oj.Events.EventType['SYNC'], model, resp, options);
};

/**
 * Return a copy of Model's current attribute/value pairs
 * @return {Object} a copy of the Model's current set of attribute/value pairs.
 * @export
 */
oj.Model.prototype.toJSON = function() {
    var retObj = {}, prop;
    for (prop in this.attributes) {
        if (this.attributes.hasOwnProperty(prop)) {
            if (Array.isArray(this.attributes[prop])) {
                retObj[prop] = this.attributes[prop].slice(0);
            }
            else {
                retObj[prop] = this.attributes[prop];
            }
        }
    }
    return retObj;
};

/**
 * Return the previous value of the given attribute, if any.
 * 
 * @param {string} attr
 * @returns {Object} previous value of attr, if any.  If the attribute has not changed, returns undefined
 * @export
 */
oj.Model.prototype.previous = function(attr) {
    return this.previousAttrs[attr];
};

/**
 * Return a copy of the model's previously set attributes
 * 
 * @returns {Object} a copy of the model's previous attributes
 * @export
 */
oj.Model.prototype.previousAttributes = function() {
    return this.previousAttrs;
};

/**
 * Performs communications with the server.  Can be overridden/replaced by clients
 * 
 * @param {string} method "create", "read", "update", or "delete"
 * @param {Object} model Model to be read/saved/deleted/created
 * @param {Object=} options to control sync:<br>
 * <b>success</b>: called if sync succeeds:<br>
 * <ul>
 * For create, called with the response (attribute/value pairs); status (Ajax by default, but user-defined); xhr object (Ajax--if available)<br>
 * For read, called with the response (attribute/value pairs being fetched)<br>
 * For update, same as create<br>
 * For delete, called with the oj.Model deleted, the data response (ignored), and the options passed to the destroy call<br>
 * </ul>
 * <b>error</b>: called if sync fails.  Called with xhr, status, and error info, per jQuery Ajax (all if available)<p>
 * 
 * @return {Object} xhr object
 * @memberOf oj.Model
 * @instance
 * @alias sync
 */
oj.Model.prototype['sync'] = function(method, model, options) {    
    return window['oj']['sync'](method, model, options);
};

// Internal processing before sync-- we want this stuff to happen even if user replaces sync
oj.Model._internalSync = function(method, model, options) {
    options = options || {};
    // If Model/Collection has OAuth object, then create Authorization header (see oj.RestImpl.addOptions)
    if(model['oauth']) {
            options['oauthHeader'] = model['oauth']['getHeader']();
    }
    	
	// Make sure to transfer the data type if it's set on the calling object
    if (!options['dataType'] && model['dataType']) {
        options['dataType'] = model['dataType'];
    }
    if (!options['jsonpCallback'] && model['jsonpCallback']) {
        options['jsonpCallback'] = model['jsonpCallback'];
    }
    
    // Do parsing if necessary and tuck it on options
    if (method === "create" || method === "patch" || method === "update") {
        options.parsedData = model['parseSave'].call(model, method==="patch" ? options['attrs'] : options['saveAttrs']);
    }
    var recordId = null;
    if (model instanceof oj.Model) {
        recordId = model.GetId();
    }
    var newOpt = {};
    if (options) {
        for (var prop in options) {
            newOpt[prop] = options[prop];
        }
    }
    var urlOpt = oj.Model.SetCustomURLOptions(recordId, model, options);
    for (var prop in urlOpt) {
        newOpt[prop] = urlOpt[prop];
    }
    // Make sure we send back xhr in options-- can come from return value or passed back through options
    options['xhr'] = model['sync'](method, model, newOpt);
    if (newOpt['xhr']) {
        options['xhr'] = newOpt['xhr'];
    }
    return options['xhr'];
};

// Get all custom URL options
oj.Model.SetCustomURLOptions = function(recordID, context, opt) {
    var options = context instanceof oj.Collection ? context.ModifyOptionsForCustomURL(opt) : {};
    if (recordID) {
        options['recordID'] = recordID;
    }
    return options;
};

/**
 * @export
 * @desc Master server access method for all models and collections.  Replace oj.sync with a new implementation
 * to customize all oj.Model and oj.Collection server interactions
 * 
 * @param {string} method "create", "read", "update", "patch", or "delete"
 * @param {Object} model Model (or Collection to be read) to be read/saved/deleted/created
 * @param {Object=} options to control sync<br>
 * success: called if sync succeeds<br>
 * error: called if sync fails<br>
 * others are passed to jQuery<br>
 * Options that would normally be passed to a customURL callback are also included<br>
 * 
 * 
 * @return {Object} xhr object
 * @memberOf oj
 * @global
 * @alias oj.sync
 */
oj.sync = function(method, model, options) {
    function _fireAndReturn(xhr) {
        model._fireRequest(model, xhr, options, options['silent']);
        return xhr;        
    };
    
    options = options || {};
    var restService, success = options['success'], error = options['error'], cors, customURL;
    
    cors = options['dataType'] === 'jsonp' ? false : true;
    customURL = model['customURL'];
    
    if (method.valueOf() === "create") {
      var url = model._saveUrl();
      url = url ? url : oj.Model.GetPropValue(model, 'url');
      restService = new oj.RestImpl(url, customURL);
      return _fireAndReturn(restService.addRecord(options.parsedData, error, options, model));
    }

    if (method.valueOf() === "read") {
        if (model instanceof oj.Model) {
            var url = options['url'] ? options['url'] : oj.Model.GetPropValue(model, 'url');
            restService = new oj.RestImpl(url, customURL);
            return _fireAndReturn(restService.getRecord(success, error, model.GetId(), options, oj.Model.GetContext(options, model)));
        }
        // Collection fetch
        var url = model.GetCollectionFetchUrl(options);
        restService = new oj.RestImpl(url, customURL);
        return _fireAndReturn(restService.getRecords(success, error, options, model));
    }
    
    restService = new oj.RestImpl(oj.Model.GetPropValue(model, 'url'), customURL);
    var recordId = null;
    if (model instanceof oj.Model) {
        recordId = model.GetId();
    }
    if (method.valueOf() === "update") {
        return _fireAndReturn(restService.updateRecord(success, recordId, options.parsedData, error, options, model, false));
    }
    if (method.valueOf() === "patch") {
        return _fireAndReturn(restService.updateRecord(success, recordId, options.parsedData, error, options, model, true));
    }
    if (method.valueOf() === "delete") {
        return _fireAndReturn(restService.deleteRecord(recordId, error, options, model));
    }
    return null;
};


oj.Model._urlError = function(ajaxOptions) {
    if (!ajaxOptions['url']) {
        throw new Error('The url property or function must be specified');
    }
};

/**
 * @export
 * @desc Master Ajax entry point for all oj.Model and oj.Collection server interactions, when they are using the default sync implementations.
 * oj.ajax passes through to jQuery ajax by default.  See {@link http://api.jquery.com/jquery.ajax/} for expected parameters and return value.
 * 
 * @return {Object} xhr object
 * @memberOf oj
 * @global
 * @alias oj.ajax
 */
oj.ajax = function() {
    if (arguments && arguments.length > 0) {
        oj.Model._urlError(arguments[0]);
    }
    return $.ajax.apply(window['oj'], arguments);
};
/**
 * Copyright (c) 2014, 2015 Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/

/**
 * @constructor
 * @class oj.URLError
 * @desc Constructs a URLError, thrown when API calls are made that require a URL but no URL is defined.
 * @export
 */
oj.URLError = function() {
    this.name = "URLError";
    this.message = "No URL defined";
}
oj.URLError.prototype = new Error();
oj.URLError.constructor = oj.URLError;
/**
 * Copyright (c) 2014, 2015 Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/
/*global jQuery:false*/
/**
 * @private
 * @constructor
 */
oj.RestImpl = function(rootURL, custom) {
    this.rootURL = rootURL;
    this.customURL = custom;
    $.support['cors'] = true;    
};

oj.RestImpl._HEADER_PROP = "headers";

// Add the properties in options to starter, if not already there
oj.RestImpl.addOptions = function(starter, options, customOptions) {
    var prop;
    starter = $.extend(true, starter, customOptions);
    for (prop in options) {
        if (options.hasOwnProperty(prop) && prop !== 'oauthHeader') {
            if (!starter.hasOwnProperty(prop)) {
                starter[prop] = options[prop];
            }
            if (prop === oj.RestImpl._HEADER_PROP) {
                // Deep merge
                starter[prop] = $.extend(true, starter[prop], options[prop]);
            }
        }
    }
	
    if(options['oauthHeader']) {
        // if there are no any headers then create a new one.
        if(!starter[oj.RestImpl._HEADER_PROP]) starter[oj.RestImpl._HEADER_PROP] = {}; 	
        for (prop in options['oauthHeader']) {
            if (options['oauthHeader'].hasOwnProperty(prop)) {
                if (!starter[oj.RestImpl._HEADER_PROP].hasOwnProperty(prop)) {
                    starter[oj.RestImpl._HEADER_PROP][prop] = options['oauthHeader'][prop];
                }
            }
        }
    }

    return starter;
};

oj.RestImpl.prototype.getRecords = function(callback, errFunc, options, context) {
        options = options || {};
        var isJsonp = options['dataType'] === 'jsonp';
        var urlInfo = this._getURL("read", this.rootURL, this.customURL, null, context, options);
        var ajaxOptions = {
                'crossDomain': options['crossDomain'] || !isJsonp,
		'dataType': this._getDataType(options),
                'jsonpCallback' : options['jsonpCallback'],
                'context': context !== null ? context : this,
		'success':  callback,
                'error': errFunc
	};
        ajaxOptions = this._addHeaderProp(ajaxOptions);
        ajaxOptions = oj.RestImpl.addOptions(ajaxOptions, options, urlInfo);
	options.xhr = this.ajax(ajaxOptions);
        return options.xhr;
};

oj.RestImpl.prototype._addHeaderProp = function(options) {
    options[oj.RestImpl._HEADER_PROP] = {'Accept-Language': this.getLocale()};
    return options;
};

oj.RestImpl.prototype.getRecord = function(success, error, recordID, options, context) {
        options = options || {};
        var isJsonp = options['dataType'] === 'jsonp';
        var urlInfo = this._getURL("read", this.rootURL, this.customURL, recordID, context, options);
        var ajaxOptions = {
                'crossDomain': options['crossDomain'] || !isJsonp,
		'dataType': this._getDataType(options),
                'jsonpCallback' : options['jsonpCallback'],
                'context': context !== null ? context : this,
		'success': success,
                'error': error
	};
        ajaxOptions = this._addHeaderProp(ajaxOptions);
        ajaxOptions = oj.RestImpl.addOptions(ajaxOptions, options, urlInfo);
	options.xhr = this.ajax(ajaxOptions);    
        return options.xhr;
};


oj.RestImpl.prototype.updateRecord = function(callback, recordID, record, error, options, context, patch) {
    options = options || {};
    var isJsonp = options['dataType'] === 'jsonp';
    var urlInfo = this._getURL(patch ? "patch": "update", this.rootURL, this.customURL, recordID, context, options);
    var emulateHTTP = oj.RestImpl._emulateHTTP(options);
    var ajaxOptions = {
        'crossDomain': options['crossDomain'] || !isJsonp,
        'contentType': this._getContentType(options),
        'dataType': this._getDataType(options),
        'jsonpCallback' : options['jsonpCallback'],
        'data': this._getData(JSON.stringify(record), options, urlInfo),
        'emulateHTTP': emulateHTTP,
        'emulateJSON': oj.RestImpl._emulateJSON(options),
        'success': callback,
        'error': error,
        'context': context !== null ? context : this
    };
    ajaxOptions = this._addHeaderProp(ajaxOptions);
    ajaxOptions = oj.RestImpl.addOptions(ajaxOptions, options, urlInfo);
    ajaxOptions = oj.RestImpl._beforeSendMod(emulateHTTP, ajaxOptions);
    options.xhr = this.ajax(ajaxOptions);
    return options.xhr;
};

oj.RestImpl._beforeSendMod = function(emulateHTTP, options) {
    if (emulateHTTP) {
        // Do a before send xhr mod for this case
        var beforeSend = options['beforeSend'];
        options['beforeSend'] = function(xhr) {
            xhr.setRequestHeader('X-HTTP-Method-Override', options._method);
            if (beforeSend) {
                return beforeSend.apply(this, arguments);
            }
        };
    }
    return options;
};

oj.RestImpl.prototype._getData = function(data, options, urlInfo) {
    if (oj.RestImpl._emulateJSON(options)) {
        // Push record and _method into an object
        var retObj = {'_method': urlInfo._method ? urlInfo._method : urlInfo['type']};
        if (data) {
            retObj['model'] = data;
        }
        return retObj;
    }
    return data;
};

oj.RestImpl.prototype._getHTTPMethod = function(operation, options) {
    if (options['type']) {
        return {method: options['type']};
    }
    var method = null;
    if (operation === "create") {
        method = "POST";
    }
    if (operation === "delete") {
        method = "DELETE";
    }
    if (operation === "patch") {
        method = "PATCH";
    }
    if (operation === "update") {
        method = "PUT";
    }
    if (oj.RestImpl._emulateHTTP(options)) {
        // Convert method to POST, put original method under data._method 
        var retObj = {};
        retObj.method = "POST";
        retObj._method = method;
        return retObj;
    }
    if (method === null) {
        method = "GET";
    }
    return {method: method};
};

oj.RestImpl._emulateHTTP = function(options) {
    return options['emulateHTTP'] || oj['emulateHTTP'];
};

oj.RestImpl._emulateJSON = function(options) {
    return options['emulateJSON'] || oj['emulateJSON'];
};
    
oj.RestImpl.prototype._getURL = function(operation, rootURL, customURL, recordID, context, options) {
   var httpMethod = this._getHTTPMethod(operation, options);
   if ($.isFunction(customURL)) {
       var result = customURL.call(this, operation, context, oj.Model.SetCustomURLOptions(recordID, context, options));
       if (oj.StringUtils.isString(result)) {
           var retObj = {'url': result, 'type' : httpMethod.method};
           if (httpMethod._method) {
               retObj._method = httpMethod._method;
           }
           return retObj;
       }
       else if (result) {
           result['url'] = result.hasOwnProperty('url') ? result['url'] : rootURL;
           if (!result.hasOwnProperty('type')) {
                result['type'] = httpMethod.method;
            }
            if (!result.hasOwnProperty('data')) {
                if (httpMethod._method) {
                    result._method = httpMethod._method;
                }
            }
           return result;
       }
    }
    var retObj = {'url': oj.Model.GetPropValue(null, rootURL), 'type': httpMethod.method};
    if (httpMethod._method) {
        retObj._method = httpMethod._method;
    }
    return retObj;
};

oj.RestImpl.prototype.deleteRecord = function(recordID, error, options, context) {
    options = options || {};
    var isJsonp = options['dataType'] === 'jsonp';
    var urlInfo = this._getURL("delete", this.rootURL, this.customURL, recordID, context, options);

    var emulateHTTP = oj.RestImpl._emulateHTTP(options);
    var emulateJSON = oj.RestImpl._emulateJSON(options);
    var ajaxOptions = {
        'crossDomain': options['crossDomain'] || !isJsonp,
        'success': options.success,
        'error': error,
        'context': context !== null ? context : this,
        'emulateHTTP': emulateHTTP,
        'emulateJSON': emulateJSON
    };
    var data = this._getData(null, options, urlInfo);
    if (data) {
        ajaxOptions['data'] = data;
    }
    ajaxOptions = oj.RestImpl.addOptions(ajaxOptions, options, urlInfo);
    ajaxOptions = oj.RestImpl._beforeSendMod(emulateHTTP, ajaxOptions);
    options.xhr = this.ajax(ajaxOptions);
    return options.xhr;
};

oj.RestImpl.prototype.addRecord = function(record, error, options, context) {
    options = options || {};
    var recordStr = JSON.stringify(record), isJsonp = options['dataType'] === 'jsonp';
    var urlInfo = this._getURL("create", this.rootURL, this.customURL, null, context, options);

    var emulateHTTP = oj.RestImpl._emulateHTTP(options);
    var ajaxOptions = {
        'crossDomain': options['crossDomain'] || !isJsonp,
        'contentType': options['contentType'] || 'application/json',
        'dataType': this._getDataType(options),
        'jsonpCallback' : options['jsonpCallback'],
        'data': this._getData(recordStr, options, urlInfo),
        'success': options.success,
        'error': error,
        'emulateHTTP': emulateHTTP,
        'emulateJSON': oj.RestImpl._emulateJSON(options),
        'context': context !== null ? context : this
    };
    ajaxOptions = this._addHeaderProp(ajaxOptions);
    ajaxOptions = oj.RestImpl.addOptions(ajaxOptions, options, urlInfo);
    options.xhr = this.ajax(ajaxOptions);  

    return options.xhr;
};

oj.RestImpl.prototype._getDataType = function(options) {
    if (oj.RestImpl._emulateJSON(options) && !oj.RestImpl._emulateHTTP(options)) {
        return "application/x-www-form-urlencoded";
    }
    return options['dataType'] || "json";
};

oj.RestImpl.prototype._getContentType = function(options) {
    if (oj.RestImpl._emulateJSON(options) && !oj.RestImpl._emulateHTTP(options)) {
        return "application/x-www-form-urlencoded";
    }
    
    return options['contentType'] || 'application/json';
};

oj.RestImpl.prototype.getLocale = function() {
    return oj.Config.getLocale();
};

oj.RestImpl.prototype.ajax = function(settings) {
    if (settings.url === null || settings.url === undefined) {
        throw new oj.URLError();
    }

    return window['oj']['ajax'](settings);
};


/**
 * Copyright (c) 2014, 2015 Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/
/*global jQuery:false*/

/**
 * @export
 * @class oj.OAuth
 * @classdesc Member of Model objects. Object representing name/value pairs for a data service record
 *
 * @param {Object} attributes Initial set of attribute/value pairs with which to seed this OAuth object 
 * @param {string} header Actual name for the Authorization header (default 'Authorization') 
 * @example <caption>Initialize OAuth with client credentials</caption>
 * var myOAuth = new oj.OAuth('X-Authorization', {...Client Credentials ...});
 * 
 * @example <caption>Initialize OAuth with access_token</caption>
 * var myOAuth = new oj.OAuth('X-Authorization', {...Access Token...});
 * 
 * @example <caption>Initialize empty OAuth and set access_token</caption>
 * var myOAuth = new oj.OAuth();
 * myOAuth.setAccessTokenResponse({...Access Token...});
 *
 * @constructor
 */
oj.OAuth = function(header, attributes) 
{
	attributes = attributes || {};
	header = header || 'Authorization';
	oj.OAuth._init(this, attributes, header);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.OAuth, oj.Object, "oj.OAuth");
oj.OAuth.prototype.Init = function()
{
    oj.OAuth.superclass.Init.call(this);
};

/**
 * Calculates Authorization header based on client credentials or access_token
 * @return {Object} OAuth 2.0 Authorization header
 * @example <caption>Get Authorization header</caption>
 * myOAuth.getHeader();
 *
 * @export
 */
oj.OAuth.prototype.getHeader = function() 
{
	var headers = {};
	if(!this.accessTokenResponse['access_token']) {
		this.clientCredentialGrant();
	}
	headers[this.accessTokenRequest.auth_header]='Bearer '+this.accessTokenResponse['access_token'];
	return headers;
}

/**
 * Check is OAuth initialized (not null access_token).
 * @return {boolean} true/false
 * @example <caption>Check if OAuth initialized</caption>
 * if(myOAuth.isInitialized()) console.log('Initialized');
 *
 * @export
 */
oj.OAuth.prototype.isInitialized = function() 
{
	return (this.accessTokenResponse.access_token) ? true : false;
}

/**
 * Request for access_token(bearer token) using Client Credential Authorization Grant.
 * Initialize response part of the OAuth object (access_token, e.t.c.)
 * @example <caption>Set/Re-set response part of the OAuth object using Client Credentials</caption>
 * myOAuth.clientCredentialGrant();
 *
 * @export
 */
oj.OAuth.prototype.clientCredentialGrant = function() 
{
	var headers = {}, self = this;
	headers[self.accessTokenRequest.auth_header] = 'Basic ' + 
		oj.OAuth._base64_encode(self.accessTokenRequest['client_id']+':'+self.accessTokenRequest['client_secret']);
		
	$.ajax({
		type: 'POST',
		async: false,
		url: this.accessTokenRequest['bearer_url'],
		data: 'grant_type=client_credentials',
		headers: headers,
		success:function(data) {
			oj.OAuth._initAccessToken(self.accessTokenResponse, data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			throw new Error(jqXHR.responseText);
		}
	});	

}

/**
 * Set response part of the OAuth object (access_token, e.t.c.)
 * @param {Object} data current response
 * @example <caption>'Initialize' response part of the OAuth object with access_token</caption>
 * myOAuth.setAccessTokenResponse({...Access Token...});
 *
 * @export
 */
oj.OAuth.prototype.setAccessTokenResponse = function(data) 
{
	oj.OAuth._initAccessToken(this.accessTokenResponse, data);
}

/**
 * Get response part of the OAuth object (access_token, e.t.c.)
 * @return {Object} cached response
 * @export
 */
oj.OAuth.prototype.getAccessTokenResponse = function()
{
	return this.accessTokenResponse;
}

/**
 * Clean response part of the OAuth object (access_token, e.t.c.)
 * Null and remove all data from response part of the OAuth object
 * @export
 */
oj.OAuth.prototype.cleanAccessTokenResponse = function()
{
	oj.OAuth._cleanAccessToken(this.accessTokenResponse);
}

/**
 * Set request part of the OAuth object (client credentials, uri endpoint)
 * @param {Object} data current client credentials and uri
 * @example <caption>'Initialize' request part of the OAuth object with client credentials and calculate access_token</caption>
 * myOAuth.setAccessTokenRequest({...Client Credentials ...});
 * myOAuth.clientCredentialGrant();
 *
 * @export
 */
oj.OAuth.prototype.setAccessTokenRequest = function(data) 
{
	oj.OAuth._initAccessToken(this.accessTokenRequest, data);
}

/**
 * Get request part of the OAuth object (client credentials, uri endpoint)
 * @return {Object} cached request
 * @export
 */
oj.OAuth.prototype.getAccessTokenRequest = function()
{
	return this.accessTokenRequest;
}

/**
 * Clean request part of the OAuth object (client credentials, uri endpoint)
 * Null and remove all data from request part of the OAuth object
 * @export
 */
oj.OAuth.prototype.cleanAccessTokenRequest = function()
{
	oj.OAuth._cleanAccessToken(this.accessTokenRequest);
}

/**
 * @private
 * @param {Object} oauth
 * @param {Object} attributes
 * @param {string||null} header
 */
oj.OAuth._init = function(oauth, attributes, header) 
{
	oauth.Init();
	oauth.accessTokenRequest = {};
	oauth.accessTokenResponse = {};
	
	if(attributes['access_token']) { // access_token has higher preference
		oj.OAuth._initAccessToken(oauth.accessTokenResponse, attributes);
	} else if(attributes['client_id'] && attributes['client_secret'] && attributes['bearer_url']) { // Client Credential Grant		
		oj.OAuth._initAccessToken(oauth.accessTokenRequest, attributes);
	}
	oauth.accessTokenRequest.auth_header = header;
}

/**
 * @private
 * @param {Object} oauthObj - Request/Response object to deal with
 * @param {Object} data - object to populate
 */
oj.OAuth._initAccessToken = function(oauthObj, data) {
	var prop;
	data = data || {};
	for (prop in data) {
		oauthObj[prop] = data[prop];
	}
}

/**
 * @private
 * @param {Object} oauthObj - Request/Response object to deal with
 */
oj.OAuth._cleanAccessToken = function(oauthObj) {
	var key;
	for (key in oauthObj) {
		if (oauthObj.hasOwnProperty(key)) {
			if(key !== 'auth_header') {
				oauthObj[key] = null;
				delete oauthObj[key];
			}
		}
	}
}

/**
 * @private
 * @param {string} a The data to calculate the base64 representation from
 * @return {string} The base64 representation
 */
 oj.OAuth._base64_encode = function (a) {
	var d, e, f, b, g = 0,
		h = 0,
		i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		c = [];
	do {
		d = a.charCodeAt(g++);
		e = a.charCodeAt(g++);
		f = a.charCodeAt(g++);
		b = d << 16 | e << 8 | f;
		d = b >> 18 & 63;
		e = b >> 12 & 63;
		f = b >> 6 & 63;
		b &= 63;
		c[h++] = i.charAt(d) + i.charAt(e) + i.charAt(f) + i.charAt(b);
	} while (g < a.length);
	c = c.join("");
	d = a.length % 3;
	return (d ? c.slice(0, d - 3) : c) + "===".slice(d || 3);	
}

/**
 * Copyright (c) 2014, 2015 Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/

/**
 * @export
 * @class oj.Collection 
 * @classdesc Collection of Model objects 
 * 
 * @param {Array=} models Set of model objects to put into collection at construction time.  If models contain actual oj.Model objects, then any custom parse callback set on the collection must be able to handle oj.Model objects as a possible argument
 * @param {Object=} options Passed through to the user's initialize routine, if any, upon construction 
 * @constructor
 * @mixes oj.Events
 */
oj.Collection = function(models, options) {
    if (oj.Collection._justExtending) {
        return;
    }

    // Initialize
    oj.Collection._init(this, models, options, null);
};


// Subclass from oj.Object 
oj.Object.createSubclass(oj.Collection, oj.Object, "oj.Collection");

/**
 * @desc Property specifying the [model]{@link oj.Model} class object used by the collection
 * 
 * @type Object
 * @export
 */
oj.Collection.prototype.model = null;


/**
 * @desc Function specifying how to construct the id for models in this collection.  Override to change the construction of the id.
 * @type {(function(Object):(String)|null)} 
 * @export
 */
oj.Collection.prototype.modelId = function(attrs) {
                                        var model = this['model'];
                                        if (model && attrs) {
                                            return attrs[model['idAttribute'] || model.prototype['idAttribute'] || 'id'];
                                        }
                                        return null;
                                    };

/**
 * @export
 * @desc Total number of models in the collection.  When the collection is virtual, not all of the models may be locally available.
 * 
 * @type number
 */
oj.Collection.prototype.length = undefined;

/**
 * @export
 * @desc Direct access to the collection's list of models objects<br/>
 * Note that this property should not be used directly when a collection is virtual, as
 * automatic fetches will not be triggered for undefined elements in the model.  Use at() instead.
 * 
 * @type Array 
 */
oj.Collection.prototype.models = undefined;

// Tracking indices used
oj.Collection.prototype._modelIndices = [];

/**
 * @export
 * @desc The data service's server URL.
 * 
 * @type String
 */
oj.Collection.prototype.url = null;

/**
 * @export
 * @desc Changes that have occured due to adds/removes since the last fetch.  This is a list of indicies that have changed (location at which a model was added, deleted, or set).  They do not shift with subsequent operations
 * @type Array
 */
oj.Collection.prototype.changes = [];


/**
 * A callback to allow users to customize the data service URLs.  The callback should accept these parameters:<p>
 * <b>operation</b>: one of "create", "read", "update", "patch", or "delete", indicating the type of operation for which to return the URL<p>
 * <b>collection</b>: the oj.Collection object requesting the URL<p>
 * <b>options</b>: any of the following properties:<br>
 * <ul>
 * <b>recordID</b>: id of the record involved, if relevant<br>
 * <b>fetchSize</b>: how many records to return.  If not set, return all.<br>
 * <b>startIndex</b>: Starting record number of the set to return.<br>
 * <b>startID</b>: Retrieve records starting with the record with the given unique ID.<br>
 * <b>since</b>: Retrieve records with timestamps after the given timestamp.<br>
 * <b>until</b>: Retrieve records with timestamps up to the given timestamp.  Default is "until"<br>
 * <b>sort</b>:  field(s) by which to sort, if set<br>
 * <b>sortDir</b>: sort ascending or descending (asc/dsc)<br>
 * <b>query</b>: a set of attributes indicating filtering that should be done on the server.  See [where]{@link oj.Collection#where} for complete documentation of query values<br>
 * <b>all</b>: true (along with 'query', above) indicates that this is a findWhere or where type call that is expecting all models meeting the query condition to be returned<br>
 * </ul>
 * <p>
 * customURL callbacks should return either: null, in which case the default will be used; a url string, which will be used with the standard
 * HTTP method for the type of operation, or an Object with any other attributes that should be passed to the ajax call.<br>
 * This object must at minimum include the URL, and other attributes as follows:<br>
 * <ul>
 * <b>url</b>: the custom URL string<br>
 * <b>type</b>: (optional) a string indicating the type of HTTP method to use (GET, POST, DELETE, etc.)<br>
 * <b>(other)</b>: (optional) any other attributes to pass in the ajax call<br>
 * </ul>
 * <p>
 *  @type {(function(string,Object,Object):(string|Object|null))|null}
 * @export
 */
oj.Collection.prototype.customURL = null;

/**
 * A callback allowing users to extract their own paging/virtualization return values from the server's response.<p>
 * It should accept these parameters:<p>
 * <b>response</b>: the response coming back from the fetch call<p>
 * <p>
 * The callback should return either null, in which case the collection will look for the default properties, or
 * an object containing one or more of the following attribute/value pairs (note that the Collection will look back to the response for default paging return properties if 
 * not found in the returned object):<br>
 * <ul>
 * <b>totalResults</b>: the total number of records available on the server side, not just in the current result.  By default the collection looks in the response for "totalResults"<br>
 * <b>limit</b>: the actual fetchSize from the server.  This may not be the client's fetchSize or the number of records in the current result.  By default the collection looks in the response for "limit".  This becomes the collection's "lastFetchSize" property<br>
 * <b>count</b>: the actual number of records returned by the server in the last result.  This becomes the collection's "lastFetchCount".  By default the collection looks in the response for "count".<br>
 * <b>offset</b>: the actual starting record number of the current result.  By default the collection looks in the response for "offset"<br>
 * <b>hasMore</b>: boolean indicating whether or not there are more records available beyond the current result.  By default the collection looks in the response for "hasMore"<br>
 * </ul>
 * <p>
 *                  
 * @type {(function(Object):(Object|null)|null)} 
 * @export
 */
oj.Collection.prototype.customPagingOptions = null;


/**
 * @export
 * @desc The server's fetch size.  This may not match [fetchSize]{@link oj.Collection#fetchSize}.
 * 
 * @type number
 */
oj.Collection.prototype.lastFetchSize = undefined;

/**
 * @export
 * @desc Indicates whether or not there are more records available on the server, at indices beyond the last fetch.
 * 
 * @type boolean
 */
oj.Collection.prototype.hasMore = false;

/**
 * @export
 * @desc The total number of records available for this collection regardless of whether they have been fetched or not.  For non-virtual collections this will equal the length.
 * 
 * @type number
 */
oj.Collection.prototype.totalResults = undefined;

/**
 * 
 * @export
 * @desc The number of records actually fetched the last time the collection fetched from the server.  This may or may not match [fetchSize]{@link oj.Collection#fetchSize} or [lastFetchSize]{@link oj.Collection#lastFetchSize}
 * 
 * @type number
 */
oj.Collection.prototype.lastFetchCount = undefined;

/**
 * @export
 * @desc For virtual collections, the number of records to be kept in memory at any one time.  The default of -1 indicates that no records are thrown out
 * 
 * @type number
 */
oj.Collection.prototype.modelLimit = -1;

/**
 * @export
 * @desc The actual starting index number at which models from the last server fetch were inserted into the collection.
 * 
 * @type number
 */
oj.Collection.prototype.offset = undefined;

/**
 * @export
 * @desc The number of records to be fetched from the server in any one round trip.  The server's fetch size comes back as the "limit" property.  The default value of -1 indicates that virtualization is not being used or is not available, and all records will be fetched.<br>
 * The number of records actually fetched comes back as [count]{@link oj.Collection#count}<br>
 * 
 * @type number
 */
oj.Collection.prototype.fetchSize = -1;

/**
 * @export
 * @desc Sort direction for string-based sort comparators (model attribute names).  A value of 1 indicates ascending sorts, -1 indicates descending.  The default is 1 (ascending).<br>
 * Users should call sort() after changing sort direction to ensure that models in the collection are sorted correctly, or, for virtual collections, that there are no left over models in an incorrect order.
 * 
 * @type number
 */
oj.Collection.prototype.sortDirection = 1;

/**
 * @export
 * @desc If set to a string, sort the collection using the given attribute of a model.<p>
 * If set to a function(Model), the function should return a string giving the model attribute by which the sort should take place.<p>
 * If set to a function(Model1, Model2), then this function is called comparing Model1 and Model2 (see the JavaScript array.sort() for details)<p>
 * In the virtual case, comparator must be a string-based field comparator, which will be passed to the server.<p>
 * Users should call sort() after making any changes to the comparator to ensure that the models are correctly sorted, or that there are no leftover models sorted incorrectly in the virtual case.
 * 
 * @type {String|function(Object)|function(Object,Object)}
 */
oj.Collection.prototype.comparator = null;

oj.Collection.prototype.Init = function()
{
    oj.Collection.superclass.Init.call(this);
};

/**
 * Create a new, specific type of Collection object to represent a collection of records from a JSON data set.
 * @param {Object=} properties Properties for the new Collection class.<p>
 *                  <b>parse</b>: a user callback function to allow parsing of the JSON collection after it's returned from the data service.  If a collection is initialized with actual oj.Models or collection.set is used with actual oj.Models, the parse callback must expect that the argument passed to it may contain raw JSON data *or* oj.Model objects<br>
 *                  <b>model</b>: the specific type of [model]{@link oj.Model} object to use for each member of the collection<br>
 *                  <b>url</b>: the URL string to use to get records from the data service<br>
 *                  <b>initialize</b>: a user callback function to be called when this collection is created.  Called with collection, models, options.<br>
 *                  <b>comparator</b>: a user callback used on sort calls. May also be set to false to prevent sorting.  See [comparator]{@link oj.Collection#comparator}<br>
 *                  <b>fetchSize</b>: the number of records to be fetched on each round trip to the server.  Overrides [fetchSize]{oj.Collection#fetchSize}. If not set, the collection will not consider itself virtual<br>
 *                  <b>modelLimit</b>: the number of records to be held in memory at any one time, if virtualization is in force.  The default is all records.  This uses an LRU algorithm to determine which to roll off as more records are added.<br>
 * @param {Object=} classProperties optional properties that get attached to the constructor of the extended Collection
 * @return {function(new:Object, ...)} new Collection object
 * @this {oj.Collection}
 * @export
 */
oj.Collection.extend = function(properties, classProperties)
{
    oj.Collection._justExtending = true;
    var obj = new oj.Collection();
    oj.Collection._justExtending = false;
          
    // Add regular properties from this "parent"
    //oj.Events.Mixin(obj, this.prototype);
    $.extend(obj, this.prototype);
          
    var Collection;
    if (properties && properties['constructor'] && properties.hasOwnProperty('constructor')) {
        Collection =  properties['constructor'];
    }
    else {
        Collection = function(models, options) {
                        oj.Collection._init(this, models, options, properties);
                    }
    }

    if (classProperties) {
        var prop;
        for (prop in classProperties) {
            if (classProperties.hasOwnProperty(prop)) {
                Collection[prop] = classProperties[prop];
            }
        }
    }
    
    if (properties) {
        var prop;
        for (prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                obj[prop] = properties[prop];
            }
        }
    }

    $.extend(Collection, this);
    Collection.prototype = obj;
    
    // Allow extending resulting obj
    Collection.extend = oj.Collection.extend;
    
    Collection.prototype.constructor = Collection;
        
    return Collection;    
};


oj.Collection._init = function(collection, models, options, properties) {
    var prop, i, optionlist, modelList;

    collection.Init();
    
    // Augment with Event    
    oj.Events.Mixin(collection);

    // First, copy all properties passed in
    if (properties) {
        for (prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                collection[prop] = properties[prop];
            }
        }        
    }

    // Check options
    options = options || {};
    optionlist = ["comparator", "customPagingOptions", "customURL", oj.Collection._FETCH_SIZE_PROP, "model", "modelLimit", "sortDirection", "url"];
    for (i = 0; i < optionlist.length; i++) {            
        if (options.hasOwnProperty(optionlist[i]) && options[optionlist[i]] !== undefined) {
            collection[optionlist[i]] = options[optionlist[i]];            
        }
    }
    if (collection._getFetchSize(null) === undefined) {
        collection.setFetchSize(-1);
    }
    if (collection['modelLimit'] === undefined) {
        collection.setModelLimit(-1);
    }
    collection['hasMore'] = false;
    collection.lruCount = 0;

    collection._setModels([], true);
    if (options['parse']) {
        models = collection['parse'](models);
    }
    if (models != null) {
        options.noparse = true;
        modelList = (models instanceof Array) ? models : [models];    
        for (i = 0; i < modelList.length; i=i+1) {
            collection.add(modelList[i], options);
        }
    }
    collection._setLength();
    
    if (properties && properties['initialize']) {
        properties['initialize'].call(collection, models, options);
    }        
};


// Placeholder for event mixins
oj.Collection.prototype.on = function (event, callback) {};
oj.Collection.prototype.OnInternal = function(event, callback, context, listenTo, ignoreSilent) {};
oj.Collection.prototype.TriggerInternal = function (silent, event, arg1, arg2, options) {};

// Fire request event
oj.Collection.prototype._fireRequest = function(collection, xhr, options, silent) {
    this.TriggerInternal(silent, oj.Events.EventType['REQUEST'], collection, xhr, options);
};

oj.Collection.prototype._resetChanges = function() {
    this['changes'] = [];
};

oj.Collection.prototype._setChangeAt = function(start, count) {
    for (var at = start; at < start+count; at++) {
        if (this['changes'].indexOf(at) === -1) {
            this['changes'].push(at);
            this['changes'].sort(function(a,b) { return a-b;});
        }
    }
};


oj.Collection.prototype._setModels = function(models, clearing) {
    this['models'] = models;
    if (clearing) {
        this._modelIndices = [];
        this._resetChanges();
    }
    else {
        for (var i = 0; i < models.length; i++) {
            if (models[i]) {
                this._modelIndices.push(i);
            }
        }
    }
};

/*oj.Collection.prototype._setModel = function(index, model) {
    this._getModels()[index] = model;
};*/

oj.Collection.prototype._getModels = function() {
    return this['models'];
};

oj.Collection.prototype._getModelsLength = function() {
    return this._getModels().length;
};

// Designed to check if index exceeds the length of the models.  If we're in a virtual and "no totalResults" case, we're never over the upper limit
oj.Collection.prototype._overUpperLimit = function(index) {
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

oj.Collection.prototype._hasTotalResults = function() {
    return oj.Collection._defined(this['totalResults']);
}

oj.Collection._defined = function(value) {
    return value != null;
}

oj.Collection.prototype._pushModel = function(model) {
    this._getModels().push(model);
    this._modelIndices.push(this._getModelsLength()-1);
    this._setChangeAt(this._getModelsLength()-1, 1);
};
    
oj.Collection.prototype._pushModels = function(model) {
    // Model is being added to the end, it should be made the head
    this._makeModelHead(model);
    this._pushModel(model);
    this.lruCount++;
    model.SetIndex(this._getModelsLength()-1);
};

oj.Collection.prototype._reduceLRU = function(removed) {
    if (removed) {
        for (var i = 0; i < removed.length; i++) {
            if (removed[i]) {
                this.lruCount--;
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
oj.Collection.prototype._spliceModels = function(start, count, model) {
    // Clean up prev/next links for models being removed
    for (var i = start; i < start + count; i++) {
        this._removePrevNext(this._getModel(i));
    }
    if (model === undefined) {
        this._reduceLRU(this._getModels().splice(start, count));
        this._spliceModelIndices(start, start+count-1);
    }
    else {
        this._reduceLRU(this._getModels().splice(start, count, model));
        this._spliceModelIndices(start, start+count-1);
        this._insertModelIndex(start);
        this._makeModelHead(model);
    }
    this._setChangeAt(start, count);
    if (this.lruCount < 0) {
        this.lruCount = 0;
    }
    this._realignModelIndices(start);
};

oj.Collection.prototype._getModel = function(index) {
    return this._getModels()[index];
};

// Realign all the indices of the models (after sort for example)
oj.Collection.prototype._realignModelIndices = function(start) {
    var index;
    for (var i = 0; i < this._modelIndices.length; i++) {
        index = this._modelIndices[i];
        if (index >= start && this._getModel(index)) {
            this._getModel(index).SetIndex(index);
        }
    }
};

// Update next/prev pointers as though the given model were being removed
oj.Collection.prototype._removePrevNext = function(model) {
    if (!model) {
        return;
    }
    
    var oldPrev = model.GetPrevious();
    var oldNext = model.GetNext();
    // Link the two surrounding previous/next elements to each other, because this one is being replaced and moved
    // to the head
    if (oldPrev) {
        oldPrev.SetNext(oldNext);        
    }
    else {
        // This element used to be the head
        this.head = oldNext;
    }
    if (oldNext) {
        oldNext.SetPrevious(oldPrev);
    }
    else {
        // This element used to be the tail
        this.tail = oldPrev;
    }    
};

oj.Collection.prototype._makeModelHead = function(model) {
    // Make this new model the most recently used: the head
    model.SetNext(this.head);
    if (this.head) {
        this.head.SetPrevious(model);
    }
    else {
        // No head: list is empty-->make tail the same element
        this.tail = model;
    }
    model.SetPrevious(null);
    this.head = model;    
};

// Mark the model index tracker as having a used slot
oj.Collection.prototype._setModelIndex = function(index) {
    if (this._modelIndices.indexOf(index) === -1) {
        this._modelIndices.push(index);
    }
}

oj.Collection.prototype._verifyIndices = function() {
    var models = this._getModels();
    var count = 0;
    for (var i = 0; i < models.length; i++) {
        if (models[i]) {
            count++;
            var found = this._modelIndices.indexOf(i);
            if (found === -1) {
                console.log("ERROR: Could not find:" + i);
            }
        }
    }
    if (count !== this._modelIndices.length) {
        console.log("ERROR: Model index count is wrong");
    }
    console.log("all ok");
}
    
// Insert the given model at the given index
oj.Collection.prototype._insertModelIndex = function(start) {
    // Up all the indices of models with index greater than start
    for (var i = 0; i < this._modelIndices.length; i++) {
        if (this._modelIndices[i] >= start) {
            this._modelIndices[i]++;
        }
    }
    // Now add the new one
    this._modelIndices.push(start);
}

// Splice out the given model index
oj.Collection.prototype._spliceModelIndices = function(start, end) {
    if (end === undefined) {
        end = start;
    }
    this._clearModelIndices(start, end);
    
    var count = end-start+1;
    // Reduce the indexes of any models above the endpoint by the number of models removed
    for (var i = 0; i < this._modelIndices.length; i++) {
        if (this._modelIndices[i] > end) {
            this._modelIndices[i] -= count;
        }
    }
}
    
// Clear the given model index
oj.Collection.prototype._clearModelIndices = function(start, end) {
    if (end === undefined) {
        end = start;
    }
    // Knock out any of the deleted model's indexes from the list
    for (var i = start; i <= end; i++) {
        var idx = this._modelIndices.indexOf(start);
        if (idx > -1) {
            this._modelIndices.splice(idx, 1);
        }
    }
}
    
oj.Collection.prototype._setModel = function(index, model) {
    var oldModel = this._getModel(index);
    this._removePrevNext(oldModel);
    if (!oldModel) {
        // Newly "inserted" model
        this.lruCount++;
    }
    this._setChangeAt(index, 1);
    this._getModels()[index] = model;
    if (model) {
        this._setModelIndex(index);
        model.SetIndex(index);
        this._makeModelHead(model);
    }
};

// Clean off n models from tail (oldest) of prev/next list
oj.Collection.prototype._clearOutModels = function(n) {
    var current = this.tail, index, model;
    var i = 0;
    this.tail = null;
    while (current && i < n) {
        // Erase this model from collection, iff it hasn't changed
        index = current.GetIndex();
        model = this._getModel(index);
        if (!(model && model.hasChanged())) {
            this.lruCount--;
            if (index > -1) {                
                //this._getModels()[index] = undefined;
                this._setModel(index, undefined);
                this._clearModelIndices(index, index);
            }

            // Clear its pointers
            current.SetNext(null);
            current = current.SetPrevious(null);
            i++;
        }
        else {
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


// Reset the LRU list
oj.Collection.prototype._resetLRU = function() {
    this.lruCount = 0;
    this.head = null;
    this.tail = null;
};

// Make sure we have room in the LRU
oj.Collection.prototype._manageLRU = function(incoming) {
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
 * 
 * @return {Object} copy of the Collection
 */
oj.Collection.prototype.clone = function() {
    return this._cloneInternal(true);
};

oj.Collection.prototype._cloneInternal = function(withProperties) {
    var c = new this.constructor(), i;

    // Only copy locally if virtual
    var model;
    if (this.IsVirtual()) {
        c = this._copyFetchProperties(c);
        c._resetModelsToFullLength();
    }
        
    c = this._copyProperties(c);
    if (withProperties) {
        // Try to copy models only if told to--we may only need the shell of the collection with properties
        // Make a copy of the model indices (it will be modified by this process)
        var indices = [];
        for (i = 0; i < this._modelIndices.length; i++) {
            indices.push(this._modelIndices[i]);
        }
        // Sort them in reverse order so we eliminate the higher indexes first so as not to disrupt the position of the earlier ones
        indices.sort(function(a,b) {
            return a-b;
        });
        
        var index;
        for (i = 0; i < indices.length; i++) {
            index = indices[i];
            model = this._atInternal(index, null, true, false);
            if (model) {
                c._addInternal(model.clone(), {'at':index}, true, false);
            }
        }
    }
    return c;
};

// Copy critical properties in clone
oj.Collection.prototype._copyProperties = function(collection) {
    var props = ['comparator', 'model', 'modelId'], prop, i;
    for (i = 0; i < props.length; i++) {
        prop = props[i];
        collection[prop] = this[prop];
    }
    return collection;
};

// Copy critical fetch properties in clone
oj.Collection.prototype._copyFetchProperties = function(collection) {
    var props = ['totalResults', 'hasMore', oj.Collection._FETCH_SIZE_PROP], prop, i;
    for (i = 0; i < props.length; i++) {
        prop = props[i];
        collection[prop] = this[prop];
    }
    return collection;
};

oj.Collection.prototype._getLength = function() {
    return this['length'];
};

oj.Collection.prototype._setLength = function()
{
    var modelsLen = this._getModelsLength();
    this['length'] = modelsLen;    
    if (!this.IsVirtual()) {
        this['totalResults'] = modelsLen;
    }
};

/**
 * Create a model instance using the model property if set
 * @param {Object} collection
 * @param {Object=} attrs
 * @param {Object=} options
 * @returns {null||Object}
 * @private
 */
oj.Collection._createModel = function(collection, attrs, options) {
    if (collection['model']) {    
        return $.isFunction(collection['model']) ? new collection['model'](attrs, options) : new collection['model'].constructor(attrs, options);
    }
    return null;
};

oj.Collection.prototype._newModel = function(m, parse, options, ignoreDefaults) {
    var newModel = null, validationValue;
    var opt = options || {};
    
//    opt.noparse = !parse;  
    opt.ignoreDefaults = ignoreDefaults;

    if (m instanceof oj.Model) {
        newModel = m;
    }
    else {
        if (this['model']) {
            // model is defined
            newModel = oj.Collection._createModel(this, m, opt);
        }
        else {
            // Set this collection on the model
            opt['collection'] = this;
            newModel = new oj.Model(m, opt);
        }
    }    
    // Validate
    if (opt['validate'] && newModel['validate']) {
        validationValue = newModel['validate'](newModel.attributes);
        if (validationValue) {
            opt['validationError'] = validationValue;
            this.TriggerInternal(false, oj.Events.EventType['INVALID'], newModel, validationValue, opt);
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
 * <b>alladded</b>: fired after all models have been added, passing the collection, array of models added, and options<br>
 * </ul>
 * <p>
 * Note that for virtual collections, if a new model is added after being saved up to the server, no add event will be fired as the 
 * collection will already "see" the model as existing.  Note that a warning will be logged if this add is not a force, not merging, and duplicate IDs are found.
 * @param {Object|Array} m Model object (or array of models) to add. These can be already-created instance of the oj.Model object, or sets of attribute/values, which will be wrapped by add() using the collection's model.
 * @param {Object=} options <b>silent</b>: if set, do not fire events<br>
 *                          <b>at</b>: splice the new model into the collection at the value given (at:index)<br>
 *                          <b>merge</b>: if set, and if the given model already exists in the collection (matched by [id]{@link oj.Model#id}), then merge the attribute/value sets, firing change events<br>
 *                          <b>sort</b>: if set, do not re-sort the collection even if the comparator is set.<br>
 *                          <b>force</b>: if set to true, do an add to the collection no matter whether the item is found or not<br>
 *                          <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not<br>
 * 
 * @returns {Promise|Array} The model or models added to the collection (or found/merged if appropriate).  If deferred or virtual, return the model or models added in a promise when the set has completed
 * @export
 */
oj.Collection.prototype.add = function(m, options) {    
    this._manageLRU(1);
    var opt = options || {};
    return this._handlePromise(this._addInternal(m, options, false, opt['deferred']));
};

// fillIn: true indicates that we're just trying to use add() after a fetch to 
// insert into a preallocated list of models, not truly do an add/merge from the API
oj.Collection.prototype._addInternal = function(m, options, fillIn, deferred) {
    // Get options
    options = options || {};
    var modelArray = [], 
        at = options['at'],
        silent = options['silent'],
        force = options['force'],
        i, index, cid,
        merge = options['merge'] || false,
        sort = options['sort'], needSort = true, added = false, addedModels = [],
        modelReturnList = [];

    if (at !== undefined && at < 0) {
        // Normalize it using the length-- another BackboneJS test case
        at += this._getLength() + 1;
    }

    if (m instanceof Array) {
        modelArray = m;
    }
    else {
        modelArray.push(m);
    }
    
    function addToCollection(collection, newModel) {
        if (at === undefined) {
            collection._pushModels(newModel);
            index = collection._getModelsLength()-1;
            collection._getModel(index).SetCid();
        }
        else {
            index = at;
            if (collection.IsVirtual() && fillIn) {
                // Array has been preallocated in this case
                collection._setModel(index, newModel);
            }                        
            else {
                collection._spliceModels(index, 0, newModel);
            }
            collection._getModel(index).SetCid();
            // Increment at so that later models will be added right after their predecessors, if an array is passed in
            at = at + 1;
        }
        if (newModel.GetCollection() === undefined) {
            newModel.SetCollection(collection);
        }
        collection._setLength();
        collection._listenToModel(newModel);
        added = true;
    }

    function resortAndFireEvents(collection, existingModel, modelFoundInCollection, newModel, deferred) {
        // Now resort if required (don't resort if either told not to, or if 'at' option is set) and if there's more than one model
        if (fillIn) {
            options = options || {};
            options['fillIn'] = true;
        }
        if (needSort && existingModel === undefined && !sort && at === undefined && collection._getLength() > 1) {
            if (index > -1) {
                cid = collection._getModel(index)['cid'];
            }
            var sortOpt = {};
            oj.CollectionUtils.copyInto(sortOpt, options);            
            sortOpt['add'] = true;
            collection.sort(sortOpt);
            // Reset index--can't get it back if virtual--set to -1
            if (index > -1) {
                if (collection.IsVirtual()) {
                    index = -1;
                }
                else {
                    index = collection.indexOf(collection.getByCid(cid), deferred);
                }
            }
        }

        if (added) {
            // Pass index property in options, if at is specified
            if (options['at']) {
                options['index'] = index;
            }
            if (newModel) {
                newModel.TriggerInternal(silent, oj.Events.EventType['ADD'], newModel, collection, options);
                addedModels.push(newModel);
            }
            else {
                modelFoundInCollection.TriggerInternal(silent, oj.Events.EventType['ADD'], modelFoundInCollection, collection, options);
                addedModels.push(modelFoundInCollection);
            }
        }    
    }
    
    function mergeAttrs(collection, modelToTryAndMerge, modelFoundInCollection, newModel, deferred) {
        var existingModel, modelAdded = null;
        
        if (!force && merge && modelFoundInCollection) {
            // Try to merge the attributes--we're merging and the model (by id) was already in the collection
            needSort = modelFoundInCollection.Merge(modelToTryAndMerge, collection['comparator'], silent);
            modelAdded = modelFoundInCollection;
        }
        else {
            // Make sure model is not already in there
            if (!force) {
                existingModel = collection._getLocal(newModel);
                if (existingModel && fillIn && at !== existingModel.index) {
                    // We're filling in a virtual collection: we should *not* be finding the new model already in the collection
                    // if we're not merging and not forcing: this indicates duplicate ids
                    //throw new Error("Duplicate IDs fetched or added without merging");
                    oj.Logger.warn("Duplicate ID fetched or added without merging, the id = " + existingModel.GetId());
                }
            }

            if (existingModel === undefined) {
                addToCollection(collection, newModel);
                modelAdded = newModel;
            }
            else {
                modelAdded = existingModel;
            }
        }        

        resortAndFireEvents(collection, existingModel, modelFoundInCollection, newModel, deferred);
        
        return modelAdded;
    }

    function doAdd(collection, model, deferred) {
        added = false;
        var newModel = collection._newModel(model, true, options, false), modelToTryAndMerge = null, modelFoundInCollection = null;
        if (newModel != null) {
            index = -1;
            // Make sure ID is up to date
            newModel.SetupId();

            // Use original model array not cloned model if merging--otherwise we won't find the model in the collection
            modelToTryAndMerge = model instanceof oj.Model ? model : newModel;
            if (deferred) {
                if (force) {
                    return new Promise(function(resolve, reject) {
                        var model = mergeAttrs(collection, modelToTryAndMerge, undefined, newModel, deferred);
                        modelReturnList.push(model);
                        resolve(model);
                    });
                }
                return collection._getInternal(modelToTryAndMerge, {'silent':true}, deferred, true).then(function (modInfo) {
                                                                    modelFoundInCollection = modInfo['m'];
                                                                    var mod = mergeAttrs(collection, modelToTryAndMerge, modelFoundInCollection, newModel, deferred);
                                                                    modelReturnList.push(mod);
                                                                 });
            }
            if (!force && merge) {
                // Grab the actual model we want to merge from the collection, if the caller has indicated that we aren't
                // forcing an add and we want to merge
                modelFoundInCollection = fillIn ? collection._getLocal(modelToTryAndMerge) : collection.get(modelToTryAndMerge);
            }
            var modelAdded = mergeAttrs(collection, modelToTryAndMerge, modelFoundInCollection, newModel, deferred);
            if (modelAdded) {
                modelReturnList.push(modelAdded);
            }
        }
        else {
            // Add boolean falses for invalid models
            modelReturnList.push(false);
        }
    }
    
    function _parse(collection, array) {
        // Must stop parsing if coming in from reset or constructor
        if (collection.parse && options['parse'] && !options.noparse) {
            return collection['parse'](array);
        }
        return array;
    }
    
    if (!fillIn && (this.IsVirtual() || deferred)) {
        var self = this;
        return new Promise(function(allResolve, allReject) {
            var doTask = function(index) {
                            return new Promise(function(resolve, reject) {
                                doAdd(self, modelArray[index], true).then(function() {
                                    resolve(index+1);
                                }, reject);
                            });
            };

            var currentStep = Promise.resolve(0);

            modelArray = _parse(self, modelArray);
            for (i = 0; i < modelArray.length; i++) {
                currentStep = currentStep.then(doTask);
            }
            currentStep.then(function() {
                if (addedModels.length > 0) {
                    self.TriggerInternal(options['silent'], oj.Events.EventType['ALLADDED'], self, addedModels, options);
                }
                allResolve(oj.Collection._returnModels(modelReturnList));
            }, allReject);
        });
    }
    
    modelArray = _parse(this, modelArray);
    for (i = 0; i < modelArray.length; i++) {
        doAdd(this, modelArray[i], false);
    }
    if (addedModels.length > 0) {
        this.TriggerInternal(options['silent'], oj.Events.EventType['ALLADDED'], this, addedModels, options);
    }
    return oj.Collection._returnModels(modelReturnList);
};

oj.Collection._returnModels = function(modelReturnList) {
    if (modelReturnList.length === 1) {
        return modelReturnList[0];
    }
    return modelReturnList;    
};
    
oj.Collection.prototype._hasComparator = function() {
    return oj.Collection._defined(this['comparator']);
};

/**
 * Sort the models in the collection.  For virtual collections, any locally stored models are cleaned out in preparation for new fetches sending server-sorted models down to the client.  No fetch is automatically performed.<p>
 * For non-virtual collections, the models are sorted based on the comparator property.<p>
 * See [comparator}{@link oj.Collection#comparator}<p>
 * For virtual collections, all sorting must be handled by the server.  If the string (attribute) comparator and sortDirection are set, then this information
 * will be passed back via URL parameters, or passed to the customURL callback for application-construction of the appropriate URL.  Function-based custom comparators are ignored in virtual collections.
 * Events:<p>
 * Fires a sort event, passing the collection and options<p>
 * @param {Object=} options <b>silent</b>: if true, do not fire the sort event<br>
 * <b>startIndex</b>: if provided, and if collection is virtual, do a fetch of startIndex+fetchSize immediately after the sort and return a promise.  See [comparator}{@link oj.Collection#setRangeLocal}<p>
 * @return {Promise|null} if virtual and if startIndex is provided in options, a promise Object that resolves upon completion.  The promise will be passed an Object containing start and count properties that represent
 * the *actual* starting position (start), count (count), and array (models) of the Models fetched, which may be fewer than what was requested.  The promise will be rejected on
 * an error and will pass the ajax status, xhr object, error, and collection, if relevant.
 * 
 * @export
 */
oj.Collection.prototype.sort = function(options) {
    options = options || {};
    var silent = options['silent'], comparator = this['comparator'], self;
    
    // Check for comparator
    if (!this._hasComparator()) {
        return null;
    }
    
    // This is a no-op in case of virtualization: we should just clear things out so that
    // any elements will be refetched
    if (this.IsVirtual()) {        
        var totalResults =  this['totalResults'];
        if (this._hasTotalResults()) {
            // Make sure to set up the array if the length changes (i.e., from 0 to totalResults--need to preallocate)
            this._setModels(new Array(totalResults), true);
        }
        else {
            // No totalresults
            this._setModels([], true);
            this._resetLRU();
            this._setLength();
        }
        var eventOpts = options['add'] ? {'add':true} : null;
        this.TriggerInternal(silent, oj.Events.EventType['SORT'], this, eventOpts, null);
        var startIndex = options['startIndex'];
        if (startIndex !== undefined && startIndex !== null) {
            return this.setRangeLocal(startIndex, this._getFetchSize(options));
        }
        return null;
    }
    
    self = this;
    this._getModels().sort(function(a, b) {
                            return oj.Collection.SortFunc(a, b, comparator, self, self);
                        });
    this._realignModelIndices(0);
    // Indicate this sort is due to an add
    var eventOpts = options['add'] ? {'add':true} : null;
    this.TriggerInternal(silent, oj.Events.EventType['SORT'], this, eventOpts, null);
    return null;
};

oj.Collection._getKey = function(val, attr) {
    if (val instanceof oj.Model) {
        return val.get(attr);
    }
    return oj.Model.GetPropValue(val, attr);
};

oj.Collection.SortFunc = function(a, b, comparator, collection, self) {
    var keyA, keyB, i, retVal;
    
    if ($.isFunction(comparator)) {        
        // How many args?
        if (comparator.length === 1) {
            // "sortBy" comparator option
            keyA = comparator.call(self, a);
            keyB = comparator.call(self, b);
            var attrs1 = oj.StringUtils.isString(keyA) ? keyA.split(",") : [keyA];
            var attrs2 = oj.StringUtils.isString(keyB) ? keyB.split(",") : [keyB];
            for (i = 0; i < attrs1.length; i++) {                
                retVal = oj.Collection._compareKeys(attrs1[i], attrs2[i], collection['sortDirection']);
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
        var attrs = comparator.split(",");
        
        for (i = 0; i < attrs.length; i++) {
            keyA = oj.Collection._getKey(a, attrs[i]);
            keyB = oj.Collection._getKey(b, attrs[i]);
            retVal = oj.Collection._compareKeys(keyA, keyB, collection['sortDirection']);            
            if (retVal !== 0) {
                return retVal;
            }
        }
    }
    return 0;    
};

/**
 * Return the index at which the given model would be inserted, using the collection comparator See [sort}{@link oj.Collection#sort}.  Not supported for virtual collections.
 * 
 * @param {Object} model model for which to determine the insert point
 * @param {String|Object=} comparator optional comparator to override the default
 * @returns {number} index at which model would be inserted.  -1 if no comparator
 * @throws {Error} when called on a virtual collection
 * @export
 */
oj.Collection.prototype.sortedIndex = function(model, comparator) {
    var comp = comparator ? comparator : this['comparator'], self, test;
    
    // Check for comparator
    if (!comp) {
        return -1;
    }
    
    this._throwErrIfVirtual("sortedIndex");
    
    self = this;
    test = function(a, b) {
            var keyA, keyB;

            if ($.isFunction(comp)) {        
                // How many args?
                if (comp.length === 1) {
                    // "sortBy" comparator option
                    keyA = comp.call(self, a);
                    keyB = comp.call(self, b);
                    var attrs1 = oj.StringUtils.isString(keyA) ? keyA.split(",") : [keyA];
                    var attrs2 = oj.StringUtils.isString(keyB) ? keyB.split(",") : [keyB];
                    var retVal, i;
                    for (i = 0; i < attrs1.length; i++) {                
                        retVal = oj.Collection._compareKeys(attrs1[i], attrs2[i], self['sortDirection']);
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
                return oj.Collection._compareKeys(keyA, keyB, self['sortDirection']);            
            }
            return 0;
        };
    return oj.Collection._find(this._getModels(), model, test);
};


// Binary search and return the index at which model would be inserted into sorted modelArray
oj.Collection._find = function(modelArray, model, comparator) {
    function search(min, max) {
        var cid, id, mid;
        
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
        
        mid = Math.floor((max+min)/2);
        if (comparator(modelArray[mid], model) === -1) {
            return search(min+1, mid);
        }
        if (comparator(modelArray[mid], model) === 1) {
            return search(mid, max-1);
        }
        return mid;
    }
    
    return search(0, modelArray.length-1);
};

oj.Collection._compareKeys = function(keyA, keyB, sortDirection) {
    if (sortDirection === -1) {
        if (keyA < keyB) {        
            return 1;
        }
        if (keyB < keyA) {
            return -1;
        }
    }
    else {
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
 * For events that may be fired, see [add]{@link oj.Collection#add}.<br>
 * @param {Object} m model to add to the beginning of the collection
 * @param {Object=} options See [add]{@link oj.Collection#add}
 * @return {Promise} If this is a virtual collection, this will return a promise that will be resolved when the
 *                  operation is done.  Otherwise undefined
 * @export
 */
oj.Collection.prototype.unshift = function(m, options) {
    // Like an add but set 'at' to zero if not specified
    var opt = {};
    oj.CollectionUtils.copyInto(opt, options || {});
    if (!opt['at']) {
        opt['at'] = 0;
    }
    this._manageLRU(1);
    return this._handlePromise(this._addInternal(m, opt, false, opt['deferred']));
};

oj.Collection.prototype._handlePromise = function(result) {
    if ($.isFunction(result.then)) {
        return this._addPromise(function() {
            return result;
        });
    }
    return result;
};

/**
 * Remove the first model from the collection and return it.<br>
 * For events that may be fired, see [remove]{@link oj.Collection#remove}.<br>
 * @param {Object=} options same as remove, plus: <br>
 *                          <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not
 * @return {Promise} model that was removed.  If this is a virtual collection, this will return a promise
 *                  which will resolve passing the model value that was removed
 * @export
 */
oj.Collection.prototype.shift = function(options) {
    options = options || {};
    var deferred = this._getDeferred(options);
    var retVal;
    if (this.IsVirtual() || deferred) {
        var self = this;
        return this.at(0, options).then(function (model) {             
            retVal = self._removeInternal(model, 0, options);
            self.TriggerInternal(options['silent'], oj.Events.EventType['ALLREMOVED'], self, [retVal], options);

            return retVal;
        });
    }
    retVal = this._removeInternal(this.at(0), 0, options);
    this.TriggerInternal(options['silent'], oj.Events.EventType['ALLREMOVED'], this, [retVal], options);
    return retVal;
};

/**
 * @export
 * @desc Return an array of models found in the Collection, excepting the last n.
 * @param {number=} n number of models to leave off the returned array; defaults to 1
 * @return {Array} array of models from 0 to the length of the collection - n - 1
 * @throws {Error} when called on a virtual collection 
 */
oj.Collection.prototype.initial = function(n) {    
    if (n === undefined) {
        n = 1;
    }
    
    this._throwErrIfVirtual("initial");
    
    var array = [], i;
    for (i = 0; i < this._getLength() - n; i=i+1) {
        array.push(this.at(i));
    }
    return array;
};

oj.Collection.prototype._getDeferred = function(options) {
   var opt = options || {};
   return opt['deferred'];
};

/**
 * Return the last model in the collection.  If n is passed in, then the last n models are returned as an array
 * Note that if the collection is virtual, and totalResults is not returned by the server, the results returned by last can be
 * difficult to predict.  They depend on the fetch sizes, last known offset of a fetch, etc.  If code is using a server that does not return
 * totalResults the use of last is not recommended.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * @param {number=} n number of models to return.  Defaults to 1
 * @param {Object=} options <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not
 * @return {Promise|Object|null} array of n models from the end of the Collection.  If this is a virtual collection,
 *                             this will return a promise which will resolve passing the array or single model
 * @export
 */
oj.Collection.prototype.last = function(n, options) {
    var deferred = this._getDeferred(options);
    if (n === undefined) {
        n = 1;
    }
    
    if (n === 1) {
        var len = this._getModelsLength();
        if (len === 0) {
            len = n;
        }
        if (len > 0) {
            return this.at(len-1, deferred);
        }
        return null;
    }
    
    var array = [], i;
    var len = this._getLength();    
    if (deferred || this.IsVirtual()) {
        // Loop using deferred
        var start = len-n;        
        
        // Handle edge or no totalResults cases
        if (start < 0) {
            start = 0;
        }
        if (len === 0) {
            // No totalresults, probably
            len = n;
        }
        
        var self = this;
        return this._addPromise(function() {
            return self.IterativeAt(start, len);
        });
    }
                    
    for (i = len - n; i < len; i=i+1) {
        array.push(this.at(i));
    }
    return array;
};

// Loop calling at() in a deferred way and return a promise to be resolved when all the elements are sequentially fetched
oj.Collection.prototype.IterativeAt = function (start, end) {
    var array = [], i;
    var self = this;
    return new Promise(function(allResolve, allReject) {
        var doTask = function(index) {
                        return new Promise(function(resolve, reject) {
                            self._deferredAt(index, null).then(function(model) {
                                array.push(model);
                                resolve(index+1);
                            }, reject);
                        });
        };

        var currentStep = Promise.resolve(start);
        for (i = start; i < end; i++) {
            currentStep = currentStep.then(doTask);
        }
        currentStep.then(function() {
                            allResolve(array);
                        }, allReject);
    });
};

oj.Collection.prototype._getDefaultFetchSize = function(n) {
    if (n === undefined || n === null) {
        return this[oj.Collection._FETCH_SIZE_PROP];
    }
    else {
        return n;
    }
};

oj.Collection.prototype._calculateNextStart = function() {
    var lastFetch = this['lastFetchCount'];
    if (lastFetch === undefined || lastFetch === null) {
        lastFetch = this[oj.Collection._FETCH_SIZE_PROP];
    }
    if (this['offset'] === undefined || this['offset'] === null) {
        // Assume zero offset (0+lastFetch)
        return lastFetch;
    }
    return this['offset'] + lastFetch;   
};

/**
 * Fetch the next set of models from the server.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * 
 * @param {number} n number of models to fetch.  If undefined or null, the collection will attempt to use the overall [fetchSize]{@link oj.Collection#fetchSize} property value
 * @param {Object=} options Options to control next<p>
 *                  <b>success</b>: a user callback called when the fetch has completed successfully. This makes the fetch an asynchronous process. The callback is called passing the Collection object, raw response, and the options argument.<br>
 *                  <b>error</b>: a user callback function called if the fetch fails. The callback is called passing the collection object, xhr, and options arguments.<br>
 * @return {Object} xhr ajax object, by default.  null if nothing to fetch (the success callback will still be called).  Note if [sync]{@link oj.Collection#sync} has been replaced, this would be the value returned by the custom implementation.
 * @export
 */
oj.Collection.prototype.next = function(n, options) {
    options = options || {};
    options[oj.Collection._FETCH_SIZE_PROP] = this._getDefaultFetchSize(n);
    
    var start = this._calculateNextStart();
    var length = this._getLength();
    if (length === 0 && options[oj.Collection._FETCH_SIZE_PROP] > 0) {
        // If we have a fetch size and we have no length let next() do a fetchSize fetch starting at zero to kick things off
        start = 0;
    } else if (start >= length) {
        // No op -- still call success because the items are already fetched.  
        var self = this;
        if (options['success']) {
            options['success'].call(oj.Model.GetContext(options, self), self, null, options);
        }
        
        return null;
    }
    options['startIndex'] = start;
    return this.fetch(options);
};

oj.Collection.prototype._calculatePrevStart = function(n) {
    if (this['offset'] === undefined || this['offset'] === null) {
        // Assume zero: we can't back up beyond that so if the offset wasn't set there's nothing to do
        return 0;
    }
    return this['offset'] - n;
};

/**
 * @export
 * Fetch the previous set of models from the server.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * @param {number} n number of models to fetch.  If undefined or null, the collection will attempt to use the overall fetchSize property value
 * @param {Object=} options Options to control previous<p>
 *                  <b>success</b>: a user callback called when the fetch has completed successfully. This makes the fetch an asynchronous process. The callback is called passing the Collection object, raw response, and the options argument.<p>
 *                  <b>error</b>: a user callback function called if the fetch fails. The callback is called passing the collection object, xhr, and options arguments.<p>
 * @return {Object} xhr ajax object, by default. null if there is nothing earlier to fetch (no fetch has happened or the last fetch started at 0).  The success callback will still be called.  Note if [sync]{@link oj.Collection#sync} has been replaced, this would be the value returned by the custom implementation.
 */
oj.Collection.prototype.previous = function(n, options) {
    options = options || {};
    if (this['offset'] === 0) {
        // No op -- still call success (if we've fetched before--lastFetchCount is other than zero) because the items are already fetched.  
        var self = this;
        if (options['success'] && this['lastFetchCount']) {
            options['success'].call(oj.Model.GetContext(options, self), self, null, options);
        }
        
        return null;
    }
    options[oj.Collection._FETCH_SIZE_PROP] = this._getDefaultFetchSize(n);
    var start = this._calculatePrevStart(options[oj.Collection._FETCH_SIZE_PROP]);
    if (start < 0) {
        // Only fetch from 0 to the last fetch's starting point...
        options[oj.Collection._FETCH_SIZE_PROP] = this['offset'];
        start = 0;
    }
    options['startIndex'] = start;
    return this.fetch(options);
};


/**
 * Set or change the number of models held at any one time
 * 
 * @param {number} n maximum number of models to keep at a time
 * @export
 */
oj.Collection.prototype.setModelLimit = function(n) {
    this['modelLimit'] = n;
    // Clean out down to the new limit, if necessary
    this._manageLRU(0);
};

oj.Collection.prototype._getModelLimit = function() {
    return this['modelLimit'];
};

/**
 * Set or change the number of models to fetch with each server request
 * 
 * @param {number} n number of models to fetch with each request
 * @export
 */
oj.Collection.prototype.setFetchSize = function(n) {
    this[oj.Collection._FETCH_SIZE_PROP] = n;
};



/**
 * Return the array of models found in the Collection starting with index n.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * @param {number=} n index at which to start the returned array of models.  Defaults to 1.
 * @param {Object=} options <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not
 * @return {Array|Promise} array of models from the collection.  If this is a virtual collection, or
 *                  if deferred is passed as true, return a promise which resovles passing the array of models.
 * @export
 */
oj.Collection.prototype.rest = function(n, options) {    
    var deferred = this._getDeferred(options);
    if (n === undefined) {
        n = 1;
    }
    
    var array = [], i;
    // TODO
    if (this.IsVirtual() || deferred) {
        var self = this;
        return this._addPromise(function() {        
            return self.IterativeAt(n, self._getLength());
        });
    }
    
    for (i = n; i < this._getLength(); i=i+1) {
        array.push(this.at(i));
    }
    return array;
};

/**
 * Remove a model from the collection, if found.<br>
 * Events:<p>
 * <ul>
 * <b>remove</b>: fired for each model removed, passing the model removed, collection, and options<br>
 * <b>allremoved</b>: fired after all models have been removed, passing the collection, array of models removed, and options<br>
 * </ul>
 * <p>
 * @param {Object|Array} m model object or array of models to remove. 
 * @param {Object=} options <b>silent</b>: if set, do not fire events 
 * @return {Array|Object} an array of models or single model removed
 * @export
 */
oj.Collection.prototype.remove = function(m, options)
{
    options = options || {};
    var modArray = [], mod;
    
    if (m instanceof Array) {
        modArray = m;
    }
    else {
        modArray.push(m);
    }
    
    var modsRemoved = [], model;
    for (mod = modArray.length-1; mod >= 0; mod=mod-1) {
        // Done to keep array in order matching one passed in--we do removal in reverse
        modsRemoved.unshift(this._removeInternal(modArray[mod], -1, options));
    }
    this.TriggerInternal(options['silent'], oj.Events.EventType['ALLREMOVED'], this, modArray, options);
    return oj.Collection._returnModels(modsRemoved);
};

oj.Collection.prototype._removeInternal = function(model, index, options) {
    options = options || {};
    var modInfo = index == -1 ? this._getInternal(model) : oj.Collection._getModinfo(index, model), 
        silent = options['silent'];
    
    index = modInfo.index;
    if (index > -1) {
        var mod = modInfo['m'];
        // only unset the collection setting if it's mine
        if (mod !== undefined && mod.GetCollection() === this) {
            mod.SetCollection(null);
        }
        this._spliceModels(index, 1);
        this._setLength();
        //if (!silent) {
            var opt = {};
            oj.CollectionUtils.copyInto(opt, options);
            opt['index'] = index;
            if (mod !== undefined) {
                mod.TriggerInternal(silent, oj.Events.EventType['REMOVE'], mod, this, opt);
            }
      //  }
        // Unlisten after event fired
        this._unlistenToModel(mod);        
    }
    return modInfo['m'];
};


oj.Collection.prototype._unlistenToModel = function(m) {
    if (m !== undefined) {
        m.off(null, null, this);
    }
};

oj.Collection.prototype._listenToModel = function(m) {
    m.OnInternal(oj.Events.EventType['ALL'], this._modelEvent, this, false, true);
};

// Handle model destroyed events via the all listener
oj.Collection.prototype._modelEvent = function(event, model, collection, options) {
    var args;
    
    if (event === oj.Events.EventType['DESTROY']) {
        this.remove(model);
    }
    
    // Don't process general events if we're not the target
    if (collection !== undefined && collection instanceof oj.Collection && collection !== this) {
        return;
    }

    // Throw up to the collection
    args = Array.prototype.slice.call(arguments);
    var silent = options && options['silent'];
    this.TriggerInternal(silent, event, model, collection, options);
};

/**
 * Clear all data from the collection and refetch (if non-virtual).  If virtual, clear all data.
 * If fetch() cannot be called (e.g., there is no URL) then the caller must reload the collection wtih data.  
 * The existing data is still cleared.
 * Events (if silent is not set):<p>
 * <ul>
 * <b>refresh</b>: fired passing the collection and options<br>
 * For more events that may be fired if the collection is not virtual, see [fetch]{@link oj.Collection#fetch}.
 * </ul>
 * <p>
 * @param {Object=} options user options<p>
 *                          <b>silent</b>: if set, do not fire a refresh event<p>
 * <b>startIndex</b>: if provided, and if collection is virtual, do a fetch of startIndex+fetchSize immediately after the refresh and return a promise.  See [comparator}{@link oj.Collection#setRangeLocal}<p>
 * @return {Promise} promise object resolved when complete (in case there is a fetch for non-virtual mode).  If startIndex is provided as an option, the returned promise resolution is the same as setRangeLocal.
 * @export
 */
oj.Collection.prototype.refresh = function(options)
{
    options = options || {};
    
    var self = this;
    return this._addPromise(function() {
        return new Promise(function(resolve, reject) {
            if (!self.IsVirtual()) {
                var silent = options['silent'] !== undefined && options['silent'];
                try {
                    // Do a reset, with silent
                    self.reset(null, {'silent':true});
                    // Local: do a fetch to fill back up
                    // In case options are passed to refresh-->fetch
                    var opt = {};
                    for (var prop in options) {
                        if (options.hasOwnProperty(prop)) {
                            opt[prop] = options[prop];
                        }
                    }
                    opt['success'] = function (collection, response, options) {
                                    self.TriggerInternal(silent, oj.Events.EventType['REFRESH'], self, options, null);
                                    resolve({'collection':collection, 'response':response, 'options':options});                                    
                                };
                    opt['error'] = function (xhr, status, error) {
                                    reject(oj.Collection._createRejectionError(xhr, status, error, self, options));
                                };
                    self.fetch(opt);
                    return;        
                }
                catch (e) {
                    // This is OK if it's a URLError: just fire the event: local collection without custom sync
                    if (e instanceof oj.URLError) {
                        // if it's a completely local collection, it's a no-op other than the event
                        self.TriggerInternal(silent, oj.Events.EventType['REFRESH'], self, options, null);
                        resolve({'collection':self, 'options':options});
                        return;
                    }
                    throw e;
                }
            }
            // Virtual
            //var totalResults =  self['totalResults'];
            var startIndex = options['startIndex'];
    /*        if (oj.Collection._defined(totalResults)) {
                self._setModels(new Array(totalResults), true);
                self._resetLRU();
            }*/
            self._setModels([], true);
            self._resetLRU();

            // Clear totalresults.
            self['totalResults'] = undefined;
            self._setLength();

            var silent = options['silent'] !== undefined && options['silent'];
            self.TriggerInternal(silent, oj.Events.EventType['REFRESH'], self, options, null);
            if (startIndex === undefined || startIndex === null) {
                startIndex = 0;
            }
            if (startIndex !== undefined && startIndex !== null) {
                // Do a set range local
                self._setRangeLocalInternal(startIndex, self._getFetchSize(options)).then(function(actual) {
                    resolve(actual);
                }, function(err) {
                    reject(err);
                });            
            }
            else {
                resolve(undefined);
            }
        });
    });
};

/**
 * Remove and replace the collection's entire list of models with a new set of models, if provided. Otherwise, empty the collection.  totalResults is reset when no new data is passed in, set to the new length in the non-virtual case if data is passed in, and left as was in the virtual case if data is passed in.<br>
 * Events (if silent is not set):<p>
 * <ul>
 * <b>reset</b>: fired passing the collection and options.  The new length of the collection should be in effect when the event is fired<br>
 * For events that may be fired if data is passed in, see [add]{@link oj.Collection#add}.
 * </ul>
 * <p>
 * @param {Object=} data Array of model objects or attribute/value pair objects with which to replace the collection's data. 
 * @param {Object=} options user options, passed to event, unless silent<br>
 *                          <b>silent</b>: if set, do not fire events<p>
 * @returns {Object|Array} The model or models added to the collection, if passed in
 * @export
 */
oj.Collection.prototype.reset = function(data, options)
{
    var opts = {};
    oj.CollectionUtils.copyInto(opts, options || {});
    
    opts['previousModels'] = this._getModels();

    var index, model;
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

    var silent = opts['silent'] !== undefined && opts['silent'];
    if (!data) {
        // Clear totalresults.  If not virtual, _setLength will reset it to the length
        this['totalResults'] = undefined;
        this._setLength();
        this.TriggerInternal(silent, oj.Events.EventType['RESET'], this, opts, null);
        return null;
    }
    
    var retObj = null;
    // Parse collection
    if (opts['parse']) {
        data = this['parse'](data);
    }

    this._manageLRU((data instanceof Array) ? data.length : 1);
    opts.noparse = true;
    retObj = this._addInternal(data, opts, true, false);
    this._setLength();
    this.TriggerInternal(silent, oj.Events.EventType['RESET'], this, opts, null);
    
    return this._handlePromise(retObj);
};

/**
 * Return the model object found at the given index of the collection, or a promise object that will pass the model as an argument when it resolves.<p>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.
 * @param {number} index Index for which to return the model object. 
 * @param {Object=} options <b>fetchSize</b>: fetch size to use if the call needs to fetch more records from the server, if virtualized.  Overrides the overall fetchSize setting <br>
 *                  <b>deferred</b>: if true, return a deferred/promise object as described below.  If not specified, the type of return value will be determined by whether or not the collection is virtual<br>
 *                  
 * @return {Object|null} Model [model]{@link oj.Model} located at index. If index is out of range, returns null.  If this is a virtual collection, or
 *                  if deferred is specified and true, at will return a Promise object which will resolve passing the model at the given index (or null if out of range)
 * @export
 */
oj.Collection.prototype.at = function(index, options)
{
    var deferred = this._getDeferred(options);
    return this._atInternal(index, options, false, deferred);
};

// Local indicates that only what's stored locally should be returned (if true)--no fetching
oj.Collection.prototype._atInternal = function(index, options, local, deferred) {
    if (index < 0) {
        // Normalize it using the length-- another BackboneJS test case
        index += this._getLength();
    }
    
    if (index < 0 || this._overUpperLimit(index)) {
        if (!local && (this.IsVirtual() || deferred)) {
            return this._addPromise(function() {
                return Promise.resolve(null);
            });
        }
        return null;
    }
    var self = this;
    if (!local && (this.IsVirtual() || deferred)) {
        return this._addPromise(function() {
            return self._deferredAt(index, options);
        });
    }
    return this._getModel(index);
};

/**
 * Return a promise, the resolution of which indicates that all promise-returning API in process have completed.
 * 
 * @returns {Promise} a promise that when resolved, indicates that all unresolved promise-returning API calls made at the moment of the whenReady have completed
 * @export
 */
oj.Collection.prototype.whenReady = function() {
    if (this._promises) {
        // If we have an active chain, return it
        return this._promises;
    }
    // Otherwise return an immediately resolved promise that means nothing...
        return Promise.resolve();
};

// Add a task to a chained list of Promises
oj.Collection.prototype._addPromise = function(promiseTask) {
    var self = this;
    // Undefined, so set it up initially
    if (this._promises === undefined)
    {
        this._promiseCount = 0;
        this._promises = Promise.resolve();
    }
    // Track the number we have left to resolve
    this._promiseCount++;
    // Chain this new promise callback task to the end of the list
    this._promises = this._promises.then(promiseTask.bind(self)).then(
        function(arg)
        {
            // Resolved successfully--decrement our count and clean up if we have none left to resolve
            self._promiseCount--;
            if (self._promiseCount === 0)
            {
                self._promises = undefined;
                // Fire the ready event
                self.TriggerInternal(false, oj.Events.EventType['READY'], self, null, null);

            }
            // Resolve the true promise with the value we're given
            return arg;
        },
        function(error)
        {
            // Rejected--decrement our count and clean up if we have none left to resolve
            self._promiseCount--;
            if (self._promiseCount === 0)
            {
                self._promises = undefined;
            }
            // Reject the promise
            return Promise.reject(error);
        });

    // Return the chain with the new promise at the end
    return this._promises;
};

oj.Collection.prototype._deferredAt = function(index, options) {
    var self = this;
    // If it's virtual, we need to see if this item has been fetched or not: if not, we need to fetch it + fetchSize
    var model = self._getModel(index);
    if (model === undefined) {
        return new Promise(function(resolve, reject) {
            // Go fetch
            var opts = {};
            oj.CollectionUtils.copyInto(opts, options || {});
            opts['context'] = self;
            opts['startIndex'] = index;
            opts['error'] = function(xhr, status, error) {
                // Handle potential errors
                reject(oj.Collection._createRejectionError(xhr, status, error, self, options));
                return;
            }

            opts['success'] = function(collection, response, retOpt) {
                resolve(self._getModel(index));
            }
            
            self._fetchInternal(opts, -1, false);
            /*self._fetchInternal(opts, -1, false).then(function () {
                    resolve(self._getModel(index));
               }, function(e) { reject(e);});*/
        });
    }
    return new Promise(function(resolve, reject) {
        resolve(model);                   
    });
};

/**
 * Return the first model object from the collection whose client ID is the given model cid
 * @param {string} clientId Client ID (see Model cid) for which to return the model object, if found. 
 * @return {Object|null} First model object in the collection where model.cid = clientId. If none are found, returns null.
 * 
 * @throws {Error} when called on a virtual Collection if the item isn't found in memory
 * @export
 */
oj.Collection.prototype.getByCid = function(clientId)
{
    var models = this._getModels();
    var index;
    var foundModel = null;
    for (var i = 0; i < this._modelIndices.length; i++) {
        index = this._modelIndices[i];
        if (models[index] && clientId === models[index]['cid']) {
            foundModel = models[index];
            break;
        }
    }
    if (foundModel) {
        return foundModel;
    }
    if (this.IsVirtual()) {
        throw new Error("Not found locally and not supported by server for virtual collections");
    }
    return null;
};


/**
 * Return the first model object from the collection whose model id value is the given id or cid, or the id or cid from a passed in model
 * Note this method will not function as expected if the id or cid is not set<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * 
 * @param {Object|string} id ID, cid, or Model (see Model id or cid) for which to return the model object, if found. 
 * @param {Object=} options <p>
 *                  <b>fetchSize</b>: fetch size to use if the call needs to fetch more records from the server, if virtualized.  Overrides the overall fetchSize setting<p>
 *                  <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not
 * @return {Object|null|Promise} First model object in the collection where model.id = id or model.cid = id. If none are found, returns null.
 *                  If deferred or virtual, return a promise passing the model when done
 * @export
 */
oj.Collection.prototype.get = function(id, options)
{
    var deferred = this._getDeferred(options);
    var internalGet = this._getInternal(id, options, deferred);
    if (internalGet) {
        // Is this a deferred object?
        if ($.isFunction(internalGet.then)) {
            return this._addPromise(function() {
                return new Promise(function(resolve, reject) {
                    internalGet.then(function(modInfo) {
                        resolve(modInfo['m']);
                    },
                    function (err) {
                        reject(err);
                    });
                });
            });
        }
        if (this.IsVirtual()) {
            return this._addPromise(function() {
                return new Promise(function(resolve, reject) {
                    resolve(internalGet['m']);
                });
            });
        }
        if (internalGet.hasOwnProperty('m')) {
            return internalGet['m'];
        }
    }
    return null;
};

oj.Collection.prototype._getLocal = function(id) {
    var internalGet = this._getLocalInternal(id);
    if (internalGet) {
        return internalGet['m'];
    }
    return null;
};

oj.Collection.prototype._getLocalInternal = function(id) {
    var cid = id;
    if (id instanceof oj.Model) {
        // Get the cid
        cid = id.GetCid();
        // Get the id
        id = id.GetId();
    }
    else if (oj.Collection._defined(id) && id['id'] !== undefined) {
        id = id['id'];
    }
    var foundObj = null;
    var len = this._modelIndices.length;
    var model;
    var models = this._getModels();
    var index;
    for (var i = 0; i < len; i++) {
        index = this._modelIndices[i];
        model = models[index];
        if (model !== undefined && model.Match(id, cid)) {
            foundObj = oj.Collection._getModinfo(index, model);
            break;
        }
    }
    if (foundObj) {
        return foundObj;
    }
    return oj.Collection._getModinfo(-1, undefined);
};

/**
 * @private
 * @param {Object|null|string} id
 * @param {Object=} options
 * @param {boolean=} deferred
 * @param {boolean=} fillIn
 * @returns {Object}
 */
oj.Collection.prototype._getInternal = function(id, options, deferred, fillIn) {
    var cid = id;
    if (fillIn === undefined) {
        fillIn = false;
    }
    if (id instanceof oj.Model) {
        // Get the cid
        cid = id.GetCid();
        // Get the id
        id = id.GetId();
    }
    else if (oj.Collection._defined(id) && id['id'] !== undefined) {
        id = id['id'];
    }
    
    var foundObj = null;
    var models = this._getModels();
    var index;
    for (var i = 0; i < this._modelIndices.length; i++) {
        index = this._modelIndices[i];
        if (models[index] && models[index].Match(id, cid)) {
            var retObj =  oj.Collection._getModinfo(index, models[index]);
            foundObj = retObj;
            break;
        }
    };
    
    if (foundObj) {
        if (deferred) {
            return new Promise(function(resolve, reject) {
                resolve(foundObj);
            });
        }
        return foundObj;
    }
    // If virtual, might be undefined because it needs to be fetched
    if (this.IsVirtual()) {
        // Try to fetch using start ID.  cid not supported
        if (id === undefined && cid !== undefined) {
            return new Promise(function(resolve, reject) {
                resolve(oj.Collection._getModinfo(-1, undefined));
            });
        }
        var self = this;
        return new Promise(function(resolve, reject) {
            var resp = function (resp) {
                            if (resp != null) {                            
                                var index = self._getOffset();
                                // Check that the model at index is the right one
                                var model = self._getModel(index);
                                if (model !== undefined && model.Match(id, cid)) {
                                    resolve(oj.Collection._getModinfo(index, model));
                                }
                                else {
                                    resolve(oj.Collection._getModinfo(-1, undefined));
                                }
                            }
                            else {
                                resolve(oj.Collection._getModinfo(-1, undefined));
                            }
                       };

            // Go fetch
            var opts = {};
            oj.CollectionUtils.copyInto(opts, options || {});
            opts['context'] = self;
            opts['startID'] = id;
            opts['error'] = function(xhr, status, error) {
                // Handle potential errors
                reject(oj.Collection._createRejectionError(xhr, status, error, self, options));
            }
            opts['success'] = function(collection, response, retOpts) {
                resp(response);
            }
            
            self._fetchInternal(opts, -1, fillIn);
        });
    }
    
    var undefinedModInfo = oj.Collection._getModinfo(-1, undefined);
    if (deferred) {
        return new Promise(function(resolve, reject) {
            resolve(undefinedModInfo);
        });
    }
    return undefinedModInfo;
};
    
oj.Collection._getModinfo = function(index, model) {
    return {index: index, 'm': model};
};

oj.Collection.prototype['parse'] = function (response) {
    var prop;
    
    // Try to interpret ADFbc like controls where a collection is hanging off a property
    if (response instanceof Array) {
        return response;
    }
    
    if (!response) {
        return response;
    }
    
    // See if any of the properties contain arrays
    for (prop in response) {
        if (response.hasOwnProperty(prop)) {
            if (response[prop] instanceof Array) {
                return response[prop];
            }
        }
    }
    return response;
};

// Determine if actual means we are complete
oj.Collection.prototype._checkActual = function(start, count, actual) {
    // Are we at the end with what actually came back?  Then this request should satisfy the setLocalRange
    if (this._hasTotalResults() && this['totalResults'] > 0 && (actual.start + actual.count >= this['totalResults'])) {
        return true;
    }
    return (actual.start === start && actual.count === count);
};

/**
 * 
 * Tell the collection to try and ensure that the given range is available locally.  Note that if the collection is virtual, setRangeLocal may make repeated fetch calls to the server to satisfy the request, stopping only when the range has been made local or the end of the records on the server is reached.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * 
 * @param {number} start starting index to make local
 * @param {number} count number of elements to make local
 * @return {Promise} a promise Object that resolves upon completion.  The promise will be passed an Object containing start and count properties that represent
 * the *actual* starting position (start), count (count), and array (models) of the Models fetched, which may be fewer than what was requested.  The promise will be rejected on
 * an error and will pass the ajax status, xhr object, error, and collection, if relevant.
 * @export
 */
oj.Collection.prototype.setRangeLocal = function(start, count) {
    var self = this;
    return this._addPromise(function() {
        return self._setRangeLocalInternal(start,count);
    });
};

oj.Collection.prototype._setRangeLocalInternal = function(start, count) {
    if (this.IsVirtual()) { 
        // make sure we reconcile the length to what we think the totalresults are--if there have been any non fetched changes in
        // length we don't want to be placing things wrong
        this._resetModelsToFullLength();
    }
    var actual = this._getLocalRange(start, count);
    var self = this;
    if (this._checkActual(start, count, actual)) {
        return new Promise(function (resolve, reject) {
            resolve(actual);
        });
    }
    
    // Manage the LRU - set model limit at least as high as the count we're trying to fetch
    var modelLimit = this._getModelLimit();
    if (modelLimit > -1 && modelLimit < count) {
        this['modelLimit'] = count;
    }
    return new Promise(function (resolve, reject) {
        self._setRangeLocalFetch(start, count, -1, {start:start, count:count}, resolve, reject, true);
    });
}
  
oj.Collection.prototype._setRangeLocalFetch = function(start, count, placement, original, resolve, reject, fill) {
    var self = this;
    var resp = function () {
                    var actual = self._getLocalRange(original.start, original.count);
                    if (fill && self._hasTotalResults() && actual.count < original.count) {
                        // The range wasn't fulfilled: try again                       
                        var newPlacement = actual.start + actual.count;
                        // Try the next block...don't repeat the request
                        var newStart = start + count;
                        if (newStart < self['totalResults']) {
                            self._setRangeLocalFetch(newStart, count, newPlacement, original, resolve, reject, fill);
                        }
                        else {
                            // Can't go any further
                            resolve(actual);
                        }
                    }
                    else {
                        resolve(actual);
                    }
               };
               
    // Go fetch
    var limit = start + count;
    // Get the greater of the limit-start or fetchSize
    if (this[oj.Collection._FETCH_SIZE_PROP] && this[oj.Collection._FETCH_SIZE_PROP] > count) {
        limit = this[oj.Collection._FETCH_SIZE_PROP] + start;
    }
    
    // Now, to optimize, move start up to the first undefined model in the sequence
    var opts = null;
    if (this.IsVirtual()) {
        var newStart = this._getFirstMissingModel(start, limit);
        if (newStart > start) {
            start = newStart;
            // Recheck the limit
            limit = start + count;
            // Get the greater of the limit-start or fetchSize
            if (this[oj.Collection._FETCH_SIZE_PROP] && this[oj.Collection._FETCH_SIZE_PROP] > count) {
                limit = this[oj.Collection._FETCH_SIZE_PROP] + start;
            }
        }
        opts = {'context': this, 'startIndex': start, 'fetchSize': limit-start};
    }
    else {
        opts = {'context': this};
    }
    opts['error'] = function(xhr, status, error) {
        // Handle potential errors
        reject(oj.Collection._createRejectionError(xhr, status, error, self, null));
        return;
    }
    opts['success'] = function(collection, response, retOpts) {
        resp();
    }
    
    try {
        this._fetchInternal(opts, placement, placement > -1);
    }
    catch (e) {
        // This is OK if it's a URLError: local collection with no means of fetching: just resolve
        if (e instanceof oj.URLError) {
            var actual = self._getLocalRange(start, count);
            resolve(actual);
        }
    }
};

oj.Collection._createRejectionError = function(xhr, status, error, collection, options) {
    var silent = false;
    if (options && options['silent']) {
        silent = options['silent'];
    }
    oj.Model._triggerError(collection, silent, options, status, error, xhr);
    var err = new Error(status);
    err['xhr'] = xhr;
    err['error'] = error;
    err['collection'] = collection;
    err['status'] = status;
    return err;
};

oj.Collection.prototype._getMaxLength = function(start, count) {
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
 * @export
 */
oj.Collection.prototype.isRangeLocal = function(start, count) {
    var localRange = this._getLocalRange(start, count);
    if (this._getModelsLength() === 0) {
        // If we have no models length, then range cannot be thought of as local unless the count is zero--edge case
        return count === 0;
    }
    return start === localRange.start && (count === localRange.count || start+count > this._getModelsLength());
};

oj.Collection.prototype._getModelArray = function(start, count) {
    var retArr = [];
    var models = this._getModels();
    var end = start + count;
    for (var i = start; i < end ; i++) {
        retArr.push(models[i]);
    }
    return retArr;
};

// For a given range of models, return the actual range which are local within that set.  
oj.Collection.prototype._getLocalRange = function(start, count) {
    // Not virtual, local if there are any models
    if (!this.IsVirtual()) {
        if (this._getModelsLength() > 0) {
            if (start+count > this._getModelsLength()) {
                // Over the boundary
                var c = this._getModelsLength()-start;
                return {'start':start, 'count':c, 'models':this._getModelArray(start, c)};
            }
            
            return {'start':start, 'count':count, 'models':this._getModelArray(start, count)};
        }
        return {'start':start, 'count':0, 'models':[]};
    }
    var limit = this._getMaxLength(start, count);
    // Adjust for no totalResults
    if (!this._hasTotalResults() && limit < start + count) {
        // We don't know if it's local or not
        return {'start':start, 'count':(limit-start), 'models':this._getModelArray(start, limit-start)};
    }
    if (limit === 0) {
        // There nothing here
        return {'start':start, 'count':0, 'models':[]};
    }
    var firstMissingModel = this._getFirstMissingModel(start, limit);
    if (firstMissingModel > -1) {
        return {'start':start, 'count':(firstMissingModel-start),'models':this._getModelArray(start, firstMissingModel-start)};
    }
    // Make sure start doesn't overrun the end!
    if (start > limit) {
        count = 0;
    } else {
        // Make sure that start+count doesn't overrun the end
        if (start+count > limit) {
            count = limit-start;
        }
    }
    return {'start':start,'count':count,'models':this._getModelArray(start, count)};
};

// Return the first model between start and limit that's undefined
oj.Collection.prototype._getFirstMissingModel = function(start, limit) {
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
 * <b>request</b>: fired when the request to fetch is going to the server, passing the collection, xhr object, and options<br>
 * <b>sync</b>: fired when the collection is fetched from the data service, passing the collection and the raw response<br>
 * <b>error</b>: fired if there is an error during the fetch, passing the collection, xhr object, options<br>
 * </ul>
 * <p>
 * @param {Object=} options Options to control fetch<p>
 *                  <b>success</b>: a user callback called when the fetch has completed successfully. This makes the fetch an asynchronous process. The callback is called passing the Collection object, raw response, and the fetch options argument.<br>
 *                  <b>error</b>: a user callback function called if the fetch fails. The callback is called passing the collection object, xhr, and options arguments.<br>
 *                  <b>add</b>: if set, new records retrieved from the data service will be added to those models already in the collection. If not set, the records retrieved will be passed to the reset() method, effectively replacing the previous contents of the collection with the new data.  Not supported for virtual/paging cases.<br>
 *                  <b>set</b>: if true, fetch will try to use the set function to try and merge the fetched models with those already in the collection, on the client.  The default behavior is to reset the collection before adding back in the fetched models.  This default is the reverse of Backbone's current default.<br>
 *                  <b>startIndex</b>: numeric index with which to start fetching Models from the server.  The page setting controls the number of Models to be fetched.  startID takes precedence over startIndex if both are specified.  If both are specified and startID isn't supported then startIndex will be used instead.<br>
 *                  <b>startID</b>: unique ID of the Model to start fetching from the server.  The page setting controls the number of Models to be fetched.  Note if this is not supported by the server then startID will be ignored.<br>
 *                  <b>since</b>: fetch records having a timestamp since the given UTC time<br>
 *                  <b>until</b>: fetch records having a timestamp up to the given UTC time<br>
 *                  <b>fetchSize</b>: use specified page size instead of collection's setting<br>
 * @return {Object} xhr ajax object, by default.  If [sync]{@link oj.Collection#sync} has been replaced, this would be the value returned by the custom implementation.
 * @export
 */
oj.Collection.prototype.fetch = function (options) {
    var xhr = this._fetchInternal(options, -1, false);
    this._addPromise(function() {
        return Promise.resolve(xhr);
    });
    return xhr;
};

// fillIn is used to indicate that this fetch is just the result of a get() or part of an add(), etc., when virtual
oj.Collection.prototype._fetchInternal = function(options, placement, fillIn) {
    function doReset(collection, opt, fillIn) {
        if (!collection.IsVirtual()) {
           // If we're not doing a "fetch add", delete all the current models
           if (!opt['add'] && !opt.useset) {
                // Reset with internal model
                collection.reset(null, {'silent':true});
            }
        }
        else {
            // If we're not infilling based on an at, get, etc., delete all the current local models
            if (!fillIn) {
               collection._resetModelsToFullLength();
            }
        }
    }
    
    var opt = options || {}, success = opt['success'], self, errFunc = opt['error'];

    if (opt['set']) {
        opt.useset = opt['set'] ? true : false;
    }
 
    // Set up the parsing option
    if (opt['parse'] === undefined) {
        opt['parse'] = true;
    }
    self = this;
    
    opt['error'] = function (xhr, status, error) {
        oj.Model._triggerError(self, false, options, status, error, xhr);
        if (errFunc) {
            errFunc.call(oj.Model.GetContext(options, self), xhr, status, error);
        }
    };
    
    opt['success'] = function (response, status, xhr) {
        
        // Run the entire returned dataset through the collection's parser (either default no-op or user specified)
        var data;
        try {
            data = self['parse'](response, options);
        }
        catch (e) {
            oj.Collection._reportError(self, e, opt['error'], options);
            return;
        }

        // Pull any virtualization properties out of the response
        self._setPagingReturnValues(response, options, data, fillIn);

        var dataList = null;
                
        if (!opt['add'] && !self['model']) {
             // We're not doing a "fetch add" and we don't have a model set on the collection
             if (!fillIn) {
                if (self.IsVirtual()) {
                    // Virtual case only
                    // Clean out the collection
                    doReset(self, opt, fillIn);
                    
                    var manageLRU = false;
                    // Check for passed in offset
                    if (placement === -1) {
                        manageLRU = true;
                        placement = self._getOffset();
                    }
                    // Put the new data in
                    dataList = self._putDataIntoCollection(data, placement, manageLRU);
                }
                else {
                    // New backbone option to not reset
                    if (opt.useset) {
                        self._setInternal(data, false, opt, false);
                    }
                    else {
                        // Replace the data in the collection with a new set (non virtual)
                        self.reset(data, {'silent':true});
                    }
                }
             }
         }
         else {     
             // We have a model and/or we're doing a "fetch add"
             // Clean out the old models if we're not "adding" or infilling for virtual
             doReset(self, opt, fillIn);
             
             // Parse each returned model (if appropriate), and put it into the collection, either from the zeroth offset if non-virtual
             // or using the appropriate offset if virtual
             try {
                var manageLRU = false;
                // Check for passed in offset
                if (placement === -1) {
                    manageLRU = true;
                    placement = self._getOffset();
                }
                dataList = self._fillInCollectionWithParsedData(data, placement, manageLRU, opt);
             }
             catch (e) {
                oj.Collection._reportError(self, e, opt['error'], options);
                return;
             }
         }
         if (self.IsVirtual()) {
             // Take in the number of records actually fetched
             if (dataList) {
                 self['lastFetchCount'] = dataList.length;
             }
         }
         
         // Fire the sync event
         var silent = opt['silent'] ? true : false;
         self.TriggerInternal(silent, oj.Events.EventType['SYNC'], self, response, opt);
         // Call the caller's success callback, if specified
         if (success) {
              success.call(oj.Model.GetContext(options, self), self, response, opt);
         }
     };
     // Make the actual fetch call using ajax, etc.
     return this._fetchCall(opt);
};

// Puts server data into an empty virtual collection using a "silent add"
oj.Collection.prototype._putDataIntoCollection = function(data, placement, manageLRU) {
    var dataList;
    
    if (data) {
       dataList = (data instanceof Array) ? data : [data];  
            
       var addOpt = {};
       // Only manage the LRU if we're not trying to achieve a range
       if (manageLRU) {
            this._manageLRU(dataList.length);
       }
       var insertPos = placement;
       var virtual = this.IsVirtual();
       var prevItem = null;
       for (var i = 0; i < dataList.length; i=i+1) {
           if (virtual) {
               addOpt = {'at': insertPos};
               prevItem = this._atInternal(insertPos, null, true, false);
           }
           // Don't fire add events
           addOpt['silent'] = true;           
           this._addInternal(dataList[i], addOpt, true, false);
           // If virtual, make sure the item was really added where we thought--in other words, what's there now shouldn't match what was there
           // otherwise could be duplicate id and don't increment counter
           if (this._atInternal(insertPos, null, true, false) !== prevItem) {
               insertPos++;
           }
       }
    }           
    return dataList;
};

// Parse each model returned, if appropriate, and push them into the (empty) collection with appropriate offsets if virtual
oj.Collection.prototype._fillInCollectionWithParsedData = function(data, placement, manageLRU, opt) {
    opt = opt || {};
    var parse = opt['parse'];
    var modelInstance = oj.Collection._createModel(this);

    if (data) {
       var dataList = (data instanceof Array) ? data : [data];  

       var addOpt = {}, parsedModel;
       
       // Only manage the LRU if we're not trying to achieve a range
       if (manageLRU) {
            this._manageLRU(dataList.length);
       }
       var virtual = this.IsVirtual();
       if (opt.useset && !virtual) {
           // New backbone option
           for (var i = 0; i < dataList.length; i=i+1) {
               if (modelInstance && parse) {
                   parsedModel = modelInstance.parse(dataList[i]);
               }
               else {
                   parsedModel = dataList[i];
               }

               dataList[i] = parsedModel;
           }
           this._setInternal(dataList, false, opt, false);
       }
       else {
            var prevItem = null;
            var insertPos = placement;
            for (var i = 0; i < dataList.length; i=i+1) {
                if (modelInstance && parse) {
                    parsedModel = modelInstance.parse(dataList[i]);
                }
                else {
                    parsedModel = dataList[i];
                }

                if (virtual) {
                    addOpt = {'at': insertPos};
                    prevItem = this._atInternal(insertPos, addOpt, true, false);
                }
                // Don't fire add events
                addOpt['silent'] = true;
                this._addInternal(parsedModel, addOpt, true, false);
                // If virtual, make sure the item was really added where we thought--in other words, what's there now shouldn't match what was there
                // otherwise could be duplicate id and don't increment counter
                if (this._atInternal(insertPos, null, true, false) !== prevItem) {
                    insertPos++;
                }           
            }
        }    
    }
    return dataList;
};

oj.Collection._reportError = function(collection, e, errorFunc, options) {
    oj.Logger.error(e.toString());
    if (errorFunc) {
        errorFunc.call(oj.Model.GetContext(options, collection), collection, e, options);
    }
};
    
// Used in virtualization to conduct server-based searches: returns list of fetched models via a promise but does not add them to the collection
// model list
oj.Collection.prototype._fetchOnly = function(options) {
    var opt = options || {},
        success = opt['success'], 
        parsedModel, self;

    if (opt['parse'] === undefined) {
        opt['parse'] = true;
    }
    self = this;
    
    opt['success'] = function (response, status, xhr) {
        var i, modelInstance, dataList = null, fetchedModels = [];
        
        var data;
        try {
            data = self['parse'](response, options);
        }
        catch (e) {
            oj.Collection._reportError(self, e, opt['error'], options);
            return;
        }
                
        if (!opt['add'] && !self['model']) {
            dataList = (data instanceof Array) ? data : [data];              
         }
         else {
             modelInstance = oj.Collection._createModel(self);
             
             if (data) {
                dataList = (data instanceof Array) ? data : [data];  
                
                for (i = 0; i < dataList.length; i=i+1) {
                    if (modelInstance && opt['parse']) {
                        try {
                            parsedModel = modelInstance.parse(dataList[i]);
                        }
                        catch (e) {
                            oj.Collection._reportError(self, e, opt['error'], options);
                            return;
                        }
                    }
                    else {
                        parsedModel = dataList[i];
                    }
                    fetchedModels.push(self._newModel(parsedModel));
                }
             }
         }
         
         self.TriggerInternal(false, oj.Events.EventType['SYNC'], self, response, opt);
         if (success) {
              success.call(oj.Model.GetContext(options, self), self, fetchedModels, opt);
         }
     };
     return this._fetchCall(opt);
};

oj.Collection.prototype._fetchCall = function(opt) {
     try {
        return oj.Model._internalSync("read", this, opt);
     }
     catch (e) {
         // Some kind of error: trigger an error event
        oj.Model._triggerError(this, false, opt, null, e, null);
        throw e;
     }
 };

oj.Collection.prototype._resetModelsToFullLength = function() {
    var totalResults =  this['totalResults'];
    if (totalResults !== undefined && this._getModelsLength() !== totalResults) {
        // Make sure to set up the array if the length changes (i.e., from 0 to totalResults--need to preallocate)
        this._setModels(new Array(totalResults), true);
        this._resetLRU();
        this._setLength();
        return true;
    }
    return false;
};

oj.Collection.prototype._getFetchSize = function(options) {
    options = options || {};
    return options[oj.Collection._FETCH_SIZE_PROP] || this[oj.Collection._FETCH_SIZE_PROP];
};

// Are we doing virtualization/paging?
oj.Collection.prototype.IsVirtual = function() {
    return this._getFetchSize(null) > -1;
};

oj.Collection.prototype._getReturnProperty = function(customObj, response, property, optionValue, defaultValue) {
    var value = parseInt(oj.Collection._getProp(customObj, response, property), 10);
    if (value === undefined || value === null || isNaN(value)) {
        // use fetchsize            
        return optionValue ? optionValue : defaultValue;
    }
    return value;
};

oj.Collection.prototype._cleanTotalResults = function(totalResults) {
    // In case server (incorrectly) passes back a -1, treat it as undefined
    if (totalResults === -1) {
        return undefined;
    }    
    return totalResults;
};

// Parse out some of the paging return values we might expect in a virtual response
oj.Collection.prototype._setPagingReturnValues = function(response, options, data, fillIn) {
    var customObj = {};
    // See if there's a custom call out
    if (this['customPagingOptions']) {
        customObj = this['customPagingOptions'].call(this, response);
        if (!customObj) {
            customObj = {};
        }
    }
    // What limit was actually used to generate this response?
    options = options || {};
    this['lastFetchSize'] = this._getReturnProperty(customObj, response, 'limit', options['fetchSize'], this['fetchSize']);
    
    // What offset was actually used to generate this response?
    this['offset'] = this._getReturnProperty(customObj, response, 'offset', options['startIndex'], 0);

    // How many records actually came back?
    this['lastFetchCount'] = this._getReturnProperty(customObj, response, 'count', this['lastFetchCount'], this['lastFetchCount']);
    
    // What is the total number of records possible for this collection?
    this['totalResults'] = this._cleanTotalResults(this._getReturnProperty(customObj, response, 'totalResults', this['totalResults'], this['totalResults']));
    
    // Is there more?
    this['hasMore'] = this._getHasMore(oj.Collection._getProp(customObj, response, 'hasMore'), 
                                       this['offset'], this['lastFetchSize'], this['totalResults']);

    // Adjust total results to account for the case where the server tells us there's no more data, and totalResults wasn't set 
    // by the server...but don't do it for simple gets/adds
    if (!fillIn) {
        // We want to know if the server *actually* returned values for these things, not if they defaulted above
        var totalResultsReturned = this._cleanTotalResults(parseInt(oj.Collection._getProp(customObj, response, 'totalResults'),10));
        var lastFetchCountReturned = parseInt(oj.Collection._getProp(customObj, response, 'count'), 10);
        this['totalResults'] = this._adjustTotalResults(totalResultsReturned, this['hasMore'], this['offset'], lastFetchCountReturned, data && Array.isArray(data) ? data.length : 0);
    }
    
    // Was fetchSize set?  If not, set it to limit
    if (!this.IsVirtual() && this['totalResults'] && this['totalResults'] !== this['lastFetchCount'] && this['lastFetchSize']) {
        this.setFetchSize(this['lastFetchSize']);
    }
};

oj.Collection.prototype._adjustTotalResults = function(totalResultsReturned, hasMore, offset, lastFetchCount, dataLength) {
    // Fix for : if hasMore is false, and totalResults wasn't set by the server, we should set it to the last 
    // thing fetched here.  There is no more.
    if (!hasMore) {
        // No more data, per server
        if (isNaN(totalResultsReturned)) {
            // TotalResults was not returned by the server here
            // If lastFetchCount was set, use that as the final total.  Otherwise, use the length of data passed in...all + offset
            var count = !isNaN(lastFetchCount) ? lastFetchCount : dataLength;
            return count + offset;
        }
    }
    return this['totalResults'];
};

oj.Collection.prototype._getHasMore = function(hasMore, offset, lastFetchSize, totalResults) {
    if (oj.Collection._defined(hasMore)) {
        return hasMore;        
    }
    // Special case: return true if totalResults not defined
    if (totalResults === undefined || totalResults === null) {
        return true;
    }
    // Not there: figure it out.  It's true unless we're walking off the end
    return (offset + lastFetchSize > totalResults) ? false : true;
};

oj.Collection._getProp = function(custom, response, prop) {
    if (custom.hasOwnProperty(prop)) {
        return custom[prop];
    }
    return response ? response[prop] : undefined;
};

oj.Collection.prototype._getOffset = function() {
    return (oj.Collection._defined(this['offset']) ? this['offset'] : 0);
};

/**
 * Creates a new model, saves it to the data service, and adds it on to the collection.<p>
 * Events:<p>
 * <ul>
 * <b>add</b>: fired when the model is added, passing the collection, model added, and options, if not silent<br>
 * <b>alladded</b>: fired after all models have been added, passing the collection, array of models added, and options<br>
 * <b>request:</b>: fired when the request to save is going to the server<br>
 * <b>sync:</b>: fired when the model is saved to the data service, passing the model and the raw response<br>
 * </ul>
 * @param {Object=} attributes Set of attribute/value pairs with which to initialize the new model object, or a new Model object
 * @param {Object=} options Options to control save (see [save]{@link oj.Model#save}), or add (see [add]{@link oj.Collection#add}).  Plus:<p>
 *                          <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not<br>
 * @return {Object|boolean|Promise} new model or false if validation failed.  If virtual, returns a promise that resolves with the new model
 * @export
 */
oj.Collection.prototype.create = function (attributes, options) {
    var self = this;
    options = options || {};
    var deferred = this._getDeferred(options);
    
    function doSave(collection, newModel, validate, opt) {
        newModel.save(attributes instanceof oj.Model ? null : attributes, opt);
        
        return newModel;
    }
    
    function doAdd(newModel, addOpts) {
        if (options['wait']) {
            // Don't do adding now
            if (self.IsVirtual() || deferred) {
                return self._addPromise(function() {
                    return Promise.resolve(undefined);
                });
            }
            return;
        }
        return self.add(newModel, addOpts);
    }
    
    // Save the user's context and callback, if any
    var newModel = this._newModel(attributes, true, options, false),
        callback = options['success'],
        context = options['context'], validate = options['validate'];
    options['context'] = this;
    options['success'] = function(model, resp, successOpts) {
            // Make sure we pass xhr
            if (successOpts['xhr']) {
                options['xhr'] = successOpts['xhr'];
            }
            if (options['wait']) {
                // Trigger delayed add events
                self.add(newModel, options);
            }
            if (callback) {
                callback.call(context != null ? context : self, model, resp, options);
            }
        };
        
    // Did validation pass?
    if (newModel == null) {       
        return false;
    }
    
    // Force a save in case user has set value of idAttribute on the new Model
    options['forceNew'] = newModel.GetId() != null;
    
    var addOpts = oj.Model._copyOptions(options);
    
    newModel.SetCollection(this);
    if (deferred || this.IsVirtual()) {
        return new Promise(function (resolve, reject) {
            addOpts['merge'] = true;
            addOpts['deferred'] = true;
            //if (options['wait']) {
//                addOpts['silent'] = true;
//            }
            //self.add(newModel, addOpts)
            doAdd(newModel, addOpts)
                    .then(function() {
                            options['success'] = function(model, resp, successOpts) {
                                    // Make sure we pass xhr
                                    if (successOpts['xhr']) {
                                        options['xhr'] = successOpts['xhr'];
                                    }
                                    if (options['wait']) {
                                        // Trigger delayed add event
                                        // Force the add if virtual because we know it was successfully saved: we don't
                                        // want to go back to the server to check
                                        if (self.IsVirtual()) {
                                            addOpts['force'] = true;
                                        }
                                        self.add(newModel, addOpts).then(function() {
                                            if (callback) {
                                                callback.call(context != null ? context : self, model, resp, options);
                                            }
                                            resolve(model);                                            
                                        });
                                    }
                                    else {
                                        if (callback) {
                                            callback.call(context != null ? context : self, model, resp, options);
                                        }
                                        resolve(model);
                                    }
                                };
                                var model = doSave(self, newModel, validate, options);
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
    
    addOpts['merge'] = true;
    //if (options['wait']) {
//        addOpts['silent'] = true;
//    }
    //this.add(newModel, addOpts);
    doAdd(newModel, addOpts);
    var model = doSave(this, newModel, validate, options);
    return model;
};

/**
 * Return a list of all the values of attr found in the collection
 * 
 * @param {string} attr attribute to return
 * @return {Array} array of values of attr
 * 
 * @throws {Error} when called on a virtual collection
 * @export
 */
oj.Collection.prototype.pluck = function(attr) {
    var arr = [], i;
    
    this._throwErrIfVirtual("pluck");
    
    for (i = 0; i < this._getLength(); i=i+1) {
        arr.push(this.at(i).get(attr));
    }
    return arr;
};

/**
 * Return an array of models that contain the given attribute/value pairs.  Note that this function, along with findWhere, expects server-resolved
 * filtering to return *all* models that meet the criteria, even in virtual cases.  The fetchSize will be set to the value of totalResults for this call to indicate that
 * all should be returned.<br>
 * Events: for events, if virtual, see [fetch]{@link oj.Collection#fetch}
 * 
 * @param {Object|Array} attrs attribute/value pairs to find.  The attribute/value pairs are ANDed together.  If attrs is an array of attribute/value pairs, then these are ORed together
 *                             If the value is an object (or an array of objects, in which case the single attribute must meet all of the value/comparator conditions), then if it has both 'value' and 'comparator' parameters these will be interpreted as
 *                             expressions needing custom commparisons.  The comparator value may either be a string or a comparator callback function.
 *                             Strings are only valid where the filtering is sent back to the data service (virtual collections).  In the case of a comparator
 *                             function, the function always takes the signature function(model, attr, value), and for non-virtual collections, is called for each 
 *                             Model in the collection with the associated attribute and value.  The function should return true if the model meets the attribute/value
 *                             condition, and false if not.  For cases where the filtering is to be done on the server, the function will be called once per attr/value pair
 *                             with a null model, and the function should return the string to pass as the comparison in the expression for the filtering parameter
 *                             in the URL sent back to the server.  Note that the array of value object case is really only meaningful for server-evaluated filters where
 *                             a complex construction on a single attribute might be needed (e.g., x>v1 && x <=v2)
 *                             For example:<p>
 *                             {Dept:53,Name:'Smith'}<br>
 *                             will return an array of models that have a Dept=53 and a Name=Smith, or, for server-filtered
 *                             collections, a ?q=Dept=53+Name=Smith parameter will be sent with the URL.<p>
 *                             [{Dept:53},{Dept:90}]<br>
 *                             will return all models that have a Dept of 53 or 90.  Or, ?q=Dept=53,Dept=90 will be sent to the server.<p>
 *                             {Dept:{value:53,comparator:function(model, attr, value) { return model.get(attr) !== value;}}}<br>
 *                             will return all models that do not have a Dept of 53.<p>
 *                             {Dept:{value:53,comparator:'<>'}}<br>
 *                             For server-evaluated filters, a parameter ?q=Dept<>53 will be sent with the URL.  This form is an
 *                             error on locally-evaluated colleection filters<p>
 *                             {Dept:{value:53,comparator:function(model, attr, value) { return "<>";}}}<br>
 *                             expresses the same thing for server-evaluated filters<p>
 *                             {Dept:[{value:53,comparator:'<'},{value:90,comparator:'<'}]}<br>
 *                             For server-evaluated filters, a parameter ?q=Dept>53+Dept<93 will be sent to the server<p>
 * @param {Object=} options <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not<p>
 * 
 * @return {Array|Promise} array of models.  If virtual or deferred, a promise that resolves with the returned array from the server
 * @export
 */
oj.Collection.prototype.where = function(attrs, options) {
    return this._handlePromise(this._whereInternal(attrs, options));
};

oj.Collection.prototype._whereInternal = function(attrs, options) {
    options = options || {};
    var deferred = this._getDeferred(options);
    var self = this;
    if (this.IsVirtual()) {
        return new Promise(function(resolve, reject) {
            var success = function(collection, fetchedModels, options) {
                resolve(fetchedModels);
            };
            // Send the attributes for a server-based filter; also indicate that we need *all* the attributes.  In the standard
            // REST URL construction this is accomplished by leaving off fetchSize/start indices, etc.
            var opt = {'query':attrs,  
                       'all': true,
                       'success': success,
                       'error': function(xhr, status, error) {
                           reject(oj.Collection._createRejectionError(xhr, status, error, self, options));
                       }};
            self._fetchOnly(opt);
        });
    }
    
    var arr = [], i, m;
    for (i = 0; i < this._getLength(); i=i+1) {
        m = this.at(i);
        if (m.Contains(attrs)) {
            arr.push(m);
        }
    }
    if (deferred) {
        return new Promise(function(resolve, reject) {
            resolve(arr);
        });
    }
    return arr;
};

/**
 * Return a collection of models that contain the given attribute/value pairs.
 * Note that this returns a non-virtual collection with all the models returned by the server,
 * even if the original collection is virtual.  Virtual collections doing filtering on the server should return all models that meet
 * the critera.  See [where]{@link oj.Collection#where}
 * See [where]{@link oj.Collection#where} for complete documentation of events and parameters
 *
 * @return {Object|Promise} A collection containing models with given attribute/value pairs.  If virtual or deferred, a promise that resolves with the collection returned by the server
 * @export
 */
oj.Collection.prototype.whereToCollection = function(attrs, options) {
    options = options || {};
    var deferred = this._getDeferred(options);
    var self = this;
    if (this.IsVirtual() || deferred) {
        return self._addPromise(function() {
            return new Promise(function(resolve, reject) {
                return self._whereInternal(attrs, options).then(function (models) {
                                                    var collection = self._makeNewCollection(models);
                                                    resolve(collection);
                                                }, function(err) {
                                                    reject(err);
                                                });
                                            });
                                        });
    }
    else {
        var models = this._whereInternal(attrs, options);
        var newCollection = this._makeNewCollection(models);
        newCollection[oj.Collection._FETCH_SIZE_PROP] = -1;
        newCollection._setLength();
        return newCollection;
    }
};
    
oj.Collection.prototype._makeNewCollection = function(models) {
    var collection = this._cloneInternal(false);
    collection._setModels(models, false);
    collection._resetLRU();
    collection._setLength();
    return collection;
};

oj.Collection.prototype._throwErrIfVirtual = function(func) {
    if (this.IsVirtual()) {
        throw new Error(func + " not valid on a virtual Collection");
    }
};

/**
 * Return an array whose entries are determined by the results of calling the passed iterator function.  The iterator will be called for each model in the collection
 * 
 * @param {function(Object)} iterator function to determine the mapped value for each model
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Array} array of values determined by the return value of calls made to iterator for each model
 * 
 * @throws {Error} when called on a virtual Collection
 * @export
 */
oj.Collection.prototype.map = function(iterator, context) {
    var retArr = [], value;
    
    this._throwErrIfVirtual("map");
    
    this._getModels().forEach(function(model) {
        value = iterator.call(context || this, model);
        retArr.push(value);
    });
    return retArr;
};

/**
 * @desc Iterates over the models in the collection and calls the given iterator function
 * 
 * @param {function(Object)} iterator function to call for each model
 * @param {Object=} context context with which to make the calls on iterator
 * 
 * @throws {Error} when called on a virtual collection
 * @export
 */
oj.Collection.prototype.each = function(iterator, context) {
    this._throwErrIfVirtual("each");
    
    this._getModels().forEach(iterator, context);
};

/**
 * Return the length of the collection
 * @returns {number} length of the collection
 * @export
 */
oj.Collection.prototype.size = function() { 
    return this._getLength();
};

/**
 * Return the models sorted determined by the iterator function (or property, if a string value).  If a function, the function should return the attribute by which to sort.
 * 
 * @param {String|function(Object)} iterator method called or property used to get the attribute to sort by.
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Object} models sorted using iterator
 * @throws {Error} when called on a virtual collection
 * @export
 */
oj.Collection.prototype.sortBy = function(iterator, context) {
    var retArr = [], self;

    this._throwErrIfVirtual("sortBy");
    
    this._getModels().forEach(function(model) {
        retArr.push(model);
    });
    self = this;
    
    retArr.sort(function(a, b) {
            var keyA, keyB;

            if ($.isFunction(iterator)) {        
                // "sortBy" comparator option
                keyA = iterator.call(context || self, a);
                keyB = iterator.call(context || self, b);
                return oj.Collection._compareKeys(keyA, keyB, self['sortDirection']);
            }
            // String option
            keyA = a.get(iterator);
            keyB = b.get(iterator);
            return oj.Collection._compareKeys(keyA, keyB, self['sortDirection']);            
        });

    return retArr;
};

/**
 * @desc Return the collection with models grouped into sets determined by the iterator function (or property, if a string value)
 * 
 * @param {String|function(Object)} iterator method called or property (if a string) used to get the group key
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Object} models grouped into sets
 * 
 * @throws {Error} when called on a virtual collection
 * @export
 */
oj.Collection.prototype.groupBy = function(iterator, context) {
    var retObj = {}, groupVal;
    
    this._throwErrIfVirtual("groupBy");
    
    this._getModels().forEach(function(model) {
        if ($.isFunction(iterator)) {
            groupVal = iterator.call(context || this, model);
        }
        else {
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
 * @desc Return an object with models as values for their properties determined by the iterator function or property string
 * 
 * @param {String|function(Object)} iterator method called or property (if a string) used to get the index attribute
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Object} models listed as property values where the properties are the values returned by iterator or the attribute value given by the iterator string
 * 
 * @throws {Error} when called on a virtual collection
 * @export
 */
oj.Collection.prototype.indexBy = function(iterator, context) {
    var retObj = {}, index;
    
    this._throwErrIfVirtual("indexBy");
    
    this._getModels().forEach(function(model) {
        if ($.isFunction(iterator)) {
            index = iterator.call(context || this, model);
        }
        else {
            index = model.get(iterator);
        }
        retObj[index] = model;
    }, this);
    return retObj;    
};

/**
 * Return the "minimum" model in the collection, as determined by calls to iterator.  The return value of iterator (called with a model passed in) will be compared against the current minimum
 * 
 * @param {function(Object)} iterator function to determine a model's value for checking for the minimum
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Object} "Minimum" model in the collection
 * 
 * @throws {Error} when called on a virtual Collection
 * @export
 */
oj.Collection.prototype.min = function(iterator, context) { 
    var minModel = {}, minModelValue, currValue;
    
    this._throwErrIfVirtual("min");
    
    if (this._getModelsLength() == 0) {
        return null;        
    }
    // Get vals started
    minModel = this._getModel(0);
    minModelValue = iterator.call(context || this, this._getModel(0));
    
    this._getModels().forEach(function(model, i) {
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
 * Return the "maximum" model in the collection, as determined by calls to iterator.  The return value of iterator (called with a model passed in) will be compared against the current maximum
 * 
 * @param {function(Object)} iterator function to determine a model's value for checking for the maximum
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Object} "Maximum" model in the collection
 * 
 * @throws {Error} when called on a virtual collection
 * @export
 */
oj.Collection.prototype.max = function(iterator, context) { 
    var maxModel = {}, maxModelValue, currValue;
    
    this._throwErrIfVirtual("max");
    if (this._getModelsLength() == 0) {
        return null;        
    }
    // Get vals started
    maxModel = this._getModel(0);
    maxModelValue = iterator.call(context, this._getModel(0));
    
    this._getModels().forEach(function(model, i) {
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
 * 
 * @param {function(Object)} iterator function to determine if a model should be included or not.  Should return true or false
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {Array} array of models that caused iterator to return true
 * 
 * @throws {Error} when called on a virtual Collection
 */
oj.Collection.prototype.filter = function(iterator, context) {
    var retArr = [];
    
    this._throwErrIfVirtual("filter");
    
    this._getModels().forEach(function(model) {
        if (iterator.call(context || this, model)) {
            retArr.push(model);
        }
    });
    return retArr;
};

/**
 * Return an array of models minus those passed in as arguments
 * @param {...Object} var_args models models to remove from the returned array
 * @returns {Array} array of models from the collection minus those passed in to models
 * 
 * @throws {Error} when called on a virtual Collection
 * @export
 */
oj.Collection.prototype.without = function(var_args) {
    var retArr = [], j, id, cid, add;
    
    this._throwErrIfVirtual("without");
    
    var model;
    // Test each model in the collection
    for (var i = 0; i < this._getModels().length; i++) {
        add = true;
        model = this._getModel(i);
        for (j = 0; j < arguments.length; j=j+1) {
            // Get the cid
            cid = arguments[j].GetCid();
            // Get the id
            id = arguments[j].GetId();             
            if (model.Match(id, cid)) {
                // If it's found, don't return it--we're "subtracting" those from the return value, which starts as all models in the collection
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
 * @param {...Array} var_args models arrays of models to check against the collection
 * @returns {Array} array of models from the collection not passed in as arguments
 * 
 * @throws {Error} when called on a virtual Collection
 * @export
 */
oj.Collection.prototype.difference = function(var_args) {
    var retArr = [], j, k, id, cid, add;
    
    this._throwErrIfVirtual("difference");
    
    var model;
    for (var i = 0; i < this._getModels().length; i++) {
        add = true;
        model = this._getModel(i);
        for (j = 0; j < arguments.length; j=j+1) {
            // Each argument is assumed to be an array of oj.Models
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
 * @export
 */
oj.Collection.prototype.isEmpty = function() {
    return this._getLength() === 0;
};

/**
 * @export
 * @desc Return true if any of the models in the collection pass the test made by calling the iterator function parameter
 * 
 * @param {function(Object)} iterator function called with each model to determine if it "passes".  The function should return true or false.
 * @param {Object=} context context with which to make the calls on iterator
 * @returns {boolean} true if any of the models cause the iterator function to return true
 * 
 * @throws {Error} when called on a virtual collection
 */
oj.Collection.prototype.any = function(iterator, context) {
    this._throwErrIfVirtual("any");
    
    var model;
    for (var i = 0; i < this._getModelsLength(); i=i+1) {
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
 * Events: for events, if virtual, see [fetch]{@link oj.Collection#fetch}<br>
 * @param {Object|Array} attrs attribute/value pairs to find.  
 * See [where]{@link oj.Collection#where} for more details and examples.
 * @param {Object=} options <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not<p>
 * 
 * @returns {Object|Promise} first model found with the attribute/value pairs.  If virtual or deferred, a promise that resolves with the returned array from the server
 */
oj.Collection.prototype.findWhere = function(attrs, options) {
    var deferred = this._getDeferred(options);
    var self = this;
    if (this.IsVirtual() || deferred) {
        return this._addPromise(function() {
            return new Promise(function(resolve, reject) {
                self._whereInternal(attrs, options).then(function(modelList) {
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
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * 
 * @param {number} start model to start the return array with
 * @param {number=} end model to end the return array with, if specified (not inclusive).  If not, returns to the end of the collection
 * @param {Object=} options <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not
 * @return {Array|Promise} array of model objects from start to end, or a promise that resolves specifying the returned array when done
 * @export
 */
oj.Collection.prototype.slice = function(start, end, options) {
    var deferred = this._getDeferred(options);
    var ret = [], i;
    if (end === undefined) {
        if (this.IsVirtual() && !this._hasTotalResults()) {
            // We can't set the end: throw an error
            throw new Error("End must be set for virtual collections with no totalResults");
        }
        end = this._getModelsLength();
    }

    if (deferred || this.IsVirtual()) {
        var self = this;
        return this._addPromise(function() {        
            // Loop using deferred
            return self.IterativeAt(start, end);
        });
    }

    for (i = start; i < end; i=i+1) {
        ret.push(this._getModel(i));
    }
    return ret;
};

/**
 * Update the collection with a model or models.  Depending on the options, new models will be added, existing models will be merged, and unspecified models will be removed.
 * The model cid is used to determine whether a given model exists or not.<br>
 * May fire events as specified by [add]{@link oj.Collection#add} or [remove]{@link oj.Collection#remove}, depending on the options.
 * 
 * @param {Object} models an array of or single model with which to update the collection.  If models contains actual oj.Model objects, then any custom 'parse' function set on the collection needs to take that into account and be prepared to handle an array of oj.Model.
 * @param {Object=} options <b>add</b>:false stops the addition of new models<br>
 *                          <b>remove</b>: false stops the removal of missing models<br>
 *                          <b>merge</b>: false prevents the merging of existing models<br>
 *                          <b>silent</b>: true prevents notifications on adds, removes, etc.<br>
 *                          <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not
 * 
 * @returns {Promise|null} if deferred or virtual, return a promise that resolves when the set has completed
 * @export
 */
oj.Collection.prototype.set = function(models, options) {
    var deferred = this._getDeferred(options);
    return this._setInternal(models, true, options, deferred || this.IsVirtual());
};

oj.Collection._removeAfterSet = function(collection, models, remove, foundModels, options) {
    // Now remove models that weren't found
    // get an array of all models

    // Can't avoid looping over everything because we *have* to clean up even unfetched models, in order to fire events, etc.
    if (remove) {    
        for (var i = models.length-1; i >= 0; i=i-1) {
            if (foundModels.indexOf(i) == -1) {
                collection._removeInternal(models[i], i, options);
            }
        }
    }           
};

// Swap two models, and indicate if anything was actually swapped
oj.Collection.prototype._swapModels = function(oldIndex, newIndex, remove, add) {
    if (this._hasComparator() || !remove || !add) {
        return {index:oldIndex, swapped:false};
    }
    // Make sure in range
    var len = this._getModelsLength();
    if (oldIndex >= len || newIndex >= len) {
        return {index:oldIndex, swapped:false};
    }
    // Swap    
    var oldModel = this._getModel(oldIndex);
    var newModel = this._getModel(newIndex);
    //this._getModels()[oldIndex] = newModel;
    this._setModel(oldIndex, newModel);    
    newModel.SetIndex(oldIndex);
    //this._getModels()[newIndex] = oldModel;
    this._setModel(newIndex, oldModel);
    oldModel.SetIndex(newIndex);
    
    return {index:newIndex, swapped:(newIndex!==oldIndex)};
};

oj.Collection.prototype._setInternal = function(models, parse, options, deferred) {
    // Determine if any of the options are set
    options = options || {};
    var add = options['add'] === undefined ? true : options['add'],
        remove = options['remove'] === undefined ? true : options['remove'],
        merge = options['merge'] === undefined ? true : options['merge'],
        foundModels = [], currModel = null, i, modelList;        

    if (parse) {
        models = this['parse'](models);
    }

    modelList = Array.isArray(models) ? models : [models];

    if (deferred) {
        var self = this;
        return this._addPromise(function() {
            return self._deferredSet(modelList, self._getModels(), options, remove, add, merge, parse);
        });
    }    
    
    // Go through the passed in models and determine what to do
    var swapped = false;
    for (i = 0; i < modelList.length; i=i+1) {
        currModel = this._updateModel(this._newModel(modelList[i], parse, options, true), add, merge, deferred);
        if (currModel !== -1) {
            // And swap it into the position as passed in, if no comparator and we're removing, so that the slots are exact
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
        var eventOpts = options['add'] ? {'add':true} : null;
        this.TriggerInternal(options['silent'], oj.Events.EventType['SORT'], this, eventOpts, null);
    }
        
    oj.Collection._removeAfterSet(this, this._getModels(), remove, foundModels, options);
};

// Handle the updates/removes on virtual collections
oj.Collection.prototype._deferredSet = function(modelList, modelsCopy, options, remove, add, merge, parse) {
    var foundModels = [], i;
    
    // Go through the passed in models and determine what to do
    var self = this;
    return new Promise(function(allResolve, allReject) {
        var doTask = function(index) {
                        return new Promise(function(resolve, reject) {
                            self._updateModel(self._newModel(modelList[index], parse, options, true), add, merge, true).then(function (currModel) {
                                                if (currModel !== -1) {
                                                    foundModels.push(currModel);
                                                }
                                                resolve(index+1);                                        
                                            }, reject);
                                        });
        };

        var currentStep = Promise.resolve(0);

        for (i = 0; i < modelList.length; i=i+1) {
           currentStep = currentStep.then(doTask);
        }
        currentStep.then(function() {
            oj.Collection._removeAfterSet(self, modelsCopy, remove, foundModels, options);
            allResolve(undefined);
        }, allReject);
    });
};


// Return the index of the given model after updating it, if it was found.  Otherwise it is added and a -1 is returned
oj.Collection.prototype._updateModel = function(model, add, merge, deferred) {
    function update(collection, found, deferred) {
        var index = found ? found.index : -1;
        var foundModel = found ? found['m'] : null;

        if (foundModel) {
            if (merge) {
                // Do merge if not overridden
                var opt = {'merge':merge};
                if (deferred) {
                    return new Promise(function(resolve, reject) {                    
                        collection._addInternal(model, opt, false, true).then(function() {
                            resolve(index);
                        });
                    });
                }
                collection.add(model, opt);
            }
        }
        else if (add) {
            if (deferred) {
                return new Promise(function(resolve, reject) {
                    collection._addInternal(model, opt, false, true).then(function() {
                        resolve(collection._getLength()-1);
                    });
                });
            }
            collection.add(model);
            index = collection._getLength()-1;
        }
        return index;
    }
    
    // Check to see if this model is in the collection
    if (deferred || this.IsVirtual()) {
        var self = this;
        
        return new Promise(function(resolve, reject) {
            self._getInternal(model, {'silent':true}, deferred).then(function(found) {

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
 * @return {Array|Promise} an array containing all the Collection's current sets of attribute/value pairs.  If virtual, a promise that will resolve with that array
 * 
 * @export
 */
oj.Collection.prototype.toJSON = function() {
    var retArr = [];
    
    this._throwErrIfVirtual("toJSON");    
    
/*    if (this.IsVirtual()) {
        return this._addPromise(function() {        
            return this.IterativeAt(0, this._getLength());
        });
    }*/
    
    this._getModels().forEach(function(model) {
        retArr.push(model.toJSON());
    });
    return retArr;
};

/**
 * Return the first model object in the collection, or an array of the first n model objects from the collection.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * @param {number=} n Number of model objects to include in the array, starting with the first. 
 * @param {Object=} options deferred: if true, return a promise as though this collection were virtual whether it is or not
 * @return {Array|null|Promise} An array of n model objects found in the collection, starting with the first. If n is not included,
 *                      returns all of the collection's models as an array.  If deferred or virtual, returns a promise that resolves with the array or model
 * @export
 */
oj.Collection.prototype.first = function(n, options) {
    var deferred = this._getDeferred(options);
    var elementCount = this._getLength(),
        retArray = [], 
        i;

    if (n) {
        elementCount = n;
    }
    else {
        n = 1;
    }
    
    var virtual = this.IsVirtual() || deferred;
    
    if (n === 1) {
        if (virtual) {
            var self = this;
            return this._addPromise(function() {
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
        }
        else {
            elementCount = this._getModelsLength();
        }
    }
    
    if (virtual) {
        var self = this;
        return this._addPromise(function() {        
            return self.IterativeAt(0, elementCount);
        });
    }
    
    for (i = 0; i < elementCount; i=i+1) {
        retArray.push(this._getModel(i));
    }
    return retArray;
};

/**
 * Return the array index location of the given model object.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * @param {Object} model Model object (or Model id) to locate 
 * @param {Object=} options <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not

 * @return {number|Promise} The index of the given model object, or a promise that will resolve with the index when complete.
 *                  If the object is not found, returns -1.
 * @export
 */
oj.Collection.prototype.indexOf = function(model, options) {
    var location;
    var deferred = this._getDeferred(options);
    
    if (this.IsVirtual() || deferred) {
        var self = this;
        return this._addPromise(function() {
            return self._getInternal(model, null, true).then(function(loc) {
                                                            return loc.index;
                                                        });
                                                    });
    }
    location = this._getInternal(model);
    
    return location.index;
};

/**
 * Determine if the given model object is present in the collection.<br>
 * For events that may be fired if the collection is virtual, see [fetch]{@link oj.Collection#fetch}.<br>
 * @param {Object} model Model object (or Model id) to locate 
 * @param {Object=} options <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not

 * @return {boolean|Promise} true if the model is contained in the collection, false if not. If deferred, a promise that will resolve with true or false when complete.
 * @export
 */
oj.Collection.prototype.contains = function(model, options) {
    var location;
    var deferred = this._getDeferred(options);
    
    if (this.IsVirtual() || deferred) {
        var self = this;
        return this._addPromise(function() {
            return self._getInternal(model, null, true).then(function(loc) {
                                                            return loc.index > -1;
                                                        });
                                                    });
    }
    location = this._getInternal(model);
    
    return location.index > -1;
};

/**
 * An alias for [contains]{@link oj.Collection#contains}
 * @kind function
 * @memberof oj.Collection
 * @export
 */
oj.Collection.prototype.include = oj.Collection.prototype.contains;

// Only look on models already fetched
oj.Collection.prototype._localIndexOf = function(model) {
    var location = this._getLocalInternal(model);
    
    return location !== undefined ? location.index : -1;
};

/**
 * Remove the last model from the collection and return it<br>
 * For events that may be fired if the collection is virtual, see [remove]{@link oj.Collection#remove}.<br>
 * @param {Object=} options Options for the method:<p>
 * <b>silent</b>: if set, do not fire a remove event <br>
 * <b>deferred</b>: if true, return a promise as though this collection were virtual whether it is or not<br>
 * @return {Object|Promise} the model that was removed, or a promise that will resolve with the model that was removed when complete
 * @export
 */
oj.Collection.prototype.pop = function(options) {
    var deferred = this._getDeferred(options);
    if (this.IsVirtual() || deferred) {
        var self = this;
        return this.at(this._getLength()-1, {'deferred':deferred}).then(function (model) {             
            self.remove(model, options);
            return model;
        });        
    }
    
    var m = this.at(this._getLength()-1);
    this.remove(m, options);
    return m;
};

/**
 * Add the given model to the end of the Collection<br>
 * For events that may be fired if the collection is virtual, see [add]{@link oj.Collection#add}.<br>
 * @param {Object} m model to add to the end of the Collection
 * @param {Object=} options same options as [add]{@link oj.Collection#add}
 * @return {Promise} if deferred or virtual, a promise that will be resolved when the function is done.  Otherwise undefined
 * @export
 */
oj.Collection.prototype.push = function(m, options) {
    var deferred = this._getDeferred(options);
    this._manageLRU(1);
    return this._handlePromise(this._addInternal(m, options, false, deferred));
};

/**
 * Returns the index of the last location of the given model.  Not supported in virtual cases.
 * @param {Object} model Model object to locate
 * @param {number=} fromIndex optionally start search at the given index
 * @return {number} The last index of the given model object.  If the object is not found, returns -1.
 * @throws {Error} when called on a virtual collection 
 * @export
 */
oj.Collection.prototype.lastIndexOf = function(model, fromIndex) {
    var i;
    
    this._throwErrIfVirtual("lastIndexOf");
    
    if (fromIndex === undefined) {
        fromIndex = 0;
    }
    
    for (i = this._getLength()-1; i >= fromIndex; i=i-1) {
        if (oj.Object.__innerEquals(model, this.at(i))) {
            return i;
        }
    }
    return -1;
};

oj.Collection.prototype._getSortAttrs = function(sortStr) {
    if (sortStr === undefined) {
        return [];
    }
    return sortStr.split(",");
};

// Return a URL query string based on an array of or a single attr/value pair set
oj.Collection._getQueryString = function(q) {
    function expression(left, right, compare) {
        return left + compare + right;
    }
    
    var queries = Array.isArray(q) ? q : [q];
    var str = "", query, exp, i, prop;
    for (i = 0; i < queries.length; i++) {
        query = queries[i];
        for (prop in query) {
            if (query.hasOwnProperty(prop)) {
                var val = Array.isArray(query[prop]) ? query[prop] : [query[prop]];
                for (var j = 0; j < val.length; j++) {
                    if (oj.Model.IsComplexValue(val[j])) {
                        var value = val[j]['value'];
                        var compare = null;
                        var comparator = val[j]['comparator'];
                        if ($.isFunction(comparator)) {
                            compare = comparator(null, prop, value);
                        }
                        else {
                            compare = comparator;
                        }
                        exp = expression(prop, value, compare);
                    }
                    else {
                        exp = expression(prop, query[prop], "=");
                    }
                    str += exp + "+";
                }
            }
        }
        // Remove trailing '+'
        str = str.substring(0, str.length-1) + ",";
    }
    // Remove trailing ','
    if (str.substring(str.length-1) === ",") {
        return str.substring(0, str.length-1);
    }
    return str;
};

oj.Collection.prototype.ModifyOptionsForCustomURL = function(options) {
    var opt = {};
    for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
            opt[prop] = options[prop];
        }
    }
    var comparator = this['comparator'];
    if (comparator && oj.StringUtils.isString(comparator)) {
        var attrs = this._getSortAttrs(comparator);        
        for (var i = 0; i < attrs.length; i++) {
            if (i === 0) {
                opt['sort'] = attrs[i];
            }
            else {
                opt['sort'] += "," + attrs[i];
            }
        }
        opt['sortDir'] = this._getSortDirStr();
    }
    // Put fetchSize on if appropriate, and not already set
    if (this.IsVirtual()) {
        opt[oj.Collection._FETCH_SIZE_PROP] = this._getFetchSize(opt);
    }
    return opt;
};

// Determine if this collection is URL-based
oj.Collection.prototype.IsUrlBased = function(options) {
    var customURL = this['customURL'];
    if ($.isFunction(customURL)) {
        return true;
    }
    var url = this.GetCollectionFetchUrl(options);
    return oj.Collection._defined(url);
};
    
// Build a URL with parameters for the collection fetch
oj.Collection.prototype.GetCollectionFetchUrl = function(options) {
    var url = oj.Model.GetPropValue(this, 'url');
    
    // Adorn it with options, if any
    if (this.IsVirtual()) {
        var all = options['all'];
        
        // Put in page size
        var limit = null;
        if (all) {
            var totalResults = this['totalResults'];
            limit = totalResults ? totalResults : this._getFetchSize(options);
        }
        else {
            limit = this._getFetchSize(options);
        }
        if (url && url.indexOf("?") > -1) {
            // Already have a param coming in
            url += "&";
        }
        else {
            url += "?";
        };
        url += "limit=" + limit;

        if (!all) {
            if (oj.Collection._defined(options['startIndex'])) {
                url += "&offset=" + options['startIndex'];
            }
            if (options['startID']) {
                url += "&fromID=" + options['startID'];
            }
            if (options['since']) {
                url += "&since=" + options['since'];
            }
            if (options['until']) {
                url += "&until=" + options['until'];
            }
        }
        // Query
        if (options['query']) {
            var queryString = oj.Collection._getQueryString(options['query']);
            if (queryString && queryString.length > 0) {
                url += "&q=" + queryString;
            }
        }
        
        // Add sorting
        var comparator = this['comparator'];
        if (comparator && oj.StringUtils.isString(comparator)) {
            var attrs = this._getSortAttrs(comparator);
            var sortDirStr = this._getSortDirStr(), i;
            for (i = 0; i < attrs.length; i++) {
                if (i === 0) {
                    url += "&orderBy=" + attrs[i] + ":" + sortDirStr;
                }
                else {
                    url += "," + attrs[i] + ":" + sortDirStr;
                }
            }
        }
        // Always ask for totalresults
        url +="&totalResults=true";        
    }
    return url;
};

oj.Collection.prototype._getSortDirStr = function() {
    if (this['sortDirection'] === -1) {
        return "desc";
    }
    return "asc";
};

/**
 * Called to perfrom server interactions, such as reading the collection.  Designed to be overridden by users
 * 
 * @param {string} method "read"
 * @param {Object} collection the collection to be read (fetched)
 * @param {Object=} options to control sync<br>
 * <b>success</b>: called if sync succeeds.  Called with the array of JSON data being fetched<br>
 * <b>error</b>: called if sync fails.  Called with xhr, status, and error info, per jQuery Ajax (all if available)<br>
 * @return {Object} xhr response from ajax by default
 * @alias oj.Collection.prototype.sync
 */
oj.Collection.prototype['sync'] = function(method, collection, options) {
    return window['oj']['sync'](method, collection, options);
};

// Constants
oj.Collection._FETCH_SIZE_PROP = 'fetchSize';

});
