/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const _CUSTOM_ELEMENT_REGISTRY = {};
function registerElement(tagName, regObj, constructor) {
    const tagNameUpper = tagName.toUpperCase();
    if (!_CUSTOM_ELEMENT_REGISTRY[tagNameUpper]) {
        if (!regObj.descriptor) {
            throw new Error(`Custom element ${tagName} must be registered with a descriptor.`);
        }
        _CUSTOM_ELEMENT_REGISTRY[tagName] = regObj;
        _CUSTOM_ELEMENT_REGISTRY[tagNameUpper] = regObj;
        Object.defineProperty(constructor, 'name', {
            value: tagNameToElementClassName(tagName)
        });
        customElements.define(tagName, constructor);
    }
}
function tagNameToElementClassName(tagName) {
    return (tagName
        .toLowerCase()
        .match(/-(?<match>.*)/)[0]
        .replace(/-(.)/g, (match, group1) => group1.toUpperCase()) + 'Element');
}
function isComposite(tagName) {
    return getElementRegistration(tagName)?.composite ?? false;
}
function isVComponent(tagName) {
    return getElementRegistration(tagName)?.vcomp ?? false;
}
function isElementRegistered(tagName) {
    return _CUSTOM_ELEMENT_REGISTRY[tagName] != null;
}
function getElementRegistration(tagName) {
    return _CUSTOM_ELEMENT_REGISTRY[tagName] ?? null;
}
function getElementDescriptor(tagName) {
    return getElementRegistration(tagName)?.descriptor || {};
}
function getElementProperties(element) {
    return getPropertiesForElementTag(element.tagName);
}
function getMetadata(tagName) {
    const descriptor = getElementDescriptor(tagName);
    return descriptor['_metadata'] ?? descriptor.metadata ?? {};
}
function getPropertiesForElementTag(tagName) {
    return getMetadata(tagName).properties ?? {};
}

export { getElementDescriptor, getElementProperties, getElementRegistration, getMetadata, getPropertiesForElementTag, isComposite, isElementRegistered, isVComponent, registerElement, tagNameToElementClassName };
