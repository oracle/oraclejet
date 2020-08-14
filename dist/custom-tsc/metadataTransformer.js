"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const DecoratorUtils_1 = require("./utils/DecoratorUtils");
const _VCOMPONENT_EXPORTS = new Set(['VComponent', 'customElement', 'dynamicDefault', 'method', 'rootProperty', '_writeback', 'event']);
const _DEFAULT_SLOT_PROP = 'children';
const _METADATA_TAG = 'ojmetadata';
const _NON_OBJECT_TYPES = new Set(['Array', 'Function', 'boolean', 'number', 'string']);
const _SLOT_TYPE = 'Slot';
const _DYNAMIC_SLOT_TYPE = 'DynamicSlots';
const _VNODE_TYPE = 'VNode';
const _ACTION = 'Action';
const _CANCELABLE_ACTION = 'CancelableAction';
const _OJ_LEGACY_VCOMP_MARKER = "__ojLegacyElement";
let _BUILD_OPTIONS;
let _CHECKER;
let _FILE_NAME;
let _IMPORT_TO_MODULE;
let _PROPS_TO_MODULE;
let _MODULE_TO_IMPORT;
let _MODULE_TO_PROPS;
let _VEXPORT_TO_ALIAS;
let _ALIAS_TO_VEXPORT;
let _VCOMP_CLASS_NAME;
let _OJ_LEGACY_VCOMP_NAME;
let _isOjLegacyVComponent = false;
function transformer(program, buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    _CHECKER = program.getTypeChecker();
    function visitor(ctx, sf) {
        _IMPORT_TO_MODULE = {};
        _MODULE_TO_IMPORT = {};
        _PROPS_TO_MODULE = {};
        _MODULE_TO_PROPS = {};
        _VEXPORT_TO_ALIAS = {};
        _ALIAS_TO_VEXPORT = {};
        _BUILD_OPTIONS.componentToMetadata = null;
        _BUILD_OPTIONS.importMaps = null;
        _isOjLegacyVComponent = false;
        _FILE_NAME = sf.fileName;
        const isTsx = path.extname(_FILE_NAME) === '.tsx';
        if (_BUILD_OPTIONS['debug'])
            console.log(`${_FILE_NAME}: processing metadata...`);
        const visitor = (node) => {
            if (isTsx && ts.isImportDeclaration(node)) {
                storeImport(node);
                return node;
            }
            else if (ts.isTypeAliasDeclaration(node)) {
                if (node.name.getText() === _OJ_LEGACY_VCOMP_MARKER) {
                    let typeDeclaration = _CHECKER.getTypeAtLocation(node.type);
                    _OJ_LEGACY_VCOMP_NAME = typeDeclaration.value;
                    _isOjLegacyVComponent = true;
                    return node;
                }
            }
            else if (ts.isClassDeclaration(node)) {
                const classNode = node;
                return genVComponentMetadata(classNode);
            }
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return (sf) => ts.visitNode(sf, visitor(ctx, sf));
    };
}
exports.default = transformer;
function genVComponentMetadata(classNode) {
    var _a, _b;
    const heritageClauses = classNode.heritageClauses;
    _VCOMP_CLASS_NAME = undefined;
    if (!heritageClauses) {
        return classNode;
    }
    let propsType = null;
    for (let clause of heritageClauses) {
        for (let type of clause.types) {
            if (type.expression.getText() === _VEXPORT_TO_ALIAS.VComponent) {
                _VCOMP_CLASS_NAME = classNode.name.getText();
                propsType = (_a = type.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
                break;
            }
        }
    }
    const decorator = DecoratorUtils_1.getDecorator(classNode, _VEXPORT_TO_ALIAS.customElement);
    if (decorator && !_VCOMP_CLASS_NAME) {
        throw new Error(`${_FILE_NAME}: A @customElement decorator was found on class ${classNode.name.getText()} that is not extending VComponent.`);
    }
    let elementName = decorator === null || decorator === void 0 ? void 0 : decorator.expression['arguments'][0].text;
    const fullMeta = {
        name: elementName,
        version: _BUILD_OPTIONS['version'],
        jetVersion: _BUILD_OPTIONS['jetVersion'],
        type: _BUILD_OPTIONS['coreJetBuildOptions'] ? 'core' : 'composite',
    };
    if (elementName) {
        if (_isOjLegacyVComponent) {
            fullMeta['ojLegacyVComponent'] = _OJ_LEGACY_VCOMP_NAME;
        }
        getDTMetadataForComponent(fullMeta, classNode);
    }
    const rtMeta = {};
    if (propsType) {
        const propsClass = getTypeNameNoGenerics(propsType);
        const propsModule = _IMPORT_TO_MODULE[propsClass];
        if (propsModule) {
            _PROPS_TO_MODULE[propsClass] = propsModule;
            if (!_MODULE_TO_PROPS[propsModule]) {
                _MODULE_TO_PROPS[propsModule] = [];
            }
            _MODULE_TO_PROPS[propsModule].push(propsClass);
        }
        rtMeta.extension = { _DEFAULTS: propsClass };
        checkReservedProps(propsType, true);
        genPropsMetadata(propsType, rtMeta, fullMeta);
        fullMeta['propsClassName'] = propsClass;
    }
    if (elementName) {
        genMethodsMetadata(classNode.members, rtMeta, fullMeta);
    }
    storeBuildOptions(fullMeta);
    if (elementName) {
        writeMetaFiles(fullMeta, elementName);
        return injectClassMetadata(classNode, rtMeta);
    }
    if ((_b = rtMeta.extension) === null || _b === void 0 ? void 0 : _b._DEFAULTS) {
        return injectClassMetadata(classNode, { extension: { _DEFAULTS: rtMeta.extension._DEFAULTS } });
    }
    return classNode;
}
function genPropsMetadata(propsNode, rtMeta, fullMeta) {
    let typeParams = [];
    let jsxTypeParam = [];
    walkTypeNodeMembers(propsNode, (memberSymbol, memberKey) => {
        const propDeclaration = memberSymbol.valueDeclaration;
        const prop = memberKey;
        if (!isGenericTypeParameter(memberSymbol)) {
            const decorators = DecoratorUtils_1.getDecorators(propDeclaration);
            if (decorators[_VEXPORT_TO_ALIAS.rootProperty]) {
                genControlledRootPropMetadata(prop, rtMeta);
            }
            else {
                const typeName = getPropertyType(propDeclaration);
                if (!genSlotMetadata(prop, propDeclaration, rtMeta, fullMeta, typeName) &&
                    !genEventMetadata(prop, propDeclaration, decorators, rtMeta, fullMeta, typeName)) {
                    if (!rtMeta.properties) {
                        rtMeta.properties = {};
                        fullMeta.properties = {};
                    }
                    const rt = getMetadataForProp(memberSymbol, propDeclaration, decorators, false);
                    const dt = getMetadataForProp(memberSymbol, propDeclaration, decorators, true);
                    rtMeta.properties[prop] = rt;
                    fullMeta.properties[prop] = dt;
                }
            }
        }
        else {
            typeParams.push(memberSymbol.name);
            jsxTypeParam.push('any');
        }
    });
    if (typeParams.length > 0) {
        fullMeta['propsTypeParams'] = `<${typeParams.join()}>`;
        fullMeta['propsTypeParamsAny'] = `<${jsxTypeParam.join()}>`;
    }
}
function genMethodsMetadata(members, rtMeta, fullMeta) {
    fullMeta.methods = {
        setProperty: {
            description: "Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.",
            help: "setProperty",
            params: [
                {
                    name: "property",
                    description: "The property name to set. Supports dot notation for subproperty access.",
                    type: "string"
                },
                {
                    name: "value",
                    description: "The new value to set the property to.",
                    type: "any"
                }
            ],
            return: "void"
        },
        getProperty: {
            description: "Retrieves the value of a property or a subproperty.",
            help: "getProperty",
            params: [
                {
                    name: "property",
                    description: "The property name to get. Supports dot notation for subproperty access.",
                    type: "string"
                }
            ],
            return: "any"
        },
        setProperties: {
            description: "Performs a batch set of properties.",
            help: "setProperties",
            params: [
                {
                    name: "properties",
                    description: "An object containing the property and value pairs to set.",
                    type: "object"
                }
            ],
            return: "void"
        }
    };
    members.forEach(member => {
        if (DecoratorUtils_1.getDecorator(member, _VEXPORT_TO_ALIAS.method)) {
            const methodName = member.name.getText();
            if (!rtMeta.methods) {
                rtMeta.methods = {};
            }
            rtMeta.methods[methodName] = {};
            fullMeta.methods[methodName] = getDtMetadataForMethod(member);
        }
    });
}
function genSlotMetadata(memberKey, propDeclaration, rtMeta, fullMeta, typeName) {
    if (!typeName)
        return false;
    let slotProp = memberKey;
    if (slotProp === _DEFAULT_SLOT_PROP) {
        checkDefaultSlotType(typeName);
    }
    switch (typeName) {
        case `${_VEXPORT_TO_ALIAS.VComponent}.${_VNODE_TYPE}`:
            slotProp = "";
        case `${_VEXPORT_TO_ALIAS.VComponent}.${_SLOT_TYPE}`:
            if (!rtMeta.slots) {
                rtMeta.slots = {};
                fullMeta.slots = {};
            }
            rtMeta.slots[slotProp] = {};
            fullMeta.slots[slotProp] = getDtMetadataForSlot(propDeclaration);
            return true;
        case `${_VEXPORT_TO_ALIAS.VComponent}.${_DYNAMIC_SLOT_TYPE}`:
            rtMeta.extension._DYNAMIC_SLOT_PROP = memberKey;
            return true;
        default:
            return false;
    }
}
function genEventMetadata(memberKey, propDeclaration, decorators, rtMeta, fullMeta, typeName) {
    if (!typeName)
        return false;
    const rtEventMeta = {};
    const eventDecorator = decorators[_VEXPORT_TO_ALIAS.event];
    if (eventDecorator) {
        rtEventMeta.bubbles = DecoratorUtils_1.getDecoratorParamValue(eventDecorator, 'bubbles') === true;
    }
    switch (typeName) {
        case `${_VEXPORT_TO_ALIAS.VComponent}.${_CANCELABLE_ACTION}`:
            rtEventMeta.cancelable = true;
        case `${_VEXPORT_TO_ALIAS.VComponent}.${_ACTION}`:
            const eventProp = `${memberKey[2].toLowerCase()}${memberKey.substring(3)}`;
            if (!rtMeta.events) {
                rtMeta.events = {};
                fullMeta.events = {};
            }
            rtMeta.events[eventProp] = rtEventMeta;
            fullMeta.events[eventProp] = Object.assign({}, rtEventMeta, getDtMetadataForEvent(propDeclaration));
            return true;
        default:
            return false;
    }
}
function genControlledRootPropMetadata(prop, rtMeta) {
    if (prop === 'id' || prop === 'style' || prop === 'class') {
        console.log(`${_FILE_NAME}: '${prop}' cannot be a controlled root property and will be ignored.`);
        return;
    }
    if (!rtMeta.extension) {
        rtMeta.extension = { _ROOT_PROPS_MAP: {} };
    }
    else if (!rtMeta.extension._ROOT_PROPS_MAP) {
        rtMeta.extension._ROOT_PROPS_MAP = {};
    }
    rtMeta.extension._ROOT_PROPS_MAP[prop] = true;
}
function getMetadataForProp(memberSymbol, propDeclaration, decorators, includeDtMetadata) {
    let md;
    const metaObj = getAllMetadataForDeclaration(propDeclaration, includeDtMetadata);
    let stack = [];
    if (includeDtMetadata && metaObj.type === 'Array<object>') {
        stack.push(propDeclaration.name.getText());
    }
    const subprops = getComplexPropertyMetadata(memberSymbol, metaObj.type, includeDtMetadata, stack);
    md = metaObj;
    if (subprops) {
        if (subprops.circularRefs) {
            md.type = 'object';
        }
        else if (metaObj.type === 'Array<object>') {
            if (includeDtMetadata) {
                md.extension = {};
                md.extension['vbdt'] = {};
                md.extension['vbdt']['itemProperties'] = subprops;
            }
        }
        else {
            md.type = 'object';
            md.properties = subprops;
        }
    }
    else {
        if (includeDtMetadata) {
            metaObj['optional'] = propDeclaration['questionToken'] ? true : false;
        }
        md = metaObj;
    }
    if (propDeclaration.initializer) {
        if (decorators[_VEXPORT_TO_ALIAS.dynamicDefault]) {
            console.log(`${_FILE_NAME}: Default value should not be set when using a dynamic getter for property '${memberSymbol.name}'.`);
        }
        const value = parseStringValueToJson(memberSymbol.name, propDeclaration.initializer.kind, propDeclaration.initializer.getText());
        if (value !== undefined) {
            if (!md.properties) {
                md.value = value;
            }
            else {
                updateComplexPropertyValues(md.properties, value);
            }
        }
    }
    const writebackDecorator = decorators[_VEXPORT_TO_ALIAS._writeback];
    if (writebackDecorator) {
        md.writeback = true;
        md.readOnly = DecoratorUtils_1.getDecoratorParamValue(writebackDecorator, 'readOnly') === true;
    }
    return md;
}
function getDTMetadataForComponent(fullMeta, classDeclaration) {
    updateDtMetadata(fullMeta, classDeclaration);
    if (!fullMeta.version) {
        throw new Error(`${_FILE_NAME}: The 'version' metadata must be specified for this component.\n Please use @ojmetadata version <version_numer> in the jsdoc section of your class extending VComponent.`);
    }
}
function getDtMetadataForEvent(propDeclaration) {
    const dt = {};
    const typeName = getPropertyType(propDeclaration);
    const typeRefNode = propDeclaration.type;
    let cancelableDetail = null;
    if (typeName === `${_VEXPORT_TO_ALIAS.VComponent}.${_CANCELABLE_ACTION}`) {
        cancelableDetail = {
            accept: {
                description: "This method can be called with an application-created Promise to cancel this event asynchronously.  The Promise should be resolved or rejected to accept or cancel the event, respectively.",
                type: "function"
            }
        };
    }
    updateDtMetadata(dt, propDeclaration);
    if (typeRefNode.typeArguments && typeRefNode.typeArguments.length) {
        const detailNode = typeRefNode.typeArguments[0];
        if (detailNode.kind == ts.SyntaxKind.TypeReference) {
            const detailRefType = getTypeReferenceNodeSignature(detailNode, false).reftype;
            dt['reftype'] = detailRefType;
        }
        const detailObj = getEventDetails(detailNode);
        if (detailObj) {
            dt['detail'] = Object.assign({}, cancelableDetail, detailObj);
        }
    }
    return dt;
}
function getEventDetails(detailNode) {
    let detailMetadata = {};
    const detailSymbol = _CHECKER.getTypeAtLocation(detailNode).getSymbol();
    detailMetadata = processEventDetailMembers(detailSymbol);
    return detailMetadata;
}
function processEventDetailMembers(detailType) {
    var _a;
    let details;
    const members = detailType['members'] || ((_a = detailType['symbol']) === null || _a === void 0 ? void 0 : _a.members);
    members.forEach((value, key) => {
        const propSignature = value.valueDeclaration;
        if (!propSignature) {
            return;
        }
        const symbolType = _CHECKER.getTypeOfSymbolAtLocation(value, propSignature);
        if (ts.isPropertySignature(propSignature) || ts.isPropertyDeclaration(propSignature)) {
            const property = key.toString();
            const eventDetailMetadata = getAllMetadataForDeclaration(propSignature, true);
            details = details || {};
            details[property] = eventDetailMetadata;
            if (possibleComplexProperty(symbolType, eventDetailMetadata.type, true)) {
                let stack = [];
                if (eventDetailMetadata.type === 'Array<object>') {
                    stack.push(key);
                }
                const subprops = getComplexPropertyMetadata(value, eventDetailMetadata.type, true, stack);
                if (subprops) {
                    if (eventDetailMetadata.type === 'Array<object>') {
                        details[property].extension = {};
                        details[property].extension.vbdt = {};
                        details[property].extension.vbdt.itemProperties = subprops;
                    }
                    else {
                        details[property].type = 'object';
                        details[property].properties = subprops;
                    }
                }
            }
        }
    });
    return details;
}
function getArrayTypeNodeSignature(node) {
    let typeObj = { type: 'Array' };
    if (ts.isArrayTypeNode(node)) {
        const arrayNode = node;
        const elementType = arrayNode.elementType;
        const typeName = elementType.getText();
        if (ts.isTypeReferenceNode(elementType)) {
            typeObj.type = 'Array<object>';
            typeObj['reftype'] = `Array<${typeName}>`;
        }
        else {
            typeObj.type = `Array<${typeName}>`;
        }
    }
    else if (ts.isTypeReferenceNode(node)) {
        let types = getTypeReferenceNodeSignature(node, false);
        typeObj['reftype'] = types.reftype ? types.reftype : types.type;
        typeObj['type'] = types.type;
    }
    return typeObj;
}
function getFunctionTypeNodeSignature(node) {
    let typeObj = { type: 'function' };
    if (ts.isFunctionTypeNode(node)) {
        const functionNode = node;
        const parameters = functionNode.parameters;
        let signature = '(';
        for (let i = 0; i < parameters.length; i++) {
            const parameter = parameters[i];
            signature += parameter.name.getText();
            if (parameter.type) {
                const paramSymbolType = _CHECKER.getTypeAtLocation(parameter.type);
                const strType = _CHECKER.typeToString(paramSymbolType);
                signature += `:${strType}`;
            }
            if (i < parameters.length - 1) {
                signature += ',';
            }
        }
        signature += ')';
        const returnType = functionNode.type;
        const returnTypeSymbol = _CHECKER.getTypeAtLocation(returnType);
        const strType = _CHECKER.typeToString(returnTypeSymbol);
        signature += ` => ${strType}`;
        typeObj['reftype'] = signature;
    }
    return typeObj;
}
function getUnionTypeNodeSignature(node) {
    let typeObj = { type: 'string' };
    const unionNode = node;
    let enumValues = [];
    const unionNodeSymbol = _CHECKER.getTypeAtLocation(unionNode);
    const strType = _CHECKER.typeToString(unionNodeSymbol);
    if (strType === 'any') {
        return { type: 'any' };
    }
    enumValues = getEnumsFromUnion(unionNode);
    if (enumValues) {
        typeObj['enumValues'] = enumValues.filter((enumVal) => (enumVal !== null));
        if (enumValues.some((enumVal) => (enumVal === null))) {
            typeObj.type = 'string|null';
        }
    }
    else {
        let regTypes = new Set();
        let reftypes = new Set();
        unionNode.types.forEach(typeNode => {
            let kind = typeNode.kind;
            switch (kind) {
                case ts.SyntaxKind.StringKeyword:
                    regTypes.add('string');
                    reftypes.add('string');
                    break;
                case ts.SyntaxKind.NumberKeyword:
                    regTypes.add('number');
                    reftypes.add('number');
                    break;
                case ts.SyntaxKind.BooleanKeyword:
                    regTypes.add('boolean');
                    reftypes.add('boolean');
                    break;
                case ts.SyntaxKind.NullKeyword:
                    regTypes.add('null');
                    reftypes.add('null');
                    break;
                case ts.SyntaxKind.ObjectKeyword:
                    regTypes.add('object');
                    reftypes.add('object');
                    break;
                case ts.SyntaxKind.ArrayType:
                    const data = getArrayTypeNodeSignature(typeNode);
                    regTypes.add(data.type);
                    if (data.reftype) {
                        reftypes.add(data.reftype);
                    }
                    else {
                        reftypes.add(data.type);
                    }
                    break;
                case ts.SyntaxKind.TypeReference:
                    const refTypeNode = typeNode;
                    const refTypes = getTypeReferenceNodeSignature(refTypeNode, false);
                    regTypes.add(refTypes.type);
                    reftypes.add(refTypes['reftype']);
                    break;
                case ts.SyntaxKind.ParenthesizedType:
                    const parTypeNode = typeNode;
                    if (parTypeNode.type.kind === ts.SyntaxKind.FunctionType) {
                        regTypes.add('function');
                        reftypes.add(`( ${parTypeNode.type.getText()} )`);
                    }
                    break;
                default:
                    regTypes.add(strType);
                    reftypes.add(strType);
                    break;
            }
        });
        let iter = regTypes.values();
        if (regTypes.has('any')) {
            typeObj['type'] = 'any';
        }
        else {
            enumValues = [];
            for (let val of iter) {
                enumValues.push(val);
            }
            typeObj['type'] = enumValues.join('|');
        }
        iter = reftypes.values();
        enumValues = [];
        for (let val of iter) {
            enumValues.push(val);
        }
        typeObj['reftype'] = enumValues.join('|');
    }
    return typeObj;
}
function getTypeReferenceNodeSignature(node, isPropSignature) {
    var _a, _b, _c, _d, _e;
    const typeRefNode = node;
    let refNodeTypeName = typeRefNode.typeName.getText();
    const typeObject = _CHECKER.getTypeAtLocation(typeRefNode);
    const strType = _CHECKER.typeToString(typeObject);
    if (typeRefNode.typeArguments) {
        refNodeTypeName += getGenericTypeParameters(typeRefNode);
    }
    let typeObj = { type: strType, reftype: refNodeTypeName };
    let symbol, kind;
    let declaration;
    if (typeObject.symbol) {
        symbol = typeObject.symbol;
        declaration = (_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0];
        kind = declaration.kind;
    }
    else if (typeObject.aliasSymbol) {
        symbol = typeObject.aliasSymbol;
        declaration = (_b = symbol.declarations) === null || _b === void 0 ? void 0 : _b[0];
        declaration = declaration.type;
        kind = declaration.kind;
    }
    if (!symbol) {
        return typeObj;
    }
    switch (kind) {
        case ts.SyntaxKind.FunctionType:
            typeObj = { type: 'function', reftype: refNodeTypeName };
            break;
        case ts.SyntaxKind.ArrayType:
            typeObj = getArrayTypeNodeSignature(declaration);
            typeObj.reftype = refNodeTypeName;
            break;
        case ts.SyntaxKind.UnionType:
            typeObj = getUnionTypeNodeSignature(declaration);
            typeObj.reftype = refNodeTypeName;
            break;
        case ts.SyntaxKind.InterfaceDeclaration:
            if (symbol.name === 'Array') {
                if (typeRefNode.typeArguments) {
                    let typevars = '';
                    let typearg = typeRefNode.typeArguments[0];
                    if (typearg.kind === ts.SyntaxKind.TypeReference) {
                        let types = getTypeReferenceNodeSignature(typearg, false);
                        typeObj['reftype'] = `Array<${(_c = types.reftype) !== null && _c !== void 0 ? _c : types.type}>`;
                        typeObj['type'] = `Array<${types.type}>`;
                        return typeObj;
                    }
                    else if (typearg.kind === ts.SyntaxKind.UnionType) {
                        let types = getUnionTypeNodeSignature(typearg);
                        typeObj['reftype'] = `Array<${(_d = types.reftype) !== null && _d !== void 0 ? _d : types.type}>`;
                        typeObj['type'] = `Array<${types.type}>`;
                        return typeObj;
                    }
                    else {
                        typevars = typearg.getText();
                    }
                    typeObj['reftype'] = `Array<${typevars}>`;
                    if (['string', 'number', 'boolean'].indexOf(typevars.toLowerCase()) > -1) {
                        typeObj['type'] = `Array<${typevars.toLowerCase()}>`;
                    }
                    else {
                        typeObj['type'] = 'Array<object>';
                    }
                }
                else {
                    if (typeObject.aliasSymbol) {
                        symbol = typeObject.aliasSymbol;
                        declaration = (_e = symbol.declarations) === null || _e === void 0 ? void 0 : _e[0];
                        declaration = declaration.type;
                        typeObj = { type: getArrayTypeNodeSignature(declaration).type, reftype: refNodeTypeName };
                    }
                }
            }
            else if (symbol.name === 'Function') {
                typeObj['type'] = 'function';
            }
            else if (['Number', 'String', 'Boolean', 'Object'].indexOf(symbol.name) > -1) {
                typeObj['reftype'] = strType;
                typeObj['type'] = strType.toLowerCase();
            }
            else if (symbol.name === 'Promise') {
                typeObj['type'] = 'Promise';
            }
            else {
                typeObj['type'] = (isPropSignature && symbolHasPropertySignatureMembers(symbol)) || isDomType(typeObject) ? strType : 'object';
            }
            break;
        case ts.SyntaxKind.TypeParameter:
            typeObj['type'] = 'any';
            typeObj['reftype'] = declaration.getText();
            break;
        case ts.SyntaxKind.EnumDeclaration:
            const enumDeclaration = declaration;
            const members = enumDeclaration.members;
            let enums = [];
            const initializer = members[0].initializer;
            if (initializer && initializer.kind === ts.SyntaxKind.StringLiteral) {
                typeObj['type'] = 'string';
                members.forEach((member) => {
                    enums.push(_CHECKER.getConstantValue(member));
                });
                typeObj['enumValues'] = enums;
            }
            else {
                typeObj['type'] = 'number';
            }
            break;
        default:
            typeObj['type'] = (isPropSignature && symbolHasPropertySignatureMembers(symbol)) || isDomType(typeObject) ? strType : 'object';
            break;
    }
    return typeObj;
}
function symbolHasPropertySignatureMembers(symbolType) {
    var _a;
    const members = symbolType['members'] || ((_a = symbolType['symbol']) === null || _a === void 0 ? void 0 : _a.members);
    if (!members || members.size === 0) {
        return false;
    }
    let bRetVal = true;
    members.forEach((symbol) => {
        var _a;
        const memberType = (_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0].kind;
        if (memberType !== ts.SyntaxKind.PropertySignature) {
            bRetVal = false;
        }
    });
    return bRetVal;
}
function getDtMetadataForMethod(method) {
    const dt = {};
    updateDtMetadata(dt, method);
    dt.params = dt.params || [];
    const findParameter = (pname) => dt.params.find(param => param.name === pname);
    const methodParams = [];
    if (method.parameters) {
        method.parameters.forEach(parameter => {
            const name = parameter.name.getText();
            const typeObj = getAllMetadataForDeclaration(parameter, true);
            let mParamObj = { name, type: typeObj.type };
            let dtParamObj = findParameter(name);
            if (dtParamObj) {
                mParamObj = Object.assign({}, dtParamObj, mParamObj);
            }
            methodParams.push(mParamObj);
        });
    }
    if (methodParams.length > 0) {
        dt.params = methodParams;
    }
    else {
        delete dt.params;
    }
    const returnTypeObj = getAllMetadataForDeclaration(method, true);
    dt.return = returnTypeObj.type;
    return dt;
}
function getDtMetadataForSlot(propDeclaration) {
    const dt = {};
    const declaration = propDeclaration;
    updateDtMetadata(dt, declaration);
    const typeRefNode = propDeclaration.type;
    if (typeRefNode.typeArguments && typeRefNode.typeArguments.length) {
        const detailNode = typeRefNode.typeArguments[0];
        const dataObj = getSlotData(detailNode);
        if (dataObj) {
            dt['data'] = dataObj;
        }
    }
    return dt;
}
function getSlotData(detailNode) {
    let slotData = {};
    const dataSymbol = _CHECKER.getTypeAtLocation(detailNode).getSymbol();
    slotData = processSlotDataMembers(dataSymbol);
    return slotData;
}
function processSlotDataMembers(detailType) {
    var _a;
    let data;
    const members = detailType['members'] || ((_a = detailType['symbol']) === null || _a === void 0 ? void 0 : _a.members);
    members.forEach((value, key) => {
        const propSignature = value.valueDeclaration;
        if (!propSignature) {
            return;
        }
        const symbolType = _CHECKER.getTypeOfSymbolAtLocation(value, propSignature);
        if (ts.isPropertySignature(propSignature) || ts.isPropertyDeclaration(propSignature)) {
            const property = key.toString();
            const slotDataMetadata = getAllMetadataForDeclaration(propSignature, true);
            data = data || {};
            data[property] = slotDataMetadata;
            if (possibleComplexProperty(symbolType, slotDataMetadata.type, true)) {
                let stack = [];
                if (slotDataMetadata.type === 'Array<object>') {
                    stack.push(key);
                }
                const subprops = getComplexPropertyMetadata(value, slotDataMetadata.type, true, stack);
                if (subprops) {
                    if (slotDataMetadata.type === 'Array<object>') {
                        data[property].extension = {};
                        data[property].extension.vbdt = {};
                        data[property].extension.vbdt.itemProperties = subprops;
                    }
                    else {
                        data[property].type = 'object';
                        data[property].properties = subprops;
                    }
                }
            }
            pruneMetadataProperties(data[property]);
        }
    });
    return data;
}
function walkTypeNodeMembers(typeNode, callback) {
    const typeAtLoc = _CHECKER.getTypeAtLocation(typeNode);
    const symbol = typeAtLoc.getSymbol();
    const members = symbol.members;
    if (members) {
        members.forEach((memberSymbol, memberKey) => {
            callback(memberSymbol, memberKey);
        });
    }
}
function writeMetaFiles(fullMeta, elementName) {
    pruneMetadataProperties(fullMeta.properties);
    delete fullMeta['propsTypeParams'];
    delete fullMeta['propsTypeParamsAny'];
    delete fullMeta['ojLegacyVComponent'];
    delete fullMeta['propsClassName'];
    pruneMetadataProperties(fullMeta.events);
    const dtDir = _BUILD_OPTIONS.dtDir;
    if (!fs.existsSync(dtDir)) {
        fs.mkdirSync(dtDir, { recursive: true });
    }
    fs.writeFileSync(`${dtDir}/${elementName}.json`, JSON.stringify(fullMeta, null, 2));
}
function parseStringValueToJson(memberName, type, value) {
    try {
        switch (type) {
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.NumericLiteral:
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
                return JSON.parse(value);
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.ObjectLiteralExpression:
            case ts.SyntaxKind.ArrayLiteralExpression:
                return (new Function('return ' + value)());
            default:
                return undefined;
        }
    }
    catch (ex) {
        console.log(`${_FILE_NAME}: Unable to convert the default value '${value}' to JSON for property '${memberName}'.`);
        return undefined;
    }
}
function getAllMetadataForDeclaration(declarationWithType, includeDtMetadata) {
    var _a;
    let metadata = { type: 'any' };
    if (includeDtMetadata) {
        updateDtMetadata(metadata, declarationWithType);
    }
    if (!declarationWithType.type) {
        console.log(`${_FILE_NAME}: No type provided, defaulting to 'any' for property '${(_a = declarationWithType['name']) === null || _a === void 0 ? void 0 : _a.getText()}'.`);
        return metadata;
    }
    const declarationType = declarationWithType.type;
    const kind = declarationType.kind;
    const symbolType = _CHECKER.getTypeAtLocation(declarationType);
    const strType = _CHECKER.typeToString(symbolType);
    let isPropSignature = ts.isPropertySignature(declarationWithType) || ts.isPropertyDeclaration(declarationWithType);
    let typeObj;
    switch (kind) {
        case ts.SyntaxKind.TypeReference:
            typeObj = getTypeReferenceNodeSignature(declarationType, isPropSignature);
            break;
        case ts.SyntaxKind.FunctionType:
            typeObj = getFunctionTypeNodeSignature(declarationType);
            break;
        case ts.SyntaxKind.ArrayType:
            typeObj = getArrayTypeNodeSignature(declarationType);
            break;
        case ts.SyntaxKind.TypeLiteral:
            typeObj = { type: 'object' };
            break;
        case ts.SyntaxKind.UnionType:
            typeObj = getUnionTypeNodeSignature(declarationType);
            break;
        case ts.SyntaxKind.StringKeyword:
        case ts.SyntaxKind.NumberKeyword:
        case ts.SyntaxKind.BooleanKeyword:
        default:
            typeObj = { type: strType };
            break;
    }
    if (!includeDtMetadata) {
        delete typeObj.reftype;
        delete typeObj.optional;
    }
    return Object.assign({}, metadata, typeObj);
}
function getEnumsFromUnion(type) {
    const enums = [];
    type['types'].forEach(type => {
        const literal = type['literal'];
        if ((literal === null || literal === void 0 ? void 0 : literal.kind) === ts.SyntaxKind.StringLiteral) {
            enums.push(literal.text);
        }
        else if (type.kind === ts.SyntaxKind.NullKeyword) {
            enums.push(null);
        }
    });
    return enums.length === type['types'].length ? enums : null;
}
function metadataToAstNodes(value) {
    if (Array.isArray(value)) {
        return ts.createArrayLiteral(value.map(item => metadataToAstNodes(item)));
    }
    switch (typeof value) {
        case 'string':
            return ts.createStringLiteral(value);
        case 'number':
            return ts.createNumericLiteral(String(value));
        case 'boolean':
            return value ? ts.createTrue() : ts.createFalse();
        case 'object':
            if (!value) {
                return ts.createNull();
            }
            const keys = Object.keys(value);
            return ts.createObjectLiteral(keys.map(key => {
                return ts.createPropertyAssignment(ts.createStringLiteral(key), (key === '_DEFAULTS') ? ts.createIdentifier(value[key]) : metadataToAstNodes(value[key]));
            }));
    }
}
function getTypeNameNoGenerics(node) {
    return _CHECKER.getTypeAtLocation(node).getSymbol().getName();
}
function isGenericTypeParameter(symbol) {
    return symbol.declarations && symbol.declarations[0].kind === ts.SyntaxKind.TypeParameter;
}
function trimQuotes(text) {
    return text.slice(1, text.length - 1);
}
function getPropertyType(propDeclaration) {
    let typeName;
    const propName = propDeclaration.name.getText();
    const typeRef = propDeclaration.type;
    if (typeRef) {
        const kind = typeRef.kind;
        switch (kind) {
            case ts.SyntaxKind.TypeReference:
                typeName = typeRef.typeName.getText();
                if (typeName === 'Array' && propName === _DEFAULT_SLOT_PROP) {
                    typeName = typeRef.typeArguments[0].getText();
                }
                break;
            case ts.SyntaxKind.ArrayType:
                typeName = typeRef.elementType.getText();
                break;
            default:
                break;
        }
    }
    return typeName;
}
function checkDefaultSlotType(typeName) {
    if (typeName !== `${_VEXPORT_TO_ALIAS.VComponent}.${_VNODE_TYPE}`) {
        throw new Error(`${_FILE_NAME}: Unsupported type '${typeName}' for reserved default slot property name '${_DEFAULT_SLOT_PROP}'.`);
    }
}
function getComplexPropertyMetadata(memberSymbol, type, includeDtMetadata, stack) {
    var _a;
    const returnObj = getComplexPropertyHelper(memberSymbol, type, new Set(), includeDtMetadata, stack);
    if (((_a = returnObj.circularRefs) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        return { circularRefs: { type: returnObj.circularRefs[0] } };
    }
    return returnObj.metadata;
}
function getComplexPropertyHelper(memberSymbol, type, seen, includeDtMetadata, stack) {
    var _a;
    let symbolType = _CHECKER.getTypeOfSymbolAtLocation(memberSymbol, memberSymbol.valueDeclaration).getNonNullableType();
    if (type === 'Array<object>') {
        const kind = memberSymbol.valueDeclaration.kind;
        if (kind == ts.SyntaxKind.PropertyDeclaration || kind == ts.SyntaxKind.PropertySignature) {
            const declaration = memberSymbol.valueDeclaration;
            let typeRefNode;
            if (declaration.type.kind == ts.SyntaxKind.ArrayType) {
                const arrTypeNode = declaration.type;
                typeRefNode = arrTypeNode.elementType;
            }
            if (declaration.type.kind == ts.SyntaxKind.TypeReference) {
                const typeArgRef = declaration.type;
                typeRefNode = typeArgRef.typeArguments[0];
            }
            if (typeRefNode.kind !== ts.SyntaxKind.TypeLiteral) {
                type = typeRefNode.getText();
            }
            let typeObject = _CHECKER.getTypeAtLocation(typeRefNode);
            symbolType = typeObject;
        }
    }
    if (!possibleComplexProperty(symbolType, type, includeDtMetadata)) {
        return {};
    }
    if (type !== 'object') {
        seen.add(type);
    }
    const members = (_a = symbolType.symbol) === null || _a === void 0 ? void 0 : _a.members;
    if (!members || members.size === 0) {
        return {};
    }
    let continueWalk = true;
    let circularRefs = [];
    const metadata = {};
    try {
        members.forEach((symbol) => {
            var _a;
            if (!continueWalk) {
                return;
            }
            const memberType = (_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0].kind;
            if (memberType !== ts.SyntaxKind.PropertySignature) {
                continueWalk = false;
                return;
            }
            const typeObj = getAllMetadataForDeclaration(symbol.valueDeclaration, includeDtMetadata);
            const type = typeObj.type;
            if (seen.has(type)) {
                circularRefs.push(type);
                continueWalk = false;
                throw 'Circular dependency detected';
            }
        });
    }
    catch (ex) { }
    if (!continueWalk) {
        return { circularRefs };
    }
    try {
        members.forEach((symbol, key) => {
            var _a;
            const metaObj = getAllMetadataForDeclaration(symbol.valueDeclaration, includeDtMetadata);
            if (includeDtMetadata) {
                metaObj.optional = symbol.valueDeclaration['questionToken'] ? true : false;
            }
            let type = metaObj.type;
            const prop = key;
            let isExtensionMd = false;
            if (includeDtMetadata && type === 'Array<object>') {
                isExtensionMd = true;
                stack.push(prop);
            }
            const returnObj = getComplexPropertyHelper(symbol, type, new Set(seen), includeDtMetadata, stack);
            if (isExtensionMd) {
                stack.pop();
            }
            if (((_a = returnObj.circularRefs) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                circularRefs = returnObj.circularRefs;
                continueWalk = false;
                throw 'Circular dependency detected';
            }
            else {
                metadata[prop] = metaObj;
                if (returnObj.metadata) {
                    if (metaObj.type === 'Array<object>') {
                        if (includeDtMetadata) {
                            if (stack.length == 0) {
                                metadata[prop].type = 'Array<object>';
                                metadata[prop].extension = {};
                                metadata[prop].extension['vbdt'] = {};
                                metadata[prop].extension['vbdt']['itemProperties'] = returnObj.metadata;
                            }
                            else {
                                metadata[prop].type = 'Array<object>';
                                metadata[prop].properties = returnObj.metadata;
                            }
                        }
                        else {
                            metadata[prop].type = 'Array<object>';
                        }
                    }
                    else {
                        metadata[prop].type = 'object';
                        metadata[prop].properties = returnObj.metadata;
                    }
                }
            }
        });
    }
    catch (ex) {
        return { circularRefs };
    }
    return { metadata: continueWalk ? metadata : null };
}
function possibleComplexProperty(symbolType, type, checkForDt) {
    let iscomplex = true;
    if (_NON_OBJECT_TYPES.has(type) || isDomType(symbolType) || isClassDeclaration(symbolType) || (type.indexOf('|') > -1)) {
        iscomplex = false;
        if (checkForDt && type.indexOf('Array') > -1) {
            iscomplex = true;
        }
    }
    return iscomplex;
}
function isDomType(symbolType) {
    var _a;
    let isDomType = false;
    const declaration = (_a = symbolType === null || symbolType === void 0 ? void 0 : symbolType.symbol) === null || _a === void 0 ? void 0 : _a.declarations[0];
    if (declaration && declaration.parent && ts.isSourceFile(declaration === null || declaration === void 0 ? void 0 : declaration.parent)) {
        const sourceFile = declaration.parent;
        isDomType = sourceFile.isDeclarationFile && sourceFile.fileName.indexOf('typescript/lib/lib.dom.d.ts') > -1;
    }
    return isDomType;
}
function updateComplexPropertyValues(rt, values) {
    if (rt) {
        for (let [key, value] of Object.entries(values)) {
            if (!rt[key].properties) {
                rt[key].value = value;
            }
            else {
                updateComplexPropertyValues(rt[key].properties, value);
            }
        }
    }
}
function injectClassMetadata(classNode, metadata) {
    if (Object.keys(metadata).length === 0) {
        return classNode;
    }
    const metadataNode = metadataToAstNodes(metadata);
    const metadataProperty = ts.createProperty(undefined, ts.createModifiersFromModifierFlags(ts.ModifierFlags.Static), 'metadata', undefined, undefined, metadataNode);
    const members = classNode.members.concat([metadataProperty]);
    return ts.updateClassDeclaration(classNode, classNode.decorators, classNode.modifiers, classNode.name, classNode.typeParameters, classNode.heritageClauses, members);
}
function updateDtMetadata(dt, objWithJsDoc) {
    let tags = ts.getJSDocTags(objWithJsDoc);
    tags.forEach(tag => {
        if (tag.tagName.getText() === _METADATA_TAG) {
            const [mdKey, mdVal] = getDtMetadataNameValue(tag);
            let isClassMetadata = ts.isClassDeclaration(objWithJsDoc);
            if ((isClassMetadata && ['version', 'jetVersion'].indexOf(mdKey) > -1) || !dt[mdKey]) {
                dt[mdKey] = mdVal;
            }
            else {
                if (!Array.isArray(dt[mdKey])) {
                    dt[mdKey] = [dt[mdKey]];
                }
                dt[mdKey].push(mdVal);
            }
        }
    });
}
function getDtMetadataNameValue(tag) {
    const comment = tag.comment.trim();
    const mdkeySep = comment.indexOf(' ');
    let mdKey, mdVal;
    if (mdkeySep > 0) {
        mdKey = comment.substr(0, mdkeySep);
        mdVal = comment.substr(mdkeySep + 1);
        try {
            mdVal = (new Function('return ' + mdVal)());
        }
        catch (e) {
            console.log(`${_FILE_NAME}: Malformed metadata value ${mdVal} for key ${mdKey}.`);
        }
    }
    else {
        mdKey = comment;
        mdVal = true;
    }
    return [mdKey, mdVal];
}
function isClassDeclaration(symbolType) {
    var _a, _b;
    if ((_a = symbolType.symbol) === null || _a === void 0 ? void 0 : _a.valueDeclaration) {
        return ts.isClassDeclaration((_b = symbolType.symbol) === null || _b === void 0 ? void 0 : _b.valueDeclaration);
    }
    return false;
}
function getGenericTypeParameters(propsType) {
    let genericSignature = '<';
    for (let i = 0; i < propsType.typeArguments.length; i++) {
        const type = propsType.typeArguments[i];
        const typeName = type.getText();
        genericSignature += typeName;
        if (type.typeArguments && type.typeArguments.length) {
            genericSignature += getGenericTypeParameters(type);
        }
        if (i < propsType.typeArguments.length - 1) {
            genericSignature += ', ';
        }
    }
    genericSignature += '>';
    return genericSignature;
}
function pruneMetadataProperties(metadata) {
    if (metadata && metadata !== null && typeof metadata == 'object') {
        delete metadata['reftype'];
        delete metadata['optional'];
        for (let prop in metadata) {
            pruneMetadataProperties(metadata[prop]);
        }
    }
}
function checkReservedProps(propsNode, isCustomElement) {
    walkTypeNodeMembers(propsNode, (memberSymbol, memberKey) => {
        const prop = memberKey;
        if (!isCustomElement) {
            if (prop === 'class') {
                const propDeclaration = memberSymbol.valueDeclaration;
                const declarationType = propDeclaration.type;
                const symbolType = _CHECKER.getTypeAtLocation(declarationType);
                let type = _CHECKER.typeToString(symbolType);
                const kind = declarationType.kind;
                if (kind === ts.SyntaxKind.TypeReference) {
                    type = getTypeReferenceNodeSignature(declarationType, true).type;
                }
                else if (kind === ts.SyntaxKind.UnionType) {
                    type = getUnionTypeNodeSignature(declarationType).type;
                }
                if (type !== 'string|object' && type !== 'object|string') {
                    throw new Error(`${_FILE_NAME}: class property must have type string|object, not ${type}.`);
                }
            }
        }
        switch (prop) {
            case 'key':
                throw new Error(`${_FILE_NAME}: '${prop}' is a reserved property and cannot be redefined.`);
            case 'className':
                throw new Error(`${_FILE_NAME}: The 'className' property is not allowed. Define a 'class' property of type string | object instead, for style classes.`);
            case 'htmlFor':
                throw new Error(`${_FILE_NAME}: The 'htmlFor' property is not allowed. Define a 'for' property of type string instead, for the id of a labelable form-related element.`);
        }
    });
}
function storeBuildOptions(meta) {
    if (!_BUILD_OPTIONS.componentToMetadata) {
        _BUILD_OPTIONS.componentToMetadata = {};
    }
    _BUILD_OPTIONS.componentToMetadata[_VCOMP_CLASS_NAME] = JSON.parse(JSON.stringify(meta));
    let importMaps = _BUILD_OPTIONS.importMaps;
    if (!importMaps) {
        importMaps = {
            exportToAlias: {},
            aliasToExport: {},
            propsToModule: {},
            moduleToProps: {}
        };
        _BUILD_OPTIONS.importMaps = importMaps;
        _ALIAS_TO_VEXPORT;
    }
    Object.assign(importMaps.exportToAlias, _VEXPORT_TO_ALIAS);
    Object.assign(importMaps.aliasToExport, _ALIAS_TO_VEXPORT);
    Object.assign(importMaps.propsToModule, _PROPS_TO_MODULE);
    Object.assign(importMaps.moduleToProps, _MODULE_TO_PROPS);
}
function storeImport(node) {
    var _a;
    const bindings = (_a = node.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
        for (let binding of bindings.elements) {
            const namedImport = binding.name.text;
            const decrName = (binding.propertyName || binding.name).text;
            if (_VCOMPONENT_EXPORTS.has(decrName)) {
                _VEXPORT_TO_ALIAS[decrName] = binding.name.text;
                _ALIAS_TO_VEXPORT[namedImport] = decrName;
            }
            const module = trimQuotes(node.moduleSpecifier.getText());
            _IMPORT_TO_MODULE[namedImport] = module;
            if (!_MODULE_TO_IMPORT[module]) {
                _MODULE_TO_IMPORT[module] = [];
            }
            _MODULE_TO_IMPORT[module].push(namedImport);
        }
    }
}
