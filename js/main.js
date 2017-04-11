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
		
		$('#save_for_client_validation').on('click', function (e) {
            //e.prevent
			preview_for_client_validation();
			saveTextAsFile();
		});
		
		$('#preview_for_client_validation').on('click', function (e) {
            //e.preventDefault();
			preview_for_client_validation();		
		});
		
		preview_for_client_validation = function()
		{
			console.log('save_1');
			
			var log = new Object();
			
			log.type = "validation";


			log.trump = $('form#main select').val();
			
			//---------------------------
			log.cards_on_table = $('#table').data('generator').parseCards($('#onTable li'));
			log.hand = $('#table').data('generator').parseCards($('#myCards li'));
			
			log.answer = {};
			log.answer.valid_cards = $('#table').data('generator').parseCards($('#validCards li'));
			
			$('#results').text(JSON.stringify(log));
		}
		
		//-------------------------
		
		$('#save_for_client_won').on('click', function (e) {
            //e.prevent
			preview_for_client_won();
			saveTextAsFile();
		});
		
		$('#preview_for_client_won').on('click', function (e) {
            //e.preventDefault();
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
		
		function destroyClickedElement(event)
		{
			document.body.removeChild(event.target);
		}
		
		// ---------------
		
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