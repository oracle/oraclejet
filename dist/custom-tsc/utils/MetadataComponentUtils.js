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
exports.getVCompClassInfo = getVCompClassInfo;
exports.getVCompFunctionInfo = getVCompFunctionInfo;
exports.getDtMetadataForComponent = getDtMetadataForComponent;
exports.getTranslationBundleInfo = getTranslationBundleInfo;
const ts = __importStar(require("typescript"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const FileUtils = __importStar(require("../shared/MetadataFileUtils"));
const DefaultProps_1 = require("../shared/DefaultProps");
const ImportMaps_1 = require("../shared/ImportMaps");
const JETComp_1 = require("../shared/JETComp");
const Utils_1 = require("../shared/Utils");
const TransformerError_1 = require("./TransformerError");
/**
 * Returns information necessary to process a class that
 * extends a Preact component, or null if the class does
 * not require any further transformer processing.
 *
 * If the class does extend a Preact component but does not
 * have the shape we are looking for, then throw an exception.
 */
function getVCompClassInfo(elementName, classNode, progImportMaps, checker, buildOptions) {
    let rtnInfo = null;
    let className = classNode.name.getText();
    let packInfo;
    let heritageClauses = classNode.heritageClauses;
    for (let clause of heritageClauses) {
        for (let typeNode of clause.types) {
            if (isVCompBaseClassFound(typeNode, progImportMaps, checker)) {
                // VComponent type arguments are of the following order: Component<Props, State>
                if (typeNode.typeArguments?.[0] && ts.isTypeReferenceNode(typeNode.typeArguments?.[0])) {
                    let propsTypeNode = typeNode.typeArguments[0];
                    // Chase down the Props class/type/interface information
                    rtnInfo = {
                        elementName,
                        className,
                        classNode,
                        propsInfo: MetaUtils.getPropsInfo(MetaTypes.VCompType.CLASS, className, propsTypeNode, progImportMaps, checker)
                    };
                    // If a Props object was not detected, or if the VComponent
                    // custom element does not support GlobalProps, then throw error
                    if (!rtnInfo.propsInfo &&
                        (0, Utils_1.getTypeNameFromTypeReference)(propsTypeNode) !==
                            progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, propsTypeNode).GlobalProps) {
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
        // If there is a containing JET Pack for this VComponent, return its info
        packInfo = getPackInfo(elementName, classNode, buildOptions);
        if (packInfo) {
            rtnInfo.packInfo = packInfo;
        }
    }
    return rtnInfo;
}
/**
 * Returns information necessary to process a Preact functional component
 * registered as a JET VComponent custom element, or null if the
 * specified node is not associated with registering a functional component.
 *
 * If the function's Props parameter does not have the shape we are looking for,
 * then throw an exception.
 */
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
    let asCastInfo;
    let functionName;
    let defaultProps;
    let propsTypeNode;
    const exportToAlias = progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, functionalCompNode);
    // Helper function that chases down an Expression, looking for a functional component
    // implementation and processing its Props reference as well as
    // any default property values
    const findFunctionalComp = function (expression) {
        // If the expression is an inline function, then the first parameter
        // of that inline function is the reference to Props.
        if (ts.isFunctionExpression(expression) || ts.isArrowFunction(expression)) {
            componentNode = expression;
            const propsParam = expression.parameters[0];
            if (propsParam) {
                if (propsParam.type && ts.isTypeReferenceNode(propsParam.type)) {
                    // If a cast expression on the registerCustomElement call provided
                    // an alternate function signature with an alternate 'Props' reference,
                    // use that alternate reference for the getPropsInfo call
                    propsTypeNode = propsParam.type;
                    propsInfo = MetaUtils.getPropsInfo(MetaTypes.VCompType.FUNCTION, componentName ?? functionName ?? elementName, asCastInfo?.propsNode ?? propsTypeNode, progImportMaps, checker);
                    // Also get any defaultProps mapping from the Props parameter
                    defaultProps = (0, DefaultProps_1.getDefaultPropsFromSource)(propsParam);
                }
            }
        }
        // Otherwise, if the expression is a function call, check if it is
        // a call to a supported wrapper that takes the functional component
        // as an argument and returns a wrapped functional component -- we need the
        // DT metadata and the reference to Props in that wrapped functional component
        else if (ts.isCallExpression(expression)) {
            const callName = ts.isIdentifier(expression.expression)
                ? ts.idText(expression.expression)
                : null;
            switch (callName) {
                case exportToAlias.forwardRef:
                    isForwarded = true; // note forwardRef wrapper, and fall thru
                case exportToAlias.memo:
                    // Both the forwardRef and memo wrappers from preact/compat
                    // expect a functional component as their first argument
                    // -- chase it down, looking for the wrapped functional component
                    const firstArg = expression.arguments[0];
                    findFunctionalComp(firstArg);
                    break;
                default:
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNRECOGNIZED_FUNCTION_WRAPPER, TransformerError_1.ExceptionType.WARN_IF_DISABLED, componentName ?? functionName ?? elementName, `Unrecognized '${callName}' wrapper to Preact functional component.`, expression);
                    // If we only logged a warning, keep going -- try to chase down
                    // the wrapped functional component
                    if (expression.arguments[0]) {
                        findFunctionalComp(expression.arguments[0]);
                    }
                    break;
            }
        }
        // Otherwise, if the expression is an identifier (potential function reference)
        // OR an expression with type arguments (potential generic function reference),
        // then look up its corresponding Symbol and loop over its declarations.
        else if (ts.isIdentifier(expression) ||
            (ts.isExpressionWithTypeArguments(expression) && ts.isIdentifier(expression.expression))) {
            let functionalCompDecl;
            // NOTE: TS flow control needs a little help...
            const idExpression = ts.isIdentifier(expression)
                ? expression
                : expression.expression;
            functionName = ts.idText(idExpression);
            const functionalCompSymbol = checker.getSymbolAtLocation(idExpression);
            if (functionalCompSymbol) {
                for (const symDecl of functionalCompSymbol.declarations) {
                    // If we find a function declaration, then that function's
                    // first parameter is the reference to Props.
                    if (ts.isFunctionDeclaration(symDecl)) {
                        functionalCompDecl = symDecl;
                        componentNode = functionalCompDecl;
                        const propsParam = functionalCompDecl.parameters[0];
                        // Also get any defaultProps mapping from the Props parameter
                        if (propsParam) {
                            defaultProps = (0, DefaultProps_1.getDefaultPropsFromSource)(propsParam);
                        }
                        // At this point, we should be all set...but keep looping anyway,
                        // in case there's a (deprecated) static "defaultProps" instance!
                    }
                    // Otherwise, if we find a variable statement, then get its
                    // right-hand side expression and chase it down, looking for the
                    // base functional component.
                    else if (ts.isVariableStatement(symDecl)) {
                        const varStmtDecl = symDecl.declarationList.declarations[0];
                        const varStmtInitializer = varStmtDecl.initializer;
                        if (varStmtInitializer && ts.isCallExpression(varStmtInitializer)) {
                            findFunctionalComp(varStmtInitializer);
                        }
                    }
                    // Otherwise, if we find a variable declaration, then get its
                    // right-hand side expression and chase it down, looking for the
                    // base functional component.
                    else if (ts.isVariableDeclaration(symDecl)) {
                        const varDeclInitializer = symDecl.initializer;
                        if (varDeclInitializer &&
                            (ts.isCallExpression(varDeclInitializer) ||
                                ts.isFunctionExpression(varDeclInitializer) ||
                                ts.isArrowFunction(varDeclInitializer))) {
                            findFunctionalComp(varDeclInitializer);
                        }
                    }
                    // Otherwise, if we find an identifier, walk up the ancestor chain to determine
                    // if it's part of a binary expression where the left-hand side accesses
                    // a "defaultProps" property of that function & the right-hand side is
                    // an Object literal for specifying default property values.  For example:
                    //
                    //    function TestFunctionalComponentImpl (props: ExtendGlobalProps<Props>) {
                    //      return <div>`${props.a}`</div>;
                    //    }
                    //    TestFunctionalComponentImpl.defaultProps = {
                    //      a: "Hello JET!",
                    //    };
                    //
                    //    Although this would work, static defaultProps is discouraged/deprecated
                    //    for (P)React functional components, so we would rather not support them.
                    else if (ts.isIdentifier(symDecl)) {
                        const left = symDecl.parent;
                        if (ts.isPropertyAccessExpression(left) && ts.idText(left.name) === 'defaultProps') {
                            const binExpressionNode = left.parent;
                            if (ts.isBinaryExpression(binExpressionNode) &&
                                ts.isObjectLiteralExpression(binExpressionNode.right)) {
                                // Deprecated pattern for static defaultProps on functional components
                                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.STATIC_DEFAULTPROPS_ON_FUNCTION, TransformerError_1.ExceptionType.WARN_IF_DISABLED, componentName ?? functionName ?? elementName, `Static defaultProps for functional VComponents are not supported.
  As an alternative, specify default values using ES6 destructuring assignment syntax.`, binExpressionNode);
                                // If we only logged a warning, keep going -- process the
                                // static defaultProps expression
                                defaultProps = binExpressionNode.right.properties;
                            }
                        }
                    }
                }
                // Reference to Props found?
                if (functionalCompDecl) {
                    propsTypeNode = functionalCompDecl.parameters[0]?.type;
                    if (propsTypeNode) {
                        // If a cast expression on the registerCustomElement call provided
                        // an alternate function signature with an alternate 'Props' reference,
                        // use that alternate reference for the getPropsInfo call
                        propsInfo = MetaUtils.getPropsInfo(MetaTypes.VCompType.FUNCTION, componentName ?? functionName ?? elementName, asCastInfo?.propsNode ?? propsTypeNode, progImportMaps, checker);
                    }
                }
            }
        }
        // Otherwise, if the expression is either an AsExpression or a ParenthesizedExpression,
        // then get the wrapped expression and chase it down, looking for the base
        // functional component.
        else if (ts.isAsExpression(expression) || ts.isParenthesizedExpression(expression)) {
            findFunctionalComp(expression.expression);
        }
    };
    // END - findFunctionalComp helper
    // Look for the CallExpression that registers a Functional VComp.
    //
    // First use case:  Variable Statement
    //  * e.g. "export const FuncComp = registerCustomElement(...);"
    //  * exports both intrinsic element and value-based element APIs
    if (ts.isVariableStatement(functionalCompNode)) {
        varDecl = functionalCompNode.declarationList.declarations[0];
        if (ts.isIdentifier(varDecl.name)) {
            componentName = ts.idText(varDecl.name);
        }
        const varInitializer = varDecl.initializer;
        if (varInitializer) {
            if (ts.isCallExpression(varInitializer)) {
                // In this variant, VComponent type will be determined by the return type
                // of the registerCustomElement call or the LHS variable type declaration.
                callExpression = varInitializer;
            }
            else if (ts.isAsExpression(varInitializer) &&
                ts.isCallExpression(varInitializer.expression)) {
                // Detects and returns information about an alternate function signature
                // due to a cast of the return type of the registerCustomElement call
                // (used to preserve component-level generics), otherwise returns undefined
                asCastInfo = getAsCastInfo(varInitializer.type, exportToAlias, checker);
                if (asCastInfo) {
                    callExpression = varInitializer.expression;
                    // If information about the alternate function signature also includes
                    // a 'displayName' property value, use it to override the default
                    // componentName!
                    if (asCastInfo.displayName) {
                        componentName = asCastInfo.displayName;
                    }
                }
            }
        }
    }
    // Second use case:  Expression Statement
    //  * e.g. "registerCustomElement(...);"
    //  * exports intrinsic element API only
    else if (ts.isExpressionStatement(functionalCompNode)) {
        const expressionStmt = functionalCompNode.expression;
        if (ts.isCallExpression(expressionStmt)) {
            callExpression = expressionStmt;
        }
        else if (ts.isAsExpression(expressionStmt) &&
            ts.isCallExpression(expressionStmt.expression)) {
            // Detects and returns information about an alternate function signature
            // due to a cast of the return type of the registerCustomElement call
            // (used to preserve component-level generics), otherwise returns undefined
            asCastInfo = getAsCastInfo(expressionStmt.type, exportToAlias, checker);
            if (asCastInfo) {
                callExpression = expressionStmt.expression;
                // If information about the alternate function signature also includes
                // a 'displayName' property value, use it to override the default
                // componentName!
                if (asCastInfo.displayName) {
                    componentName = asCastInfo.displayName;
                }
            }
        }
    }
    if (callExpression &&
        callExpression.expression.getText() === exportToAlias.registerCustomElement) {
        // Found call to register Functional VComp
        // Save off a reference to the CallExpression that registers the Function VComp,
        // as we will need it to inject the RT metadata into the registration call
        // as a third argument.
        compRegisterCall = callExpression;
        // Function VComp registration expects two arguments:
        //  * 1st arg is a string specifying the custom element full-name
        //  * 2nd arg is either an inline function expression or a reference to a named
        //      function that implements the Functional VComp (or wraps it, if the
        //      VComponent author is leveraging preact/compat wrappers)
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
            // Process the expression's 2nd arg, looking for the functional component
            // implementation and processing its Props reference as well as
            // any default property values
            findFunctionalComp(secondArg);
        }
        // Process the optional 3rd arg, looking for property binding and
        // functional VComponent method information
        regOptions = getRegistrationOptions(callExpression.arguments.length > 2 ? callExpression.arguments[2] : null, componentName ?? functionName ?? elementName, compRegisterCall, secondArg, isForwarded, checker);
    }
    // If a Props named type reference was not detected, then throw error
    if (!propsInfo && propsTypeNode) {
        // VComp reference:
        //  * if no componentName, use functionName
        //  * if no functionName, use elementName
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_PROPS_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, componentName ?? functionName ?? elementName, "Invalid Component 'Props' argument type -- must be a Class, Interface, or Type reference.", propsTypeNode);
    }
    else if (propsInfo) {
        isTypeDefintionAdjustmentRequired = checkForTypeDefinitionAdjustment(componentName ?? functionName ?? elementName, functionalCompNode, varDecl, propsInfo);
    }
    // Custom element registration and functional component node detected?
    if (compRegisterCall && componentNode) {
        rtnInfo = {
            compRegisterCall,
            elementName,
            componentNode,
            // EXPLANATION:
            // Usually we process the type parameters of the component impl
            // componentNode to get the VComponent's generics and typeParams
            // info...unless the registerCustomElement call was cast as part
            // of an AsExpression.  In that case, we want to process the
            // function signature of the cast expression.
            typeParamsNode: asCastInfo?.typeNode ?? componentNode,
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
        // If there is a containing JET Pack for this VComponent, return its info
        const packInfo = getPackInfo(elementName, componentNode, buildOptions);
        if (packInfo) {
            rtnInfo.packInfo = packInfo;
        }
    }
    return rtnInfo;
}
function getDtMetadataForComponent(vcompInfo, metaUtilObj) {
    const compNode = MetaTypes.isClassInfo(vcompInfo) ? vcompInfo.classNode : vcompInfo.componentNode;
    // Custom element DT metadata includes an array of interface names that
    //  the custom element specifies that it "implements".  Custom element VComponents
    //  always export an interface of the form '<vcomponentName>Element',
    //  where <vcomponentName> is derived from the tag name.
    //
    // NOTE: If we ever have the requirement in the future to generate an exhaustive set
    //  of implemented interfaces, we can add logic as needed for spelunking the AST
    //  to find interfaces implemented by the custom element's superclasses.
    const vcompInterfaceName = MetaUtils.tagNameToElementInterfaceName(metaUtilObj.fullMetadata['name']);
    metaUtilObj.fullMetadata['implements'] = new Array(vcompInterfaceName);
    let dtMetadata = MetaUtils.getDtMetadata(compNode, MetaTypes.MDContext.COMP, null, metaUtilObj);
    // Check the ComponentMetadata for consistency
    checkComponentMetadataConsistency(compNode, vcompInfo.packInfo?.isMonoPack(), dtMetadata, metaUtilObj);
    // If the VComponent is part of a mono-pack but no 'main' metadata property value has been specified,
    // then generate a standard 'main' metadata value of the form '<pack-name>/<vcomp-name>'
    // NOTE:  JET Tooling will take care of generating the matching loaderless stubs
    //        for this 'main' metadata value.
    if (vcompInfo.packInfo?.isMonoPack()) {
        dtMetadata['main'] ??= `${vcompInfo.packInfo.name}/${metaUtilObj.fullMetadata['name'].substring(vcompInfo.packInfo.name.length + 1)}`;
    }
    // Merge any additional "implements" metadata that might have been specified via doclet tags.
    if (dtMetadata['implements']) {
        metaUtilObj.fullMetadata['implements'] = metaUtilObj.fullMetadata['implements'].concat(dtMetadata['implements']);
        delete dtMetadata['implements']; // you can go now...
    }
    // If this is a 'core' JET component (i.e., a "legacy JET VComponent") AND it appears
    // in the set of legacy JET WebElement test adapter implementations, then generate
    // extension 'webelement' metadata as a service for the Core JET Build:
    //
    //    * extension 'webelement' metadata for legacy JET Composites is handled by the
    //      legacy metadata generator
    //    * extension 'webelement' metadata for JET Core Pack Components is handled by the
    //      the oraclejet-core-pack Project hook scripts
    //
    if (metaUtilObj.fullMetadata['type'] === 'core' &&
        metaUtilObj.coreJetWebElementSet &&
        metaUtilObj.coreJetWebElementSet.has(metaUtilObj.fullMetadata['name'])) {
        const nameTitleCase = (0, Utils_1.stickCaseToTitleCase)(metaUtilObj.fullMetadata['name']);
        dtMetadata.extension = dtMetadata.extension ?? {};
        dtMetadata.extension['webelement'] = dtMetadata.extension['webelement'] ?? {};
        dtMetadata.extension['webelement']['package'] = '@oracle/oraclejet-webdriver';
        dtMetadata.extension['webelement']['version'] = metaUtilObj.fullMetadata['jetVersion'];
        dtMetadata.extension['webelement']['docUrl'] = `https://www.oracle.com/webfolder/technetwork/jet/wdtsdoc/classes/elements.Oj${nameTitleCase}.html`;
        dtMetadata.extension['webelement']['export'] = `oj${nameTitleCase}`;
        dtMetadata.extension['webelement']['main'] = '@oracle/oraclejet-webdriver/elements';
    }
    // Add the component-level DT metadata to the fullMetadata
    Object.assign(metaUtilObj.fullMetadata, dtMetadata);
}
/**
 * Returns information needed to inject translation bundles information into
 * the VComponent's emitted JS
 */
