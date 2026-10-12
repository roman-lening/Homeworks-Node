import express from "express";
import dotenv from "dotenv";
import connection from "./db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200);
  res.send("Hello World!");
});

app.get("/products", (req, res) => {
  const query = `SELECT * FROM products`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error: ", err);
      res.status(500).send("Error");
      return;
    }
    res.json(results);
  });
});

app.post("/products", (req, res) => {
  const { name, price } = req.body ?? {};
  const query = `INSERT INTO products (name, price) VALUE (?, ?)`;
  connection.query(query, [name, price], (err, results) => {
    if (err) {
      console.error("Error: ", err);
      res.status(500).send("Error");
      return;
    }
    res.status(201).send("Product added");
  });
});

app.post("/", (req, res) => {
  const { name, email } = req.body ?? {};
  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).send("Invalid name");
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).send("Invalid email");
  }
  console.log(`Email: ${email}, \n Name: ${name}`);
  return res.status(200).send("Data received successfully");
});

app.use((req, res) => {
  return res.status(404).send("Route not found");
});

app.listen(port, (err) => {
  if (err) {
    console.error("Error: ", err);
    return;
  }
  console.log(`Example app listening on port ${port}`);
});
