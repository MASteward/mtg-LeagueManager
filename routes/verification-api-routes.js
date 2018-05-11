// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {

  // They won't get this or even be able to access this page if they aren't authed
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
  // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    res.json("/setup");
  });


  //copy of above function for parallel authentication handling code
  app.post("/api/newUser", passport.authenticate("local"), function(req, res) {
    console.log("newUser");
    res.json("/create");
  });

  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      console.log("loading the createleague page now");
      res.redirect(307, "/api/newUser");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
  // The user is not logged in, send back an empty object
    if (!req.user) {
      console.log("nothing!", req);
      res.json({});
    }
    // Otherwise send back the user's email and id (no password!)
    else {
      console.log("something");
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

};
