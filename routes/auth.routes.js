const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();
const auth = require("../middleware/auth.middleware");

// /api/auth/register
router.post(
  "/register",
  [
    check("name", "Укажите корректное имя. Минимум 2 символа").isLength({ min: 2 }),
    check("email", "Некорректный email").isEmail(),
    check("password", "Минимальная длина пароля 6 символов").isLength({ min: 6 }),
    check("password2", "Повторный пароль также не менее 6 символов").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({
          errors: result.array(),
          message: result.errors[0].msg,
        });
      }

      const { name, email, password, password2 } = req.body;

      if (password !== password2) {
        return res.status(400).json({
          errors: result.array(),
          message: 'Пароли не совпадают',
        });
      }

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: "Такой пользователь уже существует" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword, name });

      await user.save();

      res.status(201).json({ message: "Пользователь создан" });

    } catch (e) {
      res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
    }
  });

// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Введите корректный email").isEmail(),
    check("password", "Введите пароль").exists(),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({
          errors: result.array(),
          message: "Некорректный данные при входе в систему",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Неверный пароль, попробуйте снова" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), { expiresIn: '1d' });

      res.json({ token, userId: user.id });

    } catch (e) {
      res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
    }
  });

// /api/auth/name/update
router.post("/name/update", [auth, check("name", "Минимальная длина имени 2 символа").isLength({ min: 2 }) ], async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log('errors', errors)


    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Некорректное имя",
      });
    }

    const { name } = req.body;

    await User.findOneAndUpdate({ _id: req.user.userId }, { name });

    res.status(201).json({ message: "Имя добавлено" });
  } catch (e) {
    res.status(500).json({ message: e });
  }

});

module.exports = router;
