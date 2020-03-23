const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const Expense = require("../models/Expense");
const router = Router();
const User = require('../models/User');

// api/expense/create
router.post("/create", auth, async (req, res) => {
  try {

    const { journey, expense } = await User.findOne({ _id: req.user.userId });

    const { title, amount } = req.body;

    const newExpense = new Expense({ title, amount, journey });

    const expenseData = await newExpense.save();

    console.log('expenseData', expenseData)

    await User.findOneAndUpdate({ _id: req.user.userId }, { expense: [...expense, expenseData._id] });

    res.status(201).json({ message: "Новая оплата создана" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

module.exports = router;