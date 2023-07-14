const express = require('express');
const passport = require('passport');
const routes = express.Router();
const subcategory = require('../model/subcategory_model');
const SubcategoryController = require('../controller/subcategory_controller');


routes.get('/',SubcategoryController.Addsubcategory);
routes.post('/insertRecornd',subcategory.UploadeImage,SubcategoryController.insertRecornd);
routes.get('/subcategory_view',SubcategoryController.subcategoryview);
routes.get('/DeleteRecord/:id',SubcategoryController.DeleteRecord);
routes.get('/UpdateRecord/:id',SubcategoryController.UpdateRecord);
routes.post('/EditRecord',subcategory.UploadeImage,SubcategoryController.EditRecord)

routes.post('/mulDel',SubcategoryController.mulDel);



module.exports = routes;