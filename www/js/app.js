(function(){
	"use strict";

	var trigger, errors = [],
	initPromise = new Promise(function(fulfill){ trigger = fulfill; });
	
	
	
	// INFO: Initialize cordova system and main overlay asap
	pipe([
		function(){ window.env = {getErrors:function(){return errors.slice();}}; },
		'js/module/overlay.js',
		undefined,
		
		
		'./cordova.js',
		'js/constant.js',
		function(){
			var doc = $(document);
			doc.one( window.cordova ? 'deviceready' : 'dom-ready', trigger )
			.ready(function(){  doc.trigger( 'dom-ready' ); });
		}
	])
	// INFO: Load system-wide configuration files and other online resources
	.pipe([
		{ "path":'https://api.purimize.com/cache/library/js/lib/misc/misc.min.js?' + baseTime,				type:"js" },
		{ "path":'https://api.purimize.com/cache/lib/js/jquery-tmpl,moment,promise-done,oops?' + baseTime,	type:"js"},
		{ "path":"https://api.purimize.com/cache/lib/css/oops,oops.app,oops.ui-base,oops.ui-font",			type:"css" },
		function(){ return initPromise; },
		
		function(){
			var body = $( 'body' );
			
			if ( window.device )
			{
				body.attr( 'data-platform', device.platform.toLocaleLowerCase() )
					.attr( 'data-hardware-model', device.model );
			}
		}
	])
	.pipe([
		'js/module/scale-fix.js',
		undefined
	])
	.then(function(){
		pipe.components.base_path( './comps' );

		return pipe.components([
			{ name:'MainView', anchor:'[data-anchor="main-view"]' }
		]);
	})
	.then(function(){
		pump.fire( CORE.EVENT.SYNC_HEART_BEAT,	'boot init',		false )
			.fire( CORE.EVENT.SYNC_HEART_BEAT,	'layout init',		false )
			.fire( CORE.EVENT.LAYOUT_UI, 		'',					false )
			.fire( CORE.EVENT.SYNC_HEART_BEAT,	'layout frame',		false )
			.fire( CORE.EVENT.SYNC_HEART_BEAT,	'layout sync',		false )

			.fire( CORE.EVENT.SYNC_HEART_BEAT,	'boot stage 1',		false )
			.fire( CORE.EVENT.SYNC_HEART_BEAT,	'boot stage 2',		false )
			.fire( CORE.EVENT.SYNC_HEART_BEAT,	'boot final',		false );
	})
	.then(function(){
		if ( window.cordova )
			StatusBar.styleBlackTranslucent();
		
		overlay.hide();
	})
	.catch(function( error ){
		overlay.show( "<span data-id='error-detail'>Error</span>" );
		
		console.log( error );
		errors.push( error );
	});
})();
