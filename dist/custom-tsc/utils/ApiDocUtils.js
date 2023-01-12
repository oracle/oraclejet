"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDoclets = void 0;
const path_1 = __importDefault(require("path"));
let result;
let classDoclet;
function generateDoclets(metaUtilObj) {
    result = [];
    classDoclet = getClassDoclet(metaUtilObj);
    return [
        classDoclet,
        ...getPropertyDoclets(metaUtilObj.fullMetadata.properties, classDoclet, metaUtilObj),
        ...getMethodDoclets(metaUtilObj, classDoclet),
        ...getEventDoclets(metaUtilObj, classDoclet),
        ...getSlotDoclets(metaUtilObj, classDoclet),
        ...getGestureFragments(classDoclet),
        ...result
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
        vcompdoclet['tsdeprecated'] = [...metaUtilObj.fullMetadata.status];
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
    return vcompdoclet;
}
function getPropertyDoclets(properties, parentDoclet, metaUtilObj, isArrayBased = false) {
    let doclets = [];
    for (const key in properties) {
        let typeIsTypedef = false;
        let doclet = {};
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
        doclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
        if (prop.status) {
            doclet['tsdeprecated'] = prop.status.filter((stat) => stat.type === 'deprecated');
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
        doclet['type'] = { names: [prop['type']] };
        if (prop['reftype']) {
            if (!prop.properties) {
                doclet['tstype'] = [{ target: 'Type', value: prop['reftype'], jsdocOverride: true }];
                if (prop['type'] === 'function' && prop['jsdoc'] && prop['jsdoc']['params']) {
                    let parameters = prop['jsdoc']['params'];
                    parameters.forEach((param) => {
                        if (isPotentialTypeDef(param)) {
                            createTypedef(param, metaUtilObj);
                        }
                    });
                }
            }
            else {
                doclet['type'] = { names: ['Object'] };
            }
        }
        if (isPotentialTypeDef(prop)) {
            const typeDefDoclet = createTypedef(prop, metaUtilObj);
            doclet['tstype'] = [
                { target: 'Type', value: typeDefDoclet['longname'], jsdocOverride: true }
            ];
            typeIsTypedef = true;
        }
        if (prop.enumValues) {
            doclet['type'] = { names: prop.enumValues.map((x) => `"${x}"`) };
            delete doclet['tstype'];
        }
        doclets.push(doclet);
        if (typeIsTypedef) {
            continue;
        }
        let currArrayBased = false;
        if (prop.type === 'Array<object>') {
            if ((prop.extension && prop.extension['vbdt'] && prop.extension['vbdt'].itemProperties) ||
                prop.properties) {
                currArrayBased = true;
            }
        }
        if (prop.properties || currArrayBased) {
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
        }
        doclet['meta'] = metaUtilObj.fullMetadata['jsdoc']['meta'];
        doclet['scope'] = 'instance';
        doclet['params'] = method.params;
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
    let doclets = [];
    for (const key in slots) {
        let doclet = {};
        let isDefault = false;
        doclet['memberof'] = parentDoclet.longname;
        const slot = slots[key];
        if (key == '') {
            isDefault = true;
        }
        const name = isDefault ? 'Default' : key;
        const longName = `${parentDoclet.longname}#${name}`;
        doclet['id'] = longName;
        doclet['name'] = name;
        doclet['kind'] = 'member';
        doclet['longname'] = longName;
        doclet['description'] = slot.description || '';
        if (slot['jsdoc']) {
            doclet['description'] = slot['jsdoc']['description'] || doclet['description'];
            if (slot['jsdoc']['ignore']) {
                doclet['ojhidden'] = true;
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
        mappedProp['type'] = { names: [prop['type']] };
        if (prop['reftype']) {
            if (!prop.properties) {
                mappedProp['tstype'] = [
                    { target: 'Type', value: prop['reftype'], for: key, jsdocOverride: true }
                ];
            }
            else {
                mappedProp['type'] = { names: ['Object'] };
            }
        }
        if (isPotentialTypeDef(prop)) {
            const typeDefDoclet = createTypedef(prop, metaUtilObj);
            mappedProp['tstype'] = [
                { target: 'Type', value: typeDefDoclet['longname'], jsdocOverride: true }
            ];
            typeIsTypedef = true;
        }
        if (prop.enumValues) {
            mappedProp['type'] = { names: prop.enumValues };
        }
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
function createTypedef(prop, metaUtilObj) {
    let doclet = {};
    doclet['memberof'] = classDoclet.longname;
    const typeDefMD = prop['jsdoc']['typedef'];
    const typeDefName = typeDefMD['name'];
    const typeDefLongName = `${doclet['memberof']}.${typeDefName}`;
    doclet['id'] = typeDefLongName;
    const existingDoclet = getExistingDefinition(typeDefLongName);
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
    result.push(doclet);
    return doclet;
}
function isArrayOfObjects(prop) {
    return (prop.extension &&
        prop.extension['vbdt'] &&
        prop.extension['vbdt'].itemProperties &&
        prop.type == 'Array<object>');
}
function isPotentialTypeDef(prop) {
    return prop['jsdoc'] && prop['jsdoc']['typedef'] && (isArrayOfObjects(prop) || prop.properties);
}
function getExistingDefinition(id) {
    return result.find((doclet) => doclet['id'] === id);
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
//# sourceMappingURL=ApiDocUtils.js.map