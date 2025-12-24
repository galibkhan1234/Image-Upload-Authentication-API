const express = require('express')
const router = express.Router()

const User = require('../Models/users.js')
const { 
    registerUser, 
    loginUser,
    changePassword 
} = require('../Controllers/auth-controller.js')

const dbCheck = require('../Middelwares/db-check.js')

// Apply DB availability check to all auth routes
router.use(dbCheck)

const authMiddelware= require('../Middelwares/auth-middelware.js')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', authMiddelware, changePassword);

module.exports = router;
