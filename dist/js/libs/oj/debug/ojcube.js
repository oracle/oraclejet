/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'promise', 'ojs/ojdatasource-common'], function(oj, $)
{
/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/


/**
 * @class oj.Cube 
 * @classdesc Functions implemented by oj.DataColumnCube and oj.DataValueAttributeCube
 * @see oj.DataColumnCube
 * @see oj.DataValueAttributeCube
 * @since 1.1.0
 */

/**
 * @constructor
 * @export
 * @private
 */
 oj.Cube = function(rowset, layout)
{
    this.Init();
    
    // Wrap the incoming data in the appropriate interface
    this._rows = rowset;
    this._layout = /** @type {Array.<{axis,levels}>} */ (layout);

    this.BuildCube();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.Cube, oj.Object, "oj.Cube");

/**
 * Initializes instance with the set options
 * @private
 */
oj.Cube.prototype.Init = function() 
{
  oj.Cube.superclass.Init.call(this);
};

/**
 * Get the oj.CubeAxis objects in this cube
 * @return {Array} an array of oj.CubeAxis objects
 * @export
 */
oj.Cube.prototype.getAxes = function() {
    // Generate axes list as union of subcube axes for particular page + page axes
    var cube = this._getPinnedCube();
    var axes = [];
    Array.prototype.push.apply(axes, cube ? cube.getAxes() : this._axes);
    // Add on the page axes
    for (var i = 2; i < this._axes.length; i++) {
        axes.push(this._axes[i]);
    }
    return axes;
};

oj.Cube.prototype._getNonPageLayout = function() {
    return this._axes;
};
 
/**
 * Get oj.CubeDataValues from this cube.  These represent the values of the data in the "body" of the cube
 *
 * @param {Array} indices an axis-ordered array of Objects or numbers.  If Objects, each should contain a 'start' property
 * (the zero based start index for the axis) and a 'count' representing the number of data values beginning at 'start' to return on this axis. 
 * This format allows the retrieval of a block of data.  Passing an array of numbers alone is equivalent to passing {start:<index>, count:1} and getting a single
 * oj.CubeDataValue
 * @return {Array|Object} either an array of arrays of oj.CubeDataValue, depending on the number of values requested in indices, or a single oj.CubeDataValue
 *                        The first subscript represents the 0th axis' values, and so on.
 * @export
 */
oj.Cube.prototype.getValues = function(indices) {
    // Get pinned cube
    var cube = this._getPinnedCube();
    
    // Normalize the argument to be objects with start/count properties
    var ind = cube._normalizeIndices(indices);

    var origRet = cube._walkIndex(ind, 0, [], []);
    var val = origRet;
    // Unpack single values tucked in arrays
    while (Array.isArray(val) && val.length === 1) {
        val = val[0];
        if (!Array.isArray(val)) {
            // Found an object in the middle--return it
            return val;
        }
    }
    return origRet;
};

/**
 * Set a pinned index for all axes above axis 1 ("pages")
 * @param {Array} pin an array of objects containing an integer 'axis' attribute and its corresponding 'index' value (to which to pin the cube)
 */
oj.Cube.prototype.setPage = function(pin) {
    // Make sure it's an array
    if (pin instanceof Array) {
        this._pin = pin;
    }
    else {
        this._pin = [pin];
    }
};
    
/**
 * 
 * @param {number} axisFrom the axis from which to move a level
 * @param {number} levelFrom the level within axisFrom to move to axisTo/levelTo (zero is slowest/outermost)
 * @param {number} axisTo the axis to which to move levelFrom
 * @param {number} levelTo the level within axisTo to move the levelFrom level (zero is slowest/outermost)
 * @param {oj.Cube.PivotType} type the type of pivot to perform
 * @returns {boolean} true if successful
 * @export
 */
oj.Cube.prototype.pivot = function(axisFrom, levelFrom, axisTo, levelTo, type) {
    var layout = this._layout;
    var axisFromObj = this._findAxisInLayout(axisFrom);
    // No from axis found: can't pivot
    if (!axisFromObj) {
        return false;
    }
    var axisToObj = null;
    if (axisTo < layout.length) {
        axisToObj = this._findAxisInLayout(axisTo);
    }
    else {
        // Add a new axis
        axisToObj = {'axis':axisTo, 'levels':[]};
        layout.push(axisToObj);
    }
    var levelsFrom = axisFromObj['levels'];
    var levelsTo = axisToObj['levels'];
    var levelFromObj = levelFrom < levelsFrom.length ? levelsFrom[levelFrom] : null;
    // No from level here, can't pivot
    if (!levelFromObj) {
        return false;
    }
    
    // Find where to move 
    if (levelTo >= levelsTo.length) {
        // beyond end--just add it.  after, before, swap doesn't matter
        levelsTo.push(levelFromObj);
        // Remove it from the old location
        levelsFrom.splice(levelFrom, 1);
    }
    else {
        if (type === oj.Cube.PivotType['SWAP']) {
            // Swap the elements
            levelsFrom[levelFrom] = levelsTo[levelTo];
            levelsTo[levelTo] = levelFromObj;
        }
        else {
            if (type === oj.Cube.PivotType['AFTER']) {
                // Splice operates as a "before" loc
                levelTo++;
            }
            // Insert the from obj into the to
            levelsTo.splice(levelTo, 0, levelFromObj);
            if (levelsTo === levelsFrom && levelTo < levelFrom) {
                // Relocate the from location, because the to splice shifted it (the from was in the same axis as the to, and was after the to)
                levelFrom++;
            }
            
            // On a move, remove the from object from the old axis
            levelsFrom.splice(levelFrom, 1);
        }
    }
    
    // Rebuild using the altered layout
    this.BuildCube();
    return true;
};

// Return the entry in the layout arg that represents axis #
oj.Cube.prototype._findAxisInLayout = function(axis) {
    for (var i = 0; i < this._layout.length; i++) {
        if (this._layout[i]['axis'] === axis) {
            return this._layout[i];
        }
    }
    return null;
};
    
/**
 * Return the current layout used to build the cube
 * 
 * @returns {Array} current layout
 * @see oj.Cube
 * @export
 */
oj.Cube.prototype.getLayout = function() {
    return this._layout;
};

/**
 * Valid pivot types
 * @enum {string}
 * @export
 */
oj.Cube.PivotType = {
    /**
     * Move the from location before the to location
     */
    'BEFORE' : "before",
    /**
     * Move the from location after the to location
     */
    'AFTER' : "after",
    /**
     * Exchange the from location with the to location
     */
    'SWAP' : "swap"    
};


oj.Cube.prototype._walkIndex = function(indices, depth, location, returnValue) {
   if (indices.length === 0) {
       // Get the current value at location
       var loc = location.slice(0);
       //loc.reverse();
       return this._getValue(loc);
   }
   else {
       var remaining = indices.slice(1);
       var start = indices[0].start;
       var count = indices[0].count;
       for (location[depth] = start; location[depth] < start+count; location[depth]++) {
           returnValue.push(this._walkIndex(remaining, depth+1, location, []));
       }
   }
   return returnValue;
};

// Make sure all start/count data is filled in and within range
oj.Cube.prototype._normalizeIndices = function(indices) {
    var ind = [];
    if (!indices) {
        return ind;
    }
    var numAxes = Math.min(indices.length, this._axes.length);
    for (var a = 0; a < numAxes; a++) {        
        var index = indices[a];
        if (index instanceof Object && (index.hasOwnProperty('start') || index.hasOwnProperty('count'))) {
            if (index.hasOwnProperty('start')) {
                if (index.hasOwnProperty('count')) {
                    ind.push(this._generateIndex(index.start, index.count, a));
                }
                else {
                    ind.push(this._generateIndex(index.start, 1, a));
                }
            }
            else {
                // Must have count
                ind.push(this._generateIndex(0, index.count, a));
            }
        }
        else {
            // Convert the number to an object
            ind.push(this._generateIndex(index, 1, a));
        }
    }
    return ind;
};
    
oj.Cube.prototype._generateIndex = function(start, count, axis) {
    // Get true count
    var trueCount = this.getAxes()[axis].getExtent();
    
    if (start >= trueCount || start < 0) {
        start = 0;
    }
    count = Math.min(count,trueCount-start);
            
    return {start: start, index: start, count: count};
};

oj.Cube.prototype._getValue = function(indices) {
    // indices is just an axis-ordered array of locations for which to get the value
    // Should only be one--only one data value here
    var key = this._createCubeKeys(indices);
    if (key) {
        var hash = key.GetHashCodes();
        if (hash.length > 0) {
            var obj = this._data[hash[0].key];
            if (obj) {
                return new oj.CubeDataValue(obj.value, indices, obj.aggType, obj.rows, obj.square);
            }
        }
    }
    return new oj.CubeDataValue(null, indices, undefined, []);
};
    
// Generate the axes from the layout
oj.Cube.prototype.GenerateAxes = function() {    
    var pageLayout = this._getPageLayout();
    // If we have pages--only generate those for this cube, and set up the default 0th pin    
    this._pin = [];
    for (var i = 0; i < pageLayout.length; i++) {
        this._getAxis(pageLayout[i]['axis'], pageLayout[i]['levels']);
        this._pin.push({'axis':pageLayout[i]['axis'], 'index':0});
    }
    if (pageLayout.length === 0) {
        // Do remaining axes if any (row and column)
        var nonPageLayout = this._getNonPageLayout();
        for (var i = 0; i < nonPageLayout.length; i++) {
            this._getAxis(nonPageLayout[i]['axis'], nonPageLayout[i]['levels']);
        }
    }
};

oj.Cube.prototype._getPageLayout = function() {
    var pageOnlyLayout = [];
    for (var i = 0; i < this._layout.length; i++) {
        var axis = this._layout[i]['axis'];
        if (axis > 1) {
            pageOnlyLayout.push(this._layout[i]);
        }
    }
    return pageOnlyLayout;
};

oj.Cube.prototype._getNonPageLayout = function() {
    var nonPageLayout = [];
    for (var i = 0; i < this._layout.length; i++) {
        var axis = this._layout[i]['axis'];
        if (axis < 2) {
            nonPageLayout.push(this._layout[i]);
        }
    }
    return nonPageLayout;
};

oj.Cube.prototype.BuildCube = function() {
    this._axes = [];
    
    // Associative array for data
    this._data = [];
    
    // Associative array for cubes
    this._cubes = [];
    
    this.GenerateAxes();
    
    // Can start a cube with no data--add on from "parent"
    if (this._rows === null) {
        return;
    }
        
    // Walk each line of the rowset, and distribute its attributes to the axes and the data store
    for (var row = 0; row < this._rows.length; row++) {
        // Generate a "page key"
        var pageKey = new oj.CubeKeys();
        for (var axis = 2; axis < this._axes.length; axis++) {
            pageKey = this._axes[axis].ProcessRow(this._rows[row], pageKey);
        }
        // Grab the data value from the page if it's there
        var pageHashObj = pageKey.GetHashCodes();
        // See if we have a cubes for these pageKeys
        for (var ph = 0; ph < pageHashObj.length; ph++) {
            var pageHash = pageHashObj[ph].key;
            var cube = this._cubes[pageHash];
            if (!cube) {
                // Generate a new one
                cube = this._cubes[pageHash] = this.GenerateCube(this._getNonPageLayout());
            }
            // Send the row through the lower axes
            var keys = new oj.CubeKeys();
            var maxAxes = cube._axes.length;
            for (var axis = 0; axis < maxAxes; axis++) {
                keys = cube._axes[axis].ProcessRow(this._rows[row], keys);
            }
            // Convert the retrieved keys->data into data storage
            var hash = keys.GetHashCodes();
            // Must account for data value coming from page, possibly...pass in the hash that has the data
            var dataHash = hash;
            if (pageHashObj[ph].dataValue !== undefined) {
                dataHash = [];
                // Must be in an array
                for (var h = 0; h < hash.length; h++) {
                    dataHash.push(pageHashObj[ph]);
                }
            }
            cube._storeData(hash, dataHash, this._rows[row]);
        }
    }
};

oj.Cube.prototype._storeData = function(hash, dataHash, row) {
    for (var i = 0; i < hash.length; i++) {
        this._data[hash[i].key] = this._aggregate(dataHash[i], this._data[hash[i].key], row);
    }
};


oj.Cube.prototype._getPinnedCube = function() {
    return this._cubes[this._getHashFromPin(this._pin)];
};
        
oj.Cube.prototype._getHashFromPin = function(pin) {
    var keys = new oj.CubeKeys();
    if (pin && pin.length > 0) {
        // Sort by axis attribute
        pin.sort(function(a,b) {
            return a['axis'] - b['axis'];
        });
        // Translate the axis/index pin to hash key
        var axes = this._axes;
        for (var i = 0; i < pin.length; i++) {
            keys = axes[pin[i]['axis']].GetCubeKeys(pin[i]['index'], keys);
        }
    }
    return keys.GetHashCodes()[0].key;
};
    
oj.Cube._isValid = function(value) {
    if (value) {
        return value.value !== undefined && value.value !== null;
    }
    return false;
};

oj.Cube.prototype._createAggValue = function(value, aggType, rows, row, props) {
    rows.push(row);
    var retObj = {};
    for (var p in props) {
        if (props.hasOwnProperty(p)) {
            retObj[p] = props[p];
        }
    }
    retObj.value = value;
    retObj.aggType = aggType;
    retObj.rows = rows;
    return retObj;
};

// Don't treat strings as numbers, ever
oj.Cube._isNumber = function(value) {
    if (oj.StringUtils.isString(value.value)) {
        return false;
    }
    // String versions of numbers return false for isNaN--we want to treat them as non numbers always
    return !isNaN(value.value);
};

oj.Cube.prototype._aggregate = function(hash, currValue, row) {
    var aggObj = this.GetAggType(hash.dataValue);
    var aggType = /** @type {Object} */(aggObj.aggregation);
    var validCurr = oj.Cube._isValid(currValue);
    var validHash = oj.Cube._isValid(hash);
    var isNumCurr = validCurr && oj.Cube._isNumber(currValue);
    var isNumHash = validHash && oj.Cube._isNumber(hash);
    switch (aggType) {
        case oj.CubeAggType['SUM']:            
            if (validCurr && validHash) {
                if (isNumCurr && isNumHash) {
                    return this._createAggValue(currValue.value + hash.value, aggType, currValue.rows, row, {});
                }
                return this._createAggValue(NaN, aggType, currValue.rows, row, {});
            }
            if (validHash && !validCurr) {
                if (isNumHash) {
                    return this._createAggValue(hash.value, aggType, [], row, {});
                }
                return this._createAggValue(NaN, aggType, [], row, {});
            }
            return currValue;
        case oj.CubeAggType['AVERAGE']:
            if (validCurr && validHash) {
                if (isNumCurr && isNumHash) {
                    return this._createAggValue((currValue.sum + hash.value) / (currValue.rows.length+1), aggType, currValue.rows, row, {sum:(currValue.sum + hash.value)});
                }
                return this._createAggValue(NaN, aggType, currValue.rows, row, {sum:currValue.sum});
            }
            if (validHash && !validCurr) {
                if (isNumHash) {
                    return this._createAggValue(hash.value, aggType, [], row, {sum:hash.value});
                }
                return this._createAggValue(NaN, aggType, [], row, {sum:NaN});
            }
            return currValue;
        case oj.CubeAggType['VARIANCE']:
        case oj.CubeAggType['STDDEV']:
            if (validCurr && validHash) {
                if (isNumCurr && isNumHash) {
                    var newCount = currValue.rows.length+1;
                    var avg = currValue.value + (hash.value - currValue.value) / newCount;
                    return this._createAggValue(avg, aggType, currValue.rows, row, {square:(currValue.square + (hash.value - currValue.value) * (hash.value - avg))});
                }
                return this._createAggValue(NaN, aggType, currValue.rows, row, {square:NaN});
            }
            if (validHash && !validCurr) {
                if (isNumHash) {
                    return this._createAggValue(hash.value, aggType, [], row, {square:0});
                }
                return this._createAggValue(NaN, aggType, [], row, {square:NaN});
            }
            return currValue;
        case oj.CubeAggType['NONE']:
            return this._createAggValue(null, aggType, validCurr ? currValue.rows : [], row, {});
        case oj.CubeAggType['FIRST']:
            if (validCurr) {
                return this._createAggValue(currValue.value, aggType, currValue.rows, row, {});
            }
            if (validHash) {
                return this._createAggValue(hash.value, aggType, [], row, {});
            }
            return currValue;
        case oj.CubeAggType['MIN']:
            if (validCurr && validHash) {
                if (isNumCurr && isNumHash) {
                    return this._createAggValue(Math.min(currValue.value, hash.value), aggType, currValue.rows, row, {});
                }
                return this._createAggValue(NaN, aggType, currValue.rows, row, {});
            }
            if (validHash && !validCurr) {       
                if (isNumHash) {
                    return this._createAggValue(hash.value, aggType, [], row, {});
                }
                return this._createAggValue(NaN, aggType, [], row, {});
            }
            return currValue;
        case oj.CubeAggType['MAX']:
            if (validCurr && validHash) {
                if (isNumCurr && isNumHash) {
                    return this._createAggValue(Math.max(currValue.value, hash.value), aggType, currValue.rows, row, {});
                }
                return this._createAggValue(NaN, aggType, currValue.rows, row, {});
            }
            if (validHash && !validCurr) {       
                if (isNumHash) {
                    return this._createAggValue(hash.value, aggType, [], row, {});
                }
                return this._createAggValue(NaN, aggType, [], row, {});
            }
            return currValue;
        case oj.CubeAggType['COUNT']:
            if (validCurr && validHash) {
                return this._createAggValue(currValue.value+1, aggType, currValue.rows, row, {});
            }
            if (validHash && !validCurr) {
                return this._createAggValue(1, aggType, [], row, {});
            }
            return currValue;
        case oj.CubeAggType['CUSTOM']:
            var callback = aggObj.callback;
            var val = callback.call(this, validCurr ? currValue.value : undefined, validHash ? hash.value : undefined);
            return this._createAggValue(val, aggType, validCurr ? currValue.rows : [], row, {});
    }
};

// Get or create the given axis
oj.Cube.prototype._getAxis = function(axis, levels) {
    if (axis >= this._axes.length) {
        // Must add on enough to cover
        var newElems = new Array(axis-this._axes.length+1);
        Array.prototype.push.apply(this._axes, newElems);
    }

    // Initialize it if blank
    if (!this._axes[axis]) {
        this._axes[axis] = new oj.CubeAxis(levels, axis, this);
    }
    
    return this._axes[axis];
};


// Create a key object from an axis-ordered array of slowest-to-fastest arrays of CubeAxisValues
oj.Cube.prototype._createCubeKeys = function(indices) {
    var axes = this.getAxes();
    var keys = new oj.CubeKeys();
    for (var a = 0; a < indices.length; a++) {
        keys = axes[a].GetCubeKeys(indices[a], keys);
    }
    return keys;
};
    
    
oj.Cube.prototype.ProcessLevel = function(levels, levelNum, currNode, row, keys, addKeys) {
    oj.Assert.failedInAbstractFunction();
};

oj.Cube.prototype.GenerateCube = function(layout) {
    oj.Assert.failedInAbstractFunction();
};

oj.Cube.prototype.GenerateLevel = function(level, axis) {    
    oj.Assert.failedInAbstractFunction();    
};

/**
 * @param {Object} dataValue
 * @returns {Object}
 * @private
 */
oj.Cube.prototype.GetAggType = function(dataValue) {
    oj.Assert.failedInAbstractFunction();
    return {};
};
/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/

/**
 * @class oj.CubeAggType
 * @classdesc Valid aggregation types
 * @since 1.1.0
 * @export
 */
oj.CubeAggType = {
    /**
     * Sum the values
     */
    'SUM' : "sum",
    /**
         * Average the values
     */
    'AVERAGE' : "avg",
    /**
     * Calculate the standard deviation of the values
     */
    'STDDEV' : "stddev",
    /**
     * Calculate the variance of the values
     */
    'VARIANCE' : "variance",
    /**
     * Substitute a null for the value
     */
    'NONE' : "none",
    /**
     * Substitute the first value encountered
     */
    'FIRST' : "first",
    /**
     * Calculate the minimum of the values
     */
    'MIN' : "min",
    /**
     * Calculate the maximum of the values
     */
    'MAX' : "max",
    /**
     * Count the values
     */
    'COUNT' : "count",
    /**
     * Specify a custom callback function to do the aggregation
     */
    'CUSTOM': "custom"
};
 
/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/

/**
 * @class oj.CubeAxisValue 
 * @classdesc Represents one value within an axis header
 * @see oj.CubeAxis
 * @since 1.1.0
 */

/**
 * Represents one value within an axis header
 * @constructor
 * @export
 * @private
 */
oj.CubeAxisValue = function(value, label, level, parent) {
    this.Init();
    this._children = [];
    this._parent = parent;
    this._cubeLevel = level;
    this._data = {};    
    this._data.value = value;
    this._data.label = label;
};
 
// Subclass from oj.Object 
oj.Object.createSubclass(oj.CubeAxisValue, oj.Object, "oj.CubeAxisValue");

/**
 * Initializes instance with the set options
 * @private
 */
oj.CubeAxisValue.prototype.Init = function() 
{
  oj.CubeAxisValue.superclass.Init.call(this);
}; 

/**
 * Get the {@link oj.CubeLevel} of which this value is a member
 * @return {oj.CubeLevel} the level to which this header value belongs
 * @export
 */
oj.CubeAxisValue.prototype.getLevel = function() {
    return this._cubeLevel;
};
 
/**
 * Get the number of levels this header value spans
 * @return {number} the number of levels this header value spans.  Typically one, but in the future something like a grand total may span all the available levels at a particular
 *                  axis value location
 * @export
 */
oj.CubeAxisValue.prototype.getDepth = function() {
    return 1;
};
 
/**
 * Get the parent oj.CubeAxisValues of this value
 * @return {Array} an array of oj.CubeAxisValues--all the slower-varying level axis values under which this value is grouped
 * @export
 */
oj.CubeAxisValue.prototype.getParents = function() {
    var parents = [];
    var parent = this._parent;
    // Add parents, don't add root
    while (parent && parent._parent) {
        parents.unshift(parent);
        parent = parent._parent;
    }
    return parents;
};
 
/**
 * Get an ordered list of the child oj.CubeAxisValues of this value, at the next level
 * @return {Array} an array of the children of this oj.CubeAxisValue
 * @export
 */
oj.CubeAxisValue.prototype.getChildren = function() {
    return this._children;
};

/**
 * Get the number of indices spanned by this value
 * @return {number} the number of indices spanned by this value
 * @export
 */
oj.CubeAxisValue.prototype.getExtent = function() {
    if (this._extent > -1) {
        return this._extent;
    }
    // Calculate it: add up all my children's extents--if there are none, my extent is one as I'm the innermost level
    if (!this._children || this._children.length === 0) {
        this._extent = 1;
    }
    else {
        this._extent = 0;
        for (var c = 0; c < this.getChildren().length; c++) {
            this._extent += this.getChildren()[c].getExtent();
        }
    }
    return this._extent;
};

/**
 * Get the starting index of this value within the axis
 * 
 * @return {number} the starting index of this value within the axis
 * @export
 */
oj.CubeAxisValue.prototype.getStart = function() {
    if (this._start > -1) {
        return this._start;
    }
    if (!this._parent) {
        // We're the root
        return 0;
    }
    // Add up all my earlier siblings' extents plus my parent's start--that's my start
    var start = this._parent.getStart();
    var currChild = this._parent._getPrevChild(this);    
    while (currChild) {
        start += currChild.getExtent();
        currChild = this._parent._getPrevChild(currChild);
    }
    this._start = start;
    return start;
};

/**
 * Get the actual value of this axis header location
 * @return {Object} the value at this location in the header
 * @export
 */
oj.CubeAxisValue.prototype.getValue = function() {
    return this._data.value;
};

/**
 * Get the label for this axis header location, if any.  If none, falls back to {@link getValue}
 * @returns {Object} the label for this axis header value
 * @export
 */
oj.CubeAxisValue.prototype.getLabel = function() {
    if (this._data.label) {
        return this._data.label;
    }
    return this.getValue();
};

// Return the axis value child with the level/value pair found in key
oj.CubeAxisValue.prototype.GetChild = function(key) {
    var childLevel = this._getChildLevel();
    if (childLevel === null) {
        return null;
    }
    
    if (childLevel.isDataValue()) {
        // Special case: the key is the value
        return this._getDataValueChild(key);
    }
    var levelAttr = childLevel['attribute'];
    // Do we have a key value for this?
    var val = key[levelAttr];
    if (val) {
        // Yes, see if any of the children have this value
        for (var c = 0; c < this._children.length; c++) {
            if (this._children[c].getValue() === val) {
                return this._children[c];
            }
        }
    }
    return null;
};

oj.CubeAxisValue.prototype._getDataValueChild = function(key) {
    for (var c = 0; c < this._children.length; c++) {
        var val = this._children[c].getValue();
        if (key.hasOwnProperty(val) && key[val] === val) {
            // found it
            return this._children[c];
        }
    }
    return null;
};

oj.CubeAxisValue.prototype._getChildLevel = function() {
    if (this._children && this._children.length > 0) {
        return this._children[0].getLevel();
    }
    return null;
};

// Return the axis value child at the given index
oj.CubeAxisValue.prototype.GetChildAt = function(index) {
  return this._findChild(index, 0, this._children.length - 1);
};

oj.CubeAxisValue.prototype._findChild = function(index, start, end) {
    if (start > end) {
            return null;
    }

    var mid = Math.floor((start + end) / 2);
    var value = this._children[mid];

    var valStart = value.getStart();
    if (valStart > index) {
          return this._findChild(index, start, mid-1);
    }
    if (valStart + value.getExtent() - 1 < index) {
        return this._findChild(index, mid+1, end);
    }
    return value;
}
    
// Add this value to the node if not already there; return either the new cube axis value or the one where it was found
oj.CubeAxisValue.prototype.AddNode = function(value, label, level) {
    // Check if this value is already in the child list
    for (var c = 0; c < this._children.length; c++) {
        if (this._children[c].getValue() === value) {
            // We already have this node: just return it so any other members below its level get put in the right place
            return this._children[c];
        }
    }
    // Not found: add a new child
    var newValue = new oj.CubeAxisValue(value, label, level, this);
    this._children.push(newValue);
    return newValue;
};

// Get a "hash value" for this axis value.  Format is levelAttr:value
oj.CubeAxisValue.prototype.GetHashCode = function() {
    var obj = {};
    obj[this.getLevel()['attribute']] = this.getValue();
    return obj;
};
    
// Return the child immediately preceding this one
oj.CubeAxisValue.prototype._getPrevChild = function(currChild) {
    for (var c = 0; c < this._children.length; c++) {
        if (this._children[c] === currChild) {
            // Found this child: see if there's a previous one
            if (c > 0) {
                return this._children[c-1];
            }
            // First child
            return null;
        }
    }
    // Not found
    return null;
};


/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/

/**
 * @class oj.CubeAxis
 * @classdesc Represents an axis (a collection of levels) in a cube.  There is a set of [oj.CubeAxisValues]{@link oj.CubeAxisValue} at each index within an axis, up to one per [oj.CubeLevel]{@link oj.CubeLevel} on the axis
 * @since 1.1.0
 */

/**
 * Represents an axis (a collection of levels) in a cube.  There is a set of oj.CubeAxisValues at each index within an axis,
 * up to one per oj.CubeLevel on the axis
 * @param {Array} levels array of levels, slowest to fastest, to put in this axis
 * @param {Number} axis the number of this axis
 * @param {oj.Cube} cube the cube on which to generate levels
 * 
 * @constructor
 * @export
 * @private
 */
oj.CubeAxis = function(levels, axis, cube) {
    this.Init();
    this['axis'] = axis;
    this._levels = [];
    for (var i = 0; i < levels.length; i++) {
        this._levels.push(cube.GenerateLevel(levels[i], this));
    }
    this._cube = cube;
    // Set up a root for the tree of axis values
    this._values = new oj.CubeAxisValue(null, null, null, null);
};
 
// Subclass from oj.Object 
oj.Object.createSubclass(oj.CubeAxis, oj.Object, "oj.CubeAxis");

/**
 * Initializes instance with the set options
 * @private
 */
oj.CubeAxis.prototype.Init = function() 
{
  oj.CubeAxis.superclass.Init.call(this);
};

/**
 * Gets an ordered list (slowest to fastest varying) of all the levels represented within the axis.  Some indices along the axis may not be represented by
 * every level
 * @return {Array} an ordered array of {@link oj.CubeLevel}
 * @export
 */
oj.CubeAxis.prototype.getLevels = function() {
    return this._levels;
};
 
/**
 * Gets the total number of indices (data value locations) along this axis
 * @return {number} the total number of indices along the axis
 * @export
 */
oj.CubeAxis.prototype.getExtent = function() {
    return this._values.getExtent();
};
 
/**
 * Get the {@link oj.CubeAxisValue} objects at the given index, one for each level represented at this index within the axis.  Note that the number of oj.CubeAxisValues
 * returned may not match the overall oj.CubeLevel count on the axis
 * @param index {number} index for which to get the oj.CubeAxisValues
 * @return {Array} the ordered list of oj.CubeAxisValues at this index (slowest to fastest varying).
 * @export
 */
oj.CubeAxis.prototype.getValues = function(index) {
    var values = [];
    var node = this._values;
    while (node) {
        node = node.GetChildAt(index);
        if (node) {
            values.push(node);
        }
    }
    return values;
};

/**
 * Return the index of the given key within the axis.  Return -1 if not found.
 * 
 * @param {string} key
 * @returns {number} index of value found using key, -1 if not found
 * @export
 */
oj.CubeAxis.prototype.getIndex = function(key) {
    var keyVal = key ? JSON.parse(key) : {};
        
    var node = this._values;
    var lastNode = null;
    while (node) {
        lastNode = node;
        node = node.GetChild(keyVal);
    }
    return lastNode ? lastNode.getStart() : -1;
};

/**
 * @desc This axis' number
 * 
 * @type Number
 * @export
 */
oj.CubeAxis.prototype.axis;


// Retrieve the hash code for the values at a given index
oj.CubeAxis.prototype.GetCubeKeys = function(index, keys) {
    return this.GetPartialCubeKeys(index, this.getLevels().length-1, keys);
};

// Get the cube keys down to a particular level
oj.CubeAxis.prototype.GetPartialCubeKeys = function(index, level, keys) {
    var values = this.getValues(index);
    var stopLevel = this.getLevels()[level];
    for (var v = 0; v < values.length; v++) {
        var val = values[v];
        if (val.getLevel().isDataValue()) {
            keys.AddDataValue(val.getValue());
        }
        else {
            keys.UpdateKeys(val);
        }
        // Have we hit the stop level?
        if (val.getLevel() === stopLevel) {
            break;
        }
    }    
    return keys;
};


// Distribute contents of row to this axis according to the layout, etc.
oj.CubeAxis.prototype.ProcessRow = function(row, keys) {
    // Go over the levels--obtain a set of keys representing cell locations and data values of those intersections
    return this._cube.ProcessLevel(this, 0, this._values, row, keys, true);
};




/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/

/**
 * @class oj.CubeDataValue 
 * @classdesc Objects returned by oj.Cube.getValues and representing a single cell within the cube's data body.
 * @see oj.Cube#getValues
 * @since 1.1.0
 */

/**
 * Objects returned by oj.Cube.getValues() and representing a single cell within the cube's data body.
 * Note that more functions or properties can be added to this object in the future as required
 * @param {Object} value
 * @param {Array} indices
 * @param {string=} aggType
 * @param {Array=} rows
 * @param {number=} square
 * @constructor
 * @export
 * @private
 */
oj.CubeDataValue = function(value, indices, aggType, rows, square) {
    this.Init();
    this._data = {};
    this._data.value = value;
    this._data.indices = indices;
    this._data.aggType = aggType;
    this._data.rows = rows;
    this._data.square = square;
};
 
// Subclass from oj.Object 
oj.Object.createSubclass(oj.CubeDataValue, oj.Object, "oj.CubeDataValue");

/**
 * Initializes instance with the set options
 * @private
 */
oj.CubeDataValue.prototype.Init = function() 
{
  oj.CubeDataValue.superclass.Init.call(this);
};

/**
 * Get the actual data value in this cell
 * @return {Object|null|number} the data value
 * @export
 */
oj.CubeDataValue.prototype.getValue = function() {
    // Need a special case for variance/stddev--they need a final computation
    switch (this._data.aggType) {
        case oj.CubeAggType['STDDEV']:
            return Math.sqrt(this._getVariance());
        case oj.CubeAggType['VARIANCE']:
            return this._getVariance();
        default:
            return this._data.value;
    }
};
 
/**
 * Get the indices in axis order of the location of this data cell within the cube data body
 * @return {Array} an array of numeric indices in axis order
 * @export
 */
oj.CubeDataValue.prototype.getIndices = function() {
    return this._data.indices;
};
 
/**
 * Get the attribute/value pairs of the rows that were aggregated to create this data value.  The result may be a single row's set of attribute/value pairs if
 * no aggregation took place
 * @return {Array|null|undefined} the array of attribute/value pairs representing rows aggregated to create this data value
 * @export
 */
oj.CubeDataValue.prototype.getRows = function() {
    return this._data.rows;
};
 
/**
 * Get the aggregation type used to create this data value, if any
 * @return {string|undefined} the aggregation type used for this data value
 * @export
 */
oj.CubeDataValue.prototype.getAggregation = function() {
    return this._data.aggType;
};

oj.CubeDataValue.prototype._getVariance = function() {
    if (isNaN(this._data.square)) {
        return NaN;
    }
    var count = this._data.rows.length;
    return (count > 1) ? this._data.square / (count-1) : 0.0;
};

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
 /**
 * A CellSet represents a collection of cells.  The CellSet is an object returned by the success callback
 * of the fetchCells method on DataGridDataSource.  This implementation of CellSet is used by the
 * array DataGridDataSource.   
 * @constructor
 * @export
 * @private
 */
oj.CubeCellSet = function(cube, cellRange)
{
    // assert startRow/startColumn are number
    var startRow = cellRange.row ? cellRange.row.start : 0;
    var rowCount = cellRange.row ? cellRange.row.count : 0;
    var startColumn = cellRange.column ? cellRange.column.start : 0;
    var colCount = cellRange.column ? cellRange.column.count : 0;
    oj.Assert.assertNumber(startRow, null);
    oj.Assert.assertNumber(rowCount, null);
    oj.Assert.assertNumber(startColumn, null);
    oj.Assert.assertNumber(colCount, null);
    
    this._cube = cube;

    this._starts = {'row':startRow,'column':startColumn};
    
    // Get the data
    this._values = this._cube.getValues([{start:startColumn, count:colCount},{start:startRow,count:rowCount}]);

    var valArray = Array.isArray(this._values);
    
    colCount = valArray ? this._values.length : 1;
    if (colCount > 0) {
        rowCount = valArray ? this._values[0].length : 1;
    }
    this._counts = {'row':rowCount, 'column':colCount};
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available 
 * 2) the index specified is out of bounds.   The indices are absolute within the entire data set, not just this cell set
 * @param {Object} indexes the index of each axis in which we want to retrieve the data from.  
 * @param {number} indexes.row the index of the row axis.
 * @param {number} indexes.column the index of the column axis.
 * @return {Object} the data object for the specified index.
 * @export
*/
oj.CubeCellSet.prototype.getData = function(indexes)
{   
    var row = indexes['row'];
    var col = indexes['column'];
    var cell = Array.isArray(this._values) ? this._values[col-this._starts['column']][row-this._starts['row']] : this._values;
    if (cell) {
        return cell.getValue();
    }
    return null;
};

/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available 
 * 2) the index specified is out of bounds.   The indices are absolute across the entire data set not just within the cell set
 * @param {Object} indexes the index of each axis in which we want to retrieve the metadata from.  
 * @param {number} indexes.row the index of the row axis.
 * @param {number} indexes.column the index of the column axis.
 * @return {Object} the metadata object for the specific index.  The metadata that the DataGrid supports are: 
 *         1) keys - the key (of each axis) of the cell.
 * @export
 */
