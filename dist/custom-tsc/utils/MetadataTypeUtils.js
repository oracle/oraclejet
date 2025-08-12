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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ParameterizedTypeDeclIterator_paramSource;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenericsAndTypeParameters = getGenericsAndTypeParameters;
exports.getGenericsAndTypeParametersFromType = getGenericsAndTypeParametersFromType;
exports.getSignatureFromType = getSignatureFromType;
exports.getTypeNameFromType = getTypeNameFromType;
exports.getTypeNameFromIntersectionTypes = getTypeNameFromIntersectionTypes;
exports.getNodeDeclaration = getNodeDeclaration;
exports.getTypeDeclaration = getTypeDeclaration;
exports.getTypeReferenceDeclaration = getTypeReferenceDeclaration;
exports.isTypeLiteralType = isTypeLiteralType;
exports.isGenericTypeParameter = isGenericTypeParameter;
exports.getPropertyType = getPropertyType;
exports.getPropertyTypes = getPropertyTypes;
exports.getComplexPropertyMetadata = getComplexPropertyMetadata;
exports.getComplexPropertyMetadataForType = getComplexPropertyMetadataForType;
exports.processComplexPropertyMetadata = processComplexPropertyMetadata;
exports.getSubstituteTypeForCircularReference = getSubstituteTypeForCircularReference;
exports.getAllMetadataForDeclaration = getAllMetadataForDeclaration;
exports.possibleComplexProperty = possibleComplexProperty;
exports.isClassDeclaration = isClassDeclaration;
exports.getEnumStringsFromUnion = getEnumStringsFromUnion;
exports.getPossibleTypeDef = getPossibleTypeDef;
exports.getTypeDefMetadata = getTypeDefMetadata;
exports.isLocalExport = isLocalExport;
exports.getReturnTypeForFunction = getReturnTypeForFunction;
exports.getDeclarationOfAType = getDeclarationOfAType;
exports.prettyPrintTypeForApiDoc = prettyPrintTypeForApiDoc;
const ts = __importStar(require("typescript"));
const MetaTypes = __importStar(require("./MetadataTypes"));
const MetaUtils = __importStar(require("./MetadataUtils"));
const TransformerError_1 = require("./TransformerError");
const MetadataTypes_1 = require("./MetadataTypes");
const ImportMaps_1 = require("../shared/ImportMaps");
const Utils_1 = require("../shared/Utils");
const _REGEX_LINE_AND_BLOCK_COMMENTS = new RegExp(/(\/\*(.|[\r\n])*?\*\/)|(\/\/.*)/g);
const _REGEX_EXTRA_WHITESPACE = new RegExp(/\s\s*/g);
const _REGEX_CORE_JET_TYPES = new RegExp(/\/types\/(oj[^\/]*)\/index\.d\.ts/);
const _OR_NULL = '|null';
const _OR_UNDEFINED = '|undefined';
// Placeholder in a property path or nested array stack for an index signature
const _KEY_PROP_PLACEHOLDER = '[key]';
// Set of types checked when testing for a complex property
const _NON_OBJECT_TYPES = new Set(['Array', 'bigint', 'boolean', 'function', 'number', 'string']);
// Set of type alias names that are exceptions when testing to avoid infinite recursion
// in getSignatureFromType logic for object types
const _OBJECT_TYPE_ALIAS_EXCEPTIONS = new Set(['Array', 'Map', 'Set', 'Promise']);
// Set of constraint data types that can substitute for a TypeParameter type
const _PRIMITIVE_DATA_TYPES = new Set([
    'string',
    'number',
    'boolean',
    'bigint',
    'symbol',
    'null',
    'undefined'
]);
const JS_DOM_TYPE = 'lib.dom.d.ts';
const JS_COLLECTION_TYPE = 'lib.es2015.collection.d.ts';
const WRAPPER_NAMES_FOR_SUBPROPS = new Set([
    'Array',
    'ReadonlyArray',
    'Awaited',
    'Promise',
    'Readonly',
    'ElementReadOnly',
    'ReadOnlyPropertyChanged'
]);
const WRAPPER_NAMES_FOR_APIDOC = new Set(['Partial', 'Readonly', 'Required']);
/**
 * This method can be called on a class, interface or type alias declaration node
 * that has generics.
 * Returns an object (or undefined, if no generics were used) with:
 *
 *  - the generics declaration signature (i.e., generic type params with constraints, defaults)
 *  - the generic type parameters signature (i.e., without constraints, defaults)
 *  - an array of generic type parameter names
 *  - an array of Typedef objects based upon generic constraints, for API Doc processing
 *  - a 'lenient' type parameters signature (i.e., all 'any') as requested
 *  - an array of the corresponding TypeParameterDeclaration nodes as requested
 *
 * @param node A Node that has generics type parameters
 * @param metaUtilObj Bag o'useful stuff
 * @param extras Optional bitmask of requested additional information
 */
function getGenericsAndTypeParameters(node, metaUtilObj, extras) {
    let retVal;
    let typeParams = [];
    let typeParamsExpression = [];
    let jsxTypeParam = [];
    let typeReferences = [];
    node.typeParameters?.forEach((tpn) => {
        typeParams.push(tpn.name.getText());
        typeParamsExpression.push(tpn.getText());
        if (extras & MetaTypes.GTExtras.PARAMS_ANY) {
            jsxTypeParam.push('any');
        }
        // if the type parameter has constraints, and this is a TypeReference we will try to find these
        // type references and create typedef objects, used by the API Doc
        if (tpn.constraint) {
            if (ts.isUnionTypeNode(tpn.constraint) || ts.isIntersectionTypeNode(tpn.constraint)) {
                const constraint = tpn.constraint;
                let typeRefs = [];
                for (let i = 0; i < constraint.types.length; i++) {
                    if (ts.isTypeReferenceNode(constraint.types[i])) {
                        typeRefs.push(constraint.types[i]);
                    }
                }
                typeReferences = addUniqueTypeRefs(typeReferences, typeRefs);
            }
            else if (ts.isTypeReferenceNode(tpn.constraint)) {
                typeReferences = addUniqueTypeRefs(typeReferences, [tpn.constraint]);
            }
        }
    });
    const apiDocTypeDefs = MetaUtils.createTypeDefinitionFromTypeRefs(typeReferences, metaUtilObj);
    if (typeParamsExpression.length > 0) {
        retVal = {
            genericsDeclaration: `<${typeParamsExpression.join()}>`,
            genericsTypeParams: `<${typeParams.join()}>`,
            genericsTypeParamsArray: typeParams,
            jsdoc: apiDocTypeDefs
        };
        if (extras & MetaTypes.GTExtras.PARAMS_ANY) {
            retVal.genericsTypeParamsAny = `<${jsxTypeParam.join()}>`;
        }
        if (extras & MetaTypes.GTExtras.DECL_NODES) {
            retVal.genericsTypeParamsNodes = [...node?.typeParameters];
        }
    }
    return retVal;
}
/**
 * This method can be called on a Type referenced in a Props valueDeclaration that may
 * have type parameters (e.g., an Event 'detail' type, a TemplateSlot 'data' type, etc.).
 * Note that this Type's type parameters may only reference a subset of the Props's generics,
 * and may also include non-generic type parameters.
 * Returns an object (or undefined if no type parameters were used) with:
 *
 *  - the generics declaration signature (i.e., generic type params only with constraints, defaults)
 *  - the type parameters signature (i.e., both generic and non-generic; without constraints, defaults)
 *  - the resolved generics signature (i.e, accounts for resolved generics, or missing generics
 *    where default values are assumed)
 *
 * @param typeObj A Type that has type parameters
 * @param metaUtilObj Bag o'useful stuff
 */
function getGenericsAndTypeParametersFromType(typeObj, typeNode, metaUtilObj) {
    let retVal;
    const genericsDeclSignature = [];
    const typeParamsSignature = [];
    const resolvedGenericsSignature = [];
    let currentGenericIdx = 0;
    // Iterate over the specified type's parameter declarations
    const typeParamDecls = new ParameterizedTypeDeclIterator(typeObj, typeNode, metaUtilObj.typeChecker);
    for (const decl of typeParamDecls) {
        // Is the current decl an actual (generic) TypeParameter?
        if (ts.isTypeParameterDeclaration(decl)) {
            let resolvedGeneric;
            // If we have an array of TypeParameterDeclarations for the VComp "class",
            // then attempt to remap this Type's generic TypeParameter
            if (metaUtilObj.classTypeParamsNodes) {
                let idx = metaUtilObj.propsClassTypeParamsArray?.indexOf(ts.idText(decl.name));
                // If no match was found, then assume default behavior
                // (i.e., generics are kept in the same order)
                if (idx < 0 || idx >= metaUtilObj.classTypeParamsNodes.length) {
                    idx = currentGenericIdx;
                }
                const remappedDecl = metaUtilObj.classTypeParamsNodes[idx];
                genericsDeclSignature.push(remappedDecl.getText());
                typeParamsSignature.push(ts.idText(remappedDecl.name));
                resolvedGeneric = metaUtilObj.propsTypeParamsArray?.[idx];
            }
            // Otherwise the VComp "class" is not generic so use the current
            // parameter declaration
            else {
                genericsDeclSignature.push(decl.getText());
                typeParamsSignature.push(ts.idText(decl.name));
                resolvedGeneric = metaUtilObj.propsTypeParamsArray?.[currentGenericIdx];
            }
            if (resolvedGeneric) {
                resolvedGenericsSignature.push(resolvedGeneric);
            }
            currentGenericIdx += 1; // update for next iteration
        }
        // Otherwise is the current decl is a reference to a type alias/interface/class,
        // don't include it in any of the generics signatures but DO include it in the
        // list of the other type parameters.
        else if (ts.isTypeAliasDeclaration(decl) ||
            ts.isInterfaceDeclaration(decl) ||
            ts.isClassDeclaration(decl)) {
            typeParamsSignature.push(ts.idText(decl.name));
        }
    }
    if (genericsDeclSignature.length > 0 && typeParamsSignature.length > 0) {
        retVal = {
            genericsDeclaration: `<${genericsDeclSignature.join()}>`,
            genericsTypeParams: `<${typeParamsSignature.join()}>`,
            resolvedGenericParams: `<${resolvedGenericsSignature.join()}>`
        };
    }
    return retVal;
}
/**
 * Method to parse the signature of a property declaration to determine the type that can be used in the
 * run-time/design-time metadata but also the type (reftype) that can be used in the API Doc. As part of this type signature
 * parse, we will attempt to collect type definition metadata used by the API Doc. THis metadata will be stashed away
 * in the return object of this call in the typeDefs array.
 * @param type The original type of the property signature
 * @param context The processing context (property processing, TypeDef processing)
 * @param scope The scope (DT/RT) of the method call
 * @param isPropSignatureType was this called for a property signature
 * @param seen cache to keep track of "seen" type aliases
 * @param metaUtilObj the metadata collecting top structure
 * @returns
 */
