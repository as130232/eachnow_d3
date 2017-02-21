init();

function init() {
    getCityAvgSleepTime();
    render();
}

function getCityAvgSleepTime(){
    var urlQuery = {
        totalOrAvg: "avg",
        totalSleepTimeOrSleepInTime: "totalSleepTime"
    }; 
    var allMemberSleepTimes = getAggregateSleeptimeData(urlQuery);
    
    var sleepTimeMiliseconds = getSleepTimeMilisecondsInEachCity(allMemberSleepTimes);
    var avgSleepTimeInEachCityArr = getSleepTimeHoursInEachCity(sleepTimeMiliseconds);
    console.log(avgSleepTimeInEachCityArr)
}

function getSleepTimeHoursInEachCity(sleepTimeMiliseconds){
    //var citys = _.keys(sleepTimeMiliseconds);
    var taipei_sleepTimeHrs = "";//台北市
    var newTaipeiCity_sleepTimeHrs = "";//新北市
    var taoyuan_sleepTimeHrs = "";//桃園市
    var taichungCity_sleepTimeHrs =[];//台中市:54
    var tainanCity_sleepTimeHrs =[];//台南市:16
    var kaushungCity_sleepTimeHrs =[];//高雄市:46
    var keelungCity_sleepTimeHrs =[];//基隆市:9
    var xinZhuCity_sleepTimeHrs =[];//新竹市:10
    var jiaYiCity_sleepTimeHrs =[];//嘉義市:10
    var xinZhu_sleepTimeHrs =[];//新竹縣:15
    var miaoLi_sleepTimeHrs =[];//苗栗縣:21
    var zhangHau_sleepTimeHrs =[];//彰化縣:9
    var nangtou_sleepTimeHrs =[];//南投縣
    var yunLin_sleepTimeHrs =[];//雲林縣
    var jiaYi_sleepTimeHrs =[];//嘉義縣
    var pingDong_sleepTimeHrs =[];//屏東縣
    var yiLan_sleepTimeHrs =[];//宜蘭縣
    var hauLian_sleepTimeHrs =[];//花蓮縣
    var taiDong_sleepTimeHrs =[];//台東縣
    var pongHu_sleepTimeHrs =[];//澎湖縣

    var avgSleepTimeInEachCityArr = [];

    sleepTimeMiliseconds.map(function(aCity,index){
        var cityName = _.keys(aCity)[0];
        var citySleepTime= _.values(aCity)[0];

        var avgSleepTimeInACityMiliSeconds = Math.round(_.sum(citySleepTime)/citySleepTime.length);
        var avgSleepTimeInHours = millisecondToDate(avgSleepTimeInACityMiliSeconds);
        
        var object = {
            city: cityName,
            avgSleepTime_Hours: avgSleepTimeInHours
        }
        avgSleepTimeInEachCityArr.push(object);
    });
    return avgSleepTimeInEachCityArr;
}