oj.CubeCellSet.prototype.getMetadata = function(indexes)
{
    // Get each axis' key
    var obj = {};
    obj['keys'] = {};
    obj['keys']['row'] = this._getAxisMetadata(indexes, 'row', 2);
    obj['keys']['column'] = this._getAxisMetadata(indexes, 'column', 1);
    
    return obj;
};

oj.CubeCellSet.prototype._getAxisMetadata = function(indexes, axis, len) {
    var axes = this._cube.getAxes();
    
    if (indexes[axis] !== undefined && axes.length >= len) {
        var keys = new oj.CubeKeys();
        var axisIndex = oj.CubeDataGridDataSource._convertAxes(axis);
        keys = axes[axisIndex].GetCubeKeys(indexes[axis], keys);
        return keys.GetHashCodes()[0].key;
    }
    return null;
};

/**
 * Gets the start index of the result set for the specified axis.  Valid values are "row" and "column".
 * @param {string} axis the axis in which to inquire the actual count of the result set.
 * @return {number} the start index of the result set for the specified axis.  
 * @export
 */
oj.CubeCellSet.prototype.getStart = function(axis)
{
    return this._starts[axis];
};

/**
 * Gets the actual count of the result set for the specified axis.  Valid values are "row" and "column".
 * @param {string} axis the axis in which to inquire the actual count of the result set.
 * @return {number} the actual count of the result set for the specified axis.  
 * @export
 */
