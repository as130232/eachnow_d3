window.onload = function () {
    d3.select("#submitBtn").on("click", function () {
        var whereCondition = {};
        
        whereCondition.memememe = 'abc';
        //whereCondition.memberNo = 'memno000330';
        whereCondition.job = "老師";
        
        
        whereCondition.isSleepIn = 'N';
        //whereCondition.totalSleepTime = '$lt40936724';
        //whereCondition.startSleepMillisecond = dateToRangeMillisecond("2016-3-14");
        //console.log('startSleepMillisecond',whereCondition.startSleepMillisecond);
       
        
        //let resultArray = getMemberData(whereCondition);
        
        
        //let resultArray = getMemberAndOneSleeptimeData(whereCondition);
        //let resultArray = getMemberAndSleeptimesData(whereCondition);
        
        
        
        //let resultArray = getSleeptimeData(whereCondition);
        //let resultArray = getAllMembersSleepTimesCountData(whereCondition);
        
        
        var urlQuery ={};
        //urlQuery.totalOrAvg="sum";
        //urlQuery.totalOrAvg="avg";
        //urlQuery.totalSleepTimeOrSleepInTime = "sleepInTime";
        //urlQuery.totalSleepTimeOrSleepInTime = "totalSleepTime";
        //let resultArray = getAggregateSleeptimeData(urlQuery);
        
//        resultArray.forEach(function(data){
//            console.log(data);
//        });
        console.table(resultArray);
    });


}