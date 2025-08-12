/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const _CUSTOM_ELEMENT_REGISTRY = {};
/**
 * Registers a custom element within the JET custom element registry.
 * The register is case insensitive when performing lookups.
 * This method does not register a custom element with the browser's customElements
 * API and should not be called directly by a JET component. Returns true
 * if the element is successfully registered.
 * @param tagName
 * @param regObj
 * @ignore
 */
function registerElement(tagName, regObj, constructor) {
    const tagNameUpper = tagName.toUpperCase();
    if (!_CUSTOM_ELEMENT_REGISTRY[tagNameUpper]) {
        if (!regObj.descriptor) {
            throw new Error(`Custom element ${tagName} must be registered with a descriptor.`);
        }
        // Register custom element under passed in tag name and an all upper version
        // so we can avoid a toUpperCase() call for each registry lookup.
        _CUSTOM_ELEMENT_REGISTRY[tagName] = regObj;
        _CUSTOM_ELEMENT_REGISTRY[tagNameUpper] = regObj;
        Object.defineProperty(constructor, 'name', {
            value: tagNameToElementClassName(tagName)
        });
        customElements.define(tagName, constructor);
    }
}
/**
 * Converts a custom element tag name to the name used for the
 * element type and class name, e.g. oj-some-component -> SomeComponentElement
 * @param tagName
 * @ignore
 */
function tagNameToElementClassName(tagName) {
    return (tagName
        .toLowerCase()
        .match(/-(?<match>.*)/)[0]
        .replace(/-(.)/g, (match, group1) => group1.toUpperCase()) + 'Element');
}
/**
 * Returns true if the given tag name is registered as a Composite component
 * within the case insensitive JET custom element registry.
 * @param tagName
 * @ignore
 */
function isComposite(tagName) {
    return getElementRegistration(tagName)?.composite ?? false;
}
/**
 * Returns true if the given tag name is registered as a VComponent
 * within the case insensitive JET custom element registry.
 * @param tagName
 * @ignore
 */
function isVComponent(tagName) {
    return getElementRegistration(tagName)?.vcomp ?? false;
}
/**
 * Returns true if a given tag name is registered within the case insensitive
 * JET custom element registry.
 * @param tagName
 * @ignore
 */
function isElementRegistered(tagName) {
    return _CUSTOM_ELEMENT_REGISTRY[tagName] != null;
}
/**
 * Returns the registration object for a tag name within the case insensitive
 * JET custom element registry or null if not found.
 * @param tagName
 * @ignore
 */
function getElementRegistration(tagName) {
    return _CUSTOM_ELEMENT_REGISTRY[tagName] ?? null;
}
/**
 * Returns the descriptor for a given tag name within the case insensitive
 * JET custom element registry
 * or an empty object if not found.
 * @param tagName
 * @ignore
 */
function getElementDescriptor(tagName) {
    return getElementRegistration(tagName)?.descriptor || {};
}
/**
 * Returns the component properties for a given element
 * JET custom element registry
 * or an empty object if not found.
 * @param element
 * @ignore
 */
function getElementProperties(element) {
    return getPropertiesForElementTag(element.tagName);
}
/**
 * Returns the component metadata for a given uppercase tag name within the case insensitive
 * JET custom element registry or an empty object if not found.
 * @param tagName uppercase tag name
 * @ignore
 */
function getMetadata(tagName) {
    // Composites add event listener metadata and store in _metadata so check there first
    const descriptor = getElementDescriptor(tagName);
    return descriptor['_metadata'] ?? descriptor.metadata ?? {};
}
/**
 * Returns the component properties for a given the uppercase tag name within the case insensitive
 * JET custom element registry
 * or an empty object if not found.
 * @param tagName uppercase tag name
 * @ignore
 */
function getPropertiesForElementTag(tagName) {
    return getMetadata(tagName).properties ?? {};
}

export { getElementDescriptor, getElementProperties, getElementRegistration, getMetadata, getPropertiesForElementTag, isComposite, isElementRegistered, isVComponent, registerElement, tagNameToElementClassName };
