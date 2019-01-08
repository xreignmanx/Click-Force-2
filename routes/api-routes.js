// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
const nodemailer = require('nodemailer');
var user = require("../models/user.js");

var scoreBoard;

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
  });

  app.post("/api/verify", function (req, res, next) {
    //this is where (I THINK) we need to manipulate what ever goes on in the database. the api signup thing creates an account in the database when it is complete,
    // Lets see how this is gonna go.
    const secretToken = req.body.secretToken
  
    db.User.findOne({
      where: { secretToken: secretToken }
    }).then(function (user, err) {
      if (err) throw err;

      if (!user) {
        console.log("There is no user with this information");
         //there should be something to interact with the user telling them that there is no account with this token
      } else {
        
        if (user.authenticated == true) {
          console.log("user is already authenticated, proceed to login");
          //there should be something to interact with the user telling them that their account is already authenticated
        } else {
          console.log("Time to authenticate the user");
          user.update({

            authenticated: true,
            secretToken: 'Complete: ' + user.email

          }).then(function(){

            console.log("update succesful");
            res.json("/")
            // there should be something to interact with the user telling them that their account is now authenticated
          })  
        }
      }
    });

  })

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    console.log("Body Below....");
    console.log(req.body);
    console.log("--------------------------------");
    db.User.create({
      email: req.body.email,
      password: req.body.password
      //you could also create a potential username section if we so choose to add that as a column in the database.
    }).then(function(data) {
      // console.log(data)
      //this function send the user a verification email upon completion of registration
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
          user: 'ucfclickforce@gmail.com',
          pass: '123abcPie'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let HelperOptions = {
        from: "'Click Force' <'ucfclickforce@gmail.com'",
        to: req.body.email,
        subject: "Hello, Welcome to ClickForce",
        text: 'Congratulations on joining this game! Copy this link below and navigate to the verify page to verify your account. Unique Token: ' + data.secretToken 
      };

      transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('The message was sent');
        console.log(info);
      });
    }).then(function () {
      res.json("/verify");
    }).then(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });


  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
  // Route for getting high score data from unity
  app.post("/api/scoreboard", function (req, res) {
    console.log(req.body);
    // req.body.User.Includes()
    db.scoreBoard.create({
      User: req.body.user,
      Score: req.body.score,
      HighScore: req.body.score,
      Gold: req.body.gold,
      TotalGold: req.body.gold,
      UserTime: req.body.time,
      TotalTime: req.body.time,
      Games: 1
    }).then(function (dbSwitch) {

      res.send(dbSwitch);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  app.get("/api/scoreboard", function (req, res) {

    db.scoreBoard.findAll({
      limit: 10}).then(function (results) {
      scoreBoard = Object.assign({}, results);
      res.json(results);
      console.log(scoreBoard);
    });
  })

};
