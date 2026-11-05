import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/categories", async (req, res) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Invalid categories" });
    }
    const result = await Category.insertMany(categories);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid products" });
    }
    const result = await Product.insertMany(products);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

