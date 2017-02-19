/*
    較特殊
*/
var router = require('express').Router();


var Member = require('../app/models/member');
//import SleepTimeBean
var SleepTime = require('../app/models/sleepTime');

//獲取今天是今年的第幾天
var toDayisTheFewDays = getDays(new Date());

//每個會員共有 maxInsertSleepTimesSize 筆睡眠資料
var maxInsertSleepTimesSize = 366 + toDayisTheFewDays;

router.get('/insertMembersSleepTimes', function (req, res, next) {

    //先抓出所有會員
    Member.find({}, function (error, members) {
        var memberCount = 0;
        //每個會員輪巡增加 maxInsertSleepTimesSize 筆睡眠資料
        members.forEach(function (member) {
            var memId = member._id;
            //var incrementCount = 0;

            //第一次執行為0,利用maxInsertSleepTimesSize(十年前)，遞增，讓天數一筆一筆往後增加假資料
            var incrementCount = -maxInsertSleepTimesSize;
            //console.log('incrementCount:' + incrementCount);
            console.log('新增第 ' + (memberCount + 1) + '個會員');
            for (var i = 0; i < maxInsertSleepTimesSize - toDayisTheFewDays; i++) {

                var sleepTime = new SleepTime();
                var sleepTimeObject = {};
                sleepTimeObject = getSleepTimeInfo(incrementCount);
                sleepTime.member_Id = memId;
                //sleepTime.memberId = member.memberNo;
                sleepTime.startSleepTime = sleepTimeObject.startSleepTime;
                sleepTime.startSleepMillisecond = sleepTimeObject.startSleepMillisecond;
                sleepTime.endSleepTime = sleepTimeObject.endSleepTime;
                sleepTime.endSleepMillisecond = sleepTimeObject.endSleepMillisecond;
                sleepTime.totalSleepTime = sleepTimeObject.totalSleepTime;
                sleepTime.isSleepIn = sleepTimeObject.isSleepIn;
                sleepTime.sleepInTime = sleepTimeObject.sleepInTime;
                sleepTime.save();
                //console.log('sleepTime.startSleepMillisecond', sleepTime.startSleepMillisecond);
                //console.log('sleepTime.endSleepMillisecond', sleepTime.endSleepMillisecond);
                //console.log('sleepTime.sleepInTime', sleepTime.sleepInTime);
                incrementCount++;
                //console.log('+1,incrementCount:' + incrementCount);
            }
            memberCount++;
            //console.log('下一個歸0,incrementCount:' + incrementCount);
        });

        res.json({
            message: 'every Member insert ' + (maxInsertSleepTimesSize - toDayisTheFewDays) + ' sleepTime success.'
        });
    });
});


module.exports = router;




//擴充 增加時間準確性 設定起床時間點 ex:07:50,08:00,08:30..等
function getSleepTimeInfo(incrementCount) {
    var sleepTimeObject = {};


    //睡眠開始時間
    sleepTimeObject.startSleepTime = getRandomStartSleepTime(incrementCount);
    //開始時間(日期)轉成毫秒
    sleepTimeObject.startSleepMillisecond = toMillisecond(sleepTimeObject.startSleepTime);

    //睡眠總時間小時樣板
    var hoursTemplate = [6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 10, 11];
    var randomHour = hoursTemplate[createRandomValue(0, (hoursTemplate.length - 1))];
    var hourToMillisecond = randomHour * 60 * 60 * 1000;
    var minuteToMillisecond = createRandomValue(0, 59) * 60 * 1000;
    var secondToMillisecond = createRandomValue(0, 59) * 1000;
    //隨機產生睡眠總時間(還未包含賴床時間)
    var totalSleeptimes = hourToMillisecond + minuteToMillisecond + secondToMillisecond;

    //若睡超過八小時有機率賴床
    if (randomHour >= 8) {
        //若大於等於10，直接判定賴床
        if (randomHour >= 10) {
            sleepTimeObject.isSleepIn = 'Y';
        } else {
            //是否有賴床,隨機範圍 0 :有賴床 ，其餘狀態無賴床, 賴床機率1/3
            sleepTimeObject.isSleepIn = createRandomValue(0, 2) == 0 ? 'Y' : 'N';
        }
    }
    var sleepInTime = 0;
    if (sleepTimeObject.isSleepIn == 'Y') {
        //隨機產生 賴床時間(毫秒)
        var hoursTemplate = [0, 0, 0, 0, 1, 2];
        sleepInTime = randomMillisecondByHoursTemplateArr(hoursTemplate);
    }
    //賴床時間
    sleepTimeObject.sleepInTime = sleepInTime;
    //睡眠總時間 = 隨機範圍6 ~ 12 個小時 轉成毫秒, 再加上隨機賴床時間
    sleepTimeObject.totalSleepTime = totalSleeptimes + sleepInTime;

    //睡眠結束時間 = 睡面開始時間 + 睡眠總時間
    sleepTimeObject.endSleepTime = toDate(sleepTimeObject.startSleepMillisecond + sleepTimeObject.totalSleepTime);
    sleepTimeObject.endSleepMillisecond = toMillisecond(sleepTimeObject.endSleepTime);

    return sleepTimeObject;
}


