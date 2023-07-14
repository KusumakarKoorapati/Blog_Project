const express = require('express');
const passport = require('passport');
const routes = express.Router();
const blog = require('../model/blog_model');
const BlogController = require('../controller/blog_controller');


routes.get('/',BlogController.Addblog);
routes.post('/insertRecornd',blog.UploadeImage,BlogController.insertRecornd);
routes.get('/blog_view',BlogController.blogview);
routes.get('/DeleteRecord/:id',BlogController.DeleteRecord);
routes.get('/UpdateRecord/:id',BlogController.UpdateRecord);
routes.post('/EditRecord',blog.UploadeImage,BlogController.EditRecord)

routes.post('/mulDel',BlogController.mulDel);

routes.get('/view_comment',BlogController.view_comment)


module.exports = routes;