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
                    // Check for BusyStateContext element provided by the parent,
                    // otherwise use componentElement property.
                    // The property is not populated for oj-defer.
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

    /**
     * Wrapper class that handles both types of data properties - arrays and data providers.
     * The class delegates data provider updates to the HOC - WithDataProviderType.
     */
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
    /**
     * A component that unwraps data object that came from WithDataProviderType into
     * a simplified format required by BindForEachWithArray component.
     */
    class BindForEachDataUnwrapper extends preact.Component {
        render(props) {
            const unwrappedData = props.data.map((item) => item.data);
            return jsxRuntime.jsx(BindForEachWithArray, { data: unwrappedData, itemRenderer: props.itemRenderer });
        }
    }
    /**
     * A component that renderes an array of data using a provided item renderer.
     */
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
    const TEMPLATE_ALIAS = Symbol();
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
    const _proxyUnwrap = (value) => value?.[ojcspexpressionevaluatorInternal.PROXY_SYMBOL] ?? value;
    const _unwrapBindingContext = (bindingContext, templateAlias) => {
        if (!bindingContext.$current) {
            return bindingContext;
        }
        const unwrappedCurr = _proxyUnwrap(bindingContext.$current);
        const newContext = Object.defineProperties({}, Object.getOwnPropertyDescriptors(bindingContext));
        newContext.$current = unwrappedCurr;
        if (templateAlias) {
            newContext[templateAlias] = unwrappedCurr;
        }
        return newContext;
    };
    class VTemplateEngine {
        constructor() {
            this._templateAstCache = new WeakMap();
            this._cspEvaluator = ojconfig.getExpressionEvaluator() ?? new ojcspexpressionevaluatorInternal.CspExpressionEvaluatorInternal();
            // This variable serves as a temporary storage during expression evaluation.
            // The results should be thrown away as for the next evaluation. See createRecursiveProxy().
            this._expressionPaths = [];
        }
        /**
         * Static method called to cleanup template cache if exists
         * @param templateElement the <template> element
         */
        static cleanupTemplateCache(templateElement) {
            if (templateElement && templateElement['_cachedRows']) {
                templateElement['_cachedRows'].forEach((entry) => entry.dispose());
                templateElement['_cachedRows'] = [];
            }
        }
        /**
         * Executes the DocumentFragment by converting the fragment nodes into AST and evaluating it against applied context.
         * This method is designed for external usage from Dynamic form UI. Main difference from external() method is that
         * the properties object will be directly applied to the template as is.
         * @param {HTMLElement | null} componentElement component element that will be used to retrieve binding provider
         *         or null if binding provider is irrelevant
         * @param {DocumentFragment} fragment the DocumentFragment element
         * @param {object} properties data to be applied to the template
         * @param {Function} mutationCallback a callback function the caller should specify to be notified if any observables
         *        in the properties have changed. When notified, the parent component should rerender in order to call
         *        this function again to regenerate the vnodes.
         * @param {KOBindingProviderLocal=} bindingProvider optional binding provider for the fragment. Used by BindDom component.
         * @returns {Array.<VNode>} an array of virtual nodes that will be added to a parent vcomponent.
         */
        executeFragment(componentElement, fragment, properties, mutationCallback, bindingProviderForFragment) {
            let bindingProvider = bindingProviderForFragment;
            if (!bindingProvider) {
                bindingProvider = componentElement
                    ? ojcustomelementUtils.CustomElementUtils.getElementState(componentElement)?.getBindingProvider()
                    : null;
            }
            // Normalize $provided into a Map since executeFragment() user might give us a plain object.
            // TODO: this code is a workaround for JET-57399. It should be removed when the issue is fixed.
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
        /**
         * Executes the template by converting the template nodes into AST and evaluating it against applied context.
         * @param {Element} componentElement component element
         * @param {Element} templateElement the <template> element
         * @param {object} properties data to be applied to the template
         * @param {Function} mutationCallback a function used by computed VNodes on template updates
         * @return {Array.<VNode>} an array of virtual nodes that will be added to a parent vcomponent.
         * @ignore
         */
        execute(componentElement, templateElement, properties, bindingProvider, mutationCallback) {
            const templateAlias = templateElement.getAttribute('data-oj-as');
            const context = this._getContext(bindingProvider, componentElement, templateElement, properties, null, templateAlias);
            return this._execute({
                [BINDING_PROVIDER]: bindingProvider,
                [COMPONENT_ELEMENT]: componentElement,
                [TEMPLATE_ELEMENT]: templateElement,
                [TEMPLATE_ALIAS]: templateAlias,
                [BINDING_CONTEXT]: context
            }, templateElement, context, mutationCallback);
        }
        /**
         * Internal helper method that creates AST and returns computed or plain VNodes based on binding provider.
         * @param engineContext
         * @param templateElement
         * @param context
         * @param mutationCallback
         */
        _execute(engineContext, templateElement, context, mutationCallback) {
            const ast = this._getAstViaCache(engineContext, templateElement);
            const bindingProvider = engineContext[BINDING_PROVIDER];
            if (bindingProvider) {
                if (!templateElement['_cachedRows']) {
                    Object.defineProperties(templateElement, {
                        _cachedRows: { writable: true, value: [] }
                    });
                }
                // The computedVNodes observable is designed to create virtual nodes
                // on initial call. The computed will be called again on update
                // to perform the cleanup (to be disposed and removed from cache) and to
                // call a mutation callback function. The mutation callback should notify
                // a parent component to trigger rerender.
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
        /**
         * The method creates a Proxy for the given $current object. This Proxy is used to wrap the properties
         * of the object to gather identifier expressions during the evaluation step.
         * @param currentObj the object to be wrapped with a Proxy.
         * @returns a new Proxy object that wraps the properties of the input object.
         */
        _createProxyForCurrentObj(currentObj) {
            // Method that checks whether a proxy for the given property can be created.
            // The property can't be proxied when both configurable and writable descriptors are false.
            // Allow proxy when a property descriptor does not exist on the object.
            function canProxy(obj, prop) {
                const d = Object.getOwnPropertyDescriptor(obj, prop);
                return !!(!d || d.configurable || d.writable);
            }
            // Helper function that wraps properties object into Proxy
            // in order to gather identifier expressions during evaluation step.
            // The expresions will be used to populate __oj_private_identifier_to_prop and
            // __oj_private_identifier_to_value properties.
            function createRecursiveProxy(obj, path = '', onAccess) {
                return new Proxy(obj, {
                    get(target, property) {
                        if (property === ojcspexpressionevaluatorInternal.PROXY_SYMBOL) {
                            return obj;
                        }
                        // Build path and store it on a class
                        const newPath = Boolean(path) ? `${path}.${property}` : `${property}`;
                        const propValue = target[property];
                        onAccess(newPath, propValue);
                        if (propValue && typeof propValue === 'object' && canProxy(target, property)) {
                            return createRecursiveProxy(propValue, newPath, onAccess);
                        }
                        return propValue;
                    }
                });
            }
            const proxy = currentObj
                ? createRecursiveProxy(currentObj, '', (identifier, value) => {
                    const lastItem = this._expressionPaths[this._expressionPaths.length - 1];
                    if (lastItem && identifier.startsWith(`${lastItem.identifier}.`)) {
                        this._expressionPaths.pop();
                    }
                    this._expressionPaths.push({ identifier, value });
                })
                : currentObj;
            return proxy;
        }
        /**
         * Gets binding context for the template element.
         * @param {KOBindingProviderLocal} bindingProvider binding provider for the template
         * @param {Element} componentElement component element
         * @param {Element} node the <template> element
         * @param {object} properties data to be applied to the template
         * @param {string} alias external alias (need in oj-bind-template-slot)
         * @param {string} templateAlias template alias
         * @return {object} context object
         */
        _getContext(bindingProvider, componentElement, node, properties, alias, templateAlias) {
            const proxy = properties && typeof properties === 'object'
                ? this._createProxyForCurrentObj(properties)
                : properties;
            if (bindingProvider) {
                // Always use the binding context for the template  element
                let bindingContext = bindingProvider.__ContextFor(node);
                // In the rare case it's not defined, check the componentElement and log a message
                if (!bindingContext) {
                    Logger.info(`Binding context not found when processing template for element with id: ${componentElement.id}. Using binding context for element instead.`);
                    bindingContext = bindingProvider.__ContextFor(componentElement);
                }
                return bindingProvider.__ExtendBindingContext(bindingContext, proxy, alias, templateAlias, componentElement);
            }
            const context = {
                $current: proxy
            };
            if (templateAlias) {
                context[templateAlias] = proxy;
            }
            return context;
        }
        /**
         * Retrieves an AST for the given template from cache.
         * Creates and stores an AST for the given template when it is used for the first time.
         * @return {object}
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param template
         */
        _getAstViaCache(engineContext, template) {
            let ast = this._templateAstCache.get(template);
            if (!ast) {
                // Check if nodeType is Node.DOCUMENT_FRAGMENT_NODE
                if (template.nodeType === 11) {
                    ast = this._createAst(engineContext, Array.from(template.childNodes));
                }
                else {
                    // Use child nodes of DocumentFragment that we get from HtmlUtils.getTemplateContent()
                    const docFragment = HtmlUtils.getTemplateContent(template)[0];
                    ast = this._createAst(engineContext, Array.from(docFragment.childNodes));
                }
                this._templateAstCache.set(template, ast);
            }
            return ast;
        }
        /**
         * Creates AST node for the top level template nodes.
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {Array<Node>} nodes array of template nodes
         * @return {object} AST node
         */
        _createAst(engineContext, nodes) {
            const arrayNode = { type: ojexpparser.ARRAY_EXP, elements: [] };
            arrayNode.elements = Array.prototype.reduce.call(nodes, (acc, node) => {
                const special = this._processSpecialNodes(engineContext, node);
                if (special) {
                    acc.push(special);
                }
                else if (node.nodeType === 3) {
                    // text node
                    acc.push({ type: ojexpparser.LITERAL, value: node.nodeValue });
                }
                else if (node.nodeType === 1) {
                    // element
                    acc.push(this._createElementNode(engineContext, node));
                }
                return acc;
            }, []);
            return arrayNode;
        }
        /**
         * Creates AST node for oj-bind-* elements.
         * Returns null otherwise.
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {Element} node
         */
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
                        // The template case is added to handle custom elements that have template slots
                        // with an exception of oj-bind-for-each element which is handled
                        // by _createBindForEachExpressionNode() method.
                        return this._createTemplateWithRenderCallback(engineContext, node);
                }
            }
            return null;
        }
        /**
         * Creates an AST node for oj-bind-template slot element. The context for the template is determined
         * at evaluation time and it is based on whether the template is default or external.
         * @param engineContext
         * @param node
         */
        _createBindTemplateNode(engineContext, node) {
            // Build name and data property evaluators to be resolved for the template.
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
                // Handle the case of an external template that was already preprocessed by the template engine
                // so the render() property is on the template and the binding context is prebound to render() method.
                // See JET-51337 for details.
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
        /**
         * A method that creates an AST node for a template element where a child content is wrapped into a render callback.
         * It is expected that the parent element would either use the template engine to process the template (legacy components case)
         * or check for render property and user the provided callback directly (vcomponent case).
         * @param {VTemplateEngineContext} engineContext
         * @param {Element} node template node
         */
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
                        // We copy binding context into a new object and add additional entries
                        // for the current item and a template alias.
                        // Then we add the new binding context to a fresh copy of engine context
                        // in order to preserve the context for elements outside of the nested templates
                        // and provide inner nested templates with the correct data, e.g.
                        // when a cell template is inside of a collection template and
                        // a collection template alias is used inside of the cell template.
                        // Note that COMPONENT_ELEMENT is a parent that owns an initial template slot and
                        // it is needed by oj-bind-for-each code to register busy state.
                        const ctx = Object.assign({}, engineContext[BINDING_CONTEXT], {
                            $current: itemContext
                        });
                        if (templateAlias) {
                            ctx[templateAlias] = itemContext;
                        }
                        // Merge $provided contexts if the 'provided' argument is given.
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
                // When binding provider is present, the data-oj-use-ko attribute is set on the template element.
                // We need the flag to ensure that the correct version of TemplateEngine is loaded
                // for the nested templates.
                props.push({
                    type: ojexpparser.PROPERTY,
                    key: { type: ojexpparser.LITERAL, value: 'data-oj-use-ko' },
                    value: { type: ojexpparser.LITERAL, value: '' }
                });
            }
            return this._createHFunctionCallNode('template', [{ type: ojexpparser.OBJECT_EXP, properties: props }]);
        }
        /**
         * A method that creates content for oj-defer element.
         * @param {VTemplateEngineContext} engineContext
         * @param {Array<Node>} nodes child nodes for oj-defer
         * @param {object} context object used to resolve oj-defer expressions
         * @returns BindDom component
         */
        _createDeferContent(engineContext, nodes, context) {
            const bindDomConfig = { view: nodes, data: context };
            const bindDomProps = {
                config: Promise.resolve(bindDomConfig),
                bindingProvider: engineContext[BINDING_PROVIDER],
                executeFragment: this.executeFragment.bind(this)
            };
            return preact.h(BindDom, bindDomProps);
        }
        /**
         * Creates oj-defer element with special properties and AST that will be evaluated on demand.
         * @param {VTemplateEngineContext} engineContext
         * @param {Element} node
         */
        _createDeferNode(engineContext, node) {
            // The deferContent is BindDom component used as a child of oj-defer element.
            // Initially BindDom is created with an empty config property. We will pass a new
            // config  to BindDom on _activateSubtree() method call.
            let deferContent = this._createDeferContent(engineContext, [], {});
            // The deferNode is used to populate oj-defer element on mount and to clean it up on unmount.
            let deferNode;
            const deferProps = [
                // The ref callback is used in order to add BindDom component as a child of oj-defer
                // when the element is mounted, then clean up when the element is unmounted,
                // i.e. when refObj is set to null.
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
        /**
         * Creates AST node for oj-bind-if element.
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {Element} node
         */
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
        /**
         * Creates AST node for oj-if element.
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {Element} node
         */
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
        /**
         * Creates AST for 'test' attribute on oj-if and oj-bind-if nodes as conditional expression.
         * @param engineContext
         * @param node
         */
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
        /**
         * Creates AST node for BindForEachWrapper virtual component that will replace oj-bind-for-each element.
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {Element} node
         */
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
        /**
         * Creates AST node for inner oj-bind-for-each template
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {Element} template
         */
        _createNestedTemplateRendererNode(engineContext, template) {
            const templateAlias = template.getAttribute('data-oj-as');
            // The UNWRAP_EXTRAS property contains a function used by an expression evaluator
            // to handle 'observableIndex' property which is a special case - the 'observableIndex' is function,
            // but it should behave as an observable.
            const foreachEngineContext = {
                [BINDING_PROVIDER]: engineContext[BINDING_PROVIDER],
                [BINDING_CONTEXT]: engineContext[BINDING_CONTEXT],
                [COMPONENT_ELEMENT]: engineContext[COMPONENT_ELEMENT],
                [TEMPLATE_ELEMENT]: engineContext[TEMPLATE_ELEMENT],
                [TEMPLATE_ALIAS]: engineContext[TEMPLATE_ALIAS],
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
                    const proxy = this._createProxyForCurrentObj(props);
                    const extension = { $current: proxy };
                    if (templateAlias != null) {
                        extension[templateAlias] = proxy;
                    }
                    // We are not going through _getContext() becasue we never want to get the bidning context from
                    // the parent element and call .extend() on it
                    const context = Object.assign({}, $context, extension);
                    return this._cspEvaluator.evaluate(ast, { $context: context, $h: preact.h });
                };
            });
        }
        /**
         * Creates AST node for HTML element not covered by special cases - oj-bind-*
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {Element} node
         */
        _createElementNode(engineContext, node) {
            const props = this._getElementProps(engineContext, node);
            const tagName = node.tagName;
            const localName = tagName.toLowerCase();
            const compMetadata = ojcustomelementRegistry.getMetadata(tagName);
            const extendedProps = this._createPossiblyProvidedAndConsumedProperties(localName, engineContext, compMetadata, props);
            const elementNode = this._createHFunctionCallNode(localName, [
                // properties
                this._reorderProps(extendedProps),
                // children
                this._createAst(engineContext, Array.from(node.childNodes))
            ]);
            if (node.hasAttribute('data-oj-manage-tabs')) {
                // JET-54400 - support legacy tabbable mode in template compilation
                // Wrap the node that has data-oj-manage-tabs into ManageTabStops component.
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
        /**
         * Reorders resolved properties of a given AST node that represents element properties.
         * When the resolved properties object contains private identifiers, those are placed at the start of the object.
         * @param {object} propertyNode AST node which can be an ObjectExpression or a CallExpression that resolves into properties.
         * @returns {object}
         */
        _reorderProps(propertyNode) {
            const extraArgs = propertyNode.type == ojexpparser.OBJECT_EXP ? [propertyNode] : undefined;
            const isCallExpression = propertyNode.type == ojexpparser.CALL_EXP;
            const reorderProps = (originalProps) => {
                if (!originalProps.__oj_private_identifier_to_prop) {
                    return originalProps;
                }
                const { __oj_private_identifier_to_prop, __oj_private_identifier_to_value, ...remainingProps } = originalProps;
                return {
                    __oj_private_identifier_to_prop,
                    __oj_private_identifier_to_value,
                    ...remainingProps
                };
            };
            const callback = (context, resolvedProps) => {
                const originalProps = isCallExpression
                    ? this._cspEvaluator.evaluate(propertyNode, { $context: context, $h: preact.h, BindDom })
                    : resolvedProps;
                return reorderProps(originalProps);
            };
            return this._createCallNodeWithContext(callback, extraArgs);
        }
        /**
         * For properrties that have provide and/or consume metadata, adds code to store provided values
         * on the runtime context ($context) and to retrieve consumed values from the runtime context
         * @param localTagName
         * @param engineContext
         * @param provideConsumeMeta
         * @param props
         */
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
            // eslint-disable-next-line no-restricted-syntax
            for (const [pName, meta] of provideConsumeMeta) {
                const consumeMeta = meta[1];
                if (consumeMeta) {
                    if (pName === ojbindpropagation.CONSUMED_CONTEXT) {
                        // Pass context values via __oj_provided_contexts property to make it available to the
                        // EnvironmentWrapper class.
                        // Note that we cannot use __oj_private_contexts property here as it is done in CustomElementBinding code.
                        // This context will be processed by EnvironmentWrapper class and that needs to differenciate between
                        // provided context and stale context on memoized Preact children. See JET-68575 for use-case.
                        // The EnvironmentWrapper will use the providedValues,  determines what should be set as __oj_private_contexts property.
                        // Then __oj_private_contexts value will be used by ComponentWithContext class to create appropriate Preact context providers.
                        consumingProps.push({
                            type: ojexpparser.PROPERTY,
                            key: { type: ojexpparser.LITERAL, value: '__oj_provided_contexts' },
                            value: this._createCallNodeWithContext(($ctx) => {
                                let providedValues;
                                const provided = unwrap($ctx)?.[_PROVIDED_KEY];
                                consumeMeta.forEach((preactContext) => {
                                    if (provided?.has(preactContext)) {
                                        if (!providedValues) {
                                            providedValues = new Map();
                                        }
                                        providedValues.set(preactContext, unwrap(provided.get(preactContext)));
                                    }
                                });
                                return providedValues;
                            })
                        });
                    }
                    else if (
                    // check for the original property name and the uppercase version in case we are setting an attribute with an uppercase for automatic coercion by the component
                    !(specifiedProps.has(pName) ||
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
                                // check for a literal value set as an uppercase attribute
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
        /**
         * Creates AST node for BindDom virtual component. The BindDom component will receive
         * a configuration wrapped into a Promise and a binding provider (if available)
         * to handle ko mutations.
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {Element} node
         */
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
        /**
         * Create AST node for the specified preact component.
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {Element} node
         * @param {BindDom} component vcomponent constructor
         * @param {Array} extraProps extra properties to be passed to the virtual component
         */
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
        /**
         * Converts class name values into space separated string.
         * @param val
         */
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
        /**
         * The method processes attributes on the given node and converts them into an array of AST nodes
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param node
         */
        _getElementProps(engineContext, node) {
            let styleValue; // the value for the "style" attribute as a whole
            const dotStyleValues = []; // individual styles bound with the :style.xxx syntax
            const dottedExpressions = [];
            const writebacks = new Map();
            const listeners = new Map();
            // See JET-69225. The identifiersMap is used to accumulate identifiers bound to
            // non-primitive property types in JET components. The map
            // has prop->[..identifiers] structure, since each property is evaluated separately.
            const identifiersMap = new Map();
            let shouldCreateIdentifierProps = false;
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
                            // TODO: deal with native attributes with non-standard property names (we need getNativePropForAttr())
                            name = ojcustomelementUtils.AttributeUtils.attributeToPropertyName(name);
                        }
                        acc.push(this._createPropertyNode(engineContext, name, value));
                    }
                }
                else {
                    const expValue = ojcustomelementUtils.AttributeUtils.getExpressionInfo(value);
                    if (ojcustomelementUtils.AttributeUtils.isEventListenerAttr(name)) {
                        // At the moment we will just push a listener into the listeners array
                        // in order to process them later when we done with writeback properties,
                        // because some of the listeners should be wrapped into writeback callback.
                        name = ojcustomelementUtils.AttributeUtils.eventAttrToPreactPropertyName(name);
                        listeners.set(name, value);
                    }
                    else if (ojcustomelementUtils.AttributeUtils.isGlobalOrData(name)) {
                        acc.push(this._createPropertyNode(engineContext, ojcustomelementUtils.AttributeUtils.getGlobalPropForAttr(name), value));
                    }
                    else {
                        const propName = ojcustomelementUtils.AttributeUtils.attributeToPropertyName(name);
                        const propNamePath = propName.split('.');
                        // Check whether we need to store identifiers for this component/property combination.
                        const keepIdentifiersForProp = this._keepIdentifiers(node, propNamePath[0]);
                        shouldCreateIdentifierProps = shouldCreateIdentifierProps || keepIdentifiersForProp;
                        if (expValue.expr) {
                            const propMeta = ojmetadatautils.getPropertyMetadata(propNamePath[0], ojcustomelementRegistry.getPropertiesForElementTag(node.tagName));
                            // Check property metadata for readonly case.
                            if (!propMeta?.readOnly) {
                                if (propNamePath.length > 1) {
                                    // handle dotted properties
                                    // We will accumulate the nested properties and handle them later all together by setting them via 'ref' object callback.
                                    // In this case we are able to handle all property types including objects.
                                    dottedExpressions.push({ subProps: propName, expr: expValue.expr });
                                }
                                else {
                                    // Callback used to populate identifiersMap.
                                    const identifiersCallbackFn = keepIdentifiersForProp
                                        ? (items) => {
                                            identifiersMap.set(propName, items);
                                        }
                                        : null;
                                    acc.push({
                                        type: ojexpparser.PROPERTY,
                                        key: { type: ojexpparser.LITERAL, value: propName },
                                        value: this._createExpressionEvaluator(engineContext, expValue.expr, null, identifiersCallbackFn)
                                    });
                                }
                            }
                            // Handle writeback expressions
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
                            // An event listener with a literal property must be an inline event handler.
                            // While this is not CSP-compliant, we don't want to regress this case, so we'll
                            // continue setting these as attributes so that Preact doesn't complain when it tries
                            // to process the prop with a non-function value
                            acc.push({
                                type: ojexpparser.PROPERTY,
                                key: { type: ojexpparser.LITERAL, value: name.toUpperCase() },
                                value: { type: ojexpparser.LITERAL, value: value }
                            });
                        }
                        else {
                            // This is the case where the template contains a literal value.
                            // The value is coerced the same way as it is done by custom element setters and set
                            // as a property. Object and array values are cached.
                            // Notice that we are using the same 'ref' property approach
                            // for the complex (dotted) properties as it is done for the expressions in the code
                            // above.
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
                    attrNodes.push(this._createEventListenerPropertyNode(engineContext, name, info.expr));
                }
            });
            // Populate private properties dedicated to expression identifiers if those are discovered
            if (shouldCreateIdentifierProps) {
                this._populateIdentifierProps(engineContext, attrNodes, identifiersMap);
            }
            return attrNodes;
        }
        /**
         * Gets the literal value for the property.
         * The value is coerced the same way as it is done by custom element setters (See JET-44940).
         * Complex literal values are stored in the cache and shared across templates with the same id.
         * It is done to cover the use-case when the same template is cloned by the caller on update (see JET-70375),
         * we expect the literals to stay identical for the cloned templates. The goal here is to make Preact
         * to recognize those values as identical on updates and avoid running extra setProperty() call.
         *
         * @param engineContext
         * @param propName
         * @param value
         */
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
        /**
         * Creates AST node for the 'ref' property with a callback to the parent element.
         * This is done is order to support nested properties that might be bound to expressions
         * that resolve into objects.
         * @param engineContext engine context object for the template
         * @param dottedExpressions an array of objects with the following struture:
         *   - subProps - a string that represents a subproperty chain for a dotted attribute
         *   - expr - an expression that should be resolved and set to the subprop branch or it might be a object
         *          that contains a LITERAL value and a type that indicates that the value should be treated as literal.
         * @return {PROP_NODE} AST node for the 'ref' property
         */
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
                // _createCallNodeWithContext will pass both $context and an array of resolved dot properties to its callback.
                // We will be using bind() as the implementation of the callback to pre-bind the first argument (resolved nested properties) to the
                // static ref callback implementation below.
                // So the function being passed to _createCallNodeWithContext() is actually Function.prototype.bind.
                // Being an unbound function, it needs to be pre-bound to cb
                value: this._createCallNodeWithContext(Function.prototype.bind.bind(cb, engineContext[BINDING_PROVIDER]), [dottedPropsArrayNode])
            };
        }
        static _nestedPropsRefCallback(bindingProvider, resolvedSubPropValues, refObj) {
            if (refObj && refObj.setProperties) {
                // Filter out property values that have not changed
                const oldValues = VTemplateEngine._getPreviousNestedPropValues(refObj);
                const modifiedSubPropValues = resolvedSubPropValues.filter((record) => {
                    const propPath = Object.keys(record)[0]; // only one key is expected in the object
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
        /**
         * Creates AST node for on[Value]Changed event listener to support value writeback.
         * Since the element might have multiple writable subproperties, the method sets a listener for the top level property,
         * which will handle writebacks for all subroperties.
         *
         * If the element already had the listener, then that listener will be wrapped into created callback
         * which will updated the value, then call the original listener.
         *
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {string} property name
         * @param {string} eventPropName on[Value]Changed listener prop name
         * @param {Array<{subProps:Array<string>, expr: string}>} valuesArray an array of objects with the following fiends:
         *      - subProps - an array of subproperties for a single dotted attribute chain, e.g. nested-prop.sub-prop.sub-sub-prop = '[[expr]]'
         *      - expr - a writable expression for the given dotted attribute
         * @param {string | undefined} existingCallbackExpr existing on[Value]Changed expression
         * @returns object
         */
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
                        // Then call existing callback if it is available.
                        if (existingCallbackExpr && !callbackExprEvaluator) {
                            callbackExprEvaluator =
                                this._cspEvaluator.createEvaluator(existingCallbackExpr).evaluate;
                        }
                        const existingCallback = callbackExprEvaluator
                            ? callbackExprEvaluator([bindingContext, bindingContext.$data])
                            : null;
                        if (existingCallback) {
                            existingCallback(event, _proxyUnwrap(bindingContext.$current) || bindingContext.$data, bindingContext);
                        }
                    };
                })
            };
        }
        /**
         * Creates AST node for an event listener.
         * An original listener will be wrapped into a function in order to pass additional arguments to the listener.
         * @param {string} propName listener property name
         * @param {string} propExpr listener property expression
         * @returns {PROP_NODE}
         */
        _createEventListenerPropertyNode(engineContext, propName, propExpr) {
            let propExprEvaluator;
            return {
                type: ojexpparser.PROPERTY,
                key: { type: ojexpparser.LITERAL, value: propName },
                value: this._createCallNodeWithContext((bindingContext) => {
                    return (event) => {
                        if (!propExprEvaluator) {
                            propExprEvaluator = this._cspEvaluator.createEvaluator(propExpr).evaluate;
                        }
                        const unwrappedContext = _unwrapBindingContext(bindingContext, engineContext[TEMPLATE_ALIAS]);
                        const listener = propExprEvaluator([unwrappedContext, unwrappedContext.$data]);
                        if (listener) {
                            listener(event, unwrappedContext.$current || unwrappedContext.$data, unwrappedContext);
                        }
                    };
                })
            };
        }
        /**
         * Creates AST node that for expression evaluation
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param attrVal
         * @param postprocess
         */
        _createExpressionNode(engineContext, attrVal, postprocess) {
            const info = ojcustomelementUtils.AttributeUtils.getExpressionInfo(attrVal);
            return info.expr
                ? this._createExpressionEvaluator(engineContext, info.expr, postprocess)
                : { type: ojexpparser.LITERAL, value: attrVal };
        }
        /**
         * Creates an AST node for expression type.
         * The function will trigger Proxy wrapper around $current property when the property is accessed.
         * The identifiers for the given expression are accumulated on this._expressionPaths member and
         * will be used when identifiersCallbackFn is present.
         * @param {VTemplateEngineContext} engineContext engine context object for the template
         * @param {string} exp expression to be evaluated
         * @param {Function} postprocess
         * @param {Function} identifiersCallbackFn callback used to populate identifiersMap
         * @return callback function that evaluates an expression based on context
         */
        _createExpressionEvaluator(engineContext, exp, postprocess, identifiersCallbackFn) {
            const delegateEvaluator = this._cspEvaluator.createEvaluator(exp).evaluate;
            return this._createCallNodeWithContext(($context) => {
                this._expressionPaths = [];
                const unwrap = this._getUnwrapObservable(engineContext);
                const context = unwrap($context);
                const value = delegateEvaluator([context, context.$data]);
                let unwrapped = unwrap(value);
                if (engineContext[UNWRAP_EXTRAS]) {
                    unwrapped = engineContext[UNWRAP_EXTRAS](exp, unwrapped);
                }
                if (identifiersCallbackFn) {
                    // Clone paths array in the process of fixing each path by appending $current
                    // as root to create a valid expression.
                    identifiersCallbackFn(this._expressionPaths.map((item) => {
                        return { identifier: `$current.${item.identifier}`, value: item.value };
                    }));
                }
                this._expressionPaths = null;
                return postprocess ? postprocess(unwrapped) : unwrapped;
            });
        }
        /**
         * Checks if identifiers should be kept for a given property.
         * @param node
         * @param propName
         * @returns true the node is a JET component and the given property is not a primitive type.
         */
        _keepIdentifiers(node, propName) {
            if (!ojcustomelementRegistry.isElementRegistered(node.tagName))
                return false;
            const propMeta = ojmetadatautils.getPropertyMetadata(propName, ojcustomelementRegistry.getPropertiesForElementTag(node.tagName));
            if (!propMeta)
                return false;
            // Keep identifiers for non-primitive types only - object/array/other/any
            const types = ojcustomelementUtils.ElementUtils.getSupportedTypes(propMeta.type);
            return !!(types.object || types.array || types.other || types.any);
        }
        /**
         * The method is dedicated for creation __oj_private_identifier_to_prop and __oj_private_identifier_to_value
         * for JET components. The values for the properties will be populated at the evaluation time when
         * identifiersMap has fresh entries for the current evaluation cucle.
         * When the identifiersMap is empty, the property value will be set to an empty map to indicate
         * that the component is created by VComponentTemplate and we should handle it the property differently.
         * @param {VTemplateEngineContext} engineContext Engine context object for the template.
         * @param {object[]} attrNodes Array of attribute nodes.
         * @param {Map<string, TemplateIdentifierType>} identifiersMap map of prop -> [...identifiers], the map was populated
         *                                             by evaluation of each property for the component.
         */
        _populateIdentifierProps(engineContext, attrNodes, identifiersMap) {
            // Helper method for inverting a given identifiersMap.
            function invertMap(origMap) {
                const inverted = new Map();
                origMap.forEach((values, key) => {
                    values.forEach(({ identifier }) => {
                        if (!inverted.has(identifier)) {
                            inverted.set(identifier, []);
                        }
                        inverted.get(identifier).push(key);
                    });
                });
                return inverted;
            }
            attrNodes.push({
                type: ojexpparser.PROPERTY,
                key: { type: ojexpparser.LITERAL, value: '__oj_private_identifier_to_prop' },
                value: this._createCallNodeWithContext(() => {
                    // Convert map into identifier -> [...props] from
                    // prop -> [...identifiers] format.
                    // Set it as a plain object, that would allow deep compare method to work.
                    return Object.fromEntries(invertMap(identifiersMap));
                })
            });
            attrNodes.push({
                type: ojexpparser.PROPERTY,
                key: { type: ojexpparser.LITERAL, value: '__oj_private_identifier_to_value' },
                value: this._createCallNodeWithContext(($context) => {
                    const indentifierToValue = {};
                    const processedIdentifiers = new Set();
                    identifiersMap.forEach((values) => {
                        values.forEach(({ identifier, value }) => {
                            if (!processedIdentifiers.has(identifier)) {
                                const unwrap = this._getUnwrapObservable(engineContext);
                                indentifierToValue[identifier] = unwrap(value);
                                processedIdentifiers.add(identifier);
                            }
                        });
                    });
                    return indentifierToValue;
                })
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
        /**
         * A helper method for an AST node for h() function call that creates a specified
         * element with the provided properties.
         * @param elementName element to create
         * @param extraArgs an array of element properties
         */
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
        /**
         * A helper method that creates an AST for the attribute value. The value might be an expression or a litaral.
         * The AST can be used to accumulate props for _createCallNodeWithContext() call that takes extra args, resolved them and
         * passes them into a given callback
         * @param engineContext
         * @param key the property will be created with the given key
         * @param value value that can be an expression or a literal
         */
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
        /**
         * Retrieves a writer function from the given evaluator object.
         * @param {object} evaluator
         */
        _getWriter(evaluator) {
            return evaluator['_ko_property_writers'];
        }
        /**
         * Creates an expression that will be used for writing into a non-observable property.
         * @param {string} expression writeback property
         * @return {string} expression that contains a writeback function that will be evaluated against context
         *                and used for updating the value.
         */
        _getPropertyWriterExpression(expression) {
            const _ASSIGNMENT_TARGET_EXP = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;
            const reserveddWords = ['true', 'false', 'null', 'undefined'];
            if (expression == null || reserveddWords.indexOf(expression) >= 0) {
                return null;
            }
            // Remove the white space on both ends to ensure that the _ASSIGNMENT_TARGET_EXP regexp
            // is matched properly
            // eslint-disable-next-line no-param-reassign
            expression = expression.trim();
            // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
            // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
            // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']];).
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
