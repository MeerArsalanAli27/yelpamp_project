const mongoose=require('mongoose');
const campmodel=require('../models/campground')
const cities=require('./cities')
const{places,descriptors}=require('./seedhelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser:true,
    
    useUnifiedTopology:true 
});
const db=mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database connected");
});
const sample=Array=>Array[Math.floor(Math.random()*Array.length)];
const seedDB=async()=>{
    await campmodel.deleteMany({})
   for(let i=0;i<5;i++){
    const rand=Math.floor(Math.random()*1000);
    const price=Math.floor(Math.random()*20)+10;
   const camp= new campmodel({
        author:'643207d3ab824682407a2073',
       location:`${cities[rand].city},${cities[rand].state}`,
       title:`${sample(descriptors)} ${sample(places)}`,
       description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
       price,
       geometry:{
        type:"Point",
        coordinates:[cities[rand].longitude,
                       cities[rand].latitude]
       },
        image:[
        {
          url: 'https://res.cloudinary.com/dmzr56jln/image/upload/v1681205426/yelpcamp/ooyejfwq3h7mccplp1ji.jpg',
          filename: 'yelpcamp/ooyejfwq3h7mccplp1ji',
        
        },
        {
          url: 'https://res.cloudinary.com/dmzr56jln/image/upload/v1681205426/yelpcamp/ooyejfwq3h7mccplp1ji.jpg',
          filename: 'yelpcamp/ooyejfwq3h7mccplp1ji',
        },
      
      ],
    });

    await camp.save();
   }
}
seedDB().then(()=>{
     mongoose.connection.close();
})