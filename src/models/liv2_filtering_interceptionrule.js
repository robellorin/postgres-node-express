const liv2_filtering_interceptionrule = (sequelize, DataTypes) => {
  const Liv2FilteringInterception = sequelize.define(
    'liv2_filtering_interceptionrule ',
    {
      irule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      source: {
        type: DataTypes.STRING,
      },
      sport: {
        type: DataTypes.STRING,
      },
      destination: {
        type: DataTypes.STRING,
      },
      dport: {
        type: DataTypes.STRING,
      },
      protocols: {
        type: DataTypes.STRING,
      },
      action: {
        type: DataTypes.STRING,
      },
      comments: {
        type: DataTypes.STRING,
      },
      weight: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'liv2_filtering_interceptionrule',
      timestamps: false,
    },
  );

  Liv2FilteringInterception.associate = (models) => {};

  return Liv2FilteringInterception;
};

export default liv2_filtering_interceptionrule;
