(function() {
	"use strict";
	
	var
	__preferences = {},
	__parser = ___BYPASS,
	__prefReader = function( prefName ) {
		return __parser( prefName, __preferences[ prefName.toLowerCase() ] );
	};
	
	__prefReader.parser = function( parser ){
		if ( !parser || __preferences.toString.call(parser) !== '[object Function]' ) return;
		__parser = parser;
	};
	
	
	
	window.env = $U.merge( window.env || {}, { preference:__prefReader }, true, true );
	
	module.signal = new Promise(function( fulfill ){
		cordova.preferences.all(function( pref ){
			__preferences = pref; fulfill();
		});
	});
	
	function ___BYPASS( name, value ){ return value; }
})();
