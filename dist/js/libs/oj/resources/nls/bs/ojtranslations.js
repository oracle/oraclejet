define({"oj-message":{fatal:"Fatalan",error:"Greška",warning:"Upozorenje",info:"Informacije",confirmation:"Potvrda","compact-type-summary":"{0}: {1}"},"oj-converter":{summary:"Vrijednost nije u očekivanom formatu.",detail:"Unesi vrijednost u očekivanom formatu.","plural-separator":", ",hint:{summary:"Primjer: {exampleValue}",detail:"Unesi vrijednost u ovom formatu: '{exampleValue}'.","detail-plural":"Unesi vrijednost u ovim formatima: '{exampleValue}'."},optionHint:{detail:"Prihvaćena vrijednost za opciju '{propertyName}' je '{propertyValueValid}'.","detail-plural":"Prihvaćene vrijednosti za opciju '{propertyName}' su '{propertyValueValid}'."},optionTypesMismatch:{summary:"Vrijednost za opciju {requiredPropertyName}' je potrebna kada je opcija '{propertyName}' postavljena na '{propertyValue}'."},optionTypeInvalid:{summary:"Za opciju '{propertyName}' nije bila navedena vrijednost očekivane vrste."},optionOutOfRange:{summary:"Vrijednost {propertyValue} je izvan opsega za opciju '{propertyName}'."},optionValueInvalid:{summary:"Nevažeća vrijednost '{propertyValue}' navedena je za opciju '{propertyName}'."},number:{decimalFormatMismatch:{summary:"Navedena vrijednost nije u očekivanom formatu broja."},shortLongUnsupportedParse:{summary:"'short' i 'long' nisu podržani za parsiranje konvertora.",detail:"Promijeni komponentu na Samo za čitanje. Polja koja su samo za čitanje ne pozivaju funkciju parsiranja."},currencyFormatMismatch:{summary:"Navedena vrijednost nije u očekivanom formatu valute."},percentFormatMismatch:{summary:"Navedena vrijednost nije u očekivanom formatu postotka."},invalidNumberFormat:{summary:"Navedena vrijednost nije važeći broj.",detail:"Navedi važeći broj."}},color:{invalidFormat:{summary:"Nevažeći format boje.",detail:"Nevažeća specifikacija opcije formata boje."},invalidSyntax:{summary:"Nevažeća specifikacija boje.",detail:"Unesi vrijednost boje u skladu sa standardom CSS3."}},datetime:{datetimeOutOfRange:{summary:"Vrijednost' {value}' je izvan opsega za '{propertyName}'.",detail:"Unesi vrijednost između '{minValue}' i '{maxValue}'.",hour:"sat",minute:"minuta",second:"sekunda",millisec:"milisekunda",month:"mjesec",day:"dan",year:"godina","month name":"naziv mjeseca",weekday:"dan u sedmici"},dateFormatMismatch:{summary:"Navedena vrijednost nije u očekivanom formatu datuma."},invalidTimeZoneID:{summary:"Naveden je nevažeći ID vremenske zone {timeZoneID}."},nonExistingTime:{summary:"Vrijeme unosa ne postoji jer pada tokom prelaska na ljetno računanje vremena."},missingTimeZoneData:{summary:"Nedostaju podaci o vremenskoj zoni. Postavite da su za poziv potrebni 'ojs/ojtimezonedata' da biste učitali podatke o vremenskoj zoni."},timeFormatMismatch:{summary:"Navedena vrijednost nije u očekivanom formatu vremena."},datetimeFormatMismatch:{summary:"Navedena vrijednost nije u očekivanom formatu datuma i vremena."},dateToWeekdayMismatch:{summary:"Dan '{date}' ne pada na '{weekday}'.",detail:"Unesi dan u sedmici koji odgovara datumu."},invalidISOString:{invalidRangeSummary:"Vrijednost '{value}' je izvan opsega za polje '{propertyName}' u ISO 8601 nizu '{isoStr}'.",summary:"Navedeni niz '{isoStr}' nije važeći ISO 8601 niz.",detail:"Navedi važeći ISO 8601 niz."}}},"oj-validator":{length:{hint:{min:"Unesi najmanje {min} znakova.",max:"Unesi najviše {max} znakova.",inRange:"Unesi između {min} i {max} znakova.",exact:"Unesi {length} znakova."},messageDetail:{tooShort:"Unesi najmanje {min} znakova.",tooLong:"Unesi najviše {max} znakova."},messageSummary:{tooShort:"Premalo je znakova.",tooLong:"Previše je znakova."}},range:{number:{hint:{min:"Unesi broj koji nije manji od {min}.",max:"Unesi broj manji od ili jednak {max}.",inRange:"Unesi broj između {min} i {max}.",exact:"Unesi broj {num}."},messageDetail:{rangeUnderflow:"Unesi {min} ili veći broj.",rangeOverflow:"Unesi {max} ili manji broj.",exact:"Unesi broj {num}."},messageSummary:{rangeUnderflow:"Broj je prenizak.",rangeOverflow:"Broj je previsok."}},datetime:{hint:{min:"Unesi datum i vrijeme na ili nakon {min}.",max:"Unesi datum i vrijeme na ili prije {max}.",inRange:"Unesi datum i vrijeme između {min} i {max}."},messageDetail:{rangeUnderflow:"Unesi datum na ili nakon {min}.",rangeOverflow:"Unesi datum na ili prije {max}."},messageSummary:{rangeUnderflow:"Datum i vrijeme su ranije od minimalnog datuma i vremena.",rangeOverflow:"Datum i vrijeme su kasnije od maksimalnog datuma i vremena."}},date:{hint:{min:"Unesi datum na ili nakon {min}.",max:"Unesi datum na ili prije {max}.",inRange:"Unesi datum između {min} i {max}."},messageDetail:{rangeUnderflow:"Unesi datum na ili nakon {min}.",rangeOverflow:"Unesi datum na ili prije {max}."},messageSummary:{rangeUnderflow:"Datum je raniji od minimalnog datuma.",rangeOverflow:"Datum je kasniji nego maksimalni datum."}},time:{hint:{min:"Unesi vrijeme na ili nakon {min}.",max:"Unesi vrijeme na ili prije {max}.",inRange:"Unesi vrijeme između {min} i {max}."},messageDetail:{rangeUnderflow:"Unesi vrijeme na ili nakon {min}.",rangeOverflow:"Unesi vrijeme na ili nakon {max}."},messageSummary:{rangeUnderflow:"Vrijeme je ranije od minimalnog datuma.",rangeOverflow:"Vrijeme je kasnije od minimalnog datuma."}}},restriction:{date:{messageSummary:"Datum {value} odnosi se na onemogućen unos.",messageDetail:"Datum koji ste izabrali nije dostupan. Pokušajte sa drugim datumom."}},regExp:{summary:"Format je netačan.",detail:"Unesite dozvoljene vrijednosti opisane u ovom regularnom izrazu: '{pattern}'."},required:{summary:"Vrijednost je obavezna.",detail:"Unesi vrijednost."}},"oj-ojEditableValue":{loading:"Učitavanje",requiredText:"Obavezno",helpSourceText:"Saznaj više..."},"oj-ojInputDate":{done:"Gotovo",cancel:"Odustani",time:"Vrijeme",prevText:"Prethodni",nextText:"Sljedeći",currentText:"Danas",weekHeader:"Sedmica",tooltipCalendar:"Izaberi datum.",tooltipCalendarTime:"Izaberi datum/vrijeme.",tooltipCalendarDisabled:"Onemogućen odabir datuma.",tooltipCalendarTimeDisabled:"Onemogućen odabir datuma/vremena.",picker:"Birač",weekText:"Sedmica",datePicker:"Birač datuma",inputHelp:"Pritisnuti tipku dole ili tipku gore za pristup kalendaru.",inputHelpBoth:"Pritisnite tipku sa strelicom dole ili gore za pristup kalendaru i Shift + tipku dole ili gore za pristup padajućem izborniku za vrijeme.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},dateRestriction:{hint:"",messageSummary:"",messageDetail:""}},"oj-ojInputTime":{cancelText:"Odustani",okText:"U redu",currentTimeText:"Sada",hourWheelLabel:"Sat",minuteWheelLabel:"Minuta",ampmWheelLabel:"Prijepodne/poslijepodne",tooltipTime:"Izaberi vrijeme.",tooltipTimeDisabled:"Onemogućen odabir vremena.",inputHelp:"Pritisni tipku sa strelicom dole ili gore za pristup padajućem izborniku za vrijeme.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}}},"oj-inputBase":{required:{hint:"",messageSummary:"",messageDetail:""},regexp:{messageSummary:"",messageDetail:""},accessibleMaxLengthExceeded:"Prekoračena je maksimalna dužina od {len}.",accessibleMaxLengthRemaining:"{chars} znakova preostalo."},"oj-ojInputText":{accessibleClearIcon:"Očisti"},"oj-ojInputPassword":{regexp:{messageDetail:"Vrijednost mora  odgovarati ovom obrascu '{pattern}'."},accessibleShowPassword:"Prikaži lozinku.",accessibleHidePassword:"Sakrij lozinku."},"oj-ojFilmStrip":{labelAccFilmStrip:"Prikazivanje strane {pageIndex} od {pageCount}",labelAccArrowNextPage:"Izaberi Sljedeća da bi se prikazala sljedeća strana",labelAccArrowPreviousPage:"Izaberi Prethodna da bi se prikazala prethodna strana",tipArrowNextPage:"Sljedeća",tipArrowPreviousPage:"Prethodna"},"oj-ojDataGrid":{accessibleSortAscending:"{id} sortirano uzlazno",accessibleSortDescending:"{id} sortirano silazno",accessibleSortable:"{id} se može sortirati",accessibleActionableMode:"Pokreni način djelovanja.",accessibleNavigationMode:"Pokrenite način navigacije, pritisnite F2 da biste pokrenuli način uređivanja ili djelovanja.",accessibleEditableMode:"Pokrenite način uređivanja, pritisnite Escape za prelazak izvan rešetke podataka.",accessibleSummaryExact:"Ovo je rešetka podataka s {rownum} redova i {colnum} kolona",accessibleSummaryEstimate:"Ovo je rešetka podataka s nepoznatim brojem redova i kolona",accessibleSummaryExpanded:"Trenutno je prošireno {num} redova",accessibleRowExpanded:"Red proširen",accessibleExpanded:"Prošireno",accessibleRowCollapsed:"Red sažet",accessibleCollapsed:"Sažeto",accessibleRowSelected:"Izabran je red {row}",accessibleColumnSelected:"Izabrana je kolona {column}",accessibleStateSelected:"izabrano",accessibleMultiCellSelected:"Izabrano je {num} ćelija",accessibleColumnSpanContext:"Širina: {extent}",accessibleRowSpanContext:"Visina: {extent}",accessibleRowContext:"Red {index}",accessibleColumnContext:"Kolona {index}",accessibleRowHeaderContext:"Zaglavlje reda {index}",accessibleColumnHeaderContext:"Zaglavlje kolone {index}",accessibleRowEndHeaderContext:"Zaglavlje kraja reda {index}",accessibleColumnEndHeaderContext:"Zaglavlje kraja kolone {index}",accessibleRowHeaderLabelContext:"Oznaka zaglavlja reda {level}",accessibleColumnHeaderLabelContext:"Oznaka zaglavlja kolone {level}",accessibleRowEndHeaderLabelContext:"Oznaka zaglavlja kraja reda {level}",accessibleColumnEndHeaderLabelContext:"Oznaka zaglavlja kraja kolone {level}",accessibleLevelContext:"Nivo {level}",accessibleRangeSelectModeOn:"Način dodavanja izabranog opsega ćelija uključen.",accessibleRangeSelectModeOff:"Način dodavanja izabranog opsega ćelija isključen.",accessibleFirstRow:"Dostigli ste prvi red.",accessibleLastRow:"Dostigli ste zadnji red.",accessibleFirstColumn:"Dostigli ste prvu kolonu",accessibleLastColumn:"Dostigli ste zadnju kolonu.",accessibleSelectionAffordanceTop:"Gornji pokazivač izbora.",accessibleSelectionAffordanceBottom:"Donji pokazivač izbora.",accessibleLevelHierarchicalContext:"Nivo {level}",accessibleRowHierarchicalFull:"Red {posInSet} od {setSize}",accessibleRowHierarchicalPartial:"Red {posInSet} od najmanje {setSize}",accessibleRowHierarchicalUnknown:"Najmanje {posInSet}. red od najmanje {setSize}",accessibleColumnHierarchicalFull:"Kolona {posInSet} od {setSize}",accessibleColumnHierarchicalPartial:"Kolona {posInSet} od najmanje {setSize}",accessibleColumnHierarchicalUnknown:"Najmanje {posInSet}. kolona od najmanje {setSize}",msgFetchingData:"Dohvatanje podataka...",msgNoData:"Nema stavki za prikaz.",labelResize:"Promijeni veličinu",labelResizeWidth:"Promijeni širinu",labelResizeHeight:"Promijeni visinu",labelSortAsc:"Sortiraj uzlazno",labelSortDsc:"Sortiraj silazno",labelSortRow:"Sortiraj red",labelSortRowAsc:"Sortiraj red uzlazno",labelSortRowDsc:"Sortiraj red silazno",labelSortCol:"Sortiraj kolonu",labelSortColAsc:"Sortiraj kolonu uzlazno",labelSortColDsc:"Sortiraj kolonu silazno",labelCut:"Izreži",labelPaste:"Zalijepi",labelCutCells:"Izreži",labelPasteCells:"Zalijepi",labelCopyCells:"Kopiraj",labelAutoFill:"Automatski popuni",labelEnableNonContiguous:"Omogući nekontinuiran izbor",labelDisableNonContiguous:"Onemogući nekontinuiran izbor",labelResizeDialogSubmit:"U redu",labelResizeDialogCancel:"Odustani",accessibleContainsControls:"Sadrži kontrole",labelSelectMultiple:"Izaberi više",labelResizeDialogApply:"Primijeni",labelResizeFitToContent:"Promijeni veličinu da stane",columnWidth:"Širina u pikselima",rowHeight:"Visina u pikselima",labelResizeColumn:"Promijeni veličinu kolone",labelResizeRow:"Promijeni veličinu reda",resizeColumnDialog:"Promijeni veličinu kolone",resizeRowDialog:"Promijeni veličinu reda",collapsedText:"Sažmi",expandedText:"Proširi",tooltipRequired:"Obavezno"},"oj-ojRowExpander":{accessibleLevelDescription:"Nivo {level}",accessibleRowDescription:"Nivo {level}, red {num} od {total}",accessibleRowExpanded:"Red proširen",accessibleRowCollapsed:"Red sažet",accessibleStateExpanded:"prošireno",accessibleStateCollapsed:"sažeto"},"oj-ojStreamList":{msgFetchingData:"Dohvatanje podataka..."},"oj-ojListView":{msgFetchingData:"Dohvatanje podataka...",msgNoData:"Nema stavki za prikaz.",msgItemsAppended:"{count}stavki dodano na kraj.",msgFetchCompleted:"Dohvaćene su sve stavke.",indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",accessibleExpandCollapseInstructionText:"Koristi tipke sa strelicama za proširivanje i sužavanje.",accessibleGroupExpand:"Prošireno",accessibleGroupCollapse:"Sažeto",accessibleReorderTouchInstructionText:"Dvaput dodirnite i držite. Čekajte zvuk pa povucite da biste prerasporedili.",accessibleReorderBeforeItem:"Ispred {item}",accessibleReorderAfterItem:"Iza {item}",accessibleReorderInsideItem:"U {item}",accessibleNavigateSkipItems:"Preskakanje {numSkip} stavki",labelCut:"Izreži",labelCopy:"Kopiraj",labelPaste:"Zalijepi",labelPasteBefore:"Zalijepi ispred",labelPasteAfter:"Zalijepi iza"},"oj-ojWaterfallLayout":{msgFetchingData:"Dohvatanje podataka..."},"oj-_ojLabel":{tooltipHelp:"Pomoć",tooltipRequired:"Obavezno"},"oj-ojLabel":{tooltipHelp:"Pomoć",tooltipRequired:"Obavezno"},"oj-ojInputNumber":{required:{hint:"",messageSummary:"",messageDetail:""},numberRange:{hint:{min:"",max:"",inRange:"",exact:""},messageDetail:{rangeUnderflow:"",rangeOverflow:"",exact:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},tooltipDecrement:"Dekrement",tooltipIncrement:"Inkrement"},"oj-ojTable":{accessibleAddRow:"Unesite podatke da biste dodali novi red.",accessibleColumnContext:"Kolona {index}",accessibleColumnFooterContext:"Podnožje kolone{index}",accessibleColumnHeaderContext:"Zaglavlje kolone {index}",accessibleContainsControls:"Sadrži kontrole",accessibleColumnsSpan:"Obuhvata ovoliko kolona: {count}",accessibleRowContext:"Red {index}",accessibleSortable:"{id} se može sortirati",accessibleSortAscending:"{id} sortirano uzlazno",accessibleSortDescending:"{id} sortirano silazno",accessibleStateSelected:"izabrano",accessibleStateUnselected:"nije izabrano",accessibleSummaryEstimate:"Tabela s {colnum} kolona i više od {rownum} redova",accessibleSummaryExact:"Tabela s {colnum} kolona i {rownum} redova",labelAccSelectionAffordanceTop:"Gornji pokazivač izbora",labelAccSelectionAffordanceBottom:"Donji pokazivač izbora",labelEnableNonContiguousSelection:"Omogući nekontinuiran izbor",labelDisableNonContiguousSelection:"Onemogući nekontinuiran izbor",labelResize:"Promijeni veličinu",labelResizeColumn:"Promijeni veličinu kolone",labelResizePopupSubmit:"U redu",labelResizePopupCancel:"Odustani",labelResizePopupSpinner:"Promijeni veličinu kolone",labelResizeColumnDialog:"Promijeni veličinu kolone",labelColumnWidth:"Širina u pikselima",labelResizeDialogApply:"Primijeni",labelSelectRow:"Izaberi red",labelSelectAllRows:"Izaberi sve redove",labelEditRow:"Uredi red",labelSelectAndEditRow:"Izaberi i uredi red",labelSelectColumn:"Izaberi kolonu",labelSort:"Sortiraj",labelSortAsc:"Sortiraj uzlazno",labelSortDsc:"Sortiraj silazno",msgFetchingData:"Dohvatanje podataka...",msgNoData:"Nema podataka za prikaz.",msgInitializing:"Inicijaliziranje...",msgColumnResizeWidthValidation:"Vrijednost širine mora biti cijeli broj.",msgScrollPolicyMaxCountSummary:"Prekoračen je maksimalni broj redova za pomicanje u tabeli.",msgScrollPolicyMaxCountDetail:"Ponovo učitaj s manjim skupom podataka.",msgStatusSortAscending:"{0} sortirano uzlazno.",msgStatusSortDescending:"{0} sortirano silazno.",tooltipRequired:"Obavezno"},"oj-ojTabs":{labelCut:"Izreži",labelPasteBefore:"Zalijepi ispred",labelPasteAfter:"Zalijepi iza",labelRemove:"Ukloni",labelReorder:"Promijeni redoslijed",removeCueText:"Može se ukloniti"},"oj-ojCheckboxset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Izaberi vrijednost."}},"oj-ojRadioset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Izaberi vrijednost."}},"oj-ojSelect":{required:{hint:"",messageSummary:"",messageDetail:"Izaberi vrijednost."},searchField:"Polje za pretragu",noMatchesFound:"Nije pronađeno nijedno podudaranje",noMoreResults:"Nema više rezultata",oneMatchesFound:"Pronađeno je jedno podudaranje",moreMatchesFound:"Pronađeno je {num} podudaranja",filterFurther:"Dostupno je više rezultata; dodatno filtriraj."},"oj-ojSwitch":{SwitchON:"Uključeno",SwitchOFF:"Isključeno"},"oj-ojCombobox":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Nije pronađeno nijedno podudaranje",noMoreResults:"Nema više rezultata",oneMatchesFound:"Pronađeno je jedno podudaranje",moreMatchesFound:"Pronađeno je {num} podudaranja",filterFurther:"Dostupno je više rezultata; dodatno filtriraj."},"oj-ojSelectSingle":{required:{hint:"",messageSummary:"",messageDetail:"Izaberi vrijednost."},noMatchesFound:"Nije pronađeno nijedno podudaranje",oneMatchFound:"Pronađeno je jedno podudaranje",multipleMatchesFound:"Pronađeno je {num} podudaranja",nOrMoreMatchesFound:"Pronađeno je najmanje {num} podudaranja",cancel:"Odustani",labelAccOpenDropdown:"proširi",labelAccClearValue:"izbriši vrijednost",noResultsLine1:"Nije pronađen nijedan rezultat",noResultsLine2:"Ne možemo pronaći ništa što se podudara s vašom pretragom."},"oj-ojInputSearch2":{cancel:"Odustani",noSuggestionsFound:"Nije pronađen nijedan prijedlog"},"oj-ojInputSearch":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Nije pronađeno nijedno podudaranje",oneMatchesFound:"Pronađeno je jedno podudaranje",moreMatchesFound:"Pronađeno je {num} podudaranja"},"oj-ojTreeView":{treeViewSelectorAria:"TreeView birač {rowKey}",retrievingDataAria:"Dohvatanje podataka za čvor: {nodeText}",receivedDataAria:"Primljeni podaci za čvor: {nodeText}"},"oj-ojTree":{stateLoading:"Učitavanje...",labelNewNode:"Novi čvor",labelMultiSelection:"Višestruku odabir",labelEdit:"Uredi",labelCreate:"Kreiraj",labelCut:"Izreži",labelCopy:"Kopiraj",labelPaste:"Zalijepi",labelPasteAfter:"Zalijepi iza",labelPasteBefore:"Zalijepi ispred",labelRemove:"Ukloni",labelRename:"Preimenuj",labelNoData:"Nema podataka"},"oj-ojPagingControl":{labelAccPaging:"Obilježavanje strana",labelAccPageNumber:"Sadržaj strane {pageNum} učitan",labelAccNavFirstPage:"Prva strana",labelAccNavLastPage:"Zadnja strana",labelAccNavNextPage:"Sljedeća strana",labelAccNavPreviousPage:"Prethodna strana",labelAccNavPage:"Strana",labelLoadMore:"Prikaži više...",labelLoadMoreMaxRows:"Dostignuto je ograničenje maksimalnog broja redova od {maxRows}",labelNavInputPage:"Strana",labelNavInputPageMax:"od {pageMax}",fullMsgItemRange:"{pageFrom} - {pageTo} od {pageMax} stavki",fullMsgItemRangeAtLeast:"{pageFrom} - {pageTo} od najmanje {pageMax} stavki",fullMsgItemRangeApprox:"{pageFrom} - {pageTo} od otprilike {pageMax} stavki",msgItemRangeNoTotal:"{pageFrom} - {pageTo} stavki",fullMsgItem:"{pageTo} od {pageMax} stavki",fullMsgItemAtLeast:"{pageTo} od najmanje {pageMax} stavki",fullMsgItemApprox:"{pageTo} od otprilike {pageMax} stavki",msgItemNoTotal:"{pageTo} stavki",msgItemRangeCurrent:"{pageFrom} - {pageTo}",msgItemRangeCurrentSingle:"{pageFrom}",msgItemRangeOf:"od",msgItemRangeOfAtLeast:"od najmanje",msgItemRangeOfApprox:"od otprilike",msgItemRangeItems:"stavki",tipNavInputPage:"Idi na stranu",tipNavPageLink:"Idi na stranu {pageNum}",tipNavNextPage:"Sljedeća",tipNavPreviousPage:"Prethodna",tipNavFirstPage:"Prva",tipNavLastPage:"Zadnja",pageInvalid:{summary:"Unesena vrijednost strane je nevažeća.",detail:"Unesi vrijednost veću od 0."},maxPageLinksInvalid:{summary:"Vrijednost za maxPageLinks je nevažeća.",detail:"Unesi vrijednost veću od 4."}},"oj-ojMasonryLayout":{labelCut:"Izreži",labelPasteBefore:"Zalijepi ispred",labelPasteAfter:"Zalijepi iza"},"oj-panel":{labelAccButtonExpand:"Proširi",labelAccButtonCollapse:"Sažmi",labelAccButtonRemove:"Ukloni",labelAccFlipForward:"Preokreni naprijed",labelAccFlipBack:"Preokreni nazad",tipDragToReorder:"Povuci za promjenu redoslijeda",labelAccDragToReorder:"Povuci za promjenu redoslijeda; dostupan je kontekstualni izbornik"},"oj-ojChart":{labelDefaultGroupName:"Grupa {0}",labelSeries:"Serija",labelGroup:"Grupa",labelDate:"Datum",labelValue:"Vrijednost",labelTargetValue:"Cilj",labelX:"X",labelY:"Y",labelZ:"Z",labelPercentage:"Postotak",labelLow:"Nizak",labelHigh:"Visok",labelOpen:"Otvori",labelClose:"Zatvori",labelVolume:"Volumen",labelQ1:"Q1",labelQ2:"Q2",labelQ3:"Q3",labelMin:"Min.",labelMax:"Maks.",labelOther:"Drugo",tooltipPan:"Pomicanje",tooltipSelect:"Marquee odabir",tooltipZoom:"Marquee zumiranje",componentName:"Grafikon"},"oj-dvtBaseGauge":{componentName:"Mjerač"},"oj-ojDiagram":{promotedLink:"{0} veza",promotedLinks:"{0} veze",promotedLinkAriaDesc:"Indirektno",componentName:"Dijagram"},"oj-ojGantt":{componentName:"Gantogram",accessibleDurationDays:"{0} dana",accessibleDurationHours:"{0} sati",accessibleTaskInfo:"Početno vrijeme je {0}, završno vrijeme {1}, a trajanje {2}",accessibleMilestoneInfo:"Vrijeme je {0}",accessibleRowInfo:"Red {0}",accessibleTaskTypeMilestone:"Ključni događaj",accessibleTaskTypeSummary:"Sažetak",accessiblePredecessorInfo:"{0} prethodnika",accessibleSuccessorInfo:"{0} nasljednika",accessibleDependencyInfo:"Vrsta zavisnosti {0}, povezuje {1} sa {2}",startStartDependencyAriaDesc:"od početka do početka",startFinishDependencyAriaDesc:"od početka do kraja",finishStartDependencyAriaDesc:"od kraja do početka",finishFinishDependencyAriaDesc:"od kraja do kraja",tooltipZoomIn:"Uvećaj",tooltipZoomOut:"Umanji",labelLevel:"Nivo",labelRow:"Red",labelStart:"Početak",labelEnd:"Kraj",labelDate:"Datum",labelBaselineStart:"Referentni početak",labelBaselineEnd:"Referentni kraj",labelBaselineDate:"Referentni datum",labelDowntimeStart:"Početak vremena nedostupnosti",labelDowntimeEnd:"Kraj vremena nedostupnosti",labelOvertimeStart:"Početak prekovremenog rada",labelOvertimeEnd:"Kraj prekovremenog rada",labelAttribute:"Atribut",labelLabel:"Oznaka",labelProgress:"Napredak",labelMoveBy:"Pomakni za",labelResizeBy:"Promijeni veličinu za",taskMoveInitiated:"Pokrenuto je premještanje zadatka",taskResizeEndInitiated:"Pokrenut je završetak promjene veličine zadatka",taskResizeStartInitiated:"Pokrenut je početak promjene veličine zadatka",taskMoveSelectionInfo:"Izabrano je {0} ostalih",taskResizeSelectionInfo:"Izabrano je {0} ostalih",taskMoveInitiatedInstruction:"Koristi tipke sa strelicama za premještanje",taskResizeInitiatedInstruction:"Koristi tipke sa strelicama za promjenu veličine",taskMoveFinalized:"Premještanje zadatka završeno",taskResizeFinalized:"Promjena veličine zadatka završena",taskMoveCancelled:"Premještanje zadatka otkazano",taskResizeCancelled:"Promjena veličine zadatka otkazana",taskResizeStartHandle:"Pokazivač za početak promjene veličine zadatka",taskResizeEndHandle:"Pokazivač za kraj promjene veličine zadatka"},"oj-ojLegend":{componentName:"Legenda",tooltipExpand:"Proširi",tooltipCollapse:"Sažmi"},"oj-ojNBox":{highlightedCount:"{0}/{1}",labelOther:"Drugo",labelGroup:"Grupa",labelSize:"Veličina",labelAdditionalData:"Dodatni podaci",componentName:"Okvir {0}"},"oj-ojPictoChart":{componentName:"Grafikon sa slikom"},"oj-ojSparkChart":{componentName:"Grafikon"},"oj-ojSunburst":{labelColor:"Boja",labelSize:"Veličina",tooltipExpand:"Proširi",tooltipCollapse:"Sažmi",componentName:"Kružni prikaz"},"oj-ojTagCloud":{componentName:"Oblak s ključnim riječima"},"oj-ojThematicMap":{componentName:"Tematska mapa",areasRegion:"Područja",linksRegion:"Veze",markersRegion:"Oznake"},"oj-ojTimeAxis":{componentName:"Vremenska osa."},"oj-ojTimeline":{componentName:"Vremenska crta",accessibleItemDesc:"Opis: {0}.",accessibleItemEnd:"Završno vrijeme je {0}.",accessibleItemStart:"Početno vrijeme je {0}.",accessibleItemTitle:"Naslov: {0}.",labelSeries:"Serija",tooltipZoomIn:"Uvećaj",tooltipZoomOut:"Umanji",labelStart:"Početak",labelEnd:"Kraj",labelAccNavNextPage:"Sljedeća strana",labelAccNavPreviousPage:"Prethodna strana",tipArrowNextPage:"Sljedeće",tipArrowPreviousPage:"Prethodno",navArrowDisabledState:"Onemogućeno",labelDate:"Datum",labelTitle:"Naziv",labelDescription:"Opis",labelMoveBy:"Pomakni za",labelResizeBy:"Promijeni veličinu za",itemMoveInitiated:"Pokrenuto je premještanje stavke",itemResizeEndInitiated:"Pokrenut je završetak promjene veličine stavke",itemResizeStartInitiated:"Pokrenut je početak promjene veličine stavke",itemMoveSelectionInfo:"Izabrano je {0} ostalih",itemResizeSelectionInfo:"Izabrano je {0} ostalih",itemMoveInitiatedInstruction:"Koristi tipke sa strelicama za premještanje",itemResizeInitiatedInstruction:"Koristi tipke sa strelicama za promjenu veličine",itemMoveFinalized:"Dovršeno je premještanje stavke",itemResizeFinalized:"Dovršena je promjena veličine stavke",itemMoveCancelled:"Otkazano je premještanje stavke",itemResizeCancelled:"Otkazana je promjena veličine stavke",itemResizeStartHandle:"Pokazivač za početak promjene veličine stavke",itemResizeEndHandle:"Pokazivač za kraj promjene veličine stavke"},"oj-ojTreemap":{labelColor:"Boja",labelSize:"Veličina",tooltipIsolate:"Izoliraj",tooltipRestore:"Vrati",componentName:"Treemap"},"oj-dvtBaseComponent":{labelScalingSuffixThousand:"K",labelScalingSuffixMillion:"M",labelScalingSuffixBillion:"B",labelScalingSuffixTrillion:"T",labelScalingSuffixQuadrillion:"Q",labelInvalidData:"Nevažeći podaci",labelNoData:"Nema podataka za prikaz",labelClearSelection:"Poništi odabir",labelDataVisualization:"Vizualizacija podataka",stateSelected:"Izabrano",stateUnselected:"Nije izabrano",stateMaximized:"Maksimizirano",stateMinimized:"Minimizirano",stateExpanded:"Prošireno",stateCollapsed:"Sažeto",stateIsolated:"Izolirano",stateHidden:"Skriveno",stateVisible:"Vidljivo",stateDrillable:"Raščlanjivo",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} od {1}",accessibleContainsControls:"Sadrži kontrole"},"oj-ojRatingGauge":{labelInvalidData:"Nevažeći podaci",labelNoData:"Nema podataka za prikaz",labelClearSelection:"Poništi odabir",labelDataVisualization:"Vizualizacija podataka",stateSelected:"Izabrano",stateUnselected:"Nije izabrano",stateMaximized:"Maksimizirano",stateMinimized:"Minimizirano",stateExpanded:"Prošireno",stateCollapsed:"Sažeto",stateIsolated:"Izolirano",stateHidden:"Skriveno",stateVisible:"Vidljivo",stateDrillable:"Raščlanjivo",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} od {1}",accessibleContainsControls:"Sadrži kontrole",componentName:"Mjerač"},"oj-ojStatusMeterGauge":{labelInvalidData:"Nevažeći podaci",labelNoData:"Nema podataka za prikaz",labelClearSelection:"Poništi odabir",labelDataVisualization:"Vizualizacija podataka",stateSelected:"Izabrano",stateUnselected:"Nije izabrano",stateMaximized:"Maksimizirano",stateMinimized:"Minimizirano",stateExpanded:"Prošireno",stateCollapsed:"Sažeto",stateIsolated:"Izolirano",stateHidden:"Skriveno",stateVisible:"Vidljivo",stateDrillable:"Raščlanjivo",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} od {1}",accessibleContainsControls:"Sadrži kontrole",componentName:"Mjerač"},"oj-ojNavigationList":{defaultRootLabel:"Navigacijski spisak",hierMenuBtnLabel:"Dugme hijerarhijskog izbornika",selectedLabel:"izabrano",previousIcon:"Prethodna",msgFetchingData:"Dohvatanje podataka...",msgNoData:"Nema stavki za prikaz.",overflowItemLabel:"Više",accessibleReorderTouchInstructionText:"Dvaput dodirnite i držite. Čekajte zvuk pa povucite da biste prerasporedili.",accessibleReorderBeforeItem:"Ispred {item}",accessibleReorderAfterItem:"Iza {item}",labelCut:"Izreži",labelPasteBefore:"Zalijepi ispred",labelPasteAfter:"Zalijepi iza",labelRemove:"Ukloni",removeCueText:"Može se ukloniti"},"oj-ojSlider":{noValue:"ojSlider nema vrijednost",maxMin:"Maks. vrijednost mora biti veća od min.",startEnd:"Vrijednost value.start ne smije biti veća od vrijednosti value.end",valueRange:"Vrijednost mora biti između min. i maks. vrijednosti opsega",optionNum:"Opcija {option} nije broj",invalidStep:"Nije valjan korak; korak mora biti > 0",lowerValueThumb:"izbor niže vrijednosti",higherValueThumb:"izbor više vrijednosti"},"oj-ojDialog":{labelCloseIcon:"Zatvori"},"oj-ojPopup":{ariaLiveRegionInitialFocusFirstFocusable:"Ulazak u skočni prozor. Pritisnite F6 za navigaciju između skočnog prozora i povezane kontrole.",ariaLiveRegionInitialFocusNone:"Skočni prozor je otvoren. Pritisnite F6 za navigaciju između skočnog prozora i povezane kontrole.",ariaLiveRegionInitialFocusFirstFocusableTouch:"Ulazak u skočni prozor. On se može zatvoriti prelaskom do zadnje veze unutar njega.",ariaLiveRegionInitialFocusNoneTouch:"Skočni prozor je otvoren. Idite na sljedeću vezu da biste uspostavili fokus unutar skočnog prozora.",ariaFocusSkipLink:"Dvaput dodirni za prelazak na otvoreni skočni prozor.",ariaCloseSkipLink:"Dvaput dodirni za zatvaranje otvorenog skočnog prozora."},"oj-ojRefresher":{ariaRefreshLink:"Aktivirajte vezu da biste osvježili sadržaj",ariaRefreshingLink:"Osvježavanje sadržaja",ariaRefreshCompleteLink:"Osvježavanje završeno"},"oj-ojSwipeActions":{ariaShowStartActionsDescription:"Prikaži početne akcije",ariaShowEndActionsDescription:"Prikaži završne akcije",ariaHideActionsDescription:"Sakrij akcije"},"oj-ojIndexer":{indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",indexerOthers:"#",ariaDisabledLabel:"Nema podudarnog grupnog zaglavlja",ariaOthersLabel:"broj",ariaInBetweenText:"Između {first} i {second}",ariaKeyboardInstructionText:"Pritisni Enter za izbor vrijednosti.",ariaTouchInstructionText:"Dvaput dodirnuti  i držati. Čekati na zvuk i onda prevući da bi se preuredilo."},"oj-ojMenu":{labelCancel:"Odustani",ariaFocusSkipLink:"Fokus je unutar izbornika, dvaput dodirnuti ili  prevući da bi se fokus  pomjerio na prvu tačku izbornika."},"oj-ojColorSpectrum":{labelHue:"Nijansa",labelOpacity:"Neprozirnost",labelSatLum:"Zasićenost/osvijetljenost",labelThumbDesc:"Četverosmjerni klizač spektra boja."},"oj-ojColorPalette":{labelNone:"Ništa"},"oj-ojColorPicker":{labelSwatches:"Uzorci boje",labelCustomColors:"Prilagođene boje",labelPrevColor:"Prethodna boja",labelDefColor:"Zadana boja",labelDelete:"Izbriši",labelDeleteQ:"Izbrisati?",labelAdd:"Dodaj",labelAddColor:"Dodaj boju",labelMenuHex:"HEX",labelMenuRgba:"RGBa",labelMenuHsla:"HSLa",labelSliderHue:"Nijansa",labelSliderSaturation:"Zasićenost",labelSliderSat:"Sub",labelSliderLightness:"Svjetlina",labelSliderLum:"Osvjetljenje",labelSliderAlpha:"Alpha",labelOpacity:"Neprozirnost",labelSliderRed:"Crvena",labelSliderGreen:"Zelena",labelSliderBlue:"Plava"},"oj-ojFilePicker":{dropzoneText:"Ispusti datoteke ovdje i klikni za učitavanje",singleFileUploadError:"Učitaj jednu po jednu datoteku.",singleFileTypeUploadError:"Ne možete učitati datoteke vrste {fileType}.",multipleFileTypeUploadError:"Ne možete učitati datoteke vrste {fileTypes}.",dropzonePrimaryText:"Povuci i ispusti",secondaryDropzoneText:"Izaberi datoteku ili ispusti neku ovdje.",secondaryDropzoneTextMultiple:"Izaberi ili ispusti datoteke ovdje.",unknownFileType:"nepoznato"},"oj-ojProgressbar":{ariaIndeterminateProgressText:"U toku"},"oj-ojMessage":{labelCloseIcon:"Zatvori",categories:{error:"Greška",warning:"Upozorenje",info:"Informacije",confirmation:"Potvrda",none:"Ništa"}},"oj-ojSelector":{checkboxAriaLabel:"Potvrda okvira - {rowKey}",checkboxAriaLabelSelected:" izabrano",checkboxAriaLabelUnselected:" nije izabrano"},"oj-ojMessages":{labelLandmark:"Poruke",ariaLiveRegion:{navigationFromKeyboard:"Područje za unošenje poruka. Pritisnite F6 za povratak na prethodno fokusirani element.",navigationToTouch:"Područje za poruke ima nove poruke. Pomoću voice-over kružnog navigatora pređi na referentnu tačku za poruke.",navigationToKeyboard:"Područje za poruke sadrži nove poruke. Pritisnite F6 za prelazak na područje s najnovijim porukama.",newMessage:"Kategorija poruka {category}. {summary}. {detail}.",noDetail:"Detalji nisu dostupni"}},"oj-ojMessageBanner":{close:"Zatvori",navigationFromMessagesRegion:"Područje za unošenje poruka. Pritisnite F6 za povratak na prethodno fokusirani element.",navigationToMessagesRegion:"Područje za poruke sadrži nove poruke. Pritisnite F6 za prelazak na područje s najnovijim porukama.",error:"Greška",warning:"Upozorenje",info:"Informacije",confirmation:"Potvrda"},"oj-ojConveyorBelt":{tipArrowNext:"Sljedeća",tipArrowPrevious:"Prethodna"},"oj-ojTrain":{stepInfo:"Korak {index} od {count}.",stepStatus:"Status: {status}.",stepCurrent:"Trenutno",stepVisited:"Posjećeno",stepNotVisited:"Nije posjećeno",stepDisabled:"Onemogućeno",stepMessageType:"Vrsta poruke: {messageType}.",stepMessageConfirmation:"Potvrđeno",stepMessageInfo:"Informacije",stepMessageWarning:"Upozorenje",stepMessageError:"Greška"}});