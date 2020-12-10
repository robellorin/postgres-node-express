const express = require("express");
const sequelize = require("sequelize");
const router = express.Router();
const { dbConnection } = require("../../config");
const Op = sequelize.Op;

const InterceptionRules = require("../../models/InterceptionRules");

router.get("/", async (req, res, next) => {
  try {
    const condition = req.body.query;
    let db = await dbConnection(req, res);
    if (!db || !db.success) return res.status(401).json(db);
    let InterceptionRulesModel = InterceptionRules(db.connection);

    InterceptionRulesModel.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const insertData = req.body;
    let db = await dbConnection(req, res);
    if (!db || !db.success) return res.status(401).json(db);
    let InterceptionRulesModel = InterceptionRules(db.connection);
    let maxWeight = null;

    // find the max weight
    await InterceptionRulesModel.max('weight')
      .then((max) => {
        maxWeight = max || 0
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message:
            err.message || `Some error occurred while creating the record.`
        });
      });
    insertData.weight = maxWeight + 1;

    InterceptionRulesModel.create(insertData)
    .then(() => {
      res.send({
        message: `Successfully created!`
      });
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || `Some error occurred while creating the record.`
      });
    });
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error
    });
  }
});

router.put("/:id", async (req, res, next) => {
  try {

    if (!req.params.id) {
      res.status(500).send({
        message: `Could not find the record to update.`
      });
      return;
    }

    const updateData = req.body;
    let db = await dbConnection(req, res);
    if (!db || !db.success) return res.status(401).json(db);
    let InterceptionRulesModel = InterceptionRules(db.connection);
    let curWeight = null;
    let isExisting = false;

    await InterceptionRulesModel.findOne(
      {
        where: {
          irule_id: req.params.id
        },
        attributes: ['weight']
      })
      .then((data) => {
        if (data) {
          isExisting = true;
          curWeight = data.weight;
        } else {
          isExisting = false;
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message:
            err.message || `Some error occurred while creating the record.`
        });
      });

    if (!isExisting) {
      res.status(500).send({
        message: `Could not find the record to update.`
      });
      return;
    }

    if (curWeight) {
      // if weight is going forward
      if (curWeight > updateData.weight) {
        InterceptionRulesModel.increment(
          { weight: +1 },
          {
            where: { 
              weight: {
                [Op.lt]: curWeight,
                [Op.gte]: updateData.weight
              }
            }
          }
        );
      } else if (curWeight < updateData.weight) { // if weight is going backward
        InterceptionRulesModel.increment(
          { weight: -1 },
          {
            where: { 
              weight: {
                [Op.lte]: updateData.weight,
                [Op.gt]: curWeight
              }
            }
          }
        );
      }
    }

    InterceptionRulesModel.update(updateData,
      {
        where: { irule_id: req.params.id }
      })
      .then(() => {
        res.send({
          message: `Successfully updated!`
        });
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message:
            err.message || `Some error occurred while updating the record.`
        });
      });
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error
    });
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const condition = req.body.query;
    let db = await dbConnection(req, res);
    if (!db || !db.success) return res.status(401).json(db);
    let InterceptionRulesModel = InterceptionRules(db.connection);

    InterceptionRulesModel.destroy({ where: condition })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: `Successfully deleted!`
        });
      } else {
        res.send({
          message: `No records deleted!`
        });
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || `Some error occurred while deleting the record.`
      });
    });
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {

    if (!req.params.id) {
      res.status(500).send({
        message: `Could not find the record to delete.`
      });
      return;
    }

    let db = await dbConnection(req, res);
    if (!db || !db.success) return res.status(401).json(db);
    let InterceptionRulesModel = InterceptionRules(db.connection);

    InterceptionRulesModel.destroy({ where: {irule_id: req.params.id} })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: `Successfully deleted!`
        });
      } else {
        res.send({
          message: `No records deleted!`
        });
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || `Some error occurred while deleting the record.`
      });
    });
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error
    });
  }
});

module.exports = router;
