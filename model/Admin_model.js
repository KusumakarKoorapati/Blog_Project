const mongoose = require('mongoose');
const multer = require('multer');
const AVTHAR_PATH = '/uploades/admin';
const path = require('path')

const AdminSchema = mongoose.Schema({
    name :{
        type : String,
        required :true
    },
    email :{
        type : String,
        required :true
    },
    password :{
        type : String,
        required :true
    },
    hobby :{
        type : Array,
        required :true
    },
    gender :{
        type : String,
        required :true
    },
    city :{
        type : String,
        required :true
    },
    image :{
        type : String,
        required :true
    },
    description :{
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

AdminSchema.statics.UploadeImage = multer({storage :ImageUpload}).single('image');
AdminSchema.statics.avtharpath = AVTHAR_PATH;


const Admin = mongoose.model('Admin',AdminSchema);
module.exports = Admin;