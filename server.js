// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");

//requiring socket after npm installation;
var socket = require('socket.io');

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");


// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  //Necessary for the Socket.IO functionality:
  var server = app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });

  //initalizing the usage of Socket! 
  var io = socket(server);

  //listens for an event called connection which informs user when a connection is made, and callback a function thereafter
  io.on('connection', function(socket) {
    console.log("made socket connection: " + socket.id);

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected.`);
    });

    socket.on('typing', function(data){ //this is to let everyone know whos typing
      socket.broadcast.emit('typing', data) //this emits the person whos typing to everyone BUT the person whos actually typing
    });

    //this portion is receiving the socket data sent on the frontend (asking for the 'chat' object) and firing a function with the data is has as a parameter
    socket.on('chat', function(data){
      //you do io.sockets and not socket because it is referring to ALL connections. not just that single one connection.
      io.sockets.emit('chat', data);
      console.log(data.handle + " said: "+ data.message);

    });
  }); //still requires socket.io on the frontend

  
});

/** Just in case I can actually get this far in this
 * app.post('/contact',(req,res)=>{
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'user@gmail.com',
        password: 'password'
    }
});
var mailOptions = {
    from: req.body.name + '&lt;' + req.body.email + '&gt;',
    to: 'bantspl@gmail.com',
    subject: 'Plbants Feedback',
    text: req.body.feedback 
};
transporter.sendMail(mailOptions,(err,res)=>{
    if(err){
        console.log(err);
    }
    else {

    }
});
 */
