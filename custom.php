<?php

	function ConvertImage( $source, $destination, $width, $height, &$output = NULL, &$status = NULL ) {
		$source = escapeshellarg( $source );
		$destination = escapeshellarg( $destination );
		$width = @intval($width); $height = @intval($height);
		passthru( "convert '{$source}' -resize {$width}x{$height}! '{$destination}' 2>&1" );
	}

	function TIDY( $xmlPath ) {
		$xmlPath = escapeshellarg( $xmlPath );
		exec( "tidy -utf8 -xml -i -w 0 -m {$xmlPath} 2>/dev/null" );
	}
