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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEventsMetadata = generateEventsMetadata;
exports.getDtMetadataForEvent = getDtMetadataForEvent;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TransformerError_1 = require("./TransformerError");
const ImportMaps_1 = require("../shared/ImportMaps");
const Utils_1 = require("../shared/Utils");
// NOTE:  need to differentiate between 'once' and 'onFoo'!
const _REGEX_RESERVED_EVENT_PREFIX = new RegExp(/^on[A-Z]/);
// 'details' key for singleton event payloads (i.e., primitives or
// objects whose sub-properties are "not walkable", such as arrays,
// tuples, Maps, Sets, etc.
const SINGLETON_KEY = '';
function generateEventsMetadata(memberKey, propDeclaration, metaUtilObj) {
    let isEvent = false;
    const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, propDeclaration);
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
                // Mark as cancelable, and then fall through to finish processing the event
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
    // Otherwise, if this is not an Event, check whether the property name begins with
    // the reserved 'on' prefix.
    else {
        if (memberKey.match(_REGEX_RESERVED_EVENT_PREFIX)) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_CUSTOM_EVENT_PREFIX, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, `'${memberKey}' - property names beginning with the 'on' prefix are reserved for custom element Events.`, propDeclaration);
        }
    }
    return isEvent;
}
function getDtMetadataForEvent(propDeclaration, typeNode, isCancelable, metaUtilObj) {
    const checker = metaUtilObj.typeChecker;
    const dt = MetaUtils.getDtMetadata(propDeclaration, MetaTypes.MDContext.EVENT, null, metaUtilObj);
    const typeRefNode = typeNode;
    let cancelableDetail;
    let detailObj;
    if (isCancelable) {
        cancelableDetail = {
            accept: {
                description: 'This method can be called with an application-created Promise to cancel this event asynchronously.  The Promise should be resolved or rejected to accept or cancel the event, respectively.',
                reftype: '(param: Promise<void>) => void',
                type: 'function'
            }
        };
    }
    // check now the detail object
    if (typeRefNode?.typeArguments && typeRefNode.typeArguments.length) {
        const detailNode = typeRefNode.typeArguments[0];
        const typeObject = checker.getTypeAtLocation(detailNode);
        let eventDetailName;
        let genericsInfo;
        let mappedTypesInfo;
        // We need the eventDetailName (and any generics) for generating
        // event interfaces for the custom element types in the d.ts files.
        if (ts.isTypeReferenceNode(detailNode) ||
            ts.isArrayTypeNode(detailNode) ||
            ts.isTupleTypeNode(detailNode)) {
            if (!MetaUtils.isRecordType(typeObject)) {
                mappedTypesInfo = MetaUtils.getMappedTypesInfo(typeObject, checker, false, detailNode);
            }
            // Special processing for MappedTypes?
            if (mappedTypesInfo && mappedTypesInfo.wrappedTypeNode) {
                const innerTypeObject = checker.getTypeAtLocation(mappedTypesInfo.wrappedTypeNode);
                const innerDeclaration = innerTypeObject.aliasSymbol?.getDeclarations()?.[0] ??
                    innerTypeObject.symbol?.getDeclarations()?.[0];
                if (innerDeclaration &&
                    (ts.isTypeAliasDeclaration(innerDeclaration) ||
                        ts.isInterfaceDeclaration(innerDeclaration) ||
                        ts.isClassDeclaration(innerDeclaration))) {
                    eventDetailName = innerDeclaration.name.getText();
                }
                genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(innerTypeObject, mappedTypesInfo.wrappedTypeNode, metaUtilObj);
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
                    eventDetailName = declaration.name.getText();
                    genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(typeObject, detailNode, metaUtilObj);
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
        if (MetaUtils.isWalkableObjectType(typeObject, checker)) {
            detailObj = getEventDetails(detailNode, eventDetailName, metaUtilObj);
        }
        else {
            if (isCancelable) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNSUPPORTED_CANCELABLE_ACTION_DETAIL_OBJ, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, `A CancelableAction's optional 'Detail' type parameter must extend a plain JavaScript object type - array, tuple, Map, and Set types are not supported.`, detailNode);
            }
            // In order to apply DT metadata to the singleton EventDetailItem, we allow
            // @ojmetadata tags with keys using dot notation (e.g., 'detail.description')
            // -- these would have been processed by the MetaUtils.getDtMetadata call at
            // the beginning and hosted directly on the top-level 'dt' metadata object.
            //
            // We need to transfer any of this detail MD off of the top-level metadata object,
            // and then pass it over to the utility that creates the singleton EventDetailItem
            // so that it can be properly rehosted.
            const detailMD = getTransferredDetailMD(dt);
            detailObj = getEventSingletonDetail(typeObject, eventDetailName, detailMD, metaUtilObj);
            // if non-generic, set this up for the dtsTransformer
            if (!genericsInfo) {
                dt['evnDetailNameTypeParams'] = detailObj[SINGLETON_KEY].type;
            }
        }
        if (detailObj) {
            const checkNode = mappedTypesInfo?.wrappedTypeNode ?? detailNode;
            if (ts.isTypeReferenceNode(checkNode) && TypeUtils.isLocalExport(checkNode, metaUtilObj)) {
                const typeDefName = (0, Utils_1.getTypeNameFromTypeReference)(checkNode);
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
/**
 * Returns the event detail metadata.
 * @param detailType The symbol reference to the type that defines the event details
 */
function getEventDetails(detailNode, eventDetailName, metaUtilObj) {
    let details;
    MetaUtils.walkTypeNodeMembers(detailNode, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
        const propSignature = symbol.valueDeclaration;
        // if the symbol is an interface (as opposed to a type alias), generics will be part of members
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
            // assign top level metadata
            details = details || {};
            details[property] = eventDetailMetadata;
            let nestedArrayStack = [];
            if (eventDetailMetadata.type === 'Array<object>') {
                nestedArrayStack.push(key);
            }
            // check to see if we have sub properties
            const complexMD = TypeUtils.getComplexPropertyMetadata(symbol, eventDetailMetadata, eventDetailName, MetaTypes.MDScope.DT, MetaTypes.MDContext.EVENT | MetaTypes.MDContext.EVENT_DETAIL, propertyPath, nestedArrayStack, metaUtilObj);
            // process the returned complex property metadata
            TypeUtils.processComplexPropertyMetadata(property, eventDetailMetadata, complexMD, details[property]);
        }
    });
    return details;
}
/**
 * Returns the event detail metadata for a primitive type or for an object type
 * whose sub-properties are "not walkable" (e.g., arrays, tuples, Maps, Sets, etc.)
 */
function getEventSingletonDetail(detailType, detailName, detailMD, metaUtilObj) {
    const typeObj = TypeUtils.getSignatureFromType(detailType, MetaTypes.MDContext.EVENT | MetaTypes.MDContext.EVENT_DETAIL, MetaTypes.MDScope.DT, false, null, metaUtilObj);
    let detail = {};
    detail[SINGLETON_KEY] = {
        type: typeObj.type
    };
    if (typeObj.enumValues) {
        detail[SINGLETON_KEY].enumValues = [...typeObj.enumValues];
    }
    // apply any transferred DT metadata to the singleton EventDetailItem
    Object.assign(detail[SINGLETON_KEY], detailMD);
    let nestedArrayStack = [];
    if (typeObj.type === 'Array<object>') {
        nestedArrayStack.push(SINGLETON_KEY);
    }
    // check to see if we have sub properties
    const complexMD = TypeUtils.getComplexPropertyMetadataForType(detailType, typeObj, detailName, MetaTypes.MDScope.DT, MetaTypes.MDContext.EVENT | MetaTypes.MDContext.EVENT_DETAIL, [SINGLETON_KEY], nestedArrayStack, metaUtilObj);
    // process the returned complex property metadata
    TypeUtils.processComplexPropertyMetadata(SINGLETON_KEY, typeObj, complexMD, detail[SINGLETON_KEY]);
    return detail;
}
/**
 * Loops over the keys of a top-level Event DT metadata object, looking for dot notation keys
 * targeting a singleton EventDetailItem. It transfers these items off of the top-level metadata
 * object onto a new return object, stripping the 'detail.' prefix from the key in the process.
 *
 * @param eventDT The top-level Event DT metadata object
 * @returns MD object with the metadata items that have been transferred from the top-level object
 */
function getTransferredDetailMD(eventDT) {
    const transferredMD = {};
    const topLevelKeys = Object.keys(eventDT);
    for (const key of topLevelKeys) {
        if (key.startsWith('detail.')) {
            const transferKey = key.substring(key.lastIndexOf('.') + 1);
            if (transferKey) {
                transferredMD[transferKey] = eventDT[key];
                eventDT[key] = undefined;
            }
        }
    }
    return transferredMD;
}
//# sourceMappingURL=MetadataEventUtils.js.map