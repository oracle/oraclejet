/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojtemplateengine-utils'], function (ojtemplateengineUtils) { 'use strict';

    /**
     * JET Template Engine implementation for used by legacy components with 'preact'
     * binding provider and without 'knockout' dependencies.
     *
     * The template element must have 'render' property with function callback
     * that returns a body of the template.
     * The template will be processed using VDOM methods.
     */
    class PreactTemplateEngine {
        constructor() {
            this._defaultProps = new Map();
        }
        /**
         * Executes the template by calling function callback stored as 'render' property on the template.
         * The context is passed to the callback to process expressions.
         *
         * @param {Element} componentElement component element
         * @param {Element} templateElement the <template> element
         * @param {Object} properties data to be applied to the template
         * @param {string} alias an alias for referencing the data within a template
         * @param {Element} reportBusy - optional element for bubblng busy states outside of the template
         * @param {Map} provided - optional provided context to be applied to template
         * @return {Array.<Node>} HTML nodes representing the result of the execution
         * @ignore
         */
        execute(componentElement, templateElement, properties, alias, reportBusy, provided) {
            // Check to see if data-oj-as was defined on the template element as an additional
            // alias to provide to the template children
            const templateAlias = templateElement.getAttribute('data-oj-as');
            const context = ojtemplateengineUtils.TemplateEngineUtils.getContext(null, componentElement, templateElement, properties, alias, templateAlias, provided);
            if (templateElement.render) {
                return this._executeVDomTemplate(componentElement, templateElement, reportBusy, context, provided);
            }
            throw new Error(`The render property is expected on the template for component ${componentElement.id}`);
        }
        /**
         * Cleans specified node
         * @param node
         * @param componentElement component element used for execute call
         * @ignore
         */
        clean(node, componentElement) {
            // Search for nodes created with VDom methods and let PreactTemplate clean them.
            let vdomTemplateRoots = ojtemplateengineUtils.PreactTemplate.findTemplateRoots(node, componentElement);
            vdomTemplateRoots.forEach((root) => {
                ojtemplateengineUtils.PreactTemplate.clean(root);
            });
            return null;
        }
        /**
         * Resolves properties on an element of the template without producing
         * any DOM. This method should be used when a template is used exclusively for collecting
         * properties while iterating over data
         * @param {Element} componentElement component element
         * @param {Element} node the <template> element
         * @param {string} elementTagName tag name of the element where the property should be collected
         * @param {Set.<string>} propertySet properties to be resolved
         * @param {Object} data data to be applied to the template
         * @param {string} alias an alias for referencing the data within a template
         * @param {Function=} propertyValidator a function to type check the value for a property
         * @param {Element=} alternateParent an element where the template element will be
         * temporarily added as a child. If the parameter is ommitted, the componentElement will
         * be used
         * @return {Object} an object that implemenets three functions: peek(), subscribe() and dispose()
         * peek() returns the current value of the resolved properties, subscribe allows registering a subscription to the changes in resolved property values with
         * the subscription callback receiving the new value as a parameter, and dispose() removes the subscription.
         * @ignore
         */
        resolveProperties(componentElement, node, elementTagName, propertySet, data, alias, propertyValidator, alternateParent) {
            // The 'render' property on a template means that the template is a part of a VComponent.
            // The template will be processed with VDom methods
            const renderFunc = node.render;
            if (renderFunc) {
                const defaultProps = ojtemplateengineUtils.TemplateEngineUtils.getResolvedDefaultProps(this._defaultProps, elementTagName, propertySet);
                return ojtemplateengineUtils.PreactTemplate.resolveVDomTemplateProps(node, renderFunc, elementTagName, propertySet, data, defaultProps, propertyValidator);
            }
            throw new Error(`The render property is expected on the template for component ${componentElement.id}`);
        }
        /**
         * The method is not supported on this version of Template Engine
         * @param target
         * @param name
         * @param value
         * @param changeListener
         */
        defineTrackableProperty(target, name, value, changeListener) {
            throw new Error('This template engine does not support trackable property');
        }
        /**
         * Executes the template by calling function callback stored as 'render' property on the template.
         *
         * Template nodes will be cached in order to be updated when 'render' property value is updated,
         * in this case we don't need to refresh parent custom element completely.
         * @param {Element} componentElement component element
         * @param {Element} templateElement the <template> element
         * @param {Element} reportBusy - optional element for bubblng busy states outside of the template
         * @param {Object} context the binding context for the template  element
         * @param {Map} provided - optional provided context to be applied to template
         * @ignore
         */
        _executeVDomTemplate(componentElement, templateElement, reportBusy, context, provided) {
            const vNode = templateElement.render(context.$current);
            ojtemplateengineUtils.PreactTemplate.extendTemplate(templateElement, ojtemplateengineUtils.PreactTemplate._ROW_CACHE_FACTORY, (renderer) => {
                // When the renderer changes, rerender all cached rows
                templateElement._cachedRows.forEach((rowItem) => {
                    let newVNode = renderer(rowItem.currentContext);
                    ojtemplateengineUtils.PreactTemplate.renderNodes(componentElement, newVNode, rowItem, provided);
                });
            });
            // Use a parent node stub to render since preact's render() needs a parent node.
            const parentStub = document.createElement('div');
            if (reportBusy) {
                parentStub._ojReportBusy = reportBusy;
            }
            const cachedRow = {
                currentContext: context.$current,
                template: templateElement,
                parentStub,
                computedVNode: null,
                vnode: undefined,
                nodes: undefined
            };
            ojtemplateengineUtils.PreactTemplate.renderNodes(componentElement, vNode, cachedRow, provided);
            templateElement._cachedRows.push(cachedRow);
            return cachedRow.nodes;
        }
    }

    var index = new PreactTemplateEngine();

    return index;

});
