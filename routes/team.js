const express = require('express');
const passport = require('passport');
const routes = express.Router();
const team = require('../model/team_model');
const teamController = require('../controller/team_controller');


routes.get('/',teamController.Addteam);
routes.post('/insertRecornd',team.UploadeImage,teamController.insertRecornd);
routes.get('/team_view',teamController.teamview);
routes.get('/DeleteRecord/:id',teamController.DeleteRecord);
routes.get('/UpdateRecord/:id',teamController.UpdateRecord);
routes.post('/EditRecord',team.UploadeImage,teamController.EditRecord)

routes.post('/mulDel',teamController.mulDel);



module.exports = routes;