function getSignatureFromType(type, context, scope, isPropSignatureType, seen, metaUtilObj) {
    let typeObj;
    let unionWithNull = false;
    let unionWithUndefined = false;
    let unionTypes = [];
    const checker = metaUtilObj.typeChecker;
    let isNonNullableType = false;
    // usage of the isApiDocSignature key below (in setting typeobj) : we should set to false in cases, where the type/reftype
    // evaluates to a JS primitive, a union of primitives, an Array of primitives or a parameterless function.
    // unwrap any NonNullable utility type
    // since we use the resolved type parameters, these can end up being wrapped in this utility type
    // unwrap it so we can process the type as expected
    if (MetaUtils.isNonNullableType(type, metaUtilObj.typeChecker)) {
        type = unwrapNonNullableUtilityType(type, checker);
        isNonNullableType = true;
    }
    if (type.isUnionOrIntersection()) {
        // If the union type has an alias associated with it, get its name
        const unionTypeName = getTypeNameFromType(type);
        if (unionTypeName) {
            // If we have previously seen this union type's alias while getting the
            // signature for a particular declaration, then short-circuit any further
            // processing to avoid an infinite loop.
            //
            // We return a type of 'unknown' in this case:
            //  - 'object' is incorrect, as we can have a circular reference in a union type
            //    without there being a (non-Array) object;
            //  - 'any' is misleading, plus we don't want getSignatureFromUnionOrIntersectionTypes to
            //    consequently simplify the type down to 'any'
            if (seen?.has(unionTypeName)) {
                return { type: 'unknown', reftype: unionTypeName };
            }
            // Otherwise, if this is our first encounter with this union type alias,
            // add it to our set of 'seen' aliases
            else {
                seen = seen ?? new Set();
                seen.add(unionTypeName);
            }
        }
        // Typically we want to filter out undefined from a union
        // (we will let the left-hand side of the property declaration determine
        // if the property is indeed optional).
        //
        // The exception to this rule is in the context of determining the return type
        // of a Method, in which case we want to preserve the union with undefined.
        //
        // If left with only a single sub-type, process that sub-type instead of the union.
        let unionLength = type.types.length;
        unionTypes = type.types.filter(undefinedTypeFilter);
        if (unionLength > unionTypes.length && context & MetaTypes.MDContext.METHOD_RETURN) {
            unionWithUndefined = true;
        }
        if (unionTypes.length == 1) {
            type = unionTypes[0];
        }
        // Now check if one of the remaining sub-types is null.
        // If that's the case, note it and process what remains.
        else {
            unionLength = unionTypes.length;
            unionTypes = unionTypes.filter(nullTypeFilter);
            if (unionLength > unionTypes.length) {
                unionWithNull = true;
            }
            // If filtering out null leaves us with only a single sub-type,
            // process that sub-type instead of the union.
            if (unionTypes.length == 1) {
                type = unionTypes[0];
            }
        }
    }
    if (MetaUtils.isConditionalType(type)) {
        typeObj = getSignatureFromType(checker.getApparentType(type), context, scope, isPropSignatureType, seen, metaUtilObj);
    }
    else {
        const strType = checker.typeToString(type);
        // Still referencing a union type?
        if (type.isUnionOrIntersection()) {
            // Note: For intersection types we can actually have subprops in our metadata(not for union types though)
            // so if the intersection type is declared via a type alias, we can create a typeDef later
            // (in createTypeDefinitionForPropertyDeclaration) for that type alias, so let's check this use-case here
            // example: type IntersectionType = Foo & Bar;
            //          propWithIntersectionType: IntersectionType
            // instead of showing Foo & Bar in the ApiDoc (with anchor refs for Foo and Bar)
            // we would show IntersectionType with a link to a typeDef called IntersectionType
            let typeAliasDecl = getTypeDeclaration(type);
            if (typeAliasDecl && ts.isTypeAliasDeclaration(typeAliasDecl) && type.isIntersection()) {
                if (MetaUtils.isObjectType(type) || checker.getPropertiesOfType(type)?.length > 0) {
                    typeObj = { type: 'object', reftype: strType, isApiDocSignature: true };
                    if (scope == MetaTypes.MDScope.DT) {
                        let typeAliasDeclType = typeAliasDecl.type;
                        addPotentialTypeDefFromType(type, typeAliasDeclType, typeObj, checker, metaUtilObj);
                    }
                }
            }
            else {
                typeObj = getSignatureFromUnionOrIntersectionTypes(unionTypes, context, scope, seen, metaUtilObj, type.isUnion());
            }
        }
        else if (type.isStringLiteral()) {
            // a lonely enum value...
            // NOTE:  don't set reftype, as that will mask the enum in VComponent API Doc
            typeObj = { type: 'string', enumValues: [type.value] };
        }
        else if (type.isNumberLiteral()) {
            // if called in the context of getting type information for keyProperties.keys MD,
            // then treat as a lonely numerickey...; otherwise treat as usual
            typeObj =
                context & MetaTypes.MDContext.KEYPROPS_KEYS
                    ? { type: 'number', enumNumericKeys: [type.value] }
                    : { type: 'number', reftype: 'number', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.BigIntLiteral) {
            typeObj = { type: 'bigint', reftype: 'bigint', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.BooleanLiteral) {
            typeObj = { type: 'boolean', reftype: 'boolean', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.Null) {
            typeObj = { type: 'null', reftype: 'null', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.TemplateLiteral) {
            typeObj = { type: 'string', reftype: 'string', isApiDocSignature: false };
        }
        else if (type.flags & ts.TypeFlags.Index) {
            // e.g., "keyof Foo" -- preserve in API Doc
            typeObj = { type: 'string|number', reftype: strType, isApiDocSignature: true };
        }
        else if (type.isTypeParameter()) {
            // If the type parameter has a constraint type associated with it that is either
            // a primitive data type or a union of primitive data types, then use the
            // constraint type to compute typeObj.type
            // We keep the same type parameter reftype for VComponent API Doc generation
            //
            // TODO extend with logic to check Props, Component type parameter constraints, defaults, etc.
            // TODO handling for type parameters with constraints/defaults that are non-primitive types
            let constraintTypeObj;
            const constraint = type.getConstraint();
            if (constraint) {
                let constraintWithNull = false;
                let constraintWithUndefined = false;
                constraintTypeObj = getSignatureFromType(constraint, context, scope, isPropSignatureType, seen, metaUtilObj);
                if (constraint.isUnion()) {
                    const constraintSubTypes = constraintTypeObj.type.split(MetaUtils._UNION_SPLITTER);
                    // determine if constraint union includes null or undefined
                    constraintWithNull = constraintSubTypes.indexOf('null') > -1;
                    constraintWithUndefined = constraintSubTypes.indexOf('undefined') > -1;
                    // if any of the union's subtypes is not a primitive data type, abandon the constraint
                    for (const subType of constraintSubTypes) {
                        if (!_PRIMITIVE_DATA_TYPES.has(subType)) {
                            constraintTypeObj = undefined;
                            break;
                        }
                    }
                }
                else if (!_PRIMITIVE_DATA_TYPES.has(constraintTypeObj.type)) {
                    constraintTypeObj = undefined;
                }
                else {
                    constraintWithNull = constraintTypeObj.type === 'null';
                    constraintWithUndefined = constraintTypeObj.type === 'undefined';
                }
                // if we still have a valid constraint type substitution, check whether
                // we need to preserve any union with null or undefined that was not
                // part of the constraint -- the appropriate flag(s) are cleared further
                // down when we are dealing with the reftype
                if (constraintTypeObj) {
                    if (unionWithNull && !constraintWithNull) {
                        constraintTypeObj.type += _OR_NULL;
                    }
                    if (unionWithUndefined && !constraintWithUndefined) {
                        constraintTypeObj.type += _OR_UNDEFINED;
                    }
                }
            }
            typeObj = {
                type: constraintTypeObj?.type ?? 'any',
                reftype: strType,
                isApiDocSignature: true
            };
            // If the constraint type yielded enumValues, these should also be returned
            if (constraintTypeObj?.enumValues) {
                typeObj.enumValues = constraintTypeObj.enumValues;
            }
            // Finally, if the type parameter was unioned with null or undefined, preserve it
            // in the reftype for VComponent API Doc gen and clear the appropriate flag(s)
            if (unionWithNull) {
                typeObj.reftype += _OR_NULL;
                unionWithNull = false;
            }
            if (unionWithUndefined) {
                typeObj.reftype += _OR_UNDEFINED;
                unionWithUndefined = false;
            }
        }
        else if (MetaUtils.isTypeTreatedAsAny(type)) {
            typeObj = { type: 'any' };
            // If type is treated as any, then don't add back in a filtered union with null
            // since any already includes null (and no reftype required)
            unionWithNull = false;
        }
        else if (MetaUtils.isIndexedAccessTypeParameters(type)) {
            // The expectation is that indexed access type declarations
            // would have been resolved by the TypeChecker, except for
            // the special case of an IndexedAccessType whose objectType
            // and indexType are type parameters (i.e., "D[keyof D]").
            // Treat these special cases as type 'any', but keep the reftype
            // and preserve unions with null and/or undefined for the API Doc
            typeObj = { type: 'any', reftype: strType, isApiDocSignature: true };
            if (unionWithNull) {
                typeObj.reftype += _OR_NULL;
                unionWithNull = false;
            }
            if (unionWithUndefined) {
                typeObj.reftype += _OR_UNDEFINED;
                unionWithUndefined = false;
            }
        }
        else if (MetaUtils.isObjectType(type)) {
            typeObj = { type: getTypeNameFromType(type), isApiDocSignature: true };
            let typeObjTypeParams = MetaUtils.getTypeParametersFromType(type, checker);
            typeObj.reftype = typeObjTypeParams ? typeObj.type + typeObjTypeParams : typeObj.type;
            // Special processing for inline Arrays, primitive wrappers
            if (typeObj.type === 'Array') {
                typeObj = getSignatureFromArrayType(type, context, scope, strType, seen, metaUtilObj);
                // If this is a "top-level" Array property signature,
                // ignore any enumValues that might have been returned to support
                // array sub-types of union types
                if (isPropSignatureType) {
                    delete typeObj.enumValues;
                }
            }
            else if (!typeObj.type && checker.isArrayLikeType(type) && checker.isTupleType(type)) {
                typeObj = getSignatureFromArrayLikeType(type, context, scope, seen, metaUtilObj);
            }
            else if (typeObj.type === 'Number') {
                typeObj = { type: 'number', reftype: 'Number', isApiDocSignature: false };
            }
            else if (typeObj.type === 'String') {
                typeObj = { type: 'string', reftype: 'String', isApiDocSignature: false };
            }
            else if (typeObj.type === 'Boolean') {
                typeObj = { type: 'boolean', reftype: 'Boolean', isApiDocSignature: false };
            }
            else if (typeObj.type === 'BigInt') {
                typeObj = { type: 'bigint', reftype: 'BigInt', isApiDocSignature: false };
            }
            else if (typeObj.type === 'Function') {
                typeObj = { type: 'function', reftype: 'Function', isApiDocSignature: false };
            }
            else if (typeObj.type === 'Promise') {
                typeObj = { type: 'Promise', reftype: 'Promise<void>' };
            }
            else {
                let typeSymbol;
                let typeDecl;
                let isTypePreviouslySeen = false;
                if (type['symbol']) {
                    typeSymbol = type['symbol'];
                    typeDecl = typeSymbol.declarations?.[0];
                }
                if (type['aliasSymbol']) {
                    isTypePreviouslySeen = seen?.has(typeObj.type);
                    if (!isTypePreviouslySeen && !_OBJECT_TYPE_ALIAS_EXCEPTIONS.has(typeObj.type)) {
                        seen = seen ?? new Set();
                        seen.add(typeObj.type);
                    }
                    if (typeSymbol === undefined) {
                        typeSymbol = type['aliasSymbol'];
                        typeDecl = typeSymbol.declarations?.[0];
                        typeDecl = typeDecl.type;
                    }
                }
                if (typeSymbol && typeDecl) {
                    switch (typeDecl.kind) {
                        case ts.SyntaxKind.TypeLiteral:
                            typeObj.type = 'object';
                            let typeAliasDecl = getDeclarationOfAType(type);
                            if (!typeAliasDecl || !ts.isTypeAliasDeclaration(typeAliasDecl)) {
                                // for LiteralTypes, we can use the type declaration text as the reftype but make sure we are using
                                // in the context of the type passed in, so any type parameters are resolved
                                // (so use strType instead of the declaration text)
                                if (typeObj.reftype) {
                                    // but also make sure to remove | undefined for members that are optional
                                    // these undefined types are not useful in the API Doc for optional properties
                                    const updatedStrType = prettyPrintTypeLiteralForApiDoc(typeDecl);
                                    typeObj.reftype = updatedStrType
                                        .replace(_REGEX_LINE_AND_BLOCK_COMMENTS, '')
                                        .replace(_REGEX_EXTRA_WHITESPACE, ' ');
                                    typeObj.reftype = normalizeTypeLiteralString(typeObj.reftype.trim());
                                }
                                else {
                                    typeObj.reftype = 'object';
                                }
                            }
                            if (scope == MetaTypes.MDScope.DT) {
                                // look for potential typedef in the type arguments
                                addPotentialTypeDefFromType(type, typeDecl, typeObj, checker, metaUtilObj);
                            }
                            break;
                        case ts.SyntaxKind.MethodSignature:
                        case ts.SyntaxKind.MethodDeclaration:
                        case ts.SyntaxKind.FunctionType:
                            typeObj.type = 'function';
                            typeObj.reftype = strType;
                            const signatures = checker.getSignaturesOfType(type, ts.SignatureKind.Call);
                            // deal with inlined or aliased function signatures
                            if (scope == MetaTypes.MDScope.DT && signatures.length > 0) {
                                // Get the function signature from the type alias
                                const sig = signatures[0];
                                // Always set reftype from the actual function signature
                                typeObj.reftype = getFunctionReftype(sig, checker, context, scope, seen ?? new Set(), metaUtilObj);
                                // If this is a function signature, we can assume it is an API Doc signature
                                // (unless it is a parameterless function, in which case we will set isApiDocSignature to false)
                                typeObj.isApiDocSignature = true;
                                // Extract typedefs from parameters and return type
                                const collectedDefs = collectTypeDefsFromSignature(sig, checker, context, scope, new Set(), metaUtilObj);
                                if (collectedDefs.length > 0) {
                                    typeObj.typeDefs = [...(typeObj.typeDefs ?? []), ...collectedDefs];
                                }
                                // Edge case: no parameters — mark as not a full API doc signature
                                if (sig.getParameters().length === 0) {
                                    typeObj.isApiDocSignature = false;
                                }
                            }
                            break;
                        case ts.SyntaxKind.NumberKeyword:
                            typeObj.type = 'number';
                            typeObj.reftype = 'number';
                            typeObj.isApiDocSignature = false;
                            break;
                        case ts.SyntaxKind.StringKeyword:
                            typeObj.type = 'string';
                            typeObj.reftype = 'string';
                            typeObj.isApiDocSignature = false;
                            break;
                        case ts.SyntaxKind.BooleanKeyword:
                            typeObj.type = 'boolean';
                            typeObj.reftype = 'boolean';
                            typeObj.isApiDocSignature = false;
                            break;
                        case ts.SyntaxKind.BigIntKeyword:
                            typeObj.type = 'bigint';
                            typeObj.reftype = 'bigint';
                            typeObj.isApiDocSignature = false;
                            break;
                        case ts.SyntaxKind.ObjectKeyword:
                            typeObj.type = 'object';
                            typeObj.reftype = 'object';
                            typeObj.isApiDocSignature = true;
                            break;
                        case ts.SyntaxKind.FunctionKeyword:
                            typeObj.type = 'function';
                            typeObj.reftype = 'function';
                            break;
                        case ts.SyntaxKind.MappedType:
                            typeObj.isApiDocSignature = true;
                            typeObj.type = 'object';
                            // check and process the type arguments of the mapped type for possible typedef
                            // but only if we have not previously seen this type
                            // not interested in the generated type object, we already have established that in the code above
                            if (scope == MetaTypes.MDScope.DT && !isTypePreviouslySeen) {
                                if (MetaUtils.isRecordType(type)) {
                                    const recordInfo = getKeyedPropsTypeInfo(type, context, scope, seen, metaUtilObj);
                                    if (recordInfo) {
                                        const valueTypeObj = getSignatureFromType(recordInfo.valuesType, context, scope, false, seen, metaUtilObj);
                                        // in the case that the Record type was specified via a type alias, and the
                                        // Record is using type parameters, then we need to resolve the type parameters.
                                        // However it is not possible to retrieve the type of the "value" portion of the Record type,
                                        // with the type parameters resolved because we are workging with the syntax node of the type alias
                                        // This step makes sure that we will have the "value" type of the record type with resolved
                                        // type parameters
                                        // example:
                                        // type AliasToRecord<A, B> = Record<A, B>;
                                        // propdecl: AliasToRecord<Key, Data>
                                        // we want the reftype to be Record<Key, Data>
                                        if (recordInfo.valuesTypeName) {
                                            valueTypeObj.reftype = recordInfo.valuesTypeName;
                                        }
                                        if (valueTypeObj.typeDefs && valueTypeObj.typeDefs.length > 0) {
                                            typeObj.typeDefs = typeObj.typeDefs || [];
                                            typeObj.typeDefs = [...typeObj.typeDefs, ...valueTypeObj.typeDefs];
                                        }
                                        typeObj.reftype = `Record<${recordInfo.keysRefType ?? recordInfo.keysTypeName}, ${valueTypeObj.reftype ?? valueTypeObj.type}>`;
                                    }
                                }
                                else {
                                    // wrapped Record type needs further processing to properly discover any potential typedef
                                    const innerType = unwrapKnownWrapperTypes(type, metaUtilObj, WRAPPER_NAMES_FOR_APIDOC);
                                    if (innerType !== type && MetaUtils.isRecordType(innerType)) {
                                        typeObj = getSignatureFromType(innerType, context, scope, isPropSignatureType, seen, metaUtilObj);
                                    }
                                    addPotentialTypeDefFromType(type, typeDecl, typeObj, checker, metaUtilObj);
                                }
                            }
                            break;
                        case ts.SyntaxKind.InterfaceDeclaration:
                            if (!isTypePreviouslySeen) {
                                if (typeSymbol.name === 'Array') {
                                    typeObj = getSignatureFromArrayType(type, context, scope, strType, seen, metaUtilObj);
                                    // If this is a "top-level" Array reference property signature,
                                    // ignore any enumValues that might have been returned to support
                                    // array sub-types of union types
                                    if (isPropSignatureType) {
                                        delete typeObj.enumValues;
                                    }
                                    break; // if an Array was processed, we're done...
                                }
                                else if (typeSymbol.name === 'Promise') {
                                    typeObj = { type: 'Promise', reftype: 'Promise<void>', isApiDocSignature: true };
                                    break;
                                }
                                else if (typeSymbol.getName() === 'Set') {
                                    typeObj.type = 'object';
                                    if (scope == MetaTypes.MDScope.DT) {
                                        const typeArgs = checker.getTypeArguments(type);
                                        if (typeArgs.length >= 1) {
                                            const valuesType = typeArgs[0];
                                            const valuesTypeObj = getSignatureFromType(valuesType, context, scope, false, seen, metaUtilObj);
                                            if (valuesTypeObj.typeDefs && valuesTypeObj.typeDefs.length > 0) {
                                                typeObj.typeDefs = typeObj.typeDefs || [];
                                                typeObj.typeDefs = [...typeObj.typeDefs, ...valuesTypeObj.typeDefs];
                                            }
                                            typeObj.type = `Set<${valuesTypeObj.type}>`;
                                            typeObj.reftype = `Set<${valuesTypeObj.reftype ?? valuesTypeObj.type}>`;
                                        }
                                    }
                                    break;
                                }
                                else if (typeSymbol.name === 'Map') {
                                    typeObj.type = 'object';
                                    if (scope == MetaTypes.MDScope.DT) {
                                        const typeArgs = checker.getTypeArguments(type);
                                        if (typeArgs.length >= 2) {
                                            // first deal with the keys type
                                            const keysType = typeArgs[0];
                                            const keysTypeObj = getSignatureFromType(keysType, context, scope, false, seen, metaUtilObj);
                                            if (keysTypeObj.typeDefs && keysTypeObj.typeDefs.length > 0) {
                                                typeObj.typeDefs = typeObj.typeDefs || [];
                                                typeObj.typeDefs = [...typeObj.typeDefs, ...keysTypeObj.typeDefs];
                                            }
                                            // now deal with the values type
                                            const valuesType = typeArgs[1];
                                            const valuesTypeObj = getSignatureFromType(valuesType, context, scope, false, seen, metaUtilObj);
                                            if (valuesTypeObj.typeDefs && valuesTypeObj.typeDefs.length > 0) {
                                                typeObj.typeDefs = typeObj.typeDefs || [];
                                                typeObj.typeDefs = [...typeObj.typeDefs, ...valuesTypeObj.typeDefs];
                                            }
                                            typeObj.type = `Map<${keysTypeObj.type}, ${valuesTypeObj.type}>`;
                                            typeObj.reftype = `Map<${keysTypeObj.reftype ?? keysTypeObj.type}, ${valuesTypeObj.reftype ?? valuesTypeObj.type}>`;
                                        }
                                    }
                                    break;
                                }
                                // otherwise, for all other InterfaceDeclarations...
                                else {
                                    // If not previously specified, set reftype
                                    if (!typeObj.reftype) {
                                        typeObj.reftype = 'object';
                                    }
                                    // we only need TypeDefs for API Doc, so check for DT scope
                                    if (scope == MetaTypes.MDScope.DT) {
                                        // check if they have any type arguments which potentially can be processed for typedefs
                                        addPotentialTypeDefFromType(type, typeDecl, typeObj, checker, metaUtilObj);
                                    }
                                }
                            }
                        // ...and THEN fall through to default 'object' case!
                        default:
                            // If this is a DOM type OR if this is a "top-level" property signature with members
                            // (for checking for circular references when processing sub-properties), then
                            // keep the object type name; otherwise, just use "object" type
                            let keepObjectTypeName = (isPropSignatureType && symbolHasPropertySignatureMembers(typeSymbol)) ||
                                isJsLibraryType(type, JS_DOM_TYPE) ||
                                isJetCollectionType(typeObj.type, type);
                            if (!keepObjectTypeName) {
                                typeObj.type = 'object';
                                if (isJsLibraryType(type, JS_COLLECTION_TYPE)) {
                                    typeObj.isApiDocSignature = true;
                                }
                            }
                            break;
                    }
                }
            }
        }
        else {
            typeObj = { type: strType };
        }
    }
    // The ts.Type for JS primitive types are fairly straightforward, and we end up following
    // a code path whereby typeObj has a 'type' but no 'reftype'.
    // BUT the ts.Type for the 'boolean' primitive is essentially a union of true | false, and
    // so we end up with an unnecessary reftype.
    // So, as a final bit of cleanup, we detect this case and remove reftype (resulting in
    // cleaner JSON flowing into VComponent API Doc generation).
    if (typeObj.type === 'boolean' && typeObj?.reftype === 'boolean') {
        delete typeObj.reftype;
        typeObj.isApiDocSignature = false;
    }
    // If we had previously filtered null and/or undefined from a union type, restore them
    if (unionWithNull) {
        typeObj.type += _OR_NULL;
        if (typeObj.reftype) {
            typeObj.reftype += _OR_NULL;
        }
    }
    if (unionWithUndefined) {
        typeObj.type += _OR_UNDEFINED;
        if (typeObj.reftype) {
            typeObj.reftype += _OR_UNDEFINED;
        }
    }
    // add the NonNullable wrapper back to reftype if applicable
    if (isNonNullableType) {
        if (typeObj.reftype) {
            typeObj.reftype = `NonNullable<${typeObj.reftype}>`;
        }
    }
    return typeObj;
}
// Given a function/method signature parses the parameters and returns a signature with the resolved parameters
function getFunctionReftype(signature, checker, context, scope, seen, metaUtilObj) {
    const paramStrs = signature.getParameters().map((param) => {
        const paramDecl = param.valueDeclaration;
        const paramType = checker.getTypeOfSymbolAtLocation(param, paramDecl);
        const paramTypeStr = checker.typeToString(paramType, paramDecl);
        return `${param.getName()}: ${paramTypeStr}`;
    });
    const returnType = signature.getReturnType();
    const returnTypeStr = checker.typeToString(returnType);
    // Normalize both sides to avoid Array<T> vs T[] mismatch
    const normalizeArraySyntax = (s) => s.replace(/\b([a-zA-Z0-9_$.]+)\[\]/g, 'Array<$1>');
    const normaReturnTypeStr = normalizeArraySyntax(returnTypeStr);
    return `(${paramStrs.join(', ')}) => ${normaReturnTypeStr}`;
}
// Given a function/method signature gathers all types for parameters and return types that can be used as TypeDefs
// in the ApiDoc.
function collectTypeDefsFromSignature(signature, checker, context, scope, seen, metaUtilObj) {
    const typedefs = [];
    // Parameters
    for (const paramSymbol of signature.getParameters()) {
        const paramDecl = paramSymbol.valueDeclaration;
        if (!paramDecl)
            continue;
        const paramType = checker.getTypeOfSymbolAtLocation(paramSymbol, paramDecl);
        const paramTypeObj = getSignatureFromType(paramType, context, scope, false, seen, metaUtilObj);
        getTypeDefForAliasedUnionTypes(paramType, paramDecl, paramTypeObj, metaUtilObj);
        if (paramTypeObj.typeDefs?.length) {
            typedefs.push(...paramTypeObj.typeDefs);
        }
    }
    // Return type
    const returnType = signature.getReturnType();
    const returnTypeObj = getSignatureFromType(returnType, context, scope, false, seen, metaUtilObj);
    // Get return type node (if explicitly declared)
    const returnTypeNode = signature.getDeclaration()?.type;
    if (returnTypeNode) {
        // Pass returnTypeNode as a "fake" declaration object ( we need the 'type' key for the declaration)
        const returnDeclWrapper = { type: returnTypeNode };
        getTypeDefForAliasedUnionTypes(returnType, returnDeclWrapper, returnTypeObj, metaUtilObj);
    }
    if (returnTypeObj.typeDefs?.length) {
        typedefs.push(...returnTypeObj.typeDefs);
    }
    return typedefs;
}
/**
 * Try and retrieve any type argument from a Type Object. We will try to see if any
 * of these arguments can be processed as a TypeDef for the API Doc.
 */
function getTypeArgumentsForTypeObject(type, checker) {
    if (!type)
        return;
    if (type.aliasSymbol) {
        return type.aliasTypeArguments;
    }
    if (type.getFlags() & ts.TypeFlags.Object &&
        type.objectFlags & ts.ObjectFlags.Reference) {
        return checker.getTypeArguments(type);
    }
    return undefined;
}
function getItemTypeFromArrayType(arrayType, metaUtilObj) {
    const elementTypes = metaUtilObj.typeChecker.getTypeArguments(arrayType);
    return elementTypes?.[0];
}
function getSignatureFromArrayType(type, context, scope, fallbackType, seen, metaUtilObj) {
    let typeObj;
    const arrayItemType = getItemTypeFromArrayType(type, metaUtilObj);
    if (arrayItemType) {
        const arrayItemTypeObj = getSignatureFromType(arrayItemType, context, scope, false, seen, metaUtilObj);
        typeObj = {
            type: `Array<${arrayItemTypeObj.type}>`,
            reftype: `Array<${arrayItemTypeObj.reftype ?? arrayItemTypeObj.type}>`,
            isApiDocSignature: arrayItemTypeObj.isApiDocSignature,
            typeDefs: arrayItemTypeObj.typeDefs
        };
        if (arrayItemTypeObj.reftype &&
            (arrayItemTypeObj.type === 'object' ||
                arrayItemTypeObj.type === 'object|null' ||
                MetaUtils.isObjectType(arrayItemType))) {
            typeObj.isArrayOfObject = true;
        }
        // If the arrayItemType yields an array of enumValues, then pass them up for further processing
        if (arrayItemTypeObj.enumValues?.length > 0) {
            typeObj.enumValues = [...arrayItemTypeObj.enumValues];
        }
    }
    else {
        typeObj.type = fallbackType;
    }
    return typeObj;
}
function getSignatureFromArrayLikeType(type, context, scope, seen, metaUtilObj) {
    let typeObj;
    let reftypes = new Array();
    let typeDefs;
    let isApiDocSignature = false;
    const elementTypes = metaUtilObj.typeChecker.getTypeArguments(type);
    if (elementTypes) {
        elementTypes.forEach((typeArg) => {
            const arrayItemTypeObj = getSignatureFromType(typeArg, context, scope, false, seen, metaUtilObj);
            reftypes.push(arrayItemTypeObj.reftype);
            if (arrayItemTypeObj.isApiDocSignature) {
                isApiDocSignature = true;
            }
            if (scope == MetaTypes.MDScope.DT && arrayItemTypeObj.typeDefs) {
                typeDefs = typeDefs || [];
                typeDefs = [...arrayItemTypeObj.typeDefs];
            }
        });
        // Having looped over the types of the tuple, package up the results
        typeObj = { type: 'Array<object>' };
        if (reftypes.length > 0) {
            typeObj.reftype = `[${reftypes.join(',')}]`;
        }
        typeObj.isApiDocSignature = isApiDocSignature;
        typeObj.typeDefs = typeDefs;
    }
    return typeObj;
}
/**
 * Unified handling of Union and Intersection types
 */
function getSignatureFromUnionOrIntersectionTypes(unionTypes, context, scope, seen, metaUtilObj, isUnion) {
    let typeObj;
    let types = new Set();
    let reftypes = new Set();
    let typeDefs;
    let enumvalues = new Set();
    let enumnumerickeys = new Set();
    let values;
    let subArrayEnumValues;
    let isEnumValuesForDTOnly = false;
    let subEnumValues = [];
    const checker = metaUtilObj.typeChecker;
    // A value of false means that the source of the type of the property in the ApiDoc will come from the
    // value of type key of the typeobj (returned from this call) as opposed to the reftype key value.
    // We use the type key value for primitives, Array of primitives, functions without parameters or DOM objects, otherwise we will rely on the "reftype" key value.
    let useRefType = false;
    // NOTE1: Whereas processing a UnionTypeNode required a lot of recursive
    //        TypeNode walking, the nice thing here is that TypeScript will
    //        have flattened the union structure for us (with one notable exception...)
    // NOTE2: In order to prevent side effects across each of the union's sub-types,
    //        we make sure each sub-type uses a new, cloned instance of the
    //        seenUnionTypeAliases set!
    for (let type of unionTypes) {
        // If a ConditionalType is part of the Union, process its apparent type
        if (MetaUtils.isConditionalType(type)) {
            type = checker.getApparentType(type);
            // NOTE:  The apparent type might itself be a Union!
            // If that is the case, recurse to process the apparent Union,
            // and then continue with the next Type in the "outer" Union.
            if (type.isUnionOrIntersection()) {
                const unionTypeObj = getSignatureFromUnionOrIntersectionTypes(type.types, context, scope, seen !== null ? new Set(seen) : null, metaUtilObj, type.isUnion());
                useRefType = unionTypeObj.isApiDocSignature;
                let splitter = MetaUtils._UNION_SPLITTER;
                if (type.isIntersection()) {
                    splitter = MetaUtils._INTERSECTION_SPLITTER;
                }
                const unionTypeArray = unionTypeObj.type.split(splitter);
                unionTypeArray.forEach((typeName) => types.add(typeName));
                if (unionTypeObj.reftype) {
                    const unionRefTypeArray = unionTypeObj.reftype.split(splitter);
                    unionRefTypeArray.forEach((reftypeName) => reftypes.add(reftypeName));
                }
                if (unionTypeObj.enumValues) {
                    unionTypeObj.enumValues.forEach((enumVal) => enumvalues.add(enumVal));
                    if (unionTypeObj.isEnumValuesForDTOnly) {
                        isEnumValuesForDTOnly = unionTypeObj.isEnumValuesForDTOnly;
                    }
                }
                continue; // continue with the next type in the "outer" unionTypes array
            }
        }
        // If we encounter an explicit "any" or "unknown", then the final
        // type is just "any" - clear prior results, and bust out of the loop!
        if (MetaUtils.isTypeTreatedAsAny(type)) {
            types.clear();
            reftypes.clear();
            types.add('any');
            break;
        }
        const tFlags = type.getFlags();
        if (type.isStringLiteral()) {
            types.add('string');
            // let's add the string literal value to the reftypes
            // so that it can be used in the API Doc signature
            reftypes.add(`"${type.value}"`);
            enumvalues.add(type.value);
            useRefType = true;
        }
        else if (tFlags & ts.TypeFlags.Null) {
            types.add('null');
            reftypes.add('null');
        }
        else if (context & MetaTypes.MDContext.KEYPROPS_KEYS && type.isNumberLiteral()) {
            types.add('number');
            reftypes.add('number');
            enumnumerickeys.add(type.value);
        }
        else {
            // If a sub-type of the union is neither a StringLiteral nor a Null,
            // then assume any collected enumvalues are potentially used to generate
            // propertyEditorValues DT metadata
            isEnumValuesForDTOnly = true;
            // Assume no enums for this sub-type
            subArrayEnumValues = null;
            // assume that the type is not a basic jsdoc type and we need the refType for the API Doc signature
            if (tFlags & (ts.TypeFlags.String | ts.TypeFlags.TemplateLiteral)) {
                types.add('string');
                reftypes.add('string');
            }
            else if (type.isNumberLiteral() || tFlags & ts.TypeFlags.Number) {
                types.add('number');
                reftypes.add('number');
            }
            else if (tFlags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral)) {
                types.add('boolean');
                reftypes.add('boolean');
            }
            else if (tFlags & (ts.TypeFlags.BigInt | ts.TypeFlags.BigIntLiteral)) {
                types.add('bigint');
                reftypes.add('bigint');
            }
            else if (tFlags & ts.TypeFlags.Index) {
                // e.g., "keyof Foo" -- preserve in API Doc
                types.add('string');
                types.add('number');
                reftypes.add(checker.typeToString(type));
                useRefType = true;
            }
            else if (tFlags & ts.TypeFlags.Object) {
                const objtypeObj = getSignatureFromType(type, context, scope, false, seen !== null ? new Set(seen) : null, metaUtilObj);
                // Check for an Object sub-type that is an array of string literals, and save off any
                // corresponding enumValues for additional processing
                if (objtypeObj.type === 'Array<string>' || objtypeObj.type === 'Array<string|null>') {
                    if (objtypeObj.enumValues?.length > 0) {
                        subArrayEnumValues = objtypeObj.enumValues;
                    }
                }
                types.add(objtypeObj.type);
                reftypes.add(objtypeObj.reftype);
                useRefType = useRefType || objtypeObj.isApiDocSignature;
                if (scope == MetaTypes.MDScope.DT && objtypeObj.typeDefs) {
                    typeDefs = typeDefs || [];
                    typeDefs = [...typeDefs, ...objtypeObj.typeDefs];
                }
            }
            else if (type.isIntersection()) {
                // Check for special intersection pattern of a primitive type and an empty object
                // (e.g., 'string & {}') that supports auto-completion - if found, treat it
                // as the primitive type itself
                const primitiveType = getPrimitiveTypeNameFromIntersectionPattern(type);
                if (primitiveType !== undefined) {
                    types.add(primitiveType);
                    reftypes.add(primitiveType);
                }
                // Otherwise process the intersection type like any other object type
                else {
                    const objtypeObj = getSignatureFromType(type, context, scope, false, seen !== null ? new Set(seen) : null, metaUtilObj);
                    types.add(objtypeObj.type);
                    reftypes.add(objtypeObj.reftype);
                    useRefType = objtypeObj.isApiDocSignature;
                    if (scope == MetaTypes.MDScope.DT && objtypeObj.typeDefs) {
                        typeDefs = typeDefs || [];
                        typeDefs = [...typeDefs, ...objtypeObj.typeDefs];
                    }
                }
            }
            else {
                const strType = checker.typeToString(type);
                // If this is a TypeParameter (with or without constraints) or an
                // IndexedAccessTypeParameter use case (e.g., "D[typeof D]"), then
                // delegate to special logic in getSignatureFromType.
                // Preserve the result in the API Doc.
                if (MetaUtils.isIndexedAccessTypeParameters(type) || type.isTypeParameter()) {
                    const paramTypeObj = getSignatureFromType(type, context, scope, false, seen !== null ? new Set(seen) : null, metaUtilObj);
                    types.add(paramTypeObj.type);
                    reftypes.add(paramTypeObj.reftype);
                    useRefType = true;
                }
                else {
                    types.add(strType);
                    reftypes.add(strType);
                }
            }
            // Push any sub-type enumValues onto the stack (or an empty array, if there were none)
            subEnumValues.push(subArrayEnumValues ?? []);
        }
    }
    // Having looped over the types in the union, package up the results
    // If one of sub-types types is 'any', then the final type is 'any'!
    if (types.size > 1 && types.has('any')) {
        typeObj = { type: 'any' };
    }
    else {
        values = [...types];
        typeObj = { type: values.join(isUnion ? '|' : '&') };
        if (values.length == 1 && values[0] === 'Array<object>') {
            typeObj.isArrayOfObject = true;
        }
    }
    if (reftypes.size > 0) {
        values = [...reftypes];
        typeObj.reftype = values.join(isUnion ? '|' : ' & ');
    }
    if (enumvalues.size > 0) {
        typeObj.enumValues = [...enumvalues];
        // Check if any sub-types were arrays of string literals that yielded enumValues
        //  - if ALL such sub-type enumValues EXACTLY match the enumValues of the union type,
        //    then we DO want to expose them as RT enumValues metadata!
        if (subEnumValues.length > 0) {
            let hasAllMatched = true;
            for (const subEnums of subEnumValues) {
                if (hasAllMatched) {
                    if (subEnums.length !== enumvalues.size) {
                        hasAllMatched = false;
                    }
                    else {
                        subEnums.forEach((val) => {
                            if (!enumvalues.has(val)) {
                                hasAllMatched = false;
                            }
                        });
                    }
                }
            }
            if (hasAllMatched) {
                isEnumValuesForDTOnly = false;
            }
        }
        if (isEnumValuesForDTOnly) {
            typeObj.isEnumValuesForDTOnly = isEnumValuesForDTOnly;
        }
        // NOTE:  Remove reftype if that would mask enumValues in VComponent API Doc
        if (typeObj.type === 'string' || typeObj.type === 'string|null') {
            delete typeObj.reftype;
            useRefType = false;
        }
    }
    // NOTE:  Numeric keys (for keyProperties.keys MD use case) only returned
    //        if sub-types consisted solely of string and/or number literals!
    if (!isEnumValuesForDTOnly && enumnumerickeys.size > 0) {
        typeObj.enumNumericKeys = [...enumnumerickeys];
    }
    typeObj.isApiDocSignature = useRefType;
    typeObj.typeDefs = typeDefs;
    return typeObj;
}
/**
 * Check an IntersectionType to see if it matches one of these special patterns:
 *
 *    - 'string & {}'
 *    - 'number & {}'
 *    - 'bigint & {}'
 *
 * If so, return the underlying primitive type name (otherwise undefined)
 *
 * @param intersectionType ts.IntersectionType to check for special pattern
 * @returns string | undefined underlying primitive type name, or undefined if pattern not detected
 */
function getPrimitiveTypeNameFromIntersectionPattern(intersectionType) {
    let primitiveName;
    let wasAnonymousEmptyObjFound = false;
    if (intersectionType.types.length === 2) {
        intersectionType.types.forEach((type) => {
            if (type.flags & ts.TypeFlags.String) {
                primitiveName = 'string';
            }
            else if (type.flags & ts.TypeFlags.Number) {
                primitiveName = 'number';
            }
            else if (type.flags & ts.TypeFlags.BigInt) {
                primitiveName = 'bigint';
            }
            else if (type.flags & ts.TypeFlags.Object) {
                const objType = type;
                // check for an anonymous object with no members
                if (objType.objectFlags & ts.ObjectFlags.Anonymous) {
                    const objSymbol = objType.symbol;
                    if (!(objSymbol.members?.size > 0)) {
                        wasAnonymousEmptyObjFound = true;
                    }
                }
            }
        });
    }
    return wasAnonymousEmptyObjFound && primitiveName ? primitiveName : undefined;
}
function getTypeNameFromType(type) {
    if (type.isIntersection()) {
        return getTypeNameFromIntersectionTypes(type.types);
    }
    else if (type.aliasSymbol) {
        return type.aliasSymbol.name;
    }
    else if (type.symbol) {
        // Check for a TypeLiteral instance, in which case we want to
        // use the (cleaned up) literal expression as its name
        let decl = type.symbol.declarations?.[0];
        if (decl && ts.isTypeLiteralNode(decl)) {
            let rtnName = decl.getText();
            if (rtnName?.length) {
                rtnName = rtnName
                    .replace(_REGEX_LINE_AND_BLOCK_COMMENTS, '')
                    .replace(_REGEX_EXTRA_WHITESPACE, ' ');
            }
            return rtnName;
        }
        else if (decl && ts.isObjectLiteralExpression(decl)) {
            return 'object';
        }
        else {
            return type.symbol.name;
        }
    }
}
function getTypeNameFromIntersectionTypes(types) {
    let intersectionTypeName;
    if (types.length) {
        // Construct a type name based upon an array of Intersection constituent types,
        // for the purpose of generating the TS definition file
        intersectionTypeName = '(';
        for (let i = 0; i < types.length; i++) {
            intersectionTypeName += getTypeNameFromType(types[i]);
            if (i < types.length - 1) {
                intersectionTypeName += ' & ';
            }
        }
        intersectionTypeName += ')';
    }
    return intersectionTypeName;
}
function getNodeDeclaration(node, checker) {
    const typeAtLoc = checker.getTypeAtLocation(node);
    return getTypeDeclaration(typeAtLoc);
}
function getTypeDeclaration(type) {
    let declaration = type.aliasSymbol
        ? type.aliasSymbol.declarations?.[0]
        : type.symbol?.declarations?.[0];
    return declaration;
}
function getTypeReferenceDeclaration(type) {
    let typeDecl;
    if (type.flags & ts.SymbolFlags.TypeAlias) {
        if (type['aliasSymbol']) {
            let aliasName = type.aliasSymbol?.name;
            if (aliasName && type.aliasTypeArguments?.length >= 1) {
                if (aliasName === 'Pick' ||
                    aliasName === 'Omit' ||
                    aliasName === 'Partial' ||
                    aliasName === 'Required' ||
                    aliasName === 'Readonly') {
                    typeDecl = getTypeReferenceDeclaration(type.aliasTypeArguments[0]);
                }
            }
            else {
                typeDecl = type['aliasSymbol'].declarations?.[0];
                typeDecl = typeDecl.type;
            }
        }
        else if (type['symbol']) {
            typeDecl = type['symbol'].declarations?.[0];
        }
    }
    return typeDecl;
}
function isTypeLiteralType(type) {
    let declaration = getTypeDeclaration(type);
    return declaration?.kind === ts.SyntaxKind.TypeLiteral;
}
function isGenericTypeParameter(symbol) {
    return symbol.declarations && symbol.declarations[0].kind === ts.SyntaxKind.TypeParameter;
}
function getPropertyType(typeRef, propName) {
    // Generics are not included in the typeName
    let typeName;
    if (typeRef) {
        const kind = typeRef.kind;
        switch (kind) {
            case ts.SyntaxKind.TypeReference:
                typeName = typeRef.typeName.getText();
                // for instance Array<VComponent.VNode> we need the type argument
                if (typeName === 'Array' && propName === MetaTypes.DEFAULT_SLOT_PROP) {
                    typeName = typeRef.typeArguments[0].getText();
                }
                break;
            case ts.SyntaxKind.ArrayType:
                typeName = typeRef.elementType.getText();
                break;
            default:
                break;
        }
    }
    return typeName;
}
/**
 * Handles Intersection types needed for event, slot cases
 * (e.g. Action & Bubbles, Slot & ImplicitBusyContext)
 * @param propDeclaration
 */
function getPropertyTypes(propDeclaration) {
    // Generics are not included in the typeName
    let types = {};
    const typeRef = propDeclaration.type;
    if (typeRef) {
        const kind = typeRef.kind;
        switch (kind) {
            case ts.SyntaxKind.TypeReference:
            case ts.SyntaxKind.ArrayType:
                let typeName = getPropertyType(typeRef);
                if (typeName) {
                    types[typeName] = typeRef;
                }
                break;
            case ts.SyntaxKind.IntersectionType:
                // Handle Bubbles, ImplicitBusyContext intersection marker types
                let interTypes = typeRef['types'];
                interTypes?.forEach((tr) => {
                    let typeName = getPropertyType(tr);
                    if (typeName) {
                        types[typeName] = tr;
                    }
                });
            default:
                break;
        }
    }
    return types;
}
/**
 * Given a Symbol derived from walking the members of a Type/TypeNode, return the metadata object
 * for a complex property, or an empty object if the property has no sub-properties.
 * @param memberSymbol The symbol to generate complex properties for
 * @param metaObj The metaObj object generated from a getAllPossibleMetadata call (contains both the type and reftype keys)
 * @param outerType The type name for the Props/EventDetail/SlotData object, or undefined if it's a TypeLiteral
 * @param scope Specifies the scope of the metadata being fetched
 * @param context Context flags
 * @param propertyPath An qualified property path name (represented as a string[])
 * @param nestedArrayStack An array of property names used as a stack. We use this stack to keep track of the top-most level where we find
 *       an object based array type. We will explode the properties of that object as extension metadata in the component.json file
 * @param metaUtilObj Bag o'useful stuff
 */
function getComplexPropertyMetadata(memberSymbol, metaObj, outerType, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs) {
    // Seed the 'seen' set of types with the outer Props/EventDetail/SlotData type name, if available
    let seen = new Set();
    if (outerType) {
        seen.add(outerType);
    }
    // Call the helper with a new Set used for detecting circular references within the property and
    // send back the sub-property metadata from the helper's return value.
    const returnObj = getComplexPropertyHelper(memberSymbol, metaObj.type, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs);
    // If we found a circular reference while processing this member, we want to return that information
    if (returnObj.circularRefs?.length > 0) {
        const circRefInfo = returnObj.circularRefs.pop();
        return { circRefDetected: { type: circRefInfo.circularType } };
    }
    // central place to try to create a TypeDefinition for this property, if this is a complex property
    createTypeDefinitionForPropertyDeclaration(returnObj.subpropsMD, memberSymbol, propertyPath[propertyPath.length - 1], metaObj, context, scope, metaUtilObj, seenTypeDefs);
    const rtnMD = {};
    if (returnObj.subpropsMD) {
        rtnMD.properties = returnObj.subpropsMD;
    }
    if (returnObj.keyedpropsMD) {
        rtnMD.keyedProperties = returnObj.keyedpropsMD;
    }
    return rtnMD;
}
/**
 * Given a property Type, return the metadata object for a complex property, or an empty object
 * if the property has no sub-properties.
 *
 * NOTE:  The assumption is that this utility is not used in situations where we would create
 *        a Type Defintiion based upon the property's declaration (although typedefs might end up
 *        being created and passed back up based upon sub-properties).
 *
 * @param tsType The TS Type object of the property
 * @param metaObj The metaObj object generated from a getAllPossibleMetadata call (contains both the type and reftype keys)
 * @param typeName The type name for property type (if a reference), or undefined if it's a TypeLiteral
 * @param scope Specifies the scope of the metadata being fetched
 * @param context Context flags
 * @param propertyPath An qualified property path name (represented as a string[])
 * @param nestedArrayStack An array of property names used as a stack. We use this stack to keep track of the top-most level where we find
 *       an object based array type. We will explode the properties of that object as extension metadata in the component.json file
 * @param metaUtilObj Bag o'useful stuff
 */
function getComplexPropertyMetadataForType(tsType, metaObj, typeName, scope, context, propertyPath, nestedArrayStack, metaUtilObj) {
    const rtnMD = {};
    const propType = tsType.getNonNullableType();
    // Perform some checks before attempting to walk the sub-properties
    if (_NON_OBJECT_TYPES.has(metaObj.type) ||
        !(MetaUtils.isObjectType(propType) || propType.isIntersection()) ||
        isJsLibraryType(propType, JS_DOM_TYPE) ||
        isJetCollectionType(metaObj.type, propType)) {
        return rtnMD;
    }
    // Seed the 'seen' set of types with the property's type name, if available
    let seen = new Set();
    if (typeName && !_OBJECT_TYPE_ALIAS_EXCEPTIONS.has(typeName)) {
        seen.add(typeName);
    }
    // Walk the members of the complex property type to gather
    // sub-property metadata.
    const subPropsInfo = getSubPropertyMembersInfo(propType, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj);
    if (subPropsInfo) {
        if (subPropsInfo.processedMembers > 0) {
            rtnMD.properties = subPropsInfo.metadata;
        }
        // if processing DT metadata and there's potentially keyed properties,
        // then process and return its metadata as well
        if (scope === MetaTypes.MDScope.DT &&
            (subPropsInfo.processedMembers <= 0 || subPropsInfo.indexSignatureMembers > 0) &&
            MetaUtils.isObjectType(propType)) {
            // NOTE:  keyed properties metadata is ALWAYS extension metadata,
            // so we unconditionally add that to the context.
            rtnMD.keyedProperties = getKeyedPropsTypeMetadata(propType, seen, context | MetaTypes.MDContext.EXTENSION_MD, scope, propertyPath, metaUtilObj);
        }
    }
    return rtnMD;
}
/**
 * Process the ComplexPropertyMetadata for the specified property, assigning it
 * into the specified ExtendedProperties DT metadata structure.
 * @param property name of property being processed
 * @param symbol TS symbol of property being processed
 * @param metaObj basic metadata derived from the declaration
 * @param complexMD sub-property, keyedProperties metadata returned from getComplexPropertyMetadata
 * @param dtMetadata target for assigning DT metadata derived from arguments
 * @param metaUtilObj Bag o'useful stuff
 */
function processComplexPropertyMetadata(property, metaObj, complexMD, dtMetadata) {
    // If a circularity was detected, use the substitute type and
    // drop any sub-property, keyed properties metadata
    if (complexMD.circRefDetected) {
        dtMetadata.type = getSubstituteTypeForCircularReference(metaObj);
    }
    else {
        // Set up any necessary extension metadata structure in advance
        if ((complexMD.properties && metaObj.type === 'Array<object>') || complexMD.keyedProperties) {
            dtMetadata.extension = {};
            dtMetadata.extension['vbdt'] = {};
        }
        if (complexMD.properties) {
            // handle object based array type. The shape of the array items are described
            // in the dt md file as extension metadata
            if (metaObj.type === 'Array<object>') {
                dtMetadata.extension['vbdt']['itemProperties'] = complexMD.properties;
            }
            else {
                dtMetadata.type = 'object';
                dtMetadata.properties = complexMD.properties;
            }
        }
        if (complexMD.keyedProperties) {
            dtMetadata.extension['vbdt']['keyedProperties'] = complexMD.keyedProperties;
        }
    }
    // remove any utility metadata
    if (dtMetadata) {
        delete dtMetadata['typeDefs'];
        delete dtMetadata['rawType'];
    }
}
// Determine the substitute type for a Property when a circular reference
// has been detected.
function getSubstituteTypeForCircularReference(metaObj) {
    return metaObj.isArrayOfObject ? 'Array<object>' : 'object';
}
function getAllMetadataForDeclaration(declarationWithType, scope, context, propertyPath, declSymbol, metaUtilObj) {
    let metadata = {
        type: 'any'
    };
    let symbolType;
    let typeObj;
    let refNodeTypeName;
    const seen = new Set();
    if (metaUtilObj.propsName) {
        seen.add(metaUtilObj.propsName);
    }
    let depth = 2;
    if (propertyPath && propertyPath.length) {
        depth += propertyPath.length;
    }
    if (scope == MetaTypes.MDScope.DT) {
        Object.assign(metadata, MetaUtils.getDtMetadata(declarationWithType, context, propertyPath, metaUtilObj));
    }
    if (!declarationWithType.type) {
        if (ts.isPropertyDeclaration(declarationWithType)) {
            // If no type is provided, set type to any and warn
            TransformerError_1.TransformerError.reportException(TransformerError_1.ExceptionKey.DEFAULT_TO_ANY_TYPE, TransformerError_1.ExceptionType.LOG_WARNING, metaUtilObj.componentName, `No type provided, defaulting to 'any' for property '${declarationWithType['name']?.getText()}'.`, declarationWithType);
        }
        return metadata;
    }
    let declTypeNode = declarationWithType.type;
    if (scope == MetaTypes.MDScope.DT) {
        MetaUtils.printInColor(`signature: ${declarationWithType.getText()} `, metaUtilObj, depth, MetadataTypes_1.Color.FgCyan);
    }
    if (declSymbol) {
        // NOTE:  The ConditionalTypeNode check needs its own copy of the "seen" type alias cache
        if (MetaUtils.isConditionalTypeNodeDetected(declTypeNode, new Set(seen), metaUtilObj)) {
            symbolType = metaUtilObj.typeChecker.getTypeOfSymbolAtLocation(declSymbol, declarationWithType);
            if (symbolType) {
                typeObj = getSignatureFromType(symbolType, context, scope, true, seen, metaUtilObj);
            }
        }
    }
    // If a declSymbol was not provided, or we did not find a ConditionalTypeNode
    // that would warrant separate processing, then proceed with our standard
    // TypeNode signature processing to get the type metadata.
    if (!typeObj) {
        if (ts.isParenthesizedTypeNode(declTypeNode)) {
            declTypeNode = declTypeNode.type;
        }
        let readOnlyProp = false;
        if (ts.isTypeReferenceNode(declTypeNode)) {
            refNodeTypeName = (0, Utils_1.getTypeNameFromTypeReference)(declTypeNode);
            // Check to see if type is ElementReadOnly<T> utility type and use the generic
            // as the typeObject instead
            const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, declTypeNode);
            if (refNodeTypeName === `${exportToAlias.ElementReadOnly}` ||
                refNodeTypeName === `${exportToAlias.ReadOnlyPropertyChanged}`) {
                declTypeNode = declTypeNode.typeArguments?.[0];
                readOnlyProp = true;
            }
        }
        // when processing a property signature we want to keep the 'type' as the name of the type reference (vs 'object')
        // so that later in getComplexPropertyHelper we can keep track of reference types used (for detecting circular refs)
        let isPropSignature = ts.isPropertySignature(declarationWithType) || ts.isPropertyDeclaration(declarationWithType);
        //get the semantic type of the prop declaration (default)
        let type = metaUtilObj.typeChecker.getTypeAtLocation(declTypeNode);
        // 1. for non readonly props (where we actually deal with the type argument) get the context aware type of the
        // declaration
        // 2. for function signature declaration (e.g. method return type) we want to get the type of the
        //    declaration at the location of the declaration (e.g. function signature) so we can get the type of the
        //    return type of the function signature
        //
        // NOTE:  In the context of getting metadata for a METHOD_RETURN, we know the declaration will be a
        //        SignatureDeclaration therefore use a specialized utility to get the ts.Type, regardless of
        //        whether it was explicitly declared or if it needs to be inferred.
        //
        //        OTHERWISE, use the standard TypeChecker call.
        if (context & MetaTypes.MDContext.METHOD_RETURN) {
            type = (0, Utils_1.getFunctionReturnTsType)(declarationWithType, metaUtilObj.typeChecker);
        }
        else if (declSymbol && !readOnlyProp) {
            type = metaUtilObj.typeChecker.getTypeOfSymbolAtLocation(declSymbol, declarationWithType);
        }
        // After resolving the type above(typeChecker.getTypeOfSymbolAtLocation) we could end up with a NonNullable
        // wrapper type when we are processing the "value" part of the mapped Record type
        // therefore we need to unwrap a NonNullable resolved type here so we don't process in getSignatureFromType as
        // an intersection type
        type = unwrapNonNullableUtilityType(type, metaUtilObj.typeChecker);
        // get the type object metadata (containin both RT and DT metadata abiut the type of the declaration)
        typeObj = getSignatureFromType(type, context, scope, isPropSignature, seen, metaUtilObj);
        // the following codepath only makes sense for DT metadata because we are setting reference types, rawTypes
        // really needed by the API Doc utilities
        if (scope == MetaTypes.MDScope.DT) {
            // Stash in the type metadata object the property declaration type as seen at this point.
            // Will use this type as the first entry in the "seen types" stack when:
            // 1. we detected no subprops for this property declaration
            // 2. we found potential typedef types during getSignatureFromType call
            // We will walk those type nodes defined in typeObj.typeDefs
            // (see the calls to createTypeDefinitionForPropertyDeclaration)
            if (scope == MetaTypes.MDScope.DT && typeObj.typeDefs?.length > 0) {
                typeObj.rawType = prettyPrintTypeForApiDoc(type, declarationWithType, metaUtilObj.typeChecker);
            }
            if (refNodeTypeName) {
                const typeAtLoc = metaUtilObj.typeChecker.getTypeAtLocation(declTypeNode);
                const isMapped = MetaUtils.isMappedType(typeAtLoc);
                const isNonNullable = refNodeTypeName === 'NonNullable';
                const isFunction = MetaUtils.isFunctionType(typeAtLoc, metaUtilObj.typeChecker);
                // If the type is a type parameter, we want to preserve the reftype
                // Note: use the type obtained from the type node of the declaration (no context used), which is not the type of the symbol
                const isTypeParameter = typeAtLoc.isTypeParameter();
                const arraySetOrMapWithGenerics = declTypeNode.typeArguments &&
                    ['Array', 'Set', 'Map'].includes(refNodeTypeName);
                const preserveReftype = (type) => MetaUtils.isRecordType(type) ||
                    isTypeParameter ||
                    arraySetOrMapWithGenerics ||
                    isFunction ||
                    typeObj.isArrayOfObject ||
                    ((readOnlyProp || type.isUnion()) && // this is a strange hack to make TS happy and not complain about type could be 'never'
                        !!typeObj.reftype);
                if (!preserveReftype(typeAtLoc)) {
                    if (isMapped) {
                        refNodeTypeName = prettyPrintTypeForApiDoc(type, declarationWithType, metaUtilObj.typeChecker);
                    }
                    else if (isNonNullable) {
                        refNodeTypeName = `${refNodeTypeName}<${typeObj.reftype}>`;
                    }
                    else if (declTypeNode.typeArguments &&
                        !arraySetOrMapWithGenerics &&
                        !typeObj.isArrayOfObject) {
                        refNodeTypeName = prettyPrintTypeForApiDoc(type, declarationWithType, metaUtilObj.typeChecker);
                        if (refNodeTypeName !== typeObj.reftype) {
                            console.warn(`Warning: reftype '${typeObj.reftype}' does not match ${refNodeTypeName}`);
                        }
                    }
                    typeObj.reftype = refNodeTypeName;
                }
            }
            // special case to handle aliased union types
            // e.g. type FooAlias = 'Foo | Bar' where Foo and Bar are aliased types
            // prop?: FooAlias;
            getTypeDefForAliasedUnionTypes(type, declarationWithType, typeObj, metaUtilObj);
        }
    }
    if (scope !== MetaTypes.MDScope.DT) {
        // reftype not used for RT scope (but is needed for sub-property processing
        // in RT_EXTENDED scope)
        if (scope === MetaTypes.MDScope.RT) {
            delete typeObj.isApiDocSignature;
            delete typeObj.reftype;
        }
        delete typeObj.optional;
        // If enum values were only returned to auto-populate 'propertyEditorValues'
        // DT metadata, then we don't want them included in enumValues RT metadata
        if (typeObj.isEnumValuesForDTOnly) {
            delete typeObj.enumValues;
        }
        delete typeObj.isEnumValuesForDTOnly;
    }
    else {
        // If enumValues have been returned only for DT purposes,
        // convert them to propertyEditorValues DT metadata, BUT ONLY
        // if neither propertyEditorValues nor format metadata exists
        if (typeObj.isEnumValuesForDTOnly) {
            if (metadata['propertyEditorValues'] === undefined && metadata['format'] === undefined) {
                const peValuesObj = {};
                typeObj.enumValues.forEach((val) => (peValuesObj[val] = {}));
                metadata['propertyEditorValues'] = peValuesObj;
            }
            delete typeObj.enumValues;
            delete typeObj.isEnumValuesForDTOnly;
            //delete reftype if is identical to type
            if (typeObj.reftype === typeObj.type) {
                delete typeObj.reftype;
                delete typeObj.isApiDocSignature;
            }
        }
    }
    return Object.assign({}, metadata, typeObj);
}
/**
 * Returns true if the type is not any of the below:
 * 1) Array (only for RT MD)
 * 2) a primitive type
 * 2) class
 * 3) enum
 * 4) DOM type
 * @param symbolType The ts.Type
 * @param type The type name
 * @param scope Specifies the scope of the metadata being considered
 */
function possibleComplexProperty(symbolType, type, scope) {
    let iscomplex = true;
    // We know that Intersection types and MappedTypes are complex,
    // so skip the other checks...
    if (!(symbolType.isIntersection() || MetaUtils.isMappedType(symbolType))) {
        if (_NON_OBJECT_TYPES.has(type) ||
            isJsLibraryType(symbolType, JS_DOM_TYPE) ||
            isJetCollectionType(type, symbolType) ||
            isClassDeclaration(symbolType) ||
            type.indexOf('|') > -1) {
            iscomplex = false;
            if (scope == MetaTypes.MDScope.DT && type.indexOf('Array') > -1) {
                iscomplex = true;
            }
        }
    }
    return iscomplex;
}
function isClassDeclaration(symbolType) {
    if (symbolType.symbol?.valueDeclaration) {
        return ts.isClassDeclaration(symbolType.symbol?.valueDeclaration);
    }
    return false;
}
/**
 * Function used with a TypeNode array filter to remove null and undefined
 * @param type The node to check
 */
function nullOrUndefinedTypeNodeFilter(type) {
    return (type.kind !== ts.SyntaxKind.UndefinedKeyword &&
        type.kind !== ts.SyntaxKind.NullKeyword &&
        (!ts.isLiteralTypeNode(type) ||
            (ts.isLiteralTypeNode(type) && type.literal.kind !== ts.SyntaxKind.NullKeyword)));
}
// Functions used to filter a UnionType array
function nullTypeFilter(t) {
    return t.flags !== ts.TypeFlags.Null;
}
function undefinedTypeFilter(t) {
    return t.flags !== ts.TypeFlags.Undefined;
}
// returns true if a type symbol has property members
function symbolHasPropertySignatureMembers(symbolType) {
    const members = symbolType['members'] || symbolType['symbol']?.members;
    if (!members || members.size === 0) {
        return false; // TODO how to hit this case?  need to add a golden test case
    }
    let bRetVal = true;
    members.forEach((symbol) => {
        // Check that all members are properties
        const memberType = symbol.declarations?.[0].kind;
        if (memberType !== ts.SyntaxKind.PropertySignature) {
            bRetVal = false;
        }
    });
    return bRetVal;
}
/*
 * This function explicitly allows nulls to come through -- for example, ('val1' | 'val2' | null)
 * Any nulls will be filtered out when generating enumValues metadata from the returned array,
 * but are used to indicate that the resulting type should be (string | null).
 */
function getEnumStringsFromUnion(union) {
    const enums = [];
    union.types.forEach((type) => {
        // Starting in 4.0, nulls may be represented as literals
        const literal = type.literal;
        if (literal?.kind === ts.SyntaxKind.StringLiteral) {
            enums.push(literal.text);
        }
        else if (literal?.kind === ts.SyntaxKind.NullKeyword) {
            enums.push(null);
        }
    });
    return enums.length === union.types.length ? enums : null;
}
/**
 * Returns an object containing a list of circular references or the complex property metadata
 * @param memberSymbol The symbol to walk
 * @param type The type of the memberSymbol
 * @param seen The set of seen type references
 * @param scope Specifies the scope of the metadata being fetched
 * @param context Context flags
 * @param propertyPath An qualified property path name (represented as a string[])
 * @param nestedArrayStack An array of property names used as a stack. We use this stack to keep track of the top-most level where we find
 *       an object based array type. We will explode the properties of that object as extension metadata in the component.json file
 * @param metaUtilObj Bag o'useful stuff
 * @param seenTypeDefTypeAliases (optional) stack of type references used when processing nested property types to help identifying circular references
 */
function getComplexPropertyHelper(memberSymbol, type, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs) {
    let propDeclaration = memberSymbol.valueDeclaration ?? memberSymbol.declarations[0];
    let symbolType = metaUtilObj.typeChecker
        .getTypeOfSymbolAtLocation(memberSymbol, propDeclaration)
        .getNonNullableType();
    // If processing a Conditional type, work with the passed-in type string,
    // but remove any union with null
    if (MetaUtils.isConditionalType(symbolType)) {
        const typeNames = type.split(MetaUtils._UNION_SPLITTER);
        if (typeNames.indexOf('object') > -1 &&
            (typeNames.length === 1 || (typeNames.length === 2 && typeNames.indexOf('null') > -1))) {
            type = 'object';
        }
    }
    // Otherwise, if processing an Intersection type, we know that we will
    // have to spelunk its members, so skip the test for a property declaration
    // or signature...
    else if (!symbolType.isIntersection()) {
        const kind = propDeclaration.kind;
        const declaration = propDeclaration;
        if (kind == ts.SyntaxKind.PropertyDeclaration || kind == ts.SyntaxKind.PropertySignature) {
            // we are only looking up and spelunking the properties of a property declaration or signature if:
            //   a) we have a Union type of a TypeReference (or Array) with null and/or undefined
            //   b) an Array of: some TypeReference or type literal, or a union of the same with null and/or undefined
            //   c) ReadonlyPropertyChanged of: some TypeReference or type literal, or a union of the same with null and/or undefined
            //   d) TypeReference (with or without generics)
            //   e) type literal
            //   f) IndexedAccessType that references an object or Array<object> (optionally unioned with null and/or undefined)
            const typeRefNode = getTypeRefNodeForPropDeclaration(declaration, metaUtilObj);
            //ex: arrPropInlLit: Array<{prop1:string}>
            if (typeRefNode) {
                if (ts.isIndexedAccessTypeNode(typeRefNode)) {
                    const typeObject = getSymbolTypeFromIndexedAccessTypeNode(typeRefNode, metaUtilObj);
                    if (typeObject) {
                        symbolType = typeObject;
                        type = !isTypeLiteralType(symbolType)
                            ? MetaUtils.isMappedType(symbolType)
                                ? metaUtilObj.typeChecker.typeToString(symbolType)
                                : getTypeNameFromType(symbolType)
                            : 'object';
                    }
                    else {
                        return {};
                    }
                }
                else if (isPropertyTypeParameter(declaration, metaUtilObj.typeChecker)) {
                    type = metaUtilObj.typeChecker.typeToString(symbolType);
                }
                else {
                    symbolType = unwrapKnownWrapperTypes(symbolType, metaUtilObj, WRAPPER_NAMES_FOR_SUBPROPS);
                    const symbolTypeAtLoc = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
                    if (!ts.isTypeLiteralNode(typeRefNode) && !MetaUtils.isConditionalType(symbolTypeAtLoc)) {
                        type = MetaUtils.isMappedType(symbolTypeAtLoc)
                            ? metaUtilObj.typeChecker.typeToString(symbolTypeAtLoc)
                            : ts.isTypeReferenceNode(typeRefNode)
                                ? (0, Utils_1.getTypeNameFromTypeReference)(typeRefNode)
                                : typeRefNode.getText();
                    }
                    else {
                        type = 'object';
                    }
                }
            }
            else {
                return {};
            }
        }
    }
    // Do a quick check to see if the symbol type could be an object literal or a type we can walk
    // Also make sure we are not looking for subprops for object unions.
    // this was needed because in getSubPropertyMembersInfo we are getting the memebrs of the
    // TODO
    // Note: this is to be backward compatible with previous functionality where we did not process
    //       array of union types, but we should rethink this aproach.
    if (!possibleComplexProperty(symbolType, type, scope) || symbolType.isUnion()) {
        return {};
    }
    // The seen set is used to track circular references so we only need to add
    // type references to the set
    if (!(type === 'object' || type === 'any')) {
        if (seen.has(type)) {
            const circRefInfo = {
                circularType: type
            };
            const circularRefs = [circRefInfo];
            return { circularRefs };
        }
        else {
            seen.add(type);
        }
    }
    // Walk the members of the complex property type to gather
    // sub-property metadata.
    const subPropsInfo = getSubPropertyMembersInfo(symbolType, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs);
    const rtnObj = {};
    if (subPropsInfo) {
        if (subPropsInfo.processedMembers > 0) {
            rtnObj.subpropsMD = subPropsInfo.metadata;
        }
        // If processing DT metadata and there's potentially keyed properties,
        // then process and return its metadata as well.
        if (scope === MetaTypes.MDScope.DT &&
            (subPropsInfo.processedMembers <= 0 || subPropsInfo.indexSignatureMembers > 0)) {
            // Only process keyed properties metadata after making sure we have
            // a (non-nullable) object type
            const objType = symbolType.getNonNullableType();
            if (MetaUtils.isObjectType(objType)) {
                // NOTE:  keyed properties metadata is ALWAYS extension metadata,
                // so we unconditionally add that to the context.
                rtnObj.keyedpropsMD = getKeyedPropsTypeMetadata(objType, seen, context | MetaTypes.MDContext.EXTENSION_MD, scope, propertyPath, metaUtilObj);
            }
        }
    }
    return rtnObj;
}
function unwrapKnownWrapperTypes(type, metaUtilObj, wrapperSet) {
    let currentType = type;
    while (true) {
        const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, currentType);
        // Resolve wrapper name: alias or direct symbol
        const rawSymbol = currentType.aliasSymbol ?? currentType.symbol;
        if (!rawSymbol)
            break;
        const rawName = rawSymbol.escapedName.toString();
        const resolvedName = exportToAlias[rawName] ?? rawName;
        // Only unwrap if this is a recognized wrapper
        if (wrapperSet.has(resolvedName)) {
            const typeArgs = getTypeArgumentsForTypeObject(currentType, metaUtilObj.typeChecker);
            if (typeArgs?.length) {
                currentType = typeArgs[0].getNonNullableType(); // Remove undefined/null from union
                continue;
            }
        }
        // If none matched, break
        break;
    }
    return currentType;
}
/**
 * Returns KeyedPropsMetadata for a given Object ts.Type, or undefined
 * if this metadata is not found.
 *
 * KeyedPropsMetadata specifies key/value metadata for Records, objects
 * with one or more index signatures, Maps, and Sets.
 */
function getKeyedPropsTypeMetadata(objType, seen, context, scope, propertyPath, metaUtilObj) {
    let rtnMD;
    let valuesType;
    let valuesTypeName;
    let valuesProps;
    let valuesKeyedProps;
    const objKeyedPropsInfo = getKeyedPropsTypeInfo(objType, context, scope, seen, metaUtilObj);
    if (objKeyedPropsInfo.type !== MetaTypes.KPType.NONE) {
        valuesType = objKeyedPropsInfo.valuesType;
        if (valuesType) {
            const nestedArrayStack = [];
            const updatedPropertyPath = [...propertyPath, _KEY_PROP_PLACEHOLDER];
            const typeObj = getSignatureFromType(valuesType, context, scope, false, null, metaUtilObj);
            valuesTypeName = typeObj.type;
            // For the purpose of walking members of the valuesType to get sub-property metadata,
            // we always want the non-nullable version of the type.
            valuesType = valuesType.getNonNullableType();
            // Check for a circular reference before recursively getting sub-property metadata
            if (!seen.has(getTypeNameFromType(valuesType))) {
                // If the valuesType is an Array, then we really want to walk the members of the
                // array's (non-nullable) item type, but ONLY if it passes a circular reference check!
                if (typeObj.isArrayOfObject) {
                    valuesType = getItemTypeFromArrayType(valuesType, metaUtilObj)?.getNonNullableType();
                    if (valuesType && !seen.has(getTypeNameFromType(valuesType))) {
                        nestedArrayStack.push(_KEY_PROP_PLACEHOLDER); // note that we are in an array...
                    }
                    else {
                        valuesType = undefined; // circular reference detected, so give up on valuesType!
                    }
                }
                // If we still have a valid valuesType and it's an object,
                // process its sub-property member metadata.
                if (valuesType && MetaUtils.isObjectType(valuesType)) {
                    const subPropsInfo = getSubPropertyMembersInfo(valuesType, seen, MetaTypes.MDScope.DT, context, updatedPropertyPath, nestedArrayStack, metaUtilObj);
                    if (subPropsInfo) {
                        valuesProps = subPropsInfo.metadata;
                        // If the valuesType might itself have keyed properties,
                        // recursively fetch its keyedProps metadata.
                        if (subPropsInfo.processedMembers <= 0 || subPropsInfo.indexSignatureMembers > 0) {
                            valuesKeyedProps = getKeyedPropsTypeMetadata(valuesType, seen, context, scope, updatedPropertyPath, metaUtilObj);
                        }
                    }
                }
            }
            // We ONLY want to return KeyedPropsMetadata if:
            //  a) this is an INDEXED use case (i.e., Record, or index signatures), or
            //  b) the MAP or SET 'values' type is 'object' or 'Array<object>',
            //      and so we have sub-properties or sub-keyedProperties that
            //      will end up as extension metadata
            //
            // NOTE:  Should we ever support Map key types other than string or number,
            //        then we will need to update this check!
            if (objKeyedPropsInfo.type === MetaTypes.KPType.INDEXED || valuesProps || valuesKeyedProps) {
                // Construct the KeyedPropsMetadata to be returned.
                // Note that all types EXCEPT Sets return 'keys' metadata.
                rtnMD = {};
                if (objKeyedPropsInfo.type !== MetaTypes.KPType.SET) {
                    rtnMD.keys = { type: objKeyedPropsInfo.keysTypeName };
                    if (objKeyedPropsInfo.keysEnum) {
                        rtnMD.keys.enumValues = objKeyedPropsInfo.keysEnum;
                    }
                }
                rtnMD.values = { type: valuesTypeName };
                if (valuesProps) {
                    rtnMD.values.properties = valuesProps;
                }
                if (valuesKeyedProps) {
                    rtnMD.values.keyedProperties = valuesKeyedProps;
                }
            }
        }
    }
    return rtnMD;
}
/**
 * Returns KeyedPropsTypeInfo for a given ts.Type, determining the particular
 * keyed properties use case and returning the constituent parts needed to
 * generate any necessary KeyedPropsMetadata
 */
function getKeyedPropsTypeInfo(objType, context, scope, seen, metaUtilObj) {
    const rtnInfo = { type: MetaTypes.KPType.NONE };
    // First things first:  If the object type is either:
    //
    //    - an Array instance
    //        (because the Array interface definition includes a numeric index)
    //    - a MappedType to a DOM type instance
    //        (because many DOM interface definitions include index signatures,
    //        e.g. 'Partial<CSSStyleDeclaration>')
    //
    // then DO NOT treat it as one of our keyed properties use cases - bail immediately!
    if (objType.symbol?.getName() === 'Array' ||
        (MetaUtils.isMappedType(objType) &&
            objType.aliasSymbol &&
            objType.aliasTypeArguments?.length >= 1 &&
            isJsLibraryType(objType.aliasTypeArguments[0], JS_DOM_TYPE))) {
        return rtnInfo;
    }
    const checker = metaUtilObj.typeChecker;
    const strIndexInfo = checker.getIndexInfoOfType(objType, ts.IndexKind.String);
    const numIndexInfo = checker.getIndexInfoOfType(objType, ts.IndexKind.Number);
    // FIRST USE CASE:
    // Object type with index signature(s), or direct Record type declaration
    // with string and/or number keys
    if (strIndexInfo || numIndexInfo) {
        rtnInfo.type = MetaTypes.KPType.INDEXED; // index signatures, or a Record type
        // If ONLY a numeric index is available, return the key type as 'number'
        // and use the numeric index's type to determine the values.
        if (!strIndexInfo && numIndexInfo) {
            rtnInfo.keysTypeName = 'number';
            rtnInfo.valuesType = numIndexInfo.type;
        }
        // Otherwise, even if BOTH a numeric and string index are available,
        // TypeScript requires the numeric index's type to be a subset of the
        // string index's type -- therefore, we always use the string index's
        // base type to determine the values.
        else {
            if (strIndexInfo && numIndexInfo) {
                rtnInfo.keysTypeName = 'string|number';
            }
            else {
                rtnInfo.keysTypeName = 'string';
            }
            rtnInfo.valuesType = strIndexInfo.type;
        }
    }
    else {
        let objAlias = objType.aliasSymbol;
        if (objAlias) {
            // SECOND USE CASE:
            // Direct Record type declaration, with type references or type parameters
            if (objAlias.getName() === 'Record' && objType.aliasTypeArguments?.length >= 2) {
                rtnInfo.type = MetaTypes.KPType.INDEXED; // a Record type
                const keyType = objType.aliasTypeArguments[0];
                const keyTypeObj = getSignatureFromType(keyType, context | MetaTypes.MDContext.KEYPROPS_KEYS, scope, false, seen, metaUtilObj);
                rtnInfo.keysTypeName = keyTypeObj.type;
                rtnInfo.keysRefType = keyTypeObj.reftype;
                if (keyTypeObj.enumValues || keyTypeObj.enumNumericKeys) {
                    rtnInfo.keysEnum = [
                        ...(keyTypeObj.enumValues ?? []),
                        ...(keyTypeObj.enumNumericKeys ?? [])
                    ];
                }
                rtnInfo.valuesType = objType.aliasTypeArguments[1];
            }
            else {
                const aliasDecl = objAlias.declarations?.[0];
                // THIRD USE CASE:
                // Indirect Record type declaration, with type references or type parameters
                if (aliasDecl &&
                    ts.isTypeAliasDeclaration(aliasDecl) &&
                    ts.isTypeReferenceNode(aliasDecl.type) &&
                    aliasDecl.type.typeName.getText() === 'Record' &&
                    aliasDecl.type.typeArguments?.length >= 2) {
                    rtnInfo.type = MetaTypes.KPType.INDEXED; // a Record type
                    const aliasDecl = objAlias.declarations[0];
                    const aliasTypeRef = aliasDecl.type;
                    // these are the type arguments from the type reference
                    // NOTE:  We do not use the type reference's type arguments here,
                    //        because we want to use the type arguments from the original
                    //        type object, which may have been resolved to a different type
                    //        than the type reference's type arguments.
                    const aliasArgs = objType.aliasTypeArguments;
                    const typeParamMap = new Map();
                    // Build map of type parameter name -> resolved type
                    aliasDecl.typeParameters?.forEach((paramDecl, idx) => {
                        const name = paramDecl.name.text;
                        const resolvedType = aliasArgs[idx];
                        typeParamMap.set(name, resolvedType);
                    });
                    // Key type resolution
                    const keyNode = aliasTypeRef.typeArguments?.[0];
                    let resolvedKeyType = keyNode &&
                        ts.isTypeReferenceNode(keyNode) &&
                        keyNode.typeName.getText() &&
                        typeParamMap.get(keyNode.typeName.getText());
                    if (!resolvedKeyType) {
                        resolvedKeyType = aliasArgs[0]; // fallback
                    }
                    const keyTypeObj = getSignatureFromType(resolvedKeyType, context | MetaTypes.MDContext.KEYPROPS_KEYS, scope, false, seen, metaUtilObj);
                    rtnInfo.keysTypeName = keyTypeObj.type;
                    rtnInfo.keysRefType = keyTypeObj.reftype;
                    if (keyTypeObj.enumValues || keyTypeObj.enumNumericKeys) {
                        rtnInfo.keysEnum = [
                            ...(keyTypeObj.enumValues ?? []),
                            ...(keyTypeObj.enumNumericKeys ?? [])
                        ];
                    }
                    // Value type resolution
                    const valueNode = aliasTypeRef.typeArguments?.[1];
                    let resolvedValueType;
                    let valueTypeNode = valueNode;
                    // again we have the "resolved" type params in the original type object
                    // so we need to replace/substitute these type params in the values type node
                    // if the valueNode is a type reference node, we can use the typeParamMap to resolve it
                    // otherwise we can use the aliasArgs[1] as a fallback
                    if (valueNode) {
                        valueTypeNode = substituteTypeParamsInTypeNode(valueNode, typeParamMap, metaUtilObj.typeChecker);
                        resolvedValueType = checker.getTypeFromTypeNode(valueTypeNode);
                        const printer = ts.createPrinter();
                        const sourceFile = ts.createSourceFile('dummy.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
                        rtnInfo.valuesTypeName = printer.printNode(ts.EmitHint.Unspecified, valueTypeNode, sourceFile);
                    }
                    else {
                        resolvedValueType = aliasArgs[1]; // fallback
                    }
                    rtnInfo.valuesType = resolvedValueType;
                }
            }
        }
    }
    if (rtnInfo.type === MetaTypes.KPType.NONE) {
        const objName = objType.symbol?.getName();
        // FOURTH USE CASE:
        // Map and Set type declarations
        if (objName === 'Map' || objName === 'Set') {
            const typeArgs = checker.getTypeArguments(objType);
            if (objName === 'Map' && typeArgs.length >= 2) {
                rtnInfo.type = MetaTypes.KPType.MAP; // a Map type
                const keyType = typeArgs[0];
                const keyTypeObj = getSignatureFromType(keyType, context | MetaTypes.MDContext.KEYPROPS_KEYS, scope, false, seen, metaUtilObj);
                rtnInfo.keysTypeName = keyTypeObj.type;
                if (keyTypeObj.enumValues || keyTypeObj.enumNumericKeys) {
                    rtnInfo.keysEnum = [
                        ...(keyTypeObj.enumValues ?? []),
                        ...(keyTypeObj.enumNumericKeys ?? [])
                    ];
                }
                rtnInfo.valuesType = typeArgs[1];
            }
            else if (objName === 'Set' && typeArgs.length >= 1) {
                rtnInfo.type = MetaTypes.KPType.SET; // a Set type
                rtnInfo.valuesType = typeArgs[0];
            }
        }
    }
    return rtnInfo;
}
/**
 * Returns SubPropertyMembersInfo for a given complex Property ts.Type
 * Processes the ts.Type's members and returns their metadata.
 *
 * @param type The type whose members we will process
 * @param seen The set of seen type references
 * @param scope Specifies the scope of the metadata being fetched
 * @param context Context flags
 * @param propertyPath An qualified property path name (represented as a string[])
 * @param nestedArrayStack An array of property names used as a stack. We use this stack to keep track of the top-most level where we find
 *       an object based array type. We will explode the properties of that object as extension metadata in the component.json file
 * @param metaUtilObj Bag o'useful stuff
 */
function getSubPropertyMembersInfo(type, seen, scope, context, propertyPath, nestedArrayStack, metaUtilObj, seenTypeDefs) {
    let processedMembers = 0;
    let indexSignatureMembers = 0;
    const metadata = {};
    // Walk the top-level members, checking for circular references and (otherwise) recursing
    // deeply to generate the metadata
    MetaUtils.walkTypeMembers(type, metaUtilObj, (symbol, key, mappedTypeSymbol) => {
        // Short circuit the walk if we've previously determined not to continue
        if (processedMembers < 0) {
            return;
        }
        // Check if the member has a declaration - in the case of a Record whose keys
        // are a union of literals, there will be no declaration and therefore we
        // simply want to continue walking without affecting either processedMembers
        // nor indexSignatureMembers
        if (symbol.declarations === undefined || symbol.declarations.length == 0) {
            if (symbol.getEscapedName() === '__index:string__') {
                indexSignatureMembers += 1;
            }
            return;
        }
        const memberType = symbol.declarations[0].kind;
        if (memberType !== ts.SyntaxKind.PropertySignature) {
            // Note any index signature members and skip over any type parameter members,
            // but otherwise continue walking
            if (memberType === ts.SyntaxKind.IndexSignature) {
                indexSignatureMembers += 1;
            }
            else if (memberType !== ts.SyntaxKind.TypeParameter) {
                // If neither a property member, index signature, nor a type parameter,
                // something strange is going on -- therefore, short-circuit the walk
                processedMembers = -1;
            }
            return;
        }
        else {
            processedMembers += 1;
        }
        const prop = key;
        const updatedPath = [...propertyPath, prop];
        const depth = 2 + updatedPath.length;
        // NOTE:  To properly check for circular type references
        // (whether for 'refType' or 'Array<refType>'), we need
        // at least the extended RT metadata, regardless of the setting
        // of the scope parameter!
        // NOTE:  If the nestedArrayStack is non-empty, then we are processing within
        // nested extension.vbdt.itemProperties metadata - signal this
        // so that we allow default 'value' DT metadata!
        if (scope == MetaTypes.MDScope.DT) {
            const propPathStr = updatedPath.join('->');
            MetaUtils.printInColor(`getAllMetadataForDeclaration:  ${propPathStr}`, metaUtilObj, depth, MetadataTypes_1.Color.FgCyan);
        }
        let propDeclaration = symbol.valueDeclaration;
        if (!propDeclaration) {
            propDeclaration = symbol.declarations[0];
        }
        const metaObj = getAllMetadataForDeclaration(propDeclaration, scope == MetaTypes.MDScope.RT ? MetaTypes.MDScope.RT_EXTENDED : scope, nestedArrayStack.length === 0 ? context : context | MetaTypes.MDContext.EXTENSION_MD, updatedPath, symbol, metaUtilObj);
        let typeName = metaObj.type;
        // Check for circular reference
        const circularRefInfo = checkForCircularReference(metaObj, seen);
        if (circularRefInfo) {
            // Set the member's property metadata without any further recursion
            metaObj.type = getSubstituteTypeForCircularReference(metaObj);
            metadata[prop] = metaObj;
        }
        // Otherwise, recurse down the tree looking for sub-properties
        // or Array item properties
        else {
            if (scope == MetaTypes.MDScope.DT) {
                const propSym = mappedTypeSymbol ?? symbol;
                metaObj.optional = propSym.flags & ts.SymbolFlags.Optional ? true : false;
            }
            let isExtensionMd = false;
            // for DT MD we need to handle object based Arrays and explode the subproperties under the extension key
            // use the nestedArrayStack to keep track of the top most level where we found the Array<object>. Recursive calls
            // from this level down should not attempt to set the extension metadata
            if (scope == MetaTypes.MDScope.DT && metaObj.isArrayOfObject) {
                isExtensionMd = true;
                nestedArrayStack.push(prop);
            }
            if (scope == MetaTypes.MDScope.DT) {
                if (context & MetaTypes.MDContext.TYPEDEF &&
                    seenTypeDefs &&
                    seenTypeDefs.has(metaObj.rawType)) {
                    MetaUtils.printInColor(`getComplexPropertyHelper: circular reference, return`, metaUtilObj, depth, MetadataTypes_1.Color.FgYellow);
                    metadata[prop] = metaObj;
                    return;
                }
                const propPathStr = updatedPath.join('->');
                MetaUtils.printInColor(`getComplexPropertyHelper: for: ${propPathStr}`, metaUtilObj, depth, MetadataTypes_1.Color.FgCyan);
            }
            // Make a copy of the current 'seen' set to pass recursively down to the child property,
            // in order to avoid false positives when type refs from sibling properties are added
            const returnObj = getComplexPropertyHelper(symbol, typeName, new Set(seen), scope, nestedArrayStack.length === 0 ? context : context | MetaTypes.MDContext.EXTENSION_MD, updatedPath, nestedArrayStack, metaUtilObj, seenTypeDefs);
            if (isExtensionMd) {
                nestedArrayStack.pop();
            }
            metadata[prop] = metaObj;
            // If we found any circular references while recursing, we want to
            // cut off further walking down that branch
            if (returnObj.circularRefs?.length > 0) {
                returnObj.circularRefs.pop();
                metadata[prop].type = getSubstituteTypeForCircularReference(metaObj);
            }
            else {
                if (returnObj.subpropsMD) {
                    // object based array case
                    if (metaObj.isArrayOfObject) {
                        metadata[prop].type = 'Array<object>';
                        if (scope == MetaTypes.MDScope.DT) {
                            // we only create extension metadata if this is a top-level array
                            // AND not already in an extension
                            if (nestedArrayStack.length == 0 && !(context & MetaTypes.MDContext.EXTENSION_MD)) {
                                metadata[prop].extension = {};
                                metadata[prop].extension['vbdt'] = {};
                                metadata[prop].extension['vbdt']['itemProperties'] = returnObj.subpropsMD;
                            }
                            else {
                                metadata[prop].properties = returnObj.subpropsMD;
                            }
                        }
                    }
                    else {
                        metadata[prop].type = 'object';
                        metadata[prop].properties = returnObj.subpropsMD;
                    }
                }
                // if we have keyedProperties DT metadata for this prop, we append to the
                // current extension metadata structure or create a new extension structure
                // if not already in an extension
                if (returnObj.keyedpropsMD && scope == MetaTypes.MDScope.DT) {
                    if (nestedArrayStack.length == 0 && !(context & MetaTypes.MDContext.EXTENSION_MD)) {
                        metadata[prop].extension = metadata[prop].extension ?? {};
                        metadata[prop].extension['vbdt'] = metadata[prop].extension['vbdt'] ?? {};
                        metadata[prop].extension['vbdt']['keyedProperties'] = returnObj.keyedpropsMD;
                    }
                    else {
                        metadata[prop]['keyedProperties'] = returnObj.keyedpropsMD;
                    }
                }
                createTypeDefinitionForPropertyDeclaration(returnObj.subpropsMD, symbol, prop, metaObj, context, scope, metaUtilObj, seenTypeDefs);
            }
        }
        // Clean up the property's metadata
        delete metadata[prop]['typeDefs'];
        delete metadata[prop]['rawType'];
        if (scope != MetaTypes.MDScope.DT) {
            delete metadata[prop]['isArrayOfObject'];
            delete metadata[prop]['reftype'];
            delete metadata[prop]['isApiDocSignature'];
            delete metadata[prop]['circularRef'];
        }
    });
    const rtnInfo = {
        processedMembers,
        indexSignatureMembers
    };
    if (processedMembers > 0) {
        rtnInfo.metadata = metadata;
    }
    return rtnInfo;
}
/**
 * Utility function that checks whether we've detected a circular
 * reference during a PropertySignature sub-property walk.
 */
function checkForCircularReference(circularTypeObj, seen) {
    let rtnRefInfo;
    // If we have already seen this type, then we're done
    // -- return the circular type
    if (seen.has(circularTypeObj.type)) {
        rtnRefInfo = {
            circularType: circularTypeObj.type
        };
    }
    // Otherwise, if this is an Array type, perform
    // some additional checks
    else if (circularTypeObj.isArrayOfObject) {
        let arrayRefType = circularTypeObj.reftype;
        // Check to see if we have already seen the type parameter
        // of this Array -- if so, then we're done.
        // Note that the logic that computes MetaTypes.ALL_TYPES
        // will have normalized all Array type names to the
        // 'Array<foo<k>>' form, even if it had been declared in the
        // source as 'foo<k>[]'.
        let openIndex = arrayRefType.indexOf('<');
        let closeIndex = arrayRefType.lastIndexOf('>');
        if (openIndex > 0 && closeIndex > 0) {
            let refType = arrayRefType.substring(openIndex + 1, closeIndex);
            // Array<foo<k>> ==> foo<k>
            // Now strip any parameters from the refType
            openIndex = refType.indexOf('<');
            if (openIndex > 0) {
                refType = refType.substring(0, openIndex);
            }
            if (seen.has(refType)) {
                rtnRefInfo = {
                    circularType: refType
                };
            }
        }
    }
    return rtnRefInfo;
}
/**
 * Returns true if the type symbol is a core JS type
 * @param symbolType The TypeReference symbol to check
 */
function isJsLibraryType(symbolType, libraryName) {
    let isLibType = false;
    const declaration = symbolType?.symbol?.declarations[0];
    if (declaration && declaration.parent && ts.isSourceFile(declaration?.parent)) {
        const sourceFile = declaration.parent;
        isLibType =
            sourceFile.isDeclarationFile &&
                sourceFile.fileName.indexOf(`typescript/lib/${libraryName}`) > -1;
    }
    return isLibType;
}
/**
 * Returns true if the type symbol is a type related to JET Collections
 * (i.e., either DataProvider, TreeDataProvider, DataGridProvider, or KeySet)
 * @param typeName The TypeReference name
 * @param symbolType The TypeReference symbol to check
 */
function isJetCollectionType(typeName, symbolType) {
    let isJetCollectionType = false;
    const declaration = symbolType?.symbol?.declarations[0];
    if (declaration && declaration.parent && ts.isSourceFile(declaration?.parent)) {
        const sourceFile = declaration.parent;
        if (sourceFile.isDeclarationFile) {
            isJetCollectionType =
                (typeName === 'DataProvider' &&
                    sourceFile.fileName.indexOf('types/ojdataprovider/index.d.ts') > -1) ||
                    (typeName === 'KeySet' && sourceFile.fileName.indexOf('types/ojkeyset/index.d.ts') > -1) ||
                    (typeName === 'TreeDataProvider' &&
                        sourceFile.fileName.indexOf('types/ojtreedataprovider/index.d.ts') > -1) ||
                    (typeName === 'DataGridProvider' &&
                        sourceFile.fileName.indexOf('types/ojdatagridprovider/index.d.ts') > -1);
        }
    }
    return isJetCollectionType;
}
/**
 * Checks of a given type object is defined in our Core JET libraries and returns the module name where it was defined.
 */
function getCoreJetModule(symbolType) {
    let jetModule;
    let declaration = symbolType?.symbol?.declarations[0];
    // walk the hierarchy and find a parent that has a sourceFile
    if (declaration && declaration.parent) {
        while (!ts.isSourceFile(declaration)) {
            declaration = declaration.parent;
        }
        const sourceFile = declaration;
        const sourceFileName = sourceFile.fileName;
        if (sourceFile.isDeclarationFile && sourceFileName) {
            const match = sourceFileName.match(_REGEX_CORE_JET_TYPES);
            if (match) {
                jetModule = match[1];
            }
        }
    }
    return jetModule;
}
function isPropertyTypeParameter(propDecl, checker) {
    if (!propDecl.type)
        return false;
    const typeNode = propDecl.type;
    if (ts.isTypeReferenceNode(typeNode)) {
        const typeName = typeNode.typeName;
        if (ts.isIdentifier(typeName)) {
            const symbol = checker.getSymbolAtLocation(typeName);
            if (symbol && symbol.getFlags() & ts.SymbolFlags.TypeParameter) {
                return true;
            }
        }
    }
    return false;
}
function getNonParenthesizedTypeNode(tNode) {
    while (ts.isParenthesizedTypeNode(tNode)) {
        tNode = tNode.type;
    }
    return tNode;
}
function getTypeRefNodeForPropDeclaration(declaration, metaUtilObj) {
    // Remove any ParenthesizedTypeNode wrapper(s)
    const declTypeNode = getNonParenthesizedTypeNode(declaration.type);
    let typeRefNode;
    // Check if we have a union type of some type with (null or undefined) - we can process
    // sub-props in those cases
    //  examples: Array<TypeRef> | null, or Array<{objtypeliteral}> | undefined, or
    //            TypeRef | null | undefined, or {objtypeliteral} | undefined | null
    if (ts.isUnionTypeNode(declTypeNode)) {
        const filteredUnion = declTypeNode.types.filter(nullOrUndefinedTypeNodeFilter);
        // we are not processing subprops for a use-case TypeRef1 | Typeref2,
        // but only a union type with (null and/or undefined)
        if (filteredUnion.length == 1) {
            const result = getNonParenthesizedTypeNode(filteredUnion[0]);
            if (ts.isTypeReferenceNode(result)) {
                const typeRef = result;
                // ex: Array<SomeObject>
                if (typeRef.typeArguments && typeRef.typeName?.getText() === 'Array') {
                    typeRefNode = typeRef.typeArguments[0];
                }
                //ex: ObjectTypeRef or ObjectTypeRef<Generic>
                else {
                    typeRefNode = typeRef;
                }
            }
            //ex: ObjectTypeRef[]
            else if (ts.isArrayTypeNode(result)) {
                typeRefNode = result.elementType;
            }
            else {
                typeRefNode = result;
            }
            // Remove any ParenthesizedTypeNode wrapper(s)
            typeRefNode = getNonParenthesizedTypeNode(typeRefNode);
        }
    }
    else if (ts.isArrayTypeNode(declTypeNode)) {
        // ex: ObjectTypeRef[]
        typeRefNode = getNonParenthesizedTypeNode(declTypeNode.elementType);
    }
    else if (ts.isIndexedAccessTypeNode(declTypeNode)) {
        // ex: TypeRef['foo']
        // return the IndexedAccessTypeNode as-is, caller will perform special processing...
        typeRefNode = declTypeNode;
    }
    else if (ts.isTypeReferenceNode(declTypeNode) || ts.isTypeLiteralNode(declTypeNode)) {
        const exportToAlias = metaUtilObj.progImportMaps.getMap(ImportMaps_1.IMAP.exportToAlias, declTypeNode);
        // cast in order to check for Array, ReadOnlyPropertyChanged...
        const typeRef = declTypeNode;
        const typeRefName = typeRef.typeName?.getText();
        //ex: Array<ObjectTypeRef> or ReadOnlyPropertyChanged<ObjectTypeRef>
        if (typeRef.typeArguments &&
            (typeRefName === 'Array' || typeRefName === `${exportToAlias.ReadOnlyPropertyChanged}`)) {
            typeRefNode = getNonParenthesizedTypeNode(typeRef.typeArguments[0]);
        }
        //ex: ObjectTypeRef or ObjectTypeRef<Generic> or {objtypeliteral}
        else {
            typeRefNode = typeRef;
        }
    }
    if (typeRefNode && ts.isUnionTypeNode(typeRefNode)) {
        const filteredUnion = typeRefNode.types.filter(nullOrUndefinedTypeNodeFilter);
        if (filteredUnion.length == 1) {
            const result = getNonParenthesizedTypeNode(filteredUnion[0]);
            if (ts.isTypeReferenceNode(result) || ts.isTypeLiteralNode(result)) {
                typeRefNode = result;
            }
        }
    }
    return typeRefNode ?? undefined;
}
function getSymbolTypeFromIndexedAccessTypeNode(indexedAccessNode, metaUtilObj) {
    let rtnType;
    let indexedAccessType = metaUtilObj.typeChecker.getTypeAtLocation(indexedAccessNode);
    // For the purposes of finding the underlying symbolType for sub-properties,
    // filter a union type to remove 'undefined' and 'null' sub-types.
    // If that leaves us with a single sub-type, process that single sub-type.
    if (indexedAccessType.isUnion()) {
        let unionTypes = indexedAccessType.types.filter(undefinedTypeFilter).filter(nullTypeFilter);
        if (unionTypes.length == 1) {
            indexedAccessType = unionTypes[0];
        }
    }
    // If the filtered indexedAccessType is still a union, we're done -- no symbolType to process!
    if (!indexedAccessType.isUnion()) {
        // Return the underlying symbolType for the following use cases:
        //  * Intersection Types
        //  * Object Types
        //  * Array<object> or Array<object|null> Types (but not Array<a|b>)
        if (indexedAccessType.isIntersection()) {
            rtnType = indexedAccessType;
        }
        else if (MetaUtils.isObjectType(indexedAccessType)) {
            const typeName = getTypeNameFromType(indexedAccessType);
            if (typeName === 'Array') {
                const elementTypes = metaUtilObj.typeChecker.getTypeArguments(indexedAccessType);
                const arrayItemType = elementTypes?.[0];
                if (arrayItemType) {
                    if (arrayItemType.isUnion()) {
                        let arrayItemUnionTypes = arrayItemType.types
                            .filter(undefinedTypeFilter)
                            .filter(nullTypeFilter);
                        if (arrayItemUnionTypes.length == 1) {
                            rtnType = arrayItemUnionTypes[0];
                        }
                    }
                    else {
                        rtnType = arrayItemType;
                    }
                }
            }
            else {
                rtnType = indexedAccessType;
            }
        }
    }
    return rtnType;
}
function addPotentialTypeDefFromType(type, typeDecl, typeObj, checker, metaUtilObj) {
    let typeArgTypes = getTypeArgumentsForTypeObject(type, checker);
    if (typeArgTypes) {
        typeArgTypes.forEach((typeArg) => {
            // check if the type arg is some type alias
            if (typeArg.flags & ts.SymbolFlags.TypeAlias) {
                let typeArgDecl = getTypeReferenceDeclaration(typeArg);
                if (typeArgDecl) {
                    const typeDefObj = getTypeDefMetadata(typeArg, metaUtilObj);
                    if (typeDefObj && typeDefObj.name) {
                        typeDefObj.typeReference = typeArgDecl;
                        typeObj.typeDefs = typeObj.typeDefs || [];
                        typeObj.typeDefs.push(typeDefObj);
                    }
                }
            }
        });
    }
    // look for potential typedef for the type itself
    const typeDefObj = getTypeDefMetadata(type, metaUtilObj);
    if (typeDefObj && typeDefObj.name) {
        typeDefObj.typeReference = typeDecl;
        typeObj.typeDefs = typeObj.typeDefs || [];
        typeObj.typeDefs.push(typeDefObj);
        return typeDefObj;
    }
    return null;
}
/**
 * Checks if the type of the property/member can be a TypeDefinition in the API Doc. Checks if the member's type is:
 *  - a locally exported type alias
 *  - a reference type
 *  - a Core JET type
 *  - a TS library type
 * @param memberSymbol
 * @param metaObj
 * @param metaUtilObj
 * @returns the type name of the type alias
 */
function getPossibleTypeDef(prop, memberSymbol, metaObj, metaUtilObj) {
    let typedefObj = {};
    // Note:
    // if we determined in preliminary steps that the type of the prop declaration/signature has a reference type
    // and we also determined that we have sub-properties, we will check here if the reference type is
    // a type alias or an interface and based on a buildOptions settings (followImports) we will check if we need to
    // bail the creation of the typedef based the source of the type (declared locally or imported).
    if (metaObj.reftype) {
        try {
            let symbolType = metaUtilObj.typeChecker
                .getTypeOfSymbolAtLocation(memberSymbol, memberSymbol.valueDeclaration)
                .getNonNullableType();
            const kind = memberSymbol.valueDeclaration.kind;
            const declaration = memberSymbol.valueDeclaration;
            if ((kind === ts.SyntaxKind.PropertyDeclaration ||
                kind === ts.SyntaxKind.PropertySignature ||
                kind === ts.SyntaxKind.Parameter) &&
                symbolType &&
                !!(symbolType['flags'] & ts.SymbolFlags.TypeAlias ||
                    symbolType['flags'] & ts.SymbolFlags.Alias)) {
                // try and get the typeRefNode
                const typeRefNode = getTypeRefNodeForPropDeclaration(declaration, metaUtilObj);
                if (typeRefNode) {
                    // when determining if typedefs should be created in the API Doc, we can only deal with type aliases
                    // because we have a name for it.
                    // In case of mapped types, we try to find the argument of the utility type and if that's a type alias then we're good.
                    let typeNode;
                    if (ts.isTypeReferenceNode(typeRefNode)) {
                        if (typeRefNode.typeArguments &&
                            (typeRefNode.typeName.getText() === 'Pick' ||
                                typeRefNode.typeName.getText() === 'Omit' ||
                                typeRefNode.typeName.getText() === 'Partial' ||
                                typeRefNode.typeName.getText() === 'Required' ||
                                typeRefNode.typeName.getText() === 'Readonly')) {
                            typeNode = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode.typeArguments[0]);
                        }
                        else {
                            typeNode = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
                        }
                    }
                    else if (ts.isIndexedAccessTypeNode(typeRefNode)) {
                        // get the "parent" object type's reference
                        const symbolName = symbolType.getSymbol().getName();
                        if (symbolName === 'Array') {
                            typeNode = metaUtilObj.typeChecker.getTypeArguments(symbolType)[0];
                        }
                        else {
                            typeNode = symbolType;
                        }
                    }
                    // bail if we don't have a typeNode
                    if (!typeNode) {
                        return typedefObj;
                    }
                    // once we have a type object do some additional validation and checking and return additional metadata
                    // (like name, type parameters, whether this typedef is defined in a Core Jet module)
                    typedefObj = getTypeDefMetadata(typeNode, metaUtilObj);
                }
            }
        }
        catch (ex) {
            console.log(`Unexpected error happened during typdef lookup for ${prop}`);
        }
    }
    return typedefObj;
}
/**
 * Utility method that returns metadata from a TypeReferenceNode defined and exported from the same module that
 * has the definition of the component.
 * @param typeNode the ts.Type type object defined as an exported type alias
 * @param metaUtilObj
 * @param symbolType
 * @returns
 */
function getTypeDefMetadata(typedefType, metaUtilObj) {
    const isImportFromThisModule = (importedKey) => {
        const bindings = metaUtilObj.coreJetModuleMapping.get(importedKey);
        return bindings?.fileName === metaUtilObj.fullMetadata['jsdoc']['meta'].fileName;
    };
    let typeDefObj = {};
    let typeName;
    // check first if it's a type alias declaration
    let declaration = typedefType?.aliasSymbol?.declarations[0];
    if (!declaration) {
        declaration = typedefType?.symbol?.declarations[0];
    }
    if (!declaration ||
        (declaration?.kind !== ts.SyntaxKind.TypeAliasDeclaration &&
            declaration?.kind !== ts.SyntaxKind.InterfaceDeclaration)) {
        return typeDefObj;
    }
    const typeAliasDeclaration = declaration;
    // get the potential typeref name
    let typeToCheck = typeAliasDeclaration.name?.getText();
    if (!typeToCheck) {
        return typeDefObj;
    }
    // We will also apply another condition: if the type is a core JET type we will short-circuit the creation
    // because we'll give a chance to the jsdoc based API Doc to create a linkable anchor tag for the type signature
    // (at least for the parts of the signature that has a core JET exported API).
    let isCoreJetType = false;
    if (getCoreJetModule(typedefType)) {
        if (metaUtilObj.coreJetModuleMapping && metaUtilObj.coreJetModuleMapping.size > 0) {
            for (let key of metaUtilObj.coreJetModuleMapping.keys()) {
                if (new RegExp(`\\b${key}\\b`, 'g').test(typeToCheck) ||
                    (new RegExp(`\\b${metaUtilObj.coreJetModuleMapping.get(key).binding}\\b`, 'g').test(typeToCheck) &&
                        isImportFromThisModule(key))) {
                    isCoreJetType = true;
                    typeDefObj.coreJetModule = typeDefObj.coreJetModule || {};
                    if (!typeDefObj.coreJetModule[key]) {
                        typeDefObj.coreJetModule[key] = metaUtilObj.coreJetModuleMapping.get(key).module;
                        typeName = key;
                    }
                }
            }
            // we know that there are JET core types imported into this module (we have coreJetModuleMapping created) but we
            // could not find a type match to any of the directly imported JET types (we could be at this point parsing a typedef
            // type in a core jet d.ts file), so lets check if the type NodeObject
            // declaration is from a file that belongs to core JET.
            if (!isCoreJetType) {
                let jetModule = getCoreJetModule(typedefType);
                if (jetModule) {
                    isCoreJetType = true;
                    typeName = typeToCheck;
                    typeDefObj.coreJetModule = typeDefObj.coreJetModule || {};
                    if (!typeDefObj.coreJetModule[typeToCheck]) {
                        typeDefObj.coreJetModule[typeToCheck] = jetModule;
                    }
                }
            }
        }
    }
    // if the type is NOT coming from core JET, proceed otherwise skip further processing, we will not create a typedef
    // instead rely on jsdoc identifying the type and creating proper link to the source of the type.
    if (!isCoreJetType) {
        /*
         * Since we need to gather effectively "class" level jsdoc metadata annotations, we will
         * hard-code here the COMP flag and will pass in null as the property path.
         */
        const md = MetaUtils.getDtMetadata(typeAliasDeclaration, MetaTypes.MDContext.COMP, null, metaUtilObj) || {};
        const signature = getGenericsAndTypeParameters(typeAliasDeclaration, metaUtilObj) || {};
        typeDefObj = { ...md['jsdoc'], ...signature };
        if (typeAliasDeclaration.kind == ts.SyntaxKind.TypeAliasDeclaration ||
            typeAliasDeclaration.kind == ts.SyntaxKind.InterfaceDeclaration) {
            const exportedSymbol = metaUtilObj.typeChecker.getExportSymbolOfSymbol(typedefType.aliasSymbol ?? typedefType.symbol);
            if (exportedSymbol) {
                // Walk up from the typeNode until we find its SourceFile
                let node = typeAliasDeclaration;
                while (!ts.isSourceFile(node)) {
                    node = node.parent;
                }
                const fileName = node.fileName;
                if (fileName && fileName.indexOf('node_modules/typescript/lib/') < 0) {
                    const _isLocalExport = fileName.indexOf(metaUtilObj.fullMetadata['jsdoc'].meta.filename) > -1;
                    if (_isLocalExport || metaUtilObj.followImports) {
                        typeName = typeToCheck;
                    }
                }
            }
        }
    }
    typeDefObj.name = typeName;
    return typeDefObj;
}
function createTypeDefinitionForPropertyDeclaration(subProps, memberSymbol, property, metaObj, context, scope, metaUtilObj, seenTypeDefs) {
    let createTypeDef = true;
    const indent = 2;
    //extra check to make sure we are only running this for the DT metadata case
    if (scope == MetaTypes.MDScope.DT) {
        // if we have sub-properties and we don't have yet a typedef, attempt to create one
        if (subProps && Object.keys(subProps).length > 0) {
            const typeDef = getPossibleTypeDef(property, memberSymbol, metaObj, metaUtilObj);
            if (typeDef && (typeDef.name || typeDef.coreJetModule)) {
                MetaUtils.printInColor(`Trying to create typeDef ${typeDef.name}...`, metaUtilObj, indent, MetadataTypes_1.Color.FgGreen);
                if (typeDef.coreJetModule) {
                    MetaUtils.printInColor(`typeDef is Core JET type`, metaUtilObj, indent, MetadataTypes_1.Color.FgYellow);
                }
                // NOTE:
                // once we determined that we can create a typedef for the property declaration (we have a name for it)
                // the task is simple, just create the typedef object, append the already resolved subprops
                // of the property declaration and add to the global cache.
                // There is however a problem with some of the Mapped Types like Pick or Omit, because
                // they alter the final number of subprops of the property declaration.
                // For instance if we have a type literal Foo with 3 members: memb1, memb2, memb3.
                // This construct property:Pick<Foo, 'memb1'> will result in only 1 subprop for property
                // however if we create a TypeDef for Foo, we want to see all 3 members in the API Doc.
                // So we can't just blindly append the "resolved" subprops of the property declaration, we need additional
                // checks to see if we need to run the TypeDef creation for the type Foo (stashed away in the metaObj of the prop)
                // first check if the discovered typedef name is in the stashed list of possible typedefs for the property signature
                if (Array.isArray(metaObj.typeDefs)) {
                    // find the one that has the same name as the discovered TD
                    // and does not have a targetType set (targetType is used for type aliases)
                    // if we have a targetType set, it means that the typedef is an alias and we we will process
                    // with createTypeDefinitionFromTypeDefObj
                    const targetTypeDef = metaObj.typeDefs.find((td) => td.name === typeDef.name && !td.targetType);
                    // if we couldn't find one it means that the prop signature does not contain the discovered typedef name,
                    // return false so that we can process the stashed typedef types instead (those types were discovered when
                    // we parsed the signature)
                    if (!targetTypeDef) {
                        createTypeDef = false;
                    }
                    else {
                        if (targetTypeDef.targetType) {
                            typeDef.targetType = targetTypeDef.targetType;
                        }
                        // same typedef means we are good, most likely they will have the same number of subprops except
                        // when our property declaration is a Pick or Omit (see explanation above). So let's check that use-case
                        // first get the type of the property declaration
                        let propSymbolType = metaUtilObj.typeChecker
                            .getTypeOfSymbolAtLocation(memberSymbol, memberSymbol.valueDeclaration)
                            .getNonNullableType();
                        if (MetaUtils.isMappedType(propSymbolType)) {
                            const mappedTypeName = getTypeNameFromType(propSymbolType);
                            if (mappedTypeName == 'Omit' || mappedTypeName == 'Pick') {
                                createTypeDef = false;
                            }
                        }
                    }
                }
                // we go ahead and use the subprops as the shape of the typedef but still check if this was not
                // already created
                if (createTypeDef) {
                    if (!MetaUtils.findTypeDefByName(typeDef, metaUtilObj)) {
                        // only attach subprops if the TypeDef is not for an alias.
                        if (!typeDef.targetType) {
                            typeDef.properties = subProps;
                        }
                        // add to the global typedef registry
                        metaUtilObj.typeDefinitions.push(typeDef);
                        MetaUtils.printInColor(`Created TypeDef: ${typeDef.name} for property: ${property} with type: ${metaObj.reftype}`, metaUtilObj, indent, MetadataTypes_1.Color.FgGreen);
                    }
                    else {
                        MetaUtils.printInColor(`typeDef ${typeDef.name} was already created, skip`, metaUtilObj, indent, MetadataTypes_1.Color.FgGreen);
                    }
                }
            }
            else {
                createTypeDef = false;
                MetaUtils.printInColor(`Could not find a possible typeDef`, metaUtilObj, indent, MetadataTypes_1.Color.FgYellow);
            }
        }
        else {
            createTypeDef = false;
            MetaUtils.printInColor(`No subprops, will not create typeDef`, metaUtilObj, indent, MetadataTypes_1.Color.FgYellow);
        }
        if (!createTypeDef) {
            // in case we returned have no sub-props from spelunking the structure of the property declaration
            // or we have type(s) in the signature that is not in sync with the potential typedef we tried to create
            // above, try to create typedefs for the potential TypeDef types in the property signature. We stashed this away
            // in the typeDefs key of metaObj
            if (metaObj && metaObj.typeDefs) {
                // loop through the typeObjects and attempt to create TypeDefs
                const propDeclTypeStr = metaObj.rawType;
                let stack = new Set();
                if (propDeclTypeStr) {
                    // if are already processing a typedef...
                    if (context & MetaTypes.MDContext.TYPEDEF && seenTypeDefs) {
                        // use the stack already initialized
                        stack = seenTypeDefs;
                    }
                    stack.add(propDeclTypeStr);
                    MetaUtils.createTypeDefinitionFromTypeDefObj(
                    //metaObj.typeDefs.map((t) => t.typeReference),
                    metaObj.typeDefs, metaUtilObj, stack);
                }
            }
        }
    }
}
/**
 * Utility function that checks if a given typeRefNode is a local export.
 * @param typeRefNode The TypeReferenceNode to check
 * @param metaUtilObj Shared utility object where we collect various RT/DT metadata
 * @returns true if the typeRefNode is a local export, false otherwise
 */
function isLocalExport(typeRefNode, metaUtilObj) {
    let isLocalExport = false;
    const symbolType = metaUtilObj.typeChecker.getTypeAtLocation(typeRefNode);
    const typeAliasDeclaration = symbolType.aliasSymbol?.declarations?.[0] || symbolType.symbol?.declarations?.[0];
    const exportedSymbol = metaUtilObj.typeChecker.getExportSymbolOfSymbol(symbolType.aliasSymbol ?? symbolType.symbol);
    if (exportedSymbol) {
        if (typeAliasDeclaration.parent && ts.isSourceFile(typeAliasDeclaration?.parent)) {
            const sourceFile = typeAliasDeclaration.parent;
            isLocalExport =
                sourceFile.fileName.indexOf(metaUtilObj.fullMetadata['jsdoc'].meta.filename) > -1;
        }
    }
    return isLocalExport;
}
/**
 * Utility function that returns a type object for a given function-like-node return type (whether this is
 * declared explicitly or inferred).
 * @param functionNode This is a function-like node (declared as function expression, function delcaration, arrow function)
 * @param metaUtilObj Shared utility object where we collect various RT/DT metadata
 * @returns
 */
function getReturnTypeForFunction(functionNode, metaUtilObj) {
    const rtnTsType = (0, Utils_1.getFunctionReturnTsType)(functionNode, metaUtilObj.typeChecker);
    const returnTypeObj = getSignatureFromType(rtnTsType, MetaTypes.MDContext.METHOD | MetaTypes.MDContext.METHOD_RETURN, MetaTypes.MDScope.DT, false, null, metaUtilObj);
    return returnTypeObj;
}
/**
 *
 * @param type The semantic representation of a declaration (property, parameter, etc)
 * @returns The syntactic representation (i.e., the NodeObject, like a TypeAliasDeclaration, InterfaceDeclaration, etc.) of the semantic type of a declaration.
 */
function getDeclarationOfAType(type) {
    return type.aliasSymbol?.getDeclarations()?.[0] ?? type.symbol?.getDeclarations()?.[0];
}
// Utility method that keeps unique TypeReferenceNodes in an array, based on their type name
function addUniqueTypeRefs(target, source) {
    if (target.length == 0) {
        target = target.concat(source);
    }
    else {
        // see if we already have added the same TypeNode
        source.forEach((tref) => {
            if (!target.find((node) => node.typeName === tref.typeName)) {
                target.push(tref);
            }
        });
    }
    return target;
}
/**
 * Utility iterable class that wraps a ts.Type defining an Event's detail payload,
 * a TemplateSlot's data, etc., and iterates over its type parameter declarations
 * (any type parameters that are generic should match those of Props definition).
 * This needs to work regardless of whether the ts.Type refers to a Type Alias,
 * an Interface, a Class, etc.
 */
class ParameterizedTypeDeclIterator {
    constructor(type, typeNode, checker) {
        _ParameterizedTypeDeclIterator_paramSource.set(this, void 0);
        __classPrivateFieldSet(this, _ParameterizedTypeDeclIterator_paramSource, [], "f");
        // type refers to a Type Alias?
        if (type.aliasSymbol) {
            if (type.aliasTypeArguments) {
                for (const ata of type.aliasTypeArguments) {
                    const paramDecl = ata.aliasSymbol?.getDeclarations()?.[0] ?? ata.symbol?.getDeclarations()?.[0];
                    if (paramDecl) {
                        __classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f").push(paramDecl);
                    }
                    else {
                        // just in case...
                        __classPrivateFieldSet(this, _ParameterizedTypeDeclIterator_paramSource, [], "f");
                        break;
                    }
                }
            }
        }
        // Otherwise, use the corresponding typeNode
        else {
            const typeNodes = typeNode.typeArguments
                ? [...typeNode.typeArguments]
                : ts.isArrayTypeNode(typeNode)
                    ? [typeNode.elementType]
                    : ts.isTupleTypeNode(typeNode)
                        ? [...typeNode.elements]
                        : [];
            for (const tNode of typeNodes) {
                const tArgType = checker.getTypeAtLocation(tNode);
                const tArgDecl = tArgType.aliasSymbol?.getDeclarations()?.[0] ?? tArgType.symbol?.getDeclarations()?.[0];
                if (tArgDecl) {
                    __classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f").push(tArgDecl);
                }
                else {
                    // just in case...
                    __classPrivateFieldSet(this, _ParameterizedTypeDeclIterator_paramSource, [], "f");
                    break;
                }
            }
        }
    }
    [(_ParameterizedTypeDeclIterator_paramSource = new WeakMap(), Symbol.iterator)]() {
        let index = 0;
        return {
            next: () => {
                if (__classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f") && index < __classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f").length) {
                    return { value: __classPrivateFieldGet(this, _ParameterizedTypeDeclIterator_paramSource, "f")[index++], done: false };
                }
                else {
                    return { done: true };
                }
            }
        };
    }
}
/**
 * Utility function that unwraps a non-nullable utility type like NonNullable<T>.
 * It returns the original type T if it is wrapped in a NonNullable utility type.
 * @param type The ts.Type to unwrap
 * @param checker The TypeChecker instance to use for type resolution
 * @returns The unwrapped type, or the original type if it is not a NonNullable utility type
 */
