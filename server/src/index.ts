import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import passport from "passport";
import auth from "./routes/auth";
import "./config/passport";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-device-fingerprint"],
    credentials: true,
  })
);

app.use(helmet());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  console.log("Fetched");
  res.send("MERN TS API running 🚀");
});

app.use("/api/auth", auth);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
