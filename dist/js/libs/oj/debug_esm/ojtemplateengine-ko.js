/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { contextFor, computed, observable, applyBindingsToDescendants, pureComputed, utils, cleanNode } from 'knockout';
import BindingProviderImpl from 'ojs/ojkoshared';
import { TemplateEngineUtils, PreactTemplate } from 'ojs/ojtemplateengine-utils';
import oj from 'ojs/ojcore';
import { getTemplateContent } from 'ojs/ojhtmlutils';
import { CACHED_BINDING_PROVIDER, AttributeUtils } from 'ojs/ojcustomelement-utils';
import Context from 'ojs/ojcontext';
import { warn } from 'ojs/ojlogger';

const _propertyContribsCache = new WeakMap();
class TemplateEngineKoInternal {
    constructor() {
        this._bindingProvider = {
            __ContextFor: contextFor,
            __ExtendBindingContext: BindingProviderImpl.extendBindingContext,
            __KoComputed: computed,
            __Observable: observable
        };
    }
    executeTemplate(componentElement, templateElement, reportBusy, context, provided) {
        const tmpContainer = this._createAndPopulateContainer(templateElement, reportBusy);
        let stampedNodes = tmpContainer.childNodes;
        for (let i = 0; i < stampedNodes.length; i++) {
            const stampedNode = stampedNodes[i];
            stampedNode[CACHED_BINDING_PROVIDER] = 'knockout';
        }
        applyBindingsToDescendants(context, tmpContainer);
        return Array.prototype.slice.call(stampedNodes, 0);
    }
    resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent) {
        const templateAlias = templateElement.getAttribute('data-oj-as');
        const context = TemplateEngineUtils.getContext(this._bindingProvider, componentElement, templateElement, data, alias, templateAlias);
        const contribs = this._getPropertyContributorsViaCache(templateElement, context, elementTagName, propertySet, alternateParent || componentElement);
        return this._createComputed(contribs, context, propertyValidator);
    }
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
    _getPropertyEvaluatorMap(firstElem, propertySet, context) {
        var evalMap = new Map();
        var attrs = firstElem ? firstElem.attributes : [];
        for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            var prop = AttributeUtils.attributeToPropertyName(attr.name);
            var propTokens = prop.split('.');
            if (propertySet.has(propTokens[0])) {
                var info = AttributeUtils.getExpressionInfo(attr.value);
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
    _createComputed(contribs, context, propertyValidator) {
        const computed = pureComputed(() => {
            const boundValues = {};
            contribs.evalMap.forEach((evaluator, tokens) => {
                var leafValue = utils.unwrapObservable(evaluator(context));
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
    _wrap(delegate, methods) {
        const ret = {};
        methods.forEach((method) => {
            ret[method] = delegate[method].bind(delegate);
        });
        return ret;
    }
    _createAndPopulateContainer(templateElement, reportBusy) {
        var div = document.createElement('div');
        if (reportBusy) {
            div._ojReportBusy = reportBusy;
        }
        var nodes = getTemplateContent(templateElement);
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
    executeTemplate(componentElement, templateElement, reportBusy, context, provided) {
        const busyContext = Context.getContext(templateElement).getBusyContext();
        const customThrottle = (callback, timeout) => {
            let timeoutInstance;
            return () => {
                if (!timeoutInstance) {
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
        const computedVNode = pureComputed({
            read: () => {
                return templateElement.render(context.$current, provided);
            }
        })
            .extend({ rateLimit: { timeout: 0, method: customThrottle } });
        const vNode = computedVNode();
        PreactTemplate.extendTemplate(templateElement, PreactTemplate._ROW_CACHE_FACTORY, (renderer) => {
            templateElement._cachedRows.forEach((rowItem) => {
                let newVNode = renderer(rowItem.currentContext, provided);
                PreactTemplate.renderNodes(componentElement, newVNode, rowItem, provided);
            });
        });
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
        PreactTemplate.renderNodes(componentElement, vNode, cachedRow, provided);
        templateElement._cachedRows.push(cachedRow);
        computedVNode.subscribe((newVNode) => {
            const currRow = templateElement._cachedRows.find((row) => row.computedVNode === computedVNode);
            if (currRow) {
                if (!currRow.nodes[0].isConnected) {
                    warn(`PreactTemplateEngineKo subscription is called to replace disconnected row for the template slot \'${templateElement.slot}\' on ${componentElement.tagName}`);
                }
                PreactTemplate.renderNodes(componentElement, newVNode, currRow, provided);
            }
        });
        return cachedRow.nodes;
    }
    resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent) {
        const renderFunc = templateElement.render;
        const defaultProps = TemplateEngineUtils.getResolvedDefaultProps(this._defaultProps, elementTagName, propertySet);
        return PreactTemplate.resolveVDomTemplateProps(templateElement, renderFunc, elementTagName, propertySet, data, defaultProps, propertyValidator);
    }
}

class JetTemplateEngine {
    constructor() {
        this._bindingProvider = {
            __ContextFor: contextFor,
            __ExtendBindingContext: BindingProviderImpl.extendBindingContext,
            __KoComputed: computed,
            __Observable: observable
        };
        this._templateEngineKO = new TemplateEngineKoInternal();
        this._templateEngineVDOM = new TemplateEnginePreactInternal();
    }
    execute(componentElement, templateElement, properties, alias, reportBusy, provided) {
        const templateAlias = templateElement.getAttribute('data-oj-as');
        const context = TemplateEngineUtils.getContext(this._bindingProvider, componentElement, templateElement, properties, alias, templateAlias, provided);
        if (templateElement.render) {
            return this._templateEngineVDOM.executeTemplate(componentElement, templateElement, reportBusy, context, provided);
        }
        return this._templateEngineKO.executeTemplate(componentElement, templateElement, reportBusy, context, provided);
    }
    clean(node, componentElement) {
        let vdomTemplateRoots = PreactTemplate.findTemplateRoots(node, componentElement);
        vdomTemplateRoots.forEach((root) => {
            PreactTemplate.clean(root);
        });
        return cleanNode(node);
    }
    resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent) {
        if (templateElement.render) {
            return this._templateEngineVDOM.resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent);
        }
        return this._templateEngineKO.resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent);
    }
    defineTrackableProperty(target, name, value, changeListener) {
        TemplateEngineUtils.createPropertyBackedByObservable(this._bindingProvider, target, name, value, changeListener);
    }
}

var index = new JetTemplateEngine();

export default index;
