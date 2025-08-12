import * as ts from 'typescript';
import { BuildOptions } from './compile';
/**
 * Transformer run over the TypeScript AST to generate the metadata used
 * at runtime, for component.json and downstream dependencies generating
 * additional Element and JSX types.
 * @param program
 * @param buildOptions
 */
export default function transformer(program: ts.Program, buildOptions: BuildOptions): (ctx: ts.TransformationContext) => ts.Transformer<ts.SourceFile>;
