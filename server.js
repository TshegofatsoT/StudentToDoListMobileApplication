require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(morgan('dev'));

// static front-end
app.use(express.static(path.join(__dirname, 'public')));

// api routes
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// connect & start
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_todo')
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Mongo connection error:', err.message);
        process.exit(1);
    });