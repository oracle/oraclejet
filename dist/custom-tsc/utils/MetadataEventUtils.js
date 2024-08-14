"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDtMetadataForEvent = exports.generateEventsMetadata = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TransformerError_1 = require("./TransformerError");
const _REGEX_RESERVED_EVENT_PREFIX = new RegExp(/^on[A-Z]/);
function generateEventsMetadata(memberKey, propDeclaration, metaUtilObj) {
    let isEvent = false;
    const exportToAlias = metaUtilObj.progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, propDeclaration);
    const types = TypeUtils.getPropertyTypes(propDeclaration);
    const typeNames = Object.keys(types);
    const rtEventMeta = {};
    let eventTypeName;
    let eventTypeNode;
    for (let i = 0; i < typeNames.length; i++) {
        let typeName = typeNames[i];
        switch (typeName) {
            case `${exportToAlias.Bubbles}`:
                rtEventMeta.bubbles = true;
                break;
            case `${exportToAlias.CancelableAction}`:
                rtEventMeta.cancelable = true;
            case `${exportToAlias.Action}`:
                isEvent = true;
                eventTypeName = typeName;
                eventTypeNode = types[typeName];
                break;
        }
    }
    if (isEvent) {
        if (!memberKey.startsWith('on')) {
            const suggestion = `on${memberKey[0].toUpperCase()}${memberKey.substring(1)}`;
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_CUSTOM_EVENT_PROPNAME, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'${memberKey}' is not a valid property name for defining a custom Event. Did you mean '${suggestion}'?`, propDeclaration);
        }
        const eventProp = `${memberKey[2].toLowerCase()}${memberKey.substring(3)}`;
        if (!metaUtilObj.rtMetadata.events) {
            metaUtilObj.rtMetadata.events = {};
            metaUtilObj.fullMetadata.events = {};
        }
        metaUtilObj.rtMetadata.events[eventProp] = rtEventMeta;
        metaUtilObj.fullMetadata.events[eventProp] = Object.assign({}, rtEventMeta, getDtMetadataForEvent(propDeclaration, eventTypeNode, rtEventMeta.cancelable ?? false, metaUtilObj));
    }
    else {
        if (memberKey.match(_REGEX_RESERVED_EVENT_PREFIX)) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_CUSTOM_EVENT_PREFIX, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, `'${memberKey}' - property names beginning with the 'on' prefix are reserved for custom element Events.`, propDeclaration);
        }
    }
    return isEvent;
}
exports.generateEventsMetadata = generateEventsMetadata;
function getDtMetadataForEvent(propDeclaration, typeNode, isCancelable, metaUtilObj) {
    const checker = metaUtilObj.typeChecker;
    const dt = MetaUtils.getDtMetadata(propDeclaration, MetaTypes.MDContext.EVENT, null, metaUtilObj);
    const typeRefNode = typeNode;
    let cancelableDetail = null;
    let detailObj = null;
    if (isCancelable) {
        cancelableDetail = {
            accept: {
                description: 'This method can be called with an application-created Promise to cancel this event asynchronously.  The Promise should be resolved or rejected to accept or cancel the event, respectively.',
                reftype: '(param: Promise<void>) => void',
                type: 'function'
            }
        };
    }
    if (typeRefNode?.typeArguments && typeRefNode.typeArguments.length) {
        const detailNode = typeRefNode.typeArguments[0];
        if (ts.isTypeReferenceNode(detailNode)) {
            const typeObject = checker.getTypeAtLocation(detailNode);
            const mappedTypesInfo = MetaUtils.getMappedTypesInfo(typeObject, checker, false, detailNode);
            if (mappedTypesInfo && mappedTypesInfo.wrappedTypeNode) {
                const innerTypeObject = checker.getTypeAtLocation(mappedTypesInfo.wrappedTypeNode);
                const genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(innerTypeObject, mappedTypesInfo.wrappedTypeNode, metaUtilObj);
                if (genericsInfo) {
                    dt['evnDetailTypeParamsDeclaration'] = genericsInfo.genericsDeclaration;
                    dt['evnDetailTypeParams'] = genericsInfo.resolvedGenericParams;
                }
                dt['evnDetailNameTypeParams'] = MetaUtils.constructMappedTypeName(mappedTypesInfo, genericsInfo?.genericsTypeParams);
            }
            else {
                const declaration = typeObject.aliasSymbol?.getDeclarations()?.[0] ??
                    typeObject.symbol?.getDeclarations()?.[0];
                if (declaration &&
                    (ts.isTypeAliasDeclaration(declaration) ||
                        ts.isInterfaceDeclaration(declaration) ||
                        ts.isClassDeclaration(declaration))) {
                    const eventDetailName = declaration.name.getText();
                    const genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(typeObject, detailNode, metaUtilObj);
                    if (genericsInfo) {
                        dt['evnDetailTypeParamsDeclaration'] = genericsInfo.genericsDeclaration;
                        dt['evnDetailTypeParams'] = genericsInfo.resolvedGenericParams;
                        dt['evnDetailNameTypeParams'] = `${eventDetailName}${genericsInfo.genericsTypeParams}`;
                    }
                    else {
                        dt['evnDetailNameTypeParams'] = eventDetailName;
                    }
                }
            }
        }
        detailObj = getEventDetails(detailNode, metaUtilObj);
        if (detailObj) {
            if (ts.isTypeReferenceNode(detailNode) && TypeUtils.isLocalExport(detailNode, metaUtilObj)) {
                const typeDefName = TypeUtils.getTypeNameFromTypeReference(detailNode);
                dt['jsdoc'] = dt['jsdoc'] || {};
                dt['jsdoc']['typedef'] = typeDefName;
            }
        }
    }
    if (detailObj || cancelableDetail) {
        dt['detail'] = Object.assign({}, cancelableDetail, detailObj);
    }
    return dt;
}
exports.getDtMetadataForEvent = getDtMetadataForEvent;
function getEventDetails(detailNode, metaUtilObj) {
    let details;
    if (detailNode?.kind !== ts.SyntaxKind.NullKeyword) {
        let detailName;
        if (ts.isTypeReferenceNode(detailNode)) {
            detailName = TypeUtils.getTypeNameFromTypeReference(detailNode);
        }
        MetaUtils.walkTypeNodeMembers(detailNode, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
            const propSignature = symbol.valueDeclaration;
            if (!propSignature) {
                return;
            }
            const symbolType = metaUtilObj.typeChecker.getTypeOfSymbolAtLocation(symbol, propSignature);
            if (ts.isPropertySignature(propSignature) || ts.isPropertyDeclaration(propSignature)) {
                const property = key.toString();
                const propertyPath = [property];
                const eventDetailMetadata = TypeUtils.getAllMetadataForDeclaration(propSignature, MetaTypes.MDScope.DT, MetaTypes.MDContext.EVENT | MetaTypes.MDContext.EVENT_DETAIL, propertyPath, symbol, metaUtilObj);
                const propSym = mappedTypeSymbol ?? symbol;
                eventDetailMetadata['optional'] = propSym.flags & ts.SymbolFlags.Optional ? true : false;
                details = details || {};
                details[property] = eventDetailMetadata;
                let nestedArrayStack = [];
                if (eventDetailMetadata.type === 'Array<object>') {
                    nestedArrayStack.push(key);
                }
                const subprops = TypeUtils.getComplexPropertyMetadata(symbol, eventDetailMetadata.type, detailName, MetaTypes.MDScope.DT, MetaTypes.MDContext.EVENT | MetaTypes.MDContext.EVENT_DETAIL, propertyPath, nestedArrayStack, metaUtilObj);
                if (subprops) {
                    if (subprops.circRefDetected) {
                        details[property].type =
                            TypeUtils.getSubstituteTypeForCircularReference(eventDetailMetadata);
                    }
                    else if (eventDetailMetadata.type === 'Array<object>') {
                        details[property].extension = {};
                        details[property].extension.vbdt = {};
                        details[property].extension.vbdt.itemProperties = subprops;
                    }
                    else {
                        details[property].type = 'object';
                        details[property].properties = subprops;
                    }
                    const typeDef = TypeUtils.getPossibleTypeDef(property, symbol, eventDetailMetadata, metaUtilObj);
                    if (typeDef && (typeDef.name || typeDef.coreJetModule)) {
                        details[property]['jsdoc'] = details[property]['jsdoc'] || {};
                        details[property]['jsdoc']['typedef'] = typeDef;
                    }
                }
            }
        });
    }
    return details;
}
//# sourceMappingURL=MetadataEventUtils.js.map