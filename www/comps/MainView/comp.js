(function() {
	"use strict";

	pump.instantiate( function( kernelOp ){
		kernelOp.on( CORE.EVENT.SYNC_HEART_BEAT, function( e, stage ){
			if ( stage != "heartbeat boot final" ) return;
			
			var target = $( '[data-id="main-view"] .blink' ).find( '.event' );
			target.addClass( 'received' ).removeClass( 'listening' ).text( 'Device is Ready' );
			
			if ( !window.cordova ) target.addClass( 'no-cordova' );
			
			return new Promise(function(fulfill){ setTimeout( fulfill, 5000 ); });
		});
	});
})();
