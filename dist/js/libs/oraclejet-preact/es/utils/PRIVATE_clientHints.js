/* @oracle/oraclejet-preact: 13.0.0 */
var _a;
const defaultClientHints = {
    browser: 'unknown',
    browserMajorVersion: -1,
    deviceType: 'unknown',
    platform: 'unknown',
    hasTouchSupport: 'ontouchstart' in window,
    isHybrid: (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(hover: hover) and (any-pointer: coarse)').matches
};
let cachedClientHints;
function getClientHints(uaString) {
    // Compute if there is no cached result, OR if a userAgent string
    //  was passed in as an argument
    if (cachedClientHints === undefined || uaString) {
        let hints;
        const userAgentData = navigator['userAgentData'];
        if (userAgentData) {
            hints = getHintsFromUserAgentData(userAgentData);
        }
        else {
            hints = getHintsFromUserAgentString(uaString !== null && uaString !== void 0 ? uaString : navigator.userAgent);
        }
        // If no argument was passed in then this was computed from Navigator properties,
        // so cache the result.
        if (!uaString) {
            cachedClientHints = Object.assign({}, hints);
            Object.freeze(cachedClientHints);
        }
        // Otherwise, return the bespoke results without touching the cache
        else {
            return hints;
        }
    }
    return cachedClientHints;
}
function getHintsFromUserAgentData(userAgentData) {
    const hints = Object.assign({}, defaultClientHints);
    // Loop through brands => browser, browserMajorVersion
    for (let item of userAgentData.brands) {
        const brand = item.brand.toLowerCase();
        if (brand.indexOf('chrome') > -1) {
            hints.browser = 'chrome';
        }
        else if (brand.indexOf('edge') > -1) {
            hints.browser = 'edge';
        }
        if (hints.browser !== 'unknown') {
            hints.browserMajorVersion = Number(item.version);
            break;
        }
    }
    // Set deviceType, platform
    const platform = userAgentData.platform.toLowerCase();
    if (platform === 'windows') {
        hints.platform = 'windows';
    }
    else if (platform === 'android') {
        hints.platform = 'android';
        hints.deviceType = userAgentData.mobile ? 'phone' : 'tablet';
    }
    else if (platform === 'macos') {
        hints.platform = 'mac';
    }
    // TODO: Verify userAgentData support in Chrome 100 on iPhone/iPad when available
    /*
    else if (platform.indexOf('iphone') > -1) {
      hints.platform = 'ios';
      hints.deviceType = 'phone';
    } else if (platform.indexOf('ipad') > -1) {
      hints.platform = 'ios';
      hints.deviceType = 'tablet';
    } else if (platform.indexOf('ios') > -1) {
      hints.platform = 'ios';
      hints.deviceType = (userAgentData.mobile ? 'phone' : 'tablet');
    }
    */
    return hints;
}
function getHintsFromUserAgentString(userAgent) {
    const hints = Object.assign({}, defaultClientHints);
    // Normalize the userAgent string
    userAgent = userAgent.toLowerCase();
    // Check platform, deviceType
    if (userAgent.indexOf('iphone') > -1) {
        hints.platform = 'ios';
        hints.deviceType = 'phone';
    }
    else if (userAgent.indexOf('ipad') > -1 ||
        (navigator.platform === 'MacIntel' && navigator['standalone'])) {
        hints.platform = 'ios';
        hints.deviceType = 'tablet';
    }
    else if (userAgent.indexOf('mac') > -1) {
        hints.platform = 'mac';
    }
    else if (userAgent.indexOf('android') > -1) {
        hints.platform = 'android';
    }
    else if (userAgent.indexOf('win') > -1) {
        hints.platform = 'windows';
    }
    // Now work on browser, browserMajorVersion
    if (userAgent.indexOf('edg') > -1) {
        hints.browser = 'edge';
        hints.browserMajorVersion = parseMajorVersion(userAgent, /edg\/(\d+)/);
    }
    else if (userAgent.indexOf('chrome') > -1) {
        hints.browser = 'chrome';
        hints.browserMajorVersion = parseMajorVersion(userAgent, /chrome\/(\d+)/);
    }
    else if (userAgent.indexOf('crios') > -1) {
        hints.browser = 'chrome';
        hints.browserMajorVersion = parseMajorVersion(userAgent, /crios\/(\d+)/);
    }
    else if (userAgent.indexOf('fxios') > -1) {
        hints.browser = 'firefox';
        hints.browserMajorVersion = parseMajorVersion(userAgent, /fxios\/(\d+)/);
    }
    else if (userAgent.indexOf('firefox') > -1) {
        hints.browser = 'firefox';
        hints.browserMajorVersion = parseMajorVersion(userAgent, /rv:(\d+)/);
    }
    else if (userAgent.indexOf('safari') > -1) {
        hints.browser = 'safari';
        hints.browserMajorVersion = parseMajorVersion(userAgent, /version\/(\d+)/);
    }
    return hints;
}
function parseMajorVersion(userAgent, majorVersionPattern) {
    let majorVer;
    const matches = userAgent.match(majorVersionPattern);
    if (matches) {
        const majorVerString = matches[1];
        if (majorVerString) {
            majorVer = parseInt(majorVerString);
        }
    }
    return majorVer !== null && majorVer !== void 0 ? majorVer : -1;
}

export { getClientHints };
/*  */
//# sourceMappingURL=PRIVATE_clientHints.js.map
