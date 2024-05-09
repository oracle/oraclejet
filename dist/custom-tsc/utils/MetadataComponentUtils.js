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
exports.getTranslationBundleInfo = exports.getDtMetadataForComponent = exports.getVCompFunctionInfo = exports.getVCompClassInfo = void 0;
const ts = __importStar(require("typescript"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const FileUtils = __importStar(require("./MetadataFileUtils"));
const TransformerError_1 = require("./TransformerError");
function getVCompClassInfo(elementName, classNode, progImportMaps, checker, buildOptions) {
    let rtnInfo = null;
    let className = classNode.name.getText();
    let packInfo;
    let heritageClauses = classNode.heritageClauses;
    for (let clause of heritageClauses) {
        for (let typeNode of clause.types) {
            if (isVCompBaseClassFound(typeNode, progImportMaps, checker)) {
                if (typeNode.typeArguments?.[0] && ts.isTypeReferenceNode(typeNode.typeArguments?.[0])) {
                    let propsTypeNode = typeNode.typeArguments[0];
                    rtnInfo = {
                        elementName,
                        className,
                        classNode,
                        propsInfo: MetaUtils.getPropsInfo(MetaTypes.VCompType.CLASS, className, propsTypeNode, progImportMaps, checker)
                    };
                    if (!rtnInfo.propsInfo &&
                        TypeUtils.getTypeNameFromTypeReference(propsTypeNode) !==
                            progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, propsTypeNode).GlobalProps) {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MISSING_PROPS_OBJECT, TransformerError_1.ExceptionType.THROW_ERROR, className, 'All custom elements at a minimum support global properties. Properties should use the ExtendGlobalProps utility type, e.g. Component<ExtendGlobalProps<Props>>.', propsTypeNode);
                    }
                    break;
                }
                else {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.GLOBAL_PROPS_MINIMUM, TransformerError_1.ExceptionType.THROW_ERROR, className, 'All custom elements at a minimum support global properties and should pass in GlobalProps for the property type, e.g. Component<GlobalProps>.', typeNode);
                }
            }
        }
    }
    if (rtnInfo) {
        packInfo = getPackInfo(elementName, classNode, buildOptions);
        if (packInfo) {
            rtnInfo.packInfo = packInfo;
        }
    }
    return rtnInfo;
}
exports.getVCompClassInfo = getVCompClassInfo;
function getVCompFunctionInfo(functionalCompNode, progImportMaps, checker, buildOptions) {
    let rtnInfo = null;
    let propsInfo = null;
    let isForwarded = false;
    let isTypeDefintionAdjustmentRequired = false;
    let regOptions = {};
    let callExpression;
    let compRegisterCall;
    let varDecl;
    let elementName;
    let componentName;
    let componentNode;
    let functionName;
    let defaultProps;
    let propsTypeNode;
    const exportToAlias = progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, functionalCompNode);
    const findFunctionalComp = function (expression) {
        if (ts.isFunctionExpression(expression) || ts.isArrowFunction(expression)) {
            componentNode = expression;
            const propsParam = expression.parameters[0];
            if (propsParam) {
                if (propsParam.type && ts.isTypeReferenceNode(propsParam.type)) {
                    propsTypeNode = propsParam.type;
                    propsInfo = MetaUtils.getPropsInfo(MetaTypes.VCompType.FUNCTION, componentName ?? functionName ?? elementName, propsTypeNode, progImportMaps, checker);
                    if (ts.isObjectBindingPattern(propsParam.name)) {
                        defaultProps = propsParam.name.elements;
                    }
                }
            }
        }
        else if (ts.isCallExpression(expression)) {
            const callName = ts.isIdentifier(expression.expression)
                ? ts.idText(expression.expression)
                : null;
            switch (callName) {
                case exportToAlias.forwardRef:
                    isForwarded = true;
                case exportToAlias.memo:
                    const firstArg = expression.arguments[0];
                    findFunctionalComp(firstArg);
                    break;
                default:
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNRECOGNIZED_FUNCTION_WRAPPER, TransformerError_1.ExceptionType.WARN_IF_DISABLED, componentName ?? functionName ?? elementName, `Unrecognized '${callName}' wrapper to Preact functional component.`, expression);
                    if (expression.arguments[0]) {
                        findFunctionalComp(expression.arguments[0]);
                    }
                    break;
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
                                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.STATIC_DEFAULTPROPS_ON_FUNCTION, TransformerError_1.ExceptionType.WARN_IF_DISABLED, componentName ?? functionName ?? elementName, `Static defaultProps for functional VComponents are not supported.
  As an alternative, specify default values using ES6 destructuring assignment syntax.`, binExpressionNode);
                                defaultProps = binExpressionNode.right.properties;
                            }
                        }
                    }
                }
                if (functionalCompDecl) {
                    propsTypeNode = functionalCompDecl.parameters[0]?.type;
                    if (propsTypeNode) {
                        propsInfo = MetaUtils.getPropsInfo(MetaTypes.VCompType.FUNCTION, componentName ?? functionName ?? elementName, propsTypeNode, progImportMaps, checker);
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
        callExpression.expression.getText() === exportToAlias.registerCustomElement) {
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
        regOptions = getRegistrationOptions(callExpression.arguments.length > 2 ? callExpression.arguments[2] : null, componentName ?? functionName ?? elementName, compRegisterCall, secondArg, isForwarded, checker);
    }
    if (!propsInfo && propsTypeNode) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_PROPS_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, componentName ?? functionName ?? elementName, "Invalid Component 'Props' argument type -- must be a Class, Interface, or Type reference.", propsTypeNode);
    }
    else if (propsInfo) {
        isTypeDefintionAdjustmentRequired = checkForTypeDefinitionAdjustment(componentName ?? functionName ?? elementName, functionalCompNode, varDecl, propsInfo);
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
        if (regOptions.bindings) {
            rtnInfo.propBindings = regOptions.bindings;
        }
        if (regOptions.methodsInfo) {
            rtnInfo.methodsInfo = regOptions.methodsInfo;
        }
        if (regOptions.contexts) {
            rtnInfo.contextsExpression = regOptions.contexts;
        }
        if (isTypeDefintionAdjustmentRequired) {
            rtnInfo.useComponentPropsForSettableProperties = true;
        }
        const packInfo = getPackInfo(elementName, componentNode, buildOptions);
        if (packInfo) {
            rtnInfo.packInfo = packInfo;
        }
    }
    return rtnInfo;
}
exports.getVCompFunctionInfo = getVCompFunctionInfo;
function getDtMetadataForComponent(vcompInfo, metaUtilObj) {
    const compNode = MetaTypes.isClassInfo(vcompInfo) ? vcompInfo.classNode : vcompInfo.componentNode;
    const vcompInterfaceName = MetaUtils.tagNameToElementInterfaceName(metaUtilObj.fullMetadata['name']);
    metaUtilObj.fullMetadata['implements'] = new Array(vcompInterfaceName);
    let dtMetadata = MetaUtils.getDtMetadata(compNode, MetaTypes.MDContext.COMP, null, metaUtilObj);
    checkComponentMetadataConsistency(compNode, vcompInfo.packInfo?.isMonoPack(), dtMetadata, metaUtilObj);
    if (vcompInfo.packInfo?.isMonoPack()) {
        dtMetadata['main'] ??= `${vcompInfo.packInfo.name}/${metaUtilObj.fullMetadata['name'].substring(vcompInfo.packInfo.name.length + 1)}`;
    }
    if (dtMetadata['implements']) {
        metaUtilObj.fullMetadata['implements'] = metaUtilObj.fullMetadata['implements'].concat(dtMetadata['implements']);
        delete dtMetadata['implements'];
    }
    Object.assign(metaUtilObj.fullMetadata, dtMetadata);
}
exports.getDtMetadataForComponent = getDtMetadataForComponent;
function getTranslationBundleInfo(vcompInfo, compilerOptions, buildOptions, metaUtilObj) {
    let rtnTranslationBundleInfo;
    const bundleIds = getTranslationBundleIdsFromDependencies(vcompInfo, buildOptions, metaUtilObj);
    if (bundleIds) {
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
        const bundleMapExpression = ts.factory.createObjectLiteralExpression(ts.factory.createNodeArray(propsArray, false), true);
        rtnTranslationBundleInfo = {
            loaderImports,
            bundleMapExpression
        };
    }
    return rtnTranslationBundleInfo;
}
exports.getTranslationBundleInfo = getTranslationBundleInfo;
function isVCompBaseClassFound(typeRef, progImportMaps, checker) {
    let rtn = false;
    const exportToAlias = progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, typeRef);
    const baseClassName = TypeUtils.getTypeNameFromTypeReference(typeRef);
    if (baseClassName === exportToAlias.Component || baseClassName === exportToAlias.PureComponent) {
        rtn = true;
    }
    else {
        const baseClassDecl = TypeUtils.getNodeDeclaration(typeRef, checker);
        if (ts.isClassDeclaration(baseClassDecl)) {
            let heritageClauses = baseClassDecl.heritageClauses;
            for (let clause of heritageClauses) {
                for (let typeNode of clause.types) {
                    if (isVCompBaseClassFound(typeNode, progImportMaps, checker)) {
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
function getTranslationBundleIdsFromDependencies(vcompInfo, buildOptions, metaUtilObj) {
    let bundleIds;
    const bundleIdSet = new Set();
    const visitedDependencies = new Set();
    if (vcompInfo.packInfo?.dependencies &&
        vcompInfo.packInfo.dependencies !== MetaTypes.DEPENDENCIES_TOKEN) {
        const depIds = getTranslationBundleIds(vcompInfo.packInfo.dependencies, buildOptions.dependencyPackMap, visitedDependencies);
        for (const id of depIds) {
            bundleIdSet.add(id);
        }
    }
    if (metaUtilObj.fullMetadata.dependencies) {
        const depIds = getTranslationBundleIds(metaUtilObj.fullMetadata.dependencies, buildOptions.dependencyPackMap, visitedDependencies);
        for (const id of depIds) {
            bundleIdSet.add(id);
        }
    }
    if (bundleIdSet.size > 0) {
        bundleIds = [...bundleIdSet];
    }
    return bundleIds;
}
const _CORE_BUNDLE_TO_T9N_ID_MAP = new Map([
    ['oj-ref-oraclejet-preact', '@oracle/oraclejet-preact']
]);
function getTranslationBundleIds(dependencies, packMap, visited) {
    const rtnIds = [];
    for (const depName of Object.keys(dependencies)) {
        if (!visited.has(depName)) {
            visited.add(depName);
            if (packMap.has(depName)) {
                const packDep = packMap.get(depName);
                if (packDep.translationBundle) {
                    rtnIds.push(packDep.translationBundle);
                }
                if (packDep.dependencies && packDep.dependencies !== MetaTypes.DEPENDENCIES_TOKEN) {
                    const subIds = getTranslationBundleIds(packDep.dependencies, packMap, visited);
                    for (const id of subIds) {
                        rtnIds.push(id);
                    }
                }
            }
            else if (_CORE_BUNDLE_TO_T9N_ID_MAP.has(depName)) {
                rtnIds.push(_CORE_BUNDLE_TO_T9N_ID_MAP.get(depName));
            }
        }
    }
    return rtnIds;
}
function getRegistrationOptions(metadataNode, vcompName, compRegisterCall, fcomp, isForwarded, checker) {
    const rtnRegisteredOptions = {};
    let methodsInfo;
    let signaturesTypeNode;
    let regMetadata;
    if (compRegisterCall.typeArguments?.length > 1) {
        signaturesTypeNode = compRegisterCall.typeArguments[1];
        if (isForwarded) {
            methodsInfo = {
                signaturesTypeNode
            };
        }
        else {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MISSING_FORWARDREF_WRAPPER, TransformerError_1.ExceptionType.THROW_ERROR, vcompName, `The Preact functional component that implements this VComponent with public methods must be wrapped inline with a 'forwardRef' call.`, fcomp);
        }
    }
    if (metadataNode) {
        regMetadata = getRegisteredMetadataFromNode(metadataNode, checker);
        if (regMetadata.methods) {
            if (methodsInfo) {
                methodsInfo.metadata = regMetadata.methods;
                methodsInfo.metadataNode = metadataNode;
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DEPRECATED_METHODS_METADATA, TransformerError_1.ExceptionType.LOG_WARNING, vcompName, `Passing 'methods' design-time metadata through the 'options' argument of the 'registerCustomElement' call is deprecated.
  Instead use standard doclets and @ojmetadata tags on individual properties of the type parameter referenced to map public method names to their function signatures.
  Metadata from standard doclets will take precedence over any 'methods' metadata passed in through the 'options' argument.`, metadataNode);
            }
            else {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MISSING_METHOD_SIGNATURES, TransformerError_1.ExceptionType.LOG_WARNING, vcompName, `The 'registerCustomElement' call is missing the generic type paramether with method signatures, so deprecated 'methods' metadata will be ignored.`, metadataNode);
            }
        }
        if (regMetadata.bindings) {
            rtnRegisteredOptions.bindings = regMetadata.bindings;
        }
        if (regMetadata.contexts) {
            rtnRegisteredOptions.contexts = regMetadata.contexts;
        }
    }
    if (methodsInfo) {
        rtnRegisteredOptions.methodsInfo = methodsInfo;
    }
    return rtnRegisteredOptions;
}
function getRegisteredMetadataFromNode(node, checker) {
    let rtnRegMetadata = {};
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
        objLiteralNode.properties.forEach((prop) => {
            if (ts.isPropertyAssignment(prop)) {
                const optionName = prop.name.getText();
                switch (optionName) {
                    case 'bindings':
                        rtnRegMetadata.bindings = MetaUtils.getMDValueFromNode(prop.initializer, 'bindings');
                        break;
                    case 'methods':
                        rtnRegMetadata.methods = MetaUtils.getMDValueFromNode(prop.initializer, 'methods');
                        break;
                    case 'contexts':
                        rtnRegMetadata.contexts = prop.initializer;
                        break;
                    default:
                        break;
                }
            }
        });
    }
    return rtnRegMetadata;
}
function checkComponentMetadataConsistency(compNode, isInMonoPack, docletTagMetadata, metaUtilObj) {
    const componentMetadata = metaUtilObj.fullMetadata;
    if (docletTagMetadata['name']) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_OJMETADATA_NAME, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'@ojmetadata name' annotations are ignored, and should be removed.`, compNode);
        delete docletTagMetadata['name'];
    }
    if (isInMonoPack) {
        if (docletTagMetadata['version'] &&
            componentMetadata.version !== docletTagMetadata['version']) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INCONSISTENT_PACK_VERSION, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Inconsistent '@ojmetadata version "${docletTagMetadata['version']}"' annotation will be ignored, and should be removed.`, compNode);
            delete docletTagMetadata['version'];
        }
        if (docletTagMetadata['jetVersion'] &&
            componentMetadata.jetVersion !== docletTagMetadata['jetVersion']) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INCONSISTENT_PACK_JETVERSION, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Inconsistent '@ojmetadata jetVersion "${docletTagMetadata['jetVersion']}"' annotation will be ignored, and should be removed.`, compNode);
            delete docletTagMetadata['jetVersion'];
        }
        if (docletTagMetadata['dependencyScope'] &&
            componentMetadata['dependencyScope'] !== docletTagMetadata['dependencyScope']) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INCONSISTENT_PACK_DEPENDENCYSCOPE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Inconsistent '@ojmetadata dependencyScope "${docletTagMetadata['dependencyScope']}"' annotation will be ignored, and should be removed.`, compNode);
            delete docletTagMetadata['dependencyScope'];
        }
        if (docletTagMetadata['license'] &&
            componentMetadata.license !== docletTagMetadata['license']) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INCONSISTENT_PACK_LICENSE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Inconsistent '@ojmetadata license "${docletTagMetadata['license']}"' annotation will be ignored, and should be removed.`, compNode);
            delete docletTagMetadata['license'];
        }
    }
    const packName = componentMetadata['pack'] ?? docletTagMetadata['pack'];
    if (packName) {
        if (docletTagMetadata['pack'] && packName !== docletTagMetadata['pack']) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INCONSISTENT_PACK_PACKNAME, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Inconsistent '@ojmetadata pack "${docletTagMetadata['pack']}"' annotation will be ignored, and should be removed.`, compNode);
            delete docletTagMetadata['pack'];
        }
        if (componentMetadata['name'].indexOf(packName) !== 0) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_ELEMENTNAME_IN_PACK, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Illegal custom element "${componentMetadata['name']}" included in JET Pack "${packName}".
  The custom element name must begin with the JET Pack name.`, compNode);
        }
        if (isInMonoPack && docletTagMetadata['main']) {
            const vcompName = componentMetadata['name'].substring(packName.length + 1);
            const mainRegex = new RegExp(`^${packName}\\/${vcompName}(\\/loader)?$`);
            if (docletTagMetadata['main'].match(mainRegex) === null) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_OJMETADATA_MAIN, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Invalid 'main' metadata value will be ignored: ${docletTagMetadata['main']}`, compNode);
                delete docletTagMetadata['main'];
            }
        }
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
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.YIELDS_INVALID_FUNC_VCOMP_D_TS, TransformerError_1.ExceptionType.THROW_ERROR, compName, `Generation of a valid VComponent type definition file requires either:
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
function getPackInfo(elementName, vcompNode, buildOptions) {
    let rtnPackInfo = null;
    let node = vcompNode;
    while (!ts.isSourceFile(node)) {
        node = node.parent;
    }
    const filename = node.fileName;
    const parentDirPath = FileUtils.getParentDirPath(filename);
    if (parentDirPath) {
        if (buildOptions.parentDirToPackInfo?.hasOwnProperty(parentDirPath)) {
            const vcompPack = buildOptions.parentDirToPackInfo[parentDirPath];
            if (vcompPack?.isVCompInPack(elementName)) {
                rtnPackInfo = vcompPack;
            }
        }
        else {
            let cacheItem = null;
            buildOptions.parentDirToPackInfo = buildOptions.parentDirToPackInfo || {};
            const packJsonObj = FileUtils.getComponentJSONObj(parentDirPath);
            if (packJsonObj) {
                const vcompPack = new MetaTypes.VCompPack(packJsonObj);
                if (vcompPack.isJETPack()) {
                    cacheItem = vcompPack;
                    if (vcompPack.isVCompInPack(elementName)) {
                        rtnPackInfo = vcompPack;
                    }
                }
            }
            buildOptions.parentDirToPackInfo[parentDirPath] = cacheItem;
        }
    }
    return rtnPackInfo;
}
//# sourceMappingURL=MetadataComponentUtils.js.map