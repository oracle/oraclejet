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
        _BUILD_OPTIONS.componentToMetadata = null;
        _BUILD_OPTIONS.importMaps = null;
        const isTsx = path.extname(sf.fileName) === ".tsx";
        if (_BUILD_OPTIONS["debug"])
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
                return generateElementMetadata(classNode, vexportToAlias, aliasToVExport);
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
function generateElementMetadata(classNode, vexportToAlias, aliasToVExport) {
    if (!classNode.heritageClauses) {
        return classNode;
    }
    const custElemDecorator = DecoratorUtils.getDecorator(classNode, vexportToAlias.customElement);
    if (!custElemDecorator) {
        return classNode;
    }
    let vcompClassInfo = ComponentUtils.getVCompClassInfo(classNode, vexportToAlias, _CHECKER);
    if (!vcompClassInfo || !vcompClassInfo.className) {
        return classNode;
    }
    let propsInfo = vcompClassInfo.propsInfo;
    let elementName = custElemDecorator === null || custElemDecorator === void 0 ? void 0 : custElemDecorator.expression["arguments"][0].text;
    const metaUtilObj = getNewMetaUtilObj(_CHECKER, _BUILD_OPTIONS, elementName, vcompClassInfo, vexportToAlias, aliasToVExport);
    MetaUtils.updateCompilerClassMetadata(classNode, metaUtilObj);
    metaUtilObj.fullMetadata,
        ComponentUtils.getDtMetadataForComponent(classNode, metaUtilObj);
    if (propsInfo) {
        if (!propsInfo.propsName) {
            throw new TransformerError_1.TransformerError(vcompClassInfo.className, "Invalid Component 'Props' argument type -- must be a Class, Interface, or Type reference.");
        }
        PropertyUtils.checkReservedProps(propsInfo, metaUtilObj);
        let { readOnlyProps, writebackProps, } = PropertyUtils.generatePropertiesMetadata(propsInfo, metaUtilObj);
        PropertyUtils.generatePropertiesRtExtensionMetadata(writebackProps, readOnlyProps, propsInfo.propsObservedGlobalProps, metaUtilObj);
        MetaUtils.updateCompilerPropsMetadata(propsInfo, readOnlyProps, metaUtilObj);
    }
    storeImportsInBuildOptions(vexportToAlias, aliasToVExport);
    metaUtilObj.fullMetadata.methods = {};
    walkClassElements(classNode.members, metaUtilObj);
    MethodUtils.updateJetElementMethods(metaUtilObj);
    storeMetadataInBuildOptions(metaUtilObj);
    SlotUtils.validateDynamicSlots(metaUtilObj);
    writeMetaFiles(metaUtilObj);
    return MetaUtils.addMetadataToClassNode(classNode, metaUtilObj.rtMetadata);
}
function walkClassElements(members, metaUtilObj) {
    members.forEach((member) => {
        if (MethodUtils.isCustomElementMethod(member, metaUtilObj)) {
            MethodUtils.generateMethodMetadata(member, metaUtilObj);
        }
        else if (PropertyUtils.isDefaultProps(member)) {
            const prop = member;
            if (ts.isObjectLiteralExpression(prop.initializer)) {
                PropertyUtils.updateDefaultsFromDefaultProps(prop.initializer, metaUtilObj);
            }
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
function storeImportsInBuildOptions(vexportToAlias, aliasToVExport) {
    let importMaps = _BUILD_OPTIONS.importMaps;
    if (!importMaps) {
        importMaps = {
            exportToAlias: {},
            aliasToExport: {},
        };
        _BUILD_OPTIONS.importMaps = importMaps;
    }
    Object.assign(importMaps.exportToAlias, vexportToAlias);
    Object.assign(importMaps.aliasToExport, aliasToVExport);
}
function getNewMetaUtilObj(typeChecker, buildOptions, elementName, classInfo, namedExportToAlias, aliasToNamedExport) {
    if (!buildOptions["reservedGlobalProps"]) {
        const refExtendGlobalProps = classInfo.propsInfo
            ? classInfo.propsInfo.propsExtendGlobalPropsRef
            : null;
        if (refExtendGlobalProps) {
            buildOptions["reservedGlobalProps"] = generateReservedGlobalPropsList(refExtendGlobalProps, typeChecker);
        }
    }
    let rtnObj = {
        componentClassName: classInfo.className,
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
    if (buildOptions["reservedGlobalProps"]) {
        rtnObj.reservedGlobalProps = buildOptions["reservedGlobalProps"];
    }
    return rtnObj;
}
function generateReservedGlobalPropsList(EGPRef, checker) {
    let rtnReservedGlobalProps = [];
    let GPType;
    const EGPtypeArg = EGPRef.typeArguments[0];
    if (EGPtypeArg) {
        const EGPparamType = checker.getTypeAtLocation(EGPtypeArg);
        const EGPparamName = TypeUtils.getTypeNameFromType(EGPparamType);
        const EGPType = checker.getTypeFromTypeNode(EGPRef);
        if (EGPType.isIntersection()) {
            const types = EGPType.types;
            for (let i = 0; i < types.length; i++) {
                const aliasTypeArg = types[i].aliasTypeArguments[0];
                if (aliasTypeArg &&
                    EGPparamName !== TypeUtils.getTypeNameFromType(aliasTypeArg)) {
                    GPType = aliasTypeArg;
                    break;
                }
            }
        }
        if (GPType) {
            const GPSymbols = GPType.getProperties();
            for (let symbol of GPSymbols) {
                rtnReservedGlobalProps.push(symbol.getName());
            }
        }
    }
    return rtnReservedGlobalProps;
}
const _VCOMPONENT_EXPORTS = new Set([
    "ComponentChildren",
    "Action",
    "CancelableAction",
    "Bubbles",
    "PropertyChanged",
    "Slot",
    "TemplateSlot",
    "DynamicSlots",
    "DynamicTemplateSlots",
    "Component",
    "PureComponent",
    "customElement",
    "method",
    "ElementReadOnly",
    "ExtendGlobalProps",
    "GlobalProps",
    "ObservedGlobalProps",
]);
const _VCOMPONENT_BINDING_EXPORTS = new Set([
    "consumedBindings",
    "providedBindings",
]);
function storeImport(node, vexportToAlias, aliasToVExport) {
    var _a;
    const bindings = (_a = node.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
        for (let binding of bindings.elements) {
            const namedImport = binding.name.text;
            const decrName = (binding.propertyName || binding.name).text;
            const module = trimQuotes(node.moduleSpecifier.getText());
            if (isVComponentModule(module) &&
                (_VCOMPONENT_EXPORTS.has(decrName) ||
                    _VCOMPONENT_BINDING_EXPORTS.has(decrName))) {
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
    return (module === "ojs/ojvcomponent" ||
        module === "preact" ||
        module === "preact/compat" ||
        module === "ojs/ojvcomponent-binding");
}
