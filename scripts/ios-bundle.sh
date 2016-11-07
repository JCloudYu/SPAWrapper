#!/usr/bin/env bash

PREV_DIR=$(pwd);
cd $( dirname "$0" );



cat <<DOC  >> ../platforms/ios/cordova/lib/copy-www-build-step.js
;(function(){
	"use strict";
	
	console.log( "Copying bundle resources... " );

	var fs = require( 'fs' ), code,
	sourcePath	= "../../external/raw/",
	destPath	= path.join( process.env.BUILT_PRODUCTS_DIR, process.env.UNLOCALIZED_RESOURCES_FOLDER_PATH ),
	command = 'cp -rf \'' + sourcePath + '\'* \'' + destPath + '\'';
	
	try {
		
		var stat = fs.statSync( sourcePath );
		if ( !stat.isDirectory() )
		{
			console.log( "'" + sourcePath + "' is not a directory!" );
			return;
		}
	}
	catch( e ) {
		console.log( "Nothing to copy!" );
		return;
	}
	
	
	code = shell.exec( command ).code;
	if(code !== 0) {
		console.error('Error occurred on copying bundle resources. Code: ' + code);
		process.exit(3);
	}
})();
DOC

