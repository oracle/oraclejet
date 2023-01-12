/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { TemplateEngineUtils, PreactTemplate } from 'ojs/ojtemplateengine-utils';

class PreactTemplateEngine {
    constructor() {
        this._defaultProps = new Map();
    }
    execute(componentElement, templateElement, properties, alias, reportBusy) {
        const templateAlias = templateElement.getAttribute('data-oj-as');
        const context = TemplateEngineUtils.getContext(null, componentElement, templateElement, properties, alias, templateAlias);
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
        return null;
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
        throw new Error('This template engine does not support trackable property');
    }
    _executeVDomTemplate(templateElement, context) {
        const vNode = templateElement.render(context.$current);
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
            computedVNode: null,
            vnode: undefined,
            nodes: undefined
        };
        PreactTemplate.renderNodes(vNode, cachedRow);
        templateElement._cachedRows.push(cachedRow);
        return cachedRow.nodes;
    }
}

var index = new PreactTemplateEngine();

export default index;
