(function ($) {
    $(document).ready(function () {

        $('#table').generator();

		$('#reset_all').on('click', function (e) {
            //e.preventDefault();
			
			console.log('click updateAll');
			
			$('#results').text('');
			$('#table').data('generator').updateAll();
		});
		
		$('#reset_deck').on('click', function (e) {
            //e.preventDefault();
			
			console.log('click updateDeck');
			
			$('#table').data('generator').updateDeck();
		});
		
		// Client validation
		// ----------------------------------------------------------------------------------------------------------------------------
		
		$('#save_for_client_validation').on('click', function (e) {
			e.preventDefault();
			preview_for_client_validation();
			saveTextAsFile();
		});
		
		$('#preview_for_client_validation').on('click', function (e) {
            e.preventDefault();
			preview_for_client_validation();		
		});
		
		preview_for_client_validation = function()
		{
			console.log('save_1');
			
			var log = new Object();
			
			log.type = "validation";

			log.trump = $('form#main select').val();
			
			log.cards_on_table = $('#table').data('generator').parseCards($('#onTable li'));
			log.hand = $('#table').data('generator').parseCards($('#myCards li'));
			
			log.answer = {};
			log.answer.valid_cards = $('#table').data('generator').parseCards($('#validCards li'));
			
			$('#results').text(JSON.stringify(log));
		}
		
		// Client won
		// ----------------------------------------------------------------------------------------------------------------------------
		
		$('#save_for_client_won').on('click', function (e) {
			e.preventDefault();
			preview_for_client_won();
			saveTextAsFile();
		});
		
		$('#preview_for_client_won').on('click', function (e) {
			e.preventDefault();
			preview_for_client_won();		
		});
		
		preview_for_client_won = function()
		{
			var log = new Object();
			
			log.type = "won";

			log.trump = $('form#main select').val();
	
			log.cards_on_table = $('#table').data('generator').parseCards($('#onTable li'));

			log.answer = {};
			log.answer.won = $('#inputWon').val();
			
			$('#results').text(JSON.stringify(log));
		}
		
		// Server won
		// -------------------------------------------------------------------------------------------------------------------
		
		$('#save_for_server_won').on('click', function (e) {
            e.preventDefault();
			preview_for_server_won();
			saveTextAsFile();
		});
		
		$('#preview_for_server_won').on('click', function (e) {
			e.preventDefault();
			preview_for_server_won();		
		});
		
		preview_for_server_won = function()
		{
			var cards_on_table = $('#table').data('generator').parseCards($('#onTable li'));
			var first_player = 1;
			var winner = $('#inputWon').val();
			var trump = $('form#main select').val();
			trump = $('#table').data('generator').suitToASCII(trump);
			
			var tmpl = _.template(document.getElementById('server-won-template').innerHTML);
			var res = tmpl({cards_on_table: cards_on_table, first_player: first_player, trump: trump, winner: winner});
			//$('#results').text( res.replace(/\n+/g,'\n') );
			$('#results').text( res );
		}
		
		$('#save_for_server_validation').on('click', function (e) {
			e.preventDefault();
			preview_for_server_validation();
			saveTextAsFile();
		});
		
		$('#preview_for_server_validation').on('click', function (e) {
			e.preventDefault();
			preview_for_server_validation();		
		});
		
		preview_for_server_validation = function()
		{
			var cards_on_table = $('#table').data('generator').parseCards($('#onTable li'));
			var hand = $('#table').data('generator').parseCards($('#myCards li'));
			var valid_cards = $('#table').data('generator').parseCards($('#validCards li'));
			
			var position = cards_on_table.length + 1;
			var trump = $('form#main select').val();
			trump = $('#table').data('generator').suitToASCII(trump);

			var tmpl = _.template(document.getElementById('server-validation-template').innerHTML);
			var res = tmpl({cards_on_table: cards_on_table, position: position, trump: trump, hand: hand, valid_cards: valid_cards});
			//$('#results').text( res.replace(/\n+/g,'\n') );
			$('#results').text( res );
		}
		
		// Save
		// -------------------------------------------------------------------------------------------------------------------
		
		saveTextAsFile = function ()
		{
			var textToWrite0 = document.getElementById("results").value;

			var textToWrite = textToWrite0 + "\r\n";

			var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
			var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

			var downloadLink = document.createElement("a");
			downloadLink.download = fileNameToSaveAs + '.txt';
			downloadLink.innerHTML = "Download File";
			if (window.webkitURL != null)
			{
				// Chrome allows the link to be clicked
				// without actually adding it to the DOM.
				downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
			}
			else
			{
				// Firefox requires the link to be added to the DOM
				// before it can be clicked.
				downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
				downloadLink.onclick = destroyClickedElement;
				downloadLink.style.display = "none";
				document.body.appendChild(downloadLink);
			}

			downloadLink.click();
		}
		
		function destroyClickedElement(event)
		{
			document.body.removeChild(event.target);
		}
    });
})(jQuery);

function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent)
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("inputTextToSave").value = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}