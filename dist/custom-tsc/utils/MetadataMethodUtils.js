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
exports.updateJetElementMethods = exports.isCustomElementMethod = exports.generateMethodMetadata = void 0;
const MetaUtils = __importStar(require("./MetadataUtils"));
const ts = __importStar(require("typescript"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const DecoratorUtils = __importStar(require("./DecoratorUtils"));
const MetaTypes = __importStar(require("./MetadataTypes"));
function generateMethodMetadata(node, metaUtilObj) {
    if (!metaUtilObj.rtMetadata.methods) {
        metaUtilObj.rtMetadata.methods = {};
    }
    const methodName = node.name.getText();
    metaUtilObj.rtMetadata.methods[methodName] = {};
    metaUtilObj.fullMetadata.methods[methodName] = getDtMetadataForMethod(node, metaUtilObj);
}
exports.generateMethodMetadata = generateMethodMetadata;
function getDtMetadataForMethod(method, metaUtilObj) {
    const dt = MetaUtils.getDtMetadata(method, metaUtilObj);
    dt.params = dt.params || [];
    const findParameter = (pname) => dt.params.find((param) => param.name === pname);
    const methodParams = [];
    if (method.parameters) {
        method.parameters.forEach((parameter) => {
            const name = parameter.name.getText();
            const typeObj = TypeUtils.getAllMetadataForDeclaration(parameter, MetaTypes.MetadataScope.DT, metaUtilObj);
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
    const returnTypeObj = TypeUtils.getAllMetadataForDeclaration(method, MetaTypes.MetadataScope.DT, metaUtilObj);
    dt.return = returnTypeObj.type;
    return dt;
}
function isCustomElementMethod(node, metaUtilObj) {
    return (ts.isMethodDeclaration(node) &&
        DecoratorUtils.getDecorator(node, metaUtilObj.namedExportToAlias.method) != null);
}
exports.isCustomElementMethod = isCustomElementMethod;
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