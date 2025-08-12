"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDoclets = generateDoclets;
exports.injectSharedContent = injectSharedContent;
exports.isExportedType = isExportedType;
const path_1 = __importDefault(require("path"));
const MetadataFileUtils_1 = require("../shared/MetadataFileUtils");
function generateDoclets(metaUtilObj) {
    const topContainerDoclet = metaUtilObj.fullMetadata.type === 'resource'
        ? getResourceDoclet(metaUtilObj)
        : getClassDoclet(metaUtilObj);
    const typeDefs = [];
    const properties = [];
    const methods = [];
    const events = [];
    const slots = [];
    let context = {
        topContainerDoclet,
        typeDefs,
        properties,
        methods,
        events,
        slots
    };
    metaUtilObj['context'] = context;
    createTypeDefs(metaUtilObj);
    createTypeDefsFromSignature(metaUtilObj);
    genericSignatureFixupForTypedefs(metaUtilObj);
    context.properties = getPropertyDoclets(metaUtilObj.fullMetadata.properties, topContainerDoclet, metaUtilObj);
    context.methods = getMethodDoclets(metaUtilObj, topContainerDoclet);
    context.events = getEventDoclets(metaUtilObj, topContainerDoclet);
    context.slots = getSlotDoclets(metaUtilObj, topContainerDoclet);
    // make sure that "result" array is added at the end so that we can get all the TypeDefs created during property processing
    return [
        context.topContainerDoclet,
        ...context.properties,
        ...context.methods,
        ...context.events,
        ...context.slots,
        ...getGestureFragments(topContainerDoclet),
        ...getObservedGlobalProps(metaUtilObj, topContainerDoclet),
        ...context.typeDefs
    ];
}
/**
 * Generates a top level modulecontainer type JSDoc doclet utility type source files.
 * @param metaUtilObj Utility object that collected utility function related metadata during the compilation process.
 * @returns
 */
function getResourceDoclet(metaUtilObj) {
    let refDoclet;
    let modContName = metaUtilObj.fullMetadata.name;
    // we will consider namespace to be the first part of the dash separated custom element name
    let namespace = modContName.split('-')[0].toLowerCase().trim();
    // if we are dealing with a pack, the namespace will be the pack name the component belongs to
    let pack = metaUtilObj.fullMetadata.pack || getPackNameFrom(metaUtilObj.fullMetadata['main']);
    if (pack) {
        namespace = pack;
    }
    const modContLongName = `${namespace}.${modContName}`;
    // should we get the first token of the custom element name (before the first dash) and that is the namespace for the component?
    refDoclet = {
        id: modContLongName,
        name: modContName,
        ojmodulecontainer: modContLongName,
        memberof: namespace,
        longname: modContLongName,
        kind: 'namespace',
        scope: 'static',
        meta: metaUtilObj.fullMetadata['jsdoc']['meta'],
        since: metaUtilObj.fullMetadata['since']
    };
    refDoclet.ojmodulecontainer = modContLongName;
    if (pack) {
        refDoclet.pack = pack;
    }
    if (metaUtilObj.fullMetadata['jsdoc']) {
        refDoclet.classdesc =
            metaUtilObj.fullMetadata['jsdoc'].description || metaUtilObj.fullMetadata.description || '';
        if (metaUtilObj.fullMetadata['jsdoc']['ignore']) {
            refDoclet.ojhidden = true;
        }
    }
    if (metaUtilObj.fullMetadata.status) {
        refDoclet.tsdeprecated = metaUtilObj.fullMetadata.status.filter((statObj) => statObj.type !== 'antiPattern');
    }
    let moduleName = getModuleNameFrom(metaUtilObj.fullMetadata['main']);
    if (!moduleName) {
        const dirName = refDoclet.meta.path;
        const arrDirs = path_1.default.resolve(dirName).split(path_1.default.sep);
        moduleName = arrDirs[arrDirs.length - 1];
        // if not a pack comp, the module will be the directory name the component
        // if the last folder is the version number, skip that
        if (!pack && moduleName === metaUtilObj.fullMetadata.version) {
            moduleName = arrDirs[arrDirs.length - 2];
        }
    }
    refDoclet.ojmodule = moduleName;
    return refDoclet;
}
/**
 * Generates a top level class type JSDoc doclet for the custom element.
 * @param metaUtilObj Utility object that collects custom element related metadata during the compilation process.
 * @returns
 */
