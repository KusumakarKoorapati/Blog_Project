const mongoose = require('mongoose');
const multer = require('multer');
const AVTHAR_PATH = '/uploades/slider';
const path = require('path')

const SliderSchema = mongoose.Schema({
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

SliderSchema.statics.UploadeImage = multer({storage :ImageUpload}).single('image');
SliderSchema.statics.avtharpath = AVTHAR_PATH;


const Slider = mongoose.model('Slider',SliderSchema);
module.exports = Slider;