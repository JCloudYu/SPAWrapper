(function(){
	"use strict";

	requirejs.config({
		baseUrl:"js",
		paths: {
			lib: './',
			cordova: '../../cordova'
		}
	});

	var
	prerequisites	 = [ 'constant' ],
	app_dependencies = [
		'cordova',
		'module/scale-fix',

		'controller/demo'
	];


	require( prerequisites, function(){
		require( app_dependencies, function() {
			$( document )
			.one( window.cordova ? 'deviceready' : 'system-ready', function(){
				oops.runtime.fire( CORE.EVENT.SYNC_HEART_BEAT, 0 );
			})
			.ready(function(){ $(document).trigger( 'system-ready' ); });
		});
	});
})();