function getClassDoclet(metaUtilObj) {
    let vcompdoclet;
    let custElemName = metaUtilObj.fullMetadata.name;
    // we will consider namespace to be the first part of the dash separated custom element name
    let namespace = custElemName.split('-')[0].toLowerCase().trim();
    // if we are dealing with a pack, the namespace will be the pack name the component belongs to
    let pack = metaUtilObj.fullMetadata.pack || getPackNameFrom(metaUtilObj.fullMetadata['main']);
    if (pack) {
        namespace = pack;
    }
    const vcompName = metaUtilObj.componentName;
    const vcompLongName = `${namespace}.${vcompName}`;
    vcompdoclet = {
        id: vcompLongName,
        name: vcompName,
        // should we get the first token of the custom element name (before the first dash) and that is the namespace for the component?
        memberof: namespace,
        kind: 'class',
        meta: metaUtilObj.fullMetadata['jsdoc']['meta'],
        ojcomponent: true,
        isvcomponent: true,
        since: metaUtilObj.fullMetadata['since']
    };
    vcompdoclet.longname = `${vcompdoclet['memberof']}.${vcompdoclet['name']}`;
    if (pack) {
        vcompdoclet.pack = pack;
    }
    if (metaUtilObj.fullMetadata['jsdoc']) {
        vcompdoclet.classdesc =
            metaUtilObj.fullMetadata['jsdoc'].description || metaUtilObj.fullMetadata.description || '';
        if (metaUtilObj.fullMetadata['jsdoc']['ignore']) {
            vcompdoclet.ojhidden = true;
        }
    }
    vcompdoclet.scope = 'static';
    // find if there are type parameters
    const typeParamsDeclaration = metaUtilObj.fullMetadata['classTypeParamsDeclaration'] || '';
    const typeParamsRef = metaUtilObj.fullMetadata['classTypeParams'] || '';
    vcompdoclet.tagWithoutBrackets = custElemName;
    vcompdoclet.tagWithBrackets = `<${custElemName}>`;
    vcompdoclet.domInterface = metaUtilObj.fullMetadata.implements[0];
    vcompdoclet.ojPageTitle = `&lt;${custElemName}>`;
    vcompdoclet.camelCaseName = vcompdoclet.name;
    vcompdoclet.ojPageTitlePrefix = 'Element: ';
    vcompdoclet.ojtsvcomponent = true;
    let signExpr = {
        target: 'Type',
        value: `interface ${vcompdoclet['domInterface']}${typeParamsDeclaration} extends JetElement<${vcompName}ElementSettableProperties${typeParamsRef}>`
    };
    if (typeParamsDeclaration) {
        signExpr['genericParameters'] = metaUtilObj.fullMetadata['jsdoc']['typeparams'];
    }
    vcompdoclet.tstype = signExpr;
    vcompdoclet.ojsignature = [signExpr];
    if (metaUtilObj.fullMetadata.status) {
        // for Class doclets (i.e., components), let (almost) ALL Status objects through
        // -- tsdeprecated.type values of "maintenance" and "supersedes" will be
        // recognized by the JET API Doc
        //vcompdoclet['tsdeprecated'] = [...metaUtilObj.fullMetadata.status];
        // TODO: Only pass 'antiPattern' type through once supported in API Doc (JET-58988)
        vcompdoclet.tsdeprecated = metaUtilObj.fullMetadata.status.filter((statObj) => statObj.type !== 'antiPattern');
    }
    if (metaUtilObj.fullMetadata.extension && metaUtilObj.fullMetadata.extension['themes']) {
        vcompdoclet.ojunsupportedthemes =
            metaUtilObj.fullMetadata.extension['themes']['unsupportedThemes'];
    }
    const dirName = vcompdoclet.meta.path;
    const arrDirs = path_1.default.resolve(dirName).split(path_1.default.sep);
    vcompdoclet.ojmodule = arrDirs[arrDirs.length - 1];
    // if not a pack comp, the module will be the directory name the component
    // if the last folder is the version number, skip that
    if (!pack && arrDirs[arrDirs.length - 1] === metaUtilObj.fullMetadata.version) {
        vcompdoclet.ojmodule = arrDirs[arrDirs.length - 2];
    }
    // data-mapping components like legend-item, legend-section, etc needs to be marked so that the API Doc can generate proper content
    // subcomponentType is the standard metadata to mark such components
    // however the API Doc looks for ojslotcomponent to generate content in such cases
    if (metaUtilObj.fullMetadata.subcomponentType) {
        vcompdoclet.ojslotcomponent = true;
    }
    return vcompdoclet;
}
/**
 * Creates a TypeDef doclet for each type used in the property declarations or in the class signature
 * The metadata for these TypeDefs were gathered in the typeDefinitions section of the global metadata object.
 */
function createTypeDefs(metaUtilObj) {
    if (metaUtilObj.typeDefinitions) {
        metaUtilObj.typeDefinitions.forEach((td) => {
            if (!td.coreJetModule) {
                createTypedef(td, metaUtilObj, getTopContainerDoclet(metaUtilObj));
            }
        });
    }
}
/**
 * Parses newly created TypeDefs and fixes up the generic signature for the TypeDefs making sure generic
 * signatures are using the fully qualified TypeDef names.
 * @param metaUtilObj Utility object that collects custom element related metadata during the compilation process.
 */
function genericSignatureFixupForTypedefs(metaUtilObj) {
    if (metaUtilObj['context'].typeDefs) {
        // loop through the newly created TypeDefs and fix up the generic signature by checking if the
        // signature contains any TypeDef names that belong to the component
        metaUtilObj['context'].typeDefs.forEach((td) => {
            if (td.tsgenerictype && td.tsgenerictype.value) {
                // if the TypeDef has a generic type, we need to fix up the signature
                // so that it can be used in the component's signature
                let typeDefSignature = td.tsgenerictype.value;
                metaUtilObj.typeDefinitions.forEach((td) => {
                    let regex = new RegExp('\\b' + td.name + '(?!\\.)\\b');
                    if (regex.test(typeDefSignature)) {
                        // if it's not a Core Jet type replace the original type ref name with the qualified name
                        // (core jet types will be handled in the jsdoc publisher)
                        if (!td.coreJetModule) {
                            //replace the TypeDef name in the original signature with the qualified name
                            const qualifiedName = `${getTopContainerDoclet(metaUtilObj).id}.${td.name}`;
                            typeDefSignature = typeDefSignature.replace(new RegExp('\\b' + td.name + '\\b', 'g'), qualifiedName);
                        }
                    }
                });
                // now set the updated signature back to the TypeDef doclet
                td.tsgenerictype.value = typeDefSignature;
            }
        });
    }
}
function createTypeDefsFromSignature(metaUtilObj) {
    //look for any possible typedefs (discovered during metadata discovery) that we will need to create for the component's signature
    if (metaUtilObj.fullMetadata['jsdoc']['typedefs']) {
        const typeDefMD = metaUtilObj.fullMetadata['jsdoc']['typedefs'];
        const topContainerDoclet = getTopContainerDoclet(metaUtilObj);
        let signArr = topContainerDoclet['ojsignature'];
        if (signArr && signArr.length) {
            let signature = signArr[0].value;
            typeDefMD.forEach((md) => {
                const td = createTypedef(md, metaUtilObj, topContainerDoclet);
                if (td && td.name) {
                    let regex = new RegExp('\\b' + td.name + '(?!\\.)\\b');
                    if (regex.test(signature)) {
                        //now replace the TypeDef name in the original signature with the qualified name
                        signature = signature.replace(new RegExp('\\b' + td.name + '\\b'), td.longname);
                    }
                }
            });
            signArr[0].value = signature;
        }
    }
}
function getObservedGlobalProps(metaUtilObj, topContainerDoclet) {
    let doclets = [];
    const properties = metaUtilObj.fullMetadata['observedGlobalProps'];
    for (const key in properties) {
        const prop = properties[key];
        const propName = key.toLowerCase();
        const propLongName = `${topContainerDoclet.longname}#${propName}`;
        let doclet = {
            id: propLongName,
            name: propName,
            memberof: topContainerDoclet.longname,
            meta: metaUtilObj.fullMetadata['jsdoc']['meta'],
            kind: 'member',
            longname: propLongName,
            observedGlobalProp: true,
            scope: 'instance',
            type: { names: [prop['type']] }
        };
        doclet.optional = prop['optional'];
        doclet.description = prop.description || '';
        if (prop['jsdoc']) {
            doclet.description = prop['jsdoc']['description'] || doclet['description'];
            if (prop['jsdoc']['ignore']) {
                doclet.ojhidden = true;
            }
        }
        if (prop.propertyEditorValues) {
            doclet.ojvalues = [];
            for (const enumKey in prop.propertyEditorValues) {
                doclet.ojvalues.push({
                    name: enumKey,
                    description: prop.propertyEditorValues[enumKey].description,
                    displayName: prop.propertyEditorValues[enumKey].displayName,
                    type: { names: ['string'] }
                });
            }
        }
        handleEnumValues(prop, doclet);
        doclets.push(doclet);
    }
    return doclets;
}
/**
 * Generates an array of JSDoc type property doclets for a given custom element VComponent.
 * @param properties The properties if the custom element collected during compilation phase.
 * @param parentDoclet The parent doclet of the currently processed property
 * @param metaUtilObj Utility object that collects custom element related metadata during the compilation process.
 * @param isArrayBased true if the type of the parent property is Array<object>
 * @returns
 */
