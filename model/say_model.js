const mongoose = require('mongoose');

const SaySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    content: {
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
       require:true
   }
},    {
   timestamps:true
})

const say = mongoose.model('say', SaySchema);
module.exports = say;
