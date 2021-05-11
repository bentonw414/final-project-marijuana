d3.csv("../data/popbyyear.csv", d3.autoType).then(filteredData => {    

var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = 500 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;
// var width = 600
// var height = 300;
var svg = d3.select("#line-chart")
.append("svg").attr("viewBox", "0 0 500 300")
.attr("width", width)
.attr("height", height);
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom);

        var x = d3.scaleLinear()
        .domain([1925, 2016])
        .range([ 0,  width]);
      svg.append("g")
        .attr("transform", "translate(0 " + height + ")")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
    
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0,  2500000])
        .range([ height, 0]);
      svg.append("g")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .call(d3.axisLeft(y).ticks(2));
      
        svg.append("rect")
        .attr("class", "backgroundRect-linechart");
    
      // Add dots
      svg.append('g')
        .attr("id", "circlesId")
        .selectAll("dot")
        .data(filteredData)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.year); } )
          .attr("cy", function (d) { return y(d.count); } )
          .attr("r", 3)
          .style("fill", "#e84855ff");

      let backgroundRect = svg.selectAll(".backgroundRect-linechart")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "black");
        

          var tooltip = d3.select('#line-chart')                               // NEW
          .append('div')                                                // NEW
          .attr('class', 'tooltip2');

                              // NEW
  
    svg.append('g')
    .selectAll("dot");
    // .append("rect")
      tooltip.append('div')                                           // NEW
          .attr('class', 'label2')
          tooltip.select('.label2').html("<p>Year: <br>" + 
              "<b>1925</b><br>" + "Prison Population: <br>" +"<b>91,669</b>" + "</p>");
      // tooltip.style('display', 'none');

    //   svg.selectAll("circle").on('mousemove', function (event, d) {
    //       console.log("dot!");
    //             let color = this.getAttribute("fill");
    //             tooltip.style("border-color", color);
    //             tooltip.select('.label').html(d.count);
    //             tooltip.style('display', 'block');
    //         tooltip.style("left", (event.clientX + 2) + "px")
    //             .style("top", (event.clientY + 2) + "px");
    //     // }
    // });

    // Update the position and remove based on the size of the g (which has an invisible rectangle behind it)

    backgroundRect.on("mouseover", function (e){
      svg.selectAll(".lines").remove();
      svg.append("line")
        .attr("class", "lines");
    })

    // backgroundRect.on("mouseout", function (e){
    //   svg.selectAll(".lines")
    //     .remove();
    //   svg.selectAll("circle")
    //     .style("fill", "#e84855ff");
    // })
    backgroundRect.on("mousemove", function (e) {
      // rect.width is width in pixels of drawing area on screen
          let rectBBox = document.querySelector('#iconRect');

    // Set the rect to the size of the bounding box with all the icons
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;  //y position within the element.
      // console.log("Left? : " + x + " ; Top? : " + y + ".");
      // console.log(rect);
      // x currently is in pixels from left of drawing area
      let xRatio = x/(rect.width);
      // console.log(Math.round((xRatio)*(2017-1925))+1925);
      var year = Math.round((xRatio)*(2017-1925))+1925;
      var bisect = d3.bisector(d => d.year);
      var i = bisect.left(filteredData, year);
      // console.log(filteredData[i]);
      var d = filteredData[i];
      if (d === undefined || d.year === undefined){
        return;
      }

      svg.selectAll("circle")
      .style("fill", d => {
        if (d.year === year){
          return "#54f2f2ff";
        }
        return "#e84855ff";
      });
      // Commas taken from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
            tooltip.select('.label2').html("<p>Year: <br><b>" + 
            d.year + "</b><br>" + "Prison Population: <br><b>" + d.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></p>");
                // tooltip.style('display', 'block');
            // tooltip.style("left", e.clientX)
            //     .style("top", e.clientY);
      var x = d3.scaleLinear()
      .domain([1925, 2016])
      .range([ 0,  width]);
      if (!(x(year) >= 0)){
        // console.log(x(year));
        return;
      }
      svg.selectAll(".lines")
      
      .attr("x1", x(year))  //<<== change your code here
      .attr("y1", 0)
      .attr("x2", x(year))  //<<== and here
      .attr("y2", height - margin.top - margin.bottom)
      .style("stroke-width", 1)
      .style("stroke", "#54f2f2ff")
      .style("fill", "none");
    });

  
});