function getPropertyDoclets(properties, parentDoclet, metaUtilObj, isArrayBased = false) {
    let doclets = [];
    for (const key in properties) {
        let typeIsTsSignature = false;
        const topContainerDoclet = getTopContainerDoclet(metaUtilObj);
        const prop = properties[key];
        const propName = parentDoclet.kind === 'class'
            ? key
            : isArrayBased
                ? `${parentDoclet.name}[].${key}`
                : `${parentDoclet.name}.${key}`;
        const propLongName = `${topContainerDoclet.longname}#${propName}`;
        let doclet = {
            id: propLongName,
            name: propName,
            memberof: topContainerDoclet.longname,
            meta: metaUtilObj.fullMetadata['jsdoc']['meta'],
            kind: 'member',
            longname: propLongName,
            scope: 'instance',
            type: { names: [prop['type']] }
        };
        doclet.optional = prop['optional'];
        if (prop.writeback) {
            doclet.ojwriteback = true;
        }
        if (prop.readOnly) {
            doclet.readonly = true;
        }
        doclet.description = prop.description || '';
        if (prop['jsdoc']) {
            doclet.description = prop['jsdoc']['description'] || doclet.description;
            if (prop['jsdoc']['ignore']) {
                doclet.ojhidden = true;
            }
        }
        // make sure we hide subprops of the parent doclet was also hidden
        if (parentDoclet && parentDoclet.ojhidden) {
            doclet['ojhidden'] = true;
        }
        if (prop.dynamicSlotDef) {
            doclet.dynamicSlotDef = prop.dynamicSlotDef;
        }
        let status;
        if (Array.isArray(prop.status)) {
            status = prop.status.filter((stat) => stat.type === 'deprecated');
            doclet.tsdeprecated = status;
        }
        if (prop.propertyEditorValues) {
            doclet.ojvalues = [];
            for (const enumKey in prop.propertyEditorValues) {
                doclet.ojvalues.push({
                    name: enumKey,
                    description: prop.propertyEditorValues[enumKey].description,
                    displayName: prop.propertyEditorValues[enumKey].displayName,
                    type: { names: ['string'] }
                });
            }
            // if we have deprecated property values, set the status on ojvalue
            if (status && status.some((stat) => stat.target === 'propertyValue')) {
                setStatusOnPropertyValues(doclet, status);
            }
        }
        if (prop.value !== undefined) {
            handlePropertyDefaultValue(prop, doclet);
        }
        typeIsTsSignature = handlePropertyType(prop, doclet, metaUtilObj, null);
        handleEnumValues(prop, doclet);
        doclets.push(doclet);
        if (typeIsTsSignature) {
            continue;
        }
        let currArrayBased = isObjectBasedArrayType(prop);
        if ((prop.properties && !isCoreJetTypeReference(prop)) || currArrayBased) {
            const subprops = prop.properties ? prop.properties : prop.extension['vbdt'].itemProperties;
            doclets = [...doclets, ...getPropertyDoclets(subprops, doclet, metaUtilObj, currArrayBased)];
        }
    }
    return doclets;
}
/**
 * Generates an array of JSDoc type method doclets for a given custom element VComponent.
 * @param metaUtilObj Utility object that collects custom element related metadata during the compilation process.
 * @param parentDoclet The parent VComponent doclet
 * @returns
 */
