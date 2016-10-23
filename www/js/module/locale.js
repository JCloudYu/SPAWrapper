//# sourceURL=locale.js

(function() {
	"use strict";
	
	
	
	var
	_localeQueue = {},
	_locale = function( string ){
		if ( !Array.isArray( string ) ) return ___TRANSLATE( string );
		
		var result = [];
		string.forEach(function( str ){
			result.push( ___TRANSLATE(str) );
		});
		return result;
	},
	_loadLocale = function( path ){
		return new Promise(function(fulfill, reject){
			var identity = CryptoJS.MD5( path ).toString( CryptoJS.enc.Base64 );
			if ( _localeQueue.hasOwnProperty( identity ) ) return fulfill();
		
			$.get( path, function( locale ){
				_localeQueue[ identity ] = locale;
				fulfill();
			}, 'json' )
			.fail(reject);
		});
	},
	_batchLocale = function(){
		return new Promise(function( fulfill ){
			$( '[data-trans]' ).each(function(){
				var target = $(this);
				target.html( ___TRANSLATE( target.attr('data-trans') ) );
			});
			
			$( '[data-trans-fields]' ).each(function(){
				var
				target = $(this),
				fields = (target.attr( 'data-trans-fields' ) || '').split(',');
				
				fields.forEach(function( fieldName ){
					target.attr( fieldName, ___TRANSLATE( target.attr(fieldName) ) );
				});
			});
			
			setTimeout(fulfill, 0);
		});
	};
	
	_locale.load	= _loadLocale;
	_locale.batch	= _batchLocale;






	window.env = $U.merge( window.env || {}, { locale:_locale }, true, true );
	module.signal = new Promise(function( fulfill, reject ){
		var promise = Promise.resolve();
		
		$( 'link[rel="locale"]' ).each(function(){
			var target = $( this );
			promise = promise.then(function(){ return _loadLocale( target.attr( 'href' ) ); });
		});
		
		return promise.then(fulfill).catch(reject);
	});
	
	
	
	
	
	
	function ___TRANSLATE( string ){
		var translation = undefined;
		for( var token in _localeQueue ){
			if ( !_localeQueue.hasOwnProperty(token) ) continue;
			translation = _localeQueue[token][string] || translation;
		}
		
		return translation || string;
	}
})();
