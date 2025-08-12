/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact', 'ojs/ojcore-base', 'ojs/ojcustomelement-utils', 'ojs/ojcustomelement-registry', 'ojs/ojmetadatautils', 'ojs/ojlogger'], function (exports, jsxRuntime, preact, oj, ojcustomelementUtils, ojcustomelementRegistry, ojmetadatautils, Logger) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    const ROW = Symbol('row');
    class PreactTemplate {
        /**
         * Renders virtual nodes into parentStub element
         * @param componentElement
         * @param vnode
         * @param row
         * @param provided
         */
        static renderNodes(componentElement, vnode, row, provided) {
            const parentStub = row.parentStub;
            let retrieveNodes = () => Array.from(parentStub.childNodes);
            if (row.nodes) {
                // This is an update case.  We want to:
                // 1.  Store the nodes before and after the set of old DOM nodes
                // 2.  Let Preact render "into" the stub (Preact will actually just patch the nodes in place when called this way)
                // 3.  Use the before/after nodes (which should be unchanged) to retrieve the new set of rendered nodes
                // Note that we assume that the DOM nodes returned by an execute call are
                // inserted all together under a single parent node by the calling component.
                retrieveNodes = PreactTemplate._getRetrieveNodesFunction(row.nodes);
            }
            // JET-49840 - using rowTemplate within oj-table logs a console error.
            // The error is benign. Lets supress it, then return console.error to origin.
            const oldConsole = console.error;
            console.error = (msg, optionalParams) => {
                if (msg.indexOf('Improper nesting of table.') === -1) {
                    oldConsole.apply(console, arguments);
                }
            };
            try {
                const contextWrappers = provided
                    ? Array.from(provided).reduce((acc, [context, value]) => {
                        return jsxRuntime.jsx(context.Provider, { value: value, children: acc });
                    }, vnode)
                    : vnode;
                preact.render(contextWrappers, parentStub);
            }
            finally {
                // Set console.error back to origin.
                console.error = oldConsole;
            }
            let textNodesOnly = true;
            const nodes = retrieveNodes();
            nodes.forEach((node) => {
                // Add an attribute to recognize the content during clean() and a backpointer
                // to the associated row
                if (node.setAttribute) {
                    node.setAttribute('data-oj-vdom-template-root', '');
                    textNodesOnly = false;
                }
                else {
                    node['_oj_vdom_template_root'] = true;
                }
                node[ROW] = row;
                node[ojcustomelementUtils.CACHED_BINDING_PROVIDER] = 'preact';
            });
            row.vnode = vnode;
            row.nodes = nodes;
            // Set the attribute on the component to optimize the template roots search in
            // findTemplateRoots().
            if (textNodesOnly) {
                componentElement.setAttribute('data-oj-vdom-template-text-roots', '');
            }
        }
        static clean(node) {
            const row = node[ROW];
            // A single row might render multiple physical DOM nodes
            // ensure the row is only cleaned once
            if (row && !row.cleaned) {
                row.cleaned = true;
                // Components don't expect that calling clean on the template engine will result in
                // the cleaned nodes being disconnected, but that's what calling render(null) will do
                // In order to avoid violating this expectation, we'll reconnect the nodes in their
                // original location after the render(null) call.
                const reconnectNodes = PreactTemplate._getInsertNodesFunction(row.nodes);
                preact.render(null, row.parentStub);
                reconnectNodes(row.nodes);
                row.computedVNode?.dispose();
                const template = row.template;
                const index = template._cachedRows.indexOf(row);
                template._cachedRows.splice(index, 1);
                node[ROW] = null;
            }
        }
        /**
         * This method finds template roots under the given parent element.
         * The roots are found either by data-oj-vdom-template-root attribute or by _oj_vdom_template_root
         * property that were set directly on the node that does not accept attributes.
         * @param node
         * @param componentElement
         * @ignore
         */
        static findTemplateRoots(node, componentElement) {
            // Search for nodes created with VDom methods and let PreactTemplate clean them.
            // Note, if the roots are found then we don't have to search for the text siblings because
            // the entire row is cleaned for the given root. See the clean() method above.
            let vdomTemplateRoots = node && node.querySelectorAll
                ? Array.from(node.querySelectorAll('[data-oj-vdom-template-root=""]'))
                : [];
            // Add the node itself to the array if it has the data-oj-vdom-template-root attribute
            if (node && node.hasAttribute && node.hasAttribute('data-oj-vdom-template-root')) {
                vdomTemplateRoots.push(node);
            }
            // Handle the use-case where the given node has content from multiple templates or
            // mixed content from multiple rows from a single template.
            // Find if the components involved in given DOM branch executed templates with text only output.
            let findTextNodes = componentElement?.hasAttribute?.('data-oj-vdom-template-text-roots');
            if (!findTextNodes) {
                let containTextNodesOnly = node && node.querySelectorAll
                    ? node.querySelectorAll('[data-oj-vdom-template-text-roots=""]')
                    : [];
                findTextNodes = containTextNodesOnly.length > 0;
            }
            // Search for the potential text nodes that might make up the template - case when the template has text nodes only.
            if (findTextNodes) {
                const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
                let currentNode = treeWalker.currentNode;
                while (currentNode) {
                    if (currentNode['_oj_vdom_template_root']) {
                        vdomTemplateRoots.push(currentNode);
                    }
                    currentNode = treeWalker.nextNode();
                }
            }
            return vdomTemplateRoots;
        }
        // Given an array of connected nodes, returns a function that will insert
        // an array of nodes (could be the same array or a different array) at the
        // same location
        static _getInsertNodesFunction(oldNodes) {
            const lastNode = oldNodes[oldNodes.length - 1];
            const parentNode = lastNode.parentNode;
            const nextSibling = lastNode.nextSibling;
            return (nodes) => {
                nodes.forEach((node) => parentNode.insertBefore(node, nextSibling));
            };
        }
        // Given an array of connected nodes, determines the nodes immediately preceding
        // and following and returns a function that will return an array of the nodes
        // between these two nodes (i.e. after they've been updated by Preact)
        static _getRetrieveNodesFunction(oldNodes) {
            const firstNode = oldNodes[0];
            const lastNode = oldNodes[oldNodes.length - 1];
            const parentNode = firstNode.parentNode;
            const previousSibling = firstNode.previousSibling;
            const nextSibling = lastNode.nextSibling;
            // if oldNodes appear at the beginning of parentNode's children, previousSibling will be undefined
            // in that case, parentNode's firstChild will be the first of our newly rendered nodes, otherwise
            // the next sibling of the (non-null) previousSibling will be.
            const firstNewNode = () => previousSibling ? previousSibling.nextSibling : parentNode.firstChild;
            // note that in either case, it is possible for the render call to result in an empty set of nodes.
            // in that scenario, regardless of how the first "new" node is retrieved, it will actually be equal to
            // nextSibling, causing the loop below to immediately terminate
            return () => {
                const nodes = [];
                for (let node = firstNewNode(); node !== nextSibling; node = node.nextSibling) {
                    nodes.push(node);
                }
                return nodes;
            };
        }
        /**
         * @param {Element} template element
         * @param {Function} renderer - a function that will render the template
         * @param {string} elementTagName - tag name of the element where the resolved properties are read from
         * @param {Set<string>} propertySet - properties to be resolved
         * @param {any} data to be passed to the render function
         * @param {{string: any}} default property values
         * @param {Function} propertyValidator - function to validate resolved properties
         * @return an object that implements peek(), subscribe() and dispose() for retrieving the value,
         * being notified of value changes and removing the subscription
         * @ignore
         */
        static resolveVDomTemplateProps(template, renderer, elementTagName, propertySet, data, defaultValues, propertyValidator) {
            const metadata = ojcustomelementRegistry.getPropertiesForElementTag(elementTagName);
            const [cache, deleteEntry] = PreactTemplate.extendTemplate(template, PreactTemplate._COMPUTED_PROPS_CACHE_FACTORY, (recalc) => {
                for (const observable of cache) {
                    observable.recalculateValue(recalc);
                }
            });
            const calcValue = (render) => PreactTemplate._computeProps(render, elementTagName, metadata, propertySet, data, propertyValidator);
            const item = new ObservableProperty(calcValue, renderer, defaultValues, deleteEntry);
            cache.add(item);
            return item;
        }
        static _computeProps(renderer, elementTagName, metadata, propertySet, data, propertyValidator) {
            const result = renderer(data);
            const vnodes = Array.isArray(result) ? result : [result];
            const targetNode = vnodes.find((n) => n.type === elementTagName);
            if (!targetNode) {
                throw new Error(`Item template must contain an element named {elementTagName}`);
            }
            const props = {};
            const vprops = targetNode.props;
            Object.keys(vprops).forEach((origProp) => {
                const { prop, value } = ojcustomelementUtils.convertPrivatePropFromPreact(origProp, targetNode.props[origProp]);
                if (propertySet.has(prop)) {
                    // VDOM property names must not '.'' separators, so the property name array
                    // will always have a single element
                    // TODO: Uncomment the following line once dvt-base fixes the issue with the property
                    // validator implementation looking for a physical template child like <oj-chart-item>
                    // propertyValidator?.([prop], val);
                    props[prop] = ojcustomelementUtils.transformPreactValue(null, prop, ojmetadatautils.getPropertyMetadata(prop, metadata), value);
                }
            });
            return props;
        }
        /**
         * The method is handles templates used inside VComponents by the regular custom elements.
         * The '_cachedRows' property is added to the template to store all the processed nodes and
         * the setter/getter methods are added for 'render' property in order to update nodes
         * created with this template.
         * @param {Element} node the <template> element
         * @param {Function} initialCacheFactory - a function returning the initial cache value
         * @param {Function} a callback invoked when the 'render' property is set
         * @return item cache
         * @ignore
         */
        static extendTemplate(node, initialCacheFactory, onRenderChanged) {
            if (!node._cachedRows) {
                let fn = node.render;
                Object.defineProperties(node, {
                    _cachedRows: { writable: true, value: initialCacheFactory() },
                    render: {
                        enumerable: true,
                        get() {
                            return fn;
                        },
                        set(renderCallback) {
                            fn = renderCallback;
                            if (renderCallback) {
                                onRenderChanged(renderCallback);
                            }
                        }
                    }
                });
            }
            return node._cachedRows;
        }
    }
    PreactTemplate._COMPUTED_PROPS_CACHE_FACTORY = () => {
        const cache = new Set();
        return [cache, cache.delete.bind(cache)];
    };
    PreactTemplate._ROW_CACHE_FACTORY = () => [];
    class ObservableProperty {
        constructor(calculate, renderer, defaultProps, disposeCallback) {
            this._calculate = calculate;
            this._defaultProps = defaultProps;
            this._disposeCallback = disposeCallback;
            this._value = calculate(renderer);
            this._merged = this._getMergedValue(this._value);
        }
        peek() {
            return this._merged;
        }
        subscribe(sub) {
            if (this._sub) {
                throw new Error('Resolved property observable does not support multiple subscribers');
            }
            this._sub = sub;
        }
        dispose() {
            this._disposeCallback(this);
        }
        recalculateValue(renderer) {
            const val = this._calculate(renderer);
            const old = this._value;
            this._value = val;
            if (this._sub && !oj.Object.compareValues(val, old)) {
                this._merged = this._getMergedValue(val);
                this._sub(this._merged);
            }
        }
        _getMergedValue(val) {
            return Object.assign({}, this._defaultProps, val);
        }
    }

    const _SAVED_NODES_ID = 'savedNodesId';
    class TemplateEngineUtils {
        /**
         * Gets binding context for the template element.
         * @param bindingProvider Object that contains a subset of ko methods
         * @param componentElement Component element
         * @param templateElement The <template> element
         * @param properties Data to be applied to the template
         * @param alias An alias for referencing the data within a template
         * @param templateAlias  An additional alias to provide to the template children
         *    defined as data-oj-as attribute on the template
         * @returns {object} binding context for the template
         * @ignore
         */
        static getContext(bindingProvider, componentElement, templateElement, properties, alias, templateAlias, provided) {
            if (bindingProvider) {
                // Always use the binding context for the template  element
                // Note: the context for oj_bind_for_each template is stored on __ojBindingContext property.
                let bindingContext = templateElement.__ojBindingContext
                    ? templateElement.__ojBindingContext
                    : bindingProvider.__ContextFor(templateElement);
                // In the rare case it's not defined, check the componentElement and log a message
                if (!bindingContext) {
                    Logger.info('Binding context not found when processing template for element with id: ' +
                        componentElement.id +
                        '. Using binding context for element instead.');
                    bindingContext = bindingProvider.__ContextFor(componentElement);
                }
                const extendedBindingContext = bindingProvider.__ExtendBindingContext(bindingContext, properties, alias, templateAlias, componentElement);
                // Merge $provided contexts if the 'provided' argument is given.
                if (extendedBindingContext['$provided'] && provided) {
                    const merged = new Map([...extendedBindingContext['$provided'], ...provided]);
                    extendedBindingContext['$provided'] = merged;
                }
                else if (provided) {
                    extendedBindingContext['$provided'] = provided;
                }
                return extendedBindingContext;
            }
            // Build the context object out of 'properties' when ko and BindingProviderImpl modules are not present.
            const context = {
                $current: properties
            };
            if (templateAlias) {
                context[templateAlias] = properties;
            }
            return context;
        }
        /**
         *
         * @param defaultProps
         * @param elementTagName
         * @param propertySet
         * @ignore
         */
        static getResolvedDefaultProps(defaultProps, elementTagName, propertySet) {
            let props = defaultProps.get(elementTagName);
            if (!props) {
                const elem = document.createElement(elementTagName); // @HTMLUpdateOK element tag name will always be one of JET elements
                props = TemplateEngineUtils.getStaticPropertyMap(elem, propertySet, document.body);
                defaultProps.set(elementTagName, props);
            }
            return props;
        }
        /**
         *
         * @param firstElem
         * @param propertySet
         * @param parent
         * @ignore
         */
        static getStaticPropertyMap(firstElem, propertySet, parent) {
            const staticMap = {};
            if (firstElem) {
                const st = firstElem.style;
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
         * @param bindingProvider
         * @param target
         * @param name
         * @param value
         * @param changeListener
         * @ignore
         */
        static createPropertyBackedByObservable(bindingProvider, target, name, value, changeListener) {
            const obs = bindingProvider.__Observable(value);
            Object.defineProperty(target, name, {
                get: () => obs(),
                set: (val) => {
                    obs(val);
                    if (changeListener) {
                        changeListener(val);
                    }
                },
                enumerable: true
            });
        }
        /**
         * Utility method that generates unique id, reads, removes from dom and stores child nodes in a shared map.
         * @param replacementMap
         * @param node
         * @returns {string} unique id used to create a comment node for ij-bind-if
         * @ignore
         */
        static _storeBindIfChildNodes(replacementMap, node) {
            const savedNodesId = _SAVED_NODES_ID + ojcustomelementUtils.ElementUtils.getUniqueId(null);
            const childNodes = [];
            while (node.childNodes.length > 0) {
                var child = node.childNodes[0];
                childNodes.push(document.importNode(child, true));
                node.removeChild(child);
            }
            replacementMap.set(savedNodesId, childNodes);
            return savedNodesId;
        }
        /**
         * Converts oj-bind-if node to a comment nodes and stores children in a shared map.
         * @param replacementMap
         * @param node
         * @param nodeName
         * @ignore
         */
        static _processOjBindIf(replacementMap, node, nodeName) {
            // Build ko comment node based on _ojBindIf_V2_ object value, that
            // contains test expression and nodes that will be added to the binding context.
            const expr = ojcustomelementUtils.KoBindingUtils.getExpressionForAttr(node, 'test', false);
            const savedNodesId = TemplateEngineUtils._storeBindIfChildNodes(replacementMap, node);
            const bindingStr = `ko _ojBindIf_V2_:{ test:${expr}, nodes:$current._ojNodesMap.${savedNodesId}, ojDoNotUseProcessed:true }`;
            TemplateEngineUtils._replaceBindElementWithComments(node, nodeName, bindingStr);
        }
        /**
         * Updates oj-if node by adding data that point to external nodes that used as child dom,
         * saves child dom in a shared map.
         * @param replacementMap
         * @param node
         * @ignore
         */
        static _processOjIf(replacementMap, node) {
            const savedNodesId = TemplateEngineUtils._storeBindIfChildNodes(replacementMap, node);
            node.setAttribute('oj-private-do-not-use', `$current._ojNodesMap.${savedNodesId}`);
        }
        /**
         * Converts oj-bind-text into comment node.
         * @param replacementMap
         * @param node
         * @param nodeName
         * @ignore
         */
        static _processOjBindText(replacementMap, node, nodeName) {
            const expr = ojcustomelementUtils.KoBindingUtils.getExpressionForAttr(node, 'value', true);
            const bindingStr = `ko text:${expr}`;
            TemplateEngineUtils._replaceBindElementWithComments(node, nodeName, bindingStr);
        }
        /**
         * Converts oj-bind-for-each into comment node.
         * @param replacementMap
         * @param node
         * @param nodeName
         * @ignore
         */
        static _processOjBindForEach(replacementMap, node, nodeName) {
            const bindingStr = ojcustomelementUtils.KoBindingUtils.createBindForEachHandlerStr(node);
            if (!bindingStr) {
                return;
            }
            TemplateEngineUtils._replaceBindElementWithComments(node, nodeName, bindingStr);
        }
        /**
         * Helper method that replaces given oj-bind-x element with comment nodes.
         * @param node
         * @param nodeName
         * @param bindingString
         * @ignore
         */
        static _replaceBindElementWithComments(node, nodeName, bindingString) {
            // Build a wrapper comment around ko comment node
            // with all of the attribute info that was on the original DOM node.
            const ojOpenComment = document.createComment(ojcustomelementUtils.KoBindingUtils.getNodeReplacementCommentStr(node));
            const ojCloseComment = document.createComment('/' + nodeName);
            const koOpenComment = document.createComment(bindingString);
            const koCloseComment = document.createComment('/ko');
            // Replace the original node with comment nodes, remove and store child nodes on the replacementMap object
            const parent = node.parentNode;
            parent.insertBefore(ojOpenComment, node); // @HTMLUpdateOK
            parent.insertBefore(koOpenComment, node); // @HTMLUpdateOK
            // Copy oj-bind-for-each children into the comment node
            if (nodeName === 'oj-bind-for-each') {
                while (node.childNodes.length > 0) {
                    const child = node.childNodes[0];
                    parent.insertBefore(child, node); // @HTMLUpdateOK
                }
            }
            parent.insertBefore(koCloseComment, node); // @HTMLUpdateOK
            parent.replaceChild(ojCloseComment, node);
        }
        /**
         * The method recursively walks the template nodes passing context object to each level of nodes.
         * The context object contains a shared map of 'unique key -> nodes[]' and number used to generate a unique key.
         * @param replacementMap node replacement map passed into recursive node walk
         * @param nodes nodes to process
         * @ignore
         */
        static _processBindElements(replacementMap, nodes) {
            nodes.forEach((node) => {
                TemplateEngineUtils._processBindElements(replacementMap, Array.from(node.childNodes));
                if (node.nodeType === 1) {
                    // Replace oj-bind-if node with comment nodes
                    const nodeName = node.tagName?.toLowerCase();
                    switch (nodeName) {
                        case 'oj-bind-if':
                            TemplateEngineUtils._processOjBindIf(replacementMap, node, nodeName);
                            break;
                        case 'oj-if':
                            TemplateEngineUtils._processOjIf(replacementMap, node);
                            break;
                        case 'oj-bind-text':
                            TemplateEngineUtils._processOjBindText(replacementMap, node, nodeName);
                            break;
                        case 'oj-bind-for-each':
                            TemplateEngineUtils._processOjBindForEach(replacementMap, node, nodeName);
                            break;
                    }
                }
            });
        }
        /**
         * Process a template element in order to optimize performance and resource usage
         * - save child nodes of oj-bind-if and oj-if elements on a template in order to share
         *   them between rows instead of keeping a copy for each row
         * - replace oj-bind-if with comment nodes on the template and avoid running
         *   this step for each row
         * @param templateElement The <template> element
         * @returns {object} object that contains template copy and node replacement map
         * @ignore
         */
        static processTemplate(templateElement) {
            if (templateElement.render) {
                return;
            }
            if (!templateElement['_replacedNodes']) {
                const replacementMap = new Map();
                const templateCopy = document.importNode(templateElement, true);
                Object.defineProperty(templateElement, '_replacedNodes', {
                    writable: true,
                    value: { templateCopy, replacementMap }
                });
                TemplateEngineUtils._processBindElements(replacementMap, Array.from(templateCopy.content.childNodes));
            }
            return templateElement['_replacedNodes'];
        }
    }

    exports.PreactTemplate = PreactTemplate;
    exports.TemplateEngineUtils = TemplateEngineUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

});
