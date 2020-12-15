const liv2_filter_ipranges_list = (sequelize, DataTypes) => {
  const Liv2FilterIprangesList = sequelize.define(
    'liv2_filter_ipranges_list',
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
      tableName: 'liv2_filter_ipranges_list',
      timestamps: false,
    },
  );

  Liv2FilterIprangesList.associate = (models) => {
    Liv2FilterIprangesList.belongsToMany(models.Liv2Users, {
      through: models.Liv2FilterInet,
      foreignKey: 'iprange_id',
    });
  };

  return Liv2FilterIprangesList;
};

export default liv2_filter_ipranges_list;
