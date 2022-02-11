import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function getVCompClassInfo(elementName: string, classNode: ts.ClassDeclaration, vexportToAlias: MetaTypes.ImportAliases, checker: ts.TypeChecker): MetaTypes.VCompClassInfo | null;
export declare function getVCompFunctionInfo(functionalCompNode: MetaTypes.VCompFunctionalNode, vexportToAlias: MetaTypes.ImportAliases, checker: ts.TypeChecker): MetaTypes.VCompFunctionInfo | null;
export declare function getDtMetadataForComponent(compNode: ts.HasJSDoc, metaUtilObj: MetaTypes.MetaUtilObj): void;
export declare function isVCompBaseClassFound(typeRef: ts.ExpressionWithTypeArguments, vexportToAlias: MetaTypes.ImportAliases, checker: ts.TypeChecker): boolean;
