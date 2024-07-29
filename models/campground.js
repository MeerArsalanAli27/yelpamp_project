const mongoose=require('mongoose')
const Review=require('./review');
const { string, required } = require('joi');
const schema=mongoose.Schema;




const imageschema= new schema({
 url:String,
  filename:String,
})


imageschema.virtual('thumbnail').get(function(){
 return this.url.replace('/upload','/upload/w_200')
})

const opts={toJSON:{virtuals:true}};

const campgroundschema=new schema({
  author:{
    type:schema.Types.ObjectId,
    ref:'user'},
    title:String,
    image:[imageschema],
    geometry:{
      type:{
           type:String,
           enum:['Point'],
 
      },
      coordinates:{
        type:[Number],
   
        
      }
    },
    price:Number,
    description:String,
    location:String,
    reviews:[
        { type:schema.Types.ObjectId ,
         ref:'review'}
  ]
},opts);



campgroundschema.post('findOneAndDelete',async(doc)=>{
    if(doc){
     await Review.deleteMany({
      id:{
        $in:doc.reviews
      }
     })
    } 
})

campgroundschema.virtual('properties.popmarkup').get(function(){
     return `<a href="/campground//${this.id}">${this.title}</a>`;
})
module.exports=mongoose.model('campground',campgroundschema);