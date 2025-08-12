import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
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
export declare function getGenericsAndTypeParameters(node: MetaTypes.HasTypeParameters, metaUtilObj: MetaTypes.MetaUtilObj, extras?: MetaTypes.GTExtras): MetaTypes.GenericsTypes | undefined;
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
export declare function getGenericsAndTypeParametersFromType(typeObj: ts.Type, typeNode: ts.TypeNode, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.GenericsTypesFromType | undefined;
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
export declare function getSignatureFromType(type: ts.Type, context: MetaTypes.MDContext, scope: MetaTypes.MDScope, isPropSignatureType: boolean, seen: Set<string> | null, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.ALL_TYPES;
export declare function getTypeNameFromType(type: ts.Type): string;
export declare function getTypeNameFromIntersectionTypes(types: Array<ts.Type>): string;
export declare function getNodeDeclaration(node: ts.TypeNode, checker: ts.TypeChecker): ts.Declaration;
export declare function getTypeDeclaration(type: ts.Type): ts.Declaration;
export declare function getTypeReferenceDeclaration(type: ts.Type): ts.TypeReferenceNode;
export declare function isTypeLiteralType(type: ts.Type): boolean;
export declare function isGenericTypeParameter(symbol: ts.Symbol): boolean;
export declare function getPropertyType(typeRef: ts.TypeNode, propName?: string): string;
/**
 * Handles Intersection types needed for event, slot cases
 * (e.g. Action & Bubbles, Slot & ImplicitBusyContext)
 * @param propDeclaration
 */
export declare function getPropertyTypes(propDeclaration: ts.PropertyDeclaration): Record<string, ts.TypeNode>;
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
export declare function getComplexPropertyMetadata(memberSymbol: ts.Symbol, metaObj: MetaTypes.ALL_TYPES, outerType: string | undefined, scope: MetaTypes.MDScope, context: MetaTypes.MDContext, propertyPath: string[], nestedArrayStack: string[], metaUtilObj: MetaTypes.MetaUtilObj, seenTypeDefs?: Set<string>): MetaTypes.ComplexPropertyMetadata;
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
export declare function getComplexPropertyMetadataForType(tsType: ts.Type, metaObj: MetaTypes.ALL_TYPES, typeName: string | undefined, scope: MetaTypes.MDScope, context: MetaTypes.MDContext, propertyPath: string[], nestedArrayStack: string[], metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.ComplexPropertyMetadata;
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
export declare function processComplexPropertyMetadata(property: string, metaObj: MetaTypes.ALL_TYPES, complexMD: MetaTypes.ComplexPropertyMetadata, dtMetadata: MetaTypes.ExtendedPropertiesMetadata): void;
export declare function getSubstituteTypeForCircularReference(metaObj: MetaTypes.ALL_TYPES): string;
export declare function getAllMetadataForDeclaration(declarationWithType: ts.HasType, scope: MetaTypes.MDScope, context: MetaTypes.MDContext, propertyPath: string[] | null, declSymbol: ts.Symbol | null, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.ExtendedPropertiesMetadata | MetaTypes.ExtendedEventDetailsMetadata | MetaTypes.ExtendedSlotDataMetadata;
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
export declare function possibleComplexProperty(symbolType: ts.Type, type: string, scope: MetaTypes.MDScope): boolean;
export declare function isClassDeclaration(symbolType: ts.Type): boolean;
export declare function getEnumStringsFromUnion(union: ts.UnionTypeNode): string[] | null;
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
export declare function getPossibleTypeDef(prop: string, memberSymbol: ts.Symbol, metaObj: MetaTypes.ExtendedPropertiesMetadata | MetaTypes.ExtendedEventDetailsMetadata | MetaTypes.ExtendedSlotDataMetadata, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.TypedefObj;
/**
 * Utility method that returns metadata from a TypeReferenceNode defined and exported from the same module that
 * has the definition of the component.
 * @param typeNode the ts.Type type object defined as an exported type alias
 * @param metaUtilObj
 * @param symbolType
 * @returns
 */
export declare function getTypeDefMetadata(typedefType: ts.Type, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.TypedefObj;
/**
 * Utility function that checks if a given typeRefNode is a local export.
 * @param typeRefNode The TypeReferenceNode to check
 * @param metaUtilObj Shared utility object where we collect various RT/DT metadata
 * @returns true if the typeRefNode is a local export, false otherwise
 */
export declare function isLocalExport(typeRefNode: ts.TypeNode, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
/**
 * Utility function that returns a type object for a given function-like-node return type (whether this is
 * declared explicitly or inferred).
 * @param functionNode This is a function-like node (declared as function expression, function delcaration, arrow function)
 * @param metaUtilObj Shared utility object where we collect various RT/DT metadata
 * @returns
 */
export declare function getReturnTypeForFunction(functionNode: ts.SignatureDeclaration, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.ALL_TYPES;
/**
 *
 * @param type The semantic representation of a declaration (property, parameter, etc)
 * @returns The syntactic representation (i.e., the NodeObject, like a TypeAliasDeclaration, InterfaceDeclaration, etc.) of the semantic type of a declaration.
 */
export declare function getDeclarationOfAType(type: ts.Type): ts.Declaration;
/**
 * Pretty-print a ts.Type for an API Doc signature:
 * - if the prop is optional, remove `| undefined`
 * - otherwise keep it as-is
 */
export declare function prettyPrintTypeForApiDoc(type: ts.Type, propDecl: ts.HasType, checker: ts.TypeChecker): string;
