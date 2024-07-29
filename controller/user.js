const user=require('../models/user');




module.exports.showregister=(req,res)=>{
    res.render('./user/register.ejs');
}

module.exports.register=async(req,res,next)=>{
    try {
        
        const{username,email,password}=req.body;
        const u= new user({email,username});
        const registeruser=await user.register(u,password);
         req.login(registeruser,(err)=>{
            if(err) return next(err);

            req.flash('success','welcome to yelp camp')
            res.redirect('/campground');
         })
    } catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
}

module.exports.showlogin=(req,res)=>{
    res.render('./user/login.ejs');
}

module.exports.login=(req,res)=>{
    req.flash('success','welcome back!!!');
    res.redirect('/campground');
}


module.exports.logoout=(req,res)=>{
    req.logout(()=>{

        req.flash('success','sucessfully logged out');
            res.redirect('/login')
    })
}