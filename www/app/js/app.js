(function(){
	"use strict";

	requirejs.config({
		baseUrl:"js",
		paths: {
			controller: './controller',
			module: './module',
			lib: './',
			cordova: '../../../cordova'
		}
	});

	var dependecies = [
//		'cordova'
		'module/scale-fix',

		'controller/demo'
	];

	require( dependecies, function() {
		$( document ).one( window.cordova ? 'deviceready' : 'system-ready', function(){
			oops.runtime.fire( CORE.EVENT.SYNC_HEART_BEAT, 0 );
		})
		.ready(function(){ $(document).trigger( 'system-ready' ); });
	});
})();
