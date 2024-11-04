define({"oj-message":{fatal:"Fatal",error:"Fejl",warning:"Advarsel",info:"Oplysninger",confirmation:"Bekræftelse","compact-type-summary":"{0}: {1}"},"oj-converter":{summary:"Værdi er ikke i det forventede format.",detail:"Indtast en værdi i det forventede format.","plural-separator":", ",hint:{summary:"Eksempel: {exampleValue}",detail:"Prøv igen med et format som dette: {exampleValue}.","detail-plural":"Indtast en værdi i disse formater: {exampleValue}."},optionHint:{detail:"En gyldig værdi for valget '{propertyName}' er '{propertyValueValid}'.","detail-plural":"Gyldig værdier for valget '{propertyName}' er '{propertyValueValid}'."},optionTypesMismatch:{summary:"En værdi for valget '{requiredPropertyName}' er påkrævet, når valget '{propertyName}' er sat til '{propertyValue}'."},optionTypeInvalid:{summary:"En værdi af den forventede type blev ikke angivet for valget '{propertyName}'."},optionOutOfRange:{summary:"Værdien {propertyValue} er uden for interval for valget '{propertyName}'."},optionValueInvalid:{summary:"En ugyldig værdi '{propertyValue}' blev angivet for valget '{propertyName}'."},number:{decimalFormatMismatch:{summary:"Den angivne værdi er ikke i det forventede talformat."},shortLongUnsupportedParse:{summary:"'short' og 'long' understøttes ikke til konverteranalyse.",detail:"Skift komponent til readonly. readonly-felter kalder ikke konverterens analysefunktion."},currencyFormatMismatch:{summary:"Den angivne værdi er ikke i det forventede valutaformat."},percentFormatMismatch:{summary:"Den angivne værdi er ikke i det forventede procentformat."},invalidNumberFormat:{summary:"Den angivne værdi er ikke et gyldigt tal.",detail:"Angiv et gyldigt tal."},parseError:{detail:"Indtast et tal."}},color:{invalidFormat:{summary:"Ugyldigt farveformat.",detail:"Ugyldig valgmulighed for farveformat er angivet."},invalidSyntax:{summary:"Ugyldig farveangivelse.",detail:"Indtast en farveværdi, der overholder CSS3-standarden."}},datetime:{datetimeOutOfRange:{summary:"Værdien '{value}' er uden for interval for '{propertyName}'.",detail:"Indtast en værdi mellem '{minValue}' og '{maxValue}'.",hour:"time",minute:"minut",second:"sekund",millisec:"millisekund",month:"måned",day:"dag",year:"år","month name":"månedens navn",weekday:"ugedag"},dateFormatMismatch:{summary:"Den angivne værdi er ikke i det forventede datoformat."},invalidTimeZoneID:{summary:"Ugyldig tidszone-id {timeZoneID} er angivet."},nonExistingTime:{summary:"Inputtiden findes ikke, fordi den ligger i overgangen til sommertid."},missingTimeZoneData:{summary:"TimeZone-data mangler. Kald de påkrævede 'ojs/ojtimezonedata' for at indlæse TimeZone-data."},timeFormatMismatch:{summary:"Den angivne værdi er ikke i det forventede tidsformat."},datetimeFormatMismatch:{summary:"Den angivne værdi er ikke i det forventede dato- og tidsformat."},dateToWeekdayMismatch:{summary:"Dagen '{date}' falder ikke på en '{weekday}'.",detail:"Indtast en ugedag, som stemmer overens med datoen."},invalidISOString:{invalidRangeSummary:"Værdien '{value}' er uden for interval for feltet '{propertyName}' i ISO 8601-strengen '{isoStr}'.",summary:"Den angivne '{isoStr}' er ikke en gyldig ISO 8601-streng.",detail:"Angiv en gyldig ISO 8601-streng."}}},"oj-validator":{length:{hint:{min:"Indtast {min} eller flere tegn.",max:"Indtast {max} eller færre tegn.",inRange:"Indtast mellem {min} og {max} tegn.",exact:"Indtast {length} tegn."},messageDetail:{tooShort:"Indtast {min} eller flere tegn.",tooLong:"Indtast højst {max} tegn."},messageSummary:{tooShort:"Der er for få tegn.",tooLong:"Der er for mange tegn."}},range:{number:{hint:{min:"Indtast et tal, der er større end eller lig med {min}.",max:"Indtast et tal, der er mindre end eller lig med {max}.",inRange:"Indtast et tal mellem {min} og {max}.",exact:"Indtast tallet {num}."},messageDetail:{rangeUnderflow:"Indtast et tal , der er {min} eller højere.",rangeOverflow:"Indtast et tal, der er {max} eller lavere.",exact:"Indtast tallet {num}."},messageSummary:{rangeUnderflow:"Tallet er for lavt.",rangeOverflow:"Tallet er for højt."}},datetime:{hint:{min:"Indtast en dato og et tidspunkt, som ligger den {min} eller efter.",max:"Indtast en dato og et tidspunkt, som ligger den {max} eller før.",inRange:"Indtast en dato og et tidspunkt mellem {min} og {max}."},messageDetail:{rangeUnderflow:"Indtast en dato og et tidspunkt, der ligger samtidig med eller efter {min}.",rangeOverflow:"Indtast en dato og et tidspunkt, der ligger samtidig med eller {max}."},messageSummary:{rangeUnderflow:"Dato og tidspunkt ligger før minimumdato og -tidspunkt.",rangeOverflow:"Dato og tidspunkt ligger efter maksimumdato og -tidspunkt."}},date:{hint:{min:"Indtast en dato, der ligger den {min} eller efter.",max:"Indtast en dato, der ligger den {max} eller før.",inRange:"Indtast en dato, der ligger mellem {min} og {max}."},messageDetail:{rangeUnderflow:"Indtast en dato, der ligger samtidig med eller efter {min}.",rangeOverflow:"Indtast en dato, der ligger samtidig med eller før {max}."},messageSummary:{rangeUnderflow:"Dato ligger før minimumdatoen.",rangeOverflow:"Datoen ligger efter maksimumdatoen."}},time:{hint:{min:"Indtast et tidspunkt, der ligger den {min} eller efter.",max:"Indtast et tidspunkt, som ligger den {max} eller før.",inRange:"Indtast et tidspunkt, der ligger mellem {min} og {max}."},messageDetail:{rangeUnderflow:"Indtast et tidspunkt, der er {min} eller senere.",rangeOverflow:"Indtast et tidspunkt, der er {max} eller tidligere."},messageSummary:{rangeUnderflow:"Tidspunkt ligger før minimumdatoen.",rangeOverflow:"Tidspunkt ligger efter maksimumtidspunktet."}}},restriction:{date:{messageSummary:"Datoen {value} er for en deaktiveret post.",messageDetail:"Den dato, du har valgt, er ikke tilgængelig. Prøv en anden dato."}},regExp:{summary:"Format er forkert.",detail:"Indtast tilladte værdier, der er beskrevet i dette almindelige udtryk: '{pattern}'."},required:{summary:"Værdi er påkrævet.",detail:"Indtast en værdi."}},"oj-ojEditableValue":{loading:"Indlæser",requiredText:"Påkrævet",helpSourceText:"Lær mere..."},"oj-ojInputDate":{done:"Udført",cancel:"Annuller",time:"Klokkeslæt",accessibleClearIconAltText:"Ryd input",prevText:"Forrige",nextText:"Næste",currentText:"I dag",weekHeader:"Uge",tooltipCalendar:"Vælg dato.",tooltipCalendarTime:"Vælg dato/klokkeslæt.",tooltipCalendarDisabled:"Vælg dato for deaktivering.",tooltipCalendarTimeDisabled:"Vælg dato/klokkeslæt for deaktivering.",picker:"Vælger",weekText:"Uge",datePicker:"Datovælger",inputHelp:"Tryk på pil ned eller pil op for at få adgang til kalenderen.",inputHelpBoth:"Tryk på pil ned eller pil op for at få adgang til kalenderen og Shift + pil ned eller Shift + pil op for at få adgang til tidsrullelisten.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},dateRestriction:{hint:"",messageSummary:"",messageDetail:""},accessibleMaxLengthExceeded:"Maksimumlængden {len} er overskredet.",accessibleMaxLengthRemaining:"{chars} tegn tilbage.",regexp:{messageSummary:"",messageDetail:""},required:{hint:""}},"oj-ojInputTime":{accessibleClearIconAltText:"Ryd input",cancelText:"Annuller",okText:"OK",currentTimeText:"Nu",hourWheelLabel:"Time",minuteWheelLabel:"Minut",ampmWheelLabel:"AM/PM",tooltipTime:"Vælg klokkeslæt.",tooltipTimeDisabled:"Vælg tidspunkt for deaktivering.",inputHelp:"Tryk på pil ned eller pil op for at få adgang til tidsrullelisten.",dateTimeRange:{hint:{min:"",max:"",inRange:""},messageDetail:{rangeUnderflow:"",rangeOverflow:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}}},"oj-inputBase":{required:{hint:"",messageSummary:"",messageDetail:""},regexp:{messageSummary:"",messageDetail:""},accessibleMaxLengthExceeded:"Maksimumlængden {len} er overskredet.",accessibleMaxLengthRemaining:"{chars} tegn tilbage."},"oj-ojInputText":{accessibleClearIcon:"Ryd"},"oj-ojInputPassword":{regexp:{messageDetail:"Værdien skal matche dette mønster: '{pattern}'."},accessibleShowPassword:"Vis adgangskode.",accessibleHidePassword:"Skjul adgangskode."},"oj-ojFilmStrip":{labelAccFilmStrip:"Viser siden {pageIndex} fra {pageCount}",labelAccArrowNextPage:"Vælg Næste for at vise næste side",labelAccArrowPreviousPage:"Vælg Forrige for at vise forrige side",tipArrowNextPage:"Næste",tipArrowPreviousPage:"Forrige"},"oj-ojDataGrid":{accessibleSortAscending:"{id} sorteret i stigende rækkefølge",accessibleSortDescending:"{id} sorteret i faldende rækkefølge",accessibleSortable:"{id} kan sorteres",accessibleActionableMode:"Åbn handlingsorienteret tilstand.",accessibleNavigationMode:"Åbn navigeringstilstand, tryk på F2 for at åbne redigeringstilstand eller handlingsorienteret tilstand.",accessibleEditableMode:"Åbn redigeringsorienteret tilstand, tryk på Esc for at navigere uden for datagitteret.",accessibleSummaryExact:"Dette er et datagitter med {rownum} rækker og {colnum} kolonner",accessibleSummaryEstimate:"Dette er et datagitter med ukendt antal rækker og kolonner",accessibleSummaryExpanded:"Der er p.t. {num} udvidede rækker",accessibleRowExpanded:"Række udvidet",accessibleExpanded:"Udvidet",accessibleRowCollapsed:"Række skjult",accessibleCollapsed:"Skjult",accessibleRowSelected:"Række {row} valgt",accessibleColumnSelected:"Kolonne {column} valgt",accessibleStateSelected:"valgt",accessibleMultiCellSelected:"{num} valgte celler",accessibleColumnSpanContext:"{extent} bred",accessibleRowSpanContext:"{extent} høj",accessibleRowContext:"Række {index}",accessibleColumnContext:"Kolonne {index}",accessibleRowHeaderContext:"Rækkeoverskrift {index}",accessibleColumnHeaderContext:"Kolonneoverskrift {index}",accessibleRowEndHeaderContext:"Rækkeslutoverskrift {index}",accessibleColumnEndHeaderContext:"Kolonneslutoverskrift {index}",accessibleRowHeaderLabelContext:"Label for rækkeoverskrift {level}",accessibleColumnHeaderLabelContext:"Etiket for kolonneoverskrift {level}",accessibleRowEndHeaderLabelContext:"Etiket for rækkeslutoverskrift {level}",accessibleColumnEndHeaderLabelContext:"Etiket for kolonneslutoverskrift {level}",accessibleLevelContext:"Niveau {level}",accessibleRangeSelectModeOn:"Tilstand for tilføjelse af valgt celleinterval er aktiveret.",accessibleRangeSelectModeOff:"Tilstand for tilføjelse af valgt celleinterval er deaktiveret.",accessibleFirstRow:"Du er nået til den første række.",accessibleLastRow:"Du er nået til den sidste række.",accessibleFirstColumn:"Du er nået til den første kolonne",accessibleLastColumn:"Du er nået til den sidste kolonne.",accessibleSelectionAffordanceTop:"Handle til topvalg.",accessibleSelectionAffordanceBottom:"Handle til bundvalg.",accessibleLevelHierarchicalContext:"Niveau {level}",accessibleRowHierarchicalFull:"Række {posInSet} af {setSize} rækker",accessibleRowHierarchicalPartial:"Række {posInSet} af mindst {setSize} rækker",accessibleRowHierarchicalUnknown:"Mindst række {posInSet} af mindst {setSize} rækker",accessibleColumnHierarchicalFull:"Kolonne {posInSet} af {setSize} kolonner",accessibleColumnHierarchicalPartial:"Kolonne {posInSet} af mindst {setSize} kolonner",accessibleColumnHierarchicalUnknown:"Mindst kolonne {posInSet} af mindst {setSize} kolonner",msgFetchingData:"Henter data...",msgNoData:"Ingen elementer at vise.",msgReadOnly:"Cellen er skrivebeskyttet og kan ikke redigeres.",labelHideColumns:"Skjul kolonner",labelHideRows:"Skjul rækker",labelUnhideColumns:"Vis kolonner",labelUnhideRows:"Vis kolonner",labelResize:"Tilpas",labelResizeWidth:"Tilpas bredde",labelResizeHeight:"Tilpas højde",labelSortAsc:"Sorter i stigende rækkefølge",labelSortDsc:"Sorter i faldende rækkefølge",labelSortRow:"Sorter række",labelSortRowAsc:"Sorter række i stigende rækkefølge",labelSortRowDsc:"Sorter række i faldende række følge",labelSortCol:"Sorter kolonne",labelSortColAsc:"Sorter kolonne i stigende rækkefølge",labelSortColDsc:"Sorter kolonne i faldende rækkefølge",labelFilter:"Filtrer",labelFilterCol:"Filtrer kolonne",labelCut:"Klip",labelPaste:"Sæt ind",labelCutCells:"Klip",labelPasteCells:"Sæt ind",labelCopyCells:"Kopier",labelAutoFill:"Udfyld automatisk",labelEnableNonContiguous:"Aktiver ikke-sammenhængende valg",labelDisableNonContiguous:"Deaktiver ikke-sammenhængende valg",labelResizeDialogSubmit:"OK",labelResizeDialogCancel:"Annuller",accessibleContainsControls:"Indeholder kontrolelementer",labelSelectMultiple:"Vælg flere filer",labelResizeDialogApply:"Anvend",labelResizeFitToContent:"Tilpas størrelse",columnWidth:"Bredde i pixel",rowHeight:"Højde i pixels",labelResizeColumn:"Tilpas størrelse på kolonne",labelResizeRow:"Tilpas størrelse på række",resizeColumnDialog:"Tilpas størrelse på kolonne",resizeRowDialog:"Tilpas størrelse på række",labelFreezeRow:"Fastfrys rækker",labelFreezeCol:"Fastfrys kolonner",labelUnfreezeRow:"Ophæv fastfrysning af rækker",labelUnfreezeCol:"Ophæv fastfrysning af kolonner",collapsedText:"Skjul",expandedText:"Udvid",tooltipRequired:"Påkrævet"},"oj-ojRowExpander":{accessibleLevelDescription:"Niveau {level}",accessibleRowDescription:"Niveau {level}, række {num} af {total}",accessibleRowDescriptionAtLeast:"Niveau {level}, Række {num} ud af mindst {total}",accessibleRowExpanded:"Række udvidet",accessibleRowCollapsed:"Række skjult",accessibleStateExpanded:"udvidet",accessibleStateCollapsed:"skjult"},"oj-ojStreamList":{msgFetchingData:"Henter data..."},"oj-ojListView":{msgFetchingData:"Henter data...",msgNoData:"Ingen elementer at vise.",msgItemsAppended:"{count} elementer føjet til slutningen.",msgFetchCompleted:"Alle elementer er hentet.",indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",accessibleExpandCollapseInstructionText:"Brug piletaster til at udvide og skjule.",accessibleGroupExpand:"Udvidet",accessibleGroupCollapse:"Skjult",accessibleReorderTouchInstructionText:"Dobbelttryk, og hold nede. Vent, indtil du hører en lyd, og træk derefter for at omarrangere.",accessibleReorderBeforeItem:"Før {item}",accessibleReorderAfterItem:"Efter {item}",accessibleReorderInsideItem:"Ind i {item}",accessibleNavigateSkipItems:"Springer {numSkip} elementer over",accessibleSuggestion:"Forslag",labelCut:"Klip",labelCopy:"Kopier",labelPaste:"Sæt ind",labelPasteBefore:"Sæt ind før",labelPasteAfter:"Sæt ind efter"},"oj-ojWaterfallLayout":{msgFetchingData:"Henter data..."},"oj-_ojLabel":{tooltipHelp:"Hjælp",tooltipRequired:"Påkrævet"},"oj-ojLabel":{tooltipHelp:"Hjælp",tooltipRequired:"Påkrævet"},"oj-ojInputNumber":{required:{hint:"",messageSummary:"",messageDetail:""},numberRange:{hint:{min:"",max:"",inRange:"",exact:""},messageDetail:{rangeUnderflow:"",rangeOverflow:"",exact:""},messageSummary:{rangeUnderflow:"",rangeOverflow:""}},tooltipDecrement:"Formindsk",tooltipIncrement:"Forøg"},"oj-ojTable":{accessibleAddRow:"Indtast data for at tilføje en ny række",accessibleColumnContext:"Kolonne {index}",accessibleColumnFooterContext:"Kolonnefod {index}",accessibleColumnHeaderContext:"Kolonneoverskrift {index}",accessibleContainsControls:"Indeholder kontrolelementer",accessibleColumnsSpan:"Spænder over {count} kolonner",accessibleEditableSummary:"Tryk på F2 for at fokusere på skrivebeskyttede kolonner eller på Enter for at begynde at redigere",accessibleRowContext:"Række {index}",accessibleSortable:"{id} kan sorteres",accessibleSortAscending:"{id} sorteret i stigende rækkefølge",accessibleSortDescending:"{id} sorteret i faldende rækkefølge",accessibleStateSelected:"valgt",accessibleStateUnselected:"ikke valgt",accessibleSummaryEstimate:"Tabel med {colnum} kolonner og mere end {rownum} rækker",accessibleSummaryExact:"Tabel med {colnum} kolonner og {rownum} rækker",labelAccSelectionAffordanceTop:"Handle til topvalg",labelAccSelectionAffordanceBottom:"Handle til bundvalg",labelEnableNonContiguousSelection:"Aktiver ikke-sammenhængende valg",labelDisableNonContiguousSelection:"Deaktiver ikke-sammenhængende valg",labelResize:"Tilpas",labelResizeColumn:"Tilpas størrelse på kolonne",labelResizePopupSubmit:"OK",labelResizePopupCancel:"Annuller",labelResizePopupSpinner:"Tilpas størrelse på kolonne",labelResizeColumnDialog:"Tilpas størrelse på kolonne",labelColumnWidth:"Bredde i pixel",labelResizeDialogApply:"Anvend",labelSelectRow:"Vælg række",labelSelectAllRows:"Vælg alle rækker",labelEditRow:"Rediger række",labelSelectAndEditRow:"Vælg og rediger række",labelSelectColumn:"Vælg kolonne",labelSort:"Sorter",labelSortAsc:"Sorter i stigende rækkefølge",labelSortDsc:"Sorter i faldende rækkefølge",msgFetchingData:"Henter data...",msgNoData:"Ingen data at vise.",msgInitializing:"Initialiserer...",msgColumnResizeWidthValidation:"Breddeværdien skal være et heltal.",msgScrollPolicyMaxCountSummary:"Overskredet maksimum for tabelrulning",msgScrollPolicyMaxCountDetail:"Genindlæs med mindre datasæt",msgStatusSortAscending:"{0} sorteret i stigende rækkefølge.",msgStatusSortDescending:"{0} sorteret i faldende rækkefølge.",tooltipRequired:"Påkrævet"},"oj-ojTabs":{labelCut:"Klip",labelPasteBefore:"Sæt ind før",labelPasteAfter:"Sæt ind efter",labelRemove:"Fjern\t",labelReorder:"Reorganiser",removeCueText:"Kan fjernes"},"oj-ojCheckboxset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Vælg en værdi."}},"oj-ojRadioset":{readonlyNoValue:"",required:{hint:"",messageSummary:"",messageDetail:"Vælg en værdi."}},"oj-ojSelect":{required:{hint:"",messageSummary:"",messageDetail:"Vælg en værdi."},searchField:"Søgefelt",noMatchesFound:"Ingen matchninger blev fundet",noMoreResults:"Ikke flere resultater",oneMatchesFound:"Én matchning blev fundet",moreMatchesFound:"{num} matches fundet",filterFurther:"Flere resultater er tilgængelige. Filtrer yderligere."},"oj-ojSwitch":{SwitchON:"Til",SwitchOFF:"Fra"},"oj-ojCombobox":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Ingen matchninger blev fundet",noMoreResults:"Ikke flere resultater",oneMatchesFound:"Én matchning blev fundet",moreMatchesFound:"{num} matches fundet",filterFurther:"Flere resultater er tilgængelige. Filtrer yderligere."},"oj-ojSelectSingle":{required:{hint:"",messageSummary:"",messageDetail:"Vælg en værdi."},noMatchesFound:"Ingen matchninger blev fundet",oneMatchFound:"Én matchning blev fundet",multipleMatchesFound:"{num} matches fundet",nOrMoreMatchesFound:"{num} eller flere matches fundet",cancel:"Annuller",labelAccOpenDropdown:"udvid",labelAccClearValue:"ryd værdi",noResultsLine1:"Ingen resultater blev fundet",noResultsLine2:"Vi kan ikke finde noget, der matcher din søgning."},"oj-ojInputSearch2":{cancel:"Annuller",noSuggestionsFound:"Ingen resultater fundet"},"oj-ojInputSearch":{required:{hint:"",messageSummary:"",messageDetail:""},noMatchesFound:"Ingen matchninger blev fundet",oneMatchesFound:"Én matchning blev fundet",moreMatchesFound:"{num} matches fundet"},"oj-ojTreeView":{treeViewSelectorAria:"Trævisnings-selektor {rowKey}",retrievingDataAria:"Henter data for noden: {nodeText}",receivedDataAria:"Hentede data for noden: {nodeText}"},"oj-ojTree":{stateLoading:"Indlæser...",labelNewNode:"Ny node",labelMultiSelection:"Flere valg",labelEdit:"Rediger",labelCreate:"Opret ",labelCut:"Klip",labelCopy:"Kopier",labelPaste:"Sæt ind",labelPasteAfter:"Sæt ind efter",labelPasteBefore:"Sæt ind før",labelRemove:"Fjern\t",labelRename:"Omdøb",labelNoData:"Ingen data"},"oj-ojPagingControl":{labelAccPaging:"Sideinddeling",labelAccPageNumber:"Indhold af side {pageNum} indlæst",labelAccNavFirstPage:"Første side",labelAccNavLastPage:"Sidste side",labelAccNavNextPage:"Næste side",labelAccNavPreviousPage:"Forrige side",labelAccNavPage:"Side",labelLoadMore:"Vis flere...",labelLoadMoreMaxRows:"Nåede den maksimale grænse på {maxRows} rækker",labelNavInputPage:"Side",labelNavInputPageMax:"af {pageMax}",fullMsgItemRange:"{pageFrom}-{pageTo} af {pageMax} elementer",fullMsgItemRangeAtLeast:"{pageFrom}-{pageTo} af mindst {pageMax} elementer",fullMsgItemRangeApprox:"{pageFrom}-{pageTo} af cirka {pageMax} elementer",msgItemRangeNoTotal:"{pageFrom}-{pageTo} elementer",fullMsgItem:"{pageTo} af {pageMax} elementer",fullMsgItemAtLeast:"{pageTo} af mindst {pageMax} elementer",fullMsgItemApprox:"{pageTo} af cirka {pageMax} elementer",msgItemNoTotal:"{pageTo} elementer",msgItemRangeCurrent:"{pageFrom}-{pageTo}",msgItemRangeCurrentSingle:"{pageFrom}",msgItemRangeOf:"af",msgItemRangeOfAtLeast:"af mindst",msgItemRangeOfApprox:"af cirka",msgItemRangeItems:"elementer",tipNavInputPage:"Gå til side",tipNavPageLink:"Gå til side {pageNum}",tipNavNextPage:"Næste",tipNavPreviousPage:"Forrige",tipNavFirstPage:"Første",tipNavLastPage:"Sidste",pageInvalid:{summary:"Den indtastede sideværdi er ugyldig.",detail:"Indtast en værdi, der er større end 0."},maxPageLinksInvalid:{summary:"Værdi for maxPageLinks er ugyldig.",detail:"Indtast en værdi, der er større end 4."}},"oj-ojMasonryLayout":{labelCut:"Klip",labelPasteBefore:"Sæt ind før",labelPasteAfter:"Sæt ind efter"},"oj-panel":{labelAccButtonExpand:"Udvid",labelAccButtonCollapse:"Skjul",labelAccButtonRemove:"Fjern\t",labelAccFlipForward:"Vend fremad",labelAccFlipBack:"Vend tilbage",tipDragToReorder:"Træk for at omsortere",labelAccDragToReorder:"Træk for at omsortere, genvejsmenu tilgængelig"},"oj-ojChart":{labelDefaultGroupName:"Gruppe {0}",labelSeries:"Serier",labelGroup:"Gruppe",labelDate:"Dato",labelValue:"Værdi",labelTargetValue:"Mål",labelX:"X",labelY:"Y",labelZ:"Z",labelPercentage:"Procent",labelLow:"Lav",labelHigh:"Høj",labelOpen:"Åbn",labelClose:"Luk",labelVolume:"Volumen",labelQ1:"Q1",labelQ2:"Q2",labelQ3:"Q3",labelMin:"Min.",labelMax:"Maks.",labelOther:"Anden",tooltipPan:"Panorer",tooltipSelect:"Marquee-valg",tooltipZoom:"Marquee-zoom",stateLoading:"Indlæser",stateLoaded:"Indlæst",componentName:"Diagram"},"oj-dvtBaseGauge":{componentName:"Måler"},"oj-ojDiagram":{promotedLink:"{0} link",promotedLinks:"{0} links",promotedLinkAriaDesc:"Indirekte",componentName:"Diagram"},"oj-ojGantt":{componentName:"Gantt",accessibleDurationDays:"{0} dage",accessibleDurationHours:"{0} timer",accessibleTaskInfo:"Starttidspunkt er {0}, sluttidspunkt er {1}, varighed er {2}",accessibleMilestoneInfo:"Tid er {0}",accessibleRowInfo:"Række {0}",accessibleTaskTypeMilestone:"Milepæl",accessibleTaskTypeSummary:"Oversigt",accessiblePredecessorInfo:"{0} forgængere",accessibleSuccessorInfo:"{0} efterfølgere",accessibleDependencyInfo:"Afhængighedstypen {0}, forbinder{1} med {2}",startStartDependencyAriaDesc:"start til start",startFinishDependencyAriaDesc:"start til slut",finishStartDependencyAriaDesc:"slut til start",finishFinishDependencyAriaDesc:"slut til slut",tooltipZoomIn:"Zoom ind",tooltipZoomOut:"Zoom ud",labelLevel:"Niveau",labelRow:"Række",labelStart:"Start",labelEnd:"Slut",labelDate:"Dato",labelBaselineStart:"Baselinestart",labelBaselineEnd:"Baselineslut",labelBaselineDate:"Baselinedato",labelDowntimeStart:"Start på nedetid",labelDowntimeEnd:"Slut på nedetid",labelOvertimeStart:"Start på overtid",labelOvertimeEnd:"Slut på overtid",labelAttribute:"Attribut",labelLabel:"Label",labelProgress:"Status",labelMoveBy:"Flyt med",labelResizeBy:"Tilpas størrelse på",taskMoveInitiated:"Flytning af opgave igangsat",rowAxisLabel:"Rækkelabels",taskResizeEndInitiated:"Opgave for at ændre størrelse på slutning igangsat",taskResizeStartInitiated:"Opgave for at ændre størrelse på start igangsat",taskMoveSelectionInfo:"{0} andre valgt",taskResizeSelectionInfo:"{0} andre valgt",taskMoveInitiatedInstruction:"Brug piletasterne til at flytte med",taskResizeInitiatedInstruction:"Brug piletasterne til at ændre størrelse",taskMoveFinalized:"Flytning af opgave afsluttet",taskResizeFinalized:"Opgave for at ændre størrelse afsluttet",taskMoveCancelled:"Flytning af opgave annulleret",taskResizeCancelled:"Opgave for at ændre størrelse annulleret",taskResizeStartHandle:"Handle til opgave for at ændre størrelse på start",taskResizeEndHandle:"Handle til opgave for at ændre størrelse på slutning"},"oj-ojLegend":{componentName:"Forklaring",tooltipExpand:"Udvid",tooltipCollapse:"Skjul",labelInvalidData:"Ugyldige data",labelNoData:"Ingen data at vise",labelClearSelection:"Ryd valg",stateSelected:"Valgt",stateUnselected:"Ikke valgt",stateMaximized:"Maksimeret",stateMinimized:"Minimeret",stateIsolated:"Isoleret",labelCountWithTotal:"{0} af {1}",accessibleContainsControls:"Indeholder kontrolelementer"},"oj-ojNBox":{highlightedCount:"{0}/{1}",labelOther:"Anden",labelGroup:"Gruppe",labelSize:"Størrelse",labelAdditionalData:"Yderligere data",componentName:"{0}-boks"},"oj-ojPictoChart":{componentName:"Billeddiagram"},"oj-ojSparkChart":{componentName:"Diagram"},"oj-ojSunburst":{labelColor:"Farve",labelSize:"Størrelse",tooltipExpand:"Udvid",tooltipCollapse:"Skjul",stateLoading:"Indlæser",stateLoaded:"Indlæst",componentName:"Solstrålediagram"},"oj-ojTagCloud":{componentName:"Tag-sky",accessibleContainsControls:"Indeholder kontrolelementer",labelCountWithTotal:"{0} af {1}",labelInvalidData:"Ugyldige data",stateCollapsed:"Skjult",stateDrillable:"Kan bores",stateExpanded:"Udvidet",stateIsolated:"Isoleret",stateHidden:"Skjult",stateMaximized:"Maksimeret",stateMinimized:"Minimeret",stateVisible:"Synlig"},"oj-ojThematicMap":{componentName:"Tematisk kort",areasRegion:"Områder",linksRegion:"Links",markersRegion:"Mærker"},"oj-ojTimeAxis":{componentName:"Tidsakse"},"oj-ojTimeline":{componentName:"Tidslinje",stateMinimized:"Minimeret",stateMaximized:"Maksimeret",stateIsolated:"Isoleret",stateHidden:"Skjult",stateExpanded:"Udvidet",stateVisible:"Synlig",stateDrillable:"Kan bores",stateCollapsed:"Skjult",labelCountWithTotal:"{0} af {1}",accessibleItemDesc:"Beskrivelse er {0}.",accessibleItemEnd:"Sluttidspunkt er {0}.",accessibleItemStart:"Starttidspunkt er {0}.",accessibleItemTitle:"Titel er {0}.",labelSeries:"Serier",tooltipZoomIn:"Zoom ind",tooltipZoomOut:"Zoom ud",labelStart:"Start",labelEnd:"Slut",labelAccNavNextPage:"Næste side",labelAccNavPreviousPage:"Forrige side",tipArrowNextPage:"Næste",tipArrowPreviousPage:"Forrige",navArrowDisabledState:"Deaktiveret",labelDate:"Dato",labelTitle:"Titel",labelDescription:"Beskrivelse",labelMoveBy:"Flyt med",labelResizeBy:"Tilpas størrelse på",itemMoveInitiated:"Flytning af begivenhed igangsat",itemResizeEndInitiated:"Slutning på ændring af størrelse på begivenhed igangsat",itemResizeStartInitiated:"Start på ændring af størrelse på begivenhed igangsat",itemMoveSelectionInfo:"{0} andre valgt",itemResizeSelectionInfo:"{0} andre valgt",itemMoveInitiatedInstruction:"Brug piletasterne til at flytte med",itemResizeInitiatedInstruction:"Brug piletasterne til at ændre størrelse",itemMoveFinalized:"Flytning af begivenhed afsluttet",itemResizeFinalized:"Ændring af størrelse på begivenhed afsluttet",itemMoveCancelled:"Flytning af begivenhed annulleret",itemResizeCancelled:"Ændring af begivenheds størrelse annulleret",itemResizeStartHandle:"Handle til start af ændring af størrelse på begivenhed",itemResizeEndHandle:"Handle til afslutning af ændring af størrelse på begivenhed"},"oj-ojTreemap":{labelColor:"Farve",labelSize:"Størrelse",tooltipIsolate:"Isoler",tooltipRestore:"Gendan",stateLoading:"Indlæser",stateLoaded:"Indlæst",componentName:"Trædiagram"},"oj-dvtBaseComponent":{labelScalingSuffixThousand:"K",labelScalingSuffixMillion:"M",labelScalingSuffixBillion:"Md",labelScalingSuffixTrillion:"B",labelScalingSuffixQuadrillion:"K",labelInvalidData:"Ugyldige data",labelNoData:"Ingen data at vise",labelClearSelection:"Ryd valg",labelDataVisualization:"Datavisualisering",stateSelected:"Valgt",stateUnselected:"Ikke valgt",stateMaximized:"Maksimeret",stateMinimized:"Minimeret",stateExpanded:"Udvidet",stateCollapsed:"Skjult",stateIsolated:"Isoleret",stateHidden:"Skjult",stateVisible:"Synlig",stateDrillable:"Kan bores",labelAndValue:"{0}: {1}",labelCountWithTotal:"{0} af {1}",accessibleContainsControls:"Indeholder kontrolelementer"},"oj-ojRatingGauge":{labelClearSelection:"Ryd valg",stateSelected:"Valgt",stateUnselected:"Ikke valgt",stateMaximized:"Maksimeret",stateMinimized:"Minimeret",stateExpanded:"Udvidet",stateCollapsed:"Skjult",stateIsolated:"Isoleret",stateHidden:"Skjult",stateVisible:"Synlig",stateDrillable:"Kan bores",labelCountWithTotal:"{0} af {1}",accessibleContainsControls:"Indeholder kontrolelementer"},"oj-ojStatusMeterGauge":{labelClearSelection:"Ryd valg",stateSelected:"Valgt",stateUnselected:"Ikke valgt",stateMaximized:"Maksimeret",stateMinimized:"Minimeret",stateExpanded:"Udvidet",stateCollapsed:"Skjult",stateIsolated:"Isoleret",stateHidden:"Skjult",stateVisible:"Synlig",stateDrillable:"Kan bores",labelCountWithTotal:"{0} af {1}",accessibleContainsControls:"Indeholder kontrolelementer"},"oj-ojNavigationList":{defaultRootLabel:"Navigationsliste",hierMenuBtnLabel:"Knappen Hierarkisk menu",selectedLabel:"valgt",previousIcon:"Forrige",msgFetchingData:"Henter data...",msgNoData:"",overflowItemLabel:"Flere faner",accessibleReorderTouchInstructionText:"Dobbelttryk, og hold nede. Vent, indtil du hører en lyd, og træk derefter for at omarrangere.",accessibleReorderBeforeItem:"Før {item}",accessibleReorderAfterItem:"Efter {item}",labelCut:"Klip",labelPasteBefore:"Sæt ind før",labelPasteAfter:"Sæt ind efter",labelRemove:"Fjern\t",removeCueText:"Kan fjernes",accessibleExpandCollapseInstructionText:"Brug piletaster til at udvide og skjule."},"oj-ojSlider":{noValue:"ojSlider har  ingen værdi",maxMin:"Maks. må ikke være mindre end eller lig med min.",startEnd:"value.start må ikke være større end value.end",valueRange:"Værdi skal være inden for min. til maks.-intervallet",optionNum:"Valget {option} er ikke et tal",invalidStep:"Ugyldigt trin, trin skal være > 0",lowerValueThumb:"markør for nedre værdi",higherValueThumb:"markør for øvre værdi"},"oj-ojDialog":{labelCloseIcon:"Luk"},"oj-ojPopup":{ariaLiveRegionInitialFocusFirstFocusable:"Åbner pop-op. Tryk på F6 for at navigere mellem pop-op og det tilknyttede kontrolelement.",ariaLiveRegionInitialFocusNone:"Pop-op er åben. Tryk på F6 for at navigere mellem pop-op og det tilknyttede kontrolelement.",ariaLiveRegionInitialFocusFirstFocusableTouch:"Åbner pop-op. Pop-op kan lukkes ved at navigeret til det sidste link i pop-op-vinduet.",ariaLiveRegionInitialFocusNoneTouch:"Pop-op er åben. Naviger til det næste link for at etablere fokus i pop-op-vinduet.",ariaFocusSkipLink:"Dobbelttryk for at navigere til det åbne pop-op-vindue.",ariaCloseSkipLink:"Dobbelttryk for at lukke det åbne pop-op-vindue."},"oj-ojRefresher":{ariaRefreshLink:"Aktiver link for at opfriske indhold",ariaRefreshingLink:"Opfrisker indhold",ariaRefreshCompleteLink:"Opfriskning er fuldført"},"oj-ojSwipeActions":{ariaShowStartActionsDescription:"Vis starthandlinger",ariaShowEndActionsDescription:"Vis sluthandlinger",ariaHideActionsDescription:"Skjul handlinger"},"oj-ojIndexer":{indexerCharacters:"A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",indexerOthers:"#",ariaDisabledLabel:"Ingen matchende gruppeoverskrift",ariaOthersLabel:"tal",ariaInBetweenText:"Mellem {first} og {second}",ariaKeyboardInstructionText:"Tryk på Enter for at vælge en værdi.",ariaTouchInstructionText:"Dobbelttryk og hold for at aktivere bevægelsestilstand. Træk derefter op eller ned for at justere værdien."},"oj-ojMenu":{labelCancel:"Annuller",ariaFocusSkipLink:"Fokus er på menuen. Dobbelttryk eller stryg for at flytte fokus til det første menuelement."},"oj-ojColorSpectrum":{labelHue:"Nuance",labelOpacity:"Uigennemsigtighed",labelSatLum:"Mætning/luminans",labelThumbDesc:"4-vejs skyder til farvespektrum."},"oj-ojColorPalette":{labelNone:"Ingen"},"oj-ojColorPicker":{labelSwatches:"Farveprøver",labelCustomColors:"Tilpassede farver",labelPrevColor:"Forrige farve",labelDefColor:"Standardfarve",labelDelete:"Slet",labelDeleteQ:"Slet?",labelAdd:"Tilføj",labelAddColor:"Tilføj farve",labelMenuHex:"HEX",labelMenuRgba:"RGBa",labelMenuHsla:"HSLa",labelSliderHue:"Nuance",labelSliderSaturation:"Mætning",labelSliderSat:"Mætn.",labelSliderLightness:"Lyshed",labelSliderLum:"Lysstyrke",labelSliderAlpha:"Alfa",labelOpacity:"Uigennemsigtighed",labelSliderRed:"Rød",labelSliderGreen:"Grøn",labelSliderBlue:"Blå"},"oj-ojFilePicker":{dropzoneText:"Drop filer her, eller klik for at uploade",singleFileUploadError:"Upload en fil ad gangen.",singleFileTypeUploadError:"Du kan ikke uploade filer af typen {fileType}.",multipleFileTypeUploadError:"Du kan ikke uploade filer af typen: {fileTypes}.",dropzonePrimaryText:"Træk og slip",secondaryDropzoneText:"Vælg en fil, eller slip en her.",secondaryDropzoneTextMultiple:"Vælg eller slip filer her.",unknownFileType:"ukendt"},"oj-ojProgressbar":{ariaIndeterminateProgressText:"I gang"},"oj-ojMessage":{labelCloseIcon:"Luk",categories:{error:"Fejl",warning:"Advarsel",info:"Information",confirmation:"Bekræftelse",none:"Ingen"}},"oj-ojMessages":{labelLandmark:"Meddelelser",ariaLiveRegion:{navigationFromKeyboard:"Åbner meddelelsesområde. Tryk på F6 for at navigere tilbage til tidligere fokuseret element.",navigationToTouch:"Meddelelsesområde har nye meddelelser. Brug stemmeindtalingshjulet for at navigere til meddelelseslandemærket.",navigationToKeyboard:"Meddelelsesområde har nye meddelelser. Tryk på F6 for at navigere til det seneste meddelelsesområde.",newMessage:"Meddelelseskategori {category}. {summary}. {detail}.",noDetail:"Detaljer er ikke tilgængelige"}},"oj-ojMessageBanner":{close:"Luk",navigationFromMessagesRegion:"Åbner meddelelsesområde. Tryk på F6 for at navigere tilbage til tidligere fokuseret element.",navigationToMessagesRegion:"Meddelelsesområde har nye meddelelser. Tryk på F6 for at navigere til det seneste meddelelsesområde.",error:"Fejl",warning:"Advarsel",info:"Oplysninger",confirmation:"Bekræftelse"},"oj-ojConveyorBelt":{tipArrowNext:"Næste",tipArrowPrevious:"Forrige"},"oj-ojTrain":{stepInfo:"Trin {index} af {count}.",stepStatus:"Status: {status}.",stepCurrent:"Aktuel",stepVisited:"Besøgt",stepNotVisited:"Ikke besøgt",stepDisabled:"Deaktiveret",stepMessageType:"Meddelelsestype: {messageType}.",stepMessageConfirmation:"Bekræftet",stepMessageInfo:"Oplysninger",stepMessageWarning:"Advarsel",stepMessageError:"Fejl"}});