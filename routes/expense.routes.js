const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const Expense = require("../models/Expense");
const router = Router();
const User = require('../models/User')

// api/expense/create
router.post("/create", auth, async (req, res) => {
  try {

    const { journey } = await User.findOne({ _id: req.user.userId });

    const { title, amount } = req.body;

    const expense = new Expense({ title, amount, journey });

    await expense.save();

    res.status(201).json({ message: "Новая оплата создана" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;