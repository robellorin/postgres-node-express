import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
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
});

router.post('/', async (req, res) => {
  try {
    const insertData = req.body;

    let maxWeight = null;

    // find the max weight
    const max = await req.models.Liv2FilteringInterception.max(
      'weight',
    );

    maxWeight = max || 0;

    insertData.weight = maxWeight + 1;

    await req.models.Liv2FilteringInterception.create(insertData);
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
      message: `Successfully created!`,
    });
  } catch (error) {
    console.log(error);
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    res.status(500).send({
      message: error,
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
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

    if (curWeight) {
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

    await req.models.Liv2FilteringInterception.update(updateData, {
      where: { irule_id: req.params.id },
    });
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
      message: `Successfully updated!`,
    });
  } catch (error) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(error);
    res.status(500).send({
      message: error,
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
      message: error,
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

    req.models.Liv2FilteringInterception.destroy({
      where: { irule_id: req.params.id },
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
      message: error,
    });
  }
});

export default router;
