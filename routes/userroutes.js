const express=require('express');
const router=express.Router( );
const user=require('../models/user');
const passport = require('passport');
const userroute=require('../controller/user');
 

router.get('/register',userroute.showregister);

router.post('/register',userroute.register);


router.get('/login',userroute.showlogin);

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),userroute.login);



router.get('/logout',userroute.logoout);


module.exports=router;