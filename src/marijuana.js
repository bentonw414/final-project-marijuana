import {lambdaByGender, labelsGender, genderMapFunc} from "./columnHelpers/gender.js";
import {lambdaByAgeAlc, alcMapFunc} from "./columnHelpers/ageAlc.js";
import {lambdaByOffenseType, labelsOffenseMap, offenseMapFunc} from "./columnHelpers/offense.js";
import {lambdaByDrugOffense, labelsDrugOffenseMap, drugOffenseMapFunc} from "./columnHelpers/drugOffense.js";
import { labelsUSPrison, lambdaByUSPrison, usPrisonMapFunc } from "./columnHelpers/usprison.js";
// import { labelsLAPrison, lambdaByLAPrison, laPrisonMapFunc } from "./columnHelpers/laprison.js";
import { labelsMarijuana, lambdaByMarijuana, marijuanaMapFunc } from "./columnHelpers/invweed.js";

const columnstart = "percent ";
const columnend = " in prison";

const lambdaByLAPrison = function (d) {
    return 1 - d[columnstart + state + columnend];
};

const labelsLAPrison = [
    {
        hashValue: 0,
        meaning: "In Prison",
        color: "#1ec296"
    },
    {
        hashValue: 1,
        meaning: "Not In Prison",
        color: "#94386eff"
    }
];

const laPrisonMapFunc = function (d) {
    // column_name = column.format(state)
    const hashValue = lambdaByLAPrison(d);
    return labelsLAPrison[hashValue].meaning;
};


const dataPath = "../data/compileddata.csv";

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
var state = "Louisiana";


var funcMaps = new Map();
funcMaps.set(lambdaByGender, genderMapFunc);
funcMaps.set(lambdaByAgeAlc, alcMapFunc);
funcMaps.set(lambdaByOffenseType, offenseMapFunc);
funcMaps.set(lambdaByDrugOffense, drugOffenseMapFunc);
funcMaps.set(lambdaByUSPrison, usPrisonMapFunc);
funcMaps.set(lambdaByLAPrison, laPrisonMapFunc);
funcMaps.set(lambdaByMarijuana, marijuanaMapFunc);

// Takes in a function, and gives each data point a "graphid" (id within category)
// Returns a map of counts for each category
// Input func maps a data point to a category value integer 0 - n categories - 1
function getCountsAndUpdateGraphId(inputFunc, data) {
    var maxValue = -1;
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
    let xValue = xPadding + (centerHumans * wBuffer) + 4; // stolen from function for drawing little people.
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
    const newMapping = new Array();
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
                .attr("font-size", "7px")
                .attr("font-weight", "bold")
                .attr("x", 0),
            update => update,
            exit => exit.transition("labelsFade").duration(1000).ease(d3.easeSinInOut).attr("opacity", 0).remove()
        )
        .attr("class", "labelsText")
        .transition("labelsFade")
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
                .attr("font-size", "7px")
                .attr("x", 0)
                .transition("labelsFade") // same as before so interrupts fade in if we try to fade out.
                .duration(1000)
                .ease(d3.easeSinInOut)
                .attr("fill", function(d) {
                    if (d.color === undefined){
                        return getColorOfHash(d.hashValue);
                    }
                    return d.color;
                }
                )
                .attr("opacity", 1)
                .text(d => d.meaning);
        })
        .duration(1000)
        .ease(d3.easeSinInOut)
        .attr("opacity", function(d) {
            let xValue = getTextX(counts, prevMap, d);
            let transform = this.getAttribute("transform");
            let regex = /[0-9]+/
            let oldX = Number(transform.match(regex)[0]);

            if (oldX === NaN){
                console.log("something went wrong with parsing transform");
                return "0";
            }

            let oldText = this.textContent;
            let newText = d.meaning;
            console.log(oldText, newText, xValue, oldX);


            // If the label doesn't move and has same value, don't fade out.
            if (oldX === xValue && 
                oldText === newText && oldText !== undefined){
                return "1";
            }
            return "0";
        }
        );
}

