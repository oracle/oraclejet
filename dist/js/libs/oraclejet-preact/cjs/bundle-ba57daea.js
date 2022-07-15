/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Kapat',
    error: () => 'Hata',
    warn: () => 'Uyarı',
    info: () => 'bilgi',
    confirmation: () => 'Teyit',
    progressIndeterminate: () => 'Devam Ediyor',
    inputPassword_show: () => 'Parolayı Göster',
    inputPassword_hide: () => 'Parolayı Gizle',
    inputPassword_hidden: () => 'Parola Gizli',
    formControl_clear: () => 'Temizle',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => p['MAX_LENGTH'] + ' olan maksimum uzunluk aşıldı.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' karakter kaldı.',
    select_noMatchesFound: () => 'Eşleşme bulunmadı',
    select_oneMatchFound: () => 'Bir eşleşme bulundu',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' eşleşme bulundu',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' veya daha fazla eşleşme bulundu',
    selectMultiple_showSelectedValues: () => 'Seçili değerler listesini göstermek için tıklayın.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' değer seçili.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Daha fazla bilgi edinin',
    userAssistance_required: () => 'Gerekli',
    selectMultiple_showFullList: () => 'Değerler listesinin tamamını göstermek için tıklayın.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-ba57daea.js.map
