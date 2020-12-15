const liv2_filter_adusers_iplist = (sequelize, DataTypes) => {
  const Liv2FilterAdusersIplist = sequelize.define(
    'liv2_filter_adusers_iplist',
    {
      aduser_ip_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      aduser_ip: {
        type: DataTypes.INET,
      },
      aduser_ip_lastseen: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'liv2_filter_adusers_iplist',
      timestamps: false,
    },
  );

  Liv2FilterAdusersIplist.associate = (models) => {
    Liv2FilterAdusersIplist.belongsTo(models.Liv2Users, {
      foreignKey: 'aduser_id',
    });
    Liv2FilterAdusersIplist.belongsTo(
      models.Liv2FilterAdusersIplist,
      {
        foreignKey: 'aduser_id',
      },
    );
  };

  return Liv2FilterAdusersIplist;
};

export default liv2_filter_adusers_iplist;
