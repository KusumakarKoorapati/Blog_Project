const mongoose = require('mongoose');
const multer = require('multer');
const AVTHAR_PATH = '/uploades/team';
const path = require('path')

const TeamSchema = mongoose.Schema({
    name :{
        type : String,
        required :true
    },
    post :{
        type : String,
        required :true
    },
    About :{
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

TeamSchema.statics.UploadeImage = multer({storage :ImageUpload}).single('image');
TeamSchema.statics.avtharpath = AVTHAR_PATH;


const team = mongoose.model('team',TeamSchema);
module.exports = team;