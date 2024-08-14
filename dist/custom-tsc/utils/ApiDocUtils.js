"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDoclets = void 0;
const path_1 = __importDefault(require("path"));
function generateDoclets(metaUtilObj) {
    const classDoclet = getClassDoclet(metaUtilObj);
    const typeDefs = [];
    const properties = [];
    const methods = [];
    const events = [];
    const slots = [];
    let context = {
        classDoclet,
        typeDefs,
        properties,
        methods,
        events,
        slots
    };
    metaUtilObj['context'] = context;
    createTypeDefsFromSignature(metaUtilObj);
    context.properties = getPropertyDoclets(metaUtilObj.fullMetadata.properties, classDoclet, metaUtilObj);
    context.methods = getMethodDoclets(metaUtilObj, classDoclet);
    context.events = getEventDoclets(metaUtilObj, classDoclet);
    context.slots = getSlotDoclets(metaUtilObj, classDoclet);
    return [
        context.classDoclet,
        ...context.properties,
        ...context.methods,
        ...context.events,
        ...context.slots,
        ...getGestureFragments(classDoclet),
        ...getObservedGlobalProps(metaUtilObj, classDoclet),
        ...context.typeDefs
    ];
}
exports.generateDoclets = generateDoclets;
function getClassDoclet(metaUtilObj) {
    let vcompdoclet = {};
    let custElemName = metaUtilObj.fullMetadata.name;
    let namespace = custElemName.split('-')[0].toLowerCase().trim();
    let pack = metaUtilObj.fullMetadata.pack || getPackNameFrom(metaUtilObj.fullMetadata['main']);
    if (pack) {
        namespace = pack;
        vcompdoclet['pack'] = pack;
    }
    const vcompName = metaUtilObj.componentName;
    const vcompLongName = `${namespace}.${vcompName}`;
    vcompdoclet['id'] = vcompLongName;
    vcompdoclet['name'] = vcompName;
    vcompdoclet['memberof'] = namespace;
    vcompdoclet['longname'] = `${vcompdoclet['memberof']}.${vcompdoclet['name']}`;
    vcompdoclet['kind'] = 'class';
    if (metaUtilObj.fullMetadata['jsdoc']) {
        vcompdoclet['classdesc'] =
            metaUtilObj.fullMetadata['jsdoc'].description || metaUtilObj.fullMetadata.description || '';
        if (metaUtilObj.fullMetadata['jsdoc']['ignore']) {
            vcompdoclet['ojhidden'] = true;
        }
    }
    vcompdoclet['scope'] = 'static';
    const typeParamsDeclaration = metaUtilObj.fullMetadata['classTypeParamsDeclaration'] || '';
    const typeParamsRef = metaUtilObj.fullMetadata['classTypeParams'] || '';
    vcompdoclet['tagWithoutBrackets'] = custElemName;
    vcompdoclet['tagWithBrackets'] = `<${custElemName}>`;
    vcompdoclet['domInterface'] = metaUtilObj.fullMetadata.implements[0];
    vcompdoclet['ojPageTitle'] = `&lt;${custElemName}>`;
    vcompdoclet['ojcomponent'] = true;
    vcompdoclet['isvcomponent'] = true;
    vcompdoclet['camelCaseName'] = vcompdoclet['name'];
    vcompdoclet['ojPageTitlePrefix'] = 'Element: ';
    vcompdoclet['ojtsvcomponent'] = true;
    let signExpr = {
        target: 'Type',
        value: `interface ${vcompdoclet['domInterface']}${typeParamsDeclaration} extends JetElement<${vcompName}ElementSettableProperties${typeParamsRef}>`
    };
    if (typeParamsDeclaration) {
        signExpr['genericParameters'] = metaUtilObj.fullMetadata['jsdoc']['typeparams'];
    }
    vcompdoclet['tstype'] = signExpr;
    vcompdoclet['ojsignature'] = [signExpr];
    vcompdoclet['since'] = metaUtilObj.fullMetadata['since'];
    if (metaUtilObj.fullMetadata.status) {
        vcompdoclet['tsdeprecated'] = metaUtilObj.fullMetadata.status.filter((statObj) => statObj.type !== 'antiPattern');
    }
    if (metaUtilObj.fullMetadata.extension && metaUtilObj.fullMetadata.extension['themes']) {
        vcompdoclet['ojunsupportedthemes'] =
            metaUtilObj.fullMetadata.extension['themes']['unsupportedThemes'];
    }
    vcompdoclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
    const dirName = vcompdoclet['meta']['path'];
    const arrDirs = path_1.default.resolve(dirName).split(path_1.default.sep);
    vcompdoclet['ojmodule'] = arrDirs[arrDirs.length - 1];
    if (!pack && arrDirs[arrDirs.length - 1] === metaUtilObj.fullMetadata.version) {
        vcompdoclet['ojmodule'] = arrDirs[arrDirs.length - 2];
    }
    if (metaUtilObj.fullMetadata.subcomponentType) {
        vcompdoclet['ojslotcomponent'] = true;
    }
    return vcompdoclet;
}
function createTypeDefsFromSignature(metaUtilObj) {
    if (metaUtilObj.fullMetadata['jsdoc']['typedefs']) {
        const typeDefMD = metaUtilObj.fullMetadata['jsdoc']['typedefs'];
        const classDoclet = metaUtilObj['context'].classDoclet;
        let signArr = classDoclet['ojsignature'];
        if (signArr && signArr.length) {
            let signature = signArr[0].value;
            typeDefMD.forEach((md) => {
                const td = createTypedef(md, metaUtilObj, classDoclet);
                let regex = new RegExp('\\b' + td.name + '(?!\\.)\\b');
                if (regex.test(signature)) {
                    signature = signature.replace(new RegExp('\\b' + td.name + '\\b'), td.longname);
                }
            });
            signArr[0].value = signature;
        }
    }
}
function getObservedGlobalProps(metaUtilObj, classDoclet) {
    let doclets = [];
    const properties = metaUtilObj.fullMetadata['observedGlobalProps'];
    for (const key in properties) {
        let doclet = { observedGlobalProp: true };
        doclet['memberof'] = classDoclet.longname;
        const prop = properties[key];
        const propName = key.toLowerCase();
        const propLongName = `${doclet['memberof']}#${propName}`;
        doclet['id'] = propLongName;
        doclet['name'] = propName;
        doclet['kind'] = 'member';
        doclet['longname'] = propLongName;
        doclet['optional'] = prop['optional'];
        doclet['scope'] = 'instance';
        doclet['description'] = prop.description || '';
        if (prop['jsdoc']) {
            doclet['description'] = prop['jsdoc']['description'] || doclet['description'];
            if (prop['jsdoc']['ignore']) {
                doclet['ojhidden'] = true;
            }
        }
        doclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
        if (prop.propertyEditorValues) {
            doclet['ojvalues'] = [];
            for (const enumKey in prop.propertyEditorValues) {
                doclet['ojvalues'].push({
                    name: enumKey,
                    description: prop.propertyEditorValues[enumKey].description,
                    displayName: prop.propertyEditorValues[enumKey].displayName,
                    type: { names: ['string'] }
                });
            }
        }
        doclet['type'] = { names: [prop['type']] };
        handleEnumValues(prop, doclet);
        doclets.push(doclet);
    }
    return doclets;
}
function getPropertyDoclets(properties, parentDoclet, metaUtilObj, isArrayBased = false) {
    let doclets = [];
    for (const key in properties) {
        let typeIsTypedef = false;
        let doclet = {};
        const classDoclet = metaUtilObj['context'].classDoclet;
        doclet['memberof'] = classDoclet.longname;
        const prop = properties[key];
        const propName = parentDoclet.kind === 'class'
            ? key
            : isArrayBased
                ? `${parentDoclet.name}[].${key}`
                : `${parentDoclet.name}.${key}`;
        const propLongName = `${doclet['memberof']}#${propName}`;
        doclet['id'] = propLongName;
        doclet['name'] = propName;
        doclet['kind'] = 'member';
        doclet['longname'] = propLongName;
        doclet['optional'] = prop['optional'];
        doclet['scope'] = 'instance';
        if (prop.writeback) {
            doclet['ojwriteback'] = true;
        }
        if (prop.readOnly) {
            doclet['readonly'] = true;
        }
        doclet['description'] = prop.description || '';
        if (prop['jsdoc']) {
            doclet['description'] = prop['jsdoc']['description'] || doclet['description'];
            if (prop['jsdoc']['ignore']) {
                doclet['ojhidden'] = true;
            }
        }
        if (prop.dynamicSlotDef) {
            doclet['dynamicSlotDef'] = prop.dynamicSlotDef;
        }
        doclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
        let status;
        if (Array.isArray(prop.status)) {
            status = prop.status.filter((stat) => stat.type === 'deprecated');
            doclet['tsdeprecated'] = status;
        }
        if (prop.propertyEditorValues) {
            doclet['ojvalues'] = [];
            for (const enumKey in prop.propertyEditorValues) {
                doclet['ojvalues'].push({
                    name: enumKey,
                    description: prop.propertyEditorValues[enumKey].description,
                    displayName: prop.propertyEditorValues[enumKey].displayName,
                    type: { names: ['string'] }
                });
            }
            if (status && status.some((stat) => stat.target === 'propertyValue')) {
                setStatusOnPropertyValues(doclet, status);
            }
        }
        if (prop.value !== undefined) {
            let defaultValue = prop.value;
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
        typeIsTypedef = handlePropertyType(prop, doclet, metaUtilObj, null);
        handleEnumValues(prop, doclet);
        doclets.push(doclet);
        if (typeIsTypedef) {
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
function getMethodDoclets(metaUtilObj, parentDoclet) {
    const methods = metaUtilObj.fullMetadata.methods;
    let doclets = [];
    for (const key in methods) {
        let doclet = {};
        doclet['memberof'] = parentDoclet.longname;
        const method = methods[key];
        const name = key;
        const longName = `${parentDoclet.longname}#${name}`;
        let rtnDescription;
        doclet['id'] = longName;
        doclet['name'] = name;
        doclet['kind'] = 'function';
        doclet['longname'] = longName;
        doclet['description'] = method.description || '';
        if (method['jsdoc']) {
            doclet['description'] = method['jsdoc']['description'] || doclet['description'];
            rtnDescription = method['jsdoc']['returns'];
            if (method['jsdoc']['ignore']) {
                doclet['ojhidden'] = true;
            }
            if (method['jsdoc']['params']) {
                const jsdocParams = method['jsdoc']['params'];
                const findJSDocParam = (pname) => jsdocParams.find((param) => pname === param.name);
                doclet['params'] = method.params.map((param) => {
                    const found = findJSDocParam(param.name);
                    if (found && found.description) {
                        let updated = { ...param };
                        updated.description = found.description;
                        return updated;
                    }
                    else {
                        return param;
                    }
                });
            }
        }
        doclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
        doclet['scope'] = 'instance';
        doclet['params'] = doclet['params'] || method.params;
        if (method.status) {
            doclet['tsdeprecated'] = method.status.filter((stat) => stat.type === 'deprecated');
        }
        doclet['returns'] = [{ type: { names: [method.return] } }];
        if (rtnDescription) {
            doclet['returns'][0]['description'] = rtnDescription;
        }
        doclets = doclets.concat(doclet);
    }
    return doclets;
}
function getSlotDoclets(metaUtilObj, parentDoclet) {
    const slots = metaUtilObj.fullMetadata.slots;
    const dynamicTemplateSlots = metaUtilObj.fullMetadata.dynamicSlots;
    let dynamicSlot;
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
        let doclet = {};
        let isDefault = false;
        doclet['memberof'] = parentDoclet.longname;
        const slot = slots[key];
        if (key == '' && !isDynamic) {
            isDefault = true;
        }
        let name = isDefault ? 'Default' : key;
        if (name == '') {
            name = 'DynamicSlot';
        }
        if (isDynamic) {
            doclet['dynamicSlot'] = true;
            name = `DynamicSlots.${name}`;
        }
        let longName = `${parentDoclet.longname}#${name}`;
        doclet['id'] = longName;
        doclet['name'] = name;
        doclet['kind'] = 'member';
        doclet['longname'] = longName;
        if (isDynamic) {
            const contextItem = metaUtilObj.dynamicSlotsInfo.find((item) => item.key === key);
            const metadata = contextItem?.metadata;
            if (metadata) {
                doclet['description'] = metadata['jsdoc']['description'] || metadata['description'] || '';
                if (metadata['jsdoc']['ignore']) {
                    doclet['ojhidden'] = true;
                }
                if (metadata['displayName']) {
                    doclet['displayName'] = metadata['displayName'];
                }
                const slotDefProps = getSlotDefProperties(key, metaUtilObj);
                if (slotDefProps) {
                    injectLinkToSlotDef(doclet, slotDefProps);
                    injectLinkToSlotContextType(doclet, slotDefProps, metaUtilObj);
                }
            }
        }
        else {
            doclet['description'] = slot.description || '';
            if (slot['jsdoc']) {
                doclet['description'] = slot['jsdoc']['description'] || doclet['description'];
                if (slot['jsdoc']['ignore']) {
                    doclet['ojhidden'] = true;
                }
            }
        }
        doclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
        doclet['scope'] = 'instance';
        doclet['optional'] = slot['optional'];
        if (slot.status) {
            doclet['tsdeprecated'] = slot.status.filter((stat) => stat.type === 'deprecated');
        }
        doclet['ojchild'] = isDefault;
        doclet['ojslot'] = !isDefault;
        if (isDynamic && name !== 'DynamicSlot') {
            doclet['ojtemplateslotprops'] = key;
        }
        if (slot.data) {
            doclet['properties'] = processComplexProperties(slot.data, metaUtilObj);
        }
        doclets = doclets.concat(doclet);
    }
    return doclets;
}
function getEventDoclets(metaUtilObj, parentDoclet) {
    const events = metaUtilObj.fullMetadata.events;
    let doclets = [];
    for (const key in events) {
        let doclet = {};
        doclet['memberof'] = parentDoclet.longname;
        const event = events[key];
        const name = key;
        const longName = `${parentDoclet.longname}#event:${name}`;
        doclet['id'] = longName;
        doclet['name'] = name;
        doclet['kind'] = 'event';
        doclet['longname'] = longName;
        doclet['description'] = event.description || '';
        if (event['jsdoc']) {
            doclet['description'] = event['jsdoc']['description'] || doclet['description'];
            if (event['jsdoc']['ignore']) {
                doclet['ojhidden'] = true;
            }
        }
        doclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
        doclet['scope'] = 'instance';
        if (event.status) {
            doclet['tsdeprecated'] = event.status.filter((stat) => stat.type === 'deprecated');
        }
        if (event.detail) {
            doclet['properties'] = processComplexProperties(event.detail, metaUtilObj);
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
            let defaultValue = prop.value;
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
            mappedProp['defaultvalue'] = prop['type'] === 'string' ? `"${defaultValue}"` : defaultValue;
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
function createTypedefFromProp(prop, metaUtilObj) {
    let doclet = {};
    const classDoclet = metaUtilObj['context'].classDoclet;
    doclet['memberof'] = classDoclet.longname;
    const typeDefMD = prop['jsdoc']['typedef'];
    const typeDefName = typeDefMD['name'];
    const typeDefLongName = `${doclet['memberof']}.${typeDefName}`;
    doclet['id'] = typeDefLongName;
    const existingDoclet = getTypeDefDefinition(typeDefLongName, metaUtilObj);
    if (existingDoclet) {
        return existingDoclet;
    }
    doclet['name'] = typeDefName;
    doclet['kind'] = 'typedef';
    doclet['longname'] = typeDefLongName;
    doclet['scope'] = 'static';
    doclet['description'] = typeDefMD['description'] || '';
    if (typeDefMD['ignore']) {
        doclet['ojhidden'] = true;
    }
    let genericTypeParams = typeDefMD['genericsDeclaration'];
    if (genericTypeParams) {
        doclet['tsgenerictype'] = {
            target: 'Type',
            value: genericTypeParams,
            for: 'genericTypeParameters'
        };
    }
    doclet['type'] = { names: ['Object'] };
    doclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
    if (prop.properties || isArrayOfObjects(prop)) {
        const subprops = prop.properties ? prop.properties : prop.extension['vbdt'].itemProperties;
        doclet['properties'] = processComplexProperties(subprops, metaUtilObj);
    }
    metaUtilObj['context'].typeDefs.push(doclet);
    return doclet;
}
function createTypedef(typeDefMD, metaUtilObj, parent) {
    let doclet = {};
    doclet['memberof'] = parent.longname;
    const typeDefName = typeDefMD['name'];
    const typeDefLongName = `${doclet['memberof']}.${typeDefName}`;
    doclet['id'] = typeDefLongName;
    const existingDoclet = getTypeDefDefinition(typeDefLongName, metaUtilObj);
    if (existingDoclet) {
        return existingDoclet;
    }
    doclet['name'] = typeDefName;
    doclet['kind'] = 'typedef';
    doclet['longname'] = typeDefLongName;
    doclet['scope'] = 'static';
    doclet['description'] = typeDefMD['description'] || '';
    if (typeDefMD['ignore']) {
        doclet['ojhidden'] = true;
    }
    let genericTypeParams = typeDefMD['genericsDeclaration'];
    if (genericTypeParams) {
        doclet['tsgenerictype'] = {
            target: 'Type',
            value: genericTypeParams,
            for: 'genericTypeParameters'
        };
    }
    doclet['type'] = { names: ['Object'] };
    doclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
    if (typeDefMD.properties) {
        const props = typeDefMD.properties;
        doclet['properties'] = processComplexProperties(props, metaUtilObj);
    }
    metaUtilObj['context'].typeDefs.push(doclet);
    return doclet;
}
function isArrayOfObjects(prop) {
    return (prop.extension &&
        prop.extension['vbdt'] &&
        prop.extension['vbdt'].itemProperties &&
        prop.type == 'Array<object>');
}
function isPotentialTypeDef(prop) {
    return prop?.jsdoc?.typedef?.name && (isArrayOfObjects(prop) || prop.properties);
}
function getTypeDefDefinition(id, metaUtilObj) {
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
                doclet = {};
                const name = isKeyboardDoc ? 'keyboardDoc' : 'touchDoc';
                const longName = `${parentDoclet.longname}.${name}`;
                doclet.id = longName;
                doclet.name = name;
                doclet.kind = 'member';
                doclet.longname = longName;
                doclet.description = tableDesc;
                doclet.memberof = parentDoclet.longname;
                doclet.meta = Object.assign({}, parentDoclet.meta);
                doclet.ojfragment = true;
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
function handlePropertyType(prop, doclet, metaUtilObj, propName) {
    let typeIsTypedef = false;
    doclet['type'] = { names: [prop['type']] };
    if (prop['reftype']) {
        if (isPotentialTypeDef(prop)) {
            typeIsTypedef = true;
            const typeDefDoclet = createTypedefFromProp(prop, metaUtilObj);
            if (propName) {
                doclet['tstype'] = [
                    {
                        target: 'Type',
                        value: isObjectBasedArrayType(prop)
                            ? `Array<${typeDefDoclet['longname']}>`
                            : typeDefDoclet['longname'],
                        for: propName,
                        jsdocOverride: true
                    }
                ];
            }
            else {
                doclet['tstype'] = [
                    {
                        target: 'Type',
                        value: isObjectBasedArrayType(prop)
                            ? `Array<${typeDefDoclet['longname']}>`
                            : typeDefDoclet['longname'],
                        jsdocOverride: true
                    }
                ];
            }
        }
        else if (isCoreJetTypeReference(prop)) {
            if (propName) {
                doclet['tstype'] = [
                    {
                        target: 'Type',
                        value: prop['reftype'],
                        for: propName,
                        jsdocOverride: true,
                        module: prop['jsdoc']['typedef']['coreJetModule']
                    }
                ];
            }
            else {
                doclet['tstype'] = [
                    {
                        target: 'Type',
                        value: prop['reftype'],
                        jsdocOverride: true,
                        module: prop['jsdoc']['typedef']['coreJetModule']
                    }
                ];
            }
        }
        else {
            if (prop['isApiDocSignature']) {
                if (propName) {
                    doclet['tstype'] = [
                        { target: 'Type', value: prop['reftype'], for: propName, jsdocOverride: true }
                    ];
                }
                else {
                    doclet['tstype'] = [{ target: 'Type', value: prop['reftype'], jsdocOverride: true }];
                }
            }
            if (prop['type'].indexOf('function') > -1 && prop['jsdoc'] && prop['jsdoc']['params']) {
                let parameters = prop['jsdoc']['params'];
                parameters.forEach((param) => {
                    if (isPotentialTypeDef(param)) {
                        createTypedefFromProp(param, metaUtilObj);
                    }
                    else if (isCoreJetTypeReference(param)) {
                        const module = doclet['tstype'][0].module;
                        doclet['tstype'][0].module = { ...module, ...param.jsdoc.typedef.coreJetModule };
                    }
                });
            }
        }
    }
    return typeIsTypedef;
}
function handleEnumValues(prop, doclet) {
    if (prop.enumValues) {
        doclet['type'] = { names: prop.enumValues.map((x) => `"${x}"`) };
        delete doclet['tstype'];
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
function injectLinkToSlotDef(doclet, slotDefProps) {
    if (doclet && doclet['description']) {
        doclet['description'] = `${doclet['description']} 
    <p><span style="font-weight: bold">Note:</span> For additional information see ${getLinks(slotDefProps)}.</p>`;
    }
}
function injectLinkToSlotContextType(dynamicSlot, slotDefProps, metaUtilObj) {
    let properties = metaUtilObj['context'].properties;
    properties.forEach((doclet) => {
        if (slotDefProps.indexOf(doclet.name) >= 0) {
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
function camelCaseToAttributeName(name) {
    return name.replace(/([A-Z])/g, function (match) {
        return '-' + match.toLowerCase();
    });
}
function getLinks(props) {
    let link = '';
    props.forEach((slotDefProp) => {
        link = `${link}, <a href="#${slotDefProp}">${camelCaseToAttributeName(slotDefProp)}</a>`;
    });
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
//# sourceMappingURL=ApiDocUtils.js.map