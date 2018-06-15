/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojindexer', 'ojs/ojdatasource-common'],
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $)
{

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Implementation of the IndexerModel and TreeDataSource based on an array of data set.
 * This should be used with the Indexer and its associated ListView.
 * By default, this adapter groups the data based on the first letter of the data and the alphabet of the current locale.
 * @class oj.IndexerModelTreeDataSource
 * @classdesc TreeDataSource and IndexerModel implementation that represents hierachical data available from an array of JSON objects.  This data source can be used by [Indexer]{@link oj.ojIndexer} and 
 *            associated [ListView]{@link oj.ojListView}.<br><br> 
 *            See the <a href="../jetCookbook.html?component=indexer&demo=characterIndexer">Indexer - Basic</a> demo for an example.<br><br>
 *            Refer to {@link oj.TreeDataSource} for other data sources that represent hierarachical data.
 * @param {Array.<any>} data an array of data used for Indexer and ListView 
 * @param {string} idAttribute the id attribute of the data
 * @param {function(Object)|function(string)} listener a callback function that handles when a section becomes current (user clicks on the section in the Indexer).
 *                   the function takes the current section and must return a Promise which when resolve returns the section in which the ListView
 *                   actually scrolls to.
 * @param {Object=} options the options set on this IndexerModelTreeDataSource
 * @param {(Array.<string>|Array.<Object>)=} options.sections the set of sections to use with the Indexer.  If not specified, then the sections are derived from the alphabet of the current locale.
 * @param {string=} options.groupingAttribute the attribute of the data where grouping is based on, mandatory if no groupingStrategy is specified.
 * @param {function(Object)=} options.groupingStrategy a callback function that takes a data and returns the section that the data belongs to.  If no groupingStrategy is specified,
 *                   then the default grouping strategy based on the first letter of the data is used.
 * @param {function(Object, Object)=} options.sortComparatorFunction a comparator function that is used to sort data within a section.  If not specified, then 
 *                   the items within a section will not be sorted.
 * @ojsignature {target: "Type",
 *               value: "(section: string|object)=> Promise<string|object>",
 *               for: "listener"}
 * @ojsignature {target: "Type",
 *               value: "(data: any)=> string|object",
 *               for: "options.groupingStrategy"}
 * @ojsignature {target: "Type",
 *               value: "(section1: string|object, section2: string|object)=> number",
 *               for: "options.sortComparatorFunction"}
 * @constructor
 * @since 3.0
 * @export
 * @ojtsignore
 * @extends oj.TreeDataSource
 * @implements oj.IndexerModel
 */
oj.IndexerModelTreeDataSource = function(data, idAttribute, listener, options)
{
    this.data = data;
    this.idAttr = idAttribute;
    this.listener = listener;
    this.options = options;

    this.Init();
}

// Subclass from oj.TreeDataSource
oj.Object.createSubclass(oj.IndexerModelTreeDataSource, oj.TreeDataSource, "oj.IndexerModelTreeDataSource");

/**
 * Initializes the instance.
 * @return {void}
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @ojtsignore
 * @instance
 */
oj.IndexerModelTreeDataSource.prototype.Init = function()
{
    var sections, resource, strategy, field, content, char, sortComparator, section1, section2, index1, index2, diff, pos, current, i, section;

    // call super
    oj.IndexerModelTreeDataSource.superclass.Init.call(this);

    sections = this.options['sections'];
    if (sections == null)
    {
        resource = oj.Translations.getTranslatedString('oj-ojIndexer.indexerCharacters');
        sections = resource.split('|');
    }
    sections.push(oj.IndexerModel.SECTION_OTHERS);

    strategy = this.options['groupingStrategy'];
    if (strategy == null)
    {
        // if no grouping strategy is specified, use the default which groups based on the first charactor 
        // of the data
        field = this.options['groupingAttribute'];
        strategy = function(value) 
        {
            content = value[field] ? value[field] : value;
            char = content.toString().toUpperCase()[0];
            return sections.indexOf(char) > -1 ? char : oj.IndexerModel.SECTION_OTHERS;
        };
    }

    sortComparator = this.options['sortComparatorFunction'];
    this.data = this.data.sort(function(a, b) 
    {
        section1 = strategy(a);
        section2 = strategy(b);

        index1 = sections.indexOf(section1);
        index2 = sections.indexOf(section2);

        diff = index1 - index2; 
        // used specified sort comparator function to sort within section
        if (diff == 0 && sortComparator)
        {
            return sortComparator(a, b);
        }
        else
        {
            return diff;
        }        
    });

    // figure out the position of the buckets for quick lookup
    for (i=0; i<this.data.length; i++)
    {
        section = strategy(this.data[i]);
        if (current != section)
        {
            current = section;
            this._set(section, i);
        }
    }

    this.sections = sections;
};

// TODO: use Map when we can use it for all supported platforms
/**
 * @private
 */
oj.IndexerModelTreeDataSource.prototype._set = function(key, value)
{
    if (this.pos == null)
    {
        this.pos = [];
    }

    this.pos.push({key: key, value: value});
};

/**
 * @private
 */
oj.IndexerModelTreeDataSource.prototype._get = function(key)
{
    var i;

    for (i=0; i<this.pos.length; i++)
    {
        if (this.pos[i].key == key)
        {
            return this.pos[i].value;
        }
    }
    return null;
};

/****************** IndexerModel *******************/
/**
 * Returns an array of objects each representing a section in the associated ListView.  
 * @return {Array.<string>|Array.<Object>} an array of all indexable sections 
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */
oj.IndexerModelTreeDataSource.prototype.getIndexableSections = function()
{
    // remove other sections from this.sections
    return this.sections.slice(0, this.sections.length-1);
};

/**
 * Returns an array of objects each representing a section that does not have a corresponding section in the associated ListView.  
 * It must be a subset of the return value of <code>getIndexableSections</code>.  Return null or undefined if there's nothing missing.
 * @return {Array.<string>|Array.<Object>} an array of missing sections
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */
oj.IndexerModelTreeDataSource.prototype.getMissingSections = function()
{
    var missing, i, section;

    if (this.missing == null)
    {
        missing = [];
        // figure out what's missing, skip the others section since it's always available
        for (i=0; i<this.sections.length-1; i++)
        {
            section = this.sections[i];
            if (this._get(section) == null)
            {
                missing.push(section);
            }
        }

        this.missing = missing;
    }

    return this.missing;
};

/**
 * Make a section current in the Indexer.  The implementation should scroll the associated ListView so that the section becomes visible.
 * @param {string|Object} section the current section
 * @return {Promise.<string>|Promise.<Object>} a Promise which when resolved will return the section that the associated ListView actually scrolls to.  
 *                   For example, the implementation could choose to scroll to the next available section in ListView if no data 
 *                   exists for that section.  
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */
oj.IndexerModelTreeDataSource.prototype.setSection = function(section)
{
    return this.listener.call(this, section);
};

/****************** TreeDataSource *******************/
/**
 * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
 * that the child count is unknown.
 * @param {any} parentKey the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */
oj.IndexerModelTreeDataSource.prototype.getChildCount = function(parentKey)
{
    var count, pos, index, next, nextPos;

    if (parentKey == null)
    {
        count = this.sections.length - this.getMissingSections().length;
        // exclude other section if there are no entries in it
        return this._get(oj.IndexerModel.SECTION_OTHERS) != null ? count : count - 1;
    }
    else
    {
        pos = this._get(parentKey);
        if (pos != null)
        {
            index = this.sections.indexOf(parentKey);
            // if it's the last section
            if (index == this.sections.length - 1)
            {
                return this.data.length - pos;
            }
            else
            {
                index++;
                next = this.sections[index];
                nextPos = this._get(next);
                while (nextPos == null && index < this.sections.length)
                {
                    index++;
                    next = this.sections[index];
                    nextPos = this._get(next);
                }

                if (isNaN(nextPos) || nextPos == null)
                {
                    nextPos = this.data.length;
                }

                return nextPos - pos;
            }
        }
    }

    // should not get here (ex: unexpected parentKey)
    return 0;
};

/**
 * Fetch the children
 * @param {any} parentKey the parent key.  Specify null if fetching children from the root.
 * @param {Object} range information about the range, it must contain the following properties: start, count.
 * @param {number} range.start the start index of the range in which the children are fetched.
 * @param {number} range.count the size of the range in which the children are fetched.  
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.NodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
 * @param {function({status: *})=} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} options optional parameters for this operation.
 * @param {boolean=} options.queueOnly true if this fetch request is to be queued and not execute yet.  The implementation must maintain 
 *        the order of the fetch operations.  When queueOnly is false/null/undefined, any queued fetch operations are then
 *        flushed and executed in the order they are queued.  This flag is ignored if the datasource does not support batching.
 * @return {void}
 * @export
 * @expose
 * @memberof oj.IndexerModelTreeDataSource
 * @instance
 */
oj.IndexerModelTreeDataSource.prototype.fetchChildren = function(parentKey, range, callbacks, options)
{
    var available, nodeSet, self = this;

    if (parentKey == null)
    {
        // root case
        available = this.sections.filter(function(section) 
        {
            return self._get(section) != null;
        });

        nodeSet = {
            "getParent": function() {
                return parentKey;
            },
            "getStart": function() {
                return 0;
            },
            "getCount": function() {
                return available.length;
            },
            "getData": function(index) {
                return available[index];
            },
            "getMetadata": function(index) {
                return {"key": available[index], "leaf": false, "depth": 0};
            }
        };
    }
    else
    {
        nodeSet = {
            "getParent": function() {
                return parentKey;
            },
            "getStart": function() {
                return 0;
            },
            "getCount": function() {
                return self.getChildCount(parentKey);
            },
            "getData": function(index) {
                return self.data[self._get(parentKey) + index];
            },
            "getMetadata": function(index) {
                var data = self.data[self._get(parentKey) + index];
                return {"key": self.idAttr != null ? data[self.idAttr] : data, "leaf": true, "depth": 1};
            }
        };
    }

    // invoke original success callback
    if (callbacks != null && callbacks['success'] != null)
    {
        callbacks['success'].call(null, nodeSet);
    }
};

});