function getSleepTimeMilisecondsInEachCity(allMemberSleepTimes){
    var sleepTimesInTaipeiCity=[];//台北市:105
    var sleepTimesInNewTaipeiCity=[];//新北市:53
    var sleepTimesInTaoyuanCity=[];//桃園市:22
    var sleepTimesInTaichungCity=[];//台中市:54
    var sleepTimesInTainanCity=[];//台南市:16
    var sleepTimesInKaushungCity=[];//高雄市:46
    var sleepTimesInKeelungCity=[];//基隆市:9
    var sleepTimesInXinZhuCity=[];//新竹市:10
    var sleepTimesInJiaYiCity=[];//嘉義市:10
    var sleepTimesInXinZhu=[];//新竹縣:15
    var sleepTimesInMiaoLi=[];//苗栗縣:21
    var sleepTimesInZhangHau=[];//彰化縣:9
    var sleepTimesInNangtou=[];//南投縣
    var sleepTimesInYunLin=[];//雲林縣
    var sleepTimesInJiaYi=[];//嘉義縣
    var sleepTimesInPingDong=[];//屏東縣
    var sleepTimesInYiLan=[];//宜蘭縣
    var sleepTimesInHauLian=[];//花蓮縣
    var sleepTimesInTaiDong=[];//台東縣
    var sleepTimesInPongHu=[];//澎湖縣
    var catchError=[];

    for(var i=0;i<allMemberSleepTimes.length;i++){
        var memberAddress = allMemberSleepTimes[i].member[0].address;
        var sleepTime = allMemberSleepTimes[i].sleepTime;
        
        var object = {
            city: memberAddress,
            sleepTime: allMemberSleepTimes[i].sleepTime
        }
        
        switch(memberAddress){
            case '台北市':
                sleepTimesInTaipeiCity.push(sleepTime)
                break;
            case '新北市':
                sleepTimesInNewTaipeiCity.push(sleepTime)
                break;
            case '桃園市':
                sleepTimesInTaoyuanCity.push(sleepTime)
                break;
            case '台中市':
                sleepTimesInTaichungCity.push(sleepTime)
                break;
            case '台南市':
                sleepTimesInTainanCity.push(sleepTime)
                break;
            case '高雄市':
                sleepTimesInKaushungCity.push(sleepTime)
                break;
            case '基隆市':
                sleepTimesInKeelungCity.push(sleepTime)
                break;
            case '新竹市':
                sleepTimesInXinZhuCity.push(sleepTime)
                break;
            case '嘉義市':
                sleepTimesInJiaYiCity.push(sleepTime)
                break;
            case '新竹縣':
                sleepTimesInXinZhu.push(sleepTime)
                break;
            case '苗栗縣':
                sleepTimesInMiaoLi.push(sleepTime)
                break;
            case '彰化縣':
                sleepTimesInZhangHau.push(sleepTime)
                break;
            case '南投縣':
                sleepTimesInNangtou.push(sleepTime)
                break;
            case '雲林縣':
                sleepTimesInYunLin.push(sleepTime)
                break;
            case '嘉義縣':
                sleepTimesInJiaYi.push(sleepTime)
                break;
            case '屏東縣':
                sleepTimesInPingDong.push(sleepTime)
                break;
            case '宜蘭縣':
                sleepTimesInYiLan.push(sleepTime)
                break;
            case '花蓮縣':
                sleepTimesInHauLian.push(sleepTime)
                break;
            case '台東縣':
                sleepTimesInTaiDong.push(sleepTime)
                break;
            case '澎湖縣':
                sleepTimesInPongHu.push(sleepTime)
                break;
            default:
                catchError.push(sleepTime)
                break;
        }
    }

    var sleepTimeMiliseconds = [
        {'台北市': sleepTimesInTaipeiCity},
        {'新北市': sleepTimesInNewTaipeiCity},
        {'桃園市': sleepTimesInTaoyuanCity},
        {'台中市': sleepTimesInTaichungCity},
        {'台南市': sleepTimesInTainanCity},
        {'高雄市': sleepTimesInKaushungCity},
        {'基隆市': sleepTimesInKeelungCity},
        {'新竹市': sleepTimesInXinZhuCity},
        {'嘉義市': sleepTimesInJiaYiCity},
        {'新竹縣': sleepTimesInXinZhu},
        {'苗栗縣': sleepTimesInMiaoLi},
        {'彰化縣': sleepTimesInZhangHau},
        {'南投縣': sleepTimesInNangtou},
        {'雲林縣': sleepTimesInYunLin},
        {'嘉義縣': sleepTimesInJiaYi},
        {'屏東縣': sleepTimesInPingDong},
        {'宜蘭縣': sleepTimesInYiLan},
        {'花蓮縣': sleepTimesInHauLian},
        {'台東縣': sleepTimesInTaiDong},
        {'澎湖縣': sleepTimesInPongHu},
    ];
    return sleepTimeMiliseconds;
}

function render(){
    var width = document.getElementById('fh5co-main').clientWidth;
    var height = document.getElementById('fh5co-main').clientHeight;
    var centered;
    var projection = d3.geo.mercator().center([121,24]).scale(5000).translate([width / 2, height / 2]);
    var path = d3.geo.path().projection(projection);
    var svg = d3.select('#taiwanMap_SVG').attr("width", width).attr("height", height);
    svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);
    var g = svg.append("g");
    d3.json("/mapJson/taiwan.json",function(error,topology){
        if (error) throw error;
        g.append("g").selectAll("path")
                .data(topojson.feature(topology, topology.objects.map).features)
                .enter().append("path")
                .attr("d", path)
                .attr('fill','green')
                .on("click", clicked);
                // .on("click",function(d){
                //     console.log(this)
                    // var itemCX = d3.select(this).attr("cx");
                    // var itemCY = d3.select(this).attr("cy");
                    // var tooltip = d3.select("#tooltip")
                    //                 .style({
                    //                     left: +itemCX+20+"px",
                    //                     top: +itemCY+20+"px"
                    //                 })
                    // tooltip.select('#city')//.text(d.city);
                    // tooltip.select('#industry')//.text(d.industry);
                    // d3.select('#tooltip').classed('hidden',false);
                //})
                // .on("mouseout",function(d){
                //     d3.select('#tooltip').classed('hidden',true);
                // })  

        
        g.append("path").datum(
            topojson.mesh(
                topology,
                topology.objects.map,
                (a,b)=>{
                    return a !== b;
            })
        )
        .attr("id", "borders")
        .attr("d", path);

    })

    function clicked(d){
        var x, y, k;
        
        if (d && centered !== d) {
            
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
            console.log(this,'x:'+x,'y:'+y)

            var itemX = x;
            var itemY = y;

            var tooltip = d3.select("#tooltip").style({
                right: +itemX-250+"px",
                top: +itemY+"px"
            });
            tooltip.select('#city');
            tooltip.select('#industry');
            d3.select('#tooltip').classed('hidden',false);
        } else {
            x = width / 2;
            y = (height / 2);
            k = 1;
            centered = null;
        }

        g.selectAll("path")
                .classed("active", centered && function(d) { return d === centered; });

        g.transition()
            .duration(1000)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");


        // .append("title").text(function(d){
        //     return d.city + "\r\n" + d.industry;
        // })    
     }
}