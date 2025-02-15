const express = require("express");
const User = require("../models/userModels");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

// ✅ 5. Foydalanuvchini o‘chirish (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json({ message: "Foydalanuvchi o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

module.exports = router;
