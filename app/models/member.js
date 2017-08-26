/*
    Model
*/
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Member = Schema({

    name: {
        type: String,
        //unique:false,
    },
    //nodeJS中沒有int
    gender: {
        type: String,
    },

    birth: {
        type: String,
    },

    address: {
        type: String,
    },

    job: {
        type: String,
    },
    //關聯至

    sleepTimes: [{
        type: Schema.Types.ObjectId,
        ref: 'SleepTime',
    }],


    memberNo: {
        type: String,
        ref: 'SleepTime',
        unique: true,
    },

    //facebook資訊

    email: {
        type: String,
        unique: true,
        lowerrcase: true
    },
    //藉由令牌(token)與Facebook索取資料
    token: String,
    facebook: String,
    //基本資料
    profile: {
        username: {
            type: String,
            default: ''
        },
        picture: {
            type: String,
            default: ''
        }
    },
    //傳輸資料
//    data: {
//        totalValue: {
//            type:Number,
//            default:0
//        },
//        //購物車陣列 包含產品 數量
//        cart: [{
//            product: {
//                type:mongoose.Schema.Type.ObjectId,
//                ref:'Product'
//            },
//            quantity: {
//                type:Number,
//                default: 1,
//                min:1
//            },
//            subtotal: {
//                type:Number,
//                default: 0,
//                min:0
//            }
//        }]
//    }
});

//建立model 'Member'即table
module.exports = mongoose.model('Member', Member);