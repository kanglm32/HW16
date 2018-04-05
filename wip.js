var svgWidth = 960;
var svgHeight = 500;



var margin = {top: 20, right: 40, bottom: 60, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');



d3.csv('data.csv', function(err, corrData) {
  if (err) throw err;

  corrData.forEach(function(data) {
    data.children = +data.children;
    data.uninsured = +data.uninsured;
    data.staets = +data.locationa
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([
    20,
    d3.max(corrData, function(data) {
      return +data.children;
    }),
  ]);
  yLinearScale.domain([
    0,
    d3.max(corrData, function(data) {
      return +data.uninsured * 1.2;
    }),
  ]);

  var toolTip = d3
    .tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(data) {
      var stateName = data.locationa;
      var childrens = +data.children;
      var uninsureds = +data.uninsured;
      return (
        stateName
      );
    });

  chart.call(toolTip);

  chart
    .selectAll('circle')
    .data(corrData)
    .enter()
    .append('circle')
    .attr('cx', function(data, index) {
      return xLinearScale(data.children);
    })
    .attr('cy', function(data, index) {
      return yLinearScale(data.uninsured);
    })
    .text(function(data){ return data.locationa; })
    .attr('r', '15')
    .attr('color', 'black')
    .attr('fill', 'purple');

    

  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append('g').call(leftAxis);

  chart
    .append('text')
    // .text(function(data){ return data.locationa; })
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('% of People without health insurnace');

  // chart
  //   .append('text')
  //   .data(corrData)
  //   .attr('cx', function(data, index) {
  //     return xLinearScale(data.children);
  //   })
  //   .attr('cy', function(data, index) {
  //     return yLinearScale(data.uninsured);
  //   })
  //   .attr("text-anchor", "middle")
  //   .text(function(data){ return data.locationa; })
  //   .style({
  //     "fill":"black", 
  //     "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
  //     "font-size": "10px"
  // });

  // Append x-axis labels
  chart
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + margin.top + 30) + ')',
    )
    .attr('class', 'axisText')
    .text('% of Household with 2+ children in Poverty');
});
