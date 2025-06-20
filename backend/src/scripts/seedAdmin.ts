import mongoose from "mongoose";
import User from "../models/User";

// Настройки подключения к БД (можно вынести в .env)
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mao-admin-panel";

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "admin@example.com";
    const password = "admin123";
    const name = "Admin";
    const role = "admin";

    // Проверяем, есть ли уже такой админ
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin user already exists:", email);
      process.exit(0);
    }

    const admin = new User({ name, email, password, role });
    await admin.save();
    console.log("Admin user created:", email, "password:", password);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
