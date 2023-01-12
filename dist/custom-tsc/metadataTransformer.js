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
const TransformerError_1 = require("./utils/TransformerError");
let _BUILD_OPTIONS;
let _CHECKER;
let _COMPILER_OPTIONS;
function transformer(program, buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    _CHECKER = program.getTypeChecker();
    _COMPILER_OPTIONS = program.getCompilerOptions();
    function visitor(ctx, sf) {
        var _a;
        const vexportToAlias = {};
        const aliasToVExport = {};
        TransformerError_1.TransformerError.setDisabledList(!(((_a = _BUILD_OPTIONS.disabledExceptionKeys) === null || _a === void 0 ? void 0 : _a.length) > 0)
            ? null
            : _BUILD_OPTIONS.disabledExceptionKeys);
        _BUILD_OPTIONS.componentToMetadata = null;
        _BUILD_OPTIONS.importMaps = null;
        const isTsx = path.extname(sf.fileName) === '.tsx';
        if (_BUILD_OPTIONS['debug'])
            console.log(`${sf.fileName}: processing metadata...`);
        const visitor = (node) => {
            if (!isTsx)
                return node;
            if (ts.isImportDeclaration(node)) {
                storeImport(node, vexportToAlias, aliasToVExport);
                return node;
            }
            else if (ts.isClassDeclaration(node)) {
                const classNode = node;
                return generateClassElementMetadata(classNode, vexportToAlias, aliasToVExport);
            }
            else if ((ts.isVariableStatement(node) || ts.isExpressionStatement(node)) &&
                ts.isSourceFile(node.parent)) {
                return generateFunctionalElementMetadata(node, vexportToAlias, aliasToVExport);
            }
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return (sf) => ts.visitNode(sf, visitor(ctx, sf));
    };
}
exports.default = transformer;
function generateClassElementMetadata(classNode, vexportToAlias, aliasToVExport) {
    if (!classNode.heritageClauses) {
        return classNode;
    }
    const custElemDecorator = DecoratorUtils.getDecorator(classNode, vexportToAlias.customElement);
    if (!custElemDecorator) {
        return classNode;
    }
    let elementName = custElemDecorator.expression['arguments'][0].text;
    let vcompClassInfo = ComponentUtils.getVCompClassInfo(elementName, classNode, vexportToAlias, _CHECKER, _COMPILER_OPTIONS, _BUILD_OPTIONS);
    if (!vcompClassInfo || !vcompClassInfo.className) {
        return classNode;
    }
    const metaUtilObj = getNewMetaUtilObj(_CHECKER, _BUILD_OPTIONS, vcompClassInfo, vexportToAlias, aliasToVExport);
    MetaUtils.updateCompilerCompMetadata(vcompClassInfo, metaUtilObj);
    ComponentUtils.getDtMetadataForComponent(vcompClassInfo, metaUtilObj);
    const propsInfo = vcompClassInfo.propsInfo;
    if (ts.isSourceFile(classNode.parent)) {
        const fileName = classNode.parent.fileName;
        metaUtilObj.fullMetadata['jsdoc'] = metaUtilObj.fullMetadata['jsdoc'] || {};
        metaUtilObj.fullMetadata['jsdoc']['meta'] = {
            filename: path.basename(fileName),
            path: path.dirname(fileName)
        };
    }
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
        PropertyUtils.generatePropertiesRtExtensionMetadata(writebackPropNameNodes, readOnlyPropNameNodes, propsInfo.propsObservedGlobalProps, metaUtilObj);
        MetaUtils.updateCompilerPropsMetadata(propsInfo, readOnlyPropNameNodes, metaUtilObj);
    }
    storeImportsInBuildOptions(vexportToAlias, aliasToVExport);
    metaUtilObj.fullMetadata.methods = {};
    walkClassElements(classNode, WALK_CLASS.ALL, metaUtilObj);
    MethodUtils.updateJetElementMethods(metaUtilObj);
    storeMetadataInBuildOptions(metaUtilObj);
    SlotUtils.validateDynamicSlots(metaUtilObj);
    generateApiDocMetadata(metaUtilObj);
    writeMetaFiles(metaUtilObj);
    return MetaUtils.addMetadataToClassNode(vcompClassInfo, metaUtilObj.rtMetadata);
}
function generateFunctionalElementMetadata(functionalCompNode, vexportToAlias, aliasToVExport) {
    let vcompFunctionInfo = ComponentUtils.getVCompFunctionInfo(functionalCompNode, vexportToAlias, _CHECKER, _COMPILER_OPTIONS, _BUILD_OPTIONS);
    if (vcompFunctionInfo) {
        const metaUtilObj = getNewMetaUtilObj(_CHECKER, _BUILD_OPTIONS, vcompFunctionInfo, vexportToAlias, aliasToVExport);
        MetaUtils.updateCompilerCompMetadata(vcompFunctionInfo, metaUtilObj);
        ComponentUtils.getDtMetadataForComponent(vcompFunctionInfo, metaUtilObj);
        if (ts.isSourceFile(functionalCompNode.parent)) {
            const fileName = functionalCompNode.parent.fileName;
            metaUtilObj.fullMetadata['jsdoc'] = metaUtilObj.fullMetadata['jsdoc'] || {};
            metaUtilObj.fullMetadata['jsdoc']['meta'] = {
                filename: path.basename(fileName),
                path: path.dirname(fileName)
            };
        }
        const propsInfo = vcompFunctionInfo.propsInfo;
        if (propsInfo) {
            if (!propsInfo.propsName) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.INVALID_PROPS_TYPE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, "Invalid Component 'Props' argument type -- must be a Class, Interface, or Type reference.", propsInfo.propsNode);
            }
            PropertyUtils.checkReservedProps(propsInfo, metaUtilObj);
            let { readOnlyPropNameNodes, writebackPropNameNodes } = PropertyUtils.generatePropertiesMetadata(propsInfo, metaUtilObj);
            PropertyUtils.generatePropertiesRtExtensionMetadata(writebackPropNameNodes, readOnlyPropNameNodes, propsInfo.propsObservedGlobalProps, metaUtilObj);
            MetaUtils.updateCompilerPropsMetadata(propsInfo, readOnlyPropNameNodes, metaUtilObj);
        }
        storeImportsInBuildOptions(vexportToAlias, aliasToVExport);
        metaUtilObj.fullMetadata.methods = {};
        if (vcompFunctionInfo.methodsInfo) {
            MethodUtils.processRegisteredMethodsInfo(vcompFunctionInfo.methodsInfo, metaUtilObj);
        }
        MethodUtils.updateJetElementMethods(metaUtilObj);
        if (vcompFunctionInfo.defaultProps) {
            PropertyUtils.updateDefaultsFromDefaultProps(vcompFunctionInfo.defaultProps, metaUtilObj);
        }
        storeMetadataInBuildOptions(metaUtilObj);
        SlotUtils.validateDynamicSlots(metaUtilObj);
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
            if (baseClassName !== metaUtilObj.namedExportToAlias.Component &&
                baseClassName !== metaUtilObj.namedExportToAlias.PureComponent) {
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
function storeImportsInBuildOptions(vexportToAlias, aliasToVExport) {
    let importMaps = _BUILD_OPTIONS.importMaps;
    if (!importMaps) {
        importMaps = {
            exportToAlias: {},
            aliasToExport: {}
        };
        _BUILD_OPTIONS.importMaps = importMaps;
    }
    Object.assign(importMaps.exportToAlias, vexportToAlias);
    Object.assign(importMaps.aliasToExport, aliasToVExport);
}
const _EXCLUDED_NAMED_EXPORT_TYPES = ['ObservedGlobalProps'];
function getNewMetaUtilObj(typeChecker, buildOptions, componentInfo, namedExportToAlias, aliasToNamedExport) {
    var _a, _b, _c, _d, _e, _f;
    if (!buildOptions['reservedGlobalProps']) {
        const RGPSet = generateReservedGlobalPropsSet(componentInfo, typeChecker);
        if (RGPSet) {
            buildOptions['reservedGlobalProps'] = RGPSet;
        }
    }
    const componentName = MetaTypes.isClassInfo(componentInfo)
        ? componentInfo.className
        : (_b = (_a = componentInfo.componentName) !== null && _a !== void 0 ? _a : componentInfo.functionName) !== null && _b !== void 0 ? _b : componentInfo.elementName;
    const isInMonoPack = (_c = componentInfo.packInfo) === null || _c === void 0 ? void 0 : _c.isMonoPack();
    let rtnObj = {
        componentName,
        componentInfo,
        typeChecker,
        namedExportToAlias,
        aliasToNamedExport,
        rtMetadata: {},
        fullMetadata: {
            name: componentInfo.elementName,
            version: isInMonoPack ? componentInfo.packInfo.version : buildOptions['version'],
            jetVersion: isInMonoPack && componentInfo.packInfo.jetVersion
                ? componentInfo.packInfo.jetVersion
                : buildOptions['jetVersion'],
            type: (_e = (_d = buildOptions['coreJetBuildOptions']) === null || _d === void 0 ? void 0 : _d.defaultCompType) !== null && _e !== void 0 ? _e : 'composite'
        },
        dynamicSlotsInUse: 0b0000,
        dynamicSlotNameNodes: []
    };
    if (componentInfo.packInfo) {
        rtnObj.fullMetadata.pack = componentInfo.packInfo.name;
        if (isInMonoPack && componentInfo.packInfo.license) {
            rtnObj.fullMetadata.license = componentInfo.packInfo.license;
        }
    }
    if ((_f = componentInfo.propsInfo) === null || _f === void 0 ? void 0 : _f.propsName) {
        rtnObj.propsName = componentInfo.propsInfo.propsName;
    }
    if (buildOptions['reservedGlobalProps']) {
        rtnObj.reservedGlobalProps = buildOptions['reservedGlobalProps'];
    }
    _EXCLUDED_NAMED_EXPORT_TYPES.forEach((tName) => {
        const tNameAlias = namedExportToAlias[tName];
        if (tNameAlias) {
            if (!rtnObj.excludedTypes) {
                rtnObj.excludedTypes = new Set();
            }
            rtnObj.excludedTypes.add(tName);
            if (!rtnObj.excludedTypeAliases) {
                rtnObj.excludedTypeAliases = new Set();
            }
            rtnObj.excludedTypeAliases.add(tNameAlias);
        }
    });
    return rtnObj;
}
function generateReservedGlobalPropsSet(componentInfo, checker) {
    var _a, _b, _c;
    let rtnReservedGlobalProps;
    let GPType;
    let EGPRef = (_a = componentInfo.propsInfo) === null || _a === void 0 ? void 0 : _a.propsExtendGlobalPropsRef;
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
        const EGPType = (_b = regCustElemType.aliasTypeArguments) === null || _b === void 0 ? void 0 : _b[0];
        if (EGPType &&
            ((_c = EGPType.aliasSymbol) === null || _c === void 0 ? void 0 : _c.getName()) === 'ExtendGlobalProps' &&
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
function storeImport(node, vexportToAlias, aliasToVExport) {
    var _a;
    const bindings = (_a = node.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
        for (let binding of bindings.elements) {
            const namedImport = binding.name.text;
            const decrName = (binding.propertyName || binding.name).text;
            const module = trimQuotes(node.moduleSpecifier.getText());
            if (isVComponentModule(module) &&
                (_VCOMPONENT_EXPORTS.has(decrName) || _VCOMPONENT_BINDING_EXPORTS.has(decrName))) {
                vexportToAlias[decrName] = binding.name.text;
                aliasToVExport[namedImport] = decrName;
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
function generateApiDocMetadata(metaUtilObj) {
    if (_BUILD_OPTIONS.apiDocDir) {
        try {
            const apidoc = ApiDocUtils.generateDoclets(metaUtilObj);
            writeApiDocFiles(apidoc, metaUtilObj.componentName);
        }
        catch (e) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.UNEXPECTED_APIDOC_EXCEPTION, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, 'Unexpected error happened during ApiDoc metadata processing.');
        }
    }
}
//# sourceMappingURL=metadataTransformer.js.map