function unwrapNonNullableUtilityType(type, checker) {
    // Handle known mapped utility wrapper like NonNullable<T>
    // Typically, NonNullable<T> is represented as an intersection of T & {}
    if (MetaUtils.isNonNullableType(type, checker)) {
        //const unwrapped = type.types.find(t => !checker.typeToString(t).includes('{}'));
        const unwrapped = type.aliasTypeArguments?.[0];
        return unwrapped ?? type;
    }
    return type;
}
/**
 * Utility function that substitutes type parameters in a TypeNode with their corresponding types from a map.
 * This is useful for resolving generic types in TypeNodes.
 * @param node The TypeNode to process
 * @param map A Map where keys are type parameter names and values are the corresponding ts.Type
 * @param checker The TypeChecker instance to use for type resolution
 * @returns A new TypeNode with type parameters substituted
 */
function substituteTypeParamsInTypeNode(node, map, checker) {
    const resolve = (n) => {
        if (ts.isTypeReferenceNode(n)) {
            const typeName = n.typeName.getText();
            const replacement = map.get(typeName);
            if (replacement) {
                return checker.typeToTypeNode(replacement, undefined, ts.NodeBuilderFlags.NoTruncation);
            }
            if (n.typeArguments?.length) {
                const resolvedArgs = n.typeArguments.map(resolve);
                return ts.factory.updateTypeReferenceNode(n, n.typeName, ts.factory.createNodeArray(resolvedArgs));
            }
        }
        if (ts.isArrayTypeNode(n)) {
            return ts.factory.updateArrayTypeNode(n, resolve(n.elementType));
        }
        if (ts.isUnionTypeNode(n)) {
            const resolved = n.types.map(resolve);
            return ts.factory.updateUnionTypeNode(n, ts.factory.createNodeArray(resolved));
        }
        return n;
    };
    return resolve(node);
}
/**
 * Utility function that checks if the type of a property declaration is an aliased union type.
 * If so, it attempts to resolve the type definition from the alias and updates the type object accordingly.
 * @param type The resolved type of the property declaration
 * @param propDecl The property declaration that has the type
 * @param typeObj The type object to update with the resolved type definition
 * @param metaUtilObj Shared utility object for metadata processing
 */
