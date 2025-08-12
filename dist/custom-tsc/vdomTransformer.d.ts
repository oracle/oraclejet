import * as ts from 'typescript';
/**
 * CustomTransformer that visits the AST identifying JET mono-pack contents
 * that are vdom components (i.e., exported Preact components and hooks) and
 * then generates simplified JET component metadata JSON for these contents.
 */
export default function vdomTransformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile>;
