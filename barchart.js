// define margin and svg size
var lb_margin = { top: 40, bottom: 40, left: 40, right: 40 }
var lb_width = 320
var lb_height = 180
var lb_colorName =['#276bfd','#fd2727','#fdb927','#2fa62b']

// create stat 
d3.csv('./files/data/lebron.csv', function(data) {

  //console.log(data) // check the input data format in the browser console
  var lb_perf_dimensions = ['PTS','REB','AST','BLK']
  var lb_perf_PTS = []
  var lb_perf_REB = []
  var lb_perf_AST = []
  var lb_perf_BLK = []
  var seasons = []
  data.forEach(row => {
     lb_perf_PTS.push({ PTS: +row['PTS'], Seasons: row['Season']})
     lb_perf_REB.push({ REB: +row['TRB'], Seasons: row['Season']})
     lb_perf_AST.push({ AST:+row['AST'], Seasons: row['Season']})
     lb_perf_BLK.push({ BLK: +row['BLK'], Seasons: row['Season']})
     seasons.push(row['Season'])
  })

var lb_perf_Stats = [lb_perf_PTS,lb_perf_REB, lb_perf_AST,lb_perf_BLK]

console.log(lb_perf_Stats)

var lb_perf_x = d3
  .scaleBand()
  .range([0,lb_width])
  .domain(seasons)
  .padding(0.2);

  //  create y Scales
var lb_perf_y = []
for (var i = 0; i < lb_perf_dimensions.length; i++){
  var categ = lb_perf_Stats[i]
  lb_perf_y.push(
    d3
      .scaleLinear()
      .range([lb_height,0])
      .domain([0, d3.max(categ,d=>d[lb_perf_dimensions[i]])*1.0])
     // .ticks(5)
  )
  
}

// console.log(lb_perf_y)
// console.log(lb_perf_Stats)

// create small multiples
for (var j = 0; j <4; j++)
{
  d3.select('#lb-box-'+ (j+3))
    // .selectAll('ad-perf-svg')
    .append('svg')
        .attr('class', 'lb-perf-' + lb_perf_dimensions[j])
        .attr("width", lb_width + lb_margin.left + lb_margin.right)
        .attr("height", lb_height + lb_margin.top + lb_margin.bottom)
    .append('g')
        .attr('class', 'lb-perf-' +  lb_perf_dimensions[j] + '-g')
        .attr('transform', 'translate(' + lb_margin.top + ', ' + lb_margin.left + ')')
    .append("text")
       // .attr("transform", "rotate(-90)")
        .attr("y",  lb_height/2)
        .attr("x", -40)
        //.attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(lb_perf_dimensions[j]);
}

for (var i = 0; i < 4; i++) {
  var dimension = lb_perf_dimensions[i]
  d3.selectAll('.lb-perf-' + dimension + '-g')
  .append('g')
  .attr('transform', 'translate(' +0 + ', ' + lb_height + ')')
  .call(d3
     .axisBottom(lb_perf_x)
     .tickFormat(d => d.substring(2,7))
     )
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")

  d3.selectAll('.lb-perf-' + dimension + '-g')
  .append('g')
  .call(d3
      .axisLeft(lb_perf_y[i])
      .ticks(5)
      )
    
  //     console.log(dimension)
  d3.selectAll('.lb-perf-' + dimension + '-g')
    .selectAll('rect-' + dimension)
    .data(lb_perf_Stats[i])
    .enter()
    .append("rect")
    .attr("x", function(d) {return lb_perf_x(d.Seasons); }) 
    .attr("y", function(d) {return lb_perf_y[i](0); })
    .attr("fill",lb_colorName[i])
    .attr("width", function() {return lb_perf_x.bandwidth()*0.8})
    // .attr("height", function(d) {return height - lb_perf_y[i](0); })
    .attr("height", function(d) { console.log(lb_height - lb_perf_y[i](0)); return lb_height - lb_perf_y[i](0);})

  
  d3.selectAll('.lb-perf-' + dimension + '-g')
    .selectAll('rect-' + dimension)
    .data(lb_perf_Stats[i])
    .enter()
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return lb_perf_y[i](d[dimension]); })
    .attr("height", function(d) { return lb_height - lb_perf_y[i](d[dimension]); })
    .delay(function(d,j){ return(j*100)})
  }

})