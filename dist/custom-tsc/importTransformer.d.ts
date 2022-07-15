import * as ts from 'typescript';
import { BuildOptions } from './compile';
export default function importTransformWrapper(buildOptions: BuildOptions): ts.TransformerFactory<ts.SourceFile>;
