/* @oracle/oraclejet-preact: 13.1.0 */
const bundle = {
    close: () => '閉じる',
    error: () => 'エラー',
    warn: () => '警告',
    info: () => '情報',
    confirmation: () => '確認',
    progressIndeterminate: () => '進行中',
    inputPassword_show: () => 'パスワードの表示',
    inputPassword_hide: () => 'パスワードの非表示',
    inputPassword_hidden: () => 'パスワード非表示',
    formControl_clear: () => 'クリア',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => '最大長' + p['MAX_LENGTH'] + 'を超えています。',
    formControl_maxLengthRemaining: (p) => p['CHARACTER_COUNT'] + '文字残っています。',
    select_noMatchesFound: () => '一致する検索文字列が見つかりませんでした。',
    select_oneMatchFound: () => '一致が1つ見つかりました',
    select_sizeMatchesFound: (p) => p['TOTAL_SIZE'] + '件の一致が見つかりました',
    select_sizeOrMoreMatchesFound: (p) => p['TOTAL_SIZE'] + '件以上の一致が見つかりました',
    selectMultiple_showSelectedValues: () => 'クリックすると、選択した値のリストが表示されます。',
    selectMultiple_valuesSelected: (p) => p['VALUE_COUNT'] + '個の値が選択されました。',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'さらに学ぶ',
    userAssistance_required: () => '必須',
    selectMultiple_showFullList: () => 'クリックすると、値の完全なリストが表示されます。'
};

export { bundle as default };
/*  */
//# sourceMappingURL=bundle-86fb42d5.js.map
