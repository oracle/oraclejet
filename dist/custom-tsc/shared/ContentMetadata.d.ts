import * as ts from 'typescript';
import * as Metadata from 'ojs/ojmetadata';
import { type DefaultProps } from './DefaultProps';
type VdomPropertiesPickedProps = 'type' | 'description' | 'status';
type ContentMetadataCommonProps = {
    extension?: object;
    optional?: boolean;
    value?: any;
};
type VdomPropertiesMetadata = Pick<Metadata.ComponentMetadataProperties, VdomPropertiesPickedProps> & ContentMetadataCommonProps & {
    properties?: VdomProperties;
};
export type VdomProperties = {
    [propName: string]: VdomPropertiesMetadata;
};
export type VdomParam = (Metadata.MethodParam & ContentMetadataCommonProps & {
    properties?: VdomProperties;
}) | void;
export type VdomReturn = Omit<Exclude<VdomParam, void>, 'name' | 'optional' | 'value'>;
/**
 * Context flags when recursively generating Content Metadata
 */
export declare enum CMContext {
    PROPERTY = 1,
    PARAM = 2,
    RETURN = 4,
    IN_EXTENSION = 8
}
export declare function generateVdomPropertiesMetadata(type: ts.Type, context: CMContext, seen: Set<string>, checker: ts.TypeChecker, defaultProps?: DefaultProps): VdomProperties | undefined;
export declare function generateVdomParamMetadata(paramDecl: ts.ParameterDeclaration, tags: readonly ts.JSDocTag[], checker: ts.TypeChecker): VdomParam;
export declare function generateVdomReturnMetadata(rtnType: ts.Type, tags: readonly ts.JSDocTag[], checker: ts.TypeChecker): VdomReturn;
export {};
