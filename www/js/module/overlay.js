(function() {
	"use strict";
	
	var msgArea, viewportSize,
	viewport = $( 'div[data-comp="loading-overlay"]' );
	
	if ( viewport.length == 0 )
		viewport = $( '<div class="loading-overlay"><div data-id="msg" class="msg">Loading...</div></div>' ).appendTo( $( 'body' ) );
		
	
	msgArea = viewport.find( 'div[data-id="msg"]' );
	viewportSize = { width:viewport.width(), height:viewport.height() };
	
	
	
	// Center msg
	viewport.css({ "line-height": viewportSize.height + "px" });
	viewport.on( 'click', 'span[data-id="error-detail"]', function(){ alert(JSON.stringify(env.getErrors())); });
	
	window.overlay = window.overlay || {
		show: function( msg ){
			if ( arguments.length > 0 ) msgArea.html( msg );
			viewport.show();
		},
		hide: function(){ viewport.hide(); }
	};
})();
