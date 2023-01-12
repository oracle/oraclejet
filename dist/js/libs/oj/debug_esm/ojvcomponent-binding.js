/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @ojmodulecontainer ojvcomponent-binding
 * @ojhidden
 * @since 10.0.0
 * @ojtsimport {module: "ojmetadata", type: "AMD", importName:"MetadataTypes"}
 *
 * @classdesc
 * This module contains VComponent property binding decorators.
 * <p>These decorators are designed to be used on VComponent classes when a particular property value
 * has to propagate to descendant components or a particular property value should be received
 * from a parent component, if that property value is provided by the parent.</p>
 * <p>Additional considerations:
 *  <ul>
 *    <li>Property binding decorators are only honored when the VComponent custom element
 *      is used in a Knockout binding environment.</li>
 *    <li>Functional VComponents rely upon the 'options' argument to <code>registerCustomElement</code>
 *      for registering this runtime metadata with the custom element.  See the
 *      <a href='ojvcomponent.html#registerCustomElement'>registerCustomElement</a> API Doc
 *      for additional information.</li>
 *  </ul>
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * import { consumedBindings, providedBindings } from "ojs/ojvcomponent-binding";
 * import { customElement, ExtendGlobalProps } from "ojs/ojvcomponent";
 * import { Component } from "preact";
 *
 * type Props = Readonly<{
 *   labelEdge?: 'inside' | 'start' | 'top';
 *   readonly?: boolean;
 * }>;
 *
 * // Indicate that the component's 'labelEdge' and 'readonly' properties will consume
 * // the 'containerLabelEdge' and 'containerReadonly' variable values, respectively,
 * // provided by the parent.
 * &#64;consumedBindings( { labelEdge: { name: 'containerLabelEdge' },
 *                      readonly: { name: 'containerReadonly' }
 *                    } )
 * // Indicate that the component will provide the 'labelEdge' and 'readonly' property values
 * // under different keys and with different transforms as required for different consumers.
 * &#64;providedBindings( { labelEdge: [
 *                                  { name: 'containerLabelEdge', default: 'inside' },
 *                                  { name: 'labelEdge', default: 'inside', transform: {  top: 'provided', start: 'provided'  } }
 *                                 ],
 *                      readonly: [
 *                                  { name: 'containerReadonly' },
 *                                  { name: 'readonly' }
 *                                ]
 *                    } )
 * &#64;customElement('my-form-subsection-component')
 * class FormSubsectionComponent extends Component&lt;ExtendGlobalProps&lt;Props&gt;&gt; {
 *   static defaultProps = {
 *     labelEdge: 'inside',
 *     readonly: false
 *   };
 *
 *   render(props: Props) {
 *     return &lt;div&gt;Label position = {props.labelEdge}, sub-section is {props.readonly ? 'read only' : 'editable'}&lt;/div&gt;;
 *   }
 * }
 * </code>
 * </pre>
 */

/**
 * Class decorator for VComponent specifying that one or more component properties can consume a value provided by an ancestor component.
 * The value will be consumed only if the specified component property's attribute has not been set, i.e. the consumed value is used as a default.
 * The 'name' property should be set to the name of the variable published by an ancestor component that is the source of the consumed value.
 * @param {object} consumes Object that maps component properties to the names of variables published by an ancestor component.
 * @return {Function}
 * @name consumedBindings
 * @function
 * @ojexports
 * @memberof ojvcomponent-binding
 * @ojsignature {target:"Type", value: "{ [key: string]: { name: string } }", for: "consumes"}
 * @ojdecorator
 */

/**
 * Class decorator for VComponent specifying that one or more component properties will provide one or more values to be consumed by descendant components.
 * See example above. Provided values will come from the literal attribute values, explicit expression bindings, or implicit (consumed) bindings
 * provided by an ancestor component.
 * @param {object} provides Object that maps component properties to one or more variables published to its descendant components.
 * @return {Function}
 * @name providedBindings
 * @function
 * @ojexports
 * @ojsignature {target:"Type", value:"{ [key: string]: Array<MetadataTypes.ProvideProperty> }", for: "provides"}
 * @memberof ojvcomponent-binding
 * @ojdecorator
 */

function consumedBindings(consumes) {
    return function (constructor) { };
}
function providedBindings(provides) {
    return function (constructor) { };
}

export { consumedBindings, providedBindings };
