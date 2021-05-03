const offenseColumn = "RV0036: Controlling Offense Category - 13";

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
    // switch (lambdaByDrugOffense(d[offenseColumn])) {
    //     case 1:
    //         return "Drug";
    //     case 2:
    //         return "Other";
    //     default:
    //         console.log("BROKEN offense type");
    //         return "No Offense Type Given";
    //     // code block
    // }
}

const labelsDrugOffenseMap =
    [
        {
            hashValue: 0,
            meaning: "Drug",
            color:"#ff7722ff"
        },
        {
            hashValue: 1,
            meaning: "Other",
            color: "#60935dff"
        }
    ];

export {drugOffenseMapFunc, labelsDrugOffenseMap, lambdaByDrugOffense};