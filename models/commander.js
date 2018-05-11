module.exports = function(sequelize, DataTypes) {
  var Commander = sequelize.define("Commander", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    timestamps: false
  });

  return Commander;
};
