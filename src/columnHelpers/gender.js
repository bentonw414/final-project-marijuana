const genderColumn = "RV0005: Sex";
const genderMaleValue = 1;
const genderFemaleValue = 2;
var colors = ["#5081B9","#F58B51", "#60815F", "#54F2F2", "#0B847A","#ffc800","#4B5C6C","#e84855", "#5b5f97","#e6e18f"];


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
            meaning: "Male",
            color: colors[4]
        },
        {
            hashValue: 1,
            meaning: "Female",
            color:colors[5]
        },
        {
            hashValue: 2, 
            meaning: "Other",
            color:colors[8]
        }
    ];

const genderMapFunc = function (d) {
    if (d[genderColumn] === genderMaleValue) {
        return "Male";
    } else if (d[genderColumn] === genderFemaleValue) {
        return "Female";
    } else {
        return "Other";
    }
};

export {lambdaByGender, labelsGender, genderMapFunc};