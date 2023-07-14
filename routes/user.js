const express = require('express')
const routes = express.Router();

const userController = require('../controller/userController');

routes.get('/',userController.index);

routes.get('/blog_single',userController.blogsingle)

routes.get('/gallery',userController.gallery);

routes.get('/service',userController.service)

routes.get('/blog',userController.blog1)

routes.get('/about',userController.about)

routes.get('/contact',userController.contact)

routes.post('/contact_mail',userController.contact_mail)

module.exports = routes;