function getMethodDoclets(metaUtilObj, parentDoclet) {
    const methods = metaUtilObj.fullMetadata.methods;
    let doclets = [];
    for (const key in methods) {
        const method = methods[key];
        const name = key;
        const longName = `${parentDoclet.longname}#${name}`;
        let rtnDescription;
        let doclet = {
            id: longName,
            name,
            memberof: parentDoclet.longname,
            meta: metaUtilObj.fullMetadata['jsdoc']['meta'],
            kind: 'function',
            longname: longName,
            scope: 'instance',
            returns: [{ type: { names: [method.return] } }]
        };
        if (parentDoclet.ojmodulecontainer) {
            // this is an exported utility function so mark as being exported (for jsdoc)
            doclet.ojexports = true;
        }
        doclet.description = method.description || '';
        // make sure we clone original params because later on we will modify it to comply with the jsdoc doclet structure
        if (!doclet.params && Array.isArray(method.params)) {
            doclet.params = JSON.parse(JSON.stringify(method.params));
        }
        if (method['jsdoc']) {
            doclet.description = method['jsdoc']['description'] || doclet.description;
            rtnDescription = method['jsdoc']['returns'];
            if (method['jsdoc']['ignore']) {
                doclet.ojhidden = true;
            }
            // If there are any JSDoc-specific parameter descriptions, these will take precedence in the
            // generated API Doc
            if (doclet.params && method['jsdoc']['params']) {
                const jsdocParams = method['jsdoc']['params'];
                const findJSDocParam = (pname) => jsdocParams.find((param) => pname === param.name);
                doclet.params = doclet.params.map((param) => {
                    const found = findJSDocParam(param.name);
                    if (found && found.description) {
                        param.description = found.description;
                    }
                    return param;
                });
            }
        }
        // update the parameter type signature with any typedef if applicable
        if (doclet.params) {
            doclet.params = doclet.params.map((param) => {
                handleParameterType(param, metaUtilObj);
                return param;
            });
        }
        //TODO check param deprecation
        if (method.status) {
            doclet.tsdeprecated = method.status.filter((stat) => stat.type === 'deprecated');
        }
        if (rtnDescription) {
            doclet.returns[0]['description'] = rtnDescription;
        }
        handleMethodReturnType(method, doclet, metaUtilObj);
        doclets = doclets.concat(doclet);
    }
    return doclets;
}
/**
 * Generates an array of JSDoc type slot doclets for a given custom element VComponent.
 * @param metaUtilObj Utility object that collects custom element related metadata during the compilation process.
 * @param parentDoclet
 * @returns
 */
function getSlotDoclets(metaUtilObj, parentDoclet) {
    const slots = metaUtilObj.fullMetadata.slots;
    const dynamicTemplateSlots = metaUtilObj.fullMetadata.dynamicSlots;
    let dynamicSlot;
    // if we don't have dynamic template slots but we have dynamic slot instead...
    if (hasDynamicSlot(metaUtilObj)) {
        dynamicSlot = {
            '': {}
        };
    }
    return [
        ...processSlots(slots, parentDoclet, metaUtilObj),
        ...processSlots(dynamicTemplateSlots, parentDoclet, metaUtilObj, true),
        ...processSlots(dynamicSlot, parentDoclet, metaUtilObj, true)
    ];
}
function processSlots(slots, parentDoclet, metaUtilObj, isDynamic = false) {
    let doclets = [];
    for (const key in slots) {
        let isDefault = false;
        const slot = slots[key];
        if (key == '' && !isDynamic) {
            isDefault = true;
        }
        let name = isDefault ? 'Default' : key;
        if (name == '') {
            name = 'DynamicSlot';
        }
        if (isDynamic) {
            name = `DynamicSlots.${name}`;
        }
        let longName = `${parentDoclet.longname}#${name}`;
        let doclet = {
            id: longName,
            name,
            memberof: parentDoclet.longname,
            meta: metaUtilObj.fullMetadata['jsdoc']['meta'],
            kind: 'member',
            longname: longName,
            scope: 'instance'
        };
        if (isDynamic) {
            doclet.dynamicSlot = true;
        }
        if (isDynamic) {
            // for description look up metadata attached to the dynamicSlotsInfo items
            const contextItem = metaUtilObj.dynamicSlotsInfo.find((item) => item.key === key);
            const metadata = contextItem?.metadata;
            if (metadata) {
                // check first for a long description (no ojmetadata tag)
                // then for a short description
                // otherwise fall back to empty string
                if (metadata['jsdoc']) {
                    doclet.description = metadata['jsdoc']['description'] || metadata['description'] || '';
                }
                else {
                    doclet.description = metadata['description'] || '';
                }
                if (metadata['jsdoc'] && metadata['jsdoc']['ignore']) {
                    doclet.ojhidden = true;
                }
                if (metadata['displayName']) {
                    doclet.displayName = metadata['displayName'];
                }
                const slotDefProps = getSlotDefProperties(key, metaUtilObj);
                if (slotDefProps) {
                    injectLinkToSlotDef(doclet, slotDefProps);
                    injectLinkToSlotContextType(doclet, slotDefProps, metaUtilObj);
                }
            }
        }
        else {
            doclet.description = slot.description || '';
            if (slot['jsdoc']) {
                doclet.description = slot['jsdoc']['description'] || doclet.description;
                if (slot['jsdoc']['ignore']) {
                    doclet.ojhidden = true;
                }
            }
        }
        doclet.optional = slot['optional'];
        if (slot.status) {
            doclet.tsdeprecated = slot.status.filter((stat) => stat.type === 'deprecated');
        }
        doclet.ojchild = isDefault;
        doclet.ojslot = !isDefault;
        // only do this for dynamic template slots
        if (isDynamic && name !== 'DynamicSlot') {
            doclet.ojtemplateslotprops = key;
        }
        // get the data properties if there are any (these are documented the props on $current in case of templateSlots)
        if (slot.data) {
            doclet.properties = processComplexProperties(slot.data, metaUtilObj);
        }
        doclets = doclets.concat(doclet);
    }
    return doclets;
}
/**
 * Generates an array of JSDoc type event doclets for a given custom element VComponent.
 * @param metaUtilObj Utility object that collects custom element related metadata during the compilation process.
 * @param parentDoclet
 * @returns
 */
