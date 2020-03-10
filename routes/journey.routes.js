const { Router } = require("express");
const config = require("config");
const Journey = require("../models/Journey");
const User = require('../models/User');
const auth = require("../middleware/auth.middleware");
const router = Router();

//api/journey/create
router.post("/create", auth, async (req, res) => {
  try {

    const { title } = req.body;

    const journeyTitle = new Journey({ title });

    const j = await journeyTitle.save();

    await User.findOneAndUpdate({ _id: req.user.userId }, { journey: j._id });

    res.status(201).json({ message: "Приключение сохранено" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});


// /api/journey/users/add
router.post("/users/add",
  auth,
  async (req, res) => {
  try {
    const { users } = req.body;

    const { journey } = await User.findOne({ _id: req.user.userId });

    for(let i = 0; i < users.length; i++) {

      if (users[i].length <= 1) {
        return res.status(400).json({ message: "Имена некорректные" });
      }

      if (users.indexOf(users[i]) !== i) {
        return res.status(400).json({ message: "Имена не должны дублироваться" });
      }

      const currentUser = new User({ name: users[i], journey});
      await currentUser.save();
    }

    res.status(201).json({ message: "Список пользователей сохранен" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

module.exports = router;