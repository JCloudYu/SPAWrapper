(function() {
	"use strict";

	pump.instantiate( function( kernelOp ){
		kernelOp.on( CORE.EVENT.SYNC_HEART_BEAT, function( e, stage ){
			if ( stage != "boot final" ) return;
		
			var parentElement = $( '[data-id="main-view"] .blink' );
			parentElement.find( '.event' ).addClass( 'received' ).removeClass( 'listening' ).text( 'Device is Ready' );
		});
	});
})();
