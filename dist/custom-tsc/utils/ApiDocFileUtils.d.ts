import * as MetaTypes from './MetadataTypes';
import { ApiDocOptions } from '../compile';
export declare function generateApiDocMetadata(metaUtilObj: MetaTypes.MetaUtilObj, options: ApiDocOptions): void;
/**
 * Updates the generated jsdoc metadata (if needed) with shared comment blocks and then writes out the final content into
 * <ComponentName>.json files
 * @param options An ApiDocOptions property bag containing settings about where to write out apidoc collateral.
 * @param sharedContentDir The absolute path of a directory where shared content was defined
 */
export declare function generateApiDoc(options: ApiDocOptions, sharedContentDir: string): void;