oj.CubeCellSet.prototype.getCount = function(axis)
{
    return this._counts[axis];
};

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/



/**
 * @class oj.DataValueAttributeCube
 * Creates an object used to convert rowset data into grouped "cubic" data
 *
 * @param {Array} rowset An array of objects containing attribute/value pairs.  The entire array or collection
 *                       will be read to group its attributes according to information given by layout and dataValues
 * @param {Array} layout An array of objects containing two properties: axis - a number representing the number of the axis for of the levels;
 *                       levels - a slowest-to-fastest varying ordered array of objects containing one or two properties:
 *                       attribute - an attribute of the rowset objects or oj.Models to assign to this axis and level, or dataValue:true to indicate that this
 *                       axis and level is the position of the data values
 * @param {Array} dataValues an array of objects containing these properties: attribute - the name of an attribute in the rowset representing data; (optional) label - a display label to use for this data attribute;
 *                           (optional) aggregation - the oj.CubeAggType for this data value attribute (defaults to sum).  If the type is 'CUSTOM' then a 'callback' property should be specified which is a function to call with each value.  The function takes two arguments, the first being the running value for the cell being calculated, the second being the new value to be aggregated with that running value
 * @see oj.Cube
 * @constructor
 * @since 1.1.0
 * @export
 */
oj.DataValueAttributeCube = function(rowset, layout, dataValues)
{
    this.Init();
    this._dataValues = dataValues;    
    this._aggTypeLookup = this._buildAggTypeLookup();
    oj.DataValueAttributeCube.superclass.constructor.call(this, rowset, layout);
};

