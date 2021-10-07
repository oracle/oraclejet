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
exports.updateDefaultsFromDefaultProps = exports.isDefaultProps = exports.generatePropertiesRtExtensionMetadata = exports.checkReservedProps = exports.generatePropertiesMetadata = void 0;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const TypeUtils = __importStar(require("./MetadataTypeUtils"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const DecoratorUtils = __importStar(require("./DecoratorUtils"));
const SlotUtils = __importStar(require("./MetadataSlotUtils"));
const MetadataEventUtils_1 = require("./MetadataEventUtils");
const TransformerError_1 = require("./TransformerError");
function generatePropertiesMetadata(propsInfo, metaUtilObj) {
    let readOnlyProps = [];
    let writebackProps = [];
    let propsName = propsInfo.propsName;
    MetaUtils.walkTypeMembers(propsInfo.propsType, metaUtilObj, (memberSymbol, memberKey, mappedTypeSymbol) => {
        if (!TypeUtils.isGenericTypeParameter(memberSymbol)) {
            const propDeclaration = memberSymbol.valueDeclaration;
            const prop = memberKey;
            const typeName = TypeUtils.getPropertyType(propDeclaration.type, propDeclaration.name.getText());
            const writebackPropName = getWritebackPropName(prop, typeName, metaUtilObj);
            if (writebackPropName) {
                writebackProps.push(writebackPropName);
            }
            else if (!SlotUtils.generateSlotsMetadata(prop, propDeclaration, typeName, metaUtilObj) &&
                !MetadataEventUtils_1.generateEventsMetadata(prop, propDeclaration, metaUtilObj)) {
                if (!metaUtilObj.rtMetadata.properties) {
                    metaUtilObj.rtMetadata.properties = {};
                    metaUtilObj.fullMetadata.properties = {};
                }
                const rt = getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, propsName, MetaTypes.MetadataScope.RT, metaUtilObj);
                const dt = getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, propsName, MetaTypes.MetadataScope.DT, metaUtilObj);
                metaUtilObj.rtMetadata.properties[prop] = rt;
                metaUtilObj.fullMetadata.properties[prop] = dt;
                if (typeName === `${metaUtilObj.namedExportToAlias.ElementReadOnly}`) {
                    rt.readOnly = true;
                    dt.readOnly = true;
                    readOnlyProps.push(prop);
                }
            }
        }
    });
    return { writebackProps, readOnlyProps };
}
exports.generatePropertiesMetadata = generatePropertiesMetadata;
function checkReservedProps(propsInfo, metaUtilObj) {
    MetaUtils.walkTypeMembers(propsInfo.propsType, metaUtilObj, (memberSymbol, memberKey, mappedTypeSymbol) => {
        var _a;
        if (TypeUtils.isGenericTypeParameter(memberSymbol)) {
            return;
        }
        const prop = memberKey;
        switch (prop) {
            case "ref":
            case "key":
                throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `'${prop}' is a reserved property and cannot be redefined.`);
            case "className":
                throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `The 'className' property is not allowed. Use the global HTML 'class' property to specify style classes.`);
            case "htmlFor":
                throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `The 'htmlFor' property is not allowed. Define a 'for' property of type string instead, for the id of a labelable form-related element.`);
            case "class":
            case "style":
                throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `'${prop}' is a global HTML property already accessible to VComponents and cannot be overridden.`);
            default:
                if (((_a = metaUtilObj["reservedGlobalProps"]) === null || _a === void 0 ? void 0 : _a.indexOf(prop)) >= 0) {
                    console.log(`${metaUtilObj.componentClassName}: '${prop}' property declaration overrides a global HTML property.
As an alternative, use the ObservedGlobalProps utility type to specify observable global HTML properties.`);
                }
                break;
        }
    });
}
exports.checkReservedProps = checkReservedProps;
function generatePropertiesRtExtensionMetadata(writebackProps, readOnlyProps, observedGlobalProps, metaUtilObj) {
    if (writebackProps.length || readOnlyProps.length) {
        const rtPropsMeta = metaUtilObj.rtMetadata.properties;
        const fullPropsMeta = metaUtilObj.fullMetadata.properties;
        for (const prop of writebackProps) {
            if (!rtPropsMeta[prop]) {
                throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `Writeback property callback found, but property '${prop}' was not defined.`);
            }
            rtPropsMeta[prop].writeback = true;
            fullPropsMeta[prop].writeback = true;
        }
        for (const prop of readOnlyProps) {
            if (writebackProps.indexOf(prop) === -1) {
                throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `Read-only writeback property '${prop}' found, but no callback property was defined.`);
            }
        }
        MetaUtils.updateRtExtensionMetadata("_WRITEBACK_PROPS", writebackProps, metaUtilObj);
        MetaUtils.updateRtExtensionMetadata("_READ_ONLY_PROPS", readOnlyProps, metaUtilObj);
    }
    if (observedGlobalProps === null || observedGlobalProps === void 0 ? void 0 : observedGlobalProps.length) {
        MetaUtils.updateRtExtensionMetadata("_OBSERVED_GLOBAL_PROPS", observedGlobalProps, metaUtilObj);
    }
}
exports.generatePropertiesRtExtensionMetadata = generatePropertiesRtExtensionMetadata;
function getWritebackPropName(prop, typeName, metaUtilObj) {
    if (typeName === `${metaUtilObj.namedExportToAlias.PropertyChanged}`) {
        const writebackProp = MetaUtils.writebackCallbackToProperty(prop);
        if (!writebackProp) {
            throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, `Writeback property callback found, but property '${prop}' does not meet the 'on[Property]Changed' naming syntax.`);
        }
        return writebackProp;
    }
    return null;
}
function getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, propsName, scope, metaUtilObj) {
    let md;
    const metaObj = TypeUtils.getAllMetadataForDeclaration(propDeclaration, scope, metaUtilObj);
    let stack = [];
    if (scope == MetaTypes.MetadataScope.DT && metaObj.isArrayOfObject) {
        stack.push(propDeclaration.name.getText());
    }
    const subprops = TypeUtils.getComplexPropertyMetadata(memberSymbol, metaObj.type, propsName, scope, stack, metaUtilObj);
    md = metaObj;
    if (scope == MetaTypes.MetadataScope.DT) {
        const propSym = mappedTypeSymbol !== null && mappedTypeSymbol !== void 0 ? mappedTypeSymbol : memberSymbol;
        md["optional"] = propSym.flags & ts.SymbolFlags.Optional ? true : false;
    }
    if (subprops) {
        if (subprops.circRefDetected) {
            md.type = TypeUtils.getSubstituteTypeForCircularReference(metaObj);
        }
        else if (metaObj.isArrayOfObject) {
            if (scope == MetaTypes.MetadataScope.DT) {
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
    if (propDeclaration.initializer) {
        console.log(`${metaUtilObj.componentClassName}: Default value should be set using defaultProps for '${memberSymbol.name}'.`);
    }
    if (metaUtilObj.classConsumedBindingsDecorator) {
        const consume = DecoratorUtils.getDecoratorParamValue(metaUtilObj.classConsumedBindingsDecorator, prop);
        if (consume) {
            if (!md.binding) {
                md.binding = {};
            }
            md.binding.consume = consume;
        }
    }
    if (metaUtilObj.classProvidedBindingsDecorator) {
        const provide = DecoratorUtils.getDecoratorParamValue(metaUtilObj.classProvidedBindingsDecorator, prop);
        if (provide) {
            if (!md.binding) {
                md.binding = {};
            }
            md.binding.provide = provide;
        }
    }
    delete md["isArrayOfObject"];
    return md;
}
function isDefaultProps(node) {
    return (ts.isPropertyDeclaration(node) && node.name.getText() === "defaultProps");
}
exports.isDefaultProps = isDefaultProps;
function updateDefaultsFromDefaultProps(defaultProps, metaUtilObj) {
    var _a;
    const fullPropsMeta = (_a = metaUtilObj.fullMetadata) === null || _a === void 0 ? void 0 : _a.properties;
    defaultProps.properties.forEach((prop) => {
        if (ts.isPropertyAssignment(prop)) {
            const propName = prop.name.getText();
            const propMetadata = fullPropsMeta === null || fullPropsMeta === void 0 ? void 0 : fullPropsMeta[propName];
            if (propMetadata) {
                updateDefaultValue(propMetadata, propName, prop, metaUtilObj);
            }
            else {
                reportInvalidDefaultPropsDefault(propName, metaUtilObj);
            }
        }
    });
}
exports.updateDefaultsFromDefaultProps = updateDefaultsFromDefaultProps;
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
function reportInvalidDefaultPropsDefault(propName, metaUtilObj) {
    var _a, _b;
    const fullMeta = metaUtilObj.fullMetadata;
    let errMsg;
    if (propName === MetaTypes.DEFAULT_SLOT_PROP || ((_a = fullMeta.slots) === null || _a === void 0 ? void 0 : _a[propName])) {
        return;
    }
    else {
        if (propName.length > 2) {
            const eventPropName = `${propName[2].toLowerCase()}${propName.substring(3)}`;
            if ((_b = fullMeta.events) === null || _b === void 0 ? void 0 : _b[eventPropName]) {
                errMsg = `The '${propName}' event handler cannot be initialized through defaultProps.`;
            }
        }
        if (!errMsg) {
            errMsg = `Unknown property '${propName}' cannot be initialized through defaultProps.`;
        }
    }
    throw new TransformerError_1.TransformerError(metaUtilObj.componentClassName, errMsg);
}
