const express = require('express');
const authMiddleware = require('../Middelwares/auth-middelware.js');
const router = express.Router();


router.get('/welcome',authMiddleware,(req,res)=>{
    const{username, userId, role}= req.userInfo;
    res.json({
        message: 'Welcome to the Home Page',
        user: {username, userId, role}
    });
});

module.exports= router;