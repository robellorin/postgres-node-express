const liv2_filter_inet = (sequelize, DataTypes) => {
  const Liv2FilterInet = sequelize.define(
    'liv2_filter_inet',
    {
      inet_filter_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'liv2_filter_inet',
      timestamps: false,
    },
  );

  Liv2FilterInet.associate = (models) => {
    Liv2FilterInet.belongsTo(models.Liv2Users, {
      foreignKey: 'user_id',
    });
    Liv2FilterInet.belongsTo(models.Liv2FilterIprangesList, {
      foreignKey: 'iprange_id',
    });
  };

  return Liv2FilterInet;
};

export default liv2_filter_inet;
