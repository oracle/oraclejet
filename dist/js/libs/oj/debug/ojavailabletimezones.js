/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojlocaledata', 'ojs/ojconverterutils-i18n', 'ojs/ojconfig', 'ojs/ojconverter-nativedatetime'], function (exports, LocaleData, __ConverterUtilsI18n, ojconfig, ojconverterNativedatetime) { 'use strict';

    const LocalOraI18nUtils = __ConverterUtilsI18n.OraI18nUtils;
    const _UTC = 'UTC';
    let intlOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'long'
    };
    const timeZoneIDs = [
        'Africa/Abidjan',
        'Africa/Addis_Ababa',
        'Africa/Algiers',
        'Africa/Bangui',
        'Africa/Blantyre',
        'Africa/Cairo',
        'Africa/Casablanca',
        'Africa/Ceuta',
        'Africa/Johannesburg',
        'Africa/Khartoum',
        'Africa/Tripoli',
        'Africa/Tunis',
        'America/Adak',
        'America/Anchorage',
        'America/Anguilla',
        'America/Argentina/Buenos_Aires',
        'America/Atikokan',
        'America/Belem',
        'America/Belize',
        'America/Boa_Vista',
        'America/Bogota',
        'America/Caracas',
        'America/Chicago',
        'America/Chihuahua',
        'America/Creston',
        'America/Detroit',
        'America/Ensenada',
        'America/Fort_Wayne',
        'America/Glace_Bay',
        'America/Godthab',
        'America/Guatemala',
        'America/Guyana',
        'America/Havana',
        'America/Los_Angeles',
        'America/Managua',
        'America/Merida',
        'America/Miquelon',
        'America/Montevideo',
        'America/Noronha',
        'America/Santiago',
        'America/Sao_Paulo',
        'America/Scoresbysund',
        'America/St_Johns',
        'America/Winnipeg',
        'Antarctica/DumontDUrville',
        'Antarctica/McMurdo',
        'Antarctica/Syowa',
        'Antarctica/Vostok',
        'Asia/Almaty',
        'Asia/Amman',
        'Asia/Anadyr',
        'Asia/Aqtau',
        'Asia/Aqtobe',
        'Asia/Ashgabat',
        'Asia/Baghdad',
        'Asia/Baku',
        'Asia/Bangkok',
        'Asia/Beirut',
        'Asia/Brunei',
        'Asia/Calcutta',
        'Asia/Chongqing',
        'Asia/Colombo',
        'Asia/Dacca',
        'Asia/Damascus',
        'Asia/Dubai',
        'Asia/Gaza',
        'Asia/Hong_Kong',
        'Asia/Irkutsk',
        'Asia/Istanbul',
        'Asia/Jakarta',
        'Asia/Jerusalem',
        'Asia/Kabul',
        'Asia/Karachi',
        'Asia/Kathmandu',
        'Asia/Krasnoyarsk',
        'Asia/Magadan',
        'Asia/Manila',
        'Asia/Nicosia',
        'Asia/Novosibirsk',
        'Asia/Omsk',
        'Asia/Rangoon',
        'Asia/Seoul',
        'Asia/Tehran',
        'Asia/Tokyo',
        'Asia/Vladivostok',
        'Asia/Yakutsk',
        'Asia/Yekaterinburg',
        'Atlantic/Canary',
        'Atlantic/Cape_Verde',
        'Atlantic/South_Georgia',
        'Atlantic/Stanley',
        'Australia/ACT',
        'Australia/Adelaide',
        'Australia/Brisbane',
        'Australia/Currie',
        'Australia/Darwin',
        'Australia/LHI',
        'Australia/Perth',
        'Chile/EasterIsland',
        'Eire',
        'Europe/Belfast',
        'Europe/Kaliningrad',
        'Europe/Moscow',
        'Europe/Riga',
        'Europe/Samara',
        'Europe/Tallinn',
        'Europe/Vilnius',
        'HST',
        'Pacific/Fiji',
        'Pacific/Guam',
        'Pacific/Marquesas',
        'Pacific/Midway',
        'Pacific/Norfolk',
        'Pacific/Tongatapu',
        'Africa/Djibouti',
        'Africa/Harare',
        'Africa/Lagos',
        'Africa/Maputo',
        'Africa/Mogadishu',
        'Africa/Nairobi',
        'Africa/Nouakchott',
        'America/Buenos_Aires',
        'America/Costa_Rica',
        'America/Denver',
        'America/Edmonton',
        'America/El_Salvador',
        'America/Guayaquil',
        'America/Halifax',
        'America/Indiana/Indianapolis',
        'America/Indianapolis',
        'America/Lima',
        'America/Manaus',
        'America/Mazatlan',
        'America/Mexico_City',
        'America/Montreal',
        'America/New_York',
        'America/Panama',
        'America/Phoenix',
        'America/Puerto_Rico',
        'America/Regina',
        'America/Tijuana',
        'America/Toronto',
        'America/Vancouver',
        'Asia/Aden',
        'Asia/Bahrain',
        'Asia/Dhaka',
        'Asia/Kamchatka',
        'Asia/Katmandu',
        'Asia/Kolkata',
        'Asia/Kuala_Lumpur',
        'Asia/Kuwait',
        'Asia/Muscat',
        'Asia/Qatar',
        'Asia/Riyadh',
        'Asia/Saigon',
        'Asia/Shanghai',
        'Asia/Singapore',
        'Asia/Taipei',
        'Asia/Tashkent',
        'Atlantic/Azores',
        'Atlantic/Bermuda',
        'Atlantic/Reykjavik',
        'Australia/Hobart',
        'Australia/Lord_Howe',
        'Australia/Sydney',
        'Europe/Amsterdam',
        'Europe/Athens',
        'Europe/Belgrade',
        'Europe/Belgrade',
        'Europe/Berlin',
        'Europe/Brussels',
        'Europe/Bucharest',
        'Europe/Budapest',
        'Europe/Copenhagen',
        'Europe/Dublin',
        'Europe/Helsinki',
        'Europe/Istanbul',
        'Europe/Kiev',
        'Europe/Lisbon',
        'Europe/London',
        'Europe/Luxembourg',
        'Europe/Madrid',
        'Europe/Oslo',
        'Europe/Paris',
        'Europe/Prague',
        'Europe/Rome',
        'Europe/Sofia',
        'Europe/Stockholm',
        'Europe/Tirane',
        'Europe/Vienna',
        'Europe/Warsaw',
        'Europe/Zurich',
        'Indian/Chagos',
        'Indian/Cocos',
        'Pacific/Auckland',
        'Pacific/Easter',
        'Pacific/Gambier',
        'Pacific/Honolulu',
        'Pacific/Kwajalein',
        'Pacific/Noumea',
        'Pacific/Pago_Pago',
        'Pacific/Pitcairn',
        'US/Aleutian',
        'US/Hawaii',
        'UTC'
    ];
    function getBCP47Lang(tag) {
        const arr = tag.split('-');
        return arr[0];
    }
    function getDatesNode(localeElements) {
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
    function getLocalizedCityName(mainNodeKey, tzID, offset, cities) {
        const parts = tzID.split('/');
        const region = parts[0];
        const city = parts[1];
        let locCity;
        let locZone;
        const lang = getBCP47Lang(mainNodeKey);
        const d = new Date();
        const nameObject = { offsetLocName: null, locName: null };
        const metaRegion = cities[region];
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
        if (locCity === undefined) {
            return null;
        }
        intlOptions.timeZone = tzID;
        let intlCnv = new Intl.DateTimeFormat(mainNodeKey, intlOptions);
        locZone = intlCnv.formatToParts(d).find((obj) => obj.type === 'timeZoneName').value;
        let locName = `(${_UTC})`;
        if (offset !== 0) {
            locName = LocalOraI18nUtils.getTimeStringFromOffset(_UTC, offset, true, true);
            locName = `(${locName})`;
        }
        locZone = ' - ' + locZone;
        nameObject.offsetLocName = locName + locCity + locZone;
        nameObject.locName = locCity + locZone;
        return nameObject;
    }
    function pushZoneNameObject(sortedZones, offsets) {
        const localeElements = LocaleData.__getBundle();
        const mainNode = LocalOraI18nUtils.getLocaleElementsMainNode(localeElements);
        const mainNodeKey = LocalOraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        const dates = getDatesNode(localeElements);
        const cities = dates.timeZoneNames.zone;
        const d = new Date();
        const dateParts = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            date: d.getDate(),
            hours: d.getHours(),
            minutes: d.getMinutes()
        };
        for (let i = 0; i < timeZoneIDs.length; i++) {
            let zoneID = timeZoneIDs[i];
            const offset = -ojconverterNativedatetime.getISODateOffset(dateParts, zoneID);
            const localizedName = getLocalizedCityName(mainNodeKey, zoneID, offset, cities);
            if (localizedName !== null) {
                if (zoneID === 'Asia/Saigon') {
                    zoneID = 'Asia/Ho_Chi_Minh';
                }
                sortedZones.push({
                    id: zoneID,
                    displayName: localizedName
                });
            }
            offsets[zoneID] = offset;
        }
    }
    class AvailableTimeZones {
        static getAvailableTimeZonesImpl() {
            const localeElements = LocaleData.__getBundle();
            const locale = LocalOraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
            const cached = AvailableTimeZones?._timeZoneDataCache[locale]?.availableTimeZones;
            return cached || AvailableTimeZones._availableTimeZonesImpl(localeElements);
        }
        static _availableTimeZonesImpl(localeElements) {
            const sortOptions = { sensitivity: 'variant' };
            const sortedZones = [];
            let offsets = {};
            const locale = LocalOraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
            const sortLocale = LocalOraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
            pushZoneNameObject(sortedZones, offsets);
            sortedZones.sort(function (a, b) {
                const res1 = offsets[b.id] - offsets[a.id];
                const res2 = a.displayName.locName.localeCompare(b.displayName.locName, sortLocale, sortOptions);
                return res1 + res2;
            });
            const len = sortedZones.length;
            for (let j = 0; j < len; j++) {
                sortedZones[j].displayName = sortedZones[j].displayName.offsetLocName;
            }
            AvailableTimeZones._timeZoneDataCache[locale] = { availableTimeZones: sortedZones };
            return sortedZones;
        }
    }
    AvailableTimeZones._timeZoneDataCache = {};

    exports.AvailableTimeZones = AvailableTimeZones;

    Object.defineProperty(exports, '__esModule', { value: true });

});
