const { Sequelize, DataTypes, Model } = require("sequelize");

const User = (connection) => {
  return connection.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_label: {
        type: DataTypes.STRING,
      },
      user_comments: {
        type: DataTypes.STRING,
      },
      is_group: {
        type: DataTypes.BOOLEAN,
      },
      disable_logging: {
        type: DataTypes.BOOLEAN,
      },
      user_version: {
        type: DataTypes.BIGINT,
      },
    },
    {
      tableName: "liv2_users",
      timestamps: false,
    }
  );
};
module.exports = User;
