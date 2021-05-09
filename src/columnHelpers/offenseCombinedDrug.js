const offenseColumn = "RV0036: Controlling Offense Category - 13";

const lambdaByOffenseType = function (d) {
    let offenseType = d[offenseColumn];
    if (offenseType > 13 || offenseType < 1) {
        return 0;
    }
    if (offenseType === 9 || offenseType === 10){
        return 8;
    }
    if (offenseType > 10){
        return offenseType -2;
    }
    return offenseType;
}



const offenseMapFunc = function (d) {
    switch (lambdaByOffenseType(d[offenseColumn])) {
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
            return "Drug";
        case 9:
            return "Weapons";
        case 10:
            return "Other Public Order";
        case 11:
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
            meaning: "Drug"
        },
        {
            hashValue: 9,
            meaning: "Weapons"
        },
        {
            hashValue: 10,
            meaning: "Other Public Order"
        },
        {
            hashValue: 11,
            meaning: "Other Unspecified"
        }
    ];

export {offenseMapFunc, labelsOffenseMap, lambdaByOffenseType};