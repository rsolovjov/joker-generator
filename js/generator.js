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
            //all_cards.push('Joker-Black');
            //all_cards.push('Joker-Red');
            //console.log(all_cards);

        }

        plugin.generate = function(params) {
            var default_params = {
                firstplayer: 1,
                position: 3,
                trump: 'D',
                phase: 7,
                order: 0,
                won: 0,
                total_order: 1,
                auto: 0
            }
            var settings = $.extend({}, default_params, params);

            var string = '';

            $.each(settings, function( key, value ) {
                if (key !== 'auto') {
                    if (key === 'trump') {
                        string += key + ' = \'' + suit[value] + "\'\r\n";
                    }
                    else {
                        string += key + ' = ' + value + "\r\n";
                    }
                }
            });

            if (settings.auto === 1) {
                var table = getRandomSubarray(all_cards, settings.position - 1);

                var not_all_cards = all_cards.filter( function ( elem ) {
                    return table.indexOf( elem ) === -1;
                });

                var cards = getRandomSubarray(not_all_cards, settings.phase);

                printCards('.table', table);
                printCards('.cards', cards);

                var table = convertArray(table);
                var cards = convertArray(cards);

                string += "\r\n";
                string += arrayToStr('table', table);
                string += "\r\n";
                string += arrayToStr('cards', cards);

                var text = $('#results').text();
                $('#results').text(text + string);
            }
            else {
                $('.table, .cards').css('min-height', '100px');
                $('.table, .cards').css('border', '1px dashed #ccc');
                printCards('#after-table', all_cards, {card_wrapper: 'li', card_height: 70});

                // there's the gallery and the trash
                var $gallery = $( "#after-table" ),
                    $trash = $( "#onTable"),
                    $trash2 = $( "#myCards" );

                // let the gallery items be draggable
                $( "li", $gallery ).draggable({
                    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    containment: "document",
                    helper: "clone",
                    cursor: "move"
                });

                // let the trash be droppable, accepting the gallery items
                $('#onTable, #myCards').droppable({
                    accept: "#after-table > li",
                    activeClass: "ui-state-highlight",
                    drop: function( event, ui ) {
                        deleteImage( ui.draggable, $(this) );
                    }
                });

                // let the trash be droppable, accepting the gallery items
                /*$trash2.droppable({
                    accept: "#after-table > li",
                    activeClass: "ui-state-highlight",
                    drop: function( event, ui ) {
                        deleteImage( ui.draggablee, $trash2 );
                    }
                });*/

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
                    $item.fadeOut(function() {
                        var $list = $( "ul", $el ).length ?
                            $( "ul", $el ) :
                            $( "<ul class='gallery ui-helper-reset'/>" ).appendTo( $el );

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

                var text = $('#results').text();
                $('#results').text(text + string);

            }



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

            /*if (card_draggable === true) {
                draggable = ' draggable="true" ondragstart="drag(event)" ';
            }*/

            var html_string = '';
            $.each(arr, function( k, v ) {
                var params = v.split('-');
                html_string += card_prefix + '<img data-p0="' + params[0] + '" data-p1="' + params[1] + '" data-result="[\'' + params[1] + '\',\'' + suit[params[0]] + '\']" class="card" '+draggable+' src="images/cards/' + params[0] + params[1] + '.svg" ' +
                    'style="float:left;max-width: 100%;height: '+card_height+'px;border:1px solid #ccc;margin: 0 10px 10px 0px;">' + card_suffix;
            });
            $(el).html(html_string);
        }

        var getRandomSubarray = function(arr, size) {
            var shuffled = arr.slice(0), i = arr.length, temp, index;
            while (i--) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(0, size);
        }

        plugin.arrayToStr = function(label, arr) {
            return arrayToStr(label, arr);
        }

        var arrayToStr = function (label, arr) {
            var result = label + ' = [' + "\r\n";
            $.each(arr, function( k, v ) {
                result += '  [';
                $.each(v, function( key, value ) {
                    result += '\'' + value + '\'';
                    if (key !== v.length - 1) {
                        result += ', '
                    }
                });
                result += ']';
                if (k !== arr.length - 1) {
                    result += ','
                }
                result += "\r\n";
            });
            return result + ']' + "\r\n";
        }

        plugin.convertArray = function(arr) {
            return convertArray(arr);
        }

        var convertArray = function (arr) {
            var result = [];
            $.each(arr, function( k, v ) {
                var params = v.split('-');
                result[k] = [params[1], suit[params[0]]];
            });
            return result;
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