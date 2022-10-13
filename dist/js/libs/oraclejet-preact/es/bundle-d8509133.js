/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => 'Tutup',
    error: () => 'Ralat',
    warn: () => 'Amaran',
    info: () => 'maklumat',
    confirmation: () => 'Pengesahan',
    progressIndeterminate: () => 'Dalam Proses',
    inputPassword_show: () => 'Tunjukkan Kata Laluan',
    inputPassword_hide: () => 'Sembunyikan Kata Laluan',
    inputPassword_hidden: () => 'Kata Laluan Disembunyikan',
    formControl_clear: () => 'Kosongkan',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Panjang maksimum ' + p['MAX_LENGTH'] + ' dicapai.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' aksara lagi.',
    select_noMatchesFound: () => 'Tiada padanan ditemui',
    select_oneMatchFound: () => 'Satu padanan ditemui',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' padanan ditemukan',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' atau lebih padanan ditemukan',
    selectMultiple_showSelectedValues: () => 'Klik untuk menunjukkan senarai nilai yang dipilih.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' nilai dipilih.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Ketahui lebih lanjut',
    userAssistance_required: () => 'Diperlukan',
    selectMultiple_showFullList: () => 'Klik untuk menunjukkan senarai penuh nilai.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-d8509133.js.map
