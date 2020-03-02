const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const Expense = require("../models/Expense");
const router = Router();

// api/expense/create
router.post("/create", auth, async (req, res) => {
  try {

    const { expense } = req.body;

    res.status(201).json({ message: "Новая оплата создана" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;