
const dataPath = "../data/compileddata.csv";

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
var currentLabelData = undefined;
var prevTooltip = undefined;
var svgDocGlob = undefined;


const lambdaByGender = function (d) {
    if (d[genderColumn] === genderMaleValue) {
        return 0;
    } else if (d[genderColumn] === genderFemaleValue) {
        return 1;
    } else {
        return 2
        console.log(d[genderColumn]);
    }
};

const labelsGender =
    [
        {
            hashValue: 0,
            meaning: "Male"
        },
        {
            hashValue: 1,
            meaning: "Female"
        }
    ];

const lambdaByAgeAlc = function (d) {
    let alcValue = d[alcColumn];
    if (alcValue > 0 && alcValue < 100) {
        return Math.floor(alcValue / 10);
    } else {
        return 11;
    }
};

const lambdaByOffenseType = function (d) {
    let offenseType = d[offenseColumn];
    if (offenseType > 13 || offenseType < 1) {
        return 0;
    }
    return offenseType;
}

const genderMapFunc = function (d) {
    if (d[genderColumn] === genderMaleValue) {
        return "Male";
    } else if (d[genderColumn] === genderFemaleValue) {
        return "Female";
    } else {
        console.log(d[genderColumn]);
    }
};

const alcMapFunc = function (d) {
    let alcValue = d[alcColumn];
    if (alcValue > 0 && alcValue < 100) {
        return "Age:" + Math.floor(alcValue / 10) * 10 + "-" + Math.floor(alcValue / 10) + 9;
    } else {
        return "Did not answer/Never?";
    }
}

