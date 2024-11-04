import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function tagNameToElementInterfaceName(tagName: string): string;
export declare function tagNameToElementRoot(tagName: string): string;
export declare function writebackCallbackToProperty(property: string): string;
export declare function getGenericTypeParameters(propsTypeNode: ts.NodeWithTypeArguments): MetaTypes.GenericTypeParametersInfo;
export declare function getTypeParametersFromType(type: ts.Type, checker: ts.TypeChecker): string;
export declare function getDtMetadata(objWithJsDoc: ts.HasJSDoc, context: MetaTypes.MDContext, propertyPath: string[] | null, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.AllMetadataTypes;
export declare function addMetadataToClassNode(vcompClassInfo: MetaTypes.VCompClassInfo, rtMetadata: MetaTypes.RuntimeMetadata): ts.ClassDeclaration;
export declare function updateFunctionalVCompNode(functionalCompNode: MetaTypes.VCompFunctionalNode, vcompFunctionInfo: MetaTypes.VCompFunctionInfo, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.VCompFunctionalNode;
export declare function getPropsInfo(compType: MetaTypes.VCompType, componentName: string, typeRef: ts.TypeReferenceNode, progImportMaps: MetaTypes.VCompImportMaps, checker: ts.TypeChecker): MetaTypes.PropsInfo | null;
export declare function getIntersectionTypeNodeInfo(intersectionTypeNode: ts.IntersectionTypeNode, progImportMaps: MetaTypes.VCompImportMaps, isInline: boolean, checker: ts.TypeChecker): MetaTypes.IntersectionTypeNodeInfo;
export declare function getMappedTypesInfo(outerType: ts.Type, checker: ts.TypeChecker, isPropsInfo: boolean, outerTypeNode?: ts.TypeNode): MetaTypes.MappedTypesInfo | null;
export declare function isMappedTypeReference(typeRefNode: ts.TypeReferenceNode): boolean;
export declare function isPropsMappedType(type: ts.Type, typeNode?: ts.TypeNode): boolean;
export declare function isAliasToMappedType(type: ts.Type, typeNode: ts.TypeNode): boolean;
export declare function getWrappedReadonlyType(type: ts.Type, typeNode: ts.TypeNode, componentName: string, checker: ts.TypeChecker): ts.Type | null;
export declare function constructMappedTypeName(mappedTypesInfo: MetaTypes.MappedTypesInfo, wrappedTypeGenerics?: string): string;
export declare function isMappedType(type: ts.Type): boolean;
export declare function isRecordType(type: ts.Type): boolean;
export declare function isFunctionType(type: ts.Type, checker: ts.TypeChecker): boolean;
export declare function isConditionalType(type: ts.Type): boolean;
export declare function isObjectType(type: ts.Type): boolean;
export declare function isTypeTreatedAsAny(type: ts.Type): boolean;
export declare function isIndexedAccessTypeParameters(type: ts.Type): boolean;
export declare const _UNION_SPLITTER: RegExp;
export declare const _INTERSECTION_SPLITTER: RegExp;
export declare function isConditionalTypeNodeDetected(typeNode: ts.TypeNode, seen: Set<string>, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function walkTypeMembers(type: ts.Type, metaUtilObj: MetaTypes.MetaUtilObj, callback: (memberSymbol: ts.Symbol, memberKey: ts.__String, mappedTypeSymbol?: ts.Symbol) => void): void;
export declare function walkTypeNodeMembers(typeNode: ts.TypeNode, metaUtilObj: MetaTypes.MetaUtilObj, callback: (memberSymbol: ts.Symbol, memberKey: ts.__String, mappedTypeSymbol?: ts.Symbol) => void): void;
export declare function updateCompilerPropsMetadata(readOnlyPropNameNodes: MetaTypes.NameNodePair[], metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function updateCompilerCompMetadata(vcompInfo: MetaTypes.VCompInfo, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function pruneCompilerMetadata(metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function pruneMetadata(metadata: Record<string, any>): void;
export declare function updateRtExtensionMetadata(name: string, value: any, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function removeCastExpressions(vNode: ts.Node): ts.Node;
export declare function isValueNodeReference(vNode: ts.Node): boolean;
export declare function getValueNodeFromReference(refNode: ts.Node, metaUtilObj: MetaTypes.MetaUtilObj): ts.Node | null;
export declare function getValueNodeFromIdentifier(idNode: ts.Identifier, metaUtilObj: MetaTypes.MetaUtilObj): ts.Node | null;
export declare function getValueNodeFromPropertyAccessExpression(propAccessNode: ts.PropertyAccessExpression, metaUtilObj: MetaTypes.MetaUtilObj): ts.Node | null;
export declare function getMDValueFromNode(valueNode: ts.Node, prop: string, metaUtilObj?: MetaTypes.MetaUtilObj, topLvlProp?: string): any;
export declare function generateStatementsFromText(text: string, offset?: number): ts.Statement[];
export declare function removeQuotes(str: any): any;
export declare function createTypeDefinitionFromTypeRefs(typeRefs: ts.TypeReferenceNode[], metaUtilObj: MetaTypes.MetaUtilObj, seenTypeDefs?: Set<string> | null): MetaTypes.TypedefObj[];
export declare function findTypeDefByName(typeDef: MetaTypes.TypedefObj, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.TypedefObj;
export declare function printInColor(color: any, text: any, metaUtilObj: MetaTypes.MetaUtilObj, indent: any): void;
