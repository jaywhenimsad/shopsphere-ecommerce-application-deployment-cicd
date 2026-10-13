require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db");
const Product = require("./Product");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? "ok" : "database unavailable",
    database: connected ? "connected" : "disconnected"
  });
});

app.get("/api/products", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: "i" };
    const products = await Product.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: products.length, products });
  } catch (error) { next(error); }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) { next(error); }
});

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const sampleProducts = [
  { name: "Wireless Headphones", description: "Immersive audio for work and travel.", category: "Electronics", price: 79.99, image: "products/wireless-headphones.svg", stock: 25 },
  { name: "Smart Watch", description: "A smart companion for every day.", category: "Electronics", price: 149.99, image: "products/smart-watch.svg", stock: 15 },
  { name: "Running Shoes", description: "Lightweight comfort for your daily run.", category: "Fashion", price: 59.99, image: "products/running-shoes.svg", stock: 20 },
  { name: "Travel Backpack", description: "Carry your essentials in style.", category: "Accessories", price: 39.99, image: "products/travel-backpack.svg", stock: 30 },
  { name: "Smartphone", description: "A modern phone with a vivid display.", category: "Electronics", price: 699.99, image: "products/smartphone.svg", stock: 12 },
  { name: "Desk Lamp", description: "A warm light for your study space.", category: "Home", price: 24.99, image: "products/desk-lamp.svg", stock: 18 },
  { name: "Classic T-Shirt", description: "A versatile everyday essential.", category: "Fashion", price: 19.99, image: "products/tshirt.svg", stock: 40 },
  { name: "Wireless Earbuds", description: "Compact sound for your commute.", category: "Electronics", price: 49.99, image: "products/wireless-earbuds.svg", stock: 35 }
];

async function start() {
  await connectDB();
  if (await Product.countDocuments() === 0) {
    await Product.insertMany(sampleProducts);
    console.log("Sample products inserted");
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`ShopSphere API listening on ${PORT}`));
}
start().catch((err) => { console.error("Startup failed:", err.message); process.exit(1); });
