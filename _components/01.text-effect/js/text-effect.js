

/* 
 *************************************
 * <!-- Text effect -->
 *************************************
 */
App = ( function ( App, $, window, document ) {
    'use strict';
    
	//////////////// cipher
	var cipher = function() {
	  function e(a, d, b) {
		var c, f, g, h;
          
        if ( b == a.length ) {
            k.animationComplete = !0;
        } else {
            g = d.innerHTML;
            h = Math.floor(21 * Math.random() + 5);
            
            if ( 32 === a[b] ) {
               c = 32; 
            } else {
               c = a[b] - h; 
            }
            
            f = setInterval(function() {
                
              d.innerHTML = g + String.fromCharCode(c);

                if ( c == a[b] ) {
                    clearInterval( f );
                    c = 32;
                    b++;

                    setTimeout( function() {
                        e(a, d, b);
                    }, 10 );

                } else {
                    c++;
                }

            }, 13 ); 
            
        }
          
          
	  }
	  var k = {};
        
	  return k = {
          animationComplete : !1, 
          text              : function( a ) {
                                    this.animationComplete = !1;
                                    a = document.querySelector( a );
			  
                                    for ( var d = a.innerHTML, b = [], c = 0; c < d.length; c++ ) {
                                      b.push( d.charCodeAt( c ) );
                                    }
                                    a.innerHTML = "";
                                    e( b, a, 0 );
	                          }
      };
        
	}();


    var pageLoaded = function() {

		$( '.text-eff' ).each( function()  {
			if ( $( this ).text().length > 0 ) {
				
				var waypoints = $( this ).waypoint({
					handler: function( direction ) {

						
						cipher.text( '#' + $( this.element ).attr( 'id' ) );

						
						this.disable();


					},
					offset: '100%' //0~100%, bottom-in-view
				});
				
				
			}
		});
		
		
    };

    App.textEffect = {
        pageLoaded : pageLoaded        
    };

    App.components.pageLoaded.push( pageLoaded );
    return App;

}( App, jQuery, window, document ) );

