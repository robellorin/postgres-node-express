const { Sequelize, DataTypes, Model } = require("sequelize");

const InterceptionRules = (connection) => {
  return connection.define(
    "InterceptionRules",
    {
      irule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "liv2_filtering_interceptionrule",
      timestamps: false,
    }
  );
};
module.exports = InterceptionRules;

