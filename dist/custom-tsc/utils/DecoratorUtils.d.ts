import * as ts from "typescript";
export declare function getDecorator(node: ts.Node, name: string): ts.Decorator;
export declare function getDecorators(node: ts.Node): Record<string, ts.Decorator>;
export declare function getDecoratorName(decorator: ts.Decorator): string;
export declare function getDecoratorParamValue(decorator: ts.Decorator, paramName: string): any;
