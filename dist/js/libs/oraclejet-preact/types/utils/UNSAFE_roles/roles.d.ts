/**
 * This file contains valid types and string literal arrays for aria roles
 * https://www.w3.org/WAI/PF/aria/roles#role_definitions_header
 */
export declare type Role = typeof roles[number];
export declare type CompositeWidgetRole = typeof compositeWidget[number];
export declare type ContentRole = typeof content[number];
export declare type LandmarkRole = typeof landmark[number];
export declare type LiveRegionRole = typeof liveRegion[number];
export declare type WidgetRole = typeof widget[number];
declare const widget: ("button" | "checkbox" | "radio" | "menuitem" | "progressbar" | "tab" | "tabpanel" | "tooltip" | "treeitem" | "scrollbar" | "link" | "dialog" | "option" | "switch" | "textbox" | "slider" | "menuitemcheckbox" | "menuitemradio" | "alertdialog" | "gridcell" | "spinbutton")[];
declare const button: ("checkbox" | "radio" | "menuitem" | "tab" | "link" | "switch" | "menuitemcheckbox" | "menuitemradio")[];
declare const compositeWidget: ("listbox" | "grid" | "menu" | "menubar" | "combobox" | "radiogroup" | "tablist" | "tree" | "treegrid")[];
declare const content: ("region" | "row" | "listitem" | "separator" | "toolbar" | "list" | "img" | "article" | "presentation" | "heading" | "group" | "columnheader" | "definition" | "directory" | "document" | "math" | "note" | "rowheader")[];
declare const liveRegion: ("marquee" | "log" | "alert" | "status" | "timer")[];
declare const landmark: ("form" | "search" | "main" | "banner" | "application" | "complementary" | "contentinfo" | "navigation")[];
declare const roles: readonly ("button" | "checkbox" | "listbox" | "radio" | "region" | "grid" | "row" | "menu" | "listitem" | "menubar" | "menuitem" | "progressbar" | "separator" | "tab" | "tabpanel" | "toolbar" | "tooltip" | "treeitem" | "scrollbar" | "form" | "list" | "img" | "link" | "search" | "article" | "dialog" | "main" | "marquee" | "option" | "switch" | "banner" | "presentation" | "heading" | "log" | "group" | "alert" | "status" | "textbox" | "slider" | "combobox" | "menuitemcheckbox" | "menuitemradio" | "radiogroup" | "tablist" | "tree" | "treegrid" | "columnheader" | "definition" | "directory" | "document" | "math" | "note" | "rowheader" | "application" | "complementary" | "contentinfo" | "navigation" | "timer" | "alertdialog" | "gridcell" | "spinbutton")[];
export { button, compositeWidget, content, landmark, liveRegion, widget };
