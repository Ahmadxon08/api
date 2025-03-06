const express = require("express");
const User = require("../models/userModels");
const Counter = require("../models/counter");

const router = express.Router();

const addPatient = async (req, res, doctor) => {
  try {
    let counter = await Counter.findOneAndUpdate(
      { name: "userId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const newUser = new User({ ...req.body, doctor, id: counter.value });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Xatolik:", err);
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
};
const getPatients = async (req, res, doctorName) => {
  try {
    const patients = await User.find({ doctor: doctorName });
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
};

router.post("/zoir", async (req, res) => {
  await addPatient(req, res, "zoir");
});

router.post("/sardor", async (req, res) => {
  await addPatient(req, res, "sardor");
});

router.post("/jasur", async (req, res) => {
  await addPatient(req, res, "jasur");
});
router.get("/zoir", async (req, res) => {
  await getPatients(req, res, "zoir");
});

router.get("/sardor", async (req, res) => {
  await getPatients(req, res, "sardor");
});

router.get("/jasur", async (req, res) => {
  await getPatients(req, res, "jasur");
});

router.get("/all", async (req, res) => {
  try {
    const patients = await User.find();
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.get("/all/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.params.id) });
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.put("/all/:id", async (req, res) => {
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

router.delete("/all/:id", async (req, res) => {
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
      { value: 0 },
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
