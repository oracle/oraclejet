import * as ts from 'typescript';
/**
 * Given a Symbol, return its JSDoc description text
 */
export declare function getCommentForSymbol(symbol: ts.Symbol | undefined, checker: ts.TypeChecker): string;
/**
 * Given a Node representing a value, return the corresponding metadata value.
 * A metadata value has to be expressible as JSON, otherwise return undefined.
 */
export declare function getMDValue(vNode: ts.Node, checker: ts.TypeChecker): any;
/**
 * Extract the type name from a TypeReferenceType node
 */
export declare function getTypeNameFromTypeReference(node: ts.TypeReferenceType): string | undefined;
/**
 * Given an Identifier reference, get the underlying value node
 * or undefined if a value node could not be determined.
 * If the underlying value of the Identifier is actually 'undefined',
 * then return this unique Identifier as the value node.
 */
export declare function getValueNodeFromIdentifier(iNode: ts.Identifier, checker: ts.TypeChecker): ts.Node | undefined;
/**
 * Given a PropertyAccessExpression reference, get the underlying value node
 * or undefined if a value node could not be determined.
 * Given a node for the expression 'Foo.bar':
 *    -> node.expression refers to object 'Foo'
 *    -> node.name identifies prop 'bar'
 * References to an EnumMember are a special case of a PropertyAccessExpression.
 */
export declare function getValueNodeFromPropertyAccessExpression(propAccessNode: ts.PropertyAccessExpression, checker: ts.TypeChecker): ts.Node | undefined;
/**
 * Given a node that references a value node, get the underlying value node or
 * undefined if a value node could not be determined
 */
export declare function getValueNodeFromReference(refNode: ts.Node, checker: ts.TypeChecker): ts.Node | undefined;
/**
 * Return true if the specified value node is actually a reference to a value
 */
export declare function isValueNodeReference(vNode: ts.Node): boolean;
/**
 * Given a "function-like" node, returns the ts.Type object representing
 * its return type
 */
export declare function getFunctionReturnTsType(funcDecl: ts.SignatureDeclaration, checker: ts.TypeChecker): ts.Type;
/**
 * Given a value node, remove any wrapping type cast 'as' expressions
 * to get the underlying expression node
 */
export declare function removeCastExpressions(vNode: ts.Node): ts.Node;
/**
 * Convert a stick-case name to TitleCase
 */
export declare function stickCaseToTitleCase(name: string): string;
/**
 * Convert a TitleCase (or camelCase) name to stick-case
 */
export declare function titleCaseToStickCase(name: string): string;
/**
 * Return a new string with quotes (single or double) removed
 * from the beginning and end of the original string
 */
export declare function trimQuotes(text: string): string;
/**
 * Walk the properties of a Type, invoking a specified callback
 * whose arguments are the property's Symbol and Name
 */
export declare function walkPropertiesOfType(type: ts.Type, checker: ts.TypeChecker, callback: (propSymbol: ts.Symbol, propName: string) => void): void;
