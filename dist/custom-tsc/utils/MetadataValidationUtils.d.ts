import ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function getValidationInfo(key: string): MetaTypes.MDValidationInfo | null;
export declare function isValidMetadata(key: string, value: any, mdValidInfo: MetaTypes.MDValidationInfo, tag: ts.JSDocTag, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
