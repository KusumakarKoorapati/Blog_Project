const mongoose = require('mongoose');
const multer = require('multer');
const AVTHAR_PATH = '/uploades/blog';
const path = require('path')

const BlogSchema = mongoose.Schema({
    title :{
        type : String,
        required :true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    category : {
        type :String,
        required : true
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

BlogSchema.statics.UploadeImage = multer({storage :ImageUpload}).single('image');
BlogSchema.statics.avtharpath = AVTHAR_PATH;


const blog = mongoose.model('blog',BlogSchema);
module.exports = blog;