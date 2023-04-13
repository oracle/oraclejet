define({"oj-message":{fatal:"Kritická",error:"Chyba",warning:"Varování",info:"Informace",confirmation:"Potvrzení","compact-type-summary":"{0}: {1}"},"oj-converter":{summary:"Hodnota nemá očekávaný formát.",detail:"Zadejte hodnotu v očekávaném formátu","plural-separator":", ",hint:{summary:"Příklad: {exampleValue}",detail:"Zadejte hodnotu v tomto formátu: '{exampleValue}'.","detail-plural":"Zadejte hodnotu v těchto formátech: '{exampleValue}'."},optionHint:{detail:"Přijatá hodnota pro volbu '{propertyName}' je '{propertyValueValid}'.","detail-plural":"Přijaté hodnoty pro volbu '{propertyName}' jsou '{propertyValueValid}'."},optionTypesMismatch:{summary:"Hodnota pro volbu '{requiredPropertyName}' je vyžadována, pokud je volba '{propertyName}' nastavena na hodnotu '{propertyValue}'."},optionTypeInvalid:{summary:"Nebyla poskytnuta hodnota očekávaného typu pro volbu '{propertyName}'."},optionOutOfRange:{summary:"Hodnota {propertyValue} je mimo přípustný rozsah pro volbu '{propertyName}'."},optionValueInvalid:{summary:"Byla zadána neplatná hodnota '{propertyValue}' pro volbu '{propertyName}'."},number:{decimalFormatMismatch:{summary:"Poskytnutá hodnota není v očekávaném formátu čísla."},shortLongUnsupportedParse:{summary:"'krátký' a 'dlouhý' nejsou podporovány pro převedenou analýzu.",detail:"Změňte komponentu na readonly. Pole readonly nevyvolávají funkci analýzy převodu."},currencyFormatMismatch:{summary:"Poskytnutá hodnota není v očekávaném formátu měny."},percentFormatMismatch:{summary:"Poskytnutá hodnota není v očekávaném formátu procenta."},invalidNumberFormat:{summary:"Poskytnutá hodnota není platným číslem.",detail:"Zadejte platné číslo."}},color:{invalidFormat:{summary:"Neplatný formát barvy.",detail:"Neplatné zadání volby formátu barvy."},invalidSyntax:{summary:"Neplatná specifikace barvy.",detail:"Zadejte hodnotu barvy, která odpovídá standardu CSS3."}},datetime:{datetimeOutOfRange:{summary:"Hodnota '{value}' je mimo přípustný rozsah pro volbu '{propertyName}'.",detail:"Zadejte hodnotu mezi '{minValue}' a '{maxValue}'.",hour:"hodina",minute:"minuta",second:"sekunda",millisec:"ms",month:"měsíc",day:"den",year:"rok","month name":"název měsíce",weekday:"pracovní den"},dateFormatMismatch:{summary:"Poskytnutá hodnota není v očekávaném formátu data."},invalidTimeZoneID:{summary:"Bylo zadáno neplatné ID časového pásma {timeZoneID}."},nonExistingTime:{summary:"Vstupní čas neexistuje, protože spadá do doby přechodu na letní čas."},missingTimeZoneData:{summary:"Data TimeZone scházejí. Uveďte volání require 'ojs/ojtimezonedata', aby se načetla dat TimeZone."},timeFormatMismatch:{summary:"Poskytnutá hodnota není v očekávaném formátu času."},datetimeFormatMismatch:{summary:"Poskytnutá hodnota není v očekávaném formátu data a času."},dateToWeekdayMismatch:{summary:"Den '{date}' není '{weekday}'.",detail:"Zadejte den v týdnu, který odpovídá tomuto datu."},invalidISOString:{invalidRangeSummary:"Hodnota '{value}' pole '{propertyName}' v řetězci '{isoStr}' ISO 8601 je mimo rozsah.",summary:"Zadaný údaj '{isoStr}' není platný řetězec ISO 8601.",detail:"Zadejte platný řetězec ISO 8601."}}},"oj-validator":{length:{hint:{min:"Zadejte {min} nebo více znaků.",max:"Zadejte {max} nebo méně znaků.",inRange:"Zadejte {min} až {max} znaků.",exact:"Zadejte {length} znaků."},messageDetail:{tooShort:"Zadejte {min} nebo více znaků.",tooLong:"Zadejte maximálně {max} znaků."},messageSummary:{tooShort:"Je zadáno příliš málo znaků.",tooLong:"Je zadáno příliš mnoho znaků."}},range:{number:{hint:{min:"Zadejte číslo větší nebo rovné {min}.",max:"Zadejte číslo menší nebo rovné {max}.",inRange:"Zadejte číslo mezi {min} a {max}.",exact:"Zadejte číslo {num}."},messageDetail:{rangeUnderflow:"Zadejte minimálně {min} nebo vyšší číslo.",rangeOverflow:"Zadejte maximálně {max} nebo nižší číslo.",exact:"Zadejte číslo {num}."},messageSummary:{rangeUnderflow:"Číslo je příliš nízké.",rangeOverflow:"Číslo je příliš vysoké."}},datetime:{hint:{min:"Zadejte datum a čas shodné s {min} nebo pozdější.",max:"Zadejte datum a čas shodné s {max} nebo dřívější.",inRange:"Zadejte datum a čas mezi {min} a {max}."},messageDetail:{rangeUnderflow:"Zadejte datum po nebo přesně {min}.",rangeOverflow:"Zadejte datum před nebo přesně {max}."},messageSummary:{rangeUnderflow:"Datum a čas jsou dřívější než minimální datum a čas.",rangeOverflow:"Datum a čas jsou pozdější než maximální datum a čas."}},date:{hint:{min:"Zadejte datum po nebo přesně {min}.",max:"Zadejte datum před nebo přesně {max}.",inRange:"Zadejte datum mezi {min} a {max}."},messageDetail:{rangeUnderflow:"Zadejte datum po nebo přesně {min}.",rangeOverflow:"Zadejte datum před nebo přesně {max}."},messageSummary:{rangeUnderflow:"Datum je dřívější než minimální datum.",rangeOverflow:"Datum je pozdější než maximální datum."}},time:{hint:{min:"Zadejte čas po nebo přesně {min}.",max:"Zadejte čas před nebo přesně {max}.",inRange:"Zadejte čas mezi {min} a {max}."},messageDetail:{rangeUnderflow:"Zadejte čas v nebo po {min}.",rangeOverflow:"Zadejte čas v nebo před {max}."},messageSummary:{rangeUnderflow:"Čas je dřívější než minimální čas.",rangeOverflow:"Čas je pozdější než maximální čas."}}},restriction:{date:{messageSummary:"Datum {value} je datem deaktivované položky.",messageDetail:"Datum, které jste vybrali, není dostupné. Zkuste jiné datum."}},regExp:{summary:"Formát není správný.",detail:"Zadejte povolené hodnoty popsané v tomto regulárním výrazu: '{pattern}'."},required:{summary:"Je požadována hodnota.",detail:"Zadejte hodnotu."}},"oj-ojEditableValue":{loading:"Načítání",requiredText:"Požadováno",helpSourceText:"Další informace…"},"oj-ojInputDate":{done:"Hotovo",cancel:"Zrušit",time:"Čas",prevText:"Předchozí",nextText:"Další",currentText:"Dnes",weekHeader:"Týd",tooltipCalendar:"Vybrat datum.",tooltipCalendarTime:"Vybrat datum/čas.",tooltipCalendarDisabled:"Výběr data deaktivován.",tooltipCalendarTimeDisabled:"Volba Vybrat datum/čas deaktivována.",picker:"Nástroj pro výběr",weekText:"Týden",datePicker:"Nástroj pro výběr data",inputHelp:"Stisknutím klávesy se šipkou dolů nebo klávesy se šipkou nahoru přejdete ke kalendáři.",inputHelpBoth:"Stisknutím klávesy se šipkou dolů nebo klávesy se šipkou nahoru přejdete ke kalendáři, stisknutím kláves Shift a šipky dolů nebo Shift a šipky nahoru přejdete k rozevíracímu seznamu času.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},dateRestriction:{hint:"",messageSummary:"",messageDetail:""}},"oj-ojInputTime":{cancelText:"Zrušit",okText:"OK",currentTimeText:"Nyní",hourWheelLabel:"Hodina",minuteWheelLabel:"Minuta",ampmWheelLabel:"dop/odp",tooltipTime:"Vybrat čas.",tooltipTimeDisabled:"Výběr času deaktivován.",inputHelp:"Stisknutím klávesy se šipkou dolů nebo klávesy se šipkou nahoru přejdete k rozevírací nabídce času.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}}},"oj-inputBase":{required:{hint:"",messageSummary:"",messageDetail:""},regexp:{messageSummary:"",messageDetail:""},accessibleMaxLengthExceeded:"Maximální délka {len} překročena.",accessibleMaxLengthRemaining:"Zbývající počet znaků: {chars}."},"oj-ojInputText":{accessibleClearIcon:"Vymazat"},"oj-ojInputPassword":{regexp:{messageDetail:"Hodnota musí odpovídat tomuto vzoru: '{pattern}'."},accessibleShowPassword:"Zobrazit heslo.",accessibleHidePassword:"Skrytí hesla."},"oj-ojFilmStrip":{labelAccFilmStrip:"Zobrazovací stránka {pageIndex} z {pageCount}",labelAccArrowNextPage:"Výběrem volby Další si zobrazte další stránku",labelAccArrowPreviousPage:"Výběrem volby Předchozí si zobrazte předchozí stránku",tipArrowNextPage:"Další",tipArrowPreviousPage:"Předchozí"},"oj-ojDataGrid":{accessibleSortAscending:"{id} seřazeno vzestupně",accessibleSortDescending:"{id} seřazeno sestupně",accessibleSortable:"{id} lze řadit",accessibleActionableMode:"Přejít do režimu umožňujícího provádět akce.",accessibleNavigationMode:"Vstupte do režimu navigace, stisknutím klávesy F2 vstupte do režimu úprav nebo režimu umožňujícího akce.",accessibleEditableMode:"Vstupte do režimu úprav, stisknutím klávesy Escape přejděte mimo do datové mřížky.",accessibleSummaryExact:"Jedná se o datovou mřížku s {rownum} řádky a {colnum} sloupci",accessibleSummaryEstimate:"Jedná se o datovou mřížku s neznámým počtem řádků a sloupců",accessibleSummaryExpanded:"Aktuálně je rozbaleno {num} řádků",accessibleRowExpanded:"Řádek rozbalen",accessibleExpanded:"Rozbaleno",accessibleRowCollapsed:"Řádek sbalen",accessibleCollapsed:"Sbaleno",accessibleRowSelected:"Vybrán řádek {row}",accessibleColumnSelected:"Vybrán sloupec {column}",accessibleStateSelected:"vybráno",accessibleMultiCellSelected:"Vybráno {num} buněk",accessibleColumnSpanContext:"{extent} široké",accessibleRowSpanContext:"{extent} vysoké",accessibleRowContext:"Řádek {index}",accessibleColumnContext:"Sloupec {index}",accessibleRowHeaderContext:"Záhlaví řádku {index}",accessibleColumnHeaderContext:"Záhlaví sloupce {index}",accessibleRowEndHeaderContext:"Záhlaví konce řádku {index}",accessibleColumnEndHeaderContext:"Záhlaví konce sloupce {index}",accessibleRowHeaderLabelContext:"Označení záhlaví řádku {level}",accessibleColumnHeaderLabelContext:"Označení záhlaví sloupce {level}",accessibleRowEndHeaderLabelContext:"Označení záhlaví konce řádku {level}",accessibleColumnEndHeaderLabelContext:"Označení záhlaví konce sloupce {level}",accessibleLevelContext:"Úroveň {level}",accessibleRangeSelectModeOn:"Režim přidání vybraného rozsahu buněk je zapnutý.",accessibleRangeSelectModeOff:"Režim přidání vybraného rozsahu buněk je vypnutý.",accessibleFirstRow:"Dosáhli jste prvního řádku.",accessibleLastRow:"Dosáhli jste posledního řádku.",accessibleFirstColumn:"Dosáhli jste prvního sloupce",accessibleLastColumn:"Dosáhli jste posledního sloupce.",accessibleSelectionAffordanceTop:"Deskriptor horního výběru.",accessibleSelectionAffordanceBottom:"Deskriptor dolního výběru.",accessibleLevelHierarchicalContext:"Úroveň {level}",accessibleRowHierarchicalFull:"Řádek {posInSet} z {setSize} řádků",accessibleRowHierarchicalPartial:"Řádek {posInSet} z alespoň {setSize} řádků",accessibleRowHierarchicalUnknown:"Alespoň řádek {posInSet} z alespoň {setSize} řádků",accessibleColumnHierarchicalFull:"Sloupec {posInSet} z {setSize} sloupců",accessibleColumnHierarchicalPartial:"Sloupec {posInSet} z alespoň {setSize} sloupců",accessibleColumnHierarchicalUnknown:"Alespoň sloupec {posInSet} z alespoň {setSize} sloupců",msgFetchingData:"Načítání dat...",msgNoData:"Neexistují položky k zobrazení",labelResize:"Změnit velikost",labelResizeWidth:"Šířka pro změnu velikosti",labelResizeHeight:"Výška pro změnu velikosti",labelSortAsc:"Seřadit vzestupně",labelSortDsc:"Seřadit sestupně",labelSortRow:"Seřadit řádek",labelSortRowAsc:"Seřadit řádek vzestupně",labelSortRowDsc:"Seřadit řádek sestupně",labelSortCol:"Seřadit sloupec",labelSortColAsc:"Seřadit sloupec vzestupně",labelSortColDsc:"Seřadit sloupec sestupně",labelCut:"Vyjmout",labelPaste:"Vložit",labelCutCells:"Vyjmout",labelPasteCells:"Vložit",labelCopyCells:"Kopírovat",labelAutoFill:"Automaticky vyplnit",labelEnableNonContiguous:"Povolit nesouvislý výběr",labelDisableNonContiguous:"Deaktivovat nesouvislý výběr",labelResizeDialogSubmit:"OK",labelResizeDialogCancel:"Zrušit",accessibleContainsControls:"Obsahuje ovládací prvky",labelSelectMultiple:"Vybrat více",labelResizeDialogApply:"Použít",labelResizeFitToContent:"Přizpůsobit velikosti",columnWidth:"Šířka v pixelech",rowHeight:"Výška v pixelech",labelResizeColumn:"Změnit velikost sloupce",labelResizeRow:"Změnit velikost řádku",resizeColumnDialog:"Změnit velikost sloupce",resizeRowDialog:"Změnit velikost řádku",collapsedText:"Sbalit",expandedText:"Rozbalit",tooltipRequired:"Požadováno"},"oj-ojRowExpander":{accessibleLevelDescription:"Úroveň {level}",accessibleRowDescription:"Úroveň {level}, řádek {num} z {total}",accessibleRowExpanded:"Řádek rozbalen",accessibleRowCollapsed:"Řádek sbalen",accessibleStateExpanded:"rozbaleno",accessibleStateCollapsed:"sbaleno"},"oj-ojStreamList":{msgFetchingData:"Načítání dat..."},"oj-ojListView":{msgFetchingData:"Načítání dat...",msgNoData:"Neexistují položky k zobrazení",msgItemsAppended:"{count} položek přidáno na konec.",msgFetchCompleted:"Všechny položky jsou načteny.",indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",accessibleExpandCollapseInstructionText:"Pomocí kláves se šipkami obsah rozbalíte a sbalíte.",accessibleGroupExpand:"Rozbaleno",accessibleGroupCollapse:"Sbaleno",accessibleReorderTouchInstructionText:"Dvakrát klepněte a podržte.  Počkejte na zaznění tónu a pak tažením upravte uspořádání.",accessibleReorderBeforeItem:"Před {item}",accessibleReorderAfterItem:"Za {item}",accessibleReorderInsideItem:"Dovn&itř {item}",accessibleNavigateSkipItems:"Přeskočení {numSkip} položek",labelCut:"Vyjmout",labelCopy:"Kopírovat",labelPaste:"Vložit",labelPasteBefore:"Vložit před",labelPasteAfter:"Vložit za"},"oj-ojWaterfallLayout":{msgFetchingData:"Načítání dat..."},"oj-_ojLabel":{tooltipHelp:"Nápověda",tooltipRequired:"Požadováno"},"oj-ojLabel":{tooltipHelp:"Nápověda",tooltipRequired:"Požadováno"},"oj-ojInputNumber":{required:{hint:"",messageSummary:"",messageDetail:""},numberRange:{hint:{min:"",max:"",inRange:"",exact:""},messageDetail:{rangeUnderflow:"",rangeOverflow:"",exact:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},tooltipDecrement:"Úbytek",tooltipIncrement:"Přírůstek"},"oj-ojTable":{accessibleAddRow:"Zadáním dat přidáte novou řádku.",accessibleColumnContext:"Sloupec {index}",accessibleColumnFooterContext:"Zápatí sloupce {index}",accessibleColumnHeaderContext:"Záhlaví sloupce {index}",accessibleContainsControls:"Obsahuje ovládací prvky",accessibleColumnsSpan:"Zahrnuje {count} sloupců",accessibleRowContext:"Řádek {index}",accessibleSortable:"{id} lze řadit",accessibleSortAscending:"{id} seřazeno vzestupně",accessibleSortDescending:"{id} seřazeno sestupně",accessibleStateSelected:"vybráno",accessibleStateUnselected:"výběr zrušen",accessibleSummaryEstimate:"Tabulka s {colnum} sloupci a více než {rownum} řádky",accessibleSummaryExact:"Tabulka s {colnum} sloupci a {rownum} řádky",labelAccSelectionAffordanceTop:"Deskriptor horního výběru",labelAccSelectionAffordanceBottom:"Deskriptor dolního výběru",labelEnableNonContiguousSelection:"Povolit nesouvislý výběr",labelDisableNonContiguousSelection:"Deaktivovat nesouvislý výběr",labelResize:"Změnit velikost",labelResizeColumn:"Změnit velikost sloupce",labelResizePopupSubmit:"OK",labelResizePopupCancel:"Zrušit",labelResizePopupSpinner:"Změnit velikost sloupce",labelResizeColumnDialog:"Změnit velikost sloupce",labelColumnWidth:"Šířka v pixelech",labelResizeDialogApply:"Použít",labelSelectRow:"Vybrat řádek",labelSelectAllRows:"Vybrat všechny řádky",labelEditRow:"Upravit řádek",labelSelectAndEditRow:"Vybrat a upravit řádku",labelSelectColumn:"Vybrat sloupec",labelSort:"Seřadit",labelSortAsc:"Seřadit vzestupně",labelSortDsc:"Seřadit sestupně",msgFetchingData:"Načítání dat...",msgNoData:"Žádná data k zobrazení.",msgInitializing:"Inicializace...",msgColumnResizeWidthValidation:"Hodnota široké musí být celé číslo.",msgScrollPolicyMaxCountSummary:"Překročeno maximum řádků pro procházení tabulky.",msgScrollPolicyMaxCountDetail:"Načtěte znovu s menší datovou sadou.",msgStatusSortAscending:"{0} seřazeno vzestupně.",msgStatusSortDescending:"{0} seřazeno sestupně.",tooltipRequired:"Požadováno"},"oj-ojTabs":{labelCut:"Vyjmout",labelPasteBefore:"Vložit před",labelPasteAfter:"Vložit za",labelRemove:"Odebrat",labelReorder:"Změnit pořadí",removeCueText:"Lze odebrat"},"oj-ojCheckboxset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Vyberte hodnotu."}},"oj-ojRadioset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Vyberte hodnotu."}},"oj-ojSelect":{required:{hint:"",messageSummary:"",messageDetail:"Vyberte hodnotu."},searchField:"Pole Hledat",noMatchesFound:"Nebyly nalezeny žádné shody",noMoreResults:"Žádné další výsledky",oneMatchesFound:"Nalezena jedna odpovídající položka",moreMatchesFound:"Nalezené shody: {num}",filterFurther:"K dispozici je více výsledků, zužte filtrování."},"oj-ojSwitch":{SwitchON:"Zapnuto",SwitchOFF:"Vypnuto"},"oj-ojCombobox":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Nebyly nalezeny žádné shody",noMoreResults:"Žádné další výsledky",oneMatchesFound:"Nalezena jedna odpovídající položka",moreMatchesFound:"Nalezené shody: {num}",filterFurther:"K dispozici je více výsledků, zužte filtrování."},"oj-ojSelectSingle":{required:{hint:"",messageSummary:"",messageDetail:"Vyberte hodnotu."},noMatchesFound:"Nebyly nalezeny žádné shody",oneMatchFound:"Nalezena jedna odpovídající položka",multipleMatchesFound:"Nalezené shody: {num}",nOrMoreMatchesFound:"{num} nebo více shod nalezeno",cancel:"Zrušit",labelAccOpenDropdown:"rozbalit",labelAccClearValue:"vymazat hodnotu",noResultsLine1:"Nebyly nalezeny žádné výsledky",noResultsLine2:"Nenašli jsme nic, co by odpovídalo vašemu vyhledávání."},"oj-ojInputSearch2":{cancel:"Zrušit",noSuggestionsFound:"Nebyly nalezeny žádné návrhy"},"oj-ojInputSearch":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Nebyly nalezeny žádné shody",oneMatchesFound:"Nalezena jedna odpovídající položka",moreMatchesFound:"Nalezené shody: {num}"},"oj-ojTreeView":{treeViewSelectorAria:"Výběr TreeView {rowKey}",retrievingDataAria:"Načítání dat pro uzel: {nodeText}",receivedDataAria:"Přijata data pro uzel: {nodeText}"},"oj-ojTree":{stateLoading:"Probíhá načítání...",labelNewNode:"Nový uzel",labelMultiSelection:"Vícenásobný výběr",labelEdit:"Upravit",labelCreate:"Vytvořit",labelCut:"Vyjmout",labelCopy:"Kopírovat",labelPaste:"Vložit",labelPasteAfter:"Vložit za",labelPasteBefore:"Vložit před",labelRemove:"Odebrat",labelRename:"Přejmenovat",labelNoData:"Žádná data"},"oj-ojPagingControl":{labelAccPaging:"Stránkování",labelAccPageNumber:"Načten obsah stránky {pageNum}",labelAccNavFirstPage:"První stránka",labelAccNavLastPage:"Poslední stránka",labelAccNavNextPage:"Další stránka",labelAccNavPreviousPage:"Předchozí stránka",labelAccNavPage:"Stránka",labelLoadMore:"Zobrazit více...",labelLoadMoreMaxRows:"Bylo dosaženo maximálního limitu {maxRows} řádků",labelNavInputPage:"Stránka",labelNavInputPageMax:"z {pageMax}",fullMsgItemRange:"{pageFrom}-{pageTo} z {pageMax} položek",fullMsgItemRangeAtLeast:"{pageFrom}-{pageTo} z alespoň {pageMax} položek",fullMsgItemRangeApprox:"{pageFrom}-{pageTo} z přibližně {pageMax} položek",msgItemRangeNoTotal:"{pageFrom}-{pageTo} položky",fullMsgItem:"{pageTo} z {pageMax} položek",fullMsgItemAtLeast:"{pageTo} z alespoň {pageMax} položek",fullMsgItemApprox:"{pageTo} z přibližně {pageMax} položek",msgItemNoTotal:"{pageTo} položek",msgItemRangeCurrent:"{pageFrom}-{pageTo}",msgItemRangeCurrentSingle:"{pageFrom}",msgItemRangeOf:"z",msgItemRangeOfAtLeast:"z nejméně",msgItemRangeOfApprox:"z přibližně",msgItemRangeItems:"položek",tipNavInputPage:"Přejít na stránku",tipNavPageLink:"Přejít na stránku {pageNum}",tipNavNextPage:"Další",tipNavPreviousPage:"Předchozí",tipNavFirstPage:"První",tipNavLastPage:"Poslední",pageInvalid:{summary:"Zadaná hodnota stránky je neplatná.",detail:"Zadejte hodnotu větší než 0."},maxPageLinksInvalid:{summary:"Hodnota pro volbu maxPageLinks není platná.",detail:"Zadejte hodnotu větší než 4."}},"oj-ojMasonryLayout":{labelCut:"Vyjmout",labelPasteBefore:"Vložit před",labelPasteAfter:"Vložit za"},"oj-panel":{labelAccButtonExpand:"Rozbalit",labelAccButtonCollapse:"Sbalit",labelAccButtonRemove:"Odebrat",labelAccFlipForward:"Převrátit dopředu",labelAccFlipBack:"Převrátit dozadu",tipDragToReorder:"Přetažením změnit pořadí",labelAccDragToReorder:"Přetažením změnit pořadí, dostupná kontextová nabídka"},"oj-ojChart":{labelDefaultGroupName:"Skupina {0}",labelSeries:"Řada",labelGroup:"Skupina",labelDate:"Datum",labelValue:"Hodnota",labelTargetValue:"Cíl",labelX:"X",labelY:"Y",labelZ:"Z",labelPercentage:"Procenta",labelLow:"Nízké",labelHigh:"Vysoké",labelOpen:"Otevřít",labelClose:"Zavřít",labelVolume:"Množství",labelQ1:"Q1",labelQ2:"Q2",labelQ3:"Q3",labelMin:"Min.",labelMax:"Max.",labelOther:"Jiné",tooltipPan:"Posunout",tooltipSelect:"Rámeček výběru",tooltipZoom:"Rámeček lupy",componentName:"Graf"},"oj-dvtBaseGauge":{componentName:"Ukazatel"},"oj-ojDiagram":{promotedLink:"{0} odkaz",promotedLinks:"{0} odkazy (odkazů)",promotedLinkAriaDesc:"Nepřímý",componentName:"Schéma"},"oj-ojGantt":{componentName:"Ganttův",accessibleDurationDays:"{0} dnů",accessibleDurationHours:"{0} hodin",accessibleTaskInfo:"Čas začátku je {0}, čas konce je {1}, doba trvání je {2}",accessibleMilestoneInfo:"Čas je {0}",accessibleRowInfo:"Řádek {0}",accessibleTaskTypeMilestone:"Milník",accessibleTaskTypeSummary:"Souhrn",accessiblePredecessorInfo:"{0} předchůdci",accessibleSuccessorInfo:"{0} následníci",accessibleDependencyInfo:"Typ závislosti {0}, připojuje {1} k {2}",startStartDependencyAriaDesc:"začátek-začátek",startFinishDependencyAriaDesc:"začátek-konec",finishStartDependencyAriaDesc:"konec-začátek",finishFinishDependencyAriaDesc:"konec-konec",tooltipZoomIn:"Přiblížit",tooltipZoomOut:"Oddálit",labelLevel:"Úroveň",labelRow:"Řádek",labelStart:"Začátek",labelEnd:"Konec",labelDate:"Datum",labelBaselineStart:"Schválené zahájení",labelBaselineEnd:"Schválený konec",labelBaselineDate:"Datum schválení",labelDowntimeStart:"Začátek prostoje",labelDowntimeEnd:"Konec prostoje",labelOvertimeStart:"Začátek přesčasu",labelOvertimeEnd:"Konec přesčasu",labelAttribute:"Atribut",labelLabel:"Popisek",labelProgress:"Průběh",labelMoveBy:"Posunout o",labelResizeBy:"Změna velikosti",taskMoveInitiated:"Zahájen přesun úlohy",taskResizeEndInitiated:"Zahájen konec úlohy změny velikosti",taskResizeStartInitiated:"Zahájen začátek úlohy změny velikosti",taskMoveSelectionInfo:"Vybrány další {0}",taskResizeSelectionInfo:"Vybrány další {0}",taskMoveInitiatedInstruction:"Přesun proveďte pomocí kláves se šipkami",taskResizeInitiatedInstruction:"Ke změně velikosti použijte klávesy se šipkami",taskMoveFinalized:"Dokončen přesun úlohy",taskResizeFinalized:"Úloha změny velikosti dokončena",taskMoveCancelled:"Zrušen přesun úlohy",taskResizeCancelled:"Úloha změny velikosti zrušena",taskResizeStartHandle:"Deskriptor začátku úlohy změny velikosti",taskResizeEndHandle:"Deskriptor konce úlohy změny velikosti"},"oj-ojLegend":{componentName:"Legenda",tooltipExpand:"Rozbalit",tooltipCollapse:"Sbalit"},"oj-ojNBox":{highlightedCount:"{0}/{1}",labelOther:"Jiné",labelGroup:"Skupina",labelSize:"Velikost",labelAdditionalData:"Další data",componentName:"Rámeček {0}"},"oj-ojPictoChart":{componentName:"Obrázkový graf"},"oj-ojSparkChart":{componentName:"Graf"},"oj-ojSunburst":{labelColor:"Barva",labelSize:"Velikost",tooltipExpand:"Rozbalit",tooltipCollapse:"Sbalit",componentName:"Vícevrstvý prstencový"},"oj-ojTagCloud":{componentName:"Shluk značek"},"oj-ojThematicMap":{componentName:"Tematická mapa",areasRegion:"Oblasti",linksRegion:"Odkazy",markersRegion:"Značky"},"oj-ojTimeAxis":{componentName:"Časová osa"},"oj-ojTimeline":{componentName:"Časová osa",accessibleItemDesc:"Popis je {0}.",accessibleItemEnd:"Čas ukončení je {0}.",accessibleItemStart:"Čas spuštění je {0}.",accessibleItemTitle:"Nadpis je {0}.",labelSeries:"Řada",tooltipZoomIn:"Přiblížit",tooltipZoomOut:"Oddálit",labelStart:"Začátek",labelEnd:"Konec",labelAccNavNextPage:"Další stránka",labelAccNavPreviousPage:"Předchozí stránka",tipArrowNextPage:"Další",tipArrowPreviousPage:"Předchozí",navArrowDisabledState:"Deaktivováno",labelDate:"Datum",labelTitle:"Nadpis",labelDescription:"Popis",labelMoveBy:"Posunout o",labelResizeBy:"Změna velikosti",itemMoveInitiated:"Zahájen přesun položky",itemResizeEndInitiated:"Zahájen konec změny velikosti položky",itemResizeStartInitiated:"Zahájen začátek změny velikosti položky",itemMoveSelectionInfo:"Vybrány další {0}",itemResizeSelectionInfo:"Vybrány další {0}",itemMoveInitiatedInstruction:"Přesun proveďte pomocí kláves se šipkami",itemResizeInitiatedInstruction:"Ke změně velikosti použijte klávesy se šipkami",itemMoveFinalized:"Dokončen přesun položky",itemResizeFinalized:"Změna velikosti položky dokončena",itemMoveCancelled:"Zrušen přesun položky",itemResizeCancelled:"Změna velikosti položky zrušena",itemResizeStartHandle:"Deskriptor začátku změny velikosti položky",itemResizeEndHandle:"Deskriptor konce změny velikosti položky"},"oj-ojTreemap":{labelColor:"Barva",labelSize:"Velikost",tooltipIsolate:"Izolovat",tooltipRestore:"Obnovit",componentName:"Stromová mapa"},"oj-dvtBaseComponent":{labelScalingSuffixThousand:"tis.",labelScalingSuffixMillion:"mil.",labelScalingSuffixBillion:"mld.",labelScalingSuffixTrillion:"bil.",labelScalingSuffixQuadrillion:"bld.",labelInvalidData:"Neplatná data",labelNoData:"Žádná data pro zobrazení",labelClearSelection:"Zrušit výběr",labelDataVisualization:"Vizualizace dat",stateSelected:"Vybráno",stateUnselected:"Výběr zrušen",stateMaximized:"Maximalizováno",stateMinimized:"Minimalizováno",stateExpanded:"Rozbaleno",stateCollapsed:"Sbaleno",stateIsolated:"Izolováno",stateHidden:"Skryto",stateVisible:"Viditelné",stateDrillable:"Lze provést",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} z {1}",accessibleContainsControls:"Obsahuje ovládací prvky"},"oj-ojRatingGauge":{labelInvalidData:"Neplatná data",labelNoData:"Žádná data pro zobrazení",labelClearSelection:"Zrušit výběr",labelDataVisualization:"Vizualizace dat",stateSelected:"Vybráno",stateUnselected:"Výběr zrušen",stateMaximized:"Maximalizováno",stateMinimized:"Minimalizováno",stateExpanded:"Rozbaleno",stateCollapsed:"Sbaleno",stateIsolated:"Izolováno",stateHidden:"Skryto",stateVisible:"Viditelné",stateDrillable:"Lze provést",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} z {1}",accessibleContainsControls:"Obsahuje ovládací prvky",componentName:"Ukazatel"},"oj-ojStatusMeterGauge":{labelInvalidData:"Neplatná data",labelNoData:"Žádná data pro zobrazení",labelClearSelection:"Zrušit výběr",labelDataVisualization:"Vizualizace dat",stateSelected:"Vybráno",stateUnselected:"Výběr zrušen",stateMaximized:"Maximalizováno",stateMinimized:"Minimalizováno",stateExpanded:"Rozbaleno",stateCollapsed:"Sbaleno",stateIsolated:"Izolováno",stateHidden:"Skryto",stateVisible:"Viditelné",stateDrillable:"Lze provést",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} z {1}",accessibleContainsControls:"Obsahuje ovládací prvky",componentName:"Ukazatel"},"oj-ojNavigationList":{defaultRootLabel:"Navigační seznam",hierMenuBtnLabel:"Tlačítko hierarchického menu",selectedLabel:"vybráno",previousIcon:"Předchozí",msgFetchingData:"Načítání dat...",msgNoData:"Neexistují položky k zobrazení",overflowItemLabel:"Další",accessibleReorderTouchInstructionText:"Dvakrát klepněte a podržte.  Počkejte na zaznění tónu a pak tažením upravte uspořádání.",accessibleReorderBeforeItem:"Před {item}",accessibleReorderAfterItem:"Za {item}",labelCut:"Vyjmout",labelPasteBefore:"Vložit před",labelPasteAfter:"Vložit za",labelRemove:"Odebrat",removeCueText:"Lze odebrat"},"oj-ojSlider":{noValue:"ojSlider nemá hodnotu",maxMin:"Maximum nesmí být menší nebo rovno minimu",startEnd:"value.start nesmí být vyšší než value.end",valueRange:"Hodnota musí být v rozmezí minimální až maximální",optionNum:"Volba {option} není číslo",invalidStep:"Neplatný krok; krok musí být > 0",lowerValueThumb:"úchyt dolní hodnoty",higherValueThumb:"úchyt horní hodnoty"},"oj-ojDialog":{labelCloseIcon:"Zavřít"},"oj-ojPopup":{ariaLiveRegionInitialFocusFirstFocusable:"Vstupujete do rozevírací nabídky. Stisknutím F6 můžete přecházet mezi rozevírací nabídkou a přiřazeným ovládacím prvkem.",ariaLiveRegionInitialFocusNone:"Rozevírací nabídka je otevřena. Stisknutím F6 můžete přecházet mezi rozevírací nabídkou a přiřazeným ovládacím prvkem.",ariaLiveRegionInitialFocusFirstFocusableTouch:"Vstup do rozevírací nabídky. Rozevírací nabídku lze uzavřít přechodem na poslední odkaz v rozevírací nabídce.",ariaLiveRegionInitialFocusNoneTouch:"Otevřená rozevírací nabídka. Přechodem k dalšímu odkazu jej aktivujte v rámci rozevírací nabídky.",ariaFocusSkipLink:"Poklepáním přejděte k otevřené rozevírací nabídce.",ariaCloseSkipLink:"Poklepáním zavřete otevřenou rozevírací nabídku."},"oj-ojRefresher":{ariaRefreshLink:"Aktivací odkazu aktualizujte obsah",ariaRefreshingLink:"Probíhá aktualizace obsahu",ariaRefreshCompleteLink:"Aktualizace byla dokončena"},"oj-ojSwipeActions":{ariaShowStartActionsDescription:"Zobrazit zahájení akcí",ariaShowEndActionsDescription:"Zobrazit ukončení akcí",ariaHideActionsDescription:"Skrýt akce"},"oj-ojIndexer":{indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",indexerOthers:"#",ariaDisabledLabel:"Záhlaví žádné odpovídající skupiny",ariaOthersLabel:"číslo",ariaInBetweenText:"Mezi {first} a {second}",ariaKeyboardInstructionText:"Stisknutím klávesy Enter vyberte hodnotu.",ariaTouchInstructionText:"Dvojitým klepnutím a přidržením přejděte do režimu gest, poté tažením nahoru nebo dolů upravte hodnotu."},"oj-ojMenu":{labelCancel:"Zrušit",ariaFocusSkipLink:"Přiblížení je součástí nabídky, dvojím poklepáním nebo přejetím prstem posuňte přiblížení na první položku nabídky."},"oj-ojColorSpectrum":{labelHue:"Odstín",labelOpacity:"Neprůhlednost",labelSatLum:"Nasycení/svítivost",labelThumbDesc:"Barevné spektrum pro čtyřcestný posuvník."},"oj-ojColorPalette":{labelNone:"Žádný"},"oj-ojColorPicker":{labelSwatches:"Vzorky",labelCustomColors:"Vlastní barvy",labelPrevColor:"Předchozí barva",labelDefColor:"Výchozí barva",labelDelete:"Odstranit",labelDeleteQ:"Odstranit?",labelAdd:"Přidat",labelAddColor:"Přidat barvu",labelMenuHex:"HEX",labelMenuRgba:"RGBa",labelMenuHsla:"HSLa",labelSliderHue:"Odstín",labelSliderSaturation:"Sytost",labelSliderSat:"Syt",labelSliderLightness:"Jas",labelSliderLum:"Světelnost",labelSliderAlpha:"Alfa",labelOpacity:"Neprůhlednost",labelSliderRed:"Červená",labelSliderGreen:"Zelená",labelSliderBlue:"Modrá"},"oj-ojFilePicker":{dropzoneText:"Soubory přetáhněte sem nebo je odešlete kliknutím",singleFileUploadError:"Odesílejte pouze po jednom souboru.",singleFileTypeUploadError:"Nelze odesílat soubory typu {fileType}.",multipleFileTypeUploadError:"Nelze odesílat soubory typu: {fileTypes}.",dropzonePrimaryText:"Přetáhnout",secondaryDropzoneText:"Vyberte soubor, nebo jej přetáhněte sem.",secondaryDropzoneTextMultiple:"Vyberte, nebo přetáhněte soubor sem.",unknownFileType:"neznámý"},"oj-ojProgressbar":{ariaIndeterminateProgressText:"Probíhá"},"oj-ojMessage":{labelCloseIcon:"Zavřít",categories:{error:"Chyba",warning:"Varování",info:"Informace",confirmation:"Potvrzení",none:"Žádný"}},"oj-ojSelector":{checkboxAriaLabel:"Výběr zaškrtávacího políčka {rowKey}",checkboxAriaLabelSelected:" vybráno",checkboxAriaLabelUnselected:" výběr zrušen"},"oj-ojMessages":{labelLandmark:"Zprávy",ariaLiveRegion:{navigationFromKeyboard:"Vstupujete do oblasti zpráv. Stisknutím klávesy F6 můžete přecházet zpět k dříve zaměřenému prvku.",navigationToTouch:"V oblasti zpráv se nacházejí nové zprávy. Pomocí rotoru VoiceOveru přejděte k orientačnímu bodu zpráv.",navigationToKeyboard:"V oblasti zpráv se nacházejí nové zprávy. Stisknutím klávesy F6 přejděte k naposledy otevřené oblasti zpráv.",newMessage:"Kategorie zprávy {category}. {summary}. {detail}.",noDetail:"Podrobnost není dostupná"}},"oj-ojMessageBanner":{close:"Zavřít",navigationFromMessagesRegion:"Vstupujete do oblasti zpráv. Stisknutím klávesy F6 můžete přecházet zpět k dříve zaměřenému prvku.",navigationToMessagesRegion:"V oblasti zpráv se nacházejí nové zprávy. Stisknutím klávesy F6 přejděte k naposledy otevřené oblasti zpráv.",error:"Chyba",warning:"Varování",info:"Informace",confirmation:"Potvrzení"},"oj-ojConveyorBelt":{tipArrowNext:"Další",tipArrowPrevious:"Předchozí"},"oj-ojTrain":{stepInfo:"Krok {index} z {count}.",stepStatus:"Stav: {status}.",stepCurrent:"Aktuální",stepVisited:"Navštíveno",stepNotVisited:"Nenavštíveno",stepDisabled:"Deaktivováno",stepMessageType:"Typ zprávy: {messageType}.",stepMessageConfirmation:"Potvrzeno",stepMessageInfo:"Informace",stepMessageWarning:"Varování",stepMessageError:"Chyba"}});