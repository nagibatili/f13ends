import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user";
import inventoryRouter from "./routes/inventory";
import planRouter from "./routes/plan";
import requestRouter from "./routes/request";
import {UserModel} from "./models/user";

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://0.0.0.0:27017/sports_inventory")
  .then(() => {
    console.log("Connected to MongoDB");
    initializeAdminAccount(); // Инициализация учетной записи администратора
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Функция для создания учетной записи администратора
const initializeAdminAccount = async () => {
  try {
    const adminExists = await UserModel.findOne({ role: "admin" });
    if (!adminExists) {
      const admin = new UserModel({
        username: "admin",
        password: "admin", // Замените на более безопасный пароль
        role: "admin",
      });
      await admin.save();
      console.log(
        "Admin account created: username = admin, password = admin"
      );
    } else {
      console.log("Admin account already exists");
    }
  } catch (error: any) {
    console.error("Error initializing admin account:", error.message);
  }
};

// Routes
app.use("/api/inventory", inventoryRouter);
app.use("/api/users", userRouter);
app.use("/api/plan", planRouter);
app.use("/api/request", requestRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
