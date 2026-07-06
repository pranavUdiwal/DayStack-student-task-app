const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/user.route');
const journalRouter = require('./routes/journal.route');
const dashboardRouter = require('./routes/dashboard.route');
const profileRouter = require('./routes/profile.route');
const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const passport = require('./config/passport');
app.use(passport.initialize());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/auth', userRouter);
app.use('/api/journals', journalRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/profile', profileRouter);

module.exports = app;