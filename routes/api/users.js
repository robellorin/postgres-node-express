const express = require("express");
const router = express.Router();
const { dbConnection } = require("../../config");

const User = require("../../models/User");

router.put("/:id", async (req, res, next) => {
  try {
    let db = await dbConnection(req, res);
    if (!db || !db.success) return res.status(401).json(db);
    let userModel = User(db.connection);
    let isExisting = false;

    await userModel
      .findOne({
        where: {
          user_id: req.params.id,
        },
      })
      .then((data) => {
        if (data) {
          isExisting = true;
        } else {
          isExisting = false;
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
            err.message || `Some error occurred while creating the record.`,
        });
      });

    if (!isExisting) {
      res.status(500).send({
        message: `Could not find the record to update.`,
      });
      return;
    }

    const data = req.body;
    userModel
      .update(data, {
        where: { user_id: req.params.id },
      })
      .then(() => {
        res.send({
          message: `Successfully updated!`,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
            err.message || `Some error occurred while updating the record.`,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
    });
  }
});

router.get("/", async (req, res, next) => {
  try {
    let db = await dbConnection(req, res);
    if (!db || !db.success) return res.status(401).json(db);
    let userModel = User(db.connection);
    const condition = req.body.query;
    let findRec = {};
    findRec = { where: condition };

    const { orderby, order } = req.query; // ?orderby=user&order=asc

    if (orderby && order) {
      findRec.order = [orderby, order];
    }

    await userModel
      .findAll({ ...findRec })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error,
    });
  }
});

module.exports = router;
