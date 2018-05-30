const DOWNLOAD_RESUME_INTENT_ID = "f1bdea9b-4035-4da2-ba7d-e8898e4542c7";
const GET_IN_TOUCH_INTENT_ID = "3fbf00bf-e903-4201-92c3-141c3e22fc89";
const DEFAULT_WELCOME_INTENT_ID = "d1a8ed4e-2c93-4557-a4a5-567a9a169ff3";
const BUSINESS_ASK_VIEW_RESUME_INTENT_ID = "cc85b13c-a8a0-4659-a019-c973fac94872";
const BUSINESS_SKIP_RESUME_INTENT_ID = "ade89482-4b1a-40d2-a313-1a90968a6700";
const DO_NOTHING_INTENT_ID = "a9bd9c02-92e7-4e69-9552-5366b5a3fd2a";
const GET_MESSAGE_THEN_EMAIL_INTENT_ID = "c6bc7a9b-2392-4135-9e75-34e6c865c8ba";

var yesNoIntents = [ 
    DOWNLOAD_RESUME_INTENT_ID, 
    DEFAULT_WELCOME_INTENT_ID, 
    BUSINESS_ASK_VIEW_RESUME_INTENT_ID,
    BUSINESS_SKIP_RESUME_INTENT_ID
 ];

 var endOfConversationIntents = [
    DO_NOTHING_INTENT_ID,
    GET_MESSAGE_THEN_EMAIL_INTENT_ID
 ];

var randomSessionId = Math.floor(Math.random()*90000) + 10000;
var corsProxy = "https://cors.io/?"; //cors issue on github
var isServerAwake = 1;

$(document).ready( function () {
    $(document).on("keypress", "#input-msg", function(e) {
        if (e.which == 13 && !$("#sendButton").is(":disabled")) {
            sendTextMessage();
        }
    });
    sendAjaxRequestToAI("Wake up", function(){
        var preLoader = document.getElementById("pre-loader");
        document.body.removeChild(preLoader);
    });
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

function sendAjaxRequestToAI(msg, wakeUp) {
    $.ajax({
        url: corsProxy + "https://gjadimailig-port-service.herokuapp.com/api/talk?sessionId=" + randomSessionId + "&msg=" + msg,
        success: function(data) {
            triggerIntentFunction(JSON.parse(data).result.metadata.intentId, msg);
            setResponse(JSON.parse(data).result.fulfillment.speech);
            wakeUp();
        },
        error: function() {
            setResponse("Unable to communicate with middleware");
            wakeUp();
        }
    });
    disableSendButton();
}

function sendTextMessage() {
    var msg = $('#input-msg').val();
    if( !msg ) 
        return;    
    sendMessage(msg);
}

function sendMessage(msg) {
    appendMessageInChat(msg);
    clearInput();
    sendAjaxRequestToAI(msg, function(){});
}

function setResponse(response) {
    appendMessageInChat(response);
    enableSendButton();
}

function delayAndOpenLink(url, duration) {
    window.setTimeout(function(){
        window.open(url);
    }, duration);
}

function triggerIntentFunction(intentId, msg) {
    displayAppropriateInput(intentId);
    if( intentId === DOWNLOAD_RESUME_INTENT_ID ) {
        delayAndOpenLink("https://docs.google.com/document/d/1RtP_evXTkwmuNrWnG17iixV6CdT48Eq_hd5CtiWsQAc/edit?usp=sharing", 1000);
    } else if ( intentId === GET_IN_TOUCH_INTENT_ID && msg == "Yes") {
        alert("Project page is still on-going.");
    } else {
        // do nothing
    }
}

function displayAppropriateInput(intentId) {
    $(".input-group").empty();
    if (isInArray(intentId, yesNoIntents)) {
        $(".input-group").append('<div class="row">');
        $(".input-group").append('<div class="col-md-6"></div>');
        $(".input-group").append('<div class="col-md-6 text-right">' 
            + '<button class="btn btn-default" type="button" onclick="sendMessage(\'Yes\');">[ Yes ]</button>' 
            + '<button class="btn btn-default" type="button" onclick="sendMessage(\'No\');">[ No ]</button>' 
            + '</div>');
        $(".input-group").append('</div>');
    } else if(intentId === GET_IN_TOUCH_INTENT_ID) {
        $(".input-group").append('<div class="row">');
        $(".input-group").append('<div class="col-md-4"></div>');
        $(".input-group").append('<div class="col-md-4 text-center">' 
            + '<button class="btn btn-default" type="button" onclick="sendMessage(\'Contact me\');">[ Contact me ]</button>' 
            + '<button class="btn btn-default" type="button" onclick="sendMessage(\'Leave a message\');">[ Leave a message ]</button>' 
            + '<button class="btn btn-default" type="button" onclick="sendMessage(\'No thanks\');">[ No thanks ]</button>' 
            + '</div>');
        $(".input-group").append('<div class="col-md-4"></div>');
        $(".input-group").append('</div>');
    } else if(isInArray(intentId, endOfConversationIntents)) {
        $(".input-group").append('<div class="row">');
        $(".input-group").append('<div class="col-md-12 text-center">' 
            + '<button class="btn btn-default" type="button" onclick="sendMessage(\'Talk again\');">[ Talk again ]</button>' 
            + '</div>');
        $(".input-group").append('</div>');
    } else {
        $(".input-group").append('<input type="text" id="input-msg" class="form-control" placeholder="Enter message here." autofocus>');    
        $(".input-group").append('<span class="input-group-btn">');
        $(".input-group").append('<button id="sendButton" class="btn btn-default" type="button" onclick="sendTextMessage();">[ Send ]</button>');
        $(".input-group").append('</span>');
        $('#input-msg').focus();
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}