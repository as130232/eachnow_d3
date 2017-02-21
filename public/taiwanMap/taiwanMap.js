init();

function init() {
    getCityAvgSleepTime();
    render();
}

function getCityAvgSleepTime(){
    var whereCondition = {
        address: "台北市"
    };
    
    var membersInTaipei_sleepTimes = getMemberAndSleeptimesData(whereCondition);
    console.log(membersInTaipei_sleepTimes);
    var membersInTaipei_sleepTimes_map = _.mapValues(membersInTaipei_sleepTimes,function(obj) { return obj.sleepTimes; });
    //console.log(membersInTaipei_sleepTimes_map)
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
        
        g.append("path").datum(
            topojson.mesh(
                topology,
                topology.objects.map,
                (a,b)=>{
                    return a !== b;
            })
        ).attr("id", "borders").attr("d", path);   
    })

    function clicked(d){
        var x, y, k;

        if (d && centered !== d) {
            
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
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
     }
}