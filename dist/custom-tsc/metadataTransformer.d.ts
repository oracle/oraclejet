import * as ts from 'typescript';
import { BuildOptions } from './compile';
export default function transformer(program: ts.Program, buildOptions: BuildOptions): (ctx: ts.TransformationContext) => ts.Transformer<ts.SourceFile>;
