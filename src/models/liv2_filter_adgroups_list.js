const liv2_filter_adgroups_list = (sequelize, DataTypes) => {
  const Liv2FilterAdgroupsList = sequelize.define(
    'AdgroupsList',
    {
      adgroup_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      addomain_id: {
        type: DataTypes.INTEGER,
      },
      group_id: {
        type: DataTypes.INTEGER,
      },
      adgroup_name: {
        type: DataTypes.TEXT,
      },
      adgroup_uuid: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'liv2_filter_adgroups_list',
      timestamps: false,
    },
  );

  Liv2FilterAdgroupsList.associate = (models) => {
    Liv2FilterAdgroupsList.belongsToMany(models.Liv2FilterAdUsersList, {
      through: models.Liv2FilterAdusersToAdgroups,
      foreignKey: 'aduser_id',
    });
    Liv2FilterAdgroupsList.belongsTo(models.Liv2Users, {
      foreignKey: 'user_id'
    });
  };

  return Liv2FilterAdgroupsList;
};

export default liv2_filter_adgroups_list;
