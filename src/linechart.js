d3.csv("../data/popbyyear.csv", d3.autoType).then(filteredData => {    

var margin = {top: 50, right: 30, bottom: 30, left: 100},
width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var svg = d3.select("#line-chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
        .domain([1925, 2016])
        .range([ 0,  width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0,  2500000])
        .range([ height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));
    
      // Add dots
      svg.append('g')
        .selectAll("dot")
        .data(filteredData)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.year); } )
          .attr("cy", function (d) { return y(d.count); } )
          .attr("r", 3)
          .style("fill", "#e84855ff");

          var tooltip = d3.select('#line-chart')                               // NEW
          .append('div')                                                // NEW
          .attr('class', 'tooltip');                                    // NEW
  
    svg.append('g')
    .selectAll("dot")
    .append("rect")
    .attr
      tooltip.append('div')                                           // NEW
          .attr('class', 'label');
      tooltip.style('display', 'none');

      svg.selectAll("circle").on('mousemove', function (event, d) {
          console.log("dot!");
                let color = this.getAttribute("fill");
                tooltip.style("border-color", color);
                tooltip.select('.label').html(d.count);
                tooltip.style('display', 'block');
            tooltip.style("left", (event.clientX + 2) + "px")
                .style("top", (event.clientY + 2) + "px");
        // }
    });

    // Update the position and remove based on the size of the g (which has an invisible rectangle behind it)
    svg.on("mousemove", function (event) {
        tooltip.style("left", (event.clientX + 10) + "px")
            .style("top", (event.clientY + 10) + "px");
    });
    svg.on('mouseleave', function (event) {
        tooltip.style('display', 'none');
        // prevTooltip = undefined;
    });
  
});
