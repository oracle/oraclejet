/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojlocaledata', 'ojs/ojoratimezone', 'ojs/ojconverterutils-i18n', 'ojs/ojconfig'], function (exports, LocaleData, ojoratimezone, __ConverterUtilsI18n, ojconfig) { 'use strict';

    const LocalOraI18nUtils = __ConverterUtilsI18n.OraI18nUtils;
    const _UTC = 'UTC';
    class AvailableTimeZones {
        static getAvailableTimeZonesImpl() {
            return AvailableTimeZones._availableTimeZonesImpl(LocaleData.__getBundle());
        }
        static _getBCP47Lang(tag) {
            const arr = tag.split('-');
            return arr[0];
        }
        static getDatesNode(localeElements) {
            function getDates(locale) {
                let datesNode = null;
                const mainNode = localeElements.main[locale];
                if (mainNode) {
                    datesNode = mainNode.dates;
                }
                return datesNode;
            }
            let locale = ojconfig.getLocale();
            let dates = getDates(locale);
            if (dates) {
                return dates;
            }
            let parts = locale.split('-');
            parts.pop();
            while (parts.length > 0) {
                locale = parts.join('-');
                dates = getDates(locale);
                if (dates) {
                    return dates;
                }
                parts.pop();
            }
            return localeElements.main['en-US'].dates;
        }
        static _availableTimeZonesImpl(localeElements) {
            const tz = ojoratimezone.OraTimeZone.getInstance();
            const sortOptions = { sensitivity: 'variant' };
            const sortLocale = LocalOraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
            const mainNode = LocalOraI18nUtils.getLocaleElementsMainNode(localeElements);
            const mainNodeKey = LocalOraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
            const lang = AvailableTimeZones._getBCP47Lang(mainNodeKey);
            const dates = AvailableTimeZones.getDatesNode(localeElements);
            const metaZones = dates.timeZoneNames.metazone;
            const cities = dates.timeZoneNames.zone;
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
            if (AvailableTimeZones._timeZoneDataCache !== undefined &&
                AvailableTimeZones._timeZoneDataCache[locale] !== undefined) {
                const ret = AvailableTimeZones._timeZoneDataCache[locale].availableTimeZones;
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
            if (AvailableTimeZones._timeZoneDataCache !== undefined &&
                AvailableTimeZones._timeZoneDataCache[locale] === undefined) {
                AvailableTimeZones._timeZoneDataCache[locale] = { availableTimeZones: null };
                AvailableTimeZones._timeZoneDataCache[locale].availableTimeZones = sortedZones;
            }
            return sortedZones;
        }
    }
    AvailableTimeZones._timeZoneDataCache = {};

    exports.AvailableTimeZones = AvailableTimeZones;

    Object.defineProperty(exports, '__esModule', { value: true });

});
