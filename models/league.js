

module.exports = function(sequelize, DataTypes) {
  var League = sequelize.define("League", {
    leagueName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // leaguePoints: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    //
    // leagueStanding: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // }

    // leagueCurrentGames: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // }

    // timestamps: false

  });

  League.associate = function(models) {
    // We're saying that a League should belong to an User(Admin).
    // A League can't be created without a User(Admin) due to the foreign key constraint
    League.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  League.associate = function(models) {
    // Associating League with Player
    // When a League is deleted, also delete any associated Player
    League.hasMany(models.Player, {
      onDelete: "cascade"
    });
  };

  return League;
};
