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
exports.default = transformer;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const MetaTypes = __importStar(require("./utils/MetadataTypes"));
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
const ComponentUtils = __importStar(require("./utils/MetadataComponentUtils"));
const PropertyUtils = __importStar(require("./utils/MetadataPropertyUtils"));
const SlotUtils = __importStar(require("./utils/MetadataSlotUtils"));
const TypeUtils = __importStar(require("./utils/MetadataTypeUtils"));
const MethodUtils = __importStar(require("./utils/MetadataMethodUtils"));
const FileUtils = __importStar(require("./shared/MetadataFileUtils"));
const DecoratorUtils_1 = require("./shared/DecoratorUtils");
const DefaultProps_1 = require("./shared/DefaultProps");
const ImportMaps_1 = require("./shared/ImportMaps");
const Utils_1 = require("./shared/Utils");
const TransformerError_1 = require("./utils/TransformerError");
const ApiDocFileUtils_1 = require("./utils/ApiDocFileUtils");
let _BUILD_OPTIONS;
let _CHECKER;
let _COMPILER_OPTIONS;
let _CORE_JET_MODULE_MAPPING;
/**
 * Transformer run over the TypeScript AST to generate the metadata used
 * at runtime, for component.json and downstream dependencies generating
 * additional Element and JSX types.
 * @param program
 * @param buildOptions
 */
