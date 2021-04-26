
// import * as d3 from "d3";
const dataPath = "../data/filtereddata.csv";

const genderColumn = "RV0005: Sex";
const genderMaleValue = 1;
const genderFemaleValue = 2;

const alcColumn = "V1264: Age at First Drink";
const offenseColumn = "RV0036: Controlling Offense Category - 13";

var numCols = 0;
var numRows = 0;
var xPadding = 0;
var yPadding = 0;
var hBuffer = 0;
var wBuffer = 0;
var currentSelectionFunction = undefined;
var prevTooltip = undefined;


const lambdaByGender = function(d){
    if (d[genderColumn] === genderMaleValue){
        return 0;
    } else if (d[genderColumn] === genderFemaleValue){
        return 1;
    } else {
        console.log(d[genderColumn]);
    }
};

const lambdaByAgeAlc = function(d){
    let alcValue = d[alcColumn];
    if (alcValue > 0 && alcValue < 100){
        return Math.floor(alcValue / 10);
    } else {
        return 11;
    }
};

const lambdaByOffenseType = function(d){
    let offenseType = d[offenseColumn];
    if (offenseType > 13 || offenseType < 1){
        return 0;
    }
    return offenseType;
}

const genderMapFunc = function(d){
    if (d[genderColumn] === genderMaleValue){
        return "Male";
    } else if (d[genderColumn] === genderFemaleValue){
        return "Female";
    } else {
        console.log(d[genderColumn]);
    }
};

const alcMapFunc = function(d){
    let alcValue = d[alcColumn];
    if (alcValue > 0 && alcValue < 100){
        return "Age:" + Math.floor(alcValue / 10)*10 + "-" + Math.floor(alcValue / 10)+9;
    } else {
        return "Did not answer/Never?";
    }
}

const offenseMapFunc = function(d){
    switch(d[offenseColumn]) {
        case 1:
            return "Homicide";
        case 2:
          return "Rape/Sexual Assault";
        case 3:
            return "Robbery";
        case 4:
            return "Assault";
        case 5:
            return "Other Violent";
        case 6:
            return "Burglary";
        case 7:
            return "Other Property";
        case 8:
            return "Drug Trafficking";
        case 9: 
            return "Drug Possession";
        case 10:
            return "Other Drug";
        case 11:
            return "Weapons";
        case 12: 
            return "Other Public Order";
        case 13:
            return "Other Unspecified";
        default:
            console.log("BROKEN offense type");
            return "No Offense Type Given";
          // code block
      }
}



var funcMaps = new Map();
funcMaps.set(lambdaByGender, genderMapFunc);
funcMaps.set(lambdaByAgeAlc, alcMapFunc);
funcMaps.set(lambdaByOffenseType, offenseMapFunc);

const tweenerFunc = function(d, i, a){
    // Called at the start of each thing, for each data point
    console.log(d);
    console.log(i);
    console.log(a);
    console.log("==");
    let whole = Math.floor((d.graphID + prevMap.get(inputFunc(d)))/numRows);
    if (inputFunc(d) === 0){
        whole = Math.floor((d.graphID)/numRows)
        
    } else {
        // otherwise add in previous counts
        whole = Math.floor((d.graphID + counts[0])/numRows)
        // remainder = (d.graphID + counts[0]) % numCols;
    }
    return function(d){
        // console.log(prevx + " mid " + typeof(d));
        return d3.interpolate(a, );
    };
}

// const lambdaBy
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
    for (let i = 0; i < 20; i++){
        counts.set(i, 0);
    }
    // counts[0] = 0;
    // counts[1] = 0 ;

    data.forEach(element => {
        let funcValue = inputFunc(element);
        if (!(counts.has(funcValue))){
            counts.set(funcValue, 0);
            maxValue = Math.max(funcValue, maxValue);
        }
        let seenSoFar = counts.get(funcValue);
    
        // Set value of graphID before updating count so 0 indexing.
        element.graphID = seenSoFar;
        counts.set(funcValue, seenSoFar + 1);
    });

    // Make sure a value is in each one.
    for (let i = 0; i < maxValue; i++){
        if (!counts.has(i)){
            counts.set(i, 0);
        }
    }
    console.log(counts);
    return counts;
};

