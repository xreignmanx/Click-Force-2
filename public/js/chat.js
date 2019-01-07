//Make the actual connection here, and in the index, we already have the library loaded;
var socket = io.connect("http://localhost:8080" || "http://localhost:"+ process.env.PORT);

function updateTime() { //for the websites timer
    $("#timer").html(moment().format('MMMM Do YYYY, h:mm:ss a'));
}

//Query Dom-------------------------------------------
var message = document.getElementById("message");
var usermessage = $("#message");
// var handle = document.getElementById('handle'); //not necessary, the user's login is their handle
var username = document.getElementsByClassName('member-name');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

//----------------------------------------------------

$(document).on("ready", function () {
    //console.log(username);    
    
    setInterval(updateTime, 1000);
    //emit events
    //so check this out
    //basically this sets a listener on the object btn which we previously defined
    //this listener waits for the click on the "btn" , and then calls a function which
    //handles a socket function called emit. socket.emit takes 2 variable, What the object is(the name), and the information contained within that object
    //which we will define.

    // $(btn).on('click', function(){
    //     $('#message').html("")
    // })

    btn.addEventListener('click', function () {
        
        socket.emit('chat', {
            message: message.value,
            handle: username[0].innerHTML,
        });

        usermessage.val("");
        
    })

    message.addEventListener('keypress', function () {
        socket.emit('typing', username[0].innerHTML);
    })
    //output.innerHTML += "<p><strong>" + data.handle + ": </strong>" + data.message + "<p>"
    //now listening for events, basically receiving the data from the server to client
    //and this is how I will have it displayed, to the element with an ID of 'output'

    socket.on('chat', function (data) {
        $(output).append($("<p>").html("<strong>" + data.handle + ": </strong>" + data.message));
        console.log(data);
    })


    socket.on('typing', function (data) {
        $(feedback).html("<p><em>" + data + " is typing a message...</em></p>");
        //It creates a method to show other users whos typing
        socket.on('chat', function (data) {
            $(feedback).html("");
            $(message).val("")
        }); //the purpose of this is only to clear it
    })

})

//Upon logging in, I want the login to request a specific name from the database if the email and password are in the same row or match the same id.
//The server would then have to return that and rather than posting that socket id, the username instead, and that would include that same name being used for that little chat, rahter than entering a your handle every single time
//Login for request on html