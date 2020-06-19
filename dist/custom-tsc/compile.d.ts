import * as ts from 'typescript';
import * as MetadataTypes from 'ojs/ojmetadata';
declare type CompileOptions = {
    files: string[];
    compilerOptions?: ts.CompilerOptions;
    buildOptions?: BuildOptions;
};
export declare type BuildOptions = {
    dtDir: string;
    coreJetBuildOptions?: {
        exclude?: Array<string>;
    };
    debug?: boolean;
    importMaps?: {
        exportToAlias?: Record<string, string>;
        aliasToExport?: Record<string, string>;
        propsToModule?: Record<string, string>;
        moduleToProps?: Record<string, string[]>;
    };
    componentToMetadata?: Record<string, MetadataTypes.ComponentMetadata>;
    templatePath?: string;
    tsBuiltDir: string;
    mainEntryFile: string;
    typesDir: string;
};
export default function compile({ files, compilerOptions, buildOptions }: CompileOptions): {
    errors: any[];
};
export {};