// Subclass from oj.Cube 
oj.Object.createSubclass(oj.DataValueAttributeCube, oj.Cube, "oj.DataValueAttributeCube");

/**
 * 
 * @type {Array}
 * @private
 */
oj.DataValueAttributeCube.prototype._rows = null;

/**
 * Initializes instance with the set options
 * @private
 */
oj.DataValueAttributeCube.prototype.Init = function() 
{
  oj.DataValueAttributeCube.superclass.Init.call(this);
};


// Construct a cube given the information from the constructor.  Walk each row, assign it to its axis, aggregate values as 
// need be
oj.DataValueAttributeCube.prototype.BuildCube = function() {
    oj.DataValueAttributeCube.superclass.BuildCube.call(this);
    
};

oj.DataValueAttributeCube.prototype.GetAggType = function(dataValue) {
    return this._dataValueAggType[dataValue];
};

oj.DataValueAttributeCube.prototype.GenerateLevel = function(level, axis) {    
    if (level['dataValue']) {
        // Data value level
        return new oj.CubeLevel(null, axis, true);
    }
    // Regular level
    return new oj.CubeLevel(level['attribute'], axis, false);
};

oj.DataValueAttributeCube.prototype.GenerateCube = function(layout) {
    return new oj.DataValueAttributeCube(null, layout, this._dataValues);
};
    
