

module.exports = function(sequelize, DataTypes) {
  var Player = sequelize.define("Player", {
    //playerID will be generated automatically by Sequelize
    playerName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    checkedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    commander: {
      type: DataTypes.INTEGER,
    },
    assignedTable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  Player.associate = function(models) {
    // We're saying that a Player should belong to a League
    // A Player can't be created without a League due to the foreign key constraint
    Player.belongsTo(models.League, {
      foreignKey: {
        allowNull: false
      },
      // Adam added following line to get around index.js error in order of processing of .js files
      // onDelete: "cascade"
    });
  };

  return Player;
};