function getEventDoclets(metaUtilObj, parentDoclet) {
    const events = metaUtilObj.fullMetadata.events;
    let doclets = [];
    for (const key in events) {
        const event = events[key];
        const name = key;
        const longName = `${parentDoclet.longname}#event:${name}`;
        let doclet = {
            id: longName,
            name,
            kind: 'event',
            memberof: parentDoclet.longname,
            meta: metaUtilObj.fullMetadata['jsdoc']['meta'],
            longname: longName,
            scope: 'instance'
        };
        doclet.description = event.description || '';
        if (event['jsdoc']) {
            doclet.description = event['jsdoc']['description'] || doclet.description;
            if (event['jsdoc']['ignore']) {
                doclet.ojhidden = true;
            }
        }
        if (event.status) {
            doclet.tsdeprecated = event.status.filter((stat) => stat.type === 'deprecated');
        }
        // get the data properties if there are any (these are documented the props on $current in case of templateSlots)
        if (event.detail) {
            doclet.properties = processComplexProperties(event.detail, metaUtilObj);
        }
        doclets = doclets.concat(doclet);
    }
    return doclets;
}
function processComplexProperties(properties, metaUtilObj) {
    let _result = [];
    for (const key in properties) {
        let typeIsTypedef = false;
        let mappedProp = {};
        let prop = properties[key];
        mappedProp['name'] = key;
        mappedProp['description'] = prop['description'];
        if (prop['jsdoc']) {
            mappedProp['description'] = prop['jsdoc']['description'] || mappedProp['description'];
            if (prop['jsdoc']['ignore']) {
                mappedProp['ojhidden'] = true;
            }
        }
        mappedProp['optional'] = prop['optional'];
        typeIsTypedef = handlePropertyType(prop, mappedProp, metaUtilObj, key);
        handleEnumValues(prop, mappedProp);
        if (prop.value) {
            handlePropertyDefaultValue(prop, mappedProp);
        }
        if (prop.status) {
            mappedProp['tsdeprecated'] = prop.status.filter((stat) => stat.type === 'deprecated');
        }
        if (typeIsTypedef) {
            _result.push(mappedProp);
            continue;
        }
        if (prop.propertyEditorValues) {
            mappedProp['ojvalues'] = [];
            for (const enumKey in prop.propertyEditorValues) {
                mappedProp['ojvalues'].push({
                    name: enumKey,
                    description: prop.propertyEditorValues[enumKey].description,
                    displayName: prop.propertyEditorValues[enumKey].displayName,
                    type: { names: ['string'] }
                });
            }
        }
        if (prop.type == 'Array<object>') {
            let subprops = prop.properties;
            if (prop['extension'] &&
                prop['extension']['vbdt'] &&
                prop['extension']['vbdt']['itemProperties']) {
                subprops = prop['extension']['vbdt']['itemProperties'];
            }
            mappedProp['properties'] = processComplexProperties(subprops, metaUtilObj);
        }
        _result.push(mappedProp);
    }
    return _result;
}
function createTypedef(typeDefMD, metaUtilObj, parent) {
    let doclet;
    if (!typeDefMD.coreJetModule) {
        const typeDefName = typeDefMD['name'];
        const typeDefLongName = `${parent.longname}.${typeDefName}`;
        // check if we already created the typedef
        const existingDoclet = getTypeDefDefinitionById(typeDefLongName, metaUtilObj);
        if (existingDoclet) {
            return existingDoclet;
        }
        doclet = {
            id: typeDefLongName,
            name: typeDefName,
            kind: 'typedef',
            memberof: parent.longname,
            meta: metaUtilObj.fullMetadata['jsdoc']['meta'],
            longname: typeDefLongName,
            type: { names: ['Object'] },
            scope: 'static'
        };
        doclet.description = typeDefMD['description'] || '';
        if (typeDefMD['ignore']) {
            doclet.ojhidden = true;
        }
        let genericTypeParams = typeDefMD['genericsDeclaration'];
        if (genericTypeParams) {
            doclet.tsgenerictype = {
                target: 'Type',
                value: genericTypeParams,
                for: 'genericTypeParameters'
            };
        }
        // TypeDefs that have the targetType property are alias TypeDefs
        // that are used in rendering just a signature of a type alias
        if (typeDefMD['targetType']) {
            //replace type names in the targteType signature with fully qualified TypeDef names
            // update the targetType for TypeDefs that are alias TypeDefs (no props, just a ts signature)
            let typeDefSignature = typeDefMD['targetType'];
            let coreJetModule;
            metaUtilObj.typeDefinitions.forEach((td) => {
                let regex = new RegExp('\\b' + td.name + '(?!\\.)\\b');
                if (regex.test(typeDefSignature)) {
                    // if it's not a Core Jet type replace the original type ref name with the qualified name
                    if (!td.coreJetModule) {
                        //replace the TypeDef name in the original signature with the qualified name
                        const qualifiedName = `${getTopContainerDoclet(metaUtilObj).id}.${td.name}`;
                        typeDefSignature = typeDefSignature.replace(new RegExp('\\b' + td.name + '\\b', 'g'), qualifiedName);
                    }
                    else {
                        coreJetModule = { ...coreJetModule, ...td.coreJetModule };
                    }
                }
            });
            doclet.tstype = [
                {
                    target: 'Type',
                    value: typeDefSignature,
                    jsdocOverride: true
                }
            ];
            if (coreJetModule) {
                doclet.tstype[0].module = coreJetModule;
            }
        }
        if (typeDefMD.properties) {
            const props = typeDefMD.properties;
            doclet.properties = processComplexProperties(props, metaUtilObj);
        }
        metaUtilObj['context'].typeDefs.push(doclet);
    }
    return doclet;
}
function isArrayOfObjects(prop) {
    return (prop.extension &&
        prop.extension['vbdt'] &&
        prop.extension['vbdt'].itemProperties &&
        prop.type == 'Array<object>');
}
function getTypeDefDefinitionById(id, metaUtilObj) {
    return metaUtilObj['context'].typeDefs.find((doclet) => doclet['id'] === id);
}
function getGestureFragments(parentDoclet) {
    let fragments = [];
    const description = parentDoclet['classdesc'];
    const createDoclet = function (markertext, isKeyboardDoc) {
        let doclet;
        let begin = description.indexOf(markertext);
        if (begin > 0) {
            const tableStart = description.indexOf('<table class=', begin + 1);
            if (tableStart > begin) {
                const tableEnd = description.indexOf('</table>', tableStart + 1);
                const tableDesc = description.substring(tableStart, tableEnd + 8);
                const name = isKeyboardDoc ? 'keyboardDoc' : 'touchDoc';
                const longName = `${parentDoclet.longname}.${name}`;
                doclet = {
                    id: longName,
                    name: name,
                    kind: 'member',
                    longname: longName,
                    description: tableDesc,
                    memberof: parentDoclet.longname,
                    meta: Object.assign({}, parentDoclet.meta),
                    ojfragment: true
                };
            }
        }
        return doclet;
    };
    if (description && description.length > 0) {
        let doclet = createDoclet('<h3 id="touch-section">', false);
        if (doclet) {
            fragments.push(doclet);
        }
        doclet = createDoclet('<h3 id="keyboard-section">', true);
        if (doclet) {
            fragments.push(doclet);
        }
    }
    return fragments;
}
/**
 * Get the pack name from the 'main' ojmetadata
 * @param main the value of the main ojmetadata (example  @ojmetadata main "oj-c/avatar")
 * @returns pack name
 */
