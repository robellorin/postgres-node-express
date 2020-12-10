const { Sequelize } = require("sequelize");
const dbaccess = require("./dbaccess");

const db = async (ip, token) => {
  try {
    // const dbaccessResult = await dbaccess(ip, token);
    // if (!dbaccessResult || !dbaccessResult.db_user) return false;

    // const dbCred = {
    //   database: dbaccessResult.db_name,
    //   username: dbaccessResult.db_user,
    //   password: dbaccessResult.db_pass,
    //   port: dbaccessResult.db_port
    // }

    const dbCred = {
      database: "blzsmbxf",
      username: "blzsmbxf",
      password: "k_X_nbcV7kiPsQ0d7i1fRBYUPVKmecAg",
      port: 5432,
    };

    const { database, username, password, port } = dbCred;

    const sequelize = new Sequelize(database, username, password, {
      host: "suleiman.db.elephantsql.com",
      // host: ip,
      port: port,
      dialect: "postgres",
      pool: {
        max: 3,
        min: 0,
        acquire: 100,
        idle: 100,
      },
    });
    return sequelize;
  } catch (error) {
    console.log(error);
  }
  return null;
};

const connection = async (req) => {
  try {
    const { pghost, authorization } = req.headers;
    if (!pghost) return { success: false, msg: "DB connection failed" };
    let database = await db(pghost, authorization);
    if (!database) return { success: false, msg: "DB connection failed" };
    return { success: true, connection: database };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sequelize: db,
  dbConnection: connection,
  Sequelize,
};
