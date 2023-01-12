/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base'], function (exports, oj) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    /**
     * Contains utility functions intended to be used to pick files
     * @ojmodulecontainer ojfilepickerutils
     * @ojtsmodule
     * @ojhidden
     * @since 10.0.0
     */
    /**
     * This method invokes the native file picking UI.  It invokes the specified callback with the result of the user's selection, if any.
     *
     * @ojexports
     * @memberof ojfilepickerutils
     * @param {Function} callback - Callback function invoked with the result of the user's selection, if any.
     * @param {Object} fileOptions - An object containing the file selection properties including accept, capture, and selection mode.
     * @ojsignature [{target: "Type", value: "FileOptions", jsdocOverride: true, for: "fileOptions"},
     *               {target: "Type", value: "(files:FileList) => void", jsdocOverride: true, for: "callback"}]
     * @method
     * @name pickFiles
     */

    /**
     * @ojexports
     * @typedef {Object} FileOptions
     * @memberof ojfilepickerutils
     * @property {Array.<string>} accept - An array of strings of allowed MIME types or file extensions that can be uploaded. If not specified, all file types will be accepted
     * @property {'user' | 'environment' | 'implementation' | 'none'} capture - Specifies the preferred facing mode for the device's media capture mechanism.  'user', 'environment', and 'implementation' indicates the user-facing, environment-facing, and the implementation-specific cameras will, respectively, be the preferred mode.  Specifying 'none', the default, will indicate that no capture mechanism is used.
     * @property {'single' | 'multiple'} selectionMode - Whether to allow single or multiple file selection.  Single is the default.
     */

    let input;
    const isIOS = oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS;
    const teardownInput = () => {
        if (isIOS)
            document.body.removeChild(input);
        input = null;
    };
    const setupInput = (fileOptions) => {
        if (input)
            teardownInput();
        input = document.createElement('input');
        input.type = 'file';
        if ((fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.capture) && fileOptions.capture != 'none') {
            input.capture = fileOptions.capture;
        }
        const acceptProp = fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.accept;
        const accept = acceptProp && acceptProp.length ? acceptProp.join(',') : null;
        input.accept = accept;
        input.multiple = (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.selectionMode) == 'multiple';
        input.style.display = 'none';
        if (isIOS)
            document.body.appendChild(input);
    };
    function pickFiles(callback, fileOptions) {
        setupInput(fileOptions);
        input.onchange = function () {
            callback(input.files);
            teardownInput();
        };
        input.click();
    }

    exports.pickFiles = pickFiles;

    Object.defineProperty(exports, '__esModule', { value: true });

});
