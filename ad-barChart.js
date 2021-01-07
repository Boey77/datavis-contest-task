var ad_margin = { top: 40, right: 40, bottom: 40, left: 40 }
var ad_width = 320
var ad_height = 180
var ad_colorName =['#276bfd','#fd2727','#fdb927','#2fa62b']

d3.csv('./files/data/ad.csv', function(data) {
    //console.log(data) // check the input data format in the browser console
  var ad_perf_dimensions = ['PTS','REB','AST','BLK']
  var ad_perf_PTS = []
  var ad_perf_REB = []
  var ad_perf_AST = []
  var ad_perf_BLK = []
  var seasons = []
  data.forEach(row => {
     ad_perf_PTS.push({ PTS: +row['PTS'], Seasons: row['Season']})
     ad_perf_REB.push({ REB: +row['TRB'], Seasons: row['Season']})
     ad_perf_AST.push({ AST:+row['AST'], Seasons: row['Season']})
     ad_perf_BLK.push({ BLK: +row['BLK'], Seasons: row['Season']})
     seasons.push(row['Season'])
  })

  var ad_perf_Stats = [ad_perf_PTS,ad_perf_REB, ad_perf_AST,ad_perf_BLK]

 

var ad_perf_x = d3
  .scaleBand()
  .range([0,ad_width])
  .domain(seasons)
  .padding(0.2);

  //  create y Scales
var ad_perf_y = []
for (var i = 0; i < ad_perf_dimensions.length; i++){
  var categ = ad_perf_Stats[i]
  ad_perf_y.push(
    d3
      .scaleLinear()
      .range([ad_height,0])
      .domain([0, d3.max(categ,d=>d[ad_perf_dimensions[i]])*1.0])
    
  )
  
}

// create small multiples
for (var j = 0; j <4; j++)
{
  d3.select('#ad-box-'+ (j+3))
    // .selectAll('ad-perf-svg')
    .append('svg')
        .attr('class', 'ad-perf-' + ad_perf_dimensions[j])
        .attr("width", ad_width + ad_margin.left + ad_margin.right)
        .attr("height", ad_height + ad_margin.top + ad_margin.bottom)
    .append('g')
        .attr('class', 'ad-perf-' +  ad_perf_dimensions[j] + '-g')
        .attr('transform', 'translate(' + ad_margin.top + ', ' + ad_margin.left + ')')
    // .append("text")
    //     .attr("transform", "translate(" + (ad_width / 2) + " ," + (ad_height + ad_margin.bottom ) + ")")
    //     .style("text-anchor", "middle")
    //     .text("Season")
    .append("text")
       // .attr("transform", "rotate(-90)")
        .attr("y",  ad_height/2)
        .attr("x", -40)
        //.attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(ad_perf_dimensions[j]);
}

for (var i = 0; i < 4; i++) {
  var dimension = ad_perf_dimensions[i]
  d3.selectAll('.ad-perf-' + dimension + '-g')
  .append('g')
  .attr('transform', 'translate(' +0 + ', ' + ad_height + ')')
  .call(d3
     .axisBottom(ad_perf_x)
     .tickFormat(d => d.substring(2,7))
     )
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    

  d3.selectAll('.ad-perf-' + dimension + '-g')
  .append('g')
  .call(d3
      .axisLeft(ad_perf_y[i])
      .ticks(5)
      )
    

  d3.selectAll('.ad-perf-' + dimension + '-g')
    .selectAll('rect-' + dimension)
    .data(ad_perf_Stats[i])
    .enter()
    .append("rect")
    .attr("x", function(d) {return ad_perf_x(d.Seasons); }) 
    .attr("y", function(d) {return ad_perf_y[i](0); })
    .attr("fill",ad_colorName[i])
    .attr("width", function() {return ad_perf_x.bandwidth() *0.8})
    .attr("height", function(d) {return ad_height - ad_perf_y[i](0); })
  
  d3.selectAll('.ad-perf-' + dimension + '-g')
    .selectAll('rect-' + dimension)
    .data(ad_perf_Stats[i])
    .enter()
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return ad_perf_y[i](d[dimension]); })
    .attr("height", function(d) { return ad_height - ad_perf_y[i](d[dimension]); })
    .delay(function(d,j){ return(j*100)})
  }

})
