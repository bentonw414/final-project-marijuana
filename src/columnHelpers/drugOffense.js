const offenseColumn = "RV0036: Controlling Offense Category - 13";
var colors = ["#5081B9","#F58B51", "#60815F", "#54F2F2", "#0B847A","#ffc800","#4B5C6C","#e84855", "#5b5f97","#e6e18f"];

const lambdaByDrugOffense = function (d) {
    let offenseType = d[offenseColumn];
    if (offenseType === 8 ||offenseType === 9 || offenseType === 10){
        return 0;
    }
    return 1;
}



const drugOffenseMapFunc = function (d) {
    const hashValue = lambdaByDrugOffense(d);
    return labelsDrugOffenseMap[hashValue].meaning;
}

const labelsDrugOffenseMap =
    [
        {
            hashValue: 0,
            meaning: "Drug",
            color:colors[7]
        },
        {
            hashValue: 1,
            meaning: "Other",
            color: colors[6]
        }
    ];

export {drugOffenseMapFunc, labelsDrugOffenseMap, lambdaByDrugOffense};