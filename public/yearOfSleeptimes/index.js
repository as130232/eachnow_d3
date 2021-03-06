window.onload = function () {

    init();

    function init() {
        setMemberNoSelect();


    }
    let memberAndSleepInfo = [];
    function setMemberNoSelect() {
        let memberArray = getMemberData();
        $("#memberSelect").append('<option value=>--請選擇會員編號--</option>');
        memberArray.forEach(function (member) {
            $("#memberSelect").append('<option value=' + member.memberNo + '>' + member.memberNo + '</option>');
        });
    }

    $("#memberSelect").on("change", function () {
        let memberNo = $(this).val();
        $("#memberSelect").data("memberNo",memberNo);
        console.log('whereCondition.memberNo:', memberNo);
    });

    $("#submitBtn").on("click", function () {
        let memberNoValue = $("#memberSelect").data("memberNo");
        let whereCondition = {memberNo : memberNoValue};
        let memberAndSleeptimesArray = getMemberAndSleeptimesData(whereCondition);
        let result = classifyBySleeptimes(memberAndSleeptimesArray);
        drawSvgForYearOfSleeptimes(result);
    });
    
    
    //將一整年睡眠資訊分類，分別為有賴床、沒賴床、超過12點睡眠的Array
    function classifyBySleeptimes(memberAndSleeptimesArray){
        let member = memberAndSleeptimesArray[0];
        let sleeptimesArray = member.sleepTimes;
        
        let result = {};
        result.member = member;
        //準時起床
        result.onTime = {};
        //有賴床
        result.hasSleepIn = {};
        //超過12點就寢
        result.overTwelve = {};
        
        sleeptimesArray.forEach( function(data){
            //有賴床
            if(data.isSleepIn == "Y"){
                //result.hasSleepIn.push(data);
                let dateStr = convertToDate(data.startSleepMillisecond);
                result.hasSleepIn[dateStr] = true;
                
            }else{
                //result.onTime.push(data);
                let dateStr = convertToDate(data.startSleepMillisecond);
                result.onTime[dateStr] = true;
            }
            //判斷是否有熬夜(取得當天日期的小時判斷是否有 小於 6)
            let startSleepDate = toDate(data.startSleepMillisecond);
            let isOverTwelveBoolean = isOverTwelve(startSleepDate.getHours());
            if(isOverTwelveBoolean){
                //result.overTwelve.push(data);
                let dateStr = convertToDate(data.startSleepMillisecond);
                result.overTwelve[dateStr] = true;
            }
        });
        return result;
    }
    
    
    function drawSvgForYearOfSleeptimes(result) {
        //let sleepIn = ;
        
        //對應的是off 紅色(紅色還有包含六日) (type A)
        var bankHolidays = {
            '01/01/2016': true,
            '03/17/2016': true,
            '03/25/2016': true,
            '03/08/2016': true,
            '05/02/2016': true,
            '06/06/2016': true,
            '08/01/2016': true,
            '10/31/2016': true,
            '12/26/2016': true,
            '12/27/2016': true
        };
        //對應的是holidays 黃色 (type B)
        var myHolidays = {
            '01/04/2016': true,
            '01/05/2016': true,
            '01/06/2016': true,
            '03/07/2016': true,
            '03/09/2016': true,
            '03/10/2016': true,
            '03/11/2016': true,
            '04/13/2016': true,
            '04/14/2016': true,
            '04/15/2016': true,
            '06/15/2016': true,
            '06/16/2016': true,
            '06/17/2016': true,
            '08/08/2016': true,
            '08/09/2016': true,
            '08/10/2016': true,
            '08/11/2016': true,
            '08/12/2016': true,
            '08/15/2016': true,
            '08/16/2016': true,
            '08/17/2016': true,
            '08/18/2016': true,
            '08/19/2016': true,
            '08/22/2016': true,
            '08/23/2016': true,
            '08/24/2016': true,
            '08/25/2016': true,
            '08/26/2016': true,
            '08/08/2016': true,
            '09/09/2016': true,
            '09/12/2016': true,
            '09/13/2016': true,
            '10/10/2016': true,
            '10/11/2016': true,
            '12/28/2016': true,
            '12/29/2016': true,
            '12/30/2016': true
        };
        
        //set start and end range.
        var startDate = '2016-01-01';
        var endDate = '01/01/2017';

        var date = moment(startDate, 'YYYY-MM-DD');

        var dataAll = [];
        //data按月分切割
        var dataSplitByMonth = [];

        //從開始輪詢到結束，判斷哪幾天有賴床、哪幾天
        while (date.calendar() !== endDate) {

            dataAll.push({
                date: date.calendar(),
                weekDay: date.day(),
                month: date.month() + 1,
                day: date.date(),
                year: date.year(),
                
                //bankH: (bankHolidays[date.calendar()] === true) ? true : false,
                //holiday: (myHolidays[date.calendar()] === true) ? true : false,
                //根據傳遞進來的result，判斷一整年分別哪些天有賴床、準時起床、熬夜(過12點)
                sleepIn: (result.hasSleepIn[date.calendar()] === true) ? true : false,
                overTwelve:(result.overTwelve[date.calendar()] === true) ? true : false,
                onTime: (result.onTime[date.calendar()] === true) ? true : false,
            });
            //
            date.add(1, 'day');
        }
        //

        //split into months
        //將所有日期利用filter過綠塞選出對應月份
        var monthsNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (var i = 0; i < 12; i++) {
            dataSplitByMonth.push({
                name: monthsNameArray[i],
                month: (i + 1),
                days: dataAll.filter((day) => {
                    return day.month === (i + 1)
                })
            });
        }

        //calculate layouts
        // each month becomes a g element
        //每日的格字大小及每日格間距
        var dayWidth = 10;
        var dayHeight = 10;
        var dayPadding = 2;

        //月份的間距
        var monthPadding = 10;
        //月份X軸起點位置，建增按月份往後排序
        var currentMonthX = 0;

        var dayOfWeekX = {
            0: 0, // sunday
            1: dayWidth + dayPadding, // monday 
            2: (dayWidth * 2) + (dayPadding * 2), // tuesday
            3: (dayWidth * 3) + (dayPadding * 3), // wendsday
            4: (dayWidth * 4) + (dayPadding * 4), // thursday
            5: (dayWidth * 5) + (dayPadding * 5), // friday
            6: (dayWidth * 6) + (dayPadding * 6) // saturday
        };

        dataSplitByMonth.forEach(function (month) {

            //月份Y軸起點位置，每月都重新開始計算Y軸位置
            var currentMonthY = 20;
            //長出每月中每一天的格子
            month.days.forEach(function (day) {
                //根據每周的第幾天排列在對應數的格子
                day.x = dayOfWeekX[day.weekDay];
                day.y = currentMonthY;

                //星期六後要換下一行 = 格字高度 + padding
                if (day.weekDay === 6) {
                    currentMonthY += dayHeight + dayPadding;
                }
            });
            //月份的尺寸
            month.dimensions = {
                height: month.days[month.days.length - 1].y + dayHeight,
                width: (dayWidth * 7) + (dayPadding * 7)
            };
            //根據天數X軸進行累加，排序出1-12月
            month.x = currentMonthX;
            currentMonthX += month.dimensions.width + monthPadding;
        });




        //vis
        var width = document.getElementsByTagName('body')[0].clientWidth;
        var height = document.getElementsByTagName('body')[0].clientHeight;

        var svg = d3.select('#yearOfSleeptimes').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('display', 'block')
            .style('margin-right', 'auto')
            .style('margin-left', 'auto')
            .style('background-color', '#F8FFE5');


        var yearView = svg.append('g');


        var months = yearView.selectAll('g')
            .data(dataSplitByMonth)
            .enter()
            .append('g')
            .attr('transform', function (d) {
                return 'translate(' + d.x + ',0)'
            })

        months.each(function (node) {

            d3.select(this)
                .selectAll('rect')
                .data(node.days)
                .enter()
                .append('rect')
                .attr('height', dayWidth)
                .attr('width', dayHeight)
                .attr('x', function (d) {
                    return d.x
                })
                .attr('y', function (d) {
                    return d.y
                })
                .attr('fill', function (d) {
//                    if(d.bankH || d.weekDay === 0 || d.weekDay === 6) {
//                        return '#EF476F';
//                    } else if(d.holiday) {
//                        return '#FFC43D';
//                    } else {
//                        return '#1B9AAA';
//                    }
                    
                    //又熬夜又賴床的天數
                    if(d.sleepIn && d.overTwelve){
                        return '#00FF00';   //青色
                        
                    } else if (d.sleepIn) {      
                        return '#EF476F';   //紅色
                        
                    } else if (d.onTime){
                        return '#1B9AAA';   //藍色
                        
                    } else if (d.overTwelve) {
                        return '#FFC43D';   //黃色    
                    } 
                });

            d3.select(this)
                .append('text')
                .text(function (d) {
                    return d.name
                })
                .attr("text-anchor", "middle")
                .attr('x', function (d) {
                    return d.dimensions.width / 2
                })
                .attr('y', 10)
                .style("font-family", "Helvetica")
                .style("font-size", "14pt")
        });

        yearView.attr('transform', function (d) {
            return 'translate(' + ((width - yearView.node().getBBox().width) / 2) + ',20)'
        })


        //vis 2
        var marginStatsViewTop = 150;

        var statsView = svg.append('g')
            .attr('transform', 'translate( 0,' + (yearView.node().getBBox().height + marginStatsViewTop) + ')');

        var categories = []
        
        //第一個判斷是否有賴床
        categories.push(dataAll.filter((day) => {
            //if (day.bankH === true || day.weekDay === 6 || day.weekDay === 0) {
            
            if (day.sleepIn === true) {    
                return true;
            } else {
                return false;
            }
        }));
        //第二個為熬夜
        categories.push(dataAll.filter((day) => {
            //return day.holiday === true
            return day.overTwelve === true;
        }));
        
        //第三個為準時起床
        categories.push(dataAll.filter((day) => {
            //if (!day.holiday && !day.bankH && isWeekDay(day.weekDay)) {
            if (!day.overTwelve && !day.sleepIn) {
                return true;
            } else {
                return false;
            }
        }));

        categories[0] = categories[0].map((el) => {
            el.type = 'sleepIn';
            el.text = 'sleepIn';    
            return el;
        });
        categories[1] = categories[1].map((el) => {
            el.type = 'overTwelve';
            el.text = 'overTwelve';
            return el;
        });
        categories[2] = categories[2].map((el) => {
            el.type = 'onTime';
            el.text = 'onTime';
            return el;
        });

        categories.sort((a, b) => b.length - a.length);

        var startX = (width - yearView.node().getBBox().width) / 2;
        var barPadding = 80;
        var avalWidth = width - ((startX * 2) + (barPadding * 2));
        var barWidth = avalWidth / 3;
        var heightPlusBottomMarg = height - 100;

        var maxLength = d3.max([categories[0].length, categories[1].length, categories[2].length])
            // calc bar heigth;
        var startY = parseInt(statsView.attr('transform').split(',')[1].slice(0, -1));
        var heightScale = d3.scaleLinear()
            .domain([0, maxLength])
            .range([0, heightPlusBottomMarg - startY]);

        var yPosScale = d3.scaleLinear()
            .domain([0, maxLength])
            .range([heightPlusBottomMarg - startY, 0])

        var statsData = [
            {
                x: startX,
                y: yPosScale(categories[0].length),
                w: barWidth,
                h: heightScale(categories[0].length),
                type: categories[0][0].type,
                startY: yPosScale(3),
                startH: heightScale(3),
                text: categories[0][0].text,
                offsetY: startY,
                length: categories[0].length
    },
            {
                x: startX + barWidth + barPadding,
                y: yPosScale(categories[1].length),
                w: barWidth,
                h: heightScale(categories[1].length),
                type: categories[1][0].type,
                startY: yPosScale(3),
                startH: heightScale(3),
                text: categories[1][0].text,
                offsetY: startY,
                length: categories[1].length
    },
            {
                x: startX + barWidth + barPadding + barWidth + barPadding,
                y: yPosScale(categories[2].length),
                w: barWidth,
                h: heightScale(categories[2].length),
                type: categories[2][0].type,
                startY: yPosScale(3),
                startH: heightScale(3),
                text: categories[2][0].text,
                offsetY: startY,
                length: categories[2].length
    }
]

        var bars = statsView.selectAll('rect')
            .data(statsData)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return d.x;
            })
            .attr('y', function (d) {
                return d.startY;
            })
            .attr('width', function (d) {
                return d.w;
            })
            .attr('height', function (d) {
                return d.startH;
            })
            .attr('fill', function (d) {
                if (d.type === 'sleepIn') return '#EF476F';
                if (d.type === 'overTwelve') return '#FFC43D';
                if (d.type === 'onTime') return '#1B9AAA';
            })

        var barLables = statsView.selectAll('text')
            .data(statsData)
            .enter()
            .append('text')
            .attr("x", function (d) {
                return d.x + (d.w / 2)
            })
            .attr("y", function (d) {
                return d.startY + d.startH + 20
            })
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.text;
            })
            .attr('fill', 'black')
            .style("font-family", "Helvetica")
            .style("font-size", "14pt");

        addTemporaryDayAndMoveTo(barLables, function (maxDur) {

            var counter = 0;

            bars.transition()
                .duration(maxDur)
                .attr('y', function (d) {
                    return d.y
                })
                .attr('height', function (d) {
                    return d.h
                })
                .on('end', function () {
                    counter++;
                    if (counter === 2) {
                        console.log('kkk')
                        statsView.selectAll('text').each(function (p, j) {
                            d3.select(this.parentNode)
                                .append('text')
                                .attr("x", p.x + (p.w / 2))
                                .attr("y", p.y + (p.h / 2))
                                .attr("text-anchor", "middle")
                                .text(p.length)
                                .attr('fill', 'transparent')
                                .style("font-family", "Helvetica")
                                .style("font-size", "12pt")
                                .transition()
                                .duration(1000)
                                .attrTween("fill", function () {
                                    return d3.interpolateRgb("transparent", "black");
                                });
                        })
                    }
                })
        });



        function addTemporaryDayAndMoveTo(barLables, moveCallback) {
            var positions = [];
            //http://stackoverflow.com/questions/6858479/rectangle-coordinates-after-transform
            yearView.selectAll('rect').each(function (d) {

                var pos = getRelPos(this, svg);

                pos.cx = pos.x + (dayWidth / 2);
                pos.cy = pos.y + (dayHeight / 2);
                pos.color = d3.select(this).attr('fill');
                pos.type = d.type;
                positions.push(pos);
            });

            function getRelPos(node, svg) {
                var m = node.getCTM();
                var pos = svg.node().createSVGPoint();
                pos.x = d3.select(node).attr('x');
                pos.y = d3.select(node).attr('y');

                pos = pos.matrixTransform(m);

                return pos;
            }

            var textPos = {};

            statsView.selectAll('text').each(function (d) {
                //console.log(d)
                textPos[d.type] = d;
            })


            var tempG = svg.append('g');

            //var tempPos = getRelPos(circpack.node(), svg);
            //var counter = 0;
            var counter = false;
            var maxDur = -Infinity;

            var delayScale = d3.scaleLinear()
                .domain([0, positions.length])
                .range([300, 2000]);

            tempG.selectAll('rect')
                .data(positions)
                .enter()
                .append('rect')
                .attr('x', function (d) {
                    return d.x
                })
                .attr('y', function (d) {
                    return d.y
                })
                .attr('width', dayWidth)
                .attr('height', dayHeight)
                .attr('fill', function (d) {
                    return d.color
                })
                .transition()
                .delay(function (d, i) {
                    return delayScale(i)
                })
                //.delay(d3.randomUniform(1000, 5000)() )
                .attr('x', function (d) {
                    return (textPos[d.type].x + textPos[d.type].w / 2);
                })
                .attr('y', function (d) {
                    return (textPos[d.type].offsetY + textPos[d.type].startY);
                })
                .duration(function (d, i) {
                    var dur = d3.randomUniform(500, 2000)();

                    if (dur > maxDur) maxDur = dur;

                    return dur;
                })
                //.ease(d3.easeQuadIn)
                .on('end', function () {
                    //counter++
                    //if(!counter === positions.length) {
                    if (!counter) {
                        moveCallback(maxDur);
                        counter = true;
                    }
                })
                .remove();

        }


        //Helper functions
        function isWeekDay(num) {
            var o = {
                0: false,
                1: true,
                2: true,
                3: true,
                4: true,
                5: true,
                6: false
            }

            return o[num];
        }
    }



}