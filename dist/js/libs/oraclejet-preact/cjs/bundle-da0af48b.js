/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

const bundle = {
    close: () => 'Затвори',
    error: () => 'Грешка',
    warn: () => 'Упозорење',
    info: () => 'Информације',
    confirmation: () => 'Потврда',
    progressIndeterminate: () => 'У току',
    inputPassword_show: () => 'Прикажи лозинку',
    inputPassword_hide: () => 'Сакриј лозинку',
    inputPassword_hidden: () => 'Лозинка је скривена',
    formControl_clear: () => 'Очисти',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Прекорачена је максимална дужина од ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'Преостало знакова: ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Није пронађено ниједно подударање',
    select_oneMatchFound: () => 'Пронађено је једно подударање',
    select_sizeMatchesFound: (p) => 'Пронађено подударанја: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Пронађено подударанја: најманје ' + p['TOTAL_SIZE'],
    selectMultiple_showSelectedValues: () => 'Кликни за приказ списка изабраних вриједности.',
    selectMultiple_valuesSelected: (p) => 'Изабрано вриједности: ' + p['VALUE_COUNT'] + '.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Сазнај више',
    userAssistance_required: () => 'Обавезно',
    selectMultiple_showFullList: () => 'Кликни за приказ потпуног списка вриједности.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-da0af48b.js.map
