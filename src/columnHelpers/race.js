const raceColumn = "RV0003: Race";
var colors = ["#60815F", "#54F2F2","#5081B9","#F58B51", "#0B847A","#ffc800","#4B5C6C","#e84855", "#5b5f97","#e6e18f"];


const labelsRaceMap =
    [
        {
            hashValue: 0,
            meaning: "White",
            color: colors[4]
        },
        {
            hashValue: 1,
            meaning: "Black", 
            color: colors[7]
        },
        {
            //4
            hashValue: 2,
            meaning: "Asian/Pacif. Islander", 
            color: colors[8]
        },
        {
            //2
            hashValue: 3,
            meaning: "Hispanic", 
            color: colors[9]
        },
        {
            //3
            hashValue: 4,
            meaning: "American Indian/Alaska Native", 
            color: colors[0]
        },
        {
            hashValue: 5,
            meaning: "Mixed", 
            color: colors[3]
        },
        {
            hashValue: 6,
            meaning: "Other/Unknown", 
            color: colors[2]
        },
    ];


const lambdaByRace = function (d) {
    let raceCategory = d[raceColumn];
    if (raceCategory === 3){
        return 3;
    }
    if (raceCategory === 4){
        return 4;
    }
    if (raceCategory === 5){
        return 2;
    }
    if (raceCategory >= 1 && raceCategory <= 6){
      return raceCategory - 1;
    }
    return 6;
}



const raceMapFunc = function (d) {
        const hashValue = lambdaByRace(d);
        return labelsRaceMap[hashValue].meaning;
}



export {raceMapFunc, labelsRaceMap, lambdaByRace};