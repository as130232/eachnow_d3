"use strict";
/*
    controller
*/
//此檔routes.js專門作為設定路徑用

var Member = require('./models/member');
var SleepTime = require('./models/sleepTime');

//每個js檔案都是一個模組,輸出一個function
module.exports = function (app) {
    /*
             三種請求參數
             params: 當url中存在/member/:no ，使用req.params.no才取的到值
             query: 當url中存在/member?no=XXX ，使用req.query.no才取的到值
             body:在物件中，常搭配於ajax中的data
    */
    app.get('/', function (req, res) {
        res.send('my first page');
    });

    // app.get('/about', function (req, res) {
    //     res.send('about page.');
    // });
    //取得所有會員(不包含睡眠時間)

    //member的複合查詢(不包含睡眠時間) 'memno000384'
    app.get('/member', function (req, res) {
        var params = removeEmptyQuery(req.query);
        let whereCondition = classificationQuery(params);
        Member.find(
            whereCondition.membersQuery,
            function (error, member) {
                if (error) {
                    return res.status(500)
                }
                res.json({
                    result: member,
                });
            });
    });

    //member的複合查詢(取得所有會員，但只包含一筆睡眠時間)
    app.get('/memberAndSleeptime', function (req, res) {
        //先移除空值的屬性
        let params = removeEmptyQuery(req.query);
        //再將複合查詢指令分別移至對應的Table 做查詢
        let whereCondition = classificationQuery(params);

        //Member.find(params)
        Member.find(whereCondition.membersQuery, { //whereCondition Query
                //設定 false 為不顯示該表格的的XX欄位
                "__v": false,
            })
            .then(function (members) {
                let promiseArr = [];
                members.forEach(function (member) {
                    member.sleepTimes = [];
                    //sleepTimesQuery多增加一個where屬性，才能讓該會員找到對應的睡眠時間
                    whereCondition.sleepTimesQuery.member_Id = member._id;
                    //whereCondition.sleepTimesQuery.startSleepMillisecond = {};
                    //whereCondition.sleepTimesQuery.startSleepMillisecond.$gt = 1451912400000;
                    //whereCondition.sleepTimesQuery.startSleepMillisecond.$lt = 1451934000000;
                    //whereCondition.sleepTimesQuery.startSleepMillisecond = {$gt:1451912400000, $lte:1451934000000};
                    promiseArr.push(SleepTime.find(whereCondition.sleepTimesQuery, { //whereQuery.sleepTimesQuery為塞選條件
                            //設定 false 為不顯示該表格的的XX欄位
                            "_id": false,
                            "member_Id": false,
                            "__v": false,
                            //"isSleepIn":false,  //不需查直接根據sleepInTime是否有值，sleepInTime > 0表是有賴床
                            "startSleepTime": false, //可以根據startSleepMillisecond轉換成日期，所以不需要查詢
                        })
                        //.skip(364)  //跳過幾個值
                        .limit(1)
                        .then(function (sleepTimes) {
                            member.sleepTimes = sleepTimes;
                            return member;
                        }));
                });

                return Promise.all(promiseArr);
            })
            .then(function (result) {
                res.json({
                    result: result,
                });
            });
    });

    //member的複合查詢(包含所有睡眠時間)
    app.get('/memberAndSleeptimes', function (req, res) {
        let params = removeEmptyQuery(req.query);
        let whereCondition = classificationQuery(params);
        Member.find(whereCondition.membersQuery, { //whereCondition Query
                //設定 false 為不顯示該表格的的XX欄位
                "__v": false,
            })
            .then(function (members) {
                let promiseArr = [];
                members.forEach(function (member) {
                    member.sleepTimes = [];
                    //sleepTimesQuery多增加一個where屬性，才能讓該會員找到對應的睡眠時間
                    whereCondition.sleepTimesQuery.member_Id = member._id;

                    promiseArr.push(SleepTime.find(whereCondition.sleepTimesQuery, { //whereCondition Query
                            //設定 false 為不顯示該表格的的XX欄位
                            "_id": false,
                            "member_Id": false,
                            "__v": false,
                            //"isSleepIn":false,
                            //"startSleepTime": false, //可以根據startSleepMillisecond轉換成日期，所以不需要查詢
                        })
                        .then(function (sleepTimes) {
                            member.sleepTimes = sleepTimes;
                            return member;
                        })
                    );
                });
                return Promise.all(promiseArr);
            })
            .then(function (result) {
                res.json({
                    result: result,
                });
            });
    });


    //sleepTimes的複合查詢(不包含會員)
    app.get('/sleeptimes', function (req, res) {
        let params = removeEmptyQuery(req.query);
        let whereCondition = classificationQuery(params);
        SleepTime.find(
            whereCondition.sleepTimesQuery,
            function (error, sleepTime) {
                if (error) {
                    return res.status(500)
                }
                res.json({
                    result: sleepTime,
                });
            });
    });

    //所有會員總睡眠、平均總睡眠，總賴床 or 平均賴床時間(包含對應會員資料)
    //非根據上述的query查詢，是直接在url中改值
    //http://localhost:3000/sleepTimes/sum/sleepInTime
    app.get('/sleepTimes/:totalOrAvg/:totalSleepTimeOrSleepInTime', function (req, res) {
        let totalOrAvg = req.params.totalOrAvg;
        let totalSleepTimeOrSleepInTime = req.params.totalSleepTimeOrSleepInTime;

        let totalSleepTime = {};
        if (totalOrAvg == "sum") {
            totalSleepTime = {
                "$sum": '$' + totalSleepTimeOrSleepInTime
            };
        } else if (totalOrAvg == "avg") {
            totalSleepTime = {
                "$avg": '$' + totalSleepTimeOrSleepInTime
            };
        }
        SleepTime.aggregate(
           [{
                    "$group": {
                        "_id": "$member_Id",
                        "sleepTime": totalSleepTime,
                        //"sleepTime":{"$avg":'$totalSleepTime'},
                    }
            }]
            )
            .then(function (sleeptimes) {
                let promiseArr = [];
                sleeptimes.forEach(function (sleeptime) {
                    sleeptime.member = {};
                    promiseArr.push(Member.find(sleeptime._id, { //whereQuery.sleepTimesQuery為塞選條件
                            "_id": false,
                            "__v": false,
                            "sleepTimes": false,
                        })
                        .then(function (member) {
                            sleeptime.member = member;
                            return sleeptime;
                        }));
                });
                return Promise.all(promiseArr);
            })
            .then(function (result) {
                res.json({
                    result: result,
                });
            });

    });


    //取得睡眠資訊次數，例:全會員總共賴床或沒有賴床次數
    //http://localhost:3000/sleepTimesCount?isSleepIn=Y
    app.get('/sleepTimesCount', function (req, res) {
        let params = removeEmptyQuery(req.query);
        let whereCondition = classificationQuery(params);
        SleepTime.find(whereCondition.sleepTimesQuery)
            .count()
            .exec(function (error, sleepTimes) {
                if (error) {
                    return res.status(500)
                }
                res.json({
                    result: sleepTimes,
                });
            });
    });

    

    //取得全會員總共賴床次數 >地形圖顯示所有資訊
    //query: 當url中存在/member?no=XXX ，使用req.query.no才取的到值
    app.get('/sleepTimes/sleepInCount', function (req, res) {
        SleepTime.find({
                isSleepIn: 'Y',
            })
            .count()
            .exec(function (error, sleepTimes) {
                if (error) {
                    return res.status(500)
                }
                res.json({
                    result: sleepTimes,
                });
            });
    });

    app.get('/findTaipeiMembersHasSleepIn', function (req, res) {
        SleepTime.find({
            isSleepIn: 'Y',
            //totalSleepTime:3858291,
            member_Id: "589db96ea893f829d88fc2b5",
        })

        .populate({
            path: 'member_Id',
            match: {
                //address: '台北市',
            }
        })

        .exec(function (error, sleepTimes) {
            if (error) {
                return res.status(500)
            }
            res.json({
                result: sleepTimes,
            });
        });
    });

    app.get('/test', function (req, res) {
        var resultArray = [];
        var resultObject = {};
        Member.find({
            address: '台東縣',
            //_id : '588396f580d09b0e2869d454',
        }, function (error, members) {
            //每個會員再藉由PK(_id)去查詢關聯SleepTime中的memberId
            members.forEach(function (member) {
                for (let i = 0; i < members.length; i++) {
                    let member = members[i];
                    resultObject = member;
                    resultObject.sleepTimes = [];
                    //console.log('member._id:' + member._id);
                    SleepTime.find({
                        memberId: member.memberId,
                    }, function (error, sleepTimes) {
                        resultObject.sleepTimes = sleepTimes;
                        //console.log('resultObject.sleepTimes : ' + resultObject.sleepTimes);
                    });
                    resultArray.push(resultObject);
                }
            });
            if (error) {
                return res.status(500)
            }
            res.json({
                result: resultArray,
            });
        });
    });

    app.get('/test2', function (req, res) {
        Member.find({
                address: '台東縣',
                _id: "589db96ea893f829d88fc321",

            })
            .then(function (members) {
                let promiseArr = [];
                members.forEach(function (member) {
                    member.sleepTimes = [];
                    promiseArr.push(SleepTime
                        .find({
                            member_Id: member._id,
                            isSleepIn: 'Y',
                        })
                        .then(function (sleepTimes) {
                            member.sleepTimes = sleepTimes;
                            //console.log('resultObject.sleepTimes : ' + member.sleepTimes);
                            return member;
                        }));
                });

                return Promise.all(promiseArr);
            })
            .then(function (result) {
                //                if (error) {
                //                    return res.status(500)
                //                }
                //console.log('data.size:' + result.length());
                res.json({
                    result: result,
                });
            });

    });

    /*
    app.get('/test', function (req, res) {
        var resultArray = [];
        var resultObject = {};
        
        Member.find({
            address: '台北市',
            //_id : '588396f580d09b0e2869d454',
        }, function (error, members) {
            //每個會員再藉由PK(_id)去查詢關聯SleepTime中的memberId

            members.forEach(function (member) {
                resultObject = member;
                resultObject.sleepTimes = [];
                //console.log('member._id:' + member._id);

                SleepTime.find({
                    memberId: member._id,
                }, function (error, sleepTimes) {
                    resultObject.sleepTimes = sleepTimes;
                    console.log('resultObject.sleepTimes : ' + resultObject.sleepTimes);
                });

                resultArray.push(resultObject);
            });
            if (error) {
                return res.status(500)
            }
            res.json({
                result: resultArray,
            });
        });
        

        
        Member.find({ 
            //address : '台北市'
            _id : '588396f580d09b0e2869d454',
        })
        .populate({path: 'sleepTimes', select: {memberId: '588396f580d09b0e2869d454'}})
        .exec(function(error, member){
            console.log(member);
            if(error) {
                return res.status(500)
            }
            res.json({
                members: member,
            });
        });
        
        
       
    }
    */
    function removeEmptyQuery(params) {
        //let multiQueryArray = [];
        for (var paramProperty in params) {
            let value = params[paramProperty];
            //console.log('key:', paramProperty);
            //console.log('value:', value);
            //判斷是否為空字串、null，若為空值將此key刪除
            if (!value) {
                //                    let queryObj = {
                //                        paramProperty: value
                //                    };
                //                    multiQueryArray.push(queryObj);
                delete params[paramProperty];
                //console.log('result:', params[paramProperty]);
            }
        }
        return params;
    }

    function classificationQuery(params) {
        let whereCondition = {};
        whereCondition.membersQuery = {};
        whereCondition.sleepTimesQuery = {};
        for (var paramProperty in params) {
            let value = params[paramProperty];
            //判斷value中是否有 條件判斷的指令，有的話再多包一層物件
            value = operationQuery(value);

            //Set key and value
            switch (paramProperty) {
                //membersQuery        
            case "name":
                whereCondition.membersQuery.name = value;
                break;
            case "gender":
                whereCondition.membersQuery.gender = value;
                break;
            case "birth":
                whereCondition.membersQuery.birth = value;
                break;
            case "address":
                whereCondition.membersQuery.address = value;
                break;
            case "job":
                whereCondition.membersQuery.job = value;
                break;
            case "memberNo":
                whereCondition.membersQuery.memberNo = value;
                break;
                //sleeptimesQuery   
            case "member_Id":
                whereCondition.sleepTimesQuery.member_Id = value;
                break;
            case "startSleepTime":
                whereCondition.sleepTimesQuery.startSleepTime = value;
                break;
            case "startSleepMillisecond":
                whereCondition.sleepTimesQuery.startSleepMillisecond = value;
                break;
            case "endSleepTime":
                whereCondition.sleepTimesQuery.endSleepTime = value;
                break;
            case "totalSleepTime":
                whereCondition.sleepTimesQuery.totalSleepTime = value;
                break;
            case "isSleepIn":
                whereCondition.sleepTimesQuery.isSleepIn = value;
                break;
            case "sleepInTime":
                whereCondition.sleepTimesQuery.sleepInTime = value;
                break;
            }

        }
        return whereCondition;
    }

    //判斷value中是否有條件指令
    function operationQuery(value) {
        //若有條件指令將要多包一層物件
        var valueObj = {};
        //去除掉運算指令只有值的新value, 沒有值的話就是預設是0
        var newValue = 0;


        //同時間擁有大於某值 和 小於某值，ex: $gte1451912400000,$lte1451934000000 
        //轉成物件 => startSleepMillisecond = {$gte:1451912400000, $lte:1451934000000};
        if (value.indexOf('$gte') != (-1) && value.indexOf('$lte') != (-1)) {
            //先透過,將其分割成兩個陣列元素
            let strArray = value.split(',');
            //在解析個別字串，建立對應的鍵值對
            strArray.forEach(function (str) {
                if (str.indexOf('$gte') != (-1)) {
                    newValue = str.replace("$gte", "");
                    valueObj.$gte = newValue;
                } else if (str.indexOf('$lte') != (-1)) {
                    newValue = str.replace("$lte", "");
                    valueObj.$lte = newValue;
                }
            });
            //小於等於
        } else if (value.indexOf('$lte') != (-1)) {
            newValue = value.replace("$lte", "");
            valueObj.$lte = newValue;
            //小於
        } else if (value.indexOf('$lt') != (-1)) {
            newValue = value.replace("$lt", "");
            valueObj.$lt = newValue;
            //大於等於    
        } else if (value.indexOf('$gte') != (-1)) {
            newValue = value.replace("$gte", "");
            valueObj.$gte = newValue;
            //大於等於     
        } else if (value.indexOf('$gt') != (-1)) {
            newValue = value.replace("$gt", "");
            valueObj.$gt = newValue;
            //不等於    
        } else if (value.indexOf('$ne') != (-1)) {
            newValue = value.replace("$ne", "");
            valueObj.$ne = newValue;
        }


        //若依然是0表示沒有改變值，即沒有條件計算指令，回傳原值
        if (newValue == 0) {
            return value;
        } else {
            return valueObj;
        }
    }
};