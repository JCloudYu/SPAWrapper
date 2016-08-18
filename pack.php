<?php
	$projDir		= dirname( $_SERVER['argv'][0] );
	$configPath		= "{$projDir}/config.json";
	$projectPath	= "{$projDir}/project.json";

	if ( !is_readable( "{$projDir}/custom.php" ) )
	{
		IO::STDERR( "Missing required custom.php library!\n" );
		exit( 1 );
	}

	if ( !is_readable( $configPath ) )
	{
		IO::STDERR( "Required configuration file \"config.json\" is not found!\n" );
		exit( 1 );
	}


	require_once "{$projDir}/custom.php";
	$config		= PBTXJSON::FromJSON( $configPath, TRUE );
	$project	= @json_decode( @file_get_contents($projectPath), TRUE );



	if ( $project !== NULL )
	{
		// Overwriting template information with project content
		if ( ($value = trim(@"{$project[ 'project_id' ]}")) != "" )
		{
			IO::STDOUT( "App Id... done!\n" );
			$config->attr( 'id', $value );
			
			$config->addChild( $_obj = new PBTXJSON( 'preference' ) );
			$_obj->attr( 'name', 'App-Identifier' );
			$_obj->attr( 'value', $value );
		}
	
		if ( ($value = trim(@"{$project[ 'version' ]}")) != "" )
		{
			IO::STDOUT( "App Version... " );
			if ( preg_match( '/^(\d).(\d).(\d)(-(\d+)){0,1}$/', $value, $matches ) )
			{
				$matches[4] = ( count($matches) > 4 ) ? $matches[5] : 0;
				foreach( $matches as &$value ) $value = @intval($value);
	
				$config->attr( 'version', "{$matches[1]}.{$matches[2]}.{$matches[3]}" );
				$config->attr( 'android-versionCode',  ($matches[1] * 10000 + $matches[2] * 100 + $matches[3]) * 100 + $matches[4] );
				$config->attr( 'ios-CFBundleVersion', "{$matches[1]}.{$matches[2]}." . ($matches[3] * 100 + $matches[4]) );
				$config->addChild( $_obj = new PBTXJSON( 'preference' ) );
				
				$_obj->attr( 'name', 'AppVersion' );
				$_obj->attr( 'value', "{$matches[1]}.{$matches[2]}.{$matches[3]}-{$matches[4]}" );
				IO::STDOUT( "done!\n" );
			}
			else
				IO::STDOUT( "Version is malformed! Skipping...\n" );
		}
	
		if ( ($value = trim(@"{$project[ 'name' ]}")) != "" )
		{
			IO::STDOUT( "App Name... done\n" );
			$_locked = NULL;
			foreach( $config->children as &$_child )
			{
				if ( $_child->name == "name" ) $_locked = $_child;
			}

			if ( !$_locked )
				$config->addChild( $_locked = new PBTXJSON( 'name' ) );

			$_locked->children = $value;
		}
	
		if ( ($value = trim(@"{$project[ 'description' ]}")) != "" )
		{
			IO::STDOUT( "App Description... done\n" );
			$_locked = NULL;
			foreach( $config->children as &$_child )
			{
				if ( $_child->name == "description" ) $_locked = $_child;
			}
	
			if ( !$_locked )
				$config->addChild( $_locked = new PBTXJSON( 'description' ) );
	
			$_locked->children = $value;
		}
		
	
	
		// Adding project specified configurations
		if ( is_array( $project[ 'expansion' ] ) )
		{
			IO::STDOUT( "Copy additional configurations\n" );
			foreach( $project[ 'expansion' ] as $exp ) $config->addChild( PBTXJSON::FromJSON( $exp ) );
		}
		
		
		
		// Generate Image Resources
		$hasIcon	= is_readable( $iconPath 	= "{$projDir}/{$project['icon']}" );
		$hasSplash	= is_readable( $splashPath	= "{$projDir}/{$project['splash']}" );
		
		if ( $hasIcon || $hasSplash )
		{
			IO::STDOUT( "Processing image resources...\n" );
	
			foreach( $config->children as $_confElement )
			{
				if ( $_confElement->name !== "platform" ) continue;
				
				foreach( $_confElement->children as $_config )
				{
					@mkdir( dirname($_config->attr( 'src' )), 0755, TRUE );
					
					if ( $hasIcon && ($_config->name == "icon") )
						ConvertImage( $iconPath, $_config->attr( 'src' ), $_config->attr( 'width' ), $_config->attr( 'height' ) );
					else
					if ( $hasSplash && ($_config->name == "splash") )
						ConvertImage( $splashPath, $_config->attr( 'src' ), $_config->attr( 'width' ), $_config->attr( 'height' ) );
				}
			}
		}
		
	
	
		// Copy project specified resources
		if ( is_array( $project[ 'files' ] ) )
		{
			IO::STDOUT( "Processing project dependent files...\n" );
			foreach ( $project[ 'files' ] as $file )
			{
				if ( $file[ 'op' ] == "copy" )
				{
					$sourcePath = "{$projDir}/{$file[ 'src' ]}";
					$destPath	= "{$projDir}/{$file[ 'dest' ]}";
					$destDir	= dirname( $destPath );
					
					
					if ( !is_file( $sourcePath ) ) continue;
					@mkdir( $destDir, 0755, TRUE );
					
					copy( $sourcePath, $destPath );
				}
			}
		}
	}
	

	$config->xml( "{$projDir}/config.xml" );
	TIDY( "{$projDir}/config.xml" );








	class PBTXJSON
	{
		const DEFAULT_NODE_NAME = "PBTXJSON";
		
		public static function FromJSON( $json, $isFile = FALSE ) {
		
			// Load json from file
			if ( $isFile ) {
				$json = @json_decode( @file_get_contents($json), TRUE );
				if ( $json === NULL ) return NULL;
			}
		
		
			// Check input data
			if ( is_a($json, stdClass::class) ) $json = (array)$json;
			if ( !is_array( $json ) ) return NULL;
		


			// Create new root element
			$rootObject = new PBTXJSON( @$json[ '@@node' ] );
			
			// Add attribute
			$attributes = &$rootObject->_attributes;
			foreach( $json as $attr => $value )
			{
				if ( $attr == "@@children" ) continue;
				$attributes[ $attr ] = $value;
			}
			
			
			// Add children
			$children = @$json[ '@@children' ];
			if ( is_array($children) )
			{
				foreach( $json[ '@@children' ] as $child )
				{
					if ( !is_array($child) ) continue;
					$rootObject->_children[] = self::FromJSON( $child );
				}
			}
			else
			if ( $children !== NULL )
			{
				$rootObject->_children = @$json[ '@@children' ];
			}
			
			
			return $rootObject;
		}
		
		
		
		private $_nodeName		= self::DEFAULT_NODE_NAME;
		private $_children		= NULL;
		private $_attributes	= [];
		
		public function __construct( $tagName = self::DEFAULT_NODE_NAME ) {
			$this->_nodeName = @"{$tagName}";
			if (empty( $this->_nodeName )) $this->_nodeName = self::DEFAULT_NODE_NAME;
		}
		public function __set( $name, $value ) {
			switch( $name )
			{
				case "children":
					$this->_children = $value;
					break;
					
				case "attributes":
					if ( is_array($value) ) $this->_attributes = $value;
					break;
				
				case "name":
					$this->_nodeName = "{$value}";
					break;
			}
		}
		public function& __get( $name ) {
			
			switch( $name )
			{
				case "children":
					return $this->_children;
					
				case "attributes":
					return $this->_attributes;
				
				case "name";
					$name = $this->_nodeName;
					return $name;
			}
			
			return NULL;
		}
		
		public function attr( $name, $value = NULL ) {
			if ( func_num_args() < 2 ) return @$this->_attributes[ $name ];
				
			if ( $value === NULL )
				unset( $this->_attributes[ $name ] );
			else
				$this->_attributes[ $name ] = $value;
			
			return TRUE;
		}
		public function addChild( PBTXJSON $child ) {
			if ( !is_array($this->_children) )
				$this->_children = [];
				
			$this->_children[] = $child;
		}
		public function xml( $fileName = NULL ) {
			$content = "<?xml version='1.0' encoding='utf-8'?>" . self::__renderXMLNode( $this );
			return empty($fileName) ? $content : file_put_contents( $fileName, $content );
		}
		public function json( $fileName = NULL ) {
			$content = self::__renderJSONNode( $this );
			if ( !empty($fileName) ) $content = json_encode( $content );
			return (!is_string($fileName)) ? $content : file_put_contents( $fileName, $content );
		}
		
		private static function& __renderJSONNode( PBTXJSON &$node ) {
			$object = [];
			
			
			if ( is_array(@$node->_children) )
			{
				$object[ '@@children' ] = [];
			
				foreach( $node->_children as $child )
				{
					// Ignore none PBTXJSON children
					if ( !is_a($child, self::class) ) continue;
					
					$object[ '@@children' ][] = self::__renderJSONNode( $child );
				}
			}
			else
			if ( $node->_children !== NULL )
			{
				$object[ '@@children' ] = $node->_children;
			}
			
			
			
			foreach( $node->_attributes as $attr => $value )
			{
				if ( in_array( $attr, [ '@@node', '@@children' ] ) )
					continue;
					
				$object[ $attr ] = $value;
			}
			
			return $object;
		}
		private static function& __renderXMLNode( PBTXJSON &$node ) {
			
			$childContent = "";
			if ( !is_array(@$node->_children) )
				$childContent .= @"{$node->_children}";
			else
			{
				foreach( $node->_children as $child )
				{
					// Ignore none PBTXJSON children
					if ( !is_a($child, self::class) ) continue;
					
					$childContent .= self::__renderXMLNode( $child );
				}
			}


			$attr = self::__renderXMLAttribute( $node );
			if ( !empty($attr) ) $attr = " {$attr}";
			$childContent = trim($childContent);
			return empty($childContent) ? "<{$node->_nodeName}{$attr} />" : "<{$node->_nodeName}{$attr}>{$childContent}</{$node->_nodeName}>";
		}
		private static function& __renderXMLAttribute( PBTXJSON &$node ) {
			$attributes = [];
			foreach( $node->_attributes as $attr => $value )
			{
				if ( substr( $attr, 0, 2 ) == "@@" ) continue;
				if ( $value === NULL ) continue;
				
				$attributes[] = "{$attr}=\"" . htmlentities($value) . "\"";
			}

			return implode( ' ', $attributes );
		}
	}

	final class IO{
		public static function STDOUT( $msg ){ fwrite( STDOUT, $msg ); }
		public static function STDERR( $msg ){ fwrite( STDERR, $msg ); }
	}
