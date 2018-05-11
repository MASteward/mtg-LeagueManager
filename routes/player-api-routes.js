var db = require("../models");

module.exports = function(app) {


  // app.get("/api/player", function(req, res) {
  //   db.Player.findAll({}).then(function(dbPlayer) {
  //     res.json(dbPlayer);
  //   });
  // });

  app.get("/api/players_data", function(req, res) {
  // The user is not logged in, send back an empty object
    if (!req.user) {
      console.log("nothing!", req);
      res.json({});
    }
    else {
      res.redirect(307, "/api/gamers_info/");
    }
  });

  app.get("/api/gamers_info/", function(req, res) {
    db.League.find({
      where: {
        UserId: req.user.id
      },
      include: [{
        model: db.Player,
        where: {
          checkedIn: true
        }
      }]
    }).then(function(dbLeague) {
      console.log("you got something");
      res.json(dbLeague);
    });
  });


  app.get("/api/gamers/:id", function(req, res) {
    db.Player.findAll({
      where: {
        LeagueId: req.params.id,
        checkedIn: 1
      }
    }).then(function(dbPlayer){
      res.json(dbPlayer);
    })
  });


  // app.get("/api/commander", function(req, res) {
  //   db.Commander.findAll({}).then(function(dbCommander) {
  //     res.json(dbCommander);
  //   })
  // })

  // app.get("/api/player/:leagueId", function(req, res) {
  //   db.Player.findAll(req.body, {
  //     where: {
  //       LeagueId: req.params.leagueId
  //     }
  //   }).then(function(dbPlayer){
  //     res.json(dbPlayer);
  //   })
  // })
  // app.put("/api/gamers", function(req, res) {
  //   db.Player.update({
  //     checkedIn: req.body.checkedIn,
  //     commander: req.body.commander,
  //     where: {
  //       id: req.body.id
  //     }
  //   }).spread(function(affectedCount, affectedRows) {
  //     return db.Player.findAll()
  //   }).then(function(dbPlayers) {
  //     console.log(dbPlayers);
  //   })
  // })

  app.post("/api/player", function(req, res) {
    db.Player.create(req.body).then(function(dbPlayer) {
      res.json(dbPlayer);
    });
  });

  app.put("/api/player", function(req, res) {
    db.Player.update(req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbPlayer) {
        res.json(dbPlayer);
      });
  });

  app.delete("/api/player/:id", function(req, res) {
    db.Player.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPlayer) {
      res.json(dbPlayer);
    });
  });

};
