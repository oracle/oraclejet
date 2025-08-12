import * as ts from 'typescript';
import { BuildOptions } from './compile';
/**
 * Transformer run over the TypeScript AST to add custom element specific AST nodes effectively manipulating the
 * final d.ts file
 * @param program
 * @param buildOptions
 */
export default function dtsTransformWrapper(program: ts.Program, buildOptions: BuildOptions): ts.TransformerFactory<ts.SourceFile>;
export declare function assembleTypes(buildOptions: BuildOptions): void;
