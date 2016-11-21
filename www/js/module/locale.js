//# sourceURL=locale.js
(function() {
	"use strict";
	
	
	
	var
	_localeMap = {},
	_locale = function( string ){
		return _localeMap[ string ] || string;
	},
	_loadLocale = function( path ){
		return new Promise(function(fulfill, reject){
			$.get( path, function( locale ){
				for( var mapStr in locale )
				{
					if ( !locale.hasOwnProperty(mapStr) ) continue;
					_localeMap[mapStr] = locale[mapStr];
				}
				
				fulfill();
			}, 'json' )
			.fail(reject);
		});
	},
	_batchLocale = function(){
		return new Promise(function( fulfill ){
			$( '[data-trans]' ).each(function(){
				var target = $(this);
				target.html( _locale( target.attr('data-trans') ) );
			});
			
			$( '[data-trans-fields]' ).each(function(){
				var
				target = $(this),
				fields = target.attr( 'data-trans-fields' ).split(',');
				
				fields.forEach(function( fieldName ){
					target.attr( fieldName, _locale( target.attr(fieldName) ) );
				});
			});
			
			setTimeout(fulfill, 0);
		});
	};
	
	_locale.translate	= _locale;
	_locale.load		= _loadLocale;
	_locale.batch		= _batchLocale;






	window.env = $U.merge( window.env || {}, { locale:_locale }, true, true );
	module.signal = new Promise(function( fulfill, reject ){
		var promise = Promise.resolve();
		
		$( 'link[rel="locale"]' ).each(function(){
			var target = $( this );
			promise = promise.then(function(){ return _loadLocale( target.attr( 'href' ) ); });
		});
		
		return promise.then(fulfill).catch(reject);
	});
})();
