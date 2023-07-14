const express = require('express');
const routes = express.Router();
const CategoryController = require('../controller/category_controller');


routes.get('/',CategoryController.Addcategory);
routes.post('/insertRecornd',CategoryController.insertRecornd);
routes.get('/category_view',CategoryController.categoryview);
routes.get('/DeleteRecord/:id',CategoryController.DeleteRecord);
routes.get('/UpdateRecord/:id',CategoryController.UpdateRecord);
routes.post('/EditRecord',CategoryController.EditRecord)

routes.post('/mulDel',CategoryController.mulDel)


module.exports = routes;