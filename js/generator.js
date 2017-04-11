// Generator
// version 1.0.0, March 4th, 2016
// by Sozonov Alexey

// help
// D - ♦ 1
// H - ♥ 2
// C - ♣ 3
// S - ♠ 4

(function($) {

    // here we go!
    $.generator = function(element, options) {

        var all_cards = [];
        var suit = {
            'D': '♦',
            'H': '♥',
            'C': '♣',
            'S': '♠'
        }

        // plugin's default options
        // this is private property and is accessible only from inside the plugin
        var defaults = {

            foo: 'bar',

            // if your plugin is event-driven, you may provide callback capabilities
            // for its events. execute these functions before or after events of your
            // plugin, so that users may customize those particular events without
            // changing the plugin's code
            onFoo: function() {}
        }

        // to avoid confusions, use "plugin" to reference the
        // current instance of the object
        var plugin = this;

        // this will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('generator').settings.propertyName from outside the plugin,
        // where "element" is the element the plugin is attached to;
        plugin.settings = {}

        var $element = $(element), // reference to the jQuery version of DOM element
            element = element; // reference to the actual DOM element

        // the "constructor" method that gets called when the object is created
        plugin.init = function() {

            // the plugin's final properties are the merged default and
            // user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);

            // code goes here
            var cards = ['J', 'K', 'Q', 'A'];
            $.each(suit, function( k, v ) {
                //alert( "Key: " + k + ", Value: " + v );
                for (i = 6; i <= 10; i++) {
                    all_cards.push(k + '-' + i);
                }
                $.each(cards, function( index, value ) {
                    all_cards.push(k + '-' + value);
                });
            });
            
			all_cards.push('J-15');
			all_cards.push('J-15');
            //all_cards.push('Joker-Red');
            console.log('generator init; all_cards: ' + all_cards);

			plugin.updateDeck();
			
			//plugin.updateAll();
        }
		
		plugin.updateAll = function() {			
			var $trash = $( "#onTable" );
			var	$trash2 = $( "#myCards" );
			var	$trash3 = $( "#validCards" );
			
			$trash.empty();
			$trash2.empty();
			$trash3.empty();
			
			$trash.append('<a>Карты на столе</a>');
			$trash2.append('<a>Карты в руке</a>');
			$trash3.append('<a>Валидные карты</a>');
			
			plugin.updateDeck();
		}
		
        plugin.updateDeck = function() {
            
			$('.table, .cards').css('min-height', '100px');
			$('.table, .cards').css('border', '1px dashed #ccc');
			printCards('#after-table', all_cards, {card_wrapper: 'li', card_height: 70});

			// there's the gallery and the trash
			var $gallery = $( "#after-table" );

			// let the gallery items be draggable
			$( "li", $gallery ).draggable({
				cancel: "a.ui-icon", // clicking an icon won't initiate dragging
				revert: "invalid", // when not dropped, the item will revert back to its initial position
				containment: "document",
				helper: "clone",
				cursor: "move"
			});

			// let the trash be droppable, accepting the gallery items
			$('#onTable, #myCards, #validCards').droppable({
				accept: "#after-table > li",
				activeClass: "ui-state-highlight",
				drop: function( event, ui ) {
					deleteImage( ui.draggable, $(this) );
				}
			});

			// let the gallery be droppable as well, accepting items from the trash
			$gallery.droppable({
				accept: "#table li",
				activeClass: "custom-state-active",
				drop: function( event, ui ) {
					recycleImage( ui.draggable );
				}
			});

			// image deletion function
			var recycle_icon = "";
			function deleteImage( $item, $el ) {
				console.log('deleteImage');
				$item.fadeOut(function() {
					var $list = $( "ul", $el ).length ?
						$( "ul", $el ) :
						$( "<ul class='gallery ui-helper-reset'/>" ).appendTo( $el );

					console.log('item.fadeOut list: ' + $list.length);
						
					$item.draggable( "destroy" );
						
					$item.find( "a.ui-icon-trash" ).remove();
					$item.append( recycle_icon ).appendTo( $list ).fadeIn(function() {
						$item
							.find( "img" )
							.animate({ height: "100px" });
					});
				});
			}

			// image recycle function
			var trash_icon = "";
			function recycleImage( $item ) {
				$item.fadeOut(function() {
					$item
						.find( "a.ui-icon-refresh" )
						.remove()
						.end()
						.append( trash_icon )
						.find( "img" )
						.css( "height", "70px" )
						.end()
						.appendTo( $gallery )
						.fadeIn();
				});
			}

			// image preview function, demonstrating the ui.dialog used as a modal window
			function viewLargerImage( $link ) {
				var src = $link.attr( "href" ),
					title = $link.siblings( "img" ).attr( "alt" ),
					$modal = $( "img[src$='" + src + "']" );

				if ( $modal.length ) {
					$modal.dialog( "open" );
				} else {
					var img = $( "<img alt='" + title + "' width='384' height='288' style='display: none; padding: 8px;' />" )
						.attr( "src", src ).appendTo( "body" );
					setTimeout(function() {
						img.dialog({
							title: title,
							width: 400,
							modal: true
						});
					}, 1 );
				}
			}

			// resolve the icons behavior with event delegation
			$( "ul.gallery > li" ).click(function( event ) {
				
				console.log('click ul.gallery > li ?????');
				
				var $item = $( this ),
					$target = $( event.target );

				if ( $target.is( "a.ui-icon-trash" ) ) {
					deleteImage( $item );
				} else if ( $target.is( "a.ui-icon-zoomin" ) ) {
					viewLargerImage( $target );
				} else if ( $target.is( "a.ui-icon-refresh" ) ) {
					recycleImage( $item );
				}

				return false;
			});
        }

        var printCards = function(el, arr, opts) {

            var card_height = 100;
            var card_draggable = false;
            var draggable = '';
            var card_prefix = '';
            var card_suffix = '';

            if (typeof opts !== "undefined") {
                if (typeof opts.card_wrapper !== "undefined") {
                    card_prefix = '<' + opts.card_wrapper + '>';
                    card_suffix = '</' + opts.card_wrapper + '>';
                }
                if (typeof opts.card_height !== "undefined") {
                    card_height = opts.card_height;
                }
            }
			
            var html_string = '';
            $.each(arr, function( k, v ) {
                var params = v.split('-');
				html_string += card_prefix;
				html_string += '<img data-p0="' + params[0] + '" data-p1="' + params[1] + '" data-result="[\'' + params[1] + '\',\'' + suit[params[0]] + '\']" class="card" '+draggable+' src="images/cards/';
				html_string += params[0] + params[1] + '.svg" ' + 'style="float:left;max-width: 100%;height: ' + card_height + 'px;border:1px solid #ccc;margin: 0 10px 10px 0px;">';				
				
				if (params[0] == 'J') 
				{
					html_string += '<select name="suit" placeholder="suit" class="drop-option_suit"> <option value="0">0</option> <option value="D">♦</option> <option value="H">♥</option><option value="C">♣</option><option value="S">♠</option></select>';
					html_string += '<select name="suit" placeholder="suit" class="drop-option"> <option value="0">PLAY</option> <option value="1">PUT</option> <option value="2">MAX</option><option value="3">TAKE</option></select>';
					html_string += '<select name="suit" placeholder="suit" class="drop-colour"> <option value="1">1</option> <option value="2">2</option></select>';						
				}
						
				html_string += card_suffix;
            });
            $(el).html(html_string);
        }
		
		plugin.suitToASCII = function(suit) {
			return suitToASCII(suit);			
        }
		
		var suitToASCII = function (suit) {
			if (suit == 'C')
				return '♣';
			
			if (suit == 'S')
				return '♠';
			
			if (suit == 'D')
				return '♦';
			
			if (suit == 'H')
				return '♥';
		
			return suit;
		}
		
		plugin.parseCards = function($el) {
			return parseCards($el);			
        }
		
		var parseCards = function ($el) {
			
			var cardsJson = [];
			
			$el.each(function (index) {
                var $this = $(this);	
				var $firstImg = $this.find('img');

                var suit = $firstImg.data('p0');
				var suit_ascii = suitToASCII(suit);
                var rank = $firstImg.data('p1');
				var option = 0;
				var option_suit = 0;
				var option_suit_ascii = 0;
				var colour = 0;
				
				if (suit == 'J')
				{
					var elementOption = $this.find('.drop-option');
					option = elementOption.val();
					
					var elementOptionSuit = $this.find('.drop-option_suit');
					option_suit = elementOptionSuit.val();
					
					option_suit_ascii = suitToASCII(option_suit);
					
					var elementColour = $this.find('.drop-colour');
					colour = elementColour.val();					
				}
			
				var card = {
					"rank": rank,
					"suit": suit,
					"suit_ascii": suit_ascii,
					"colour": colour,
					"option": option,
					"option_suit": option_suit,
					"option_suit_ascii": option_suit_ascii,
					"status": index + 1,
				}
				
				cardsJson.push(card);
			
            });
			
            return cardsJson;
		}

        // public methods
        // these methods can be called like:
        // plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
        // element.data('generator').publicMethod(arg1, arg2, ... argn) from outside
        // the plugin, where "element" is the element the plugin is attached to;

        // a public method. for demonstration purposes only - remove it!
        plugin.foo_public_method = function() {

            // code goes here

        }

        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)

        // a private method. for demonstration purposes only - remove it!
        var foo_private_method = function() {

            // code goes here

        }

        // fire up the plugin!
        // call the "constructor" method
        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.generator = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('generator')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.generator(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('generator').publicMethod(arg1, arg2, ... argn) or
                // element.data('generator').settings.propertyName
                $(this).data('generator', plugin);

            }

        });

    }

})(jQuery);