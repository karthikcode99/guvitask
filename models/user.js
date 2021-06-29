const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
    const userSchema=new Schema({
        username:{
         type:String,
         required:[true, 'Username cannot blank']
        },
        email:{
            type:String,
        // required:[true, 'Email cannot blank']
        },
        password:{
            type:String,
            // required:[true, 'Password cannot blank']
        } 
})
userSchema.plugin(passportLocalMongoose)
const User=mongoose.model('User',userSchema);
module.exports=User;
