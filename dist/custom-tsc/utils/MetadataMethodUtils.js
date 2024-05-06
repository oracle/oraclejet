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
exports.updateJetElementMethods = exports.processRegisteredMethodsInfo = exports.isCustomElementClassMethod = exports.generateClassMethodMetadata = void 0;
const MetaUtils = __importStar(require("./MetadataUtils"));
const ts = __importStar(require("typescript"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const DecoratorUtils = __importStar(require("./DecoratorUtils"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TransformerError_1 = require("./TransformerError");
function generateClassMethodMetadata(node, metaUtilObj) {
    if (!metaUtilObj.rtMetadata.methods) {
        metaUtilObj.rtMetadata.methods = {};
    }
    const methodName = node.name.getText();
    metaUtilObj.rtMetadata.methods[methodName] = {};
    const dtMetadata = MetaUtils.getDtMetadata(node, MetaTypes.MDContext.METHOD, null, metaUtilObj);
    metaUtilObj.fullMetadata.methods[methodName] = getMethodDtMetadata(node, dtMetadata, metaUtilObj);
}
exports.generateClassMethodMetadata = generateClassMethodMetadata;
function isCustomElementClassMethod(node, metaUtilObj) {
    if (!ts.isMethodDeclaration(node)) {
        return false;
    }
    const exportToAlias = metaUtilObj.progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, node);
    return DecoratorUtils.getDecorator(node, exportToAlias.method) != null;
}
exports.isCustomElementClassMethod = isCustomElementClassMethod;
function processRegisteredMethodsInfo(methodsInfo, metaUtilObj) {
    const rtMethods = {};
    const dtMethods = {};
    const dtsMethodSignatures = {};
    const regMetadata = methodsInfo.metadata;
    MetaUtils.walkTypeNodeMembers(methodsInfo.signaturesTypeNode, metaUtilObj, (signatureSymbol, signatureKey, mappedSymbol) => {
        const signatureDecl = signatureSymbol.valueDeclaration;
        if (signatureDecl &&
            ts.isPropertySignature(signatureDecl) &&
            signatureDecl.type &&
            ts.isFunctionTypeNode(signatureDecl.type)) {
            const methodName = signatureKey;
            const funcNode = signatureDecl.type;
            rtMethods[methodName] = {};
            let dtMethod = MetaUtils.getDtMetadata(signatureDecl, MetaTypes.MDContext.METHOD, null, metaUtilObj);
            if (Object.keys(dtMethod).length === 0) {
                const regMethodMD = regMetadata?.[methodName];
                if (regMethodMD) {
                    for (const regKey in regMethodMD) {
                        switch (regKey) {
                            case 'params':
                                dtMethod.params = regMethodMD.params.map((param) => {
                                    param.type = 'any';
                                    return param;
                                });
                                break;
                            case 'extension':
                                dtMethod.extension = { ...regMethodMD.extension };
                                break;
                            case 'status':
                                dtMethod.status = [...regMethodMD.status];
                                break;
                            case 'apidocDescription':
                                dtMethod['jsdoc'] = dtMethod['jsdoc'] || {};
                                dtMethod['jsdoc']['description'] = regMethodMD.apidocDescription;
                                break;
                            case 'apidocRtnDescription':
                                dtMethod['jsdoc'] = dtMethod['jsdoc'] || {};
                                dtMethod['jsdoc']['returns'] = regMethodMD.apidocRtnDescription;
                                break;
                            case 'internalName':
                                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_INTERNALNAME_METADATA, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'internalName' method metadata is ignored, and should be removed.`, methodsInfo.metadataNode);
                                break;
                            default:
                                dtMethod[regKey] = regMethodMD[regKey];
                                break;
                        }
                    }
                }
            }
            dtMethods[methodName] = getMethodDtMetadata(funcNode, dtMethod, metaUtilObj);
            const signatureType = metaUtilObj.typeChecker.getTypeAtLocation(funcNode);
            dtsMethodSignatures[methodName] = metaUtilObj.typeChecker.typeToString(signatureType);
        }
        else {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_IMPERATIVE_HANDLE_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `UNEXPECTED - Invalid imperative handle type argument to 'registerCustomElement' call!`, methodsInfo.signaturesTypeNode);
        }
    });
    if (Object.keys(rtMethods).length > 0) {
        metaUtilObj.rtMetadata.methods = rtMethods;
        metaUtilObj.fullMetadata.methods = dtMethods;
        metaUtilObj.fullMetadata['funcVCompMethodSignatures'] = dtsMethodSignatures;
    }
}
exports.processRegisteredMethodsInfo = processRegisteredMethodsInfo;
function updateJetElementMethods(metaObjUtils) {
    metaObjUtils.fullMetadata.methods = Object.assign(metaObjUtils.fullMetadata.methods || {}, _ELEMENT_METHODS);
}
exports.updateJetElementMethods = updateJetElementMethods;
const _ELEMENT_METHODS = {
    setProperty: {
        description: 'Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.',
        help: '#setProperty',
        params: [
            {
                name: 'property',
                description: 'The property name to set. Supports dot notation for subproperty access.',
                type: 'string'
            },
            {
                name: 'value',
                description: 'The new value to set the property to.',
                type: 'any'
            }
        ],
        return: 'void'
    },
    getProperty: {
        description: 'Retrieves the value of a property or a subproperty.',
        help: '#getProperty',
        params: [
            {
                name: 'property',
                description: 'The property name to get. Supports dot notation for subproperty access.',
                type: 'string'
            }
        ],
        return: 'any'
    },
    setProperties: {
        description: 'Performs a batch set of properties.',
        help: '#setProperties',
        params: [
            {
                name: 'properties',
                description: 'An object containing the property and value pairs to set.',
                type: 'object'
            }
        ],
        return: 'void'
    }
};
function getMethodDtMetadata(methodNode, dtMD, metaUtilObj) {
    let dtMethod = { ...dtMD };
    if (dtMethod.internalName) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_OJMETADATA_INTERNALNAME, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'@ojmetadata internalName' annotations are ignored, and should be removed.`, methodNode);
        delete dtMethod.internalName;
    }
    const paramsDtMD = dtMethod.params;
    const paramsJsdocMD = dtMethod['jsdoc']?.['params'];
    const findMethodParamMD = (pname) => paramsDtMD?.find((param) => param.name === pname) ??
        paramsJsdocMD?.find((param) => param.name === pname);
    const dtParams = methodNode.parameters.map((param) => {
        const name = param.name.getText();
        const typeObj = TypeUtils.getAllMetadataForDeclaration(param, MetaTypes.MDScope.DT, MetaTypes.MDContext.METHOD | MetaTypes.MDContext.METHOD_PARAM, null, null, metaUtilObj);
        let paramObj = { name, type: typeObj.type };
        const paramMDObj = findMethodParamMD(name);
        if (paramMDObj) {
            paramObj = { ...paramMDObj, ...paramObj };
        }
        return paramObj;
    });
    if (dtParams.length > 0) {
        dtMethod.params = dtParams;
    }
    else {
        delete dtMethod.params;
    }
    const returnTypeObj = TypeUtils.getAllMetadataForDeclaration(methodNode, MetaTypes.MDScope.DT, MetaTypes.MDContext.METHOD | MetaTypes.MDContext.METHOD_RETURN, null, null, metaUtilObj);
    dtMethod.return = returnTypeObj.type;
    return dtMethod;
}
//# sourceMappingURL=MetadataMethodUtils.js.map