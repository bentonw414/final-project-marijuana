const offenseColumn = "RV0036: Controlling Offense Category - 13";
var colors = ["#7465a4","#f4c95d", "#ff7722ff","#1ec296","#d64933","#8B795E","#3881bc","#94386e","#60935d"];

const labelsOffenseMap =
    [
        {
            hashValue: 0,
            meaning: "Drug",
            color: "#d9596eff"
        },
        {
            hashValue: 1,
            meaning: "No Offense Type Given", 
            color: colors[0]
        },
        {
            hashValue: 2,
            meaning: "Homicide", 
            color: colors[1]
        },
        {
            hashValue: 3,
            meaning: "Rape/Sexual Assault", 
            color: colors[2]
        },
        {
            hashValue: 4,
            meaning: "Robbery", 
            color: colors[3]
        },
        {
            hashValue: 5,
            meaning: "Assault", 
            color: colors[4]
        },
        {
            hashValue: 6,
            meaning: "Other Violent", 
            color: colors[5]
        },
        {
            hashValue: 7,
            meaning: "Burglary", 
            color: colors[6]
        },
        {
            hashValue: 8,
            meaning: "Other Property", 
            color: colors[7]
        },
        {
            hashValue: 9,
            meaning: "Weapons", 
            color: colors[8]
        },
        {
            hashValue: 10,
            meaning: "Other Public Order", 
            color: colors[0]
        }
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