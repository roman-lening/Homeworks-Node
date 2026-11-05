import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import postRouter from "./routes/posts.js";
import getRouter from "./routes/gets.js";
dotenv.config();

const port = process.env.PORT || 3333;
const host = process.env.HOST || "localhost";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});

app.use("/post", postRouter);
app.use("/get", getRouter);

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Сервер запущен: http://${host}:${port}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error);
  }
}

startServer();
