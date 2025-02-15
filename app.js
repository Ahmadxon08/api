require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB'ga ulanish
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB'ga muvaffaqiyatli ulandi!"))
  .catch((err) => console.error("❌ MongoDB ulanishda xatolik:", err.message));

// Routers
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// Test route
app.get("/", (req, res) => res.send("API ishlayapti 🚀"));

// Serverni ishga tushiramiz
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`)
);
