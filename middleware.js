
const {campschema,reviewschema}=require('./utils/schemas');
const expresserror=require('./utils/expresserror');
const campmodel=require('./models/campground');
const reviewmodel=require('./models/review');

module.exports.islogin =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','you must be signed in')
        return res.redirect('/login')
    }
    else{
        next();
    }
}


module.exports.validatecamp = (req,res,next)=>{
    const {error}=campschema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        
        throw new expresserror(msg,400);
     }  else{
         next();
     }
 }
 

 module.exports.isauthor=async(req,res,next)=>{
    const id=req.params.id;
    const campid= await campmodel.findById(id)
    
    if(!campid.author.equals(req.user.id)){
        req.flash('error','you dont have permission to do that')
       return res.redirect(`/campground//${id}`);
    }
    else{
        next();
    }
 }

 module.exports.validatereview=(req,res,next)=>{
    
    const {err}=reviewschema.validate(req.body);
    if(err){
        const msg=err.details.map(el=>el.message).join(',')
        
        throw new expresserror(msg,400);
    }
    else{
        next();
    }
}

module.exports.isreview=(async(req,res,next)=>{
    const{id,reviewid}=req.params;
    const review=await reviewmodel.findById(reviewid)
    
    if(!review.author.equals(req.user.id)){
        req.flash('error','you dont have permission to do that')
       return res.redirect(`/campground//${id}`);
    }
    else{
        next();
    }
 })
//module.exports=validatereview;
//module.exports=validatecamp;
//module.exports=isloggedin;
//module.exports=isauthor;
//module.exports=isreview