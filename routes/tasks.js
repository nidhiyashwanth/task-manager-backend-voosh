const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Column = require('../models/Column');

// Get all tasks for a user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).populate('column');
    console.log('Sending tasks:', tasks);  // Add this line for debugging
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);  // Add this line for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, columnId } = req.body;
    const column = await Column.findOne({ _id: columnId, user: req.userId });
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    const task = new Task({
      title,
      description,
      column: columnId,
      user: req.userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, columnId } = req.body;
    const column = await Column.findOne({ _id: columnId, user: req.userId });
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, description, column: columnId },
      { new: true }
    ).populate('column');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
