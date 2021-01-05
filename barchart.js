// define margin and svg size
var margin = { top: 40, bottom: 40, left: 40, right: 40 }
var width = 400
var height = 200
var colorName =['#276bfd','#fd2727','#fdb927','#2fa62b']

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

 

var lb_perf_x = d3
  .scaleBand()
  .range([0,width])
  .domain(seasons)
  .padding(0.2);

  //  create y Scales
var lb_perf_y = []
for (var i = 0; i < lb_perf_dimensions.length; i++){
  var categ = lb_perf_Stats[i]
  lb_perf_y.push(
    d3
      .scaleLinear()
      .range([height,0])
      .domain([0, d3.max(categ,d=>d[lb_perf_dimensions[i]])*1.0])
     // .ticks(5)
  )
  
}

console.log(lb_perf_y)
console.log(lb_perf_Stats)

// create small multiples
d3.select('#lb-bar-chart')
  .selectAll('lb-perf-svg')
  .data(lb_perf_dimensions)
  .enter()
  .append('svg')
    .attr('class', d => 'lb-perf-' + d)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr('class', d => 'lb-perf-' + d + '-g')
    .attr('transform', 'translate(' + margin.top + ', ' + margin.left + ')')

for (var i = 0; i < 4; i++) {
  var dimension = lb_perf_dimensions[i]

  d3.selectAll('.lb-perf-' + dimension + '-g')
  .append('g')
  .attr('transform', 'translate(' +0 + ', ' + height + ')')
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
    .attr("fill",colorName[i])
    .attr("width", function() {return lb_perf_x.bandwidth()})
    .attr("height", function(d) {return height - lb_perf_y[i](0); })
  
  d3.selectAll('.lb-perf-' + dimension + '-g')
    .selectAll('rect-' + dimension)
    .data(lb_perf_Stats[i])
    .enter()
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return lb_perf_y[i](d[dimension]); })
    .attr("height", function(d) { return height - lb_perf_y[i](d[dimension]); })
    .delay(function(d,j){console.log(j) ; return(j*100)})
  }

})