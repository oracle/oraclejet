import * as ts from 'typescript';
import * as MetadataTypes from 'ojs/ojmetadata';
declare type CompileOptions = {
    tsconfigJson: ts.TsConfigSourceFile;
    buildOptions?: BuildOptions;
};
export declare type BuildOptions = {
    dtDir: string;
    apiDocDir?: string;
    isolationMode: boolean;
    coreJetBuildOptions?: {
        defaultCompType?: MetadataTypes.ComponentMetadata['type'];
        exclude?: Array<string>;
        enableLegacyElement?: number;
    };
    debug?: boolean;
    importMaps?: {
        exportToAlias?: Record<string, string>;
        aliasToExport?: Record<string, string>;
    };
    componentToMetadata?: Record<string, MetadataTypes.ComponentMetadata>;
    templatePath?: string;
    reservedGlobalProps?: Set<string>;
    tsBuiltDir: string;
    mainEntryFile: string;
    typesDir: string;
    translationBundleIds?: Array<string>;
};
export default function compile({ tsconfigJson, buildOptions }: CompileOptions): {
    errors: any[];
    parsedTsconfigJson: {
        compilerOptions: ts.CompilerOptions;
        files: string[];
    };
};
export {};
