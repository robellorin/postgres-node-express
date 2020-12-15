const liv2_filter_adusers_list = (sequelize, DataTypes) => {
  const Liv2FilterAdUsersList = sequelize.define(
    'liv2_filter_adusers_list',
    {
      aduser_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      addomain_id: {
        type: DataTypes.INTEGER,
      },
      aduser_name: {
        type: DataTypes.TEXT,
      },
      aduser_ip: {
        type: DataTypes.INET,
      },
      aduser_uuid: {
        type: DataTypes.TEXT,
      },
      captive_ip: {
        type: DataTypes.INET,
      },
      captive_expire_ts: {
        type: DataTypes.BIGINT,
      },
      captive_create_ts: {
        type: DataTypes.BIGINT,
      },
    },
    {
      tableName: 'liv2_filter_adusers_list',
      timestamps: false,
    },
  );

  Liv2FilterAdUsersList.associate = (models) => {
    Liv2FilterAdUsersList.belongsToMany(models.Liv2Users, {
      through: models.Liv2FilterAduser,
      foreignKey: 'aduser_id',
    });

    Liv2FilterAdUsersList.belongsToMany(
      models.Liv2FilterAdgroupsList,
      {
        through: models.Liv2FilterAdusersToAdgroups,
        foreignKey: 'aduser_id',
      },
    );

    Liv2FilterAdUsersList.hasMany(models.Liv2FilterAdusersIplist, {
      foreignKey: 'aduser_id',
    });
  };

  return Liv2FilterAdUsersList;
};

export default liv2_filter_adusers_list;
