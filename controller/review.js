const campmodel=require('../models/campground');
const reviewmodel=require('../models/review');

module.exports.createreview=async(req,res)=>{
    const id=req.params.id;
    const camp=await campmodel.findById(id);
    const review=  new reviewmodel(req.body.review);
    review.author=req.user.id;
    camp.reviews.push(review)
    await review.save();
    await camp.save();
    req.flash('success','successfully created new review')
    res.redirect(`/campground//${id}`)
}

module.exports.deletereview=async(req,res)=>{
    const {id,reviewid}=req.params;
    await campmodel.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    await reviewmodel.findByIdAndDelete(reviewid);
    req.flash('success','successfully deleted a review')
    res.redirect(`/campground//${id}`);
    //res.send('delete me');
}