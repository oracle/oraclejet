import * as ts from "typescript";
import { BuildOptions } from "./compile";
export default function importTransformer(buildOptions: BuildOptions): (ctx: ts.TransformationContext) => ts.Transformer<ts.SourceFile>;
