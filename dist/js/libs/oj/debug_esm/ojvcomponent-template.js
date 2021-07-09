/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { info } from 'ojs/ojlogger';
import { getTemplateContent } from 'ojs/ojhtmlutils';
import CspExpressionEvaluator from 'ojs/ojcspexpressionevaluator';
import { CustomElementUtils, AttributeUtils } from 'ojs/ojcustomelement-utils';
import { Component, h, Fragment, render } from 'preact';
import { executeFragment as executeFragment$1 } from 'ojs/ojvcomponent-template';
import Context from 'ojs/ojcontext';
import { withDataProvider } from 'ojs/ojdataproviderhandler';

class Props {
}
class BindDom extends Component {
    constructor(props) {
        super(props);
        this._resolveConfig = (configPromise) => {
            configPromise.then((result) => {
                if (configPromise === this.props.config) {
                    this.setState({ view: this._getFragment(result.view), data: result.data });
                }
            });
        };
        this._getFragment = (nodes) => {
            const fragment = new DocumentFragment();
            nodes.forEach((node) => {
                fragment.appendChild(node.cloneNode(this));
            });
            return fragment;
        };
        this.state = { view: null, data: null };
    }
    componentDidMount() {
        this._resolveConfig(this.props.config);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.config !== prevProps.config) {
            this._resolveConfig(this.props.config);
        }
    }
    render() {
        return (h(Fragment, null, this.state.view && this.state.data
            ? executeFragment$1(null, this.state.view, this.state.data, this.forceUpdate.bind(this), this.props.bindingProvider)
            : null));
    }
}

class BindForEachWrapper extends Component {
    constructor(props) {
        super(props);
        this._addBusyState = (description) => {
            const busyContext = Context.getContext(this.props.componentElement).getBusyContext();
            return busyContext.addBusyState({ description });
        };
        this.BindForEachWithDP = withDataProvider(BindForEachDataUnwrapper, 'data');
    }
    render(props) {
        if (Array.isArray(props.data)) {
            return h(BindForEachWithArray, { data: props.data, itemRenderer: props.itemRenderer });
        }
        else {
            return (h(this.BindForEachWithDP, { addBusyState: this._addBusyState, data: props.data, itemRenderer: props.itemRenderer }));
        }
    }
}
class BindForEachDataUnwrapper extends Component {
    render(props) {
        const unwrappedData = props.data.map((item) => item.data);
        return h(BindForEachWithArray, { data: unwrappedData, itemRenderer: props.itemRenderer });
    }
}
class BindForEachWithArray extends Component {
    render() {
        const data = this.props.data;
        return (h(Fragment, null, data
            ? data.map((row, index) => {
                return this.props.itemRenderer({
                    data: row,
                    index: index,
                    observableIndex: () => index
                });
            })
            : []));
    }
}

