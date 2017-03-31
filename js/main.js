/*function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    console.log(ev);
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    console.log(ev);
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}*/

(function ($) {
    $(document).ready(function () {

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        }

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        }

        var auto = getCookie('auto');
        if (typeof auto !== "undefined" && auto == 1) {
            $("#auto").attr('checked', 'checked');
            $('#accept').hide();
        }
        else {
            $("#auto").removeAttr('checked');
            $('#accept').show();
        }

        $("#auto").change(function() {
            if(this.checked) {
                setCookie('auto', 1, 1);
            }
            else {
                setCookie('auto', 0, 1);
            }
        });

        function getParams() {
            var params = {};
            $('form#main input').each(function (index) {
                var value = $(this).val();
                var name = $(this).attr('name');
                if (value.length > 0) {
                    params[name] = value;
                }
            });
            params[$('form#main select').attr('name')] = $('form#main select').val();
            return params;
        }

        $('#table').generator();

        $('form#main button').click(function (e) {
            e.preventDefault();
            $('#results').text('');
            var params = getParams();
            $('#table').data('generator').generate(params);
        });

        $('#table .cards').on('click', '.card', function (e) {
            e.preventDefault();

            var $this = $(this);
            var res = $this.data('result');

            //var p1 = $this.data('p1');
            //var p2 = $this.data('p2');

            var params = getParams();
            //$('#result').text('result = '+res);
            var text = $('#results').text();
            text += "\r\n" + 'result = '+res + "\r\n" + "\r\n";
            $('#results').text(text);

            if (auto !== 1) {
                $('#onTable, #myCards').html('');
            }

            $('#table').data('generator').generate(params);
        });

        $('#accept').on('mousedown', function (e) {
            e.preventDefault();

            var arr1 = [];
            var arr2 = [];

            $('#onTable img').each(function (index) {
                var $this = $(this);
                var p0 = $this.data('p0');
                var p1 = $this.data('p1');
                arr1.push(p0 + '-' + p1);
            });

            $('#myCards img').each(function (index) {
                var $this = $(this);
                var p0 = $this.data('p0');
                var p1 = $this.data('p1');
                arr2.push(p0 + '-' + p1);
            });

            var table1 = $('#table').data('generator').convertArray(arr1);
            var cards1 = $('#table').data('generator').convertArray(arr2);

            string = '';
            string += "\r\n";
            string += $('#table').data('generator').arrayToStr('table', table1);
            string += "\r\n";
            string += $('#table').data('generator').arrayToStr('cards', cards1);

            var text = $('#results').text();
            $('#results').text(text + string);
        })

    });
})(jQuery);



var saveTextAsFile = function ()
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