function getTranslationBundleInfo(vcompInfo, compilerOptions, buildOptions, metaUtilObj) {
    let rtnTranslationBundleInfo;
    // First, we need an array of string literals that specify bundle IDs
    // (e.g., ['@oracle/oraclejet-preact']).
    //
    // From the resulting bundleID array, we will end up generating:
    //
    //  * import statements for the bundle loaders to be injected
    //    into the emitted JS, AND
    //
    //  * for Class-based VComponents:  a static '_translationBundleMap' PropertyDeclaration
    //    to be injected into the VComponent's ClassDeclaration, OR
    //  * for Function-based VComponents:  an ObjectLiteralExpression map to be added
    //    as an argument to the registerCustomElement call
    const bundleIds = getTranslationBundleIdsFromDependencies(vcompInfo, buildOptions, metaUtilObj);
    if (bundleIds) {
        let loaderImports;
        const loaderNames = [];
        // Given an array of bundleIds, we will generate:
        //
        //  * an array of import statements to be injected by the importTransfomer
        //    (e.g., ["import translationBundle_1 from '@oracle/oraclejet-preact/translationBundle';"])
        //
        //  * a mapping of bundles to loader function references as a ts.ObjectLiteralExpression
        //    (e.g., { "@oracle/oraclejet-preact": translationBundle_1 })
        //
        // NOTE1: We use loader function references of the format 'translationBundle_N' for compatibility
        //        with the JS emitted when compilerOptions.module === AMD
        //
        // NOTE2: If building AMD modules, the identifier for the default import of the loader function
        //        is actually 'translationBundle_N.default'
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
// Private functions
function isVCompBaseClassFound(typeRef, progImportMaps, checker) {
    let rtn = false;
    const exportToAlias = progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, typeRef);
    const baseClassName = (0, Utils_1.getTypeNameFromTypeReference)(typeRef);
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
/**
 * Returns an array of translation bundle IDs pulled from the VComponent's
 * dependencies metadata
 */
function getTranslationBundleIdsFromDependencies(vcompInfo, buildOptions, metaUtilObj) {
    let bundleIds;
    const bundleIdSet = new Set();
    const visitedDependencies = new Set();
    // Look in the declared chain of dependencies in the VComponent's containing Pack
    if (vcompInfo.packInfo?.dependencies &&
        vcompInfo.packInfo.dependencies !== JETComp_1.JETComp.DEPENDENCIES_TOKEN) {
        const depIds = getTranslationBundleIds(vcompInfo.packInfo.dependencies, buildOptions.dependenciesMap, visitedDependencies);
        for (const id of depIds) {
            bundleIdSet.add(id);
        }
    }
    // Look for any dependencies in the VComponent's Component-level metadata
    if (metaUtilObj.fullMetadata.dependencies) {
        const depIds = getTranslationBundleIds(metaUtilObj.fullMetadata.dependencies, buildOptions.dependenciesMap, visitedDependencies);
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
function getTranslationBundleIds(dependencies, depMap, visited) {
    const rtnIds = [];
    for (const depName of Object.keys(dependencies)) {
        if (!visited.has(depName)) {
            visited.add(depName); // skip if we encounter this dependency again
            // First look up the JETComp dependency in the map of installed Dependencies
            if (depMap.has(depName)) {
                const compDep = depMap.get(depName);
                if (compDep.translationBundle) {
                    rtnIds.push(compDep.translationBundle);
                }
                // Get the translationBundleIDs from any transitive dependencies as well
                if (compDep.dependencies && compDep.dependencies !== JETComp_1.JETComp.DEPENDENCIES_TOKEN) {
                    const subIds = getTranslationBundleIds(compDep.dependencies, depMap, visited);
                    for (const id of subIds) {
                        rtnIds.push(id);
                    }
                }
            }
            // Otherwise, if not found in the map of installed Dependencies, then
            // it might be a reference to a well-known core bundle, if which case
            // we already know the corresponding translationBundleID
            // (in case a VComponent developer does not use Component Exchange
            // and/or JET Tooling)
            else if (_CORE_BUNDLE_TO_T9N_ID_MAP.has(depName)) {
                rtnIds.push(_CORE_BUNDLE_TO_T9N_ID_MAP.get(depName));
            }
        }
    }
    return rtnIds;
}
/**
 * Returns information associated with the optional 'Options' argument of
 * registerCustomElement.  This includes:
 *  - property binding metadata
 *  - contexts metadata
 *  - DEPRECATED methods metadata (going forward, preference is to get this metadata
 *    from doclets on individual propertySignatures from the signaturesTypeNode)
 *
 * @param metadataNode node representing the 'Options' argument
 * @param vcompName the VCompnent name
 * @param compRegisterCall node representing the registerCustomElement call
 * @param fcomp node representing the Preact functional component impl
 * @param isForwarded is the Preact functional component impl wrapped in a 'forwardRef'?
 * @param checker TypeChecker instance
 * @returns MetaTypes.RegisteredOptions
 */
function getRegistrationOptions(metadataNode, vcompName, compRegisterCall, fcomp, isForwarded, checker) {
    const rtnRegisteredOptions = {};
    let methodsInfo;
    let signaturesTypeNode;
    let regMetadata;
    // Did the VComponent author supply a generic type parameter specifying
    // imperative method signatures?
    if (compRegisterCall.typeArguments?.length > 1) {
        signaturesTypeNode = compRegisterCall.typeArguments[1];
        // Does the Preact functional component implementation wrapped with
        // an inline 'forwardRef' call?
        if (isForwarded) {
            // Set up to return registered methods info
            methodsInfo = {
                signaturesTypeNode
            };
        }
        else {
            // Otherwise, throw an error indicating that we can't proceed without a Preact
            // functional component implementation wrapped in a forwardRef
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MISSING_FORWARDREF_WRAPPER, TransformerError_1.ExceptionType.THROW_ERROR, vcompName, `The Preact functional component that implements this VComponent with public methods must be wrapped inline with a 'forwardRef' call.`, fcomp);
        }
    }
    // Was optional 'Options' argument passed in?
    if (metadataNode) {
        // Read the optional metadata
        regMetadata = getRegisteredMetadataFromNode(metadataNode, checker);
        // DT methods metadata available?
        if (regMetadata.methods) {
            // If the functional VComponent was properly set up to support methods
            // (i.e., imperative handle function signatures passed as generic type parameter),
            // augment the methodsInfo with (deprecated) DT metadata
            if (methodsInfo) {
                methodsInfo.metadata = regMetadata.methods;
                methodsInfo.metadataNode = metadataNode;
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DEPRECATED_METHODS_METADATA, TransformerError_1.ExceptionType.LOG_WARNING, vcompName, `Passing 'methods' design-time metadata through the 'options' argument of the 'registerCustomElement' call is deprecated.
  Instead use standard doclets and @ojmetadata tags on individual properties of the type parameter referenced to map public method names to their function signatures.
  Metadata from standard doclets will take precedence over any 'methods' metadata passed in through the 'options' argument.`, metadataNode);
            }
            // Otherwise, if the VComponent author provided deprecated method metadata at registration
            // without providing a type parameter with method signatures, log a warning to the console
            else {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.MISSING_METHOD_SIGNATURES, TransformerError_1.ExceptionType.LOG_WARNING, vcompName, `The 'registerCustomElement' call is missing the generic type paramether with method signatures, so deprecated 'methods' metadata will be ignored.`, metadataNode);
            }
        }
        // Property binding metadata available?
        if (regMetadata.bindings) {
            rtnRegisteredOptions.bindings = regMetadata.bindings;
        }
        // Contexts metadata available?
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
    // inline object?
    if (ts.isObjectLiteralExpression(node)) {
        objLiteralNode = node;
    }
    // inline 'AsExpression'?
    else if (ts.isAsExpression(node) && ts.isObjectLiteralExpression(node.expression)) {
        objLiteralNode = node.expression;
    }
    // reference to constant?
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
    // Found ObjectLiteralExpression node with Options metadata?
    if (objLiteralNode) {
        // Loop through each property of the ObjectLiteralExpression
        //  - for properties like 'bindings' and 'methods', convert the initializer
        //    to an object and return it
        //  - for properties like 'contexts', return its initializer expression
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
    // The custom element name is specfied at VComponent registration
    // and is used to set the Component DT metadata 'name' property.
    // Therefore, any '@ojmetadata name ...' JSDoc annotations are redundant
    // and prone to error, so we ignore them.
    // Log a warning, but don't break the build!
    if (docletTagMetadata['name']) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_OJMETADATA_NAME, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'@ojmetadata name' annotations are ignored, and should be removed.`, compNode);
        delete docletTagMetadata['name']; // buh-bye...
    }
    // If the VComponent is a mono-pack, check for mismatches between component-level
    // annotations for version/jetVersion/license metadata (mono-pack metadata wins).
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
    // Get the containing JET Pack name (the 'pack' name in componentMetadata will
    // have come from the JET Pack's component.json file, and takes precedence).
    const packName = componentMetadata['pack'] ?? docletTagMetadata['pack'];
    if (packName) {
        if (docletTagMetadata['pack'] && packName !== docletTagMetadata['pack']) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INCONSISTENT_PACK_PACKNAME, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Inconsistent '@ojmetadata pack "${docletTagMetadata['pack']}"' annotation will be ignored, and should be removed.`, compNode);
            delete docletTagMetadata['pack'];
        }
        // If the VComponent is part of a JET Pack, then verify that its custom element name
        // begins with the pack name.  If not, report the error.
        //
        // NOTE:  The pack name prefix is kept as as part of the
        //        Component DT metadata 'name' property
        //        until JUST before we write out the JSON file!
        if (componentMetadata['name'].indexOf(packName) !== 0) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_ELEMENTNAME_IN_PACK, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Illegal custom element "${componentMetadata['name']}" included in JET Pack "${packName}".
  The custom element name must begin with the JET Pack name.`, compNode);
        }
        // If the VComponent is part of a mono-pack and a 'main' metadata property is explicitly
        // provided, perform some basic validation of its value.
        if (isInMonoPack && docletTagMetadata['main']) {
            const vcompName = componentMetadata['name'].substring(packName.length + 1);
            const mainRegex = new RegExp(`^${packName}\\/${vcompName}(\\/loader)?$`);
            if (docletTagMetadata['main'].match(mainRegex) === null) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.IGNORED_OJMETADATA_MAIN, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Invalid 'main' metadata value will be ignored: ${docletTagMetadata['main']}`, compNode);
                delete docletTagMetadata['main'];
            }
        }
    }
    // The VComponent custom element name without its first segment is the basis
    // for its interface name. Check whether this would result in an invalid
    // interface name (i.e., one that begins with a numeric character), as
    // this will cause our type definition generation logic to emit an invalid
    // d.ts file - detect it now, and fail early!
    const nameArray = metaUtilObj.fullMetadata['name'].split('-');
    const compPrefix = nameArray.shift();
    const compNameWithoutPrefix = nameArray.join('-');
    if (compNameWithoutPrefix.match(/^[0-9]/)) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_COMP_NAME_STARTING_WITH_NUMBER, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `The custom element name after the initial '${compPrefix}' prefix begins with an illegal numeric character:  '${compNameWithoutPrefix}'`, compNode);
    }
}
// Flags capturing potential functional VComponent type definition generation issues
const D_TS_GEN_OK = 0b0000;
const D_TS_GEN_NO_VARIABLE = 0b0001;
const D_TS_GEN_VARIABLE_IMPLICIT_TYPE = 0b0010;
const D_TS_GEN_PROPS_ALIAS_NOT_EXPORTED = 0b0100;
function checkForTypeDefinitionAdjustment(compName, functionalCompNode, varDecl, propsInfo) {
    let rtnNeedsAdjustment = false;
    // First, look for potential issues
    let dtsGenStatus = D_TS_GEN_OK;
    if (varDecl === undefined) {
        // i.e., registerCustomElement call is referenced in a ts.ExpressionStatement
        dtsGenStatus = dtsGenStatus | D_TS_GEN_NO_VARIABLE;
    }
    else if (varDecl.type === undefined &&
        !(varDecl.initializer && ts.isAsExpression(varDecl.initializer))) {
        // i.e., registerCustomElement call is referenced in a ts.VariableStatement,
        // and the variable is implicitly typed via type inference
        dtsGenStatus = dtsGenStatus | D_TS_GEN_VARIABLE_IMPLICIT_TYPE;
    }
    // Determine if this is a situation where there is a non-exported Props type alias
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
    // Determine whether we have an error condition - if not, then we may
    // need to signal that the dtsTransformer needs to adjust the definition of
    // the VComponent's SettableProperties interface.
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
/**
 * For a given ts.Node associated with a VComponent, find its parent directory and return
 * information about the containing JET Pack (either a standard pack or a mono-pack), or null
 * if there is no containing JET Pack.
 *
 * If this is the first time that we have encountered this parent directory during this
 * compilation, then look for a component.json file in the parent directory and check if
 * it is a standard JET Pack or mono-pack:
 *
 *    # if it is, add a JETComp instance to the cache in buildOptions and return it
 *    # if it is not, or if no component.json file exists in the parent directory,
 *      add a null to the cache in buildOptions and return the null to indicate that
 *      there is no containing JET Pack.
 *
 * @param elementName fullName of the VComponent custom element (e.g., "oj-c-avatar")
 * @param vcompNode AST Node associated with a VComponent
 * @param buildOptions BuildOptions for this compilation
 */
function getPackInfo(elementName, vcompNode, buildOptions) {
    let rtnPackInfo = null; // assume no containing JET Pack
    // Walk up from the vcompNode until we find its SourceFile
    let node = vcompNode;
    while (!ts.isSourceFile(node)) {
        node = node.parent;
    }
    const filename = node.fileName;
    // Given a normalized TS filename, get the platform-specific parent directory
    const parentDirPath = FileUtils.getParentDirPath(filename);
    if (parentDirPath) {
        // Check to see if a JETComp instance is already in the cache (may be null
        // if we have already determined that there is no JET Pack)
        if (buildOptions.parentDirToPackInfo?.hasOwnProperty(parentDirPath)) {
            const vcompPack = buildOptions.parentDirToPackInfo[parentDirPath];
            // If the specified VComponent is indeed included in the JET Pack,
            // return its JETComp instance.
            if (vcompPack?.isCompInPack(elementName, JETComp_1.ContentItemType.COMPONENT)) {
                rtnPackInfo = vcompPack;
            }
        }
        else {
            // Prepare a new entry for the cache
            let cacheItem = null;
            buildOptions.parentDirToPackInfo = buildOptions.parentDirToPackInfo || {};
            // Given the TypeScript parent directory path, get the component.json
            // object (or null if it does not exist)
            const packJsonObj = FileUtils.getComponentJSONObj(parentDirPath);
            if (packJsonObj) {
                const vcompPack = new JETComp_1.JETComp(packJsonObj);
                if (vcompPack.isJETPack()) {
                    // If we actually found a JET Pack, save the reference
                    // as a new cache entry...
                    cacheItem = vcompPack;
                    // ...and if the specified VComponent is indeed included
                    // in the JET Pack, return its JETComp instance.
                    if (vcompPack.isCompInPack(elementName, JETComp_1.ContentItemType.COMPONENT)) {
                        rtnPackInfo = vcompPack;
                    }
                }
            }
            // Add the new entry to the cache (even if null)
            buildOptions.parentDirToPackInfo[parentDirPath] = cacheItem;
        }
    }
    return rtnPackInfo;
}
/**
 * Analyzes the type of a possible registerCustomElement call that has been cast
 * through an AsExpression, to determine if this is really a VComponent.
 * This technique is used to preseve Function-based VComponent generics.
 *
 * @param typeNode TypeNode of the AsExpression
 * @param exportToAlias Map of symbols to local aliases
 * @param checker TS TypeChecker instance
 * @returns Information about Function-based VComp, or undefined if not a VComp
 */
function getAsCastInfo(typeNode, exportToAlias, checker) {
    let asCastInfo;
    // If this is a FunctionType, return it
    if (ts.isFunctionTypeNode(typeNode)) {
        asCastInfo = {
            typeNode
        };
        const propsNode = getPropsNodeFromCastSignature(typeNode, exportToAlias, checker);
        if (propsNode) {
            asCastInfo.propsNode = propsNode;
        }
    }
    // Otherwise, check for a TypeLiteral that is based upon
    // a Preact FunctionComponent, whose first member should be
    // a CallSignature
    else if (ts.isTypeLiteralNode(typeNode) &&
        typeNode.members.length > 0 &&
        ts.isCallSignatureDeclaration(typeNode.members[0])) {
        asCastInfo = {
            typeNode: typeNode.members[0]
        };
        const propsNode = getPropsNodeFromCastSignature(typeNode.members[0], exportToAlias, checker);
        if (propsNode) {
            asCastInfo.propsNode = propsNode;
        }
        // Check for an optional 'displayName' Property
        // on the TypeLiteral and return its value
        const propNode = typeNode.members?.[1];
        if (propNode &&
            ts.isPropertySignature(propNode) &&
            propNode.name.getText() === 'displayName' &&
            propNode.type &&
            ts.isLiteralTypeNode(propNode.type) &&
            ts.isLiteralExpression(propNode.type.literal)) {
            asCastInfo.displayName = (0, Utils_1.trimQuotes)(propNode.type.literal.getText());
        }
    }
    return asCastInfo;
}
function getPropsNodeFromCastSignature(signatureNode, exportToAlias, checker) {
    let propsNode;
    // 'Props' will be the first parameter of the specified function signature
    let propsParamTypeNode = signatureNode.parameters[0]?.type;
    if (propsParamTypeNode) {
        // We need the TypeReferenceNode for 'Props', but this typeNode
        // might be an IntersectionTypeNode for use cases where we needed to bypass
        // the forwardRef call and directly add a 'ref' property via intersection
        // with a TypeLiteral node
        const propsTypeReference = ts.isTypeReferenceNode(propsParamTypeNode)
            ? propsParamTypeNode
            : ts.isIntersectionTypeNode(propsParamTypeNode)
                ? propsParamTypeNode.types.find((t) => ts.isTypeReferenceNode(t))
                : undefined;
        // The propsTypeReference is still not quite what we want, as the 'Props'
        // reference will have been wrapped by the ExtendGlobalProps helper type
        if (propsTypeReference &&
            (0, Utils_1.getTypeNameFromTypeReference)(propsTypeReference) === exportToAlias.ExtendGlobalProps) {
            propsNode = propsTypeReference.typeArguments?.[0];
            // For our use cases, ExtendGlobalProps will always wrap a reference to 'Props', but
            // that reference may be indirect (i.e., 'ComponentProps<typeof PreactImpl>')
            if (ts.isTypeReferenceNode(propsNode)) {
                const propsRefName = (0, Utils_1.getTypeNameFromTypeReference)(propsNode);
                if (propsRefName === exportToAlias.ComponentProps) {
                    const compPropsNode = propsNode.typeArguments?.[0];
                    if (ts.isTypeQueryNode(compPropsNode)) {
                        const implSignatures = checker.getSignaturesOfType(checker.getTypeAtLocation(compPropsNode), ts.SignatureKind.Call);
                        const implPropsSymbol = implSignatures?.[0]?.parameters[0];
                        const implPropsDecl = implPropsSymbol?.declarations?.[0];
                        if (implPropsDecl?.type && ts.isTypeReferenceNode(implPropsDecl.type)) {
                            propsNode = implPropsDecl.type;
                        }
                        else {
                            propsNode = undefined; // just in case...
                        }
                    }
                    else {
                        propsNode = undefined; // just in case...
                    }
                }
            }
        }
    }
    return propsNode;
}
//# sourceMappingURL=MetadataComponentUtils.js.map