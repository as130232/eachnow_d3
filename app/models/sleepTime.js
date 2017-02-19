/*
    Model
*/
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SleepTime = Schema({
    //關聯FK
    
    /*
    memberId:{
        type:String,
        //unique:false,
    },
    */
    
    member_Id:{
        type: Schema.Types.ObjectId, ref: 'Member',
    },
    
    //開始睡眠時間(日期)
    startSleepTime:{
        type:String,
    },
    
    //開始睡眠時間(毫秒)
    startSleepMillisecond:{
        type:Number,
    },
    
    //結束睡眠時間
    endSleepTime:{
        type:String,
    },
    
    //結束睡眠時間(毫秒)
    endSleepMillisecond:{
        type:Number,
    },
    
    //總共睡眠時間
    totalSleepTime:{
        type:Number,
    },
    
    //是否有賴床
    isSleepIn:{
        type:String,
    },
    
    //若有賴床，賴床時間
    sleepInTime:{
        type:Number,
        //default:0,
    }
});

//建立model 'Member'即table
module.exports = mongoose.model('SleepTime', SleepTime);