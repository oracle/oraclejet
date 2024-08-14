/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
 'use strict';

 var doop = require('jsdoc/util/doop');
 var env = require('jsdoc/env');
 var fs = require('jsdoc/fs');
 var nodefs = require('fs');
 var helper = require('jsdoc/util/templateHelper');
 var logger = require('jsdoc/util/logger');
 var path = require('jsdoc/path');
 var taffy = require('taffydb').taffy;
 var template = require('jsdoc/template');
 var util = require('util');
 var catharsis = require('catharsis');
 var styleutils = require('./utils/styleparserutil');

 var htmlsafe = helper.htmlsafe;
 var linkto = helper.linkto;
 var resolveAuthorLinks = helper.resolveAuthorLinks;
 var hasOwnProp = Object.prototype.hasOwnProperty;

 var dominterfaces = ["DocumentFragment", "Element", "Event", "EventTarget", "Node","CSSStyleDeclaration"];
 var dominterface_baseurl = "https://developer.mozilla.org/en-US/docs/Web/API";

 var data;
 var view;
 var searchMetadata = {};
 var all_typedefs;
 var all_linkableTypes;

 env.opts.destination = env.opts.query.destination || env.opts.destination;
 var outdir = path.normalize(env.opts.destination);
 const LOGGING_LEVELS = {
  INFO: logger.LEVELS.INFO,
  ERROR: logger.LEVELS.ERROR,
  WARNING: logger.LEVELS.WARN,
  DEBUG: logger.LEVELS.DEBUG
}

