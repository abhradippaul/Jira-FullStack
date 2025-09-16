import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { urlencoded } from "express";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.json({ msg: "hello" });
});

app.get("/test", async (req, res) => {
  res.status(200).json({ msg: "This is test page" });
});

app.listen(PORT, () => {
  console.log("Server connected successfully on port no", PORT);
});
