/**
 * This is a fork of the i18n Require.js plugin.
 * It makes minor chnages to the way the default locale is determined and to the way bundles are merged
 */
/**
 * @license RequireJS i18n 2.0.2 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/i18n for details
 */
/*jslint regexp: true */
/*jslint browser: true*/
/*global require: false, navigator: false, define: false */

/**
 * This plugin handles i18n! prefixed modules. It does the following:
 *
 * 1) A regular module can have a dependency on an i18n bundle, but the regular
 * module does not want to specify what locale to load. So it just specifies
 * the top-level bundle, like "i18n!nls/colors".
 *
 * This plugin will load the i18n bundle at nls/colors, see that it is a root/master
 * bundle since it does not have a locale in its name. It will then try to find
 * the best match locale available in that master bundle, then request all the
 * locale pieces for that best match locale. For instance, if the locale is "en-us",
 * then the plugin will ask for the "en-us", "en" and "root" bundles to be loaded
 * (but only if they are specified on the master bundle).
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/colors bundle to be that mixed in locale.
 *
 * 2) A regular module specifies a specific locale to load. For instance,
 * i18n!nls/fr-fr/colors. In this case, the plugin needs to load the master bundle
 * first, at nls/colors, then figure out what the best match locale is for fr-fr,
 * since maybe only fr or just root is defined for that locale. Once that best
 * fit is found, all of its locale pieces need to have their bundles loaded.
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/fr-fr/colors bundle to be that mixed in locale.
 */
