/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojavailabletimezones', 'ojs/ojtimezonedata'], function (exports, ojavailabletimezones, ojtimezonedata) { 'use strict';

    /**
     * A utility class for retrieving available timezones. NOTE: This module automatically
     * imports 'ojs/ojtimezonedata' which is a module with a large amount of data.
     * @since 11.0.0
     * @namespace
     * @name TimeZoneUtils
     * @ojtsmodule
     */

    /**
     * Gets the timezones supported by the JET converters for the current Locale. The data comes from CLDR.
     * <p>
     * If you want to display a list of supported, translated timezone names, then you can use this api.
     * NOTE: This module automatically imports 'ojs/ojtimezonedata' which is a module with a large amount of data.
     * If you want to format a date in the user's local timezone, do not use this api. Instead you
     * should use a iso string that is local to the user's system.
     * For convenience, you can use IntlConverterUtils.dateToLocalIsoDateString or
     * IntlConverterUtils.dateToLocalIso.
     * IntlDateTimeConverter defaults to the user's local timezone, so there is no need to pass in a timezone if that
     * is what you want to show.
     * </p>
     * <p>
     * The returned value is an array of AvailableTimeZoneType objects.
     * Each object represents a timezone
     * and contains 2 properties: <br/>
     * <p style='padding-left: 5px;'>
     * <table class="generic-table styling-table">
     * <thead>
     * <tr>
     * <th>Property</th>
     * <th>Description</th>
     * </tr>
     * </thead>
     * <tbody>
     * <tr>
     * <td>id</td>
     * <td>IANA timezone ID</td>
     * </tr>
     * <tr>
     * <td>displayName</td>
     * <td>It is the concatenation of three strings:<ul>
     * <li>UTC timezone offset</li>
     * <li>Localized city name. Some cities do not have translations, se we have to skip them.</li>
     * <li>Generic time zone name</li>
     * </ul>
     * </td>
     * </tr>
     * </tbody>
     * </table>
     * </p>
     * <p>If you do not use a timezone from this list as the timezone property in JET's datetime converter,
     * the converter will throw an error.
     * </p>
     * @example <caption>Example of an array entry in en-US locale</caption>
     * {id: 'America/Edmonton', displayName: '(UTC-07:00) Edmonton - Mountain Time'} <br/>
     *
     * @example <caption>Example of above entry in fr-FR locale</caption>
     * {id: 'America/Edmonton', displayName: '(UTC-07:00) Edmonton - heure des Rocheuses' } <br/>
     *
     * @static
     * @memberof TimeZoneUtils
     * @method getAvailableTimeZones
     * @export
     * @ojsignature {target: "Type",
     *               value: "(): Array<AvailableTimeZoneType>"}
     * @returns {Array<AvailableTimeZoneType>} supported timezones
     */

    // End of jsdoc

    class TimeZoneUtils {
        static getAvailableTimeZones() {
            return ojavailabletimezones.AvailableTimeZones.getAvailableTimeZonesImpl();
        }
    }

    const getAvailableTimeZones = TimeZoneUtils.getAvailableTimeZones;

    exports.getAvailableTimeZones = getAvailableTimeZones;

    Object.defineProperty(exports, '__esModule', { value: true });

});
