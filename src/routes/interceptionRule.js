import { Router } from 'express';
const { Op } = require('sequelize');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const condition = req.body.query;
    const interceptionRules = await req.models.Liv2FilteringInterception.findAll(
      {
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
    const interceptionRules = await req.models.Liv2FilteringInterception.findAll(
      {
        where: {
          irule_id: id,
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

router.post('/', async (req, res) => {
  try {
    const insertData = req.body.data;
    if (!insertData.action || insertData.action==='' || !protocols.protocols || insertData.protocols==='') {
      res.status(500).send({
        message: error.toString(),
      });
      return
    }

    delete insertData.irule_id;
    let maxWeight = null;

    // find the max weight
    const max = await req.models.Liv2FilteringInterception.max(
      'weight',
    );

    maxWeight = max || 0;

    let result = null;
    if (Array.isArray(insertData)) {
      insertData.map((data)=>data.weight = ++maxWeight)
      result = await req.models.Liv2FilteringInterception.bulkCreate(insertData, {returning: true});
    } else {
      insertData.weight = ++maxWeight;
      result = await req.models.Liv2FilteringInterception.create(insertData, {returning: true});
      result = JSON.parse(JSON.stringify(result))
    }
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
      data: result,
      message: `Successfully created!`,
    });
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

router.put('/:id', async (req, res) => {
  try {
    const updateData = req.body.data;
    if (updateData.irule_id || updateData.action === '' || updateData.action === null || updateData.protocols === '' || updateData.protocols === null) {
      res.status(500).send({
        message: "it is not allowed to update irule_id, and action and protocols should not be null",
      });
      return
    }
    delete updateData.irule_id;
    if (updateData.action === '') {
      res.status(500).send({
        message: error.toString(),
      });
      return
    }
    if (!req.params.id) {
      return res.status(500).send({
        message: `Could not find the record to update.`,
      });
    }

    let curWeight = null;
    let isExisting = false;

    const data = await req.models.Liv2FilteringInterception.findOne({
      where: {
        irule_id: req.params.id,
      },
      attributes: ['weight'],
    });

    if (data) {
      isExisting = true;
      curWeight = data.weight;
    } else {
      isExisting = false;
    }

    if (!isExisting) {
      return res.status(500).send({
        message: `Could not find the record to update.`,
      });
    }

    if (curWeight && updateData.weight) {
      // if weight is going forward
      if (curWeight > updateData.weight) {
        await req.models.Liv2FilteringInterception.increment(
          { weight: +1 },
          {
            where: {
              weight: {
                [Op.lt]: curWeight,
                [Op.gte]: updateData.weight,
              },
            },
          },
        );
      } else if (curWeight < updateData.weight) {
        // if weight is going backward
        await req.models.Liv2FilteringInterception.increment(
          { weight: -1 },
          {
            where: {
              weight: {
                [Op.lte]: updateData.weight,
                [Op.gt]: curWeight,
              },
            },
          },
        );
      }
    }

    const result = await req.models.Liv2FilteringInterception.update(updateData, {
      where: { irule_id: req.params.id },
      returning: true
    });
    req.sequelize.close().then(() => {
      console.log(result)
      console.log('connection closed');
    });
    return res.send({
      data: result,
      message: `Successfully updated!`,
    });
  } catch (error) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(error);
    res.status(500).send({
      message: error.toString(),
    });
  }
});

router.put('/', async (req, res) => {
  try {
    const query = req.body.query;
    const updateData = req.body.data;
    if (updateData.irule_id || updateData.action === '' || updateData.action === null || updateData.protocols === '' || updateData.protocols === null) {
      res.status(500).send({
        message: "it is not allowed to update irule_id and action and protocols should not be null",
      });
      return
    }
    delete updateData.irule_id;
    if (updateData.weight) {
      return res.status(500).send({
        message: `Please use single update mode to update weight.`,
      });
    }

    const result = await req.models.Liv2FilteringInterception.update(updateData, {
      where: query,
      returning: true
    });
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
      data: result,
      message: `Successfully updated!`,
    });
  } catch (error) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(error);
    res.status(500).send({
      message: error.toString(),
    });
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const condition = req.body.query;

    await req.models.Liv2FilteringInterception.destroy({
      where: condition,
    });
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
      message: `Successfully deleted!`,
    });
  } catch (error) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(error);
    res.status(500).send({
      message: error.toString(),
    });
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(500).send({
        message: `Could not find the record to delete.`,
      });
    }

    const result = await req.models.Liv2FilteringInterception.destroy({
      where: { irule_id: req.params.id },
    });
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
      message: result?`Successfully deleted!`: `The id does not exist.`,
    });
  } catch (error) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(error);
    res.status(500).send({
      message: error.toString(),
    });
  }
});

export default router;
