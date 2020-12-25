const liv2_rules_urlpattern_list = (sequelize, DataTypes) => {
  const Liv2RulesUrlPatternList = sequelize.define(
    'RulesUrlPatternList',
    {
      urlpattern_list_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      urlpattern_list_text: {
        type: DataTypes.STRING,
      }
    },
    {
      tableName: 'liv2_rules_urlpattern_list',
      timestamps: false,
    },
  );

  Liv2RulesUrlPatternList.associate = (models) => {
    Liv2RulesUrlPatternList.belongsToMany(models.Liv2Rules, {
      through: models.Liv2RulesToUrlPattern,
      foreignKey: 'urlpattern_list_id',
    });
  };

  return Liv2RulesUrlPatternList;
};

export default liv2_rules_urlpattern_list;
