
/* 
 *************************************
 * <!-- Posts List With Ajax -->
 *************************************
 */
App = ( function ( App, $, window, document ) {
    'use strict';
   
   
    var documentReady = function( $ ) {
		
	
		$( '[data-ajax-list-json]' ).each( function() {
			var $this            = $( this ),
				wrapperID        = 'refresh-all-waypoint-' + Math.random()*1000000000000000000,
			    curPage          = $this.data( 'ajax-list-page-now' ),
				perShow          = $this.data( 'ajax-list-page-per' ),
				totalPage        = $this.data( 'ajax-list-page-total' ),
				method           = $this.data( 'ajax-list-method' ),
				trigger          = $this.data( 'ajax-list-trigger' ),
				infinitescroll   = $this.data( 'ajax-list-infinitescroll' ),
				jsonFile         = $this.data( 'ajax-list-json' ),
				addition         = $this.data( 'ajax-list-addition' ),
				template7ID      = $this.data( 'ajax-list-temp-id' ),
				pushContainer    = $this.data( 'ajax-list-push-container-class' ),
				triggerActive    = $this.data( 'ajax-list-trigger-active-class' );
	

			$this.attr( 'id', wrapperID );
			
			if( typeof curPage === typeof undefined ) {
				curPage = 1;
			}
			
			
			if( typeof perShow === typeof undefined ) {
				perShow = 8;
			}
			
			if( typeof totalPage === typeof undefined ) {
				totalPage = 3;
			}
			
			if( typeof totalPage != typeof undefined && totalPage == '-1' ) {
				totalPage = 9999;
			}
			
			
			if( typeof trigger === typeof undefined ) {
				trigger = '.load-more';
			}
			
			if( typeof infinitescroll === typeof undefined ) {
				infinitescroll = false;
			}	
			
			if( typeof addition === typeof undefined ) {
				addition = true;
			}			
			
			
			if( typeof jsonFile === typeof undefined ) {
				jsonFile = '';
			}		
			
			if( typeof template7ID === typeof undefined ) {
				template7ID = '';
			}	
			if( typeof triggerActive === typeof undefined ) {
				triggerActive = 'active';
			}		
			
			if( typeof method === typeof undefined ) {
				method = 'POST';
			}		
			
			
			
			triggerActive = triggerActive.replace( '.', '' );
			
			
			
			if( typeof pushContainer === typeof undefined ) {
				pushContainer = '.portfolio-items-ajax-container';
				
				if ( $this.find( pushContainer ).length == 0 ) {
					$( '#' + template7ID ).after( '<div class="portfolio-items-ajax-container"></div>' );
				}
				
			}		
			
			
			
			//Get all attributes of an element and push the new attributes like "data-*"
			var curAttrs        = $this.attr(),
				defaultPostData = '',
				customPostData  = '';
			
			$.each( curAttrs, function( i, val ) {
				if ( i.indexOf( 'data-ajax-list-field-' ) >= 0 ) {
					customPostData += '"' + i.replace( 'data-ajax-list-field-', '' ) + '": ' + '"' + val + '", ';	
				}
				
			});
			customPostData  = customPostData.replace(/,\s*$/, '' );
			

		
			
			//Parse the JSON data
			if ( jsonFile != '' && template7ID != '' ) {
				
				
				if ( infinitescroll ) {
					/* 
					 ---------------------------
					 Infinite scroll
					 ---------------------------
					 */ 	
					var $button = $( trigger ),
						btnTop  = $button.offset().top;
					
					//Add default page number to the button
					$button.attr( 'data-cur-page', 1 );

					
					//Hide the next button 
					if ( totalPage == 1 ) {
						$button.addClass( 'hide' );	
					}
					
				
						
					$( window ).on( 'scroll touchmove', function() {
						
					
						
						var scrolled = $( window ).scrollTop();
						
						if ( scrolled >= parseFloat( $button.offset().top - $( window ).height()/2 - $button.outerHeight( true )*2 ) && !$button.hasClass( triggerActive ) ) {

								// Active this button
								$button.addClass( triggerActive );					    
							
								var curPage = $button.attr( 'data-cur-page' );
							
								//Add next page number to the button
								curPage = parseFloat( curPage ) + 1;
								$button.attr( 'data-cur-page', curPage );
							
							    //Avoid touching the same button multiple times
							    if ( curPage == totalPage + 1 ) return false;
							
								//Perform dynamic loading
								if ( customPostData != '' ) {
									defaultPostData = JSON.parse( '{ "total": '+totalPage+', "per": '+perShow+', "page": '+curPage+', '+customPostData+' }' );
								} else {
									defaultPostData = JSON.parse( '{ "total": '+totalPage+', "per": '+perShow+', "page": '+curPage+' }' );
								}


								ajaxLoadInit( $this, defaultPostData, $button, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, addition );


							
						}
						
					});	
					
				} else {
					/* 
					 ---------------------------
					 Ajax with JSON data
					 ---------------------------
					 */
					
					var triggerStr = '';
					
					if ( trigger.indexOf( '[' ) >= 0 &&  trigger.indexOf( ']' ) >= 0 ) {
						triggerStr = JSON.parse( trigger.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"') );
					} else {
						triggerStr = trigger;

					}

					//Whether there are two flip buttons "Previous" and "Next"
					if ( Object.prototype.toString.call( triggerStr ) =='[object Array]' ) {

						var prevTrigger = triggerStr[0].prev,
							nextTrigger = triggerStr[1].next;
						
						//Add default page number to the button
						$( nextTrigger ).parent().attr( 'data-cur-page', 1 );


						
						//--------------- Next Button ------------------
						//Hide the next button 
						if ( totalPage == 1 ) {
							$( nextTrigger ).addClass( 'hide' );	
						}

						$( document ).on( 'click', nextTrigger, function( e ) {

							e.preventDefault();

							var $button = $( this ),
								curPage = $button.parent().attr( 'data-cur-page' );
							
							//Add next page number to the button
							curPage = parseFloat( curPage ) + 1;
							$button.parent().attr( 'data-cur-page', curPage );
							
							//Init button status
							$( prevTrigger ).removeClass( triggerActive );
							$( nextTrigger ).removeClass( triggerActive );
							$( prevTrigger ).removeClass( 'hide' );
							


							// Active this button
							$button.addClass( triggerActive );		


							//Perform dynamic loading
							if ( customPostData != '' ) {
								defaultPostData = JSON.parse( '{ "total": '+totalPage+', "per": '+perShow+', "page": '+curPage+', '+customPostData+' }' );
							} else {
								defaultPostData = JSON.parse( '{ "total": '+totalPage+', "per": '+perShow+', "page": '+curPage+' }' );
							}

							ajaxLoadInit( $this, defaultPostData, $button, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, addition );
							
							return false;


						});		
						
							
						
						//----------------- Previous Button ----------------
						//Hide the prev button 
						$( prevTrigger ).addClass( 'hide' );
						
						$( document ).on( 'click', prevTrigger, function( e ) {

							e.preventDefault();

							var $button = $( this ),
								curPage = $button.parent().attr( 'data-cur-page' );
				
							//Add next page number to the button
							curPage = parseFloat( curPage ) - 1;
							$button.parent().attr( 'data-cur-page', curPage );
							
							//Init button status
							$( prevTrigger ).removeClass( triggerActive );
							$( nextTrigger ).removeClass( triggerActive );
							$( nextTrigger ).removeClass( 'hide' );
							


							// Active this button
							$button.addClass( triggerActive );		


							//Perform dynamic loading
							if ( customPostData != '' ) {
								defaultPostData = JSON.parse( '{ "total": '+totalPage+', "per": '+perShow+', "page": '+curPage+', '+customPostData+' }' );
							} else {
								defaultPostData = JSON.parse( '{ "total": '+totalPage+', "per": '+perShow+', "page": '+curPage+' }' );
							}

							ajaxLoadInit( $this, defaultPostData, $button, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, addition );

							
							return false;


						});						


					} else {
						
						
						//Add default page number to the button
						$( trigger ).attr( 'data-cur-page', 1 );

						//Hide the next button 
						if ( totalPage == 1 ) {
							$( trigger ).addClass( 'hide' );	
						}

						$( document ).on( 'click', trigger, function( e ) {

							e.preventDefault();

							var $button = $( this ),
								curPage = $button.attr( 'data-cur-page' );

							//Add next page number to the button
							curPage = parseFloat( curPage ) + 1;
							$button.attr( 'data-cur-page', curPage );

							
							// Active this button
							$button.addClass( triggerActive );		


							//Perform dynamic loading
							if ( customPostData != '' ) {
								defaultPostData = JSON.parse( '{ "total": '+totalPage+', "per": '+perShow+', "page": '+curPage+', '+customPostData+' }' );
							} else {
								defaultPostData = JSON.parse( '{ "total": '+totalPage+', "per": '+perShow+', "page": '+curPage+' }' );
							}

							ajaxLoadInit( $this, defaultPostData, $button, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, addition );

							
							return false;


						});	
						
					}	
					
				
					
				}//end if
				
			}
			
		});
			
			
		/*
		 * Ajax with JSON data
		 *
		 * @param  {object} ajaxWrapper     - The outermost container of list.
		 * @param  {object} defaultPostData - Data to be sent to the server which is custom JSON fields.
		 * @param  {object} trigger         - Trigger ajax loaded button object.
		 * @param  {number} curPage         - The current page to load.
		 * @param  {number} perShow         - The amount to load each time.
		 * @param  {number} totalPage       - The total page to load.
		 * @param  {string} template7ID     - HTML template ID
		 * @param  {string} jsonFile        - JSON file path to docking data
		 * @param  {string} triggerActive   - The class name of trigger button actived.
		 * @param  {string} pushContainer   - This container is used to display the loaded dynamic data.
		 * @param  {string} method          - The type of request to make, which can be either "POST" or "GET".
		 * @param  {boolean} addition       - Do or not append to the original content.
		 * @return {void}                   - The constructor.
		 */
		
		function ajaxLoadInit( ajaxWrapper, defaultPostData, trigger, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, addition ) {

			var $divRoot         = ajaxWrapper,
				template         = document.getElementById( template7ID ).innerHTML,
				compiledTemplate = Template7.compile( template ),
				$button          = $( trigger );

			
			$.ajax({
				url      : jsonFile, //Be careful about the format of the JSON file
				method   : method,
				data     : defaultPostData,
				dataType : 'json',
				success  : function (data) { 
					
					//If the data is empty
					if ( data == null ) $button.addClass( 'hide' );
				
					
					//Check if a key exists inside a json object
					if ( data && data.hasOwnProperty( 'items' ) && Object.prototype.toString.call( data.items )=='[object Array]' ) {
						
						
						//Data overflow may occur when the total number of pages is not posted
						try {

							var pageLoaded    = App.components.pageLoaded,
								documentReady = App.components.documentReady,
								thisData      = data,
								html          = compiledTemplate( thisData ),
								curHtml       = $divRoot.find( pushContainer ).html(),
								result        = null,
								htmlEl        = null;


							
							
							//--------- Do or not append to the original content
							if ( addition ) {
								result = curHtml + html;
								htmlEl = $( result );
								$divRoot.find( pushContainer ).before( htmlEl );
							} else {
								result = html;
								htmlEl = $( result );
								$divRoot.find( pushContainer ).html( htmlEl );
							}
							
							
							
							
							//--------- jQuery Masonry and Ajax Append Items
							$( '.custom-gallery' ).each( function() {
								var type = $( this ).data( 'show-type' );

								if ( type.indexOf( 'masonry' ) >= 0  ) {
									$( this ).addClass( 'masonry-container' );
									$( this ).find( '.custom-gallery-item' ).addClass( 'masonry-item' );
								}
								
							});
							
							var masonryItemContainer = $( '.masonry-container' );
							imagesLoaded( masonryItemContainer ).on( 'always', function() {
								 masonryItemContainer.masonry({
								    itemSelector: '.masonry-item'
								 });  
								
								$( masonryItemContainer ).masonry( 'reloadItems' );
								$( masonryItemContainer ).masonry( 'layout' );	
								
							});	
				
							
							
							//--------- Init Videos
							App.videos.documentReady($);
							
							//--------- Init Custom Lightbox
							App.customLightbox.pageLoaded();


							//--------- Remove this button
							$button.removeClass( triggerActive );	
	
							//--------- Hidden button when the page total number is set and does not equal -1 or 9999
							if ( 
								curPage == totalPage && 
								totalPage != 9999 && 
								totalPage != -1 &&
								totalPage != 1
							) {
								$button.addClass( 'hide' );
							}		
							
							if ( 
								curPage == 1
							) {
								$button.addClass( 'hide' );
							}			
							

						} catch ( err ) {
							console.log( err.message );
							$button.addClass( 'hide' );

						}

						
					}

				 },
				 error : function( XMLHttpRequest, textStatus, errorThrown ) {
					 $button.addClass( 'hide' );
					 
				 }
			});

		}

	
	   
		
		
		
	};
	
		
    App.listAjax = {
        documentReady : documentReady        
    };

    App.components.documentReady.push( documentReady );
    return App;

}( App, jQuery, window, document ) );


