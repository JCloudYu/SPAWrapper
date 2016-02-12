(function(){
	requirejs.config({
		baseUrl:"js/modules",
		paths: {
			lib: '../',
			cordova: '../../../cordova'
		}
	});

	var dependecies = [
//		'cordova'
	];

	require( dependecies, function(){

		var
		windowObj = $( window ),
		viewportSize = {
			width:	windowObj.width(),
			height:	windowObj.height()
		};

		$( 'body > .stage' ).each(function(){
			var target = $( this );

			if ( !target.is('[data-base-width]') )
				return;

			var
			bWidth	= parseInt( target.attr( 'data-base-width' ) ),
			scale	= viewportSize.width / bWidth,
			bHeight = Math.ceil( viewportSize.height / scale );

			target.css({
				width: bWidth, height: bHeight,
				'transform-origin': '0 0',
				'transform': 'scale3d( ' + scale + ',' + scale + ',' +  '1 )',
				'-webkit-transform-origin': '0 0',
				'-webkit-transform': 'scale3d( ' + scale + ',' + scale + ',' +  '1 )'
			});
		});

		$( document )
		.one( window.cordova ? 'deviceready' : 'system-ready', function(){
			var parentElement	 = $( '[data-id="main-view"] .blink' );
			parentElement.find( '.event' ).addClass( 'received' ).removeClass( 'listening' ).text( 'Device is Ready' );
		})
		.ready(function(){ $(document).trigger( 'system-ready' ); });
	});
})();
