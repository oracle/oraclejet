import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
import { ImportMaps } from '../shared/ImportMaps';
/**
 * Utility method that converts a custom element tag name to the name
 * used for the custom element's TS interface, e.g. oj-some-component -> SomeComponentElement.
 * NOTE: Copied from CustomElementUtils.tagNameToElementClassName static method.
 * @param tagName
 * @ignore
 */
export declare function tagNameToElementInterfaceName(tagName: string): string;
export declare function writebackCallbackToProperty(property: string): string;
/**
 * Utility method that generates a generics signature string
 * and an array of type parameter names.
 * It works off of a Node object with typeArguments.
 */
export declare function getGenericTypeParameters(propsTypeNode: ts.NodeWithTypeArguments): MetaTypes.GenericTypeParametersInfo;
/**
 * Utility method that generates a TypeParameters signature string.
 * It works off of a Type object.
 */
export declare function getTypeParametersFromType(type: ts.Type, checker: ts.TypeChecker): string;
export declare function getDtMetadata(objWithJsDoc: ts.HasJSDoc, context: MetaTypes.MDContext, propertyPath: string[] | null, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.AllMetadataTypes;
/**
 * Returns an updated class node with additional static metadata properties
 * pointing to runtime metadata and/or a translation bundle map.
 * @param vcompClassInfo Information about the VComponent class instance
 * @param rtMetadata The metadata object
 */
export declare function addMetadataToClassNode(vcompClassInfo: MetaTypes.VCompClassInfo, rtMetadata: MetaTypes.RuntimeMetadata): ts.ClassDeclaration;
/**
 * Update the functional VComponent node before returning from the transformer.
 *
 * Inject additional arguments into the registerCustomElement call:
 *    - a StringLiteral representing a default 'displayName' property value
 *    - an ObjectLiteralExpression representing the runtime metadata for the function VComponent
 *      (as needed)
 *    - an ObjectLiteralExpression representing default property values for the function VComponent
 *      (as needed)
 *    - an Expression representing a map of translation bundleIds to loader functions
 *      (as needed)
 *    - an Expression representing a map of Contexts (as needed - only supports 'consume' for now)
 *
 * In addition, if the functional VComponent exposes methods, then we also need to modify the inline
 * Preact functional component argument to the registerCustomElement call in order to inject
 * a ref object reference to be forwarded to the Preact component's children.
 *
 * @param functionalCompNode VariableStatement or ExpressionStatement for the functional VComp
 * @param vcompFunctionInfo Information about the functional VComp
 * @param metaUtilObj Bag o'useful stuff
 */
export declare function updateFunctionalVCompNode(functionalCompNode: MetaTypes.VCompFunctionalNode, vcompFunctionInfo: MetaTypes.VCompFunctionInfo, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.VCompFunctionalNode;
/**
 * Utility method that analyzes the TypeReferenceNode (from a class's heritageClause)
 * and determines whether we indeed have a reference to a Props type
 * for a VComponent custom element.
 * If so, we return an object with all the necessary information for subsequent
 * processing of custom element Props metadata.
 * Otherwise, return null.
 */
export declare function getPropsInfo(compType: MetaTypes.VCompType, componentName: string, typeRef: ts.TypeReferenceNode, progImportMaps: ImportMaps, checker: ts.TypeChecker): MetaTypes.PropsInfo | null;
/**
 * Additional processing for the Props object if it is specified by an IntersectionTypeNode:
 *
 *   - return an array of observed global properties if the ObservedGlobalProps utility type
 *     is in the list of intersection types
 *
 *   - if the intersection type consists of a single type + ObservedGlobalProps
 *     (e.g., 'foo & ObservedGlobalProps<"id", "aria-label">), then return an alternate
 *     TypeNode (e.g., 'foo') that filters out the ObservedGlobalProps utility type
 *
 *   - if the intersection type consists of multiple types + ObservedGlobalProps
 *     (e.g., 'foo & bar & ObservedGlobalProps<"id", "aria-label">), then return
 *     the computed Props name (e.g., 'foo & bar') for generating the component's d.ts
 */
export declare function getIntersectionTypeNodeInfo(intersectionTypeNode: ts.IntersectionTypeNode, progImportMaps: ImportMaps, isInline: boolean, checker: ts.TypeChecker): MetaTypes.IntersectionTypeNodeInfo;
/**
 * Additional processing for the Props object if it is wrapped by one or more
 * mapping Utility types.  There are two fundamental use cases for using getMappedTypesInfo:
 *
 *  - When constructing PropsInfo that describes the Props object, an outerTypeNode parameter
 *    is specified.  This is our signal to leverage TypeNodes to walk the Types and TypeNodes
 *    in tandem.
 *
 *  - When constructing a typeName for a MappingType, the optional outerTypeNode parameter
 *    is NOT specified.  This is our signal to ignore any TypeNode processing, and simply
 *    walk the Type structure in order to gather information about nested mapping types.
 *
 * This utility function returns null if no mapping types are detected; otherwise, it returns:
 *
 *  - an array of MappedTypeItem objects, specifying MappedType names and any additional type parameters;
 *  - if an outer TypeNode was specified, then return inner TypeNode from whence we can derive
 *    the propsGenericDeclaration.
 *
 */
export declare function getMappedTypesInfo(outerType: ts.Type, checker: ts.TypeChecker, isPropsInfo: boolean, outerTypeNode?: ts.TypeNode): MetaTypes.MappedTypesInfo | null;
/**
 * Given a TypeReferenceNode, determine if this is a "simple" type reference (i.e.,
 * neither a reference to an Array nor a reference to a MappedType utility wrapper).
 */
export declare function isSimpleTypeReference(typeRefNode: ts.TypeReferenceNode): boolean;
/**
 * Given a potential Props object Type, determines if this is
 * a MappedType requiring special PropsInfo processing.
 */
export declare function isPropsMappedType(type: ts.Type, typeNode?: ts.TypeNode): boolean;
/**
 * Determine whether the Props type is actually an alias to a MappedType
 */
export declare function isAliasToMappedType(type: ts.Type, typeNode: ts.TypeNode): boolean;
/**
 * If the Props type is a Readonly type (with no other mappings), then return
 * the unwrapped type; otherwise, return null.
 */
export declare function getWrappedReadonlyType(type: ts.Type, typeNode: ts.TypeNode, componentName: string, checker: ts.TypeChecker): ts.Type | null;
/**
 * Constructs a typeName, given a MappedTypesInfo object.
 *
 * If the wrappedTypeGenerics string is specified, then include those
 * type parameters for the innermost wrapped Type when constructing
 * the requested typeName.
 *
 * We don't need the type parameters for the innermost wrapped Type
 * for those use cases where we are simply using the returned typeName
 * to check for circular dependencies, etc.
 */
export declare function constructMappedTypeName(mappedTypesInfo: MetaTypes.MappedTypesInfo, wrappedTypeGenerics?: string): string;
/**
 * Given a Type, determines if this is a Mapped Type
 * (requires special handling during walking to get its
 * Property members).
 */
export declare function isMappedType(type: ts.Type): boolean;
/**
 * For a given Type return true if this mapped type is a generic Record type
 * @param type a type object
 * @returns
 */
export declare function isRecordType(type: ts.Type): boolean;
export declare function isFunctionType(type: ts.Type, checker: ts.TypeChecker): boolean;
/**
 * Given a Type, determines if this is a Conditional type
 */
export declare function isConditionalType(type: ts.Type): boolean;
/**
 * Given a Type, determines if this is an Object type
 */
export declare function isObjectType(type: ts.Type, checker?: ts.TypeChecker): boolean;
/**
 * Given a Type, determines if it is an object type whose sub-properties
 * we would want to walk - for example, even though arrays, tuples, Maps,
 * and Sets are all JS objects, we don't want to directly walk their members.
 */
export declare function isWalkableObjectType(type: ts.Type, checker: ts.TypeChecker): boolean;
/**
 * Given a Type, determines if this is the NonNullable wrapper type
 * (i.e., NonNullable<T>).
 */
export declare function isNonNullableType(type: ts.Type, checker: ts.TypeChecker): boolean;
/**
 * Given a Type, determines if this is "any" or "unknown"
 */
export declare function isTypeTreatedAsAny(type: ts.Type): boolean;
/**
 * Given a Type, determine if it is an IndexedAccessType whose objectType
 * and indexType are type parameters (i.e., "D[keyof D]")
 */
export declare function isIndexedAccessTypeParameters(type: ts.Type): boolean;
export declare const _UNION_SPLITTER: RegExp;
export declare const _INTERSECTION_SPLITTER: RegExp;
/**
 * Returns true if a direct or indirect reference to a ConditionalTypeNode
 * is detected; otherwise false.
 */
export declare function isConditionalTypeNodeDetected(typeNode: ts.TypeNode, seen: Set<string>, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
/**
 * Given a Type, walks the members of that Type and processes them
 * via a specified callback.
 */
export declare function walkTypeMembers(type: ts.Type, metaUtilObj: MetaTypes.MetaUtilObj, callback: (memberSymbol: ts.Symbol, memberKey: ts.__String, mappedTypeSymbol?: ts.Symbol) => void): void;
/**
 * Given a TypeNode, walks the members of the underlying Type and processes them
 * via a specified callback.
 */
export declare function walkTypeNodeMembers(typeNode: ts.TypeNode, metaUtilObj: MetaTypes.MetaUtilObj, callback: (memberSymbol: ts.Symbol, memberKey: ts.__String, mappedTypeSymbol?: ts.Symbol) => void): void;
/**
 * Convenience method for preactMetadataTransformer to stash compiler-only Props metadata
 * (metadata that is only available after all Properties have been processed), which is
 * needed for type generation about the Props type.
 */
export declare function updateCompilerPropsMetadata(readOnlyPropNameNodes: MetaTypes.NameNodePair[], metaUtilObj: MetaTypes.MetaUtilObj): void;
/**
 * Convenience method to stash compiler only metadata needed for type generation
 * and property binding metadata for the component (whether functional or class-based).
 * @param classNode
 */
export declare function updateCompilerCompMetadata(vcompInfo: MetaTypes.VCompInfo, metaUtilObj: MetaTypes.MetaUtilObj): void;
/**
 * Removes metadata stashed for the type generator before writing out files
 */
export declare function pruneCompilerMetadata(metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function pruneMetadata(metadata: Record<string, any>): void;
export declare function updateRtExtensionMetadata(name: string, value: any, metaUtilObj: MetaTypes.MetaUtilObj): void;
/**
 * Returns the metadata value represented by a given AST node.
 * MD values MUST be serializable to JSON, otherwise return undefined.
 *
 * If optional metaUtilObj is provided, then this utility supports:
 *    - dereferencing of reference nodes (including EnumMembers and other references to LiteralTypes)
 *    - exception reporting for metadata values that cannot serialize to JSON
 *
 * If optional topLvlProp is provided, then any exception reporting will provide
 * both the (top-level) property and sub-property context.
 *
 * @param valueNode AST node representing a metadata value
 * @param prop Name of metadata property
 * @param metaUtilObj If specified, enables dereferencing of reference nodes and exception reporting
 * @param topLvlProp If 'prop' is a metadata sub-property name, provides name of top-level MD property
 */
export declare function getMDValueFromNode(valueNode: ts.Node, prop: string, metaUtilObj?: MetaTypes.MetaUtilObj, topLvlProp?: string): any;
/**
 * Returns the value of a specified Property from an ObjectLiteralExpression
 * @param objLiteral ObjectLiteralExpression node
 * @param prop Name of property whose value is requested
 * @returns property value, or undefined if property does not exist in object literal
 */
export declare function getPropertyValueFromObjectLiteralExpression(objLiteral: ts.ObjectLiteralExpression, propName: string): any;
/**
 * Given a code snippet as a string, generate an array of Statement objects.
 *
 * The Statements will be generated as if they started from the beginning
 * of a logical SourceFile - if an optional offset is specified, then this
 * offset is applied to all of the Statements before they are returned.
 * @param text code snippet
 * @param offset? optional offset to apply to the TextRanges of the generated Statements
 * @returns ts.Statement[]
 */
export declare function generateStatementsFromText(text: string, offset?: number): ts.Statement[];
export declare function removeQuotes(str: any): any;
export declare function createTypeDefinitionFromTypeRefs(typeRefs: ts.TypeReferenceNode[], metaUtilObj: MetaTypes.MetaUtilObj, seenTypeDefs?: Set<string> | null): MetaTypes.TypedefObj[];
export declare function createTypeDefinitionFromTypeDefObj(typeDefs: MetaTypes.TypedefObj[], metaUtilObj: MetaTypes.MetaUtilObj, seenTypeDefs?: Set<string> | null): MetaTypes.TypedefObj[];
export declare function findTypeDefByName(typeDef: MetaTypes.TypedefObj, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.TypedefObj;
export declare class MetaUtilObjFactory {
    static create(typeChecker: ts.TypeChecker): MetaTypes.MetaUtilObj;
    static create(typeChecker: ts.TypeChecker, componentName: string, componentInfo: MetaTypes.VCompInfo, progImportMaps: ImportMaps): MetaTypes.MetaUtilObj;
}
/**
 * Prints the given text in color if the debug mode is enabled.
 * @param text The text to print.
 * @param metaUtilObj The MetaUtilObj containing debug mode information.
 * @param indent The number of spaces to indent the text.
 * @param fgColor Optional foreground color.
 * @param bgColor Optional background color.
 */
export declare function printInColor(text: any, metaUtilObj: MetaTypes.MetaUtilObj, indent: any, fgColor?: string, bgColor?: string): void;
