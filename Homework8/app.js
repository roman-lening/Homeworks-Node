import express from "express";
import dotenv from "dotenv";
import Book from "./models/book.js";
import { json } from "sequelize";
dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/books", async (req, res) => {
  const books = await Book.findAll();
  res.status(200).send(books);
});

app.post("/books", async (req, res) => {
  const { title, author, year } = req.body ?? {};
  const newBook = await Book.create({ title, author, year });
  res.status(201).json(newBook);
});

app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body ?? {};
  const [updatedRows] = await Book.update(
    { title, author, year },
    { where: { id } },
  );
  if (updatedRows === 0) {
    return res.status(404).json({ message: "Book not found" });
  }
  const updatedBook = await Book.findByPk(id);
  res.status(200).json(updatedBook);
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  const deletedRows = await Book.destroy({ where: { id } });
  if (deletedRows === 0) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(200).json({ message: "Book deleted successfully" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
