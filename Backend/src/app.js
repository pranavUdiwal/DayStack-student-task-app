const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/user.route');
const journalRouter = require('./routes/journal.route');
const dashboardRouter = require('./routes/dashboard.route');
const profileRouter = require('./routes/profile.route');
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:5173'] : ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', userRouter);
app.use('/api/journals', journalRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/profile', profileRouter);

module.exports = app;