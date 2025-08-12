import * as ts from 'typescript';
import { BuildOptions } from './compile';
/**
 * Transformer run after the metadata transformer and before the code
 * is compiled to JavaScript so we can remove design time only decorators,
 * removing any run time footprints.
 * @param program
 * @param buildOptions
 */
export default function decoratorTransformer(buildOptions: BuildOptions): (ctx: ts.TransformationContext) => ts.Transformer<ts.SourceFile>;
