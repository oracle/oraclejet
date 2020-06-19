import { BuildOptions } from "./compile";
export declare function getTypeGenerator(buildOptions: BuildOptions): (fileName: string, content: string) => void;
export declare function assembleTypes(buildOptions: BuildOptions): void;
