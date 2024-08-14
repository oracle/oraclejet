/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact', 'ojs/ojcore-base', 'ojs/ojcustomelement-utils', 'ojs/ojcustomelement-registry', 'ojs/ojmetadatautils', 'ojs/ojlogger'], function (exports, jsxRuntime, preact, oj, ojcustomelementUtils, ojcustomelementRegistry, ojmetadatautils, Logger) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    const ROW = Symbol('row');
    class PreactTemplate {
        static renderNodes(componentElement, vnode, row, provided) {
            const parentStub = row.parentStub;
            let retrieveNodes = () => Array.from(parentStub.childNodes);
            if (row.nodes) {
                retrieveNodes = PreactTemplate._getRetrieveNodesFunction(row.nodes);
            }
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
                console.error = oldConsole;
            }
            let textNodesOnly = true;
            const nodes = retrieveNodes();
            nodes.forEach((node) => {
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
            if (textNodesOnly) {
                componentElement.setAttribute('data-oj-vdom-template-text-roots', '');
            }
        }
        static clean(node) {
            const row = node[ROW];
            if (!row.cleaned) {
                row.cleaned = true;
                const reconnectNodes = PreactTemplate._getInsertNodesFunction(row.nodes);
                preact.render(null, row.parentStub);
                reconnectNodes(row.nodes);
                row.computedVNode?.dispose();
                const template = row.template;
                const index = template._cachedRows.indexOf(row);
                template._cachedRows.splice(index, 1);
            }
        }
        static findTemplateRoots(node, componentElement) {
            let vdomTemplateRoots = node && node.querySelectorAll
                ? Array.from(node.querySelectorAll('[data-oj-vdom-template-root=""]'))
                : [];
            if (node && node.hasAttribute && node.hasAttribute('data-oj-vdom-template-root')) {
                vdomTemplateRoots.push(node);
            }
            let findTextNodes = componentElement?.hasAttribute('data-oj-vdom-template-text-roots');
            if (!findTextNodes) {
                let containTextNodesOnly = node && node.querySelectorAll
                    ? node.querySelectorAll('[data-oj-vdom-template-text-roots=""]')
                    : [];
                findTextNodes = containTextNodesOnly.length > 0;
            }
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
        static _getInsertNodesFunction(oldNodes) {
            const lastNode = oldNodes[oldNodes.length - 1];
            const parentNode = lastNode.parentNode;
            const nextSibling = lastNode.nextSibling;
            return (nodes) => {
                nodes.forEach((node) => parentNode.insertBefore(node, nextSibling));
            };
        }
        static _getRetrieveNodesFunction(oldNodes) {
            const firstNode = oldNodes[0];
            const lastNode = oldNodes[oldNodes.length - 1];
            const parentNode = firstNode.parentNode;
            const previousSibling = firstNode.previousSibling;
            const nextSibling = lastNode.nextSibling;
            const firstNewNode = () => previousSibling ? previousSibling.nextSibling : parentNode.firstChild;
            return () => {
                const nodes = [];
                for (let node = firstNewNode(); node !== nextSibling; node = node.nextSibling) {
                    nodes.push(node);
                }
                return nodes;
            };
        }
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
                    props[prop] = ojcustomelementUtils.transformPreactValue(null, prop, ojmetadatautils.getPropertyMetadata(prop, metadata), value);
                }
            });
            return props;
        }
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

    class TemplateEngineUtils {
        static getContext(bindingProvider, componentElement, templateElement, properties, alias, templateAlias, provided) {
            if (bindingProvider) {
                let bindingContext = templateElement.__ojBindingContext
                    ? templateElement.__ojBindingContext
                    : bindingProvider.__ContextFor(templateElement);
                if (!bindingContext) {
                    Logger.info('Binding context not found when processing template for element with id: ' +
                        componentElement.id +
                        '. Using binding context for element instead.');
                    bindingContext = bindingProvider.__ContextFor(componentElement);
                }
                const extendedBindingContext = bindingProvider.__ExtendBindingContext(bindingContext, properties, alias, templateAlias, componentElement);
                if (extendedBindingContext['$provided'] && provided) {
                    const merged = new Map([...extendedBindingContext['$provided'], ...provided]);
                    extendedBindingContext['$provided'] = merged;
                }
                else if (provided) {
                    extendedBindingContext['$provided'] = provided;
                }
                return extendedBindingContext;
            }
            const context = {
                $current: properties
            };
            if (templateAlias) {
                context[templateAlias] = properties;
            }
            return context;
        }
        static getResolvedDefaultProps(defaultProps, elementTagName, propertySet) {
            let props = defaultProps.get(elementTagName);
            if (!props) {
                const elem = document.createElement(elementTagName);
                props = TemplateEngineUtils.getStaticPropertyMap(elem, propertySet, document.body);
                defaultProps.set(elementTagName, props);
            }
            return props;
        }
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
    }

    exports.PreactTemplate = PreactTemplate;
    exports.TemplateEngineUtils = TemplateEngineUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

});
