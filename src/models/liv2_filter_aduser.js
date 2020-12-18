const liv2_filter_aduser = (sequelize, DataTypes) => {
  const Liv2FilterAduser = sequelize.define(
    'FilterAduser',
    {
      aduser_filter_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'liv2_filter_aduser',
      timestamps: false,
    },
  );

  Liv2FilterAduser.associate = (models) => {
    Liv2FilterAduser.belongsTo(models.Liv2Users, {
      foreignKey: 'user_id',
    });
    Liv2FilterAduser.belongsTo(models.Liv2FilterAdUsersList, {
      foreignKey: 'aduser_id',
    });
  };

  return Liv2FilterAduser;
};

export default liv2_filter_aduser;
