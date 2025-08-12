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
exports.generateClassMethodMetadata = generateClassMethodMetadata;
exports.isCustomElementClassMethod = isCustomElementClassMethod;
exports.processRegisteredMethodsInfo = processRegisteredMethodsInfo;
exports.updateJetElementMethods = updateJetElementMethods;
const MetaUtils = __importStar(require("./MetadataUtils"));
const ts = __importStar(require("typescript"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TransformerError_1 = require("./TransformerError");
const DecoratorUtils_1 = require("../shared/DecoratorUtils");
const ImportMaps_1 = require("../shared/ImportMaps");
function generateClassMethodMetadata(node, metaUtilObj) {
    if (!metaUtilObj.rtMetadata.methods) {
        metaUtilObj.rtMetadata.methods = {};
    }
    const methodName = node.name.getText();
    metaUtilObj.rtMetadata.methods[methodName] = {};
    const dtMetadata = MetaUtils.getDtMetadata(node, MetaTypes.MDContext.METHOD, null, metaUtilObj);
    metaUtilObj.fullMetadata.methods[methodName] = getMethodDtMetadata(node, dtMetadata, metaUtilObj);
}
function isCustomElementClassMethod(node, metaUtilObj) {
    if (!ts.isMethodDeclaration(node)) {
        return false;
    }
    const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, node);
    return (0, DecoratorUtils_1.getDecorator)(node, exportToAlias.method) != null;
}
function processRegisteredMethodsInfo(methodsInfo, metaUtilObj) {
    const rtMethods = {};
    const dtMethods = {};
    const dtsMethodSignatures = {};
    const regMetadata = methodsInfo.metadata;
    // Process the members of the signaturesTypeNode to get the
    // core pieces of both the RT and DT method metadata, augmenting it
    // with any additional (optional) DT metadata.
    //    - signatureKey
    //        ==> method name
    //    - signatureSymbol.valueDeclaration
    //        ==> PropertyDeclaration.type should be a FunctionTypeNode
    //            representing the method signature, providing parameter
    //            names and types, plus the return type
    MetaUtils.walkTypeNodeMembers(methodsInfo.signaturesTypeNode, metaUtilObj, (signatureSymbol, signatureKey, mappedSymbol) => {
        const signatureDecl = signatureSymbol.valueDeclaration;
        // Is the property value a function type?
        if (signatureDecl &&
            ts.isPropertySignature(signatureDecl) &&
            signatureDecl.type &&
            ts.isFunctionTypeNode(signatureDecl.type)) {
            const methodName = signatureKey;
            const funcNode = signatureDecl.type;
            rtMethods[methodName] = {};
            let dtMethod = MetaUtils.getDtMetadata(signatureDecl, MetaTypes.MDContext.METHOD, null, metaUtilObj);
            // If there is no doclet-generated DT metadata available for the current method,
            // look for deprecated 'methods' metadata passed via the 'options' argument at
            // registration time as our source for DT metadata
            if (Object.keys(dtMethod).length === 0) {
                const regMethodMD = regMetadata?.[methodName];
                // If optional metadata for the current method was provided at registration time,
                // convert it into DT metadata as appropriate
                if (regMethodMD) {
                    for (const regKey in regMethodMD) {
                        switch (regKey) {
                            case 'params':
                                // NOTE: We won't be using the 'type' information from the DT metadata anyway...
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
                                // If an internalName metadata property was specified, log a warning
                                // to the console that internalNames are not supported on VComponents
                                // and ignore it!
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
            // Finally, get the signature string for the dtsTransformer
            const signatureType = metaUtilObj.typeChecker.getTypeAtLocation(funcNode);
            dtsMethodSignatures[methodName] = metaUtilObj.typeChecker.typeToString(signatureType);
        }
        // Otherwise, if the property value was NOT a function type, throw an error
        // indicating that the generic type argument tying the imperative method signatures
        // to the functional VCompnent's method metadata is invalid
        // NOTE:  We should never get here, as tsc should catch this before it gets to us!
        //        (see golden/test-errors/test-es6-errors.log)
        else {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_IMPERATIVE_HANDLE_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `UNEXPECTED - Invalid imperative handle type argument to 'registerCustomElement' call!`, methodsInfo.signaturesTypeNode);
        }
    });
    // Were any methods processed?
    if (Object.keys(rtMethods).length > 0) {
        // Return the functional VComponent's method metadata and method signatures
        metaUtilObj.rtMetadata.methods = rtMethods;
        metaUtilObj.fullMetadata.methods = dtMethods;
        metaUtilObj.fullMetadata['funcVCompMethodSignatures'] = dtsMethodSignatures;
    }
}
/**
 * Returns a copy of the shared element methods for all JET custom elements
 */
function updateJetElementMethods(metaObjUtils) {
    metaObjUtils.fullMetadata.methods = Object.assign(metaObjUtils.fullMetadata.methods || {}, _ELEMENT_METHODS);
}
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
// Private functions
function getMethodDtMetadata(methodNode, dtMD, metaUtilObj) {
    let dtMethod = { ...dtMD };
    // If an internalName metadata property was specified, log a warning to the console
    // that internalNames are not supported on VComponents and delete it!
    if (dtMethod.internalName) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_OJMETADATA_INTERNALNAME, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'@ojmetadata internalName' annotations are ignored, and should be removed.`, methodNode);
        delete dtMethod.internalName;
    }
    // We have two potential sources for method parameter metadata:
    //
    //  - DT metadata
    //  - standard JSDoc (i.e., @param tags - descriptions only, used as a fallback)
    //
    const paramsDtMD = dtMethod.params;
    const paramsJsdocMD = dtMethod['jsdoc']?.['params'];
    // Given a parameter name, searches our two potential sources for the corresponding
    // method parameter metadata, preferring more complete DT metadata over JSDoc metadata.
    const findMethodParamMD = (pname) => paramsDtMD?.find((param) => param.name === pname) ??
        paramsJsdocMD?.find((param) => param.name === pname);
    // Map the actual parameters from the method node itself to the "complete"
    // parameter metadata DT objects (including type) from our sources
    // -- the type of the actual parameter "wins"
    const dtParams = methodNode.parameters.map((param) => {
        const name = param.name.getText();
        // for function parameters, get the symbol of the parameter
        let declSymbol = null;
        if (ts.isParameter(param)) {
            declSymbol = metaUtilObj.typeChecker.getSymbolAtLocation(param.name);
        }
        const typeObj = TypeUtils.getAllMetadataForDeclaration(param, MetaTypes.MDScope.DT, MetaTypes.MDContext.METHOD | MetaTypes.MDContext.METHOD_PARAM, null, declSymbol, metaUtilObj);
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
    // Get the return type from the method node
    const returnTypeObj = TypeUtils.getAllMetadataForDeclaration(methodNode, MetaTypes.MDScope.DT, MetaTypes.MDContext.METHOD | MetaTypes.MDContext.METHOD_RETURN, null, null, metaUtilObj);
    dtMethod.return = returnTypeObj.type;
    return dtMethod;
}
//# sourceMappingURL=MetadataMethodUtils.js.map