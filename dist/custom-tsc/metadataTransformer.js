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
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const MetaTypes = __importStar(require("./utils/MetadataTypes"));
const ApiDocUtils = __importStar(require("./utils/ApiDocUtils"));
const DecoratorUtils = __importStar(require("./utils/DecoratorUtils"));
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
const ComponentUtils = __importStar(require("./utils/MetadataComponentUtils"));
const PropertyUtils = __importStar(require("./utils/MetadataPropertyUtils"));
const SlotUtils = __importStar(require("./utils/MetadataSlotUtils"));
const TypeUtils = __importStar(require("./utils/MetadataTypeUtils"));
const MethodUtils = __importStar(require("./utils/MetadataMethodUtils"));
const FileUtils = __importStar(require("./utils/MetadataFileUtils"));
const TransformerError_1 = require("./utils/TransformerError");
let _BUILD_OPTIONS;
let _CHECKER;
let _COMPILER_OPTIONS;
let _CORE_JET_MODULE_MAPPING;
function transformer(program, buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    _CHECKER = program.getTypeChecker();
    _COMPILER_OPTIONS = program.getCompilerOptions();
    _CORE_JET_MODULE_MAPPING = new Map();
    _BUILD_OPTIONS.programImportMaps = new MetaTypes.VCompImportMaps();
    _BUILD_OPTIONS.dependencyPackMap = FileUtils.getInstalledDependenciesPackMap(program);
    function visitor(ctx, sf) {
        TransformerError_1.TransformerError.setDisabledList(!(_BUILD_OPTIONS.disabledExceptionKeys?.length > 0)
            ? null
            : _BUILD_OPTIONS.disabledExceptionKeys);
        TransformerError_1.TransformerError.initPrettyMsgEncoding(_COMPILER_OPTIONS.pretty);
        _BUILD_OPTIONS.componentToMetadata = null;
        _BUILD_OPTIONS.importMaps = null;
        if (_BUILD_OPTIONS['debug'])
            console.log(`${sf.fileName}: processing metadata...`);
        const visitor = (node) => {
            if (ts.isImportDeclaration(node)) {
                storeImport(node, _BUILD_OPTIONS.programImportMaps);
                return node;
            }
            else if (ts.isClassDeclaration(node)) {
                const classNode = node;
                return generateClassElementMetadata(classNode, _BUILD_OPTIONS.programImportMaps);
            }
            else if ((ts.isVariableStatement(node) || ts.isExpressionStatement(node)) &&
                ts.isSourceFile(node.parent) &&
                path.extname(node.parent.fileName) === '.tsx') {
                return generateFunctionalElementMetadata(node, _BUILD_OPTIONS.programImportMaps);
            }
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return ((sf) => ts.visitNode(sf, visitor(ctx, sf)));
    };
}
exports.default = transformer;
function generateClassElementMetadata(classNode, progImportMaps) {
    if (!classNode.heritageClauses) {
        return classNode;
    }
    const exportToAlias = progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, classNode);
    const custElemDecorator = DecoratorUtils.getDecorator(classNode, exportToAlias.customElement);
    if (!custElemDecorator) {
        return classNode;
    }
    let elementName = custElemDecorator.expression['arguments'][0].text;
    let vcompClassInfo = ComponentUtils.getVCompClassInfo(elementName, classNode, progImportMaps, _CHECKER, _BUILD_OPTIONS);
    if (!vcompClassInfo || !vcompClassInfo.className) {
        return classNode;
    }
    const metaUtilObj = getNewMetaUtilObj(_CHECKER, _BUILD_OPTIONS, vcompClassInfo, progImportMaps);
    ComponentUtils.getDtMetadataForComponent(vcompClassInfo, metaUtilObj);
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
    MetaUtils.updateCompilerCompMetadata(vcompClassInfo, metaUtilObj);
    if (propsInfo) {
        if (!propsInfo.propsName) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_PROPS_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, vcompClassInfo.className, "Invalid Component 'Props' argument type -- must be a Class, Interface, or Type reference.", propsInfo.propsNode);
        }
        else if (MetaUtils.isConditionalType(propsInfo.propsType)) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.CONDITIONAL_PROPS_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, vcompClassInfo.className, `The Component 'Props' object cannot be declared as a Conditional type.
  Instead, declare individual properties of the 'Props' object with Conditional types.`, propsInfo.propsNode);
        }
        PropertyUtils.checkReservedProps(propsInfo, metaUtilObj);
        let { readOnlyPropNameNodes, writebackPropNameNodes } = PropertyUtils.generatePropertiesMetadata(propsInfo, metaUtilObj);
        PropertyUtils.generatePropertiesRtExtensionMetadata(writebackPropNameNodes, readOnlyPropNameNodes, propsInfo.propsRtObservedGlobalPropsSet, metaUtilObj);
        SlotUtils.validateDynamicSlots(metaUtilObj);
        MetaUtils.updateCompilerPropsMetadata(readOnlyPropNameNodes, metaUtilObj);
    }
    storeImportsInBuildOptions(classNode, progImportMaps);
    metaUtilObj.fullMetadata.methods = {};
    walkClassElements(classNode, WALK_CLASS.ALL, metaUtilObj);
    MethodUtils.updateJetElementMethods(metaUtilObj);
    storeMetadataInBuildOptions(metaUtilObj);
    generateApiDocMetadata(metaUtilObj);
    writeMetaFiles(metaUtilObj);
    return MetaUtils.addMetadataToClassNode(vcompClassInfo, metaUtilObj.rtMetadata);
}
function generateFunctionalElementMetadata(functionalCompNode, progImportMaps) {
    let vcompFunctionInfo = ComponentUtils.getVCompFunctionInfo(functionalCompNode, progImportMaps, _CHECKER, _BUILD_OPTIONS);
    if (vcompFunctionInfo) {
        const metaUtilObj = getNewMetaUtilObj(_CHECKER, _BUILD_OPTIONS, vcompFunctionInfo, progImportMaps);
        ComponentUtils.getDtMetadataForComponent(vcompFunctionInfo, metaUtilObj);
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
        MetaUtils.updateCompilerCompMetadata(vcompFunctionInfo, metaUtilObj);
        const propsInfo = vcompFunctionInfo.propsInfo;
        if (propsInfo) {
            if (!propsInfo.propsName) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_PROPS_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, "Invalid Component 'Props' argument type -- must be a Class, Interface, or Type reference.", propsInfo.propsNode);
            }
            PropertyUtils.checkReservedProps(propsInfo, metaUtilObj);
            let { readOnlyPropNameNodes, writebackPropNameNodes } = PropertyUtils.generatePropertiesMetadata(propsInfo, metaUtilObj);
            PropertyUtils.generatePropertiesRtExtensionMetadata(writebackPropNameNodes, readOnlyPropNameNodes, propsInfo.propsRtObservedGlobalPropsSet, metaUtilObj);
            SlotUtils.validateDynamicSlots(metaUtilObj);
            MetaUtils.updateCompilerPropsMetadata(readOnlyPropNameNodes, metaUtilObj);
        }
        storeImportsInBuildOptions(functionalCompNode, progImportMaps);
        metaUtilObj.fullMetadata.methods = {};
        if (vcompFunctionInfo.methodsInfo) {
            MethodUtils.processRegisteredMethodsInfo(vcompFunctionInfo.methodsInfo, metaUtilObj);
        }
        MethodUtils.updateJetElementMethods(metaUtilObj);
        if (vcompFunctionInfo.defaultProps) {
            PropertyUtils.updateDefaultsFromDefaultProps(vcompFunctionInfo.defaultProps, metaUtilObj);
        }
        storeMetadataInBuildOptions(metaUtilObj);
        generateApiDocMetadata(metaUtilObj);
        writeMetaFiles(metaUtilObj);
        return MetaUtils.updateFunctionalVCompNode(functionalCompNode, vcompFunctionInfo, metaUtilObj);
    }
    return functionalCompNode;
}
var WALK_CLASS;
(function (WALK_CLASS) {
    WALK_CLASS[WALK_CLASS["ALL"] = 0] = "ALL";
    WALK_CLASS[WALK_CLASS["METHODS_ONLY"] = 1] = "METHODS_ONLY";
})(WALK_CLASS || (WALK_CLASS = {}));
function walkClassElements(classNode, walkElements, metaUtilObj) {
    let heritageClauses = classNode.heritageClauses;
    for (let clause of heritageClauses) {
        for (let typeNode of clause.types) {
            const baseClassName = TypeUtils.getTypeNameFromTypeReference(typeNode);
            const exportToAlias = metaUtilObj.progImportMaps.getMap(MetaTypes.IMAP.exportToAlias, typeNode);
            if (baseClassName !== exportToAlias.Component &&
                baseClassName !== exportToAlias.PureComponent) {
                const baseClassDecl = TypeUtils.getNodeDeclaration(typeNode, metaUtilObj.typeChecker);
                if (ts.isClassDeclaration(baseClassDecl)) {
                    walkClassElements(baseClassDecl, WALK_CLASS.METHODS_ONLY, metaUtilObj);
                }
            }
        }
    }
    const members = classNode.members;
    members.forEach((member) => {
        if (MethodUtils.isCustomElementClassMethod(member, metaUtilObj)) {
            MethodUtils.generateClassMethodMetadata(member, metaUtilObj);
        }
        else if (walkElements !== WALK_CLASS.METHODS_ONLY && PropertyUtils.isDefaultProps(member)) {
            const prop = member;
            if (prop.initializer && ts.isObjectLiteralExpression(prop.initializer)) {
                PropertyUtils.updateDefaultsFromDefaultProps(prop.initializer.properties, metaUtilObj);
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
}
function storeImportsInBuildOptions(componentNode, progImportMaps) {
    _BUILD_OPTIONS.importMaps = progImportMaps.getComponentImportMaps(componentNode);
}
const _EXCLUDED_NAMED_EXPORT_TYPES = ['ObservedGlobalProps'];
function getNewMetaUtilObj(typeChecker, buildOptions, componentInfo, progImportMaps) {
    if (!buildOptions['reservedGlobalProps']) {
        const RGPSet = generateReservedGlobalPropsSet(componentInfo, typeChecker);
        if (RGPSet) {
            buildOptions['reservedGlobalProps'] = RGPSet;
        }
    }
    const componentName = MetaTypes.isClassInfo(componentInfo)
        ? componentInfo.className
        : componentInfo.componentName ?? componentInfo.functionName ?? componentInfo.elementName;
    const isInMonoPack = componentInfo.packInfo?.isMonoPack();
    let rtnObj = {
        componentName,
        componentInfo,
        typeChecker,
        progImportMaps,
        rtMetadata: {},
        fullMetadata: {
            name: componentInfo.elementName,
            version: isInMonoPack ? componentInfo.packInfo.version : buildOptions['version'],
            jetVersion: isInMonoPack && componentInfo.packInfo.jetVersion
                ? componentInfo.packInfo.jetVersion
                : buildOptions['jetVersion'],
            type: buildOptions['coreJetBuildOptions']?.defaultCompType ?? 'composite'
        },
        dynamicSlotsInUse: 0b0000,
        dynamicSlotsInfo: [],
        followImports: buildOptions['followImports'],
        coreJetModuleMapping: _CORE_JET_MODULE_MAPPING,
        excludedTypes: new Set(_EXCLUDED_NAMED_EXPORT_TYPES)
    };
    if (componentInfo.packInfo) {
        rtnObj.fullMetadata.pack = componentInfo.packInfo.name;
        if (isInMonoPack) {
            if (componentInfo.packInfo.dependencyScope) {
                rtnObj.fullMetadata['dependencyScope'] = componentInfo.packInfo.dependencyScope;
            }
            if (componentInfo.packInfo.license) {
                rtnObj.fullMetadata.license = componentInfo.packInfo.license;
            }
        }
    }
    if (rtnObj.fullMetadata.type === 'core') {
        rtnObj.fullMetadata['dependencyScope'] = 'runtime';
    }
    if (componentInfo.propsInfo?.propsName) {
        rtnObj.propsName = componentInfo.propsInfo.propsName;
    }
    if (buildOptions['reservedGlobalProps']) {
        rtnObj.reservedGlobalProps = buildOptions['reservedGlobalProps'];
    }
    return rtnObj;
}
function generateReservedGlobalPropsSet(componentInfo, checker) {
    let rtnReservedGlobalProps;
    let GPType;
    let EGPRef = componentInfo.propsInfo?.propsExtendGlobalPropsRef;
    if (EGPRef) {
        const EGPtypeArg = EGPRef.typeArguments[0];
        if (EGPtypeArg) {
            const EGPparamType = checker.getTypeAtLocation(EGPtypeArg);
            const EGPparamName = TypeUtils.getTypeNameFromType(EGPparamType);
            const EGPType = checker.getTypeFromTypeNode(EGPRef);
            if (EGPType.isIntersection()) {
                const types = EGPType.types;
                for (let i = 0; i < types.length; i++) {
                    const aliasTypeArg = types[i].aliasTypeArguments[0];
                    if (aliasTypeArg && EGPparamName !== TypeUtils.getTypeNameFromType(aliasTypeArg)) {
                        GPType = aliasTypeArg;
                        break;
                    }
                }
            }
        }
    }
    else if (MetaTypes.isFunctionInfo(componentInfo) && componentInfo.propsInfo) {
        const regCustElemType = checker.getTypeAtLocation(componentInfo.compRegisterCall);
        const EGPType = regCustElemType.aliasTypeArguments?.[0];
        if (EGPType &&
            EGPType.aliasSymbol?.getName() === 'ExtendGlobalProps' &&
            EGPType.isIntersection() &&
            EGPType.types.length === 2) {
            GPType = EGPType.types[1];
        }
    }
    if (GPType) {
        const GPSymbols = GPType.getProperties();
        rtnReservedGlobalProps = new Set();
        for (let symbol of GPSymbols) {
            rtnReservedGlobalProps.add(symbol.getName());
        }
    }
    return rtnReservedGlobalProps;
}
const _VCOMPONENT_EXPORTS = new Set([
    'ComponentChildren',
    'Action',
    'CancelableAction',
    'Bubbles',
    'PropertyChanged',
    'ReadOnlyPropertyChanged',
    'Slot',
    'TemplateSlot',
    'DynamicSlots',
    'DynamicTemplateSlots',
    'ImplicitBusyContext',
    'Component',
    'ComponentProps',
    'PureComponent',
    'forwardRef',
    'memo',
    'customElement',
    'registerCustomElement',
    'method',
    'ElementReadOnly',
    'ExtendGlobalProps',
    'GlobalProps',
    'ObservedGlobalProps',
    'consumedContexts'
]);
const _VCOMPONENT_BINDING_EXPORTS = new Set(['consumedBindings', 'providedBindings']);
function storeImport(node, progImportMaps) {
    const bindings = node.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
        for (let binding of bindings.elements) {
            const namedImport = binding.name.text;
            const decrName = (binding.propertyName || binding.name).text;
            const module = trimQuotes(node.moduleSpecifier.getText());
            if (isVComponentModule(module) &&
                (_VCOMPONENT_EXPORTS.has(decrName) || _VCOMPONENT_BINDING_EXPORTS.has(decrName))) {
                progImportMaps.registerMapping(node, decrName, binding.name.text);
            }
            if (isCoreJetModule(module) && !_CORE_JET_MODULE_MAPPING.has(namedImport)) {
                _CORE_JET_MODULE_MAPPING.set(namedImport, {
                    binding: decrName,
                    module: module.split('/')[1]
                });
            }
        }
    }
}
function trimQuotes(text) {
    return text.slice(1, text.length - 1);
}
function isVComponentModule(module) {
    return (module === 'ojs/ojvcomponent' ||
        module === 'preact' ||
        module === 'preact/compat' ||
        module === 'ojs/ojvcomponent-binding');
}
function isCoreJetModule(module) {
    return module.startsWith('ojs/oj');
}
function generateApiDocMetadata(metaUtilObj) {
    if (_BUILD_OPTIONS.apiDocDir && _BUILD_OPTIONS.apiDocBuildEnabled) {
        try {
            console.log('building API Doc metadata...');
            const apidoc = ApiDocUtils.generateDoclets(metaUtilObj);
            writeApiDocFiles(apidoc, metaUtilObj.componentName);
        }
        catch (e) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNEXPECTED_APIDOC_EXCEPTION, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, 'Unexpected error happened during ApiDoc metadata processing.');
        }
    }
}
//# sourceMappingURL=metadataTransformer.js.map