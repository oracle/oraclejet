import * as ts from 'typescript';
import { ApiDocOptions } from './compile';
export default function utilityTransformer(program: ts.Program, options: ApiDocOptions): ts.TransformerFactory<ts.SourceFile>;
