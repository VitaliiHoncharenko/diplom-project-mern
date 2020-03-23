const { Router } = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const router = Router();

//api/users
router.get('/', auth, async (req, res) => {
  try {
    const author = await User.findOne({ _id: req.user.userId });
    const users = await User.find({ journey: author.journey });

    res.json(users);

  } catch (e) {
    res.status(500).json({ message: e });
  }
});


//api/users/author
router.get('/author', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    res.json(user.name);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

module.exports = router;
