import dotenv from "dotenv";
import express from "express";
import { connectToDatabase, getDb } from "./db/index.js";
import { ObjectId } from "mongodb";

dotenv.config();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/products", async (req, res) => {
  try {
    const db = getDb();
    const product = req.body ?? {};
    if (!product.name || !product.price || !product.description) {
      return res.status(400).json({ message: "Message" });
    }
    if (typeof product.name !== "string" || typeof product.price !== "number") {
      return res.status(400).json({ message: "Message" });
    }
    const result = await db.collection("products").insertOne({
      name: product.name,
      price: product.price,
      description: product.description,
    });
    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const db = getDb();
    const products = await db.collection("products").find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const db = getDb();
    const productID = req.params.id;
    if (!ObjectId.isValid(productID)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await db.collection("products").findOne({
      _id: new ObjectId(productID),
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const db = getDb();
    const productID = req.params.id;
    if (!ObjectId.isValid(productID)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const newData = req.body ?? {};
    if (!newData.name || newData.price === undefined || !newData.description) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const oldProduct = await db.collection("products").findOne({
      _id: new ObjectId(productID),
    });
    if (!oldProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(productID) },
      {
        $set: {
          name: newData.name,
          price: newData.price,
          description: newData.description,
        },
      },
    );
    res.status(200).json({
      message: "Product updated successfully",
      productId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const db = getDb();
    const productID = req.params.id;
    if (!ObjectId.isValid(productID)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await db.collection("products").findOne({
      _id: new ObjectId(productID),
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(productID),
    });
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start the server due to MongoDB connection issue",
      err,
    );
  });
