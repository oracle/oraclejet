/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { __getBundle } from 'ojs/ojlocaledata';
import { OraTimeZone } from 'ojs/ojoratimezone';
import { OraI18nUtils } from 'ojs/ojconverterutils-i18n';
import 'ojs/ojtimezonedata';

/**
 * A utility class for retrieving available timezones. NOTE: This module automatically
 * imports 'ojs/ojtimezonedata' which is a module with a large amount of data.
 * @since 11.0.0
 * @namespace
 * @name TimeZoneUtils
 * @ojtsmodule
 */

/**
 * Gets the supported timezones for the current Locale.
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
 * <li>City name</li>
 * <li>Generic time zone name</li>
 * </ul>
 * </td>
 * </tr>
 * </tbody>
 * </table>
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

const LocalOraI18nUtils = OraI18nUtils;
const _UTC = 'UTC';
class TimeZoneUtils {
    static getAvailableTimeZones() {
        return TimeZoneUtils._availableTimeZonesImpl(__getBundle());
    }
    static _getBCP47Lang(tag) {
        const arr = tag.split('-');
        return arr[0];
    }
    static _availableTimeZonesImpl(localeElements) {
        const tz = OraTimeZone.getInstance();
        const sortOptions = { sensitivity: 'variant' };
        const sortLocale = LocalOraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        const mainNode = LocalOraI18nUtils.getLocaleElementsMainNode(localeElements);
        const mainNodeKey = LocalOraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        const lang = TimeZoneUtils._getBCP47Lang(mainNodeKey);
        const metaZones = mainNode.dates.timeZoneNames.metazone;
        const cities = mainNode.dates.timeZoneNames.zone;
        const sortedZones = [];
        const offsets = {};
        const tzData = localeElements.supplemental.timeZoneData;
        const d = new Date();
        const dParts = [
            d.getFullYear(),
            d.getMonth() + 1,
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
            d.getSeconds()
        ];
        function _parseZone(zone, parts, dst, ignoreDst, dateTime) {
            const utcDate = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
            return zone.parse(utcDate, dst, ignoreDst, dateTime);
        }
        function _getStdOffset(zone, value) {
            const index = _parseZone(zone, value, false, true, false);
            const offset0 = zone.ofset(index);
            const offset1 = zone.ofset(index + 1);
            return Math.max(offset0, offset1);
        }
        function _parseMetaDate(str) {
            const parts = str.split(' ');
            let dParts = parts[0].split('-');
            const d = new Date(dParts[0], dParts[1] - 1, dParts[2]);
            if (parts.length > 1) {
                dParts = parts[1].split(':');
                d.setHours(dParts[0]);
                d.setMinutes(dParts[1]);
            }
            return d.getTime();
        }
        function _getMetazone(value, zoneName, metazones) {
            const nowObj = new Date(value[0], value[1] - 1, value[2], value[3], value[4], value[5]);
            const now = nowObj.getTime();
            const parts = zoneName.split('/');
            const country = parts[0];
            const city = parts[1];
            let zone = metazones[country];
            if (zone === undefined) {
                return null;
            }
            zone = zone[city];
            if (zone === undefined) {
                return null;
            }
            const length = zone.length;
            let mzoneStartTime;
            let mzoneEndTime;
            for (var i = 0; i < length; i++) {
                const mzoneStart = zone[i].usesMetazone._from;
                const mzoneEnd = zone[i].usesMetazone._to;
                const mzoneName = zone[i].usesMetazone._mzone;
                if (mzoneStart === undefined && mzoneEnd === undefined) {
                    return mzoneName;
                }
                if (mzoneStart === undefined && mzoneEnd !== undefined) {
                    mzoneEndTime = _parseMetaDate(mzoneEnd);
                    if (now <= mzoneEndTime) {
                        return mzoneName;
                    }
                }
                if (mzoneStart !== undefined && mzoneEnd === undefined) {
                    mzoneStartTime = _parseMetaDate(mzoneStart);
                    if (now >= mzoneStartTime) {
                        return mzoneName;
                    }
                }
                if (mzoneStart !== undefined && mzoneEnd !== undefined) {
                    mzoneStartTime = _parseMetaDate(mzoneStart);
                    mzoneEndTime = _parseMetaDate(mzoneEnd);
                    if (now >= mzoneStartTime && now < mzoneEndTime) {
                        return mzoneName;
                    }
                }
            }
            return undefined;
        }
        function getLocalizedName(id, offset, _metaZones, _cities) {
            const parts = id.split('/');
            const region = parts[0];
            const city = parts[1];
            let locCity;
            let locZone;
            const nameObject = { offsetLocName: null, locName: null };
            const metaRegion = _cities[region];
            if (lang === 'en') {
                if (parts[1] !== undefined) {
                    locCity = ' ' + parts[1];
                    locCity = locCity.replace(/_/g, ' ');
                    locCity = locCity.replace('Saigon', 'Ho Chi Minh City');
                }
            }
            else if (metaRegion !== undefined) {
                locCity = metaRegion[city];
                if (locCity !== undefined) {
                    locCity = locCity.exemplarCity;
                    if (locCity !== undefined) {
                        locCity = ' ' + locCity;
                    }
                }
            }
            const _id = region + '/' + city;
            const metazones = localeElements.supplemental.metazones;
            let metaZone = _getMetazone(dParts, _id, metazones);
            if (_metaZones !== undefined) {
                metaZone = _metaZones[metaZone];
            }
            if (metaZone !== undefined && metaZone !== null && metaZone.long !== undefined) {
                locZone = metaZone.long.generic;
                if (locZone === undefined) {
                    locZone = metaZone.long.standard;
                }
            }
            if (locCity === undefined) {
                return null;
            }
            let locName = `(${_UTC})`;
            if (offset !== 0) {
                locName = LocalOraI18nUtils.getTimeStringFromOffset(_UTC, offset, true, true);
                locName = `(${locName})`;
            }
            if (locZone === undefined) {
                locZone = '';
            }
            if (locZone !== '') {
                locZone = ' - ' + locZone;
            }
            nameObject.offsetLocName = locName + locCity + locZone;
            nameObject.locName = locCity + locZone;
            return nameObject;
        }
        function isDuplicateZone(sZones, lName) {
            return sZones.find(({ displayName }) => displayName.offsetLocName === lName.offsetLocName);
        }
        function pushZoneNameObject(zones, sortedZones) {
            let zone;
            let offset;
            const zoneNames = Object.keys(zones);
            for (let i = 0; i < zoneNames.length; i++) {
                let zoneName = zoneNames[i];
                if (zoneName.indexOf('Etc/') === -1 && zoneName.indexOf('Ho_Chi_Minh') === -1) {
                    zone = tz.getZone(zoneName, localeElements);
                    offset = _getStdOffset(zone, dParts);
                    const localizedName = getLocalizedName(zoneName, offset, metaZones, cities);
                    if (localizedName !== null) {
                        var isDuplicate = isDuplicateZone(sortedZones, localizedName);
                        if (!isDuplicate) {
                            if (zoneName === 'Asia/Saigon') {
                                zoneName = 'Asia/Ho_Chi_Minh';
                            }
                            sortedZones.push({
                                id: zoneName,
                                displayName: localizedName
                            });
                        }
                    }
                    offsets[zoneName] = offset;
                }
            }
        }
        const locale = LocalOraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        if (TimeZoneUtils._timeZoneDataCache !== undefined &&
            TimeZoneUtils._timeZoneDataCache[locale] !== undefined) {
            const ret = TimeZoneUtils._timeZoneDataCache[locale].availableTimeZones;
            if (ret !== undefined) {
                return ret;
            }
        }
        pushZoneNameObject(tzData.zones, sortedZones);
        pushZoneNameObject(tzData.links, sortedZones);
        sortedZones.sort(function (a, b) {
            const res1 = offsets[b.id] - offsets[a.id];
            const res2 = a.displayName.locName.localeCompare(b.displayName.locName, sortLocale, sortOptions);
            return res1 + res2;
        });
        const len = sortedZones.length;
        for (let j = 0; j < len; j++) {
            sortedZones[j].displayName = sortedZones[j].displayName.offsetLocName;
        }
        if (TimeZoneUtils._timeZoneDataCache !== undefined &&
            TimeZoneUtils._timeZoneDataCache[locale] === undefined) {
            TimeZoneUtils._timeZoneDataCache[locale] = { availableTimeZones: null };
            TimeZoneUtils._timeZoneDataCache[locale].availableTimeZones = sortedZones;
        }
        return sortedZones;
    }
}
TimeZoneUtils._timeZoneDataCache = {};

const getAvailableTimeZones = TimeZoneUtils.getAvailableTimeZones;

export { getAvailableTimeZones };
