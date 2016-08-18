(function() {
	"use strict";
	
	window.env = window.env || {};
	
	
	
	var __preferences = {};
	$U.merge( window.env, {
		preference:function Preference( prefName ){
			return __preferences[ prefName.toLowerCase() ];
		}
	}, true, true );
	
	
	
	module.signal = new Promise(function( fulfill ){
		cordova.preferences.all(function( pref ){
			__preferences = pref;
			fulfill();
		});
	});
})();