oj.DataValueAttributeCube.prototype.ProcessLevel = function(axis, levelNum, currNode, row, keys, addKeys) {
    if (levelNum >= axis.getLevels().length) {
        return keys;
    }
    var level = axis.getLevels()[levelNum];
    
    if (level.isDataValue()) {
        // For each defined data attribute, add a node and then process the rest of the levels under them
        // This needs to be handled by the cube, because different types of cube data setups require different processing        
        return this._processDataValue(axis, currNode, row, levelNum, keys);
    }
    // Not the data value: process this and call for the next
    var value = row[level['attribute']];
    var node = currNode.AddNode(value, null, level);
    
    // Gives us control to avoid adding duplicate key sets below each measure coming from one detail row
    if (addKeys) {
        keys.UpdateKeys(node);
    }
    return this.ProcessLevel(axis, levelNum+1, node, row, keys, addKeys);
};

// Insert the data values into the given node and then process the remaining levels
oj.DataValueAttributeCube.prototype._processDataValue = function(axis, node, row, levelNum, keys) {
    // Roll over each data value, place an entry for each, and follow up the rest of the levels under that entry
    var dsKeysAdded = true;
    for (var d = 0; d < this._dataValues.length; d++) {
        var dvAttr = this._dataValues[d]['attribute'];
        var dvLabel = this._dataValues[d]['label'];
        // Only add a node if this row has an entry for the dataValue
        if (row.hasOwnProperty(dvAttr)) {
            var currNode = node.AddNode(dvAttr, dvLabel, axis.getLevels()[levelNum]);
            keys.AddDataValue(dvAttr, row[dvAttr]);

            // Process the rest of the level.  Only have new nodes added to data storage keys for the first data value we process--don't want to duplicate them
            this.ProcessLevel(axis, levelNum+1, currNode, row, keys, dsKeysAdded);
            // Shut off the key adding for future passes
            dsKeysAdded = false;
        }
    }
    return keys;
};

