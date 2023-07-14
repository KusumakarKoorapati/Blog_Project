const express = require('express');
const routes = express.Router();
const OfferController = require('../controller/offer_controller');


routes.get('/',OfferController.Addoffer);
routes.post('/insertRecornd',OfferController.insertRecornd);
routes.get('/offer_view',OfferController.offerview);
routes.get('/DeleteRecord/:id',OfferController.DeleteRecord);
routes.get('/UpdateRecord/:id',OfferController.UpdateRecord);
routes.post('/EditRecord',OfferController.EditRecord)

routes.post('/mulDel',OfferController.mulDel)


module.exports = routes;