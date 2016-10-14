(function() {
	"use strict";
	
	window.env = $U.merge( window.env || {}, {
		layout: {
			calc: function() {
				$( '.stage' ).each(function(){
					var
					target = $( this ),
					parent = target.parent();
		
		
					if ( !target.is('[data-base-width]') ) return;
		
		
		
					var
					parentSize = {
						width:  parent.width(),
						height: parent.height()
					},
					bWidth			= parseInt( target.attr( 'data-base-width' ) ),
					scale			= parentSize.width / bWidth,
					scale_inverse	= 1 / scale,
					bHeight 		= Math.ceil( parentSize.height * scale_inverse );
		
		
					target
					.data( 'scale', scale_inverse )
					.attr( 'data-scale', scale_inverse )
					.css({
						width: bWidth, height: bHeight,
						'transform-origin': '0 0',
						'transform': 'scale3d( ' + scale + ',' + scale + ',' +  '1 )',
						'-webkit-transform-origin': '0 0',
						'-webkit-transform': 'scale3d( ' + scale + ',' + scale + ',' +  '1 )'
					});
				});
			}
		}
	}, true, true);
})();