const BINDING_PROVIDER = Symbol();
const COMPONENT_ELEMENT = Symbol();
const UNWRAP_EXTRAS = Symbol();
class VTemplateEngine {
    constructor() {
        this._templateAstCache = new WeakMap();
        this._cspEvaluator = new CspExpressionEvaluator();
    }
    static cleanupTemplateCache(templateElement) {
        if (templateElement && templateElement['_cachedRows']) {
            templateElement['_cachedRows'].forEach((entry) => entry.dispose());
            templateElement['_cachedRows'] = [];
        }
    }
    executeFragment(componentElement, fragment, properties, mutationCallback, bindingProviderForFragment) {
        var _a;
        let bindingProvider = bindingProviderForFragment;
        if (!bindingProvider) {
            bindingProvider = componentElement
                ? (_a = CustomElementUtils.getElementState(componentElement)) === null || _a === void 0 ? void 0 : _a.getBindingProvider()
                : null;
        }
        return this._execute({ [BINDING_PROVIDER]: bindingProvider, [COMPONENT_ELEMENT]: componentElement }, fragment, properties, mutationCallback);
    }
    execute(componentElement, templateElement, properties, bindingProvider, mutationCallback) {
        const templateAlias = templateElement.getAttribute('data-oj-as');
        const context = this._getContext(bindingProvider, componentElement, templateElement, properties, templateAlias);
        return this._execute({ [BINDING_PROVIDER]: bindingProvider, [COMPONENT_ELEMENT]: componentElement }, templateElement, context, mutationCallback);
    }
    _execute(engineContext, templateElement, context, mutationCallback) {
        const ast = this._getAstViaCache(engineContext, templateElement);
        const bindingProvider = engineContext[BINDING_PROVIDER];
        if (bindingProvider) {
            if (!templateElement['_cachedRows']) {
                Object.defineProperties(templateElement, {
                    _cachedRows: { writable: true, value: [] }
                });
            }
            const computedVNodes = bindingProvider.__KoComputed(() => {
                if (bindingProvider.__KoIsInitial()) {
                    return this._cspEvaluator.evaluate(ast, { $context: context, $h: h, BindDom });
                }
                VTemplateEngine.cleanupTemplateCache(templateElement);
                mutationCallback();
            });
            templateElement['_cachedRows'].push(computedVNodes);
            return computedVNodes();
        }
        return this._cspEvaluator.evaluate(ast, { $context: context, $h: h, BindDom });
    }
    _getContext(bindingProvider, componentElement, node, properties, templateAlias) {
        if (bindingProvider) {
            let bindingContext = bindingProvider.__ContextFor(node);
            if (!bindingContext) {
                info(`Binding context not found when processing template for element with id: ${componentElement.id}. Using binding context for element instead.`);
                bindingContext = bindingProvider.__ContextFor(componentElement);
            }
            return bindingProvider.__ExtendBindingContext(bindingContext, properties, null, templateAlias, componentElement);
        }
        const context = {
            $current: properties
        };
        if (templateAlias) {
            context[templateAlias] = properties;
        }
        return context;
    }
    _getAstViaCache(engineContext, template) {
        let ast = this._templateAstCache.get(template);
        if (!ast) {
            if (template.nodeType === 11) {
                ast = this._createAst(engineContext, Array.from(template.childNodes));
            }
            else {
                const docFragment = getTemplateContent(template)[0];
                ast = this._createAst(engineContext, Array.from(docFragment.childNodes));
            }
            this._templateAstCache.set(template, ast);
        }
        return ast;
    }
    _createAst(engineContext, nodes) {
        const arrayNode = { type: 9, elements: [] };
        arrayNode.elements = Array.prototype.reduce.call(nodes, (acc, node) => {
            const special = this._processSpecialNodes(engineContext, node);
            if (special) {
                acc.push(special);
            }
            else if (node.nodeType === 3) {
                acc.push({ type: 3, value: node.nodeValue });
            }
            else if (node.nodeType === 1) {
                acc.push(this._createElementNode(engineContext, node));
            }
            return acc;
        }, []);
        return arrayNode;
    }
    _processSpecialNodes(engineContext, node) {
        if (node.nodeType === 1) {
            switch (node.tagName.toLowerCase()) {
                case 'oj-bind-text':
                    return this._createExpressionNode(engineContext, node.getAttribute('value'));
                case 'oj-bind-if':
                    return this._createIfExpressionNode(engineContext, node);
                case 'oj-bind-for-each':
                    return this._createBindForEachExpressionNode(engineContext, node);
                case 'oj-bind-dom':
                    return this._createBindDomExpressionNode(engineContext, node);
                case 'oj-defer':
                    return this._createDeferNode(engineContext, node);
            }
        }
        return null;
    }
    _createDeferContent(engineContext, nodes, context) {
        const bindDomConfig = { view: nodes, data: context };
        const bindDomProps = {
            config: Promise.resolve(bindDomConfig),
            bindingProvider: engineContext[BINDING_PROVIDER]
        };
        return h(BindDom, bindDomProps);
    }
    _createDeferNode(engineContext, node) {
        let deferContent = this._createDeferContent(engineContext, [], {});
        let deferNode;
        const deferProps = [
            {
                key: 'ref',
                value: {
                    type: 3,
                    value: (refObj) => {
                        if (refObj) {
                            deferNode = refObj;
                            render(deferContent, deferNode);
                        }
                        else {
                            render(null, deferNode);
                        }
                    }
                }
            },
            {
                key: '_activateSubtree',
                value: this._createCallNodeWithContext((context) => {
                    return (parentNode) => {
                        deferContent = this._createDeferContent(engineContext, Array.from(node.childNodes), context);
                        render(deferContent, parentNode);
                    };
                })
            }
        ];
        let props = this._getElementProps(engineContext, node);
        props = props.concat(deferProps);
        return {
            type: 4,
            callee: {
                type: 1,
                name: '$h'
            },
            arguments: [
                {
                    type: 3,
                    value: 'oj-defer'
                },
                {
                    type: 10,
                    properties: props
                }
            ]
        };
    }
    _createIfExpressionNode(engineContext, node) {
        if (!node.hasAttribute('test')) {
            throw new Error("Missing the retuired 'test' attribute on <oj-bind-if>");
        }
        return {
            type: 5,
            operator: '...',
            argument: {
                type: 8,
                test: this._createExpressionNode(engineContext, node.getAttribute('test')),
                consequent: this._createAst(engineContext, Array.from(node.childNodes)),
                alternate: {
                    type: 3,
                    value: []
                }
            }
        };
    }
    _createBindForEachExpressionNode(engineContext, node) {
        const template = node.getElementsByTagName('template')[0];
        if (!template) {
            throw new Error('Template not found: oj-bind-for-each requires a single template element as its direct child');
        }
        return this._createComponentNode(engineContext, node, BindForEachWrapper, [
            {
                key: 'itemRenderer',
                value: this._createNestedTemplateRendererNode(engineContext, template)
            },
            {
                key: 'componentElement',
                value: { type: 3, value: engineContext[COMPONENT_ELEMENT] }
            }
        ]);
    }
    _createNestedTemplateRendererNode(engineContext, template) {
        const templateAlias = template.getAttribute('data-oj-as');
        const foreachEngineContext = {
            [BINDING_PROVIDER]: engineContext[BINDING_PROVIDER],
            [COMPONENT_ELEMENT]: engineContext[COMPONENT_ELEMENT],
            [UNWRAP_EXTRAS]: (exp, value) => {
                if (typeof value === 'function' &&
                    (exp === '$current.observableIndex' || exp === `${templateAlias}.observableIndex`)) {
                    return value();
                }
                return value;
            }
        };
        const ast = this._getAstViaCache(foreachEngineContext, template);
        return this._createCallNodeWithContext(($context) => {
            return (props) => {
                const extension = { $current: props };
                if (templateAlias != null) {
                    extension[templateAlias] = props;
                }
                const context = Object.assign({}, $context, extension);
                return this._cspEvaluator.evaluate(ast, { $context: context, $h: h });
            };
        });
    }
    _createElementNode(engineContext, node, name, extraProps) {
        var props = this._getElementProps(engineContext, node);
        props = extraProps ? props.concat(extraProps) : props;
        return {
            type: 4,
            callee: {
                type: 1,
                name: '$h'
            },
            arguments: [
                {
                    type: 3,
                    value: name || node.tagName.toLowerCase()
                },
                {
                    type: 10,
                    properties: props
                },
                this._createAst(engineContext, Array.from(node.childNodes))
            ]
        };
    }
    _createBindDomExpressionNode(engineContext, node) {
        if (!node.hasAttribute('config')) {
            throw new Error("Missing the required 'config' attribute on <oj-bind-dom>");
        }
        const configValue = node.attributes['config'].value;
        return this._createComponentNode(engineContext, node, BindDom, [
            this._createPropertyNode(engineContext, 'config', configValue, (config) => Promise.resolve(config)),
            {
                key: 'bindingProvider',
                value: { type: 3, value: engineContext[BINDING_PROVIDER] }
            }
        ]);
    }
    _createComponentNode(engineContext, node, component, extraProps) {
        let props = this._getElementProps(engineContext, node);
        props = extraProps ? props.concat(extraProps) : props;
        return {
            type: 4,
            callee: {
                type: 1,
                name: '$h'
            },
            arguments: [
                {
                    type: 3,
                    value: component
                },
                {
                    type: 10,
                    properties: props
                }
            ]
        };
    }
    _createPropertyNode(engineContext, key, value, postprocess) {
        return {
            key: key,
            value: this._createExpressionNode(engineContext, value, postprocess)
        };
    }
    _postprocessClassNameValue(val) {
        let newVal;
        if (Array.isArray(val)) {
            newVal = val.join(' ');
        }
        else if (typeof val !== 'string') {
            newVal = Object.keys(val)
                .reduce((acc, key) => {
                if (val[key]) {
                    acc.push(key);
                }
                return acc;
            }, [])
                .join(' ');
        }
        else {
            newVal = val;
        }
        return newVal;
    }
    _getElementProps(engineContext, node) {
        let styleValue;
        const dotStyleValues = [];
        const writebacks = [];
        const listeners = new Map();
        const attrNodes = Array.prototype.reduce.call(node.attributes, (acc, attr) => {
            let name = attr.name;
            const value = attr.value;
            if (name.startsWith(':')) {
                name = name.substring(1);
                const parts = name.split('.');
                if (parts.length === 2 && parts[0] === 'style') {
                    dotStyleValues.push({ k: parts[1], v: value });
                }
                else if (name === 'style') {
                    styleValue = value;
                }
                else if (name === 'class') {
                    acc.push(this._createPropertyNode(engineContext, 'className', value, this._postprocessClassNameValue));
                }
                else {
                    if (AttributeUtils.isGlobalOrData(name)) {
                        name = AttributeUtils.getGlobalPropForAttr(name);
                    }
                    else {
                        name = AttributeUtils.attributeToPropertyName(name);
                    }
                    acc.push(this._createPropertyNode(engineContext, name, value));
                }
            }
            else {
                const expValue = AttributeUtils.getExpressionInfo(value);
                if (AttributeUtils.isEventListenerAttr(name)) {
                    name = AttributeUtils.eventAttrToPreactPropertyName(name);
                    listeners.set(name, value);
                }
                else if (AttributeUtils.isGlobalOrData(name)) {
                    acc.push(this._createPropertyNode(engineContext, AttributeUtils.getGlobalPropForAttr(name), value));
                }
                else {
                    const hasDottedProps = name.indexOf('.') >= 0;
                    if (expValue.expr) {
                        acc.push({
                            key: hasDottedProps ? name : AttributeUtils.attributeToPropertyName(name),
                            value: this._createExpressionEvaluator(engineContext, expValue.expr)
                        });
                    }
                    else {
                        acc.push({
                            key: name.toUpperCase(),
                            value: { type: 3, value: value }
                        });
                    }
                }
                if (!expValue.downstreamOnly) {
                    writebacks.push({ name, value: expValue.expr });
                }
            }
            return acc;
        }, []);
        if (styleValue != null) {
            if (dotStyleValues.length > 0) {
                throw new Error('Binding the entire style attribute as well as ' +
                    'the individual style properties on the same element is not supported');
            }
            attrNodes.push(this._createPropertyNode(engineContext, 'style', styleValue));
        }
        else if (dotStyleValues.length > 0) {
            attrNodes.push({
                key: 'style',
                value: {
                    type: 10,
                    properties: dotStyleValues.map((dotStyleVal) => {
                        return this._createPropertyNode(engineContext, AttributeUtils.attributeToPropertyName(dotStyleVal.k), dotStyleVal.v);
                    })
                }
            });
        }
        writebacks.forEach((writebackProp) => {
            var _a;
            const propName = `on${writebackProp.name}Changed`;
            const callbackPropExpr = listeners.get(propName);
            if (callbackPropExpr) {
                listeners.delete(propName);
            }
            attrNodes.push(this._createWritebackPropertyNode(engineContext, propName, writebackProp.value, (_a = AttributeUtils.getExpressionInfo(callbackPropExpr)) === null || _a === void 0 ? void 0 : _a.expr));
        });
        listeners.forEach((value, name) => {
            const info = AttributeUtils.getExpressionInfo(value);
            if (info.expr) {
                attrNodes.push(this._createEventListenerPropertyNode(name, info.expr));
            }
        });
        return attrNodes;
    }
    _createWritebackPropertyNode(engineContext, propName, propExpr, existingCallbackExpr) {
        let propExprEvaluator;
        let callbackExprEvaluator;
        return {
            key: propName,
            value: this._createCallNodeWithContext((bindingContext) => {
                return (event) => {
                    if (!propExprEvaluator) {
                        propExprEvaluator = this._cspEvaluator.createEvaluator(propExpr).evaluate;
                    }
                    const value = propExprEvaluator([bindingContext, bindingContext.$data]);
                    if (engineContext[BINDING_PROVIDER] &&
                        engineContext[BINDING_PROVIDER].__IsObservable(value)) {
                        value(event.detail.value);
                    }
                    else {
                        const writerExpr = this._getPropertyWriterExpression(propExpr);
                        if (writerExpr !== null) {
                            const writerEvaluator = this._cspEvaluator.createEvaluator(writerExpr).evaluate;
                            const func = this._getWriter(writerEvaluator([bindingContext.$data || {}, bindingContext]));
                            func(event.detail.value);
                        }
                    }
                    if (existingCallbackExpr && !callbackExprEvaluator) {
                        callbackExprEvaluator = this._cspEvaluator.createEvaluator(existingCallbackExpr)
                            .evaluate;
                    }
                    const existingCallback = callbackExprEvaluator
                        ? callbackExprEvaluator([bindingContext, bindingContext.$data])
                        : null;
                    if (existingCallback) {
                        existingCallback(event, bindingContext.$current || bindingContext.$data, bindingContext);
                    }
                };
            })
        };
    }
    _createEventListenerPropertyNode(propName, propExpr) {
        let propExprEvaluator;
        return {
            key: propName,
            value: this._createCallNodeWithContext((bindingContext) => {
                return (event) => {
                    if (!propExprEvaluator) {
                        propExprEvaluator = this._cspEvaluator.createEvaluator(propExpr).evaluate;
                    }
                    const listener = propExprEvaluator([bindingContext, bindingContext.$data]);
                    if (listener) {
                        listener(event, bindingContext.$current || bindingContext.$data, bindingContext);
                    }
                };
            })
        };
    }
    _createExpressionNode(engineContext, attrVal, postprocess) {
        const info = AttributeUtils.getExpressionInfo(attrVal);
        return info.expr
            ? this._createExpressionEvaluator(engineContext, info.expr, postprocess)
            : { type: 3, value: attrVal };
    }
    _createExpressionEvaluator(engineContext, exp, postprocess) {
        const delegateEvaluator = this._cspEvaluator.createEvaluator(exp).evaluate;
        return this._createCallNodeWithContext(($context) => {
            const bp = engineContext[BINDING_PROVIDER];
            const context = bp ? bp.__UnwrapObservable($context) : $context;
            const value = delegateEvaluator([context, context.$data]);
            let unwrapped = bp ? bp.__UnwrapObservable(value) : value;
            if (engineContext[UNWRAP_EXTRAS]) {
                unwrapped = engineContext[UNWRAP_EXTRAS](exp, unwrapped);
            }
            return postprocess ? postprocess(unwrapped) : unwrapped;
        });
    }
    _createCallNodeWithContext(callback) {
        return {
            type: 4,
            callee: {
                type: 3,
                value: callback
            },
            arguments: [
                {
                    type: 1,
                    name: '$context'
                }
            ]
        };
    }
    _getWriter(evaluator) {
        return evaluator['_ko_property_writers'];
    }
    _getPropertyWriterExpression(expression) {
        const _ASSIGNMENT_TARGET_EXP = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;
        const reserveddWords = ['true', 'false', 'null', 'undefined'];
        if (expression == null || reserveddWords.indexOf(expression) >= 0) {
            return null;
        }
        expression = expression.trim();
        const match = expression.match(_ASSIGNMENT_TARGET_EXP);
        if (match === null) {
            return null;
        }
        const target = match[1] ? `Object(${match[1]})${match[2]}` : expression;
        return `{_ko_property_writers: function(v){${target}=v;}}`;
    }
}

const templateEngine = new VTemplateEngine();
const executeFragment = templateEngine.executeFragment.bind(templateEngine);
const execute = templateEngine.execute.bind(templateEngine);
const cleanupTemplateCache = VTemplateEngine.cleanupTemplateCache;

export { cleanupTemplateCache, execute, executeFragment };
