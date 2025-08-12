import * as ts from 'typescript';
import * as MetadataTypes from 'ojs/ojmetadata';
import { type AllJsDocTypes } from './utils/ApiDocTypes';
import { ImportMaps } from './shared/ImportMaps';
import { JETComp } from './shared/JETComp';
import { SharedContentType } from './sharedCommentScanner';
import { ExportMaps } from './shared/ExportMaps';
type CompileOptions = {
    tsconfigJson: ts.TsConfigSourceFile;
    buildOptions?: BuildOptions;
};
export type ApiDocOptions = {
    apiDocDir?: string;
    debug?: boolean;
    followImports?: boolean;
    apiDocBuildEnabled?: boolean;
    sharedContent?: SharedContentType;
    componentToApiDoc?: Record<string, Array<AllJsDocTypes>>;
    programExportMaps?: ExportMaps;
};
export type CoreBuildOptions = {
    dtDir: string;
    isolationMode?: boolean;
    coreJetBuildOptions?: {
        defaultCompType?: MetadataTypes.ComponentMetadata['type'];
        exclude?: Array<string>;
        legacyWebElements?: Array<string>;
        enableLegacyElement?: number;
    };
    debug?: boolean;
    importMaps?: {
        exportToAlias?: Record<string, string>;
        aliasToExport?: Record<string, string>;
    };
    programImportMaps?: ImportMaps;
    componentToMetadata?: Record<string, MetadataTypes.ComponentMetadata>;
    templatePath?: string;
    reservedGlobalProps?: Set<string>;
    tsBuiltDir: string;
    typesDir?: string;
    parentDirToPackInfo?: Record<string, JETComp | null>;
    dependenciesMap?: Map<string, JETComp>;
    disabledExceptionKeys?: Array<string>;
    legacyWebElementSet?: Set<string>;
};
export type BuildOptions = ApiDocOptions & CoreBuildOptions;
export default function compile({ tsconfigJson, buildOptions }: CompileOptions): {
    errors: any[];
    parsedTsconfigJson: {
        compilerOptions: ts.CompilerOptions;
        files: string[];
    };
};
export {};
