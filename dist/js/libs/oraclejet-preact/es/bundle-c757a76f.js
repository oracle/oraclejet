/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => '關閉',
    error: () => '錯誤',
    warn: () => '警告',
    info: () => '資訊',
    confirmation: () => '確認',
    progressIndeterminate: () => '進行中',
    inputPassword_show: () => '顯示密碼',
    inputPassword_hide: () => '隱藏密碼',
    inputPassword_hidden: () => '已隱藏密碼',
    formControl_clear: () => '清除',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => '超過長度上限 ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => '還有 ' + p['CHARACTER_COUNT'] + ' 個字元.',
    select_noMatchesFound: () => '找不到相符項目',
    select_oneMatchFound: () => '找到一個相符項目',
    select_sizeMatchesFound: (p) => '找到 ' + p['TOTAL_SIZE'] + ' 個相符項目',
    select_sizeOrMoreMatchesFound: (p) => '找到 ' + p['TOTAL_SIZE'] + ' 個以上的相符項目',
    selectMultiple_showSelectedValues: () => '按一下以顯示選取的值清單.',
    selectMultiple_valuesSelected: (p) => '已選取 ' + p['VALUE_COUNT'] + ' 個值.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => '進一步瞭解',
    userAssistance_required: () => '必要',
    selectMultiple_showFullList: () => '按一下以顯示完整的值清單.'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-c757a76f.js.map
