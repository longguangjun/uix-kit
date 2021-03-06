/* 
 *************************************
 * <!-- Multiple Items Carousel -->
 *************************************
 */
App = ( function ( App, $, window, document ) {
    'use strict';
    
    var documentReady = function( $ ) {
    
		$( '.custom-multi-items-carousel' ).each( function()  {

			var $carouselWrapper   = $( this ),
				$carousel          = $carouselWrapper.find( '.items' ),
				$carouselItem      = $carouselWrapper.find( '.items > .item' ),
				carouselItemTotal  = $carouselItem.length,
				showcarouselItem   = $carouselWrapper.data( 'cus-carousel-show' ),
				carouselItemWidth  = $carousel.width()/showcarouselItem,
				carouselItemHeight = $carousel.height()/showcarouselItem,
				carouselDir        = $carouselWrapper.data( 'cus-carousel-dir' ),
				carouselLoop       = $carouselWrapper.data( 'cus-carousel-loop' ),
				carouselSpeed      = $carouselWrapper.data( 'cus-carousel-speed' ),
				carouselNext       = $carouselWrapper.data( 'cus-carousel-next' ),
				carouselPrev       = $carouselWrapper.data( 'cus-carousel-prev' );

			if( typeof carouselDir === typeof undefined ) {
				carouselDir = 'horizontal';
			}
			
			if( typeof carouselLoop === typeof undefined ) {
				carouselLoop = false;
			}
			if( typeof showcarouselItem === typeof undefined ) {
				showcarouselItem = 3;
			}
			if( typeof carouselSpeed === typeof undefined ) {
				carouselSpeed = 250;
			}
			if( typeof carouselNext === typeof undefined ) {
				carouselNext = '.next';
			}
			if( typeof carouselPrev === typeof undefined ) {
				carouselPrev = '.prev';
			}


			
			/* 
			 ---------------------------
			 Initialize carousel
			 ---------------------------
			 */  
			var newWidth, newHeight;
			if ( carouselDir == 'horizontal' ) { 
				newWidth = ( $carouselWrapper.width() / showcarouselItem );
				$carousel.css( 'width', carouselItemTotal * carouselItemWidth );
			} else {
				newHeight = ( $carouselWrapper.height() / showcarouselItem );
				$carousel.css( 'height', carouselItemTotal * carouselItemHeight );
			}


			// Re-order all items
			carouselReOrder();



			//default button status
			if ( $carouselItem.first().data( 'id' ) == 1 && !carouselLoop ) {
				$( carouselPrev ).addClass( 'disable' );
			}	

			/* 
			 ---------------------------
			 Re-order all items
			 ---------------------------
			 */ 
			
			function carouselReOrder() {
				
				//Active the center item
				carouselActiveCenterItem( $carouselItem, 'default' );
				
				$carouselItem.each( function( index ) {
				

						if ( carouselDir == 'horizontal' ) {
							$( this )
								.width( newWidth + 'px' )
								.css( 'visibility', 'visible' )
								.attr( 'data-id', index+1 );
						} else {
							$( this )
								.height( newHeight + 'px' )
								.css( 'visibility', 'visible' )
								.attr( 'data-id', index+1 );
						}

					});	
			}
			
			/* 
			 ---------------------------
			 Active the center item
			 ---------------------------
			 */ 
			
			function carouselActiveCenterItem( el, dir ) {
				var curItemIndex    = (showcarouselItem/2).toFixed(0),
					centerItemIndex = Math.floor(showcarouselItem / 2)-1;		
				el.removeClass( 'active active-prev active-next' );
				
				
				
				if ( dir == 'left' ) {
					el.eq( curItemIndex ).addClass( 'active' );
					
				} else if ( dir == 'right' ) {
					el.eq( centerItemIndex ).addClass( 'active' );	
					
				} else if ( dir == 'default' ) {
					el.eq( curItemIndex - 1 ).addClass( 'active' );		
				}
				
				//Add nearest classes for 3 elements
				el.each( function() {
					if ( $( this ).hasClass( 'active' ) ) {
						$( this ).prev().addClass( 'active-prev' );
						$( this ).next().addClass( 'active-next' );
						
						return false;
					}
				});	
				
				
				
			}	
			

			
			
			/* 
			 ---------------------------
			 Move left
			 ---------------------------
			 */ 
			$( carouselNext ).on( 'click', $carouselWrapper, function( e ) {
				e.preventDefault();
				
				
				var $btn        = $( this ),
					btnLock     = $btn.data( 'click' ),
					$curWrapper = $( e.data[0] ),
					$curItems   = $curWrapper.children().find( '> .item' ),
					isEnd       = false;
				
				
				
				//Move to the end
				if ( (carouselItemTotal - showcarouselItem + 1) == $curItems.first().data( 'id' ) ) {
					isEnd = true;
				}
				if ( (carouselItemTotal - showcarouselItem) == $curItems.first().data( 'id' ) && !carouselLoop ) {
					$btn.addClass( 'disable' );
				}
				
				
				//Loop items
				if ( carouselLoop ) {
					isEnd = false;
				}
				
				
				if ( typeof btnLock === typeof undefined || btnLock === 0 ) {
					
					if ( !isEnd ) {
						
						//Avoid button repeated trigger
						$btn.data( 'click', 1 );
						
						if ( carouselDir == 'horizontal' ) {
							

							TweenMax.to( $curItems.first(), carouselSpeed/1000, {
								css: {
									marginLeft : -carouselItemWidth
								},
								onComplete : function() {

									//Initialize each item "margin-left"
									$curItems.css( 'margin-left', 0 );

									//Clone the first element to the last position
									$curItems
										.first()
										.clone()
										.appendTo( $carousel );


									//Remove duplicate elements
									this.target.remove();



									//Active the center item
									carouselActiveCenterItem( $curItems, 'left' );
									
									
									//Reset prevents code from duplicate run
									$( carouselPrev ).data( 'click', 0 ).removeClass( 'disable' );
									$btn.data( 'click', 0 );

								}
							});		
					
							
						} else {
							
							
							TweenMax.to( $curItems.first(), carouselSpeed/1000, {
								css: {
									marginTop : -carouselItemHeight
								},
								onComplete : function() {

									//Initialize each item "margin-top"
									$curItems.css( 'margin-top', 0 );

									//Clone the first element to the last position
									$curItems
										.first()
										.clone()
										.appendTo( $carousel );


									//Remove duplicate elements
									this.target.remove();



									//Active the center item
									carouselActiveCenterItem( $curItems, 'left' );


									//Reset prevents code from duplicate run
									$( carouselPrev ).data( 'click', 0 ).removeClass( 'disable' );
									$btn.data( 'click', 0 );

								}
							});				
								
						}

	
					}


					
	
				}


			});

			
			/* 
			 ---------------------------
			 Move right
			 ---------------------------
			 */ 
			$( carouselPrev ).on( 'click', $carouselWrapper, function( e ) {
				e.preventDefault();

				
				var $btn        = $( this ),
					btnLock     = $btn.data( 'click' ),
					$curWrapper = $( e.data[0] ),
					$curItems   = $curWrapper.children().find( '> .item' ),
					isEnd       = false,
					$cloneItem  = null;

				
				//Move to the end
				if ( 1 == $curItems.first().data( 'id' ) ) {
					isEnd = true;
				}
				if ( 2 == $curItems.first().data( 'id' ) && !carouselLoop ) {
					$btn.addClass( 'disable' );
				}
				
				
				//Loop items
				if ( carouselLoop ) {
					isEnd = false;
				}
				
				
				if ( typeof btnLock === typeof undefined || btnLock === 0 ) {
					
					if ( !isEnd ) {
						
						//Avoid button repeated trigger
						$btn.data( 'click', 1 );

				
						//Clone the first element to the last position
						if ( carouselDir == 'horizontal' ) {
							
							$cloneItem = $curItems.last().clone();
							

							//Clone the last element to the first position
							$cloneItem
								.prependTo( $carousel )
							    .css( 'margin-left', -carouselItemWidth + 'px' );
							
							
							TweenMax.to( $cloneItem, carouselSpeed/1000, {
								css: {
									marginLeft : 0
								},
								onComplete : function() {
	
									//Remove duplicate elements
									$curItems
										.last()
										.remove();



									//Active the center item
									carouselActiveCenterItem( $curItems, 'right' );


									//Reset prevents code from duplicate run
									$( carouselNext ).data( 'click', 0 ).removeClass( 'disable' );
									$btn.data( 'click', 0 );


								}
							});
					


						} else {
							
							
							$cloneItem = $curItems.last().clone();
							

							//Clone the last element to the first position
							$cloneItem
								.prependTo( $carousel )
							    .css( 'margin-top', -carouselItemHeight + 'px' );
							
							
							TweenMax.to( $cloneItem, carouselSpeed/1000, {
								css: {
									marginTop : 0
								},
								onComplete : function() {
	
									//Remove duplicate elements
									$curItems
										.last()
										.remove();



									//Active the center item
									carouselActiveCenterItem( $curItems, 'right' );


									//Reset prevents code from duplicate run
									$( carouselNext ).data( 'click', 0 ).removeClass( 'disable' );
									$btn.data( 'click', 0 );


								}
							});
						
							
						
						}
						
						
	
					}


					
	
				}
				
				

			});
			
			
			


		});		
		
		
    };

    App.multiItemsCarousel = {
        documentReady : documentReady        
    };

    App.components.documentReady.push( documentReady );
    return App;

}( App, jQuery, window, document ) );






