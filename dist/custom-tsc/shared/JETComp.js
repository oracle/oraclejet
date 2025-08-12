"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JETComp = exports.ContentItemType = void 0;
// enum of JET mono-pack contentItem types
var ContentItemType;
(function (ContentItemType) {
    ContentItemType["COMPONENT"] = "component";
    ContentItemType["RESOURCE"] = "resource";
    ContentItemType["VDOM"] = "vdom";
    ContentItemType["HOOK"] = "hook";
    ContentItemType["UTIL"] = "util";
    ContentItemType["VB_FRAGMENT"] = "vbcs-fragment";
    ContentItemType["VB_PATTERN"] = "vbcs-pattern";
})(ContentItemType || (exports.ContentItemType = ContentItemType = {}));
/**
 * Class presenting information derived from JET Component metadata JSON.
 * Useful for looking up information about standard JET Packs, JET mono-packs,
 * JET Reference Components, etc.
 *
 * NOTE:  'jetVersion' is a required metadata property for mono-packs,
 *        but optional for standard JET Packs
 */
class JETComp {
    constructor(packObj) {
        this._compObject = packObj;
    }
    _normalizeCompName(compName) {
        return compName.startsWith(this.name) ? compName.substring(this.name.length + 1) : compName;
    }
    // Determine whether we have a match on an item in a mono-pack 'contents' array,
    // given a target name and an optional target type:
    //    - names must match
    //    - if optional target type unspecified, return true
    //    - otherwise, either the item's type must match the target type OR
    //      the item's type is unspecified in which case the target type
    //      must be the default (i.e., COMPONENT)
    _isMatch(item, name, type) {
        return (item.name === name &&
            (!type || item.type === type || (!item.type && type === ContentItemType.COMPONENT)));
    }
    // Accessors
    get name() {
        return this._compObject['name'];
    }
    get version() {
        return this._compObject['version'];
    }
    get jetVersion() {
        return this._compObject['jetVersion'];
    }
    get license() {
        return this._compObject['license'];
    }
    get contents() {
        return this._compObject['contents'];
    }
    get dependencies() {
        return this._compObject['dependencies'];
    }
    get dependencyScope() {
        return this._compObject['dependencyScope'];
    }
    get translationBundle() {
        return this._compObject['translationBundle'];
    }
    // Utility methods
    isStandardPack() {
        return this._compObject['type'] === 'pack';
    }
    isMonoPack() {
        return this._compObject['type'] === 'mono-pack';
    }
    isReferenceComponent() {
        return this._compObject['type'] === 'reference';
    }
    isJETPack() {
        return this.isMonoPack() || this.isStandardPack();
    }
    // Given the fullName of a Component (e.g., "oj-c-avatar"),
    // determine if it is included in this JET Pack's content.
    isCompInPack(fullName, type) {
        let rtnFound = false;
        if (this.isMonoPack()) {
            // Mono-pack content is specfied in the "contents" metadata
            if (this.contents) {
                // For mono-packs, the name in the "contents" metadata consists of the Component name
                // (i.e., without the "<packName>-" prefix
                const compName = this._normalizeCompName(fullName);
                rtnFound = this.contents.findIndex((item) => this._isMatch(item, compName, type)) >= 0;
            }
        }
        else if (this.isStandardPack()) {
            // Standard pack content is specified in the "dependencies" metadata
            // NOTE: If the metadata consists of the DEPENDENCIES_TOKEN string, then that's
            // the signal for JET Tooling to construct the "dependencies" metadata at build time
            //  -- if that's the case, assume that this Component will be included in the Pack!
            if (this.dependencies === JETComp.DEPENDENCIES_TOKEN) {
                rtnFound = true;
            }
            else {
                for (const depName of Object.keys(this.dependencies)) {
                    if (depName === fullName) {
                        rtnFound = true;
                        break;
                    }
                }
            }
        }
        return rtnFound;
    }
    // Given the fullName of a Component (e.g., "oj-c-avatar"),
    // return the corresponding contentItem in this Mono-pack's
    // 'contents' array.
    // If not found (or if this JETComp is not a Mono-pack!),
    // then return undefined.
    findContentInPack(fullName, type) {
        let rtnItem;
        if (this.isMonoPack() && this.contents) {
            const compName = this._normalizeCompName(fullName);
            rtnItem = this.contents.find((item) => this._isMatch(item, compName, type));
        }
        return rtnItem;
    }
}
exports.JETComp = JETComp;
JETComp.DEPENDENCIES_TOKEN = '@dependencies@';
//# sourceMappingURL=JETComp.js.map