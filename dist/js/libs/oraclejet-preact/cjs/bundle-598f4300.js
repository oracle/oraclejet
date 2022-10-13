/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'סגור',
    error: () => 'שגיאה',
    warn: () => 'אזהרה',
    info: () => 'מידע',
    confirmation: () => 'אישור',
    progressIndeterminate: () => 'בתהליך',
    inputPassword_show: () => 'הצג סיסמה',
    inputPassword_hide: () => 'הסתר סיסמה',
    inputPassword_hidden: () => 'סיסמה נסתרת',
    formControl_clear: () => 'מחק',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'חריגה מהאורך המרבי ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' תווים נותרו.',
    select_noMatchesFound: () => 'לא נמצאו התאמות',
    select_oneMatchFound: () => 'נמצאה התאמה אחת',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' התאמות נמצאו',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' או יותר התאמות נמצאו',
    selectMultiple_showSelectedValues: () => 'לחץ להצגת רשימה של ערכים נבחרים.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' ערכים נבחרו.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'פרטים נוספים',
    userAssistance_required: () => 'דרוש',
    selectMultiple_showFullList: () => 'לחץ להצגת רשימת הערכים המלאה.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-598f4300.js.map
