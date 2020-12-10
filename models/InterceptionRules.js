const { Sequelize, DataTypes, Model } = require("sequelize");

const InterceptionRules = (connection) => {
  return connection.define(
    "InterceptionRule",
    {
      irule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      source: {
        type: DataTypes.STRING,
      },
      sport: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      dport: {
        type: DataTypes.STRING,
      },
      protocols: {
        type: DataTypes.STRING,
      },
      action: {
        type: DataTypes.STRING,
      },
      comments: {
        type: DataTypes.STRING,
      },
      weight: {
        type: DataTypes.INTEGER,
      }
    },
    {
      tableName: "liv2_filtering_interceptionrule",
      timestamps: false,
    }
  );
};
module.exports = InterceptionRules;

