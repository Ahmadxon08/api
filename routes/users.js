const express = require("express");
const User = require("../models/userModels");
const Counter = require("../models/counter");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let counter = await Counter.findOneAndUpdate(
      { name: "userId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    if (!counter || isNaN(counter.value)) {
      counter = await Counter.findOneAndUpdate(
        { name: "userId" },
        { value: 1 },
        { new: true, upsert: true }
      );
    }

    const newUser = new User({ ...req.body, id: counter.value });
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
    const user = await User.findOne({ id: Number(req.params.id) });
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const deletedUser = await User.findOneAndDelete({ id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    const lastUser = await User.findOne().sort({ id: -1 });
    const newCounterValue = lastUser ? lastUser.id : 0;

    await Counter.findOneAndUpdate(
      { name: "userId" },
      { value: newCounterValue },
      { new: true, upsert: true }
    );

    res.json({ message: "Foydalanuvchi o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.delete("/all", async (req, res) => {
  try {
    await User.deleteMany({});

    await Counter.findOneAndUpdate(
      { name: "userId" },
      { value: 1 },
      { new: true, upsert: true }
    );

    res.json({
      message: "Barcha foydalanuvchilar o‘chirildi va counter 1 ga tiklandi",
    });
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

module.exports = router;
