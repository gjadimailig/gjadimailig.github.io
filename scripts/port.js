var accessToken = "b81fb40e657e46b39200f3a102fb5244";
var baseUrl = "https://api.api.ai/v1/";
var randomSessionId = Math.floor(Math.random()*90000) + 10000;

$(document).ready( function () {
    $(document).on("keypress", "#input-msg", function(e) {
        if (e.which == 13) {
            sendMessage();
        }
    });
    sendAjaxRequestToAI("Hi!");
    scrollMessagesToBottomLeft();
});

function appendMessageInChat(msg) {
    var messageSeparator = ">";
    var spaceSym = " ";
    $("#messages-container").append('<div class=\"p-2 wrap\">'+ messageSeparator + spaceSym + msg +'</div>');
    scrollMessagesToBottomLeft();
}

function clearInput(){
    $('#input-msg').val("");
    $('#input-msg').focus();
}

function scrollMessagesToBottomLeft() {
    var objDiv = document.getElementById("messages-container");
    objDiv.scrollTop = objDiv.scrollHeight;
    objDiv.scrollLeft = 0;
}

function sendAjaxRequestToAI(msg) {
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({ query: msg, lang: "en", sessionId: randomSessionId }),
        success: function(data) {
            setResponse(data);
            // setResponse(JSON.stringify(data, undefined, 2));
        },
        error: function() {
            setResponse("Internal Server Error");
        }
    });
}

function sendMessage() {
    var msg = $('#input-msg').val();
    if( !msg ) 
        return;    

    appendMessageInChat(msg);
    clearInput();
    sendAjaxRequestToAI(msg);
}

function setResponse(data) {
    appendMessageInChat(data.result.fulfillment.speech);   
}


