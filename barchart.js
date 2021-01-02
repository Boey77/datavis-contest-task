// define margin and svg size
var margin = { top: 50, bottom: 50, left: 50, right: 150 }
var width = 800
var height = 600

// create svg
var exampleBarChartSvg = d3
  .select('#example-bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv('./files/data/lebron.csv', data => {
  console.log(data) // check the input data format in the browser console

  var stats = []
  var seasons = []
  data.forEach(row => {
    stats.push({ season: row['Season'], PTS: +row['PTS'] })
    seasons.push(row['Season'])
  })
  console.log(stats)
  console.log(seasons)

  // step 1: create scale
  // for x-axis (seasons), use scaleLinear
  var xScale = d3
    .scaleLinear()
    .domain([-0.5, seasons.length-0.5])
    .range([0, width])

  exampleBarChartSvg
    .append('g')
    .attr('transform', 'translate(' + 0 + ', ' + height + ')')
    .call(
      d3
        .axisBottom(xScale)
        .tickSize(2)
        .ticks(seasons.length)
        .tickFormat(d => seasons[d])
    )

    // for y-axis (seasons), use scaleLinear

    // step 2: create bars (by appending rectangles)

    // step 3: add x-axis, y-axis, chart title

    // step 4: adjust styles, e.g. font size

  
})