function getCounts(inputFunc, data) {
    var maxValue = -1;
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
        .transition("peopleMoveTransition")
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
    // filteredData = filteredData.slice(0,2048);
    // var formatTime = d3.time.format("%e %B");


    console.log(filteredData)
    //placeholder div for jquery slider
    d3.select("body").append("div").attr("id", "sliderDiv");



    //create svg element
    var svgDoc = d3.select("#people1").append("svg")
        .attr("viewBox", "0 0 280 280");
    // .attr("preserveAspectRatio", "xMidYMid meet");
    // console.log(svgDoc);
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
    yPadding = 35;

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
        .attr("fill", "black");

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
        colorPeople(filteredData, currentSelectionFunction);
        // setTimeout(function(){
        //     //do what you need here
            movePeople(currentSelectionFunction, filteredData, counts);
        // }, 500);
        
    }

    function color(){
        let counts = getCounts(currentSelectionFunction, filteredData);
        drawLabels(currentLabelData, counts);
        colorPeople(filteredData, currentSelectionFunction);
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
        color();
    });

    people.addEventListener("movegender", function () {
        console.log("test move gender");
        move();
    });

    people.addEventListener("colorage", function () {
        console.log("test age");
        currentSelectionFunction = lambdaByAgeAlc;
        color();
    });

    people.addEventListener("moveage", function () {
        console.log("test move gender");
        move();
    });

    people.addEventListener("colorusprison", function(){
        console.log("test us prison");
        currentSelectionFunction = lambdaByUSPrison;
        currentLabelData = labelsUSPrison;
        color();
    });

    people.addEventListener("moveusprison", function(){
        console.log("test us prison move");
        currentSelectionFunction = lambdaByUSPrison;
        currentLabelData = labelsUSPrison;
        move();
    });

    people.addEventListener("colorlaprison", function(){
        console.log("test la prison");
        currentSelectionFunction = lambdaByLAPrison;
        currentLabelData = labelsLAPrison;
        color();
    });

    people.addEventListener("movelaprison", function(){
        console.log("test la prison move");
        currentSelectionFunction = lambdaByLAPrison;
        currentLabelData = labelsLAPrison;
        
        move();
    });
    people.addEventListener("colordrugoffense", function(){
        console.log("test offense");
        currentSelectionFunction = lambdaByDrugOffense;
        currentLabelData = labelsDrugOffenseMap;
        color();
    });

    people.addEventListener("movedrugoffense", function(){
        console.log("test offense move");
        currentSelectionFunction = lambdaByDrugOffense;
        currentLabelData = labelsDrugOffenseMap;
        move();
    });

    people.addEventListener("coloroffense", function(){
        console.log("test offense");
        currentSelectionFunction = lambdaByOffenseType;
        currentLabelData = labelsOffenseMap;
        color();
    });

    people.addEventListener("moveoffense", function(){
        console.log("test offense move");
        currentSelectionFunction = lambdaByOffenseType;
        currentLabelData = labelsOffenseMap;
        move();
    });

    people.addEventListener("colormarijuana", function(){
        currentSelectionFunction = lambdaByMarijuana;
        currentLabelData = labelsMarijuana;
        color();
    });

    people.addEventListener("movemarijuana", function(){
        console.log("test offense move");
        currentSelectionFunction = lambdaByMarijuana;
        currentLabelData = labelsMarijuana;
        move();
    });

    people.addEventListener("initialpeople", function(){
        pictoLayer.selectAll(".personIcon")
        .transition("peopleFadeOutInitial")
        .duration(400)
        .ease(d3.easeSinInOut)
        .attr("fill", "black")
        .attr("opacity", "0");
        svgDocGlob.selectAll('.labelsText')
        .transition("labelsFade")
        .duration(400)
        .ease(d3.easeSinInOut)
        .attr("fill", "black")
        .attr("opacity", "0")
        .end().then(
            function() {console.log("hiding");
            document.getElementById("chart").style.visibility = "hidden";}
        );

    });

    people.addEventListener("secondpeople", function(){
        console.log("making visible");
        document.getElementById("chart").style.visibility = "visible";
        pictoLayer.selectAll(".personIcon")
        .transition("peopleFadeInInitial")
        .duration(400)
        .ease(d3.easeSinInOut)
        .attr("opacity", "1")
        .attr("fill", "#D3D3D3");

        svgDocGlob.selectAll('.labelsText')
        .transition("labelsFade")
        .duration(400)
        .ease(d3.easeSinInOut)
        .attr("fill", "#ffffff00")
        .attr("opacity", "1");
        currentSelectionFunction = undefined;
    });

    let genderButton = document.getElementById('gender-button');
    genderButton.addEventListener('click', function () {
        console.log("clicked gender button");
        currentSelectionFunction = lambdaByGender;
        currentLabelData = labelsGender;

        colorPeople(filteredData, currentSelectionFunction);
    });

    // let ageDrinkButton = document.getElementById('age-drink-button');
    // ageDrinkButton.addEventListener('click', function () {
    //     console.log("clicked drink button");
    //     currentSelectionFunction = lambdaByAgeAlc;
    //     colorPeople(filteredData, currentSelectionFunction);
    // });

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
        .transition("peopleColorTransition")
        .duration(400)
        .ease(d3.easeLinear)
        .attr("fill", d => returnClass(lambdaFunc, d));
}
var colors = ["#7465a4","#f4c95d", "#d9596e","#1ec296","#d64933","#3881bc","#94386e","#8B795E","#ff7722","#60935d"]
;
let colorScale = d3.scaleOrdinal(colors);
function returnClass(lambdafunc, d) {
    let hashValue = lambdafunc(d);
    if (currentLabelData !== undefined &&
        0<= hashValue < currentLabelData.length &&
        currentLabelData[hashValue] !== undefined &&
        currentLabelData[hashValue].color !== undefined){

        return currentLabelData[hashValue].color;
    }
    return colorScale(lambdafunc(d));
}
function getColorOfHash(hashValue) {
    if (currentLabelData !== undefined &&
        0<= hashValue < currentLabelData.length &&
        currentLabelData[hashValue] !== undefined &&
        currentLabelData[hashValue].color !== undefined){

        return currentLabelData[hashValue].color;
    }
    return colorScale(hashValue);
}

