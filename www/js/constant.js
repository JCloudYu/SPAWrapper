(function() {
	"use strict";

	window.CORE = $U.merge( window.CORE || {}, {
		EVENT: {
			SYNC_BOOT_STATE:	 'boot state',
			SYNC_HEART_BEAT:	 'heartbeat'
		},
		CONST: {
			BOOT_STATES: {
				PRE_INIT:		 'pre-init',
				INIT:			 'init',
				RESOURCE:		 'resource',
				ENVIRONMENT:	 'environment',
				EXTENSION:		 'extension',
				COMPONENTS:		 'components',
				SYNC_HEART_BEAT: 'sync heartbeat',
				BOOT:			 'boot'
			}
		}
	}, false, true );
})();
