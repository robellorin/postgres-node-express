import { Router } from 'express';
const jwt = require('jsonwebtoken');
const router = Router();

router.get('/', async (req, res) => {
  try {
    const { username, password } = req.body.data;
    if (!username || !password) {
      return res.status(400).json({
        message: "Username or password is missing.",
      });
    }
    const token = jwt.sign({ expiresIn: '365 days', data: req.body.data }, process.env.TOKEN_KEY);
    return res.send(token);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
