const mongoose = require("mongoose");
const { Schema } = mongoose

const Userschema = new Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        Password:{
            type:String,
            requred:true
        },
        date:{
            type:Date,
            default:Date.now
            },
  }
);
const User = mongoose.model('userschema', Userschema);
module.exports = User