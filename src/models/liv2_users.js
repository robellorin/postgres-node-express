const liv2_users = (sequelize, DataTypes) => {
  const Liv2Users = sequelize.define(
    'Users',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_label: {
        type: DataTypes.STRING,
      },
      user_comments: {
        type: DataTypes.STRING,
      },
      is_group: {
        type: DataTypes.BOOLEAN,
      },
      disable_logging: {
        type: DataTypes.BOOLEAN,
      },
      user_version: {
        type: DataTypes.BIGINT,
      },
    },
    {
      tableName: 'liv2_users',
      timestamps: false,
    },
  );

  Liv2Users.associate = (models) => {
    Liv2Users.belongsToMany(models.Liv2FilterIprangesList, {
      through: models.Liv2FilterInet,
      foreignKey: 'user_id',
    });

    Liv2Users.hasMany(models.Liv2UserInGroups, {
      foreignKey: 'user_id',
    });
    Liv2Users.hasMany(models.Liv2FilterAdgroupsList, {
      foreignKey: 'group_id',
    });
    Liv2Users.hasMany(models.Liv2UsersToPolicies, {
      foreignKey: 'user_id',
    });
    Liv2Users.belongsToMany(models.Liv2FilterAdUsersList, {
      through: models.Liv2FilterAduser,
      foreignKey: 'user_id',
    });
  };

  // User.findByLogin = async login => {
  //   let user = await User.findOne({
  //     where: { username: login },
  //   });

  //   if (!user) {
  //     user = await User.findOne({
  //       where: { email: login },
  //     });
  //   }

  //   return user;
  // };

  return Liv2Users;
};

export default liv2_users;
