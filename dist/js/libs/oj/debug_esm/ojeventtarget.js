/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 11.0.0
 * @export
 * @class GenericEvent
 * @classdesc
 */

/**
 *
 * @since 11.0.0
 * @export
 * @namespace EventTargetMixin
 * @classdesc Mixin class to provide generic implementation of addEventListener and removeEventListener
 * methods for the {@link DataGridProvider} interface.
 * <p>
 * This class cannot be instantiated.  You can only call the static applyMixin
 * method to add the implementation to another class.
 * </p>
 * @hideconstructor
 */

/**
 * Apply this mixin to another class
 *
 * @since 11.0.0
 * @param {Function} derivedCtor the constructor of an existing class
 * @export
 * @expose
 * @memberof EventTargetMixin
 * @method
 * @name applyMixin
 * @return {void}
 * @ojtsexample <caption>Apply the mixin in Typescript:</caption>
 * class CustomDataGridProvider&lt;D> implements DataGridProvider&lt;D> {
 *   // Add a stand-in property to satisfy the compiler
 *   addEventListener: () => void;
 *   removeEventListener: () => void;
 *
 *   constructor() {
 *     // Constructor implementation
 *   }
 * }
 *
 * EventTargetMixin.applyMixin(CustomDataGridProvider);
 *
 * @ojtsexample <caption>Apply the mixin in Javascript:</caption>
 * function CustomDataGridProvider() {
 *   // Constructor implementation
 * }
 *
 * EventTargetMixin.applyMixin(CustomDataGridProvider);
 */

// end of jsdoc

class GenericEvent {
    constructor(type, options) {
        this.type = type;
        this.options = options;
        if (options != null) {
            this['detail'] = options['detail'];
        }
    }
}
oj._registerLegacyNamespaceProp('GenericEvent', GenericEvent);

class EventTargetMixin {
    addEventListener(eventType, listener) {
        if (!this._eventListeners) {
            this._eventListeners = [];
        }
        this._eventListeners.push({
            type: eventType.toLowerCase(),
            listener: listener
        });
    }
    removeEventListener(eventType, listener) {
        if (this._eventListeners) {
            let i;
            for (i = this._eventListeners.length - 1; i >= 0; i--) {
                if (this._eventListeners[i]['type'] == eventType &&
                    this._eventListeners[i]['listener'] == listener) {
                    this._eventListeners.splice(i, 1);
                }
            }
        }
    }
    dispatchEvent(evt) {
        if (this._eventListeners) {
            var i, returnValue;
            var eventListeners = this._eventListeners.slice(0);
            for (i = 0; i < eventListeners.length; i++) {
                var eventListener = eventListeners[i];
                if (evt && evt.type && eventListener['type'] == evt.type.toLowerCase()) {
                    returnValue = eventListener['listener'].apply(this, [evt]);
                    if (returnValue === false) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    static applyMixin(derivedCtor) {
        let baseCtors = [EventTargetMixin];
        baseCtors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
}
oj._registerLegacyNamespaceProp('EventTargetMixin', EventTargetMixin);

export { EventTargetMixin, GenericEvent };
