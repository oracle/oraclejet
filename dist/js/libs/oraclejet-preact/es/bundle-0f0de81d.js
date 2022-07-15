/* @oracle/oraclejet-preact: 13.0.0 */
const bundle = {
    close: () => 'Затваряне',
    error: () => 'Грешка',
    warn: () => 'Предупреждение',
    info: () => 'информация',
    confirmation: () => 'Потвърждение',
    progressIndeterminate: () => 'Изпълнява се',
    inputPassword_show: () => 'Показване на парола',
    inputPassword_hide: () => 'Скриване на парола',
    inputPassword_hidden: () => 'Паролата е скрита',
    formControl_clear: () => 'Изчистване',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Надвишена е максималната дължина от ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'Остават ' + p['CHARACTER_COUNT'] + ' знака.',
    select_noMatchesFound: () => 'Няма намерени съвпадения',
    select_oneMatchFound: () => 'Намерено е едно съвпадение',
    select_sizeMatchesFound: (p) => 'Открити са ' + p['TOTAL_SIZE'] + ' съвпадения',
    select_sizeOrMoreMatchesFound: (p) => 'Открити са ' + p['TOTAL_SIZE'] + ' или повече съвпадения',
    selectMultiple_showSelectedValues: () => 'Щракнете, за да се покаже пълният списък с избраните стойности.',
    selectMultiple_valuesSelected: (p) => 'Избрани са ' + p['VALUE_COUNT'] + ' стойности.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Научете повече',
    userAssistance_required: () => 'Задължително',
    selectMultiple_showFullList: () => 'Щракнете, за да се покаже пълният списък със стойности.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-0f0de81d.js.map
