/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { info } from 'ojs/ojlogger';
import { getTemplateContent } from 'ojs/ojhtmlutils';
import { CustomElementUtils, AttributeUtils } from 'ojs/ojcustomelement-utils';
import { getMetadata, getPropertiesForElementTag } from 'ojs/ojcustomelement-registry';
import { Component, Fragment, h, render } from 'preact';
import { jsx } from 'preact/jsx-runtime';
import Context from 'ojs/ojcontext';
import { withDataProvider } from 'ojs/ojdataproviderhandler';
import { ManageTabStops } from 'ojs/ojpreact-managetabstops';
import { getPropagationMetadataViaCache, CONSUMED_CONTEXT, STATIC_PROPAGATION } from 'ojs/ojbindpropagation';
import { getExpressionEvaluator } from 'ojs/ojconfig';
import { getPropertyMetadata } from 'ojs/ojmetadatautils';
import { CspExpressionEvaluatorInternal } from 'ojs/ojcspexpressionevaluator-internal';
import { performMonitoredWriteback } from 'ojs/ojmonitoring';
import { IDENTIFIER, ARRAY_EXP, LITERAL, OBJECT_EXP, PROPERTY, UNARY_EXP, CONDITIONAL_EXP, CALL_EXP } from 'ojs/ojexpparser';

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
        return (jsx(Fragment, { children: this.state.view && this.props.executeFragment
                ? this.props.executeFragment(null, this.state.view, this.state.data, this.forceUpdate.bind(this), this.props.bindingProvider)
                : null }));
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
            return jsx(BindForEachWithArray, { data: props.data, itemRenderer: props.itemRenderer });
        }
        else {
            return (jsx(this.BindForEachWithDP, { addBusyState: this._addBusyState, data: props.data, itemRenderer: props.itemRenderer }));
        }
    }
}
class BindForEachDataUnwrapper extends Component {
    render(props) {
        const unwrappedData = props.data.map((item) => item.data);
        return jsx(BindForEachWithArray, { data: unwrappedData, itemRenderer: props.itemRenderer });
    }
}
class BindForEachWithArray extends Component {
    render() {
        const data = this.props.data;
        return (jsx(Fragment, { children: data
                ? data.map((row, index) => {
                    return this.props.itemRenderer({
                        data: row,
                        index: index,
                        observableIndex: () => index
                    });
                })
                : [] }));
    }
}

