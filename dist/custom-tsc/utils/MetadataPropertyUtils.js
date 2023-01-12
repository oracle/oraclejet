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
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DUPLICATE_ROWRITEBACK_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Duplicate read-only writeback property '${readOnlyWritebackProp}' detected. Delete extraneous property of type 'ElementReadOnly'.`, eroMatch.node);
                    }
                    else if ((_a = metaUtilObj.rtMetadata.properties) === null || _a === void 0 ? void 0 : _a[readOnlyWritebackProp]) {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DUPLICATE_PROP_ROWRITEBACK, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Duplicate '${readOnlyWritebackProp}' property detected.`, propDeclaration);
                    }
                    const rt = getMetadataForProperty(readOnlyWritebackProp, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MetadataScope.RT, MetaTypes.MDFlags.PROP | MetaTypes.MDFlags.PROP_RO_WRITEBACK, metaUtilObj);
                    const dt = getMetadataForProperty(readOnlyWritebackProp, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MetadataScope.DT, MetaTypes.MDFlags.PROP | MetaTypes.MDFlags.PROP_RO_WRITEBACK, metaUtilObj);
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
                !(0, MetadataEventUtils_1.generateEventsMetadata)(prop, propDeclaration, metaUtilObj)) {
                if (readOnlyPropNameNodes.find((item) => item.name === prop)) {
                    if (typeName === `${metaUtilObj.namedExportToAlias.ElementReadOnly}`) {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DUPLICATE_ROWRITEBACK_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Duplicate read-only writeback property '${prop}' detected. Delete extraneous property of type 'ElementReadOnly'.`, propDeclaration);
                    }
                    else {
                        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DUPLICATE_PROP_ROWRITEBACK, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Duplicate '${prop}' property detected.`, propDeclaration);
                    }
                }
                if (!metaUtilObj.rtMetadata.properties) {
                    metaUtilObj.rtMetadata.properties = {};
                }
                if (!metaUtilObj.fullMetadata.properties) {
                    metaUtilObj.fullMetadata.properties = {};
                }
                const rt = getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MetadataScope.RT, MetaTypes.MDFlags.PROP, metaUtilObj);
                const dt = getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, MetaTypes.MetadataScope.DT, MetaTypes.MDFlags.PROP, metaUtilObj);
                metaUtilObj.rtMetadata.properties[prop] = rt;
                metaUtilObj.fullMetadata.properties[prop] = dt;
                if (typeName === `${metaUtilObj.namedExportToAlias.ElementReadOnly}`) {
                    rt.readOnly = true;
                    dt.readOnly = true;
                    const roNameNode = { name: prop, node: propDeclaration };
                    readOnlyPropNameNodes.push(roNameNode);
                    elementReadOnlyPropNameNodes.push(roNameNode);
                    const uppercaseProp = prop.charAt(0).toUpperCase() + prop.slice(1);
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DEPRECATED_ELEMENTREADONLY, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'${prop}' property is declared to be of deprecated type 'ElementReadOnly'.
In order to upgrade, delete this '${prop}' field and instead declare a callback property 'on${uppercaseProp}Changed' of type 'ReadOnlyPropertyChanged'.`, propDeclaration);
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
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_REF_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'ref' is a reserved property and cannot be redefined.`, propDecl);
                break;
            case 'key':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_KEY_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'key' is a reserved property and cannot be redefined.`, propDecl);
                break;
            case 'className':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_CLASSNAME_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `The 'className' property is not allowed. Use the global HTML 'class' property to specify style classes.`, propDecl);
                break;
            case 'htmlFor':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_HTMLFOR_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `The 'htmlFor' property is not allowed. Define a 'for' property of type string instead, for the id of a labelable form-related element.`, propDecl);
                break;
            case 'class':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_CLASS_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'class' is a global HTML property already accessible to VComponents and cannot be overridden.`, propDecl);
                break;
            case 'style':
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_STYLE_PROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `'style' is a global HTML property already accessible to VComponents and cannot be overridden.`, propDecl);
                break;
            default:
                if ((_b = metaUtilObj['reservedGlobalProps']) === null || _b === void 0 ? void 0 : _b.has(prop)) {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.RESERVED_GLOBAL_PROP, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `'${prop}' property declaration overrides a global HTML property.
As an alternative, use the ObservedGlobalProps utility type to specify observable global HTML properties.`, propDecl);
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
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.WRITEBACK_NO_PROP_MATCH, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Writeback property callback found, but property '${prop}' was not defined.`, propNameNode.node);
            }
            rtPropsMeta[prop].writeback = true;
            fullPropsMeta[prop].writeback = true;
        }
        for (const propNameNode of readOnlyPropNameNodes) {
            const prop = propNameNode.name;
            readOnlyProps.push(prop);
            if (writebackProps.indexOf(prop) === -1) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.ROWRITEBACK_NO_PROP_MATCH, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Read-only writeback property '${prop}' found, but no callback property was defined.`, propNameNode.node);
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
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.WRITEBACK_MISSING_PREFIX, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Writeback property callback found, but property '${prop}' does not meet the 'on[Property]Changed' naming syntax.`, propDecl);
            }
            break;
        default:
            break;
    }
    return rtnInfo;
}
function getMetadataForProperty(prop, memberSymbol, propDeclaration, mappedTypeSymbol, scope, flags, metaUtilObj) {
    let md;
    const propsName = metaUtilObj.propsName;
    const propertyPath = [prop];
    const metaObj = TypeUtils.getAllMetadataForDeclaration(propDeclaration, scope, flags, propertyPath, memberSymbol, metaUtilObj);
    if (scope == MetaTypes.MetadataScope.DT && metaObj.type == 'function') {
        let declTypeNode = propDeclaration.type;
        const type = metaUtilObj.typeChecker.getTypeAtLocation(declTypeNode);
        let typeDeclaration = TypeUtils.getTypeDeclaration(type);
        if ((typeDeclaration === null || typeDeclaration === void 0 ? void 0 : typeDeclaration.kind) == ts.SyntaxKind.FunctionType) {
            const parameters = typeDeclaration.parameters;
            const functionParams = [];
            parameters.forEach((parameter) => {
                const name = parameter.name.getText();
                const symbol = parameter['symbol'];
                if (symbol) {
                    const typeObj = getMetadataForProperty(name, symbol, parameter, null, MetaTypes.MetadataScope.DT, MetaTypes.MDFlags.METHOD_PARAM, metaUtilObj);
                    const mParamObj = Object.assign({ name }, typeObj);
                    functionParams.push(mParamObj);
                }
            });
            if (functionParams.length > 0) {
                metaObj['jsdoc'] = metaObj['jsdoc'] || {};
                metaObj['jsdoc']['params'] = functionParams;
            }
        }
    }
    let nestedArrayStack = [];
    if (scope == MetaTypes.MetadataScope.DT && metaObj.isArrayOfObject) {
        nestedArrayStack.push(propDeclaration.name.getText());
    }
    const subprops = TypeUtils.getComplexPropertyMetadata(memberSymbol, metaObj.type, propsName, scope, flags, propertyPath, nestedArrayStack, metaUtilObj);
    md = metaObj;
    if (scope == MetaTypes.MetadataScope.DT) {
        const propSym = mappedTypeSymbol !== null && mappedTypeSymbol !== void 0 ? mappedTypeSymbol : memberSymbol;
        md['optional'] = propSym.flags & ts.SymbolFlags.Optional ? true : false;
    }
    if (subprops) {
        if (subprops.circRefDetected) {
            md.type = TypeUtils.getSubstituteTypeForCircularReference(metaObj);
        }
        else {
            if (scope == MetaTypes.MetadataScope.DT) {
                const typeDef = TypeUtils.getPossibleTypeDef(prop, memberSymbol, metaObj, metaUtilObj);
                if (typeDef && typeDef.name) {
                    md['jsdoc'] = md['jsdoc'] || {};
                    md['jsdoc']['typedef'] = typeDef;
                }
            }
            if (metaObj.isArrayOfObject) {
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
    }
    if (propDeclaration.initializer) {
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_NO_DEFAULTPROPS, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Default value should be set using defaultProps for '${memberSymbol.name}'.`, propDeclaration);
    }
    if (metaUtilObj.functionPropBindings) {
        if (metaUtilObj.functionPropBindings[prop]) {
            md.binding = metaUtilObj.functionPropBindings[prop];
        }
    }
    else {
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
    }
    delete md['isArrayOfObject'];
    delete md['isStringTypeExplicit'];
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
function updateDefaultValue(md, propertyName, propDeclaration, metaUtilObj) {
    let defaultValue;
    let defValueExpression = propDeclaration.initializer;
    if (defValueExpression) {
        if (ts.isBindingElement(propDeclaration) && ts.isObjectLiteralExpression(defValueExpression)) {
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_OBJECT_LITERAL, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `Default object literal values can cause extra render calls on child components.
Use a reference to a non-primitive constant instead.`, defValueExpression);
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
        if (ts.isObjectLiteralExpression(defValueExpression) ||
            ts.isArrayLiteralExpression(defValueExpression)) {
            let start = 0;
            let sections = [];
            const castRegExp = /\s+as\s+\w+/gm;
            const quotedStringRegExp = /(['"])(?:[\s\S])*?\1/gm;
            const quotedStringMatches = defaultValue.matchAll(quotedStringRegExp);
            for (const match of quotedStringMatches) {
                if (match.index > start) {
                    const section = defaultValue.substring(start, match.index).replace(castRegExp, '');
                    sections.push(section);
                }
                sections.push(defaultValue.substring(match.index, match.index + match[0].length));
                start = match.index + match[0].length;
            }
            if (sections.length > 0) {
                if (start < defaultValue.length) {
                    sections.push(defaultValue.substring(start).replace(castRegExp, ''));
                }
                defaultValue = sections.join('');
            }
            else {
                defaultValue = defaultValue.replace(castRegExp, '');
            }
        }
        const value = MetaUtils.stringToJS(propertyName, defValueExpression.kind, defaultValue, metaUtilObj);
        if (value !== undefined) {
            if (!md.properties || value === null) {
                md.value = value;
            }
            else if (isAnObject(value)) {
                updateComplexPropertyValues(md.properties, value, defValueExpression, metaUtilObj);
            }
            else {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_NONOBJECT_VALUE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Non-object default value '${value}' specified for object property '${propertyName}'.`, defValueExpression);
            }
            metaUtilObj.defaultProps = metaUtilObj.defaultProps || {};
            metaUtilObj.defaultProps[propertyName] = value;
        }
    }
}
function updateComplexPropertyValues(md, values, valueExpression, metaUtilObj) {
    if (md) {
        for (let [key, value] of Object.entries(values)) {
            if (value !== undefined) {
                if (!md[key].properties || value === null) {
                    md[key].value = value;
                }
                else if (isAnObject(value)) {
                    updateComplexPropertyValues(md[key].properties, value, valueExpression, metaUtilObj);
                }
                else {
                    TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_NONOBJECT_VALUE, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Non-object default value '${value}' specified for object sub-property '${key}'.`, valueExpression);
                }
            }
        }
    }
}
function isAnObject(value) {
    return typeof value === 'object' && !Array.isArray(value);
}
function reportInvalidDefaultPropsDefault(propName, propNode, metaUtilObj) {
    var _a, _b, _c;
    const fullMeta = metaUtilObj.fullMetadata;
    const observedGlobalProps = (_a = metaUtilObj.rtMetadata.extension) === null || _a === void 0 ? void 0 : _a._OBSERVED_GLOBAL_PROPS;
    if (propName === MetaTypes.DEFAULT_SLOT_PROP || ((_b = fullMeta.slots) === null || _b === void 0 ? void 0 : _b[propName])) {
        return;
    }
    else {
        if (propName.length > 2) {
            const eventPropName = `${propName[2].toLowerCase()}${propName.substring(3)}`;
            if ((_c = fullMeta.events) === null || _c === void 0 ? void 0 : _c[eventPropName]) {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_EVENT_HANDLER, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `The '${propName}' event handler cannot be initialized with a default property value.`, propNode);
            }
        }
        if ((observedGlobalProps === null || observedGlobalProps === void 0 ? void 0 : observedGlobalProps.indexOf(propName)) >= 0) {
            if (!propNode.initializer) {
                return;
            }
            else {
                TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_OBSERVEDGLOBALPROP, TransformerError_1.ExceptionType.THROW_ERROR, metaUtilObj.componentName, `Observed GlobalProp '${propName}' cannot be initialized with a default property value.`, propNode);
            }
        }
        TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.PROP_DEFAULT_UNKNOWN_PROP, TransformerError_1.ExceptionType.WARN_IF_DISABLED, metaUtilObj.componentName, `Unknown property '${propName}' cannot be initialized with a default property value.`, propNode);
    }
}
//# sourceMappingURL=MetadataPropertyUtils.js.map