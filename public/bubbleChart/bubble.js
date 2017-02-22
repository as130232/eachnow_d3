//大圈:行業別 - 城市別 - 男女別

init();

function init() {
    let allMembersSleepTimesCountData = getAllMembersSleepTimesCountData();

    let urlQuery = {};
    urlQuery.totalOrAvg = "sum";
    urlQuery.totalSleepTimeOrSleepInTime = "totalSleepTime";
    let sum_totalSleepTime_data = getAggregateSleeptimeData(urlQuery);

    urlQuery.totalSleepTimeOrSleepInTime = "sleepInTime";
    let sum_sleepInTime_data = getAggregateSleeptimeData(urlQuery);

    urlQuery.totalOrAvg = "avg";
    let avg_sleepInTime_data = getAggregateSleeptimeData(urlQuery);
    let avg_totalSleepTime_data = getAggregateSleeptimeData(urlQuery);


    drawBubbleChart();
}

function drawBubbleChart() {
    let bubbleChartSvg = {};
    bubbleChartSvg.width = 1200;
    bubbleChartSvg.height = 800;

    var padding = 90;


    createSvg();

    d3.csv("hw03_invoice-taipei.csv", row, function (dataSet) {

        //console.table(dataSet);
        bind(dataSet);
        render(dataSet);

    });
    //先做轉圖型
    function row(d) {
        //TODO-1.轉換資料型態，提示：三行
        d.amount = +d.amount;
        d.number = +d.number;

        //???依據何種資訊來綁定泡泡的大小視覺圖型
        //自行設定每筆資料物件多 value的屬性，其值定義為 amount
        d.value = +d.amount;
        return d;
    }

    function createSvg() {
        d3.select("#bubbleChart").append("svg").attr({
            width: bubbleChartSvg.width,
            height: bubbleChartSvg.height
        });
        d3.select("#bubbleChart svg").append("g").append("rect").attr({
            width: "100%",
            height: "100%",
            fill: "white"
        });

    }

    function bind(dataSet) {
        //一開始先將資料過濾(篩選出只想要的資料)ex:2016/8/1
        let filtered_dataSet = dataSet.filter(function (data) {
            return data.date === "2016/8/1";
        })

        //d3.nest() 將資料結構(巢狀)化，區分為key value
        var nested_dataSet = d3.nest()
            //設定key 依據何種資料來劃分，類似Sql中的group
            .key(function (d) {
                return d.industry;
            })

        /*
            額外補充，可以針對分類完的group資料
            做彙整或排序等
        */

        //彙整:可回傳根據key(industry) 分類group的群組底下有幾個元素
        //            .rollup(function (d){
        //                return +d.length;     //回傳該子結構(陣列)的長度
        //            })

        //根據key來做排序
        //.sortKeys(d3.descending)

        //根據value來做排序
        //.sortValues(d3.descending)

        //???2.TODO-再依城市劃分，
        //子結構底下再劃分孫子結構(先根據行業區分，再區分各城市別)
        .key(function (d) {
                return d.city;
            })
            .entries(filtered_dataSet); //entries : 資料來源

        console.log(nested_dataSet);

        var root = {
            values: nested_dataSet
        };


        var packed_dataSet = d3.layout.pack()
            .size([bubbleChartSvg.width, h])
            .padding(2)
            //???TODO-5.依大小排序，目標:大內外小
            //升序 由小排到大 d3.ascending(a, b);
            //降序 由大排到小 d3.descending(a, b);
            .sort(function (a, b) {
                //原本內圈有小圓逆時針到外圈大圓
                //藉由排序將顯示顛倒過來
                return d3.descending(a.value, b.value);
                //return d3.ascending(a.number, b.number);
            })
            .children(
                //???TODO-3.<問>要回傳什麼？
                function (data) {
                    //回傳key(group)對應的vaules (資料的子結構)
                    return data.values;
                }
            )
            .nodes(root); //nodes:節點下需要的 root巢狀化資料

        //console.log(packed_dataSet);

        //???TODO-6.如何把最外的大圓去掉？
        //只有第一筆資料沒有parent，為最外層最大顆的圓
        packed_dataSet = packed_dataSet.filter(function (data) {
            //過濾是否有parent欄位
            return data.parent;
        });

        var selection = d3.select("svg")
            .selectAll("circle")
            .data(packed_dataSet);
        selection.enter().append("circle");
        selection.exit().remove();
    }

    function render(dataSet) {

        var fScale = d3.scale.category20();

        d3.selectAll("circle")
            .attr({
                cx: function (d) {
                    return d.x;
                }, // 用 x,y 當圓心
                cy: function (d) {
                    return d.y;
                },
                r: function (d) {
                    return d.r;
                }, // 用 r 當半徑
                //fill: "#eee", 
                //???TODO-4.依行業別填不同色 
                fill: function (data) {
                    //console.log(data);
                    //找尋此物件是否有industry此參數，若沒有表示為自行建構出來的群組
                    //將群組分類(非本身資料，只是分類結構)移去
                    //(非本身資料，不需要將此最外圈的群組(圓)上色)
                    if (data.hasOwnProperty("industry")) {
                        return fScale(data.industry);
                    } else {
                        return "#eee";
                    }
                },
                stroke: "#666", // 邊框畫深灰色
            });

        //紀錄原本顏色
        let originalColor;

        d3.select("svg").selectAll("circle")
            .on("mouseover", function (data) {
                originalColor = d3.select(this).attr("fill");
                d3.select(this).attr({
                    fill: "gold",
                })
            })
            .on("mouseout", function (data) {
                d3.select(this).attr({
                    fill: originalColor
                })
            })
            .on("click", function (data) {
                console.log(data);
                d3.select("svg").selectAll("circle")
            });

    }
}