import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
import { BuildOptions } from '../compile';
export declare function getVCompClassInfo(elementName: string, classNode: ts.ClassDeclaration, progImportMaps: MetaTypes.VCompImportMaps, checker: ts.TypeChecker, buildOptions: BuildOptions): MetaTypes.VCompClassInfo | null;
export declare function getVCompFunctionInfo(functionalCompNode: MetaTypes.VCompFunctionalNode, progImportMaps: MetaTypes.VCompImportMaps, checker: ts.TypeChecker, buildOptions: BuildOptions): MetaTypes.VCompFunctionInfo | null;
export declare function getDtMetadataForComponent(vcompInfo: MetaTypes.VCompInfo, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function getTranslationBundleInfo(vcompInfo: MetaTypes.VCompInfo, compilerOptions: ts.CompilerOptions, buildOptions: BuildOptions, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.VCompTranslationBundleInfo;