function getTypeDefForAliasedUnionTypes(type, propDecl, typeObj, metaUtilObj) {
    const checker = metaUtilObj.typeChecker;
    const declaredType = propDecl.type;
    if (!declaredType || !type)
        return;
    type = type.getNonNullableType();
    const declaredTypeStr = checker.typeToString(type);
    const getValidAliasTarget = () => {
        let aliasSymbol;
        const extractAliasSymbol = (node) => {
            if (ts.isTypeReferenceNode(node)) {
                const resolvedType = checker.getTypeAtLocation(node);
                return resolvedType.aliasSymbol;
            }
            return undefined;
        };
        const getSymbolTypeFromIndexedAccessTypeNode = (indexedAccessNode) => {
            let rtnType;
            let indexedAccessType = metaUtilObj.typeChecker.getTypeAtLocation(indexedAccessNode);
            // filter a union type to remove 'undefined' and 'null' sub-types.
            // If that leaves us with a single sub-type, process that single sub-type.
            if (indexedAccessType.isUnion()) {
                let unionTypes = indexedAccessType.types.filter(undefinedTypeFilter).filter(nullTypeFilter);
                if (unionTypes.length == 1) {
                    indexedAccessType = unionTypes[0];
                }
                else {
                    rtnType = indexedAccessType;
                }
            }
            // If the filtered indexedAccessType is not a union anymore, check if it is wrapped in Array
            if (!indexedAccessType.isUnion()) {
                // Return the underlying symbolType for the following use cases:
                //  * Object Types
                //  * Array<object> or Array<object|null> Types (but not Array<a|b>) or Set or the ReadonlyArray
                if (MetaUtils.isObjectType(indexedAccessType)) {
                    const typeName = getTypeNameFromType(indexedAccessType);
                    if (['Array', 'Set', 'ReadonlyArray'].includes(typeName)) {
                        const elementTypes = metaUtilObj.typeChecker.getTypeArguments(indexedAccessType);
                        const innerType = elementTypes?.[0];
                        rtnType = innerType;
                    }
                    else {
                        rtnType = indexedAccessType;
                    }
                }
            }
            return rtnType;
        };
        // If the type is a TypeReferenceNode, we can try to extract the alias symbol from it
        const typeReferenceNode = getTypeRefNodeForPropDeclaration(propDecl, metaUtilObj);
        if (typeReferenceNode && !ts.isTypeLiteralNode(typeReferenceNode)) {
            if (ts.isIndexedAccessTypeNode(typeReferenceNode)) {
                const indexedNodeType = getSymbolTypeFromIndexedAccessTypeNode(typeReferenceNode);
                if (indexedNodeType) {
                    aliasSymbol = indexedNodeType.aliasSymbol;
                    if (metaUtilObj.debugMode) {
                        console.log(`Type of indexed node for IndexedAccessTypeNode: ${checker.typeToString(indexedNodeType)}`);
                    }
                }
            }
            else {
                aliasSymbol = extractAliasSymbol(typeReferenceNode);
            }
        }
        if (!aliasSymbol)
            return;
        const aliasDecl = aliasSymbol.declarations?.[0];
        if (ts.isTypeAliasDeclaration(aliasDecl)) {
            const aliasType = aliasDecl.type;
            if (checker.getTypeAtLocation(aliasDecl).isUnionOrIntersection()) {
                if (ts.isUnionTypeNode(aliasType)) {
                    const nonTypeRefs = aliasType.types.filter((n) => !ts.isTypeReferenceNode(n));
                    if (nonTypeRefs.length === 0) {
                        return aliasDecl.type;
                    }
                }
            }
        }
        return undefined;
    };
    const resolvedTypeIsObjectLike = typeObj.type === 'object' || typeObj.type === 'Array<object>';
    if (!resolvedTypeIsObjectLike)
        return;
    const typeAliasDecl = getValidAliasTarget();
    if (!typeAliasDecl)
        return;
    const typeAliasType = checker.getTypeAtLocation(typeAliasDecl);
    const typeDef = addPotentialTypeDefFromType(typeAliasType, typeAliasDecl, typeObj, checker, metaUtilObj);
    if (!typeDef)
        return;
    if (typeObj.isArrayOfObject) {
        typeObj.reftype = typeObj.reftype.replace(/Array<(.+)>/, '$1');
    }
    typeDef.targetType = typeObj.reftype;
    const normalizeArraySyntax = (s) => s.replace(/\b([a-zA-Z0-9_$.]+)\[\]/g, 'Array<$1>');
    const declaredNorm = normalizeArraySyntax(declaredTypeStr);
    typeObj.reftype = declaredNorm;
}
/**
 * Utility function that normalizes a type literal string by replacing double quotes with single quotes
 * and converting array syntax from TypeName[] to Array<TypeName>.
 * @param typeStr The type literal string to normalize
 * @returns The normalized type literal string
 */
