const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const propSchema=new Schema({
    name:{
     type:String,
    //  required:[true, 'Username cannot blank']
    },
     dob:{
        type:String,
    // required:[true, 'Email cannot blank']
    },
    age:{
        type:Number,
        // required:[true, 'Password cannot blank']
    }, 
    gender:{
        type:String,
    },
    mobile:{
        type:Number,
    }
})
const Prop=mongoose.model('Prop',propSchema);
module.exports=Prop;