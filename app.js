require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// CORS middleware qo‘shish
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sadaffdesntist.netlify.app"], // Frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const MONGO_URI =
  "mongodb+srv://akhmadxonmoydinov:abu2001xon@cluster0.lh0nm.mongodb.net/mydb?retryWrites=true&w=majority";

// MongoDB'ga ulanish
mongoose
  .connect(MONGO_URI)
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
