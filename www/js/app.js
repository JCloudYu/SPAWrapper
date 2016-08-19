(function(){
	"use strict";

	var trigger, errors = [], body = $( 'body' ),
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
	.pipe([
		// INFO: Make sure that the cordova environment is initialized completely
		function(){
			return initPromise.then(function(){
				if ( window.device )
				{
					body.attr( 'data-platform',			device.platform.toLocaleLowerCase() )
						.attr( 'data-hardware-model',	device.model );
				}
			});
		}
	])
	.pipe([
		{ "path":'https://api.purimize.com/cache/library/stable/js/util.min.js',					type:"js", cache:false, important:false },
		{ "path":'https://api.purimize.com/cache/lib/js/jquery-tmpl,moment,promise-done,oops',		type:"js", cache:true },
		{ "path":"https://api.purimize.com/cache/lib/css/oops,oops.app,oops.ui-base,oops.ui-font",	type:"css" },
		{ path:"./css/app.css", type:"css" },
		undefined,
	
		{ path:'js/module/scale-fix.js',	type:'js', modulize:true, cache:false },
		{ path:'js/module/pref.js',			type:'js', modulize:true, cache:false },
		function(){
			var appId;
		
			window.env.layout.calc();
			
			if ( window.env.preference )
			{
				body.attr( 'data-app-id', appId = env.preference( 'App-Identifier' ) )
					.attr( 'data-version', env.preference( 'AppVersion' ) );
			}
				
			return pipe([
//				{ path:'https://api.purimize.com/cache/' + appId + '/extension' +'.js',	type:'js', modulize:true, cache:false }
			]);
		}
	])
	.then(function(){
		pipe.components.base_path( './comps' );

		return pipe.components([
			{ name:'MainView', anchor:'[data-anchor="main-view"]' }
		]);
	})
	.then(function(){
		return pump
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'boot init',		false )
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
