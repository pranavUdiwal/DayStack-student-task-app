const express = require('express');
const { getDashboardData } = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', auth, getDashboardData);

module.exports = router;
