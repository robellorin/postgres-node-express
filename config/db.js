const { Sequelize } = require("sequelize");
const getToken = require("./getDBToken");
const jwt_decode = require("jwt-decode");

const db = async (ip) => {
  const dbToken = await getToken(ip);

  if (!dbToken) return false;

  const decoded = jwt_decode(dbToken);

  if (!decoded) return false;

  const { username, password, database } = decoded;

  const sequelize = new Sequelize(database, username, password, {
    host: ip,
    dialect: "postgres",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  return sequelize;
};

const connection = async (req) => {
  const { host } = req.headers;

  if (!host) return { success: false, msg: "DB connection failed" };

  let database = await db(host);

  if (!database) return { success: false, msg: "DB connection failed" };

  return { success: true, connection };
};

module.exports = {
  sequelize: db,
  dbConnection: connection,
  Sequelize,
};