oj.DataValueAttributeCube.prototype._buildAggTypeLookup = function() {
    this._dataValueAggType = [];
    for (var i = 0; i < this._dataValues.length; i++) {
        var dv = this._dataValues[i];
        var agg = dv['aggregation'];            
        this._dataValueAggType[dv['attribute']] = agg ? {aggregation:dv['aggregation'], callback:dv['callback']} : {aggregation:oj.CubeAggType['SUM'], callback:dv['callback']};
    }
};
/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/

/**
 * @constructor
 * @private
 */
oj.CubeKeys = function() {
    // Nodes referencing the data values
    this._key = [];
    
    // List of dataValue name/data value pairs
    this._data = [];
};


oj.CubeKeys.prototype.UpdateKeys = function(node) {
    this._key.push(node);
};

/**
 * @param {String} name
 * @param {Object=} value
 * @private
 */
oj.CubeKeys.prototype.AddDataValue = function(name, value) {
    this._data.push({name:name,value:value});
};

oj.CubeKeys.prototype.GetHashCodes = function() {
    var codes = [];
    
    var keyHash = this._buildKeyHash();
    
    if (this._data.length === 0) {
        codes.push({key:JSON.stringify(keyHash)});
    }
    else {
        // One pairing for each data value
        for (var d = 0; d < this._data.length; d++) {
            var copy = $.extend(true, {}, keyHash);
            // This is done for easier lookups when finding child
            copy[this._data[d].name] = this._data[d].name;
            codes.push({key:JSON.stringify(copy),dataValue:this._data[d].name,value:this._data[d].value});
        }
    }
    return codes;
};

oj.CubeKeys.prototype._buildKeyHash = function() {
    var keyHash = {};
    for (var k = 0; k < this._key.length; k++) {
        var hc = this._key[k].GetHashCode();
        for (var p in hc) {
            if (hc.hasOwnProperty(p)) {
                keyHash[p] = hc[p];
            }
        }
    }
    return keyHash;
};


/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * A HeaderSet represents a collection of headers.  The HeaderSet is an object returned by the success callback
 * of the fetchHeaders method on DataGridDataSource.  This implementation of HeaderSet is used by the
 * array DataGridDataSource.   
 * @constructor
 * @export
 * @private
 */
oj.CubeHeaderSet = function(axis, cube, start, count)
{
    // The oj.Cube
    this._cube = cube;
    // The oj.CubeAxis
    this._axis = axis;    
    this._start = start === undefined ? 0 : start;
    this._count = count === undefined ? this._axis.getExtent() : Math.min(count, this._axis.getExtent()-start);
    this._end = start + count - 1;
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds. 
 * @param {number} index the index of the header in which we want to retrieve the header from.  This is an absolute index across the entire axis
 * @param {number} level the level of the header
 * @return {Object} the data object for the specific index.
 * @export
 */
oj.CubeHeaderSet.prototype.getData = function(index, level)
{
    var val = this._getValue(index, level);
    return val ? val.getLabel() : null;
};

/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available and 
 * 2) the index specified is out of bounds. 
 * The metadata that the data source can optionally return are:
 *  1) sortDirection - the initial sort direction of the header.  Valid values are "ascending" and "descending".
 *  2) key - the key of the row/column header.
 * @param {number} index the index of the header in which we want to retrieve the metadata from.   This is an absolute index across the entire axis
 * @param {number} level the level of the header
 * @return {Object} the metadata object for the specific index.
 * @export
 */
oj.CubeHeaderSet.prototype.getMetadata = function(index, level)
{    
    var keys = new oj.CubeKeys();
    keys = this._axis.GetPartialCubeKeys(index, level, keys);
    var hash = keys.GetHashCodes();
    
    return hash && hash.length > 0 ? {'key':hash[0].key} : null;
};

/**
 * Gets the actual number of levels of the result set for the specified axis.
 * @return {number} the number of levels of the result set for the specified axis. 
 * @export
 */
oj.CubeHeaderSet.prototype.getLevelCount = function()
{
    return this._axis.getLevels().length;
};
 
/**
 * Gets the extent of an index on a particular level.  This is the extent such as it is within the defined header set, not across the entire
 * axis.  If the header falls across the beginning of the headerset or the end, then its extent should be only that part lying within the header set
 * @param {number} index the index of the header (absolute within the axis)
 * @param {number} level the level of the header
 * @return {Object} an object containing two values. example: {extent:5, more: {'before':false, 'after':true}}
 *              extent: the number of slices of the result set for the specified axis. 
 *              more: object with keys 'before'/'after' and boolean values true/false representing whether
 *                       there may be more rows/columns before or after the headerSet
 * @export
 */
oj.CubeHeaderSet.prototype.getExtent = function(index, level)
{
    var val = this._getValue(index, level);
    var extent = val.getExtent();
    var start = val.getStart();
    var end = start + extent - 1;
    var before = index > start;
    var after = index < start + extent - 1;
    
    if (start < this._start) {
        // Need to subtract this overage from the extent
        extent -= (this._start-start);
    }
    if (end > this._end) {
        // true extent overruns the header set--adjust it down by that much
        extent -= (end-this._end);
    }
    return {'extent':extent, 'more': {'before':before, 'after':after}};
};
 
/**
 * Gets the depth of an index starting at a particular level.
 * @param {number} index the index of the header (absolute within the axis)
 * @param {number} level the level of the header
 * @return {number} - the number of levels of the result set for the specified axis. 
 * @export
 */
