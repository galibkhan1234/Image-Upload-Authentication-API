const express = require('express');
const authMiddleware = require('../Middelwares/auth-middelware.js');
const isAdminUser = require('../Middelwares/admin-middelware.js');

const router = express.Router();

router.get('/welcome', authMiddleware, isAdminUser, (req, res) => {
    res.json({
        message: 'Welcome to the Admin Page',
    });
});

module.exports = router;