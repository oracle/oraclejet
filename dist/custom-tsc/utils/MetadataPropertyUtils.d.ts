import * as ts from "typescript";
import * as MetaTypes from "./MetadataTypes";
export declare function generatePropertiesMetadata(propsNode: ts.TypeNode, isCustomElement: boolean, metaUtilObj: MetaTypes.MetaUtilObj): Record<string, string[]>;
export declare function checkReservedProps(propsNode: ts.TypeNode, isCustomElement: boolean, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function generateRootPropsMetadata(rootProps: string[], metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function updateWritebackProps(writebackProps: string[], readOnlyProps: string[], metaUtilObj: MetaTypes.MetaUtilObj): void;