function getPackNameFrom(main) {
    let pack;
    if (main) {
        if (main.indexOf('/') > 0) {
            pack = main.split('/')[0];
        }
        else {
            pack = main;
        }
    }
    return pack;
}
function getModuleNameFrom(main) {
    let module;
    if (main) {
        if (main.indexOf('/') > 0) {
            module = main.split('/').pop();
        }
        else {
            module = main;
        }
    }
    return module;
}
function isCoreJetTypeReference(prop) {
    return prop?.jsdoc?.typedef?.coreJetModule;
}
function isObjectBasedArrayType(prop) {
    let bRetVal = false;
    if (prop && prop.type === 'Array<object>') {
        if ((prop.extension && prop.extension['vbdt'] && prop.extension['vbdt'].itemProperties) ||
            prop.properties) {
            bRetVal = true;
        }
    }
    return bRetVal;
}
function getTopContainerDoclet(metaUtilObj) {
    return metaUtilObj['context'].topContainerDoclet;
}
function handleParameterType(param, metaUtilObj) {
    let typeIsTypedef = false;
    if (param['type'] && typeof param['type'] === 'string') {
        param['type'] = { names: [param['type']] };
    }
    if (param['reftype'] && param.isApiDocSignature) {
        // see if we can replace in the reftype param signature the type with the longname of a typedef that we already created
        let paramSignature = param['reftype'];
        let coreJetModule;
        let qualifiedNames = new Set();
        if (Array.isArray(metaUtilObj.typeDefinitions)) {
            metaUtilObj.typeDefinitions.forEach((td) => {
                let regex = new RegExp('\\b' + td.name + '(?!\\.)\\b');
                if (regex.test(paramSignature)) {
                    typeIsTypedef = true;
                    // if it's not a Core Jet type replace the original type ref name with the qualified name
                    if (!td.coreJetModule) {
                        //replace the TypeDef name in the original signature with the qualified name
                        const qualifiedName = `${getTopContainerDoclet(metaUtilObj).id}.${td.name}`;
                        paramSignature = paramSignature.replace(new RegExp('\\b' + td.name + '\\b', 'g'), qualifiedName);
                        qualifiedNames.add(qualifiedName);
                    }
                    else {
                        coreJetModule = { ...coreJetModule, ...td.coreJetModule };
                    }
                }
            });
        }
        // update the signature of the param object
        param['tstype'] = [
            {
                target: 'Type',
                value: paramSignature,
                jsdocOverride: true,
                for: param.name
            }
        ];
        // if the type ref is Core Jet type, just decorate the tstype with the core JET module name
        if (typeIsTypedef && coreJetModule) {
            param['tstype'][0]['module'] = coreJetModule;
        }
        //TODO
        // check if default value for a param will show up
        delete param['reftype'];
        delete param['isApiDocSignature'];
    }
    return typeIsTypedef;
}
function handleMethodReturnType(method, doclet, metaUtilObj) {
    let typeIsTypedef = false;
    const reftype = method?.jsdoc?.returnType;
    // if we have discovered a reference type in the return...
    if (reftype && doclet.returns) {
        // see if we can replace in the returnType return signature the type with the longname of a typedef that we already created
        let returnSignature = reftype;
        let coreJetModule;
        let qualifiedNames = new Set();
        if (Array.isArray(metaUtilObj.typeDefinitions)) {
            metaUtilObj.typeDefinitions.forEach((td) => {
                let regex = new RegExp('\\b' + td.name + '(?!\\.)\\b');
                if (regex.test(returnSignature)) {
                    typeIsTypedef = true;
                    // if it's not a Core Jet type replace the original type ref name with the qualified name
                    if (!td.coreJetModule) {
                        //replace the TypeDef name in the original signature with the qualified name
                        const qualifiedName = `${getTopContainerDoclet(metaUtilObj).id}.${td.name}`;
                        returnSignature = returnSignature.replace(new RegExp('\\b' + td.name + '\\b', 'g'), qualifiedName);
                        qualifiedNames.add(qualifiedName);
                    }
                    else {
                        coreJetModule = { ...coreJetModule, ...td.coreJetModule };
                    }
                }
            });
        }
        // update the signature of the param object
        doclet.returns[0]['tstype'] = {
            target: 'Type',
            value: returnSignature,
            jsdocOverride: true,
            for: 'returns'
        };
        // if the type ref is Core Jet type, just decorate the tstype with the core JET module name
        if (typeIsTypedef && coreJetModule) {
            doclet.returns[0]['tstype']['module'] = coreJetModule;
        }
    }
    return typeIsTypedef;
}
function handlePropertyType(prop, doclet, metaUtilObj, propName) {
    let typeIsTypedef = false;
    doclet['type'] = { names: [prop['type']] };
    if (prop['reftype'] && prop.isApiDocSignature) {
        // see if we can replace in the reftype prop signature the type with the longname of a typedef that we already created
        let propSignature = prop['reftype'];
        let coreJetModule;
        let qualifiedNames = new Set();
        if (Array.isArray(metaUtilObj.typeDefinitions)) {
            metaUtilObj.typeDefinitions.forEach((td) => {
                let regex = new RegExp('\\b' + td.name + '(?!\\.)\\b');
                if (regex.test(propSignature)) {
                    typeIsTypedef = true;
                    // if it's not a Core Jet type replace the original type ref name with the qualified name
                    if (!td.coreJetModule) {
                        //replace the TypeDef name in the original signature with the qualified name
                        const qualifiedName = `${getTopContainerDoclet(metaUtilObj).id}.${td.name}`;
                        propSignature = propSignature.replace(new RegExp('\\b' + td.name + '\\b', 'g'), qualifiedName);
                        qualifiedNames.add(qualifiedName);
                    }
                    else {
                        coreJetModule = { ...coreJetModule, ...td.coreJetModule };
                    }
                }
            });
        }
        // update the signature of the doclet
        doclet['tstype'] = [
            {
                target: 'Type',
                value: propSignature,
                jsdocOverride: true
            }
        ];
        if (propName) {
            doclet['tstype'][0].for = propName;
        }
        // if the type ref is  Core Jet type, just decorate the tstype with the core JET module name
        if (typeIsTypedef && coreJetModule) {
            doclet['tstype'][0]['module'] = coreJetModule;
        }
        // Before returning, we need to settle the default values on the properties of the TypeDef.
        // To do that we will loop through the sub-properties of this property declaration (if any)
        // and will set the default value on the matching properties of the TypeDef
        if (qualifiedNames.size == 1 && !propName) {
            const iter = qualifiedNames.keys();
            const typeDefName = iter.next().value;
            const typeDef = getTypeDefDefinitionById(typeDefName, metaUtilObj);
            handleTypeDefDefaultValues(prop, typeDef);
        }
    }
    //special case handling for union types where we have a chance to create a more precise type signature
    typeFixupForUnions(doclet, prop);
    return typeIsTypedef;
}
function handleTypeDefDefaultValues(prop, typeDef) {
    if (isArrayOfObjects(prop) || prop.properties) {
        const subProps = prop.properties
            ? prop.properties
            : prop.extension['vbdt'].itemProperties;
        // loop through the top level subproperties of this property
        for (let propKey in subProps) {
            let property = subProps[propKey];
            // if this sub-prop is not a complex property (defaults supported only at top level)
            if (!property['properties']) {
                // try to match the same property in TypeDef
                const typeDefProp = typeDef.properties?.find((p) => p.name === propKey);
                // if there is a match and the sub-prop has a default value, set it on TD
                if (typeDefProp && property['value']) {
                    handlePropertyDefaultValue(property, typeDefProp);
                }
            }
        }
    }
}
function handlePropertyDefaultValue(prop, doclet) {
    let defaultValue = prop.value;
    // try to remove any TS type casting from default value like "somval as sometype"
    if (typeof defaultValue === 'string') {
        const match = defaultValue.match(/(.+)([\s]as[\s])(.+)/);
        if (match && match.length > 2 && match[2].trim() === 'as') {
            defaultValue = match[1].trim();
        }
    }
    else if (Array.isArray(defaultValue)) {
        if (prop['type'] === 'Array<string>') {
            defaultValue = `[${defaultValue.map((x) => `"${x}"`).join(', ')}]`;
        }
        else {
            defaultValue = `[${defaultValue.join(', ')}]`;
        }
    }
    doclet['defaultvalue'] = prop['type'] === 'string' ? `"${defaultValue}"` : defaultValue;
}
function handleEnumValues(prop, doclet) {
    if (prop.enumValues) {
        // Enclose each enum value in quotes, for API Doc consistency
        // even when propertyEditorValues metadata are not available
        doclet.type = { names: prop.enumValues.map((x) => `"${x}"`) };
        delete doclet.tstype;
    }
}
function getSlotDefProperties(slotContextType, metaUtilObj) {
    const properties = metaUtilObj.fullMetadata.properties;
    const slotDefProps = [];
    for (const key in properties) {
        if (properties[key].dynamicSlotDef === slotContextType) {
            slotDefProps.push(key);
        }
    }
    return slotDefProps;
}
// utility function to inject link in the dynamic template slot description to the property that is the
// dynamic slot definition
function injectLinkToSlotDef(doclet, slotDefProps) {
    if (doclet && doclet['description']) {
        doclet['description'] = `${doclet['description']} 
    <p><span style="font-weight: bold">Note:</span> For additional information see ${getLinks(slotDefProps)}.</p>`;
    }
}
// utility function to inject link in the property description of a dynamic slot definition to the type
// parameter context type of the dynamic template slot
function injectLinkToSlotContextType(dynamicSlot, slotDefProps, metaUtilObj) {
    let properties = metaUtilObj['context'].properties;
    // you have to loop through the prop key names, find the already created prop doclets and augment their
    properties.forEach((doclet) => {
        // found the doclet for the dynamicSlotDef property
        if (slotDefProps.indexOf(doclet.name) >= 0) {
            // inject link to the dynamic template slot context type
            if (doclet['description']) {
                doclet['description'] =
                    doclet['description'] +
                        `<p><span style="font-weight: bold">Note:</span> For additional information see <a href="#${dynamicSlot.name}">${dynamicSlot.name.endsWith('.DynamicSlot')
                            ? 'Dynamic Slots'
                            : dynamicSlot['displayName'] || dynamicSlot.name}</a>.</p>`;
            }
        }
    });
}
// utility function for case conversion
function camelCaseToAttributeName(name) {
    return name.replace(/([A-Z])/g, function (match) {
        return '-' + match.toLowerCase();
    });
}
// utility function to generate links
function getLinks(props) {
    let link = '';
    props.forEach((slotDefProp) => {
        link = `${link}, <a href="#${slotDefProp}">${camelCaseToAttributeName(slotDefProp)}</a>`;
    });
    // remove the starting comma and space
    link = link.substring(2);
    return link;
}
function hasDynamicSlot(metaUtilObj) {
    return (metaUtilObj.fullMetadata.dynamicSlots &&
        Array.isArray(Object.keys(metaUtilObj.fullMetadata.dynamicSlots)) &&
        Object.keys(metaUtilObj.fullMetadata.dynamicSlots).length == 0 &&
        metaUtilObj.dynamicSlotsInUse == 1);
}
function setStatusOnPropertyValues(propDoclet, statusArr) {
    if (statusArr && statusArr.length) {
        let isPropValueStatus = false;
        statusArr.forEach((status) => {
            if (status.target === 'propertyValue') {
                isPropValueStatus = true;
                let values = status.value;
                if (values && values.length) {
                    values.forEach((value) => {
                        propDoclet.ojvalues.forEach((ojvalue) => {
                            if (ojvalue.name && ojvalue.name === value) {
                                // this is what we are setting
                                //ojvalue.tsdeprecated = [{
                                //  target: "propertyValue",
                                //  for: value,
                                //  since: status.since,
                                //  description: status.description || ""
                                //}]
                                // TODO: Only pass 'antiPattern' type through once supported in API Doc (JET-58988)
                                const statObj = {
                                    target: 'propertyValue',
                                    for: value,
                                    since: status.since,
                                    description: status.description || ''
                                };
                                if (!status.type || status.type !== 'antiPattern') {
                                    ojvalue.tsdeprecated = [statObj];
                                }
                                else {
                                    ojvalue.ojdeprecated = [statObj];
                                }
                            }
                        });
                    });
                }
            }
        });
        if (!isPropValueStatus) {
            //doclet.tsdeprecated = status;
            // TODO: Only pass 'antiPattern' type through once supported in API Doc (JET-58988)
            statusArr.forEach((status) => {
                if (!status.type || status.type !== 'antiPattern') {
                    propDoclet.tsdeprecated = propDoclet.tsdeprecated ?? [];
                    propDoclet.tsdeprecated.push(status);
                }
                else {
                    propDoclet.ojdeprecated = propDoclet.ojdeprecated ?? [];
                    propDoclet.ojdeprecated.push(status);
                }
            });
        }
    }
}
/**
 * Utility function that can improve the type signature of an API IF the type was defined as a union of one or more
 * string literals and/or some other type(s)
 * @param doclet The jsdoc doclet object that is in the process to be created
 * @param prop The property object as it was created by the JET compiler transformer
 */
