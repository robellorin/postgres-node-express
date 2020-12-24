const liv2_filter_addomains_list = (sequelize, DataTypes) => {
  const Liv2FilterAdDomainsList = sequelize.define(
    'AdDomainsList',
    {
      addomain_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      group_id: {
        type: DataTypes.INTEGER,
      },
      addomain_oldname: {
        type: DataTypes.TEXT,
      },
      addomain_domain: {
        type: DataTypes.TEXT,
      },
      addomain_addr: {
        type: DataTypes.INET,
      },
      addomain_host: {
        type: DataTypes.TEXT,
      },
      addomain_port: {
        type: DataTypes.INTEGER,
      },
      addomain_port_ssl: {
        type: DataTypes.INTEGER,
      },
      addomain_bind_dn: {
        type: DataTypes.TEXT,
      },
      addomain_bind_pw: {
        type: DataTypes.TEXT,
      },
      addomain_admin_user: {
        type: DataTypes.TEXT,
      },
      addomain_admin_pass: {
        type: DataTypes.TEXT,
      },
      addomain_refresh_interval: {
        type: DataTypes.INTEGER,
      },
      addomain_ntlm_dc_list: {
        type: DataTypes.TEXT,
      },
      addomain_login_ignore_list: {
        type: DataTypes.TEXT,
      }
    },
    {
      tableName: 'liv2_filter_addomains_list',
      timestamps: false,
    },
  );

  return Liv2FilterAdDomainsList;
};

export default liv2_filter_addomains_list;
