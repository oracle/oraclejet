import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function generateClassMethodMetadata(node: ts.ClassElement, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function isCustomElementClassMethod(node: ts.ClassElement, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function processRegisteredMethodsInfo(methodsInfo: MetaTypes.RegisteredMethodsInfo, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function updateJetElementMethods(metaObjUtils: MetaTypes.MetaUtilObj): void;
