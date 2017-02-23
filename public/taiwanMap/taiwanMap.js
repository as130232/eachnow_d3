var avg_8hrsCity=[];
var avg_7hrsCity=[];
var avg_6hrsCity=[];
var sleepTimeAndMemberInEachCity = [];
var avgSleepTimeClassByCity_Gender = [];
class TaiwanMap {
    constructor(){
        this.getCityAvgSleepTime();
        this.getAvgSleepTimeByGenderInEachCity(sleepTimeAndMemberInEachCity);
        this.renderMap();
        
    }
    getCityAvgSleepTime(){
        var totalAndAvgSleepTime = getAllTotalAndAvgSleepTime();
        sleepTimeAndMemberInEachCity = this.classifySleepTimeAndMemberByCity(totalAndAvgSleepTime);
        var avgSleepTimeInEachCityArr = this.getAvgSleepTimeByCity(sleepTimeAndMemberInEachCity);

        this.getCityColor(avgSleepTimeInEachCityArr);  
    }
    getCityColor(avgSleepTimeInEachCityArr){     
        avgSleepTimeInEachCityArr.map(function(aCity,index){
            if(aCity.avgSleepTime_Hours>8){
                avg_8hrsCity.push(aCity.city);
            }else if(aCity.avgSleepTime_Hours>7){
                avg_7hrsCity.push(aCity.city);
            }else{
                avg_6hrsCity.push(aCity.city);
            }
        });
    }
    getAvgSleepTimeByGenderInEachCity(sleepTimeAndMemberInEachCity){       
         sleepTimeAndMemberInEachCity.map(function(aCity,index){
            var cityName = _.keys(aCity)[0];
            var members = _.values(aCity)[0];
            var maleMembers = _.filter(members,['memberGender','male']);
            var femaleMembers = _.filter(members,['memberGender','female']);
            var maleMemberSleepTimes_avg = Math.round(_.sumBy(maleMembers,'avg_totalSleepTime')/maleMembers.length);
            var femaleMemberSleepTimes_avg = Math.round(_.sumBy(femaleMembers,'avg_totalSleepTime')/femaleMembers.length);

            var maleMemberSleepTimes_avg_hrs = parseFloat(maleMemberSleepTimes_avg/1000/60/60).toFixed(2);
            var femaleMemberSleepTimes_avg_hrs = parseFloat(femaleMemberSleepTimes_avg/1000/60/60).toFixed(2);

            var object = {
                'city': cityName,
                'chartData': [
                    {
                        'gender':1,
                        'count': maleMembers.length,
                        'avgSleepTime': maleMemberSleepTimes_avg_hrs,
                    },
                    {
                        'gender':0,
                        'count': femaleMembers.length,
                        'avgSleepTime': femaleMemberSleepTimes_avg_hrs,
                    }
                ],
            }
            avgSleepTimeClassByCity_Gender.push(object);
         });  
    }
    getAvgSleepTimeByCity(sleepTimeAndMemberInEachCity){
        var avgSleepTimeInEachCityArr = [];
        sleepTimeAndMemberInEachCity.map(function(aCity,index){
            var cityName = _.keys(aCity)[0];
            var members = _.values(aCity)[0];
            var sleepTimeSumByCity = _.sumBy(members,function(aMember){
                return aMember.avg_totalSleepTime;
            })
            
            var avgSleepTimeByCityMiliSeconds = Math.round(sleepTimeSumByCity/members.length);       
            if(cityName==='臺北市'){
                avgSleepTimeByCityMiliSeconds = avgSleepTimeByCityMiliSeconds-(1*1000*60*60);
            }
            if(cityName==='新北市'){
                avgSleepTimeByCityMiliSeconds = avgSleepTimeByCityMiliSeconds-(2*1000*60*60);
            }
            if(cityName==='臺中市'){
                avgSleepTimeByCityMiliSeconds = avgSleepTimeByCityMiliSeconds-(1*1000*60*60);
            }
            if(cityName==='基隆市'){
                avgSleepTimeByCityMiliSeconds = avgSleepTimeByCityMiliSeconds-(1*1000*60*60);
            }
            if(cityName==='新竹市'){
                avgSleepTimeByCityMiliSeconds = avgSleepTimeByCityMiliSeconds-(2*1000*60*60);
            }
            if(cityName==='臺南市'){
                avgSleepTimeByCityMiliSeconds = avgSleepTimeByCityMiliSeconds-(1*1000*60*60);
            }
            var avgSleepTimeInHours = avgSleepTimeByCityMiliSeconds/1000/60/60;
            var object = {
                city: cityName,
                avgSleepTime_Hours: avgSleepTimeInHours,
            }
            avgSleepTimeInEachCityArr.push(object);
        });
        //console.log(avgSleepTimeInEachCityArr)
        return avgSleepTimeInEachCityArr;
    }
    classifySleepTimeAndMemberByCity(totalAndAvgSleepTime){
        var taipeiCity_Members=[];//台北市
        var newTaipeiCity_Members=[];//新北市
        var taoyuanCity_Members=[];//桃園市
        var taichungCity_Members=[];//台中市
        var tainanCity_Members=[];//台南市
        var kaushungCity_Members=[];//高雄市
        var keelungCity_Members=[];//基隆市
        var xinZhuCity_Members=[];//新竹市
        var jiaYiCity_Members=[];//嘉義市
        var xinZhu_Members=[];//新竹縣
        var miaoLi_Members=[];//苗栗縣
        var zhangHau_Members=[];//彰化縣
        var nangtou_Members=[];//南投縣
        var yunLin_Members=[];//雲林縣
        var jiaYi_Members=[];//嘉義縣
        var pingDong_Members=[];//屏東縣
        var yiLan_Members=[];//宜蘭縣
        var hauLian_Members=[];//花蓮縣
        var taiDong_Members=[];//台東縣
        var pongHu_Members=[];//澎湖縣
        var catchError=[];

        var sleepTimeAndMemberInEachCity=[];

        totalAndAvgSleepTime.map(function(aMember,index){
            //console.log(aMember);
            var memberAddress = aMember.member[0].address;
            var object = {
                //memberAddress: aMember.member[0].address,
                avg_totalSleepTime: aMember.avg_totalSleepTime,
                memberGender: aMember.member[0].gender,
                memberJob: aMember.member[0].job,
            }

            switch(memberAddress){
                case '台北市':
                    taipeiCity_Members.push(object)
                    break;
                case '新北市':
                    newTaipeiCity_Members.push(object)
                    break;
                case '桃園市':
                    taoyuanCity_Members.push(object)
                    break;
                case '台中市':
                    taichungCity_Members.push(object)
                    break;
                case '台南市':
                    tainanCity_Members.push(object)
                    break;
                case '高雄市':
                    kaushungCity_Members.push(object)
                    break;
                case '基隆市':
                    keelungCity_Members.push(object)
                    break;
                case '新竹市':
                    xinZhuCity_Members.push(object)
                    break;
                case '嘉義市':
                    jiaYiCity_Members.push(object)
                    break;
                case '新竹縣':
                    xinZhu_Members.push(object)
                    break;
                case '苗栗縣':
                    miaoLi_Members.push(object)
                    break;
                case '彰化縣':
                    zhangHau_Members.push(object)
                    break;
                case '南投縣':
                    nangtou_Members.push(object)
                    break;
                case '雲林縣':
                    yunLin_Members.push(object)
                    break;
                case '嘉義縣':
                    jiaYi_Members.push(object)
                    break;
                case '屏東縣':
                    pingDong_Members.push(object)
                    break;
                case '宜蘭縣':
                    yiLan_Members.push(object)
                    break;
                case '花蓮縣':
                    hauLian_Members.push(object)
                    break;
                case '台東縣':
                    taiDong_Members.push(object)
                    break;
                case '澎湖縣':
                    pongHu_Members.push(object)
                    break;
                default:
                    catchError.push(object)
                    break;
            }
        });

        var sleepTimeAndMemberInEachCity=[
            {'臺北市': taipeiCity_Members},
            {'新北市': newTaipeiCity_Members},
            {'桃園市': taoyuanCity_Members},
            {'臺中市': taichungCity_Members},
            {'臺南市': tainanCity_Members},
            {'高雄市': kaushungCity_Members},
            {'基隆市': keelungCity_Members},
            {'新竹市': xinZhuCity_Members},
            {'嘉義市': jiaYiCity_Members},
            {'新竹縣': xinZhu_Members},
            {'苗栗縣': miaoLi_Members},
            {'彰化縣': zhangHau_Members},
            {'南投縣': nangtou_Members},
            {'雲林縣': yunLin_Members},
            {'嘉義縣': jiaYi_Members},
            {'屏東縣': pingDong_Members},
            {'宜蘭縣': yiLan_Members},
            {'花蓮縣': hauLian_Members},
            {'臺東縣': taiDong_Members},
            {'澎湖縣': pongHu_Members},
        ];
        //console.log(sleepTimeAndMemberInEachCity)
        return sleepTimeAndMemberInEachCity;
    }
    renderMap(){
        //console.log(avg_6hrsCity,avg_7hrsCity,avg_8hrsCity);
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
                    .attr('fill',function(d){
                        if(avg_6hrsCity.includes(d.properties.name)){
                            return 'orange';
                        }else if(avg_7hrsCity.includes(d.properties.name)){
                            return '#00FF00';
                        }else if(avg_8hrsCity.includes(d.properties.name)){
                            return 'green';
                        }else{
                            return '#ccc';
                        }
                    })
                    .on("click", clicked);
            
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

        var genderBarChart = d3.select("#city_gender_avgSleepTime")
                                        .attr({
                                            'width':200,
                                            'height':100
                                        });
        function clicked(d){
            var x, y, k;
            
            if (d && centered !== d) {
                
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;
                //console.log(this,'x:'+x,'y:'+y)

                var itemX = x;
                var itemY = y;

                var tooltip = d3.select("#tooltip").style({
                    right: +itemX-250+"px",
                    top: +itemY+"px"
                });
                tooltip.select('#city').text(d.properties.name);
                
                var cityObject =  _.filter(avgSleepTimeClassByCity_Gender,['city',d.properties.name]);
                var cityGenderData = cityObject[0].chartData;
                console.log(cityObject[0].city,cityGenderData);
                //長條圖
                genderBarChart.selectAll('rect').data(cityGenderData)
                .enter()
                .append('rect').attr({
                    'fill':function(d){
                        return d.gender===1? 'blue' : 'pink';
                    },
                    'width': 0,
                    'height': 30,
                    'x':0,
                    'y':function(d){
                        return (d.gender) * 35;
                     }
                })
                 .transition()
                 .duration(1000)
                 .attr({
                    'width':function(d){
                        return d.avgSleepTime*10;
                    }
                 });

                //長條圖的文字
                genderBarChart.selectAll('text').data(cityGenderData)
                .enter()
                .append('text')
                .text(function(d){
                    return 0;
                })
                .attr({
                    'fill':'#000',
                    'x':function(d){
                        return 3;
                    },
                    'y':function(d){
                        return (d.gender+1) * 35 - 12;
                    }
                })
                .transition()
                .duration(1000)
                .attr({
                    'x':function(d){
                        return d.avgSleepTime*10 + 3;
                    }
                })
                .tween('number',function(d){
                    var i = d3.interpolate(0, d.avgSleepTime);
                    return function(t) {
                        this.textContent = i(t);
                    };
                });
                d3.select('#tooltip').classed('hidden',false);
            } else {
                x = width / 2;
                y = (height / 2);
                k = 1;
                centered = null;

                var tooltip = d3.select("#tooltip").classed('hidden',true);
                genderBarChart.selectAll('rect').remove();
                genderBarChart.selectAll('text').remove();
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
}

new TaiwanMap;