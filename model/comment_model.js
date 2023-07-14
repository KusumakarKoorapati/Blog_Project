
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const AVTHAR_PATH = '/uploades/comment';

const CommentSchema = mongoose.Schema({
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog',
        required:true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }, 
    date:{
        type:String,
        required:true
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog',
        required:true
    },
    image: {
        type: String,
        required: true
    },
     createdAt:{
        type: String,
        required: true
    },
    updatedAt:{
        type: String,
        required: true
    },
    isActive:{
        type:Boolean,
        required:true
    }
},    {
    timestamps:true
})

const ImageUpload = multer.diskStorage({
    destination : function(req,file,cd){
        cd(null,path.join(__dirname,'..',AVTHAR_PATH))
    },
    filename : function(req,file,cd){
        cd(null,file.fieldname+'-'+Date.now())
    }
})

CommentSchema.statics.UploadeImage = multer({storage :ImageUpload}).single('image');
CommentSchema.statics.avtharpath = AVTHAR_PATH;


const comment = mongoose.model('comment',CommentSchema);
module.exports = comment;
