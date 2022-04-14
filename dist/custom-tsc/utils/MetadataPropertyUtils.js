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
    let readOnlyPropNameNodes = [];
    let writebackPropNameNodes = [];
    let elementReadOnlyPropNameNodes = [];
    MetaUtils.walkTypeMembers(propsInfo.propsType, metaUtilObj, (memberSymbol, memberKey, mappedTypeSymbol) => {
        var _a;
        if (!TypeUtils.isGenericTypeParameter(memberSymbol)) {
            const propDeclaration = memberSymbol.valueDeclaration;
            const prop = memberKey;
            const typeName = TypeUtils.getPropertyType(propDeclaration.type, propDeclaration.name.getText());
            const writebackPropInfo = getWritebackPropInfo(prop, propDeclaration, typeName, metaUtilObj);
            if (writebackPropInfo.propName) {
                writebackPropNameNodes.push({
                    name: writebackPropInfo.propName,
                    node: propDeclaration
                });
                if (writebackPropInfo.isReadOnly) {
                    const readOnlyWritebackProp = writebackPropInfo.propName;
                    const eroMatch = elementReadOnlyPropNameNodes.find((item) => item.name === readOnlyWritebackProp);
                    if (eroMatch) {
                        throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `Duplicate read-only writeback property "${readOnlyWritebackProp}" detected. Delete extraneous property of type "ElementReadOnly".`, eroMatch.node);
                    }
                    else if ((_a = metaUtilObj.rtMetadata.properties) === null || _a === void 0 ? void 0 : _a[readOnlyWritebackProp]) {
                        throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `"Duplicate "${readOnlyWritebackProp}" property detected.`, propDeclaration);
                    }
                    const rt = getMetadataForProperty(readOnlyWritebackProp, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MetadataScope.RT, metaUtilObj, MetaTypes.GETMD_FLAGS_RO_WRITEBACK);
                    const dt = getMetadataForProperty(readOnlyWritebackProp, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MetadataScope.DT, metaUtilObj, MetaTypes.GETMD_FLAGS_RO_WRITEBACK);
                    rt.readOnly = true;
                    dt.readOnly = true;
                    readOnlyPropNameNodes.push({
                        name: readOnlyWritebackProp,
                        node: propDeclaration
                    });
                    if (!metaUtilObj.rtMetadata.properties) {
                        metaUtilObj.rtMetadata.properties = {};
                    }
                    if (!metaUtilObj.fullMetadata.properties) {
                        metaUtilObj.fullMetadata.properties = {};
                    }
                    metaUtilObj.rtMetadata.properties[readOnlyWritebackProp] = rt;
                    metaUtilObj.fullMetadata.properties[readOnlyWritebackProp] = dt;
                }
            }
            else if (!SlotUtils.generateSlotsMetadata(prop, propDeclaration, typeName, metaUtilObj) &&
                !MetadataEventUtils_1.generateEventsMetadata(prop, propDeclaration, metaUtilObj)) {
                if (readOnlyPropNameNodes.find((item) => item.name === prop)) {
                    const errMsg = typeName === `${metaUtilObj.namedExportToAlias.ElementReadOnly}`
                        ? `Duplicate read-only writeback property "${prop}" detected. Delete extraneous property of type "ElementReadOnly".`
                        : `"Duplicate "${prop}" property detected.`;
                    throw new TransformerError_1.TransformerError(metaUtilObj.componentName, errMsg, propDeclaration);
                }
                if (!metaUtilObj.rtMetadata.properties) {
                    metaUtilObj.rtMetadata.properties = {};
                }
                if (!metaUtilObj.fullMetadata.properties) {
                    metaUtilObj.fullMetadata.properties = {};
                }
                const rt = getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MetadataScope.RT, metaUtilObj);
                const dt = getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MetadataScope.DT, metaUtilObj);
                metaUtilObj.rtMetadata.properties[prop] = rt;
                metaUtilObj.fullMetadata.properties[prop] = dt;
                if (typeName === `${metaUtilObj.namedExportToAlias.ElementReadOnly}`) {
                    rt.readOnly = true;
                    dt.readOnly = true;
                    const roNameNode = { name: prop, node: propDeclaration };
                    readOnlyPropNameNodes.push(roNameNode);
                    elementReadOnlyPropNameNodes.push(roNameNode);
                    const logHeader = TransformerError_1.TransformerError.getMsgHeader(metaUtilObj.componentName, propDeclaration);
                    const uppercaseProp = prop.charAt(0).toUpperCase() + prop.slice(1);
                    console.log(`${logHeader} '${prop}' property is declared to be of deprecated type 'ElementReadOnly'.
In order to upgrade, delete this '${prop}' field and instead declare a callback property 'on${uppercaseProp}Changed' of type 'ReadOnlyPropertyChanged'.`);
                }
            }
        }
    });
    return { writebackPropNameNodes, readOnlyPropNameNodes };
}
exports.generatePropertiesMetadata = generatePropertiesMetadata;
function checkReservedProps(propsInfo, metaUtilObj) {
    MetaUtils.walkTypeMembers(propsInfo.propsType, metaUtilObj, (memberSymbol, memberKey, mappedTypeSymbol) => {
        var _a, _b;
        if (TypeUtils.isGenericTypeParameter(memberSymbol)) {
            return;
        }
        const prop = memberKey;
        const propDecl = (_a = memberSymbol.declarations) === null || _a === void 0 ? void 0 : _a[0];
        switch (prop) {
            case 'ref':
            case 'key':
                throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `'${prop}' is a reserved property and cannot be redefined.`, propDecl);
            case 'className':
                throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `The 'className' property is not allowed. Use the global HTML 'class' property to specify style classes.`, propDecl);
            case 'htmlFor':
                throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `The 'htmlFor' property is not allowed. Define a 'for' property of type string instead, for the id of a labelable form-related element.`, propDecl);
            case 'class':
            case 'style':
                throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `'${prop}' is a global HTML property already accessible to VComponents and cannot be overridden.`, propDecl);
            default:
                if ((_b = metaUtilObj['reservedGlobalProps']) === null || _b === void 0 ? void 0 : _b.has(prop)) {
                    const logHeader = TransformerError_1.TransformerError.getMsgHeader(metaUtilObj.componentName, propDecl);
                    console.log(`${logHeader} '${prop}' property declaration overrides a global HTML property.
As an alternative, use the ObservedGlobalProps utility type to specify observable global HTML properties.`);
                }
                break;
        }
    });
}
exports.checkReservedProps = checkReservedProps;
function generatePropertiesRtExtensionMetadata(writebackPropNameNodes, readOnlyPropNameNodes, observedGlobalProps, metaUtilObj) {
    if (writebackPropNameNodes.length || readOnlyPropNameNodes.length) {
        const rtPropsMeta = metaUtilObj.rtMetadata.properties;
        const fullPropsMeta = metaUtilObj.fullMetadata.properties;
        const writebackProps = [];
        const readOnlyProps = [];
        for (const propNameNode of writebackPropNameNodes) {
            const prop = propNameNode.name;
            writebackProps.push(prop);
            if (!rtPropsMeta[prop]) {
                throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `Writeback property callback found, but property '${prop}' was not defined.`, propNameNode.node);
            }
            rtPropsMeta[prop].writeback = true;
            fullPropsMeta[prop].writeback = true;
        }
        for (const propNameNode of readOnlyPropNameNodes) {
            const prop = propNameNode.name;
            readOnlyProps.push(prop);
            if (writebackProps.indexOf(prop) === -1) {
                throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `Read-only writeback property '${prop}' found, but no callback property was defined.`, propNameNode.node);
            }
        }
        MetaUtils.updateRtExtensionMetadata('_WRITEBACK_PROPS', writebackProps, metaUtilObj);
        MetaUtils.updateRtExtensionMetadata('_READ_ONLY_PROPS', readOnlyProps, metaUtilObj);
    }
    if (observedGlobalProps === null || observedGlobalProps === void 0 ? void 0 : observedGlobalProps.length) {
        MetaUtils.updateRtExtensionMetadata('_OBSERVED_GLOBAL_PROPS', observedGlobalProps, metaUtilObj);
    }
}
exports.generatePropertiesRtExtensionMetadata = generatePropertiesRtExtensionMetadata;
function getWritebackPropInfo(prop, propDecl, typeName, metaUtilObj) {
    let rtnInfo = {
        isReadOnly: false
    };
    switch (typeName) {
        case `${metaUtilObj.namedExportToAlias.ReadOnlyPropertyChanged}`:
            rtnInfo.isReadOnly = true;
        case `${metaUtilObj.namedExportToAlias.PropertyChanged}`:
            rtnInfo.propName = MetaUtils.writebackCallbackToProperty(prop);
            if (!rtnInfo.propName) {
                throw new TransformerError_1.TransformerError(metaUtilObj.componentName, `Writeback property callback found, but property '${prop}' does not meet the 'on[Property]Changed' naming syntax.`, propDecl);
            }
            break;
        default:
            break;
    }
    return rtnInfo;
}
function getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, scope, metaUtilObj, flags = MetaTypes.GETMD_FLAGS_NONE) {
    let md;
    const propsName = metaUtilObj.propsName;
    const metaObj = TypeUtils.getAllMetadataForDeclaration(propDeclaration, scope, metaUtilObj, flags, memberSymbol);
    let stack = [];
    if (scope == MetaTypes.MetadataScope.DT && metaObj.isArrayOfObject) {
        stack.push(propDeclaration.name.getText());
    }
    const subprops = TypeUtils.getComplexPropertyMetadata(memberSymbol, metaObj.type, propsName, scope, stack, metaUtilObj);
    md = metaObj;
    if (scope == MetaTypes.MetadataScope.DT) {
        const propSym = mappedTypeSymbol !== null && mappedTypeSymbol !== void 0 ? mappedTypeSymbol : memberSymbol;
        md['optional'] = propSym.flags & ts.SymbolFlags.Optional ? true : false;
    }
    if (subprops) {
        if (subprops.circRefDetected) {
            md.type = TypeUtils.getSubstituteTypeForCircularReference(metaObj);
        }
        else if (metaObj.isArrayOfObject) {
            if (scope == MetaTypes.MetadataScope.DT) {
                md.extension = {};
                md.extension['vbdt'] = {};
                md.extension['vbdt']['itemProperties'] = subprops;
            }
        }
        else {
            const typeNames = md.type.split(MetaUtils._UNION_SPLITTER);
            md.type =
                typeNames.length <= 1 || typeNames.indexOf('null') === -1 ? 'object' : 'object|null';
            md.properties = subprops;
        }
    }
    if (propDeclaration.initializer) {
        const logHeader = TransformerError_1.TransformerError.getMsgHeader(metaUtilObj.componentName, propDeclaration);
        console.log(`${logHeader} Default value should be set using defaultProps for '${memberSymbol.name}'.`);
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
    delete md['isArrayOfObject'];
    return md;
}
function isDefaultProps(node) {
    return ts.isPropertyDeclaration(node) && node.name.getText() === 'defaultProps';
}
exports.isDefaultProps = isDefaultProps;
function updateDefaultsFromDefaultProps(defaultProps, metaUtilObj) {
    var _a;
    const fullPropsMeta = (_a = metaUtilObj.fullMetadata) === null || _a === void 0 ? void 0 : _a.properties;
    defaultProps.forEach((prop) => {
        if (ts.isPropertyAssignment(prop) ||
            (ts.isBindingElement(prop) && prop.initializer && !prop.dotDotDotToken)) {
            const propName = prop.name.getText();
            const propMetadata = fullPropsMeta === null || fullPropsMeta === void 0 ? void 0 : fullPropsMeta[propName];
            if (propMetadata) {
                updateDefaultValue(propMetadata, propName, prop, metaUtilObj);
            }
            else {
                reportInvalidDefaultPropsDefault(propName, prop, metaUtilObj);
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
    let defaultValue;
    let defValueExpression = propDeclaration.initializer;
    if (defValueExpression) {
        if (ts.isBindingElement(propDeclaration) && ts.isObjectLiteralExpression(defValueExpression)) {
            const logHeader = TransformerError_1.TransformerError.getMsgHeader(metaUtilObj.componentName, defValueExpression);
            console.log(`${logHeader} Default object literal values can cause extra render calls on child components.
Use a reference to a non-primitive constant instead.`);
        }
        if (ts.isIdentifier(defValueExpression)) {
            const constSymbol = metaUtilObj.typeChecker.getSymbolAtLocation(defValueExpression);
            if (constSymbol &&
                constSymbol.valueDeclaration.initializer) {
                defValueExpression = constSymbol.valueDeclaration
                    .initializer;
            }
        }
        else if (ts.isAsExpression(defValueExpression)) {
            defValueExpression = defValueExpression.expression;
        }
        defaultValue = defValueExpression.getText();
        const value = MetaUtils.stringToJS(propertyName, defValueExpression.kind, defaultValue, metaUtilObj);
        if (value !== undefined) {
            if (!md.properties) {
                md.value = value;
            }
            else {
                updateComplexPropertyValues(md.properties, value);
            }
            metaUtilObj.defaultProps = metaUtilObj.defaultProps || {};
            metaUtilObj.defaultProps[propertyName] = value;
        }
    }
}
function reportInvalidDefaultPropsDefault(propName, propNode, metaUtilObj) {
    var _a, _b, _c;
    const fullMeta = metaUtilObj.fullMetadata;
    const observedGlobalProps = (_a = metaUtilObj.rtMetadata.extension) === null || _a === void 0 ? void 0 : _a._OBSERVED_GLOBAL_PROPS;
    let errMsg;
    if (propName === MetaTypes.DEFAULT_SLOT_PROP || ((_b = fullMeta.slots) === null || _b === void 0 ? void 0 : _b[propName])) {
        return;
    }
    else {
        if (propName.length > 2) {
            const eventPropName = `${propName[2].toLowerCase()}${propName.substring(3)}`;
            if ((_c = fullMeta.events) === null || _c === void 0 ? void 0 : _c[eventPropName]) {
                errMsg = `The '${propName}' event handler cannot be initialized with a default property value.`;
            }
        }
        if (!errMsg && (observedGlobalProps === null || observedGlobalProps === void 0 ? void 0 : observedGlobalProps.indexOf(propName)) >= 0) {
            if (!propNode.initializer) {
                return;
            }
            else {
                errMsg = `Observed GlobalProp '${propName}' cannot be initialized with a default property value.`;
            }
        }
        if (!errMsg) {
            errMsg = `Unknown property '${propName}' cannot be initialized with a default property value.`;
        }
    }
    throw new TransformerError_1.TransformerError(metaUtilObj.componentName, errMsg, propNode);
}
//# sourceMappingURL=MetadataPropertyUtils.js.map