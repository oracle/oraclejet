import * as ts from "typescript";
import * as MetaTypes from "./MetadataTypes";
export declare function generatePropertiesMetadata(propsInfo: MetaTypes.PropsInfo, metaUtilObj: MetaTypes.MetaUtilObj): Record<string, string[]>;
export declare function checkReservedProps(propsInfo: MetaTypes.PropsInfo, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function generatePropertiesRtExtensionMetadata(writebackProps: string[], readOnlyProps: string[], observedGlobalProps: string[], metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function isDefaultProps(node: ts.ClassElement): boolean;
export declare function updateDefaultsFromDefaultProps(defaultProps: ts.ObjectLiteralExpression, metaUtilObj: MetaTypes.MetaUtilObj): void;
