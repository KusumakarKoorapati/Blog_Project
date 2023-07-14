const express = require('express');
const passport = require('passport');
const routes = express.Router();
const rec_img = require('../model/rec_img_model');
const RecentContoller = require('../controller/rec_img_controller');


routes.get('/',RecentContoller.Add_rec_img);
routes.post('/insertRecornd',rec_img.UploadeImage,RecentContoller.insertRecornd);
routes.get('/rec_img_view',RecentContoller.rec_imgview);
routes.get('/DeleteRecord/:id',RecentContoller.DeleteRecord);
routes.get('/UpdateRecord/:id',RecentContoller.UpdateRecord);
routes.post('/EditRecord',rec_img.UploadeImage,RecentContoller.EditRecord)

routes.post('/mulDel',RecentContoller.mulDel);



module.exports = routes;