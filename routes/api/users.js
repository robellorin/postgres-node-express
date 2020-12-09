const express = require("express");
const router = express.Router();
const { dbConnection } = require("../../config");

const User = require("../../models/User");

router.get("/", async (req, res, next) => {
  let db = await dbConnection(req, res);

  if (!db.success) return res.status(401).json(db);

  let userModel = User(db.connection);

  // REST OF THE STUFF GOES HERE

  res.json({ msg: "API works" });
});

module.exports = router;
