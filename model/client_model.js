const mongoose = require('mongoose');
const multer = require('multer');
const AVTHAR_PATH = '/uploades/client';
const path = require('path')

const ClientSchema = mongoose.Schema({
    image :{
        type : String,
        required :true
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
        require:true
    }
},{
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

ClientSchema.statics.UploadeImage = multer({storage :ImageUpload}).single('image');
ClientSchema.statics.avtharpath = AVTHAR_PATH;


const client = mongoose.model('client',ClientSchema);
module.exports = client;