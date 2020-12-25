import Sequelize from 'sequelize';

const connectDB = (config) => {
  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.ip || "127.0.0.1",
      port: config.port,
      dialect: 'postgres',
      pool: {
        max: 1,
        min: 0,
        idle: 200000,
        acquire: 1000000,
      },
    },
  );
  const models = {
    Liv2Users: sequelize.import('./liv2_users'),
    Liv2FilterInet: sequelize.import('./liv2_filter_inet'),
    Liv2FilterIprangesList: sequelize.import(
      './liv2_filter_ipranges_list',
    ),
    Liv2FilteringInterception: sequelize.import(
      './liv2_filtering_interceptionrule',
    ),
    Liv2FilterAdusersIplist: sequelize.import(
      './liv2_filter_adusers_iplist',
    ),
    Liv2UserInGroups: sequelize.import('./liv2_user_in_groups'),
    Liv2FilterAdUsersList: sequelize.import(
      './liv2_filter_adusers_list',
    ),
    Liv2UsersToPolicies: sequelize.import('./liv2_users_to_policies'),
    Liv2Rules: sequelize.import('./liv2_rules'),
    Liv2RulesToUrlPattern: sequelize.import('./liv2_rules_to_urlpattern'),
    Liv2RulesUrlPatternList: sequelize.import('./liv2_rules_urlpattern_list'),
    Liv2FilterAduser: sequelize.import('./liv2_filter_aduser'),
    Liv2FilterAdusersToAdgroups: sequelize.import(
      './liv2_filter_adusers_to_adgroups',
    ),
    Liv2FilterAdgroupsList: sequelize.import(
      './liv2_filter_adgroups_list',
    ),
    Liv2FilterAdDomainsList: sequelize.import(
      './liv2_filter_addomains_list',
    ),
  };

  Object.keys(models).forEach((key) => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });

  return {
    sequelize,
    models,
  };
};

export default connectDB;
