import * as MetaTypes from './MetadataTypes';
import * as JSDocTypes from './ApiDocTypes';
import { ApiDocOptions } from '../compile';
export declare function generateDoclets(metaUtilObj: MetaTypes.MetaUtilObj): Array<JSDocTypes.AllJsDocTypes>;
export declare function injectSharedContent(text: string, sharedDocs: Record<string, Record<string, string>>, apidocRoot: string): string;
export declare function isExportedType(doclet: JSDocTypes.JsDocTypeDefType, options: ApiDocOptions): boolean;
