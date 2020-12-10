const { Sequelize, DataTypes, Model } = require("sequelize");

const Iprangelist = (connection) => {
  return connection.define(
    "Iprangelist",
    {
      iprange_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      iprange_start_ip: {
        type: DataTypes.INET,
      },
      iprange_end_ip: {
        type: DataTypes.INET,
      },
      iprange_as_string: {
        type: DataTypes.STRING,
      },
      iprange_cidr: {
        type: DataTypes.SMALLINT,
      },
    },
    {
      tableName: "liv2_filter_ipranges_list",
      timestamps: false,
      // associate: function (models) {
      //   Iprangelist.belongsToMany(models.Filter_inet, {
      //     foreignKey: "iprange_id",
      //   });
      // },
    }
  );
};
module.exports = Iprangelist;
