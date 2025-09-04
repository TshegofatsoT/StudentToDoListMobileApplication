const express = require('express');
const router = express.Router();
const Task = require('../models/Task');


// GET all
router.get('/', async (req, res) => {
    const tasks = await Task.find().sort({ done: 1, due: 1, createdAt: -1 });
    res.json(tasks);
});


// POST create
router.post('/', async (req, res) => {
    console.log('Creating task ---- :', req.body);
    try {
        const { title, course, type, due } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        const task = await Task.create({
            title: title.trim(),
            course: (course || '').trim(),
            type: ['Assignment', 'Exam'].includes(type) ? type : 'Assignment',
            due: due ? new Date(due) : null,
            done: false,
        });
        console.log('Created task **** :', task);
        res.status(201).json(task);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});


// PATCH update
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = {};
        ['title', 'course', 'type', 'done', 'due'].forEach((k) => {
            if (req.body[k] !== undefined) {
                update[k] = k === 'due' && req.body[k] ? new Date(req.body[k]) : req.body[k];
            }
        });
        const task = await Task.findByIdAndUpdate(id, update, { new: true });
        if (!task) return res.status(404).json({ error: 'Not found' });
        res.json(task);
    } catch (e) {
        res.status(400).json({ error: 'Invalid id' });
    }
});


// DELETE one
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ error: 'Not found' });
        res.json({ ok: true });
    } catch (e) {
        res.status(400).json({ error: 'Invalid id' });
    }
});


// DELETE many (clear completed)
router.delete('/', async (req, res) => {
    const result = await Task.deleteMany({ done: true });
    res.json({ deleted: result.deletedCount });
});


module.exports = router;