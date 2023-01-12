/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Utility function that parses all the style classes, stylesets, style templates,
 * and style variables of a component and returns a tree like JSON structure.
 * The styleObj has the following shape
 * styleObj = {
 *    "classes": <array of style class doclets>,
 *    "sets": <array of style set doclets>,
 *    "templates": <array of style template doclets>,
 *    "tokens": <array of template tokens>,
 *    "variablesets" <array of style variable set doclets>
 * }; 
 * @param {object} styleObj 
 * @param {boolean} [false] sortResult By default in the resulting Array sets are coming first, followed by templates then classes. By setting this argument to true this can be reverted
 */
var getStylingItems =  function (styleObj, sortResult) {
  const STYLE_KINDS = {
    SET: "set",
    CLASS: "class",
    TEMPLATE: "template",
    VARIABLESET: "variableset",
    UNKNOWN: "unknown"
  };

  const _sortById = function(a, b) {
    var aid = a.id;
    var bid = b.id;
    return (aid < bid) ? -1 : (aid > bid) ? 1 : 0;
  }

  // this is the style object containing classes, sets, templates, and variables
  var data = styleObj;
  
  // we need to process first the style sets. By doing this we can remove the styleclasses from the array of all styleclasses and render
  // these under their category/set. 
  
  //this will be the final object that we are returning from this method
  let finalStylingItems = {};
  finalStylingItems.styleClasses = [];
  finalStylingItems.styleVariableSets = [];

  var styleClasses = (Array.isArray(data.classes) ? data.classes.slice(0) : []);
  styleClasses.sort(_sortById);

  var styleTemplates = (Array.isArray(data.templates) ? data.templates.slice(0) : []);
  styleTemplates.sort(_sortById);

  var styleSets = (Array.isArray(data.sets) ? data.sets.slice(0) : []);
  styleSets.sort(_sortById);

  var templateTokens = (Array.isArray(data.tokens) ? data.tokens.slice(0) : []);
  templateTokens.sort(_sortById);

  var styleVariableSets = (Array.isArray(data.variablesets) ? data.variablesets.slice(0) : []);
  styleVariableSets.sort(_sortById);

  /**
   * Finds and removes a doclet from an Array of doclet objects based on the doclet id and the id type
   * @param {string} idToFind The id to search for
   * @param {string} idType The key in the doclet object that functions as the ID
   * @param {Array<object>} arrayToSearch The array of doclet objects to search for
   * @returns {Object|undefined} the doclet object or undefined
   */
  const _findAndRemoveStylingItem = function (idToFind, idType, arrayToSearch) {
    let idx = arrayToSearch.findIndex(item => item[idType] === idToFind);
    let foundDoclet = arrayToSearch[idx];
    if (idx >= 0) {
      arrayToSearch.splice(idx, 1);
    }
    return foundDoclet;
  };
  /**
   * Finds and removes an array of direct child doclets of a given parent doclet identified by an id and the id type
   * @param {string} idToFind The id of the parent object
   * @param {string} idType The key in the doclet object that functions as the ID
   * @param {Array<object>} arrayToSearch The array of doclet objects to search for
   * @returns {Array<oject>} the immediate child doclets of a parent doclet 
   */
  const _findAndRemoveChildren = function (idToFind, idType, arrayToSearch) {
    let children = [];

    for (let i = arrayToSearch.length - 1; i >= 0; i--){
      let item = arrayToSearch[i];
      let idkindArr = item[idType].split('.');
      // last one is our child obj name
      idkindArr.pop();
      // the rest is the parent so compare
      if (idkindArr.join('.') === idToFind) {
        children.push(arrayToSearch.splice(i, 1)[0]);
      }
    }

    return children;
  };
  /**
   * Finds, removes and returns a specific kind of style class doclet from the available array of style doclets.
   * @param {*} idToFind The doclet id to search for
   * @param {*} idType The type of the id we are using for searching the doclet (id, or name)
   */
  const _getStyleDocletAndType = function(idToFind, idType){
    let retObj = {kind: STYLE_KINDS.UNKNOWN};
    let doclet;
    if (doclet = _findAndRemoveStylingItem(idToFind, idType, styleClasses)){
      retObj.kind = STYLE_KINDS.CLASS;
    }
    else if (doclet = _findAndRemoveStylingItem(idToFind, idType, styleTemplates)){
      retObj.kind = STYLE_KINDS.TEMPLATE;
    }
    else if (doclet = _findAndRemoveStylingItem(idToFind, idType, styleSets)){
      retObj.kind =  STYLE_KINDS.SET;
    }
    else if (doclet = _findAndRemoveStylingItem(idToFind, idType, styleVariableSets)){
      retObj.kind = STYLE_KINDS.VARIABLESET;
    }

    retObj.doclet =  doclet;

    return retObj;
  }

  /**
   * Returns the substitution tokens used by a given template doclet
   * @param {object} template 
   */
  const _getTemplateTokens = function(template){
    let tokens = [];
    const getTokenValues = function(tokenDoclet){
      let ojvalues = tokenDoclet.ojvalues;
      let tokenValues = [];
      
      if (Array.isArray(ojvalues)){
        //sort only if ojvalueskeeporder tag is not specified
        if (!tokenDoclet.ojvalueskeeporder){
          ojvalues.sort(function(val1, val2){
            var v1 = val1.name;
            var v2 = val2.name;
            v1 = v1.replace(/\"/g,'');
            v2 = v2.replace(/\"/g,'');
            return (v1 < v2) ? -1 : (v1 > v2) ? 1 : 0;
          });
        }

        ojvalues.forEach(value => {
          let clone = {};
          clone.name = value.name;
          clone.displayName = value.displayName || value.name;
          clone.description = value.description || value.name;
          if (value.tsdeprecated){
            clone.tsdeprecated = value.tsdeprecated;
          }
          tokenValues.push(clone);
        })
      }
      
      return tokenValues;
    };

    if (template && template.ojstyletemplatetokens){
      template.ojstyletemplatetokens.forEach( qualifiedTokenName => {
        let foundDoclet = templateTokens.find(tokendoclet => {
          return (tokendoclet.longname === qualifiedTokenName);
        });
        if (foundDoclet){
          tokens.push({
            id: foundDoclet.id, 
            name: foundDoclet.name, 
            description: foundDoclet.description || "",
            styleRelation: foundDoclet.ojstylerelation || "exclusive", 
            displayName: foundDoclet.ojdisplayname || foundDoclet.id, 
            values: getTokenValues(foundDoclet) });
        }
      });
    }
    
    return tokens;
  }

  const _handleStyleRelationError = function(childDoclet, styleSetDoclet){
    //throw an error if children of a set that already set the stylerelation also have this property set
    if (styleSetDoclet.ojstylerelation && childDoclet.ojstylerelation){
      throw new Error(`Style doclet ${childDoclet.id} cannot override the ojstylerelation property of it's parent ${styleSetDoclet.id}`);
    }
  }
  const _sortingFunc = (a, b) => {
    let kindA = a.kind;
    let kindB = b.kind;
    if (kindA === kindB) return 0;
    else{
      if (kindA === 'class') return -1;
      if (kindA === 'template'){
        if (kindB === 'class') return 1;
        else return -1;
      }
      if (kindA === 'set') return 1;
    }
  };
  
  const sortFinalResult = function(inputArr){
    if (Array.isArray(inputArr))
    {
      inputArr.sort(_sortingFunc);
      inputArr.forEach(obj => {
        if (obj.kind === STYLE_KINDS.SET && obj.styleItems){
          sortFinalResult(obj.styleItems);
        }
      })
    }
  }

  /**
   * Recursive call to process a given style set and it's immediate children. As a styleset is processed it is removed from the 
   * starting sets Array. At the end of processing all stylesets, the sets array should be empty.
   * @param {*} styleset The current styleset being processed
   * @param {*} sets The array of stylesets we started with
   * @param {*} childItemsArr An array of child objects belinging to this styleset. Can be another set, a style class or a style template
   */
  const _processSet = function (styleset, sets, childItemsArr) {
    let items = styleset.ojstylesetitems;
    // check ojstyleitems. if we have styleitems, try to find (search the styleClasses, styleSets and styleTemplates arrays) them and once 
    // they are  found:
    //   1. if its another set: 
    //      1.1 remove that set from sets and call _processSet recursively
    //   2. it it's a styleClass
    //      2.1 add that to the Array of child doclet objects associated with this set
    //   3. it it's a styleTemplate
    //      3.1 add that to the Array of child doclet objects associated with this set
    if (Array.isArray(items)) {
      items.forEach(item => {
        let docletAndType = _getStyleDocletAndType(item, 'id');
        let foundDoclet = docletAndType.doclet;
        
        if (docletAndType.kind === STYLE_KINDS.SET){
          let _childObj = {};
          _childObj.id = foundDoclet.id;
          _childObj.kind = STYLE_KINDS.SET;
          _childObj.doclet = foundDoclet;
          _childObj.styleItems = [];
          childItemsArr.push(_childObj)
          _processSet(foundDoclet, sets, _childObj.styleItems);
        }
        else {
          _handleStyleRelationError(foundDoclet, styleset);

          if (docletAndType.kind === STYLE_KINDS.TEMPLATE){
            let tokens = _getTemplateTokens(foundDoclet);
            childItemsArr.push({ id: foundDoclet.id, kind: STYLE_KINDS.TEMPLATE, tokens: tokens, doclet: foundDoclet });
          }
          else if (docletAndType.kind === STYLE_KINDS.CLASS){
            childItemsArr.push({ id: foundDoclet.id, kind: STYLE_KINDS.CLASS, doclet: foundDoclet });
          }
          else{
            throw new Error(`Found JSDOC style doclet with unexpected kind: ${item}`);
          }
        }
      });
    }
    else {
      // we need to find any child doclet that is a direct child of this set (will use the id that is fully qualified
      // we will filter class and template arrays and remove those child doclets belonging to this set and will add to 
      // the children of this sets.
      // for sets we will process them recursively 
      let foundChildDoclets;

      foundChildDoclets = _findAndRemoveChildren(styleset.id, 'id', sets);
      while (foundChildDoclets.length) {
          let set = foundChildDoclets.shift();
          let setObj = {};
          setObj.id = set.id;
          setObj.kind = STYLE_KINDS.SET;
          setObj.doclet = set;
          setObj.styleItems = [];
          childItemsArr.push(setObj);
          _processSet(set, sets, setObj.styleItems);
      }

      foundChildDoclets = _findAndRemoveChildren(styleset.id, 'id', styleTemplates);
      foundChildDoclets.forEach(template => {
        _handleStyleRelationError(template, styleset);
        let tokens = _getTemplateTokens(template);
        childItemsArr.push({ id: template.id, kind: STYLE_KINDS.TEMPLATE, tokens: tokens, doclet: template })
      });

      foundChildDoclets = _findAndRemoveChildren(styleset.id, 'id', styleClasses);
      foundChildDoclets.forEach(styleclass => {
        _handleStyleRelationError(styleclass, styleset);
        childItemsArr.push({ id: styleclass.id, kind: STYLE_KINDS.CLASS, doclet: styleclass })
      });
    }
  };

  while (styleSets.length) {
    let set = styleSets.shift();
    let setObj = {};
    setObj.id = set.id;
    setObj.kind = STYLE_KINDS.SET;
    setObj.doclet = set;
    setObj.styleItems = [];
    finalStylingItems.styleClasses.push(setObj);
    _processSet(set, styleSets, setObj.styleItems);
  }
  // at this point we processed all sets and all classes, templates that belong to sets
  // add the remaining style classes and style templates
  styleTemplates.forEach(template => {
    let tokens = _getTemplateTokens(template);
    finalStylingItems.styleClasses.push({ id: template.id, kind: STYLE_KINDS.TEMPLATE, tokens: tokens, doclet: template })
  });
  styleClasses.forEach(item => finalStylingItems.styleClasses.push({ id: item.id, kind: STYLE_KINDS.CLASS, doclet: item }));

  // if we want to sort first classes, then templates then sets...
  if (sortResult) {
    sortFinalResult(finalStylingItems.styleClasses);
  }
  
  // finally, process any style variables
  styleVariableSets.forEach(variableset => finalStylingItems.styleVariableSets.push({ id: variableset.id, kind: STYLE_KINDS.VARIABLESET, doclet: variableset}));

  return finalStylingItems;
};
module.exports = {getStylingItems: getStylingItems};