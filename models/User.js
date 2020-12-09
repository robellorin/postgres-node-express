const { Sequelize, DataTypes, Model } = require("sequelize");

const User = (connection) => {
  return connection.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "Employees",
      timestamps: false,
    }
  );
};
module.exports = User;
