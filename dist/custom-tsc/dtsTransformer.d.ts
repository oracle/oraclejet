import * as ts from 'typescript';
import { BuildOptions } from './compile';
export default function dtsTransformWrapper(program: ts.Program, buildOptions: BuildOptions): ts.TransformerFactory<ts.SourceFile>;
export declare function assembleTypes(buildOptions: BuildOptions): void;
