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
exports.updateWritebackProps = exports.generateRootPropsMetadata = exports.checkReservedProps = exports.generatePropertiesMetadata = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const DecoratorUtils = __importStar(require("./DecoratorUtils"));
const SlotUtils = __importStar(require("./MetadataSlotUtils"));
const MetadataEventUtils_1 = require("./MetadataEventUtils");
function generatePropertiesMetadata(propsNode, isCustomElement, metaUtilObj) {
    let readOnlyProps = [];
    let writebackProps = [];
    let rootProps = [];
    MetaUtils.walkTypeNodeMembers(propsNode, metaUtilObj.typeChecker, (memberSymbol, memberKey) => {
        const propDeclaration = memberSymbol.valueDeclaration;
        const prop = memberKey;
        if (!TypeUtils.isGenericTypeParameter(memberSymbol)) {
            const decorators = DecoratorUtils.getDecorators(propDeclaration, metaUtilObj.aliasToNamedExport);
            if (decorators[metaUtilObj.namedExportToAlias.rootProperty]) {
                rootProps.push(prop);
            }
            else {
                const typeName = TypeUtils.getPropertyType(propDeclaration);
                const writebackPropName = getWritebackPropName(prop, typeName, metaUtilObj);
                if (writebackPropName) {
                    writebackProps.push(writebackPropName);
                }
                else if (!SlotUtils.generateSlotsMetadata(prop, propDeclaration, typeName, isCustomElement, metaUtilObj) &&
                    !MetadataEventUtils_1.generateEventsMetadata(prop, propDeclaration, decorators, typeName, metaUtilObj)) {
                    if (!metaUtilObj.rtMetadata.properties) {
                        metaUtilObj.rtMetadata.properties = {};
                        metaUtilObj.fullMetadata.properties = {};
                    }
                    const rt = getMetadataForProperty(memberSymbol, propDeclaration, decorators, false, isCustomElement, metaUtilObj);
                    const dt = getMetadataForProperty(memberSymbol, propDeclaration, decorators, true, isCustomElement, metaUtilObj);
                    metaUtilObj.rtMetadata.properties[prop] = rt;
                    metaUtilObj.fullMetadata.properties[prop] = dt;
                    if (rt.readOnly) {
                        readOnlyProps.push(prop);
                    }
                }
            }
        }
    });
    return { writebackProps, readOnlyProps, rootProps };
}
exports.generatePropertiesMetadata = generatePropertiesMetadata;
function checkReservedProps(propsNode, isCustomElement, metaUtilObj) {
    const checker = metaUtilObj.typeChecker;
    MetaUtils.walkTypeNodeMembers(propsNode, checker, (memberSymbol, memberKey) => {
        const prop = memberKey;
        if (!isCustomElement) {
            if (prop === "class") {
                const propDeclaration = memberSymbol.valueDeclaration;
                const declarationType = propDeclaration.type;
                const symbolType = checker.getTypeAtLocation(declarationType);
                let type = checker.typeToString(symbolType);
                const kind = declarationType.kind;
                if (kind === ts.SyntaxKind.TypeReference) {
                    type = TypeUtils.getTypeReferenceNodeSignature(declarationType, true, metaUtilObj).type;
                }
                else if (kind === ts.SyntaxKind.UnionType) {
                    type = TypeUtils.getUnionTypeNodeSignature(declarationType, metaUtilObj).type;
                }
                if (type !== "string|object" && type !== "object|string") {
                    throw new Error(`Class property must have type string|object, not ${type}.`);
                }
            }
        }
        switch (prop) {
            case "ref":
            case "key":
                throw new Error(`'${prop}' is a reserved property and cannot be redefined.`);
            case "className":
                throw new Error(`The 'className' property is not allowed. Define a 'class' property of type string | object instead, for style classes.`);
            case "htmlFor":
                throw new Error(`The 'htmlFor' property is not allowed. Define a 'for' property of type string instead, for the id of a labelable form-related element.`);
        }
    });
}
exports.checkReservedProps = checkReservedProps;
function generateRootPropsMetadata(rootProps, metaUtilObj) {
    if (!rootProps.length)
        return;
    const rootPropsMap = {};
    rootProps.forEach((prop) => {
        if (prop === "id" || prop === "style" || prop === "class") {
            console.log(`${metaUtilObj.componentClassName}: '${prop}' cannot be a controlled root property and will be ignored.`);
            return;
        }
        rootPropsMap[prop] = 1;
    });
    MetaUtils.updateRtExtensionMetadata("_ROOT_PROPS_MAP", rootPropsMap, metaUtilObj);
}
exports.generateRootPropsMetadata = generateRootPropsMetadata;
function updateWritebackProps(writebackProps, readOnlyProps, metaUtilObj) {
    if (writebackProps.length || readOnlyProps.length) {
        const rtPropsMeta = metaUtilObj.rtMetadata.properties;
        const fullPropsMeta = metaUtilObj.fullMetadata.properties;
        for (const prop of writebackProps) {
            if (!rtPropsMeta[prop]) {
                throw new Error(`Writeback property callback found, but property '${prop}' was not defined.`);
            }
            rtPropsMeta[prop].writeback = true;
            fullPropsMeta[prop].writeback = true;
        }
        for (const prop of readOnlyProps) {
            if (writebackProps.indexOf(prop) === -1) {
                throw new Error(`Read-only writeback property '${prop}' found, but no callback property was defined.`);
            }
        }
        MetaUtils.updateRtExtensionMetadata("_WRITEBACK_PROPS", writebackProps, metaUtilObj);
        MetaUtils.updateRtExtensionMetadata("_READ_ONLY_PROPS", readOnlyProps, metaUtilObj);
    }
}
exports.updateWritebackProps = updateWritebackProps;
function getWritebackPropName(prop, typeName, metaUtilObj) {
    if (typeName ===
        `${metaUtilObj.namedExportToAlias.ElementVComponent}.${MetaTypes.PROPERTY_CHANGED}`) {
        const writebackProp = MetaUtils.writebackCallbackToProperty(prop);
        if (!writebackProp) {
            throw new Error(`Writeback property callback found, but property '${prop}' does not meet the 'on[Property]Changed' naming syntax.`);
        }
        return writebackProp;
    }
    return null;
}
function getMetadataForProperty(memberSymbol, propDeclaration, decorators, includeDtMetadata, isCustomElement, metaUtilObj) {
    let md;
    const metaObj = TypeUtils.getAllMetadataForDeclaration(propDeclaration, includeDtMetadata, metaUtilObj);
    let stack = [];
    if (includeDtMetadata && metaObj.isArrayOfObject) {
        stack.push(propDeclaration.name.getText());
    }
    const subprops = TypeUtils.getComplexPropertyMetadata(memberSymbol, metaObj.type, includeDtMetadata, stack, metaUtilObj);
    md = metaObj;
    if (subprops) {
        if (subprops.circularRefs) {
            md.type = "object";
        }
        else if (metaObj.isArrayOfObject) {
            if (includeDtMetadata) {
                md.extension = {};
                md.extension["vbdt"] = {};
                md.extension["vbdt"]["itemProperties"] = subprops;
            }
        }
        else {
            md.type = "object";
            md.properties = subprops;
        }
    }
    else {
        if (includeDtMetadata) {
            metaObj["optional"] = propDeclaration["questionToken"] ? true : false;
        }
        md = metaObj;
    }
    if (propDeclaration.initializer) {
        if (decorators[metaUtilObj.namedExportToAlias.dynamicDefault]) {
            console.log(`${metaUtilObj.componentClassName}: Default value should not be set when using a dynamic getter for property '${memberSymbol.name}'.`);
        }
        updateDefaultValue(md, memberSymbol.name, propDeclaration, metaUtilObj);
    }
    if (decorators[metaUtilObj.namedExportToAlias.readOnly]) {
        if (!isCustomElement) {
            throw new Error(`The @readOnly decorator can only be used with custom element VComponents.`);
        }
        md.readOnly = true;
    }
    const consumeDecorator = decorators[metaUtilObj.namedExportToAlias.consumeBinding];
    const provideDecorators = decorators[metaUtilObj.namedExportToAlias.provideBinding];
    if (consumeDecorator || provideDecorators) {
        md.binding = {};
    }
    if (consumeDecorator) {
        md.binding.consume = {
            name: DecoratorUtils.getDecoratorParamValue(consumeDecorator, "name"),
        };
    }
    if (provideDecorators) {
        let provideArray = new Array();
        provideDecorators.forEach((provideDecorator) => {
            const nameValue = DecoratorUtils.getDecoratorParamValue(provideDecorator, "name");
            const defaultValue = DecoratorUtils.getDecoratorParamValue(provideDecorator, "default");
            const transformValue = DecoratorUtils.getDecoratorParamValue(provideDecorator, "transform");
            const provideBinding = { name: nameValue };
            if (defaultValue !== undefined) {
                provideBinding["default"] = defaultValue;
            }
            if (transformValue !== undefined) {
                provideBinding["transform"] = transformValue;
            }
            provideArray.push(provideBinding);
        });
        md.binding.provide = provideArray;
    }
    delete md["isArrayOfObject"];
    return md;
}
function updateComplexPropertyValues(rt, values) {
    if (rt) {
        for (let [key, value] of Object.entries(values)) {
            if (!rt[key].properties) {
                rt[key].value = value;
            }
            else {
                updateComplexPropertyValues(rt[key].properties, value);
            }
        }
    }
}
function updateDefaultValue(md, propertyName, propDeclaration, metaUtilObj) {
    let defaultValue = propDeclaration.initializer.getText();
    if (propDeclaration.initializer.kind === ts.SyntaxKind.AsExpression) {
        const initializer = propDeclaration.initializer;
        defaultValue = initializer.expression.getText();
    }
    const value = MetaUtils.stringToJS(propertyName, propDeclaration.initializer.kind, defaultValue, metaUtilObj);
    if (value !== undefined) {
        if (!md.properties) {
            md.value = value;
        }
        else {
            updateComplexPropertyValues(md.properties, value);
        }
    }
}