(function () {
    'use strict';

    //regexp for reconstructing the master bundle name from parts of the regexp match
    //nlsRegExp.exec("foo/bar/baz/nls/en-ca/foo") gives:
    //["foo/bar/baz/nls/en-ca/foo", "foo/bar/baz/nls/", "/", "/", "en-ca", "foo"]
    //nlsRegExp.exec("foo/bar/baz/nls/foo") gives:
    //["foo/bar/baz/nls/foo", "foo/bar/baz/nls/", "/", "/", "foo", ""]
    //so, if match[5] is blank, it means this is the top bundle definition.
    var nlsRegExp = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;
    
    //Helper function to avoid repeating code. Lots of arguments in the
    //desire to stay functional and support RequireJS contexts without having
    //to know about the RequireJS contexts.
    function addPart(locale, master, needed, toLoad, prefix, suffix) {
        
        if (!master[locale]) {
            // Try the same language/region without script for zh
            // We are removing a Hans or Hant between the two dashes
            locale = locale.replace(/^zh-(Hans|Hant)-([^-]+)$/, "zh-$2");
        }
        
        if (master[locale]) {
            needed.push(locale);
            if (master[locale] === true || master[locale] === 1) {
                toLoad.push(prefix + locale + '/' + suffix);
            }
            return true;
        }
        return false;
    }

    
    function _isObject(val) {
        return (typeof val === 'object');
    }
    
    /**
     * Fixes up locale to comply with BCP47 spec and returns parts that shoudl be used for mathching the bundles 
     */
    function _getLocaleParts(locale) {
        var tokens = locale.toLowerCase().split(/-|_/), 
                parts = [tokens[0]], phase = 1, i; // script
        
        for(i=1; i < tokens.length; i++) {
          var t = tokens[i], len = t.length;
          
          if (len == 1) //extension
          {
            break;
          }
          
          switch(phase) {
            case 1:
              phase = 2;
              if (len == 4) {// this is a script tag
                // capitalize the first letter
                parts.push(t.charAt(0).toUpperCase() + t.slice(1));
                break;
              }
              // fall through to the next case
            case 2: //region
              phase = 3;
              parts.push(t.toUpperCase());
              break;
            default: //variant
              parts.push(t);
          }
        }
        
        _normalizeLocaleParts(parts);
        
        return parts;
    }
    
    /**
     * 'Normalizes' locale by inserting script tag according to the following rules:
     *  zh -> zh-Hans,
     *  zh-TW -> zh-Hant-TW,
     *  zh-MO -> zh-Hant-MO,
     *  zh-HK -> zh-Hant-HK,
     *  zh-XX (except above) -> zh-Hans-XX
     */
    function _normalizeLocaleParts(parts) {
        // do nothing if the language is not 'zh' or a script tag is already
        // present
        if (parts[0] != 'zh' || (parts.length > 1 && parts[1].length == 4)) {
            return;
        }
        
        var scriptTag = "Hans";
        
        var region = parts.length > 1 ? parts[1] : null;
        
        if (region === "TW" || region === "MO" || region === "HK") {
          scriptTag = "Hant";  
        }
        
        parts.splice(1, 0, scriptTag);
    }
    

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     * This is not robust in IE for transferring methods that match
     * Object.prototype names, but the uses of mixin here seem unlikely to
     * trigger a problem related to that.
     */
    function mixin(target, source) {
        var prop;
        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                if (target[prop] == null) {
                    target[prop] = source[prop];
                } 
                else if (_isObject(source[prop]) && _isObject(target[prop])) {
                    mixin(target[prop], source[prop]);
                }
            }
        }
    }

    
    define(['module'], function (module) {
        var masterConfig = module.config ? module.config() : {};

        return {
            version: '2.0.1+',
            /**
             * Called when a dependency needs to be loaded.
             * @private
             */
            load: function (name, req, onLoad, config) {
                config = config || {};

                if (config.locale) {
                    masterConfig.locale = config.locale;
                }

                var masterName,
                    match = nlsRegExp.exec(name),
                    prefix = match[1],
                    locale,
                    suffix = match[5],
                    parts,
                    toLoad = [],
                    value = {},
                    i, part, current = "", noOverlay, backup, extraBundle, ebPrefix, ebSuffix, merge, locales, roots;

                //If match[5] is blank, it means this is the top bundle definition,
                //so it does not have to be handled. Locale-specific requests
                //will have a match[4] value but no match[5]
                if (match[5]) {
                    //locale-specific bundle
                    prefix = match[1];
                    masterName = prefix + suffix;
                    locale = match[4];
                } else {
                    //Top-level bundle.
                    masterName = name;
                    suffix = match[4];
                    locale = masterConfig.locale;
                    
                    //  - check if the document object is available
                    // Note that the 'typeof' check  is required
                    if (typeof document !== 'undefined') {
                      if (!locale) {
                          locale = config.isBuild ? "root" : document.documentElement.lang;
                          if (!locale) {
                              locale = navigator === undefined ? "root" :
                              navigator.language || navigator.userLanguage || "root";
                          }
                      }
                      masterConfig.locale = locale;
                    }
                    else {
                      locale = "root";
                    }
                }
                
                parts = _getLocaleParts(locale);
                
                noOverlay = masterConfig['noOverlay'];
                backup = masterConfig['defaultNoOverlayLocale'];
                
                // Optional name of the bundle that should be merged with the requested bundle
                
                merge = masterConfig['merge'];
                if (merge) {
                  extraBundle = merge[prefix + suffix];
                  if (extraBundle) {
                    match = nlsRegExp.exec(extraBundle);
                    // assume top-level bundle for the merged extra bundle
                    ebPrefix = match[1];
                    ebSuffix = match[4];
                  }
                }
                
                locales = [];
                
                for (i = 0; i < parts.length; i++) {
                    part = parts[i];
                    current += (current ? "-" : "") + part;
                    locales.push(current);
                }

                if (config.isBuild) {
                    // Assume that  only the root bundle should be added at build time, as the user locale
                    // normally cannot be predicted
                    
                    toLoad.push(masterName);
                    
                    if (extraBundle) {
                        toLoad.push(extraBundle);
                    }

                    req(toLoad, function () {
                        onLoad();
                    });
                } else {
                
                    if (masterConfig['includeLocale'] == 'query') {
                      masterName = req.toUrl(masterName + '.js');
                      masterName += ((masterName.indexOf('?') === -1 ? '?' : '&') + 'loc=' + 
                                         locale);
                    }
                    
                    roots = [masterName];
                    if (extraBundle) {
                        roots.push(extraBundle);
                    }
                
                    //First, fetch the master bundle, it knows what locales are available.
                    req(roots, function (master, extra) {
                    
                        //Figure out the best fit
                        var needed = [],mainBundleCount,
                            part, matched = false, noMerge = noOverlay || (master['__noOverlay'] === true), backupBundle = backup || master['__defaultNoOverlayLocale'];
                        
                        for (i = locales.length-1; i >= 0 && !(matched && noMerge); i--) {
                            matched  = addPart(locales[i], master, needed, toLoad, prefix, suffix);
                        }
                        
                        if (noMerge && !matched && backupBundle) {
                            addPart(backupBundle, master, needed, toLoad, prefix, suffix);
                        }
                        
                        addPart("root", master, needed, toLoad, prefix, suffix);
                        
                        mainBundleCount = needed.length;
                        
                        if (extra) {
                            matched = false;
                            
                            noMerge = extra['__noOverlay'] === true;
                            backupBundle = extra['__defaultNoOverlayLocale'];
                            
                            for (i = locales.length-1; i >= 0 && !(matched && noMerge); i--) {
                                matched  = addPart(locales[i], extra, needed, toLoad, ebPrefix, ebSuffix);
                            }
                            
                            if (noMerge && !matched && backupBundle) {
                                addPart(backupBundle, extra, needed, toLoad, ebPrefix, ebSuffix);
                            }
                            
                            addPart("root", extra, needed, toLoad, ebPrefix, ebSuffix);
                        }

                        //Load all the parts missing.
                        req(toLoad, function () {
                            var i, partBundle, part;
                            
                            // Start with the 'extra', as it is supposed to be overriding tghehe entire main bundle
                            
                            
                            for (i = mainBundleCount; i < needed.length && needed[i]; i++) {
                                part = needed[i];
                                partBundle = extra[part];
                                if (partBundle === true || partBundle === 1) {
                                    partBundle = req(ebPrefix + part + '/' + ebSuffix);
                                }
                                mixin(value, partBundle);
                            }
                            
                            for (i = 0; i < mainBundleCount && needed[i]; i++) {
                                part = needed[i];
                                partBundle = master[part];
                                if (partBundle === true || partBundle === 1) {
                                    partBundle = req(prefix + part + '/' + suffix);
                                }
                                mixin(value, partBundle);
                            }
                            
                            // Stash away the locale on the bundle itself to make the framework aware of the locale used
                            // by Require.js
                            
                            value['_ojLocale_'] = parts.join("-");

                            //All done, notify the loader.
                            onLoad(value);
                        });
                    });
                }
            }
        };
    });
}());
