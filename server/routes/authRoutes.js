const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
// console.log(authController.login);

// router.post('/login',(req,res)=>{
//     const {username,password} = req.body;
//     console.log(`${username} , ${password}`);
//     res.json({success:"success"});
// });

router.post('/login',authController.login);
router.get('/login',authController.getUsers);
module.exports = router;