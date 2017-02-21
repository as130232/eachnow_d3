//將日期轉為一個範圍的開始及結束作為查詢條件
function dateToRangeMillisecond(dateStr) {
    //Mon Jan 04 2016 22:28:42 GMT+0800 (台北標準時間) 轉換成-> $gte1451912400000,$lte1451934000000
    let date = new Date(dateStr);
    let milliseconds = toMillisecond(date);
    //範圍的開始為晚上9點整
    let rangeOfStart = (milliseconds + hourToMillisecond(21));
    //範圍的結束為隔天凌晨3點整 = rangeOfStart +  6 小時
    let rangeOfEnd = (rangeOfStart + hourToMillisecond(6));

    //合併成查詢條件
    let result = '$gte' + rangeOfStart + ',' + '$lte' + rangeOfEnd;
    console.log('result', result);
    return result;
}

function hourToMillisecond(hour) {
    return hour * 3600000;
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

//轉換日期格式 Sun Feb 07 2016 05:57:54   ->'02/07/2016':
function convertToDate(dateStr){
    
    let date = new Date(dateStr);
    
    let yearValue = date.getFullYear();
    let monthValue = date.getMonth() + 1;
    if(monthValue < 10){
        monthValue = '0' + monthValue;
    }
    let dateValue = date.getDate();
    if(dateValue < 10){
        dateValue = '0' + dateValue;
    }

    return '' + monthValue + '/' + dateValue + '/' + yearValue;
}

function createRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/*
    判斷是否有熬夜，超過凌晨12點睡
    由傳入的參數(小時)來判斷
*/
function isOverTwelve(hour){
    let result = false;
    if(hour <= 6){
        result = true;
    }
    return result;
}

/*
    取得當天凌晨12點日期，ex: 
    2016/1/1 23:50:59 -> 2016/1/2 00:00:00
    2016/1/2 01:00:59 -> 2016/1/2 00:00:00
*/
function getCurrentDate(date){
    
}
