const passport = require('passport');
const passportLocal = require('passport-local');
const Admin = require('../model/Admin_model')
const bcrypt = require('bcrypt')

passport.use(new passportLocal({
     usernameField :'email'
}, async function(email,password,done){
    let AdminData = await Admin.findOne({email :email});
    if(AdminData){
        let pass = bcrypt.compare(password,AdminData.password);
        if(pass){
            return done(null,AdminData)
        }
        else{
            return done(null, false)
        }
    }
    else{
        return done(null, false)
    }
}))
passport.serializeUser(function(user,done){
    return done(null,user.id);
})
passport.deserializeUser(async function(id,done){
    let user = await Admin.findById(id);
    if(user){
        return done(null,user);
    }
    else{
        return done(null,false)
    }
})

passport.setAuthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
}
passport.setAuthenticatedUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.admins = req.user;
    }
    next();
}
module.exports = passport;

