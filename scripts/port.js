$(document).ready( function () {
    scrollMessagesToBottom();
});

function sendMessage() {
    var msg = $('#input-msg').val();
    if( !msg ) {
        return;    
    }
    $("#messages-container").append('<div class=\"p-2\" >> '+ msg +'</div>');
    scrollMessagesToBottom();
    $('#input-msg').val("")
}

function scrollMessagesToBottom() {
    var objDiv = document.getElementById("messages-container");
    objDiv.scrollTop = objDiv.scrollHeight;
}

