define({"oj-message":{fatal:"Neotklonjivo",error:"Greška",warning:"Upozorenje",info:"Informacije",confirmation:"Potvrda","compact-type-summary":"{0}: {1}"},"oj-converter":{summary:"Vrednost nije u očekivanom formatu.",detail:"Unesite vrednost u očekivanom formatu.","plural-separator":", ",hint:{summary:"Primer: {exampleValue}",detail:"Unesite vrednost u ovom formatu: '{exampleValue}'.","detail-plural":"Unesite vrednost u ovim formatima: '{exampleValue}'."},optionHint:{detail:"Prihvaćena vrednost za opciju '{propertyName}' je '{propertyValueValid}'.","detail-plural":"Prihvaćene vrednosti za opciju '{propertyName}' su '{propertyValueValid}'."},optionTypesMismatch:{summary:"Vrednost za opciju '{requiredPropertyName}' je neophodna kada je opcija '{propertyName}' podešena kao '{propertyValue}'."},optionTypeInvalid:{summary:"Nije navedena vrednost očekivanog tipa za opciju '{propertyName}'."},optionOutOfRange:{summary:"Vrednost {propertyValue} je izvan opsega za opciju '{propertyName}'."},optionValueInvalid:{summary:"Navedena je nevažeća vrednost '{propertyValue}' za opciju '{propertyName}'."},number:{decimalFormatMismatch:{summary:"Navedena vrednost nije u očekivanom numeričkom formatu."},shortLongUnsupportedParse:{summary:"'short' i 'long' nisu podržani za analizu konvertora.",detail:"Promenite komponentu u 'readonly'. Polja 'readonly' ne pozivaju funkciju analize konvertora."},currencyFormatMismatch:{summary:"Navedena vrednost nije u očekivanom formatu za valutu."},percentFormatMismatch:{summary:"Navedena vrednost nije u očekivanom procentualnom formatu."},invalidNumberFormat:{summary:"Navedena vrednost nije važeći broj.",detail:"Navedite važeći broj."}},color:{invalidFormat:{summary:"Nevažeći format za boju.",detail:"Nevažeća specifikacija opcije formata za boju."},invalidSyntax:{summary:"Nevažeća specifikacija za boju.",detail:"Unesite vrednost boje u skladu sa CSS3 standardom."}},datetime:{datetimeOutOfRange:{summary:"Vrednost '{value}' je izvan opsega za '{propertyName}'.",detail:"Unesite vrednost između '{minValue}' i '{maxValue}'.",hour:"sat",minute:"minut",second:"sekunda",millisec:"milisekunda",month:"mesec",day:"dan",year:"godina","month name":"ime meseca",weekday:"radni dan"},dateFormatMismatch:{summary:"Navedena vrednost nije u očekivanom formatu za datum."},invalidTimeZoneID:{summary:"Naveden je nevažeći ID vremenske zone {timeZoneID}."},nonExistingTime:{summary:"Ne postoji vreme unosa jer se poklapa sa periodom prelaska na letnje računanje vremena."},missingTimeZoneData:{summary:"Nedostaju podaci vremenske zone. Pozovite zahtev 'ojs/ojtimezonedata' da bi se učitali podaci o vremenskoj zoni."},timeFormatMismatch:{summary:"Navedena vrednost nije u očekivanom vremenskom formatu."},datetimeFormatMismatch:{summary:"Navedena vrednost nije u očekivanom formatu za datum i vreme."},dateToWeekdayMismatch:{summary:"Dan '{date}' nije '{weekday}'.",detail:"Unesite ime radnog dana koji odgovara datumu."},invalidISOString:{invalidRangeSummary:"Vrednost '{value}' je van opsega za polje '{propertyName}' u nisci ISO 8601 '{isoStr}'.",summary:"Navedena niska '{isoStr}' nije važeća ISO 8601 niska.",detail:"Navedite važeću ISO 8601 nisku."}}},"oj-validator":{length:{hint:{min:"Unesite {min} ili više znakova.",max:"Unesite {max} ili manje znakova.",inRange:"Unesite broj znakova: od {min} do {max}.",exact:"Unesite {length} znak(ov)a."},messageDetail:{tooShort:"Unesite {min} ili više znakova.",tooLong:"Unesite najviše sledeći broj znakova: {max}."},messageSummary:{tooShort:"Uneli ste premalo znakova.",tooLong:"Uneli ste previše znakova."}},range:{number:{hint:{min:"Unesite broj koji je veći od {min} ili jednak tome.",max:"Unesite broj koji je manji od {max} ili jednak tome.",inRange:"Unesite broj između {min} i {max}.",exact:"Unesite broj {num}."},messageDetail:{rangeUnderflow:"Unesite {min} ili veći broj.",rangeOverflow:"Unesite {max} ili manji broj.",exact:"Unesite broj {num}."},messageSummary:{rangeUnderflow:"Broj je premali.",rangeOverflow:"Broj je previsok."}},datetime:{hint:{min:"Unesite datum i vreme kao {min} ili kasnije.",max:"Unesite datum i vreme kao {max} ili ranije.",inRange:"Unesite datum i vreme između {min} i {max}."},messageDetail:{rangeUnderflow:"Unesite datum kao {min} ili kasniji.",rangeOverflow:"Unesite datum kao {max} ili raniji."},messageSummary:{rangeUnderflow:"Datum i vreme su ranije u odnosu na minimalni datum i vreme.",rangeOverflow:"Datum i vreme su kasnije u odnosu na maksimalni datum i vreme."}},date:{hint:{min:"Unesite datum kao {min} ili kasniji.",max:"Unesite datum kao {max} ili raniji.",inRange:"Unesite datum između {min} i {max}."},messageDetail:{rangeUnderflow:"Unesite datum kao {min} ili kasniji.",rangeOverflow:"Unesite datum kao {max} ili raniji."},messageSummary:{rangeUnderflow:"Datum je raniji u odnosu na minimalni datum.",rangeOverflow:"Datum je kasniji u odnosu na maksimalni datum."}},time:{hint:{min:"Unesite vreme kao {min} ili kasnije.",max:"Unesite vreme kao {max} ili ranije.",inRange:"Unesite vreme između {min} i {max}."},messageDetail:{rangeUnderflow:"Unesite vreme koje se podudara sa {min} ili kasnije.",rangeOverflow:"Unesite vreme koje se podudara sa {max} ili ranije."},messageSummary:{rangeUnderflow:"Vreme je ranije u odnosu na minimalno vreme.",rangeOverflow:"Vreme je kasnije u odnosu na maksimalno vreme."}}},restriction:{date:{messageSummary:"Datum {value} je onemogućen unos.",messageDetail:"Izabrani datum nije dostupan. Pokušajte sa drugim datumom."}},regExp:{summary:"Format je neispravan.",detail:"Unesite dozvoljene vrednosti opisane u ovom uobičajenom izrazu: '{pattern}'."},required:{summary:"Vrednost je obavezna.",detail:"Unesite vrednost."}},"oj-ojEditableValue":{loading:"Učitavanje",requiredText:"Obavezno",helpSourceText:"Saznajte više..."},"oj-ojInputDate":{done:"Gotovo",cancel:"Otkaži",time:"Vreme",prevText:"Prethodno",nextText:"Sledeće",currentText:"Danas",weekHeader:"Ned.",tooltipCalendar:"Izaberite datum.",tooltipCalendarTime:"Izaberite datum i vreme.",tooltipCalendarDisabled:"Biranje datuma je onemogućeno.",tooltipCalendarTimeDisabled:"Biranje datuma i vremena je onemogućeno.",picker:"Birač",weekText:"Nedelja",datePicker:"Birač datuma",inputHelp:"Pritisnite dugme sa strelicom nadole ili nagore da biste pristupili kalendaru.",inputHelpBoth:"Pritisnite dugme sa strelicom nadole ili nagore da biste pristupili kalendaru i Shift + strelica nadole ili Shift + strelica nagore da biste pristupili padajućem meniju sa vremenom.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},dateRestriction:{hint:"",messageSummary:"",messageDetail:""}},"oj-ojInputTime":{cancelText:"Otkaži",okText:"U redu",currentTimeText:"Sada",hourWheelLabel:"Sat",minuteWheelLabel:"Minut",ampmWheelLabel:"AMPM",tooltipTime:"Izbor vremena.",tooltipTimeDisabled:"Biranje vremena je onemogućeno.",inputHelp:"Pritisnite dugme sa strelicom nadole ili nagore da biste pristupili padajućem meniju sa vremenom.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}}},"oj-inputBase":{required:{hint:"",messageSummary:"",messageDetail:""},regexp:{messageSummary:"",messageDetail:""},accessibleMaxLengthExceeded:"Maksimalna dužina od {len} je premašena.",accessibleMaxLengthRemaining:"Preostali broj znakova je {chars}."},"oj-ojInputPassword":{regexp:{messageDetail:"Vrednost mora da se poklapa sa ovim obrascem: '{pattern}'."},accessibleShowPassword:"Prikaži lozinku.",accessibleHidePassword:"Sakrij lozinku."},"oj-ojFilmStrip":{labelAccFilmStrip:"Prikazuje se stranica {pageIndex} od ukupno {pageCount}",labelAccArrowNextPage:"Izaberite 'Sledeće' da biste prikazali sledeću stranicu",labelAccArrowPreviousPage:"Izaberite 'Prethodno' da biste prikazali prethodnu stranicu",tipArrowNextPage:"Sledeće",tipArrowPreviousPage:"Prethodno"},"oj-ojDataGrid":{accessibleSortAscending:"{id} sortirano rastućim redosledom",accessibleSortDescending:"{id} sortirano opadajućim redosledom",accessibleSortable:"{id} moguće sortiranje",accessibleActionableMode:"Pređite na funkcionalni režim.",accessibleNavigationMode:"Pređite na navigacioni režim, pritisnite dugme F2 da biste prešli na režim za uređivanje ili režim za preduzimanje radnji.",accessibleEditableMode:"Pređite na režim za uređivanje, pritisnite dugme 'escape' da biste napustili mrežu podataka.",accessibleSummaryExact:"Ovo je mreža podataka sa {rownum} redova i {colnum} kolona",accessibleSummaryEstimate:"Ovo je mreža podataka sa nepoznatim brojem redova i kolona",accessibleSummaryExpanded:"Broj trenutno proširenih redova je {num}",accessibleRowExpanded:"Prošireni redovi",accessibleExpanded:"Prošireno",accessibleRowCollapsed:"Skupljeni redovi",accessibleCollapsed:"Skupljeno",accessibleRowSelected:"Izabran je red {row}",accessibleColumnSelected:"Izabrana je kolona {column}",accessibleStateSelected:"izabrano",accessibleMultiCellSelected:"Broj izabranih ćelija je {num}",accessibleColumnSpanContext:"{extent} po širini",accessibleRowSpanContext:"{extent} po visini",accessibleRowContext:"Red {index}",accessibleColumnContext:"Kolona {index}",accessibleRowHeaderContext:"Zaglavlje reda {index}",accessibleColumnHeaderContext:"Zaglavlje kolone {index}",accessibleRowEndHeaderContext:"Zaglavlje kraja reda {index}",accessibleColumnEndHeaderContext:"Zaglavlje kraja kolone {index}",accessibleRowHeaderLabelContext:"Oznaka zaglavlja reda {level}",accessibleColumnHeaderLabelContext:"Oznaka zaglavlja kolone {level}",accessibleRowEndHeaderLabelContext:"Oznaka zaglavlja kraja reda {level}",accessibleColumnEndHeaderLabelContext:"Oznaka zaglavlja kraja kolone {level}",accessibleLevelContext:"Nivo {level}",accessibleRangeSelectModeOn:"Uključen je režim za dodavanje izabranog opsega ćelija.",accessibleRangeSelectModeOff:"Isključen je režim za dodavanje izabranog opsega ćelija.",accessibleFirstRow:"Došli ste do prvog reda.",accessibleLastRow:"Došli ste do poslednjeg reda.",accessibleFirstColumn:"Došli ste do prve kolone",accessibleLastColumn:"Došli ste do poslednje kolone.",accessibleSelectionAffordanceTop:"Ručica za izbor odozgo.",accessibleSelectionAffordanceBottom:"Ručica za izbor odozdo.",msgFetchingData:"Podaci se preuzimaju...",msgNoData:"Nema stavki za prikaz.",labelResize:"Promeni veličinu",labelResizeWidth:"Promeni širinu",labelResizeHeight:"Promeni visinu",labelSortAsc:"Sortiraj rastuće",labelSortDsc:"Sortiraj opadajuće",labelSortRow:"Sortiraj redove",labelSortRowAsc:"Sortiraj redove po rastućem redosledu",labelSortRowDsc:"Sortiraj redove po opadajućem redosledu",labelSortCol:"Sortiraj kolone",labelSortColAsc:"Sortiraj kolone po rastućem redosledu",labelSortColDsc:"Sortiraj kolone po opadajućem redosledu",labelCut:"Iseci",labelPaste:"Nalepi",labelCutCells:"Iseci",labelPasteCells:"Nalepi",labelCopyCells:"Kopiraj",labelAutoFill:"Automatsko popunjavanje",labelEnableNonContiguous:"Omogući izbor stavki koje nisu susedne",labelDisableNonContiguous:"Onemogući izbor stavki koje nisu susedne",labelResizeDialogSubmit:"U redu",labelResizeDialogCancel:"Otkaži",accessibleContainsControls:"Sadrži kontrole",labelSelectMultiple:"Izaberite više ćelija",labelResizeDialogApply:"Primeni",labelResizeFitToContent:"Promeni veličinu tako da se uklopi",columnWidth:"Širina u piskelima",rowHeight:"Visina u pikselima",labelResizeColumn:"Promena veličine kolone",labelResizeRow:"Promeni veličinu reda",resizeColumnDialog:"Promena veličine kolone",resizeRowDialog:"Promeni veličinu reda",collapsedText:"Skupi",expandedText:"Proširi",tooltipRequired:"Obavezno"},"oj-ojRowExpander":{accessibleLevelDescription:"Nivo {level}",accessibleRowDescription:"Nivo {level}, red {num} od {total}",accessibleRowExpanded:"Prošireni red",accessibleRowCollapsed:"Skupljeni red",accessibleStateExpanded:"prošireno",accessibleStateCollapsed:"skupljeno"},"oj-ojStreamList":{msgFetchingData:"Podaci se preuzimaju..."},"oj-ojListView":{msgFetchingData:"Podaci se preuzimaju...",msgNoData:"Nema stavki za prikaz.",msgItemsAppended:"Broj stavki dodatih na kraj je {count}.",msgFetchCompleted:"Sve stavke su preuzete.",indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",accessibleReorderTouchInstructionText:"Dvaput dodirnite i zadržite. Sačekajte zvuk i prevucite stavku da biste preuredili.",accessibleReorderBeforeItem:"Pre {item}",accessibleReorderAfterItem:"Posle {item}",accessibleReorderInsideItem:"Unutra {item}",accessibleNavigateSkipItems:"Broj stavki koje se preskaču: {numSkip}",labelCut:"Iseci",labelCopy:"Kopiraj",labelPaste:"Nalepi",labelPasteBefore:"Nalepi ispred",labelPasteAfter:"Nalepi posle"},"oj-ojWaterfallLayout":{msgFetchingData:"Podaci se preuzimaju..."},"oj-_ojLabel":{tooltipHelp:"Pomoć",tooltipRequired:"Obavezno"},"oj-ojLabel":{tooltipHelp:"Pomoć",tooltipRequired:"Obavezno"},"oj-ojInputNumber":{required:{hint:"",messageSummary:"",messageDetail:""},numberRange:{hint:{min:"",max:"",inRange:"",exact:""},messageDetail:{rangeUnderflow:"",rangeOverflow:"",exact:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},tooltipDecrement:"Smanjivanje",tooltipIncrement:"Povećavanje"},"oj-ojTable":{accessibleColumnContext:"Kolona {index}",accessibleColumnFooterContext:"Podnožje kolone {index}",accessibleColumnHeaderContext:"Zaglavlje kolone {index}",accessibleContainsControls:"Sadrži kontrole",accessibleRowContext:"Red {index}",accessibleSortable:"{id} moguće sortiranje",accessibleSortAscending:"{id} sortirano rastućim redosledom",accessibleSortDescending:"{id} sortirano opadajućim redosledom",accessibleStateSelected:"izabrano",accessibleStateUnselected:"nije izabrano",accessibleSummaryEstimate:"Tabela sa sledećim brojem kolona: {colnum} i redova: preko {rownum}",accessibleSummaryExact:"Tabela sa sledećim brojem kolona: {colnum} i redova: {rownum}",labelAccSelectionAffordanceTop:"Ručica za izbor odozgo",labelAccSelectionAffordanceBottom:"Ručica za izbor odozdo",labelEnableNonContiguousSelection:"Omogući izbor stavki koje nisu susedne",labelDisableNonContiguousSelection:"Onemogući izbor stavki koje nisu susedne",labelResize:"Promeni veličinu",labelResizeColumn:"Promena veličine kolone",labelResizePopupSubmit:"U redu",labelResizePopupCancel:"Otkaži",labelResizePopupSpinner:"Promena veličine kolone",labelResizeColumnDialog:"Promena veličine kolone",labelColumnWidth:"Širina u piskelima",labelResizeDialogApply:"Primeni",labelSelectRow:"Izbor reda",labelSelectAllRows:"Izaberi sve redove",labelEditRow:"Uređivanje reda",labelSelectAndEditRow:"Izbor i uređivanje reda",labelSelectColumn:"Izbor kolone",labelSort:"Sortiraj",labelSortAsc:"Sortiraj rastuće",labelSortDsc:"Sortiraj opadajuće",msgFetchingData:"Podaci se preuzimaju...",msgNoData:"Nema podataka za prikaz.",msgInitializing:"Pokretanje...",msgColumnResizeWidthValidation:"Vrednost za širinu mora da bude ceo broj.",msgScrollPolicyMaxCountSummary:"Prekoračen je maksimalan broj redova za pomeranje tabele.",msgScrollPolicyMaxCountDetail:"Ponovo učitajte uz manji skup podataka.",msgStatusSortAscending:"{0} sortirano rastućim redosledom.",msgStatusSortDescending:"{0} sortirano opadajućim redosledom.",tooltipRequired:"Obavezno"},"oj-ojTabs":{labelCut:"Iseci",labelPasteBefore:"Nalepi ispred",labelPasteAfter:"Nalepi posle",labelRemove:"Ukloni",labelReorder:"Promeni redosled",removeCueText:"Može da se ukloni"},"oj-ojCheckboxset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Izaberite vrednost."}},"oj-ojRadioset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Izaberite vrednost."}},"oj-ojSelect":{required:{hint:"",messageSummary:"",messageDetail:"Izaberite vrednost."},searchField:"Polje za pretragu",noMatchesFound:"Nije pronađen nijedan pogodak",noMoreResults:"Nema više rezultata",oneMatchesFound:"Pronađen je jedan rezultat",moreMatchesFound:"Broj pronađenih rezultata: {num}",filterFurther:"Dostupno je više rezultata, koristite dalje filtere."},"oj-ojSwitch":{SwitchON:"Uključeno",SwitchOFF:"Isključeno"},"oj-ojCombobox":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Nije pronađen nijedan pogodak",noMoreResults:"Nema više rezultata",oneMatchesFound:"Pronađen je jedan rezultat",moreMatchesFound:"Broj pronađenih rezultata: {num}",filterFurther:"Dostupno je više rezultata, koristite dalje filtere."},"oj-ojSelectSingle":{required:{hint:"",messageSummary:"",messageDetail:"Izaberite vrednost."},noMatchesFound:"Nije pronađen nijedan pogodak",oneMatchFound:"Pronađen je jedan rezultat",multipleMatchesFound:"Broj pronađenih rezultata: {num}",nOrMoreMatchesFound:"Broj pronađenih rezultata: {num} ili više",cancel:"Otkaži",labelAccOpenDropdown:"proširi",labelAccClearValue:"obriši vrednost",noResultsLine1:"Rezultati nisu pronađeni",noResultsLine2:"Nisu pronađeni podudarni rezultati za pretragu.."},"oj-ojInputSearch2":{cancel:"Otkaži",noSuggestionsFound:"Nije pronađen nijedan predlog"},"oj-ojInputSearch":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Nije pronađen nijedan pogodak",oneMatchesFound:"Pronađen je jedan rezultat",moreMatchesFound:"Broj pronađenih rezultata: {num}"},"oj-ojTreeView":{treeViewSelectorAria:"Birač za prikaz stabla {rowKey}",retrievingDataAria:"Preuzimaju se podaci za čvor: {nodeText}",receivedDataAria:"Primljeni su podaci za čvor: {nodeText}"},"oj-ojTree":{stateLoading:"Učitavanje...",labelNewNode:"Novi čvor",labelMultiSelection:"Višestruki izbor",labelEdit:"Uređivanje",labelCreate:"Kreiraj",labelCut:"Iseci",labelCopy:"Kopiraj",labelPaste:"Nalepi",labelPasteAfter:"Nalepi posle",labelPasteBefore:"Nalepi ispred",labelRemove:"Ukloni",labelRename:"Preimenuj",labelNoData:"Nema podataka"},"oj-ojPagingControl":{labelAccPaging:"Numerisanje stranica",labelAccPageNumber:"Učitan je sadržaj stranice {pageNum}.",labelAccNavFirstPage:"Prva stranica",labelAccNavLastPage:"Poslednja stranica",labelAccNavNextPage:"Sledeća stranica",labelAccNavPreviousPage:"Prethodna stranica",labelAccNavPage:"Stranica",labelLoadMore:"Prikaži više...",labelLoadMoreMaxRows:"Dostignuto je maksimalno ograničenje ({maxRows}) broja redova",labelNavInputPage:"Stranica",labelNavInputPageMax:"od {pageMax}",fullMsgItemRange:"Stavke: {pageFrom}-{pageTo} od {pageMax}",fullMsgItemRangeAtLeast:"Stavke: {pageFrom}-{pageTo} od najmanje {pageMax}",fullMsgItemRangeApprox:"Stavke: {pageFrom}-{pageTo} od oko {pageMax}",msgItemRangeNoTotal:"Stavke: {pageFrom}-{pageTo}",fullMsgItem:"Stavke: {pageTo} od {pageMax}",fullMsgItemAtLeast:"Stavke: {pageTo} od najmanje {pageMax}",fullMsgItemApprox:"Stavke: {pageTo} od oko {pageMax}",msgItemNoTotal:"Stavke: {pageTo}",msgItemRangeCurrent:"{pageFrom}-{pageTo}",msgItemRangeCurrentSingle:"{pageFrom}",msgItemRangeOf:"od",msgItemRangeOfAtLeast:"od najmanje",msgItemRangeOfApprox:"od oko",msgItemRangeItems:"stavke",tipNavInputPage:"Idi na stranicu",tipNavPageLink:"Idi na stranicu {pageNum}",tipNavNextPage:"Sledeće",tipNavPreviousPage:"Prethodno",tipNavFirstPage:"Prvo",tipNavLastPage:"Poslednje",pageInvalid:{summary:"Uneta je nevažeća vrednost za stranicu.",detail:"Unesite vrednost veću od 0."},maxPageLinksInvalid:{summary:"Vrednost za maxPageLinks je nevažeća.",detail:"Unesite vrednost veću od 4."}},"oj-ojMasonryLayout":{labelCut:"Iseci",labelPasteBefore:"Nalepi ispred",labelPasteAfter:"Nalepi posle"},"oj-panel":{labelAccButtonExpand:"Proširi",labelAccButtonCollapse:"Skupi",labelAccButtonRemove:"Ukloni",labelAccFlipForward:"Okreni napred",labelAccFlipBack:"Okreni nazad",tipDragToReorder:"Prevucite da biste promenili raspored",labelAccDragToReorder:"Prevucite da biste promenili raspored, dostupan je kontekstualni meni"},"oj-ojChart":{labelDefaultGroupName:"Grupa {0}",labelSeries:"Serija",labelGroup:"Grupa",labelDate:"Datum",labelValue:"Vrednost",labelTargetValue:"Cilj",labelX:"X",labelY:"Y",labelZ:"Z",labelPercentage:"Procenat",labelLow:"Nisko",labelHigh:"Visoko",labelOpen:"Otvori",labelClose:"Zatvori",labelVolume:"Disk",labelQ1:"Q1",labelQ2:"Q2",labelQ3:"Q3",labelMin:"Min.",labelMax:"Maks.",labelOther:"Ostalo",tooltipPan:"Pan prikaz",tooltipSelect:"Izbor pomičnog teksta",tooltipZoom:"Uvećavanje pomičnog teksta",componentName:"Grafikon"},"oj-dvtBaseGauge":{componentName:"Merač"},"oj-ojDiagram":{promotedLink:"{0} veza",promotedLinks:"Broj veza: {0}",promotedLinkAriaDesc:"Indirektno",componentName:"Dijagram"},"oj-ojGantt":{componentName:"Gantov grafikon",accessibleDurationDays:"{0} dana",accessibleDurationHours:"{0} č.",accessibleTaskInfo:"Vreme početka je {0}, vreme završetka je {1}, trajanje je {2}",accessibleMilestoneInfo:"Vreme je {0}",accessibleRowInfo:"Red {0}",accessibleTaskTypeMilestone:"Ključna tačka",accessibleTaskTypeSummary:"Rezime",accessiblePredecessorInfo:"Prethodnici: {0}",accessibleSuccessorInfo:"Naslednici: {0}",accessibleDependencyInfo:"Tip zavisnosti {0}, povezuje {1} sa {2}",startStartDependencyAriaDesc:"od početka do početka",startFinishDependencyAriaDesc:"od početka do kraja",finishStartDependencyAriaDesc:"od kraja do početka",finishFinishDependencyAriaDesc:"od kraja do kraja",tooltipZoomIn:"Uvećaj",tooltipZoomOut:"Umanji",labelLevel:"Nivo",labelRow:"Red",labelStart:"Početak",labelEnd:"Kraj",labelDate:"Datum",labelBaselineStart:"Početak odobrenja",labelBaselineEnd:"Završetak odobrenja",labelBaselineDate:"Datum odobrenja",labelDowntimeStart:"Početak prekida rada",labelDowntimeEnd:"Kraj prekida rada",labelOvertimeStart:"Početak prekovremenog rada",labelOvertimeEnd:"Kraj prekovremenog rada",labelAttribute:"Atribut",labelLabel:"Oznaka",labelProgress:"Napredovanje",labelMoveBy:"Pomeranje za",labelResizeBy:"Promena veličine za",taskMoveInitiated:"Pokrenut je zadatak premeštanja",taskResizeEndInitiated:"Pokrenut je završetak zadatka promene veličine",taskResizeStartInitiated:"Pokrenut je početak zadatka promene veličine",taskMoveSelectionInfo:"Drugi izbori: {0}",taskResizeSelectionInfo:"Drugi izbori: {0}",taskMoveInitiatedInstruction:"Koristite strelice da biste se pomerali",taskResizeInitiatedInstruction:"Koristite strelice da biste promenili veličinu",taskMoveFinalized:"Zadatak premeštanja je dovršen",taskResizeFinalized:"Zadatak promene veličine je dovršen",taskMoveCancelled:"Zadatak premeštanja je otkazan",taskResizeCancelled:"Zadatak promene veličine je otkazan",taskResizeStartHandle:"Ručica za započinjanje zadatka promene veličine",taskResizeEndHandle:"Ručica za završetak zadatka promene veličine"},"oj-ojLegend":{componentName:"Legenda",tooltipExpand:"Proširi",tooltipCollapse:"Skupi"},"oj-ojNBox":{highlightedCount:"{0}/{1}",labelOther:"Ostalo",labelGroup:"Grupa",labelSize:"Veličina",labelAdditionalData:"Dodatni podaci",componentName:"{0} okvir"},"oj-ojPictoChart":{componentName:"Ilustrovani grafikon"},"oj-ojSparkChart":{componentName:"Grafikon"},"oj-ojSunburst":{labelColor:"Boja",labelSize:"Veličina",tooltipExpand:"Proširi",tooltipCollapse:"Skupi",componentName:"Sunburst grafikon"},"oj-ojTagCloud":{componentName:"Oblak oznaka"},"oj-ojThematicMap":{componentName:"Tematska mapa",areasRegion:"Oblasti",linksRegion:"Veze",markersRegion:"Markeri"},"oj-ojTimeAxis":{componentName:"Vremenska osa"},"oj-ojTimeline":{componentName:"Vremenska linija",accessibleItemDesc:"Opis je {0}.",accessibleItemEnd:"Vreme završetka je {0}.",accessibleItemStart:"Vreme početka je {0}.",accessibleItemTitle:"Naslov je {0}.",labelSeries:"Serija",tooltipZoomIn:"Uvećaj",tooltipZoomOut:"Umanji",labelStart:"Početak",labelEnd:"Kraj",labelAccNavNextPage:"Sledeća stranica",labelAccNavPreviousPage:"Prethodna stranica",tipArrowNextPage:"Sledeće",tipArrowPreviousPage:"Prethodno",navArrowDisabledState:"Onemogućeno",labelDate:"Datum",labelTitle:"Naslov",labelDescription:"Opis",labelMoveBy:"Pomeranje za",labelResizeBy:"Promena veličine za",itemMoveInitiated:"Pokrenuto je premeštanje stavke",itemResizeEndInitiated:"Pokrenut je završetak promene veličine stavke",itemResizeStartInitiated:"Pokrenut je početak promene veličine stavke",itemMoveSelectionInfo:"Drugi izbori: {0}",itemResizeSelectionInfo:"Drugi izbori: {0}",itemMoveInitiatedInstruction:"Koristite strelice da biste se pomerali",itemResizeInitiatedInstruction:"Koristite strelice da biste promenili veličinu",itemMoveFinalized:"Završeno je premeštanje stavke",itemResizeFinalized:"Završena je promena veličine stavke",itemMoveCancelled:"Otkazano je premeštanje stavke",itemResizeCancelled:"Otkazana je promena veličine stavke",itemResizeStartHandle:"Ručica za započinjanje promene veličine stavke",itemResizeEndHandle:"Ručica za završetak promene veličine stavke"},"oj-ojTreemap":{labelColor:"Boja",labelSize:"Veličina",tooltipIsolate:"Izolacija",tooltipRestore:"Vraćanje",componentName:"Treemap grafikon"},"oj-dvtBaseComponent":{labelScalingSuffixThousand:"K",labelScalingSuffixMillion:"M",labelScalingSuffixBillion:"B",labelScalingSuffixTrillion:"T",labelScalingSuffixQuadrillion:"Q",labelInvalidData:"Nevažeći podaci",labelNoData:"Nema podataka za prikaz",labelClearSelection:"Obriši izbor",labelDataVisualization:"Vizuelizacija podataka",stateSelected:"Izabrano",stateUnselected:"Neizabrano",stateMaximized:"Uvećano",stateMinimized:"Umanjeno",stateExpanded:"Prošireno",stateCollapsed:"Skupljeno",stateIsolated:"Izolovano",stateHidden:"Sakriveno",stateVisible:"Vidljivo",stateDrillable:"Može da se detaljno analizira",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} od {1}",accessibleContainsControls:"Sadrži kontrole"},"oj-ojNavigationList":{defaultRootLabel:"Lista za navigaciju",hierMenuBtnLabel:"Dugme hijerarhijskog menija",selectedLabel:"izabrano",previousIcon:"Prethodno",msgFetchingData:"Podaci se preuzimaju...",msgNoData:"Nema stavki za prikaz.",overflowItemLabel:"Više",accessibleReorderTouchInstructionText:"Dvaput dodirnite i zadržite. Sačekajte zvuk i prevucite stavku da biste preuredili.",accessibleReorderBeforeItem:"Pre {item}",accessibleReorderAfterItem:"Posle {item}",labelCut:"Iseci",labelPasteBefore:"Nalepi ispred",labelPasteAfter:"Nalepi posle",labelRemove:"Ukloni",removeCueText:"Može da se ukloni"},"oj-ojSlider":{noValue:"ojSlider nema nijednu vrednost",maxMin:"Maksimum mora da bude veći od minimuma ili jednak tome",startEnd:"vrednost value.start ne sme da bude veća od vrednosti value.end",valueRange:"Vrednost mora da bude u rasponu između minimuma i maksimuma",optionNum:"{option} opcija nije broj",invalidStep:"Nevažeći korak, korak mora da bude >0",lowerValueThumb:"sličica za nižu vrednost",higherValueThumb:"sličica za višu vrednost"},"oj-ojDialog":{labelCloseIcon:"Zatvori"},"oj-ojPopup":{ariaLiveRegionInitialFocusFirstFocusable:"Prelazak u iskačući prozor. Pritisnite F6 da biste prelazili između iskačućeg prozora i povezane kontrole.",ariaLiveRegionInitialFocusNone:"Otvoren je iskačući prozor. Pritisnite F6 da biste prelazili između iskačućeg prozora i povezane kontrole.",ariaLiveRegionInitialFocusFirstFocusableTouch:"Prelazak u iskačući prozor. Iskačući prozor može da se zatvori odlaskom na poslednju vezu unutar iskačućeg prozora.",ariaLiveRegionInitialFocusNoneTouch:"Otvoren je iskačući prozor. Idite na sledeću vezu da biste ustanovili fokus unutar iskačućeg prozora.",ariaFocusSkipLink:"Dvaput dodirnite da biste prešli na otvoreni iskačući prozor.",ariaCloseSkipLink:"Dvaput dodirnite da biste zatvorili otvoreni iskačući prozor."},"oj-ojRefresher":{ariaRefreshLink:"Aktivirajte vezu da biste osvežili sadržaj",ariaRefreshingLink:"Osvežavanje sadržaja",ariaRefreshCompleteLink:"Osvežavanje je završeno"},"oj-ojSwipeActions":{ariaShowStartActionsDescription:"Prikaz početnih radnji",ariaShowEndActionsDescription:"Prikaz završnih radnji",ariaHideActionsDescription:"Sakrivanje radnji"},"oj-ojIndexer":{indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",indexerOthers:"#",ariaDisabledLabel:"Nema nijedne grupe zaglavlja koja se podudara",ariaOthersLabel:"broj",ariaInBetweenText:"Između {first} i {second}",ariaKeyboardInstructionText:"Pritisnite 'enter' da biste izabrali vrednost.",ariaTouchInstructionText:"Dvaput dodirnite i zadržite da biste prešli na režim gestikulacije, a zatim prevucite nagore ili nadole da biste prilagodili vrednost."},"oj-ojMenu":{labelCancel:"Otkaži",ariaFocusSkipLink:"Fokus je u okviru menija, dvaput dodirnite ili brzo prevucite da biste pomerili fokus na prvu stavku menija."},"oj-ojColorSpectrum":{labelHue:"Nijansa",labelOpacity:"Neprozirnost",labelSatLum:"Zasićenost/osvetljenje",labelThumbDesc:"Klizač u četiri smera za podešavanje spektruma boja."},"oj-ojColorPalette":{labelNone:"Nijedno"},"oj-ojColorPicker":{labelSwatches:"Uzorci boja",labelCustomColors:"Prilagođene boje",labelPrevColor:"Prethodna boja",labelDefColor:"Podrazumevana boja",labelDelete:"Izbriši",labelDeleteQ:"Izbrisati?",labelAdd:"Dodaj",labelAddColor:"Dodaj boju",labelMenuHex:"HEX",labelMenuRgba:"RGBa",labelMenuHsla:"HSLa",labelSliderHue:"Nijansa",labelSliderSaturation:"Zasićenost",labelSliderSat:"Zas.",labelSliderLightness:"Svetlo",labelSliderLum:"Osvetljenje",labelSliderAlpha:"Alfa",labelOpacity:"Neprozirnost",labelSliderRed:"Crvena",labelSliderGreen:"Zelena",labelSliderBlue:"Plava"},"oj-ojFilePicker":{dropzoneText:"Ovde otpustite datoteke ili kliknite da biste ih otpremili",singleFileUploadError:"Otpremajte jednu po jednu datoteku.",singleFileTypeUploadError:"Ne možete da otpremate datoteke tipa {fileType}.",multipleFileTypeUploadError:"Ne možete da otpremate datoteke tipa: {fileTypes}.",dropzonePrimaryText:"Prevucite i otpustite",secondaryDropzoneText:"Izaberite datoteku ili je otpustite ovde.",secondaryDropzoneTextMultiple:"Izaberite ili prevucite datoteke ovde.",unknownFileType:"nepoznato"},"oj-ojProgressbar":{ariaIndeterminateProgressText:"U toku"},"oj-ojMessage":{labelCloseIcon:"Zatvori",categories:{error:"Greška",warning:"Upozorenje",info:"Informacije",confirmation:"Potvrda"}},"oj-ojSelector":{checkboxAriaLabel:"Izbor polja za potvrdu {rowKey}",checkboxAriaLabelSelected:" je izabrano",checkboxAriaLabelUnselected:" nije izabrano"},"oj-ojMessages":{labelLandmark:"Poruke",ariaLiveRegion:{navigationFromKeyboard:"Prelazak na oblast za poruke. Pritisnite F6 da biste se vratili na element koji je pre toga bio u fokusu.",navigationToTouch:"Oblast za poruke sadrži nove poruke. Koristite rotor za glasovne komande da biste prešli na označenu oblast za poruke.",navigationToKeyboard:"Oblast za poruke sadrži nove poruke. Pritisnite F6 da biste prešli na region najnovije poruke.",newMessage:"Kategorija poruke {category}. {summary}. {detail}."}},"oj-ojMessageBanner":{close:"Zatvori",navigationFromMessagesRegion:"Prelazak na oblast za poruke. Pritisnite F6 da biste se vratili na element koji je pre toga bio u fokusu.",navigationToMessagesRegion:"Oblast za poruke sadrži nove poruke. Pritisnite F6 da biste prešli na region najnovije poruke.",error:"Greška",warning:"Upozorenje",info:"Informacije",confirmation:"Potvrda"},"oj-ojConveyorBelt":{tipArrowNext:"Sledeće",tipArrowPrevious:"Prethodno"}});