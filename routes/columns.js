const express = require('express');
const Column = require('../models/Column');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all columns for a user
router.get('/', auth, async (req, res) => {
  try {
    const columns = await Column.find({ user: req.userId }).sort('order');
    res.json(columns);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new column
router.post('/', auth, async (req, res) => {
  try {
    const { title, order } = req.body;
    const column = new Column({
      title,
      order,
      user: req.userId,
    });
    await column.save();
    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a column
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, order } = req.body;
    const column = await Column.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, order },
      { new: true }
    );
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    res.json(column);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a column
router.delete('/:id', auth, async (req, res) => {
  try {
    const column = await Column.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
