
const mongoose=require('mongoose');
const reviewschema=new mongoose.Schema({
   body:String,
   rating:Number,
   author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
   }
})
module.exports=mongoose.model('review',reviewschema);