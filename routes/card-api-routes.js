var db = require("../models");

module.exports = function(app) {

  app.get("/api/commander", function(req, res) {
    db.Commander.findAll({}).then(function(dbCommander) {
      res.json(dbCommander);
    })
  })

  app.get("/api/supplemental", function(req, res) {
    db.Supplemental.findAll({}).then(function(dbSupplemental) {
      res.json(dbSupplemental);
    })
  });

}