function typeFixupForUnions(doclet, prop) {
    const updateTypeArray = (_type, isTypeTsType) => {
        let updated = false;
        const propValueNames = Object.keys(prop.propertyEditorValues).map((value) => `"${value}"`);
        const _typeArr = _type.split('|');
        // if we have union type find if one of the type is string in which case we might want to replace this with enum values
        if (Array.isArray(_typeArr) && _typeArr.length > 1) {
            const fixedTypeArr = _typeArr.map((e) => {
                if (e.trim() === 'string') {
                    updated = true;
                    return propValueNames.join('|');
                }
                else {
                    return e;
                }
            });
            if (isTypeTsType) {
                doclet.tstype[0].value = fixedTypeArr.join('|');
            }
            else {
                doclet.type.names = [fixedTypeArr.join('|')];
            }
        }
        // at this point we know we have propertyEditorValues which is the result of either:
        // 1. having the propertyEditorValues ojmetadata  OR
        // 2. having enums (but enums are for DT only, see isEnumValuesForDTOnly in MetadataTypeUtils) AND also there is no
        //    propertyEditorValues ojmetadata nor format ojmetadata specified on the property which results in the deletion
        //    of the enumValues metadata.
        // Note: enumValues will end up on prop metadata when the property
        // signature (in the src) contains a disciminated union of string/numeric literals.
        // At this point we check if we don't have enumValues () for the
        // type = string use-case in which case we will add the propertyEditor values to the type as a union with strings.
        else if (!prop.enumValues && _type.trim() === 'string') {
            updated = true;
            propValueNames.push('string');
            if (isTypeTsType) {
                doclet.tstype[0].value = propValueNames.join('|');
            }
            else {
                doclet.type.names = [propValueNames.join('|')];
            }
        }
        return updated;
    };
    // if we determined that part (or the entire type is a union of strings)
    // we can then check if these enum values can be injected in the type signature
    // and replace the generic string type (again, only if we have a union type)
    // If we have a reftype, we don't do anything because the propertyEditorValues are already injected in the reftype
    // signature (in MetadataTypeUtils#getSignatureFromType).
    if (prop.propertyEditorValues && !prop.reftype) {
        if (Array.isArray(doclet.tstype) && doclet.tstype.length == 1) {
            const _type = doclet.tstype[0];
            if (_type.jsdocOverride && _type.target === 'Type') {
                updateTypeArray(_type.value, true);
            }
        }
        else if (doclet.type && Array.isArray(doclet.type.names) && doclet.type.names.length == 1) {
            const _type = doclet.type.names[0];
            if (updateTypeArray(_type, false)) {
                // if we updated the type, create a tstype object which is the main source for the type signature in the API Doc
                // (used in the publishing process)
                doclet.tstype = [
                    {
                        target: 'Type',
                        value: doclet.type.names[0],
                        jsdocOverride: true
                    }
                ];
            }
        }
    }
}
// DocUtils.ts
function injectSharedContent(text, sharedDocs, apidocRoot) {
    return text.replace(/\{@include\s+([^#\s]+)#([^\s}]+)\}/g, (match, relativePath, regionName) => {
        const absolutePath = path_1.default.resolve(apidocRoot, relativePath);
        const regionMap = sharedDocs[absolutePath];
        if (!regionMap) {
            console.warn(`Shared doc include failed: file "${relativePath}" not found.`);
            return match;
        }
        const regionText = regionMap[regionName];
        if (!regionText) {
            console.warn(`Shared doc include failed: region "${regionName}" not found in "${relativePath}".`);
            return match;
        }
        return regionText;
    });
}
function isExportedType(doclet, options) {
    const _typeNamesMatch = (expType, targetName) => {
        return expType.originalName === targetName;
    };
    let isExported = false;
    if (!doclet || doclet.kind !== 'typedef')
        return isExported;
    const moduleExports = options.programExportMaps;
    if (moduleExports) {
        const parentDir = (0, MetadataFileUtils_1.ensureAbsolutePath)(doclet.meta.path);
        const exportedTypes = moduleExports.getModuleTypeExports(parentDir);
        isExported =
            exportedTypes && exportedTypes.findIndex((_type) => _typeNamesMatch(_type, doclet.name)) > -1;
    }
    return isExported;
}
//# sourceMappingURL=ApiDocUtils.js.map