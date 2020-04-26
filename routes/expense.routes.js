const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth.middleware");
const Expense = require("../models/Expense");
const router = Router();
const User = require('../models/User');

// api/expense/create
router.post(
  "/create",
  [
    auth,
    check("title", "Минимальное название - 2 символа").isLength({ min: 2 }),
    check("amount", "Укажите корректную сумму").isFloat({ gt: 0.1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректный данные оплаты",
        });
      }

      if (req.body.lenders.length <= 0 || req.body.borrowers.length <= 0) {
        return res.status(400).json({
          message: "В оплате не указаны кредиторы/должники",
        });
      }

      const { journey } = await User.findOne({ _id: req.user.userId });

      const { title, amount, borrowers, lenders } = req.body;

      const newExpense = new Expense({ title, amount, borrowers, lenders, journey });

      const expenseData = await newExpense.save();

      res.status(201).json({ message: "Новая оплата создана" });
    } catch (e) {
      res.status(500).json({ message: e });
    }
  });

// api/expense/list
router.get("/list", auth, async (req, res) => {

    try {
      const { journey } = await User.findOne({ _id: req.user.userId });

      const expenses = await Expense.find({ journey });

      res.json(expenses);

      // res.status(201).json({ message: "Новая оплата создана" });
    } catch (e) {
      res.status(500).json({ message: e });
    }
  });


module.exports = router;