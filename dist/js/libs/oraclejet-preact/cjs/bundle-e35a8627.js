/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'Luk',
    error: () => 'Fejl',
    warn: () => 'Advarsel',
    info: () => 'Information',
    confirmation: () => 'Bekræftelse',
    progressIndeterminate: () => 'I gang',
    inputPassword_show: () => 'Vis adgangskode',
    inputPassword_hide: () => 'Skjul adgangskode',
    inputPassword_hidden: () => 'Adgangskode skjult',
    formControl_clear: () => 'Ryd',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maksimumlængden ' + p['MAX_LENGTH'] + ' er overskredet.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' tegn tilbage.',
    select_noMatchesFound: () => 'Ingen matchninger blev fundet',
    select_oneMatchFound: () => 'Én matchning blev fundet',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' matches fundet',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' eller flere matches fundet',
    selectMultiple_showSelectedValues: () => 'Klik for at se listen over valgte værdier.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' værdier valgt.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Lær mere',
    userAssistance_required: () => 'Påkrævet',
    selectMultiple_showFullList: () => 'Klik for at se den komplette liste over værdier.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-e35a8627.js.map
