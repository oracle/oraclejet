/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'Zavřít',
    error: () => 'Chyba',
    warn: () => 'Varování',
    info: () => 'informace',
    confirmation: () => 'Potvrzení',
    progressIndeterminate: () => 'Probíhá',
    inputPassword_show: () => 'Zobrazit heslo',
    inputPassword_hide: () => 'Skrýt heslo',
    inputPassword_hidden: () => 'Heslo skryté',
    formControl_clear: () => 'Vymazat',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Maximální délka ' + p['MAX_LENGTH'] + ' překročena.',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + ' zbývajících znaků.',
    select_noMatchesFound: () => 'Nebyly nalezeny žádné shody',
    select_oneMatchFound: () => 'Nalezena jedna odpovídající položka',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + ' - počet nalezených shod',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + ' nebo více shod nalezeno',
    selectMultiple_showSelectedValues: () => 'Kliknutím zobrazíte seznam vybraných hodnot.',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + ' -  vybrané hodnoty.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Další informace',
    userAssistance_required: () => 'Požadováno',
    selectMultiple_showFullList: () => 'Kliknutím zobrazíte úplný seznam hodnot.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-5cb760fc.js.map
