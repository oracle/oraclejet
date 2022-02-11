"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
function generateEventsMetadata(memberKey, propDeclaration, metaUtilObj) {
    let types = TypeUtils.getPropertyTypes(propDeclaration);
    let typeNames = Object.keys(types);
    if (typeNames.length === 0) {
        return false;
    }
    const rtEventMeta = {};
    let isEvent = false;
    let eventTypeName, eventTypeNode;
    for (let i = 0; i < typeNames.length; i++) {
        let typeName = typeNames[i];
        switch (typeName) {
            case `${metaUtilObj.namedExportToAlias.Bubbles}`:
                rtEventMeta.bubbles = true;
                break;
            case `${metaUtilObj.namedExportToAlias.CancelableAction}`:
                rtEventMeta.cancelable = true;
            case `${metaUtilObj.namedExportToAlias.Action}`:
                isEvent = true;
                eventTypeName = typeName;
                eventTypeNode = types[typeName];
                break;
        }
    }
    if (isEvent) {
        const eventProp = `${memberKey[2].toLowerCase()}${memberKey.substring(3)}`;
        if (!metaUtilObj.rtMetadata.events) {
            metaUtilObj.rtMetadata.events = {};
            metaUtilObj.fullMetadata.events = {};
        }
        metaUtilObj.rtMetadata.events[eventProp] = rtEventMeta;
        metaUtilObj.fullMetadata.events[eventProp] = Object.assign({}, rtEventMeta, getDtMetadataForEvent(propDeclaration, eventTypeName, eventTypeNode, metaUtilObj));
    }
    return isEvent;
}
exports.generateEventsMetadata = generateEventsMetadata;
function getDtMetadataForEvent(propDeclaration, typeName, typeNode, metaUtilObj) {
    var _a, _b;
    const checker = metaUtilObj.typeChecker;
    const dt = MetaUtils.getDtMetadata(propDeclaration, metaUtilObj);
    const typeRefNode = typeNode;
    let cancelableDetail = null;
    let detailObj = null;
    if (typeName === `${metaUtilObj.namedExportToAlias.CancelableAction}`) {
        cancelableDetail = {
            accept: {
                description: 'This method can be called with an application-created Promise to cancel this event asynchronously.  The Promise should be resolved or rejected to accept or cancel the event, respectively.',
                reftype: '(param: Promise<void>) => void',
                type: 'function'
            }
        };
    }
    if ((typeRefNode === null || typeRefNode === void 0 ? void 0 : typeRefNode.typeArguments) && typeRefNode.typeArguments.length) {
        const detailNode = typeRefNode.typeArguments[0];
        if (detailNode.kind == ts.SyntaxKind.TypeReference) {
            const typeObject = checker.getTypeAtLocation(detailNode);
            const mappedTypesInfo = MetaUtils.getMappedTypesInfo(typeObject, checker, false, detailNode);
            if (mappedTypesInfo && mappedTypesInfo.wrappedTypeNode) {
                const innerTypeObject = checker.getTypeAtLocation(mappedTypesInfo.wrappedTypeNode);
                const genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(innerTypeObject, metaUtilObj);
                if (genericsInfo) {
                    dt['evnDetailTypeParamsDeclaration'] = genericsInfo.genericsDeclaration;
                    dt['evnDetailNameTypeParams'] = MetaUtils.constructMappedTypeName(mappedTypesInfo, genericsInfo.genericsTypeParams);
                }
            }
            else {
                const declaration = ((_a = typeObject.aliasSymbol) === null || _a === void 0 ? void 0 : _a.getDeclarations()[0]) || ((_b = typeObject.symbol) === null || _b === void 0 ? void 0 : _b.getDeclarations()[0]);
                if (ts.isTypeAliasDeclaration(declaration) || ts.isClassDeclaration(declaration)) {
                    const eventDetailType = declaration;
                    const eventDetailName = eventDetailType.name.getText();
                    const genericsInfo = TypeUtils.getGenericsAndTypeParametersFromType(typeObject, metaUtilObj);
                    if (genericsInfo) {
                        dt['evnDetailTypeParamsDeclaration'] = genericsInfo.genericsDeclaration;
                        dt['evnDetailNameTypeParams'] = `${eventDetailName}${genericsInfo.genericsTypeParams}`;
                    }
                    else {
                        dt['evnDetailNameTypeParams'] = eventDetailName;
                    }
                }
            }
        }
        detailObj = getEventDetails(detailNode, metaUtilObj);
    }
    if (detailObj || cancelableDetail) {
        dt['detail'] = Object.assign({}, cancelableDetail, detailObj);
    }
    return dt;
}
exports.getDtMetadataForEvent = getDtMetadataForEvent;
function getEventDetails(detailNode, metaUtilObj) {
    let details;
    if ((detailNode === null || detailNode === void 0 ? void 0 : detailNode.kind) !== ts.SyntaxKind.NullKeyword) {
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
                const eventDetailMetadata = TypeUtils.getAllMetadataForDeclaration(propSignature, MetaTypes.MetadataScope.DT, metaUtilObj, MetaTypes.GETMD_FLAGS_NONE, symbol);
                details = details || {};
                details[property] = eventDetailMetadata;
                if (TypeUtils.possibleComplexProperty(symbolType, eventDetailMetadata.type, MetaTypes.MetadataScope.DT)) {
                    let stack = [];
                    if (eventDetailMetadata.type === 'Array<object>') {
                        stack.push(key);
                    }
                    const subprops = TypeUtils.getComplexPropertyMetadata(symbol, eventDetailMetadata.type, detailName, MetaTypes.MetadataScope.DT, stack, metaUtilObj);
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
                    }
                }
            }
        });
    }
    return details;
}
//# sourceMappingURL=MetadataEventUtils.js.map