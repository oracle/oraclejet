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
    metaUtilObj.fullMetadata.methods[methodName] = getDtMetadataForClassMethod(node, metaUtilObj);
}
exports.generateClassMethodMetadata = generateClassMethodMetadata;
function getDtMetadataForClassMethod(method, metaUtilObj) {
    const dt = MetaUtils.getDtMetadata(method, MetaTypes.MDFlags.METHOD, null, metaUtilObj);
    if (dt.internalName) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_OJMETADATA_INTERNALNAME, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'@ojmetadata internalName' annotations are ignored, and should be removed.`, method);
        delete dt.internalName;
    }
    dt.params = dt.params || [];
    const findParameter = (pname) => dt.params.find((param) => param.name === pname);
    const methodParams = [];
    if (method.parameters) {
        method.parameters.forEach((parameter) => {
            const name = parameter.name.getText();
            const typeObj = TypeUtils.getAllMetadataForDeclaration(parameter, MetaTypes.MetadataScope.DT, MetaTypes.MDFlags.METHOD | MetaTypes.MDFlags.METHOD_PARAM, null, null, metaUtilObj);
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
    const returnTypeObj = TypeUtils.getAllMetadataForDeclaration(method, MetaTypes.MetadataScope.DT, MetaTypes.MDFlags.METHOD | MetaTypes.MDFlags.METHOD_RETURN, null, null, metaUtilObj);
    dt.return = returnTypeObj.type;
    return dt;
}
function isCustomElementClassMethod(node, metaUtilObj) {
    return (ts.isMethodDeclaration(node) &&
        DecoratorUtils.getDecorator(node, metaUtilObj.namedExportToAlias.method) != null);
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
            rtMethods[methodName] = {};
            dtMethods[methodName] = {};
            const rtMethod = rtMethods[methodName];
            const dtMethod = dtMethods[methodName];
            const regMethodMD = regMetadata === null || regMetadata === void 0 ? void 0 : regMetadata[methodName];
            if (regMethodMD) {
                for (const regKey in regMethodMD) {
                    switch (regKey) {
                        case 'params':
                            break;
                        case 'extension':
                            dtMethod.extension = Object.assign({}, regMethodMD.extension);
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
            const findRegMethodParam = (pname) => { var _a; return (_a = regMethodMD === null || regMethodMD === void 0 ? void 0 : regMethodMD.params) === null || _a === void 0 ? void 0 : _a.find((param) => param.name === pname); };
            const funcNode = signatureDecl.type;
            const dtParams = funcNode.parameters.map((param) => {
                const name = param.name.getText();
                const typeObj = TypeUtils.getAllMetadataForDeclaration(param, MetaTypes.MetadataScope.DT, MetaTypes.MDFlags.METHOD | MetaTypes.MDFlags.METHOD_PARAM, null, null, metaUtilObj);
                let dtParamObj = { name, type: typeObj.type };
                const regParamObj = findRegMethodParam(name);
                if (regParamObj) {
                    dtParamObj = Object.assign(Object.assign({}, dtParamObj), regParamObj);
                }
                return dtParamObj;
            });
            if (dtParams.length > 0) {
                dtMethod.params = dtParams;
            }
            const returnTypeObj = TypeUtils.getAllMetadataForDeclaration(funcNode, MetaTypes.MetadataScope.DT, MetaTypes.MDFlags.METHOD | MetaTypes.MDFlags.METHOD_RETURN, null, null, metaUtilObj);
            dtMethod.return = returnTypeObj.type;
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
//# sourceMappingURL=MetadataMethodUtils.js.map