env.opts.loggingLevel = env.opts.query.loggingLevel || env.opts.loggingLevel;
logger.setLevel(LOGGING_LEVELS[env.opts.loggingLevel]);
logger.info(`Logger set to ${env.opts.loggingLevel}`);
 const GLOBAL_APIS = ["ajax", "sync", "version", "revision"];
 var ALL_VIOLATIONS = {
   MISSING_LINKS: {
     level: "warning",
     message: "%s has a type signature referencing %s %s without a link.",
     enabled: env.opts.violations['MISSING_LINKS']
   },
   TYPEDEF_IN_TYPE: {
     level: "error",
     message: "%s is using TypeDef %s in it's @type definition. This is currently prohibited, please consider using an @ojsignature tag to define complex types.",
     enabled: env.opts.violations['TYPEDEF_IN_TYPE']
   },
   INVALID_ATTRIBUTE_TYPE: {
     level: "error",
     message: "Invalid type for property \"%s\" in component %s. Please %s to fix this issue.",
     enabled: env.opts.violations['INVALID_ATTRIBUTE_TYPE']

   },
   MISSING_OJCOMPONENT_TYPE: {
     level: "error",
     message: "Missing type for property \"%s\" in component %s. Please use the @type tag to specify a type for this property",
     enabled: env.opts.violations['MISSING_OJCOMPONENT_TYPE']
   },
   INVALID_DEFAULT_VALUE: {
     level: "error",
     message: "Invalid default value for property \"%s\" in component %s. Default value for complex object is supported only at leaf levels.",
     enabled: env.opts.violations['INVALID_DEFAULT_VALUE']
   },
   MISSING_CLASS_TYPE: {
     level: "warning",
     message: "Missing type for property \"%s\" in class %s. Please use the @type tag to specify a type for this property",
     enabled: env.opts.violations['MISSING_CLASS_TYPE']
   },
   INVALID_GLOBAL_MEMBER: {
     level: "error",
     message: "Error: %s seems to be a private member and will be generated in the Global section of the API Doc Navigator. Consider using the @private and/or @ignore tags to fix this.",
     enabled: env.opts.violations['INVALID_GLOBAL_MEMBER']
   },
   BROKEN_ANCHOR_LINKS: {
     level: "error",
     message: "Error: Link %s in anchor tag is broken in generated file %s. Check if the target reference exists.",
     enabled: env.opts.violations['BROKEN_ANCHOR_LINKS']
   },
   BROKEN_LINK_LINKS: {
     level: "error",
     message: "Error: Link %s in inline {@link} tag is broken in generated file %s. Check if the target reference exists.",
     enabled: env.opts.violations['BROKEN_LINK_LINKS']
   }
 };
 // use the violation level set in the query param if exists
 env.opts.violationLevel = env.opts.query.violationLevel || env.opts.violationLevel;

 var COLLECTED_VIOLATIONS = {};
 var BUILD_STOP = false;
 const RTPATH = 'rt/src/main/javascript/oracle/oj';
 let moduleNav = {};

 const OVERVIEWS = 'Concepts';
 const ELEMENTS = 'Elements';
 const MODULES = 'Modules';
 const STYLING = 'Non Component Styling';
 const GLOBALS = 'Globals';
 const LINK_HREF_EXP = new RegExp(/\{@link\s+((?:.|\n)+?)\}/mig);
 const ANCHOR_HREF_EXP = new RegExp(/<a\s+href="([^"]*)"\s+data-jet="postproc">/mig);

 moduleNav[OVERVIEWS] = [];
 moduleNav[ELEMENTS] = [];
 moduleNav[MODULES] = {};
 moduleNav[STYLING] = [];
 moduleNav[GLOBALS] = [];


 function find(spec) {
   return helper.find(data, spec);
 }

 function tutoriallink(tutorial) {
   return helper.toTutorial(tutorial, null, { tag: 'em', classname: 'disabled', prefix: 'Tutorial: ' });
 }

 function getAncestorLinks(doclet) {
   return helper.getAncestorLinks(data, doclet);
 }

 function hashToLink(doclet, hash) {
   if (!/^(#.+)/.test(hash)) { return hash; }

   var url = helper.createLink(doclet);

   url = url.replace(/(#.+|$)/, hash);
   return '<a href="' + url + '">' + hash + '</a>';
 }

 function needsSignature(doclet) {
   var needsSig = false;

   // function and class definitions always get a signature
   if (doclet.kind === 'function' || doclet.kind === 'class') {
     needsSig = true;
   }
   // typedefs that contain functions get a signature, too
   else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names &&
     doclet.type.names.length) {
     for (var i = 0, l = doclet.type.names.length; i < l; i++) {
       if (doclet.type.names[i].toLowerCase() === 'function') {
         needsSig = true;
         break;
       }
     }
   }

   return needsSig;
 }

 function getSignatureAttributes(item) {
   var attributes = [];

   if (item.optional) {
     attributes.push('opt');
   }

   if (item.nullable === true) {
     attributes.push('nullable');
   }
   else if (item.nullable === false) {
     attributes.push('non-null');
   }

   return attributes;
 }

 function updateItemName(item) {
   var attributes = getSignatureAttributes(item);
   var itemName = item.name || '';

   if (item.variable) {
     itemName = '&hellip;' + itemName;
   }

   if (attributes && attributes.length) {
     itemName = util.format('%s<span class="signature-attributes">%s</span>', itemName,
       attributes.join(', '));
   }

   return itemName;
 }

 function addParamAttributes(params) {
   return params.filter(function (param) {
     return param.name && param.name.indexOf('.') === -1;
   }).map(updateItemName);
 }

 function buildItemTypeStrings(item) {
   var types = [];

   if (item && item.type && item.type.names) {
     //[csaba]:
     // unfortunately in jsdoc 3.4 if the type (or one of the types) was a function (specified with full param type signature and return type)
     // in the type.names array we will only find the type 'function', thus loosing the signature and return part of the function.
     // The solution is to take in that case the parsedType.typeExpression value (this will contain the type as it was specified
     // in the js src file).
     // In this case we will return only this value from this function and not build up an array of distinct types
     //item.type.names.forEach(function(name) { //changed to regular for loop so that we can break out
     var name;
     //tstype key was added by our own custom plugin ojeventHandles.js
     // if @ojsignature was specified with a jsdocOverride property set to true, then we will add the tstype key to the doclet
     //[csaba- bug27372375]:
     // need to pick up the setterType from an ojsignature targeting an accessor
     if (item.tstype && item.tstype.value &&
       (item.tstype.target.toLowerCase() === 'type' || item.tstype.target.toLowerCase() === 'accessor')) {

       // if starts with ? or !
       var dstType = item.tstype.target.toLowerCase() === 'type' ? item.tstype.value : item.tstype.value.SetterType;

       // check for optional character ('=')
       if (dstType.charCodeAt(dstType.length - 1) === 61) {
         dstType = dstType.substr(0, dstType.length - 1).trim();
         item['optional'] = true;
       }

       if (dstType.charCodeAt(0) === 63 || dstType.charCodeAt(0) === 33) {
         name = dstType.substr(1);
       }
       else {
         name = dstType;
       }

       if (dstType.charCodeAt(0) === 63) {
         item['nullable'] = true;
       }
       else if (dstType.charCodeAt(0) === 33) {
         item['nullable'] = false;
       }
       if (name && name.length) {
         types = tryToFindAllPossibleLinks(name, item);
       }
       else {
         types = allowNormalProcessing(item);
       }
     }
     else {
       types = allowNormalProcessing(item);
     }
   }

   return types;
 }

 function buildItemTypeStringsNew(item, signature) {
   var types = [];

   if (item && item.type && item.type.names) {
     //[csaba]:
     // unfortunately in jsdoc 3.4 if the type (or one of the types) was a function (specified with full param type signature and return type)
     // in the type.names array we will only find the type 'function', thus loosing the signature and return part of the function.
     // The solution is to take in that case the parsedType.typeExpression value (this will contain the type as it was specified
     // in the js src file).
     // In this case we will return only this value from this function and not build up an array of distinct types
     //item.type.names.forEach(function(name) { //changed to regular for loop so that we can break out
     var name;
     //tstype key was added by our own custom plugin ojeventHandles.js
     // if @ojsignature was specified with a jsdocOverride property set to true, then we will add the tstype key to the doclet
     //[csaba- bug27372375]:
     // need to pick up the setterType from an ojsignature targeting an accessor
     if (signature) {
       // if starts with ? or !
       var dstType = signature.target.toLowerCase() === 'type' ? signature.value : signature.value.SetterType;

       if (dstType.charCodeAt(0) === 63 || dstType.charCodeAt(0) === 33) {
         name = dstType.substr(1);
       }
       else {
         name = dstType;
       }

       if (dstType.charCodeAt(0) === 63) {
         item['nullable'] = true;
       }
       else if (dstType.charCodeAt(0) === 33) {
         item['nullable'] = false;
       }
       if (name && name.length) {
         types = tryToFindAllPossibleLinks(name, item);
       }
       else {
         types = allowNormalProcessing(item);
       }
     }
     else {
       types = allowNormalProcessing(item);
     }
   }

   return types;
 }

 function allowNormalProcessing(item) {
   var types = [];
   var name;
   for (var i = 0; i < item.type.names.length; i++) {
     name = item.type.names[i];
     // we check if we need to use the workaround explained above
     if (name === 'function') {
       if (item.type.parsedType && item.type.parsedType.typeExpression) {
         types = [linkto(item.type.parsedType.typeExpression, htmlsafe(item.type.parsedType.typeExpression))];
         break;
       }
     }
     else {
       types.push(linkto(name, htmlsafe(name)));
     }
   };
   return types;
 }
 /**
  * Loops through the ojvalues of a given member doclet and builds up an Array of value names that is ready for the browser.
  * If a value is deprecated, the value will be wrapped in a span tag with properly set class attribute.
  * @param {object} doclet
  */
 function getTypeForEnums(doclet) {
   let types = [];
   let className = 'deprecated-hidden-only';
   if (doclet.ojvalues) {
     let origType = doclet.ojvalues[0].type.names[0];
     let optional = false;

     for (var i = 0; i < doclet.ojvalues.length; i++) {
       let value = doclet.ojvalues[i];
       let name = value.name;
       if (origType === 'string') {
         name = `"${name}"`;
       }

       if (!optional && value.optional) optional = true;
       let resolvedName = linkto(name, htmlsafe(name));
       if (value.tsdeprecated) {
         resolvedName = `<span class="${className}">${resolvedName}</span>`;
       }
       types.push(resolvedName);
     };
     if (optional) {
       if (origType === 'number') {
         types.push('number');
       }
       else {
         types.push('string');
       }
     }
   }
   return types;
 }

 function allowNormalProcessingNew(item, deprecatedOnes, deprecationInfos, type) {
   var types = [];
   var name;

   //class for span if required.
   var className = null //ts deprecated default class;
   if (type == "js") {
     className = "jsdeprecated-hidden-only";
   }
   else if (type == 'ts') {
     className = 'deprecated-hidden-only';
   }

   if (item.ojvalues) {
     let optional = false;
     let origType = item.ojvalues[0].type.names[0];
     for (var i = 0; i < item.ojvalues.length; i++) {
       let value = item.ojvalues[i];
       let name = value.name;
       if (origType === 'string') {
         name = `"${name}"`;
       }

       if (!optional && value.optional) optional = true;

       if (item.ojvalues[i].tsdeprecated || (deprecatedOnes && deprecatedOnes.indexOf(name) > -1)) {
         continue;
       }
       // we check if we need to use the workaround explained above
       if (name === 'function') {
         if (item.type.parsedType && item.type.parsedType.typeExpression) {
           types = [linkto(item.type.parsedType.typeExpression, htmlsafe(item.type.parsedType.typeExpression))];
           break;
         }
       }
       else {
         let resolvedName = linkto(name, htmlsafe(name));
         types.push(spanifyTypeWithClass(name, resolvedName, className, deprecationInfos));
       }
     };
     if (optional) {
       if (origType === 'number') {
         types.push('number');
       }
       else {
         types.push('string');
       }
     }
   }
   else {
     for (var i = 0; i < item.type.names.length; i++) {
       name = item.type.names[i];
       if (deprecatedOnes && deprecatedOnes.indexOf(name) > -1) {
         continue;
       }
       // we check if we need to use the workaround explained above
       if (name === 'function') {
         if (item.type.parsedType && item.type.parsedType.typeExpression) {
           types = [linkto(item.type.parsedType.typeExpression, htmlsafe(item.type.parsedType.typeExpression))];
           break;
         }
       }
       else {
         let resolvedName = linkto(name, htmlsafe(name));
         resolvedType = fixArrayWithDotSyntax(resolvedName);
         types.push(spanifyTypeWithClass(name, resolvedType, className, deprecationInfos));
       }
     };
   }

   return types;
 }

 function fixArrayWithDotSyntax(type){
   let fixedType = type;
   let regex = new RegExp('Array\.(?<charat>&lt;|<)', 'g');
   if (regex.test(type)){
     fixedType = type.replace(regex, `Array$1`);
   }
   return fixedType;
 }

 function spanifyTypeWithClass(name, resolvedName, className, deprecations) {
   if (!deprecations || !className) {
     return resolvedName;
   }

   var isDep = false;
   if (name.startsWith('"') && name.endsWith('"')) {
     name = name.substring(1, name.length - 1);
   }
   for (var i = 0; i < deprecations.length; i++) {
     if (deprecations[i].value.indexOf(name) > -1) {
       isDep = true;
       break;
     }
   }
   if (isDep) {
     resolvedName = '<span class="' + className + '">' + resolvedName + "</span>";
   }
   return resolvedName;
 }


 function buildAccessorTypeStrings(item, setter) {
   var types = [];

   if (item && item.type && item.type.names) {
     //[csaba]:
     // unfortunately in jsdoc 3.4 if the type (or one of the types) was a function (specified with full param type signature and return type)
     // in the type.names array we will only find the type 'function', thus loosing the signature and return part of the function.
     // The solution is to take in that case the parsedType.typeExpression value (this will contain the type as it was specified
     // in the js src file).
     // In this case we will return only this value from this function and not build up an array of distinct types
     //item.type.names.forEach(function(name) { //changed to regular for loop so that we can break out
     var name;
     //tstype key was added by our own custom plugin ojeventHandles.js
     // if @ojsignature was specified with a jsdocOverride property set to true, then we will add the tstype key to the doclet
     //[csaba- bug27372375]:
     // need to pick up the setterType from an ojsignature targeting an accessor
     if (item.tstype && Array.isArray(item.tstype)) {
       var all = item.tstype;
       all.forEach(signature => {
         if (signature.value && signature.target.toLowerCase() === 'accessor') {
           // if starts with ? or !
           var dstType = setter ? signature.value.SetterType : signature.value.GetterType;

           if (dstType.charCodeAt(0) === 63 || dstType.charCodeAt(0) === 33) {
             name = dstType.substr(1);
           }
           else {
             name = dstType;
           }

           types = tryToFindAllPossibleLinks(name, item);
         }
       });
     }
     else if (item.tstype && item.tstype.value && item.tstype.target.toLowerCase() === 'accessor') {
       // if starts with ? or !
       var dstType = setter ? item.tstype.value.SetterType : item.tstype.value.GetterType;

       if (dstType.charCodeAt(0) === 63 || dstType.charCodeAt(0) === 33) {
         name = dstType.substr(1);
       }
       else {
         name = dstType;
       }

       types = tryToFindAllPossibleLinks(name, item);
     }
   }

   return types;
 }

 function buildClassSignature(item) {
   var types = [];

   if (item.tstype && item.tstype.value) {
     //we have a valid ojsignature for this class.
     var dstType = item.tstype.value;
     var name;
     if (dstType.charCodeAt(0) === 63 || dstType.charCodeAt(0) === 33) {
       name = dstType.substr(1);
     }
     else {
       name = dstType;
     }
     // for custom elements swap 'class' in the signature to 'interface'
     if (item.ojcomponent) {
       if (name.startsWith('class')) {
         name = name.replace('class', 'interface');
       }
     }
     name = cleanUpClassSignatureFromAbstractSuperClasses(name);
     if (item.ojcomponent && item.domInterface) {
       // make sure we are not capturing everything in the word boundary, dots are not considered as wb here
      name = name.replace(new RegExp("\\b(?<!\\.)" + item.name + "\\b(?!\\.)", "g"), item.domInterface);
     }
     types = tryToFindAllPossibleLinks(name, item);
   }
   return types;
 }

 function cleanUpClassSignatureFromAbstractSuperClasses(name) {
   // we need to do the following clean up here:
   //  - if the super class is abstract, we should break the hierarchy, we should not return the signature with the abstract parent
   // how do we get the super class name??
   //  - look for the last extends, the first word after it could be the superclass
   //  - count the number of closing and opening angle brackets:
   //      - if they match we do have the parent class
   //      - in a case like, class ABC<I extends B> we should not mistake B for superclass

   let lastIndex = name.lastIndexOf(' extends ');
   if (lastIndex < 0) {
     return name;
   }

   let firstPart = name.substring(0, lastIndex).trim();
   let lastPart = name.substring(lastIndex + 1);
   // check for matching brackets in the last part
   let brOpenCount = (lastPart.match(/</g)||[]).length;
   let brCloseCount = (lastPart.match(/>/g)||[]).length;

   if (brOpenCount == brCloseCount){
     // we have found the parent component extends part
     lastPart = lastPart.trim();

     if (brOpenCount == 0){
       lastPart = lastPart.substring(8); //remove extends
     }
     else {
       lastPart = lastPart.substring(8, lastPart.indexOf("<")); //remove extends
     }
     //get the class
     let classDoc = find([{ kind: ["namespace", "class", "interface"], id: lastPart }]);
     if (classDoc && classDoc.length && classDoc[0].virtual) {
       return firstPart;
     }
     //below are some of the clas relations we build so that typescript definitions are not broken
     //we dont need to expose these in the APIs.
     else if (lastPart == 'JetElement' || lastPart == 'ojInputDate' || lastPart == 'ojInputDateTime' || lastPart == 'EventTarget' || lastPart == 'HTMLElement') {
       return firstPart;
     }
     else {
       return name;
     }
   }
   else {
     return name;
   }
 }

 function buildClassSignature2(item, signature) {
   var types = [];

   if (signature && signature.value) {
     //we have a valid ojsignature for this class.
     var dstType = signature.value;
     var name;
     if (dstType.charCodeAt(0) === 63 || dstType.charCodeAt(0) === 33) {
       name = dstType.substr(1);
     }
     else {
       name = dstType;
     }
     types = tryToFindAllPossibleLinks(name, item);
   }
   return types;
 }

 function buildTDGenericSignature(item) {
   var types = [];

   if (item.tsgenerictype && item.tsgenerictype.value) {
     //we have a valid ojsignature for this class.
     var dstType = item.tsgenerictype.value;
     var name;
     if (dstType.charCodeAt(0) === 63 || dstType.charCodeAt(0) === 33) {
       name = dstType.substr(1);
     }
     else {
       name = dstType;
     }
     types = tryToFindAllPossibleLinks(name, item);
   }
   return types;
 }
 // Give it a try and see if the type can be parsed by catharsis.
 // we are using this method in the case where we need to apply an ojsignature type over
 // the jsdoc @type. In many instances those types cannot be parsed by catharsis so links
 // cannot be generated for type elements
 function tryTypeParsing(name) {
   var parseSuccess = true;
   try {
     catharsis.parse(name, { jsdoc: true });
   }
   catch (e) {
     parseSuccess = false;
   }

   return parseSuccess;
 }

 function tryToFindAllPossibleLinks(name, doc) {
   var parseSuccess = tryTypeParsing(name);
   //Parse succeeds for something like FilterOperator<D>
   //But it wont generate any link. Because linkto('FilterOperator<D>', htmlsafe('FilterOperator<D>'))
   //wont link to the type. The first parameter will need to be qualified name like
   //linkto('oj.FilterOperator', htmlsafe('FilterOperator<D>'))

   //To handle this, we would need to do this.
   //0. Create link to and check if there is no link created.
   //1. Get the name of the type stripping off any generic parameters.
   //2. See if that is an actual JET type by searching through all our types.
   //   We need to do this so as to avoid unnecessary overhead for basic types.
   //3. Once we identify it as a JET type run it through other loop and it will take care of it.

   var linked;
   if (parseSuccess) {
     linked = linkto(name, htmlsafe(name));
     if (linked.indexOf('<a href=') < 0) {
       // no link created. We need to see if we have any possible types inside
       // No link is created could be of 2 reasons. 1 -> it is a primitive type
       // or we are dealing with a type like myType<K,D> or Array<myType> or myType= and things like that
       // we need to run the second case through our advanced algorithm to find all links.
       // we don't need the other one to go through it as it might just be a performance issue.

       if (name.indexOf('<') > -1 || name.indexOf('=') > -1 || name.indexOf('.') > -1) {
         // TODO -> optimize this somehow to exclude string= or Array<String>
         parseSuccess = false;
       }
       /*var typeName = name;
       if(name.indexOf('<')> -1){
         typeName = name.substring(0,name.indexOf('<'));
       }
       if(typeName.indexOf('=')> -1){
         typeName = name.substring(0,name.indexOf('='));
       }
       //found the typename
       var jetType = find ({ kind: ["typedef", "namespace", "class", "interface"], name: typeName});
       if(jetType && jetType.length){
         //it is a JET type. Run through below logic
         parseSuccess = false;
       }
       if(parseSuccess){
         jetType = find ({ kind: ["typedef", "namespace", "class", "interface"], longname: typeName});
         if(jetType && jetType.length){
           //it is a JET type. Run through below logic
           parseSuccess = false;
         }
       }*/
     }
   }

   var types = [];
   if (parseSuccess) {
     //case 1:- This is a straight forward type and we are done
     types = [linked];
   }
   else {
     //we need to parse the string. The string my contain reference to other classes/interfaces/typedefs.
     //we try to find all those, and then convert those into links.

     var tdused = [];
     var tdlongName = [];
     for (var i = 0; i < all_linkableTypes.length; i++) {
       let td = all_linkableTypes[i];

       //to match AnimationUtil.AnimationMethods with oj.AnimationUtil.AnimationMethods
       var trimmedLongName = td.longname;
       if (trimmedLongName.startsWith('oj.')) {
         trimmedLongName = trimmedLongName.substring(3);
         //logger.info(trimmedLongName);
       }
       else {
         trimmedLongName = null;
       }

       if (td.name === 'Object') {
         //dont link general object to obsolete oj.Object
         continue;
       }
       //lets probe if we find something that's worth trying
       if (name.indexOf(td.longname) >= 0 && isPossibleTypeReference(name, td.longname)) { //first we check for qualified name
         let regex = new RegExp("\\b" + td.longname + "(?!\\.)\\b");
         if (regex.test(name) && tdused.indexOf(td.longname) == -1) {
           tdused.push(td.longname);
           tdlongName.push(td.longname);
         }
       }
       else if (trimmedLongName && name.indexOf(trimmedLongName) >= 0 && isPossibleTypeReference(name, trimmedLongName)) { //first we check for qualified name
         let regex = new RegExp("\\b" + trimmedLongName + "(?!\\.)\\b");
         if (regex.test(name) && tdused.indexOf(trimmedLongName) == -1) {
           tdused.push(trimmedLongName);
           tdlongName.push(td.longname);
         }
       }
       else if (name.indexOf(td.name) >= 0 && isPossibleTypeReference(name, td.name) && doc.memberof === td.memberof) { //now we check for unqualified name in the same namespace
         let regex = new RegExp("\\b" + td.name + "(?!\\.)\\b");
         if (regex.test(name) && tdused.indexOf(td.name) == -1) {
           tdused.push(td.name);
           tdlongName.push(td.longname);
         }
       }
       //this is when oj.ArrayDataprovider is referring some thing from oj with only the name and not long name
       else if (name.indexOf(td.name) >= 0 && isPossibleTypeReference(name, td.name)) {
        if (doc.memberof && doc.memberof.startsWith(td.memberof + '.')) {
           let regex = new RegExp("\\b" + td.name + "(?!\\.)\\b");
           if (regex.test(name) && tdused.indexOf(td.name) == -1) {
             //logger.info(name);
             tdused.push(td.name);
             tdlongName.push(td.longname);
           }
        }
        else if(td.memberof.startsWith(doc.memberof + '.')){
          let regex = new RegExp("\\b" + td.name + "(?!\\.)\\b");
          if (regex.test(name) && tdused.indexOf(td.name) == -1) {
             logger.info(`Discovered that ${doc.name}: ${name} has a linkable type ${td.name}`);
             tdused.push(td.name);
             tdlongName.push(td.longname);
          }
        }
       }
     }
     //we found a type that's being used by the type of this member doclet
     //try and see of type parsing can actually deal with it
     if (tdused.length) {
       //let atleastOne = false;
       name = htmlsafe(name);
       for (var j = 0; j < tdused.length; j++) {
         parseSuccess = tryTypeParsing(tdlongName[j]);
         if (parseSuccess) {
           //atleastOne = true;
           // create a link for the TypeDef
           //link text should not have oj.
           var linkText = tdlongName[j];
           if (linkText.startsWith('oj.')) {
             linkText = linkText.substring(3);
             //logger.info(trimmedLongName);
           }

           let tdlink = linkto(tdlongName[j], htmlsafe(linkText));
           //now replace the TypeDef in the original signature with the link
           name = name.replace(new RegExp("\\b" + tdused[j] + "\\b"), tdlink);
         }
       }
       //if(!atleastOne){
       //  types = [htmlsafe(name)];
       //}
       //else{
       types = [name];
       //}

     }
     else {
       types = [htmlsafe(name)];
     }
   }
   // [csaba]: Bug 30109026
   // as a last step, search and replace DOM Interface references with a link to it
   dominterfaces.forEach(domintfc => {
     // find the interface: should not be preceeded by >.# or alphanumerical literal and should not be followed by #.<
     let regexp = new RegExp(`(?<!\\w|[#,>,.])${domintfc}(?!\\w|[#,<,.]<)`, 'g');
     if (regexp.test(types[0])) {
       let interfaceLink = `<a href="${dominterface_baseurl}/${domintfc}">${domintfc}</a>`;
       types[0] = types[0].replace(regexp, interfaceLink);
     }
   })
   // [csaba]: Bug 27832562
   // as a last step, search and replace the type 'any' with a link to the generic section in
   // our API Doc: https://www.oracle.com/pls/topic/lookup?ctx=jetlatest&id=customelementoverview#ce-attrs-any-section
   let regexp = new RegExp('(?<![\\w])any(?![\\w])', 'g');
   if (regexp.test(types[0])) {
     let anyLink = `<a href="https://www.oracle.com/pls/topic/lookup?ctx=jetlatest&id=customelementoverview#ce-attrs-any-section">any</a>`;
     types[0] = types[0].replace(regexp, anyLink);
   }

   return types;
 }

 function isPossibleTypeReference(full, matched, startIndex) {

   if (startIndex == undefined) {
     startIndex = 0;
   }
   if (startIndex >= full.length) {
     return false;
   }
   var index = full.indexOf(matched, startIndex);
   if (index < 0) {
     return false;
   }
   var prev = index - 1;
   var charCodePrev = full.charCodeAt(prev);
   var next = index + matched.length;
   var charCodeNext = full.charCodeAt(next);
   //We only know that name contains this td. But we should not match RenderContext with Context
   //nor should we match oj.Chart.Item with oj.Item

   //This should not be . -> we have a more qualified one to look for
   //This shouldnot be AlphaNumeric either, we have a more proper name.
   var prevResult = false;
   if (!(charCodePrev > 47 && charCodePrev < 58) && // numeric (0-9)
     !(charCodePrev > 64 && charCodePrev < 91) && // upper alpha (A-Z)
     !(charCodePrev > 96 && charCodePrev < 123) && // lower alpha (a-z)
     charCodePrev !== 46) {
     prevResult = true;
   }
   var nextResult = false;
   if (!(charCodeNext > 47 && charCodeNext < 58) && // numeric (0-9)
     !(charCodeNext > 64 && charCodeNext < 91) && // upper alpha (A-Z)
     !(charCodeNext > 96 && charCodeNext < 123) && // lower alpha (a-z)
     charCodeNext !== 46) {
     nextResult = true;
   }
   if (nextResult && prevResult) {
     return true;
   }
   else {
     return isPossibleTypeReference(full, matched, index + 1);
   }
 }

 function buildAttribsString(attribs) {
   var attribsString = '';

   if (attribs && attribs.length) {
     attribsString = htmlsafe(util.format('(%s) ', attribs.join(', ')));
   }

   return attribsString;
 }

 function addNonParamAttributes(items) {
   var types = [];

   items.forEach(function (item) {
     types = types.concat(buildItemTypeStrings(item));
   });

   return types;
 }
 /*
 [csaba]: this is the original but it does not apply the optional class

 function addSignatureParams(f) {
     var params = f.params ? addParamAttributes(f.params) : [];

     f.signature = util.format( '%s(%s)', (f.signature || ''), params.join(', ') );
 }
 */
 // this was copied over from jsdoc 3.2
 function addSignatureParams(f) {
   var params = helper.getSignatureParams(f, 'optional');

   if (params && params.length) {
     //there are parameters. We need to figure out the ones which were deprecated.
     let paramDoclets = f.params;
     let jsonlyDeprecations = [];
     let tsDeprecation = [];
     paramDoclets.forEach(function (param) {
       //check if there is a deprecation.
       let deprecatedClass = getDeprecatedClass(param);
       if (!deprecatedClass) {
         //there is no deprecation for this one.
       }
       else if (deprecatedClass == 'deprecated-hidden') {
         //ts only deprecation
         tsDeprecation.push(param.name);
       }
       else if (deprecatedClass == 'jsdeprecated-hidden') {
         //js only
         jsonlyDeprecations.push(param.name);
       }
     });
     let cleanParams = params;
     if (jsonlyDeprecations.length) {
       //js signature contain everything
       f.jssignature = (f.jssignature || '') + '(' + params.join(', ') + ')';

       cleanParams = cleanParams.filter((item) => {
         if (jsonlyDeprecations.indexOf(item) > -1) {
           return false;
         }
         return true;
       });
     }
     if (tsDeprecation.length) {
       if (jsonlyDeprecations.length) { //if there are some jsdeprecations, filter them out
         let jsDepParams = params.filter((item) => {
           if (jsonlyDeprecations.indexOf(item) > -1) {
             return false;
           }
           return true;
         });
         f.tsdepsignature = (f.tsdepsignature || '') + '(' + jsDepParams.join(', ') + ')';
       }
       else {
         f.tsdepsignature = (f.tsdepsignature || '') + '(' + params.join(', ') + ')';
       }
       cleanParams = cleanParams.filter((item) => {
         if (tsDeprecation.indexOf(item) > -1) {
           return false;
         }
         return true;
       });

     }

     //signature with only the greatest and latest.
     f.signature = (f.signature || '') + '(' + cleanParams.join(', ') + ')';
   }
   else {
     // If a decorator doesn't have any parameters, it can be used
     // as a tag instead of a method call, e.g. @method instead of @method()
     f.signature = (f.signature || '') + f.ojdecorator ? '' : '()';
   }
 }

 function augmentInheritedTypes(doclet) {
   if (doclet.inherited) {
     var parent = doclet.inherits;

     if (doclet.params && doclet.params.length) {
       processPropertiesOrParams(doclet.params, parent, true);
     }
     if (doclet.properties && doclet.properties.length) {
       processPropertiesOrParams(doclet.properties, parent, false);
     }
   }
 }

 function processPropertiesOrParams(arr, parent, isParams) {
   var type;
   var result = find({ longname: parent });
   if (result && result.length) {
     var parentDoclet = result[0];
     for (var i = 0; i < arr.length; i++) {
       type = arr[i].type;
       if (type && !type.parsedType && type.names && type.names.length) {
         for (var j = 0; j < type.names.length; j++) {
           if (type.names[j] === 'function') {
             //logger.info('function type in inherited doclet: ', parent);
             var parsedType;
             if (isParams && parentDoclet.params && parentDoclet.params.length) {
               var param = parentDoclet.params[i];
               if (param.type.parsedType) {
                 parsedType = param.type.parsedType;
               }
             }
             else if (!isParams && parentDoclet.properties && parentDoclet.properties.length) {
               var property = parentDoclet.properties[i];
               if (property.type.parsedType) {
                 parsedType = property.type.parsedType;
               }
             }

             if (parsedType) {
               //logger.info('   typeExpression: ', parsedType.typeExpression);
               Object.defineProperty(type, 'parsedType', {
                 value: parsedType,
                 writable: true,
                 enumerable: true,
                 configurable: true
               });
               break;
             }
           }
         }
       }
     }
   }
 }

 function getParsedType(docletId, paramIdx, isParameter) {
   var retVal;
   var result = find({ longname: docletId });
   if (result && result.length) {
     var doclet = result[0];
     if (doclet.params && doclet.params.length) {
       var param = doclet.params[paramIdx];
       if (param.type.parsedType) {
         retVal = param.type.parsedType;
       }
     }
   }

   return retVal;
 }

 function addSignatureReturns(f) {
   var attribs = [];
   var attribsString = '';
   var returnTypes = [];
   var returnTypesString = '';

   // jam all the return-type attributes into an array. this could create odd results (for example,
   // if there are both nullable and non-nullable return types), but let's assume that most people
   // who use multiple @return tags aren't using Closure Compiler type annotations, and vice-versa.
   if (f.returns) {
     f.returns.forEach(function (item) {
       helper.getAttribs(item).forEach(function (attrib) {
         if (attribs.indexOf(attrib) === -1) {
           attribs.push(attrib);
         }
       });
     });

     attribsString = buildAttribsString(attribs);
   }

   if (f.returns) {
     returnTypes = addNonParamAttributes(f.returns);
   }
   if (returnTypes.length) {
     returnTypesString = util.format(' : %s{%s}', attribsString, returnTypes.join('|'));
   }
   // [csaba]: Bug 27832562
   // search and replace the type 'any' with a link to the generic section in
   // our API Doc: https://www.oracle.com/pls/topic/lookup?ctx=jetlatest&id=customelementoverview#ce-attrs-any-section
   // if we had an ojsignature, type any was already processed
   if (returnTypesString.indexOf('CustomElementOverview') < 0) {
     let regexp = new RegExp('(?<![\\w])any(?![\\w])', 'g');
     if (regexp.test(returnTypesString)) {
       let anyLink = `<a href="https://www.oracle.com/pls/topic/lookup?ctx=jetlatest&id=customelementoverview#ce-attrs-any-section">any</a>`;
       returnTypesString = returnTypesString.replace(regexp, anyLink);
     }
   }

   f.signature = '<span class="signature">' + (f.signature || '') + '</span>' +
     '<span class="type-signature">' + returnTypesString + '</span>';

   if (f.jssignature) {
     '<span class="signature">' + (f.jssignature || '') + '</span>' +
       '<span class="type-signature">' + returnTypesString + '</span>';
   }
   if (f.tsdepsignature) {
     '<span class="signature">' + (f.tsdepsignature || '') + '</span>' +
       '<span class="type-signature">' + returnTypesString + '</span>';
   }
 }

 function addSignatureTypes(f) {

   var isValidSignaturefound = false;
   var types;
   //if ojsignature exists, use that
   if (f.tstype) {
     let signatures = f.tstype;
     signatures.forEach(function (signature) {
       if (signature.target.toLowerCase() === 'accessor' || signature.target.toLowerCase() === 'type') {
         isValidSignaturefound = true;
         types = f.type ? buildItemTypeStringsNew(f, signature) : [];
         if (signature.consumedBy == 'ts' || !signature.consumedBy) {
           f.signature = (f.signature || '') + '<span class="type-signature">' +
             (types.length ? ' :' + types.join('|') : '') + '</span>';
         }
         else if (signature.consumedBy == 'tsdep') {
           f.tsdepsignature = (f.tsdepsignature || '') + '<span class="type-signature">' +
             (types.length ? ' :' + types.join('|') : '') + '</span>';
         }
         else if (signature.consumedBy == 'js') {
           f.jssignature = (f.jssignature || '') + '<span class="type-signature">' +
             (types.length ? ' :' + types.join('|') : '') + '</span>';
         }
       }
     });
   }
   if (!isValidSignaturefound) { //only if ojsignature was not found
     //we need to check if there is any deprecations and generate different outputs.
     var memberTypeDeprecations;
     if (f.tsdeprecated) {
       let deprecations = f.tsdeprecated;
       memberTypeDeprecations = deprecations.filter(function (deprecation) {
         if (deprecation.target === 'memberType') {
           return true;
         }
         return false;
       })
     }
     if (memberTypeDeprecations && memberTypeDeprecations.length) {
       var jsOnlyDeprecations = [];
       var tsDeprecations = [];
       var since;
       var removeBasedonSince;

       memberTypeDeprecations.forEach(function (deprecation) {
         since = deprecation.since;
         removeBasedonSince = !since || convertSemverToInt32(since) <= convertSemverToInt32('6.0.0');
         let value = deprecation.value;
         if (!Array.isArray(value)) {
           value = [value];
         }
         if (removeBasedonSince) {
           Array.prototype.push.apply(jsOnlyDeprecations, value);
         }
         else {
           Array.prototype.push.apply(tsDeprecations, value);
         }
       });

       if (jsOnlyDeprecations.length) {
         types = f.type ? allowNormalProcessingNew(f, null, memberTypeDeprecations, 'js') : []; //all of these for jsdoc
         f.jssignature = (f.jssignature || '') + '<span class="type-signature">' +
           (types.length ? ' :' + types.join('|') : '') + '</span>';
       }
       if (tsDeprecations.length) {
         types = f.type ? allowNormalProcessingNew(f, jsOnlyDeprecations, memberTypeDeprecations, 'ts') : []; //exclude jsonly
         f.tsdepsignature = (f.tsdepsignature || '') + '<span class="type-signature">' +
           (types.length ? ' :' + types.join('|') : '') + '</span>';
       }

       var cleanArray = [];
       Array.prototype.push.apply(cleanArray, jsOnlyDeprecations);
       Array.prototype.push.apply(cleanArray, tsDeprecations);
       types = f.type ? allowNormalProcessingNew(f, cleanArray) : [];
       f.signature = (f.signature || '') + '<span class="type-signature">' +
         (types.length ? ' :' + types.join('|') : '') + '</span>';
     }
     else {
       // now look for deprecation on the enums (ojvalues) of the property
       types = f.ojvalues ? getTypeForEnums(f) : [];
       if (types.some(t => t.indexOf('deprecated-hidden-only') > -1)) {
         f.tsdepsignature = (f.tsdepsignature || '') + '<span class="type-signature">' +
           (types.length ? ' :' + types.join('|') : '') + '</span>';
       }
       //clean old single signature.
       types = f.type ? allowNormalProcessingNew(f) : [];
       f.signature = (f.signature || '') + '<span class="type-signature">' +
         (types.length ? ' :' + types.join('|') : '') + '</span>';
     }
   }
 }

 function replaceSignature(f) {
   //first check if we need to replace at all.
   if (f.tstype) {
     f.tstype.forEach(function (signature) {
       if (signature.consumedBy === 'ts' || !signature.consumedBy) {
         var types = buildClassSignature2(f, signature);
         f.signature = '<span class="type-signature">' +
           types.join('') + '</span>';
       }
       else if (signature.consumedBy === 'tsdep') {
         var types = buildClassSignature2(f, signature);
         f.tsdepsignature = '<span class="type-signature">' +
           types.join('') + '</span>';
       }
       else if (signature.consumedBy === 'js') {
         var types = buildClassSignature2(f, signature);
         f.jssignature = '<span class="type-signature">' +
           types.join('') + '</span>';
       }
     });
   }
 }

 function addGenericSignature(f) {
   //first check if we need to replace at all.
   if (f.tsgenerictype && f.tsgenerictype.value) {
     //we need to replace only in this case where there is a whole signature for the function
     var types = buildTDGenericSignature(f);
     if (f.kind == "function") {
       f.genericSignature = '<span class="type-signature">' +
         types.join('') + '</span>';
     }
     else {
       f.signature = '<span class="type-signature">' +
         types.join('') + '</span>';
     }

   }
 }

 function addAccessorType(f) {
   var setterTypes = f.type ? buildAccessorTypeStrings(f, true) : [];
   var getterTypes = f.type ? buildAccessorTypeStrings(f, false) : [];
   if (setterTypes.length || getterTypes.length) {
     f.accessortypes = (f.accessortypes || '') + '<table class="keyboard-table">' +
       '<tbody>' +
       '<tr>' +
       '<td><b>Setter Type</b></td>' +
       '<td>' + setterTypes.join('|') + '</td>' +
       '</tr>' +
       '<tr>' +
       '<td><b>Getter Type</b></td>' +
       '<td>' + getterTypes.join('|') + '</td>' +
       '</tr>' +
       '</tbody>' +
       '<table>';
   }
 }

 function addClassSignature(f) {
   var signature = buildClassSignature(f);
   // if a class is marked as final by adding the @final markup to the doclet, we will
   // render the final keyword as well (only for classes).
   if (Array.isArray(signature) && signature.length > 0 && f.readonly) {
     signature.unshift('final ');
   }
   var deprecatedClass = getDeprecatedClass(f);
   if (signature && signature.length) {
     f.classsignature = '<dt class="' + deprecatedClass + '" style="margin-right: 100px;">' +
       '<h5><span>Signature: </span>' +
       '<p>   ' + '<span class="name type-signature">' +
       signature.join('') +
       '</span></p>' +
       '</h5>' +
       '</dt>';
   }
 }

 function addAttribs(f) {
   var attribs = helper.getAttribs(f);
   var attribsString = buildAttribsString(attribs);
   if (f.ojprotected) {
     attribsString = `protected ${attribsString}`;
   }

   f.attribs = util.format('<span class="type-signature">%s</span>', attribsString);
 }

 function shortenPaths(files, commonPrefix) {
   Object.keys(files).forEach(function (file) {
     files[file].shortened = files[file].resolved.replace(commonPrefix, '')
       // always use forward slashes
       .replace(/\\/g, '/');
   });

   return files;
 }

 function getPathFromDoclet(doclet) {
   if (!doclet.meta) {
     return null;
   }

   return doclet.meta.path && doclet.meta.path !== 'null' ?
     path.join(doclet.meta.path, doclet.meta.filename) :
     doclet.meta.filename;
 }

 function getModuleFolderName(doclet) {
   let moduleName;
   if (doclet && doclet.meta) {
     const filename = doclet.meta.filename;
     if (filename && doclet.ojmodule) {
         moduleName = doclet.ojmodule.replace(/\"/g, '').replace(/'/g, '');
     }
   }
   return moduleName;
 }

 function generate(title, docs, filename, resolveLinks, classes) {
   resolveLinks = resolveLinks === false ? false : true;

   var docData = {
     env: env,
     title: title,
     docs: docs,
     searchMetadata: searchMetadata
   };

   var outpath = path.join(outdir, filename),
   html = view.render('container.tmpl', docData);
   let module = getModuleFolderName(docs[0]) || "";
   let srcfileName = docs[0].meta? docs[0].meta.filename : "";

   checkBrokenLinks(html, true, filename, srcfileName, module);
   html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>
   checkBrokenLinks(html, false, filename, srcfileName, module);

   fs.writeFileSync(outpath, html, 'utf8');
 }

 function checkBrokenLinks(html, inlineLink, genFileName, srcFileName, module) {
   let matches;
   html = html || '';
   let COLL_KEY = inlineLink? 'BROKEN_LINK_LINKS' : 'BROKEN_ANCHOR_LINKS';
   let regexp = inlineLink? LINK_HREF_EXP: ANCHOR_HREF_EXP;
   do {
     matches = regexp.exec(html);
     if (matches) {
       let href = matches[1];
       let parentId = href;
       if (inlineLink){
         // check to see if the syntax is using | to separate text from the link
         let hrefArr = href.split('|');
         if (hrefArr.length == 1) {
           hrefArr = href.split(' ');
         }
         if (hrefArr.length > 1) {
           parentId = hrefArr[0].trim();
         }
         else {
           parentId = href.trim();
         }
       }
       if (parentId.startsWith("http")) continue;

       let relPath = false;
       if (parentId.startsWith('./')){
         relPath = true;
       }

       if (parentId.endsWith('.html')) {
         parentId = parentId.substring(0, parentId.indexOf('.html'));
       }
       else if (!inlineLink) {
         let hashIdx = parentId.indexOf('#');
         if (hashIdx > 0) {
           parentId = parentId.substring(0, hashIdx);

           if (parentId.endsWith('.html')) {
             parentId = parentId.substring(0, parentId.indexOf('.html'));
           }
         }
       }
       if (parentId) {
         if (relPath){
           parentId = parentId.substring(2);
         }
         let url = helper.longnameToUrl[parentId];
         if (!url) {
           COLLECTED_VIOLATIONS[COLL_KEY] = COLLECTED_VIOLATIONS[COLL_KEY] || {};
           COLLECTED_VIOLATIONS[COLL_KEY][module] = COLLECTED_VIOLATIONS[COLL_KEY][module] || {};
           COLLECTED_VIOLATIONS[COLL_KEY][module][srcFileName] = COLLECTED_VIOLATIONS[COLL_KEY][module][srcFileName] || [];
           COLLECTED_VIOLATIONS[COLL_KEY][module][srcFileName].push(util.format(ALL_VIOLATIONS[COLL_KEY].message, href, genFileName));
         }
       }
     }
   } while (matches)
 }

 function generateSourceFiles(sourceFiles, encoding) {
   encoding = encoding || 'utf8';
   Object.keys(sourceFiles).forEach(function (file) {
     var source;
     // links are keyed to the shortened path in each doclet's `meta.shortpath` property
     var sourceOutfile = helper.getUniqueFilename(sourceFiles[file].shortened);
     helper.registerLink(sourceFiles[file].shortened, sourceOutfile);

     try {
       source = {
         kind: 'source',
         code: helper.htmlsafe(fs.readFileSync(sourceFiles[file].resolved, encoding))
       };
     }
     catch (e) {
       logger.error('Error while generating source file %s: %s', file, e.message);
     }

     generate('Source: ' + sourceFiles[file].shortened, [source], sourceOutfile,
       false);
   });
 }

 function generateModule(data, filename, resolveLinks) {
   resolveLinks = resolveLinks === false ? false : true;

   const outpath = path.join(outdir, filename);
   let html = view.render('module.tmpl', data);
   // only caller to pass resolveLinks:false is the one that outputs src files verbatim
   if (resolveLinks) {
     html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>
   }

   fs.writeFileSync(outpath, html, 'utf8');
 }

 /**
  * Look for classes or functions with the same name as modules (which indicates that the module
  * exports only that class or function), then attach the classes or functions to the `module`
  * property of the appropriate module doclets. The name of each class or function is also updated
  * for display purposes. This function mutates the original arrays.
  *
  * @private
  * @param {Array.<module:jsdoc/doclet.Doclet>} doclets - The array of classes and functions to
  * check.
  * @param {Array.<module:jsdoc/doclet.Doclet>} modules - The array of module doclets to search.
  */
 function attachModuleSymbols(doclets, modules) {
   var symbols = {};

   // build a lookup table
   doclets.forEach(function (symbol) {
     symbols[symbol.longname] = symbols[symbol.longname] || [];
     symbols[symbol.longname].push(symbol);
   });

   return modules.map(function (module) {
     if (symbols[module.longname]) {
       module.modules = symbols[module.longname]
         // Only show symbols that have a description. Make an exception for classes, because
         // we want to show the constructor-signature heading no matter what.
         .filter(function (symbol) {
           return symbol.description || symbol.kind === 'class';
         })
         .map(function (symbol) {
           symbol = doop(symbol);

           if (symbol.kind === 'class' || symbol.kind === 'function') {
             symbol.name = symbol.name.replace('module:', '(require("') + '"))';
           }

           return symbol;
         });
     }
   });
 }

 function buildMemberNav(items, itemHeading, itemsSeen, linktoFn) {
   var nav = '';

   if (items.length) {
     var itemsNav = '';

     items.forEach(function (item) {

       var className = getDeprecatedClass(item);
       var liTag;
       if (className) {
         liTag = '<li class="' + className + '">';
       }
       else {
         liTag = '<li>';
       }
       if (!hasOwnProp.call(item, 'longname')) {
         itemsNav += liTag + linktoFn('', item.name) + '</li>';
       }
       else if (!hasOwnProp.call(itemsSeen, item.longname)) {
         var displayName;
         if (env.conf.templates.default.useLongnameInNav) {
           displayName = item.longname;
         } else {
           displayName = item.name;
         }
         itemsNav += liTag + linktoFn(item.longname, displayName.replace(/\b(module|event):/g, '')) + '</li>';

         itemsSeen[item.longname] = true;
       }
     });

     if (itemsNav !== '') {
       nav += '<h3>' + itemHeading + '</h3><ul>' + itemsNav + '</ul>';
     }
   }

   return nav;
 }

 function linktoTutorial(longName, name) {
   return tutoriallink(name);
 }

 function linktoExternal(longName, name) {
   return linkto(longName, name.replace(/(^"|"$)/g, ''));
 }

 function getDeprecatedClass(doc) {
   let returnVal = null;
   if (doc) {
     if (doc.tsignore && !doc.ojbindingelement) {
       //surely only in jsonly api mode.
       return 'jsdeprecated-hidden';
     }
     let since, removeBasedonSince, allOfDeprecations;
     if (doc.ojdeprecated) {
       allOfDeprecations = doc.ojdeprecated;
       allOfDeprecations.forEach((deprecation) => {
         if (deprecation.for === undefined && deprecation.target != 'memberType' && deprecation.target != 'returnType') {
           //yes the whole doclet is deprecated.

           since = deprecation.since;
           removeBasedonSince = !since || convertSemverToInt32(since) <= convertSemverToInt32('6.0.0');
           if (removeBasedonSince) {
             //is it deprecated prior to typescript? if so, it goes only in jsdoc.
             returnVal = 'jsdeprecated-hidden';
             return;
           }
           else {
             //else it goes in deprecation doc.
             returnVal = 'deprecated-hidden';
             return;
           }
         }
       });
     }
     else if (doc.tsdeprecated) {
       //a property, parameter or property value is deprecated using ojdeprecated
       allOfDeprecations = doc.tsdeprecated;
       allOfDeprecations.forEach((deprecation) => {
         if (!deprecation.target || deprecation.target === 'property' || deprecation.target === 'parameter' || deprecation.target === 'propertyValue') {
           //yes the whole doclet is deprecated.

           since = deprecation.since;
           removeBasedonSince = !since || convertSemverToInt32(since) <= convertSemverToInt32('6.0.0');
           if (removeBasedonSince && deprecation.target !== 'propertyValue') {
             //is it deprecated prior to typescript? if so, it goes only in jsdoc.
             returnVal = 'jsdeprecated-hidden';
             return;
           }
           else {
             //else it goes in deprecation doc.
             returnVal = 'deprecated-hidden';
             return;
           }
         }
       });
     }
   }
   return returnVal;
 }

 function getLiTag(doc) {
   var className = getDeprecatedClass(doc);
   var liTag;
   if (className) {
     liTag = '<li class="' + className + '">';
   }
   else {
     liTag = '<li>';
   }
   return liTag;
 }

 function getTrTag(doc) {
   var className = getDeprecatedClass(doc);
   var liTag;
   if (className) {
     liTag = '<tr class="' + className + '">';
   }
   else {
     liTag = '<tr>';
   }
   return liTag;
 }

 function buildJETModuleNav(members) {
   var index = 0;
   var nav = '<ul>'
   nav += '<li id="idx"><h2 id="navIndex"><a href="index.html" id="navIndexFocusable">Index</a></h2></li>';
   var seen = {};
   var getToggleForm = function () {
     return `<li><div id="nav_toggle">
       <input type="radio" id="elements_rb" name="toggle" value="Elements">
       <label for="elements">Elements</label>
       <input type="radio" id="modules_rb" name="toggle" value="Modules">
       <label for="modules">Modules</label><br>
     </div></li>`;
   };
   var writeLink = function (member, longname, linktext, linktoFn, catabbrev) {
     member.ojId = 'navItem' + index;
     var className = getDeprecatedClass(member);
     var liTag;
     if (className) {
       liTag = '<li class="' + className + '" id="' + member.ojId + '">';
     }
     else {
       liTag = '<li id="' + member.ojId + '">';
     }
     //var navItem = liTag + (catabbrev? '<span><strong>' + catabbrev + '</strong></span>' : '') +   linktoFn(longname, linktext) + '</li>';
     var navItem = liTag + linktoFn(longname, linktext) + '</li>';
     index++;
     return navItem;
   };
   var isValidModule = function (moduleObj) {
     // valid only if a module does have entries or has named exports
     return moduleObj && ((moduleObj.content && moduleObj.content.length > 0) || moduleObj.modulecontainer || moduleObj.exports);
   }
   var getContentHiddenInfo = function (moduleObj) {
     let hidden = false;
     let classVariation = 0b00;
     // if every content that belongs to the module is either js or deprecated, the module should be hidden
     if (moduleObj && moduleObj.content && moduleObj.content.length > 0) {
       let deprecatedDocs = moduleObj.content.reduce((a, c) => {
         let deprClass = getDeprecatedClass(c);
         if (deprClass !== null) {
           a.push(c);
           if (deprClass == 'jsdeprecated-hidden') {
             classVariation = classVariation | 0b01;
           }
           if (deprClass == 'deprecated-hidden') {
             classVariation = classVariation | 0b10;
           }
         }
         return a;
       }, []);
       hidden = deprecatedDocs.length == moduleObj.content.length;
     }
     return { hidden, classVariation };
   }
   var processNavigatorObjMembers = function (modules, linktoFn, category) {
     var itemsNav = '';

     if (Object.getOwnPropertyNames(modules).length > 0) {
       // get the keys and sort the keys
       let modkeys = Object.keys(modules);
       modkeys.sort();
       modkeys.forEach(moduleKey => {
         // process only if a module does have entries or has named exports
         if (isValidModule(modules[moduleKey])) {
           let className = "module";
           let contentInfo = getContentHiddenInfo(modules[moduleKey]);
           if (contentInfo.hidden) {
             if (contentInfo.classVariation == 1) {
               className = 'jsdeprecated-hidden';
             }
             else if (contentInfo.classVariation == 2) {
               className = 'deprecated-hidden';
             }
             else if (contentInfo.classVariation == 3) {
               className = 'deprecated-hidden jsdeprecated-hidden';
             }
           }
           if (className){
             itemsNav +=
             `<li class="${className}">
                 <div id="${moduleKey}" class="module_element">
                   <a href="${moduleKey}.html">${moduleKey}</a>
                 </div>`;
           }
           else {
             itemsNav +=
           `<li>
               <div id="${moduleKey}" class="module_element">
                 <a href="${moduleKey}.html">${moduleKey}</a>
               </div>`;
           }

           // an array of component, class, interface, namespace or binding element doclets
           const moduleObj = modules[moduleKey];
           const moduleContent = moduleObj.content;
           // we can also end up here if the module only documents named exports
           if (moduleContent && moduleContent.length > 0 || moduleObj.modulecontainer || moduleObj.exports) {
             itemsNav += `<ul class="subList_lev3">`;
             if (moduleContent && moduleContent.length > 0) {
               itemsNav += processNavigatorArrayMembers(moduleContent, linkto, 'Module');
             }
             if (moduleObj.modulecontainer) {
               let namedExports = find({ kind: "member", memberof: moduleObj.modulecontainer[0].name });
               namedExports = [...namedExports, ...find({ kind: "function", memberof: moduleObj.modulecontainer[0].name })];
               namedExports = [...namedExports, ...find({ kind: "typedef", memberof: moduleObj.modulecontainer[0].name })];
               namedExports.forEach(doclet => {
                 doclet.ojId = 'navItem' + index;
                 let className = getDeprecatedClass(doclet);
                 let liTag;
                 if(className){
                   liTag = `<li id="${doclet.ojId}" class="${className}">`;
                 }
                 else {
                   liTag = `<li id="${doclet.ojId}">`;
                 }
                 var navItem = `${liTag}<a href="${moduleKey}.html#${doclet.name}">${doclet.name}</a></li>`;
                 index++;
                 itemsNav += navItem;
               });
             }
             itemsNav += '</ul>';
           }
           itemsNav += '</li>';
         }
       })
     }
     return itemsNav;
   };

   var processNavigatorObjMembersAsOneContent = function (modules, linktoFn, category) {
     var itemsNav = '';
     let allOtherContent = [];
     if (Object.getOwnPropertyNames(modules).length > 0) {
       // get the keys and sort the keys
       let modkeys = Object.keys(modules);
       modkeys.forEach(moduleKey => {
         // process only if a module does have entries or has named exports
         if (isValidModule(modules[moduleKey])) {
           const moduleObj = modules[moduleKey];
           const moduleContent = moduleObj.content;
           if (moduleContent && moduleContent.length > 0) {
             allOtherContent = [...allOtherContent, ...moduleContent.filter(doclet => !doclet.ojcomponent)];
           }
         }
       });
     }
     allOtherContent.sort((a, b) => {
       return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
     });
     itemsNav = processNavigatorArrayMembers(allOtherContent, linktoFn, category);
     return itemsNav;

   };


   var processNavigatorArrayMembers = function (items, linktoFn, category, sortFn) {
     var itemsNav = '';
     let catabbrev;
     if (sortFn) {
       items.sort(sortFn);
     }
     if (items.length) {
       items.forEach(function (item) {
         if (!item.ojhidden) {
           searchMetadata[item.longname] = { 'ref': item.longname + '.html' };
           if (category === 'Module') {
             if (item.kind === 'interface') {
               category = 'Interface';
               catabbrev = "I";
             }
             else if (item.kind === 'namespace') {
               category = 'Namespace';
               catabbrev = "N";
             }
             else if (item.kind === 'class') {
               category = 'Class';
               if (item.ojcomponent) {
                 catabbrev = 'E';
               }
               else if (item.ojbindingelement) {
                 catabbrev = 'B';
               }
               else {
                 catabbrev = 'C';
               }
             }
           }
           searchMetadata[item.longname]['subCategory'] = category;

           itemsNav += writeLink(item, item.longname, (item.ojPageTitle || item.name), linktoFn, catabbrev);
         }
       });
     }
     return itemsNav;
   };

   // deal with classes
   members.classes.forEach(function (c) {
     if (!hasOwnProp.call(seen, c.longname)) {
       let moduleName = getModuleFolderName(c);
       if (moduleName) {
         moduleNav[MODULES][moduleName] = moduleNav[MODULES][moduleName] || {};
         if (c.ojstylingdoc) {
           moduleNav[STYLING].push(c);
         }
         else if (c.ojoverviewdoc) {
           moduleNav[OVERVIEWS].push(c);
         }
         else {
           if (!c.virtual) {
             if (c.ojcomponent) {
               moduleNav[ELEMENTS].push(c);
             }
             if (c.ojmodulecontainer) {
               moduleNav[MODULES][moduleName].modulecontainer = [c];
             }
             else {
               moduleNav[MODULES][moduleName].content = moduleNav[MODULES][moduleName].content || [];
               moduleNav[MODULES][moduleName].content.push(c);
               if (c.ojexports) {
                 moduleNav[MODULES][moduleName].exports = moduleNav[MODULES][moduleName].exports || [];
                 moduleNav[MODULES][moduleName].exports.push(c);
               }
             }
           }
         }
       }
       // current stylingdoc is in rt/jsdoc so no module for it
       else {
         if (c.ojstylingdoc) {
           moduleNav[STYLING].push(c);
         }
       }
     }
     seen[c.longname] = true;
   });

   members.interfaces.forEach(function (c) {
     if (!hasOwnProp.call(seen, c.longname)) {
       let moduleName = getModuleFolderName(c);
       if (moduleName) {
         moduleNav[MODULES][moduleName] = moduleNav[MODULES][moduleName] || {};
         moduleNav[MODULES][moduleName].content = moduleNav[MODULES][moduleName].content || [];
         moduleNav[MODULES][moduleName].content.push(c);
         if (c.ojexports) {
           moduleNav[MODULES][moduleName].exports = moduleNav[MODULES][moduleName].exports || [];
           moduleNav[MODULES][moduleName].exports.push(c);
         }
       }
     }
     seen[c.longname] = true;
   });

   members.namespaces.forEach(function (c) {
     if (!hasOwnProp.call(seen, c.longname)) {
       let moduleName = getModuleFolderName(c);
       if (moduleName) {
         moduleNav[MODULES][moduleName] = moduleNav[MODULES][moduleName] || {};
         if (c.ojmodulecontainer) {
           moduleNav[MODULES][moduleName].modulecontainer = [c];
         }
         else {
           moduleNav[MODULES][moduleName].content = moduleNav[MODULES][moduleName].content || [];
           moduleNav[MODULES][moduleName].content.push(c);
           if (c.ojexports) {
             moduleNav[MODULES][moduleName].exports = moduleNav[MODULES][moduleName].exports || [];
             moduleNav[MODULES][moduleName].exports.push(c);
           }
         }
       }
     }
     seen[c.longname] = true;
   });

   members.globals.forEach(function (c) {
     if (!hasOwnProp.call(seen, c.longname)) {
       moduleNav[GLOBALS] = moduleNav[GLOBALS] || [];
       moduleNav[GLOBALS].push(c);
     }
     seen[c.longname] = true;
   });

   // render Concepts
   const overviewSortFn = (comp1, comp2) => {
     if (comp1.ojPageRanking === comp2.ojPageRanking) {
       var display1 = comp1.ojPageTitle;
       var display2 = comp2.ojPageTitle;
       return (display1 < display2) ? -1 : (display1 > display2) ? 1 : 0;
     }
     else return comp1.ojPageRanking - comp2.ojPageRanking;
   }
   let _members = processNavigatorArrayMembers(moduleNav[OVERVIEWS], linkto, 'Class', overviewSortFn);
   if (_members !== '') {
     nav += '<li><h3 id="navElements">Concepts</h3><ul class="subList">' + _members + '</ul></li>';
   };

   nav += getToggleForm();

   _members = processNavigatorArrayMembers(moduleNav[ELEMENTS], linkto, 'Class');
   if (_members !== '') {
     nav += '<li id="nav_elements" style="display: none"><h3 id="navElements">Elements</h3><ul class="subList">' + _members + '</ul></li>';
   };

   // section for all non-element APIs (classes, interfaces, namespaces)
   // loop through modules and gather content that is not an ojcomponent
   _members = processNavigatorObjMembersAsOneContent(moduleNav[MODULES], linkto, 'Class');
   if (_members !== '') {
     nav += '<li id="nav_non_elements" style="display: none"><h3 id="navNonElements">Non-Element API</h3><ul class="subList">' + _members + '</ul></li>';
   };

   _members = processNavigatorObjMembers(moduleNav[MODULES], linkto, 'Class');
   if (_members !== '') {
     nav += '<li id="nav_modules" style="display: none"><h3 id="navElements">Modules</h3><ul class="subList_lev2">' + _members + '</ul></li>';
   };

   _members = processNavigatorArrayMembers(moduleNav[STYLING], linkto, 'Class');
   if (_members !== '') {
     nav += '<li><h3 id="navElements">Non-Element Styling</h3><ul class="subList">' + _members + '</ul></li>';
   };

   _members = processNavigatorArrayMembers(moduleNav[GLOBALS], linkto, 'Class');
   if (_members !== '') {
     nav += '<li><h3 id="navElements">Globals</h3><ul class="subList">' + _members + '</ul></li>';
   };

   nav += '</ul>'

   return nav;
 }

 /**
     @param {TAFFY} taffyData See <http://taffydb.com/>.
     @param {object} opts
     @param {Tutorial} tutorials
  */
 exports.publish = function (taffyData, opts, tutorials) {
   data = taffyData;
   var conf = env.conf.templates || {};
   conf.default = conf.default || {};
   // get the directory name that contains tsc generated jsdoc style doclets
   let docletSrcDir = path.normalize(env.opts.query.docletSource);
   let custElemDoclets = [];
   if (docletSrcDir){
     // get all the json files from that directory
     const files = fs.readdirSync(docletSrcDir);

     files.forEach(file => {
       let currFile = path.join(docletSrcDir, file);
       if (!fs.lstatSync(currFile).isDirectory()
             && path.extname(file) === '.json'
             && file !== 'component.json'
             && file !== 'package.json'){
         let currDoclets = fs.readFileSync(currFile, "utf-8");
         custElemDoclets = custElemDoclets.concat(JSON.parse(currDoclets));
       }
     })
   }

   custElemDoclets.forEach(doclet => {
     if (doclet.kind === 'class' && doclet.ojcomponent){
       doclet.propertyNameToAttribute = function(name) {
         return name.replace(
             /([A-Z])/g,
             function(match) {
                 return '-' + match.toLowerCase();
             }
         );
       };
     }
   })

   data.merge(custElemDoclets);
   var templatePath = path.normalize(opts.template);
   view = new template.Template(path.join(templatePath, 'tmpl'));

   // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
   // doesn't try to hand them out later
   var indexUrl = helper.getUniqueFilename('index');
   // don't call registerLink() on this one! 'index' is also a valid longname

   var globalUrl = helper.getUniqueFilename('global');
   helper.registerLink('global', globalUrl);

   // set up templating
   view.layout = conf.default.layoutFile ?
     path.getResourcePath(path.dirname(conf.default.layoutFile),
       path.basename(conf.default.layoutFile)) :
     'layout.tmpl';

    // set up templating for external apps
    // save the current env.pwd
    const tmp_pwd = env.pwd;
    try{
      env.pwd = env.opts.query.docletSource;
      if (opts.main){
        view.main = path.getResourcePath(path.dirname(opts.main), path.basename(opts.main));
        if (view.main){
          view.mainContent = fs.readFileSync(view.main, "utf-8");
        }
      }
      if (opts.footer){
        view.footer = path.getResourcePath(path.dirname(opts.footer), path.basename(opts.footer));
        if (view.footer){
          view.footerContent = fs.readFileSync(view.footer, "utf-8");
        }
      }
      if (opts.header){
        view.header = path.getResourcePath(path.dirname(opts.header), path.basename(opts.header));
        if (view.header){
          view.headerContent = fs.readFileSync(view.header, "utf-8");
        }
      }
    }
    finally{
      //restore
      env.pwd = tmp_pwd;
    }

   // set up tutorials for helper
   helper.setTutorials(tutorials);
   data = helper.prune(data);
   data.sort('longname, version, since');
   helper.addEventListeners(data);

   var sourceFiles = {};
   var sourceFilePaths = [];
   data().each(function (doclet) {
     doclet.attribs = '';

     if (doclet.tsexamples) {
       doclet.tsexamples = doclet.tsexamples.map(function (example) {
         var caption, code;

         if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
           caption = RegExp.$1;
           code = RegExp.$3;
         }

         return {
           caption: caption || '',
           code: code || example
         };
       });
     }
     if (doclet.see) {
       doclet.see.forEach(function (seeItem, i) {
         doclet.see[i] = hashToLink(doclet, seeItem);
       });
     }

     // build a list of source files
     var sourcePath;
     if (doclet.meta) {
       sourcePath = getPathFromDoclet(doclet);
       sourceFiles[sourcePath] = {
         resolved: sourcePath,
         shortened: null
       };
       if (sourceFilePaths.indexOf(sourcePath) === -1) {
         sourceFilePaths.push(sourcePath);
       }
     }
   });

   // update outdir if necessary, then create outdir
   var packageInfo = (find({ kind: 'package' }) || [])[0];
   if (packageInfo && packageInfo.name) {
     outdir = path.join(outdir, packageInfo.name, (packageInfo.version || ''));
   }
   fs.mkPath(outdir);

   // copy the template's static files to outdir
   var fromDir = path.join(templatePath, 'static');
   var staticFiles = fs.ls(fromDir, 3);

   staticFiles.forEach(function (fileName) {
     var toDir = fs.toDir(fileName.replace(fromDir, outdir));
     fs.mkPath(toDir);
     var outFile = path.join(toDir, path.basename(fileName));
     copyFile(fileName, outFile);
     //fs.copyFileSync(fileName, toDir);
   });

   // copy user-specified static files to outdir
   var staticFilePaths;
   var staticFileFilter;
   var staticFileScanner;
   if (conf.default.staticFiles) {
     // The canonical property name is `include`. We accept `paths` for backwards compatibility
     // with a bug in JSDoc 3.2.x.
     staticFilePaths = conf.default.staticFiles.include ||
       conf.default.staticFiles.paths ||
       [];
     staticFileFilter = new (require('jsdoc/src/filter')).Filter(conf.default.staticFiles);
     staticFileScanner = new (require('jsdoc/src/scanner')).Scanner();

     staticFilePaths.forEach(function (filePath) {
       var extraStaticFiles;

       filePath = path.resolve(env.pwd, filePath);
       extraStaticFiles = staticFileScanner.scan([filePath], 10, staticFileFilter);

       extraStaticFiles.forEach(function (fileName) {
         var sourcePath = fs.toDir(filePath);
         var toDir = fs.toDir(fileName.replace(sourcePath, outdir));
         fs.mkPath(toDir);
         var outFile = path.join(toDir, path.basename(fileName));
         copyFile(fileName, outFile);
         //fs.copyFileSync(fileName, toDir);
       });
     });
   }

   if (sourceFilePaths.length) {
     sourceFiles = shortenPaths(sourceFiles, path.commonPrefix(sourceFilePaths));
   }
  data().each(function (doclet) {
    var url = helper.createLink(doclet);
    if (url.indexOf('#') > -1){
      const urlArr = url.split(/#/);
      let lastPart = urlArr.pop();
      // remove the scope punctuation becasue it will not work with our templates
      if (lastPart.startsWith('.')){
        lastPart = lastPart.substr(1);
        //reconstruct the url
        urlArr.push(lastPart);
        url = urlArr.join('#');
      }
    }

    helper.registerLink(doclet.longname, url);

     // add a shortened version of the full path
     var docletPath;
     if (doclet.meta) {
       docletPath = getPathFromDoclet(doclet);
       if (sourceFiles[docletPath]) docletPath = sourceFiles[docletPath].shortened;
       if (docletPath) {
         doclet.meta.shortpath = docletPath;
         //[csaba] added filename as well so that existing code that we have today won't break
         doclet.meta.filename = docletPath;
       }
     }
   });

   all_typedefs = find({ kind: "typedef" });
   all_linkableTypes = find([{ kind: ["typedef", "namespace", "class", "interface"] }, { isEnum: true }]);

  data().each(function (doclet) {
    let url = helper.longnameToUrl[doclet.longname];
    // the id in the incoming custom compiler generated doclets is the fully qualified
    // name of the doclet(it is a requirement of taffydb in order to successfully merge together
    // doclets from different components, doclets that might have the same name) but we need to simply here
    // in order for our templates to work.
    if (url.indexOf('#') > -1) {
      doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
    }
    else {
      doclet.id = doclet.name;
    }
     // longnameToUrl contain [] in escaped form, replace that to restore the []
     if (doclet.kind === 'member' && doclet.id && doclet.id.indexOf("%5B%5D") > -1) {
       const regex = /%5B%5D/g;
       doclet.id = doclet.id.replace(regex, "[]");
     }
     //[csaba] - fix an issue where inherited doclets are not "inheriting" the parsedType Object in the parameter or property type (object)
     // The reason is that this key is not enumerable so it's not cloned when jsdoc clones the inherited doclet. We need this object to properly
     // document function types. The proper function signature (as it was defined in the js src) can only be discovered in the type.parsedType.typeExpression
     // property. The "names" array under type only contains "function" as the type of a property or parameter but in this way we are loosing
     // the signature or return type of the function from our documentation.
     augmentInheritedTypes(doclet);

     if (needsSignature(doclet)) {
       addSignatureParams(doclet);
       if (!doclet.ojdecorator) {
         addSignatureReturns(doclet);
       }
       addAttribs(doclet);

     }
   });

   // do this after the urls have all been generated
   data().each(function (doclet) {
     doclet.ancestors = getAncestorLinks(doclet);

     if (doclet.kind === 'member') {
       addSignatureTypes(doclet);
       addAccessorType(doclet);
       addAttribs(doclet);
     }

     if (doclet.kind === 'constant') {
       addSignatureTypes(doclet);
       addAccessorType(doclet);
       addAttribs(doclet);
       doclet.kind = 'member';
     }

     if (doclet.kind === 'class' || doclet.kind === 'interface' || doclet.kind === 'namespace' || doclet.kind === 'typedef') {
       addClassSignature(doclet);
       //addAttribs(doclet);
     }

     //for methods, if ojsignature overrides the whole method signature, recreate the signature
     if (doclet.kind === 'function') {
       replaceSignature(doclet);
       addGenericSignature(doclet);
     }

     //for typedef's it means generic parameters.
     if (doclet.kind === 'typedef') {
       addGenericSignature(doclet);
     }

   });



   var members = helper.getMembers(data);
   members.tutorials = tutorials.children;

   // output pretty-printed source files by default
   var outputSourceFiles = conf.default && conf.default.outputSourceFiles !== false ? true :
     false;

   // add template helpers
   // these functions can be used in template code
   view.find = find;
   view.getLiTag = getLiTag;
   view.getTrTag = getTrTag;
   view.getDeprecatedClass = getDeprecatedClass;
   view.linkto = linkto;
   view.resolveAuthorLinks = resolveAuthorLinks;
   view.tutoriallink = tutoriallink;
   view.htmlsafe = htmlsafe;
   view.outputSourceFiles = outputSourceFiles;
   view.tryTypeParsing = tryTypeParsing;
   view.tryToFindAllPossibleLinks = tryToFindAllPossibleLinks;
   view.globals = GLOBAL_APIS;
   view.allTypeDefs = all_typedefs || [];
   view.logger = logger;

   view.getStylingItems = styleutils.getStylingItems;
   view.convertSemverToInt32 = convertSemverToInt32;

   //build modules based navigation
   view.nav = buildJETModuleNav(members);
   attachModuleSymbols(find({ longname: { left: 'module:' } }), members.modules);
   //check for jsdoc violations before generating files
   checkViolations(data);
   // generate the pretty-printed source files first so other pages can link to them
   if (outputSourceFiles) {
     generateSourceFiles(sourceFiles, opts.encoding);
   }

   if (members.globals.length) { generate('Global', [{ kind: 'globalobj' }], globalUrl); }

   const mainPageDoc = [{ kind: 'mainpage', readme: opts.readme, longname: (opts.mainpagetitle) ? opts.mainpagetitle : 'Main Page' }];

   // generate the jet module files
   if (Object.getOwnPropertyNames(moduleNav[MODULES]).length > 0) {
     let modules = moduleNav[MODULES];
     // get the keys and sort the keys
     let modkeys = Object.keys(modules);
     modkeys.sort();
     modkeys.forEach(moduleKey => {
       // process only if a module does have entries
       if (modules[moduleKey] && (modules[moduleKey].content || modules[moduleKey].exports || modules[moduleKey].modulecontainer)) {
         let title = 'Module: ' + moduleKey;
         let moduleContainers = modules[moduleKey].modulecontainer || [];
         let moduleExports = modules[moduleKey].exports || [];
         let moduleContent = modules[moduleKey].content || [];
         let docs = [...moduleContainers, ...moduleExports, ...moduleContent];
         let data = {
           env: env,
           title: title,
           docs: docs,
           name: moduleKey,
           searchMetadata: searchMetadata
         }
         generateModule(data, `${moduleKey}.html`);
       }
     })
   }


   // set up the lists that we'll use to generate pages
   var classes = taffy(members.classes);
   var modules = taffy(members.modules);
   var namespaces = taffy(members.namespaces);
   var mixins = taffy(members.mixins);
   var externals = taffy(members.externals);
   var interfaces = taffy(members.interfaces);

   Object.keys(helper.longnameToUrl).forEach(function (longname) {
     var myModules = helper.find(modules, { longname: longname });
     if (myModules.length) {
       generate('Module: ' + myModules[0].name, myModules, helper.longnameToUrl[longname]);
     }

     var myClasses = helper.find(classes, { longname: longname });
     if (myClasses.length && !myClasses[0].ojhidden) {

       // E.g. @ojcomponent and @ojstylingdoc set the prefix to "Component: " and "Styling: ", and
       // @ojstylingdoc sets the title to the version of the title that hasn't had its spaces removed.
       var prefix = myClasses[0].ojoverviewdoc ? "" : myClasses[0].ojPageTitlePrefix || 'Class: ';
       if (myClasses[0].ojcomponent && myClasses[0].virtual) {
         prefix = 'Class: ';
         myClasses[0].ojPageTitle = myClasses[0].name;
         myClasses[0].ojPageTitlePrefix = prefix;
       }
       // if a class is marked as final by adding the @final markup to the doclet, we will
       // render the final keyword as well (only for classes).
       if (prefix === 'Class: ' && myClasses[0].readonly) {
         prefix = `Final ${prefix}`;
       }
       var pageTitle = prefix + (myClasses[0].ojPageTitle || myClasses[0].name);
       updateModuleReturn(myClasses[0]);
       generate(pageTitle, myClasses, helper.longnameToUrl[longname]);
     }

     var myNamespaces = helper.find(namespaces, { longname: longname });
     if (myNamespaces.length && !myNamespaces[0].ojhidden) {
       updateModuleReturn(myNamespaces[0]);
       generate('Namespace: ' + myNamespaces[0].name, myNamespaces, helper.longnameToUrl[longname]);
     }

     var myMixins = helper.find(mixins, { longname: longname });
     if (myMixins.length) {
       generate('Mixin: ' + myMixins[0].name, myMixins, helper.longnameToUrl[longname]);
     }

     var myExternals = helper.find(externals, { longname: longname });
     if (myExternals.length) {
       generate('External: ' + myExternals[0].name, myExternals, helper.longnameToUrl[longname]);
     }

     var myInterfaces = helper.find(interfaces, { longname: longname });
     if (myInterfaces.length) {
       generate('Interface: ' + myInterfaces[0].name, myInterfaces, helper.longnameToUrl[longname]);
     }
   });

   // send to stdout the broken links violations
   printViolations();
   // make the build fail if we found the broken link violation
   if (BUILD_STOP) {
     logger.error(new Error("JSDOC build failed. Check the log for more information"));
   }

   generate('Introduction', mainPageDoc, indexUrl, true, classes);

   var searchMdFilePath = path.join(outdir, 'jsDocMd.json');
   fs.writeFileSync(searchMdFilePath, JSON.stringify(searchMetadata), 'utf8');
   // TODO: move the tutorial functions to templateHelper.js
   function generateTutorial(title, tutorial, filename) {
     var tutorialData = {
       title: title,
       header: tutorial.title,
       content: tutorial.parse(),
       children: tutorial.children
     };

     var tutorialPath = path.join(outdir, filename),
       html = view.render('tutorial.tmpl', tutorialData);

     // yes, you can use {@link} in tutorials too!
     html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>

     fs.writeFileSync(tutorialPath, html, 'utf8');
   }

   // tutorials can have only one parent so there is no risk for loops
   function saveChildren(node) {
     node.children.forEach(function (child) {
       generateTutorial('Tutorial: ' + child.title, child, helper.tutorialToUrl(child.name));
       saveChildren(child);
     });
   }
   saveChildren(tutorials);
 };
 /**
  * Checks for typedef usage in jsdoc type tag violation. If typedefs are found in the parsed type of an attribute
  * or function, jsdoc build will fail.
  * @param {TAFFY} data See <http://taffydb.com/>.
  */
 function checkViolations(data) {
   //maps container parents to the array of typedefs belonging to the parent
   var containerToTypeDef = {};

   if (all_typedefs && all_typedefs.length) {
     all_typedefs.forEach(function (typedef) {
       let parent = typedef.memberof;
       if (parent) {
         // save the regexp to a key so that we can use it later in our test
         typedef['regexp'] = new RegExp(typedef.longname + "\\b", "g");
         containerToTypeDef[parent] = containerToTypeDef[parent] || [];
         containerToTypeDef[parent].push(typedef);
       }
       else {
         //TODO incorporate this later into the violation object
         //logger.warn("TypeDef %s from file %s does not have a parent", typedef.name, typedef.meta.filename);
       }
     });
   }
   let allDoclets = data().get();
   allDoclets.forEach(function (doclet) {
     if (doclet.kind === 'member' || doclet.kind === 'function') {
       let file = doclet.meta.filename;
       let arr = file.split('/');
       let module = arr[5];
       let fileName = arr[6];
       if (doclet.memberof !== undefined) {
         if (doclet.memberof.indexOf("~") > 0 || doclet.memberof.startsWith("_") || doclet.name.startsWith('_')) {
           //TODO incorporate this later into the violation object
           //logger.warn("IGNORE: %s::%s from %s should be marked with @ignore", doclet.memberof,doclet.name, doclet.meta.filename);
         }
         else {
           // we have a valid parent at this point
           let parent = doclet.memberof;
           //find that parent
           let parentObj = find({ kind: "class", longname: parent });
           if (parentObj && parentObj.length) {
             var isPublicAttribute = doclet.kind === 'member' && doclet.access !== 'protected' && doclet.access !== 'private' &&
               !doclet.ojslot && !doclet.ojchild && !doclet.ojfragment && !doclet.ojbindingonly &&
               !doclet.ojnodecontext && !doclet.ojsubid && !doclet.isstyleclass && !doclet.isstyleset &&
               !doclet.isstyletemplate && !doclet.isstyletemplatetoken && !doclet.isstylevariableset;
             if (parentObj.length > 1) {
               //TODO incorporate this later into the violation object
               //logger.error("MORE_THEN_ONE_PARENT: %s has more then one class type parent", doclet.name);
             }
             else if (!parentObj[0].ignore) {
               // finally we have found the parent doclet for this member
               // check for @type for public members - must have a type
               if (isPublicAttribute) {
                 //check for the existence of type
                 if (!doclet.type) {
                   if (parentObj[0].ojcomponent) {
                     COLLECTED_VIOLATIONS['MISSING_OJCOMPONENT_TYPE'] = COLLECTED_VIOLATIONS['MISSING_OJCOMPONENT_TYPE'] || {};
                     COLLECTED_VIOLATIONS['MISSING_OJCOMPONENT_TYPE'][module] = COLLECTED_VIOLATIONS['MISSING_OJCOMPONENT_TYPE'][module] || {};
                     COLLECTED_VIOLATIONS['MISSING_OJCOMPONENT_TYPE'][module][fileName] = COLLECTED_VIOLATIONS['MISSING_OJCOMPONENT_TYPE'][module][fileName] || [];
                     COLLECTED_VIOLATIONS['MISSING_OJCOMPONENT_TYPE'][module][fileName].push(util.format(ALL_VIOLATIONS['MISSING_OJCOMPONENT_TYPE'].message, doclet.name.replace(/^#+/g, ''), parent));
                   }
                   else {
                     COLLECTED_VIOLATIONS['MISSING_CLASS_TYPE'] = COLLECTED_VIOLATIONS['MISSING_CLASS_TYPE'] || {};
                     COLLECTED_VIOLATIONS['MISSING_CLASS_TYPE'][module] = COLLECTED_VIOLATIONS['MISSING_CLASS_TYPE'][module] || {};
                     COLLECTED_VIOLATIONS['MISSING_CLASS_TYPE'][module][fileName] = COLLECTED_VIOLATIONS['MISSING_CLASS_TYPE'][module][fileName] || [];
                     COLLECTED_VIOLATIONS['MISSING_CLASS_TYPE'][module][fileName].push(util.format(ALL_VIOLATIONS['MISSING_CLASS_TYPE'].message, doclet.name.replace(/^#+/g, ''), parent));
                   }
                 }
                 else {
                   //check if type contains {*}
                   if (doclet.type.names && parentObj[0].ojcomponent) {
                     var isObject = false;
                     doclet.type.names.forEach(function (name, i) {
                       if (name.indexOf('*') >= 0) {
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'] = COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'] || {};
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module] = COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module] || {};
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module][fileName] = COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module][fileName] || [];
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module][fileName].push(util.format(ALL_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'].message, doclet.name.replace(/^#+/g, ''), parent, 'change {*} to {any}'));
                       }
                       if (name.indexOf('undefined') >= 0) {
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'] = COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'] || {};
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module] = COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module] || {};
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module][fileName] = COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module][fileName] || [];
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module][fileName].push(util.format(ALL_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'].message, doclet.name.replace(/^#+/g, ''), parent, 'remove \"undefined\" from the type'));
                       }
                       if (name.indexOf('String') >= 0) {
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'] = COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'] || {};
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module] = COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module] || {};
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module][fileName] = COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module][fileName] || [];
                         COLLECTED_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'][module][fileName].push(util.format(ALL_VIOLATIONS['INVALID_ATTRIBUTE_TYPE'].message, doclet.name.replace(/^#+/g, ''), parent, 'change \"String\" to \"string\"'));
                       }
                       if (name.toLowerCase().indexOf('object') >= 0) {
                         isObject = true;
                       }
                     });

                     if (parentObj[0].ojcomponent && isObject && doclet.id !== 'translations') {
                       // @property {String} [prop="value"] description
                       //Support for default values in @property tags: currently jsdoc supports the propname=default notation
                       //in the @property tag *only* if you use to optional notation: [propname=default] (which sort of makes sense).

                       /*
                       commented out because at this time we will not enforce default checking if the sub-properties are defined via @property tags
                       if (doclet.properties && doclet.properties.length){
                         if (doclet.defaultvalue && doclet.defaultvalue !== '{}' && doclet.defaultvalue !== 'null'){
                           COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'] = COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'] || {};
                           COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module] = COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module] || {};
                           COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module][fileName] = COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module][fileName] || [];
                           COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module][fileName].push(util.format(ALL_VIOLATIONS['INVALID_DEFAULT_VALUE'].message, doclet.name.replace(/^#+/g, ''), parent));
                         }
                         doclet.properties.sort(function(a, b){
                           var aid, bid;
                           aid = a.name.replace(/\[\]/, '');
                           bid = b.name.replace(/\[\]/, '');
                           return (aid < bid) ? -1 : (aid > bid) ? 1 : 0;
                         });

                         for (let m = 0; m < doclet.properties.length; m++) {
                           let subpropobj = doclet.properties[m];
                           if (subpropobj.defaultvalue && subpropobj.defaultvalue !== '{}' && doclet.properties[m+1].name.startsWith(subpropobj.name + '.')){
                             COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'] = COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'] || {};
                             COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module] = COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module] || {};
                             COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module][fileName] = COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module][fileName] || [];
                             COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module][fileName].push(util.format(ALL_VIOLATIONS['INVALID_DEFAULT_VALUE'].message, subpropobj.name.replace(/^#+/g, ''), parent));
                           }
                         }
                       }*/
                       if (doclet.id.indexOf('.') < 0) {
                         //check descendants
                         var subpropDoclets = find({ kind: "member", memberof: doclet.memberof, id: { left: doclet.id } });
                         if (subpropDoclets && subpropDoclets.length && subpropDoclets.length > 1) {
                           // make sure they are in order
                           subpropDoclets.sort(function (a, b) {
                             var aid, bid;
                             aid = a.name.replace(/\[\]/, '');
                             bid = b.name.replace(/\[\]/, '');
                             return (aid < bid) ? -1 : (aid > bid) ? 1 : 0;
                           });
                           // something like oj.ojChart#dnd.drag, oj.ojChart#dnd.drag.groups, oj.ojChart#dnd.drag.groups.dataTypes, etc...
                           for (let v = 0; v < subpropDoclets.length - 1; v++) {
                             let subpropDoclet = subpropDoclets[v];
                             if (subpropDoclet.defaultvalue && subpropDoclet.defaultvalue !== '{}' && subpropDoclet.defaultvalue !== 'null' && subpropDoclets[v + 1].id.startsWith(subpropDoclet.id + '.')) {
                               COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'] = COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'] || {};
                               COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module] = COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module] || {};
                               COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module][fileName] = COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module][fileName] || [];
                               COLLECTED_VIOLATIONS['INVALID_DEFAULT_VALUE'][module][fileName].push(util.format(ALL_VIOLATIONS['INVALID_DEFAULT_VALUE'].message, subpropDoclet.name.replace(/^#+/g, ''), parent));
                             }
                           };
                         }
                       }
                     }
                   }
                 }
               }

               // see if you can find typedefs belonging to this parent
               let typedefs = containerToTypeDef[parent];
               //we have typedefs?
               if (typedefs && typedefs.length) {
                 // look for the signature
                 let sign = doclet.signature;
                 // we should have at this poitn a constructed signature
                 if (sign) {
                   let typeExpr;
                   if (doclet.type && doclet.type.parsedType && doclet.type.parsedType.typeExpression) {
                     typeExpr = doclet.type.parsedType.typeExpression;
                   }
                   typedefs.forEach(function (typedef) {
                     let regex = typedef['regexp'];
                     //first check if @type might contain a typedef (this is not supported)
                     if (typeExpr && regex.test(typeExpr)) {
                       COLLECTED_VIOLATIONS['TYPEDEF_IN_TYPE'] = COLLECTED_VIOLATIONS['TYPEDEF_IN_TYPE'] || {};
                       COLLECTED_VIOLATIONS['TYPEDEF_IN_TYPE'][module] = COLLECTED_VIOLATIONS['TYPEDEF_IN_TYPE'][module] || {};
                       COLLECTED_VIOLATIONS['TYPEDEF_IN_TYPE'][module][fileName] = COLLECTED_VIOLATIONS['TYPEDEF_IN_TYPE'][module][fileName] || [];
                       COLLECTED_VIOLATIONS['TYPEDEF_IN_TYPE'][module][fileName].push(util.format(ALL_VIOLATIONS['TYPEDEF_IN_TYPE'].message, doclet.name.replace(/^#+/g, ''), typedef.longname));
                     }
                     if (regex.test(sign)) {
                       // check if signature has a anchor link and typedefs is part of the link
                       if (sign.indexOf(util.format('>%s</a>', typedef.longname)) < 0) {
                         COLLECTED_VIOLATIONS['MISSING_LINKS'] = COLLECTED_VIOLATIONS['MISSING_LINKS'] || {};
                         COLLECTED_VIOLATIONS['MISSING_LINKS'][module] = COLLECTED_VIOLATIONS['MISSING_LINKS'][module] || {};
                         COLLECTED_VIOLATIONS['MISSING_LINKS'][module][fileName] = COLLECTED_VIOLATIONS['MISSING_LINKS'][module][fileName] || [];
                         COLLECTED_VIOLATIONS['MISSING_LINKS'][module][fileName].push(util.format(ALL_VIOLATIONS['MISSING_LINKS'].message, doclet.name.replace(/^#+/g, ''), 'TypeDef', typedef.longname));
                       }
                     }
                   });
                 }
                 else {
                   //TODO incorporate this later into the violation object
                   //logger.error("NO_SIGNATURE: %s::%s has no type signature", doclet.memberof, doclet.name);
                 }
               }
             }
           }
           else {
             // translation objects do not have class kind parent
             if (doclet.meta.filename.indexOf('ojtranslations.js') < 0) {
               //TODO incorporate this later into the violation object
               //logger.warn("NO_CLASS_PARENT: %s from %s does not have a parent", doclet.name, doclet.meta.filename);
             }
           }
         }
       }
       else {
         //TODO incorporate this later into the violation object
         //logger.warn("NO_MEMBEROF: %s has no memberof", doclet.name);
       }
     }
   });

   // send to stdout the violations
   printViolations();
   // make the build fail if we found the TYPEDEF_IN_TYPE violation
   if (BUILD_STOP) {
     logger.error(new Error("JSDOC build failed. Check the log for more information"));
   }
 };

 //utility function to print the violation object in a consumable format
 //the violation messages are grouped by: violation code, module name, file belonging to the module, message
 function printViolations() {
   let violations = Object.keys(COLLECTED_VIOLATIONS).sort();
   violations.forEach(function (violation) {
     if (ALL_VIOLATIONS[violation].enabled) {
       let level = ALL_VIOLATIONS[violation].level;
       if (level === 'error') BUILD_STOP = true;
       if (level === env.opts.violationLevel.toLowerCase() || level === 'error') {
         printInColorForLevel(level, violation, 0);
         let moduleObj = COLLECTED_VIOLATIONS[violation];
         let modules = Object.keys(moduleObj).sort();

         modules.forEach(function (module) {
           printInColor(Color.FgGreen, '\\' + module, 2);
           let filesObj = moduleObj[module];
           let files = Object.keys(filesObj).sort();
           files.forEach(function (file) {
             printInColor(Color.FgCyan, ('|-' + file), 3);
             let messages = filesObj[file];
             messages.forEach(function (message) {
               printInColorForLevel(level, message, 6);
             });
           });
         });
       }
     }
   });
   // once violations are printed, clear the COLLECTED_VIOLATIONS structure
   COLLECTED_VIOLATIONS = {};
 };

 var Color = {};
 Color.Reset = "\x1b[0m";
 Color.Bright = "\x1b[1m";
 Color.Dim = "\x1b[2m";
 Color.Underscore = "\x1b[4m";
 Color.Blink = "\x1b[5m";
 Color.Reverse = "\x1b[7m";
 Color.Hidden = "\x1b[8m";

 Color.FgBlack = "\x1b[30m";
 Color.FgRed = "\x1b[31m";
 Color.FgGreen = "\x1b[32m";
 Color.FgYellow = "\x1b[33m";
 Color.FgBlue = "\x1b[34m";
 Color.FgMagenta = "\x1b[35m";
 Color.FgCyan = "\x1b[36m";
 Color.FgWhite = "\x1b[37m";

 Color.BgBlack = "\x1b[40m";
 Color.BgRed = "\x1b[41m";
 Color.BgGreen = "\x1b[42m";
 Color.BgYellow = "\x1b[43m";
 Color.BgBlue = "\x1b[44m";
 Color.BgMagenta = "\x1b[45m";
 Color.BgCyan = "\x1b[46m";
 Color.BgWhite = "\x1b[47m";

 function printInColorForLevel(level, text, indent) {
   let color = Color.FgWhite;
   let prefix = (indent == 0 ? "" : level.toLowerCase() + ": " || "");
   if (level.toLowerCase() === 'warning') {
     color = Color.FgYellow;
   } else if (level.toLowerCase() === 'error') {
     color = Color.FgRed;
   }
   if (prefix.length > 0)
     logger.info(color + ' '.repeat(indent) + prefix + Color.Reset + Color.FgWhite + '%s' + Color.Reset, text);
   else
     logger.info(color + ' '.repeat(indent) + '%s' + Color.Reset, text);
 };

 function printInColor(color, text, indent) {
   logger.info(color + ' '.repeat(indent) + '%s' + Color.Reset, text);
 };

 /**
  * A copyFileSync alternative to overcome some limitation this method poses when used in Node version 7 and beyond.
  * @param {string} source The source file jsdoc processes
  * @param {string} target The generated file
  */
 function copyFile(source, target) {
   var readStream = nodefs.createReadStream(source);
   readStream.on("error", (err) => {
     logger.error('Error while copying source file %s: %s', source, err.message);
   });
   var writeStream = nodefs.createWriteStream(target);
   writeStream.on("error", (err) => {
     logger.error('Error while writing generated file %s: %s', target, err.message);
   });
   writeStream.on("close", (ex) => { });
   readStream.pipe(writeStream);
 }

 /**
  * Wrapper class for the backdoor plumbing to ensure that we can generate meaningful module return information for the API Doc.
  * Modules can return a simple object or an "umbrella" object having properties referencing one or more object available in
  * the module.
  * @param {object} doclet The class or namespace doclet that needs to be updated with the ojmodulereturn property
  */
 function updateModuleReturn(doclet) {

   if (!doclet.ojcomponent) {
     try {
       checkModuleReturn("complex", doclet);
     }
     catch (NoSuchFileException) {
       try {
         checkModuleReturn("simple", doclet);
       }
       catch (NoSuchFileException) { }
     }
   }
 }

 /**
  * This function will check if the doclet is a direct return of the module (where the class lives) or is a member of a complex
  * object that's being returned by the module. In the first case, the return value of the module is in the module.end file
  * contained by the folder associated with the module. In the second scenario, the module folder contains a namespace.js file
  * that defines an "umbrella" object having one or more properties referencing classes available in the module.
  * @param {"complex"|"simple"} returnType The return type of the module.
  * @param {object} doclet The class or namespace doclet that needs to be updated with the ojmodulereturn property
  */
 var checkModuleReturn = function (returnType, doclet) {
   var moduleDir = doclet.meta.path;
   var className = doclet.name;
   var fileName = 'namespace.js';
   if (returnType === 'simple') {
     fileName = 'module.end';
   }
   var namespaceFile = path.join(moduleDir, fileName);
   nodefs.accessSync(namespaceFile);
   var content = nodefs.readFileSync(namespaceFile, 'UTF8');
   if (content && content.indexOf(className) > 0) {
     doclet.ojmodulereturn = returnType;
   }
 }
 // https://gist.github.com/dislick/914e67444f8f71df3900bd77ccec6091
 const convertSemverToInt32 = function (version) {
   // Split a given version string into three parts.
   let parts = version.split('.');
   // Check if we got exactly three parts, otherwise throw an error.
   if (parts.length !== 3) {
     throw new Error(`Received invalid version string: ${version}`);
   }
   // Make sure that no part is larger than 1023 or else it
   // won't fit into a 32-bit integer.
   parts.forEach((part) => {
     if (part >= 1024) {
       throw new Error(`Version string invalid, ${part} is too large`);
     }
   });
   // Let's create a new number which we will return later on
   let numericVersion = 0;
   // Shift all parts either 0, 10 or 20 bits to the left.
   for (let i = 0; i < 3; i++) {
     numericVersion |= parts[i] << i * 10;
   }
   return numericVersion;
 };
