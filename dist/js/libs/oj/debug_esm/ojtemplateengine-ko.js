/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { contextFor, computed, observable, applyBindingsToDescendants, cleanNode, pureComputed, utils } from 'knockout';
import oj from 'ojs/ojcore';
import BindingProviderImpl from 'ojs/ojkoshared';
import { CACHED_BINDING_PROVIDER, AttributeUtils } from 'ojs/ojcustomelement-utils';
import { getTemplateContent } from 'ojs/ojhtmlutils';
import { TemplateEngineUtils } from 'ojs/ojtemplateengine-utils';

const _propertyContribsCache = new WeakMap();
class JetTemplateEngine {
    constructor() {
        this._bindingProvider = {
            __ContextFor: contextFor,
            __ExtendBindingContext: BindingProviderImpl.extendBindingContext,
            __KoComputed: computed,
            __Observable: observable
        };
    }
    execute(componentElement, templateElement, properties, alias, reportBusy) {
        const templateAlias = templateElement.getAttribute('data-oj-as');
        const context = TemplateEngineUtils.getContext(this._bindingProvider, componentElement, templateElement, properties, alias, templateAlias);
        if (templateElement.render) {
            throw new Error(`The render property is not expected on the template for component ${componentElement.id}`);
        }
        const tmpContainer = this._createAndPopulateContainer(templateElement, reportBusy);
        let stampedNodes = tmpContainer.childNodes;
        for (let i = 0; i < stampedNodes.length; i++) {
            const stampedNode = stampedNodes[i];
            stampedNode[CACHED_BINDING_PROVIDER] = 'knockout';
        }
        applyBindingsToDescendants(context, tmpContainer);
        return Array.prototype.slice.call(stampedNodes, 0);
    }
    clean(node) {
        return cleanNode(node);
    }
    resolveProperties(componentElement, templateElement, elementTagName, propertySet, data, alias, propertyValidator, alternateParent) {
        if (templateElement.render) {
            throw new Error(`The render property is not expected on the template for component ${componentElement.id}`);
        }
        const templateAlias = templateElement.getAttribute('data-oj-as');
        const context = TemplateEngineUtils.getContext(this._bindingProvider, componentElement, templateElement, data, alias, templateAlias);
        const contribs = this._getPropertyContributorsViaCache(templateElement, context, elementTagName, propertySet, alternateParent || componentElement);
        return this._createComputed(contribs, context, propertyValidator);
    }
    defineTrackableProperty(target, name, value, changeListener) {
        TemplateEngineUtils.createPropertyBackedByObservable(this._bindingProvider, target, name, value, changeListener);
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
    _wrap(delegate, methods) {
        const ret = {};
        methods.forEach((method) => {
            ret[method] = delegate[method].bind(delegate);
        });
        return ret;
    }
    _createAndPopulateContainer(node, reportBusy) {
        var div = document.createElement('div');
        if (reportBusy) {
            div._ojReportBusy = reportBusy;
        }
        var nodes = getTemplateContent(node);
        for (var i = 0; i < nodes.length; i++) {
            div.appendChild(nodes[i]);
        }
        return div;
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
}

var index = new JetTemplateEngine();

export default index;
