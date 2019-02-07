var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  }, function (email, password, done) {
    // When a user tries to sign in this code runs
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function (users) {
      // If there's no user with the given email
      if (!users) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      if (!users.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // If none of the above, return the user
      return done(null, users);
    }).catch(err => done(err));
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });
//
// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });

// Exporting our configured passport
module.exports = passport;
