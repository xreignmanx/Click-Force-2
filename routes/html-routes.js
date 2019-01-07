// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page

    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

<<<<<<< HEAD
  app.get("/verify", function(req, res) {
    
    if (req.user) {
      res.redirect("/members");
    }

    res.sendFile(path.join(__dirname, "../public/verify.html"));

  })

  app.get("/login", function(req, res) {
=======
  app.get("/signup", function(req, res) {
>>>>>>> master
    // If the user already has an account send them to the members page

    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  app.get("/playGame", isAuthenticated, function(req, res) {
    if (req.user) {
      res.sendFile(path.join(__dirname, "../public/Builds/index.html"));
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

};
