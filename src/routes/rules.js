import { Router } from 'express';
const { endsWith } = require('mout/string');
const { Op } = require('sequelize');
const httpHeader = 'http://';
const phpApiPort = '4540';
const axios = require('axios');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const condition = req.body.query;
    const interceptionRules = await req.models.Liv2Rules.findAll(
      {
        include: {
          model: req.models.Liv2RulesUrlPatternList,
          required: true,
          through: { attributes: [] }
        },
        where: condition,
      },
    );
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send(interceptionRules);
  } catch (error) {
    console.log(error);
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    res.status(500).send({
      message: error.toString(),
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const interceptionRules = await req.models.Liv2Rules.findAll(
      {
        where: {
          rule_id: id,
        },
      },
    );
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send(interceptionRules);
  } catch (error) {
    console.log(error);
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    res.status(500).send({
      message: error.toString(),
    });
  }
});

router.put('/', async (req, res) => {
  try {
    const { livserver, authorization } = req.headers;
    let formatedIP = livserver;
    let token = authorization

    if (!(endsWith(formatedIP, '/') && !endsWith(formatedIP, '\\'))) {
      formatedIP = formatedIP + `:${phpApiPort}/`;
    }
    axios.defaults.headers.common.Authorization = token;
    const result = await axios.put(
      `${httpHeader}${formatedIP}urlpatterns.php`,
      req.body
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
