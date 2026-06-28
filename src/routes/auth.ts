import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb, getUsersCollection } from "../db";
import { protect, type AuthRequest } from "../middleware/auth.middleware";
import {
  sendSecurityAlertEmail,
  sendWelcomeEmail,
} from "../services/email.service";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in the environment variables.");
}

function createToken(userId: string, email: string) {
  return jwt.sign(
    { sub: userId, email },
    String(JWT_SECRET) as any,
    { expiresIn: JWT_EXPIRES_IN as any } as any,
  );
}

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "name, email and password are required",
    });
  }

  try {
    await connectDb();
    const users = getUsersCollection();

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const token = createToken(result.insertedId.toString(), email);

    sendWelcomeEmail({
      name,
      recipient: email,
      signupTime: new Date().toLocaleString(),
      frontendUrl: process.env.FRONTEND_URL || "https://notificationhub.local",
    }).catch((error) => {
      console.error("Failed to send signup welcome email:", error);
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: result.insertedId.toString(),
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).json({ message: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required",
    });
  }

  try {
    await connectDb();
    const users = getUsersCollection();

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(String(user._id), String(user.email));

    const userAgent = String(req.headers["user-agent"] ?? "Unknown device");
    const forwardedFor = req.headers["x-forwarded-for"];
    const ipAddress =
      typeof forwardedFor === "string"
        ? forwardedFor.split(",")[0].trim()
        : (req.ip ?? "Unknown IP");

    sendSecurityAlertEmail({
      name: user.name,
      recipient: user.email,
      loginTime: new Date().toLocaleString(),
      device: userAgent,
      location: "Unknown location",
      ipAddress,
    }).catch((error) => {
      console.error("Failed to send login alert email:", error);
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Failed to login" });
  }
});

router.get("/me", protect, (req: AuthRequest, res) => {
  res.json({ userId: req.userId });
});

export default router;
