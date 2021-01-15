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
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DecoratorUtils = __importStar(require("./utils/DecoratorUtils"));
const MetaUtils = __importStar(require("./utils/MetadataUtils"));
const ComponentUtils = __importStar(require("./utils/MetadataComponentUtils"));
const PropertyUtils = __importStar(require("./utils/MetadataPropertyUtils"));
const SlotUtils = __importStar(require("./utils/MetadataSlotUtils"));
const TypeUtils = __importStar(require("./utils/MetadataTypeUtils"));
const TransformerError_1 = require("./utils/TransformerError");
const MethodUtils = __importStar(require("./utils/MetadataMethodUtils"));
let _BUILD_OPTIONS;
let _CHECKER;
function transformer(program, buildOptions) {
    _BUILD_OPTIONS = buildOptions;
    _CHECKER = program.getTypeChecker();
    function visitor(ctx, sf) {
        const vexportToAlias = {};
        const aliasToVExport = {};
        const importToModule = {};
        const moduleToProps = {};
        const propsToModule = {};
        _BUILD_OPTIONS.componentToMetadata = null;
        _BUILD_OPTIONS.importMaps = null;
        const isTsx = path.extname(sf.fileName) === ".tsx";
        if (_BUILD_OPTIONS["debug"])
            console.log(`${sf.fileName}: processing metadata...`);
        const visitor = (node) => {
            if (!isTsx)
                return node;
            if (ts.isImportDeclaration(node)) {
                storeImport(node, vexportToAlias, aliasToVExport, importToModule);
                return node;
            }
            else if (ts.isClassDeclaration(node)) {
                const classNode = node;
                return generateElementMetadata(classNode, vexportToAlias, aliasToVExport, importToModule, moduleToProps, propsToModule);
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
function generateElementMetadata(classNode, vexportToAlias, aliasToVExport, importToModule, moduleToProps, propsToModule) {
    var _a, _b;
    const heritageClauses = classNode.heritageClauses;
    let vcompClassName = undefined;
    if (!heritageClauses) {
        return classNode;
    }
    let propsAsType = null;
    let baseClass;
    for (let clause of heritageClauses) {
        for (let type of clause.types) {
            baseClass = type.expression.getText();
            if (baseClass === vexportToAlias.VComponent ||
                baseClass === vexportToAlias.ElementVComponent) {
                vcompClassName = classNode.name.getText();
                propsAsType = (_a = type.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
                break;
            }
        }
    }
    const decorator = DecoratorUtils.getDecorator(classNode, vexportToAlias.customElement);
    if (decorator && baseClass !== vexportToAlias.ElementVComponent) {
        throw new TransformerError_1.TransformerError(`A @customElement decorator was found on class ${vcompClassName} that is not extending ElementVComponent.`);
    }
    let elementName = decorator === null || decorator === void 0 ? void 0 : decorator.expression["arguments"][0].text;
    const isCustomElement = elementName != null;
    const metaUtilObj = getNewMetaUtilObj(_CHECKER, _BUILD_OPTIONS, elementName, vcompClassName, vexportToAlias, aliasToVExport);
    if (isCustomElement) {
        MetaUtils.updateCompilerClassMetadata(classNode, metaUtilObj);
        metaUtilObj.fullMetadata,
            ComponentUtils.getDtMetadataForComponent(classNode, metaUtilObj);
    }
    if (propsAsType) {
        const propsClassName = TypeUtils.getTypeNameNoGenerics(propsAsType);
        if (!propsClassName) {
            throw new TransformerError_1.TransformerError(`${vcompClassName}: Invalid ElementVComponent 'Props' argument type -- must be a Class, Interface, or Type reference.`);
        }
        const declaration = TypeUtils.getNodeDeclaration(propsAsType, _CHECKER);
        if (ts.isClassDeclaration(declaration)) {
            MetaUtils.updateRtExtensionMetadata("_DEFAULTS", propsClassName, metaUtilObj);
        }
        const propsModule = importToModule[propsClassName];
        if (propsModule) {
            propsToModule[propsClassName] = propsModule;
            if (!moduleToProps[propsModule]) {
                moduleToProps[propsModule] = [];
            }
            moduleToProps[propsModule].push(propsClassName);
        }
        PropertyUtils.checkReservedProps(propsAsType, isCustomElement, metaUtilObj);
        try {
            let { readOnlyProps, writebackProps, rootProps, } = PropertyUtils.generatePropertiesMetadata(propsAsType, isCustomElement, metaUtilObj);
            PropertyUtils.generateRootPropsMetadata(rootProps, metaUtilObj);
            PropertyUtils.updateWritebackProps(writebackProps, readOnlyProps, metaUtilObj);
            MetaUtils.updateCompilerPropsMetadata(propsAsType, declaration, propsClassName, readOnlyProps, metaUtilObj);
        }
        catch (err) {
            throw new TransformerError_1.TransformerError(`${vcompClassName}: ${err.message}`);
        }
    }
    storeImportsInBuildOptions(vexportToAlias, aliasToVExport, propsToModule, moduleToProps);
    if (isCustomElement) {
        MethodUtils.updateJetElementMethods(metaUtilObj);
        generateMethodsMetadata(classNode.members, metaUtilObj);
        storeMetadataInBuildOptions(metaUtilObj);
        SlotUtils.validateDynamicSlots(metaUtilObj);
        writeMetaFiles(metaUtilObj);
        return MetaUtils.addMetadataToClassNode(classNode, metaUtilObj.rtMetadata);
    }
    if ((_b = metaUtilObj.rtMetadata.extension) === null || _b === void 0 ? void 0 : _b._DEFAULTS) {
        return MetaUtils.addMetadataToClassNode(classNode, {
            extension: { _DEFAULTS: metaUtilObj.rtMetadata.extension._DEFAULTS },
        });
    }
    return classNode;
}
function generateMethodsMetadata(members, metaUtilObj) {
    members.forEach((member) => {
        if (MethodUtils.isCustomElementMethod(member, metaUtilObj)) {
            MethodUtils.generateMethodMetadata(member, metaUtilObj);
        }
    });
}
function writeMetaFiles(metaUtilObj) {
    MetaUtils.pruneCompilerMetadata(metaUtilObj);
    const dtDir = _BUILD_OPTIONS.dtDir;
    if (!fs.existsSync(dtDir)) {
        fs.mkdirSync(dtDir, { recursive: true });
    }
    fs.writeFileSync(`${dtDir}/${metaUtilObj.fullMetadata.name}.json`, JSON.stringify(metaUtilObj.fullMetadata, null, 2));
}
function storeMetadataInBuildOptions(metaUtilObj) {
    if (!_BUILD_OPTIONS.componentToMetadata) {
        _BUILD_OPTIONS.componentToMetadata = {};
    }
    _BUILD_OPTIONS.componentToMetadata[metaUtilObj.componentClassName] = JSON.parse(JSON.stringify(metaUtilObj.fullMetadata));
}
function storeImportsInBuildOptions(vexportToAlias, aliasToVExport, propsToModule, moduleToProps) {
    let importMaps = _BUILD_OPTIONS.importMaps;
    if (!importMaps) {
        importMaps = {
            exportToAlias: {},
            aliasToExport: {},
            propsToModule: {},
            moduleToProps: {},
        };
        _BUILD_OPTIONS.importMaps = importMaps;
    }
    Object.assign(importMaps.exportToAlias, vexportToAlias);
    Object.assign(importMaps.aliasToExport, aliasToVExport);
    Object.assign(importMaps.propsToModule, propsToModule);
    Object.assign(importMaps.moduleToProps, moduleToProps);
}
function getNewMetaUtilObj(typeChecker, buildOptions, elementName, componentClassName, namedExportToAlias, aliasToNamedExport) {
    return {
        componentClassName,
        typeChecker,
        namedExportToAlias,
        aliasToNamedExport,
        rtMetadata: {},
        fullMetadata: {
            name: elementName,
            version: buildOptions["version"],
            jetVersion: buildOptions["jetVersion"],
            type: buildOptions["coreJetBuildOptions"] ? "core" : "composite",
        },
        dynamicSlotsInUse: 0b0000,
    };
}
const _VCOMPONENT_EXPORTS = new Set([
    "Component",
    "ElementVComponent",
    "VComponent",
    "customElement",
    "dynamicDefault",
    "method",
    "rootProperty",
    "readOnly",
    "event",
]);
const _VCOMPONENT_BINDING_EXPORTS = new Set([
    "provideBinding",
    "consumeBinding",
]);
function storeImport(node, vexportToAlias, aliasToVExport, importToModule) {
    var _a;
    const bindings = (_a = node.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
        for (let binding of bindings.elements) {
            const namedImport = binding.name.text;
            const decrName = (binding.propertyName || binding.name).text;
            const module = trimQuotes(node.moduleSpecifier.getText());
            if (_VCOMPONENT_EXPORTS.has(decrName) ||
                _VCOMPONENT_BINDING_EXPORTS.has(decrName)) {
                vexportToAlias[decrName] = binding.name.text;
                aliasToVExport[namedImport] = decrName;
            }
            importToModule[namedImport] = module;
        }
    }
}
function trimQuotes(text) {
    return text.slice(1, text.length - 1);
}
