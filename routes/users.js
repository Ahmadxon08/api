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

    return res.status(201).json(savedUser);
  } catch (err) {
    console.error("Xatolik:", err);
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
};
const getPatients = async (req, res, doctorName) => {
  try {
    const patients = await User.find({ doctor: doctorName });
    return res.status(200).json(patients);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
};

router.post("/zoir", async (req, res) => {
  try {
    return await addPatient(req, res, "zoir");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.post("/sardor", async (req, res) => {
  try {
    return await addPatient(req, res, "sardor");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.post("/jasur", async (req, res) => {
  try {
    return await addPatient(req, res, "jasur");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
});
router.get("/zoir", async (req, res) => {
  try {
    return await getPatients(req, res, "zoir");
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.get("/sardor", async (req, res) => {
  try {
    return await getPatients(req, res, "sardor");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.get("/jasur", async (req, res) => {
  try {
    return await getPatients(req, res, "jasur");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const patients = await User.find();
    return res.status(200).json(patients);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

router.get("/all/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.params.id) });
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
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
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
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

    return res.json({ message: "Foydalanuvchi o‘chirildi" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
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

    return res.json({
      message: "Barcha foydalanuvchilar o‘chirildi va counter 1 ga tiklandi",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: err.message });
  }
});

module.exports = router;
