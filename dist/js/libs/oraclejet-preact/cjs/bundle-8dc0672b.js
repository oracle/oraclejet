/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Затвори',
    error: () => 'Грешка',
    warn: () => 'Упозорење',
    info: () => 'информације',
    confirmation: () => 'Потврда',
    progressIndeterminate: () => 'У току',
    inputPassword_show: () => 'Прикажи лозинку',
    inputPassword_hide: () => 'Сакриј лозинку',
    inputPassword_hidden: () => 'Лозинка је скривена',
    formControl_clear: () => 'Обриши',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Максимална дужина од ' + p['MAX_LENGTH'] + ' је премашена.',
    formControl_maxLengthRemaining: (p) => 'Преостали број знакова је ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Није пронађен ниједан погодак',
    select_oneMatchFound: () => 'Пронађен је један резултат',
    select_sizeMatchesFound: (p) => 'Пронађених подударања: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Пронађених подударања: ' + p['TOTAL_SIZE'] + ' или више',
    selectMultiple_showSelectedValues: () => 'Кликните да би се приказала листа изабраних вредности.',
    selectMultiple_valuesSelected: (p) => 'Изабраних вредности: ' + p['VALUE_COUNT'] + ' .',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Сазнајте више',
    userAssistance_required: () => 'Обавезно',
    selectMultiple_showFullList: () => 'Кликните да би се приказала комплетна листа вредности.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-8dc0672b.js.map
