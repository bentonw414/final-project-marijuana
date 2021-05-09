const offenseColumn = "RV0036: Controlling Offense Category - 13";
var colors = ["#60815F", "#54F2F2","#5081B9","#F58B51", "#0B847A","#ffc800","#4B5C6C","#e84855", "#5b5f97","#e6e18f"];


const labelsOffenseMap =
    [
        {
            hashValue: 0,
            meaning: "Drug",
            color: colors[7]
        },
        {
            hashValue: 1,
            meaning: "Homicide", 
            color: colors[6]
        },
        {
            hashValue: 2,
            meaning: "Rape/Sexual Assault", 
            color: colors[1]
        },
        {
            hashValue: 3,
            meaning: "Robbery", 
            color: colors[0]
        },
        {
            hashValue: 4,
            meaning: "Assault", 
            color: colors[3]
        },
        {
            hashValue: 5,
            meaning: "Other Violent", 
            color: colors[2]
        },
        {
            hashValue: 6,
            meaning: "Burglary", 
            color: colors[5]
        },
        {
            hashValue: 7,
            meaning: "Other Property", 
            color: colors[4]
        },
        {
            hashValue: 8,
            meaning: "Weapons", 
            color: colors[9]
        },
        {
            hashValue: 9,
            meaning: "No Offense Type Given", 
            color: colors[8]
        },
    ];


const lambdaByOffenseType = function (d) {
    let offenseType = d[offenseColumn];
    if (offenseType === 8 || offenseType === 9 || offenseType === 10){
        return 0;
    }
    offenseType += 1;
    if (offenseType > 12 || offenseType < 1) {
        return 1;
    }
    
    if (offenseType > 10){
        return offenseType -3;
    }
    return offenseType;
}



const offenseMapFunc = function (d) {
    // switch (lambdaByOffenseType(d[offenseColumn])) {
        // case 1:
        //     return "Homicide";
        // case 2:
        //     return "Rape/Sexual Assault";
        // case 3:
        //     return "Robbery";
        // case 4:
        //     return "Assault";
        // case 5:
        //     return "Other Violent";
        // case 6:
        //     return "Burglary";
        // case 7:
        //     return "Other Property";
        // case 8:
        //     return "Drug";
        // case 9:
        //     return "Weapons";
        // case 10:
        //     return "Other Public Order";
        // case 11:
        //     return "Other Unspecified";
        // default:
        //     console.log("BROKEN offense type");
        //     return "No Offense Type Given";
        // // code block
        const hashValue = lambdaByOffenseType(d);
        return labelsOffenseMap[hashValue].meaning;
}



export {offenseMapFunc, labelsOffenseMap, lambdaByOffenseType};