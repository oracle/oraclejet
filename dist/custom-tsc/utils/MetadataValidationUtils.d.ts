import ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
/**
 * Given a DT Metadata key, determine if it is recognized and return a clone
 * of its corresponding MetaTypes.MDValidationInfo; otherwise return null
 */
export declare function getValidationInfo(key: string, context: MetaTypes.MDContext): MetaTypes.MDValidationInfo | null;
/**
 * Performs general validation of a DT metadata key/value pair, given its MDValidationInfo.
 * If invalid, log an appropriate warning for the specified JSDocTag and return false;
 * otherwise return true.
 */
export declare function isValidMetadata(key: string, value: any, mdValidInfo: MetaTypes.MDValidationInfo, tag: ts.JSDocTag, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
