/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'إغلاق',
    error: () => 'خطأ',
    warn: () => 'تحذير',
    info: () => 'معلومات',
    confirmation: () => 'تأكيد',
    progressIndeterminate: () => 'قيد التقدم',
    inputPassword_show: () => 'إظهار كلمة السر',
    inputPassword_hide: () => 'إخفاء كلمة السر',
    inputPassword_hidden: () => 'تم إخفاء كلمة السر',
    formControl_clear: () => 'مسح',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'تم تجاوز الحد الأقصى للطول ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'يتبقى ' + p['CHARACTER_COUNT'] + ' من الحروف.',
    select_noMatchesFound: () => 'لم يتم العثور على عناصر مطابقة',
    select_oneMatchFound: () => 'تم العثور على عنصر مطابق واحد',
    select_sizeMatchesFound: (p) => 'تم العثور على ' + p['TOTAL_SIZE'] + ' من المطابقات',
    select_sizeOrMoreMatchesFound: (p) => 'تم العثور على ' + p['TOTAL_SIZE'] + ' من المطابقات أو أكثر',
    selectMultiple_showSelectedValues: () => 'انقر لعرض قائمة بالقيم المحددة.',
    selectMultiple_valuesSelected: (p) => 'تم تحديد ' + p['VALUE_COUNT'] + ' من القيم.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'تعرف على المزيد',
    userAssistance_required: () => 'مطلوب',
    selectMultiple_showFullList: () => 'انقر لعرض قائمة القيم الكاملة.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-0af23fda.js.map
