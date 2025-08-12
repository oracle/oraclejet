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
exports.CMContext = void 0;
exports.generateVdomPropertiesMetadata = generateVdomPropertiesMetadata;
exports.generateVdomParamMetadata = generateVdomParamMetadata;
exports.generateVdomReturnMetadata = generateVdomReturnMetadata;
const ts = __importStar(require("typescript"));
const DefaultProps_1 = require("./DefaultProps");
const Utils_1 = require("./Utils");
/**
 * Context flags when recursively generating Content Metadata
 */
var CMContext;
(function (CMContext) {
    // Basic context
    CMContext[CMContext["PROPERTY"] = 1] = "PROPERTY";
    CMContext[CMContext["PARAM"] = 2] = "PARAM";
    CMContext[CMContext["RETURN"] = 4] = "RETURN";
    // Additional context that can be added onto the basics
    CMContext[CMContext["IN_EXTENSION"] = 8] = "IN_EXTENSION"; // currently in extension metadata?
})(CMContext || (exports.CMContext = CMContext = {}));
/////////////////////////////
// Content Metadata Utilities
/////////////////////////////
function generateVdomPropertiesMetadata(type, context, seen, checker, defaultProps) {
    const props = {};
    // Loop thru the properties of the specified type for the given
    // Content Metadata context
    (0, Utils_1.walkPropertiesOfType)(type, checker, (propSymbol, propName) => {
        // Set the current property's 'type' metadata based upon
        // the type derived from its Symbol
        const propType = checker.getTypeOfSymbol(propSymbol);
        const propMD = {
            type: checker.typeToString(propType)
        };
        // Set its 'description' metadata, as well as whether it is flagged as optional
        const docComment = (0, Utils_1.getCommentForSymbol)(propSymbol, checker);
        if (docComment) {
            propMD.description = docComment;
        }
        if (propSymbol.flags & ts.SymbolFlags.Optional) {
            propMD.optional = true;
        }
        // If a match is found in the (optional) defaultProps array, set the
        // current property's 'value' metadata
        const defElement = defaultProps?.find((elem) => elem.name?.getText() === propName);
        if (defElement) {
            propMD.value = (0, DefaultProps_1.getDefaultPropValue)(defElement, checker);
        }
        // If the current property has sub-properties for a type that we have
        // not yet seen, attempt to recursively generate sub-properties metadata
        const subProps = _getSubPropsInfo(propType, checker);
        if (subProps && !seen.has(subProps.typeName)) {
            const subPropsMD = generateVdomPropertiesMetadata(subProps.type, subProps.isArray ? context | CMContext.IN_EXTENSION : context, new Set([...seen, subProps.typeName]), checker);
            // If sub-properties metadata was successfully generated, figure out
            // where it goes:
            //
            //    * if the subProps type was an array and we are not already within
            //      extension metadata, set 'extension.vbdt.itemProperties' metadata
            //    * otherwise set 'properties' metadata
            //
            if (subPropsMD !== undefined) {
                if (subProps.isArray && !(context & CMContext.IN_EXTENSION)) {
                    propMD.extension = propMD.extension ?? {};
                    propMD.extension['vbdt'] = propMD.extension['vbdt'] ?? {};
                    propMD.extension['vbdt']['itemProperties'] = subPropsMD;
                }
                else {
                    propMD.properties = subPropsMD;
                }
            }
        }
        // Add generated metadata for the current property
        props[propName] = propMD;
    });
    // If props was filled in, return it; otherwise return undefined
    return Object.keys(props).length > 0 ? props : undefined;
}
function generateVdomParamMetadata(paramDecl, tags, checker) {
    const paramType = checker.getTypeAtLocation(paramDecl);
    const param = {
        name: paramDecl.name.getText(),
        type: checker.typeToString(paramType)
    };
    // If there's a JSDoc tag associated with this parameter,
    // use its comment for the parmeter 'description' metadata
    const paramTag = tags.find((tag) => ts.isJSDocParameterTag(tag) && tag.name.getText() === param.name);
    const paramComment = ts.getTextOfJSDocComment(paramTag?.comment);
    if (paramComment) {
        param.description = paramComment;
    }
    if (paramDecl.questionToken !== undefined) {
        param.optional = true;
    }
    param.value = (0, Utils_1.getMDValue)(paramDecl.initializer, checker);
    // If this parameter has sub-properties, generate sub-properties metadata
    const paramSubProps = _getSubPropsInfo(paramType, checker);
    if (paramSubProps) {
        const seen = new Set();
        seen.add(paramSubProps.typeName);
        const paramSubMD = generateVdomPropertiesMetadata(paramSubProps.type, paramSubProps.isArray ? CMContext.PARAM | CMContext.IN_EXTENSION : CMContext.PARAM, seen, checker);
        // If sub-properties metadata was generated, figure out where it goes
        if (paramSubMD !== undefined) {
            if (paramSubProps.isArray) {
                param.extension = param.extension ?? {};
                param.extension['vbdt'] = param.extension['vbdt'] ?? {};
                param.extension['vbdt']['itemProperties'] = paramSubMD;
            }
            else {
                param.properties = paramSubMD;
            }
        }
    }
    return param;
}
function generateVdomReturnMetadata(rtnType, tags, checker) {
    const rtn = {
        type: checker.typeToString(rtnType)
    };
    // If there's a JSDoc tag describing the function's return,
    // use its comment for the return 'description' metadata
    const rtnTag = tags.find((tag) => ts.isJSDocReturnTag(tag));
    const rtnComment = ts.getTextOfJSDocComment(rtnTag?.comment);
    if (rtnComment) {
        rtn.description = rtnComment;
    }
    // If the function return has sub-properties, generate sub-properties metadata
    const rtnSubProps = _getSubPropsInfo(rtnType, checker);
    if (rtnSubProps) {
        const seen = new Set();
        seen.add(rtnSubProps.typeName);
        const rtnSubMD = generateVdomPropertiesMetadata(rtnSubProps.type, rtnSubProps.isArray ? CMContext.RETURN | CMContext.IN_EXTENSION : CMContext.RETURN, seen, checker);
        // If sub-properties metadata was generated, figure out where it goes
        if (rtnSubMD !== undefined) {
            if (rtnSubProps.isArray) {
                rtn.extension = rtn.extension ?? {};
                rtn.extension['vbdt'] = rtn.extension['vbdt'] ?? {};
                rtn.extension['vbdt']['itemProperties'] = rtnSubMD;
            }
            else {
                rtn.properties = rtnSubMD;
            }
        }
    }
    return rtn;
}
////////////////////
// Private utilities
////////////////////
function _getSubPropsInfo(propType, checker) {
    let subProps = undefined;
    let isArray = false;
    // First, get the non-nullable version of the type to remove
    // unions with null and/or undefined
    propType = checker.getNonNullableType(propType);
    // NOTE:  TypeChecker's 'isArrayLikeType' returns true for Tuple types,
    //        which we are currently not set up to represent in JET metadata.
    //        Therefore, we bail and treat tuple types as if they had no
    //        interesting sub-properties.
    //
    // TODO Add support for tuple types?
    if (!checker.isTupleType(propType)) {
        // If the resulting propType is "array-like", get its
        // (non-nullable) first type argument
        // NOTE:  We assume arrays contain items of the same type.
        if (checker.isArrayLikeType(propType)) {
            isArray = true;
            const elemType = checker.getTypeArguments(propType)?.[0];
            propType = elemType ? checker.getNonNullableType(elemType) : undefined;
        }
        // If at this point we have a propType that is either an Intersection type or
        // that is flagged as an 'Object' (without being a nested Array), then return
        // a SubPropsInfo instance for generating sub-properties metadata.
        if (propType &&
            ((propType.flags & ts.TypeFlags.Object && !checker.isArrayLikeType(propType)) ||
                propType.isIntersection())) {
            subProps = {
                type: propType,
                typeName: checker.typeToString(propType),
                isArray
            };
        }
    }
    return subProps;
}
//# sourceMappingURL=ContentMetadata.js.map