oj.CubeHeaderSet.prototype.getDepth = function(index, level)
{
    var val = this._getValue(index, level);
    return val.getDepth();
};

/**
 * Gets the actual count of the result set.
 *
 * @return {number} the actual count of the result set.  
 * @export
 */
oj.CubeHeaderSet.prototype.getCount = function()
{
    return this._count;
};

/**
 * Gets the start index of the result set.
 * @return {number} the start index of the result set.
 * @export
 */
oj.CubeHeaderSet.prototype.getStart = function()
{
    return this._start;
};

oj.CubeHeaderSet.prototype._getValue = function(index, level) {
    if (level === undefined) {
        level = 0;
    }
    var values = this._axis.getValues(index);
    if (values && values.length > level) {
        return values[level];
    }
    return null;    
};
/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * A cubic/aggregating DataGridDataSource based on the oj.Cube
 * @param {oj.Cube} cube the cube that will underpin the data source
 * @export
 * @extends oj.DataGridDataSource
 * @constructor
 * @since 1.1.0
 */
oj.CubeDataGridDataSource = function(cube)
{
    oj.CubeDataGridDataSource.superclass.constructor.call(this, cube);
};

// Subclass CubeDataGridDataSource to DataGridDataSource
oj.Object.createSubclass(oj.CubeDataGridDataSource, oj.DataGridDataSource, "oj.CubeDataGridDataSource");

/**
 * Set a new cube on the data source
 * @param {oj.Cube} cube
 * @export
 */
oj.CubeDataGridDataSource.prototype.setCube = function(cube) {
    this.data = cube;
    this._fireRefresh();
};

/**
 * Pin any axes beyond the row and column to specific index values (to allow the idea of "paging" through a cube)
 * @param {Array} indices an array of objects each containing an 'axis' attribute and a zero-based 'index' attribute giving the index to "pin" the axis to.
 * @export
 */
oj.CubeDataGridDataSource.prototype.setPage = function(indices) {
    this.data.setPage(indices);
    this._fireRefresh();
};

oj.CubeDataGridDataSource.prototype._fireRefresh = function() {
    var event = {};
    event['source'] = this;
    event['operation'] = "refresh";
    this.handleEvent("change", event);
};
    
/**
 * Returns the total number of rows or columns.  If the value return is not >= 0 then it is automatically assumed
 * that the total count is unknown.
 * @param {string} axis the axis in which we inquire for the total count.  Valid values are "row" and "column".
 * @return {number} the total number of rows/columns.
 * @export
 */
oj.CubeDataGridDataSource.prototype.getCount = function(axis)
{
    var axisObj = this._getAxis(axis);
    
    return axisObj ? axisObj.getExtent() : 0;
};

/**
 * Returns whether the total count returned in getCount function is an actual or an estimate.
 * @param {string} axis the axis in which we inquire whether the total count is an estimate.  Valid values are 
 *        "row" and "column".
 * @return {string} "exact" if the count returned in getCount function is the actual count, "estimate" if the 
 *         count returned in getCount function is an estimate.  The default value is "exact".
 * @export
 */
oj.CubeDataGridDataSource.prototype.getCountPrecision = function(axis)
{
    return "exact";
};

/**
 * Fetch a range of headers from the data source.
 * @param {Object} headerRange information about the header range, it must contain the following properties:
 *        axis, start, count.
 * @param {string} headerRange.axis the axis of the header that are fetched.  Valid values are "row" and "column".
 * @param {number} headerRange.start the start index of the range in which the header data are fetched.
 * @param {number} headerRange.count the size of the range in which the header data are fetched.  
 * @param {Object} callbacks the callbacks to be invoke when fetch headers operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.HeaderSet)} callbacks.success the callback to invoke when fetch headers completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @export
 */
oj.CubeDataGridDataSource.prototype.fetchHeaders = function(headerRange, callbacks, callbackObjects)
{
    
    var cubeheaders = new oj.CubeHeaderSet(this._getAxis(headerRange['axis']), this.data, headerRange['start'], headerRange['count']);
    callbacks['success'].call(callbackObjects ? callbackObjects['success'] : undefined, cubeheaders, headerRange);
};

/**
 * Fetch a range of cells from the data source.
 * @param {Array.<Object>} cellRange Information about the cell range.  A cell range is defined by an array 
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @param {string} cellRange.axis the axis associated with this range where cells are fetched.  Valid 
 *        values are "row" and "column".
 * @param {number} cellRange.start the start index of the range for this axis in which the cells are fetched.
 * @param {number} cellRange.count the size of the range for this axis in which the cells are fetched. 
 * @param {Object} callbacks the callbacks to be invoke when fetch cells operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.CellSet)} callbacks.success the callback to invoke when fetch cells completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @export
 */
oj.CubeDataGridDataSource.prototype.fetchCells = function(cellRange, callbacks, callbackObjects)
{
    var obj = {};
    for (var i = 0; i < cellRange.length; i++) {
        var start = cellRange[i]['start'] === undefined ? 0 : cellRange[i]['start'];
        if (cellRange[i].axis === 'row') {
            var count = cellRange[i]['count'] === undefined ? this.data.getAxes()[1].getExtent() : cellRange[i]['count'];
            obj.row = {start: start, count: count};
        }
        if (cellRange[i].axis === 'column') {
            var count = cellRange[i]['count'] === undefined ? this.data.getAxes()[0].getExtent() : cellRange[i]['count'];
            obj.column = {start: start, count: count};
        }
    }
    var cubecells = new oj.CubeCellSet(this.data, obj);
    callbacks['success'].call(callbackObjects ? callbackObjects['success'] : undefined, cubecells, cellRange);
};

/**
 * Returns the keys based on the indexes. 
 * @param {Object} indexes the index for each axis
 * @param {Object} indexes.row the index for the row axis
 * @param {Object} indexes.column the index for the column axis
 * @return {Object} a Promise object which when resolved returns an object containing the keys for each axis
 * @export
 */
oj.CubeDataGridDataSource.prototype.keys = function(indexes)
{
    var retObj = {};
    retObj = this._getKey(indexes, 'row', retObj);
    retObj = this._getKey(indexes, 'column', retObj);
    return Promise.resolve(retObj);
};

oj.CubeDataGridDataSource.prototype._getKey = function(indexes, axis, retObj) {
    var axisObj = this._getAxis(axis);
    var item = indexes[axis];
    var keys = new oj.CubeKeys();
    keys = axisObj ? axisObj.GetCubeKeys(item, keys) : "";
    retObj[axis] = keys.GetHashCodes()[0].key;
    return retObj;
};

/**
 * Returns the row and column index based on the keys.
 * @param {Object} keys the key for each axis
 * @param {Object} keys.row the key for the row axis
 * @param {Object} keys.column the key for the column axis
 * @return {Object} a Promise object which when resolved returns an object containing the index for each axis
 * @export
 */
oj.CubeDataGridDataSource.prototype.indexes = function(keys)
{
    var retObj = {};
    retObj = this._getIndex(keys, 'row', retObj);
    retObj = this._getIndex(keys, 'column', retObj);

    return Promise.resolve(retObj);
};

oj.CubeDataGridDataSource.prototype._getIndex = function(keys, axis, retObj) {
    retObj[axis] = this._getAxis(axis).getIndex(keys[axis]);
    return retObj;
};

/**
 * @ignore
 * @export
 */
oj.CubeDataGridDataSource.prototype.sort = function(criteria, callbacks, callbackObjects)
{
    oj.Assert.failedInAbstractFunction();
};

/**
 * @ignore
 * @export
 */ 
oj.CubeDataGridDataSource.prototype.move = function(rowToMove, referenceRow, position, callbacks, callbackObjects)
{
    oj.Assert.failedInAbstractFunction();
};

/**
 * Checks whether a move operation is valid.
 * @param {Object} rowToMove the key of the row to move
 * @param {Object} referenceRow the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {string} position The position of the moved row relative to the reference row.  
 *        Valid values are: "before", "after".
 * @return {string} returns "valid" if the move is valid, "invalid" otherwise.
 * @export
 */ 
