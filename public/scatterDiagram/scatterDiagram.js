class ScatterDiagram {
    constructor(){
        this.attribute = {
            minAge: 0,
            maxAge: 0,
            minAvgSleepTime: 0,
            maxAvgSleepTime: 0,
            minAvgSleepInMinutes: 0,
            maxAvgSleepInMinutes: 0,
        }
        this.getAllAvgSleepTime();
        //console.log(this.attribute.maxAge)
    }
    getAllAvgSleepTime(){
        let memberTotalAndAvgSleepTime = getAllTotalAndAvgSleepTime();
        //console.log(memberTotalAndAvgSleepTime);
        
        //X軸:年齡
        let minAge = d3.min(memberTotalAndAvgSleepTime,function(d){
            let age = +moment(new Date(d.member[0].birth)).fromNow(true).substring(0,2);
            return age;
        });
        this.attribute.minAge = minAge;

        let maxAge = d3.max(memberTotalAndAvgSleepTime,function(d){
            let age = +moment(new Date(d.member[0].birth)).fromNow(true).substring(0,2);
            return age;
        })
        this.attribute.maxAge = maxAge;
        
        //Y軸:avg睡眠時間
        let minAvgSleepTime = d3.min(memberTotalAndAvgSleepTime,function(d){
            let avgSleepTime = d.avg_totalSleepTime/1000/60/60;
            return avgSleepTime;
        });
        this.attribute.minAvgSleepTime = minAvgSleepTime;

        let maxAvgSleepTime = d3.max(memberTotalAndAvgSleepTime,function(d){
            let avgSleepTime = d.avg_totalSleepTime/1000/60/60;
            return avgSleepTime;
        });
        this.attribute.maxAvgSleepTime = maxAvgSleepTime;
        
        //R半徑:avg賴床時間
        let minAvgSleepInMinutes = d3.min(memberTotalAndAvgSleepTime,function(d){
            let avgSleepInTime = d.avg_sleepInTime/1000/60;
            return avgSleepInTime;
        });
        this.attribute.minAvgSleepInMinutes = minAvgSleepInMinutes;

        let maxAvgSleepInMinutes = d3.max(memberTotalAndAvgSleepTime,function(d){
            let avgSleepInTime = d.avg_sleepInTime/1000/60;
            return avgSleepInTime;
        });
        this.attribute.maxAvgSleepInMinutes = maxAvgSleepInMinutes;
        
    }
}

new ScatterDiagram;