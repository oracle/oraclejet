import * as ts from 'typescript';
export type SharedContentType = Record<string, Record<string, string>>;
declare const sharedDocs: SharedContentType;
/**
 * Transformer that scans *_doc.ts files inside a well-known __apidoc__ directory and detects regions.
 * A region is a jsdoc comment block delimited with a #region <>name/#endregion <name> comment line.
 * @returns a Map of an absolute file and the regions defined in that file name
 */
export declare function extractSharedComments(): ts.TransformerFactory<ts.SourceFile>;
export { sharedDocs };