function movePeople(inputFunc, data, counts){
    let prevMap = new Map();
    prevMap.set(0,0);
    for (let i = 1; counts.has(i); i++){
        prevMap.set(i, prevMap.get(i-1) + counts.get(i-1));
    }
    console.log(prevMap);
    d3.selectAll("use")
    .data(data)
    .transition()
    .delay(function(d, i) { return i})
    .duration(function(d, i){
        let prevX = this.getAttribute("x");
        let prevY = this.getAttribute("y");
        let whole = Math.floor((d.graphID + prevMap.get(inputFunc(d)))/numRows);
        let newX = xPadding+(whole*wBuffer);
        let remainder = (d.graphID + prevMap.get(inputFunc(d))) % numRows;
        let newY = yPadding+(remainder*hBuffer);
        let deltaX = newX - prevX;
        let deltaY = newY - prevY;

        let delta = Math.sqrt(deltaX*deltaX + deltaY*deltaY)
        console.log(prevX);
        return delta*12;
    })
    .ease(d3.easeSinInOut)
    // .tween( 'x', function() {
    //     // get current value as starting point for tween animation
    //     var currentValue = this;
    //     // create interpolator and do not show nasty floating numbers
    //     var interpolator = d3.interpolateRound( currentValue, 10 );

    //     // this returned function will be called a couple
    //     // of times to animate anything you want inside
    //     // of your custom tween
    //     return function( t ) {
    //       // set new value to current text element
    //       this.textContent = interpolator( t );
    // // .ease(d3.easeCubic)
    //     };
    // }
    //     )
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
    // .attrTween("x",function(d, i, a){
    //     // Called at the start of each thing, for each data point
    //     console.log(d);
    //     console.log(i);
    //     console.log(a);
    //     console.log("==");
    //     let whole = Math.floor((d.graphID + prevMap.get(inputFunc(d)))/numRows);
    //     if (inputFunc(d) === 0){
    //         whole = Math.floor((d.graphID)/numRows)
            
    //     } else {
    //         // otherwise add in previous counts
    //         whole = Math.floor((d.graphID + counts[0])/numRows)
    //         // remainder = (d.graphID + counts[0]) % numCols;
    //     }
    //     return function(d){
    //         // console.log(prevx + " mid " + typeof(d));
    //         return d3.interpolate(this.getAttr("x"), xPadding+(whole*wBuffer));
    //     };)
    .attr("y",function(d) {
        let remainder = (d.graphID + prevMap.get(inputFunc(d))) % numRows;

        // let whole = 0;
        // if (inputFunc(d) === 0){
        //     remainder = (d.graphID) % numRows;
        // } else {
        //     // otherwise add in previous counts
        //     remainder = (d.graphID + counts[0]) % numRows;//calculates the y position (row number)
        // }
        return yPadding+(remainder*hBuffer);//apply the buffer and return the value
    });
};




