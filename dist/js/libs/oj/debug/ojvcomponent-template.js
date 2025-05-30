/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojlogger', 'ojs/ojhtmlutils', 'ojs/ojcustomelement-utils', 'ojs/ojcustomelement-registry', 'preact', 'preact/jsx-runtime', 'ojs/ojcontext', 'ojs/ojvcomponent', 'ojs/ojdataproviderhandler', 'ojs/ojpreact-managetabstops', 'ojs/ojbindpropagation', 'ojs/ojconfig', 'ojs/ojmetadatautils', 'ojs/ojcspexpressionevaluator-internal', 'ojs/ojmonitoring', 'ojs/ojexpparser'], function (exports, Logger, HtmlUtils, ojcustomelementUtils, ojcustomelementRegistry, preact, jsxRuntime, Context, ojvcomponent, ojdataproviderhandler, ojpreactManagetabstops, ojbindpropagation, ojconfig, ojmetadatautils, ojcspexpressionevaluatorInternal, ojmonitoring, ojexpparser) { 'use strict';

    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    class Props {
    }
    class BindDom extends preact.Component {
        constructor(props) {
            super(props);
            this._resolveConfig = (configPromise) => {
                this._registerBusyState();
                configPromise
                    .then((result) => {
                    if (configPromise === this.props.config) {
                        this.setState({ view: this._getFragment(result?.view ?? []), data: result?.data });
                    }
                })
                    .finally(() => {
                    if (configPromise === this.props.config) {
                        this._resolveBusyState();
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
            this._registerBusyState = () => {
                if (!this._resolveBusyStateCallback) {
                    const busyElem = this._busyContextEl?.current
                        ? this._busyContextEl?.current
                        : this.props.componentElement;
                    if (busyElem) {
                        this._resolveBusyStateCallback = Context.getContext(busyElem)
                            .getBusyContext()
                            .addBusyState({
                            description: `oj-bind-dom is waiting on config Promise resolution on element ${busyElem.tagName}#${busyElem.id}`
                        });
                    }
                }
            };
            this._resolveBusyState = () => {
                if (this._resolveBusyStateCallback) {
                    this._resolveBusyStateCallback();
                    this._resolveBusyStateCallback = null;
                }
            };
            this.state = { view: null, data: null };
            this._busyContextEl = null;
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
            return (jsxRuntime.jsx(preact.Fragment, { children: jsxRuntime.jsx(ojvcomponent.ReportBusyContext.Consumer, { children: (value) => {
                        this._busyContextEl = value;
                        return this.state.view && this.props.executeFragment
                            ? this.props.executeFragment(null, this.state.view, this.state.data, this.forceUpdate.bind(this), this.props.bindingProvider)
                            : null;
                    } }) }));
        }
    }

    class BindForEachWrapper extends preact.Component {
        constructor(props) {
            super(props);
            this._addBusyState = (description) => {
                const busyElem = this._busyContextEl?.current
                    ? this._busyContextEl?.current
                    : this.props.componentElement;
                const busyContext = Context.getContext(busyElem).getBusyContext();
                return busyContext.addBusyState({ description });
            };
            this.BindForEachWithDP = ojdataproviderhandler.withDataProvider(BindForEachDataUnwrapper, 'data');
        }
        render(props) {
            if (Array.isArray(props.data)) {
                return jsxRuntime.jsx(BindForEachWithArray, { data: props.data, itemRenderer: props.itemRenderer });
            }
            else {
                return (jsxRuntime.jsx(ojvcomponent.ReportBusyContext.Consumer, { children: (value) => {
                        this._busyContextEl = value;
                        return (jsxRuntime.jsx(this.BindForEachWithDP, { addBusyState: this._addBusyState, data: props.data, itemRenderer: props.itemRenderer }));
                    } }));
            }
        }
    }
    class BindForEachDataUnwrapper extends preact.Component {
        render(props) {
            const unwrappedData = props.data.map((item) => item.data);
            return jsxRuntime.jsx(BindForEachWithArray, { data: unwrappedData, itemRenderer: props.itemRenderer });
        }
    }
    class BindForEachWithArray extends preact.Component {
        render() {
            const data = this.props.data;
            return (jsxRuntime.jsx(preact.Fragment, { children: data
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
    const TEMPLATE_ELEMENT = Symbol();
    const UNWRAP_EXTRAS = Symbol();
    const BINDING_CONTEXT = Symbol();
    const PREVIOUS_DOT_PROPS_VALUES = Symbol();
    const _DEFAULT_UNWRAP = function (target) {
        return target;
    };
    const _PROVIDED_KEY = '$provided';
    const _CONTEXT_PARAM = [
        {
            type: ojexpparser.IDENTIFIER,
            name: '$context'
        }
    ];
    const _LITERALS_CACHE = new Map();
    class VTemplateEngine {
        constructor() {
            this._templateAstCache = new WeakMap();
            this._cspEvaluator = ojconfig.getExpressionEvaluator() ?? new ojcspexpressionevaluatorInternal.CspExpressionEvaluatorInternal();
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
                    ? ojcustomelementUtils.CustomElementUtils.getElementState(componentElement)?.getBindingProvider()
                    : null;
            }
            if (properties?.['$provided'] && !(properties['$provided'] instanceof Map)) {
                properties['$provided'] = new Map(Object.entries(properties['$provided']));
            }
            return this._execute({
                [BINDING_PROVIDER]: bindingProvider,
                [COMPONENT_ELEMENT]: componentElement,
                [TEMPLATE_ELEMENT]: fragment,
                [BINDING_CONTEXT]: properties
            }, fragment, properties, mutationCallback);
        }
        execute(componentElement, templateElement, properties, bindingProvider, mutationCallback) {
            const templateAlias = templateElement.getAttribute('data-oj-as');
            const context = this._getContext(bindingProvider, componentElement, templateElement, properties, null, templateAlias);
            return this._execute({
                [BINDING_PROVIDER]: bindingProvider,
                [COMPONENT_ELEMENT]: componentElement,
                [TEMPLATE_ELEMENT]: templateElement,
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
                        return this._cspEvaluator.evaluate(ast, { $context: context, $h: preact.h, BindDom });
                    }
                    VTemplateEngine.cleanupTemplateCache(templateElement);
                    mutationCallback();
                });
                templateElement['_cachedRows'].push(computedVNodes);
                return computedVNodes();
            }
            return this._cspEvaluator.evaluate(ast, { $context: context, $h: preact.h, BindDom });
        }
        _getContext(bindingProvider, componentElement, node, properties, alias, templateAlias) {
            if (bindingProvider) {
                let bindingContext = bindingProvider.__ContextFor(node);
                if (!bindingContext) {
                    Logger.info(`Binding context not found when processing template for element with id: ${componentElement.id}. Using binding context for element instead.`);
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
                    const docFragment = HtmlUtils.getTemplateContent(template)[0];
                    ast = this._createAst(engineContext, Array.from(docFragment.childNodes));
                }
                this._templateAstCache.set(template, ast);
            }
            return ast;
        }
        _createAst(engineContext, nodes) {
            const arrayNode = { type: ojexpparser.ARRAY_EXP, elements: [] };
            arrayNode.elements = Array.prototype.reduce.call(nodes, (acc, node) => {
                const special = this._processSpecialNodes(engineContext, node);
                if (special) {
                    acc.push(special);
                }
                else if (node.nodeType === 3) {
                    acc.push({ type: ojexpparser.LITERAL, value: node.nodeValue });
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
                type: ojexpparser.OBJECT_EXP,
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
                        $h: preact.h,
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
                type: ojexpparser.PROPERTY,
                key: { type: ojexpparser.LITERAL, value: 'render' },
                value: {
                    type: ojexpparser.LITERAL,
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
                        return evaluator.evaluate(templateAst, { $context: ctx, $h: preact.h });
                    }
                }
            };
            let props = this._getElementProps(engineContext, node);
            props.push(renderProp);
            if (engineContext[BINDING_PROVIDER]) {
                props.push({
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: 'data-oj-use-ko' },
                    value: { type: ojexpparser.LITERAL, value: '' }
                });
            }
            return this._createHFunctionCallNode('template', [{ type: ojexpparser.OBJECT_EXP, properties: props }]);
        }
        _createDeferContent(engineContext, nodes, context) {
            const bindDomConfig = { view: nodes, data: context };
            const bindDomProps = {
                config: Promise.resolve(bindDomConfig),
                bindingProvider: engineContext[BINDING_PROVIDER],
                executeFragment: this.executeFragment.bind(this)
            };
            return preact.h(BindDom, bindDomProps);
        }
        _createDeferNode(engineContext, node) {
            let deferContent = this._createDeferContent(engineContext, [], {});
            let deferNode;
            const deferProps = [
                {
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: 'ref' },
                    value: {
                        type: ojexpparser.LITERAL,
                        value: (refObj) => {
                            if (refObj) {
                                deferNode = refObj;
                                preact.render(deferContent, deferNode);
                            }
                            else {
                                preact.render(null, deferNode);
                            }
                        }
                    }
                },
                {
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: '_activateSubtree' },
                    value: this._createCallNodeWithContext((context) => {
                        return (parentNode) => {
                            deferContent = this._createDeferContent(engineContext, Array.from(node.childNodes), context);
                            preact.render(deferContent, parentNode);
                        };
                    })
                }
            ];
            let props = this._getElementProps(engineContext, node);
            props = props.concat(deferProps);
            return this._createHFunctionCallNode('oj-defer', [{ type: ojexpparser.OBJECT_EXP, properties: props }]);
        }
        _createIfExpressionNode(engineContext, node) {
            if (!node.hasAttribute('test')) {
                throw new Error("Missing the required 'test' attribute on <oj-bind-if>");
            }
            return {
                type: ojexpparser.UNARY_EXP,
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
                { type: ojexpparser.OBJECT_EXP, properties: props },
                this._createIfTestNode(engineContext, node)
            ]);
        }
        _createIfTestNode(engineContext, node) {
            return {
                type: ojexpparser.CONDITIONAL_EXP,
                test: this._createExpressionNode(engineContext, node.getAttribute('test')),
                consequent: this._createAst(engineContext, Array.from(node.childNodes)),
                alternate: {
                    type: ojexpparser.LITERAL,
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
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: 'itemRenderer' },
                    value: this._createNestedTemplateRendererNode(engineContext, template)
                },
                {
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: 'componentElement' },
                    value: { type: ojexpparser.LITERAL, value: engineContext[COMPONENT_ELEMENT] }
                }
            ]);
        }
        _createNestedTemplateRendererNode(engineContext, template) {
            const templateAlias = template.getAttribute('data-oj-as');
            const foreachEngineContext = {
                [BINDING_PROVIDER]: engineContext[BINDING_PROVIDER],
                [BINDING_CONTEXT]: engineContext[BINDING_CONTEXT],
                [COMPONENT_ELEMENT]: engineContext[COMPONENT_ELEMENT],
                [TEMPLATE_ELEMENT]: engineContext[TEMPLATE_ELEMENT],
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
                    return this._cspEvaluator.evaluate(ast, { $context: context, $h: preact.h });
                };
            });
        }
        _createElementNode(engineContext, node) {
            const props = this._getElementProps(engineContext, node);
            const tagName = node.tagName;
            const localName = tagName.toLowerCase();
            const compMetadata = ojcustomelementRegistry.getMetadata(tagName);
            const elementNode = this._createHFunctionCallNode(localName, [
                this._createPossiblyProvidedAndConsumedProperties(localName, engineContext, compMetadata, props),
                this._createAst(engineContext, Array.from(node.childNodes))
            ]);
            if (node.hasAttribute('data-oj-manage-tabs')) {
                return this._createComponentNode(engineContext, null, ojpreactManagetabstops.ManageTabStops, [
                    {
                        type: ojexpparser.PROPERTY,
                        key: { type: ojexpparser.LITERAL, value: 'children' },
                        value: elementNode
                    }
                ]);
            }
            return elementNode;
        }
        _createPossiblyProvidedAndConsumedProperties(localTagName, engineContext, compMetadata, props) {
            const propertyObjectNode = {
                type: ojexpparser.OBJECT_EXP,
                properties: props
            };
            const provideConsumeMeta = ojbindpropagation.getPropagationMetadataViaCache(localTagName, compMetadata);
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
                    if (pName === ojbindpropagation.CONSUMED_CONTEXT) {
                        consumingProps.push({
                            type: ojexpparser.PROPERTY,
                            key: { type: ojexpparser.LITERAL, value: '__oj_provided_contexts' },
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
                        specifiedProps.has(ojcustomelementUtils.AttributeUtils.propertyNameToAttribute(pName).toUpperCase()))) {
                        consumingProps.push({
                            type: ojexpparser.PROPERTY,
                            key: { type: ojexpparser.LITERAL, value: pName },
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
                : { type: ojexpparser.OBJECT_EXP, properties: propertyObjectNode.properties.concat(consumingProps) };
            const metadataProps = compMetadata.properties;
            return this._createCallNodeWithContext(($ctx, resolvedProps) => {
                let provided = new Map();
                let hasProvided;
                for (const [pName, [provideMeta]] of provideConsumeMeta) {
                    if (provideMeta) {
                        provideMeta.forEach((info) => {
                            let propVal;
                            let isSet = true;
                            if (pName === ojbindpropagation.STATIC_PROPAGATION) {
                                isSet = false;
                            }
                            else if (resolvedProps.hasOwnProperty(pName)) {
                                propVal = resolvedProps[pName];
                            }
                            else {
                                const attr = ojcustomelementUtils.AttributeUtils.propertyNameToAttribute(pName);
                                const uppercaseAttr = attr.toUpperCase();
                                if (resolvedProps.hasOwnProperty(uppercaseAttr)) {
                                    propVal = resolvedProps[uppercaseAttr];
                                    const type = metadataProps?.[pName]?.type;
                                    if (type && propVal != null) {
                                        propVal = ojcustomelementUtils.AttributeUtils.parseAttributeValue(localTagName, attr, propVal, type);
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
            const props = [
                this._createPropertyNode(engineContext, 'config', configValue, (config) => Promise.resolve(config)),
                {
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: 'bindingProvider' },
                    value: { type: ojexpparser.LITERAL, value: engineContext[BINDING_PROVIDER] }
                },
                {
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: 'componentElement' },
                    value: { type: ojexpparser.LITERAL, value: engineContext[COMPONENT_ELEMENT] }
                },
                {
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: 'executeFragment' },
                    value: { type: ojexpparser.LITERAL, value: this.executeFragment.bind(this) }
                }
            ];
            return this._createHFunctionCallNode(BindDom, [{ type: ojexpparser.OBJECT_EXP, properties: props }]);
        }
        _createComponentNode(engineContext, node, component, extraProps) {
            let props = node ? this._getElementProps(engineContext, node) : [];
            props = extraProps ? props.concat(extraProps) : props;
            return this._createHFunctionCallNode(component, [{ type: ojexpparser.OBJECT_EXP, properties: props }]);
        }
        _createPropertyNode(engineContext, key, value, postprocess) {
            return {
                type: ojexpparser.PROPERTY,
                key: { type: ojexpparser.LITERAL, value: key },
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
                        if (ojcustomelementUtils.AttributeUtils.isGlobalOrData(name)) {
                            name = ojcustomelementUtils.AttributeUtils.getGlobalPropForAttr(name);
                        }
                        else {
                            name = ojcustomelementUtils.AttributeUtils.attributeToPropertyName(name);
                        }
                        acc.push(this._createPropertyNode(engineContext, name, value));
                    }
                }
                else {
                    const expValue = ojcustomelementUtils.AttributeUtils.getExpressionInfo(value);
                    if (ojcustomelementUtils.AttributeUtils.isEventListenerAttr(name)) {
                        name = ojcustomelementUtils.AttributeUtils.eventAttrToPreactPropertyName(name);
                        listeners.set(name, value);
                    }
                    else if (ojcustomelementUtils.AttributeUtils.isGlobalOrData(name)) {
                        acc.push(this._createPropertyNode(engineContext, ojcustomelementUtils.AttributeUtils.getGlobalPropForAttr(name), value));
                    }
                    else {
                        const propName = ojcustomelementUtils.AttributeUtils.attributeToPropertyName(name);
                        const propNamePath = propName.split('.');
                        if (expValue.expr) {
                            const propMeta = ojmetadatautils.getPropertyMetadata(propNamePath[0], ojcustomelementRegistry.getPropertiesForElementTag(node.tagName));
                            if (!propMeta?.readOnly) {
                                if (propNamePath.length > 1) {
                                    dottedExpressions.push({ subProps: propName, expr: expValue.expr });
                                }
                                else {
                                    acc.push({
                                        type: ojexpparser.PROPERTY,
                                        key: { type: ojexpparser.LITERAL, value: propName },
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
                                type: ojexpparser.PROPERTY,
                                key: { type: ojexpparser.LITERAL, value: name.toUpperCase() },
                                value: { type: ojexpparser.LITERAL, value: value }
                            });
                        }
                        else {
                            const parsedValue = this._getLiteralValueViaCache(engineContext, node, name, propName, value);
                            if (propNamePath.length > 1) {
                                dottedExpressions.push({
                                    subProps: propName,
                                    expr: { type: ojexpparser.LITERAL, value: parsedValue }
                                });
                            }
                            else {
                                acc.push({
                                    type: ojexpparser.PROPERTY,
                                    key: { type: ojexpparser.LITERAL, value: propName },
                                    value: { type: ojexpparser.LITERAL, value: parsedValue }
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
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: 'style' },
                    value: {
                        type: ojexpparser.OBJECT_EXP,
                        properties: dotStyleValues.map((dotStyleVal) => {
                            return this._createPropertyNode(engineContext, ojcustomelementUtils.AttributeUtils.attributeToPropertyName(dotStyleVal.k), dotStyleVal.v);
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
                attrNodes.push(this._createWritebackPropertyNode(engineContext, name, propName, valuesArray, ojcustomelementUtils.AttributeUtils.getExpressionInfo(callbackPropExpr)?.expr));
            });
            listeners.forEach((value, name) => {
                const info = ojcustomelementUtils.AttributeUtils.getExpressionInfo(value);
                if (info.expr) {
                    attrNodes.push(this._createEventListenerPropertyNode(name, info.expr));
                }
            });
            return attrNodes;
        }
        _getLiteralValueViaCache(engineContext, node, name, propName, value) {
            const propMeta = ojmetadatautils.getPropertyMetadata(propName, ojcustomelementRegistry.getPropertiesForElementTag(node.tagName));
            if (!propMeta) {
                return value;
            }
            const templateId = engineContext[TEMPLATE_ELEMENT]?.id;
            const key = templateId ? JSON.stringify([templateId, propName, value]) : null;
            let propertyValue = key ? _LITERALS_CACHE.get(key) : null;
            if (!propertyValue) {
                propertyValue = ojcustomelementUtils.CustomElementUtils.parseAttrValue(node, name, propName, value, propMeta);
                if (key && (typeof propertyValue == 'object' || Array.isArray(propertyValue))) {
                    _LITERALS_CACHE.set(key, propertyValue);
                }
            }
            return propertyValue;
        }
        _createRefPropertyNodeForNestedProps(engineContext, dottedExpressions) {
            const dottedPropObjectNodes = dottedExpressions.map(({ subProps, expr }) => ({
                type: ojexpparser.OBJECT_EXP,
                properties: [
                    {
                        type: ojexpparser.PROPERTY,
                        key: { type: ojexpparser.LITERAL, value: subProps },
                        value: expr['type'] === ojexpparser.LITERAL
                            ? { type: ojexpparser.LITERAL, value: expr['value'] }
                            : this._createExpressionEvaluator(engineContext, expr)
                    }
                ]
            }));
            const dottedPropsArrayNode = {
                type: ojexpparser.ARRAY_EXP,
                elements: dottedPropObjectNodes
            };
            const cb = VTemplateEngine._nestedPropsRefCallback;
            return {
                type: ojexpparser.PROPERTY,
                key: { type: ojexpparser.LITERAL, value: 'ref' },
                value: this._createCallNodeWithContext(Function.prototype.bind.bind(cb, engineContext[BINDING_PROVIDER]), [dottedPropsArrayNode])
            };
        }
        static _nestedPropsRefCallback(bindingProvider, resolvedSubPropValues, refObj) {
            if (refObj && refObj.setProperties) {
                const oldValues = VTemplateEngine._getPreviousNestedPropValues(refObj);
                const modifiedSubPropValues = resolvedSubPropValues.filter((record) => {
                    const propPath = Object.keys(record)[0];
                    const value = record[propPath];
                    return oldValues?.[propPath] !== value;
                });
                const newValues = Object.assign({}, ...modifiedSubPropValues);
                VTemplateEngine._setUpdatedNestedPropValues(refObj, newValues);
                refObj.setProperties(newValues);
            }
        }
        static _getPreviousNestedPropValues(refObj) {
            return refObj[PREVIOUS_DOT_PROPS_VALUES];
        }
        static _setUpdatedNestedPropValues(refObj, newValues) {
            let map = refObj[PREVIOUS_DOT_PROPS_VALUES];
            if (!map) {
                map = {};
                refObj[PREVIOUS_DOT_PROPS_VALUES] = map;
            }
            Object.assign(map, newValues);
        }
        _createWritebackPropertyNode(engineContext, property, eventPropName, valuesArray, existingCallbackExpr) {
            const propExprEvaluators = [];
            let callbackExprEvaluator;
            return {
                type: ojexpparser.PROPERTY,
                key: { type: ojexpparser.LITERAL, value: eventPropName },
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
                            ojmonitoring.performMonitoredWriteback(property, writer, event, newValue);
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
                type: ojexpparser.PROPERTY,
                key: { type: ojexpparser.LITERAL, value: propName },
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
            const info = ojcustomelementUtils.AttributeUtils.getExpressionInfo(attrVal);
            return info.expr
                ? this._createExpressionEvaluator(engineContext, info.expr, postprocess)
                : { type: ojexpparser.LITERAL, value: attrVal };
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
                type: ojexpparser.CALL_EXP,
                callee: {
                    type: ojexpparser.LITERAL,
                    value: callback
                },
                arguments: extaArgs ? _CONTEXT_PARAM.concat(extaArgs) : _CONTEXT_PARAM
            };
        }
        _createHFunctionCallNode(elementName, extraArgs) {
            return {
                type: ojexpparser.CALL_EXP,
                callee: {
                    type: ojexpparser.IDENTIFIER,
                    name: '$h'
                },
                arguments: [
                    {
                        type: ojexpparser.LITERAL,
                        value: elementName
                    },
                    ...extraArgs
                ]
            };
        }
        _getAttribute(engineContext, key, value) {
            const expr = ojcustomelementUtils.AttributeUtils.getExpressionInfo(value).expr;
            return {
                type: ojexpparser.PROPERTY,
                key: { type: ojexpparser.LITERAL, value: key },
                value: expr
                    ? this._createExpressionEvaluator(engineContext, expr)
                    : { type: ojexpparser.LITERAL, value: value }
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

    exports.cleanupTemplateCache = cleanupTemplateCache;
    exports.execute = execute;
    exports.executeFragment = executeFragment;

    Object.defineProperty(exports, '__esModule', { value: true });

});
