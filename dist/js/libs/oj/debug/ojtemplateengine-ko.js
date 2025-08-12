/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['knockout', 'ojs/ojkoshared', 'ojs/ojtemplateengine-utils', 'ojs/ojcore', 'ojs/ojhtmlutils', 'ojs/ojcustomelement-utils', 'ojs/ojcontext', 'ojs/ojlogger'], function (ko, BindingProviderImpl, ojtemplateengineUtils, oj, HtmlUtils, ojcustomelementUtils, Context, Logger) { 'use strict';

    BindingProviderImpl = BindingProviderImpl && Object.prototype.hasOwnProperty.call(BindingProviderImpl, 'default') ? BindingProviderImpl['default'] : BindingProviderImpl;
    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    const _propertyContribsCache = new WeakMap();
    class TemplateEngineKoInternal {
        constructor() {
            this._bindingProvider = {
                __ContextFor: ko.contextFor,
                __ExtendBindingContext: BindingProviderImpl.extendBindingContext,
                __KoComputed: ko.computed,
                __Observable: ko.observable
            };
        }
        /**
         * Executes the template by deep-cloning the template nodes and then applying data bindings.
         * @param {Element} componentElement component element
         * @param {Element} templateElement the <template> element
         * @param {Element} reportBusy - optional element for bubblng busy states outside of the template
         * @param {Object} context the binding context for the template  element
         * @param {Map} provided - optional provided context to be applied to template
         * @return {Array.<Node>} HTML nodes representing the result of the execution
         * @ignore
         */
        executeTemplate(componentElement, templateElement, reportBusy, context, provided) {
            const processedTemplate = templateElement._replacedNodes.templateCopy;
            const tmpContainer = this._createAndPopulateContainer(processedTemplate, reportBusy);
            let stampedNodes = tmpContainer.childNodes;
            for (let i = 0; i < stampedNodes.length; i++) {
                const stampedNode = stampedNodes[i];
                // Set the binding provider on the stamped nodes in case the parent
                // component is a different binding provider
                stampedNode[ojcustomelementUtils.CACHED_BINDING_PROVIDER] = 'knockout';
            }
            ko.applyBindingsToDescendants(context, tmpContainer);
            return Array.prototype.slice.call(stampedNodes, 0);
        }
        resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent) {
            const templateAlias = templateElement.getAttribute('data-oj-as');
            const context = ojtemplateengineUtils.TemplateEngineUtils.getContext(this._bindingProvider, componentElement, templateElement, data, alias, templateAlias);
            const contribs = this._getPropertyContributorsViaCache(templateElement, context, elementTagName, propertySet, alternateParent || componentElement);
            return this._createComputed(contribs, context, propertyValidator);
        }
        /**
         *
         * @param node
         * @param context
         * @param elementTagName
         * @param propertySet
         * @param parent
         */
        _getPropertyContributorsViaCache(node, context, elementTagName, propertySet, parent) {
            let contribs = _propertyContribsCache.get(node);
            if (!contribs) {
                contribs = {};
                _propertyContribsCache.set(node, contribs);
                const tmpNode = this._createAndPopulateContainer(node);
                const firstElem = tmpNode.querySelector(elementTagName);
                contribs.evalMap = this._getPropertyEvaluatorMap(firstElem, propertySet, context);
                contribs.staticMap = this._getStaticPropertyMap(firstElem, propertySet, parent);
            }
            return contribs;
        }
        /**
         *
         * @param firstElem
         * @param propertySet
         * @param context
         */
        _getPropertyEvaluatorMap(firstElem, propertySet, context) {
            var evalMap = new Map();
            var attrs = firstElem ? firstElem.attributes : [];
            for (var i = 0; i < attrs.length; i++) {
                var attr = attrs[i];
                var prop = ojcustomelementUtils.AttributeUtils.attributeToPropertyName(attr.name);
                // Handle the 'dot' notation for bound subprops
                var propTokens = prop.split('.');
                if (propertySet.has(propTokens[0])) {
                    var info = ojcustomelementUtils.AttributeUtils.getExpressionInfo(attr.value);
                    var expr = info.expr;
                    if (expr) {
                        evalMap.set(propTokens, BindingProviderImpl.createBindingExpressionEvaluator(expr, context));
                    }
                }
            }
            return evalMap;
        }
        _getStaticPropertyMap(firstElem, propertySet, parent) {
            const staticMap = {};
            if (firstElem) {
                var st = firstElem.style;
                st.display = 'none';
                st.position = 'absolute';
                firstElem.setAttribute('data-oj-binding-provider', 'none');
                parent.appendChild(firstElem);
                propertySet.forEach(function (key) {
                    if (firstElem[key] !== undefined) {
                        staticMap[key] = firstElem[key];
                    }
                });
                parent.removeChild(firstElem);
            }
            return staticMap;
        }
        /**
         *
         * @param contribs
         * @param context
         * @param propertyValidator
         */
        _createComputed(contribs, context, propertyValidator) {
            const computed = ko.pureComputed(() => {
                const boundValues = {};
                contribs.evalMap.forEach((evaluator, tokens) => {
                    var leafValue = ko.utils.unwrapObservable(evaluator(context));
                    if (propertyValidator) {
                        propertyValidator(tokens, leafValue);
                    }
                    boundValues[tokens[0]] = this._getMergedValue(boundValues, tokens, leafValue);
                });
                const extend = oj.CollectionUtils.copyInto;
                let valueMap = extend({}, contribs.staticMap, null, true);
                valueMap = extend(valueMap, boundValues, null, true);
                return valueMap;
            });
            return this._wrap(computed, ['peek', 'subscribe', 'dispose']);
        }
        _getMergedValue(valuesObj, tokens, value) {
            if (tokens.length < 2) {
                return value;
            }
            const complexVal = valuesObj[tokens[0]] || {};
            let current = complexVal;
            const lastIndex = tokens.length - 1;
            for (let i = 1; i < lastIndex; i++) {
                const token = tokens[i];
                const newVal = current[token] || {};
                current[token] = newVal;
                current = newVal;
            }
            current[tokens[lastIndex]] = value;
            return complexVal;
        }
        /**
         *
         * @param delegate
         * @param methods
         */
        _wrap(delegate, methods) {
            const ret = {};
            methods.forEach((method) => {
                ret[method] = delegate[method].bind(delegate);
            });
            return ret;
        }
        /**
         *
         * @param templateElement
         * @param reportBusy
         */
        _createAndPopulateContainer(templateElement, reportBusy) {
            var div = document.createElement('div');
            if (reportBusy) {
                div._ojReportBusy = reportBusy;
            }
            var nodes = HtmlUtils.getTemplateContent(templateElement);
            for (var i = 0; i < nodes.length; i++) {
                div.appendChild(nodes[i]);
            }
            return div;
        }
    }

    class TemplateEnginePreactInternal {
        constructor() {
            this._defaultProps = new Map();
        }
        /**
         * Executes the template by calling function callback stored as 'render' property on the template.
         * Template nodes will be cached in order to be updated when 'render' property value is updated,
         * in this case we don't need to refresh parent custom element completely.
         * @param {Element} componentElement component element
         * @param {Element} templateElement the <template> element
         * @param {Element} reportBusy - optional element for bubblng busy states outside of the template
         * @param {Object} context the binding context for the template  element
         * @param {Map} provided - optional provided context to be applied to template
         * @ignore
         */
        executeTemplate(componentElement, templateElement, reportBusy, context, provided) {
            // Override ko throttle() method to add busy state for pending changes.
            const busyContext = Context.getContext(templateElement).getBusyContext();
            const customThrottle = (callback, timeout) => {
                let timeoutInstance;
                return () => {
                    if (!timeoutInstance) {
                        // add busy state and assign busyStateResolve here
                        const busyStateResolve = busyContext.addBusyState({
                            description: 'pending changes for the template element'
                        });
                        timeoutInstance = setTimeout(() => {
                            timeoutInstance = undefined;
                            callback();
                            busyStateResolve();
                        }, timeout);
                    }
                };
            };
            const computedVNode = ko.pureComputed({
                read: () => {
                    // Run render() callback to produce VNode element - root node for template content.
                    // Then cache tempate the content.
                    // Also pass provided map to the renderer. IT is needed by VComponentTemplate engine
                    // since it uses context for entire slot
                    return templateElement.render(context.$current, provided);
                }
            })
                .extend({ rateLimit: { timeout: 0, method: customThrottle } });
            const vNode = computedVNode();
            ojtemplateengineUtils.PreactTemplate.extendTemplate(templateElement, ojtemplateengineUtils.PreactTemplate._ROW_CACHE_FACTORY, (renderer) => {
                // When the renderer changes, rerender all cached rows
                templateElement._cachedRows.forEach((rowItem) => {
                    // Also pass provided map to the renderer. IT is needed by VComponentTemplate engine
                    // since it uses context for entire slot
                    let newVNode = renderer(rowItem.currentContext, provided);
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
                computedVNode,
                vnode: undefined,
                nodes: undefined
            };
            ojtemplateengineUtils.PreactTemplate.renderNodes(componentElement, vNode, cachedRow, provided);
            templateElement._cachedRows.push(cachedRow);
            computedVNode.subscribe((newVNode) => {
                const currRow = templateElement._cachedRows.find((row) => row.computedVNode === computedVNode);
                // It is possible that the currRow is not found, because it could be already disposed
                // by the component. If that is the case, then skip rendering.
                if (currRow) {
                    if (!currRow.nodes[0].isConnected) {
                        // Preact will fail to update disconnected nodes. This should be fixed on a component
                        // that used templateEngine.execute() to produce the original set of nodes.
                        // The nodes should be either disposed or parked. Logging the warning in order to identify the condition.
                        Logger.warn(`PreactTemplateEngineKo subscription is called to replace disconnected row for the template slot \'${templateElement.slot}\' on ${componentElement.tagName}`);
                    }
                    ojtemplateengineUtils.PreactTemplate.renderNodes(componentElement, newVNode, currRow, provided);
                }
            });
            return cachedRow.nodes;
        }
        /**
         * Resolves properties on an element of the template without producing
         * any DOM. This method should be used when a template is used exclusively for collecting
         * properties while iterating over data
         * @param {Element} componentElement component element
         * @param {Element} templateElement the <template> element
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
        resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent) {
            const renderFunc = templateElement.render;
            const defaultProps = ojtemplateengineUtils.TemplateEngineUtils.getResolvedDefaultProps(this._defaultProps, elementTagName, propertySet);
            return ojtemplateengineUtils.PreactTemplate.resolveVDomTemplateProps(templateElement, renderFunc, elementTagName, propertySet, data, defaultProps, propertyValidator);
        }
    }

    /**
     * JET Template Engine implementation used by legacy components
     * with 'knockout' or 'none' binding providers.
     * @ignore
     */
    class JetTemplateEngine {
        constructor() {
            this._bindingProvider = {
                __ContextFor: ko.contextFor,
                __ExtendBindingContext: BindingProviderImpl.extendBindingContext,
                __KoComputed: ko.computed,
                __Observable: ko.observable
            };
            this._templateEngineKO = new TemplateEngineKoInternal();
            this._templateEngineVDOM = new TemplateEnginePreactInternal();
        }
        /**
         * The method checks whether the template is from Preact component (has 'render' method on it)
         * or it is a traditional template with child nodes. Then the appropriate executor is called on the template.
         * See executeTemplate() methods on internal implementations.
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
            const processedNodes = ojtemplateengineUtils.TemplateEngineUtils.processTemplate(templateElement);
            if (processedNodes && processedNodes.replacementMap?.size > 0) {
                if (!properties) {
                    properties = {};
                }
                properties['_ojNodesMap'] = Object.fromEntries(processedNodes.replacementMap);
            }
            const context = ojtemplateengineUtils.TemplateEngineUtils.getContext(this._bindingProvider, componentElement, templateElement, properties, alias, templateAlias, provided);
            if (templateElement.render) {
                return this._templateEngineVDOM.executeTemplate(componentElement, templateElement, reportBusy, context, provided);
            }
            return this._templateEngineKO.executeTemplate(componentElement, templateElement, reportBusy, context, provided);
        }
        /**
         * Cleans specified node
         * @param node
         * @param componentElement component element used for execute call (used in preact template engine)
         * @ignore
         */
        clean(node, componentElement) {
            // Search for nodes created with VDom methods and let PreactTemplate clean them.
            let vdomTemplateRoots = ojtemplateengineUtils.PreactTemplate.findTemplateRoots(node, componentElement);
            vdomTemplateRoots.forEach((root) => {
                ojtemplateengineUtils.PreactTemplate.clean(root);
            });
            return ko.cleanNode(node);
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
        resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent) {
            if (templateElement.render) {
                return this._templateEngineVDOM.resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent);
            }
            return this._templateEngineKO.resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent);
        }
        /**
         * Defines a special 'tracked' property on the target object. Mutating the tracked property will automatically update
         * the DOM previously produced by the .execute() method
         * @param {Object} target an object where the property is defined
         * @param {string} name property name
         * @param {*=} optional initial value
         * @param {Function=} optional listener for value changes. Note that the listener
         * will be invoked both for upsteream and downstream changes
         * @ignore
         */
        defineTrackableProperty(target, name, value, changeListener) {
            ojtemplateengineUtils.TemplateEngineUtils.createPropertyBackedByObservable(this._bindingProvider, target, name, value, changeListener);
        }
    }

    var index = new JetTemplateEngine();

    return index;

});
