const express = require('express');
const routes = express.Router();
const SayController = require('../controller/say_controller');


routes.get('/',SayController.Addsay);
routes.post('/insertRecornd',SayController.insertRecornd);
routes.get('/say_view',SayController.sayview);
routes.get('/DeleteRecord/:id',SayController.DeleteRecord);
routes.get('/UpdateRecord/:id',SayController.UpdateRecord);
routes.post('/EditRecord',SayController.EditRecord)

routes.post('/mulDel',SayController.mulDel)


module.exports = routes;