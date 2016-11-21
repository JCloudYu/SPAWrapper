(function() {
	"use strict";
	
	// pipe.__CSS_USE_SPECIAL_TREATMENT = true; // Use this only if you have problem hooking onload event of link tag
	
	
	var _initTrigger,
	_body	= $( 'body' ),
	_kernel	= pump.instantiate( 'app-controller' ),
	_init	= new Promise(function(fulfill){ _initTrigger = fulfill; });
	
	
	
	_kernel
	.on( CORE.EVENT.SYNC_WORKFLOW_PREPARE, function( e ){
		return pipe([
			// Initialize cordova system
			// Cordova will trigger deviceready event shortly ( within 5 secs ) after the inclusion of cordova.js
			'js/constant.js',
			'./cordova.js',
			function(){
				var doc = $(document);
				doc.one( window.cordova ? 'deviceready' : 'dom-ready', _initTrigger )
				.ready(function(){  doc.trigger( 'dom-ready' ); });
				
				
				// INFO: Make sure that the cordova environment is initialized completely
				return _init.then(function(){
					return _kernel.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.PRE_INIT );
				});
			}
		]);
	})
	.on( CORE.EVENT.SYNC_WORKFLOW_INIT, function( e ){
		return pipe([
			{ path:'js/module/locale.js', type:'js', modulize:true, cache:false },
			function(){
				return new Promise(function( fulfill, reject ){
					navigator.globalization.getPreferredLanguage(
						function( language ){
							var
							langPref = language.value.toLowerCase(),
							langCode = langPref.split( '-' ),
							locales	 = [];
							
							
							if ( langCode.length == 1 )
								locales.push( langCode[0] );
							else
							{
								locales = langCode;
								langCode.push( langPref );
							}
							
							fulfill(locales);
						},
						fulfill.bind( null, [] )
					);
				});
			},
			function( locales ){
				var promise = Promise.resolve();
				locales.forEach(function( name ){
					promise = promise.then(function(){
						return env.locale.load( './locale/' + name + '.json' )
						.catch(function(){});
					})
				});
				
				return promise;
			},
		
			
			
			{ path:'js/module/pref.js',	type:'js',	cache:false, modulize:true },
			function() {
				if ( window.device )
				{
					_body.attr( 'data-platform',		device.platform.toLocaleLowerCase() )
						.attr( 'data-hardware-model',	device.model );
				}
				
				pipe.components.base_path( './comps' );
				return pipe.components([
					{ name:"MainLayout", anchor:'[data-anchor="app-layout"]', "async":false, "remove-anchor":true }
				]);
			},
			function() { return _kernel.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.INIT ); },
			function() {
				var appId = env.preference( 'App-Identifier' );
				_body.attr( 'data-app-id', appId ).attr( 'data-version', env.preference( 'AppVersion' ) );
				
				return pipe
				.loadResource([
					{ path:'https://api.purimize.com/cache/' + appId + '/extension.js', type:'js', modulize:true, cache:false, important:false }
				])
				.then(function(){
					return _kernel.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.EXTENSION );
				});
			},
		
		
			{ path:'https://api.purimize.com/cache/library/stable/js/util.min.js',							type:"js",	cache:false, important:false },
			{ path:'https://api.purimize.com/cache/lib/js/jquery-tmpl,moment,promise-done,oops/_.js',		type:"js",	cache:false },
			{ path:"https://api.purimize.com/cache/lib/css/oops,oops.app,oops.ui-base,oops.ui-font/_.css",	type:"css",	cache:false },
			{ path:"./css/app.css", type:"css" },
			function(){ return _kernel.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.RESOURCE ); },
		
		
			
			{ path:'js/module/scale-fix.js',	type:'js', modulize:true, cache:false },
			function() {
				window.env.layout.calc();
				return _kernel.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.ENVIRONMENT );
			}
		])
		.then(function(){
			pipe.components.base_path( './comps' );
	
			return pipe.components([
				{ name:'MainView', anchor:'[data-anchor="main-view"]', "async":false, "remove-anchor":true }
			])
			.then(function(){ return _kernel.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.COMPONENTS ); });
		});
	})
	.on( CORE.EVENT.SYNC_WORKFLOW_SYNC, function( e ){
		return _kernel
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat init'	)
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat layout'	)
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat data'	)
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat late'	)
		.fire( CORE.EVENT.SYNC_HEART_BEAT,	'heartbeat final'	)
		.fire( CORE.EVENT.SYNC_BOOT_STATE,	CORE.CONST.BOOT_STATES.SYNC_HEART_BEAT );
	})
	.on( CORE.EVENT.SYNC_WORKFLOW_CLEANUP, function( e ){
		return Promise.resolve()
		.then(env.locale.batch)
		.then(function(){
			if ( window.cordova )
				StatusBar.styleBlackTranslucent();
			
			overlay.hide();
		})
		.then(function(){ return _kernel.fire( CORE.EVENT.SYNC_BOOT_STATE, CORE.CONST.BOOT_STATES.BOOT ); });
	});
})();
