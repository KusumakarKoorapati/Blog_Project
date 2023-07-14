const mongoose = require('mongoose');
const multer = require('multer');
const AVTHAR_PATH = '/uploades/subcategory';
const path = require('path')

const SubcategorySchema = mongoose.Schema({
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
    category_id :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required : true
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

SubcategorySchema.statics.UploadeImage = multer({storage :ImageUpload}).single('image');
SubcategorySchema.statics.avtharpath = AVTHAR_PATH;


const subcategory = mongoose.model('subcategory',SubcategorySchema);
module.exports = subcategory;