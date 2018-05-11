module.exports = function(sequelize, DataTypes) {
  var Supplemental = sequelize.define("Supplemental", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    source: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: false
  });

  return Supplemental;
};
