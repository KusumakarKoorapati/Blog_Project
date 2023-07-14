const express = require('express');
const port = 8011;
const app = express();
const path = require('path')

// const db = require('./config/mongoose');
const mongoose = require('mongoose')

const url = `mongodb+srv://kusumakarkoorapati:Kusu503@cluster0.7pyntq7.mongodb.net/Adminpanel-passport`;

mongoose.connect(url,{
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
  .then( () => {
    console.log('Connected to database')
  })
  .catch( (err) => {
    console.error(`Error connecting to the database.`);
  })










const Admin = require('./model/Admin_model');

const passportLocal = require('./config/passport_local-stratagey');
const passport = require('passport');
const session = require('express-session');

// const cookieparser = require('cookie-parser')
// app.use(cookieparser());
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded())

app.use(express.static('assets'))
app.use(express.static('user_assets'));
app.use('/uploades',express.static(path.join(__dirname,'uploades')));


app.use(session({
    name :'passport',
    secret : 'pass',
    resave :false,
    saveUninitialized :false,
    Cookie :{
        maxAge :1000*60*60
    }
}))
app.use(passport.initialize())
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'))
app.listen(port,(err)=>{
    if(err){
        console.log("server is not Runnig")
        return false;
    }
    console.log("Server is runnig on port:",port)
})