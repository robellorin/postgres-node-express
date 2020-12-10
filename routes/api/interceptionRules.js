const express = require("express");
const router = express.Router();
const { dbConnection } = require("../../config");

const InterceptionRules = require("../../models/InterceptionRules");

router.get("/", async (req, res, next) => {
  try {
    let db = await dbConnection(req, res);
    if (!db || !db.success) return res.status(401).json(db);
    let InterceptionRulesModel = InterceptionRules(db.connection);
    
    InterceptionRulesModel.findAll(
      {
        attributes: ['irule_id', 'source']
      }
    )
    .then(data => {
      console.log(data)
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
  }
});

module.exports = router;
