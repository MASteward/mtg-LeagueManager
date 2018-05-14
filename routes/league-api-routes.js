var db = require("../models");

module.exports = function(app) {

  app.get("/api/league/:userId", function(req, res) {
    db.League.findOne(req.body, {
      where: {
        UserId: req.params.userId
      }
    }).then(function(dbLeague) {
      res.json(dbLeague);
    });
  });

  // POST route for saving a new league
  app.post("/api/league", function(req, res) {
    db.League.create({
      leagueName: req.body.leagueName,
      UserId: req.body.UserId
    }).then(function(dbLeague) {
      console.log("League Added in Database");
      res.json(dbLeague);
    });
  });

  app.put("/api/league", function(req, res) {
    db.League.update(req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbLeague) {
        res.json(dbLeague);
      });
  });

  app.get("/api/league_info/", function(req, res) {
    db.League.find({
      where: {
        UserId: req.user.id
      },
      include:[db.Player]
    }).then(function(dbLeague) {
      console.log("you got a league");
      res.json(dbLeague);
    });
  });

  app.get("/api/league_data", function(req, res) {
  // The user is not logged in, send back an empty object
    if (!req.user) {
      console.log("nothing!", req);
      res.json({});
    }
    // Otherwise send back the user's email and id (no password!)
    else {
      res.redirect(307, "/api/league_info/");
    }
  });

}
