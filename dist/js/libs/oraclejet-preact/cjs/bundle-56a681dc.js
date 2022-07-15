/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Закрыть',
    error: () => 'Ошибка',
    warn: () => 'Предупреждение',
    info: () => 'информация',
    confirmation: () => 'Подтверждение',
    progressIndeterminate: () => 'Выполняется',
    inputPassword_show: () => 'Показать пароль',
    inputPassword_hide: () => 'Скрыть пароль',
    inputPassword_hidden: () => 'Пароль скрыт',
    formControl_clear: () => 'Очистить',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Превышена максимальная длина ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'Осталось символов: ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Совпадений не найдено',
    select_oneMatchFound: () => 'Найдено одно совпадение',
    select_sizeMatchesFound: (p) => 'Найдено совпадений: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Найдено совпадений: ' + p['TOTAL_SIZE'] + ' или более',
    selectMultiple_showSelectedValues: () => 'Щелкните для отображения списка выбранных значений.',
    selectMultiple_valuesSelected: (p) => 'Выбрано значений: ' + p['VALUE_COUNT'] + '.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Дополнительные сведения',
    userAssistance_required: () => 'Обязательно',
    selectMultiple_showFullList: () => 'Щелкните для отображения полного списка значений.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-56a681dc.js.map
