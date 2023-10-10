/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
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
    var _a, _b;
    return (_b = (_a = getElementRegistration(tagName)) === null || _a === void 0 ? void 0 : _a.composite) !== null && _b !== void 0 ? _b : false;
}
function isVComponent(tagName) {
    var _a, _b;
    return (_b = (_a = getElementRegistration(tagName)) === null || _a === void 0 ? void 0 : _a.vcomp) !== null && _b !== void 0 ? _b : false;
}
function isElementRegistered(tagName) {
    return _CUSTOM_ELEMENT_REGISTRY[tagName] != null;
}
function getElementRegistration(tagName) {
    var _a;
    return (_a = _CUSTOM_ELEMENT_REGISTRY[tagName]) !== null && _a !== void 0 ? _a : null;
}
function getElementDescriptor(tagName) {
    var _a;
    return ((_a = getElementRegistration(tagName)) === null || _a === void 0 ? void 0 : _a.descriptor) || {};
}
function getElementProperties(element) {
    return getPropertiesForElementTag(element.tagName);
}
function getMetadata(tagName) {
    var _a, _b;
    const descriptor = getElementDescriptor(tagName);
    return (_b = (_a = descriptor['_metadata']) !== null && _a !== void 0 ? _a : descriptor.metadata) !== null && _b !== void 0 ? _b : {};
}
function getPropertiesForElementTag(tagName) {
    var _a;
    return (_a = getMetadata(tagName).properties) !== null && _a !== void 0 ? _a : {};
}

export { getElementDescriptor, getElementProperties, getElementRegistration, getMetadata, getPropertiesForElementTag, isComposite, isElementRegistered, isVComponent, registerElement, tagNameToElementClassName };