const BINDING_PROVIDER = Symbol();
const COMPONENT_ELEMENT = Symbol();
const UNWRAP_EXTRAS = Symbol();
const BINDING_CONTEXT = Symbol();
const _DEFAULT_UNWRAP = function (target) {
    return target;
};
const _PROVIDED_KEY = '$provided';
const _CONTEXT_PARAM = [
    {
        type: IDENTIFIER,
        name: '$context'
    }
];
class VTemplateEngine {
    constructor() {
        this._templateAstCache = new WeakMap();
        this._cspEvaluator = getExpressionEvaluator() ?? new CspExpressionEvaluatorInternal();
    }
    static cleanupTemplateCache(templateElement) {
        if (templateElement && templateElement['_cachedRows']) {
            templateElement['_cachedRows'].forEach((entry) => entry.dispose());
            templateElement['_cachedRows'] = [];
        }
    }
    executeFragment(componentElement, fragment, properties, mutationCallback, bindingProviderForFragment) {
        let bindingProvider = bindingProviderForFragment;
        if (!bindingProvider) {
            bindingProvider = componentElement
                ? CustomElementUtils.getElementState(componentElement)?.getBindingProvider()
                : null;
        }
        if (properties?.['$provided'] && !(properties['$provided'] instanceof Map)) {
            properties['$provided'] = new Map(Object.entries(properties['$provided']));
        }
        return this._execute({
            [BINDING_PROVIDER]: bindingProvider,
            [COMPONENT_ELEMENT]: componentElement,
            [BINDING_CONTEXT]: properties
        }, fragment, properties, mutationCallback);
    }
    execute(componentElement, templateElement, properties, bindingProvider, mutationCallback) {
        const templateAlias = templateElement.getAttribute('data-oj-as');
        const context = this._getContext(bindingProvider, componentElement, templateElement, properties, null, templateAlias);
        return this._execute({
            [BINDING_PROVIDER]: bindingProvider,
            [COMPONENT_ELEMENT]: componentElement,
            [BINDING_CONTEXT]: context
        }, templateElement, context, mutationCallback);
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
    _getContext(bindingProvider, componentElement, node, properties, alias, templateAlias) {
        if (bindingProvider) {
            let bindingContext = bindingProvider.__ContextFor(node);
            if (!bindingContext) {
                info(`Binding context not found when processing template for element with id: ${componentElement.id}. Using binding context for element instead.`);
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
        const arrayNode = { type: ARRAY_EXP, elements: [] };
        arrayNode.elements = Array.prototype.reduce.call(nodes, (acc, node) => {
            const special = this._processSpecialNodes(engineContext, node);
            if (special) {
                acc.push(special);
            }
            else if (node.nodeType === 3) {
                acc.push({ type: LITERAL, value: node.nodeValue });
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
                case 'oj-bind-template-slot':
                    return this._createBindTemplateNode(engineContext, node);
                case 'oj-defer':
                    return this._createDeferNode(engineContext, node);
                case 'oj-if':
                    return this._createIfNode(engineContext, node);
                case 'template':
                    return this._createTemplateWithRenderCallback(engineContext, node);
            }
        }
        return null;
    }
    _createBindTemplateNode(engineContext, node) {
        const templateProps = {
            type: OBJECT_EXP,
            properties: []
        };
        const slotName = node.getAttribute('name') || '';
        templateProps.properties.push(this._getAttribute(engineContext, 'name', slotName));
        const templateData = node.getAttribute('data');
        if (templateData) {
            templateProps.properties.push(this._getAttribute(engineContext, 'data', templateData));
        }
        const alias = node.getAttribute('as');
        return this._createCallNodeWithContext((bindingContext, resolvedProps) => {
            const dataProp = resolvedProps.data;
            const nameProp = resolvedProps.name;
            const slots = engineContext[BINDING_CONTEXT]['__oj_slots'];
            const slotChildren = slots[nameProp];
            let template = slotChildren && slotChildren[slotChildren.length - 1];
            let isDefaultTemplate = false;
            if (!template) {
                for (let child in node.childNodes) {
                    if (node.childNodes[child].nodeName === 'TEMPLATE') {
                        template = node.childNodes[child];
                        isDefaultTemplate = true;
                        break;
                    }
                }
            }
            if (template && template.render) {
                return template.render(dataProp);
            }
            if (template) {
                const templateAst = this._getAstViaCache(engineContext, template);
                const templateAlias = template.getAttribute('data-oj-as');
                const templateCtx = this._getContext(engineContext[BINDING_PROVIDER], isDefaultTemplate
                    ? engineContext[COMPONENT_ELEMENT]
                    : engineContext[BINDING_CONTEXT]['__oj_composite'], template, dataProp, isDefaultTemplate ? alias : null, templateAlias);
                return this._cspEvaluator.evaluate(templateAst, {
                    $context: templateCtx,
                    $h: h,
                    BindDom
                });
            }
        }, [templateProps]);
    }
    _createTemplateWithRenderCallback(engineContext, node) {
        const templateAlias = node.getAttribute('data-oj-as');
        const getAstFromCacheFunc = this._getAstViaCache.bind(this);
        const evaluator = this._cspEvaluator;
        const renderProp = {
            type: PROPERTY,
            key: { type: LITERAL, value: 'render' },
            value: {
                type: LITERAL,
                value: (itemContext, provided) => {
                    const ctx = Object.assign({}, engineContext[BINDING_CONTEXT], {
                        $current: itemContext
                    });
                    if (templateAlias)
                        ctx[templateAlias] = itemContext;
                    if (ctx['$provided'] && provided) {
                        const merged = new Map([...ctx['$provided'], ...provided]);
                        ctx['$provided'] = merged;
                    }
                    else if (provided) {
                        ctx['$provided'] = provided;
                    }
                    const engineContextForRenderProp = {
                        [BINDING_CONTEXT]: ctx,
                        [BINDING_PROVIDER]: engineContext[BINDING_PROVIDER],
                        [COMPONENT_ELEMENT]: engineContext[COMPONENT_ELEMENT],
                        [UNWRAP_EXTRAS]: engineContext[UNWRAP_EXTRAS]
                    };
                    const templateAst = getAstFromCacheFunc(engineContextForRenderProp, node);
                    return evaluator.evaluate(templateAst, { $context: ctx, $h: h });
                }
            }
        };
        let props = this._getElementProps(engineContext, node);
        props.push(renderProp);
        if (engineContext[BINDING_PROVIDER]) {
            props.push({
                type: PROPERTY,
                key: { type: LITERAL, value: 'data-oj-use-ko' },
                value: { type: LITERAL, value: '' }
            });
        }
        return this._createHFunctionCallNode('template', [{ type: OBJECT_EXP, properties: props }]);
    }
    _createDeferContent(engineContext, nodes, context) {
        const bindDomConfig = { view: nodes, data: context };
        const bindDomProps = {
            config: Promise.resolve(bindDomConfig),
            bindingProvider: engineContext[BINDING_PROVIDER],
            executeFragment: this.executeFragment.bind(this)
        };
        return h(BindDom, bindDomProps);
    }
    _createDeferNode(engineContext, node) {
        let deferContent = this._createDeferContent(engineContext, [], {});
        let deferNode;
        const deferProps = [
            {
                type: PROPERTY,
                key: { type: LITERAL, value: 'ref' },
                value: {
                    type: LITERAL,
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
                type: PROPERTY,
                key: { type: LITERAL, value: '_activateSubtree' },
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
        return this._createHFunctionCallNode('oj-defer', [{ type: OBJECT_EXP, properties: props }]);
    }
    _createIfExpressionNode(engineContext, node) {
        if (!node.hasAttribute('test')) {
            throw new Error("Missing the required 'test' attribute on <oj-bind-if>");
        }
        return {
            type: UNARY_EXP,
            operator: '...',
            argument: this._createIfTestNode(engineContext, node)
        };
    }
    _createIfNode(engineContext, node) {
        if (!node.hasAttribute('test')) {
            throw new Error("Missing the required 'test' attribute on <oj-if>");
        }
        const props = this._getElementProps(engineContext, node);
        props.push(this._createPropertyNode(engineContext, 'style', 'display:contents;'));
        return this._createHFunctionCallNode('oj-if', [
            { type: OBJECT_EXP, properties: props },
            this._createIfTestNode(engineContext, node)
        ]);
    }
    _createIfTestNode(engineContext, node) {
        return {
            type: CONDITIONAL_EXP,
            test: this._createExpressionNode(engineContext, node.getAttribute('test')),
            consequent: this._createAst(engineContext, Array.from(node.childNodes)),
            alternate: {
                type: LITERAL,
                value: []
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
                type: PROPERTY,
                key: { type: LITERAL, value: 'itemRenderer' },
                value: this._createNestedTemplateRendererNode(engineContext, template)
            },
            {
                type: PROPERTY,
                key: { type: LITERAL, value: 'componentElement' },
                value: { type: LITERAL, value: engineContext[COMPONENT_ELEMENT] }
            }
        ]);
    }
    _createNestedTemplateRendererNode(engineContext, template) {
        const templateAlias = template.getAttribute('data-oj-as');
        const foreachEngineContext = {
            [BINDING_PROVIDER]: engineContext[BINDING_PROVIDER],
            [BINDING_CONTEXT]: engineContext[BINDING_CONTEXT],
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
    _createElementNode(engineContext, node) {
        const props = this._getElementProps(engineContext, node);
        const tagName = node.tagName;
        const localName = tagName.toLowerCase();
        const compMetadata = getMetadata(tagName);
        const elementNode = this._createHFunctionCallNode(localName, [
            this._createPossiblyProvidedAndConsumedProperties(localName, engineContext, compMetadata, props),
            this._createAst(engineContext, Array.from(node.childNodes))
        ]);
        if (node.hasAttribute('data-oj-manage-tabs')) {
            return this._createComponentNode(engineContext, null, ManageTabStops, [
                {
                    type: PROPERTY,
                    key: { type: LITERAL, value: 'children' },
                    value: elementNode
                }
            ]);
        }
        return elementNode;
    }
    _createPossiblyProvidedAndConsumedProperties(localTagName, engineContext, compMetadata, props) {
        const propertyObjectNode = {
            type: OBJECT_EXP,
            properties: props
        };
        const provideConsumeMeta = getPropagationMetadataViaCache(localTagName, compMetadata);
        if (!provideConsumeMeta) {
            return propertyObjectNode;
        }
        const specifiedProps = new Set();
        props.reduce((acc, def) => acc.add(def.key.value), specifiedProps);
        const consumingProps = [];
        const unwrap = this._getUnwrapObservable(engineContext);
        for (const [pName, meta] of provideConsumeMeta) {
            const consumeMeta = meta[1];
            if (consumeMeta) {
                if (pName === CONSUMED_CONTEXT) {
                    consumingProps.push({
                        type: PROPERTY,
                        key: { type: LITERAL, value: '__oj_private_contexts' },
                        value: this._createCallNodeWithContext(($ctx) => {
                            const providedValues = new Map();
                            const provided = unwrap($ctx)?.[_PROVIDED_KEY];
                            consumeMeta.forEach((preactContext) => {
                                if (provided?.has(preactContext)) {
                                    providedValues.set(preactContext, unwrap(provided.get(preactContext)));
                                }
                            });
                            return providedValues;
                        })
                    });
                }
                else if (!(specifiedProps.has(pName) ||
                    specifiedProps.has(AttributeUtils.propertyNameToAttribute(pName).toUpperCase()))) {
                    consumingProps.push({
                        type: PROPERTY,
                        key: { type: LITERAL, value: pName },
                        value: this._createCallNodeWithContext(($ctx) => {
                            const provided = unwrap($ctx)?.[_PROVIDED_KEY];
                            if (provided) {
                                return unwrap(provided.get(consumeMeta.name));
                            }
                        })
                    });
                }
            }
        }
        const propertyObjNodeWithConsumers = consumingProps.length === 0
            ? propertyObjectNode
            : { type: OBJECT_EXP, properties: propertyObjectNode.properties.concat(consumingProps) };
        const metadataProps = compMetadata.properties;
        return this._createCallNodeWithContext(($ctx, resolvedProps) => {
            let provided = new Map();
            let hasProvided;
            for (const [pName, [provideMeta]] of provideConsumeMeta) {
                if (provideMeta) {
                    provideMeta.forEach((info) => {
                        let propVal;
                        let isSet = true;
                        if (pName === STATIC_PROPAGATION) {
                            isSet = false;
                        }
                        else if (resolvedProps.hasOwnProperty(pName)) {
                            propVal = resolvedProps[pName];
                        }
                        else {
                            const attr = AttributeUtils.propertyNameToAttribute(pName);
                            const uppercaseAttr = attr.toUpperCase();
                            if (resolvedProps.hasOwnProperty(uppercaseAttr)) {
                                propVal = resolvedProps[uppercaseAttr];
                                const type = metadataProps?.[pName]?.type;
                                if (type && propVal != null) {
                                    propVal = AttributeUtils.parseAttributeValue(localTagName, attr, propVal, type);
                                }
                            }
                            else {
                                isSet = false;
                            }
                        }
                        const defaultKey = 'default';
                        if (!isSet) {
                            if (info.hasOwnProperty(defaultKey)) {
                                propVal = info[defaultKey];
                                isSet = true;
                            }
                        }
                        else {
                            const transform = info.transform;
                            propVal =
                                transform && transform.hasOwnProperty(propVal) ? transform[propVal] : propVal;
                        }
                        if (isSet) {
                            hasProvided = true;
                            provided.set(info.name, propVal);
                        }
                    });
                }
            }
            if (hasProvided) {
                const oldProvided = $ctx[_PROVIDED_KEY];
                if (oldProvided !== undefined) {
                    provided = new Map([...oldProvided, ...provided]);
                }
                $ctx[_PROVIDED_KEY] = provided;
            }
            return resolvedProps;
        }, [propertyObjNodeWithConsumers]);
    }
    _createBindDomExpressionNode(engineContext, node) {
        if (!node.hasAttribute('config')) {
            throw new Error("Missing the required 'config' attribute on <oj-bind-dom>");
        }
        const configValue = node.attributes['config'].value;
        return this._createComponentNode(engineContext, node, BindDom, [
            this._createPropertyNode(engineContext, 'config', configValue, (config) => Promise.resolve(config)),
            {
                type: PROPERTY,
                key: { type: LITERAL, value: 'bindingProvider' },
                value: { type: LITERAL, value: engineContext[BINDING_PROVIDER] }
            },
            {
                type: PROPERTY,
                key: { type: LITERAL, value: 'executeFragment' },
                value: { type: LITERAL, value: this.executeFragment.bind(this) }
            }
        ]);
    }
    _createComponentNode(engineContext, node, component, extraProps) {
        let props = node ? this._getElementProps(engineContext, node) : [];
        props = extraProps ? props.concat(extraProps) : props;
        return this._createHFunctionCallNode(component, [{ type: OBJECT_EXP, properties: props }]);
    }
    _createPropertyNode(engineContext, key, value, postprocess) {
        return {
            type: PROPERTY,
            key: { type: LITERAL, value: key },
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
        const dottedExpressions = [];
        const writebacks = new Map();
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
                    const propName = AttributeUtils.attributeToPropertyName(name);
                    const propNamePath = propName.split('.');
                    if (expValue.expr) {
                        const propMeta = getPropertyMetadata(propNamePath[0], getPropertiesForElementTag(node.tagName));
                        if (!propMeta?.readOnly) {
                            if (propNamePath.length > 1) {
                                dottedExpressions.push({ subProps: propName, expr: expValue.expr });
                            }
                            else {
                                acc.push({
                                    type: PROPERTY,
                                    key: { type: LITERAL, value: propName },
                                    value: this._createExpressionEvaluator(engineContext, expValue.expr)
                                });
                            }
                        }
                        if (!expValue.downstreamOnly && propMeta?.writeback) {
                            let subProps = propNamePath;
                            const topProp = subProps.shift();
                            let valuesArray = writebacks.get(topProp);
                            if (valuesArray) {
                                let newValuesArray = [
                                    ...valuesArray,
                                    { expr: expValue.expr, subProps: subProps }
                                ];
                                valuesArray = newValuesArray;
                            }
                            else {
                                valuesArray = [{ expr: expValue.expr, subProps: subProps }];
                            }
                            writebacks.set(topProp, valuesArray);
                        }
                    }
                    else if (name[0] === 'o' && name[1] === 'n') {
                        acc.push({
                            type: PROPERTY,
                            key: { type: LITERAL, value: name.toUpperCase() },
                            value: { type: LITERAL, value: value }
                        });
                    }
                    else {
                        const propMeta = getPropertyMetadata(propName, getPropertiesForElementTag(node.tagName));
                        const parsedValue = propMeta
                            ? CustomElementUtils.parseAttrValue(node, name, propName, value, propMeta)
                            : value;
                        if (propNamePath.length > 1) {
                            dottedExpressions.push({
                                subProps: propName,
                                expr: { type: LITERAL, value: parsedValue }
                            });
                        }
                        else {
                            acc.push({
                                type: PROPERTY,
                                key: { type: LITERAL, value: propName },
                                value: { type: LITERAL, value: parsedValue }
                            });
                        }
                    }
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
                type: PROPERTY,
                key: { type: LITERAL, value: 'style' },
                value: {
                    type: OBJECT_EXP,
                    properties: dotStyleValues.map((dotStyleVal) => {
                        return this._createPropertyNode(engineContext, AttributeUtils.attributeToPropertyName(dotStyleVal.k), dotStyleVal.v);
                    })
                }
            });
        }
        if (dottedExpressions.length > 0) {
            attrNodes.push(this._createRefPropertyNodeForNestedProps(engineContext, dottedExpressions));
        }
        writebacks.forEach((valuesArray, name) => {
            const propName = `on${name}Changed`;
            const callbackPropExpr = listeners.get(propName);
            if (callbackPropExpr) {
                listeners.delete(propName);
            }
            attrNodes.push(this._createWritebackPropertyNode(engineContext, name, propName, valuesArray, AttributeUtils.getExpressionInfo(callbackPropExpr)?.expr));
        });
        listeners.forEach((value, name) => {
            const info = AttributeUtils.getExpressionInfo(value);
            if (info.expr) {
                attrNodes.push(this._createEventListenerPropertyNode(name, info.expr));
            }
        });
        return attrNodes;
    }
    _createRefPropertyNodeForNestedProps(engineContext, dottedExpressions) {
        const dottedPropObjectNodes = dottedExpressions.map(({ subProps, expr }) => ({
            type: OBJECT_EXP,
            properties: [
                {
                    type: PROPERTY,
                    key: { type: LITERAL, value: subProps },
                    value: expr['type'] === LITERAL
                        ? { type: LITERAL, value: expr['value'] }
                        : this._createExpressionEvaluator(engineContext, expr)
                }
            ]
        }));
        const dottedPropsArrayNode = {
            type: ARRAY_EXP,
            elements: dottedPropObjectNodes
        };
        const cb = VTemplateEngine._nestedPropsRefCallback;
        return {
            type: PROPERTY,
            key: { type: LITERAL, value: 'ref' },
            value: this._createCallNodeWithContext(Function.prototype.bind.bind(cb, engineContext[BINDING_PROVIDER]), [dottedPropsArrayNode])
        };
    }
    static _nestedPropsRefCallback(bindingProvider, resolvedSubPropValues, refObj) {
        if (refObj && refObj.setProperties) {
            const updatedProps = Object.assign({}, ...resolvedSubPropValues);
            refObj.setProperties(updatedProps);
        }
    }
    _createWritebackPropertyNode(engineContext, property, eventPropName, valuesArray, existingCallbackExpr) {
        const propExprEvaluators = [];
        let callbackExprEvaluator;
        return {
            type: PROPERTY,
            key: { type: LITERAL, value: eventPropName },
            value: this._createCallNodeWithContext((bindingContext) => {
                return (event) => {
                    valuesArray.forEach((propItem, index) => {
                        let newValue = event.detail.value;
                        var subProps = propItem.subProps;
                        var propExpr = propItem.expr;
                        if (subProps.length > 0 && typeof newValue === 'object') {
                            newValue = subProps.reduce((acc, cur) => acc[cur], newValue);
                        }
                        let propExprEvaluator = propExprEvaluators[index];
                        if (!propExprEvaluator) {
                            propExprEvaluator = this._cspEvaluator.createEvaluator(propExpr).evaluate;
                            propExprEvaluators.push(propExprEvaluator);
                        }
                        const value = propExprEvaluator([bindingContext, bindingContext.$data]);
                        let writer;
                        if (engineContext[BINDING_PROVIDER] &&
                            engineContext[BINDING_PROVIDER].__IsObservable(value)) {
                            writer = value;
                        }
                        else {
                            const writerExpr = this._getPropertyWriterExpression(propExpr);
                            if (writerExpr !== null) {
                                const writerEvaluator = this._cspEvaluator.createEvaluator(writerExpr).evaluate;
                                writer = this._getWriter(writerEvaluator([bindingContext.$data || {}, bindingContext]));
                            }
                        }
                        performMonitoredWriteback(property, writer, event, newValue);
                    });
                    if (existingCallbackExpr && !callbackExprEvaluator) {
                        callbackExprEvaluator =
                            this._cspEvaluator.createEvaluator(existingCallbackExpr).evaluate;
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
            type: PROPERTY,
            key: { type: LITERAL, value: propName },
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
            : { type: LITERAL, value: attrVal };
    }
    _createExpressionEvaluator(engineContext, exp, postprocess) {
        const delegateEvaluator = this._cspEvaluator.createEvaluator(exp).evaluate;
        return this._createCallNodeWithContext(($context) => {
            const unwrap = this._getUnwrapObservable(engineContext);
            const context = unwrap($context);
            const value = delegateEvaluator([context, context.$data]);
            let unwrapped = unwrap(value);
            if (engineContext[UNWRAP_EXTRAS]) {
                unwrapped = engineContext[UNWRAP_EXTRAS](exp, unwrapped);
            }
            return postprocess ? postprocess(unwrapped) : unwrapped;
        });
    }
    _getUnwrapObservable(engineContext) {
        const bp = engineContext[BINDING_PROVIDER];
        return bp ? bp.__UnwrapObservable : _DEFAULT_UNWRAP;
    }
    _createCallNodeWithContext(callback, extaArgs) {
        return {
            type: CALL_EXP,
            callee: {
                type: LITERAL,
                value: callback
            },
            arguments: extaArgs ? _CONTEXT_PARAM.concat(extaArgs) : _CONTEXT_PARAM
        };
    }
    _createHFunctionCallNode(elementName, extraArgs) {
        return {
            type: CALL_EXP,
            callee: {
                type: IDENTIFIER,
                name: '$h'
            },
            arguments: [
                {
                    type: LITERAL,
                    value: elementName
                },
                ...extraArgs
            ]
        };
    }
    _getAttribute(engineContext, key, value) {
        const expr = AttributeUtils.getExpressionInfo(value).expr;
        return {
            type: PROPERTY,
            key: { type: LITERAL, value: key },
            value: expr
                ? this._createExpressionEvaluator(engineContext, expr)
                : { type: LITERAL, value: value }
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
