const express=require('express');
const router=express.Router({mergeParams:true});
const reviewmodel=require('../models/review');
const wrapasync=require('../utils/wrapasync')
const expresserror=require('../utils/expresserror')
const campmodel=require('../models/campground');
const {reviewschema}=require('../utils/schemas');
const {validatereview,islogin,isreview}=require('../middleware.js')
const controllerreview=require('../controller/review');
//let islogin=require('../middleware.js')


router.post('/campground/:id/reviews',islogin,validatereview,wrapasync(controllerreview.createreview));


router.delete('/campground//:id/reviews//:reviewid',islogin,isreview,wrapasync(controllerreview.deletereview));

module.exports=router;