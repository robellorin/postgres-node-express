const liv2_rules_to_urlpattern = (sequelize, DataTypes) => {
  const Liv2RulesToUrlPattern = sequelize.define(
    'RulesToUrlPattern',
    {
      rules_to_urlpattern_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rule_id: {
        type: DataTypes.INTEGER,
      },
      urlpattern_list_id: {
        type: DataTypes.INTEGER,
      },
      order: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'liv2_rules_to_urlpattern',
      timestamps: false,
    },
  );

  Liv2RulesToUrlPattern.associate = (models) => {
    Liv2RulesToUrlPattern.belongsTo(models.Liv2Rules, {
      foreignKey: 'rule_id',
    });
    Liv2RulesToUrlPattern.belongsTo(models.Liv2RulesUrlPatternList, {
      foreignKey: 'urlpattern_list_id',
    });
  };

  return Liv2RulesToUrlPattern;
};

export default liv2_rules_to_urlpattern;
