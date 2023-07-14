const mongoose = require('mongoose');
const multer = require('multer');
const AVTHAR_PATH = '/uploades/rec_img';
const path = require('path')

const rec_imgSchema = mongoose.Schema({
    title :{
        type : String,
        required :true
    },
    content :{
        type : String,
        required :true
    },
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

rec_imgSchema.statics.UploadeImage = multer({storage :ImageUpload}).single('image');
rec_imgSchema.statics.avtharpath = AVTHAR_PATH;


const rec_img = mongoose.model('rec_img',rec_imgSchema);
module.exports = rec_img;