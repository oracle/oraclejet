/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery'], function(oj, $)
{
  "use strict";


/**
 * Converter Contract
 * @ignore
 */

/**
 * Constructs an immutable instance of Converter.
 * @param {Object=} options an object literal used to provide an optional information to
 * initialize the converter.<p>
 * @export
 * @ojsignature {target: "Type", value: "interface Converter<V>",
 *               genericParameters: [{"name": "V", "description": "Type of value to be converted. Parse will
 *                 convert string to this type and format will format this type to string"}]}
 * @ojtsmodule
 * @name oj.Converter
 * @interface
 * @since 0.6.0
 */
var Converter = function Converter(options) {
  this.Init(options);
}; // Subclass from oj.Object


oj.Object.createSubclass(Converter, oj.Object, 'oj.Converter');
/**
 * Initializes converter instance with the set options
 * @param {Object=} options an object literal used to provide an optional information to
 * initialize the converter.<p>
 * @export
 * @ignore
 * @memberof oj.Converter
 */

Converter.prototype.Init = function (options) {
  Converter.superclass.Init.call(this); // should we make options truly immutable? non-configurable, non-enumerable, non-writable
  // Object.defineProperty(oj.Converter.prototype, "_options", {value: options});

  this._options = options;
};
/**
 * Returns a hint that describes the converter format expected.
 * @method getHint
 * @return {string|null} a hint describing the format the value is expected to be in.
 * @memberof oj.Converter
 * @ojsignature {target: "Type", value: "?(): string|null"}
 * @instance
 */

/**
 * Returns the options called with converter initialization.
 * @method getOptions
 * @return {Object} an object of options.
 * @ojsignature {target: "Type", value: "?(): object"}
 * @memberof oj.Converter
 * @instance
 * @export
 */


Converter.prototype.getOptions = function () {
  return this._options || {};
};
/**
 * Parses a String value using the options provided.
 * @method parse
 * @param {string} value to parse
 * @return {any} the parsed value.
 * @ojsignature [
 *                {target: "Type", value: "V|null", for: "returns"}
 *              ]
 * @throws {Error} if parsing fails
 * @memberof oj.Converter
 * @instance
 */

/**
 * Formats the value using the options provided.
 *
 * @param {any} value the value to be formatted for display
 * @return {(string|null)} the localized and formatted value suitable for display
 * @throws {Error} if formatting fails.
 * @method format
 * @ojsignature {target: "Type", value: "V", for: "value"}
 * @memberof oj.Converter
 * @instance
 */

/**
 * Returns an object literal with locale and formatting options computed during initialization of
 * the object. If options was not provided at the time of initialization, the properties will be
 * derived from the locale defaults.
 * @return {Object} an object of resolved options.
 * @ojsignature {target: "Type", value: "?(): object"}
 * @export
 * @memberof oj.Converter
 * @instance
 * @method resolvedOptions
 */


Converter.prototype.resolvedOptions = function () {
  var resolved = {}; // returns a clone of this._options

  $.extend(resolved, this._options);
  return resolved;
};

  return Converter;
});