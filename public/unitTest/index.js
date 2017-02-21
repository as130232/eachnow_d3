window.onload = function () {
    d3.select("#submitBtn").on("click", function () {
        var whereCondition = {};
        
        //whereCondition.memememe = 'abc';
        //whereCondition.memberNo = 'memno000330';
        //whereCondition.address="台北市";

        //whereCondition.isSleepIn = 'N';
        //whereCondition.totalSleepTime = '$lt40936724';
        //whereCondition.startSleepMillisecond = dateToRangeMillisecond("2016-01-01");
        //whereCondition.endSleepMillisecond = dateToRangeMillisecond("2016-12-31");
        //console.log('startSleepMillisecond',whereCondition.startSleepMillisecond);  
        
        //var resultArray = getMemberData(whereCondition);        
        //let resultArray = getMemberAndOneSleeptimeData(whereCondition);
        //let resultArray = getMemberAndSleeptimesData(whereCondition);        
        //let resultArray = getSleeptimeData(whereCondition);
        //let resultArray = getAllMembersSleepTimesCountData(whereCondition);
        
        var urlQuery ={};
        //urlQuery.totalOrAvg="sum";
        urlQuery.totalOrAvg="avg";
        //urlQuery.totalSleepTimeOrSleepInTime = "sleepInTime";
        urlQuery.totalSleepTimeOrSleepInTime = "totalSleepTime";
        //urlQuery.address="台北市";
        let resultArray = getAggregateSleeptimeData(urlQuery);
        
//        resultArray.forEach(function(data){
//            console.log(data);
//        });

        console.log(resultArray);
    });


}