import * as ts from 'typescript';
import * as MetaTypes from './MetadataTypes';
export declare function getParentDirPath(tsFileName: string): string | null;
export declare function getComponentJSONObj(dirPath: string): Record<string, any>;
export declare function getInstalledDependenciesPackMap(program: ts.Program): Map<string, MetaTypes.VCompPack>;
