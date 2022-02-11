import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function generateMethodMetadata(node: ts.ClassElement, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function isCustomElementMethod(node: ts.ClassElement, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function updateJetElementMethods(metaObjUtils: MetaTypes.MetaUtilObj): void;
