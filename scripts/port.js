var randomSessionId = Math.floor(Math.random()*90000) + 10000;
var corsProxy = "https://cors.io/?"; //cors issue on github

$(document).ready( function () {
    $(document).on("keypress", "#input-msg", function(e) {
        if (e.which == 13 && !$("#sendButton").is(":disabled")) {
            sendMessage();
        }
    });
    sendAjaxRequestToAI("wake_up");
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

function disableSendButton(){
    $("#sendButton").html("[ ... ]");
    $("#sendButton").attr("disabled", true);
}

function enableSendButton() {
    $("#sendButton").removeAttr("disabled");
    $('#sendButton').blur();
    $("#sendButton").html("[ Send ]");
}

function scrollMessagesToBottomLeft() {
    var objDiv = document.getElementById("messages-container");
    objDiv.scrollTop = objDiv.scrollHeight;
    objDiv.scrollLeft = 0;
}

function sendAjaxRequestToAI(msg) {
    $.ajax({
        url: corsProxy + "https://gjadimailig-port-service.herokuapp.com/api/talk?sessionId=" + randomSessionId + "&msg=" + msg,
        success: function(data) {
            setResponse(data.result.fulfillment.speech);
        },
        error: function() {
            setResponse("Unable to communicate with middleware");
        }
    });
    disableSendButton();
}

function sendMessage() {
    var msg = $('#input-msg').val();
    if( !msg ) 
        return;    

    appendMessageInChat(msg);
    clearInput();
    sendAjaxRequestToAI(msg);
}

function setResponse(response) {
    appendMessageInChat(response);
    enableSendButton();
}
