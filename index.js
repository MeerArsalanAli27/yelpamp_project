if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
} 

const express=require('express');

const path=require('path')
//const ejs=require('ejs');
const methodOverride=require('method-override')
const mongoose=require('mongoose');
const expresserror=require('./utils/expresserror')
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const passportlocalstrategy=require('passport-local');
const mongosanitize=require('express-mongo-sanitize');


const {campschema,reviewschema}=require('./utils/schemas');
const usermodel=require('./models/user');
const ejsmate=require('ejs-mate')
const Helmet=require('helmet');
const { urlencoded } = require('express');
//const Helmet = require('helmet');
const campgroundroutes=require('./routes/campground.js')
const userroutes=require('./routes/userroutes.js')
const reviewroutes=require('./routes/review.js');

const  MongoStore=require("connect-mongo");
const helmet = require('helmet');
//const dbUrl='127.0.0.1:27017/yelp-camp';
//mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect('mongodb://localhost:27017/yelpcampp',{
    useNewUrlParser:true, 
    
    
    useUnifiedTopology:true ,
    
});
const db=mongoose.connection;
 
db.on('error',console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("database connected");
    
});




const app=express();

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.set('public',path.join(__dirname,'public'))
app.use(express.urlencoded({extended:true})) 
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.engine('ejs',ejsmate);



const sessionconfig={
    
   // name:'arsalansessioncookie',
    secret:'thisismysecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now()*1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }, 
  store:MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1:27017/yelp-camp',
        secret:'thisismysecret',
        touchAfter:24*60*60,
    })
    
}
app.use(mongosanitize()); 
app.use(session(sessionconfig));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use( new passportlocalstrategy(usermodel.authenticate()));
passport.serializeUser(usermodel.serializeUser());
passport.deserializeUser(usermodel.deserializeUser());

app.use((req,res,next)=>{
    console.log(req.query)
    res.locals.currentuser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next(); 
})
//const Url=process.env.db_Url; 


app.use(campgroundroutes)
app.use(reviewroutes)
app.use(userroutes);
app.use(Helmet({contentSecurityPolicy:false,}));

app.get('/fakeuser',async(req,res)=>{
    const user=new usermodel({email:'meer27@gmail.com',username:'meer'});
    const u=await usermodel.register(user,'arsalan27');
          res.send(u); 
})

 


    app.get('/',(req,res)=>{
        res.render('home.ejs') 
        
    })
    
    
    app.all('*',(req,res,next)=>{
        next(new expresserror('page not found',404))
    })
   
    
    app.use((err,req,res)=>{
        const{ status=500,}=err
        if(!err.message)err.message='ohh no!!! something went wrong'
        res.status(status).render('error.ejs',{err})
    })
    
    
app.listen(3000,()=>{
    console.log('listening at 3000');
})