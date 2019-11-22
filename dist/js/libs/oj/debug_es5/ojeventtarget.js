/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore'], function(oj)
{
  "use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EventTargetMixin =
/*#__PURE__*/
function () {
  function EventTargetMixin() {
    _classCallCheck(this, EventTargetMixin);
  }

  _createClass(EventTargetMixin, [{
    key: "addEventListener",
    value: function addEventListener(eventType, listener) {
      if (!this._eventListeners) {
        this._eventListeners = [];
      }

      this._eventListeners.push({
        'type': eventType.toLowerCase(),
        'listener': listener
      });
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventType, listener) {
      if (this._eventListeners) {
        var i;

        for (i = this._eventListeners.length - 1; i >= 0; i--) {
          if (this._eventListeners[i]['type'] == eventType && this._eventListeners[i]['listener'] == listener) {
            this._eventListeners.splice(i, 1);
          }
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      if (this._eventListeners) {
        var i, returnValue; //clone the eventListeners to isolate mutations that may occur during dispatching events

        var eventListeners = this._eventListeners.slice(0);

        for (i = 0; i < eventListeners.length; i++) {
          var eventListener = eventListeners[i];

          if (evt && evt.type && eventListener['type'] == evt.type.toLowerCase()) {
            returnValue = eventListener['listener'].apply(this, [evt]);

            if (returnValue === false) {
              // event cancelled
              return false;
            }
          }
        }
      }

      return true;
    }
  }], [{
    key: "applyMixin",
    value: function applyMixin(derivedCtor) {
      var baseCtors = [EventTargetMixin];
      baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
          if (name !== 'constructor') {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
          }
        });
      });
    }
  }]);

  return EventTargetMixin;
}();

oj.EventTargetMixin = EventTargetMixin;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericEvent = function GenericEvent(type, options) {
  _classCallCheck(this, GenericEvent);

  this.type = type;
  this.options = options;

  if (options != null) {
    this['detail'] = options['detail'];
  }
};

oj.GenericEvent = GenericEvent;

});