import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function generatePropertiesMetadata(propsInfo: MetaTypes.PropsInfo, metaUtilObj: MetaTypes.MetaUtilObj): Record<string, MetaTypes.NameNodePair[]>;
export declare function checkReservedProps(propsInfo: MetaTypes.PropsInfo, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function generateObservedGlobalPropsMetadata(prop: string, propDecl: ts.PropertyDeclaration, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function generatePropertiesRtExtensionMetadata(writebackPropNameNodes: MetaTypes.NameNodePair[], readOnlyPropNameNodes: MetaTypes.NameNodePair[], observedGlobalProps: Set<string>, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function isDefaultProps(node: ts.ClassElement): boolean;
export declare function updateDefaultsFromDefaultProps(defaultProps: ts.NodeArray<MetaTypes.DefaultPropsElement>, metaUtilObj: MetaTypes.MetaUtilObj): void;
