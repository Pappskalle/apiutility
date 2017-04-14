$(document).ready(function(){
    init();

    $('#saveButton').on('click', function() {
        console.log('saveButton');
    });
    
    $('#enviromentSelect').change(function(item) {
        console.log('enviromentSelect');
    });
    
    $('#export').on('click', function() {
        console.log('export');
        var date = new Date();
        for(var i = 0; i< result.length; i++) {
            Object.keys(result[i]).forEach(function (key, index) {
                if (typeof result[i][key] == 'object'){
                    result[i][key + '_'] = JSON.stringify(result[i][key]);
                }

                if (result[i][key] === 'null'){
                    result[i][key] = '';
                }
            });
        }
        alasql('SELECT * INTO XLS("'+ date.toLocaleDateString()+ '-export.xls", {headers:true}) FROM ?',[resutl]);

    });

    $('#callPeople').click(function () {
       $.ajax({
           url: "/api/people/" + "boogieUser",
           type: "GET",
           success: showResutl,
           error: showResutl,
       });
    });

    $('#GETService').click(function() {
        console.log('GETService');
        setCookie('API_PREV_URL',$('#theURL').val());
        utilityAjax('GET');
    });
    $('#POSTService').click(function() {
        console.log('POSTService');
        utilityAjax('POST');
    });
    $('#PUTService').click(function() {
        console.log('PUTService');
        utilityAjax('PUT');
    });
    $('#DELETEService').click(function() {
        console.log('DELETEService');
        utilityAjax('DELETE');
    });

    function utilityAjax(type) {
        setCookie('API_PREV_ACTION', type);

        ct = $('#contentType').val();
        var d = $('#jsonObject').val();
        if(type === 'GET' || type === 'DELETE') {
            $.ajax({
                url: $('#theURL').val(),
                type: type,
                success: showResults,
                error: showResults,
            });
        }else{
            $.ajax({
                url: $('#theURL').val(),
                type: type,
                data: d,
                contentType: ct,
                success: showResults,
                error: showResults,
            });
        };
    }

    var result;
    var savedRequests = JSON.parse(localStorage.getItem('API_SAVED_REQUESTS')) || [];

    function runScript(e) {
        console.log('runScript(e)',e);
        if (e.keyCode == 13){
            $('#getservice').click();
        };
    }
    
    function setCookie(c_name,value,exdays) {
        console.log('setCookie(c_name,value,exdays)',c_name,value,exdays);
        var exdate = new Date();
        exdate.setDate(exdate.getDate()+exdays);
        var c_value = escape(value) + ((exdays == null) ? '' : '; expires=' + exdate.toUTCString());
        document.cookie = c_name + '=' + c_value;
    }

    function getCookie(c_name) {
        console.log('getCookie(c_name)', c_name);
        var i, x, y, ARRcookies = document.cookie.split(';');
        for(i = 0; i<ARRcookies.length; i++){
            x = ARRcookies[i].substr(0,ARRcookies[i].indexOf('='));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf('=')+1);
            x = x.replace(/^\s+||s+$/g,'');
            if(x == c_name){
                return unescape(y);
            }

        }
    }

    function loadRequest(index) {
        console.log('loadRequest(index)', index);
        $('#theURL').val(savedRequests[index].url);
        $('#jsonObject').val(savedRequests[index].obj);
        $('#contentType').val(savedRequests[index].contentType);
    }
    
    function removeRequest(index) {
        console.log('removeRequest(index)',index);
        savedRequests.splice(index,1);
        for(i = 0; i<savedRequests.length; i++){
            savedRequests[i].index = i;
        }
        localStorage.setItem('API_SAVED_REQUEST',JSON.stringify(savedRequests));
        displaySavedRequestButton();
    }
    
    function displaySavedRequestButton() {
        console.log('displaySavedRequestButton()');
        $('#saveButtons').html('');
        if(savedRequests.length>0){
            $('#saveButtons').append('<div>Click the name of the saved request to load it. Check the red x to remove it</div>');
        }
        for(var i = 1; i< savedRequests.length; i++){
            var btnString = '<button class="btn btn-primary" onclick="loadRequest('+savedRequests[i].index +')">'+savedRequests[i].name+'</button>';
            $('#saveButtons').append(btnString);
            var btnDelete = '<button class="btn btn-danger" onclick="removeRequest('+savedRequests[i].index +')">X</button>';
            $('#saveButtons').append(btnDelete);
        };
    }
    
    function showResults(data) {
        console.log('showResults(data)', data);
        $('#resultsDiv').show();
        $('#results').text(JSON.stringify(data,null,2));
        result = data;
    }

    function init() {
        console.log('init()');

    }
    

    
});