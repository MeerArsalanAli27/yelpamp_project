const express=require('express');
const router=express.Router();
const wrapasync=require('../utils/wrapasync')
const expresserror=require('../utils/expresserror')
const campmodel=require('../models/campground');
const campschema=require('../utils/schemas');
const {isauthor,validatecamp,islogin}=require('../middleware.js')
const camp=require('../controller/camp');
const multer=require('multer');
const { storage }=require('../cloudinary');
const upload=multer({storage});

 
/*
 const isauthor=async(req,res,next)=>{
    const{id}=req.params;
    const campid=await campmodel.findById(id)
    
    if(!campid.author.equals(req.user.id)){
        req.flash('error','you dont have permission to do that')
        res.redirect(`/campground//${id}`);
    }
    else{
        next();
    }
 }
 
*/

router.route('/campground')
.get(islogin,wrapasync(camp.index))
.post(islogin,upload.array('image'),validatecamp,wrapasync(camp.createnewcampground))



router.get('/campground/new',islogin,camp.newcampground);




router.route('/campground//:id')
.get(wrapasync(camp.showcampground))
.put(islogin,isauthor,upload.array('image'),validatecamp,wrapasync(camp.updatecampground))
.delete(islogin,isauthor,camp.deletecampground)


router.get('/campground//:id/edit',islogin,isauthor,wrapasync(camp.editcampground));


/*

 router.get('/campground',islogin,wrapasync (camp.index));
 router.post('/campground',islogin,validatecamp ,wrapasync(camp.createnewcampground));

router.get('/campground/new',islogin,camp.newcampground);

router.get('/campground//:id',wrapasync(camp.showcampground));

router.get('/campground//:id/edit',islogin,isauthor,wrapasync(camp.editcampground));

router.put('/campground//:id',islogin,isauthor,validatecamp,wrapasync(camp.updatecampground));

router.delete('/campground//:id',islogin,isauthor,camp.deletecampground);
*/

module.exports=router;