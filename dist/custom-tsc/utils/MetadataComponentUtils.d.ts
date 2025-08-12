import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
import { BuildOptions } from '../compile';
import { ImportMaps } from '../shared/ImportMaps';
/**
 * Returns information necessary to process a class that
 * extends a Preact component, or null if the class does
 * not require any further transformer processing.
 *
 * If the class does extend a Preact component but does not
 * have the shape we are looking for, then throw an exception.
 */
export declare function getVCompClassInfo(elementName: string, classNode: ts.ClassDeclaration, progImportMaps: ImportMaps, checker: ts.TypeChecker, buildOptions: BuildOptions): MetaTypes.VCompClassInfo | null;
/**
 * Returns information necessary to process a Preact functional component
 * registered as a JET VComponent custom element, or null if the
 * specified node is not associated with registering a functional component.
 *
 * If the function's Props parameter does not have the shape we are looking for,
 * then throw an exception.
 */
export declare function getVCompFunctionInfo(functionalCompNode: MetaTypes.VCompFunctionalNode, progImportMaps: ImportMaps, checker: ts.TypeChecker, buildOptions: BuildOptions): MetaTypes.VCompFunctionInfo | null;
export declare function getDtMetadataForComponent(vcompInfo: MetaTypes.VCompInfo, metaUtilObj: MetaTypes.MetaUtilObj): void;
/**
 * Returns information needed to inject translation bundles information into
 * the VComponent's emitted JS
 */
export declare function getTranslationBundleInfo(vcompInfo: MetaTypes.VCompInfo, compilerOptions: ts.CompilerOptions, buildOptions: BuildOptions, metaUtilObj: MetaTypes.MetaUtilObj): MetaTypes.VCompTranslationBundleInfo;
