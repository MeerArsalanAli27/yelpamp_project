const campmodel=require('../models/campground');
const multer=require('multer');
const{storage,cloudinary}=require('../cloudinary');
const upload=multer({storage});
const mpgeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const maptoken= process.env.mapbox_token;
const geocoder=mpgeocoding({accessToken:maptoken})



module.exports.index=async(req,res,next)=>{

    const camp= await campmodel.find({})
    res.render('campgrounds/index.ejs',{camp})


}



module.exports.newcampground=(req,res)=>{
   
    res.render('campgrounds/new.ejs');
    }

    module.exports.createnewcampground=async(req,res)=>{
        //if(!req.body.camp)throw new expresserror('invalid data',400
              
      const geodata=  await geocoder.forwardGeocode({
            query: req.body.campgrounds.location,
            limit:1
        }).send()

        
        const newcamp= new campmodel(req.body.campgrounds);
        newcamp.geometry= (geodata.body.features[0].geometry);
        newcamp.image=req.files.map(f=>({url: f.path,filename: f.filename}));
        newcamp.author=req.user.id;
        
        await newcamp.save();
        console.log(newcamp)
        req.flash('success','sucesfully created campground')
        res.redirect(`/campground//${newcamp._id}`)
       
    
    }
    /*(upload.single('image'),(req,res)=>{
                   console.log(req.body)
                       res.send('it worked');
    })
    */


    module.exports.showcampground=async(req,res)=>{
        const campid=await campmodel.findById(req.params.id).populate({
            path:'reviews',
            populate:{
                path:'author'
            }
        }).populate('author')
        if(!campid){
            req.flash('error','cannot find the campground');
           return res.redirect('/campground')
        }
            res.render('campgrounds/show.ejs',{campid})
        
        }




    module.exports.editcampground=async(req,res)=>{
        const{id}=req.params;
    const campid=await campmodel.findById(id)
    if(!campid){
        req.flash('error','cannot find the campground');
       return res.redirect('/campground')
    }
    
    res.render('campgrounds/edit.ejs',{campid})
    }



 module.exports.updatecampground=async(req,res)=>{
        const {id}=req.params;
        console.log(req.body)
        const campp= await campmodel.findByIdAndUpdate(id,{...req.body.campgrounds});
        const img=req.files.map(f=>({url: f.path,filename: f.filename}));
        campp.image.push(...img)
        await campp.save();
        if(req.body.deleteimages){
            for(let filename of req.body.deleteimages){
               await cloudinary.uploader.destroy(filename);
            }
            await campp.updateOne({$pull:{image:{filename:{$in: req.body.deleteimages}}}})
            console.log(campp)
        }

        req.flash('success','successfully updated campground!!!')
        res.redirect(`/campground//${campp.id}`);
        }



module.exports.deletecampground=async(req,res)=>{
        const{id}=req.params;
    await campmodel.findByIdAndDelete(id);
    req.flash('success','successfully created a new campground')
    res.redirect('/campground')
    
    }