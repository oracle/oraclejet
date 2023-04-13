/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { render } from 'preact';
import oj from 'ojs/ojcore-base';
import { CACHED_BINDING_PROVIDER, transformPreactValue } from 'ojs/ojcustomelement-utils';
import { getPropertiesForElementTag } from 'ojs/ojcustomelement-registry';
import { getPropertyMetadata } from 'ojs/ojmetadatautils';
import { info } from 'ojs/ojlogger';

const ROW = Symbol('row');
class PreactTemplate {
    static renderNodes(vnode, row) {
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
            render(vnode, parentStub);
        }
        finally {
            console.error = oldConsole;
        }
        const nodes = retrieveNodes();
        nodes.forEach((node) => {
            if (node.setAttribute) {
                node.setAttribute('data-oj-vdom-template-root', '');
            }
            else {
                node['_oj_vdom_template_root'] = true;
            }
            node[ROW] = row;
            node[CACHED_BINDING_PROVIDER] = 'preact';
        });
        row.vnode = vnode;
        row.nodes = nodes;
    }
    static clean(node) {
        var _a;
        const row = node[ROW];
        if (!row.cleaned) {
            row.cleaned = true;
            const reconnectNodes = PreactTemplate._getInsertNodesFunction(row.nodes);
            render(null, row.parentStub);
            reconnectNodes(row.nodes);
            (_a = row.computedVNode) === null || _a === void 0 ? void 0 : _a.dispose();
            const template = row.template;
            const index = template._cachedRows.indexOf(row);
            template._cachedRows.splice(index, 1);
        }
    }
    static findTemplateRoots(node) {
        let vdomTemplateRoots = node && node.querySelectorAll
            ? Array.from(node.querySelectorAll('[data-oj-vdom-template-root=""]'))
            : [];
        if (node && node.hasAttribute && node.hasAttribute('data-oj-vdom-template-root')) {
            vdomTemplateRoots.push(node);
        }
        if (vdomTemplateRoots.length === 0) {
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
        const metadata = getPropertiesForElementTag(elementTagName);
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
        Object.keys(vprops).forEach((prop) => {
            if (propertySet.has(prop)) {
                props[prop] = transformPreactValue(null, getPropertyMetadata(prop, metadata), targetNode.props[prop]);
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
    static getContext(bindingProvider, componentElement, templateElement, properties, alias, templateAlias) {
        if (bindingProvider) {
            let bindingContext = templateElement.__ojBindingContext
                ? templateElement.__ojBindingContext
                : bindingProvider.__ContextFor(templateElement);
            if (!bindingContext) {
                info('Binding context not found when processing template for element with id: ' +
                    componentElement.id +
                    '. Using binding context for element instead.');
                bindingContext = bindingProvider.__ContextFor(componentElement);
            }
            return bindingProvider.__ExtendBindingContext(bindingContext, properties, alias, templateAlias, componentElement);
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

export { PreactTemplate, TemplateEngineUtils };
