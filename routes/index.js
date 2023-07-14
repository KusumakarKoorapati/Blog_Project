const express = require('express');
const routes = express.Router();
const Admin = require('../model/Admin_model')
const AdminController = require('../controller/admin_controller')
const passport = require('passport');


routes.get('/',AdminController.login);


// ------- forget start
routes.get('/forget_email_page',(req,res)=>{res.render('forget_email')})
routes.post('/forget_email',AdminController.forget_email);
routes.get('/otp_page',(req,res)=>{res.render('forget_otp')});
routes.post('/forget_otp',AdminController.forget_otp);
routes.get('/forget_password',(req,res)=>{res.render('forget_password')}); 
routes.post('/forget_password',AdminController.forget_password);
// forget end ------- 


routes.post('/CheckLogin',passport.authenticate('local',{failureRedirect :"/"}),AdminController.CheckLogin)
routes.get('/logout',passport.setAuthenticated,AdminController.logout);
routes.get('/dashbord',passport.setAuthenticated,AdminController.dashbord);
routes.get('/add_admin',passport.setAuthenticated,AdminController.addadmin)
routes.get('/view_admin',passport.setAuthenticated,AdminController.viewadmin);
routes.post('/insertRecord',passport.setAuthenticated,Admin.UploadeImage,AdminController.insertRecord);
routes.get('/DeleteRecord/:id',passport.setAuthenticated,Admin.UploadeImage,AdminController.DeleteRecord);
routes.get('/UpdateRecord/:id',passport.setAuthenticated,AdminController.UpdateRecord)
routes.post('/EditRecord',passport.setAuthenticated,Admin.UploadeImage,AdminController.EditRecord)
routes.get('/chengePassword',passport.setAuthenticated,AdminController.chengePassword)
routes.post('/modifyPassword',passport.setAuthenticated,AdminController.modifyPassword)
routes.get('/Profile',passport.setAuthenticated,AdminController.Profile);

routes.use('/user',require('./user'));
routes.use('/comment',require('./comment'));

routes.use('/slider',passport.setAuthenticated,require('./slider'));
routes.use('/offer',passport.setAuthenticated,require('./offer'));
routes.use('/rec_img',passport.setAuthenticated,require('./rec_img'));
routes.use('/say',passport.setAuthenticated,require('./say'));
routes.use('/blog',passport.setAuthenticated,require('./blog'));
routes.use('/category',passport.setAuthenticated,require('./category'));
routes.use('/subcategory',passport.setAuthenticated,require('./subcategory'));
routes.use('/team',passport.setAuthenticated,require('./team'));
routes.use('/client',passport.setAuthenticated,require('./client'));


module.exports = routes;