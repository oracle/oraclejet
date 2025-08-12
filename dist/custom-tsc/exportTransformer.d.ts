import * as ts from 'typescript';
import { ApiDocOptions } from './compile';
export type ReexportedType = {
    exportedName: string;
    originalName: string;
    from: string;
    kind: string;
};
/**
 * Transformer run after the metadata transformer and before the code
 * is compiled to JavaScript so we can add any missing import statements.
 * @param buildOptions
 */
export default function moduleExportTransformer(program: ts.Program, buildOptions: ApiDocOptions): ts.TransformerFactory<ts.SourceFile>;
