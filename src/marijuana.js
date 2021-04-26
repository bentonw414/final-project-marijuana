
// import * as d3 from "d3";
const dataPath = "../data/filtereddata.csv";

const genderColumn = "RV0005: Sex";
const genderMaleValue = 1;
const genderFemaleValue = 2;

var numCols = 0;
var numRows = 0;
var xPadding = 0;
var yPadding = 0;
var hBuffer = 0;
var wBuffer = 0;
// for a given filter
// count selected
// count not selected

// Give everyone a graph id

// Takes in a function, and gives each data point a "graphid" (id within category)
// Returns a map of counts for each category
// Input func maps a data point to a category value integer 0 - n categories - 1
function getCountsAndUpdateGraphId(inputFunc, data) {
    maxValue = -1;
    let counts = new Map();
    // TODO make this just however many categories there are 
    counts[0] = 0;
    counts[1] = 0 ;

    data.forEach(element => {
        let funcValue = inputFunc(element);
        if (!(counts.has(funcValue))){
            counts.set(funcValue, 0);
            maxValue = Math.max(funcValue, maxValue);
        }
        let seenSoFar = counts[funcValue];
    
        // Set value of graphID before updating count so 0 indexing.
        element.graphID = seenSoFar;
        counts[funcValue] = seenSoFar + 1;
    });

    // Make sure a value is in each one.
    for (let i = 0; i < maxValue; i++){
        if (!counts.has(i)){
            counts[i] = 0;
        }
    }

    return counts;
};

function movePeople(inputFunc, data, counts){
    let prevMap = new Map();
    prevMap.set(0,0);
    for (let i = 1; counts.has(i); i++){
        console.log(prevMap.get(i-1));
        console.log(counts[i-1]);
        prevMap.set(i, prevMap.get(i-1) + counts[i-1]);
    }
    console.log(prevMap);
    d3.selectAll("use")
    .data(data)
    .transition()
    .duration(5000)
    .ease(d3.easeCubic)
    .attr("x",function(d) {
        let whole = Math.floor((d.graphID + prevMap.get(inputFunc(d)))/numRows);
        // if (inputFunc(d) === 0){
        //     whole = Math.floor((d.graphID)/numRows)
            
        // } else {
        //     // otherwise add in previous counts
        //     whole = Math.floor((d.graphID + counts[0])/numRows)
        //     // remainder = (d.graphID + counts[0]) % numCols;
        // }

        return xPadding+(whole*wBuffer);//apply the buffer and return value
    })
    .attr("y",function(d) {
        let remainder = 0;

        // let whole = 0;
        if (inputFunc(d) === 0){
            remainder = (d.graphID) % numRows;
        } else {
            // otherwise add in previous counts
            remainder = (d.graphID + counts[0]) % numRows;//calculates the y position (row number)
        }
        return yPadding+(remainder*hBuffer);//apply the buffer and return the value
    });
};



d3.csv(dataPath, d3.autoType).then(filteredData => {
    filteredData = filteredData.slice(0,1000);

console.log(filteredData)
//placeholder div for jquery slider
d3.select("body").append("div").attr("id","sliderDiv");
            
//create svg element
var svgDoc=d3.select("body").append("svg").attr("viewBox","0 0 450 400");

 //define an icon store it in svg <defs> elements as a reusable component - this geometry can be generated from Inkscape, Illustrator or similar
svgDoc.append("defs")
    .append("g")
    .attr("id","iconCustom")
        .append("path")
            .attr("d", "M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");
            // ,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");



//specify the number of columns and rows for pictogram layout
numCols = 100;
numRows = Math.floor(filteredData.length/numCols);


//background rectangle
svgDoc.append("rect").attr("width",numCols*8).attr("height",numRows*4);

// svgDoc.attr("height", 8*numRows);
// svgDoc.attr("width", 4*numCols);
//padding for the grid
xPadding = 10;
yPadding = 15;

//horizontal and vertical spacing between the icons
hBuffer = 8;
wBuffer = 4;

//generate a d3 range for the total number of required elements
// var myIndex=d3.range(numCols*numRows);

//text element to display number of icons highlighted
// svgDoc.append("text")
//     .attr("id","txtValue")
//     .attr("x",xPadding)
//     .attr("y",yPadding)
//     .attr("dy",-3)
//     .text("0");

//create group element and create an svg <use> element for each icon
svgDoc.append("g")
    .attr("id","pictoLayer")
    .selectAll("use")
    .data(filteredData)
    .enter()
    .append("use")
        .attr("xlink:href","#iconCustom")
        .attr("id",function(d)    {
            return "icon"+d;
        })
        .attr("x",function(d) {
            var remainder=
            (d["V0001B: Respondent ID"]-1) % numCols;//calculates the x position (column number) using modulus
            return xPadding+(remainder*wBuffer);//apply the buffer and return value
        })
          .attr("y",function(d) {
            var whole=Math.floor((d["V0001B: Respondent ID"]-1)/numCols)//calculates the y position (row number)
            return yPadding+(whole*hBuffer);//apply the buffer and return the value
        })
        .attr("class", d => returnClass(d))
        // .classed(returnClass(), true);

        
//create a jquery slider to control the pictogram         
//  ( "#sliderDiv" ).slider({
//       orientation: "horizontal",
//       min: 0,
//       max: numCols*numRows,
//       value: 0,
//       slide: function( event, ui ) {
//         d3.select("#txtValue").text(ui.value);
//         d3.selectAll("use").attr("class",function(d,i){
//            if (d<ui.value)  {
//                return "iconSelected";
//            }    else    {
//                return "iconPlain";
//            }
//         });
//       }
//  });

let moveButton = document.getElementById('move-button');
moveButton.addEventListener('click', function(){
    console.log("clicked move button");
    let lambdaDude = function(d){
        if (d[genderColumn] === genderMaleValue){
            return 0;
        } else if (d[genderColumn] === genderFemaleValue){
            return 1
        } else {
            console.log(d[genderColumn]);
        }
    };
    let counts = getCountsAndUpdateGraphId(lambdaDude, filteredData);
    console.log(counts);
    movePeople(lambdaDude, filteredData, counts);
});

});

function returnClass(d){
    if (d["RV0005: Sex"] == "2"){
        return "iconSelected";
    }
    return "iconPlain";
}