function transformer(program, buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    _CHECKER = program.getTypeChecker();
    _COMPILER_OPTIONS = program.getCompilerOptions();
    _CORE_JET_MODULE_MAPPING = new Map();
    _BUILD_OPTIONS.programImportMaps = new ImportMaps_1.ImportMaps();
    _BUILD_OPTIONS.dependenciesMap = FileUtils.getInstalledDependenciesMap(program);
    function visitor(ctx, sf) {
        // Initialize list of disabled ExceptionKeys
        TransformerError_1.TransformerError.setDisabledList(!(_BUILD_OPTIONS.disabledExceptionKeys?.length > 0)
            ? null
            : _BUILD_OPTIONS.disabledExceptionKeys);
        // Initialize prettier Transformer error/warning messages
        // based upon tsconfig.compilerOptions
        TransformerError_1.TransformerError.initPrettyMsgEncoding(_COMPILER_OPTIONS.pretty);
        _BUILD_OPTIONS.componentToMetadata = null;
        _BUILD_OPTIONS.importMaps = null;
        if (_BUILD_OPTIONS['debug'])
            console.log(`${sf.fileName}: processing metadata...`);
        const visitor = (node) => {
            if (ts.isImportDeclaration(node)) {
                storeImport(node, _BUILD_OPTIONS.programImportMaps, path.dirname(sf.fileName));
                return node;
            }
            else if (ts.isClassDeclaration(node)) {
                const classNode = node;
                // We don't care about child nodes of classes that do NOT turn out to be
                // VComponent subclasses, so don't bother calling ts.visitEachChild() for them
                return generateClassElementMetadata(classNode, _BUILD_OPTIONS.programImportMaps);
            }
            else if ((ts.isVariableStatement(node) || ts.isExpressionStatement(node)) &&
                ts.isSourceFile(node.parent) &&
                path.extname(node.parent.fileName) === '.tsx') {
                // We don't care about child nodes of top-level (i.e., parent === SourceFile)
                // Variable or Expression statements that are NOT VComponents,
                // so don't bother calling ts.visitEachChild() for them
                return generateFunctionalElementMetadata(node, _BUILD_OPTIONS.programImportMaps);
            }
            // Otherwise call visitEachChild for the current node
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return ((sf) => ts.visitNode(sf, visitor(ctx, sf)));
    };
}
function generateClassElementMetadata(classNode, progImportMaps) {
    if (!classNode.heritageClauses) {
        return classNode;
    }
    const exportToAlias = progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, classNode);
    const custElemDecorator = (0, DecoratorUtils_1.getDecorator)(classNode, exportToAlias.customElement);
    if (!custElemDecorator) {
        // We don't need to generate anything for non custom element Preact components
        return classNode;
    }
    // @customElement('oj-avatar')
    // The TypeScript compiler will prevent this required parameter from being empty
    let elementName = custElemDecorator.expression['arguments'][0].text;
    let vcompClassInfo = ComponentUtils.getVCompClassInfo(elementName, classNode, progImportMaps, _CHECKER, _BUILD_OPTIONS);
    // Don't proceed if class does not extend Preact component class
    if (!vcompClassInfo || !vcompClassInfo.className) {
        return classNode;
    }
    const metaUtilObj = getNewMetaUtilObj(_CHECKER, _BUILD_OPTIONS, vcompClassInfo, progImportMaps);
    // Custom element specific metadata that we want at the top
    ComponentUtils.getDtMetadataForComponent(vcompClassInfo, metaUtilObj);
    // Add any translation bundle information to the vcompClassInfo
    const { loaderImports, bundleMapExpression } = ComponentUtils.getTranslationBundleInfo(vcompClassInfo, _COMPILER_OPTIONS, _BUILD_OPTIONS, metaUtilObj) || {};
    if (loaderImports && bundleMapExpression) {
        vcompClassInfo.additionalImports = loaderImports;
        vcompClassInfo.translationBundleMapExpression = bundleMapExpression;
    }
    const propsInfo = vcompClassInfo.propsInfo;
    if (ts.isSourceFile(classNode.parent)) {
        const fileName = classNode.parent.fileName;
        metaUtilObj.fullMetadata['jsdoc'] = metaUtilObj.fullMetadata['jsdoc'] || {};
        metaUtilObj.fullMetadata['jsdoc']['meta'] = {
            filename: path.basename(fileName),
            path: path.dirname(fileName)
        };
    }
    // Stash away compiler-only metadata about the component class
    MetaUtils.updateCompilerCompMetadata(vcompClassInfo, metaUtilObj);
    if (propsInfo) {
        if (!propsInfo.propsName) {
            // Component type argument is expected to be a named Class/Type/Interface
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_PROPS_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, vcompClassInfo.className, "Invalid Component 'Props' argument type -- must be a Class, Interface, or Type reference.", propsInfo.propsNode);
        }
        else if (MetaUtils.isConditionalType(propsInfo.propsType)) {
            // If the Props type turns out to be a ConditionalType, fail the build!
            // While we can handle individual PropertySignatures declared with
            // ConditionalTypes, we are not currently set up to deal with Props
            // being defined with a ConditionalType (for example:  common properties
            // in the different paths of the ConditionalType appear as property Symbols
            // without a valueDeclaration, but with multiple entries in their "declarations"
            // array.)
            // We can consider relaxing this restriction in a later release...
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.CONDITIONAL_PROPS_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, vcompClassInfo.className, `The Component 'Props' object cannot be declared as a Conditional type.
  Instead, declare individual properties of the 'Props' object with Conditional types.`, propsInfo.propsNode);
        }
        // If a Props class is imported and is not used at
        // run time, typescript will strip out the import which
        // we will add back in our after transformer, but we need
        // to stash a map here to pass to it
        PropertyUtils.checkReservedProps(propsInfo, metaUtilObj);
        let { readOnlyPropNameNodes, writebackPropNameNodes } = PropertyUtils.generatePropertiesMetadata(propsInfo, metaUtilObj);
        PropertyUtils.generatePropertiesRtExtensionMetadata(writebackPropNameNodes, readOnlyPropNameNodes, propsInfo.propsRtObservedGlobalPropsSet, metaUtilObj);
        // Validate dynamic slot property metadata, plus make any last minute additions
        // and adjustments to the list of template slots passed to the dtsTransformer
        SlotUtils.validateDynamicSlots(metaUtilObj);
        MetaUtils.updateCompilerPropsMetadata(readOnlyPropNameNodes, metaUtilObj);
    }
    // Store imports for aliased decorators, types, etc. associated with the
    // VComponent .tsx used by downstream transformers
    storeImportsInBuildOptions(classNode, progImportMaps);
    // Walk class elements to generate method AND default value metadata
    // All JET custom elements expose standard methods for getting/setting properties.
    // The bridge knows they're there, so we don't need them in the RT metadata,
    // but for backwards compatibility where all Composite-based components add these methods
    // via the jsDoc plugin from their API doc, we will include
    // them in the generated DT metadata JSON.
    metaUtilObj.fullMetadata.methods = {};
    walkClassElements(classNode, WALK_CLASS.ALL, metaUtilObj);
    // move the standard get/setProperty methods to the end
    MethodUtils.updateJetElementMethods(metaUtilObj);
    // generate the jsdoc metadata and add to MetaUtilObj
    (0, ApiDocFileUtils_1.generateApiDocMetadata)(metaUtilObj, _BUILD_OPTIONS);
    // We use the build options to pass metadata and other info across transformers
    // (including the dtsTransformer)
    storeMetadataInBuildOptions(metaUtilObj);
    writeMetaFiles(metaUtilObj);
    return MetaUtils.addMetadataToClassNode(vcompClassInfo, metaUtilObj.rtMetadata);
}
function generateFunctionalElementMetadata(functionalCompNode, progImportMaps) {
    let vcompFunctionInfo = ComponentUtils.getVCompFunctionInfo(functionalCompNode, progImportMaps, _CHECKER, _BUILD_OPTIONS);
    if (vcompFunctionInfo) {
        const metaUtilObj = getNewMetaUtilObj(_CHECKER, _BUILD_OPTIONS, vcompFunctionInfo, progImportMaps);
        // Custom element specific metadata that we want at the top
        ComponentUtils.getDtMetadataForComponent(vcompFunctionInfo, metaUtilObj);
        // Add any translation bundle information to the vcompFunctionInfo
        const { loaderImports, bundleMapExpression } = ComponentUtils.getTranslationBundleInfo(vcompFunctionInfo, _COMPILER_OPTIONS, _BUILD_OPTIONS, metaUtilObj) || {};
        if (loaderImports && bundleMapExpression) {
            vcompFunctionInfo.additionalImports = loaderImports;
            vcompFunctionInfo.translationBundleMapExpression = bundleMapExpression;
        }
        if (ts.isSourceFile(functionalCompNode.parent)) {
            const fileName = functionalCompNode.parent.fileName;
            metaUtilObj.fullMetadata['jsdoc'] = metaUtilObj.fullMetadata['jsdoc'] || {};
            metaUtilObj.fullMetadata['jsdoc']['meta'] = {
                filename: path.basename(fileName),
                path: path.dirname(fileName)
            };
        }
        // Stash away compiler-only metadata about the functional component
        MetaUtils.updateCompilerCompMetadata(vcompFunctionInfo, metaUtilObj);
        const propsInfo = vcompFunctionInfo.propsInfo;
        if (propsInfo) {
            if (!propsInfo.propsName) {
                // Component type argument is expected to be a named Class/Type/Interface
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_PROPS_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, "Invalid Component 'Props' argument type -- must be a Class, Interface, or Type reference.", propsInfo.propsNode);
            }
            PropertyUtils.checkReservedProps(propsInfo, metaUtilObj);
            let { readOnlyPropNameNodes, writebackPropNameNodes } = PropertyUtils.generatePropertiesMetadata(propsInfo, metaUtilObj);
            PropertyUtils.generatePropertiesRtExtensionMetadata(writebackPropNameNodes, readOnlyPropNameNodes, propsInfo.propsRtObservedGlobalPropsSet, metaUtilObj);
            // Validate dynamic slot property metadata, plus make any last minute additions
            // and adjustments to the list of template slots passed to the dtsTransformer
            SlotUtils.validateDynamicSlots(metaUtilObj);
            MetaUtils.updateCompilerPropsMetadata(readOnlyPropNameNodes, metaUtilObj);
        }
        // Store imports for aliased decorators, types, etc. associated with the
        // VComponent .tsx used by downstream transformers
        storeImportsInBuildOptions(functionalCompNode, progImportMaps);
        // All JET custom elements expose standard methods for getting/setting properties.
        // The bridge knows they're there, so we don't need them in the RT metadata,
        // but for backwards compatibility where all Composite-based components add these methods
        // via the jsDoc plugin from their API doc, we will include
        // them in the generated DT metadata JSON.
        metaUtilObj.fullMetadata.methods = {};
        if (vcompFunctionInfo.methodsInfo) {
            MethodUtils.processRegisteredMethodsInfo(vcompFunctionInfo.methodsInfo, metaUtilObj);
        }
        MethodUtils.updateJetElementMethods(metaUtilObj);
        // If default values for Properties were specified,
        // generate the corresponding metadata
        if (vcompFunctionInfo.defaultProps) {
            PropertyUtils.updateDefaultsFromDefaultProps(vcompFunctionInfo.defaultProps, metaUtilObj);
        }
        // generate the jsdoc metadata and add to MetaUtilObj
        (0, ApiDocFileUtils_1.generateApiDocMetadata)(metaUtilObj, _BUILD_OPTIONS);
        // We use the build options to pass metadata and other info across transformers
        // (including the dtsTransformer)
        storeMetadataInBuildOptions(metaUtilObj);
        writeMetaFiles(metaUtilObj);
        // Return an updated functional VComponent node, where additional arguments are injected
        // into the component registration call, etc.
        return MetaUtils.updateFunctionalVCompNode(functionalCompNode, vcompFunctionInfo, metaUtilObj);
    }
    return functionalCompNode;
}
var WALK_CLASS;
(function (WALK_CLASS) {
    WALK_CLASS[WALK_CLASS["ALL"] = 0] = "ALL";
    WALK_CLASS[WALK_CLASS["METHODS_ONLY"] = 1] = "METHODS_ONLY"; // == 1
})(WALK_CLASS || (WALK_CLASS = {}));
/**
 * Walk class elements, generating metadata for methods and default values
 * @param members
 * @param metaUtilObj
 */
