import * as ts from 'typescript';
import { CompilerOptions } from 'typescript';
import { JETComp } from './JETComp';
import { JETContent } from './JETContent';
/**
 * Returns a TypeScript file path (i.e., in posix format) that is guaranteed
 * to be an absolute path
 */
export declare function ensureAbsolutePath(relPath: string): string;
/**
 * Finds the well-known '__apidoc__' directory containing shareable jsdoc comment blocks, starting
 * from the project's current directory, rootDirs or rootDir values
 * @param compilerOptions
 * @returns the absolute path to the '__apidoc__' directory
 */
export declare function findApidocRootDir(compilerOptions: CompilerOptions): string | undefined;
/**
 * Given a TypeScript filename, return the TypeScript path to its parent directory
 * or null if the file is at the root (no parent directory)
 */
export declare function getParentDirPath(tsFileName: string): string | null;
/**
 * Given a TypeScript directory path, determine if a component.json file exists - if so,
 * read the file and parse it to return the resulting object.
 */
export declare function getComponentJSONObj(dirPath: string): Record<string, any>;
/**
 * Given a JET ts.Program, return a map of installed dependency Packs.
 */
export declare function getInstalledDependenciesMap(program: ts.Program): Map<string, JETComp>;
/**
 * Information returned by getAllMonoPacks
 */
export type MonoPackInfo = {
    absPath: string;
    monoPack: JETComp;
};
/**
 * Given the CompilerOptions in effect for this Program's transpilation,
 * return a mappping of JET mono-packs to be transpiled.
 */
export declare function getAllMonoPacks(compilerOptions: ts.CompilerOptions): Record<string, MonoPackInfo>;
export declare function writeJETContentMetadata(outDir: string, packPath: string, content: JETContent): void;
