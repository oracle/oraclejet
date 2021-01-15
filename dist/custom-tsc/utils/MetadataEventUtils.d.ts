import * as ts from "typescript";
import * as MetaTypes from "./MetadataTypes";
import * as Metadata from "ojs/ojmetadata";
export declare function generateEventsMetadata(memberKey: string, propDeclaration: ts.PropertyDeclaration, decorators: Record<string, ts.Decorator | Array<ts.Decorator>>, typeName: string, metaUtilObj: MetaTypes.MetaUtilObj): boolean;
export declare function getDtMetadataForEvent(propDeclaration: ts.PropertyDeclaration, metaUtilObj: MetaTypes.MetaUtilObj): Metadata.ComponentMetadataEvents;