const offenseMapFunc = function (d) {
    switch (d[offenseColumn]) {
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

const labelsOffenseMap =
    [
        {
            hashValue: 0,
            meaning: "No Offense Type Given"
        },
        {
            hashValue: 1,
            meaning: "Homicide"
        },
        {
            hashValue: 2,
            meaning: "Rape/Sexual Assault"
        },
        {
            hashValue: 3,
            meaning: "Robbery"
        },
        {
            hashValue: 4,
            meaning: "Assault"
        },
        {
            hashValue: 5,
            meaning: "Other Violent"
        },
        {
            hashValue: 6,
            meaning: "Burglary"
        },
        {
            hashValue: 7,
            meaning: "Other Property"
        },
        {
            hashValue: 8,
            meaning: "Drug Trafficking"
        },
        {
            hashValue: 9,
            meaning: "Drug Possession"
        },
        {
            hashValue: 10,
            meaning: "Other Drug"
        },
        {
            hashValue: 11,
            meaning: "Weapons"
        },
        {
            hashValue: 12,
            meaning: "Other Public Order"
        },
        {
            hashValue: 13,
            meaning: "Other Unspecified"
        }
    ];

var funcMaps = new Map();
funcMaps.set(lambdaByGender, genderMapFunc);
funcMaps.set(lambdaByAgeAlc, alcMapFunc);
funcMaps.set(lambdaByOffenseType, offenseMapFunc);

// Takes in a function, and gives each data point a "graphid" (id within category)
// Returns a map of counts for each category
// Input func maps a data point to a category value integer 0 - n categories - 1
function getCountsAndUpdateGraphId(inputFunc, data) {
    maxValue = -1;
    let counts = new Map();
    // TODO make this just however many categories there are 
    for (let i = 0; i < 20; i++) {
        counts.set(i, 0);
    }

    data.forEach(element => {
        let funcValue = inputFunc(element);
        if (!(counts.has(funcValue))) {
            counts.set(funcValue, 0);
            maxValue = Math.max(funcValue, maxValue);
        }
        let seenSoFar = counts.get(funcValue);

        // Set value of graphID before updating count so 0 indexing.
        element.graphID = seenSoFar;
        counts.set(funcValue, seenSoFar + 1);
    });

    // Make sure a value is in each one.
    for (let i = 0; i < maxValue; i++) {
        if (!counts.has(i)) {
            counts.set(i, 0);
        }
    }
    return counts;
};

function getTextX(counts, prevMap, d) {
    let key = d.hashValue;
    let leftHumans = Math.floor(prevMap.get(key) / numRows);// something like this
    let humansWide = Math.floor(counts.get(key) / numRows);//some calculation involving numRows and counts[key]
    let centerHumans = Math.floor(leftHumans + humansWide / 2);
    let xValue = xPadding + (centerHumans * wBuffer) + 10; // stolen from function for drawing little people.
    return xValue;
}

/**
 * Draws the labels for each section of the graph based on 
 * counts.
 * @param mapping should map an id (integer) to some string value
 *      corresponds with the hashing functions.
 */
function drawLabels(mapping, counts) {
    // intialize some counter
    let prevMap = new Map();
    prevMap.set(0, 0);
    for (let i = 1; counts.has(i); i++) {
        prevMap.set(i, prevMap.get(i - 1) + counts.get(i - 1));
    }
    svgDocGlob.selectAll('.labelsText')
        .data(mapping)
        .join(
            enter => enter.append("text")
                .attr("opacity", 0)
                .attr("transform", function (d) {
                    let xValue = getTextX(counts, prevMap, d) // stolen from function for drawing little people.
                    return "translate(" + xValue + "," + yPadding + ")" + "rotate(315)";
                })
                .attr("y", 0)
                .attr("dy", -5)
                .attr("font-size", "6px")
                .attr("x", 0)
                .text(d => d),
            update => update,
            exit => exit.transition().duration(1000).ease(d3.easeSinInOut).attr("opacity", 0).remove()
        )
        .attr("class", "labelsText")
        .transition()
        .on("end", function () {
            svgDocGlob.selectAll('.labelsText')
                .data(mapping)
                .join("text")
                .attr("transform", function (d) {
                    let xValue = getTextX(counts, prevMap, d); // stolen from function for drawing little people.
                    return "translate(" + xValue + "," + yPadding + ")" + "rotate(315)";
                })
                .attr("y", 0)
                .attr("dy", -3)
                .attr("font-size", "6px")
                .attr("x", 0)
                .transition()
                .duration(1000)
                .ease(d3.easeSinInOut)
                .attr("fill", d => getColorOfHash(d.hashValue))
                .attr("opacity", 1)
                .text(d => d.meaning);
        })
        .duration(1000)
        .ease(d3.easeSinInOut)
        .attr("opacity", "0");
}

function getCounts(inputFunc, data) {
    maxValue = -1;
    let counts = new Map();
    // TODO make this just however many categories there are 
    for (let i = 0; i < 20; i++) {
        counts.set(i, 0);
    }

    data.forEach(element => {
        let funcValue = inputFunc(element);
        if (!(counts.has(funcValue))) {
            counts.set(funcValue, 0);
            maxValue = Math.max(funcValue, maxValue);
        }
        let seenSoFar = counts.get(funcValue);
        counts.set(funcValue, seenSoFar + 1);
    });

    // Make sure a value is in each one.
    for (let i = 0; i < maxValue + 1; i++) {
        if (!counts.has(i)) {
            counts.set(i, 0);
        }
    }
    return counts;
}

// Now graphID is going to be the overall value that we are moving too
function updateGraphId(inputFunc, data, counts) {
    const usedGraphIds = new Set();
    let prevMap = new Map();
    prevMap.set(0, 0);
    for (let i = 1; counts.has(i); i++) {
        prevMap.set(i, prevMap.get(i - 1) + counts.get(i - 1));
    }

    // Keep the graph ids in place, and mark those spots as used
    data.forEach(element => {
        let funcValue = inputFunc(element);
        const isAlreadyInPlace = (prevMap.get(funcValue) <= element.graphID
            && prevMap.get(funcValue + 1) > element.graphID);
        if (isAlreadyInPlace) {
            usedGraphIds.add(element.graphID)
        }
    });

    // 
    const proposals = new Map();
    for (let i = 0; i < counts.size; i++) {
        proposals.set(i, prevMap.get(i));
    }

    // For rest of elements, move into open location
    data.forEach(element => {
        let funcValue = inputFunc(element);
        const isAlreadyInPlace = prevMap.get(funcValue) <= element.graphID
            && prevMap.get(funcValue + 1) > element.graphID;
        if (!isAlreadyInPlace) {
            let proposedID = proposals.get(funcValue);
            console.log(proposedID);
            if (isNaN(proposedID) || proposedID === undefined) {
                throw new Error();
            }
            while (usedGraphIds.has(proposedID)) {
                proposedID++;
            }
            element.graphID = proposedID;
            proposals.set(funcValue, element.graphID + 1);
            usedGraphIds.add(element.graphID);
        }
    });
}

function movePeople(inputFunc, data, counts) {
    let prevMap = new Map();
    prevMap.set(0, 0);
    for (let i = 1; counts.has(i); i++) {
        prevMap.set(i, prevMap.get(i - 1) + counts.get(i - 1));
    }
    d3.selectAll("use")
        .data(data)
        .transition()
        .delay(function (d, i) { return Math.floor(Math.random() * 1000) })
        .duration(function (d, i) {
            let prevX = this.getAttribute("x");
            let prevY = this.getAttribute("y");
            let whole = Math.floor((d.graphID /*+ prevMap.get(inputFunc(d))*/) / numRows);
            let newX = xPadding + (whole * wBuffer);
            let remainder = (d.graphID /*+ prevMap.get(inputFunc(d))*/) % numRows;
            let newY = yPadding + (remainder * hBuffer);
            let deltaX = newX - prevX;
            let deltaY = newY - prevY;

            let delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
            return delta * 15;
        })
        .ease(d3.easeSinInOut)
        .attr("x", function (d) {
            let whole = Math.floor((d.graphID) / numRows);
            return xPadding + (whole * wBuffer);//apply the buffer and return value
        })
        .attr("y", function (d) {
            let remainder = (d.graphID) % numRows;
            return yPadding + (remainder * hBuffer);//apply the buffer and return the value
        });
};





d3.csv(dataPath, d3.autoType).then(filteredData => {
    console.log(filteredData);
    // filteredData = filteredData.slice(0,2048);
    // var formatTime = d3.time.format("%e %B");


    console.log(filteredData)
    //placeholder div for jquery slider
    d3.select("body").append("div").attr("id", "sliderDiv");



    //create svg element
    var svgDoc = d3.select("#people1").append("svg")
        .attr("viewBox", "0 0 280 280");
    // .attr("preserveAspectRatio", "xMidYMid meet");
    console.log(svgDoc);
    // d3.selectAll("people").each(function(d, i) { d.attr("id", "people" + i) });

    svgDocGlob = svgDoc;

    //define an icon store it in svg <defs> elements as a reusable component - this geometry can be generated from Inkscape, Illustrator or similar
    svgDoc.append("defs")
        .append("g")
        .attr("id", "iconCustom")
        .append("path")
        // .attr("transform", "scale(2.5)")
        .attr("d", "M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z")
    // ,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");



    //specify the number of columns and rows for pictogram layout
    numCols = 64;
    numRows = Math.floor(filteredData.length / numCols);

    //padding for the grid
    xPadding = 10;
    yPadding = 25;

    //background rectangle
    // svgDoc.append("rect").attr("width",numCols*4+2*xPadding).attr("height",numRows*8 + 2*yPadding).attr('xlink:href', 'http://simpleicon.com/wp-content/uploads/smile.png');

    //horizontal and vertical spacing between the icons
    hBuffer = 8;
    wBuffer = 4;

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
    let pictoLayer = svgDoc.append("g").attr("id", "pictoLayer");

    // Draw a rect behind the icons (will set width after icons are drawn)
    svgDoc.selectAll("#pictoLayer")
        .append("rect")
        .attr("id", "iconRect")
        .attr("opacity", "0");

    pictoLayer
        .selectAll("use")
        .data(filteredData)
        .enter()
        .append("use")
        .attr("xlink:href", "#iconCustom")
        .attr("id", function (d) {
            d.graphID = d["V0001B: Respondent ID"] - 1;
            return "icon" + (d["V0001B: Respondent ID"] - 1);
        })
        .attr("class", "personIcon")
        .attr("x", function (d) {
            var whole = Math.floor((d["V0001B: Respondent ID"] - 1) / numRows)
            var remainder = (d["V0001B: Respondent ID"] - 1) % numCols;//calculates the x position (column number) using modulus
            return xPadding + (whole * wBuffer);//apply the buffer and return value
        })
        .attr("y", function (d) {
            var remainder = (d["V0001B: Respondent ID"] - 1) % numRows;
            var whole = Math.floor((d["V0001B: Respondent ID"] - 1) / numCols)//calculates the y position (row number)
            return yPadding + (remainder * hBuffer);//apply the buffer and return the value
        })
        .attr("fill", "#D3D3D3");

    let groupElement = document.querySelector('#pictoLayer');
    let rectBBox = document.querySelector('#iconRect');

    // Set the rect to the size of the bounding box with all the icons
    let bboxGroup = groupElement.getBBox();
    rectBBox.setAttribute('x', bboxGroup.x);
    rectBBox.setAttribute('y', bboxGroup.y);
    rectBBox.setAttribute('width', bboxGroup.width);
    rectBBox.setAttribute('height', bboxGroup.height);

    // Update tooltip value on the icons
    svgDoc.selectAll("use").on('mouseover', function (event, d) {
        if (currentSelectionFunction !== undefined) {
            if (prevTooltip !== funcMaps.get(currentSelectionFunction)(d)) {
                tooltip.select('.label').html(funcMaps.get(currentSelectionFunction)(d));
                tooltip.style('display', 'block');
                prevTooltip = funcMaps.get(currentSelectionFunction)(d);
            };
            tooltip.style("left", (event.clientX + 10) + "px")
                .style("top", (event.clientY + 10) + "px");
        }
    });

    // Update the position and remove based on the size of the g (which has an invisible rectangle behind it)
    pictoLayer.on("mousemove", function (event) {
        tooltip.style("left", (event.clientX + 10) + "px")
            .style("top", (event.clientY + 10) + "px");
    });
    pictoLayer.on('mouseleave', function (event) {
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
    function move() {
        let counts = getCounts(currentSelectionFunction, filteredData);
        updateGraphId(currentSelectionFunction, filteredData, counts);
        drawLabels(currentLabelData, counts);
        movePeople(currentSelectionFunction, filteredData, counts);
    }

    let moveButton = document.getElementById('move-button');
    moveButton.addEventListener('click', function () {
        console.log("clicked move button");
        if (currentSelectionFunction === undefined) {
            console.log("no selection yet");
            return;
        }
        let counts = getCounts(currentSelectionFunction, filteredData);
        updateGraphId(currentSelectionFunction, filteredData, counts);
        drawLabels(currentLabelData, counts);
        movePeople(currentSelectionFunction, filteredData, counts);
    });

    let people = document.getElementById('people1');
    people.addEventListener("colorgender", function () {
        console.log("test gender");
        currentSelectionFunction = lambdaByGender;
        currentLabelData = labelsGender;

        colorPeople(filteredData, currentSelectionFunction);
    });

    people.addEventListener("movegender", function () {
        console.log("test move gender");
        move();
    });

    people.addEventListener("colorage", function () {
        console.log("test age");
        currentSelectionFunction = lambdaByAgeAlc;
        colorPeople(filteredData, currentSelectionFunction);
    });

    people.addEventListener("moveage", function () {
        console.log("test move gender");
        move();
    });

    let genderButton = document.getElementById('gender-button');
    genderButton.addEventListener('click', function () {
        console.log("clicked gender button");
        currentSelectionFunction = lambdaByGender;
        currentLabelData = labelsGender;

        colorPeople(filteredData, currentSelectionFunction);
    });

    let ageDrinkButton = document.getElementById('age-drink-button');
    ageDrinkButton.addEventListener('click', function () {
        console.log("clicked drink button");
        currentSelectionFunction = lambdaByAgeAlc;
        colorPeople(filteredData, currentSelectionFunction);
    });

    let offenseButton = document.getElementById('offense-type-button');
    offenseButton.addEventListener('click', function () {
        console.log("clicked offense button");
        currentLabelData = labelsOffenseMap
        currentSelectionFunction = lambdaByOffenseType;
        colorPeople(filteredData, currentSelectionFunction);
    });

});

function colorPeople(data, lambdaFunc) {
    d3.selectAll("use")
        .data(data)
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .attr("fill", d => returnClass(lambdaFunc, d));
}

let colorScale = d3.scaleOrdinal(d3.schemeTableau10);
function returnClass(lambdafunc, d) {
    return colorScale(lambdafunc(d));
    // if (d["RV0005: Sex"] == "2"){
    //     colorScale(d)
    //     return "#BADA55";
    // }
    // return "#a7a59b";
}
function getColorOfHash(hashValue) {
    return colorScale(hashValue);
}

