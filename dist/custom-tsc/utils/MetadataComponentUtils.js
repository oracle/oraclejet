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
exports.isVCompBaseClassFound = exports.getDtMetadataForComponent = exports.getVCompFunctionInfo = exports.getVCompClassInfo = void 0;
const ts = __importStar(require("typescript"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const TransformerError_1 = require("./TransformerError");
function getVCompClassInfo(elementName, classNode, vexportToAlias, checker, compilerOptions, translationBundleIds) {
    var _a, _b;
    let rtnInfo = null;
    let className = classNode.name.getText();
    let translationBundleInfo;
    let heritageClauses = classNode.heritageClauses;
    for (let clause of heritageClauses) {
        for (let typeNode of clause.types) {
            if (isVCompBaseClassFound(typeNode, vexportToAlias, checker)) {
                if (((_a = typeNode.typeArguments) === null || _a === void 0 ? void 0 : _a[0]) && ts.isTypeReferenceNode((_b = typeNode.typeArguments) === null || _b === void 0 ? void 0 : _b[0])) {
                    let propsTypeNode = typeNode.typeArguments[0];
                    rtnInfo = {
                        elementName,
                        className,
                        classNode,
                        propsInfo: MetaUtils.getPropsInfo(MetaTypes.VCompType.CLASS, className, propsTypeNode, vexportToAlias, checker)
                    };
                    if (!rtnInfo.propsInfo &&
                        TypeUtils.getTypeNameFromTypeReference(propsTypeNode) !== vexportToAlias.GlobalProps) {
                        throw new TransformerError_1.TransformerError(className, 'All custom elements at a minimum support global properties. Properties should use the ExtendGlobalProps utility type, e.g. Component<ExtendGlobalProps<Props>>.', propsTypeNode);
                    }
                    break;
                }
                else {
                    throw new TransformerError_1.TransformerError(className, 'All custom elements at a minimum support global properties and should pass in GlobalProps for the property type, e.g. Component<GlobalProps>.', typeNode);
                }
            }
        }
    }
    if (rtnInfo && translationBundleIds) {
        translationBundleInfo = getTranslationBundleInfo(translationBundleIds, compilerOptions);
        rtnInfo.additionalImports = translationBundleInfo.additionalImports;
        rtnInfo.translationBundleMapExpression = translationBundleInfo.bundleMapExpression;
    }
    return rtnInfo;
}
exports.getVCompClassInfo = getVCompClassInfo;
function getVCompFunctionInfo(functionalCompNode, vexportToAlias, checker, compilerOptions, translationBundleIds) {
    var _a, _b;
    let rtnInfo = null;
    let propsInfo = null;
    let isTypeDefintionAdjustmentRequired = false;
    let callExpression;
    let compRegisterCall;
    let varDecl;
    let elementName;
    let componentName;
    let componentNode;
    let functionName;
    let defaultProps;
    let propsTypeNode;
    let propBindings;
    let translationBundleInfo;
    const findFunctionalComp = function (expression) {
        var _a, _b, _c, _d;
        if (ts.isFunctionExpression(expression) || ts.isArrowFunction(expression)) {
            componentNode = expression;
            const propsParam = expression.parameters[0];
            if (propsParam) {
                if (propsParam.type && ts.isTypeReferenceNode(propsParam.type)) {
                    propsTypeNode = propsParam.type;
                    propsInfo = MetaUtils.getPropsInfo(MetaTypes.VCompType.FUNCTION, (_a = componentName !== null && componentName !== void 0 ? componentName : functionName) !== null && _a !== void 0 ? _a : elementName, propsTypeNode, vexportToAlias, checker);
                    if (ts.isObjectBindingPattern(propsParam.name)) {
                        defaultProps = propsParam.name.elements;
                    }
                }
            }
        }
        else if (ts.isIdentifier(expression)) {
            let functionalCompDecl;
            functionName = ts.idText(expression);
            const functionalCompSymbol = checker.getSymbolAtLocation(expression);
            if (functionalCompSymbol) {
                for (const symDecl of functionalCompSymbol.declarations) {
                    if (ts.isFunctionDeclaration(symDecl)) {
                        functionalCompDecl = symDecl;
                        componentNode = functionalCompDecl;
                        const propsParam = functionalCompDecl.parameters[0];
                        if (propsParam && ts.isObjectBindingPattern(propsParam.name)) {
                            defaultProps = propsParam.name.elements;
                            break;
                        }
                    }
                    else if (ts.isVariableStatement(symDecl)) {
                        const varStmtDecl = symDecl.declarationList.declarations[0];
                        const varStmtInitializer = varStmtDecl.initializer;
                        if (varStmtInitializer && ts.isCallExpression(varStmtInitializer)) {
                            findFunctionalComp(varStmtInitializer);
                        }
                    }
                    else if (ts.isVariableDeclaration(symDecl)) {
                        const varDeclInitializer = symDecl.initializer;
                        if (varDeclInitializer &&
                            (ts.isCallExpression(varDeclInitializer) ||
                                ts.isFunctionExpression(varDeclInitializer) ||
                                ts.isArrowFunction(varDeclInitializer))) {
                            findFunctionalComp(varDeclInitializer);
                        }
                    }
                    else if (ts.isIdentifier(symDecl)) {
                        const left = symDecl.parent;
                        if (ts.isPropertyAccessExpression(left) && ts.idText(left.name) === 'defaultProps') {
                            const binExpressionNode = left.parent;
                            if (ts.isBinaryExpression(binExpressionNode) &&
                                ts.isObjectLiteralExpression(binExpressionNode.right)) {
                                throw new TransformerError_1.TransformerError((_b = componentName !== null && componentName !== void 0 ? componentName : functionName) !== null && _b !== void 0 ? _b : elementName, `Static defaultProps for functional VComponents are not supported.
As an alternative, specify default values using ES6 destructuring assignment syntax.`, binExpressionNode);
                            }
                        }
                    }
                }
                if (functionalCompDecl) {
                    propsTypeNode = (_c = functionalCompDecl.parameters[0]) === null || _c === void 0 ? void 0 : _c.type;
                    if (propsTypeNode) {
                        propsInfo = MetaUtils.getPropsInfo(MetaTypes.VCompType.FUNCTION, (_d = componentName !== null && componentName !== void 0 ? componentName : functionName) !== null && _d !== void 0 ? _d : elementName, propsTypeNode, vexportToAlias, checker);
                    }
                }
            }
        }
        else if (ts.isAsExpression(expression) || ts.isParenthesizedExpression(expression)) {
            findFunctionalComp(expression.expression);
        }
    };
    if (ts.isVariableStatement(functionalCompNode)) {
        varDecl = functionalCompNode.declarationList.declarations[0];
        if (ts.isIdentifier(varDecl.name)) {
            componentName = ts.idText(varDecl.name);
        }
        const varInitializer = varDecl.initializer;
        if (varInitializer && ts.isCallExpression(varInitializer)) {
            callExpression = varInitializer;
        }
    }
    else if (ts.isExpressionStatement(functionalCompNode) &&
        ts.isCallExpression(functionalCompNode.expression)) {
        callExpression = functionalCompNode.expression;
    }
    if (callExpression &&
        callExpression.expression.getText() === vexportToAlias.registerCustomElement) {
        compRegisterCall = callExpression;
        const firstArg = callExpression.arguments[0];
        if (firstArg) {
            if (ts.isStringLiteral(firstArg)) {
                elementName = firstArg.text;
            }
            else {
                const firstArgType = checker.getTypeAtLocation(firstArg);
                if (firstArgType.isStringLiteral()) {
                    elementName = firstArgType.value;
                }
            }
        }
        const secondArg = callExpression.arguments[1];
        if (secondArg) {
            findFunctionalComp(secondArg);
        }
        if (callExpression.arguments.length > 2) {
            const thirdArg = callExpression.arguments[2];
            if (thirdArg) {
                const regOptions = getRegistrationOptions(thirdArg, checker);
                if (regOptions === null || regOptions === void 0 ? void 0 : regOptions.bindings) {
                    propBindings = regOptions.bindings;
                }
            }
        }
    }
    if (!propsInfo && propsTypeNode) {
        throw new TransformerError_1.TransformerError((_a = componentName !== null && componentName !== void 0 ? componentName : functionName) !== null && _a !== void 0 ? _a : elementName, "Invalid Component 'Props' argument type -- must be a Class, Interface, or Type reference.", propsTypeNode);
    }
    else if (propsInfo) {
        isTypeDefintionAdjustmentRequired = checkForTypeDefinitionAdjustment((_b = componentName !== null && componentName !== void 0 ? componentName : functionName) !== null && _b !== void 0 ? _b : elementName, functionalCompNode, varDecl, propsInfo);
    }
    if (translationBundleIds) {
        translationBundleInfo = getTranslationBundleInfo(translationBundleIds, compilerOptions);
    }
    if (compRegisterCall && componentNode) {
        rtnInfo = {
            compRegisterCall,
            elementName,
            componentNode,
            propsInfo
        };
        if (componentName) {
            rtnInfo.componentName = componentName;
        }
        if (functionName) {
            rtnInfo.functionName = functionName;
        }
        if (defaultProps) {
            rtnInfo.defaultProps = defaultProps;
        }
        if (propBindings) {
            rtnInfo.propBindings = propBindings;
        }
        if (translationBundleInfo) {
            rtnInfo.additionalImports = translationBundleInfo.additionalImports;
            rtnInfo.translationBundleMapExpression = translationBundleInfo.bundleMapExpression;
        }
        if (isTypeDefintionAdjustmentRequired) {
            rtnInfo.useComponentPropsForSettableProperties = true;
        }
    }
    return rtnInfo;
}
exports.getVCompFunctionInfo = getVCompFunctionInfo;
function getDtMetadataForComponent(compNode, metaUtilObj) {
    const vcompInterfaceName = MetaUtils.tagNameToElementInterfaceName(metaUtilObj.fullMetadata['name']);
    metaUtilObj.fullMetadata['implements'] = new Array(vcompInterfaceName);
    let dtMetadata = MetaUtils.getDtMetadata(compNode, metaUtilObj);
    checkComponentMetadataConsistency(compNode, dtMetadata, metaUtilObj);
    if (dtMetadata['implements']) {
        metaUtilObj.fullMetadata['implements'] = metaUtilObj.fullMetadata['implements'].concat(dtMetadata['implements']);
        delete dtMetadata['implements'];
    }
    Object.assign(metaUtilObj.fullMetadata, dtMetadata);
}
exports.getDtMetadataForComponent = getDtMetadataForComponent;
function isVCompBaseClassFound(typeRef, vexportToAlias, checker) {
    let rtn = false;
    const baseClassName = TypeUtils.getTypeNameFromTypeReference(typeRef);
    if (baseClassName === vexportToAlias.Component ||
        baseClassName === vexportToAlias.PureComponent) {
        rtn = true;
    }
    else {
        const baseClassDecl = TypeUtils.getNodeDeclaration(typeRef, checker);
        if (ts.isClassDeclaration(baseClassDecl)) {
            let heritageClauses = baseClassDecl.heritageClauses;
            for (let clause of heritageClauses) {
                for (let typeNode of clause.types) {
                    if (isVCompBaseClassFound(typeNode, vexportToAlias, checker)) {
                        rtn = true;
                        break;
                    }
                }
                if (rtn) {
                    break;
                }
            }
        }
    }
    return rtn;
}
exports.isVCompBaseClassFound = isVCompBaseClassFound;
function getRegistrationOptions(node, checker) {
    let rtnRegOptions;
    let objLiteralNode;
    if (ts.isObjectLiteralExpression(node)) {
        objLiteralNode = node;
    }
    else if (ts.isAsExpression(node) && ts.isObjectLiteralExpression(node.expression)) {
        objLiteralNode = node.expression;
    }
    else if (ts.isIdentifier(node)) {
        const sym = checker.getSymbolAtLocation(node);
        if (sym) {
            for (const symDecl of sym.declarations) {
                if (ts.isVariableDeclaration(symDecl)) {
                    const varDeclInitializer = symDecl.initializer;
                    if (varDeclInitializer && ts.isObjectLiteralExpression(varDeclInitializer)) {
                        objLiteralNode = varDeclInitializer;
                        break;
                    }
                }
            }
        }
    }
    if (objLiteralNode) {
        rtnRegOptions = MetaUtils.getValueFromNode(objLiteralNode);
    }
    return rtnRegOptions;
}
function getTranslationBundleInfo(bundleIds, compilerOptions) {
    let rtnBundleInfo;
    let loaderImports;
    const loaderNames = [];
    for (let i = 0; i < bundleIds.length; i++) {
        loaderNames.push(`translationBundle_${i + 1}`);
    }
    loaderImports = bundleIds.map((bundle, index) => {
        return `import ${loaderNames[index]} from '${bundle}/translationBundle';`;
    });
    const propsArray = bundleIds.map((bundle, index) => {
        return ts.factory.createPropertyAssignment(ts.factory.createStringLiteral(bundle, true), ts.factory.createIdentifier(compilerOptions.module === ts.ModuleKind.AMD
            ? `${loaderNames[index]}.default`
            : loaderNames[index]));
    });
    const bundleMap = ts.factory.createObjectLiteralExpression(ts.factory.createNodeArray(propsArray, false), true);
    rtnBundleInfo = {
        additionalImports: loaderImports,
        bundleMapExpression: bundleMap
    };
    return rtnBundleInfo;
}
function checkComponentMetadataConsistency(compNode, docletTagMetadata, metaUtilObj) {
    const componentMetadata = metaUtilObj.fullMetadata;
    if (docletTagMetadata['name']) {
        const logHeader = TransformerError_1.TransformerError.getMsgHeader(metaUtilObj.componentName, compNode);
        console.log(`${logHeader} '@ojmetadata name' JSDoc annotations are ignored, and should be removed.`);
        delete docletTagMetadata['name'];
    }
    if (docletTagMetadata['pack'] &&
        componentMetadata['name'].indexOf(docletTagMetadata['pack']) !== 0) {
        throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `Illegal custom element "${componentMetadata['name']}" included in JET Pack "${docletTagMetadata['pack']}".
The custom element name must begin with the JET Pack name.`, compNode);
    }
}
const D_TS_GEN_OK = 0b0000;
const D_TS_GEN_NO_VARIABLE = 0b0001;
const D_TS_GEN_VARIABLE_IMPLICIT_TYPE = 0b0010;
const D_TS_GEN_PROPS_ALIAS_NOT_EXPORTED = 0b0100;
function checkForTypeDefinitionAdjustment(compName, functionalCompNode, varDecl, propsInfo) {
    let rtnNeedsAdjustment = false;
    let dtsGenStatus = D_TS_GEN_OK;
    if (varDecl === undefined) {
        dtsGenStatus = dtsGenStatus | D_TS_GEN_NO_VARIABLE;
    }
    else if (varDecl.type === undefined) {
        dtsGenStatus = dtsGenStatus | D_TS_GEN_VARIABLE_IMPLICIT_TYPE;
    }
    const propsDecl = propsInfo.propsGenericsDeclaration;
    if (propsDecl && ts.isTypeAliasDeclaration(propsDecl)) {
        let exportFound = false;
        if (propsDecl.modifiers) {
            for (let mod of propsDecl.modifiers) {
                if (mod.kind === ts.SyntaxKind.ExportKeyword) {
                    exportFound = true;
                    break;
                }
            }
        }
        if (!exportFound) {
            dtsGenStatus = dtsGenStatus | D_TS_GEN_PROPS_ALIAS_NOT_EXPORTED;
        }
    }
    if (dtsGenStatus & D_TS_GEN_NO_VARIABLE) {
        if (dtsGenStatus & D_TS_GEN_PROPS_ALIAS_NOT_EXPORTED) {
            throw new TransformerError_1.TransformerError(compName, `Generation of a valid VComponent type definition file requires either:
1) the return value of the registerCustomElement call must be assigned to a variable, or
2) the VComponent's Props type alias must be exported.`, functionalCompNode);
        }
    }
    else if (dtsGenStatus & D_TS_GEN_VARIABLE_IMPLICIT_TYPE) {
        if (dtsGenStatus & D_TS_GEN_PROPS_ALIAS_NOT_EXPORTED) {
            rtnNeedsAdjustment = true;
        }
    }
    return rtnNeedsAdjustment;
}
//# sourceMappingURL=MetadataComponentUtils.js.map