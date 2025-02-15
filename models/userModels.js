const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: String, required: true }, // YYYY-MM-DD formatda saqlash mumkin
    address: { type: String, required: true },
    appointmentDate: { type: String, required: true }, // YYYY-MM-DD
    appointmentTime: { type: String, required: true }, // HH:MM formatda saqlash mumkin
    doctor: { type: String, required: true },
    price: { type: Number, required: true },
    givenPrice: { type: Number, default: 0 }, // Ixtiyoriy
    tel: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
