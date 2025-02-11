import * as ts from 'typescript';
import * as MetadataTypes from 'ojs/ojmetadata';
import * as MetaTypes from './utils/MetadataTypes';
type CompileOptions = {
    tsconfigJson: ts.TsConfigSourceFile;
    buildOptions?: BuildOptions;
};
export type BuildOptions = {
    dtDir: string;
    apiDocDir?: string;
    isolationMode?: boolean;
    apiDocBuildEnabled?: boolean;
    coreJetBuildOptions?: {
        defaultCompType?: MetadataTypes.ComponentMetadata['type'];
        exclude?: Array<string>;
        enableLegacyElement?: number;
    };
    debug?: boolean;
    followImports?: boolean;
    importMaps?: {
        exportToAlias?: Record<string, string>;
        aliasToExport?: Record<string, string>;
    };
    programImportMaps?: MetaTypes.VCompImportMaps;
    componentToMetadata?: Record<string, MetadataTypes.ComponentMetadata>;
    templatePath?: string;
    reservedGlobalProps?: Set<string>;
    tsBuiltDir: string;
    typesDir?: string;
    parentDirToPackInfo?: Record<string, MetaTypes.VCompPack | null>;
    dependencyPackMap?: Map<string, MetaTypes.VCompPack>;
    disabledExceptionKeys?: Array<string>;
};
export default function compile({ tsconfigJson, buildOptions }: CompileOptions): {
    errors: any[];
    parsedTsconfigJson: {
        compilerOptions: ts.CompilerOptions;
        files: string[];
    };
};
export {};
