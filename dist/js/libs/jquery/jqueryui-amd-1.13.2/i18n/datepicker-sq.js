/* Albanian initialisation for the jQuery UI date picker plugin. */
/* Written by Flakron Bytyqi (flakron@gmail.com). */
( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
  } else if (typeof module === 'object' && module.exports) {
    require("../widgets/datepicker");
    module.exports = factory( require( "jquery" ) );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
} )( function( datepicker ) {
"use strict";

datepicker.regional.sq = {
	closeText: "mbylle",
	prevText: "mbrapa",
	nextText: "Përpara",
	currentText: "sot",
	monthNames: [ "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
	"Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor" ],
	monthNamesShort: [ "Jan", "Shk", "Mar", "Pri", "Maj", "Qer",
	"Kor", "Gus", "Sht", "Tet", "Nën", "Dhj" ],
	dayNames: [ "E Diel", "E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte", "E Shtune" ],
	dayNamesShort: [ "Di", "Hë", "Ma", "Më", "En", "Pr", "Sh" ],
	dayNamesMin: [ "Di", "Hë", "Ma", "Më", "En", "Pr", "Sh" ],
	weekHeader: "Ja",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.sq );

return datepicker.regional.sq;

} );