//取得就寢時間
function getRandomStartSleepTime(incrementCount) {

    //取得日期
    var incrementDay = getAddDateCountStr(incrementCount);

    //取得是當天早上8:00，若要取得00:00，必須先扣八小時
    var incrementDayToMillisecond = toMillisecond(incrementDay) - 8 * 60 * 60 * 1000;
    //取得隨機時間

    //晚上9點~凌晨2點，增加9~12點發生的樣本數
    var hoursTemplate = [20, 21, 21, 22, 22, 22, 22, 23, 23, 23, 23, 24, 24, 25, 26];
    var totalMillisecond = randomMillisecondByHoursTemplateArr(hoursTemplate);

    var startSleepTimeMillisecond = incrementDayToMillisecond + totalMillisecond;
    var startSleepTimeDate = toDate(startSleepTimeMillisecond);

    //console.log('startSleepTimeDate', startSleepTimeDate);
    return startSleepTimeDate;
}

//根據 小時樣板數 產生亂數時間(毫秒)
function randomMillisecondByHoursTemplateArr(hoursTemplate) {
    var randomIndex = createRandomValue(0, (hoursTemplate.length - 1))
    var randomHour = hoursTemplate[randomIndex];
    var hourToMillisecond = randomHour * 60 * 60 * 1000;
    var minuteToMillisecond = createRandomValue(1, 59) * 60 * 1000;
    var secondToMillisecond = createRandomValue(1, 59) * 1000;
    var totalMillisecond = hourToMillisecond + minuteToMillisecond + secondToMillisecond
//    console.log('-hoursTemplate.length', hoursTemplate.length);
//    console.log('--randomIndex:', randomIndex);
//    console.log('--randomHour:', randomHour);
//    console.log('---hourToMillisecond:', hourToMillisecond);
//    console.log('---minuteToMillisecond:', minuteToMillisecond);
//    console.log('---secondToMillisecond:', secondToMillisecond);
//    console.log('---totalMillisecond:', totalMillisecond);
    return totalMillisecond;
}

//獲得今天的 addDayCount 天後的日期(可往前、往後查詢) 
function getAddDateCountStr(addDayCount) {
    var theDate = new Date();
    theDate.setDate(theDate.getDate() + addDayCount);
    var year = theDate.getFullYear();
    //獲取當月份時間，不足10補0 
    var month = (theDate.getMonth() + 1) < 10 ? "0" + (theDate.getMonth() + 1) : (theDate.getMonth() + 1);
    //獲取當天時間，不足10補0
    var day = theDate.getDate() < 10 ? "0" + theDate.getDate() : theDate.getDate();

    return year + "-" + month + "-" + day;
}

function createRandomValue(min, max) {
    var result = Math.floor(Math.random() * (max - min + 1) + min);
    return result;
}

function toMillisecond(dateStr) {
    var date = new Date(dateStr);
    var milliseconds = date.getTime();
    return milliseconds;
}

function toDate(millisecond) {
    var date = new Date(millisecond);
    return date;
}

//取得傳入日期是一年中的第幾天
function getDays(date) {
    // 設定1月1日的時間
    var lastDay = new Date(date);
    lastDay.setMonth(0);
    lastDay.setDate(1);

    //獲取距離 1 月 1 日過去多少天
    var days = (date - lastDay) / (1000 * 60 * 60 * 24) + 1;
    return days;
}