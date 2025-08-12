import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
import { type DefaultProps } from '../shared/DefaultProps';
export declare function generatePropertiesMetadata(propsInfo: MetaTypes.PropsInfo, metaUtilObj: MetaTypes.MetaUtilObj): Record<string, MetaTypes.NameNodePair[]>;
export declare function checkReservedProps(propsInfo: MetaTypes.PropsInfo, metaUtilObj: MetaTypes.MetaUtilObj): void;
/**
 * Determines if a property is an observed global property and, if so, adds its metadata
 * to the `observedGlobalProps` section of the provided metadata object.
 *
 * If the property is an inline observed global property, its metadata is extracted and
 * stored, and the function returns `true` to indicate it should not be processed as a
 * regular VComponent property. If the property is a reserved global property (but not
 * a value declaration), the function also returns `true` to skip further processing.
 *
 * @param prop - The name of the property being checked.
 * @param propDecl - The TypeScript property declaration node.
 * @param metaUtilObj - The metadata utility object containing context and metadata maps.
 * @param isValueDeclaration - Indicates if the property is a value declaration.
 * @returns `true` if the property is an observed or reserved global property and should be excluded from further processing; otherwise, `false`.
 */
export declare function generateObservedGlobalPropsMetadata(prop: string, propDecl: ts.PropertyDeclaration, metaUtilObj: MetaTypes.MetaUtilObj, isValueDeclaration: boolean): boolean;
export declare function generatePropertiesRtExtensionMetadata(writebackPropNameNodes: MetaTypes.NameNodePair[], readOnlyPropNameNodes: MetaTypes.NameNodePair[], observedGlobalProps: Set<string>, metaUtilObj: MetaTypes.MetaUtilObj): void;
/**
 * Walks the static defaultProps class property and update the
 * rt metadata
 * @param rt The runtime metadata object for the property
 * @param objExpression The defaultProps object
 */
export declare function updateDefaultsFromDefaultProps(defaultProps: DefaultProps, metaUtilObj: MetaTypes.MetaUtilObj): void;
