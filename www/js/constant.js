(function() {
	"use strict";

	window.CORE = $U.merge( window.CORE || {}, {
		VERSION: "1.0.0",
		EVENT: {
			SYNC_HEART_BEAT: 'heartbeat'
		}
	});
})();