oj.CubeDataGridDataSource.prototype.moveOK = function(rowToMove, referenceRow, position)
{
    return "invalid";
};

/**
 * Determines whether this DataGridDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none", "row", "column".  
 *         For "move", the valid return values are: "row", "none".  
 *         Returns null if the feature is not recognized.
 * @export
 */
oj.CubeDataGridDataSource.prototype.getCapability = function(feature)
{
    switch (feature) {
        case "sort":
            return "none";
        case "move":
            return "none";
    }
    return null;
};

oj.CubeDataGridDataSource._convertAxes = function(axis) {
    return axis === "row" ? 1 : 0;
};

oj.CubeDataGridDataSource.prototype._getAxis = function(axis) {
    var axisNum = oj.CubeDataGridDataSource._convertAxes(axis);
    var axes = this.data.getAxes();
    if (axes.length > axisNum) {
        return axes[axisNum];
    }
    return null;
};
/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/


/**
 * @class oj.DataColumnCube
 * 
 * Creates an object used to convert rowset data into grouped "cubic" data, where the data values are specified by a single attribute within the rowset
 * (dataValues.labelAttr) and their header values designated by another rowset attribute (dataValues.valueAttr).
 *
 * @param {Array} rowset An array of objects containing attribute/value pairs.  The entire array or collection
 *                       will be read to group its attributes according to information given by layout and dataValues
 * @param {Array} layout An array of objects containing two properties: axis - a number representing the number of the axis of the levels;
 *                       levels - a slowest-to-fastest varying ordered array of objects containing:
 *                       attribute - an attribute of the rowset objects to assign to this axis and level.  If the attribute
 *                       is the same as that specified by labelAttr, then this level is the data value level
 * @param {Object} dataValues an object containing the following properties: labelAttr - the rowset attribute used to group the data values in the header
 *                            valueAttr - the rowset attribute used for the actual data values; (optional) defaultAggregation - the default type of
 *                            oj.CubeAggType to use to aggregate data values where necessary.  If the type is 'CUSTOM' then this should be an object with a 'type' property of oj.CubeAggType['CUSTOM'] and a 'callback' property specifying a function to call with each value.  The function takes two arguments, the first being the running value for the cell being calculated, the second being the new value to be aggregated with that running value; (optional) aggregation: an array of objects containing:
 *                            value - the value of labelAttr for which this aggregation should apply; aggregation - the oj.CubeAggType for that value; if aggregation is 'CUSTOM', then a 'callback' property should be added specifying a function (for arguments see above) to call with each value
 *                            (defaults to sum)
 * @see oj.Cube
 * @constructor
 * @since 1.1.0
* @export
 */
oj.DataColumnCube = function(rowset, layout, dataValues) {
    this.Init();
    this._dataValues = dataValues;
    this._valueAttr = dataValues['valueAttr'];
    this._labelAttr = dataValues['labelAttr'];
    var defAgg = dataValues['defaultAggregation'];
    this._defaultAggregation = defAgg ? oj.DataColumnCube._getDefaultAgg(defAgg) : {aggregation:oj.CubeAggType['SUM']};
    this._aggregation = dataValues['aggregation'];
    this._buildAggTypeLookup();
    
    oj.DataColumnCube.superclass.constructor.call(this, rowset, layout);
};

// Subclass from oj.Cube 
oj.Object.createSubclass(oj.DataColumnCube, oj.Cube, "oj.DataColumnCube");

/**
 * Initializes instance with the set options
 * @private
 */
oj.DataColumnCube.prototype.Init = function() 
{
  oj.DataColumnCube.superclass.Init.call(this);
};

oj.DataColumnCube.prototype.BuildCube = function() {
    oj.DataColumnCube.superclass.BuildCube.call(this);
};

oj.DataColumnCube.prototype.GetAggType = function(dataValue) {
    if (this._dataValueAggType[dataValue]) {
        return this._dataValueAggType[dataValue];
    }
    return this._defaultAggregation;
};

oj.DataColumnCube.prototype.GenerateCube = function(layout) {
    return new oj.DataColumnCube(null, layout, this._dataValues);
};

oj.DataColumnCube.prototype.GenerateLevel = function(level, axis) {    
    if (level['attribute'] === this._labelAttr) {
        // Data value level
        return new oj.CubeLevel(level['attribute'], axis, true);
    }
    // Regular level
    return new oj.CubeLevel(level['attribute'], axis, false);
};

oj.DataColumnCube.prototype.ProcessLevel = function(axis, levelNum, currNode, row, keys, addKeys) {
    if (levelNum >= axis.getLevels().length) {
        return keys;
    }
    var level = axis.getLevels()[levelNum];
    
    // Not the data value: process this and call for the next
    var value = row[level['attribute']];
    var node = currNode.AddNode(value, null, level);
    
    if (level.isDataValue()) {
        keys.AddDataValue(value, row[this._valueAttr]);
    }
    else {
        keys.UpdateKeys(node);
    }    
    
    return this.ProcessLevel(axis, levelNum+1, node, row, keys, addKeys);
};

oj.DataColumnCube._getDefaultAgg = function(agg) {
    if (oj.StringUtils.isString(agg)) {
        return {aggregation:agg};
    }
    return {aggregation:agg['aggregation'],callback:agg['callback']};
};
    
oj.DataColumnCube.prototype._buildAggTypeLookup = function() {
    this._dataValueAggType = [];
    if (this._aggregation) {
        for (var i = 0; i < this._aggregation.length; i++) {
            var dv = this._aggregation[i];
            var agg = dv['aggregation'];
            this._dataValueAggType[dv['value']] = agg ? {aggregation:agg, callback:dv['callback']} : this._defaultAggregation;
        }
    }
};
/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*jslint browser: true*/

/**
 * @class oj.CubeLevel
 * @classdesc  Represents a level within an axis.  The level is tied to an attribute within the original rowset.  Each level contains a number of [oj.CubeAxisValues]{@link oj.CubeAxisValue}, all from the same attribute
 * @see oj.CubeAxis
 * @since 1.1.0
 */

/**
 * Represents a level within an axis.  The level is tied to an attribute within the original rowset.
 * Each level contains a number of oj.CubeAxisValues, all from the same attribute
 * @constructor
 * @export
 * @private
 */
 oj.CubeLevel = function(attribute, axis, dataValue) {
    this.Init();
    this['attribute'] = attribute;
    this._axisObj = axis;
    this['axis'] = axis['axis'];
    this._dataValue = dataValue;
 };
 
 // Subclass from oj.Object 
oj.Object.createSubclass(oj.CubeLevel, oj.Object, "oj.CubeLevel");

/**
 * Initializes instance with the set options
 * @private
 */
oj.CubeLevel.prototype.Init = function() 
{
  oj.CubeLevel.superclass.Init.call(this);
};

/**
 * The rowset attribute this level represents
 * @type {String}
 * @export
 */
oj.CubeLevel.prototype.attribute;
 
/**
 * The axis this level is a member of
 * @type {number}
 * @export
 */
oj.CubeLevel.prototype.axis;
 

/**
 * Return the oj.CubeAxisValue at the given index within this level
 * @param index {number} the axis index for which to get the value
 * @return {oj.CubeAxisValue} the value at the given location within the level
 * @export
 */
oj.CubeLevel.prototype.getValue = function(index) {
    var values = this._axisObj.getValues(index);
    if (values) {
        // Find this level within the returned list
        for (var v = 0; v < values.length; v++) {
            if (values[v].getLevel() === this) {
                return values[v];
            }
        }
    }
    return null;
};
 
/**
 * Does this level represent the data values within the cube?
 * @return {boolean} true if this level does represent the data values within the cube; false otherwise
 * @export
 */
oj.CubeLevel.prototype.isDataValue = function() {
    return this._dataValue;
};

/**
 * @type {boolean}
 * @private
 */
oj.CubeLevel.prototype._dataValue = false;

/**
 * @type {oj.CubeAxis}
 * @private
 */
oj.CubeLevel.prototype._axisObj = null;
});
