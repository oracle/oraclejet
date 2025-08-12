import * as ts from 'typescript';
/**
 * defaultProps mapping of properties to default values consists of
 * an array ofa NodeArray either ObjectLiteralElements or BindingElements
 */
export type DefaultProps = ts.NodeArray<DefaultPropsElement>;
export type DefaultPropsElement = ts.ObjectLiteralElementLike | ts.BindingElement;
/**
 * The source for the defaultProps mapping depends upon how the Component is defined
 *    - Function-based:  object binding pattern off of the (first) parameter declaration
 *    - Class-based:  class element with the name 'defaultProps'
 */
export type DefaultPropsSource = ts.ParameterDeclaration | ts.ClassElement;
export declare function getDefaultPropsFromSource(source: DefaultPropsSource): DefaultProps | undefined;
/**
 * Given a DefaultPropsElement, return the metadata value
 */
export declare function getDefaultPropValue(defElem: DefaultPropsElement, checker: ts.TypeChecker): any;
/**
 * Check whether the specified ClassElement provides the defaultProps mapping for
 * a Class-based Component.
 */
export declare function isDefaultPropsClassElement(elem: ts.ClassElement): boolean;
