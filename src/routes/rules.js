import { Router } from 'express';
const { Op } = require('sequelize');

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

export default router;
