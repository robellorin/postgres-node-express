const liv2_filter_adusers_to_adgroups = (sequelize, DataTypes) => {
  const Liv2FilterAdusersToAdgroups = sequelize.define(
    'liv2_filter_adusers_to_adgroups',
    {
      aduser_to_adgroup_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'liv2_filter_adusers_to_adgroups',
      timestamps: false,
    },
  );

  Liv2FilterAdusersToAdgroups.associate = (models) => {
    Liv2FilterAdusersToAdgroups.belongsTo(
      models.Liv2FilterAdUsersList,
      {
        foreignKey: 'aduser_id',
      },
    );
    Liv2FilterAdusersToAdgroups.belongsTo(
      models.Liv2FilterAdgroupsList,
      {
        foreignKey: 'adgroup_id',
      },
    );
  };

  return Liv2FilterAdusersToAdgroups;
};

export default liv2_filter_adusers_to_adgroups;
