const liv2_users_to_policies = (sequelize, DataTypes) => {
  const Liv2UsersToPolicies = sequelize.define(
    'liv2_users_to_policies',
    {
      user_to_policy_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'liv2_users_to_policies',
      timestamps: false,
    },
  );

  Liv2UsersToPolicies.associate = (models) => {
    Liv2UsersToPolicies.belongsTo(models.Liv2Users, {
      foreignKey: 'user_id',
    });
    Liv2UsersToPolicies.belongsTo(models.Liv2Rules, {
      foreignKey: 'rule_id',
    });
  };

  return Liv2UsersToPolicies;
};

export default liv2_users_to_policies;
