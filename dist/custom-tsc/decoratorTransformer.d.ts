import * as ts from "typescript";
import { BuildOptions } from "./compile";
export default function decoratorTransformer(buildOptions: BuildOptions): (ctx: ts.TransformationContext) => ts.Transformer<ts.SourceFile>;
