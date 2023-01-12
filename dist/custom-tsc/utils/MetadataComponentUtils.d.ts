import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
import { BuildOptions } from '../compile';
export declare function getVCompClassInfo(elementName: string, classNode: ts.ClassDeclaration, vexportToAlias: MetaTypes.ImportAliases, checker: ts.TypeChecker, compilerOptions: ts.CompilerOptions, buildOptions: BuildOptions): MetaTypes.VCompClassInfo | null;
export declare function getVCompFunctionInfo(functionalCompNode: MetaTypes.VCompFunctionalNode, vexportToAlias: MetaTypes.ImportAliases, checker: ts.TypeChecker, compilerOptions: ts.CompilerOptions, buildOptions: BuildOptions): MetaTypes.VCompFunctionInfo | null;
export declare function getDtMetadataForComponent(vcompInfo: MetaTypes.VCompInfo, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function isVCompBaseClassFound(typeRef: ts.ExpressionWithTypeArguments, vexportToAlias: MetaTypes.ImportAliases, checker: ts.TypeChecker): boolean;
