const liv2_rules = (sequelize, DataTypes) => {
  const Liv2Rules = sequelize.define(
    'liv2_rules',
    {
      user_to_policy_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'liv2_rules',
      timestamps: false,
    },
  );

  Liv2Rules.associate = (models) => {
    Liv2Rules.hasMany(models.Liv2UsersToPolicies, {
      foreignKey: 'rule_id',
    });
  };

  return Liv2Rules;
};

export default liv2_rules;
