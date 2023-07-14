const express = require('express');
const passport = require('passport');
const routes = express.Router();
const client = require('../model/client_model');
const ClientController = require('../controller/client_controller');


routes.get('/',ClientController.Addclient);
routes.post('/insertRecornd',client.UploadeImage,ClientController.insertRecornd);
routes.get('/client_view',ClientController.clientview);
routes.get('/DeleteRecord/:id',ClientController.DeleteRecord);
routes.get('/UpdateRecord/:id',ClientController.UpdateRecord);
routes.post('/EditRecord',client.UploadeImage,ClientController.EditRecord)

routes.post('/mulDel',ClientController.mulDel);



module.exports = routes;