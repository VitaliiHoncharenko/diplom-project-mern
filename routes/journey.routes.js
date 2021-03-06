const { Router } = require("express");
const config = require("config");
const Journey = require("../models/Journey");
const User = require('../models/User');
const auth = require("../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");
const router = Router();

//api/journey
router.get('/', auth, async (req, res) => {
  try {
    const { journey } = await User.findOne({ _id: req.user.userId });
    const currentJourney = await Journey.findOne({ _id: journey });

    res.json(currentJourney);

  } catch (e) {
    res.status(500).json({ message: e });
  }
});

//api/journey/create
router.post("/create", [auth, check("title", "Минимальная длина названия поездки -  5 символов").isLength({ min: 2 })], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Минимальная длина названия поездки -  5 символов",
      });
    }

    const { title } = req.body;
    const { name, _id } = await User.findOne({ _id: req.user.userId });

    const journeyInfo = new Journey({ title, author: name, authorId: _id });

    const journey = await journeyInfo.save();
    await User.findOneAndUpdate({ _id: req.user.userId }, { journey: journey._id });

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

    if (users.length <= 0) {
      return res.status(400).json({ message: 'Добавьте имена пользователей в группе' });
    }

    const { journey } = await User.findOne({ _id: req.user.userId });

    for(let i = 0; i < users.length; i++) {

      const userName = await User.findOne({ name: users[i], journey });

      if (userName !== null) {
        return res.status(400).json({ message: `Имя '${userName.name}' уже существует` });
      }

      if (users[i].length <= 1) {
        return res.status(400).json({ message: "Имена некорректные" });
      }

      if (users.indexOf(users[i]) !== i) {
        return res.status(400).json({ message: "Имена не должны дублироваться" });
      }

      const currentUser = new User({ name: users[i], journey });
      currentUser.email = `${currentUser._id}@i-owe-you.com`;

      await currentUser.save();
    }

    res.status(201).json({ message: "Список пользователей сохранен" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

module.exports = router;
