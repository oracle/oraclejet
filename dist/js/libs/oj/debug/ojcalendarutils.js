/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

    class CalendarUtils {
        static _getDayPeriods(locale, calendar) {
            var date = new Date(2019, 0, 1, 0, 0, 0);
            function getDayPeriodsFromFormatToParts(formatter) {
                const formatParts = formatter.formatToParts(date);
                const eraPart = formatParts.find((value) => value.type === 'dayPeriod');
                if (eraPart) {
                    return eraPart.value;
                }
            }
            const options = { hour: 'numeric', hour12: true };
            var formatterLocale = CalendarUtils.getFormatterLocale(locale, calendar);
            var formatter = new Intl.DateTimeFormat(formatterLocale, options);
            const amValue = getDayPeriodsFromFormatToParts(formatter);
            date.setHours(20);
            const pmValue = getDayPeriodsFromFormatToParts(formatter);
            return { format: { wide: { am: amValue, pm: pmValue } } };
        }
        static getFormatterLocale(locale, calendar) {
            return locale + '-u-ca-' + calendar;
        }
        static _getEras(locale, calendar) {
            const eras = [{ era: '0', start: '2000-02-11T00:00:00' }];
            var cal = {
                eraNarrow: { '0': '', '1': '' },
                eraAbbr: { '0': '', '1': '' },
                eraName: { '0': '', '1': '' }
            };
            function getEraFromFormatToParts(formatter, date) {
                const formatParts = formatter.formatToParts(date);
                const eraPart = formatParts.find((value) => value.type === 'era');
                if (eraPart) {
                    return eraPart.value;
                }
            }
            const eraLenArray = ['narrow', 'short', 'long'];
            const formatterLocale = CalendarUtils.getFormatterLocale(locale, calendar);
            const eraMap = {
                narrow: 'eraNarrow',
                short: 'eraAbbr',
                long: 'eraName'
            };
            for (let i = 0; i < eras.length; i++) {
                let date = new Date(eras[i].start);
                for (let j = 0; j < eraLenArray.length; j++) {
                    const eraLenName = eraLenArray[j];
                    const options = { year: 'numeric', month: 'numeric', day: 'numeric', era: eraLenName };
                    var formatter = new Intl.DateTimeFormat(formatterLocale, options);
                    const eraForLength = getEraFromFormatToParts(formatter, date);
                    const eraNameForNode = eraMap[eraLenName];
                    const eraObj = { '0': eraForLength, '1': eraForLength };
                    cal[eraNameForNode] = eraObj;
                }
            }
            return cal;
        }
        static _fillMonthAndDays(locale, calendar, widthVal, options, isStandAlone) {
            const dates = [
                [2020, 0, 5],
                [2020, 1, 3],
                [2020, 2, 3],
                [2020, 3, 1],
                [2020, 4, 7],
                [2020, 5, 5],
                [2020, 6, 4],
                [2020, 7, 1],
                [2020, 8, 1],
                [2020, 9, 1],
                [2020, 10, 1],
                [2020, 11, 1]
            ];
            function getMonthFromFormatToParts(formatParts) {
                const monthPart = formatParts.find((value) => value.type === 'month');
                if (monthPart) {
                    return monthPart.value;
                }
                return null;
            }
            function getWeekdayFromFormatToParts(formatParts) {
                const weekdayPart = formatParts.find((value) => value.type === 'weekday');
                if (weekdayPart) {
                    return weekdayPart.value;
                }
                return null;
            }
            const formatterLocale = CalendarUtils.getFormatterLocale(locale, calendar);
            const formatter = new Intl.DateTimeFormat(formatterLocale, options);
            const calMonthFormat = {};
            const calDayFormat = {};
            for (let j = 0; j < dates.length; j++) {
                const index = j + 1;
                const dayIndexVal = CalendarUtils._weekdaysFormatMap[index];
                const date = new Date(dates[j][0], dates[j][1], dates[j][2]);
                const formatParts = formatter.formatToParts(date);
                let month;
                let weekday;
                if (isStandAlone) {
                    month = formatter.format(date);
                    weekday = formatter.format(date);
                }
                else {
                    month = getMonthFromFormatToParts(formatParts);
                    weekday = getWeekdayFromFormatToParts(formatParts);
                }
                if (calMonthFormat[widthVal] === undefined) {
                    calMonthFormat[widthVal] = {};
                }
                calMonthFormat[widthVal][index] = month;
                if (index <= 7) {
                    if (calDayFormat[widthVal] === undefined) {
                        calDayFormat[widthVal] = {};
                    }
                    calDayFormat[widthVal][dayIndexVal] = weekday;
                }
            }
            return {
                monthFormat: calMonthFormat,
                dayFormat: calDayFormat
            };
        }
        static _getFormatMonthAndDays(locale, calendar) {
            const calMonths = [];
            const calDays = [];
            const types = ['short', 'narrow', 'long'];
            for (let i = 0; i < types.length; i++) {
                const options = {
                    month: types[i],
                    weekday: types[i],
                    year: 'numeric',
                    day: 'numeric'
                };
                const widthVal = CalendarUtils._monthNamesFormatMap[types[i]];
                let monthDayObjForWidth = CalendarUtils._fillMonthAndDays(locale, calendar, widthVal, options, false);
                calMonths[i] = monthDayObjForWidth.monthFormat;
                calDays[i] = monthDayObjForWidth.dayFormat;
            }
            const myMonthObj = Object.assign({}, ...calMonths);
            const myDayObj = Object.assign({}, ...calDays);
            let myMonthFormatObj = { format: {} };
            myMonthFormatObj.format = myMonthObj;
            let myDayFormatObj = { format: {} };
            myDayFormatObj.format = myDayObj;
            myMonthFormatObj['stand-alone'] = myMonthFormatObj.format;
            myDayFormatObj['stand-alone'] = myDayFormatObj.format;
            return {
                monthsNode: myMonthFormatObj,
                daysNode: myDayFormatObj
            };
        }
        static _getStandAloneDays(locale, calendar) {
            const calDays = [];
            const types = ['short', 'narrow', 'long'];
            for (let i = 0; i < types.length; i++) {
                var options = {
                    weekday: types[i]
                };
                const widthVal = CalendarUtils._monthNamesFormatMap[types[i]];
                let dayObjForWidth = CalendarUtils._fillMonthAndDays(locale, calendar, widthVal, options, true);
                calDays[i] = dayObjForWidth.dayFormat;
            }
            let myDayObj = Object.assign({}, ...calDays);
            let myDayStandAloneObj = { 'stand-alone': {} };
            myDayStandAloneObj['stand-alone'] = myDayObj;
            return {
                daysNode: myDayStandAloneObj
            };
        }
        static _getStandAloneMonths(locale, calendar) {
            const calMonths = [];
            const types = ['short', 'narrow', 'long'];
            for (let i = 0; i < types.length; i++) {
                var options = {
                    month: types[i]
                };
                const widthVal = CalendarUtils._monthNamesFormatMap[types[i]];
                let monthObjForWidth = CalendarUtils._fillMonthAndDays(locale, calendar, widthVal, options, true);
                calMonths[i] = monthObjForWidth.monthFormat;
            }
            let myMonthObj = Object.assign({}, ...calMonths);
            let myMonthStandAloneObj = { 'stand-alone': {} };
            myMonthStandAloneObj['stand-alone'] = myMonthObj;
            return {
                monthsNode: myMonthStandAloneObj
            };
        }
        static getCalendar(locale, calendar) {
            var _a, _b;
            CalendarUtils.calendars = (_a = CalendarUtils.calendars) !== null && _a !== void 0 ? _a : {};
            CalendarUtils.calendars[locale] = (_b = CalendarUtils.calendars[locale]) !== null && _b !== void 0 ? _b : {};
            if (CalendarUtils.calendars[locale][calendar] === undefined) {
                const dayPeriodsObj = CalendarUtils._getDayPeriods(locale, calendar);
                const erasObj = CalendarUtils._getEras(locale, calendar);
                let monthFormat;
                let dayFormat;
                const standAloneMonths = CalendarUtils._getStandAloneMonths(locale, calendar);
                const standAloneDays = CalendarUtils._getStandAloneDays(locale, calendar);
                const useStandAlone = CalendarUtils.exceptionLocales.includes(locale);
                if (useStandAlone) {
                    monthFormat = standAloneMonths.monthsNode['stand-alone'];
                    dayFormat = standAloneDays.daysNode['stand-alone'];
                }
                else {
                    const monthsDaysNodeObj = CalendarUtils._getFormatMonthAndDays(locale, calendar);
                    monthFormat = monthsDaysNodeObj.monthsNode.format;
                    dayFormat = monthsDaysNodeObj.daysNode.format;
                }
                const monthsNodes = {
                    format: monthFormat,
                    'stand-alone': standAloneMonths.monthsNode['stand-alone']
                };
                const daysNodes = {
                    format: dayFormat,
                    'stand-alone': standAloneDays.daysNode['stand-alone']
                };
                CalendarUtils.calendars[locale][calendar] = {
                    dayPeriods: dayPeriodsObj,
                    months: monthsNodes,
                    days: daysNodes,
                    eras: erasObj,
                    locale: locale
                };
            }
            return CalendarUtils.calendars[locale][calendar];
        }
    }
    CalendarUtils._monthNamesFormatMap = {
        short: 'abbreviated',
        narrow: 'narrow',
        long: 'wide'
    };
    CalendarUtils._weekdaysFormatMap = {
        1: 'sun',
        2: 'mon',
        3: 'tue',
        4: 'wed',
        5: 'thu',
        6: 'fri',
        7: 'sat'
    };
    CalendarUtils.exceptionLocales = [
        'ja',
        'ja-JP',
        'zh',
        'zh-Hans',
        'zh-Hans-CN',
        'zh-Hans-HK',
        'zh-Hans-MO',
        'zh-Hans-SG',
        'zh-Hant',
        'zh-Hant-HK',
        'zh-Hant-MO',
        'zh-Hant-TW'
    ];

    exports.CalendarUtils = CalendarUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

});
