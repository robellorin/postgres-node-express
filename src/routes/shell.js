import { Router } from 'express';
const axios = require('axios');
const { endsWith } = require('mout/string');
const httpHeader = 'http://';
const phpApiPort = '4540';

const router = Router();
router.get('/', async (req, res) => {
  try {
    const { pghost, authorization } = req.headers;
    let formatedIP = pghost;
    let token = authorization

    if (!(endsWith(formatedIP, '/') && !endsWith(formatedIP, '\\'))) {
      formatedIP = formatedIP + `:${phpApiPort}/`;
    }
    axios.defaults.headers.common.Authorization = token;
    const result = await axios.get(
      `${httpHeader}${formatedIP}run_shell.php`,
    );
    if (result) {
      return res.send({
        data: result.data,
      });
    } else {
      return res.status(500).json({
        data: result.data,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
    return null;
  }
});

export default router;
