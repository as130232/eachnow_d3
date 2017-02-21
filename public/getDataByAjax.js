//member的複合查詢(不包含睡眠時間)
//http://localhost:3000/member?memberNo=memno000384
function getMemberData(whereCondition) {
    let result = [];
    $.ajax({
        url: "/member",
        type: "get",
        data: whereCondition,
        dataType: "json",
        async: false,
        success: function (data) {
            result = data.result;
        },
        error: function () {
            alert("get Member data fail.");
        }
    });
    return result;
}

//member的複合查詢(取得所有會員，但只包含一筆睡眠時間)
function getMemberAndOneSleeptimeData(whereCondition) {
    let result = [];
    $.ajax({
        url: "/memberAndSleeptime",
        type: "get",
        data: whereCondition,
        dataType: "json",
        async: false,
        success: function (data) {
            result = data.result;
        },
        error: function () {
            alert("get Member's sleeptime data fail.");
        }
    });
    return result;
}


//member的複合查詢(包含所有睡眠時間，365筆睡眠資訊)
function getMemberAndSleeptimesData(whereCondition) {
    let result = [];
    $.ajax({
        url: "/memberAndSleeptimes",
        type: "get",
        data: whereCondition,
        dataType: "json",
        async: false,
        success: function (data) {
            result = data.result;
        },
        error: function () {
            alert("get Member's sleeptimes data fail.");
        }
    });
    return result;
}


//sleepTimes的複合查詢(不包含會員)
function getSleeptimeData(whereCondition) {
    let result = [];
    $.ajax({
        url: "/sleeptimes",
        type: "get",
        data: whereCondition,
        dataType: "json",
        async: false,
        success: function (data) {
            result = data.result;
        },
        error: function () {
            alert("get Sleeptimes data fail.");
        }
    });
    return result;
}


//所有會員總睡眠、平均總睡眠，總賴床 or 平均賴床時間(包含對應會員資料), 1.用於地形圖 各地區平均及總值睡眠時間、會員人數、男女比例 2.用於泡泡圖 各職業
//非根據上述的query查詢，是直接在url中改值
//http://localhost:3000/sleepTimes/sum Or avg/sleepInTime Or totalSleepTime
function getAggregateSleeptimeData(urlQuery) {
let result = [];
    let totalOrAvg = urlQuery.totalOrAvg;
    let totalSleepTimeOrSleepInTime = urlQuery.totalSleepTimeOrSleepInTime;
    $.ajax({
        url: "/sleepTimes/" + totalOrAvg + "/" + totalSleepTimeOrSleepInTime,
        type: "get",
        dataType: "json",
        async: false,
        success: function (data) {
            result = data.result;
        },
        error: function () {
            alert("get aggregate Sleeptimes data fail.");
        }
    });
    return result;
}


//取得睡眠資訊次數，例:全會員總共賴床或沒有賴床次數 >地形圖顯示所有資訊
//http://localhost:3000/sleepTimesCount?isSleepIn=Y
function getAllMembersSleepTimesCountData(whereCondition) {
    let result = [];
    $.ajax({
        url: "/sleepTimesCount",
        type: "get",
        data: whereCondition,
        dataType: "json",
        async: false,
        success: function (data) {
            result = data.result;
        },
        error: function () {
            alert("get sleepTimesCount fail.");
        }
    });
    return result;
}

//取得所有會員的加總、平均的睡眠時間和賴床時間
//http://localhost:3000/sleepTimes/allTotalAndAvgSleepTime
function getAllTotalAndAvgSleepTime() {
    let result = [];
    $.ajax({
        url: "/sleepTimes/allTotalAndAvgSleepTime",
        type: "get",
        dataType: "json",
        async: false,
        success: function (data) {
            result = data.result;
        },
        error: function () {
            alert("getAllTotalAndAvgSleepTime fail.");
        }
    });
    return result;
}

