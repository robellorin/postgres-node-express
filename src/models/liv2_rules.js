const liv2_rules = (sequelize, DataTypes) => {
  const Liv2Rules = sequelize.define(
    'Rules',
    {
      rule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rule_label: {
        type: DataTypes.STRING,
      },
      rule_type: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'liv2_rules',
      timestamps: false,
    },
  );

  Liv2Rules.associate = (models) => {
    Liv2Rules.belongsToMany(models.Liv2RulesUrlPatternList, {
      through: models.Liv2RulesToUrlPattern,
      foreignKey: 'rule_id',
    });
  };

  return Liv2Rules;
};

export default liv2_rules;
