const { Router } = require("express");
const config = require("config");
const Group = require("../models/Group");
const auth = require("../middleware/auth.middleware");
const router = Router();
const { check, validationResult } = require("express-validator");

// /api/group/create
router.post("/create", auth, async (req, res) => {
  try {

    const { name } = req.body;
    const userName = new Group({ name });
    await userName.save();

    res.status(201).json({ message: "Имя добавлено" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

router.post("/update", auth, async (req, res) => {
  try {

    const { group } = req.body;

    console.log('req.body;', req.body)

    const filter = { name: "Sveta" };
    const links = await Group.findOneAndUpdate({ name: "Sveta" }, { group });

    res.status(201).json({ message: "Группа добавлена" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
// /api/group/create
// router.post(
//   '/create',
//   auth,
//   async (req, res) => {
//     try {
//       const errors = validationResult(req)
//
//       if (!errors.isEmpty()) {
//         return res.status(400).json({
//           errors: errors.array(),
//           message: 'Некорректное имя'
//         })
//       }
//
//       const {name} = req.body;
//       const userName = new Group({ name })
//       await userName.save()
//
//       res.status(201).json({ message: 'Имя добавлено' })
//
//
//     } catch (e) {
//       res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
//     }
//   })
