(function(){
	"use strict";

	var trigger, errors = [], body = $( 'body' ),
	initPromise = new Promise(function(fulfill){ trigger = fulfill; });
	
	
	
	pipe([
		// INFO: Initialize cordova system and main overlay ASAP
		function(){ window.env = {getErrors:function(){return errors.slice();}}; },
		'js/module/overlay.js',
		undefined,
		
		
		// INFO: Prepare cordova environment
		'./cordova.js',
		'js/constant.js',
		function(){
			// INFO: Cordova will trigger deviceready event shortly after the inclusion of cordova.js
			var doc = $(document);
			doc.one( window.cordova ? 'deviceready' : 'dom-ready', trigger )
			.ready(function(){  doc.trigger( 'dom-ready' ); });
				
			// INFO: Make sure that the cordova environment is initialized completely
			return initPromise.then(function(){
				return pump.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.PRE_INIT );
			});
		}
	])
	.pipe([
		{ path:'js/module/pref.js',	type:'js', modulize:true, cache:false },
		function() {
			if ( window.device )
			{
				body.attr( 'data-platform',			device.platform.toLocaleLowerCase() )
					.attr( 'data-hardware-model',	device.model );
			}
			
			pipe.components.base_path( './comps' );
			return pipe.components([
				{ name:"MainLayout", anchor:'[data-anchor="app-layout"]', "async":false, "remove-anchor":true }
			]);
		},
		function() { return pump.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.INIT ); },
		function() {
			var appId = env.preference( 'App-Identifier' );
			body.attr( 'data-app-id', appId ).attr( 'data-version', env.preference( 'AppVersion' ) );
			
			return pipe
			.loadResource([
				{ path:'https://api.purimize.com/cache/' + appId + '/extension.js', type:'js', modulize:true, cache:false, important:false }
			])
			.then(function(){
				return pump.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.EXTENSION );
			});
		},
	
	
		{ path:'https://api.purimize.com/cache/library/stable/js/util.min.js',							type:"js",	cache:false, important:false },
		{ path:'https://api.purimize.com/cache/lib/js/jquery-tmpl,moment,promise-done,oops/_.js',		type:"js",	cache:false },
		{ path:"https://api.purimize.com/cache/lib/css/oops,oops.app,oops.ui-base,oops.ui-font/_.css",	type:"css",	cache:false },
		{ path:"./css/app.css", type:"css" },
		function(){ return pump.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.RESOURCE ); },
	
	
		
		{ path:'js/module/scale-fix.js',	type:'js', modulize:true, cache:false },
		function() {
			window.env.layout.calc();
			return pump.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.ENVIRONMENT );
		}
	])
	.then(function(){
		pipe.components.base_path( './comps' );

		return pipe.components([
			{ name:'MainView', anchor:'[data-anchor="main-view"]', "async":false, "remove-anchor":true }
		])
		.then(function(){ return pump.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.COMPONENTS ); });
	})
	.then(function(){
		return pump
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat init'	)
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat layout'	)
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat data'	)
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat late'	)
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat final'	);
	})
	.then(function(){ return pump.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.SYNC_HEART_BEAT ); })
	.then(function(){
		if ( window.cordova )
			StatusBar.styleBlackTranslucent();
		
		overlay.hide();
	})
	.then(function(){ return pump.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.BOOT ); })
	.catch(function( error ){
		overlay.show( "<span data-id='error-detail'>Error</span>" );
		
		console.log( error );
		errors.push( error );
	});
})();
