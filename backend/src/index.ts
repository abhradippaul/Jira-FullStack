import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { sendMessage } from "./aws/sqs.js";

import { router as authRouter } from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);

app.get("/", async (req, res) => {
  res.json({ msg: "hello" });
});

app.get("/test", async (req, res) => {
  res.status(200).json({ msg: "This is test page" });
});

app.get("/send-mail", async (req, res) => {
  const response = await sendMessage("This is my message", "Abhradip Paul");
  console.log(response);
  res.status(200).json({ msg: "Mail send to sqs successfully" });
});

app.listen(PORT, () => {
  console.log("Server connected successfully on port no", PORT);
});
