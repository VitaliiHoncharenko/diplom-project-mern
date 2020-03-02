const { Router } = require("express");
const config = require("config");
const Journey = require("../models/Journey");
const auth = require("../middleware/auth.middleware");
const router = Router();

//api/journey/create
router.post("/create", auth, async (req, res) => {
  try {

    const { title } = req.body;

    console.log('title', title)

    const journeyTitle = new Journey({ title });

    await journeyTitle.save();

    res.status(201).json({ message: "Приключение сохранено" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;