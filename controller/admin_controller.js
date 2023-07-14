const Admin = require('../model/Admin_model')
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});
module.exports.login = async (req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/dashbord')
    }
    else{
        return res.render('login')
    }
}

// forget password start
var email_id = ``;
module.exports.forget_email = async (req, res) => {

    try {
        let email = await Admin.findOne({ email: req.body.email });
        email_id = email.email;
        var otp = Math.ceil(Math.random() * 100000);
        if (email) {
            var transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "ea19293856fa8c",
                    pass: "268d734f50c217"
                }
            });
            let info = await transporter.sendMail({
                from: 'koorapatikusmakar5@gmial.com', // sender address
                to: "kusumakarrnw@gmail.com", // list of receivers
                subject: "your otp ", // Subject line
                text: ` `, // plain text body
                html: `<h1>your otp is  : ${otp}</h1>`, // html body"
            });

            var cookie_otp = await bcrypt.hash(otp.toString(), 10);
            res.cookie('otp', cookie_otp);
            res.redirect('/otp_page');
        } else {
            req.flash('error', "invalid email");
            req.flash('sucess', 'otp sended in ypur email ');
            return res.redirect('/otp_page');
        }
    } catch (err) {
        console.log('', err);
    }
}


module.exports.forget_otp = async (req, res) => {
    if (await bcrypt.compare(req.body.otp, req.cookies.otp)) {
        res.redirect('/forget_password');
    } else {
        console.log("some err ")
    }
}

module.exports.forget_password = async (req, res) => {
    try {
        let data = await Admin.findOne({ email: email_id });
        if (req.body.new_password == req.body.con_password) {
            let pass=await bcrypt.hash(req.body.new_password,10);
            let changed = await Admin.findByIdAndUpdate(data.id, { password: pass })
            if(changed){
                res.redirect('/')
            }
        }
        else{
            req.flash('error','password not same ')
            res.redirect('back');
        }
    } catch (err) {
        console.log('forget password ', err);
    }
}
// forget password end


module.exports.logout = async (req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    })
    // return res.redirect('/')
}
module.exports.CheckLogin = async(req,res)=>{
    // console.log(req.body)
    let admindata = await Admin.findOne({email:req.body.email});
    if(admindata){
        let passcheck = await bcrypt.compare(req.body.password,admindata.password)
        if(passcheck){
            return res.redirect('/dashbord')
        }else{
            console.log("Input Invalid");
        }
    }else{
        console.log("Input Invalid");
    }
    
}
module.exports.dashbord = async (req,res)=>{
    return res.render('dashbord');
   

    
}
module.exports.viewadmin = async (req,res)=>{
    // return res.render('view_admin')
        let data = await Admin.find({})
        if(data){
            return res.render('view_admin',{
                'Admindata' : data,
            })
        }
        else{
            console.log("somthing error")
        }
       
}
module.exports.addadmin = async(req,res)=>{
    return res.render('add_admin',{
    });
   
}
module.exports.insertRecord = async (req,res)=>{
    console.log(req.body)
    console.log(req.file)
   try{
    var imagepath = '';
    if(req.file){
        imagepath =  Admin.avtharpath+'/'+req.file.filename;
    }
    req.body.image = imagepath;
    req.body.name = req.body.fname+" "+req.body.lname;
    // console.log(req.body.password);
    let pass = await bcrypt.hash(req.body.password,10)
    // console.log(pass);
    req.body.password = pass ;

    console.log(req.body)
    req.body.createdAt = nDate;
    req.body.updatedAt = nDate;
    req.body.isActive = true;
    let record = await Admin.create(req.body);
    if(record){
        return res.redirect('back')
    }
    else{
        console.log(record)
    }
   }
   catch(err){
    console.log(err)
   }
}
module.exports.DeleteRecord = async (req,res)=>{
    try{
            let data = await Admin.findById(req.params.id);
        if(data){
            var imagepath = path.join(__dirname,'..',data.image);
            // console.log(imagepath);
            if(imagepath){
                fs.unlinkSync(imagepath);
            }
        }
        let AdminData = await Admin.findByIdAndDelete(req.params.id);
        if(AdminData){
            return res.redirect('back')
        }
        else{
            console.log("Soming Wrong");
            return res.redirect('back')
        }
    }
    catch(err){
        console.log(err);
    }
}
module.exports.UpdateRecord = async (req,res)=>{
    try{
        let data = await Admin.findById(req.params.id);
        if(data){
            return res.render('update',{
                "SingleAdmin" :data,

            })
        }
    }catch(error){
        console.log("Update page lode error in catch");
    }
}
module.exports.EditRecord = async (req,res)=>{
    let adminID = req.body.EdtID;
    try{
        if(req.file){
            let data = await Admin.findById(adminID)
            if(data){
                let imgpath = path.join(__dirname,'..',data.image);
                fs.unlinkSync(imgpath);

                let newpath = Admin.avtharpath+'/'+req.file.filename;
                req.body.image = newpath;
                req.body.name = req.body.fname+ " "+req.body.lname;

                let update = await Admin.findByIdAndUpdate(adminID,req.body);
                if(update){
                    return res.redirect('/view_admin')
                }
                else{
                    console.log("data not Updated(1st)");
                }
            }
        }else{
            let data = await Admin.findById(adminID) 
            if(data){
                req.body.image = data.image;
                req.body.name = req.body.fname+ " "+req.body.lname;
                let nDate = new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Calcutta'
                });
                let upadate = await Admin.findByIdAndUpdate(adminID,req.body);
                if(upadate){
                    return res.redirect('/view_admin');
                }
                else{
                    console.log("data not Updated (2nd)");
                }
            }else{
                console.log("Update data not Found in (2nd)");
            }
        }
    }catch(error){
        console.log("In Edit page error coming");
    }
}
module.exports.chengePassword = async (req,res)=>{
    return res.render('chengePassword')
}
module.exports.modifyPassword = async (req,res)=>{
    let current = req.body.current;
    // console.log(current)
    if(await bcrypt.compare(current,req.cookies.id.password)){
        if(req.body.current != req.body.npass){
            if(req.body.npass == req.body.cpass){
                // console.log(req.body.npass);
                let pass = await bcrypt.hash(req.body.npass,10)
                let Adpass = await Admin.findByIdAndUpdate(req.cookies.id._id,{password :pass})
                if(Adpass){
                    return res.redirect('/logout')
                }
                else{
                    console.log("Somthing Wrong");
                    return res.redirect('back')
                }
            }
            else{
                console.log("New And Confirm Password not match");
                return res.redirect('back')
            }
        }
        else{
            console.log("New And Currrent Password is same!");
            return res.redirect('back')
        }
    }
    else{
        console.log("Current Password not Match");
        return res.redirect('back')
    }
}
module.exports.Profile = async(req,res)=>{
    return res.render('profile')
}