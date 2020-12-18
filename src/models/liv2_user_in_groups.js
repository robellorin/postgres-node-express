const liv2_user_in_groups = (sequelize, DataTypes) => {
  const Liv2UserInGroups = sequelize.define(
    'UserInGroups',
    {
      user_in_group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      in_group_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'liv2_user_in_groups',
      timestamps: false,
    },
  );

  Liv2UserInGroups.associate = (models) => {
    Liv2UserInGroups.belongsTo(models.Liv2Users, {
      foreignKey: 'user_id',
    });
  };

  return Liv2UserInGroups;
};

export default liv2_user_in_groups;
