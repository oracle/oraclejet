/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @export
 * @interface DataMapping
 * @classdesc Interface for DataMapping which can be supplied to shredders/unshredders
 * and queryHandlers
 * @hideconstructor
 */

/**
 * Field mapping function which takes an item and returns the mapped item
 *
 * @export
 * @expose
 * @memberof DataMapping
 * @instance
 * @method mapFields
 * @param {Item} item 
 * @return {Item} Returns the mapped item.
 * <pre>
 * This is typically used when there is a need to tranform the data before
 * it is stored in the database. One use case would be for converting ISO Datetime
 * string values to numbers to enable querying and sorting in the DB. e.g.
 * <code>
 * dataMapping.mapFields = function(item) {
 *   var mappedItem = {};
 *   mappedItem.data = {};
 *   Object.keys(item.data).forEach(function(field) {
 *     if (field == 'hireDate') {
 *       var date = new Date(item.data[field]);
 *       mappedItem.data[field] = date.getTime();
 *     } else {
 *       mappedItem.data[field] = item.data[field];
 *     }
 *   });
 *   mappedItem.metadata = item.metadata;
 *   return mappedItem;
 * };
 * </code>
 * </pre>
 */

/**
 * Field unmapping function which takes a mapped item and returns the item
 *
 * @export
 * @expose
 * @memberof DataMapping
 * @instance
 * @method unmapFields
 * @param {Item} item 
 * @return {Item} Returns the unmapped item.
 * <pre>
 * This is required when mapFields was used so that we can transform
 * back the data. e.g.
 * <code>
 * dataMapping.unmapFields = function(item) {
 *   var unmappedItem = {};
 *   unmappedItem.data = {};
 *   Object.keys(item.data).forEach(function(field) {
 *     if (field == 'hireDate') {
 *       var date = new Date(item.data[field]);
 *       unmappedItem.data[field] = date.toISOString();
 *     } else {
 *       unmappedItem.data[field] = item.data[field];
 *     }
 *   });
 *   unmappedItem.metadata = item.metadata;
 *   return unmappedItem;
 * };
 * </code>
 * </pre>
 */

/**
 * FilterCriterion mapping function which takes filterCriterion and returns the mapped filterCriterion
 *
 * @export
 * @expose
 * @memberof DataMapping
 * @instance
 * @method mapFilterCriterion
 * @param {AttributeFilter | CompoundFilter} item 
 * @return {AttributeFilter | CompoundFilter} Returns the mapped filterCriterion.
 * <pre>
 * This is required when mapFields was used and queries are processed. e.g.
 * <code>
 * dataMapping.mapFilterCriterion = function(filterCriterion) {
 *   if (filterCriterion && filterCriterion.attribute == 'hireDate') {
 *     filterCriterion.value = (new Date(filterCriterion.value)).getTime();
 *   }
 *   return filterCriterion;
 * };
 * </code>
 * </pre>
 */

/**
 * The interface for Item
 *
 * @export
 * @interface Item
 */

/**
 * The metadata for the item
 *
 *
 * @export
 * @expose
 * @memberof Item
 * @instance
 * @name metadata
 * @type {ItemMetadata}
 */

/**
 * The data for the item
 *
 * @export
 * @expose
 * @memberof Item
 * @instance
 * @name data
 * @type {Object}
 */

 /**
 * The interface for ItemMetadata.  Note that key is the only mandatory property,
 * implementations can provide additional properties as needed.
 *
 * @export
 * @interface ItemMetadata
 */

/**
 * The key for the row
 *
 * @export
 * @expose
 * @memberof ItemMetadata
 * @instance
 * @name key
 * @type {any}
 */

 /**
 * The interface for AttributeFilter
 *
 *
 * @export
 * @interface AttributeFilter
 */

/**
 * Property which specifies which attribute to filter on.
 *
 * @export
 * @expose
 * @memberof AttributeFilter
 * @instance
 * @name attribute
 * @type {string}
 */

/**
 * Operator to apply for the filter. Valid operators defined in the AttributeFilterOperator union type are the strings:
 * <ul>
 *   <li>$co The entire operator value must be a substring of the attribute value for a match.</li>
 *   <li>$eq The attribute and operator values must be identical for a match.</li>
 *   <li>$ew The entire operator value must be a substring of the attribute value matching at the end of the attribute value.  This criterion is satisfied if the two strings are identical.</li>
 *   <li>$pr If the attribute has a non-empty or non-null value, or if it contains a non-empty node for complex attributes, there is a match.</li>
 *   <li>$gt If the attribute value is greater than the operator value, there is a match.</li>
 *   <li>$ge If the attribute value is greater than or equal to the operator value, there is a match.</li>
 *   <li>$lt If the attribute value is less than the operator value, there is a match.</li>
 *   <li>$le If the attribute value is less than or equal to the operator value, there is a match.</li>
 *   <li>$ne The attribute and operator values are not identical.</li>
 *   <li>$regex If the attribute value satisfies the regular expression, there is a match.</li>
 *   <li>$sw The entire operator value must be a substring of the attribute value, starting at the beginning of the attribute value.  This criterion is satisfied if the two strings are identical.</li>
 * </ul>
 * @export
 * @expose
 * @memberof AttributeFilter
 * @instance
 * @name op
 * @type {string}
 */

/**
 * Specifies the value to filter for. This can be a primitive or object.
 *
 * @export
 * @expose
 * @memberof AttributeFilter
 * @instance
 * @name value
 * @type {any}
 */

 /**
 * The interface for CompoundFilter
 *
 * @export
 * @interface CompoundFilter
 */

/**
 * Operator to apply for the filter. Valid operators defined in the CompoundFilterOperator are the strings:
 * <ul>
 *   <li>$and The filters in the criteria array will be AND'd.</li>
 *   <li>$or The filters in the criteria array will be OR'd.</li>
 * </ul>
 * 
 * @export
 * @expose
 * @memberof CompoundFilter
 * @instance
 * @name op
 * @type {string}
 */

/**
 * Array of Filters on which to apply the operator
 * 
 * @export
 * @expose
 * @memberof CompoundFilter
 * @instance
 * @name criteria
 * @type {Array.<AttributeFilter | CompoundFilter>}
 */