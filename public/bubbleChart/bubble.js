//大圈:行業別 - 城市別 - 男女別

window.onload = init;

function init() {


    function setAllQuerySelectValue() {
        let whereCondition = {};
        let firstStructureSelect = $("#firstStructureSelect").val();
        let secondStructureSelect = $("#secondStructureSelect").val();
        let aggregateType = $("#aggregateSelect").val();
        let statusType = $("#statusSelect").val();
        //必須滿足都要有值才可以組成whereCondition，並送出查詢畫出泡泡圖
        if (aggregateType && statusType && firstStructureSelect && secondStructureSelect) {
            let whereCondition = {};
            whereCondition.aggregateType = aggregateType + "_" + statusType;
            whereCondition.firstStructure = firstStructureSelect;
            whereCondition.secondStructure = secondStructureSelect;

            drawBubbleChart(whereCondition);
        }

    }

    //drawBubbleChart();
    $("#firstStructureSelect").on("change", function () {
        setAllQuerySelectValue();
    });

    $("#secondStructureSelect").on("change", function () {
        setAllQuerySelectValue();
    });

    $("#aggregateSelect").on("change", function () {
        setAllQuerySelectValue();
    });

    $("#statusSelect").on("change", function () {
        setAllQuerySelectValue();
    });
}



function drawBubbleChart(whereCondition) {
    // clear old svg.
    $("#bubbleChart svg").remove();

    let bubbleChartSvg = {};
    bubbleChartSvg.width = document.getElementById('bubbleChart').clientWidth;
    bubbleChartSvg.height = 800; //document.getElementById('bubbleChart').clientHeight;

    var padding = 90;


    createSvg();

    //所有會員賴床次數
    let allMembersSleepTimesCountData = getAllMembersSleepTimesCountData();

    let allMembersAndSleepTimes = getAllTotalAndAvgSleepTime();

    allMembersAndSleepTimes = convertInt(allMembersAndSleepTimes, whereCondition);

    bind(allMembersAndSleepTimes, whereCondition);
    render(allMembersAndSleepTimes);



    //先做轉圖型
    function convertInt(dataArray, whereCondition) {
        //var whereCondition = "sum_totalSleepTime";

        dataArray.forEach(function (data) {
            //自行設定每筆資料物件多 value的屬性，其值定義根據前端user選擇
            data.value = data[whereCondition.aggregateType];
        });


        return dataArray;
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

    function bind(dataSet, whereCondition) {
        
        //d3.nest() 將資料結構(巢狀)化，區分為key value
        let nestedDataSet = d3.nest()
            //先按照職業區分
            .key(function (data) {
                let result = judgeStructure(data, whereCondition.firstStructure);
                return result;  
                //return data.member[0][whereCondition.firstStructure]
            })
            //.sortValues(d3.descending)
            //在按照性別劃分
            .key(function (data) {
                let result = judgeStructure(data, whereCondition.secondStructure);
                return result;  
                //return data.member[0][whereCondition.secondStructure];
            })
            //entries : 資料來源
            .entries(dataSet);

        //多包一層Key Vaule(d3.node())需要的資料格式
        var root = {
            values: nestedDataSet
        };



        var packed_dataSet = d3.layout.pack()
            .size([bubbleChartSvg.width, bubbleChartSvg.height])
            .padding(2)
            //升序 由小排到大 d3.ascending(a, b);
            //降序 由大排到小 d3.descending(a, b);
            .sort(function (a, b) {
                //原本內圈有小圓逆時針到外圈大圓
                //藉由排序將顯示顛倒過來

                //由user下拉選單的條件作排序
                return d3.descending(a[whereCondition.aggregateType], b[whereCondition.aggregateType]);
                //return d3.ascending(a.number, b.number);
            })
            .children(
                function (data) {
                    //回傳key(group)對應的vaules (資料的子結構)
                    return data.values;
                }
            )
            .nodes(root); //nodes:節點下需要的 root巢狀化資料

        //只有第一筆資料沒有parent，為最外層最大顆的圓，去除掉
        packed_dataSet = packed_dataSet.filter(function (data) {
            //過濾是否有parent欄位
            return data.parent;
        });

        var selection = d3.select("svg")
            .selectAll("circle")
            .data(packed_dataSet);
        selection.enter().append("circle");
        selection.exit().remove();
        
        
        //檢測結構化資料
        function judgeStructure(data, structure) {
            ////若是年齡，key每十年為一單位，ex:1983 → 1980，無條件捨去
            if ((structure.toString()) == "birth") {
                let dateStr = data.member[0][structure];
                let result = takeToTenDigitsFromDateStr(dateStr);
                return result;
            } else {
                //回傳一般屬性
                return data.member[0][structure];
            }
        }

        function takeToTenDigitsFromDateStr(dateStr) {
            let year = (new Date(dateStr)).getFullYear();
            //let year = date.getFullYear();
            let roundYear = (Math.floor(year / 10)) * 10;
            let addTenYear = roundYear + 10 - 1;
            return roundYear + " - " + addTenYear;
        }

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
                fill: function (data) {
                    //找尋此物件是否有member屬性，若沒有表示為自行建構出來的群組
                    //將此群組分類(非本身資料，只是分類結構)移去
                    //(非本身資料，不需要將此最外圈的群組(圓)上色)
                    if (data.hasOwnProperty("member")) {
                        return fScale(data.member[0].job);
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
                    fill: "#00FA9A",
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