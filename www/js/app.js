(function(){
	"use strict";

	var
	_errors = [],
	_event_name = {
		SYNC_WORKFLOW_PREPARE:	'workflow stage prepare',
		SYNC_WORKFLOW_INIT:		'workflow stage init',
		SYNC_WORKFLOW_SYNC:		'workflow stage sync',
		SYNC_WORKFLOW_CLEANUP:	'workflow stage cleanup',
		SYNC_WORKFLOW_BOOT:		'workflow stage boot'
	};
	
	
	
	
	
	// INFO: Update core libraries using built-in pipe
	pipe([
		// Initialize error collector & main overlay system
		function(){
			window.env = {getErrors:function(){return _errors.slice();}};
			window.CORE = $U.merge( window.CORE || {}, {
				EVENT: $U.merge( {}, _event_name )
			});
		},
		'js/module/overlay.js',
		undefined,
		
		// INFO: Load and update global libraries
		{ path:'https://api.purimize.com/cache/lib/js/jquery,promise,hammerjs,pump,pipe,utility/_.js', type:'js', cache:false, important:false },
		undefined,
		
		// INFO: Load boot script
		{ path:'js/controller/app.js', type:'js', cache:true }
	])
	.then(function(){
		return pump
		.fire( _event_name.SYNC_WORKFLOW_PREPARE )
		.fire( _event_name.SYNC_WORKFLOW_INIT	 )
		.fire( _event_name.SYNC_WORKFLOW_SYNC	 )
		.fire( _event_name.SYNC_WORKFLOW_CLEANUP )
		.fire( _event_name.SYNC_WORKFLOW_BOOT	 );
	})
	.catch(function( error ){
		overlay.show( "<span data-id='error-detail'>Error</span>" );
		
		console.log( error );
		_errors.push( error );
	});
})();