d3.csv(dataPath, d3.autoType).then(filteredData => {
    filteredData = filteredData.slice(0,2000);
    // var formatTime = d3.time.format("%e %B");

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



// svgDoc.attr("height", 8*numRows);
// svgDoc.attr("wixdth", 4*numCols);
//padding for the grid
xPadding = 10;
yPadding = 15;

//background rectangle
svgDoc.append("rect").attr("width",numCols*4+2*xPadding).attr("height",numRows*8 + 2*yPadding).attr('xlink:href', 'http://simpleicon.com/wp-content/uploads/smile.png');

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
var tooltip = d3.select('#chart')                               // NEW
          .append('div')                                                // NEW
          .attr('class', 'tooltip');                                    // NEW

        tooltip.append('div')                                           // NEW
          .attr('class', 'label');     
          tooltip.style('display', 'none');                                 

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
            var whole=Math.floor((d["V0001B: Respondent ID"]-1)/numRows)
            var remainder = (d["V0001B: Respondent ID"]-1) % numCols;//calculates the x position (column number) using modulus
            return xPadding+(whole*wBuffer);//apply the buffer and return value
        })
          .attr("y",function(d) {
            var remainder = (d["V0001B: Respondent ID"]-1) % numRows;
            var whole=Math.floor((d["V0001B: Respondent ID"]-1)/numCols)//calculates the y position (row number)
            return yPadding+(remainder*hBuffer);//apply the buffer and return the value
        })
        .attr("fill", "#D3D3D3");
      

        let temp = svgDoc.selectAll("use").on('mouseover', function(event, d) {  
            if (currentSelectionFunction !== undefined){
                if (prevTooltip !== funcMaps.get(currentSelectionFunction)(d)){
                    tooltip.select('.label').html(funcMaps.get(currentSelectionFunction)(d));            
                    tooltip.style('display', 'block');
                    prevTooltip = funcMaps.get(currentSelectionFunction)(d);
                };
                tooltip.style("left", (event.clientX + 10) + "px")     
                .style("top", (event.clientY + 10) + "px");       
            }            
          });                    
                                         
          temp.on("mousemove", function(){
            tooltip.style("left", (event.clientX + 10) + "px")     
            .style("top", (event.clientY + 10) + "px");    
          });
          svgDoc.on('mouseleave', function(event) {
            tooltip.style('display', 'none');      
            prevTooltip = undefined;                  
          });             

    
        
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
    if (currentSelectionFunction === undefined){
        console.log("no selection yet");
        return;
    }
    let counts = getCountsAndUpdateGraphId(currentSelectionFunction, filteredData);
    console.log(counts);
    movePeople(currentSelectionFunction, filteredData, counts);
});

let genderButton = document.getElementById('gender-button');
genderButton.addEventListener('click', function(){
    console.log("clicked gender button");
    currentSelectionFunction = lambdaByGender;

    colorPeople(filteredData, currentSelectionFunction);
});

let ageDrinkButton = document.getElementById('age-drink-button');
ageDrinkButton.addEventListener('click', function(){
    console.log("clicked drink button");
    currentSelectionFunction = lambdaByAgeAlc;
    colorPeople(filteredData, currentSelectionFunction);
});

let offenseButton = document.getElementById('offense-type-button');
offenseButton.addEventListener('click', function(){
    console.log("clicked offense button");
    currentSelectionFunction = lambdaByOffenseType;
    colorPeople(filteredData, currentSelectionFunction);
});


// let moveButtonA = document.getElementById('move-button');
// moveButton.addEventListener('click', function(){
//     console.log("clicked move button");
//     let lambdaDude = function(d){
//         if (d[genderColumn] === genderMaleValue){
//             return 0;
//         } else if (d[genderColumn] === genderFemaleValue){
//             return 1
//         } else {
//             console.log(d[genderColumn]);
//         }
//     };
//     let counts = getCountsAndUpdateGraphId(lambdaDude, filteredData);
//     console.log(counts);
//     movePeople(lambdaDude, filteredData, counts);
// });

});

function colorPeople(data, lambdaFunc){
    d3.selectAll("use")
    .data(data)
    .transition()
    .duration(400)
    .ease(d3.easeLinear)
    .attr("fill", d => returnClass(lambdaFunc, d));
}

let colorScale = d3.scaleOrdinal(d3.schemeTableau10);
function returnClass(lambdafunc, d){
    return colorScale(lambdafunc(d));
    // if (d["RV0005: Sex"] == "2"){
    //     colorScale(d)
    //     return "#BADA55";
    // }
    // return "#a7a59b";
}

