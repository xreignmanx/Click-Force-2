//Make the actual connection here, and in the index, we already have the library loaded;
var socket = io.connect("http://localhost:8080" || process.env.PORT);

 //Query Dom
 var message = document.getElementById("group-chat");
 var handle = document.getElementById('handle');
 var btn = document.getElementById('send');
 var output = document.getElementById('output');
 var personalHandle = socket.id;
 //----------------------------------------------------

$(document).on("ready", function(){
   //emit events
   //so check this out
   //basically this sets a listener on the object btn which we previously defined
   //this listener waits for the click, and then calls a function which
   //handles a socket function called emit. socket.emit takes 2 variable, What the object is(the name), and the information contained within that object
   //which we will define.
   btn.addEventListener('click', function(){
       socket.emit('chat', {
           message: message.value,
           handle: personalHandle || handle.value
       })
   })

   //now listening for events
   socket.on('chat', function(data) {
       output.innerHTML += "<p><strong>" + data.handle + "</strong>" + data.message + "<p>"
   })
})