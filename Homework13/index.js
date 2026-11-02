import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working!");
});

connectDB();

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
