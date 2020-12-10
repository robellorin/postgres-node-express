const { Sequelize, DataTypes, Model } = require("sequelize");

const Filter_inet = (connection) => {
  return connection.define(
    "Filter_inet",
    {
      inet_filter_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        field: "user_id",
        references: "User",
        referencesKey: "user_id",
      },
      iprange_id: {
        type: DataTypes.INTEGER,
        references: "Iprangelist",
        referencesKey: "iprange_id",
      },
    },
    {
      tableName: "liv2_filter_inet",
      timestamps: false,
      // associate: function (models) {
      // Filter_inet.hasMany(models.User, {
      //   foreignKey: "user_id",
      //   sourceKey: "user_id",
      // });
      // Filter_inet.hasMany(models.Iprangelist, { foreignKey: "iprange_id" });
      // },
    }
  );
};
module.exports = Filter_inet;
