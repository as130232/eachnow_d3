/*
    Model
*/
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Member = Schema({
    
    name:{
        type:String,
        //unique:false,
    },
    //nodeJS中沒有int
    gender:{
        type:String,
    },
    
    birth:{
        type:String,
    },
    
    address:{
        type:String,
    },
    
    job:{
        type:String,
    },
    //關聯至
    
    sleepTimes : [{ 
        type: Schema.Types.ObjectId, ref: 'SleepTime', 
    }],
    
    
    memberNo:{
        type: String, ref: 'SleepTime',
        unique:true,
    },
});

//建立model 'Member'即table
module.exports = mongoose.model('Member', Member);