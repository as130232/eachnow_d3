const jobArray = ['醫生','護士','軍人','警察','老師','工程師','農夫','服務業','廚師','模特兒','設計師','藝術家','工人','無業遊民','律師','工具人','商人'];

const colorArray = ['#3182bd','#6baed6','#9ecae1','#c6dbef','#e6550d','#fd8d3c','#fdae6b','#fdd0a2','#31a354','#74c476','#a1d99b','#c7e9c0','#756bb1','#9e9ac8','#bcbddc','#dadaeb','#636363'];

class ScatterDiagram {
    constructor(){
        this.attribute = {
            minAge: 0,
            maxAge: 0,
            minAvgSleepHr: 0,
            maxAvgSleepHr: 0,
            minAvgSleepInMinutes: 0,
            maxAvgSleepInMinutes: 0,
            svgWidth: document.getElementById('scatterDiagramContainer').clientWidth,
            svgHeight: 600,
            svgPadding: 60,
            dataArray: [],
        }
        this.setScale();
        this.bind();
        this.createSVG();
        this.render();
        this.selectBtn();
    }
    bind(){
        const selection = d3.select('#scatterDiagram_SVG')
                            .selectAll('circle')
                            .data(this.attribute.dataArray);
        selection.enter().append("circle");
        selection.exit().remove();
    }
    setScale(){
        let memberTotalAndAvgSleepTime = getAllTotalAndAvgSleepTime();
        let dataArray = [];
        memberTotalAndAvgSleepTime.map(function(aMember,index){
            let avg_totalSleepTime = aMember.avg_totalSleepTime/1000/60/60;
            let avg_sleepInTime = aMember.avg_sleepInTime/1000/60;
            let age = +moment(new Date(aMember.member[0].birth)).fromNow(true).substring(0,2);
            let job = aMember.member[0].job;
            let aMemberObj = {
                avg_totalSleepTime: avg_totalSleepTime,
                avg_sleepInTime: avg_sleepInTime,
                age: age,
                job: job,
            }
            dataArray.push(aMemberObj);
        });
        
        this.attribute.dataArray = dataArray;
        
        //X軸:年齡
        this.attribute.minAge = d3.min(dataArray,function(d){
            return d.age;
        });
        this.attribute.maxAge = d3.max(dataArray,function(d){
            return d.age;
        })
        
        //Y軸:avg睡眠時間
        this.attribute.minAvgSleepHr = d3.min(dataArray,function(d){
            return d.avg_totalSleepTime;
        });
        this.attribute.maxAvgSleepHr = d3.max(dataArray,function(d){
            return d.avg_totalSleepTime;
        });

        //R半徑:avg賴床時間
        this.attribute.minAvgSleepInMinutes = d3.min(dataArray,function(d){
            return d.avg_sleepInTime;
        });
        this.attribute.maxAvgSleepInMinutes = d3.max(dataArray,function(d){
            return d.avg_sleepInTime;
        });
    }
    createSVG(){
        d3.select('#scatterDiagram_SVG')
           .attr({
                width: this.attribute.svgWidth,
                height: this.attribute.svgHeight,
            })
    }
    render(){
        //console.log(this.attribute.dataArray)
        let width = this.attribute.svgWidth;
        let height = this.attribute.svgHeight;
        let padding = this.attribute.svgPadding;
        let xScale = d3.scale.linear()
                    .domain([this.attribute.minAge,this.attribute.maxAge])
                    .range([padding,(width-padding)]);
        let yScale = d3.scale.linear()
                    .domain([this.attribute.minAvgSleepHr,this.attribute.maxAvgSleepHr])
                    .range([(height-padding),padding]);
        
        //console.log(this.attribute.minAvgSleepInMinutes,this.attribute.maxAvgSleepInMinutes)
        let rScale = d3.scale.linear()
                    .domain([this.attribute.minAvgSleepInMinutes, this.attribute.maxAvgSleepInMinutes])
                    .range([this.attribute.minAvgSleepInMinutes,this.attribute.maxAvgSleepInMinutes]);

        // let force = d3.layout.force()
        //                      .gravity(0.1)
        //                      .charge(-600)
        //                      .nodes(this.attribute.dataArray)// 綁定資料
        //                      .size([width, height])// 設定範圍
        
        d3.select('#scatterDiagram_SVG')
          .selectAll('circle')
          .attr({
              cx: function(d){
                return xScale(d.age);
              },
              cy: function(d){
                return yScale(d.avg_totalSleepTime);
              },
              r: function(d){
                  //console.log(d.avg_sleepInTime)
                return rScale(d.avg_sleepInTime);
              },
              fill: function(d){
                  //console.log(jobArray.indexOf(d.job))
                return colorArray[jobArray.indexOf(d.job)];
              }
          });

          //X軸
          let xAxis = d3.svg.axis()
                            .scale(xScale) //指定軸線的比例尺為xScale
                            .orient("bottom") //設定刻度在右:表示垂直，刻度朝底下(用以表示x軸)
                            .ticks(10); //x軸上間距為8個刻度
          
          //Y軸
          let yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left")
                            .ticks(4);  //x軸上間距為2個刻度
          
          //2.將x軸畫在svg上，並增加axis定義的css 調整軸線及文字樣式

          d3.select('#scatterDiagram_SVG').select('g#axisX').remove();
          d3.select('#scatterDiagram_SVG').select('g#axisY').remove();
          
          d3.select('#scatterDiagram_SVG')
            .append("g")
            .attr({
                id: "axisX",
                class: "axis",
                //將軸線作位移 (將x軸移到最下方) translate(x, y);
                transform: "translate(" + 0 + "," + parseInt(height - padding + 10) + ")",
            })
            .call(xAxis);
          
          d3.select('#scatterDiagram_SVG')
            .append("g")
            .attr({
                id: "axisY",
                class: "axis",
                //將軸線作位移 (將x軸移到最下方) translate(x, y);
                transform: "translate(" + parseInt(padding - 7) + "," + 0 + ")",
            })
           .call(yAxis);
    }
    tick(){
        let dataArray = this.attribute.dataArray;
        var q = d3.geom.quadtree(dataArray),
                i = 0,
                n = dataArray.length;
        while (++i < n) { q.visit(collide(dataArray[i])); }
        function collide(node) {
            var r = node.radius + 16,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                    var x = node.x - quad.point.x,
                        y = node.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = node.radius + quad.point.radius;
                    if (l < r) {
                        l = (l - r) / l * .5;
                        node.x -= x *= l;
                        node.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
        }
    }
    selectBtn(){
        let jobArray=this.attribute.dataArray.map(function(aMember,index){
            return aMember.job
        });
        let uniqJobArray = _.uniq(jobArray);
        //console.log(uniqJobArray)
        let selectOption = d3.select('#jobSelect')
                             .selectAll('option')
                             .data(uniqJobArray);
        
        selectOption.enter().append("option")
                 .property({
                    value: function (d) {
                        return d;
                    },
                  })
                  .text(function (d) {
                     return d;
                  });
         d3.select("select")
           .on("change", ()=>{
                let value = d3.select("select").property("value");
                this.update(value);
            });
    }
    update(value){
        //console.log('select value:', value);
        let selectedDataArray = _.filter(this.attribute.dataArray,['job',value]);
        this.attribute.dataArray = selectedDataArray;
        this.bind(selectedDataArray);
        this.setScale(selectedDataArray);
        
        this.render();
    }
}

new ScatterDiagram;