const express = require("express");
const router = express.Router();
const { dbConnection } = require("../../config");

const User = require("../../models/User");

router.get("/", async (req, res, next) => {
  try {
    let db = await dbConnection(req, res);
    if (!db || !db.success) return res.status(401).json(db);
    let userModel = User(db.connection);

    userModel.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
    
  } catch (error) {
    console.log(error)  
  }
});

module.exports = router;
