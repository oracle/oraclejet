/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['knockout', 'ojs/ojcore', 'ojs/ojkoshared', 'ojs/ojhtmlutils', 'ojs/ojlogger', 'ojs/ojcustomelement-utils', 'preact', 'ojs/ojcore-base', 'ojs/ojcontext', 'ojs/ojmetadatautils'], function (ko, oj, BindingProviderImpl, HtmlUtils, Logger, ojcustomelementUtils, preact, oj$1, Context, ojmetadatautils) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    BindingProviderImpl = BindingProviderImpl && Object.prototype.hasOwnProperty.call(BindingProviderImpl, 'default') ? BindingProviderImpl['default'] : BindingProviderImpl;
    oj$1 = oj$1 && Object.prototype.hasOwnProperty.call(oj$1, 'default') ? oj$1['default'] : oj$1;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    const ROW = Symbol('row');
    class PreactTemplate {
        static executeVDomTemplate(templateElement, context) {
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
            const computedVNode = ko.pureComputed({
                read: () => {
                    return templateElement.render(context.$current);
                }
            })
                .extend({ rateLimit: { timeout: 0, method: customThrottle } });
            const vNode = computedVNode();
            PreactTemplate._extendTemplate(templateElement, PreactTemplate._ROW_CACHE_FACTORY, (renderer) => {
                templateElement._cachedRows.forEach((rowItem) => {
                    let newVNode = renderer(rowItem.currentContext);
                    PreactTemplate._renderNodes(newVNode, rowItem);
                });
            });
            const parentStub = document.createElement('div');
            const cachedRow = {
                currentContext: context.$current,
                template: templateElement,
                parentStub,
                computedVNode,
                vnode: undefined,
                nodes: undefined
            };
            PreactTemplate._renderNodes(vNode, cachedRow);
            templateElement._cachedRows.push(cachedRow);
            computedVNode.subscribe((newVNode) => {
                const currRow = templateElement._cachedRows.find((row) => row.computedVNode === computedVNode);
                if (currRow) {
                    PreactTemplate._renderNodes(newVNode, currRow);
                }
            });
            return cachedRow.nodes;
        }
        static _renderNodes(vnode, row) {
            const parentStub = row.parentStub;
            let retrieveNodes = () => Array.from(parentStub.childNodes);
            if (row.nodes) {
                retrieveNodes = PreactTemplate._getRetrieveNodesFunction(row.nodes);
            }
            preact.render(vnode, parentStub);
            const nodes = retrieveNodes();
            nodes.forEach((node) => {
                if (node.setAttribute) {
                    node.setAttribute('data-oj-vdom-template-root', '');
                }
                node[ROW] = row;
                node[ojcustomelementUtils.CACHED_BINDING_PROVIDER] = 'preact';
            });
            row.vnode = vnode;
            row.nodes = nodes;
        }
        static clean(node) {
            const row = node[ROW];
            if (!row.cleaned) {
                row.cleaned = true;
                const reconnectNodes = PreactTemplate._getInsertNodesFunction(row.nodes);
                preact.render(null, row.parentStub);
                reconnectNodes(row.nodes);
                row.computedVNode.dispose();
                const template = row.template;
                const index = template._cachedRows.indexOf(row);
                template._cachedRows.splice(index, 1);
            }
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
            const metadata = ojcustomelementUtils.CustomElementUtils.getPropertiesForElementTag(elementTagName);
            const [cache, deleteEntry] = PreactTemplate._extendTemplate(template, PreactTemplate._COMPUTED_PROPS_CACHE_FACTORY, (recalc) => {
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
                    props[prop] = ojcustomelementUtils.transformPreactValue(null, ojmetadatautils.getPropertyMetadata(prop, metadata), targetNode.props[prop]);
                }
            });
            return props;
        }
        static _extendTemplate(node, initialCacheFactory, onRenderChanged) {
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
            if (this._sub && !oj$1.Object.compareValues(val, old)) {
                this._merged = this._getMergedValue(val);
                this._sub(this._merged);
            }
        }
        _getMergedValue(val) {
            return Object.assign({}, this._defaultProps, val);
        }
    }

    /**
     * Default JET Template engine iumplementation
     * @ignore
     */
    const JetTemplateEngine = function () {
      /**
       * Executes the template by deep-cloning the template nodes and then applying data bindings
       * @param {Element} componentElement component element
       * @param {Element} templateElement the <template> element
       * @param {Oject} properties data to be applied to the template
       * @param {string} alias an alias for referencing the data within a template
       * @param {Element} reportBusy - optional element for bubblng busy states outside of the template
       * @return {Array.<Node>} HTML nodes representing the result of the execution
       * @ignore
       */
      this.execute = function (componentElement, templateElement, properties, alias, reportBusy) {
        // Check to see if data-oj-as was defined on the template element as an additional
        // alias to provide to the template children
        var templateAlias = templateElement.getAttribute('data-oj-as');
        var context = _getContext(componentElement, templateElement, properties, alias, templateAlias);

        // The 'render' property on a template means that the template is a part of a VComponent.
        // The template will be processed with VDom methods.
        if (templateElement.render) {
          return PreactTemplate.executeVDomTemplate(templateElement, context);
        }
        var tmpContainer = _createAndPopulateContainer(templateElement, reportBusy);
        let stampedNodes = tmpContainer.childNodes;
        for (let i = 0; i < stampedNodes.length; i++) {
          const stampedNode = stampedNodes[i];
          // Set the binding provider on the stamped nodes in case the parent
          // component is a different binding provider
          stampedNode[ojcustomelementUtils.CACHED_BINDING_PROVIDER] = 'knockout';
        }
        ko.applyBindingsToDescendants(context, tmpContainer);

        return Array.prototype.slice.call(stampedNodes, 0);
      };

      /**
       * Cleans the node where bindings were previously applied
       * @param {Node} node the node to clean.  Note that this is not the template element,
       *        but rather, some node that contains the result of a previous call to execute()
       * @ignore
       */
      this.clean = function (node) {
        // Search for nodes created with VDom methods and let PreactTemplate clean them.
        let vdomTemplateRoots =
          node && node.querySelectorAll
            ? Array.from(node.querySelectorAll('[data-oj-vdom-template-root=""]'))
            : [];
        // Add the node itself to the array if it has the data-oj-vdom-template-root attribute
        if (node && node.hasAttribute && node.hasAttribute('data-oj-vdom-template-root')) {
          vdomTemplateRoots.push(node);
        }
        vdomTemplateRoots.forEach((root) => {
          PreactTemplate.clean(root);
        });
        return vdomTemplateRoots.length === 0 ? ko.cleanNode(node) : null;
      };

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
      this.resolveProperties = function (
        componentElement,
        node,
        elementTagName,
        propertySet,
        data,
        alias,
        propertyValidator,
        alternateParent
      ) {
        // The 'render' property on a template means that the template is a part of a VComponent.
        // The template will be processed with VDom methods
        const renderFunc = node.render;
        if (renderFunc) {
          const defaultProps = this._getResolvedDefaultProps(elementTagName, propertySet);
          return PreactTemplate.resolveVDomTemplateProps(node, renderFunc, elementTagName, propertySet,
              data, defaultProps, propertyValidator);
        }

        var templateAlias = node.getAttribute('data-oj-as');

        var context = _getContext(componentElement, node, data, alias, templateAlias);

        var contribs = _getPropertyContributorsViaCache(
          node,
          context,
          elementTagName,
          propertySet,
          alternateParent || componentElement
        );

        return _createComputed(contribs, context, propertyValidator);
      };

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
      this.defineTrackableProperty = function (target, name, value, changeListener) {
        _createPropertyBackedByObservable(target, name, value, changeListener);
      };

      function _createPropertyBackedByObservable(target, name, value, changeListener) {
        var obs = ko.observable(value);
        Object.defineProperty(target, name, {
          get: function () {
            return obs();
          },
          set: function (val) {
            obs(val);
            if (changeListener) {
              changeListener(val);
            }
          },
          enumerable: true
        });
      }

      var _propertyContribsCache = new WeakMap();

      function _createComputed(contribs, context, propertyValidator) {
        var computed = ko.pureComputed(function () {
          var boundValues = {};
          contribs.evalMap.forEach(function (evaluator, tokens) {
            var leafValue = ko.utils.unwrapObservable(evaluator(context));
            if (propertyValidator) {
              propertyValidator(tokens, leafValue);
            }
            boundValues[tokens[0]] = _getMergedValue(boundValues, tokens, leafValue);
          });
          var extend = oj.CollectionUtils.copyInto;
          var valueMap = extend({}, contribs.staticMap, null, true);
          valueMap = extend(valueMap, boundValues, null, true);

          return valueMap;
        });

        return _wrap(computed, ['peek', 'subscribe', 'dispose']);
      }

      function _wrap(delegate, methods) {
        var ret = {};
        methods.forEach(function (method) {
          ret[method] = delegate[method].bind(delegate);
        });
        return ret;
      }

      function _getPropertyContributorsViaCache(node, context, elementTagName, propertySet, parent) {
        var contribs = _propertyContribsCache.get(node);
        if (!contribs) {
          contribs = {};
          _propertyContribsCache.set(node, contribs);

          var tmpNode = _createAndPopulateContainer(node);
          var firstElem = tmpNode.querySelector(elementTagName);

          contribs.evalMap = _getPropertyEvaluatorMap(firstElem, propertySet, context);
          contribs.staticMap = _getStaticPropertyMap(firstElem, propertySet, parent);
        }
        return contribs;
      }

      function _getPropertyEvaluatorMap(firstElem, propertySet, context) {
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
              evalMap.set(
                propTokens,
                BindingProviderImpl.createBindingExpressionEvaluator(expr, context)
              );
            }
          }
        }
        return evalMap;
      }

      function _getStaticPropertyMap(firstElem, propertySet, parent) {
        var staticMap = {};
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

      function _getMergedValue(valuesObj, tokens, value) {
        if (tokens.length < 2) {
          return value;
        }
        var complexVal = valuesObj[tokens[0]] || {};
        var current = complexVal;
        var lastIndex = tokens.length - 1;

        for (var i = 1; i < lastIndex; i++) {
          var token = tokens[i];
          var newVal = current[token] || {};
          current[token] = newVal;
          current = newVal;
        }
        current[tokens[lastIndex]] = value;
        return complexVal;
      }

      function _createAndPopulateContainer(node, reportBusy) {
        var div = document.createElement('div');
        if (reportBusy) {
          div._ojReportBusy = reportBusy;
        }
        var nodes = HtmlUtils.getTemplateContent(node);
        for (var i = 0; i < nodes.length; i++) {
          div.appendChild(nodes[i]);
        }
        return div;
      }

      function _getContext(componentElement, node, properties, alias, templateAlias) {
        // Always use the binding context for the template  element
        // Note: the context for oj_bind_for_each template is stored on __ojBindingContext property.
        var bindingContext = node.__ojBindingContext ? node.__ojBindingContext : ko.contextFor(node);
        // In the rare case it's not defined, check the componentElement and log a message
        if (!bindingContext) {
          Logger.info(
            'Binding context not found when processing template for element with id: ' +
              componentElement.id +
              '. Using binding context for element instead.'
          );
          bindingContext = ko.contextFor(componentElement);
        }
        return BindingProviderImpl.extendBindingContext(
          bindingContext,
          properties,
          alias,
          templateAlias,
          componentElement
        );
      }

      this._getResolvedDefaultProps = function (elementTagName, propertySet) {
        let props = this._defaultProps.get(elementTagName);
        if (!props) {
          const elem = document.createElement(elementTagName); // @HTMLUpdateOK element tag name will always be one of JET elements
          props = _getStaticPropertyMap(elem, propertySet, document.body);
          this._defaultProps.set(elementTagName, props);
        }
        return props;
      };

      this._defaultProps = new Map();
    };

    var index = new JetTemplateEngine();

    return index;

});