function walkClassElements(classNode, walkElements, metaUtilObj) {
    // Walk up the class hierarchy, looking for methods
    let heritageClauses = classNode.heritageClauses;
    for (let clause of heritageClauses) {
        for (let typeNode of clause.types) {
            const baseClassName = (0, Utils_1.getTypeNameFromTypeReference)(typeNode);
            const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, typeNode);
            if (baseClassName !== exportToAlias.Component &&
                baseClassName !== exportToAlias.PureComponent) {
                const baseClassDecl = TypeUtils.getNodeDeclaration(typeNode, metaUtilObj.typeChecker);
                if (ts.isClassDeclaration(baseClassDecl)) {
                    walkClassElements(baseClassDecl, WALK_CLASS.METHODS_ONLY, metaUtilObj);
                }
            }
        }
    }
    // Process the members of the current class, looking for methods
    // and (optionally) default values.
    const members = classNode.members;
    members.forEach((member) => {
        if (MethodUtils.isCustomElementClassMethod(member, metaUtilObj)) {
            MethodUtils.generateClassMethodMetadata(member, metaUtilObj);
        }
        else if (walkElements !== WALK_CLASS.METHODS_ONLY && (0, DefaultProps_1.isDefaultPropsClassElement)(member)) {
            const defaultProps = (0, DefaultProps_1.getDefaultPropsFromSource)(member);
            if (defaultProps) {
                PropertyUtils.updateDefaultsFromDefaultProps(defaultProps, metaUtilObj);
            }
        }
    });
}
function writeApiDocFiles(apidocResult, componentName) {
    const apiDocDir = _BUILD_OPTIONS.apiDocDir;
    if (!fs.existsSync(apiDocDir)) {
        fs.mkdirSync(apiDocDir, { recursive: true });
    }
    const apiDocForComponent = `${apiDocDir}/${componentName}.json`;
    fs.writeFileSync(apiDocForComponent, JSON.stringify(apidocResult, null, 2));
}
function writeMetaFiles(metaUtilObj) {
    MetaUtils.pruneCompilerMetadata(metaUtilObj);
    const dtDir = _BUILD_OPTIONS.dtDir;
    if (!fs.existsSync(dtDir)) {
        fs.mkdirSync(dtDir, { recursive: true });
    }
    const metaFileName = `${dtDir}/${metaUtilObj.fullMetadata.name}.json`;
    // custom-tsc processing depends upon metaUtilObj.fullMetadata.name
    // being set to the custom element tag name.
    //
    // Writing out the metadata file is one of our last tasks, and happens
    // AFTER we've stashed a copy in BuildOptions (where it is picked up by
    // subsequent transformers).
    //
    // If the VComponent is part of a JET Pack, then we need to make a final
    // adjustment BEFORE saving the DT metadata file:  we need to strip
    // the pack name prefix from the 'name' DT metadata property!
    const componentMetadata = metaUtilObj.fullMetadata;
    if (componentMetadata['pack'] &&
        componentMetadata['name'].indexOf(componentMetadata['pack']) === 0 &&
        componentMetadata['name'].length > componentMetadata['pack'].length) {
        metaUtilObj.fullMetadata.name = componentMetadata['name'].replace(`${componentMetadata['pack']}-`, '');
    }
    fs.writeFileSync(metaFileName, JSON.stringify(metaUtilObj.fullMetadata, null, 2));
}
function storeMetadataInBuildOptions(metaUtilObj) {
    if (!_BUILD_OPTIONS.componentToMetadata) {
        _BUILD_OPTIONS.componentToMetadata = {};
    }
    _BUILD_OPTIONS.componentToMetadata[metaUtilObj.componentName] = JSON.parse(JSON.stringify(metaUtilObj.fullMetadata));
    //store apidoc doclets in global BuildOptions
    if (metaUtilObj.apidoc) {
        if (!_BUILD_OPTIONS.componentToApiDoc) {
            _BUILD_OPTIONS.componentToApiDoc = {};
        }
        _BUILD_OPTIONS.componentToApiDoc[metaUtilObj.componentName] = JSON.parse(JSON.stringify(metaUtilObj.apidoc));
    }
}
function storeImportsInBuildOptions(componentNode, progImportMaps) {
    _BUILD_OPTIONS.importMaps = progImportMaps.getComponentImportMaps(componentNode);
}
// Array of named Export Types (which might be aliased...)
// that, if present, should be excluded when walking
// Type members
const _EXCLUDED_NAMED_EXPORT_TYPES = ['ObservedGlobalProps'];
function getNewMetaUtilObj(typeChecker, buildOptions, componentInfo, progImportMaps) {
    // Look for a list of reserved global property names -- it's needed to check for
    // illegal custom property names.  If we don't yet have the list, then generate it
    // just once and squirrel it away for the benefit of all VComponents in the current build.
    if (!buildOptions['reservedGlobalProps']) {
        const RGPSet = generateReservedGlobalPropsSet(componentInfo, typeChecker);
        if (RGPSet) {
            buildOptions['reservedGlobalProps'] = RGPSet;
        }
    }
    // Look for a Set of legacy JET components that have WebElement test adapters.
    // If we don't have it, initialize it and squirrel it away for all other VComponents
    // in the current build.
    if (!buildOptions['legacyWebElementSet']) {
        buildOptions['legacyWebElementSet'] = buildOptions['coreJetBuildOptions']?.legacyWebElements
            ? new Set(buildOptions['coreJetBuildOptions'].legacyWebElements)
            : new Set();
    }
    const componentName = MetaTypes.isClassInfo(componentInfo)
        ? componentInfo.className
        : componentInfo.componentName ?? componentInfo.functionName ?? componentInfo.elementName;
    const isInMonoPack = componentInfo.packInfo?.isMonoPack();
    // create a core metaUtilObj structure
    let rtnObj = MetaUtils.MetaUtilObjFactory.create(_CHECKER, componentName, componentInfo, progImportMaps);
    // Full metadata includes RT and DT and will get written out to a component.json file.
    // If the VComponent is contained within a mono-pack, then version/jetVersion are inherited
    //  from the mono-pack; otherwise initialize from buildOptions.
    rtnObj.fullMetadata = {
        name: componentInfo.elementName,
        version: isInMonoPack ? componentInfo.packInfo.version : buildOptions['version'],
        jetVersion: isInMonoPack && componentInfo.packInfo.jetVersion
            ? componentInfo.packInfo.jetVersion
            : buildOptions['jetVersion'],
        type: buildOptions['coreJetBuildOptions']?.defaultCompType ?? 'composite'
    };
    rtnObj.followImports = buildOptions['followImports'];
    rtnObj.debugMode = buildOptions['debug'] || false;
    rtnObj.coreJetModuleMapping = _CORE_JET_MODULE_MAPPING;
    rtnObj.excludedTypes = new Set(_EXCLUDED_NAMED_EXPORT_TYPES);
    // Is the VComponent contained within a JET Pack?
    if (componentInfo.packInfo) {
        // Initialize the 'pack' name, regardless of whether it's a standard JET Pack
        // of a mono-pack.
        rtnObj.fullMetadata.pack = componentInfo.packInfo.name;
        // If within a mono-pack, inherit any 'dependencyScope' or 'license' metadata
        // from the mono-pack.
        if (isInMonoPack) {
            if (componentInfo.packInfo.dependencyScope) {
                rtnObj.fullMetadata['dependencyScope'] = componentInfo.packInfo.dependencyScope;
            }
            if (componentInfo.packInfo.license) {
                rtnObj.fullMetadata.license = componentInfo.packInfo.license;
            }
        }
    }
    // If this is a 'core' JET component (i.e., a "legacy JET VComponent"), then:
    //
    //    * it must have runtime dependency scope
    //    * it does NOT provide its export symbol name
    //
    if (rtnObj.fullMetadata.type === 'core') {
        rtnObj.fullMetadata['dependencyScope'] = 'runtime';
    }
    // TODO JET-75283 Enable 'export' metadata when Value-based elements officially supported
    /*
    else {
      // Get the export symbol name for this VComponent
      // NOTE:  If no valid export symbol name, then consumers of this VComponent
      //        will have to assume that only its Intrinsic Element API is
      //        available!
      rtnObj.fullMetadata['export'] = MetaTypes.isClassInfo(componentInfo)
        ? componentInfo.className
        : componentInfo.componentName;
    }
    */
    if (componentInfo.propsInfo?.propsName) {
        rtnObj.propsName = componentInfo.propsInfo.propsName;
    }
    if (buildOptions['reservedGlobalProps']) {
        rtnObj.reservedGlobalProps = buildOptions['reservedGlobalProps'];
    }
    if (buildOptions['legacyWebElementSet']) {
        rtnObj.coreJetWebElementSet = buildOptions['legacyWebElementSet'];
    }
    return rtnObj;
}
function generateReservedGlobalPropsSet(componentInfo, checker) {
    let rtnReservedGlobalProps;
    let GPType;
    let EGPRef = componentInfo.propsInfo?.propsExtendGlobalPropsRef;
    // Given an ExtendGlobalProps (EGP) reference, we can find the
    // GlobalProps (GP) type based upon the ExtendGlobalProps definition:
    //
    //    export type ExtendGlobalProps<Props> = Readonly<Props> & GlobalProps;
    //
    if (EGPRef) {
        const EGPtypeArg = EGPRef.typeArguments[0];
        if (EGPtypeArg) {
            // First, get the parameter passed to this ExtendGlobalProps reference
            const EGPparamType = checker.getTypeAtLocation(EGPtypeArg);
            const EGPparamName = TypeUtils.getTypeNameFromType(EGPparamType);
            // Now get the ExtendGlobalProps type itself (which should be
            // defined as an Intersection)
            const EGPType = checker.getTypeFromTypeNode(EGPRef);
            if (EGPType.isIntersection()) {
                const types = EGPType.types;
                // Loop through the types that make up the ExtendGlobalProps type,
                // checking their aliasTypeArguments
                for (let i = 0; i < types.length; i++) {
                    const aliasTypeArg = types[i].aliasTypeArguments[0];
                    // If the aliasTypeArg does NOT match the ExtendGlobalProps parameter,
                    // then it MUST be the GlobalProps type
                    if (aliasTypeArg && EGPparamName !== TypeUtils.getTypeNameFromType(aliasTypeArg)) {
                        GPType = aliasTypeArg;
                        break;
                    }
                }
            }
        }
    }
    // Alternatively, if this is a functional VComponent with custom properties,
    // then find the GlobalProps type via the registerCustomElement call's return type.
    else if (MetaTypes.isFunctionInfo(componentInfo) && componentInfo.propsInfo) {
        // The registerCustomElement call has a return type of 'ComponentType<ExtendGlobalProps<P>>'
        const regCustElemType = checker.getTypeAtLocation(componentInfo.compRegisterCall);
        const EGPType = regCustElemType.aliasTypeArguments?.[0];
        // Because we are not navigating to the ExtendGlobalProps type from a TypeReferenceNode,
        // we don't have the luxury of validating which of the types that make up the
        // ExtendGlobalProps intersection is actually the GlobalProps type, by cross-checking
        // with the Props type name (as we do above...)
        // Therefore, we will just assume that GlobalProps is the second type of the intersection.
        // NOTE:  Since we are dealing with ts.Types as opposed to ts.TypeNodes,
        //        any import aliases have been resolved, so we need to test directly
        //        for "ExtendGlobalProps"!
        if (EGPType &&
            EGPType.aliasSymbol?.getName() === 'ExtendGlobalProps' &&
            EGPType.isIntersection() &&
            EGPType.types.length === 2) {
            GPType = EGPType.types[1];
        }
    }
    // If we have found the GlobalProps type, loop over its properties
    // to populate the list of reserved global property names
    if (GPType) {
        const GPSymbols = GPType.getProperties();
        rtnReservedGlobalProps = new Set();
        for (let symbol of GPSymbols) {
            rtnReservedGlobalProps.add(symbol.getName());
        }
    }
    return rtnReservedGlobalProps;
}
function storeImport(node, progImportMaps, fileName) {
    const bindings = node.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
        for (let binding of bindings.elements) {
            const namedImport = binding.name.text;
            // A renamed imported class/method/type will have the original name in propertyName
            const decrName = (binding.propertyName || binding.name).text;
            const module = (0, Utils_1.trimQuotes)(node.moduleSpecifier.getText());
            // Store two-way bindings of imports to aliases for the current source file as needed
            progImportMaps.registerMapping(node, module, decrName, binding.name.text);
            // if we have core JET API imported create a map of their import name (or alias) and the module is coming from
            // it is used in the typedef lookup part (MetadataTypeUtils.getPossibleTypeDef)
            if (isCoreJetModule(module) && !_CORE_JET_MODULE_MAPPING.has(namedImport)) {
                // store only the module without the ojs path mapping
                _CORE_JET_MODULE_MAPPING.set(namedImport, {
                    binding: decrName,
                    module: module.split('/')[1],
                    fileName
                });
            }
        }
    }
    else {
        // if it's a default import, still want to add to the core jet module map so that we can determine if a type is a core Jet type
        // when creating TypeDefs
        const defaultImport = node.importClause?.name?.getText();
        const module = (0, Utils_1.trimQuotes)(node.moduleSpecifier.getText());
        // if we have core JET API imported create a map of their import name (or alias) and the module is coming from
        // it is used in the typedef lookup part (MetadataTypeUtils.getPossibleTypeDef)
        if (isCoreJetModule(module) && !_CORE_JET_MODULE_MAPPING.has(defaultImport)) {
            // store only the module without the ojs path mapping
            _CORE_JET_MODULE_MAPPING.set(defaultImport, {
                binding: defaultImport,
                module: module.split('/')[1],
                fileName
            });
        }
    }
}
function isCoreJetModule(module) {
    return module.startsWith('ojs/oj');
}
//# sourceMappingURL=metadataTransformer.js.map