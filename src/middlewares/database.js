import { response } from 'express';
import connectDb from '../models';
import dbaccess from '../services/dbaccess';

export default async (req, res, next) => {
  try {
    const { livserver, authorization } = req.headers;

    if (!livserver)
      return res
        .status(500)
        .json({ success: false, msg: 'LivServer is missing' });

    const dbaccessResult = await dbaccess(livserver, authorization);
    if (!dbaccessResult || !dbaccessResult.db_user)
      return res
        .status(500)
        .json({ success: false, msg: 'Auth Failed' });

    const dbCred = {
      database: dbaccessResult.db_name,
      username: dbaccessResult.db_user,
      password: dbaccessResult.db_pass,
      port: dbaccessResult.db_port,
      ip: livserver,
    };

    // const dbCred = {
    //   database: 'livigent',
    //   username: 'postgres',
    //   password: '',
    //   port: 5432,
    // };
    const config = await connectDb(dbCred);
    req.models = config.models;
    req.sequelize = config.sequelize;
    next();
    // config.sequelize
    //   .sync({ force: eraseDatabaseOnSync })
    //   .then(async () => {
    //     req.models = config.models;
    //     req.sequelize = config.sequelize;
    //     console.log('Database connected');
    //     next();
    //   })
    //   .catch((err) => {
    //     console.log('Database connection failed: ', err);
    //     return res
    //       .status(500)
    //       .json({ success: false, msg: 'DB connection failed' });
    //   });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: 'DB connection failed 1' });
  }
};
