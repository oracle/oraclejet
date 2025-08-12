import * as ts from 'typescript';
/**
 * Looks for a decorator of a specified name for a given node.
 * @param node Node to process
 * @param name Name of the decorator to retrieve
 * @returns Decorator requested, or undefined if not found
 */
export declare function getDecorator(node: ts.Node, name: string): ts.Decorator | undefined;
/**
 * Retrieves all the decorators for the given node.
 * @param node Node to process
 * @returns A map of decorator names to Decorator instances.
 */
export declare function getDecorators(node: ts.Node): Record<string, ts.Decorator>;
/**
 * Returns the name of a specified ts.Decorator
 * @param decorator Decorator to process
 * @returns Name of the decorator
 */
export declare function getDecoratorName(decorator: ts.Decorator): string;
/**
 * Retrieves the arguments array for the given decorator.
 * @param decorator Decorator to process
 * @returns Expression array representing the decorator's arguments, or undefined if no arguments
 */
export declare function getDecoratorArguments(decorator: ts.Decorator): ts.NodeArray<ts.Expression> | undefined;
