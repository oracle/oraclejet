(function() {
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) {
  'use strict';
  /**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @namespace VComponentBinding
   * @ojmodule ojvcomponent-binding
   * @since 10.0.0
   * @ojtsimport {module: "ojmetadata", type: "AMD", importName:"MetadataTypes"}
   *
   * @classdesc
   * <h3>JET VComponentBinding</h3>
   * The namespace contains VComponent property binding decorators.
   * <p>These decorators are designed to be used on VComponent properties when a particular property value
   * has to propagate to the descendant components or a particular property value should be received
   * from a parent component, if the property is provided by the parent.</p>
   * <p>Note that the property binding decorators can only be used by VComponents that have Knockout binding applied to them.</p>
   *
   * <h6>Example:</h6>
   * <pre class="prettyprint">
   * <code>
   * class Props {
   *   // Indicate that the component will consume the 'containerlabelEdge' property value provided by the parent
   *   &#64;consumeBinding({name: 'containerlabelEdge'})
   *
   *   // Provide the 'labelEdge' property value under two different keys using different transform logic for different consumers.
   *   &#64;provideBinding({name: 'containerlabelEdge', default: 'inside'})
   *   &#64;provideBinding({name: 'labelEdge', default: 'inside', transform: {top: 'provided', start: 'provided'}})
   *   labelEdge?: 'inside' | 'start' | 'top' = 'inside';
   * }
   * </code>
   * </pre>
   */

  /**
   * Property decorator for VComponent that allows the property to consume a value provided by an ancestor component.
   * The value will be consumed only if the property's attribute has not been set, i.e. the provided value is used as a default.
   * The 'name' property should be set to the name of the variable published by an ancestor component.
   * @param {object} consume Options object that contains a name of the variable published by an ancestor component.
   * @return {Function}
   * @name consumeBinding
   * @function
   * @memberof! VComponentBinding
   * @ojsignature {target:"Type", value:"{name: string}", for: "consume"}
   * @ojdecorator
   */

  /**
   * Property decorator for VComponent that allows the property to provide a value to be consumed by descendant components.
   * Use multiple provideBinding decorators to provide more than one value to the descendants. See example above.
   * The provided value will come from the literal attribute value, explicit expression binding or an implicit (consumed) binding
   * provided by an ancestor component.
   * @param {object} provide Options object.
   * @return {Function}
   * @name provideBinding
   * @function
   * @ojsignature {target:"Type", value:"MetadataTypes.ProvideProperty", for:"provide"}
   * @memberof! VComponentBinding
   * @ojdecorator
   */

  function consumeBinding(consume) {
    return function (target, propertyKey) {};
  }

  function provideBinding(provide) {
    return function (target, propertyKey) {};
  }

  exports.consumeBinding = consumeBinding;
  exports.provideBinding = provideBinding;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())