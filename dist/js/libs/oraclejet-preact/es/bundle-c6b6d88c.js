/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => 'Закрити',
    error: () => 'Помилка',
    warn: () => 'Попередження',
    info: () => 'відомості',
    confirmation: () => 'Підтвердження',
    progressIndeterminate: () => 'Триває',
    inputPassword_show: () => 'Показати пароль',
    inputPassword_hide: () => 'Приховати пароль',
    inputPassword_hidden: () => 'Пароль приховано',
    formControl_clear: () => 'Очистити',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Максимальну довжину (' + p['MAX_LENGTH'] + ') перевищено.',
    formControl_maxLengthRemaining: (p) => 'Залишилася така кількість символів: ' + p['CHARACTER_COUNT'] + '.',
    select_noMatchesFound: () => 'Збігів не знайдено',
    select_oneMatchFound: () => 'Знайдено один збіг',
    select_sizeMatchesFound: (p) => 'Знайдено таку кількість збігів: ' + p['TOTAL_SIZE'],
    select_sizeOrMoreMatchesFound: (p) => 'Знайдено ' + p['TOTAL_SIZE'] + ' або більше збігів',
    selectMultiple_showSelectedValues: () => 'Клацніть, щоб показати список вибраних значень.',
    selectMultiple_valuesSelected: (p) => 'Вибрано таку кількість значень: ' + p['VALUE_COUNT'] + '.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Додаткові відомості',
    userAssistance_required: () => "Обов'язково",
    selectMultiple_showFullList: () => 'Клацніть, щоб показати повний список значень.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-c6b6d88c.js.map
