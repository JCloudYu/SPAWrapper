(function() {
	"use strict";

	oops.runtime.instantiate( function( kernelOp ){
		kernelOp.on( CORE.EVENT.SYNC_HEART_BEAT, function(){
			var parentElement = $( '[data-id="main-view"] .blink' );
			parentElement.find( '.event' ).addClass( 'received' ).removeClass( 'listening' ).text( 'Device is Ready' );
		});
	});
})();
