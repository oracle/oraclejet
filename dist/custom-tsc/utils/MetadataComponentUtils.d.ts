import * as ts from "typescript";
import * as MetaTypes from "./MetadataTypes";
export declare function getVCompClassInfo(classNode: ts.ClassDeclaration, vexportToAlias: MetaTypes.DecoratorAliases, checker: ts.TypeChecker): MetaTypes.VCompClassInfo | null;
export declare function getDtMetadataForComponent(classNode: ts.ClassDeclaration, metaUtilObj: MetaTypes.MetaUtilObj): void;
