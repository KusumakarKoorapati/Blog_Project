
const express = require('express');
const routes = express.Router();
const comment = require('../model/comment_model');
const CommentController = require('../controller/comment_controller');

routes.post('/insert_comment',comment.UploadeImage,CommentController.insertcomment);
routes.get('/DeleteRecord/:id',CommentController.DeleteRecord);
routes.post('/mulDel',CommentController.mulDel)


module.exports = routes