function normalizeTypeLiteralString(typeStr) {
    // Replace " with '
    let normalized = typeStr.replace(/"/g, "'");
    // Replace TypeName[] with Array<TypeName>
    normalized = normalized.replace(/\b([\w$.]+)\[\]/g, 'Array<$1>');
    return normalized;
}
/**
 * Pretty-print a TypeLiteralNode for API Doc display.
 * Removes `| undefined` from each property signature's type.
 */
function prettyPrintTypeLiteralForApiDoc(typeLiteral) {
    const printer = ts.createPrinter();
    const visitMember = (member) => {
        if (ts.isPropertySignature(member) &&
            member.type &&
            member.questionToken // only for optional props
        ) {
            let newTypeNode = member.type;
            if (ts.isUnionTypeNode(newTypeNode)) {
                // Filter `undefined` in unions
                const filtered = newTypeNode.types.filter((t) => t.kind !== ts.SyntaxKind.UndefinedKeyword);
                if (filtered.length < newTypeNode.types.length) {
                    newTypeNode = ts.factory.createUnionTypeNode(filtered);
                }
            }
            // Recurse: if it's a nested TypeLiteral, clean it too
            if (ts.isTypeLiteralNode(newTypeNode)) {
                newTypeNode = cleanTypeLiteral(newTypeNode);
            }
            return ts.factory.updatePropertySignature(member, member.modifiers, member.name, member.questionToken, newTypeNode);
        }
        // Also handle non-optional prop with nested object:
        if (ts.isPropertySignature(member) && member.type && ts.isTypeLiteralNode(member.type)) {
            const cleaned = cleanTypeLiteral(member.type);
            return ts.factory.updatePropertySignature(member, member.modifiers, member.name, member.questionToken, cleaned);
        }
        return member;
    };
    const cleanTypeLiteral = (node) => {
        const newMembers = node.members.map(visitMember);
        return ts.factory.updateTypeLiteralNode(node, ts.factory.createNodeArray(newMembers));
    };
    const cleanedRoot = cleanTypeLiteral(typeLiteral);
    return printer.printNode(ts.EmitHint.Unspecified, cleanedRoot, typeLiteral.getSourceFile());
}
/**
 * Pretty-print a ts.Type for an API Doc signature:
 * - if the prop is optional, remove `| undefined`
 * - otherwise keep it as-is
 */
function prettyPrintTypeForApiDoc(type, propDecl, checker) {
    // Only do special handling for a PropertyDeclaration/PropertySignature
    if ((ts.isPropertyDeclaration(propDecl) || ts.isPropertySignature(propDecl)) &&
        propDecl.questionToken) {
        if (type.isUnion()) {
            // Remove undefined from the union
            const filtered = type.types.filter((t) => !(t.flags & ts.TypeFlags.Undefined));
            if (filtered.length === 1) {
                return checker.typeToString(filtered[0], propDecl, ts.TypeFormatFlags.NoTruncation);
            }
            else if (filtered.length > 1) {
                const nodes = filtered.map((t) => checker.typeToTypeNode(t, undefined, ts.NodeBuilderFlags.NoTruncation));
                const unionNode = ts.factory.createUnionTypeNode(nodes);
                const newType = checker.getTypeFromTypeNode(unionNode);
                return checker.typeToString(newType, propDecl, ts.TypeFormatFlags.NoTruncation);
            }
        }
    }
    // For everything else: default
    return checker.typeToString(type, propDecl, ts.TypeFormatFlags.NoTruncation);
}
//# sourceMappingURL=MetadataTypeUtils.js.map