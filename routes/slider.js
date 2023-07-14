const express = require('express');
const passport = require('passport');
const routes = express.Router();
const Slider = require('../model/slider_model');
const SliderController = require('../controller/slider_controller');


routes.get('/',SliderController.Addslider);
routes.post('/insertRecornd',Slider.UploadeImage,SliderController.insertRecornd);
routes.get('/slider_view',SliderController.sliderview);
routes.get('/DeleteRecord/:id',SliderController.DeleteRecord);
routes.get('/UpdateRecord/:id',SliderController.UpdateRecord);
routes.post('/EditRecord',Slider.UploadeImage,SliderController.EditRecord)

routes.post('/mulDel',SliderController.mulDel);



module.exports = routes;