import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, UserModel } from "../models/user";
import { authenticate } from "../middlewares/auth";
import { authorizeAdmin } from "../middlewares/authorize";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret_key";

// Интерфейсы для тел запросов
interface LoginRequest {
  username: string;
  password: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

// Генерация Access Token
const generateAccessToken = (user: IUser): string => {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Генерация Refresh Token
const generateRefreshToken = (user: IUser): string => {
  return jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: "7d" });
};

// Авторизация пользователя и выдача токенов
router.post(
  "/login",
  async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { username, password } = req.body;
    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Сохранение refresh токена в базе данных
      user.refreshToken = refreshToken;
      await user.save();

      res.json({ accessToken, refreshToken, userRole: user.role, username: user.username, userId: user._id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Обновление Access Token
router.post(
  "/refresh-token",
  async (req: Request<{}, {}, RefreshTokenRequest>, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is required" });
      return;
    }

    try {
      // Проверка refresh токена
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;
      const user = await UserModel.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
      }

      // Генерация нового access токена
      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired refresh token" });
    }
  }
);

// Выход пользователя
router.post(
  "/logout",
  async (req: Request<{}, {}, RefreshTokenRequest>, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    try {
      const user = await UserModel.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Получить всех пользователей (доступно только администратору)
router.get(
  "/",
  authenticate,
  authorizeAdmin,
  async (_: Request, res: Response) => {
    try {
      const users = await UserModel.find({}, "-password -refreshToken"); // Исключаем пароли и токены из результата
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Зарегистрировать нового пользователя
router.post(
  "/register",
  async (req: Request<{}, {}, IUser>, res: Response) => {
    try {
      const user = await UserModel.create(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
