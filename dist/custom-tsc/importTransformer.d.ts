import * as ts from 'typescript';
import { BuildOptions } from './compile';
/**
 * Transformer run after the metadata transformer and before the code
 * is compiled to JavaScript so we can add any missing import statements.
 * @param buildOptions
 */
export default function importTransformWrapper(buildOptions: BuildOptions): ts.TransformerFactory<ts.SourceFile>;
