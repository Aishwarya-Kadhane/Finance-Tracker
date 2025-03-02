const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new transaction
router.post("/", async (req, res) => {
  try {
    const { date, description, category, amount } = req.body;
    const newTransaction = new Transaction({ date, description, category, amount });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a transaction by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    res.json(deletedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
