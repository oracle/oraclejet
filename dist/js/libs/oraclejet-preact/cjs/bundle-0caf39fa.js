/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

const bundle = {
    close: () => 'Κλείσιμο',
    error: () => 'Σφάλμα',
    warn: () => 'Προειδοποίηση',
    info: () => 'πληροφορίες',
    confirmation: () => 'Επιβεβαίωση',
    progressIndeterminate: () => 'Σε εξέλιξη',
    inputPassword_show: () => 'Εμφ. κωδ. πρόσβασης',
    inputPassword_hide: () => 'Απόκρυψη κωδικού πρόσβασης',
    inputPassword_hidden: () => 'Ο κωδικός πρόσβασης κρύφτηκε',
    formControl_clear: () => 'Εκκαθάριση',
    formControl_loading: () => 'Loading',
    formControl_maxLengthExceeded: (p) => 'Υπέρβαση μέγιστου μήκους ' + p['MAX_LENGTH'] + '.',
    formControl_maxLengthRemaining: (p) => 'Απομένουν ' + p['CHARACTER_COUNT'] + ' χαρακτήρες.',
    select_noMatchesFound: () => 'Δεν βρέθηκαν αποτελέσματα.',
    select_oneMatchFound: () => 'Βρέθηκε ένα αποτέλεσμα',
    select_sizeMatchesFound: (p) => 'Βρέθηκαν ' + p['TOTAL_SIZE'] + ' αποτελέσματα',
    select_sizeOrMoreMatchesFound: (p) => 'Βρέθηκαν ' + p['TOTAL_SIZE'] + ' ή περισσότερα αποτελέσματα',
    selectMultiple_showSelectedValues: () => 'Κάντε κλικ για εμφάνιση της λίστας επιλεγμένων τιμών.',
    selectMultiple_valuesSelected: (p) => 'Επιλέχθηκαν ' + p['VALUE_COUNT'] + ' τιμές.',
    selectMultiple_countPlus: (p) => p['COUNT'] + '+',
    selector_selected: () => 'Checkbox checked',
    selector_unselected: () => 'Checkbox not checked',
    userAssistance_learnMore: () => 'Μάθετε περισσότερα',
    userAssistance_required: () => 'Απαιτείται',
    selectMultiple_showFullList: () => 'Κάντε κλικ για εμφάνιση της πλήρους λίστας τιμών.'
};

exports["default"] = bundle;
/*  */
//# sourceMappingURL=bundle-0caf39fa.js.map
