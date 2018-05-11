var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
// var isSignupAuthenticated = require("../config/middleware/isSignupAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the "initial" page
    if (req.user) {
      res.redirect("/setup");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the "initial" page
    // if (req.user) {
    //   res.redirect("/setup");
    // }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the createleague page
    if (req.user) {
      res.redirect("/create");
    }
    // res.sendFile(path.join(__dirname, "../public/signup.html"));
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/setup", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/setup.html"));
  });

  app.get("/create", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/create.html"));
  });

  app.get("/game", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/game.html"));
  });

};
