/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { contextFor, computed, observable, cleanNode, pureComputed } from 'knockout';
import BindingProviderImpl from 'ojs/ojkoshared';
import Context from 'ojs/ojcontext';
import { TemplateEngineUtils, PreactTemplate } from 'ojs/ojtemplateengine-utils';

class PreactTemplateEngineKo {
    constructor() {
        this._defaultProps = new Map();
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
            return this._executeVDomTemplate(templateElement, context);
        }
        throw new Error(`The render property is expected on the template for component ${componentElement.id}`);
    }
    clean(node) {
        let vdomTemplateRoots = PreactTemplate.findTemplateRoots(node);
        vdomTemplateRoots.forEach((root) => {
            PreactTemplate.clean(root);
        });
        return vdomTemplateRoots.length === 0 ? cleanNode(node) : null;
    }
    resolveProperties(componentElement, node, elementTagName, propertySet, data, alias, propertyValidator, alternateParent) {
        const renderFunc = node.render;
        if (renderFunc) {
            const defaultProps = TemplateEngineUtils.getResolvedDefaultProps(this._defaultProps, elementTagName, propertySet);
            return PreactTemplate.resolveVDomTemplateProps(node, renderFunc, elementTagName, propertySet, data, defaultProps, propertyValidator);
        }
        throw new Error(`The render property is expected on the template for component ${componentElement.id}`);
    }
    defineTrackableProperty(target, name, value, changeListener) {
        TemplateEngineUtils.createPropertyBackedByObservable(this._bindingProvider, target, name, value, changeListener);
    }
    _executeVDomTemplate(templateElement, context) {
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
                return templateElement.render(context.$current);
            }
        })
            .extend({ rateLimit: { timeout: 0, method: customThrottle } });
        const vNode = computedVNode();
        PreactTemplate.extendTemplate(templateElement, PreactTemplate._ROW_CACHE_FACTORY, (renderer) => {
            templateElement._cachedRows.forEach((rowItem) => {
                let newVNode = renderer(rowItem.currentContext);
                PreactTemplate.renderNodes(newVNode, rowItem);
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
        PreactTemplate.renderNodes(vNode, cachedRow);
        templateElement._cachedRows.push(cachedRow);
        computedVNode.subscribe((newVNode) => {
            const currRow = templateElement._cachedRows.find((row) => row.computedVNode === computedVNode);
            if (currRow) {
                PreactTemplate.renderNodes(newVNode, currRow);
            }
        });
        return cachedRow.nodes;
    }
}

var index = new PreactTemplateEngineKo();

export default index;
